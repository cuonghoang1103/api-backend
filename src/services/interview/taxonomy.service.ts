/**
 * Interview taxonomy — Domain → Track → Topic → Concept + CompanyProfile.
 * Public read (the setup wizard) + admin CRUD. All reads return only
 * PUBLISHED content to the public; admin sees everything.
 */
import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { cached, invalidateCache, CacheKeys } from '../../utils/cache.js';

const TAXONOMY_TTL = 120; // seconds — taxonomy changes rarely (admin CRUD busts it)

/** Bust the taxonomy cache — called from every taxonomy write. */
export function invalidateTaxonomy(): void {
  void invalidateCache(CacheKeys.interviewTaxonomy);
}

/** Full taxonomy tree for the setup wizard (published only) + company profiles.
 *  Cached in Redis (fail-open, single-flight) — hit on every interview setup load. */
export async function getTaxonomy() {
  return cached(CacheKeys.interviewTaxonomy, TAXONOMY_TTL, fetchTaxonomy);
}

async function fetchTaxonomy() {
  const [domains, companyProfiles] = await Promise.all([
    prisma.interviewDomain.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { sortOrder: 'asc' },
      include: {
        tracks: {
          where: { status: 'PUBLISHED' },
          orderBy: { sortOrder: 'asc' },
          include: {
            topics: {
              where: { status: 'PUBLISHED' },
              orderBy: { sortOrder: 'asc' },
              select: { id: true, slug: true, name: true, nameVi: true, weight: true },
            },
          },
        },
      },
    }),
    prisma.interviewCompanyProfile.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { name: 'asc' },
      select: { id: true, slug: true, name: true, styleDescriptor: true, rigor: true },
    }),
  ]);

  // How many PUBLISHED questions back each track (across its topics) — lets the UI
  // show which positions are usable and cap the question count to what exists.
  const counts = await prisma.interviewQuestion.groupBy({
    by: ['topicId'],
    where: { status: 'PUBLISHED' },
    _count: { _all: true },
  });
  const byTopic = new Map(counts.map((c) => [c.topicId, c._count._all]));
  const domainsWithCounts = domains.map((d) => ({
    ...d,
    tracks: d.tracks.map((t) => ({
      ...t,
      questionCount: t.topics.reduce((s, tp) => s + (byTopic.get(tp.id) ?? 0), 0),
    })),
  }));

  return { domains: domainsWithCounts, companyProfiles };
}

/** How many PUBLISHED questions back each topic/level — powers the admin "bank health" view. */
export async function getBankHealth() {
  const rows = await prisma.interviewQuestion.groupBy({
    by: ['topicId', 'level', 'status'],
    _count: { _all: true },
  });
  return rows.map((r) => ({ topicId: r.topicId, level: r.level, status: r.status, count: r._count._all }));
}

// ─── Admin CRUD (generic, small surface) ─────────────────────────
export async function listDomains() {
  return prisma.interviewDomain.findMany({ orderBy: { sortOrder: 'asc' }, include: { tracks: true } });
}
export async function createDomain(data: { slug: string; name: string; nameVi?: string; description?: string; icon?: string; sortOrder?: number; status?: string }) {
  if (!data.slug || !data.name) throw new BadRequestError('slug và name là bắt buộc');
  const r = await prisma.interviewDomain.create({ data: { ...data, status: (data.status as never) ?? 'PUBLISHED' } });
  invalidateTaxonomy();
  return r;
}
export async function updateDomain(id: number, data: Record<string, unknown>) {
  const r = await prisma.interviewDomain.update({ where: { id }, data: data as never });
  invalidateTaxonomy();
  return r;
}
export async function deleteDomain(id: number) {
  await prisma.interviewDomain.delete({ where: { id } });
  invalidateTaxonomy();
  return { deleted: true };
}

export async function createTrack(data: { domainId: number; slug: string; name: string; nameVi?: string; description?: string; icon?: string; sortOrder?: number; status?: string }) {
  if (!data.domainId || !data.slug || !data.name) throw new BadRequestError('domainId, slug, name là bắt buộc');
  const r = await prisma.interviewTrack.create({ data: { ...data, status: (data.status as never) ?? 'PUBLISHED' } });
  invalidateTaxonomy();
  return r;
}
export async function updateTrack(id: number, data: Record<string, unknown>) {
  const r = await prisma.interviewTrack.update({ where: { id }, data: data as never });
  invalidateTaxonomy();
  return r;
}
export async function deleteTrack(id: number) {
  await prisma.interviewTrack.delete({ where: { id } });
  invalidateTaxonomy();
  return { deleted: true };
}

export async function createTopic(data: { trackId: number; slug: string; name: string; nameVi?: string; weight?: number; sortOrder?: number; status?: string }) {
  if (!data.trackId || !data.slug || !data.name) throw new BadRequestError('trackId, slug, name là bắt buộc');
  const r = await prisma.interviewTopic.create({ data: { ...data, status: (data.status as never) ?? 'PUBLISHED' } });
  invalidateTaxonomy();
  return r;
}
export async function updateTopic(id: number, data: Record<string, unknown>) {
  const r = await prisma.interviewTopic.update({ where: { id }, data: data as never });
  invalidateTaxonomy();
  return r;
}
export async function deleteTopic(id: number) {
  await prisma.interviewTopic.delete({ where: { id } });
  invalidateTaxonomy();
  return { deleted: true };
}

export async function createConcept(data: { topicId: number; slug: string; name: string }) {
  if (!data.topicId || !data.slug || !data.name) throw new BadRequestError('topicId, slug, name là bắt buộc');
  return prisma.interviewConcept.create({ data });
}
export async function listConcepts(topicId?: number) {
  return prisma.interviewConcept.findMany({ where: topicId ? { topicId } : undefined, orderBy: { name: 'asc' } });
}

export async function createCompanyProfile(data: { slug: string; name: string; styleDescriptor: string; rigor?: number; status?: string }) {
  if (!data.slug || !data.name || !data.styleDescriptor) throw new BadRequestError('slug, name, styleDescriptor là bắt buộc');
  const r = await prisma.interviewCompanyProfile.create({ data: { ...data, status: (data.status as never) ?? 'PUBLISHED' } });
  invalidateTaxonomy();
  return r;
}
export async function updateCompanyProfile(id: number, data: Record<string, unknown>) {
  const r = await prisma.interviewCompanyProfile.update({ where: { id }, data: data as never });
  invalidateTaxonomy();
  return r;
}

/** Resolve a track by id, throwing a friendly 404 — used by the session planner. */
export async function requireTrack(trackId: number) {
  const track = await prisma.interviewTrack.findUnique({ where: { id: trackId } });
  if (!track || track.status === 'ARCHIVED') throw new NotFoundError('Track không tồn tại');
  return track;
}
