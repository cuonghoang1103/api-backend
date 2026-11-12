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
import { docNoiDung, khoaBuoc, type BaiHocLienKet } from './roadmap.noiDung.js';

export interface ResourceItem { type: string; title: string; url: string; premium?: boolean; }
export interface RoadmapNodeDto {
  id: number; stage: number; stageLabel: string; order: number; side: string; kind: string;
  title: string; subtitle: string | null; icon: string | null; description: string | null;
  linkType: string | null; linkRef: string | null; resources: ResourceItem[] | null;
  /** Chỗ học ngay trên web (nhẹ — đi kèm cả lộ trình để thẻ hiện "Học ngay"). */
  lessons: BaiHocLienKet[] | null;
  /** Có bài đọc tự đủ không — bài đọc tải riêng khi mở bước (GET /:slug/nodes/:id). */
  hasBody: boolean;
}
export interface RoadmapNodeBodyDto { id: number; body: string | null; lessons: BaiHocLienKet[] | null; resources: ResourceItem[] | null; }
export interface RoadmapStageDto { stage: number; stageLabel: string; nodes: RoadmapNodeDto[]; }
export interface RoadmapListItem {
  slug: string; title: string; type: string; description: string | null;
  icon: string | null; color: string | null; nodeCount: number;
  /** Số chặng · số bước có chỗ học ngay trên web · số bước có bài đọc tự đủ. */
  stageCount: number; linkedCount: number; bodyCount: number;
  /** Số bước người đang xem đã xong (0 khi chưa đăng nhập). */
  doneCount: number;
}
export interface RoadmapDetailDto {
  slug: string; title: string; type: string; description: string | null; icon: string | null; color: string | null;
  stages: RoadmapStageDto[]; doneNodeIds: number[]; total: number;
}

function nodeDto(n: {
  id: number; stage: number; stageLabel: string; order: number; side: string; kind: string;
  title: string; subtitle: string | null; icon: string | null; description: string | null;
  linkType: string | null; linkRef: string | null; resources: unknown; lessons: unknown; hasBody: boolean;
}): RoadmapNodeDto {
  return { id: n.id, stage: n.stage, stageLabel: n.stageLabel, order: n.order, side: n.side, kind: n.kind,
    title: n.title, subtitle: n.subtitle, icon: n.icon, description: n.description, linkType: n.linkType, linkRef: n.linkRef,
    resources: Array.isArray(n.resources) ? (n.resources as ResourceItem[]) : null,
    lessons: Array.isArray(n.lessons) && n.lessons.length ? (n.lessons as BaiHocLienKet[]) : null,
    hasBody: n.hasBody };
}

const NODE_SELECT = {
  id: true, stage: true, stageLabel: true, order: true, side: true, kind: true, title: true, subtitle: true, icon: true,
  description: true, linkType: true, linkRef: true, resources: true, lessons: true,
} as const;

