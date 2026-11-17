/**
 * Khoá IELTS — TẬP 3 "5.0 → 6.0" (30 ngày; CEFR B1 → B2). Hạ tầng dựng 18/11/2026.
 *
 * Mục lục 30 ngày theo `docs/ielts-lo-trinh-0-8.md` mục 3.3 (+ "Chỗ dành sẵn" mục 3.6 — nguồn sự thật: dạy cái gì,
 * ở đâu, đến mức nào). Khuôn ngày (mục 3.3): **lẻ = grammar · reading · bài 3**, **chẵn = vocab · writing · bài 3**;
 * bài 3 = **listening** khi N mod 4 ∈ {0, 1}, **speaking** khi N mod 4 ∈ {2, 3}; mỗi ngày + 1 `homework`;
 * Ngày 6 / 12 / 18 / 24 / 30 thêm bài `review` (kiểm tra chặng). Đề 4 (giữa tập, N15) và Đề 5 (thi cuối tập, N30)
 * nằm ở `thi-may`, không nhét vào ngày.
 *
 * TÁCH HẲN khỏi Tập 1 / Tập 2 (cùng bộ khung `components/sach-hoc`, khác khoá):
 *   - `stage: 'sach3'`, `storageKey: 'ielts-t3'` — tiến độ máy chủ + localStorage riêng. Đổi là MẤT tiến độ người học.
 *   - id bài / bài tập: `t3dN-…`. `npm run course:manifest` chặn id sai tiền tố.
 *
 * Nội dung từng ngày: `ngay/ngayN.ts` export `NGAY_N` — cách soạn ở `../SOAN-BAI.md` mục "Soạn Tập 3".
 * Ngày chưa soạn hiện khung "sắp có" theo `MUC_LUC` dưới đây; soạn xong thì mục lục lấy từ manifest.
 */

import { loadNgay } from './ngay';
import { MANIFEST } from './ngay/manifest';
import { TRA_CONG_THUC_T3, TRA_TU_VUNG_T3 } from './tracuu';
import { VIDEO_BAI_T3 } from './videos';

import { defineCourse } from '@/components/sach-hoc/course';
import type { Lesson, Day } from '@/components/sach-hoc/types';

// Các tệp ngay/ngayN.ts lấy kiểu từ đây (giống Tập 2: `import type { Lesson } from '../data'`).
export type { Ex, Block, Voice, Role, Kind, Lesson, Day } from '@/components/sach-hoc/types';

/* ───────────────────────── Bắt đầu Tập 3 ───────────────────────── */

const INTRO: Lesson = {
  id: 't3-bat-dau',
  kind: 'intro',
  title: 'Bắt đầu Tập 3 (band 5.0 → 6.0)',
  goal: 'Biết Tập 3 đưa bạn từ band 5.0 lên 6.0 bằng cách nào, mỗi ngày học gì và cuối tập phải làm được gì.',
  minutes: 6,
  blocks: [
    {
      t: 'recap',
      title: 'Tập 3 dành cho ai',
      items: [
        'Bạn đã học xong **Tập 2** (hoặc làm bài đầu vào được khoảng **band 5.0**): viết đủ 150 / 250 từ đúng dạng, nói Part 2 đủ 2 phút, làm được các dạng Reading / Listening cơ bản.',
        'Tập 3 có **30 ngày**, mỗi ngày **3 bài + 1 bài tập** (~2 giờ). Ngày **6, 12, 18, 24, 30** có **bài kiểm tra chặng**; giữa tập thi **Đề 4** (Ngày 15), cuối tập thi **Đề 5** đủ 4 kỹ năng ở Online Test.',
        'Đích cuối tập: **band 6.0** — Listening ≥ 23/40, Reading ≥ 23/40 (làm đủ 3 passage trong 60 phút), Writing trả lời đủ mọi phần đề với ý kiến rõ, Speaking nói dài sẵn lòng và Part 3 có mức độ.',
        'Band 5 → 6 là **chặng đông người kẹt nhất**: không phải vì thiếu từ, mà vì viết chưa đủ ý, chưa có overview, chưa biết paraphrase. Tập 3 dồn lực vào đúng ba chỗ đó.',
      ],
    },
    { t: 'h', text: 'Mỗi ngày học gì?' },
    {
      t: 'table',
      head: ['Ngày', 'Bài 1', 'Bài 2', 'Bài 3'],
      rows: [
        ['Ngày lẻ (1, 3, 5…)', 'Ngữ pháp', 'Đọc (Reading)', 'Nghe hoặc Nói'],
        ['Ngày chẵn (2, 4, 6…)', 'Từ vựng', 'Viết (Writing)', 'Nghe hoặc Nói'],
      ],
    },
    {
      t: 'p',
      text: 'Khác Tập 2: **Đọc và Viết có mặt ngày nào cũng có** (đọc ngày lẻ, viết ngày chẵn) vì đây là hai kỹ năng kéo band 5 → 6 mạnh nhất. Nghe và Nói luân phiên theo cặp ngày: Ngày 1, 4, 5, 8, 9… là **Nghe**; Ngày 2, 3, 6, 7, 10… là **Nói**.',
    },
    {
      t: 'note',
      title: 'Cách học Tập 3',
      items: [
        'Học **đúng thứ tự** — mỗi điểm của Tập 2 được ôn lại ở mức band 6 (ghi rõ "ôn từ Tập 2 Ngày N"); quên thì mở lại Tập 2 bằng nút ở trang Kế hoạch.',
        'Mỗi bài Viết có **bài mẫu band 5 và band 6 đặt cạnh nhau** — đọc kỹ chỗ khác nhau trước khi tự viết, rồi viết lại theo sổ lỗi.',
        'Từ vựng của mọi ngày tự vào **Flashcards** (bộ "Từ của khoá — Tập 3") — ôn mỗi ngày 10–15 phút.',
        'Câu sai trong Online Test tự vào **Sổ lỗi** — xem lại trước mỗi bài kiểm tra chặng.',
      ],
    },
  ],
};

