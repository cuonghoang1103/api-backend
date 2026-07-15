/**
 * CV Builder — master profile service (Phase 1).
 * ─────────────────────────────────────────────────────────────────────────
 * The CvProfile is the user's MASTER career record — one per user, the single
 * source of truth. Individual tailored CVs (CvDocument, later phases) are just
 * curated views of it. This service is the structured-editor backend: contact,
 * summary, preferences, items (jobs/projects/education/…), their bullets, plus
 * skills, certifications and language proficiencies.
 *
 * Conventions (match the Interview module):
 *  - `userId` is a plain Int with NO FK to User. Every read/write is scoped by
 *    userId so a user can never touch another user's data (IDOR guard). We use
 *    nested `where` filters (`profile: { userId }`, `item: { profile: { userId } }`)
 *    so ownership is enforced in the query itself, not a second round-trip.
 *  - No AI here. This phase only proves a user can enter their career history
 *    cleanly and it persists.
 */
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../middleware/errorHandler.js';
import type {
  CvItemKind,
  CvEmploymentType,
  CvSkillCategory,
  CvBulletStrength,
  CvExperienceLevel,
  Prisma,
} from '@prisma/client';

// ─── Validation schemas ──────────────────────────────────────────────────
const ITEM_KINDS = [
  'EXPERIENCE', 'PROJECT', 'EDUCATION', 'OPEN_SOURCE', 'PUBLICATION', 'AWARD', 'VOLUNTEER',
] as const;
const EMPLOYMENT_TYPES = [
  'FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'VOLUNTEER',
] as const;
const SKILL_CATEGORIES = [
  'LANGUAGE', 'FRAMEWORK', 'DATABASE', 'INFRA', 'TOOL', 'PRACTICE', 'SOFT',
] as const;
const BULLET_STRENGTHS = ['WEAK', 'OK', 'STRONG'] as const;
const EXPERIENCE_LEVELS = ['STUDENT', 'FRESHER', 'JUNIOR', 'MID', 'SENIOR', 'LEAD'] as const;

// A datetime that also accepts a bare date string, an empty string, or null →
// normalized to Date | null. CV dates are commonly month-precision.
const optDate = z
  .union([z.string(), z.null()])
  .optional()
  .transform((v) => {
    if (v == null || v === '') return null;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  });

const str = (max: number) => z.string().trim().max(max);
const optStr = (max: number) =>
  z.union([z.string(), z.null()]).optional().transform((v) => {
    if (v == null) return null;
    const s = String(v).trim();
    return s === '' ? null : s.slice(0, max);
  });

export const updateProfileSchema = z.object({
  fullName: optStr(150),
  headline: optStr(200),
  email: optStr(150),
  phone: optStr(40),
  location: optStr(150),
  links: z.record(z.string()).optional(),
  dateOfBirth: optDate,
  summary: optStr(8000),
  targetRoles: z.array(z.string().trim().max(120)).max(20).optional(),
  seniority: z.enum(EXPERIENCE_LEVELS).nullable().optional(),
  locationsPref: z.array(z.string().trim().max(120)).max(20).optional(),
  remotePref: optStr(20),
});

export const itemSchema = z.object({
  kind: z.enum(ITEM_KINDS),
  title: str(250).min(1, 'title bắt buộc'),
  organization: optStr(250),
  location: optStr(150),
  employmentType: z.enum(EMPLOYMENT_TYPES).nullable().optional(),
  startDate: optDate,
  endDate: optDate,
  isCurrent: z.boolean().optional(),
  url: optStr(500),
  techStack: z.array(z.string().trim().max(60)).max(60).optional(),
  context: optStr(4000),
  gpa: optStr(20),
  sortOrder: z.number().int().optional(),
});
export const itemUpdateSchema = itemSchema.partial();

export const bulletSchema = z.object({
  text: str(2000).min(1, 'text bắt buộc'),
  userStatedFacts: optStr(4000),
  skillsEvidenced: z.array(z.string().trim().max(60)).max(40).optional(),
  strength: z.enum(BULLET_STRENGTHS).optional(),
  sortOrder: z.number().int().optional(),
});
export const bulletUpdateSchema = bulletSchema.partial();

