(function (kit, testHelpers) {
  "use strict";

  const test = kit.test;
  const equal = kit.equal;
  const truthy = kit.truthy;

  test("class choices are in a named group", function () {
    testHelpers.withTestApp(function (app, root) {
      equal(root.querySelector('[role="group"][aria-labelledby="class-heading"]') !== null, true);
    });
  });
  test("selected class exposes its pressed state", function () {
    testHelpers.withTestApp(function (app, root) {
      app.selectClass("yoga");
      equal(root.querySelector('[data-class-id="yoga"]').getAttribute("aria-pressed"), "true");
    });
  });
  test("session choices are in a named group", function () {
    testHelpers.withTestApp(function (app, root) {
      app.selectClass("yoga");
      equal(root.querySelector('[role="group"][aria-labelledby="session-heading"]') !== null, true);
    });
  });
  test("session choice names include time and availability", function () {
    testHelpers.withTestApp(function (app, root) {
      app.selectClass("yoga");
      truthy(root.querySelector('[data-session-id="yoga-wed-1900"]').getAttribute("aria-label").includes("Wednesday 19:00, 6 places left"));
    });
  });
  test("full session remains disabled to assistive technology", function () {
    testHelpers.withTestApp(function (app, root) {
      app.selectClass("pilates");
      equal(root.querySelector('[data-session-id="pilates-sat-1130"]').disabled, true);
    });
  });
  test("participant input has an associated label", function () {
    testHelpers.withTestApp(function (app, root) {
      truthy(root.querySelector('label[for="participant-count"]'));
      equal(root.querySelector("#participant-count").labels[0].textContent, "Number of participants");
    });
  });
  test("participant input descriptions resolve to visible elements", function () {
    testHelpers.withTestApp(function (app, root) {
      const ids = root.querySelector("#participant-count").getAttribute("aria-describedby").split(" ");
      truthy(ids.every(function (id) { return root.querySelector("#" + id); }));
    });
  });
  test("reservation summary announces changes politely", function () {
    testHelpers.withTestApp(function (app, root) {
      const summary = root.querySelector(".summary-list");
      equal(summary.getAttribute("aria-live"), "polite");
      equal(summary.getAttribute("aria-atomic"), "true");
    });
  });
  test("invalid reservation feedback uses an alert role", function () {
    testHelpers.withTestApp(function (app, root) {
      app.selectClass("yoga");
      app.selectSession("yoga-mon-1800");
      app.setParticipants(0);
      equal(root.querySelector("#participant-message").getAttribute("role"), "alert");
      truthy(root.querySelector("#participant-message").textContent.length > 0);
    });
  });
  test("invalid participant input is identified", function () {
    testHelpers.withTestApp(function (app, root) {
      app.selectClass("yoga");
      app.selectSession("yoga-mon-1800");
      app.setParticipants(0);
      equal(root.querySelector("#participant-count").getAttribute("aria-invalid"), "true");
    });
  });
  test("class selection keeps keyboard focus on the selected class", function () {
    testHelpers.withTestApp(function (app, root) {
      app.selectClass("yoga");
      equal(document.activeElement, root.querySelector('[data-class-id="yoga"]'));
    });
  });
  test("confirmation moves focus to the success heading", function () {
    testHelpers.withTestApp(function (app, root) {
      app.selectClass("yoga");
      app.selectSession("yoga-mon-1800");
      app.confirm();
      equal(document.activeElement, root.querySelector("#confirmation-title"));
    });
  });
  test("starting another reservation returns focus to class choices", function () {
    testHelpers.withTestApp(function (app, root) {
      app.selectClass("yoga");
      app.selectSession("yoga-mon-1800");
      app.confirm();
      app.startAnother();
      equal(document.activeElement, root.querySelector('[data-action="select-class"]'));
    });
  });
})(window.TestKit, window.GymUITestHelpers);