# Use Case: Start Run

## Overview

**Use Case ID:** UC-001  
**Use Case Name:** Start Run  
**Primary Actor:** Player  
**Goal:** The player starts a new run at a tier of the challenge ladder and controls the hero within seconds of launching the game.  
**Trigger:** Player chooses to play on the title screen, on the end-of-run summary, or on the challenge ladder.  
**Status:** Draft  

**Requirements:** [FR-001, FR-015, NFR-009, NFR-011, C-003, C-007, C-025](../requirements.md)  
**Priority:** High  
**Walking Skeleton:** Yes — main success scenario with the default tier and no codex powers (A2)

## Preconditions

- The game is launched and shows the title screen, the end-of-run summary, or the challenge ladder.

## Main Success Scenario

1. Player chooses to play.
2. System shows the challenge ladder tiers the player has unlocked, with the tier of the player's last run preselected (or the tier the player chose on the challenge ladder), and the codex powers the hero carries.
3. Player confirms the preselected tier.
4. System creates a new run for that tier with a new seed, gives the hero the starting items and the equipped codex powers, and places the hero at the entrance of the tier.
5. System shows the virtual stick, the skill buttons, and the pause button, and hands control of the hero to the player.

## Alternative Flows

### A1: Stored run exists

**Trigger:** The save holds a stored run, paused or left at its last checkpoint, when the player chooses to play (step 1)  
**Flow:**

1. System offers to resume the stored run or to abandon it.
2. Player chooses to resume.
3. System continues with UC-004 Resume Run.
4. Use case ends.

### A2: Only one tier unlocked

**Trigger:** The player has not cleared any tier yet (step 2)  
**Flow:**

1. System skips the tier choice and selects tier 1.
2. Use case continues at step 4.

### A3: Player chooses another tier

**Trigger:** Player selects another unlocked tier instead of the preselected one, for example a newly unlocked tier (step 3)  
**Flow:**

1. System marks the selected tier.
2. Player confirms the selected tier.
3. Use case continues at step 4.

### A4: Player changes codex powers

**Trigger:** Player chooses to change the equipped codex powers (step 3)  
**Flow:**

1. System continues with UC-008 Equip Codex Powers.
2. Use case continues at step 2.

### A5: Player abandons the stored run

**Trigger:** Player chooses to abandon the stored run (step 1)  
**Flow:**

1. System asks the player to confirm that the stored run ends without a tier clear.
2. Player confirms.
3. System continues with UC-005 Finish Run A2, which ends the stored run and shows its end-of-run summary.
4. Use case ends.

### A6: Player backs out

**Trigger:** Player leaves the tier choice without confirming (step 3)  
**Flow:**

1. System shows the screen the player came from.
2. Use case ends.

## Postconditions

### Success Postconditions

- A new run exists for the chosen tier, with its seed, the hero's starting items, and the equipped codex powers.
- The player controls the hero at the entrance of the tier.

### Failure Postconditions

- An existing stored run is never discarded without the player's confirmation.
- No run is created.

## Business Rules

### BR-001: One run at a time

The save holds at most one stored run. A new run starts only after the stored run was resumed and finished, or abandoned with the player's confirmation.

### BR-002: Unlocked tiers only

The player can start a run only at tier 1, at a cleared tier, or at the tier directly above the highest cleared tier.

### BR-003: Same start for every run

Every run of a tier starts with the same starting items. Only the equipped codex powers and the seed differ, so the challenge ladder tests build and skill, not time spent.

### BR-004: Two taps from the summary

From the end-of-run summary, starting the next run at the same tier with the same codex powers needs at most 2 taps (NFR-011).

### BR-005: No network in a run

Starting a run and playing it never waits for the network (C-003).
