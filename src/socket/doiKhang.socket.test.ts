/**
 * Đối kháng — luồng phòng + LỜI MỜI chạy trên máy chủ socket.io THẬT với nhiều client (08/11/2026).
 *
 *   npx tsx --test src/socket/doiKhang.socket.test.ts
 *
 * Không cần Postgres: DB/thông báo thay bằng bản giả qua tham số `dvTruyen` của `registerDoiKhang`.
 * Client lấy từ `frontend/node_modules/socket.io-client` (gốc repo không cài gói này) — nên tệp này
 * KHÔNG nằm trong danh sách `npm test` của CI gốc; chạy tay khi sửa `doiKhang.socket.ts`.
 *
 * Những lỗi người dùng báo 08/11/2026 mà các phép thử dưới đây chặn:
 *  - lời mời không tới / nút "Đã mời" báo giả  → `mời bạn: mọi thiết bị nhận, ack có id + online`
 *  - tab kia hết giờ gửi "từ chối" oan         → `nhận ở thiết bị này ⇒ thiết bị kia tắt thẻ, từ chối muộn bị bỏ qua`
 *  - chủ phòng rời trang là phòng mất          → `rời trang không xoá phòng chờ; hết hạn giữ ghế mới rời`
 *  - hai người cùng vào giành một ghế          → `vào cùng lúc không giành ghế`
 */
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import type { AddressInfo } from 'node:net';
import { Server } from 'socket.io';
import { registerDoiKhang, type DichVuDoiKhang } from './doiKhang.socket.js';

const req = createRequire(import.meta.url);
/** Phần API client cần dùng — khai tay vì gốc repo không có kiểu của `socket.io-client`. */
interface ClientSocket {
  emit(ev: string, ...a: unknown[]): unknown;
  on(ev: string, f: (...a: any[]) => void): unknown;
  off(ev: string, f: (...a: any[]) => void): unknown;
  once(ev: string, f: (...a: any[]) => void): unknown;
  timeout(ms: number): { emit(ev: string, ...a: unknown[]): unknown };
  disconnect(): unknown;
}
const { io: ketNoi } = req('../../frontend/node_modules/socket.io-client') as {
  io: (url: string, opts: Record<string, unknown>) => ClientSocket;
};

// ── Dữ liệu giả ────────────────────────────────────────────────────────────────
/** 1 chủ phòng · 2 bạn (có 2 thiết bị) · 3 người lạ · 4 bạn offline · 5, 6 bạn. */
const BAN = new Set(['1-2', '1-4', '1-5', '1-6', '5-6']);
const laBan = (a: number, b: number) => BAN.has(`${Math.min(a, b)}-${Math.max(a, b)}`);
const daBaoOffline: number[] = [];
let treDb = 0;
const dv: Partial<DichVuDoiKhang> = {
  layNguoi: (async (ids: number[]) => {
    if (treDb) await new Promise((r) => setTimeout(r, treDb));
    return new Map(ids.map((id) => [id, { id, username: `u${id}`, displayName: `Người ${id}`, fullName: null, avatarUrl: null }]));
  }) as unknown as DichVuDoiKhang['layNguoi'],
  layElo: (async (_t: unknown, ids: number[]) => new Map(ids.map((id) => [id, 1200]))) as unknown as DichVuDoiKhang['layElo'],
  luuVan: (async () => null) as unknown as DichVuDoiKhang['luuVan'],
  moiDuoc: async (a, b) => laBan(a, b),
  banOnline: (async () => []) as unknown as DichVuDoiKhang['banOnline'],
  baoMoiOffline: async (den) => { daBaoOffline.push(den); },
  hanMoiMs: 400,
  giuPhongMs: 300,
};

// ── Máy chủ thật ─────────────────────────────────────────────────────────────
const http = createServer();
const io = new Server(http);
io.on('connection', (s) => {
  const uid = Number(s.handshake.auth.uid);
  void s.join(`user:${uid}`);
  registerDoiKhang(io, s, { id: uid, username: `u${uid}` }, dv);
});
await new Promise<void>((r) => http.listen(0, r));
const url = `http://127.0.0.1:${(http.address() as AddressInfo).port}`;

