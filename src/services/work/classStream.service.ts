/**
 * CTW đợt 9a (13/10/2026) — BẢNG TIN LỚP (Stream) + tệp của lớp + điểm cắm cho 9b/9c.
 *
 *   GV/OWNER đăng thông báo (TipTap JSON, đính kèm tệp R2 + link, ghim, hẹn giờ đăng, chọn cả lớp hoặc một số nhóm).
 *   SV bình luận (văn bản thuần) khi lớp bật; GV ẩn/bỏ ẩn/xoá bình luận, tắt bình luận theo lớp hoặc theo bài.
 *   Đăng (ngay hoặc khi tới giờ hẹn) ⇒ chuông + email (notifyWork ⇒ khung workEmail; ngoài production thư vào hộp thư giả).
 *
 *   ĐIỂM CẮM CHO 9b/9c (gọi từ service của họ):
 *     postStreamItem({ classId, kind: 'ASSIGNMENT' | 'QUIZ' | 'MATERIAL', refType, refId, title, url?, actorId?,
 *                      audienceGroupIds?, publishAt?, notify? })  — upsert theo (lớp, refType, refId): gọi lại khi sửa
 *                      bài là CẬP NHẬT dòng cũ, không đẻ dòng mới; tới giờ ⇒ đăng + báo ĐÚNG MỘT LẦN.
 *     removeStreamItem(classId, refType, refId)              — bài bị xoá ⇒ dòng biến khỏi Stream.
 *
 * Đăng đúng một lần: cron mỗi phút (cron.service.ts) + lúc đọc Stream đều gọi publishDue(); mỗi bài được CHIẾM bằng
 * `UPDATE … SET published_at = now WHERE id = ? AND published_at IS NULL` — chỉ lượt chiếm được mới gửi thông báo.
 *
 * Quyền: người ngoài lớp ⇒ 404; agent ⇒ 403 ở MỌI lệnh (đọc lẫn ghi); SV chỉ thấy bài đã đăng của cả lớp / nhóm mình,
 * không thấy bình luận đã ẩn, không thấy email/MSSV người khác (chỉ PUBLIC_USER).
 */

import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { getSignedDownloadUrl } from '../../config/r2.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { requireClass, type ClassRole } from './classroom.service.js';
import {
  COMMENT_MAX, MAX_POST_FILES, POST_KINDS, POST_TEXT_MAX, canComment, normalizeLinks, parseIdList, scheduleOf, visibleToStudent, type PostKind,
} from './classStreamRules.js';
import { cutText, PUBLIC_USER, displayName } from './common.js';
import { assertCommentStorage, commentStore, MAX_COMMENT_FILE_BYTES } from './commentFiles.service.js';
import { notifyWork } from './notify.js';
import { agentForbidden, principalOf } from './permissions.js';
import { tiptapToText } from './tiptapText.js';

// ─── Ngữ cảnh + quyền (dùng chung cho tài liệu + lịch lớp) ───────────

export interface ClassCtx {
  userId: number;
  classId: number;
  role: ClassRole;
  manage: boolean;
  /** Ghế sinh viên (null với GV/OWNER không học lớp này). */
  seat: { id: number; groupId: number | null } | null;
  cls: { id: number; name: string; classCode: string; ownerId: number; teacherId: number | null; timezone: string; streamComments: boolean; absenceThreshold: number; lateAfterMin: number; archivedAt: Date | null };
}

/** Agent ⇒ 403 (mọi lệnh); người ngoài ⇒ 404; `manage` mà là SV ⇒ 403. */
export async function classCtx(userId: number, classId: number, manage = false): Promise<ClassCtx> {
  if ((await principalOf(userId)) === 'AGENT') throw await agentForbidden(userId, 'use classes');
  const r = await requireClass(userId, classId, manage);
  const seat = await prisma.workClassStudent.findFirst({ where: { classId, userId }, select: { id: true, groupId: true } });
  const c = r.cls as typeof r.cls & { streamComments: boolean; absenceThreshold: number; lateAfterMin: number };
  return {
    userId, classId, role: r.role, manage: r.role !== 'STUDENT', seat,
    cls: {
      id: c.id, name: c.name, classCode: c.classCode, ownerId: c.ownerId, teacherId: c.teacherId, timezone: c.timezone,
      streamComments: c.streamComments, absenceThreshold: c.absenceThreshold, lateAfterMin: c.lateAfterMin, archivedAt: c.archivedAt,
    },
  };
}

