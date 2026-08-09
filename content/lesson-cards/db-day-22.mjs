/**
 * Thẻ "100 Ngày Database" — Ngày 22: Khoá (tự nhiên vs thay thế, tổng hợp).
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-22.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day22:
 *   UNIQUE ma_sku: trùng SKU-001 -> violates unique constraint "san_pham_ma_sku_key"
 *   composite PK (sv, mon): trùng (1,10) -> violates "dang_ky_pkey"
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 22,
  total: 100,
  titleLead: 'DB Day 22:',
  titleAccent: 'Khoá: tự nhiên vs thay thế',
  subtitle: 'Chọn định danh cho bảng: mã nghiệp vụ hay id tự sinh? 🔑',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. KHOÁ ỨNG VIÊN → KHOÁ CHÍNH 🗝️',
      code: `-- Cột nào định danh DUY NHẤT một dòng = khoá ứng viên
-- Chọn một cái làm PRIMARY KEY`,
      notes: [
        { mark: 'ok', text: 'Khoá chính: một cột (hoặc nhóm cột) định danh duy nhất, không NULL, bất biến' },
      ],
    },
    {
      tone: 'green',
      title: '2. TỰ NHIÊN vs THAY THẾ 🆔',
      code: `natural key : ma_sku='SKU-001'  (có sẵn, ý nghĩa)
surrogate  : id=1 (SERIAL/IDENTITY, tự sinh)`,
      notes: [
        { mark: 'ok', text: 'Tự nhiên: gọn, ý nghĩa — NHƯNG có thể đổi/tái dùng → phiền khi làm khoá' },
        { mark: 'dot', text: 'Thay thế: vô nghĩa nhưng BẤT BIẾN, an toàn để tham chiếu' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. THỰC HÀNH TỐT: DÙNG CẢ HAI ✅',
      code: `id     SERIAL PRIMARY KEY,     -- surrogate (nội bộ)
ma_sku TEXT NOT NULL UNIQUE     -- natural (nghiệp vụ)
-- trùng SKU -> unique constraint chặn`,
      notes: [
        { mark: 'ok', text: 'id thay thế làm PK để tham chiếu; `UNIQUE` khoá tự nhiên để chống trùng nghiệp vụ' },
      ],
    },
    {
      tone: 'pink',
      title: '4. KHOÁ TỔNG HỢP (COMPOSITE) 🔗',
      code: `PRIMARY KEY (sinh_vien_id, mon_hoc_id)
-- cặp (1,10) chỉ được đăng ký MỘT lần
-- (2,11) khác cặp -> OK`,
      notes: [
        { mark: 'ok', text: 'Khoá gồm NHIỀU cột — hay dùng cho bảng nối (mỗi cặp là duy nhất)' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'SQL Server: `IDENTITY` (surrogate) thay `SERIAL`; UNIQUE/composite PK y hệt' },
        { mark: 'next', text: '**Ngày 23**: dị thường dữ liệu — vì sao bảng "gộp tất cả" lại nguy hiểm' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) WHERE id=1 -> SKU-001 Ban phim ; WHERE ma_sku=SKU-002 -> Chuot  (ca hai dinh danh)',
      '2) chen ma_sku SKU-001 trung -> ERROR: violates unique constraint "san_pham_ma_sku_key"',
      '3) composite PK: chen (1,10) lai -> ERROR: violates "dang_ky_pkey" Key (sinh_vien_id, mon_hoc_id)=(1,10)',
      '4) khac cap (2,11) -> INSERT OK ; con lai 4 dong',
    ],
  },
};
