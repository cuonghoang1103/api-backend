/**
 * Khoá IELTS — TẬP 5 "7.0 → 8.0" (30 ngày; C1 vững). Hạ tầng dựng 18/11/2026.
 *
 * Mục lục 30 ngày theo `docs/ielts-lo-trinh-0-8.md` mục 3.5 (+ "Chỗ dành sẵn" mục 3.6 — nguồn sự thật: dạy cái gì,
 * ở đâu, đến mức nào). Khuôn ngày (như Tập 3–4): **lẻ = grammar · reading · bài 3**, **chẵn = vocab · writing · bài 3**;
 * bài 3 = **listening** khi N mod 4 ∈ {0, 1}, **speaking** khi N mod 4 ∈ {2, 3}; mỗi ngày + 1 `homework`;
 * Ngày 6 / 12 / 18 / 24 / 30 thêm bài `review` (kiểm tra chặng). 4 đề đủ ở `thi-may`: Đề 9 (N8) · Đề 10 (N16) · Đề 11 (N24) · Đề 12 "Final" (N30);
 * ngày sau mỗi đề là ngày MỔ ĐỀ (phân tích từng câu sai).
 *
 * TÁCH HẲN khỏi Tập 1–4 (cùng bộ khung `components/sach-hoc`, khác khoá):
 *   - `stage: 'sach5'`, `storageKey: 'ielts-t5'` — tiến độ máy chủ + localStorage riêng. Đổi là MẤT tiến độ người học.
 *   - id bài / bài tập: `t5dN-…`. `npm run course:manifest` chặn id sai tiền tố.
 *
 * Nội dung từng ngày: `ngay/ngayN.ts` export `NGAY_N` — cách soạn ở `../SOAN-BAI.md` mục "Soạn Tập 5".
 * Ngày chưa soạn hiện khung "sắp có" theo `MUC_LUC` dưới đây; soạn xong thì mục lục lấy từ manifest.
 */

import { loadNgay } from './ngay';
import { MANIFEST } from './ngay/manifest';
import { TRA_CONG_THUC_T5, TRA_TU_VUNG_T5 } from './tracuu';
import { VIDEO_BAI_T5 } from './videos';

import { defineCourse } from '@/components/sach-hoc/course';
import type { Lesson, Day } from '@/components/sach-hoc/types';

// Các tệp ngay/ngayN.ts lấy kiểu từ đây (giống Tập 2–4: `import type { Lesson } from '../data'`).
export type { Ex, Block, Voice, Role, Kind, Lesson, Day } from '@/components/sach-hoc/types';

/* ───────────────────────── Bắt đầu Tập 5 ───────────────────────── */