/* ─────────────── Mục lục 30 ngày (docs/ielts-lo-trinh-0-8.md mục 3.3) ─────────────── */

type Stub = [Lesson['kind'], string];

/** Khung "sắp có" cho ngày chưa soạn — id `t3dN-i` chỉ dùng tới khi ngày đó có tệp `ngayN.ts`. */
const stub = (n: number, i: number, [kind, title]: Stub): Lesson => ({
  id: `t3d${n}-${i}`,
  kind,
  title,
  goal: '',
  minutes: 30,
});

/** 3 bài mỗi ngày theo bảng 3.3 (tên ngắn); Bài tập + Kiểm tra chặng tự thêm ở `DAYS`. */
const MUC_LUC: Stub[][] = [
  /* 1 */ [['grammar', 'Hệ 12 thì — timeline tổng; hoàn thành tiếp diễn, quá khứ hoàn thành'], ['reading', 'Chiến thuật đọc band 6: skim bố cục, paraphrase 4 mức'], ['listening', 'Part 1 giọng trộn UK/US/AU — 10/10 câu']],
  /* 2 */ [['vocab', 'AWL sublist 3 + Giáo dục vòng 2'], ['writing', 'Band 6 trông thế nào — tự chấm theo tiêu chí, viết lại'], ['speaking', 'Band 6 Speaking: tiêu chí, so mẫu band 5 vs 6']],
  /* 3 */ [['grammar', 'Mạo từ vòng 2 — lỗi band 6'], ['reading', 'True / False / Not Given 3 + paraphrase hệ thống'], ['speaking', 'Part 1: Weather · Shopping · Clothes theo 12 khung câu hỏi']],
  /* 4 */ [['vocab', 'Tội phạm, pháp luật & hình phạt'], ['writing', 'Task 1 band 6 — overview chọn 2 điểm, nhóm số liệu'], ['listening', 'Part 2 MCQ + Map (giọng Canada)']],
  /* 5 */ [['grammar', 'Tương lai hoàn thành / tiếp diễn; dự báo trong Task 1'], ['reading', 'Matching headings 2 — ý chính vs chi tiết'], ['listening', 'Số liệu phức: thập phân, %, năm, đơn vị']],
  /* 6 */ [['vocab', 'Chính phủ, chính trị & chi tiêu công'], ['writing', 'Opinion band 6 — thesis có mức độ, phản đề'], ['speaking', 'Part 3 "Why do you think…?" — 2 lý do + ví dụ']],
  /* 7 */ [['grammar', 'Verb patterns nâng cao + tính từ -ed / -ing'], ['reading', 'Short answer 2 + văn bản khoa học tự nhiên'], ['speaking', 'Part 2: Describe a person vòng 2 (người có ảnh hưởng)']],
  /* 8 */ [['vocab', 'AWL sublist 4 + Nhà ở & kiến trúc'], ['writing', 'Task 1 line graph 2 — đường cắt nhau, đường tổng, năm dự báo'], ['listening', 'Part 3 — 3 người nói, Matching']],
  /* 9 */ [['grammar', 'Giới từ phụ thuộc 60 cụm + đoán nghĩa từ ngữ cảnh'], ['reading', 'Sentence completion 3 + Summary hộp từ 2'], ['listening', 'Kỹ năng: bẫy đổi ý, paraphrase khi nghe']],
  /* 10 */ [['vocab', 'Khoa học, nghiên cứu & vũ trụ'], ['writing', 'Discussion band 6 — 2 thân bài cân đối + ý kiến rõ'], ['speaking', 'Part 3 "Do you agree that…?" — đồng ý một phần']],
  /* 11 */ [['grammar', 'So sánh nâng cao cho Task 1: the more…, twice as…, by far'], ['reading', 'Multiple choice 2 — loại 3 đáp án sai'], ['speaking', 'Ngữ pháp nói: chunks + độ trôi chảy']],
  /* 12 */ [['vocab', 'Lịch sử, khảo cổ & di sản'], ['writing', 'Task 1 bar chart 2 — nhiều nhóm, hai biểu đồ'], ['listening', 'Part 2 map + dictation nâng cao (giọng Canada/New Zealand)']],
  /* 13 */ [['grammar', 'Bị động mọi thì + với modal + by agent'], ['reading', 'Multiple choice nhiều đáp án (TWO / THREE)'], ['listening', 'Part 4 — Note completion bài giảng 5 phút']],
  /* 14 */ [['vocab', 'AWL sublist 5 + Công việc vòng 2 + collocation Task 2'], ['writing', 'Advantages / disadvantages band 6 + positive or negative'], ['speaking', 'Part 2: Describe a place vòng 2 + Part 3 ưu–nhược']],
  /* 15 */ [['grammar', 'Điều kiện loại 2 & 3; wish / if only'], ['reading', 'Table completion 2 + Short answer'], ['speaking', 'Part 3 giả định "What would happen if…?"']],
  /* 16 */ [['vocab', 'Kinh doanh, kinh tế & toàn cầu hoá'], ['writing', 'Task 1 pie chart 2 — hai pie theo năm, 3–4 pie'], ['listening', 'Đề nhỏ Part 1+2, 20 câu, không tua']],
  /* 17 */ [['grammar', 'Mệnh đề quan hệ không xác định; rút gọn V-ing / V-ed'], ['reading', 'Flow-chart 2 + Diagram label + ngôn ngữ quy trình'], ['listening', 'Part 3 Flow-chart + MCQ chọn hai']],
  /* 18 */ [['vocab', 'Mạng xã hội vòng 2 + Tính cách & quan hệ + 150 cụm động từ'], ['writing', 'Problem / solution band 6 — giải pháp gắn đúng vấn đề'], ['speaking', 'Phỏng vấn xin việc — câu hỏi kiểu Part 1/3']],
  /* 19 */ [['grammar', 'Câu tường thuật + động từ tường thuật học thuật; modal suy đoán'], ['reading', 'Matching information 2'], ['speaking', 'Part 3 tường thuật ý người khác "Some people say…"']],
  /* 20 */ [['vocab', 'AWL sublist 6 + Giao thông vòng 2'], ['writing', 'Task 1 table 2 — bảng hai chiều, hàng/cột Total'], ['listening', 'Part 3 thảo luận đồ án (giọng New Zealand)']],
  /* 21 */ [['grammar', 'Nhượng bộ / đối lập + nguyên nhân – kết quả'], ['reading', 'Matching features 2'], ['listening', 'Đề Listening đủ 40 câu lần 1, đúng giờ']],
  /* 22 */ [['vocab', 'Động vật, thiên nhiên & đa dạng sinh học'], ['writing', 'Two-part question band 6 + kho ý tưởng'], ['speaking', 'Part 2: Describe an event vòng 2 + "a time when"']],
  /* 23 */ [['grammar', 'Mệnh đề danh ngữ; It is + adj + that / to'], ['reading', 'Yes / No / Not Given 2 + suy luận quan điểm'], ['speaking', 'Part 3 đánh giá "Is it a good thing that…?"']],
  /* 24 */ [['vocab', 'Năng lượng & tài nguyên + collocation Task 1'], ['writing', 'Task 1 mixed charts — hai hình một đề'], ['listening', 'Part 4 Summary + Table completion (giọng New Zealand)']],
  /* 25 */ [['grammar', 'Cụm danh từ phức + danh hoá mức 1'], ['reading', 'Summary từ trong bài 2 + Sentence completion'], ['listening', 'Đề nhỏ Part 3+4, 20 câu + bẫy']],
  /* 26 */ [['vocab', 'Du lịch & văn hoá vòng 2'], ['writing', 'Báo cáo ngắn / tóm tắt số liệu + ôn 7 dạng Task 1'], ['speaking', 'Part 2: Describe an object / activity vòng 2 + đề lạ']],
  /* 27 */ [['grammar', 'Dấu câu + bảng tự soát 6 lượt'], ['reading', 'Reading đủ 3 passage, 60 phút lần 2'], ['speaking', 'Fluency 2: không im quá 3 giây, tự sửa đúng cách']],
  /* 28 */ [['vocab', 'Ngôn ngữ, văn hoá & bản sắc + Sách & văn học + từ dễ nhầm'], ['writing', 'Task 1 process + map band 6'], ['listening', 'Part 2 + Part 4 giọng trộn, Short answer']],
  /* 29 */ [['grammar', 'Câu sai khiến (causative) + ôn tổng ngữ pháp Tập 3'], ['reading', 'Chiến thuật 900 từ / 20 phút, Passage 3 lần đầu'], ['listening', 'Đề Listening 40 câu lần 2, 2 phút kiểm']],
  /* 30 */ [['vocab', '30 idiom tự nhiên + ôn 30 chủ đề'], ['writing', 'Viết lại 2 bài cũ theo sổ lỗi'], ['speaking', 'Giám khảo AI 14 phút lần 2']],
];

