// parent-mode.js — Parent Mode.
//
// Standalone entry point mounted from portal/parent/index.html. It is
// never linked from the learner shell (router.js) or its navigation —
// router.js's own header comment already documents this separation as the
// intended architecture (a distinct static page, not a hash route), per
// ADR-006 (Hidden Parent Mode) and 601_HTML_ARCHITECTURE.md's Parent Mode
// Manager responsibility to "verify parent access."
//
// "Verify parent access" (Milestone 11) is now: pick which Explorer by
// name (names alone aren't sensitive — a parent already knows their own
// children's names), enter that Explorer's own PIN, then see only that
// Explorer's dashboard. This supersedes the original session-only
// confirmation click — see ADR-024/ADR-025 in
// docs/00-foundation/006_DESIGN_DECISION_LOG.md (ADR-013 is marked
// Superseded, not deleted). PIN verification is hash-based
// (explorer-profiles.js's verifyProfilePin(), Web Crypto SHA-256) and
// explicitly a deterrent, not real security, per ADR-025 — there is no
// PIN-recovery flow and no lockout after repeated wrong attempts (a
// lockout would just create a new "my parent is locked out" problem for
// a family app with no backend to reset it against). Changing a PIN is
// only possible from inside this dashboard, after entering the current
// PIN — never from the learner-facing Settings page, so a child managing
// their own play session can never lock a parent out.
//
// Reuses campaign-loader.js and mission-engine.js — the same validated,
// non-throwing loaders the learner shell uses — plus fetchJson() (utils.js)
// for the campaign-namespaced files with no dedicated loader module yet:
// src/parent/orientation.json, src/parent/curriculum-mapping.json, and
// each mission's generated/parent/enrichment/missionNN.json. Enrichment
// files are deliberately optional — a missing one only means that
// mission's card skips its "Suggested interventions"/"Extension ideas"
// section, matching generated/ content's disposable status established
// since the Asset Compiler milestone.
//
// Progress is derived entirely from the *selected Explorer's* save
// (earnedRewards, discoveryLog) via reward-engine.js/discovery-log.js's
// own public functions, now given an explicit childId rather than
// relying on their "active Explorer" default — the Explorer being
// checked here isn't necessarily the one active in the learner shell.
// No completedMissions field exists yet (see storage.js's own comments),
// but reward-engine.js already treats "a mission's rewards were earned"
// as the simplest data-consistent signal that a mission session is done;
// the same signal powers the dashboard here, combined with which
// missions have at least one Discovery Log entry.
//
// Curriculum content and learningObjectives are rendered here freely —
// this page is the one place in the platform where that's correct, per
// ADR-006.

import { loadCampaign } from './campaign-loader.js';
import { loadMission } from './mission-engine.js';
import { getDiscoveryLog } from './discovery-log.js';
import { getEarnedRewards, resolveRewardDetails } from './reward-engine.js';
import { fetchJson, registerServiceWorker } from './utils.js';
import { listProfiles, verifyProfilePin, changePin } from './explorer-profiles.js';

const CAMPAIGN_ID = 'campaign01'; // same simplification router.js already makes; no multi-campaign linking exists yet

function missionSlug(number) {
  return `mission${String(number).padStart(2, '0')}`;
}

function addHeading(container, level, text) {
  const heading = document.createElement(`h${level}`);
  heading.textContent = text;
  container.appendChild(heading);
  return heading;
}

function addParagraph(container, text) {
  const p = document.createElement('p');
  p.textContent = text;
  container.appendChild(p);
  return p;
}

function addList(container, items) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const ul = document.createElement('ul');
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    ul.appendChild(li);
  });
  container.appendChild(ul);
  return ul;
}

function addDefinitionRow(dl, term, value) {
  const dt = document.createElement('dt');
  dt.textContent = term;
  const dd = document.createElement('dd');
  dd.textContent = value;
  dl.append(dt, dd);
}

