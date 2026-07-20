// router.js — Page navigation for the learner shell.
//
// Uses hash-based routing (not the History API) so navigation, deep links
// and back/forward all work identically from a local filesystem (file://),
// USB distribution or any static host — no server rewrite rules required.
// Parent Mode is intentionally not one of these routes: it is a separate
// static entry point (portal/parent/index.html), kept invisible to the
// learner shell per ADR-006.

import { loadCampaign } from './campaign-loader.js';
import { loadMission } from './mission-engine.js';
import { renderActivities } from './activity-engine.js';
import { scheduleActivities, DEFAULT_DURATION_MINUTES } from './scheduler.js';
import { saveCurrentSession, loadCurrentSession } from './storage.js';

export const ROUTES = [
  { path: '/', label: 'Home', title: 'Explorer Academy' },
  { path: '/campaigns', label: 'Campaigns', title: 'Campaign Select' },
  { path: '/discovery', label: 'Discovery Log', title: 'Discovery Log' },
  { path: '/profile', label: 'Explorer Profile', title: 'Explorer Profile' },
  { path: '/settings', label: 'Settings', title: 'Settings' }
];

// Campaign discovery (listing which campaign packages exist) isn't
// implemented yet — there is no manifest or Asset Manager to enumerate
// them. This is a placeholder list until that exists.
const KNOWN_CAMPAIGN_IDS = ['campaign01'];

const DYNAMIC_ROUTES = [
  { name: 'campaign', pattern: /^\/campaign\/([^/]+)$/, title: 'Campaign Overview' },
  { name: 'mission', pattern: /^\/mission\/([^/]+)$/, title: 'Mission' }
];

