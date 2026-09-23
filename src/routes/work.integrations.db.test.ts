/**
 * Test đợt 7 (GitHub, xuất/nhập, audit, thùng rác, link công khai, API token)
 * qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.integrations.db.test.ts
 */

import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import AdmZip from 'adm-zip';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';
import { parseCsv, parseDay, toCsv, toXlsx } from '../services/work/exchange.service.js';
import { issueNumbersIn, verifySignature } from '../services/work/github.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `wi${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('CT Work đợt 7 — hàm thuần', () => {
  it('tìm mã thẻ trong commit/nhánh, không phân biệt hoa thường, không bắt nhầm', () => {
    assert.deepEqual(issueNumbersIn('PL-12 fix login; also pl-7 and XPL-9, PL-12', 'PL'), [12, 7]);
    assert.deepEqual(issueNumbersIn('feature/pl-33-signup', 'PL'), [33]);
    assert.deepEqual(issueNumbersIn('APPL-3 PL-', 'PL'), []);
  });
  it('chữ ký HMAC', () => {
    const raw = Buffer.from('{"a":1}');
    const sig = `sha256=${crypto.createHmac('sha256', 's3cret').update(raw).digest('hex')}`;
    assert.equal(verifySignature('s3cret', raw, sig), true);
    assert.equal(verifySignature('other', raw, sig), false);
    assert.equal(verifySignature('s3cret', raw, undefined), false);
    assert.equal(verifySignature('s3cret', raw, 'sha256=abc'), false);
  });
  it('CSV: nháy kép, xuống dòng trong ô, BOM; chặn công thức khi xuất', () => {
    assert.deepEqual(parseCsv('﻿a,b\r\n"x, y","say ""hi""\nthere"\n'), [['a', 'b'], ['x, y', 'say "hi"\nthere']]);
    const out = toCsv([{ key: 'PL-1', summary: '=HYPERLINK("x")' } as never]);
    assert.ok(out.startsWith('﻿'));
    assert.ok(out.includes(`"'=HYPERLINK(""x"")"`));
  });
  it('ngày kiểu Jira', () => {
    assert.equal(parseDay('23/Sep/26 12:00 AM'), '2026-09-23');
    assert.equal(parseDay('2026-01-05T10:00'), '2026-01-05');
    assert.equal(parseDay('5/1/2026'), '2026-01-05');
    assert.equal(parseDay('soon'), null);
  });
  it('xlsx là file zip hợp lệ có sheet', () => {
    const buf = toXlsx([{ key: 'PL-1', summary: 'Đăng nhập <b>', storyPoints: 3 } as never]);
    const zip = new AdmZip(buf);
    const sheet = zip.readAsText('xl/worksheets/sheet1.xml');
    assert.ok(sheet.includes('Đăng nhập &lt;b&gt;'));
    assert.ok(sheet.includes('<v>3</v>'));
    assert.ok(zip.getEntry('[Content_Types].xml'));
  });
});

