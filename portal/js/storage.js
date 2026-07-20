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
// implemented so far: currentSession, enough to make "Continue Mission"
// durable across a reload. explorerProfile, completedMissions,
// completedActivities, discoveryLog and settings are not implemented yet.

const STORAGE_KEY = 'explorerAcademy.save';
const STORAGE_VERSION = 1;

function defaultSave() {
  return {
    version: STORAGE_VERSION,
    timestamp: null,
    currentSession: null
  };
}

function readSave() {
  let raw;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
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

function writeSave(save) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  } catch (storageError) {
    console.warn('Storage Manager: could not persist save.', storageError);
  }
}

export function saveCurrentSession(session) {
  const save = readSave();
  save.currentSession = session;
  save.timestamp = new Date().toISOString();
  writeSave(save);
}

export function loadCurrentSession() {
  return readSave().currentSession;
}
