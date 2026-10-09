/**
 * CT Work đợt 5b K-1 — tệp và VOICE NOTE trong bình luận thẻ.
 *
 * Dùng lại đúng hạ tầng tệp của thẻ: bảng WorkAttachment, khoá R2 `work/<dự án>/<thẻ>/…`, URL tải ký sẵn
 * (`attachmentDownloadUrl`, kiểm quyền xem dự án). Hai thứ thêm:
 *   - `forComment` + `commentId`: tệp tải từ ô bình luận không lẫn vào khối Attachments của thẻ và không tính
 *     trần 50 tệp/thẻ. Bản nháp (commentId null) chỉ người tải lên gắn được vào bình luận của CHÍNH họ.
 *   - WorkVoiceNote: độ dài + phiên âm. Phiên âm chạy NỀN sau khi bình luận được gửi (bản nháp bỏ đi không tốn
 *     lượt Groq), bằng `transcribeWithGroq` + `checkHeardSpeech` có sẵn — không thêm dịch vụ. Không có GROQ_API_KEY
 *     ⇒ vẫn lưu audio, trạng thái NO_KEY và giao diện ghi rõ.
 *
 * Đường tải: trình duyệt dùng presign → PUT R2 → complete (đường cũ của thẻ, thêm cờ forComment). App desktop
 * chặn PUT thẳng lên R2 (CSP connect-src) ⇒ có thêm đường đi qua backend (`uploadCommentFile`). Voice note luôn đi
 * qua backend (≤ 8 MB) để server tự kiểm kiểu/dung lượng/độ dài trước khi ghi.
 *
 * Quyền riêng tư: audio là dữ liệu cá nhân — chỉ nằm trong RAM khi phiên âm; transcript KHÔNG ghi vào log.
 * Khách cổng (vai CLIENT bị cách ly) chỉ thấy/nghe tệp của bình luận PUBLIC trên thẻ đã chia sẻ (issues.service).
 */

import crypto from 'node:crypto';
import type { Prisma } from '@prisma/client';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '../../config/database.js';
import { config } from '../../config/env.js';
import { deleteObject, getR2Client, headObject, putObject } from '../../config/r2.js';
import { getStorageProvider } from '../../storage/StorageProvider.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { getIO } from '../../socket/messaging.socket.js';
import { logger } from '../../utils/logger.js';
import { PUBLIC_USER } from './common.js';
import { clientRoom, projectRoom } from './events.js';
import { isClientScoped, requireProject, type ProjectAccess } from './permissions.js';
import { tiptapToText } from './tiptapText.js';
import {
  baseMime, checkVoice, commentSearchText, MAX_COMMENT_FILES_PER_ISSUE, MAX_FILES_PER_COMMENT, VOICE_STT_DAILY_DEFAULT,
  vnDayStart, voiceExt, type TranscriptStatus,
} from './commentThreads.js';

export const MAX_COMMENT_FILE_BYTES = 25 * 1024 * 1024;

// ─── Kho + STT thay được trong test (không chạm R2/Groq thật) ─────

export interface CommentStore {
  put(key: string, body: Buffer, contentType: string): Promise<void>;
  read(key: string): Promise<Buffer>;
  head(key: string): Promise<{ size: number; contentType: string } | null>;
  del(key: string): Promise<void>;
}
const realStore: CommentStore = {
  async put(key, body, ct) { await putObject(key, body, ct, 'private, max-age=0, no-store'); },
  async read(key) {
    const res = await getR2Client().send(new GetObjectCommand({ Bucket: config.r2.bucketName, Key: key }));
    const bytes = await res.Body?.transformToByteArray();
    return Buffer.from(bytes ?? new Uint8Array());
  },
  head: (key) => headObject(key),
  del: (key) => deleteObject(key),
};
let store: CommentStore = realStore;
let testStore = false;
export function _setCommentStoreForTests(s: CommentStore | null): void { store = s ?? realStore; testStore = !!s; }

export type SttFn = (audio: Buffer, fileName: string, mime: string) => Promise<{ text: string; language?: string; noSpeechProb?: number; avgLogprob?: number }>;
let sttOverride: SttFn | null = null;
/** Test: STT giả. `null` ⇒ Groq thật (vẫn cần GROQ_API_KEY). */
export function _setSttForTests(fn: SttFn | null): void { sttOverride = fn; }
const sttConfigured = () => !!sttOverride || !!process.env.GROQ_API_KEY;

