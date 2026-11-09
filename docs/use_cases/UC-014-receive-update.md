# Use Case: Receive Update

## Overview

**Use Case ID:** UC-014  
**Use Case Name:** Receive Update  
**Primary Actor:** Player  
**Secondary Actors:** Browser  
**Goal:** The player gets the new version of the game at a natural stopping point, without a run being interrupted or broken.  
**Trigger:** The Browser finds a new version of the game while the game runs or launches with a network connection.  
**Status:** Draft  

**Requirements:** [FR-023, NFR-018, NFR-019, C-014, C-015, C-017](../requirements.md)  
**Priority:** High

## Preconditions

- The game is installed or was loaded completely at least once on this device.

## Main Success Scenario

1. Browser finds a new version of the game.
2. System downloads the new version in the background and keeps the current version running unchanged.
3. Player plays on until the end-of-run summary of the current run, as UC-005 Finish Run describes.
4. System shows on the end-of-run summary that a new version is ready.
5. Player leaves the end-of-run summary.
6. System activates the new version and restarts the game on the screen the player chose.
7. System migrates the save, including a stored run, to the new save format version, if it changed.
8. System shows, once, what changed in the new version.

## Alternative Flows

### A1: Game closed before a stopping point

**Trigger:** The game is closed before the run ends (step 3)  
**Flow:**

1. System activates the new version at the next launch of the game, before the title screen appears.
2. Use case continues at step 7.

### A2: No run in progress

**Trigger:** The new version is ready while the player is on the title screen or in a menu (step 3)  
**Flow:**

1. System shows that a new version is ready and takes effect at the next end-of-run summary or the next launch.
2. Use case continues at step 3.

### A3: Paused run cannot be migrated

**Trigger:** The stored run in the save cannot be migrated to the new save format version (step 7)  
**Flow:**

1. System migrates the codex, the waiting legendaries, the ladder progress, and the settings, and keeps the stored run's data in a restorable copy of the save.
2. System tells the player that the paused run could not be carried over and ends it without a tier clear, as UC-005 Finish Run A2 describes; new legendaries that can still be read from the stored run become waiting legendaries, and the rest stay in the restorable copy.
3. Use case continues at step 8.

### A4: Save migration fails

**Trigger:** The save cannot be migrated at all (step 7)  
**Flow:**

1. System keeps the unmigrated save unchanged as a restorable copy, tells the player what happened, and offers a save export of it as UC-010 Export Save describes.
2. System lets the player play on the new version with a new save; the unmigrated save stays restorable once a later version can migrate it.
3. Use case ends.

### A5: Download breaks

**Trigger:** The network connection breaks during the download (step 2)  
**Flow:**

1. System keeps the current version and retries the download at the next launch with a network connection.
2. Use case ends.

## Postconditions

### Success Postconditions

- The new version runs, and the save is in its save format version, with every codex power, waiting legendary, tier clear, and setting it had before.

### Failure Postconditions

- No run is ever interrupted by an update.
- No codex power, waiting legendary, tier clear, or setting is lost; a save that cannot be migrated stays on the device unchanged.

## Business Rules

### BR-001: Never mid-run

A new version takes effect only at the end-of-run summary or at a launch, never during a run and never while a run is paused in memory (C-014).

### BR-002: Every format change migrates

Every change of the save format ships with a migration from the previous save format version and an automated test of it (C-017, NFR-019).

### BR-003: Never silently lost

When anything of a save cannot be carried over, the player is told what and why (NFR-018).

### BR-004: Files only in the update path

Downloading and activating a version only replaces files; it never contains game rules (C-015).
