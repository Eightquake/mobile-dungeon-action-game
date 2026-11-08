# ADR-002: Offline-first service worker

**Status:** Accepted  
**Date:** 2026-11-08  
**Requirements:** _pending: linked once docs/requirements.md exists_

## Context

The Vision requires the game to be fully playable offline, and runs are short sessions played in places like a bus where connectivity is unreliable. The first load should also be fast, since a slow start breaks the short-session promise.

## Decision

A service worker caches the game so that after the first load, it runs without a network connection.

- The service worker only caches and serves files. It contains no game logic.
- The app shell and the assets needed for the first run are precached at install time.
- Other assets (later content, extra audio) are cached the first time they are requested.
- Built assets use content-hashed filenames and are served cache-first. Only the entry HTML and the service worker itself are revalidated.
- Old caches are deleted when a new version activates.

How and when a new version activates is decided in ADR-003.

## Consequences

- The game works offline after one visit, satisfying the Vision's offline non-goal.
- The precache must stay small. A large precache slows the first visit and can fail on bad connections.
- Assets must go through the build so they get hashed names. Unhashed assets risk being served stale.
- Caching bugs can be hard to see in development. The service worker needs tests or a documented manual check before release.
