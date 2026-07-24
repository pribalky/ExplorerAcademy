// explorer-profiles.js — Explorer Profile management (Milestone 11).
//
// Lets multiple named children share one device, each with their own
// PIN-protected identity and their own save (via storage.js's per-child
// keying). This module owns validation, PIN hashing/verification, streak
// calculation and the legacy-save migration path; storage.js owns every
// actual localStorage read/write, per its own "only module allowed to
// touch browser storage directly" rule.
//
// PIN hashing uses the browser's built-in Web Crypto API (SHA-256) — no
// new dependency — but this is a deterrent, not real security: this app
// has no backend, so anyone with devtools access to the same
// browser/device (which the child necessarily has) could still inspect
// or clear localStorage directly. There is deliberately no PIN-recovery
// flow for the same reason — forgetting a PIN means resetting that
// child's profile. See docs/00-foundation/006_DESIGN_DECISION_LOG.md,
// ADR-024 (supersedes ADR-013).
//
// Nothing in this module is wired into the UI yet — Home, Settings and
// Parent Mode are later Milestone 11 steps. Until a profile is created
// and made active, the platform behaves exactly as it did before this
// module existed (storage.js's legacy-key fallback).

import {
  loadProfiles,
  saveProfiles,
  getActiveChildId,
  setActiveChildId,
  hasLegacySave,
  migrateLegacySaveTo,
  clearLegacySave,
  exportSave,
  importSave
} from './storage.js';

const PIN_PATTERN = /^\d{4,8}$/;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

