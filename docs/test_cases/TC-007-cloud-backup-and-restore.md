# Test Case: Cloud Backup and Restore

## Overview

**ID:** TC-007  
**Goal:** A player enables the online features, backs up their save, restores it on a second device after seeing the comparison, and then deletes all their cloud data — verifying the optional cloud save end to end.  
**Priority:** Low  
**Status:** Draft

## Roles

- Player (on device A and device B)

## Preconditions

- A test instance of the cloud backend runs with no data (test backend `cloud-test`).
- Device A holds a save with 3 codex powers and tier 4 cleared (test fixture `tests/fixtures/saves/v1-tier4.json`).
- Device B holds a new, empty save.
- The way the online identity reaches device B follows the identity ADR, still open (OQ-022).

## Flow

| Step | Name                  | Description                                                              | Test Data            | Use Case                                                  |
|------|-----------------------|--------------------------------------------------------------------------|----------------------|-----------------------------------------------------------|
| 1    | Enable on device A    | The player reads what leaves the device, picks a name, and agrees        | display name "Tester1" | [UC-017](../use_cases/UC-017-enable-online-features.md)  |
| 2    | Back up now           | The player backs up the save                                             | -                    | [UC-020](../use_cases/UC-020-back-up-save-to-cloud.md)     |
| 3    | Verify backup date    | The settings show today's date as the last cloud save                    | -                    | -                                                         |
| 4    | Restore on device B   | With the same online identity, the player restores and confirms          | -                    | [UC-021](../use_cases/UC-021-restore-save-from-cloud.md)   |
| 5    | Verify restored       | Device B shows 3 codex powers and tier 4 cleared                          | -                    | -                                                         |
| 6    | Delete cloud data     | On device B, the player deletes the cloud data and confirms              | -                    | [UC-022](../use_cases/UC-022-delete-cloud-data.md)         |

## Validation

1. **Nothing left**: The test backend holds no player, cloud save, or leaderboard entry for "Tester1".
2. **Local saves kept**: Both devices still hold 3 codex powers and tier 4 cleared.
3. **Online off**: Device B shows the online features as off.

## Postconditions

- The test backend is empty again; device B holds a restorable copy of its previous empty save.
