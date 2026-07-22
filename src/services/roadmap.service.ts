/**
 * RoadMap service — standalone roadmap.sh-style learning paths (Role / Skill).
 *
 * Public read (list + detail) + per-user manual "done" toggle + an idempotent
 * seeder for the 8 flagship roadmaps. Fully additive.
 */
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { NotFoundError } from '../middleware/errorHandler.js';
import { ROADMAP_SEED } from './roadmap.seed.js';

export interface ResourceItem { type: string; title: string; url: string; premium?: boolean; }
export interface RoadmapNodeDto {
  id: number; stage: number; stageLabel: string; order: number; side: string; kind: string;
  title: string; subtitle: string | null; icon: string | null; description: string | null;
  linkType: string | null; linkRef: string | null; resources: ResourceItem[] | null;
}
export interface RoadmapStageDto { stage: number; stageLabel: string; nodes: RoadmapNodeDto[]; }
export interface RoadmapListItem {
  slug: string; title: string; type: string; description: string | null;
  icon: string | null; color: string | null; nodeCount: number;
}
export interface RoadmapDetailDto {
  slug: string; title: string; type: string; description: string | null; icon: string | null; color: string | null;
  stages: RoadmapStageDto[]; doneNodeIds: number[]; total: number;
}

function nodeDto(n: {
  id: number; stage: number; stageLabel: string; order: number; side: string; kind: string;
  title: string; subtitle: string | null; icon: string | null; description: string | null;
  linkType: string | null; linkRef: string | null; resources: unknown;
}): RoadmapNodeDto {
  return { id: n.id, stage: n.stage, stageLabel: n.stageLabel, order: n.order, side: n.side, kind: n.kind,
    title: n.title, subtitle: n.subtitle, icon: n.icon, description: n.description, linkType: n.linkType, linkRef: n.linkRef,
    resources: Array.isArray(n.resources) ? (n.resources as ResourceItem[]) : null };
}

/** Public: all published roadmaps grouped by type (role / skill), with node counts. */
export async function listRoadmaps(): Promise<{ role: RoadmapListItem[]; skill: RoadmapListItem[] }> {
  const rows = await prisma.roadmap.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ type: 'asc' }, { sortOrder: 'asc' }, { title: 'asc' }],
    select: { slug: true, title: true, type: true, description: true, icon: true, color: true, _count: { select: { nodes: true } } },
  });
  const map = (r: (typeof rows)[number]): RoadmapListItem => ({
    slug: r.slug, title: r.title, type: r.type, description: r.description, icon: r.icon, color: r.color, nodeCount: r._count.nodes,
  });
  return {
    role: rows.filter((r) => r.type === 'role').map(map),
    skill: rows.filter((r) => r.type === 'skill').map(map),
  };
}

/** Public: full roadmap by slug, grouped into stages (+ the user's done set). */
export async function getRoadmap(slug: string, userId?: number): Promise<RoadmapDetailDto> {
  const roadmap = await prisma.roadmap.findUnique({
    where: { slug: String(slug || '').trim() },
    select: { id: true, slug: true, title: true, type: true, description: true, icon: true, color: true },
  });
  if (!roadmap) throw new NotFoundError('Không tìm thấy lộ trình.');

  const nodes = await prisma.roadmapNode.findMany({
    where: { roadmapId: roadmap.id },
    orderBy: [{ stage: 'asc' }, { order: 'asc' }],
  });

  const stages: RoadmapStageDto[] = [];
  for (const n of nodes) {
    let s = stages.find((x) => x.stage === n.stage);
    if (!s) { s = { stage: n.stage, stageLabel: n.stageLabel, nodes: [] }; stages.push(s); }
    s.nodes.push(nodeDto(n));
  }

  let doneNodeIds: number[] = [];
  if (userId) {
    const done = await prisma.roadmapDone.findMany({
      where: { userId, node: { roadmapId: roadmap.id } },
      select: { nodeId: true },
    });
    doneNodeIds = done.map((d) => d.nodeId);
  }

  return {
    slug: roadmap.slug, title: roadmap.title, type: roadmap.type, description: roadmap.description,
    icon: roadmap.icon, color: roadmap.color, stages, doneNodeIds, total: nodes.length,
  };
}

/** Toggle a node's completion for the current user. */
export async function toggleDone(userId: number, nodeId: number): Promise<{ nodeId: number; done: boolean }> {
  const node = await prisma.roadmapNode.findUnique({ where: { id: nodeId }, select: { id: true } });
  if (!node) throw new NotFoundError('Không tìm thấy mục.');
  const existing = await prisma.roadmapDone.findUnique({ where: { userId_nodeId: { userId, nodeId } } });
  if (existing) {
    await prisma.roadmapDone.delete({ where: { id: existing.id } });
    return { nodeId, done: false };
  }
  await prisma.roadmapDone.create({ data: { userId, nodeId } });
  return { nodeId, done: true };
}

/** Idempotent seeder for the 8 flagship roadmaps. `force` rebuilds nodes. */
export async function seedRoadmaps(opts: { force?: boolean } = {}): Promise<Array<{ slug: string; created: number; skipped: boolean }>> {
  const out: Array<{ slug: string; created: number; skipped: boolean }> = [];
  for (let ri = 0; ri < ROADMAP_SEED.length; ri++) {
    const rm = ROADMAP_SEED[ri];
    const existing = await prisma.roadmap.findUnique({ where: { slug: rm.slug }, select: { id: true } });
    if (existing && !opts.force) { out.push({ slug: rm.slug, created: 0, skipped: true }); continue; }

    const roadmap = existing
      ? (await prisma.roadmap.update({
          where: { id: existing.id },
          data: { title: rm.title, type: rm.type, description: rm.description, icon: rm.icon, color: rm.color, sortOrder: ri },
          select: { id: true },
        }))
      : (await prisma.roadmap.create({
          data: { slug: rm.slug, title: rm.title, type: rm.type, description: rm.description, icon: rm.icon, color: rm.color, sortOrder: ri },
          select: { id: true },
        }));

    if (existing) await prisma.roadmapNode.deleteMany({ where: { roadmapId: roadmap.id } });

    let created = 0;
    for (let si = 0; si < rm.stages.length; si++) {
      const stage = rm.stages[si];
      for (let ni = 0; ni < stage.nodes.length; ni++) {
        const n = stage.nodes[ni];
        await prisma.roadmapNode.create({
          data: {
            roadmapId: roadmap.id, stage: si, stageLabel: stage.label, order: ni,
            side: n.side ?? 'center', kind: n.kind ?? 'primary', title: n.title, subtitle: n.subtitle ?? null,
            icon: n.icon ?? null, description: n.description ?? null,
            linkType: n.link?.type ?? null, linkRef: n.link?.ref ?? null,
            resources: n.resources && n.resources.length ? (n.resources as unknown as Prisma.InputJsonValue) : undefined,
          },
        });
        created++;
      }
    }
    out.push({ slug: rm.slug, created, skipped: false });
  }
  return out;
}
