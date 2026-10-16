# Gym Class Reservation Test Plan

## Scope and Traceability

The Business Requirements Document (`BRD.md`) is authoritative. The implementation requirements are in `REQUIREMENTS.md`. This plan covers the current Phase 1 and Phase 2 behavior and adds Phase 3 accessibility, responsive, privacy, and scope checks.

| Requirement area | Coverage |
|---|---|
| Catalog, prices, sessions, initial availability | Automated: data tests 1-20; manual: M1-M2 |
| Availability, validation, price, immutable confirmation | Automated: reservation tests 21-50; manual: M3-M8 |
| Class/session UI, participant selection, summary | Automated: UI tests 51-66 and participant tests 67-83; manual: M1-M5 |
| Confirmation, availability updates, another booking | Automated: confirmation tests 84-99; manual: M6-M8 |
| Accessible names, announcements, focus | Automated: accessibility tests 100-112; manual: M9-M10 |
| Contrast, themes, reduced motion, mobile, privacy | Manual: M11-M13 |

The test numbering above refers to the 112 cumulative Phase 1-3 suite order, not test-case identifiers embedded in source.

## Automated Test Inventory

Open `tests/tests.html` directly in a browser. The test harness uses local scripts and requires no server, build, package installation, or network access.

- Phase 1: 50 tests for the catalog, fresh state, pricing, validation, capacity, immutable confirmation, and repeated bookings.
- Phase 2: 49 additional tests for rendering helpers, session and participant selection, summary updates, confirmation, and booking again.
- Phase 3: 13 additional tests for semantic groups, labels, live announcements, invalid-field feedback, and focus behavior.
- Expected cumulative result after all phases: 112 passing tests.

## Verification Results

- Automated browser suite: 112 of 112 tests passed.
- Keyboard browser check: Tab and Enter selected a class and session; focus remained on the selected control after rerender.
- Responsive check: at a 390px viewport, the document had no horizontal overflow.
- Contrast spot check: representative normal text pairs measured at least 4.75:1 in light theme and 5.68:1 in dark theme. The lowest sampled pairs were the full-session status and disabled confirmation text; both exceed the 4.5:1 WCAG AA threshold.
- Reduced motion: with the reduced-motion preference enabled, the class-option transition duration computed to 0.01ms.
- Privacy spot check: local storage was empty and no non-local resource requests were observed.
- Screen-reader behavior: semantic names, live regions, alerts, and focus targets are covered by automated tests. A real screen-reader session has not yet been performed.

## Manual Checks

Run these checks using `index.html` in a current desktop browser and at a 390px-wide mobile viewport.

- **M1 — Classes and prices:** Confirm all four classes and their per-person prices are shown and selectable.
- **M2 — Sessions:** Select each class. Confirm its three day/time options, remaining places, and full status are correct; a full session cannot be selected.
- **M3 — Participant bounds:** Confirm participant selection is unavailable until an available session is selected, has a minimum of one, and cannot exceed remaining places.
- **M4 — Live summary:** Change class, session, and participant count. Confirm class, session, count, unit price, and total update correctly.
- **M5 — Invalid booking:** Try missing choices, zero, fractional, and over-capacity counts. Confirm the action stays disabled and useful feedback is presented.
- **M6 — Confirmation:** Confirm a valid booking. Check class, session, participant count, and total on the success screen.
- **M7 — Book again:** Start another reservation. Confirm the previous booking's availability deduction remains, and the next booking can be completed.
- **M8 — Refresh reset:** After booking, refresh the page. Confirm all availability returns to BRD initial values.
- **M9 — Keyboard:** Use Tab and Shift+Tab to reach all enabled controls, Enter/Space to activate choices, and verify focus remains visible and predictable through selection and confirmation.
- **M10 — Screen reader:** With a screen reader, verify the reservation summary announces changes, errors are announced, controls have useful names, and focus moves to the confirmation heading and back to class choices when starting again.
- **M11 — Light theme contrast:** In light color scheme, inspect all text, labels, disabled/full states, errors, and focus indicators. Verify normal text contrast is at least 4.5:1 and large text is at least 3:1.
- **M12 — Dark theme and reduced motion:** Repeat contrast inspection in dark color scheme. Emulate `prefers-reduced-motion: reduce` and confirm transitions are effectively removed and content remains usable.
- **M13 — Mobile and scope:** At 390px width, verify no horizontal scrolling or overlapping controls. Inspect browser storage and network activity; confirm there is no personal data entry, persistent storage, non-local request, payment, or backend behavior.

## Known Limits

- Availability is local to one page session. It is not synchronized with other tabs, browsers, or visitors and intentionally resets on refresh.
- Automated tests run in the browser and do not replace real screen-reader testing or visual contrast measurement in each supported browser/theme.
- The application does not perform reservations with a gym system, send confirmations, or process payments.
- Session days and times are predefined labels; no calendar or timezone calculations are performed.