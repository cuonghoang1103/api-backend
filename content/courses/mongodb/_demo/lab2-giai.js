// LỜI GIẢI Lab Chương 2 (khoá MongoDB — cuongthai.com/courses/mongodb). Làm bài của bạn TRƯỚC rồi mới mở tệp này.
// Dùng trong mongosh:  use lab2  rồi  load('/demo/lab2-giai.js')
// Chưa dùng transaction (Chương 6): đặt hàng giữ chỗ từng món bằng cập nhật có điều kiện, món nào hụt thì HOÀN lại các món đã giữ.

// (1) Đơn của một khách, mới nhất trước, phân trang keyset theo (createdAt, _id). conTro = null cho trang đầu.
function donCuaKhach(khach, { trangThai, conTro = null, co = 5 } = {}) {
  const loc = { customerId: khach };
  if (trangThai) loc.status = trangThai;
  if (conTro) loc.$or = [{ createdAt: { $lt: conTro.createdAt } }, { createdAt: conTro.createdAt, _id: { $lt: conTro._id } }];
  const ds = db.orders.find(loc, { status: 1, total: 1, createdAt: 1, soMon: { $size: '$items' } })
    .sort({ createdAt: -1, _id: -1 }).limit(co + 1).toArray();   // lấy dư 1 để biết còn trang sau không
  const conNua = ds.length > co;
  if (conNua) ds.pop();
  const cuoi = ds[ds.length - 1];
  return { ds, conTroTiep: conNua ? { createdAt: cuoi.createdAt, _id: cuoi._id } : null };
}

// (2) Danh mục theo loại + khoảng giá, sắp theo tên kiểu tiếng Việt.
function timSanPham(loai, giaTu, giaDen) {
  return db.products.find({ category: loai, price: { $gte: Decimal128(String(giaTu)), $lte: Decimal128(String(giaDen)) } },
    { name: 1, price: 1, stock: 1 }).sort({ name: 1 }).collation({ locale: 'vi' }).toArray();
}

// (3) Đặt hàng: [{ productId, qty }]. Giữ chỗ từng món (nguyên tử trên từng tài liệu), hụt ⇒ hoàn lại, không tạo đơn.
function datHang(khach, mon) {
  const daGiu = [];
  for (const m of mon) {
    const sp = db.products.findOneAndUpdate({ _id: m.productId, stock: { $gte: m.qty } },
      { $inc: { stock: -m.qty } }, { projection: { name: 1, price: 1 }, returnDocument: 'after' });
    if (!sp) {
      for (const g of daGiu) db.products.updateOne({ _id: g.productId }, { $inc: { stock: g.qty } });
      return { ok: false, lyDo: `hết hàng: ${m.productId}`, daHoan: daGiu.map((g) => g.productId) };
    }
    daGiu.push({ productId: sp._id, name: sp.name, price: sp.price, qty: NumberInt(m.qty) });
  }
  const so = db.counters.findOneAndUpdate({ _id: 'orders' }, { $inc: { seq: 1 } }, { upsert: true, returnDocument: 'after' }).seq;
  const tong = daGiu.reduce((s, g) => s + Number(g.price.toString()) * g.qty, 0);
  const kh = db.customers.findOne({ _id: khach }, { city: 1 });
  db.orders.insertOne({ _id: so, customerId: khach, status: 'PENDING', items: daGiu, total: Decimal128(String(tong)),
    shipTo: { city: kh ? kh.city : null }, createdAt: new Date() });
  return { ok: true, donSo: so, tong };
}

// (4) Huỷ đơn: CHỈ khi đang PENDING (cập nhật có điều kiện), rồi trả hàng về kho bằng một bulkWrite.
function huyDon(so) {
  const don = db.orders.findOneAndUpdate({ _id: so, status: 'PENDING' }, { $set: { status: 'CANCELLED', cancelledAt: new Date() } });
  if (!don) return { ok: false, lyDo: 'không có đơn PENDING số ' + so };
  const r = db.products.bulkWrite(don.items.map((m) => ({ updateOne: { filter: { _id: m.productId }, update: { $inc: { stock: m.qty } } } })), { ordered: false });
  return { ok: true, traKho: r.modifiedCount };
}
