/**
 * CTW đợt 9a (13/10/2026) — TÀI LIỆU LỚP theo chủ đề / tuần (tab Classwork).
 *
 *   Chủ đề (tuần N, tiêu đề) ⊃ mục tài liệu: SLIDE · SYLLABUS · FILE · LINK · VIDEO, mỗi mục có mô tả + tệp R2 (dùng chung
 *   kho tệp của Stream: work_class_stream_files.material_id) + link (thẻ link của Resources: YouTube/Drive/… nhận diện sẵn).
 *   Kéo-thả: sắp lại chủ đề; sắp lại mục trong một chủ đề (kể cả kéo sang chủ đề khác).
 *   SV bấm mở / "Đánh dấu đã xem" ⇒ một dòng work_class_material_views; GV thấy tỉ lệ xem (và ai chưa xem).
 *   Đăng mục (không nháp) ⇒ một dòng trên Stream (postStreamItem, MATERIAL) — sửa lại không đẻ dòng mới.
 *
 * Quyền: GV/OWNER quản lý; SV chỉ đọc mục không nháp; agent 403 (classCtx).
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { PUBLIC_USER, cutText } from './common.js';
import {
  assertWritable, attachDraftFiles, classCtx, detachFiles, postStreamItem, removeStreamItem,
} from './classStream.service.js';
import { MATERIAL_KINDS, normalizeLinks, parseIdList, reorderPlan, viewRate, type MaterialKind } from './classStreamRules.js';

const MAX_TOPICS = 60;
const MAX_MATERIALS = 400;

export interface TopicInput { title?: string; week?: number | null }
export interface MaterialInput {
  topicId?: number | null;
  kind?: MaterialKind;
  title?: string;
  description?: string | null;
  links?: Array<{ url: string; title?: string }>;
  fileIds?: number[];
  removeFileIds?: number[];
  draft?: boolean;
}

const MAT_SELECT = {
  id: true, topicId: true, kind: true, title: true, description: true, links: true, position: true, draft: true, createdAt: true, updatedAt: true,
  author: { select: PUBLIC_USER },
  files: { select: { id: true, fileName: true, mime: true, size: true, createdAt: true }, orderBy: { id: 'asc' as const } },
} satisfies Prisma.WorkClassMaterialSelect;

const materialUrl = (classId: number, id: number) => `/work/classes?id=${classId}&tab=classwork&m=${id}`;

export async function listMaterials(userId: number, classId: number) {
  const ctx = await classCtx(userId, classId);
  const [topics, mats, students] = await Promise.all([
    prisma.workClassTopic.findMany({ where: { classId }, orderBy: [{ position: 'asc' }, { id: 'asc' }], select: { id: true, title: true, week: true, position: true } }),
    prisma.workClassMaterial.findMany({ where: { classId, deletedAt: null, ...(ctx.manage ? {} : { draft: false }) }, orderBy: [{ position: 'asc' }, { id: 'asc' }], select: MAT_SELECT }),
    ctx.manage ? prisma.workClassStudent.count({ where: { classId, userId: { not: null } } }) : Promise.resolve(0),
  ]);
  const ids = mats.map((m) => m.id);
  let viewedByMe = new Set<number>();
  let counts = new Map<number, number>();
  if (ids.length) {
    if (ctx.manage) {
      const g = await prisma.workClassMaterialView.groupBy({
        by: ['materialId'],
        // Chỉ đếm SINH VIÊN của lớp (GV mở xem không làm tăng tỉ lệ).
        where: { materialId: { in: ids }, user: { workClassSeats: { some: { classId } } } },
        _count: { _all: true },
      });
      counts = new Map(g.map((x) => [x.materialId, x._count._all]));
    }
    const mine = await prisma.workClassMaterialView.findMany({ where: { materialId: { in: ids }, userId }, select: { materialId: true } });
    viewedByMe = new Set(mine.map((v) => v.materialId));
  }
  return {
    manage: ctx.manage,
    students,
    topics,
    materials: mats.map((m) => ({
      ...m,
      viewed: viewedByMe.has(m.id),
      ...(ctx.manage ? { views: counts.get(m.id) ?? 0, viewRate: viewRate(counts.get(m.id) ?? 0, students) } : {}),
    })),
  };
}

// ─── Chủ đề ───────────────────────────────────────────────────────

const cleanTitle = (s: string | undefined, fallback?: string) => {
  const t = cutText((s ?? '').trim(), 120);
  if (!t && !fallback) throw new BadRequestError('Give it a title', 'WORK_CLASS_BAD');
  return t || fallback!;
};
const cleanWeek = (w: number | null | undefined) => (w === null || w === undefined ? null : Math.min(Math.max(Math.round(w), 0), 60));

export async function createTopic(userId: number, classId: number, input: TopicInput) {
  const ctx = await classCtx(userId, classId, true);
  assertWritable(ctx);
  if (await prisma.workClassTopic.count({ where: { classId } }) >= MAX_TOPICS) throw new BadRequestError(`A class can have at most ${MAX_TOPICS} topics`, 'WORK_LIMIT');
  const week = cleanWeek(input.week);
  const last = await prisma.workClassTopic.findFirst({ where: { classId }, orderBy: { position: 'desc' }, select: { position: true } });
  return prisma.workClassTopic.create({
    data: { classId, title: cleanTitle(input.title, week !== null ? `Week ${week}` : undefined), week, position: (last?.position ?? -1) + 1 },
    select: { id: true, title: true, week: true, position: true },
  });
}

export async function updateTopic(userId: number, classId: number, topicId: number, input: TopicInput) {
  const ctx = await classCtx(userId, classId, true);
  assertWritable(ctx);
  const t = await prisma.workClassTopic.findFirst({ where: { id: topicId, classId }, select: { id: true } });
  if (!t) throw new NotFoundError('Topic not found');
  return prisma.workClassTopic.update({
    where: { id: topicId },
    data: { ...(input.title !== undefined ? { title: cleanTitle(input.title) } : {}), ...(input.week !== undefined ? { week: cleanWeek(input.week) } : {}) },
    select: { id: true, title: true, week: true, position: true },
  });
}

/** Xoá chủ đề: mục bên trong chuyển sang "Không chủ đề" (không mất tài liệu). */
export async function deleteTopic(userId: number, classId: number, topicId: number) {
  const ctx = await classCtx(userId, classId, true);
  assertWritable(ctx);
  const t = await prisma.workClassTopic.findFirst({ where: { id: topicId, classId }, select: { id: true } });
  if (!t) throw new NotFoundError('Topic not found');
  await prisma.workClassTopic.delete({ where: { id: topicId } });
  return { deleted: true };
}

