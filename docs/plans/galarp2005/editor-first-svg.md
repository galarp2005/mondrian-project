# Seat 6 — First Svelte editor study (exploratory plan)

**Owner:** `galarp2005` · **Scope:** U6-T1 · **Status:** prototype, not yet a PR.

> The instructor has not opened an editor issue yet. This prototype lives in `lane/galarp2005-editor` for learning and review. Before submission, create a fresh `lane/galarp2005-issue-<n>-<slug>` branch from up-to-date `main`, use an agreed issue number, and follow `CONTRIBUTING.md`.

## Source instructions before each change

- `CONTRIBUTING.md`: path ownership, sync, branch naming, small PRs, human reviews, AI log.
- `docs/DEV_PLAN/MONDRIAN/TEAM-ASSIGNMENTS.md`: Seat 6 IDs U6-T1…U6-T7.
- `docs/DEV_PLAN/MONDRIAN/PHASE-M6.md`: functional acceptance.
- `docs/DEV_PLAN/MONDRIAN/DECISIONS/D30-2026-10-27-LIQUID-FRAME-REFACTOR.md` and `D31-2026-10-27-FORMAT-ASPECT-PRESETS.md`: updated layout rules.
- `docs/guides/stack-fundamentals.md`: Svelte only in editor and Astro route `/create/<slug>/`.

Do not invent a separate `services/web/src/pages/editor.astro`: the assigned page already exists at `/create/[slug].astro`.

## Goal

Replace the `/create/<slug>/` placeholder with a minimal Svelte 5 island displaying the actual measured source composition as inline SVG. Preserve the existing Astro shell and gallery navigation.

## Files / contract

- `services/web/src/pages/create/[slug].astro` obtains the validated work from the Astro `works` content collection and passes it as the `work` prop.
- `packages/editor/src/Editor.svelte` uses `@mondrian/matrix` `deriveRenderPlan` and `renderSvg` to display the study; no local geometry implementation.
- `packages/editor/package.json` exposes `./Editor.svelte` directly; Astro imports `@mondrian/editor/Editor.svelte`. The starter `index.js` is not used for this feature.
- No changes to `packages/matrix`, `work.yml`, `services/api` or Seat 7 export controls.

## Deliberately out of scope

Frame corner drag, format chips, variations, hue, undo, recipe URL writes, export, print and kiosk integration. Those require subsequent focused issues/PRs.

## Verification (human check required)

1. `pnpm check` succeeds from repo root.
2. `pnpm develop` serves `/create/kunsthaus-1930-rbby/`; the heading and inline SVG are visible.
3. The SVG has measured planes and black lines; no console/runtime errors.
4. `/gallery/` stays functional; `/about/` does not mount a Svelte island.
5. Confirm only the intended files changed with `git status` and `git diff`.

## Assisted work review

- Assistant proposed initial architecture / code. **ACCEPT pending human code and browser review.**
- Decision to avoid duplicate geometry in Svelte: **ACCEPT**. The existing `matrix` package owns calculations.
- Do not claim a human test, approval or merge until completed by a person.
