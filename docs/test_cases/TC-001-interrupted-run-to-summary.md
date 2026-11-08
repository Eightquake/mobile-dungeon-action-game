# Test Case: Interrupted Run to Summary

## Overview

**ID:** TC-001  
**Goal:** A player starts a run, fights, is interrupted, closes the game, resumes the paused run after relaunching, and finishes it with an end-of-run summary — verifying that an interruption costs nothing.  
**Priority:** Critical  
**Status:** Draft

## Roles

- Player (plays, pauses, closes, relaunches, and finishes the run)

## Preconditions

- The game was loaded completely once in the test browser (test setup: visit and wait for the offline files to be stored).
- The save is new: no tier cleared, no codex power, no paused run (test setup: empty IndexedDB).
- The run seed is fixed by the test build's seed override (test data `seed=1001`).

## Flow

| Step | Name                  | Description                                                                 | Test Data                         | Use Case                                         |
|------|-----------------------|-----------------------------------------------------------------------------|-----------------------------------|--------------------------------------------------|
| 1    | Start run             | The player chooses to play; tier 1 starts without a tier choice             | seed=1001                         | [UC-001](../use_cases/UC-001-start-run.md)        |
| 2    | Verify hero control   | The virtual stick, 4 skill buttons, and the pause button are shown          | -                                 | -                                                |
| 3    | Clear first pack      | The player moves right and uses skill 1 until the first pack is defeated    | stick right 2 s, skill 1 ×10      | [UC-002](../use_cases/UC-002-clear-pack.md)       |
| 4    | Pause by hiding       | The game is hidden as if the phone were locked                              | visibility hidden                 | [UC-003](../use_cases/UC-003-pause-run.md)        |
| 5    | Verify nothing runs   | While hidden, the simulation step and the play time do not change           | wait 5 s                          | -                                                |
| 6    | Close and relaunch    | The page is closed and opened again                                         | -                                 | -                                                |
| 7    | Resume run            | The title screen offers to resume; the player resumes and touches the stick | -                                 | [UC-004](../use_cases/UC-004-resume-run.md)       |
| 8    | Verify restored state | The hero's position, health, and the simulation step equal those of step 4  | -                                 | -                                                |
| 9    | Abandon run           | The player pauses and abandons the run, and confirms                        | -                                 | [UC-005](../use_cases/UC-005-finish-run.md)       |
| 10   | Verify summary        | The end-of-run summary shows tier 1 not cleared and the items found         | -                                 | -                                                |

## Validation

1. **No progress lost**: The state restored in step 8 equals the state stored in step 4, step for step.
2. **No auto-chaining**: 30 seconds after step 10, the end-of-run summary is still shown and no new run has started.
3. **No stored run**: After step 10, the title screen offers no run to resume.

## Postconditions

- The save holds no run and no tier clear; the items found in the run are salvaged.
