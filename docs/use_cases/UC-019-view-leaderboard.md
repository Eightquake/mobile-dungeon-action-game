# Use Case: View Leaderboard

## Overview

**Use Case ID:** UC-019  
**Use Case Name:** View Leaderboard  
**Primary Actor:** Player  
**Secondary Actors:** Cloud Backend  
**Goal:** The player sees how their ladder results compare with other players' results.  
**Trigger:** Player chooses the leaderboard on the challenge ladder.  
**Status:** Draft  

**Requirements:** [FR-028, NFR-012, NFR-025, C-022](../requirements.md)  
**Priority:** Low

## Preconditions

- No run is in progress.

## Main Success Scenario

1. Player chooses the leaderboard.
2. System asks the Cloud Backend for the leaderboard of the player's highest cleared tier, or of tier 1 when no tier is cleared.
3. Cloud Backend returns the best entries of that tier and the player's own entry.
4. System shows the entries with display name, tier, and play time, and highlights the player's own entry.
5. Player selects another tier.
6. System shows the leaderboard of the selected tier as steps 2 to 4 describe.

## Alternative Flows

### A1: Online features off

**Trigger:** The online features are not enabled (step 2)  
**Flow:**

1. System explains the leaderboard and offers to enable the online features, as UC-017 Enable Online Features describes.
2. Use case ends.

### A2: Cloud Backend unavailable

**Trigger:** The Cloud Backend does not answer or the device has no network connection (step 3)  
**Flow:**

1. System tells the player that the leaderboard is unavailable right now.
2. Use case ends.

## Postconditions

### Success Postconditions

- The player has seen the leaderboard of at least one tier.

### Failure Postconditions

- _None — the use case changes no data._

## Business Rules

### BR-001: No pressure

The leaderboard shows no countdown, season end, or reward for a rank (C-022).

### BR-002: Unverified marker

Until a verification approach is decided, the leaderboard says that its results are unverified.
