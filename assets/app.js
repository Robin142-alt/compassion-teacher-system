const STORAGE_KEY = "huruma-teacherhub-state-v1";

const seedState = {
  teacher: {
    name: "Teacher Grace Mwende",
    context: "Kitui cluster - 3 active groups - Offline ready",
  },
  users: [
    {
      id: "usr-grace",
      name: "Grace Mwende",
      username: "grace@huruma.local",
      role: "teacher",
      context: "Kitui cluster - Grade 5 Hope and JSS 1 Courage",
      assignedClassIds: ["grade5-hope", "jss1-courage"],
      focus: "Attendance, class flow, caregiver follow-up",
    },
    {
      id: "usr-joseph",
      name: "Joseph Mutua",
      username: "joseph@huruma.local",
      role: "fcp_lead",
      context: "Kitui and Baringo partner oversight",
      assignedClassIds: ["grade5-hope", "jss1-courage", "mentorship-circle"],
      focus: "Referral movement, partner quality, caregiver escalation",
    },
    {
      id: "usr-anne",
      name: "Anne Wairimu",
      username: "anne@huruma.local",
      role: "safeguarding_lead",
      context: "National safeguarding desk",
      assignedClassIds: ["grade5-hope", "jss1-courage", "mentorship-circle"],
      focus: "Sensitive case review, safe routing, audit accountability",
    },
    {
      id: "usr-ruth",
      name: "Ruth Achieng",
      username: "ruth@huruma.local",
      role: "education_coordinator",
      context: "Regional education coordination",
      assignedClassIds: ["grade5-hope", "jss1-courage", "mentorship-circle"],
      focus: "Program quality, teacher support, county insights",
    },
  ],
  classes: [
    {
      id: "grade5-hope",
      name: "Grade 5 Hope",
      ageBand: "9-11 years",
      session: "08:30-10:00",
      location: "School block A",
      focus: "Reading confidence, collaboration, self-belief",
      deviceMode: "Shared phone + print activities",
      cbcStrands: ["English Activities", "Mathematics Activities", "Environmental Activities"],
      headline: "Reading confidence work with paired coaching and caregiver catch-up slips.",
    },
    {
      id: "jss1-courage",
      name: "JSS 1 Courage",
      ageBand: "12-14 years",
      session: "10:30-12:00",
      location: "Church learning hall",
      focus: "Problem solving, health awareness, peer voice",
      deviceMode: "Offline lesson cards + one teacher handset",
      cbcStrands: ["Integrated Science", "Mathematics", "Pre-Technical Studies"],
      headline: "Hands-on science linked to health, resilience, and reflective discussion.",
    },
    {
      id: "mentorship-circle",
      name: "Teen Mentorship Circle",
      ageBand: "15-18 years",
      session: "14:00-15:30",
      location: "FCP youth room",
      focus: "Youth agency, career readiness, safeguarding awareness",
      deviceMode: "Discussion-led, offline journals",
      cbcStrands: ["Life Skills", "Career Guidance", "Community Service Learning"],
      headline: "Mentorship circle focused on voice, purpose, and transition readiness.",
    },
  ],
  learners: [
    {
      id: "ln-001",
      name: "Mercy Naliaka",
      classId: "grade5-hope",
      age: 11,
      gender: "Girl",
      attendanceStatus: "present",
      attendanceRate: 96,
      wellbeing: 78,
      lastContact: "2 days ago",
      caregiver: { name: "Rose Naliaka", phone: "+254 712 600 114" },
      strengths: ["Expressive reading", "Peer encouragement"],
      needs: ["Menstrual health follow-up", "Quiet catch-up corner"],
      competencies: {
        literacy: 82,
        numeracy: 70,
        collaboration: 88,
        selfBelief: 67,
      },
      flags: [
        { label: "Attendance recovered", tone: "support" },
        { label: "Needs dignity pack review", tone: "accent" },
      ],
      concern:
        "Had repeated short absences last month linked to menstrual discomfort and low confidence.",
      nextStep: "Confirm reusable-pad support and assign one reading leadership task this week.",
      county: "Kitui",
      riskLevel: 2,
    },
    {
      id: "ln-002",
      name: "Brian Muteti",
      classId: "grade5-hope",
      age: 10,
      gender: "Boy",
      attendanceStatus: "late",
      attendanceRate: 89,
      wellbeing: 61,
      lastContact: "Yesterday",
      caregiver: { name: "Mutua Brian", phone: "+254 700 114 322" },
      strengths: ["Curiosity", "Mental arithmetic"],
      needs: ["Nutrition follow-up", "Morning arrival support"],
      competencies: {
        literacy: 60,
        numeracy: 86,
        collaboration: 59,
        selfBelief: 58,
      },
      flags: [
        { label: "Repeated late arrival", tone: "signal" },
        { label: "Fatigue observed", tone: "danger" },
      ],
      concern:
        "Often arrives tired and hungry. Participates well once settled but loses concentration early.",
      nextStep: "Check breakfast support and caregiver transport routine during home call.",
      county: "Kitui",
      riskLevel: 4,
    },
    {
      id: "ln-003",
      name: "Faith Achieng",
      classId: "grade5-hope",
      age: 10,
      gender: "Girl",
      attendanceStatus: "present",
      attendanceRate: 94,
      wellbeing: 84,
      lastContact: "Today",
      caregiver: { name: "Jane Achieng", phone: "+254 711 220 480" },
      strengths: ["Storytelling", "Class leadership"],
      needs: ["Stretch numeracy practice"],
      competencies: {
        literacy: 90,
        numeracy: 74,
        collaboration: 91,
        selfBelief: 87,
      },
      flags: [{ label: "Peer leader", tone: "support" }],
      concern: "No urgent concern. Ready for extension tasks and class captain opportunities.",
      nextStep: "Use as peer mentor in paired reading activity.",
      county: "Kitui",
      riskLevel: 1,
    },
    {
      id: "ln-004",
      name: "Kelvin Odhiambo",
      classId: "grade5-hope",
      age: 11,
      gender: "Boy",
      attendanceStatus: "absent",
      attendanceRate: 78,
      wellbeing: 55,
      lastContact: "5 days ago",
      caregiver: { name: "Beatrice Odhiambo", phone: "+254 718 410 909" },
      strengths: ["Drawing", "Science questions"],
      needs: ["Home visit", "Catch-up pack", "Psychosocial check-in"],
      competencies: {
        literacy: 52,
        numeracy: 58,
        collaboration: 63,
        selfBelief: 44,
      },
      flags: [
        { label: "Chronic absence", tone: "danger" },
        { label: "Caregiver unreachable", tone: "signal" },
      ],
      concern:
        "Attendance dropped sharply after a family move. Teacher has not reached caregiver this week.",
      nextStep: "Escalate to home visit through FCP lead and prepare re-entry plan.",
      county: "Kitui",
      riskLevel: 5,
    },
    {
      id: "ln-005",
      name: "Ruth Jepchirchir",
      classId: "jss1-courage",
      age: 13,
      gender: "Girl",
      attendanceStatus: "present",
      attendanceRate: 91,
      wellbeing: 73,
      lastContact: "Yesterday",
      caregiver: { name: "Anne Jepchirchir", phone: "+254 713 008 001" },
      strengths: ["Reflective writing", "Science notebooks"],
      needs: ["Confidence coaching", "STEM club exposure"],
      competencies: {
        literacy: 79,
        numeracy: 72,
        collaboration: 75,
        selfBelief: 64,
      },
      flags: [
        { label: "Ready for STEM stretch", tone: "support" },
        { label: "Confidence dip", tone: "accent" },
      ],
      concern: "Understates her ability despite strong work completion.",
      nextStep: "Invite her to lead one science demo with structured peer support.",
      county: "Baringo",
      riskLevel: 2,
    },
    {
      id: "ln-006",
      name: "Victor Mwangi",
      classId: "jss1-courage",
      age: 12,
      gender: "Boy",
      attendanceStatus: "present",
      attendanceRate: 88,
      wellbeing: 60,
      lastContact: "3 days ago",
      caregiver: { name: "Mwangi Karanja", phone: "+254 722 342 110" },
      strengths: ["Practical tasks", "Tool handling"],
      needs: ["Behavior coaching", "Positive discipline support"],
      competencies: {
        literacy: 58,
        numeracy: 66,
        collaboration: 48,
        selfBelief: 62,
      },
      flags: [
        { label: "Peer conflict", tone: "signal" },
        { label: "Needs coaching", tone: "accent" },
      ],
      concern: "Can disrupt group work when frustrated, especially during written tasks.",
      nextStep: "Use task rotation and brief restorative check-in after science block.",
      county: "Baringo",
      riskLevel: 3,
    },
    {
      id: "ln-007",
      name: "Lydia Atieno",
      classId: "jss1-courage",
      age: 13,
      gender: "Girl",
      attendanceStatus: "absent",
      attendanceRate: 82,
      wellbeing: 57,
      lastContact: "1 week ago",
      caregiver: { name: "Peter Atieno", phone: "+254 701 777 640" },
      strengths: ["Debate", "Social awareness"],
      needs: ["Mental health check-in", "Safe adult follow-up"],
      competencies: {
        literacy: 77,
        numeracy: 63,
        collaboration: 69,
        selfBelief: 49,
      },
      flags: [
        { label: "Withdrawn recently", tone: "danger" },
        { label: "Needs trusted-adult follow-up", tone: "signal" },
      ],
      concern:
        "Sudden withdrawal from group participation and two unexplained absences this week.",
      nextStep: "Refer for psychosocial follow-up and assign safe mentor contact.",
      county: "Kisumu",
      riskLevel: 5,
    },
    {
      id: "ln-008",
      name: "Peter Musyoka",
      classId: "jss1-courage",
      age: 12,
      gender: "Boy",
      attendanceStatus: "late",
      attendanceRate: 85,
      wellbeing: 68,
      lastContact: "Today",
      caregiver: { name: "Tabitha Musyoka", phone: "+254 728 633 702" },
      strengths: ["Mechanical reasoning", "Team energy"],
      needs: ["Structured homework support"],
      competencies: {
        literacy: 57,
        numeracy: 79,
        collaboration: 72,
        selfBelief: 70,
      },
      flags: [{ label: "Homework inconsistent", tone: "signal" }],
      concern: "Strong in practical work but needs a tighter home study routine.",
      nextStep: "Send caregiver prompt with two-step homework routine.",
      county: "Machakos",
      riskLevel: 2,
    },
    {
      id: "ln-009",
      name: "Naomi Wanjiku",
      classId: "mentorship-circle",
      age: 16,
      gender: "Girl",
      attendanceStatus: "present",
      attendanceRate: 95,
      wellbeing: 88,
      lastContact: "Yesterday",
      caregiver: { name: "Esther Wanjiku", phone: "+254 712 880 250" },
      strengths: ["Public speaking", "Peer support"],
      needs: ["Career exposure", "University pathway information"],
      competencies: {
        literacy: 91,
        numeracy: 82,
        collaboration: 94,
        selfBelief: 90,
      },
      flags: [{ label: "Youth ambassador", tone: "support" }],
      concern: "Ready to mentor younger girls and speak at caregiver forum.",
      nextStep: "Invite to co-facilitate goal-setting session.",
      county: "Nairobi",
      riskLevel: 1,
    },
    {
      id: "ln-010",
      name: "Dennis Kiptoo",
      classId: "mentorship-circle",
      age: 17,
      gender: "Boy",
      attendanceStatus: "present",
      attendanceRate: 87,
      wellbeing: 64,
      lastContact: "3 days ago",
      caregiver: { name: "Kiptoo Cheruiyot", phone: "+254 714 009 755" },
      strengths: ["Leadership", "Football coaching"],
      needs: ["Drug-use prevention coaching", "Career mentor"],
      competencies: {
        literacy: 69,
        numeracy: 71,
        collaboration: 78,
        selfBelief: 61,
      },
      flags: [
        { label: "Substance-risk peer network", tone: "danger" },
        { label: "Responds well to mentors", tone: "support" },
      ],
      concern: "Spends time with older peers linked to substance-use risk near market center.",
      nextStep: "Maintain youth mentor check-in and involve sports leadership role.",
      county: "Nakuru",
      riskLevel: 4,
    },
    {
      id: "ln-011",
      name: "Sharon Akoth",
      classId: "mentorship-circle",
      age: 15,
      gender: "Girl",
      attendanceStatus: "present",
      attendanceRate: 90,
      wellbeing: 76,
      lastContact: "Today",
      caregiver: { name: "Hellen Akoth", phone: "+254 719 280 100" },
      strengths: ["Design thinking", "Journaling"],
      needs: ["Enterprise skills", "Savings group exposure"],
      competencies: {
        literacy: 84,
        numeracy: 74,
        collaboration: 80,
        selfBelief: 78,
      },
      flags: [{ label: "Ready for entrepreneurship track", tone: "accent" }],
      concern: "No urgent concern. Wants practical business and savings guidance.",
      nextStep: "Connect to youth entrepreneurship mini-project.",
      county: "Siaya",
      riskLevel: 1,
    },
    {
      id: "ln-012",
      name: "Samuel Noor",
      classId: "mentorship-circle",
      age: 18,
      gender: "Boy",
      attendanceStatus: "absent",
      attendanceRate: 76,
      wellbeing: 58,
      lastContact: "1 week ago",
      caregiver: { name: "Asha Noor", phone: "+254 723 555 210" },
      strengths: ["Digital curiosity", "Repair skills"],
      needs: ["Transition counselling", "TVET pathway guidance", "Home visit"],
      competencies: {
        literacy: 65,
        numeracy: 69,
        collaboration: 55,
        selfBelief: 52,
      },
      flags: [
        { label: "Transition risk", tone: "danger" },
        { label: "Needs pathway clarity", tone: "signal" },
      ],
      concern: "Uncertain after exam results and missing mentorship sessions.",
      nextStep: "Escalate transition counselling and share TVET options with caregiver.",
      county: "Isiolo",
      riskLevel: 5,
    },
  ],
  notes: [
    {
      id: "note-1",
      learnerId: "ln-002",
      text: "Breakfast support discussed with caregiver. Trialing earlier wake-up routine for one week.",
      createdAt: "2026-04-24 16:20",
    },
    {
      id: "note-2",
      learnerId: "ln-007",
      text: "Observed withdrawal during pair work. Will assign safe mentor and quiet check-in tomorrow.",
      createdAt: "2026-04-24 12:10",
    },
  ],
  referrals: [
    {
      id: "ref-1",
      learnerId: "ln-004",
      category: "Home Visit",
      urgency: "High",
      status: "New",
      owner: "FCP Education Lead",
      summary: "Chronic absence after family move. Caregiver not responding on phone.",
      updatedAt: "Today 08:15",
    },
    {
      id: "ref-2",
      learnerId: "ln-007",
      category: "Mental Health",
      urgency: "High",
      status: "In Follow-up",
      owner: "Church Development Worker",
      summary: "Withdrawal, reduced participation, unexplained absences.",
      updatedAt: "Today 07:45",
    },
    {
      id: "ref-3",
      learnerId: "ln-010",
      category: "Safeguarding",
      urgency: "Medium",
      status: "In Follow-up",
      owner: "Youth Mentor",
      summary: "Needs structured protection around risky peer influence and market-area exposure.",
      updatedAt: "Yesterday 16:00",
    },
    {
      id: "ref-4",
      learnerId: "ln-001",
      category: "Menstrual Health",
      urgency: "Low",
      status: "Closed",
      owner: "Girls' Support Focal Person",
      summary: "Dignity pack and reusable-pad coaching completed.",
      updatedAt: "Yesterday 11:10",
    },
  ],
  messages: [
    {
      id: "msg-1",
      learnerId: "ln-008",
      channel: "SMS",
      intent: "attendance",
      body: "Good evening. Peter was late this week. Please help him begin homework by 7pm and arrive before science block tomorrow.",
      status: "Queued",
      updatedAt: "Today 09:05",
    },
    {
      id: "msg-2",
      learnerId: "ln-003",
      channel: "WhatsApp",
      intent: "encouragement",
      body: "Faith led reading beautifully today. Thank you for supporting her confidence and practice at home.",
      status: "Delivered",
      updatedAt: "Yesterday 15:42",
    },
  ],
  lessonPlans: [
    {
      id: "plan-1",
      classId: "grade5-hope",
      title: "Reading for confidence and belonging",
      updatedAt: "Today 06:50",
      steps: [
        "Warm-up pair reading with confidence prompts.",
        "Shared reading passage tied to local problem-solving story.",
        "Reflection circle on courage, support, and asking for help.",
      ],
    },
  ],
  countyMetrics: [
    { county: "Kitui", attendance: 91, riskLoad: 6 },
    { county: "Baringo", attendance: 87, riskLoad: 4 },
    { county: "Kisumu", attendance: 84, riskLoad: 5 },
    { county: "Nakuru", attendance: 88, riskLoad: 3 },
  ],
};

