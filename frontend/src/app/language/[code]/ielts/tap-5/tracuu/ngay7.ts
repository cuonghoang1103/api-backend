/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 · Ngày 7 (soạn cùng `tap-5/ngay/ngay7.ts`, 24/11/2026).
 * Người ghép chép các khối này vào `tap-5/tracuu-chang2.ts` (chặng Ngày 7–12) và đánh số mục liên tục cả chặng.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_7: Block[] = [
  { t: "h", text: "(Ngày 7 · mục 1) Process — bị động hay chủ động?" },
  {
    t: "table", head: ["Loại bước", "Dạng", "Ví dụ"],
    rows: [
      ["Có người / máy làm", "S + is / are + V3", "The trees are tapped in late winter."],
      ["Tự xảy ra (evaporate, melt, harden, thicken, flow, cool…)", "S + V(s/es)", "The liquid gradually thickens and darkens."],
      ["Nội động từ: occur, take place, remain, last, appear, consist of", "S + V(s/es) — không bao giờ bị động", "Fermentation takes place in sealed tanks."],
    ],
  },
  { t: "rule", formula: "Có người / máy tác động ⇒ S + is / are + V3  ·  tự xảy ra ⇒ S + V(s/es)", vi: "Hỏi “có ai làm không?” cho từng ô của sơ đồ. rise (tự lên) ≠ raise (ai đó nâng)." },

  { t: "h", text: "(Ngày 7 · mục 2) Bốn dạng bị động “có thêm nghĩa”" },
  {
    t: "patterns", rows: [
      { formula: "S + is / are + left / allowed + to V", vi: "Bước để yên cho tự xảy ra.", examples: [{ en: "The mixture is left to ferment for six months.", vi: "Hỗn hợp được để lên men sáu tháng." }] },
      { formula: "before / after + being + V3", vi: "Gộp hai bước; sau giới từ phải có being.", examples: [{ en: "The fruit is washed before being sliced.", vi: "Trái cây được rửa trước khi được thái lát." }] },
      { formula: "Once S + has / have + been + V3, S + V", vi: "Bước trước xong hẳn rồi mới tới bước sau.", examples: [{ en: "Once the sap has been collected, it is taken to the sugarhouse.", vi: "Khi nhựa cây đã được thu xong, nó được đưa về nhà nấu đường." }] },
      { formula: "S + must / can + be + V3", vi: "Điều kiện, khả năng — chỉ khi sơ đồ có ghi.", examples: [{ en: "The syrup must be bottled while it is still hot.", vi: "Xi-rô phải được đóng chai khi còn nóng." }] },
    ],
  },
  { t: "rule", formula: "is / are left to V  ·  after / before being V3  ·  Once S has been V3,  ·  must / can be V3", vi: "Mỗi bài process band 8 dùng 2–3 dạng, mỗi dạng một lần." },

  { t: "h", text: "(Ngày 7 · mục 3) Rút gọn trong process — ba vị trí" },
  {
    t: "table", head: ["Vị trí", "Cấu trúc", "Ví dụ"],
    rows: [
      ["Sau danh từ", "N + V3 (bị xử lý) · N + V-ing (tự làm) · N, now + adj / N,", "The sap collected in this way… · The water remaining in the tank… · The liquid, now a deep amber colour, …"],
      ["Đầu câu", "Once / When + V3, S + V · Having been + V3, S + V", "Once filtered, the syrup is graded by colour."],
      ["Cuối câu", "S + V, + V-ing (kết quả) · , thereby + V-ing · , with + N + V-ing", "The water evaporates, leaving a layer of salt crystals."],
    ],
  },
  { t: "rule", formula: "Once + V3, S + V  ·  S + V, + V-ing  ·  S + V, with + N + V-ing", vi: "Chủ ngữ ngầm của V3 / V-ing phải là chủ ngữ của mệnh đề chính; mỗi câu vẫn còn một động từ chia thì." },

  { t: "h", text: "(Ngày 7 · mục 4) Academic Phrasebank cho trình tự (Task 1)" },
  {
    t: "table", head: ["Cụm", "Theo sau là", "Ví dụ"],
    rows: [
      ["The process begins with · This is followed by · The process culminates in", "danh từ / V-ing", "This is followed by a period of fermentation."],
      [", after which · , at which point", "mệnh đề S + V", "The sap is boiled for several hours, after which it is filtered."],
      ["Following this, · Meanwhile, · In the initial stage,", "dấu phẩy + câu đủ", "Meanwhile, the wheat is roasted and crushed."],
      ["prior to", "danh từ / being + V3", "sterilised prior to being filled"],
      ["so as to · in order to", "V nguyên mẫu", "filtered so as to remove any solid particles"],
      [", resulting in · , leaving · , producing", "danh từ", "…, resulting in a much thicker liquid"],
    ],
  },
  { t: "rule", formula: "begins with + N · , after which + S + V · This is followed by + N · , resulting in + N · culminates in + N", vi: "Khung nối của một bài process band 8; mỗi bài 4–5 cụm." },

  { t: "h", text: "(Ngày 7 · mục 5) Cùng bộ công cụ cho map hai mốc" },
  {
    t: "table", head: ["Việc cần nói", "Cấu trúc", "Ví dụ"],
    rows: [
      ["Thay đổi kéo tới hiện tại", "has / have + been + V3", "The old gym has been converted into a library."],
      ["Tình trạng ở mốc quá khứ", "was / were + V3", "In 2000, the western half was occupied by playing fields."],
      ["Nhắc cái cũ", "N + that once + V-ed · the former + N", "The fields that once covered the west have made way for housing."],
      ["Công năng mới", "N, now + N,", "The car park, now a paved square, is closed to vehicles."],
      ["Cái không đổi", "remain + adj · be retained", "Only the main hall remains unchanged."],
    ],
  },
  { t: "rule", formula: "has / have been + V3 (mốc: nay) · was / were + V3 (mốc: năm đã qua) · N, now + N, · N that once + V-ed", vi: "Map = process đổi thì. disappear / appear không có bị động." },

  { t: "h", text: "(Ngày 7 · mục 6) Reading — Short answer + Sentence completion" },
  {
    t: "table", head: ["Bước", "Việc", "Ghi nhớ"],
    rows: [
      ["1", "Đọc giới hạn từ", "mạo từ cũng tính là một từ"],
      ["2", "Đoán loại đáp án", "Wh- (short answer) · từ cạnh chỗ trống (sentence)"],
      ["3", "Chọn một từ neo", "tên riêng, năm, thuật ngữ"],
      ["4", "Tìm CÂU rồi mới tìm TỪ", "đáp án đi theo thứ tự bài"],
      ["5", "Thử lại", "đúng nghĩa · đúng ngữ pháp · đúng số từ · chép nguyên dạng"],
    ],
  },
  { t: "rule", formula: "Wh- ⇒ loại đáp án · tìm câu theo thứ tự · chép nguyên văn ≤ giới hạn từ", vi: "Hai dạng điền từ của Passage 3: không đổi dạng từ, không viết ý của mình." },

  { t: "h", text: "(Ngày 7 · mục 7) Speaking Part 2 — tả người / nơi bằng chi tiết cảm quan" },
  {
    t: "patterns", rows: [
      { formula: "S + would / ’d + V", vi: "Thói quen trong quá khứ — phần cận cảnh.", examples: [{ en: "He’d run his thumb along the inside of the tyre, and then stop.", vi: "Ông thường miết ngón cái dọc mặt trong lốp xe, rồi dừng lại." }] },
      { formula: "What struck me (most) was + N / how + adj / that + S + V", vi: "Đưa chi tiết đắt nhất lên; cả bài một lần.", examples: [{ en: "What struck me was how little he seemed to look at what he was doing.", vi: "Điều làm tôi chú ý là ông dường như chẳng mấy khi nhìn vào việc mình đang làm." }] },
      { formula: "You’d hear / see / get + N", vi: "“You” chung chung kéo người nghe vào cảnh.", examples: [{ en: "You’d hear the hiss of the pump, then the clink of a spanner.", vi: "Bạn sẽ nghe tiếng bơm xì, rồi tiếng cờ-lê leng keng." }] },
      { formula: "It’s not (really) + N1 — it’s + N2 / that + S + V", vi: "Nhận xét riêng để kết bài.", examples: [{ en: "It isn’t really the skill itself — it’s that he never rushed.", vi: "Thật ra không hẳn là tay nghề — mà là ông không bao giờ vội." }] },
    ],
  },
  { t: "rule", formula: "một cảnh → quen thế nào → S + ’d + V × 3 chi tiết → Once… → It’s not N1 — it’s N2", vi: "Khung 2 phút tả người / nơi ở band 8: cho thấy, đừng kể lể; chậm lại ở chi tiết." },
];
