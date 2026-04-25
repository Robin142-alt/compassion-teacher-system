const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const vm = require("node:vm");

const dotenv = require("dotenv");
const { Pool } = require("pg");

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 4173);
const APP_FILE = path.join(ROOT, "app.js");
const DATA_DIR = path.join(ROOT, "data");
const STATE_FILE = path.join(DATA_DIR, "state.json");
const SESSION_COOKIE = "huruma_session";

dotenv.config({ path: path.join(ROOT, ".env.local") });
dotenv.config({ path: path.join(ROOT, ".env") });

const DATABASE_URL = process.env.DATABASE_URL || "";
const SESSION_SECRET = process.env.SESSION_SECRET || "huruma-local-session-secret";

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

const DEMO_ACCESS_CODES = {
  "usr-grace": "2401",
  "usr-joseph": "2402",
  "usr-anne": "2403",
  "usr-ruth": "2404",
};

const AUDIT_PREVIEW_LIMIT = 14;

const ROLE_CAPABILITIES = {
  teacher: {
    canViewAllClasses: false,
    canViewInsights: false,
    canManageReferrals: true,
    canViewSensitiveCases: false,
    canViewCaregiverPhone: true,
    canEditOperationalData: true,
    canResetDemo: false,
    canViewAudit: false,
  },
  fcp_lead: {
    canViewAllClasses: true,
    canViewInsights: true,
    canManageReferrals: true,
    canViewSensitiveCases: true,
    canViewCaregiverPhone: true,
    canEditOperationalData: true,
    canResetDemo: true,
    canViewAudit: true,
  },
  safeguarding_lead: {
    canViewAllClasses: true,
    canViewInsights: true,
    canManageReferrals: true,
    canViewSensitiveCases: true,
    canViewCaregiverPhone: true,
    canEditOperationalData: true,
    canResetDemo: true,
    canViewAudit: true,
  },
  education_coordinator: {
    canViewAllClasses: true,
    canViewInsights: true,
    canManageReferrals: false,
    canViewSensitiveCases: false,
    canViewCaregiverPhone: false,
    canEditOperationalData: false,
    canResetDemo: true,
    canViewAudit: true,
  },
  guest: {
    canViewAllClasses: false,
    canViewInsights: false,
    canManageReferrals: false,
    canViewSensitiveCases: false,
    canViewCaregiverPhone: false,
    canEditOperationalData: false,
    canResetDemo: false,
    canViewAudit: false,
  },
};

let persistence = null;
let persistencePromise = null;

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Huruma failed to start:", error);
    process.exitCode = 1;
  });
}

async function startServer() {
  const activePersistence = await ensurePersistence();

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);

      if (url.pathname.startsWith("/api/")) {
        await handleApi(req, res, url);
        return;
      }

      serveStatic(req, res, url);
    } catch (error) {
      sendJson(res, 500, {
        ok: false,
        error: "Internal server error",
        detail: error.message,
      });
    }
  });

  server.listen(PORT, () => {
    console.log(`Huruma TeacherHub running at http://localhost:${PORT}`);
    console.log(`Persistence mode: ${activePersistence.kind}`);
  });
}

async function ensurePersistence() {
  if (persistence) {
    return persistence;
  }

  if (!persistencePromise) {
    persistencePromise = createPersistence()
      .then((instance) => {
        persistence = instance;
        return instance;
      })
      .catch((error) => {
        persistencePromise = null;
        throw error;
      });
  }

  return persistencePromise;
}

async function handleVercelRequest(req, res) {
  try {
    await ensurePersistence();
    const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const url = new URL(req.url, `${protocol}://${host}`);
    await handleApi(req, res, url);
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      error: "Internal server error",
      detail: error.message,
    });
  }
}