const pending = new Set<Promise<unknown>>();
/** Test: chờ mọi lượt phiên âm nền đang chạy. */
export async function _awaitTranscriptionsForTests(): Promise<void> {
  while (pending.size) await Promise.allSettled([...pending]);
}

function assertStorage() {
  if (testStore) return;
  if (getStorageProvider().kind !== 'r2') {
    throw new BadRequestError('Attachments need cloud storage (R2), which is not configured here', 'WORK_NO_STORAGE');
  }
}

// ─── Dùng chung với kênh chat dự án (K-3, chatFiles.service.ts) ─────

/** Kho R2 (hoặc kho giả của test) — chat dùng CHUNG để test chỉ thay một chỗ. */
export const commentStore = (): CommentStore => store;
/** Ném WORK_NO_STORAGE khi máy chủ không có R2 (bỏ qua khi test đã thay kho). */
export const assertCommentStorage = (): void => assertStorage();
/** Có STT không (khoá Groq hoặc STT giả của test). */
export const sttReady = (): boolean => sttConfigured();
/** Gọi STT (Groq thật hoặc STT giả của test) — Whisper tự dò ngôn ngữ. */
export async function runStt(audio: Buffer, fileName: string, mime: string) {
  const stt: SttFn = sttOverride ?? (async (buf, name, m) => {
    const { transcribeWithGroq } = await import('../interview/voice/stt.js');
    return transcribeWithGroq(buf, name, m, { language: '', detail: true });
  });
  return stt(audio, fileName, mime);
}
/** Theo dõi một việc nền (phiên âm) để test chờ được bằng `_awaitTranscriptionsForTests`. */
export function trackBackground(p: Promise<unknown>): void {
  pending.add(p);
  void p.finally(() => pending.delete(p));
}
/** Lượt phiên âm đã dùng HÔM NAY của dự án — CỘNG voice note bình luận (K-1) và voice note chat (K-3): một trần chung. */
export async function sttUsedToday(projectId: number): Promise<number> {
  const since = vnDayStart();
  const [a, b] = await Promise.all([
    prisma.workVoiceNote.count({ where: { transcriptStatus: { in: ['DONE', 'NO_SPEECH', 'FAILED'] }, transcribedAt: { gte: since }, attachment: { issue: { projectId } } } }),
    prisma.workChannelFile.count({ where: { transcriptStatus: { in: ['DONE', 'NO_SPEECH', 'FAILED'] }, transcribedAt: { gte: since }, channel: { projectId } } }),
  ]);
  return a + b;
}
export const sttDailyLimit = (): number => dailyLimit();

// ─── Đọc ─────────────────────────────────────────────────────────

export const COMMENT_FILE_SELECT = {
  id: true, commentId: true, fileName: true, mime: true, size: true, createdAt: true,
  uploader: { select: PUBLIC_USER },
  voice: { select: { durationMs: true, transcriptStatus: true, transcript: true, language: true, transcribedAt: true } },
} satisfies Prisma.WorkAttachmentSelect;

export type CommentFileRow = Prisma.WorkAttachmentGetPayload<{ select: typeof COMMENT_FILE_SELECT }>;

/** Tệp + voice note của nhiều bình luận trong MỘT lượt đọc (không N+1). */
export async function commentFilesFor(commentIds: number[]): Promise<Map<number, CommentFileRow[]>> {
  const out = new Map<number, CommentFileRow[]>();
  if (!commentIds.length) return out;
  const rows = await prisma.workAttachment.findMany({ where: { commentId: { in: commentIds } }, orderBy: { id: 'asc' }, select: COMMENT_FILE_SELECT });
  for (const r of rows) {
    const list = out.get(r.commentId!) ?? [];
    list.push(r);
    out.set(r.commentId!, list);
  }
  return out;
}

// ─── Tải lên ─────────────────────────────────────────────────────

async function visibleIssue(access: ProjectAccess, number: number) {
  const i = await prisma.workIssue.findFirst({ where: { projectId: access.projectId, number, deletedAt: null }, select: { id: true, clientVisible: true } });
  if (!i || (isClientScoped(access) && !i.clientVisible)) throw new NotFoundError('Issue not found');
  return i;
}

