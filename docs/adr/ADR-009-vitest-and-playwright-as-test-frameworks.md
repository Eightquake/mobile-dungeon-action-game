# ADR-009: Vitest and Playwright as test frameworks

**Status:** Accepted  
**Date:** 2026-11-09  
**Requirements:** C-001, C-014, C-017, NFR-019, NFR-020, NFR-021, NFR-022

## Context

Several requirements can only be kept with automated tests: a migration test for every save format version
(NFR-019), robustness against 1,000 malformed imports (NFR-020), offline completeness (NFR-021), cross-engine
determinism (NFR-022), and updates that never activate mid-run (C-014). ADR-002 says the service worker needs tests or
a documented manual check before release. All tools must be free (C-001); paid real-device clouds are out.

The test cases TC-001 to TC-008 describe journeys that need a real browser, a service worker, offline switching, and
two versions of the game served one after the other.

### Options

| Layer | Options | Recommendation and why |
|-------|---------|------------------------|
| Unit, simulation, save | **Vitest**, Jest, `node:test` | Vitest: shares the Vite config and TypeScript setup of ADR-006, fast, MIT. Jest needs separate TypeScript and ESM setup; `node:test` lacks the tooling around it |
| Property and fuzz tests | **fast-check**, hand-written generators | fast-check: shrinking counterexamples for the 1,000 malformed imports (NFR-020) and for snapshot/resume equivalence; MIT |
| IndexedDB in unit tests | **fake-indexeddb**, real browser only | fake-indexeddb for unit speed; the real IndexedDB is covered by the end-to-end tests |
| End-to-end and service worker | **Playwright Test**, Cypress, WebdriverIO | Playwright: Chromium, Firefox, and WebKit from one test, offline switching per browser context, service worker access in Chromium, phone viewport emulation; Apache-2.0. Cypress has weaker multi-engine and service worker support |
| Real phones | **Manual checklist** in the acceptance protocol, paid device clouds | Manual: device clouds cost money (C-001); combat feel is checked by playing anyway |

## Decision

Decided:

- **Vitest** for unit tests of the simulation, save, migrations, and tuning-data schemas; **fast-check** for
  property tests; **fake-indexeddb** for storage in unit tests.
- **Save migrations:** for every released save format version, an example save is frozen under
  `tests/fixtures/saves/` and never edited. A test migrates each one to the current version and checks that no codex
  power, tier clear, setting, or paused run is lost (NFR-019). Releasing a format change without a new fixture fails
  CI.
- **Imports:** a fast-check property generates at least 1,000 malformed and tampered save exports and asserts that
  the import reports an error, leaves the save unchanged, and does not throw (NFR-020).
- **Determinism:** golden input logs replay in Node (Vitest) and in Chromium, Firefox, and WebKit (Playwright) and
  must produce the same end-state hash (NFR-022, ADR-008). A property test checks that snapshot, restore, and
  continue equals an uninterrupted run (UC-004 BR-001).
- **Playwright Test** for the TC journeys. Service worker tests run in Chromium, where Playwright exposes service
  workers: offline launch via `context.setOffline(true)` (TC-006), and the update flow by serving two builds from a
  local static server and switching between them (TC-005).
- **Test build:** a build flag adds a seed override and test commands (defeat the guardian, defeat the hero). The flag
  is compiled out of production builds, and CI checks that the production bundle contains none of them.
- **Real devices:** the reference phone (Safari on the iPhone 13 Pro) is checked by hand with a checklist in the acceptance
  protocol, including install, offline launch, and the combat-feel NFRs.

## Consequences

- Most rules run headless in Node in seconds; browser tests are reserved for journeys, storage, and the service
  worker.
- Service worker behaviour in WebKit is not automated; the manual iOS check before each release covers it.
- Every save format change costs a fixture and a migration test, the price ADR-004 already accepted.
- Use case tests carry the UC and TC ids in their names, as CLAUDE.md requires.
- **Alternatives considered:** as in the table.