// Step 1: pick which Explorer. Names alone aren't sensitive — a parent
// already knows their own children's names — only what's behind the PIN
// (step 2) is gated.
function renderExplorerPicker(root) {
  root.innerHTML = '';
  const section = document.createElement('section');
  section.setAttribute('aria-labelledby', 'gate-heading');
  const heading = document.createElement('h2');
  heading.id = 'gate-heading';
  heading.textContent = 'Parent Mode';
  section.appendChild(heading);
  addParagraph(
    section,
    'This area contains curriculum information, progress details and preparation guidance intended for parents and guardians — not for the Explorer using this device.'
  );
  addParagraph(
    section,
    'Explorer Academy keeps curriculum mapping hidden from the learner experience by design. This page is never linked from anywhere in that experience.'
  );

  const profiles = listProfiles();
  if (profiles.length === 0) {
    addParagraph(
      section,
      'No Explorer profiles exist on this device yet. Create one from the Home page, then come back here.'
    );
    root.appendChild(section);
    return;
  }

  addHeading(section, 3, 'Which Explorer?');
  const list = document.createElement('ul');
  profiles.forEach((profile) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = [profile.avatar, profile.displayName].filter(Boolean).join(' ');
    button.addEventListener('click', () => renderPinGate(root, profile));
    item.appendChild(button);
    list.appendChild(item);
  });
  section.appendChild(list);

  root.appendChild(section);
}

// Step 2: that Explorer's own PIN. Wrong PINs can be retried freely — no
// lockout — since a lockout would create a new "my parent is locked out"
// problem with no backend to reset it against, for a PIN that was only
// ever a deterrent (ADR-025), not real security.
function renderPinGate(root, profile) {
  root.innerHTML = '';
  const section = document.createElement('section');
  section.setAttribute('aria-labelledby', 'pin-heading');
  const heading = document.createElement('h2');
  heading.id = 'pin-heading';
  heading.textContent = `Enter PIN for ${profile.displayName}`;
  section.appendChild(heading);

  const form = document.createElement('form');
  const label = document.createElement('label');
  const labelText = document.createElement('span');
  labelText.textContent = 'PIN';
  const pinInput = document.createElement('input');
  pinInput.type = 'password';
  pinInput.inputMode = 'numeric';
  pinInput.autocomplete = 'off';
  pinInput.required = true;
  label.append(labelText, pinInput);
  form.appendChild(label);

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Unlock';
  form.appendChild(submit);

  const feedback = document.createElement('p');
  feedback.setAttribute('role', 'status');
  form.appendChild(feedback);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const result = await verifyProfilePin(profile.id, pinInput.value);
    if (!result.ok) {
      feedback.textContent = result.errors.join(' ');
      pinInput.value = '';
      pinInput.focus();
      return;
    }
    renderDashboard(root, profile);
  });
  section.appendChild(form);

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.textContent = 'Choose a different Explorer';
  backButton.addEventListener('click', () => renderExplorerPicker(root));
  section.appendChild(backButton);

  root.appendChild(section);
}

// Lets a parent change this specific Explorer's PIN, requiring the
// current one — the only place a PIN can be changed (never from the
// learner-facing Settings page, so a child can't lock a parent out).
function renderChangePinControl(container, childId) {
  const section = document.createElement('section');
  addHeading(section, 2, 'Change PIN');
  addParagraph(section, "This is the only place this Explorer's Parent Mode PIN can be changed.");

  const form = document.createElement('form');

  const currentLabel = document.createElement('label');
  const currentLabelText = document.createElement('span');
  currentLabelText.textContent = 'Current PIN';
  const currentInput = document.createElement('input');
  currentInput.type = 'password';
  currentInput.inputMode = 'numeric';
  currentInput.autocomplete = 'off';
  currentInput.required = true;
  currentLabel.append(currentLabelText, currentInput);
  form.appendChild(currentLabel);

  const newLabel = document.createElement('label');
  const newLabelText = document.createElement('span');
  newLabelText.textContent = 'New PIN (4-8 digits)';
  const newInput = document.createElement('input');
  newInput.type = 'password';
  newInput.inputMode = 'numeric';
  newInput.autocomplete = 'off';
  newInput.required = true;
  newLabel.append(newLabelText, newInput);
  form.appendChild(newLabel);

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Update PIN';
  form.appendChild(submit);

  const feedback = document.createElement('p');
  feedback.setAttribute('role', 'status');
  form.appendChild(feedback);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const result = await changePin(childId, { currentPin: currentInput.value, newPin: newInput.value });
    feedback.textContent = result.ok ? 'PIN updated.' : result.errors.join(' ');
    if (result.ok) form.reset();
  });

  section.appendChild(form);
  container.appendChild(section);
}

