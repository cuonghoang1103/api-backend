// Lab 7.6 — LỜI GIẢI. Bốn ý, mỗi ý một bài của Chương 6–7:
//  (1) w:majority — lần ghi đã báo thành công thì nằm trên đa số, không bao giờ bị rollback (Bài 6.3);
//  (2) _id = mã đơn — thử lại bao nhiêu lần cũng chỉ một tài liệu; E11000 ở lần thử lại nghĩa là lần trước ĐÃ ghi (Bài 2.1, 6.5);
//  (3) lỗi mạng / hết giờ / primary nhường chức = "chưa biết" ⇒ thử lại CÙNG _id, giãn dần, hạn 60 s mới báo khách thất bại (Bài 7.2);
//  (4) socketTimeoutMS + connectTimeoutMS: socket chết im lặng, hay lần nối lại tới máy đã mất, không giữ yêu cầu hàng chục giây (Bài 7.2).
export const URI = 'mongodb://r1:27017,r2:27017,r3:27017/ct7?replicaSet=rs1&w=majority&retryWrites=true&socketTimeoutMS=5000&connectTimeoutMS=5000&serverSelectionTimeoutMS=15000';
const ngu = (ms) => new Promise((r) => setTimeout(r, ms));

export async function datDon(don, maDon, log) {
  const han = Date.now() + 60_000;
  for (let lan = 1; ; lan++) {
    try { await don.insertOne({ _id: maDon, maDon, luc: new Date() }); return true; }
    catch (e) {
      if (e.code === 11000) return true;            // lần thử trước đã ghi xong — đơn này có rồi
      log(e, ' ⇒ thử lại cùng _id');
      if (Date.now() > han) return false;           // thật sự không ghi được trong 60 s ⇒ báo khách thất bại (và đơn KHÔNG có trong DB)
      await ngu(Math.min(200 * lan, 2000));
    }
  }
}
