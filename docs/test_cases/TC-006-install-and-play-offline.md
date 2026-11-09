# Test Case: Install and Play Offline

## Overview

**ID:** TC-006  
**Goal:** A player opens the game from a link, installs it, and later launches and plays a run with the device in flight mode — verifying the offline promise from the first visit.  
**Priority:** Critical  
**Status:** Draft

## Roles

- Player (installs and plays offline)

## Preconditions

- The browser has never visited the game (test setup: new browser context with storage cleared).
- The game is served from the test host at `https://localhost:4173/`.

## Flow

| Step | Name                   | Description                                                                  | Test Data                 | Use Case                                              |
|------|------------------------|------------------------------------------------------------------------------|---------------------------|-------------------------------------------------------|
| 1    | Open link              | The player opens the link; the title screen and the install hint appear      | https://localhost:4173/   | [UC-012](../use_cases/UC-012-install-game.md)          |
| 2    | Verify offline ready   | All files for playing offline are stored, totalling at most 5 MB transferred | -                         | -                                                     |
| 3    | Go offline             | The network connection is cut                                                | context offline           | -                                                     |
| 4    | Launch offline         | The page is reloaded; the title screen appears from the stored files         | -                         | [UC-013](../use_cases/UC-013-launch-game-offline.md)   |
| 5    | Start run offline      | The player starts a run and plays for 30 seconds                             | seed=6006, stick right    | [UC-001](../use_cases/UC-001-start-run.md)             |
| 6    | Verify run plays       | The hero moves, and no network error is shown                                | -                         | -                                                     |

## Validation

1. **No network in a run**: From step 3 on, the game shows no network error and made no request that failed visibly.
2. **Persistent storage asked**: The game asked for persistent storage in step 1.
3. **Install path real device**: On the reference phone, adding to the home screen and launching from the icon in flight mode opens the game full screen (manual check, recorded in the acceptance protocol).

## Postconditions

- The browser context holds the stored game files and a save with a run in progress at tier 1.
