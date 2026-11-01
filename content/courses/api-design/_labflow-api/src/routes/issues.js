import { Router } from 'express';
import { store } from '../store/index.js';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { IssueCreate, IssueResolve, IssuesQuery } from '../schemas.js';
import { viewsOf, list } from '../views.js';
import { encodeCursor, decodeCursor, fingerprint } from '../paging.js';
import { idempotent } from '../idempotency.js';
import { reportLimit } from '../rateLimit.js';
import { etagOf, ifMatchVersion, preconditionFailed } from '../concurrency.js';

// Nạp thiết bị cha TRƯỚC khi kiểm body ⇒ giữ thứ tự của Lab 1: 401 → 404 → 400
async function loadDevice(req, res, next) {
  req.device = await store.getDevice(req.params.id);
  if (!req.device) throw new HttpError(404, 'DEVICE_NOT_FOUND', { id: req.params.id });
  next();
}
async function findIssue(id) {
  const i = await store.getIssue(id);
  if (!i) throw new HttpError(404, 'ISSUE_NOT_FOUND', { id });
  return i;
}

// Gắn dưới /devices: /devices/:id/issues (bộ sưu tập con)
export const deviceIssuesRouter = Router({ mergeParams: true });
deviceIssuesRouter.route('/')
  .get(loadDevice, async (req, res) => res.json(list(await store.listDeviceIssues(req.device.id), viewsOf(req).issue)))
  // Lab 5: lặp lại an toàn (5.1) → giới hạn 3/phút (5.3) → rồi mới tới thứ tự cũ 404 → 400
  .post(requireAuth, idempotent(), reportLimit, loadDevice, validate('body', IssueCreate), async (req, res) => {
    const { title, severity, description } = req.valid.body;
    // Luật trùng tiêu đề + HIGH ⇒ MAINTENANCE nằm trong store (Lab 12: kho pg làm cả hai trong MỘT transaction)
    const issue = await store.createIssue({ deviceId: req.device.id, reportedBy: req.user.id, title, severity, description });
    res.status(201).location(`${req.baseUrl.replace(/\/devices\/[^/]+\/issues$/, '/issues')}/${issue.id}`).json(viewsOf(req).issue(issue));
  })
  .all(onlyAllow('GET', 'HEAD', 'POST'));

// Gắn ở gốc: /issues, /issues/:id và hành động /issues/:id/resolve
export const issuesRouter = Router();
issuesRouter.route('/')
  .get(validate('query', IssuesQuery), async (req, res) => {
    const { limit, cursor, include, ...query } = req.valid.query;
    const key = query.sort.replace('-', '');
    const f = fingerprint(query);
    const after = cursor ? decodeCursor(cursor, key, f) : null;
    const rows = await store.listIssues({ ...query, after, limit });
    const page = rows.slice(0, limit);
    const next = rows.length > limit ? encodeCursor(page[page.length - 1], key, f) : null;
    if (next) {
      const qs = new URLSearchParams(req.query);
      qs.set('cursor', next);
      res.links({ next: `${req.baseUrl}?${qs}` });
    }
    const deviceById = include === 'device' ? await store.devicesById([...new Set(page.map((i) => i.deviceId))]) : null;
    const view = viewsOf(req);
    const data = page.map((i) => (deviceById ? { ...view.issue(i), device: view.device(deviceById.get(i.deviceId)) } : view.issue(i)));
    res.json({ data, page: { limit, next } });
  })
  .all(onlyAllow('GET', 'HEAD'));
issuesRouter.route('/:id')
  .get(async (req, res) => {
    const issue = await findIssue(req.params.id);
    res.set('ETag', etagOf(issue)).json(viewsOf(req).issue(issue));   // Lab 5: ETag cho báo hỏng
  })
  .all(onlyAllow('GET', 'HEAD'));
issuesRouter.route('/:id/resolve')
  .post(requireAuth, requireRole('LAB_MANAGER'), validate('body', IssueResolve), async (req, res) => {
    const issue = await findIssue(req.params.id);
    const expected = ifMatchVersion(req, issue);                    // Lab 5: hai quản lý cùng xử lý ⇒ người sau nhận 412
    if (issue.status === 'RESOLVED') throw new HttpError(409, 'ALREADY_RESOLVED', { id: issue.id });
    const done = await store.resolveIssue(issue.id, req.valid.body.resolution, expected);
    if (done === null) throw preconditionFailed(await findIssue(issue.id));
    if (done === 'ALREADY') throw new HttpError(409, 'ALREADY_RESOLVED', { id: issue.id });
    res.set('ETag', etagOf(done)).json(viewsOf(req).issue(done));
  })
  .all(onlyAllow('POST'));
