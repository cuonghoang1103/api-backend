/**
 * Đề 7 — Academic Writing, GIỮA TẬP 4 (docs/ielts-lo-trinh-0-8.md mục 4.2 · sau Tập 4 Ngày 15). TỰ SOẠN 18/11/2026.
 * Task 1: LINE GRAPH NHIỀU ĐƯỜNG (4 đường, 6 mốc — T4 N6 "line 3: nhiều đường, nhóm xu hướng"; ngôn ngữ so sánh band 7 T4 N9,
 * nhóm số liệu – ngoại lệ – tỉ lệ T4 N12) · Task 2: OPINION "To what extent do you agree or disagree?" (T4 N4 "Opinion band 7 —
 * ý mở rộng 3 tầng, ví dụ cụ thể", T4 N2 band 7 trông thế nào, cohesion T4 N12, từ nối đúng liều T4 N15), chủ đề: có còn cần
 * bắt học sinh ghi nhớ kiến thức khi mọi thứ tra được trên mạng.
 * Số liệu Task 1 TỰ ĐẶT cho bài thi thử (tỉ lệ người sống một mình theo nhóm tuổi ở "một quốc gia", 1975–2025) — không phải
 * thống kê thật của nước nào.
 * Người làm Đề 7 nhắm band 6.5 ⇒ bài mẫu ở mức band 7.0–7.5 = đích kế tiếp. Để nhãn band TRUNG THỰC, mỗi bài CỐ Ý GIỮ 2 chỗ
 * chưa chuẩn (so sánh, giới từ, hoà hợp chủ–vị, kết hợp từ) — mục "🔎 Soi lỗi" trong `phanTich` chỉ rõ + cách sửa. KHÔNG phải
 * lỗi soạn thảo: sửa câu thì phải sửa luôn phần phân tích.
 * `figure.kind = 'line'`: `categories` = các năm, `series` = 4 nhóm tuổi (đơn vị %). `moTaSo` gửi kèm cho AI chấm.
 */
import type { DeViet } from './types';

