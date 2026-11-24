# Seat 6 — U6-T2b format chips

Status: implementation committed; author-reported manual format checks and author-run automated checks passed on 2026-11-24. Integration and cross-lane review pending. Based on PR 2 at bc8f008; reconcile with main after predecessor PRs land. Branch issue-6 is seat identifier, not verified issue number; instructor confirmation pending.

## Scope
Implement original, 1:1, 5:4, 4:5, 16:9 and 9:16 chips with shared Matrix maximizeFrame/printableArea and liquid-fill SVG. Keep selected format in fmt query, restore on load, preserve unrelated existing parameters and study navigation. Custom stays disabled until corner drag (U6-T2). No changes to source measurements, gallery rendering, Seat 7 surface selector/export or other controls. Temporary sticker-50 geometry is a default only; actual paper stage and surface change integration await Seat 7. Frame dimensions are normalized to the surface; current square default makes normalized and physical aspect equivalent.

## Acceptance
- [x] Author reports all six chips, selected state and restoration of original verified.
- [x] Frame helper maximization, centering and source immutability tests passed; author screenshot confirms 16:9 liquid-fill and author reports other formats checked. Physical paper silhouette integration remains pending Seat 7.
- [x] Author reports fmt URL updates and reload restoration checked; unit tests passed for invalid/missing fmt and unrelated query preservation. Live study-link regression check and full recipe integration remain pending.
- [x] Author ran pnpm check successfully on 7057d14; 67/67 tests passed, including 28 new format tests. Repeat after predecessor integration.
- [ ] Human desktop format checks reported complete; specific mobile/keyboard regression and Seat 7 cross-lane review not recorded for this increment.
- [ ] Reconcile main and branch naming before PR submission.

Declaration delta: none. Measurement source: n/a, existing Matrix geometry.
## AI Review Log

| Prompt / tool | ACCEPT or REJECT | Human verified? |
| --- | --- | --- |
| ChatGPT — six format chips using existing Matrix helpers, defer Custom and paper selector | ACCEPT — author authorized scoped implementation | Yes — author reports manual format checks complete |
| ChatGPT — liquid-fill normalized SVG without changing measured geometry | ACCEPT — author continued after clarification of frame vs workspace | Yes — author supplied 16:9 screenshot and reported checks complete; automated immutability and frame tests passed |
| ChatGPT — live fmt and frame query, restore selected format on reload | ACCEPT — part of authorized implementation | Yes — screenshot shows fmt and frame fields; author reports reload checked; helper tests passed |
| ChatGPT — add 28 automated test cases | ACCEPT — author ran requested suite | Yes — author-provided terminal transcript shows all 28 passed |

No independent browser run, human cross-lane approval or AI approval/merge claimed. The author should review this draft log before PR submission.

## Implementation notes
Format IDs use the Matrix recipe spelling (1-1, 5-4, 4-5, 16-9, 9-16). Frame helper handles normalized coordinates for square and non-square surfaces, but the editor currently uses sticker-50 only as a provisional geometry reference; the visible paper silhouette is not integrated. SVG liquid-fill is applied locally to the existing normalized SVG, without changing Matrix or gallery. URL writes fmt and frame fields with replaceState; preserves other fields, and the study link follows the URL. Only format controls enabled. Complete recipe validation and live sync for other controls remain later scope. 28 new unit cases authored and passed in author-run checks. Author agreed to continue after clarifying documented multiple paper presets and subsequently reported manual format checklist complete except pnpm and AI Review Log.

## Automated verification evidence
2026-11-24: author ran `pnpm check` in PowerShell on `lane/galarp2005-issue-6-editor-formats` at `7057d14a2eaa48b5b631957088d0968bc2523f5d`, clean working tree. Catalog succeeded; lint scripts completed (lint deferred by existing configuration); 67 tests passed (mark-canvas 7, matrix 14, neoplastic 10, editor 29 including 28 new, web 7). Astro built 28 pages, favicon/patterns/works-count checks passed, conformance ended `conformance: OK`. Author-provided transcript, not assistant-run CI. Documentation-only update does not alter tested code.

## Scope review
Compared against PR 2 head bc8f008: only Editor.svelte, formats.js, formats.test.js and this plan changed. No Matrix, measured work, gallery, shared shell, or Seat 7 files changed. Reconcile with upstream after predecessor PRs merge; repeat checks and verify live study navigation/mobile/keyboard regression. Proposed human cross-lane reviewer: @PauLAanDReEa-Ai (not yet approved or requested).
