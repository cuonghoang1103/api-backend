/**
 * CT Work K-3 (10/10/2026) — KÊNH CHAT DỰ ÁN. Gắn trong work.routes.ts (sau apiTokenAuth + authenticate + chốt
 * /projects/:pid: phạm vi token agent, cổng khách). Quyền kiểm TRONG service (chat.service.ts / chatFiles.service.ts).
 * AI agent KHÔNG gọi các tuyến này (AGENT_DENIED_ROUTES) — agent đọc/ghi kênh qua registry: chat_channels / chat_read /
 * chat_post (MCP · agent BUILTIN), cùng hàm service, cùng luật.
 *
 *   GET    /chat/unread                                     badge mọi dự án (sidebar + tiêu đề tab)
 *   GET    /chat/prefs · PUT /chat/prefs                    cài đặt chat CHUNG của người (tắt tiếng toàn bộ, chế độ báo, âm, thông báo hệ thống, email tóm tắt)
 *   GET    /projects/:pid/chat/channels[?archived=1]        danh sách kênh + đếm chưa đọc + quyền của tôi
 *   POST   /projects/:pid/chat/channels                     { name, topic?, kind: PUBLIC|PRIVATE|CLIENT, memberIds? }
 *   PATCH  /projects/:pid/chat/channels/:cid                { name?, topic?, archived? }
 *   GET|PUT /projects/:pid/chat/channels/:cid/members       thành viên (+online) · { add?, remove? } (kênh riêng)
 *   PUT    /projects/:pid/chat/channels/:cid/notify         { mute?: 30m|1h|8h|tomorrow|forever|custom|off, until?, notify?: DEFAULT|ALL|MENTIONS }
 *   POST   /projects/:pid/chat/channels/:cid/read           { messageId? } · POST /projects/:pid/chat/read-all
 *   GET    /projects/:pid/chat/channels/:cid/messages       ?before|after|around&limit
 *   POST   /projects/:pid/chat/channels/:cid/messages       { body, parentId?, fileIds?, clientKey? } — RATE-LIMIT theo người
 *   GET|PATCH|DELETE /…/messages/:mid · GET /…/messages/:mid/thread
 *   PUT    /…/messages/:mid/reactions/:emoji { active? } · PUT /…/messages/:mid/pin { pinned }
 *   POST   /…/messages/:mid/issue { typeId, title? } · POST /…/messages/:mid/forward { toChannelId, note? }
 *   GET    /…/pinned · GET /…/search?q= · POST /…/call { url? }
 *   POST   /…/files (multipart `file` ≤ 25 MB) · POST /…/voice (multipart `audio` ≤ 8 MB + durationMs ≤ 3 phút)
 *   DELETE /projects/:pid/chat/files/:fid · GET /projects/:pid/chat/files/:fid/url[?inline=1] · POST /…/files/:fid/transcribe
 */

import { Router, type NextFunction, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import { z, ZodError } from 'zod';
import { AppError, asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as chat from '../services/work/chat.service.js';
import * as files from '../services/work/chatFiles.service.js';
import { CHANNEL_KINDS, CHANNEL_NOTIFY, MAX_BODY, MUTE_CHOICES, NOTIFY_MODES } from '../services/work/chatRules.js';
import { VOICE_MAX_BYTES } from '../services/work/commentThreads.js';

const router = Router();

function callerId(req: Request): number {
  const v = req.userId ?? req.user?.userId;
  if (!v) throw new UnauthorizedError();
  return v;
}
const ok = (r: Response, data: unknown, status = 200) => r.status(status).json({ success: true, data });
function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  try {
    return schema.parse(value);
  } catch (err) {
    if (err instanceof ZodError) {
      const first = err.issues[0];
      throw new AppError(`${first?.path.length ? `${first.path.join('.')}: ` : ''}${first?.message ?? 'Invalid input'}`, 400, 'VALIDATION_ERROR');
    }
    throw err;
  }
}
const id = z.coerce.number().int().positive();
const P = (req: Request, name: string) => parse(id, req.params[name]);

/** Trần gửi tin theo NGƯỜI (không theo IP — cả lớp ngồi chung một mạng trường). */
function perUser(name: string, envKey: string, def: number) {
  return rateLimit({
    windowMs: 60_000,
    max: () => Number(process.env[envKey] || def),
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => `${name}:${req.userId ?? req.user?.userId ?? req.ip}`,
    validate: false,
    message: { success: false, message: 'You are sending messages too fast — wait a moment and try again.', code: 'RATE_LIMIT_EXCEEDED' },
  });
}
const sendLimiter = perUser('chat-send', 'WORK_CHAT_RPM', 40);
const uploadLimiter = perUser('chat-upload', 'WORK_CHAT_UPLOAD_RPM', 20);

function receive(field: string, maxBytes: number, label: string) {
  const up = multer({ storage: multer.memoryStorage(), limits: { fileSize: maxBytes, files: 1 } });
  return (req: Request, res: Response, next: NextFunction) => {
    up.single(field)(req, res, (err: unknown) => {
      if (!err) { next(); return; }
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        next(new AppError(`${label} must be ${Math.round(maxBytes / 1024 / 1024)} MB or smaller`, 413, 'WORK_FILE_TOO_LARGE'));
        return;
      }
      next(new BadRequestError('Could not read the uploaded file', 'WORK_BAD_UPLOAD'));
    });
  };
}
const utf8Name = (n: string) => {
  try { return Buffer.from(n, 'latin1').toString('utf8'); } catch { return n; }
};

