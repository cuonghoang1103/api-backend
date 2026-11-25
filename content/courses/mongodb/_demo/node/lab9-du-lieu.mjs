// Lab 9.5 — dữ liệu mẫu DÙNG CHUNG cho bản ngây thơ và bản của bạn. API gọi napDuLieu(db, bam) lúc khởi động.
// bam(matKhau) do API truyền vào: bản ngây thơ truyền (x) => x (lưu thô), bản đúng truyền hàm băm của mình.
// Trường lưu mật khẩu tên gì là việc của bạn — hàm trả về đối tượng { [tenTruong]: giaTri } qua bam().
export const TAI_KHOAN = [
  { _id: 1, email: 'admin@ctshop.vn', matKhau: 'Admin-Rat-Kho-Doan-2026', ten: 'Quản trị', vaiTro: 'admin' },
  { _id: 2, email: 'an@vd.vn', matKhau: 'an123456', ten: 'An', vaiTro: 'khach' },
  { _id: 3, email: 'binh@vd.vn', matKhau: 'binh2026', ten: 'Bình', vaiTro: 'khach' },
];
export const MA_DAT_LAI = 'k7Qm2xR9vL4p';     // mã đặt lại mật khẩu đang chờ của admin (gửi qua email thật trong đời thực)

export async function napDuLieu(db, bam) {
  await db.dropDatabase();
  await db.collection('users').insertMany(TAI_KHOAN.map(({ matKhau, ...u }) => ({ ...u, ...bam(matKhau) })));
  await db.collection('don').insertMany([
    { _id: 'DH001', khach: 2, sdt: '0901000002', sp: 'Áo thun', tong: 199000, trangThai: 'CHO_THANH_TOAN', ghiChu: '' },
    { _id: 'DH002', khach: 3, sdt: '0901000003', sp: 'Giày', tong: 899000, trangThai: 'CHO_THANH_TOAN', ghiChu: '' },
    { _id: 'DH003', khach: 2, sdt: '0901000002', sp: 'Mũ', tong: 99000, trangThai: 'DA_GIAO', ghiChu: '' },
    ...Array.from({ length: 300 }, (_, i) => ({ _id: `DX${String(i).padStart(3, '0')}`, khach: 3, sdt: '0901000003',
      sp: 'a'.repeat(20) + '!', tong: 1000, trangThai: 'DA_GIAO', ghiChu: '' })),
  ]);
}
