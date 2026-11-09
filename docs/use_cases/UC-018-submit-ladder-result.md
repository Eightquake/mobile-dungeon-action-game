# Use Case: Submit Ladder Result

## Overview

**Use Case ID:** UC-018  
**Use Case Name:** Submit Ladder Result  
**Primary Actor:** Player  
**Secondary Actors:** Cloud Backend  
**Goal:** The player's best result on a tier appears on the leaderboard, so they can compare their skill with other players.  
**Trigger:** A run ends with a tier clear that is the first clear of the tier or faster than the best play time recorded before the run, while the online features are enabled (UC-005 A7).  
**Status:** Draft  

**Requirements:** [FR-027, NFR-022, NFR-025, NFR-026, C-022](../requirements.md)  
**Priority:** Low

## Preconditions

- The online features are enabled.

## Main Success Scenario

1. System takes the pending submission that UC-005 Finish Run A7 kept.
2. System sends the tier, the play time, the seed, the game version, and the input log of the run to the Cloud Backend in the background.
3. Cloud Backend stores the result as the player's entry for the tier.
4. System marks the result as submitted on the challenge ladder.

## Alternative Flows

### A1: No network connection

**Trigger:** The device has no network connection (step 2)  
**Flow:**

1. System keeps the result on the device and sends it at the next natural stopping point with a network connection.
2. Use case ends.

### A2: Cloud Backend refuses the result

**Trigger:** The Cloud Backend refuses the result because of a rate limit, a quota, or a failed check (step 3)  
**Flow:**

1. System keeps the result on the device as not submitted and shows the reason on the challenge ladder.
2. Use case ends.

## Postconditions

### Success Postconditions

- The leaderboard holds the player's best result for the tier.

### Failure Postconditions

- The tier clear on the device is unchanged, whatever the Cloud Backend answers.

## Business Rules

### BR-001: Never delays the summary

Submitting happens in the background and never delays the end-of-run summary (NFR-025).

### BR-002: Verifiable results

Every submitted result carries its seed, game version, and input log, so that it can be replayed for verification later (NFR-022).

### BR-003: Results stay

A leaderboard entry stays until the player improves it or deletes their cloud data. Leaderboards have no reset schedule and no time-limited rewards (C-022).

### BR-004: Checked, not verified

The Cloud Backend refuses a result with an unknown game version, a play time outside the allowed range, or an input log above the size limit. No replay confirms a result yet, so the leaderboard shows every entry as unverified.

### BR-005: One game version per result

A run played on two game versions (UC-004 A1) is never submitted, since it cannot be replayed.
