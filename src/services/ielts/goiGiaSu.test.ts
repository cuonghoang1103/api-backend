/**
 * Chấm chặt hơn mà công bằng — `hieuChinh` (04/10/2026). Số liệu lấy từ phép đo thật
 * qua Azure: giọng Việt đọc "I think this is the third one" (nuốt âm cuối).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hieuChinh, nhanXet, huongDan, tachAm } from './goiGiaSu.service.js';
import type { KetQuaPhatAm } from './phatAm.service.js';

const w = (tu: string, diem: number, am: number[], loi = 'None') => ({ tu, diem, loi, am: am.map((d) => ({ am: '', diem: d })) });

test('đọc chuẩn: điểm giữ nguyên', () => {
  const k: KetQuaPhatAm = { diem: { chinhXac: 97, troiChay: 100, dayDu: 100, tong: 98 }, ngheRa: '', tu: [w('think', 100, [100, 100, 100, 100]), w('this', 97, [97, 97, 97])] };
  const h = hieuChinh(k);
  assert.equal(h.diem.tong, 98);
  assert.deepEqual(h.tu.map((x) => x.diem), [100, 97]);
});

test('nuốt âm cuối kiểu Việt: từ bị kéo xuống, tổng giảm vừa phải', () => {
  const k: KetQuaPhatAm = {
    diem: { chinhXac: 85, troiChay: 100, dayDu: 100, tong: 91 }, ngheRa: '',
    tu: [w('I', 99, [99]), w('think', 91, [88, 65, 58, 29]), w('this', 88, [36, 69, 47]), w('is', 80, [80, 80]),
      w('the', 80, [80, 63]), w('third', 66, [47, 46, 45]), w('one', 96, [96, 96, 96])],
  };
  const h = hieuChinh(k);
  assert.deepEqual(h.tu.map((x) => x.diem), [99, 60, 62, 80, 80, 56, 96]);
  assert.equal(h.diem.tong, 76);
});

test('lệch nhẹ (mọi âm ≥ 60) không bị phạt', () => {
  const k: KetQuaPhatAm = { diem: { chinhXac: 80, troiChay: 90, dayDu: 100, tong: 84 }, ngheRa: '', tu: [w('she', 80, [80, 80]), w('sells', 88, [70, 90, 88, 75])] };
  assert.equal(hieuChinh(k).diem.tong, 84);
});

test('khen tiến bộ khi điểm tăng ≥ 5 so với lần trước', () => {
  const k: KetQuaPhatAm = { diem: { chinhXac: 70, troiChay: 90, dayDu: 100, tong: 72 }, ngheRa: '', tu: [w('think', 72, [80, 70, 75, 72])] };
  assert.match(nhanXet(k, { text: 'think' }, 2, 60).noi, /Từ 60 lên 72 điểm/);
  assert.doesNotMatch(nhanXet(k, { text: 'think' }, 2, 70).noi, /lên/);
});

test('hướng dẫn sâu: đuôi dz của "reads" (05/10/2026 — người dùng thật đọc mãi vẫn sai)', () => {
  const y = { tu: 'reads', am: 'z', diem: 12, cuoi: true, ipa: 'riːdz', amTu: tachAm('riːdz'), diemTu: 40 };
  const loi = huongDan(y);
  assert.match(loi, /Đuôi dz/);
  assert.match(loi, /zzz/);
});

test('hướng dẫn sâu: âm cuối đơn lẻ có cách đọc kiểu Việt; âm giữa từ dùng mẹo khẩu hình', () => {
  assert.match(huongDan({ tu: 'need', am: 'd', diem: 20, cuoi: true, ipa: 'niːd', amTu: tachAm('niːd'), diemTu: 50 }), /nuốt âm cuối.*đờ nhẹ/);
  assert.match(huongDan({ tu: 'think', am: 'θ', diem: 20, cuoi: false, ipa: 'θɪŋk', amTu: tachAm('θɪŋk'), diemTu: 50 }), /hai hàm răng/);
});

test('hướng dẫn sâu: âm /d/ yếu ở GIỮA đuôi "dz" (Azure hay chấm âm này) vẫn dạy cả cụm đuôi dz', () => {
  const loi = huongDan({ tu: 'reads', am: 'd', diem: 15, cuoi: false, ipa: 'riːdz', amTu: tachAm('riːdz'), diemTu: 40, viTri: 2 });
  assert.match(loi, /Đuôi dz/);
});
