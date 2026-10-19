/**
 * ĐỢT 8A CuongMini — (1) nhóm CT Work có ADMIN WEB ⇒ không giới hạn tiền, (2) `/usage` khớp sổ.
 * HTTP thật + Postgres cục bộ + cổng LLM GIẢ (máy chủ http tại chỗ — không tốn tiền, không chạm cổng thật):
 *   WORK_DB_TEST=1 DATABASE_URL=… npx tsx --test src/routes/agent.taiTro.db.test.ts
 *
 *   • thành viên dự án có admin web ⇒ chạy Sonic 5.5 (chính hãng) dù trần riêng của họ đã cạn; sổ ghi người dùng + nhà
 *     tài trợ + dự án (`taitro:p<pid>:u<admin>:l`), lượt chính hãng `viec = agent_taitro`; ví 5 giờ + trần riêng không ăn;
 *   • không thành viên ⇒ không (403); agent CT Work ⇒ không;
 *   • vượt chống spam ⇒ 429; admin tắt dự án / tắt chung ⇒ về luật thường;
 *   • Default khi rambo không chạy ⇒ Solid (admin trả), không báo bảo trì;
 *   • `/usage` người thường: số trần model = sổ; admin: khoá (tên, ngân sách, đã dùng, còn %) = sổ, không lộ khoá.
 */
import assert from 'node:assert/strict';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `tt${Date.now().toString(36)}`;
const KHOA_THAT = `sk-ant-usr-test-${'q'.repeat(24)}`;

/* Cổng giả: chính hãng (/v1/messages, /v1/models/:id) + modelapi (/modelapi/v1/chat/completions). */
let gia: http.Server;
let gocGia = '';
const daGoi: Array<{ duong: string; model?: string }> = [];
function sse(res: http.ServerResponse, mau: unknown[]): void {
  res.writeHead(200, { 'content-type': 'text/event-stream' });
  for (const m of mau) res.write(`data: ${JSON.stringify(m)}\n\n`);
  res.end();
}

