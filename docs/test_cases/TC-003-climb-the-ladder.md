# Test Case: Climb the Ladder

## Overview

**ID:** TC-003  
**Goal:** A player clears a tier, sees the next tier unlocked on the challenge ladder, and starts a run at it — verifying ladder progress from a clear to the next attempt.  
**Priority:** High  
**Status:** Draft

## Roles

- Player (clears tiers and reads the challenge ladder)

## Preconditions

- The save has tiers 1 and 2 cleared (test fixture `tests/fixtures/saves/v1-tier2.json`).
- The test build's command to defeat the guardian at once is available.

## Flow

| Step | Name                    | Description                                                            | Test Data                         | Use Case                                                |
|------|-------------------------|------------------------------------------------------------------------|-----------------------------------|---------------------------------------------------------|
| 1    | Start run at tier 3     | The tier choice preselects tier 3; the player confirms                 | seed=3003                         | [UC-001](../use_cases/UC-001-start-run.md)               |
| 2    | Clear the tier          | The guardian of tier 3 is defeated after 4 minutes 30 seconds of play  | test command: guardian defeated at 270 s | [UC-005](../use_cases/UC-005-finish-run.md)   |
| 3    | Verify summary          | The summary shows tier 3 cleared in 4:30 and tier 4 newly unlocked     | -                                 | -                                                       |
| 4    | View challenge ladder   | From the summary, the player opens the challenge ladder                | -                                 | [UC-009](../use_cases/UC-009-view-challenge-ladder.md)   |
| 5    | Verify ladder           | Tier 3 is marked as highest cleared with 4:30; tier 4 is unlocked      | -                                 | -                                                       |
| 6    | Start run at tier 4     | The player selects tier 4 and plays it                                 | seed=3004                         | [UC-001](../use_cases/UC-001-start-run.md)               |
| 7    | Verify tier             | The run in progress attempts tier 4                                    | -                                 | -                                                       |

## Validation

1. **One new tier**: Tier 5 is not unlocked after the flow.
2. **Pauses excluded**: When step 2 is repeated with a 60-second pause, the recorded play time is still 4:30.

## Postconditions

- The save holds tier clears for tiers 1, 2, and 3, with 4:30 as the best play time of tier 3.
- A run at tier 4 is in progress.
