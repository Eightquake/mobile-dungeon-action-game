# Test Case: Ladder Result on Leaderboard

## Overview

**ID:** TC-008  
**Goal:** A player with the online features enabled clears a tier while offline, the result is sent once the network returns, and it appears on the leaderboard — verifying that online features never block play.  
**Priority:** Low  
**Status:** Draft

## Roles

- Player (clears a tier and reads the leaderboard)

## Preconditions

- A test instance of the cloud backend runs with no data (test backend `cloud-test`).
- The save has tier 2 cleared and the online features enabled as "Tester2" (test fixture `tests/fixtures/saves/v1-tier2-online.json`).

## Flow

| Step | Name                   | Description                                                                  | Test Data                              | Use Case                                               |
|------|------------------------|------------------------------------------------------------------------------|----------------------------------------|--------------------------------------------------------|
| 1    | Go offline             | The network connection is cut                                                | context offline                        | -                                                      |
| 2    | Start tier 3 offline   | The player starts a run at tier 3                                            | seed=8008                              | [UC-001](../use_cases/UC-001-start-run.md)              |
| 3    | Defeat guardian        | The guardian is defeated after 5 minutes of play                             | test command: guardian defeated at 300 s | [UC-002](../use_cases/UC-002-clear-pack.md)           |
| 4    | Finish run             | The end-of-run summary appears without waiting for the network               | -                                      | [UC-005](../use_cases/UC-005-finish-run.md)             |
| 5    | Reconnect and submit   | The network returns; at the next natural stopping point the result is sent   | context online                         | [UC-018](../use_cases/UC-018-submit-ladder-result.md)   |
| 6    | View leaderboard       | The player opens the leaderboard of tier 3                                   | -                                      | [UC-019](../use_cases/UC-019-view-leaderboard.md)       |
| 7    | Verify entry           | "Tester2" is listed with 5:00 and marked as the player's own, unverified     | -                                      | -                                                      |

## Validation

1. **No blocking**: Step 4 showed the summary in the same time as without online features.
2. **Replayable**: The stored leaderboard entry carries seed 8008, the game version, and an input log.

## Postconditions

- The test backend holds one leaderboard entry for "Tester2" at tier 3; the save holds tier 3 cleared.
