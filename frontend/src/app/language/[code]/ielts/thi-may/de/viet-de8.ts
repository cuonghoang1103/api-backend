/**
 * Đề 8 — Academic Writing, THI CUỐI TẬP 4 (docs/ielts-lo-trinh-0-8.md mục 4.2 · sau Tập 4 Ngày 30). TỰ SOẠN 18/11/2026.
 * Task 1: MIXED — một bar chart nhóm (5 khu vực × 2 năm) + một pie chart (T4 N24 "Task 1 table + mixed", N8 bar 3, N18 pie 3; ngôn
 * ngữ so sánh – tỉ lệ T4 N9, N12) · Task 2: ADVANTAGES / DISADVANTAGES dạng "Do the advantages outweigh the disadvantages?" (T4 N14
 * "đánh giá outweigh rõ"; cohesion N12, từ nối N15, hedging N13; 12 lỗi ở band 7 N28; viết lại theo sổ lỗi N30), chủ đề: nghỉ một
 * năm (gap year) giữa phổ thông và đại học.
 * Số liệu Task 1 TỰ ĐẶT cho bài thi thử (sinh viên quốc tế ở các trường đại học của "một quốc gia") — không phải thống kê thật của
 * nước nào. Cột: nghìn sinh viên; hình tròn: % sinh viên quốc tế năm 2025 theo ngành, cộng đủ 100%.
 * Người làm Đề 8 nhắm band 7.0 ⇒ bài mẫu ở mức band 7.5–8.0 = đích của Tập 5. Để nhãn band TRUNG THỰC, mỗi bài CỐ Ý GIỮ 2 chỗ chưa
 * chuẩn (kết hợp từ, giới từ, danh từ đếm được / không đếm được) — mục "🔎 Soi lỗi" trong `phanTich` chỉ rõ + cách sửa. KHÔNG phải
 * lỗi soạn thảo: sửa câu thì phải sửa luôn phần phân tích.
 * `figure` = bar chart (categories = khu vực, series = 2 năm), `figure2` = pie chart (FigureView vẽ hai hình cạnh nhau). `moTaSo`
 * gửi kèm cho AI chấm.
 */
import type { DeViet } from './types';

