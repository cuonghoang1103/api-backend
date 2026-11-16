/** npx tsx --test src/services/ctlanguage/vongQuayThuan.test.ts */
import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import {
  anTen, chonQua, chuoiDenHomNay, conChoThemLuot, datMucTieu, QUA_VONG_QUAY, tinhLuot, TRAN_LUOT_THUONG,
} from './vongQuayThuan.js';

const dk = (o: Partial<{ datMucTieu: boolean; chuoi: number; phutHomNay: number; mucTieu: number }> = {}) =>
  ({ datMucTieu: false, chuoi: 1, phutHomNay: 3, mucTieu: 15, ...o });

test('bánh xe: đúng 8 ô, tỉ lệ cộng đủ 100, quà chỉ là đồ trong app (không ô nào là tiền / Pro / giảm giá)', () => {
  assert.equal(QUA_VONG_QUAY.length, 8);
  assert.equal(QUA_VONG_QUAY.reduce((s, q) => s + q.tiLe, 0), 100);
  for (const q of QUA_VONG_QUAY) assert.doesNotMatch(`${q.ma} ${q.nhan}`, /pro|giảm|%|đ\b|vnd|₫|tiền/i);
  assert.equal(new Set(QUA_VONG_QUAY.map((q) => q.ma)).size, 8);
});

test('chonQua: phân bố theo tỉ lệ công bố (mô phỏng đều 100.000 điểm)', () => {
  const dem = new Array(8).fill(0);
  const N = 100_000;
  for (let k = 0; k < N; k++) dem[chonQua((k + 0.5) / N)]++;
  QUA_VONG_QUAY.forEach((q, i) => assert.ok(Math.abs(dem[i] / N * 100 - q.tiLe) < 0.01, `${q.ma}: ${dem[i]}`));
  assert.equal(chonQua(0), 0);
  assert.equal(chonQua(1), 7);
  assert.equal(chonQua(-3), 0);
});

test('chonQua: hết trần lượt thưởng ⇒ ô "Thêm 1 lượt" không bao giờ ra', () => {
  const iThem = QUA_VONG_QUAY.findIndex((q) => q.ma === 'them-luot');
  for (let k = 0; k < 10_000; k++) assert.notEqual(chonQua(k / 10_000, false), iThem);
});

test('tinhLuot: ngày mới chỉ có 1 lượt miễn phí; quay rồi ⇒ hết', () => {
  const a = tinhLuot([], dk());
  assert.equal(a.con, 1);
  assert.deepEqual(a.tiep, { nguon: 'ngay', stt: 1 });
  const b = tinhLuot([{ nguon: 'ngay', stt: 1, qua: 'xu-10' }], dk());
  assert.equal(b.con, 0);
  assert.equal(b.tiep, null);
  assert.equal(b.chiTiet.find((c) => c.nguon === 'muc-tieu')!.goiY, 'Học thêm 12 phút nữa');
});

test('tinhLuot: đạt mục tiêu +1, chuỗi chạm mốc 7 +1, không chạm mốc thì không', () => {
  assert.equal(tinhLuot([], dk({ datMucTieu: true })).con, 2);
  assert.equal(tinhLuot([], dk({ datMucTieu: true, chuoi: 7 })).con, 3);
  assert.equal(tinhLuot([], dk({ chuoi: 14 })).con, 2);
  assert.equal(tinhLuot([], dk({ chuoi: 8 })).con, 1);
  assert.equal(tinhLuot([], dk({ chuoi: 0 })).con, 1);
  assert.equal(tinhLuot([], dk({ chuoi: 8 })).chiTiet.find((c) => c.nguon === 'chuoi-7')!.goiY, 'Còn 6 ngày tới mốc 14');
  const sau = tinhLuot([{ nguon: 'ngay', stt: 1, qua: 'xu-10' }], dk({ datMucTieu: true }));
  assert.deepEqual(sau.tiep, { nguon: 'muc-tieu', stt: 1 });
});

test('tinhLuot: ô "Thêm 1 lượt" cho lượt thưởng, trần 2/ngày', () => {
  const r1 = tinhLuot([{ nguon: 'ngay', stt: 1, qua: 'them-luot' }], dk());
  assert.equal(r1.con, 1);
  assert.deepEqual(r1.tiep, { nguon: 'thuong', stt: 1 });
  const da = [
    { nguon: 'ngay', stt: 1, qua: 'them-luot' }, { nguon: 'thuong', stt: 1, qua: 'them-luot' },
    { nguon: 'thuong', stt: 2, qua: 'them-luot' },
  ];
  assert.equal(tinhLuot(da, dk()).con, 0, 'trúng 3 lần "thêm lượt" vẫn chỉ được 2 lượt thưởng');
  assert.equal(conChoThemLuot(da.slice(0, TRAN_LUOT_THUONG)), false);
  assert.equal(conChoThemLuot(da.slice(0, 1)), true);
});

test('chuoiDenHomNay: đếm lùi liên tiếp từ hôm nay; hôm nay chưa học ⇒ 0; qua ranh tháng', () => {
  assert.equal(chuoiDenHomNay(['2026-11-16', '2026-11-15', '2026-11-14', '2026-11-12'], '2026-11-16'), 3);
  assert.equal(chuoiDenHomNay(['2026-11-15'], '2026-11-16'), 0);
  assert.equal(chuoiDenHomNay(['2026-03-01', '2026-02-28', '2026-02-27'], '2026-03-01'), 3);
});

test('datMucTieu: theo mục tiêu riêng từng ngôn ngữ; chưa có hồ sơ ⇒ 15 phút', () => {
  assert.deepEqual(datMucTieu({ ja: 600 }, { ja: 10 }, 'ja'), { dat: true, phut: 10, mucTieu: 10 });
  assert.deepEqual(datMucTieu({ ja: 540 }, { ja: 10 }, 'ja'), { dat: false, phut: 9, mucTieu: 10 });
  assert.equal(datMucTieu({ en: 15 * 60 }, {}, 'ja').dat, true);
  assert.deepEqual(datMucTieu({}, {}, 'zh'), { dat: false, phut: 0, mucTieu: 15 });
});

test('anTen: chỉ tên + chữ cái đầu họ', () => {
  assert.equal(anTen('Hoàng Văn Cường'), 'Cường H.');
  assert.equal(anTen('minh'), 'Minh');
  assert.equal(anTen('  '), 'Một bạn học');
  assert.equal(anTen(null), 'Một bạn học');
});
