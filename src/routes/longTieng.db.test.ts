/**
 * CT Lồng Tiếng (18/11/2026) — qua HTTP thật trên Postgres cục bộ đã migrate. Không có CSDL ⇒ TỰ BỎ QUA.
 * R2 = kho giả trong RAM (sandbox tự bật khi chạy test — không chạm bucket thật). Dịch: hàm giả (KHÔNG gọi cổng LLM).
 *   DATABASE_URL=postgresql://…/<csdl test> npx tsx --test src/routes/longTieng.db.test.ts
 *
 * Phủ: tạo việc bằng link · tạo việc tải tệp + báo đã tải lên · trạm giành/tiến độ/đẩy kết quả/xong/lỗi · việc mất nhịp
 * tim về hàng · xoá việc dọn sạch tệp R2 · đã-tải-về xoá tệp kết quả · chỉ ADMIN · mã kết nối ctlt_ (tạo/dùng/thu hồi,
 * không tự tạo mã khác, chủ mất vai ADMIN ⇒ mã chết) · cửa nội bộ 404 khi sai/thiếu khoá · dịch hỏi lại câu thiếu.
 */
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { closeRedis } from '../config/redis.js';
import { listObjects, putObject } from '../config/r2.js';
import { errorHandler } from '../middleware/errorHandler.js';
import * as lt from '../services/longTieng.service.js';
import * as ltd from '../services/longTiengDich.js';

async function coCsdl(): Promise<boolean> {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  try {
    if (!['localhost', '127.0.0.1', '::1', 'postgres'].includes(new URL(url).hostname)) return false;
    await Promise.race([
      prisma.$queryRaw`SELECT 1 FROM "long_tieng_viec" LIMIT 1`,
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000)),
    ]);
    return true;
  } catch {
    return false;
  }
}

const RUN = await coCsdl();
const tag = `lt${Date.now().toString(36)}`;
const KHOA_NOI_BO = `noibo-${tag}-0123456789`;
const userIds: number[] = [];
type U = { id: number; token: string };

