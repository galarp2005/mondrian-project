# Seat 6 — U6-T3 geometric variations
Status: implementation complete; author-run automated checks passed on 2026-11-24. Manual browser checklist and human review pending. Stacked on PR 4 at 88cdf5d; reconcile after predecessor merges. Branch issue-6 refers to Seat 6, not a verified numbered issue.

## Scope
Activate Original, Mirror horizontal, Mirror vertical and Rotate 180° using the existing Matrix vary(work, variationId) API. Always transform the canonical source work, never accumulate transformations. Preserve selected format and frame, liquid-fill, and unrelated URL fields. Persist selection using the existing recipe var key; restore on mount/popstate and preserve study-link query. No Matrix modifications, API calls, paper/print changes or history changes. Defer invert-contrast to the next colour increment (proposed scope split); do not confuse it with invert palette.

## Acceptance
- [ ] Four choices produce expected geometry and single selected control.
- [ ] Original restores original geometry; switching variations never accumulates.
- [ ] Format/custom frame remains unchanged and resize remains functional.
- [ ] URL restores variation and preserves unrelated fields; study link carries query.
- [x] Unit tests and pnpm check passed on 7f753e6.
- [ ] Browser keyboard/mobile checks.
- [ ] Human cross-lane review and integration after predecessor merges.

Declaration delta: none. Measurement source: existing work geometry.
## AI Review Log

| Prompt / tool | ACCEPT or REJECT | Human verified? |
| --- | --- | --- |
| ChatGPT — reuse Matrix's existing vary() function instead of implementing new geometric transformations | ACCEPT — avoids duplicated logic | Author-run geometry tests passed; browser verification pending |
| Include contrast inversion alongside geometric variations | REJECT — deferred to the colour and lines increment to keep the PR focused | Scope decision confirmed by owner |
| ChatGPT — preserve the current frame and format when switching variations | ACCEPT — maintains independent composition controls | Author-run frame preservation tests passed; browser verification pending |
| ChatGPT — use the existing var URL parameter to persist the selected variation | ACCEPT — maintains recipe compatibility | Author-run URL helper tests passed; browser reload and study link verification pending |
| ChatGPT assistance with unit test implementation | ACCEPT — covers geometry, source immutability and URL persistence | Author ran pnpm check; all 12 new tests passed |

## Implementation
- packages/editor/src/variations.js: allowlisted IDs, canonical-source Matrix vary() delegation, URL read/write helpers.
- packages/editor/src/Editor.svelte: reactive variation selection, single selected button, transformed render plan, restoration on mount/popstate; no frame changes; study link synchronized.
- packages/editor/tests/variations.test.js: 12 new tests.
- No Matrix or shared shell changes. Invert contrast remains disabled until the next increment.

## Verification
2026-11-24 — author-provided terminal transcript confirms branch lane/galarp2005-issue-6-editor-variations, clean working tree, commit 7f753e6ca8cd792ffa5a7e906eab925db3886c36. pnpm check completed: 96/96 tests (mark-canvas 7, matrix 14, neoplastic 10, editor 58 including 12 new variation tests, web 7); Astro built 28 pages; favicon, patterns, works-count and dist-link assertions passed; conformance OK. Existing lint scripts report lint deferred. Dev server started and Create returned HTTP 200. This is not evidence of completing the interactive browser checklist. Gallery link preserves query; actual Gallery rendering of selected variation is not claimed. Human cross-lane review, branch-naming confirmation and reconciliation against main remain pending. No AI approval or merge.

