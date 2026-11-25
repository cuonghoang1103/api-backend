// Q6 (1 điểm) — computed pattern: thêm soGheTrong (số ghế đang TRONG) cho MỌI suất, bằng MỘT lệnh chạy trên máy chủ.
db.suat.updateMany({}, [{ $set: { soGheTrong: { $size: { $filter: { input: '$ghe', cond: { $eq: ['$$this.trangThai', 'TRONG'] } } } } } }]);
