# Gym Class Reservation Requirements

This document translates [BRD.md](BRD.md) into implementation and verification requirements. If a requirement here appears to conflict with the BRD, the BRD is authoritative.

## 1. Product Goal

Build a small browser-based application that lets a visitor anonymously reserve places in a predefined gym class session, review the price, confirm the reservation, and start another reservation.

## 2. Functional Requirements

### Classes and sessions

- **FR-01:** Present Yoga (€8/person), Pilates (€10/person), Functional Training (€12/person), and Spinning (€11/person).
- **FR-02:** Provide exactly the three predefined sessions for each class, with the initial available places below. Session capacity is 10.
- **FR-03:** When a class is selected, present its sessions. Allow the visitor to change the class or session before confirmation.
- **FR-04:** Show each session's day, time, remaining places, and whether it is full. A full session must not be reservable.

| Class | Session | Initial places |
|---|---|---:|
| Yoga | Monday 18:00 | 10 |
| Yoga | Wednesday 19:00 | 6 |
| Yoga | Saturday 10:00 | 2 |
| Pilates | Tuesday 18:00 | 8 |
| Pilates | Thursday 19:00 | 4 |
| Pilates | Saturday 11:30 | 0 |
| Functional Training | Monday 19:30 | 5 |
| Functional Training | Wednesday 18:00 | 10 |
| Functional Training | Friday 18:30 | 3 |
| Spinning | Tuesday 19:30 | 7 |
| Spinning | Thursday 18:00 | 1 |
| Spinning | Sunday 10:00 | 10 |

### Participants, price, and confirmation

- **FR-05:** Require at least one participant. The maximum selectable and reservable count is the number of places currently available for the selected session.
- **FR-06:** Calculate the total as participant count multiplied by the selected class's per-person price. Recalculate when the class or participant count changes.
- **FR-07:** Before confirmation, show the class, session, participant count, per-person price, and total price. Keep these choices editable until confirmation.
- **FR-08:** Do not allow confirmation unless a class and session are selected, the session has availability, and the participant count is between 1 and the current available places inclusive. Provide understandable feedback when the reservation is incomplete or invalid.
- **FR-09:** Require an explicit user confirmation. On success, show a clear confirmation containing enough information to identify the reservation.
- **FR-10:** On confirmation, deduct the reserved places from the selected session. Keep this updated availability for subsequent reservations while the page remains open.
- **FR-11:** Allow the visitor to start another reservation without restoring availability consumed during the current page session.
- **FR-12:** A page refresh or reopening restores all sessions to the initial availability in this document. Do not persist reservation state.

## 3. Quality and Accessibility Requirements

- **QR-01:** Use a simple, understandable interface that supports the complete reservation flow on desktop and mobile, including a 390px-wide viewport.
- **QR-02:** Support keyboard navigation and screen-reader announcements for relevant state changes; manage focus appropriately after confirmation and reset.
- **QR-03:** Maintain WCAG AA text contrast in both light and dark themes.
- **QR-04:** Respect the operating system's reduced-motion preference.
- **QR-05:** Keep business rules testable independently of presentation where practical, and do not mutate prior application state when confirming a reservation.

## 4. Privacy and Scope Boundaries

- **SC-01:** The reservation is anonymous. Do not request or collect a name, email, telephone number, address, account, or payment details.
- **SC-02:** Do not add accounts, authentication, memberships, subscriptions, payment processing, discounts, databases, browser storage, backend services, cross-user synchronization, waiting lists, cancellation, rescheduling, trainer management, messaging, calendar integration, external APIs, or complex calendar calculations.
- **SC-03:** No payment is made. Displaying the calculated price is informational only.

## 5. Verification

- When `tests/tests.html` is present, open it in a browser and require every automated test row to pass. `phases.txt` reports 112 tests, but that count is not verified until the test files are present and run.
- Open `index.html` in a browser and complete a reservation. Verify the summary, total, confirmation, deducted availability, and ability to book again.
- Verify incomplete, invalid, over-capacity, and full-session reservations cannot be confirmed.
- Verify refresh restores initial availability, and review keyboard/screen-reader behavior, both themes, contrast, reduced motion, and the 390px layout using `TEST_PLAN.md` when available.
- Confirm the application makes no network requests and uses no persistent storage or personal data.