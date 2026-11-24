/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 Ngày 4 (soạn cùng tap-5/ngay/ngay4.ts, 24/11/2026).
 * Phiên ghép chặng 1 chép mảng này vào `tap-5/tracuu-chang1.ts` (đánh lại số thứ tự mục cho liên tục cả chặng).
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_4: Block[] = [
  { t: "h", text: "(Ngày 4 · mục 1) Bốn phép thử trước khi dùng một từ ít gặp" },
  {
    t: "table", head: ["Phép thử", "Câu hỏi", "Ví dụ"],
    rows: [
      ["① Nghĩa", "Từ thường nào nó thay được? Lệch gì?", "exacerbate = make (something bad) worse"],
      ["② Collocation", "Đi với danh từ / giới từ nào?", "exacerbate inequality · conducive to · commensurate with"],
      ["③ Sắc thái", "Khen, chê hay trung tính?", "perpetuate / entrench chỉ đi với điều xấu · bolster tích cực"],
      ["④ Register", "Viết hay nói?", "hitherto, onus: viết · fiddly, underwhelming: nói"],
    ],
  },
  { t: "rule", formula: "Nghĩa → Collocation → Sắc thái → Register", vi: "4–6 từ ít gặp cho một bài 280 từ. Không qua đủ bốn phép thử thì dùng từ thường." },

  { t: "h", text: "(Ngày 4 · mục 2–4) Collocation cốt lõi của 30 từ viết" },
  {
    t: "table", head: ["Nhóm", "Cụm phải thuộc"],
    rows: [
      ["Động từ", "exacerbate a problem / inequality · circumvent the rules · perpetuate a stereotype · curtail spending / freedom · be hampered by · entrench privilege (deeply entrenched) · bolster the case · preclude sb from V-ing · substantiate a claim · galvanise support"],
      ["Tính từ", "a pervasive influence · a tenuous link · an untenable position · a disproportionate share · It may seem counterintuitive, but… · an intractable problem · the most salient feature · tangible benefits · conducive to + N / V-ing · commensurate with + N"],
      ["Danh từ", "with the caveat that… · a false dichotomy between A and B · is no panacea for · a propensity to V · provide the impetus for · have ramifications for · a discrepancy between A and B · breed complacency · the onus is on sb to V · a trade-off between A and B"],
    ],
  },

  { t: "h", text: "(Ngày 4 · mục 5) Trạng từ và cụm điều tiết — vị trí và dấu câu" },
  {
    t: "table", head: ["Từ", "Vị trí", "Ví dụ"],
    rows: [
      ["ostensibly · nominally · seemingly", "ngay trước từ nó bổ nghĩa", "ostensibly to reduce crime · nominally free · a seemingly minor change"],
      ["inadvertently · invariably · unequivocally · markedly", "giữa trợ động từ và động từ chính, hoặc sau động từ", "may inadvertently discourage · invariably cost more · have shifted markedly"],
      ["hitherto", "sau had / has, trước V3 hoặc tính từ", "groups that had hitherto been excluded"],
      ["by extension", "sau and, giữa hai dấu phẩy", "…concentration and, by extension, academic performance"],
      ["insofar as", "giữa câu + mệnh đề đủ chủ vị", "Competition is healthy insofar as it pushes firms to improve."],
    ],
  },
  { t: "rule", formula: "S + V + adj + insofar as + S + V", vi: "Đồng ý có điều kiện trong một câu. invariably = always (không phải “không đổi”)." },

  { t: "h", text: "(Ngày 4 · Viết mục 2) Opinion band 8 — thang 5 bậc độ sâu" },
  {
    t: "table", head: ["Bậc", "Việc của câu", "Khung"],
    rows: [
      ["① Luận điểm", "một câu, đã có phạm vi", "The strongest argument for X concerns who / what / how…"],
      ["② Cơ chế", "A → B → C", "Because…, … ; as a result, … · X is not spread evenly: …"],
      ["③ Ví dụ liên quan", "một trường hợp khớp cơ chế", "In X, where…, … · Compare A with B: …"],
      ["④ Hệ quả", "so what?", "The benefit lies less in A than in B. · The point is not that…, but that…"],
      ["⑤ Giới hạn", "đúng tới đâu", "X is no panacea: … · This holds only insofar as…"],
    ],
  },
  { t: "rule", formula: "Luận điểm → cơ chế (A → B → C) → ví dụ khớp cơ chế → hệ quả → giới hạn", vi: "Hai thân bài × năm bậc. Không cần luận điểm thứ ba." },

  { t: "h", text: "(Ngày 4 · Viết mục 3) Khung câu cho ví dụ và giả định" },
  {
    t: "patterns",
    rows: [
      { formula: "In + nơi, where + S + V, + mệnh đề chính", vi: "Mệnh đề where gói bối cảnh; mệnh đề chính nói điều ví dụ chứng minh.", examples: [{ en: "In Singapore, where drivers pay to enter the centre at peak times, congestion has remained manageable despite rising incomes.", vi: "Ở Singapore, nơi tài xế phải trả tiền để vào trung tâm giờ cao điểm, tắc nghẽn vẫn kiểm soát được dù thu nhập tăng." }] },
      { formula: "Were + S + to V, S + would + V", vi: "Giả định trang trọng — một lần mỗi bài.", examples: [{ en: "Were entrance exams to be abolished, universities would have to rely on school grades.", vi: "Nếu bỏ thi đầu vào, các trường đại học sẽ phải dựa vào điểm phổ thông." }] },
      { formula: "The point is not that…, but that…", vi: "Nói rõ ví dụ chứng minh điều gì.", examples: [{ en: "The point is not that every citizen votes wisely, but that no group can be safely ignored.", vi: "Vấn đề không phải là ai cũng bỏ phiếu sáng suốt, mà là không nhóm nào có thể bị phớt lờ." }] },
    ],
  },
  { t: "rule", formula: "In X, where…, [điều xảy ra]. The point is not that…, but that…", vi: "Không số liệu bịa, không chuyện cá nhân, không ví dụ rộng hơn luận điểm." },

  { t: "h", text: "(Ngày 4 · Viết mục 5) Lập trường có điều kiện — một điều kiện xuyên ba chỗ" },
  {
    t: "patterns",
    rows: [
      { formula: "I believe + S + should + V, though only insofar as + S + V", vi: "Luận đề có phạm vi (cuối mở bài).", examples: [{ en: "I believe it should, though only insofar as the law compels attendance at the polls rather than the expression of a preference.", vi: "Tôi cho là nên, nhưng chỉ trong chừng mực luật buộc đến điểm bầu chứ không buộc bày tỏ lựa chọn." }] },
      { formula: "Neither point is trivial, but both can be met by + N / V-ing", vi: "Thừa nhận phản đề mạnh nhất rồi hoá giải bằng điều kiện.", examples: [{ en: "Neither point is trivial, but both can be met by design.", vi: "Cả hai điểm đều không nhỏ, nhưng đều giải quyết được bằng cách thiết kế." }] },
      { formula: "This is not to say that…; rather, …", vi: "Chặn trước cách hiểu sai lập trường.", examples: [{ en: "This is not to say that exams should be the sole criterion; rather, they should carry the greatest weight.", vi: "Nói vậy không có nghĩa bài thi nên là tiêu chí duy nhất; đúng hơn, nó nên có trọng số lớn nhất." }] },
      { formula: "On balance, … , provided that + S + V", vi: "Kết bài: lập trường + cùng điều kiện ở mở bài.", examples: [{ en: "On balance, a modest obligation seems a price worth paying, provided that abstaining formally remains possible.", vi: "Cân nhắc lại, một nghĩa vụ vừa phải có vẻ là cái giá đáng trả, miễn là vẫn có thể chính thức bỏ phiếu trắng." }] },
    ],
  },
  { t: "rule", formula: "Mở bài: I agree insofar as X · Thân bài 2: phản đề mạnh nhất → hoá giải bằng X · Kết bài: …, provided that X", vi: "Chống khái quát: mỗi nhận định nói rõ ai · khi nào · tới mức nào; mỗi câu một từ giảm là đủ." },

  { t: "h", text: "(Ngày 4 · Nghe mục 2) Nghe nhiều người — lời đồng ý / phản đối nói vòng" },
  {
    t: "table", head: ["Nghe thấy", "Nghĩa thật"],
    rows: [
      ["I'd go along with that. · That's what I'd do. · Fair enough.", "đồng ý"],
      ["I'm not sure it's that serious. · Hmm, up to a point.", "không đồng ý (lịch sự)"],
      ["That's what I thought at first, too. But…", "đã từng nghĩ vậy — giờ thì không"],
      ["It's long, but it's thorough. I wouldn't touch it.", "nêu khuyết điểm rồi giữ nguyên"],
      ["Actually, would it make more sense for X to…?", "đề xuất đổi kế hoạch vừa nêu"],
      ["You won't have that before the deadline, will you? No —…", "câu hỏi đuôi để bác một đề xuất"],
    ],
  },
  { t: "rule", formula: "A nêu → B điều chỉnh → C phân xử ⇒ đáp án = lời cuối không bị ai bác", vi: "Ghi + / – / ? dưới tên người nói; không chép chữ." },
];
