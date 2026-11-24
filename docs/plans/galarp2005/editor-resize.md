# Seat 6 — U6-T2 corner resize
Status: implementation pending verification. Stacked on PR 3 at 418fd2c; reconcile after predecessors merge. Branch issue-6 is seat identifier, not verified issue number.

## Scope
D-30/D-31 amended MVP spec governs over obsolete aspect-locked M6 instruction. Four outer corners only, free aspect, fixed opposite corner, pointer capture and second pointer ignored, 44px touch targets, keyboard arrows, bounds and minimum size. Liquid-fill remains unchanged. Custom frame round-trips through fmt/fx/fy/fw/fh; selecting a preset re-maximizes. Use a stable provisional square coordinate stage for sticker-50; actual paper appearance and selectable surfaces await Seat 7. Minimum proposed 10% of printable width/height (implementation choice, not mandated numeric threshold). No internal drag, Matrix edits, history or output changes.

## Acceptance
- [ ] Four corners resize freely, opposite corner fixed, no internal drag.
- [ ] Bounds, minimum, pointer cancellation, keyboard and mobile checks.
- [ ] Custom URL restores geometry; format chips restore maximal centered frame.
- [ ] Unit tests and pnpm check; browser regression.
- [ ] Human cross-lane review and integration after predecessor merges.

Declaration delta: none. Measurement source: existing work geometry.
AI Review Log: ChatGPT implementation proposed; human acceptance and test evidence pending.
