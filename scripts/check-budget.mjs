// CI budget job (ADR-011 job 5): checks the production build in dist/.
//
// 1. Precache size (NFR-016, docs/Performance.md section 2): the files of the first visit total at most 5 MB,
//    compressed as transferred. Until the service worker lands (UC-013), every file in dist/ counts, which is an
//    upper bound for the precache. Sizes are measured gzip-compressed (level 9), a conservative stand-in for what
//    the host transfers.
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

let total = 0;
const leaks = [];
for (const file of files) {
  const content = readFileSync(file);
  const compressed = gzipSync(content, { level: 9 }).length;
  total += compressed;
  console.log(`${String(compressed).padStart(10)}  ${relative(DIST, file)}`);
  if (content.includes(TEST_ONLY_MARKER)) leaks.push(relative(DIST, file));
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
