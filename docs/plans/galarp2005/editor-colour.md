# Seat 6 — Colour and lines
Status: implementation in progress. Stacked on PR 5 at a623624; reconcile after predecessors merge. Branch issue-6 is seat identifier, not verified issue number.

## Scope
MVP product spec §4.1/4.3 and PHASE-M6 deliverables 2, 5, 6: CSS owns hue and fill, explicit HSL involution (never filter invert), Matrix owns line geometry and work-specific clamp. Expose --theta, --theta-num and --line-weight-scale. Sliders plus keyboard-accessible presets; persist theta, pal and lw immediately, restore on mount/popstate, preserve other recipe fields and study-link query. Interpret Invert contrast as an alias of palette inversion (spec explicitly permits same involution); both buttons share state, do not alter var or stack inversions. Existing geometry, frame and variation stay independent. No Matrix changes or API.

## Acceptance
- [ ] Hue rotates chromatic planes together; neutral roles unchanged in direct mode.
- [ ] Inversion is exact HSL involution, including neutral roles; both controls agree.
- [ ] Line weight clamped by Matrix, geometry regenerated, no extra CSS scaling.
- [ ] Presets, keyboard, mobile and URL restoration; format/variation/resize regression.
- [ ] Unit tests and pnpm check; browser smoke.
- [ ] Human cross-lane review and integration after predecessors merge.

Declaration delta: none. Measurement source: existing work geometry/swatches.
AI Review Log: pending author verification.
