/**
 * CV Builder — STATIC lint service (Phase 3).
 * Maps the master profile into the linter's input shape, runs the deterministic
 * rules engine, and persists the computed per-bullet strength so the editor can
 * show an inline indicator. No LLM, no cost — this is the free tier.
 *
 * Lints the MASTER PROFILE for now (the whole record as "the CV"); once tailored
 * CvDocuments exist, the same lintCv() runs over the selected subset.
 */
import { prisma } from '../../config/database.js';
import { getOrCreateProfile } from './profile.service.js';
import { lintCv, type LintInput } from './rules/documentLinter.js';
import { loadRuleOverrides } from './rules/overrides.js';
import type { CvMarket, CvLevel } from './rules/conventions.js';

const MARKETS: CvMarket[] = ['VN', 'INTERNATIONAL'];
const LEVELS: CvLevel[] = ['STUDENT', 'FRESHER', 'JUNIOR', 'MID', 'SENIOR', 'LEAD'];

// Loosely typed profile-with-includes so a document's FILTERED subset can be
// linted through the same path as the master profile.
type LintProfileLike = Awaited<ReturnType<typeof getOrCreateProfile>>;

/** Map a profile (full or filtered) into the linter's input shape. */
export function profileToLintInput(profile: LintProfileLike, market: CvMarket, level: CvLevel): LintInput {
  const links = (profile.links ?? {}) as Record<string, string>;
  return {
    market,
    level,
    contact: {
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      links: { github: links.github, linkedin: links.linkedin, portfolio: links.portfolio, website: links.website },
      hasPhoto: !!profile.photoR2Key,
      dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.toISOString() : null,
    },
    summary: profile.summary,
    items: profile.items.map((it) => ({
      id: it.id,
      kind: it.kind,
      title: it.title,
      organization: it.organization,
      startDate: it.startDate ? it.startDate.toISOString() : null,
      endDate: it.endDate ? it.endDate.toISOString() : null,
      isCurrent: it.isCurrent,
      url: it.url,
      techStack: it.techStack,
      bullets: it.bullets.map((b) => ({ id: b.id, text: b.text })),
    })),
    skills: profile.skills.map((s) => ({ name: s.name })),
  };
}

/** Persist computed per-bullet strengths (batched). */
export async function persistBulletStrengths(verdicts: { bulletId: number; strength: string }[]) {
  const byStrength: Record<string, number[]> = { WEAK: [], OK: [], STRONG: [] };
  for (const v of verdicts) byStrength[v.strength]?.push(v.bulletId);
  await Promise.all(
    Object.entries(byStrength)
      .filter(([, ids]) => ids.length > 0)
      .map(([strength, ids]) =>
        prisma.cvBullet.updateMany({ where: { id: { in: ids } }, data: { strength: strength as 'WEAK' | 'OK' | 'STRONG' } }),
      ),
  );
}

export async function lintProfile(userId: number, opts?: { market?: string; level?: string }) {
  await loadRuleOverrides(); // refresh admin dictionary overrides (cached 60s)
  const profile = await getOrCreateProfile(userId);
  const market: CvMarket = MARKETS.includes(opts?.market as CvMarket) ? (opts!.market as CvMarket) : 'VN';
  const level: CvLevel = LEVELS.includes(opts?.level as CvLevel)
    ? (opts!.level as CvLevel)
    : (LEVELS.includes(profile.seniority as CvLevel) ? (profile.seniority as CvLevel) : 'MID');

  const result = lintCv(profileToLintInput(profile, market, level));
  await persistBulletStrengths(result.bulletVerdicts);
  return { market, level, ...result };
}
