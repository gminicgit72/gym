(function (kit, data, reservation, testHelpers) {
  "use strict";

  const test = kit.test;
  const equal = kit.equal;
  const truthy = kit.truthy;

  function readyYoga(app, participants) {
    app.selectClass("yoga");
    app.selectSession("yoga-mon-1800");
    if (participants !== 1) {
      app.setParticipants(participants);
    }
  }

  test("confirmation is disabled before a complete selection", function () {
    testHelpers.withTestApp(function (app, root) {
      truthy(root.querySelector("#confirm-button").disabled);
    });
  });
  test("complete selection enables confirmation", function () {
    testHelpers.withTestApp(function (app, root) {
      readyYoga(app, 2);
      equal(root.querySelector("#confirm-button").disabled, false);
    });
  });
  test("invalid direct confirmation is rejected", function () {
    testHelpers.withTestApp(function (app) {
      equal(app.confirm(), false);
      equal(app.snapshot().booking, null);
    });
  });
  test("confirmation displays a success screen", function () {
    testHelpers.withTestApp(function (app, root) {
      readyYoga(app, 2);
      app.confirm();
      truthy(root.querySelector("#confirmation-title"));
    });
  });
  test("confirmation shows the reserved class", function () {
    testHelpers.withTestApp(function (app, root) {
      readyYoga(app, 1);
      app.confirm();
      truthy(root.textContent.includes("Yoga"));
    });
  });
  test("confirmation shows the reserved session", function () {
    testHelpers.withTestApp(function (app, root) {
      readyYoga(app, 1);
      app.confirm();
      truthy(root.textContent.includes("Monday 18:00"));
    });
  });
  test("confirmation shows participant count", function () {
    testHelpers.withTestApp(function (app, root) {
      readyYoga(app, 3);
      app.confirm();
      truthy(root.textContent.includes("3"));
    });
  });
  test("confirmation shows total price", function () {
    testHelpers.withTestApp(function (app, root) {
      readyYoga(app, 3);
      app.confirm();
      truthy(root.textContent.includes("€24"));
    });
  });
  test("confirmation deducts availability", function () {
    testHelpers.withTestApp(function (app) {
      readyYoga(app, 3);
      app.confirm();
      app.startAnother();
      app.selectClass("yoga");
      app.selectSession("yoga-mon-1800");
      equal(app.snapshot().availability, 7);
    });
  });
  test("success screen offers another reservation", function () {
    testHelpers.withTestApp(function (app, root) {
      readyYoga(app, 1);
      app.confirm();
      truthy(root.querySelector('[data-action="another"]'));
    });
  });
  test("starting another reservation clears selections", function () {
    testHelpers.withTestApp(function (app) {
      readyYoga(app, 1);
      app.confirm();
      app.startAnother();
      equal(app.snapshot().classId, "");
      equal(app.snapshot().sessionId, "");
    });
  });
  test("starting another reservation preserves deducted places", function () {
    testHelpers.withTestApp(function (app) {
      readyYoga(app, 5);
      app.confirm();
      app.startAnother();
      app.selectClass("yoga");
      app.selectSession("yoga-mon-1800");
      equal(app.snapshot().availability, 5);
    });
  });
  test("starting another reservation preserves booking history in memory", function () {
    testHelpers.withTestApp(function (app) {
      readyYoga(app, 1);
      app.confirm();
      app.startAnother();
      app.selectClass("yoga");
      app.selectSession("yoga-wed-1900");
      app.setParticipants(1);
      app.confirm();
      equal(app.snapshot().booking.id, "booking-2");
    });
  });
  test("booking all places makes session unavailable after reset", function () {
    testHelpers.withTestApp(function (app, root) {
      readyYoga(app, 10);
      app.confirm();
      app.startAnother();
      app.selectClass("yoga");
      truthy(root.querySelector('[data-session-id="yoga-mon-1800"]').disabled);
    });
  });
  test("another session remains reservable after a booking", function () {
    testHelpers.withTestApp(function (app) {
      readyYoga(app, 10);
      app.confirm();
      app.startAnother();
      app.selectClass("yoga");
      equal(app.selectSession("yoga-wed-1900"), true);
    });
  });
  test("confirmation screen contains no personal data fields", function () {
    testHelpers.withTestApp(function (app, root) {
      readyYoga(app, 1);
      app.confirm();
      equal(root.querySelectorAll("input").length, 0);
      equal(root.querySelectorAll("form").length, 0);
    });
  });
})(window.TestKit, window.GymData, window.GymReservation, window.GymUITestHelpers);