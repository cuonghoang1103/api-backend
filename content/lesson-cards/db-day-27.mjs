/**
 * Thẻ "100 Ngày Database" — Ngày 27: BCNF (Boyce–Codd).
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-27.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day27:
 *   gv -> mon_hoc (gv không là khoá): "Thay Nam dạy CSDL" lặp 3 dòng
 *   BCNF (tách gv_mon): đổi môn 1 lần -> mọi dòng đồng nhất, không phạm luật
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 27,
  total: 100,
  titleLead: 'DB Day 27:',
  titleAccent: 'BCNF — chặt hơn 3NF',
  subtitle: 'Mọi "yếu tố xác định" đều phải là một khoá ứng viên 🔒',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. BCNF: DETERMINANT PHẢI LÀ KHOÁ 📏',
      code: `-- Nếu A -> B thì A phải là (siêu) khoá
-- Chặt hơn 3NF; hiếm gặp, cần khoá ứng viên chồng lấn`,
      notes: [
        { mark: 'ok', text: '"Yếu tố xác định" (determinant) = vế trái của một phụ thuộc hàm A → B' },
      ],
    },
    {
      tone: 'pink',
      title: '2. 3NF MÀ VẪN DƯ THỪA 🚫',
      code: `phan_cong(sinh_vien, mon_hoc, gv)
-- luật: gv -> mon_hoc (mỗi GV dạy 1 môn)
-- "Thay Nam dạy CSDL" lặp 3 lần (mỗi SV)`,
      notes: [
        { mark: 'ok', text: '`gv` xác định `mon_hoc` nhưng `gv` KHÔNG là khoá → vi phạm BCNF (dù vẫn 3NF)' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. HẬU QUẢ: ĐỔI MÔN SÓT → PHẠM LUẬT ⚠️',
      code: `UPDATE ... WHERE sinh_vien='An';  -- sót Binh, Chi
-- -> Thay Nam có CẢ CSDL LẪN Mang (2 môn!)`,
      notes: [
        { mark: 'ok', text: 'Dư thừa khiến sửa sót, phá luật "mỗi GV một môn"' },
      ],
    },
    {
      tone: 'green',
      title: '4. SỬA BCNF: TÁCH THEO DETERMINANT ✅',
      code: `gv_mon(gv PK, mon_hoc)       -- gv -> mon: MỘT chỗ
ghi_danh(sinh_vien, gv FK)   -- SV ghi danh với GV
-- đổi môn 1 lần -> đồng nhất`,
      notes: [
        { mark: 'ok', text: 'Tách sao cho vế trái mỗi phụ thuộc trở thành khoá của bảng mới' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Thực tế: chuẩn hoá tới 3NF là ĐỦ cho gần như mọi hệ; BCNF chỉ cần khi có khoá ứng viên chồng lấn' },
        { mark: 'next', text: '**Ngày 28**: quan hệ nhiều–nhiều & bảng nối (junction)' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) DU THUA: "Thay Nam day CSDL" luu 3 dong (moi sinh vien 1 lan)',
      '2) doi mon cua Thay Nam sot 1 dong -> Thay Nam co CA CSDL LAN Mang (pham luat 1-GV-1-mon)',
      '3) BCNF (tach gv_mon + ghi_danh): doi mon 1 lan ->',
      '     moi dong dong nhat, khong pham luat',
    ],
  },
};
