/**
 * Khoá IELTS — TẬP 2 "4.0 → 5.0" (24 ngày; CEFR A2+ → B1). Hạ tầng dựng 12/11/2026.
 *
 * Mục lục 24 ngày theo `docs/ielts-lo-trinh-0-8.md` mục 3.2 (nguồn sự thật — dạy cái gì, ở đâu,
 * đến mức nào). Khuôn ngày (mục 0.4): **lẻ = grammar · listening · speaking**, **chẵn = vocab ·
 * reading · writing**, mỗi ngày + 1 `homework`; Ngày 6 / 12 / 18 thêm bài `review` (kiểm tra chặng).
 * Thi cuối Tập 2 = 🖥️ Đề 3 trong `thi-may` (không nhét vào ngày 24).
 *
 * TÁCH HẲN khỏi Tập 1 (cùng bộ khung `components/sach-hoc`, khác khoá):
 *   - `stage: 'sach2'`, `storageKey: 'ielts-t2'` — tiến độ máy chủ + localStorage riêng, không đụng
 *     `sach1` / `ielts-v2` của Tập 1. Đổi một trong hai là MẤT tiến độ người học Tập 2.
 *   - id bài / bài tập: `t2dN-…` (Tập 1 là `dN-…`). `npm run course:manifest` chặn id sai tiền tố.
 *
 * Nội dung từng ngày: `ngay/ngayN.ts` export `NGAY_N` — cách soạn ở `../SOAN-BAI.md` mục "Soạn Tập 2".
 * Ngày chưa soạn hiện khung "sắp có" theo `MUC_LUC` dưới đây; soạn xong thì mục lục lấy từ manifest.
 */

import { loadNgay } from './ngay';
import { MANIFEST } from './ngay/manifest';
import { TRA_CONG_THUC_T2, TRA_TU_VUNG_T2 } from './tracuu';
import { VIDEO_BAI_T2 } from './videos';

import { defineCourse } from '@/components/sach-hoc/course';
import type { Lesson, Day } from '@/components/sach-hoc/types';

// Các tệp ngay/ngayN.ts lấy kiểu từ đây (giống Tập 1: `import type { Lesson } from '../data'`).
export type { Ex, Block, Voice, Role, Kind, Lesson, Day } from '@/components/sach-hoc/types';

/* ───────────────────────── Bắt đầu Tập 2 ───────────────────────── */

const INTRO: Lesson = {
  id: 't2-bat-dau',
  kind: 'intro',
  title: 'Bắt đầu Tập 2 (band 4.0 → 5.0)',
  goal: 'Biết Tập 2 đưa bạn từ band 4.0 lên 5.0 bằng cách nào, mỗi ngày học gì và cuối tập phải làm được gì.',
  minutes: 5,
  blocks: [
    {
      t: 'recap',
      title: 'Tập 2 dành cho ai',
      items: [
        'Bạn đã học xong **Tập 1** (hoặc làm bài đầu vào được khoảng **band 4.0**): đọc được câu đơn, biết 4 phần của bài thi, đã viết thử Task 1 / Task 2.',
        'Tập 2 có **24 ngày**, mỗi ngày **3 bài + 1 bài tập** (~2 giờ). Ngày **6, 12, 18** có **bài kiểm tra chặng**; cuối tập thi **Đề 3** đủ 4 kỹ năng ở Online Test.',
        'Đích cuối tập: **band 5.0** — Listening ≥ 16/40, Reading ≥ 15/40, Writing đủ 150 / 250 từ đúng dạng, Speaking nói Part 2 đủ 2 phút.',
      ],
    },
    { t: 'h', text: 'Mỗi ngày học gì?' },
    {
      t: 'table',
      head: ['Ngày', 'Bài 1', 'Bài 2', 'Bài 3'],
      rows: [
        ['Ngày lẻ (1, 3, 5…)', 'Ngữ pháp', 'Nghe (Listening)', 'Nói (Speaking)'],
        ['Ngày chẵn (2, 4, 6…)', 'Từ vựng', 'Đọc (Reading)', 'Viết (Writing)'],
      ],
    },
    {
      t: 'p',
      text: 'So với Tập 1, **Nói được đẩy lên ngang Nghe**: từ band 4 lên 5, người học hay vỡ ở Speaking (nói ngắn, không kéo dài ý, chưa từng nói đủ 2 phút Part 2). Tập 2 luyện Part 2 sáu lần và mở đầu Part 3.',
    },
    {
      t: 'note',
      title: 'Cách học Tập 2',
      items: [
        'Học **đúng thứ tự** — mỗi điểm ngữ pháp và dạng bài của Tập 1 được ôn lại ở mức khó hơn (nhận ra → dùng đúng → dùng tự nhiên trong bài thi).',
        'Từ vựng của mọi ngày tự vào **Flashcards** (bộ "Từ của khoá — Tập 2") — ôn mỗi ngày 10–15 phút.',
        'Câu sai trong Online Test tự vào **Sổ lỗi** — xem lại trước bài kiểm tra chặng.',
        'Chưa chắc Tập 1? Mở lại **Tập 1** bằng nút ở trang Kế hoạch, ôn ngày còn yếu rồi quay lại.',
      ],
    },
  ],
};

