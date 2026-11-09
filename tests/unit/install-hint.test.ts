// UC-012 Install Game: which install hint the title screen shows.
import { describe, expect, it } from 'vitest';
import { chooseInstallHint, type InstallEnvironment } from '../../src/ui/install-hint';

const browser: InstallEnvironment = {
  installed: false,
  dismissed: false,
  ios: false,
  android: false,
  installPromptSupported: false,
};

describe('UC-012 install hint', () => {
  it('UC-012 step 4: explains the share menu on iOS', () => {
    expect(chooseInstallHint({ ...browser, ios: true })).toBe('ios');
  });

  it('UC-012 step 4: explains the browser menu on Android', () => {
    expect(chooseInstallHint({ ...browser, android: true })).toBe('menu');
  });

  it('UC-012 step 4: explains the browser menu where the browser can install web apps', () => {
    expect(chooseInstallHint({ ...browser, installPromptSupported: true })).toBe('menu');
  });

  it('UC-012 A2: says the game plays in the browser when the browser cannot install it', () => {
    expect(chooseInstallHint(browser)).toBe('browser-only');
  });

  it('UC-012 A3 and step 8: shows no hint when the game runs from the home screen icon', () => {
    expect(chooseInstallHint({ ...browser, ios: true, installed: true })).toBe('none');
    expect(chooseInstallHint({ ...browser, android: true, installed: true })).toBe('none');
  });

  it('UC-012 A1 BR-002: shows no hint after the player dismissed it', () => {
    expect(chooseInstallHint({ ...browser, android: true, dismissed: true })).toBe('none');
  });
});
