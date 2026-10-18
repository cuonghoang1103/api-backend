/**
 * QA ĐỢT 7 (19/10/2026) — mã gia hạn theo $: tấn công + các trần còn thiếu, qua HTTP thật + Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test --test-concurrency=1 src/routes/agent.qa70.db.test.ts
 *
 *   • tài khoản KHÔNG chạm trần nào không dò được mã (trước đây: 5 lần/15 phút mỗi tài khoản, nhân số tài khoản);
 *   • nhập HAI lần cùng lúc ⇒ đúng một lượt cấp, KHÔNG có yêu cầu "chờ duyệt" thừa + báo admin thừa;
 *   • duyệt khi kỳ đã qua ⇒ 409 GIA_HAN_HET_KY, không cấp; app kiểm lại thấy HET_KY;
 *   • nhà tài trợ dự án A không duyệt được yêu cầu của dự án B (sửa pid trên URL) ⇒ 404;
 *   • gia hạn trần CHƯA chạm ⇒ 409; trần lạ / pid bậy ⇒ 400; "nhom:007" không thành khoá tư vấn khác "nhom:7";
 *   • VÍ AI Code (cửa sổ trượt) và nhóm FREE cổng chính hãng: lần 1 cộng ngay đúng một mức, trần nới đúng;
 *   • mã KHÔNG nằm trong bất kỳ phản hồi / dòng log nào.
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
import { logger } from '../utils/logger.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `q7${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };
const MA = 'MA-QA70-gia-lap-123456';

describe('QA đợt 7 — mã gia hạn theo $ (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let admin: U, free: U, pro: U, dup: U, vi: U, ch: U, leadA: U, leadB: U, memB: U;
  const wsIds: number[] = [];
  let pidA = 0, pidB = 0;
  const caiDatCu = new Map<string, string | null>();
  const nhatKy: string[] = [];
  const goc: Record<string, unknown> = {};
  const envCu = { w: process.env.AI_COST_WINDOW_USD };

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
    const text = await res.text();
    let json: any = {};
    try { json = JSON.parse(text); } catch { /* */ }
    assert.ok(!text.includes(MA), `mã không bao giờ nằm trong phản hồi (${method} ${path})`);
    return { status: res.status, data: json.data, code: json.code as string | undefined, message: json.message as string | undefined, raw: json };
  }
  const ghiSo = (userId: number, usd: number, o: { model?: string; step?: string } = {}) => prisma.interviewLLMCallLog.create({
    data: { userId, feature: 'agent', step: o.step ?? 'generation', provider: 'gateway', model: o.model ?? 'gpt-6-sol', inputTokens: 100, outputTokens: 10, costUsd: usd, success: true },
  });
  const nhap = (u: U, tran: string, ma = MA) => call(u, 'POST', '/agent/gia-han-tien', { ma, tran });

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    /* Bắt MỌI dòng log để chứng minh mã không bao giờ bị ghi. */
    for (const k of ['info', 'warn', 'error', 'debug'] as const) {
      goc[k] = (logger as any)[k];
      (logger as any)[k] = (...a: unknown[]) => { nhatKy.push(JSON.stringify(a)); };
    }
    for (const k of ['cuongmini_tran_model', 'cuongmini_ma_gia_han_tien', 'anthropic_chinh_hang_tran_goi']) {
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
    free = await mkUser('free');
    pro = await mkUser('pro', { pro: true });
    dup = await mkUser('dup', { pro: true });
    vi = await mkUser('vi', { pro: true });
    ch = await mkUser('ch', { pro: true });
    leadA = await mkUser('leadA', { pro: true });
    leadB = await mkUser('leadB', { pro: true });
    memB = await mkUser('memB');
    const { datTranModel } = await import('../services/agent/tranModel.js');
    await datTranModel({ 'cm-solid': { pro: { thang: 100, ngay: 0.5 } } });
    assert.equal((await call(admin, 'PUT', '/admin/cong-anthropic/ma-gia-han', { ma: MA })).status, 200);
    /* Hai dự án, hai nhà tài trợ (người tạo dự án = nhà tài trợ đã đồng ý). */
    for (const [lead, key] of [[leadA, 'QA'], [leadB, 'QB']] as const) {
      const ws = (await call(lead, 'POST', '/work/workspaces', { name: `QA70 ${key} ${tag}` })).data.id;
      wsIds.push(ws);
      if (lead === leadB) await call(lead, 'POST', `/work/workspaces/${ws}/invites`, { emails: [memB.email], role: 'MEMBER' });
      const p = await call(lead, 'POST', `/work/workspaces/${ws}/projects`, { key, name: `QA70 ${key}`, template: 'BLANK', kind: 'SCHOOL' });
      assert.equal(p.status, 201, JSON.stringify(p.raw));
      if (lead === leadA) pidA = p.data.id; else pidB = p.data.id;
    }
    assert.equal((await call(leadB, 'PUT', `/work/projects/${pidB}/members/${memB.id}`, { role: 'MEMBER' })).status, 200);
  });

  after(async () => {
    server?.close();
    for (const k of Object.keys(goc)) (logger as any)[k] = goc[k];
    if (envCu.w === undefined) delete process.env.AI_COST_WINDOW_USD; else process.env.AI_COST_WINDOW_USD = envCu.w;
    const ids = [...userIds];
    await prisma.agentGiaHanTien.deleteMany({ where: { userId: { in: ids } } });
    await prisma.interviewLLMCallLog.deleteMany({ where: { userId: { in: ids } } });
    await prisma.anthropicUsage.deleteMany({ where: { userId: { in: ids } } });
    await prisma.adminNotification.deleteMany({ where: { userId: { in: ids } } });
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: ids } }, { senderId: { in: ids } }] } });
    await prisma.workEmailQueue.deleteMany({ where: { userId: { in: ids } } });
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    for (const [key, value] of caiDatCu) {
      if (value === null) await prisma.appSetting.deleteMany({ where: { key } });
      else await prisma.appSetting.update({ where: { key }, data: { value } });
    }
    await prisma.$disconnect();
  });

  it('tài khoản không chạm trần nào KHÔNG dò được mã: 8 lần sai đều GIA_HAN_KHONG_AP_DUNG, không đếm "Còn n lần"', async () => {
    const { xoaDemSaiGiaHan } = await import('../services/agent/maGiaHanTien.js');
    xoaDemSaiGiaHan();
    for (let i = 0; i < 8; i++) {
      const r = await nhap(free, 'model:cm-solid', `doan-${i}`);
      assert.notEqual(r.code, 'GIA_HAN_MA_SAI', `lần ${i + 1}: máy chủ KHÔNG được so mã cho người không có gì để gia hạn`);
      assert.equal(r.code, 'GIA_HAN_KHONG_AP_DUNG', JSON.stringify(r.raw));
    }
    /* Pro CHƯA chạm trần cũng vậy: 409 "chưa chạm", không lộ đúng/sai. */
    const a = await nhap(pro, 'model:cm-solid', 'doan-sai');
    const b = await nhap(pro, 'model:cm-solid', MA);
    assert.equal(a.code, 'GIA_HAN_CHUA_CHAM');
    assert.equal(b.code, 'GIA_HAN_CHUA_CHAM', 'mã đúng hay sai trả cùng một câu khi chưa chạm');
    assert.equal(await prisma.agentGiaHanTien.count({ where: { userId: { in: [free.id, pro.id] } } }), 0);
  });

  it('trần lạ / pid bậy ⇒ 400; dự án mình không ở ⇒ 403; "nhom:007" vẫn là dự án 7 (một khoá)', async () => {
    assert.equal((await nhap(pro, 'model:khong-co')).code, 'GIA_HAN_TRAN_LA');
    assert.equal((await nhap(pro, 'nhom:-1')).code, 'GIA_HAN_TRAN_LA');
    assert.equal((await nhap(pro, 'tien-tu-do')).code, 'GIA_HAN_TRAN_LA');
    assert.equal((await nhap(pro, 'x'.repeat(200))).code, 'GIA_HAN_TRAN_LA');
    assert.equal((await nhap(memB, `nhom:${pidA}`)).status, 403, 'không phải thành viên dự án A');
    const { xacDinhTran } = await import('../services/agent/maGiaHanTien.js');
    await ghiSo(memB.id, 5.1, { step: `nhom:p${pidB}:u${leadB.id}` });
    const tc = await xacDinhTran(memB.id, `nhom:00${pidB}`);
    assert.equal(tc.tran, `nhom:${pidB}`, 'trần chuẩn hoá ⇒ khoá tư vấn chung một mã');
  });

  it('nhập HAI lần cùng lúc ⇒ một lượt cấp; lượt sau thấy trần đã nới ⇒ 409, KHÔNG có yêu cầu chờ thừa, KHÔNG báo admin', async () => {
    await ghiSo(dup.id, 0.6);
    const [a, b] = await Promise.all([nhap(dup, 'model:cm-solid'), nhap(dup, 'model:cm-solid')]);
    const kq = [a.data?.ketQua ?? a.code, b.data?.ketQua ?? b.code].sort();
    assert.deepEqual(kq, ['GIA_HAN_CHUA_CHAM', 'daCap'], JSON.stringify([a.raw, b.raw]));
    assert.equal(await prisma.agentGiaHanTien.count({ where: { userId: dup.id } }), 1);
    await new Promise((r) => setTimeout(r, 200));
    assert.equal(await prisma.adminNotification.count({ where: { userId: dup.id } }), 0, 'không báo admin oan');
  });

  it('duyệt khi KỲ ĐÃ QUA ⇒ 409 HET_KY, không cấp; app kiểm lại thấy HET_KY; từ chối thì vẫn được', async () => {
    await ghiSo(pro.id, 0.6);
    assert.equal((await nhap(pro, 'model:cm-solid')).data.ketQua, 'daCap');
    await ghiSo(pro.id, 0.5);
    const lan2 = await nhap(pro, 'model:cm-solid');
    assert.equal(lan2.status, 202, JSON.stringify(lan2.raw));
    /* Lùi yêu cầu về hôm qua (giờ VN) — như admin mở bảng duyệt sáng hôm sau. */
    await prisma.agentGiaHanTien.update({ where: { id: lan2.data.id }, data: { createdAt: new Date(Date.now() - 36 * 3_600_000) } });
    const duyet = await call(admin, 'POST', `/admin/cong-anthropic/gia-han-tien/${lan2.data.id}`, { dongY: true });
    assert.equal(duyet.status, 409, JSON.stringify(duyet.raw));
    assert.equal(duyet.code, 'GIA_HAN_HET_KY');
    const xem = await call(pro, 'GET', `/agent/gia-han-tien/yeu-cau/${lan2.data.id}`);
    assert.equal(xem.data.trangThai, 'HET_KY');
    const { tienGiaHanTheoKy } = await import('../services/agent/giaHanTienSo.js');
    assert.equal((await tienGiaHanTheoKy(pro.id, 'model:cm-solid')).ngay, 0.5, 'chỉ lượt 1 còn tính — yêu cầu quá kỳ không thành quà');
    assert.equal((await call(admin, 'POST', `/admin/cong-anthropic/gia-han-tien/${lan2.data.id}`, { dongY: false })).code, 'GIA_HAN_DA_XU_LY');
  });

  it('nhà tài trợ dự án A KHÔNG duyệt được yêu cầu của dự án B qua URL dự án A (sửa pid) ⇒ 404; ADMIN web duyệt được', async () => {
    await ghiSo(memB.id, 5.0, { step: `nhom:p${pidB}:u${leadB.id}` }); // 10,1 ≥ 5 (đã có 5,1 ở trên)
    const lan1 = await nhap(memB, `nhom:${pidB}`);
    assert.equal(lan1.data?.ketQua, 'daCap', JSON.stringify(lan1.raw));
    const lan2 = await nhap(memB, `nhom:${pidB}`);
    assert.equal(lan2.status, 202, JSON.stringify(lan2.raw));
    const sai = await call(leadA, 'POST', `/work/projects/${pidA}/cuongmini-team/gia-han/${lan2.data.id}`, { dongY: true });
    assert.equal(sai.status, 404, JSON.stringify(sai.raw));
    const ngoai = await call(leadA, 'POST', `/work/projects/${pidB}/cuongmini-team/gia-han/${lan2.data.id}`, { dongY: true });
    assert.equal(ngoai.status, 404, 'không phải thành viên dự án B (CT Work giấu dự án người ngoài)');
    assert.equal((await call(memB, 'POST', `/admin/cong-anthropic/gia-han-tien/${lan2.data.id}`, { dongY: true })).status, 403);
    assert.equal((await call(leadB, 'POST', `/work/projects/${pidB}/cuongmini-team/gia-han/${lan2.data.id}`, { dongY: false, lyDo: 'để mai' })).status, 200);
    assert.equal((await call(memB, 'GET', `/agent/gia-han-tien/yeu-cau/${lan2.data.id}`)).data.lyDoTuChoi, 'để mai');
  });

  it('VÍ AI Code (cửa sổ trượt 5 giờ): chạm ⇒ lần 1 cộng ngay đúng một mức; trần ví nới đúng', async () => {
    process.env.AI_COST_WINDOW_USD = '0.05';
    const { xemViTien, xoaDemViTien } = await import('../services/agent/viTien.js');
    await ghiSo(vi.id, 0.06);
    xoaDemViTien();
    const truoc = await xemViTien(vi.id, 'code');
    assert.equal(truoc.canVi, true, JSON.stringify(truoc));
    const tq = await call(vi, 'GET', '/agent/gia-han-tien');
    const t = tq.data.tranCham.find((x: any) => x.tran === 'vi');
    assert.ok(t, JSON.stringify(tq.data));
    assert.equal(t.ky, 'cuaSo');
    assert.equal(t.mucUsd, 0.05);
    const kq = await nhap(vi, 'vi');
    assert.equal(kq.data?.ketQua, 'daCap', JSON.stringify(kq.raw));
    xoaDemViTien();
    const sau = await xemViTien(vi.id, 'code');
    assert.equal(sau.tran, 0.1);
    assert.equal(sau.canVi, false);
    await ghiSo(vi.id, 0.05);
    xoaDemViTien();
    assert.equal((await nhap(vi, 'vi')).status, 202, 'lần 2 trong cửa sổ ⇒ chờ duyệt');
  });

  it('nhóm FREE cổng chính hãng: chạm trần ngày ⇒ lần 1 cộng ngay; hạng CAO không nới bằng mã', async () => {
    const { datTranGoi, xemHanMucChinhHang } = await import('../services/agent/anthropicChinhHang/hanMuc.js');
    await datTranGoi({ pro: { free: { thang: 100, ngay: 0.05 } } });
    await prisma.anthropicUsage.create({ data: { userId: ch.id, viec: 'agent_code', hang: 'free', model: 'claude-sonnet-5-5', costUsd: 0.06 } });
    assert.equal((await xemHanMucChinhHang(ch.id, 'free')).het, true);
    const kq = await nhap(ch, 'chinhHang:free');
    assert.equal(kq.data?.ketQua, 'daCap', JSON.stringify(kq.raw));
    assert.equal(kq.data.soUsd, 0.05);
    const h = await xemHanMucChinhHang(ch.id, 'free');
    assert.equal(h.tranNgay, 0.1);
    assert.equal(h.het, false);
    assert.equal((await nhap(ch, 'chinhHang:cao')).code, 'GIA_HAN_TRAN_LA', 'hạng cao không có đường gia hạn bằng mã');
  });

  it('mã KHÔNG nằm trong bất kỳ dòng log nào (đã bắt mọi logger.* của cả bộ)', () => {
    assert.ok(nhatKy.length > 0, 'có log để soi');
    assert.ok(!nhatKy.some((l) => l.includes(MA)), 'mã lọt vào log');
  });
});
