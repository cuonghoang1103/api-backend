import { Router } from 'express';
import { devices, issues, nextId } from '../db.js';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth, requireRole } from '../auth.js';
import { validate } from '../validate.js';
import { IssueCreate, IssueResolve, IssuesQuery } from '../schemas.js';
import { viewsOf, list } from '../views.js';
import { orderBy, encodeCursor, decodeCursor, fingerprint } from '../paging.js';
import { fold } from '../text.js';
import { idempotent } from '../idempotency.js';
import { reportLimit } from '../rateLimit.js';
import { etagOf, checkIfMatch, bump } from '../concurrency.js';

// Nạp thiết bị cha TRƯỚC khi kiểm body ⇒ giữ thứ tự của Lab 1: 401 → 404 → 400
function loadDevice(req, res, next) {
  req.device = devices.find((x) => x.id === req.params.id);
  if (!req.device) throw new HttpError(404, 'DEVICE_NOT_FOUND', { id: req.params.id });
  next();
}
function findIssue(id) {
  const i = issues.find((x) => x.id === id);
  if (!i) throw new HttpError(404, 'ISSUE_NOT_FOUND', { id });
  return i;
}

// Gắn dưới /devices: /devices/:id/issues (bộ sưu tập con)
export const deviceIssuesRouter = Router({ mergeParams: true });
deviceIssuesRouter.route('/')
  .get(loadDevice, (req, res) => res.json(list(issues.filter((i) => i.deviceId === req.device.id), viewsOf(req).issue)))
  // Lab 5: lặp lại an toàn (5.1) → giới hạn 3/phút (5.3) → rồi mới tới thứ tự cũ 404 → 400
  .post(requireAuth, idempotent(), reportLimit, loadDevice, validate('body', IssueCreate), (req, res) => {
    const { title, severity, description } = req.valid.body;
    // Luật nghiệp vụ: một thiết bị không có hai báo hỏng ĐANG MỞ cùng tiêu đề (so như người đọc)
    const same = issues.find((i) => i.deviceId === req.device.id && i.status === 'OPEN' && fold(i.title) === fold(title));
    if (same) throw new HttpError(409, 'DUPLICATE_ISSUE', { existing: same.id }, { existing: same.id });
    const issue = { id: nextId('iss'), deviceId: req.device.id, reportedBy: req.user.id, title, severity,
      description, status: 'OPEN', createdAt: new Date().toISOString() };
    issues.push(issue);
    if (severity === 'HIGH') req.device.status = 'MAINTENANCE';   // hỏng nặng ⇒ khoá thiết bị
    res.status(201).location(`${req.baseUrl.replace(/\/devices\/[^/]+\/issues$/, '/issues')}/${issue.id}`).json(viewsOf(req).issue(issue));
  })
  .all(onlyAllow('GET', 'HEAD', 'POST'));

// Gắn ở gốc: /issues, /issues/:id và hành động /issues/:id/resolve
export const issuesRouter = Router();
issuesRouter.route('/')
  .get(validate('query', IssuesQuery), (req, res) => {
    const { limit, cursor, include, ...query } = req.valid.query;
    const { status, severity, deviceId, sort } = query;
    let rows = issues.filter((i) => (!status || i.status === status)
      && (!severity || i.severity === severity) && (!deviceId || i.deviceId === deviceId));
    const { key, cmp } = orderBy(sort, { severity: { LOW: 1, MEDIUM: 2, HIGH: 3 } });
    rows.sort(cmp);
    const f = fingerprint(query);
    if (cursor) {
      const after = decodeCursor(cursor, key, f);
      rows = rows.filter((i) => cmp(after, i) < 0);
    }
    const page = rows.slice(0, limit);
    const next = rows.length > limit ? encodeCursor(page[page.length - 1], key, f) : null;
    if (next) {
      const qs = new URLSearchParams(req.query);
      qs.set('cursor', next);
      res.links({ next: `${req.baseUrl}?${qs}` });
    }
    const deviceById = include === 'device' ? new Map(devices.map((d) => [d.id, d])) : null;
    const view = viewsOf(req);
    const data = page.map((i) => (deviceById ? { ...view.issue(i), device: view.device(deviceById.get(i.deviceId)) } : view.issue(i)));
    res.json({ data, page: { limit, next } });
  })
  .all(onlyAllow('GET', 'HEAD'));
issuesRouter.route('/:id')
  .get((req, res) => {
    const issue = findIssue(req.params.id);
    res.set('ETag', etagOf(issue)).json(viewsOf(req).issue(issue));   // Lab 5: ETag cho báo hỏng
  })
  .all(onlyAllow('GET', 'HEAD'));
issuesRouter.route('/:id/resolve')
  .post(requireAuth, requireRole('LAB_MANAGER'), validate('body', IssueResolve), (req, res) => {
    const issue = findIssue(req.params.id);
    checkIfMatch(req, issue);                                       // Lab 5: hai quản lý cùng xử lý ⇒ người sau nhận 412
    if (issue.status === 'RESOLVED') throw new HttpError(409, 'ALREADY_RESOLVED', { id: issue.id });
    issue.status = 'RESOLVED';
    issue.resolvedAt = new Date().toISOString();
    if (req.valid.body.resolution) issue.resolution = req.valid.body.resolution;
    bump(res, issue);
    res.json(viewsOf(req).issue(issue));
  })
  .all(onlyAllow('POST'));
