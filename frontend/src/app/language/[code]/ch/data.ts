/**
 * KHOÁ CH — tiếng Trung (phổ thông, chữ giản thể) từ con số 0 (05/10/2026), mục
 * riêng trên app desktop ngay dưới IELTS và JP. Người dùng không có giáo trình ⇒
 * khoá TỰ SOẠN theo chuẩn HSK 3.0 (国际中文教育中文水平等级标准, GF0025-2021):
 * danh sách từ/chữ theo cấp là chuẩn công khai, lời giảng/hội thoại/bài tập viết mới.
 *
 * Đợt 1 dựng cấp HSK 1 (Bài 0 pinyin + 20 bài). Các cấp sau thêm vào OUTLINE theo
 * từng đợt. Quy tắc soạn: SOAN-BAI.md (đọc trước).
 */
import { defineCourse } from '@/components/sach-hoc/course';
import type { Day, Lesson } from '@/components/sach-hoc/types';
import { loadBai } from './bai';
import { MANIFEST } from './bai/manifest';

const INTRO: Lesson = {
  id: 'bat-dau',
  kind: 'intro',
  title: 'Bắt đầu tại đây — lộ trình từ 0 đến HSK 6',
  goal: 'Biết khoá CH dạy gì, đi theo lộ trình HSK nào, và vì sao người Việt học tiếng Trung có lợi thế lớn (âm Hán Việt) nhưng cũng hay vấp ở thanh điệu.',
  minutes: 8,
  blocks: [
    {
      t: 'recap',
      items: [
        'Khoá dạy **tiếng Trung phổ thông** (普通话, Pǔtōnghuà) với **chữ giản thể** — loại chữ dùng ở Trung Quốc đại lục và trong kỳ thi HSK.',
        'Đi từ **con số 0** (chưa biết pinyin) lên dần theo cấp **HSK 1 → HSK 6**, mỗi cấp chia thành bài nhỏ ~60–90 phút.',
        'Mỗi bài: **hội thoại → từ vựng → ngữ pháp → chữ Hán (xem nét, tập viết) → nghe → nói → bài tập**.',
        'Mọi câu tiếng Trung có 🔊 giọng Bắc Kinh chuẩn, pinyin có dấu thanh (bật/tắt được) và nghĩa tiếng Việt.',
        '📞 **Luyện nói với CuongMini**: đọc theo câu mẫu, máy chấm phát âm từng chữ và nhắc thanh điệu bằng tiếng Việt.',
      ],
    },
    { t: 'h', text: 'HSK là gì?' },
    {
      t: 'p',
      text: '**HSK** (汉语水平考试, Hànyǔ Shuǐpíng Kǎoshì) là kỳ thi năng lực tiếng Trung quốc tế, do **Trung tâm Khảo thí Hán ngữ Quốc tế** (Chinese Testing International) tổ chức. Từ năm **2021**, Bộ Giáo dục Trung Quốc ban hành **chuẩn HSK 3.0** chia **9 cấp** trong 3 chặng (sơ — trung — cao cấp). Khoá này đi theo danh sách từ và chữ của chuẩn đó. Ở Việt Nam, HSK thi nhiều đợt mỗi năm (giấy hoặc máy); doanh nghiệp thường hỏi **HSK 4** cho việc dùng tiếng Trung cơ bản, **HSK 5–6** cho biên phiên dịch.',
    },
    {
      t: 'table',
      caption: 'Lộ trình theo chuẩn HSK 3.0 (số chữ/từ CỘNG DỒN tới hết cấp đó; giờ học là ước lượng cho người tự học đều đặn)',
      head: ['Cấp', 'Làm được gì', 'Chữ Hán', 'Từ vựng', 'Giờ học (cộng dồn)'],
      rows: [
        ['HSK 1', 'Chào hỏi, giới thiệu, số đếm, giờ giấc, mua bán đơn giản', '300', '500', '~80–120 giờ'],
        ['HSK 2', 'Kể việc hằng ngày, hỏi đường, gọi món, hẹn gặp', '600', '1.272', '~200–250 giờ'],
        ['HSK 3', 'Nói chuyện đời thường, đọc đoạn văn ngắn, viết tin nhắn', '900', '2.245', '~350–450 giờ'],
        ['HSK 4', 'Trao đổi công việc, đọc bài báo đơn giản, nêu ý kiến', '1.200', '3.245', '~500–650 giờ'],
        ['HSK 5', 'Đọc báo, xem tin tức, thuyết trình ngắn', '1.500', '4.316', '~700–900 giờ'],
        ['HSK 6', 'Đọc văn bản dài, viết bài luận, làm việc hoàn toàn bằng tiếng Trung', '1.800', '5.456', '~900–1.200 giờ'],
      ],
    },
    {
      t: 'note',
      title: 'Lợi thế của người Việt — và chỗ hay vấp',
      items: [
        '**Âm Hán Việt**: khoảng 60% từ vựng tiếng Việt có gốc Hán. 学生 xuéshēng = **học sinh**, 国家 guójiā = **quốc gia**. Khoá ghi âm Hán Việt cạnh chữ để bạn đoán nghĩa nhanh.',
        '**Ngữ pháp gần tiếng Việt**: chủ ngữ — động từ — tân ngữ, không chia động từ theo thì. Nhưng **trạng ngữ thời gian, nơi chốn đứng TRƯỚC động từ**: 我在学校学习 (tôi ở trường học) chứ không nói "tôi học ở trường".',
        '**Thanh điệu**: tiếng Trung có 4 thanh + thanh nhẹ, KHÔNG trùng với 6 thanh tiếng Việt. Thanh 1 cao và phẳng (gần thanh ngang nhưng cao hơn), thanh 4 hạ mạnh (gần thanh huyền nhưng gắt và ngắn).',
        '**Âm dễ nhầm**: zh/ch/sh (uốn lưỡi) với z/c/s; ü; j/q/x. Bài 0 luyện kỹ từng cặp, có máy chấm.',
      ],
    },
    {
      t: 'note',
      title: 'Học thế nào để nói được',
      items: [
        'Bài 0 (pinyin + thanh điệu) là móng nhà — đừng vội. Đọc đúng thanh ngay từ đầu dễ hơn sửa sau này.',
        'Mỗi câu mẫu: 🔊 nghe → đọc to theo 3 lần → che pinyin và đọc lại.',
        'Chữ Hán: xem thứ tự nét → tô theo → tự viết. Học chữ **theo từ** và **theo bộ thủ**, không học thuộc từng nét rời.',
        'Đặt lịch ở **Kế hoạch & tiến độ**; mỗi cụm bài có **bài kiểm tra chặng** — dưới 70% thì ôn lại trước khi học tiếp.',
      ],
    },
  ],
};

