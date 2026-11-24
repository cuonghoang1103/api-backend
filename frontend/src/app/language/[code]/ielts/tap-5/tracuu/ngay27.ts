/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 Ngày 27 (soạn cùng tap-5/ngay/ngay27.ts, 24/11/2026).
 * Phiên ghép chặng 5 chép mảng này vào `tap-5/tracuu-chang5.ts` (đánh lại số thứ tự mục cho liên tục cả chặng).
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_27: Block[] = [
  { t: "h", text: "(Ngày 27 · Bài 1 mục 1–3) Bảng 44 điểm ngữ pháp — 9 cụm để tự chẩn đoán" },
  {
    t: "table", head: ["Cụm", "Mã", "Band 8 cần gì"],
    rows: [
      ["A Câu & thì", "G01 G02 G06 G12 G13 G20 G22 G23", "mỗi đoạn một mốc thời gian; đổi thì chỉ khi mốc đổi"],
      ["B Danh từ & giới từ", "G03 G04 G07 G10 G11", "mạo từ, số, giới từ phụ thuộc không lỗi lặp"],
      ["C Tính từ & so sánh", "G05 G14 G21 G33", "so sánh có mức độ (far, three times as… as)"],
      ["D Động từ đặc biệt & câu hỏi", "G08 G15 G19 G27 G28 G34", "đúng mẫu động từ sau remember / deny / suggest / have"],
      ["E Câu phức", "G17 G26 G30 G31 G35", "một động từ chính; cụm rút gọn đúng chủ ngữ"],
      ["F Điều kiện & giả định", "G16 G25 G38 G42", "thời gian giả định khớp thời gian hệ quả"],
      ["G Bị động & nhấn mạnh", "G09 G24 G36 G37", "dùng vừa đủ"],
      ["H Lập luận & mạch", "G18 G29 G32 G39 G40 G41", "mức chắc khớp bằng chứng; dấu câu theo loại từ nối"],
      ["I Hệ thống lỗi & nói", "G43 G44", "soát lỗi của chính mình trong 4 phút"],
    ],
  },
  { t: "rule", formula: "Chẩn đoán 44 câu → tô cụm (sai ≥ 2 = đỏ) → ôn đúng cụm đỏ → làm lại câu sai sau 3 ngày", vi: "Ôn tổng là ôn có chọn lọc." },

  { t: "h", text: "(Ngày 27 · Bài 1 mục 4) Khoá mốc thời gian cho mỗi đoạn" },
  {
    t: "table", head: ["Mốc của đoạn", "Thì chính", "Đổi thì khi"],
    rows: [
      ["Sự thật chung", "hiện tại đơn", "ví dụ có năm ⇒ quá khứ đơn rồi quay lại"],
      ["Thay đổi đến nay", "hiện tại hoàn thành", "nêu thời điểm đã xong ⇒ quá khứ đơn"],
      ["Task 1 quá khứ", "quá khứ đơn", "trước một mốc khác ⇒ had V3"],
      ["Task 1 dự báo", "will / is expected to", "By + năm tương lai ⇒ will have V3"],
    ],
  },
  { t: "rule", formula: "Khoá mốc → thì chính → đổi thì CHỈ khi mốc đổi → quay lại thì chính", vi: "Mỗi lần đổi thì phải chỉ ra được chữ báo mốc mới." },

  { t: "h", text: "(Ngày 27 · Bài 1 mục 5–6) Danh từ, mạo từ, hoà hợp; giới từ phụ thuộc" },
  {
    t: "patterns",
    rows: [
      { formula: "the + N trừu tượng + of… · Ø + N trừu tượng nói chung", vi: "Hậu bổ ngữ xác định danh từ ⇒ the.", examples: [{ en: "The education of girls has improved, but education in general is still underfunded.", vi: "Việc giáo dục trẻ em gái đã cải thiện, nhưng giáo dục nói chung vẫn thiếu kinh phí." }] },
      { formula: "The number of + N(s) + is · A number of + N(s) + are", vi: "Động từ khớp danh từ đầu cụm.", examples: [{ en: "The number of complaints is rising; a number of them are about noise.", vi: "Số lời phàn nàn đang tăng; một số trong đó là về tiếng ồn." }] },
      { formula: "increase / rise / fall IN · impact / effect ON · access / solution TO · contribute TO + V-ing", vi: "Giới từ nhớ theo cụm; TO là giới từ ⇒ V-ing.", examples: [{ en: "The scheme could contribute to reducing the sharp increase in rents.", vi: "Chương trình có thể góp phần giảm mức tăng mạnh của giá thuê." }] },
    ],
  },
  { t: "rule", formula: "Danh từ: đếm được? → số? → the / Ø / a? → động từ khớp danh từ đầu cụm", vi: "Bốn câu hỏi cho mỗi danh từ trong lượt soát." },

  { t: "h", text: "(Ngày 27 · Bài 1 mục 7) Câu phức không gãy" },
  {
    t: "table", head: ["Lỗi", "Đúng"],
    rows: [
      ["treo chủ ngữ: ~~Built in 1890, engineers consider the bridge unsafe.~~", "Built in 1890, the bridge is now considered unsafe."],
      ["rơi giới từ: ~~the system which people depend~~", "the system on which people depend"],
      ["mệnh đề danh ngữ thiếu động từ chính", "Whether the scheme will work is still unclear."],
      ["which lơ lửng / hai động từ chính không liên từ", ", which caused… · because… · , hoping to…"],
    ],
  },
  { t: "rule", formula: "Câu dài = MỘT động từ chính + chủ ngữ thật; V-ing / V3 đầu câu nói về chủ ngữ của mệnh đề chính", vi: "Soát câu dài bằng hai câu hỏi: động từ chính đâu? cụm đầu câu nói về ai?" },

  { t: "h", text: "(Ngày 27 · Bài 1 mục 8–9) Mức chắc, giả định, mạch và dấu câu" },
  {
    t: "table", head: ["Cần nói", "Khung"],
    rows: [
      ["chắc (có số liệu)", "will · has been shown to · clearly"],
      ["khá chắc", "is likely to · would probably · tends to"],
      ["có thể", "may · could · might well"],
      ["không thật", "If S V-ed / were, S would… · Were S to V…"],
      ["hỗn hợp", "Had S V3, S would now…"],
      ["đề xuất", "It is essential that S + V nguyên mẫu"],
      ["trạng từ nối", ". However, … / ; however, …"],
      ["liên từ / giới từ", "Although + mệnh đề (không but) · Despite + N / V-ing"],
    ],
  },
  { t: "rule", formula: "Soát 4 phút: động từ chính → danh từ → đầu câu & chỗ nối → câu giả định / đề xuất", vi: "Thứ tự từ lỗi phổ biến nhất đến lỗi hiếm mà đắt." },

  { t: "h", text: "(Ngày 27 · Bài 3 mục 2) Sáu chức năng câu hỏi Part 3 — khung mở band 8" },
  {
    t: "table", head: ["Chức năng", "Khung mở"],
    rows: [
      ["O ý kiến", "Broadly, yes — though I'd draw the line at…"],
      ["C so sánh", "The obvious difference is…, but what's changed less than people assume is…"],
      ["W nguyên nhân", "On the surface it's…, but what's really driving it, I think, is…"],
      ["P dự đoán", "I'd expect…, provided that…; what's much harder to predict is…"],
      ["E đánh giá", "It depends what we're trying to achieve. If the aim is…, then…"],
      ["H giả định", "The immediate effect would be…; the knock-on effect, though, might be…"],
    ],
  },
  { t: "rule", formula: "Nghe → gọi tên chức năng → khung mở của chức năng → một ví dụ → câu chốt có giới hạn", vi: "Khung đổi theo chức năng nên không lặp một khuôn." },
];