const safeName = (n: string) => n.replace(/[^\w.\- ]+/g, '_').slice(-120) || 'file';
export const commentFileKey = (projectId: number, issueId: number, fileName: string) => `work/${projectId}/${issueId}/${crypto.randomUUID()}/${safeName(fileName)}`;

/** Trần tệp-từ-bình-luận của thẻ + dọn bản nháp > 24 giờ của chính người này (tải lên rồi không gửi). */
export async function assertCommentFileRoom(issueId: number, userId: number): Promise<void> {
  const stale = await prisma.workAttachment.findMany({
    where: { issueId, uploaderId: userId, forComment: true, commentId: null, createdAt: { lt: new Date(Date.now() - 86_400_000) } },
    select: { id: true, r2Key: true }, take: 20,
  });
  if (stale.length) {
    await prisma.workAttachment.deleteMany({ where: { id: { in: stale.map((s) => s.id) } } });
    for (const s of stale) void store.del(s.r2Key).catch(() => {});
  }
  const n = await prisma.workAttachment.count({ where: { issueId, forComment: true } });
  if (n >= MAX_COMMENT_FILES_PER_ISSUE) throw new BadRequestError('This issue has too many files in comments', 'WORK_LIMIT');
}

/** Tệp từ ô bình luận qua backend (app desktop / khi PUT thẳng R2 hỏng). Thành bản nháp chờ gắn vào bình luận. */
export async function uploadCommentFile(userId: number, projectId: number, number: number, input: { buffer: Buffer; fileName: string; mime: string }) {
  const access = await requireProject(userId, projectId, 'attachment.add');
  assertStorage();
  const issue = await visibleIssue(access, number);
  if (!input.buffer.length) throw new BadRequestError('The file is empty', 'WORK_FILE_EMPTY');
  if (input.buffer.length > MAX_COMMENT_FILE_BYTES) throw new BadRequestError('Files must be 25 MB or smaller', 'WORK_FILE_TOO_LARGE');
  await assertCommentFileRoom(issue.id, userId);
  const fileName = input.fileName.slice(0, 255) || 'file';
  const mime = (input.mime || 'application/octet-stream').slice(0, 100);
  const key = commentFileKey(projectId, issue.id, fileName);
  await store.put(key, input.buffer, mime);
  return prisma.workAttachment.create({
    data: { issueId: issue.id, uploaderId: userId, r2Key: key, fileName, mime, size: input.buffer.length, forComment: true, clientVisible: false },
    select: COMMENT_FILE_SELECT,
  });
}

/** Voice note: kiểm kiểu/dung lượng/độ dài ⇒ R2 ⇒ WorkAttachment (bản nháp) + WorkVoiceNote PENDING. */
export async function uploadVoiceNote(userId: number, projectId: number, number: number, input: { buffer: Buffer; mime: string; durationMs: number }) {
  const access = await requireProject(userId, projectId, 'attachment.add');
  await requireProject(userId, projectId, 'comment.create'); // voice note chỉ sống trong bình luận
  assertStorage();
  const issue = await visibleIssue(access, number);
  const check = checkVoice({ size: input.buffer.length, mime: input.mime, durationMs: input.durationMs });
  if (!check.ok) throw new BadRequestError(check.message, check.code);
  await assertCommentFileRoom(issue.id, userId);
  const mime = baseMime(input.mime);
  const stamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
  const fileName = `voice-note-${stamp}.${voiceExt(mime)}`;
  const key = commentFileKey(projectId, issue.id, fileName);
  await store.put(key, input.buffer, mime);
  return prisma.workAttachment.create({
    data: {
      issueId: issue.id, uploaderId: userId, r2Key: key, fileName, mime, size: input.buffer.length, forComment: true, clientVisible: false,
      voice: { create: { durationMs: check.durationMs, transcriptStatus: 'PENDING' } },
    },
    select: COMMENT_FILE_SELECT,
  });
}

// ─── Gắn vào bình luận ───────────────────────────────────────────

/**
 * Gắn bản nháp vào bình luận (trong transaction tạo bình luận). Chỉ tệp của CHÍNH người gửi, cùng thẻ, chưa gắn —
 * không "nhận" được tệp của người khác hay của bình luận khác. Trả tên tệp + id voice note để dựng chữ tìm kiếm.
 */