const muteBody = { mute: z.enum(MUTE_CHOICES).optional(), until: z.string().max(40).nullable().optional() };

// ─── Cấp người dùng ──────────────────────────────────────────────

router.get('/chat/unread', asyncHandler(async (req, res) => { ok(res, await chat.unreadAll(callerId(req))); }));
router.get('/chat/prefs', asyncHandler(async (req, res) => { ok(res, await chat.getPrefs(callerId(req))); }));
router.put('/chat/prefs', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    ...muteBody, notify: z.enum(NOTIFY_MODES).optional(), sound: z.boolean().optional(), desktop: z.boolean().optional(), emailDigest: z.boolean().optional(),
  }), req.body ?? {});
  ok(res, await chat.setPrefs(callerId(req), body));
}));

// ─── Kênh ────────────────────────────────────────────────────────

const B = '/projects/:pid/chat';
const C = `${B}/channels/:cid`;
const M = `${C}/messages/:mid`;

router.get(`${B}/channels`, asyncHandler(async (req, res) => {
  ok(res, await chat.listChannels(callerId(req), P(req, 'pid'), { includeArchived: req.query.archived === '1' }));
}));
router.post(`${B}/channels`, asyncHandler(async (req, res) => {
  const body = parse(z.object({
    name: z.string().min(1).max(60), topic: z.string().max(250).nullable().optional(), kind: z.enum(CHANNEL_KINDS).default('PUBLIC'),
    memberIds: z.array(id).max(200).optional(),
  }), req.body);
  ok(res, await chat.createChannel(callerId(req), P(req, 'pid'), body), 201);
}));
router.patch(C, asyncHandler(async (req, res) => {
  const body = parse(z.object({ name: z.string().min(1).max(60).optional(), topic: z.string().max(250).nullable().optional(), archived: z.boolean().optional() }), req.body);
  ok(res, await chat.updateChannel(callerId(req), P(req, 'pid'), P(req, 'cid'), body));
}));
router.get(`${C}/members`, asyncHandler(async (req, res) => { ok(res, await chat.channelMembers(callerId(req), P(req, 'pid'), P(req, 'cid'))); }));
router.put(`${C}/members`, asyncHandler(async (req, res) => {
  const body = parse(z.object({ add: z.array(id).max(200).optional(), remove: z.array(id).max(200).optional() }), req.body);
  ok(res, await chat.setChannelMembers(callerId(req), P(req, 'pid'), P(req, 'cid'), body));
}));
router.put(`${C}/notify`, asyncHandler(async (req, res) => {
  const body = parse(z.object({ ...muteBody, notify: z.enum(CHANNEL_NOTIFY).optional() }), req.body ?? {});
  ok(res, await chat.setChannelNotify(callerId(req), P(req, 'pid'), P(req, 'cid'), body));
}));
router.post(`${C}/read`, asyncHandler(async (req, res) => {
  const { messageId } = parse(z.object({ messageId: id.optional() }), req.body ?? {});
  ok(res, await chat.markRead(callerId(req), P(req, 'pid'), P(req, 'cid'), messageId));
}));
router.post(`${B}/read-all`, asyncHandler(async (req, res) => { ok(res, await chat.markAllRead(callerId(req), P(req, 'pid'))); }));
router.get(`${C}/pinned`, asyncHandler(async (req, res) => { ok(res, await chat.listPinned(callerId(req), P(req, 'pid'), P(req, 'cid'))); }));
router.get(`${C}/search`, asyncHandler(async (req, res) => {
  ok(res, await chat.searchMessages(callerId(req), P(req, 'pid'), P(req, 'cid'), String(req.query.q ?? '')));
}));
router.post(`${C}/call`, sendLimiter, asyncHandler(async (req, res) => {
  const body = parse(z.object({ url: z.string().max(500).nullable().optional() }), req.body ?? {});
  ok(res, await chat.startCall(callerId(req), P(req, 'pid'), P(req, 'cid'), body));
}));

// ─── Tin nhắn ────────────────────────────────────────────────────

