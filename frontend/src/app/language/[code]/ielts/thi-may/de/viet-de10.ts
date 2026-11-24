/**
 * Đề 10 — Academic Writing, TẬP 5 · NGÀY 16 (docs/ielts-lo-trinh-0-8.md mục 4.2: "table + pie / Two-part"). TỰ SOẠN 24/11/2026.
 * Task 1: MIXED — một BẢNG (5 chỉ số của hệ thống thư viện công, 2010 và 2025, mỗi hàng MỘT đơn vị khác nhau) + một PIE (lý do
 * tới thư viện năm 2025). Khó hơn Đề 8 (bar + pie): bảng trộn đơn vị nên không so ngang giữa các hàng được (T3 N20 "cột khác đơn
 * vị không so ngang"), phải TỰ TÍNH để thấy điểm đáng nói (tổng lượt mượn TĂNG dù sách in giảm; e-book vượt sách in), và nối hai
 * hình bằng đúng điều số liệu cho phép (T5 N6 "Task 1 mixed charts band 8").
 * Task 2: TWO-PART đề lạ (T5 N14 "Task 2 trộn dạng — nhận dạng đề lạ, chọn khung"; T3 N22 hai câu hỏi khác loại): câu 1 hỏi
 * NGUYÊN NHÂN, câu 2 hỏi AI NÊN TRẢ TIỀN (ba đối tượng) — không phải cặp "why + positive/negative" quen thuộc của Đề 5.
 * Số liệu Task 1 TỰ ĐẶT cho bài thi thử (thư viện công của "một thành phố") — không phải thống kê thật của nơi nào. Hình tròn cộng
 * đủ 100%.
 * Người làm Đề 10 nhắm band 7.5 ⇒ bài mẫu ở mức band 8.0–8.5. Để nhãn band TRUNG THỰC và để người học tập soi, mỗi bài CỐ Ý GIỮ 2
 * lỗi nhỏ thuộc "chuỗi lỗi 7→8" (mạo từ, số nhiều, giới từ, hoà hợp chủ – vị — T5 N3, N17) — mục "🔎 Soi lỗi" trong `phanTich`
 * chỉ rõ + cách sửa. KHÔNG phải lỗi soạn thảo: sửa câu thì phải sửa luôn phần phân tích và test.
 * `figure` = table (categories = 2 năm, series = 5 hàng), `figure2` = pie. `moTaSo` gửi kèm cho AI chấm.
 */
import type { DeViet } from './types';

