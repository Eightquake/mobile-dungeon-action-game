/**
 * Registers the service worker that stores the files for playing offline (UC-012 step 2, ADR-002, ADR-015).
 * Only in the production build: the dev server serves no sw.js. The title screen never waits for it (UC-013 BR-002).
 */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  // updateViaCache "none": the browser always revalidates sw.js, so an update is found at the next launch (ADR-003).
  navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).catch(() => {
    // UC-012 A4: no files stored this time; the browser tries again at the next visit.
  });
}
