# Use Case: Launch Game Offline

## Overview

**Use Case ID:** UC-013  
**Use Case Name:** Launch Game Offline  
**Primary Actor:** Player  
**Goal:** The player launches the game and plays without any network connection, for example on a bus.  
**Trigger:** Player launches the game from the home screen icon or a bookmarked link while the device has no network connection.  
**Status:** Approved  

**Requirements:** [FR-022, NFR-009, NFR-021, NFR-024, NFR-025, C-003, C-015](../requirements.md)  
**Priority:** High  
**Walking Skeleton:** Yes

## Preconditions

- The game was loaded completely at least once on this device, as UC-012 Install Game describes.

## Main Success Scenario

1. Player launches the game.
2. System loads the game from the files stored on the device.
3. System reads the save from the device.
4. System shows the title screen with the option to play and, when the save holds a stored run, the option to resume it.
5. Player chooses to play.
6. System continues with UC-001 Start Run.

## Alternative Flows

### A1: Stored run exists

**Trigger:** Player chooses to resume the stored run (step 5)  
**Flow:**

1. System continues with UC-004 Resume Run.
2. Use case ends.

### A2: Online features enabled

**Trigger:** The player enabled the online features (step 4)  
**Flow:**

1. System marks the leaderboard and the cloud save as unavailable until a network connection returns, and shows everything else as usual.
2. Use case continues at step 5.

### A3: Files incomplete

**Trigger:** The files for playing offline were never stored completely (step 2)  
**Flow:**

1. The device shows that it is offline, outside the game.
2. Use case ends.

### A4: Portrait orientation

**Trigger:** The phone is held in portrait orientation (step 4)  
**Flow:**

1. System shows a prompt to rotate the phone to landscape.
2. Player rotates the phone.
3. Use case continues at step 4.

### A5: Save missing or damaged

**Trigger:** The device holds no readable save although the game was played before, for example because the browser cleared the storage or the save is damaged (step 3)  
**Flow:**

1. System keeps any damaged save data unchanged as a restorable copy and never overwrites it.
2. System tells the player what happened and offers to import a save export, as UC-011 Import Save describes, or to start with a new save.
3. Player chooses to start with a new save.
4. Use case continues at step 4.

### A6: Player imports a save export

**Trigger:** The device holds no readable save and the player chooses to import a save export instead of starting with a new save (step 3)  
**Flow:**

1. System keeps any damaged save data unchanged as a restorable copy and never overwrites it.
2. System continues with UC-011 Import Save.
3. Use case continues at step 4.

## Postconditions

### Success Postconditions

- The game runs from the device alone, with every use case available except the online features.

### Failure Postconditions

- The save on the device is unchanged by a failed launch.

## Business Rules

### BR-001: Offline is the default

Launching and every use case except the online features work in flight mode, with the same thresholds as online (NFR-021, C-003).

### BR-002: No network wait

The title screen never waits for a network answer before it lets the player start or resume a run (NFR-009, NFR-025).
