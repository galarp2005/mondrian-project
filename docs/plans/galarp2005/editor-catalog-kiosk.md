# Seat 6 — U6-T1 catalog and kiosk follow-up

**Owner:** `galarp2005` · **Task:** U6-T1 · **Status:** implementation, human review pending.

## Goal

Finish the editor integration started in PR #16: load the build-time `/patterns/<work-id>.json` render plan in the browser and reuse the same Svelte island on `/kiosk/`.

## Implementation

- Keep the original measured SVG as the initial view and a fallback if the catalog request fails.
- Use Svelte 5 `$state` and `onMount` inside `Editor.svelte` to fetch the catalog JSON, check the HTTP response and minimal `items` structure, then render it with the existing `@mondrian/matrix` renderer.
- Keep catalog-loading code inside `Editor.svelte` (no separate `catalog.js`).
- Use Astro's existing `withBase()` function for URLs that also work when the site is deployed under a non-root base.
- Reuse `Editor.svelte` in `kiosk.astro` with the existing Kunsthaus work as the default.
- Offline cache, wake lock and idle reset remain Seat 7 / M7 responsibilities.

## Files

- `packages/editor/src/Editor.svelte`
- `services/web/src/pages/create/[slug].astro`
- `services/web/src/pages/kiosk.astro`
- `docs/plans/galarp2005/editor-catalog-kiosk.md`

## Verification

The student previously confirmed locally that the catalog was generated, both `/create/kunsthaus-1930-rbby/` and `/kiosk/` displayed the composition, and the browser requested the JSON with HTTP 200. After inlining catalog loading and removing the helper's three tests, the student reported:

- `pnpm --filter @mondrian/editor test`: 1 probe test passed (does **not** test the new catalog logic).
- `pnpm --filter @mondrian/web build`: 28 pages built; pattern and link checks passed.
- Earlier `pnpm check` encountered a Windows environment issue running `bash`; the student later reported conformance and Python checks passed, but their complete logs were not captured here.

Before marking the PR ready, repeat the full checks on the branch being reviewed and add targeted component/browser tests for successful catalog loading and fallback behavior. A successful HTTP 200 alone does not prove that the SVG has been replaced.

## AI Review Log

- **ACCEPT (student):** Minimal Svelte SVG integration and reuse of the existing `matrix` renderer.
- **ACCEPT (student):** Inline catalog-loading logic to avoid a separate `catalog.js`.
- **REJECT (student):** A separate `catalog.js` helper, removed.
- **Pending human review:** New Astro wiring, kiosk integration and error/fallback handling.

AI has not approved or merged the contribution.

## Out of scope

Final visual layout, viewport fitting, interactive format chips, frame dragging, variation buttons, undo/compare, print and export. These stay in later tasks and PRs.
