// discovery-log.js — Discovery Log Manager.
//
// The learner's cross-campaign field notebook. Reads/writes go through
// storage.js (the only module allowed to touch localStorage directly) —
// this module owns entry creation/validation, not persistence itself.
//
// Entry shape extends the minimal id/prompt/entryType fields in
// docs/50-content/504_JSON_SCHEMA.md's Discovery Log Entry with
// learnerNotes, timestamp, campaignId and missionId — see the extension
// note added to that document. Only entryType "reflection" is produced
// here; the other documented types (drawing, prediction, observation,
// diagram) have no authoring UI yet.

import { appendDiscoveryLogEntry, loadDiscoveryLog } from './storage.js';

let sequence = 0;

function generateId() {
  sequence += 1;
  return `DISCOVERY-${Date.now()}-${sequence}`;
}

export function recordReflection({ prompt, learnerNotes, campaignId, missionId }) {
  const trimmedNotes = (learnerNotes ?? '').trim();

  if (!prompt || !trimmedNotes) {
    return { ok: false, errors: ['A reflection needs both a prompt and a written response.'] };
  }

  const entry = {
    id: generateId(),
    prompt,
    entryType: 'reflection',
    learnerNotes: trimmedNotes,
    timestamp: new Date().toISOString(),
    campaignId,
    missionId
  };

  appendDiscoveryLogEntry(entry);
  return { ok: true, entry };
}

export function getDiscoveryLog() {
  return loadDiscoveryLog();
}