const INTRO: Lesson = {
  id: 't5-bat-dau',
  kind: 'intro',
  title: 'Bắt đầu Tập 5 (band 7.0 → 8.0)',
  goal: 'Biết Tập 5 đưa bạn từ band 7.0 lên 8.0 bằng cách nào, mỗi ngày học gì và cuối tập phải làm được gì.',
  minutes: 6,
  blocks: [
    {
      t: 'recap',
      title: 'Tập 5 dành cho ai',
      items: [
        'Bạn đã học xong **Tập 4** (hoặc làm đề được khoảng **band 7.0**): làm Passage 3 và Part 4 ổn, viết ý kiến rõ suốt bài, nói dài không gắng sức.',
        'Tập 5 có **30 ngày**, mỗi ngày **3 bài + 1 bài tập**. Ngày **6, 12, 18, 24, 30** có **kiểm tra chặng**. Tập này có **4 đề đủ** ở Online Test: **Đề 9** (Ngày 8), **Đề 10** (Ngày 16), **Đề 11** (Ngày 24), **Đề 12 "Final"** (Ngày 30) — ngày sau mỗi đề là ngày **mổ đề**: phân tích từng câu sai, ghi sổ lỗi.',
        'Đích cuối tập: **band 8.0** — Listening ≥ 35/40, Reading ≥ 35/40 ba đề liên tiếp, Writing 0–1 lỗi mỗi bài với cohesion tự nhiên, Speaking ngắt vì nội dung chứ không vì tìm từ.',
        'Band 7 → 8 không cần thêm nhiều kiến thức mới: nó **ăn ở độ chính xác tuyệt đối và sự tự nhiên** — sạch lỗi nhỏ, từ chính xác, đọc một lần là hiểu, nghe tốc độ thật vẫn không lỡ.',
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
      t: 'note',
      title: 'Cách học Tập 5',
      items: [
        'Làm đề **đúng giờ, một mạch, không tra từ** — kết quả đề là thước đo duy nhất của tập này.',
        'Ngày mổ đề quan trọng hơn ngày làm đề: mỗi câu sai phải tìm ra **vì sao** (paraphrase, bẫy, chính tả, hết giờ) và ghi vào **Sổ lỗi**.',
        'Mỗi bài Viết / Nói có **mẫu band 7 và band 8 đặt cạnh nhau** — soi kỹ chỗ khác nhau; viết lại tới khi còn 0–1 lỗi.',
        'Từ vựng tự vào **Flashcards** (bộ "Từ của khoá — Tập 5"); song song học tiếp **Lộ trình từ vựng theo ngày** trong app (chặng C1–C2).',
      ],
    },
  ],
};

/* ─────────────── Mục lục 30 ngày (docs/ielts-lo-trinh-0-8.md mục 3.5) ─────────────── */

type Stub = [Lesson['kind'], string];

/** Khung "sắp có" cho ngày chưa soạn — id `t5dN-i` chỉ dùng tới khi ngày đó có tệp `ngayN.ts`. */
const stub = (n: number, i: number, [kind, title]: Stub): Lesson => ({
  id: `t5d${n}-${i}`,
  kind,
  title,
  goal: '',
  minutes: 30,
});

/** 3 bài mỗi ngày theo bảng 3.5 (tên ngắn); Bài tập + Kiểm tra chặng tự thêm ở `DAYS`. */
const MUC_LUC: Stub[][] = [
  /* 1 */ [['grammar', 'Ngữ pháp band 8: kiểm soát thì tuyệt đối, hedging, danh hoá'], ['reading', 'Reading band 8: 900 từ trong 15 phút, đọc một lần'], ['listening', 'Part 1 tốc độ thật, giọng trộn']],
  /* 2 */ [['vocab', 'Ôn trọn AWL 570 + Chính phủ & Nghệ thuật vòng 2 + collocation tinh'], ['writing', 'Band 8 trông thế nào — so band 7 và band 8, tự chấm'], ['speaking', 'Band 8 Speaking: ngắt vì nội dung, không vì ngôn ngữ']],
  /* 3 */ [['grammar', 'Lỗi dai dẳng cá nhân: hoà hợp chủ – vị, mạo từ, giới từ'], ['reading', 'TFNG band 8 — câu 40 từ, suy luận'], ['speaking', 'Part 1 band 8: tự nhiên, idiom khéo']],
  /* 4 */ [['vocab', '100 từ tần suất thấp đáng giá band 8 (phần 1)'], ['writing', 'Opinion band 8 — lập luận sâu, ví dụ liên quan'], ['listening', 'Part 2+3 tốc độ thật, 4 người nói']],
  /* 5 */ [['grammar', 'Câu phức nhiều tầng không lỗi: phân từ + quan hệ + danh ngữ'], ['reading', 'Matching headings 4 — bài trừu tượng'], ['listening', 'Part 4 bài giảng chuyên sâu 8 phút']],
  /* 6 */ [['vocab', 'Paraphrase & sắc thái band 8'], ['writing', 'Task 1 mixed charts band 8 + đề lạ (so sánh hai vật, các giai đoạn)'], ['speaking', 'Part 3 band 8: phản biện, nhượng bộ, hedging']],
  /* 7 */ [['grammar', 'Bị động + rút gọn trong Task 1 process + Academic Phrasebank'], ['reading', 'Short answer & sentence completion — Passage 3'], ['speaking', 'Part 2 band 8 — người / nơi với chi tiết cảm quan']],
  /* 8 */ [['vocab', 'Tội phạm, Kinh doanh, Già hoá — vòng 2'], ['writing', 'Writing Đề 9 — Task 1 + Task 2 trong 60 phút'], ['listening', 'Listening Đề 9']],
  /* 9 */ [['grammar', 'Song song, chủ ngữ treo; câu dài vẫn rõ'], ['reading', 'Yes / No / Not Given + Headings band 8'], ['listening', 'Mổ Đề 9: từng câu sai → sổ lỗi']],
  /* 10 */ [['vocab', 'Academic Phrasebank nâng cao'], ['writing', 'Discussion band 8 — đánh giá hai góc & lập trường tinh'], ['speaking', 'Mổ Speaking Đề 9 theo 4 tiêu chí']],
  /* 11 */ [['grammar', 'Ngữ pháp nói band 8 — cấu trúc phức tự nhiên, ellipsis'], ['reading', 'Thể loại khó: triết học / kinh tế học, 900 từ trong 15 phút'], ['speaking', 'Idiom & từ ít gặp dùng khéo']],
  /* 12 */ [['vocab', 'Từ vựng Part 4 học thuật: sinh học, địa chất, tâm lý, kinh tế'], ['writing', 'Task 1 process band 8 — hai giai đoạn + "describe how something works"'], ['listening', 'Part 4 Summary band 8 + Part 3 bẫy']],
  /* 13 */ [['grammar', 'Câu chẻ, đảo ngữ, cohesion, nhượng bộ trong Task 2 — dùng vừa đủ'], ['reading', 'Reading 3 passage, 55 phút'], ['speaking', 'Part 3 trừu tượng cấp cao: triết lý, chính sách']],
  /* 14 */ [['vocab', 'Thể thao, Lịch sử, Tâm lý — vòng 2'], ['writing', 'Task 2 trộn dạng — nhận dạng đề lạ, chọn khung'], ['speaking', 'Part 2 band 8 đề hiếm']],
  /* 15 */ [['grammar', 'Register & giọng văn: trang trọng / trung tính / thân mật'], ['reading', 'Matching features / information band 8'], ['listening', 'Bẫy nghe band 8: số liệu đổi, phủ định kép']],
  /* 16 */ [['vocab', 'Ôn 33 chủ đề (300 từ)'], ['writing', 'Advantages / disadvantages band 8'], ['listening', 'Listening Đề 10']],
  /* 17 */ [['grammar', 'Chuỗi lỗi 7 → 8: mạo từ, số nhiều, giới từ, dấu phẩy'], ['reading', 'Mổ Reading Đề 10 — paraphrase từng câu sai'], ['speaking', 'Part 2 nơi chốn / sự kiện band 8 + Part 3 nối']],
  /* 18 */ [['vocab', 'Idiom & sắc thái vòng cuối'], ['writing', 'Task 1 map band 8 — có mốc tương lai'], ['speaking', 'Đàm phán & phản biện lịch sự; hedging khi giao tiếp']],
  /* 19 */ [['grammar', 'Điều kiện hỗn hợp, giả định (subjunctive), dấu câu vòng 3'], ['reading', 'Reading 3 passage, 55 phút lần 2'], ['listening', 'Đề nhỏ Part 3+4 tốc độ thật']],
  /* 20 */ [['vocab', 'Khoa học, Động vật, Trẻ em — vòng 2'], ['writing', 'Problem / solution band 8'], ['listening', 'Part 4 bài giảng 10 phút, giọng vùng']],
  /* 21 */ [['grammar', '3 cấu trúc hiếm dùng đúng chỗ trong Part 3'], ['reading', 'Chiến thuật band 8: đọc một lần, không quay lại; 55 phút'], ['listening', 'Podcast / tin tức tốc độ thật, giọng vùng']],
  /* 22 */ [['vocab', 'Từ cho đề Task 2 lạ: đạo đức, AI, vũ trụ, di truyền + vấn đề xã hội vòng 2'], ['writing', 'Bài phản biện học thuật 300 từ'], ['speaking', 'Mổ Speaking Đề 10 + paraphrase tinh']],
  /* 23 */ [['grammar', 'Bảng tự soát 6 lượt lần 3 → lỗi 0–1'], ['reading', 'Suy luận band 8 & bẫy cuối'], ['speaking', 'Part 3 phản biện giám khảo khéo']],
  /* 24 */ [['vocab', 'Ôn AWL + 30 chủ đề'], ['writing', 'Writing Đề 11'], ['listening', 'Listening Đề 11']],
  /* 25 */ [['grammar', 'Ôn lỗi từ Đề 11'], ['reading', 'Mổ Reading Đề 11'], ['listening', 'Mổ Listening Đề 11 + 2 phút kiểm']],
  /* 26 */ [['vocab', 'Năng lượng, Ngôn ngữ, Sách — vòng 2'], ['writing', 'Sprint Task 1: 7 dạng × 20 phút'], ['speaking', 'Sprint Part 2: 12 đề hay gặp, 1 phút chuẩn bị']],
  /* 27 */ [['grammar', 'Ôn tổng ngữ pháp 5 tập (bảng 44 điểm)'], ['reading', 'Reading 3 passage, 55 phút lần 3 — mục tiêu 35+'], ['speaking', 'Sprint Part 3: 12 đề']],
  /* 28 */ [['vocab', '100 từ band 8 (phần 2)'], ['writing', 'Two-part band 8 + quản lý thời gian lần cuối'], ['listening', 'Đề Listening 40 câu — mục tiêu 35+']],
  /* 29 */ [['grammar', 'Ngày thi: giấy tờ, thứ tự, tâm lý, phúc khảo; khi lỡ câu / lạc đề'], ['reading', 'Checklist 16 dạng Reading — mỗi dạng một câu'], ['listening', 'Checklist 14 dạng Listening']],
  /* 30 */ [['vocab', 'Tổng kết từ vựng: nhớ sau 7 ngày ≥ 90 %'], ['writing', 'Viết lại bài yếu nhất + tự chấm'], ['speaking', 'Giám khảo AI 14 phút lần cuối']],
];

/** Ngày có bài kiểm tra chặng (`kind: 'review'`, id `t5dN-kiem-tra`) → các ngày nó gom. */
export const CHANG_T5: Record<number, string> = { 6: 'Ngày 1–6', 12: 'Ngày 7–12', 18: 'Ngày 13–18', 24: 'Ngày 19–24', 30: 'Ngày 25–30' };

const khungNgay = (n: number, ba: Stub[]): Lesson[] => [
  ...ba,
  ['homework', `Bài tập Ngày ${n}`] as Stub,
  ...(CHANG_T5[n] ? [['review', `Kiểm tra chặng (${CHANG_T5[n]})`] as Stub] : []),
].map((s, j) => stub(n, j + 1, s));

export const DAYS: Day[] = MUC_LUC.map((ba, i) => ({ n: i + 1, lessons: MANIFEST[i + 1]?.lessons ?? khungNgay(i + 1, ba) }));

export { INTRO };

/** Khoá IELTS Tập 5 — mọi thứ bộ khung dùng chung (components/sach-hoc) cần biết. */
export const IELTS_T5 = defineCourse({
  // ⚠️ Máy chủ chỉ nhận stage có trong `CAC_SACH` (src/services/ielts/ielts.service.ts) — 'sach5' thêm 24/11/2026.
  stage: 'sach5',
  storageKey: 'ielts-t5',
  title: 'IELTS 4 kỹ năng · Tập 5',
  backHref: '/language/en/ielts',
  ngonNgu: 'en',
  unit: 'Ngày',
  badgeWord: 'Day',
  intro: INTRO,
  extras: [TRA_CONG_THUC_T5, TRA_TU_VUNG_T5],
  links: [
    { href: '/language/en/ielts/tap-4', label: '← Tập 4 (6.0 → 7.0) — ôn lại ngày còn yếu' },
    { href: '/language/en/ielts/tap-3', label: '← Tập 3 (5.0 → 6.0)' },
    { href: '/language/en/ielts/tap-2', label: '← Tập 2 (4.0 → 5.0)' },
    { href: '/language/en/ielts', label: '← Tập 1 (mất gốc → 4.0)' },
    { href: '/language/en/ielts/thi-may', label: '🖥️ Online Test — thi trên máy tính (Reading · Listening · Writing · Speaking)' },
    { href: '/language/en/ielts/the-tu', label: '🃏 Flashcards (bộ "Từ của khoá — Tập 5")' },
    { href: '/language/en/ielts/so-loi', label: '📒 Sổ lỗi tự động' },
    { href: '/language/en/nhan-xet-tuan', label: '📊 Nhận xét tuần của CuongMini — số liệu, điểm yếu, kế hoạch tuần sau' },
    { href: '/language/en/ielts/luyen-them', label: '📚 Luyện thêm theo chặng (0 → 7.5)' },
  ],
  videos: VIDEO_BAI_T5,
  days: DAYS,
  // Mọi ngày Tập 5 đều tải chậm: mục lục ở ngay/manifest.ts (sinh tự động), nội dung qua loadNgay.
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
  planContext: 'Trang kế hoạch học IELTS Tập 5 (band 7.0 → 8.0): 30 ngày, ngày lẻ ngữ pháp · đọc, ngày chẵn từ vựng · viết, bài 3 luân phiên nghe / nói; kiểm tra chặng Ngày 6/12/18/24/30; 4 đề đủ trên Online Test — Đề 9 (Ngày 8), Đề 10 (Ngày 16), Đề 11 (Ngày 24), Đề 12 Final (Ngày 30) — ngày sau mỗi đề là ngày mổ đề.',
});