describe('CT Work đợt 7 — HTTP + DB', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U;
  let pid = 0, wsId = 0;
  let cfg: any;
  const st = (name: string) => cfg.workflows.find((w: any) => w.isDefault).statuses.find((s: any) => s.name === name).id;
  const type = (k: string) => cfg.issueTypes.find((t: any) => t.key === k).id;

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email, username: u.username };
  }
  async function raw(method: string, path: string, headers: Record<string, string> = {}, body?: string | Buffer) {
    const res = await fetch(`${base}/api/v1/work${path}`, { method, headers, body });
    return res;
  }
  async function call(u: U | { token: string } | null, method: string, path: string, body?: unknown) {
    const res = await raw(method, path, { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) }, body === undefined ? undefined : JSON.stringify(body));
    const text = await res.text();
    let json: any = {};
    try { json = JSON.parse(text); } catch { /* không phải JSON */ }
    return { status: res.status, data: json.data, raw: json, text, headers: res.headers };
  }
  const newIssue = async (title: string, extra: Record<string, unknown> = {}) =>
    (await call(dev, 'POST', `/projects/${pid}/issues`, { typeId: type('TASK'), title, ...extra })).data;

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use('/api/v1/work/github/webhook', express.raw({ type: '*/*' }));
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [lead, dev] = await Promise.all(['lead', 'dev'].map(mkUser));
    const ws = (await call(lead, 'POST', '/workspaces', { name: `Integr ${tag}` })).data;
    wsId = ws.id;
    await call(lead, 'POST', `/workspaces/${ws.id}/invites`, { emails: [dev.email], role: 'MEMBER' });
    pid = (await call(lead, 'POST', `/workspaces/${ws.id}/projects`, { key: 'GI', name: 'Integr', template: 'BLANK' })).data.id;
    cfg = (await call(lead, 'GET', `/projects/${pid}`)).data;
  });

  after(async () => {
    server?.close();
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('GitHub: chỉ ADMIN kết nối + thấy secret; webhook sai chữ ký 401; push/nhánh/PR gắn vào thẻ; PR merge chuyển trạng thái', async () => {
    assert.equal((await call(dev, 'POST', `/projects/${pid}/github`, {})).status, 403);
    const c = await call(lead, 'POST', `/projects/${pid}/github`, {});
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    const secret = c.data.secret as string;
    assert.ok(secret && c.data.webhookUrl.endsWith(`/api/v1/work/github/webhook/${pid}`));
    assert.equal((await call(dev, 'GET', `/projects/${pid}/github`)).data.secret, null, 'thành viên thường không thấy secret');
    await call(lead, 'PATCH', `/projects/${pid}/github`, { prOpenedStatusId: st('In Review'), prMergedStatusId: st('Done') });

    const t = await newIssue('Login form');
    const send = (event: string, payload: unknown, key = secret) => {
      const body = Buffer.from(JSON.stringify(payload));
      const sig = `sha256=${crypto.createHmac('sha256', key).update(body).digest('hex')}`;
      return raw('POST', `/github/webhook/${pid}`, { 'Content-Type': 'application/json', 'X-GitHub-Event': event, 'X-Hub-Signature-256': sig }, body);
    };
    assert.equal((await send('ping', { zen: 'hi' }, 'wrong')).status, 401);
    assert.equal((await raw('POST', `/github/webhook/999999999`, { 'X-GitHub-Event': 'ping' }, Buffer.from('{}'))).status, 401, 'dự án không có kết nối cũng 401');
    assert.equal((await send('ping', { zen: 'hi', repository: { full_name: 'me/app' } })).status, 200);
    const repository = { full_name: 'me/app' };
    await send('create', { ref_type: 'branch', ref: `feature/gi-${t.number}-login`, repository, sender: { login: 'dev1' } });
    const push = await send('push', { ref: 'refs/heads/main', repository, commits: [{ id: 'a1b2c3d4e5f6', message: `GI-${t.number} add form\n\nbody`, url: 'https://github.com/me/app/commit/a1b2c3d', author: { username: 'dev1' } }, { id: 'ffff', message: 'no key here', url: 'u' }] });
    assert.equal(((await push.json()) as any).data.linked, 1);
    const pr = (action: string, merged: boolean, state: string) => send('pull_request', { action, repository, pull_request: { number: 7, title: `GI-${t.number}: login`, body: '', html_url: 'https://github.com/me/app/pull/7', state, merged, draft: false, user: { login: 'dev1' }, head: { ref: 'feature/x' } } });
    await pr('opened', false, 'open');
    assert.equal((await call(dev, 'GET', `/projects/${pid}/issues/${t.number}`)).data.statusId, st('In Review'));
    await pr('closed', true, 'closed');
    const after = (await call(dev, 'GET', `/projects/${pid}/issues/${t.number}`)).data;
    assert.equal(after.statusId, st('Done'));
    assert.ok(after.resolvedAt);
    const devp = (await call(dev, 'GET', `/projects/${pid}/issues/${t.number}/dev`)).data;
    assert.equal(devp.branches.length, 1);
    assert.equal(devp.commits.length, 1);
    assert.equal(devp.pullRequests.length, 1);
    assert.equal(devp.pullRequests[0].state, 'merged', 'cùng PR cập nhật, không nhân đôi');
    assert.equal((await call(lead, 'GET', `/projects/${pid}/github`)).data.repoFullName, 'me/app');
  });

  it('xuất CSV / Excel / PDF theo JQL', async () => {
    await newIssue('Export me, "quoted"', { priority: 1 });
    const csv = await raw('GET', `/projects/${pid}/export?format=csv&jql=${encodeURIComponent('priority = Highest')}`, { Authorization: `Bearer ${dev.token}` });
    assert.equal(csv.status, 200);
    const text = await csv.text();
    assert.match(csv.headers.get('content-disposition') ?? '', /GI-issues-.*\.csv/);
    const rows = parseCsv(text);
    assert.equal(rows[0][0], 'Issue key');
    assert.equal(rows.length, 2);
    assert.equal(rows[1][3], 'Export me, "quoted"');
    const x = await raw('GET', `/projects/${pid}/export?format=xlsx`, { Authorization: `Bearer ${dev.token}` });
    assert.equal(x.headers.get('content-type'), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    assert.ok(new AdmZip(Buffer.from(await x.arrayBuffer())).readAsText('xl/worksheets/sheet1.xml').includes('Export me'));
    const pdf = await raw('GET', `/projects/${pid}/export?format=pdf`, { Authorization: `Bearer ${dev.token}` });
    assert.equal(Buffer.from(await pdf.arrayBuffer()).subarray(0, 4).toString(), '%PDF');
    assert.equal((await raw('GET', `/projects/${pid}/export?format=csv&jql=${encodeURIComponent('status =')}`, { Authorization: `Bearer ${dev.token}` })).status, 400);
  });

  it('nhập CSV kiểu Jira: chạy thử báo lỗi/cảnh báo; nhập thật dựng đúng cha–con, nhãn, Done có resolvedAt', async () => {
    const csv = [
      'Summary,Issue key,Issue id,Issue Type,Status,Priority,Assignee,Labels,Labels,Parent,Custom field (Story Points),Due date,Original Estimate',
      `Checkout epic,SHOP-1,10001,Epic,To Do,High,,,,,,,`,
      `Pay by card,SHOP-2,10002,Story,Done,Highest,${dev.username},payment,backend,SHOP-1,5,30/Sep/26 12:00 AM,7200`,
      `Write tests,SHOP-3,10003,Sub-task,Weird status,Low,ghost,,,10002,,,`,
      `,SHOP-4,10004,Task,To Do,,,,,,,,`,
      `Orphan sub,SHOP-5,10005,Sub-task,To Do,,,,,,,,`,
    ].join('\n');
    assert.equal((await call(dev, 'POST', `/projects/${pid}/import`, { csv, dryRun: true })).status, 403, 'chỉ ADMIN nhập');
    const dry = await call(lead, 'POST', `/projects/${pid}/import`, { csv, dryRun: true });
    assert.equal(dry.status, 200, JSON.stringify(dry.raw));
    assert.equal(dry.data.total, 5);
    assert.equal(dry.data.valid, 3);
    const byRow = (n: number) => dry.data.rows.find((r: any) => r.row === n);
    assert.ok(byRow(4).warnings.some((w: string) => /Unknown status/.test(w)));
    assert.ok(byRow(4).warnings.some((w: string) => /not a project member/.test(w)));
    assert.ok(byRow(5).errors.some((e: string) => /Summary is empty/.test(e)));
    assert.ok(byRow(6).errors.length > 0);
    const before = await prisma.workIssue.count({ where: { projectId: pid } });
    assert.equal(before, await prisma.workIssue.count({ where: { projectId: pid } }), 'chạy thử không ghi gì');

    const real = await call(lead, 'POST', `/projects/${pid}/import`, { csv, dryRun: false });
    assert.equal(real.status, 200, JSON.stringify(real.raw));
    assert.equal(real.data.created, 3, JSON.stringify(real.data));
    const story = await prisma.workIssue.findFirst({ where: { projectId: pid, title: 'Pay by card' }, include: { parent: true, labels: { include: { label: true } } } });
    assert.equal(story!.parent!.title, 'Checkout epic');
    assert.equal(story!.assigneeId, dev.id);
    assert.equal(story!.storyPoints, 5);
    assert.equal(story!.originalEstimateMin, 120, 'Jira xuất giây');
    assert.equal(story!.priority, 1);
    assert.equal(story!.dueDate!.toISOString().slice(0, 10), '2026-09-30');
    assert.ok(story!.resolvedAt, 'nhập vào Done thì có resolvedAt');
    assert.deepEqual(story!.labels.map((l) => l.label.name).sort(), ['backend', 'payment']);
    const sub = await prisma.workIssue.findFirst({ where: { projectId: pid, title: 'Write tests' } });
    assert.equal(sub!.parentId, story!.id, 'việc con nối cha qua Issue id');
  });

  it('thùng rác: xoá → thấy trong thùng rác → khôi phục; xoá vĩnh viễn chỉ ADMIN; dự án khôi phục được', async () => {
    const t = await newIssue('Trash me');
    await call(dev, 'DELETE', `/projects/${pid}/issues/${t.number}`);
    assert.equal((await call(dev, 'GET', `/projects/${pid}/trash`)).status, 403, 'MEMBER không có quyền xoá thẻ người khác ⇒ không xem thùng rác');
    const bin = (await call(lead, 'GET', `/projects/${pid}/trash`)).data;
    const row = bin.find((b: any) => b.number === t.number);
    assert.ok(row);
    assert.equal(row.deletedBy.id, dev.id);
    assert.equal((await call(lead, 'POST', `/projects/${pid}/trash/${t.number}/restore`)).status, 200);
    assert.equal((await call(dev, 'GET', `/projects/${pid}/issues/${t.number}`)).status, 200);
    await call(dev, 'DELETE', `/projects/${pid}/issues/${t.number}`);
    assert.equal((await call(dev, 'DELETE', `/projects/${pid}/trash/${t.number}`)).status, 403);
    assert.equal((await call(lead, 'DELETE', `/projects/${pid}/trash/${t.number}`)).status, 200);
    assert.equal(await prisma.workIssue.count({ where: { projectId: pid, number: t.number } }), 0);

    const p2 = (await call(lead, 'POST', `/workspaces/${wsId}/projects`, { key: 'TMP', name: 'Temp', template: 'BLANK' })).data;
    await call(lead, 'DELETE', `/projects/${p2.id}`, { confirmKey: 'TMP' });
    assert.equal((await call(lead, 'GET', `/projects/${p2.id}`)).status, 404);
    assert.ok((await call(lead, 'GET', `/workspaces/${wsId}/trash`)).data.some((p: any) => p.id === p2.id));
    await call(lead, 'POST', `/workspaces/${wsId}/trash/projects/${p2.id}/restore`);
    assert.equal((await call(lead, 'GET', `/projects/${p2.id}`)).status, 200);
  });

  it('audit log: ghi đổi quyền/xoá/nhập/GitHub; chỉ quản trị không gian xem được', async () => {
    await call(lead, 'PUT', `/projects/${pid}/members/${dev.id}`, { role: 'VIEWER' });
    await call(lead, 'PUT', `/projects/${pid}/members/${dev.id}`, { role: 'MEMBER' });
    assert.equal((await call(dev, 'GET', `/workspaces/${wsId}/audit`)).status, 403);
    const log = (await call(lead, 'GET', `/workspaces/${wsId}/audit?limit=100`)).data;
    const actions = log.items.map((i: any) => i.action);
    for (const a of ['project.member_role', 'github.connect', 'project.import', 'issue.purge', 'project.delete', 'project.restore', 'issue.restore']) {
      assert.ok(actions.includes(a), `thiếu ${a}: ${actions.join(',')}`);
    }
    const role = log.items.find((i: any) => i.action === 'project.member_role');
    assert.match(role.summary, new RegExp(`@${dev.username}`));
    assert.equal(role.actorId, lead.id);
    const page = (await call(lead, 'GET', `/workspaces/${wsId}/audit?limit=2`)).data;
    assert.equal(page.items.length, 2);
    const next = (await call(lead, 'GET', `/workspaces/${wsId}/audit?limit=2&before=${page.nextBefore}`)).data;
    assert.ok(next.items[0].id < page.items[1].id + 1 && next.items[0].id !== page.items[0].id);
  });

  it('link công khai: không cần đăng nhập, không lộ email, bật tắt từng phần, thu hồi là mất', async () => {
    assert.equal((await call(dev, 'POST', `/projects/${pid}/share-links`, {})).status, 403);
    const l = await call(lead, 'POST', `/projects/${pid}/share-links`, { label: 'For lecturer', options: { tests: false }, expiresInDays: 30 });
    assert.equal(l.status, 201, JSON.stringify(l.raw));
    const tok = l.data.token as string;
    assert.ok(l.data.url.endsWith(`/work/share/${tok}`));
    const pub = await call(null, 'GET', `/share/${tok}`);
    assert.equal(pub.status, 200, JSON.stringify(pub.raw));
    assert.equal(pub.data.project.key, 'GI');
    assert.ok(!pub.text.includes('@test.local'), 'không lộ email');
    // Người chưa đặt tên hiển thị thì tên duy nhất là username (vốn công khai) — nhưng không trả trường username/email riêng.
    assert.ok(!pub.text.includes('"username"') && !pub.text.includes('"email"'), 'không trả trường username/email');
    const board = await call(null, 'GET', `/share/${tok}/issues?section=board`);
    assert.equal(board.status, 200);
    assert.ok(board.data.length > 0);
    assert.ok(board.data.every((i: any) => i.key.startsWith('GI-') && i.id === undefined));
    const one = await call(null, 'GET', `/share/${tok}/issues/${board.data[0].number}`);
    assert.equal(one.data.description, null, 'mô tả ẩn khi không bật');
    assert.equal((await call(null, 'GET', `/share/${tok}/tests`)).status, 404, 'phần Tests đã tắt');
    assert.equal((await call(null, 'GET', `/share/${tok}/reports`)).status, 200);
    assert.equal((await call(null, 'GET', '/share/not-a-real-token-at-all-xxxxx')).status, 404);
    const views = (await call(lead, 'GET', `/projects/${pid}/share-links`)).data[0].viewCount;
    assert.ok(views >= 1);
    await call(lead, 'DELETE', `/projects/${pid}/share-links/${l.data.id}`);
    assert.equal((await call(null, 'GET', `/share/${tok}`)).status, 404, 'thu hồi xong là 404');
  });

  it('API token: hiện một lần, chỉ lưu băm, đọc/ghi theo phạm vi, không tự quản lý token, thu hồi là 401', async () => {
    const r = await call(dev, 'POST', '/me/api-tokens', { name: 'CI read', scopes: ['read'] });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    const readTok = r.data.token as string;
    assert.match(readTok, /^ctw_[0-9a-f]{8}_/);
    const row = await prisma.workApiToken.findUnique({ where: { id: r.data.id } });
    assert.notEqual(row!.tokenHash, readTok);
    assert.ok(!(await call(dev, 'GET', '/me/api-tokens')).text.includes(readTok), 'danh sách không trả token');
    const asRead = { token: readTok };
    assert.equal((await call(asRead, 'GET', '/workspaces')).status, 200);
    const search = await call(asRead, 'GET', `/projects/${pid}/search?jql=${encodeURIComponent('type = Task')}`);
    assert.equal(search.status, 200);
    assert.equal((await call(asRead, 'POST', `/projects/${pid}/issues`, { typeId: type('TASK'), title: 'via token' })).status, 403);
    assert.equal((await call(asRead, 'GET', '/me/api-tokens')).status, 403, 'token không quản lý token');

    const w = (await call(dev, 'POST', '/me/api-tokens', { name: 'Bot', scopes: ['read', 'write'], expiresInDays: 30 })).data;
    const created = await call({ token: w.token }, 'POST', `/projects/${pid}/issues`, { typeId: type('TASK'), title: 'via token' });
    assert.equal(created.status, 201, JSON.stringify(created.raw));
    assert.equal(created.data.reporterId, dev.id, 'hành động dưới tên chủ token');
    await wait(50);
    assert.ok((await prisma.workApiToken.findUnique({ where: { id: w.id } }))!.lastUsedAt);
    await call(dev, 'DELETE', `/me/api-tokens/${w.id}`);
    assert.equal((await call({ token: w.token }, 'GET', '/workspaces')).status, 401);
    assert.equal((await call({ token: 'ctw_deadbeef_' + 'x'.repeat(32) }, 'GET', '/workspaces')).status, 401);
    // Token của người đã bị khoá không dùng được.
    await prisma.user.update({ where: { id: dev.id }, data: { enabled: false } });
    assert.equal((await call(asRead, 'GET', '/workspaces')).status, 403);
    await prisma.user.update({ where: { id: dev.id }, data: { enabled: true } });
  });
});
