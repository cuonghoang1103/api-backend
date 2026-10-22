/**
 * Khung chương trình đào tạo /courses + tệp gán `scripts/chuong-trinh-15-ky.json` phải khớp nhau.
 *   npx tsx --test src/config/chuongTrinhKhoaHoc.test.ts
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { KY_HOC, NAM_HOC, SO_KY, kyHopLe, xepChuongTrinh } from './chuongTrinhKhoaHoc.js';
import { docLoTrinh, dongGoiMonChuongTrinh } from '../routes/course.routes.js';

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const khung = JSON.parse(readFileSync(path.join(goc, 'scripts/chuong-trinh-15-ky.json'), 'utf8')) as Array<{
  ky: number; nam: number; ten: string; mon: Array<{ thuTu: number; slug: string }>;
}>;

test('15 kỳ, 4 năm (3 + 4 + 4 + 4), số kỳ liền 1..15', () => {
  assert.equal(SO_KY, 15);
  assert.deepEqual(KY_HOC.map((k) => k.so), Array.from({ length: 15 }, (_, i) => i + 1));
  assert.deepEqual(NAM_HOC.map((n) => n.so), [1, 2, 3, 4]);
  const demTheoNam = NAM_HOC.map((n) => KY_HOC.filter((k) => k.nam === n.so).length);
  assert.deepEqual(demTheoNam, [3, 4, 4, 4]);
});

test('mọi năm/kỳ có đủ chữ VI + EN (trang song ngữ, app iOS đọc cả hai)', () => {
  for (const x of [...NAM_HOC, ...KY_HOC]) {
    for (const k of ['ten', 'tenEn', 'moTa', 'moTaEn'] as const) {
      assert.ok(x[k].trim().length > 2, `thiếu ${k} ở ${x.so}`);
    }
  }
});

test('JSON gán khớp khung: 15 kỳ × 5 khoá, 75 slug không trùng, đúng năm + đúng tên kỳ', () => {
  assert.equal(khung.length, 15);
  const slugs = khung.flatMap((k) => k.mon.map((m) => m.slug));
  assert.equal(slugs.length, 75);
  assert.equal(new Set(slugs).size, 75, 'một khoá chỉ được ở MỘT kỳ');
  for (const k of khung) {
    const cfg = KY_HOC.find((x) => x.so === k.ky);
    assert.ok(cfg, `kỳ ${k.ky} không có trong cấu hình`);
    assert.equal(k.nam, cfg.nam, `kỳ ${k.ky}: năm lệch`);
    assert.equal(k.ten, cfg.ten, `kỳ ${k.ky}: tên lệch giữa JSON và config`);
    assert.deepEqual(k.mon.map((m) => m.thuTu), [1, 2, 3, 4, 5]);
  }
});

test('kyHopLe: chỉ số nguyên 1..15', () => {
  for (const ok of [1, 7, 15]) assert.ok(kyHopLe(ok));
  for (const sai of [0, 16, 1.5, '3', null, undefined, NaN]) assert.ok(!kyHopLe(sai));
});

test('xepChuongTrinh: xếp theo kỳ + thứ tự; kỳ lệch/không có ⇒ chuaXep (không bao giờ mất khoá)', () => {
  const m = (title: string, ky: number | null, tt: number | null) => ({ title, loTrinhKy: ky, loTrinhThuTu: tt });
  const ds = [
    m('B', 1, 2), m('A', 1, 1), m('C', 1, null), m('Moi', null, null), m('Lech', 99, 1), m('K15', 15, 1),
  ];
  const { nam, chuaXep } = xepChuongTrinh(ds);
  assert.equal(nam.length, 4);
  assert.equal(nam.flatMap((n) => n.ky).length, 15);
  const ky1 = nam[0]!.ky[0]!;
  assert.equal(ky1.so, 1);
  assert.deepEqual(ky1.mon.map((x) => x.title), ['A', 'B', 'C'], 'thuTu tăng dần, NULL xuống cuối');
  assert.deepEqual(nam[3]!.ky.at(-1)!.mon.map((x) => x.title), ['K15']);
  assert.deepEqual(chuaXep.map((x) => x.title), ['Moi', 'Lech']);
  // Kỳ trống vẫn có mặt (mon: []) — giao diện tự quyết ẩn/hiện, hợp đồng không đổi hình.
  assert.equal(nam[1]!.ky[0]!.mon.length, 0);
});

const hang = {
  id: 1, slug: 'react', title: 'React|||React', courseCode: null, shortDescription: null, thumbnailUrl: null,
  price: { toString: () => '0', valueOf: () => '0' } as unknown, discountPrice: null, isFree: true,
  level: 'BEGINNER', language: 'Vietnamese', totalLessons: 40, totalDurationSeconds: 3600,
  avgRating: '4.50' as unknown, totalReviews: 2, loTrinhKy: 3, loTrinhThuTu: 2, createdAt: new Date(),
  category: { name: 'Frontend', slug: 'frontend' }, _count: { enrollments: 9 },
};

test('dongGoiMonChuongTrinh: số là SỐ (iOS khai Double), tiến độ null khi chưa ghi danh, trần 100%', () => {
  const a = dongGoiMonChuongTrinh(hang);
  assert.equal(typeof a.price, 'number');
  assert.equal(a.avgRating, 4.5);
  assert.equal(a.totalStudents, 9);
  assert.equal(a.isEnrolled, false);
  assert.equal(a.progress, null);
  assert.ok(!('_count' in a) && !('category' in a));
  assert.equal(dongGoiMonChuongTrinh(hang, { soBaiXong: 10 }).progress, 25);
  assert.equal(dongGoiMonChuongTrinh(hang, { soBaiXong: 99 }).progress, 100);
  assert.equal(dongGoiMonChuongTrinh({ ...hang, totalLessons: 0 }, { soBaiXong: 3 }).progress, 0);
});

test('docLoTrinh (admin): chỉ trả trường có gửi; rỗng ⇒ null; sai ⇒ 400', () => {
  assert.deepEqual(docLoTrinh({}), {});
  assert.deepEqual(docLoTrinh({ loTrinhKy: '4', loTrinhThuTu: 2 }), { loTrinhKy: 4, loTrinhThuTu: 2 });
  assert.deepEqual(docLoTrinh({ loTrinhKy: '', loTrinhThuTu: null }), { loTrinhKy: null, loTrinhThuTu: null });
  assert.throws(() => docLoTrinh({ loTrinhKy: 16 }), /1–15/);
  assert.throws(() => docLoTrinh({ loTrinhKy: 'abc' }), /1–15/);
  assert.throws(() => docLoTrinh({ loTrinhThuTu: 0 }), /1–99/);
});
