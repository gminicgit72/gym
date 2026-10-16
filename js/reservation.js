(function (global) {
  "use strict";

  const data = global.GymData;

  function getAvailability(state, classId, sessionId) {
    if (!state || !state.availability || !data.getSession(classId, sessionId)) {
      return 0;
    }

    const places = state.availability[data.getSessionKey(classId, sessionId)];
    return Number.isInteger(places) && places >= 0 ? places : 0;
  }

  function isSessionFull(state, classId, sessionId) {
    return Boolean(data.getSession(classId, sessionId)) &&
      getAvailability(state, classId, sessionId) === 0;
  }

  function calculateTotal(classId, participants) {
    const classItem = data.getClass(classId);
    if (!classItem || !Number.isInteger(participants) || participants < 0) {
      return 0;
    }

    return classItem.price * participants;
  }

  function validateReservation(state, request) {
    const errors = [];
    const reservation = request || {};
    const classItem = data.getClass(reservation.classId);
    const session = classItem && data.getSession(reservation.classId, reservation.sessionId);
    const participantCountValid = Number.isInteger(reservation.participants) && reservation.participants >= 1;

    if (!reservation.classId) {
      errors.push("class-required");
    } else if (!classItem) {
      errors.push("class-unknown");
    }

    if (!reservation.sessionId) {
      errors.push("session-required");
    } else if (classItem && !session) {
      errors.push("session-not-in-class");
    }

    if (!participantCountValid) {
      errors.push("participants-invalid");
    }

    if (session && participantCountValid) {
      const availablePlaces = getAvailability(state, reservation.classId, reservation.sessionId);
      if (availablePlaces === 0) {
        errors.push("session-full");
      } else if (reservation.participants > availablePlaces) {
        errors.push("participants-exceed-availability");
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  function confirmReservation(state, request) {
    const validation = validateReservation(state, request);
    if (!validation.valid) {
      const error = new Error("Reservation is invalid: " + validation.errors.join(", "));
      error.name = "ReservationValidationError";
      error.errors = validation.errors;
      throw error;
    }

    const classItem = data.getClass(request.classId);
    const key = data.getSessionKey(request.classId, request.sessionId);
    const booking = Object.freeze({
      id: "booking-" + (state.bookings.length + 1),
      classId: request.classId,
      sessionId: request.sessionId,
      participants: request.participants,
      unitPrice: classItem.price,
      totalPrice: calculateTotal(request.classId, request.participants)
    });
    const availability = Object.assign({}, state.availability);
    availability[key] -= request.participants;

    return {
      availability: availability,
      bookings: state.bookings.concat(booking)
    };
  }

  global.GymReservation = Object.freeze({
    getAvailability: getAvailability,
    isSessionFull: isSessionFull,
    calculateTotal: calculateTotal,
    validateReservation: validateReservation,
    confirmReservation: confirmReservation
  });
})(window);