export const skillSchema = z.object({
  name: str(100).min(1, 'name bắt buộc'),
  category: z.enum(SKILL_CATEGORIES).optional(),
  proficiency: optStr(30),
  yearsUsed: z.number().nonnegative().max(80).nullable().optional(),
  sortOrder: z.number().int().optional(),
});
export const skillUpdateSchema = skillSchema.partial();

export const certSchema = z.object({
  name: str(200).min(1, 'name bắt buộc'),
  issuer: optStr(200),
  issueDate: optDate,
  expiryDate: optDate,
  credentialId: optStr(150),
  url: optStr(500),
  sortOrder: z.number().int().optional(),
});
export const certUpdateSchema = certSchema.partial();

export const langSchema = z.object({
  language: str(60).min(1, 'language bắt buộc'),
  proficiency: optStr(60),
  certName: optStr(60),
  certScore: optStr(40),
  sortOrder: z.number().int().optional(),
});
export const langUpdateSchema = langSchema.partial();

// ─── Profile ─────────────────────────────────────────────────────────────
const fullInclude = {
  items: { orderBy: [{ kind: 'asc' }, { sortOrder: 'asc' }, { startDate: 'desc' }] as const,
    include: { bullets: { orderBy: { sortOrder: 'asc' } as const } } },
  skills: { orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }] as const },
  certifications: { orderBy: { sortOrder: 'asc' } as const },
  languageSkills: { orderBy: { sortOrder: 'asc' } as const },
} satisfies Prisma.CvProfileInclude;

/** Get the user's master profile, creating an empty one on first access. */
export async function getOrCreateProfile(userId: number) {
  const existing = await prisma.cvProfile.findUnique({
    where: { userId },
    include: fullInclude,
  });
  if (existing) return existing;
  // upsert (not create) so two concurrent first-access requests can't collide
  // on the unique userId — the second one no-ops instead of throwing P2002.
  await prisma.cvProfile.upsert({ where: { userId }, update: {}, create: { userId } });
  // Re-read with includes so the shape is identical to the found path.
  return prisma.cvProfile.findUniqueOrThrow({ where: { userId }, include: fullInclude });
}

/** Internal: resolve the profile id for a user, creating it if needed. */
async function profileIdFor(userId: number): Promise<number> {
  const p = await prisma.cvProfile.upsert({
    where: { userId },
    update: {},
    create: { userId },
    select: { id: true },
  });
  return p.id;
}

export async function updateProfile(userId: number, body: unknown) {
  const data = updateProfileSchema.parse(body);
  await profileIdFor(userId);
  await prisma.cvProfile.update({
    where: { userId },
    data: {
      ...(data.fullName !== undefined ? { fullName: data.fullName } : {}),
      ...(data.headline !== undefined ? { headline: data.headline } : {}),
      ...(data.email !== undefined ? { email: data.email } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.location !== undefined ? { location: data.location } : {}),
      ...(data.links !== undefined ? { links: data.links as Prisma.InputJsonValue } : {}),
      ...(data.dateOfBirth !== undefined ? { dateOfBirth: data.dateOfBirth } : {}),
      ...(data.summary !== undefined ? { summary: data.summary } : {}),
      ...(data.targetRoles !== undefined ? { targetRoles: data.targetRoles } : {}),
      ...(data.seniority !== undefined ? { seniority: data.seniority as CvExperienceLevel | null } : {}),
      ...(data.locationsPref !== undefined ? { locationsPref: data.locationsPref } : {}),
      ...(data.remotePref !== undefined ? { remotePref: data.remotePref } : {}),
    },
  });
  return getOrCreateProfile(userId);
}

