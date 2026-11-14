/**
 * Luật THUẦN của đồng bộ sổ tay: kiểm bản ghi, gộp trùng trong lô, "bản mới hơn thắng", trần số mục.
 *   npx tsx --test src/services/ctlanguage/soTuDongBoThuan.test.ts
 */
import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { GIOI_HAN_SO_TU, apTran, chuanBanGhi, chuanLo, thang, type BanGhiCo, type BanGhiVao } from './soTuDongBoThuan.js';

const BAY_GIO = new Date('2026-11-15T10:00:00.000Z');
const the = (id: number, cap = '2026-11-15T09:00:00.000Z', them: Record<string, unknown> = {}) => ({
  loai: 'the', khoa: `ja-${id}`, capNhat: cap,
  duLieu: {
    muc: { id, chu: '仕様書', doc: 'しようしょ', nghiaVi: 'bản đặc tả', rac: 'bị bỏ' }, nn: 'ja', themLuc: '2026-11-01T00:00:00Z',
    heSo: 2.5, khoangNgay: 3, lanDung: 2, lanQuen: 0, denHan: '2026-11-18T00:00:00Z', lanOnCuoi: '2026-11-15T09:00:00Z', so: ['S1', 'S1'],
    ...them,
  },
});

test('thẻ hợp lệ: chuẩn hoá, bỏ trường lạ, gộp sổ trùng', () => {
  const b = chuanBanGhi(the(42), BAY_GIO);
  assert.ok('capNhat' in b);
  assert.equal(b.loai, 'the');
  const d = b.duLieu as Record<string, any>;
  assert.equal(d.muc.rac, undefined);
  assert.deepEqual(d.so, ['S1']);
  assert.equal(d.denHan, '2026-11-18T00:00:00.000Z');
});

test('thẻ sai: khoa không khớp muc.id, nn sai, số ngoài khoảng, ngày hỏng', () => {
  assert.match((chuanBanGhi({ ...the(42), khoa: 'ja-43' }, BAY_GIO) as { ly: string }).ly, /khoa phải là/);
  assert.match((chuanBanGhi(the(42, undefined, { nn: 'vi' }), BAY_GIO) as { ly: string }).ly, /nn sai|khoa/);
  assert.match((chuanBanGhi(the(42, undefined, { heSo: 99 }), BAY_GIO) as { ly: string }).ly, /heSo/);
  assert.match((chuanBanGhi(the(42, undefined, { denHan: 'hôm qua' }), BAY_GIO) as { ly: string }).ly, /denHan/);
  assert.match((chuanBanGhi({ ...the(42), capNhat: 12345 }, BAY_GIO) as { ly: string }).ly, /capNhat/);
  assert.match((chuanBanGhi({ loai: 'xx', khoa: 'a', capNhat: '2026-11-15T00:00:00Z' }, BAY_GIO) as { ly: string }).ly, /loai/);
});

test('thẻ id âm (từ ngoài từ điển) hợp lệ', () => {
  const b = chuanBanGhi({ ...the(-123456789), khoa: 'ja--123456789' }, BAY_GIO);
  assert.ok('capNhat' in b);
});

test('sổ + ngày + bia mộ', () => {
  const s = chuanBanGhi({ loai: 'so', khoa: 'A1B2-C3', capNhat: '2026-11-15T09:00:00Z', duLieu: { ten: '  Từ khó  ', nn: 'zh', taoLuc: '2026-11-10T00:00:00Z' } }, BAY_GIO);
  assert.ok('capNhat' in s && (s.duLieu as any).ten === 'Từ khó' && (s.duLieu as any).nguon === null);
  assert.match((chuanBanGhi({ loai: 'so', khoa: 'x', capNhat: '2026-11-15T09:00:00Z', duLieu: { ten: '', nn: 'zh', taoLuc: '2026-11-10T00:00:00Z' } }, BAY_GIO) as { ly: string }).ly, /ten/);
  const n = chuanBanGhi({ loai: 'ngay', khoa: '2026-11-15', capNhat: '2026-11-15T09:00:00Z' }, BAY_GIO);
  assert.ok('capNhat' in n && n.xoa === false);
  assert.match((chuanBanGhi({ loai: 'ngay', khoa: '2026-11-15', capNhat: '2026-11-15T09:00:00Z', xoa: true }, BAY_GIO) as { ly: string }).ly, /không xoá/);
  assert.match((chuanBanGhi({ loai: 'ngay', khoa: '2026-13-01', capNhat: '2026-11-15T09:00:00Z' }, BAY_GIO) as { ly: string }).ly, /khoa sai/);
  const x = chuanBanGhi({ loai: 'the', khoa: 'en-5', capNhat: '2026-11-15T09:00:00Z', xoa: true }, BAY_GIO);
  assert.ok('capNhat' in x && x.xoa && x.duLieu === null);
});

