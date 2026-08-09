/**
 * Thẻ "100 Ngày Database" — Ngày 30: Ràng buộc nâng cao + thiết kế trọn schema (khép GĐ3).
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-30.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day30:
 *   CHECK "sp_gia_duong", CHECK "dh_trang_thai" (IN), composite PK, ON DELETE RESTRICT/CASCADE
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 30,
  total: 100,
  titleLead: 'DB Day 30:',
  titleAccent: 'Ràng buộc + thiết kế schema',
  subtitle: 'Gom mọi thứ GĐ3 thành một lược đồ hoàn chỉnh — khép Giai đoạn 3 🏛️',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. RÀNG BUỘC NÂNG CAO 🛡️',
      code: `gia INT CONSTRAINT sp_gia_duong CHECK (gia > 0)
trang_thai CHECK (trang_thai IN ('moi','huy',...))
PRIMARY KEY (don_id, san_pham_id)   -- tổ hợp`,
      notes: [
        { mark: 'ok', text: 'ĐẶT TÊN ràng buộc (`CONSTRAINT ten`) → lỗi rõ, dễ bắt trong app · `CHECK ... IN` giới hạn miền' },
      ],
    },
    {
      tone: 'green',
      title: '2. SCHEMA HOÀN CHỈNH 🏛️',
      code: `khach_hang -1-N- don_hang -1-N- chi_tiet_don
                              -N-1- san_pham
-- 4 bảng chuẩn hoá, khoá + ràng buộc đầy đủ`,
      notes: [
        { mark: 'ok', text: 'Ghép ER + khoá + chuẩn hoá (GĐ3) thành thiết kế thực tế' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. CHECK CHẶN DỮ LIỆU VÔ LÝ ✅',
      code: `chèn gia=-5 -> violates "sp_gia_duong"
chèn trang_thai='xyz' -> violates "dh_trang_thai"`,
      notes: [
        { mark: 'ok', text: 'Luật nghiệp vụ (giá dương, trạng thái hợp lệ) do CSDL tự cưỡng chế' },
      ],
    },
    {
      tone: 'pink',
      title: '4. ON DELETE: CASCADE vs RESTRICT 🔗',
      code: `xoá khách còn đơn -> CHẶN (RESTRICT)
xoá đơn -> chi tiết tự xoá (CASCADE) -> còn 0`,
      notes: [
        { mark: 'ok', text: 'Chọn hành vi xoá đúng nghiệp vụ: giữ toàn vẹn hay dọn theo' },
      ],
    },
    {
      tone: 'blue',
      title: '5. ✅ KHÉP GĐ3 → GĐ4',
      notes: [
        { mark: 'ok', text: 'GĐ3 xong: ER · khoá · dị thường · 1NF→BCNF · nhiều–nhiều · phi chuẩn · ràng buộc' },
        { mark: 'next', text: '**Ngày 31 (mở GĐ4)**: ngày, giờ & múi giờ (timezone) — kiểu dữ liệu sâu' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) CHECK gia>0: chen gia=-5 -> ERROR violates check constraint "sp_gia_duong"',
      '2) CHECK trang_thai IN: chen "xyz" -> ERROR violates check constraint "dh_trang_thai"',
      '3) composite PK: chen lai (don 1, sp 1) -> ERROR unique constraint "chi_tiet_don_pkey"',
      '4) ON DELETE RESTRICT: xoa khach con don -> ERROR (id=1 still referenced)',
      '5) ON DELETE CASCADE: xoa don 1 -> chi_tiet_con_lai = 0 (tu xoa theo)',
    ],
  },
};