/** Public: all published roadmaps grouped by type (role / skill), with node counts. */
export async function listRoadmaps(userId?: number): Promise<{ role: RoadmapListItem[]; skill: RoadmapListItem[] }> {
  const rows = await prisma.roadmap.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ type: 'asc' }, { sortOrder: 'asc' }, { title: 'asc' }],
    select: { id: true, slug: true, title: true, type: true, description: true, icon: true, color: true, _count: { select: { nodes: true } } },
  });
  // Đếm chặng / bước có bài học / bước có bài đọc trong MỘT truy vấn gộp (35 lộ trình, ~4k bước).
  const dem = await prisma.$queryRaw<Array<{ roadmap_id: number; chang: bigint; co_bai: bigint; co_doc: bigint }>>`
    SELECT roadmap_id, COUNT(DISTINCT stage) AS chang,
           COUNT(*) FILTER (WHERE lessons IS NOT NULL AND jsonb_array_length(lessons) > 0) AS co_bai,
           COUNT(*) FILTER (WHERE body IS NOT NULL AND body <> '') AS co_doc
    FROM roadmap_nodes GROUP BY roadmap_id`;
  const theoId = new Map(dem.map((d) => [d.roadmap_id, d]));
  const xong = new Map<number, number>();
  if (userId) {
    const ds = await prisma.$queryRaw<Array<{ roadmap_id: number; so: bigint }>>`
      SELECT n.roadmap_id, COUNT(*) AS so FROM roadmap_done d JOIN roadmap_nodes n ON n.id = d.node_id
      WHERE d.user_id = ${userId} GROUP BY n.roadmap_id`;
    for (const d of ds) xong.set(d.roadmap_id, Number(d.so));
  }
  const map = (r: (typeof rows)[number]): RoadmapListItem => {
    const d = theoId.get(r.id);
    return {
      slug: r.slug, title: r.title, type: r.type, description: r.description, icon: r.icon, color: r.color, nodeCount: r._count.nodes,
      stageCount: Number(d?.chang ?? 0), linkedCount: Number(d?.co_bai ?? 0), bodyCount: Number(d?.co_doc ?? 0),
      doneCount: xong.get(r.id) ?? 0,
    };
  };
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

  // Không kéo `body` (bài đọc, có lộ trình ~300 bước × vài KB) — chỉ hỏi bước nào có.
  const [nodes, coBody] = await Promise.all([
    prisma.roadmapNode.findMany({
      where: { roadmapId: roadmap.id },
      orderBy: [{ stage: 'asc' }, { order: 'asc' }],
      select: NODE_SELECT,
    }),
    prisma.roadmapNode.findMany({ where: { roadmapId: roadmap.id, body: { not: null } }, select: { id: true } }),
  ]);
  const coBodySet = new Set(coBody.map((n) => n.id));

  const stages: RoadmapStageDto[] = [];
  for (const n of nodes) {
    let s = stages.find((x) => x.stage === n.stage);
    if (!s) { s = { stage: n.stage, stageLabel: n.stageLabel, nodes: [] }; stages.push(s); }
    s.nodes.push(nodeDto({ ...n, hasBody: coBodySet.has(n.id) }));
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

/** Public: bài đọc + chỗ học của MỘT bước (tải khi người học mở bước). */
export async function getNodeBody(slug: string, nodeId: number): Promise<RoadmapNodeBodyDto> {
  const n = await prisma.roadmapNode.findFirst({
    where: { id: nodeId, roadmap: { slug: String(slug || '').trim() } },
    select: { id: true, body: true, lessons: true, resources: true },
  });
  if (!n) throw new NotFoundError('Không tìm thấy mục.');
  return {
    id: n.id, body: n.body,
    lessons: Array.isArray(n.lessons) && n.lessons.length ? (n.lessons as unknown as BaiHocLienKet[]) : null,
    resources: Array.isArray(n.resources) ? (n.resources as unknown as ResourceItem[]) : null,
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

    // ⚠️ KHÔNG deleteMany rồi tạo lại. `RoadmapDone.node` là onDelete: Cascade,
    // nên xoá node là xoá luôn dấu "đã xong" của MỌI người dùng. Thay vào đó
    // khớp node cũ với node mới rồi cập nhật TẠI CHỖ để giữ nguyên id.
    //
    // ⚠️ Khoá khớp là CHẶNG + TIÊU ĐỀ, không phải tiêu đề trần: lộ trình
    // `claude-code` cố ý có 4 tiêu đề lặp ("Skills", "Hooks", "Plugins",
    // "Subagents" — một bước khái niệm ở chặng tổng quan, một chặng chuyên
    // sâu cùng tên). Khoá bằng tiêu đề trần thì mỗi lần seed lại nuốt mất
    // một bước trong mỗi cặp — đo thật: 1535 node tụt còn 1531.
    const cu = existing
      ? await prisma.roadmapNode.findMany({ where: { roadmapId: roadmap.id }, select: { id: true, title: true, stageLabel: true } })
      : [];
    const khoa = (stageLabel: string, title: string) => `${stageLabel}\u0000${title}`;
    const theoTen = new Map(cu.map((n) => [khoa(n.stageLabel, n.title), n.id]));
    const conDung = new Set<number>();

    // Nội dung tự đủ (bài đọc + bài học trên web + tài liệu thêm) — content/roadmap/<slug>.json.
    const noiDung = docNoiDung(rm.slug);

    let created = 0;
    for (let si = 0; si < rm.stages.length; si++) {
      const stage = rm.stages[si];
      for (let ni = 0; ni < stage.nodes.length; ni++) {
        const n = stage.nodes[ni];
        const nd = noiDung[khoaBuoc(stage.label, n.title)];
        // Link ngoài cũ GIỮ NGUYÊN; tài liệu thêm chỉ nối vào sau, bỏ trùng URL.
        const daCoUrl = new Set((n.resources ?? []).map((r) => r.url));
        const taiNguyen = [...(n.resources ?? []), ...(nd?.more ?? []).filter((r) => !daCoUrl.has(r.url))];
        const truong = {
          stage: si, stageLabel: stage.label, order: ni,
          side: n.side ?? 'center', kind: n.kind ?? 'primary', subtitle: n.subtitle ?? null,
          icon: n.icon ?? null, description: n.description ?? null,
          linkType: n.link?.type ?? null, linkRef: n.link?.ref ?? null,
          resources: (taiNguyen.length
            ? (taiNguyen as unknown as Prisma.InputJsonValue)
            : Prisma.DbNull),
          body: nd?.body?.trim() || null,
          lessons: (nd?.lessons?.length ? (nd.lessons as unknown as Prisma.InputJsonValue) : Prisma.DbNull),
        };
        const idCu = theoTen.get(khoa(stage.label, n.title));
        if (idCu !== undefined) {
          conDung.add(idCu);
          await prisma.roadmapNode.update({ where: { id: idCu }, data: truong });
        } else {
          const moi = await prisma.roadmapNode.create({
            data: { roadmapId: roadmap.id, title: n.title, ...truong },
            select: { id: true },
          });
          conDung.add(moi.id);
          created++;
        }
      }
    }
    const thua = cu.filter((n) => !conDung.has(n.id)).map((n) => n.id);
    if (thua.length) await prisma.roadmapNode.deleteMany({ where: { id: { in: thua } } });

    out.push({ slug: rm.slug, created, skipped: false });
  }
  return out;
}