/** Ngày có bài kiểm tra chặng (`kind: 'review'`, id `t3dN-kiem-tra`) → các ngày nó gom. */
export const CHANG_T3: Record<number, string> = { 6: 'Ngày 1–6', 12: 'Ngày 7–12', 18: 'Ngày 13–18', 24: 'Ngày 19–24', 30: 'Ngày 25–30' };

const khungNgay = (n: number, ba: Stub[]): Lesson[] => [
  ...ba,
  ['homework', `Bài tập Ngày ${n}`] as Stub,
  ...(CHANG_T3[n] ? [['review', `Kiểm tra chặng (${CHANG_T3[n]})`] as Stub] : []),
].map((s, j) => stub(n, j + 1, s));

export const DAYS: Day[] = MUC_LUC.map((ba, i) => ({ n: i + 1, lessons: MANIFEST[i + 1]?.lessons ?? khungNgay(i + 1, ba) }));

export { INTRO };

/** Khoá IELTS Tập 3 — mọi thứ bộ khung dùng chung (components/sach-hoc) cần biết. */
export const IELTS_T3 = defineCourse({
  // ⚠️ Máy chủ chỉ nhận stage có trong `CAC_SACH` (src/services/ielts/ielts.service.ts) — 'sach3' thêm 18/11/2026.
  stage: 'sach3',
  storageKey: 'ielts-t3',
  title: 'IELTS 4 kỹ năng · Tập 3',
  backHref: '/language/en/ielts',
  ngonNgu: 'en',
  unit: 'Ngày',
  badgeWord: 'Day',
  intro: INTRO,
  extras: [TRA_CONG_THUC_T3, TRA_TU_VUNG_T3],
  links: [
    { href: '/language/en/ielts/tap-2', label: '← Tập 2 (4.0 → 5.0) — ôn lại ngày còn yếu' },
    { href: '/language/en/ielts', label: '← Tập 1 (mất gốc → 4.0)' },
    { href: '/language/en/ielts/thi-may', label: '🖥️ Online Test — thi trên máy tính (Reading · Listening · Writing · Speaking)' },
    { href: '/language/en/ielts/the-tu', label: '🃏 Flashcards (bộ "Từ của khoá — Tập 3")' },
    { href: '/language/en/ielts/so-loi', label: '📒 Sổ lỗi tự động' },
    { href: '/language/en/ielts/luyen-them', label: '📚 Luyện thêm theo chặng (0 → 7.5)' },
  ],
  videos: VIDEO_BAI_T3,
  days: DAYS,
  // Mọi ngày Tập 3 đều tải chậm: mục lục ở ngay/manifest.ts (sinh tự động), nội dung qua loadNgay.
  manifest: MANIFEST,
  loadDay: loadNgay,
  kindLabel: { review: 'Kiểm tra' },
  kindEn: {
    intro: 'Start Here', grammar: 'Grammar', vocab: 'Vocabulary', listening: 'Listening Skills',
    reading: 'Reading Skills', writing: 'Writing Skills', speaking: 'Speaking Skills', homework: 'Homework',
    review: 'Checkpoint Test',
  },
  kindHue: {},
  voice: 'uk-nu',
  tutor: { name: 'Gia sư IELTS', mon: 'ielts' },
  planContext: 'Trang kế hoạch học IELTS Tập 3 (band 5.0 → 6.0): 30 ngày, ngày lẻ ngữ pháp · đọc, ngày chẵn từ vựng · viết, bài 3 luân phiên nghe / nói; kiểm tra chặng Ngày 6/12/18/24/30, Đề 4 giữa tập (Ngày 15) và thi cuối tập Đề 5 trên Online Test.',
});