test('đồng hồ máy lệch về tương lai ⇒ capNhat kéo về bây giờ (không thắng mãi)', () => {
  const b = chuanBanGhi(the(1, '2030-01-01T00:00:00Z'), BAY_GIO);
  assert.ok('capNhat' in b && b.capNhat.getTime() === BAY_GIO.getTime());
  const gan = chuanBanGhi(the(1, '2026-11-15T10:01:00Z'), BAY_GIO);   // lệch 1 phút: giữ nguyên
  assert.ok('capNhat' in gan && gan.capNhat.toISOString() === '2026-11-15T10:01:00.000Z');
});

test('lô: bản trùng khoá giữ bản mới nhất, bản sai vào danh sách lỗi', () => {
  const { nhan, loi } = chuanLo([the(1, '2026-11-15T08:00:00Z'), the(1, '2026-11-15T09:00:00Z', { lanDung: 7 }), the(1, '2026-11-15T07:00:00Z'), { loai: 'the' }], BAY_GIO);
  assert.equal(nhan.length, 1);
  assert.equal((nhan[0].duLieu as any).lanDung, 7);
  assert.equal(loi.length, 1);
  assert.deepEqual(chuanLo('x').loi.length, 1);
});

const vao = (loai: 'the' | 'so', khoa: string, cap: string, xoa = false): BanGhiVao => ({ loai, khoa, capNhat: new Date(cap), xoa, duLieu: xoa ? null : {} });
const k = (l: string, kh: string) => `${l}\u0000${kh}`;

test('mới hơn thắng: cũ hơn / bằng giờ ⇒ bỏ qua; mới hơn ⇒ ghi', () => {
  const co: BanGhiCo = { capNhat: new Date('2026-11-15T09:00:00Z'), xoa: false };
  assert.equal(thang({ capNhat: new Date('2026-11-15T08:59:59Z') }, co), false);
  assert.equal(thang({ capNhat: new Date('2026-11-15T09:00:00Z') }, co), false);
  assert.equal(thang({ capNhat: new Date('2026-11-15T09:00:00.001Z') }, co), true);
  assert.equal(thang({ capNhat: new Date(0) }, undefined), true);
});

test('xung đột hai máy: bia mộ mới hơn xoá thẻ; thẻ sửa sau khi xoá thì sống lại', () => {
  const co = new Map<string, BanGhiCo>([[k('the', 'ja-1'), { capNhat: new Date('2026-11-15T09:00:00Z'), xoa: false }]]);
  const r1 = apTran([vao('the', 'ja-1', '2026-11-15T09:30:00Z', true)], co, { the: 1, so: 0, ngay: 0 }, 1);
  assert.equal(r1.ghi.length, 1);
  const co2 = new Map<string, BanGhiCo>([[k('the', 'ja-1'), { capNhat: new Date('2026-11-15T09:30:00Z'), xoa: true }]]);
  assert.equal(apTran([vao('the', 'ja-1', '2026-11-15T09:10:00Z')], co2, { the: 0, so: 0, ngay: 0 }, 1).boQua, 1);
  assert.equal(apTran([vao('the', 'ja-1', '2026-11-15T09:40:00Z')], co2, { the: 0, so: 0, ngay: 0 }, 1).ghi.length, 1);
});

test('trần: mục mới vượt trần bị từ chối từng mục; xoá trong cùng lô giải phóng chỗ trước; sửa mục đã có luôn được', () => {
  const tran = GIOI_HAN_SO_TU.so;
  const co = new Map<string, BanGhiCo>([[k('so', 'cu'), { capNhat: new Date('2026-11-01T00:00:00Z'), xoa: false }],
    [k('so', 'bo'), { capNhat: new Date('2026-11-01T00:00:00Z'), xoa: false }]]);
  const r = apTran([
    vao('so', 'moi1', '2026-11-15T09:00:00Z'), vao('so', 'moi2', '2026-11-15T09:00:00Z'),
    vao('so', 'cu', '2026-11-15T09:00:00Z'), vao('so', 'bo', '2026-11-15T09:00:00Z', true),
  ], co, { the: 0, so: tran, ngay: 0 }, tran);
  assert.deepEqual(r.ghi.map((b) => b.khoa).sort(), ['bo', 'cu', 'moi1']);
  assert.equal(r.day.length, 1);
  assert.match(r.day[0].ly, /CTL_SO_TU_DAY/);
});