export const VIET_DE8: DeViet = {
  id: 'viet-de8',
  kyNang: 'viet',
  ten: 'Academic Writing — Đề 8 (thi cuối Tập 4)',
  boDe: 'Đề 8',
  capDo: 'Band 7.0',
  moTa: 'Task 1: international students by region of origin, 2005 and 2025, and their subjects in 2025 (bar chart + pie chart) · Task 2: taking a year off between school and university — do the advantages outweigh the disadvantages?',
  phut: 60,
  task: [
    {
      so: 1,
      phut: 20,
      minTu: 150,
      de: 'The bar chart below shows the number of international students at universities in one country, by region of origin, in 2005 and 2025. The pie chart shows the subjects that these students studied in 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
      figure: {
        kind: 'bar',
        title: 'International students by region of origin, 2005 and 2025',
        unit: 'thousands of students',
        note: 'Số liệu tự đặt cho bài thi thử, không phải thống kê thật của nước nào.',
        categories: ['Asia', 'Europe', 'Africa', 'Middle East', 'Americas'],
        series: [
          { name: '2005', values: [62, 45, 12, 9, 18] },
          { name: '2025', values: [148, 52, 38, 27, 21] },
        ],
      },
      figure2: {
        kind: 'pie',
        title: 'Subjects studied by international students, 2025',
        unit: '% of international students',
        note: 'Số liệu tự đặt cho bài thi thử, không phải thống kê thật của nước nào.',
        slices: [
          { label: 'Business', value: 31 },
          { label: 'Engineering and computing', value: 26 },
          { label: 'Medicine and health', value: 14 },
          { label: 'Social sciences', value: 12 },
          { label: 'Arts and humanities', value: 9 },
          { label: 'Other', value: 8 },
        ],
      },
      moTaSo: 'MIXED charts. (1) Bar chart, international students at universities in one country by region of origin, in THOUSANDS: Asia 2005 62, 2025 148; Europe 2005 45, 2025 52; Africa 2005 12, 2025 38; Middle East 2005 9, 2025 27; Americas 2005 18, 2025 21. Totals: 146 thousand in 2005, 286 thousand in 2025 (almost doubled). (2) Pie chart, subjects studied by international students in 2025, % (total 100): Business 31%; Engineering and computing 26%; Medicine and health 14%; Social sciences 12%; Arts and humanities 9%; Other 8%. Main features: the total almost doubled; Asia was by far the largest source in both years and more than doubled (62 to 148), so that it supplied over half of all students in 2025; the fastest growth was from Africa and the Middle East, which roughly tripled (12 to 38; 9 to 27), so that Africa overtook the Americas and the Middle East overtook the Americas too; Europe (45 to 52) and the Americas (18 to 21) grew only slightly, so Europe\'s share fell. In 2025 business and engineering/computing together accounted for more than half (57%) of students, business being the largest single subject; arts and humanities attracted under a tenth. A good answer gives an overview covering BOTH charts, groups the regions (strong growth vs slight growth), links the two charts only where justified (the pie gives no breakdown by region, so it must not claim that Asian students chose business), and does not speculate about reasons.',
      goiY: [
        'Mixed chart (Tập 4 Ngày 24): mở bài phải gọi tên CẢ HAI hình và việc mỗi hình cho biết — "The bar chart compares… while the pie chart breaks down…". Đổi từ: "international students" → "students from abroad", "region of origin" → "where they came from", "subjects" → "fields of study".',
        'Overview (BẮT BUỘC, 2 câu, KHÔNG số): một câu cho mỗi hình — (1) tổng số gần gấp đôi, châu Á luôn là nguồn lớn nhất; (2) hai ngành kinh doanh và kỹ thuật – máy tính chiếm hơn một nửa. Overview chỉ nói về MỘT hình là lỗi số 1 của dạng mixed.',
        'Thân 1 = bar chart, chia NHÓM chứ không đi từng khu vực: châu Á (lớn nhất, tăng hơn gấp đôi) · châu Phi + Trung Đông (tăng khoảng gấp ba — nhanh nhất, vượt châu Mỹ) · châu Âu + châu Mỹ (tăng nhẹ). Thân 2 = pie chart: ngành lớn nhất, cặp ngành chiếm hơn nửa, ngành nhỏ nhất.',
        'Hình tròn KHÔNG chia theo khu vực ⇒ không được viết "most Asian students studied business". Chỉ nối hai hình bằng điều số liệu cho phép: "Of the 286,000 students in 2025, almost a third studied business."',
        'Ngôn ngữ band 7+ (Tập 4 Ngày 9, Ngày 12, Ngày 18): "more than doubled", "roughly tripled", "by far the largest source", "overtook", "accounted for / made up", "just under a third", "fewer than one in ten", "the former… the latter", "a far more modest rise". Dùng số + phân số xen kẽ (31% ≈ "almost a third").',
        'Đơn vị: cột tính bằng NGHÌN — viết "62,000 students" hoặc "62 thousand", không viết "62 students". "number" (đếm được) đi với "students", không dùng "amount".',
        '20 phút: 3′ khoanh số đầu – cuối, nhóm tăng mạnh / tăng nhẹ, hai lát lớn nhất · 14′ viết · 3′ soát (đơn vị nghìn, %, giới từ "rose from… to… / by…", thì quá khứ cho cả 2005 và 2025). KHÔNG giải thích nguyên nhân (học phí, chính sách thị thực…).',
      ],
      mau: {
        band: 'Band 7.5–8.0 (đích Tập 5 của người đang ở 7.0 — cố ý giữ 2 chỗ chưa chuẩn để bạn tập soi)',
        s: 'The bar chart compares the number of students from abroad at universities in one country, according to where they came from, in 2005 and 2025, while the pie chart breaks down the fields that these students were studying in the latter year.\n\nOverall, the international student population almost doubled over the period, with Asia remaining by far the largest source throughout. In 2025, more than half of all overseas students were enrolled in just two subject areas: business and engineering or computing.\n\nIn 2005, 62,000 students came from Asia, compared with 45,000 from Europe and fewer than 20,000 from each of the other three regions. Twenty years later, the Asian figure had increased with 86,000 to 148,000, which meant that Asia supplied over half of the total. The most rapid growth, however, was among students from Africa and the Middle East, whose numbers roughly tripled, to 38,000 and 27,000 respectively; as a result, both regions overtook the Americas, which saw only a slight rise from 18,000 to 21,000. Europe recorded a similarly modest increase, to 52,000.\n\nTurning to the subjects studied in 2025, business attracted the largest share, at just under a third (31%), followed by engineering and computing (26%). Medicine and health and the social sciences accounted for 14% and 12% respectively, whereas arts and humanities drew fewer than one in ten. The remaining 8% studied other subjects, so the amount of students outside the five main areas was relatively small.',
        phanTich: [
          '**Task Achievement (8)**: mở bài gọi tên cả hai hình và nội dung từng hình; overview hai câu, KHÔNG số, bao quát CẢ HAI hình (tổng gần gấp đôi + châu Á lớn nhất; hai ngành chiếm hơn nửa). Thân bài chọn lọc: đủ số đầu – cuối của năm khu vực nhưng gom thành ba nhóm, nêu đúng điểm vượt nhau (châu Phi, Trung Đông vượt châu Mỹ), đủ sáu lát của hình tròn. Không nối hai hình sai cách (không viết "sinh viên châu Á học kinh doanh"), không suy đoán nguyên nhân.',
          '**Coherence & Cohesion (8)**: 4 đoạn; thân 1 = hình cột, thân 2 = hình tròn, mở thân 2 bằng cụm chuyển ý "Turning to…". Trong thân 1 đi theo NHÓM (châu Á → nhóm tăng nhanh → nhóm tăng nhẹ) chứ không theo thứ tự trên trục — đúng bài Tập 4 Ngày 24. Tham chiếu thay lặp từ (Ngày 12): "the latter year", "the Asian figure", "whose numbers", "both regions", "a similarly modest increase". Từ nối ít mà trúng: "Overall", "however", "as a result", "whereas".',
          '**Lexical Resource (7.5–8)**: đổi cách gọi đối tượng liên tục: "students from abroad", "the international student population", "overseas students", "where they came from", "fields", "subject areas". Ngôn ngữ số liệu chính xác: "almost doubled", "roughly tripled", "by far the largest source", "supplied over half of the total", "overtook", "just under a third", "drew fewer than one in ten", "respectively". Còn một chỗ dùng danh từ sai loại (xem Soi lỗi).',
          '**Grammar (8)**: quá khứ hoàn thành cho mốc so sánh "Twenty years later, the Asian figure had increased…"; mệnh đề quan hệ chỉ hệ quả ", which meant that…"; mệnh đề quan hệ sở hữu "whose numbers roughly tripled"; mệnh đề không xác định ", which saw only a slight rise…"; phân từ "followed by…"; đối lập "whereas"; nhượng bộ trong câu "however". Gần như mọi câu không lỗi — mô tả "the majority of sentences are error-free" của band 8; còn một lỗi giới từ (xem dưới).',
          '🔎 **Soi lỗi — 2 chỗ CỐ Ý giữ lại (hãy tự tìm trước khi đọc tiếp)**: (1) ✗ "had increased **with** 86,000 to 148,000" → "had increased **by** 86,000 to 148,000" (mức chênh dùng BY: rise / fall / increase by + lượng; FROM… TO… cho điểm đầu – điểm cuối); (2) ✗ "the **amount** of students" → "the **number** of students" ("amount" đi với danh từ không đếm được: the amount of money; "students" đếm được ⇒ number — một trong 12 lỗi band 7 của Tập 4 Ngày 28).',
          '**Muốn lên band 8.5–9**: (1) thêm tỉ trọng để so sánh chéo cho sắc: "Asia\'s share rose from about two fifths to just over a half"; (2) một câu danh hoá gói cả xu hướng: "The most striking development was the tripling of student numbers from Africa and the Middle East."; (3) nối hai hình bằng một con số hợp lệ: "In absolute terms, this means that almost 90,000 of the 286,000 students in 2025 were studying business."',
          '**Lỗi band 6.5 cần tránh**: overview chỉ nói về một hình; tả lần lượt năm khu vực thành năm câu rời; ghi "62 students" (quên đơn vị nghìn); viết "Asian students preferred business" (hình tròn không chia theo khu vực); thì hiện tại cho năm 2025; giải thích nguyên nhân ("because universities became cheaper").',
        ],
      },
    },
    {
      so: 2,
      phut: 40,
      minTu: 250,
      de: 'In some countries, it is becoming increasingly common for young people to take a year off between finishing school and starting university, in order to travel or to work.\n\nDo the advantages of this outweigh the disadvantages?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
      moTaSo: 'Advantages/disadvantages essay, question type "Do the advantages outweigh the disadvantages?", about young people taking a year off (a gap year) between school and university to travel or work. Expected at band 7+: the essay must ANSWER the outweigh question with a clear judgement stated in the introduction and kept to the conclusion (advantages outweigh / disadvantages outweigh / outweigh only under stated conditions — all acceptable if argued); both sides must be discussed, but the essay must WEIGH them rather than list them (e.g. explaining why one side matters more, or under what conditions); ideas extended through claim → explanation → specific example. Possible advantages: maturity and independence, clearer choice of degree (fewer students dropping out or changing course), work experience and savings that reduce debt, practical skills, motivation after a rest. Possible disadvantages: loss of study habits and difficulty returning, cost of travel/inequality (only wealthier families can afford travel), delay in starting a career, risk of the year being wasted without a plan. Penalise: listing advantages and disadvantages without an overall judgement, a judgement that changes, "it depends" with no conditions, undeveloped ideas, irrelevant discussion of university in general, memorised phrases, fewer than 250 words.',
      goiY: [
        'Dạng "Do the advantages outweigh the disadvantages?" (Tập 4 Ngày 14): đề hỏi một PHÁN ĐOÁN, không hỏi liệt kê. Thesis phải trả lời thẳng: "I believe the benefits outweigh the drawbacks, provided that the year is planned." — điều kiện kèm theo là cách band 7+ thể hiện mức độ.',
        'Bố cục 4–5 đoạn: Mở bài (viết lại đề + phán đoán) → Thân 1: mặt hại — nêu thật, không làm "người rơm" → Thân 2 (+3): mặt lợi + vì sao NẶNG HƠN → Kết bài nhắc phán đoán + điều kiện. Thân bài lợi đặt SAU để đoạn mạnh nhất đứng gần kết luận.',
        'Phải CÂN, không chỉ kể: chỉ ra vì sao một mặt quan trọng hơn ("these costs are temporary, whereas…", "this disadvantage can largely be avoided if…"). Đây là khác biệt giữa band 6.5 (liệt kê hai bên) và band 7+ (đánh giá).',
        'Ví dụ cụ thể, không chung chung: một sinh viên làm ở phòng khám một năm rồi đổi ý không học y; tiền tiết kiệm giảm khoản vay; học sinh nghỉ một năm "lười đi" rồi không quay lại học. Mỗi ý: nhận định → cơ chế → ví dụ.',
        'Từ vựng chủ đề: take a gap year / a year out, gain work experience, broaden their horizons, make an informed choice, drop out of a course, lose momentum, fall behind their peers, a structured plan, financial independence, outweigh / be offset by.',
        'Liên kết band 7+ (Tập 4 Ngày 12, Ngày 15): mở đoạn bằng câu chủ đề có định hướng ("Admittedly…", "These drawbacks, however, are outweighed by…"); tham chiếu "this risk", "such experience", "that decision"; hedging (Ngày 13): "are likely to", "tend to", "in many cases".',
        '40 phút: 5′ dàn ý (phán đoán + điều kiện + 2 hại + 2 lợi, ghi sẵn ví dụ) · 30′ viết · 5′ soát theo sổ lỗi của bạn (Tập 4 Ngày 30: mục tiêu ≤ 3 lỗi/bài — mạo từ, giới từ, danh từ đếm được, hoà hợp chủ–vị).',
      ],
      mau: {
        band: 'Band 7.5–8.0 (đích Tập 5 của người đang ở 7.0 — cố ý giữ 2 chỗ chưa chuẩn để bạn tập soi)',
        s: 'In a growing number of countries, school leavers are choosing to spend a year travelling or working before they begin a degree. Although this break carries some genuine risks, I believe that its benefits clearly outweigh them, provided that the year is used with a purpose.\n\nAdmittedly, a gap year is not without drawbacks. The most obvious is that students can lose the habit of study: after twelve months without essays or examinations, returning to a lecture hall may be harder than expected, and a minority never return at all. There is also a question of fairness. Travelling abroad is expensive, so the most impressive experiences tend to be available mainly to young people from wealthy families, which may widen the gap between them and their less privileged peers.\n\nThese drawbacks, however, are outweighed by what a well-spent year can offer. Most importantly, it allows young people to make a more informed choice about what to study. At eighteen, many students select a course largely on the advice of parents or teachers, and a considerable number later drop out or change subjects, at great cost in time and money. Someone who has spent a year working in a hospital, for instance, is far better placed to judge whether a career in medicine really suits them. A year of paid work also brings financial independence and an experience of work that employers value, and the savings can reduce the debt that many graduates carry for years.\n\nCrucially, the main disadvantages can largely be avoided. Despite of the cost of foreign travel, a year spent working locally offers many of the same benefits for almost nothing, and a clear plan, with a confirmed university place to return to, greatly reduces the risk of drifting.\n\nIn conclusion, while a gap year can be wasted or used to display privilege, I am convinced that, when it is carefully planned, the maturity and clarity it brings make it a worthwhile investment.',
        phanTich: [
          '**Task Response (8)**: trả lời ĐÚNG câu hỏi "outweigh" bằng một phán đoán có điều kiện ngay mở bài ("its benefits clearly outweigh them, provided that the year is used with a purpose") và giữ nguyên tới kết bài. Mặt hại được nêu thật (mất thói quen học, bất công giàu – nghèo), không làm "người rơm"; mặt lợi được đẩy qua ba tầng (chọn ngành có hiểu biết → cơ chế: chọn theo lời người lớn rồi bỏ ngang → ví dụ người làm ở bệnh viện). Đặc biệt, đoạn 4 CÂN hai bên: chỉ ra hai mặt hại có thể tránh được — đây là "weighing" mà band 6.5 thường thiếu.',
          '**Coherence & Cohesion (8)**: 5 đoạn, mỗi đoạn một chức năng; câu chủ đề dẫn hướng rõ ("Admittedly…", "These drawbacks, however, are outweighed by…", "Crucially, the main disadvantages can largely be avoided."). Tham chiếu nối ý xuyên đoạn: "this break", "them", "These drawbacks", "what a well-spent year can offer", "the same benefits". Từ nối thưa và đúng cấp (Tập 4 Ngày 15): cấp đoạn "Admittedly / However / Crucially / In conclusion"; cấp câu "so", "which", "for instance".',
          '**Lexical Resource (8)**: kết hợp từ tự nhiên và chính xác: "school leavers", "carries some genuine risks", "lose the habit of study", "widen the gap", "less privileged peers", "make a more informed choice", "drop out or change subjects", "far better placed to judge", "financial independence", "drifting", "display privilege", "a worthwhile investment". Hedging đúng liều (Ngày 13): "tend to", "may widen", "a minority", "largely". Còn một kết hợp từ chưa chuẩn (xem Soi lỗi).',
          '**Grammar (7.5–8)**: câu phức đa dạng, phần lớn không lỗi: điều kiện "provided that…"; nhượng bộ "Although…", "while…"; mệnh đề quan hệ chỉ hệ quả ", which may widen…"; so sánh "far better placed to judge whether…" (mệnh đề danh ngữ sau động từ — Ngày 11); bị động "are outweighed by", "can largely be avoided"; mệnh đề quan hệ rút gọn "a year spent working locally", "a clear plan, with a confirmed university place to return to". Còn một lỗi giới từ cố định (xem dưới).',
          '🔎 **Soi lỗi — 2 chỗ CỐ Ý giữ lại (hãy tự tìm trước khi đọc tiếp)**: (1) ✗ "**an experience of work** that employers value" → "**work experience** that employers value" ("experience" = kinh nghiệm là danh từ KHÔNG đếm được, kết hợp cố định "work experience"; "an experience" = MỘT trải nghiệm, nghĩa khác); (2) ✗ "**Despite of** the cost of foreign travel" → "**Despite** the cost…" hoặc "**In spite of** the cost…" ("despite" không đi với "of" — lỗi cố định mà người đã ở band 7 vẫn lọt khi viết nhanh; Tập 4 Ngày 28).',
          '**Muốn lên band 8.5–9**: (1) thêm một câu dè dặt về bằng chứng cho ý bỏ học ("Although reliable figures are hard to obtain, universities in several countries report…" — nhưng không bịa số); (2) một câu đảo ngữ hoặc câu chẻ (Tập 4 Ngày 7) ở thân bài lợi: "What a gap year offers above all is time to make that choice deliberately."; (3) kết bài nêu một hàm ý cho nhà trường / gia đình (khuyến khích kế hoạch có cấu trúc thay vì cấm hay cổ vũ mù quáng).',
          '**Lỗi band 6.5 cần tránh**: liệt kê ba lợi ba hại rồi kết "it has both advantages and disadvantages" (không trả lời "outweigh"); thesis nói lợi hơn nhưng kết bài nói "it depends"; ví dụ chung chung ("many students travel to many countries"); mở mọi câu bằng "Firstly / Secondly / Moreover"; lạc sang chuyện học đại học nói chung có cần thiết không.',
        ],
      },
    },
  ],
};
