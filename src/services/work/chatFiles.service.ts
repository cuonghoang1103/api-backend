/**
 * CT Work K-3 — ẢNH / TỆP / VOICE NOTE trong kênh chat dự án. Dùng lại hạ tầng của K-1 (commentFiles.service.ts):
 * cùng kho R2 (test thay một chỗ), cùng luật voice note (`checkVoice`: ≤ 3 phút, ≤ 8 MB, đúng kiểu audio), cùng STT Groq
 * (`runStt` + `checkHeardSpeech`), cùng TRẦN lượt phiên âm/ngày của dự án (cộng chung bình luận + chat).
 *
 * Đường tải: LUÔN qua backend (multer trong RAM ⇒ R2) — chạy được cả app desktop (CSP chặn PUT thẳng R2) và server tự
 * kiểm kiểu/dung lượng trước khi ghi. Tệp ≤ 25 MB. Bản nháp (messageId null) chỉ người tải lên gắn vào tin của CHÍNH họ,
 * tự dọn sau 24 giờ. Xem/tải: URL ký sẵn ngắn hạn, xin LÚC CẦN, kiểm quyền thấy kênh mỗi lần.
 * Quyền riêng tư: audio chỉ nằm trong RAM khi phiên âm; transcript KHÔNG ghi vào log; xoá tin ⇒ xoá object R2.
 */

import crypto from 'node:crypto';
import { prisma } from '../../config/database.js';
import { getSignedDownloadUrl } from '../../config/r2.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { getIO } from '../../socket/messaging.socket.js';
import { logger } from '../../utils/logger.js';
import { baseMime, checkVoice, voiceExt, type TranscriptStatus } from './commentThreads.js';
import {
  assertCommentStorage, commentStore, MAX_COMMENT_FILE_BYTES, runStt, sttDailyLimit, sttReady, sttUsedToday, trackBackground,
} from './commentFiles.service.js';
import { chatAudience, canPostInChannel, canViewChannel } from './chatRules.js';
import { requireProject, type ProjectAccess } from './permissions.js';
import { chatRoom } from './chat.service.js';

export const MAX_CHAT_FILE_BYTES = MAX_COMMENT_FILE_BYTES; // 25 MB — như K-1
const MAX_DRAFTS_PER_USER = 30;

const FILE_SELECT = { id: true, fileName: true, mime: true, size: true, durationMs: true, transcriptStatus: true, transcript: true, language: true, createdAt: true } as const;

function present(f: { id: number; fileName: string; mime: string; size: number; durationMs: number | null; transcriptStatus: string | null; transcript: string | null; language: string | null; createdAt: Date }) {
  return {
    id: f.id, fileName: f.fileName, mime: f.mime, size: f.size, createdAt: f.createdAt,
    voice: f.durationMs !== null ? { durationMs: f.durationMs, transcriptStatus: (f.transcriptStatus ?? 'PENDING') as TranscriptStatus, transcript: f.transcriptStatus === 'DONE' ? f.transcript : null, language: f.language } : null,
  };
}

async function channelAccess(userId: number, projectId: number, channelId: number, wantPost: boolean): Promise<{ access: ProjectAccess; ch: { id: number; kind: string; archivedAt: Date | null } }> {
  const access = await requireProject(userId, projectId, 'project.view');
  const actor = { role: access.role, workspaceRole: access.workspaceRole, principal: access.principal };
  if (!chatAudience(actor)) throw new NotFoundError('Project not found');
  const ch = await prisma.workChannel.findFirst({ where: { id: channelId, projectId }, select: { id: true, kind: true, archivedAt: true } });
  if (!ch) throw new NotFoundError('Channel not found');
  const member = !!(await prisma.workChannelMember.findFirst({ where: { channelId, userId, explicit: true }, select: { userId: true } }));
  if (!canViewChannel(actor, ch, member)) throw new NotFoundError('Channel not found');
  if (wantPost && !canPostInChannel(actor, ch, member)) throw new ForbiddenError(ch.archivedAt ? 'This channel is archived' : 'You can read this channel but not post in it');
  return { access, ch };
}

const safeName = (n: string) => n.replace(/[^\w.\- ]+/g, '_').slice(-120) || 'file';
const fileKey = (projectId: number, channelId: number, name: string) => `work/${projectId}/chat/${channelId}/${crypto.randomUUID()}/${safeName(name)}`;