/** Lệnh ghi trên lớp đã lưu trữ ⇒ chặn (đọc vẫn được). */
export function assertWritable(ctx: ClassCtx) {
  if (ctx.cls.archivedAt) throw new ForbiddenError('This class is archived');
}

// ─── Cài đặt lớp của 9a ──────────────────────────────────────────

export async function getClassroomSettings(userId: number, classId: number) {
  const ctx = await classCtx(userId, classId);
  return { streamComments: ctx.cls.streamComments, absenceThreshold: ctx.cls.absenceThreshold, lateAfterMin: ctx.cls.lateAfterMin, manage: ctx.manage };
}

export async function updateClassroomSettings(userId: number, classId: number, patch: { streamComments?: boolean; absenceThreshold?: number; lateAfterMin?: number }) {
  const ctx = await classCtx(userId, classId, true);
  const data: Prisma.WorkClassUpdateInput = {};
  if (patch.streamComments !== undefined) data.streamComments = patch.streamComments;
  if (patch.absenceThreshold !== undefined) data.absenceThreshold = Math.min(Math.max(Math.round(patch.absenceThreshold), 1), 100);
  if (patch.lateAfterMin !== undefined) data.lateAfterMin = Math.min(Math.max(Math.round(patch.lateAfterMin), 0), 240);
  await prisma.workClass.update({ where: { id: ctx.classId }, data });
  return getClassroomSettings(userId, classId);
}

// ─── Tệp của lớp (R2 private, qua backend như chat K-3) ──────────────

const FILE_SELECT = { id: true, fileName: true, mime: true, size: true, createdAt: true } as const;
const MAX_DRAFTS = 30;
const safeName = (n: string) => n.replace(/[^\w.\- ]+/g, '_').slice(-120) || 'file';

export async function uploadClassFile(userId: number, classId: number, input: { buffer: Buffer; fileName: string; mime: string }) {
  const ctx = await classCtx(userId, classId, true);
  assertWritable(ctx);
  assertCommentStorage();
  if (!input.buffer.length) throw new BadRequestError('The file is empty', 'WORK_FILE_EMPTY');
  if (input.buffer.length > MAX_COMMENT_FILE_BYTES) throw new BadRequestError('Files must be 25 MB or smaller', 'WORK_FILE_TOO_LARGE');
  // Nháp > 24 giờ của chính người này ⇒ dọn; trần số nháp đang treo.
  const stale = await prisma.workClassStreamFile.findMany({ where: { uploaderId: userId, postId: null, materialId: null, createdAt: { lt: new Date(Date.now() - 86_400_000) } }, select: { id: true, r2Key: true }, take: 50 });
  if (stale.length) {
    await prisma.workClassStreamFile.deleteMany({ where: { id: { in: stale.map((s) => s.id) } } });
    for (const s of stale) void commentStore().del(s.r2Key).catch(() => undefined);
  }
  if (await prisma.workClassStreamFile.count({ where: { classId, uploaderId: userId, postId: null, materialId: null } }) >= MAX_DRAFTS) {
    throw new BadRequestError('Too many files waiting to be attached — post or remove some first', 'WORK_LIMIT');
  }
  const fileName = input.fileName.slice(0, 255) || 'file';
  let mime = (input.mime || 'application/octet-stream').slice(0, 100).toLowerCase();
  if (/svg|html|xml|javascript/.test(mime)) mime = 'application/octet-stream';
  const key = `work/class/${classId}/stream/${crypto.randomUUID()}/${safeName(fileName)}`;
  await commentStore().put(key, input.buffer, mime);
  return prisma.workClassStreamFile.create({ data: { classId, uploaderId: userId, r2Key: key, fileName, mime, size: input.buffer.length }, select: FILE_SELECT });
}

export async function deleteDraftFile(userId: number, classId: number, fileId: number) {
  await classCtx(userId, classId, true);
  const f = await prisma.workClassStreamFile.findFirst({ where: { id: fileId, classId, uploaderId: userId, postId: null, materialId: null }, select: { id: true, r2Key: true } });
  if (!f) throw new NotFoundError('Draft file not found');
  await prisma.workClassStreamFile.delete({ where: { id: f.id } });
  void commentStore().del(f.r2Key).catch(() => undefined);
  return { deleted: true };
}

