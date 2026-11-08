# Use Case: Back Up Save to Cloud

## Overview

**Use Case ID:** UC-020  
**Use Case Name:** Back Up Save to Cloud  
**Primary Actor:** Player  
**Secondary Actors:** Cloud Backend  
**Goal:** The player keeps a copy of their save in the cloud, so their collection survives a lost phone.  
**Trigger:** Player chooses to back up now in the settings, or a run ends while the online features are enabled.  
**Status:** Draft  

**Requirements:** [FR-029, NFR-025, NFR-026, C-019](../requirements.md)  
**Priority:** Low

## Preconditions

- The online features are enabled.

## Main Success Scenario

1. Player chooses to back up now.
2. System sends a copy of the save, with its save format version, to the Cloud Backend in the background.
3. Cloud Backend checks that the cloud save it holds is not newer than the save on the device, and stores the copy as the player's cloud save.
4. System shows the date of the last cloud save.

## Alternative Flows

### A1: Run ended

**Trigger:** A run ended instead of the player choosing to back up (step 1)  
**Flow:**

1. Use case continues at step 2.

### A2: No network connection

**Trigger:** The device has no network connection (step 2)  
**Flow:**

1. System keeps the save on the device only and tries again at the next natural stopping point with a network connection.
2. Use case ends.

### A3: Cloud save from another device is newer

**Trigger:** The cloud save was stored by another device after this device's last backup (step 3)  
**Flow:**

1. System shows both saves side by side: the number of codex powers, the highest cleared tier, and the date of each.
2. Player chooses to replace the cloud save with this device's save, or to restore the cloud save as UC-021 Restore Save from Cloud describes.
3. System stores this device's save as the cloud save when the player chose to replace it.
4. Use case ends.

### A4: Cloud Backend refuses

**Trigger:** The Cloud Backend refuses the copy because of a rate limit or a quota (step 3)  
**Flow:**

1. System keeps the save on the device only and shows that the cloud save is out of date and why.
2. Use case ends.

## Postconditions

### Success Postconditions

- The Cloud Backend holds a copy of the save as of the backup.

### Failure Postconditions

- The save on the device is never changed by a backup.
- A newer cloud save is never overwritten without the player's choice.

## Business Rules

### BR-001: Device is the source of truth

The cloud save is a backup of the save on the device. A backup never changes the save on the device (C-019).

### BR-002: Visible conflicts

When two devices have stored different saves, the player sees both and decides; nothing is overwritten silently (C-019).

### BR-003: Background only

Backing up never delays the end-of-run summary or a run start (NFR-025).
