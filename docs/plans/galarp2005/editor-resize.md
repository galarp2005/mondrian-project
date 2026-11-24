# Seat 6 — U6-T2 corner resize
Status: initial implementation and 17 unit tests committed; execution and human verification pending. Stacked on PR 3 at 418fd2c; reconcile after predecessors merge. Branch issue-6 is seat identifier, not verified issue number.

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

## Implementation notes
A fixed square coordinate container maps normalized frame x/y/width/height to CSS percentages; this changes preview sizing compared with PR 3 to keep the opposite corner stable. It is a provisional coordinate space, not the final paper silhouette. Pointer capture tracks one pointer; cancellation restores initial selection. Arrow keys resize by 1% of surface dimensions (Shift 5%). Presets reset the frame; Custom is a derived indicator, not a separate selectable preset. URL updates on drag-end or keyboard edit. Small viewport/minimum frame target overlap requires browser QA. No browser or automated execution claimed yet.
