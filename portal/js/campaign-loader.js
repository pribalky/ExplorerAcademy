// campaign-loader.js — Loads and validates a campaign package.
//
// This module is the boundary between platform code and campaign content:
// nothing else should fetch campaign JSON directly. Required fields follow
// the Campaign schema in docs/50-content/504_JSON_SCHEMA.md, the canonical
// JSON contract. Mission/activity content itself is not loaded here — that
// belongs to the Mission Engine in a later milestone; the Campaign Loader
// only loads and validates campaign-level metadata.

const REQUIRED_CAMPAIGN_FIELDS = [
  'id',
  'version',
  'title',
  'subtitle',
  'theme',
  'recommendedAge',
  'estimatedDuration',
  'difficulty',
  'author',
  'status',
  'worldBibleId',
  'missions',
  'completionCriteria'
];

function validateCampaign(data) {
  const errors = [];

  for (const field of REQUIRED_CAMPAIGN_FIELDS) {
    if (data[field] === undefined || data[field] === null) {
      errors.push(`Missing required field: "${field}"`);
    }
  }

  if (data.missions !== undefined && !Array.isArray(data.missions)) {
    errors.push('"missions" must be an array');
  }

  return { valid: errors.length === 0, errors };
}

export async function loadCampaign(campaignId) {
  const path = `campaigns/${campaignId}/src/campaign.json`;

  let response;
  try {
    response = await fetch(path);
  } catch (networkError) {
    console.warn(`Campaign Loader: could not reach "${path}".`, networkError);
    return { ok: false, errors: [`Could not load campaign "${campaignId}".`] };
  }

  if (!response.ok) {
    console.warn(`Campaign Loader: "${path}" responded with ${response.status}.`);
    return { ok: false, errors: [`Campaign "${campaignId}" was not found.`] };
  }

  let data;
  try {
    data = await response.json();
  } catch (parseError) {
    console.warn(`Campaign Loader: "${path}" is not valid JSON.`, parseError);
    return { ok: false, errors: [`Campaign "${campaignId}" data is corrupted.`] };
  }

  const { valid, errors } = validateCampaign(data);
  if (!valid) {
    console.warn(`Campaign Loader: "${path}" failed validation.`, errors);
    return { ok: false, errors };
  }

  return { ok: true, campaign: data };
}
