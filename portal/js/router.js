// router.js — Page navigation for the learner shell.
//
// Uses hash-based routing (not the History API) so navigation, deep links
// and back/forward all work identically from a local filesystem (file://),
// USB distribution or any static host — no server rewrite rules required.
// Parent Mode is intentionally not one of these routes: it is a separate
// static entry point (portal/parent/index.html), kept invisible to the
// learner shell per ADR-006.

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

function renderRoute(outlet, route, path) {
  if (!route) {
    outlet.innerHTML = `
      <section aria-labelledby="route-heading">
        <h2 id="route-heading">Page Not Found</h2>
        <p>"${path}" is not a known page yet.</p>
        <a href="#/">Return Home</a>
      </section>
    `;
    document.title = 'Page Not Found — Explorer Academy';
    return;
  }

  outlet.innerHTML = `
    <section aria-labelledby="route-heading">
      <h2 id="route-heading">${route.label}</h2>
      <p>This is a placeholder for the ${route.label} page. Content arrives in a later milestone.</p>
    </section>
  `;
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
  function render() {
    const path = currentPath();
    const route = findRoute(path);
    renderRoute(outlet, route, path);
    updateActiveNavLink(nav, path);
    outlet.focus({ preventScroll: true });
  }

  window.addEventListener('hashchange', render);
  render();
}
