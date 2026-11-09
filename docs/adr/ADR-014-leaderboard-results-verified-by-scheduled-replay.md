# ADR-014: Leaderboard results verified by a scheduled replay in GitHub Actions

**Status:** Proposed  
**Date:** 2026-11-09  
**Requirements:** C-001, C-004, C-022, C-023, NFR-022, NFR-026

## Context

ADR-001 accepted that a game running on the player's device can be faked, and ADR-005 keeps the leaderboard
"for fun until verified". UC-018 already sends the seed, the game version, and the input log with every result
(UC-018 BR-002), and ADR-008 makes a run replayable bit for bit from exactly those (NFR-022). The leaderboard shows
a `verified` flag per entry (LEADERBOARD_ENTRY).

What is missing is where the replay runs. A 10-minute run is about 36,000 simulation steps at 60 steps per second.
ADR-012 proposes Cloudflare Workers, whose free plan gives 10 ms of CPU per request, far too little for that.
Verification must stay free (C-001) and must not turn the leaderboard into a reason to come back (C-022).

### Options

| Option | How it works | For | Against |
|--------|--------------|-----|---------|
| A. No verification | Entries stay unverified; plausibility checks only (play time within limits, known game version, tier unlocked) | Nothing to build | Anyone can post any time; the board means little |
| B. Replay in the backend | The backend replays each result on submission | Immediate verdict | Impossible on the Workers free plan (10 ms CPU); a paid plan breaks C-001 |
| **C. Scheduled replay in GitHub Actions** | A scheduled workflow fetches unverified entries from the backend, replays each in Node with the simulation code of its game version, and posts the verdict back | Free for a public repository (ADR-011); the same headless simulation the CI determinism tests use; no new service | Verification lags by hours; one more secret (a backend token for the verifier); old game versions must stay replayable |
| D. Replay by other players' devices | Clients replay others' results and vote | No server CPU | Trusts the clients that cheat in the first place |

## Decision

Recommended: **Option C, with the checks of Option A on submission.**

- On submission the backend runs only cheap checks: a known game version, a play time within the entity model's
  limits, an input log within a size limit, and the rate limit of NFR-026. A result that fails is refused (UC-018 A2).
- A scheduled GitHub Actions workflow, for example every 6 hours, fetches up to a fixed number of unverified
  entries, checks out the tag of each entry's game version, replays it in Node, and posts `verified` or `rejected`.
  A rejected entry is removed from the leaderboard.
- The verifier authenticates with its own backend token, kept as a GitHub secret (C-023), that can only read
  unverified entries and set their verdict.
- The leaderboard shows unverified entries with an "unverified" mark, so a new result appears at once.
- Every released game version is tagged in Git, so its simulation can be checked out for replay.

## Consequences

- Faked results are found within hours, and the leaderboard stays free to run.
- The verifier needs a game version's simulation code, which is in this public repository; nothing secret is
  needed to replay.
- Verification uses GitHub Actions minutes, which are free for a public repository. If the repository goes private
  (see ADR-010, ADR-011), this needs re-deciding.
- The batch size and the schedule bound the work per run, so a flood of submissions only delays verification, and
  the rate limits of NFR-026 protect the backend.
- No reset schedule and no rewards are tied to verification (C-022).
- Depends on ADR-012 (backend) and ADR-013 (identity). If ADR-012 is rejected for Firebase, the same scheduled
  replay works against Firestore.
- Alternatives considered: no verification (A) is the state until this is built; backend replay (B) and replay by
  peers (D) are ruled out.
