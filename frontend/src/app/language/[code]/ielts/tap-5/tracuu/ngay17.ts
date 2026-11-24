/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 · Ngày 17 (soạn cùng `tap-5/ngay/ngay17.ts`, 24/11/2026).
 * Người ghép chép các khối này vào `tap-5/tracuu-chang3.ts` (TRA_CONG_THUC_CHANG3) và đánh số "K." liên tục cả chặng.
 * Dạng câu thi → bài ôn: xem `bai-on-ngay17.txt` (tfng · short · summary-box · ynng · match-feature → t5d17-doc; mcq · match-feature → t5d17-nghe).
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_17: Block[] = [
  { t: "h", text: "(Ngày 17 · mục 2) Mạo từ vòng 3 — bảy tình huống band 7 còn sai" },
  {
    t: "table",
    head: ["Tình huống", "Luật", "Ví dụ"],
    rows: [
      ["Nói chung về cả loại", "Ø + số nhiều / không đếm được", "Technology has changed society."],
      ["Phát minh, loài (trang trọng)", "the + số ít", "The smartphone has changed how we read."],
      ["N + of + N", "the khi xác định · a / an khi là một lượng", "the rise of online shopping · a rise of 5 %"],
      ["N trừu tượng + tính từ", "a / an", "a good education · a thorough knowledge of"],
      ["the + tính từ", "cả nhóm người, V số nhiều", "the elderly are · the unemployed need"],
      ["Cơ sở theo chức năng", "Ø", "go to university · be in hospital"],
      ["most", "most + N · most of the + N · the most + adj", "most people · most of the participants"],
    ],
  },
  { t: "rule", formula: "nói chung: Ø + N số nhiều / N không đếm được   ·   the + N + of + N   ·   a / an + adj + N trừu tượng   ·   the + adj = cả nhóm", vi: "Không có the: society · nature · space · public opinion. Có the: the environment · the economy · the media · the public." },

  { t: "h", text: "(Ngày 17 · mục 3) Số ít / số nhiều vòng 3" },
  {
    t: "table",
    head: ["Nhóm", "Nhớ"],
    rows: [
      ["Không đếm được (không -s, không a / an, V số ít)", "research · evidence · information · knowledge · advice · feedback · equipment · software · infrastructure · traffic · progress · staff"],
      ["Hai nghĩa", "experience / experiences · work / works · time / times · business / businesses · technology / technologies"],
      ["one of the + N số nhiều + V số ít", "One of the main causes is poor planning."],
      ["each of the + N số nhiều + V số ít", "Each of the proposals has a weakness."],
      ["số + N làm tính từ", "a five-year plan · a 20-per-cent rise"],
      ["million / per cent", "5 million people · millions of people · 40 per cent"],
    ],
  },
  { t: "rule", formula: "N không đếm được: much / little / a piece of + N + V số ít      |      one of the + N số nhiều + V số ít", vi: "another + số ít · other + số nhiều · others đứng một mình." },

  { t: "h", text: "(Ngày 17 · mục 4) Giới từ vòng 3 — con số · to + V-ing · giới từ + which" },
  {
    t: "patterns",
    rows: [
      { formula: "a rise in + thứ thay đổi · a rise of + mức · V + by + mức · to + điểm đến · stood / peaked / levelled off + at + mức", vi: "Giới từ của con số trong Task 1.", examples: [{ en: "Sales rose by 12 per cent to a peak of 80 million, then levelled off at 75 million.", vi: "Doanh số tăng 12 % lên đỉnh 80 triệu rồi đi ngang ở 75 triệu." }] },
      { formula: "contribute / object / lead / be committed / be used / with a view + to + V-ing", vi: "to là giới từ ⇒ V-ing hoặc danh từ.", examples: [{ en: "The city is committed to reducing emissions.", vi: "Thành phố cam kết giảm khí thải." }] },
      { formula: "the extent to which · the way in which · the rate at which · the conditions under which · the ease with which + S + V", vi: "Danh từ kéo giới từ; tìm bằng cách đặt lại thành câu đơn.", examples: [{ en: "This essay examines the extent to which advertising influences children.", vi: "Bài viết này xem xét mức độ quảng cáo ảnh hưởng tới trẻ em." }] },
    ],
  },
  { t: "rule", formula: "by 2030 = không muộn hơn   ·   until 2030 = kéo dài tới   ·   account for   ·   twice as high as", vi: "Giới từ đi theo từ đứng TRƯỚC nó, không theo nghĩa tiếng Việt." },

  { t: "h", text: "(Ngày 17 · mục 5) Dấu phẩy — sáu luật" },
  {
    t: "table",
    head: ["Luật", "Đúng"],
    rows: [
      ["① Không nối hai câu đủ bằng một dấu phẩy", "Rents are rising, and many families are moving out."],
      ["② however / therefore nối hai câu", "Prices fell; however, demand did not rise."],
      ["③ Phần mở đầu đứng trước có phẩy; because / if / that đứng sau không phẩy", "Although it is costly, the scheme works. · It works because it is simple."],
      ["④ Mệnh đề quan hệ: xác định không phẩy; thêm thông tin hai phẩy", "Workers who commute by car pay more. · My manager, who commutes by car, pays more."],
      ["⑤ Không phẩy giữa chủ ngữ và động từ, giữa động từ và that", "The main reason why people leave is cost."],
      ["⑥ Phần chen: mở phẩy thì đóng phẩy", "Governments, in my view, should act."],
    ],
  },
  { t: "rule", formula: "câu đủ S V  +  ,  +  câu đủ S V   ⇒   SAI.   Sửa:  .  |  ;  |  , and / but / so  |  because / although / as", vi: "Mỗi dấu phẩy phải trả lời được: nó tách cái gì khỏi cái gì?" },

  { t: "h", text: "(Ngày 17 · mục 6) Lượt soát 4 phút theo danh từ" },
  { t: "rule", formula: "① danh từ (a / the / Ø · -s)  →  ② động từ theo danh từ chính  →  ③ con số + to  →  ④ dấu phẩy", vi: "Đọc ngược từ câu cuối. Đích band 8: 14–16 câu, tối đa 1–2 câu có lỗi nhỏ." },

  { t: "h", text: "(Ngày 17 · Bài 2 mục 2 · 6) Reading — gọi tên phép paraphrase và ba bẫy của Đề 10" },
  {
    t: "table",
    head: ["Bẫy", "Phản xạ"],
    rows: [
      ["So sánh bị đảo chiều / hai tiêu chí (the slower of the two · longer, but… measured straight down)", "viết ra: A > B theo tiêu chí gì?"],
      ["Phạm vi bị nới (one of the first → the first · American courts → every state)", "khoanh chữ tuyệt đối trong CÂU HỎI, tìm chữ tương đương trong bài"],
      ["Phê bình ≠ phủ nhận (I do not doubt X. But Y.)", "phần trước but là điều tác giả CÔNG NHẬN"],
      ["not X but Y · not by V-ing X but by V-ing Y", "X là vế bị bác — câu hỏi hay chép X"],
    ],
  },
  { t: "rule", formula: "mỗi câu sai  →  “chữ trong bài”  ↔  “chữ trong câu hỏi”  +  tên phép đổi (đồng nghĩa · loại từ · cấu trúc · đảo chiều · góc nhìn · ý ẩn)", vi: "Nhãn nguyên nhân R1–R5: xem Ngày 9." },

  { t: "h", text: "(Ngày 17 · Bài 3 mục 2 · 8 · 9) Part 2 nơi chốn / sự kiện band 8 và Part 3 nối" },
  {
    t: "patterns",
    rows: [
      { formula: "You could + V (giác quan) + it + before + you could + V + it", vi: "Mở cận cảnh bằng một giác quan.", examples: [{ en: "You could hear it before you could see it.", vi: "Bạn nghe thấy nó trước khi nhìn thấy nó." }] },
      { formula: "What actually happened was (that) + S + V   ·   It was only + mốc + that + S + V", vi: "Sửa một điều người ta tưởng — khi nghe, đáp án thường nằm ngay sau.", examples: [{ en: "It was only the following year that they started charging.", vi: "Phải tới năm sau họ mới bắt đầu thu tiền." }] },
      { formula: "Not because + S + V. It's that + S + V   ·   In my own case…, but I'd say that's true more widely: …", vi: "Cầu nối từ chuyện mình sang chuyện chung ở Part 3.", examples: [{ en: "New festivals often fail — not because they're badly run. It's that nobody feels they own them.", vi: "Lễ hội mới hay thất bại — không phải vì tổ chức kém, mà vì không ai thấy nó là của mình." }] },
    ],
  },
  { t: "rule", formula: "định vị  →  cái lặp lại (would / every year)  →  một lần cụ thể (had V3 · was V-ing · V2 + một giác quan + một câu thoại)  →  cái đã đổi  →  ý nghĩa + câu chốt", vi: "Ngữ điệu kể chuyện: ↗ ở vế chưa xong · ↘ ở câu chốt · chậm + ngừng trước cao trào · hạ giọng ở lời chen." },
];
