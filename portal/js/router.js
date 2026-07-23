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
import { scheduleActivities } from './scheduler.js';
import { saveCurrentSession, loadCurrentSession, loadEarnedRewards, loadDiscoveryLog } from './storage.js';
import { recordReflection, getDiscoveryLog } from './discovery-log.js';
import { evaluateMissionRewards, getEarnedRewards, resolveRewardDetails } from './reward-engine.js';
import { getSessionDuration, setSessionDuration, SUPPORTED_SESSION_DURATIONS } from './settings.js';
import { fetchJson } from './utils.js';
import {
  listProfiles,
  getActiveChild,
  selectActiveChild,
  createProfile,
  createProfileFromLegacySave,
  hasUnmigratedLegacySave,
  touchLastPlayed
} from './explorer-profiles.js';

// A small fixed emoji set, not image upload, per Milestone 11's scope
// decision (avatar image upload is explicitly out of scope).
const AVATAR_CHOICES = ['🦊', '🐻', '🐸', '🦉', '🐢', '🦁', '🐧', '🐙'];

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
  const sessionDuration = getSessionDuration();
  addRow('Estimated Time', mission.estimatedTime);
  addRow('Difficulty', mission.difficulty);
  addRow('Session Duration', `${sessionDuration} minutes`);
  section.appendChild(details);

  const activitiesHeading = document.createElement('h3');
  activitiesHeading.textContent = 'Activities';
  section.appendChild(activitiesHeading);

  const activitiesContainer = document.createElement('div');
  section.appendChild(activitiesContainer);

  const scheduled = scheduleActivities(mission.activities, sessionDuration);
  renderActivities(activitiesContainer, scheduled);

  buildReflectionSection(section, mission, missionId);
}

// Renders each reflection prompt with a free-text response box that
// saves to the Discovery Log via discovery-log.js. This is the first
// learner-input control in the platform — everything before this
// milestone was read-only rendering and navigation.
function buildReflectionSection(section, mission, missionId) {
  const prompts = Array.isArray(mission.reflection?.prompts) ? mission.reflection.prompts : [];
  if (prompts.length === 0) return;

  const heading = document.createElement('h3');
  heading.textContent = 'Reflection';
  section.appendChild(heading);

  prompts.forEach((prompt) => {
    const form = document.createElement('form');
    form.className = 'reflection-prompt';

    const promptText = document.createElement('p');
    promptText.textContent = prompt;
    form.appendChild(promptText);

    const label = document.createElement('label');
    const labelText = document.createElement('span');
    labelText.textContent = 'Your answer';
    const textarea = document.createElement('textarea');
    textarea.rows = 3;
    label.append(labelText, textarea);
    form.appendChild(label);

    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.textContent = 'Save to Discovery Log';
    form.appendChild(submit);

    const feedback = document.createElement('p');
    feedback.setAttribute('role', 'status');
    form.appendChild(feedback);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const result = recordReflection({
        prompt,
        learnerNotes: textarea.value,
        campaignId: 'campaign01',
        missionId
      });

      if (!result.ok) {
        feedback.textContent = result.errors.join(' ');
        return;
      }

      feedback.textContent = 'Saved to your Discovery Log.';
      textarea.value = '';

      const rewardResult = evaluateMissionRewards({
        campaignId: 'campaign01',
        missionId,
        rewards: mission.rewards
      });

      if (rewardResult.newlyEarned.length > 0) {
        const rewardNote = document.createElement('p');
        rewardNote.setAttribute('role', 'status');
        rewardNote.textContent = `Reward earned: ${rewardResult.newlyEarned
          .map((reward) => reward.value)
          .join(', ')}`;
        form.appendChild(rewardNote);
      }
    });

    section.appendChild(form);
  });
}