/** Gắn các tệp nháp (của chính người gọi, cùng lớp) vào bài / tài liệu. */
export async function attachDraftFiles(userId: number, classId: number, fileIds: number[], target: { postId: number } | { materialId: number }) {
  const ids = parseIdList(fileIds).slice(0, MAX_POST_FILES);
  if (!ids.length) return 0;
  const r = await prisma.workClassStreamFile.updateMany({ where: { id: { in: ids }, classId, uploaderId: userId, postId: null, materialId: null }, data: target });
  return r.count;
}

/** Gỡ tệp khỏi bài / tài liệu (xoá luôn object R2). */
export async function detachFiles(classId: number, fileIds: number[], target: { postId: number } | { materialId: number }) {
  const ids = parseIdList(fileIds);
  if (!ids.length) return;
  const files = await prisma.workClassStreamFile.findMany({ where: { id: { in: ids }, classId, ...target }, select: { id: true, r2Key: true } });
  if (!files.length) return;
  await prisma.workClassStreamFile.deleteMany({ where: { id: { in: files.map((f) => f.id) } } });
  for (const f of files) void commentStore().del(f.r2Key).catch(() => undefined);
}

/** URL ký sẵn (10 phút) — kiểm quyền thấy bài / tài liệu MỖI lần xin. */
export async function classFileUrl(userId: number, classId: number, fileId: number, inline = false) {
  const ctx = await classCtx(userId, classId);
  const f = await prisma.workClassStreamFile.findFirst({
    where: { id: fileId, classId },
    select: {
      r2Key: true, fileName: true, uploaderId: true, postId: true, materialId: true,
      post: { select: { publishedAt: true, deletedAt: true, audienceGroupIds: true } },
      material: { select: { draft: true, deletedAt: true } },
    },
  });
  if (!f) throw new NotFoundError('File not found');
  let ok: boolean;
  if (f.post) ok = ctx.manage ? !f.post.deletedAt : visibleToStudent(f.post, ctx.seat?.groupId ?? null);
  else if (f.material) ok = !f.material.deletedAt && (ctx.manage || !f.material.draft);
  else ok = f.uploaderId === userId;
  if (!ok) throw new NotFoundError('File not found');
  return getSignedDownloadUrl(f.r2Key, 600, inline ? undefined : f.fileName);
}

// ─── Bảng tin ─────────────────────────────────────────────────────

export interface PostInput {
  bodyJson?: unknown;
  title?: string | null;
  links?: Array<{ url: string; title?: string }>;
  fileIds?: number[];
  removeFileIds?: number[];
  audienceGroupIds?: number[];
  publishAt?: string | null;
  pinned?: boolean;
  commentsOff?: boolean;
}

const POST_SELECT = {
  id: true, classId: true, kind: true, title: true, bodyJson: true, bodyText: true, links: true, refType: true, refId: true, url: true,
  audienceGroupIds: true, commentsOff: true, pinnedAt: true, publishAt: true, publishedAt: true, editedAt: true, createdAt: true, deletedAt: true,
  author: { select: PUBLIC_USER },
  files: { select: FILE_SELECT, orderBy: { id: 'asc' as const } },
} satisfies Prisma.WorkClassPostSelect;

async function audienceOf(classId: number, raw: unknown): Promise<number[]> {
  const ids = parseIdList(raw);
  if (!ids.length) return [];
  const ok = await prisma.workClassGroup.findMany({ where: { classId, id: { in: ids } }, select: { id: true } });
  if (ok.length !== ids.length) throw new BadRequestError('Pick groups of this class', 'WORK_CLASS_BAD');
  return ids;
}

function bodyOf(bodyJson: unknown): { json: Prisma.InputJsonValue | typeof Prisma.DbNull; text: string } {
  if (bodyJson === undefined || bodyJson === null) return { json: Prisma.DbNull, text: '' };
  const size = JSON.stringify(bodyJson).length;
  if (size > 400_000) throw new BadRequestError('The announcement is too long', 'WORK_TOO_LONG');
  const text = tiptapToText(bodyJson);
  if (text.length > POST_TEXT_MAX) throw new BadRequestError(`Keep announcements under ${POST_TEXT_MAX} characters`, 'WORK_TOO_LONG');
  return { json: bodyJson as Prisma.InputJsonValue, text };
}

