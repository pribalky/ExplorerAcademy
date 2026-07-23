// settings.js — Settings Manager.
//
// Manages two preferences, both per-child since storage.js's saveSettings/
// loadSettings already scope to the active Explorer (Milestone 11): the
// parent-selected session duration that drives scheduler.js's
// Core/Extension/Rabbit Hole assembly (ADR-009, Adjustable Daily
// Duration), and accessibility preferences (font scale, high contrast,
// reduced motion) from 601_HTML_ARCHITECTURE.md's Settings page
// responsibilities. Explorer profile identity (name/avatar/PIN) is
// deliberately not managed here — see explorer-profiles.js and ADR-025;
// audio and offline preferences remain unimplemented.
//
// applyAccessibilityPreferences() is this module's one piece of DOM
// interaction: it toggles classes on <html> that base.css/themes.css
// style. It's called at app bootstrap (app.js) and whenever the active
// Explorer changes or updates their preferences (router.js), so switching
// between two children's differing preferences takes effect immediately.

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

export const FONT_SCALES = ['normal', 'large', 'x-large'];
const DEFAULT_ACCESSIBILITY = { fontScale: 'normal', highContrast: false, reducedMotion: false };

export function getAccessibilityPreferences() {
  const { accessibility } = loadSettings();
  return { ...DEFAULT_ACCESSIBILITY, ...(accessibility ?? {}) };
}

export function setAccessibilityPreferences(preferences) {
  const next = { ...getAccessibilityPreferences(), ...preferences };
  if (!FONT_SCALES.includes(next.fontScale)) {
    return { ok: false, errors: [`${next.fontScale} is not a supported font scale.`] };
  }
  saveSettings({ accessibility: next });
  return { ok: true };
}

export function applyAccessibilityPreferences(preferences = getAccessibilityPreferences()) {
  const root = document.documentElement;
  root.classList.remove('a11y-font-large', 'a11y-font-x-large');
  if (preferences.fontScale === 'large') root.classList.add('a11y-font-large');
  if (preferences.fontScale === 'x-large') root.classList.add('a11y-font-x-large');
  root.classList.toggle('a11y-high-contrast', Boolean(preferences.highContrast));
  root.classList.toggle('a11y-reduced-motion', Boolean(preferences.reducedMotion));
}
