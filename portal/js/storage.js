// storage.js — Storage Manager.
//
// The only module allowed to touch browser storage directly; every other
// module goes through this API. Follows the non-throwing pattern already
// used by campaign-loader.js/mission-engine.js: storage failures, missing
// saves and corrupted saves all degrade to a safe default rather than
// throwing, per 601_HTML_ARCHITECTURE.md's Corrupted Save Data / Storage
// Failure sections ("the platform should fail safely rather than
// crashing").
//
// Only a thin slice of the full Save Game shape (504_JSON_SCHEMA.md) is
// implemented so far: currentSession (Milestone: Save State),
// discoveryLog (Milestone: Discovery Log), earnedRewards (Milestone:
// Reward Engine) and settings (Milestone: Settings Manager) — enough to
// make "Continue Mission", recorded reflections, earned rewards and the
// preferred session duration all durable across a reload.
// completedMissions and completedActivities are not implemented yet.
//
// Each of these fields was added additively on top of the previous
// milestone's shape — readSave()'s `{ ...defaultSave(), ...data }` merge
// means an older save still loads correctly, with any field it predates
// simply defaulting to []. No STORAGE_VERSION bump has been needed yet.
//
// Milestone 11 (Multi-Child Explorer Profiles) adds a save *per child*
// instead of one single implicit save, plus a separate Explorer Profiles
// registry (identity/avatar/PIN — see explorer-profiles.js, which is the
// only other module that touches the profile-related keys below, again
// through this file). Every save-reading/writing function here now takes
// an optional trailing `childId`, defaulting to whichever child is
// currently active. Until a profile is ever created and made active,
// `childId` stays undefined/null and every function falls back to the
// original single `explorerAcademy.save` key — so existing behaviour is
// completely unchanged for as long as no profile UI has been wired up
// yet (Home/Settings/Parent Mode still need their own Milestone 11 steps).
// This is why Explorer Profile isn't nested inside Save Game the way
// 504_JSON_SCHEMA.md originally described it: a profile can now own many
// saves' worth of identity across time, so it lives in its own registry
// that a save is merely keyed against.

const LEGACY_SAVE_KEY = 'explorerAcademy.save';
const PROFILES_KEY = 'explorerAcademy.profiles';
const ACTIVE_CHILD_KEY = 'explorerAcademy.activeChildId';
const STORAGE_VERSION = 1;

function defaultSave() {
  return {
    version: STORAGE_VERSION,
    timestamp: null,
    currentSession: null,
    discoveryLog: [],
    earnedRewards: [],
    settings: {}
  };
}

function saveKeyFor(childId) {
  return childId ? `explorerAcademy.save.${childId}` : LEGACY_SAVE_KEY;
}