export const VIET_DE7: DeViet = {
  id: 'viet-de7',
  kyNang: 'viet',
  ten: 'Academic Writing — Đề 7 (giữa Tập 4)',
  boDe: 'Đề 7',
  capDo: 'Band 6.5',
  moTa: 'Task 1: people living alone in four age groups, 1975–2025 (line graph with four lines) · Task 2: is it still necessary for schools to make students memorise facts? (opinion)',
  phut: 60,
  task: [
    {
      so: 1,
      phut: 20,
      minTu: 150,
      de: 'The graph below shows the percentage of people in four age groups who lived alone in one country between 1975 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
      figure: {
        kind: 'line',
        title: 'People living alone in one country, by age group, 1975–2025',
        unit: '% of each age group',
        note: 'Số liệu tự đặt cho bài thi thử, không phải thống kê thật của nước nào.',
        categories: ['1975', '1985', '1995', '2005', '2015', '2025'],
        series: [
          { name: '18–34', values: [4, 7, 11, 12, 10, 9] },
          { name: '35–54', values: [5, 6, 9, 13, 15, 16] },
          { name: '55–74', values: [14, 16, 19, 23, 27, 30] },
          { name: '75 and over', values: [38, 41, 45, 47, 46, 44] },
        ],
      },
      moTaSo: 'Line graph with FOUR lines: percentage of people in each age group who lived alone, one country, measured every ten years. 18–34: 1975 4%; 1985 7%; 1995 11%; 2005 12%; 2015 10%; 2025 9%. 35–54: 1975 5%; 1985 6%; 1995 9%; 2005 13%; 2015 15%; 2025 16%. 55–74: 1975 14%; 1985 16%; 1995 19%; 2005 23%; 2015 27%; 2025 30%. 75 and over: 1975 38%; 1985 41%; 1995 45%; 2005 47%; 2015 46%; 2025 44%. Main features: every group ended higher than it began; the 75-and-over group was by far the highest throughout, peaked at 47% in 2005 and then fell slightly to 44%; the 55–74 group rose in every decade and more than doubled (14% to 30%), so the gap with the oldest group narrowed from 24 to 14 percentage points; the 35–54 group rose steadily from 5% to 16%; the 18–34 group rose to a peak of 12% in 2005 and then fell to 9%, being overtaken by the 35–54 group between 1995 and 2005 and finishing lowest. A good answer groups the lines (e.g. two older groups / two younger groups, or two lines that peaked in 2005 / two that rose throughout) instead of describing each line separately, gives an overview without figures, and does not speculate about reasons.',
      goiY: [
        'Mở bài (1 câu): viết lại đề bằng từ khác — "The line graph compares the proportion of people in four age groups who lived on their own in one country over a fifty-year period." KHÔNG chép nguyên câu đề; đổi "percentage" → "proportion", "between 1975 and 2025" → "over a fifty-year period".',
        'Overview (BẮT BUỘC, 2 câu, KHÔNG số): (1) sống một mình phổ biến hơn ở MỌI nhóm tuổi, nhưng hai nhóm lớn tuổi luôn cao hơn hẳn hai nhóm trẻ; (2) hai đường đạt đỉnh năm 2005 rồi giảm (nhóm già nhất + nhóm trẻ nhất), hai đường giữa tăng suốt. Đây là bước "nhóm xu hướng" của Tập 4 Ngày 6.',
        'Bốn đường × sáu mốc = 24 con số — KHÔNG kể hết. Chọn: số đầu + số cuối của mỗi đường, hai đỉnh năm 2005 (47% và 12%), và điểm hai đường trẻ CẮT nhau (giữa 1995 và 2005). Khoảng 10–12 con số là đủ.',
        'Chia thân bài theo NHÓM, không theo từng đường: Thân 1 = hai nhóm lớn tuổi (75+ và 55–74: khoảng cách thu hẹp) · Thân 2 = hai nhóm trẻ (35–54 tăng đều; 18–34 tăng rồi giảm, bị vượt qua).',
        'Ngôn ngữ so sánh band 7 (Tập 4 Ngày 9, Ngày 12): "almost three times as high as", "more than doubled", "the gap narrowed considerably", "by far the highest", "the former… the latter…", "overtook", "peaked at… before slipping back to…". Trộn động từ ("rose gradually") với cụm danh từ ("a gradual rise").',
        'Thì: quá khứ đơn cho cả bài — kể cả năm 2025 (đề viết "lived", "between 1975 and 2025": dữ liệu đã có, không phải dự báo). Quá khứ hoàn thành cho việc xảy ra trước một mốc: "which had been slightly above… in 1985 and 1995".',
        '20 phút: 3′ đọc biểu đồ + khoanh đỉnh, điểm cắt, đường cao nhất / thấp nhất · 14′ viết · 3′ soát (đơn vị %, giới từ "in 2005 / to 44% / by 2025", "as… as"). KHÔNG giải thích nguyên nhân (già hoá, ly hôn…) — biểu đồ không cho biết.',
      ],
      mau: {
        band: 'Band 7.0–7.5 (đích kế tiếp của người đang ở 6.5 — cố ý giữ 2 chỗ chưa chuẩn để bạn tập soi)',
        s: 'The line graph compares the proportion of people in four age groups who lived on their own in one country over a fifty-year period, from 1975 to 2025.\n\nOverall, living alone became more common in every age group, although the two older groups remained far more likely to do so than the two younger ones. It is also noticeable that the figures for the oldest and the youngest groups peaked in 2005, whereas those for the two middle groups rose throughout.\n\nIn 1975, 38% of people aged 75 and over lived alone, which was almost three times as high than the figure for those aged 55–74 (14%). The former climbed steadily to a peak of 47% in 2005, before slipping back to 44% by the end of the period. By contrast, the percentage of 55-to-74-year-olds living alone grew without interruption and more than doubled, reaching 30% at 2025, so the gap between these two groups narrowed considerably.\n\nThe figures for younger adults were much lower. Only 5% of people aged 35–54 and 4% of those aged 18–34 lived by themselves in 1975. The proportion of the former rose gradually to 16%, while that of the latter increased more quickly at first, to 12% in 2005, but then fell to 9%. As a result, the 18–34 group, which had been slightly above the 35–54 group in 1985 and 1995, finished with the lowest figure on the graph.',
        phanTich: [
          '**Task Achievement (7.5)**: overview rõ, đứng riêng một đoạn, KHÔNG số, nêu được HAI khái quát — mức chung (mọi nhóm tăng, hai nhóm già luôn cao hơn) và hình dạng đường (hai đường đạt đỉnh 2005, hai đường tăng suốt). Thân bài chọn lọc: 12 con số trên tổng 24, đủ số đầu – số cuối của cả bốn đường, hai đỉnh, và điểm hai đường trẻ đổi chỗ. Không suy đoán nguyên nhân.',
          '**Coherence & Cohesion (7.5)**: 4 đoạn; thân bài chia theo NHÓM (hai nhóm già / hai nhóm trẻ) chứ không đi từng đường — đúng bài Tập 4 Ngày 6. Tham chiếu thay cho lặp từ (Ngày 12): "do so", "those for the two middle groups", "The former… the latter", "these two groups", "that of the latter". Từ nối đúng liều (Ngày 15): chỉ "Overall", "By contrast", "As a result" ở đầu câu; còn lại nối bằng "whereas", "while", "before", "so" bên trong câu.',
          '**Lexical Resource (7)**: thay "lived alone" bằng "lived on their own", "lived by themselves", "do so"; động từ xu hướng chính xác theo MỨC độ: "climbed steadily", "slipping back" (giảm nhẹ), "grew without interruption", "rose gradually", "increased more quickly at first". Cụm so sánh: "far more likely", "more than doubled", "narrowed considerably", "finished with the lowest figure". Còn một chỗ giới từ sai (xem Soi lỗi).',
          '**Grammar (7)**: mệnh đề quan hệ không xác định ", which was almost three times…", ", which had been slightly above…"; phân từ "reaching 30%…"; "before slipping back" (giới từ + V-ing); quá khứ hoàn thành đúng chỗ ("had been slightly above… in 1985 and 1995" — trước mốc kết thúc); nhượng bộ "although"; đối lập "whereas / while". Phần lớn câu không lỗi — tiêu chí "frequent error-free sentences" của band 7; còn một lỗi cấu trúc so sánh (xem dưới).',
          '🔎 **Soi lỗi — 2 chỗ CỐ Ý giữ lại (hãy tự tìm trước khi đọc tiếp)**: (1) ✗ "almost three times **as high than** the figure" → "three times **as high as** the figure" (as + adj + AS; "than" chỉ đi với so sánh hơn: "three times higher than"); (2) ✗ "reaching 30% **at** 2025" → "**in** 2025" (in + năm; "at" + giờ / thời điểm: at the end of the period).',
          '**Muốn lên band 8**: (1) nêu khoảng cách bằng số cho sắc: "narrowing the gap from 24 to 14 percentage points"; (2) một câu danh hoá mở đoạn: "The most striking change was the doubling of the figure for the 55–74 age group."; (3) chỉ rõ thời điểm đổi chỗ: "the 35–54 group overtook the youngest group at some point between 1995 and 2005".',
          '**Lỗi band 6 cần tránh**: tả lần lượt từng đường thành bốn đoạn rời; chép đủ 24 con số; overview có số hoặc chỉ nói "there were many changes"; viết "percent of people was increased" (bị động sai); dùng thì hiện tại hoặc "will" cho năm 2025; giải thích nguyên nhân ("because old people\'s children move to cities").',
        ],
      },
    },
    {
      so: 2,
      phut: 40,
      minTu: 250,
      de: 'Some people think that, because information can now be found instantly on the internet, schools no longer need to make students learn facts by heart.\n\nTo what extent do you agree or disagree?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
      moTaSo: 'Opinion essay (To what extent do you agree or disagree?) about whether schools still need to make students memorise facts now that information is instantly available online. Expected at band 7: a clear position, with its DEGREE, stated in the introduction and maintained to the conclusion (agree, disagree or a qualified position are all acceptable); two or three main ideas that are EXTENDED and supported — each developed through claim → mechanism/explanation → specific example, not left as generalisations (e.g. disagree: understanding and reading comprehension depend on background knowledge; you cannot search for what you do not know exists; judging the reliability of online information requires knowledge; memory frees attention for higher-level thinking. Agree: lists of dates or formulae are quickly forgotten; class time is better spent on analysis, problem-solving and search skills; rote learning can kill interest); ideally a concession to the opposite view that is then answered; a conclusion that restates the position without new ideas. No data to check. Penalise: a position that changes or is unclear ("both are important"), ideas listed without development, drifting into a general essay on technology in education, memorised phrases, fewer than 250 words.',
      goiY: [
        'Dạng Opinion "To what extent…?" ở band 7 (Tập 4 Ngày 4): nêu lập trường CÓ MỨC ĐỘ ngay mở bài ("I largely disagree", "I agree only up to a point") và giữ nguyên tới kết bài. "Both sides are important" không phải lập trường.',
        'Phân tích đề trước khi viết: đề KHÔNG hỏi "internet có ích cho việc học không" mà hỏi "còn cần HỌC THUỘC kiến thức không". Từ khoá: "no longer need", "learn facts by heart". Lạc sang lợi ích của công nghệ nói chung là mất điểm Task Response.',
        'Bố cục 4–5 đoạn: Mở bài (viết lại đề + thesis có mức độ) → Thân 1: nhượng bộ — phần ĐÚNG của ý kiến kia ("Admittedly, …") → Thân 2 (+3): lý do chính của bạn → Kết bài. Mỗi thân bài MỘT ý, đẩy qua ba tầng: nhận định → cơ chế (vì sao) → ví dụ cụ thể.',
        'Ví dụ phải CỤ THỂ, không khái quát kiểu "knowledge is power": một tình huống (học sinh tra từng từ thì không theo nổi lập luận), một nghề (bác sĩ không biết triệu chứng thì không biết tra gì), một so sánh (kỳ thủ phải tra cách đi quân).',
        'Liên kết band 7 (Tập 4 Ngày 12, Ngày 15): bớt từ nối đầu câu; dùng tham chiếu "this view", "that justification", "such knowledge", "in this narrow sense"; từ nối cấp đoạn: "Admittedly", "However, it does not follow that…", "A further reason is that…".',
        'Từ vựng chủ đề: learn by heart / memorise / rote learning, background knowledge, look something up, retain information, critical judgement, reliable source, raw material for thinking, isolated details. Hedging vừa đủ: "arguably", "is likely to", "in general".',
        '40 phút: 5′ dàn ý (lập trường + 2–3 ý, mỗi ý ghi sẵn ví dụ) · 30′ viết · 5′ soát theo các lượt của Tập 4 (hoà hợp chủ–vị, mạo từ, giới từ sau động từ, chính tả). Dưới 250 từ bị trừ điểm.',
      ],
      mau: {
        band: 'Band 7.0–7.5 (đích kế tiếp của người đang ở 6.5 — cố ý giữ 2 chỗ chưa chuẩn để bạn tập soi)',
        s: 'Now that almost any fact can be found on a phone within seconds, it is sometimes argued that schools are wasting pupils\' time when they require them to learn information by heart. While I accept that some traditional memorisation has lost its purpose, I largely disagree with this view, because knowledge held in the memory is what makes thinking possible.\n\nAdmittedly, there are things which no longer deserve the hours once spent on them. Earlier generations had to memorise long lists of dates, capital cities or chemical formulae simply because looking them up was slow. Today that justification has disappeared, and a history teacher who tests nothing but dates is arguably teaching the wrong skill. In this narrow sense, the critics have a point.\n\nHowever, it does not follow that facts in general can be left on the internet. The main reason is that understanding depends on what a person already knows. A student who has to search the meaning of every second word cannot follow an argument, in the same way that a chess player who had to look up how each piece moves could never plan a game. Reading research have repeatedly shown that pupils who know a good deal about a topic understand a text on it far better than stronger readers who know little. Knowledge, in other words, is not the opposite of thinking but its raw material.\n\nA further reason is that people cannot search for something they do not know exists. A doctor who has never learnt the symptoms of a rare disease will not think of checking for it, however good the database. Judging whether online information is reliable also requires knowledge: without it, a confident false claim and a true one look identical.\n\nIn conclusion, although schools should stop demanding the memorisation of isolated details, I believe that a solid store of remembered knowledge remains essential, since both understanding and critical judgement are built on it.',
        phanTich: [
          '**Task Response (7.5)**: lập trường có MỨC ĐỘ, nêu ngay mở bài ("I largely disagree") và giữ nhất quán tới kết bài; bám đúng câu hỏi (HỌC THUỘC, không lan sang công nghệ nói chung). Có đoạn nhượng bộ riêng (danh sách ngày tháng, thủ đô — phần đúng của ý kia), rồi hai ý chính đều được ĐẨY QUA BA TẦNG: nhận định (hiểu phụ thuộc vào cái đã biết) → cơ chế (tra từng từ thì không theo được lập luận) → ví dụ (kỳ thủ; nghiên cứu về đọc hiểu); ý hai có ví dụ bác sĩ + hệ quả về đánh giá nguồn tin. Chưa lên 8 vì ví dụ nghiên cứu còn chung chung, không nêu được nghiên cứu nào.',
          '**Coherence & Cohesion (7.5)**: 5 đoạn, mỗi đoạn một việc; câu chủ đề báo đúng hướng ("Admittedly…", "However, it does not follow that…", "A further reason is that…"). Liên kết bằng tham chiếu nhiều hơn từ nối (Tập 4 Ngày 12): "this view", "that justification", "In this narrow sense", "it", "its raw material", "without it". Từ nối đầu câu rất ít và đúng chỗ (Ngày 15); câu chốt đoạn 3 ("Knowledge, in other words, is not the opposite of thinking but its raw material") gói ý lại trước khi sang ý mới.',
          '**Lexical Resource (7–7.5)**: từ ít gặp dùng đúng: "learn information by heart", "has lost its purpose", "that justification has disappeared", "tests nothing but dates", "raw material", "a solid store of remembered knowledge", "critical judgement", "isolated details". Kết hợp từ tự nhiên: "wasting pupils\' time", "the critics have a point", "follow an argument", "however good the database". Hedging vừa đủ: "sometimes argued", "arguably", "in general". Còn một chỗ thiếu giới từ (xem Soi lỗi).',
          '**Grammar (7)**: câu phức đa dạng và phần lớn không lỗi: "Now that…" (mệnh đề lý do); nhượng bộ "While I accept that…", "although schools should…"; mệnh đề quan hệ "things which no longer deserve the hours once spent on them" (có phân từ rút gọn "once spent" — Tập 4 Ngày 5); "it does not follow that…"; so sánh giả định "a chess player who had to look up… could never plan"; "however good the database" (nhượng bộ rút gọn); cấu trúc "not… but…". Còn một lỗi hoà hợp chủ–vị (xem dưới).',
          '🔎 **Soi lỗi — 2 chỗ CỐ Ý giữ lại (hãy tự tìm trước khi đọc tiếp)**: (1) ✗ "has to **search the meaning** of every second word" → "**search for** the meaning" hoặc gọn hơn "**look up** every second word" (search + nơi tìm: search the internet; search FOR + thứ cần tìm); (2) ✗ "Reading research **have** repeatedly shown" → "**has** repeatedly shown" ("research" là danh từ không đếm được ⇒ động từ số ít — lỗi số 1 ở band 6.5, Tập 4 Ngày 1).',
          '**Muốn lên band 8**: (1) làm ví dụ nghiên cứu cụ thể hơn (nêu loại thí nghiệm: học sinh biết nhiều về một môn thể thao đọc hiểu bài viết về môn đó tốt hơn bạn đọc giỏi nhưng không biết gì); (2) thêm một câu đảo ngữ hoặc câu chẻ (Tập 4 Ngày 7): "Only when basic facts are available without effort can attention be given to analysis."; (3) kết bài nêu hàm ý: trường nên chọn lọc CÁI GÌ đáng nhớ, thay vì bỏ hẳn việc ghi nhớ.',
          '**Lỗi band 6 cần tránh**: thesis mơ hồ ("this essay will discuss both sides"); mỗi ý chỉ một câu rồi sang ý khác; ví dụ khái quát ("for example, many students use Google"); từ nối ở đầu MỌI câu (Firstly, Moreover, Furthermore, In addition…); đổi lập trường ở kết bài; lạc đề sang "ưu nhược điểm của học trực tuyến".',
        ],
      },
    },
  ],
};
