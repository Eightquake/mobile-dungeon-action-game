# Status

<!--
Rules for agents:
- Rewrite this file at the end of every session. It shows the current state, not a log; history lives in Git.
- Keep it under one screen. Link to PRs, ADRs and use cases instead of repeating them.
- Order matters: the owner reads from the top and may stop after the first two sections.
- Write "None" in a section that has nothing, so the owner knows it was checked.
-->

Last updated: 2026-11-09 by Claude Code (walking skeleton 2 of 4: blocked on ADR-015)

## Needs your decision

- **[ADR-015](adr/ADR-015-own-vite-plugin-for-the-precache-list.md) (Proposed):** vite-plugin-pwa (ADR-006) brings in `deepmerge`, which has a low advisory and no fix, so the `security` check fails. The recommendation is our own small precache plugin and service worker, with no Workbox. Walking skeleton PR 2 (UC-012, UC-013) waits for this.
- **Layer plugin:** install `aiup-playwright` for the E2E layer, or not? Optional, see `docs/architecture/stack.md`.

## Ready for review

| PR | Use case | What changed | Check by playing |
|----|----------|--------------|------------------|
| [ADR-015 PR](https://github.com/Eightquake/mobile-dungeon-action-game/pulls) | none (blocks #9 PR 2) | Proposed ADR-015 | Nothing to play |

## Questions

Each has a working assumption in the specs and an entry in [open_questions.md](open_questions.md). None blocks anything.

- **Ladder vs. no timers:** no countdown; a tier clear records play time (OQ-002).
- **Play reminder:** in-game at the end-of-run summary, not a system notification (OQ-004).
- **Default frame cap** 60 vs 30: decided by measurement ([#10](https://github.com/Eightquake/mobile-dungeon-action-game/issues/10)).
- **Please confirm:** salvage yields nothing (OQ-023); abandoned runs don't count for bad-luck protection (OQ-024); a paused run can be finished after an update but is never sent to the leaderboard (OQ-025); 3 restorable copies (OQ-026).
- **Numbers to confirm:** 5 s to run, 4% battery, 5 MB precache, max 6 gear slots, readable-number limits (OQ-006 to OQ-011, OQ-013).
- **Android:** only Chromium in CI covers NFR-023. **Rested bonus** and **one-time purchase** stay open in the Vision.
- **Landscape lock on iPhone:** Safari has historically ignored the manifest's orientation lock, so on the reference phone turning to portrait will likely pause the run (UC-003 A6) instead of being locked.

## Blocked

- Walking skeleton PR 2 (UC-012, UC-013) waits for ADR-015. The online features (UC-017 to UC-022) are unblocked but low priority, after the core game.

## Done since last check-in

- Walking skeleton project setup (#25), merged. Issue #9 updated.
- Elaboration: stack file (#7), walking skeleton review fixes (#16), BP-001 (#17), CI `spec-lint` (#18), LICENSE (#19), Proposed ADR-012 to ADR-014 (#20), all merged.
- Walking skeleton use cases UC-001, UC-002, UC-003, UC-004, UC-012, UC-013 approved; ADR-012 to ADR-014 accepted (#22, merged).
- CLAUDE.md test rules (#24). Repository setup (#15): ruleset on `main` with `spec-lint` required, CodeQL default setup, secret scanning with push protection, Dependabot alerts and security updates, Vercel fork protection. Dependabot version updates for GitHub Actions (#23).

## Next up

- **Walking skeleton** ([#9](https://github.com/Eightquake/mobile-dungeon-action-game/issues/9)): UC-012 + UC-013 after ADR-015 (the dismissed install hint is stored in the save, so until PR 4 the dismissal lasts only for the session), then UC-001 + UC-002 step 2, then UC-003 + UC-004.
- Add `check`, `unit`, `e2e`, `budget`, `security` as required checks in the ruleset.
- Then the phone measurements ([#10](https://github.com/Eightquake/mobile-dungeon-action-game/issues/10)).
- Later: southpaw option ([#14](https://github.com/Eightquake/mobile-dungeon-action-game/issues/14)); replay verification of leaderboard results, ADR-014 option C ([#21](https://github.com/Eightquake/mobile-dungeon-action-game/issues/21)).

## Health

- Specs: `spec_lint.py --strict` 0 errors, 0 warnings, 13 infos (system-wide constraints; UC-015 and UC-016 in no test case). Use cases: 6 Approved, 16 Draft. No blocking question.
- CI: all six ADR-011 jobs run on `main`; only `spec-lint` is required on `main` so far. CodeQL default setup on. `npm audit`: 0 vulnerabilities.
- Performance budgets: not measured yet (all TODO, #10).
- Free-tier usage: OK, nothing deployed besides Vercel previews.
