/**
 * JPD113 — NGÂN HÀNG CÂU FE ĐÃ RA THẬT.
 *
 * Toàn bộ dữ liệu dưới đây KHAI THÁC TỪ 14 ĐỀ FE THẬT (420 câu) đang nằm
 * trong Phòng thi: `content/exams/JPD113.mjs`. Cột `n` là SỐ LẦN câu/mục đó
 * xuất hiện trong 420 câu — mục ra 3-4 lần gần như chắc chắn có mặt trong đề
 * bạn bốc phải.
 *
 * Vì sao tách riêng khỏi `cheatsheet.ts`: cheat-sheet dạy LUẬT (đọc số thế
 * nào, trợ từ nào dùng khi nào). File này là DANH SÁCH CÂU CÓ THẬT — học vẹt
 * thẳng đáp án. Hai thứ khác nhau về mục đích nên không trộn.
 *
 * Đọc kanji ~11% + viết kanji ~11% = ~6-7 câu/đề, và cả hai đều bốc trong
 * đúng hai bảng dưới. Học xong hai bảng đó là đã cầm chắc gần nửa số câu
 * cần để qua mốc 4 điểm (12/30 câu).
 */

/* ══════════════ 1. ĐỌC HÁN TỰ (46 câu thật → 30 mục) ══════════════ */

export interface KanjiReadItem {
  /** Số lần xuất hiện trong 420 câu */
  n: number;
  kanji: string;
  yomi: string;
  vi: string;
  /** Câu văn cảnh đã ra trong đề */
  ctx?: string;
  /** true = bất quy tắc, không suy ra được, phải học vẹt */
  irregular?: boolean;
}

export const KANJI_READ: KanjiReadItem[] = [
  { n: 4, kanji: '時間', yomi: 'じかん', vi: 'thời gian, tiếng đồng hồ', ctx: 'まいにち、3【時間】べんきょうします。' },
  { n: 4, kanji: '学校', yomi: 'がっこう', vi: 'trường học', ctx: 'ミンさんは 日本語【学校】の 先生です。' },
  { n: 3, kanji: '私', yomi: 'わたし', vi: 'tôi', ctx: '【私】は イレナです。' },
  { n: 3, kanji: '二十一才', yomi: 'にじゅういっさい', vi: '21 tuổi', ctx: 'マリーさんは 【二十一才】ですか。', irregular: true },
  { n: 2, kanji: '何分', yomi: 'なんぷん', vi: 'mấy phút', ctx: 'すみません、いま 何時 【何分】ですか。', irregular: true },
  { n: 2, kanji: '百円', yomi: 'ひゃくえん', vi: '100 yên', ctx: 'ここは【百円】ショップです。' },
  { n: 2, kanji: '四時', yomi: 'よじ', vi: '4 giờ', ctx: 'ハノイは いま ごぜん【四時】です。', irregular: true },
  { n: 2, kanji: '十才', yomi: 'じゅっさい', vi: '10 tuổi', ctx: '田中さんは 【十才】です。', irregular: true },
  { n: 2, kanji: '日本人', yomi: 'にほんじん', vi: 'người Nhật', ctx: 'やまださんは 【日本人】です。' },
  { n: 2, kanji: '一万', yomi: 'いちまん', vi: '10.000 (một vạn)', ctx: 'これは【一万】円です。', irregular: true },
  { n: 1, kanji: '八分', yomi: 'はっぷん', vi: '8 phút', ctx: 'B: 六時【八分】です。', irregular: true },
  { n: 1, kanji: '十分', yomi: 'じゅっぷん', vi: '10 phút', ctx: 'B: 三時【十分】です。', irregular: true },
  { n: 1, kanji: '二十一分', yomi: 'にじゅういっぷん', vi: '21 phút', ctx: 'B：三時【二十一分】です。', irregular: true },
  { n: 1, kanji: '九時', yomi: 'くじ', vi: '9 giờ', ctx: 'ロンドンは いま ごご【九時】です。', irregular: true },
  { n: 1, kanji: '日曜日', yomi: 'にちようび', vi: 'Chủ Nhật', ctx: 'としょかんの やすみは 土曜日と 【日曜日】です。' },
  { n: 1, kanji: '土曜日', yomi: 'どようび', vi: 'thứ Bảy', ctx: 'きょうは 【土曜日】です。' },
  { n: 1, kanji: '水曜日', yomi: 'すいようび', vi: 'thứ Tư', ctx: 'A：やすみは 何曜日ですか。B：【水曜日】です。' },
  { n: 1, kanji: '三千', yomi: 'さんぜん', vi: '3.000', ctx: 'このほんは【三千】円です。', irregular: true },
  { n: 1, kanji: '八千五百', yomi: 'はっせんごひゃく', vi: '8.500', ctx: 'B：【八千五百】円です。', irregular: true },
  { n: 1, kanji: '九月', yomi: 'くがつ', vi: 'tháng 9', ctx: 'B: 【九月】一日です。', irregular: true },
  { n: 1, kanji: '学生', yomi: 'がくせい', vi: 'học sinh, sinh viên', ctx: 'マリーさんは 【学生】ですか。' },
  { n: 1, kanji: '何日', yomi: 'なんにち', vi: 'ngày mấy', ctx: 'きょうは 【何日】ですか。' },
  { n: 1, kanji: '八才', yomi: 'はっさい', vi: '8 tuổi', ctx: '田中さんは【八才】です。', irregular: true },
  { n: 1, kanji: '五十一才', yomi: 'ごじゅういっさい', vi: '51 tuổi', ctx: 'やまださんは 【五十一才】です。', irregular: true },
  { n: 1, kanji: '十九才', yomi: 'じゅうきゅうさい', vi: '19 tuổi', ctx: 'マルコさんは【十九才】です。' },
  { n: 1, kanji: '日本', yomi: 'にほん', vi: 'Nhật Bản', ctx: '田中さんの おくには【日本】です。' },
  { n: 1, kanji: '二十日', yomi: 'はつか', vi: 'ngày 20', ctx: 'りゅうがくせいパーティーは 十二月【二十日】です。', irregular: true },
  { n: 1, kanji: '三日', yomi: 'みっか', vi: 'ngày mùng 3', ctx: 'B：二月【三日】です。', irregular: true },
  { n: 1, kanji: '二日', yomi: 'ふつか', vi: 'ngày mùng 2', ctx: 'たんじょうびは 一月【二日】です。', irregular: true },
];

