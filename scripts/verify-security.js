const BASE_URL = "http://127.0.0.1:4173";

async function request(path, options = {}, cookie = "") {
  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  if (cookie) {
    headers.Cookie = cookie;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => null);
  return {
    response,
    payload,
    cookie: response.headers.get("set-cookie")?.split(";")[0] || "",
  };
}

function check(label, condition, detail = "") {
  return {
    label,
    ok: Boolean(condition),
    detail,
  };
}

function findLearner(state, learnerId) {
  return (state.learners || []).find((learner) => learner.id === learnerId);
}

async function main() {
  const checks = [];

  const publicBootstrap = await request("/api/bootstrap");
  checks.push(
    check(
      "Signed-out bootstrap does not expose a workspace slice",
      publicBootstrap.response.status === 200 &&
        publicBootstrap.payload?.viewer === null &&
        (publicBootstrap.payload?.state?.users || []).length === 0
    )
  );

  const publicExport = await request("/api/export");
  checks.push(
    check(
      "Signed-out export is rejected",
      publicExport.response.status === 401 &&
        publicExport.payload?.error === "Sign in to export workspace data."
    )
  );

  const graceLogin = await request(
    "/api/login",
    {
      method: "POST",
      body: JSON.stringify({
        username: "grace@huruma.local",
        passcode: "2401",
      }),
    }
  );
  const graceCookie = graceLogin.cookie;
  const graceState = graceLogin.payload?.state;

  checks.push(
    check(
      "Teacher login returns a scoped teacher workspace",
      graceLogin.response.status === 200 &&
        graceLogin.payload?.viewer?.id === "usr-grace" &&
        graceState?.users?.length === 1 &&
        graceState.users[0].id === "usr-grace"
    )
  );
  checks.push(
    check(
      "Teacher bootstrap excludes non-assigned classes and insight metrics",
      (graceState?.classes || []).every((group) => group.id !== "mentorship-circle") &&
        (graceState?.countyMetrics || []).length === 0
    )
  );
  checks.push(
    check(
      "Teacher still sees full caregiver phone on visible learners",
      findLearner(graceState, "ln-001")?.caregiver?.phone === "+254 712 600 114"
    )
  );

  const teacherSaveState = JSON.parse(JSON.stringify(graceState));
  const mercy = findLearner(teacherSaveState, "ln-001");
  if (mercy) {
    mercy.attendanceStatus = "absent";
  }
  teacherSaveState.notes.unshift({
    id: "note-security-check",
    learnerId: "ln-001",
    text: "Security verification note",
    createdAt: "Just now",
  });
  teacherSaveState.referrals.unshift({
    id: "ref-hidden-security-check",
    learnerId: "ln-012",
    category: "Home Visit",
    urgency: "High",
    status: "New",
    owner: "Injected",
    summary: "This should be ignored because the learner is outside Grace's scope.",
    updatedAt: "Just now",
  });

  const graceSave = await request(
    "/api/state",
    {
      method: "PUT",
      body: JSON.stringify({
        state: teacherSaveState,
        reason: "Security verification save",
      }),
    },
    graceCookie
  );

  checks.push(
    check(
      "Teacher can save visible attendance and notes",
      graceSave.response.status === 200 &&
        findLearner(graceSave.payload?.state, "ln-001")?.attendanceStatus === "absent" &&
        (graceSave.payload?.state?.notes || []).some((note) => note.id === "note-security-check")
    )
  );

  const ruthLogin = await request(
    "/api/login",
    {
      method: "POST",
      body: JSON.stringify({
        username: "ruth@huruma.local",
        passcode: "2404",
      }),
    }
  );
  const ruthCookie = ruthLogin.cookie;
  const ruthState = ruthLogin.payload?.state;

  checks.push(
    check(
      "Coordinator receives masked caregiver contact data",
      findLearner(ruthState, "ln-001")?.caregiver?.phone?.includes("XXX XXX")
    )
  );
  checks.push(
    check(
      "Coordinator receives redacted safeguarding learner detail",
      findLearner(ruthState, "ln-010")?.concern ===
        "Sensitive welfare concern recorded. Full detail is restricted to safeguarding-cleared staff."
    )
  );
  checks.push(
    check(
      "Coordinator can see audit entries but not hidden teacher escalation injection",
      Array.isArray(ruthLogin.payload?.auditEntries) &&
        ruthLogin.payload.auditEntries.length > 0 &&
        !(ruthState?.referrals || []).some((referral) => referral.id === "ref-hidden-security-check")
    )
  );

  const ruthWriteAttempt = await request(
    "/api/state",
    {
      method: "PUT",
      body: JSON.stringify({
        state: ruthState,
        reason: "Coordinator write attempt",
      }),
    },
    ruthCookie
  );
  checks.push(
    check(
      "Coordinator write attempts are rejected as read-only",
      ruthWriteAttempt.response.status === 403 &&
        ruthWriteAttempt.payload?.error === "This role is read-only in the workspace."
    )
  );

  const auditResponse = await request("/api/audit", {}, ruthCookie);
  checks.push(
    check(
      "Coordinator can load the audit feed explicitly",
      auditResponse.response.status === 200 &&
        Array.isArray(auditResponse.payload?.auditEntries) &&
        auditResponse.payload.auditEntries.length > 0
    )
  );

  const resetResponse = await request("/api/reset", { method: "POST" }, ruthCookie);
  checks.push(
    check(
      "Coordinator can reset the demo workspace after verification",
      resetResponse.response.status === 200 &&
        findLearner(resetResponse.payload?.state, "ln-001")?.attendanceStatus === "present"
    )
  );

  const failed = checks.filter((item) => !item.ok);
  console.log(JSON.stringify({ checks }, null, 2));

  if (failed.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