// Home: offers "Continue Mission" when a saved current session exists
// (Storage Manager), otherwise falls back to the generic placeholder.
// Home: if an Explorer is already active on this device, shows their
// normal dashboard (Continue Mission). Otherwise shows the "Who's
// Exploring Today?" selector (Milestone 11) — this is the only place a
// child is picked; every other route relies on storage.js's active-child
// default and needs no profile-awareness of its own. Content renders into
// a dedicated inner container (not `section` directly) so activating a
// profile can redraw just that part without disturbing the heading.
function renderHome(outlet, route) {
  outlet.innerHTML = `
    <section aria-labelledby="route-heading">
      <h2 id="route-heading">${route.label}</h2>
      <div data-home-content></div>
    </section>
  `;

  const content = outlet.querySelector('[data-home-content]');
  const activeChild = getActiveChild();

  if (activeChild) {
    renderHomeDashboard(content, activeChild);
  } else {
    renderExplorerSelector(content);
  }
}

function renderHomeDashboard(content, child) {
  content.innerHTML = '';

  const status = document.createElement('p');
  status.textContent = `Exploring as: ${[child.avatar, child.displayName].filter(Boolean).join(' ')}`;
  content.appendChild(status);

  const session = loadCurrentSession();
  if (session && session.missionId) {
    const continueParagraph = document.createElement('p');
    const link = document.createElement('a');
    link.href = `#/mission/${session.missionId}`;
    link.textContent = 'Continue Mission';
    continueParagraph.appendChild(link);
    content.appendChild(continueParagraph);
    return;
  }

  const message = document.createElement('p');
  message.textContent = 'No mission in progress yet.';
  content.appendChild(message);

  const chooseLink = document.createElement('a');
  chooseLink.href = '#/campaigns';
  chooseLink.textContent = 'Choose Campaign';
  content.appendChild(chooseLink);
}

function countMissionsWithProgress(childId) {
  const missionIds = new Set([
    ...loadEarnedRewards(childId).map((reward) => reward.missionId),
    ...loadDiscoveryLog(childId).map((entry) => entry.missionId)
  ]);
  return missionIds.size;
}

function activateProfile(content, childId) {
  selectActiveChild(childId);
  touchLastPlayed(childId);
  renderHomeDashboard(content, getActiveChild());
}

function renderExplorerSelector(content) {
  content.innerHTML = '';

  const heading = document.createElement('h3');
  heading.textContent = "Who's Exploring Today?";
  content.appendChild(heading);

  const profiles = listProfiles();

  if (profiles.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'No Explorers set up on this device yet.';
    content.appendChild(empty);
  } else {
    const list = document.createElement('ul');
    profiles.forEach((profile) => {
      const item = document.createElement('li');

      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = [profile.avatar, profile.displayName].filter(Boolean).join(' ');
      button.addEventListener('click', () => activateProfile(content, profile.id));
      item.appendChild(button);

      const stats = document.createElement('p');
      const created = new Date(profile.createdAt).toLocaleDateString();
      const lastPlayed = profile.lastPlayedAt ? new Date(profile.lastPlayedAt).toLocaleDateString() : 'Never';
      const streakCount = profile.streak?.count ?? 0;
      const missionsCompleted = countMissionsWithProgress(profile.id);
      stats.textContent =
        `Explorer since ${created} — Last played: ${lastPlayed} — ` +
        `Streak: ${streakCount} day${streakCount === 1 ? '' : 's'} — ` +
        `Missions with progress: ${missionsCompleted}`;
      item.appendChild(stats);

      list.appendChild(item);
    });
    content.appendChild(list);
  }

  renderNewExplorerForm(content);
}

