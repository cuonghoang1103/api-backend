/**
 * Đề Writing số 1 (Academic) — Task 1 biểu đồ cột + Task 2 discuss both views. TỰ SOẠN 07/10/2026.
 * Số liệu biểu đồ là số GIẢ ĐỊNH (không phải thống kê thật của thành phố nào).
 * Bài mẫu viết mới, nhắm band 8 — kèm phân tích nối câu/triển khai ý theo band descriptors.
 */
import type { DeViet } from './types';

export const VIET_01: DeViet = {
  id: 'viet-01',
  kyNang: 'viet',
  ten: 'Academic Writing — Test 1',
  boDe: 'CuongThai Practice Tests 1',
  capDo: 'Band 6 → 7.5',
  moTa: 'Task 1: commuting by transport type (bar chart) · Task 2: practical skills vs academic education',
  phut: 60,
  task: [
    {
      so: 1,
      phut: 20,
      minTu: 150,
      de: 'The chart below shows the percentage of commuters in one city who used five different ways of travelling to work in 2005, 2015 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
      bieuDo: {
        loai: 'cot',
        tieuDe: 'Main way of travelling to work (% of commuters)',
        donVi: '%',
        nhom: ['Car', 'Bus', 'Bicycle', 'Metro', 'Walking'],
        chuoi: [
          { ten: '2005', so: [52, 23, 6, 0, 19] },
          { ten: '2015', so: [44, 21, 12, 14, 9] },
          { ten: '2025', so: [31, 19, 21, 24, 5] },
        ],
        max: 60,
        buoc: 10,
      },
      moTaSo: 'Percentage of commuters (2005 / 2015 / 2025): Car 52 / 44 / 31; Bus 23 / 21 / 19; Bicycle 6 / 12 / 21; Metro 0 / 14 / 24 (metro opened between 2005 and 2015); Walking 19 / 9 / 5. Each year totals 100%.',
      goiY: [
        'Mở bài: paraphrase đề (1 câu) — đừng chép nguyên câu đề.',
        'Overview (BẮT BUỘC cho band 6+): 2 xu hướng lớn nhất — xe hơi giảm mạnh nhưng vẫn phổ biến nhất; metro và xe đạp tăng nhanh.',
        'Thân bài 1: nhóm GIẢM (car, bus, walking) có số liệu + so sánh.',
        'Thân bài 2: nhóm TĂNG (bicycle, metro) — metro từ 0 lên 24%, gần bằng car.',
        'Không nêu ý kiến cá nhân, không giải thích nguyên nhân (Task 1 chỉ mô tả).',
      ],
      mau: {
        band: 'Band 8 (bài mẫu tự viết)',
        s: 'The bar chart compares the proportions of commuters in a city who travelled to work by car, bus, bicycle, metro or on foot in 2005, 2015 and 2025.\n\nOverall, the car remained the most common way of getting to work throughout the period, but its share fell considerably, while cycling and the metro grew rapidly. By 2025, travel to work had become far more evenly spread across the different options.\n\nIn 2005, just over half of all commuters (52%) drove to work, and this figure dropped steadily to 44% in 2015 and to 31% in 2025. The bus saw a much smaller decline, from 23% to 19%. Walking, which had been the third most popular choice at the start of the period, fell most sharply in relative terms, from almost a fifth of commuters to only 5%.\n\nBy contrast, the metro, which did not exist in 2005, was used by 14% of commuters in 2015 and by nearly a quarter (24%) in 2025, making it the second most popular option. Cycling followed a similar upward trend, more than tripling from 6% to 21% over the twenty years.',
        phanTich: [
          '**Overview tách đoạn riêng** ngay sau mở bài, nói XU HƯỚNG chứ không nói số — giám khảo tìm đoạn này đầu tiên để cho TA ≥ 6.',
          '**Nhóm dữ liệu theo xu hướng** (giảm ở đoạn 3, tăng ở đoạn 4) thay vì đi lần lượt từng phương tiện — đây là điểm CC band 7–8.',
          '**Từ nối có chức năng**: "Overall", "By contrast", "followed a similar upward trend" — mỗi từ nối báo một quan hệ ý rõ ràng, không rải "Moreover/Furthermore" vô nghĩa.',
          '**Diễn đạt số đa dạng** (LR): "just over half", "almost a fifth", "nearly a quarter", "more than tripling" — tránh lặp "the percentage of".',
          '**Câu phức có mệnh đề quan hệ** (GRA): "the metro, which did not exist in 2005, was used by…".',
        ],
      },
    },
    {
      so: 2,
      phut: 40,
      minTu: 250,
      de: 'Some people think that universities should mainly teach practical skills that prepare students for specific jobs. Others believe that the main purpose of a university is to give students a broad academic education.\n\nDiscuss both these views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
      goiY: [
        'Dạng "Discuss both views + opinion": PHẢI bàn đủ hai quan điểm VÀ nêu ý kiến của mình rõ ràng (ngay mở bài và nhắc lại ở kết bài).',
        'Bố cục 4 đoạn: Mở bài (paraphrase + quan điểm) → Đoạn 2: view 1 → Đoạn 3: view 2 (+ vì sao bạn nghiêng về đâu) → Kết bài.',
        'Mỗi đoạn thân: 1 câu chủ đề → giải thích → ví dụ cụ thể → câu nối lại ý chính.',
        'Tránh ví dụ chung chung ("many people think…"); dùng ví dụ có ngành nghề, tình huống cụ thể.',
        '40 phút: 5′ lập dàn ý · 30′ viết · 5′ soát lỗi (số ít/nhiều, thì, mạo từ).',
      ],
      mau: {
        band: 'Band 8 (bài mẫu tự viết)',
        s: 'People disagree about what universities are for. While some argue that higher education should focus on the practical skills needed for particular careers, others maintain that its main role is to provide a broad academic education. In my view, universities should prioritise broad knowledge, but they cannot afford to ignore the realities of the job market.\n\nThose who favour a practical approach make a reasonable case. University is expensive, both for students and for the governments that fund it, and most graduates expect their degree to lead to employment. When a course in, say, accounting or nursing includes real workplace training, graduates can be productive almost immediately, which benefits employers as well as the graduates themselves. In countries with high youth unemployment, a degree that does not lead to a job can feel like a costly mistake.\n\nOn the other hand, there are strong reasons to believe that a narrow, job-specific education is a poor investment in the long run. Many of the skills that employers value most, such as analysing evidence, writing clearly and solving unfamiliar problems, are developed through academic study rather than vocational training. Moreover, technology is changing jobs so quickly that a skill which is in demand today may be automated within a decade. A graduate who has learned how to learn is far better prepared for that kind of change than one who has only been trained for a single role.\n\nIn conclusion, although practical skills clearly have a place, I believe the central purpose of a university should be to give students a broad intellectual foundation. The best courses combine the two, using work placements and projects to show students how academic knowledge can be applied in the real world.',
        phanTich: [
          '**Quan điểm rõ ngay mở bài** ("In my view, universities should prioritise broad knowledge, but…") và nhắc lại ở kết bài — TR band 7+ đòi "a clear position throughout".',
          '**Mỗi đoạn thân một ý trung tâm**: đoạn 2 nói lý lẽ của phe thực hành (chi phí + việc làm), đoạn 3 phản biện (kỹ năng chuyển đổi + tự động hoá). Không nhồi 4–5 ý nông.',
          '**Triển khai ý theo chuỗi**: luận điểm → giải thích → ví dụ cụ thể ("accounting or nursing") → hệ quả ("benefits employers as well as…").',
          '**Liên kết bằng tham chiếu**, không chỉ từ nối: "Those who favour…", "that kind of change", "the two" — giúp CC lên 8.',
          '**Từ vựng chính xác, ít phổ biến** (LR): "prioritise", "a poor investment in the long run", "automated", "intellectual foundation".',
          '**Ngữ pháp đa dạng**: câu điều kiện ngầm, mệnh đề quan hệ, cấu trúc nhượng bộ "although…" — và gần như không lỗi.',
        ],
      },
    },
  ],
};
