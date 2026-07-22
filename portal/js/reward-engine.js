// reward-engine.js — Reward Engine.
//
// Evaluates a mission's rewards[] (already loaded and validated by
// mission-engine.js, per its required id/type/value fields from
// docs/50-content/504_JSON_SCHEMA.md) and persists earned ones via
// storage.js. The Reward Engine interprets reward *definitions*; it
// never invents or hardcodes campaign-specific reward content.
//
// Rewards are evaluated once per mission, not once per reflection prompt:
// completing any reflection for a mission unlocks that mission's full
// rewards[] the first time, and evaluateMissionRewards() is idempotent
// on repeat calls (checked against what's already recorded). No
// unlockCondition field exists in the Reward schema to drive a
// finer-grained trigger — 504_JSON_SCHEMA.md only requires id/type/value
// — so "reflection completed" is the simplest data-consistent signal
// that a mission session is done.
//
// Per ADR-007 (Curiosity Before Completion), this is acknowledgement,
// not scoring — there is no points/ranking logic here.

import { appendEarnedRewards, loadEarnedRewards } from './storage.js';

export function evaluateMissionRewards({ campaignId, missionId, rewards }) {
  if (!Array.isArray(rewards) || rewards.length === 0) {
    return { ok: true, newlyEarned: [] };
  }

  const alreadyEarned = loadEarnedRewards();
  const alreadyEarnedForMission = alreadyEarned.some((entry) => entry.missionId === missionId);

  if (alreadyEarnedForMission) {
    return { ok: true, newlyEarned: [] };
  }

  const earnedAt = new Date().toISOString();
  const newlyEarned = rewards.map((reward) => ({ ...reward, campaignId, missionId, earnedAt }));

  appendEarnedRewards(newlyEarned);
  return { ok: true, newlyEarned };
}

export function getEarnedRewards() {
  return loadEarnedRewards();
}

// Resolves a knowledgeCore/rank reward's optional coreId/rankId against
// campaign-supplied catalogs (portal/campaigns/campaign01/src/world/
// knowledge-cores.json, ranks.json) into display metadata — closing the
// gap where 503_DATA_MODEL.md/504_JSON_SCHEMA.md define Knowledge Core and
// Explorer Rank as entities with their own description/icon, but reward
// objects previously carried only an inline display string. Catalogs are
// passed in rather than fetched here, keeping this module free of network
// concerns; callers that already load campaign data (router.js,
// parent-mode.js) supply them. Returns null for reward types with no
// catalog (badge, unlock, story, collectible) or when the reference
// doesn't resolve, so callers can fall back to the plain reward.value.
export function resolveRewardDetails(reward, { knowledgeCores = [], ranks = [] } = {}) {
  if (reward.type === 'knowledgeCore' && reward.coreId) {
    const core = knowledgeCores.find((entry) => entry.id === reward.coreId);
    return core ? { title: core.name, description: core.description, icon: core.icon } : null;
  }

  if (reward.type === 'rank' && reward.rankId) {
    const rank = ranks.find((entry) => entry.id === reward.rankId);
    return rank ? { title: rank.title, description: rank.description, icon: rank.icon } : null;
  }

  return null;
}
