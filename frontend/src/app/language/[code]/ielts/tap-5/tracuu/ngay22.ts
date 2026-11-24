/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 · Ngày 22 (soạn cùng `tap-5/ngay/ngay22.ts`, 24/11/2026).
 * Người ghép chép các khối này vào `tap-5/tracuu-chang4.ts` (chặng Ngày 19–24) và đánh số liên tục cả chặng.
 * Ngày 22 không dạy dạng câu Reading / Listening nào ⇒ `bai-on-ngay22.txt` để trống.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_22: Block[] = [
  { t: "h", text: "(Ngày 22 · Bài 2 mục 2) Bài phản biện học thuật ~300 từ — khung 4 khối" },
  { t: "rule", formula: "① tóm tắt trung lập (40–60 từ) → ② ghi nhận thật → ③ 2–3 lỗ hổng: gọi tên + hậu quả + dữ liệu thiếu (150–180 từ) → ④ kết luận có điều kiện + chứng cứ cần có", vi: "Phản biện là chứng minh chứng cứ CHƯA ĐỦ, không phải chứng minh nhận định sai." },

  { t: "h", text: "(Ngày 22 · Bài 2 mục 3) Tám lỗ hổng lập luận — câu phản biện mẫu" },
  {
    t: "table",
    head: ["Lỗ hổng", "Câu mẫu"],
    rows: [
      ["Tương quan ≠ nhân quả", "The two may be connected, but the report offers no evidence that one caused the other."],
      ["Không có nhóm so sánh", "Without figures for comparable areas, the fall cannot be attributed to the scheme."],
      ["Hồi quy về trung bình", "Figures selected for being unusually high tend to fall back towards normal levels whatever is done."],
      ["Mẫu tự chọn / chỉ người “sống sót”", "Those who completed the programme are unlikely to be typical of those who started it."],
      ["Dữ liệu tự báo cáo", "Feeling safer is a different outcome from being safer."],
      ["Xung đột lợi ích", "This does not make the findings false, but an independent evaluation would remove the doubt."],
      ["Dịch chuyển", "Some of the problem may simply have moved elsewhere."],
      ["Khái quát quá mức", "What worked in six districts for one year may not work in twenty-two over a decade."],
    ],
  },

  { t: "h", text: "(Ngày 22 · Bài 2 mục 4) Động từ có lập trường và khuôn câu phản biện" },
  {
    t: "table",
    head: ["Bạn tin đến đâu", "Động từ"],
    rows: [
      ["Trung tính", "states · reports · notes · describes"],
      ["Hoài nghi", "claims · asserts · maintains · purports to show"],
      ["Tin là đúng", "shows · demonstrates · establishes · confirms"],
    ],
  },
  {
    t: "patterns",
    rows: [
      { formula: "X may well be accurate. The question is whether it shows Y.", vi: "ghi nhận số, chuyển sang suy luận", examples: [{ en: "The figure may well be accurate. The question is whether it shows that the scheme caused the fall.", vi: "Con số có thể chính xác. Câu hỏi là nó có cho thấy chương trình gây ra sự sụt giảm không." }] },
      { formula: "The figures are consistent with X, but they do not establish Y.", vi: "hợp với X, chưa đủ cho Y", examples: [{ en: "The figures are consistent with the system working, but they do not establish that it does.", vi: "Số liệu phù hợp với việc hệ thống hiệu quả, nhưng chưa xác lập được điều đó." }] },
      { formula: "This rests on the assumption that…", vi: "chỉ ra giả định ngầm", examples: [{ en: "The plan rests on the assumption that what worked in six districts will work in all.", vi: "Kế hoạch dựa trên giả định điều hiệu quả ở sáu quận sẽ hiệu quả ở mọi quận." }] },
      { formula: "Even if we grant that X, it does not follow that Y.", vi: "nhượng bộ rồi chặn bước nhảy", examples: [{ en: "Even if we grant that residents feel safer, it does not follow that they are.", vi: "Kể cả chấp nhận rằng người dân thấy an toàn hơn, không có nghĩa là họ an toàn hơn." }] },
      { formula: "None of this means X. But Y should follow, not precede, Z.", vi: "kết luận công bằng", examples: [{ en: "None of this means the system is useless. But expansion should follow, not precede, the evidence.", vi: "Điều này không có nghĩa hệ thống vô dụng. Nhưng mở rộng nên đi sau, không đi trước, chứng cứ." }] },
    ],
  },
  { t: "rule", formula: "Supporters argue that… · The concern is legitimate: … · Yet the argument rests on… · Until…, the case remains unproven.", vi: "Đoạn phản bác Task 2 = phản biện học thuật 90–120 từ." },

  { t: "h", text: "(Ngày 22 · Bài 3 mục 4) Năm loại câu Part 3 — năm khung" },
  {
    t: "table",
    head: ["Loại", "Dấu hiệu", "Khung band 8"],
    rows: [
      ["Sự thật / cách thức", "How do… usually…?", "2–3 kênh + một nhận xét đang đổi thế nào"],
      ["Nguyên nhân hai vế", "Why do some… while others…?", "một tiêu chí áp cho cả hai vế"],
      ["Mức độ / chính sách", "To what extent should…?", "mức độ + tiêu chí chi / làm cho cái gì + điều kiện"],
      ["Đạo đức", "Is it ever right to…?", "Yes, though… + phép thử + trường hợp cần thận trọng"],
      ["Dự đoán", "Do you think… in the future?", "dự đoán có mức độ + hai lực ngược + hedging"],
    ],
  },

  { t: "h", text: "(Ngày 22 · Bài 3 mục 5) Paraphrase câu hỏi — bốn mức" },
  {
    t: "table",
    head: ["Mức", "Cách", "Khuôn"],
    rows: [
      ["1 — Lặp", "nhắc lại câu hỏi", "tránh"],
      ["2 — Đồng nghĩa", "thay từ, giữ khung", "Some customs last…, while others vanish…"],
      ["3 — Đổi khung", "danh từ hoá / đổi chủ ngữ", "How long X lasts usually depends on… · A lot depends on…"],
      ["4 — Đặt tiêu chí", "biến câu hỏi thành một biến số", "It mostly comes down to whether… · If by X you mean Y, then… · I'd turn that round slightly: …"],
    ],
  },
  { t: "rule", formula: "Part 1: mức 2, trả lời thẳng · Part 3: mức 3–4 ở câu đầu · sau đó dùng chuỗi từ thay thế", vi: "Paraphrase để định hướng câu trả lời, không để câu giờ." },
];
