// Bài 6.2 — như chuyen-tho.js (Bài 6.1) nhưng mỗi lần chuyển là MỘT transaction. VAI=ghi: 3000 lần chuyển; VAI=doc: đọc tổng 3000 lần.
// Chạy: docker exec mgo-lab mongosh --quiet ch6 --eval "const VAI='ghi'" --file /demo/chuyen-tx.js & (VAI='doc' song song)
if (VAI === 'ghi') {
  const s = db.getMongo().startSession();
  const T = s.getDatabase(db.getName());
  const t0 = Date.now();
  for (let i = 0; i < 3000; i++) {
    const [tu, den] = i % 2 ? ['A', 'B'] : ['B', 'A'];
    s.withTransaction(() => {
      T.tk.updateOne({ _id: tu }, { $inc: { du: -1000 } });
      T.tk.updateOne({ _id: den }, { $inc: { du: 1000 } });
    });
  }
  print(`ghi: xong 3000 lần chuyển (transaction) trong ${Date.now() - t0} ms`);
} else {
  let lech = 0;
  for (let i = 0; i < 3000; i++) {
    const tong = db.tk.find().toArray().reduce((s, t) => s + t.du, 0);
    if (tong !== 2000000) lech++;
  }
  print(`đọc: 3000 lần, ${lech} lần tổng ≠ 2.000.000`);
}
