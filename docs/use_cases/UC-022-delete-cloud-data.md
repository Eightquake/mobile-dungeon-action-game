# Use Case: Delete Cloud Data

## Overview

**Use Case ID:** UC-022  
**Use Case Name:** Delete Cloud Data  
**Primary Actor:** Player  
**Secondary Actors:** Cloud Backend  
**Goal:** The player removes everything the Cloud Backend holds about them and turns the online features off.  
**Trigger:** Player chooses to delete their cloud data in the settings.  
**Status:** Draft  

**Requirements:** [FR-031, C-020, C-021](../requirements.md)  
**Priority:** Low

## Preconditions

- The online features are enabled.

## Main Success Scenario

1. Player chooses to delete their cloud data.
2. System explains that the leaderboard entries, the cloud save, and the online identity will be deleted, and that the save on the device stays.
3. Player confirms.
4. System asks the Cloud Backend to delete all data of the player.
5. Cloud Backend deletes the player's leaderboard entries, cloud save, and online identity, and confirms.
6. System removes the online identity and every pending submission from the device, turns the online features off, and confirms the deletion to the player.

## Alternative Flows

### A1: Player cancels

**Trigger:** Player declines to confirm (step 3)  
**Flow:**

1. System keeps everything unchanged.
2. Use case ends.

### A2: Cloud Backend unavailable

**Trigger:** The Cloud Backend does not answer or the device has no network connection (step 5)  
**Flow:**

1. System tells the player that nothing was deleted yet and keeps the online features enabled, so the player can try again.
2. Use case ends.

## Postconditions

### Success Postconditions

- The Cloud Backend holds no data of the player.
- The online features are off on this device.

### Failure Postconditions

- The save on the device is never changed by a deletion.
- The online identity stays on the device until the Cloud Backend confirmed the deletion.

## Business Rules

### BR-001: Complete erasure

A deletion removes every record of the player in the Cloud Backend: leaderboard entries, cloud save, and online identity (C-021).

### BR-002: Local save untouched

Deleting cloud data never changes the save on the device.