export async function reorderTopics(userId: number, classId: number, ids: number[]) {
  const ctx = await classCtx(userId, classId, true);
  assertWritable(ctx);
  const cur = await prisma.workClassTopic.findMany({ where: { classId }, orderBy: [{ position: 'asc' }, { id: 'asc' }], select: { id: true } });
  const plan = reorderPlan(cur.map((c) => c.id), parseIdList(ids));
  if (!plan) throw new BadRequestError('Unknown topic in the new order', 'WORK_CLASS_BAD');
  await prisma.$transaction(plan.map((p) => prisma.workClassTopic.update({ where: { id: p.id }, data: { position: p.position } })));
  return { ok: true };
}

// ─── Mục tài liệu ─────────────────────────────────────────────────

async function topicOf(classId: number, topicId: number | null | undefined): Promise<number | null> {
  if (!topicId) return null;
  const t = await prisma.workClassTopic.findFirst({ where: { id: topicId, classId }, select: { id: true } });
  if (!t) throw new BadRequestError('Pick a topic of this class', 'WORK_CLASS_BAD');
  return t.id;
}

async function announce(userId: number, classId: number, m: { id: number; title: string; draft: boolean }) {
  if (m.draft) { await removeStreamItem(classId, 'MATERIAL', m.id); return; }
  await postStreamItem({ classId, kind: 'MATERIAL', refType: 'MATERIAL', refId: m.id, title: m.title, url: materialUrl(classId, m.id), actorId: userId });
}

