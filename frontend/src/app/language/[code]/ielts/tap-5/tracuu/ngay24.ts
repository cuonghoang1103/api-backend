/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 Ngày 24 (soạn cùng tap-5/ngay/ngay24.ts, 24/11/2026).
 * Phiên ghép chặng 4 chép mảng này vào `tap-5/tracuu-chang4.ts` (đánh lại số thứ tự mục cho liên tục cả chặng).
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_24: Block[] = [
  { t: "h", text: "(Ngày 24 · Bài 1 mục 2–3) Cụm AWL đa năng — khung cho mọi chủ đề" },
  {
    t: "table",
    head: ["Việc", "Cụm AWL"],
    rows: [
      ["Nguyên nhân – hệ quả", "a higher incidence of · persist into adulthood · derive satisfaction from · inhibit innovation · mutually reinforcing · ultimately"],
      ["Chính sách – nguồn lực", "an equitable distribution of · prioritise A over B · impose restrictions on · facilitate the transition to · adequate provision for · eligibility criteria"],
      ["Thay đổi – xu hướng", "a shift in public attitudes · reverse a decline · undergo rigorous testing · a predominantly rural region · retain skilled staff · virtually non-existent"],
      ["Đánh giá", "considerable scope for · incompatible with · lack a coherent strategy · a uniform approach · suspend judgement · modify their behaviour"],
    ],
  },
  { t: "rule", formula: "cụm AWL (khung) + từ chủ đề (thịt) = câu Task 2 dùng lại được ở nhiều đề", vi: "Học cụm, không học từ rời." },

  { t: "h", text: "(Ngày 24 · Bài 1 mục 5) Paraphrase bằng đổi dạng trong họ từ" },
  {
    t: "patterns",
    rows: [
      { formula: "S + V(họ X) + O → N(họ X) + of + O + V khác", vi: "Giữ họ từ, đổi từ loại, đổi cấu trúc.", examples: [{ en: "Governments should regulate social media. → Stricter regulation of social media is needed.", vi: "Chính phủ nên điều tiết mạng xã hội. → Cần điều tiết mạng xã hội chặt hơn." }, { en: "We rely too much on cars. → Our reliance on cars is excessive.", vi: "Ta phụ thuộc quá nhiều vào ô tô. → Sự phụ thuộc vào ô tô của ta là quá mức." }] },
    ],
  },
  { t: "rule", formula: "rely on → reliance on · access → accessible to · benefit → beneficial to · vary → variation in", vi: "Đổi từ loại thì kiểm lại giới từ đi kèm." },

  { t: "h", text: "(Ngày 24 · Bài 2 mục B2) Overview quy trình hai giai đoạn" },
  {
    t: "patterns",
    rows: [
      { formula: "Overall, the process consists of N steps in two stages. It begins with… and ends with…, with [mắt xích] marking the point at which…", vi: "Số bước · hai giai đoạn · đầu → cuối · mắt xích nối hai hình.", examples: [{ en: "Overall, the process consists of nine steps divided into two stages. It begins with the collection of waste grounds from cafés and ends with packaged logs being sold to retailers, with the drying of the grounds marking the point at which the raw material is ready for manufacture.", vi: "Nhìn chung, quy trình gồm chín bước chia hai giai đoạn, bắt đầu bằng thu gom bã cà phê ở quán và kết thúc bằng củi đóng hộp bán lẻ; khâu sấy là điểm nguyên liệu sẵn sàng để sản xuất." }] },
      { formula: "…, after which S + be + V3 · Having been V3, S + be + V3 · before being V3 · once S + has V3", vi: "Bị động + rút gọn để nối bước, không “Then… Then…”.", examples: [{ en: "Having been left to cool for 24 hours, the logs are packed in boxes of six.", vi: "Sau khi để nguội 24 giờ, củi được đóng hộp sáu thanh." }] },
    ],
  },

  { t: "h", text: "(Ngày 24 · Bài 2 mục B3) Thesis và khung Discussion band 8" },
  {
    t: "patterns",
    rows: [
      { formula: "While its defenders point to…, I believe… should…, provided that…", vi: "Lập trường + quan điểm kia + điều kiện ngay ở mở bài.", examples: [{ en: "While its defenders point to lighter summer evenings, I believe the twice-yearly clock change should be abandoned, provided that each country chooses its permanent time with care.", vi: "Dù người bảo vệ nhắc tới buổi tối mùa hè sáng hơn, tôi cho rằng nên bỏ việc đổi giờ hai lần mỗi năm, với điều kiện mỗi nước chọn giờ cố định cẩn thận." }] },
      { formula: "Supporters of X argue, with some justification, that… That argument, however, has weakened…", vi: "Trình bày quan điểm kia công bằng, rồi chỉ chỗ yếu.", examples: [{ en: "Supporters of the change argue, with some justification, that it fits the clock to the way people live.", vi: "Người ủng hộ việc đổi giờ lập luận, có phần có lý, rằng nó khớp đồng hồ với cách con người sống." }] },
    ],
  },

  { t: "h", text: "(Ngày 24 · Bài 3 mục 2) Năm tín hiệu “sửa lại” trong bài nghe có nhiễu" },
  {
    t: "table",
    head: ["Tín hiệu", "Ví dụ"],
    rows: [
      ["① Hỏi lại", "Sorry, say that again? · You're breaking up · Was that B or D?"],
      ["② Tự sửa", "No, hang on — · Sorry, I mean… · Scratch that —"],
      ["③ Thay thế", "Make that… · Actually, let's say…"],
      ["④ Đánh vần lại", "double N · not M, N for November · one-four, not four-zero"],
      ["⑤ Xác nhận", "Yes, that's it · Exactly · Got it"],
    ],
  },
  { t: "rule", formula: "bản đầu → (② / ③ / ④) → bản cuối → ⑤ xác nhận = đáp án", vi: "Đề có nhiễu: đáp án gần như luôn là bản cuối." },
];
