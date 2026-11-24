# Seat 6 — Editor visual composition and responsive layout

Status: implementation in progress; no human verification claimed.

## Scope
Follow TEAM-ASSIGNMENTS, PHASE-M6, TOKEN-SYSTEM and the first SVG integration plan. One concern: layout and visual presentation of the future editor. Preserve matrix rendering, Astro route and recipe-aware gallery navigation. No new geometry or recipe behavior, API calls, kiosk changes, or Seat 7 implementations.

The working branch is based on the updated PR #19 head while that PR is pending. Before submission reconcile with current upstream main after #19 lands and verify that only this UI concern remains. The `issue-6` segment refers to Seat 6; a numbered issue has not been confirmed, so instructor naming confirmation remains necessary.

## Composition
Reuse ShellLayout/SiteNav exactly, including all existing links; no language switch exists in SiteNav. Mark Create active. Keep source work and year, real SVG and existing study/gallery links. Desktop: controls left, stage right, history and output areas grouped with stage. Narrow layouts: stage first, native collapsible editing groups below. Use Seat 7 --nx-* typography, color, spacing, stroke, zero radius and touch size tokens; measured painting fills remain untouched.

Control inventory: texture/catalog, surface presets (Seat 7), format including custom, variations, hue, palette inversion, line weight, plane clip lab, corner resize, undo/reset/hold compare, share link/QR, SVG/PNG/HTML/CSV export and print/crop marks/calibration (Seat 7). Future controls are explicitly unavailable; no fake saved status, fake selected surface or fake interactive handles. No internal handles. Native details are functional disclosure only. Real print silhouette and surface dimensions await Seat 7 integration.

## Verification checklist
- [ ] pnpm check on final branch
- [ ] Desktop/tablet/mobile browser visual QA, including narrow viewport, keyboard, focus, touch targets and dark scheme
- [ ] Verify original SVG and gallery query/navigation, Create active and other routes unchanged
- [ ] No new Svelte islands outside assigned editor; no raw chrome colors
- [ ] Seat 7 visual QA and cross-lane human review
- [ ] Human author AI Review Log with actual decisions and verification

AI assistance: proposed layout and drafted implementation. Human ACCEPT/REJECT and browser verification not yet recorded.
