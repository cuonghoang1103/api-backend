/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 Ngày 13 (soạn cùng tap-5/ngay/ngay13.ts, 24/11/2026).
 * Phiên ghép chặng 3 chép mảng này vào `tap-5/tracuu-chang3.ts` (đánh lại số thứ tự mục cho liên tục cả chặng).
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_13: Block[] = [
  { t: "h", text: "(Ngày 13 · mục 2) Câu chẻ trong Task 2 — công cụ sửa một cách nhìn" },
  {
    t: "patterns",
    rows: [
      { formula: "It is / was + N (not N) + that + V …", vi: "Nhấn một danh từ; kèm not… để loại cách nhìn kia.", examples: [{ en: "It is the quality of teaching, not the size of the budget, that determines how much pupils learn.", vi: "Chính chất lượng giảng dạy, chứ không phải quy mô ngân sách, quyết định học sinh học được bao nhiêu." }] },
      { formula: "What + S + V + is / was + N / that + S + V", vi: "Mở lời phản biện.", examples: [{ en: "What this argument overlooks is that most commuters have no realistic alternative to the car.", vi: "Điều lập luận này bỏ qua là phần lớn người đi làm không có lựa chọn nào ngoài ô tô." }] },
      { formula: "The reason (why) + S + V + is that + S + V", vi: "Sau is dùng that, không dùng because.", examples: [{ en: "The reason such schemes fail is that they are funded for a single year.", vi: "Lý do các chương trình như vậy thất bại là chúng chỉ được cấp vốn một năm." }] },
    ],
  },
  { t: "rule", formula: "It is N (not N) that V …   ·   What S V is that S V   ·   The reason S V is that S V", vi: "Dùng khi vừa nêu một cách nhìn và muốn nói “không phải thế, mà là thế này”. Một bài một lần." },

  { t: "h", text: "(Ngày 13 · mục 3) Đảo ngữ trong Task 2 — một lần, ở câu mạnh nhất" },
  {
    t: "table", head: ["Nhóm", "Khuôn", "Ví dụ"],
    rows: [
      ["Điều kiện cần", "Only when / if / by … + aux + S + V", "Only by taxing fuel more heavily can governments change how people travel."],
      ["Cộng dồn", "Not only + aux + S + V, but S also V", "Not only does tourism create jobs, but it also funds conservation."],
      ["Hiếm", "Rarely / Seldom + aux + S + V", "Rarely has a single invention changed working life so quickly."],
      ["Bác bỏ", "Nor + aux + S + V", "Fines do not deter wealthy drivers. Nor do they raise much revenue."],
      ["Điều kiện trang trọng", "Should / Were / Had + S + V", "Were fares to be abolished, demand would outstrip capacity within months."],
    ],
  },
  { t: "rule", formula: "Only + mệnh đề → đảo ở mệnh đề chính   ·   Only + chủ ngữ → không đảo", vi: "Only when rents fall will families return. — Only the state can afford this." },

  { t: "h", text: "(Ngày 13 · mục 4) Tám khuôn nhượng bộ band 8" },
  {
    t: "table", head: ["Khuôn", "Ví dụ"],
    rows: [
      ["While / Although + S + V, …", "While such fines raise revenue, they do little to change behaviour."],
      ["adj / adv + as / though + S + V, …", "Appealing as this proposal may be, it ignores the cost."],
      ["Much as + S + V (cảm nghĩ), …", "Much as I sympathise with this view, I cannot accept its conclusion."],
      ["However + adj / adv + S + V, …", "However well funded a campaign is, it cannot replace regulation."],
      ["For all + N, …", "For all its flaws, the examination system is at least transparent."],
      ["S may V, but …", "This may be true of large cities, but it hardly applies to villages."],
      ["Admittedly, … . Even so, …", "Admittedly, the scheme is expensive. Even so, the alternative costs more."],
      ["…, albeit + adj / adv / cụm", "The policy worked, albeit slowly."],
    ],
  },
  { t: "rule", formula: "While S V, S V   ·   adj + as + S + may be, S V   ·   For all + N, S V   ·   S may V, but S V", vi: "Hai lần mỗi bài, hai khuôn khác nhau; không Although… but; albeit / despite không đi với mệnh đề." },

  { t: "h", text: "(Ngày 13 · mục 5) Liên kết ngầm — nối câu không cần từ nối" },
  {
    t: "table", head: ["Công cụ", "Ví dụ"],
    rows: [
      ["this / these + danh từ tóm tắt", "Many graduates take jobs unrelated to their degree. This mismatch is costly."],
      ["such + N", "Cities have introduced tolls and parking levies. Such measures are unpopular but effective."],
      ["the former / the latter", "Schools can raise fees or cut courses. The latter is usually chosen."],
      ["do so", "Employers are urged to offer flexible hours, but few have done so."],
      ["that of / those of", "The problems of small firms differ from those of large corporations."],
      ["The same cannot be said of…", "Wages in cities have risen. The same cannot be said of rural areas."],
    ],
  },
  { t: "rule", formula: "1 câu chẻ + 0–1 đảo ngữ + 2 nhượng bộ (khác khuôn) + this / such / the latter / do so  ≤  4 cấu trúc “nổi” / bài", vi: "Ngân sách cấu trúc cho một bài Task 2 band 8 (Ngày 13 mục 6)." },

  { t: "h", text: "(Ngày 13 · Bài 3 mục 7) Khung trả lời Part 3 triết lý – chính sách" },
  {
    t: "patterns",
    rows: [
      { formula: "That (rather) depends on what we mean by + N", vi: "Khoanh lại câu hỏi.", examples: [{ en: "That rather depends on what we mean by “acceptable”.", vi: "Điều đó còn tuỳ ta hiểu “chấp nhận được” là gì." }] },
      { formula: "In principle, S V. In practice, (though,) S V", vi: "Tách nguyên tắc và thực tế.", examples: [{ en: "In principle, adults should be free to take risks. In practice, though, someone else usually pays when it goes wrong.", vi: "Về nguyên tắc người lớn nên được tự do mạo hiểm; thực tế thì người khác thường trả giá." }] },
      { formula: "I take the point that S V, but S V", vi: "Thừa nhận rồi giữ ý.", examples: [{ en: "I take the point that experts know more, but knowing more isn't the same as having the right to decide.", vi: "Tôi hiểu chuyên gia biết nhiều hơn, nhưng biết nhiều hơn không đồng nghĩa có quyền quyết định." }] },
      { formula: "What I wouldn't accept is + N / that S V", vi: "Đặt giới hạn cho lập trường.", examples: [{ en: "What I wouldn't accept is a blanket rule of “when in doubt, ban it”.", vi: "Điều tôi không chấp nhận là quy tắc chung kiểu “nghi thì cấm”." }] },
    ],
  },
  { t: "rule", formula: "khoanh lại câu hỏi → nguyên tắc → giới hạn → ví dụ nhỏ → chốt (The test, for me, is whether S V)", vi: "Năm bước cho một câu trả lời Part 3 trừu tượng 35–45 giây." },
];
