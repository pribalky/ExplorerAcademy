// app.js — Application bootstrap.
// Initialises the primary navigation and the router. No campaign, storage
// or scheduler logic is initialised here yet — that arrives in later
// milestones.

import { init as initRouter } from './router.js';
import { renderNav } from '../components/navigation/nav.js';

document.addEventListener('DOMContentLoaded', () => {
  const outlet = document.getElementById('app');
  const nav = document.querySelector('[data-primary-nav]');

  renderNav(nav);
  initRouter({ outlet, nav });
});
