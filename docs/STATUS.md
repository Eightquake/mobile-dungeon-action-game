# Status

<!--
Rules for agents:
- Rewrite this file at the end of every session. It shows the current state, not a log; history lives in Git.
- Keep it under one screen. Link to PRs, ADRs and use cases instead of repeating them.
- Order matters: the owner reads from the top and may stop after the first two sections.
- Write "None" in a section that has nothing, so the owner knows it was checked.
-->

Last updated: 2026-11-09 by Claude Code (ADR-006 to ADR-011 accepted, hosting moved to Vercel Hobby)

## Needs your decision

- **Review [ADR-010](adr/ADR-010-vercel-hobby-as-static-host.md) (Vercel Hobby).** You chose Vercel, and I filled in how it works: deploys run from GitHub Actions with the Vercel CLI (Vercel's own Git builds are switched off), so production only goes out after CI passes. I also added a **preview deployment per PR** so you can play a PR on the phone before merging. Strike the preview job if you don't want it.
- **One-time setup only you can do** (before the first deploy): create the Vercel Hobby account and project, create a token, and add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` as GitHub Actions secrets. For ADR-011: turn on branch protection, Dependabot, CodeQL default setup, and secret scanning with push protection.
- **Use case review:** UC-001, UC-002, UC-003, UC-004, UC-012 and UC-013 (the walking skeleton) are still `Draft`. Tell me when they're approved.

## Ready for review

| PR | Use case | What changed | Check by playing |
|----|----------|--------------|------------------|
| this PR | none (ADRs) | ADR-006, 007, 008, 009 and 011 set to Accepted. ADR-010 rewritten for Vercel Hobby and accepted (file renamed) | Nothing to play. Read ADR-010 |

## Questions

Vision ambiguities. Each one has a working assumption in the specs and an entry in [open_questions.md](open_questions.md). Answer there or here.

- **No Android phone to measure on:** with the Galaxy S8 dropped, the iPhone 13 Pro is the only reference phone, so Chrome on Android (NFR-023) is covered only by Chromium tests in CI, not by a real phone. Add an Android phone later if Android performance matters. Also, the Vision says "ordinary mid-range phone"; a 2021 flagship is roughly that by now, but budgets measured on it may be generous for older Android phones.
- **Ladder vs. no timers:** a "Greater Rift-style" ladder is usually timed, but the non-goals rule out timers. Assumed: no countdown, a tier clear records play time (OQ-002).
- **Play reminder:** in-game only, or a system notification? Assumed: in-game, shown at the end-of-run summary (OQ-004).
- **Default frame cap:** "smooth" and "kind to the device" pull in opposite directions (60 vs 30). Left as TODO in Performance.md until measured on the reference phone.
- **Rested bonus:** the Vision's own open question. Not resolved, and nothing in the specs depends on it.
- **One-time purchase:** the Vision allows it, but there's no store, the host must be free, and Vercel Hobby forbids commercial use (ADR-010). That's not needed now, but monetization would need its own decision.
- **Decided while fixing the review (please confirm):** salvage yields nothing (OQ-023); abandoned runs don't count for bad-luck protection (OQ-024); a paused run can be finished after an update but is never sent to the leaderboard (OQ-025); 3 restorable copies are kept (OQ-026).
- **Numbers to confirm:** 5 s to run, 4% battery, 5 MB precache, max 6 gear slots, readable-number limits (OQ-006 to OQ-011, OQ-013).
- **Answered 2026-11-09 and now in the specs:** sacrifice to unlock codex powers, with waiting legendaries that never expire (OQ-001, [UC-007](use_cases/UC-007-sacrifice-legendary.md)); 100 ms responsiveness, low-priority check (OQ-005); landscape with the stick under the left thumb and skill buttons under the right (OQ-012); iPhone 13 Pro as the reference phone (OQ-014; the Galaxy S8 was dropped because its browser is frozen at Chrome 138).

## Blocked

- Walking skeleton: waits for the use case review above. The first deploy waits for the Vercel secrets.
- UC-021 Restore Save from Cloud: blocked by OQ-022 (how the online identity reaches a new device), which belongs in the identity ADR.

## Done since last check-in

- Inception and elaboration specs and Proposed ADRs ([#2](https://github.com/Eightquake/mobile-dungeon-action-game/pull/2), merged).
- ADR-006 to ADR-011 accepted, with Vercel Hobby as the host.
- License decided: AGPL-3.0-or-later for code, CC BY-SA 4.0 for art and sound. Adding the LICENSE file is issue [#3](https://github.com/Eightquake/mobile-dungeon-action-game/issues/3).

## Next up

- **Stack file** `docs/architecture/stack.md` from ADR-006 to ADR-011, then CI (ADR-011) with the vendored spec lint.
- **Walking skeleton**: an installable, offline-capable page where you can start a run, move, pause and resume. Use cases: [UC-012](use_cases/UC-012-install-game.md), [UC-013](use_cases/UC-013-launch-game-offline.md), [UC-001](use_cases/UC-001-start-run.md) (tier 1, no codex powers), [UC-002](use_cases/UC-002-clear-pack.md) (moving the hero only), [UC-003](use_cases/UC-003-pause-run.md), [UC-004](use_cases/UC-004-resume-run.md).
- Then measure the reference phone and fill in the TODOs in [Performance.md](Performance.md) with the stress-test scene.
- Later, as Proposed ADRs (not written yet, on purpose): backend provider, player identity, leaderboard verification.
- Later idea from the owner: a southpaw option that mirrors the controls (stick right, skill buttons left). Needs a use case change (UC-015 settings) when it's picked up.

## Health

- Specs: `spec_lint.py` 0 errors, 0 warnings, 13 infos (system-wide constraints not linked to a use case; UC-015 and UC-016 have no journey test case). Independent semantic review: all 21 warnings fixed. Infos left open on purpose: UC-007 reads like a subfunction of UC-002 (kept, since unlocking is its own player-visible goal), UC-016 spans two sittings, restoring an older restorable copy later has no use case yet, and UC-022 has no way out if the backend disappears for good.
- CI: none yet (ADR-011 accepted, not built)
- Performance budgets: not measured yet (all TODO)
- Free-tier usage: OK, nothing deployed
