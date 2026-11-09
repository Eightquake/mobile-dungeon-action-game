# Test Case: Move Save to New Device

## Overview

**ID:** TC-004  
**Goal:** A player exports their save on one device, imports it on a new device after a failed attempt with a broken code, and finds every codex power and tier clear there — verifying that players can always take their save with them.  
**Priority:** Critical  
**Status:** Draft

## Roles

- Player (exports on device A, imports on device B)

## Preconditions

- Device A (browser context A) holds a save with 5 codex powers, tier 7 cleared, and a paused run at tier 8 (test fixture `tests/fixtures/saves/v1-tier7-paused.json`).
- Device B (browser context B) has a new, empty save.
- Both contexts have no network connection after the game files are stored.

## Flow

| Step | Name                   | Description                                                                  | Test Data                       | Use Case                                       |
|------|------------------------|------------------------------------------------------------------------------|---------------------------------|------------------------------------------------|
| 1    | Export on device A     | The player exports the save and copies the code                              | -                               | [UC-010](../use_cases/UC-010-export-save.md)    |
| 2    | Import broken code     | On device B, the player pastes the code with its last 10 characters removed  | code minus last 10 characters   | [UC-011](../use_cases/UC-011-import-save.md)    |
| 3    | Verify refused         | An error says the code cannot be read; device B's save is unchanged          | -                               | -                                              |
| 4    | Paste valid code       | On device B, the player pastes the full code                                 | full code from step 1           | [UC-011](../use_cases/UC-011-import-save.md)    |
| 5    | Verify comparison      | The comparison shows 5 codex powers and tier 7 for the export, 0 and none for the current save | -             | -                                              |
| 6    | Confirm import         | The player confirms; the title screen shows the imported progress            | -                               | [UC-011](../use_cases/UC-011-import-save.md)    |
| 7    | Open codex             | On the title screen, the player opens the codex; it lists 5 codex powers      | -                               | [UC-008](../use_cases/UC-008-equip-codex-powers.md) |
| 8    | Resume moved run       | The title screen offers the paused run at tier 8; the player resumes          | -                               | [UC-004](../use_cases/UC-004-resume-run.md)     |
| 9    | Verify run             | The run in progress attempts tier 8                                           | -                               | -                                              |

## Validation

1. **Offline**: No step made a network request.
2. **Same progress**: Device B's save equals device A's save, except for the dates of the export.
3. **One step back**: Device B keeps the save it had before the import as a restorable copy.

## Postconditions

- Device B holds the imported save and a restorable copy of its previous empty save.
- Device A's save is unchanged.
