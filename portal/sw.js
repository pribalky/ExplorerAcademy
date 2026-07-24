// sw.js — Service Worker: genuine offline caching (ADR-027).
//
// Precaches the platform shell and every known campaign's full src/ and
// generated/ content on install, so the whole campaign — not just
// whatever pages happen to have been visited — is available offline
// after one initial load, per ADR-004 (Offline First) and
// 601_HTML_ARCHITECTURE.md's Offline-First Architecture section.
//
// Fetch strategy is cache-first with a network fallback: static
// educational content changes rarely and shouldn't need a network round
// trip once cached, but anything not in the precache list (or added
// later) is still fetched and opportunistically cached for next time.
//
// IMPORTANT: bump CACHE_VERSION whenever shipped files change. This is a
// hand-maintained platform file, not a build-tool-generated one — there
// is no bundler to do this automatically, matching this repo's "no
// build tools" constraint. The old versioned cache is deleted on
// activate, so stale content never lingers past one reload.
//
// KNOWN_CAMPAIGN_IDS mirrors router.js's own placeholder list for the
// same reason: no real campaign-discovery manifest exists yet.

const CACHE_VERSION = 'v1';
const CACHE_NAME = `explorer-academy-${CACHE_VERSION}`;

const KNOWN_CAMPAIGN_IDS = ['campaign01'];

// Short, stable, hand-maintained — the platform shell rarely changes and
// there's no bundler to generate this list automatically.
const SHELL_FILES = [
  'index.html',
  'parent/index.html',
  'css/base.css',
  'css/layout.css',
  'css/components.css',
  'css/themes.css',
  'js/app.js',
  'js/router.js',
  'js/scheduler.js',
  'js/storage.js',
  'js/campaign-loader.js',
  'js/mission-engine.js',
  'js/activity-engine.js',
  'js/reward-engine.js',
  'js/discovery-log.js',
  'js/explorer-profiles.js',
  'js/parent-mode.js',
  'js/settings.js',
  'js/utils.js',
  'components/navigation/nav.js'
];

async function precacheEverything() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(SHELL_FILES);

  for (const campaignId of KNOWN_CAMPAIGN_IDS) {
    try {
      const manifestResponse = await fetch(`campaigns/${campaignId}/generated/offline-manifest.json`);
      if (!manifestResponse.ok) continue;
      const manifest = await manifestResponse.json();
      const files = Array.isArray(manifest.files) ? manifest.files : [];
      // Cache individually rather than one addAll() so one missing/renamed
      // file (e.g. a manifest that's drifted out of date) can't abort
      // caching for the other 100+ files.
      await Promise.all(
        files.map((path) =>
          cache.add(path).catch((error) => {
            console.warn(`sw.js: could not precache "${path}".`, error);
          })
        )
      );
    } catch (error) {
      console.warn(`sw.js: could not load offline manifest for "${campaignId}".`, error);
    }
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(precacheEverything().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