export async function createPost(userId: number, classId: number, input: PostInput, now = new Date()) {
  const ctx = await classCtx(userId, classId, true);
  assertWritable(ctx);
  const body = bodyOf(input.bodyJson);
  const { links } = normalizeLinks(input.links ?? []);
  const fileIds = parseIdList(input.fileIds);
  if (!body.text.trim() && !links.length && !fileIds.length) throw new BadRequestError('Write something, attach a file or add a link', 'WORK_EMPTY');
  const sched = scheduleOf(input.publishAt, now);
  if (sched === 'BAD') throw new BadRequestError('The scheduled time is not valid', 'WORK_BAD_DATE');
  if (sched === 'TOO_FAR') throw new BadRequestError('Schedule at most 180 days ahead', 'WORK_BAD_DATE');
  const audience = await audienceOf(classId, input.audienceGroupIds);
  const post = await prisma.workClassPost.create({
    data: {
      classId, authorId: userId, kind: 'ANNOUNCEMENT', title: input.title?.trim().slice(0, 255) || null,
      bodyJson: body.json, bodyText: body.text || null, links: links as unknown as Prisma.InputJsonValue,
      audienceGroupIds: audience, commentsOff: !!input.commentsOff, pinnedAt: input.pinned ? now : null,
      publishAt: sched.publishAt, publishedAt: null,
    },
    select: { id: true },
  });
  await attachDraftFiles(userId, classId, fileIds, { postId: post.id });
  if (sched.immediate) await publishPost(post.id, now);
  return getPost(userId, classId, post.id);
}

export async function updatePost(userId: number, classId: number, postId: number, input: PostInput, now = new Date()) {
  const ctx = await classCtx(userId, classId, true);
  assertWritable(ctx);
  const cur = await prisma.workClassPost.findFirst({ where: { id: postId, classId, deletedAt: null }, select: { id: true, kind: true, publishedAt: true } });
  if (!cur) throw new NotFoundError('Post not found');
  const data: Prisma.WorkClassPostUpdateInput = {};
  let publishNow = false;
  if (cur.kind === 'ANNOUNCEMENT') {
    if (input.bodyJson !== undefined) { const b = bodyOf(input.bodyJson); data.bodyJson = b.json; data.bodyText = b.text || null; }
    if (input.title !== undefined) data.title = input.title?.trim().slice(0, 255) || null;
    if (input.links !== undefined) data.links = normalizeLinks(input.links).links as unknown as Prisma.InputJsonValue;
    if (input.audienceGroupIds !== undefined) data.audienceGroupIds = await audienceOf(classId, input.audienceGroupIds);
    if (input.publishAt !== undefined) {
      if (cur.publishedAt) throw new BadRequestError('This post is already published', 'WORK_ALREADY_PUBLISHED');
      const sched = scheduleOf(input.publishAt, now);
      if (sched === 'BAD' || sched === 'TOO_FAR') throw new BadRequestError('The scheduled time is not valid', 'WORK_BAD_DATE');
      data.publishAt = sched.publishAt;
      publishNow = sched.immediate;
    }
    if (cur.publishedAt && (input.bodyJson !== undefined || input.title !== undefined || input.links !== undefined)) data.editedAt = now;
  }
  if (input.pinned !== undefined) data.pinnedAt = input.pinned ? now : null;
  if (input.commentsOff !== undefined) data.commentsOff = input.commentsOff;
  await prisma.workClassPost.update({ where: { id: postId }, data });
  if (input.removeFileIds?.length) await detachFiles(classId, input.removeFileIds, { postId });
  if (input.fileIds?.length) {
    const have = await prisma.workClassStreamFile.count({ where: { postId } });
    await attachDraftFiles(userId, classId, parseIdList(input.fileIds).slice(0, Math.max(0, MAX_POST_FILES - have)), { postId });
  }
  if (publishNow) await publishPost(postId, now);
  return getPost(userId, classId, postId);
}

export async function deletePost(userId: number, classId: number, postId: number) {
  const ctx = await classCtx(userId, classId, true);
  assertWritable(ctx);
  const p = await prisma.workClassPost.findFirst({ where: { id: postId, classId, deletedAt: null }, select: { id: true, kind: true } });
  if (!p) throw new NotFoundError('Post not found');
  if (p.kind !== 'ANNOUNCEMENT') throw new BadRequestError('Delete the assignment, quiz or material itself — its line on the stream goes with it', 'WORK_CLASS_BAD');
  await prisma.workClassPost.update({ where: { id: postId }, data: { deletedAt: new Date(), pinnedAt: null } });
  const files = await prisma.workClassStreamFile.findMany({ where: { postId }, select: { id: true } });
  await detachFiles(classId, files.map((f) => f.id), { postId });
  return { deleted: true };
}

