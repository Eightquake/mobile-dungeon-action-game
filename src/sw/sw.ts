// The service worker (ADR-002, ADR-003, ADR-015). It only caches and serves files and contains no game logic (C-015).
//
// - install: stores every file of the precache list in the cache of this version. Files already stored are skipped,
//   so an interrupted first visit completes at the next visit with a network connection (UC-012 A4).
// - activate: deletes the caches of other versions (ADR-002).
// - fetch: answers same-origin GET requests from the cache first, and every navigation with the cached entry HTML,
//   so the game launches without a network connection (UC-013 step 2).
//
// There is no automatic skipWaiting() and no clients.claim(): a new version activates at the next launch, never
// during a run (ADR-003, C-014). Activation from the end-of-run summary comes with UC-014.

// Type-checked with src/sw/tsconfig.json (WebWorker library instead of DOM).
declare let self: ServiceWorkerGlobalScope & {
  /** Replaced at build time by the precache list (scripts/precache-plugin.ts). */
  __PRECACHE: { version: string; urls: string[] };
};
export {};

const PREFIX = 'game-';
const PRECACHE = self.__PRECACHE;
const CACHE = `${PREFIX}${PRECACHE.version}`;
const PRECACHED = new Set(PRECACHE.urls);

async function store(cache: Cache, url: string): Promise<void> {
  if (await cache.match(url)) return;
  // Hashed files never change, so a copy from the cache of an older version saves the download.
  const old = url === '/' ? undefined : await caches.match(url);
  if (old) return cache.put(url, old);
  const response = await fetch(url, { cache: 'reload' });
  if (!response.ok) throw new Error(`precache: ${url} answered ${response.status}`);
  await cache.put(url, response);
}

async function install(): Promise<void> {
  const cache = await caches.open(CACHE);
  // allSettled keeps every file stored so far when one download fails (UC-012 A4); the install then fails, and the
  // browser tries again at the next visit.
  const results = await Promise.allSettled(PRECACHE.urls.map((url) => store(cache, url)));
  const failed = results.find((result) => result.status === 'rejected');
  if (failed) throw failed.reason;
}

async function activate(): Promise<void> {
  const names = await caches.keys();
  await Promise.all(
    names
      .filter((name) => name.startsWith(PREFIX) && name !== CACHE)
      .map((name) => caches.delete(name)),
  );
}

async function respond(request: Request): Promise<Response> {
  const cache = await caches.open(CACHE);
  const path = new URL(request.url).pathname;
  const key = request.mode === 'navigate' ? '/' : path;
  const cached = PRECACHED.has(key) ? await cache.match(key) : undefined;
  return cached ?? fetch(request);
}

self.addEventListener('install', (event) => event.waitUntil(install()));
self.addEventListener('activate', (event) => event.waitUntil(activate()));
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(respond(request));
});
