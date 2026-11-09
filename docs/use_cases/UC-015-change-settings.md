# Use Case: Change Settings

## Overview

**Use Case ID:** UC-015  
**Use Case Name:** Change Settings  
**Primary Actor:** Player  
**Goal:** The player adapts the frame rate cap and the sound to their device and surroundings.  
**Trigger:** Player chooses settings on the title screen or the pause screen.  
**Status:** Draft  

**Requirements:** [FR-024, NFR-007, NFR-014, NFR-018](../requirements.md)  
**Priority:** Medium

## Preconditions

- The game shows the title screen or the pause screen.

## Main Success Scenario

1. Player opens the settings.
2. System shows the frame cap, the sound volume, and the music volume with their current values, and the entries to the save export, the save import, the play reminder, the install explanation, and the online features.
3. Player changes a value.
4. System applies the new value at once and stores it on the device.
5. Player closes the settings.
6. System shows the screen the player came from.

## Alternative Flows

### A1: Player resets to defaults

**Trigger:** Player chooses to reset the settings (step 3)  
**Flow:**

1. System sets the frame cap, the sound volume, and the music volume to their default values and stores them on the device.
2. Use case continues at step 5.

### A2: Storing fails

**Trigger:** The device refuses to store the new value (step 4)  
**Flow:**

1. System keeps the new value applied, tells the player that it is not saved yet, and retries storing when the settings close.
2. Use case continues at step 5.

## Postconditions

### Success Postconditions

- The changed settings apply and are stored on the device.

### Failure Postconditions

- Settings the player did not change keep their values.

## Business Rules

### BR-001: Frame cap choices

The frame cap offers the values that docs/Performance.md lists, with the default it sets for kindness to the device (NFR-014).

### BR-002: Settings never touch progress

No setting changes a run's rules, rewards, or the challenge ladder.

### BR-003: Pause screen settings

On the pause screen, the settings offer the frame cap, the volumes, and the save export only.