/* ══════════════ 2. VIẾT HÁN TỰ (45 câu thật → 27 mục) ══════════════ */

export interface KanjiWriteItem {
  n: number;
  kana: string;
  kanji: string;
  vi: string;
  ctx?: string;
  irregular?: boolean;
}

export const KANJI_WRITE: KanjiWriteItem[] = [
  { n: 4, kana: 'なんさい', kanji: '何才', vi: 'mấy tuổi', ctx: 'アリさんは【なんさい】ですか。' },
  { n: 4, kana: 'じかん', kanji: '時間', vi: 'thời gian', ctx: 'いまは やすみの 【じかん】です。' },
  { n: 3, kana: 'ごじ', kanji: '五時', vi: '5 giờ', ctx: 'いま、【ごじ】です。' },
  { n: 3, kana: 'ここのか', kanji: '九日', vi: 'ngày mùng 9', ctx: 'きょうは 【ここのか】ですか。', irregular: true },
  { n: 2, kana: 'にほん', kanji: '日本', vi: 'Nhật Bản', ctx: 'A: おくには どちらですか。B: 【にほん】です。' },
  { n: 2, kana: 'なんぷん', kanji: '何分', vi: 'mấy phút', ctx: 'いま、なんじ 【なんぷん】ですか。' },
  { n: 2, kana: 'もくようび', kanji: '木曜日', vi: 'thứ Năm', ctx: 'たいいくかんの やすみは 【もくようび】です。' },
  { n: 2, kana: 'ほん', kanji: '本', vi: 'sách / cây (đếm vật dài)', ctx: 'これは 【ほん】ですか。' },
  { n: 2, kana: 'がくせい', kanji: '学生', vi: 'học sinh, sinh viên', ctx: 'アリさんは 【がくせい】ですか。' },
  { n: 2, kana: 'げつようび', kanji: '月曜日', vi: 'thứ Hai', ctx: 'やすみは 【げつようび】です。' },
  { n: 2, kana: 'にひゃくまん', kanji: '二百万', vi: '2.000.000 (hai trăm vạn)', ctx: 'このとけいは 【にひゃくまん】えんです。', irregular: true },
  { n: 2, kana: 'にまんよんせんはっぴゃく', kanji: '二万四千八百', vi: '24.800', ctx: 'このかばんは【にまんよんせんはっぴゃく】えんです。', irregular: true },
  { n: 1, kana: 'じん', kanji: '人', vi: 'người', ctx: 'キムさんは インド 【じん】じゃありません。' },
  { n: 1, kana: 'すいようび', kanji: '水曜日', vi: 'thứ Tư', ctx: 'たなかさんは 【すいようび】に がっこうで おんがくを べんきょうします。' },
  { n: 1, kana: 'さんがつ', kanji: '三月', vi: 'tháng 3', ctx: '私の たんじょうびは 【さんがつ】九日です。' },
  { n: 1, kana: 'ついたち', kanji: '一日', vi: 'ngày mùng 1', ctx: 'たんじょうびは 2月 【ついたち】です。', irregular: true },
  { n: 1, kana: 'はつか', kanji: '二十日', vi: 'ngày 20', ctx: 'B: 3月 【はつか】です。', irregular: true },
  { n: 1, kana: 'みっか', kanji: '三日', vi: 'ngày mùng 3', ctx: 'マルコさんの たんじょうびは 5月【みっか】です。', irregular: true },
  { n: 1, kana: 'なんじ', kanji: '何時', vi: 'mấy giờ', ctx: 'まいあさ、【なんじ】に がっこうへ いきますか。' },
  { n: 1, kana: 'ごふん', kanji: '五分', vi: '5 phút', ctx: 'いま いちじ 【ごふん】です。' },
  { n: 1, kana: 'じゅっぷん', kanji: '十分', vi: '10 phút', ctx: 'いま、ろくじ【じゅっぷん】です。', irregular: true },
  { n: 1, kana: 'じゅっさい', kanji: '十才', vi: '10 tuổi', ctx: 'B：【じゅっさい】です。', irregular: true },
  { n: 1, kana: 'ごじゅうにさい', kanji: '五十二才', vi: '52 tuổi', ctx: 'たなかさんは 【ごじゅうにさい】です。' },
  { n: 1, kana: 'ろくじゅうはっさい', kanji: '六十八才', vi: '68 tuổi', ctx: 'B：【ろくじゅうはっさい】です。', irregular: true },
  { n: 1, kana: 'いちまんにせん', kanji: '一万二千', vi: '12.000', ctx: 'この トイレットペーパーは 【いちまんにせん】円です。', irregular: true },
  { n: 1, kana: 'はっぴゃくえん', kanji: '八百円', vi: '800 yên', ctx: 'たまごは 【はっぴゃくえん】です。', irregular: true },
  { n: 1, kana: 'フランスご', kanji: 'フランス語', vi: 'tiếng Pháp', ctx: 'B: 私は 【フランスご】の きょうしです。' },
];

