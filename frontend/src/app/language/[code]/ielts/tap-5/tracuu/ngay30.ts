/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 · Ngày 30 (soạn cùng `tap-5/ngay/ngay30.ts`, 24/11/2026).
 * Người ghép chép các khối này vào `tap-5/tracuu-chang5.ts` (chặng Ngày 25–30) và đánh số liên tục cả chặng.
 * Ngày 30 không dạy dạng câu Reading / Listening mới ⇒ `bai-on-ngay30.txt` để trống.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_30: Block[] = [
  { t: "h", text: "(Ngày 30 · Bài 1 mục 1 · 8) Nhớ sau 7 ngày — đo và giữ từ" },
  {
    t: "table",
    head: ["Mức nhớ", "Làm được"],
    rows: [
      ["① Nhận ra", "thấy từ, nhớ nghĩa"],
      ["② Nhớ ra", "có nghĩa, tự bật ra từ, đúng chính tả"],
      ["③ Ghép đúng cụm", "pay lip service to · a level playing field · it does not follow that"],
      ["④ Đúng sắc thái", "thrifty ≠ stingy · renowned ≠ notorious · candid ≠ tactless"],
    ],
  },
  { t: "rule", formula: "tỉ lệ nhớ = câu đúng KHÔNG nhìn ÷ tổng × 100 (chỉ từ học ≥ 7 ngày)   ·   ôn 1 – 3 – 7 – 21 – 60 ngày", vi: "Học cụm + câu của mình, dùng trong 48 giờ, tối đa 15 thẻ mới mỗi ngày." },

  { t: "h", text: "(Ngày 30 · Bài 2 mục B4–B5) Viết lại bài lên band 8" },
  {
    t: "patterns",
    rows: [
      { formula: "I largely agree that + S + V, provided that + S + V", vi: "Lập trường có MỨC ĐỘ và ĐIỀU KIỆN cho đề “To what extent”.", examples: [{ en: "I largely agree that living with parents is the wiser option, provided that the arrangement is time-limited.", vi: "Tôi phần lớn đồng ý rằng ở với bố mẹ là lựa chọn khôn ngoan hơn, với điều kiện là có thời hạn." }] },
      { formula: "There is some truth in this… It does not follow, however, that + S + V", vi: "Nhượng bộ thật rồi phản bác trong cùng đoạn.", examples: [{ en: "There is some truth in this. It does not follow, however, that these skills can only be learned by living alone.", vi: "Điều này có phần đúng. Tuy nhiên, không suy ra được rằng các kỹ năng đó chỉ học được khi sống một mình." }] },
      { formula: "What + V + is not X (as such), but Y", vi: "Câu chẻ giả sửa tiền đề của phía kia.", examples: [{ en: "What undermines development is not living with one's parents as such, but an arrangement in which nothing is expected.", vi: "Điều làm hại sự phát triển không phải bản thân việc ở với bố mẹ, mà là kiểu sắp xếp không đòi hỏi gì." }] },
    ],
  },
  { t: "rule", formula: "viết lại = cùng đề · lập trường có điều kiện · một ý sâu mỗi đoạn · nhượng bộ thật + phản bác · soát 3 + 2", vi: "Sửa lối nghĩ trước, sửa câu chữ sau. Tự chấm bằng phiếu 12 dòng; lệch AI ≤ 0.5." },

  { t: "h", text: "(Ngày 30 · Bài 3 mục 3) Khung band 8 cho câu “Why…?” ở Part 3" },
  {
    t: "patterns",
    rows: [
      { formula: "ý 1 (hiển nhiên) + But I don't think that's the whole story + ý 2 + So it's less that… and more that…", vi: "Thừa nhận câu trả lời dễ, rồi đi sâu hơn nó.", examples: [{ en: "So it's less that journalists are drawn to bad news and more that the format itself favours sudden events.", vi: "Vậy không hẳn là nhà báo bị tin xấu thu hút, mà là khuôn dạng tin tức ưu tiên sự kiện đột ngột." }] },
    ],
  },
  { t: "rule", formula: "it's less that + S + V + and more that + S + V", vi: "Cấu trúc so sánh hai lời giải thích — dùng khi nói, một lần mỗi câu trả lời." },
];
