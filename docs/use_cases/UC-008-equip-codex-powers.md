# Use Case: Equip Codex Powers

## Overview

**Use Case ID:** UC-008  
**Use Case Name:** Equip Codex Powers  
**Primary Actor:** Player  
**Goal:** The player chooses which codex powers the hero carries into the next run, to try out a build.  
**Trigger:** Player chooses to open the codex on the title screen, on the end-of-run summary, or on the tier choice of UC-001 Start Run.  
**Status:** Draft  

**Requirements:** [FR-014, NFR-011, NFR-013, NFR-018](../requirements.md)  
**Priority:** High

## Preconditions

- The game shows the title screen, the end-of-run summary, or the tier choice of UC-001 Start Run.

## Main Success Scenario

1. Player opens the codex.
2. System shows the codex slots with the codex power equipped in each, and the list of unlocked codex powers, each with the skill it changes and how.
3. Player selects a codex slot and a codex power for it.
4. System equips the codex power into the codex slot and stores the change on the device.
5. Player closes the codex.
6. System shows the screen the player came from, with the equipped codex powers.

## Alternative Flows

### A1: Codex is empty

**Trigger:** The player has not unlocked any codex power yet (step 2)  
**Flow:**

1. System shows the empty codex slots and explains that legendaries found in runs unlock codex powers.
2. Use case ends.

### A2: Codex power equipped in another slot

**Trigger:** The selected codex power is already equipped in another codex slot (step 3)  
**Flow:**

1. System moves the codex power to the selected codex slot and leaves the other codex slot empty.
2. Use case continues at step 5.

### A3: Player removes a codex power

**Trigger:** Player chooses to empty a codex slot (step 3)  
**Flow:**

1. System empties the codex slot and stores the change on the device.
2. Use case continues at step 5.

### A4: Paused run exists

**Trigger:** The save holds a paused run (step 4)  
**Flow:**

1. System equips the codex power for the next new run and tells the player that the paused run keeps the codex powers it started with.
2. Use case continues at step 5.

### A5: Storing fails

**Trigger:** The device refuses to store the change (step 4)  
**Flow:**

1. System keeps the change in memory, tells the player that it is not saved yet, and retries storing when the codex closes.
2. Use case continues at step 5.

## Postconditions

### Success Postconditions

- The chosen codex powers are equipped and stored on the device, and the next new run starts with them.

### Failure Postconditions

- The codex itself is unchanged: equipping never unlocks or removes a codex power.

## Business Rules

### BR-001: Fixed number of codex slots

The number of codex slots comes from tuning data and is the same for every player; it never grows with time played.

### BR-002: Each codex power once

A codex power is equipped in at most one codex slot at a time.

### BR-003: Runs keep their powers

A run keeps the codex powers it started with until it ends; changes apply to the next new run.

### BR-004: Choice, not power creep

A codex power changes how a skill behaves. The total power the codex adds is soft-capped as NFR-013 sets, so that more codex powers widen the choice of builds rather than outgrow the challenge ladder.