const mo: ClientSocket[] = [];
async function nguoi(uid: number): Promise<ClientSocket> {
  const s = ketNoi(url, { auth: { uid }, transports: ['websocket'], forceNew: true, reconnection: false });
  mo.push(s);
  await new Promise<void>((r, j) => { s.once('connect', () => r()); s.once('connect_error', j); });
  return s;
}
type Ack = { ok: boolean; loi?: string; [k: string]: unknown };
const goiTho = (s: ClientSocket, ev: string, d: unknown) => new Promise<Ack>((r) => s.timeout(3000).emit(ev, d, (e: unknown, a: Ack) => r(e ? { ok: false, loi: 'timeout' } : a)));
/** Máy chủ chặn mời dồn (1,2 s/người) — các phép thử mời nối nhau nên giãn ra cho đúng nhịp người thật. */
let lanMoiCuoi = 0;
async function goi(s: ClientSocket, ev: string, d: unknown): Promise<Ack> {
  if (ev === 'dk:moi') {
    const cho = lanMoiCuoi + 1250 - Date.now();
    if (cho > 0) await new Promise((r) => setTimeout(r, cho));
    lanMoiCuoi = Date.now();
  }
  return goiTho(s, ev, d);
}
function cho<T = any>(s: ClientSocket, ev: string, loc: (d: T) => boolean = () => true, ms = 2000): Promise<T> {
  return new Promise((r, j) => {
    const t = setTimeout(() => { s.off(ev, h); j(new Error(`không nhận được ${ev}`)); }, ms);
    const h = (d: T) => { if (!loc(d)) return; clearTimeout(t); s.off(ev, h); r(d); };
    s.on(ev, h);
  });
}
/** Khẳng định KHÔNG nhận được sự kiện trong `ms`. */
async function khongCo(s: ClientSocket, ev: string, ms = 250) {
  let co = false;
  const h = () => { co = true; };
  s.on(ev, h);
  await new Promise((r) => setTimeout(r, ms));
  s.off(ev, h);
  assert.equal(co, false, `không được nhận ${ev}`);
}
const nghi = (ms: number) => new Promise((r) => setTimeout(r, ms));

after(() => { mo.forEach((s) => s.disconnect()); io.close(); http.close(); });

async function taoPhong(chu: ClientSocket, tro = 'co-vua') {
  const a = await goi(chu, 'dk:tao', { tro, rieng: true });
  assert.equal(a.ok, true, a.loi);
  return (a.phong as { maPhong: string }).maPhong;
}

test('mời bạn: MỌI thiết bị của bạn nhận lời mời có id + hạn; ack báo online; phòng hiện "đang mời"', async () => {
  const chu = await nguoi(1);
  const b1 = await nguoi(2);
  const b2 = await nguoi(2);
  const ma = await taoPhong(chu);
  const nhan1 = cho(b1, 'dk:loi-moi'); const nhan2 = cho(b2, 'dk:loi-moi');
  const phongCapNhat = cho<{ dangMoi: { userId: number }[] }>(chu, 'dk:phong', (p) => (p.dangMoi ?? []).length > 0);
  const a = await goi(chu, 'dk:moi', { maPhong: ma, userId: 2 });
  assert.equal(a.ok, true, a.loi);
  assert.equal(a.online, true);
  const [m1, m2] = await Promise.all([nhan1, nhan2]);
  assert.equal(m1.maPhong, ma); assert.ok(m1.id); assert.ok(m1.hetLuc > Date.now());
  assert.equal(m2.id, m1.id);
  assert.deepEqual((await phongCapNhat).dangMoi.map((x) => x.userId), [2]);

  // ── Nhận ở thiết bị 1 ⇒ chủ phòng biết, thiết bị 2 tắt thẻ, "từ chối" muộn của thiết bị 2 bị bỏ qua.
  const ketQua = cho(chu, 'dk:moi-ket-qua');
  const tat2 = cho(b2, 'dk:loi-moi-xong');
  const v = await goi(b1, 'dk:vao', { maPhong: ma });
  assert.equal(v.ok, true, v.loi);
  assert.equal((await ketQua).ketQua, 'nhan');
  await tat2;
  b2.emit('dk:tra-loi-moi', { maPhong: ma, dongY: false });
  await khongCo(chu, 'dk:tu-choi');
  await khongCo(chu, 'dk:moi-ket-qua', 50);
});

test('từ chối ⇒ chủ phòng nhận kết quả (kèm sự kiện cũ dk:tu-choi cho bản app cũ) với TÊN HIỂN THỊ', async () => {
  const chu = await nguoi(1);
  const b = await nguoi(5);
  const ma = await taoPhong(chu);
  const loiMoi = cho(b, 'dk:loi-moi');
  assert.equal((await goi(chu, 'dk:moi', { maPhong: ma, userId: 5 })).ok, true);
  await loiMoi;
  const kq = cho(chu, 'dk:moi-ket-qua'); const cu = cho(chu, 'dk:tu-choi');
  b.emit('dk:tra-loi-moi', { maPhong: ma, dongY: false });
  assert.equal((await kq).ketQua, 'tu-choi');
  assert.equal((await cu).ten, 'Người 5');
});