type PostRow = Prisma.WorkClassPostGetPayload<{ select: typeof POST_SELECT }>;

function presentPost(p: PostRow, ctx: ClassCtx, comments: CommentRow[], commentCount: number) {
  return {
    id: p.id, kind: p.kind as PostKind, title: p.title, bodyJson: p.bodyJson, links: p.links, refType: p.refType, refId: p.refId, url: p.url,
    author: p.author, files: p.files, pinned: !!p.pinnedAt, commentsOff: p.commentsOff,
    publishAt: p.publishAt, publishedAt: p.publishedAt, scheduled: !p.publishedAt, editedAt: p.editedAt, createdAt: p.createdAt,
    // Nhóm nhận bài: GV thấy; SV chỉ cần biết bài dành cho nhóm mình (không lộ nhóm khác).
    audienceGroupIds: ctx.manage ? parseIdList(p.audienceGroupIds) : undefined,
    forGroup: !ctx.manage && parseIdList(p.audienceGroupIds).length > 0,
    canComment: canComment({ manage: ctx.manage, classAllows: ctx.cls.streamComments, postCommentsOff: p.commentsOff }),
    comments, commentCount,
  };
}

const COMMENT_SELECT = { id: true, postId: true, body: true, hiddenAt: true, createdAt: true, author: { select: PUBLIC_USER } } satisfies Prisma.WorkClassCommentSelect;
type CommentRow = Prisma.WorkClassCommentGetPayload<{ select: typeof COMMENT_SELECT }> & { mine?: boolean; canDelete?: boolean };

function commentWhere(ctx: ClassCtx): Prisma.WorkClassCommentWhereInput {
  return ctx.manage ? { deletedAt: null } : { deletedAt: null, hiddenAt: null };
}

function decorate(rows: Array<Prisma.WorkClassCommentGetPayload<{ select: typeof COMMENT_SELECT }>>, ctx: ClassCtx): CommentRow[] {
  return rows.map((c) => ({ ...c, hidden: !!c.hiddenAt, hiddenAt: ctx.manage ? c.hiddenAt : null, mine: c.author.id === ctx.userId, canDelete: ctx.manage || c.author.id === ctx.userId }));
}

async function visiblePost(ctx: ClassCtx, postId: number) {
  const p = await prisma.workClassPost.findFirst({ where: { id: postId, classId: ctx.classId, deletedAt: null }, select: POST_SELECT });
  if (!p) throw new NotFoundError('Post not found');
  if (!ctx.manage && !visibleToStudent(p, ctx.seat?.groupId ?? null)) throw new NotFoundError('Post not found');
  return p;
}

export async function getPost(userId: number, classId: number, postId: number) {
  const ctx = await classCtx(userId, classId);
  const p = await visiblePost(ctx, postId);
  const rows = await prisma.workClassComment.findMany({ where: { postId, ...commentWhere(ctx) }, orderBy: { createdAt: 'asc' }, take: 200, select: COMMENT_SELECT });
  return presentPost(p, ctx, decorate(rows, ctx), rows.length);
}

