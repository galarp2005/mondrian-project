# Seat 6 — U6-T2 corner resize
Status: initial implementation passed author-run automated checks on 2026-11-24; manual drag reported working. Svelte warning and targeted browser QA remain pending. Stacked on PR 3 at 418fd2c; reconcile after predecessors merge. Branch issue-6 is seat identifier, not verified issue number.

## Scope
D-30/D-31 amended MVP spec governs over obsolete aspect-locked M6 instruction. Four outer corners only, free aspect, fixed opposite corner, pointer capture and second pointer ignored, 44px touch targets, keyboard arrows, bounds and minimum size. Liquid-fill remains unchanged. Custom frame round-trips through fmt/fx/fy/fw/fh; selecting a preset re-maximizes. Use a stable provisional square coordinate stage for sticker-50; actual paper appearance and selectable surfaces await Seat 7. Minimum proposed 10% of printable width/height (implementation choice, not mandated numeric threshold). No internal drag, Matrix edits, history or output changes.

## Acceptance
- [ ] Author reports corner drag works and can enlarge a wide composition vertically; geometry tests pass for all four corners and opposite anchor. Explicit browser verification of all corners and internal non-drag remains unrecorded.
- [ ] Bounds/minimum geometry tests pass; author reports maximum reached at approximately original size, consistent with provisional square surface. Pointer cancellation, keyboard/mobile and overlapping touch targets still require explicit browser QA.
- [ ] Custom URL round-trip and preset restoration unit tests pass; explicit browser reload evidence not recorded.
- [x] Author ran pnpm check on 40f7d34: 84/84 unit tests, build and conformance passed. Browser regressions and compiler warning remain separate pending items.
- [ ] Human cross-lane review and integration after predecessor merges.

Declaration delta: none. Measurement source: existing work geometry.
## AI Review Log

| Prompt / tool | ACCEPT or REJECT | Human verified? |
| --- | --- | --- |
| ChatGPT — free-aspect corner resize with fixed opposite anchor and printable-area bounds | ACCEPT — author authorized PR 4 and reported drag working | Partial — manual drag reported; 17 new unit tests passed |
| ChatGPT — always-visible discrete outer handles instead of separate drag mode; exclude handles from exports and printing | ACCEPT — author explicitly agreed | Editor visibility accepted; printing/export integration not yet tested |
| ChatGPT — provisional 10% minimum and square reference coordinate space using sticker-50 | ACCEPT for current increment — author agreed to proceed after discussing maximum size | Geometry tests passed; actual physical surface integration pending |
| ChatGPT — custom geometry URL persistence and preset restoration | ACCEPT — included in requested implementation | Automated helper tests passed; browser reload evidence pending |
| ChatGPT — add 17 resize tests | ACCEPT — author ran pnpm check | Yes — all 17 passed in author-provided transcript |

Author review of this draft log required before submission. No independent browser run, cross-lane approval or AI approval/merge claimed.

## Implementation notes
A fixed square coordinate container maps normalized frame x/y/width/height to CSS percentages; this changes preview sizing compared with PR 3 to keep the opposite corner stable. It is a provisional coordinate space, not the final paper silhouette. Pointer capture tracks one pointer; cancellation restores initial selection. Arrow keys resize by 1% of surface dimensions (Shift 5%). Presets reset the frame; Custom is a derived indicator, not a separate selectable preset. URL updates on drag-end or keyboard edit. Small viewport/minimum frame target overlap requires browser QA. Author subsequently reported manual drag working and supplied successful automated check transcript.

## Verification evidence
2026-11-24: PowerShell author run on lane/galarp2005-issue-6-editor-resize, clean working tree, commit 40f7d3476fc2b144a3b773c0055899e262285439. Catalog OK; lint commands completed with existing lint-deferred placeholders; 84/84 tests (mark-canvas 7, matrix 14, neoplastic 10, editor 46 including 17 resize tests, web 7). Astro built 28 pages, favicon/patterns/works-count assertions OK; conformance: OK. Dev-server transcript shows Svelte state_referenced_locally warning at Editor.svelte:12:37 (initial work prop captured by state initializer). Not a test failure; investigate and resolve before submission, rerun checks if code changes. No claim of warning-free build. Four changed files relative to PR 3 head: this plan, Editor.svelte, resize.js, resize.test.js. No shared Matrix or Seat 7 modifications. Integration with physical paper and export/print exclusion verification remain pending.