// "+ New Explorer": collapsed behind a <details> so the selector stays
// uncluttered when several children already exist. If this device has an
// unmigrated pre-Milestone-11 save and no profiles yet, the first
// profile created adopts that save (explorer-profiles.js's
// createProfileFromLegacySave) instead of starting blank.
function renderNewExplorerForm(content) {
  const isFirstProfile = listProfiles().length === 0 && hasUnmigratedLegacySave();

  const details = document.createElement('details');
  const summary = document.createElement('summary');
  summary.textContent = '+ New Explorer';
  details.appendChild(summary);

  if (isFirstProfile) {
    const legacyNotice = document.createElement('p');
    legacyNotice.textContent =
      'We found existing progress on this device — creating your first Explorer here will keep it.';
    details.appendChild(legacyNotice);
  }

  const form = document.createElement('form');

  const nameLabel = document.createElement('label');
  const nameLabelText = document.createElement('span');
  nameLabelText.textContent = 'Explorer name';
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.required = true;
  nameLabel.append(nameLabelText, nameInput);
  form.appendChild(nameLabel);

  const avatarFieldset = document.createElement('fieldset');
  const avatarLegend = document.createElement('legend');
  avatarLegend.textContent = 'Avatar';
  avatarFieldset.appendChild(avatarLegend);
  let selectedAvatar = AVATAR_CHOICES[0];
  AVATAR_CHOICES.forEach((avatar, index) => {
    const avatarLabel = document.createElement('label');
    const avatarInput = document.createElement('input');
    avatarInput.type = 'radio';
    avatarInput.name = 'newExplorerAvatar';
    avatarInput.value = avatar;
    avatarInput.checked = index === 0;
    avatarInput.addEventListener('change', () => {
      selectedAvatar = avatar;
    });
    avatarLabel.append(avatarInput, ` ${avatar}`);
    avatarFieldset.appendChild(avatarLabel);
  });
  form.appendChild(avatarFieldset);

  const pinLabel = document.createElement('label');
  const pinLabelText = document.createElement('span');
  pinLabelText.textContent = 'PIN (4-8 digits — a parent will use this to open Parent Mode)';
  const pinInput = document.createElement('input');
  pinInput.type = 'text';
  pinInput.inputMode = 'numeric';
  pinInput.pattern = '\\d{4,8}';
  pinInput.required = true;
  pinLabel.append(pinLabelText, pinInput);
  form.appendChild(pinLabel);

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Create Explorer';
  form.appendChild(submit);

  const feedback = document.createElement('p');
  feedback.setAttribute('role', 'status');
  form.appendChild(feedback);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const displayName = nameInput.value;
    const pin = pinInput.value;
    const result = isFirstProfile
      ? await createProfileFromLegacySave({ displayName, avatar: selectedAvatar, pin })
      : await createProfile({ displayName, avatar: selectedAvatar, pin });

    if (!result.ok) {
      feedback.textContent = result.errors.join(' ');
      return;
    }

    activateProfile(content, result.profile.id);
  });

  details.appendChild(form);
  content.appendChild(details);
}

// Discovery Log: lists saved reflections (most recent first), or a
// sensible empty state. Text is set via textContent, never innerHTML,
// since entries contain learner-authored free text.
function renderDiscoveryLog(outlet, route) {
  outlet.innerHTML = `
    <section aria-labelledby="route-heading">
      <h2 id="route-heading">${route.label}</h2>
    </section>
  `;

  const section = outlet.querySelector('section');
  const entries = getDiscoveryLog();

  if (entries.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'No discoveries recorded yet. Reflections you save during a mission will appear here.';
    section.appendChild(empty);
    return;
  }

  const list = document.createElement('ul');
  entries
    .slice()
    .reverse()
    .forEach((entry) => {
      const item = document.createElement('li');

      const prompt = document.createElement('p');
      prompt.textContent = entry.prompt;
      item.appendChild(prompt);

      const notes = document.createElement('p');
      notes.textContent = entry.learnerNotes;
      item.appendChild(notes);

      const meta = document.createElement('p');
      meta.textContent = `${entry.missionId ?? 'Unknown mission'} — ${new Date(entry.timestamp).toLocaleString()}`;
      item.appendChild(meta);

      list.appendChild(item);
    });
  section.appendChild(list);
}

