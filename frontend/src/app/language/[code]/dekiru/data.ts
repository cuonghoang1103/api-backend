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
import { loadBai } from './bai';
import { MANIFEST } from './bai/manifest';
import { DE_LUYEN_67 } from './bai/deLuyen67';
import { ON_CUOI_KY } from './bai/onCuoiKy';
import { ON_113 } from './bai/jp113B3';
import { VIDEO_NEO } from './videos';
import { nhomMucDekiru } from './nhom';
import { videoLoTrinh } from './videoLoTrinh';

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
      text: 'Khoá đi theo đúng giáo trình **できる日本語 初級** (Dekiru Nihongo – Sơ cấp) mà lớp đang học, từ **Bài 0** (bảng chữ hiragana, katakana) đến **Bài 15** — trọn cuốn sách (124 điểm ngữ pháp). Mỗi bài có: **hội thoại** theo tình huống, **từ vựng** (đúng danh sách từ mới cô phát), **ngữ pháp** đóng khung kèm mẫu câu hỏi–đáp, **chữ Hán**, **luyện nghe**, **luyện nói** theo dạng thi, và **bài tập có đáp án**.',
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
    {
      t: 'note',
      title: 'Mẹo: chạm vào chữ Hán + mục tra cứu chia động từ',
      items: [
        '**Chạm vào một chữ Hán bất kỳ** trong bài (bảng chữ Hán, câu đọc, chữ có furigana) để mở thẻ chữ đó: **hoạt hình thứ tự nét**, Hán Việt, On/Kun, cách nhớ, **các từ đi chung** (kể cả từ ghép với chữ đã học ở bài trước), câu ví dụ và ô tập viết.',
        'Mỗi bài có mục **"Chữ Hán của lớp"** ngay sau phần chữ Hán cũ: Bài 5 đúng 12 chữ trên slide của cô; các bài khác là danh sách dự kiến, sẽ khớp slide khi có ảnh.',
        'Mục **"Chia động từ & tính từ"** (ở mục lục, ngay dưới Mở đầu): nhận biết nhóm I/II/III, bảng đổi đuôi mọi thể trong sách, mỗi thể dùng trong mẫu câu nào, ô tra nhanh và bài luyện chia.',
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

/** Mục tra cứu đứng ngoài các bài — hiện dưới "Mở đầu" ở mục lục (`?bai=chia-dong-tu`). */
const CHIA: Lesson = {
  id: 'chia-dong-tu',
  kind: 'grammar',
  title: 'Chia động từ & tính từ — tổng hợp Bài 3–15',
  goal: 'Nhận ra nhóm của mọi động từ, chia đúng mọi thể trong sách (ます, て, た, ない, từ điển, thể thường) và tính từ い/な — và biết mỗi thể dùng trong mẫu câu nào, ở bài mấy.',
  minutes: 40,
  blocks: [{ t: 'chia' }],
};

/** Ôn tập bằng thẻ — dữ liệu sinh từ chính các bài (`npm run dekiru:onthe`), `?bai=on-tap-the`. */
const ON_THE: Lesson = {
  id: 'on-tap-the',
  kind: 'homework',
  title: 'Ôn tập bằng thẻ — từ vựng, chữ Hán, ngữ pháp (8 cách ôn)',
  goal: 'Ôn lại toàn bộ từ vựng, chữ Hán của lớp và mẫu ngữ pháp của bất kỳ bài nào bằng 8 cách: thẻ lật, học, trắc nghiệm, gõ, nghe, ghép cặp, kiểm tra 20 câu và ôn lại từ sai theo hộp.',
  minutes: 20,
  blocks: [
    { t: 'p', text: 'Chọn **bài** (mặc định Bài 4 + 5), **loại thẻ** và **chiều** hỏi, rồi chọn một trong 8 cách ôn. Thẻ bạn sai ở bất kỳ cách nào sẽ tự vào mục **🔁 Ôn từ sai** — ôn lại theo hộp (đúng thì lên hộp, giãn ngày; sai thì về hộp 1). Tiến độ lưu trên máy này.' },
    { t: 'onthe' },
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
  { n: 7, title: '友達の家で — Ở nhà bạn' },
  { n: 8, title: '大切な人 — Người quan trọng' },
  { n: 9, title: '好きなこと — Điều mình thích' },
  { n: 10, title: 'バスツアー — Tour xe buýt' },
  { n: 11, title: '私の生活 — Cuộc sống của tôi' },
  { n: 12, title: '病気・けが — Ốm đau, chấn thương' },
  { n: 13, title: '私のおすすめ — Gợi ý của tôi' },
  { n: 14, title: '国の習慣 — Phong tục nước tôi' },
  { n: 15, title: 'テレビ・雑誌から — Từ TV, tạp chí' },
  // ─── TIẾP SAU SÁCH (09/11/2026) — cùng khuôn lớp, tự soạn, tới N2. Xem SOAN-BAI.md mục 8. ───
  // N4 (phần sách 初級 chưa dạy) — kiểm tra chặng ở Bài 20, thi thử N4 ở Bài 25.
  { n: 16, title: 'アルバイト — Làm thêm · N4: thể khả năng, thể ý chí, 〜つもり' },
  { n: 17, title: '旅行の計画 — Kế hoạch du lịch · N4: 〜ば, 〜なら, 〜し, 〜すぎる, 〜やすい・にくい' },
  { n: 18, title: '引っ越し — Chuyển nhà · N4: 〜てあげる・もらう・くれる, 〜ておく, 〜てある' },
  { n: 19, title: '失敗 — Sự cố · N4: 〜てしまう, 〜てみる, 〜ところ, 〜のに' },
  { n: 20, title: 'うわさ — Tin đồn · N4: 〜そう, 〜ようだ・みたい・らしい, 〜かもしれない, 〜はず' },
  { n: 21, title: '目標 — Mục tiêu · N4: 〜ために, 〜ように, 〜ようになる・する, 〜ことにする・なる' },
  { n: 22, title: '困ったこと — Chuyện phiền · N4: thể bị động, 〜ばかり' },
  { n: 23, title: '子どもの頃 — Thời thơ ấu · N4: thể sai khiến, mệnh lệnh, 〜ように言う' },
  { n: 24, title: '会社訪問 — Thăm công ty · N4: kính ngữ, khiêm nhường ngữ, 〜かどうか' },
  { n: 25, title: 'N4 総復習 — Ôn tập & thi thử N4' },
  // N3 — kiểm tra chặng ở Bài 30, 35; thi thử N3 ở Bài 40.
  { n: 26, title: '留学生活 — Đời du học · N3: 〜うちに, 〜間に, 〜最中に, 〜たとたん' },
  { n: 27, title: 'ニュース — Tin tức · N3: 〜せいで, 〜おかげで, 〜によって, 〜ため' },
  { n: 28, title: '意見を言う — Nêu ý kiến · N3: 〜くせに, 〜ものの, 〜にもかかわらず, 〜に対して' },
  { n: 29, title: '健康 — Sức khoẻ · N3: 〜ほど, 〜くらい, 〜ば〜ほど, 〜さえ〜ば, 〜うえに' },
  { n: 30, title: '伝言 — Nhắn lại · N3: 〜って, 〜とのことだ, 〜ということだ, 〜にとって' },
  { n: 31, title: '推理 — Suy luận · N3: 〜に違いない, 〜はずがない, 〜わけだ・わけではない' },
  { n: 32, title: '昔と今 — Xưa và nay · N3: 〜ものだ, 〜ことだ, 〜につれて, 〜一方だ' },
  { n: 33, title: '調査 — Khảo sát · N3: 〜によると, 〜に基づいて, 〜をもとに, 〜とともに' },
  { n: 34, title: '習慣 — Thói quen · N3: 〜がちだ, 〜気味, 〜っぱなし, 〜としたら' },
  { n: 35, title: 'インターン — Thực tập · N3: 〜させられる, 〜させていただく, 〜ばよかった' },
  { n: 36, title: '文化の違い — Khác biệt văn hoá · N3: 〜というのは, 〜とは, 〜やら, 〜にしても' },
  { n: 37, title: '職場の日本語 — Tiếng Nhật công sở · N3: kính ngữ đầy đủ, email, điện thoại' },
  { n: 38, title: '読解 N3 — Đọc hiểu: báo, thông báo, email; chiến thuật làm đề' },
  { n: 39, title: '聴解 N3 — Nghe hiểu: nghe ý chính, nghe chi tiết; chiến thuật làm đề' },
  { n: 40, title: 'N3 総復習 — Ôn tập & thi thử N3' },
  // N2 — kiểm tra chặng ở Bài 45, 50; thi thử N2 ở Bài 55.
  { n: 41, title: '就職活動 — Tìm việc · N2: 〜際に, 〜に際して, 〜にあたって, 〜をきっかけに' },
  { n: 42, title: '社会問題 — Vấn đề xã hội · N2: 〜に限らず, 〜をはじめ, 〜を問わず, 〜にかかわらず' },
  { n: 43, title: '評価 — Đánh giá · N2: 〜からすると, 〜にしては, 〜わりに, 〜はともかく' },
  { n: 44, title: '結果 — Kết cục · N2: 〜あげく, 〜末に, 〜きり, 〜次第' },
  { n: 45, title: '義務と感情 — Bổn phận & cảm xúc · N2: 〜ざるを得ない, 〜ずにはいられない, 〜てたまらない' },
  { n: 46, title: 'リスク — Rủi ro · N2: 〜得る, 〜かねない, 〜かねる, 〜おそれがある' },
  { n: 47, title: '決意 — Quyết tâm · N2: 〜しかない, 〜ほかない, 〜からには, 〜以上は' },
  { n: 48, title: '原因と結果 — Nhân quả · N2: 〜ばかりに, 〜ことから, 〜だけに, 〜ものだから' },
  { n: 49, title: '変化 — Biến đổi · N2: 〜一方で, 〜に伴って, 〜かと思うと, 〜や否や' },
  { n: 50, title: '比較 — So sánh · N2: 〜に比べて, 〜に反して, 〜反面, 〜どころか' },
  { n: 51, title: '強調 — Nhấn mạnh · N2: 〜さえ, 〜すら, 〜こそ, 〜ものがある, 〜ことか' },
  { n: 52, title: 'レポート — Báo cáo, luận · N2: 〜上で, 〜面で, 〜である, 〜べきだ, 〜ねばならない' },
  { n: 53, title: 'ビジネスメール — Email công việc · N2: kính ngữ nâng cao, 〜させていただきます' },
  { n: 54, title: '読解・聴解 N2 — Đọc & nghe N2: văn bình luận, so sánh, nghe tổng hợp' },
  { n: 55, title: 'N2 総復習 — Ôn tập & thi thử N2' },
];

export const DAYS: Day[] = OUTLINE.map(({ n, title }) => ({
  // Bài 0 hiện là "Bài 0" nhưng lịch học vẫn đánh số từ 1 — n ở đây là số thứ tự buổi.
  n: n + 1,
  // Chỉ MỤC LỤC (manifest.ts, sinh tự động) — nội dung bài tải khi mở, qua loadDay.
  lessons: MANIFEST[n]?.lessons ?? [stub(n, 1, [n === 0 ? 'kana' : 'conversation', title])],
}));

export const DEKIRU = defineCourse({
  stage: 'dekiru1',
  storageKey: 'dekiru-v1',
  title: 'Tiếng Nhật できる日本語 · Bài 0–15 theo sách → N2',
  backHref: '/language/ja',
  unit: 'Bài',
  shownNum: (n) => n - 1,
  badgeWord: 'Bài',
  intro: INTRO,
  extras: [CHIA, ON_THE, DE_LUYEN_67, ...ON_113, ...ON_CUOI_KY],
  // 🎬 Video giảng mp4 gắn theo mục (ポイント, tiêu đề…) — videos.ts, sinh bởi xuat/gan-sach.mts của dự án video.
  videoNeo: VIDEO_NEO,
  // Mục lục mỗi bài gom 5 nhóm (học trước → luyện thêm → ôn thi → tra sách) — nhom.ts.
  nhomMuc: nhomMucDekiru,
  videoLoTrinh,
  days: DAYS,
  // Chữ Hán: chữ của lớp (soạn tay) + chỉ mục từ đi chung (sinh lúc build) — tải chậm, 3 chunk.
  kanji: () =>
    Promise.all([import('./bai/hanTu'), import('./bai/hanLop'), import('./bai/kanjiIndex'), import('./bai/hanTuTiep')]).then(([h, l, k, t]) => ({
      ...k.KANJI_INDEX,
      // Chữ của lớp (Bài 1–15) thắng khi trùng — bảng tiếp sau sách chỉ bổ sung chữ mới.
      han: { ...t.HAN_TU_TIEP, ...h.HAN_TU },
      lop: l.LOP,
    })),
  // Manifest khoá theo số tệp baiN; buổi n = Bài n − 1.
  manifest: Object.fromEntries(Object.entries(MANIFEST).map(([k, v]) => [Number(k) + 1, v])),
  loadDay: (n) => loadBai(n - 1),
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
  planContext: 'Trang kế hoạch học tiếng Nhật: Bài 0–15 theo giáo trình できる日本語 初級 (môn JPD113/JPD123), Bài 16–55 tiếp cùng khuôn lớp lên N4 → N3 → N2 (thi thử ở Bài 25, 40, 55).',
});
