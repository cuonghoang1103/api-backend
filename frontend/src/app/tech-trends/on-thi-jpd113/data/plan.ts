/**
 * JPD113 + JPD123 — LỘ TRÌNH 30 NGÀY HỌC LẠI TỪ GỐC.
 *
 * Lịch sử: bản đầu tiên của file này là lộ trình CẤP TỐC 5 ngày (02/08 → 06/08/2026)
 * viết cho kỳ thi JPD113. Kỳ thi đó đã trượt, và biên bản thất bại rất rõ ràng:
 *
 *   · Trắc nghiệm FE 3,7/10 — "không hiểu văn bản dịch ra cái gì" nên khoanh mò
 *   · Thi ĐỌC — ngắt sai, chữ Hán không thuộc, hira/kata nhầm nhau,
 *     đọc rời từng chữ chứ không thành câu, sai âm ngắt っ và trường âm
 *   · Thi NÓI — KHÔNG NGHE HIỂU câu hỏi của giám thị (3 câu tranh + 1 câu ngoài),
 *     và từ vựng trong tranh cũng chưa thuộc
 *
 * Ba lỗ hổng đó không phải lỗi "học chưa đủ chăm trong 5 ngày" — chúng là lỗ hổng
 * NỀN, và nền thì chỉ xây được bằng thời gian. Nên lộ trình mới là 30 ngày, chạy
 * TRƯỚC khi vào kỳ, học song song cả JPD113 (học lại) và JPD123 (đi trước).
 *
 * NGUYÊN TẮC XẾP LỘ TRÌNH (đừng đảo thứ tự khi sửa):
 *  1. GIAI ĐOẠN 1 chỉ làm một việc: biến kana từ "nhìn quen quen" thành "đọc ra
 *     tiếng ngay". Sáu ngày cho riêng việc này — vì đây chính là chỗ đã sập.
 *  2. NGHE được đưa lên thành một mạch chạy suốt 30 ngày, không phải phần phụ.
 *     Lần thi trước mất điểm nói KHÔNG phải vì không nói được mà vì không nghe được.
 *  3. Con số/thời gian đứng ngay sau kana: nó vừa là chỗ mất điểm số một trong 420
 *     câu FE, vừa là chỗ vấp giữa câu khi đọc to, vừa là câu hỏi giám thị hay hỏi.
 *  4. DỊCH được câu tiếng Nhật là một kỹ năng RIÊNG, phải luyện riêng (giai đoạn 3-4)
 *     — không tự đến từ việc học thuộc từ vựng.
 *  5. JPD123 chỉ chen vào từ ngày 11, sau khi nền JPD113 đã đứng. Học sớm hơn là
 *     xây nhà trên cát: ngữ pháp A1.2 giả định bạn đọc kana trôi chảy.
 *
 * `tier`:
 *   'core' = làm đủ những việc này là nắm chắc cả hai môn
 *   'plus' = phần kéo lên 9-10, làm khi còn thời gian trong ngày
 *
 * ⚠️ `id` của mỗi việc là KHOÁ LƯU TIẾN ĐỘ và cũng là khoá tra bài giảng trong
 * `data/lessons/` — ĐỪNG đổi id khi sửa nội dung. Các id còn tiền tố `d1-`…`d5-`
 * là di sản của lộ trình 5 ngày cũ; chúng đã được xếp lại sang ngày khác nhưng
 * GIỮ NGUYÊN TÊN để 64 bài giảng đã soạn vẫn tra ra được. Đừng "dọn dẹp" chúng.
 */

export type TaskTier = 'core' | 'plus';

export type TaskKind =
  | 'kana'
  | 'number'
  | 'grammar'
  | 'kanji'
  | 'vocab'
  | 'listening'
  | 'speaking'
  | 'reading'
  | 'exam'
  | 'review';

/** Việc này phục vụ môn nào — để lọc lịch theo môn */
export type CourseFocus = 'JPD113' | 'JPD123';

export interface TaskLink {
  label: string;
  href: string;
}

export interface StudyTask {
  /** ID ổn định — dùng làm khoá lưu tiến độ VÀ khoá tra bài giảng. ĐỪNG đổi. */
  id: string;
  title: string;
  /** Làm gì, cụ thể từng bước — không để chung chung kiểu "ôn ngữ pháp" */
  detail: string;
  minutes: number;
  tier: TaskTier;
  kind: TaskKind;
  course?: CourseFocus;
  links?: TaskLink[];
}

export interface StudyBlock {
  id: string;
  label: string;
  goal: string;
  tasks: StudyTask[];
}

export interface StudyDay {
  n: number;
  /** Giai đoạn 1..5 */
  phase: number;
  title: string;
  mission: string;
  /** Tiêu chí nghiệm thu: cuối ngày tự kiểm được, không mơ hồ */
  outcome: string;
  blocks: StudyBlock[];
}

export interface Phase {
  n: number;
  name: string;
  range: string;
  goal: string;
  /** Lỗi cụ thể của kỳ thi trượt mà giai đoạn này chữa */
  fixes: string;
  color: string;
}

/* ══════════════════════════════════════════════════════════════
   ĐƯỜNG DẪN
   ══════════════════════════════════════════════════════════════ */

const COURSE_113 = '/courses/elementary-japanese-1-a11/learn';
const COURSE_123 = '/courses/elementary-japanese-1-a12/learn';

/** Deep-link tới một bài JPD113 trong Academy (slug ổn định qua các lần đổi tiêu đề) */
export const lesson = (slug: string) => `${COURSE_113}?lessonSlug=${slug}`;
/** Deep-link tới một bài JPD123 (Kỳ 4) */
export const lesson123 = (slug: string) => `${COURSE_123}?lessonSlug=${slug}`;

/**
 * Phòng thi — `kind` ở đây là CATEGORY của Exam Room, không phải cột `kind`
 * trong DB: đề đọc hiểu lưu là kind:'FE' code "READ-*" nhưng hiển thị dưới
 * chip READING, đề vấn đáp lưu kind:'PE' peType:'SPEAK' nhưng hiển thị dưới
 * chip SPEAKING. Dùng sai tên chip thì trang lọc ra danh sách rỗng.
 * Giá trị hợp lệ: ALL · PT · FE · PE · READING · SPEAKING.
 */
export const EXAM_FE = '/exam?course=JPD113&kind=FE';
export const EXAM_READING = '/exam?course=JPD113&kind=READING';
export const EXAM_SPEAKING = '/exam?course=JPD113&kind=SPEAKING';

/** My Language — luyện SRS ngoài giờ */
export const ML_VOCAB = '/language/ja/vocab';
export const ML_GRAMMAR = '/language/ja/grammar';
export const ML_ALPHABET = '/language/ja/alphabet';
export const ML_LISTENING = '/language/ja/listening';

/**
 * Ngày bắt đầu MẶC ĐỊNH. Người học đổi được trong trang (lưu localStorage),
 * nên đây chỉ là điểm khởi hành gợi ý — lộ trình đánh số Ngày 1..30, không
 * gắn cứng vào lịch, để bắt đầu muộn vài hôm cũng không hỏng.
 */
export const DEFAULT_START = '2026-08-11';
export const START_STORAGE_KEY = 'jpd113:start:v1';

