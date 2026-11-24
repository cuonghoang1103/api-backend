/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 · Ngày 11 (soạn cùng `tap-5/ngay/ngay11.ts`, 24/11/2026).
 * Người ghép chép các khối này vào `tap-5/tracuu-chang2.ts` (chặng Ngày 7–12) và đánh số mục liên tục cả chặng.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_11: Block[] = [
  { t: "h", text: "(Ngày 11 · mục 1) Ngữ pháp nói — lược đầu câu" },
  {
    t: "patterns", rows: [
      { formula: "(I) + V…   ·   (I'm) + adj…   ·   (I've) + V3…", vi: "Bỏ cả cụm đầu; hợp với câu mở của câu trả lời Part 1.", examples: [{ en: "Never been, I'm afraid — though it's high on my list.", vi: "Tiếc là chưa từng đến, dù tôi rất muốn." }] },
      { formula: "(It / That) + V(s/es)…   ·   (It's) + adj / N…", vi: "Bỏ it / that khi đang nhận xét điều vừa được nhắc.", examples: [{ en: "Depends on the day, really.", vi: "Còn tuỳ hôm." }, { en: "Hard to say. Probably my grandmother.", vi: "Khó nói. Chắc là bà tôi." }] },
    ],
  },
  { t: "rule", formula: "(I / It / That) + V…  ·  (I'm / It's / I've) + phần còn lại  →  rồi nói 1–2 câu đầy đủ", vi: "Bỏ cả cụm đầu hoặc không bỏ gì: Is difficult / Am not sure là lỗi. Không dùng trong bài viết." },

  { t: "h", text: "(Ngày 11 · mục 2) Lược giữa và cuối câu" },
  {
    t: "table", head: ["Kiểu", "Khung", "Ví dụ"],
    rows: [
      ["Sau từ hỏi", "…V + who / what / why / where / how", "Somebody recommended it — I can't remember who."],
      ["Sau modal hoàn thành", "should / might / must + have (+ been)", "I didn't take a gap year. I probably should have."],
      ["Sau to", "meant to · used to · not to · would rather not (không to)", "I always meant to, but never got round to it."],
      ["Mệnh đề if hai từ", "few…, if any, · rarely, if ever, · If so / If not,", "Very few people, if any, read the terms."],
    ],
  },
  { t: "rule", formula: "…V + who / why  ·  should / might / must + have (+ been)  ·  meant to / not to  ·  few…, if any,  ·  rarely, if ever,", vi: "Giữ đúng một cái móc rồi dừng. Việc quá khứ thì móc phải có have." },

  { t: "h", text: "(Ngày 11 · mục 3) Thay từ và ngôn ngữ ước chừng" },
  {
    t: "table", head: ["Công cụ", "Thay cho", "Ví dụ"],
    rows: [
      ["do so", "một hành động vừa nêu", "People are told to save more, but few actually do so."],
      ["one / ones", "danh từ đếm được", "The old library was cramped; the new one is twice the size."],
      ["the same", "cả một nhận xét", "My brother hates crowds, and I'm the same."],
      ["and that sort of thing", "phần còn lại của danh sách (sau ≥ 2 ví dụ)", "rent, bills and that sort of thing"],
      ["số + or so · -ish · give or take", "con số gần đúng", "an hour or so · sevenish · forty people, give or take"],
    ],
  },
  { t: "rule", formula: "S + V…, but few + do so  ·  adj + one(s)  ·  N, N + and that sort of thing  ·  số + or so / -ish", vi: "Ước chừng chỉ đứng sau nội dung cụ thể; mỗi câu trả lời một lần." },

  { t: "h", text: "(Ngày 11 · mục 4) Câu phức kiểu nói" },
  {
    t: "patterns", rows: [
      { formula: "N + (that) + S + V + giới từ", vi: "Mệnh đề quan hệ kiểu nói: bỏ đại từ, giới từ về cuối.", examples: [{ en: "It's something I'd never really thought about.", vi: "Đó là chuyện tôi chưa từng nghĩ tới." }] },
      { formula: "From what I've seen / As far as I can tell / If I'm honest, + S + V", vi: "Mệnh đề bình luận: ý này dựa trên gì, chắc tới đâu.", examples: [{ en: "From what I've seen, most people learn faster in pairs.", vi: "Theo những gì tôi thấy, đa số học nhanh hơn khi học đôi." }] },
      { formula: "S + V — not that + S + V", vi: "Chặn trước một suy diễn sai.", examples: [{ en: "I rarely go to the cinema — not that I don't like films.", vi: "Tôi hiếm khi đi xem phim — không phải là tôi không thích phim." }] },
      { formula: "Suppose / Say + S + V-ed, would + S + V?   ·   If it weren't for / hadn't been for + N, S + would (have)…", vi: "Giả định kiểu nói.", examples: [{ en: "If it hadn't been for the scholarship, I wouldn't have gone to university at all.", vi: "Nếu không nhờ học bổng thì tôi đã chẳng học đại học." }] },
    ],
  },
  { t: "rule", formula: "N + S + V + giới từ  ·  From what I've seen, S + V  ·  S + V — not that + S + V  ·  Say + S + V-ed, would…?", vi: "Khung của lời nói; khung viết tương ứng (with whom · Evidence suggests · Were… to…) để dành cho Task 2." },

  { t: "h", text: "(Ngày 11 · mục 5) Rào đón bằng would / must + have khi nói" },
  {
    t: "patterns", rows: [
      { formula: "I'd have thought (that) + S + would + V", vi: "“Tôi cứ tưởng là…” — ngạc nhiên / chưa bị thuyết phục.", examples: [{ en: "I'd have thought a city this size would have a decent bus service.", vi: "Tôi cứ nghĩ thành phố cỡ này phải có xe buýt tử tế chứ." }] },
      { formula: "You'd think (that) + S + would + V, but + S + V", vi: "Nêu điều hợp lý rồi lật bằng thực tế.", examples: [{ en: "You'd think people would save more as they earn more, but they don't.", vi: "Ai cũng nghĩ kiếm nhiều thì tiết kiệm nhiều hơn, nhưng không phải vậy." }] },
      { formula: "I wouldn't say (that) + S + V   ·   I couldn't tell you + wh-   ·   S + must have / can't have + V3", vi: "Phản đối nhẹ; nhận là không biết chính xác; đoán về quá khứ.", examples: [{ en: "It's popular, but I wouldn't say it's good.", vi: "Nó phổ biến, nhưng tôi không cho là nó hay." }] },
    ],
  },
  { t: "rule", formula: "I'd have thought + S + would + V  ·  You'd think + S + would + V, but…  ·  I wouldn't say + S + V  ·  S + must have / can't have + V3", vi: "Mỗi lượt Part 3 dùng mỗi khung một lần." },

  { t: "h", text: "(Ngày 11 · mục 6) Đưa ra trước và nói lại cho rõ" },
  {
    t: "patterns", rows: [
      { formula: "That + S + V   ·   Wh- / Whether + S + V, + S + V (không đảo)", vi: "Kéo phần đang bàn lên đầu.", examples: [{ en: "Whether it'll last, I'm not so sure.", vi: "Còn nó có bền không thì tôi không chắc lắm." }] },
      { formula: "…, or rather, …   ·   Put it this way: + S + V   ·   …, if that makes sense.", vi: "Tự sửa có đánh dấu; nói lại ý bằng cách khác.", examples: [{ en: "It's cheap — or rather, it's cheaper than the alternatives.", vi: "Nó rẻ — hay đúng hơn là rẻ hơn các lựa chọn khác." }] },
    ],
  },
  { t: "rule", formula: "That + S + V  ·  Wh- + S + V, + S + V  ·  …, or rather, …  ·  Put it this way: S + V  ·  …, if that makes sense.", vi: "Sửa lời một lần, có đánh dấu, rồi đi tiếp." },

  { t: "h", text: "(Ngày 11 · mục 7) Đọc triết học / kinh tế học — bản đồ lập luận" },
  {
    t: "table", head: ["Chữ ghi ở lề", "Việc của đoạn", "Tín hiệu"],
    rows: [
      ["C", "Chủ trương", "X argued / held that… · the doctrine that… · On this view,"],
      ["V", "Ví dụ / thí nghiệm tưởng tượng / mô hình", "Imagine that… · Suppose… · Consider…"],
      ["P", "Phản bác", "later critics have questioned · Perhaps… · More subtly,"],
      ["Đ", "Đáp lại", "Defenders point out · are not without a response · Besides,"],
      ["T", "Tác giả cân", "It would be rash to say… · What the debate has shown is…"],
    ],
  },
  { t: "rule", formula: "Mỗi đoạn một chữ: C · V · P · Đ · T  →  câu hỏi hỏi việc gì thì về đúng đoạn có chữ đó", vi: "Thuật ngữ lạ luôn được định nghĩa ngay cạnh: N, the doctrine that… · …, a tendency psychologists label N." },

  { t: "h", text: "(Ngày 11 · mục 8) Idiom dùng khéo, paraphrase câu hỏi, trọng âm chuỗi" },
  {
    t: "table", head: ["Việc", "Khung / luật", "Ví dụ"],
    rows: [
      ["Bốn phép thử idiom", "đúng nghĩa → đúng dạng → đúng giọng → đúng liều (+ bỏ đi có mất nghĩa không)", "she'd bitten off more than she could chew"],
      ["Câu mở Part 3", "trả lời thẳng + 1–2 từ khoá đã đổi", "influences what people buy → It definitely shapes our choices."],
      ["Thiếu từ", "It's a sort of N that… · for want of a better word", "The atmosphere was, for want of a better word, flat."],
      ["Trọng âm chuỗi", "một đỉnh ở từ nội dung cuối; cụm động từ: đỉnh ở tiểu từ", "a pinch of SALT · back to square ONE · rubbed OFF on me"],
    ],
  },
  { t: "rule", formula: "Câu mở = trả lời thẳng + từ khoá đã đổi  ·  idiom: 2–3 cái mỗi Part 2, nằm giữa câu có chi tiết  ·  đỉnh giọng ở từ nội dung cuối", vi: "Trượt một phép thử thì nói câu thường." },
];