/** Dọn nháp > 24 giờ của chính người này + trần số nháp đang treo. */
async function draftRoom(channelId: number, userId: number) {
  const stale = await prisma.workChannelFile.findMany({ where: { uploaderId: userId, messageId: null, createdAt: { lt: new Date(Date.now() - 86_400_000) } }, select: { id: true, r2Key: true }, take: 50 });
  if (stale.length) {
    await prisma.workChannelFile.deleteMany({ where: { id: { in: stale.map((s) => s.id) } } });
    for (const s of stale) void commentStore().del(s.r2Key).catch(() => undefined);
  }
  if (await prisma.workChannelFile.count({ where: { channelId, uploaderId: userId, messageId: null } }) >= MAX_DRAFTS_PER_USER) {
    throw new BadRequestError('Too many files waiting to be sent — send or remove some first', 'WORK_LIMIT');
  }
}

export async function uploadChatFile(userId: number, projectId: number, channelId: number, input: { buffer: Buffer; fileName: string; mime: string }) {
  const { ch } = await channelAccess(userId, projectId, channelId, true);
  assertCommentStorage();
  if (!input.buffer.length) throw new BadRequestError('The file is empty', 'WORK_FILE_EMPTY');
  if (input.buffer.length > MAX_CHAT_FILE_BYTES) throw new BadRequestError('Files must be 25 MB or smaller', 'WORK_FILE_TOO_LARGE');
  await draftRoom(ch.id, userId);
  const fileName = input.fileName.slice(0, 255) || 'file';
  // SVG/HTML có thể mang script ⇒ lưu như tệp tải về (không phải ảnh xem trong trang).
  let mime = (input.mime || 'application/octet-stream').slice(0, 100).toLowerCase();
  if (/svg|html|xml|javascript/.test(mime)) mime = 'application/octet-stream';
  const key = fileKey(projectId, ch.id, fileName);
  await commentStore().put(key, input.buffer, mime);
  const f = await prisma.workChannelFile.create({ data: { channelId: ch.id, uploaderId: userId, r2Key: key, fileName, mime, size: input.buffer.length }, select: FILE_SELECT });
  return present(f);
}

export async function uploadChatVoice(userId: number, projectId: number, channelId: number, input: { buffer: Buffer; mime: string; durationMs: number }) {
  const { ch } = await channelAccess(userId, projectId, channelId, true);
  assertCommentStorage();
  const check = checkVoice({ size: input.buffer.length, mime: input.mime, durationMs: input.durationMs });
  if (!check.ok) throw new BadRequestError(check.message, check.code);
  await draftRoom(ch.id, userId);
  const mime = baseMime(input.mime);
  const stamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
  const fileName = `voice-note-${stamp}.${voiceExt(mime)}`;
  const key = fileKey(projectId, ch.id, fileName);
  await commentStore().put(key, input.buffer, mime);
  const f = await prisma.workChannelFile.create({
    data: { channelId: ch.id, uploaderId: userId, r2Key: key, fileName, mime, size: input.buffer.length, durationMs: check.durationMs, transcriptStatus: 'PENDING' },
    select: FILE_SELECT,
  });
  return present(f);
}

export async function discardChatDraft(userId: number, projectId: number, fileId: number) {
  await requireProject(userId, projectId, 'project.view');
  const f = await prisma.workChannelFile.findFirst({ where: { id: fileId, uploaderId: userId, messageId: null, channel: { projectId } }, select: { id: true, r2Key: true } });
  if (!f) throw new NotFoundError('Draft file not found');
  await prisma.workChannelFile.delete({ where: { id: f.id } });
  void commentStore().del(f.r2Key).catch(() => undefined);
  return { deleted: true };
}

/** URL ký sẵn (10 phút; khách 2 phút) — kiểm quyền thấy kênh MỖI lần xin. Tin đã xoá ⇒ 404. */
export async function chatFileUrl(userId: number, projectId: number, fileId: number, inline = false) {
  const f = await prisma.workChannelFile.findFirst({
    where: { id: fileId, channel: { projectId } },
    select: { r2Key: true, fileName: true, channelId: true, uploaderId: true, messageId: true, message: { select: { deletedAt: true } } },
  });
  if (!f) throw new NotFoundError('File not found');
  const { access } = await channelAccess(userId, projectId, f.channelId, false);
  if (f.messageId === null ? f.uploaderId !== userId : f.message?.deletedAt) throw new NotFoundError('File not found');
  const restricted = chatAudience({ role: access.role, workspaceRole: access.workspaceRole }) === 'CLIENT';
  return getSignedDownloadUrl(f.r2Key, restricted ? 120 : 600, inline ? undefined : f.fileName);
}