export async function createMaterial(userId: number, classId: number, input: MaterialInput) {
  const ctx = await classCtx(userId, classId, true);
  assertWritable(ctx);
  if (await prisma.workClassMaterial.count({ where: { classId, deletedAt: null } }) >= MAX_MATERIALS) throw new BadRequestError(`A class can have at most ${MAX_MATERIALS} materials`, 'WORK_LIMIT');
  const kind = input.kind && MATERIAL_KINDS.includes(input.kind) ? input.kind : 'FILE';
  const topicId = await topicOf(classId, input.topicId);
  const { links } = normalizeLinks(input.links ?? []);
  const last = await prisma.workClassMaterial.findFirst({ where: { classId, topicId }, orderBy: { position: 'desc' }, select: { position: true } });
  const m = await prisma.workClassMaterial.create({
    data: {
      classId, topicId, authorId: userId, kind, title: cleanTitle(input.title).slice(0, 255), description: input.description?.trim() ? cutText(input.description.trim(), 5000) : null,
      links: links as unknown as Prisma.InputJsonValue, draft: !!input.draft, position: (last?.position ?? -1) + 1,
    },
    select: { id: true, title: true, draft: true },
  });
  await attachDraftFiles(userId, classId, parseIdList(input.fileIds), { materialId: m.id });
  await announce(userId, classId, m);
  return getMaterial(userId, classId, m.id);
}

export async function updateMaterial(userId: number, classId: number, materialId: number, input: MaterialInput) {
  const ctx = await classCtx(userId, classId, true);
  assertWritable(ctx);
  const cur = await prisma.workClassMaterial.findFirst({ where: { id: materialId, classId, deletedAt: null }, select: { id: true } });
  if (!cur) throw new NotFoundError('Material not found');
  const data: Prisma.WorkClassMaterialUpdateInput = {};
  if (input.title !== undefined) data.title = cleanTitle(input.title).slice(0, 255);
  if (input.description !== undefined) data.description = input.description?.trim() ? cutText(input.description.trim(), 5000) : null;
  if (input.kind !== undefined && MATERIAL_KINDS.includes(input.kind)) data.kind = input.kind;
  if (input.links !== undefined) data.links = normalizeLinks(input.links).links as unknown as Prisma.InputJsonValue;
  if (input.draft !== undefined) data.draft = input.draft;
  if (input.topicId !== undefined) {
    const tid = await topicOf(classId, input.topicId);
    data.topic = tid ? { connect: { id: tid } } : { disconnect: true };
  }
  const m = await prisma.workClassMaterial.update({ where: { id: materialId }, data, select: { id: true, title: true, draft: true } });
  if (input.removeFileIds?.length) await detachFiles(classId, input.removeFileIds, { materialId });
  if (input.fileIds?.length) await attachDraftFiles(userId, classId, parseIdList(input.fileIds), { materialId });
  if (input.title !== undefined || input.draft !== undefined) await announce(userId, classId, m);
  return getMaterial(userId, classId, materialId);
}

export async function deleteMaterial(userId: number, classId: number, materialId: number) {
  const ctx = await classCtx(userId, classId, true);
  assertWritable(ctx);
  const cur = await prisma.workClassMaterial.findFirst({ where: { id: materialId, classId, deletedAt: null }, select: { id: true } });
  if (!cur) throw new NotFoundError('Material not found');
  await prisma.workClassMaterial.update({ where: { id: materialId }, data: { deletedAt: new Date() } });
  const files = await prisma.workClassStreamFile.findMany({ where: { materialId }, select: { id: true } });
  await detachFiles(classId, files.map((f) => f.id), { materialId });
  await removeStreamItem(classId, 'MATERIAL', materialId);
  return { deleted: true };
}

