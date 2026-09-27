/**
 * Khoá tiếng Nhật theo giáo trình できる日本語 初級 (Dekiru Nihongo) — môn
 * JPD113/JPD123 của trường. Người học bắt đầu từ con số 0 (mới biết nửa bảng
 * hiragana), nên có "Bài 0" dạy trọn kana trước Bài 1.
 *
 * Như khoá IELTS: sách có bản quyền và trang này công khai → giữ ĐỦ kiến thức
 * (mọi ポイント ngữ pháp, mọi từ trong danh sách từ mới của cô, mọi mẫu câu hỏi–
 * đáp), còn lời giảng / câu ví dụ / hội thoại / bài nghe VIẾT MỚI; không đưa
 * ảnh scan của sách lên. Quy tắc đầy đủ: SOAN-BAI.md.
 */
import { defineCourse } from '@/components/sach-hoc/course';
import type { Day, Lesson } from '@/components/sach-hoc/types';
import { WRITTEN } from './bai';

export type { Ex, Block, Voice, Role, Kind, Lesson, Day } from '@/components/sach-hoc/types';

const INTRO: Lesson = {
  id: 'bat-dau',
  kind: 'intro',
  title: 'Bắt đầu tại đây',
  goal: 'Biết khoá học gồm những gì, thi JPD thế nào, và học mỗi ngày ra sao để theo kịp lớp.',
  minutes: 5,
  blocks: [
    { t: 'h', text: 'Khoá này dạy gì?' },
    {
      t: 'p',
      text: 'Khoá đi theo đúng giáo trình **できる日本語 初級** (Dekiru Nihongo – Sơ cấp) mà lớp đang học, từ **Bài 0** (bảng chữ hiragana, katakana) đến **Bài 6**. Mỗi bài có: **hội thoại** theo tình huống, **từ vựng** (đúng danh sách từ mới cô phát), **ngữ pháp** đóng khung kèm mẫu câu hỏi–đáp, **chữ Hán**, **luyện nghe**, **luyện nói** theo dạng thi, và **bài tập có đáp án**.',
    },
    {
      t: 'note',
      title: 'Cách học để nói được',
      items: [
        'Học từ vựng của bài TRƯỚC, rồi mới học ngữ pháp — mỗi mẫu câu đều dùng lại đúng từ của bài.',
        'Mỗi câu mẫu: bấm 🔊 nghe → đọc to theo 3 lần → tắt furigana/romaji và tự đọc lại.',
        'Làm phần **Ghép câu** và **Hỏi–đáp** cho tới khi trả lời được không cần nhìn.',
        'Không hiểu chỗ nào thì hỏi **gia sư** ở khung bên phải — bôi đen đúng câu đó rồi hỏi.',
      ],
    },
    { t: 'h', text: 'Thi nói JPD113 gồm gì?' },
    {
      t: 'table',
      head: ['Phần', 'Điểm', 'Bạn phải làm gì'],
      rows: [
        ['Reading (đọc)', '40/100', 'Chuẩn bị 30 giây, rồi đọc to một câu hoặc đoạn văn giám thị chọn.'],
        ['Talking (trả lời)', '55/100', 'Trả lời 3 câu hỏi có tranh + 1 câu hỏi không có tranh.'],
        ['Presenting (tác phong)', '5/100', 'Chào hỏi, thái độ, ngồi đúng tư thế.'],
      ],
    },
  ],
};

type Stub = [Lesson['kind'], string];
const stub = (n: number, i: number, [kind, title]: Stub): Lesson => ({ id: `b${n}-${i}`, kind, title, goal: '', minutes: 30 });

/** Khung theo mục lục sách — bài nào chưa soạn thì hiện "sắp có". */
const OUTLINE: { n: number; title: string }[] = [
  { n: 0, title: 'Bảng chữ cái: hiragana & katakana' },
  { n: 1, title: 'はじめまして — Rất vui được gặp' },
  { n: 2, title: '買い物・食事 — Mua sắm, ăn uống' },
  { n: 3, title: 'スケジュール — Lịch trình' },
  { n: 4, title: '私の国・町 — Đất nước, thành phố của tôi' },
  { n: 5, title: '休みの日 — Ngày nghỉ' },
  { n: 6, title: '一緒に！ — Cùng nhau nhé!' },
];

export const DAYS: Day[] = OUTLINE.map(({ n, title }) => ({
  // Bài 0 hiện là "Bài 0" nhưng lịch học vẫn đánh số từ 1 — n ở đây là số thứ tự buổi.
  n: n + 1,
  lessons: WRITTEN[n] ?? [stub(n, 1, [n === 0 ? 'kana' : 'conversation', title])],
}));

export const DEKIRU = defineCourse({
  stage: 'dekiru1',
  storageKey: 'dekiru-v1',
  title: 'Tiếng Nhật できる日本語 · Bài 0–6',
  backHref: '/language/ja',
  unit: 'Bài',
  shownNum: (n) => n - 1,
  badgeWord: 'Bài',
  intro: INTRO,
  days: DAYS,
  // `review` dùng cho mục 📖 Theo sách: đi theo từng trang sách, câu cô hay hỏi + cách trả lời.
  kindLabel: { review: 'Theo sách' },
  kindEn: {
    intro: 'はじめに', kana: 'ひらがな・カタカナ', conversation: '会話 · Hội thoại', vocab: 'ことば · Từ vựng',
    grammar: '文法 · Ngữ pháp', kanji: '漢字 · Chữ Hán', listening: '聞く · Nghe', speaking: '話す · Nói',
    reading: '読む · Đọc', homework: '練習 · Bài tập', review: '教科書 · Theo sách',
  },
  kindHue: {},
  voice: 'ja-nu',
  tutor: { name: 'Gia sư tiếng Nhật', mon: 'nhat' },
  planContext: 'Trang kế hoạch học tiếng Nhật theo giáo trình できる日本語 初級, Bài 0–6 (môn JPD113/JPD123).',
});
