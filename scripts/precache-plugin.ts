// ADR-015: our own Vite plugin for the precache list. It builds src/sw/sw.ts as /sw.js (no hash, so the browser
// finds it at a fixed URL) and writes the list of files to precache into it, between the markers below.
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import type { Plugin } from 'vite';

export const SW_ENTRY = 'src/sw/sw.ts';
export const SW_FILE = 'sw.js';
/** The expression in src/sw/sw.ts that the build replaces with the precache list. */
export const PRECACHE_PLACEHOLDER = 'self.__PRECACHE';
/** Markers around the list in dist/sw.js, so the budget job can read it (scripts/check-budget.mjs). */
export const PRECACHE_START = '/*PRECACHE*/';
export const PRECACHE_END = '/*END PRECACHE*/';

export interface PrecacheList {
  /** Hash of the list: names the cache of this version of the game. */
  version: string;
  /** Root-relative URLs. Every URL except "/" carries a content hash in its name or path. */
  urls: string[];
}

const hash = (content: string | Uint8Array): string =>
  createHash('sha256').update(content).digest('hex').slice(0, 16);

/**
 * Builds the precache list from the emitted file names, the entry HTML, and the files of the public folder.
 * The entry HTML is precached as "/" so a launch from the home screen icon finds it (UC-013 step 2).
 */
export function buildPrecacheList(
  emittedFiles: readonly string[],
  indexHtml: string,
  publicFiles: ReadonlyMap<string, Uint8Array>,
): PrecacheList {
  const urls = new Set<string>(['/']);
  const parts: string[] = [`/ ${hash(indexHtml)}`];
  for (const file of emittedFiles) {
    if (file === 'index.html' || file === SW_FILE || file.endsWith('.map')) continue;
    urls.add(`/${file}`);
    parts.push(`/${file}`);
  }
  for (const [file, content] of publicFiles) {
    // Public files have no hash in their name, so the content hash goes into the version.
    urls.add(`/${file}`);
    parts.push(`/${file} ${hash(content)}`);
  }
  const sortedUrls = [...urls].sort();
  return { version: hash(parts.sort().join('\n')), urls: sortedUrls };
}

function filesIn(dir: string): string[] {
  try {
    return readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      return statSync(path).isDirectory() ? filesIn(path) : [path];
    });
  } catch {
    return [];
  }
}

export function precachePlugin(): Plugin {
  let publicDir = '';
  return {
    name: 'precache-list',
    apply: 'build',
    enforce: 'post',
    config(config) {
      const output = config.build?.rollupOptions?.output;
      if (Array.isArray(output)) throw new Error('precache-list: one output only');
      return {
        build: {
          rollupOptions: {
            input: { index: 'index.html', sw: SW_ENTRY },
            output: {
              ...output,
              entryFileNames: (chunk) =>
                chunk.name === 'sw' ? SW_FILE : 'assets/[name]-[hash].js',
            },
          },
        },
      };
    },
    configResolved(config) {
      publicDir = config.publicDir;
    },
    generateBundle(_options, bundle) {
      const sw = bundle[SW_FILE];
      const index = bundle['index.html'];
      if (sw?.type !== 'chunk') return this.error(`precache-list: no ${SW_FILE} chunk`);
      if (index?.type !== 'asset') return this.error('precache-list: no index.html');
      if (sw.imports.length > 0) {
        return this.error(`precache-list: ${SW_ENTRY} must not share chunks with the game`);
      }
      const publicFiles = new Map(
        filesIn(publicDir).map((path) => [
          relative(publicDir, path).split(sep).join('/'),
          readFileSync(path),
        ]),
      );
      const list = buildPrecacheList(Object.keys(bundle), String(index.source), publicFiles);
      if (!sw.code.includes(PRECACHE_PLACEHOLDER)) {
        return this.error(`precache-list: ${PRECACHE_PLACEHOLDER} not found in ${SW_FILE}`);
      }
      sw.code = sw.code.replace(
        PRECACHE_PLACEHOLDER,
        `${PRECACHE_START}${JSON.stringify(list)}${PRECACHE_END}`,
      );
    },
  };
}
