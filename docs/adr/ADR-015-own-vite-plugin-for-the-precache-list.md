# ADR-015: Own Vite plugin for the precache list instead of vite-plugin-pwa

**Status:** Accepted  
**Date:** 2026-11-09  
**Requirements:** C-015, C-014, NFR-016

## Context

ADR-006 chose vite-plugin-pwa with the `injectManifest` strategy and Workbox precaching. The build generates the
precache list, and we write the service worker ourselves, so activation follows ADR-003 (C-014). The service worker
only caches and serves content-hashed files (C-015, ADR-002), and the precache stays within 5 MB (NFR-016).

Installing it for the walking skeleton (#9, PR 2: UC-012 and UC-013) brings in two advisories:

| Package    | Path                                                                       | Advisory            | Severity | Patched version |
|------------|----------------------------------------------------------------------------|---------------------|----------|-----------------|
| `deepmerge` 4.3.1 | vite-plugin-pwa 2.0.0 → workbox-build 7.4.1 → @rollup/plugin-node-resolve 16.0.3 | GHSA-gcqx-w48m-w2h4 | low      | none            |
| `glob` 11.1.0     | vite-plugin-pwa 2.0.0 → workbox-build 7.4.1                                | GHSA-3g3m-2fjr-6pw4 | medium   | 14.0.2          |

An npm override to `glob` 14.0.4 removes the second advisory, and the build still runs. The first has no fix.
`deepmerge` is used only by workbox-build's `generateSW` bundling. The `injectManifest` path does not call it, and it
never ships to players. The ADR-011 `security` job runs dependency-review-action with `fail-on-severity: low`, so a PR
that adds vite-plugin-pwa fails a required check.

What the project needs from the plugin is small. It needs the list of built files with their content hash, written
into our own service worker at build time. The manifest file, the icons, and the `<link>` tags can live in `index.html`
and the static folder without a plugin. vite-plugin-pwa's other features (`generateSW`, auto-update registration,
dev-mode service worker) are features ADR-003 and C-015 keep us from using.

This ADR overlaps ADR-002 and ADR-003. It keeps both: same caching rules, same activation rule. It also overlaps
ADR-011, whose security job it leaves unchanged.

### Options

| Option | For | Against |
|--------|-----|---------|
| **A. Own Vite plugin (about 50 lines) plus a hand-written service worker in `src/sw/`, no Workbox** | No new runtime or build dependency, so no advisories and no licenses to check. The precache logic is visible in review: install, activate, fetch. Partial installs (UC-012 A4) and cache cleanup (ADR-002) are written explicitly for our case. Vite already gives us the bundle with hashed names | We own about 100 lines of build and caching code and its tests. Caching mistakes that Workbox has already solved (opaque responses, redirects, range requests) are ours to avoid. Our assets are same-origin and static, which keeps this small |
| A2. Own Vite plugin for the list, plus `workbox-precaching` as the service worker runtime | Workbox's tested precache logic. The runtime packages (`workbox-precaching`, `-core`, `-routing`, `-strategies`) do not depend on `deepmerge` or `glob` | A runtime dependency in the service worker for logic we can write in a few dozen lines. Workbox's precache cache layout and revision handling are its own, so a later switch away means migrating caches |
| B. Keep vite-plugin-pwa and exempt `GHSA-gcqx-w48m-w2h4` with `allow-ghsas` in the security job, plus the `glob` override | Follows ADR-006 as written. The exempted code never runs in our build path | It loosens a required check, which needs the owner each time. The exemption stays until upstream replaces `deepmerge`. It keeps a large build-time tree (workbox-build, rollup plugins, babel) for one feature |
| C. Keep vite-plugin-pwa and leave the security check failing | No work | A required check that is always red hides the next real finding. Not acceptable |

## Decision

Decided: **Option A.**

In detail:

- `vite.config.ts` gets a small local plugin (in `scripts/` or `vite.config.ts` itself). It builds `src/sw/sw.ts` as
  `/sw.js` with no hash, and in `generateBundle` replaces a placeholder in it with the precache list. The list
  holds every emitted file that the first run needs, plus `/` (the entry HTML, revisioned by a hash of its content).
  The list's own hash names the cache version.
- `src/sw/sw.ts` contains no game logic (C-015). It does three things:
  - **install:** stores each precache entry in the versioned cache. It skips entries already cached under the same
    URL, so an interrupted first visit resumes where it stopped (UC-012 A4).
  - **activate:** deletes caches of other versions.
  - **fetch:** answers same-origin `GET` requests cache-first, and navigations with the cached entry HTML.
- No automatic `skipWaiting()` and no `clients.claim()`. A new version waits until every tab of the game is closed,
  or until the end-of-run summary asks it to activate (ADR-003, C-014, UC-014).
- The web app manifest (`manifest.webmanifest`) and the icons are static files in `public/`. `index.html` links them.
- vite-plugin-pwa and Workbox are not added. This replaces the vite-plugin-pwa bullet of ADR-006's Decision. ADR-006's
  bullet was amended in place to point here, at the owner's request (2026-11-09). The rest
  of ADR-006 stands.
- The CI `budget` job (`scripts/check-budget.mjs`) reads the precache list from `dist/sw.js` and measures exactly
  those files against NFR-016, instead of every file in `dist/`.

## Consequences

- The dependency tree stays as it is today: no build-time advisories, and the `security` job stays strict.
- The service worker is ours to test. Playwright covers precache, offline launch, and the update wait in Chromium
  (ADR-009). The manual iOS check before each release covers WebKit. The list generation gets a Vitest test.
- New asset kinds (later content cached on first use, ADR-002) need code in our service worker, not a Workbox
  strategy. That is a few lines per rule.
- If the service worker grows beyond precache plus a cache-on-first-use rule, Option A2 can still be adopted without
  touching the build plugin.
- **Alternatives considered:** A2, B, C as in the table.
