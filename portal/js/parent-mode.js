// parent-mode.js — Parent Mode.
//
// Standalone entry point mounted from portal/parent/index.html. It is
// never linked from the learner shell (router.js) or its navigation —
// router.js's own header comment already documents this separation as the
// intended architecture (a distinct static page, not a hash route), per
// ADR-006 (Hidden Parent Mode) and 601_HTML_ARCHITECTURE.md's Parent Mode
// Manager responsibility to "verify parent access."
//
// "Verify parent access" is implemented here as a one-time, session-only
// confirmation click (renderAccessGate), not a PIN: no PIN or access-code
// field exists anywhere in 504_JSON_SCHEMA.md's Save Game shape, and
// adding one would be a storage-schema change beyond this milestone.
// Being a separate, unlinked page is the actual access control; the click
// is a deliberate-intent check for whoever already found this page. It can
// be replaced with a real gate later without changing anything below it.
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
// Progress is derived entirely from the existing save shape (earnedRewards,
// discoveryLog) via reward-engine.js/discovery-log.js's own public
// functions — the same modules router.js already goes through, rather than
// reading storage.js directly. No completedMissions field exists yet (see
// storage.js's own comments), but reward-engine.js already treats "a
// mission's rewards were earned" as the simplest data-consistent signal
// that a mission session is done; the same signal powers the dashboard
// here, combined with which missions have at least one Discovery Log entry.
//
// Curriculum content and learningObjectives are rendered here freely —
// this page is the one place in the platform where that's correct, per
// ADR-006.

import { loadCampaign } from './campaign-loader.js';
import { loadMission } from './mission-engine.js';
import { getDiscoveryLog } from './discovery-log.js';
import { getEarnedRewards } from './reward-engine.js';
import { fetchJson } from './utils.js';

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

function renderAccessGate(root, onConfirm) {
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
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = "I'm a parent or guardian — continue";
  button.addEventListener('click', onConfirm);
  section.appendChild(button);
  root.appendChild(section);
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

function renderProgressDashboard(container, campaign, earnedRewards, discoveryLog) {
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
      sorted.map(
        (reward) =>
          `${reward.value} (${reward.type}) — ${reward.missionId}, earned ${new Date(reward.earnedAt).toLocaleDateString()}`
      )
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

async function renderDashboard(root) {
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

  const [orientationResult, curriculumResult] = await Promise.all([
    fetchJson(`campaigns/${CAMPAIGN_ID}/src/parent/orientation.json`),
    fetchJson(`campaigns/${CAMPAIGN_ID}/src/parent/curriculum-mapping.json`)
  ]);
  const orientation = orientationResult.ok ? orientationResult.data : null;
  const curriculum = curriculumResult.ok && Array.isArray(curriculumResult.data) ? curriculumResult.data : [];
  const curriculumById = new Map(curriculum.map((entry) => [entry.id, entry]));

  const earnedRewards = getEarnedRewards();
  const discoveryLog = getDiscoveryLog();

  const slugs = campaign.missions.map((_, index) => missionSlug(index + 1));
  const [missionResults, enrichmentResults] = await Promise.all([
    Promise.all(slugs.map((slug) => loadMission(CAMPAIGN_ID, slug))),
    Promise.all(slugs.map((slug) => fetchJson(`campaigns/${CAMPAIGN_ID}/generated/parent/enrichment/${slug}.json`)))
  ]);

  root.innerHTML = '';

  renderCampaignOverview(root, campaign);
  renderWelcome(root, orientation);
  renderSessionAndMaterials(root, orientation);
  renderCurriculumMapping(root, curriculum);
  renderProgressDashboard(root, campaign, earnedRewards, discoveryLog);

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
}

function init() {
  const root = document.getElementById('parent-app');
  if (!root) return;
  renderAccessGate(root, () => renderDashboard(root));
}

document.addEventListener('DOMContentLoaded', init);