function currentPath() {
  const hash = window.location.hash.replace(/^#/, '');
  return hash === '' ? '/' : hash;
}

function matchRoute(path) {
  const staticRoute = ROUTES.find((route) => route.path === path);
  if (staticRoute) {
    return { kind: 'static', route: staticRoute };
  }

  for (const dynamic of DYNAMIC_ROUTES) {
    const match = path.match(dynamic.pattern);
    if (match) {
      return {
        kind: 'dynamic',
        name: dynamic.name,
        title: dynamic.title,
        param: decodeURIComponent(match[1])
      };
    }
  }

  return null;
}

function renderNotFound(outlet, path) {
  outlet.innerHTML = `
    <section aria-labelledby="route-heading">
      <h2 id="route-heading">Page Not Found</h2>
      <p>"${path}" is not a known page yet.</p>
      <a href="#/">Return Home</a>
    </section>
  `;
  document.title = 'Page Not Found — Explorer Academy';
}

function renderPlaceholder(outlet, heading, message) {
  outlet.innerHTML = `
    <section aria-labelledby="route-heading">
      <h2 id="route-heading">${heading}</h2>
      <p>${message}</p>
    </section>
  `;
}

// Renders a single campaign's metadata (or a graceful failure state).
// Shared by the Campaign Overview page. Text is set via textContent/DOM
// construction, never innerHTML, since campaign data is authored content,
// not trusted markup.
async function renderCampaignMetadata(outlet, campaignId) {
  outlet.innerHTML = `
    <section aria-labelledby="route-heading">
      <h2 id="route-heading">Campaign Overview</h2>
      <p data-status>Loading campaign…</p>
    </section>
  `;

  const result = await loadCampaign(campaignId);
  const section = outlet.querySelector('section');
  const status = outlet.querySelector('[data-status]');

  if (!result.ok) {
    status.textContent = `No campaign could be loaded for "${campaignId}".`;
    const list = document.createElement('ul');
    result.errors.forEach((message) => {
      const item = document.createElement('li');
      item.textContent = message;
      list.appendChild(item);
    });
    section.appendChild(list);
    return;
  }

  const { campaign } = result;
  outlet.querySelector('#route-heading').textContent = campaign.title;
  status.remove();

  const subtitle = document.createElement('p');
  subtitle.textContent = campaign.subtitle;
  section.appendChild(subtitle);

  const details = document.createElement('dl');
  const addRow = (term, value) => {
    const dt = document.createElement('dt');
    dt.textContent = term;
    const dd = document.createElement('dd');
    dd.textContent = String(value);
    details.append(dt, dd);
  };
  addRow('Theme', campaign.theme);
  addRow('Recommended Age', campaign.recommendedAge);
  addRow('Estimated Duration', campaign.estimatedDuration);
  addRow('Missions', campaign.missions.length);
  section.appendChild(details);
}

// Campaign Select: lists known campaigns as cards linking to their
// Campaign Overview page. Cards are generated from campaign metadata
// rather than hardcoded, per 601_HTML_ARCHITECTURE.md.
async function renderCampaignSelect(outlet, route) {
  outlet.innerHTML = `
    <section aria-labelledby="route-heading">
      <h2 id="route-heading">${route.label}</h2>
      <p data-status>Loading campaigns…</p>
      <ul data-campaign-list></ul>
    </section>
  `;

  const status = outlet.querySelector('[data-status]');
  const list = outlet.querySelector('[data-campaign-list]');

  const results = await Promise.all(
    KNOWN_CAMPAIGN_IDS.map((id) => loadCampaign(id).then((result) => ({ id, result })))
  );

  status.remove();

  results.forEach(({ id, result }) => {
    const item = document.createElement('li');

    if (!result.ok) {
      item.textContent = `Campaign "${id}" is unavailable.`;
      list.appendChild(item);
      return;
    }

    const link = document.createElement('a');
    link.href = `#/campaign/${id}`;
    link.textContent = result.campaign.title;
    item.appendChild(link);

    const subtitle = document.createElement('p');
    subtitle.textContent = result.campaign.subtitle;
    item.appendChild(subtitle);

    list.appendChild(item);
  });
}

// Renders a single mission's metadata (or a graceful failure state).
// Mission routes aren't campaign-scoped yet — no multi-campaign linking
// exists, so this is hardcoded to campaign01 until that's needed, the
// same simplification KNOWN_CAMPAIGN_IDS makes above.
async function renderMission(outlet, missionId) {
  outlet.innerHTML = `
    <section aria-labelledby="route-heading">
      <h2 id="route-heading">Mission</h2>
      <p data-status>Loading mission…</p>
    </section>
  `;

  const result = await loadMission('campaign01', missionId);
  const section = outlet.querySelector('section');
  const status = outlet.querySelector('[data-status]');

  if (!result.ok) {
    status.textContent = `No mission could be loaded for "${missionId}".`;
    const list = document.createElement('ul');
    result.errors.forEach((message) => {
      const item = document.createElement('li');
      item.textContent = message;
      list.appendChild(item);
    });
    section.appendChild(list);
    return;
  }

  const { mission } = result;
  outlet.querySelector('#route-heading').textContent = mission.title;
  status.remove();

  // campaignId here is the folder slug, matching the same simplification
  // renderMission's lookup already makes — not the mission JSON's own
  // campaignId field, which is a schema ID (e.g. "CAMPAIGN-0001").
  saveCurrentSession({ campaignId: 'campaign01', missionId });

  const details = document.createElement('dl');
  const addRow = (term, value) => {
    const dt = document.createElement('dt');
    dt.textContent = term;
    const dd = document.createElement('dd');
    dd.textContent = String(value);
    details.append(dt, dd);
  };
  addRow('Estimated Time', mission.estimatedTime);
  addRow('Difficulty', mission.difficulty);
  addRow('Session Duration', `${DEFAULT_DURATION_MINUTES} minutes`);
  section.appendChild(details);

  const activitiesHeading = document.createElement('h3');
  activitiesHeading.textContent = 'Activities';
  section.appendChild(activitiesHeading);

  const activitiesContainer = document.createElement('div');
  section.appendChild(activitiesContainer);

  // No Settings Manager exists yet to let a parent choose the session
  // duration, so DEFAULT_DURATION_MINUTES stands in until that exists.
  const scheduled = scheduleActivities(mission.activities, DEFAULT_DURATION_MINUTES);
  renderActivities(activitiesContainer, scheduled);
}

// Home: offers "Continue Mission" when a saved current session exists
// (Storage Manager), otherwise falls back to the generic placeholder.
function renderHome(outlet, route) {
  outlet.innerHTML = `
    <section aria-labelledby="route-heading">
      <h2 id="route-heading">${route.label}</h2>
    </section>
  `;

  const section = outlet.querySelector('section');
  const session = loadCurrentSession();

  if (session && session.missionId) {
    const continueParagraph = document.createElement('p');
    const link = document.createElement('a');
    link.href = `#/mission/${session.missionId}`;
    link.textContent = 'Continue Mission';
    continueParagraph.appendChild(link);
    section.appendChild(continueParagraph);
    return;
  }

  const message = document.createElement('p');
  message.textContent = 'This is a placeholder for the Home page. Content arrives in a later milestone.';
  section.appendChild(message);
}

const STATIC_VIEWS = {
  '/': renderHome,
  '/campaigns': renderCampaignSelect
};

function defaultPlaceholder(outlet, route) {
  renderPlaceholder(
    outlet,
    route.label,
    `This is a placeholder for the ${route.label} page. Content arrives in a later milestone.`
  );
}

async function renderMatch(outlet, match, path) {
  if (!match) {
    renderNotFound(outlet, path);
    return;
  }

  if (match.kind === 'static') {
    const view = STATIC_VIEWS[match.route.path] ?? defaultPlaceholder;
    await view(outlet, match.route);
    document.title = match.route.path === '/' ? match.route.title : `${match.route.title} — Explorer Academy`;
    return;
  }

  if (match.name === 'campaign') {
    await renderCampaignMetadata(outlet, match.param);
    document.title = `${match.title} — Explorer Academy`;
    return;
  }

  if (match.name === 'mission') {
    await renderMission(outlet, match.param);
    document.title = `${match.title} — Explorer Academy`;
  }
}

function updateActiveNavLink(nav, path) {
  if (!nav) return;
  nav.querySelectorAll('[data-route-link]').forEach((link) => {
    if (link.getAttribute('href') === `#${path}`) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

export function init({ outlet, nav }) {
  async function render() {
    const path = currentPath();
    const match = matchRoute(path);
    await renderMatch(outlet, match, path);
    updateActiveNavLink(nav, path);
    outlet.focus({ preventScroll: true });
  }

  window.addEventListener('hashchange', render);
  render();
}