/* ══════════════ 3. ĐIỀN CHỖ TRỐNG — CÂU LẶP LẠI ══════════════ */

export interface BlankItem {
  n: number;
  /** Câu tiếng Nhật, chỗ trống là （ ） */
  jp: string;
  /** Nghĩa cả câu (đã điền sẵn đáp án) */
  vi: string;
  ans: string;
  /** Vì sao đáp án đó đúng */
  why?: string;
  group: BlankGroup;
}

export type BlankGroup =
  | 'Chào hỏi & giao tiếp'
  | 'Trợ từ'
  | 'Từ để hỏi'
  | 'Chỉ định (これ/この)'
  | 'Động từ & thể phủ định'
  | 'Từ vựng theo ngữ cảnh';

export const BLANK_GROUPS: BlankGroup[] = [
  'Chào hỏi & giao tiếp',
  'Trợ từ',
  'Từ để hỏi',
  'Chỉ định (これ/この)',
  'Động từ & thể phủ định',
  'Từ vựng theo ngữ cảnh',
];

export const BLANKS: BlankItem[] = [
  /* ── Chào hỏi & giao tiếp ── */
  {
    n: 6,
    jp: 'A「にほんへ いきます。」B「へえ。（ ）。」',
    vi: 'A: "Tôi sẽ đi Nhật." — B: "Ồ. Vậy à."',
    ans: 'そうですか',
    why: 'Nghe tin mới của người khác thì đáp lại bằng そうですか (Vậy à / Thế à).',
    group: 'Chào hỏi & giao tiếp',
  },
  {
    n: 4,
    jp: 'A「（ ）。おなまえは？」B「あ、サントスです。」',
    vi: 'A: "Xin lỗi cho hỏi. Tên bạn là gì?" — B: "À, tôi là Santos."',
    ans: 'あのう、すみません',
    why: 'Bắt chuyện với người lạ luôn mở đầu bằng あのう、すみません.',
    group: 'Chào hỏi & giao tiếp',
  },
  {
    n: 3,
    jp: 'A「けいたいでんわは どこですか。」B「あちらです。」A「（ ）、ありがとうございます。」',
    vi: 'A: "Điện thoại ở đâu ạ?" — B: "Ở phía kia." — A: "À, cảm ơn ạ."',
    ans: 'あ',
    why: 'あ = tiếng thốt lên khi vừa hiểu ra. Không phải はい.',
    group: 'Chào hỏi & giao tiếp',
  },
  {
    n: 3,
    jp: 'A「日曜日 こうえんで バーベキューを します。」B「（ ）。」',
    vi: 'A: "Chủ Nhật tôi nướng BBQ ở công viên." — B: "Hay quá nhỉ."',
    ans: 'いいですね',
    why: 'Khen/hưởng ứng kế hoạch của người khác = いいですね.',
    group: 'Chào hỏi & giao tiếp',
  },
  {
    n: 2,
    jp: 'てんいん「（ ）。」アリさん「すみません。でんしじしょは どこですか。」',
    vi: 'Nhân viên: "Xin mời quý khách." — Ali: "Xin lỗi, từ điển điện tử ở đâu ạ?"',
    ans: 'いらっしゃいませ',
    why: 'Câu nhân viên cửa hàng chào khách. Chỉ nhân viên nói, khách không nói.',
    group: 'Chào hỏi & giao tiếp',
  },
  {
    n: 2,
    jp: 'A「はじめまして、パクです。（ ）。」B「こちらこそ。」',
    vi: 'A: "Rất vui được gặp, tôi là Park. Mong được giúp đỡ." — B: "Tôi cũng vậy."',
    ans: 'よろしく おねがいします',
    group: 'Chào hỏi & giao tiếp',
  },
  {
    n: 2,
    jp: 'A「はじめまして、パクです。よろしくおねがいします。」B「ナタポンです。（ ）よろしくおねがいします。」',
    vi: 'B: "Tôi là Nataporn. Tôi cũng vậy, mong được giúp đỡ."',
    ans: 'こちらこそ',
    why: 'こちらこそ = "phía tôi mới phải" — đáp lại よろしくおねがいします.',
    group: 'Chào hỏi & giao tiếp',
  },
  {
    n: 2,
    jp: 'A：ただいま。B：（ ）。',
    vi: 'A: "Con/anh về rồi." — B: "Mừng bạn về."',
    ans: 'おかえりなさい',
    why: 'Cặp cố định ただいま ↔ おかえりなさい. Đừng nhầm với いってきます ↔ いってらっしゃい.',
    group: 'Chào hỏi & giao tiếp',
  },
  {
    n: 2,
    jp: 'A「（ ）いま 何時ですか。」B「10時です。」',
    vi: 'A: "Xin lỗi, bây giờ mấy giờ ạ?" — B: "10 giờ."',
    ans: 'すみません',
    group: 'Chào hỏi & giao tiếp',
  },
  {
    n: 1,
    jp: 'アリさん「すみません、ちゅうもんを おねがいします。」てんいん「（ ）。」',
    vi: 'Ali: "Xin lỗi, cho tôi gọi món." — Nhân viên: "Xin mời ạ."',
    ans: 'どうぞ',
    group: 'Chào hỏi & giao tiếp',
  },

  /* ── Trợ từ ── */
  {
    n: 4,
    jp: 'A：まいにち、あさごはんを 食べますか。B：いいえ、私は あさ、なに（ ）食べません。',
    vi: 'A: "Hằng ngày bạn có ăn sáng không?" — B: "Không, buổi sáng tôi chẳng ăn gì cả."',
    ans: 'も',
    why: 'なに＋も＋thể phủ định = "chẳng … gì cả". Cấu trúc bắt buộc đi với ません.',
    group: 'Trợ từ',
  },
  {
    n: 3,
    jp: 'これは かんこく（ ）かばんです。',
    vi: 'Đây là cặp của Hàn Quốc.',
    ans: 'の',
    why: 'Danh từ + の + danh từ = sở hữu / xuất xứ.',
    group: 'Trợ từ',
  },
  {
    n: 3,
    jp: 'ミラーさんは 学生です。やまださん（ ）学生です。',
    vi: 'Anh Miller là sinh viên. Anh Yamada cũng là sinh viên.',
    ans: 'も',
    why: 'も thay chỗ は khi muốn nói "cũng".',
    group: 'Trợ từ',
  },
  {
    n: 2,
    jp: 'これは えいご（ ）なんですか。',
    vi: 'Cái này tiếng Anh gọi là gì?',
    ans: 'で',
    why: 'で chỉ PHƯƠNG TIỆN, ở đây là phương tiện ngôn ngữ.',
    group: 'Trợ từ',
  },
  {
    n: 2,
    jp: 'ミラーさんは ごはん（ ）さかななどを たべます。',
    vi: 'Anh Miller ăn cơm, cá và những thứ khác.',
    ans: 'や',
    why: 'や = liệt kê VÍ DỤ (chưa hết), thường đi với など. と = liệt kê HẾT.',
    group: 'Trợ từ',
  },
  {
    n: 2,
    jp: 'A：おしごと（ ）？ B：きょうしです。',
    vi: 'A: "Còn công việc thì?" — B: "Tôi là giáo viên."',
    ans: 'は',
    why: 'は đánh dấu chủ đề; bỏ lửng cuối câu là cách hỏi tắt lịch sự.',
    group: 'Trợ từ',
  },
  {
    n: 2,
    jp: 'まいにち、何時（ ）何時（ ）べんきょうしますか。',
    vi: 'Hằng ngày bạn học từ mấy giờ đến mấy giờ?',
    ans: 'から／まで',
    group: 'Trợ từ',
  },
  {
    n: 2,
    jp: 'カレーを 2つ（ ）コーヒーを 2つ（ ）ください。',
    vi: 'Cho tôi 2 phần cà ri và 2 cà phê.',
    ans: 'と／✕ (bỏ trống)',
    why: 'と nối hai món; sau món cuối KHÔNG có trợ từ, đi thẳng vào ください.',
    group: 'Trợ từ',
  },
  {
    n: 2,
    jp: '私は まいあさ（ ）6時（ ）おきます。',
    vi: 'Mỗi sáng tôi dậy lúc 6 giờ.',
    ans: '✕ (bỏ trống)／に',
    why: 'まいあさ KHÔNG có số nên không thêm に. 6時 có số nên bắt buộc に.',
    group: 'Trợ từ',
  },
  {
    n: 2,
    jp: 'A：レストラン（ ）どこです（ ）。',
    vi: 'Nhà hàng thì ở đâu vậy?',
    ans: 'は／か',
    group: 'Trợ từ',
  },
  {
    n: 2,
    jp: '日曜日、うち（ ）おんがくを（ ）。',
    vi: 'Chủ Nhật, ở nhà tôi nghe nhạc.',
    ans: 'で／ききます',
    why: 'で = nơi diễn ra hành động (không phải đích đến).',
    group: 'Trợ từ',
  },
  {
    n: 2,
    jp: 'としょかん（ ）いきます。としょかん（ ）日本語を べんきょうします。',
    vi: 'Tôi đi đến thư viện. Tôi học tiếng Nhật ở thư viện.',
    ans: 'へ／で',
    why: 'CẶP ĐỐI CHIẾU KINH ĐIỂN: へ = đích đến, で = nơi hành động diễn ra.',
    group: 'Trợ từ',
  },
  {
    n: 2,
    jp: '日曜日 どこ（ ）いきません。',
    vi: 'Chủ Nhật tôi chẳng đi đâu cả.',
    ans: 'も',
    why: 'どこも + いきません. Lưu ý どこも đi với いきます, なにも đi với します/たべます.',
    group: 'Trợ từ',
  },
  {
    n: 1,
    jp: 'あさ、何時（ ）大学へ きますか。',
    vi: 'Buổi sáng bạn đến trường đại học lúc mấy giờ?',
    ans: 'に',
    group: 'Trợ từ',
  },
  {
    n: 1,
    jp: 'しゅみ（ ）スポーツ（ ）りょこうです。',
    vi: 'Sở thích của tôi là thể thao và du lịch.',
    ans: 'は／と',
    group: 'Trợ từ',
  },

  /* ── Từ để hỏi ── */
  {
    n: 3,
    jp: 'A：これは（ ）のスープですか。B：さかなとやさいのスープです。',
    vi: 'A: "Đây là súp gì?" — B: "Súp cá và rau."',
    ans: 'なん',
    why: 'Hỏi LOẠI/nguyên liệu → なんの. Hỏi chủ sở hữu → だれの. Hỏi xuất xứ → どこの.',
    group: 'Từ để hỏi',
  },
  {
    n: 3,
    jp: 'おくには（ ）ですか。',
    vi: 'Bạn đến từ nước nào?',
    ans: 'どちら',
    why: 'どちら là cách hỏi LỊCH SỰ của どこ. Đi kèm お của おくに.',
    group: 'Từ để hỏi',
  },
  {
    n: 2,
    jp: 'まいあさ（ ）で たべますか。',
    vi: 'Mỗi sáng bạn ăn ở đâu?',
    ans: 'どこ',
    group: 'Từ để hỏi',
  },
  {
    n: 2,
    jp: 'A：すみません、インフォメーションは（ ）ですか。B：あちらです。',
    vi: 'A: "Xin lỗi, quầy thông tin ở đâu ạ?" — B: "Ở phía kia."',
    ans: 'どこ',
    group: 'Từ để hỏi',
  },
  {
    n: 2,
    jp: 'としょかんは（ ）から（ ）までですか。',
    vi: 'Thư viện mở từ thứ mấy đến thứ mấy?',
    ans: '何曜日／何曜日',
    group: 'Từ để hỏi',
  },
  {
    n: 2,
    jp: 'お誕生日は（ ）ですか。',
    vi: 'Sinh nhật bạn khi nào?',
    ans: 'いつ',
    group: 'Từ để hỏi',
  },
  {
    n: 2,
    jp: 'A：これは（ ）の ペンですか。B：せんせいのです。',
    vi: 'A: "Đây là bút của ai?" — B: "Của thầy."',
    ans: 'だれ',
    group: 'Từ để hỏi',
  },
  {
    n: 2,
    jp: 'にちようび、（ ）も しません。',
    vi: 'Chủ Nhật tôi chẳng làm gì cả.',
    ans: 'なに',
    why: 'BẪY: đề thật từng in đáp án どこ nhưng SAI — どこも đi với いきません, còn します phải là なにも.',
    group: 'Từ để hỏi',
  },
  {
    n: 1,
    jp: 'A：これは（ ）の こうちゃですか。B：ベトナムの こうちゃです。',
    vi: 'A: "Đây là hồng trà của nước nào?" — B: "Hồng trà Việt Nam."',
    ans: 'どこ',
    group: 'Từ để hỏi',
  },
  {
    n: 1,
    jp: 'A：Tシャツは（ ）ですか。B：700円です。',
    vi: 'A: "Áo phông bao nhiêu tiền?" — B: "700 yên."',
    ans: 'いくら',
    group: 'Từ để hỏi',
  },
  {
    n: 1,
    jp: '（ ）に かいしゃへ いきますか。',
    vi: 'Bạn đi đến công ty lúc mấy giờ?',
    ans: 'なんじ',
    group: 'Từ để hỏi',
  },
  {
    n: 1,
    jp: 'A：百円ショップは なんかいですか。B：（ ）です。',
    vi: 'A: "Cửa hàng 100 yên ở tầng mấy?" — B: "Tầng 3."',
    ans: 'さんがい',
    why: 'Tầng 3 là さんGAI, không phải さんかい. Chỗ mất điểm kinh điển.',
    group: 'Từ để hỏi',
  },

  /* ── Chỉ định ── */
  {
    n: 4,
    jp: 'A：これは いくらですか。B：（ ）は 千円です。',
    vi: 'A: "Cái này bao nhiêu?" — B: "Cái đó 1.000 yên."',
    ans: 'それ',
    why: 'Người hỏi cầm đồ nên nói これ; người trả lời ở xa phải nói それ. Đổi vai bắt buộc.',
    group: 'Chỉ định (これ/この)',
  },
  {
    n: 3,
    jp: '（ ）ズボンは 私のです。',
    vi: 'Cái quần này là của tôi.',
    ans: 'この',
    why: 'Có danh từ ズボン theo sau → phải dùng この, KHÔNG dùng これ.',
    group: 'Chỉ định (これ/この)',
  },
  {
    n: 3,
    jp: 'A：（ ）くつは いくらですか。B：千円です。',
    vi: 'A: "Đôi giày này bao nhiêu?" — B: "1.000 yên."',
    ans: 'この',
    group: 'Chỉ định (これ/この)',
  },
  {
    n: 2,
    jp: 'A：エスカレーターは どこですか。B：（ ）です。',
    vi: 'A: "Thang cuốn ở đâu?" — B: "Ở phía kia."',
    ans: 'あちら',
    why: 'Chỉ nơi chốn lịch sự: こちら / そちら / あちら / どちら.',
    group: 'Chỉ định (これ/この)',
  },
  {
    n: 2,
    jp: 'A：これは（ ）。B：あ、それは わたしの カメラです。',
    vi: 'A: "Đây là máy ảnh của ai?" — B: "À, đó là máy ảnh của tôi."',
    ans: 'だれの カメラですか',
    group: 'Chỉ định (これ/この)',
  },
  {
    n: 1,
    jp: 'てんいん：いらっしゃいませ。A：けいたいでんわは どこですか。てんいん：（ ）です。',
    vi: 'Nhân viên: "Xin mời." — A: "Điện thoại ở đâu?" — NV: "Ở bên này ạ."',
    ans: 'こちら',
    group: 'Chỉ định (これ/この)',
  },

  /* ── Động từ & phủ định ── */
  {
    n: 3,
    jp: 'A：Bさんは 学生ですか。B：いいえ、（ ）。',
    vi: 'A: "Bạn là sinh viên à?" — B: "Không, tôi là giáo viên."',
    ans: 'きょうしです',
    why: 'Chối xong PHẢI nói sự thật đúng. Chỉ いいえ là mất điểm.',
    group: 'Động từ & thể phủ định',
  },
  {
    n: 3,
    jp: 'あしたも 7時に 学校へ（ ）。',
    vi: 'Ngày mai tôi cũng đến trường lúc 7 giờ.',
    ans: 'きます',
    why: 'BẪY: đề 11 in đáp án ききます (nghe) là SAI — 学校へ đi với きます (đến).',
    group: 'Động từ & thể phủ định',
  },
  {
    n: 2,
    jp: 'A：ふゆやすみ、りょこうを しますか。B：いいえ、（ ）。',
    vi: 'A: "Nghỉ đông bạn có đi du lịch không?" — B: "Không, tôi không đi du lịch."',
    ans: 'りょこうを しません',
    why: 'Câu hỏi ～ますか → phủ định là ～ません (không phải じゃありません).',
    group: 'Động từ & thể phủ định',
  },
  {
    n: 2,
    jp: 'えいがを（ ）。',
    vi: 'Tôi xem phim.',
    ans: 'みます',
    group: 'Động từ & thể phủ định',
  },
  {
    n: 1,
    jp: 'A：キムさんは かいしゃいんですか。キム：いいえ、（ ）。',
    vi: 'A: "Anh Kim là nhân viên công ty à?" — Kim: "Không, tôi không phải nhân viên công ty."',
    ans: 'かいしゃいんじゃありません',
    why: 'Câu hỏi ～ですか (danh từ) → phủ định là ～じゃありません.',
    group: 'Động từ & thể phủ định',
  },
  {
    n: 1,
    jp: 'A：あさ なにを たべますか。B：（ ）たべません。',
    vi: 'A: "Sáng bạn ăn gì?" — B: "Tôi chẳng ăn gì cả."',
    ans: 'なにも',
    group: 'Động từ & thể phủ định',
  },
  {
    n: 1,
    jp: '私は まいばん、10時に しんぶんを（ ）。',
    vi: 'Mỗi tối 10 giờ tôi đọc báo.',
    ans: 'よみます',
    group: 'Động từ & thể phủ định',
  },
  {
    n: 1,
    jp: 'なつやすみ、くにへ（ ）。',
    vi: 'Nghỉ hè bạn có về nước không?',
    ans: 'かえりますか',
    group: 'Động từ & thể phủ định',
  },
  {
    n: 1,
    jp: 'まいあさ、パンと たまごを（ ）。',
    vi: 'Mỗi sáng tôi ăn bánh mì và trứng.',
    ans: 'たべます',
    group: 'Động từ & thể phủ định',
  },

  /* ── Từ vựng theo ngữ cảnh ── */
  {
    n: 3,
    jp: 'これは（ ）です。',
    vi: 'Đây là giấy vệ sinh.',
    ans: 'トイレットペーパー',
    group: 'Từ vựng theo ngữ cảnh',
  },
  {
    n: 3,
    jp: '（ ）にほんごを べんきょうします。',
    vi: 'Hằng ngày tôi học tiếng Nhật.',
    ans: 'まいにち',
    group: 'Từ vựng theo ngữ cảnh',
  },
  {
    n: 2,
    jp: 'レストランで（ ）を します。',
    vi: 'Tôi làm thêm ở nhà hàng.',
    ans: 'アルバイト',
    group: 'Từ vựng theo ngữ cảnh',
  },
  {
    n: 2,
    jp: 'ごぜん（ ）を たべます。',
    vi: 'Buổi sáng tôi ăn bữa sáng.',
    ans: 'あさごはん',
    group: 'Từ vựng theo ngữ cảnh',
  },
  {
    n: 2,
    jp: 'それは とりにくの（ ）です。',
    vi: 'Đó là cà ri thịt gà.',
    ans: 'カレー',
    group: 'Từ vựng theo ngữ cảnh',
  },
  {
    n: 2,
    jp: 'しゅみは（ ）です。',
    vi: 'Sở thích của tôi là đọc sách.',
    ans: 'どくしょ',
    group: 'Từ vựng theo ngữ cảnh',
  },
  {
    n: 2,
    jp: 'A：すみません、これは なんの スープですか。てんいん：（ ）の スープです。',
    vi: 'A: "Đây là súp gì ạ?" — NV: "Là súp thịt lợn."',
    ans: 'ぶたにく',
    group: 'Từ vựng theo ngữ cảnh',
  },
  {
    n: 2,
    jp: '私の（ ）は ダニエルです。',
    vi: 'Tên tôi là Daniel.',
    ans: 'なまえ',
    group: 'Từ vựng theo ngữ cảnh',
  },
  {
    n: 2,
    jp: 'ライスを（ ）ください。',
    vi: 'Cho tôi một phần cơm.',
    ans: 'ひとつ',
    group: 'Từ vựng theo ngữ cảnh',
  },
  {
    n: 2,
    jp: 'A：さとうさん、おしごとは？B：私は（ ）です。',
    vi: 'A: "Anh Sato, công việc của anh?" — B: "Tôi là giáo viên."',
    ans: 'きょうし',
    group: 'Từ vựng theo ngữ cảnh',
  },
  {
    n: 1,
    jp: '（ ）で くだものを かいます。',
    vi: 'Tôi mua hoa quả ở siêu thị.',
    ans: 'スーパー',
    group: 'Từ vựng theo ngữ cảnh',
  },
  {
    n: 1,
    jp: '（ ）で しんぶんを かいます。',
    vi: 'Tôi mua báo ở cửa hàng tiện lợi.',
    ans: 'コンビニ',
    group: 'Từ vựng theo ngữ cảnh',
  },
  {
    n: 1,
    jp: 'パーティーで（ ）を のみます。',
    vi: 'Ở bữa tiệc tôi uống rượu.',
    ans: 'おさけ',
    group: 'Từ vựng theo ngữ cảnh',
  },
  {
    n: 1,
    jp: 'ここは（ ）です。',
    vi: 'Đây là quán cà phê.',
    ans: 'きっさてん',
    group: 'Từ vựng theo ngữ cảnh',
  },
  {
    n: 1,
    jp: 'A：りんごは（ ）で なんですか。B：「Táo」です。',
    vi: 'A: "Táo tiếng Việt là gì?" — B: "Là Táo."',
    ans: 'ベトナム語',
    group: 'Từ vựng theo ngữ cảnh',
  },
];

