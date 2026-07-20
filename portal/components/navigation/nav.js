// nav.js — Renders the primary navigation links from the route table.
// Data-driven: adding a route to router.js is enough to add a nav link.

import { ROUTES } from '../../js/router.js';

export function renderNav(nav) {
  if (!nav) return;
  nav.innerHTML = ROUTES.map(
    (route) => `<a href="#${route.path}" data-route-link>${route.label}</a>`
  ).join('');
}
