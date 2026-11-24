# Seat 6 — U6-T3 geometric variations
Status: implementation complete; author-run automated checks and author-reported manual checklist passed after hydration fix on 2026-11-24. Predecessor integration and human cross-lane review pending. Stacked on PR 4 at 88cdf5d; reconcile after predecessor merges. Branch issue-6 refers to Seat 6, not a verified numbered issue.

## Scope
Activate Original, Mirror horizontal, Mirror vertical and Rotate 180° using the existing Matrix vary(work, variationId) API. Always transform the canonical source work, never accumulate transformations. Preserve selected format and frame, liquid-fill, and unrelated URL fields. Persist selection using the existing recipe var key; restore on mount/popstate and preserve study-link query. No Matrix modifications, API calls, paper/print changes or history changes. Defer invert-contrast to the next colour increment (proposed scope split); do not confuse it with invert palette.

## Acceptance
- [x] Four choices produce expected geometry and single selected control.
- [x] Original restores original geometry; switching variations never accumulates.
- [x] Format/custom frame remains unchanged and resize remains functional.
- [x] URL restores variation and preserves unrelated fields; study link carries query.
- [x] Unit tests and pnpm check passed on 7f753e6.
- [x] Browser keyboard/mobile checks (author-reported).
- [ ] Human cross-lane review and integration after predecessor merges.

Declaration delta: none. Measurement source: existing work geometry.
## AI Review Log

| Prompt / tool | ACCEPT or REJECT | Human verified? |
| --- | --- | --- |
| ChatGPT — reuse Matrix's existing vary() function instead of implementing new geometric transformations | ACCEPT — avoids duplicated logic | Author-run geometry tests and author-reported browser checklist passed |
| Include contrast inversion alongside geometric variations | REJECT — deferred to the colour and lines increment to keep the PR focused | Scope decision confirmed by owner |
| ChatGPT — preserve the current frame and format when switching variations | ACCEPT — maintains independent composition controls | Author-run frame preservation tests and author-reported browser checklist passed |
| ChatGPT — use the existing var URL parameter to persist the selected variation | ACCEPT — maintains recipe compatibility | Author-run URL helper tests and author-reported browser reload/study-link checklist passed |
| ChatGPT assistance with unit test implementation | ACCEPT — covers geometry, source immutability and URL persistence | Author ran pnpm check; all 12 new tests passed |

| ChatGPT — pass the reactive work directly to Matrix vary() | REJECT — browser hydration failed with DataCloneError in structuredClone | Yes — owner supplied actual console error |
| ChatGPT — snapshot the reactive work at the Matrix boundary with $state.snapshot(work) | ACCEPT — removes reactive proxies before cloning | Yes — owner confirmed working editor and final browser checklist; revised pnpm check passed |

## Implementation
- packages/editor/src/variations.js: allowlisted IDs, canonical-source Matrix vary() delegation, URL read/write helpers.
- packages/editor/src/Editor.svelte: reactive variation selection, single selected button, transformed render plan, restoration on mount/popstate; no frame changes; study link synchronized.
- packages/editor/tests/variations.test.js: 12 new tests.
- No Matrix or shared shell changes. Invert contrast remains disabled until the next increment.

## Verification
2026-11-24 — author-provided terminal transcript confirms branch lane/galarp2005-issue-6-editor-variations, clean working tree, commit 7f753e6ca8cd792ffa5a7e906eab925db3886c36. pnpm check completed: 96/96 tests (mark-canvas 7, matrix 14, neoplastic 10, editor 58 including 12 new variation tests, web 7); Astro built 28 pages; favicon, patterns, works-count and dist-link assertions passed; conformance OK. Existing lint scripts report lint deferred. Dev server started and Create returned HTTP 200. This is not evidence of completing the interactive browser checklist. Gallery link preserves query; actual Gallery rendering of selected variation is not claimed. Human cross-lane review, branch-naming confirmation and reconciliation against main remain pending. No AI approval or merge.


## Final verification after hydration fix
The initial 96-test run did not catch a browser hydration failure: owner supplied DataCloneError from Matrix vary() / structuredClone. Commit 4bd227113eea6eb7122263e3ca1a0b6ab4ba3f07 snapshots work in Editor.svelte before calling variationWork. Owner confirmed the corrected editor works and reported completion of the 13-item browser checklist, including four choices, exclusive selection, format/custom geometry preservation, resize, reload, query propagation, keyboard and mobile. No independent browser run claimed. Final author-provided transcript confirms clean working tree on the variations branch at 4bd2271 and successful pnpm check: 96/96 unit tests, including 12 variation tests, 28 Astro pages, build assertions and conformance OK. Existing lint scripts are deferred. No new unit tests for hydration itself; manual verification is the evidence for that fix. 90°/270° rotations discussed and deferred because Matrix currently only supports 180° rotation; not part of this increment. Invert contrast remains deferred to PR 6. Reconcile with main after predecessor merges and obtain human cross-lane review before submission.
