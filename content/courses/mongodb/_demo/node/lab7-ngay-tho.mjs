// Lab 7.6 — bản NGÂY THƠ (kiểu cấu hình "cho nhanh" hay gặp ở dự án cũ). Chạy: CHE_DO=ngay-tho node lab7.mjs
export const URI = 'mongodb://r1:27017,r2:27017,r3:27017/ct7?replicaSet=rs1&w=1&retryWrites=false';

export async function datDon(don, maDon, log) {
  try { await don.insertOne({ maDon, luc: new Date() }); return true; }
  catch (e) {
    log(e);
    // "Khách bấm Đặt lại": ứng dụng tạo lần ghi MỚI (_id mới) cho cùng mã đơn.
    try { await don.insertOne({ maDon, luc: new Date(), lanHai: true }); return true; } catch { return false; }
  }
}