// Explorer Profile: lists earned rewards (achievements), or a sensible
// empty state. Knowledge Core/Rank rewards resolve their coreId/rankId
// against the campaign's world catalogs for an icon and description;
// other reward types (badge, unlock, story, collectible) fall back to
// the plain value. Explorer name/avatar/campaign progress/statistics
// from 601_HTML_ARCHITECTURE.md's Explorer Profile page aren't
// implemented yet — there is no Explorer Profile module.
async function renderProfile(outlet, route) {
  outlet.innerHTML = `
    <section aria-labelledby="route-heading">
      <h2 id="route-heading">${route.label}</h2>
    </section>
  `;

  const section = outlet.querySelector('section');
  const rewards = getEarnedRewards();

  if (rewards.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'No achievements yet. Rewards you earn during a mission will appear here.';
    section.appendChild(empty);
    return;
  }

  const [coresResult, ranksResult] = await Promise.all([
    fetchJson('campaigns/campaign01/src/world/knowledge-cores.json'),
    fetchJson('campaigns/campaign01/src/world/ranks.json')
  ]);
  const catalogs = {
    knowledgeCores: coresResult.ok ? coresResult.data : [],
    ranks: ranksResult.ok ? ranksResult.data : []
  };

  const heading = document.createElement('h3');
  heading.textContent = 'Achievements';
  section.appendChild(heading);

  const list = document.createElement('ul');
  rewards.forEach((reward) => {
    const item = document.createElement('li');
    const details = resolveRewardDetails(reward, catalogs);

    if (details?.icon) {
      const icon = document.createElement('img');
      icon.src = `campaigns/campaign01/${details.icon}`;
      icon.alt = '';
      icon.width = 32;
      icon.height = 32;
      item.appendChild(icon);
    }

    const text = document.createElement('span');
    const title = details?.title ?? reward.value;
    text.textContent = `${title} (${reward.type}) — earned ${new Date(reward.earnedAt).toLocaleString()}`;
    item.appendChild(text);

    if (details?.description) {
      const description = document.createElement('p');
      description.textContent = details.description;
      item.appendChild(description);
    }

    list.appendChild(item);
  });
  section.appendChild(list);
}

// Settings: lets a parent choose the session duration that
// scheduleActivities() uses to assemble each mission (ADR-009, Adjustable
// Daily Duration). Persists via settings.js/storage.js so the choice
// survives a reload.
function renderSettings(outlet, route) {
  outlet.innerHTML = `
    <section aria-labelledby="route-heading">
      <h2 id="route-heading">${route.label}</h2>
    </section>
  `;

  const section = outlet.querySelector('section');

  const intro = document.createElement('p');
  intro.textContent = 'Choose how long each mission session should be. Core activities are always included; longer sessions add Extension activities and, at 90 minutes, a Rabbit Hole.';
  section.appendChild(intro);

  const form = document.createElement('form');
  const currentDuration = getSessionDuration();

  SUPPORTED_SESSION_DURATIONS.forEach((minutes) => {
    const label = document.createElement('label');
    label.style.display = 'block';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'sessionDuration';
    input.value = String(minutes);
    input.checked = minutes === currentDuration;

    label.appendChild(input);
    label.append(` ${minutes} minutes`);
    form.appendChild(label);
  });

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Save';
  form.appendChild(submit);

  const feedback = document.createElement('p');
  feedback.setAttribute('role', 'status');
  form.appendChild(feedback);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const selected = form.querySelector('input[name="sessionDuration"]:checked');
    const minutes = selected ? Number(selected.value) : null;
    const result = setSessionDuration(minutes);
    feedback.textContent = result.ok
      ? `Session duration set to ${minutes} minutes.`
      : result.errors.join(' ');
  });

  section.appendChild(form);
}

const STATIC_VIEWS = {
  '/': renderHome,
  '/campaigns': renderCampaignSelect,
  '/discovery': renderDiscoveryLog,
  '/profile': renderProfile,
  '/settings': renderSettings
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

  // "Switch Explorer" isn't a route (it shares Home's "#/" target) — it
  // needs its own handler because, unlike a plain nav link, it must clear
  // the active child first so Home shows the selector again instead of
  // silently redrawing the same Explorer's dashboard.
  const switchExplorerLink = nav?.querySelector('[data-switch-explorer]');
  switchExplorerLink?.addEventListener('click', (event) => {
    event.preventDefault();
    selectActiveChild(null);
    window.location.hash = '/';
    render();
  });

  window.addEventListener('hashchange', render);
  render();
}
