// LỜI GIẢI Lab Chương 2 — nhiệm vụ 5: 4 tiến trình cùng lúc, mỗi tiến trình mua 1 chiếc SP027 hai lần (tồn đặt sẵn = 3).
// Chạy: for p in 1 2 3 4; do docker exec mgo-lab mongosh --quiet lab2 --file /demo/lab2-tranh.js & done; wait
load('/demo/lab2-giai.js');
for (let i = 0; i < 2; i++) {
  const r = datHang('KH0001', [{ productId: 'SP027', qty: 1 }]);
  print(r.ok ? 'được đơn ' + r.donSo : 'từ chối: ' + r.lyDo);
}
