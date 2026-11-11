/**
 * Đề 0 — Writing của TEST ĐẦU VÀO (docs/ielts-lo-trinh-0-8.md mục 4.3). TỰ SOẠN 12/11/2026.
 * Task 1: bar chart MỘT nhóm (ai cũng mô tả được) dùng `figure` (FigureView) · Task 2: Opinion về chủ đề quen (online learning).
 * Số liệu TỰ ĐẶT. Bài mẫu nhắm band 6.5–7 (đúng mức "đủ, rõ, còn chỗ nâng") + phân tích chỉ ra vì sao chưa phải band 8.
 * `moTaSo` gửi kèm cho AI chấm để đối chiếu từng con số. Task 2 < 100 từ ⇒ band Writing = 3.0 (luật mục 4.3, áp ở phía chấm).
 */
import type { DeViet } from './types';

export const VIET_00: DeViet = {
  id: 'viet-00',
  kyNang: 'viet',
  ten: 'Placement Test — Academic Writing',
  boDe: 'CuongThai Placement Test',
  capDo: 'Band 4.0 → 8.0 (bậc thang)',
  moTa: 'Task 1: time spent reading by age group (single bar chart) · Task 2: is online learning as effective as the classroom? (opinion)',
  phut: 60,
  task: [
    {
      so: 1,
      phut: 20,
      minTu: 150,
      de: 'The chart below shows the average number of hours per week that people in six age groups in one country spent reading for pleasure in 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
      figure: {
        kind: 'bar',
        title: 'Average time spent reading for pleasure, by age group (2024)',
        unit: 'hours per week',
        note: 'Số liệu tự đặt cho bài luyện, không phải thống kê thật của quốc gia nào.',
        categories: ['15–24', '25–34', '35–44', '45–54', '55–64', '65+'],
        series: [{ name: 'Hours per week', values: [2.5, 3.1, 3.4, 4.2, 5.6, 7.3] }],
      },
      moTaSo: 'Average hours per week spent reading for pleasure in 2024, by age group (one country, single series): 15–24: 2.5; 25–34: 3.1; 35–44: 3.4; 45–54: 4.2; 55–64: 5.6; 65 and over: 7.3. The figure rises with every age group; the 65+ group reads almost three times as much as the 15–24 group (7.3 vs 2.5). The largest single jump is between 55–64 and 65+ (+1.7 hours); the smallest is between 25–34 and 35–44 (+0.3 hours).',
      goiY: [
        'Mở bài: paraphrase đề 1 câu ("The bar chart illustrates how many hours a week six age groups… spent reading for pleasure in 2024").',
        'Overview (BẮT BUỘC, 1–2 câu, KHÔNG số): thời gian đọc tăng đều theo tuổi; nhóm 65+ đọc nhiều nhất, 15–24 ít nhất.',
        'Thân bài 1: ba nhóm trẻ (15–24, 25–34, 35–44) — thấp và gần nhau (2.5 → 3.1 → 3.4).',
        'Thân bài 2: ba nhóm lớn tuổi — tăng nhanh dần (4.2 → 5.6 → 7.3); so sánh 65+ với 15–24 (gần gấp ba).',
        'Chỉ MỘT năm, MỘT chuỗi ⇒ không có "xu hướng theo thời gian"; dùng ngôn ngữ so sánh (higher than, nearly three times as much, the gap widens), không dùng "increased over the period".',
        'Không giải thích nguyên nhân, không nêu ý kiến. 20 phút: 3′ đọc số · 14′ viết · 3′ soát.',
      ],
      mau: {
        band: 'Band 6.5–7 (bài mẫu tự viết)',
        s: 'The bar chart illustrates how many hours per week people in six different age groups spent reading for pleasure in one country in 2024.\n\nOverall, it is clear that the older people were, the more time they spent reading. The oldest group read for by far the longest, while teenagers and young adults read the least.\n\nLooking at the younger age groups first, people aged 15 to 24 read for only 2.5 hours a week, which was the lowest figure in the chart. The 25–34 group spent slightly longer, at 3.1 hours, and this rose again to 3.4 hours among those aged 35 to 44. These three figures were quite close to each other, so there was not a big difference between the younger groups.\n\nIn contrast, the figures for the older groups were considerably higher. People aged 45 to 54 read for 4.2 hours a week, and this increased to 5.6 hours for the 55–64 group. The highest figure of all was for people aged 65 and over, who read for 7.3 hours per week. This was nearly three times as much as the youngest group, and the gaps between neighbouring groups widened steadily from the age of 45 onwards.',
        phanTich: [
          '**Đạt band 6.5–7 vì**: có overview riêng (xu hướng + cao nhất/thấp nhất, không số); đủ 6 số liệu, chia hai đoạn theo nhóm trẻ/già; so sánh đúng chỗ ("nearly three times as much", "the gaps… widened steadily from the age of 45 onwards" — chỉ nói từ 45 tuổi vì khoảng cách 25–34 → 35–44 (0.3) lại NHỎ hơn 15–24 → 25–34 (0.6); viết "càng già khoảng cách càng lớn" cho cả biểu đồ là sai số liệu); ngữ pháp ổn ("the older…, the more…", mệnh đề quan hệ "who read for 7.3 hours").',
          '**Chưa lên band 7.5–8 vì**: (1) diễn đạt số còn lặp "read for X hours" 5 lần — band 8 đa dạng hơn ("spent just over three hours", "a figure of 4.2"); (2) câu "so there was not a big difference" hơi nói chuyện — nên viết "with a difference of less than an hour between them"; (3) từ nối cơ bản "Looking at… first", "In contrast" — đúng nhưng ít linh hoạt; (4) không gộp thành nhận xét sắc hơn (ví dụ: mức tăng giữa các nhóm từ 0.3 lên 1.7 giờ).',
          '**Lỗi hay gặp ở band 5–6 mà bài này tránh được**: không viết "increased over time" (chỉ có MỘT năm); không bịa lý do ("because old people have more free time"); không chép nguyên câu đề.',
          '**Muốn tự nâng**: thay một câu ở mỗi đoạn thân bằng cụm danh từ số liệu ("at 2.5 hours, the youngest group…"; "a rise of 1.4 hours") và thêm một câu nhóm số ("the two oldest groups together accounted for…" KHÔNG dùng được ở đây vì không phải %, nhưng có thể: "only the two oldest groups exceeded five hours").',
        ],
      },
    },
    {
      so: 2,
      phut: 40,
      minTu: 250,
      de: 'Some people believe that studying online is just as effective as studying in a classroom with a teacher.\n\nTo what extent do you agree or disagree?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
      moTaSo: 'Opinion essay (agree/disagree). Expected: a clear position stated in the introduction and maintained throughout; at least two developed reasons with specific examples; a conclusion that restates the position. A partial-agreement position is acceptable if the extent is made clear. No data to check.',
      goiY: [
        'Dạng Opinion ("To what extent…"): nêu rõ MỨC ĐỘ đồng ý ngay mở bài (hoàn toàn / phần lớn / chỉ trong một số trường hợp) và giữ nhất quán đến kết bài.',
        'Bố cục 4 đoạn: Mở bài (paraphrase + quan điểm) → Thân 1: lý do 1 + ví dụ cụ thể → Thân 2: lý do 2 (hoặc giới hạn của quan điểm) + ví dụ → Kết bài.',
        'Ví dụ CỤ THỂ: môn học nào (lập trình, ngoại ngữ, thí nghiệm hoá), tình huống nào (học sinh ở nông thôn, người đi làm) — tránh "many people think…".',
        'Từ vựng chủ đề: self-discipline, face-to-face interaction, instant feedback, flexibility, hands-on practice, distractions, motivation.',
        'Dưới 100 từ ⇒ band 3.0 theo luật test đầu vào. 40 phút: 5′ dàn ý · 30′ viết · 5′ soát (thì, số ít/nhiều, mạo từ, chính tả).',
      ],
      mau: {
        band: 'Band 6.5–7 (bài mẫu tự viết)',
        s: 'In recent years, online courses have become a common alternative to traditional lessons, and some people claim that they are just as effective as learning in a classroom. I partly agree with this view: online learning can be equally effective for some subjects and some students, but for many learners the classroom still has clear advantages.\n\nOn the one hand, there are situations where studying online works very well. For subjects that are mainly based on information, such as history or computer programming, students can watch recorded lectures as many times as they need, and they can study at the time that suits them. This flexibility is especially valuable for people who work full-time or live far from a school. For example, a friend of mine completed a data analysis course online while working in a factory, and he now has a better job because of it. In addition, online platforms often provide instant feedback on exercises, which helps students correct their mistakes quickly.\n\nOn the other hand, I believe that a classroom offers things that a screen cannot replace. Firstly, many students find it difficult to stay motivated when they study alone at home, where there are many distractions such as social media. In a classroom, the teacher can notice when a student is confused and explain the point again immediately. Secondly, some subjects require practical activities. It is almost impossible to learn to speak a foreign language confidently or to do a chemistry experiment properly without face-to-face interaction and real equipment.\n\nIn conclusion, although online learning can be as effective as classroom learning for certain subjects and for self-disciplined students, I think that most learners still benefit more from having a teacher in the room. The best solution may be to combine both methods.',
        phanTich: [
          '**Đạt band 6.5–7 vì (TR)**: quan điểm rõ ngay mở bài ("I partly agree… but…") và nhắc lại ở kết bài; mỗi thân bài một ý trung tâm, có ví dụ cụ thể (bạn học data analysis khi làm ở nhà máy; ngoại ngữ, thí nghiệm hoá).',
          '**CC**: bố cục 4 đoạn rõ; từ nối đúng chức năng ("On the one hand / On the other hand", "Firstly / Secondly", "In addition") — nhưng còn MÁY MÓC, đúng kiểu band 6–7; band 8 dùng tham chiếu ("this flexibility", "such subjects") nhiều hơn và bớt liệt kê.',
          '**LR**: từ vựng chủ đề đúng và tự nhiên ("recorded lectures", "instant feedback", "distractions", "face-to-face interaction", "self-disciplined"); chưa có từ ít gặp/collocation học thuật kiểu band 8 ("a prerequisite for", "foster independent learning", "the immediacy of").',
          '**GRA**: trộn câu đơn + phức, mệnh đề quan hệ ("people who work full-time"), nhượng bộ ("although…") — gần như không lỗi. Thiếu cấu trúc nâng cao (cleft, đảo ngữ, mệnh đề phân từ) nên dừng ở 7.',
          '**Điểm trừ nhỏ**: "I think that" lặp với "I believe"; kết bài thêm ý mới ("combine both methods") — chấp nhận được ở band 7 nhưng band 8 nên đã gợi ý này ở thân bài.',
          '**Muốn lên 7.5+**: thay "Firstly/Secondly" bằng câu chủ đề có nội dung; thêm một câu phản biện ngắn trong thân 1 ("Admittedly, this only works for learners who…"); nâng 3–4 cụm từ lên mức học thuật.',
        ],
      },
    },
  ],
};
