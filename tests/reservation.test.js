(function (kit, data, reservation) {
  "use strict";

  const test = kit.test;
  const equal = kit.equal;
  const deepEqual = kit.deepEqual;
  const truthy = kit.truthy;
  const throws = kit.throws;
  const yogaMonday = "yoga-mon-1800";
  const yogaWednesday = "yoga-wed-1900";
  const pilatesFull = "pilates-sat-1130";

  function request(classId, sessionId, participants) {
    return { classId: classId, sessionId: sessionId, participants: participants };
  }

  test("availability reads initial places", function () {
    equal(reservation.getAvailability(data.createInitialState(), "yoga", yogaMonday), 10);
  });
  test("availability for unknown class is zero", function () {
    equal(reservation.getAvailability(data.createInitialState(), "unknown", "unknown"), 0);
  });
  test("availability for unknown session is zero", function () {
    equal(reservation.getAvailability(data.createInitialState(), "yoga", "unknown"), 0);
  });
  test("zero-place session is full", function () {
    truthy(reservation.isSessionFull(data.createInitialState(), "pilates", pilatesFull));
  });
  test("session with places is not full", function () {
    equal(reservation.isSessionFull(data.createInitialState(), "yoga", yogaMonday), false);
  });
  test("Yoga total price is calculated", function () {
    equal(reservation.calculateTotal("yoga", 1), 8);
  });
  test("Pilates total price is calculated", function () {
    equal(reservation.calculateTotal("pilates", 3), 30);
  });
  test("Functional Training total price is calculated", function () {
    equal(reservation.calculateTotal("functional-training", 2), 24);
  });
  test("Spinning total price is calculated", function () {
    equal(reservation.calculateTotal("spinning", 4), 44);
  });
  test("unknown class total price is zero", function () {
    equal(reservation.calculateTotal("unknown", 2), 0);
  });
  test("reservation requires a class", function () {
    truthy(reservation.validateReservation(data.createInitialState(), request("", yogaMonday, 1)).errors.includes("class-required"));
  });
  test("reservation rejects unknown class", function () {
    truthy(reservation.validateReservation(data.createInitialState(), request("unknown", "unknown", 1)).errors.includes("class-unknown"));
  });
  test("reservation requires a session", function () {
    truthy(reservation.validateReservation(data.createInitialState(), request("yoga", "", 1)).errors.includes("session-required"));
  });
  test("reservation rejects session from another class", function () {
    truthy(reservation.validateReservation(data.createInitialState(), request("yoga", pilatesFull, 1)).errors.includes("session-not-in-class"));
  });
  test("reservation rejects zero participants", function () {
    truthy(reservation.validateReservation(data.createInitialState(), request("yoga", yogaMonday, 0)).errors.includes("participants-invalid"));
  });
  test("reservation rejects negative participants", function () {
    truthy(reservation.validateReservation(data.createInitialState(), request("yoga", yogaMonday, -1)).errors.includes("participants-invalid"));
  });
  test("reservation rejects fractional participants", function () {
    truthy(reservation.validateReservation(data.createInitialState(), request("yoga", yogaMonday, 1.5)).errors.includes("participants-invalid"));
  });
  test("reservation rejects count above remaining places", function () {
    truthy(reservation.validateReservation(data.createInitialState(), request("yoga", yogaWednesday, 7)).errors.includes("participants-exceed-availability"));
  });
  test("reservation rejects a full session", function () {
    truthy(reservation.validateReservation(data.createInitialState(), request("pilates", pilatesFull, 1)).errors.includes("session-full"));
  });
  test("one participant is a valid reservation", function () {
    equal(reservation.validateReservation(data.createInitialState(), request("yoga", yogaMonday, 1)).valid, true);
  });
  test("reservation for exactly the remaining places is valid", function () {
    equal(reservation.validateReservation(data.createInitialState(), request("yoga", yogaWednesday, 6)).valid, true);
  });
  test("reservation for the full capacity is valid when ten places remain", function () {
    equal(reservation.validateReservation(data.createInitialState(), request("yoga", yogaMonday, 10)).valid, true);
  });
  test("confirmation deducts places", function () {
    const next = reservation.confirmReservation(data.createInitialState(), request("yoga", yogaMonday, 3));
    equal(reservation.getAvailability(next, "yoga", yogaMonday), 7);
  });
  test("confirmation does not mutate prior availability", function () {
    const initial = data.createInitialState();
    reservation.confirmReservation(initial, request("yoga", yogaMonday, 3));
    equal(reservation.getAvailability(initial, "yoga", yogaMonday), 10);
  });
  test("confirmation does not mutate prior bookings", function () {
    const initial = data.createInitialState();
    reservation.confirmReservation(initial, request("yoga", yogaMonday, 1));
    equal(initial.bookings.length, 0);
  });
  test("confirmation returns a new availability map", function () {
    const initial = data.createInitialState();
    const next = reservation.confirmReservation(initial, request("yoga", yogaMonday, 1));
    truthy(next.availability !== initial.availability);
  });
  test("confirmation returns a new bookings array", function () {
    const initial = data.createInitialState();
    const next = reservation.confirmReservation(initial, request("yoga", yogaMonday, 1));
    truthy(next.bookings !== initial.bookings);
  });
  test("booking record has only anonymous reservation fields", function () {
    const next = reservation.confirmReservation(data.createInitialState(), request("yoga", yogaMonday, 2));
    deepEqual(Object.keys(next.bookings[0]).sort(), ["classId", "id", "participants", "sessionId", "totalPrice", "unitPrice"]);
  });
  test("booking record contains calculated total", function () {
    const next = reservation.confirmReservation(data.createInitialState(), request("pilates", "pilates-tue-1800", 3));
    equal(next.bookings[0].totalPrice, 30);
  });
  test("repeated bookings use updated availability", function () {
    const first = reservation.confirmReservation(data.createInitialState(), request("yoga", yogaWednesday, 4));
    const second = reservation.confirmReservation(first, request("yoga", yogaWednesday, 2));
    equal(reservation.getAvailability(second, "yoga", yogaWednesday), 0);
    equal(second.bookings.length, 2);
  });
  test("repeated booking cannot exceed the remaining places", function () {
    const first = reservation.confirmReservation(data.createInitialState(), request("yoga", yogaWednesday, 4));
    const error = throws(function () {
      reservation.confirmReservation(first, request("yoga", yogaWednesday, 3));
    }, "ReservationValidationError");
    truthy(error.errors.includes("participants-exceed-availability"));
  });
})(window.TestKit, window.GymData, window.GymReservation);