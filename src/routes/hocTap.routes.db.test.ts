/**
 * /hoc-tap trên DB thật (không gọi AI):
 *   HOC_TAP_DB_TEST=1 npx tsx --test src/routes/hocTap.routes.db.test.ts
 * Trọng tâm: luật "người học KHÔNG tự tích được".
 */
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { createToken } from '../services/work/apiTokens.service.js';

const RUN = process.env.HOC_TAP_DB_TEST === '1';
const tag = `ht${Date.now().toString(36)}`;

describe('/hoc-tap', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let userId = 0;
  let jwtTok = '';
  let ctw = '';
  let monId = 0;

  async function call(tok: string, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/hoc-tap${path}`, {
      method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok}` },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as { data?: any; error?: any };
    return { status: res.status, data: json.data };
  }

  before(async () => {
    const { default: routes } = await import('./hocTap.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/hoc-tap', routes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    const u = await prisma.user.create({ data: { username: tag, email: `${tag}@test.local` } });
    userId = u.id;
    jwtTok = jwt.sign({ userId: u.id, username: u.username, email: u.email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    ctw = (await createToken(u.id, { name: 'claude', scopes: ['read', 'write'] })).token;
    // Kỳ bắt đầu 3,5 tuần trước ⇒ đang tuần 4.
    const batDau = new Date(Date.now() - 24.5 * 86_400_000);
    batDau.setUTCHours(0, 0, 0, 0);
    await prisma.hocKy.create({ data: { userId, ten: 'Fall test', batDau, soTuan: 10, tuanThi: 8 } });
  });

  after(async () => {
    await prisma.user.deleteMany({ where: { id: userId } });
    server?.close();
    await prisma.$disconnect();
  });

  it('thêm môn, tổng quan có tỷ lệ trượt ~40% khi chưa làm gì', async () => {
    const r = await call(jwtTok, 'POST', '/mon', { maMon: 'fer202', trinhDo: 'chưa có nền web' });
    assert.equal(r.status, 200);
    monId = r.data.id;
    assert.equal(r.data.maMon, 'FER202');
    const tq = await call(jwtTok, 'GET', '/tong-quan');
    assert.equal(tq.data.tuan, 4);
    assert.ok(tq.data.mon[0].ruiRo.tyLe >= 30, `tỷ lệ ${tq.data.mon[0].ruiRo.tyLe}`);
    assert.equal(tq.data.ruiRoKy.mucDo === 'xanh', false);
  });

  it('JWT KHÔNG chấm được; nộp ⇒ CHO_CHAM; token Claude chấm ⇒ DAT', async () => {
    await call(jwtTok, 'POST', `/mon/${monId}/viec`, { viec: [{ tuan: 4, thu: 7, loai: 'BAI_TAP', tieuDe: 'mkdir 6 bước', thoiLuongPhut: 25 }] });
    const ct = await call(jwtTok, 'GET', `/mon/${monId}`);
    const viecId = ct.data.viec[0].id;
    assert.equal(ct.data.viec[0].nguon, 'NGUOI_HOC');

    const tuTich = await call(jwtTok, 'POST', `/viec/${viecId}/cham`, { dat: true, diem: 10, nhanXet: 'tự tích' });
    assert.equal(tuTich.status, 403);

    assert.equal((await call(jwtTok, 'POST', `/viec/${viecId}/nop`, {})).status, 400, 'nộp rỗng phải bị từ chối');
    const nop = await call(jwtTok, 'POST', `/viec/${viecId}/nop`, { noiDung: 'bước 2: File exists', khongChamAI: true });
    assert.equal(nop.status, 200);
    assert.equal((await call(jwtTok, 'GET', `/viec/${viecId}`)).data.trangThai, 'CHO_CHAM');

    const cham = await call(ctw, 'POST', `/viec/${viecId}/cham`, { dat: true, diem: 8.5, nhanXet: 'đúng', loiCanSua: [] });
    assert.equal(cham.status, 200);
    const sau = await call(jwtTok, 'GET', `/viec/${viecId}`);
    assert.equal(sau.data.trangThai, 'DAT');
    assert.equal(sau.data.nguoiCham, 'CLAUDE');
    assert.equal(sau.data.bangChung[0].diem, 8.5);
  });

  it('điểm < 5 thì không đạt dù người chấm nói đạt', async () => {
    await call(ctw, 'POST', `/mon/${monId}/viec`, { viec: [{ tuan: 4, loai: 'QUIZ', tieuDe: 'quiz ch1' }] });
    const v = (await call(jwtTok, 'GET', `/mon/${monId}`)).data.viec.find((x: any) => x.tieuDe === 'quiz ch1');
    assert.equal(v.nguon, 'CLAUDE');
    await call(ctw, 'POST', `/viec/${v.id}/cham`, { dat: true, diem: 3, nhanXet: 'sai nhiều' });
    assert.equal((await call(jwtTok, 'GET', `/viec/${v.id}`)).data.trangThai, 'CHUA_DAT');
  });

  it('việc do Claude giao: người học không tự sửa/xoá được (không dời hạn để né quá hạn)', async () => {
    const v = (await call(jwtTok, 'GET', `/mon/${monId}`)).data.viec.find((x: any) => x.tieuDe === 'quiz ch1');
    assert.equal((await call(jwtTok, 'PATCH', `/viec/${v.id}`, { tuan: 9 })).status, 403);
    assert.equal((await call(jwtTok, 'DELETE', `/viec/${v.id}`)).status, 403);
    assert.equal((await call(ctw, 'PATCH', `/viec/${v.id}`, { tuan: 9 })).status, 200);
  });

  // ─── 24/11/2026: việc cá nhân + hôm nay/tuần (CT Work → Học tập & Lịch) + lệnh MCP hoc_tap ───
  it('việc cá nhân: thêm/sửa/xong/bỏ xong/xoá; hôm nay + tuần gộp được; người khác không đụng được', async () => {
    const hn = new Date(Date.now() + 7 * 3_600_000).toISOString().slice(0, 10);
    const toi = await call(jwtTok, 'POST', '/ca-nhan', { tieuDe: 'Gọi về nhà', ngay: hn, thoiLuongPhut: 20 });
    assert.equal(toi.status, 200);
    assert.equal(toi.data.ngay, hn);
    assert.equal(toi.data.xong, false);
    const id = toi.data.id;
    assert.equal((await call(jwtTok, 'POST', '/ca-nhan', { ngay: hn })).status, 400, 'thiếu tên');
    assert.equal((await call(jwtTok, 'POST', '/ca-nhan', { tieuDe: 'x', ngay: '24/11' })).status, 400, 'ngày sai định dạng');

    const sua = await call(jwtTok, 'PATCH', `/ca-nhan/${id}`, { thoiLuongPhut: 25 });
    assert.equal(sua.data.tieuDe, 'Gọi về nhà');
    assert.equal(sua.data.thoiLuongPhut, 25);

    assert.equal((await call(jwtTok, 'POST', `/ca-nhan/${id}/xong`, { xong: true })).data.xong, true);
    const hom = await call(jwtTok, 'GET', '/hom-nay');
    assert.equal(hom.status, 200);
    assert.ok(hom.data.caNhan.some((v: any) => v.id === id && v.xong));
    assert.ok(Array.isArray(hom.data.hoc) && hom.data.hocKy?.tuan === 4);
    assert.equal((await call(jwtTok, 'POST', `/ca-nhan/${id}/xong`, { xong: false })).data.xong, false);

    const tuan = await call(jwtTok, 'GET', '/tuan');
    assert.equal(tuan.data.ngay.length, 7);
    assert.ok(tuan.data.ngay[0].caNhan.some((v: any) => v.id === id));

    const khac = await prisma.user.create({ data: { username: `${tag}_c`, email: `${tag}_c@test.local` } });
    const t = jwt.sign({ userId: khac.id, username: khac.username, email: khac.email, roles: [], roleVersion: 0 }, config.jwtSecret);
    try {
      assert.equal((await call(t, 'PATCH', `/ca-nhan/${id}`, { tieuDe: 'hack' })).status, 404);
      assert.equal((await call(t, 'POST', `/ca-nhan/${id}/xong`, {})).status, 404);
      assert.equal((await call(t, 'GET', '/ca-nhan')).data.length, 0);
    } finally {
      await prisma.user.delete({ where: { id: khac.id } });
    }
    assert.equal((await call(jwtTok, 'DELETE', `/ca-nhan/${id}`)).status, 200);
    assert.equal((await call(jwtTok, 'GET', `/ca-nhan?tu=${hn}&den=${hn}`)).data.length, 0);
  });

  it('việc cá nhân CÓ GIỜ là khối bận: bộ xếp lịch học né nó', async () => {
    const { xepLich } = await import('../services/hocTap/xepLich.js');
    // Việc học mới chưa có giờ ⇒ sau khi chặn kín 2 ngày tới bằng việc cá nhân, nó phải rơi ra ngoài các khối đó.
    const homNay0 = Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()) - 7 * 3_600_000;
    const khoi: Array<{ a: number; b: number }> = [];
    for (let i = 0; i < 2; i++) {
      const bd = new Date(homNay0 + i * 86_400_000 + 5 * 3_600_000); // 05:00 VN
      const r = await call(jwtTok, 'POST', '/ca-nhan', { tieuDe: `bận cả ngày ${i}`, gioBatDau: bd.toISOString(), thoiLuongPhut: 600 });
      assert.equal(r.status, 200);
      khoi.push({ a: bd.getTime(), b: bd.getTime() + 600 * 60_000 });
    }
    await call(jwtTok, 'POST', `/mon/${monId}/viec`, { viec: [{ tuan: 9, loai: 'BAI_TAP', tieuDe: 'việc né khối', thoiLuongPhut: 30 }] });
    await xepLich(userId);
    const v = (await call(jwtTok, 'GET', `/mon/${monId}`)).data.viec.find((x: any) => x.tieuDe === 'việc né khối');
    assert.ok(v.gioBatDau, 'đã xếp giờ');
    const a = Date.parse(v.gioBatDau), b = a + 30 * 60_000;
    for (const k of khoi) assert.ok(b <= k.a || a >= k.b, `việc học ${v.gioBatDau} chồng khối cá nhân`);
    await prisma.viecCaNhan.deleteMany({ where: { userId } });
  });

  it('MCP hoc_tap: today/week ra markdown; add/done việc cá nhân; KHÔNG tích được việc học; token chỉ đọc không ghi được', async () => {
    const { commandByName } = await import('../services/work/toolRegistry/index.js');
    const tool = commandByName('hoc_tap')!;
    const ctx = { userId, agent: null, scopes: ['read', 'write'], tokenId: 1, signal: new AbortController().signal } as any;
    const md = await tool.run(ctx, { action: 'today' });
    assert.match(String(md), /Tỷ lệ trượt cả kỳ/);
    assert.match(String(await tool.run(ctx, { action: 'week' })), /7 ngày tới/);
    const them = await tool.run(ctx, { action: 'add', title: 'Ôn kana', time: '21:00', minutes: 30 }) as any;
    assert.match(them.added, /^C\d+$/);
    assert.equal(them.time, '21:00');
    assert.equal((await tool.run(ctx, { action: 'done', id: them.added }) as any).done, true);
    const hoc = (await call(jwtTok, 'GET', `/mon/${monId}`)).data.viec[0];
    await assert.rejects(tool.run(ctx, { action: 'done', id: `H${hoc.id}` }), /submitting evidence/);
    await assert.rejects(tool.run({ ...ctx, scopes: ['read'] }, { action: 'add', title: 'x' }));
    await prisma.viecCaNhan.deleteMany({ where: { userId } });
  });

  it('không xem được môn của người khác', async () => {
    const khac = await prisma.user.create({ data: { username: `${tag}_b`, email: `${tag}_b@test.local` } });
    const t = jwt.sign({ userId: khac.id, username: khac.username, email: khac.email, roles: [], roleVersion: 0 }, config.jwtSecret);
    try {
      assert.equal((await call(t, 'GET', `/mon/${monId}`)).status, 404);
    } finally {
      await prisma.user.delete({ where: { id: khac.id } });
    }
  });
});
