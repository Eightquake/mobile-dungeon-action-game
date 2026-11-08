# Status

<!--
Rules for agents:
- Rewrite this file at the end of every session. It shows the current state, not a log; history lives in Git.
- Keep it under one screen. Link to PRs, ADRs and use cases instead of repeating them.
- Order matters: the owner reads from the top and may stop after the first two sections.
- Write "None" in a section that has nothing, so the owner knows it was checked.
-->

Last updated: 2026-11-08 by Claude Code (inception and elaboration session)

## Needs your decision

Proposed ADRs, in the order they block construction of the walking skeleton:

- [ ] [ADR-006](adr/ADR-006-typescript-with-vite-as-language-and-build-tooling.md) – Language and build: recommends TypeScript (strict) + Vite + vite-plugin-pwa (`injectManifest`, our own service worker).
- [ ] [ADR-008](adr/ADR-008-deterministic-fixed-timestep-simulation.md) – Deterministic simulation: recommends a pure fixed-timestep sim, seeded 32-bit PRNG streams, own trig/exp math, quantized input log, cross-engine replay test.
- [ ] [ADR-007](adr/ADR-007-pixijs-as-webgl-renderer.md) – Rendering: recommends PixiJS v8 (WebGL), render-only, our own loop. **Assumes 2D**, see below.
- [ ] [ADR-009](adr/ADR-009-vitest-and-playwright-as-test-frameworks.md) – Tests: recommends Vitest + fast-check + fake-indexeddb, Playwright for journeys and the service worker (Chromium), frozen save fixtures per format version, manual iOS checklist.
- [ ] [ADR-010](adr/ADR-010-github-pages-as-static-host.md) – Hosting: recommends GitHub Pages via Actions (free while the repo is public); Cloudflare Pages as fallback.
- [ ] [ADR-011](adr/ADR-011-github-actions-ci-with-free-security-checks.md) – CI: recommends Actions with check, unit, e2e, spec lint (`--strict`, blocking), size budget, Dependabot, dependency review, CodeQL, secret scanning with push protection. The repo is **public**, so all of this is free; it was private earlier today, and going private again changes the answer.
- [ ] **2D or 3D?** The Vision doesn't say. ADR-007 assumes 2D sprites (cheapest way to hit frame pacing and battery). 3D would mean Three.js instead.

## Ready for review

| PR | Use case | What changed | Check by playing |
|----|----------|--------------|------------------|
| [#2](https://github.com/Eightquake/mobile-dungeon-action-game/pull/2) | UC-001 to UC-022, TC-001 to TC-008 | Requirements, glossary, entity model, use case diagram and specs, test cases, open questions, ADR-006 to ADR-011 (Proposed), Performance.md; Requirements lines of ADR-001 to ADR-005 linked | Nothing to play yet. Read: [requirements](requirements.md), [open questions](open_questions.md) |

## Questions

Vision ambiguities. Each one has a working assumption in the specs and an entry in [open_questions.md](open_questions.md). Answer there or here.

- **Ladder vs. no timers:** a "Greater Rift-style" ladder is usually timed, but the non-goals rule out timers. Assumed: no countdown, a tier clear records play time (OQ-002).
- **Codex unlock:** automatic on pickup, or does the player extract the power from the item between runs? Assumed: automatic (OQ-001). Gear doesn't carry over between runs; only the codex does (OQ-015).
- **Orientation:** landscape (two thumbs) or portrait (one hand on the bus)? Assumed: landscape (OQ-012).
- **Play reminder:** in-game only, or a system notification? Assumed: in-game, shown at the end-of-run summary (OQ-004).
- **Default frame cap:** "smooth" and "kind to the device" pull in opposite directions (60 vs 30). Left as TODO in Performance.md until it's been measured.
- **Rested bonus:** the Vision's own open question. Not resolved, and nothing in the specs depends on it.
- **One-time purchase:** the Vision allows it, but there's no store, the host must be free, and GitHub Pages forbids commercial use. That's not needed now, but monetization would need its own decision.
- **Decided while fixing the review (please confirm):** salvage yields nothing (OQ-023); abandoned runs don't count for bad-luck protection (OQ-024); a paused run can be finished after an update but is never sent to the leaderboard (OQ-025); 3 restorable copies are kept (OQ-026).
- **Numbers to confirm:** reference phone (OQ-014), 100 ms input latency, 5 s to run, 4% battery, 5 MB precache, max 6 gear slots, readable-number limits (OQ-005 to OQ-013).

## Blocked

- All construction: blocked until you've reviewed the specs and accepted ADR-006 to ADR-011 (per the goal of this session).
- UC-021 Restore Save from Cloud: blocked by OQ-022 (how the online identity reaches a new device), which belongs in the identity ADR.

## Done since last check-in

- Inception and elaboration specs and Proposed ADRs ([#2](https://github.com/Eightquake/mobile-dungeon-action-game/pull/2)).

## Next up

- **Walking skeleton** (after ADR-006 to ADR-011 are accepted): an installable, offline-capable page where you can start a run, move, pause and resume. Use cases: [UC-012](use_cases/UC-012-install-game.md), [UC-013](use_cases/UC-013-launch-game-offline.md), [UC-001](use_cases/UC-001-start-run.md) (tier 1, no codex powers), [UC-002](use_cases/UC-002-clear-pack.md) (moving the hero only), [UC-003](use_cases/UC-003-pause-run.md), [UC-004](use_cases/UC-004-resume-run.md). Start with CI (ADR-011) and the vendored spec lint.
- Then measure the reference phone and fill in the TODOs in [Performance.md](Performance.md) with the stress-test scene.
- Later, as Proposed ADRs (not written yet, on purpose): backend provider, player identity, leaderboard verification.

## Health

- Specs: `spec_lint.py` 0 errors, 0 warnings, 12 infos (system-wide constraints not linked to a use case; UC-015 and UC-016 have no journey test case). Independent semantic review: all 21 warnings fixed. Infos left open on purpose: UC-007 reads like a subfunction of UC-002 (kept, since unlocking is its own player-visible goal), UC-016 spans two sittings, restoring an older restorable copy later has no use case yet, and UC-022 has no way out if the backend disappears for good.
- CI: none yet (ADR-011 Proposed)
- Performance budgets: not measured yet (all TODO)
- Free-tier usage: OK, nothing deployed
