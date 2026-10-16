(function (kit, data, reservation, testHelpers) {
  "use strict";

  const test = kit.test;
  const equal = kit.equal;
  const truthy = kit.truthy;

  function selectedYoga(app) {
    app.selectClass("yoga");
    app.selectSession("yoga-mon-1800");
  }

  test("participant input is disabled before a session is selected", function () {
    testHelpers.withTestApp(function (app, root) {
      truthy(root.querySelector("#participant-count").disabled);
    });
  });
  test("participant input minimum is one", function () {
    testHelpers.withTestApp(function (app, root) {
      selectedYoga(app);
      equal(root.querySelector("#participant-count").min, "1");
    });
  });
  test("participant input maximum matches availability", function () {
    testHelpers.withTestApp(function (app, root) {
      app.selectClass("yoga");
      app.selectSession("yoga-wed-1900");
      equal(root.querySelector("#participant-count").max, "6");
    });
  });
  test("participant count starts at one", function () {
    testHelpers.withTestApp(function (app) {
      selectedYoga(app);
      equal(app.snapshot().participants, 1);
    });
  });
  test("participant count can be changed", function () {
    testHelpers.withTestApp(function (app) {
      selectedYoga(app);
      app.setParticipants(4);
      equal(app.snapshot().participants, 4);
    });
  });
  test("summary reflects participant count", function () {
    testHelpers.withTestApp(function (app) {
      selectedYoga(app);
      app.setParticipants(3);
      equal(app.snapshot().summary.participants, "3");
    });
  });
  test("summary total updates with participant count", function () {
    testHelpers.withTestApp(function (app) {
      selectedYoga(app);
      app.setParticipants(3);
      equal(app.snapshot().summary.totalPrice, "€24");
    });
  });
  test("valid participant count enables confirmation", function () {
    testHelpers.withTestApp(function (app) {
      selectedYoga(app);
      app.setParticipants(2);
      equal(app.snapshot().canConfirm, true);
    });
  });
  test("zero participants disables confirmation", function () {
    testHelpers.withTestApp(function (app) {
      selectedYoga(app);
      app.setParticipants(0);
      equal(app.snapshot().canConfirm, false);
    });
  });
  test("negative participant count disables confirmation", function () {
    testHelpers.withTestApp(function (app) {
      selectedYoga(app);
      app.setParticipants(-1);
      equal(app.snapshot().canConfirm, false);
    });
  });
  test("fractional participant count disables confirmation", function () {
    testHelpers.withTestApp(function (app) {
      selectedYoga(app);
      app.setParticipants(1.5);
      equal(app.snapshot().canConfirm, false);
    });
  });
  test("count above availability disables confirmation", function () {
    testHelpers.withTestApp(function (app) {
      app.selectClass("yoga");
      app.selectSession("yoga-wed-1900");
      app.setParticipants(7);
      equal(app.snapshot().canConfirm, false);
    });
  });
  test("blank participant input disables confirmation", function () {
    testHelpers.withTestApp(function (app) {
      selectedYoga(app);
      app.setParticipants("");
      equal(app.snapshot().canConfirm, false);
    });
  });
  test("changing session resets participant count", function () {
    testHelpers.withTestApp(function (app) {
      app.selectClass("yoga");
      app.selectSession("yoga-mon-1800");
      app.setParticipants(8);
      app.selectSession("yoga-wed-1900");
      equal(app.snapshot().participants, 1);
    });
  });
  test("full session cannot be selected", function () {
    testHelpers.withTestApp(function (app) {
      app.selectClass("pilates");
      equal(app.selectSession("pilates-sat-1130"), false);
    });
  });
  test("summary displays unit price", function () {
    testHelpers.withTestApp(function (app) {
      selectedYoga(app);
      equal(app.snapshot().summary.unitPrice, "€8");
    });
  });
  test("participant limit updates after an earlier booking", function () {
    const initial = data.createInitialState();
    const booked = reservation.confirmReservation(initial, { classId: "yoga", sessionId: "yoga-mon-1800", participants: 6 });
    testHelpers.withTestApp(function (app, root) {
      selectedYoga(app);
      equal(root.querySelector("#participant-count").max, "4");
    }, booked);
  });
})(window.TestKit, window.GymData, window.GymReservation, window.GymUITestHelpers);