// ADR-015: the precache list our Vite plugin writes into the service worker.
import { describe, expect, it } from 'vitest';
import { buildPrecacheList } from '../../scripts/precache-plugin';

const html = '<!doctype html><script src="/assets/index-abc.js"></script>';
const emitted = [
  'index.html',
  'sw.js',
  'assets/index-abc.js',
  'assets/index-def.css',
  'assets/x.js.map',
];
const icon = new Map([['icons/icon-192.png', new Uint8Array([1, 2, 3])]]);

describe('ADR-015 precache list', () => {
  it('UC-013 step 2: holds the entry HTML as "/" so a launch finds it offline', () => {
    expect(buildPrecacheList(emitted, html, icon).urls).toContain('/');
  });

  it('UC-012 step 2: holds every built file and every public file, but not sw.js, index.html, or maps', () => {
    expect(buildPrecacheList(emitted, html, icon).urls).toEqual([
      '/',
      '/assets/index-abc.js',
      '/assets/index-def.css',
      '/icons/icon-192.png',
    ]);
  });

  it('keeps the version when nothing changed', () => {
    expect(buildPrecacheList(emitted, html, icon).version).toBe(
      buildPrecacheList([...emitted].reverse(), html, icon).version,
    );
  });

  it('ADR-002: a new version when the entry HTML changes', () => {
    expect(buildPrecacheList(emitted, `${html} `, icon).version).not.toBe(
      buildPrecacheList(emitted, html, icon).version,
    );
  });

  it('ADR-002: a new version when a public file changes, although its name stays', () => {
    const changed = new Map([['icons/icon-192.png', new Uint8Array([9])]]);
    expect(buildPrecacheList(emitted, html, changed).version).not.toBe(
      buildPrecacheList(emitted, html, icon).version,
    );
  });

  it('ADR-002: a new version when a hashed file changes', () => {
    const rebuilt = emitted.map((file) => file.replace('index-abc', 'index-xyz'));
    expect(buildPrecacheList(rebuilt, html, icon).version).not.toBe(
      buildPrecacheList(emitted, html, icon).version,
    );
  });
});
