// app.js — Application bootstrap.
// Initialises the primary navigation and the router. No campaign or
// scheduler logic is initialised here yet — that arrives in later
// milestones.

import { init as initRouter } from './router.js';
import { renderNav } from '../components/navigation/nav.js';
import { applyAccessibilityPreferences } from './settings.js';
import { registerServiceWorker } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const outlet = document.getElementById('app');
  const nav = document.querySelector('[data-primary-nav]');

  // Applies whichever Explorer is active at load time (or the legacy save's
  // preferences if no profile has been created yet) so a reload doesn't
  // flash unstyled content before Settings would otherwise reapply it.
  applyAccessibilityPreferences();

  registerServiceWorker();

  renderNav(nav);
  initRouter({ outlet, nav });
});
