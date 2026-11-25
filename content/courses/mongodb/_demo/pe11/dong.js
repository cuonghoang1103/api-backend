// Bài thử đồng thời của Q5 — cham.sh chạy 4 bản CÙNG LÚC (biến P = 1..4, T0 = mốc giờ xuất phát chung, ms).
// Mỗi tiến trình đi qua 40 suất S0401–S0440 theo cùng thứ tự, ở mỗi suất thử đặt 2 ghế chồng lên ghế của tiến trình khác.
load(BAI + '/q5.js');
while (Date.now() < T0) sleep(2);
let duoc = 0, loi = 0;
const ds = P % 2 ? ['A1', 'A2'] : ['A2', 'A3'];
for (let i = 401; i <= 440; i++) {
  try { const r = datGhe(db, 'S0' + i, ds, 'K000' + P); if (r && r.ok) duoc++; } catch (e) { loi++; }
}
print(`  tiến trình ${P}: đặt được ${duoc} · lỗi ${loi}`);
