/**
 * CT Work K-2 (10/10/2026) — họp: agenda có cấu trúc, RSVP, điểm danh, ghi âm có đồng ý, phiên âm, biên bản AI.
 * Gắn trong work.routes.ts (đã qua apiTokenAuth + authenticate + chốt /projects/:pid + chốt cổng khách — khách cổng
 * gọi /meetings/** ⇒ 403 CLIENT_PORTAL_ONLY). Quyền chi tiết TRONG service (meetingRec.service.ts).
 *
 *   GET/PUT  /projects/:pid/meeting-settings                       hạn lưu audio, trần phiên âm/ngày, nhắc họp
 *   GET      /projects/:pid/meetings-attendance?from=&to=           báo cáo chuyên cần theo người
 *   GET      /projects/:pid/meetings/:num/room                      dữ liệu K-2 của cuộc họp
 *   PUT      /projects/:pid/meetings/:num/agenda-items              agenda có cấu trúc
 *   PUT      /projects/:pid/meetings/:num/recording-link            link bản ghi hình ngoài (Meet/Zoom…)
 *   POST     /projects/:pid/meetings/:num/rsvp | join | leave
 *   PUT      /projects/:pid/meetings/:num/attendance                chủ trì điểm danh tay
 *   POST     /projects/:pid/meetings/:num/recordings                mở lượt ghi (LIVE: hỏi đồng ý / UPLOAD: tệp có sẵn)
 *   POST     …/recordings/:rid/consent | begin | end | retry
 *   POST     …/recordings/:rid/chunks                              multipart `audio` + seq/startMs/durationMs/speakerId
 *   GET      …/recordings/:rid/chunks/:seq/audio                    link nghe (ký sẵn)
 *   DELETE   …/recordings/:rid/audio                                xoá audio, giữ transcript
 *   PUT      …/recordings/:rid/speakers                             gán người nói
 *   GET      /projects/:pid/meetings/:num/transcript
 *   POST     /projects/:pid/meetings/:num/minutes-ai                AI đề xuất biên bản
 *   POST     /projects/:pid/meetings/:num/minutes-ai/:did/apply | dismiss
 *   GET      /projects/:pid/meetings/:num/minutes-export?format=docx|pdf&lang=vi|en   mẫu biên bản FPT
 */

import { Router, type NextFunction, type Request, type Response } from 'express';
import multer from 'multer';
import { z, ZodError } from 'zod';
import { AppError, asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as rec from '../services/work/meetingRec.service.js';
import { agendaItemSchema, ATTENDANCE, CHUNK_MAX_BYTES, RSVPS } from '../services/work/meetingRules.js';

const router = Router();

function callerId(req: Request): number {
  const id = req.userId ?? req.user?.userId;
  if (!id) throw new UnauthorizedError();
  return id;
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
const M = (req: Request) => [callerId(req), P(req, 'pid'), P(req, 'num')] as const;

/** Audio chỉ trong RAM (dữ liệu cá nhân), đẩy thẳng lên R2 trong service. */
function receiveAudio(req: Request, res: Response, next: NextFunction) {
  const up = multer({ storage: multer.memoryStorage(), limits: { fileSize: CHUNK_MAX_BYTES, files: 1 } });
  up.single('audio')(req, res, (err: unknown) => {
    if (!err) { next(); return; }
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      next(new AppError('Each audio chunk must be 24 MB or smaller', 413, 'WORK_FILE_TOO_LARGE'));
      return;
    }
    next(new BadRequestError('Could not read the uploaded audio', 'WORK_BAD_UPLOAD'));
  });
}

// ─── Cấu hình + chuyên cần ───────────────────────────────────────

router.get('/projects/:pid/meeting-settings', asyncHandler(async (req, res) => {
  ok(res, await rec.getMeetingSettings(callerId(req), P(req, 'pid')));
}));
router.put('/projects/:pid/meeting-settings', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    audioRetentionDays: z.number().int().min(1).max(365).optional(),
    sttDailyLimit: z.number().int().min(0).max(5000).nullable().optional(),
    reminderMinutes: z.number().int().min(0).max(1440).optional(),
    remindInChat: z.boolean().optional(),
  }), req.body ?? {});
  ok(res, await rec.updateMeetingSettings(callerId(req), P(req, 'pid'), body));
}));
router.get('/projects/:pid/meetings-attendance', asyncHandler(async (req, res) => {
  const q = parse(z.object({ from: z.coerce.date().optional(), to: z.coerce.date().optional() }), req.query);
  ok(res, await rec.attendanceReport(callerId(req), P(req, 'pid'), q));
}));

// ─── Phòng họp ───────────────────────────────────────────────────

router.get('/projects/:pid/meetings/:num/room', asyncHandler(async (req, res) => {
  ok(res, await rec.getRoom(...M(req)));
}));
router.put('/projects/:pid/meetings/:num/agenda-items', asyncHandler(async (req, res) => {
  const { items } = parse(z.object({ items: z.array(agendaItemSchema).max(50) }), req.body ?? {});
  ok(res, await rec.setAgendaItems(...M(req), items));
}));
router.put('/projects/:pid/meetings/:num/recording-link', asyncHandler(async (req, res) => {
  const { url } = parse(z.object({ url: z.string().max(500).nullable() }), req.body ?? {});
  ok(res, await rec.setRecordingLink(...M(req), url));
}));
router.post('/projects/:pid/meetings/:num/rsvp', asyncHandler(async (req, res) => {
  const body = parse(z.object({ rsvp: z.enum(RSVPS), note: z.string().max(300).nullable().optional() }), req.body ?? {});
  ok(res, await rec.rsvp(...M(req), body));
}));
router.post('/projects/:pid/meetings/:num/join', asyncHandler(async (req, res) => {
  ok(res, await rec.joinMeeting(...M(req)));
}));
router.post('/projects/:pid/meetings/:num/leave', asyncHandler(async (req, res) => {
  ok(res, await rec.leaveMeeting(...M(req)));
}));
router.put('/projects/:pid/meetings/:num/attendance', asyncHandler(async (req, res) => {
  const { items } = parse(z.object({ items: z.array(z.object({ userId: z.number().int().positive(), attendance: z.enum(ATTENDANCE).nullable() })).min(1).max(200) }), req.body ?? {});
  ok(res, await rec.markAttendance(...M(req), items));
}));

