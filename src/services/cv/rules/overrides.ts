/**
 * CV Builder — admin-editable rule overrides (W6), DB-backed loader.
 * ─────────────────────────────────────────────────────────────────────────
 * The spec wants the verb/phrase dictionaries editable WITHOUT a deploy. The
 * curated lists in lexicon.ts stay the reviewed baseline (and what the eval
 * gates); admins can APPEND to them via /admin/cv/rules. Overrides live in the
 * existing app_settings key/value table (no migration) and are cached for 60s
 * in-process. Additive only — an override can extend a list, never remove a
 * baseline entry, so a bad edit can't silently disable the linter.
 *
 * The PURE snapshot (cache + currentOverrides + sanitize) lives in
 * overrideState.ts so the bullet linter and its CI eval never import prisma.
 */
import { prisma } from '../../../config/database.js';
import {
  type RuleOverrides,
  EMPTY_OVERRIDES,
  sanitizeOverrides,
  currentOverrides,
  applyOverrideCache,
  overrideCacheAt,
  invalidateOverrideCache,
} from './overrideState.js';

export type { RuleOverrides };
export { currentOverrides };

const KEY = 'cv_rules_overrides';
const TTL_MS = 60_000;

/** Refresh the snapshot from app_settings (call before a lint run). */
export async function loadRuleOverrides(): Promise<RuleOverrides> {
  if (Date.now() - overrideCacheAt() < TTL_MS) return currentOverrides();
  let next: RuleOverrides = EMPTY_OVERRIDES;
  try {
    const row = await prisma.appSetting.findUnique({ where: { key: KEY } });
    next = row?.value ? sanitizeOverrides(JSON.parse(row.value)) : EMPTY_OVERRIDES;
  } catch {
    next = EMPTY_OVERRIDES; // unreadable JSON → baseline only, never crash a lint
  }
  applyOverrideCache(next, Date.now());
  return next;
}

/** Admin: read + write. Writing refreshes the snapshot immediately. */
export async function getRuleOverrides(): Promise<RuleOverrides> {
  invalidateOverrideCache();
  return loadRuleOverrides();
}
export async function setRuleOverrides(raw: unknown): Promise<RuleOverrides> {
  const clean = sanitizeOverrides(raw);
  await prisma.appSetting.upsert({
    where: { key: KEY },
    update: { value: JSON.stringify(clean) },
    create: { key: KEY, value: JSON.stringify(clean) },
  });
  applyOverrideCache(clean, Date.now());
  return clean;
}