// ─── Items (experience / project / education / …) ────────────────────────
export async function createItem(userId: number, body: unknown) {
  const data = itemSchema.parse(body);
  const profileId = await profileIdFor(userId);
  return prisma.cvItem.create({
    data: {
      profileId,
      kind: data.kind as CvItemKind,
      title: data.title,
      organization: data.organization ?? null,
      location: data.location ?? null,
      employmentType: (data.employmentType ?? null) as CvEmploymentType | null,
      startDate: data.startDate ?? null,
      endDate: data.endDate ?? null,
      isCurrent: data.isCurrent ?? false,
      url: data.url ?? null,
      techStack: data.techStack ?? [],
      context: data.context ?? null,
      gpa: data.gpa ?? null,
      sortOrder: data.sortOrder ?? 0,
    },
    include: { bullets: true },
  });
}

/** Verify the item belongs to this user, or throw 404. */
async function assertItemOwned(userId: number, itemId: number): Promise<void> {
  const owned = await prisma.cvItem.findFirst({
    where: { id: itemId, profile: { userId } },
    select: { id: true },
  });
  if (!owned) throw new NotFoundError('Không tìm thấy mục CV');
}

export async function updateItem(userId: number, itemId: number, body: unknown) {
  const data = itemUpdateSchema.parse(body);
  await assertItemOwned(userId, itemId);
  return prisma.cvItem.update({
    where: { id: itemId },
    data: {
      ...(data.kind !== undefined ? { kind: data.kind as CvItemKind } : {}),
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.organization !== undefined ? { organization: data.organization } : {}),
      ...(data.location !== undefined ? { location: data.location } : {}),
      ...(data.employmentType !== undefined ? { employmentType: data.employmentType as CvEmploymentType | null } : {}),
      ...(data.startDate !== undefined ? { startDate: data.startDate } : {}),
      ...(data.endDate !== undefined ? { endDate: data.endDate } : {}),
      ...(data.isCurrent !== undefined ? { isCurrent: data.isCurrent } : {}),
      ...(data.url !== undefined ? { url: data.url } : {}),
      ...(data.techStack !== undefined ? { techStack: data.techStack } : {}),
      ...(data.context !== undefined ? { context: data.context } : {}),
      ...(data.gpa !== undefined ? { gpa: data.gpa } : {}),
      ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
    },
    include: { bullets: { orderBy: { sortOrder: 'asc' } } },
  });
}

export async function deleteItem(userId: number, itemId: number) {
  await assertItemOwned(userId, itemId);
  await prisma.cvItem.delete({ where: { id: itemId } }); // bullets cascade
  return { id: itemId };
}

// ─── Bullets ─────────────────────────────────────────────────────────────
async function assertBulletOwned(userId: number, bulletId: number): Promise<void> {
  const owned = await prisma.cvBullet.findFirst({
    where: { id: bulletId, item: { profile: { userId } } },
    select: { id: true },
  });
  if (!owned) throw new NotFoundError('Không tìm thấy dòng thành tích');
}

export async function createBullet(userId: number, itemId: number, body: unknown) {
  const data = bulletSchema.parse(body);
  await assertItemOwned(userId, itemId);
  return prisma.cvBullet.create({
    data: {
      itemId,
      text: data.text,
      userStatedFacts: data.userStatedFacts ?? null,
      skillsEvidenced: data.skillsEvidenced ?? [],
      strength: (data.strength ?? 'OK') as CvBulletStrength,
      sortOrder: data.sortOrder ?? 0,
      // A hand-typed bullet is the user's own words → verified by default.
      // AI-authored bullets (later phases) are created with verified: false.
      verified: true,
      aiGenerated: false,
    },
  });
}

export async function updateBullet(userId: number, bulletId: number, body: unknown) {
  const data = bulletUpdateSchema.parse(body);
  await assertBulletOwned(userId, bulletId);
  return prisma.cvBullet.update({
    where: { id: bulletId },
    data: {
      ...(data.text !== undefined ? { text: data.text } : {}),
      ...(data.userStatedFacts !== undefined ? { userStatedFacts: data.userStatedFacts } : {}),
      ...(data.skillsEvidenced !== undefined ? { skillsEvidenced: data.skillsEvidenced } : {}),
      ...(data.strength !== undefined ? { strength: data.strength as CvBulletStrength } : {}),
      ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
    },
  });
}

