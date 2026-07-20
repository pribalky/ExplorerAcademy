// scheduler.js — Adaptive Scheduler.
//
// Assembles a playable session from a mission's full activity list, given
// a session duration in minutes. Follows the duration-band model in
// docs/60-engineering/601_HTML_ARCHITECTURE.md's Adaptive Scheduler
// section: Core activities are always included, Extension activities are
// added while the remaining time budget allows, and Rabbit Hole
// activities are only included at the 90-minute band (merely "suggested"
// at 60, per that section's Session Assembly examples).
//
// The weighted Session Configuration fields in
// docs/50-content/504_JSON_SCHEMA.md (coreWeight, extensionWeight,
// rabbitHoleWeight) are not implemented — see the reservation note added
// to that document.
//
// Never mutates the activities it's given, and never removes Core
// activities regardless of budget, per that section's Scheduler Rules.

export const DEFAULT_DURATION_MINUTES = 60;

const RABBIT_HOLE_DURATION_THRESHOLD = 90;

function totalDuration(activities) {
  return activities.reduce((sum, activity) => sum + activity.duration, 0);
}

export function scheduleActivities(activities, durationMinutes) {
  const core = activities.filter((activity) => activity.schedulerCategory === 'core');
  const extension = activities.filter((activity) => activity.schedulerCategory === 'extension');
  const rabbitHole = activities.filter((activity) => activity.schedulerCategory === 'rabbitHole');

  const scheduled = [...core];
  let remaining = durationMinutes - totalDuration(core);

  for (const activity of extension) {
    if (activity.duration <= remaining) {
      scheduled.push(activity);
      remaining -= activity.duration;
    }
  }

  if (durationMinutes >= RABBIT_HOLE_DURATION_THRESHOLD) {
    for (const activity of rabbitHole) {
      if (activity.duration <= remaining) {
        scheduled.push(activity);
        remaining -= activity.duration;
      }
    }
  }

  return scheduled;
}