export async function attachDrafts(
  tx: Prisma.TransactionClient, input: { userId: number; issueId: number; commentId: number; attachmentIds: number[] },
): Promise<{ fileNames: string[]; voiceIds: number[] }> {
  const ids = [...new Set(input.attachmentIds)];
  if (!ids.length) return { fileNames: [], voiceIds: [] };
  if (ids.length > MAX_FILES_PER_COMMENT) throw new BadRequestError(`A comment can have at most ${MAX_FILES_PER_COMMENT} files`, 'WORK_LIMIT');
  const rows = await tx.workAttachment.findMany({
    where: { id: { in: ids }, issueId: input.issueId, uploaderId: input.userId, forComment: true, commentId: null },
    select: { id: true, fileName: true, voice: { select: { attachmentId: true } } },
  });
  if (rows.length !== ids.length) throw new BadRequestError('Some files are missing or were already sent — upload them again', 'WORK_BAD_ATTACHMENT');
  await tx.workAttachment.updateMany({ where: { id: { in: ids } }, data: { commentId: input.commentId } });
  return { fileNames: rows.filter((r) => !r.voice).map((r) => r.fileName), voiceIds: rows.filter((r) => r.voice).map((r) => r.id) };
}

/** Dựng lại bodyText = chữ người gõ + phiên âm + (thân trống) tên tệp. Gọi sau khi sửa bình luận / phiên âm xong. */
export async function refreshCommentText(commentId: number, db: Prisma.TransactionClient | typeof prisma = prisma): Promise<string | null> {
  const c = await db.workComment.findUnique({
    where: { id: commentId },
    select: { bodyJson: true, attachments: { orderBy: { id: 'asc' }, select: { fileName: true, voice: { select: { transcript: true, transcriptStatus: true } } } } },
  });
  if (!c) return null;
  const voices = c.attachments.filter((a) => a.voice);
  const text = commentSearchText(tiptapToText(c.bodyJson), {
    transcripts: voices.map((a) => (a.voice!.transcriptStatus === 'DONE' ? a.voice!.transcript : null)),
    voiceCount: voices.length,
    fileNames: c.attachments.filter((a) => !a.voice).map((a) => a.fileName),
  });
  await db.workComment.update({ where: { id: commentId }, data: { bodyText: text } });
  return text;
}

// ─── Phiên âm ────────────────────────────────────────────────────

function dailyLimit(): number {
  const n = Number(process.env.WORK_VOICE_STT_DAILY);
  return Number.isFinite(n) && n >= 0 ? n : VOICE_STT_DAILY_DEFAULT;
}

async function setStatus(attachmentId: number, status: TranscriptStatus, extra: { transcript?: string | null; language?: string | null } = {}) {
  await prisma.workVoiceNote.update({
    where: { attachmentId },
    data: { transcriptStatus: status, transcribedAt: status === 'PENDING' ? null : new Date(), transcript: extra.transcript ?? null, language: extra.language ?? null },
  });
}

/** Báo màn hình đang mở thẻ: phiên âm đổi ⇒ tải lại bình luận. Khách cổng chỉ nhận "portal.changed" khi đúng thứ họ thấy. */
async function announce(attachmentId: number) {
  const a = await prisma.workAttachment.findUnique({
    where: { id: attachmentId },
    select: { commentId: true, issue: { select: { projectId: true, number: true, clientVisible: true } }, comment: { select: { visibility: true, deletedAt: true } } },
  });
  if (!a?.commentId) return;
  const io = getIO();
  io?.to(projectRoom(a.issue.projectId)).emit('work:comment-voice', { projectId: a.issue.projectId, number: a.issue.number, commentId: a.commentId, attachmentId });
  if (a.comment?.visibility === 'PUBLIC' && !a.comment.deletedAt && a.issue.clientVisible) {
    io?.to(clientRoom(a.issue.projectId)).emit('work:event', { type: 'portal.changed', projectId: a.issue.projectId });
  }
}