/** Ngày dương lịch của Ngày N, tính từ ngày bắt đầu (ISO yyyy-mm-dd) */
export function dateForDay(startISO: string, n: number): string {
  const d = new Date(`${startISO}T00:00:00`);
  d.setDate(d.getDate() + n - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const DOW = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
export function dowForDate(iso: string): string {
  return DOW[new Date(`${iso}T00:00:00`).getDay()] ?? '';
}

/* ══════════════════════════════════════════════════════════════
   VIỆC LẶP HẰNG NGÀY — làm mỗi ngày, ngoài lịch của ngày đó
   ══════════════════════════════════════════════════════════════ */

export const DAILY_RITUAL: StudyTask[] = [
  {
    id: 'ritual-kana-write',
    title: 'Viết cả bảng kana ra giấy trắng',
    detail:
      'Không nhìn mẫu. Ô nào viết không ra là việc phải học lại ngay hôm đó. ' +
      'Đây là phép thử duy nhất phân biệt "nhận ra mặt chữ" với "thật sự thuộc". ' +
      'Từ ngày 10 trở đi rút còn 5 phút: chỉ viết những hàng từng sai.',
    minutes: 10,
    tier: 'core',
    kind: 'kana',
  },
  {
    id: 'ritual-listen',
    title: 'Nghe 15 câu tiếng Nhật — KHÔNG nhìn chữ',
    detail:
      'Việc quan trọng nhất trong cả lộ trình, và là việc lần trước hoàn toàn không có. ' +
      'Mở khu "Nghe hiểu", bật chế độ nghe-hiểu, che chữ, nghe rồi chọn nghĩa. ' +
      'Nghe hiểu KHÔNG học được bằng cách đọc — nó chỉ đến bằng số giờ tai bạn tiếp xúc với tiếng Nhật. ' +
      '10 phút mỗi ngày × 30 ngày = 5 giờ, đủ để nhận ra khuôn câu hỏi giám thị.',
    minutes: 10,
    tier: 'core',
    kind: 'listening',
  },
  {
    id: 'ritual-read-aloud',
    title: 'Đọc to 3 bài + ghi âm nghe lại',
    detail:
      'Đọc THÀNH TIẾNG, không đọc thầm. Bấm giờ, ghi âm bằng điện thoại rồi nghe lại — ' +
      'chỗ nào mình ngập ngừng thì chính là chỗ giám thị trừ điểm. ' +
      'Nghe lại là bắt buộc: lúc đang đọc thì không ai tự nghe ra mình đọc rời từng chữ.',
    minutes: 15,
    tier: 'core',
    kind: 'speaking',
  },
  {
    id: 'ritual-vocab',
    title: '20 từ vựng ở khu Từ vựng (chế độ Viết đáp án)',
    detail:
      'Chọn chế độ "Viết đáp án" chứ không phải "Lật thẻ" — nhìn thẻ rồi gật gù "à biết rồi" ' +
      'là ảo giác thuộc bài. Phải tự gõ ra được mới tính. Ưu tiên nút "60 từ hay ra đề nhất".',
    minutes: 10,
    tier: 'core',
    kind: 'vocab',
    links: [{ label: 'My Language — SRS tiếng Nhật', href: ML_VOCAB }],
  },
  {
    id: 'ritual-error-log',
    title: 'Đọc lại sổ lỗi',
    detail:
      'Mỗi câu làm sai chép vào một cuốn sổ (hoặc ghi chú điện thoại): ' +
      'câu hỏi — đáp án đúng — vì sao mình chọn sai. Đọc lại toàn bộ sổ mỗi tối. ' +
      'Cày đề mà không có sổ lỗi thì sai câu nào vẫn sai lại câu đó — đó chính là chuyện đã xảy ra lần trước.',
    minutes: 10,
    tier: 'core',
    kind: 'review',
  },
];

/* ══════════════════════════════════════════════════════════════
   5 GIAI ĐOẠN
   ══════════════════════════════════════════════════════════════ */

export const PHASES: Phase[] = [
  {
    n: 1,
    name: 'Đọc ra được chữ',
    range: 'Ngày 1–6',
    goal:
      'Kana thành phản xạ, không còn dịch qua romaji trong đầu. Đọc đúng âm ngắt っ, ' +
      'trường âm và nhịp mora. Sáu ngày chỉ cho một việc này.',
    fixes: 'Chữa: hira/kata nhầm nhau · đọc rời từng chữ · sai âm ngắt và trường âm',
    color: '#22d3ee',
  },
  {
    n: 2,
    name: 'Số, giờ & lỗ tai',
    range: 'Ngày 7–12',
    goal:
      'Nghe ra số và giờ mà không cần nhìn chữ, đọc bảng số bất quy tắc không vấp. ' +
      'Bắt đầu mạch NGHE: câu hỏi giám thị và mệnh lệnh lớp học.',
    fixes: 'Chữa: không nghe hiểu câu hỏi · vấp số giữa câu khi đọc to',
    color: '#fb923c',
  },
  {
    n: 3,
    name: 'Ngữ pháp lõi + Kanji',
    range: 'Ngày 13–18',
    goal:
      'Trợ từ, これ/この, từ để hỏi, thể ます. 35 kanji lõi và mọi kanji xuất hiện trong ' +
      '13 bài đọc. Bắt đầu luyện DỊCH câu FE từng chữ một.',
    fixes: 'Chữa: chữ Hán không thuộc · không hiểu câu FE dịch ra gì',
    color: '#8b5cf6',
  },
  {
    n: 4,
    name: 'Thi nói + Trắc nghiệm FE',
    range: 'Ngày 19–24',
    goal:
      '13 bài đọc thuộc tới mức đọc trơn, 22 câu hỏi + 6 bộ tranh nghe là trả lời được trong 3 giây. ' +
      'Cày đề FE có phân tích, không cày cho có.',
    fixes: 'Chữa: từ vựng trong tranh chưa thuộc · khoanh mò FE',
    color: '#ec4899',
  },
  {
    n: 5,
    name: 'Đi trước JPD123',
    range: 'Ngày 25–30',
    goal:
      'Toàn bộ khung ngữ pháp A1.2: động từ ます đủ dạng, tính từ, mời rủ, mong muốn, ' +
      'so sánh, thể て. Vào lớp là đã học rồi, buổi học trên trường thành buổi ôn.',
    fixes: 'Mục tiêu: gỡ điểm cả hai môn trong cùng một kỳ',
    color: '#4ade80',
  },
];

/* ══════════════════════════════════════════════════════════════
   LỘ TRÌNH 30 NGÀY
   ══════════════════════════════════════════════════════════════ */

export const PLAN: StudyDay[] = [
  /* ═══════════ GIAI ĐOẠN 1 · ĐỌC RA ĐƯỢC CHỮ ═══════════ */
  {
    n: 1,
    phase: 1,
    title: 'Hiragana — 46 âm gốc',
    mission:
      'Hôm nay chỉ có một việc: 46 chữ hiragana gốc, nhìn phát ra tiếng ngay, không qua romaji. ' +
      'Đừng học thêm bất cứ thứ gì khác.',
    outcome:
      'Viết được cả 46 chữ ra giấy trắng từ trí nhớ, và đọc một đoạn toàn hiragana không cần romaji chú thích.',
    blocks: [
      {
        id: 'd1-b1',
        label: 'Khối 1 · Nhận mặt chữ',
        goal: 'Từ "quen quen" thành "đọc được"',
        tasks: [
          {
            id: 'd1-hira-46',
            title: 'Học 46 hiragana theo hàng あ→わ',
            detail:
              'Học theo HÀNG chứ không học lẻ: あいうえお / かきくけこ / さしすせそ… Mỗi hàng đọc to 10 lần rồi che lại đọc lại. ' +
              'Não nhớ chuỗi tốt hơn nhớ chữ rời.',
            minutes: 25,
            tier: 'core',
            kind: 'kana',
            course: 'JPD113',
            links: [{ label: 'Academy — Hiragana gốc', href: lesson('jpd113-hiragana-goc') }],
          },
          {
            id: 'd1-hira-write',
            title: 'Viết tay từng chữ 5 lần',
            detail:
              'Cầm bút thật, viết ra giấy thật. Viết tay ghi nhớ mặt chữ mạnh hơn gõ phím nhiều lần — ' +
              'đây là lý do bạn vẫn nhầm hira với kata dù đã "học" chúng rồi.',
            minutes: 20,
            tier: 'core',
            kind: 'kana',
            course: 'JPD113',
          },
          {
            id: 'm1-hira-audio',
            title: 'Nghe từng âm rồi gõ lại (không nhìn bảng)',
            detail:
              'Mở khu "Nghe hiểu" → chế độ Chính tả kana. Nghe một âm, gõ ra. Đây là bài tập nối TAI với MẮT — ' +
              'thiếu nó thì bạn đọc được chữ nhưng vẫn không nghe ra khi giám thị nói.',
            minutes: 15,
            tier: 'core',
            kind: 'listening',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd1-b2',
        label: 'Khối 2 · Chống nhầm lẫn',
        goal: 'Diệt các cặp chữ hay nhìn nhầm',
        tasks: [
          {
            id: 'm1-hira-confuse',
            title: '12 cặp hiragana dễ nhìn nhầm',
            detail:
              'あ/お · き/さ · ぬ/め · は/ほ/ま · る/ろ · れ/わ/ね · し/つ · い/り · た/な · す/む · こ/て. ' +
              'Với MỖI cặp: viết hai chữ cạnh nhau, khoanh đúng nét khác nhau, viết một câu ghi nhớ. ' +
              'Nhầm ở đây là nhầm cả đời nếu không xử ngay ngày đầu.',
            minutes: 20,
            tier: 'core',
            kind: 'kana',
            course: 'JPD113',
          },
          {
            id: 'd1-drill-kana',
            title: 'Khu Luyện gõ — bộ hiragana 46, 3 vòng',
            detail:
              'Vòng 1 gõ romaji, vòng 2 chọn cách đọc, vòng 3 chọn mặt chữ. Ba kiểu này ứng đúng ba dạng câu hỏi kana trong đề FE. ' +
              'Chữ nào sai được hệ thống nhân trọng số nên sẽ ra lại nhiều lần — đừng bỏ dở giữa vòng.',
            minutes: 25,
            tier: 'core',
            kind: 'kana',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd1-b3',
        label: 'Khối 3 · Đọc thật',
        goal: 'Áp kana vào câu, không học chữ rời',
        tasks: [
          {
            id: 'd1-hira-particles',
            title: 'Ba chữ đọc khác lúc làm trợ từ: は・へ・を',
            detail:
              'は đọc "wa" khi làm trợ từ (わたしは), へ đọc "e" (がっこうへ), を luôn đọc "o". ' +
              'Ba chữ này xuất hiện trong MỌI câu — đọc sai là sai suốt bài.',
            minutes: 15,
            tier: 'core',
            kind: 'kana',
            course: 'JPD113',
            links: [{ label: 'Academy — ん, trường âm & trợ từ', href: lesson('jpd113-n-truong-am-tro-tu') }],
          },
          {
            id: 'd1-check-blank',
            title: 'Viết cả bảng ra giấy trắng — lần 1',
            detail:
              'Kẻ bảng 5 cột × 10 hàng rồi điền. Đếm số ô sai. Sai quá 5 ô thì học lại khối 1 trước khi đi tiếp — ' +
              'đừng thoả hiệp chỗ này, mọi thứ phía sau đứng trên nó.',
            minutes: 15,
            tier: 'core',
            kind: 'kana',
            course: 'JPD113',
          },
          {
            id: 'd1-check-quiz',
            title: 'Tự kiểm 20 câu kana',
            detail: 'Làm quiz cuối chương Academy. Dưới 18/20 thì chưa qua ngày 1.',
            minutes: 15,
            tier: 'core',
            kind: 'kana',
            course: 'JPD113',
            links: [{ label: 'Academy — Quiz kana', href: lesson('jpd113-quiz-1') }],
          },
        ],
      },
      {
        id: 'd1-b4',
        label: 'Khối 4 · Khởi động thi nói',
        goal: 'Tác phong và hồ sơ cá nhân — làm sớm để có 30 ngày ngấm',
        tasks: [
          {
            id: 'd1-speak-manner',
            title: '4 câu tác phong vào/ra phòng thi',
            detail:
              'しつれいします (xin phép vào) → よろしくおねがいします → ありがとうございました → しつれいしました. ' +
              '10 điểm PRESENTING nằm gọn trong 4 câu này. Học ngày đầu, nhắc mỗi ngày, tới hôm thi là tự bật ra.',
            minutes: 10,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
          {
            id: 'd1-speak-profile',
            title: 'Điền hồ sơ cá nhân ở khu Thi nói',
            detail:
              'Tên katakana, quốc tịch, trường, năm mấy, ngành, tuổi, năm sinh. Điền xong thì mọi câu trả lời mẫu ' +
              'trong trang tự đổi thành câu CỦA BẠN — học thuộc câu của chính mình dễ hơn học câu người khác gấp nhiều lần.',
            minutes: 20,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
        ],
      },
    ],
  },
  {
    n: 2,
    phase: 1,
    title: 'Biến âm, âm ghép & hai thứ đã làm bạn đọc sai',
    mission:
      'Dakuten/handakuten, âm ghép ゃゅょ, ん — rồi tới hai thủ phạm chính của "đọc sai hết": ' +
      'âm ngắt っ và trường âm.',
    outcome:
      'Đọc đúng きって (3 nhịp) ≠ きて (2 nhịp), がっこう ≠ がこう, ビル ≠ ビール — và nghe ra khác biệt khi người khác đọc.',
    blocks: [
      {
        id: 'd2-b1',
        label: 'Khối 1 · Mở rộng bảng chữ',
        goal: '46 chữ gốc → 104 âm',
        tasks: [
          {
            id: 'd1-hira-dakuten',
            title: 'Biến âm: が ざ だ ば ぱ',
            detail:
              'Hai dấu " biến か→が, さ→ざ, た→だ, は→ば. Dấu ° chỉ có ở hàng は: は→ぱ. ' +
              'Không phải học 25 chữ mới — chỉ là 5 hàng cũ thêm dấu.',
            minutes: 25,
            tier: 'core',
            kind: 'kana',
            course: 'JPD113',
            links: [{ label: 'Academy — Hiragana biến âm', href: lesson('jpd113-hiragana-bien-am') }],
          },
          {
            id: 'd1-hira-youon',
            title: 'Âm ghép きゃ きゅ きょ — chữ nhỏ',
            detail:
              'ゃゅょ viết NHỎ và gộp vào chữ trước thành MỘT nhịp: きょ = "kyo" một nhịp, không phải "ki-yo" hai nhịp. ' +
              'Đây là lý do びょういん (bệnh viện) hay bị đọc thành びよういん (tiệm làm tóc).',
            minutes: 25,
            tier: 'core',
            kind: 'kana',
            course: 'JPD113',
          },
          {
            id: 'd1-hira-mora',
            title: 'ん là MỘT nhịp riêng',
            detail:
              'にほん = に-ほ-ん, ba nhịp. Người Việt hay nuốt ん thành phụ âm cuối như "nhon". ' +
              'Vỗ tay theo từng nhịp khi đọc — nghe kỳ nhưng đây là cách nhanh nhất để sửa.',
            minutes: 20,
            tier: 'core',
            kind: 'kana',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd2-b2',
        label: 'Khối 2 · Hai thủ phạm của "đọc sai hết"',
        goal: 'Âm ngắt và trường âm — chữa đúng lỗi đã bị trừ điểm',
        tasks: [
          {
            id: 'm2-sokuon',
            title: 'Âm ngắt っ — nhịp IM LẶNG',
            detail:
              'っ nhỏ không phát ra tiếng, nó chiếm MỘT nhịp im. きって (kit-te) 3 nhịp ≠ きて (ki-te) 2 nhịp. ' +
              'がっこう, いっさい, はっぴゃく, ざっし. Cách luyện: đọc chậm, tới っ thì NGẬM MIỆNG đếm một nhịp rồi mới bật chữ sau. ' +
              'Xem mục "🎵 Âm ngắt っ & trường âm" ở khu Bảng tra cứu.',
            minutes: 25,
            tier: 'core',
            kind: 'kana',
            course: 'JPD113',
          },
          {
            id: 'm2-chouon',
            title: 'Trường âm — おう đọc "ôô", えい đọc "êê"',
            detail:
              'とうきょう = とーきょー (không phải "tô-u-kyô-u"). せんせい = せんせー. ' +
              'Katakana dùng gạch ー: コーヒー. NGOẠI LỆ phải nhớ riêng: おお trong とおか (mùng 10), おおきい (to), こおり (đá). ' +
              'Cặp đổi nghĩa cần thuộc: ビル (toà nhà) / ビール (bia) · おばさん (cô) / おばあさん (bà).',
            minutes: 25,
            tier: 'core',
            kind: 'kana',
            course: 'JPD113',
          },
          {
            id: 'm2-listen-minimal',
            title: 'Nghe 20 cặp tối thiểu và chọn',
            detail:
              'Khu Nghe hiểu → bộ "Cặp tối thiểu". Nghe きて hay きって? おばさん hay おばあさん? ' +
              'Nếu tai chưa phân biệt được thì miệng cũng sẽ không đọc phân biệt được. Đây là bài tập bắt buộc, không phải bài phụ.',
            minutes: 20,
            tier: 'core',
            kind: 'listening',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd2-b3',
        label: 'Khối 3 · Đọc bài đầu tiên',
        goal: 'Áp dụng ngay vào bài thi nói thật',
        tasks: [
          {
            id: 'd1-speak-read12',
            title: 'Bài đọc 1 & 2 — đọc to, chậm, ghi âm',
            detail:
              'Hai bài dễ nhất ngân hàng. Mục tiêu hôm nay KHÔNG phải nhanh mà là ĐÚNG từng âm. ' +
              'Ghi âm, nghe lại, đánh dấu chỗ vấp. 二十歳 = はたち (bất quy tắc).',
            minutes: 25,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
            links: [{ label: 'Academy — Bài đọc 1-7', href: lesson('jpd113-speaking-doc-1-7') }],
          },
        ],
      },
    ],
  },
  {
    n: 3,
    phase: 1,
    title: 'Katakana — và diệt hẳn chuyện nhầm hira/kata',
    mission:
      'Katakana khó hơn hiragana vì các chữ giống nhau nhiều hơn. Hôm nay học đủ 46 + biến âm, ' +
      'và luyện riêng phần phân biệt với hiragana.',
    outcome:
      'Nhìn một đoạn trộn hai bảng mà đọc trơn, không dừng lại tự hỏi "chữ này bảng nào". Viết được tên mình bằng katakana.',
    blocks: [
      {
        id: 'd3-b1',
        label: 'Khối 1 · Katakana',
        goal: 'Bảng thứ hai',
        tasks: [
          {
            id: 'd1-kata-46',
            title: 'Katakana 46 chữ — học ĐỐI CHIẾU với hiragana',
            detail:
              'Học theo cặp あ-ア, い-イ, う-ウ… chứ đừng học katakana như một bảng mới toanh. ' +
              'Nhiều cặp gần giống nhau (か-カ, せ-セ, り-リ, も-モ) — dựa vào đó nhớ nhanh hơn.',
            minutes: 30,
            tier: 'core',
            kind: 'kana',
            course: 'JPD113',
            links: [{ label: 'Academy — Katakana', href: lesson('jpd113-katakana') }],
          },
          {
            id: 'd1-kata-confuse',
            title: 'Bốn cặp katakana ai cũng nhầm',
            detail:
              'シ/ツ (シ nét xiên từ dưới lên, ツ nét dọc từ trên xuống) · ソ/ン · ク/ワ · ア/マ · ス/ヌ. ' +
              'Mẹo: シ và ン nét cuối đi TỪ DƯỚI LÊN; ツ và ソ nét cuối đi TỪ TRÊN XUỐNG.',
            minutes: 25,
            tier: 'core',
            kind: 'kana',
            course: 'JPD113',
          },
          {
            id: 'd1-kata-words',
            title: '30 từ katakana hay gặp trong đề',
            detail:
              'テニス, コーヒー, テレビ, パソコン, アルバイト, コンビニ, インターネット, サッカー, ビール, カレー… ' +
              'Katakana chiếm khoảng 2% câu FE nhưng lại xuất hiện dày trong bài đọc và bộ tranh thi nói.',
            minutes: 25,
            tier: 'core',
            kind: 'kana',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd3-b2',
        label: 'Khối 2 · Trộn hai bảng',
        goal: 'Chỗ thật sự bị nhầm là khi hai bảng đứng cạnh nhau',
        tasks: [
          {
            id: 'm3-hira-kata-mix',
            title: 'Khu Luyện gõ — bộ TRỘN 208 chữ',
            detail:
              'Đây mới là bài kiểm tra thật. Học riêng từng bảng thì ai cũng qua; trộn lại mới lộ ra chỗ nhầm. ' +
              'Chạy tới khi hai vòng liên tiếp không sai chữ nào.',
            minutes: 25,
            tier: 'core',
            kind: 'kana',
            course: 'JPD113',
          },
          {
            id: 'm3-kata-name',
            title: 'Viết tên bạn + 5 tên bạn bè bằng katakana',
            detail:
              'Câu ĐẦU TIÊN giám thị hỏi là おなまえは？ mà giáo trình lại không dạy viết tên người Việt. ' +
              'Mở mục tra tên ở khu Thi nói: Cường → クオン. Viết ra giấy, đọc to 10 lần.',
            minutes: 20,
            tier: 'core',
            kind: 'kana',
            course: 'JPD113',
          },
          {
            id: 'm3-kata-listen',
            title: 'Nghe 20 từ katakana, đoán nghĩa',
            detail:
              'Từ ngoại lai nghe qua tiếng Nhật méo đi rất nhiều (McDonald → マクドナルド). ' +
              'Luyện tai với nhóm này trước vì nghĩa thì bạn đã biết sẵn — chỉ cần quen ÂM.',
            minutes: 20,
            tier: 'core',
            kind: 'listening',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd3-b3',
        label: 'Khối 3 · Đọc tiếp',
        goal: 'Cộng dồn bài đọc, không để tới cuối tháng mới học',
        tasks: [
          {
            id: 'd2-speak-read345',
            title: 'Bài đọc 3 & 4 — thêm hai bài',
            detail:
              'Bài 3 có 61才 = ろくじゅう いっ さい (có っ!) — đúng thứ vừa học hôm qua. ' +
              'Bài 4 cùng khuôn với bài 2, chỉ đổi tên và sở thích.',
            minutes: 25,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
        ],
      },
    ],
  },
  {
    n: 4,
    phase: 1,
    title: 'Nhịp đọc — thôi đọc rời từng chữ',
    mission:
      'Hôm nay chữa đúng lỗi giám thị đã trừ điểm: "đọc từng chữ, không thành câu". ' +
      'Cách chữa là học LUẬT NGẮT — tiếng Nhật ngắt theo cụm, và cụm có quy tắc rõ ràng.',
    outcome:
      'Đọc một bài với dấu ngắt tự đánh, mỗi cụm một hơi, nghe lại thấy ra câu chứ không ra chuỗi chữ.',
    blocks: [
      {
        id: 'd4-b1',
        label: 'Khối 1 · Luật ngắt cụm',
        goal: 'Kỹ thuật, không phải cảm tính',
        tasks: [
          {
            id: 'm4-chunk-rule',
            title: 'Học luật ngắt: ngắt SAU trợ từ, không ngắt giữa từ',
            detail:
              'Bốn luật: (1) ngắt sau は・も・を・に・で・へ・と khi hết một cụm; (2) ngắt ở dấu 、và 。; ' +
              '(3) KHÔNG ngắt giữa một từ (会社員 đọc liền, không phải 会社 / 員); ' +
              '(4) từ để hỏi + です đọc liền một hơi. ' +
              'Ví dụ: わたしは / にほんごがっこうの / がくせいです。 — ba hơi, không phải mười lăm.',
            minutes: 30,
            tier: 'core',
            kind: 'reading',
            course: 'JPD113',
          },
          {
            id: 'm4-mora-count',
            title: 'Đếm nhịp 20 từ khó',
            detail:
              'がっこう 4 nhịp · とうきょう 5 · きって 3 · しんぶん 4 · びょういん 5 · せんせい 4 · ' +
              'コーヒー 4 · いっさい 4. Vỗ tay từng nhịp. Đọc đúng nhịp thì tự khắc đúng っ và trường âm.',
            minutes: 25,
            tier: 'core',
            kind: 'kana',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd4-b2',
        label: 'Khối 2 · Áp dụng',
        goal: 'Ngắt thật trên bài thật',
        tasks: [
          {
            id: 'm4-read-chunk1',
            title: 'Khu Đọc to — bài 1, 2, 3 theo từng cụm',
            detail:
              'Mở khu "Đọc to", bật hiện furigana. Bấm nghe TỪNG CỤM rồi đọc nhại lại ngay cụm đó. ' +
              'Xong hết cụm mới ghép cả bài. Đây là cách duy nhất phá được thói đọc rời từng chữ.',
            minutes: 30,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
          {
            id: 'm4-record-compare',
            title: 'Ghi âm rồi so với bản đọc mẫu',
            detail:
              'Nghe mẫu → đọc → ghi âm → mở hai file nghe nối tiếp. So ba thứ: chỗ ngắt, độ dài trường âm, ' +
              'và っ có im được một nhịp không. Ghi ra ba lỗi lớn nhất vào sổ.',
            minutes: 25,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
          {
            id: 'm4-listen-slow',
            title: 'Nghe bài đọc ở tốc độ 0,7× rồi 1,0×',
            detail:
              'Nghe chậm để bắt từng âm, nghe tốc độ thật để quen nhịp. Đừng nhìn chữ ở lượt đầu.',
            minutes: 20,
            tier: 'plus',
            kind: 'listening',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd4-b3',
        label: 'Khối 3 · Từ vựng nền',
        goal: 'Bắt đầu tích vốn từ — thứ không nhồi được',
        tasks: [
          {
            id: 'd2-vocab-time',
            title: '40 từ chủ đề thời gian & sinh hoạt',
            detail:
              'あさ, ひる, よる, まいにち, まいばん, ごぜん, ごご, いま, きょう, あした, きのう… ' +
              'Nhóm này ra đề dày nhất vì nó dính cả vào phần số lẫn phần động từ.',
            minutes: 20,
            tier: 'core',
            kind: 'vocab',
            course: 'JPD113',
            links: [{ label: 'My Language — từ vựng JPD113', href: ML_VOCAB }],
          },
        ],
      },
    ],
  },
  {
    n: 5,
    phase: 1,
    title: 'Đọc trơn 4 bài đầu',
    mission:
      'Gom thành quả 4 ngày: đọc trơn bài 1-4 với nhịp đúng, và nghe 10 câu hỏi giám thị đầu tiên.',
    outcome: 'Bốn bài đọc dưới 40 giây mỗi bài, không vấp quá 2 chỗ, người khác nghe hiểu được.',
    blocks: [
      {
        id: 'd5-b1',
        label: 'Khối 1 · Đọc',
        goal: 'Trơn, không phải nhanh',
        tasks: [
          {
            id: 'm5-read-1-4',
            title: 'Đọc bài 1→4 liên tục, 3 lượt',
            detail:
              'Lượt 1 nhìn furigana. Lượt 2 tắt furigana. Lượt 3 tắt cả dấu ngắt, tự ngắt lấy. ' +
              'Chỉ chuyển lượt khi lượt trước không vấp.',
            minutes: 45,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
          {
            id: 'm5-read-30s',
            title: 'Bấm giờ từng bài',
            detail:
              'Ghi lại thời gian mỗi bài vào sổ. Mỗi tuần đọc lại và so — con số giảm dần là bằng chứng khách quan ' +
              'rằng bạn tiến bộ, thứ mà cảm giác chủ quan không cho bạn biết.',
            minutes: 20,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd5-b2',
        label: 'Khối 2 · Mở tai với câu hỏi thi',
        goal: 'Bắt đầu sớm — nghe cần 30 ngày, không cần 3 ngày',
        tasks: [
          {
            id: 'm5-listen-q1-10',
            title: 'Nghe 10 câu hỏi đầu trong ngân hàng 22 câu',
            detail:
              'CHỈ NGHE, chưa cần trả lời. Nghe mỗi câu 5 lần: 2 lần không nhìn chữ, 1 lần nhìn chữ, ' +
              '2 lần lại không nhìn. Mục tiêu hôm nay chỉ là nhận ra "câu này hỏi gì" — chưa cần đáp.',
            minutes: 25,
            tier: 'core',
            kind: 'listening',
            course: 'JPD113',
          },
          {
            id: 'd2-speak-group1',
            title: 'Nhóm 1 — câu hỏi thông tin cá nhân',
            detail:
              'おなまえは？ おくには どちらですか。おしごとは？ — trả lời bằng chính hồ sơ bạn đã điền. ' +
              'Nói to, không lẩm nhẩm. Nhóm này chắc chắn được hỏi.',
            minutes: 25,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd5-b3',
        label: 'Khối 3 · Giữ kana',
        goal: 'Kana rơi rất nhanh nếu bỏ vài ngày',
        tasks: [
          {
            id: 'm5-kana-blind',
            title: 'Viết CẢ HAI bảng ra giấy trắng',
            detail:
              'Hiragana rồi katakana, không nhìn mẫu, bấm giờ. Ghi lại số ô sai và thời gian. ' +
              'Chuẩn để qua giai đoạn 1: sai ≤ 3 ô, dưới 12 phút.',
            minutes: 20,
            tier: 'core',
            kind: 'kana',
            course: 'JPD113',
          },
        ],
      },
    ],
  },
  {
    n: 6,
    phase: 1,
    title: 'KIỂM TRA GIAI ĐOẠN 1',
    mission:
      'Hôm nay không học cái mới. Kiểm tra thật, chấm thật, và vá đúng chỗ hổng. ' +
      'Không qua bài kiểm tra thì ở lại thêm một ngày — đi tiếp với nền thủng là lặp lại đúng lần trước.',
    outcome:
      'Đạt cả 3 chuẩn: kana sai ≤3 ô · đọc 4 bài không vấp quá 2 chỗ/bài · nghe-gõ 20 âm đúng ≥18.',
    blocks: [
      {
        id: 'd6-b1',
        label: 'Khối 1 · Ba bài kiểm tra',
        goal: 'Chấm bằng con số, không bằng cảm giác',
        tasks: [
          {
            id: 'm6-test-kana',
            title: 'Kiểm tra 1 — viết hai bảng kana',
            detail: 'Bấm giờ, giấy trắng. Ghi số ô sai. CHUẨN: sai ≤ 3.',
            minutes: 30,
            tier: 'core',
            kind: 'review',
            course: 'JPD113',
          },
          {
            id: 'm6-test-read',
            title: 'Kiểm tra 2 — đọc 4 bài, ghi âm, tự chấm',
            detail:
              'Chấm theo 4 tiêu chí, mỗi tiêu chí 0-2 điểm: (a) đọc đúng âm; (b) っ và trường âm đúng độ dài; ' +
              '(c) ngắt theo cụm; (d) không dừng quá 2 giây ở đâu. CHUẨN: ≥6/8.',
            minutes: 30,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
          {
            id: 'm6-test-listen',
            title: 'Kiểm tra 3 — nghe 20 âm, gõ kana',
            detail: 'Khu Nghe hiểu → Chính tả kana, 20 câu có cả biến âm, âm ghép, っ. CHUẨN: ≥18/20.',
            minutes: 20,
            tier: 'core',
            kind: 'listening',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd6-b2',
        label: 'Khối 2 · Vá lỗ hổng',
        goal: 'Học lại đúng chỗ sai, không học lại tất cả',
        tasks: [
          {
            id: 'm6-gap',
            title: 'Học lại đúng những chữ/luật đã sai',
            detail:
              'Lấy danh sách ô sai ở bài kiểm tra 1 và chỗ vấp ở bài 2. Với mỗi mục: viết 10 lần, đọc to 10 lần, ' +
              'tìm 3 từ có chứa nó. Đừng học lại cả bảng — thời gian phải rơi vào đúng chỗ thủng.',
            minutes: 40,
            tier: 'core',
            kind: 'review',
            course: 'JPD113',
          },
          {
            id: 'm6-plan',
            title: 'Tổng kết giai đoạn — viết ra 3 dòng',
            detail:
              'Ba dòng thôi: (1) thứ đã chắc; (2) thứ còn run; (3) một việc sẽ làm khác đi ở giai đoạn 2. ' +
              'Giữ lại để cuối tháng đọc lại.',
            minutes: 15,
            tier: 'core',
            kind: 'review',
            course: 'JPD113',
          },
        ],
      },
    ],
  },

  /* ═══════════ GIAI ĐOẠN 2 · SỐ, GIỜ & LỖ TAI ═══════════ */
  {
    n: 7,
    phase: 2,
    title: 'Số đếm — và những chỗ bất quy tắc',
    mission:
      'Số là chỗ mất điểm số một trong 420 câu FE, và cũng là chỗ đứng hình giữa câu khi đọc to. ' +
      'Hôm nay đóng đinh nó.',
    outcome: 'Đọc bất kỳ số nào từ 1 tới 99.999 không nghĩ, và nghe số người khác đọc thì viết ra được.',
    blocks: [
      {
        id: 'd7-b1',
        label: 'Khối 1 · Số',
        goal: '1 → 99.999',
        tasks: [
          {
            id: 'd2-num-basic',
            title: 'Số 1-10 và ba chữ có HAI cách đọc',
            detail:
              '4 = よん hoặc し · 7 = なな hoặc しち · 9 = きゅう hoặc く. ' +
              'Luật ngầm: đứng một mình dùng よん・なな・きゅう; ghép với đơn vị thì tuỳ đơn vị (4時 = よじ, 7時 = しちじ, 9時 = くじ). ' +
              'Đây là nguồn của phần lớn lỗi đọc số.',
            minutes: 30,
            tier: 'core',
            kind: 'number',
            course: 'JPD113',
            links: [{ label: 'Academy — Số đếm đầy đủ', href: lesson('jpd113-so-dem-day-du') }],
          },
          {
            id: 'd2-num-big',
            title: 'Hàng chục, trăm, nghìn — và 6 chỗ biến âm',
            detail:
              '300 = さんびゃく (không phải さんひゃく) · 600 = ろっぴゃく · 800 = はっぴゃく · ' +
              '3000 = さんぜん · 8000 = はっせん. Sáu chỗ này là bẫy cố định, học thuộc như học bảng cửu chương.',
            minutes: 25,
            tier: 'core',
            kind: 'number',
            course: 'JPD113',
          },
          {
            id: 'm7-counter-tsu',
            title: 'Bộ đếm ひとつ〜とお',
            detail:
              'ひとつ ふたつ みっつ よっつ いつつ むっつ ななつ やっつ ここのつ とお. ' +
              'Bộ này hoàn toàn bất quy tắc, dùng để đếm đồ vật chung, và xuất hiện trong bài đọc 7 (ビールを2つ) lẫn bộ tranh.',
            minutes: 25,
            tier: 'core',
            kind: 'number',
            course: 'JPD113',
            links: [{ label: 'Academy — Đếm & tăng', href: lesson('jpd113-dem-tang') }],
          },
        ],
      },
      {
        id: 'd7-b2',
        label: 'Khối 2 · Nghe số',
        goal: 'Đọc được số ≠ nghe được số',
        tasks: [
          {
            id: 'm7-num-listen',
            title: 'Nghe 30 số, viết ra chữ số',
            detail:
              'Khu Nghe hiểu → bộ Số. Nghe ろくじゅうはっさい thì viết "68 tuổi". ' +
              'Đây là dạng câu hỏi giám thị hay dùng nhất trong bộ tranh (なんさいですか, いくらですか).',
            minutes: 25,
            tier: 'core',
            kind: 'listening',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd7-b3',
        label: 'Khối 3 · Đọc tiếp',
        goal: 'Bài 6, 7, 8',
        tasks: [
          {
            id: 'd3-speak-read678',
            title: 'Bài đọc 6, 7, 8 — hai bài hội thoại',
            detail:
              'Bài 6 và 8 là hội thoại: đổi giọng nhẹ giữa hai vai để giám thị nghe ra. ' +
              'Bài 7 là bài dài nhất và khó nhất về từ ngữ (kính ngữ nhà hàng) — học nó như một khối âm thanh, đừng phân tích ngữ pháp.',
            minutes: 25,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
            links: [{ label: 'Academy — Bài đọc 8-13', href: lesson('jpd113-speaking-doc-8-13') }],
          },
        ],
      },
    ],
  },
  {
    n: 8,
    phase: 2,
    title: 'Giờ & phút',
    mission: 'Bảng giờ và bảng phút — hai bảng bất quy tắc phải thuộc như bảng cửu chương.',
    outcome: 'Nhìn đồng hồ bất kỳ nói ra giờ trong 2 giây; nghe giờ thì vẽ được kim đồng hồ.',
    blocks: [
      {
        id: 'd8-b1',
        label: 'Khối 1 · Giờ',
        goal: 'Ba giờ bất quy tắc',
        tasks: [
          {
            id: 'd2-time-hour',
            title: 'Bảng giờ 1→12 — nhớ kỹ 4時, 7時, 9時',
            detail:
              '4時 = よじ (KHÔNG bao giờ よんじ hay しじ) · 7時 = しちじ · 9時 = くじ. ' +
              'Ba chữ này sai nhiều nhất, và bài đọc 5, 9, 12 đều dính cả ba.',
            minutes: 30,
            tier: 'core',
            kind: 'number',
            course: 'JPD113',
            links: [{ label: 'Academy — Ngày, giờ, tuổi', href: lesson('jpd113-ngay-gio-tuoi') }],
          },
          {
            id: 'd2-time-min',
            title: 'Bảng phút — ふん hay ぷん?',
            detail:
              'ぷん sau 1, 3, 4, 6, 8, 10 (いっぷん, さんぷん, よんぷん, ろっぷん, はっぷん, じゅっぷん); ' +
              'ふん sau 2, 5, 7, 9 (にふん, ごふん, ななふん, きゅうふん). Chú ý っ ở いっぷん, ろっぷん, はっぷん, じゅっぷん.',
            minutes: 30,
            tier: 'core',
            kind: 'number',
            course: 'JPD113',
          },
          {
            id: 'd2-time-drill',
            title: 'Luyện 30 mốc giờ ngẫu nhiên',
            detail:
              'Tự viết 30 mốc giờ ra giấy (7:15, 4:30, 9:08…) rồi đọc to từng cái, bấm giờ. ' +
              'ごぜん = sáng, ごご = chiều, はん = rưỡi.',
            minutes: 25,
            tier: 'core',
            kind: 'number',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd8-b2',
        label: 'Khối 2 · Nghe giờ',
        goal: 'Câu hỏi なんじですか chắc chắn có trong bộ tranh',
        tasks: [
          {
            id: 'm8-time-listen',
            title: 'Nghe 25 mốc giờ và viết ra',
            detail:
              'Nghe ろくじはん → viết 6:30. Trộn cả ごぜん/ごご. ' +
              'Làm tới khi sai dưới 3 câu.',
            minutes: 25,
            tier: 'core',
            kind: 'listening',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd8-b3',
        label: 'Khối 3 · Đọc bài nhiều số nhất',
        goal: 'Bài 5 — nơi mọi thứ vừa học gặp nhau',
        tasks: [
          {
            id: 'm8-read-5',
            title: 'Bài đọc 5 — bài dồn đủ mọi loại số',
            detail:
              'Thứ trong tuần + ごぜん9時 (くじ) + ごご5時はん + から…まで hai lần + ba trợ từ nơi chốn. ' +
              'MẸO: trước khi đọc, khoanh mọi con số và đọc thầm chúng một lượt — 10 giây đó ngăn được cú đứng hình giữa câu.',
            minutes: 25,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
        ],
      },
    ],
  },
  {
    n: 9,
    phase: 2,
    title: 'Ngày, thứ, tuổi',
    mission: 'Ngày mùng 1-10 và mùng 20 hoàn toàn bất quy tắc. Đây là bảng phải học thuộc lòng, không có mẹo.',
    outcome: 'Nói được ngày sinh của mình, hôm nay là thứ mấy ngày mấy, và tuổi — không cần nghĩ.',
    blocks: [
      {
        id: 'd9-b1',
        label: 'Khối 1 · Lịch',
        goal: 'Tháng, ngày, thứ',
        tasks: [
          {
            id: 'd2-date-month',
            title: '12 tháng — 3 tháng bất quy tắc',
            detail:
              'Tháng = số + がつ. Bất quy tắc: 4月 しがつ · 7月 しちがつ · 9月 くがつ. ' +
              'Để ý: tháng dùng し/しち/く, khác với cách đọc số đứng một mình.',
            minutes: 25,
            tier: 'core',
            kind: 'number',
            course: 'JPD113',
          },
          {
            id: 'd2-date-day',
            title: 'Ngày 1-10 và 20 — bảng bất quy tắc nhất',
            detail:
              'ついたち ふつか みっか よっか いつか むいか なのか ようか ここのか とおか … はつか (20). ' +
              'Từ 11 trở đi thì đều: 11日 じゅういちにち. Học thuộc 11 mục bất quy tắc này, không có đường tắt.',
            minutes: 30,
            tier: 'core',
            kind: 'number',
            course: 'JPD113',
          },
          {
            id: 'd2-date-week',
            title: '7 thứ trong tuần',
            detail:
              '月火水木金土日 + ようび. Mẹo Hán-Việt: NGUYỆT HOẢ THUỶ MỘC KIM THỔ NHẬT — đúng thứ tự thứ 2 đến Chủ Nhật. ' +
              'Người Việt học phần này nhanh hơn hẳn người phương Tây, hãy tận dụng.',
            minutes: 20,
            tier: 'core',
            kind: 'number',
            course: 'JPD113',
            links: [{ label: 'Academy — Thứ trong tuần', href: lesson('jpd113-youbi') }],
          },
          {
            id: 'd2-date-age',
            title: 'Tuổi — さい và ngoại lệ はたち',
            detail:
              '20 tuổi = はたち (KHÔNG phải にじゅっさい) — xuất hiện ở bài đọc 1 và 9. ' +
              'Có っ: 1才 いっさい, 8才 はっさい, 10才 じゅっさい.',
            minutes: 20,
            tier: 'core',
            kind: 'number',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd9-b2',
        label: 'Khối 2 · Nghe & đọc',
        goal: 'Áp vào bài khó nhất ngân hàng',
        tasks: [
          {
            id: 'm9-date-listen',
            title: 'Nghe 25 câu về ngày/thứ/tuổi',
            detail:
              'きょうは なんようびですか · おたんじょうびは いつですか · なんさいですか — ' +
              'ba câu này giám thị hỏi rất thường. Nghe và trả lời ngay, không viết.',
            minutes: 25,
            tier: 'core',
            kind: 'listening',
            course: 'JPD113',
          },
          {
            id: 'm9-read-9',
            title: 'Bài đọc 9 — MỌI SỐ VIẾT BẰNG KANJI',
            detail:
              'Bài khó nhất ngân hàng: 九時 (くじ), 四時 (よじ), 三つ (みっつ), 三時間 (さんじかん), 七時 (しちじ), ' +
              '十一時 (じゅういちじ), 一日 (いちにち), はたち. Khoanh hết kanji số, đọc thầm chúng, rồi mới đọc cả bài.',
            minutes: 30,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
        ],
      },
    ],
  },
  {
    n: 10,
    phase: 2,
    title: 'Tiền, đếm đồ vật & đề FE đầu tiên',
    mission:
      'Nốt phần số: tiền và các bộ đếm. Rồi làm ĐỀ FE ĐẦU TIÊN — sớm, để biết mình đang ở đâu, ' +
      'chứ không phải để lấy điểm.',
    outcome: 'Nói được giá tiền tới hàng triệu; làm xong 1 đề FE và có sổ lỗi với ít nhất 10 mục.',
    blocks: [
      {
        id: 'd10-b1',
        label: 'Khối 1 · Tiền & bộ đếm',
        goal: 'Phần cuối của mảng số',
        tasks: [
          {
            id: 'd2-num-money',
            title: 'Tiền: えん, まん và cách đọc giá Việt Nam',
            detail:
              '1万 = いちまん (10.000 — tiếng Nhật đếm theo VẠN, không theo nghìn). ' +
              '550.000 đồng = ごじゅうごまんドン. Bộ tranh thi nói có câu いくらですか nên phải nói được giá.',
            minutes: 25,
            tier: 'core',
            kind: 'number',
            course: 'JPD113',
            links: [{ label: 'Academy — Tiền & giá cả', href: lesson('jpd113-tien-gia-ca') }],
          },
          {
            id: 'm10-counters',
            title: 'Bộ đếm hay gặp: 人 · 枚 · 本 · 冊 · 台 · つ',
            detail:
              '人 đếm người (ひとり, ふたり, さんにん — hai cái đầu bất quy tắc!) · 枚 đếm vật mỏng · ' +
              '本 đếm vật dài · 冊 đếm sách · 台 đếm máy móc. Bài đọc 7 có 三人 (さんにん) và 2つ.',
            minutes: 30,
            tier: 'core',
            kind: 'number',
            course: 'JPD113',
          },
          {
            id: 'm10-listen-price',
            title: 'Nghe 20 câu giá tiền & số lượng',
            detail: 'Nghe rồi viết ra chữ số. Số lớn tiếng Nhật rất dễ nghe sót một hàng.',
            minutes: 20,
            tier: 'plus',
            kind: 'listening',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd10-b2',
        label: 'Khối 2 · Đề FE đầu tiên',
        goal: 'Đo mức xuất phát, không phải để buồn',
        tasks: [
          {
            id: 'd2-exam-quiz',
            title: 'Quiz số & thời gian trong Academy',
            detail: 'Làm trước để chắc phần số, rồi mới vào đề tổng hợp.',
            minutes: 25,
            tier: 'core',
            kind: 'exam',
            course: 'JPD113',
            links: [{ label: 'Academy — Quiz số & thời gian', href: lesson('jpd113-quiz-so') }],
          },
          {
            id: 'd2-exam-d1',
            title: 'Đề FE số 1 — làm THẬT, bấm giờ 45 phút',
            detail:
              'Điểm hôm nay không quan trọng, kể cả 3/10 cũng bình thường vì mới học 10 ngày. ' +
              'Việc QUAN TRỌNG là sau khi chấm: mỗi câu sai chép vào sổ lỗi kèm LÝ DO sai ' +
              '(không biết từ / không biết trợ từ / đọc sai kanji / hiểu sai câu). Phân loại lý do là thứ chỉ cho bạn học gì tiếp.',
            minutes: 45,
            tier: 'core',
            kind: 'exam',
            course: 'JPD113',
            links: [{ label: 'Phòng thi — 14 đề FE thật', href: EXAM_FE }],
          },
          {
            id: 'd2-exam-review',
            title: 'Lập SỔ LỖI — biến đề vừa sai thành danh sách việc cần học',
            detail:
              'Đây là việc quan trọng hơn cả bản thân đề. Mỗi câu sai chép một dòng: câu hỏi — đáp án đúng — ' +
              'vì sao mình chọn sai. Cuốn sổ này sẽ theo bạn suốt 20 ngày còn lại và là tài liệu ' +
              'giá trị nhất bạn có, vì nó là danh sách đúng những lỗi CỦA BẠN chứ không phải của người khác.',
            minutes: 25,
            tier: 'core',
            kind: 'review',
            course: 'JPD113',
          },
        ],
      },
    ],
  },
  {
    n: 11,
    phase: 2,
    title: 'Tai nghe câu hỏi thi — và JPD123 bắt đầu',
    mission:
      'Ngày quan trọng nhất của giai đoạn 2. Lần thi trước mất điểm nói vì KHÔNG NGHE HIỂU câu hỏi. ' +
      'Hôm nay bắt đầu mạch riêng cho việc đó, và mở môn JPD123.',
    outcome:
      'Nghe 22 câu hỏi giám thị mà nhận ra câu nào là câu nào, không cần nhìn chữ. Hiểu 8 mệnh lệnh lớp học.',
    blocks: [
      {
        id: 'd11-b1',
        label: 'Khối 1 · Nghe câu hỏi thi',
        goal: 'Nhận diện trước, trả lời sau',
        tasks: [
          {
            id: 'm11-listen-q22',
            title: 'Nghe trọn 22 câu hỏi — 3 lượt',
            detail:
              'Lượt 1: nghe + nhìn chữ + nhìn nghĩa. Lượt 2: nghe + nhìn chữ. Lượt 3: CHỈ NGHE, nói ra nghĩa tiếng Việt. ' +
              'Chưa cần trả lời bằng tiếng Nhật — hôm nay chỉ cần HIỂU người ta hỏi gì. ' +
              'Đây đúng là chỗ bạn mất điểm: nhìn chữ thì hiểu, nghe thì không.',
            minutes: 35,
            tier: 'core',
            kind: 'listening',
            course: 'JPD113',
          },
          {
            id: 'm11-listen-class',
            title: '8 mệnh lệnh lớp học phải nghe hiểu ngay',
            detail:
              'きいて ください (hãy nghe) · よんで ください (hãy đọc) · かいて ください (hãy viết) · ' +
              'みて ください (hãy nhìn) · いって ください (hãy nói) · もう いちど (một lần nữa) · ' +
              'ゆっくり (chậm thôi) · わかりますか (hiểu không?). ' +
              'Vào kỳ, cô giáo nói những câu này cả buổi — nghe hiểu chúng là bạn theo được lớp.',
            minutes: 25,
            tier: 'core',
            kind: 'listening',
            course: 'JPD113',
          },
          {
            id: 'm11-rescue',
            title: '4 câu cứu hộ khi không nghe kịp',
            detail:
              'もう いちど おねがいします (xin nhắc lại) · すみません、わかりません (xin lỗi, tôi không hiểu) · ' +
              'ゆっくり おねがいします (xin nói chậm) · ちょっと まって ください (đợi một chút). ' +
              'HỎI LẠI KHÔNG BỊ TRỪ ĐIỂM — im lặng mới bị. Lần trước bạn ngồi im; lần này có câu để nói.',
            minutes: 15,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd11-b2',
        label: 'Khối 2 · JPD123 mở màn',
        goal: 'A1.2 bắt đầu từ động từ',
        tasks: [
          {
            id: 'j11-masu',
            title: 'JPD123 — động từ và thể ます',
            detail:
              'Bốn dạng: ます (hiện tại/tương lai) · ません (phủ định) · ました (quá khứ) · ませんでした (quá khứ phủ định). ' +
              'Đây là xương sống cả môn A1.2. Học một lần cho chắc, mọi chương sau đều dùng lại.',
            minutes: 35,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Thể ます', href: lesson123('jpd123-dong-tu-masu') }],
          },
          {
            id: 'd3-vocab-daily',
            title: '40 từ sinh hoạt hằng ngày',
            detail:
              'たべます, のみます, いきます, みます, ききます, よみます, かきます, します, ねます, おきます… ' +
              'Nhóm động từ ます trung bình xuất hiện 90 lần/từ trong kho đề — gấp đôi nhóm hạng nhì, mà chỉ có 14 từ. ' +
              'Đây là nhóm đáng học nhất trên mỗi phút bỏ ra.',
            minutes: 25,
            tier: 'core',
            kind: 'vocab',
            course: 'JPD113',
          },
        ],
      },
    ],
  },
  {
    n: 12,
    phase: 2,
    title: 'KIỂM TRA GIAI ĐOẠN 2',
    mission: 'Chốt mảng số và đo lỗ tai. Rồi học tiếp trợ từ chuyển động của JPD123.',
    outcome: 'Nghe 30 câu số/giờ/ngày đúng ≥25; đọc bài 5 và 9 không vấp số nào.',
    blocks: [
      {
        id: 'd12-b1',
        label: 'Khối 1 · Kiểm tra',
        goal: 'Số và tai',
        tasks: [
          {
            id: 'm12-test-number',
            title: 'Kiểm tra — 40 mục số/giờ/ngày/tuổi/tiền',
            detail:
              'Tự ra đề: 10 mốc giờ, 10 ngày tháng, 10 tuổi/số lượng, 10 giá tiền. Đọc to từng cái, bấm giờ. ' +
              'CHUẨN: sai ≤ 4 và dưới 5 phút.',
            minutes: 30,
            tier: 'core',
            kind: 'review',
            course: 'JPD113',
          },
          {
            id: 'm12-test-listen',
            title: 'Kiểm tra nghe — 30 câu trộn',
            detail: 'Trộn số, giờ, ngày, câu hỏi cá nhân. CHUẨN: ≥25/30. Dưới chuẩn thì thêm 10 phút nghe mỗi ngày ở giai đoạn 3.',
            minutes: 30,
            tier: 'core',
            kind: 'listening',
            course: 'JPD113',
          },
          {
            id: 'm12-read-check',
            title: 'Đọc lại bài 5 và bài 9 — không vấp số',
            detail: 'Hai bài dày số nhất. Ghi âm, nghe lại, đếm số chỗ vấp. CHUẨN: 0 lỗi số.',
            minutes: 25,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd12-b2',
        label: 'Khối 2 · Vá & đi tiếp',
        goal: 'JPD123 chương 2',
        tasks: [
          {
            id: 'm12-gap',
            title: 'Vá đúng chỗ sai của bài kiểm tra',
            detail: 'Lấy danh sách sai, học lại riêng từng mục. Viết 10 lần, đọc to 10 lần.',
            minutes: 40,
            tier: 'core',
            kind: 'review',
            course: 'JPD113',
          },
          {
            id: 'j12-particles',
            title: 'JPD123 — trợ từ chuyển động へ・で・を・に',
            detail:
              'へ đích đến (がっこうへ いきます) · で nơi diễn ra hành động (がっこうで べんきょうします) · ' +
              'を tân ngữ (ごはんを たべます) · に mốc thời gian và điểm đến. ' +
              'Cặp đối chiếu kinh điển: 会社に いきます ≠ 会社で はたらきます — đúng bài đọc 10.',
            minutes: 30,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Trợ từ', href: lesson123('jpd123-tro-tu') }],
          },
        ],
      },
    ],
  },

  /* ═══════════ GIAI ĐOẠN 3 · NGỮ PHÁP LÕI + KANJI ═══════════ */
  {
    n: 13,
    phase: 3,
    title: 'Trợ từ は・も・の・か + học DỊCH',
    mission:
      'Bắt đầu mảng "không hiểu câu FE dịch ra gì". Cách chữa không phải học thêm từ — mà là học ĐỌC CẤU TRÚC: ' +
      'nhìn ra chủ ngữ, trợ từ, vị ngữ rồi mới ghép nghĩa.',
    outcome: 'Dịch được 10 câu FE bằng cách tách từng cụm, không đoán mò.',
    blocks: [
      {
        id: 'd13-b1',
        label: 'Khối 1 · Bốn trợ từ nền',
        goal: 'Khung câu tiếng Nhật',
        tasks: [
          {
            id: 'd3-part-wa',
            title: 'は chủ đề · も "cũng" · の sở hữu',
            detail:
              'AはBです = "A thì là B". も thay chỗ は khi nói "cũng" (わたしも がくせいです). ' +
              'の nối hai danh từ theo thứ tự NGƯỢC tiếng Việt: わたしの ほん = sách CỦA TÔI, にほんごの ほん = sách TIẾNG NHẬT.',
            minutes: 30,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD113',
            links: [{ label: 'Academy — Ngữ pháp chương 3', href: lesson('jpd113-nguphap-chuong3') }],
          },
          {
            id: 'd3-part-to',
            title: 'と "và" · や "…, …vân vân" · か "hay"',
            detail:
              'と liệt kê ĐẦY ĐỦ (AとB = chỉ A và B) · や liệt kê VÍ DỤ (AやB = A, B và những thứ khác) · ' +
              'AかB = A hay B. Bài 9 có ベトナム人や中国人など — đúng mẫu や…など.',
            minutes: 20,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD113',
            links: [{ label: 'Academy — と, や, など', href: lesson('jpd113-to-ya-nado') }],
          },
          {
            id: 'd3-kochira',
            title: 'こちら · どこの · なんの — ba mẫu hay ra đề',
            detail:
              'こちらは…です (giới thiệu người, lịch sự) · どこのですか (của hãng/nước nào) · なんのですか (thuộc loại gì). ' +
              'Bộ tranh có cả ba: そのけいたいでんわはなんのですか。→ ノキアのけいたいでんわです。',
            minutes: 20,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD113',
            links: [{ label: 'Academy — こちら, どこの, なんの', href: lesson('jpd113-kochira-dokono-nanno') }],
          },
        ],
      },
      {
        id: 'd13-b2',
        label: 'Khối 2 · Kỹ thuật DỊCH câu',
        goal: 'Chữa đúng lỗi "khoanh mò vì không hiểu"',
        tasks: [
          {
            id: 'm13-fe-translate',
            title: 'Dịch 10 câu FE theo QUY TRÌNH 4 BƯỚC',
            detail:
              'Quy trình cho MỌI câu tiếng Nhật: (1) khoanh tròn mọi trợ từ は も を に で へ と の か; ' +
              '(2) chữ cuối câu là vị ngữ — です hay ～ます? (3) đọc từ CUỐI câu về đầu để lấy nghĩa; ' +
              '(4) ghép lại thành tiếng Việt. Áp dụng cho 10 câu trong khu "Đề thi & mục tiêu" → ngân hàng 55 câu điền chỗ trống. ' +
              'Làm chậm, viết ra giấy. Đây là kỹ năng, luyện được, và nó chính là thứ đã thiếu.',
            minutes: 35,
            tier: 'core',
            kind: 'reading',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd13-b3',
        label: 'Khối 3 · JPD123',
        goal: 'Tính từ',
        tasks: [
          {
            id: 'j13-adj',
            title: 'JPD123 — tính từ い và tính từ な',
            detail:
              'Hai loại tính từ chia khác nhau: たかい (い) → たかくない; きれいな (な) → きれいじゃない. ' +
              'Nhận diện: đuôi い thì thường là tính từ い, nhưng きれい và ゆうめい là tính từ NA dù kết thúc bằng い — hai ngoại lệ phải nhớ.',
            minutes: 30,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Tính từ', href: lesson123('jpd123-tinh-tu') }],
          },
        ],
      },
    ],
  },
  {
    n: 14,
    phase: 3,
    title: 'これ/それ/あれ và bộ từ để hỏi',
    mission: 'Hai nhóm này chiếm phần lớn câu hỏi trong bộ tranh thi nói — và cũng ra dày trong FE.',
    outcome: 'Nghe một câu hỏi là biết ngay nó hỏi VẬT, NGƯỜI, NƠI, LÚC hay GIÁ.',
    blocks: [
      {
        id: 'd14-b1',
        label: 'Khối 1 · Chỉ định',
        goal: 'これ ≠ この',
        tasks: [
          {
            id: 'd3-kore',
            title: 'これ/それ/あれ và この/その/あの',
            detail:
              'これ đứng MỘT MÌNH (これは ほんです) · この đi KÈM danh từ (この ほんは…). ' +
              'これ = gần người nói · それ = gần người nghe · あれ = xa cả hai. ' +
              'Lỗi kinh điển: nói この です — sai, phải これです.',
            minutes: 30,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD113',
            links: [{ label: 'Academy — この, その, あの', href: lesson('jpd113-kono-sono-ano') }],
          },
          {
            id: 'm14-kore-listen',
            title: 'Nghe 20 câu これ/それ/あれ',
            detail: 'Nghe rồi chỉ tay: người hỏi đang nói về vật ở đâu? Bài tập nhỏ nhưng đúng dạng câu hỏi tranh.',
            minutes: 20,
            tier: 'plus',
            kind: 'listening',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd14-b2',
        label: 'Khối 2 · Từ để hỏi',
        goal: 'Nhóm quyết định việc nghe hiểu câu hỏi',
        tasks: [
          {
            id: 'd3-question-words',
            title: 'なん · だれ · どこ · いつ · いくら · なんさい · どちら · どれ',
            detail:
              'Học theo cặp HỎI-ĐÁP chứ không học từ rời: どこですか → …です (nơi chốn); ' +
              'いくらですか → …えん/ドンです (giá); なんさいですか → …さいです (tuổi). ' +
              'Nhớ khuôn đáp thì nghe được từ hỏi là bật ra được câu trả lời.',
            minutes: 30,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD113',
            links: [{ label: 'Academy — Từ để hỏi', href: lesson('jpd113-tu-de-hoi') }],
          },
          {
            id: 'm14-fe-translate2',
            title: 'Dịch 10 câu FE tiếp theo — vẫn 4 bước',
            detail: 'Đừng bỏ bước khoanh trợ từ dù thấy câu quen. Thói quen mới cần ít nhất 10 ngày lặp lại.',
            minutes: 35,
            tier: 'core',
            kind: 'reading',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd14-b3',
        label: 'Khối 3 · JPD123',
        goal: 'Chia tính từ',
        tasks: [
          {
            id: 'j14-adj-4forms',
            title: 'JPD123 — chia tính từ đủ 4 dạng',
            detail:
              'たかい / たかくない / たかかった / たかくなかった. Tính từ な: しずかです / しずかじゃありません / ' +
              'しずかでした / しずかじゃありませんでした. Kẻ bảng 2×4, điền 10 tính từ.',
            minutes: 30,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Chia tính từ', href: lesson123('jpd123-tinh-tu-chia-4-dang') }],
          },
        ],
      },
    ],
  },
  {
    n: 15,
    phase: 3,
    title: 'Nghe ra từ để hỏi + trợ từ を・に・で・へ',
    mission:
      'Ngày luyện nghe nặng nhất từ đầu tới giờ. Nghe được TỪ ĐỂ HỎI là hiểu được 80% ý câu hỏi, ' +
      'kể cả khi không nghe rõ phần còn lại.',
    outcome: 'Nghe 40 câu hỏi trộn và chỉ ra đúng loại thông tin đang bị hỏi, đúng ≥35.',
    blocks: [
      {
        id: 'd15-b1',
        label: 'Khối 1 · Nghe từ để hỏi',
        goal: 'Chiến thuật nghe: bắt từ khoá, đừng cố nghe hết',
        tasks: [
          {
            id: 'm15-qword-listen',
            title: 'Nghe 40 câu — chỉ bắt TỪ ĐỂ HỎI',
            detail:
              'Chiến thuật: đừng cố nghe hết cả câu. Chỉ săn một trong tám từ なん/だれ/どこ/いつ/いくら/なんさい/どちら/どれ. ' +
              'Bắt được nó là biết phải trả lời loại thông tin gì, kể cả khi phần giữa nghe không rõ. ' +
              'Đây là chiến thuật cứu bạn ở phòng thi khi giám thị nói nhanh.',
            minutes: 35,
            tier: 'core',
            kind: 'listening',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd15-b2',
        label: 'Khối 2 · Trợ từ hành động',
        goal: 'Nhóm ra đề dày nhất ở dạng điền chỗ trống',
        tasks: [
          {
            id: 'd3-part-wo',
            title: 'を · に · で · へ — bốn trợ từ dễ nhầm nhất',
            detail:
              'を: tân ngữ (ほんを よみます) · に: mốc giờ & đích đến (7時に おきます / がっこうに いきます) · ' +
              'で: nơi diễn ra hành động & phương tiện (うちで たべます / バスで いきます) · へ: hướng đi. ' +
              '~70% câu FE là điền chỗ trống, và một phần lớn trong đó là điền đúng bốn chữ này.',
            minutes: 25,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD113',
            links: [{ label: 'Academy — Trợ từ を, に, で, へ', href: lesson('jpd113-tro-tu-wo-ni-de-e') }],
          },
          {
            id: 'd3-doko-mo',
            title: 'なにも / どこも + phủ định',
            detail:
              'なにも しません = không làm gì cả · どこも いきません = không đi đâu cả. ' +
              'CẢNH BÁO: đề thật số 8 in sai đáp án câu này (chọn どこ nhưng đúng phải là なに vì どこも đi với いきません). ' +
              'Nhớ luật, đừng nhớ đáp án đề.',
            minutes: 20,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD113',
          },
          {
            id: 'm15-fe-translate3',
            title: 'Dịch 10 câu FE — nhóm trợ từ',
            detail: 'Chọn đúng nhóm câu điền trợ từ. Dịch xong thì giải thích được VÌ SAO trợ từ đó đúng.',
            minutes: 30,
            tier: 'core',
            kind: 'reading',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd15-b3',
        label: 'Khối 3 · JPD123',
        goal: 'Từ chỉ mức độ',
        tasks: [
          {
            id: 'j15-degree',
            title: 'JPD123 — とても · あまり · すこし · ぜんぜん',
            detail:
              'あまり và ぜんぜん BẮT BUỘC đi với phủ định: あまり たかくないです (không đắt lắm), ' +
              'ぜんぜん わかりません (hoàn toàn không hiểu). Dùng với khẳng định là sai ngữ pháp.',
            minutes: 25,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Từ chỉ mức độ', href: lesson123('jpd123-tu-chi-muc-do') }],
          },
        ],
      },
    ],
  },
  {
    n: 16,
    phase: 3,
    title: 'Kanji — 35 chữ lõi',
    mission:
      'Chữ Hán là lỗi bị nêu đích danh ở bài thi đọc. Người Việt có lợi thế lớn ở đây: bạn ĐÃ BIẾT NGHĨA ' +
      'qua từ Hán-Việt, chỉ còn thiếu cách đọc.',
    outcome: 'Nhìn 35 chữ lõi đọc ra kana ngay; nói được nghĩa Hán-Việt của 28 từ ghép.',
    blocks: [
      {
        id: 'd16-b1',
        label: 'Khối 1 · 35 kanji lõi',
        goal: 'Theo tần suất trong 420 câu FE',
        tasks: [
          {
            id: 'd4-kanji-35',
            title: '35 kanji theo TẦN SUẤT ra đề',
            detail:
              'Xếp theo số lần xuất hiện thật trong kho đề: 私 (86) · 時 (66) · 何 (57) · 生 (38) · 才 (36) · 円 (29) … ' +
              'Học theo thứ tự này, không học theo thứ tự sách — 10 chữ đầu đã phủ phần lớn số lần xuất hiện.',
            minutes: 40,
            tier: 'core',
            kind: 'kanji',
            course: 'JPD113',
            links: [{ label: 'Academy — Kanji', href: lesson('jpd113-kanji') }],
          },
          {
            id: 'd4-kanji-onkun',
            title: 'Âm ON và âm KUN — vì sao một chữ nhiều cách đọc',
            detail:
              'ON = cách đọc mượn từ tiếng Hán, dùng khi ghép với kanji khác (日本 にほん). ' +
              'KUN = cách đọc thuần Nhật, dùng khi chữ đứng một mình (日 ひ). ' +
              'Luật ngầm: kanji đi liền kanji → thường đọc ON; kanji đi với hiragana → thường đọc KUN.',
            minutes: 30,
            tier: 'core',
            kind: 'kanji',
            course: 'JPD113',
            links: [{ label: 'Academy — Kanji số & thời gian', href: lesson('jpd113-kanji-so-thoi-gian') }],
          },
          {
            id: 'd4-drill-kanji',
            title: 'Khu Lật thẻ chữ Hán — 142 thẻ / 6 bộ',
            detail:
              'Mặt trước là MẶT CHỮ (đúng thứ chặn bạn khi đọc), lật ra mới hiện cách đọc → nghĩa → từ Hán-Việt. ' +
              'Chạy trắc nghiệm 3 chiều: chữ→đọc, chữ→nghĩa, đọc→chữ.',
            minutes: 25,
            tier: 'core',
            kind: 'kanji',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd16-b2',
        label: 'Khối 2 · Lợi thế Hán-Việt',
        goal: 'Dùng thứ bạn đã biết sẵn',
        tasks: [
          {
            id: 'm16-kanji-hanviet',
            title: '28 từ Hán-Việt — biết nghĩa rồi, chỉ học cách đọc',
            detail:
              '時間 THỜI GIAN = じかん · 銀行 NGÂN HÀNG = ぎんこう · 学生 HỌC SINH = がくせい · ' +
              '先生 TIÊN SINH = せんせい · 会社 HỘI XÃ (công ty) = かいしゃ. ' +
              'Bảng này ở mục Chữ Hán trong khu Bảng tra cứu. Với người Việt đây là phần dễ nhất của kanji.',
            minutes: 25,
            tier: 'core',
            kind: 'kanji',
            course: 'JPD113',
          },
          {
            id: 'j16-connect',
            title: 'JPD123 — liên từ が · しかし · そして · でも · それから',
            detail:
              'が và しかし = "nhưng" (が nối trong một câu, しかし mở câu mới) · ' +
              'そして/それから = "và rồi". Nhóm này biến câu cụt thành đoạn văn — đúng thứ cần cho phần nói JPD123.',
            minutes: 25,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Liên từ', href: lesson123('jpd123-lien-tu') }],
          },
        ],
      },
    ],
  },
  {
    n: 17,
    phase: 3,
    title: 'Kanji trong 13 bài đọc — khoá lại cách đọc',
    mission:
      'Kanji "chung chung" thì học mãi không hết. Hôm nay chỉ học đúng những chữ CÓ TRONG 13 bài đọc thi — ' +
      'tập hợp hữu hạn, học xong là hết vấp khi đọc to.',
    outcome: 'Đọc trơn cả 13 bài mà không cần furigana, không dừng ở chữ Hán nào.',
    blocks: [
      {
        id: 'd17-b1',
        label: 'Khối 1 · Kanji của chính đề thi',
        goal: 'Hữu hạn và có thể học hết',
        tasks: [
          {
            id: 'm17-kanji-in-readings',
            title: 'Liệt kê & thuộc mọi kanji trong 13 bài',
            detail:
              'Mở khu Đọc to, bật furigana, đi từng bài và chép ra giấy MỌI chữ Hán kèm cách đọc trong bài đó. ' +
              'Danh sách này ngắn hơn bạn tưởng (khoảng 45 chữ) và nó phủ 100% phần thi đọc. ' +
              'Học xong thì tắt furigana đọc lại.',
            minutes: 40,
            tier: 'core',
            kind: 'kanji',
            course: 'JPD113',
          },
          {
            id: 'm17-read-kanji-first',
            title: 'Thói quen 10 giây trước khi đọc: quét kanji',
            detail:
              'Giám thị đưa bài → ĐỪNG đọc ngay. Dành 10 giây quét cả bài, khoanh mọi kanji (nhất là kanji SỐ), ' +
              'đọc thầm chúng một lượt. Mười giây này ngăn được cú đứng hình giữa câu — thứ đã xảy ra lần trước. ' +
              'Luyện đúng thao tác này trên 5 bài.',
            minutes: 25,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd17-b2',
        label: 'Khối 2 · Động từ ます của JPD113',
        goal: 'Khép ngữ pháp A1.1',
        tasks: [
          {
            id: 'd3-masu',
            title: 'Thể ます — 4 dạng',
            detail:
              'たべます / たべません / たべました / たべませんでした. Bảng 4 ô này ra đề rất dày ' +
              'và cũng là thứ JPD123 xây tiếp lên.',
            minutes: 25,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD113',
            links: [{ label: 'Academy — Thể ます', href: lesson('jpd113-masu-form') }],
          },
          {
            id: 'd3-verbs-20',
            title: '20 động từ hay ra đề nhất',
            detail:
              'いきます, きます, かえります, たべます, のみます, みます, ききます, よみます, かきます, します, ' +
              'べんきょうします, はたらきます, おきます, ねます, あいます, かいます… Nhóm nhỏ, giá trị cao.',
            minutes: 25,
            tier: 'core',
            kind: 'vocab',
            course: 'JPD113',
            links: [{ label: 'Academy — Động từ thường gặp', href: lesson('jpd113-dong-tu-thuong-gap') }],
          },
          {
            id: 'j17-moiru',
            title: 'JPD123 — mời rủ ～ませんか và ～ましょう',
            detail:
              '～ませんか = "…không?" (mời, lịch sự hơn) · ～ましょう = "…nhé" (rủ, đã thống nhất). ' +
              'いっしょに たべませんか。→ ええ、たべましょう。 Cặp hỏi-đáp này gần như chắc chắn có trong thi nói JPD123.',
            minutes: 25,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Mời rủ', href: lesson123('jpd123-moi-ru') }],
          },
        ],
      },
    ],
  },
  {
    n: 18,
    phase: 3,
    title: 'KIỂM TRA GIAI ĐOẠN 3 + cày 3 đề FE',
    mission: 'Ngữ pháp và kanji đã đủ để làm đề nghiêm túc. Hôm nay đo lần hai.',
    outcome: 'Ba đề FE, điểm trung bình ≥6/10, và sổ lỗi được phân loại theo LÝ DO sai.',
    blocks: [
      {
        id: 'd18-b1',
        label: 'Khối 1 · Cày đề',
        goal: 'Ba đề trong một ngày — quen sức bền',
        tasks: [
          {
            id: 'm18-test-grammar',
            title: 'Kiểm tra ngữ pháp — 30 câu tự ra',
            detail:
              'Chọn 30 câu điền chỗ trống từ ngân hàng 55 câu lặp lại, che đáp án, làm lại. ' +
              'CHUẨN: ≥24/30. Dưới chuẩn thì đọc lại mục trợ từ trong Bảng tra cứu trước khi làm đề.',
            minutes: 30,
            tier: 'core',
            kind: 'review',
            course: 'JPD113',
          },
          {
            id: 'd3-exam-234',
            title: 'Đề FE số 2, 3, 4 — bấm giờ từng đề',
            detail:
              'Làm liền ba đề, mỗi đề 45 phút, nghỉ 10 phút giữa các đề. Chấm SAU KHI làm xong cả ba, ' +
              'không chấm từng đề — để tránh đề sau bị ảnh hưởng tâm lý bởi điểm đề trước.',
            minutes: 60,
            tier: 'core',
            kind: 'exam',
            course: 'JPD113',
            links: [{ label: 'Phòng thi — đề FE', href: EXAM_FE }],
          },
          {
            id: 'd3-exam-log',
            title: 'Phân loại sổ lỗi theo LÝ DO',
            detail:
              'Chia mọi câu sai vào 4 nhóm: (a) không biết từ · (b) không biết trợ từ/ngữ pháp · ' +
              '(c) đọc sai kanji · (d) hiểu sai cả câu. Đếm mỗi nhóm bao nhiêu câu. ' +
              'Nhóm nào đông nhất chính là việc phải làm nhiều nhất ở giai đoạn 4 — đừng đoán, hãy đếm.',
            minutes: 25,
            tier: 'core',
            kind: 'review',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd18-b2',
        label: 'Khối 2 · JPD123',
        goal: 'Chốt chương 1-3',
        tasks: [
          {
            id: 'j18-quiz',
            title: 'JPD123 — Quiz động từ & trợ từ',
            detail: 'Quiz 1 trong Academy JPD123. Dưới 8/10 thì đọc lại chương 1-2 trước khi sang chương 4.',
            minutes: 25,
            tier: 'core',
            kind: 'exam',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Quiz 1', href: lesson123('jpd123-quiz-1') }],
          },
        ],
      },
    ],
  },

  /* ═══════════ GIAI ĐOẠN 4 · THI NÓI + FE ═══════════ */
  {
    n: 19,
    phase: 4,
    title: '13 bài đọc — vòng hoàn chỉnh',
    mission:
      'Phần thi đọc chiếm 30/100 điểm bài vấn đáp và là phần DUY NHẤT bạn biết trước 100% nội dung. ' +
      'Không có lý do gì để không lấy trọn.',
    outcome: 'Đọc bất kỳ bài nào trong 13 bài, không báo trước, không vấp quá 1 chỗ.',
    blocks: [
      {
        id: 'd19-b1',
        label: 'Khối 1 · Cả 13 bài',
        goal: 'Vòng đầy đủ, không bỏ bài khó',
        tasks: [
          {
            id: 'd4-read-all13',
            title: 'Đọc trọn 13 bài, một lượt liên tục',
            detail:
              'Không dừng giữa chừng để tra. Bài nào vấp thì đánh dấu, đọc xong hết mới quay lại. ' +
              'Bài 7 (nhà hàng) và bài 9 (số kanji) chắc chắn sẽ là hai bài phải quay lại.',
            minutes: 60,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
          {
            id: 'd4-read-30s',
            title: 'Bốc ngẫu nhiên 5 bài, đọc như thi thật',
            detail:
              'Viết số 1-13 ra giấy, bốc thăm. Bốc trúng bài nào đọc bài đó NGAY, chỉ cho 10 giây quét kanji. ' +
              'Đây mới là điều kiện phòng thi — luyện đọc theo thứ tự thì không tính.',
            minutes: 25,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
          {
            id: 'm19-read-record',
            title: 'Ghi âm 3 bài yếu nhất, nghe lại, sửa',
            detail:
              'Nghe lại với tai của giám thị: có nghe ra thành câu không, hay vẫn là chuỗi chữ rời? ' +
              'Sửa xong ghi âm lại lần hai và so.',
            minutes: 30,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd19-b2',
        label: 'Khối 2 · JPD123',
        goal: 'Mong muốn',
        tasks: [
          {
            id: 'j19-tai',
            title: 'JPD123 — ほしい và ～たい',
            detail:
              'ほしい = muốn CÓ (đồ vật): くるまが ほしいです. ～たい = muốn LÀM: にほんへ いきたいです. ' +
              'Cả hai dùng が chứ không dùng を ở dạng chuẩn — chỗ này ra đề nhiều.',
            minutes: 25,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Mong muốn', href: lesson123('jpd123-mong-muon') }],
          },
        ],
      },
    ],
  },
  {
    n: 20,
    phase: 4,
    title: '22 câu hỏi — nghe là trả lời được trong 3 giây',
    mission:
      'Chuyển từ "hiểu câu hỏi" sang "phản xạ trả lời". Đây là bước lần trước hoàn toàn không có.',
    outcome: 'Nghe bất kỳ câu nào trong 22 câu (không nhìn chữ) và bật ra câu trả lời trong 3 giây.',
    blocks: [
      {
        id: 'd20-b1',
        label: 'Khối 1 · Phản xạ',
        goal: 'Nghe → đáp, không qua bước dịch',
        tasks: [
          {
            id: 'd4-talk-22',
            title: 'Học thuộc 22 câu hỏi + câu trả lời của CHÍNH BẠN',
            detail:
              'Câu trả lời trong trang đã tự điền theo hồ sơ bạn nhập, nên đây là câu của bạn, không phải câu mẫu. ' +
              'Học theo NHÓM: thông tin cá nhân → cảm nhận → lịch sinh hoạt → thói quen.',
            minutes: 45,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
            links: [{ label: 'Academy — 22 câu hỏi không tranh', href: lesson('jpd113-speaking-cau-hoi-khong-tranh') }],
          },
          {
            id: 'm20-talk-listen-answer',
            title: 'Nghe câu hỏi (che chữ) → trả lời trong 3 giây',
            detail:
              'Khu Nghe hiểu → chế độ "Nghe & đáp". Bật ngẫu nhiên, che chữ, nghe xong đếm 1-2-3 rồi PHẢI nói ra. ' +
              'Không kịp thì đánh dấu câu đó và làm lại cuối buổi. ' +
              'CHUẨN: 18/22 câu đáp được trong 3 giây.',
            minutes: 35,
            tier: 'core',
            kind: 'listening',
            course: 'JPD113',
          },
          {
            id: 'd3-speak-group23',
            title: 'Nhóm 2 & 3 — cảm nhận và lịch sinh hoạt',
            detail:
              'Nhóm 3 (mấy giờ dậy, mấy giờ ngủ, học từ mấy giờ) dùng lại toàn bộ bảng giờ đã học ngày 8 — ' +
              'nếu bảng giờ chắc thì nhóm này gần như miễn phí.',
            minutes: 30,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd20-b2',
        label: 'Khối 2 · JPD123',
        goal: 'Mục đích chuyến đi',
        tasks: [
          {
            id: 'j20-purpose',
            title: 'JPD123 — ～に いきます (đi để làm gì)',
            detail:
              'Bỏ ます của động từ rồi thêm に いきます: たべます → たべに いきます (đi ăn). ' +
              'Với danh từ động: かいものに いきます. Mẫu ngắn, ra đề đều.',
            minutes: 25,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Mục đích chuyến đi', href: lesson123('jpd123-muc-dich-chuyen-di') }],
          },
        ],
      },
    ],
  },
  {
    n: 21,
    phase: 4,
    title: '6 bộ tranh — và từ vựng TRONG tranh',
    mission:
      'Lần trước: "nhìn tranh cũng chưa thuộc từ vựng". Hôm nay xử lý đúng chỗ đó — ' +
      '37 câu hỏi tranh với toàn bộ từ vựng đi kèm.',
    outcome: 'Nhìn bất kỳ bộ tranh nào, gọi tên được mọi thứ trong đó và trả lời trọn 6 câu hỏi.',
    blocks: [
      {
        id: 'd21-b1',
        label: 'Khối 1 · Bộ tranh',
        goal: '37 câu — biết trước hết',
        tasks: [
          {
            id: 'd4-talk-pictures',
            title: '6 bộ tranh × mọi câu hỏi',
            detail:
              'Thẻ thông tin cá nhân · điện thoại · lịch · đồng hồ · thời khoá biểu · thực đơn. ' +
              'LUẬT TRẢ LỜI: câu なん/どちら → đáp bằng danh từ đầy đủ; câu "…ですか" có/không → ' +
              'đáp はい／いいえ RỒI nhắc lại cả câu, đừng chỉ nói はい.',
            minutes: 45,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
            links: [{ label: 'Academy — Câu hỏi có tranh', href: lesson('jpd113-speaking-cau-hoi-co-tranh') }],
          },
          {
            id: 'm21-picture-vocab',
            title: 'Từ vựng TRONG tranh — gọi tên mọi thứ',
            detail:
              'Đi từng bộ tranh, chỉ vào từng thứ và gọi tên bằng tiếng Nhật: けいたいでんわ, とけい, ' +
              'カレンダー, じかんわりひょう, メニュー, ほん, かばん, つくえ, いす… ' +
              'Không gọi được tên thì có nghe hiểu câu hỏi cũng không trả lời được — đây chính là chỗ hỏng lần trước.',
            minutes: 35,
            tier: 'core',
            kind: 'vocab',
            course: 'JPD113',
          },
          {
            id: 'm21-picture-listen',
            title: 'Nghe 37 câu hỏi tranh, che chữ',
            detail:
              'Nhìn dữ liệu tranh, nghe câu hỏi, trả lời miệng. Không nhìn phần chữ của câu hỏi. ' +
              'Đây là mô phỏng sát nhất với 3 câu tranh trong phòng thi.',
            minutes: 25,
            tier: 'core',
            kind: 'listening',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd21-b2',
        label: 'Khối 2 · JPD123',
        goal: 'Sở thích',
        tasks: [
          {
            id: 'j21-suki',
            title: 'JPD123 — が すき / きらい / じょうず / へた',
            detail:
              'Bốn tính từ này đều dùng が chứ không dùng を: わたしは すしが すきです. ' +
              'Đây là lỗi ngữ pháp phổ biến nhất của người mới ở A1.2.',
            minutes: 25,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Sở thích', href: lesson123('jpd123-so-thich') }],
          },
        ],
      },
    ],
  },
  {
    n: 22,
    phase: 4,
    title: '40 câu hỏi ngoài ngân hàng + tác phong',
    mission:
      'Lần trước có 1 câu "hỏi về bản thân ở ngoài" — tức là giám thị hỏi VƯỢT ngân hàng 22 câu. ' +
      'Hôm nay chuẩn bị đúng cho tình huống đó.',
    outcome: 'Trả lời được 40 câu hỏi cá nhân mở rộng, và 13 câu đúng/sai không nhầm じゃありません với ません.',
    blocks: [
      {
        id: 'd22-b1',
        label: 'Khối 1 · Câu hỏi mở rộng',
        goal: 'Phòng khi giám thị hỏi ra ngoài',
        tasks: [
          {
            id: 'm22-personal-qa',
            title: '40 câu hỏi cá nhân mở rộng',
            detail:
              'Trường nào, năm mấy, ngành gì, năm sinh, sống ở đâu, đi học bằng gì, mấy giờ dậy… ' +
              'Mở sub-tab "Hỏi đáp cá nhân" trong khu Thi nói — câu trả lời đã tự điền theo hồ sơ của bạn. ' +
              'Nói to từng câu, không đọc thầm.',
            minutes: 40,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
          {
            id: 'm22-truefalse',
            title: '13 câu ĐÚNG/SAI — phân biệt じゃありません với ません',
            detail:
              'DANH TỪ phủ định bằng じゃありません (がくせいじゃありません). ' +
              'ĐỘNG TỪ phủ định bằng ません (いきません). Nhầm hai cái này là lỗi nghe rất rõ. ' +
              'Panel hiện song song ô xanh nếu đúng / ô đỏ nếu sai để bạn thấy cả hai vế.',
            minutes: 25,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
          {
            id: 'd5-manner',
            title: 'Nhẩm lại 4 câu tác phong',
            detail:
              'しつれいします → よろしくおねがいします → ありがとうございました → しつれいしました. ' +
              '10 điểm PRESENTING nằm gọn trong 4 câu này cộng với việc ngồi thẳng và nhìn giám thị.',
            minutes: 15,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
          {
            id: 'm22-listen-mix',
            title: 'Nghe trộn 30 câu — ngân hàng + mở rộng',
            detail: 'Trộn cả 22 câu ngân hàng và 40 câu mở rộng, phát ngẫu nhiên. Đây là điều kiện gần phòng thi nhất.',
            minutes: 25,
            tier: 'core',
            kind: 'listening',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd22-b2',
        label: 'Khối 2 · JPD123',
        goal: 'Quá khứ & lý do',
        tasks: [
          {
            id: 'j22-past',
            title: 'JPD123 — chuyện đã qua, lý do から, なにも',
            detail:
              'から đứng SAU vế lý do: あたまが いたいですから、やすみます (vì đau đầu nên nghỉ) — ' +
              'ngược thứ tự tiếng Việt, chỗ này rất dễ viết sai.',
            minutes: 25,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Quá khứ & lý do', href: lesson123('jpd123-qua-khu-ly-do') }],
          },
        ],
      },
    ],
  },
  {
    n: 23,
    phase: 4,
    title: 'Ngày của trắc nghiệm FE',
    mission:
      'Toàn bộ ngày dành cho phần điểm thấp nhất lần trước (3,7/10). Không học thêm ngữ pháp mới — ' +
      'khai thác đúng những câu ĐÃ TỪNG RA.',
    outcome: 'Thuộc 55 câu điền chỗ trống lặp lại, 29 mục đọc kanji, 27 mục viết kanji, 14 từ katakana.',
    blocks: [
      {
        id: 'd23-b1',
        label: 'Khối 1 · Ngân hàng câu thật',
        goal: 'Học vẹt thẳng những câu có thật trong đề',
        tasks: [
          {
            id: 'm23-febank-55',
            title: '55 câu điền chỗ trống LẶP LẠI — có bản dịch',
            detail:
              'Khu "Đề thi & mục tiêu" → ngân hàng FE. Đây là những câu xuất hiện NHIỀU LẦN trong 14 đề thật, ' +
              'kèm số lần xuất hiện và lý do chọn đáp án. Với mỗi câu: đọc → dịch → giải thích vì sao. ' +
              'Sáu nhóm câu này là phần "biết trước đề" của FE.',
            minutes: 45,
            tier: 'core',
            kind: 'reading',
            course: 'JPD113',
          },
          {
            id: 'm23-kanji-fe',
            title: '29 mục đọc kanji + 27 mục viết kanji',
            detail:
              'Hai dạng này chiếm ~22% đề (11% + 11%) và là dạng dễ ăn điểm nhất vì tập hợp hữu hạn. ' +
              'Mỗi mục kèm số lần đã ra. Che đáp án, tự trả lời, đánh dấu mục sai.',
            minutes: 30,
            tier: 'core',
            kind: 'kanji',
            course: 'JPD113',
          },
          {
            id: 'm23-katakana-fe',
            title: '14 từ katakana + 8 câu odd-one-out + 8 câu ghép',
            detail:
              'Ba dạng nhỏ nhưng cộng lại ~8% đề. Odd-one-out bấm chọn chấm tại chỗ trong panel.',
            minutes: 20,
            tier: 'plus',
            kind: 'vocab',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd23-b2',
        label: 'Khối 2 · Cày đề',
        goal: 'Ba đề nữa',
        tasks: [
          {
            id: 'd4-exam-567',
            title: 'Đề FE số 5, 6, 7',
            detail:
              'Sau khi học ngân hàng câu lặp lại, điểm phải nhích lên rõ. So với điểm đề 2-3-4 ngày 18. ' +
              'Không nhích thì vấn đề nằm ở khâu ĐỌC HIỂU câu chứ không phải ở vốn từ — quay lại quy trình dịch 4 bước.',
            minutes: 60,
            tier: 'core',
            kind: 'exam',
            course: 'JPD113',
            links: [{ label: 'Phòng thi — đề FE', href: EXAM_FE }],
          },
          {
            id: 'j23-compare',
            title: 'JPD123 — so sánh hơn kém (より, ほど)',
            detail:
              'AはBより たかいです (A đắt hơn B) · AはBほど たかくないです (A không đắt bằng B — ほど luôn đi phủ định).',
            minutes: 25,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — So sánh hơn kém', href: lesson123('jpd123-so-sanh-hon-kem') }],
          },
        ],
      },
    ],
  },
  {
    n: 24,
    phase: 4,
    title: 'THI THỬ TOÀN PHẦN',
    mission:
      'Diễn đúng điều kiện phòng thi: bốc bài ngẫu nhiên, giám thị hỏi bằng lời, bấm giờ trắc nghiệm. ' +
      'Thi thử để lộ lỗi bây giờ, còn hơn để lộ ở phòng thi.',
    outcome: 'Có một bản ghi âm thi thử đầy đủ và một bảng điểm tự chấm theo thang READING 30 / TALKING 60 / PRESENTING 10.',
    blocks: [
      {
        id: 'd24-b1',
        label: 'Khối 1 · Thi thử nói',
        goal: 'Đủ ba phần, một lượt, không dừng',
        tasks: [
          {
            id: 'm24-mock-speak',
            title: 'Thi thử vấn đáp — bốc thăm, ghi âm, tự chấm',
            detail:
              'Quy trình: (1) nói 4 câu tác phong vào phòng; (2) bốc 1 trong 13 bài, 10 giây quét kanji rồi đọc; ' +
              '(3) nhờ khu Nghe hiểu phát ngẫu nhiên 3 câu hỏi tranh + 1 câu cá nhân, trả lời ngay; (4) câu chào ra. ' +
              'GHI ÂM TỪ ĐẦU TỚI CUỐI. Chấm theo thang thật: READING 30 · TALKING 60 · PRESENTING 10.',
            minutes: 45,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
            links: [{ label: 'Phòng thi — 5 đề vấn đáp', href: EXAM_SPEAKING }],
          },
          {
            id: 'd4-talk-mock',
            title: 'Nghe lại bản ghi và ghi ra 5 lỗi lớn nhất',
            detail:
              'Nghe với thái độ của giám thị, không phải của chính mình. Năm lỗi đó là toàn bộ việc phải làm ở 6 ngày cuối.',
            minutes: 30,
            tier: 'core',
            kind: 'review',
            course: 'JPD113',
          },
          {
            id: 'd5-tactic-speak',
            title: 'Chiến thuật phòng thi nói: đọc CHẬM và RÕ',
            detail:
              'Phần đọc chấm độ chính xác, KHÔNG chấm tốc độ. Đọc sai một số rồi tự sửa lại vẫn hơn đọc lướt cho xong. ' +
              'Không nghe rõ câu hỏi thì nói もういちど おねがいします — hỏi lại KHÔNG bị trừ điểm, im lặng mới bị.',
            minutes: 10,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
        ],
      },
      {
        id: 'd24-b2',
        label: 'Khối 2 · Thi thử viết',
        goal: 'FE và đọc hiểu',
        tasks: [
          {
            id: 'm24-mock-fe',
            title: 'Đề FE bấm giờ 45 phút — không tra cứu',
            detail:
              'Đề chưa từng làm. Điều kiện thật: không mở trang, không tra từ điển, không quay lại sau khi hết giờ. ' +
              'Đây là con số phản ánh trình độ thật của bạn ở ngày 24.',
            minutes: 45,
            tier: 'core',
            kind: 'exam',
            course: 'JPD113',
            links: [{ label: 'Phòng thi — đề FE', href: EXAM_FE }],
          },
          {
            id: 'd4-reading-exams',
            title: '2 đề đọc hiểu trong Phòng thi',
            detail:
              '16 đề đọc hiểu đều kèm romaji, bản dịch và ghi chú kanji. Làm trước rồi mới xem phần dịch — ' +
              'xem trước thì thành đọc truyện, không phải luyện đọc hiểu.',
            minutes: 40,
            tier: 'core',
            kind: 'reading',
            course: 'JPD113',
            links: [{ label: 'Phòng thi — 16 đề đọc hiểu', href: EXAM_READING }],
          },
          {
            id: 'j24-te',
            title: 'JPD123 — thể て mở màn (～てください)',
            detail:
              'Thể て là hình thái quan trọng nhất của A1.2. Hôm nay chỉ làm quen công dụng đầu: ' +
              'みて ください, きいて ください — chính là mấy câu cô giáo nói trong lớp.',
            minutes: 25,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Thể て', href: lesson123('jpd123-the-te') }],
          },
          {
            id: 'd5-tactic-fe',
            title: 'Chiến thuật làm trắc nghiệm: không để trống câu nào',
            detail:
              '30 câu / 45 phút. Câu nào bí thì đánh dấu, đoán tạm một đáp án rồi đi tiếp — quay lại sau. ' +
              'Loại trước các đáp án sai rõ ràng rồi hãy chọn. Bỏ trống chắc chắn 0 điểm, đoán thì còn 25%. ' +
              'Lần trước được 3,7 một phần vì khoanh mò không có chiến thuật — lần này có.',
            minutes: 10,
            tier: 'core',
            kind: 'exam',
            course: 'JPD113',
          },
        ],
      },
    ],
  },

  /* ═══════════ GIAI ĐOẠN 5 · ĐI TRƯỚC JPD123 ═══════════ */
  {
    n: 25,
    phase: 5,
    title: 'JPD123 — động từ ます đủ dạng & trợ từ chuyển động',
    mission:
      'Sáu ngày cuối dành phần lớn cho JPD123, giữ JPD113 bằng việc lặp hằng ngày. ' +
      'Vào lớp mà đã học rồi thì mỗi buổi trên trường thành một buổi ôn — đó là cách gỡ điểm cả hai môn.',
    outcome: 'Chia được 30 động từ sang đủ 4 dạng ます và đặt câu đúng trợ từ với mỗi động từ.',
    blocks: [
      {
        id: 'd25-b1',
        label: 'Khối 1 · Động từ A1.2',
        goal: 'Xương sống của cả môn',
        tasks: [
          {
            id: 'j25-masu-full',
            title: 'Bảng ます 4 dạng × 30 động từ',
            detail:
              'Kẻ bảng 30 hàng × 4 cột (ます / ません / ました / ませんでした), điền tay. ' +
              'Viết tay cả bảng một lần có giá trị hơn đọc bảng mẫu mười lần.',
            minutes: 40,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Thể ます', href: lesson123('jpd123-dong-tu-masu') }],
          },
          {
            id: 'j25-verbs-30',
            title: '30 động từ A1.2 mới',
            detail:
              'Ngoài 20 động từ JPD113 đã có, thêm: あそびます, はたらきます, やすみます, かえります, ' +
              'つくります, あらいます, つかいます, おしえます, ならいます, わかります… ' +
              'Học kèm luôn trợ từ đi cùng, đừng học từ trần.',
            minutes: 30,
            tier: 'core',
            kind: 'vocab',
            course: 'JPD123',
            links: [{ label: 'My Language — từ vựng', href: ML_VOCAB }],
          },
        ],
      },
      {
        id: 'd25-b2',
        label: 'Khối 2 · Giữ JPD113',
        goal: 'Không để rơi thứ đã xây 24 ngày',
        tasks: [
          {
            id: 'd4-read-hard',
            title: 'Đọc lại 3 bài khó nhất (5, 7, 9)',
            detail: 'Ba bài này luôn là ba bài rơi lại. Đọc mỗi bài 2 lượt, ghi âm lượt hai.',
            minutes: 30,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
          {
            id: 'm25-listen',
            title: 'Nghe 25 câu trộn cả JPD113 và JPD123',
            detail: 'Thêm câu có động từ ます và tính từ. Tai phải quen dần với câu dài hơn.',
            minutes: 20,
            tier: 'core',
            kind: 'listening',
            course: 'JPD123',
          },
          {
            id: 'd5-errorlog',
            title: 'Đọc lại TOÀN BỘ sổ lỗi từ đầu tháng',
            detail:
              'Đây là tài liệu giá trị nhất bạn có lúc này — nó là danh sách đúng những lỗi CỦA BẠN. ' +
              'Mục nào đã chắc thì gạch đi; mục nào còn sai thì chép sang trang mới.',
            minutes: 20,
            tier: 'core',
            kind: 'review',
            course: 'JPD113',
          },
        ],
      },
    ],
  },
  {
    n: 26,
    phase: 5,
    title: 'JPD123 — tính từ trọn vẹn',
    mission: 'Tính từ là chương dài nhất của A1.2 (5 bài). Học trước cho kỹ thì cả chương 3 trên lớp thành buổi ôn.',
    outcome: 'Mô tả được một người, một nơi, một món ăn bằng 3 câu có tính từ chia đúng dạng.',
    blocks: [
      {
        id: 'd26-b1',
        label: 'Khối 1 · Tính từ',
        goal: 'い và な, đủ bốn dạng',
        tasks: [
          {
            id: 'j26-adj-review',
            title: 'Ôn & mở rộng 30 tính từ',
            detail:
              'おおきい, ちいさい, たかい, やすい, あたらしい, ふるい, おいしい, たのしい, むずかしい, やさしい… ' +
              'và tính từ な: きれい, しずか, にぎやか, ゆうめい, べんり, げんき. ' +
              'Nhớ hai ngoại lệ きれい / ゆうめい là tính từ NA.',
            minutes: 40,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Chia tính từ', href: lesson123('jpd123-tinh-tu-chia-4-dang') }],
          },
          {
            id: 'j26-adj-verb',
            title: 'Tính từ bổ nghĩa động từ (く / に)',
            detail:
              'はやい → はやく はしります (chạy nhanh) · しずか → しずかに べんきょうします (học yên lặng). ' +
              'Tính từ い đổi い→く; tính từ な thêm に.',
            minutes: 25,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Tính từ bổ nghĩa động từ', href: lesson123('jpd123-tinh-tu-bo-nghia-dong-tu') }],
          },
          {
            id: 'j26-adj-drill',
            title: 'Đặt 20 câu có tính từ — nói to',
            detail:
              'Mười câu tả người/vật quanh bạn, mười câu tả quê bạn. Đây là đúng chủ đề "giới thiệu quê hương" ' +
              'mà JPD123 lấy làm mục tiêu cuối môn.',
            minutes: 25,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD123',
          },
        ],
      },
      {
        id: 'd26-b2',
        label: 'Khối 2 · Giữ JPD113',
        goal: 'Duy trì',
        tasks: [
          {
            id: 'd5-read-hard3',
            title: 'Đọc 3 bài bốc ngẫu nhiên',
            detail: 'Vẫn quy trình 10 giây quét kanji rồi mới đọc.',
            minutes: 30,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
          {
            id: 'm26-listen',
            title: 'Nghe 25 câu — có tính từ',
            detail: 'Câu dài hơn, nhiều thông tin hơn. Vẫn săn từ khoá thay vì cố nghe hết.',
            minutes: 20,
            tier: 'core',
            kind: 'listening',
            course: 'JPD123',
          },
        ],
      },
    ],
  },
  {
    n: 27,
    phase: 5,
    title: 'JPD123 — mời rủ, giờ giấc & đếm đồ vật',
    mission: 'Chương 4 của A1.2. Phần đếm dùng lại toàn bộ mảng số đã học ở giai đoạn 2 — bạn đang có lợi thế ở đây.',
    outcome: 'Mời một người bạn đi ăn/đi xem phim bằng tiếng Nhật, và đáp lại lời mời cả khi đồng ý lẫn khi từ chối.',
    blocks: [
      {
        id: 'd27-b1',
        label: 'Khối 1 · Mời rủ & đếm',
        goal: 'Chương 4',
        tasks: [
          {
            id: 'j27-invite',
            title: '～ませんか / ～ましょう + cách từ chối lịch sự',
            detail:
              'Mời: いっしょに えいがを みませんか。 Đồng ý: ええ、いいですね。みましょう。 ' +
              'Từ chối lịch sự: すみません、ちょっと… — người Nhật KHÔNG nói thẳng "không". ' +
              'Câu bỏ lửng ちょっと… chính là lời từ chối.',
            minutes: 35,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Mời rủ', href: lesson123('jpd123-moi-ru') }],
          },
          {
            id: 'j27-count-time',
            title: 'Đếm đồ vật & nói giờ đầy đủ',
            detail:
              'Phần này trùng nhiều với ngày 7-10 của bạn — đọc lướt để xác nhận, dành thời gian cho các bộ đếm mới.',
            minutes: 35,
            tier: 'core',
            kind: 'number',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Đếm & thời gian', href: lesson123('jpd123-dem-thoi-gian') }],
          },
        ],
      },
      {
        id: 'd27-b2',
        label: 'Khối 2 · Nghe & nói',
        goal: 'Hội thoại thật',
        tasks: [
          {
            id: 'm27-listen-invite',
            title: 'Nghe 20 hội thoại mời rủ',
            detail: 'Nghe và trả lời: người kia đồng ý hay từ chối? Chú ý ちょっと… — nghe được nó là hiểu đúng ý.',
            minutes: 25,
            tier: 'core',
            kind: 'listening',
            course: 'JPD123',
          },
          {
            id: 'd5-talk-run',
            title: 'Chạy lại trọn 22 câu hỏi JPD113',
            detail: 'Giữ phản xạ. Nghe → đáp trong 3 giây, không nhìn chữ.',
            minutes: 30,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
          },
        ],
      },
    ],
  },
  {
    n: 28,
    phase: 5,
    title: 'JPD123 — mong muốn, sở thích, sắc thái hội thoại',
    mission: 'Chương 5. Đây là chương giúp bạn nói được về CHÍNH MÌNH ở mức A1.2 — phần thi nói của JPD123 hỏi đúng chỗ này.',
    outcome: 'Nói liền 10 câu về bản thân dùng ～たい, ほしい, すき, から — không dừng giữa chừng.',
    blocks: [
      {
        id: 'd28-b1',
        label: 'Khối 1 · Chương 5',
        goal: 'Nói về bản thân ở mức cao hơn',
        tasks: [
          {
            id: 'j28-hoshii',
            title: 'ほしい / ～たい — ôn kỹ và đặt câu',
            detail:
              'Mười câu về điều bạn muốn có và muốn làm. Nhớ dùng が: あたらしい パソコンが ほしいです。' +
              'にほんへ りょこうに いきたいです。',
            minutes: 35,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Mong muốn', href: lesson123('jpd123-mong-muon') }],
          },
          {
            id: 'j28-suki-kara',
            title: 'すき / きらい + lý do から',
            detail:
              'Ghép hai mẫu: にほんごが すきですから、まいにち べんきょうします。 ' +
              'Câu có lý do nghe "trưởng thành" hơn hẳn câu cụt — điểm nói lên rõ ở chỗ này.',
            minutes: 30,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Sở thích', href: lesson123('jpd123-so-thich') }],
          },
          {
            id: 'j28-nuance',
            title: 'もう/まだ · ね/よ · từ chối lịch sự',
            detail:
              'もう たべました (đã ăn rồi) / まだです (chưa). ね = tìm đồng tình, よ = báo tin mới. ' +
              'Hai tiểu từ này nhỏ nhưng làm câu nghe tự nhiên hẳn.',
            minutes: 25,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Sắc thái hội thoại', href: lesson123('jpd123-sac-thai-hoi-thoai') }],
          },
        ],
      },
      {
        id: 'd28-b2',
        label: 'Khối 2 · Nói thật',
        goal: 'Ghép mọi thứ đã học',
        tasks: [
          {
            id: 'm28-speak-jpd123',
            title: 'Tự giới thiệu bản 2.0 — 10 câu, ghi âm',
            detail:
              'Bản tự giới thiệu ngày 1 chỉ có です. Bản hôm nay phải có: 1 động từ ます, 1 tính từ, ' +
              '1 câu ～たい, 1 câu lý do から, 1 liên từ そして hoặc でも. ' +
              'Ghi âm và so với bản ghi ngày 1 — đây là thước đo rõ nhất của một tháng.',
            minutes: 30,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD123',
          },
        ],
      },
    ],
  },
  {
    n: 29,
    phase: 5,
    title: 'JPD123 — so sánh & thể て',
    mission: 'Hai chương cuối của A1.2. Thể て là thứ khó nhất, nhưng học trước một lần thì cả kỳ nhẹ hẳn.',
    outcome: 'Chia được thể て cho 20 động từ theo đúng nhóm, và dùng ～ています nói việc đang làm.',
    blocks: [
      {
        id: 'd29-b1',
        label: 'Khối 1 · So sánh',
        goal: 'Chương 6',
        tasks: [
          {
            id: 'j29-compare',
            title: 'いちばん & どちらが — so sánh nhất và câu hỏi so sánh',
            detail:
              'なかで いちばん … です (…nhất trong số…) · AとBと どちらが …ですか → Aのほうが …です. ' +
              'Khuôn hỏi-đáp này ra đề rất đều.',
            minutes: 35,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD123',
            links: [
              { label: 'Academy JPD123 — So sánh nhất', href: lesson123('jpd123-so-sanh-nhat') },
              { label: 'Academy JPD123 — Câu hỏi so sánh', href: lesson123('jpd123-cau-hoi-so-sanh') },
            ],
          },
        ],
      },
      {
        id: 'd29-b2',
        label: 'Khối 2 · Thể て',
        goal: 'Chương 7 — phần khó nhất A1.2',
        tasks: [
          {
            id: 'j29-te-table',
            title: 'Bảng chia thể て đầy đủ — học theo NHÓM',
            detail:
              'Nhóm 1 chia theo đuôi: い/ち/り→って · み/び/に→んで · き→いて (ngoại lệ いきます→いって) · ' +
              'ぎ→いで · し→して. Nhóm 2 bỏ ます thêm て. Nhóm 3: きます→きて, します→して. ' +
              'Kẻ bảng, điền 20 động từ, đọc to từng dòng.',
            minutes: 40,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Bảng chia thể て', href: lesson123('jpd123-bang-chia-the-te') }],
          },
          {
            id: 'j29-teimasu',
            title: '～ています — việc đang diễn ra',
            detail:
              'いま、なにを して いますか。→ にほんごを べんきょうして います。 ' +
              'Mẫu này đã xuất hiện sẵn trong bài đọc 2 và 4 của JPD113 (べんきょうしています) — nay bạn hiểu vì sao.',
            minutes: 30,
            tier: 'core',
            kind: 'grammar',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — ～ています', href: lesson123('jpd123-teimasu') }],
          },
          {
            id: 'j29-kanji',
            title: '40 kanji của A1.2',
            detail: 'Nối tiếp 35 chữ JPD113. Nhiều chữ đã gặp trong bài đọc — chỉ cần khoá lại cách đọc.',
            minutes: 25,
            tier: 'core',
            kind: 'kanji',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Kanji A1.2', href: lesson123('jpd123-kanji') }],
          },
        ],
      },
    ],
  },
  {
    n: 30,
    phase: 5,
    title: 'TỔNG DUYỆT & bước vào kỳ',
    mission:
      'Ngày cuối: đo lại toàn bộ, so với ngày 1, và chốt thói quen sẽ mang vào kỳ học. ' +
      'Một tháng này chỉ có giá trị nếu nó biến thành thói quen 30 phút mỗi ngày trong kỳ.',
    outcome:
      'Có ba con số để so với ngày 1 (kana, thời gian đọc bài, điểm FE) và một lịch học 30 phút/ngày cho cả kỳ.',
    blocks: [
      {
        id: 'd30-b1',
        label: 'Khối 1 · Đo lại toàn bộ',
        goal: 'So với chính mình 30 ngày trước',
        tasks: [
          {
            id: 'm30-final-kana',
            title: 'Viết hai bảng kana lần cuối — so với ngày 1',
            detail: 'Ghi lại số ô sai và thời gian. So với con số ngày 1 và ngày 5.',
            minutes: 20,
            tier: 'core',
            kind: 'review',
            course: 'JPD113',
          },
          {
            id: 'm30-final-speak',
            title: 'Thi thử vấn đáp lần 2 — đủ quy trình',
            detail:
              'Y hệt ngày 24: tác phong → bốc bài đọc → 3 câu tranh + 1 câu cá nhân → chào ra. Ghi âm. ' +
              'So với bản ghi ngày 24 và với 5 lỗi đã ghi hôm đó: đã sửa được mấy lỗi?',
            minutes: 40,
            tier: 'core',
            kind: 'speaking',
            course: 'JPD113',
            links: [{ label: 'Phòng thi — đề vấn đáp', href: EXAM_SPEAKING }],
          },
          {
            id: 'd5-final-exam',
            title: 'Đề FE cuối cùng — bấm giờ',
            detail:
              'Đề chưa từng làm. So với 3,7 điểm của kỳ thi trượt và với điểm đề ngày 10, 18, 23. ' +
              'Đường điểm đi lên là bằng chứng lộ trình chạy đúng.',
            minutes: 45,
            tier: 'core',
            kind: 'exam',
            course: 'JPD113',
            links: [{ label: 'Phòng thi — đề FE', href: EXAM_FE }],
          },
        ],
      },
      {
        id: 'd30-b2',
        label: 'Khối 2 · Vào kỳ',
        goal: 'Biến 30 ngày thành thói quen cả kỳ',
        tasks: [
          {
            id: 'd5-cheatsheet',
            title: 'Đọc lướt toàn bộ Bảng tra cứu',
            detail:
              'Kana → âm ngắt & trường âm → số/giờ/ngày → trợ từ → chỉ định → động từ → kanji → từ vựng → chiến thuật. ' +
              'Không học gì mới, chỉ xác nhận mọi mục đều đã quen mắt.',
            minutes: 25,
            tier: 'core',
            kind: 'review',
            course: 'JPD113',
          },
          {
            id: 'm30-semester-plan',
            title: 'Viết lịch 30 phút/ngày cho cả kỳ',
            detail:
              'Đề xuất: 10 phút nghe + 10 phút từ vựng SRS + 10 phút đọc to. Cộng thêm 1 đề FE mỗi tuần. ' +
              'Ghi vào lịch điện thoại như một cuộc hẹn cố định. ' +
              'Lý do môn trước trượt không phải vì bạn kém — mà vì việc học dồn vào 5 ngày cuối. Cách chữa nằm ở đây.',
            minutes: 25,
            tier: 'core',
            kind: 'review',
          },
          {
            id: 'j30-quiz2',
            title: 'JPD123 — Quiz tổng hợp chương 3-8',
            detail: 'Quiz 2 trong Academy JPD123. Đây là lúc biết mình đã đi trước lớp được bao xa.',
            minutes: 25,
            tier: 'core',
            kind: 'exam',
            course: 'JPD123',
            links: [{ label: 'Academy JPD123 — Quiz 2', href: lesson123('jpd123-quiz-2') }],
          },
        ],
      },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════
   Tổng hợp — dùng cho thanh tiến độ
   ══════════════════════════════════════════════════════════════ */

export const ALL_TASKS: StudyTask[] = PLAN.flatMap((d) => d.blocks.flatMap((b) => b.tasks));

export const TOTAL_MINUTES = ALL_TASKS.reduce((s, t) => s + t.minutes, 0);
export const CORE_MINUTES = ALL_TASKS.filter((t) => t.tier === 'core').reduce((s, t) => s + t.minutes, 0);
/** Việc lặp hằng ngày × 30 ngày — không nằm trong TOTAL_MINUTES ở trên */
export const RITUAL_MINUTES_PER_DAY = DAILY_RITUAL.reduce((s, t) => s + t.minutes, 0);

export const dayMinutes = (d: StudyDay) =>
  d.blocks.flatMap((b) => b.tasks).reduce((s, t) => s + t.minutes, 0);

/** Số việc JPD123 — dùng cho thẻ thống kê ở đầu trang */
export const JPD123_TASKS = ALL_TASKS.filter((t) => t.course === 'JPD123').length;

export const KIND_META: Record<TaskKind, { label: string; color: string }> = {
  kana: { label: 'Kana', color: '#22d3ee' },
  number: { label: 'Số & giờ', color: '#fb923c' },
  grammar: { label: 'Ngữ pháp', color: '#8b5cf6' },
  kanji: { label: 'Kanji', color: '#f43f5e' },
  vocab: { label: 'Từ vựng', color: '#4ade80' },
  listening: { label: 'Nghe hiểu', color: '#facc15' },
  speaking: { label: 'Thi nói', color: '#ec4899' },
  reading: { label: 'Đọc hiểu', color: '#3b82f6' },
  exam: { label: 'Đề thi', color: '#fbbf24' },
  review: { label: 'Ôn lại', color: '#94a3b8' },
};