/* ══════════════ 4. TỪ KHÁC LOẠI (odd one out) — 9 câu đã ra ══════════════ */

export interface OddItem {
  options: { jp: string; vi: string }[];
  ansIndex: number;
  why: string;
}

export const ODD_ONE_OUT: OddItem[] = [
  {
    options: [
      { jp: 'スーパー', vi: 'siêu thị' },
      { jp: 'カメラ', vi: 'máy ảnh' },
      { jp: '100円ショップ', vi: 'cửa hàng đồng giá' },
      { jp: 'レストラン', vi: 'nhà hàng' },
    ],
    ansIndex: 1,
    why: 'Ba từ kia đều là ĐỊA ĐIỂM, カメラ là đồ vật.',
  },
  {
    options: [
      { jp: 'トイレットペーパー', vi: 'giấy vệ sinh' },
      { jp: 'レストラン', vi: 'nhà hàng' },
      { jp: 'ペン', vi: 'bút' },
      { jp: 'けしゴム', vi: 'cục tẩy' },
    ],
    ansIndex: 1,
    why: 'Ba từ kia là ĐỒ VẬT mua được, レストラン là địa điểm.',
  },
  {
    options: [
      { jp: 'ぎゅうにゅう', vi: 'sữa bò' },
      { jp: 'ごはん', vi: 'cơm' },
      { jp: 'たまご', vi: 'trứng' },
      { jp: 'ぶたにく', vi: 'thịt lợn' },
    ],
    ansIndex: 0,
    why: 'ぎゅうにゅう là ĐỒ UỐNG, ba từ kia là đồ ăn.',
  },
  {
    options: [
      { jp: 'おまつり', vi: 'lễ hội' },
      { jp: 'としょかん', vi: 'thư viện' },
      { jp: 'こうえん', vi: 'công viên' },
      { jp: 'びょういん', vi: 'bệnh viện' },
    ],
    ansIndex: 0,
    why: 'Ba từ kia là ĐỊA ĐIỂM, おまつり là sự kiện.',
  },
  {
    options: [
      { jp: 'スキー', vi: 'trượt tuyết' },
      { jp: 'チーズ', vi: 'phô mai' },
      { jp: 'サラダ', vi: 'salad' },
      { jp: 'バーベキュー', vi: 'thịt nướng' },
    ],
    ansIndex: 0,
    why: 'Ba từ kia là ĐỒ ĂN, スキー là môn thể thao.',
  },
  {
    options: [
      { jp: 'はなや', vi: 'tiệm hoa' },
      { jp: 'とんかつ', vi: 'thịt lợn chiên xù' },
      { jp: 'きっさてん', vi: 'quán cà phê' },
      { jp: 'ほんや', vi: 'hiệu sách' },
    ],
    ansIndex: 1,
    why: 'Ba từ kia là CỬA HÀNG, とんかつ là món ăn.',
  },
  {
    options: [
      { jp: 'パン', vi: 'bánh mì' },
      { jp: 'パソコン', vi: 'máy tính' },
      { jp: 'ケーキ', vi: 'bánh ngọt' },
      { jp: 'たまご', vi: 'trứng' },
    ],
    ansIndex: 1,
    why: 'Ba từ kia là ĐỒ ĂN, パソコン là đồ điện tử.',
  },
  {
    options: [
      { jp: 'すいえい', vi: 'bơi lội' },
      { jp: 'サッカー', vi: 'bóng đá' },
      { jp: 'テニス', vi: 'tennis' },
      { jp: 'ブラジル', vi: 'Brazil' },
    ],
    ansIndex: 3,
    why: 'Ba từ kia là MÔN THỂ THAO, ブラジル là tên nước.',
  },
];