function readSave(childId) {
  const key = saveKeyFor(childId);
  let raw;
  try {
    raw = window.localStorage.getItem(key);
  } catch (storageError) {
    console.warn('Storage Manager: localStorage is unavailable.', storageError);
    return defaultSave();
  }

  if (!raw) {
    return defaultSave();
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (parseError) {
    console.warn('Storage Manager: saved data is corrupted; resetting.', parseError);
    return defaultSave();
  }

  if (!data || typeof data !== 'object' || data.version !== STORAGE_VERSION) {
    console.warn('Storage Manager: save version mismatch or invalid shape; resetting.');
    return defaultSave();
  }

  return { ...defaultSave(), ...data };
}

function writeSave(childId, save) {
  const key = saveKeyFor(childId);
  try {
    window.localStorage.setItem(key, JSON.stringify(save));
  } catch (storageError) {
    console.warn('Storage Manager: could not persist save.', storageError);
  }
}

export function getActiveChildId() {
  try {
    return window.localStorage.getItem(ACTIVE_CHILD_KEY) || null;
  } catch (storageError) {
    return null;
  }
}

export function setActiveChildId(childId) {
  try {
    if (childId) {
      window.localStorage.setItem(ACTIVE_CHILD_KEY, childId);
    } else {
      window.localStorage.removeItem(ACTIVE_CHILD_KEY);
    }
  } catch (storageError) {
    console.warn('Storage Manager: could not persist the active Explorer.', storageError);
  }
}

export function saveCurrentSession(session, childId = getActiveChildId()) {
  const save = readSave(childId);
  save.currentSession = session;
  save.timestamp = new Date().toISOString();
  writeSave(childId, save);
}

export function loadCurrentSession(childId = getActiveChildId()) {
  return readSave(childId).currentSession;
}

export function appendDiscoveryLogEntry(entry, childId = getActiveChildId()) {
  const save = readSave(childId);
  save.discoveryLog = Array.isArray(save.discoveryLog) ? save.discoveryLog : [];
  save.discoveryLog.push(entry);
  save.timestamp = new Date().toISOString();
  writeSave(childId, save);
}

export function loadDiscoveryLog(childId = getActiveChildId()) {
  const save = readSave(childId);
  return Array.isArray(save.discoveryLog) ? save.discoveryLog : [];
}

export function appendEarnedRewards(rewards, childId = getActiveChildId()) {
  const save = readSave(childId);
  save.earnedRewards = Array.isArray(save.earnedRewards) ? save.earnedRewards : [];
  save.earnedRewards.push(...rewards);
  save.timestamp = new Date().toISOString();
  writeSave(childId, save);
}

export function loadEarnedRewards(childId = getActiveChildId()) {
  const save = readSave(childId);
  return Array.isArray(save.earnedRewards) ? save.earnedRewards : [];
}

export function saveSettings(settings, childId = getActiveChildId()) {
  const save = readSave(childId);
  save.settings = { ...(save.settings ?? {}), ...settings };
  save.timestamp = new Date().toISOString();
  writeSave(childId, save);
}

export function loadSettings(childId = getActiveChildId()) {
  const save = readSave(childId);
  return save.settings && typeof save.settings === 'object' ? save.settings : {};
}

// --- Explorer Profiles registry (Milestone 11) ---
//
// A profile (name/avatar/PIN hash/streak) is metadata about *which*
// child saves exist, not part of any single child's save data, so it's
// kept in its own key. explorer-profiles.js contains all the business
// logic (validation, PIN hashing, streak calculation) and is the only
// other module that calls these; storage.js still owns every actual
// localStorage read/write.

function readProfiles() {
  try {
    const raw = window.localStorage.getItem(PROFILES_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (storageError) {
    console.warn('Storage Manager: could not read Explorer profiles.', storageError);
    return [];
  }
}

function writeProfiles(profiles) {
  try {
    window.localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch (storageError) {
    console.warn('Storage Manager: could not persist Explorer profiles.', storageError);
  }
}

export function loadProfiles() {
  return readProfiles();
}

export function saveProfiles(profiles) {
  writeProfiles(profiles);
}

// --- Save export/import (ADR-028) ---
//
// Thin wrappers around the same readSave()/writeSave() every other
// per-child function already uses, so the save shape/version stays
// owned in exactly one place. explorer-profiles.js builds the actual
// downloadable file around exportSave()'s output; it never touches the
// save shape directly.

export function exportSave(childId) {
  return readSave(childId);
}

export function importSave(childId, save) {
  writeSave(childId, { ...defaultSave(), ...(save ?? {}) });
}

// --- Legacy single-save migration (Milestone 11) ---
//
// Before Milestone 11 there was exactly one anonymous save under
// LEGACY_SAVE_KEY. These three functions let explorer-profiles.js detect
// it and move it into a new child's own keyed save, without reaching
// into localStorage itself.

export function hasLegacySave() {
  try {
    return window.localStorage.getItem(LEGACY_SAVE_KEY) !== null;
  } catch (storageError) {
    return false;
  }
}

export function migrateLegacySaveTo(childId) {
  const legacy = readSave(null);
  writeSave(childId, { ...legacy, timestamp: new Date().toISOString() });
}

export function clearLegacySave() {
  try {
    window.localStorage.removeItem(LEGACY_SAVE_KEY);
  } catch (storageError) {
    console.warn('Storage Manager: could not clear the legacy save.', storageError);
  }
}
