# Agent Instructions

## Source of truth

- Read `BRD.md` and `REQUIREMENTS.md` before changing behavior. The BRD is authoritative if wording differs.
- Check `phases.txt` and `TEST_PLAN.md` for project status and existing verification steps. Do not assume a phase is implemented just because it is described as complete; inspect the current files.
- Keep changes focused on the Gym Class Reservation project and preserve existing public behavior unless a requirement calls for a change.

## Technical constraints

- This project is a static browser application using plain HTML, CSS, and JavaScript.
- Do not introduce a build system, package manager, framework, dependency installation, Node.js requirement, server, backend, or external service.
- Keep the app usable by opening `index.html` directly in a browser. Keep automated tests runnable by opening `tests/tests.html` directly.
- Follow the existing file structure and coding style. Prefer small, understandable changes and reuse existing helpers and test harnesses.

## Product and privacy constraints

- Implement the exact four classes, prices, twelve sessions, and initial availability in `REQUIREMENTS.md`.
- Enforce a minimum of one participant and a maximum equal to current session availability. Never allow a full or over-capacity reservation.
- Calculate totals from participant count and per-person price. Confirmation must deduct availability, support another reservation, and retain changes only until refresh.
- Do not collect personal information or add accounts, persistent storage, network requests, payment functionality, or any out-of-scope feature listed in the BRD.

## Accessibility and responsive behavior

- Preserve keyboard access, useful screen-reader announcements, and sensible focus management.
- Maintain WCAG AA text contrast in light and dark themes and respect reduced-motion preferences.
- Keep the layout usable at mobile widths, including 390px.

## Verification

- After a change, open `tests/tests.html` and confirm all available tests pass.
- For user-facing changes, also exercise the affected flow through `index.html`; check relevant keyboard, theme, reduced-motion, and mobile behavior.
- If `TEST_PLAN.md` exists, follow its relevant manual checks. Report verification that could not be performed instead of claiming it passed.
- Do not add unrelated refactors or claim phase/test status without checking the current workspace.