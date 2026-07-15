/**
 * CV Builder — admin-editable rule overrides (W6).
 * ─────────────────────────────────────────────────────────────────────────
 * The spec wants the verb/phrase dictionaries editable WITHOUT a deploy. The
 * curated lists in lexicon.ts stay the reviewed baseline (and what the eval
 * gates); admins can APPEND to them via /admin/cv/rules. Overrides live in the
 * existing app_settings key/value table (no migration) and are cached for 60s
 * in-process. Additive only — an override can extend a list, never remove a
 * baseline entry, so a bad edit can't silently disable the linter.
 */
import { prisma } from '../../../config/database.js';

export interface RuleOverrides {
  strongVerbs: string[];
  weakVerbs: string[];
  bannedOpeners: string[];
  buzzwords: string[];
}

const KEY = 'cv_rules_overrides';
const EMPTY: RuleOverrides = { strongVerbs: [], weakVerbs: [], bannedOpeners: [], buzzwords: [] };

// In-process cache — one DB read per minute per instance, and lintBullet stays
// synchronous (it reads the last loaded snapshot).
let cache: RuleOverrides = EMPTY;
let cacheAt = 0;
const TTL_MS = 60_000;

function sanitize(raw: unknown): RuleOverrides {
  const o = (raw ?? {}) as Partial<Record<keyof RuleOverrides, unknown>>;
  const list = (v: unknown) => (Array.isArray(v) ? v.map((x) => String(x).trim().toLowerCase()).filter((x) => x && x.length <= 60).slice(0, 300) : []);
  return { strongVerbs: list(o.strongVerbs), weakVerbs: list(o.weakVerbs), bannedOpeners: list(o.bannedOpeners), buzzwords: list(o.buzzwords) };
}

/** Refresh the snapshot from app_settings (call before a lint run). */
export async function loadRuleOverrides(): Promise<RuleOverrides> {
  if (Date.now() - cacheAt < TTL_MS) return cache;
  try {
    const row = await prisma.appSetting.findUnique({ where: { key: KEY } });
    cache = row?.value ? sanitize(JSON.parse(row.value)) : EMPTY;
  } catch {
    cache = EMPTY; // unreadable JSON → baseline only, never crash a lint
  }
  cacheAt = Date.now();
  return cache;
}

/** Synchronous snapshot for the (pure) bullet linter. */
export function currentOverrides(): RuleOverrides {
  return cache;
}

/** Admin: read + write. Writing refreshes the snapshot immediately. */
export async function getRuleOverrides(): Promise<RuleOverrides> {
  cacheAt = 0;
  return loadRuleOverrides();
}
export async function setRuleOverrides(raw: unknown): Promise<RuleOverrides> {
  const clean = sanitize(raw);
  await prisma.appSetting.upsert({
    where: { key: KEY },
    update: { value: JSON.stringify(clean) },
    create: { key: KEY, value: JSON.stringify(clean) },
  });
  cache = clean;
  cacheAt = Date.now();
  return clean;
}