// ─── Ghi âm ──────────────────────────────────────────────────────

router.post('/projects/:pid/meetings/:num/recordings', asyncHandler(async (req, res) => {
  const body = parse(z.object({ source: z.enum(['LIVE', 'UPLOAD']), fileName: z.string().max(255).nullable().optional(), confirmConsent: z.boolean().optional() }), req.body ?? {});
  ok(res, await rec.startRecording(...M(req), body), 201);
}));
router.post('/projects/:pid/meetings/:num/recordings/:rid/consent', asyncHandler(async (req, res) => {
  const { agree } = parse(z.object({ agree: z.boolean() }), req.body ?? {});
  ok(res, await rec.consent(...M(req), P(req, 'rid'), agree));
}));
router.post('/projects/:pid/meetings/:num/recordings/:rid/begin', asyncHandler(async (req, res) => {
  ok(res, await rec.beginRecording(...M(req), P(req, 'rid')));
}));
router.post('/projects/:pid/meetings/:num/recordings/:rid/end', asyncHandler(async (req, res) => {
  ok(res, await rec.endRecording(...M(req), P(req, 'rid')));
}));
router.post('/projects/:pid/meetings/:num/recordings/:rid/retry', asyncHandler(async (req, res) => {
  ok(res, await rec.retryTranscription(...M(req), P(req, 'rid')));
}));
router.post('/projects/:pid/meetings/:num/recordings/:rid/chunks', receiveAudio, asyncHandler(async (req, res) => {
  const f = req.file;
  if (!f?.buffer?.length) throw new BadRequestError('The audio chunk is empty', 'WORK_AUDIO_EMPTY');
  const b = parse(z.object({
    seq: z.coerce.number().int().min(0).max(10_000),
    startMs: z.coerce.number().min(0).max(24 * 3600_000),
    durationMs: z.coerce.number().min(0).max(3600_000),
    speakerId: z.coerce.number().int().positive().optional(),
  }), req.body ?? {});
  ok(res, await rec.uploadChunk(...M(req), P(req, 'rid'), { buffer: f.buffer, mime: f.mimetype, ...b }), 201);
}));
router.get('/projects/:pid/meetings/:num/recordings/:rid/chunks/:seq/audio', asyncHandler(async (req, res) => {
  const seq = parse(z.coerce.number().int().min(0), req.params.seq);
  ok(res, await rec.chunkAudioUrl(...M(req), P(req, 'rid'), seq));
}));
router.delete('/projects/:pid/meetings/:num/recordings/:rid/audio', asyncHandler(async (req, res) => {
  ok(res, await rec.deleteAudio(...M(req), P(req, 'rid')));
}));
router.put('/projects/:pid/meetings/:num/recordings/:rid/speakers', asyncHandler(async (req, res) => {
  const { items } = parse(z.object({ items: z.array(z.object({ lineId: z.string().max(20), speakerId: z.number().int().positive().nullable() })).min(1).max(2000) }), req.body ?? {});
  ok(res, await rec.assignSpeakers(...M(req), P(req, 'rid'), items));
}));

// ─── Transcript + biên bản AI + xuất ─────────────────────────────

router.get('/projects/:pid/meetings/:num/transcript', asyncHandler(async (req, res) => {
  ok(res, await rec.getTranscript(...M(req)));
}));
router.post('/projects/:pid/meetings/:num/minutes-ai', asyncHandler(async (req, res) => {
  const body = parse(z.object({ language: z.enum(['vi', 'en']).optional(), recordingId: z.number().int().positive().nullable().optional() }), req.body ?? {});
  ok(res, await rec.proposeMinutes(...M(req), body), 201);
}));
router.post('/projects/:pid/meetings/:num/minutes-ai/:did/apply', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    skipDecisions: z.array(z.number().int().min(0)).max(100).optional(),
    skipActions: z.array(z.number().int().min(0)).max(100).optional(),
    createIssues: z.boolean().optional(),
  }), req.body ?? {});
  ok(res, await rec.applyMinutes(...M(req), P(req, 'did'), body));
}));
router.post('/projects/:pid/meetings/:num/minutes-ai/:did/dismiss', asyncHandler(async (req, res) => {
  ok(res, await rec.dismissMinutes(...M(req), P(req, 'did')));
}));
router.get('/projects/:pid/meetings/:num/minutes-export', asyncHandler(async (req, res) => {
  const q = parse(z.object({ format: z.enum(['docx', 'pdf']).default('docx'), lang: z.enum(['vi', 'en']).default('vi') }), req.query);
  const out = await rec.exportMinutes(...M(req), q.format, q.lang);
  res.setHeader('Content-Type', q.format === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${out.file.replace(/[^\x20-\x7e]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(out.file)}`);
  res.setHeader('Cache-Control', 'no-store');
  res.send(out.buffer);
}));

export default router;
