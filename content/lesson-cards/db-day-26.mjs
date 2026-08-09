/**
 * Thẻ "100 Ngày Database" — Ngày 26: 3NF (dạng chuẩn 3).
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-26.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day26:
 *   phong_ban_ten phụ thuộc phong_ban_id (bắc cầu) -> 'Ky thuat' lặp
 *   3NF (tách phong_ban): đổi tên 1 lần -> An & Binh đồng nhất 'Cong nghe'
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 26,
  total: 100,
  titleLead: 'DB Day 26:',
  titleAccent: '3NF — bỏ phụ thuộc bắc cầu',
  subtitle: 'Cột không-khoá không được phụ thuộc cột không-khoá khác 🔗',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. 3NF = 2NF + KHÔNG BẮC CẦU 📏',
      code: `Phụ thuộc bắc cầu:  key -> A -> B
id -> phong_ban_id -> phong_ban_ten
-- phong_ban_ten phụ thuộc GIÁN TIẾP qua id`,
      notes: [
        { mark: 'ok', text: 'Cột không-khoá phụ thuộc một cột không-khoá KHÁC = phụ thuộc bắc cầu' },
      ],
    },
    {
      tone: 'pink',
      title: '2. VI PHẠM: TÊN PHÒNG SỐNG NHẦM CHỖ 🚫',
      code: `id ten  phong_ban_id phong_ban_ten
 1 An       10       Ky thuat
 2 Binh     10       Ky thuat   <- lặp!`,
      notes: [
        { mark: 'ok', text: '`phong_ban_ten` phụ thuộc `phong_ban_id` → lặp ở mọi nhân viên cùng phòng' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. HẬU QUẢ: ĐỔI TÊN PHÒNG SÓT → MÂU THUẪN ⚠️',
      code: `UPDATE ... WHERE id=1;   -- sót Binh
-- -> phòng 10 có CẢ 'Ky thuat' LẪN 'Cong nghe'`,
      notes: [
        { mark: 'ok', text: 'Lại là dị thường sửa — lần này do phụ thuộc bắc cầu' },
      ],
    },
    {
      tone: 'green',
      title: '4. SỬA 3NF: TÁCH RA BẢNG RIÊNG ✅',
      code: `phong_ban(id PK, ten)       -- tên phòng MỘT chỗ
nhan_vien(id, ten, phong_ban_id FK)
-- đổi tên 1 lần -> mọi NV đồng nhất`,
      notes: [
        { mark: 'ok', text: 'Chuyển nhóm cột bắc cầu về bảng của thực thể mà chúng thực sự tả' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Câu thần chú: mọi cột phụ thuộc "KHOÁ, TOÀN KHOÁ, và KHÔNG GÌ NGOÀI KHOÁ" (1NF·2NF·3NF)' },
        { mark: 'next', text: '**Ngày 27**: BCNF — dạng chuẩn chặt hơn 3NF một chút' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) VI PHAM 3NF: phong_ban_ten "Ky thuat" lap cho phong_ban_id=10 (An, Binh)',
      '2) doi ten phong 10 sot 1 dong -> phong_ban_id 10 co CA "Ky thuat" LAN "Cong nghe"',
      '3) 3NF (tach phong_ban): UPDATE ten 1 lan ->',
      '     An & Binh deu "Cong nghe"  (dong nhat, het di thuong)',
    ],
  },
};