const cbcOptions = [
  "English Activities",
  "Mathematics Activities",
  "Environmental Activities",
  "Integrated Science",
  "Pre-Technical Studies",
  "Life Skills",
  "Career Guidance",
  "Community Service Learning",
];

const outcomeOptions = [
  "Well-being",
  "Spiritual Development",
  "Youth Agency",
  "Economic Self-Sufficiency",
];

const messageTemplates = {
  attendance:
    "Good day. {{name}} has missed or delayed some learning time this week. Please help them arrive on time and let us know if support is needed.",
  encouragement:
    "Thank you for supporting {{name}}. Today they showed growth and courage in class. Please celebrate this progress at home.",
  meeting:
    "Warm reminder: we would value your presence at the caregiver check-in this week to review {{name}}'s progress and next steps.",
  support:
    "We would like to follow up on a support need affecting {{name}}'s learning. Please reply or visit the teacher desk so we can plan together.",
};

const roleConfig = {
  teacher: {
    label: "Teacher",
    canViewInsights: false,
    canManageReferrals: true,
    canViewSensitiveCases: false,
    canViewCaregiverPhone: true,
    canEditOperationalData: true,
    canResetDemo: false,
    canViewAudit: false,
  },
  fcp_lead: {
    label: "FCP Lead",
    canViewInsights: true,
    canManageReferrals: true,
    canViewSensitiveCases: true,
    canViewCaregiverPhone: true,
    canEditOperationalData: true,
    canResetDemo: true,
    canViewAudit: true,
  },
  safeguarding_lead: {
    label: "Safeguarding Lead",
    canViewInsights: true,
    canManageReferrals: true,
    canViewSensitiveCases: true,
    canViewCaregiverPhone: true,
    canEditOperationalData: true,
    canResetDemo: true,
    canViewAudit: true,
  },
  education_coordinator: {
    label: "Education Coordinator",
    canViewInsights: true,
    canManageReferrals: false,
    canViewSensitiveCases: false,
    canViewCaregiverPhone: false,
    canEditOperationalData: false,
    canResetDemo: true,
    canViewAudit: true,
  },
  guest: {
    label: "Guest",
    canViewInsights: false,
    canManageReferrals: false,
    canViewSensitiveCases: false,
    canViewCaregiverPhone: false,
    canEditOperationalData: false,
    canResetDemo: false,
    canViewAudit: false,
  },
};

