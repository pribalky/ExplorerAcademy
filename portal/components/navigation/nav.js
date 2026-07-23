// nav.js — Renders the primary navigation links from the route table.
// Data-driven: adding a route to router.js is enough to add a nav link.
//
// "Switch Explorer" (Milestone 11) is the one static addition: it points
// at the same "#/" target as the Home link, but router.js's init() gives
// it its own click handler that clears the active Explorer first, so
// Home shows the "Who's Exploring Today?" selector again instead of
// redrawing the same child's dashboard. It's deliberately left out of
// ROUTES (and out of data-route-link, so updateActiveNavLink() doesn't
// try to mark it "current") since it's an action, not a page of its own.

import { ROUTES } from '../../js/router.js';

export function renderNav(nav) {
  if (!nav) return;
  const routeLinks = ROUTES.map(
    (route) => `<a href="#${route.path}" data-route-link>${route.label}</a>`
  ).join('');
  nav.innerHTML = `${routeLinks}<a href="#/" data-switch-explorer>Switch Explorer</a>`;
}