/* ─────────────── Mục lục 24 ngày (docs/ielts-lo-trinh-0-8.md mục 3.2) ─────────────── */

type Stub = [Lesson['kind'], string];

/** Khung "sắp có" cho ngày chưa soạn — id `t2dN-i` chỉ dùng tới khi ngày đó có tệp `ngayN.ts`. */
const stub = (n: number, i: number, [kind, title]: Stub): Lesson => ({
  id: `t2d${n}-${i}`,
  kind,
  title,
  goal: '',
  minutes: 30,
});

/** 3 bài mỗi ngày theo bảng 3.2 (tên ngắn); Bài tập + Kiểm tra chặng tự thêm ở `DAYS`. */
const MUC_LUC: Stub[][] = [
  /* 1 */ [['grammar', 'Mạo từ a / an / the / Ø'], ['listening', 'Listening Part 1 — Form completion: đăng ký khoá học'], ['speaking', 'Part 1 ôn Yes/No: Work/Study · Hometown · Home']],
  /* 2 */ [['vocab', 'AWL sublist 1 (phần 1) + Môi trường & ô nhiễm'], ['reading', 'Summary completion — điền từ trong bài'], ['writing', 'Opinion essay trọn bài band 5: thân bài P-E-E']],
  /* 3 */ [['grammar', 'Giới từ thời gian, nơi chốn, chuyển động'], ['listening', 'Nghe số, ngày, giá, địa chỉ: đặt phòng, hỏi đường'], ['speaking', 'Part 2 lần đầu: Describe a person']],
  /* 4 */ [['vocab', 'AWL sublist 1 (phần 2) + Sức khoẻ & ăn uống + tiền tố/hậu tố'], ['reading', 'Note completion'], ['writing', 'Task 1 line graph trọn bài']],
  /* 5 */ [['grammar', 'Hiện tại hoàn thành vs quá khứ đơn'], ['listening', 'Dictation 3 + Table completion'], ['speaking', 'Part 1 Wh- ôn: kéo dài ý, từ đệm']],
  /* 6 */ [['vocab', 'Công nghệ & đổi mới + đoán nghĩa từ ngữ cảnh'], ['reading', 'True / False / Not Given 2 — 5 bẫy cơ bản'], ['writing', 'Discussion essay trọn bài']],
  /* 7 */ [['grammar', 'Tương lai: will / be going to / hiện tại tiếp diễn'], ['listening', 'Listening Part 2 — Map labelling (giọng Mỹ)'], ['speaking', 'Part 2: Describe a place']],
  /* 8 */ [['vocab', 'Giao thông & đời sống đô thị'], ['reading', 'Short-answer questions + paraphrase khi đọc'], ['writing', 'Task 1 bar chart + ngôn ngữ so sánh']],
  /* 9 */ [['grammar', 'So sánh hơn / nhất / bằng'], ['listening', 'Đề nhỏ Part 1+2 (20 câu, đúng giờ)'], ['speaking', 'Paraphrase câu hỏi + 12 chủ đề Part 1']],
  /* 10 */ [['vocab', 'AWL sublist 2 (phần 1) + ngôn ngữ xu hướng'], ['reading', 'Multiple choice một đáp án'], ['writing', 'Advantages / disadvantages essay']],
  /* 11 */ [['grammar', 'Gerund & infinitive'], ['listening', 'Kỹ năng nghe: từ báo hiệu, bẫy "actually, no…"'], ['speaking', 'Part 2: Describe an object']],
  /* 12 */ [['vocab', 'Thực phẩm & nông nghiệp'], ['reading', 'Matching headings'], ['writing', 'Task 1 pie chart']],
  /* 13 */ [['grammar', 'Câu điều kiện loại 0 & 1'], ['listening', 'Listening Part 3 — MCQ, chọn hai, matching'], ['speaking', 'Part 3 nhập môn: ý kiến + lý do + ví dụ']],
  /* 14 */ [['vocab', 'AWL sublist 2 (phần 2) + Du lịch'], ['reading', 'Sentence completion 2 — Passage 2'], ['writing', 'Problem / solution · cause / effect']],
  /* 15 */ [['grammar', 'Mệnh đề quan hệ xác định'], ['listening', 'Part 1+2 giọng Úc'], ['speaking', 'Part 2: Describe an event']],
  /* 16 */ [['vocab', 'Tiền bạc, mua sắm & tiêu dùng'], ['reading', 'Matching information'], ['writing', 'Task 1 table']],
  /* 17 */ [['grammar', 'Từ nối cấp câu & cấp đoạn'], ['listening', 'Nghe họp công việc (dạng Part 3)'], ['speaking', 'Trọng âm câu & nêu ý kiến trong họp']],
  /* 18 */ [['vocab', 'Truyền thông, tin tức & quảng cáo'], ['reading', 'Matching sentence endings'], ['writing', 'Two-part question essay']],
  /* 19 */ [['grammar', 'Câu hỏi Wh- / Yes-No / gián tiếp; question tags'], ['listening', 'Listening Part 4 (giọng Úc)'], ['speaking', 'Part 2: Describe an activity']],
  /* 20 */ [['vocab', 'Thể thao, giải trí'], ['reading', 'Yes / No / Not Given'], ['writing', 'Task 1 process diagram']],
  /* 21 */ [['grammar', 'used to / would; quá khứ tiếp diễn + when / while'], ['listening', 'Đề nhỏ Part 3+4 (20 câu)'], ['speaking', 'Part 3: so sánh quá khứ – hiện tại']],
  /* 22 */ [['vocab', 'Gia đình, quan hệ & thế hệ'], ['reading', 'Diagram label completion'], ['writing', 'Task 1 map']],
  /* 23 */ [['grammar', 'too / enough / so / such + ôn tổng ngữ pháp Tập 2'], ['listening', 'Đề Listening đủ 40 câu'], ['speaking', 'Part 2 đề trừu tượng + giám khảo AI 11 phút']],
  /* 24 */ [['vocab', 'Ôn 18 chủ đề từ vựng + Nhà ở & thành phố'], ['reading', 'Reading đủ 3 passage, 60 phút'], ['writing', '12 lỗi mất điểm oan + email công việc']],
];

