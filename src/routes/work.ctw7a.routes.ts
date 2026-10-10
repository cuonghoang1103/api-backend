/**
 * CT Work đợt 7a (11/10/2026) — OKR · planning poker · retro board · timer. Gắn trong work.routes.ts bằng `router.use`
 * (sau apiTokenAuth + authenticate + chốt /projects/:pid: phạm vi token agent, cách ly khách cổng, khoá chỉnh sửa).
 * Quyền kiểm TRONG service (okr/poker/retro/timer.service.ts) — route chỉ kiểm đầu vào.
 *
 *   OKR (không gian)  GET /workspaces/:wid/okrs?cycle= · GET|POST /workspaces/:wid/okr-cycles · PATCH|DELETE /workspaces/:wid/okr-cycles/:cid
 *                     POST /workspaces/:wid/okrs/objectives
 *   OKR (dự án)       GET /projects/:pid/okrs?cycle= · POST /projects/:pid/okrs/objectives
 *   OKR (chung)       PATCH|DELETE /okrs/objectives/:oid · POST /okrs/objectives/:oid/key-results · POST /okrs/objectives/:oid/score
 *                     PATCH|DELETE /okrs/key-results/:kid · PUT /okrs/key-results/:kid/links · POST /okrs/key-results/:kid/checkins
 *   Poker             GET|POST /projects/:pid/poker · GET|DELETE /projects/:pid/poker/:sid · POST /projects/:pid/poker/:sid/(items|timer|close)
 *                     DELETE /projects/:pid/poker/:sid/items/:iid · POST /projects/:pid/poker/:sid/items/:iid/(start|vote|reveal|revote|finalize|skip)
 *                     GET /projects/:pid/poker/:sid/items/:iid/suggest · GET /projects/:pid/issues/:num/estimates
 *   Retro             GET|POST /projects/:pid/retros · GET|PATCH|DELETE /projects/:pid/retros/:rid · GET /projects/:pid/retros/:rid/export.docx
 *                     POST /projects/:pid/retros/:rid/cards · PATCH|DELETE …/cards/:cid · POST …/cards/:cid/vote
 *                     POST /projects/:pid/retros/:rid/actions · DELETE …/actions/:aid · POST /projects/:pid/retros/:rid/summary (AI)
 *   Timer             GET /me/timer · POST /me/timer/(pause|resume|stop|discard) · PATCH /me/timer
 *                     GET|POST /projects/:pid/issues/:num/timer (POST = start)
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { AppError, asyncHandler, UnauthorizedError } from '../middleware/errorHandler.js';
import * as okr from '../services/work/okr.service.js';
import * as poker from '../services/work/poker.service.js';
import * as retro from '../services/work/retro.service.js';
import * as timer from '../services/work/timer.service.js';

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
const optCycle = (req: Request) => (req.query.cycle ? parse(id, req.query.cycle) : null);
const lang = (req: Request) => (req.body?.language === 'vi' ? 'vi' : 'en') as 'en' | 'vi';

// ─── OKR ─────────────────────────────────────────────────────────

router.get('/workspaces/:wid/okrs', asyncHandler(async (req, res) => { ok(res, await okr.workspaceOkrs(callerId(req), P(req, 'wid'), optCycle(req))); }));
router.get('/workspaces/:wid/okr-cycles', asyncHandler(async (req, res) => { ok(res, await okr.listCycles(callerId(req), P(req, 'wid'))); }));
router.post('/workspaces/:wid/okr-cycles', asyncHandler(async (req, res) => { ok(res, await okr.createCycle(callerId(req), P(req, 'wid'), parse(okr.cycleInput, req.body)), 201); }));
router.patch('/workspaces/:wid/okr-cycles/:cid', asyncHandler(async (req, res) => { ok(res, await okr.updateCycle(callerId(req), P(req, 'wid'), P(req, 'cid'), parse(okr.cyclePatch, req.body))); }));
router.delete('/workspaces/:wid/okr-cycles/:cid', asyncHandler(async (req, res) => { ok(res, await okr.deleteCycle(callerId(req), P(req, 'wid'), P(req, 'cid'))); }));
router.post('/workspaces/:wid/okrs/objectives', asyncHandler(async (req, res) => {
  ok(res, await okr.createObjective(callerId(req), { workspaceId: P(req, 'wid') }, parse(okr.objectiveInput, req.body)), 201);
}));
router.get('/projects/:pid/okrs', asyncHandler(async (req, res) => { ok(res, await okr.projectOkrs(callerId(req), P(req, 'pid'), optCycle(req))); }));
router.post('/projects/:pid/okrs/objectives', asyncHandler(async (req, res) => {
  ok(res, await okr.createObjective(callerId(req), { projectId: P(req, 'pid') }, parse(okr.objectiveInput, req.body)), 201);
}));
router.patch('/okrs/objectives/:oid', asyncHandler(async (req, res) => { ok(res, await okr.updateObjective(callerId(req), P(req, 'oid'), parse(okr.objectivePatch, req.body))); }));
router.delete('/okrs/objectives/:oid', asyncHandler(async (req, res) => { ok(res, await okr.deleteObjective(callerId(req), P(req, 'oid'))); }));
router.post('/okrs/objectives/:oid/key-results', asyncHandler(async (req, res) => { ok(res, await okr.addKeyResult(callerId(req), P(req, 'oid'), parse(okr.krInput, req.body)), 201); }));
router.post('/okrs/objectives/:oid/score', asyncHandler(async (req, res) => { ok(res, await okr.scoreObjective(callerId(req), P(req, 'oid'), parse(okr.scoreInput, req.body))); }));
router.patch('/okrs/key-results/:kid', asyncHandler(async (req, res) => { ok(res, await okr.updateKeyResult(callerId(req), P(req, 'kid'), parse(okr.krPatch, req.body))); }));
router.delete('/okrs/key-results/:kid', asyncHandler(async (req, res) => { ok(res, await okr.deleteKeyResult(callerId(req), P(req, 'kid'))); }));
router.put('/okrs/key-results/:kid/links', asyncHandler(async (req, res) => { ok(res, await okr.setKeyResultLinks(callerId(req), P(req, 'kid'), parse(okr.linkInput, req.body))); }));
router.post('/okrs/key-results/:kid/checkins', asyncHandler(async (req, res) => { ok(res, await okr.checkin(callerId(req), P(req, 'kid'), parse(okr.checkinInput, req.body)), 201); }));

// ─── Planning poker ──────────────────────────────────────────────

const PK = '/projects/:pid/poker';
const PI = `${PK}/:sid/items/:iid`;
router.get(PK, asyncHandler(async (req, res) => { ok(res, await poker.listSessions(callerId(req), P(req, 'pid'))); }));
router.post(PK, asyncHandler(async (req, res) => { ok(res, await poker.createSession(callerId(req), P(req, 'pid'), parse(poker.sessionInput, req.body)), 201); }));
router.get(`${PK}/:sid`, asyncHandler(async (req, res) => { ok(res, await poker.getSession(callerId(req), P(req, 'pid'), P(req, 'sid'))); }));
router.delete(`${PK}/:sid`, asyncHandler(async (req, res) => { ok(res, await poker.deleteSession(callerId(req), P(req, 'pid'), P(req, 'sid'))); }));
router.post(`${PK}/:sid/items`, asyncHandler(async (req, res) => { ok(res, await poker.addItems(callerId(req), P(req, 'pid'), P(req, 'sid'), parse(poker.itemsInput, req.body))); }));
router.post(`${PK}/:sid/timer`, asyncHandler(async (req, res) => { ok(res, await poker.setTimer(callerId(req), P(req, 'pid'), P(req, 'sid'), parse(poker.timerInput, req.body).seconds)); }));
router.post(`${PK}/:sid/close`, asyncHandler(async (req, res) => { ok(res, await poker.closeSession(callerId(req), P(req, 'pid'), P(req, 'sid'))); }));
router.delete(PI, asyncHandler(async (req, res) => { ok(res, await poker.removeItem(callerId(req), P(req, 'pid'), P(req, 'sid'), P(req, 'iid'))); }));
router.post(`${PI}/start`, asyncHandler(async (req, res) => { ok(res, await poker.startItem(callerId(req), P(req, 'pid'), P(req, 'sid'), P(req, 'iid'))); }));
router.post(`${PI}/vote`, asyncHandler(async (req, res) => {
  const { value } = parse(z.object({ value: z.string().min(1).max(8).nullable() }), req.body);
  ok(res, await poker.vote(callerId(req), P(req, 'pid'), P(req, 'sid'), P(req, 'iid'), value));
}));
router.post(`${PI}/reveal`, asyncHandler(async (req, res) => { ok(res, await poker.reveal(callerId(req), P(req, 'pid'), P(req, 'sid'), P(req, 'iid'))); }));
router.post(`${PI}/revote`, asyncHandler(async (req, res) => { ok(res, await poker.revote(callerId(req), P(req, 'pid'), P(req, 'sid'), P(req, 'iid'))); }));
router.post(`${PI}/finalize`, asyncHandler(async (req, res) => { ok(res, await poker.finalize(callerId(req), P(req, 'pid'), P(req, 'sid'), P(req, 'iid'), parse(poker.finalizeInput, req.body).value)); }));
router.post(`${PI}/skip`, asyncHandler(async (req, res) => { ok(res, await poker.skipItem(callerId(req), P(req, 'pid'), P(req, 'sid'), P(req, 'iid'))); }));
router.get(`${PI}/suggest`, asyncHandler(async (req, res) => { ok(res, await poker.suggest(callerId(req), P(req, 'pid'), P(req, 'sid'), P(req, 'iid'))); }));
router.get('/projects/:pid/issues/:num/estimates', asyncHandler(async (req, res) => { ok(res, await poker.issueEstimates(callerId(req), P(req, 'pid'), P(req, 'num'))); }));

// ─── Retro ───────────────────────────────────────────────────────

const RT = '/projects/:pid/retros';
const RR = `${RT}/:rid`;
router.get(RT, asyncHandler(async (req, res) => { ok(res, await retro.listRetros(callerId(req), P(req, 'pid'))); }));
router.post(RT, asyncHandler(async (req, res) => { ok(res, await retro.createRetro(callerId(req), P(req, 'pid'), parse(retro.retroInput, req.body)), 201); }));
router.get(RR, asyncHandler(async (req, res) => { ok(res, await retro.getRetro(callerId(req), P(req, 'pid'), P(req, 'rid'))); }));
router.patch(RR, asyncHandler(async (req, res) => { ok(res, await retro.updateRetro(callerId(req), P(req, 'pid'), P(req, 'rid'), parse(retro.retroPatch, req.body))); }));
router.delete(RR, asyncHandler(async (req, res) => { ok(res, await retro.deleteRetro(callerId(req), P(req, 'pid'), P(req, 'rid'))); }));
router.get(`${RR}/export.docx`, asyncHandler(async (req, res) => {
  const { buffer, fileName } = await retro.exportDocx(callerId(req), P(req, 'pid'), P(req, 'rid'));
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.setHeader('Content-Disposition', `attachment; filename="retro.docx"; filename*=UTF-8''${encodeURIComponent(fileName)}`);
  res.send(buffer);
}));
router.post(`${RR}/cards`, asyncHandler(async (req, res) => { ok(res, await retro.addCard(callerId(req), P(req, 'pid'), P(req, 'rid'), parse(retro.cardInput, req.body)), 201); }));
router.patch(`${RR}/cards/:cid`, asyncHandler(async (req, res) => { ok(res, await retro.updateCard(callerId(req), P(req, 'pid'), P(req, 'rid'), P(req, 'cid'), parse(retro.cardPatch, req.body))); }));
router.delete(`${RR}/cards/:cid`, asyncHandler(async (req, res) => { ok(res, await retro.deleteCard(callerId(req), P(req, 'pid'), P(req, 'rid'), P(req, 'cid'))); }));
router.post(`${RR}/cards/:cid/vote`, asyncHandler(async (req, res) => { ok(res, await retro.voteCard(callerId(req), P(req, 'pid'), P(req, 'rid'), P(req, 'cid'), parse(retro.voteInput, req.body).delta)); }));
router.post(`${RR}/actions`, asyncHandler(async (req, res) => { ok(res, await retro.addAction(callerId(req), P(req, 'pid'), P(req, 'rid'), parse(retro.actionInput, req.body)), 201); }));
router.delete(`${RR}/actions/:aid`, asyncHandler(async (req, res) => { ok(res, await retro.deleteAction(callerId(req), P(req, 'pid'), P(req, 'rid'), P(req, 'aid'))); }));
router.post(`${RR}/summary`, asyncHandler(async (req, res) => { ok(res, await retro.summarize(callerId(req), P(req, 'pid'), P(req, 'rid'), lang(req))); }));

// ─── Timer ───────────────────────────────────────────────────────

router.get('/me/timer', asyncHandler(async (req, res) => { ok(res, await timer.myTimer(callerId(req))); }));
router.patch('/me/timer', asyncHandler(async (req, res) => {
  ok(res, await timer.patch(callerId(req), parse(z.object({ activity: z.string().max(16).nullable().optional(), note: z.string().max(1000).nullable().optional() }), req.body)));
}));
router.post('/me/timer/pause', asyncHandler(async (req, res) => { ok(res, await timer.pause(callerId(req))); }));
router.post('/me/timer/resume', asyncHandler(async (req, res) => { ok(res, await timer.resume(callerId(req))); }));
router.post('/me/timer/stop', asyncHandler(async (req, res) => { ok(res, await timer.stop(callerId(req), parse(timer.stopInput, req.body ?? {}))); }));
router.post('/me/timer/discard', asyncHandler(async (req, res) => { ok(res, await timer.discard(callerId(req))); }));
router.get('/projects/:pid/issues/:num/timer', asyncHandler(async (req, res) => { ok(res, await timer.issueTimer(callerId(req), P(req, 'pid'), P(req, 'num'))); }));
router.post('/projects/:pid/issues/:num/timer', asyncHandler(async (req, res) => {
  ok(res, await timer.start(callerId(req), P(req, 'pid'), P(req, 'num'), parse(timer.startInput, req.body ?? {})), 201);
}));

export default router;
