// router.js — Page navigation for the learner shell.
//
// Uses hash-based routing (not the History API) so navigation, deep links
// and back/forward all work identically from a local filesystem (file://),
// USB distribution or any static host — no server rewrite rules required.
// Parent Mode is intentionally not one of these routes: it is a separate
// static entry point (portal/parent/index.html), kept invisible to the
// learner shell per ADR-006.

import { loadCampaign } from './campaign-loader.js';

export const ROUTES = [
  { path: '/', label: 'Home', title: 'Explorer Academy' },
  { path: '/campaigns', label: 'Campaigns', title: 'Campaign Select' },
  { path: '/discovery', label: 'Discovery Log', title: 'Discovery Log' },
  { path: '/profile', label: 'Explorer Profile', title: 'Explorer Profile' },
  { path: '/settings', label: 'Settings', title: 'Settings' }
];

function currentPath() {
  const hash = window.location.hash.replace(/^#/, '');
  return hash === '' ? '/' : hash;
}

function findRoute(path) {
  return ROUTES.find((route) => route.path === path) ?? null;
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

function renderPlaceholder(outlet, route) {
  outlet.innerHTML = `
    <section aria-labelledby="route-heading">
      <h2 id="route-heading">${route.label}</h2>
      <p>This is a placeholder for the ${route.label} page. Content arrives in a later milestone.</p>
    </section>
  `;
}

// Loads campaign01 through the Campaign Loader and renders its metadata, or
// a graceful fallback if the campaign is missing/invalid. Text content is
// set via textContent (never innerHTML) since campaign data is authored
// content, not trusted markup.
async function renderCampaigns(outlet, route) {
  outlet.innerHTML = `
    <section aria-labelledby="route-heading">
      <h2 id="route-heading">${route.label}</h2>
      <p data-status>Loading campaign…</p>
    </section>
  `;

  const result = await loadCampaign('campaign01');
  const section = outlet.querySelector('section');
  const status = outlet.querySelector('[data-status]');

  if (!result.ok) {
    status.textContent = 'No campaign could be loaded right now.';
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

const VIEWS = {
  '/campaigns': renderCampaigns
};

async function renderRoute(outlet, route, path) {
  if (!route) {
    renderNotFound(outlet, path);
    return;
  }

  const view = VIEWS[route.path] ?? renderPlaceholder;
  await view(outlet, route);
  document.title = route.path === '/' ? route.title : `${route.title} — Explorer Academy`;
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
    const route = findRoute(path);
    await renderRoute(outlet, route, path);
    updateActiveNavLink(nav, path);
    outlet.focus({ preventScroll: true });
  }

  window.addEventListener('hashchange', render);
  render();
}
