/**
 * KHOÁ JP — tiếng Nhật từ con số 0 tới N1 (05/10/2026), mục riêng trên app desktop
 * ngay dưới IELTS. Khác khoá Dekiru (bài giảng trên lớp, đi theo sách của trường):
 * khoá này tự soạn theo chuẩn JLPT, chia CẤP N5 → N4 → N3 → N2 → N1.
 *
 * Đợt 1 dựng cấp N5 (Bài 0 bảng chữ + 24 bài). Các cấp sau thêm vào OUTLINE theo
 * từng đợt; bài chưa soạn hiện "sắp có". Quy tắc soạn: SOAN-BAI.md (đọc trước).
 */
import { defineCourse } from '@/components/sach-hoc/course';
import type { Day, Lesson } from '@/components/sach-hoc/types';
import { loadBai } from './bai';
import { MANIFEST } from './bai/manifest';

const INTRO: Lesson = {
  id: 'bat-dau',
  kind: 'intro',
  title: 'Bắt đầu tại đây — lộ trình từ 0 đến N1',
  goal: 'Biết khoá JP dạy gì, đi theo lộ trình nào từ N5 tới N1, và học mỗi ngày ra sao để nói được chứ không chỉ đọc được.',
  minutes: 8,
  blocks: [
    {
      t: 'recap',
      items: [
        'Khoá đi từ **con số 0** (chưa biết chữ nào) tới **N1** — cấp cao nhất của kỳ thi năng lực tiếng Nhật JLPT.',
        'Mỗi cấp chia thành bài nhỏ ~60–90 phút: **hội thoại → từ vựng → ngữ pháp → chữ Hán → nghe → nói → bài tập**.',
        'Mọi câu tiếng Nhật đều có 🔊 giọng Nhật chuẩn, furigana (bật/tắt được) và romaji.',
        '📞 **Luyện nói với CuongMini**: gọi gia sư robot, đọc theo câu mẫu, máy chấm phát âm từng chữ và sửa bằng tiếng Việt.',
        'Phần **Bài giảng trên lớp** (giáo trình Dekiru của trường) nằm ở mục riêng, không lẫn với khoá này.',
      ],
    },
    { t: 'h', text: 'JLPT là gì? Vì sao chia N5 → N1?' },
    {
      t: 'p',
      text: '**JLPT** (日本語能力試験, Nihongo Nōryoku Shiken) là kỳ thi năng lực tiếng Nhật do **Japan Foundation** và **JEES** tổ chức từ năm **1984**; từ **2010** chia thành 5 cấp như hiện nay. Việt Nam thi **hai lần một năm (tháng 7 và tháng 12)**. N5 là dễ nhất, N1 khó nhất. Doanh nghiệp Nhật ở Việt Nam thường đòi **N3** cho vị trí cần tiếng Nhật cơ bản, **N2** cho kỹ sư cầu nối/IT, **N1** cho phiên dịch.',
    },
    {
      t: 'table',
      caption: 'Lộ trình của khoá (số giờ là ước lượng phổ biến cho người tự học đều đặn)',
      head: ['Cấp', 'Làm được gì', 'Chữ Hán', 'Từ vựng', 'Giờ học (cộng dồn)'],
      rows: [
        ['N5', 'Chào hỏi, giới thiệu, mua bán, hỏi đường, kể việc hằng ngày bằng câu ngắn', '~100', '~800', '~150–250 giờ'],
        ['N4', 'Nói chuyện đời thường chậm, đọc đoạn văn ngắn về chủ đề quen thuộc', '~300', '~1.500', '~300–450 giờ'],
        ['N3', 'Hiểu hội thoại tốc độ gần tự nhiên, đọc báo đơn giản, làm việc văn phòng cơ bản', '~650', '~3.700', '~450–700 giờ'],
        ['N2', 'Đọc báo, email công việc, hiểu tin tức; đủ cho phần lớn công việc dùng tiếng Nhật', '~1.000', '~6.000', '~700–1.100 giờ'],
        ['N1', 'Đọc văn bản trừu tượng, nghe giảng/hội thảo, phiên dịch', '~2.000', '~10.000', '~1.100–1.700 giờ'],
      ],
    },
    {
      t: 'note',
      title: 'Học thế nào để không nản và nói được',
      items: [
        'Mỗi ngày **một bài nhỏ** (30–60 phút) đều đặn hơn là ôm 5 giờ cuối tuần. Đặt lịch ở mục **Kế hoạch & tiến độ** — có nhắc giờ học.',
        'Mỗi câu mẫu: 🔊 nghe → đọc to theo 3 lần → che furigana/romaji và đọc lại. Miệng phải quen trước khi mắt quen.',
        'Học từ vựng **trong câu**, không học từ rời. Chữ Hán học **theo từ** (学生 = がくせい), không học âm từng chữ.',
        'Sai thì cứ sai — bôi đen chỗ chưa hiểu rồi hỏi **gia sư AI** ở khung bên phải, hoặc gọi 📞 CuongMini để luyện nói.',
        'Hết mỗi cụm bài có **bài kiểm tra chặng**; điểm dưới 70% thì ôn lại trước khi học tiếp.',
      ],
    },
    {
      t: 'note',
      title: 'Lỗi người Việt hay mắc khi mới học (để ý từ đầu)',
      items: [
        '**Bỏ trường âm**: おばさん (cô, dì) ≠ おばあさん (bà). Kéo dài sai là đổi nghĩa.',
        '**Bỏ âm ngắt っ**: きて (đến đây) ≠ きって (con tem). っ là một nhịp lặng ngắn.',
        '**Đọc tiếng Nhật lên xuống như tiếng Việt**: tiếng Nhật đọc đều nhịp, cao độ thay đổi nhẹ.',
        '**Nhầm trợ từ は / が / を**: khoá giải thích từng trợ từ khi nó xuất hiện, kèm bảng so sánh.',
      ],
    },
  ],
};

