/**
 * Khoá IELTS — TẬP 4 "6.0 → 7.0" (30 ngày; CEFR B2 → C1). Hạ tầng dựng 18/11/2026.
 *
 * Mục lục 30 ngày theo `docs/ielts-lo-trinh-0-8.md` mục 3.4 (+ "Chỗ dành sẵn" mục 3.6 — nguồn sự thật: dạy cái gì,
 * ở đâu, đến mức nào). Khuôn ngày (như Tập 3): **lẻ = grammar · reading · bài 3**, **chẵn = vocab · writing · bài 3**;
 * bài 3 = **listening** khi N mod 4 ∈ {0, 1}, **speaking** khi N mod 4 ∈ {2, 3}; mỗi ngày + 1 `homework`;
 * Ngày 6 / 12 / 18 / 24 / 30 thêm bài `review` (kiểm tra chặng). Đề 6 (đầu tập — đã có), Đề 7 (giữa tập, N15) và
 * Đề 8 (thi cuối tập, N30) nằm ở `thi-may`, không nhét vào ngày.
 *
 * TÁCH HẲN khỏi Tập 1–3 (cùng bộ khung `components/sach-hoc`, khác khoá):
 *   - `stage: 'sach4'`, `storageKey: 'ielts-t4'` — tiến độ máy chủ + localStorage riêng. Đổi là MẤT tiến độ người học.
 *   - id bài / bài tập: `t4dN-…`. `npm run course:manifest` chặn id sai tiền tố.
 *
 * Nội dung từng ngày: `ngay/ngayN.ts` export `NGAY_N` — cách soạn ở `../SOAN-BAI.md` mục "Soạn Tập 4".
 * Ngày chưa soạn hiện khung "sắp có" theo `MUC_LUC` dưới đây; soạn xong thì mục lục lấy từ manifest.
 */

import { loadNgay } from './ngay';
import { MANIFEST } from './ngay/manifest';
import { TRA_CONG_THUC_T4, TRA_TU_VUNG_T4 } from './tracuu';
import { VIDEO_BAI_T4 } from './videos';

import { defineCourse } from '@/components/sach-hoc/course';
import type { Lesson, Day } from '@/components/sach-hoc/types';

// Các tệp ngay/ngayN.ts lấy kiểu từ đây (giống Tập 2–3: `import type { Lesson } from '../data'`).
export type { Ex, Block, Voice, Role, Kind, Lesson, Day } from '@/components/sach-hoc/types';

/* ───────────────────────── Bắt đầu Tập 4 ───────────────────────── */

