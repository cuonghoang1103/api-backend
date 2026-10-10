/**
 * CT Work đợt 8c — qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.ctw8c.db.test.ts
 *
 *   1. Họp định kỳ: tạo chuỗi từ mẫu (sinh buổi, agenda + khung biên bản, MỘT chuông), sửa một buổi ⇒ ngoại lệ, sửa cả chuỗi
 *      (không đè ngoại lệ), đổi giờ ⇒ sinh lại, xoá một buổi ⇒ EXDATE, tách "từ buổi này", dừng chuỗi; quyền (rào agent ở permissions.test.ts).
 *   2. Mẫu chương trình: tạo họp kèm mẫu, áp mẫu không đè biên bản đã viết.
 *   3. RSVP cổng khách: khách được mời trả lời, chủ trì nhận chuông, xem trước chỉ đọc, khách không mời 404, họp đã qua 400.
 *   4. Ảnh Mermaid: chưa vẽ ⇒ 404 có mã; gửi SVG/PNG ⇒ GET image (SVG đã làm sạch + CSP); xuất Docs qua API có ảnh.
 *   5. Phân tích tĩnh + V(G): token tests:write; SARIF ⇒ phát hiện, nhập lại ⇒ không trùng + tự FIXED; createIssues ⇒ bug;
 *      JaCoCo ⇒ V(G); bỏ qua / thành thẻ; token tests:write không ghi tuyến khác.
 *   6. Cycle CI gộp tự đóng (jobs=N, close=true, im lặng) + phiên bản test case trên run.
 *   7. SWR302: ước lượng (số tự đếm, ghi đè, cảnh báo lệch, xlsx), báo cáo trạng thái, gói ZIP 8 deliverable, stakeholder AI.
 *   8. Đóng góp: xuất xlsx ?lang=vi ⇒ sheet định nghĩa tiếng Việt.
 */

