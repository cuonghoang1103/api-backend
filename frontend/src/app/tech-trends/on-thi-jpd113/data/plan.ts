/**
 * JPD113 — Lộ trình ôn thi cấp tốc 02/08 → 06/08/2026.
 *
 * Nguồn của mọi con số ở đây là dữ liệu THẬT trong hệ thống:
 *  - Academy JPD113 (khoá `elementary-japanese-1-a11`, 10 chương / 44 bài)
 *  - Phòng thi: 14 đề FE thật (420 câu), 16 đề Đọc hiểu, 5 đề Vấn đáp
 *  - Thống kê tần suất rút từ chính 420 câu FE đó (xem cheatsheet.ts)
 *
 * Nguyên tắc xếp lộ trình (quan trọng — đừng đảo thứ tự khi sửa):
 *  1. Kana trước hết. Không đọc được kana thì mọi phần sau đều sập,
 *     kể cả phần thi nói (bài đọc in bằng kana + kanji).
 *  2. Con số/thời gian đứng NGAY sau kana, trước cả ngữ pháp — vì
 *     theo phân tích 420 câu FE, cách đọc số bất quy tắc là chỗ mất
 *     điểm số một, và nó cũng là chỗ vấp giữa câu khi thi đọc to.
 *  3. Thi nói được rải mỗi ngày một ít (phản xạ cần thời gian ngấm),
 *     rồi dồn toàn lực vào ngày 4.
 *  4. Đề FE cày tăng dần từ ngày 2, không để dồn ngày cuối.
 *
 * `tier`:
 *   'core' = làm đủ những việc này là đủ qua môn (mục tiêu 7đ)
 *   'plus' = phần kéo điểm lên 9-10, làm khi còn thời gian
 */

export type TaskTier = 'core' | 'plus';

export type TaskKind =
  | 'kana'
  | 'number'
  | 'grammar'
  | 'kanji'
  | 'vocab'
  | 'speaking'
  | 'reading'
  | 'exam'
  | 'review';

export interface TaskLink {
  label: string;
  href: string;
}

export interface StudyTask {
  /** ID ổn định — dùng làm khoá lưu tiến độ, ĐỪNG đổi khi sửa nội dung */
  id: string;
  title: string;
  /** Làm gì, cụ thể từng bước — không để chung chung kiểu "ôn ngữ pháp" */
  detail: string;
  minutes: number;
  tier: TaskTier;
  kind: TaskKind;
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
  /** ISO — dùng để so với ngày hệ thống, tô sáng "hôm nay" */
  date: string;
  dow: string;
  title: string;
  mission: string;
  /** Tiêu chí nghiệm thu: cuối ngày tự kiểm được, không mơ hồ */
  outcome: string;
  blocks: StudyBlock[];
}

const COURSE = '/courses/elementary-japanese-1-a11/learn';
/** Deep-link tới một bài trong Academy (slug ổn định qua các lần đổi tiêu đề) */
export const lesson = (slug: string) => `${COURSE}?lessonSlug=${slug}`;

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

export const EXAM_DATE = '2026-08-06';

/* ══════════════════════════════════════════════════════════════
   VIỆC LẶP HẰNG NGÀY — làm mỗi ngày, không cần đợi tới lịch
   ══════════════════════════════════════════════════════════════ */

export const DAILY_RITUAL: StudyTask[] = [
  {
    id: 'ritual-kana-write',
    title: 'Viết cả bảng kana ra giấy trắng',
    detail:
      'Không nhìn mẫu. Ô nào viết không ra là việc phải học lại ngay hôm đó. ' +
      'Đây là phép thử duy nhất phân biệt "nhận ra mặt chữ" với "thật sự thuộc".',
    minutes: 10,
    tier: 'core',
    kind: 'kana',
  },
  {
    id: 'ritual-read-aloud',
    title: 'Đọc to 3 bài trong ngân hàng 13 bài',
    detail:
      'Đọc THÀNH TIẾNG, không đọc thầm. Bấm giờ, ghi âm bằng điện thoại rồi nghe lại — ' +
      'chỗ nào mình ngập ngừng thì chính là chỗ giám thị trừ điểm.',
    minutes: 15,
    tier: 'core',
    kind: 'speaking',
  },
  {
    id: 'ritual-error-log',
    title: 'Đọc lại sổ lỗi',
    detail:
      'Mỗi câu làm sai trong đề FE chép vào một cuốn sổ (hoặc ghi chú điện thoại): ' +
      'câu hỏi — đáp án đúng — vì sao mình chọn sai. Đọc lại toàn bộ sổ mỗi tối. ' +
      'Cày 14 đề mà không có sổ lỗi thì sai câu nào vẫn sai lại câu đó.',
    minutes: 10,
    tier: 'core',
    kind: 'review',
  },
];

/* ══════════════════════════════════════════════════════════════
   LỘ TRÌNH 5 NGÀY
   ══════════════════════════════════════════════════════════════ */

