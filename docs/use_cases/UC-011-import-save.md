# Use Case: Import Save

## Overview

**Use Case ID:** UC-011  
**Use Case Name:** Import Save  
**Primary Actor:** Player  
**Goal:** The player restores their progress from a save export, without ever risking the save they have now.  
**Trigger:** Player chooses to import a save in the settings.  
**Status:** Draft  

**Requirements:** [FR-020, NFR-018, NFR-020, C-003, C-017](../requirements.md)  
**Priority:** High

## Preconditions

- The game shows the title screen.

## Main Success Scenario

1. Player chooses to import a save.
2. System asks for a save export as a file or as a pasted code.
3. Player selects a file.
4. System checks that the save export is complete and well-formed, that every value lies within the ranges of the entity model and names existing content, and that its save format version is one the game can read.
5. System shows the save export next to the current save: the number of codex powers and the highest cleared tier of each, and the export date of the save export.
6. Player confirms to replace the current save.
7. System keeps the current save as a restorable copy, migrates the save export to the current save format version, and stores it as the save.
8. System shows the title screen with the imported progress.

## Alternative Flows

### A1: Player pastes a code

**Trigger:** Player pastes a code instead of selecting a file (step 3)  
**Flow:**

1. System reads the save export from the code.
2. Use case continues at step 4.

### A2: Save export is invalid

**Trigger:** The save export is damaged, incomplete, holds values outside the allowed ranges, or is not a save export (step 4)  
**Flow:**

1. System tells the player that the save export cannot be read and that the current save is unchanged.
2. Use case ends.

### A3: Save export from a newer version

**Trigger:** The save export has a newer save format version than the game knows (step 4)  
**Flow:**

1. System tells the player that the save export needs a newer version of the game and that the current save is unchanged.
2. Use case ends.

### A4: Player cancels

**Trigger:** Player declines to replace the current save (step 6)  
**Flow:**

1. System discards the save export and keeps the current save.
2. Use case ends.

### A5: Player restores the previous save

**Trigger:** Player chooses to restore the previous save after an import (step 8)  
**Flow:**

1. System asks the player to confirm that the imported save is replaced by the restorable copy.
2. Player confirms.
3. System stores the restorable copy as the save.
4. Use case ends.

### A6: Storing fails

**Trigger:** The device refuses to store the imported save (step 7)  
**Flow:**

1. System keeps the current save and tells the player that the import was not stored.
2. Use case ends.

## Postconditions

### Success Postconditions

- The save holds the imported progress, in the current save format version.
- The previous save is kept as a restorable copy.

### Failure Postconditions

- The current save is unchanged when the import does not complete.
- The game keeps running; no save export, however malformed, stops it (NFR-020).

## Business Rules

### BR-001: Untrusted input

A save export is untrusted input. It is checked completely before anything is stored, and an invalid save export never changes the current save (NFR-020).

### BR-002: Replace, never merge

An import replaces the whole save after the player's confirmation; it never merges two saves.

### BR-003: One step back

The save that an import replaced is kept as a restorable copy. The game keeps the 3 most recent restorable copies, whatever replaced the save, so that a later import, cloud restore, or migration never pushes it out at once and no progress is lost by a mistaken import (NFR-018).

### BR-004: Works offline

Importing needs no network and no account (C-003).

### BR-005: Edited saves are allowed

A save export the player edited is accepted when it passes every check of step 4; save editing affects only the player's own game (ADR-001, ADR-004).

### BR-006: Older formats migrate

A save export of an older save format version is migrated to the current one, never refused (C-017).
