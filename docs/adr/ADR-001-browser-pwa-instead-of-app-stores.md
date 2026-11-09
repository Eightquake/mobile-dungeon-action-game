# ADR-001: Browser PWA instead of app stores

**Status:** Accepted  
**Date:** 2026-11-08  
**Requirements:** C-001, C-002, NFR-023, FR-021

## Context

The game is a solo evening hobby project for phones. It is unknown whether anyone besides the owner will play it. Publishing in app stores costs money before a single player exists: Apple charges a yearly developer fee and Google a one-time fee. App stores also add review processes and release overhead that don't fit evening work.

The Vision requires the game to be fully playable offline and to have no microtransactions.

## Decision

The game is delivered as a Progressive Web App, served as static files from a free host. Players start from a link and can add the game to their home screen, where it runs fullscreen like an app.

App stores are out of scope. If the game later finds an audience, the same web build can be wrapped for the stores, and that would be a new ADR.

## Consequences

- No upfront cost and no store review. Releasing is deploying static files.
- Single-player save editing is possible. Accepted: it only affects the player's own game, and there is nothing competitive or purchasable to protect. Leaderboards (ADR-005) reopen this question.
- Browser constraints apply: lower performance headroom than native, audio must be unlocked by a user gesture, and browser gestures can interfere with touch controls. These are handled through `docs/Performance.md` and input design.
- On iOS, storage for sites not added to the home screen can be cleared. See ADR-004.
- Discoverability is lower than in a store. Accepted, given the unknown audience.