describe('CuongMini đợt 8A — admin web tài trợ + /usage (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: http.Server;
  type U = { id: number; token: string; email: string; username: string };
  let admin: U, lead: U, mem: U, memPro: U, out: U;
  let wsId = 0, pid = 0, agentUserId = 0;
  const userIds: number[] = [];
  let prisma: any;
  let jwt: any;
  let config: any;

  async function mkUser(name: string, o: { pro?: boolean; admin?: boolean } = {}): Promise<U> {
    const username = `${tag}_${name}`;
    const email = `${username}@test.local`;
    const u = await prisma.user.create({ data: { username, email, password: 'x', emailVerified: true, ...(o.pro ? { isPro: true, proExpiresAt: new Date(Date.now() + 30 * 86_400_000) } : {}) } });
    if (o.admin) {
      const role = await prisma.role.upsert({ where: { name: 'ROLE_ADMIN' }, update: {}, create: { name: 'ROLE_ADMIN' } });
      await prisma.userRole.create({ data: { userId: u.id, roleId: role.id } });
    }
    userIds.push(u.id);
    return { id: u.id, token: jwt.sign({ userId: u.id, username, email, roles: o.admin ? ['ROLE_ADMIN'] : [], roleVersion: 0 }, config.jwtSecret), email, username };
  }
  async function call(u: { token: string } | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    let json: any = {};
    try { json = JSON.parse(text); } catch { /* SSE */ }
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, message: json.message as string | undefined, raw: json, text };
  }
  /** Một lượt agent THẬT (SSE) — trả các khung. */
  async function luot(u: U, model: string, duAn: number | null, cau = 'chào') {
    const r = await call(u, 'POST', '/agent/turn', { model, ...(duAn ? { ctworkDuAn: duAn } : {}), messages: [{ role: 'user', content: cau }], capabilities: ['fs_read'] });
    const khung = r.text.split('\n').filter((d) => d.startsWith('data: ')).map((d) => JSON.parse(d.slice(6)));
    return { ...r, khung };
  }
  const cho = () => new Promise((r) => setTimeout(r, 250)); // ghiSo chạy `void` sau khi SSE đóng

  before(async () => {
    gia = http.createServer((req, res) => {
      let raw = '';
      req.on('data', (c) => { raw += c; });
      req.on('end', () => {
        const body = raw ? JSON.parse(raw) : null;
        daGoi.push({ duong: req.url ?? '', model: body?.model });
        if (req.url?.startsWith('/v1/models/')) {
          res.writeHead(200, { 'content-type': 'application/json' });
          res.end(JSON.stringify({ id: req.url.slice('/v1/models/'.length), max_input_tokens: 1_000_000, max_tokens: 128_000 }));
          return;
        }
        if (req.url === '/v1/messages') {
          sse(res, [
            { type: 'message_start', message: { usage: { input_tokens: 1000, output_tokens: 1 } } },
            { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } },
            { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: 'Xin chào từ Sonic.' } },
            { type: 'message_delta', delta: { stop_reason: 'end_turn' }, usage: { output_tokens: 20 } },
            { type: 'message_stop' },
          ]);
          return;
        }
        if (req.url?.startsWith('/modelapi/v1/chat/completions')) {
          sse(res, [
            { choices: [{ delta: { content: 'Trả lời từ Solid.' } }] },
            { choices: [{ delta: {}, finish_reason: 'stop' }], usage: { prompt_tokens: 500, completion_tokens: 5 } },
          ]);
          return;
        }
        res.writeHead(404).end();
      });
    });
    await new Promise<void>((r) => gia.listen(0, '127.0.0.1', () => r()));
    gocGia = `http://127.0.0.1:${(gia.address() as AddressInfo).port}`;
    Object.assign(process.env, {
      ANTHROPIC_CHINH_HANG_BASE_URL: gocGia,
      LLM_GATEWAY_BASE_URL: `${gocGia}/modelapi/v1`,
      LLM_GATEWAY_API_KEY: 'sk-modelapi-gia',
      LLM_GATEWAY_API_KEY_GPT: 'sk-modelapi-gia',
    });
    delete process.env.AGENT_GATEWAY_BASE_URL; // rambo không cấu hình ⇒ Default chạy Solid
    delete process.env.AGENT_GATEWAY_API_KEY;
    delete process.env.ANTHROPIC_CHINH_HANG_KEYS;

    ({ prisma } = await import('../config/database.js'));
    jwt = (await import('jsonwebtoken')).default;
    ({ config } = await import('../config/env.js'));
    const { emailService } = await import('../services/email.service.js');
    (emailService as any).send = async () => ({ success: true });
    const express = (await import('express')).default;
    const { errorHandler } = await import('../middleware/errorHandler.js');
    const { default: workRoutes } = await import('./work.routes.js');
    const { default: agentRoutes } = await import('./agent.routes.js');
    const app = express();
    app.use(express.json({ limit: '5mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use('/api/v1/agent', agentRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

    await prisma.anthropicUsage.deleteMany({});
    await prisma.anthropicKey.deleteMany({});
    await prisma.appSetting.deleteMany({ where: { key: { in: ['cuongmini_tai_tro_admin', 'cuongmini_default_gioi_han'] } } });
    const kho = await import('../services/agent/anthropicChinhHang/khoKey.js');
    kho.datLaiNapMoiTruong();
    const kid = await kho.themKey({ nhan: 'Key 1 (200 USD)', khoa: KHOA_THAT, thuTu: 0 } as any);
    await prisma.anthropicKey.update({ where: { id: kid }, data: { nganSachThangUsd: 200 } });
    kho.xoaNho();

    admin = await mkUser('admin', { admin: true });
    lead = await mkUser('lead');
    mem = await mkUser('mem');
    memPro = await mkUser('mempro', { pro: true });
    out = await mkUser('out');
    wsId = (await call(lead, 'POST', '/work/workspaces', { name: `TaiTro ${tag}` })).data.id;
    await call(lead, 'POST', `/work/workspaces/${wsId}/invites`, { emails: [mem.email, memPro.email, admin.email], role: 'MEMBER' });
    const p = await call(lead, 'POST', `/work/workspaces/${wsId}/projects`, { key: 'TT', name: 'Tài trợ', template: 'BLANK', kind: 'SCHOOL' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    /* Hạn mức nhóm đợt 6 TẮT ⇒ khi admin rút tài trợ, thành viên không Pro không còn đường nào (để thấy "về luật thường"). */
    await call(lead, 'PUT', `/work/projects/${pid}/cuongmini-team`, { bat: false });
    for (const u of [mem, memPro, admin]) assert.equal((await call(lead, 'PUT', `/work/projects/${pid}/members/${u.id}`, { role: 'MEMBER' })).status, 200);
    const a = await call(lead, 'POST', `/work/workspaces/${wsId}/agents`, { name: 'Bot tt', model: 'gpt-6-sol', projectIds: [pid] });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    agentUserId = a.data.agent.userId;
  });

  after(async () => {
    server?.close();
    gia?.close();
    if (!prisma) return;
    const ids = [...userIds, agentUserId].filter(Boolean);
    await prisma.interviewLLMCallLog.deleteMany({ where: { userId: { in: ids } } });
    await prisma.anthropicUsage.deleteMany({});
    await prisma.anthropicKey.deleteMany({});
    await prisma.appSetting.deleteMany({ where: { key: { in: ['cuongmini_tai_tro_admin', 'cuongmini_default_gioi_han'] } } });
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    if (ids.length) {
      await prisma.workAgent.deleteMany({ where: { OR: [{ userId: { in: ids } }, { ownerId: { in: ids } }] } });
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: ids } }, { senderId: { in: ids } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: ids } } });
      await prisma.userRole.deleteMany({ where: { userId: { in: ids } } });
      await prisma.user.deleteMany({ where: { id: { in: ids } } });
    }
    await prisma.$disconnect();
  });

  it('thành viên dự án có admin web ⇒ chạy Sonic 5.5 KHÔNG trần (kể cả trần riêng đã cạn); sổ đúng người + nhà tài trợ + dự án', async () => {
    const { _datLaiTaiTro } = await import('../services/agent/taiTroAdmin.js');
    _datLaiTaiTro();
    /* memPro đã tiêu quá trần Sonic riêng NGÀY (20 $) — dưới cầu dao tiền chung của site (40 $/ngày). */
    await prisma.interviewLLMCallLog.create({ data: { userId: memPro.id, feature: 'agent', step: 'interview', provider: 'gateway', model: 'claude-sonnet-5-5', inputTokens: 1, outputTokens: 1, costUsd: 25, success: true } });
    const rieng = await luot(memPro, 'cm-sonic', null);
    assert.ok(rieng.khung.some((e) => e.type === 'error'), 'không gắn dự án ⇒ trần riêng vẫn chặn');

    for (const u of [mem, memPro]) {
      const r = await luot(u, 'cm-sonic', pid);
      assert.equal(r.status, 200, r.text.slice(0, 300));
      const done = r.khung.find((e) => e.type === 'done');
      assert.ok(done, `${u.username}: ${JSON.stringify(r.khung.filter((e) => e.type === 'error'))}`);
      assert.match(JSON.stringify(done.append), /Xin chào từ Sonic/);
    }
    await cho();
    const so = await prisma.interviewLLMCallLog.findMany({ where: { userId: mem.id, feature: 'agent' } });
    assert.equal(so.length, 1);
    assert.equal(so[0].step, `taitro:p${pid}:u${admin.id}:l`, 'sổ: người dùng (user_id) + nhà tài trợ + dự án');
    assert.equal(so[0].model, 'claude-sonnet-5-5');
    assert.ok(Number(so[0].costUsd) > 0);
    const ch = await prisma.anthropicUsage.findMany({ where: { userId: mem.id } });
    assert.ok(ch.length >= 1 && ch.every((x: any) => x.viec === 'agent_taitro'), 'sổ chính hãng gắn viec agent_taitro');
    /* Ví + trần riêng của thành viên KHÔNG bị ăn. */
    const { xemViTien, xoaDemViTien } = await import('../services/agent/viTien.js');
    xoaDemViTien();
    assert.equal((await xemViTien(mem.id, 'code')).daTieu, 0, 'ví 5 giờ không tính lượt tài trợ');
    const { xemHanMucChinhHang } = await import('../services/agent/anthropicChinhHang/hanMuc.js');
    assert.equal((await xemHanMucChinhHang(mem.id, 'free')).daDungNgay, 0, 'trần chính hãng riêng không tính lượt tài trợ');
  });

  it('không phải thành viên ⇒ không; agent CT Work ⇒ không', async () => {
    const r = await luot(out, 'cm-sonic', pid);
    assert.equal(r.status, 403, r.text.slice(0, 300));
    assert.equal(r.code, 'PRO_REQUIRED');
    const { quyetDinhTaiTro } = await import('../services/agent/taiTroAdmin.js');
    assert.deepEqual(await quyetDinhTaiTro(agentUserId, pid), { loai: 'khong', ma: 'TAI_TRO_AGENT' });
    /* Model ngoài danh sách tài trợ (Nova) ⇒ không đi đường tài trợ ⇒ người không Pro bị 403. */
    const nova = await luot(mem, 'cm-nova', pid);
    assert.equal(nova.status, 403);
  });

  it('Default khi rambo không chạy ⇒ Solid do admin trả (không báo bảo trì)', async () => {
    const r = await luot(mem, 'cm-default', pid, 'câu hỏi Default');
    const done = r.khung.find((e) => e.type === 'done');
    assert.ok(done, JSON.stringify(r.khung.filter((e) => e.type === 'error')));
    assert.match(JSON.stringify(done.append), /Trả lời từ Solid/);
    assert.ok(!r.khung.some((e) => e.code === 'CUONGMINI_BAO_TRI'));
    await cho();
    const so = await prisma.interviewLLMCallLog.findFirst({ where: { userId: mem.id, model: 'gpt-6-sol' }, orderBy: { id: 'desc' } });
    assert.equal(so?.step, `taitro:p${pid}:u${admin.id}:l`);
  });

  it('vượt chống spam (câu/phút) ⇒ 429', async () => {
    const { _datLaiTaiTro } = await import('../services/agent/taiTroAdmin.js');
    const { datGioiHanDefault } = await import('../services/agent/defaultGioiHan.js');
    _datLaiTaiTro();
    await datGioiHanDefault({ phutNguoi: 2 });
    try {
      assert.equal((await luot(mem, 'cm-solid', pid, 'a')).status, 200);
      assert.equal((await luot(mem, 'cm-solid', pid, 'b')).status, 200);
      const r3 = await luot(mem, 'cm-solid', pid, 'c');
      assert.equal(r3.status, 429, r3.text.slice(0, 300));
      assert.equal(r3.code, 'DEFAULT_QUA_NHANH');
      assert.ok(r3.data?.thuLaiSauGiay > 0);
    } finally {
      await datGioiHanDefault({ phutNguoi: 10 });
      _datLaiTaiTro();
    }
  });

  it('admin tắt dự án / tắt chung ⇒ về luật thường; bật lại ⇒ được', async () => {
    assert.equal((await call(mem, 'PUT', '/agent/tai-tro-admin', { bat: false })).status, 403, 'chỉ admin web');
    const tat = await call(admin, 'PUT', '/agent/tai-tro-admin', { duAn: { id: pid, bat: false } });
    assert.equal(tat.status, 200, JSON.stringify(tat.raw));
    assert.deepEqual(tat.data.tatDuAn, [pid]);
    const r = await luot(mem, 'cm-sonic', pid);
    assert.equal(r.status, 403, 'không Pro, nhóm tắt ⇒ luật thường chặn');
    const xem = await call(mem, 'GET', `/agent/tai-tro-admin?projectId=${pid}`);
    assert.equal(xem.data.duAn.dangTaiTro, false);
    await call(admin, 'PUT', '/agent/tai-tro-admin', { duAn: { id: pid, bat: true } });
    assert.equal((await luot(mem, 'cm-solid', pid, 'lại')).status, 200);
    await call(admin, 'PUT', '/agent/tai-tro-admin', { bat: false });
    assert.equal((await luot(mem, 'cm-solid', pid, 'tắt chung')).status, 403);
    await call(admin, 'PUT', '/agent/tai-tro-admin', { bat: true });
    assert.equal((await luot(mem, 'cm-solid', pid, 'bật chung')).status, 200);
    const tools = await call(mem, 'GET', '/agent/tools?bang=cm2');
    assert.ok(tools.data.taiTro.some((t: any) => t.projectId === pid), 'tools báo dự án được tài trợ');
    assert.ok(tools.data.models.some((m: any) => m.id === 'cm-sonic'), 'thành viên không Pro thấy Sonic 5.5');
  });

  it('/usage người thường: số khớp sổ (trần model, ví, nhóm tài trợ, Default, gia hạn)', async () => {
    await cho();
    const u = await call(memPro, 'GET', '/agent/usage?model=cm-sonic');
    assert.equal(u.status, 200);
    const cm = u.data.cuongMini;
    const sonicSo = await prisma.interviewLLMCallLog.aggregate({ where: { userId: memPro.id, feature: 'agent', model: 'claude-sonnet-5-5', NOT: { step: { startsWith: 'taitro:' } } }, _sum: { costUsd: true } });
    assert.equal(cm.model.ten, 'CuongMini Sonic 5.5');
    assert.equal(cm.model.daDungThang, Math.round(Number(sonicSo._sum.costUsd) * 10_000) / 10_000, 'đã dùng tháng = sổ (trừ lượt tài trợ)');
    assert.equal(cm.model.tranThang, 100);
    assert.equal(cm.goi, 'pro');
    assert.ok(cm.vi && typeof cm.vi.tran === 'number');
    assert.equal(cm.default.tranPhut, 10);
    assert.equal(cm.giaHan.soLanKy, 0);
    assert.doesNotMatch(JSON.stringify(u.raw), /claude-|gpt-6|sk-ant/i, 'không lộ tên model thật / khoá');

    const t = await call(mem, 'GET', `/agent/usage?model=cm-sonic&ctworkDuAn=${pid}`);
    const tt = t.data.cuongMini;
    assert.equal(tt.nhom.loai, 'taiTro');
    assert.equal(tt.nhom.nhaTaiTro, admin.username);
    assert.equal(tt.model.khongGioiHan, true);
    const soTt = await prisma.interviewLLMCallLog.aggregate({ where: { userId: mem.id, step: { startsWith: `taitro:p${pid}:` } }, _sum: { costUsd: true } });
    assert.equal(tt.nhom.daDungThang, Math.round(Number(soTt._sum.costUsd) * 10_000) / 10_000);
    assert.equal(tt.taiTro.tranNgay, 300);
    assert.ok(!tt.admin, 'người thường không thấy khối admin');
  });

  it('/usage admin: khoá Anthropic (tên, ngân sách, đã dùng, còn %) + chi theo model = sổ; không lộ khoá', async () => {
    const u = await call(admin, 'GET', '/agent/usage');
    const ad = u.data.cuongMini.admin;
    assert.ok(ad, 'admin thấy khối admin');
    const k = ad.keys.find((x: any) => x.ten === 'Key 1 (200 USD)');
    assert.ok(k);
    const soKey = await prisma.anthropicUsage.aggregate({ _sum: { costUsd: true } });
    assert.equal(k.nganSachUsd, 200);
    assert.equal(k.daDungUsd, Math.round(Number(soKey._sum.costUsd) * 10_000) / 10_000, 'đã dùng = sổ anthropic_usage_logs');
    assert.equal(k.conPhanTram, Math.round(((200 - k.daDungUsd) / 200) * 1000) / 10);
    const sonic = ad.theoModel.find((x: any) => x.ten === 'CuongMini Sonic 5.5');
    const soSonicThang = await prisma.interviewLLMCallLog.aggregate({ where: { feature: 'agent', model: 'claude-sonnet-5-5' }, _sum: { costUsd: true } });
    assert.ok(Math.abs(sonic.thangUsd - Number(soSonicThang._sum.costUsd)) < 1e-3, `${sonic.thangUsd} vs ${soSonicThang._sum.costUsd}`);
    const soSolid = await prisma.interviewLLMCallLog.aggregate({ where: { feature: 'agent', model: 'gpt-6-sol' }, _sum: { costUsd: true } });
    assert.ok(Math.abs(ad.modelapi.thangUsd - Number(soSolid._sum.costUsd)) < 1e-3);
    assert.equal(typeof ad.rambo.buocHomNay, 'number');
    const raw = JSON.stringify(u.raw);
    assert.ok(!raw.includes(KHOA_THAT) && !raw.includes('qqqq'), 'không lộ khoá / đuôi khoá');
  });
});