/** Xoá tin ⇒ gỡ object R2 của nó (dòng giữ lại cho kiểm toán, đánh dấu tên). */
export async function purgeMessageFiles(messageId: number): Promise<void> {
  const files = await prisma.workChannelFile.findMany({ where: { messageId }, select: { id: true, r2Key: true } });
  for (const f of files) void commentStore().del(f.r2Key).catch(() => undefined);
  if (files.length) await prisma.workChannelFile.updateMany({ where: { messageId }, data: { transcript: null } });
}

// ─── Phiên âm voice note của chat ────────────────────────────────

async function setStatus(id: number, status: TranscriptStatus, extra: { transcript?: string | null; language?: string | null } = {}) {
  await prisma.workChannelFile.update({ where: { id }, data: { transcriptStatus: status, transcribedAt: status === 'PENDING' ? null : new Date(), transcript: extra.transcript ?? null, language: extra.language ?? null } });
}

export async function transcribeChatVoice(fileId: number): Promise<TranscriptStatus> {
  const f = await prisma.workChannelFile.findUnique({ where: { id: fileId }, select: { r2Key: true, fileName: true, mime: true, durationMs: true, messageId: true, channelId: true, channel: { select: { projectId: true } } } });
  if (!f || f.durationMs === null || !f.messageId) return 'FAILED';
  let status: TranscriptStatus = 'FAILED';
  try {
    if (!sttReady()) {
      status = 'NO_KEY';
      await setStatus(fileId, status);
    } else if (await sttUsedToday(f.channel.projectId) >= sttDailyLimit()) {
      status = 'LIMIT';
      await setStatus(fileId, status);
    } else {
      const audio = await commentStore().read(f.r2Key);
      const r = await runStt(audio, f.fileName, f.mime);
      const { checkHeardSpeech } = await import('../makerlab/hallucination.js');
      const check = checkHeardSpeech(r.text, { noSpeechProb: r.noSpeechProb, avgLogprob: r.avgLogprob, audioSec: f.durationMs / 1000 });
      status = check.ok ? 'DONE' : 'NO_SPEECH';
      await setStatus(fileId, status, check.ok ? { transcript: r.text.trim().slice(0, 20_000), language: r.language?.slice(0, 12) ?? null } : {});
    }
  } catch (err) {
    logger.warn('[work] chat voice: phiên âm lỗi', { fileId, err: (err as Error).message.slice(0, 300) });
    status = 'FAILED';
    await setStatus(fileId, status).catch(() => undefined);
  }
  getIO()?.to(chatRoom(f.channel.projectId, f.channelId)).emit('work:chat:event', { projectId: f.channel.projectId, channelId: f.channelId, type: 'update', messageId: f.messageId });
  return status;
}

/** Sau khi gửi tin: phiên âm nền TUẦN TỰ các voice note của tin (không bắn chùm vào hạn mức Groq). */
export function queueChatTranscriptions(messageId: number): void {
  const p = (async () => {
    const voices = await prisma.workChannelFile.findMany({ where: { messageId, durationMs: { not: null }, transcriptStatus: 'PENDING' }, select: { id: true } });
    for (const v of voices) await transcribeChatVoice(v.id);
  })().catch(() => undefined);
  trackBackground(p);
}

export async function retryChatTranscription(userId: number, projectId: number, fileId: number) {
  const f = await prisma.workChannelFile.findFirst({ where: { id: fileId, channel: { projectId }, messageId: { not: null }, message: { deletedAt: null } }, select: { uploaderId: true, channelId: true, transcriptStatus: true, durationMs: true } });
  if (!f || f.durationMs === null) throw new NotFoundError('Voice note not found');
  const { access } = await channelAccess(userId, projectId, f.channelId, true);
  if (f.uploaderId !== userId && access.role !== 'ADMIN') throw new ForbiddenError('Only the sender or a project admin can retry');
  if (f.transcriptStatus === 'PENDING' || f.transcriptStatus === 'DONE') return { status: f.transcriptStatus };
  await setStatus(fileId, 'PENDING');
  return { status: await transcribeChatVoice(fileId) };
}