/** Stream: ghim trước, rồi mới nhất. Trả 3 bình luận cuối của mỗi bài + tổng số (mở rộng bằng getPost). */
export async function listStream(userId: number, classId: number, opts: { limit?: number; before?: string | null } = {}) {
  const ctx = await classCtx(userId, classId);
  await publishDue(new Date(), classId).catch((err) => logger.warn('[work] class stream: đăng bài hẹn giờ lỗi', { err: (err as Error).message }));
  const limit = Math.min(Math.max(opts.limit ?? 30, 1), 100);
  const before = opts.before ? new Date(opts.before) : null;
  const where: Prisma.WorkClassPostWhereInput = {
    classId, deletedAt: null,
    ...(ctx.manage ? {} : { publishedAt: { not: null } }),
    ...(before && !Number.isNaN(before.getTime()) ? { publishAt: { lt: before }, pinnedAt: null } : {}),
  };
  // SV: lọc nhóm ở JS (danh sách nhóm là JSON). Lấy dư để bù dòng bị lọc.
  const raw = await prisma.workClassPost.findMany({ where, orderBy: [{ pinnedAt: { sort: 'desc', nulls: 'last' } }, { publishAt: 'desc' }, { id: 'desc' }], take: ctx.manage ? limit + 1 : limit * 3 + 1, select: POST_SELECT });
  const visible = ctx.manage ? raw : raw.filter((p) => visibleToStudent(p, ctx.seat?.groupId ?? null));
  const page = visible.slice(0, limit);
  const ids = page.map((p) => p.id);
  const [counts, recent] = await Promise.all([
    ids.length ? prisma.workClassComment.groupBy({ by: ['postId'], where: { postId: { in: ids }, ...commentWhere(ctx) }, _count: { _all: true } }) : [],
    ids.length ? prisma.$queryRaw<Array<{ id: number }>>`
      SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY post_id ORDER BY created_at DESC) AS rn
        FROM work_class_comments
        WHERE post_id IN (${Prisma.join(ids)}) AND deleted_at IS NULL ${ctx.manage ? Prisma.empty : Prisma.sql`AND hidden_at IS NULL`}
      ) t WHERE rn <= 3` : [],
  ]);
  const comments = recent.length ? await prisma.workClassComment.findMany({ where: { id: { in: recent.map((r) => r.id) } }, orderBy: { createdAt: 'asc' }, select: COMMENT_SELECT }) : [];
  const countOf = new Map(counts.map((c) => [c.postId, c._count._all]));
  const posts = page.map((p) => presentPost(p, ctx, decorate(comments.filter((c) => c.postId === p.id), ctx), countOf.get(p.id) ?? 0));
  const groups = ctx.manage ? await prisma.workClassGroup.findMany({ where: { classId }, orderBy: { number: 'asc' }, select: { id: true, name: true } }) : [];
  const last = page[page.length - 1];
  return {
    posts,
    nextBefore: visible.length > limit && last ? last.publishAt.toISOString() : null,
    manage: ctx.manage,
    settings: { streamComments: ctx.cls.streamComments },
    groups,
    myGroupId: ctx.seat?.groupId ?? null,
  };
}

// ─── Bình luận ────────────────────────────────────────────────────

export async function addComment(userId: number, classId: number, postId: number, body: string) {
  const ctx = await classCtx(userId, classId);
  assertWritable(ctx);
  const p = await visiblePost(ctx, postId);
  if (!p.publishedAt) throw new BadRequestError('Comments open once the post is published', 'WORK_NOT_PUBLISHED');
  if (!canComment({ manage: ctx.manage, classAllows: ctx.cls.streamComments, postCommentsOff: p.commentsOff })) {
    throw new ForbiddenError('Comments are turned off here');
  }
  const text = cutText(body.trim(), COMMENT_MAX);
  if (!text) throw new BadRequestError('Write a comment', 'WORK_EMPTY');
  // Chống xả: tối đa 20 bình luận / người / phút trong lớp.
  const recent = await prisma.workClassComment.count({ where: { authorId: userId, post: { classId }, createdAt: { gte: new Date(Date.now() - 60_000) } } });
  if (recent >= 20) throw new BadRequestError('You are commenting too fast — wait a moment', 'WORK_RATE');
  const c = await prisma.workClassComment.create({ data: { postId, authorId: userId, body: text }, select: COMMENT_SELECT });
  // Báo người viết bài (GV) khi có bình luận mới — không báo chính mình.
  if (p.author && p.author.id !== userId) {
    await notifyWork({
      receiverId: p.author.id, senderId: userId, type: 'WORK_ALERT', entityId: classId,
      payload: { issueKey: ctx.cls.classCode, title: ctx.cls.name, message: `New class comment from ${displayName(c.author)}`, excerpt: text.slice(0, 140), url: `/work/classes?id=${classId}&tab=stream` },
    }).catch(() => undefined);
  }
  return decorate([c], ctx)[0];
}

export async function setCommentHidden(userId: number, classId: number, commentId: number, hidden: boolean) {
  const ctx = await classCtx(userId, classId, true);
  const c = await prisma.workClassComment.findFirst({ where: { id: commentId, deletedAt: null, post: { classId } }, select: { id: true } });
  if (!c) throw new NotFoundError('Comment not found');
  await prisma.workClassComment.update({ where: { id: c.id }, data: hidden ? { hiddenAt: new Date(), hiddenById: ctx.userId } : { hiddenAt: null, hiddenById: null } });
  return { hidden };
}

