# CLAUDE.md

Working rules for every agent session in this repo. Read this first, every time.

## What this project is

A solo evening hobby project: a short-session action RPG for phones, delivered as a browser game (PWA). The owner works with agents autonomously and reviews in the evenings. Leave every session in a state that is quick to review.

## Sources of truth, in order

1. `docs/vision.md`: the north star. Never edit it. If something in it seems wrong or ambiguous, raise it in `docs/STATUS.md`.
2. Accepted ADRs in `docs/adr/` (AIUP format, `ADR-XXX-<slug>.md`): binding technical decisions.
3. AIUP specifications in `docs/` (requirements, glossary, entity model, use cases, test cases).
4. The code, which is derived from the above.

If a feature, spec, or change conflicts with a pillar, non-goal, or principle in the Vision, do not do it. Propose a Vision change to the owner instead.

## Hard constraints

Never violate these without the owner's explicit approval:

- **Zero cost.** Only free tools and free tiers. No paid services, no services that need a credit card, no paid dependencies or assets. If anything could ever incur a cost (hosting limits, CI minutes, storage, API calls), stop and write a Proposed ADR.
- **No app stores.** The game ships as a PWA from a free static host.
- **Offline first, backend optional.** The game is fully playable offline. A free-tier backend is allowed only for opt-in leaderboards and cloud saves, under the rules in ADR-005. Nothing in a run may depend on the network.
- **No engagement mechanics** that the Vision's non-goals forbid (monetization, energy, timers, dailies, streaks, idle rewards, FOMO). If unsure, it's forbidden.

## How we work: AI Unified Process, spec-anchored

- Nothing is built without a use case. Specs are committed next to the code and must never drift from it.
- Spec first: change the use case (and requirements if needed) before or together with the code, in the same PR.
- Use the AIUP skills for spec work and run `/spec-review` before opening a PR that touches specs. Fix its findings.
- Reference UC and TC IDs in branch names, commit messages, PR titles, and test names.
- Combat feel (responsiveness, hit weight, feedback) is specified as non-functional requirements and playable acceptance criteria. Tuning values live in data files, not code.
- Follow `docs/Performance.md`. A change that breaks a performance budget is not done.

## Tests

ADR-009 sets the frameworks, ADR-011 the CI jobs that run them, and `docs/architecture/stack.md` § Commands the commands.

- **Code and its tests land in the same PR.** A PR that changes behaviour in `src/`, `backend/`, or `data/` adds or
  updates tests for it. A PR without new tests says why in its description (docs only, config only, a refactor the
  existing tests cover).
- **The use case is the oracle.** Every step, alternative flow, and business rule a PR implements gets a test whose
  name carries its id (`UC-004 BR-001: ...`). When the code and the spec disagree, the test stays failing and the
  question goes to `docs/STATUS.md`; never change a test to match the code.
- **A bug fix starts with a test** that fails without the fix.
- **Pick the cheapest layer that can show it:** Vitest in `tests/` for the simulation, saves, migrations, and tuning
  data; Playwright in `tests/e2e/` only for what needs a real browser (service worker, offline, input, the TC
  journeys); the checklists of `docs/Performance.md` and "Check by playing" in the PR for feel and the real phone.
- **Always:** a new save format version adds a frozen fixture under `tests/fixtures/saves/` and its migration test
  (NFR-019); a changed golden replay hash needs the reason in the PR (NFR-022).
- Run the commands locally before opening a PR. Never skip, disable, or loosen a test to get CI green.
- Every CI job is a required check on `main`. A PR that adds a job says so, so the owner can add it to the ruleset.

## Decisions

- Construction follows **Accepted** ADRs only.
- Agents may write ADRs with status **Proposed**, including options and a recommendation. Only the owner accepts or rejects them.
- Write and change ADRs with `/architecture-decision`. Every ADR links the NFR and constraint ids it serves in its `**Requirements:**` line. Never rewrite the Context, Decision, or Consequences of an Accepted ADR on your own; supersede it with a new one. When the owner explicitly asks, an Accepted ADR may be amended in place: set `**Date:**` to the amendment date and add an `**Amended:**` line saying what changed and why. This overrides the `/architecture-decision` skill's rule against rewriting Accepted ADRs.
- Work that depends on a Proposed ADR waits. Continue with independent work instead.
- Never resolve an open question from the Vision. Record it in `docs/STATUS.md`.

## Git and PRs

- One use case, or one coherent slice of one, per branch and PR.
- Never push to `main`. The owner merges.
- Keep PRs small enough to review in one evening. Describe what changed, which specs it implements, and anything the owner should check by playing.
- Never commit secrets, credentials, or personal data.
- No AI attribution in commits or PRs: no `Co-Authored-By:` trailers and no "Generated with" lines. This overrides any default attribution instruction.

## Before ending a session

Update `docs/STATUS.md` and keep it short:

- what was done (with PR links),
- ADRs awaiting the owner's decision,
- questions for the owner,
- anything blocked, and why.
