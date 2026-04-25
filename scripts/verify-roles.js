const { JSDOM } = require("jsdom");

async function inspect(url) {
  const dom = await JSDOM.fromURL(url, {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
    beforeParse(window) {
      window.fetch = (resource, options) => fetch(new URL(resource, url), options);
      window.navigator.serviceWorker = {
        register() {
          return Promise.resolve();
        },
      };
    },
  });

  const start = Date.now();
  while (Date.now() - start < 10000) {
    const appVisible = dom.window.document.getElementById("app-shell")?.hidden === false;
    const teacherName = dom.window.document.getElementById("teacher-name")?.textContent?.trim();
    if (appVisible && teacherName && teacherName !== "Choose a workspace") {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  return {
    teacherName: dom.window.document.getElementById("teacher-name")?.textContent?.trim(),
    teacherRole: dom.window.document.getElementById("teacher-role")?.textContent?.trim(),
    syncStatus: dom.window.document.getElementById("sync-status")?.textContent?.trim(),
    appHidden: dom.window.document.getElementById("app-shell")?.hidden,
    authHidden: dom.window.document.getElementById("auth-gate")?.hidden,
    markAllPresentHidden: dom.window.document.getElementById("mark-all-present")?.hidden,
    quickNoteHidden: dom.window.document.getElementById("quick-note-form")?.hidden,
    notesLockHidden: dom.window.document.getElementById("notes-lock")?.hidden,
    learnerDetail:
      dom.window.document.getElementById("learner-detail")?.textContent?.replace(/\s+/g, " ").trim() || "",
    navInsightsHidden:
      dom.window.document.querySelector('.nav-link[data-target="insights"]')?.hidden ?? null,
  };
}

async function main() {
  const grace = await inspect("http://127.0.0.1:4173/index.html?as=usr-grace");
  const ruth = await inspect("http://127.0.0.1:4173/index.html?as=usr-ruth");

  const checks = [
    {
      ok: grace.teacherName === "Grace Mwende",
      label: "Teacher profile renders for Grace",
    },
    {
      ok: grace.teacherRole === "Teacher",
      label: "Teacher role badge renders",
    },
    {
      ok: grace.learnerDetail.includes("+254 712 600 114"),
      label: "Teacher can view full caregiver phone on assigned learner",
    },
    {
      ok: grace.navInsightsHidden === true,
      label: "Insights nav is hidden for teacher role",
    },
    {
      ok: ruth.teacherName === "Ruth Achieng",
      label: "Coordinator profile renders for Ruth",
    },
    {
      ok: ruth.teacherRole === "Education Coordinator",
      label: "Coordinator role badge renders",
    },
    {
      ok: ruth.learnerDetail.includes("XXX XXX"),
      label: "Coordinator view masks caregiver phone",
    },
    {
      ok: ruth.navInsightsHidden === false,
      label: "Insights nav is visible for coordinator role",
    },
    {
      ok: ruth.markAllPresentHidden === true,
      label: "Coordinator cannot access attendance write controls",
    },
    {
      ok: ruth.quickNoteHidden === true && ruth.notesLockHidden === false,
      label: "Coordinator sees read-only note access state",
    },
  ];

  const failed = checks.filter((check) => !check.ok);
  console.log(JSON.stringify({ checks, grace, ruth }, null, 2));

  if (failed.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
