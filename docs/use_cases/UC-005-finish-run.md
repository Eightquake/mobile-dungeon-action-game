# Use Case: Finish Run

## Overview

**Use Case ID:** UC-005  
**Use Case Name:** Finish Run  
**Primary Actor:** Player  
**Goal:** The player ends a run and sees a clear end-of-run summary of what they found, which legendaries they can sacrifice, and how far they climbed, at a natural place to stop.  
**Trigger:** The hero defeats the guardian of the tier, the hero dies, or the player abandons the run.  
**Status:** Draft  

**Requirements:** [FR-007, FR-010, FR-011, FR-012, FR-013, FR-016, FR-018, NFR-010, NFR-011, NFR-018, C-007, C-013, C-014](../requirements.md)  
**Priority:** High

## Preconditions

- A run is in progress or paused.

## Main Success Scenario

1. The hero defeats the guardian of the tier.
2. System stops the simulation of the run.
3. System records a tier clear for the tier with the run's play time and the codex powers the run started with, and unlocks the next tier when this is the first clear of the tier.
4. System keeps every found legendary whose legendary power is neither in the codex nor carried by a waiting legendary as a waiting legendary, at most one per legendary power (UC-007 BR-003), and salvages every other found item, equipped or not, since items belong to one run.
5. System updates the bad-luck protection: it resets the legendary drop chance when a legendary dropped in the run, and raises it otherwise; an abandoned run leaves it unchanged.
6. System stores the waiting legendaries, the ladder progress, and the bad-luck protection on the device and deletes the stored run.
7. System shows the end-of-run summary: the tier result, the play time, the items found, the new waiting legendaries with the choice to sacrifice them, and the highest tier cleared, with every new waiting legendary and a newly unlocked tier marked as new.
8. Player chooses to play the next run, to sacrifice a waiting legendary, to open the codex, to view the challenge ladder, or to go to the title screen.
9. System shows the screen the player chose, or continues with UC-001 Start Run, UC-007 Sacrifice Legendary, UC-008 Equip Codex Powers, or UC-009 View Challenge Ladder.

## Alternative Flows

### A1: Hero dies

**Trigger:** The hero's health reaches zero instead of the guardian being defeated (step 1)  
**Flow:**

1. System stops the simulation of the run.
2. System records no tier clear.
3. Use case continues at step 4.

### A2: Player abandons the run

**Trigger:** Player confirms to abandon the run on the pause screen or when choosing to play, or the stored run cannot be restored or carried over to a new game version (UC-004 A2, UC-014 A3) (step 1)  
**Flow:**

1. System stops the simulation of the run and records no tier clear.
2. Use case continues at step 4.

### A3: Update is ready

**Trigger:** A new version of the game was downloaded during the run (step 7)  
**Flow:**

1. System shows on the end-of-run summary that a new version is ready and takes effect when the player leaves the summary.
2. System continues with UC-014 Receive Update when the player leaves the summary.
3. Use case ends.

### A4: Play reminder is due

**Trigger:** The player set a play reminder and the chosen play time has passed (step 7)  
**Flow:**

1. System shows the play reminder on the end-of-run summary, as UC-016 Set Play Reminder describes.
2. Use case continues at step 8.

### A5: Storing the result fails

**Trigger:** The device refuses to store the result, for example because storage is full (step 6)  
**Flow:**

1. System keeps the result in memory and tells the player that the result could not be saved and how to free storage; the new waiting legendaries are shown but can be sacrificed only once the result is stored.
2. System retries storing when the player leaves the summary.
3. Use case continues at step 7.

### A6: Faster clear of a cleared tier

**Trigger:** The tier was cleared before (step 3)  
**Flow:**

1. System keeps the faster of the two play times as the tier's best result, with the codex powers of that run, and unlocks nothing new.
2. Use case continues at step 4.

### A7: New best with online features

**Trigger:** The online features are enabled and the tier clear is the first clear of the tier or faster than the best play time recorded before this run (step 6)  
**Flow:**

1. System keeps the tier, the play time, the seed, the game version, and the input log of the run as a pending submission before it deletes the stored run.
2. System continues with UC-018 Submit Ladder Result in the background.
3. Use case continues at step 7.

## Postconditions

### Success Postconditions

- The run is over and no longer stored on the device.
- When the guardian was defeated, the tier clear is recorded with its play time, and the tier above the highest cleared tier is unlocked.
- Every found item is salvaged or kept as a waiting legendary.
- The end-of-run summary is shown, and no new run has started without the player choosing it.

### Failure Postconditions

- No codex power, waiting legendary, tier clear, or setting that existed before the run is lost or changed for the worse.

## Business Rules

### BR-001: No auto-chaining

The next run starts only when the player chooses it. The end-of-run summary has no countdown, no automatic continue, and no prompt that pushes the player to play again (FR-012, C-013).

### BR-002: Death keeps the finds

A run that ends with the hero's death or an abandon keeps its new legendaries as waiting legendaries, like a run with a tier clear (UC-007 BR-003).

### BR-003: Equipped items do not carry over

Items the hero equipped during a run belong to that run only; the next run starts with the starting items again (UC-001 BR-003).

### BR-004: Bad-luck protection

The chance of a legendary drop rises by a step from tuning data after every run that ended with a tier clear or the hero's death without a legendary drop, up to a cap from tuning data, and returns to the base chance after a run with a legendary drop. An abandoned run does not count, so starting and abandoning runs never raises the chance (FR-018).

### BR-005: Summary is the update point

The end-of-run summary is a natural stopping point. A new version of the game takes effect only after the player leaves it (C-014).

### BR-006: Play time excludes pauses

The play time of a run counts only the time the simulation ran, never the time the run was paused.
