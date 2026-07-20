// mission-engine.js — Loads and validates mission content.
//
// Follows the same non-throwing load pattern as campaign-loader.js: this
// is the boundary for mission JSON. Required fields follow the Mission,
// Mission Beat, Activity and Reward schemas in
// docs/50-content/504_JSON_SCHEMA.md, the canonical JSON contract.
//
// "storyChapter" is validated as present but not resolved to an actual
// chapter file — no World Bible/Chapter content exists yet (campaign01's
// world/ folder is still empty), so there is nothing to resolve against.
// This mirrors how campaign-loader.js treats "worldBibleId".
//
// Mission lifecycle behaviour (advancing activities, unlocking rewards,
// triggering reflection, completion) is a later milestone; this module
// only loads and validates.

const REQUIRED_MISSION_FIELDS = [
  'id',
  'campaignId',
  'missionNumber',
  'title',
  'storyChapter',
  'estimatedTime',
  'difficulty',
  'beats',
  'activities',
  'rewards',
  'reflection',
  'completionCriteria'
];

const REQUIRED_BEAT_TYPES = [
  'HOOK',
  'MYSTERY',
  'INVESTIGATION',
  'DISCOVERY',
  'CHALLENGE',
  'BREAKTHROUGH',
  'REFLECTION',
  'CLIFFHANGER'
];

const REQUIRED_ACTIVITY_FIELDS = [
  'id',
  'missionId',
  'title',
  'type',
  'category',
  'duration',
  'difficulty',
  'storyContext',
  'instructions',
  'output',
  'schedulerCategory'
];

const REQUIRED_REWARD_FIELDS = ['id', 'type', 'value'];

function missingFields(object, requiredFields) {
  return requiredFields.filter((field) => object[field] === undefined || object[field] === null);
}

function validateBeats(beats, errors) {
  if (!Array.isArray(beats)) {
    errors.push('"beats" must be an array');
    return;
  }

  const presentTypes = new Set(beats.map((beat) => beat.type));
  REQUIRED_BEAT_TYPES.forEach((type) => {
    if (!presentTypes.has(type)) {
      errors.push(`Missing mission beat: "${type}"`);
    }
  });
}

function validateActivities(activities, errors) {
  if (!Array.isArray(activities)) {
    errors.push('"activities" must be an array');
    return;
  }

  activities.forEach((activity, index) => {
    missingFields(activity, REQUIRED_ACTIVITY_FIELDS).forEach((field) => {
      errors.push(`activities[${index}] missing required field: "${field}"`);
    });
  });
}

function validateRewards(rewards, errors) {
  if (!Array.isArray(rewards)) {
    errors.push('"rewards" must be an array');
    return;
  }

  rewards.forEach((reward, index) => {
    missingFields(reward, REQUIRED_REWARD_FIELDS).forEach((field) => {
      errors.push(`rewards[${index}] missing required field: "${field}"`);
    });
  });
}

function validateMission(data) {
  const errors = missingFields(data, REQUIRED_MISSION_FIELDS).map(
    (field) => `Missing required field: "${field}"`
  );

  if (data.beats !== undefined) validateBeats(data.beats, errors);
  if (data.activities !== undefined) validateActivities(data.activities, errors);
  if (data.rewards !== undefined) validateRewards(data.rewards, errors);

  return { valid: errors.length === 0, errors };
}

export async function loadMission(campaignId, missionId) {
  const path = `campaigns/${campaignId}/src/missions/${missionId}.json`;

  let response;
  try {
    response = await fetch(path);
  } catch (networkError) {
    console.warn(`Mission Engine: could not reach "${path}".`, networkError);
    return { ok: false, errors: [`Could not load mission "${missionId}".`] };
  }

  if (!response.ok) {
    console.warn(`Mission Engine: "${path}" responded with ${response.status}.`);
    return { ok: false, errors: [`Mission "${missionId}" was not found.`] };
  }

  let data;
  try {
    data = await response.json();
  } catch (parseError) {
    console.warn(`Mission Engine: "${path}" is not valid JSON.`, parseError);
    return { ok: false, errors: [`Mission "${missionId}" data is corrupted.`] };
  }

  const { valid, errors } = validateMission(data);
  if (!valid) {
    console.warn(`Mission Engine: "${path}" failed validation.`, errors);
    return { ok: false, errors };
  }

  return { ok: true, mission: data };
}