async function hashPin(pin) {
  const encoder = new TextEncoder();
  const digest = await window.crypto.subtle.digest('SHA-256', encoder.encode(pin));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function generateProfileId() {
  if (window.crypto?.randomUUID) {
    return `explorer-${window.crypto.randomUUID()}`;
  }
  return `explorer-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function localDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isNameTaken(profiles, trimmedName, excludingChildId) {
  return profiles.some(
    (profile) =>
      profile.id !== excludingChildId && profile.displayName.trim().toLowerCase() === trimmedName.toLowerCase()
  );
}

export function listProfiles() {
  return loadProfiles();
}

export function findProfile(childId) {
  return loadProfiles().find((profile) => profile.id === childId) ?? null;
}

export function getActiveChild() {
  const childId = getActiveChildId();
  return childId ? findProfile(childId) : null;
}

export function selectActiveChild(childId) {
  setActiveChildId(childId);
}

export async function createProfile({ displayName, avatar = null, pin }) {
  const trimmedName = typeof displayName === 'string' ? displayName.trim() : '';
  if (!trimmedName) {
    return { ok: false, errors: ['Enter an Explorer name.'] };
  }
  if (!PIN_PATTERN.test(pin ?? '')) {
    return { ok: false, errors: ['PIN must be 4-8 digits.'] };
  }

  const profiles = loadProfiles();
  if (isNameTaken(profiles, trimmedName)) {
    return { ok: false, errors: [`"${trimmedName}" is already in use. Choose a different name.`] };
  }

  const profile = {
    id: generateProfileId(),
    displayName: trimmedName,
    avatar,
    pinHash: await hashPin(pin),
    createdAt: new Date().toISOString(),
    lastPlayedAt: null,
    streak: { count: 0, lastPlayedDate: null }
  };

  saveProfiles([...profiles, profile]);
  return { ok: true, profile };
}

export async function verifyProfilePin(childId, pin) {
  const profile = findProfile(childId);
  if (!profile) {
    return { ok: false, errors: ['Explorer not found.'] };
  }
  const candidateHash = await hashPin(pin ?? '');
  if (candidateHash !== profile.pinHash) {
    return { ok: false, errors: ['Incorrect PIN.'] };
  }
  return { ok: true, profile };
}

export function updateProfile(childId, { displayName, avatar } = {}) {
  const profiles = loadProfiles();
  const index = profiles.findIndex((profile) => profile.id === childId);
  if (index === -1) {
    return { ok: false, errors: ['Explorer not found.'] };
  }

  const updated = { ...profiles[index] };

  if (displayName !== undefined) {
    const trimmedName = displayName.trim();
    if (!trimmedName) {
      return { ok: false, errors: ['Enter an Explorer name.'] };
    }
    if (isNameTaken(profiles, trimmedName, childId)) {
      return { ok: false, errors: [`"${trimmedName}" is already in use. Choose a different name.`] };
    }
    updated.displayName = trimmedName;
  }

  if (avatar !== undefined) {
    updated.avatar = avatar;
  }

  profiles[index] = updated;
  saveProfiles(profiles);
  return { ok: true, profile: updated };
}

export async function changePin(childId, { currentPin, newPin }) {
  const verification = await verifyProfilePin(childId, currentPin);
  if (!verification.ok) {
    return verification;
  }
  if (!PIN_PATTERN.test(newPin ?? '')) {
    return { ok: false, errors: ['New PIN must be 4-8 digits.'] };
  }

  const profiles = loadProfiles();
  const index = profiles.findIndex((profile) => profile.id === childId);
  profiles[index] = { ...profiles[index], pinHash: await hashPin(newPin) };
  saveProfiles(profiles);
  return { ok: true };
}

export function deleteProfile(childId) {
  const profiles = loadProfiles();
  const remaining = profiles.filter((profile) => profile.id !== childId);
  if (remaining.length === profiles.length) {
    return { ok: false, errors: ['Explorer not found.'] };
  }
  saveProfiles(remaining);
  if (getActiveChildId() === childId) {
    setActiveChildId(null);
  }
  // The child's own keyed save is deliberately left in localStorage
  // rather than deleted here — storage.js doesn't expose a generic
  // "delete this child's save" primitive yet, and silently losing a
  // save on a simple rename-driven delete/recreate would be worse than
  // leaving an orphaned key behind. Revisit if this becomes a real need.
  return { ok: true };
}

// Streak is "consecutive calendar days played," tracked on the profile
// rather than inside any single save, since it's a fact about the child
// across missions/campaigns, not campaign progress. Not run
// automatically — callers (Home page, a later Milestone 11 step) decide
// when a "play session" has genuinely started.
export function touchLastPlayed(childId) {
  const profiles = loadProfiles();
  const index = profiles.findIndex((profile) => profile.id === childId);
  if (index === -1) {
    return { ok: false, errors: ['Explorer not found.'] };
  }

  const profile = profiles[index];
  const now = new Date();
  const today = localDateString(now);
  const yesterday = localDateString(new Date(now.getTime() - ONE_DAY_MS));
  const previousDate = profile.streak?.lastPlayedDate ?? null;

  let count = profile.streak?.count ?? 0;
  if (previousDate === today) {
    // already recorded today - leave the streak count unchanged
  } else if (previousDate === yesterday) {
    count += 1;
  } else {
    count = 1;
  }

  profiles[index] = {
    ...profile,
    lastPlayedAt: now.toISOString(),
    streak: { count, lastPlayedDate: today }
  };
  saveProfiles(profiles);
  return { ok: true, profile: profiles[index] };
}

// --- Legacy single-save migration ---

export function hasUnmigratedLegacySave() {
  return hasLegacySave() && loadProfiles().length === 0;
}

export async function createProfileFromLegacySave({ displayName, avatar, pin }) {
  const result = await createProfile({ displayName, avatar, pin });
  if (!result.ok) {
    return result;
  }
  migrateLegacySaveTo(result.profile.id);
  clearLegacySave();
  return result;
}

// --- Save export/import (ADR-028) ---
//
// A manual, parent-initiated file transfer for moving one Explorer to
// another device (or keeping a backup) — not the automatic cross-device
// sync that ADR-026 excludes from this architecture. The exported file
// carries the PIN's hash, never the PIN itself, so the same PIN keeps
// working on the new device without ever writing the plaintext PIN to
// disk. Importing always mints a fresh local id rather than reusing the
// file's id, so two devices can never collide on the same profile id.

export const EXPORT_FORMAT_VERSION = 1;

export function exportProfile(childId) {
  const profile = findProfile(childId);
  if (!profile) {
    return { ok: false, errors: ['Explorer not found.'] };
  }
  return {
    ok: true,
    data: {
      exportFormatVersion: EXPORT_FORMAT_VERSION,
      exportedAt: new Date().toISOString(),
      profile: {
        displayName: profile.displayName,
        avatar: profile.avatar,
        pinHash: profile.pinHash,
        createdAt: profile.createdAt,
        lastPlayedAt: profile.lastPlayedAt,
        streak: profile.streak
      },
      save: exportSave(childId)
    }
  };
}

export function importProfile(exportedData) {
  if (!exportedData || exportedData.exportFormatVersion !== EXPORT_FORMAT_VERSION) {
    return { ok: false, errors: ['This file is not a recognised Explorer Academy export.'] };
  }
  const importedProfile = exportedData.profile;
  if (!importedProfile || typeof importedProfile.displayName !== 'string' || !importedProfile.displayName.trim()) {
    return { ok: false, errors: ['This file is missing Explorer profile data.'] };
  }
  if (typeof importedProfile.pinHash !== 'string' || !importedProfile.pinHash) {
    return { ok: false, errors: ['This file is missing PIN data.'] };
  }

  const trimmedName = importedProfile.displayName.trim();
  const profiles = loadProfiles();
  if (isNameTaken(profiles, trimmedName)) {
    return {
      ok: false,
      errors: [`"${trimmedName}" already exists on this device. Rename or remove the existing Explorer first.`]
    };
  }

  const newProfile = {
    id: generateProfileId(),
    displayName: trimmedName,
    avatar: importedProfile.avatar ?? null,
    pinHash: importedProfile.pinHash,
    createdAt: importedProfile.createdAt ?? new Date().toISOString(),
    lastPlayedAt: importedProfile.lastPlayedAt ?? null,
    streak: importedProfile.streak ?? { count: 0, lastPlayedDate: null }
  };

  saveProfiles([...profiles, newProfile]);
  importSave(newProfile.id, exportedData.save ?? {});
  return { ok: true, profile: newProfile };
}