/** Kéo-thả mục: `ids` = thứ tự mới TRONG chủ đề `topicId` (mục từ chủ đề khác được chuyển sang). */
export async function reorderMaterials(userId: number, classId: number, input: { topicId: number | null; ids: number[] }) {
  const ctx = await classCtx(userId, classId, true);
  assertWritable(ctx);
  const topicId = await topicOf(classId, input.topicId);
  const wanted = parseIdList(input.ids);
  const known = await prisma.workClassMaterial.findMany({ where: { classId, deletedAt: null, id: { in: wanted } }, select: { id: true } });
  if (known.length !== wanted.length) throw new BadRequestError('Unknown material in the new order', 'WORK_CLASS_BAD');
  const inTopic = await prisma.workClassMaterial.findMany({ where: { classId, deletedAt: null, topicId }, orderBy: [{ position: 'asc' }, { id: 'asc' }], select: { id: true } });
  const plan = reorderPlan([...new Set([...inTopic.map((m) => m.id), ...wanted])], wanted);
  if (!plan) throw new BadRequestError('Unknown material in the new order', 'WORK_CLASS_BAD');
  await prisma.$transaction(plan.map((p) => prisma.workClassMaterial.update({ where: { id: p.id }, data: { position: p.position, topicId } })));
  return { ok: true };
}

export async function getMaterial(userId: number, classId: number, materialId: number) {
  const ctx = await classCtx(userId, classId);
  const m = await prisma.workClassMaterial.findFirst({ where: { id: materialId, classId, deletedAt: null, ...(ctx.manage ? {} : { draft: false }) }, select: MAT_SELECT });
  if (!m) throw new NotFoundError('Material not found');
  const viewed = !!(await prisma.workClassMaterialView.findFirst({ where: { materialId, userId }, select: { id: true } }));
  return { ...m, viewed };
}

/** SV đánh dấu đã xem (mở tệp/link cũng gọi). Idempotent. */
export async function markViewed(userId: number, classId: number, materialId: number) {
  const ctx = await classCtx(userId, classId);
  const m = await prisma.workClassMaterial.findFirst({ where: { id: materialId, classId, deletedAt: null, ...(ctx.manage ? {} : { draft: false }) }, select: { id: true } });
  if (!m) throw new NotFoundError('Material not found');
  await prisma.workClassMaterialView.upsert({ where: { materialId_userId: { materialId, userId } }, create: { materialId, userId }, update: {} });
  return { viewed: true };
}

/** GV: ai đã xem / chưa xem một mục (chỉ GV — SV không thấy danh sách người khác). */
export async function materialViewers(userId: number, classId: number, materialId: number) {
  await classCtx(userId, classId, true);
  const m = await prisma.workClassMaterial.findFirst({ where: { id: materialId, classId, deletedAt: null }, select: { id: true } });
  if (!m) throw new NotFoundError('Material not found');
  const [seats, views] = await Promise.all([
    prisma.workClassStudent.findMany({ where: { classId, userId: { not: null } }, orderBy: [{ studentCode: 'asc' }, { id: 'asc' }], select: { id: true, userId: true, studentCode: true, fullName: true, user: { select: PUBLIC_USER } } }),
    prisma.workClassMaterialView.findMany({ where: { materialId }, select: { userId: true, viewedAt: true } }),
  ]);
  const at = new Map(views.map((v) => [v.userId, v.viewedAt]));
  const rows = seats.map((s) => ({ studentId: s.id, studentCode: s.studentCode, fullName: s.fullName, user: s.user, viewedAt: at.get(s.userId!) ?? null }));
  return { rows, viewed: rows.filter((r) => r.viewedAt).length, total: rows.length, rate: viewRate(rows.filter((r) => r.viewedAt).length, rows.length) };
}
