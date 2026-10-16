(function (kit, data, uiHelpers, testHelpers) {
  "use strict";

  const test = kit.test;
  const equal = kit.equal;
  const deepEqual = kit.deepEqual;
  const truthy = kit.truthy;

  test("UI formats prices in euros", function () {
    equal(uiHelpers.formatEuro(12), "€12");
  });
  test("UI labels zero availability as full", function () {
    equal(uiHelpers.getAvailabilityText(0), "Full");
  });
  test("UI labels one remaining place", function () {
    equal(uiHelpers.getAvailabilityText(1), "1 place left");
  });
  test("UI labels multiple remaining places", function () {
    equal(uiHelpers.getAvailabilityText(3), "3 places left");
  });
  test("participant bounds disable full sessions", function () {
    deepEqual(uiHelpers.getParticipantBounds(0), { min: 0, max: 0 });
  });
  test("participant bounds match available places", function () {
    deepEqual(uiHelpers.getParticipantBounds(4), { min: 1, max: 4 });
  });
  test("empty UI summary prompts for selections", function () {
    const summary = uiHelpers.buildSummary(null, null, 1);
    equal(summary.className, "Select a class");
    equal(summary.totalPrice, "—");
  });
  test("UI summary displays selected class and total", function () {
    const summary = uiHelpers.buildSummary(data.getClass("yoga"), data.getSession("yoga", "yoga-mon-1800"), 2);
    equal(summary.className, "Yoga");
    equal(summary.sessionLabel, "Monday · 18:00");
    equal(summary.totalPrice, "€16");
  });
  test("UI renders four class choices", function () {
    testHelpers.withTestApp(function (app, root) {
      equal(root.querySelectorAll("[data-action=select-class]").length, 4);
    });
  });
  test("selected class exposes pressed state", function () {
    testHelpers.withTestApp(function (app, root) {
      app.selectClass("yoga");
      equal(root.querySelector('[data-class-id="yoga"]').getAttribute("aria-pressed"), "true");
    });
  });
  test("selected class renders three sessions", function () {
    testHelpers.withTestApp(function (app, root) {
      app.selectClass("pilates");
      equal(root.querySelectorAll("[data-action=select-session]").length, 3);
    });
  });
  test("changing class clears the previous session", function () {
    testHelpers.withTestApp(function (app) {
      app.selectClass("yoga");
      app.selectSession("yoga-mon-1800");
      app.selectClass("spinning");
      equal(app.snapshot().sessionId, "");
    });
  });
  test("selecting a session updates summary", function () {
    testHelpers.withTestApp(function (app) {
      app.selectClass("yoga");
      app.selectSession("yoga-wed-1900");
      equal(app.snapshot().summary.sessionLabel, "Wednesday · 19:00");
    });
  });
  test("session choice displays remaining places", function () {
    testHelpers.withTestApp(function (app, root) {
      app.selectClass("yoga");
      equal(root.querySelector('[data-session-id="yoga-wed-1900"]').getAttribute("aria-label"), "Wednesday 19:00, 6 places left");
    });
  });
  test("full session button is disabled", function () {
    testHelpers.withTestApp(function (app, root) {
      app.selectClass("pilates");
      truthy(root.querySelector('[data-session-id="pilates-sat-1130"]').disabled);
    });
  });
  test("selected class shows its per-person price", function () {
    testHelpers.withTestApp(function (app, root) {
      app.selectClass("functional-training");
      truthy(root.textContent.includes("€12 / person"));
    });
  });
})(window.TestKit, window.GymData, window.GymUIHelpers, window.GymUITestHelpers);