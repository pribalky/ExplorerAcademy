// settings.js — Settings Manager.
//
// Currently manages one preference: the parent-selected session duration
// that drives scheduler.js's Core/Extension/Rabbit Hole assembly (ADR-009,
// Adjustable Daily Duration). Explorer profile, accessibility, audio and
// offline preferences from 601_HTML_ARCHITECTURE.md's Settings page are
// not implemented yet.

import { loadSettings, saveSettings } from './storage.js';

// Matches 504_JSON_SCHEMA.md's Session Configuration "Supported Durations".
export const SUPPORTED_SESSION_DURATIONS = [30, 45, 60, 90];
export const DEFAULT_SESSION_DURATION = 60;

export function getSessionDuration() {
  const { sessionDurationMinutes } = loadSettings();
  return SUPPORTED_SESSION_DURATIONS.includes(sessionDurationMinutes)
    ? sessionDurationMinutes
    : DEFAULT_SESSION_DURATION;
}

export function setSessionDuration(minutes) {
  if (!SUPPORTED_SESSION_DURATIONS.includes(minutes)) {
    return { ok: false, errors: [`${minutes} is not a supported session duration.`] };
  }
  saveSettings({ sessionDurationMinutes: minutes });
  return { ok: true };
}
