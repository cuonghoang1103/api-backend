import { test } from 'node:test';
import assert from 'node:assert/strict';
import { xepLichThuan, type KhungLop, type ViecXep } from './xepLich.js';

// Thứ Sáu 02/10/2026 15:30 giờ VN = 08:30 UTC.
const NOW = new Date('2026-10-02T08:30:00Z');
const vn = (d: Date) => new Date(d.getTime() + 7 * 3_600_000).toISOString().slice(0, 16).replace('T', ' ');
const lop: KhungLop[] = [
  { thu: 1, batDau: '12:50', ketThuc: '15:10', maMon: 'LAB211' },
  { thu: 4, batDau: '15:20', ketThuc: '17:40', maMon: 'LAB211' },
  { thu: 5, batDau: '07:30', ketThuc: '09:50', maMon: 'JPD123' },
];
const v = (id: number, han: string, phut: number, o: Partial<ViecXep> = {}): ViecXep =>
  ({ id, maMon: 'FER202', tieuDe: `việc ${id}`, hanChot: new Date(han), thoiLuongPhut: phut, trongSo: 1, ...o });

test('xếp sau giờ hiện tại, né bữa tối, có nghỉ 10 phút', () => {
  const kq = xepLichThuan([v(1, '2026-10-02T16:59:59Z', 60), v(2, '2026-10-02T16:59:59Z', 60), v(3, '2026-10-02T16:59:59Z', 60)], lop, NOW);
  assert.equal(vn(kq.get(1)!), '2026-10-02 15:35');
  assert.equal(vn(kq.get(2)!), '2026-10-02 16:45');
  // 17:55 + 60 = 18:55 đè bữa tối 18:30 ⇒ sang 19:25
  assert.equal(vn(kq.get(3)!), '2026-10-02 19:25');
});

test('việc LÊN LỚP đặt đúng slot lớp của môn ngày hạn', () => {
  const kq = xepLichThuan([v(9, '2026-10-08T16:59:59Z', 140, { maMon: 'LAB211', tieuDe: 'P0071 — LÊN LỚP slot 4' })], lop, NOW);
  assert.equal(vn(kq.get(9)!), '2026-10-08 15:20');
});

test('né giờ lớp (+30 phút đi lại) và trần 360 phút/ngày thường', () => {
  // Thứ Hai 05/10: lớp 12:50–15:10 ⇒ bận 12:20–15:40
  const now = new Date('2026-10-05T04:00:00Z'); // 11:00 VN
  const kq = xepLichThuan([v(1, '2026-10-05T16:59:59Z', 90), v(2, '2026-10-05T16:59:59Z', 300)], lop, now);
  assert.equal(vn(kq.get(1)!), '2026-10-05 15:50');
  // 90 + 300 > 360 nhưng hạn là HÔM NAY ⇒ bù đêm (bỏ qua trần): 19:25 → 00:25, không đẩy sang hôm sau
  assert.equal(vn(kq.get(2)!), '2026-10-05 19:25');
});

test('khối cố định được né', () => {
  const kq = xepLichThuan([v(1, '2026-10-03T16:59:59Z', 30)], lop, NOW, {}, [{ bd: new Date('2026-10-02T08:35:00Z'), phut: 60 }]);
  assert.equal(vn(kq.get(1)!), '2026-10-02 16:45');
});

test('cùng ngày hạn: giữ thứ tự kế hoạch (id), không xếp theo trọng số', () => {
  const kq = xepLichThuan([v(5, '2026-10-02T16:59:59Z', 30, { trongSo: 1 }), v(6, '2026-10-02T16:59:59Z', 30, { trongSo: 5 })], lop, NOW);
  assert.ok(kq.get(5)! < kq.get(6)!);
});

test('hạn hôm nay mà không kịp trước 23:45 ⇒ bù đêm 00:00–05:00, không đẩy sang ngày sau', () => {
  const muon = new Date('2026-10-02T16:00:00Z'); // 23:00 VN thứ Sáu
  const kq = xepLichThuan([v(1, '2026-10-02T16:59:59Z', 60)], lop, muon);
  // 23:05 + 60' = 00:05 vượt 23:45 ⇒ vẫn làm tiếp trong khung bù đêm, không dời sang 07:00 hôm sau
  assert.equal(vn(kq.get(1)!), '2026-10-02 23:05');
});

test('nhiều việc bù đêm không chồng lên nhau', () => {
  const muon = new Date('2026-10-02T16:00:00Z'); // 23:00 VN
  const kq = xepLichThuan([v(1, '2026-10-02T16:59:59Z', 60), v(2, '2026-10-02T16:59:59Z', 60), v(3, '2026-10-02T16:59:59Z', 60)], lop, muon);
  assert.equal(vn(kq.get(1)!), '2026-10-02 23:05');
  assert.equal(vn(kq.get(2)!), '2026-10-03 00:15');
  assert.equal(vn(kq.get(3)!), '2026-10-03 01:25');
});

test('cùng ngày: xen kẽ môn theo ưu tiên, trong môn giữ thứ tự', () => {
  const han = '2026-10-02T16:59:59Z';
  const kq = xepLichThuan([
    v(1, han, 30, { maMon: 'FER202', uuTienMon: 2 }), v(2, han, 30, { maMon: 'FER202', uuTienMon: 2 }),
    v(3, han, 30, { maMon: 'LAB211', uuTienMon: 0 }), v(4, han, 30, { maMon: 'LAB211', uuTienMon: 0 }),
  ], lop, NOW);
  const thuTu = [...kq.entries()].sort((a, b) => a[1].getTime() - b[1].getTime()).map(([id]) => id);
  assert.deepEqual(thuTu, [3, 1, 4, 2]);
});
