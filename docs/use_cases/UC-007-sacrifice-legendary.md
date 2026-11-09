# Use Case: Sacrifice Legendary

## Overview

**Use Case ID:** UC-007  
**Use Case Name:** Sacrifice Legendary  
**Primary Actor:** Player  
**Goal:** The player sacrifices a waiting legendary to add its legendary power to the codex for good, so that no drop is wasted.  
**Trigger:** Player opens the waiting legendaries on the end-of-run summary or in the codex.  
**Status:** Draft  

**Requirements:** [FR-013, NFR-011, NFR-018, C-007, C-016](../requirements.md)  
**Priority:** High

## Preconditions

- The save holds at least one waiting legendary.
- The game shows the end-of-run summary or the codex.

## Main Success Scenario

1. System shows the waiting legendaries, each with its legendary power, the skill it changes, and how.
2. Player chooses to sacrifice one waiting legendary.
3. System removes the waiting legendary, adds its legendary power to the codex as a codex power, and stores both changes on the device together.
4. System shows the new codex power, marked as new, and offers to equip it as UC-008 Equip Codex Powers describes.
5. Player continues on the screen they came from.

## Alternative Flows

### A1: Sacrifice all

**Trigger:** Player chooses to sacrifice every waiting legendary at once (step 2)  
**Flow:**

1. System removes every waiting legendary, adds each legendary power to the codex, and stores the changes on the device together.
2. Use case continues at step 4 with every new codex power shown.

### A2: Player leaves without sacrificing

**Trigger:** Player leaves the end-of-run summary or closes the codex without choosing a sacrifice (step 2)  
**Flow:**

1. System keeps every waiting legendary in the save, unchanged.
2. Use case ends.

### A3: Storing fails

**Trigger:** The device refuses to store the changes, for example because storage is full (step 3)  
**Flow:**

1. System keeps the waiting legendary and the codex as they were stored and tells the player that the sacrifice could not be saved and how to free storage.
2. Use case continues at step 1.

### A4: Paused run exists

**Trigger:** The save holds a paused run (step 3)  
**Flow:**

1. System adds the codex power for the next new run and tells the player that the paused run keeps the codex powers it started with.
2. Use case continues at step 4.

## Postconditions

### Success Postconditions

- The codex holds every new codex power, stored on the device.
- Every sacrificed legendary no longer exists.

### Failure Postconditions

- No codex power that was unlocked before is removed or changed, and no waiting legendary is lost without its codex power being stored.

## Business Rules

### BR-001: Unlocks are permanent

A codex power, once unlocked, stays in the codex forever. No action of the game removes it; only an import or a cloud restore that the player confirms replaces the codex as a whole.

### BR-002: Sacrifice is the only way into the codex

A legendary power enters the codex only when the player sacrifices a legendary that carries it. Collecting a legendary in a run does not unlock its power (FR-013).

### BR-003: Which legendaries wait

When a run ends, by a tier clear, the hero's death, or an abandon, every legendary found in it whose legendary power is neither in the codex nor carried by a waiting legendary becomes a waiting legendary, at most one per legendary power. Every other item is salvaged, as UC-005 Finish Run describes.

### BR-004: Waiting legendaries never expire

A waiting legendary stays in the save until the player sacrifices it. It never expires, is never salvaged, and the game never reminds the player of it outside the end-of-run summary and the codex (C-007).

### BR-005: Sacrifice is final

A sacrificed legendary is destroyed and cannot be restored; its legendary power stays in the codex as BR-001 says.