router.get(`${C}/messages`, asyncHandler(async (req, res) => {
  const q = parse(z.object({ before: id.optional(), after: id.optional(), around: id.optional(), limit: z.coerce.number().int().min(1).max(100).optional() }), req.query);
  ok(res, await chat.listMessages(callerId(req), P(req, 'pid'), P(req, 'cid'), q));
}));
router.post(`${C}/messages`, sendLimiter, asyncHandler(async (req, res) => {
  const body = parse(z.object({
    body: z.string().max(MAX_BODY + 2000).default(''), parentId: id.nullable().optional(), fileIds: z.array(id).max(10).optional(),
    clientKey: z.string().max(64).regex(/^[\w-]+$/).nullable().optional(),
  }), req.body);
  ok(res, await chat.postMessage(callerId(req), P(req, 'pid'), P(req, 'cid'), body), 201);
}));
router.get(M, asyncHandler(async (req, res) => { ok(res, await chat.getMessage(callerId(req), P(req, 'pid'), P(req, 'cid'), P(req, 'mid'))); }));
router.get(`${M}/thread`, asyncHandler(async (req, res) => { ok(res, await chat.getThread(callerId(req), P(req, 'pid'), P(req, 'cid'), P(req, 'mid'))); }));
router.patch(M, sendLimiter, asyncHandler(async (req, res) => {
  const { body } = parse(z.object({ body: z.string().max(MAX_BODY + 2000) }), req.body);
  ok(res, await chat.editMessage(callerId(req), P(req, 'pid'), P(req, 'cid'), P(req, 'mid'), body));
}));
router.delete(M, asyncHandler(async (req, res) => { ok(res, await chat.deleteMessage(callerId(req), P(req, 'pid'), P(req, 'cid'), P(req, 'mid'))); }));
router.put(`${M}/reactions/:emoji`, asyncHandler(async (req, res) => {
  const { active } = parse(z.object({ active: z.boolean().optional() }), req.body ?? {});
  ok(res, await chat.toggleReaction(callerId(req), P(req, 'pid'), P(req, 'cid'), P(req, 'mid'), String(req.params.emoji ?? ''), active));
}));
router.put(`${M}/pin`, asyncHandler(async (req, res) => {
  const { pinned } = parse(z.object({ pinned: z.boolean() }), req.body);
  ok(res, await chat.setPinned(callerId(req), P(req, 'pid'), P(req, 'cid'), P(req, 'mid'), pinned));
}));
router.post(`${M}/issue`, asyncHandler(async (req, res) => {
  const body = parse(z.object({ typeId: id, title: z.string().max(255).nullable().optional() }), req.body);
  ok(res, await chat.createIssueFromMessage(callerId(req), P(req, 'pid'), P(req, 'cid'), P(req, 'mid'), body), 201);
}));
router.post(`${M}/forward`, sendLimiter, asyncHandler(async (req, res) => {
  const body = parse(z.object({ toChannelId: id, note: z.string().max(2000).nullable().optional() }), req.body);
  ok(res, await chat.forwardMessage(callerId(req), P(req, 'pid'), P(req, 'cid'), P(req, 'mid'), body), 201);
}));

// ─── Tệp / voice note ────────────────────────────────────────────

router.post(`${C}/files`, uploadLimiter, receive('file', files.MAX_CHAT_FILE_BYTES, 'Files'), asyncHandler(async (req, res) => {
  const f = req.file;
  if (!f?.buffer?.length) throw new BadRequestError('Choose a file to attach', 'WORK_FILE_EMPTY');
  ok(res, await files.uploadChatFile(callerId(req), P(req, 'pid'), P(req, 'cid'), { buffer: f.buffer, fileName: utf8Name(f.originalname || 'file'), mime: f.mimetype }), 201);
}));
router.post(`${C}/voice`, uploadLimiter, receive('audio', VOICE_MAX_BYTES, 'Voice notes'), asyncHandler(async (req, res) => {
  const f = req.file;
  if (!f?.buffer?.length) throw new BadRequestError('The recording is empty', 'WORK_VOICE_EMPTY');
  const { durationMs } = parse(z.object({ durationMs: z.coerce.number().int().min(0).max(3_600_000) }), req.body ?? {});
  ok(res, await files.uploadChatVoice(callerId(req), P(req, 'pid'), P(req, 'cid'), { buffer: f.buffer, mime: f.mimetype, durationMs }), 201);
}));
router.delete(`${B}/files/:fid`, asyncHandler(async (req, res) => { ok(res, await files.discardChatDraft(callerId(req), P(req, 'pid'), P(req, 'fid'))); }));
router.get(`${B}/files/:fid/url`, asyncHandler(async (req, res) => {
  ok(res, { url: await files.chatFileUrl(callerId(req), P(req, 'pid'), P(req, 'fid'), req.query.inline === '1') });
}));
router.post(`${B}/files/:fid/transcribe`, asyncHandler(async (req, res) => { ok(res, await files.retryChatTranscription(callerId(req), P(req, 'pid'), P(req, 'fid'))); }));

export default router;
