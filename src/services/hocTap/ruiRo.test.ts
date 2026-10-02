import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tinhRuiRoMon, tinhRuiRoKy, tuanHienTai, mucDoCua, type ViecTinh } from './ruiRo.js';

const NOW = new Date('2026-10-02T03:00:00Z');
const v = (o: Partial<ViecTinh>): ViecTinh => ({ trongSo: 1, hanChot: new Date('2026-10-10T00:00:00Z'), trangThai: 'CHUA_LAM', loai: 'BAI_HOC', diem: null, soLanTre: 0, ...o });

test('ví dụ của người dùng: tuần 4/10, chưa học gì ⇒ khoảng 40%', () => {
  const r = tinhRuiRoMon([], 3.5, 8, NOW);
  assert.ok(r.tyLe >= 35 && r.tyLe <= 50, `được ${r.tyLe}`);
  assert.equal(r.tienDo, 0);
});

test('vừa soạn kế hoạch (mọi hạn ở tương lai) KHÔNG làm tỷ lệ tụt', () => {
  const truoc = tinhRuiRoMon([], 3.5, 8, NOW).tyLe;
  const sau = tinhRuiRoMon(Array.from({ length: 20 }, () => v({})), 3.5, 8, NOW).tyLe;
  assert.equal(sau, truoc);
});

test('làm đúng lịch ⇒ xanh', () => {
  const viec = Array.from({ length: 10 }, (_, i) => v({ trangThai: i < 5 ? 'DAT' : 'CHUA_LAM' }));
  const r = tinhRuiRoMon(viec, 3.5, 8, NOW);
  assert.equal(r.mucDo, 'xanh');
});

test('quá hạn, nộp trễ, điểm luyện thấp đều cộng thêm và có lý do', () => {
  const viec = [
    v({ hanChot: new Date('2026-09-30T00:00:00Z') }),
    v({ trangThai: 'DAT', loai: 'PE', diem: 3, soLanTre: 2 }),
  ];
  const r = tinhRuiRoMon(viec, 3.5, 8, NOW);
  assert.equal(r.quaHan, 1);
  assert.equal(r.nopTre, 2);
  assert.equal(r.diemLuyenTB, 3);
  assert.equal(r.lyDo.length, 3); // đạt 50% > kỳ vọng 44% nên không có dòng "chậm"
});

test('kẹp trong 1..99', () => {
  const viec = Array.from({ length: 30 }, () => v({ hanChot: new Date('2026-09-01T00:00:00Z'), soLanTre: 3 }));
  assert.equal(tinhRuiRoMon(viec, 8, 8, NOW).tyLe, 99);
  assert.equal(tinhRuiRoMon([v({ trangThai: 'DAT' })], 0, 8, NOW).tyLe, 5);
});

test('cả kỳ không che môn tệ nhất', () => {
  assert.equal(tinhRuiRoKy([5, 5, 5, 70]).tyLe, 60);
  assert.equal(tinhRuiRoKy([]).tyLe, 0);
});

test('tuần hiện tại và mức màu', () => {
  assert.equal(tuanHienTai(new Date('2026-09-07T00:00:00Z'), 10, NOW), 4);
  assert.equal(mucDoCua(14), 'xanh');
  assert.equal(mucDoCua(50), 'do');
});

test('bỏ lỡ giờ học cộng 2 điểm mỗi việc, tối đa 20', () => {
  const goc = tinhRuiRoMon([v({}), v({})], 3.5, 8, NOW).tyLe;
  const sau = tinhRuiRoMon([v({ boLo: true }), v({ boLo: true })], 3.5, 8, NOW);
  assert.equal(sau.tyLe, goc + 4);
  assert.equal(sau.boLo, 2);
});
