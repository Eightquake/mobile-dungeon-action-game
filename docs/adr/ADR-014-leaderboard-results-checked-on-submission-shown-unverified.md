# ADR-014: Leaderboard results checked on submission and shown as unverified

**Status:** Accepted  
**Date:** 2026-11-09  
**Requirements:** C-001, C-004, C-022, NFR-022, NFR-026

## Context

ADR-001 accepted that a game running on the player's device can be faked, and ADR-005 keeps the leaderboard
"for fun until verified". UC-018 already sends the seed, the game version, and the input log with every result
(UC-018 BR-002), and ADR-008 makes a run replayable bit for bit from exactly those (NFR-022). The leaderboard has a
`verified` flag per entry (LEADERBOARD_ENTRY).

What is missing is where a replay would run. A 10-minute run is about 36,000 simulation steps at 60 steps per second.
ADR-012 puts the backend on Cloudflare Workers, whose free plan gives 10 ms of CPU per request, far too little for
that. Verification must stay free (C-001) and must not turn the leaderboard into a reason to come back (C-022).

### Options

| Option | How it works | For | Against |
|--------|--------------|-----|---------|
| **A. Checks on submission only** | The backend refuses implausible results (unknown game version, play time out of range, oversized input log, rate limit); entries stay unverified | Little to build; the input logs are kept, so a replay can be added later | Anyone can still post a plausible fake time |
| B. Replay in the backend | The backend replays each result on submission | Immediate verdict | Impossible on the Workers free plan (10 ms CPU); a paid plan breaks C-001 |
| C. Scheduled replay in GitHub Actions | A scheduled workflow fetches unverified entries, replays each in Node with the simulation code of its game version, and posts the verdict back | Free for a public repository; the same headless simulation the CI determinism tests use | More to build; verification lags by hours; one more GitHub secret; every released version must stay replayable |
| D. Replay by other players' devices | Clients replay others' results and vote | No server CPU | Trusts the clients that cheat in the first place |

## Decision

The owner chose **Option A, checks on submission only**.

- On submission the backend checks that the game version is known, the play time is within the entity model's
  limits, and the input log is within a size limit, and applies the per-player rate limit of NFR-026. A result that
  fails is refused (UC-018 A2).
- Every entry keeps its seed, game version, and input log, and its `verified` flag stays false.
- The leaderboard shows every entry as unverified (UC-018 BR-004).

## Consequences

- The leaderboard is for fun: a plausible fake time is not caught. That matches ADR-005's stance until a replay
  exists.
- Because the input logs are stored, a replay (Option C) can be added later as its own ADR without changing what
  the game sends. Every released game version should be tagged in Git so its simulation stays available for that.
- No GitHub secret is needed for verification, and no extra workflow runs.
- No reset schedule and no rewards are tied to the leaderboard (C-022).
- Alternatives considered: scheduled replay in GitHub Actions (C) is the intended next step; backend replay (B) and
  replay by peers (D) are ruled out.
