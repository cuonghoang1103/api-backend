/**
 * MÃ GIA HẠN THEO $ (19/10/2026) — qua HTTP thật + Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test --test-concurrency=1 src/routes/agent.giaHanTien.db.test.ts
 *
 *   • chưa bật mã ⇒ 409; admin đặt mã (chỉ băm, không trả băm); chưa chạm trần ⇒ 409 GIA_HAN_CHUA_CHAM;
 *   • LẦN 1 trong kỳ ⇒ cộng NGAY một mức (= trần gốc) — trần model hiệu lực tăng đúng ngần ấy;
 *   • app CŨ: `/agent/compact` + lượt agent thật (`runAgentTurn`) ⇒ câu lỗi trỏ "cuongthai.com/cuongmini/gia-han" + thẻ mới;
 *   • LẦN 2 ⇒ 202 chờ duyệt (nhập lại ⇒ cùng yêu cầu), hộp thư admin có báo; admin DUYỆT ⇒ cộng; TỪ CHỐI ⇒ lý do; lặp lại vô hạn;
 *   • model trả phí chưa có vé ⇒ 403 GIA_HAN_CAN_KHOA;
 *   • HẠN MỨC NHÓM (mặc định 5/20): 429 kèm thẻ ⇒ lần 1 cộng ngay ⇒ lần 2 chờ; ADMIN không tài trợ KHÔNG duyệt được,
 *     NHÀ TÀI TRỢ duyệt được; bảng "ai dùng bao nhiêu" ghi tiền gia hạn; người ngoài nhóm ⇒ 403;
 *   • 5 lần sai ⇒ lần 6 (kể cả đúng) 429; admin ĐỔI MÃ ⇒ mã cũ chết; hai lần nhập CÙNG LÚC ⇒ đúng một lượt "lần 1".
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
const tag = `gh${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };
const MA = 'MA-DUNG-123456';
const MA_MOI = 'MA-MOI-789012';

describe('CuongMini — MÃ GIA HẠN THEO $ (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let admin: U, pro: U, lead: U, mem: U, pro2: U, out: U, sai: U, dong: U;
  let wsId = 0, pid = 0;
  const caiDatCu = new Map<string, string | null>();

  async function mkUser(name: string, o: { pro?: boolean; admin?: boolean } = {}): Promise<U> {
    const username = `${tag}_${name}`;
    const email = `${username}@test.local`;
    const u = await prisma.user.create({ data: { username, email, password: 'x', ...(o.pro ? { isPro: true, proExpiresAt: new Date(Date.now() + 30 * 86_400_000) } : {}) } });
    userIds.push(u.id);
    if (o.admin) {
      const role = await prisma.role.upsert({ where: { name: 'ROLE_ADMIN' }, update: {}, create: { name: 'ROLE_ADMIN' } });
      await prisma.userRole.create({ data: { userId: u.id, roleId: role.id } });
    }
    return { id: u.id, token: jwt.sign({ userId: u.id, username, email, roles: o.admin ? ['ADMIN'] : [], roleVersion: 0 }, config.jwtSecret), email, username };
  }
  async function call(u: { token: string } | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, message: json.message as string | undefined, raw: json };
  }
  const ghiSo = (userId: number, usd: number, o: { model?: string; step?: string } = {}) => prisma.interviewLLMCallLog.create({
    data: { userId, feature: 'agent', step: o.step ?? 'generation', provider: 'gateway', model: o.model ?? 'gpt-6-sol', inputTokens: 100, outputTokens: 10, costUsd: usd, success: true },
  });
  const nhap = (u: U, tran: string, ma = MA) => call(u, 'POST', '/agent/gia-han-tien', { ma, tran });
  const tranSolid = async (userId: number) => {
    const { xemTranModel } = await import('../services/agent/tranModel.js');
    const { timModel } = await import('../services/agent/bangModel.js');
    return xemTranModel(userId, timModel('cm-solid'));
  };

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    for (const k of ['cuongmini_tran_model', 'cuongmini_ma_gia_han_tien']) {
      caiDatCu.set(k, (await prisma.appSetting.findUnique({ where: { key: k } }))?.value ?? null);
    }
    const { default: workRoutes } = await import('./work.routes.js');
    const { default: agentRoutes } = await import('./agent.routes.js');
    const { default: adminRoutes } = await import('./congAnthropicAdmin.routes.js');
    const app = express();
    app.use(express.json({ limit: '5mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use('/api/v1/agent', agentRoutes);
    app.use('/api/v1/admin/cong-anthropic', adminRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    admin = await mkUser('admin', { admin: true });
    pro = await mkUser('pro', { pro: true });
    lead = await mkUser('lead', { pro: true });
    mem = await mkUser('mem');
    pro2 = await mkUser('pro2', { pro: true });
    out = await mkUser('out');
    sai = await mkUser('sai', { pro: true });
    dong = await mkUser('dong', { pro: true });
    /* Trần CuongMini Solid của Pro: 0,5 $/ngày (để chạm nhanh) · Optimum 0,1 $/ngày. */
    const { datTranModel } = await import('../services/agent/tranModel.js');
    await datTranModel({ 'cm-solid': { pro: { thang: 100, ngay: 0.5 } }, 'cm-optimum': { pro: { thang: 100, ngay: 0.1 } } });
    wsId = (await call(lead, 'POST', '/work/workspaces', { name: `GiaHan ${tag}` })).data.id;
    await call(lead, 'POST', `/work/workspaces/${wsId}/invites`, { emails: [mem.email, pro2.email], role: 'MEMBER' });
    const p = await call(lead, 'POST', `/work/workspaces/${wsId}/projects`, { key: 'GH', name: 'Gia hạn nhóm', template: 'BLANK', kind: 'SCHOOL' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    assert.equal((await call(lead, 'PUT', `/work/projects/${pid}/members/${mem.id}`, { role: 'MEMBER' })).status, 200);
    assert.equal((await call(lead, 'PUT', `/work/projects/${pid}/members/${pro2.id}`, { role: 'ADMIN' })).status, 200);
  });

  after(async () => {
    server?.close();
    const ids = [...userIds];
    await prisma.agentGiaHanTien.deleteMany({ where: { userId: { in: ids } } });
    await prisma.interviewLLMCallLog.deleteMany({ where: { userId: { in: ids } } });
    await prisma.adminNotification.deleteMany({ where: { userId: { in: ids } } });
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: ids } }, { senderId: { in: ids } }] } });
    await prisma.workEmailQueue.deleteMany({ where: { userId: { in: ids } } });
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    for (const [key, value] of caiDatCu) {
      if (value === null) await prisma.appSetting.deleteMany({ where: { key } });
      else await prisma.appSetting.update({ where: { key }, data: { value } });
    }
    await prisma.$disconnect();
  });

  it('chưa bật mã ⇒ 409; admin đặt mã (ngắn ⇒ 400; chỉ băm, không trả băm); người thường không vào được trang admin', async () => {
    await ghiSo(pro.id, 0.6);
    const chuaBat = await nhap(pro, 'model:cm-solid');
    assert.equal(chuaBat.status, 409, JSON.stringify(chuaBat.raw));
    assert.equal(chuaBat.code, 'GIA_HAN_CHUA_BAT');
    assert.equal((await call(pro, 'PUT', '/admin/cong-anthropic/ma-gia-han', { ma: MA })).status, 403, 'người thường không đặt được mã');
    assert.equal((await call(admin, 'PUT', '/admin/cong-anthropic/ma-gia-han', { ma: 'abc' })).status, 400);
    const dat = await call(admin, 'PUT', '/admin/cong-anthropic/ma-gia-han', { ma: MA });
    assert.equal(dat.status, 200, JSON.stringify(dat.raw));
    assert.equal(dat.data.daBat, true);
    const ds = await call(admin, 'GET', '/admin/cong-anthropic/gia-han-tien');
    assert.equal(ds.status, 200);
    assert.equal(ds.data.ma.daBat, true);
    assert.ok(!JSON.stringify(ds.raw).includes(MA) && !JSON.stringify(ds.raw).includes('$2'), 'không lộ mã / băm');
    const row = await prisma.appSetting.findUnique({ where: { key: 'cuongmini_ma_gia_han_tien' } });
    assert.ok(row && !(row.value ?? '').includes(MA), 'chỉ lưu băm');
  });

  it('LẦN 1 trong kỳ ⇒ cộng NGAY một mức = trần gốc; chưa chạm ⇒ 409', async () => {
    const chuaCham = await nhap(out, 'model:cm-solid');
    assert.ok([400, 409].includes(chuaCham.status), JSON.stringify(chuaCham.raw));
    assert.equal(chuaCham.code, 'GIA_HAN_KHONG_AP_DUNG', 'tài khoản thường (trần 0) không bao giờ gia hạn ra tiền');
    const tq = await call(pro, 'GET', '/agent/gia-han-tien');
    assert.equal(tq.status, 200);
    const t = tq.data.tranCham.find((x: any) => x.tran === 'model:cm-solid');
    assert.ok(t, JSON.stringify(tq.data));
    assert.equal(t.ky, 'ngay');
    assert.equal(t.mucUsd, 0.5);
    assert.equal(t.canDuyet, false);
    assert.equal((await tranSolid(pro.id)).het, true);
    const kq = await nhap(pro, 'model:cm-solid');
    assert.equal(kq.status, 200, JSON.stringify(kq.raw));
    assert.equal(kq.data.ketQua, 'daCap');
    assert.equal(kq.data.soUsd, 0.5);
    const h = await tranSolid(pro.id);
    assert.equal(h.tranNgay, 1, 'trần hiệu lực = 0,5 gốc + 0,5 cấp');
    assert.equal(h.giaHanNgay, 0.5);
    assert.equal(h.het, false);
    const lai = await nhap(pro, 'model:cm-solid');
    assert.equal(lai.code, 'GIA_HAN_CHUA_CHAM', 'đã đủ trần ⇒ không cấp tiếp');
  });

  it('app CŨ nhận câu chữ trỏ trang web + app mới nhận thẻ: /agent/compact và lượt agent thật', async () => {
    await ghiSo(pro.id, 0.5); // 1,1 ≥ 1,0
    const c = await call(pro, 'POST', '/agent/compact', { messages: [{ role: 'user', content: 'x' }], model: 'cm-solid' });
    assert.equal(c.status, 429, JSON.stringify(c.raw));
    assert.equal(c.code, 'CUONGMINI_HET_TRAN');
    assert.match(c.message ?? '', /cuongthai\.com\/cuongmini\/gia-han/);
    assert.match(c.message ?? '', /admin duyệt/);
    assert.equal(c.data?.giaHanTien?.tran, 'model:cm-solid');
    assert.equal(c.data?.giaHanTien?.canDuyet, true);
    assert.equal(c.data?.giaHanTien?.lanThu, 2);

    /* Lượt agent THẬT (SSE nội bộ): chặn trước khi gọi cổng — cổng giả chỉ để chắc chắn không có mạng thật. */
    const { runAgentTurn } = await import('../services/agent/turn.js');
    const luu = ['LLM_GATEWAY_API_KEY', 'LLM_GATEWAY_API_KEY_GPT', 'LLM_GATEWAY_BASE_URL', 'AGENT_GATEWAY_BASE_URL', 'AGENT_GATEWAY_API_KEY'].map((k) => [k, process.env[k]] as const);
    process.env.LLM_GATEWAY_API_KEY = 'sk-gia-lap'; process.env.LLM_GATEWAY_API_KEY_GPT = 'sk-gia-lap'; process.env.LLM_GATEWAY_BASE_URL = 'https://vi-du.test/v1';
    delete process.env.AGENT_GATEWAY_BASE_URL; delete process.env.AGENT_GATEWAY_API_KEY;
    const goc = globalThis.fetch;
    let goiCong = 0;
    globalThis.fetch = (async () => { goiCong++; throw new Error('không được gọi cổng'); }) as typeof fetch;
    const sk: any[] = [];
    try {
      await runAgentTurn({ userId: pro.id, messages: [{ role: 'user', content: 'hi' }], capabilities: ['fs_read'], model: 'cm-solid' } as any, (e) => sk.push(e), new AbortController().signal);
    } finally {
      globalThis.fetch = goc;
      for (const [k, v] of luu) { if (v === undefined) delete process.env[k]; else process.env[k] = v; }
    }
    const loi = sk.find((e) => e.type === 'error');
    assert.ok(loi, JSON.stringify(sk));
    assert.equal(loi.code, 'CUONGMINI_HET_TRAN');
    assert.match(loi.error, /cuongthai\.com\/cuongmini\/gia-han/, 'app cũ (không hiểu thẻ) vẫn có đường đi');
    assert.equal(loi.giaHanTien?.tran, 'model:cm-solid');
    assert.equal(loi.giaHanTien?.mucUsd, 0.5);
    assert.equal(goiCong, 0, 'chạm trần ⇒ không gọi cổng');
  });

  let idCho = 0;
  it('LẦN 2 ⇒ chờ duyệt (nhập lại = cùng yêu cầu), báo admin; admin DUYỆT ⇒ cộng thêm một mức', async () => {
    const kq = await nhap(pro, 'model:cm-solid');
    assert.equal(kq.status, 202, JSON.stringify(kq.raw));
    assert.equal(kq.data.ketQua, 'choDuyet');
    assert.equal(kq.data.lanThu, 2);
    idCho = kq.data.id;
    const lai = await nhap(pro, 'model:cm-solid');
    assert.equal(lai.status, 202);
    assert.equal(lai.data.id, idCho, 'không tạo yêu cầu thứ hai khi đang chờ');
    assert.equal(lai.data.moi, false);
    assert.equal((await tranSolid(pro.id)).het, true, 'chưa duyệt ⇒ chưa cộng');
    const xem = await call(pro, 'GET', `/agent/gia-han-tien/yeu-cau/${idCho}`);
    assert.equal(xem.data.trangThai, 'CHO_DUYET');
    assert.equal((await call(out, 'GET', `/agent/gia-han-tien/yeu-cau/${idCho}`)).status, 404, 'không xem được yêu cầu của người khác');
    /* Hộp thư admin (hệ thông báo sẵn có). */
    await new Promise((r) => setTimeout(r, 200));
    const tb = await prisma.adminNotification.findFirst({ where: { khoaChongTrung: `GIA_HAN_TIEN:${idCho}` } });
    assert.ok(tb, 'admin phải được báo');
    assert.match(tb!.tieuDe, /gia hạn/);
    const ds = await call(admin, 'GET', '/admin/cong-anthropic/gia-han-tien');
    const y = ds.data.choDuyet.find((x: any) => x.id === idCho);
    assert.ok(y, JSON.stringify(ds.data));
    assert.equal(y.username, pro.username);
    assert.equal(y.soLanDaCapKy, 1, 'đã gia hạn mấy lần trong kỳ');
    assert.ok(Math.abs(y.daDungUsd - 1.1) < 0.001);
    assert.match(y.tenTran, /CuongMini Solid/);
    assert.equal((await call(pro, 'POST', `/admin/cong-anthropic/gia-han-tien/${idCho}`, { dongY: true })).status, 403, 'người thường không duyệt được');
    const duyet = await call(admin, 'POST', `/admin/cong-anthropic/gia-han-tien/${idCho}`, { dongY: true });
    assert.equal(duyet.status, 200, JSON.stringify(duyet.raw));
    assert.equal(duyet.data.yeuCau.trangThai, 'DA_CAP');
    assert.equal((await call(pro, 'GET', `/agent/gia-han-tien/yeu-cau/${idCho}`)).data.trangThai, 'DA_CAP', 'app tự kiểm lại thấy đã duyệt');
    const h = await tranSolid(pro.id);
    assert.equal(h.tranNgay, 1.5);
    assert.equal(h.het, false);
    assert.equal((await call(admin, 'POST', `/admin/cong-anthropic/gia-han-tien/${idCho}`, { dongY: true })).code, 'GIA_HAN_DA_XU_LY');
  });

  it('TỪ CHỐI ⇒ báo rõ lý do; lặp lại vô hạn, lần nào cũng chờ duyệt', async () => {
    await ghiSo(pro.id, 0.5); // 1,6 ≥ 1,5
    const kq = await nhap(pro, 'model:cm-solid');
    assert.equal(kq.status, 202, JSON.stringify(kq.raw));
    assert.equal(kq.data.lanThu, 3);
    const tc = await call(admin, 'POST', `/admin/cong-anthropic/gia-han-tien/${kq.data.id}`, { dongY: false, lyDo: 'Hôm nay dùng nhiều quá' });
    assert.equal(tc.status, 200);
    const xem = await call(pro, 'GET', `/agent/gia-han-tien/yeu-cau/${kq.data.id}`);
    assert.equal(xem.data.trangThai, 'TU_CHOI');
    assert.equal(xem.data.lyDoTuChoi, 'Hôm nay dùng nhiều quá');
    assert.equal((await tranSolid(pro.id)).het, true);
    const lan4 = await nhap(pro, 'model:cm-solid');
    assert.equal(lan4.status, 202, 'từ chối rồi vẫn xin lại được — vẫn chờ duyệt');
    assert.equal(lan4.data.lanThu, 4);
    assert.notEqual(lan4.data.id, kq.data.id);
  });

  it('model trả phí chưa có vé khoá ⇒ 403 GIA_HAN_CAN_KHOA (khoá ≠ gia hạn tiền)', async () => {
    await ghiSo(pro.id, 0.2, { model: 'claude-opus-5-5' });
    const kq = await nhap(pro, 'model:cm-optimum');
    assert.equal(kq.status, 403, JSON.stringify(kq.raw));
    assert.equal(kq.code, 'GIA_HAN_CAN_KHOA');
  });

  it('HẠN MỨC NHÓM: mặc định 5/20; 429 kèm thẻ ⇒ lần 1 ngay ⇒ lần 2 chờ; chỉ NHÀ TÀI TRỢ duyệt; bảng ghi tiền gia hạn', async () => {
    const step = `nhom:p${pid}:u${lead.id}`;
    const bang0 = await call(lead, 'GET', `/work/projects/${pid}/cuongmini-team`);
    assert.equal(bang0.data.cauHinh.tranNgayNguoiUsd, 5, 'mặc định 5 $/người/ngày');
    assert.equal(bang0.data.cauHinh.tranThangNhomUsd, 20, 'mặc định 20 $/nhóm/tháng');
    await ghiSo(mem.id, 5.2, { step });
    const het = await call(mem, 'POST', '/agent/dat-ten', { ctworkDuAn: pid });
    assert.equal(het.status, 429, JSON.stringify(het.raw));
    assert.equal(het.code, 'NHOM_HET_TRAN');
    assert.match(het.message ?? '', /cuongthai\.com\/cuongmini\/gia-han/);
    assert.equal(het.data?.giaHanTien?.tran, `nhom:${pid}`);
    assert.equal(het.data?.giaHanTien?.mucUsd, 5);
    assert.equal((await nhap(out, `nhom:${pid}`)).status, 403, 'người ngoài nhóm không gia hạn được');
    const lan1 = await nhap(mem, `nhom:${pid}`);
    assert.equal(lan1.status, 200, JSON.stringify(lan1.raw));
    assert.equal(lan1.data.ketQua, 'daCap');
    assert.equal((await call(mem, 'POST', '/agent/dat-ten', { ctworkDuAn: pid })).status, 400, 'đã qua cửa (thiếu cauHoi)');
    await ghiSo(mem.id, 5, { step }); // 10,2 ≥ 10
    const lan2 = await nhap(mem, `nhom:${pid}`);
    assert.equal(lan2.status, 202, JSON.stringify(lan2.raw));
    await new Promise((r) => setTimeout(r, 200));
    const chuong = await prisma.socialNotification.findFirst({ where: { receiverId: lead.id, senderId: mem.id, type: 'WORK_ALERT' } });
    assert.ok(chuong, 'nhà tài trợ được báo trên chuông CT Work');
    const bangMem = await call(mem, 'GET', `/work/projects/${pid}/cuongmini-team`);
    assert.deepEqual(bangMem.data.choDuyet, [], 'thành viên thường không thấy yêu cầu của người khác');
    const bangPro2 = await call(pro2, 'GET', `/work/projects/${pid}/cuongmini-team`);
    assert.equal(bangPro2.data.choDuyet.length, 1);
    assert.equal(bangPro2.data.duyetDuoc, false, 'ADMIN không phải nhà tài trợ');
    const pro2Duyet = await call(pro2, 'POST', `/work/projects/${pid}/cuongmini-team/gia-han/${lan2.data.id}`, { dongY: true });
    assert.equal(pro2Duyet.status, 403, JSON.stringify(pro2Duyet.raw));
    assert.equal(pro2Duyet.code, 'GIA_HAN_KHONG_QUYEN_DUYET');
    assert.equal((await call(mem, 'POST', `/work/projects/${pid}/cuongmini-team/gia-han/${lan2.data.id}`, { dongY: true })).status, 403, 'thành viên không tự duyệt được');
    const bangLead = await call(lead, 'GET', `/work/projects/${pid}/cuongmini-team`);
    assert.equal(bangLead.data.duyetDuoc, true);
    assert.equal(bangLead.data.choDuyet[0].id, lan2.data.id);
    const duyet = await call(lead, 'POST', `/work/projects/${pid}/cuongmini-team/gia-han/${lan2.data.id}`, { dongY: true });
    assert.equal(duyet.status, 200, JSON.stringify(duyet.raw));
    assert.deepEqual(duyet.data.choDuyet, []);
    const dong = duyet.data.nguoi.find((n: any) => n.userId === mem.id);
    assert.equal(dong.giaHan, 10, 'tiền gia hạn ghi rõ trong bảng ai dùng bao nhiêu');
    assert.equal(dong.soLanGiaHan, 2);
    assert.equal((await call(mem, 'POST', '/agent/dat-ten', { ctworkDuAn: pid })).status, 400, 'được duyệt ⇒ dùng tiếp');
    /* Admin web cũng duyệt được yêu cầu hạn mức nhóm. */
    await ghiSo(mem.id, 5, { step }); // 15,2 ≥ 15 (người/ngày) — nhóm tháng 15,2 < 20
    const lan3 = await nhap(mem, `nhom:${pid}`);
    assert.equal(lan3.status, 202, JSON.stringify(lan3.raw));
    assert.equal((await call(admin, 'POST', `/admin/cong-anthropic/gia-han-tien/${lan3.data.id}`, { dongY: true })).status, 200);
    /* Trần THÁNG của nhóm chạm ⇒ mã không gỡ được (tiền của nhà tài trợ). */
    await ghiSo(mem.id, 5, { step }); // 20,2 ≥ 20
    const thang = await call(mem, 'POST', '/agent/dat-ten', { ctworkDuAn: pid });
    assert.equal(thang.status, 429);
    assert.equal(thang.data?.giaHanTien, undefined, 'trần tháng của nhóm không có thẻ gia hạn');
    assert.equal((await nhap(mem, `nhom:${pid}`)).code, 'GIA_HAN_KHONG_AP_DUNG');
  });

  it('5 lần sai ⇒ lần 6 (kể cả đúng) bị chặn 429; admin ĐỔI MÃ ⇒ mã cũ chết, mã mới chạy', async () => {
    const { xoaDemSaiGiaHan } = await import('../services/agent/maGiaHanTien.js');
    xoaDemSaiGiaHan();
    await ghiSo(sai.id, 0.6);
    for (let i = 1; i <= 5; i++) {
      const r = await nhap(sai, 'model:cm-solid', `doan-bua-${i}`);
      assert.equal(r.status, 403, JSON.stringify(r.raw));
      assert.equal(r.code, 'GIA_HAN_MA_SAI');
      assert.match(r.message ?? '', new RegExp(`Còn ${5 - i} lần`));
    }
    const khoa = await nhap(sai, 'model:cm-solid', MA);
    assert.equal(khoa.status, 429, JSON.stringify(khoa.raw));
    assert.equal(khoa.code, 'GIA_HAN_THU_QUA_NHIEU');
    xoaDemSaiGiaHan();
    assert.equal((await call(admin, 'PUT', '/admin/cong-anthropic/ma-gia-han', { ma: MA_MOI })).status, 200);
    const cu = await nhap(sai, 'model:cm-solid', MA);
    assert.equal(cu.status, 403, 'mã cũ hết hiệu lực ngay');
    assert.equal(cu.code, 'GIA_HAN_MA_SAI');
    const moi = await nhap(sai, 'model:cm-solid', MA_MOI);
    assert.equal(moi.status, 200, JSON.stringify(moi.raw));
    assert.equal(moi.data.ketQua, 'daCap');
  });

  it('hai lần nhập CÙNG LÚC ⇒ đúng một lượt "lần 1" (khoá tư vấn), lượt kia chờ duyệt', async () => {
    await ghiSo(dong.id, 0.6);
    const [a, b] = await Promise.all([nhap(dong, 'model:cm-solid', MA_MOI), nhap(dong, 'model:cm-solid', MA_MOI)]);
    const kq = [a.data?.ketQua, b.data?.ketQua].sort();
    assert.deepEqual(kq, ['choDuyet', 'daCap'], JSON.stringify([a.raw, b.raw]));
    assert.equal(await prisma.agentGiaHanTien.count({ where: { userId: dong.id, trangThai: 'DA_CAP' } }), 1);
  });
});
