# Test Case: Update Waits for Summary

## Overview

**ID:** TC-005  
**Goal:** A new version is published while a player is in a run and while a run is paused across a relaunch; it takes effect only at the end-of-run summary or the launch, and the paused run survives the save format change — verifying that nothing interrupts a run.  
**Priority:** High  
**Status:** Draft

## Roles

- Player (plays through an update)

## Preconditions

- The test host serves version `1.0.0` with save format version 1, and can switch to version `1.1.0` with save format version 2 (test builds `test-v1` and `test-v2`).
- The save holds tier 2 cleared (test fixture `tests/fixtures/saves/v1-tier2.json`).

## Flow

| Step | Name                        | Description                                                                 | Test Data            | Use Case                                          |
|------|-----------------------------|-----------------------------------------------------------------------------|----------------------|---------------------------------------------------|
| 1    | Start run on 1.0.0          | The player starts a run at tier 3                                           | seed=5005            | [UC-001](../use_cases/UC-001-start-run.md)         |
| 2    | Publish 1.1.0               | The test host switches to version 1.1.0; the browser finds it               | test-v2              | [UC-014](../use_cases/UC-014-receive-update.md)    |
| 3    | Verify no interruption      | The run continues on 1.0.0 for 60 seconds of play without a reload          | stick and skill 1    | -                                                 |
| 4    | Pause and close             | The player pauses and closes the page                                       | -                    | [UC-003](../use_cases/UC-003-pause-run.md)         |
| 5    | Relaunch                    | The page opens on version 1.1.0 and migrates the save to format version 2   | -                    | [UC-014](../use_cases/UC-014-receive-update.md)    |
| 6    | Resume migrated run         | The player resumes the paused run                                           | -                    | [UC-004](../use_cases/UC-004-resume-run.md)        |
| 7    | Finish run                  | The player abandons the run and confirms                                    | -                    | [UC-005](../use_cases/UC-005-finish-run.md)        |
| 8    | Verify summary              | The summary shows no "new version ready" notice, as 1.1.0 already runs      | -                    | -                                                 |

## Validation

1. **No mid-run activation**: The game version reported in step 3 is 1.0.0.
2. **Run survived**: The run resumed in step 6 has the seed 5005 and the simulation step stored in step 4.
3. **Progress kept**: After step 7, tier 2 is still cleared and the save's format version is 2.

## Postconditions

- The game runs version 1.1.0, and the save is in save format version 2 with tiers 1 and 2 cleared and no stored run.
