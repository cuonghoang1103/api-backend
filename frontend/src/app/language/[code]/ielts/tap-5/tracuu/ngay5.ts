/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 Ngày 5 (soạn cùng tap-5/ngay/ngay5.ts, 24/11/2026).
 * Phiên ghép chặng 1 chép mảng này vào `tap-5/tracuu-chang1.ts` (đánh lại số thứ tự mục cho liên tục cả chặng).
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_5: Block[] = [
  { t: "h", text: "(Ngày 5 · mục 2) Dựng câu ba tầng — xương sống trước, tầng sau" },
  {
    t: "table", head: ["Tầng", "Trả lời câu hỏi", "Treo vào", "Dấu hiệu"],
    rows: [
      ["Quan hệ", "cái nào? người nào?", "một danh từ", "who · which · that · whose · where · V-ing / V3 ngay sau danh từ"],
      ["Phân từ", "khi nào? vì sao? kết quả gì?", "cả mệnh đề chính (chung chủ ngữ)", "V-ing / V3 / Having V3 ở đầu hoặc cuối câu, có dấu phẩy"],
      ["Danh ngữ", "(nghĩ / nói / biết) cái gì?", "động từ, tính từ hoặc danh từ trừu tượng", "that · whether · what · how · why + S + V"],
    ],
  },
  { t: "rule", formula: "S + V + O   →   + tầng quan hệ (sau N)   →   + tầng phân từ / danh ngữ (cuối câu)   →   che tầng, soát lại S + V", vi: "Viết câu ngắn đứng được một mình trước; gắn tầng sau; che mọi tầng thì phần còn lại vẫn phải là một câu." },

  { t: "h", text: "(Ngày 5 · mục 3) Tầng quan hệ — bốn mẫu band 8" },
  {
    t: "patterns",
    rows: [
      { formula: "S + V + O, which + V(s/es) …", vi: "which bình luận cả ý trước — có phẩy, động từ số ít.", examples: [{ en: "Enrolment fell for the third year running, which suggests that the fee increase was a mistake.", vi: "Số nhập học giảm năm thứ ba liên tiếp, điều này cho thấy tăng học phí là sai lầm." }] },
      { formula: "the extent / degree to which · the way in which + S + V", vi: "Giới từ đứng trước which; không dùng that sau giới từ.", examples: [{ en: "The extent to which a policy succeeds depends on how it is enforced.", vi: "Mức độ thành công của một chính sách phụ thuộc vào cách nó được thực thi." }] },
      { formula: "N, most / many / a third of whom (which) + V", vi: "Thay cho “, most of them” (comma splice).", examples: [{ en: "The study recruited 400 adults, most of whom had never voted.", vi: "Nghiên cứu tuyển 400 người lớn, phần lớn chưa từng đi bầu." }] },
      { formula: "N + V-ing (chủ động) · N + V3 (bị động)", vi: "Rút gọn chỉ khi đại từ quan hệ là chủ ngữ.", examples: [{ en: "The measures introduced last year have had little effect.", vi: "Các biện pháp đưa ra năm ngoái hầu như không có tác dụng." }] },
    ],
  },
  { t: "rule", formula: "…, which + V(s/es)   ·   the extent to which + S + V   ·   N, most of whom + V   ·   N + V-ing / V3", vi: "Bốn mẫu quan hệ của band 8." },

  { t: "h", text: "(Ngày 5 · mục 4) Tầng phân từ — vị trí và việc nó làm" },
  {
    t: "table", head: ["Vị trí", "Việc", "Ví dụ"],
    rows: [
      ["Đầu câu", "lý do · thời gian · điều kiện", "Having lost public support, the scheme was abandoned within a year."],
      ["Cuối câu", "kết quả", "The factory closed in 2019, leaving 800 people out of work."],
      ["Cuối câu + thereby / thus", "kết quả, rất trang trọng", "The tax was cut, thereby encouraging firms to invest."],
      ["Giữa câu", "chêm thông tin về chủ ngữ", "The council, faced with a budget shortfall, postponed the project."],
      ["Liên từ + phân từ", "nói rõ quan hệ", "When asked about pay, most staff declined to comment."],
    ],
  },
  { t: "rule", formula: "V-ing / V3 / Having V3 … , S + V   (S làm cả hai việc)   ·   S + V … , V-ing …  (kết quả)", vi: "Phân từ đầu câu: chủ ngữ ngay sau dấu phẩy phải là người / vật thực hiện phân từ — sai là chủ ngữ treo." },

  { t: "h", text: "(Ngày 5 · mục 5) Tầng danh ngữ — bốn vị trí" },
  {
    t: "patterns",
    rows: [
      { formula: "S + V + that / whether / wh- + S + V", vi: "Làm tân ngữ; trật tự câu kể.", examples: [{ en: "Few studies have examined how these habits are formed.", vi: "Ít nghiên cứu xem xét các thói quen này hình thành thế nào." }] },
      { formula: "What + S + V + is …  ·  Whether + S + V + V(s/es) …", vi: "Làm chủ ngữ; động từ chính số ít.", examples: [{ en: "What most employees want is flexibility, not higher pay.", vi: "Điều phần lớn nhân viên muốn là sự linh hoạt chứ không phải lương cao hơn." }] },
      { formula: "the fact / claim / idea / belief + that + S + V", vi: "Đồng vị; mệnh đề sau that đủ thành phần; không thay bằng which.", examples: [{ en: "Despite the fact that funding has doubled, waiting times have not fallen.", vi: "Mặc dù kinh phí tăng gấp đôi, thời gian chờ không giảm." }] },
      { formula: "It is + adj + that …  ·  It remains unclear whether …", vi: "Chủ ngữ giả đẩy mệnh đề nặng về cuối câu.", examples: [{ en: "It remains unclear why the birth rate fell so quickly.", vi: "Vẫn chưa rõ vì sao tỉ lệ sinh giảm nhanh như vậy." }] },
    ],
  },
  {
    t: "note", title: "⚠️ Bốn lỗi danh ngữ hay sai",
    items: [
      "~~The reason is because…~~ → The reason is **that**…",
      "~~Nobody knows why did the project fail.~~ → …why the project **failed**.",
      "~~Despite that funding has doubled…~~ → **Despite the fact that** / **Although**…",
      "~~What the residents want are…~~ → What the residents want **is**…",
    ],
  },
  { t: "rule", formula: "What + S + V + is …   ·   the fact that + S + V   ·   It is + adj + that …", vi: "Mệnh đề danh ngữ theo trật tự câu kể; làm chủ ngữ thì động từ chính số ít." },

  { t: "h", text: "(Ngày 5 · mục 6–7) Xếp tầng và bảng soát năm lỗi câu dài" },
  {
    t: "table", head: ["Lỗi", "Cách soát", "Ví dụ đúng"],
    rows: [
      ["① Thiếu động từ chính", "che tầng — còn S + V?", "The policy, which was introduced in 2020, affects small firms."],
      ["② Chủ – vị xa nhau", "tìm danh từ chính", "The number of students who take part in exchange programmes has risen."],
      ["③ Chủ ngữ treo", "ai làm phân từ?", "Having reviewed the evidence, the panel reached a clear conclusion."],
      ["④ which mơ hồ", "which chỉ danh từ sát trước hay cả ý?", "The council's decision to close the library angered parents."],
      ["⑤ that… and that… lệch", "sau and lặp that + S + V", "The study shows that sleep improves memory and that people who sleep less make more errors."],
    ],
  },
  { t: "rule", formula: "[bối cảnh ngắn,]  S + V + O  + tầng 1 + tầng 2 + tầng 3   (≤ 1 tầng ngắn trước V)", vi: "Xương sống sớm, tầng nặng về cuối; mỗi đoạn chỉ 1–2 câu ba tầng, xen câu ngắn." },

  { t: "h", text: "(Ngày 5 · Đọc) Matching headings band 8 — tiêu đề nói chức năng lập luận" },
  {
    t: "table", head: ["Từ trong tiêu đề", "Đoạn đang làm gì", "Tín hiệu trong đoạn"],
    rows: [
      ["a proposal / suggestion that…", "đưa ra ý mới", "It was X who suggested… · on this view…"],
      ["an objection / a challenge to…", "phản bác ý trước", "Yet… · rested on a mistake"],
      ["support / evidence for…", "đưa bằng chứng", "set out to test · found"],
      ["a defence of…, with one condition", "bênh vực có giới hạn", "It would be a mistake to conclude… · The error lies not in… but in…"],
      ["an application / a consequence of…", "đem ý ra thực tế", "None of this would matter if…"],
      ["a more realistic aim", "kết: hạ kỳ vọng", "The practical lesson… · It is more productive to…"],
    ],
  },
  { t: "rule", formula: "ghi lề = nói về gì + làm gì   →   ghép theo lề   →   hai ứng viên thì đọc câu cuối đoạn", vi: "Ba bẫy: tiêu đề đúng một nửa · đúng cho một câu (ví dụ) · ngược hướng kết luận." },

  { t: "h", text: "(Ngày 5 · Nghe) Part 4 band 8 — biển báo và nối âm chuỗi" },
  {
    t: "table", head: ["Việc", "Câu báo hiệu", "Bạn làm gì"],
    rows: [
      ["Sang phần mới", "Now, jump forward a century. · Right, what goes wrong? · And so to repairs…", "chuyển mắt xuống tiêu đề nhỏ kế tiếp"],
      ["Bác điều tưởng nhầm", "People imagine… In fact… · somebody says… But…", "đáp án đứng sau In fact / But"],
      ["Sửa con số", "you might guess… By most accounts…", "lấy số sau"],
      ["Nhấn chi tiết", "Here's a detail that surprises people:", "chuẩn bị viết"],
      ["Hệ quả", "One consequence… is that…", "thường là câu cuối của phần"],
    ],
  },
  { t: "rule", formula: "People imagine / somebody says / you might guess  X   →   In fact / But / By most accounts  Y   ⇒   viết Y", vi: "Nối âm chuỗi: tìm từ chức năng quen (of, it, at, a) làm mốc rồi suy ra từ nội dung — a lot of it is ≈ “əlɒtəvɪtɪz”." },
];
