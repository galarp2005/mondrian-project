# Seat 6 — U6-T3 geometric variations
Status: implementation in progress. Stacked on PR 4 at 88cdf5d; reconcile after predecessor merges. Branch issue-6 refers to Seat 6, not a verified numbered issue.

## Scope
Activate Original, Mirror horizontal, Mirror vertical and Rotate 180° using the existing Matrix vary(work, variationId) API. Always transform the canonical source work, never accumulate transformations. Preserve selected format and frame, liquid-fill, and unrelated URL fields. Persist selection using the existing recipe var key; restore on mount/popstate and preserve study-link query. No Matrix modifications, API calls, paper/print changes or history changes. Defer invert-contrast to the next colour increment (proposed scope split); do not confuse it with invert palette.

## Acceptance
- [ ] Four choices produce expected geometry and single selected control.
- [ ] Original restores original geometry; switching variations never accumulates.
- [ ] Format/custom frame remains unchanged and resize remains functional.
- [ ] URL restores variation and preserves unrelated fields; study link carries query.
- [ ] Unit tests and pnpm check; browser keyboard/mobile checks.
- [ ] Human cross-lane review and integration after predecessor merges.

Declaration delta: none. Measurement source: existing work geometry.
AI Review Log: pending author review and test evidence.
