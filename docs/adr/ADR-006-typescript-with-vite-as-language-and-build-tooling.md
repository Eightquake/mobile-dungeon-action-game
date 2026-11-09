# ADR-006: TypeScript with Vite as language and build tooling

**Status:** Proposed  
**Date:** 2026-11-08  
**Requirements:** C-001, C-015, C-024, NFR-016, NFR-022, NFR-023

## Context

Construction needs a language and a build before the first line of game code. The forces:

- **Zero cost (C-001).** Every tool must be free and open source; nothing may need an account with billing.
- **Small first load (NFR-016).** At most 5 MB precached. The build must tree-shake, minify, and emit content-hashed
  file names, which ADR-002 and C-015 require for cache-first serving.
- **Service worker under our control (C-015, ADR-003).** The build must generate the precache manifest but leave
  activation to our own code, so that a new version never activates mid-run.
- **Deterministic simulation (NFR-022).** The simulation must be a separate module with enforced rules (no
  `Math.random`, no wall-clock). Static types and lint rules make those rules checkable.
- **Tuning values in data (C-024).** Data files must be importable and validated at build time.
- **Agents write most of the code** and the owner reviews in the evenings. A mainstream stack with strong types
  catches mistakes before review.
- **Browsers (NFR-023):** latest 2 Safari iOS and Chrome Android versions, plus Chrome 138 on the Galaxy S8, which
  gets no updates. Modern ES modules are fine; the build target must include Chrome 138.

### Options

| Option | For | Against |
|--------|-----|---------|
| **A. TypeScript (strict) + Vite + vite-plugin-pwa (`injectManifest`)** | Types across simulation, save format, and tuning data; Vite is the mainstream fast dev server and Rollup-based production build with hashing and tree-shaking; `injectManifest` generates the precache list but lets us write the service worker; all MIT-licensed | A build step and a `node_modules` tree; plugin and Vite majors need occasional upgrades |
| B. Plain JavaScript + esbuild + hand-written service worker | Fewest dependencies, fastest build | No types for the save format and simulation state, where silent shape errors cost the most; precache manifest and hashing glue written by hand |
| C. TypeScript + webpack | Mature, flexible | Slower, more configuration, no advantage for this project over Vite |
| D. Rust/C++ to WebAssembly (e.g. an engine with a web target) | Integer math and determinism are natural | Larger downloads, slower iteration, harder debugging in mobile Safari, a smaller pool of examples for agents |
| E. A full engine's web export (e.g. Godot) | Editor, physics, tooling | Export sizes far above NFR-016, the engine owns the loop and the service worker, browser-specific export issues |

## Decision

Recommended: **Option A.**

- TypeScript with `strict` on, ES modules, target the browsers of NFR-023.
- Vite for the dev server and the production build; npm with a committed `package-lock.json` and `npm ci` in CI; the
  Node.js LTS version pinned in `.nvmrc` and `engines`.
- vite-plugin-pwa with the `injectManifest` strategy and Workbox precaching, so the service worker is our own file
  and activation follows ADR-003 (no automatic `skipWaiting`).
- ESLint with typescript-eslint and Prettier. The simulation folder gets extra lint rules that forbid
  `Math.random`, `Date`, `performance`, DOM access, and the non-deterministic `Math` functions named in ADR-008.
- Tuning data as JSON files under `data/`, validated by a schema at build time and in tests.
- Source layout: `src/sim/` (pure simulation, no DOM), `src/render/`, `src/ui/`, `src/save/`, `src/sw/`, `data/`.

## Consequences

- One language for game, service worker, tests, and tooling; agents and the owner work in a mainstream stack.
- The simulation's purity is enforced by lint, not only by convention.
- Dependency upgrades are a recurring chore; Dependabot (ADR-011) proposes them.
- Option D or E would only be revisited if a measured performance problem cannot be solved in TypeScript.
- **Alternatives considered:** B, C, D, E as in the table.
