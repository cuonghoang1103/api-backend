/**
 * Thẻ "100 Ngày Database" — Ngày 23: Dị thường dữ liệu (động lực chuẩn hoá).
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-23.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day23:
 *   update anomaly: sửa sđt 1 dòng, sót dòng kia -> An có CẢ 0901 lẫn 0999
 *   delete anomaly: xoá đơn duy nhất của Binh -> mất luôn Binh
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 23,
  total: 100,
  titleLead: 'DB Day 23:',
  titleAccent: 'Dị thường dữ liệu',
  subtitle: 'Vì sao bảng "gộp tất cả" tự làm dữ liệu mâu thuẫn — động lực chuẩn hoá ⚠️',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'pink',
      title: '1. DƯ THỪA: THÔNG TIN LẶP 🔁',
      code: `don_id khach_ten khach_sdt  san_pham
  1    An        0901      Ban phim
  2    An        0901      Chuot      <- sđt lặp!
  3    Binh      0902      Man hinh`,
      notes: [
        { mark: 'ok', text: 'Nhồi mọi thứ vào 1 bảng → thông tin khách lặp ở MỖI đơn' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. DỊ THƯỜNG SỬA (UPDATE) ✏️',
      code: `UPDATE ... SET khach_sdt='0999' WHERE don_id=1;
-- quên don_id=2 -> An có CẢ 0901 LẪN 0999`,
      notes: [
        { mark: 'ok', text: 'Sửa một chỗ, sót chỗ khác → dữ liệu TỰ MÂU THUẪN, không biết tin cái nào' },
      ],
    },
    {
      tone: 'pink',
      title: '3. DỊ THƯỜNG XOÁ (DELETE) 🗑️',
      code: `DELETE ... WHERE don_id=3;  -- đơn duy nhất của Binh
-- -> mất LUÔN thông tin khách Binh!`,
      notes: [
        { mark: 'ok', text: 'Xoá đơn cuối của một khách → xoá nhầm cả khách (dù họ vẫn là khách)' },
      ],
    },
    {
      tone: 'green',
      title: '4. DỊ THƯỜNG THÊM + LỜI GIẢI ✅',
      code: `-- Không thêm được khách MỚI chưa có đơn (thiếu don_id)
-- GIẢI: TÁCH bảng khach_hang | don_hang`,
      notes: [
        { mark: 'ok', text: 'Gốc bệnh: một bảng ôm nhiều "chủ đề". Thuốc: tách thành nhiều bảng = CHUẨN HOÁ' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Dị thường là lỗi THIẾT KẾ, hệ nào cũng dính (PG/SQL Server) — chữa bằng chuẩn hoá' },
        { mark: 'next', text: '**Ngày 24**: 1NF — mỗi ô một giá trị nguyên tử, bỏ nhóm lặp' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '0) DU THUA: sdt cua An (0901) luu 2 lan (don 1 va 2)',
      '1) UPDATE sdt WHERE don_id=1 (quen don 2) -> An co CA 0901 LAN 0999  (mau thuan!)',
      '2) DELETE don_id=3 (don duy nhat cua Binh) -> chi con An; Binh BIEN MAT',
      '   -> mot bang "gop tat ca" gay du thua + di thuong sua/xoa/them',
    ],
  },
};
