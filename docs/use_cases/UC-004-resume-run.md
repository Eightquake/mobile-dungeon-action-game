# Use Case: Resume Run

## Overview

**Use Case ID:** UC-004  
**Use Case Name:** Resume Run  
**Primary Actor:** Player  
**Goal:** The player continues a paused run exactly where they left it, also after the game was closed.  
**Trigger:** Player chooses to resume on the pause screen or on the title screen.  
**Status:** Approved  

**Requirements:** [FR-009, NFR-017, NFR-019, C-014, C-017](../requirements.md)  
**Priority:** High  
**Walking Skeleton:** Yes

## Preconditions

- The save holds a stored run.

## Main Success Scenario

1. Player chooses to resume.
2. System restores the run from the paused run: the hero, the enemies, the effects, the cooldowns, the items found, and the step of the simulation.
3. System shows the run as it was when it was paused, with the hero, the enemies, and the effects still.
4. Player touches the virtual stick or a skill button.
5. System continues the simulation from the restored step and hands control of the hero to the player.

## Alternative Flows

### A1: Stored run from an older game version

**Trigger:** The stored run was started by an older version of the game, before an update took effect (step 2)  
**Flow:**

1. System restores the run, which UC-014 Receive Update already migrated, and marks it as played on two game versions.
2. Use case continues at step 3.

### A2: Paused run cannot be restored

**Trigger:** The stored run is damaged (step 2)  
**Flow:**

1. System tells the player that the stored run could not be restored and why.
2. System keeps the stored run's data in a restorable copy of the save.
3. System continues with UC-005 Finish Run A2, which ends the run without a tier clear; new legendaries that can still be read from the stored run become waiting legendaries, and the rest stay in the restorable copy.
4. Use case ends.

### A3: Game closed after the last checkpoint

**Trigger:** The game was closed without a pause, after the last stored checkpoint (step 2)  
**Flow:**

1. System restores the run from the last stored checkpoint.
2. Use case continues at step 3.

## Postconditions

### Success Postconditions

- The run continues from the same state it had when it was paused or last stored.
- The paused run is no longer marked as paused.

### Failure Postconditions

- The codex and the ladder progress stay unchanged.
- A stored run is never discarded without the player being told, and its data stays in a restorable copy.

## Business Rules

### BR-001: Exact restore

A resumed run continues with the same seed, the same simulation step, and the same state as the paused run, so that the rest of the run plays out as if it had never been paused.

### BR-002: Player starts the clock

After the restore, no simulation step happens until the player touches the virtual stick or a skill button, so that an enemy never hits a hero the player is not yet controlling.

### BR-003: Stored runs survive updates

A stored run started by an older version of the game is migrated when the update takes effect (UC-014 step 7) and can be resumed and finished. Because it was played on two game versions, it cannot be replayed and is never submitted to the leaderboard (UC-018 BR-005) (C-014, C-017).
