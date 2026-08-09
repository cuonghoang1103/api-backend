/**
 * Thẻ "100 Ngày Database" — Ngày 25: 2NF (dạng chuẩn 2).
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-25.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day25:
 *   khoá (don_id, san_pham_id), san_pham_ten phụ thuộc bộ phận -> 'Ban phim' lặp
 *   2NF (tách san_pham): đổi tên 1 lần -> mọi dòng đồng nhất 'Ban phim co'
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 25,
  total: 100,
  titleLead: 'DB Day 25:',
  titleAccent: '2NF — bỏ phụ thuộc bộ phận',
  subtitle: 'Cột không được chỉ phụ thuộc MỘT PHẦN của khoá tổng hợp 🧩',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. 2NF = 1NF + KHÔNG PHỤ THUỘC BỘ PHẬN 📏',
      code: `-- Chỉ liên quan khi khoá là TỔNG HỢP
PRIMARY KEY (don_id, san_pham_id)
-- mọi cột khác phải phụ thuộc CẢ khoá`,
      notes: [
        { mark: 'ok', text: 'Phụ thuộc bộ phận = cột chỉ phụ thuộc MỘT phần của khoá tổng hợp' },
      ],
    },
    {
      tone: 'pink',
      title: '2. VI PHẠM: CỘT PHỤ THUỘC 1 PHẦN KHOÁ 🚫',
      code: `don_id san_pham_id san_pham_ten
  1       10        Ban phim
  2       10        Ban phim   <- lặp!
-- ten chỉ phụ thuộc san_pham_id`,
      notes: [
        { mark: 'ok', text: '`san_pham_ten` phụ thuộc mỗi `san_pham_id` → lặp ở mọi đơn có SP đó' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. HẬU QUẢ: ĐỔI TÊN SÓT → MÂU THUẪN ⚠️',
      code: `UPDATE ... WHERE don_id=1 AND san_pham_id=10;
-- sót đơn 2 -> SP 10 có CẢ 'Ban phim' LẪN 'Ban phim co'`,
      notes: [
        { mark: 'ok', text: 'Đúng loại dị thường sửa của Ngày 23, nhưng do phụ thuộc bộ phận' },
      ],
    },
    {
      tone: 'green',
      title: '4. SỬA 2NF: TÁCH RA BẢNG RIÊNG ✅',
      code: `san_pham(id PK, ten)         -- ten lưu MỘT chỗ
chi_tiet(don_id, san_pham_id FK, so_luong)
-- đổi tên 1 lần -> mọi dòng đồng nhất`,
      notes: [
        { mark: 'ok', text: 'Chuyển cột phụ thuộc bộ phận về bảng của "phần khoá" mà nó phụ thuộc' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Bảng khoá ĐƠN (1 cột) đã đạt 2NF sẵn — 2NF chỉ là vấn đề với khoá tổng hợp' },
        { mark: 'next', text: '**Ngày 26**: 3NF — bỏ phụ thuộc bắc cầu (cột phụ thuộc cột-không-khoá)' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) VI PHAM 2NF: san_pham_ten "Ban phim" lap cho san_pham_id=10 (don 1 & 2)',
      '2) doi ten SP 10 sot 1 dong -> san_pham_id 10 co CA "Ban phim" LAN "Ban phim co"',
      '3) 2NF (tach bang san_pham): UPDATE ten 1 lan ->',
      '     moi dong deu "Ban phim co"  (dong nhat, het di thuong)',
    ],
  },
};
