# Use Case: Set Play Reminder

## Overview

**Use Case ID:** UC-016  
**Use Case Name:** Set Play Reminder  
**Primary Actor:** Player  
**Goal:** The player sets an optional reminder of how long they have played, so their sessions stay as long as they intend.  
**Trigger:** Player chooses the play reminder in the settings.  
**Status:** Draft  

**Requirements:** [FR-025, C-007, C-013](../requirements.md)  
**Priority:** Low

## Preconditions

- The game shows the settings.

## Main Success Scenario

1. Player chooses the play reminder.
2. System shows that the reminder is off and offers play times from 15 to 120 minutes in steps of 15 minutes.
3. Player turns the reminder on with a play time.
4. System stores the reminder on the device.
5. The player's session reaches the chosen play time during a run.
6. System shows the reminder with the session's play time on the next end-of-run summary.
7. Player dismisses the reminder with one tap.

## Alternative Flows

### A1: Player turns the reminder off

**Trigger:** Player turns off a reminder that is on (step 3)  
**Flow:**

1. System turns the reminder off and stores this on the device.
2. Use case ends.

### A2: Play time reached outside a run

**Trigger:** The session reaches the chosen play time on the title screen or in a menu outside a run, never the pause screen (step 5)  
**Flow:**

1. System shows the reminder on that screen without covering any control.
2. Use case continues at step 7.

## Postconditions

### Success Postconditions

- The reminder is stored with the chosen play time and shows once per session when the play time is reached.

### Failure Postconditions

- No other setting changes.

## Business Rules

### BR-001: Inform, never restrict

The reminder only informs. It never locks, pauses, ends, or slows down anything, never reduces rewards, and can be dismissed with one tap (C-013).

### BR-002: Never during combat

The reminder never shows during a run; a reminder due during a run waits for the end-of-run summary.

### BR-003: Opt-in only

The reminder is off until the player turns it on. The game never suggests a play time.

### BR-004: Session play time

A session's play time counts the time the game is shown, from the launch or from the return to the game after at least 30 minutes away. Time away never counts and never earns anything (C-007, C-010).

### BR-005: In-game only

The reminder is shown inside the game only and sends no notification while the game is closed.
