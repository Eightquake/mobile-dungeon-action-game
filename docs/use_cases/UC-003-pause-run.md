# Use Case: Pause Run

## Overview

**Use Case ID:** UC-003  
**Use Case Name:** Pause Run  
**Primary Actor:** Player  
**Goal:** The player stops the run at any moment and can leave the game without losing anything.  
**Trigger:** Player presses the pause button, or the game is hidden because the player switches apps, locks the phone, or receives a call, or the browser takes away the game's graphics.  
**Status:** Draft  

**Requirements:** [FR-008, NFR-015, NFR-017, C-007, C-013, C-016](../requirements.md)  
**Priority:** High  
**Walking Skeleton:** Yes

## Preconditions

- A run is in progress.

## Main Success Scenario

1. Player presses the pause button.
2. System stops the simulation of the run in the current step, stops the sounds of the run, and stops rendering new game frames.
3. System stores the run state on the device as a paused run.
4. System shows the pause screen with the options to resume, to see the items found in the run, to change settings, and to abandon the run.

## Alternative Flows

### A1: Game is hidden

**Trigger:** The game is hidden, or the browser takes away the game's graphics, instead of the player pressing pause (step 1)  
**Flow:**

1. System stops the simulation, the sounds, and the rendering within 1 second.
2. System stores the run state on the device as a paused run.
3. System schedules no frames and no timers while the game stays hidden.
4. Use case continues at step 4 when the game is shown again and its graphics are restored.

### A2: Player abandons the run

**Trigger:** Player chooses to abandon the run on the pause screen (step 4)  
**Flow:**

1. System asks the player to confirm that the run ends without a tier clear.
2. Player confirms.
3. System continues with UC-005 Finish Run.
4. Use case ends.

### A3: Player opens the found items

**Trigger:** Player chooses to see the items found in the run (step 4)  
**Flow:**

1. System continues with UC-006 Equip Item.
2. Use case continues at step 4.

### A4: Player changes settings

**Trigger:** Player chooses settings on the pause screen (step 4)  
**Flow:**

1. System continues with UC-015 Change Settings.
2. Use case continues at step 4.

### A5: Storing the paused run fails

**Trigger:** The device refuses to store the run state, for example because storage is full, also while the game is hidden (step 3)  
**Flow:**

1. System keeps the run paused in memory and keeps the last stored state of the run.
2. System tells the player that the pause could not be saved and that closing the game now loses the run's progress since the last stored state.
3. Use case continues at step 4.

## Postconditions

### Success Postconditions

- The run is paused: no simulation step, sound, or frame of the run happens until the player resumes it.
- The paused run is stored on the device and survives closing the game.

### Failure Postconditions

- The codex, the ladder progress, and the last stored state of the run stay unchanged on the device.

## Business Rules

### BR-001: Pause at any moment

The player can pause in every step of a run, also in the middle of an attack or a skill.

### BR-002: Nothing runs while paused

While a run is paused, no game time passes: enemies, cooldowns, and effects stay where they were (C-007).

### BR-003: No penalty for pausing

Pausing, and the time a run stays paused, never changes the outcome of the run, its rewards, or its tier clear record (C-013).

### BR-004: Regular checkpoints

While a run is in progress, the system also stores its state at most 10 seconds of play apart, so that a killed game loses at most 10 seconds of play (NFR-017).
