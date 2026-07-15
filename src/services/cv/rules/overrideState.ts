/**
 * CV rule overrides — PURE in-process state (no DB import).
 * ─────────────────────────────────────────────────────────────────────────
 * Split out from overrides.ts so the (pure) bullet linter — and the linter
 * eval that gates CI — can read the current override snapshot WITHOUT dragging
 * in prisma/config/env. Importing the DB layer at eval time crashed CI (no
 * `.env` → env.ts split-on-undefined at module load). The DB-backed loader in
 * overrides.ts pushes fresh snapshots here via `applyOverrideCache`.
 */
export interface RuleOverrides {
  strongVerbs: string[];
  weakVerbs: string[];
  bannedOpeners: string[];
  buzzwords: string[];
}

export const EMPTY_OVERRIDES: RuleOverrides = { strongVerbs: [], weakVerbs: [], bannedOpeners: [], buzzwords: [] };

/** Normalize arbitrary JSON into a safe, bounded override set. Additive only. */
export function sanitizeOverrides(raw: unknown): RuleOverrides {
  const o = (raw ?? {}) as Partial<Record<keyof RuleOverrides, unknown>>;
  const list = (v: unknown) => (Array.isArray(v) ? v.map((x) => String(x).trim().toLowerCase()).filter((x) => x && x.length <= 60).slice(0, 300) : []);
  return { strongVerbs: list(o.strongVerbs), weakVerbs: list(o.weakVerbs), bannedOpeners: list(o.bannedOpeners), buzzwords: list(o.buzzwords) };
}

let cache: RuleOverrides = EMPTY_OVERRIDES;
let cacheAt = 0;

/** Synchronous snapshot for the (pure) bullet linter. Defaults to baseline-only. */
export function currentOverrides(): RuleOverrides {
  return cache;
}

/** Internal — the DB loader publishes a fresh snapshot here. */
export function applyOverrideCache(next: RuleOverrides, at: number): void {
  cache = next;
  cacheAt = at;
}
export function overrideCacheAt(): number {
  return cacheAt;
}
export function invalidateOverrideCache(): void {
  cacheAt = 0;
}