/* ══════════════ 5. GHÉP CÂU TỪ GỢI Ý ══════════════ */

export interface BuildItem {
  cues: string;
  answer: string;
  vi: string;
}

export const SENTENCE_BUILD: BuildItem[] = [
  {
    cues: '私 ／ かいしゃいん ／ じゃありません',
    answer: '私は かいしゃいん じゃありません。',
    vi: 'Tôi không phải nhân viên công ty.',
  },
  {
    cues: 'しゅみ ／ 私 ／ おんがく ／ りょうり ／ です',
    answer: '私の しゅみは おんがくと りょうり です。',
    vi: 'Sở thích của tôi là âm nhạc và nấu ăn.',
  },
  {
    cues: 'ぶたにく ／ とんかつ ／ りょうり ／ です',
    answer: 'とんかつは ぶたにくの りょうりです。',
    vi: 'Tonkatsu là món làm từ thịt lợn.',
  },
  {
    cues: '私 ／ 学生 ／ ふじみだいがく ／ です',
    answer: '私は ふじみだいがくの 学生です。',
    vi: 'Tôi là sinh viên Đại học Fujimi.',
  },
  {
    cues: 'これ ／ です ／ タイ ／ りょうり',
    answer: 'これは タイの りょうりです。',
    vi: 'Đây là món ăn Thái Lan.',
  },
  {
    cues: 'いきます ／ たなかさん ／ スーパー ／ 火曜日',
    answer: 'たなかさんは 火曜日 スーパーへ いきます。',
    vi: 'Anh Tanaka đi siêu thị vào thứ Ba.',
  },
  {
    cues: 'カルロスさん ／ ですか ／ たんじょうび ／ いつ',
    answer: 'カルロスさんの たんじょうびは いつ ですか。',
    vi: 'Sinh nhật anh Carlos khi nào?',
  },
  {
    cues: 'から ／ です ／ 45分 ／ 8時 ／ ごぜん ／ さくら ゆうびんきょく',
    answer: 'さくら ゆうびんきょくは ごぜん 8時45分 からです。',
    vi: 'Bưu điện Sakura mở từ 8 giờ 45 sáng.',
  },
];