export async function verifyBullet(userId: number, bulletId: number, verified: boolean) {
  await assertBulletOwned(userId, bulletId);
  return prisma.cvBullet.update({ where: { id: bulletId }, data: { verified } });
}

export async function deleteBullet(userId: number, bulletId: number) {
  await assertBulletOwned(userId, bulletId);
  await prisma.cvBullet.delete({ where: { id: bulletId } });
  return { id: bulletId };
}

// ─── Skills ──────────────────────────────────────────────────────────────
async function assertProfileChildOwned(
  userId: number,
  model: 'cvSkill' | 'cvCertification' | 'cvLanguageSkill',
  id: number,
): Promise<void> {
  const row = await (prisma[model] as {
    findFirst: (args: unknown) => Promise<{ id: number } | null>;
  }).findFirst({ where: { id, profile: { userId } }, select: { id: true } });
  if (!row) throw new NotFoundError('Không tìm thấy bản ghi');
}

export async function createSkill(userId: number, body: unknown) {
  const data = skillSchema.parse(body);
  const profileId = await profileIdFor(userId);
  return prisma.cvSkill.create({
    data: {
      profileId,
      name: data.name,
      category: (data.category ?? 'TOOL') as CvSkillCategory,
      proficiency: data.proficiency ?? null,
      yearsUsed: data.yearsUsed ?? null,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function updateSkill(userId: number, id: number, body: unknown) {
  const data = skillUpdateSchema.parse(body);
  await assertProfileChildOwned(userId, 'cvSkill', id);
  return prisma.cvSkill.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.category !== undefined ? { category: data.category as CvSkillCategory } : {}),
      ...(data.proficiency !== undefined ? { proficiency: data.proficiency } : {}),
      ...(data.yearsUsed !== undefined ? { yearsUsed: data.yearsUsed } : {}),
      ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
    },
  });
}

export async function deleteSkill(userId: number, id: number) {
  await assertProfileChildOwned(userId, 'cvSkill', id);
  await prisma.cvSkill.delete({ where: { id } });
  return { id };
}

// ─── Certifications ──────────────────────────────────────────────────────
export async function createCert(userId: number, body: unknown) {
  const data = certSchema.parse(body);
  const profileId = await profileIdFor(userId);
  return prisma.cvCertification.create({
    data: {
      profileId,
      name: data.name,
      issuer: data.issuer ?? null,
      issueDate: data.issueDate ?? null,
      expiryDate: data.expiryDate ?? null,
      credentialId: data.credentialId ?? null,
      url: data.url ?? null,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function updateCert(userId: number, id: number, body: unknown) {
  const data = certUpdateSchema.parse(body);
  await assertProfileChildOwned(userId, 'cvCertification', id);
  return prisma.cvCertification.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.issuer !== undefined ? { issuer: data.issuer } : {}),
      ...(data.issueDate !== undefined ? { issueDate: data.issueDate } : {}),
      ...(data.expiryDate !== undefined ? { expiryDate: data.expiryDate } : {}),
      ...(data.credentialId !== undefined ? { credentialId: data.credentialId } : {}),
      ...(data.url !== undefined ? { url: data.url } : {}),
      ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
    },
  });
}

export async function deleteCert(userId: number, id: number) {
  await assertProfileChildOwned(userId, 'cvCertification', id);
  await prisma.cvCertification.delete({ where: { id } });
  return { id };
}

