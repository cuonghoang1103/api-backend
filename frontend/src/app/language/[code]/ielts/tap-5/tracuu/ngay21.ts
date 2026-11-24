/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 · Ngày 21 (soạn cùng `tap-5/ngay/ngay21.ts`, 24/11/2026).
 * Người ghép chép các khối này vào `tap-5/tracuu-chang4.ts` (chặng Ngày 19–24) và đánh số liên tục cả chặng.
 * Dạng câu thi → bài ôn: xem `bai-on-ngay21.txt` (match-info · sentence · mcq · ynng · match-feature · summary-box → t5d21-doc;
 * note · mcq · match-feature → t5d21-nghe).
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_21: Block[] = [
  { t: "h", text: "(Ngày 21 · mục 1) Part 3 bốn nhịp — chỗ đặt cấu trúc hiếm" },
  {
    t: "table",
    head: ["Nhịp", "Việc", "★ hợp"],
    rows: [
      ["① Trả lời thẳng", "trả lời + sửa tiền đề nếu cần", "câu chẻ: What… isn't X, it's Y"],
      ["② Lý do + cơ chế", "ví dụ cụ thể", "— (câu thường)"],
      ["③ Câu xoay", "nhượng bộ / giới hạn / giả định", "Where I'd disagree is… · That I accept. What I don't… · Should that happen,…"],
      ["④ Câu chốt", "điều kiện duy nhất, mức độ", "Only when / if… do… · It's vital that + S + V"],
    ],
  },
  { t: "rule", formula: "1–2 ★ / câu trả lời · mỗi nhịp tối đa một ★ · không ★ ở câu mở đầu chỉ để khoe", vi: "Mỗi cấu trúc hiếm phải làm một việc: sửa tiền đề, xoay ý hoặc chốt." },

  { t: "h", text: "(Ngày 21 · mục 2) Câu chẻ khi nói" },
  {
    t: "patterns",
    rows: [
      { formula: "What + S + V (+ giới từ) + isn't X, it's Y", vi: "sửa tiền đề", examples: [{ en: "What worries me isn't the cost, it's who ends up paying it.", vi: "Điều làm tôi lo không phải chi phí, mà là ai rốt cuộc phải trả." }] },
      { formula: "Where + S + V + is (on / in / when)…", vi: "chỉ ra chỗ đồng ý / không đồng ý", examples: [{ en: "Where I'd part company with that argument is on cost.", vi: "Chỗ tôi không đi cùng lập luận ấy là ở chi phí." }] },
      { formula: "It's not so much X as Y", vi: "thu hẹp trọng tâm", examples: [{ en: "It's not so much that they don't care as that nobody asks them.", vi: "Không hẳn là họ không quan tâm, mà là chẳng ai hỏi họ." }] },
      { formula: "All + S + V + is… · N — that's what…", vi: "giảm nhẹ lập trường · chẻ đảo ở câu chốt", examples: [{ en: "All I'm saying is that we should test it first.", vi: "Tôi chỉ nói là nên thử trước." }] },
    ],
  },
  { t: "rule", formula: "What + S + V (+ prep) + isn't X, it's Y   ·   Where + S + V + is…   ·   It's not so much X as Y", vi: "Không có X cụ thể để gạt bỏ thì đừng chẻ (câu chẻ rỗng: What I want to say is…)." },

  { t: "h", text: "(Ngày 21 · mục 3) Đảo ngữ “nói được”" },
  {
    t: "table",
    head: ["Khuôn", "Khi nói", "Ví dụ"],
    rows: [
      ["Not only + trợ ĐT + S + V, (S + V)…", "✅", "Not only does it save money, it actually gets used."],
      ["Only when / if + S + V + trợ ĐT + S + V", "✅ (đảo vế CHÍNH)", "Only when people see the benefit do they change."],
      ["Should + S + V, …", "✅ trang trọng vừa", "Should that happen, the state would have to step in."],
      ["Had + S + V3, …", "✅ trang trọng vừa", "Had they asked residents, it might have worked."],
      ["Little did + S + V", "chỉ khi kể (Part 2)", "Little did I know…"],
      ["Never / Rarely + have + S + V3 · So + adj + be… · Were + S + to V", "❌ để dành viết", "nói: It's rare for… · It was so… that… · If… went up"],
    ],
  },
  { t: "rule", formula: "Not only + do/does/did + S + V   ·   Only when + S + V + do/does + S + V   ·   Should + S + V   ·   Had + S + V3", vi: "Bốn khuôn nói được trong Part 3; lỗi số một là thiếu trợ động từ." },

  { t: "h", text: "(Ngày 21 · mục 4) Giả định và đưa lên đầu câu khi nói" },
  {
    t: "table",
    head: ["Nhóm", "Bản nhẹ", "Bản nặng (một lần)"],
    rows: [
      ["Điều kiện cần", "It's vital that everyone should have / has…", "It's vital that every child have…"],
      ["Nếu không có X", "If it weren't for + N, …", "Were it not for + N · But for + N"],
      ["Nhượng bộ đưa lên đầu", "It sounds odd, but…", "Odd as it may sound, … · Expensive though it is, …"],
      ["Tân ngữ đưa lên đầu", "I can accept that. What I can't accept is…", "That I can accept. What I can't accept is…"],
      ["Cụm cố định", "if necessary · anyway", "if need be · be that as it may · come what may"],
    ],
  },
  { t: "rule", formula: "It's vital that + S + (should) + V   ·   Were it not for + N   ·   adj + as / though + S + V,   ·   That I accept. What I don't accept is…", vi: "Were it not for + CỤM DANH TỪ; adj + as + S + V không đảo S–V." },

  { t: "h", text: "(Ngày 21 · mục 5) Keo G44 quanh câu hiếm" },
  {
    t: "table",
    head: ["Keo", "Nghĩa"],
    rows: [
      ["…, and rightly so.", "và như thế là đúng"],
      ["If anything, …", "nếu có gì thì (ngược lại)"],
      ["I'd like to think so. / I doubt it.", "trả lời rút gọn"],
      ["Not that…", "không phải là (chen ý phụ)"],
      ["…, or rather, …", "hay đúng hơn là"],
    ],
  },
  { t: "rule", formula: "câu ngắn + keo → ★ → câu ngắn", vi: "Đệm hai bên câu hiếm bằng câu ngắn, thân mật." },

  { t: "h", text: "(Ngày 21 · Bài 2) Reading một lượt — giao thức và 60 phút" },
  {
    t: "table",
    head: ["Mốc", "Việc"],
    rows: [
      ["mỗi passage", "đọc câu hỏi nhóm 1 → liếc danh sách câu không theo thứ tự → đọc đoạn, trả lời khi đi qua"],
      ["mỗi câu", "90 giây ở đúng đoạn mà chưa chốt ⇒ đoán có lý + cờ"],
      ["0–16 · 16–34 · 34–53", "Passage 1 · 2 · 3"],
      ["53–58 · 58–60", "mở câu có cờ (chỉ đọc câu chứa từ khoá) · soát chính tả, số từ"],
    ],
  },
  { t: "rule", formula: "16 – 18 – 19 + 5 phút cờ + 2 phút soát = 60 · đọc lại trọn đoạn: 0–1 lần cả bài", vi: "Quay lui nhỏ (một hai chữ) là sửa hiểu — giữ; đọc lại cả đoạn — bỏ." },
];