export const VIET_DE10: DeViet = {
  id: 'viet-de10',
  kyNang: 'viet',
  ten: 'Academic Writing — Đề 10 (Tập 5 · Ngày 16)',
  boDe: 'Đề 10',
  capDo: 'Band 7.5',
  moTa: 'Task 1: the public library service of one city in 2010 and 2025, and visitors\' reasons for coming in 2025 (table + pie chart) · Task 2: learning new skills throughout working life — why has this become necessary, and who should pay for it? (two-part question)',
  phut: 60,
  task: [
    {
      so: 1,
      phut: 20,
      minTu: 150,
      de: 'The table below gives information about the public library service in one city in 2010 and 2025. The pie chart shows the main reason people gave for visiting the city\'s libraries in 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
      figure: {
        kind: 'table',
        title: 'The public library service in one city, 2010 and 2025',
        note: 'Số liệu tự đặt cho bài thi thử, không phải thống kê thật của thành phố nào. Mỗi hàng một đơn vị riêng (ghi trong tên hàng).',
        categories: ['2010', '2025'],
        series: [
          { name: 'Number of branches', values: [24, 17] },
          { name: 'Visits (millions)', values: [3.2, 2.6] },
          { name: 'Printed books borrowed (millions)', values: [4.1, 2.3] },
          { name: 'E-books and audiobooks borrowed (millions)', values: [0.2, 2.9] },
          { name: 'Events and classes held', values: [1150, 3400] },
        ],
      },
      figure2: {
        kind: 'pie',
        title: 'Main reason for visiting a library, 2025',
        unit: '% of visitors',
        note: 'Số liệu tự đặt cho bài thi thử, không phải thống kê thật của thành phố nào.',
        slices: [
          { label: 'To borrow or return items', value: 34 },
          { label: 'To study or work', value: 27 },
          { label: 'To attend an event or class', value: 16 },
          { label: 'To use a computer or the internet', value: 14 },
          { label: 'Other', value: 9 },
        ],
      },
      moTaSo: 'MIXED: table + pie chart. (1) Table, the public library service in one city, two years; EACH ROW HAS ITS OWN UNIT. Number of branches: 24 (2010), 17 (2025). Visits (millions): 3.2 (2010), 2.6 (2025). Printed books borrowed (millions): 4.1 (2010), 2.3 (2025). E-books and audiobooks borrowed (millions): 0.2 (2010), 2.9 (2025). Events and classes held: 1150 (2010), 3400 (2025). Derived figures a strong answer may calculate: total loans 4.3 million in 2010 and 5.2 million in 2025 (an increase despite the fall in print); printed loans fell by about 44% (almost half); digital loans rose more than fourteenfold and overtook print (2.9 vs 2.3 million); events roughly tripled; branches fell by seven (about 29%); visits fell by about 19%. (2) Pie chart, main reason for visiting a library in 2025, % of visitors (total 100): To borrow or return items 34%; To study or work 27%; To attend an event or class 16%; To use a computer or the internet 14%; Other 9%. So borrowing was the largest single reason but only about a third; two thirds of visits were for other purposes; study/work was over a quarter. Main features: the service contracted physically (fewer branches, fewer visits, far fewer printed loans) while digital lending and events grew dramatically; by 2025 borrowing was no longer the purpose of most visits. A good answer has an overview covering BOTH figures, groups the rows (what fell vs what rose), does not compare rows with different units directly (e.g. must not say there were more events than visits), uses the correct units (millions for visits and loans; plain numbers for branches and events), links the two figures only where the data allow, and does not speculate about causes (smartphones, budget cuts).',
      goiY: [
        'Mixed "table + pie" (Tập 5 Ngày 6; nối Tập 4 Ngày 24): mở bài gọi tên CẢ HAI hình và việc mỗi hình cho biết — "The table compares five measures of… in 2010 and 2025, while the pie chart shows why people visited… in the latter year." Đổi từ: "gives information about" → "compares five measures of"; "the main reason" → "what brought visitors to".',
        'Bảng này mỗi hàng MỘT đơn vị (chi nhánh · triệu lượt · triệu cuốn · số buổi) ⇒ KHÔNG so ngang giữa các hàng ("more events than visits" là vô nghĩa — Tập 3 Ngày 20). Chỉ so MỘT hàng qua hai năm, hoặc hai hàng CÙNG đơn vị (sách in với e-book: cùng là triệu lượt mượn).',
        'Overview (BẮT BUỘC, 2 câu, KHÔNG số): (1) hệ thống co lại về "phần cứng" — ít chi nhánh, ít lượt tới, ít sách in — nhưng mượn số và sự kiện tăng vọt; (2) năm 2025 mượn – trả chỉ là mục đích của khoảng một phần ba lượt tới. Overview chỉ nói về bảng là lỗi số 1 của dạng mixed.',
        'Band 8 = CHỌN và TÍNH: cộng hai hàng mượn để thấy tổng lượt mượn TĂNG (4.3 → 5.2 triệu) dù sách in giảm gần một nửa; e-book tăng hơn 14 lần và VƯỢT sách in; sự kiện tăng gần gấp ba. Một phép tính đúng chỗ đáng giá hơn chép đủ mười con số.',
        'Thân 1 = bảng, đi theo NHÓM (thứ giảm: chi nhánh, lượt tới, sách in → thứ tăng: e-book, sự kiện), không đi lần lượt năm hàng. Thân 2 = hình tròn: lát lớn nhất, lát thứ hai, cặp sát nhau (16% và 14%), phần còn lại; kết bằng một câu gộp ("two thirds… other than borrowing").',
        'Ngôn ngữ band 8 (Tập 5 Ngày 1 danh hoá + hedging; Tập 4 Ngày 9): "declined more modestly", "dropped by almost half", "rose more than fourteenfold", "overtaking print", "roughly tripled", "had been negligible", "accounted for over a quarter", "the commonest". Đơn vị: "3.2 million visits" (million KHÔNG thêm s sau con số), "24 branches".',
        '20 phút: 3′ khoanh nhóm tăng / giảm + cộng thử hai hàng mượn · 14′ viết · 3′ soát (đơn vị triệu, "by" cho mức chênh – "to" cho điểm cuối, thì quá khứ cho cả hai năm, quá khứ hoàn thành cho mốc trước). KHÔNG giải thích nguyên nhân (điện thoại, cắt ngân sách…) — hình không cho biết.',
      ],
      mau: {
        band: 'Band 8.0–8.5 (cố ý giữ 2 lỗi nhỏ để bạn tập soi — xem mục 🔎)',
        s: 'The table compares five measures of the public library service in one city in 2010 and 2025, while the pie chart shows what brought visitors to its libraries in the latter year.\n\nOverall, the service shrank physically over the period, with fewer branches, visits and loans of printed books, yet digital lending and organised events grew dramatically. By 2025, borrowing was the main purpose of only about third of visits.\n\nBetween 2010 and 2025, the number of branches fell from 24 to 17, and annual visits declined more modestly, from 3.2 million to 2.6 millions. Loans of printed books dropped by almost half, to 2.3 million. By contrast, loans of e-books and audiobooks, which had been negligible at 0.2 million, rose more than fourteenfold to 2.9 million, overtaking print. As a result, total lending actually increased, from 4.3 million to 5.2 million items, despite the smaller network. The number of events and classes roughly tripled, from 1,150 to 3,400.\n\nAs for visitors\' motives in 2025, borrowing or returning items was the commonest, at 34%, but studying or working accounted for over a quarter (27%). Attending an event or class (16%) was slightly more common than using a computer or the internet (14%), and the remaining 9% came for other reasons. Taken together, two thirds of visits were therefore made for purposes other than borrowing.',
        phanTich: [
          '**Task Achievement (8.5)**: mở bài gọi tên cả hai hình; overview hai câu, KHÔNG số, bao quát CẢ HAI hình (co lại về vật chất nhưng mượn số + sự kiện tăng mạnh; mượn – trả chỉ còn khoảng một phần ba lượt tới). Thân bài đủ cả năm hàng và năm lát nhưng CHỌN LỌC và có hai phép tính làm nổi điểm chính: tổng lượt mượn tăng 4.3 → 5.2 triệu, và "two thirds… other than borrowing" (100 − 34 = 66). Không so ngang các hàng khác đơn vị, không suy đoán nguyên nhân.',
          '**Coherence & Cohesion (8.5)**: 4 đoạn; thân 1 = bảng đi theo NHÓM (giảm: chi nhánh → lượt tới → sách in; tăng: e-book → tổng → sự kiện), thân 2 = hình tròn, mở bằng "As for visitors\' motives in 2025". Từ nối ít và trúng: "Overall", "yet", "By contrast", "As a result", "Taken together… therefore". Tham chiếu thay lặp từ: "the latter year", "the period", "print", "the smaller network", "the remaining 9%".',
          '**Lexical Resource (8.5)**: đổi cách gọi liên tục và chính xác: "five measures of the… service", "what brought visitors to", "shrank physically", "loans of printed books / lending / borrowing", "visitors\' motives", "purposes other than borrowing". Ngôn ngữ số liệu tinh: "declined more modestly", "dropped by almost half", "had been negligible", "rose more than fourteenfold", "overtaking print", "roughly tripled", "accounted for over a quarter", "the commonest".',
          '**Grammar (8)**: cụm "with + danh từ" nêu chi tiết trong overview; "yet" nối hai vế đối lập; mệnh đề quan hệ không xác định + quá khứ hoàn thành ", which had been negligible at 0.2 million,"; phân từ chỉ hệ quả ", overtaking print"; "despite + cụm danh từ"; so sánh "slightly more common than"; danh động từ làm chủ ngữ "borrowing or returning items was…", "Attending an event… was…". Gần như mọi câu không lỗi — mô tả band 8; còn hai lỗi nhỏ (xem dưới).',
          '🔎 **Soi lỗi — 2 chỗ CỐ Ý giữ lại (hãy tự tìm trước khi đọc tiếp)**: (1) ✗ "only about **third** of visits" → "only about **a third** of visits" (phân số cần mạo từ: a third, a quarter, a fifth — lỗi mạo từ của "chuỗi lỗi 7→8", Tập 5 Ngày 17); (2) ✗ "to 2.6 **millions**" → "to 2.6 **million**" (sau một con số, "million" KHÔNG thêm "s"; chỉ dùng "millions of" khi không có con số: millions of visits). Cả hai đều là lỗi trượt tay khi viết nhanh — vòng soát 3 phút cuối phải bắt được.',
          '**Muốn lên band 9**: (1) một câu danh hoá gói cả xu hướng ngay đầu thân 1: "The most striking change was the replacement of print by digital lending."; (2) thay một con số bằng tỉ lệ để so sắc hơn: "digital loans, barely one twentieth of the print figure in 2010, exceeded it by 2025"; (3) nối hai hình bằng điều số liệu cho phép: "The growth in events is reflected in the pie chart: one visit in six was made to attend one."',
          '**Lỗi band 7 cần tránh**: overview chỉ nói về bảng; tả năm hàng thành năm câu rời theo đúng thứ tự in; so ngang các hàng khác đơn vị ("events were more than visits"); viết "3.2 visits" (quên đơn vị triệu) hoặc "1,150 million events"; kết luận "people no longer read" (bảng cho thấy tổng lượt mượn TĂNG); giải thích nguyên nhân ("because of smartphones").',
        ],
      },
    },
    {
      so: 2,
      phut: 40,
      minTu: 250,
      de: 'In many professions, people are now expected to go on learning new skills throughout their working lives, rather than relying on what they learned when they were young.\n\nWhy has this change come about? Who should bear the cost of this continued learning: individuals, employers or the government?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
      moTaSo: 'Two-part question (an unusual pairing: a CAUSE question plus a WHO-SHOULD-PAY question naming three parties). Topic: the expectation that people in many professions keep learning new skills throughout their working lives. Expected at band 7.5+: an introduction that restates the trend and signals BOTH parts, ideally with the writer\'s position on the second; one body section answering WHY with two developed causes (e.g. technology changes the content of jobs faster than before / automation; longer working lives and later retirement; people change employer or career more often; global competition; professional regulation requiring updated knowledge); one body section answering WHO SHOULD PAY with a clear, consistent position that addresses all three parties or justifies concentrating on one or two (e.g. a principle such as "whoever benefits should pay": employers for firm-specific training, individuals for portable skills, the state for retraining displaced workers or for the low-paid); ideas extended through claim → explanation → specific example; a conclusion answering both questions briefly. Penalise: answering only one of the two questions (Task Response cannot exceed band 5), turning the essay into a general discussion of the benefits of education, a position on payment that is absent or changes, listing the three parties without choosing, unsupported claims, invented statistics, memorised phrases, fewer than 250 words. No data to check.',
      goiY: [
        'Nhận dạng đề (Tập 5 Ngày 14 "Task 2 trộn dạng — đề lạ"): HAI câu hỏi KHÁC LOẠI — (1) WHY = nguyên nhân; (2) WHO SHOULD BEAR THE COST = một phán đoán giữa BA đối tượng. Không phải Problem – solution, không phải Opinion đồng ý / không đồng ý. Trả lời thiếu một câu ⇒ Task Response không quá band 5.',
        'Thesis band 8 báo trước CẢ HAI câu trả lời và có mức độ: "This essay explains why… and argues that, although all three parties should contribute, the largest share ought to fall on employers." Câu 2 liệt kê ba đối tượng — đừng trả lời "all of them" rồi dừng: phải nói AI trả phần nào và VÌ SAO.',
        'Tìm MỘT nguyên tắc để chia (đây là chỗ band 8 khác band 7): ví dụ "ai hưởng lợi thì người đó trả" — kỹ năng riêng của công ty ⇒ công ty; kỹ năng mang đi được, làm tăng thu nhập ⇒ cá nhân; đào tạo lại cho người mất nghề ⇒ nhà nước. Có nguyên tắc thì ba đối tượng thành MỘT lập luận, không phải ba ý rời.',
        'Thân 1 (nguyên nhân): 2 nguyên nhân, mỗi cái đủ ba tầng nhận định → cơ chế → ví dụ. Ví dụ bạn có sẵn: lập trình viên ngừng học từ 2015; kế toán phải học phần mềm và chuẩn mực mới; y tá học thiết bị mới. Nguyên nhân thứ hai nên khác LOẠI với cái đầu (công nghệ + tuổi nghỉ hưu muộn hơn), đừng nêu hai biến thể của cùng một ý.',
        'Từ vựng chủ đề: acquire / update skills, lifelong learning, retrain, become obsolete, automate, formal education, firm-specific training, portable skills, earning power, redundant, bear / meet / share the cost, apportion, subsidise, fund.',
        'Ngữ pháp band 8 dùng VỪA ĐỦ (Tập 5 Ngày 13): một mệnh đề nhượng bộ ("although all three…"), một điều kiện giả định ("a programmer who stopped studying in 2015 would now…"), "however + adj" ("no initial training, however thorough, can…"), một cấu trúc song song ba vế ở kết bài. Không nhồi đảo ngữ.',
        '40 phút: 5′ dàn ý (2 nguyên nhân + nguyên tắc chia + ba đối tượng, ghi sẵn ví dụ) · 30′ viết · 5′ soát theo "chuỗi lỗi 7→8" của bạn (Tập 5 Ngày 3, Ngày 17: hoà hợp chủ – vị khi chủ ngữ dài, giới từ đi với động từ, mạo từ, số nhiều) — mục tiêu 0–1 lỗi.',
      ],
      mau: {
        band: 'Band 8.0–8.5 (cố ý giữ 2 lỗi nhỏ để bạn tập soi — xem mục 🔎)',
        s: 'A generation ago, a qualification gained at twenty could sustain a career until retirement. Today, in fields as different as nursing, accountancy and software development, workers are expected to keep acquiring skills for as long as they are employed. This essay explains why this has happened and argues that, although all three parties should contribute, the largest share of the cost ought to fall on employers.\n\nThe principal cause is the speed at which technology now alters the content of jobs. Tasks that once defined an occupation is automated within a few years of being learned, while new tools create demands that no earlier training could have anticipated; a programmer who stopped studying in 2015, for instance, would now be unfamiliar with much of what the job involves. This pressure is intensified by longer working lives. Because people retire later than their parents did, the distance between their formal education and the end of their careers has widened to forty years or more, and no initial training, however thorough, can remain adequate for so long.\n\nAs to who should pay, I would apportion the cost according to who benefits. Where training is specific to a firm\'s own systems or products, the employer captures nearly all of the gain and should meet the whole expense, including the hours spent studying. Individuals, for their part, can reasonably be asked to invest on skills that are portable and raise their own earning power, as they already do when they pay for a degree. The state\'s role should be narrower but indispensable: to fund retraining for those whose occupations are disappearing, since neither a failing industry nor a redundant worker is in a position to pay, and society as a whole bears the cost of long-term unemployment.\n\nIn conclusion, lifelong learning is the product of rapid technological change combined with longer careers. Its cost is best shared, but in unequal proportions: chiefly by employers, partly by individuals, and by governments where the market leaves people behind.',
        phanTich: [
          '**Task Response (8.5)**: trả lời ĐỦ hai câu hỏi và báo trước cả hai ngay mở bài; lập trường về câu 2 có mức độ ("although all three parties should contribute, the largest share… on employers") và giữ nguyên tới kết bài. Câu 1: hai nguyên nhân KHÁC loại (công nghệ đổi nội dung công việc · đời làm việc dài hơn), mỗi cái có cơ chế + ví dụ (lập trình viên ngừng học từ 2015; khoảng cách bốn mươi năm). Câu 2: một NGUYÊN TẮC chia ("according to who benefits") áp cho cả ba đối tượng — đây là thứ biến danh sách thành lập luận.',
          '**Coherence & Cohesion (8.5)**: 4 đoạn, mỗi câu hỏi một thân bài; câu chủ đề dẫn hướng rõ ("The principal cause is…", "As to who should pay, I would apportion the cost according to who benefits."). Trong thân 2, ba đối tượng đi theo thứ tự trách nhiệm giảm dần và mỗi cái có tín hiệu riêng: "Where training is specific…", "Individuals, for their part,…", "The state\'s role should be narrower but indispensable:". Tham chiếu nối ý: "This pressure", "for so long", "Its cost". Gần như không dùng "Firstly / Secondly".',
          '**Lexical Resource (8.5)**: kết hợp từ chính xác và tự nhiên: "sustain a career", "keep acquiring skills", "alters the content of jobs", "could have anticipated", "intensified by", "formal education", "apportion the cost", "captures nearly all of the gain", "meet the whole expense", "portable", "earning power", "indispensable", "a redundant worker", "in a position to pay", "where the market leaves people behind". Không có từ hiếm vô nghĩa. Còn một giới từ sai (xem Soi lỗi).',
          '**Grammar (8)**: so sánh "in fields as different as…"; nhượng bộ "although…"; mệnh đề quan hệ "the speed at which…", "demands that no earlier training could have anticipated" (modal hoàn thành); giả định "a programmer who stopped studying in 2015… would now be…"; "however thorough" chen giữa; "neither… nor… is in a position to…"; dấu hai chấm + cụm nguyên mẫu "to fund retraining for those whose occupations are disappearing"; song song ba vế ở câu cuối. Còn một lỗi hoà hợp chủ – vị (xem dưới).',
          '🔎 **Soi lỗi — 2 chỗ CỐ Ý giữ lại (hãy tự tìm trước khi đọc tiếp)**: (1) ✗ "Tasks that once defined an occupation **is** automated" → "Tasks… **are** automated" (chủ ngữ là "Tasks" số nhiều; danh từ đứng sát động từ là "an occupation" số ít nên dễ chia nhầm — lỗi hoà hợp chủ – vị khi chủ ngữ có mệnh đề quan hệ, Tập 5 Ngày 3); (2) ✗ "invest **on** skills" → "invest **in** skills" (invest IN something — giới từ cố định, Tập 5 Ngày 17). Hai lỗi kiểu này chính là khoảng cách giữa GRA 8 và GRA 9.',
          '**Muốn lên band 9**: (1) thêm một nhượng bộ – phản bác ở thân 2 để lập trường khó bị bẻ: "Employers may object that staff they have trained will simply leave; yet this is an argument for agreements on repayment, not for shifting the cost onto workers."; (2) một câu nêu giới hạn của nguyên tắc ("The line between firm-specific and portable skills is not always clear, and where it is blurred the cost should be split."); (3) không dùng số liệu bịa — nếu cần bằng chứng, dùng ví dụ nghề cụ thể.',
          '**Lỗi band 7 cần tránh**: chỉ trả lời câu 1 kỹ rồi câu 2 một câu "everyone should pay"; biến bài thành "lợi ích của việc học suốt đời"; nêu ba đối tượng mỗi cái một câu mà không có tiêu chí chia; thesis nói công ty trả nhưng kết bài nói "it depends"; ví dụ chung chung ("technology is developing very fast nowadays"); mở mọi câu bằng "Firstly / Moreover / Furthermore".',
        ],
      },
    },
  ],
};
