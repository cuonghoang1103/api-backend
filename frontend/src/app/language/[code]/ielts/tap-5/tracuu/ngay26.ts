/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 · Ngày 26 (soạn cùng `tap-5/ngay/ngay26.ts`, 24/11/2026).
 * Người ghép chép các khối này vào `tap-5/tracuu-chang5.ts` (chặng Ngày 25–30) và đánh số liên tục cả chặng.
 * Ngày 26 không dạy dạng câu Reading / Listening nào ⇒ `bai-on-ngay26.txt` để trống.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_26: Block[] = [
  { t: "h", text: "(Ngày 26 · Bài 1 mục 4) Sáu cặp dễ nhầm — Energy · Language · Books" },
  {
    t: "table",
    head: ["Cặp", "Phân biệt"],
    rows: [
      ["literal / literary / literate", "nghĩa đen · thuộc văn chương · biết đọc biết viết"],
      ["translator / interpreter", "dịch viết · dịch nói"],
      ["accent / dialect / language", "phát âm · biến thể có từ + ngữ pháp riêng · hệ thống riêng"],
      ["abridged / adapted", "cắt ngắn giữ lời · chuyển thể sang hình thức khác"],
      ["energy-efficient / energy-intensive", "tiết kiệm năng lượng · tốn nhiều năng lượng"],
      ["renewable / sustainable", "nguồn không cạn · cách làm duy trì được lâu dài"],
    ],
  },

  { t: "h", text: "(Ngày 26 · Bài 2 mục 1) Task 1 trong 20 phút — bốn câu hỏi của 3 phút đầu" },
  { t: "rule", formula: "3′: ① cái gì · đơn vị · khi nào (dự báo?)  ② điều lớn nhất  ③ điều thứ hai  ④ trục thân bài  →  overview viết TRƯỚC  →  14′ thân bài  →  3′ soát", vi: "Câu ② và ③ chính là hai câu overview." },

  { t: "h", text: "(Ngày 26 · Bài 2 mục 2) Bảy công thức overview" },
  {
    t: "table",
    head: ["Dạng", "Overview nói", "Thân bài chia theo"],
    rows: [
      ["Line (có dự báo)", "xu hướng lớn nhất + điểm vượt / tổng", "nhóm đường cùng xu hướng · quá khứ / dự báo"],
      ["Bar (nhóm × năm)", "quy luật theo nhóm + thay đổi theo thời gian", "năm hoặc nhóm"],
      ["Pie (hai năm)", "phần giữ vị trí + phần đổi nhiều nhất", "phần tăng / phần giảm"],
      ["Table (nhiều đơn vị)", "cột chênh nhất + hàng đứng đầu", "theo cột — không so ngang khác đơn vị"],
      ["Mixed", "mỗi hình một ý + một câu nối", "mỗi khổ một hình"],
      ["Process", "số bước + đầu vào → sản phẩm + vòng lặp / hai giai đoạn", "giai đoạn / nơi chốn"],
      ["Map", "công năng tổng thể + cái giữ nguyên", "khu vực hoặc giữ – đổi – mới"],
    ],
  },
  {
    t: "patterns",
    rows: [
      { formula: "S + is projected / expected / forecast to + V + by + năm", vi: "Năm dự báo — không dùng will chắc nịch.", examples: [{ en: "Coal generation is projected to dwindle to a mere 5 TWh by 2035.", vi: "Điện than được dự báo sẽ teo lại chỉ còn 5 TWh vào năm 2035." }] },
      { formula: "rise / fall by + N percentage points", vi: "Chênh lệch giữa hai tỉ lệ.", examples: [{ en: "The figure for 16–24-year-olds rose by 23 percentage points.", vi: "Tỉ lệ ở nhóm 16–24 tuổi tăng 23 điểm phần trăm." }] },
      { formula: "The process is not entirely linear, since + S + V", vi: "Gọi tên vòng lặp trong process.", examples: [{ en: "The process is not entirely linear, since errors found at the checking stage are re-recorded.", vi: "Quy trình không hoàn toàn tuyến tính, vì lỗi phát hiện ở bước kiểm được thu lại." }] },
      { formula: "X made way for Y · X has been converted into Y", vi: "Map: bị thay thế · bị đổi công năng.", examples: [{ en: "The lorry park made way for a public square, and the warehouse has been converted into a language school.", vi: "Bãi xe tải nhường chỗ cho quảng trường, và nhà kho được chuyển thành trường ngoại ngữ." }] },
    ],
  },

  { t: "h", text: "(Ngày 26 · Bài 3 mục 1, 3) Part 2 — bốn ô ghi chú và khung bốn chặng" },
  { t: "rule", formula: "ghi chú ≤ 15 chữ tiếng Anh: ① ai · đâu · khi nào ② cảnh chính ③ giác quan + câu thoại ④ nhìn lại", vi: "Chọn chuyện từ kho trong 10 giây đầu; ô 4 viết trước nếu bí." },
  { t: "rule", formula: "vào thẳng chuyện → điều làm nó đặc biệt (had V3 / would) → MỘT khoảnh khắc (giác quan + câu thoại) → Looking back, …", vi: "Dùng cho cả 12 thẻ hay gặp; tái chế chuyện thì tiêu điểm thẻ mới phải xuất hiện trong 30 giây đầu." },
];
