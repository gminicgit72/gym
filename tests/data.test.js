(function (kit, data) {
  "use strict";

  const test = kit.test;
  const equal = kit.equal;
  const deepEqual = kit.deepEqual;
  const truthy = kit.truthy;
  const classIds = ["yoga", "pilates", "functional-training", "spinning"];
  const expectedPlaces = {
    yoga: [10, 6, 2],
    pilates: [8, 4, 0],
    "functional-training": [5, 10, 3],
    spinning: [7, 1, 10]
  };

  test("catalog has four classes", function () {
    equal(data.classes.length, 4);
  });
  test("catalog class ids are correct", function () {
    deepEqual(data.classes.map(function (classItem) { return classItem.id; }), classIds);
  });
  test("catalog class names are correct", function () {
    deepEqual(data.classes.map(function (classItem) { return classItem.name; }), ["Yoga", "Pilates", "Functional Training", "Spinning"]);
  });
  test("catalog prices are correct", function () {
    deepEqual(data.classes.map(function (classItem) { return classItem.price; }), [8, 10, 12, 11]);
  });
  test("each class has three sessions", function () {
    truthy(data.classes.every(function (classItem) { return classItem.sessions.length === 3; }));
  });
  test("catalog has twelve sessions total", function () {
    equal(data.getAllSessions().length, 12);
  });
  test("session ids are unique", function () {
    const ids = data.getAllSessions().map(function (item) { return item.session.id; });
    equal(new Set(ids).size, 12);
  });
  test("Yoga schedules match the requirements", function () {
    deepEqual(data.getClass("yoga").sessions.map(function (session) { return [session.day, session.time]; }), [["Monday", "18:00"], ["Wednesday", "19:00"], ["Saturday", "10:00"]]);
  });
  test("Pilates schedules match the requirements", function () {
    deepEqual(data.getClass("pilates").sessions.map(function (session) { return [session.day, session.time]; }), [["Tuesday", "18:00"], ["Thursday", "19:00"], ["Saturday", "11:30"]]);
  });
  test("Functional Training schedules match the requirements", function () {
    deepEqual(data.getClass("functional-training").sessions.map(function (session) { return [session.day, session.time]; }), [["Monday", "19:30"], ["Wednesday", "18:00"], ["Friday", "18:30"]]);
  });
  test("Spinning schedules match the requirements", function () {
    deepEqual(data.getClass("spinning").sessions.map(function (session) { return [session.day, session.time]; }), [["Tuesday", "19:30"], ["Thursday", "18:00"], ["Sunday", "10:00"]]);
  });
  test("Yoga initial places match the requirements", function () {
    deepEqual(data.getClass("yoga").sessions.map(function (session) { return session.initialPlaces; }), expectedPlaces.yoga);
  });
  test("Pilates initial places match the requirements", function () {
    deepEqual(data.getClass("pilates").sessions.map(function (session) { return session.initialPlaces; }), expectedPlaces.pilates);
  });
  test("Functional Training initial places match the requirements", function () {
    deepEqual(data.getClass("functional-training").sessions.map(function (session) { return session.initialPlaces; }), expectedPlaces["functional-training"]);
  });
  test("Spinning initial places match the requirements", function () {
    deepEqual(data.getClass("spinning").sessions.map(function (session) { return session.initialPlaces; }), expectedPlaces.spinning);
  });
  test("initial state contains all twelve availability entries", function () {
    equal(Object.keys(data.createInitialState().availability).length, 12);
  });
  test("initial state totals sixty-six available places", function () {
    const availability = data.createInitialState().availability;
    equal(Object.keys(availability).reduce(function (sum, key) { return sum + availability[key]; }, 0), 66);
  });
  test("initial state has no bookings", function () {
    deepEqual(data.createInitialState().bookings, []);
  });
  test("fresh states have separate state and collection objects", function () {
    const first = data.createInitialState();
    const second = data.createInitialState();
    truthy(first !== second && first.availability !== second.availability && first.bookings !== second.bookings);
  });
})(window.TestKit, window.GymData);