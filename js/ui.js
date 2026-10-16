(function (global) {
  "use strict";

  const data = global.GymData;
  const reservation = global.GymReservation;
  const helpers = global.GymUIHelpers;

  const errorMessages = {
    "class-required": "Choose a class to continue.",
    "class-unknown": "Choose one of the listed classes.",
    "session-required": "Choose a session to continue.",
    "session-not-in-class": "Choose a session belonging to this class.",
    "participants-invalid": "Enter a whole number of at least one participant.",
    "session-full": "This session is full. Choose another session.",
    "participants-exceed-availability": "The participant count exceeds the places remaining."
  };

  function escapeText(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  function create(root, initialState) {
    const view = {
      reservationState: initialState || data.createInitialState(),
      classId: "",
      sessionId: "",
      participants: 1,
      booking: null,
      message: ""
    };

    function currentClass() {
      return data.getClass(view.classId);
    }

    function currentSession() {
      return data.getSession(view.classId, view.sessionId);
    }

    function currentAvailability() {
      return reservation.getAvailability(view.reservationState, view.classId, view.sessionId);
    }

    function snapshot() {
      const classItem = currentClass();
      const session = currentSession();
      return {
        classId: view.classId,
        sessionId: view.sessionId,
        participants: view.participants,
        availability: currentAvailability(),
        summary: helpers.buildSummary(classItem, session, view.participants),
        canConfirm: !view.booking && helpers.canConfirm(view.reservationState, view.classId, view.sessionId, view.participants),
        booking: view.booking
      };
    }

    function renderClasses() {
      return data.classes.map(function (classItem) {
        const selected = view.classId === classItem.id;
        return '<button class="class-option" type="button" data-action="select-class" data-class-id="' + escapeText(classItem.id) + '" aria-pressed="' + selected + '">' +
          '<span><span class="class-name">' + escapeText(classItem.name) + '</span><span class="class-price">' + helpers.formatEuro(classItem.price) + ' / person</span></span>' +
          '<span class="selection-mark" aria-hidden="true">' + (selected ? "✓" : "+") + '</span></button>';
      }).join("");
    }

    function renderSessions() {
      const classItem = currentClass();
      if (!classItem) {
        return '<p class="empty-state">Choose a class to see its sessions.</p>';
      }

      return '<div class="session-list">' + classItem.sessions.map(function (session) {
        const available = reservation.getAvailability(view.reservationState, classItem.id, session.id);
        const full = available === 0;
        const selected = view.sessionId === session.id;
        return '<button class="session-option" type="button" data-action="select-session" data-session-id="' + escapeText(session.id) + '" aria-pressed="' + selected + '" aria-label="' + escapeText(session.day + " " + session.time + ", " + helpers.getAvailabilityText(available)) + '"' + (full ? " disabled" : "") + '>' +
          '<span class="session-day">' + escapeText(session.day) + '</span><span class="session-time">' + escapeText(session.time) + '</span><span class="session-places">' + escapeText(helpers.getAvailabilityText(available)) + '</span></button>';
      }).join("") + '</div>';
    }

    function renderSummary() {
      const current = snapshot();
      return '<section class="summary-panel" aria-labelledby="summary-title"><p class="summary-kicker">Your selection</p><h2 id="summary-title">Reservation summary</h2>' +
        '<dl class="summary-list" aria-live="polite" aria-atomic="true"><div class="summary-row"><dt>Class</dt><dd>' + escapeText(current.summary.className) + '</dd></div>' +
        '<div class="summary-row"><dt>Session</dt><dd>' + escapeText(current.summary.sessionLabel) + '</dd></div>' +
        '<div class="summary-row"><dt>Participants</dt><dd>' + escapeText(current.summary.participants) + '</dd></div>' +
        '<div class="summary-row"><dt>Per person</dt><dd>' + escapeText(current.summary.unitPrice) + '</dd></div>' +
        '<div class="summary-row summary-total"><dt>Total</dt><dd>' + escapeText(current.summary.totalPrice) + '</dd></div></dl>' +
        '<button class="confirm-button" type="button" data-action="confirm" id="confirm-button"' + (current.canConfirm ? "" : " disabled") + '>Confirm reservation</button>' +
        '<p class="no-payment">No payment is taken here.</p></section>';
    }

    function renderConfirmation() {
      const booking = view.booking;
      const classItem = data.getClass(booking.classId);
      const session = data.getSession(booking.classId, booking.sessionId);
      return '<section class="confirmation" aria-labelledby="confirmation-title" aria-live="polite"><p class="eyebrow">Reservation complete</p><h1 id="confirmation-title" tabindex="-1">You\'re on the list.</h1>' +
        '<p class="confirmation-copy">Your places are reserved for this session.</p><dl class="confirmation-details">' +
        '<div><dt>Class</dt><dd>' + escapeText(classItem.name) + '</dd></div>' +
        '<div><dt>Session</dt><dd>' + escapeText(session.day + " " + session.time) + '</dd></div>' +
        '<div><dt>Participants</dt><dd>' + booking.participants + '</dd></div>' +
        '<div><dt>Total price</dt><dd>' + helpers.formatEuro(booking.totalPrice) + '</dd></div></dl>' +
        '<button class="another-button" type="button" data-action="another">Make another reservation</button></section>';
    }

    function render(focusSelector) {
      const activeParticipantInput = document.activeElement && document.activeElement.id === "participant-count";
      if (view.booking) {
        root.innerHTML = '<div class="booking-shell"><header class="masthead"><div class="wordmark"><span class="wordmark-mark" aria-hidden="true"></span><span>KIN STUDIO</span></div><span class="masthead-note">Class reservations</span></header>' + renderConfirmation() + '</div>';
        if (focusSelector) {
          root.querySelector(focusSelector).focus();
        }
        return;
      }

      const classItem = currentClass();
      const available = currentAvailability();
      const hasReservableSession = Boolean(view.sessionId && available > 0);
      const participantBounds = helpers.getParticipantBounds(hasReservableSession ? available : 0);
      const errors = reservation.validateReservation(view.reservationState, {
        classId: view.classId,
        sessionId: view.sessionId,
        participants: view.participants
      }).errors;
      const message = view.message || (view.sessionId && errors.length ? errorMessages[errors[0]] || "Check your reservation details." : "");

      root.innerHTML = '<div class="booking-shell"><header class="masthead"><div class="wordmark"><span class="wordmark-mark" aria-hidden="true"></span><span>KIN STUDIO</span></div><span class="masthead-note">Move together · Book a class</span></header>' +
        '<section class="intro"><p class="eyebrow">Group movement / weekly sessions</p><h1>Reserve your place.</h1><p>Choose a class and a time that works for you.</p></section>' +
        '<div class="booking-layout"><div class="booking-form"><section class="form-section" aria-labelledby="class-heading"><h2 class="section-heading" id="class-heading"><span class="step-number">01</span> Choose a class</h2><div class="class-grid" role="group" aria-labelledby="class-heading">' + renderClasses() + '</div></section>' +
        '<section class="form-section" aria-labelledby="session-heading"><h2 class="section-heading" id="session-heading"><span class="step-number">02</span> Choose a session</h2><div role="group" aria-labelledby="session-heading">' + renderSessions() + '</div></section>' +
        '<section class="form-section" aria-labelledby="participant-heading"><h2 class="section-heading" id="participant-heading"><span class="step-number">03</span> Participants</h2><div class="participant-control"><label for="participant-count">Number of participants</label><input id="participant-count" name="participants" type="number" min="' + participantBounds.min + '" max="' + participantBounds.max + '" step="1" inputmode="numeric" value="' + (Number.isFinite(view.participants) ? view.participants : "") + '"' + (hasReservableSession ? "" : " disabled") + ' aria-describedby="participant-hint participant-message" aria-invalid="' + (view.sessionId && errors.length ? "true" : "false") + '"><p class="field-hint" id="participant-hint">' + (hasReservableSession ? "1 to " + available + " places available" : "Choose an available session first.") + '</p></div><p class="form-message" id="participant-message" role="alert">' + escapeText(message) + '</p></section></div>' + renderSummary() + '</div></div>';

      if (focusSelector) {
        const focusTarget = root.querySelector(focusSelector);
        if (focusTarget) {
          focusTarget.focus();
        }
      } else if (activeParticipantInput) {
        const input = root.querySelector("#participant-count");
        if (input) {
          input.focus();
        }
      }
    }

    function selectClass(classId) {
      if (!data.getClass(classId)) {
        return false;
      }
      view.classId = classId;
      view.sessionId = "";
      view.participants = 1;
      view.message = "";
      render('[data-class-id="' + classId + '"]');
      return true;
    }

    function selectSession(sessionId) {
      if (!data.getSession(view.classId, sessionId)) {
        return false;
      }
      const available = reservation.getAvailability(view.reservationState, view.classId, sessionId);
      if (available === 0) {
        return false;
      }
      view.sessionId = sessionId;
      view.participants = 1;
      view.message = "";
      render('[data-session-id="' + sessionId + '"]');
      return true;
    }

    function setParticipants(value) {
      if (value === "" || value === null || typeof value === "undefined") {
        view.participants = NaN;
      } else {
        view.participants = typeof value === "number" ? value : Number(value);
      }
      view.message = "";
      render();
      return snapshot().canConfirm;
    }

    function confirm() {
      try {
        view.reservationState = reservation.confirmReservation(view.reservationState, {
          classId: view.classId,
          sessionId: view.sessionId,
          participants: view.participants
        });
        view.booking = view.reservationState.bookings[view.reservationState.bookings.length - 1];
        view.message = "";
        render("#confirmation-title");
        return true;
      } catch (error) {
        const key = error.errors && error.errors[0];
        view.message = errorMessages[key] || "Check your reservation details.";
        render();
        return false;
      }
    }

    function startAnother() {
      view.classId = "";
      view.sessionId = "";
      view.participants = 1;
      view.booking = null;
      view.message = "";
      render('[data-action="select-class"]');
    }

    function handleClick(event) {
      const button = event.target.closest("[data-action]");
      if (!button || !root.contains(button)) {
        return;
      }
      if (button.dataset.action === "select-class") {
        selectClass(button.dataset.classId);
      } else if (button.dataset.action === "select-session") {
        selectSession(button.dataset.sessionId);
      } else if (button.dataset.action === "confirm") {
        confirm();
      } else if (button.dataset.action === "another") {
        startAnother();
      }
    }

    function handleInput(event) {
      if (event.target.id === "participant-count") {
        setParticipants(event.target.value);
      }
    }

    root.addEventListener("click", handleClick);
    root.addEventListener("input", handleInput);
    render();

    return Object.freeze({
      render: render,
      snapshot: snapshot,
      selectClass: selectClass,
      selectSession: selectSession,
      setParticipants: setParticipants,
      confirm: confirm,
      startAnother: startAnother,
      destroy: function () {
        root.removeEventListener("click", handleClick);
        root.removeEventListener("input", handleInput);
      }
    });
  }

  global.GymUI = Object.freeze({ create: create });
})(window);