describe('CT Lồng Tiếng (HTTP + DB thật)', { skip: !RUN ? 'không có CSDL cục bộ đã migrate' : false }, () => {
  let base = '';
  let server: import('node:http').Server;
  let admin: U;
  let thuong: U;
  const tokenCu = process.env.INTERNAL_API_TOKEN;

  async function mkUser(name: string, isAdmin: boolean): Promise<U> {
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email: `${tag}_${name}@example.invalid` } });
    userIds.push(u.id);
    if (isAdmin) {
      const role = await prisma.role.upsert({ where: { name: 'ROLE_ADMIN' }, create: { name: 'ROLE_ADMIN' }, update: {} });
      await prisma.userRole.create({ data: { userId: u.id, roleId: role.id } });
    }
    const token = jwt.sign({ userId: u.id, username: u.username, email: u.email, roles: isAdmin ? ['ADMIN'] : [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token };
  }

  async function goi(auth: string | null, method: string, p: string, body?: unknown, headers: Record<string, string> = {}) {
    const res = await fetch(`${base}/api/v1${p}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(auth ? { Authorization: `Bearer ${auth}` } : {}), ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: json.code as string | undefined, raw: json };
  }
  const web = (u: U | string | null, method: string, p: string, body?: unknown) =>
    goi(typeof u === 'string' ? u : u?.token ?? null, method, `/long-tieng${p}`, body);
  const tram = (method: string, p: string, body?: unknown, khoa = KHOA_NOI_BO) =>
    goi(null, method, `/internal/long-tieng${p}`, body, khoa ? { 'x-internal-token': khoa } : {});
  const khoaTrong = async (userId: number, id: string) => (await listObjects(lt.thuMucViec(userId, id))).map((o) => o.key).sort();

  /** Trạm nhận việc cho tới khi gặp đúng việc mong muốn (CSDL test có thể còn việc của lượt khác). */
  async function nhanDung(id: string) {
    for (let i = 0; i < 20; i++) {
      const r = await tram('POST', '/nhan');
      if (r.status === 204) break;
      assert.equal(r.status, 200);
      if (r.data.job.id === id) return r.data;
    }
    throw new Error(`trạm không nhận được việc ${id}`);
  }

  before(async () => {
    process.env.INTERNAL_API_TOKEN = KHOA_NOI_BO;
    const mod = await import('./longTieng.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/internal/long-tieng', mod.noiBoRouter);
    app.use('/api/v1/long-tieng', mod.default);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    admin = await mkUser('admin', true);
    thuong = await mkUser('thuong', false);
    // Việc `cho` sót lại từ lượt test trước (nếu có) không được chen hàng.
    await prisma.longTiengViec.updateMany({ where: { trangThai: 'cho', user: { username: { not: { startsWith: tag } } } }, data: { trangThai: 'loi', loi: 'test dọn' } });
  });

  after(async () => {
    server?.close();
    if (tokenCu === undefined) delete process.env.INTERNAL_API_TOKEN; else process.env.INTERNAL_API_TOKEN = tokenCu;
    lt._chiDeKiemThu.datGoiDich(null);
    ltd._datCongDichChoTest(null);
    await prisma.user.deleteMany({ where: { id: { in: userIds } } }).catch(() => {});
    await prisma.$disconnect().catch(() => {});
    await closeRedis().catch(() => {});
  });

  it('chỉ ADMIN: không đăng nhập 401, người thường 403', async () => {
    assert.equal((await web(null, 'GET', '/jobs')).status, 401);
    assert.equal((await web(thuong, 'GET', '/jobs')).status, 403);
    assert.equal((await web(thuong, 'POST', '/jobs', { url: 'https://example.com/v' })).status, 403);
    assert.equal((await web(admin, 'GET', '/jobs')).status, 200);
  });

  it('cửa trạm: thiếu/sai khoá ⇒ 404; chưa cấu hình INTERNAL_API_TOKEN ⇒ 404', async () => {
    assert.equal((await tram('POST', '/nhan', {}, '')).status, 404);
    assert.equal((await tram('POST', '/nhan', {}, 'sai-khoa')).status, 404);
    delete process.env.INTERNAL_API_TOKEN;
    assert.equal((await tram('POST', '/nhan')).status, 404);
    process.env.INTERNAL_API_TOKEN = KHOA_NOI_BO;
  });

  it('kiểm đầu vào tạo việc', async () => {
    assert.equal((await web(admin, 'POST', '/jobs', {})).status, 400);
    assert.equal((await web(admin, 'POST', '/jobs', { url: 'ftp://x' })).status, 400);
    assert.equal((await web(admin, 'POST', '/jobs', { url: 'https://x.y/v', goc: 0.9 })).status, 400);
    assert.equal((await web(admin, 'POST', '/jobs', { url: 'https://x.y/v', nhip: 'bay' })).status, 400);
    assert.equal((await web(admin, 'POST', '/jobs', { url: 'https://x.y/v', tep: { ten: 'a.mp4', kichThuoc: 1, kieu: 'video/mp4' } })).status, 400);
    assert.equal((await web(admin, 'POST', '/jobs', { tep: { ten: 'a.mp4', kichThuoc: 6 * 1024 ** 3, kieu: 'video/mp4' } })).status, 400);
  });

  it('bản xuất ra (banRa): mặc định ca-hai; vi / vi-goc lưu trên việc + trạm nhận được; sai ⇒ 400', async () => {
    const sai = await web(admin, 'POST', '/jobs', { url: 'https://x.y/b0', banRa: 'ca-ba' });
    assert.equal(sai.status, 400);
    assert.equal(sai.code, 'LT_BAN_RA');

    const mac = (await web(admin, 'POST', '/jobs', { url: 'https://x.y/b1' })).data.job;
    assert.equal(mac.banRa, 'ca-hai', 'không gửi ⇒ cả hai (đúng hành vi cũ)');
    await web(admin, 'DELETE', `/jobs/${mac.id}`);

    const chiVi = (await web(admin, 'POST', '/jobs', { url: 'https://x.y/b2', banRa: 'vi' })).data.job;
    assert.equal(chiVi.banRa, 'vi');
    assert.equal((await web(admin, 'GET', `/jobs/${chiVi.id}`)).data.banRa, 'vi');
    const n = await nhanDung(chiVi.id);
    assert.equal(n.job.banRa, 'vi', 'trạm biết chỉ dựng bản giọng Việt');
    await web(admin, 'DELETE', `/jobs/${chiVi.id}`);

    const songNgu = (await web(admin, 'POST', '/jobs', { url: 'https://x.y/b3', banRa: 'vi-goc', goc: 0.25 })).data.job;
    assert.equal(songNgu.banRa, 'vi-goc');
    assert.equal(songNgu.goc, 0.25);
    await web(admin, 'DELETE', `/jobs/${songNgu.id}`);
  });

  it('việc bằng link: tạo ⇒ trạm giành ⇒ tiến độ ⇒ đẩy kết quả ⇒ xong ⇒ tải về (URL ký) ⇒ đã tải về xoá tệp', async () => {
    const t = await web(admin, 'POST', '/jobs', { url: 'https://www.bilibili.com/video/BV1xx', lang: 'zh', goc: 0.2 });
    assert.equal(t.status, 201);
    const id = t.data.job.id as string;
    assert.match(id, /^[0-9a-f-]{36}$/);
    assert.equal(t.data.job.trangThai, 'cho');
    assert.equal(t.data.job.nhip, 'cho-giong', 'mặc định chờ giọng (không đọc nhanh)');
    assert.equal(t.data.taiLen, undefined);

    const n = await nhanDung(id);
    assert.equal(n.job.url, 'https://www.bilibili.com/video/BV1xx');
    assert.equal(n.job.lang, 'zh');
    assert.equal(n.vao, undefined, 'việc link không có tệp vào');
    assert.equal((await web(admin, 'GET', `/jobs/${id}`)).data.trangThai, 'tai');

    assert.equal((await tram('POST', `/${id}/tien-do`, { trangThai: 'lam', buoc: 'Nghe & chép lời gốc', phanTram: 35, tenVideo: 'Bo mạch chủ' })).status, 200);
    const g = (await web(admin, 'GET', `/jobs/${id}`)).data;
    assert.equal(g.trangThai, 'lam');
    assert.equal(g.phanTram, 35);
    assert.equal(g.tenVideo, 'Bo mạch chủ');

    const tep = [
      { loai: 'vi', ten: 'Bo mạch chủ [VI].mp4', kichThuoc: 10, kieu: 'video/mp4' },
      { loai: 'srt-vi', ten: 'Bo mạch chủ.vi.srt', kichThuoc: 5 },
      { loai: 'thong-tin', ten: 'thong-tin.json', kichThuoc: 2 },
    ];
    assert.equal((await tram('POST', `/${id}/len-ket-qua`, { tep: [...tep, tep[0]] })).status, 400, 'loại trùng');
    const len = await tram('POST', `/${id}/len-ket-qua`, { tep });
    assert.equal(len.status, 200);
    assert.equal(len.data.tep.length, 3);
    assert.ok(len.data.tep.every((x: any) => x.url.includes('X-Amz-Signature=')));
    assert.equal(len.data.tep.find((x: any) => x.loai === 'srt-vi').kieu, 'application/x-subrip', 'kiểu mặc định theo loại');

    // Báo xong khi chưa PUT ⇒ 400.
    assert.equal((await tram('POST', `/${id}/xong`, { thoiLuong: 780, ketQua: tep })).status, 400);
    for (const x of tep) await putObject(lt.khoaKetQua(admin.id, id, x.loai as lt.LoaiKetQua, x.ten), Buffer.from(`noi-dung-${x.loai}`), 'application/octet-stream');
    const xg = await tram('POST', `/${id}/xong`, { thoiLuong: 780.5, ketQua: tep });
    assert.equal(xg.status, 200);
    assert.equal(xg.data.trangThai, 'xong');

    const d = (await web(admin, 'GET', `/jobs/${id}`)).data;
    assert.equal(d.trangThai, 'xong');
    assert.equal(d.phanTram, 100);
    assert.equal(d.thoiLuong, 780.5);
    assert.ok(d.xong);
    const vi = d.ketQua.find((k: any) => k.loai === 'vi');
    assert.equal(vi.ten, 'Bo mạch chủ [VI].mp4');
    assert.equal(vi.kichThuoc, 'noi-dung-vi'.length, 'kích thước lấy từ kho, không tin số trạm khai');
    assert.ok(vi.url.includes('X-Amz-Signature='));
    assert.ok(decodeURIComponent(vi.url).includes("filename*=UTF-8''"), 'tên tiếng Việt giữ nguyên khi tải');

    // Trạm gọi tiếp trên việc đã xong ⇒ 410.
    assert.equal((await tram('POST', `/${id}/tien-do`, { trangThai: 'lam', phanTram: 50 })).status, 410);

    assert.equal((await khoaTrong(admin.id, id)).length, 3);
    const tv = await web(admin, 'POST', `/jobs/${id}/da-tai-ve`);
    assert.equal(tv.status, 200);
    assert.ok(tv.data.daTaiVe);
    assert.ok(tv.data.ketQua.every((k: any) => k.url === null));
    assert.deepEqual(await khoaTrong(admin.id, id), [], 'đã tải về ⇒ xoá sạch tệp kết quả');
  });

  it('việc tải tệp: chờ tải lên ⇒ báo đã tải (kiểm kho) ⇒ trạm nhận kèm URL vào ⇒ xong thì xoá tệp vào', async () => {
    const t = await web(admin, 'POST', '/jobs', { tep: { ten: 'Bài giảng 1.mp4', kichThuoc: 4, kieu: 'video/mp4' }, lang: 'auto', nhip: 'tang-toc' });
    assert.equal(t.status, 201);
    const id = t.data.job.id as string;
    assert.equal(t.data.job.trangThai, 'cho_tai_len');
    assert.equal(t.data.job.tenVideo, 'Bài giảng 1');
    assert.ok(t.data.taiLen.url.includes('X-Amz-Signature='));
    assert.equal(t.data.taiLen.kieu, 'video/mp4');
    assert.ok(Date.parse(t.data.taiLen.het) > Date.now());

    const chua = await web(admin, 'POST', `/jobs/${id}/da-tai-len`);
    assert.equal(chua.status, 409, 'chưa có tệp trên kho');
    await putObject(`${lt.thuMucViec(admin.id, id)}vao/goc.mp4`, Buffer.from('abcdefgh'), 'video/mp4');
    const da = await web(admin, 'POST', `/jobs/${id}/da-tai-len`);
    assert.equal(da.status, 200);
    assert.equal(da.data.trangThai, 'cho');
    assert.equal(da.data.tep.kichThuoc, 8, 'cập nhật kích thước thật');
    assert.equal((await web(admin, 'POST', `/jobs/${id}/da-tai-len`)).status, 409, 'báo lần hai ⇒ 409');

    const n = await nhanDung(id);
    assert.equal(n.job.nhip, 'tang-toc');
    assert.ok(n.vao.url.includes('X-Amz-Signature='));

    const tep = [{ loai: 'vi-goc', ten: 'Bài giảng 1 [VI + giọng gốc 15%].mp4', kichThuoc: 1, kieu: 'video/mp4' }];
    await putObject(lt.khoaKetQua(admin.id, id, 'vi-goc', tep[0]!.ten), Buffer.from('x'), 'video/mp4');
    assert.equal((await tram('POST', `/${id}/xong`, { thoiLuong: 10, ketQua: tep })).status, 200);
    assert.deepEqual(await khoaTrong(admin.id, id), [lt.khoaKetQua(admin.id, id, 'vi-goc', tep[0]!.ten)], 'tệp vào đã xoá, chỉ còn kết quả');
  });

  it('lỗi ⇒ thử lại về hàng; việc mất nhịp tim > 20 phút về hàng; giành quá nhiều lần ⇒ lỗi', async () => {
    const id = (await web(admin, 'POST', '/jobs', { url: 'https://x.y/loi' })).data.job.id as string;
    await nhanDung(id);
    assert.equal((await web(admin, 'POST', `/jobs/${id}/thu-lai`)).status, 409, 'đang chạy thì không thử lại');
    assert.equal((await tram('POST', `/${id}/loi`, { loi: 'yt-dlp: HTTP 403' })).status, 200);
    let g = (await web(admin, 'GET', `/jobs/${id}`)).data;
    assert.equal(g.trangThai, 'loi');
    assert.equal(g.loi, 'yt-dlp: HTTP 403');
    const tl = await web(admin, 'POST', `/jobs/${id}/thu-lai`);
    assert.equal(tl.status, 200);
    assert.equal(tl.data.trangThai, 'cho');
    assert.equal(tl.data.loi, null);

    await nhanDung(id);
    await prisma.longTiengViec.update({ where: { id }, data: { nhipTim: new Date(Date.now() - 21 * 60_000) } });
    assert.ok((await lt.xepLaiViecMatNhip()) >= 1);
    g = (await web(admin, 'GET', `/jobs/${id}`)).data;
    assert.equal(g.trangThai, 'cho');
    assert.equal((await tram('POST', `/${id}/tien-do`, { trangThai: 'lam', phanTram: 9 })).status, 410, 'trạm cũ mất việc ⇒ 410');

    await prisma.longTiengViec.update({ where: { id }, data: { trangThai: 'lam', soLanNhan: lt.TRAN_LAN_NHAN, nhipTim: new Date(Date.now() - 21 * 60_000) } });
    await lt.xepLaiViecMatNhip();
    g = (await web(admin, 'GET', `/jobs/${id}`)).data;
    assert.equal(g.trangThai, 'loi');
    assert.match(g.loi, /mất liên lạc/);
  });

  it('xoá việc: việc chờ ⇒ xoá hẳn + dọn tệp; việc đang chạy ⇒ huỷ, trạm nhận 410, tệp dọn sạch', async () => {
    const a = (await web(admin, 'POST', '/jobs', { tep: { ten: 'x.mkv', kichThuoc: 3, kieu: 'video/x-matroska' } })).data.job.id as string;
    await putObject(`${lt.thuMucViec(admin.id, a)}vao/goc.mkv`, Buffer.from('abc'), 'video/x-matroska');
    assert.equal((await khoaTrong(admin.id, a)).length, 1);
    const x = await web(admin, 'DELETE', `/jobs/${a}`);
    assert.equal(x.status, 200);
    assert.deepEqual(x.data, { xoa: true, huy: false, soTep: 1 });
    assert.deepEqual(await khoaTrong(admin.id, a), []);
    assert.equal((await web(admin, 'GET', `/jobs/${a}`)).status, 404);

    const b = (await web(admin, 'POST', '/jobs', { url: 'https://x.y/huy' })).data.job.id as string;
    await nhanDung(b);
    await putObject(lt.khoaKetQua(admin.id, b, 'vi', 'B [VI].mp4'), Buffer.from('dở'), 'video/mp4');
    const y = await web(admin, 'DELETE', `/jobs/${b}`);
    assert.deepEqual(y.data, { xoa: false, huy: true, soTep: 1 });
    assert.equal((await web(admin, 'GET', `/jobs/${b}`)).data.trangThai, 'huy');
    assert.equal((await tram('POST', `/${b}/tien-do`, { trangThai: 'lam', phanTram: 50 })).status, 410);
    assert.equal((await tram('POST', `/${b}/xong`, { ketQua: [{ loai: 'vi', ten: 'B [VI].mp4' }] })).status, 410);
    assert.deepEqual(await khoaTrong(admin.id, b), []);
  });

  it('không xem/sửa được việc của admin khác', async () => {
    const khac = await mkUser('admin2', true);
    const id = (await web(admin, 'POST', '/jobs', { url: 'https://x.y/rieng' })).data.job.id as string;
    assert.equal((await web(khac, 'GET', `/jobs/${id}`)).status, 404);
    assert.equal((await web(khac, 'DELETE', `/jobs/${id}`)).status, 404);
    assert.ok(!(await web(khac, 'GET', '/jobs')).data.some((j: any) => j.id === id));
    await web(admin, 'DELETE', `/jobs/${id}`);
  });

  it('mã kết nối: tạo (hiện một lần) ⇒ app dùng được ⇒ không tạo mã khác ⇒ thu hồi ⇒ 401; chủ mất ADMIN ⇒ 403', async () => {
    const t = await web(admin, 'POST', '/ma-ket-noi', { ten: 'MacBook' });
    assert.equal(t.status, 201);
    const ma = t.data.ma as string;
    assert.match(ma, /^ctlt_[A-Za-z0-9_-]{32}$/);
    const ds = (await web(admin, 'GET', '/ma-ket-noi')).data;
    const dong = ds.find((m: any) => m.id === t.data.id);
    assert.equal(dong.ten, 'MacBook');
    assert.equal(dong.dau, ma.slice(0, 9));
    assert.ok(!JSON.stringify(ds).includes(ma), 'danh sách không lộ mã');
    const row = await prisma.longTiengMaKetNoi.findUniqueOrThrow({ where: { id: t.data.id } });
    assert.notEqual(row.bam, ma);
    assert.equal(row.bam, lt.bamMa(ma));

    const toi = await web(ma, 'GET', '/toi');
    assert.equal(toi.status, 200);
    assert.equal(toi.data.userId, admin.id);
    assert.equal(toi.data.quaMa, true);
    const j = await web(ma, 'POST', '/jobs', { url: 'https://x.y/app' });
    assert.equal(j.status, 201, 'app tạo việc bằng mã');
    assert.ok((await web(ma, 'GET', '/jobs')).data.some((x: any) => x.id === j.data.job.id));
    assert.equal((await web(ma, 'POST', '/ma-ket-noi', {})).status, 403, 'mã không tự đẻ mã');
    assert.equal((await web(ma, 'GET', '/ma-ket-noi')).status, 403);
    assert.equal((await web('ctlt_khongtontaikhongtontai00', 'GET', '/jobs')).status, 401);

    assert.equal((await web(admin, 'DELETE', `/ma-ket-noi/${t.data.id}`)).status, 200);
    assert.equal((await web(ma, 'GET', '/jobs')).status, 401, 'thu hồi ⇒ chết ngay');
    assert.equal((await web(admin, 'DELETE', `/ma-ket-noi/${t.data.id}`)).status, 404);

    const t2 = await web(admin, 'POST', '/ma-ket-noi', {});
    await prisma.userRole.deleteMany({ where: { userId: admin.id } });
    assert.equal((await web(t2.data.ma, 'GET', '/jobs')).status, 403, 'chủ mất ADMIN ⇒ mã hết quyền');
    const role = await prisma.role.findFirstOrThrow({ where: { name: 'ROLE_ADMIN' } });
    await prisma.userRole.create({ data: { userId: admin.id, roleId: role.id } });
    assert.equal((await web(t2.data.ma, 'GET', '/jobs')).status, 200);
    await web(admin, 'DELETE', `/jobs/${j.data.job.id}`);
  });

  it('dịch: chỉ việc đang chạy; hỏi lại đúng phần model bỏ sót; vẫn thiếu ⇒ 502', async () => {
    const id = (await web(admin, 'POST', '/jobs', { url: 'https://x.y/dich' })).data.job.id as string;
    const cau = [
      { i: 0, giay: 3.2, toiDa: 42, src: '大家好' },
      { i: 1, giay: 2.0, toiDa: 26, src: '今天讲主板' },
      { i: 2, giay: 4.0, toiDa: 52, src: '先看CPU插槽' },
    ];
    assert.equal((await tram('POST', '/dich', { jobId: id, ngonNgu: 'zh', cau })).status, 410, 'việc chưa chạy ⇒ 410');
    await nhanDung(id);

    const luot: number[][] = [];
    lt._chiDeKiemThu.datGoiDich(async (_u, ngonNgu, c, truoc) => {
      assert.equal(ngonNgu, 'zh');
      assert.equal(truoc, 'câu trước');
      luot.push(c.map((x) => x.i));
      return new Map(c.filter((x) => luot.length > 1 || x.i !== 1).map((x) => [x.i, `vi-${x.i}`]));
    });
    const r = await tram('POST', '/dich', { jobId: id, ngonNgu: 'zh', cau, truoc: 'câu trước' });
    assert.equal(r.status, 200);
    assert.deepEqual(r.data.ds, [{ i: 0, vi: 'vi-0' }, { i: 1, vi: 'vi-1' }, { i: 2, vi: 'vi-2' }]);
    assert.deepEqual(luot, [[0, 1, 2], [1]], 'lượt hai chỉ hỏi câu bị sót');

    lt._chiDeKiemThu.datGoiDich(async () => new Map());
    const r2 = await tram('POST', '/dich', { jobId: id, ngonNgu: 'zh', cau, truoc: 'câu trước' });
    assert.equal(r2.status, 502);
    assert.equal((await tram('POST', '/dich', { jobId: id, ngonNgu: 'zh', cau: [] })).status, 400);
    assert.equal((await tram('POST', '/dich', { jobId: id, ngonNgu: 'zh', cau: Array.from({ length: 61 }, (_, i) => ({ i, giay: 1, toiDa: 10, src: 'x' })) })).status, 400);
    lt._chiDeKiemThu.datGoiDich(null);
    await web(admin, 'DELETE', `/jobs/${id}`);
  });

  it('chuỗi cổng dịch (giả lập cổng): gwai 400 có/không format ⇒ chính hãng JSON hỏng ⇒ modelapi; trần chính hãng đọc sổ thật', async () => {
    const id = (await web(admin, 'POST', '/jobs', { url: 'https://x.y/chuoi' })).data.job.id as string;
    await nhanDung(id);
    lt._chiDeKiemThu.datGoiDich(null); // đi chuỗi cổng THẬT của service, chỉ thay từng cổng
    const goi: string[] = [];
    const prompts: string[] = [];
    let modelapiTra: (ids: number[]) => string = (ids) => JSON.stringify({ ds: ids.map((i) => ({ i, vi: `vi-${i}` })) });
    ltd._datCongDichChoTest({
      gwai: () => ({ root: 'http://gwai.invalid', key: 'k', local: false, label: 'cong-agent', giaoThuc: 'anthropic' }),
      gwaiDangNghi: () => false,
      goiGwai: async (_o, _ep, model, coDinhDang) => { goi.push(`gwai:${model}:${coDinhDang ? 'format' : 'tho'}`); throw Object.assign(new Error('anthropic HTTP 400'), { httpStatus: 400 }); },
      baoGwai: () => {},
      chinhHangSanSang: async () => true,
      goiChinhHang: async (_o, model) => { goi.push(`chinh_hang:${model}`); return { text: 'Xin lỗi, tôi không trả JSON', model }; },
      baoChinhHangHong: () => {},
      goiModelapi: async (o, model) => {
        goi.push(`modelapi:${model}`);
        prompts.push(o.user);
        const ids = [...o.user.matchAll(/"i":(\d+)/g)].map((m) => Number(m[1]));
        return { text: modelapiTra(ids), model };
      },
    });
    const cau = [{ i: 0, giay: 3, toiDa: 40, src: 'Docker 容器' }, { i: 1, giay: 2, toiDa: 26, src: '镜像' }];
    const tuDien = [{ goc: '容器', vi: 'container' }, { goc: '镜像', vi: 'image' }, { goc: '', vi: 'rỗng' }];
    const r = await tram('POST', '/dich', { jobId: id, ngonNgu: 'zh', cau, truoc: ['Câu một.', 'Câu hai.'], tuDien });
    assert.equal(r.status, 200);
    assert.deepEqual(r.data.ds, [{ i: 0, vi: 'vi-0' }, { i: 1, vi: 'vi-1' }]);
    assert.deepEqual(goi, ['gwai:claude-sonnet-5-5:format', 'gwai:claude-sonnet-5-5:tho', 'chinh_hang:claude-sonnet-5-5', 'modelapi:gpt-6-sol'],
      'đúng thứ tự: gwai (kèm format, rồi không) → chính hãng → modelapi');
    assert.match(prompts[0]!, /容器 → container/, 'từ điển đi kèm lô');
    assert.match(prompts[0]!, /Câu một\.\nCâu hai\./, 'ngữ cảnh câu trước');

    // choPhepThieu: model sót câu 1 cả hai lượt ⇒ 200 { ds, thieu } (trạm mới chỉ gửi lại phần thiếu).
    goi.length = 0;
    modelapiTra = () => JSON.stringify({ ds: [{ i: 0, vi: 'chỉ câu 0' }] });
    const t = await tram('POST', '/dich', { jobId: id, ngonNgu: 'zh', cau, choPhepThieu: true });
    assert.equal(t.status, 200);
    assert.deepEqual(t.data.ds, [{ i: 0, vi: 'chỉ câu 0' }]);
    assert.deepEqual(t.data.thieu, [1]);
    assert.equal((await tram('POST', '/dich', { jobId: id, ngonNgu: 'zh', cau })).status, 502, 'trạm cũ (không choPhepThieu) ⇒ 502 như trước');

    // Từ điển: cùng chuỗi, JSON đúng khuôn tuDien.
    modelapiTra = () => JSON.stringify({ tuDien: [{ goc: '容器', vi: 'container' }, { goc: '容器', vi: 'trùng' }] });
    const td = await tram('POST', '/tu-dien', { jobId: id, ngonNgu: 'zh', mau: ['Docker 容器 是什么', '镜像 和 容器'] });
    assert.equal(td.status, 200);
    assert.deepEqual(td.data.tuDien, [{ goc: '容器', vi: 'container' }], 'bỏ mục trùng');
    assert.equal((await tram('POST', '/tu-dien', { jobId: id, ngonNgu: 'zh', mau: [] })).status, 400);

    // Trần chính hãng của việc dịch đọc sổ anthropic_usage THẬT (viec = long_tieng_dich, theo ngày giờ VN).
    const cu = process.env.LONG_TIENG_CHINH_HANG_USD_NGAY;
    process.env.LONG_TIENG_CHINH_HANG_USD_NGAY = '0.5';
    const dong = await prisma.anthropicUsage.create({ data: { viec: 'long_tieng_dich', model: 'claude-sonnet-5-5', costUsd: 0.6, userId: admin.id } });
    try {
      assert.equal(await ltd.trongTranChinhHangDich(), false, 'đã tiêu 0,6 $ ≥ trần 0,5 $');
      process.env.LONG_TIENG_CHINH_HANG_USD_NGAY = '1000';
      assert.equal(await ltd.trongTranChinhHangDich(), true);
      process.env.LONG_TIENG_CHINH_HANG_USD_NGAY = '0';
      assert.equal(await ltd.trongTranChinhHangDich(), false, '0 = tắt bậc chính hãng');
    } finally {
      await prisma.anthropicUsage.delete({ where: { id: dong.id } });
      if (cu === undefined) delete process.env.LONG_TIENG_CHINH_HANG_USD_NGAY; else process.env.LONG_TIENG_CHINH_HANG_USD_NGAY = cu;
    }
    ltd._datCongDichChoTest(null);
    await web(admin, 'DELETE', `/jobs/${id}`);
  });

  it('nhạc nền: mặc định gốc; thư viện (GET /nhac + trạm nhận URL nhạc); tệp nhạc tải lên; không nhạc; kiểm đầu vào', async () => {
    await putObject(lt.KHOA_DANH_SACH_NHAC, Buffer.from(JSON.stringify({ bai: [
      { id: 'lofi-1', ten: 'Lo-fi nhẹ', tamTrang: 'lofi', thoiLuong: 120, khoa: `${lt.THU_MUC_NHAC}lofi-1.mp3`, nguon: 'https://freesound.org/s/1/', giayPhep: 'CC0 1.0' },
      { id: 'xau', ten: 'Khoá ngoài thư mục', tamTrang: 'x', thoiLuong: 1, khoa: 'khac/x.mp3', nguon: '-', giayPhep: '-' },
    ] })), 'application/json');
    await putObject(`${lt.THU_MUC_NHAC}lofi-1.mp3`, Buffer.from('mp3'), 'audio/mpeg');
    await lt.docDsNhac(true);

    const ds = await web(admin, 'GET', '/nhac');
    assert.equal(ds.status, 200);
    assert.deepEqual(ds.data.map((b: any) => b.id), ['lofi-1'], 'bài có khoá ngoài long-tieng/nhac/ bị bỏ');
    assert.ok(ds.data[0].nghe.includes('X-Amz-Signature='));
    assert.equal(ds.data[0].giay, 120, 'tên trường app dùng');
    assert.equal(ds.data[0].nghiThu, ds.data[0].nghe);
    assert.equal(ds.data[0].giayPhep, 'CC0 1.0');
    assert.equal((await web(thuong, 'GET', '/nhac')).status, 403);

    const mac = (await web(admin, 'POST', '/jobs', { url: 'https://x.y/n0' })).data.job;
    assert.deepEqual(mac.nhacNen, { loai: 'goc', amLuong: 0.9 });
    await web(admin, 'DELETE', `/jobs/${mac.id}`);

    assert.equal((await web(admin, 'POST', '/jobs', { url: 'https://x.y/n', nhacNen: { loai: 'thu-vien', id: 'khong-co' } })).status, 400);
    assert.equal((await web(admin, 'POST', '/jobs', { url: 'https://x.y/n', nhacNen: { loai: 'disco' } })).status, 400);
    assert.equal((await web(admin, 'POST', '/jobs', { url: 'https://x.y/n', nhacNen: { loai: 'khong', amLuong: 3 } })).status, 400);
    assert.equal((await web(admin, 'POST', '/jobs', { url: 'https://x.y/n', nhacNen: { loai: 'tep' } })).status, 400);

    const tv = await web(admin, 'POST', '/jobs', { url: 'https://x.y/n1', nhacNen: { loai: 'thu-vien', id: 'lofi-1', amLuong: 0.2 } });
    assert.equal(tv.status, 201);
    assert.equal(tv.data.job.trangThai, 'cho');
    assert.deepEqual(tv.data.job.nhacNen, { loai: 'thu-vien', id: 'lofi-1', amLuong: 0.2 });
    const n1 = await nhanDung(tv.data.job.id);
    assert.equal(n1.job.nhacNen.ten, 'Lo-fi nhẹ');
    assert.ok(n1.nhac.url.includes('lofi-1.mp3'));
    await web(admin, 'DELETE', `/jobs/${tv.data.job.id}`);

    const tn = await web(admin, 'POST', '/jobs', { url: 'https://x.y/n2', nhacNen: { loai: 'tep', tep: { ten: 'nhạc.mp3', kichThuoc: 3, kieu: 'audio/mpeg' } } });
    assert.equal(tn.status, 201);
    const id = tn.data.job.id as string;
    assert.equal(tn.data.job.trangThai, 'cho_tai_len', 'link + nhạc tải lên ⇒ vẫn chờ tải nhạc');
    assert.equal(tn.data.taiLen, undefined);
    assert.equal(tn.data.taiLenNhac.kieu, 'audio/mpeg');
    assert.equal((await web(admin, 'POST', `/jobs/${id}/da-tai-len`)).code, 'LT_CHUA_CO_NHAC');
    await putObject(`${lt.thuMucViec(admin.id, id)}vao/nhac.mp3`, Buffer.from('nhac!'), 'audio/mpeg');
    const da = await web(admin, 'POST', `/jobs/${id}/da-tai-len`);
    assert.equal(da.data.trangThai, 'cho');
    assert.equal(da.data.nhacNen.tep.kichThuoc, 5);
    const n2 = await nhanDung(id);
    assert.ok(n2.nhac.url.includes('nhac.mp3'));
    assert.equal(n2.vao, undefined);
    const kq = [{ loai: 'vi', ten: 'N [VI].mp4', kichThuoc: 1 }];
    await putObject(lt.khoaKetQua(admin.id, id, 'vi', kq[0]!.ten), Buffer.from('v'), 'video/mp4');
    await tram('POST', `/${id}/xong`, { thoiLuong: 1, ketQua: kq });
    assert.deepEqual(await khoaTrong(admin.id, id), [lt.khoaKetQua(admin.id, id, 'vi', kq[0]!.ten)], 'xong ⇒ xoá cả tệp nhạc vào');

    const kh = (await web(admin, 'POST', '/jobs', { url: 'https://x.y/n3', nhacNen: { loai: 'khong' } })).data.job;
    assert.deepEqual(kh.nhacNen, { loai: 'khong', amLuong: 0 });
    await web(admin, 'DELETE', `/jobs/${kh.id}`);
    await web(admin, 'DELETE', `/jobs/${id}`);
  });

  it('prompt dịch mang toiDa + ngữ cảnh + đủ số câu', () => {
    const p = lt.promptDich('en', [{ i: 4, giay: 2, toiDa: 26, src: 'Hello' }], '');
    assert.match(p, /tiếng Anh/);
    assert.match(p, /\(đầu video\)/);
    assert.match(p, /"toiDa":26/);
    assert.match(p, /đủ 1 câu/);
  });

  it('dọn tự động: việc chờ tải lên quá 24 giờ bị xoá; kết quả quá 7 ngày bị xoá khỏi kho, dòng giữ lại', async () => {
    const a = (await web(admin, 'POST', '/jobs', { tep: { ten: 'treo.mp4', kichThuoc: 3, kieu: 'video/mp4' } })).data.job.id as string;
    await putObject(`${lt.thuMucViec(admin.id, a)}vao/goc.mp4`, Buffer.from('abc'), 'video/mp4');
    await prisma.longTiengViec.update({ where: { id: a }, data: { tao: new Date(Date.now() - 25 * 3600_000) } });

    const b = (await web(admin, 'POST', '/jobs', { url: 'https://x.y/cu' })).data.job.id as string;
    await nhanDung(b);
    const tep = [{ loai: 'vi', ten: 'Cũ [VI].mp4', kichThuoc: 1 }];
    await putObject(lt.khoaKetQua(admin.id, b, 'vi', tep[0]!.ten), Buffer.from('v'), 'video/mp4');
    await tram('POST', `/${b}/xong`, { thoiLuong: 1, ketQua: tep });
    await prisma.longTiengViec.update({ where: { id: b }, data: { xong: new Date(Date.now() - 8 * 24 * 3600_000) } });

    const r = await lt.donDep();
    assert.ok(r.xoaViec >= 1 && r.xoaTep >= 2);
    assert.equal(await prisma.longTiengViec.count({ where: { id: a } }), 0);
    assert.deepEqual(await khoaTrong(admin.id, a), []);
    const g = (await web(admin, 'GET', `/jobs/${b}`)).data;
    assert.equal(g.trangThai, 'xong');
    assert.equal(g.ketQua[0].url, null);
    assert.match(g.buoc, /quá 7 ngày/);
    assert.deepEqual(await khoaTrong(admin.id, b), []);
  });
});
