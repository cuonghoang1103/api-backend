/**
 * CT Work — nâng cấp theo lần dùng thật đầu tiên (dự án CTW, 06/10/2026) — HTTP + Postgres thật. Bật bằng:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.ctw.db.test.ts
 *
 * CTW-1  khách duyệt cổng giai đoạn thấy lời nhắn + bằng chứng (chỉ thứ đã chia sẻ), ghi chú nội bộ vẫn kín.
 * CTW-13 gửi duyệt cổng khi còn việc mở ⇒ 409 kèm danh sách; acknowledgeOpen + lý do ⇒ gửi được.
 * CTW-3  báo cáo tuần cho khách mặc định TẮT; bật lần đầu phải confirm.
 * CTW-4  Docs nhập Markdown (POST/PATCH); trường lạ ⇒ 400 nêu tên.
 * CTW-5  JQL fixVersion. CTW-6 tìm không dấu (toàn cục, JQL, Docs). CTW-16 thẻ tương tự.
 * CTW-11 cờ Bị chặn. CTW-19 tạo ticket desk trả số thẻ. CTW-23 emoji/màu dự án. CTW-24 phòng Jitsi + .ics.
 */

import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `ctw${Date.now().toString(36)}`;
const userIds: number[] = [];

type U = { id: number; token: string; email: string };

