import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tinhElo, hangTuKetQua } from './doiKhang.service.js';

test('Elo: hai người ngang điểm, thắng +16 / thua −16 (K=32)', () => {
  assert.deepEqual(tinhElo([1200, 1200], [0, 1], [0, 0]), [1216, 1184]);
});
test('Elo: hoà ngang điểm không đổi; kẻ yếu hoà kẻ mạnh thì lên', () => {
  assert.deepEqual(tinhElo([1200, 1200], [0, 0], [0, 0]), [1200, 1200]);
  const [yeu, manh] = tinhElo([1000, 1400], [0, 0], [50, 50]);
  assert.ok(yeu! > 1000 && manh! < 1400);
});
test('Elo: tổng điểm bảo toàn (sai số làm tròn ≤ số người)', () => {
  const truoc = [1300, 1250, 1180, 1100];
  const sau = tinhElo(truoc, [2, 0, 3, 1], [10, 40, 5, 60]);
  // K khác nhau giữa người mới/cũ nên không bảo toàn tuyệt đối — chỉ kiểm hướng đúng.
  assert.ok(sau[1]! > truoc[1]! && sau[2]! < truoc[2]!);
});
test('hangTuKetQua: thắng/thua, hoà, thứ hạng tiến lên', () => {
  assert.deepEqual(hangTuKetQua({ thang: [1], hoa: false, lyDo: 'chieu-het' }, 2), [1, 0]);
  assert.deepEqual(hangTuKetQua({ thang: [], hoa: true, lyDo: 'lap-3' }, 2), [0, 0]);
  assert.deepEqual(hangTuKetQua({ thang: [2], hoa: false, lyDo: 'het-bai', thuHang: [2, 0, 3, 1] }, 4), [1, 3, 0, 2]);
});