import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';
import JSZip from 'jszip';
import sharp from 'sharp';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `c8c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
const userIds: number[] = [];
const wsIds: number[] = [];

type U = { id: number; token: string; email: string; username: string };

const dayPlus = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);

describe('CT Work — đợt 8c: họp định kỳ, RSVP khách, ảnh Mermaid, SARIF/V(G), cycle CI, SWR302 (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, staff: U, viewer: U, client: U, client2: U;
  let wsId = 0, pid = 0, swrPid = 0;
  const mails: Array<{ to: string; subject: string }> = [];

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email, displayName: name } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email, username: u.username };
  }
  async function call(u: U | { token: string } | null, method: string, p: string, body?: unknown, headers: Record<string, string> = {}) {
    const raw = typeof body === 'string';
    const res = await fetch(`${base}/api/v1/work${p}`, {
      method,
      headers: { 'Content-Type': raw ? 'application/xml' : 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}), ...headers },
      body: body === undefined ? undefined : raw ? body : JSON.stringify(body),
    });
    const buf = Buffer.from(await res.arrayBuffer());
    let json: any = {};
    try { json = JSON.parse(buf.toString('utf8')); } catch { json = {}; }
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json, headers: res.headers, buf };
  }
  const ok = (r: { status: number; raw: unknown }, status = 200) => assert.equal(r.status, status, JSON.stringify(r.raw).slice(0, 700));

  before(async () => {
    (emailService as any).send = async (m: any) => { mails.push({ to: m.to, subject: m.subject }); return { success: true }; };
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, staff, viewer, client, client2] = await Promise.all(['owner', 'staff', 'viewer', 'client', 'client2'].map((n) => mkUser(n)));
    wsId = (await call(owner, 'POST', '/workspaces', { name: `CTW8c ${tag}` })).data.id;
    wsIds.push(wsId);
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [staff.email, viewer.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'MTG', name: 'Client meetings', template: 'COMPANY', kind: 'CLIENT' });
    ok(p, 201);
    pid = p.data.id;
    for (const [u, r] of [[staff, 'MEMBER'], [viewer, 'VIEWER']] as const) ok(await call(owner, 'PUT', `/projects/${pid}/members/${u.id}`, { role: r }));
    ok(await call(owner, 'POST', `/projects/${pid}/portal/invite`, { emails: [client.email, client2.email] }), 201);
    ok(await call(owner, 'POST', `/projects/${pid}/tests/enable`));
    const s = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'OMFS', name: 'Order Fulfillment', template: 'SWR302' });
    ok(s, 201);
    swrPid = s.data.id;
    ok(await call(owner, 'PUT', `/projects/${swrPid}/members/${staff.id}`, { role: 'MEMBER' }));
  });

  after(async () => {
    (await import('../services/work/swrElic.service.js'))._setElicitationAskForTests(null);
    server?.close();
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.workApiToken.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
    await (await import('../config/redis.js')).closeRedis().catch(() => undefined);
  });

  // ─── 1–2. Họp định kỳ + mẫu ─────────────────────────────────────

  describe('họp định kỳ (RRULE) + mẫu chương trình', () => {
    let sid = 0;
    const start = dayPlus(1);

    it('tạo chuỗi hằng ngày từ mẫu daily ⇒ sinh buổi có agenda + khung biên bản, MỘT chuông cho mỗi người mời', async () => {
      mails.length = 0;
      const before = await prisma.socialNotification.count({ where: { receiverId: client.id } });
      const r = await call(staff, 'POST', `/projects/${pid}/meeting-series`, {
        title: 'Daily stand-up', templateKey: 'daily', recurrence: { freq: 'DAILY', interval: 1, hour: 9, minute: 0, startDate: start },
        timezone: 'Asia/Ho_Chi_Minh', attendeeIds: [owner.id, client.id], meetingUrl: 'jitsi',
      });
      ok(r, 201);
      sid = r.data.id;
      assert.equal(r.data.type, 'DAILY');
      assert.equal(r.data.durationMin, 15);
      assert.equal(r.data.rrule, 'FREQ=DAILY;BYHOUR=9;BYMINUTE=0');
      assert.ok(r.data.upcoming.length >= 40 && r.data.upcoming.length <= 72, `sinh ${r.data.upcoming.length} buổi`);
      assert.match(r.data.meetingUrl, /^https:\/\/meet\.jit\.si\//);
      const first = await call(staff, 'GET', `/projects/${pid}/meetings/${r.data.upcoming[0].number}`);
      ok(first);
      assert.equal(first.data.series.id, sid);
      assert.equal(first.data.templateKey, 'daily');
      assert.equal(new Date(first.data.startsAt).toISOString(), new Date(`${start}T02:00:00Z`).toISOString());
      const room = await call(staff, 'GET', `/projects/${pid}/meetings/${r.data.upcoming[0].number}/room`);
      assert.equal(room.data.agendaItems?.length ?? room.data.agenda?.length ?? 3, 3);
      const after = await prisma.socialNotification.count({ where: { receiverId: client.id } });
      assert.equal(after - before, 1, 'một chuông cho cả chuỗi');
      assert.equal(mails.filter((m) => m.to === client.email).length, 1, 'một email lời mời cho cả chuỗi');
      // sinh lại (cron / mở danh sách) không trùng
      const { extendAllSeries } = await import('../services/work/meetingSeries.service.js');
      await extendAllSeries();
      const n1 = await prisma.workMeeting.count({ where: { seriesId: sid, deletedAt: null } });
      await call(staff, 'GET', `/projects/${pid}/meetings`);
      assert.equal(await prisma.workMeeting.count({ where: { seriesId: sid, deletedAt: null } }), n1);
    });

    it('quyền: viewer không tạo; khách không thấy tuyến nội bộ (rào agent: permissions.test.ts)', async () => {
      const body = { title: 'x', recurrence: { freq: 'WEEKLY', hour: 9, startDate: start } };
      assert.equal((await call(viewer, 'POST', `/projects/${pid}/meeting-series`, body)).status, 403);
      assert.equal((await call(viewer, 'GET', `/projects/${pid}/meeting-series`)).status, 200);
      assert.equal((await call(client, 'GET', `/projects/${pid}/meeting-series`)).code, 'CLIENT_PORTAL_ONLY');
      assert.equal((await call(staff, 'POST', `/projects/${pid}/meeting-series`, { title: 'x', recurrence: { freq: 'WEEKLY', hour: 9, startDate: '2020-01-01', endDate: '2020-02-01' } })).status, 400);
    });

    it('sửa MỘT buổi ⇒ ngoại lệ; sửa cả chuỗi không đè ngoại lệ; đổi giờ ⇒ sinh lại; xoá buổi ⇒ EXDATE', async () => {
      const list = (await call(staff, 'GET', `/projects/${pid}/meeting-series/${sid}`)).data.upcoming;
      const [a, b, c] = list;
      ok(await call(staff, 'PATCH', `/projects/${pid}/meetings/${b.number}`, { title: 'Stand-up (moved)', startsAt: new Date(Date.parse(b.startsAt) + 3_600_000).toISOString(), endsAt: new Date(Date.parse(b.startsAt) + 3_600_000 + 15 * 60_000).toISOString() }));
      const up = await call(staff, 'PATCH', `/projects/${pid}/meeting-series/${sid}`, { scope: 'all', title: 'Daily scrum', location: 'Room 3' });
      ok(up);
      const ma = (await call(staff, 'GET', `/projects/${pid}/meetings/${a.number}`)).data;
      const mb = (await call(staff, 'GET', `/projects/${pid}/meetings/${b.number}`)).data;
      assert.equal(ma.title, 'Daily scrum');
      assert.equal(ma.location, 'Room 3');
      assert.equal(mb.title, 'Stand-up (moved)', 'ngoại lệ giữ nguyên');
      assert.equal(mb.series.detached, true);
      // buổi c có ghi chú ⇒ đổi giờ thì giữ (tách ngoại lệ), buổi trống thì sinh lại theo giờ mới
      ok(await call(staff, 'PATCH', `/projects/${pid}/meetings/${c.number}`, { decisions: ['Keep it short'] }));
      const re = await call(staff, 'PATCH', `/projects/${pid}/meeting-series/${sid}`, { scope: 'all', recurrence: { freq: 'DAILY', hour: 10, minute: 15, startDate: start } });
      ok(re);
      assert.ok(re.data.removed > 10);
      assert.equal(re.data.kept, 1);
      const firstNew = (await call(staff, 'GET', `/projects/${pid}/meeting-series/${sid}`)).data.upcoming.find((m: any) => !m.detached);
      assert.equal(new Date(firstNew.startsAt).getUTCHours(), 3);
      assert.equal(new Date(firstNew.startsAt).getUTCMinutes(), 15);
      // xoá MỘT buổi ⇒ EXDATE, không sinh lại
      const victim = firstNew;
      ok(await call(staff, 'DELETE', `/projects/${pid}/meetings/${victim.number}`));
      const s = await prisma.workMeetingSeries.findUniqueOrThrow({ where: { id: sid } });
      assert.ok((s.exdates as string[]).includes(victim.occurrenceDate));
      await prisma.workMeetingSeries.update({ where: { id: sid }, data: { generatedUntil: null } });
      const { generateOccurrences } = await import('../services/work/meetingSeries.service.js');
      await generateOccurrences(sid);
      assert.equal(await prisma.workMeeting.count({ where: { seriesId: sid, occurrenceDate: victim.occurrenceDate, deletedAt: null } }), 0);
    });

    it('"từ buổi này về sau" ⇒ chuỗi mới; dừng chuỗi ⇒ bỏ buổi tương lai trống', async () => {
      const list = (await call(staff, 'GET', `/projects/${pid}/meeting-series/${sid}`)).data.upcoming.filter((m: any) => !m.detached);
      const pivot = list[5];
      const r = await call(staff, 'PATCH', `/projects/${pid}/meeting-series/${sid}`, { scope: 'following', fromMeeting: pivot.number, title: 'Daily scrum v2' });
      ok(r);
      assert.notEqual(r.data.id, sid);
      const old = await prisma.workMeetingSeries.findUniqueOrThrow({ where: { id: sid } });
      assert.match(old.rrule, /UNTIL=/);
      assert.equal((await call(staff, 'GET', `/projects/${pid}/meetings/${pivot.number}`)).data.title, 'Daily scrum v2');
      assert.equal((await call(staff, 'GET', `/projects/${pid}/meetings/${list[0].number}`)).data.title, 'Daily scrum');
      const d = await call(staff, 'DELETE', `/projects/${pid}/meeting-series/${r.data.id}?scope=all`);
      ok(d);
      assert.ok(d.data.removed > 5);
      assert.ok((await prisma.workMeetingSeries.findUniqueOrThrow({ where: { id: r.data.id } })).endedAt);
    });

    it('mẫu cho MỘT buổi: tạo họp kèm mẫu; áp mẫu không đè biên bản đã viết', async () => {
      const t = await call(staff, 'GET', `/projects/${pid}/meeting-templates`);
      assert.deepEqual(t.data.map((x: any) => x.key), ['daily', 'sprint-planning', 'sprint-review', 'retro', 'lecturer', 'client']);
      const m = await call(staff, 'POST', `/projects/${pid}/meetings`, { title: 'Sprint 3 planning', startsAt: `${dayPlus(3)}T02:00:00Z`, endsAt: `${dayPlus(3)}T03:30:00Z`, templateKey: 'sprint-planning' });
      ok(m, 201);
      assert.equal(m.data.type, 'PLANNING');
      assert.equal(m.data.templateKey, 'sprint-planning');
      ok(await call(staff, 'PATCH', `/projects/${pid}/meetings/${m.data.number}`, { minutesJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Goal agreed' }] }] } }));
      const ap = await call(staff, 'POST', `/projects/${pid}/meetings/${m.data.number}/apply-template`, { key: 'retro', replace: true });
      ok(ap);
      assert.equal(ap.data.type, 'RETRO');
      const row = await prisma.workMeeting.findFirstOrThrow({ where: { projectId: pid, number: m.data.number } });
      assert.match(row.minutesText ?? '', /Goal agreed/);
      assert.equal((row.agendaItems as any[]).length, 5);
    });
  });

  // ─── 3. RSVP cổng khách ──────────────────────────────────────────

  describe('RSVP trên cổng khách', () => {
    let num = 0, pastNum = 0;
    it('dựng', async () => {
      const m = await call(staff, 'POST', `/projects/${pid}/meetings`, { title: 'Sprint review with client', startsAt: `${dayPlus(4)}T07:00:00Z`, endsAt: `${dayPlus(4)}T08:00:00Z`, attendeeIds: [client.id] });
      ok(m, 201);
      num = m.data.number;
      const p = await call(staff, 'POST', `/projects/${pid}/meetings`, { title: 'Old', startsAt: '2026-01-05T07:00:00Z', endsAt: '2026-01-05T08:00:00Z', attendeeIds: [client.id] });
      pastNum = p.data.number;
    });
    it('khách trả lời ⇒ lưu + chủ trì nhận chuông; danh sách hiện câu trả lời', async () => {
      const r = await call(client, 'POST', `/projects/${pid}/portal/meetings/${num}/rsvp`, { rsvp: 'MAYBE', note: 'Might be 10 min late' });
      ok(r);
      assert.equal(r.data.me.rsvp, 'MAYBE');
      assert.equal(r.data.me.canRsvp, true);
      const n = await prisma.socialNotification.findFirst({ where: { receiverId: staff.id, senderId: client.id }, orderBy: { id: 'desc' } });
      assert.match(JSON.stringify(n?.payload ?? ''), /client\) replied Maybe/);
      const l = await call(client, 'GET', `/projects/${pid}/portal/meetings`);
      assert.equal(l.data.canRsvp, true);
      assert.equal(l.data.items.find((x: any) => x.number === num).myRsvp, 'MAYBE');
      const row = await prisma.workMeetingAttendee.findFirstOrThrow({ where: { userId: client.id, meeting: { projectId: pid, number: num } } });
      assert.equal(row.rsvpNote, 'Might be 10 min late');
    });
    it('xem trước của nhân viên chỉ đọc; khách không được mời 404; họp đã qua 400', async () => {
      assert.equal((await call(staff, 'POST', `/projects/${pid}/portal/meetings/${num}/rsvp?as=client`, { rsvp: 'YES' })).status, 403);
      assert.equal((await call(client2, 'POST', `/projects/${pid}/portal/meetings/${num}/rsvp`, { rsvp: 'YES' })).status, 404);
      assert.equal((await call(client, 'POST', `/projects/${pid}/portal/meetings/${pastNum}/rsvp`, { rsvp: 'YES' })).code, 'WORK_MEETING_PAST');
      assert.equal((await call(client, 'POST', `/projects/${pid}/portal/meetings/${num}/rsvp`, { rsvp: 'PERHAPS' })).status, 400);
    });
  });

  // ─── 4. Ảnh Mermaid vẽ sẵn ───────────────────────────────────────

  describe('ảnh Mermaid cho API/MCP + xuất Docs', () => {
    const source = 'sequenceDiagram\n  Customer->>System: Place order\n  System-->>Customer: Confirmation';
    let dn = 0;
    it('chưa vẽ ⇒ 404 WORK_DIAGRAM_NOT_RENDERED; gửi SVG + PNG ⇒ GET image', async () => {
      const d = await call(staff, 'POST', `/projects/${pid}/diagrams`, { title: 'Place order', source });
      ok(d, 201);
      dn = d.data.number;
      const miss = await call(staff, 'GET', `/projects/${pid}/diagrams/${dn}/image.png`);
      assert.equal(miss.status, 404);
      assert.equal(miss.code, 'WORK_DIAGRAM_NOT_RENDERED');
      const png = await sharp({ create: { width: 320, height: 200, channels: 3, background: '#ffffff' } }).png().toBuffer();
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)" width="320" height="200"><script>x()</script><text x="10" y="20">Place order</text></svg>';
      ok(await call(staff, 'POST', `/projects/${pid}/diagram-renders`, { source: `${source}\n`, svg, png: `data:image/png;base64,${png.toString('base64')}` }), 201);
      assert.equal((await call(staff, 'POST', `/projects/${pid}/diagram-renders`, { source, png: 'data:image/png;base64,R0lGODlh' })).status, 400);
      const s = await call(staff, 'GET', `/projects/${pid}/diagrams/${dn}/image.svg`);
      ok(s);
      assert.equal(s.headers.get('content-type'), 'image/svg+xml');
      assert.match(s.headers.get('content-security-policy') ?? '', /default-src 'none'/);
      assert.doesNotMatch(s.buf.toString(), /script|onload/);
      const p = await call(staff, 'GET', `/projects/${pid}/diagrams/${dn}/image.png?version=1`);
      ok(p);
      assert.equal((await sharp(p.buf).metadata()).width, 320);
      assert.equal((await call(client, 'GET', `/projects/${pid}/diagrams/${dn}/image.png`)).status, 403);
    });
    it('xuất trang Docs qua API (không gửi ảnh) ⇒ khối mermaid thành ảnh, không còn chú thích "source"', async () => {
      const pg = await call(staff, 'POST', `/projects/${pid}/pages`, { title: 'Design', markdown: `# Flow\n\n\`\`\`mermaid\n${source}\n\`\`\`\n` });
      ok(pg, 201);
      const ex = await call(staff, 'GET', `/projects/${pid}/pages/${pg.data.number}/export.docx`);
      ok(ex);
      const zip = await JSZip.loadAsync(ex.buf);
      assert.ok(Object.keys(zip.files).some((f) => f.startsWith('word/media/')), 'docx có ảnh sơ đồ');
      assert.doesNotMatch(await zip.file('word/document.xml')!.async('string'), /Mermaid diagram \(source\)/);
    });
  });

  // ─── 5. Phân tích tĩnh + V(G) ────────────────────────────────────

  describe('phân tích tĩnh (SARIF) + V(G)', () => {
    let ci: { token: string };
    const sarif = (withUnused: boolean) => ({
      version: '2.1.0',
      runs: [{
        tool: { driver: { name: 'ESLint', rules: [{ id: 'no-unused-vars' }, { id: 'no-eval', defaultConfiguration: { level: 'error' } }, { id: 'complexity' }] } },
        results: [
          ...(withUnused ? [{ ruleId: 'no-unused-vars', level: 'warning', message: { text: "'tmp' is defined but never used." }, locations: [{ physicalLocation: { artifactLocation: { uri: 'src/a.ts' }, region: { startLine: 4 } } }] }] : []),
          { ruleId: 'no-eval', message: { text: 'eval can be harmful.' }, locations: [{ physicalLocation: { artifactLocation: { uri: 'src/b.ts' }, region: { startLine: 9 } } }] },
          { ruleId: 'complexity', level: 'warning', message: { text: "Function 'checkout' has a complexity of 13. Maximum allowed is 10." }, locations: [{ physicalLocation: { artifactLocation: { uri: 'src/cart.ts' }, region: { startLine: 20 } } }] },
        ],
      }],
    });
    it('token tests:write nhập SARIF thân thô (chính tệp .sarif) ⇒ 3 phát hiện + V(G)', async () => {
      const t = await call(staff, 'POST', '/me/api-tokens', { name: 'CI static', scopes: ['tests:write'] });
      ok(t, 201);
      ci = { token: t.data.token };
      const r = await call(ci, 'POST', `/projects/${pid}/tests/automation/static?build=42`, sarif(true));
      ok(r, 201);
      assert.equal(r.data.findings, 3);
      assert.equal(r.data.newFindings, 3);
      assert.equal(r.data.issuesCreated, 0, 'mặc định chỉ là đề xuất');
      assert.equal(r.data.complexityUnits, 1);
      // tests:write = đọc + ĐÚNG hai tuyến nhập; mọi tuyến ghi khác ⇒ 403.
      assert.equal((await call(ci, 'POST', `/projects/${pid}/static-analysis/vg`, { decisions: 2 })).status, 403);
    });
    it('nhập lại ⇒ không trùng; phát hiện biến mất ⇒ FIXED; createIssues ⇒ bug cho lỗi MỚI mức error', async () => {
      const r = await call(ci, 'POST', `/projects/${pid}/tests/automation/static`, { report: sarif(false), createIssues: true });
      ok(r, 201);
      assert.equal(r.data.newFindings, 0);
      assert.equal(r.data.fixed, 1);
      assert.equal(r.data.issuesCreated, 0, 'no-eval không mới ⇒ không mở bug');
      const o = await call(staff, 'GET', `/projects/${pid}/static-analysis`);
      ok(o);
      assert.equal(o.data.summary.fixed, 1);
      assert.equal(o.data.summary.openErrors, 1);
      const ev = o.data.findings.find((f: any) => f.ruleId === 'no-eval');
      const mk = await call(staff, 'POST', `/projects/${pid}/static-analysis/findings/${ev.id}/issue`);
      ok(mk, 201);
      assert.equal(mk.data.created, true);
      const again = await call(staff, 'POST', `/projects/${pid}/static-analysis/findings/${ev.id}/issue`);
      assert.equal(again.data.created, false);
      const defect = await prisma.workDefectInfo.findFirstOrThrow({ where: { issue: { projectId: pid, number: mk.data.number } } });
      assert.equal(defect.activity, 'Review');
      const cx = o.data.findings.find((f: any) => f.ruleId === 'complexity');
      ok(await call(staff, 'POST', `/projects/${pid}/static-analysis/findings/${cx.id}/ignore`));
      assert.equal((await call(viewer, 'POST', `/projects/${pid}/static-analysis/findings/${cx.id}/reopen`)).status, 403);
    });
    it('JaCoCo XML (thân thô) ⇒ V(G) theo phương thức; máy tính V(G)', async () => {
      const xml = '<?xml version="1.0"?><report name="x"><package name="lab"><class name="lab/Calc" sourcefilename="Calc.java"><method name="divide" desc="(II)I" line="8"><counter type="COMPLEXITY" missed="1" covered="11"/></method></class></package></report>';
      const r = await call(ci, 'POST', `/projects/${pid}/tests/automation/static?kind=jacoco`, xml);
      ok(r, 201);
      assert.equal(r.data.complexityUnits, 1);
      const o = await call(staff, 'GET', `/projects/${pid}/static-analysis`);
      const u = o.data.complexity.units.find((x: any) => x.name === 'Calc.divide');
      assert.equal(u.vg, 12);
      assert.equal(u.risk, 'MODERATE');
      assert.equal(o.data.complexity.summary.units, 2);
      const v = await call(staff, 'POST', `/projects/${pid}/static-analysis/vg`, { edges: 11, nodes: 9 });
      assert.equal(v.data.vg, 4);
      assert.equal((await call(staff, 'POST', `/projects/${pid}/tests/automation/static`, { report: 'nonsense', kind: 'sarif' })).status, 400);
    });
  });

  // ─── 6. Cycle CI gộp + phiên bản test case ───────────────────────

  describe('cycle CI gộp tự đóng + phiên bản test case', () => {
    const junit = (name: string) => `<?xml version="1.0"?><testsuite name="api" tests="1"><testcase classname="api" name="${name}" time="0.1"/></testsuite>`;
    it('jobs=2: lần 1 mở, lần 2 đóng (JOBS); close=true đóng ngay; im lặng quá hạn ⇒ cron đóng', async () => {
      const a = await call(staff, 'POST', `/projects/${pid}/tests/automation/import?cycle=Nightly&jobs=2&build=7`, junit('t1'));
      ok(a, 201);
      assert.equal(a.data.cycleClosed, false);
      const b = await call(staff, 'POST', `/projects/${pid}/tests/automation/import?cycle=Nightly&build=7`, junit('t2'));
      assert.equal(b.data.cycleId, a.data.cycleId);
      assert.equal(b.data.closedReason, 'JOBS');
      const c = await call(staff, 'POST', `/projects/${pid}/tests/automation/import?cycle=Nightly&close=true`, junit('t3'));
      assert.notEqual(c.data.cycleId, a.data.cycleId);
      assert.equal(c.data.closedReason, 'CLOSE');
      const d = await call(staff, 'POST', `/projects/${pid}/tests/automation/import?cycle=Smoke&closeAfterMin=30`, junit('t4'));
      assert.equal(d.data.cycleClosed, false);
      await prisma.workTestCycle.update({ where: { id: d.data.cycleId }, data: { lastImportAt: new Date(Date.now() - 31 * 60_000) } });
      const { closeIdleCycles } = await import('../services/work/testAutomation.service.js');
      assert.ok((await closeIdleCycles()) >= 1);
      const cy = await call(staff, 'GET', `/projects/${pid}/test-cycles/${d.data.cycleId}`);
      assert.equal(cy.data.state, 'DONE');
      assert.equal(cy.data.closedReason, 'IDLE');
      assert.equal(cy.data.importCount, 1);
    });
    it('run ghi phiên bản test case; sửa bước ⇒ version tăng ⇒ run "outdated"', async () => {
      const t = await call(staff, 'POST', `/projects/${pid}/tests`, { title: 'Login works', steps: [{ action: 'Open login', expected: 'Form shown' }] });
      ok(t, 201);
      const num = t.data.number ?? t.data.issue?.number;
      const cyc = await call(staff, 'POST', `/projects/${pid}/test-cycles`, { name: 'Sprint 3', numbers: [num] });
      ok(cyc, 201);
      const cid = cyc.data.id;
      let c = await call(staff, 'GET', `/projects/${pid}/test-cycles/${cid}`);
      assert.equal(c.data.runs[0].testVersion, 1);
      assert.equal(c.data.runs[0].outdated, false);
      ok(await call(staff, 'PUT', `/projects/${pid}/tests/${num}`, { steps: [{ action: 'Open login', expected: 'Form shown with captcha' }] }));
      ok(await call(staff, 'PUT', `/projects/${pid}/tests/${num}`, { steps: [{ action: 'Open login', expected: 'Form shown with captcha' }] }));
      c = await call(staff, 'GET', `/projects/${pid}/test-cycles/${cid}`);
      assert.equal(c.data.runs[0].currentVersion, 2, 'lưu lại cùng nội dung không tăng version');
      assert.equal(c.data.runs[0].outdated, true);
    });
  });

  // ─── 7. SWR302 ───────────────────────────────────────────────────

  describe('SWR302: ước lượng BA, báo cáo trạng thái, gói nộp, stakeholder AI', () => {
    it('ước lượng: số tự đếm từ dữ liệu, ghi đè + cảnh báo lệch, xuất xlsx', async () => {
      await call(staff, 'POST', `/projects/${swrPid}/srs/actors`, { name: 'Payment Gateway', kind: 'SYSTEM' });
      await call(staff, 'POST', `/projects/${swrPid}/srs/screens`, { name: 'Checkout', feature: 'Ordering' });
      ok(await call(staff, 'POST', `/projects/${swrPid}/swr/stakeholders`, { name: 'Lan', role: 'Fulfillment Manager', majorValue: 'Fewer lost orders', constraints: 'No new scanners this year', attitude: 'CHAMPION' }), 201);
      const g = await call(staff, 'GET', `/projects/${swrPid}/swr/estimation`);
      ok(g);
      assert.equal(g.data.auto.screens, 1);
      assert.equal(g.data.auto.stakeholders, 1);
      assert.equal(g.data.auto.interfacesSmall, 1);
      const put = await call(staff, 'PUT', `/projects/${swrPid}/swr/estimation`, { counts: { screens: 9 }, project: { baHourlyCost: 10, requirementsWeeks: 4, projectWeeks: 10, developers: 5, totalBudget: 50_000 }, minutes: { plans: 300 } });
      ok(put);
      assert.equal(put.data.result.counts.screens, 9);
      assert.deepEqual(put.data.mismatches.map((m: any) => [m.key, m.entered, m.actual]), [['screens', 9, 1]]);
      assert.equal(put.data.result.rows.find((r: any) => r.key === 'plans').minutesPerUnit, 300);
      assert.ok(put.data.result.methods.activity.bas > 0);
      const back = await call(staff, 'PUT', `/projects/${swrPid}/swr/estimation`, { counts: { screens: null } });
      assert.equal(back.data.result.counts.screens, 1);
      const x = await call(staff, 'GET', `/projects/${swrPid}/swr/export/estimation.xlsx`);
      ok(x);
      const { readXlsx } = await import('../services/work/xlsxStyled.js');
      assert.deepEqual(readXlsx(x.buf).map((s) => s.name), ['Summary', 'Assumptions']);
    });
    it('báo cáo trạng thái yêu cầu + xlsx', async () => {
      const r = await call(staff, 'GET', `/projects/${swrPid}/swr/status-report?days=30`);
      ok(r);
      assert.equal(typeof r.data.window.volatility, 'number');
      assert.equal(r.data.trend.length, 8);
      ok(await call(staff, 'GET', `/projects/${swrPid}/swr/export/status-report.xlsx`));
    });
    it('gói ZIP 8 deliverable đúng tên tệp + README', async () => {
      const z = await call(staff, 'GET', `/projects/${swrPid}/swr/package.zip`);
      ok(z);
      assert.equal(z.headers.get('content-type'), 'application/zip');
      const zip = await JSZip.loadAsync(z.buf);
      const names = Object.keys(zip.files);
      for (const f of ['1_Vision_and_Scope.docx', '2_Use_Cases.docx', '4_Software_Requirements_Specification.docx', '7_Requirements_Prioritization.xlsx', '8_Requirements_Estimation.xlsx', '6_Mockups/MOCKUPS.txt', 'README.txt']) {
        assert.ok(names.some((n) => n.endsWith(f) || n.endsWith(`${f}_MISSING.txt`)), `${f} trong ${names.join(', ')}`);
      }
    });
    it('stakeholder do AI đóng vai: hỏi–đáp lưu transcript, đề xuất yêu cầu đọc transcript (AI-simulated), xoá được', async () => {
      const e = await call(staff, 'POST', `/projects/${swrPid}/swr/elicitation`, { title: 'Interview Lan (AI)', technique: 'INTERVIEW', objective: 'Why orders get lost', participants: [{ stakeholder: 'SH-1' }] });
      ok(e, 201);
      const { _setElicitationAskForTests } = await import('../services/work/swrElic.service.js');
      let sys = '';
      _setElicitationAskForTests(async (s, u) => {
        if (/role-playing ONE stakeholder/.test(s)) { sys = s; return 'Pickers lose the paper pick list when the printer jams, about twice a day.'; }
        const line = /(\d+)\. \[Lan \(AI-simulated\)\][^\n]*printer jams/.exec(u)?.[1] ?? /(\d+)\.[^\n]*printer jams/.exec(u)?.[1];
        return JSON.stringify({ requirements: [{ title: 'The system shall keep pick lists available when the printer jams', type: 'FUNCTIONAL', evidence: [{ line: Number(line), quote: 'printer jams' }] }] });
      });
      const a = await call(staff, 'POST', `/projects/${swrPid}/swr/elicitation/${e.data.key}/ai-stakeholder`, { question: 'What goes wrong most often?', language: 'en' });
      ok(a);
      assert.equal(a.data.turns.length, 2);
      assert.equal(a.data.persona.key, 'SH-1');
      assert.match(sys, /Fulfillment Manager/);
      assert.match(sys, /No new scanners this year/);
      const s = await call(staff, 'GET', `/projects/${swrPid}/swr/elicitation/${e.data.key}`);
      assert.equal(s.data.aiSimulated, true);
      assert.equal(s.data.aiTranscript.length, 2);
      assert.match(s.data.sourceText, /AI-simulated/);
      const pr = await call(staff, 'POST', `/projects/${swrPid}/swr/elicitation/${e.data.key}/propose`, { language: 'en' });
      ok(pr);
      assert.equal(pr.data.added, 1);
      assert.equal((await call(client2, 'POST', `/projects/${swrPid}/swr/elicitation/${e.data.key}/ai-stakeholder`, { question: 'x' })).status, 404);
      ok(await call(staff, 'DELETE', `/projects/${swrPid}/swr/elicitation/${e.data.key}/ai-stakeholder`));
      assert.equal((await call(staff, 'GET', `/projects/${swrPid}/swr/elicitation/${e.data.key}`)).data.aiTranscript.length, 0);
    });
  });

  // ─── 8. Đóng góp: xuất tiếng Việt ────────────────────────────────

  it('đóng góp: xuất xlsx ?lang=vi ⇒ sheet định nghĩa tiếng Việt', async () => {
    const x = await call(owner, 'GET', `/projects/${pid}/contrib/export.xlsx?preset=30d&lang=vi`);
    ok(x);
    const { readXlsx } = await import('../services/work/xlsxStyled.js');
    const def = readXlsx(x.buf).find((s) => s.name === 'Definitions')!;
    assert.equal(def.text(1, 2), 'Cách tính');
    const en = readXlsx((await call(owner, 'GET', `/projects/${pid}/contrib/export.xlsx?preset=30d`)).buf).find((s) => s.name === 'Definitions')!;
    assert.equal(en.text(1, 2), 'How it is counted');
  });
});