describe('CT Work — nâng cấp CTW 10/2026 (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, client: U;
  let wsId = 0;
  let pid = 0;
  let cfg: any;
  let stageId = 0;
  let shared = 0, internal = 0, gateNum = 0;
  let attShared = 0, attInternal = 0;
  const SECRET = 'INTERNAL-MARGIN-NOTE-77';

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email };
  }

  async function call(u: U, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token}` },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    let json: any = {};
    try { json = JSON.parse(text); } catch { json = { raw: text }; }
    return { status: res.status, data: json.data, code: json.code ?? json.error?.code, raw: json, text };
  }
  const typeId = (k: string) => cfg.issueTypes.find((t: any) => t.key === k).id;

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '5mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, client] = await Promise.all(['owner', 'client'].map(mkUser));
  });

  after(async () => {
    server?.close();
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('dựng: dự án CLIENT + khách + thẻ (chia sẻ / nội bộ) trong giai đoạn đang chạy + tệp', async () => {
    wsId = (await call(owner, 'POST', '/workspaces', { name: `CTW ${tag}` })).data.id;
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'FP', name: 'Flying Pencil', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(p.status, 201, p.text);
    pid = p.data.id;
    assert.equal((await call(owner, 'POST', `/projects/${pid}/portal/invite`, { emails: [client.email] })).status, 201);
    cfg = (await call(owner, 'GET', `/projects/${pid}`)).data;
    const st = await call(owner, 'POST', `/projects/${pid}/stages`, { slug: 'phong-cach', name: 'Phong cách' });
    assert.equal(st.status, 201, st.text);
    stageId = st.data.id;
    assert.equal((await call(owner, 'POST', `/projects/${pid}/stages/${stageId}/activate`, {})).status, 200);
    const mk = async (title: string, extra: object = {}) => (await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: typeId('TASK'), title, stageId, ...extra })).data;
    shared = (await mk('Địa cầu: ngày/đêm theo vị trí mặt trời')).number;
    internal = (await mk(`Báo giá nội bộ ${SECRET}`)).number;
    gateNum = (await mk('Tiêu chí ra giai đoạn 0')).number;
    for (const n of [shared, gateNum]) assert.equal((await call(owner, 'PUT', `/projects/${pid}/issues/${n}/client-visible`, { visible: true })).status, 200);
    // Thẻ cổng (tiêu chí) của giai đoạn.
    await prisma.workStage.update({ where: { id: stageId }, data: { gateIssueId: (await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: gateNum } })).id } });
    const iid = async (n: number) => (await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: n } })).id;
    attShared = (await prisma.workAttachment.create({ data: { issueId: await iid(shared), r2Key: 'work/x/render_v3.png', fileName: 'render_v3.png', mime: 'image/png', size: 10, uploaderId: owner.id } })).id;
    attInternal = (await prisma.workAttachment.create({ data: { issueId: await iid(internal), r2Key: 'work/x/cost.xlsx', fileName: `cost-${SECRET}.xlsx`, mime: 'text/plain', size: 10, uploaderId: owner.id } })).id;
    assert.equal((await call(owner, 'PATCH', `/projects/${pid}/attachments/${attShared}/client`, { clientVisible: true })).status, 200);
  });

  it('CTW-13: còn việc mở ⇒ 409 kèm danh sách; CTW-1: khách duyệt cổng thấy lời nhắn + bằng chứng đã chia sẻ, không thấy ghi chú nội bộ', async () => {
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/studio`, { stageGate: { approverIds: [client.id] } })).status, 200);
    const warn = await call(owner, 'POST', `/projects/${pid}/stages/${stageId}/request-gate`, { description: SECRET });
    assert.equal(warn.status, 409, warn.text);
    assert.equal(warn.code, 'WORK_GATE_OPEN_ISSUES');
    assert.equal(warn.raw.data.openIssues, 3);
    assert.ok(warn.raw.data.issues.some((i: any) => i.key === `FP-${shared}`));
    // Bằng chứng sai ⇒ 400 nêu rõ.
    const bad = await call(owner, 'POST', `/projects/${pid}/stages/${stageId}/request-gate`, { acknowledgeOpen: true, issueNumbers: [9999] });
    assert.equal(bad.code, 'WORK_BAD_EVIDENCE');
    // Trường lạ ⇒ 400 (không lặng lẽ bỏ).
    assert.equal((await call(owner, 'POST', `/projects/${pid}/stages/${stageId}/request-gate`, { acknowledgeOpen: true, evidenceIds: [1] })).code, 'VALIDATION_ERROR');

    const g = await call(owner, 'POST', `/projects/${pid}/stages/${stageId}/request-gate`, {
      description: `Ghi chú nội bộ ${SECRET}`, clientNote: 'Mời anh/chị xem ảnh render v3 và bản đồ địa cầu trước khi duyệt.',
      acknowledgeOpen: true, openReason: 'Hai việc phụ chuyển sang giai đoạn sau',
      issueNumbers: [internal], attachmentIds: [attShared, attInternal],
    });
    assert.equal(g.status, 201, g.text);
    const gid = g.data.approval.id;

    // Khách: lời nhắn ở `description`, bằng chứng chỉ thứ đã chia sẻ, không có lý do nội bộ.
    for (const path of [`/projects/${pid}/portal/approvals/${gid}`, `/projects/${pid}/approvals/${gid}`]) {
      const v = await call(client, 'GET', path);
      assert.equal(v.status, 200, `${path} ${v.text}`);
      assert.match(v.data.description, /render v3/, path);
      const ev = v.data.evidence;
      assert.ok(ev, `${path} có evidence`);
      assert.deepEqual(ev.issues.map((i: any) => i.number).sort(), [gateNum, shared].sort(), path);
      assert.deepEqual(ev.files.map((f: any) => f.id), [attShared], path);
      assert.equal(ev.criteria?.number, gateNum, path);
      assert.equal(ev.openReason, undefined, path);
      assert.ok(!v.text.includes(SECRET), `${path} không lộ ghi chú/thẻ/tệp nội bộ`);
      assert.equal(v.data.canDecide, true, path);
    }
    // Nhân viên: thấy đủ + lời nhắn riêng + lý do còn việc mở.
    const s = (await call(owner, 'GET', `/projects/${pid}/approvals/${gid}`)).data;
    assert.match(s.description, new RegExp(SECRET));
    assert.match(s.clientNote, /render v3/);
    assert.equal(s.evidence.openAtRequest, 3);
    assert.match(s.evidence.openReason, /giai đoạn sau/);
    assert.ok(s.evidence.issues.some((i: any) => i.number === internal && i.pinned));
    assert.equal(s.evidence.files.length, 2);
    // Danh sách phê duyệt không trả bản evidence thô (có lý do nội bộ).
    const list = await call(client, 'GET', `/projects/${pid}/approvals`);
    assert.ok(!list.text.includes('giai đoạn sau'));
    await call(owner, 'POST', `/projects/${pid}/approvals/${gid}/cancel`, {});
    await call(owner, 'PUT', `/projects/${pid}/studio`, { stageGate: null });
  });

  it('CTW-3: lịch báo cáo tuần mặc định TẮT; bật lần đầu phải confirm; sau đó bật/tắt tự do', async () => {
    const s0 = (await call(owner, 'GET', `/projects/${pid}/reports/client-weekly/schedule`)).data;
    assert.equal(s0.enabled, false);
    assert.equal(s0.needsConfirmation, true);
    assert.match(s0.cadence, /Friday at 16:00/);
    const no = await call(owner, 'PUT', `/projects/${pid}/reports/client-weekly/schedule`, { enabled: true });
    assert.equal(no.status, 409);
    assert.equal(no.code, 'WORK_REPORT_CONFIRM_REQUIRED');
    const yes = await call(owner, 'PUT', `/projects/${pid}/reports/client-weekly/schedule`, { enabled: true, confirm: true });
    assert.equal(yes.status, 200, yes.text);
    assert.equal(yes.data.enabled, true);
    assert.equal(yes.data.needsConfirmation, false);
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/reports/client-weekly/schedule`, { enabled: false })).data.enabled, false);
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/reports/client-weekly/schedule`, { enabled: true })).status, 200, 'đã xác nhận một lần ⇒ bật lại không hỏi');
    await call(owner, 'PUT', `/projects/${pid}/reports/client-weekly/schedule`, { enabled: false });
  });

  let mdPage = 0;
  it('CTW-4: Docs nhập Markdown (tiêu đề lấy từ # đầu tiên, bảng, danh sách); trường lạ ⇒ 400 nêu tên', async () => {
    const md = '# GDD — Flying Pencil\n\n## Mục tiêu\n\n- Địa cầu **ngày/đêm**\n- Mặt trăng\n\n| Cột | Giá trị |\n|---|---|\n| a | 1 |\n\n```js\nconsole.log(1)\n```\n';
    const r = await call(owner, 'POST', `/projects/${pid}/pages`, { markdown: md });
    assert.equal(r.status, 201, r.text);
    mdPage = r.data.number;
    assert.equal(r.data.title, 'GDD — Flying Pencil');
    const types = (r.data.contentJson.content as any[]).map((n) => n.type);
    assert.deepEqual(types, ['heading', 'bulletList', 'table', 'codeBlock'], 'tiêu đề # đầu bị bỏ khỏi nội dung');
    // Xuất lại ra Markdown vẫn có bảng.
    assert.match((await call(owner, 'GET', `/projects/${pid}/pages/${mdPage}/markdown`)).data.markdown, /\| Cột \| Giá trị \|/);
    // PATCH bằng markdown.
    const cur = (await call(owner, 'GET', `/projects/${pid}/pages/${mdPage}`)).data;
    const u = await call(owner, 'PATCH', `/projects/${pid}/pages/${mdPage}`, { markdown: '## Mới\n\nĐoạn văn', version: cur.version });
    assert.equal(u.status, 200, u.text);
    assert.equal(u.data.contentJson.content[0].type, 'heading');
    // Trường lạ ⇒ 400 nêu tên trường (trước đây: 201 + trang rỗng).
    const bad = await call(owner, 'POST', `/projects/${pid}/pages`, { title: 'X', content: 'hello' });
    assert.equal(bad.status, 400);
    assert.match(bad.raw.message, /content/);
    assert.ok(Array.isArray(bad.raw.data?.errors));
    // Cả markdown lẫn contentJson ⇒ 400.
    assert.equal((await call(owner, 'POST', `/projects/${pid}/pages`, { markdown: '# a', contentJson: { type: 'doc', content: [] } })).status, 400);
  });

  it('CTW-5 + CTW-6 + CTW-11 + CTW-16: JQL fixVersion, tìm không dấu, cờ Bị chặn, thẻ tương tự', async () => {
    const v = await call(owner, 'POST', `/projects/${pid}/versions`, { name: 'v0.0-phong-cach' });
    assert.equal(v.status, 201, v.text);
    const cur = (await call(owner, 'GET', `/projects/${pid}/issues/${shared}`)).data;
    assert.equal((await call(owner, 'PATCH', `/projects/${pid}/issues/${shared}`, { fixVersionId: v.data.id, version: cur.version })).status, 200);
    const nums = async (jql: string) => {
      const r = await call(owner, 'GET', `/projects/${pid}/search?jql=${encodeURIComponent(jql)}`);
      assert.equal(r.status, 200, `${jql} ${r.text}`);
      return r.data.items.map((i: any) => i.number);
    };
    assert.deepEqual(await nums('fixVersion = "v0.0-phong-cach"'), [shared]);
    assert.ok(!(await nums('fixVersion IS EMPTY')).includes(shared));
    assert.deepEqual(await nums('fixVersion IN unreleasedVersions()'), [shared]);
    // Lưu bộ lọc fixVersion (trước đây 400 Unknown field).
    assert.equal((await call(owner, 'POST', `/projects/${pid}/filters`, { name: 'Phong cách', query: 'fixVersion = "v0.0-phong-cach"' })).status, 201);

    // Không dấu: JQL ~, tìm toàn cục, tìm trong danh sách, Docs.
    assert.deepEqual(await nums('summary ~ "dia cau"'), [shared]);
    assert.deepEqual(await nums('text ~ "DIA CAU"'), [shared]);
    const g = await call(owner, 'GET', `/search?q=${encodeURIComponent('dia cau')}`);
    assert.equal(g.status, 200, g.text);
    assert.ok(g.data.items.some((i: any) => i.number === shared && i.project.key === 'FP'), 'tìm toàn cục "dia cau" ra "Địa cầu"');
    const l = await call(owner, 'GET', `/projects/${pid}/issues?q=${encodeURIComponent('mat troi')}`);
    assert.ok((l.data.items ?? l.data).some((i: any) => i.number === shared));
    const ps = await call(owner, 'GET', `/projects/${pid}/pages/search?q=${encodeURIComponent('DOAN van')}`);
    assert.ok(ps.data.some((p: any) => p.number === mdPage), 'Docs tìm không dấu');

    // Thẻ tương tự: tiêu đề mới ngắn nằm trong tiêu đề cũ dài.
    const sim = await call(owner, 'GET', `/projects/${pid}/similar?title=${encodeURIComponent('Địa cầu ngày đêm')}`);
    assert.ok(sim.data.some((i: any) => i.number === shared), JSON.stringify(sim.data));

    // Cờ Bị chặn.
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/issues/${internal}/flag`, { reason: ' ' })).status, 400);
    const f = await call(owner, 'PUT', `/projects/${pid}/issues/${internal}/flag`, { reason: 'Chờ khách đăng nhập Mixamo' });
    assert.equal(f.status, 200, f.text);
    assert.ok(f.data.flaggedAt);
    assert.deepEqual(await nums('flagged = true'), [internal]);
    const card = (await call(owner, 'GET', `/projects/${pid}/issues/${internal}`)).data;
    assert.match(card.flagReason, /Mixamo/);
    const hist = (await call(owner, 'GET', `/projects/${pid}/issues/${internal}/history`)).data;
    assert.ok(JSON.stringify(hist).includes('flagged'));
    // Khách không lọc theo cờ (ghi chú nội bộ).
    assert.equal((await call(client, 'GET', `/projects/${pid}/search?jql=${encodeURIComponent('flagged = true')}`)).status, 400);
    assert.equal((await call(owner, 'DELETE', `/projects/${pid}/issues/${internal}/flag`)).data.flaggedAt, null);
    assert.deepEqual(await nums('flagged = true'), []);
  });

  it('CTW-23: emoji + màu dự án (sidebar, cấu hình, cổng khách); màu sai ⇒ 400; ảnh cần R2', async () => {
    assert.equal((await call(owner, 'PATCH', `/projects/${pid}`, { color: 'red' })).status, 400);
    assert.equal((await call(owner, 'PATCH', `/projects/${pid}`, { iconEmoji: '🌍', color: '#2563EB' })).status, 200);
    const c = (await call(owner, 'GET', `/projects/${pid}`)).data;
    assert.equal(c.iconEmoji, '🌍');
    assert.equal(c.color, '#2563eb');
    assert.ok('logoUrl' in c.workspace);
    assert.ok(Array.isArray(c.versions), 'versions cho gợi ý JQL');
    const ws = (await call(owner, 'GET', `/workspaces/${wsId}/projects`)).data ?? [];
    const row = (Array.isArray(ws) ? ws : ws.projects ?? []).find((p: any) => p.id === pid);
    if (row) assert.equal(row.iconEmoji, '🌍');
    const ov = (await call(client, 'GET', `/projects/${pid}/portal/overview`)).data;
    assert.equal(ov.project.iconEmoji, '🌍');
    assert.equal(ov.project.color, '#2563eb');
    // Ảnh: chỉ nhận ảnh ≤ 2 MB (kiểm trước khi chạm R2 khi R2 có cấu hình; không có thì 503).
    const pre = await call(owner, 'POST', `/projects/${pid}/avatar/presign`, { contentType: 'application/pdf', size: 10 });
    assert.ok([400, 503].includes(pre.status), pre.text);
    // Khách không đổi được.
    assert.ok([403, 404].includes((await call(client, 'PATCH', `/projects/${pid}`, { iconEmoji: 'x' })).status));
  });

  it('CTW-24: meetingUrl "jitsi" ⇒ máy chủ sinh phòng; .ics có CONFERENCE + nhắc 10 phút; khách thấy link trong cổng', async () => {
    const start = new Date(Date.now() + 86_400_000);
    const m = await call(owner, 'POST', `/projects/${pid}/meetings`, {
      title: 'Họp duyệt phong cách', startsAt: start.toISOString(), endsAt: new Date(start.getTime() + 3_600_000).toISOString(),
      meetingUrl: 'jitsi', attendeeIds: [owner.id, client.id],
    });
    assert.equal(m.status, 201, m.text);
    assert.match(m.data.meetingUrl, /^https:\/\/meet\.jit\.si\/ctwork-[a-z0-9]{16}$/);
    assert.equal(m.data.provider, 'JITSI');
    const ics = await fetch(`${base}/api/v1/work/projects/${pid}/meetings/${m.data.number}/ics`, { headers: { Authorization: `Bearer ${owner.token}` } });
    const body = (await ics.text()).replace(/\r\n /g, '');
    assert.match(body, /CONFERENCE;VALUE=URI;FEATURE=AUDIO,VIDEO;LABEL=Join meeting:https:\/\/meet\.jit\.si\/ctwork-/);
    assert.match(body, /TRIGGER:-PT10M/);
    assert.match(body, /DESCRIPTION:Join: https:\/\/meet\.jit\.si/);
    const pm = (await call(client, 'GET', `/projects/${pid}/portal/meetings`)).data;
    assert.ok(pm.items.some((x: any) => x.meetingUrl === m.data.meetingUrl));
  });

  it('CTW-19: tạo ticket desk (nhân viên) trả số + khoá ở cấp đầu', async () => {
    const st = await call(owner, 'PUT', `/projects/${pid}/studio`, { modules: { serviceDesk: true } });
    assert.equal(st.status, 200, st.text);
    const t = await call(owner, 'POST', `/projects/${pid}/desk/tickets`, { requestType: 'INCIDENT', impact: 'MEDIUM', urgency: 'MEDIUM', title: 'Trang trắng khi mở' });
    assert.equal(t.status, 201, t.text);
    assert.equal(typeof t.data.number, 'number');
    assert.equal(t.data.key, `FP-${t.data.number}`);
    assert.ok(t.data.ticket);
  });
});
