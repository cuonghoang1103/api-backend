/**
 * Thẻ "100 Ngày Database" — Ngày 29: Phi chuẩn hoá (denormalization).
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/db-day-29.mjs
 *
 * ⚠ Không có `verify`. `proof.lines` là OUTPUT THẬT của psql.
 * ✅ Đã chạy thật trên PostgreSQL 15.4 (docker cuong_pg_new :5433), DB hoc_db_day29:
 *   cột cache binh_luan_count đọc thẳng (không JOIN) = COUNT qua JOIN
 *   QUÊN đồng bộ -> cache=3 nhưng thực tế=4 (lệch)
 */
export default {
  series: '100 NGÀY DATABASE',
  day: 29,
  total: 100,
  titleLead: 'DB Day 29:',
  titleAccent: 'Phi chuẩn hoá có chủ ý',
  subtitle: 'Cố ý thêm dư thừa để ĐỌC nhanh — và cái giá phải trả ⚖️',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. NGƯỢC VỚI CHUẨN HOÁ 🔄',
      code: `Chuẩn hoá   -> tối ưu GHI + toàn vẹn (ít dư thừa)
Phi chuẩn   -> tối ưu ĐỌC (thêm dư thừa CÓ CHỦ Ý)`,
      notes: [
        { mark: 'ok', text: 'Phi chuẩn hoá = cố ý thêm lại dư thừa để tránh JOIN/tính toán đắt khi đọc' },
      ],
    },
    {
      tone: 'green',
      title: '2. VÍ DỤ: CỘT ĐẾM CACHE 🔢',
      code: `bai_viet(..., binh_luan_count INT)  -- cache
-- thay vì: JOIN binh_luan + COUNT mỗi lần đọc`,
      notes: [
        { mark: 'ok', text: 'Lưu sẵn số bình luận → đọc thẳng một cột, không JOIN, không GROUP BY' },
      ],
    },
    {
      tone: 'yellow',
      title: '3. LỢI: ĐỌC CỰC NHANH ⚡',
      code: `SELECT tieu_de, binh_luan_count FROM bai_viet;
-- 1 lần quét bảng, không đụng bảng binh_luan`,
      notes: [
        { mark: 'ok', text: 'Ở quy mô lớn (triệu dòng, feed đọc liên tục), tránh JOIN là thắng lớn' },
      ],
    },
    {
      tone: 'pink',
      title: '4. GIÁ: PHẢI GIỮ ĐỒNG BỘ ⚠️',
      code: `INSERT binh_luan nhưng QUÊN update count
-> cache = 3  nhưng  thực tế = 4  (LỆCH!)`,
      notes: [
        { mark: 'ok', text: 'Dư thừa = nguy cơ lệch. Phải cập nhật cache MỌI nơi ghi (dễ dùng trigger — GĐ7)' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Luật: chuẩn hoá TRƯỚC, chỉ phi chuẩn khi ĐO được nút thắt đọc. Có thể thay bằng materialized view (Ngày sau)' },
        { mark: 'next', text: '**Ngày 30**: ràng buộc nâng cao + thiết kế trọn một schema — khép Giai đoạn 3' },
      ],
    },
  ],

  proof: {
    label: 'Đã chạy thật · PostgreSQL 15.4',
    lines: [
      '1) CHUAN HOA (JOIN + COUNT moi lan): Bai 1 = 2, Bai 2 = 1  (dung, ton khi lon)',
      '2) PHI CHUAN (doc cot cache thang): Bai 1 = 2, Bai 2 = 1  (khong JOIN, nhanh)',
      '3) them binh luan + UPDATE count -> Bai 1 = 3  (giu dong bo)',
      '4) them binh luan QUEN update -> cache = 3 nhung thuc_te = 4  (LECH!)',
    ],
  },
};
