// Bài 6.1 — chuyển tiền KHÔNG transaction: hai updateOne rời nhau. VAI=ghi: 3000 lần chuyển 1.000 đ qua lại A ⇄ B.
// VAI=doc: cùng lúc đó đọc số dư hai tài khoản 3000 lần và đếm số lần tổng KHÁC 2.000.000 (tiền "bốc hơi" giữa hai lệnh).
// Chạy: docker exec mgo-lab mongosh --quiet ch6 --eval "const VAI='ghi'" --file /demo/chuyen-tho.js & (VAI='doc' song song)
if (VAI === 'ghi') {
  for (let i = 0; i < 3000; i++) {
    const [tu, den] = i % 2 ? ['A', 'B'] : ['B', 'A'];
    db.tk.updateOne({ _id: tu }, { $inc: { du: -1000 } });
    db.tk.updateOne({ _id: den }, { $inc: { du: 1000 } });
  }
  print('ghi: xong 3000 lần chuyển');
} else {
  let lech = 0, nhoNhat = Infinity;
  for (let i = 0; i < 3000; i++) {
    const tong = db.tk.find().toArray().reduce((s, t) => s + t.du, 0);
    if (tong !== 2000000) { lech++; nhoNhat = Math.min(nhoNhat, tong); }
  }
  print(`đọc: 3000 lần, ${lech} lần tổng ≠ 2.000.000` + (lech ? ` (thấp nhất ${nhoNhat})` : ''));
}
