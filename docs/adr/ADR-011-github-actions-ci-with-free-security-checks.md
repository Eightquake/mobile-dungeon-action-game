# ADR-011: GitHub Actions CI with free security checks

**Status:** Proposed  
**Date:** 2026-11-08  
**Requirements:** C-001, C-023, C-027, NFR-016, NFR-019, NFR-020, NFR-022

## Context

The owner reviews in the evenings and merges; agents open the PRs. CI is what makes a PR quick to review: it must
prove that the code type-checks, follows the lint rules (including the simulation rules of ADR-008), passes its tests
(ADR-009), keeps the specs consistent (CLAUDE.md: specs never drift from code), stays within the size budget
(NFR-016, C-027), and leaks no secrets (C-023). All of it must be free (C-001).

**Repository visibility changes the free tier.** `Eightquake/mobile-dungeon-action-game` is **public** (checked
2026-11-08). GitHub's billing documentation, checked the same day, says standard GitHub-hosted runners in public
repositories are free. On GitHub Free, a private repository gets an included compute amount instead (USD 12 per
month, about 2,000 Linux minutes) and 500 MB artifact storage, and GitHub Advanced Security features such as CodeQL
and secret scanning are paid. A free account without a payment method cannot be billed; Actions stop when the
quota runs out.

### Options

| Area | Options | Recommendation and why |
|------|---------|------------------------|
| CI platform | **GitHub Actions**, other free CI | GitHub Actions: next to the code, free and unlimited for public repositories on standard runners |
| Spec lint gate | **Vendor the AIUP scripts** under `tools/aiup/`, install the plugin in CI | Vendoring: the three scripts need only Python 3.9+, are Apache-2.0, and a pinned copy (plugin 3.15.0) keeps the gate reproducible |
| Dependency checks | **Dependabot alerts, security updates, and version updates** plus **dependency-review-action** on PRs; `npm audit` | All free for public repositories; dependency review blocks PRs that add a known-vulnerable dependency |
| Static analysis | **CodeQL default setup** (JavaScript/TypeScript and Actions workflows), Semgrep CE | CodeQL is free for public repositories and needs no extra account; Semgrep CE stays the fallback if the repository becomes private |
| Secrets | **GitHub secret scanning with push protection**, gitleaks | Secret scanning and push protection are free for public repositories and stop a secret before it lands; gitleaks CLI in CI is the fallback for a private repository |

## Decision

Recommended: **GitHub Actions with these jobs, all required for merging into `main`:**

1. **check** — `npm ci`, `tsc --noEmit`, ESLint (with the simulation rules), Prettier check.
2. **unit** — Vitest, including migrations, import fuzzing, and the Node determinism replays (NFR-019, NFR-020,
   NFR-022).
3. **e2e** — Playwright in Chromium, Firefox, and WebKit: the TC journeys, the cross-engine replay hashes, and the
   service worker tests in Chromium.
4. **spec-lint** — `python3 tools/aiup/spec-review/scripts/spec_lint.py --docs docs --strict`. Blocking on errors and
   warnings, since the specs are clean today; findings accepted on purpose go into `docs/.spec-lint-baseline.json`
   only with the owner's approval.
5. **budget** — builds the production bundle, fails if the precache exceeds the limit of NFR-016, and fails if a
   test-only command is in the production bundle (ADR-009).
6. **security** — dependency-review-action on pull requests; CodeQL default setup; Dependabot alerts, security
   updates, and weekly grouped version updates for npm and GitHub Actions; secret scanning with push protection,
   enabled in the repository settings by the owner.

Hardening: every third-party action pinned to a commit SHA, `permissions: contents: read` by default, no
`pull_request_target`, concurrency groups that cancel superseded runs, and caches for npm and the Playwright
browsers. The deploy job of ADR-010 runs only on `main` after all jobs pass.

## Consequences

- Every PR arrives with types, lint, tests, spec consistency, size, and security already checked; the owner reviews
  behaviour and feel.
- The owner turns on branch protection, Dependabot, CodeQL default setup, and secret scanning with push protection in
  the repository settings once; agents cannot do that.
- If the repository becomes private: minutes become capped, CodeQL and secret scanning stop being free. Then Semgrep CE
  and the gitleaks CLI replace them, and the e2e matrix is trimmed to stay within the included minutes; this ADR is
  then superseded.
- The vendored AIUP scripts must be updated deliberately when the plugin changes.
- **Alternatives considered:** as in the table.