type Stub = [Lesson['kind'], string];
const stub = (n: number, [kind, title]: Stub): Lesson => ({ id: `b${n}-1`, kind, title, goal: '', minutes: 60 });

/** Mục lục cấp N5 — bài chưa soạn hiện "sắp có". Tiêu đề: "N5 · chủ đề — mẫu chính". */
const OUTLINE: { n: number; title: string }[] = [
  { n: 0, title: 'Bảng chữ cái: hiragana, katakana, âm đục, âm ghép, trường âm, っ' },
  { n: 1, title: 'N5 · Chào hỏi & giới thiệu — N は N です' },
  { n: 2, title: 'N5 · Đồ vật quanh ta — これ・それ・あれ, この N, の' },
  { n: 3, title: 'N5 · Ở đâu? Bao nhiêu tiền? — ここ・そこ・あそこ, どこ, いくら' },
  { n: 4, title: 'N5 · Giờ giấc & ngày tháng — 〜時〜分, 曜日, から・まで' },
  { n: 5, title: 'N5 · Đi đâu, bằng gì, với ai — 行きます・来ます・帰ります, へ, で, と' },
  { n: 6, title: 'N5 · Ăn uống & hằng ngày — を, で (nơi), 〜ませんか, 〜ましょう' },
  { n: 7, title: 'N5 · Cho & nhận — あげます・もらいます, に, もう〜ました' },
  { n: 8, title: 'N5 · Tính từ い・な — miêu tả người, vật, nơi chốn' },
  { n: 9, title: 'N5 · Thích, giỏi, hiểu — 〜が好き・上手・わかります, から (lý do)' },
  { n: 10, title: 'N5 · Có ở đâu — あります・います, vị trí 上・下・中・となり' },
  { n: 11, title: 'N5 · Đếm số lượng — つ, 人, 枚, 台, 本, 〜だけ' },
  { n: 12, title: 'N5 · Quá khứ & so sánh — 〜かったです, より, いちばん' },
  { n: 13, title: 'N5 · Muốn — 〜がほしい, 〜たい, 〜に行きます (đi để làm gì)' },
  { n: 14, title: 'N5 · Thể て ① — nhờ vả 〜てください, đang làm 〜ています' },
  { n: 15, title: 'N5 · Thể て ② — xin phép 〜てもいい, cấm 〜てはいけません' },
  { n: 16, title: 'N5 · Nối việc — 〜て、〜て, 〜てから, nối tính từ' },
  { n: 17, title: 'N5 · Thể ない — 〜ないでください, 〜なければなりません' },
  { n: 18, title: 'N5 · Thể từ điển — 〜ことができます, 趣味は〜こと, 〜まえに' },
  { n: 19, title: 'N5 · Thể た — 〜たことがあります, 〜たり〜たり, 〜たあとで' },
  { n: 20, title: 'N5 · Thể thường — nói chuyện thân mật với bạn bè' },
  { n: 21, title: 'N5 · Nghĩ & nói — 〜と思います, 〜と言いました' },
  { n: 22, title: 'N5 · Câu bổ nghĩa cho danh từ — 私が住んでいる町' },
  { n: 23, title: 'N5 · Khi, nếu, vừa… vừa — 〜とき, 〜と, 〜ながら' },
  { n: 24, title: 'N5 · Ôn tập & thi thử N5' },
];

export const DAYS: Day[] = OUTLINE.map(({ n, title }) => ({
  // Bài 0 hiện là "Bài 0" nhưng lịch học đánh số buổi từ 1 — n ở đây là số buổi.
  n: n + 1,
  lessons: MANIFEST[n]?.lessons ?? [stub(n, [n === 0 ? 'kana' : 'conversation', title])],
}));

export const JP = defineCourse({
  stage: 'jp1',
  storageKey: 'jp-v1',
  title: 'JP · Tiếng Nhật từ 0 đến N1',
  backHref: '/language/ja',
  unit: 'Bài',
  shownNum: (n) => n - 1,
  badgeWord: 'Bài',
  intro: INTRO,
  links: [{ href: '/language/ja/dekiru', label: '🏫 Bài giảng trên lớp (Dekiru)' }],
  days: DAYS,
  manifest: Object.fromEntries(Object.entries(MANIFEST).map(([k, v]) => [Number(k) + 1, v])),
  loadDay: (n) => loadBai(n - 1),
  kindLabel: {},
  kindEn: {
    intro: 'はじめに', kana: 'ひらがな・カタカナ', conversation: '会話 · Hội thoại', vocab: 'ことば · Từ vựng',
    grammar: '文法 · Ngữ pháp', kanji: '漢字 · Chữ Hán', listening: '聞く · Nghe', speaking: '話す · Nói',
    reading: '読む · Đọc', writing: '書く · Viết', homework: '練習 · Bài tập', review: '復習 · Ôn tập',
  },
  kindHue: {},
  voice: 'ja-nu',
  ngonNgu: 'ja',
  tutor: { name: 'Gia sư tiếng Nhật', mon: 'jp' },
  planContext: 'Trang kế hoạch khoá JP: tiếng Nhật từ con số 0 tới N1 theo chuẩn JLPT, hiện đang ở cấp N5.',
});
