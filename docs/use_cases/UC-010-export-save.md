# Use Case: Export Save

## Overview

**Use Case ID:** UC-010  
**Use Case Name:** Export Save  
**Primary Actor:** Player  
**Goal:** The player takes a copy of their whole progress off the game, as a file or a copyable code, to keep it safe or move it to another device.  
**Trigger:** Player chooses to export the save in the settings of the title screen or the pause screen.  
**Status:** Draft  

**Requirements:** [FR-019, C-003, C-017](../requirements.md)  
**Priority:** High

## Preconditions

- The game shows the title screen, the end-of-run summary, or the pause screen.

## Main Success Scenario

1. Player chooses to export the save.
2. System creates a save export of the whole save, marked with its save format version and the date of the export.
3. System offers the save export as a file to save or share, and as a code to copy.
4. Player chooses to save or share the file.
5. System hands the file to the device's save or share dialog and shows that the export is done, with the date of the export.

## Alternative Flows

### A1: Player copies the code

**Trigger:** Player chooses to copy the code (step 4)  
**Flow:**

1. System copies the code to the clipboard and shows that the code was copied.
2. Use case ends.

### A2: Device offers no file sharing

**Trigger:** The device cannot save or share the file (step 3)  
**Flow:**

1. System offers the code to copy only.
2. Use case continues at step 4 with the code.

### A3: Player cancels

**Trigger:** Player closes the save or share dialog without saving (step 5)  
**Flow:**

1. System shows that no export was saved.
2. Use case ends.

## Postconditions

### Success Postconditions

- The player holds a save export that UC-011 Import Save can read on any device.

### Failure Postconditions

- _None — the use case changes no data._

## Business Rules

### BR-001: Whole save

A save export contains the whole save — codex, waiting legendaries, ladder progress, equipped codex powers, settings, bad-luck protection, and a stored run, if any — but no restorable copy and no online identity.

### BR-002: Works offline

Exporting needs no network and no account (C-003).

### BR-003: Versioned export

Every save export carries its save format version, so that any later version of the game can migrate it (C-017).

### BR-004: Paused runs travel along

A stored run in the save is part of the export, so a player can move a paused run to another device.
