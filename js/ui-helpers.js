(function (global) {
  "use strict";

  const reservation = global.GymReservation;

  function formatEuro(amount) {
    return "€" + amount;
  }

  function getParticipantBounds(availablePlaces) {
    const maximum = Number.isInteger(availablePlaces) && availablePlaces > 0 ? availablePlaces : 0;
    return { min: maximum > 0 ? 1 : 0, max: maximum };
  }

  function getAvailabilityText(availablePlaces) {
    if (availablePlaces <= 0) {
      return "Full";
    }
    return availablePlaces === 1 ? "1 place left" : availablePlaces + " places left";
  }

  function buildSummary(classItem, session, participants) {
    const participantCount = Number.isInteger(participants) && participants >= 1 ? participants : 0;
    return {
      className: classItem ? classItem.name : "Select a class",
      sessionLabel: session ? session.day + " · " + session.time : "Select a session",
      participants: participantCount ? String(participantCount) : "—",
      unitPrice: classItem ? formatEuro(classItem.price) : "—",
      totalPrice: classItem && participantCount
        ? formatEuro(reservation.calculateTotal(classItem.id, participantCount))
        : "—"
    };
  }

  function canConfirm(state, classId, sessionId, participants) {
    return reservation.validateReservation(state, {
      classId: classId,
      sessionId: sessionId,
      participants: participants
    }).valid;
  }

  global.GymUIHelpers = Object.freeze({
    formatEuro: formatEuro,
    getParticipantBounds: getParticipantBounds,
    getAvailabilityText: getAvailabilityText,
    buildSummary: buildSummary,
    canConfirm: canConfirm
  });
})(window);