# Use Case: View Challenge Ladder

## Overview

**Use Case ID:** UC-009  
**Use Case Name:** View Challenge Ladder  
**Primary Actor:** Player  
**Goal:** The player sees how far they have climbed the challenge ladder and what the next tier asks of them.  
**Trigger:** Player chooses to view the challenge ladder on the title screen or on the end-of-run summary.  
**Status:** Draft  

**Requirements:** [FR-017, NFR-012](../requirements.md)  
**Priority:** Medium

## Preconditions

- No run is in progress.

## Main Success Scenario

1. Player chooses to view the challenge ladder.
2. System shows the tiers from tier 1 up to the lowest tier not yet unlocked, with the highest cleared tier marked.
3. System shows, for every cleared tier, its best play time and the codex powers equipped in that run.
4. Player selects a tier.
5. System shows the tier's enemy strength relative to tier 1 and whether the player can start a run at it.

## Alternative Flows

### A1: No tier cleared yet

**Trigger:** The player has not cleared any tier (step 2)  
**Flow:**

1. System shows tier 1 as unlocked and explains that clearing a tier unlocks the next.
2. Use case ends.

### A2: Player starts a run from the ladder

**Trigger:** Player chooses to play the selected unlocked tier (step 5)  
**Flow:**

1. System continues with UC-001 Start Run with the selected tier preselected.
2. Use case ends.

## Postconditions

### Success Postconditions

- The player has seen the highest cleared tier and the best result of every cleared tier.

### Failure Postconditions

- _None — the use case changes no data._

## Business Rules

### BR-001: Earned and legible

The challenge ladder shows only results the player earned in runs: tier clears and play times. It shows no time played in total and no progress that grows by playing longer.

### BR-002: Readable strength

The strength of a tier is shown as a number with at most 4 significant digits (NFR-012).