async function createPersistence() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const seedState = normalizeSeedState(extractSeedState());

  if (!DATABASE_URL) {
    console.warn("DATABASE_URL not set. Falling back to file-backed persistence.");
    return createFilePersistence(seedState, "missing_database_url");
  }

  try {
    const pool = new Pool({
      connectionString: DATABASE_URL,
      enableChannelBinding: true,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    await pool.query("select 1");
    await ensurePostgresSchema(pool);

    const relationalReady = await hasRelationalData(pool);
    if (!relationalReady) {
      const sourceState = await loadLegacyOrSeedState(pool, seedState);
      await syncStateToRelational(pool, normalizeSeedState(sourceState), "system-bootstrap", "relational bootstrap");
    } else {
      const currentState = await readStateFromRelational(pool, seedState);
      const upgradedState = upgradeStateForCurrentBuild(currentState, seedState);
      if (JSON.stringify(currentState) !== JSON.stringify(upgradedState)) {
        await syncStateToRelational(pool, upgradedState, "system-upgrade", "state shape upgrade");
      }
    }

    return {
      kind: "postgres",
      reason: "DATABASE_URL connected successfully",
      readState: async () => readStateFromRelational(pool, seedState),
      writeState: async (state, actorId = "system", reason = "State updated") =>
        syncStateToRelational(pool, normalizeSeedState(state), actorId, reason),
      resetState: async (actorId = "system") => {
        const fresh = normalizeSeedState(seedState);
        await syncStateToRelational(pool, fresh, actorId, "state reset");
        return fresh;
      },
      logAudit: async (actorId, action, detail = {}) => {
        await logAudit(pool, actorId, action, detail);
      },
      readAuditLog: async (limit = AUDIT_PREVIEW_LIMIT) => readAuditLog(pool, limit),
      getAuthOptions: async () => {
        const users = await readUsersWithAssignments(pool);
        return users.map(toAuthOption);
      },
      authenticateUser: async (credentials = {}) => authenticateUser(pool, credentials),
      getUserById: async (userId) => (userId ? readUserById(pool, userId) : null),
    };
  } catch (error) {
    console.warn("PostgreSQL connection failed. Falling back to file-backed persistence.");
    console.warn(error.message);
    return createFilePersistence(seedState, "database_connection_failed");
  }
}

function createFilePersistence(seedState, reason) {
  if (!fs.existsSync(STATE_FILE)) {
    fs.writeFileSync(STATE_FILE, JSON.stringify(seedState, null, 2));
  }

  return {
    kind: "file",
    reason,
    readState: async () => JSON.parse(fs.readFileSync(STATE_FILE, "utf8")),
    writeState: async (state) => {
      fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
    },
    resetState: async () => {
      fs.writeFileSync(STATE_FILE, JSON.stringify(seedState, null, 2));
      return seedState;
    },
    logAudit: async () => {},
    readAuditLog: async () => [],
    getAuthOptions: async () => seedState.users.map(toAuthOption),
    authenticateUser: async (credentials = {}) => {
      if (credentials.userId) {
        return seedState.users.find((user) => user.id === credentials.userId) || null;
      }

      const matched = seedState.users.find((user) => user.username === credentials.username);
      if (!matched) return null;
      return DEMO_ACCESS_CODES[matched.id] === credentials.passcode ? matched : null;
    },
    getUserById: async (userId) => seedState.users.find((user) => user.id === userId) || null,
  };
}

async function ensurePostgresSchema(pool) {
  await pool.query(`
    create table if not exists huruma_state (
      scope text primary key,
      state jsonb not null,
      updated_at timestamptz not null default now(),
      updated_by text
    );
  `);

  await pool.query(`
    create table if not exists huruma_audit_log (
      id bigserial primary key,
      actor_id text,
      action text not null,
      detail jsonb not null default '{}'::jsonb,
      created_at timestamptz not null default now()
    );
  `);

  await pool.query(`
    create table if not exists huruma_meta (
      key text primary key,
      value jsonb not null
    );
  `);

  await pool.query(`
    create table if not exists huruma_users (
      id text primary key,
      name text not null,
      username text not null unique,
      role text not null,
      context text not null,
      focus text not null,
      passcode_hash text not null,
      created_at timestamptz not null default now()
    );
  `);

  await pool.query(`
    create table if not exists huruma_classes (
      id text primary key,
      name text not null,
      age_band text not null,
      session text not null,
      location text not null,
      focus text not null,
      device_mode text not null,
      headline text not null,
      cbc_strands jsonb not null default '[]'::jsonb
    );
  `);

  await pool.query(`
    create table if not exists huruma_user_class_assignments (
      user_id text not null references huruma_users(id) on delete cascade,
      class_id text not null references huruma_classes(id) on delete cascade,
      primary key (user_id, class_id)
    );
  `);

  await pool.query(`
    create table if not exists huruma_learners (
      id text primary key,
      class_id text not null references huruma_classes(id) on delete cascade,
      name text not null,
      age integer not null,
      gender text not null,
      attendance_status text not null,
      attendance_rate integer not null,
      wellbeing integer not null,
      last_contact text not null,
      caregiver_name text not null,
      caregiver_phone text not null,
      strengths jsonb not null default '[]'::jsonb,
      needs jsonb not null default '[]'::jsonb,
      competencies jsonb not null default '{}'::jsonb,
      flags jsonb not null default '[]'::jsonb,
      concern text not null,
      next_step text not null,
      county text not null,
      risk_level integer not null
    );
  `);

  await pool.query(`
    create table if not exists huruma_notes (
      id text primary key,
      learner_id text not null references huruma_learners(id) on delete cascade,
      text text not null,
      created_at_text text not null
    );
  `);

  await pool.query(`
    create table if not exists huruma_referrals (
      id text primary key,
      learner_id text not null references huruma_learners(id) on delete cascade,
      category text not null,
      urgency text not null,
      status text not null,
      owner text not null,
      summary text not null,
      updated_at_text text not null
    );
  `);

  await pool.query(`
    create table if not exists huruma_messages (
      id text primary key,
      learner_id text not null references huruma_learners(id) on delete cascade,
      channel text not null,
      intent text not null,
      body text not null,
      status text not null,
      updated_at_text text not null
    );
  `);

  await pool.query(`
    create table if not exists huruma_lesson_plans (
      id text primary key,
      class_id text not null references huruma_classes(id) on delete cascade,
      title text not null,
      steps jsonb not null default '[]'::jsonb,
      updated_at_text text not null
    );
  `);

  await pool.query(`
    create table if not exists huruma_county_metrics (
      county text primary key,
      attendance integer not null,
      risk_load integer not null
    );
  `);
}

async function hasRelationalData(pool) {
  const result = await pool.query("select count(*)::int as count from huruma_users");
  return result.rows[0]?.count > 0;
}

async function loadLegacyOrSeedState(pool, seedState) {
  const result = await pool.query(
    "select state from huruma_state where scope = $1 limit 1",
    ["primary"]
  );
  return result.rows[0]?.state || seedState;
}

async function syncStateToRelational(pool, state, actorId, reason) {
  await withTransaction(pool, async (client) => {
    await client.query("delete from huruma_user_class_assignments");
    await client.query("delete from huruma_notes");
    await client.query("delete from huruma_referrals");
    await client.query("delete from huruma_messages");
    await client.query("delete from huruma_lesson_plans");
    await client.query("delete from huruma_county_metrics");
    await client.query("delete from huruma_learners");
    await client.query("delete from huruma_classes");
    await client.query("delete from huruma_users");
    await client.query("delete from huruma_meta");

    await client.query(
      `
        insert into huruma_meta (key, value)
        values ($1, $2::jsonb)
      `,
      ["teacher", JSON.stringify(state.teacher || {})]
    );

    for (const user of state.users || []) {
      await client.query(
        `
          insert into huruma_users (id, name, username, role, context, focus, passcode_hash)
          values ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
          user.id,
          user.name,
          user.username,
          user.role,
          user.context,
          user.focus,
          hashPasscode(user.id, DEMO_ACCESS_CODES[user.id] || "2400"),
        ]
      );
    }

    for (const group of state.classes || []) {
      await client.query(
        `
          insert into huruma_classes (
            id, name, age_band, session, location, focus, device_mode, headline, cbc_strands
          )
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb)
        `,
        [
          group.id,
          group.name,
          group.ageBand,
          group.session,
          group.location,
          group.focus,
          group.deviceMode,
          group.headline,
          JSON.stringify(group.cbcStrands || []),
        ]
      );
    }

    for (const user of state.users || []) {
      for (const classId of user.assignedClassIds || []) {
        await client.query(
          "insert into huruma_user_class_assignments (user_id, class_id) values ($1, $2)",
          [user.id, classId]
        );
      }
    }

    for (const learner of state.learners || []) {
      await client.query(
        `
          insert into huruma_learners (
            id, class_id, name, age, gender, attendance_status, attendance_rate, wellbeing,
            last_contact, caregiver_name, caregiver_phone, strengths, needs, competencies,
            flags, concern, next_step, county, risk_level
          )
          values (
            $1, $2, $3, $4, $5, $6, $7, $8,
            $9, $10, $11, $12::jsonb, $13::jsonb, $14::jsonb,
            $15::jsonb, $16, $17, $18, $19
          )
        `,
        [
          learner.id,
          learner.classId,
          learner.name,
          learner.age,
          learner.gender,
          learner.attendanceStatus,
          learner.attendanceRate,
          learner.wellbeing,
          learner.lastContact,
          learner.caregiver.name,
          learner.caregiver.phone,
          JSON.stringify(learner.strengths || []),
          JSON.stringify(learner.needs || []),
          JSON.stringify(learner.competencies || {}),
          JSON.stringify(learner.flags || []),
          learner.concern,
          learner.nextStep,
          learner.county,
          learner.riskLevel,
        ]
      );
    }

    for (const note of state.notes || []) {
      await client.query(
        "insert into huruma_notes (id, learner_id, text, created_at_text) values ($1, $2, $3, $4)",
        [note.id, note.learnerId, note.text, note.createdAt]
      );
    }

    for (const referral of state.referrals || []) {
      await client.query(
        `
          insert into huruma_referrals (id, learner_id, category, urgency, status, owner, summary, updated_at_text)
          values ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
        [
          referral.id,
          referral.learnerId,
          referral.category,
          referral.urgency,
          referral.status,
          referral.owner,
          referral.summary,
          referral.updatedAt,
        ]
      );
    }

    for (const message of state.messages || []) {
      await client.query(
        `
          insert into huruma_messages (id, learner_id, channel, intent, body, status, updated_at_text)
          values ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
          message.id,
          message.learnerId,
          message.channel,
          message.intent,
          message.body,
          message.status,
          message.updatedAt,
        ]
      );
    }

    for (const plan of state.lessonPlans || []) {
      await client.query(
        `
          insert into huruma_lesson_plans (id, class_id, title, steps, updated_at_text)
          values ($1, $2, $3, $4::jsonb, $5)
        `,
        [plan.id, plan.classId, plan.title, JSON.stringify(plan.steps || []), plan.updatedAt]
      );
    }

    for (const metric of state.countyMetrics || []) {
      await client.query(
        `
          insert into huruma_county_metrics (county, attendance, risk_load)
          values ($1, $2, $3)
        `,
        [metric.county, metric.attendance, metric.riskLoad]
      );
    }

    await client.query(
      `
        insert into huruma_state (scope, state, updated_at, updated_by)
        values ($1, $2::jsonb, now(), $3)
        on conflict (scope)
        do update set state = excluded.state, updated_at = now(), updated_by = excluded.updated_by;
      `,
      ["primary", JSON.stringify(state), actorId]
    );
  });

  await logAudit(pool, actorId, "state_saved", { reason });
}

async function readStateFromRelational(pool, fallbackState) {
  const [teacherMeta, users, classes, learners, notes, referrals, messages, lessonPlans, countyMetrics] =
    await Promise.all([
      pool.query("select value from huruma_meta where key = $1 limit 1", ["teacher"]),
      readUsersWithAssignments(pool),
      pool.query(
        `
          select id, name, age_band as "ageBand", session, location, focus,
                 device_mode as "deviceMode", headline, cbc_strands as "cbcStrands"
          from huruma_classes
          order by id
        `
      ),
      pool.query(
        `
          select id, class_id as "classId", name, age, gender,
                 attendance_status as "attendanceStatus",
                 attendance_rate as "attendanceRate",
                 wellbeing, last_contact as "lastContact",
                 caregiver_name as "caregiverName",
                 caregiver_phone as "caregiverPhone",
                 strengths, needs, competencies, flags,
                 concern, next_step as "nextStep", county,
                 risk_level as "riskLevel"
          from huruma_learners
          order by id
        `
      ),
      pool.query("select id, learner_id as \"learnerId\", text, created_at_text as \"createdAt\" from huruma_notes order by id"),
      pool.query(
        `
          select id, learner_id as "learnerId", category, urgency, status, owner, summary,
                 updated_at_text as "updatedAt"
          from huruma_referrals
          order by id
        `
      ),
      pool.query(
        `
          select id, learner_id as "learnerId", channel, intent, body, status,
                 updated_at_text as "updatedAt"
          from huruma_messages
          order by id
        `
      ),
      pool.query(
        `
          select id, class_id as "classId", title, steps, updated_at_text as "updatedAt"
          from huruma_lesson_plans
          order by id
        `
      ),
      pool.query(
        `
          select county, attendance, risk_load as "riskLoad"
          from huruma_county_metrics
          order by county
        `
      ),
    ]);

  const state = {
    teacher: teacherMeta.rows[0]?.value || fallbackState.teacher,
    users,
    classes: classes.rows.map((row) => ({
      ...row,
      cbcStrands: row.cbcStrands || [],
    })),
    learners: learners.rows.map((row) => ({
      id: row.id,
      classId: row.classId,
      name: row.name,
      age: row.age,
      gender: row.gender,
      attendanceStatus: row.attendanceStatus,
      attendanceRate: row.attendanceRate,
      wellbeing: row.wellbeing,
      lastContact: row.lastContact,
      caregiver: {
        name: row.caregiverName,
        phone: row.caregiverPhone,
      },
      strengths: row.strengths || [],
      needs: row.needs || [],
      competencies: row.competencies || {},
      flags: row.flags || [],
      concern: row.concern,
      nextStep: row.nextStep,
      county: row.county,
      riskLevel: row.riskLevel,
    })),
    notes: notes.rows,
    referrals: referrals.rows,
    messages: messages.rows,
    lessonPlans: lessonPlans.rows.map((row) => ({
      ...row,
      steps: row.steps || [],
    })),
    countyMetrics: countyMetrics.rows,
  };

  return normalizeSeedState(state);
}

async function readUsersWithAssignments(pool) {
  const [usersResult, assignmentsResult] = await Promise.all([
    pool.query(
      "select id, name, username, role, context, focus from huruma_users order by id"
    ),
    pool.query(
      "select user_id as \"userId\", class_id as \"classId\" from huruma_user_class_assignments order by user_id, class_id"
    ),
  ]);

  const assignmentMap = new Map();
  assignmentsResult.rows.forEach((row) => {
    if (!assignmentMap.has(row.userId)) {
      assignmentMap.set(row.userId, []);
    }
    assignmentMap.get(row.userId).push(row.classId);
  });

  return usersResult.rows.map((user) => ({
    ...user,
    assignedClassIds: assignmentMap.get(user.id) || [],
  }));
}

async function readUserById(pool, userId) {
  const users = await readUsersWithAssignments(pool);
  return users.find((user) => user.id === userId) || null;
}

async function authenticateUser(pool, credentials = {}) {
  if (credentials.userId) {
    return readUserById(pool, credentials.userId);
  }

  if (!credentials.username || !credentials.passcode) {
    return null;
  }

  const result = await pool.query(
    `
      select id, name, username, role, context, focus, passcode_hash as "passcodeHash"
      from huruma_users
      where lower(username) = lower($1)
      limit 1
    `,
    [credentials.username]
  );

  const row = result.rows[0];
  if (!row) return null;

  if (hashPasscode(row.id, credentials.passcode) !== row.passcodeHash) {
    return null;
  }

  const user = await readUserById(pool, row.id);
  return user;
}

async function logAudit(pool, actorId, action, detail = {}) {
  await pool.query(
    "insert into huruma_audit_log (actor_id, action, detail) values ($1, $2, $3::jsonb)",
    [actorId || null, action, JSON.stringify(detail)]
  );
}

async function readAuditLog(pool, limit = AUDIT_PREVIEW_LIMIT) {
  const result = await pool.query(
    `
      select l.id,
             l.actor_id as "actorId",
             coalesce(u.name, 'System') as "actorName",
             coalesce(u.role, 'system') as "actorRole",
             l.action,
             l.detail,
             to_char(l.created_at at time zone 'Africa/Nairobi', 'DD Mon HH24:MI') as "createdAt"
      from huruma_audit_log l
      left join huruma_users u on u.id = l.actor_id
      order by l.created_at desc
      limit $1
    `,
    [limit]
  );

  return result.rows;
}

async function withTransaction(pool, work) {
  const client = await pool.connect();
  try {
    await client.query("begin");
    const result = await work(client);
    await client.query("commit");
    return result;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/health") {
    const viewer = await getViewer(req);
    sendJson(res, 200, {
      ok: true,
      service: "Huruma TeacherHub local API",
      persistence: persistence.kind,
      modeReason: persistence.reason,
      signedIn: Boolean(viewer),
      viewer: viewer ? summarizeViewer(viewer) : null,
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/bootstrap") {
    const viewer = await getViewer(req);
    sendJson(res, 200, {
      ok: true,
      ...(await buildSessionPayload(viewer)),
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/login") {
    const body = await readBody(req);
    const viewer = await persistence.authenticateUser(body || {});

    if (!viewer) {
      sendJson(res, 401, {
        ok: false,
        error: "Incorrect username or access code.",
      });
      return;
    }

    setSessionCookie(res, viewer.id);
    await persistence.logAudit(viewer.id, "login", {
      role: viewer.role,
      username: viewer.username,
    });
    sendJson(res, 200, {
      ok: true,
      ...(await buildSessionPayload(viewer)),
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/logout") {
    const viewer = await getViewer(req);
    clearSessionCookie(res);
    await persistence.logAudit(viewer?.id || null, "logout", {});
    sendJson(res, 200, {
      ok: true,
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/export") {
    const viewer = await getViewer(req);
    if (!viewer) {
      sendJson(res, 401, {
        ok: false,
        error: "Sign in to export workspace data.",
      });
      return;
    }

    const state = buildScopedState(await persistence.readState(), viewer);
    await persistence.logAudit(viewer.id, "export_scoped_state", {
      role: viewer.role,
    });
    sendJson(res, 200, {
      ok: true,
      state,
      viewer: summarizeViewer(viewer),
      exportedAt: new Date().toISOString(),
    });
    return;
  }

  if (req.method === "PUT" && url.pathname === "/api/state") {
    const viewer = await getViewer(req);
    if (!viewer) {
      sendJson(res, 401, {
        ok: false,
        error: "Sign in to save workspace changes.",
      });
      return;
    }

    if (!getRoleCapabilities(viewer.role).canEditOperationalData) {
      sendJson(res, 403, {
        ok: false,
        error: "This role is read-only in the workspace.",
      });
      return;
    }

    const body = await readBody(req);
    if (!body || typeof body.state !== "object") {
      sendJson(res, 400, {
        ok: false,
        error: "Invalid payload",
      });
      return;
    }

    const currentState = await persistence.readState();
    const nextState = mergeStateForViewer(currentState, body.state, viewer);
    await persistence.writeState(nextState, viewer.id, body.reason);
    sendJson(res, 200, {
      ok: true,
      savedAt: new Date().toISOString(),
      reason: body.reason || "State updated",
      ...(await buildSessionPayload(viewer, nextState)),
      persistence: persistence.kind,
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/reset") {
    const viewer = await getViewer(req);
    if (!viewer) {
      sendJson(res, 401, {
        ok: false,
        error: "Sign in to reset demo data.",
      });
      return;
    }

    if (!getRoleCapabilities(viewer.role).canResetDemo) {
      sendJson(res, 403, {
        ok: false,
        error: "This role cannot reset the shared demo workspace.",
      });
      return;
    }

    const state = await persistence.resetState(viewer.id);
    sendJson(res, 200, {
      ok: true,
      resetAt: new Date().toISOString(),
      ...(await buildSessionPayload(viewer, state)),
      persistence: persistence.kind,
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/audit") {
    const viewer = await getViewer(req);
    if (!viewer) {
      sendJson(res, 401, {
        ok: false,
        error: "Sign in to view audit activity.",
      });
      return;
    }

    if (!getRoleCapabilities(viewer.role).canViewAudit) {
      sendJson(res, 403, {
        ok: false,
        error: "This role cannot view the audit activity feed.",
      });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      auditEntries: await persistence.readAuditLog(AUDIT_PREVIEW_LIMIT),
    });
    return;
  }

  sendJson(res, 404, {
    ok: false,
    error: "Not found",
  });
}

function serveStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";

  const relativePath = pathname.replace(/^\/+/, "");
  const safePath = path.normalize(path.join(ROOT, relativePath));
  if (!safePath.startsWith(ROOT)) {
    sendText(res, 403, "Forbidden");
    return;
  }

  let filePath = safePath;
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(ROOT, "index.html");
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME_TYPES[ext] || "application/octet-stream";
  const stream = fs.createReadStream(filePath);

  res.writeHead(200, {
    "Content-Type": mime,
    "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=3600",
  });

  stream.pipe(res);
  stream.on("error", () => {
    sendText(res, 500, "File read error");
  });
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (!chunks.length) return null;

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return null;
  }
}

function extractSeedState() {
  const source = fs.readFileSync(APP_FILE, "utf8");
  const startToken = "const seedState =";
  const endToken = "const cbcOptions =";
  const start = source.indexOf(startToken);
  const end = source.indexOf(endToken);

  if (start === -1 || end === -1) {
    throw new Error("Unable to locate seed state in app.js");
  }

  const objectLiteral = source
    .slice(start + startToken.length, end)
    .trim()
    .replace(/;$/, "");

  const script = new vm.Script(`(${objectLiteral})`);
  return script.runInNewContext({});
}

function normalizeSeedState(state) {
  const users = (state.users || []).map((user) => ({
    ...user,
    username: user.username || `${user.id}@huruma.local`,
    assignedClassIds: user.assignedClassIds || [],
  }));

  return {
    teacher: state.teacher || {},
    users,
    classes: state.classes || [],
    learners: state.learners || [],
    notes: state.notes || [],
    referrals: state.referrals || [],
    messages: state.messages || [],
    lessonPlans: state.lessonPlans || [],
    countyMetrics: state.countyMetrics || [],
  };
}

function upgradeStateForCurrentBuild(state, seedState) {
  const normalized = normalizeSeedState(state);
  const seedUsersById = new Map((seedState.users || []).map((user) => [user.id, user]));

  normalized.users = normalized.users.map((user) => {
    const seedUser = seedUsersById.get(user.id);
    if (!seedUser) return user;

    const fallbackUsername = `${user.id}@huruma.local`;
    const shouldUpgradeUsername = !user.username || user.username === fallbackUsername;

    return {
      ...user,
      username: shouldUpgradeUsername ? seedUser.username || user.username : user.username,
      focus: user.focus || seedUser.focus,
      context: user.context || seedUser.context,
    };
  });

  return normalized;
}

async function buildSessionPayload(viewer, stateOverride = null) {
  const authOptions = await persistence.getAuthOptions();

  if (!viewer) {
    return {
      state: emptyState(),
      viewer: null,
      authOptions,
      auditEntries: [],
      persistence: persistence.kind,
    };
  }

  const fullState = stateOverride || (await persistence.readState());
  const auditEntries = getRoleCapabilities(viewer.role).canViewAudit
    ? await persistence.readAuditLog(AUDIT_PREVIEW_LIMIT)
    : [];

  return {
    state: buildScopedState(fullState, viewer),
    viewer: summarizeViewer(viewer),
    authOptions,
    auditEntries,
    persistence: persistence.kind,
  };
}

function buildScopedState(state, viewer) {
  const normalized = normalizeSeedState(state);
  if (!viewer) {
    return emptyState();
  }

  const capabilities = getRoleCapabilities(viewer.role);
  const visibleClassIds = getVisibleClassIdsForViewer(normalized, viewer);
  const visibleLearnerIds = getVisibleLearnerIdsForViewer(normalized, viewer, visibleClassIds);
  const safeguardingLearnerIds = getSafeguardingLearnerIds(normalized);

  return normalizeSeedState({
    teacher: normalized.teacher,
    users: [toScopedUser(viewer)],
    classes: normalized.classes.filter((group) => visibleClassIds.has(group.id)),
    learners: normalized.learners
      .filter((learner) => visibleLearnerIds.has(learner.id))
      .map((learner) => {
        const isSensitive = safeguardingLearnerIds.has(learner.id) && !capabilities.canViewSensitiveCases;
        return {
          ...cloneJson(learner),
          caregiver: {
            ...cloneJson(learner.caregiver),
            phone: capabilities.canViewCaregiverPhone
              ? learner.caregiver.phone
              : redactPhone(learner.caregiver.phone),
          },
          concern: isSensitive
            ? "Sensitive welfare concern recorded. Full detail is restricted to safeguarding-cleared staff."
            : learner.concern,
          nextStep: isSensitive
            ? "Work through the safeguarding workflow and assigned cleared staff."
            : learner.nextStep,
        };
      }),
    notes: normalized.notes
      .filter((note) => visibleLearnerIds.has(note.learnerId))
      .map((note) => {
        if (
          safeguardingLearnerIds.has(note.learnerId) &&
          !capabilities.canViewSensitiveCases
        ) {
          return {
            ...cloneJson(note),
            text: "Sensitive welfare note recorded. Full detail is limited to cleared staff.",
          };
        }
        return cloneJson(note);
      }),
    referrals: normalized.referrals
      .filter((referral) => visibleLearnerIds.has(referral.learnerId))
      .map((referral) => {
        const isSensitive =
          referral.category === "Safeguarding" && !capabilities.canViewSensitiveCases;
        return {
          ...cloneJson(referral),
          summary: isSensitive
            ? "Confidential safeguarding case. Full details are limited to cleared roles."
            : referral.summary,
        };
      }),
    messages: normalized.messages
      .filter((message) => visibleLearnerIds.has(message.learnerId))
      .map((message) => cloneJson(message)),
    lessonPlans: normalized.lessonPlans
      .filter((plan) => visibleClassIds.has(plan.classId))
      .map((plan) => cloneJson(plan)),
    countyMetrics: capabilities.canViewInsights
      ? normalized.countyMetrics.map((metric) => cloneJson(metric))
      : [],
  });
}

function mergeStateForViewer(currentState, submittedState, viewer) {
  const current = normalizeSeedState(currentState);
  const incoming = normalizeSeedState(submittedState);
  const visibleClassIds = getVisibleClassIdsForViewer(current, viewer);
  const visibleLearnerIds = getVisibleLearnerIdsForViewer(current, viewer, visibleClassIds);
  const merged = cloneJson(current);

  const incomingLearners = new Map(
    (incoming.learners || [])
      .filter((learner) => visibleLearnerIds.has(learner.id))
      .map((learner) => [learner.id, learner])
  );

  merged.learners = merged.learners.map((learner) => {
    const nextLearner = incomingLearners.get(learner.id);
    if (!nextLearner) {
      return learner;
    }

    return {
      ...learner,
      attendanceStatus: normalizeAttendanceStatus(nextLearner.attendanceStatus, learner.attendanceStatus),
    };
  });

  merged.notes = mergeNewNotes(merged.notes, incoming.notes, visibleLearnerIds);
  merged.messages = mergeNewMessages(merged.messages, incoming.messages, visibleLearnerIds);
  merged.lessonPlans = mergeLessonPlans(merged.lessonPlans, incoming.lessonPlans, visibleClassIds);

  if (getRoleCapabilities(viewer.role).canManageReferrals) {
    merged.referrals = mergeReferrals(merged.referrals, incoming.referrals, visibleLearnerIds);
  }

  return normalizeSeedState(merged);
}

function mergeNewNotes(currentNotes, submittedNotes, visibleLearnerIds) {
  const knownIds = new Set(currentNotes.map((note) => note.id));
  const additions = [];

  for (const note of submittedNotes || []) {
    const noteId = safeId(note.id);
    const learnerId = safeId(note.learnerId);
    if (!noteId || !learnerId || !visibleLearnerIds.has(learnerId) || knownIds.has(noteId)) {
      continue;
    }

    const text = safeString(note.text).trim();
    if (!text) continue;

    knownIds.add(noteId);
    additions.push({
      id: noteId,
      learnerId,
      text,
      createdAt: safeString(note.createdAt) || "Just now",
    });
  }

  return additions.length ? [...additions, ...currentNotes] : currentNotes;
}

function mergeNewMessages(currentMessages, submittedMessages, visibleLearnerIds) {
  const knownIds = new Set(currentMessages.map((message) => message.id));
  const additions = [];

  for (const message of submittedMessages || []) {
    const messageId = safeId(message.id);
    const learnerId = safeId(message.learnerId);
    if (!messageId || !learnerId || !visibleLearnerIds.has(learnerId) || knownIds.has(messageId)) {
      continue;
    }

    const body = safeString(message.body).trim();
    if (!body) continue;

    knownIds.add(messageId);
    additions.push({
      id: messageId,
      learnerId,
      channel: safeString(message.channel) || "SMS",
      intent: safeString(message.intent) || "support",
      body,
      status: safeString(message.status) || "Queued",
      updatedAt: safeString(message.updatedAt) || "Just now",
    });
  }

  return additions.length ? [...additions, ...currentMessages] : currentMessages;
}

function mergeLessonPlans(currentPlans, submittedPlans, visibleClassIds) {
  const knownIds = new Set(currentPlans.map((plan) => plan.id));
  const additions = [];

  for (const plan of submittedPlans || []) {
    const planId = safeId(plan.id);
    const classId = safeId(plan.classId);
    if (!planId || !classId || !visibleClassIds.has(classId) || knownIds.has(planId)) {
      continue;
    }

    knownIds.add(planId);
    additions.push({
      id: planId,
      classId,
      title: safeString(plan.title) || "Lesson plan",
      updatedAt: safeString(plan.updatedAt) || "Just now",
      steps: Array.isArray(plan.steps)
        ? plan.steps.map((step) => safeString(step)).filter(Boolean)
        : [],
    });
  }

  const combined = additions.length ? [...additions, ...currentPlans] : currentPlans.slice();
  return trimLessonPlansByClass(combined, 6);
}

function mergeReferrals(currentReferrals, submittedReferrals, visibleLearnerIds) {
  const merged = currentReferrals.map((referral) => ({ ...referral }));

  for (const referral of submittedReferrals || []) {
    const learnerId = safeId(referral.learnerId);
    if (!learnerId || !visibleLearnerIds.has(learnerId)) {
      continue;
    }

    const referralId = safeId(referral.id);
    if (!referralId) {
      continue;
    }

    const existingIndex = merged.findIndex((item) => item.id === referralId);
    if (existingIndex !== -1) {
      const current = merged[existingIndex];
      merged[existingIndex] = {
        ...current,
        status: normalizeReferralStatus(referral.status, current.status),
        owner: safeString(referral.owner) || current.owner,
        updatedAt: safeString(referral.updatedAt) || current.updatedAt,
      };
      continue;
    }

    const summary = safeString(referral.summary).trim();
    if (!summary) continue;

    merged.unshift({
      id: referralId,
      learnerId,
      category: safeString(referral.category) || "General Support",
      urgency: safeString(referral.urgency) || "Medium",
      status: normalizeReferralStatus(referral.status, "New"),
      owner: safeString(referral.owner) || "Pending assignment",
      summary,
      updatedAt: safeString(referral.updatedAt) || "Just now",
    });
  }

  return merged;
}

function trimLessonPlansByClass(plans, limitPerClass) {
  const counts = new Map();
  return plans.filter((plan) => {
    const nextCount = (counts.get(plan.classId) || 0) + 1;
    counts.set(plan.classId, nextCount);
    return nextCount <= limitPerClass;
  });
}

function getRoleCapabilities(role) {
  return ROLE_CAPABILITIES[role] || ROLE_CAPABILITIES.guest;
}

function getVisibleClassIdsForViewer(state, viewer) {
  const capabilities = getRoleCapabilities(viewer?.role);
  if (!viewer) {
    return new Set();
  }

  if (capabilities.canViewAllClasses) {
    return new Set((state.classes || []).map((group) => group.id));
  }

  return new Set(viewer.assignedClassIds || []);
}

function getVisibleLearnerIdsForViewer(state, viewer, visibleClassIds = null) {
  const classIds = visibleClassIds || getVisibleClassIdsForViewer(state, viewer);
  return new Set(
    (state.learners || [])
      .filter((learner) => classIds.has(learner.classId))
      .map((learner) => learner.id)
  );
}

function getSafeguardingLearnerIds(state) {
  return new Set(
    (state.referrals || [])
      .filter((referral) => referral.category === "Safeguarding")
      .map((referral) => referral.learnerId)
  );
}

function toScopedUser(viewer) {
  return {
    id: viewer.id,
    name: viewer.name,
    username: viewer.username,
    role: viewer.role,
    context: viewer.context,
    focus: viewer.focus,
    assignedClassIds: viewer.assignedClassIds || [],
  };
}

function emptyState() {
  return {
    teacher: {},
    users: [],
    classes: [],
    learners: [],
    notes: [],
    referrals: [],
    messages: [],
    lessonPlans: [],
    countyMetrics: [],
  };
}

function normalizeAttendanceStatus(status, fallback) {
  const allowed = new Set(["present", "late", "absent"]);
  return allowed.has(status) ? status : fallback;
}

function normalizeReferralStatus(status, fallback) {
  const allowed = new Set(["New", "In Follow-up", "Closed"]);
  return allowed.has(status) ? status : fallback;
}

function safeString(value) {
  return typeof value === "string" ? value : "";
}

function safeId(value) {
  return safeString(value).trim();
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function redactPhone(phone) {
  if (!phone) return "Hidden";
  return `${phone.slice(0, 7)} XXX XXX`;
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  return Object.fromEntries(
    header
      .split(";")
      .map((pair) => pair.trim())
      .filter(Boolean)
      .map((pair) => {
        const index = pair.indexOf("=");
        return [pair.slice(0, index), decodeURIComponent(pair.slice(index + 1))];
      })
  );
}

function signValue(value) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
}

function encodeSession(userId) {
  const payload = `${userId}.${Date.now()}`;
  const signature = signValue(payload);
  return Buffer.from(`${payload}.${signature}`, "utf8").toString("base64url");
}

function decodeSession(token) {
  if (!token) return null;

  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const parts = raw.split(".");
    const signature = parts.pop();
    const payload = parts.join(".");

    if (signValue(payload) !== signature) {
      return null;
    }

    return payload.split(".")[0] || null;
  } catch {
    return null;
  }
}

function setSessionCookie(res, userId) {
  const token = encodeSession(userId);
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=1209600`
  );
}

function clearSessionCookie(res) {
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
}

async function getViewer(req) {
  const cookies = parseCookies(req);
  const userId = decodeSession(cookies[SESSION_COOKIE]);
  return persistence.getUserById(userId);
}

function hashPasscode(userId, passcode) {
  return crypto.scryptSync(passcode, `huruma:${userId}`, 64).toString("hex");
}

function toAuthOption(user) {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    context: user.context,
    focus: user.focus,
    username: user.username,
    demoCode: DEMO_ACCESS_CODES[user.id] || "2400",
  };
}

function summarizeViewer(viewer) {
  return {
    id: viewer.id,
    name: viewer.name,
    username: viewer.username,
    role: viewer.role,
    context: viewer.context,
    assignedClassIds: viewer.assignedClassIds || [],
  };
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-cache",
  });
  res.end(body);
}

function sendText(res, statusCode, text) {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-cache",
  });
  res.end(text);
}

module.exports = {
  handleVercelRequest,
};