function renderCampaignOverview(container, campaign) {
  const section = document.createElement('section');
  addHeading(section, 2, campaign.title);
  addParagraph(section, campaign.subtitle);

  const dl = document.createElement('dl');
  addDefinitionRow(dl, 'Theme', campaign.theme);
  addDefinitionRow(dl, 'Recommended age', campaign.recommendedAge);
  addDefinitionRow(dl, 'Estimated duration', campaign.estimatedDuration);
  addDefinitionRow(dl, 'Difficulty', campaign.difficulty);
  addDefinitionRow(dl, 'Missions', String(campaign.missions.length));
  section.appendChild(dl);

  container.appendChild(section);
}

function renderWelcome(container, orientation) {
  if (!orientation) return;
  const section = document.createElement('section');
  addHeading(section, 2, 'Welcome to Explorer Academy');
  addParagraph(section, orientation.welcome);

  addHeading(section, 3, 'Your Role: Mission Control');
  addParagraph(section, orientation.missionControlRole.summary);
  addList(section, orientation.missionControlRole.responsibilities);
  addParagraph(section, orientation.missionControlRole.guidance);
  addHeading(section, 4, 'Questions that help without giving answers');
  addList(section, orientation.missionControlRole.exampleQuestions);

  container.appendChild(section);
}

function renderSessionAndMaterials(container, orientation) {
  if (!orientation) return;
  const section = document.createElement('section');
  addHeading(section, 2, 'Session Length & Materials');

  const table = document.createElement('table');
  const headRow = document.createElement('tr');
  ['Available time', "What the Explorer experiences"].forEach((label) => {
    const th = document.createElement('th');
    th.textContent = label;
    headRow.appendChild(th);
  });
  table.appendChild(headRow);
  orientation.sessionLength.forEach(({ availableTime, experience }) => {
    const row = document.createElement('tr');
    const timeCell = document.createElement('td');
    timeCell.textContent = availableTime;
    const expCell = document.createElement('td');
    expCell.textContent = experience;
    row.append(timeCell, expCell);
    table.appendChild(row);
  });
  section.appendChild(table);

  addHeading(section, 3, 'Materials');
  addHeading(section, 4, 'Essential');
  addList(section, orientation.materials.essential);
  addHeading(section, 4, 'Useful');
  addList(section, orientation.materials.useful);
  addHeading(section, 4, 'Occasionally used');
  addList(section, orientation.materials.occasionallyUsed);

  addHeading(section, 3, 'Supporting Your Child');
  addHeading(section, 4, 'Helpful');
  addList(section, orientation.supportingYourChild.helpful);
  addHeading(section, 4, 'Avoid');
  addList(section, orientation.supportingYourChild.avoid);

  addHeading(section, 3, 'Assessment Philosophy');
  addParagraph(section, orientation.assessmentPhilosophy);

  container.appendChild(section);
}

function renderCurriculumMapping(container, curriculum) {
  const section = document.createElement('section');
  addHeading(section, 2, 'Curriculum Mapping');

  if (!Array.isArray(curriculum) || curriculum.length === 0) {
    addParagraph(section, 'Curriculum mapping is not available for this campaign.');
    container.appendChild(section);
    return;
  }

  curriculum.forEach((entry) => {
    const article = document.createElement('article');
    addHeading(article, 3, entry.subject);
    addParagraph(article, `${entry.curriculum} (${entry.country}) — ${entry.strand}`);
    addList(article, entry.outcomes);
    section.appendChild(article);
  });

  container.appendChild(section);
}

