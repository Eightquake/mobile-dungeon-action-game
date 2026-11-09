# Use Case: Restore Save from Cloud

## Overview

**Use Case ID:** UC-021  
**Use Case Name:** Restore Save from Cloud  
**Primary Actor:** Player  
**Secondary Actors:** Cloud Backend  
**Goal:** The player brings their cloud save onto this device, after seeing what it replaces.  
**Trigger:** Player chooses to restore the cloud save in the settings.  
**Status:** Draft  

**Requirements:** [FR-030, NFR-018, NFR-020, C-017, C-019](../requirements.md)  
**Priority:** Low

## Preconditions

- The online features are enabled on this device with the online identity that stored the cloud save.
- The game shows the title screen.

## Main Success Scenario

1. Player chooses to restore the cloud save.
2. System asks the Cloud Backend for the cloud save.
3. Cloud Backend returns the cloud save.
4. System checks the cloud save as UC-011 Import Save checks a save export.
5. System shows the cloud save next to the save on the device: the number of codex powers, the number of waiting legendaries, the highest cleared tier, and the date of each.
6. Player confirms to replace the save on the device.
7. System keeps the save on the device as a restorable copy, migrates the cloud save to the current save format version, and stores it as the save.
8. System shows the title screen with the restored progress.

## Alternative Flows

### A1: No cloud save

**Trigger:** The Cloud Backend holds no cloud save for the player (step 3)  
**Flow:**

1. System tells the player that there is no cloud save yet.
2. Use case ends.

### A2: Cloud Backend unavailable

**Trigger:** The Cloud Backend does not answer or the device has no network connection (step 3)  
**Flow:**

1. System tells the player that the cloud save is unavailable right now and that the save on the device is unchanged.
2. Use case ends.

### A3: Cloud save invalid

**Trigger:** The cloud save is damaged or of a newer save format version than the game knows (step 4)  
**Flow:**

1. System tells the player why the cloud save cannot be restored and that the save on the device is unchanged.
2. Use case ends.

### A4: Player cancels

**Trigger:** Player declines to replace the save on the device (step 6)  
**Flow:**

1. System keeps the save on the device.
2. Use case ends.

## Postconditions

### Success Postconditions

- The save on the device holds the restored progress in the current save format version.
- The previous save on the device is kept as a restorable copy.

### Failure Postconditions

- The save on the device is unchanged when the restore does not complete.

## Business Rules

### BR-001: Confirmed replace only

A restore replaces the save on the device only after the player has seen both saves and confirmed (C-019, NFR-018).

### BR-002: Same checks as an import

A cloud save is untrusted input and passes the same checks as a save export (UC-011 BR-001).