const INTRO: Lesson = {
  id: 't4-bat-dau',
  kind: 'intro',
  title: 'Bắt đầu Tập 4 (band 6.0 → 7.0)',
  goal: 'Biết Tập 4 đưa bạn từ band 6.0 lên 7.0 bằng cách nào, mỗi ngày học gì và cuối tập phải làm được gì.',
  minutes: 6,
  blocks: [
    {
      t: 'recap',
      title: 'Tập 4 dành cho ai',
      items: [
        'Bạn đã học xong **Tập 3** (hoặc làm bài đầu vào được khoảng **band 6.0**): làm đủ 3 passage trong 60 phút, viết đủ mọi phần đề với ý kiến rõ, nói Part 3 có mức độ.',
        'Tập 4 có **30 ngày**, mỗi ngày **3 bài + 1 bài tập** (~2 giờ). Ngày **6, 12, 18, 24, 30** có **bài kiểm tra chặng**. Đầu tập làm **Đề 6** để đo điểm xuất phát, giữa tập **Đề 7** (sau Ngày 15), cuối tập **Đề 8** đủ 4 kỹ năng ở Online Test.',
        'Đích cuối tập: **band 7.0** — Listening ≥ 30/40 (Part 3 + 4 ≥ 14/20), Reading ≥ 30/40 (Passage 3 ≥ 9/13), Writing ý kiến rõ suốt bài và đa số câu không lỗi, Speaking nói dài không gắng sức với từ ít gặp.',
        'Band 6 → 7 **ăn ở độ chính xác**: lỗi nhỏ (mạo từ, số nhiều, collocation), ý mở rộng và chống đỡ được, Passage 3 và Part 4. Tập 4 soi từng loại lỗi nhỏ đó.',
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
      text: 'Giống Tập 3: **Đọc và Viết có mặt ngày nào cũng có** (đọc ngày lẻ, viết ngày chẵn); Nghe và Nói luân phiên theo cặp ngày — Ngày 1, 4, 5, 8, 9… là **Nghe**; Ngày 2, 3, 6, 7, 10… là **Nói**. Mức độ khó hơn hẳn: passage học thuật dài, bài giảng 6–10 phút, đề Writing có ý trừu tượng.',
    },
    {
      t: 'note',
      title: 'Cách học Tập 4',
      items: [
        'Học **đúng thứ tự** — mỗi điểm của Tập 2–3 được ôn lại ở mức band 7 (ghi rõ "ôn từ Tập 3 Ngày N"); quên thì mở lại Tập 3 bằng nút ở trang Kế hoạch.',
        'Mỗi bài Viết / Nói có **mẫu band 6 và band 7 đặt cạnh nhau** — soi kỹ chỗ khác nhau, rồi viết lại theo sổ lỗi tới khi còn ≤ 3 lỗi / bài.',
        'Từ vựng của mọi ngày tự vào **Flashcards** (bộ "Từ của khoá — Tập 4") — ôn mỗi ngày 10–15 phút.',
        'Câu sai trong Online Test tự vào **Sổ lỗi** — xem lại trước mỗi bài kiểm tra chặng.',
      ],
    },
  ],
};

/* ─────────────── Mục lục 30 ngày (docs/ielts-lo-trinh-0-8.md mục 3.4) ─────────────── */

type Stub = [Lesson['kind'], string];

/** Khung "sắp có" cho ngày chưa soạn — id `t4dN-i` chỉ dùng tới khi ngày đó có tệp `ngayN.ts`. */
const stub = (n: number, i: number, [kind, title]: Stub): Lesson => ({
  id: `t4d${n}-${i}`,
  kind,
  title,
  goal: '',
  minutes: 30,
});

/** 3 bài mỗi ngày theo bảng 3.4 (tên ngắn); Bài tập + Kiểm tra chặng tự thêm ở `DAYS`. */
const MUC_LUC: Stub[][] = [
  /* 1 */ [['grammar', 'Cụm danh từ phức; mạo từ & danh từ không đếm — lỗi số 1 ở band 6.5'], ['reading', 'Passage 3 nhập — văn bản nhân văn / khoa học xã hội, 900 từ trong 17 phút'], ['listening', 'Part 1 "quá dễ để sai": chính tả, số nhiều, 10/10']],
  /* 2 */ [['vocab', 'AWL sublist 7 + Môi trường vòng 2'], ['writing', 'Band 7 trông thế nào — so hai bài band 6 và band 7'], ['speaking', 'Part 1 band 7: chi tiết + từ ít gặp']],
  /* 3 */ [['grammar', 'Thì trong văn học thuật: hiện tại hoàn thành cho xu hướng, quá khứ hoàn thành khi tường thuật'], ['reading', 'Matching headings 3 + paraphrase ẩn ý'], ['speaking', 'Part 3 band 7: quá khứ – hiện tại – tương lai, discourse markers']],
  /* 4 */ [['vocab', 'Tâm lý, hạnh phúc & hành vi'], ['writing', 'Opinion band 7 — ý mở rộng 3 tầng, ví dụ cụ thể'], ['listening', 'Part 2 MCQ dài, phương án paraphrase']],
  /* 5 */ [['grammar', 'Participle clauses; bị động + rút gọn mệnh đề trong câu học thuật'], ['reading', 'TFNG / YNNG bẫy band 7: đúng một nửa, so sánh ngầm, số đổi'], ['listening', 'Part 3 — 4 người nói, Matching ý kiến']],
  /* 6 */ [['vocab', 'Collocation học thuật động từ + danh từ'], ['writing', 'Task 1 line graph 3 — nhiều đường, nhóm xu hướng'], ['speaking', 'Part 2 band 7: người / nơi có câu chuyện nhỏ']],
  /* 7 */ [['grammar', 'Câu chẻ (cleft) + đảo ngữ'], ['reading', 'Multiple choice Passage 3 (một & nhiều đáp án)'], ['speaking', 'Part 3 dự đoán tương lai có hedging']],
  /* 8 */ [['vocab', 'AWL sublist 8 + Y tế vòng 2 + Gia đình & tính cách vòng 2'], ['writing', 'Task 1 bar chart 3 — stacked / grouped'], ['listening', 'Part 4 bài giảng 6 phút — Note + Sentence']],
  /* 9 */ [['grammar', 'Ngôn ngữ so sánh & dự báo Task 1 band 7'], ['reading', 'Suy luận & giọng điệu tác giả + văn bản nghệ thuật'], ['listening', 'Đề nhỏ Part 1+2, 20 câu']],
  /* 10 */ [['vocab', 'Nghệ thuật, âm nhạc & sáng tạo + sắc thái từ đồng nghĩa'], ['writing', 'Discussion band 7 — thesis + hai góc + đánh giá'], ['speaking', 'Part 2: đồ vật / hoạt động band 7 — từ ít gặp, idiom tự nhiên']],
  /* 11 */ [['grammar', 'Mệnh đề danh ngữ & verb pattern trong câu phức dài không lỗi'], ['reading', 'Note completion 2 — Passage 3'], ['speaking', 'Part 3 "To what extent…" có mức độ + chống đỡ']],
  /* 12 */ [['vocab', 'Ngôn ngữ Task 1 band 7: nhóm số liệu, ngoại lệ, tỉ lệ'], ['writing', 'Cohesion band 7 — referencing, không lạm dụng từ nối; viết lại đoạn'], ['listening', 'Part 3 Flow-chart + bẫy đổi ý, paraphrase nặng']],
  /* 13 */ [['grammar', 'Hedging & bị động khách quan; cohesion nâng cao (referencing, substitution, ellipsis)'], ['reading', 'Reading đủ 3 passage, 60 phút lần 1'], ['listening', 'Part 4 Table + Summary']],
  /* 14 */ [['vocab', 'AWL sublist 9 + Tình nguyện vòng 2 + Tiền bạc vòng 2'], ['writing', 'Advantages / disadvantages band 7 — đánh giá "outweigh" rõ'], ['speaking', 'Part 2 sự kiện band 7 + Part 3 nối tiếp']],
  /* 15 */ [['grammar', 'Từ nối band 7 — đúng liều; nguyên nhân – kết quả tinh'], ['reading', 'Matching sentence endings 2 + paraphrase nâng cao'], ['speaking', 'Part 3 nguyên nhân – hệ quả, lập luận chuỗi']],
  /* 16 */ [['vocab', 'Già hoá, dân số & di cư + Vấn đề xã hội & bình đẳng'], ['writing', 'Task 1 table 3 — so sánh chéo nhiều chiều'], ['listening', 'Part 2 Map phức — nhiều tầng, phương hướng']],
  /* 17 */ [['grammar', 'Tường thuật học thuật (According to X, it is argued that…) + causative'], ['reading', 'Flow-chart / Diagram — Passage 3 kỹ thuật'], ['listening', 'Đề nhỏ Part 3+4, 20 câu']],
  /* 18 */ [['vocab', 'Idiom & register — lúc nào dùng khi Nói, không dùng khi Viết'], ['writing', 'Task 1 pie chart 3 — nhiều pie, so sánh chéo'], ['speaking', 'Part 3 band 7: ví dụ cá nhân vs xã hội; paraphrase nâng cao']],
  /* 19 */ [['grammar', 'Câu điều kiện hỗn hợp; provided that / as long as'], ['reading', 'Matching information 3 — Passage 3'], ['speaking', 'Part 3 giả định & phản thực tế']],
  /* 20 */ [['vocab', 'AWL sublist 10 + Công nghệ vòng 2'], ['writing', 'Kịch bản thuyết trình 3 phút + tóm tắt'], ['listening', 'Part 4 bài giảng 8 phút — ghi chú kiểu Cornell']],
  /* 21 */ [['grammar', 'Danh hoá mức 2; register; dấu câu; tự soát 6 lượt lần 2; Academic Phrasebank'], ['reading', 'Reading 3 passage, 60 phút lần 2 + văn bản kinh tế'], ['listening', 'Giọng vùng (Ireland…) Part 1+2']],
  /* 22 */ [['vocab', 'Trẻ em, nuôi dạy con & vai trò giới'], ['writing', 'Problem / solution band 7 — đánh giá tính khả thi'], ['speaking', 'Thuyết trình 3 phút + hỏi đáp']],
  /* 23 */ [['grammar', 'Ngữ pháp nói band 7: câu phức khi nói, ellipsis, tags'], ['reading', 'Matching features 3'], ['speaking', 'Part 3 trừu tượng: giá trị, đạo đức, công nghệ & xã hội']],
  /* 24 */ [['vocab', 'Collocation Task 1 & 2 nâng cao (tính từ + danh từ, trạng từ + tính từ)'], ['writing', 'Task 1 table + mixed 3 nguồn; tóm tắt bài giảng'], ['listening', 'Bài giảng 10 phút + Matching']],
  /* 25 */ [['grammar', 'Đọc hiểu câu phức Passage 3: chuỗi thì & bị động'], ['reading', 'Summary 3 — Passage 3 (hộp từ & từ trong bài)'], ['listening', 'Đề Listening 40 câu lần 1 — mục tiêu 30+']],
  /* 26 */ [['vocab', 'Thực phẩm vòng 2 (an toàn – công nghiệp) + Truyền thông vòng 2'], ['writing', 'Cover letter + email formal nâng cao'], ['speaking', 'Part 2 band 7 đề trừu tượng (a law, a piece of advice)']],
  /* 27 */ [['grammar', 'Subjunctive & cấu trúc trang trọng; fronting'], ['reading', 'Reading 3 passage, 60 phút lần 3 — Passage 3 ≥ 9/13'], ['speaking', 'Full 14 phút tự thu, tự chấm 4 tiêu chí']],
  /* 28 */ [['vocab', 'Ôn AWL 7–10 + 12 chủ đề vòng 2'], ['writing', 'Two-part band 7 + quản lý 60 phút + 12 lỗi ở band 7'], ['listening', 'Đề nhỏ Part 3+4 + bẫy']],
  /* 29 */ [['grammar', 'Ôn tổng ngữ pháp Tập 4 (bảng 20 điểm C1)'], ['reading', 'Chiến thuật band 7: thứ tự passage theo độ khó cá nhân'], ['listening', 'Đề Listening 40 câu lần 2']],
  /* 30 */ [['vocab', 'Ôn 30 chủ đề Part 1 + idiom'], ['writing', 'Viết lại 3 bài theo sổ lỗi — ≤ 3 lỗi / bài'], ['speaking', 'Giám khảo AI 14 phút']],
];

/** Ngày có bài kiểm tra chặng (`kind: 'review'`, id `t4dN-kiem-tra`) → các ngày nó gom. */
export const CHANG_T4: Record<number, string> = { 6: 'Ngày 1–6', 12: 'Ngày 7–12', 18: 'Ngày 13–18', 24: 'Ngày 19–24', 30: 'Ngày 25–30' };

const khungNgay = (n: number, ba: Stub[]): Lesson[] => [
  ...ba,
  ['homework', `Bài tập Ngày ${n}`] as Stub,
  ...(CHANG_T4[n] ? [['review', `Kiểm tra chặng (${CHANG_T4[n]})`] as Stub] : []),
].map((s, j) => stub(n, j + 1, s));

export const DAYS: Day[] = MUC_LUC.map((ba, i) => ({ n: i + 1, lessons: MANIFEST[i + 1]?.lessons ?? khungNgay(i + 1, ba) }));

export { INTRO };

/** Khoá IELTS Tập 4 — mọi thứ bộ khung dùng chung (components/sach-hoc) cần biết. */
export const IELTS_T4 = defineCourse({
  // ⚠️ Máy chủ chỉ nhận stage có trong `CAC_SACH` (src/services/ielts/ielts.service.ts) — 'sach4' thêm 18/11/2026.
  stage: 'sach4',
  storageKey: 'ielts-t4',
  title: 'IELTS 4 kỹ năng · Tập 4',
  backHref: '/language/en/ielts',
  ngonNgu: 'en',
  unit: 'Ngày',
  badgeWord: 'Day',
  intro: INTRO,
  extras: [TRA_CONG_THUC_T4, TRA_TU_VUNG_T4],
  links: [
    { href: '/language/en/ielts/tap-3', label: '← Tập 3 (5.0 → 6.0) — ôn lại ngày còn yếu' },
    { href: '/language/en/ielts/tap-2', label: '← Tập 2 (4.0 → 5.0)' },
    { href: '/language/en/ielts', label: '← Tập 1 (mất gốc → 4.0)' },
    { href: '/language/en/ielts/thi-may', label: '🖥️ Online Test — thi trên máy tính (Reading · Listening · Writing · Speaking)' },
    { href: '/language/en/ielts/the-tu', label: '🃏 Flashcards (bộ "Từ của khoá — Tập 4")' },
    { href: '/language/en/ielts/so-loi', label: '📒 Sổ lỗi tự động' },
    { href: '/language/en/ielts/luyen-them', label: '📚 Luyện thêm theo chặng (0 → 7.5)' },
  ],
  videos: VIDEO_BAI_T4,
  days: DAYS,
  // Mọi ngày Tập 4 đều tải chậm: mục lục ở ngay/manifest.ts (sinh tự động), nội dung qua loadNgay.
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
  planContext: 'Trang kế hoạch học IELTS Tập 4 (band 6.0 → 7.0): 30 ngày, ngày lẻ ngữ pháp · đọc, ngày chẵn từ vựng · viết, bài 3 luân phiên nghe / nói; kiểm tra chặng Ngày 6/12/18/24/30; Đề 6 đầu tập, Đề 7 giữa tập (Ngày 15), thi cuối tập Đề 8 trên Online Test.',
});