/** Phiên âm MỘT voice note (đã gắn bình luận). Không ném ra ngoài — lỗi thành trạng thái FAILED. */
export async function transcribeVoiceNote(attachmentId: number): Promise<TranscriptStatus> {
  const a = await prisma.workAttachment.findUnique({
    where: { id: attachmentId },
    select: { r2Key: true, fileName: true, mime: true, commentId: true, issue: { select: { projectId: true } }, voice: { select: { durationMs: true } } },
  });
  if (!a?.voice || !a.commentId) return 'FAILED';
  let status: TranscriptStatus = 'FAILED';
  try {
    if (!sttConfigured()) {
      status = 'NO_KEY';
      await setStatus(attachmentId, status);
    } else {
      // K-3: trần chung với voice note của kênh chat (một hạn mức Groq cho cả dự án).
      const used = await sttUsedToday(a.issue.projectId);
      if (used >= dailyLimit()) {
        status = 'LIMIT';
        await setStatus(attachmentId, status);
      } else {
        const audio = await store.read(a.r2Key);
        const stt: SttFn = sttOverride ?? (async (buf, name, mime) => {
          const { transcribeWithGroq } = await import('../interview/voice/stt.js');
          // language '' ⇒ BỎ trường ⇒ Whisper tự dò (nhóm nói Việt lẫn Anh) — xem chú thích trong stt.ts.
          return transcribeWithGroq(buf, name, mime, { language: '', detail: true });
        });
        const r = await stt(audio, a.fileName, a.mime);
        const { checkHeardSpeech } = await import('../makerlab/hallucination.js');
        const check = checkHeardSpeech(r.text, { noSpeechProb: r.noSpeechProb, avgLogprob: r.avgLogprob, audioSec: a.voice.durationMs / 1000 });
        status = check.ok ? 'DONE' : 'NO_SPEECH';
        await setStatus(attachmentId, status, check.ok ? { transcript: r.text.trim().slice(0, 20_000), language: r.language?.slice(0, 12) ?? null } : {});
      }
    }
  } catch (err) {
    // Chỉ ghi lỗi kỹ thuật — KHÔNG ghi transcript/audio (dữ liệu cá nhân).
    logger.warn('[work] voice note: phiên âm lỗi', { attachmentId, err: (err as Error).message.slice(0, 300) });
    status = 'FAILED';
    await setStatus(attachmentId, status).catch(() => {});
  }
  await refreshCommentText(a.commentId).catch(() => null);
  await announce(attachmentId).catch(() => {});
  return status;
}

/** Xếp phiên âm nền cho các voice note vừa gửi (tuần tự — không bắn chùm vào hạn mức Groq). */
export function queueTranscriptions(attachmentIds: number[]): void {
  if (!attachmentIds.length) return;
  const p = (async () => {
    for (const id of attachmentIds) await transcribeVoiceNote(id);
  })().catch(() => {});
  pending.add(p);
  void p.finally(() => pending.delete(p));
}

/** Thử phiên âm lại (lỗi/hết trần/chưa có khoá). Người gửi hoặc ADMIN dự án. */
export async function retryTranscription(userId: number, projectId: number, attachmentId: number) {
  const access = await requireProject(userId, projectId, 'comment.create');
  const a = await prisma.workAttachment.findFirst({
    where: { id: attachmentId, issue: { projectId, deletedAt: null }, commentId: { not: null }, comment: { deletedAt: null } },
    select: { uploaderId: true, voice: { select: { transcriptStatus: true } } },
  });
  if (!a?.voice || isClientScoped(access)) throw new NotFoundError('Voice note not found');
  if (a.uploaderId !== userId && access.role !== 'ADMIN') throw new ForbiddenError('Only the sender or a project admin can retry');
  if (a.voice.transcriptStatus === 'PENDING' || a.voice.transcriptStatus === 'DONE') return { status: a.voice.transcriptStatus };
  await setStatus(attachmentId, 'PENDING');
  const status = await transcribeVoiceNote(attachmentId);
  return { status };
}

/** Bỏ bản nháp (người dùng gỡ chip trước khi gửi). */
export async function discardDraft(userId: number, projectId: number, attachmentId: number) {
  await requireProject(userId, projectId, 'project.view');
  const a = await prisma.workAttachment.findFirst({ where: { id: attachmentId, uploaderId: userId, forComment: true, commentId: null, issue: { projectId } }, select: { id: true, r2Key: true } });
  if (!a) throw new NotFoundError('Draft file not found');
  await prisma.workAttachment.delete({ where: { id: a.id } });
  void store.del(a.r2Key).catch(() => {});
  return { deleted: true };
}
