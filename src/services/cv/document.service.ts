/**
 * CV Builder — tailored documents (Phase 11.2).
 * ─────────────────────────────────────────────────────────────────────────
 * A CvDocument is a specific, tailored CV derived from the master profile: a
 * SELECTION of which items/skills to include, plus a template, market, language
 * and level. A user keeps many ("Backend @ KMS", "Remote SRE — US"). Rendering,
 * linting and export all run over the FILTERED subset, reusing the same engines
 * as the master profile.
 */
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../middleware/errorHandler.js';
import { getOrCreateProfile } from './profile.service.js';
import { lintCv } from './rules/documentLinter.js';
import { profileToLintInput, persistBulletStrengths } from './lint.service.js';
import { loadRuleOverrides } from './rules/overrides.js';
import { exportCvData, type ExportFormat, type ExportResult } from './export.service.js';
import type { CvMarket, CvLevel } from './rules/conventions.js';

type FullProfile = Awaited<ReturnType<typeof getOrCreateProfile>>;
interface IncludedIds { items?: number[]; skills?: number[] }

/** Filter the master profile down to a document's selection. Empty selection =
 *  include everything (a fresh document shows the whole profile until curated). */
function filterProfile(profile: FullProfile, inc: IncludedIds): FullProfile {
  const items = inc.items?.length ? profile.items.filter((i) => inc.items!.includes(i.id)) : profile.items;
  const skills = inc.skills?.length ? profile.skills.filter((s) => inc.skills!.includes(s.id)) : profile.skills;
  return { ...profile, items, skills };
}

const LEVELS = ['STUDENT', 'FRESHER', 'JUNIOR', 'MID', 'SENIOR', 'LEAD'];

const upsertSchema = z.object({
  name: z.string().trim().min(1).max(150).optional(),
  market: z.enum(['VN', 'INTERNATIONAL']).optional(),
  language: z.enum(['VI', 'EN']).optional(),
  experienceLevel: z.enum(['STUDENT', 'FRESHER', 'JUNIOR', 'MID', 'SENIOR', 'LEAD']).optional(),
  cvType: z.enum(['INDUSTRY', 'ACADEMIC', 'GOVERNMENT']).optional(),
  templateKey: z.enum(['ats', 'technical', 'vietnam', 'senior']).optional(),
  includedItemIds: z.object({ items: z.array(z.number().int()).optional(), skills: z.array(z.number().int()).optional() }).optional(),
  pageTarget: z.number().int().min(1).max(4).optional(),
  outcomeLabel: z.string().trim().max(200).nullable().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
  targetJobId: z.number().int().nullable().optional(),
});

export async function createDocument(userId: number, body: unknown) {
  const data = upsertSchema.parse(body);
  const profile = await getOrCreateProfile(userId);
  const level = (LEVELS.includes(profile.seniority as string) ? profile.seniority : 'MID') as CvLevel;
  return prisma.cvDocument.create({
    data: {
      profileId: profile.id,
      userId,
      name: data.name ?? 'CV mới',
      market: data.market ?? 'VN',
      language: data.language ?? 'VI',
      experienceLevel: data.experienceLevel ?? level,
      cvType: data.cvType ?? 'INDUSTRY',
      templateKey: data.templateKey ?? 'ats',
      includedItemIds: (data.includedItemIds ?? {}) as object,
      targetJobId: data.targetJobId ?? null,
    },
  });
}

export async function listDocuments(userId: number) {
  return prisma.cvDocument.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, name: true, market: true, language: true, templateKey: true, status: true, outcomeLabel: true, updatedAt: true },
  });
}

async function owned(userId: number, id: number) {
  const doc = await prisma.cvDocument.findFirst({ where: { id, userId } });
  if (!doc) throw new NotFoundError('Không tìm thấy CV');
  return doc;
}

export async function getDocument(userId: number, id: number) {
  await owned(userId, id);
  return prisma.cvDocument.findUnique({
    where: { id },
    include: { reviews: { orderBy: { createdAt: 'desc' }, take: 10 } },
  });
}

export async function updateDocument(userId: number, id: number, body: unknown) {
  const data = upsertSchema.parse(body);
  await owned(userId, id);
  return prisma.cvDocument.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.market !== undefined ? { market: data.market } : {}),
      ...(data.language !== undefined ? { language: data.language } : {}),
      ...(data.experienceLevel !== undefined ? { experienceLevel: data.experienceLevel } : {}),
      ...(data.cvType !== undefined ? { cvType: data.cvType } : {}),
      ...(data.templateKey !== undefined ? { templateKey: data.templateKey } : {}),
      ...(data.includedItemIds !== undefined ? { includedItemIds: data.includedItemIds as object } : {}),
      ...(data.pageTarget !== undefined ? { pageTarget: data.pageTarget } : {}),
      ...(data.outcomeLabel !== undefined ? { outcomeLabel: data.outcomeLabel } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.targetJobId !== undefined ? { targetJobId: data.targetJobId } : {}),
    },
  });
}

export async function deleteDocument(userId: number, id: number) {
  await owned(userId, id);
  await prisma.cvDocument.delete({ where: { id } });
  return { id };
}

export async function duplicateDocument(userId: number, id: number) {
  const doc = await owned(userId, id);
  return prisma.cvDocument.create({
    data: {
      profileId: doc.profileId, userId, name: `${doc.name} (bản sao)`,
      market: doc.market, language: doc.language, experienceLevel: doc.experienceLevel, cvType: doc.cvType,
      templateKey: doc.templateKey, includedItemIds: doc.includedItemIds as object, targetJobId: doc.targetJobId,
    },
  });
}

/** Lint a document's filtered subset and SAVE the result as a CvReview (history). */
export async function lintDocument(userId: number, id: number) {
  await loadRuleOverrides(); // refresh admin dictionary overrides (cached 60s)
  const doc = await owned(userId, id);
  const profile = await getOrCreateProfile(userId);
  const filtered = filterProfile(profile, (doc.includedItemIds ?? {}) as IncludedIds);
  const result = lintCv(profileToLintInput(filtered, doc.market as CvMarket, doc.experienceLevel as CvLevel));
  await persistBulletStrengths(result.bulletVerdicts);

  await prisma.cvReview.create({
    data: {
      documentId: id, userId, mode: 'STATIC',
      verdict: result.band, score: result.score,
      sixSecondTest: result.sixSecondTest,
      issues: result.issues as object, strengths: result.strengths as object,
      keywordGaps: result.skillGaps as object,
      jobTargetId: doc.targetJobId,
    },
  });
  return { documentId: id, market: doc.market, level: doc.experienceLevel, ...result };
}

export async function exportDocument(userId: number, id: number, format: ExportFormat): Promise<ExportResult> {
  const doc = await owned(userId, id);
  const profile = await getOrCreateProfile(userId);
  const filtered = filterProfile(profile, (doc.includedItemIds ?? {}) as IncludedIds);
  return exportCvData(userId, filtered, format, { template: doc.templateKey ?? 'ats', market: doc.market, language: doc.language, photoUrl: profile.photoR2Key });
}