const state = loadLocalState();
let apiAvailable = false;
let persistHandle = null;
const session = {
  currentUserId: loadLocalSessionId(),
  authOptions: loadLocalAuthOptions(),
  auditEntries: [],
};
const ui = {
  currentView: "dashboard",
  selectedClassId: state.classes[0].id,
  selectedLearnerId: state.learners[0].id,
  learnerFilter: "all",
  search: "",
};

const el = {};

document.addEventListener("DOMContentLoaded", async () => {
  bindElements();
  hydrateStaticText();
  populateSelects();
  bindEvents();
  renderAll();
  registerServiceWorker();
  await bootstrapState();
  const autoUserId = new URL(window.location.href).searchParams.get("as");
  if (!getActiveUser() && autoUserId) {
    await loginAsUser(autoUserId);
  }
});

function bindElements() {
  const ids = [
    "auth-gate",
    "app-shell",
    "auth-copy",
    "auth-form",
    "auth-username",
    "auth-passcode",
    "auth-error",
    "auth-user-list",
    "teacher-name",
    "teacher-role",
    "teacher-context",
    "logout-button",
    "sync-dot",
    "sync-status",
    "view-kicker",
    "view-title",
    "reset-demo",
    "save-snapshot",
    "metrics-grid",
    "class-tabs",
    "class-overview",
    "priority-list",
    "attendance-title",
    "attendance-lock",
    "attendance-grid",
    "mark-all-present",
    "quick-note-form",
    "quick-note-learner",
    "quick-note-text",
    "quick-note-feed",
    "notes-lock",
    "learner-filters",
    "learner-cards",
    "learner-detail-name",
    "learner-detail",
    "lesson-form",
    "lesson-lock",
    "lesson-class",
    "lesson-cbc",
    "lesson-outcome",
    "lesson-focus",
    "lesson-output",
    "referral-compose-panel",
    "referral-form",
    "referral-learner",
    "referral-category",
    "referral-urgency",
    "referral-summary",
    "referral-board",
    "message-form",
    "message-lock",
    "message-learner",
    "message-channel",
    "message-template",
    "message-body",
    "message-feed",
    "county-bars",
    "outcome-grid",
    "action-table",
    "audit-feed",
    "weekly-attendance",
    "weekly-referrals",
    "weekly-messages",
    "hero-headline",
    "hero-copy",
    "global-search",
    "open-priority-referrals",
    "open-referral-compose",
  ];

  ids.forEach((id) => {
    el[id] = document.getElementById(id);
  });

  el.navLinks = Array.from(document.querySelectorAll(".nav-link"));
  el.views = Array.from(document.querySelectorAll(".view"));
  el.jumpButtons = Array.from(document.querySelectorAll("[data-jump]"));
}

function hydrateStaticText() {
  const activeUser = getActiveUser();
  el["teacher-name"].textContent = activeUser ? activeUser.name : "Choose a workspace";
  el["teacher-role"].textContent = activeUser
    ? getRoleConfig(activeUser.role).label
    : "Role-aware access";
  el["teacher-context"].textContent = activeUser
    ? activeUser.context
    : "Select a role to enter the local Compassion Kenya workspace.";
}

function bindEvents() {
  el["auth-form"].addEventListener("submit", (event) => {
    event.preventDefault();
    loginWithCredentials();
  });

  el.navLinks.forEach((link) => {
    link.addEventListener("click", () => switchView(link.dataset.target));
  });

  el.jumpButtons.forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.jump));
  });

  el["mark-all-present"].addEventListener("click", () => {
    if (!canEditOperationalData()) return;
    getLearnersByClass(ui.selectedClassId).forEach((learner) => {
      learner.attendanceStatus = "present";
    });
    persist("Marked current class as present.");
    renderDashboard();
    renderLearners();
  });

  el["quick-note-form"].addEventListener("submit", (event) => {
    event.preventDefault();
    if (!canEditOperationalData()) return;
    const learnerId = el["quick-note-learner"].value;
    const text = el["quick-note-text"].value.trim();
    if (!text) return;

    state.notes.unshift({
      id: `note-${Date.now()}`,
      learnerId,
      text,
      createdAt: formatNow(),
    });
    el["quick-note-text"].value = "";
    persist("Teacher note saved locally.");
    renderDashboard();
    renderLearners();
  });

  el["lesson-form"].addEventListener("submit", (event) => {
    event.preventDefault();
    if (!canEditOperationalData()) return;
    generateLessonPlan();
  });

  el["referral-form"].addEventListener("submit", (event) => {
    event.preventDefault();
    addReferral();
  });

  el["message-form"].addEventListener("submit", (event) => {
    event.preventDefault();
    if (!canEditOperationalData()) return;
    addMessage();
  });

  el["message-template"].addEventListener("change", updateMessageTemplate);
  el["message-learner"].addEventListener("change", updateMessageTemplate);

  el["logout-button"].addEventListener("click", logoutUser);
  el["reset-demo"].addEventListener("click", resetDemoState);
  el["save-snapshot"].addEventListener("click", downloadSnapshot);
  el["global-search"].addEventListener("input", handleSearch);

  el["open-priority-referrals"].addEventListener("click", () => switchView("learners"));
  el["open-referral-compose"].addEventListener("click", () => {
    el["referral-summary"].focus();
  });

  document.body.addEventListener("click", handleBodyActions);
}

function populateSelects() {
  const learners = getVisibleLearners();
  const classes = getVisibleClasses();

  const learnerOptions = learners
    .map((learner) => `<option value="${learner.id}">${escapeHtml(learner.name)}</option>`)
    .join("");

  el["quick-note-learner"].innerHTML = learnerOptions;
  el["referral-learner"].innerHTML = learnerOptions;
  el["message-learner"].innerHTML = learnerOptions;

  el["lesson-class"].innerHTML = classes
    .map((group) => `<option value="${group.id}">${escapeHtml(group.name)}</option>`)
    .join("");

  if (!learners.some((learner) => learner.id === el["quick-note-learner"].value)) {
    el["quick-note-learner"].value = learners[0]?.id || "";
    el["referral-learner"].value = learners[0]?.id || "";
    el["message-learner"].value = learners[0]?.id || "";
  }

  if (!classes.some((group) => group.id === el["lesson-class"].value)) {
    el["lesson-class"].value = classes[0]?.id || "";
  }

  el["lesson-cbc"].innerHTML = cbcOptions
    .map((item) => `<option value="${item}">${escapeHtml(item)}</option>`)
    .join("");

  el["lesson-outcome"].innerHTML = outcomeOptions
    .map((item) => `<option value="${item}">${escapeHtml(item)}</option>`)
    .join("");

  updateMessageTemplate();
}

