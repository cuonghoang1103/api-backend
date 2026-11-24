/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 Ngày 3 (soạn cùng tap-5/ngay/ngay3.ts, 24/11/2026).
 * Phiên ghép chặng 1 chép mảng này vào `tap-5/tracuu-chang1.ts` (đánh lại số thứ tự mục cho liên tục cả chặng).
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_3: Block[] = [
  { t: "h", text: "(Ngày 3 · mục 1) Truy lỗi dai dẳng — 5 bước" },
  {
    t: "table", head: ["Bước", "Việc làm"],
    rows: [
      ["Gom", "3 bài viết gần nhất đã chấm + Sổ lỗi"],
      ["Gạch", "tô 3 màu: chủ – vị · mạo từ · giới từ"],
      ["Đếm", "kiểu lỗi nào ≥ 2 lần = lỗi dai dẳng"],
      ["Viết quy tắc", "một dòng, bằng lời của mình"],
      ["Soát ngược", "mỗi lượt chỉ tìm MỘT kiểu lỗi, đọc từ câu cuối lên"],
    ],
  },
  { t: "rule", formula: "Lỗi lặp ≥ 2 lần ⇒ viết quy tắc một dòng ⇒ mỗi lượt soát chỉ tìm một kiểu lỗi", vi: "Band 7: còn vài lỗi dai dẳng. Band 8: chỉ sai lặt vặt rất hiếm." },

  { t: "h", text: "(Ngày 3 · mục 2) Chủ – vị với chủ ngữ dài — tìm danh từ chính" },
  {
    t: "patterns",
    rows: [
      { formula: "N chính + giới từ + N khác + V (theo N chính)", vi: "Cụm giới từ không quyết định động từ.", examples: [{ en: "The rise in the number of private vehicles has put pressure on city centres.", vi: "Sự gia tăng số xe cá nhân đã gây áp lực lên trung tâm thành phố." }] },
      { formula: "N chính + who / which / that + … + V (theo N chính)", vi: "Bỏ qua mệnh đề quan hệ khi chia động từ chính.", examples: [{ en: "The argument that longer sentences reduce crime rests on weak evidence.", vi: "Lập luận rằng án dài hơn làm giảm tội phạm dựa trên bằng chứng yếu." }] },
      { formula: "one of + N số nhiều + V số ít · one of + N số nhiều + who / that + V số nhiều", vi: "Động từ chính theo one; động từ trong mệnh đề quan hệ theo danh từ số nhiều.", examples: [{ en: "Cost is one of the factors that influence this decision.", vi: "Chi phí là một trong những yếu tố ảnh hưởng tới quyết định này." }] },
    ],
  },
  { t: "rule", formula: "Gạch cụm giới từ + mệnh đề quan hệ → N chính + V", vi: "V-ing và mệnh đề What… làm chủ ngữ ⇒ luôn số ít." },

  { t: "h", text: "(Ngày 3 · mục 3) Mười chủ ngữ bẫy" },
  {
    t: "table", head: ["Chủ ngữ", "Động từ", "Ví dụ"],
    rows: [
      ["The number of + Ns", "số ít", "The number of applicants has fallen."],
      ["A number of + Ns", "số nhiều", "A number of studies have shown this."],
      ["Each / Every / Either / Neither (+ of…)", "số ít", "Each of these solutions has a cost."],
      ["research, evidence, advice, information, equipment", "số ít", "The evidence suggests otherwise."],
      ["criteria · phenomena · data · media", "số nhiều (học thuật)", "The criteria are unclear."],
      ["A as well as / along with / together with B", "theo A", "The teacher, along with her students, was present."],
      ["Either A or B · Neither A nor B · Not only A but also B", "theo B", "Neither the minister nor his advisers were aware."],
      ["% / phân số / most / half + of + N", "theo N", "Two thirds of the land is farmed."],
      ["The + tính từ · the police", "số nhiều", "The elderly are particularly at risk."],
      ["There + be · đảo ngữ", "theo danh từ đứng sau", "Among the causes is a lack of funding."],
    ],
  },
  { t: "rule", formula: "The number of + Ns + V(s/es) · A number of + Ns + V", vi: "The number = con số (số ít). A number = nhiều (số nhiều)." },

  { t: "h", text: "(Ngày 3 · mục 4) Mạo từ — bốn câu hỏi theo thứ tự" },
  {
    t: "table", head: ["Câu hỏi", "Kết quả", "Ví dụ"],
    rows: [
      ["① Người đọc biết cái nào chưa? (đã nhắc · duy nhất · có of / mệnh đề xác định)", "the", "the cost of living · the government · the same problem"],
      ["② Chưa biết + đếm được số ít?", "a / an (bắt buộc)", "a solution · an issue · He is an engineer."],
      ["③ Chưa biết + số nhiều / không đếm được, nói chung?", "không mạo từ", "Society · technology · children · research"],
      ["④ Cụm cố định?", "thuộc lòng", "in recent years · most people · at university · the number of · the UK"],
    ],
  },
  { t: "rule", formula: "N đếm được số ít ⇒ luôn có a / an / the · N trừu tượng nói chung ⇒ không mạo từ · N + of … ⇒ the", vi: "Ba kiểm tra bắt được phần lớn lỗi mạo từ của người Việt ở band 7." },

  { t: "h", text: "(Ngày 3 · mục 5–6) Giới từ sau danh từ · động từ · tính từ" },
  {
    t: "table", head: ["Giới từ", "Đi sau"],
    rows: [
      ["in", "increase, rise, fall, decline, change, improvement, investment, interest · result in · invest in · participate in · involved in"],
      ["of + con số", "an increase of 10% (in sales)"],
      ["for", "reason, demand, need, responsibility, support, case · responsible for · account for · eligible for"],
      ["to", "solution, alternative, threat, damage, access, approach, response · similar to · vulnerable to · prone to · contribute / object / be committed to + V-ing"],
      ["on", "effect, impact, influence, emphasis, ban, tax, reliance · depend / rely / focus / spend … on"],
      ["of", "cause, lack, risk, cost, awareness · aware / capable / independent of · consist of"],
      ["between · over · into · with · from", "difference / link / gap between · control / advantage over · research / insight into · consistent / associated / comply with · different / benefit / result from"],
      ["KHÔNG giới từ", "discuss · mention · emphasise · stress · lack · access · enter · reach · contact · affect · approach · address · comprise"],
      ["Số liệu", "rise by 5% (lượng) · rise to 20% (đích) · stand / peak at 20% · from 2000 to 2010 · between 2000 and 2010"],
    ],
  },
  { t: "rule", formula: "discuss + O (không about) · contribute to + V-ing · rise by 5% to 20%", vi: "Ba kiểu lỗi giới từ: thừa, thiếu V-ing sau to-giới từ, nhầm by / to." },

  { t: "h", text: "(Ngày 3 · mục 7) Soát ngược ba lượt — 3 phút cuối bài" },
  {
    t: "table", head: ["Lượt", "Chỉ tìm", "Cách làm"],
    rows: [
      ["1 · 60 giây", "Động từ chính", "Đọc từ câu cuối lên; ở mỗi động từ chia, chỉ vào danh từ chính của nó"],
      ["2 · 60 giây", "Danh từ đếm được số ít", "Phải có từ ở ô 1 (a / the / this / its); xoá the trước danh từ trừu tượng nói chung"],
      ["3 · 60 giây", "Giới từ", "Dừng ở mỗi of / in / on / to / for; đối chiếu danh sách lỗi của riêng mình"],
    ],
  },

  { t: "h", text: "(Ngày 3 · Đọc mục 2) True / False / Not Given câu dài — chẻ vế" },
  {
    t: "table", head: ["Bước", "Việc làm"],
    rows: [
      ["① Chẻ", "gạch chéo ở and / but / because / which / who / although"],
      ["② Chữ nhỏ", "only · first · most · all · mainly · before · never"],
      ["③ Định vị", "bắt đầu từ vế có tên riêng, năm, thuật ngữ"],
      ["④ Kiểm từng vế", "✓ khớp · ✗ trái · ? không có"],
      ["⑤ Kết luận", "có ✗ ⇒ FALSE · không ✗, có ? ⇒ NOT GIVEN · toàn ✓ ⇒ TRUE"],
    ],
  },
  { t: "rule", formula: "Một vế ✗ ⇒ FALSE · không ✗ nhưng một vế ? ⇒ NOT GIVEN · mọi vế ✓ ⇒ TRUE", vi: "Suy luận hợp lệ: nếu điều ngược lại xảy ra thì bài viết thành mâu thuẫn." },

  { t: "h", text: "(Ngày 3 · Nói mục 2) Part 1 band 8 — khung ba nhịp" },
  {
    t: "patterns",
    rows: [
      { formula: "Not really, to be honest — I + V… , though I do + V…", vi: "Phủ nhận nhẹ rồi đính chính một phần.", examples: [{ en: "Not really, to be honest — I'm not much of a morning person, though I do make an effort on exam days.", vi: "Thật ra là không — tôi không phải người của buổi sáng, dù ngày thi thì tôi có cố." }] },
      { formula: "I used to + V…, but these days I tend to + V…", vi: "So xưa – nay trong một hơi.", examples: [{ en: "I used to read on paper all the time, but these days I tend to listen to audiobooks on the bus instead.", vi: "Trước tôi toàn đọc sách giấy, nhưng dạo này tôi hay nghe sách nói trên xe buýt hơn." }] },
      { formula: "It depends on + N / whether… . If…, I'll… ; otherwise…", vi: "Chia hai trường hợp.", examples: [{ en: "It depends on who I'm with. If it's close friends, I'll happily chat for hours; otherwise I'm fairly quiet.", vi: "Còn tuỳ tôi đi với ai. Bạn thân thì tôi nói hàng giờ; còn không thì tôi khá ít nói." }] },
      { formula: "…, which + V… (nhận xét về cả ý trước)", vi: "Mệnh đề quan hệ bình luận.", examples: [{ en: "My flat is right above a café, which sounds lovely until the grinder starts at six.", vi: "Căn hộ của tôi ở ngay trên một quán cà phê, nghe thì thích cho tới khi máy xay chạy lúc sáu giờ." }] },
    ],
  },
  { t: "rule", formula: "Trả lời thẳng → thu hẹp → một chi tiết riêng (2–3 câu, 15–20 giây)", vi: "Idiom: đúng nguyên dạng · đúng chỗ · đúng liều (2–3 cụm cho cả Part 1)." },
];