export async function deleteComment(userId: number, classId: number, commentId: number) {
  const ctx = await classCtx(userId, classId);
  const c = await prisma.workClassComment.findFirst({ where: { id: commentId, deletedAt: null, post: { classId } }, select: { id: true, authorId: true, hiddenAt: true } });
  // SV không biết tới bình luận đã ẩn (kể cả của chính họ) ⇒ 404 như không có.
  if (!c || (!ctx.manage && c.hiddenAt)) throw new NotFoundError('Comment not found');
  if (!ctx.manage && c.authorId !== userId) throw new ForbiddenError('You can only delete your own comments');
  await prisma.workClassComment.update({ where: { id: c.id }, data: { deletedAt: new Date() } });
  return { deleted: true };
}

// ─── Đăng + thông báo (đúng một lần) ──────────────────────────────

/** Người nhận thông báo của bài: SV (có tài khoản) thuộc nhóm nhận + GV/OWNER; trừ người đăng. */
async function recipientsOf(classId: number, audience: number[], actorId: number | null): Promise<number[]> {
  const [cls, seats] = await Promise.all([
    prisma.workClass.findUnique({ where: { id: classId }, select: { ownerId: true, teacherId: true } }),
    prisma.workClassStudent.findMany({ where: { classId, userId: { not: null }, ...(audience.length ? { groupId: { in: audience } } : {}) }, select: { userId: true } }),
  ]);
  const ids = new Set<number>(seats.map((s) => s.userId!));
  if (cls) { ids.add(cls.ownerId); if (cls.teacherId) ids.add(cls.teacherId); }
  if (actorId) ids.delete(actorId);
  return [...ids];
}

const KIND_WORD: Record<string, string> = { ANNOUNCEMENT: 'announcement', ASSIGNMENT: 'assignment', QUIZ: 'quiz', MATERIAL: 'material' };

/** Chiếm + đăng MỘT bài. Trả true nếu lượt này đăng (và đã báo); false nếu lượt khác đã đăng trước. */
export async function publishPost(postId: number, now = new Date(), opts: { notify?: boolean } = {}): Promise<boolean> {
  const claimed = await prisma.workClassPost.updateMany({ where: { id: postId, publishedAt: null, deletedAt: null }, data: { publishedAt: now } });
  if (claimed.count !== 1) return false;
  if (opts.notify === false) return true;
  const p = await prisma.workClassPost.findUnique({
    where: { id: postId },
    select: { id: true, classId: true, kind: true, title: true, bodyText: true, url: true, authorId: true, audienceGroupIds: true, silent: true, class: { select: { name: true, classCode: true, archivedAt: true } } },
  });
  if (!p || p.silent || p.class.archivedAt) return true;
  const to = await recipientsOf(p.classId, parseIdList(p.audienceGroupIds), p.authorId);
  const sender = p.authorId ?? (await prisma.workClass.findUnique({ where: { id: p.classId }, select: { ownerId: true } }))?.ownerId ?? 0;
  const head = p.title?.trim() || (p.bodyText ?? '').split('\n')[0]?.trim() || 'New post';
  const message = `New ${KIND_WORD[p.kind] ?? 'post'} in ${p.class.classCode}: ${head}`.slice(0, 200);
  const url = p.url && p.kind !== 'ANNOUNCEMENT' ? p.url : `/work/classes?id=${p.classId}&tab=stream`;
  for (const uid of to) {
    await notifyWork({
      receiverId: uid, senderId: sender, type: 'WORK_ALERT', entityId: p.classId, secondaryEntityId: p.id,
      payload: { issueKey: p.class.classCode, title: p.class.name, message, excerpt: (p.bodyText ?? '').slice(0, 140) || undefined, url },
    }).catch((err) => logger.warn('[work] class stream: thông báo lỗi', { err: (err as Error).message }));
  }
  return true;
}

/** Đăng mọi bài đã tới giờ hẹn (cron mỗi phút + lúc đọc Stream). Trả số bài đăng ĐƯỢC ở lượt này. */
export async function publishDue(now = new Date(), classId?: number): Promise<number> {
  const due = await prisma.workClassPost.findMany({
    where: { publishedAt: null, deletedAt: null, publishAt: { lte: now }, ...(classId ? { classId } : {}) },
    orderBy: { publishAt: 'asc' }, take: 200, select: { id: true, refType: true },
  });
  let n = 0;
  for (const p of due) if (await publishPost(p.id, now)) n += 1;
  return n;
}

// ─── Điểm cắm cho 9b/9c ───────────────────────────────────────────

