# 0003. Updates apply between runs

- Status: Accepted
- Date: 2026-11-08

## Context

The Vision says nothing interrupts a run, including updates to the game itself, and that runs can be suspended and resumed at any moment. A service worker that activates a new version immediately (for example with a blind `skipWaiting()`) can swap code in the middle of a run, break a suspended run, or load a save format the old code doesn't understand.

## Decision

New versions download in the background but never activate mid-run.

- A waiting service worker activates only at a natural stopping point: the end-of-run summary, or the next launch.
- A suspended run must survive an update. If a save can't be migrated, the run is never silently lost; the player is told what happened.
- The save format is versioned (see ADR 0004), and every format change ships with a migration.

## Consequences

- Players may run an older version until their next stopping point. Accepted: a short delay is better than a broken run.
- The update flow needs explicit handling in code and tests, including the case of a suspended run across an update.
- The end-of-run summary gains a second job as the update point, which suits the Vision's goal of natural stopping points.
