# Seat 6 — U6-T2b format chips

Status: implementation in progress. Based on PR 2 at bc8f008; reconcile with main after predecessor PRs land. Branch issue-6 is seat identifier, not verified issue number; instructor confirmation pending.

## Scope
Implement original, 1:1, 5:4, 4:5, 16:9 and 9:16 chips with shared Matrix maximizeFrame/printableArea and liquid-fill SVG. Keep selected format in fmt query, restore on load, preserve unrelated existing parameters and study navigation. Custom stays disabled until corner drag (U6-T2). No changes to source measurements, gallery rendering, Seat 7 surface selector/export or other controls. Temporary sticker-50 geometry is a default only; actual paper stage and surface change integration await Seat 7. Frame dimensions are normalized to the surface; current square default makes normalized and physical aspect equivalent.

## Acceptance
- [ ] Each chip changes ratio and selected state, original restores source ratio.
- [ ] Frame maximized within default printable area; no crop/letterbox; original work unchanged.
- [ ] URL fmt updates, reload restores format, invalid fmt safely falls back; unrelated query parameters preserved; study link follows current query.
- [ ] Unit tests and pnpm check.
- [ ] Human desktop/mobile, keyboard, visual review; Seat 7 cross-lane review.
- [ ] Reconcile main and branch naming before PR submission.

Declaration delta: none. Measurement source: n/a, existing Matrix geometry.
AI Review Log: ChatGPT proposed scope and implementation; human acceptance and verification of code pending. No AI approval/merge.
