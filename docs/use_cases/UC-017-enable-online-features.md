# Use Case: Enable Online Features

## Overview

**Use Case ID:** UC-017  
**Use Case Name:** Enable Online Features  
**Primary Actor:** Player  
**Secondary Actors:** Cloud Backend  
**Goal:** The player opts in to the leaderboard and the cloud save, knowing exactly which data leaves the device.  
**Trigger:** Player chooses to enable the online features in the settings.  
**Status:** Draft  

**Requirements:** [FR-026, NFR-025, NFR-026, C-001, C-004, C-020](../requirements.md)  
**Priority:** Low

## Preconditions

- The device has a network connection.
- The online features are off.

## Main Success Scenario

1. Player chooses to enable the online features.
2. System explains which data leaves the device for each online feature — the display name, the ladder results with their input logs, and the cloud save — and that the player can delete it at any time.
3. Player chooses a display name and agrees.
4. System registers the player with the Cloud Backend under a random identity that contains no personal data.
5. Cloud Backend confirms the registration.
6. System stores the online identity on the device and shows the online features as enabled.

## Alternative Flows

### A1: Player declines

**Trigger:** Player declines instead of agreeing (step 3)  
**Flow:**

1. System keeps the online features off and sends nothing.
2. Use case ends.

### A2: Cloud Backend unavailable

**Trigger:** The Cloud Backend does not answer, refuses, or is out of quota (step 5)  
**Flow:**

1. System keeps the online features off and tells the player that they are unavailable right now.
2. Use case ends.

### A3: Display name not allowed

**Trigger:** The display name is empty or longer than 16 characters (step 3)  
**Flow:**

1. System asks for another display name.
2. Use case continues at step 3.

### A4: Display name refused

**Trigger:** The Cloud Backend refuses the display name (step 5)  
**Flow:**

1. System asks for another display name.
2. Use case continues at step 3.

## Postconditions

### Success Postconditions

- The online features are enabled, and the device holds the online identity.

### Failure Postconditions

- No data leaves the device without the player's agreement.
- Play works exactly as before.

## Business Rules

### BR-001: Opt-in

The online features are off until the player enables them; the game never enables them on its own and offers them only in the settings and on the leaderboard (C-004).

### BR-002: No personal data required

Enabling asks for no email address, no password, and no real name (C-020).

### BR-003: Online never blocks play

Every online feature is additive: a Cloud Backend that is down, slow, or out of quota never blocks or slows a run (NFR-025).

### BR-004: Free tier only

The Cloud Backend runs on a free tier that stops serving instead of billing when a quota is exceeded (C-001, C-004).