export const BUILD_FORMULA =
  'Hai công thức xử được cả 8 câu: [Ai]は [bổ ngữ]の [danh từ]です。 và [Ai]は [thời gian] [nơi]へ いきます。 ' +
  'Quy tắc thứ tự: CHỦ NGỮ + は đứng đầu, ĐỘNG TỪ/です đứng cuối, mọi thứ khác nằm giữa.';

/* ══════════════ 6. TỪ MƯỢN KATAKANA HỎI NGHĨA ══════════════ */

export const LOANWORD_MEANINGS: { jp: string; vi: string; note?: string }[] = [
  { jp: 'スケジュール', vi: 'Kế hoạch, lịch trình', note: 'Ra 3 lần — nhiều nhất' },
  { jp: 'アルバイト', vi: 'Việc làm thêm', note: 'Gốc tiếng Đức Arbeit' },
  { jp: 'きつえんじょ', vi: 'Nơi hút thuốc', note: 'Ra 3 lần' },
  { jp: 'とんかつ', vi: 'Thịt lợn chiên xù' },
  { jp: 'けいたいでんわ', vi: 'Điện thoại di động' },
  { jp: 'エスカレーター', vi: 'Thang cuốn' },
  { jp: 'エレベーター', vi: 'Thang máy' },
  { jp: 'トイレットペーパー', vi: 'Giấy vệ sinh' },
  { jp: 'でんしじしょ', vi: 'Từ điển điện tử' },
  { jp: 'きんえんせき', vi: 'Chỗ cấm hút thuốc' },
  { jp: 'きつえんせき', vi: 'Chỗ được hút thuốc' },
  { jp: 'インフォメーション', vi: 'Quầy thông tin' },
  { jp: 'コンビニ', vi: 'Cửa hàng tiện lợi' },
  { jp: 'ちゅうもん', vi: 'Gọi món, đặt hàng' },
];

/* ══════════════ 7. THỐNG KÊ ══════════════ */

export const FE_STATS = {
  totalQuestions: 420,
  totalExams: 14,
  perExam: 30,
  minutes: 45,
  passQuestions: 12,
  topKanji: [
    { k: '私', n: 86, vi: 'tôi' },
    { k: '時', n: 66, vi: 'giờ' },
    { k: '何', n: 57, vi: 'gì / mấy' },
    { k: '生', n: 38, vi: 'sinh (学生, 先生)' },
    { k: '才', n: 36, vi: 'tuổi' },
    { k: '円', n: 29, vi: 'yên' },
  ],
};
