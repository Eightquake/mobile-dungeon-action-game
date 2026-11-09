// CI budget job (ADR-011 job 5): checks the production build in dist/.
//
// 1. Precache size (NFR-016, docs/Performance.md section 2): the files of the first visit total at most 5 MB,
//    compressed as transferred. The files are those of the precache list in dist/sw.js (ADR-015), plus sw.js itself.
//    Sizes are measured gzip-compressed (level 9), a conservative stand-in for what the host transfers.
// 2. No test-only code (ADR-009): code that exists only in the test build carries the marker below and is compiled
//    out of production builds. Any file in dist/ that still contains it fails the job.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = 'dist';
const PRECACHE_LIMIT_BYTES = 5 * 1024 * 1024;
export const TEST_ONLY_MARKER = 'TEST_BUILD_ONLY';

function filesIn(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? filesIn(path) : [path];
  });
}

let files;
try {
  files = filesIn(DIST);
} catch {
  console.error(`No ${DIST}/ folder. Run "npm run build" first.`);
  process.exit(1);
}

// The markers of scripts/precache-plugin.ts around the precache list.
const list = /\/\*PRECACHE\*\/(.*?)\/\*END PRECACHE\*\//s.exec(
  readFileSync(join(DIST, 'sw.js'), 'utf8'),
);
if (!list) {
  console.error('FAIL: no precache list in dist/sw.js (ADR-015).');
  process.exit(1);
}
const precached = new Set([
  'sw.js',
  ...JSON.parse(list[1]).urls.map((url) => (url === '/' ? 'index.html' : url.slice(1))),
]);

let total = 0;
const leaks = [];
for (const file of files) {
  const name = relative(DIST, file).split('\\').join('/');
  const content = readFileSync(file);
  if (content.includes(TEST_ONLY_MARKER)) leaks.push(name);
  if (!precached.delete(name)) continue;
  const compressed = gzipSync(content, { level: 9 }).length;
  total += compressed;
  console.log(`${String(compressed).padStart(10)}  ${name}`);
}
if (precached.size > 0) {
  console.error(`FAIL: precached but not in ${DIST}/: ${[...precached].join(', ')}`);
  process.exit(1);
}

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(2);
console.log(`Precache size: ${mb(total)} MB of ${mb(PRECACHE_LIMIT_BYTES)} MB (NFR-016)`);

let failed = false;
if (total > PRECACHE_LIMIT_BYTES) {
  console.error('FAIL: the precache exceeds the NFR-016 limit.');
  failed = true;
}
if (leaks.length > 0) {
  console.error(
    `FAIL: test-only code (${TEST_ONLY_MARKER}) in the production build: ${leaks.join(', ')}`,
  );
  failed = true;
}
process.exit(failed ? 1 : 0);
