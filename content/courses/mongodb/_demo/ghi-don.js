// Giả lập ứng dụng CT Shop đang nhận đơn (Chương 10). Dùng: mongosh ctshop --eval 'var TU=2001, SO=50, NHAN="sau-sao-luu"' /demo/ghi-don.js
// Đơn mới có _id TU..TU+SO-1, trạng thái PAID, gắn nhãn `nguon` để đếm lại sau khi khôi phục.
for (let i = 0; i < SO; i++) {
  db.orders.insertOne({
    _id: TU + i, customerId: 'KH' + String(1 + ((TU + i) % 200)).padStart(4, '0'), status: 'PAID',
    items: [{ productId: 'SP001', name: 'Áo thun CT Shop', price: Decimal128('199000'), qty: 1 }],
    total: Decimal128('199000'), shipTo: { city: 'Huế' }, createdAt: new Date(), nguon: NHAN,
  });
}
print(`${NHAN}: đã ghi ${SO} đơn (_id ${TU}–${TU + SO - 1})`);