/** Link của mục lớp: chuỗi giữ nguyên; đối tượng tham số ⇒ `/work/classes?id=<lớp>&tab=…&…`. */
export function linkUrl(classId: number, link: string | Record<string, string> | null | undefined): string | null {
  if (!link) return null;
  if (typeof link === 'string') return link.slice(0, 500);
  const p = new URLSearchParams({ id: String(classId) });
  for (const [k, v] of Object.entries(link)) if (k !== 'id' && v !== undefined && v !== null) p.set(k, String(v));
  return `/work/classes?${p.toString()}`.slice(0, 500);
}

export interface StreamItemInput {
  classId: number;
  kind: Exclude<PostKind, 'ANNOUNCEMENT'>;
  /** Loại nguồn — 'ASSIGNMENT' | 'QUIZ' | 'MATERIAL' (≤ 16 ký tự). (refType, refId) là khoá chống trùng. Thiếu ⇒ = kind. */
  refType?: string;
  refId: number;
  title: string;
  /** Link mở khi bấm dòng (vd. `/work/classes?id=1&tab=classwork&a=5`). */
  url?: string | null;
  /** Bí danh của url: chuỗi, hoặc tham số tab của trang lớp ({ tab: 'classwork', q: '7' }). */
  link?: string | Record<string, string> | null;
  /** Người đăng (GV). null ⇒ chủ lớp. */
  actorId?: number | null;
  /** Rỗng/không có = cả lớp. */
  audienceGroupIds?: number[];
  /** Giờ giao bài; null/quá khứ = ngay. */
  publishAt?: Date | null;
  /** false ⇒ chỉ hiện dòng, KHÔNG chuông/email (khi 9b/9c tự báo). Mặc định true. */
  notify?: boolean;
}

/**
 * Hiện (hoặc cập nhật) một dòng Stream cho bài tập/quiz/tài liệu. Gọi lại khi sửa bài là cập nhật dòng cũ. Bài tới giờ ⇒
 * đăng + báo ĐÚNG MỘT LẦN (chiếm như bài thông báo); bài hẹn giờ ⇒ cron đăng sau. Không ném lỗi vì thông báo hỏng.
 */
export async function postStreamItem(input: StreamItemInput, now = new Date()): Promise<{ id: number; published: boolean }> {
  const i = { ...input, url: input.url ?? linkUrl(input.classId, input.link) };
  if (!POST_KINDS.includes(i.kind)) throw new BadRequestError('Unknown stream item kind', 'WORK_CLASS_BAD');
  const refType = (i.refType || i.kind).slice(0, 16);
  const title = cutText(i.title.trim() || 'Untitled', 255);
  const publishAt = i.publishAt && i.publishAt.getTime() > now.getTime() ? i.publishAt : now;
  const audience = parseIdList(i.audienceGroupIds);
  const existing = await prisma.workClassPost.findFirst({ where: { classId: i.classId, refType, refId: i.refId }, select: { id: true, publishedAt: true } });
  let id: number;
  if (existing) {
    await prisma.workClassPost.update({
      where: { id: existing.id },
      data: {
        title, ...(i.url ? { url: i.url } : {}), audienceGroupIds: audience, deletedAt: null, kind: i.kind, silent: i.notify === false,
        ...(existing.publishedAt ? { editedAt: now } : { publishAt }),
      },
    });
    id = existing.id;
  } else {
    try {
      id = (await prisma.workClassPost.create({
        data: { classId: i.classId, authorId: i.actorId ?? null, kind: i.kind, title, refType, refId: i.refId, url: i.url ?? null, audienceGroupIds: audience, publishAt, silent: i.notify === false },
        select: { id: true },
      })).id;
    } catch (err) {
      // Hai lượt gọi song song ⇒ UNIQUE (lớp, refType, refId) giữ đúng một dòng.
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        id = (await prisma.workClassPost.findFirstOrThrow({ where: { classId: i.classId, refType, refId: i.refId }, select: { id: true } })).id;
      } else throw err;
    }
  }
  const published = publishAt.getTime() <= now.getTime() ? await publishPost(id, now) : false;
  return { id, published };
}

/** Bài nguồn bị xoá / thu hồi ⇒ dòng Stream biến mất (giữ dòng cho kiểm toán). */
export async function removeStreamItem(classId: number, refType: string, refId: number): Promise<void> {
  await prisma.workClassPost.updateMany({ where: { classId, refType: refType.slice(0, 16), refId, deletedAt: null }, data: { deletedAt: new Date(), pinnedAt: null } });
}