/** Ngày có bài kiểm tra chặng (`kind: 'review'`, id `t2dN-kiem-tra`) → các ngày nó gom. */
export const CHANG_T2: Record<number, string> = { 6: 'Ngày 1–6', 12: 'Ngày 7–12', 18: 'Ngày 13–18' };

const khungNgay = (n: number, ba: Stub[]): Lesson[] => [
  ...ba,
  ['homework', `Bài tập Ngày ${n}`] as Stub,
  ...(CHANG_T2[n] ? [['review', `Kiểm tra chặng (${CHANG_T2[n]})`] as Stub] : []),
].map((s, j) => stub(n, j + 1, s));

export const DAYS: Day[] = MUC_LUC.map((ba, i) => ({ n: i + 1, lessons: MANIFEST[i + 1]?.lessons ?? khungNgay(i + 1, ba) }));

export { INTRO };

/** Khoá IELTS Tập 2 — mọi thứ bộ khung dùng chung (components/sach-hoc) cần biết. */
export const IELTS_T2 = defineCourse({
  // ⚠️ Máy chủ chỉ nhận stage có trong `CAC_SACH` (src/services/ielts/ielts.service.ts) — 'sach2' đã thêm 12/11/2026.
  stage: 'sach2',
  storageKey: 'ielts-t2',
  title: 'IELTS 4 kỹ năng · Tập 2',
  backHref: '/language/en/ielts',
  ngonNgu: 'en',
  unit: 'Ngày',
  badgeWord: 'Day',
  intro: INTRO,
  extras: [TRA_CONG_THUC_T2, TRA_TU_VUNG_T2],
  links: [
    { href: '/language/en/ielts', label: '← Tập 1 (mất gốc → 4.0) — ôn lại ngày còn yếu' },
    { href: '/language/en/ielts/thi-may', label: '🖥️ Online Test — thi trên máy tính (Reading · Listening · Writing · Speaking)' },
    { href: '/language/en/ielts/the-tu', label: '🃏 Flashcards (bộ "Từ của khoá — Tập 2")' },
    { href: '/language/en/ielts/so-loi', label: '📒 Sổ lỗi tự động' },
    { href: '/language/en/ielts/luyen-them', label: '📚 Luyện thêm theo chặng (0 → 7.5)' },
  ],
  videos: VIDEO_BAI_T2,
  days: DAYS,
  // Mọi ngày Tập 2 đều tải chậm: mục lục ở ngay/manifest.ts (sinh tự động), nội dung qua loadNgay.
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
  planContext: 'Trang kế hoạch học IELTS Tập 2 (band 4.0 → 5.0): 24 ngày, ngày lẻ ngữ pháp · nghe · nói, ngày chẵn từ vựng · đọc · viết, kiểm tra chặng Ngày 6/12/18, thi cuối tập Đề 3 trên Online Test.',
});
