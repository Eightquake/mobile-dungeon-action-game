# Status

<!--
Rules for agents:
- Rewrite this file at the end of every session. It shows the current state, not a log; history lives in Git.
- Keep it under one screen. Link to PRs, ADRs and use cases instead of repeating them.
- Order matters: the owner reads from the top and may stop after the first two sections.
- Write "None" in a section that has nothing, so the owner knows it was checked.
-->

Last updated: 2026-11-09 by Claude Code (Elaboration finished: stack file, BP-001 process, pre-approval review of the walking skeleton, backlog as issues)

## Needs your decision

- **Approve the walking skeleton use cases:** UC-001, UC-002, UC-003, UC-004, UC-012 and UC-013 passed a fresh spec review (lint clean, the review's warnings fixed in [#16](https://github.com/Eightquake/mobile-dungeon-action-game/pull/16)). Once #16 is merged, set them to `Approved` or tell me to. This is the gate from Elaboration to Construction.
- **One-time repository setup:** branch protection, Dependabot, CodeQL, secret scanning ([#15](https://github.com/Eightquake/mobile-dungeon-action-game/issues/15)).
- **Layer plugin:** install `aiup-playwright` for the E2E layer, or not? It's optional; see [#7](https://github.com/Eightquake/mobile-dungeon-action-game/pull/7).

## Ready for review

| PR | Use case | What changed | Check by playing |
|----|----------|--------------|------------------|
| [#7](https://github.com/Eightquake/mobile-dungeon-action-game/pull/7) | none | `docs/architecture/stack.md`: the ADRs mapped onto the AIUP layers. Check the four readings listed in the PR | Nothing to play |
| [#17](https://github.com/Eightquake/mobile-dungeon-action-game/pull/17) | UC-001–005, 007, 008, 013 | BP-001 Dungeon Run: the run loop as a BPMN process, the last Elaboration artifact. One process only, and no per-path test cases (20 paths); say if you want more | Nothing to play |
| [#16](https://github.com/Eightquake/mobile-dungeon-action-game/pull/16) | UC-001, 002, 003, 005, 011, 013 | Spec review fixes: "stored run" instead of "paused run" in UC-001; turning the phone to portrait pauses the run (UC-003 A6, OQ-027); UC-005 A2 also ends runs that can't be restored; import offered at launch (UC-013 A6) | Nothing to play |

## Questions

Each has a working assumption in the specs and an entry in [open_questions.md](open_questions.md). Answer there or here.

- **New: portrait during a run** pauses it (OQ-027). Confirm?
- **Ladder vs. no timers:** no countdown; a tier clear records play time (OQ-002).
- **Play reminder:** in-game at the end-of-run summary, not a system notification (OQ-004).
- **Default frame cap** 60 vs 30: decided by measurement ([#10](https://github.com/Eightquake/mobile-dungeon-action-game/issues/10)).
- **Please confirm:** salvage yields nothing (OQ-023); abandoned runs don't count for bad-luck protection (OQ-024); a paused run can be finished after an update but is never sent to the leaderboard (OQ-025); 3 restorable copies (OQ-026).
- **Numbers to confirm:** 5 s to run, 4% battery, 5 MB precache, max 6 gear slots, readable-number limits (OQ-006 to OQ-011, OQ-013).
- **Android:** only Chromium in CI covers NFR-023; no real Android phone. **Rested bonus** and **one-time purchase** stay open in the Vision.
- C-005 to C-012 (the non-goals) are linked by no ADR. That's on purpose: they're product rules, not technical decisions.

## Blocked

- Walking skeleton ([#9](https://github.com/Eightquake/mobile-dungeon-action-game/issues/9)): waits for the approval above.
- UC-017 to UC-022 (online features): wait for the backend ADR ([#11](https://github.com/Eightquake/mobile-dungeon-action-game/issues/11)); UC-021 also for the identity ADR ([#12](https://github.com/Eightquake/mobile-dungeon-action-game/issues/12), blocking OQ-022).

## Done since last check-in

- ADR-010 and ADR-011 amended for the Vercel Git integration ([#6](https://github.com/Eightquake/mobile-dungeon-action-game/pull/6), merged).
- Backlog as issues: CI [#8](https://github.com/Eightquake/mobile-dungeon-action-game/issues/8), walking skeleton [#9](https://github.com/Eightquake/mobile-dungeon-action-game/issues/9), phone measurements [#10](https://github.com/Eightquake/mobile-dungeon-action-game/issues/10), backend/identity/leaderboard ADRs [#11](https://github.com/Eightquake/mobile-dungeon-action-game/issues/11)–[#13](https://github.com/Eightquake/mobile-dungeon-action-game/issues/13), southpaw option [#14](https://github.com/Eightquake/mobile-dungeon-action-game/issues/14), owner setup [#15](https://github.com/Eightquake/mobile-dungeon-action-game/issues/15). Earlier: LICENSE [#3](https://github.com/Eightquake/mobile-dungeon-action-game/issues/3), license check [#4](https://github.com/Eightquake/mobile-dungeon-action-game/issues/4).

## Next up

- CI `spec-lint` job with the vendored lint (#8), which doesn't need `package.json`; the LICENSE file (#3).
- After approval: walking skeleton (#9) in four PRs, then the phone measurements (#10).

## Health

- Specs: `spec_lint.py --strict` 0 errors, 0 warnings, 13 infos (system-wide constraints; UC-015 and UC-016 in no test case). Infos from the review, left open: UC-002 A6 names step 2 but pausing works in every step (UC-003 BR-001); UC-003 BR-004 (checkpoints) is applied by no step of UC-003; "the effects" in UC-004 step 2 could mean visual effects, which are outside the simulation (ADR-008).
- CI: none yet (#8)
- Performance budgets: not measured yet (all TODO, #10)
- Free-tier usage: OK, nothing deployed