function renderProgressDashboard(container, campaign, earnedRewards, discoveryLog, catalogs) {
  const section = document.createElement('section');
  addHeading(section, 2, 'Progress Dashboard');

  const missionsWithRewards = new Set(earnedRewards.map((reward) => reward.missionId));
  const missionsWithReflections = new Set(discoveryLog.map((entry) => entry.missionId));
  const missionsWithProgress = new Set([...missionsWithRewards, ...missionsWithReflections]);
  const totalMissions = campaign.missions.length;

  const summary = document.createElement('dl');
  addDefinitionRow(summary, 'Missions with recorded progress', `${missionsWithProgress.size} of ${totalMissions}`);
  addDefinitionRow(summary, 'Discovery Log entries recorded', String(discoveryLog.length));
  addDefinitionRow(summary, 'Rewards earned', String(earnedRewards.length));
  section.appendChild(summary);

  if (earnedRewards.length > 0) {
    addHeading(section, 3, 'Earned rewards');
    const sorted = [...earnedRewards].sort((a, b) => new Date(a.earnedAt) - new Date(b.earnedAt));
    addList(
      section,
      sorted.map((reward) => {
        const details = resolveRewardDetails(reward, catalogs);
        const title = details?.title ?? reward.value;
        const base = `${title} (${reward.type}) — ${reward.missionId}, earned ${new Date(reward.earnedAt).toLocaleDateString()}`;
        return details?.description ? `${base}. ${details.description}` : base;
      })
    );
  } else {
    addParagraph(section, 'No rewards earned yet — progress will appear here once the Explorer completes a reflection.');
  }

  container.appendChild(section);
}

function renderMissionGuidance(container, { mission, slug, enrichment, curriculumById, discoveryEntriesForMission }) {
  const details = document.createElement('details');
  const summary = document.createElement('summary');
  summary.textContent = `Mission ${mission.missionNumber}: ${mission.title}`;
  details.appendChild(summary);

  const parentGuide = mission.parentGuide;

  addHeading(details, 4, 'Learning objectives (hidden from the Explorer)');
  addList(details, parentGuide.learningObjectives);

  addHeading(details, 4, 'Preparation');
  addParagraph(details, parentGuide.preparation);

  addHeading(details, 4, 'Discussion points');
  addList(details, parentGuide.discussionPoints);

  addHeading(details, 4, 'Assessment guidance');
  addParagraph(details, parentGuide.assessment);

  addHeading(details, 4, 'Assessment evidence');
  if (discoveryEntriesForMission.length > 0) {
    addList(
      details,
      discoveryEntriesForMission.map(
        (entry) => `"${entry.prompt}" — ${entry.learnerNotes} (recorded ${new Date(entry.timestamp).toLocaleString()})`
      )
    );
  } else {
    addParagraph(details, 'No Discovery Log entries recorded for this mission yet.');
  }

  const extensionIdeas = [];
  if (enrichment && Array.isArray(enrichment.stretchQuestions)) {
    extensionIdeas.push(...enrichment.stretchQuestions);
  }
  const embeddedExtension = mission.activities.find((activity) => activity.schedulerCategory === 'extension');
  if (embeddedExtension) {
    extensionIdeas.push(`${embeddedExtension.title}: ${embeddedExtension.instructions}`);
  }
  if (extensionIdeas.length > 0) {
    addHeading(details, 4, 'Extension ideas');
    addList(details, extensionIdeas);
  }

  if (enrichment) {
    if (Array.isArray(enrichment.expectedMisconceptions) && enrichment.expectedMisconceptions.length > 0) {
      addHeading(details, 4, 'Suggested interventions (common misconceptions)');
      addList(details, enrichment.expectedMisconceptions);
    }

    if (enrichment.estimatedSupervision) {
      addHeading(details, 4, 'Estimated supervision');
      addParagraph(details, enrichment.estimatedSupervision);
    }

    if (Array.isArray(enrichment.curriculumRefs) && enrichment.curriculumRefs.length > 0) {
      const subjects = enrichment.curriculumRefs.map((id) => curriculumById.get(id)?.subject).filter(Boolean);
      if (subjects.length > 0) {
        addHeading(details, 4, 'Curriculum subjects covered');
        addList(details, subjects);
      }
    }
  }

  container.appendChild(details);
}

