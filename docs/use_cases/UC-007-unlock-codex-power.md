# Use Case: Unlock Codex Power

## Overview

**Use Case ID:** UC-007  
**Use Case Name:** Unlock Codex Power  
**Primary Actor:** Player  
**Goal:** The player adds the legendary power of a newly found legendary to the codex for good, so that no drop is wasted.  
**Trigger:** The hero collects a legendary during a run.  
**Status:** Draft  

**Requirements:** [FR-013, NFR-018, C-016](../requirements.md)  
**Priority:** High

## Preconditions

- A run is in progress.

## Main Success Scenario

1. The hero collects a legendary.
2. System checks whether the codex already holds the legendary power of the legendary.
3. System adds the legendary power to the codex as a codex power and stores the codex on the device.
4. System shows a short notice with the name of the new codex power, without pausing the run and without covering the hero or the skill buttons.

## Alternative Flows

### A1: Codex power already unlocked

**Trigger:** The codex already holds the legendary power (step 2)  
**Flow:**

1. System leaves the codex unchanged and lists the legendary among the found items of the run.
2. Use case ends.

### A2: Storing the codex fails

**Trigger:** The device refuses to store the codex, for example because storage is full (step 3)  
**Flow:**

1. System keeps the new codex power in memory and retries storing it at the next pause and at the end of the run.
2. Use case continues at step 4.

## Postconditions

### Success Postconditions

- The codex holds the new codex power, stored on the device.
- The legendary is listed among the found items of the run and can be equipped as UC-006 Equip Item describes.

### Failure Postconditions

- No codex power that was unlocked before is removed or changed.

## Business Rules

### BR-001: Unlocks are permanent

A codex power, once unlocked, stays in the codex forever. No action of the game removes it; only an import or a cloud restore that the player confirms replaces the codex as a whole.

### BR-002: Unlocks need no action

Unlocking happens automatically when the hero collects the legendary, without a menu or a tap.

### BR-003: Unlocks count even in a lost run

A codex power stays unlocked when the run later ends with the hero's death or an abandon.
