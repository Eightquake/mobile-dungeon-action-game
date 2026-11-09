# Stack

**For the agent:** read before writing code. This file is the AI Unified Process record of the technical layers,
independent of how the team documents its architecture. The Layers table says which layer skill builds and tests
each technical layer: `/use-case-implement` runs the Skill column bottom-up, `/use-case-test` runs the Test skill
column from the integration layer up, and `/use-case-coverage` searches for the markers in the last table.

**Last updated:** 2026-11-09 (ADR-012 accepted)

## Layers

| Layer       | Technology                                                                 | Skill | Test skill | Location                     |
|-------------|----------------------------------------------------------------------------|-------|------------|------------------------------|
| Migration   | Save-format migrations in TypeScript, one per format version (ADR-004, C-017) | –     | –          | `src/save/`                  |
| Persistence | IndexedDB, faked by fake-indexeddb in unit tests (ADR-004, ADR-009)        | –     | –          | `src/save/`                  |
| Client      | HTTPS calls from the game to the Cloud Backend on Cloudflare Workers (ADR-012, ADR-013) | –     | –          | not decided until UC-017 is built |
| Service     | TypeScript, deterministic fixed-timestep simulation, Vitest (ADR-006, ADR-008, ADR-009) | –     | –          | `src/sim/`, tuning in `data/` |
| API         | –                                                                          | –     | –          | –                            |
| UI          | Three.js `WebGLRenderer` and a DOM HUD (ADR-007)                           | –     | –          | `src/render/`, `src/ui/`     |
| E2E         | Playwright Test in Chromium, Firefox, and WebKit (ADR-009)                 | –     | –          | `tests/e2e/`                 |

**Integration layer:**

| Use case offered through | Tested in | Test skill |
|--------------------------|-----------|------------|
| UI                       | Service   | –          |
| Service                  | Service   | –          |

A layer the project does not have is marked `–` in every column (a UI layer in a REST service). The Integration
layer table keeps only the rows of the entry layers the project has — a REST service drops the UI row — and its
Test skill column names what the Layers table names for that layer (`–` while the skill is not installed). A use
case is tested in the first row its `**Layers:**` line names, or in the first row when it has no such line. That layer's tests run in process against the real database
and exercise every layer below it, so `/use-case-test` runs its test skill and the ones above it and writes no tests
of their own for the layers below unless a run names them (`/use-case-test UC-001 persistence`).

This project is a static PWA with no server of its own (ADR-001, ADR-010), so there is no API layer. The UI calls
the simulation in process, and the simulation runs headless in Node (ADR-008), so a use case offered through the UI
is tested in the Service layer: Vitest runs `src/sim/` together with `src/save/` on fake-indexeddb. The canvas and
the HUD are covered by the TC journeys in Playwright and by the hand checklist on the reference phone (ADR-009).
No layer plugin of the AI Unified Process marketplace covers this stack, so every Skill column is `–` and
`/use-case-implement` builds each layer from its own knowledge, the ADRs, and `docs/Performance.md`.
`aiup-playwright` (`playwright-e2e-test`) needs only `aiup-core` and could be installed for the E2E row.

**E2E scope:** Test cases only

`Use cases and test cases`: `/use-case-test` adds a browser test to every use case offered through the UI, and
`/test-case-implement` automates the TC-* journeys. `Test cases only`: browser tests are written for the journeys
alone, and a use case is tested in its integration layer. A project without an E2E layer drops the line.

ADR-009 decides the scope: Playwright runs the TC journeys, the cross-engine replay hashes, and the service worker
tests; use cases are tested with Vitest.

## External systems

| System        | Contract | Location    |
|---------------|----------|-------------|
| Cloud Backend | –        | `backend/`  |

The systems our system calls, by the name the use cases write on their `**Secondary Actors:**` line: the Client
layer builds an adapter for each one from its contract (OpenAPI or AsyncAPI; `–` while there is none). A secondary
actor without a row is a person or a role. Without a Client layer the section is dropped.

The Browser (UC-012, UC-013) is the platform the game runs in and is reached through Web APIs, not through a
Client adapter, so it has no row. The Cloud Backend is our own Cloudflare Worker with D1 (ADR-012), built in
`backend/` of this repository; its API contract is written when UC-017 is specified for construction.

## Module layout

A single Vite application at the repository root, laid out by ADR-006:

| Folder        | Contents                                                                                     |
|---------------|----------------------------------------------------------------------------------------------|
| `src/sim/`    | Pure simulation: state in, inputs in, state out. No DOM, wall-clock, `Math.random`, or network (ADR-008) |
| `src/render/` | Three.js scene, camera, pools, interpolation between simulation states (ADR-007)            |
| `src/ui/`     | DOM HUD, touch controls, menus, the game loop                                               |
| `src/save/`   | IndexedDB access, save format versions and migrations, export and import (ADR-004)          |
| `src/sw/`     | The service worker: caching only, no game logic (ADR-002, ADR-015, C-015)                          |
| `backend/`    | The Cloud Backend: a Cloudflare Worker with D1 for the online features, TypeScript and Vitest (ADR-012) |
| `data/`       | Tuning data as JSON, validated by a schema at build time and in tests (C-024)               |
| `scripts/`    | Build and CI scripts, such as the budget check (`scripts/check-budget.mjs`)                 |
| `tests/`      | Vitest tests next to their layer name, `tests/e2e/` for Playwright, `tests/fixtures/saves/` for frozen saves (ADR-009) |

## Commands

| Purpose           | Command                                                                   |
|-------------------|---------------------------------------------------------------------------|
| Build             | `npm run build`                                                           |
| Type check, lint  | `npm run typecheck && npx eslint . && npx prettier --check .` (`typecheck` also checks `src/sw/` with its WebWorker types) |
| Unit tests        | `npx vitest run`                                                          |
| Integration tests | `npx vitest run` (the Service layer is the integration layer)            |
| End-to-end tests  | `npx playwright test`                                                     |
| Budget            | `npm run build && npm run budget` (NFR-016 precache size, no `TEST_BUILD_ONLY` code; ADR-009) |
| Spec lint         | `python3 tools/aiup/spec-review/scripts/spec_lint.py --docs docs --strict` |

The commands are those of ADR-011; CI runs each in its own job (`.github/workflows/ci.yml`).

## Markers

Each layer skill keeps its own rows here: on every run it checks that the rows for its layer match its marker
reference and corrects them. Do not edit the rows by hand; rerun the layer skill instead.

| Layer | Skill | Kind | Marker to grep for |
|-------|-------|------|--------------------|
| All   | –     | Code | `// UC-XXX BR-YYY:` directly above the method, query condition, or validator that enforces the rule |
