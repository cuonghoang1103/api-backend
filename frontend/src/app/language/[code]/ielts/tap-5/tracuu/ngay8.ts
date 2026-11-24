/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 · Ngày 8 (ngày làm Đề 9; soạn cùng `tap-5/ngay/ngay8.ts`, 24/11/2026).
 * Người ghép chép các khối này vào `tap-5/tracuu-chang2.ts` (chặng Ngày 7–12) và đánh số mục liên tục cả chặng.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_8: Block[] = [
  { t: "h", text: "(Ngày 8 · mục 1) Giới từ và collocation của từ vòng 2 — Crime · Business · Ageing" },
  {
    t: "table", head: ["Chủ đề", "Cụm đúng", "Lỗi hay gặp"],
    rows: [
      ["Crime", "be acquitted **of** · be prosecuted **for** · be convicted **of** · be released **on** parole · a custodial / non-custodial sentence", "~~acquitted from~~ · ~~prosecuted because of~~"],
      ["Business", "cover overheads · squeeze profit margins · benefit from **economies** of scale · a monopoly **on** · diversify **into**", "~~economy of scales~~ · stakeholder ≠ shareholder"],
      ["Ageing", "live **with** dementia · below replacement level · claim the state pension · place a parent **in** residential care", "~~the olds~~ · fertility rate ≠ birth rate · ~~was retired at 60~~"],
    ],
  },
  { t: "rule", formula: "retribution · deterrence · rehabilitation", vi: "Ba mục đích của hình phạt — khung cho mọi đề Crime (Task 2 và Part 3)." },

  { t: "h", text: "(Ngày 8 · mục 2) Writing 60 phút — bốn mốc đồng hồ" },
  {
    t: "table", head: ["Phút", "Việc"],
    rows: [
      ["0–3", "Task 1: đọc hình, phân loại, nghĩ câu overview"],
      ["3–17", "Viết Task 1 (170–190 từ)"],
      ["17–20", "Soát Task 1 — rồi chuyển"],
      ["20–25", "Task 2: dàn ý (đếm vế, 2 ý mỗi thân bài, câu xếp hạng)"],
      ["25–55", "Viết Task 2 (280–320 từ)"],
      ["55–60", "Soát Task 2 — 3 lượt theo sổ lỗi cá nhân"],
    ],
  },
  { t: "rule", formula: "Task 1: 3′ đọc + 14′ viết + 3′ soát  ·  Task 2: 5′ dàn ý + 30′ viết + 5′ soát", vi: "Nhìn đồng hồ ở phút 3 · 20 · 25 · 55. Phút 53 chưa có kết bài ⇒ viết kết ngay." },

  { t: "h", text: "(Ngày 8 · mục 3) Map hai mốc band 8" },
  {
    t: "table", head: ["Loại thay đổi", "Động từ", "Giới từ"],
    rows: [
      ["Giữ nguyên", "remain unchanged · be retained", "—"],
      ["Giữ vỏ, đổi công năng", "be converted / turned", "into"],
      ["Bỏ cũ, xây mới", "be replaced · make way · give way", "by · for · to"],
      ["Mới hẳn", "be built · be laid · be added", "along · beside · on the site of"],
      ["Vị trí", "lie · stand · be located", "in the north-east · to the south of · on the waterfront · at the eastern end"],
    ],
  },
  { t: "rule", formula: "Overview = vai trò cũ → vai trò mới + cái còn lại  ·  thân bài theo KHU  ·  mốc “today” ⇒ has / have been + V3", vi: "Không nêu nguyên nhân, không thêm năm tháng ngoài bản đồ." },

  { t: "h", text: "(Ngày 8 · mục 4) Problem / solution band 8 — giải pháp bốn phần + câu xếp hạng" },
  {
    t: "patterns", rows: [
      { formula: "If + S + were + V3, S + would + V", vi: "Giải pháp như một giả định, kèm kết quả.", examples: [{ en: "If evening buses were subsidised, far more commuters would leave their cars at home.", vi: "Nếu xe buýt buổi tối được trợ giá, nhiều người đi làm hơn hẳn sẽ để ô tô ở nhà." }] },
      { formula: "Such + N + would + V, but + S + V", vi: "Nêu cái giá rồi cân lại.", examples: [{ en: "Such a scheme would be costly to run, but the cost is modest beside that of doing nothing.", vi: "Một chương trình như vậy sẽ tốn kém, nhưng chi phí ấy nhỏ so với cái giá của việc không làm gì." }] },
      { formula: "Of the two measures, it is + the former / the latter + that + V", vi: "Câu xếp hạng hai giải pháp.", examples: [{ en: "Of the two measures, it is the latter that is likely to produce results within a few years.", vi: "Trong hai biện pháp, chính biện pháp sau mới có khả năng cho kết quả trong vài năm." }] },
    ],
  },
  { t: "rule", formula: "Giải pháp = AI + LÀM GÌ + since / because (vì sao có tác dụng) + but (giới hạn)  →  Of the two measures, it is… that…", vi: "Hai giải pháp sâu hơn bốn giải pháp nông; giả định ⇒ would / could." },

  { t: "h", text: "(Ngày 8 · mục 5) Listening — giờ đọc trước, luật 5 giây, 2 phút kiểm" },
  {
    t: "table", head: ["Lúc", "Việc"],
    rows: [
      ["Giờ đọc trước", "giới hạn từ → loại đáp án → từ khoá câu hỏi → (matching) đọc hộp trước"],
      ["Đang nghe, lỡ một câu", "ghi phỏng đoán → nhảy sang câu kế (luật 5 giây)"],
      ["2 phút cuối", "ô trống → giới hạn từ → số ít / nhiều → chính tả → số → chữ cái"],
      ["Sau đề", "phân loại câu sai: A không nghe ra âm · B viết sai · C dính bẫy · D lạc chỗ · E đọc đề không kịp"],
    ],
  },
  { t: "rule", formula: "2 phút = ô trống → giới hạn từ → số ít / nhiều → chính tả → số → chữ cái", vi: "Bẫy band 7.5: sửa lời, bác đề xuất, phủ định ẩn, hai con số — đáp án thường là cái nói SAU." },
];
