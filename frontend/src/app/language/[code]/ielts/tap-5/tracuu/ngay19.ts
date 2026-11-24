/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 Ngày 19 (soạn cùng tap-5/ngay/ngay19.ts, 24/11/2026).
 * Phiên ghép chặng 4 chép mảng này vào `tap-5/tracuu-chang4.ts` (đánh lại số thứ tự mục cho liên tục cả chặng).
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_19: Block[] = [
  { t: "h", text: "(Ngày 19 · mục 2) Điều kiện hỗn hợp band 8 — bốn hướng thời gian" },
  {
    t: "patterns",
    rows: [
      { formula: "If S had V3 (quá khứ), S would / might + V (nay)", vi: "Quá khứ khác đi → hiện tại khác đi; thêm now / today / still.", examples: [{ en: "If cities had invested in public transport decades ago, far fewer people would depend on cars today.", vi: "Nếu các thành phố đầu tư giao thông công cộng từ vài thập kỷ trước, hôm nay đã ít người phụ thuộc ô tô hơn nhiều." }] },
      { formula: "If S had V3, S would now be V-ing", vi: "Hệ quả là một tình trạng đang kéo dài.", examples: [{ en: "Had the warnings been heeded, we would not now be facing such severe water shortages.", vi: "Nếu những cảnh báo được lắng nghe, giờ đây ta đã không phải đối mặt với thiếu nước nghiêm trọng như vậy." }] },
      { formula: "If S V-ed / were (nay, lâu dài), S would have V3 (quá khứ)", vi: "Đặc điểm thường trực khác đi → việc quá khứ đã khác đi.", examples: [{ en: "If the region were less dependent on a single industry, the factory's closure would not have been so devastating.", vi: "Nếu vùng này không quá phụ thuộc một ngành, việc nhà máy đóng cửa đã không tàn khốc đến thế." }] },
      { formula: "If S had V3 (quá khứ), S would + V (tương lai, có mốc)", vi: "Quá khứ khác đi → việc sắp tới khác đi.", examples: [{ en: "If the bridge had been approved last spring, it would open to traffic next year.", vi: "Nếu cây cầu được duyệt từ mùa xuân năm ngoái, nó đã thông xe vào năm sau." }] },
    ],
  },
  { t: "rule", formula: "If S had V3 → S would (now) V / would now be V-ing   ·   If S V-ed / were → S would have V3", vi: "Vế if giữ thời gian của điều giả định, vế chính giữ thời gian của hệ quả; would / might / could theo mức chắc." },

  { t: "h", text: "(Ngày 19 · mục 3) Điều kiện ngầm — giả định không có if" },
  {
    t: "table", head: ["Khuôn", "Ví dụ"],
    rows: [
      ["But for / Without + N, S would (have) V3", "But for the vaccine, the disease would still be killing millions every year."],
      ["…; otherwise, S would (have) V3", "The rules were relaxed in 2015; otherwise, the company would have moved abroad."],
      ["N (chủ ngữ) + would / could", "A complete ban would simply push the trade underground."],
      ["To V (chủ ngữ) + would", "To abandon the scheme now would waste ten years of work."],
      ["Supposing / Assuming (that) + S V", "Assuming that funding stays the same, the waiting list will double."],
      ["In the event of + N", "In the event of a power cut, the backup system starts automatically."],
      ["Had / Were / Should + S …", "Should the policy fail, the cost will fall on taxpayers."],
    ],
  },
  { t: "rule", formula: "But for / Without + N, S would (have) V3   ·   …; otherwise, S would (have) V3   ·   N / To V + would V", vi: "Khi đoạn đã có một if, chuyển giả định sau vào cụm danh từ, cụm giới từ hoặc otherwise." },

  { t: "h", text: "(Ngày 19 · mục 4) Thức giả định — câu đề xuất và quá khứ không thật" },
  {
    t: "patterns",
    rows: [
      { formula: "S recommend / insist / propose / demand that S (not) V", vi: "V nguyên mẫu trần cho mọi chủ ngữ; phủ định not + V.", examples: [{ en: "The report recommends that every new building be fitted with solar panels.", vi: "Báo cáo đề xuất mọi toà nhà mới phải được lắp tấm pin mặt trời." }] },
      { formula: "It is essential / vital / imperative that S (not) V", vi: "Sau tính từ chỉ sự cần thiết.", examples: [{ en: "It is vital that patients not be discharged before a follow-up appointment has been arranged.", vi: "Điều sống còn là bệnh nhân không được cho xuất viện trước khi có lịch tái khám." }] },
      { formula: "N (requirement / insistence / recommendation) that S V", vi: "Sau danh từ cùng họ.", examples: [{ en: "The requirement that every applicant have a degree excludes many talented people.", vi: "Yêu cầu mọi ứng viên phải có bằng loại ra nhiều người tài." }] },
      { formula: "It is (high) time S V-ed · would rather S V-ed · as if S were", vi: "Quá khứ không thật, nghĩa hiện tại.", examples: [{ en: "It is high time that cities treated cycling as transport rather than leisure.", vi: "Đã đến lúc các thành phố coi đạp xe là phương tiện đi lại chứ không phải giải trí." }] },
    ],
  },
  { t: "table", head: ["Cụm cố định", "Nghĩa"], rows: [["Be that as it may, …", "dù sao đi nữa"], ["Suffice it to say (that) …", "chỉ cần nói rằng…"], ["If need be, …", "nếu cần"], ["Come what may, …", "dù chuyện gì xảy ra (khi nói)"], ["Far be it from me to V, but …", "tôi không dám…, nhưng… (chỉ khi nói)"]] },
  { t: "rule", formula: "recommend / essential / insistence + that + S + (not) V   ·   It is high time S V-ed", vi: "Một câu giả định cho phần đề xuất của bài." },

  { t: "h", text: "(Ngày 19 · mục 5) Dấu câu vòng 3 — tám quy tắc làm rõ cấu trúc" },
  {
    t: "table", head: ["Quy tắc", "Đúng"],
    rows: [
      ["① Không phẩy giữa chủ ngữ dài và động từ", "The number of people who work from home at least once a week has doubled."],
      ["② If / When / Although đứng đầu: có phẩy", "If demand drops, prices will fall."],
      ["③ however nối hai mệnh đề: ; however, — giữa câu: cặp phẩy", "Costs rose; however, demand stayed high. · Demand, however, stayed high."],
      ["④ Mệnh đề không xác định: cặp phẩy, không that", "My brother, who lives in Hue, is a doctor."],
      ["⑤ Dấu hai chấm sau mệnh đề đủ", "There are three main causes: cost, distance and time."],
      ["⑥ Cặp gạch ngang — 0–1 lần mỗi bài", "The policy — popular as it was — failed within a year."],
      ["⑦ Gạch nối tính từ ghép trước danh từ; không gạch sau -ly", "a long-term plan · in the long term · a highly paid job"],
      ["⑧ Số và sở hữu kiểu Anh", "1,500 people · 2.5% · the 1990s · its own · the countries' policies"],
    ],
  },
  { t: "rule", formula: "S dài + V  ·  If…, S V  ·  S V; however, S V  ·  mệnh đề đủ: a, b and c  ·  long-term N  ·  1,500 / 2.5", vi: "Đặt dấu câu theo cấu trúc của câu, không theo chỗ ngừng thở." },

  { t: "h", text: "(Ngày 19 · Bài 3 mục 5) Câu trả lời Part 3 band 8 — tóm, phản hồi, giả định" },
  {
    t: "patterns",
    rows: [
      { formula: "The usual assumption is that S V, and there's something in that.", vi: "Tóm + thừa nhận phần đúng.", examples: [{ en: "The usual assumption is that sitting at the front makes you a better student, and there's something in that.", vi: "Người ta thường cho rằng ngồi bàn đầu khiến bạn học tốt hơn, và điều đó cũng có phần đúng." }] },
      { formula: "That's true up to a point, but what it leaves out is N / that S V.", vi: "Phản hồi có giới hạn.", examples: [{ en: "That's true up to a point, but what it leaves out is the kind of person who chooses that seat.", vi: "Điều đó đúng ở một mức, nhưng cái nó bỏ sót là kiểu người chọn chỗ ngồi đó." }] },
      { formula: "If S had V3, S would (probably) now V.  ·  Take away N, and S V.", vi: "Giả định — một câu mỗi câu trả lời.", examples: [{ en: "Take away the choice, and you find out what the seat itself does.", vi: "Bỏ quyền chọn đi, và bạn sẽ biết chỗ ngồi tự nó có tác dụng gì." }] },
      { formula: "So, on balance, I'd say S V — at least until N.", vi: "Chốt có giới hạn.", examples: [{ en: "So, on balance, I'd say the seat matters far less than people think, at least until someone runs a proper experiment.", vi: "Vậy nhìn chung, chỗ ngồi ít quan trọng hơn người ta nghĩ, ít nhất cho tới khi có thí nghiệm đàng hoàng." }] },
    ],
  },
  { t: "rule", formula: "The usual assumption is… → true up to a point, but what it leaves out is… → because… → If S had V3, S would now V → So, on balance, …", vi: "Năm bước, 40–50 giây." },

  { t: "h", text: "(Ngày 19 · Bài 3 mục 6) Dạng yếu trong câu giả định" },
  { t: "table", head: ["Viết", "Nói"], rows: [["would have", "would've /wʊdəv/"], ["wouldn't have", "/wʊdntəv/"], ["could / might / should have", "/kʊdəv/ · /maɪtəv/ · /ʃʊdəv/"], ["I had / I would", "I'd /aɪd/ — phân biệt bằng V3 hay V sau nó"], ["Had I known… (đảo ngữ)", "Had đọc mạnh /hæd/"]] },
];