export const PLAN: StudyDay[] = [
  /* ─────────────────────── NGÀY 1 ─────────────────────── */
  {
    n: 1,
    date: '2026-08-02',
    dow: 'Chủ Nhật',
    title: 'Đọc được chữ',
    mission:
      'Hôm nay chỉ có một việc: biến kana từ "nhìn quen quen" thành "đọc ra tiếng ngay". ' +
      'Chưa xong việc này thì mọi ngày sau đều vô nghĩa.',
    outcome:
      'Viết được cả hai bảng kana ra giấy trắng từ trí nhớ + đọc trơn một đoạn toàn hiragana ' +
      'mà không cần romaji + nói được 5 câu về bản thân.',
    blocks: [
      {
        id: 'd1-b1',
        label: 'Khối 1 · Hiragana',
        goal: '46 âm gốc + biến âm — nền móng của toàn bộ môn học',
        tasks: [
          {
            id: 'd1-hira-46',
            title: 'Học 46 âm gốc theo 5 cụm, mỗi cụm 10 phút',
            detail:
              'Chia あかさたな / はまやらわ thành 10 hàng, học từng hàng một chứ đừng nhìn cả bảng cùng lúc. ' +
              'Mẹo: đọc to từng âm khi viết — tay + miệng + mắt cùng lúc nhớ nhanh gấp ba lần chỉ nhìn.',
            minutes: 45,
            tier: 'core',
            kind: 'kana',
            links: [{ label: 'Bài 1.1 — 46 âm gốc', href: lesson('jpd113-hiragana-goc') }],
          },
          {
            id: 'd1-hira-write',
            title: 'Chép tay cả bảng 2 lượt',
            detail:
              'Viết đúng thứ tự nét. Lượt 1 nhìn mẫu, lượt 2 che mẫu. Đây là bước người ta hay bỏ ' +
              'và cũng là lý do họ vẫn lẫn は/ほ, ぬ/め, れ/わ trong phòng thi.',
            minutes: 25,
            tier: 'core',
            kind: 'kana',
          },
          {
            id: 'd1-hira-dakuten',
            title: 'Âm đục & bán đục: が ざ だ ば ぱ',
            detail:
              'Chỉ là dấu " và ° thêm vào chữ đã biết — 20 phút là xong. ' +
              'Nhớ: は + " = ば (ba), は + ° = ぱ (pa).',
            minutes: 20,
            tier: 'core',
            kind: 'kana',
            links: [{ label: 'Bài 1.2 — Âm đục, âm ghép', href: lesson('jpd113-hiragana-bien-am') }],
          },
          {
            id: 'd1-hira-youon',
            title: 'Âm ghép きゃ・しゅ・ちょ… và âm ngắt っ',
            detail:
              'Chữ nhỏ ゃゅょ ghép vào hàng i. Riêng っ (tsu nhỏ) = một nhịp NGHỈ: がっこう đọc "gak-kou", ' +
              'không phải "gakou". Bẫy này xuất hiện dày đặc trong đề đọc kanji.',
            minutes: 20,
            tier: 'core',
            kind: 'kana',
          },
          {
            id: 'd1-hira-mora',
            title: 'ん là một nhịp riêng + trường âm',
            detail:
              'せんせい = 4 nhịp (せ-ん-せ-い) chứ không phải 3. Hiragana kéo dài bằng cách THÊM nguyên âm ' +
              '(おかあさん), katakana kéo dài bằng gạch ー (コーヒー). Đọc sai trường âm là lỗi trừ điểm ' +
              'phổ biến nhất khi thi đọc to.',
            minutes: 20,
            tier: 'core',
            kind: 'kana',
            links: [{ label: 'Bài 1.3 — ん, trường âm, 3 bẫy trợ từ', href: lesson('jpd113-n-truong-am-tro-tu') }],
          },
          {
            id: 'd1-hira-particles',
            title: '3 chữ đổi cách đọc khi làm trợ từ',
            detail:
              'は đọc "wa" khi làm trợ từ chủ đề · へ đọc "e" khi chỉ hướng · を luôn đọc "o". ' +
              'Ba chữ này xuất hiện trong gần như mọi câu — đọc sai là lộ ngay.',
            minutes: 10,
            tier: 'core',
            kind: 'kana',
          },
        ],
      },
      {
        id: 'd1-b2',
        label: 'Khối 2 · Katakana',
        goal: 'Nhận mặt đủ nhanh để không vấp khi gặp từ mượn',
        tasks: [
          {
            id: 'd1-kata-46',
            title: 'Học katakana đối chiếu hiragana',
            detail:
              'Học theo cặp cùng âm (あ↔ア, か↔カ) chứ đừng học lại từ đầu như bảng mới. ' +
              'Katakana chỉ dùng cho từ mượn, tên nước ngoài, tên nước — nhưng trong đề thì rất nhiều.',
            minutes: 35,
            tier: 'core',
            kind: 'kana',
            links: [{ label: 'Bài 2.1 — Katakana & khi nào dùng', href: lesson('jpd113-katakana') }],
          },
          {
            id: 'd1-kata-confuse',
            title: 'Trị dứt 4 chữ hay lẫn: シ ツ ソ ン',
            detail:
              'Đếm nét trước (シ/ツ ba nét, ソ/ン hai nét), rồi nhìn hướng nét dài: シ・ン đi từ dưới lên, ' +
              'ツ・ソ đi từ trên xuống. Mẹo vị trí: ン gần như không bao giờ mở đầu từ, ソ thì hay mở đầu.',
            minutes: 20,
            tier: 'core',
            kind: 'kana',
          },
          {
            id: 'd1-kata-words',
            title: '25 từ mượn + tên nước hay ra đề',
            detail:
              'テレビ・パソコン・コーヒー・テニス・サッカー・カメラ・レストラン・スーパー・アルバイト・ ' +
              'ベトナム・アメリカ・オーストラリア・ドイツ・フランス… Đọc to từng từ, viết ra 1 lượt.',
            minutes: 20,
            tier: 'core',
            kind: 'vocab',
          },
        ],
      },
      {
        id: 'd1-b3',
        label: 'Khối 3 · Khởi động thi nói',
        goal: 'Chốt 10 điểm PRESENTING + làm quen giọng đọc',
        tasks: [
          {
            id: 'd1-speak-manner',
            title: 'Thuộc 4 câu tác phong = 10 điểm cho không',
            detail:
              'しつれいします (khi vào) → よろしくおねがいします (đầu buổi) → ' +
              'ありがとうございました (cuối buổi) → しつれいしました (khi ra). ' +
              'PRESENTING chấm thái độ chứ không chấm ngoại ngữ: ngồi thẳng, nhìn giám thị, nói to rõ. ' +
              'Đây là 10/100 điểm lấy được trước khi nói câu tiếng Nhật nào.',
            minutes: 15,
            tier: 'core',
            kind: 'speaking',
            links: [{ label: 'S.1 — Cấu trúc & thang điểm', href: lesson('jpd113-speaking-cau-truc') }],
          },
          {
            id: 'd1-speak-profile',
            title: 'Điền hồ sơ cá nhân → thuộc 5 câu về bản thân',
            detail:
              'Dùng ô "Hồ sơ thi nói" ngay trên trang này: điền tên, quốc tịch, nghề, sinh nhật, sở thích, ' +
              'giờ dậy, phương tiện đi học. Trang sẽ tự ghép thành câu trả lời tiếng Nhật hoàn chỉnh cho ' +
              'gần hết 22 câu hỏi. Học thuộc 5 câu đầu tiên tối nay.',
            minutes: 25,
            tier: 'core',
            kind: 'speaking',
          },
          {
            id: 'd1-speak-read12',
            title: 'Đọc to bài 1 và bài 2 (dễ nhất)',
            detail:
              'Mỗi bài đọc 5 lượt: 2 lượt nhìn romaji, 3 lượt chỉ nhìn bản tiếng Nhật. ' +
              'Chú ý 二十歳 = はたち (bất quy tắc) và オーストラリア (katakana dài).',
            minutes: 20,
            tier: 'core',
            kind: 'speaking',
            links: [{ label: 'S.2 — Ngân hàng bài đọc 1–7', href: lesson('jpd113-speaking-doc-1-7') }],
          },
        ],
      },
      {
        id: 'd1-b4',
        label: 'Khối 4 · Nghiệm thu',
        goal: 'Tự kiểm — không tự lừa mình',
        tasks: [
          {
            id: 'd1-check-quiz',
            title: 'Làm Quiz 1 — Kana trong Academy',
            detail: 'Sai câu nào quay lại đúng bài đó học lại, đừng bỏ qua.',
            minutes: 15,
            tier: 'core',
            kind: 'review',
            links: [{ label: 'Quiz 1 — Kana', href: lesson('jpd113-quiz-1') }],
          },
          {
            id: 'd1-check-blank',
            title: 'Viết cả 2 bảng kana ra giấy trắng',
            detail:
              'Không nhìn mẫu, không dùng romaji. Ô trống chính là danh sách việc sáng mai. ' +
              'Nếu đúng trên 90 ô/92 thì bạn đã qua cửa ải khó nhất của môn này.',
            minutes: 20,
            tier: 'core',
            kind: 'kana',
          },
        ],
      },
    ],
  },

  /* ─────────────────────── NGÀY 2 ─────────────────────── */
  {
    n: 2,
    date: '2026-08-03',
    dow: 'Thứ Hai',
    title: 'Con số & thời gian',
    mission:
      'Đây là mảng mất điểm số MỘT của môn này — trong 420 câu đề thật, đọc số/ngày/giờ bất quy tắc ' +
      'khiến sinh viên mất nhiều điểm hơn cả ngữ pháp. Học kỹ hôm nay là mua rẻ được nhiều điểm nhất.',
    outcome:
      'Đọc đúng bất kỳ giờ, phút, ngày, tháng, tuổi, giá tiền nào được viết bằng số hoặc kanji, ' +
      'trong dưới 2 giây, không phải nhẩm.',
    blocks: [
      {
        id: 'd2-b1',
        label: 'Khối 1 · Hệ số đếm',
        goal: '1 → 100.000.000 và các chỗ biến âm',
        tasks: [
          {
            id: 'd2-num-basic',
            title: 'Số 1–10, 11–99 và quy tắc ghép',
            detail:
              'Tiếng Nhật ghép số cực đều: 25 = にじゅうご (2×10+5). Học 1–10 xong là đọc được tới 99. ' +
              'Nhớ 4=よん/し, 7=なな/しち, 9=きゅう/く có hai cách đọc — chọn cái nào tuỳ ngữ cảnh (xem bảng cheat-sheet).',
            minutes: 30,
            tier: 'core',
            kind: 'number',
            links: [{ label: 'Bài 3.2 — Hệ số đếm đầy đủ', href: lesson('jpd113-so-dem-day-du') }],
          },
          {
            id: 'd2-num-big',
            title: '百 / 千 / 万 và 6 chỗ biến âm bắt buộc thuộc',
            detail:
              '300=さんびゃく · 600=ろっぴゃく · 800=はっぴゃく · 3000=さんぜん · 8000=はっせん · ' +
              '10.000=いちまん (KHÔNG phải まん trơn). Tiếng Nhật nhóm 4 chữ số: 83.000 = はちまんさんぜん.',
            minutes: 30,
            tier: 'core',
            kind: 'number',
          },
          {
            id: 'd2-num-money',
            title: 'Giá tiền — いくらですか',
            detail:
              'Tự viết 20 mức giá ra giấy (từ 150円 tới 98.000円) rồi đọc to từng cái. ' +
              'Đề rất hay hỏi giá — và giá thì luôn rơi vào đúng mấy chỗ biến âm vừa học.',
            minutes: 20,
            tier: 'core',
            kind: 'number',
            links: [{ label: 'Bài 3.3 — Tiền & giá cả', href: lesson('jpd113-tien-gia-ca') }],
          },
        ],
      },
      {
        id: 'd2-b2',
        label: 'Khối 2 · Giờ & phút',
        goal: 'Cụm kanji xuất hiện dày nhất trong đề thật',
        tasks: [
          {
            id: 'd2-time-hour',
            title: '時 — 3 giờ bất quy tắc phải thuộc lòng',
            detail:
              '4時 = よじ (không phải よんじ hay しじ) · 7時 = しちじ · 9時 = くじ. ' +
              'Ba cái này ra đề liên tục và cũng là chỗ vấp kinh điển khi đọc to bài 12 trong ngân hàng.',
            minutes: 20,
            tier: 'core',
            kind: 'number',
            links: [{ label: 'Bài 3.4 — Ngày, giờ & tuổi', href: lesson('jpd113-ngay-gio-tuoi') }],
          },
          {
            id: 'd2-time-min',
            title: '分 — luật biến âm ふん/ぷん',
            detail:
              '1,3,4,6,8,10 → ぷん (いっぷん, さんぷん, よんぷん, ろっぷん, はっぷん, じゅっぷん). ' +
              '2,5,7,9 → ふん. Học thuộc dãy "1-3-4-6-8-10 là ぷん" như một câu thần chú.',
            minutes: 25,
            tier: 'core',
            kind: 'number',
          },
          {
            id: 'd2-time-drill',
            title: 'Luyện phản xạ 20 mốc giờ',
            detail:
              'Viết ra 20 giờ ngẫu nhiên (4:08, 9:30, 7:41…) rồi đọc to liên tục, bấm giờ. ' +
              'Mục tiêu: dưới 2 giây mỗi mốc. Thêm ごぜん (sáng) / ごご (chiều) / はん (rưỡi).',
            minutes: 20,
            tier: 'core',
            kind: 'number',
          },
        ],
      },
      {
        id: 'd2-b3',
        label: 'Khối 3 · Ngày, tháng, tuổi',
        goal: 'Ổ bất quy tắc lớn nhất của môn',
        tasks: [
          {
            id: 'd2-date-month',
            title: '12 tháng — 3 tháng bất quy tắc',
            detail:
              '4月 = しがつ · 7月 = しちがつ · 9月 = くがつ. Chín tháng còn lại đọc đều theo số. ' +
              'Đề hay hỏi đúng ba tháng này chứ hiếm khi hỏi 2月.',
            minutes: 15,
            tier: 'core',
            kind: 'number',
          },
          {
            id: 'd2-date-day',
            title: 'Ngày 1–31 — thuộc lòng 1→10, 14, 20, 24',
            detail:
              'ついたち・ふつか・みっか・よっか・いつか・むいか・なのか・ようか・ここのか・とおか, ' +
              'rồi 14日 = じゅうよっか, 20日 = はつか, 24日 = にじゅうよっか. Còn lại đọc theo số + にち. ' +
              'Đây là danh sách phải học vẹt — không có quy tắc nào suy ra được.',
            minutes: 35,
            tier: 'core',
            kind: 'number',
          },
          {
            id: 'd2-date-week',
            title: '7 thứ trong tuần + kanji của chúng',
            detail:
              '月火水木金土日 + 曜日. Học kèm nghĩa gốc (月=trăng, 火=lửa, 水=nước…) để nhớ mặt chữ nhanh hơn.',
            minutes: 15,
            tier: 'core',
            kind: 'number',
            links: [{ label: 'Bài 3.5 — Ngày trong tuần', href: lesson('jpd113-youbi') }],
          },
          {
            id: 'd2-date-age',
            title: 'Tuổi 才 và tầng 階',
            detail:
              '20歳 = はたち (hoàn toàn bất quy tắc, ra đề rất nhiều) · 1才 = いっさい · 8才 = はっさい · 10才 = じゅっさい. ' +
              'Tầng: 1階 = いっかい · 3階 = さんがい (GAI, không phải かい!) · 6階 = ろっかい · 8階 = はっかい.',
            minutes: 20,
            tier: 'core',
            kind: 'number',
            links: [{ label: 'Bài 3.6 — Đếm tầng', href: lesson('jpd113-dem-tang') }],
          },
        ],
      },
      {
        id: 'd2-b4',
        label: 'Khối 4 · Vào đề thật',
        goal: 'Đề FE đầu tiên — để biết mình đang ở đâu',
        tasks: [
          {
            id: 'd2-exam-d1',
            title: 'Làm Đề 1 (FE) bấm giờ 45 phút',
            detail:
              'Làm nghiêm túc như thi thật: không tra cứu, không dừng đồng hồ. Điểm lần này KHÔNG quan trọng — ' +
              'nó chỉ để đo điểm xuất phát. Đề nào cũng 30 câu / 45 phút / thang 10.',
            minutes: 45,
            tier: 'core',
            kind: 'exam',
            links: [{ label: 'Phòng thi — 14 đề FE thật', href: EXAM_FE }],
          },
          {
            id: 'd2-exam-review',
            title: 'Soi lại từng câu sai + lập sổ lỗi',
            detail:
              'Mỗi đề trong Phòng thi đều có giải thích song ngữ cho từng câu. Đọc hết phần giải thích của ' +
              'các câu sai, chép vào sổ lỗi theo mẫu: câu hỏi → đáp án đúng → mình sai vì nghĩ gì.',
            minutes: 35,
            tier: 'core',
            kind: 'review',
          },
          {
            id: 'd2-exam-quiz',
            title: 'Quiz 2 — Số, tiền & ngày tháng',
            detail: 'Kiểm lại đúng phần vừa học hôm nay, trước khi đi ngủ.',
            minutes: 15,
            tier: 'plus',
            kind: 'review',
            links: [{ label: 'Quiz 2 — Số & ngày tháng', href: lesson('jpd113-quiz-so') }],
          },
        ],
      },
      {
        id: 'd2-b5',
        label: 'Khối 5 · Thi nói (rải đều)',
        goal: 'Mỗi ngày một ít — phản xạ không nhồi được',
        tasks: [
          {
            id: 'd2-speak-read345',
            title: 'Đọc to bài 3, 4, 5',
            detail:
              'Bài 5 là bài "khó" đầu tiên: nó dồn đủ mọi loại số cùng lúc (thứ, 9時=くじ, 5時半, ごぜん/ごご) ' +
              'và mẫu から…まで hai lần. Đọc chậm, rõ, ngắt hơi ở mỗi trợ từ.',
            minutes: 25,
            tier: 'core',
            kind: 'speaking',
          },
          {
            id: 'd2-speak-group1',
            title: 'Thuộc trả lời 5 câu Nhóm 1 (thông tin cá nhân)',
            detail:
              'Tên, quốc tịch, nghề, sinh nhật, sở thích — trả lời bằng chính câu đã sinh ra từ hồ sơ cá nhân. ' +
              'Nói to trước gương, không đọc trong đầu.',
            minutes: 20,
            tier: 'core',
            kind: 'speaking',
            links: [{ label: 'S.4 — 22 câu hỏi không tranh', href: lesson('jpd113-speaking-cau-hoi-khong-tranh') }],
          },
        ],
      },
    ],
  },

  /* ─────────────────────── NGÀY 3 ─────────────────────── */
  {
    n: 3,
    date: '2026-08-04',
    dow: 'Thứ Ba',
    title: 'Ngữ pháp & trợ từ',
    mission:
      '~70% số câu trong đề FE là dạng điền chỗ trống, và phần lớn chỗ trống đó là một TRỢ TỪ. ' +
      'Hôm nay là ngày sinh lời cao thứ hai sau ngày con số.',
    outcome:
      'Nhìn một câu thiếu trợ từ là điền đúng ngay mà không cần dịch cả câu; ' +
      'phân biệt dứt điểm これ/それ/あれ với この/その/あの.',
    blocks: [
      {
        id: 'd3-b1',
        label: 'Khối 1 · Trợ từ',
        goal: 'Mười mấy chữ này quyết định 2/3 số điểm phần trắc nghiệm',
        tasks: [
          {
            id: 'd3-part-wa',
            title: 'は · の · も · か — bộ tứ của câu tự giới thiệu',
            detail:
              'は đánh dấu chủ đề (đọc "wa") · の nối hai danh từ theo kiểu "của" (わたしの本) · ' +
              'も = "cũng" và THAY THẾ は chứ không đứng cùng · か đặt cuối câu thành câu hỏi (không cần dấu ?).',
            minutes: 35,
            tier: 'core',
            kind: 'grammar',
            links: [
              { label: 'Bài 4.1 — は, です & の', href: lesson('jpd113-bai-1-ngu-phap') },
              { label: 'Bài 4.2 — も & か', href: lesson('jpd113-mo-ka') },
            ],
          },
          {
            id: 'd3-part-wo',
            title: 'を · に · で · へ — bộ tứ hay bị lẫn nhất',
            detail:
              'を = tân ngữ (ごはんを たべます) · に = điểm đến / thời điểm cụ thể (7時に おきます, 学校に 行きます) · ' +
              'で = NƠI DIỄN RA hành động và phương tiện (会社で はたらきます, バスで 行きます) · へ = hướng đi. ' +
              'Bẫy kinh điển: 学校に 行きます (đích đến) ≠ 学校で べんきょうします (nơi làm việc gì đó).',
            minutes: 40,
            tier: 'core',
            kind: 'grammar',
            links: [{ label: 'Bài 5.4 — Trợ từ を/に/で/へ', href: lesson('jpd113-tro-tu-wo-ni-de-e') }],
          },
          {
            id: 'd3-part-to',
            title: 'と · や…など · から…まで',
            detail:
              'と = liệt kê ĐẦY ĐỦ ("A và B, hết") · や…など = liệt kê VÍ DỤ ("A, B và những thứ khác") · ' +
              'から…まで = từ…đến (dùng cả cho giờ lẫn nơi chốn). ' +
              'Bẫy: 本や (kanji + trợ từ = "sách và…") khác hoàn toàn ほんや (toàn kana = hiệu sách 本屋).',
            minutes: 25,
            tier: 'core',
            kind: 'grammar',
            links: [
              { label: 'Bài 5.6 — と vs や…など', href: lesson('jpd113-to-ya-nado') },
              { label: 'Bài 6.4 — から～まで', href: lesson('jpd113-kara-made') },
            ],
          },
        ],
      },
      {
        id: 'd3-b2',
        label: 'Khối 2 · Chỉ định & từ để hỏi',
        goal: 'Hai nhóm ra đề lặp đi lặp lại trong cả 14 đề',
        tasks: [
          {
            id: 'd3-kore',
            title: 'これ/それ/あれ  vs  この/その/あの  vs  ここ/そこ/あそこ',
            detail:
              'これ = "cái này" đứng MỘT MÌNH · この = "…này" phải có danh từ đi ngay sau (この本) · ' +
              'ここ = "chỗ này". Mẹo làm bài: nhìn ngay sau chỗ trống — có danh từ trần thì chọn この/その/あの, ' +
              'không có thì chọn これ/それ/あれ. Quy tắc này giải được gần hết dạng câu đó.',
            minutes: 35,
            tier: 'core',
            kind: 'grammar',
            links: [
              { label: 'Bài 5.1 — これ/それ/あれ', href: lesson('jpd113-bai-2-3-ngu-phap') },
              { label: 'Bài 5.2 — この/その/あの', href: lesson('jpd113-kono-sono-ano') },
            ],
          },
          {
            id: 'd3-question-words',
            title: '6 từ để hỏi + mẹo suy ngược',
            detail:
              'なに (cái gì) · だれ (ai) · どこ (ở đâu) · いつ (khi nào) · なん+trợ số từ (何時/何人/何曜日) · ' +
              'どちら (bên nào / ở đâu — lịch sự). Mẹo làm bài: ĐỌC ĐÁP ÁN TRƯỚC rồi suy ngược ra câu hỏi — ' +
              'đáp án là giờ thì hỏi 何時, là người thì hỏi だれ. Nhanh hơn dịch cả câu.',
            minutes: 30,
            tier: 'core',
            kind: 'grammar',
            links: [{ label: 'Bài 5.3 — 6 từ để hỏi', href: lesson('jpd113-tu-de-hoi') }],
          },
          {
            id: 'd3-kochira',
            title: 'こちら/そちら/あちら & どこの/なんの',
            detail:
              'こちら = bản lịch sự của ここ, cũng dùng để giới thiệu NGƯỜI (こちらはキムさんです — có trong bài đọc 2 và 4). ' +
              'どこのN = xuất xứ (どこのビール = bia nước nào) · なんのN = thể loại (なんのカレー = cà ri loại gì).',
            minutes: 20,
            tier: 'plus',
            kind: 'grammar',
            links: [{ label: 'Bài 5.5 — こちら, どこの/なんの', href: lesson('jpd113-kochira-dokono-nanno') }],
          },
        ],
      },
      {
        id: 'd3-b3',
        label: 'Khối 3 · Động từ',
        goal: 'Thể ます — toàn bộ động từ của môn này',
        tasks: [
          {
            id: 'd3-masu',
            title: '4 dạng của thể ます',
            detail:
              'たべます (sẽ/thường ăn) · たべません (không ăn) · たべました (đã ăn) · たべませんでした (đã không ăn). ' +
              'Chỉ 4 dạng này, không có chia bất quy tắc nào ở trình độ A1.1 — học 15 phút là xong.',
            minutes: 25,
            tier: 'core',
            kind: 'grammar',
            links: [{ label: 'Bài 6.1 — Thể ます', href: lesson('jpd113-masu-form') }],
          },
          {
            id: 'd3-verbs-20',
            title: '20 động từ thường gặp + trợ từ đi kèm',
            detail:
              'Học động từ theo CỤM có trợ từ, đừng học lẻ: ごはんを たべます / 学校へ 行きます / ' +
              'うちで べんきょうします / 7時に おきます / バスで 行きます. ' +
              'Ngoại lệ nhớ kỹ: đi bộ = あるいて (KHÔNG phải あるきで).',
            minutes: 35,
            tier: 'core',
            kind: 'grammar',
            links: [{ label: 'Bài 6.2 — Động từ & trợ từ', href: lesson('jpd113-dong-tu-thuong-gap') }],
          },
          {
            id: 'd3-doko-mo',
            title: 'どこも / なにも + phủ định',
            detail:
              'どこも 行きません (không đi đâu cả) đi với động từ chỉ DI CHUYỂN; ' +
              'なにも しません (không làm gì cả) đi với động từ hành động. ' +
              'Đề thật từng có câu đánh đúng vào chỗ lẫn hai cái này.',
            minutes: 15,
            tier: 'plus',
            kind: 'grammar',
            links: [{ label: 'Bài 6.3 — Di chuyển đầy đủ', href: lesson('jpd113-idou-full') }],
          },
        ],
      },
      {
        id: 'd3-b4',
        label: 'Khối 4 · Cày đề',
        goal: 'Ba đề liên tiếp — bắt đầu thấy các mẫu câu lặp lại',
        tasks: [
          {
            id: 'd3-exam-234',
            title: 'Làm Đề 2, 3, 4 (mỗi đề 45 phút)',
            detail:
              'Làm liền mạch, xem lại ngay sau mỗi đề chứ đừng để dồn. Từ đề thứ ba trở đi bạn sẽ nhận ra ' +
              'các đề dùng lại rất nhiều mẫu câu — nhận ra mẫu chính là cách điểm tăng nhanh nhất.',
            minutes: 135,
            tier: 'core',
            kind: 'exam',
            links: [{ label: 'Phòng thi — 14 đề FE thật', href: EXAM_FE }],
          },
          {
            id: 'd3-exam-log',
            title: 'Cập nhật sổ lỗi + đọc lại từ đầu',
            detail: 'Gộp lỗi của 4 đề đã làm, tìm xem mình sai TẬP TRUNG vào nhóm nào (số? trợ từ? từ vựng?).',
            minutes: 25,
            tier: 'core',
            kind: 'review',
          },
        ],
      },
      {
        id: 'd3-b5',
        label: 'Khối 5 · Thi nói (rải đều)',
        goal: 'Thêm 3 bài đọc + nhóm câu hỏi thứ hai',
        tasks: [
          {
            id: 'd3-speak-read678',
            title: 'Đọc to bài 6, 7, 8',
            detail:
              'Bài 7 là bài KHÓ NHẤT về mặt từ ngữ (kính ngữ nhà hàng: いらっしゃいませ, かしこまりました, ' +
              'しょうしょうおまちください). Bạn chỉ cần ĐỌC đúng, không cần hiểu — học chúng như một khối âm thanh.',
            minutes: 30,
            tier: 'core',
            kind: 'speaking',
          },
          {
            id: 'd3-speak-group23',
            title: 'Thuộc trả lời Nhóm 2 & 3 (cảm nhận, giờ giấc)',
            detail:
              'にほんのりょうりはどうですか → とてもおいしいです. ' +
              'なんじにおきますか → わたしはまいにち、○時におきます. Dùng đúng giờ THẬT của bạn cho dễ nhớ.',
            minutes: 25,
            tier: 'core',
            kind: 'speaking',
          },
        ],
      },
    ],
  },

  /* ─────────────────────── NGÀY 4 ─────────────────────── */
  {
    n: 4,
    date: '2026-08-05',
    dow: 'Thứ Tư',
    title: 'Thi nói, đọc hiểu & kanji',
    mission:
      'Hôm nay dồn toàn lực vào hai phần "học thuộc được": thi nói (ngân hàng đã biết trước 100%) ' +
      'và kanji. Đây là ngày dễ kiếm điểm 9-10 nhất, vì bạn biết trước đề.',
    outcome:
      'Đọc trôi cả 13 bài không vấp; trả lời được bất kỳ câu nào trong 22 câu mà không cần nghĩ; ' +
      'nhận mặt 35 kanji của môn.',
    blocks: [
      {
        id: 'd4-b1',
        label: 'Khối 1 · READING (30/100 điểm thi nói)',
        goal: 'Cả 13 bài, không vấp',
        tasks: [
          {
            id: 'd4-read-all13',
            title: 'Đọc to lần lượt cả 13 bài, ghi âm lại',
            detail:
              'Nghe lại bản ghi: chỗ nào ngập ngừng, đọc sai trường âm, hoặc đọc sai số — đánh dấu và đọc lại 3 lượt. ' +
              '11/13 bài dựng theo cùng một khung: tên/quốc tịch → nghề hoặc trường → lịch tuần (から…まで) → sở thích. ' +
              'Đọc trôi một bài là gần như đọc trôi cả nhóm.',
            minutes: 75,
            tier: 'core',
            kind: 'speaking',
            links: [
              { label: 'S.2 — Bài đọc 1–7', href: lesson('jpd113-speaking-doc-1-7') },
              { label: 'S.3 — Bài đọc 8–13', href: lesson('jpd113-speaking-doc-8-13') },
            ],
          },
          {
            id: 'd4-read-hard',
            title: 'Đánh riêng 3 bài khó: bài 5, 7, 9',
            detail:
              'Bài 9 khó nhất vì MỌI con số đều viết bằng kanji (九時, 四時, 三つ, 三時間, 七時, 十一時, 一日) — ' +
              'phải chuyển kanji → cách đọc ngay tại chỗ. Mẹo: trước khi đọc, khoanh mọi kanji số và đọc thầm ' +
              'chúng một lượt — 10 giây đó ngăn được cú đứng hình giữa câu.',
            minutes: 35,
            tier: 'core',
            kind: 'speaking',
          },
          {
            id: 'd4-read-30s',
            title: 'Tập dùng 30 giây chuẩn bị',
            detail:
              'Trong phòng thi bạn có 30 giây trước khi đọc. ĐỪNG dịch bài. Quét đúng ba thứ: ' +
              '(1) mọi con số → đọc thầm cách đọc, (2) mọi từ katakana, (3) vị trí は・を・に・で・から・まで để biết chỗ lấy hơi. ' +
              'Bấm giờ tập đúng quy trình này với 5 bài bất kỳ.',
            minutes: 20,
            tier: 'core',
            kind: 'speaking',
          },
        ],
      },
      {
        id: 'd4-b2',
        label: 'Khối 2 · TALKING (60/100 điểm thi nói)',
        goal: 'Phần nặng điểm nhất của bài thi nói',
        tasks: [
          {
            id: 'd4-talk-22',
            title: 'Chạy hết 22 câu hỏi không tranh',
            detail:
              'Giám thị chọn 1 trong 4 câu, nhưng bạn không biết trước là câu nào — nên phải chạy hết. ' +
              'Chiến thuật: đừng học 22 câu trả lời rời rạc, hãy thuộc MỘT câu thật về bản thân cho mỗi nhóm ' +
              'rồi tái sử dụng. Bẫy: câu 22 なんで = "bằng phương tiện gì" chứ KHÔNG phải "tại sao".',
            minutes: 45,
            tier: 'core',
            kind: 'speaking',
            links: [{ label: 'S.4 — 22 câu hỏi', href: lesson('jpd113-speaking-cau-hoi-khong-tranh') }],
          },
          {
            id: 'd4-talk-pictures',
            title: 'Chạy 6 bộ tranh (37 câu)',
            detail:
              'Dạng có tranh luôn hỏi ba thứ: đây là cái gì (これは何ですか) · của ai (だれのですか) · ' +
              'giá bao nhiêu / mấy giờ / ở tầng nào. Trả lời bằng câu đủ ～です, đừng trả lời cụt lủn.',
            minutes: 35,
            tier: 'core',
            kind: 'speaking',
            links: [{ label: 'S.5 — 6 bộ tranh', href: lesson('jpd113-speaking-cau-hoi-co-tranh') }],
          },
          {
            id: 'd4-talk-mock',
            title: 'Thi thử vấn đáp trong Phòng thi',
            detail:
              'Phòng thi có 5 đề vấn đáp chấm theo đúng rubric READING 30 / TALKING 60 / PRESENTING 10. ' +
              'Làm ít nhất 2 đề để quen quy trình.',
            minutes: 40,
            tier: 'plus',
            kind: 'speaking',
            links: [{ label: 'Phòng thi — 5 đề vấn đáp', href: EXAM_SPEAKING }],
          },
        ],
      },
      {
        id: 'd4-b3',
        label: 'Khối 3 · Kanji & đọc hiểu',
        goal: '~22% đề FE là câu về kanji',
        tasks: [
          {
            id: 'd4-kanji-35',
            title: '35 kanji của môn, học theo thứ tự tần suất',
            detail:
              'Học theo số lần xuất hiện thật trong 420 câu đề: 私 (86 lần — nhiều nhất), 時 (66), 何 (57), ' +
              '生 (38), 才 (36), 円 (29)… Nếu chỉ kịp học 10 chữ thì học 10 chữ đầu bảng này. ' +
              'Luôn học kanji TRONG TỪ GHÉP (学生, 日本語, 先生), đừng học chữ lẻ.',
            minutes: 50,
            tier: 'core',
            kind: 'kanji',
            links: [
              { label: 'Bài 7.2 — Kanji số & thời gian', href: lesson('jpd113-kanji-so-thoi-gian') },
              { label: 'Bài 7.3 — Kanji người & đời sống', href: lesson('jpd113-kanji-nguoi-truong-hoc') },
            ],
          },
          {
            id: 'd4-kanji-onkun',
            title: 'Quy tắc đoán âm On/Kun',
            detail:
              'Kanji ghép với kanji khác → thường đọc âm On (日本人 = にほんじん). ' +
              'Kanji đứng một mình hoặc kèm hiragana → thường đọc âm Kun (人 = ひと). ' +
              'Không phải luật cứng nhưng đúng phần lớn trường hợp — đủ để đoán trong phòng thi.',
            minutes: 15,
            tier: 'plus',
            kind: 'kanji',
            links: [{ label: 'Bài 7.1 — Kanji đầu tiên', href: lesson('jpd113-kanji') }],
          },
          {
            id: 'd4-reading-exams',
            title: 'Làm 5 đề Đọc hiểu trong Phòng thi',
            detail:
              'Mỗi đề = một đoạn văn + câu hỏi trắc nghiệm, kèm sẵn romaji, bản dịch và ghi chú kanji để tự học. ' +
              'Sáu đề đầu là bài đọc GỐC của giáo viên — ưu tiên làm mấy đề này trước.',
            minutes: 60,
            tier: 'core',
            kind: 'reading',
            links: [{ label: 'Phòng thi — 16 đề đọc hiểu', href: EXAM_READING }],
          },
        ],
      },
      {
        id: 'd4-b4',
        label: 'Khối 4 · Cày đề FE',
        goal: 'Ba đề nữa — tổng cộng 7/14 đề',
        tasks: [
          {
            id: 'd4-exam-567',
            title: 'Làm Đề 5, 6, 7',
            detail:
              'Đến đây tốc độ phải đạt ~1,5 phút/câu. Nếu vẫn còn hết giờ trước khi làm xong, ' +
              'vấn đề nằm ở tốc độ đọc kana — quay lại luyện đọc, không phải luyện ngữ pháp.',
            minutes: 135,
            tier: 'core',
            kind: 'exam',
            links: [{ label: 'Phòng thi — 14 đề FE thật', href: EXAM_FE }],
          },
        ],
      },
    ],
  },

  /* ─────────────────────── NGÀY 5 ─────────────────────── */
  {
    n: 5,
    date: '2026-08-06',
    dow: 'Thứ Năm',
    title: 'NGÀY THI — tổng duyệt & vào phòng',
    mission:
      'Hôm nay KHÔNG học kiến thức mới. Chỉ củng cố cái đã có và giữ đầu óc tỉnh táo. ' +
      'Học chữ mới vào sáng ngày thi chỉ làm loãng những gì đã thuộc.',
    outcome: 'Vào phòng thi với 4 câu tác phong, 3 bài đọc khó và bảng số nằm sẵn trong đầu.',
    blocks: [
      {
        id: 'd5-b1',
        label: 'Khối 1 · Tổng duyệt (buổi sáng)',
        goal: 'Chạm lại mọi thứ một lượt, không đào sâu',
        tasks: [
          {
            id: 'd5-cheatsheet',
            title: 'Đọc lướt toàn bộ cheat-sheet trên trang này',
            detail:
              'Chỉ ĐỌC LƯỚT, không dừng lại học. Mục tiêu là đánh thức trí nhớ chứ không nạp thêm. ' +
              'Dừng lâu hơn ở bảng số bất quy tắc và bảng trợ từ.',
            minutes: 30,
            tier: 'core',
            kind: 'review',
          },
          {
            id: 'd5-read-hard3',
            title: 'Đọc to lần cuối 3 bài khó (5, 7, 9)',
            detail: 'Ba bài này mà trôi thì 10 bài còn lại chắc chắn trôi.',
            minutes: 20,
            tier: 'core',
            kind: 'speaking',
          },
          {
            id: 'd5-talk-run',
            title: 'Chạy nhanh 22 câu trả lời của bản thân',
            detail: 'Nói to, mỗi câu một lượt, không dừng sửa. Sai chỗ nào bỏ qua, đi tiếp.',
            minutes: 20,
            tier: 'core',
            kind: 'speaking',
          },
          {
            id: 'd5-errorlog',
            title: 'Đọc sổ lỗi lần cuối',
            detail: 'Đây là tài liệu giá trị nhất bạn có lúc này — nó là danh sách đúng những lỗi CỦA BẠN.',
            minutes: 20,
            tier: 'core',
            kind: 'review',
          },
        ],
      },
      {
        id: 'd5-b2',
        label: 'Khối 2 · Trước giờ thi',
        goal: 'Giữ tay quen đề, không để nguội',
        tasks: [
          {
            id: 'd5-final-exam',
            title: 'Làm 1 đề FE bấm giờ (đề chưa từng làm)',
            detail:
              'Chọn một đề trong số đề chưa đụng tới. Đừng chấm điểm để tự dằn vặt — mục đích chỉ là ' +
              'làm nóng phản xạ trước khi vào phòng.',
            minutes: 45,
            tier: 'core',
            kind: 'exam',
            links: [{ label: 'Phòng thi — 14 đề FE thật', href: EXAM_FE }],
          },
          {
            id: 'd5-manner',
            title: 'Nhẩm lại 4 câu tác phong',
            detail:
              'しつれいします → よろしくおねがいします → ありがとうございました → しつれいしました. ' +
              '10 điểm PRESENTING nằm gọn trong 4 câu này cộng với việc ngồi thẳng và nhìn giám thị.',
            minutes: 10,
            tier: 'core',
            kind: 'speaking',
          },
        ],
      },
      {
        id: 'd5-b3',
        label: 'Khối 3 · Trong phòng thi',
        goal: 'Chiến thuật làm bài',
        tasks: [
          {
            id: 'd5-tactic-fe',
            title: 'Trắc nghiệm: không để trống câu nào',
            detail:
              '30 câu / 45 phút. Câu nào bí thì đánh dấu, đoán tạm một đáp án rồi đi tiếp — quay lại sau. ' +
              'Loại trước các đáp án sai rõ ràng rồi hãy chọn. Bỏ trống chắc chắn 0 điểm, đoán thì còn 25%.',
            minutes: 5,
            tier: 'core',
            kind: 'exam',
          },
          {
            id: 'd5-tactic-speak',
            title: 'Thi nói: đọc CHẬM và RÕ, đừng đọc nhanh',
            detail:
              'Phần đọc chấm độ chính xác, không chấm tốc độ. Đọc sai một số rồi tự sửa lại vẫn hơn là đọc lướt cho xong. ' +
              'Không nghe rõ câu hỏi thì nói もういちど おねがいします (xin nhắc lại) — hỏi lại KHÔNG bị trừ điểm.',
            minutes: 5,
            tier: 'core',
            kind: 'speaking',
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

export const dayMinutes = (d: StudyDay) =>
  d.blocks.flatMap((b) => b.tasks).reduce((s, t) => s + t.minutes, 0);

export const KIND_META: Record<TaskKind, { label: string; color: string }> = {
  kana: { label: 'Kana', color: '#22d3ee' },
  number: { label: 'Số & giờ', color: '#fb923c' },
  grammar: { label: 'Ngữ pháp', color: '#8b5cf6' },
  kanji: { label: 'Kanji', color: '#f43f5e' },
  vocab: { label: 'Từ vựng', color: '#4ade80' },
  speaking: { label: 'Thi nói', color: '#ec4899' },
  reading: { label: 'Đọc hiểu', color: '#3b82f6' },
  exam: { label: 'Đề thi', color: '#fbbf24' },
  review: { label: 'Ôn lại', color: '#94a3b8' },
};