async function renderDashboard(root, profile) {
  root.innerHTML = '<p data-status>Loading Parent Mode…</p>';

  const campaignResult = await loadCampaign(CAMPAIGN_ID);
  if (!campaignResult.ok) {
    root.innerHTML = '';
    const section = document.createElement('section');
    addHeading(section, 2, 'Parent Mode');
    addParagraph(section, 'Could not load campaign data.');
    addList(section, campaignResult.errors);
    root.appendChild(section);
    return;
  }
  const campaign = campaignResult.campaign;

  const [orientationResult, curriculumResult, coresResult, ranksResult] = await Promise.all([
    fetchJson(`campaigns/${CAMPAIGN_ID}/src/parent/orientation.json`),
    fetchJson(`campaigns/${CAMPAIGN_ID}/src/parent/curriculum-mapping.json`),
    fetchJson(`campaigns/${CAMPAIGN_ID}/src/world/knowledge-cores.json`),
    fetchJson(`campaigns/${CAMPAIGN_ID}/src/world/ranks.json`)
  ]);
  const orientation = orientationResult.ok ? orientationResult.data : null;
  const curriculum = curriculumResult.ok && Array.isArray(curriculumResult.data) ? curriculumResult.data : [];
  const curriculumById = new Map(curriculum.map((entry) => [entry.id, entry]));
  const rewardCatalogs = {
    knowledgeCores: coresResult.ok ? coresResult.data : [],
    ranks: ranksResult.ok ? ranksResult.data : []
  };

  const earnedRewards = getEarnedRewards(profile.id);
  const discoveryLog = getDiscoveryLog(profile.id);

  const slugs = campaign.missions.map((_, index) => missionSlug(index + 1));
  const [missionResults, enrichmentResults] = await Promise.all([
    Promise.all(slugs.map((slug) => loadMission(CAMPAIGN_ID, slug))),
    Promise.all(slugs.map((slug) => fetchJson(`campaigns/${CAMPAIGN_ID}/generated/parent/enrichment/${slug}.json`)))
  ]);

  root.innerHTML = '';

  const viewingBar = document.createElement('p');
  const viewingLabel = document.createElement('span');
  viewingLabel.textContent = `Viewing: ${[profile.avatar, profile.displayName].filter(Boolean).join(' ')} — `;
  const switchButton = document.createElement('button');
  switchButton.type = 'button';
  switchButton.textContent = 'Choose a different Explorer';
  switchButton.addEventListener('click', () => renderExplorerPicker(root));
  viewingBar.append(viewingLabel, switchButton);
  root.appendChild(viewingBar);

  renderCampaignOverview(root, campaign);
  renderWelcome(root, orientation);
  renderSessionAndMaterials(root, orientation);
  renderCurriculumMapping(root, curriculum);
  renderProgressDashboard(root, campaign, earnedRewards, discoveryLog, rewardCatalogs);

  const missionsSection = document.createElement('section');
  addHeading(missionsSection, 2, 'Mission-by-Mission Guidance');
  addParagraph(
    missionsSection,
    "Expand a mission for preparation notes, discussion points, assessment guidance and the Explorer's own recorded evidence."
  );

  slugs.forEach((slug, index) => {
    const missionResult = missionResults[index];
    if (!missionResult.ok) return; // fail gracefully — skip missions that don't load rather than breaking the whole dashboard

    const enrichmentResult = enrichmentResults[index];
    const enrichment = enrichmentResult.ok ? enrichmentResult.data : null;
    const discoveryEntriesForMission = discoveryLog.filter((entry) => entry.missionId === slug);

    renderMissionGuidance(missionsSection, {
      mission: missionResult.mission,
      slug,
      enrichment,
      curriculumById,
      discoveryEntriesForMission
    });
  });

  root.appendChild(missionsSection);

  renderChangePinControl(root, profile.id);
}

function init() {
  const root = document.getElementById('parent-app');
  if (!root) return;
  registerServiceWorker();
  renderExplorerPicker(root);
}

document.addEventListener('DOMContentLoaded', init);
