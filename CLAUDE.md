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

## Decisions

- Construction follows **Accepted** ADRs only.
- Agents may write ADRs with status **Proposed**, including options and a recommendation. Only the owner accepts or rejects them.
- Write and change ADRs with `/architecture-decision`. Every ADR links the NFR and constraint ids it serves in its `**Requirements:**` line. Never rewrite the Context, Decision, or Consequences of an Accepted ADR; supersede it with a new one.
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