type Stub = [Lesson['kind'], string];
const stub = (n: number, [kind, title]: Stub): Lesson => ({ id: `b${n}-1`, kind, title, goal: '', minutes: 60 });

/** Mục lục cấp HSK 1 — bài chưa soạn hiện "sắp có". */
const OUTLINE: { n: number; title: string }[] = [
  { n: 0, title: 'Pinyin & thanh điệu — thanh mẫu, vận mẫu, 4 thanh, nét chữ cơ bản' },
  { n: 1, title: 'HSK 1 · 你好 — Chào hỏi, cảm ơn, xin lỗi' },
  { n: 2, title: 'HSK 1 · 你叫什么名字 — Tên, họ, 是, câu hỏi 吗' },
  { n: 3, title: 'HSK 1 · 你是哪国人 — Quốc tịch, 不, 也, 呢' },
  { n: 4, title: 'HSK 1 · 我的家 — Gia đình, 有/没有, 几, 的, lượng từ 个/口' },
  { n: 5, title: 'HSK 1 · 数字 — Số đếm 0–99, tuổi 多大/几岁' },
  { n: 6, title: 'HSK 1 · 今天几号 — Ngày, tháng, thứ, 今天/明天/昨天' },
  { n: 7, title: 'HSK 1 · 现在几点 — Giờ giấc, lịch sinh hoạt' },
  { n: 8, title: 'HSK 1 · 多少钱 — Mua sắm, 块/毛, 要, 这/那' },
  { n: 9, title: 'HSK 1 · 我想喝茶 — Ăn uống, 想, 还是, 杯/碗' },
  { n: 10, title: 'HSK 1 · 在哪儿 — Vị trí, 在, 这儿/那儿, 上下里前后' },
  { n: 11, title: 'HSK 1 · 怎么去 — Đi lại, 去, 坐, 怎么' },
  { n: 12, title: 'HSK 1 · 学习和工作 — Học và làm, 在 + nơi + V' },
  { n: 13, title: 'HSK 1 · 我会说汉语 — Sở thích & khả năng, 喜欢, 会, 能' },
  { n: 14, title: 'HSK 1 · 天气 — Thời tiết, 太…了, 很' },
  { n: 15, title: 'HSK 1 · 你昨天做什么了 — Việc đã làm, 了, 没' },
  { n: 16, title: 'HSK 1 · 他在做什么呢 — Đang làm gì, 在…呢' },
  { n: 17, title: 'HSK 1 · 打电话 — Gọi điện, hẹn gặp, 吧, 一起' },
  { n: 18, title: 'HSK 1 · 身体 — Sức khoẻ, 怎么样, 有点儿' },
  { n: 19, title: 'HSK 1 · 我的一天 — Kể một ngày của mình' },
  { n: 20, title: 'HSK 1 · Ôn tập & thi thử HSK 1' },
];

export const DAYS: Day[] = OUTLINE.map(({ n, title }) => ({
  n: n + 1,
  lessons: MANIFEST[n]?.lessons ?? [stub(n, [n === 0 ? 'kana' : 'conversation', title])],
}));

export const CH = defineCourse({
  stage: 'ch1',
  storageKey: 'ch-v1',
  title: 'CH · Tiếng Trung từ 0 đến HSK 6',
  backHref: '/language/zh',
  unit: 'Bài',
  shownNum: (n) => n - 1,
  badgeWord: 'Bài',
  intro: INTRO,
  days: DAYS,
  manifest: Object.fromEntries(Object.entries(MANIFEST).map(([k, v]) => [Number(k) + 1, v])),
  loadDay: (n) => loadBai(n - 1),
  // `kana` dùng cho Bài 0 (pinyin), `kanji` cho phần chữ Hán.
  kindLabel: { kana: 'Pinyin', kanji: 'Chữ Hán' },
  kindEn: {
    intro: '开始', kana: '拼音 · Pinyin', conversation: '会话 · Hội thoại', vocab: '生词 · Từ vựng',
    grammar: '语法 · Ngữ pháp', kanji: '汉字 · Chữ Hán', listening: '听力 · Nghe', speaking: '口语 · Nói',
    reading: '阅读 · Đọc', writing: '写作 · Viết', homework: '练习 · Bài tập', review: '复习 · Ôn tập',
  },
  kindHue: {},
  voice: 'zh-nu',
  ngonNgu: 'zh',
  tutor: { name: 'Gia sư tiếng Trung', mon: 'trung' },
  planContext: 'Trang kế hoạch khoá CH: tiếng Trung phổ thông từ con số 0 theo chuẩn HSK 3.0, hiện đang ở cấp HSK 1.',
});