test('hết hạn ⇒ chủ phòng nhận "het-han", thẻ ở người được mời tự tắt', async () => {
  const chu = await nguoi(1);
  const b = await nguoi(6);
  const ma = await taoPhong(chu);
  const loiMoi = cho(b, 'dk:loi-moi');
  assert.equal((await goi(chu, 'dk:moi', { maPhong: ma, userId: 6 })).ok, true);
  await loiMoi;
  const [kq, xong] = await Promise.all([cho(chu, 'dk:moi-ket-qua'), cho(b, 'dk:loi-moi-xong')]);
  assert.equal(kq.ketQua, 'het-han');
  assert.equal(xong.ketQua, 'het-han');
});

test('không mời được người lạ; bạn offline ⇒ ack online:false và vào chuông thông báo', async () => {
  const chu = await nguoi(1);
  const ma = await taoPhong(chu);
  const la = await goi(chu, 'dk:moi', { maPhong: ma, userId: 3 });
  assert.equal(la.ok, false);
  assert.match(String(la.loi), /bạn bè/);
  const off = await goi(chu, 'dk:moi', { maPhong: ma, userId: 4 });
  assert.equal(off.ok, true, off.loi);
  assert.equal(off.online, false);
  await nghi(50);
  assert.ok(daBaoOffline.includes(4));
});

test('phòng đủ người ⇒ từ chối mời thêm với lý do rõ ràng', async () => {
  const chu = await nguoi(1);
  const b = await nguoi(2);
  const ma = await taoPhong(chu);
  assert.equal((await goi(b, 'dk:vao', { maPhong: ma })).ok, true);
  const a = await goi(chu, 'dk:moi', { maPhong: ma, userId: 5 });
  assert.equal(a.ok, false);
  assert.match(String(a.loi), /đủ người/);
});

test('chủ phòng RỜI TRANG không xoá phòng chờ (người được mời vẫn vào được); hết hạn giữ ghế mới rời', async () => {
  const chu = await nguoi(1);
  const ma = await taoPhong(chu);
  chu.emit('dk:roi', { maPhong: ma }); // rời trang (không phải "Rời phòng")
  await nghi(80);
  const b = await nguoi(2);
  const v = await goi(b, 'dk:vao', { maPhong: ma });
  assert.equal(v.ok, true, 'phòng phải còn — trước bản vá: "Không tìm thấy phòng"');
  const ghe = (v.phong as { ghe: { userId: number | null; online: boolean }[] }).ghe;
  assert.deepEqual(ghe.map((g) => g.userId), [1, 2]);
  assert.equal(ghe[0]!.online, false, 'chủ phòng hiện "tạm vắng"');
  // Quá hạn giữ ghế (300 ms trong test) ⇒ ghế chủ phòng được trả, người còn lại thành chủ.
  const capNhat = await cho<{ ghe: { userId: number | null }[]; chuId: number }>(b, 'dk:phong', (p) => p.ghe[0]?.userId == null, 1500);
  assert.equal(capNhat.chuId, 2);
});

test('"Rời phòng" thật (han) ⇒ người cuối rời là phòng đóng ngay', async () => {
  const chu = await nguoi(1);
  const ma = await taoPhong(chu);
  chu.emit('dk:roi', { maPhong: ma, han: true });
  await nghi(80);
  const b = await nguoi(2);
  const v = await goi(b, 'dk:vao', { maPhong: ma });
  assert.equal(v.ok, false);
});

test('hai người vào CÙNG LÚC phòng tiến lên không giành một ghế', async () => {
  const chu = await nguoi(1);
  const a = await goi(chu, 'dk:tao', { tro: 'tien-len', soGhe: 3, rieng: true });
  const ma = (a.phong as { maPhong: string }).maPhong;
  const x = await nguoi(5); const y = await nguoi(6);
  treDb = 80; // DB chậm — trước bản vá cả hai thấy cùng ghế trống trong lúc chờ
  const [vx, vy] = await Promise.all([goi(x, 'dk:vao', { maPhong: ma }), goi(y, 'dk:vao', { maPhong: ma })]);
  treDb = 0;
  assert.equal(vx.ok && vy.ok, true);
  const p = await goi(chu, 'dk:vao', { maPhong: ma });
  const ids = (p.phong as { ghe: { userId: number | null }[] }).ghe.map((g) => g.userId);
  assert.deepEqual([...ids].sort(), [1, 5, 6]);
});

test('danh sách phòng công khai chỉ có phòng không riêng tư, còn người chơi đang ở đó', async () => {
  const chu = await nguoi(1);
  const a = await goi(chu, 'dk:tao', { tro: 'caro', rieng: false });
  const ma = (a.phong as { maPhong: string }).maPhong;
  const ds = await goi(await nguoi(3), 'dk:ds-phong', { tro: 'caro' });
  const phong = (ds.phong as { maPhong: string; conCho: boolean }[]).find((p) => p.maPhong === ma);
  assert.ok(phong, 'phòng công khai phải có trong danh sách');
  assert.equal(phong.conCho, true);
});