async function bootstrapState() {
  setSyncState("offline", "Connecting to local workspace API...");

  try {
    const response = await fetch("/api/bootstrap", {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Bootstrap failed with status ${response.status}`);
    }

    const payload = await response.json();
    apiAvailable = true;
    applySessionPayload(payload);
    hydrateStaticText();
    populateSelects();
    renderAll();
    setSyncState("healthy", "Connected to local workspace API");
  } catch {
    apiAvailable = false;
    overwriteState(loadLocalState());
    session.currentUserId = loadLocalSessionId();
    session.authOptions = loadLocalAuthOptions().length ? loadLocalAuthOptions() : buildAuthOptionsFromState();
    session.auditEntries = [];
    normalizeUiState();
    saveLocalSessionId();
    saveLocalAuthOptions();
    hydrateStaticText();
    populateSelects();
    renderAll();
    setSyncState("offline", "Using device snapshot - local API unavailable");
  }
}

async function loginWithCredentials() {
  clearAuthError();

  const username = el["auth-username"].value.trim();
  const passcode = el["auth-passcode"].value.trim();
  if (!username || !passcode) {
    showAuthError("Enter both username and access code.");
    return;
  }

  setSyncState("offline", "Signing into Huruma...");

  try {
    if (apiAvailable) {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username, passcode }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || `Login failed with status ${response.status}`);
      }

      const payload = await response.json();
      applySessionPayload(payload, { forceState: true });
    } else {
      const fallback = session.authOptions.find(
        (option) => option.username === username && option.demoCode === passcode
      );

      if (!fallback) {
        throw new Error("Incorrect username or access code.");
      }

      session.currentUserId = fallback.id;
      session.auditEntries = [];
    }

    el["auth-passcode"].value = "";
    normalizeUiState();
    saveLocalState();
    saveLocalSessionId();
    hydrateStaticText();
    populateSelects();
    renderAll();
    setSyncState(
      apiAvailable ? "healthy" : "offline",
      apiAvailable ? "Connected to local workspace API" : "Signed in with device snapshot"
    );
  } catch (error) {
    if (!apiAvailable && error.message !== "Incorrect username or access code.") {
      showAuthError("Local API unavailable and no matching device credential was found.");
    } else {
      showAuthError(error.message || "Unable to sign in.");
    }
    setSyncState(apiAvailable ? "error" : "offline", "Sign-in needs attention");
  }
}

async function loginAsUser(userId) {
  setSyncState(apiAvailable ? "offline" : "offline", "Signing into Huruma...");

  try {
    if (apiAvailable) {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`Login failed with status ${response.status}`);
      }

      const payload = await response.json();
      applySessionPayload(payload, { forceState: true });
    } else {
      session.currentUserId = userId;
      session.auditEntries = [];
    }

    el["auth-passcode"].value = "";
    clearAuthError();
    normalizeUiState();
    saveLocalState();
    saveLocalSessionId();
    hydrateStaticText();
    populateSelects();
    renderAll();
    setSyncState(apiAvailable ? "healthy" : "offline", apiAvailable ? "Connected to local workspace API" : "Signed in with device snapshot");
  } catch {
    apiAvailable = false;
    session.currentUserId = userId;
    session.auditEntries = [];
    normalizeUiState();
    saveLocalSessionId();
    hydrateStaticText();
    populateSelects();
    renderAll();
    setSyncState("offline", "Signed in with device snapshot");
  }
}

async function logoutUser() {
  try {
    if (apiAvailable) {
      await fetch("/api/logout", {
        method: "POST",
        headers: { Accept: "application/json" },
      });
    }
  } catch {
    apiAvailable = false;
  }

  session.currentUserId = null;
  session.auditEntries = [];
  clearAuthError();
  saveLocalSessionId();
  normalizeUiState();
  hydrateStaticText();
  populateSelects();
  renderAll();
  setSyncState(apiAvailable ? "healthy" : "offline", apiAvailable ? "Signed out from local workspace" : "Signed out locally");
}

function applySessionPayload(payload, options = {}) {
  const shouldOverwriteState =
    Boolean(payload?.viewer) || options.forceState || !getUsers().length;

  if (shouldOverwriteState && payload?.state) {
    overwriteState(payload.state);
    saveLocalState();
  }

  session.currentUserId = payload?.viewer?.id || null;
  session.authOptions = Array.isArray(payload?.authOptions)
    ? payload.authOptions
    : buildAuthOptionsFromState();
  session.auditEntries = Array.isArray(payload?.auditEntries) ? payload.auditEntries : [];

  normalizeUiState();
  saveLocalSessionId();
  saveLocalAuthOptions();
}

function renderAll() {
  renderAuthState();
  renderNavigation();
  renderControlAccess();
  if (!getActiveUser()) {
    return;
  }
  renderViewMeta();
  renderSidebarSummary();
  renderDashboard();
  renderLearners();
  renderLessons();
  renderReferrals();
  renderMessages();
  renderInsights();
}

function buildAuthOptionsFromState() {
  return (state.users || []).map((user, index) => ({
    id: user.id,
    name: user.name,
    role: user.role,
    context: user.context,
    focus: user.focus,
    username: user.username || `${user.id}@huruma.local`,
    demoCode: `240${index + 1}`,
  }));
}

function renderControlAccess() {
  const signedIn = Boolean(getActiveUser());
  const canHandleReferrals = canManageReferrals();
  const canEdit = canEditOperationalData();
  const canReset = canResetDemo();

  el["reset-demo"].hidden = !signedIn || !canReset;
  el["save-snapshot"].hidden = !signedIn;
  el["mark-all-present"].hidden = !canEdit;
  el["attendance-lock"].hidden = canEdit;
  el["quick-note-form"].hidden = !canEdit;
  el["notes-lock"].hidden = canEdit;
  el["lesson-form"].hidden = !canEdit;
  el["lesson-lock"].hidden = canEdit;
  el["open-referral-compose"].hidden = !canHandleReferrals;
  el["referral-compose-panel"].hidden = !canHandleReferrals;
  el["message-form"].hidden = !canEdit;
  el["message-lock"].hidden = canEdit;
}

function getUsers() {
  return state.users || [];
}

function getActiveUser() {
  return getUsers().find((user) => user.id === session.currentUserId) || null;
}

function getRoleConfig(role) {
  return roleConfig[role] || roleConfig.guest;
}

function getAllowedViews() {
  const activeUser = getActiveUser();
  if (!activeUser) return ["dashboard"];

  const views = ["dashboard", "learners", "lessons", "referrals", "caregivers"];
  if (getRoleConfig(activeUser.role).canViewInsights) {
    views.push("insights");
  }
  return views;
}

function getVisibleClasses() {
  const activeUser = getActiveUser();
  if (!activeUser) return [];
  if (activeUser.role !== "teacher") return state.classes;

  const allowed = new Set(activeUser.assignedClassIds || []);
  return state.classes.filter((group) => allowed.has(group.id));
}

function getVisibleLearners() {
  const visibleClasses = new Set(getVisibleClasses().map((group) => group.id));
  return state.learners.filter((learner) => visibleClasses.has(learner.classId));
}

function getVisibleNotes() {
  const learnerIds = new Set(getVisibleLearners().map((learner) => learner.id));
  return state.notes.filter((note) => learnerIds.has(note.learnerId));
}

function getVisibleReferrals() {
  const learnerIds = new Set(getVisibleLearners().map((learner) => learner.id));
  return state.referrals.filter((referral) => learnerIds.has(referral.learnerId));
}

function getVisibleMessages() {
  const learnerIds = new Set(getVisibleLearners().map((learner) => learner.id));
  return state.messages.filter((message) => learnerIds.has(message.learnerId));
}

function canViewInsights() {
  return getRoleConfig(getActiveUser()?.role).canViewInsights;
}

function canManageReferrals() {
  return getRoleConfig(getActiveUser()?.role).canManageReferrals;
}

function canViewSensitiveCases() {
  return getRoleConfig(getActiveUser()?.role).canViewSensitiveCases;
}

function canViewCaregiverPhone() {
  return getRoleConfig(getActiveUser()?.role).canViewCaregiverPhone;
}

function canEditOperationalData() {
  return getRoleConfig(getActiveUser()?.role).canEditOperationalData;
}

function canResetDemo() {
  return getRoleConfig(getActiveUser()?.role).canResetDemo;
}

function canViewAudit() {
  return getRoleConfig(getActiveUser()?.role).canViewAudit;
}

function overwriteState(nextState) {
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, deepClone(nextState));
}

function normalizeUiState() {
  const visibleClasses = getVisibleClasses();
  const visibleLearners = getVisibleLearners();

  if (!visibleClasses.some((group) => group.id === ui.selectedClassId)) {
    ui.selectedClassId = visibleClasses[0]?.id || "";
  }

  if (!visibleLearners.some((learner) => learner.id === ui.selectedLearnerId)) {
    ui.selectedLearnerId = visibleLearners[0]?.id || "";
  }

  const allowedViews = getAllowedViews();
  if (!allowedViews.includes(ui.currentView)) {
    ui.currentView = allowedViews[0] || "dashboard";
  }
}

function renderAuthState() {
  const activeUser = getActiveUser();
  const signedIn = Boolean(activeUser);

  el["auth-gate"].hidden = signedIn;
  el["app-shell"].hidden = !signedIn;
  el["logout-button"].hidden = !signedIn;

  const authOptions = session.authOptions.length ? session.authOptions : buildAuthOptionsFromState();
  el["auth-username"].innerHTML = authOptions
    .map(
      (option) => `
        <option value="${option.username}">${escapeHtml(option.username)} - ${escapeHtml(option.name)}</option>
      `
    )
    .join("");

  if (!authOptions.some((option) => option.username === el["auth-username"].value)) {
    el["auth-username"].value = authOptions[0]?.username || "";
  }

  el["auth-user-list"].innerHTML = authOptions
    .map(
      (option) => `
        <button class="auth-user" data-action="prefill-auth" data-id="${option.id}">
          <p class="eyebrow">${escapeHtml(getRoleConfig(option.role).label)}</p>
          <h3>${escapeHtml(option.name)}</h3>
          <p>${escapeHtml(option.context)}</p>
          <strong>${escapeHtml(option.focus)}</strong>
          <code>${escapeHtml(option.username)} / ${escapeHtml(option.demoCode)}</code>
        </button>
      `
    )
    .join("");
}

function renderNavigation() {
  const allowedViews = new Set(getAllowedViews());
  el.navLinks.forEach((link) => {
    const permitted = allowedViews.has(link.dataset.target);
    link.hidden = !permitted;
    link.classList.toggle("active", permitted && link.dataset.target === ui.currentView);
  });
}

function renderViewMeta() {
  const viewMap = {
    dashboard: ["Teacher workflow desk", "Today"],
    learners: ["Learner support", "Learners"],
    lessons: ["Planning assistant", "Lesson Planner"],
    referrals: ["Case workflow", "Referrals"],
    caregivers: ["Family engagement", "Caregivers"],
    insights: ["Partner oversight", "Insights"],
  };
  const [kicker, title] = viewMap[ui.currentView];
  el["view-kicker"].textContent = kicker;
  el["view-title"].textContent = title;
}

function renderSidebarSummary() {
  const stats = computeStats();
  el["weekly-attendance"].textContent = `${stats.attendanceCoverage}%`;
  el["weekly-referrals"].textContent = String(stats.priorityCount);
  el["weekly-messages"].textContent = String(stats.queuedMessages);
}

function renderDashboard() {
  const stats = computeStats();
  const visibleClasses = getVisibleClasses();
  el["hero-headline"].textContent = `${visibleClasses.length} groups active, ${stats.priorityCount} priority learners, ${stats.highUrgencyReferrals} urgent follow-up${stats.highUrgencyReferrals === 1 ? "" : "s"}.`;
  el["hero-copy"].textContent =
    "Start with attendance, then move the highest-risk learners into action before the next session begins. Everything saved here stays available offline on this device.";

  const metrics = [
    {
      label: "Attendance captured today",
      value: `${stats.attendanceCoverage}%`,
      note: "Across all active groups",
      tone: "support",
    },
    {
      label: "Priority learners",
      value: String(stats.priorityCount),
      note: "Need follow-up this week",
      tone: "danger",
    },
    {
      label: "Caregiver touchpoints",
      value: String(stats.totalMessages),
      note: `${stats.queuedMessages} still queued`,
      tone: "accent",
    },
    {
      label: "Referrals in motion",
      value: String(stats.activeReferrals),
      note: `${stats.closedReferrals} recently closed`,
      tone: "signal",
    },
  ];

  el["metrics-grid"].innerHTML = metrics
    .map(
      (metric) => `
        <article class="metric-card" data-tone="${metric.tone}">
          <p class="eyebrow">${escapeHtml(metric.label)}</p>
          <div class="metric-value">${escapeHtml(metric.value)}</div>
          <p class="subtle">${escapeHtml(metric.note)}</p>
        </article>
      `
    )
    .join("");

  renderClassTabs();
  renderClassOverview();
  renderPriorityList();
  renderAttendanceGrid();
  renderQuickNotes();
}

function renderClassTabs() {
  el["class-tabs"].innerHTML = getVisibleClasses()
    .map(
      (group) => `
        <button class="chip-button ${group.id === ui.selectedClassId ? "active" : ""}" data-action="select-class" data-id="${group.id}">
          ${escapeHtml(group.name)}
        </button>
      `
    )
    .join("");
}

function renderClassOverview() {
  const selected = getClassById(ui.selectedClassId);
  const classLearners = getLearnersByClass(selected.id);
  const presentCount = classLearners.filter((learner) => learner.attendanceStatus === "present").length;
  const absentCount = classLearners.filter((learner) => learner.attendanceStatus === "absent").length;

  el["class-overview"].innerHTML = `
    <article class="class-card">
      <div class="panel-head">
        <div>
          <h4>${escapeHtml(selected.name)}</h4>
          <p class="subtle">${escapeHtml(selected.session)} - ${escapeHtml(selected.location)}</p>
        </div>
        <div class="flag support">${escapeHtml(selected.ageBand)}</div>
      </div>
      <p>${escapeHtml(selected.headline)}</p>
      <div class="kv-grid">
        <div class="kv-item">
          <strong>${presentCount}/${classLearners.length}</strong>
          <p class="subtle">Present so far</p>
        </div>
        <div class="kv-item">
          <strong>${absentCount}</strong>
          <p class="subtle">Absent today</p>
        </div>
        <div class="kv-item">
          <strong>${escapeHtml(selected.focus)}</strong>
          <p class="subtle">Teaching focus</p>
        </div>
        <div class="kv-item">
          <strong>${escapeHtml(selected.deviceMode)}</strong>
          <p class="subtle">Delivery mode</p>
        </div>
      </div>
    </article>
  `;
}

function renderPriorityList() {
  const priorityLearners = [...getVisibleLearners()]
    .filter((learner) => learner.riskLevel >= 4 || learner.flags.some((flag) => flag.tone === "danger"))
    .sort((a, b) => b.riskLevel - a.riskLevel)
    .slice(0, 4);

  el["priority-list"].innerHTML = priorityLearners
    .map(
      (learner) => `
        <article class="priority-card">
          <p class="eyebrow">${escapeHtml(getClassById(learner.classId).name)}</p>
          <h4>${escapeHtml(learner.name)}</h4>
          <p>${escapeHtml(learner.concern)}</p>
          <div class="flag-row">
            ${learner.flags
              .map((flag) => `<span class="flag ${flag.tone}">${escapeHtml(flag.label)}</span>`)
              .join("")}
          </div>
          <footer>
            <span class="subtle">Next: ${escapeHtml(learner.nextStep)}</span>
            <div class="inline-actions">
              <button class="tiny-button support" data-action="open-learner" data-id="${learner.id}">Profile</button>
              <button class="tiny-button primary" data-action="prefill-referral" data-id="${learner.id}">Refer</button>
            </div>
          </footer>
        </article>
      `
    )
    .join("");
}

function renderAttendanceGrid() {
  const selected = getClassById(ui.selectedClassId);
  const learners = getLearnersByClass(selected.id);
  el["attendance-title"].textContent = selected.name;
  el["attendance-grid"].innerHTML = learners
    .map(
      (learner) => `
        <article class="attendance-card">
          <header>
            <div>
              <strong>${escapeHtml(learner.name)}</strong>
              <p class="subtle">${escapeHtml(learner.caregiver.name)}</p>
            </div>
            <span class="flag ${riskTone(learner.riskLevel)}">Risk ${learner.riskLevel}</span>
          </header>
          <div class="status-row">
            ${["present", "late", "absent"]
              .map(
                (status) => `
                  <button
                    class="status-toggle ${learner.attendanceStatus === status ? "active" : ""}"
                    data-status="${status}"
                    data-action="attendance"
                    data-id="${learner.id}"
                    ${canEditOperationalData() ? "" : "disabled"}
                  >
                    ${capitalize(status)}
                  </button>
                `
              )
              .join("")}
          </div>
        </article>
      `
    )
    .join("");
}

function renderQuickNotes() {
  const recentNotes = getVisibleNotes().slice(0, 4);
  el["quick-note-feed"].innerHTML = recentNotes
    .map((note) => {
      const learner = getLearnerById(note.learnerId);
      return `
        <article class="message-card">
          <h4>${escapeHtml(learner.name)}</h4>
          <p>${escapeHtml(note.text)}</p>
          <footer>
            <span class="subtle">${escapeHtml(note.createdAt)}</span>
          </footer>
        </article>
      `;
    })
    .join("");
}

function renderLearners() {
  renderLearnerFilters();
  renderLearnerCards();
  renderLearnerDetail();
}

function renderLearnerFilters() {
  const filters = [
    ["all", "All learners"],
    ["watch", "Watchlist"],
    ["strong", "Strong progress"],
    ["support", "Needs support"],
  ];

  el["learner-filters"].innerHTML = filters
    .map(
      ([value, label]) => `
        <button class="chip-button ${ui.learnerFilter === value ? "active" : ""}" data-action="set-filter" data-id="${value}">
          ${escapeHtml(label)}
        </button>
      `
    )
    .join("");
}

function renderLearnerCards() {
  const learners = filterLearners(ui.search);
  el["learner-cards"].innerHTML = learners
    .map(
      (learner) => `
        <button class="learner-card ${ui.selectedLearnerId === learner.id ? "active" : ""}" data-action="open-learner" data-id="${learner.id}">
          <p class="eyebrow">${escapeHtml(getClassById(learner.classId).name)}</p>
          <h4>${escapeHtml(learner.name)}</h4>
          <p>${escapeHtml(learner.strengths[0])} - ${escapeHtml(learner.needs[0] || "No urgent support noted")}</p>
          <div class="flag-row">
            <span class="flag ${riskTone(learner.riskLevel)}">Risk ${learner.riskLevel}</span>
            <span class="flag support">${learner.attendanceRate}% attendance</span>
          </div>
        </button>
      `
    )
    .join("");
}

function renderLearnerDetail() {
  const learner = getLearnerById(ui.selectedLearnerId);
  if (!learner) {
    el["learner-detail-name"].textContent = "Choose a learner";
    el["learner-detail"].innerHTML =
      "Select a learner card to view attendance trend, competencies, support needs, and caregiver contacts.";
    return;
  }

  const recentNotes = getVisibleNotes().filter((note) => note.learnerId === learner.id).slice(0, 3);

  el["learner-detail-name"].textContent = learner.name;
  el["learner-detail"].classList.remove("empty-state");
  el["learner-detail"].innerHTML = `
    <section class="detail-section">
      <div class="panel-head">
        <div>
          <h4>${escapeHtml(learner.name)}</h4>
          <p class="subtle">${escapeHtml(getClassById(learner.classId).name)} - ${learner.age} years - ${escapeHtml(learner.gender)}</p>
        </div>
        <span class="flag ${riskTone(learner.riskLevel)}">Risk ${learner.riskLevel}</span>
      </div>
      <div class="flag-row">
        ${learner.flags.map((flag) => `<span class="flag ${flag.tone}">${escapeHtml(flag.label)}</span>`).join("")}
      </div>
    </section>

    <section class="detail-section">
      <h4>Snapshot</h4>
      <div class="kv-grid">
        <div class="kv-item"><strong>${learner.attendanceRate}%</strong><p class="subtle">Attendance rate</p></div>
        <div class="kv-item"><strong>${learner.wellbeing}%</strong><p class="subtle">Well-being score</p></div>
        <div class="kv-item"><strong>${escapeHtml(learner.caregiver.name)}</strong><p class="subtle">Caregiver</p></div>
        <div class="kv-item"><strong>${escapeHtml(getVisibleCaregiverPhone(learner.caregiver.phone))}</strong><p class="subtle">Primary phone</p></div>
      </div>
    </section>

    <section class="detail-section">
      <h4>Competency balance</h4>
      ${Object.entries(learner.competencies)
        .map(
          ([key, value]) => `
            <div class="bar-row">
              <header><span>${escapeHtml(capitalizeWords(key))}</span><strong>${value}%</strong></header>
              <div class="bar-track"><div class="bar-fill" style="width:${value}%"></div></div>
            </div>
          `
        )
        .join("")}
    </section>

    <section class="detail-section">
      <h4>Support picture</h4>
      <p><strong>Concern:</strong> ${escapeHtml(getVisibleLearnerConcern(learner))}</p>
      <p><strong>Next step:</strong> ${escapeHtml(getVisibleLearnerNextStep(learner))}</p>
      <p><strong>Strengths:</strong> ${escapeHtml(learner.strengths.join(", "))}</p>
      <p><strong>Needs:</strong> ${escapeHtml(learner.needs.join(", "))}</p>
    </section>

    <section class="detail-section">
      <h4>Recent notes</h4>
      ${
        recentNotes.length
          ? recentNotes
              .map(
                (note) => `
                  <div class="action-row">
                    <div><p>${escapeHtml(note.text)}</p></div>
                    <div class="subtle">${escapeHtml(note.createdAt)}</div>
                    <div class="subtle">Teacher note</div>
                    <button class="tiny-button primary" data-action="prefill-message" data-id="${learner.id}">Message caregiver</button>
                  </div>
                `
              )
              .join("")
          : '<p class="subtle">No notes yet for this learner.</p>'
      }
    </section>
  `;
}

function renderLessons() {
  const visibleClassIds = new Set(getVisibleClasses().map((group) => group.id));
  const plans = state.lessonPlans.filter((plan) => visibleClassIds.has(plan.classId)).slice(0, 3);
  if (!plans.length) {
    el["lesson-output"].classList.add("empty-state");
    el["lesson-output"].innerHTML =
      "Your generated lesson path will appear here with warm-up, core activity, inclusion notes, caregiver follow-up, and evidence to capture.";
    return;
  }

  el["lesson-output"].classList.remove("empty-state");
  el["lesson-output"].innerHTML = `
    <div class="lesson-plan">
      ${plans
        .map((plan) => {
          const group = getClassById(plan.classId);
          return `
            <article class="lesson-strip">
              <p class="eyebrow">${escapeHtml(group.name)} - ${escapeHtml(plan.updatedAt)}</p>
              <h4>${escapeHtml(plan.title)}</h4>
              <ol>
                ${plan.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
              </ol>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderReferrals() {
  const stages = ["New", "In Follow-up", "Closed"];
  el["referral-board"].innerHTML = stages
    .map((stage) => {
      const records = getVisibleReferrals().filter((referral) => referral.status === stage);
      return `
        <section class="referral-column">
          <div class="column-head">
            <strong>${escapeHtml(stage)}</strong>
            <span class="count-badge">${records.length}</span>
          </div>
          ${records
            .map((referral) => {
              const learner = getLearnerById(referral.learnerId);
              return `
                <article class="referral-card">
                  <p class="eyebrow">${escapeHtml(referral.category)} - ${escapeHtml(referral.urgency)}</p>
                  <h4>${escapeHtml(learner.name)}</h4>
                  <p>${escapeHtml(getVisibleReferralSummary(referral, learner))}</p>
                  <footer>
                    <span class="subtle">${escapeHtml(referral.owner)} - ${escapeHtml(referral.updatedAt)}</span>
                    <div class="inline-actions">
                      ${
                        stage !== "Closed" && canManageReferrals()
                          ? `<button class="tiny-button support" data-action="advance-referral" data-id="${referral.id}">Advance</button>`
                          : ""
                      }
                      <button class="tiny-button primary" data-action="open-learner" data-id="${learner.id}">Profile</button>
                    </div>
                  </footer>
                </article>
              `;
            })
            .join("")}
        </section>
      `;
    })
    .join("");
}

function renderMessages() {
  el["message-feed"].innerHTML = getVisibleMessages()
    .slice(0, 6)
    .map((message) => {
      const learner = getLearnerById(message.learnerId);
      return `
        <article class="message-card">
          <p class="eyebrow">${escapeHtml(message.channel)} - ${escapeHtml(message.status)} - ${escapeHtml(message.updatedAt)}</p>
          <h4>${escapeHtml(learner.caregiver.name)} for ${escapeHtml(learner.name)}</h4>
          <p>${escapeHtml(message.body)}</p>
        </article>
      `;
    })
    .join("");
}

function renderInsights() {
  if (!canViewInsights()) {
    el["county-bars"].innerHTML =
      '<div class="empty-state">County and partner analytics are available to FCP leads, safeguarding leads, and education coordinators.</div>';
    el["outcome-grid"].innerHTML =
      '<div class="empty-state">Sign in with an oversight role to view cross-partner insight cards.</div>';
    el["action-table"].innerHTML =
      '<div class="empty-state">Operational recommendations appear here for oversight roles.</div>';
    el["audit-feed"].innerHTML =
      '<div class="empty-state">Protected audit activity appears here for oversight roles.</div>';
    return;
  }

  el["county-bars"].innerHTML = state.countyMetrics
    .map(
      (item) => `
        <div class="bar-row">
          <header>
            <span>${escapeHtml(item.county)}</span>
            <strong>${item.attendance}% attendance - ${item.riskLoad} active concerns</strong>
          </header>
          <div class="bar-track"><div class="bar-fill" style="width:${item.attendance}%"></div></div>
        </div>
      `
    )
    .join("");

  const outcomes = computeOutcomeBalances();
  el["outcome-grid"].innerHTML = outcomes
    .map(
      (outcome) => `
        <article class="outcome-card">
          <p class="eyebrow">${escapeHtml(outcome.label)}</p>
          <h4>${outcome.value}%</h4>
          <p class="subtle">${escapeHtml(outcome.note)}</p>
        </article>
      `
    )
    .join("");

  const actions = buildActionRows();
  el["action-table"].innerHTML = actions
    .map(
      (action) => `
        <div class="action-row">
          <div>
            <strong>${escapeHtml(action.title)}</strong>
            <p class="subtle">${escapeHtml(action.detail)}</p>
          </div>
          <div class="tone-${action.tone}">${escapeHtml(action.owner)}</div>
          <div class="subtle">${escapeHtml(action.window)}</div>
          <button class="tiny-button primary" data-action="${action.action}" data-id="${action.id}">${escapeHtml(action.cta)}</button>
        </div>
      `
    )
    .join("");

  renderAuditFeed();
}

function renderAuditFeed() {
  if (!canViewAudit()) {
    el["audit-feed"].innerHTML =
      '<div class="empty-state">Audit visibility is limited to cleared oversight roles.</div>';
    return;
  }

  if (!session.auditEntries.length) {
    el["audit-feed"].innerHTML =
      '<div class="empty-state">No recent workspace activity has been captured yet.</div>';
    return;
  }

  el["audit-feed"].innerHTML = session.auditEntries
    .map((entry) => {
      const summary = describeAuditEntry(entry);
      return `
        <div class="action-row">
          <div>
            <strong>${escapeHtml(summary.title)}</strong>
            <p class="subtle">${escapeHtml(summary.detail)}</p>
          </div>
          <div class="audit-meta tone-${escapeHtml(summary.tone)}">${escapeHtml(summary.owner)}</div>
          <div class="subtle">${escapeHtml(entry.createdAt || "Just now")}</div>
          <div class="subtle">${escapeHtml(summary.trailing)}</div>
        </div>
      `;
    })
    .join("");
}

function describeAuditEntry(entry) {
  const actionMap = {
    login: {
      title: `${entry.actorName || "A user"} signed in`,
      detail: "Opened a role-scoped workspace session.",
      trailing: "Session",
      tone: "support",
    },
    logout: {
      title: `${entry.actorName || "A user"} signed out`,
      detail: "Closed the active workspace session.",
      trailing: "Session",
      tone: "accent",
    },
    state_saved: {
      title: "Workspace changes saved",
      detail: entry.detail?.reason || "Operational updates were written back to the local workspace.",
      trailing: "Protected write",
      tone: "support",
    },
    export_scoped_state: {
      title: "Scoped export prepared",
      detail: "Only the current role-visible workspace slice was exported.",
      trailing: "Protected export",
      tone: "signal",
    },
  };

  const fallback = {
    title: "Workspace activity recorded",
    detail: "An auditable system event was captured for follow-up.",
    trailing: "System",
    tone: "accent",
  };

  const summary = actionMap[entry.action] || fallback;
  const roleLabel =
    entry.actorRole && entry.actorRole !== "system"
      ? getRoleConfig(entry.actorRole).label
      : "System";

  return {
    ...summary,
    owner: roleLabel,
  };
}

function handleBodyActions(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;

  const { action, id, status } = target.dataset;

  if (action === "prefill-auth") {
    const option = session.authOptions.find((entry) => entry.id === id);
    if (!option) return;
    el["auth-username"].value = option.username;
    el["auth-passcode"].value = option.demoCode;
    clearAuthError();
    return;
  }

  if (action === "login") {
    loginAsUser(id);
    return;
  }

  if (action === "select-class") {
    ui.selectedClassId = id;
    renderDashboard();
    return;
  }

  if (action === "attendance") {
    if (!canEditOperationalData()) return;
    const learner = getLearnerById(id);
    learner.attendanceStatus = status;
    persist(`${learner.name} marked ${status}.`);
    renderDashboard();
    renderLearners();
    return;
  }

  if (action === "open-learner") {
    ui.selectedLearnerId = id;
    switchView("learners");
    renderLearners();
    return;
  }

  if (action === "prefill-referral") {
    switchView("referrals");
    el["referral-learner"].value = id;
    const learner = getLearnerById(id);
    el["referral-summary"].value = `${learner.concern} Next step proposed: ${learner.nextStep}`;
    el["referral-summary"].focus();
    return;
  }

  if (action === "prefill-message") {
    switchView("caregivers");
    el["message-learner"].value = id;
    el["message-template"].value = "support";
    updateMessageTemplate();
    el["message-body"].focus();
    return;
  }

  if (action === "advance-referral") {
    advanceReferral(id);
    return;
  }

  if (action === "set-filter") {
    ui.learnerFilter = id;
    renderLearners();
    return;
  }

  if (action === "focus-referrals") {
    switchView("referrals");
  }
}

function switchView(viewName) {
  if (!getAllowedViews().includes(viewName)) {
    return;
  }
  ui.currentView = viewName;
  el.navLinks.forEach((link) => link.classList.toggle("active", link.dataset.target === viewName));
  el.views.forEach((view) => view.classList.toggle("active", view.dataset.view === viewName));
  renderViewMeta();
}

function generateLessonPlan() {
  if (!canEditOperationalData()) return;
  const classId = el["lesson-class"].value;
  const cbc = el["lesson-cbc"].value;
  const outcome = el["lesson-outcome"].value;
  const challenge = document.getElementById("lesson-challenge").value;
  const focus = el["lesson-focus"].value.trim() || "Strengthen learner participation and evidence capture.";
  const group = getClassById(classId);

  const challengeNoteMap = {
    "mixed-ability": "Use peer pairing, tiered tasks, and one verbal check-in for every learner.",
    "low-connectivity": "Rely on board work, oral prompts, print slips, and one shared teacher device only if needed.",
    "low-energy": "Open with movement, include a hydration or well-being check, and shorten long silent tasks.",
    inclusion: "Offer alternative response modes, seating adjustment, and scaffolded instructions with visual support.",
  };

  const outcomeCareMap = {
    "Well-being": "Close with a short self-care or health prompt that learners can share at home.",
    "Spiritual Development": "Add a reflection question on dignity, hope, and caring for others.",
    "Youth Agency": "Give learners one visible role in discussion, teamwork, or problem-solving.",
    "Economic Self-Sufficiency": "Connect the task to practical life, work habits, or money sense.",
  };

  const plan = {
    id: `plan-${Date.now()}`,
    classId,
    title: `${cbc} with ${outcome}`,
    updatedAt: "Just now",
    steps: [
      `Warm-up: 7-minute opener for ${group.name} that links ${cbc} to today's local context.`,
      `Core activity: ${focus}`,
      `Adaptation: ${challengeNoteMap[challenge]}`,
      `Holistic layer: ${outcomeCareMap[outcome]}`,
      "Evidence to capture: one quick competency note, one participation note, and one learner strength.",
      "Caregiver follow-up: send a one-line message with a simple home reinforcement task.",
    ],
  };

  state.lessonPlans.unshift(plan);
  state.lessonPlans = state.lessonPlans.slice(0, 4);
  persist("Weekly lesson path generated.");
  renderLessons();
  switchView("lessons");
}

function addReferral() {
  if (!canManageReferrals()) return;
  const learnerId = el["referral-learner"].value;
  const summary = el["referral-summary"].value.trim();
  if (!summary) return;

  state.referrals.unshift({
    id: `ref-${Date.now()}`,
    learnerId,
    category: el["referral-category"].value,
    urgency: el["referral-urgency"].value,
    status: "New",
    owner: "Pending assignment",
    summary,
    updatedAt: "Just now",
  });

  el["referral-summary"].value = "";
  persist("Referral added to workflow.");
  renderDashboard();
  renderReferrals();
  renderInsights();
}

function addMessage() {
  if (!canEditOperationalData()) return;
  const learnerId = el["message-learner"].value;
  const body = el["message-body"].value.trim();
  if (!body) return;

  state.messages.unshift({
    id: `msg-${Date.now()}`,
    learnerId,
    channel: el["message-channel"].value,
    intent: el["message-template"].value,
    body,
    status: "Queued",
    updatedAt: "Just now",
  });

  el["message-body"].value = "";
  persist("Caregiver message queued.");
  renderDashboard();
  renderMessages();
}

function advanceReferral(referralId) {
  if (!canManageReferrals()) return;
  const referral = state.referrals.find((item) => item.id === referralId);
  if (!referral) return;

  if (referral.status === "New") {
    referral.status = "In Follow-up";
    referral.owner = "Assigned follow-up";
  } else if (referral.status === "In Follow-up") {
    referral.status = "Closed";
    referral.owner = "Closed by team";
  }
  referral.updatedAt = "Just now";
  persist("Referral advanced.");
  renderDashboard();
  renderReferrals();
  renderInsights();
}

function updateMessageTemplate() {
  const learner = getLearnerById(el["message-learner"].value) || getVisibleLearners()[0];
  if (!learner) {
    el["message-body"].value = "";
    return;
  }
  const intent = el["message-template"].value;
  const template = messageTemplates[intent];
  el["message-body"].value = template.replaceAll("{{name}}", learner.name);
}

function handleSearch(event) {
  ui.search = event.target.value.trim().toLowerCase();
  renderLearners();
}

function filterLearners(searchTerm) {
  let learners = [...getVisibleLearners()];

  if (ui.learnerFilter === "watch") {
    learners = learners.filter((learner) => learner.riskLevel >= 4);
  } else if (ui.learnerFilter === "strong") {
    learners = learners.filter((learner) => learner.attendanceRate >= 92 && learner.wellbeing >= 75);
  } else if (ui.learnerFilter === "support") {
    learners = learners.filter((learner) => learner.needs.length > 1 || learner.riskLevel >= 3);
  }

  if (searchTerm) {
    learners = learners.filter((learner) => {
      const haystack = [
        learner.name,
        learner.caregiver.name,
        learner.concern,
        learner.nextStep,
        getClassById(learner.classId).name,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(searchTerm);
    });
  }

  return learners;
}

function computeStats() {
  const learners = getVisibleLearners();
  const messages = getVisibleMessages();
  const referrals = getVisibleReferrals();
  const total = learners.length || 1;
  const captured = learners.filter((learner) => Boolean(learner.attendanceStatus)).length;
  return {
    attendanceCoverage: Math.round((captured / total) * 100),
    priorityCount: learners.filter((learner) => learner.riskLevel >= 4).length,
    totalMessages: messages.length,
    queuedMessages: messages.filter((message) => message.status === "Queued").length,
    activeReferrals: referrals.filter((referral) => referral.status !== "Closed").length,
    closedReferrals: referrals.filter((referral) => referral.status === "Closed").length,
    highUrgencyReferrals: referrals.filter(
      (referral) => referral.urgency === "High" && referral.status !== "Closed"
    ).length,
  };
}

function computeOutcomeBalances() {
  const learners = getVisibleLearners();
  const avg = (values) =>
    values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
  return [
    {
      label: "Well-being",
      value: avg(learners.map((learner) => learner.wellbeing)),
      note: "Blend attendance, emotional safety, and energy signals in one teacher-facing measure.",
    },
    {
      label: "Youth Agency",
      value: avg(learners.map((learner) => learner.competencies.selfBelief)),
      note: "Tracks confidence, initiative, and visible learner voice.",
    },
    {
      label: "Learning Growth",
      value: avg(learners.map((learner) => (learner.competencies.literacy + learner.competencies.numeracy) / 2)),
      note: "Shows the academic core without losing the whole-child picture.",
    },
    {
      label: "Community Connection",
      value: avg(learners.map((learner) => learner.competencies.collaboration)),
      note: "Reflects teamwork, relational trust, and peer support indicators.",
    },
  ];
}

function buildActionRows() {
  return [
    {
      id: "ln-004",
      title: "Re-entry plan for Kelvin Odhiambo",
      detail: "Home visit, caregiver reach-out, and 3-day catch-up pack need alignment.",
      owner: "FCP Education Lead",
      window: "Within 48 hours",
      action: "open-learner",
      cta: "Open learner",
      tone: "danger",
    },
    {
      id: "ln-007",
      title: "Psychosocial check-in for Lydia Atieno",
      detail: "Assign trusted adult, document learner voice, and track next attendance point.",
      owner: "Church Development Worker",
      window: "This week",
      action: "prefill-referral",
      cta: "Open referral",
      tone: "signal",
    },
    {
      id: "ln-001",
      title: "Girls' dignity support review",
      detail: "Confirm menstrual-health follow-up is preventing future absences.",
      owner: "Girls' Support Focal Person",
      window: "Next 7 days",
      action: "prefill-message",
      cta: "Message caregiver",
      tone: "accent",
    },
  ].filter((action) => getVisibleLearners().some((learner) => learner.id === action.id));
}

function getVisibleReferralSummary(referral, learner) {
  if (referral.category !== "Safeguarding" || canViewSensitiveCases()) {
    return referral.summary;
  }

  return `${learner.name} has a confidential safeguarding case. Full details are limited to cleared roles.`;
}

function getVisibleLearnerConcern(learner) {
  const safeguardingReferral = getVisibleReferrals().find(
    (referral) => referral.learnerId === learner.id && referral.category === "Safeguarding"
  );

  if (safeguardingReferral && !canViewSensitiveCases()) {
    return "Sensitive welfare concern recorded. Full detail is restricted to safeguarding-cleared staff.";
  }

  return learner.concern;
}

function getVisibleLearnerNextStep(learner) {
  const safeguardingReferral = getVisibleReferrals().find(
    (referral) => referral.learnerId === learner.id && referral.category === "Safeguarding"
  );

  if (safeguardingReferral && !canViewSensitiveCases()) {
    return "Work through the safeguarding workflow and assigned cleared staff.";
  }

  return learner.nextStep;
}

function getVisibleCaregiverPhone(phone) {
  if (canViewCaregiverPhone()) {
    return phone;
  }

  return redactPhone(phone);
}

function redactPhone(phone) {
  if (!phone) return "Hidden";
  return `${phone.slice(0, 7)} XXX XXX`;
}

function downloadSnapshot() {
  saveLocalState();
  setSyncState(apiAvailable ? "healthy" : "offline", "Snapshot downloaded");
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `huruma-snapshot-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      setSyncState("offline", "Offline cache unavailable");
    });
  }
}

function persist(message) {
  saveLocalState();

  if (!apiAvailable) {
    setSyncState("offline", message || "Saved on this device");
    return;
  }

  if (persistHandle) {
    clearTimeout(persistHandle);
  }

  persistHandle = setTimeout(() => {
    persistHandle = null;
    persistRemoteState(message);
  }, 180);
}

async function persistRemoteState(message) {
  try {
    const response = await fetch("/api/state", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        state,
        reason: message || "State updated",
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const error = new Error(payload?.error || `Save failed with status ${response.status}`);
      error.apiReachable = true;
      throw error;
    }

    const payload = await response.json();
    apiAvailable = true;
    applySessionPayload(payload, { forceState: true });
    hydrateStaticText();
    populateSelects();
    renderAll();
    setSyncState("healthy", message || "Saved to local workspace");
  } catch (error) {
    apiAvailable = Boolean(error?.apiReachable) ? true : false;
    setSyncState(
      error?.message === "This role is read-only in the workspace."
        ? "error"
        : "offline",
      error?.message === "This role is read-only in the workspace."
        ? error.message
        : "Saved on this device - reconnecting to local API"
    );
  }
}

async function resetDemoState() {
  setSyncState("offline", "Resetting demo data...");

  try {
    if (!apiAvailable) {
      throw new Error("API unavailable");
    }

    const response = await fetch("/api/reset", {
      method: "POST",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const error = new Error(payload?.error || `Reset failed with status ${response.status}`);
      error.apiReachable = true;
      throw error;
    }

    const payload = await response.json();
    applySessionPayload(payload, { forceState: true });
    hydrateStaticText();
    populateSelects();
    renderAll();
    setSyncState("healthy", "Demo state reset from local workspace");
  } catch (error) {
    apiAvailable = Boolean(error?.apiReachable) ? true : false;
    if (!error?.apiReachable) {
      overwriteState(deepClone(seedState));
      normalizeUiState();
      saveLocalState();
      hydrateStaticText();
      populateSelects();
      renderAll();
    }
    setSyncState(
      error?.message === "This role cannot reset the shared demo workspace."
        ? "error"
        : "offline",
      error?.message === "This role cannot reset the shared demo workspace."
        ? error.message
        : "Demo state reset from device snapshot"
    );
  }
}

function setSyncState(mode, message) {
  const toneMap = {
    healthy: ["#82d687", message || "Sync healthy"],
    offline: ["#d9a441", message || "Offline mode"],
    error: ["#b65d35", message || "Sync needs review"],
  };
  const [color, copy] = toneMap[mode];
  el["sync-dot"].style.background = color;
  el["sync-dot"].style.boxShadow = `0 0 0 6px ${toRgba(color, 0.18)}`;
  el["sync-status"].textContent = copy;
}

function loadLocalState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return deepClone(seedState);
    const parsed = JSON.parse(saved);
    return parsed;
  } catch {
    return deepClone(seedState);
  }
}

function saveLocalState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadLocalSessionId() {
  try {
    return localStorage.getItem(`${STORAGE_KEY}-session`) || null;
  } catch {
    return null;
  }
}

function saveLocalSessionId() {
  if (session.currentUserId) {
    localStorage.setItem(`${STORAGE_KEY}-session`, session.currentUserId);
  } else {
    localStorage.removeItem(`${STORAGE_KEY}-session`);
  }
}

function loadLocalAuthOptions() {
  try {
    const saved = localStorage.getItem(`${STORAGE_KEY}-auth-options`);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveLocalAuthOptions() {
  localStorage.setItem(`${STORAGE_KEY}-auth-options`, JSON.stringify(session.authOptions || []));
}

function showAuthError(message) {
  el["auth-error"].hidden = false;
  el["auth-error"].textContent = message;
}

function clearAuthError() {
  el["auth-error"].hidden = true;
  el["auth-error"].textContent = "";
}

function getClassById(id) {
  return state.classes.find((group) => group.id === id);
}

function getLearnerById(id) {
  return state.learners.find((learner) => learner.id === id);
}

function getLearnersByClass(classId) {
  return state.learners.filter((learner) => learner.classId === classId);
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function capitalizeWords(text) {
  return text.replaceAll(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function riskTone(riskLevel) {
  if (riskLevel >= 5) return "danger";
  if (riskLevel >= 4) return "signal";
  if (riskLevel >= 2) return "accent";
  return "support";
}

function formatNow() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toTimeString().slice(0, 5);
  return `${date} ${time}`;
}

function toRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const bigint = Number.parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