// ─── Language skills ─────────────────────────────────────────────────────
export async function createLang(userId: number, body: unknown) {
  const data = langSchema.parse(body);
  const profileId = await profileIdFor(userId);
  return prisma.cvLanguageSkill.create({
    data: {
      profileId,
      language: data.language,
      proficiency: data.proficiency ?? null,
      certName: data.certName ?? null,
      certScore: data.certScore ?? null,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function updateLang(userId: number, id: number, body: unknown) {
  const data = langUpdateSchema.parse(body);
  await assertProfileChildOwned(userId, 'cvLanguageSkill', id);
  return prisma.cvLanguageSkill.update({
    where: { id },
    data: {
      ...(data.language !== undefined ? { language: data.language } : {}),
      ...(data.proficiency !== undefined ? { proficiency: data.proficiency } : {}),
      ...(data.certName !== undefined ? { certName: data.certName } : {}),
      ...(data.certScore !== undefined ? { certScore: data.certScore } : {}),
      ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
    },
  });
}

export async function deleteLang(userId: number, id: number) {
  await assertProfileChildOwned(userId, 'cvLanguageSkill', id);
  await prisma.cvLanguageSkill.delete({ where: { id } });
  return { id };
}

// ─── Photo (W5 — VN-market templates show a portrait) ────────────────────
// Stored via the shared uploadService (sharp → webp on R2/local). We keep the
// PUBLIC URL in photoR2Key (varchar 300) so both the preview and the PDF
// renderer can fetch it directly; deleteByUrl handles cleanup.
export async function setProfilePhoto(userId: number, file: { buffer: Buffer; originalname: string; mimetype: string; size: number }) {
  const { uploadImage, deleteByUrl } = await import('../../storage/uploadService.js');
  const profile = await prisma.cvProfile.upsert({ where: { userId }, update: {}, create: { userId }, select: { id: true, photoR2Key: true } });
  const result = await uploadImage(
    { buffer: file.buffer, originalName: file.originalname, mimetype: file.mimetype, size: file.size },
    'images/avatar',
    { userId, subPrefix: 'cv' },
  );
  // Best-effort delete of the previous photo (never block the new upload).
  if (profile.photoR2Key) await deleteByUrl(profile.photoR2Key).catch(() => {});
  await prisma.cvProfile.update({ where: { userId }, data: { photoR2Key: result.url } });
  return { photoUrl: result.url };
}

export async function removeProfilePhoto(userId: number) {
  const profile = await prisma.cvProfile.findUnique({ where: { userId }, select: { photoR2Key: true } });
  if (profile?.photoR2Key) {
    const { deleteByUrl } = await import('../../storage/uploadService.js');
    await deleteByUrl(profile.photoR2Key).catch(() => {});
    await prisma.cvProfile.update({ where: { userId }, data: { photoR2Key: null } });
  }
  return { photoUrl: null };
}

// ─── Completeness signal (dashboard) ─────────────────────────────────────
// A cheap, honest score of how filled-in the master record is. Not a quality
// score (that's the rules engine, P3) — just "how much have you entered".
export async function getProfileCompleteness(userId: number) {
  const p = await getOrCreateProfile(userId);
  const documentsCount = await prisma.cvDocument.count({ where: { userId } });
  const checks: Array<{ key: string; label: string; done: boolean }> = [
    { key: 'name', label: 'Họ tên', done: !!p.fullName },
    { key: 'headline', label: 'Chức danh', done: !!p.headline },
    { key: 'contact', label: 'Email / SĐT', done: !!(p.email || p.phone) },
    { key: 'summary', label: 'Tóm tắt', done: !!p.summary },
    { key: 'experience', label: 'Kinh nghiệm/Dự án', done: p.items.some((i) => ['EXPERIENCE', 'PROJECT'].includes(i.kind)) },
    { key: 'bullets', label: 'Có ít nhất 3 dòng thành tích', done: p.items.reduce((n, i) => n + i.bullets.length, 0) >= 3 },
    { key: 'education', label: 'Học vấn', done: p.items.some((i) => i.kind === 'EDUCATION') },
    { key: 'skills', label: 'Kỹ năng', done: p.skills.length > 0 },
  ];
  const doneCount = checks.filter((c) => c.done).length;
  return {
    percent: Math.round((doneCount / checks.length) * 100),
    checks,
    counts: {
      items: p.items.length,
      bullets: p.items.reduce((n, i) => n + i.bullets.length, 0),
      skills: p.skills.length,
      certifications: p.certifications.length,
      languageSkills: p.languageSkills.length,
      documents: documentsCount,
    },
  };
}
