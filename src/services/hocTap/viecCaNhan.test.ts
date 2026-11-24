/**
 * Việc cá nhân + vẽ hôm nay/tuần + đọc giờ của lệnh MCP `hoc_tap` — phần THUẦN (không DB):
 *   npx tsx --test src/services/hocTap/viecCaNhan.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { chuanHoaViecCaNhan, docNgay, ngayVNChuoi } from './viecCaNhan.js';
import { docMaViec, gioVN, veHomNay, veTuan } from './veHocTap.js';
import { thoiDiem } from '../work/toolRegistry/hocTap.js';

// 24/11/2026 23:30 giờ VN = 16:30 UTC — ngày VN vẫn là 24/11; 17:30 UTC đã sang 25/11.
const KHUYA = new Date('2026-11-24T16:30:00.000Z');
const SANG_HOM_SAU = new Date('2026-11-24T17:30:00.000Z');

describe('ngày/giờ theo giờ Việt Nam', () => {
  it('ngayVNChuoi qua nửa đêm VN', () => {
    assert.equal(ngayVNChuoi(KHUYA), '2026-11-24');
    assert.equal(ngayVNChuoi(SANG_HOM_SAU), '2026-11-25');
  });
  it('docNgay chặn ngày không có thật', () => {
    assert.equal(docNgay('2026-02-30'), null);
    assert.equal(docNgay('26-11-24'), null);
    assert.equal(docNgay('2026-11-24')?.toISOString(), '2026-11-24T00:00:00.000Z');
  });
  it('gioVN', () => {
    assert.equal(gioVN('2026-11-24T13:00:00.000Z'), '20:00');
    assert.equal(gioVN(null), null);
  });
});

describe('chuanHoaViecCaNhan', () => {
  it('không giờ, không ngày ⇒ hôm nay (giờ VN), 30 phút', () => {
    const c = chuanHoaViecCaNhan({ tieuDe: '  Gọi về nhà ' }, SANG_HOM_SAU);
    assert.equal(c.tieuDe, 'Gọi về nhà');
    assert.equal(c.ngay.toISOString().slice(0, 10), '2026-11-25');
    assert.equal(c.gioBatDau, null);
    assert.equal(c.thoiLuongPhut, 30);
  });
  it('có giờ ⇒ ngày = ngày VN của giờ đó, bỏ qua ngày gửi kèm', () => {
    const c = chuanHoaViecCaNhan({ tieuDe: 'Ôn kana', gioBatDau: '2026-11-26T13:00:00.000Z', ngay: '2026-11-01', thoiLuongPhut: 2000 }, KHUYA);
    assert.equal(c.ngay.toISOString().slice(0, 10), '2026-11-26');
    assert.equal(c.thoiLuongPhut, 600, 'trần 600 phút');
  });
  it('thiếu tên / giờ sai / ngày sai ⇒ lỗi', () => {
    assert.throws(() => chuanHoaViecCaNhan({ tieuDe: '   ' }), /Thiếu tên/);
    assert.throws(() => chuanHoaViecCaNhan({ tieuDe: 'x', gioBatDau: 'mai' }), /Giờ/);
    assert.throws(() => chuanHoaViecCaNhan({ tieuDe: 'x', ngay: '24/11' }), /YYYY-MM-DD/);
  });
  it('sửa: giữ trường cũ, gioBatDau null = bỏ giờ (giữ ngày)', () => {
    const cu = { tieuDe: 'Chạy bộ', ghiChu: 'công viên', gioBatDau: new Date('2026-11-24T23:00:00.000Z'), ngay: new Date('2026-11-25T00:00:00.000Z'), thoiLuongPhut: 40 };
    const c = chuanHoaViecCaNhan({ gioBatDau: null }, KHUYA, cu);
    assert.equal(c.tieuDe, 'Chạy bộ');
    assert.equal(c.ghiChu, 'công viên');
    assert.equal(c.gioBatDau, null);
    assert.equal(c.ngay.toISOString().slice(0, 10), '2026-11-25');
    assert.equal(c.thoiLuongPhut, 40);
  });
});

describe('lệnh hoc_tap — đọc mã việc + giờ', () => {
  it('docMaViec', () => {
    assert.deepEqual(docMaViec('H12', 'C'), { loai: 'H', id: 12 });
    assert.deepEqual(docMaViec('c5', 'H'), { loai: 'C', id: 5 });
    assert.deepEqual(docMaViec(7, 'C'), { loai: 'C', id: 7 });
    assert.equal(docMaViec('X1', 'C'), null);
    assert.equal(docMaViec('H0', 'C'), null);
  });
  it('thoiDiem: HH:MM giờ VN ⇒ ISO UTC; "" khi sửa = bỏ giờ', () => {
    assert.deepEqual(thoiDiem('2026-11-26', '20:00'), { gioBatDau: '2026-11-26T13:00:00.000Z', ngay: '2026-11-26' });
    assert.deepEqual(thoiDiem('2026-11-26', '7:05'), { gioBatDau: '2026-11-26T00:05:00.000Z', ngay: '2026-11-26' });
    assert.deepEqual(thoiDiem('2026-11-26', undefined), { ngay: '2026-11-26' });
    assert.deepEqual(thoiDiem(undefined, '', true), { gioBatDau: null });
    assert.throws(() => thoiDiem('2026-11-26', '25:00'), /HH:MM/);
    assert.throws(() => thoiDiem('26/11', '20:00'), /YYYY-MM-DD/);
  });
});

describe('veHomNay / veTuan', () => {
  const hoc = [{ id: 12, maMon: 'JPD113', tieuDe: 'Kana hàng a–ka', thoiLuongPhut: 45, trangThai: 'CHUA_LAM', gioBatDau: '2026-11-24T13:00:00.000Z', hanChot: '2026-11-24T16:59:59.000Z' }];
  const caNhan = [
    { id: 5, tieuDe: 'Gọi về nhà', gioBatDau: '2026-11-24T12:00:00.000Z', ngay: '2026-11-24', thoiLuongPhut: 20, xong: false, quaHan: false },
    { id: 6, tieuDe: 'Đi chợ', gioBatDau: null, ngay: '2026-11-23', thoiLuongPhut: 30, xong: false, quaHan: true },
    { id: 7, tieuDe: 'Giặt đồ', gioBatDau: null, ngay: '2026-11-24', thoiLuongPhut: 30, xong: true, quaHan: false },
  ];
  it('hôm nay: xếp theo giờ, đánh dấu việc tồn, tách việc đã xong, nhắc luật không tự tích', () => {
    const md = veHomNay({
      ngay: '2026-11-24', hocKy: { ten: 'Block 5', tuan: 1, soTuan: 3, tuanThi: 3 }, ruiRoKy: { tyLe: 22, mucDo: 'vang' },
      lop: [{ maMon: 'JPD113', batDau: '07:30', ketThuc: '09:50', phong: 'BE-301' }], hoc, quaHan: [], choCham: 0, caNhan,
      mon: [{ maMon: 'JPD113', tyLeTruot: 22, mucDo: 'vang', tienDo: 10, kyVong: 20, thiSapToi: { loai: 'FE', conNgay: 20 } }],
    });
    assert.match(md, /T3 24\/11\/2026 · Block 5 · tuần 1\/3/);
    assert.match(md, /07:30–09:50\*\* JPD113 · phòng BE-301/);
    assert.ok(md.indexOf('`C5`') < md.indexOf('`H12`'), '19:00 trước 20:00');
    assert.match(md, /`C6` Đi chợ \(30′, cá nhân · tồn từ 23\/11\)/);
    assert.match(md, /Đã xong \(cá nhân\)\*\*: Giặt đồ/);
    assert.match(md, /không tự tích/);
  });
  it('tuần: 7 dòng ngày, ngày trống ghi (trống), cộng giờ tự học', () => {
    const md = veTuan({
      hocKy: null,
      ngay: Array.from({ length: 7 }, (_, i) => ({ ngay: `2026-11-${24 + i}`, thu: ((i + 1) % 7) + 1, lop: [], hoc: i === 0 ? hoc : [], caNhan: i === 0 ? [caNhan[0]] : [] })),
    });
    assert.equal((md.match(/^\*\*(T\d|CN) /gm) ?? []).length, 7);
    assert.match(md, /tự học 0\.8 giờ/);
    assert.equal((md.match(/\(trống\)/g) ?? []).length, 6);
  });
});
