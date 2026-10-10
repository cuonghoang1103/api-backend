/**
 * CT Work đợt 8b — Notion · Slack · Builder · lịch tự gửi, qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.ctw8b.db.test.ts
 * KHÔNG gọi Notion/Slack thật: mọi lời gọi mạng đi qua `_setOAuthFetchForTests` (khung 8a) — fetch giả trả fixture; thư
 * qua `_setReportMailerForTests`; kho tệp là storage sandbox (bắt buộc khi test).
 *
 *   1. Slack: chữ ký sai ⇒ 401, lệch giờ ⇒ 401, gửi lại đúng gói ⇒ 409; /ctwork new ⇒ ĐỀ XUẤT chờ duyệt (không tạo thẻ); kênh
 *      chưa nối ⇒ lời nhắc; url_verification; unfurl chỉ link của không gian đã nối; thông báo dự án ⇒ chat.postMessage.
 *   2. Builder: mẫu sẵn, lưu mẫu (MEMBER), VIEWER/khách/agent bị chặn, xem trước có biểu đồ SVG, xuất PDF + DOCX.
 *   3. Lịch gửi: người nhận ngoài ⇒ chờ OWNER/ADMIN duyệt; cron gửi ĐÚNG MỘT LẦN mỗi kỳ; nhật ký + tải lại tệp; quyền.
 *   4. Notion: nhập trang (ảnh về kho dự án, trang con), xuất trang, nhập database ⇒ thẻ không trùng theo externalId.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { slackSign } from '../services/work/slackRules.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `c8b${Date.now().toString(36)}`;
const userIds: number[] = [];
const wsIds: number[] = [];
type U = { id: number; token: string; email: string };
const SIGNING = 'test-signing-secret-8b';
const fixDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'services', 'work', '__fixtures__', 'ctw8b');

describe('CT Work — đợt 8b: Notion, Slack, Builder, lịch tự gửi (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, staff: U, viewer: U, outsider: U, client: U, bot: U;
  let wsId = 0, pid = 0, wsSlug = '';
  const calls: Array<{ url: string; method: string; body: string }> = [];
  const mails: Array<{ to: string; attachments: number }> = [];
  let png: Buffer;

  async function mkUser(name: string, kind: 'HUMAN' | 'AGENT' = 'HUMAN'): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email, displayName: name[0].toUpperCase() + name.slice(1), kind } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email };
  }
  async function call(u: U | null, method: string, p: string, body?: unknown, headers: Record<string, string> = {}) {
    const res = await fetch(`${base}/api/v1/work${p}`, {
      method, headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}), ...headers },
      body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
    });
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('json')) return { status: res.status, data: null, raw: null, buf: Buffer.from(await res.arrayBuffer()), ct, code: undefined as string | undefined };
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, raw: json, buf: null, ct, code: (json.code ?? json.error?.code) as string | undefined };
  }
  const slackPost = (p: string, body: string, opts: { ts?: number; secret?: string; sig?: string } = {}) => {
    const ts = String(opts.ts ?? Math.floor(Date.now() / 1000));
    const sig = opts.sig ?? slackSign(opts.secret ?? SIGNING, ts, body);
    return fetch(`${base}/api/v1/work${p}`, { method: 'POST', headers: { 'Content-Type': p.endsWith('commands') ? 'application/x-www-form-urlencoded' : 'application/json', 'X-Slack-Signature': sig, 'X-Slack-Request-Timestamp': ts }, body });
  };
  const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json' } });
  const notionFixture = JSON.parse(readFileSync(path.join(fixDir, 'notion-page.json'), 'utf8'));
  const notionDb = JSON.parse(readFileSync(path.join(fixDir, 'notion-database.json'), 'utf8'));

  /** Fetch giả cho Notion + Slack (khung 8a gọi qua đây — không ra Internet). */
  async function fakeFetch(url: string, init?: RequestInit): Promise<Response> {
    const method = init?.method ?? 'GET';
    const body = typeof init?.body === 'string' ? init.body : '';
    calls.push({ url, method, body });
    const u = new URL(url);
    if (u.hostname === 'slack.com') {
      const m = u.pathname.replace('/api/', '');
      if (m === 'conversations.list') return json({ ok: true, channels: [{ id: 'C0TEAM8B', name: 'team-lab' }, { id: 'C0OLD', name: 'old', is_archived: true }] });
      if (m === 'chat.postMessage' || m === 'chat.unfurl' || m === 'files.completeUploadExternal') return json({ ok: true });
      if (m === 'files.getUploadURLExternal') return json({ ok: true, upload_url: 'https://files.slack.com/upload/v1/abc', file_id: 'F123' });
      return json({ ok: false, error: 'unknown_method' });
    }
    if (u.hostname === 'files.slack.com') return new Response('OK', { status: 200 });
    if (u.hostname === 'prod-files-secure.s3.us-west-2.amazonaws.com') return new Response(new Uint8Array(png), { status: 200, headers: { 'Content-Type': 'image/png', 'Content-Length': String(png.length) } });
    if (u.hostname === 'api.notion.com') {
      const p = u.pathname.replace('/v1', '');
      if (p === '/search') return json({ results: [{ object: 'page', id: notionFixture.page.id, properties: notionFixture.page.properties, url: 'https://notion.so/x' }] });
      if (/^\/pages\/[0-9a-f-]+$/.test(p) && method === 'GET') {
        const isChild = p.endsWith('b17');
        return json(isChild ? { id: p.slice(7), properties: { title: { type: 'title', title: [{ plain_text: 'Biên bản họp 1' }] } } } : notionFixture.page);
      }
      if (/^\/blocks\/[0-9a-f-]+\/children$/.test(p) && method === 'GET') {
        const id = p.split('/')[2];
        if (id === notionFixture.page.id) {
          // Trang chính: fixture (con lồng sẵn ⇒ has_children=false để không hỏi tiếp); trang con b17 có id hợp lệ.
          const strip = (bs: any[]): any[] => bs.map((b) => ({ ...b, id: b.id === 'b17' ? '00000000-0000-0000-0000-000000000b17' : b.id, has_children: false, children: undefined, ...(b.children ? { [b.type]: b[b.type] } : {}) }));
          const flat = strip(notionFixture.blocks).filter((b: any) => !['b15', 'b18', 'b3', 'b13'].includes(b.id));
          return json({ results: flat, has_more: false });
        }
        return json({ results: [{ id: 'x1', type: 'paragraph', paragraph: { rich_text: [{ plain_text: 'Nội dung biên bản', text: { content: 'Nội dung biên bản' } }] } }], has_more: false });
      }
      if (p === '/file_uploads') return json({ id: 'fu_1', upload_url: 'https://api.notion.com/v1/file_uploads/fu_1/send' });
      if (p === '/file_uploads/fu_1/send') return json({ id: 'fu_1', status: 'uploaded' });
      if (p === '/pages' && method === 'POST') return json({ id: 'new-notion-page', url: 'https://notion.so/new' });
      if (/^\/blocks\/.+\/children$/.test(p) && method === 'PATCH') return json({ results: [] });
      if (/^\/databases\/[0-9a-f-]+$/.test(p)) return json({ title: [{ plain_text: 'Backlog Notion' }], properties: Object.fromEntries(notionDb.schema.map((s: any) => [s.name, { type: s.type }])) });
      if (/^\/databases\/[0-9a-f-]+\/query$/.test(p)) {
        const rows = JSON.parse(JSON.stringify(notionDb.rows).replace('__STAFF_EMAIL__', staff.email));
        return json({ results: rows, has_more: false });
      }
    }
    return json({ error: 'unexpected', url }, 500);
  }

  before(async () => {
    process.env.CTW_SLACK_SIGNING_SECRET = SIGNING;
    process.env.CTW_SLACK_CLIENT_ID = 'cid'; process.env.CTW_SLACK_CLIENT_SECRET = 'csec';
    process.env.CTW_NOTION_CLIENT_ID = 'nid'; process.env.CTW_NOTION_CLIENT_SECRET = 'nsec';
    process.env.WORK_INTAKE_RPM = '1000';
    png = await sharp({ create: { width: 8, height: 8, channels: 3, background: '#0f766e' } }).png().toBuffer();
    (await import('../services/work/oauth/index.js'))._setOAuthFetchForTests(fakeFetch);
    (await import('../services/work/reportSchedule.service.js'))._setReportMailerForTests(async (m) => { mails.push({ to: m.to, attachments: m.attachments.length }); return { success: true }; });
    (await import('../services/work/reportBuilder.service.js'))._setAiForTests(async (aud, lang) => `AI (${aud}, ${lang}): nhóm đúng tiến độ.`);
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use('/api/v1/work/intake', express.raw({ type: '*/*', limit: '5mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, staff, viewer, outsider, client] = await Promise.all(['owner', 'staff', 'viewer', 'outsider', 'client'].map((n) => mkUser(n)));
    const ws = await call(owner, 'POST', '/workspaces', { name: `CTW8b ${tag}` });
    wsId = ws.data.id; wsSlug = ws.data.slug;
    wsIds.push(wsId);
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [staff.email, viewer.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'RB', name: 'Report lab', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    await call(owner, 'PUT', `/projects/${pid}/members/${staff.id}`, { role: 'MEMBER' });
    await call(owner, 'PUT', `/projects/${pid}/members/${viewer.id}`, { role: 'VIEWER' });
    await call(owner, 'POST', `/projects/${pid}/portal/invite`, { emails: [client.email] });
    bot = await mkUser('bot', 'AGENT');
    await prisma.workMember.create({ data: { workspaceId: wsId, userId: bot.id, role: 'MEMBER' } });
    await prisma.workProjectMember.create({ data: { projectId: pid, userId: bot.id, role: 'MEMBER' } });
    // Kết nối OAuth giả (như sau callback của khung 8a): Slack của owner, Notion của owner.
    const { sealToken, tokenAad } = await import('../services/work/oauth/crypto.js');
    await prisma.workOAuthConnection.create({ data: { userId: owner.id, provider: 'slack', accountId: 'T8BTEAM', accountName: 'Lab Slack', accessTokenEnc: sealToken('xoxb-fake', tokenAad('slack', owner.id)) } });
    await prisma.workOAuthConnection.create({ data: { userId: owner.id, provider: 'notion', accountId: 'nws', accountName: 'Lab Notion', accessTokenEnc: sealToken('secret_fake', tokenAad('notion', owner.id)) } });
    // Vài thẻ để báo cáo có số.
    const types = await prisma.workIssueType.findMany({ where: { projectId: pid, level: 0 } });
    for (let i = 0; i < 3; i++) await call(staff, 'POST', `/projects/${pid}/issues`, { title: `Thẻ báo cáo ${i + 1}`, typeId: types[0].id });
  });

  after(async () => {
    (await import('../services/work/oauth/index.js'))._setOAuthFetchForTests(null);
    (await import('../services/work/reportSchedule.service.js'))._setReportMailerForTests(null);
    (await import('../services/work/reportBuilder.service.js'))._setAiForTests(null);
    server?.close();
    await prisma.workExtNonce.deleteMany({ where: { createdAt: { gte: new Date(Date.now() - 3600_000) } } }).catch(() => {});
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) {
      await prisma.workOAuthLog.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  // ═══ 1. Slack ═══════════════════════════════════════════════════

  it('1a. cài app cho không gian + nối kênh (quyền)', async () => {
    const st = await call(owner, 'GET', `/workspaces/${wsId}/slack`);
    assert.equal(st.status, 200);
    assert.equal(st.data.configured.oauth, true);
    assert.equal(st.data.myConnection.teamId, 'T8BTEAM');
    assert.equal((await call(staff, 'POST', `/workspaces/${wsId}/slack/link`)).status, 403, 'MEMBER không gian không cài được');
    assert.equal((await call(bot, 'POST', `/workspaces/${wsId}/slack/link`)).status, 403, 'agent');
    const link = await call(owner, 'POST', `/workspaces/${wsId}/slack/link`);
    assert.equal(link.status, 200, JSON.stringify(link.raw));
    assert.equal(link.data.teamName, 'Lab Slack');
    const avail = await call(owner, 'GET', `/projects/${pid}/slack/available`);
    assert.deepEqual(avail.data.map((c: any) => c.id), ['C0TEAM8B'], 'kênh lưu trữ bị lọc');
    assert.equal((await call(staff, 'POST', `/projects/${pid}/slack/channels`, { channelId: 'C0TEAM8B', channelName: 'team-lab' })).status, 403);
    assert.equal((await call(bot, 'GET', `/projects/${pid}/slack`)).status, 403);
    const add = await call(owner, 'POST', `/projects/${pid}/slack/channels`, { channelId: 'C0TEAM8B', channelName: '#team-lab', events: ['issue.created'] });
    assert.equal(add.status, 201, JSON.stringify(add.raw));
    assert.equal(add.data.channelName, 'team-lab');
    assert.equal((await call(owner, 'POST', `/projects/${pid}/slack/channels`, { channelId: 'C0TEAM8B', channelName: 'x' })).status, 409);
    const t = await call(owner, 'POST', `/projects/${pid}/slack/channels/${add.data.id}/test`);
    assert.equal(t.status, 200);
    const posted = calls.filter((c) => c.url.endsWith('chat.postMessage'));
    assert.ok(posted.length >= 1 && JSON.parse(posted.at(-1)!.body).channel === 'C0TEAM8B');
  });

  it('1b. /ctwork: chữ ký sai ⇒ 401, lệch giờ ⇒ 401, gửi lại ⇒ 409, đúng ⇒ ĐỀ XUẤT chờ duyệt', async () => {
    const form = new URLSearchParams({ team_id: 'T8BTEAM', channel_id: 'C0TEAM8B', channel_name: 'team-lab', user_id: 'U1', user_name: 'lan', command: '/ctwork', text: 'new Sửa lỗi đăng nhập | bấm nút không chạy', trigger_id: `tr-${tag}` }).toString();
    assert.equal((await slackPost('/intake/slack/commands', form, { secret: 'wrong' })).status, 401);
    assert.equal((await slackPost('/intake/slack/commands', form, { sig: 'v0=deadbeef' })).status, 401);
    assert.equal((await slackPost('/intake/slack/commands', form, { ts: Math.floor(Date.now() / 1000) - 400 })).status, 401, 'quá 5 phút');
    const ts = Math.floor(Date.now() / 1000);
    const okRes = await slackPost('/intake/slack/commands', form, { ts });
    assert.equal(okRes.status, 200);
    const okJson = (await okRes.json()) as any;
    assert.equal(okJson.response_type, 'ephemeral');
    assert.match(okJson.text, /Report lab/);
    const replay = await slackPost('/intake/slack/commands', form, { ts });
    assert.equal(replay.status, 409, 'gửi lại đúng gói ⇒ chặn');
    const props = await prisma.workIntakeProposal.findMany({ where: { projectId: pid, source: 'SLACK' } });
    assert.equal(props.length, 1);
    assert.equal(props[0].status, 'PENDING');
    assert.equal(props[0].title, 'Sửa lỗi đăng nhập');
    assert.equal(props[0].body, 'bấm nút không chạy');
    assert.equal(await prisma.workIssue.count({ where: { projectId: pid, title: 'Sửa lỗi đăng nhập' } }), 0, 'không tạo thẻ thẳng');
    // Duyệt qua hộp đề xuất chung của 7b.
    const dec = await call(staff, 'POST', `/projects/${pid}/intake/proposals/${props[0].id}/decide`, { decision: 'ACCEPT' });
    assert.equal(dec.status, 200, JSON.stringify(dec.raw));
    assert.ok(dec.data.issue);
    // Kênh chưa nối ⇒ nhắc, không tạo.
    const other = new URLSearchParams({ team_id: 'T8BTEAM', channel_id: 'C0NOTLINKED', text: 'new X', trigger_id: `tr2-${tag}` }).toString();
    const r2 = (await (await slackPost('/intake/slack/commands', other)).json()) as any;
    assert.match(r2.text, /not connected/);
    const help = (await (await slackPost('/intake/slack/commands', new URLSearchParams({ team_id: 'T8BTEAM', text: 'help', trigger_id: 'h' }).toString())).json()) as any;
    assert.match(help.text, /Usage/);
  });

  it('1c. events: url_verification, unfurl chỉ link của không gian đã nối, retry cùng event_id bị bỏ', async () => {
    const ch = await (await slackPost('/intake/slack/events', JSON.stringify({ type: 'url_verification', challenge: 'abc123' }))).json() as any;
    assert.equal(ch.challenge, 'abc123');
    assert.equal((await slackPost('/intake/slack/events', JSON.stringify({ type: 'url_verification', challenge: 'x' }), { secret: 'bad' })).status, 401);
    const before = calls.filter((c) => c.url.endsWith('chat.unfurl')).length;
    const ev = (eid: string, links: string[]) => JSON.stringify({ type: 'event_callback', team_id: 'T8BTEAM', event_id: eid, event: { type: 'link_shared', channel: 'C0TEAM8B', message_ts: '1.2', links: links.map((url) => ({ url, domain: 'cuongthai.com' })) } });
    const r = await (await slackPost('/intake/slack/events', ev(`Ev1${tag}`, [`https://cuongthai.com/work/${wsSlug}/RB/issue/1`, 'https://cuongthai.com/work/khac/ZZ/issue/1']))).json() as any;
    assert.equal(r.unfurled, 1);
    const sent = calls.filter((c) => c.url.endsWith('chat.unfurl'));
    assert.equal(sent.length, before + 1);
    const unf = JSON.parse(sent.at(-1)!.body);
    assert.deepEqual(Object.keys(unf.unfurls), [`https://cuongthai.com/work/${wsSlug}/RB/issue/1`]);
    assert.match(JSON.stringify(unf.unfurls), /RB-1/);
    const dup = await (await slackPost('/intake/slack/events', ev(`Ev1${tag}`, [`https://cuongthai.com/work/${wsSlug}/RB/issue/1`]), { ts: Math.floor(Date.now() / 1000) + 1 })).json() as any;
    assert.equal(dup.duplicate, true);
  });

  it('1d. thông báo dự án ⇒ Slack (sự kiện đã chọn)', async () => {
    const n = calls.filter((c) => c.url.endsWith('chat.postMessage')).length;
    const types = await prisma.workIssueType.findMany({ where: { projectId: pid, level: 0 } });
    await call(staff, 'POST', `/projects/${pid}/issues`, { title: 'Thẻ mới cho Slack', typeId: types[0].id });
    for (let i = 0; i < 30 && calls.filter((c) => c.url.endsWith('chat.postMessage')).length === n; i++) await new Promise((r) => setTimeout(r, 50));
    const last = calls.filter((c) => c.url.endsWith('chat.postMessage')).at(-1)!;
    assert.match(last.body, /Thẻ mới cho Slack/);
  });

  // ═══ 2. Builder ═════════════════════════════════════════════════

  let templateId = 0;
  it('2a. mẫu sẵn + lưu mẫu; VIEWER/khách/agent/người ngoài bị chặn', async () => {
    const l = await call(staff, 'GET', `/projects/${pid}/report-builder/templates`);
    assert.equal(l.status, 200, JSON.stringify(l.raw));
    assert.deepEqual(l.data.builtins.map((b: any) => b.key), ['weekly', 'sprint', 'lecturer', 'client']);
    assert.equal(l.data.canEdit, true);
    assert.equal((await call(client, 'GET', `/projects/${pid}/report-builder/templates`)).status, 403);
    assert.equal((await call(outsider, 'GET', `/projects/${pid}/report-builder/templates`)).status, 404);
    assert.equal((await call(bot, 'GET', `/projects/${pid}/report-builder/templates`)).status, 403);
    const layout = { title: 'Báo cáo của nhóm', period: 'week', blocks: [
      { id: 'h', type: 'heading', text: 'Tổng quan', level: 1 },
      { id: 'k', type: 'kpis', metrics: ['open', 'doneInPeriod', 'overdue'] },
      { id: 'c', type: 'chart', chart: 'createdResolved', days: 14 },
      { id: 'i', type: 'issues', jql: 'ORDER BY key ASC', columns: ['key', 'title', 'status'], limit: 10 },
      { id: 'bad', type: 'issues', jql: 'nonsense ===', columns: ['key'], limit: 5 },
      { id: 'a', type: 'ai', audience: 'teacher', text: null, refreshOnSend: true },
    ] };
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/report-builder/templates`, { name: 'X', layout })).status, 403);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/report-builder/templates`, { name: 'X', layout: { title: 'X', blocks: [{ id: 'z', type: 'script' }] } })).status, 400);
    const c = await call(staff, 'POST', `/projects/${pid}/report-builder/templates`, { name: 'Mẫu của nhóm', layout });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    templateId = c.data.id;
    const pv = await call(staff, 'POST', `/projects/${pid}/report-builder/preview`, { ref: String(templateId) });
    assert.equal(pv.status, 200, JSON.stringify(pv.raw));
    const kinds = pv.data.blocks.map((b: any) => b.type);
    assert.deepEqual(kinds, ['heading', 'kpis', 'chart', 'issues', 'error'], 'AI chưa có chữ ⇒ không in; JQL sai ⇒ khối lỗi, báo cáo vẫn ra');
    assert.equal(pv.data.blocks[1].items.find((k: any) => k.key === 'open').value, '5');
    assert.ok(pv.data.blocks[2].svg.startsWith('<svg') && !pv.data.blocks[2].svg.includes('<text'));
    assert.equal(pv.data.blocks[3].rows.length, 5);
    const ai = await call(staff, 'POST', `/projects/${pid}/report-builder/ai`, { audience: 'teacher' });
    assert.equal(ai.status, 200);
    assert.match(ai.data.text, /teacher/);
  });

  it('2b. xuất PDF + DOCX (mẫu sẵn cho giảng viên)', async () => {
    const pdf = await call(staff, 'POST', `/projects/${pid}/report-builder/export`, { ref: 'builtin:lecturer', format: 'pdf' });
    assert.equal(pdf.status, 200);
    assert.equal(pdf.ct, 'application/pdf');
    assert.equal(pdf.buf!.subarray(0, 5).toString(), '%PDF-');
    const docx = await call(staff, 'POST', `/projects/${pid}/report-builder/export`, { ref: 'builtin:weekly', format: 'docx' });
    assert.equal(docx.status, 200);
    assert.equal(docx.buf!.subarray(0, 2).toString(), 'PK');
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/report-builder/export`, { ref: 'builtin:weekly', format: 'pdf' })).status, 200, 'VIEWER của đội xem/xuất được');
  });

  // ═══ 3. Lịch tự gửi ═════════════════════════════════════════════

  let planId = 0;
  it('3a. người nhận ngoài ⇒ chờ OWNER/ADMIN duyệt; quyền', async () => {
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/report-plans`, { name: 'X', templateRef: 'builtin:weekly' })).status, 403);
    assert.equal((await call(bot, 'POST', `/projects/${pid}/report-plans`, { name: 'X', templateRef: 'builtin:weekly' })).status, 403);
    const c = await call(staff, 'POST', `/projects/${pid}/report-plans`, {
      name: 'Báo cáo thứ Sáu', templateRef: String(templateId), cadence: 'WEEKLY', weekday: 5, hour: 16, timezone: 'Asia/Ho_Chi_Minh',
      recipients: [staff.email, 'giangvien@fpt.edu.vn'], slackChannelIds: [(await prisma.workSlackChannel.findFirstOrThrow({ where: { projectId: pid } })).id],
    });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    planId = c.data.id;
    const st = Object.fromEntries(c.data.recipients.map((r: any) => [r.email, r.status]));
    assert.equal(st[staff.email], 'APPROVED', 'thành viên dự án');
    assert.equal(st['giangvien@fpt.edu.vn'], 'PENDING', 'ngoài hệ thống ⇒ chờ duyệt');
    assert.equal(c.data.pendingApprovals, 1);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/report-plans/${planId}/recipients/decide`, { email: 'giangvien@fpt.edu.vn', approve: true })).status, 403, 'MEMBER không duyệt');
  });

  it('3b. cron gửi ĐÚNG MỘT LẦN mỗi kỳ; người chờ duyệt không nhận; nhật ký + tải lại tệp', async () => {
    const { runDueReportPlans } = await import('../services/work/reportSchedule.service.js');
    const fri = new Date('2026-10-16T09:30:00Z'); // 16:30 thứ Sáu giờ VN
    mails.length = 0;
    const [a, b] = await Promise.all([runDueReportPlans(fri, { projectIds: [pid] }), runDueReportPlans(fri, { projectIds: [pid] })]);
    assert.equal(a + b, 1, 'hai lượt cron chồng nhau ⇒ một lần gửi');
    assert.equal(await runDueReportPlans(new Date('2026-10-16T15:00:00Z'), { projectIds: [pid] }), 0, 'cùng kỳ, giờ sau ⇒ không gửi lại');
    assert.equal(await runDueReportPlans(new Date('2026-10-15T09:30:00Z'), { projectIds: [pid] }), 0, 'sai thứ');
    assert.deepEqual(mails.map((m) => m.to), [staff.email], 'chỉ người đã duyệt');
    assert.equal(mails[0].attachments, 1);
    assert.ok(calls.some((c) => c.url.endsWith('files.completeUploadExternal')), 'đăng tệp lên Slack');
    const log = await call(staff, 'GET', `/projects/${pid}/report-plans/deliveries`);
    assert.equal(log.data.length, 1);
    assert.equal(log.data[0].status, 'SENT', JSON.stringify(log.data[0].detail));
    assert.equal(log.data[0].trigger, 'AUTO');
    assert.ok(log.data[0].periodKey.startsWith('W:2026-W42'));
    const file = await call(staff, 'GET', `/projects/${pid}/report-plans/deliveries/${log.data[0].id}/file`);
    assert.equal(file.status, 200);
    assert.equal(file.buf!.subarray(0, 5).toString(), '%PDF-');
    // Duyệt người ngoài ⇒ tuần sau nhận.
    const ok = await call(owner, 'POST', `/projects/${pid}/report-plans/${planId}/recipients/decide`, { email: 'giangvien@fpt.edu.vn', approve: true });
    assert.equal(ok.status, 200, JSON.stringify(ok.raw));
    mails.length = 0;
    assert.equal(await runDueReportPlans(new Date('2026-10-23T09:30:00Z'), { projectIds: [pid] }), 1);
    assert.deepEqual(mails.map((m) => m.to).sort(), ['giangvien@fpt.edu.vn', staff.email].sort());
    // Gửi tay không đụng khoá kỳ.
    const now = await call(staff, 'POST', `/projects/${pid}/report-plans/${planId}/send`);
    assert.equal(now.status, 200);
    assert.equal(now.data.status, 'SENT');
    assert.equal((await call(staff, 'GET', `/projects/${pid}/report-plans/deliveries`)).data.length, 3);
  });

  // ═══ 4. Notion ══════════════════════════════════════════════════

  it('4a. nhập trang Notion (+ trang con, ảnh về kho dự án) ⇒ Docs', async () => {
    assert.equal((await call(staff, 'GET', '/notion/status')).data.connected, false, 'kết nối là theo NGƯỜI');
    const st = await call(owner, 'GET', '/notion/status');
    assert.equal(st.data.configured, true);
    assert.equal(st.data.connected, true);
    const s = await call(owner, 'POST', '/notion/search', { query: 'Kế hoạch' });
    assert.equal(s.data[0].title, 'Kế hoạch dự án — Sprint 3');
    assert.equal((await call(staff, 'POST', `/projects/${pid}/notion/import-page`, { pageId: notionFixture.page.id })).status, 409, 'chưa kết nối Notion');
    const r = await call(owner, 'POST', `/projects/${pid}/notion/import-page`, { pageId: `https://www.notion.so/Ke-hoach-${notionFixture.page.id.replace(/-/g, '')}`, includeChildren: true });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    assert.equal(r.data.pages.length, 2, 'trang chính + trang con');
    const page = await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, number: r.data.page.number } });
    const content = JSON.stringify(page.contentJson);
    assert.match(content, /Mục tiêu/);
    assert.match(content, new RegExp(`/api/v1/work/projects/${pid}/images/\\d+`), 'ảnh Notion đã về kho dự án');
    assert.ok(!content.includes('X-Amz-Signature'));
    assert.match(content, /Biên bản họp 1 → DOC-\d+/);
    const child = await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, title: 'Biên bản họp 1' } });
    assert.equal(child.parentId, page.id);
    assert.equal((await call(bot, 'POST', `/projects/${pid}/notion/import-page`, { pageId: notionFixture.page.id })).status, 403);
  });

  it('4b. xuất trang Docs ⇒ Notion (ảnh tải lên Notion)', async () => {
    const page = await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, title: 'Kế hoạch dự án — Sprint 3' } });
    const r = await call(owner, 'POST', `/projects/${pid}/notion/export-page`, { pageNumber: page.number, parentPageId: '22222222-3333-4444-5555-666666666666' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    assert.equal(r.data.url, 'https://notion.so/new');
    const create = calls.filter((c) => c.url.endsWith('/v1/pages') && c.method === 'POST').at(-1)!;
    const body = JSON.parse(create.body);
    assert.equal(body.parent.page_id, '22222222-3333-4444-5555-666666666666');
    assert.ok(JSON.stringify(body.children).includes('"file_upload":{"id":"fu_1"}'));
  });

  it('4c. database Notion ⇒ thẻ: xem trước, ghép, nhập, nhập lại không trùng', async () => {
    const dbId = 'abcdefab-cdef-abcd-efab-cdefabcdefab';
    assert.equal((await call(staff, 'POST', `/projects/${pid}/notion/import-database`, { databaseId: dbId })).status, 403, 'nhập hàng loạt = ADMIN');
    const dry = await call(owner, 'POST', `/projects/${pid}/notion/import-database`, { databaseId: dbId });
    assert.equal(dry.status, 200, JSON.stringify(dry.raw));
    assert.equal(dry.data.dryRun, true);
    assert.equal(dry.data.database.title, 'Backlog Notion');
    assert.equal(dry.data.summary.toCreate, 2);
    assert.equal(dry.data.columns[0], 'Notion ID');
    const go = await call(owner, 'POST', `/projects/${pid}/notion/import-database`, { databaseId: dbId, dryRun: false });
    assert.equal(go.status, 201, JSON.stringify(go.raw));
    assert.equal(go.data.created, 2);
    const it1 = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, title: 'Thiết kế màn đăng nhập' } });
    assert.equal(it1.assigneeId, staff.id, 'khớp người theo email');
    assert.equal(it1.storyPoints, 3);
    const again = await call(owner, 'POST', `/projects/${pid}/notion/import-database`, { databaseId: dbId, dryRun: false });
    assert.equal(again.data.created, 0, 'không trùng theo externalId');
    assert.equal(again.data.duplicates, 2);
  });
});
