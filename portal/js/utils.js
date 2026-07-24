// utils.js — Shared helper functions.
//
// fetchJson() factors out the non-throwing fetch-then-parse pattern that
// campaign-loader.js and mission-engine.js each already implement inline
// (predating this helper — left as-is rather than refactored mid-milestone,
// per 007_AI_CONTRIBUTING_GUIDE.md's "avoid architectural changes unless
// explicitly requested"). parent-mode.js uses this shared version for the
// several campaign-namespaced files it reads that have no dedicated loader
// module of their own (orientation, curriculum mapping, per-mission
// enrichment).

export async function fetchJson(path) {
  let response;
  try {
    response = await fetch(path);
  } catch (networkError) {
    console.warn(`fetchJson: could not reach "${path}".`, networkError);
    return { ok: false, error: `Could not reach "${path}".` };
  }

  if (!response.ok) {
    console.warn(`fetchJson: "${path}" responded with ${response.status}.`);
    return { ok: false, error: `"${path}" responded with ${response.status}.` };
  }

  try {
    const data = await response.json();
    return { ok: true, data };
  } catch (parseError) {
    console.warn(`fetchJson: "${path}" is not valid JSON.`, parseError);
    return { ok: false, error: `"${path}" is not valid JSON.` };
  }
}

// Registers sw.js (ADR-027, genuine offline caching) from whichever page
// calls this — the learner shell (app.js) or Parent Mode's separate
// static page (parent-mode.js), since either could be the first page
// loaded on a device. A plain relative path works from both: Parent
// Mode's own page already corrects its base URL via <base href="../">
// (see its own index.html), so "sw.js" resolves to the same portal-root
// script — and therefore the same registration scope — either way.
// Fails silently wherever service workers aren't supported, which
// includes the already-documented file:// case (601_HTML_ARCHITECTURE.md's
// Static Site Architecture correction) — this never worked offline
// there regardless, so silently not registering is not a regression.
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch((error) => {
      console.warn('Service worker registration failed.', error);
    });
  });
}
