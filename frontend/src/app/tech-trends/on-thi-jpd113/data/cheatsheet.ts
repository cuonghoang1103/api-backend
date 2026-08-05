/**
 * JPD113 — Bảng tra cứu ôn thi.
 *
 * Mọi bảng ở đây đều được chọn theo tiêu chí "có ra đề thật hay không",
 * không theo thứ tự giáo trình. Các con số tần suất (私 86 lần, 時 66 lần…)
 * lấy từ phân tích 420 câu FE thật đang nằm trong Phòng thi.
 *
 * Ô nào đánh dấu `danger` là chỗ bất quy tắc — đây chính là nơi mất điểm
 * nhiều nhất, nên UI tô riêng màu đỏ.
 */

export interface KanaCell {
  kana: string;
  romaji: string;
  /** true = ký tự hay bị nhầm với chữ khác */
  tricky?: boolean;
}

export interface CheatTable {
  id: string;
  title: string;
  note?: string;
  headers: string[];
  rows: string[][];
  /** Chỉ số hàng cần tô cảnh báo (bất quy tắc) */
  dangerRows?: number[];
}

export interface CheatTip {
  title: string;
  body: string;
}

export interface CheatSection {
  id: string;
  title: string;
  icon: string;
  summary: string;
  tables: CheatTable[];
  tips?: CheatTip[];
}

/* ══════════════════ KANA ══════════════════ */

export const HIRAGANA: KanaCell[][] = [
  [
    { kana: 'あ', romaji: 'a' },
    { kana: 'い', romaji: 'i' },
    { kana: 'う', romaji: 'u' },
    { kana: 'え', romaji: 'e' },
    { kana: 'お', romaji: 'o', tricky: true },
  ],
  [
    { kana: 'か', romaji: 'ka' },
    { kana: 'き', romaji: 'ki' },
    { kana: 'く', romaji: 'ku' },
    { kana: 'け', romaji: 'ke' },
    { kana: 'こ', romaji: 'ko' },
  ],
  [
    { kana: 'さ', romaji: 'sa' },
    { kana: 'し', romaji: 'shi' },
    { kana: 'す', romaji: 'su' },
    { kana: 'せ', romaji: 'se' },
    { kana: 'そ', romaji: 'so' },
  ],
  [
    { kana: 'た', romaji: 'ta' },
    { kana: 'ち', romaji: 'chi' },
    { kana: 'つ', romaji: 'tsu' },
    { kana: 'て', romaji: 'te' },
    { kana: 'と', romaji: 'to' },
  ],
  [
    { kana: 'な', romaji: 'na' },
    { kana: 'に', romaji: 'ni' },
    { kana: 'ぬ', romaji: 'nu', tricky: true },
    { kana: 'ね', romaji: 'ne' },
    { kana: 'の', romaji: 'no' },
  ],
  [
    { kana: 'は', romaji: 'ha', tricky: true },
    { kana: 'ひ', romaji: 'hi' },
    { kana: 'ふ', romaji: 'fu' },
    { kana: 'へ', romaji: 'he' },
    { kana: 'ほ', romaji: 'ho', tricky: true },
  ],
  [
    { kana: 'ま', romaji: 'ma' },
    { kana: 'み', romaji: 'mi' },
    { kana: 'む', romaji: 'mu' },
    { kana: 'め', romaji: 'me', tricky: true },
    { kana: 'も', romaji: 'mo' },
  ],
  [
    { kana: 'や', romaji: 'ya' },
    { kana: '', romaji: '' },
    { kana: 'ゆ', romaji: 'yu' },
    { kana: '', romaji: '' },
    { kana: 'よ', romaji: 'yo' },
  ],
  [
    { kana: 'ら', romaji: 'ra' },
    { kana: 'り', romaji: 'ri' },
    { kana: 'る', romaji: 'ru', tricky: true },
    { kana: 'れ', romaji: 're', tricky: true },
    { kana: 'ろ', romaji: 'ro', tricky: true },
  ],
  [
    { kana: 'わ', romaji: 'wa', tricky: true },
    { kana: '', romaji: '' },
    { kana: '', romaji: '' },
    { kana: '', romaji: '' },
    { kana: 'を', romaji: 'o (trợ từ)' },
  ],
  [
    { kana: 'ん', romaji: 'n' },
    { kana: '', romaji: '' },
    { kana: '', romaji: '' },
    { kana: '', romaji: '' },
    { kana: '', romaji: '' },
  ],
];

export const KATAKANA: KanaCell[][] = [
  [
    { kana: 'ア', romaji: 'a' },
    { kana: 'イ', romaji: 'i' },
    { kana: 'ウ', romaji: 'u' },
    { kana: 'エ', romaji: 'e' },
    { kana: 'オ', romaji: 'o' },
  ],
  [
    { kana: 'カ', romaji: 'ka' },
    { kana: 'キ', romaji: 'ki' },
    { kana: 'ク', romaji: 'ku' },
    { kana: 'ケ', romaji: 'ke' },
    { kana: 'コ', romaji: 'ko' },
  ],
  [
    { kana: 'サ', romaji: 'sa' },
    { kana: 'シ', romaji: 'shi', tricky: true },
    { kana: 'ス', romaji: 'su' },
    { kana: 'セ', romaji: 'se' },
    { kana: 'ソ', romaji: 'so', tricky: true },
  ],
  [
    { kana: 'タ', romaji: 'ta' },
    { kana: 'チ', romaji: 'chi' },
    { kana: 'ツ', romaji: 'tsu', tricky: true },
    { kana: 'テ', romaji: 'te' },
    { kana: 'ト', romaji: 'to' },
  ],
  [
    { kana: 'ナ', romaji: 'na' },
    { kana: 'ニ', romaji: 'ni' },
    { kana: 'ヌ', romaji: 'nu', tricky: true },
    { kana: 'ネ', romaji: 'ne' },
    { kana: 'ノ', romaji: 'no', tricky: true },
  ],
  [
    { kana: 'ハ', romaji: 'ha' },
    { kana: 'ヒ', romaji: 'hi' },
    { kana: 'フ', romaji: 'fu' },
    { kana: 'ヘ', romaji: 'he' },
    { kana: 'ホ', romaji: 'ho' },
  ],
  [
    { kana: 'マ', romaji: 'ma' },
    { kana: 'ミ', romaji: 'mi' },
    { kana: 'ム', romaji: 'mu' },
    { kana: 'メ', romaji: 'me', tricky: true },
    { kana: 'モ', romaji: 'mo' },
  ],
  [
    { kana: 'ヤ', romaji: 'ya' },
    { kana: '', romaji: '' },
    { kana: 'ユ', romaji: 'yu' },
    { kana: '', romaji: '' },
    { kana: 'ヨ', romaji: 'yo' },
  ],
  [
    { kana: 'ラ', romaji: 'ra' },
    { kana: 'リ', romaji: 'ri' },
    { kana: 'ル', romaji: 'ru' },
    { kana: 'レ', romaji: 're' },
    { kana: 'ロ', romaji: 'ro' },
  ],
  [
    { kana: 'ワ', romaji: 'wa' },
    { kana: '', romaji: '' },
    { kana: '', romaji: '' },
    { kana: '', romaji: '' },
    { kana: 'ヲ', romaji: 'o' },
  ],
  [
    { kana: 'ン', romaji: 'n', tricky: true },
    { kana: '', romaji: '' },
    { kana: '', romaji: '' },
    { kana: '', romaji: '' },
    { kana: '', romaji: '' },
  ],
];

export const DAKUTEN: KanaCell[][] = [
  [
    { kana: 'が', romaji: 'ga' },
    { kana: 'ぎ', romaji: 'gi' },
    { kana: 'ぐ', romaji: 'gu' },
    { kana: 'げ', romaji: 'ge' },
    { kana: 'ご', romaji: 'go' },
  ],
  [
    { kana: 'ざ', romaji: 'za' },
    { kana: 'じ', romaji: 'ji' },
    { kana: 'ず', romaji: 'zu' },
    { kana: 'ぜ', romaji: 'ze' },
    { kana: 'ぞ', romaji: 'zo' },
  ],
  [
    { kana: 'だ', romaji: 'da' },
    { kana: 'ぢ', romaji: 'ji' },
    { kana: 'づ', romaji: 'zu' },
    { kana: 'で', romaji: 'de' },
    { kana: 'ど', romaji: 'do' },
  ],
  [
    { kana: 'ば', romaji: 'ba' },
    { kana: 'び', romaji: 'bi' },
    { kana: 'ぶ', romaji: 'bu' },
    { kana: 'べ', romaji: 'be' },
    { kana: 'ぼ', romaji: 'bo' },
  ],
  [
    { kana: 'ぱ', romaji: 'pa' },
    { kana: 'ぴ', romaji: 'pi' },
    { kana: 'ぷ', romaji: 'pu' },
    { kana: 'ぺ', romaji: 'pe' },
    { kana: 'ぽ', romaji: 'po' },
  ],
];

export const KATAKANA_DAKUTEN: KanaCell[][] = [
  [
    { kana: 'ガ', romaji: 'ga' },
    { kana: 'ギ', romaji: 'gi' },
    { kana: 'グ', romaji: 'gu' },
    { kana: 'ゲ', romaji: 'ge' },
    { kana: 'ゴ', romaji: 'go' },
  ],
  [
    { kana: 'ザ', romaji: 'za' },
    { kana: 'ジ', romaji: 'ji' },
    { kana: 'ズ', romaji: 'zu' },
    { kana: 'ゼ', romaji: 'ze' },
    { kana: 'ゾ', romaji: 'zo' },
  ],
  [
    { kana: 'ダ', romaji: 'da' },
    { kana: 'ヂ', romaji: 'ji' },
    { kana: 'ヅ', romaji: 'zu' },
    { kana: 'デ', romaji: 'de' },
    { kana: 'ド', romaji: 'do' },
  ],
  [
    { kana: 'バ', romaji: 'ba' },
    { kana: 'ビ', romaji: 'bi' },
    { kana: 'ブ', romaji: 'bu' },
    { kana: 'ベ', romaji: 'be' },
    { kana: 'ボ', romaji: 'bo' },
  ],
  [
    { kana: 'パ', romaji: 'pa' },
    { kana: 'ピ', romaji: 'pi' },
    { kana: 'プ', romaji: 'pu' },
    { kana: 'ペ', romaji: 'pe' },
    { kana: 'ポ', romaji: 'po' },
  ],
];

export const KATAKANA_YOUON: KanaCell[][] = [
  [
    { kana: 'キャ', romaji: 'kya' },
    { kana: 'キュ', romaji: 'kyu' },
    { kana: 'キョ', romaji: 'kyo' },
  ],
  [
    { kana: 'シャ', romaji: 'sha' },
    { kana: 'シュ', romaji: 'shu' },
    { kana: 'ショ', romaji: 'sho' },
  ],
  [
    { kana: 'チャ', romaji: 'cha' },
    { kana: 'チュ', romaji: 'chu' },
    { kana: 'チョ', romaji: 'cho' },
  ],
  [
    { kana: 'ニャ', romaji: 'nya' },
    { kana: 'ニュ', romaji: 'nyu' },
    { kana: 'ニョ', romaji: 'nyo' },
  ],
  [
    { kana: 'ヒャ', romaji: 'hya' },
    { kana: 'ヒュ', romaji: 'hyu' },
    { kana: 'ヒョ', romaji: 'hyo' },
  ],
  [
    { kana: 'ミャ', romaji: 'mya' },
    { kana: 'ミュ', romaji: 'myu' },
    { kana: 'ミョ', romaji: 'myo' },
  ],
  [
    { kana: 'リャ', romaji: 'rya' },
    { kana: 'リュ', romaji: 'ryu' },
    { kana: 'リョ', romaji: 'ryo' },
  ],
  [
    { kana: 'ギャ', romaji: 'gya' },
    { kana: 'ギュ', romaji: 'gyu' },
    { kana: 'ギョ', romaji: 'gyo' },
  ],
  [
    { kana: 'ジャ', romaji: 'ja' },
    { kana: 'ジュ', romaji: 'ju' },
    { kana: 'ジョ', romaji: 'jo' },
  ],
  [
    { kana: 'ビャ', romaji: 'bya' },
    { kana: 'ビュ', romaji: 'byu' },
    { kana: 'ビョ', romaji: 'byo' },
  ],
  [
    { kana: 'ピャ', romaji: 'pya' },
    { kana: 'ピュ', romaji: 'pyu' },
    { kana: 'ピョ', romaji: 'pyo' },
  ],
];

export const YOUON: KanaCell[][] = [
  [
    { kana: 'きゃ', romaji: 'kya' },
    { kana: 'きゅ', romaji: 'kyu' },
    { kana: 'きょ', romaji: 'kyo' },
  ],
  [
    { kana: 'しゃ', romaji: 'sha' },
    { kana: 'しゅ', romaji: 'shu' },
    { kana: 'しょ', romaji: 'sho' },
  ],
  [
    { kana: 'ちゃ', romaji: 'cha' },
    { kana: 'ちゅ', romaji: 'chu' },
    { kana: 'ちょ', romaji: 'cho' },
  ],
  [
    { kana: 'にゃ', romaji: 'nya' },
    { kana: 'にゅ', romaji: 'nyu' },
    { kana: 'にょ', romaji: 'nyo' },
  ],
  [
    { kana: 'ひゃ', romaji: 'hya' },
    { kana: 'ひゅ', romaji: 'hyu' },
    { kana: 'ひょ', romaji: 'hyo' },
  ],
  [
    { kana: 'みゃ', romaji: 'mya' },
    { kana: 'みゅ', romaji: 'myu' },
    { kana: 'みょ', romaji: 'myo' },
  ],
  [
    { kana: 'りゃ', romaji: 'rya' },
    { kana: 'りゅ', romaji: 'ryu' },
    { kana: 'りょ', romaji: 'ryo' },
  ],
  [
    { kana: 'ぎゃ', romaji: 'gya' },
    { kana: 'ぎゅ', romaji: 'gyu' },
    { kana: 'ぎょ', romaji: 'gyo' },
  ],
  [
    { kana: 'じゃ', romaji: 'ja' },
    { kana: 'じゅ', romaji: 'ju' },
    { kana: 'じょ', romaji: 'jo' },
  ],
  [
    { kana: 'びゃ', romaji: 'bya' },
    { kana: 'びゅ', romaji: 'byu' },
    { kana: 'びょ', romaji: 'byo' },
  ],
  [
    { kana: 'ぴゃ', romaji: 'pya' },
    { kana: 'ぴゅ', romaji: 'pyu' },
    { kana: 'ぴょ', romaji: 'pyo' },
  ],
];

/* ══════════════════ CÁC MỤC TRA CỨU ══════════════════ */

export const SECTIONS: CheatSection[] = [
  /* ─────────── ÂM NGẮT & TRƯỜNG ÂM ─────────── */
  {
    id: 'rhythm',
    title: 'Âm ngắt っ & trường âm',
    icon: '🎵',
    summary:
      'Hai thứ quyết định bạn đọc to ĐÚNG hay SAI, và cũng là hai thứ đề trắc nghiệm hỏi cách đọc ' +
      'nhiều nhất. Mọi từ dưới đây đều lấy từ chính bộ từ vựng và 13 bài đọc của môn — không có từ nào thừa.',
    tables: [
      {
        id: 'rh-sokuon-rule',
        title: 'っ là một khoảng NÍN, không phải một âm',
        note:
          'っ là chữ つ viết nhỏ. Nó không đọc thành tiếng — bạn ngậm miệng đúng một nhịp rồi bật phụ âm sau ' +
          'mạnh hơn. Giống chỗ hai phụ âm dính nhau trong tiếng Anh: bookkeeper, hot topic.',
        headers: ['Viết', 'Đọc', 'Bỏ っ thì thành', 'Nhịp'],
        rows: [
          ['学校 がっこう', 'gak—koo', 'がこう (sai)', '4'],
          ['切手 きって', 'kit—te', 'きて = “hãy đến” — KHÁC NGHĨA', '3'],
          ['サッカー', 'sak—kaa', 'サカー (sai)', '4'],
          ['きっさてん (quán cà phê)', 'kis—sa-ten', 'きさてん (sai)', '5'],
          ['いらっしゃいませ', 'i-ras—shai-ma-se', '—', '8'],
          ['ちょっと', 'chot—to', 'ちょと (sai)', '4'],
          ['いっしょに (cùng nhau)', 'is—sho-ni', 'いしょに (sai)', '5'],
          ['インターネット', 'in-taa-net—to', '—', '8'],
        ],
        dangerRows: [1],
      },
      {
        id: 'rh-sokuon-number',
        title: 'っ trong SỐ ĐẾM — nhóm ra đề nhiều nhất',
        note:
          'Đây là chỗ っ xuất hiện dày đặc nhất trong đề thi. Học thuộc bảng này là xử được cả câu đọc số ' +
          'lẫn chỗ vấp khi đọc to.',
        headers: ['Phút 分', 'Trăm/Nghìn', 'Tuổi 才', 'Tầng 階'],
        rows: [
          ['1分 いっぷん', '600 ろっぴゃく', '1才 いっさい', '1階 いっかい'],
          ['6分 ろっぷん', '800 はっぴゃく', '8才 はっさい', '6階 ろっかい'],
          ['8分 はっぷん', '8000 はっせん', '10才 じゅっさい', '8階 はっかい'],
          ['10分 じゅっぷん', '—', '20才 はたち ⚠', '10階 じゅっかい'],
        ],
        dangerRows: [0, 1, 2, 3],
      },
      {
        id: 'rh-sokuon-counter',
        title: 'っ trong cách đếm vật ～つ',
        headers: ['Số', 'Viết', 'Đọc', 'Số', 'Viết', 'Đọc'],
        rows: [
          ['1', 'ひとつ', 'hi-to-tsu', '6', 'むっつ', 'mut—tsu'],
          ['2', 'ふたつ', 'fu-ta-tsu', '7', 'ななつ', 'na-na-tsu'],
          ['3', 'みっつ', 'mit—tsu', '8', 'やっつ', 'yat—tsu'],
          ['4', 'よっつ', 'yot—tsu', '9', 'ここのつ', 'ko-ko-no-tsu'],
          ['5', 'いつつ', 'i-tsu-tsu', '10', 'とお', 'too'],
        ],
        dangerRows: [2, 3, 5, 7],
      },
      {
        id: 'rh-choon-rule',
        title: 'Trường âm hiragana — 5 hàng, 2 cái là BẪY',
        note:
          'Hiragana không có dấu kéo dài; nó thêm một nguyên âm. Ba hàng đầu dễ đoán, hai hàng cuối thì KHÔNG ' +
          'đọc như mặt chữ — đây là lỗi phát âm phổ biến nhất của người mới.',
        headers: ['Hàng', 'Kéo dài bằng', 'Ví dụ', 'Đọc THẬT'],
        rows: [
          ['あ', '+ あ', 'おかあさん (mẹ)', 'o-kaa-san'],
          ['い', '+ い', 'おにいさん (anh)', 'o-nii-san'],
          ['う', '+ う', 'ちゅうごく (Trung Quốc)', 'chuu-goku'],
          ['え', '+ い  ← KHÔNG phải え', 'せんせい (giáo viên)', 'sen-SEE, không phải sen-sei'],
          ['お', '+ う  ← KHÔNG phải お', 'がっこう (trường)', 'gak-KOO, không phải gak-kou'],
        ],
        dangerRows: [3, 4],
      },
      {
        id: 'rh-ou',
        title: 'Nhóm おう — đọc “oo”, có 29 từ trong bộ từ vựng của môn',
        note: 'Cứ thấy chữ hàng お + う là kéo dài, KHÔNG đọc tách thành “ô-u”.',
        headers: ['Từ', 'Đọc', 'Từ', 'Đọc'],
        rows: [
          ['がっこう (trường)', 'gak-koo', 'げつようび (thứ Hai)', 'ge-tsu-yoo-bi'],
          ['こうこう (cấp 3)', 'koo-koo', 'かようび (thứ Ba)', 'ka-yoo-bi'],
          ['べんきょうします (học)', 'ben-kyoo-shi-mas', 'すいようび (thứ Tư)', 'sui-yoo-bi'],
          ['じゅぎょう (tiết học)', 'ju-gyoo', 'もくようび (thứ Năm)', 'mo-ku-yoo-bi'],
          ['りょこう (du lịch)', 'ryo-koo', 'きんようび (thứ Sáu)', 'kin-yoo-bi'],
          ['ぎんこう (ngân hàng)', 'gin-koo', 'どようび (thứ Bảy)', 'do-yoo-bi'],
          ['びょういん (bệnh viện)', 'byoo-in', 'にちようび (Chủ Nhật)', 'ni-chi-yoo-bi'],
          ['こうえん (công viên)', 'koo-en', 'なんようび (thứ mấy)', 'nan-yoo-bi'],
          ['りょうり (món ăn)', 'ryoo-ri', 'たんじょうび (sinh nhật)', 'tan-joo-bi'],
          ['こうちゃ (hồng trà)', 'koo-cha', 'きょうし (giáo viên)', 'kyoo-shi'],
          ['おべんとう (cơm hộp)', 'o-ben-too', 'こうむいん (công chức)', 'koo-mu-in'],
          ['どうぞ', 'doo-zo', 'そうですか', 'soo-des-ka'],
          ['ありがとうございます', 'a-ri-ga-too go-za-i-mas', 'よろしくおねがいします', '…o-ne-gai-shi-mas'],
        ],
      },
      {
        id: 'rh-ei-uu',
        title: 'Nhóm えい (đọc “ee”) và うう',
        headers: ['えい → “ee”', 'Đọc', 'うう', 'Đọc'],
        rows: [
          ['がくせい (học sinh)', 'ga-ku-see', 'ちゅうごく (Trung Quốc)', 'chuu-go-ku'],
          ['せんせい (giáo viên)', 'sen-see', 'しゅうまつ (cuối tuần)', 'shuu-ma-tsu'],
          ['とけい (đồng hồ)', 'to-kee', '～しゅうかん (~tuần)', 'shuu-kan'],
          ['けいたいでんわ (di động)', 'kee-tai-den-wa', 'ゆうびんきょく (bưu điện)', 'yuu-bin-kyo-ku'],
          ['えいご (tiếng Anh)', 'ee-go', 'ちゅうもん (gọi món)', 'chuu-mon'],
          ['えいが (phim)', 'ee-ga', 'ぎゅうにく / ぎゅうにゅう', 'gyuu-ni-ku / gyuu-nyuu'],
        ],
      },
      {
        id: 'rh-oo-exception',
        title: 'Ngoại lệ おお — vài từ kéo dài bằng お chứ không phải う',
        note: 'Số lượng ít, nhưng nếu không biết thì viết sai chính tả và đọc cũng dễ sai.',
        headers: ['Từ', 'Đọc', 'Nghĩa'],
        rows: [
          ['十日 とおか', 'too-ka', 'ngày mùng 10'],
          ['十 とお', 'too', 'mười (đếm vật)'],
          ['大きい おおきい', 'oo-kii', 'to, lớn'],
          ['多い おおい', 'oo-i', 'nhiều'],
          ['遠い とおい', 'too-i', 'xa'],
        ],
        dangerRows: [0, 1, 2, 3, 4],
      },
      {
        id: 'rh-kata',
        title: 'Katakana — dễ nhất, cứ thấy gạch ー là kéo dài',
        note: 'Không có ngoại lệ nào. 29 từ katakana trong bộ từ vựng của môn có dấu này.',
        headers: ['Từ', 'Đọc', 'Từ', 'Đọc'],
        rows: [
          ['コーヒー', 'koo-hii', 'スーパー', 'suu-paa'],
          ['ビール', 'bii-ru', 'ケーキ', 'kee-ki'],
          ['サッカー', 'sak-kaa', 'カレー', 'ka-ree'],
          ['スポーツ', 'spoo-tsu', 'ジュース', 'juu-su'],
          ['オーストラリア', 'oo-su-to-ra-ri-a', 'チーズ', 'chii-zu'],
          ['エレベーター', 'e-re-bee-taa', 'スープ', 'suu-pu'],
          ['エスカレーター', 'e-su-ka-ree-taa', 'ハンバーグ', 'han-baa-gu'],
          ['インターネット', 'in-taa-net-to', 'パーティー', 'paa-tii'],
          ['ティーシャツ', 'tii-sha-tsu', 'スキー', 'su-kii'],
          ['ゴールデンウィーク', 'goo-ru-den-wii-ku', 'バーベキュー', 'baa-be-kyuu'],
        ],
      },
      {
        id: 'rh-pairs',
        title: 'Đọc sai một nhịp là ra từ khác — các cặp phải phân biệt',
        note: 'Đây là lý do giám thị trừ điểm khi bạn đọc lướt. Ngắn và dài là HAI TỪ khác nhau.',
        headers: ['Ngắn', 'Nghĩa', 'Dài', 'Nghĩa'],
        rows: [
          ['ビル', 'toà nhà', 'ビール', 'bia'],
          ['おばさん', 'cô, dì', 'おばあさん', 'bà'],
          ['おじさん', 'chú, bác', 'おじいさん', 'ông'],
          ['ゆき', 'tuyết', 'ゆうき', 'dũng khí'],
          ['ここ', 'ở đây', 'こうこう', 'trường cấp 3'],
          ['きて', 'hãy đến', 'きって', 'con tem'],
          ['おと', 'âm thanh', 'おっと', 'chồng'],
        ],
        dangerRows: [0, 1, 2, 3, 4, 5, 6],
      },
      {
        id: 'rh-mora',
        title: 'Đếm nhịp — mẹo trị dứt cả hai lỗi',
        note:
          'Quy tắc duy nhất: MỖI ký tự kana = đúng 1 nhịp, kể cả っ, ー và ん. Riêng âm ghép (きゃ・しゅ・ちょ) ' +
          'tính là 1 nhịp vì chữ nhỏ dính vào chữ trước. Vừa đọc vừa gõ tay mỗi nhịp — 15 phút là hết vấp.',
        headers: ['Từ', 'Tách nhịp', 'Số nhịp'],
        rows: [
          ['がっこう', 'が・っ・こ・う', '4'],
          ['せんせい', 'せ・ん・せ・い', '4'],
          ['コーヒー', 'コ・ー・ヒ・ー', '4'],
          ['べんきょう', 'べ・ん・きょ・う', '4'],
          ['サッカー', 'サ・ッ・カ・ー', '4'],
          ['にほんご', 'に・ほ・ん・ご', '4'],
          ['たんじょうび', 'た・ん・じょ・う・び', '5'],
          ['いらっしゃいませ', 'い・ら・っ・しゃ・い・ま・せ', '7'],
        ],
      },
    ],
    tips: [
      {
        title: 'Trong 30 giây chuẩn bị trước khi đọc to',
        body:
          'Quét bài và khoanh đúng hai thứ: mọi chữ っ nhỏ, và mọi chỗ có ー hoặc えい/おう. Đó là toàn bộ ' +
          'các điểm bạn có thể vấp. Số và katakana đã nằm sẵn trong hai nhóm này.',
      },
      {
        title: 'Lỡ đọc sai giữa chừng thì làm gì',
        body:
          'Đọc lại từ đó cho đúng rồi đi tiếp — phần READING chấm độ chính xác chứ không chấm tốc độ. ' +
          'Giám thị trừ điểm khi bạn đọc sai mà KHÔNG nhận ra, không phải khi bạn tự sửa. Đây cũng là lý do ' +
          'phải đọc chậm: đọc chậm thì kịp nhìn thấy っ và kịp kéo dài chỗ cần kéo.',
      },
      {
        title: 'Ba từ dài nhất trong ngân hàng bài đọc',
        body:
          'いらっしゃいませ (7 nhịp, có っ) · しょうしょうおまちください (có 2 âm ghép しょ liền nhau + trường âm) · ' +
          'かしこまりました. Cả ba nằm ở bài đọc số 7. Học chúng như một khối âm thanh, đừng phân tích từng chữ.',
      },
    ],
  },

  /* ─────────── NGỮ PHÁP THI NÓI ─────────── */
  {
    id: 'speak-grammar',
    title: 'Ngữ pháp cần cho bài thi NÓI',
    icon: '🗣️',
    summary:
      'Phần Nói chiếm 30/45 điểm bài thi cuối kỳ — nặng GẤP ĐÔI phần trắc nghiệm. Nhưng nó chỉ dùng ' +
      'đúng chừng này mẫu câu, và mẫu nào cũng ngắn. Học hết bảng dưới là đủ trả lời mọi câu trong ' +
      'ngân hàng 22 câu hỏi và 6 bộ tranh.',
    tables: [
      {
        id: 'sg-core',
        title: 'Bộ khung — 6 mẫu trả lời được gần hết ngân hàng câu hỏi',
        note: 'Thuộc 6 mẫu này là bạn dựng được câu trả lời cho bất kỳ câu nào giám thị hỏi về bản thân.',
        headers: ['Mẫu', 'Dùng khi', 'Ví dụ trả lời'],
        rows: [
          ['N は N です', 'Giới thiệu, khẳng định', 'わたしの なまえは クオン です。'],
          ['N は N じゃ ありません', 'Phủ định', 'にほんじん じゃ ありません。'],
          ['N の N', 'Của ai / thuộc về gì', 'わたしの しゅみは おんがくです。'],
          ['N も', 'Cũng', 'わたしも がくせいです。'],
          ['～から ～まで', 'Từ… đến… (giờ, thứ)', '9じから 5じまで はたらきます。'],
          ['とても + tính từ', 'Nêu cảm nhận', 'とても おいしいです。'],
        ],
      },
      {
        id: 'sg-particle',
        title: 'Bốn trợ từ quyết định câu trả lời đúng hay sai',
        note: 'Giám thị nghe ra ngay nếu bạn dùng nhầm — đây là chỗ mất điểm dễ nhất phần Nói.',
        headers: ['Trợ từ', 'Nghĩa', 'Câu trả lời mẫu'],
        rows: [
          ['に', 'MỐC GIỜ cụ thể', 'ろくじはん に おきます。'],
          ['で', 'NƠI làm việc gì / PHƯƠNG TIỆN', 'がっこう で べんきょうします。バス で 行きます。'],
          ['へ / に', 'ĐÍCH ĐẾN', 'こうえん へ 行きます。'],
          ['を', 'Tân ngữ (ăn gì, uống gì, xem gì)', 'パン を たべます。'],
        ],
        dangerRows: [0, 1, 2, 3],
      },
      {
        id: 'sg-question',
        title: 'Giám thị hỏi thế nào → bạn trả lời thế nào',
        note: 'Nghe được TỪ ĐỂ HỎI là biết phải trả lời cái gì. Nhầm từ để hỏi là mất điểm dù tiếng Nhật đúng.',
        headers: ['Câu hỏi', 'Hỏi về', 'Khung trả lời'],
        rows: [
          ['おなまえは？', 'tên', 'わたしの なまえは ○○ です。'],
          ['おくには どちらですか。', 'quốc gia', 'ベトナム です。'],
          ['おしごとは？', 'nghề nghiệp', 'わたしの しごとは がくせい です。'],
          ['たんじょうびは いつですか。', 'ngày tháng', '○がつ ○にち です。'],
          ['しゅみは なんですか。', 'sở thích', 'わたしの しゅみは ○○ です。'],
          ['なんじに おきますか。', 'mốc giờ', '○じ に おきます。'],
          ['なんじから なんじまで…', 'khoảng giờ', '○じから ○じまで …ます。'],
          ['なにを たべますか。', 'vật (tân ngữ)', '○○ を たべます。'],
          ['どこに 行きますか。', 'nơi chốn', '○○ へ 行きます。'],
          ['なんで 行きますか。', 'PHƯƠNG TIỆN, không phải “tại sao”', 'バス で 行きます。'],
          ['～は どうですか。', 'cảm nhận', 'とても おいしいです。'],
          ['「A」は えいごで なんですか。', 'dịch từ', '「A」は えいごで「B」です。'],
        ],
        dangerRows: [9],
      },
      {
        id: 'sg-picture',
        title: 'Sáu khuôn câu hỏi của phần TRANH',
        note:
          'Cả 37 câu hỏi tranh chỉ xoay quanh sáu khuôn này. LUÔN trả lời bằng câu đủ kết thúc です — ' +
          'trả lời cụt một từ là cách mất điểm âm thầm phổ biến nhất.',
        headers: ['Câu hỏi', 'Nghĩa', 'Trả lời mẫu'],
        rows: [
          ['これは なんですか。', 'Đây là gì?', 'これは カメラ です。'],
          ['だれの ですか。', 'Của ai?', '○○さんの もの です。'],
          ['なんの ですか。', 'Hãng gì / loại gì?', 'キヤノンの カメラ です。'],
          ['いくら ですか。', 'Bao nhiêu tiền?', 'ろっぴゃくはちじゅう ドル です。'],
          ['どこ ですか。', 'Ở đâu / tầng mấy?', 'さんがい です。'],
          ['いつ やすみ ですか。', 'Nghỉ ngày nào?', 'げつようび です。'],
          ['なんさい ですか。', 'Bao nhiêu tuổi?', '26さい です。'],
          ['～ですか。 (có/không)', 'Xác nhận', 'はい、がくせい です。 (đừng chỉ nói はい)'],
        ],
        dangerRows: [7],
      },
      {
        id: 'sg-read-only',
        title: 'Ngữ pháp chỉ cần ĐỌC được, không cần dùng',
        note:
          'Mấy mẫu này xuất hiện trong 13 bài đọc nhưng thuộc trình độ cao hơn. Bạn chỉ phải đọc to đúng, ' +
          'KHÔNG cần hiểu sâu hay tự nói ra.',
        headers: ['Mẫu', 'Gặp ở đâu', 'Hiểu nôm na'],
        rows: [
          ['～ています', 'Bài đọc 2, 3, 4', 'đang làm gì đó'],
          ['～ので', 'Bài đọc 1', 'vì… nên…'],
          ['ではありません', 'Bài đọc 9', 'dạng trang trọng của じゃありません'],
          ['～や ～など', 'Bài đọc 9', 'liệt kê ví dụ, “và những thứ khác”'],
          ['いらっしゃいませ / かしこまりました', 'Bài đọc 7', 'kính ngữ nhà hàng — học như khối âm thanh'],
          ['～たり～たりします', 'Bộ tranh 6', 'làm việc này việc kia — cứ đáp đơn giản bằng します'],
        ],
      },
    ],
    tips: [
      {
        title: 'Bốn câu chốt 10 điểm PRESENTING',
        body:
          'しつれいします (khi vào) → よろしくおねがいします (đầu buổi) → ありがとうございました (cuối buổi) → ' +
          'しつれいしました (khi ra). Không cần tiếng Nhật giỏi, chỉ cần nói rõ, ngồi thẳng và nhìn giám thị.',
      },
      {
        title: 'Không nghe rõ câu hỏi',
        body:
          'もういちど おねがいします — “xin nhắc lại một lần nữa”. Hỏi lại KHÔNG bị trừ điểm; đoán bừa rồi ' +
          'trả lời lạc đề mới mất.',
      },
      {
        title: 'Chiến thuật tiết kiệm công sức nhất',
        body:
          'Đừng học 22 câu trả lời rời rạc. Thuộc MỘT câu thật về bản thân cho mỗi nhóm — tên, quốc tịch, ' +
          'nghề, sinh nhật, sở thích, giờ dậy, phương tiện đi học, một hoạt động cuối tuần — rồi tái sử dụng. ' +
          'Tám thông tin đó trả lời được gần hết ngân hàng.',
      },
    ],
  },

  /* ─────────── SỐ & THỜI GIAN ─────────── */
  {
    id: 'number',
    title: 'Số, giờ, ngày tháng',
    icon: '🔢',
    summary:
      'Ổ bất quy tắc lớn nhất của môn và cũng là chỗ mất điểm số một trong 420 câu đề thật. ' +
      'Mọi hàng tô đỏ đều phải học vẹt — không có quy tắc nào suy ra được.',
    tables: [
      {
        id: 'num-1-10',
        title: 'Số đếm 1 → 10',
        note: '4, 7, 9 có hai cách đọc. Khi đếm rời rạc dùng よん・なな・きゅう; khi ghép với tháng/giờ thì thường dùng âm On (し・しち・く).',
        headers: ['Số', 'Kanji', 'Cách đọc'],
        rows: [
          ['1', '一', 'いち'],
          ['2', '二', 'に'],
          ['3', '三', 'さん'],
          ['4', '四', 'よん / し'],
          ['5', '五', 'ご'],
          ['6', '六', 'ろく'],
          ['7', '七', 'なな / しち'],
          ['8', '八', 'はち'],
          ['9', '九', 'きゅう / く'],
          ['10', '十', 'じゅう'],
        ],
        dangerRows: [3, 6, 8],
      },
      {
        id: 'num-big',
        title: 'Trăm, nghìn, vạn — 6 chỗ biến âm bắt buộc thuộc',
        note: 'Tiếng Nhật nhóm 4 chữ số một lần (万 = 10.000), nên 83.000 = はちまん さんぜん えん.',
        headers: ['Số', 'Cách đọc', 'Ghi chú'],
        rows: [
          ['100 / 200', 'ひゃく / にひゃく', 'đều'],
          ['300', 'さんびゃく', 'ひゃく → びゃく'],
          ['600', 'ろっぴゃく', 'ろく + ぴゃく'],
          ['800', 'はっぴゃく', 'はち + ぴゃく'],
          ['1.000', 'せん', 'không phải いっせん'],
          ['3.000', 'さんぜん', 'せん → ぜん'],
          ['8.000', 'はっせん', 'はち + せん'],
          ['10.000', 'いちまん', 'phải có いち'],
        ],
        dangerRows: [1, 2, 3, 5, 6, 7],
      },
      {
        id: 'num-hour',
        title: 'Giờ 時 — ba giờ bất quy tắc',
        note: '時 là kanji xuất hiện nhiều thứ hai trong toàn bộ đề thật (66 lần).',
        headers: ['Giờ', 'Cách đọc', 'Giờ', 'Cách đọc'],
        rows: [
          ['1時', 'いちじ', '7時', 'しちじ'],
          ['2時', 'にじ', '8時', 'はちじ'],
          ['3時', 'さんじ', '9時', 'くじ'],
          ['4時', 'よじ', '10時', 'じゅうじ'],
          ['5時', 'ごじ', '11時', 'じゅういちじ'],
          ['6時', 'ろくじ', '12時', 'じゅうにじ'],
        ],
        dangerRows: [0, 2, 3],
      },
      {
        id: 'num-min',
        title: 'Phút 分 — luật ふん / ぷん',
        note: 'Câu thần chú: “1–3–4–6–8–10 là ぷん”, còn lại là ふん.',
        headers: ['Phút', 'Cách đọc', 'Phút', 'Cách đọc'],
        rows: [
          ['1分', 'いっぷん', '6分', 'ろっぷん'],
          ['2分', 'にふん', '7分', 'ななふん'],
          ['3分', 'さんぷん', '8分', 'はっぷん'],
          ['4分', 'よんぷん', '9分', 'きゅうふん'],
          ['5分', 'ごふん', '10分', 'じゅっぷん'],
          ['30分', 'さんじゅっぷん = 半 (はん)', '何分', 'なんぷん'],
        ],
        dangerRows: [0, 2, 4, 5],
      },
      {
        id: 'num-month',
        title: 'Tháng 月 — ba tháng bất quy tắc',
        headers: ['Tháng', 'Cách đọc', 'Tháng', 'Cách đọc'],
        rows: [
          ['1月', 'いちがつ', '7月', 'しちがつ'],
          ['2月', 'にがつ', '8月', 'はちがつ'],
          ['3月', 'さんがつ', '9月', 'くがつ'],
          ['4月', 'しがつ', '10月', 'じゅうがつ'],
          ['5月', 'ごがつ', '11月', 'じゅういちがつ'],
          ['6月', 'ろくがつ', '12月', 'じゅうにがつ'],
        ],
        dangerRows: [0, 2, 3],
      },
      {
        id: 'num-day',
        title: 'Ngày 日 — 1→10 và 14, 20, 24 phải học vẹt',
        note: 'Các ngày còn lại đọc thẳng theo số + にち (15日 = じゅうごにち).',
        headers: ['Ngày', 'Cách đọc', 'Ngày', 'Cách đọc'],
        rows: [
          ['1日', 'ついたち', '8日', 'ようか'],
          ['2日', 'ふつか', '9日', 'ここのか'],
          ['3日', 'みっか', '10日', 'とおか'],
          ['4日', 'よっか', '14日', 'じゅうよっか'],
          ['5日', 'いつか', '20日', 'はつか'],
          ['6日', 'むいか', '24日', 'にじゅうよっか'],
          ['7日', 'なのか', '何日', 'なんにち'],
        ],
        dangerRows: [0, 1, 2, 3, 4, 5, 6],
      },
      {
        id: 'num-week',
        title: 'Thứ trong tuần 曜日',
        headers: ['Thứ', 'Tiếng Nhật', 'Nghĩa gốc của kanji'],
        rows: [
          ['Thứ Hai', '月曜日 — げつようび', '月 = mặt trăng'],
          ['Thứ Ba', '火曜日 — かようび', '火 = lửa'],
          ['Thứ Tư', '水曜日 — すいようび', '水 = nước'],
          ['Thứ Năm', '木曜日 — もくようび', '木 = cây, gỗ'],
          ['Thứ Sáu', '金曜日 — きんようび', '金 = vàng, tiền'],
          ['Thứ Bảy', '土曜日 — どようび', '土 = đất'],
          ['Chủ Nhật', '日曜日 — にちようび', '日 = mặt trời'],
        ],
      },
      {
        id: 'num-counters',
        title: 'Trợ số từ: tuổi 才, tầng 階, người 人, vật ～つ',
        note: '20歳 = はたち là bất quy tắc hoàn toàn và ra đề rất nhiều. 3階 đọc さんGAい, không phải さんかい.',
        headers: ['Số', 'Tuổi 才', 'Tầng 階', 'Người 人', 'Vật ～つ'],
        rows: [
          ['1', 'いっさい', 'いっかい', 'ひとり', 'ひとつ'],
          ['2', 'にさい', 'にかい', 'ふたり', 'ふたつ'],
          ['3', 'さんさい', 'さんがい', 'さんにん', 'みっつ'],
          ['4', 'よんさい', 'よんかい', 'よにん', 'よっつ'],
          ['5', 'ごさい', 'ごかい', 'ごにん', 'いつつ'],
          ['6', 'ろくさい', 'ろっかい', 'ろくにん', 'むっつ'],
          ['7', 'ななさい', 'ななかい', 'しちにん', 'ななつ'],
          ['8', 'はっさい', 'はっかい', 'はちにん', 'やっつ'],
          ['9', 'きゅうさい', 'きゅうかい', 'きゅうにん', 'ここのつ'],
          ['10', 'じゅっさい', 'じゅっかい', 'じゅうにん', 'とお'],
          ['20', 'はたち ⚠', 'にじゅっかい', 'にじゅうにん', '—'],
        ],
        dangerRows: [0, 2, 3, 5, 7, 9, 10],
      },
    ],
    tips: [
      {
        title: 'Cách hỏi phải thuộc',
        body:
          'いくらですか (bao nhiêu tiền) · 何時ですか (mấy giờ) · 何曜日ですか (thứ mấy) · ' +
          '何月何日ですか (ngày mấy tháng mấy) · 何才ですか (bao nhiêu tuổi) · 何人ですか (mấy người).',
      },
      {
        title: 'Sáng / chiều / rưỡi',
        body: 'ごぜん = sáng (AM) · ごご = chiều (PM) · 半 (はん) = rưỡi. Ví dụ: ごご5時半 = 5 giờ rưỡi chiều.',
      },
    ],
  },

  /* ─────────── TRỢ TỪ ─────────── */
  {
    id: 'particle',
    title: 'Trợ từ',
    icon: '🔗',
    summary:
      '~70% câu trong đề FE là điền chỗ trống, và phần lớn chỗ trống đó là một trợ từ. ' +
      'Nắm chắc bảng này là nắm phần lớn số điểm phần trắc nghiệm.',
    tables: [
      {
        id: 'part-main',
        title: '12 trợ từ của toàn môn học',
        headers: ['Trợ từ', 'Vai trò', 'Ví dụ'],
        rows: [
          ['は (đọc wa)', 'đánh dấu chủ đề — “thì, là, ở”', 'わたしは がくせいです。'],
          ['の', 'nối 2 danh từ: “của”, thuộc về', 'わたしの ほん / にほんごの せんせい'],
          ['も', '“cũng” — THAY THẾ は, không đứng chung', 'わたしも がくせいです。'],
          ['か', 'đặt cuối câu → câu hỏi', 'がくせいですか。'],
          ['を', 'tân ngữ trực tiếp', 'ごはんを たべます。'],
          ['に', 'thời điểm cụ thể / đích đến / nơi tồn tại', '7時に おきます。学校に 行きます。'],
          ['で', 'NƠI diễn ra hành động / phương tiện', 'うちで べんきょうします。バスで 行きます。'],
          ['へ (đọc e)', 'hướng đi (thay được cho に khi chỉ đích)', '学校へ 行きます。'],
          ['と', 'liệt kê ĐẦY ĐỦ / đi cùng ai', 'パンと たまご / ともだちと 行きます。'],
          ['や …など', 'liệt kê VÍ DỤ — “…và những thứ khác”', 'ベトナム人や 中国人など'],
          ['から … まで', 'từ … đến (giờ hoặc nơi chốn)', '9時から 5時まで はたらきます。'],
          ['が', 'chủ ngữ của あります/います', 'ほんが あります。'],
        ],
      },
      {
        id: 'part-traps',
        title: 'Ba cặp bẫy ra đề nhiều nhất',
        headers: ['Cặp', 'Khác nhau ở đâu', 'Ví dụ đối chiếu'],
        rows: [
          [
            'に  vs  で',
            'に = đích đến / thời điểm. で = nơi HÀNH ĐỘNG xảy ra',
            '学校に 行きます (đi tới trường) ≠ 学校で べんきょうします (học ở trường)',
          ],
          [
            'と  vs  や',
            'と = kể hết. や = kể vài cái làm ví dụ',
            'パンと たまご (chỉ 2 thứ) ≠ パンや たまごなど (còn thứ khác nữa)',
          ],
          [
            'は  vs  も',
            'も thay thế は, không bao giờ viết はも',
            'わたしは… → わたしも… (KHÔNG viết わたしはも)',
          ],
        ],
        dangerRows: [0, 1, 2],
      },
      {
        id: 'part-verbpair',
        title: 'Học động từ kèm trợ từ — đừng học lẻ',
        headers: ['Cụm chuẩn', 'Nghĩa'],
        rows: [
          ['ごはんを たべます', 'ăn cơm'],
          ['みずを のみます', 'uống nước'],
          ['学校へ / 学校に 行きます', 'đi đến trường'],
          ['うちで べんきょうします', 'học ở nhà'],
          ['7時に おきます', 'dậy lúc 7 giờ'],
          ['11時に ねます', 'đi ngủ lúc 11 giờ'],
          ['バスで 行きます', 'đi bằng xe buýt'],
          ['あるいて 行きます ⚠', 'đi bộ — KHÔNG nói あるきで'],
          ['ともだちと 行きます', 'đi cùng bạn'],
          ['会社で はたらきます', 'làm việc ở công ty'],
        ],
        dangerRows: [7],
      },
    ],
    tips: [
      {
        title: 'Mẹo làm nhanh dạng điền trợ từ',
        body:
          'Nhìn chữ NGAY SAU chỗ trống trước, đừng dịch cả câu. Sau chỗ trống là động từ di chuyển ' +
          '(行きます/きます) → thường là へ hoặc に. Là động từ hành động (べんきょうします/はたらきます) → で. ' +
          'Là một mốc giờ đứng trước → に.',
      },
      {
        title: 'どこも / なにも',
        body:
          'どこも 行きません = không đi đâu cả (đi với động từ DI CHUYỂN). なにも しません = không làm gì cả. ' +
          'Cả hai LUÔN đi kèm động từ phủ định.',
      },
    ],
  },

  /* ─────────── CHỈ ĐỊNH & TỪ ĐỂ HỎI ─────────── */
  {
    id: 'demo',
    title: 'Chỉ định & từ để hỏi',
    icon: '👉',
    summary:
      'Hai nhóm này ra đề lặp đi lặp lại trong cả 14 đề thật. Có một mẹo nhận dạng ' +
      'giải được gần hết dạng câu đó mà không cần dịch.',
    tables: [
      {
        id: 'demo-kosoado',
        title: 'Bảng ko-so-a-do',
        note: 'Hàng đầu = gần người nói, hàng hai = gần người nghe, hàng ba = xa cả hai, hàng bốn = từ để hỏi.',
        headers: ['', 'Đứng một mình', 'Trước danh từ', 'Nơi chốn', 'Lịch sự'],
        rows: [
          ['Này (gần tôi)', 'これ', 'この + N', 'ここ', 'こちら'],
          ['Đó (gần bạn)', 'それ', 'その + N', 'そこ', 'そちら'],
          ['Kia (xa cả hai)', 'あれ', 'あの + N', 'あそこ', 'あちら'],
          ['Nào? (hỏi)', 'どれ', 'どの + N', 'どこ', 'どちら'],
        ],
      },
      {
        id: 'demo-rule',
        title: 'Mẹo phân biệt これ vs この (ra đề rất nhiều)',
        headers: ['Nhìn thấy gì sau chỗ trống', 'Chọn', 'Ví dụ'],
        rows: [
          ['Ngay sau là danh từ trần', 'この / その / あの', '（この）ほんは わたしのです。'],
          ['Ngay sau là は / が / を … (không có danh từ)', 'これ / それ / あれ', '（これ）は ほんです。'],
        ],
        dangerRows: [0, 1],
      },
      {
        id: 'demo-question',
        title: '6 từ để hỏi',
        headers: ['Từ hỏi', 'Nghĩa', 'Ví dụ'],
        rows: [
          ['なに / なん', 'cái gì', 'これは 何ですか。'],
          ['だれ', 'ai', 'あの人は だれですか。'],
          ['どこ', 'ở đâu', 'トイレは どこですか。'],
          ['いつ', 'khi nào', 'たんじょうびは いつですか。'],
          ['なん + trợ số từ', 'mấy… / bao nhiêu…', '何時 / 何人 / 何曜日 / 何才'],
          ['どちら', 'bên nào / ở đâu (lịch sự)', 'おくには どちらですか。'],
        ],
      },
      {
        id: 'demo-dokono',
        title: 'どこの vs なんの vs だれの',
        headers: ['Mẫu', 'Hỏi về', 'Ví dụ'],
        rows: [
          ['どこの + N', 'xuất xứ, nước nào', 'どこの ビールですか → ドイツの ビールです。'],
          ['なんの + N', 'thể loại, loại gì', 'なんの カレーですか → とりにくの カレーです。'],
          ['だれの + N', 'của ai', 'だれの かばんですか → わたしのです。'],
        ],
      },
    ],
    tips: [
      {
        title: 'Mẹo suy ngược từ đáp án',
        body:
          'Với câu hỏi chọn từ để hỏi, ĐỌC CÂU TRẢ LỜI trước rồi suy ngược lại: đáp án là một mốc giờ → 何時; ' +
          'là tên người → だれ; là địa điểm → どこ; là ngày → いつ. Nhanh hơn nhiều so với dịch cả đoạn hội thoại.',
      },
    ],
  },

  /* ─────────── ĐỘNG TỪ & MẪU CÂU ─────────── */
  {
    id: 'grammar',
    title: 'Động từ & mẫu câu',
    icon: '🧩',
    summary:
      'Toàn bộ động từ của môn này chỉ dùng thể ます với đúng 4 dạng. Không có chia bất quy tắc nào ' +
      'ở trình độ A1.1 — đây là phần dễ ăn điểm nhất trong ngữ pháp.',
    tables: [
      {
        id: 'gram-masu',
        title: '4 dạng của thể ます',
        headers: ['Dạng', 'Đuôi', 'Ví dụ たべる (ăn)'],
        rows: [
          ['Hiện tại / tương lai — khẳng định', '～ます', 'たべます'],
          ['Hiện tại / tương lai — phủ định', '～ません', 'たべません'],
          ['Quá khứ — khẳng định', '～ました', 'たべました'],
          ['Quá khứ — phủ định', '～ませんでした', 'たべませんでした'],
        ],
      },
      {
        id: 'gram-verbs',
        title: '22 động từ hay ra đề nhất',
        headers: ['Tiếng Nhật', 'Nghĩa', 'Tiếng Nhật', 'Nghĩa'],
        rows: [
          ['たべます', 'ăn', 'のみます', 'uống'],
          ['行きます (いきます)', 'đi', 'きます', 'đến'],
          ['かえります', 'về', 'おきます', 'thức dậy'],
          ['ねます', 'ngủ', 'はたらきます', 'làm việc'],
          ['べんきょうします', 'học', 'おしえます', 'dạy'],
          ['よみます', 'đọc', 'かきます', 'viết'],
          ['みます', 'xem, nhìn', 'ききます', 'nghe'],
          ['かいます', 'mua', 'します', 'làm'],
          ['あります', 'có (đồ vật)', 'います', 'có (người, vật sống)'],
          ['はじまります', 'bắt đầu', 'おわります', 'kết thúc'],
          ['わかります', 'hiểu', 'あるきます', 'đi bộ'],
        ],
      },
      {
        id: 'gram-patterns',
        title: 'Mẫu câu lõi — thuộc là viết/nói được cả bài',
        headers: ['Mẫu', 'Nghĩa', 'Ví dụ'],
        rows: [
          ['N は N です', 'A là B', 'わたしは がくせいです。'],
          ['N は N じゃ ありません', 'A không phải B', 'にほんじんじゃ ありません。'],
          ['N は N ですか', 'A có phải B không?', 'あなたは がくせいですか。'],
          ['N の N', 'N của N', 'にほんごの ほん'],
          ['N も', 'N cũng', 'わたしも がくせいです。'],
          ['～から ～まで', 'từ… đến…', '9時から 5時まで'],
          ['N を ください', 'cho tôi N', 'ビールを 2つ ください。'],
          ['「A」は ～ごで「B」です', 'A trong tiếng… là B', '「たまご」は えいごで「egg」です。'],
          ['N が あります / います', 'có N', 'ほんが あります。'],
          ['とても + tính từ', 'rất…', 'とても おいしいです。'],
        ],
      },
      {
        id: 'gram-adj',
        title: 'Tính từ & phó từ hay dùng',
        headers: ['Tiếng Nhật', 'Nghĩa', 'Tiếng Nhật', 'Nghĩa'],
        rows: [
          ['おいしい', 'ngon', 'たかい', 'đắt, cao'],
          ['やすい', 'rẻ', 'おおきい', 'to'],
          ['ちいさい', 'nhỏ', 'あたらしい', 'mới'],
          ['ふるい', 'cũ', 'いい', 'tốt'],
          ['むずかしい', 'khó', 'やさしい', 'dễ, hiền'],
          ['とても', 'rất', 'あまり + phủ định', 'không… lắm'],
          ['まいにち', 'mỗi ngày', 'まいあさ', 'mỗi sáng'],
          ['まいばん', 'mỗi tối', 'いま', 'bây giờ'],
        ],
      },
    ],
  },

  /* ─────────── KANJI ─────────── */
  {
    id: 'kanji',
    title: 'Chữ Hán — 20 từ là đủ đọc hết bài',
    icon: '🈶',
    summary:
      'Toàn bộ 13 bài đọc thi nói chỉ có 38 chữ Hán khác nhau, và 10 chữ đầu đã phủ ~70% số lần xuất hiện. ' +
      'Đừng học chữ rời — học theo TỪ, vì trong bài kanji luôn nằm trong những từ lặp đi lặp lại.',
    tables: [
      {
        id: 'kanji-20-words',
        title: '20 từ này phủ gần hết 38 chữ Hán của 13 bài đọc',
        note:
          'Học đúng bằng này là đọc được bài. Để ý: 一二三四七九十 và 月火水木金土日 đã nằm sẵn trong đám từ ' +
          'dưới đây — bạn KHÔNG phải học chúng riêng.',
        headers: ['Từ', 'Cách đọc', 'Nghĩa'],
        rows: [
          ['私', 'わたし', 'tôi — chữ ra đề nhiều nhất'],
          ['日本語', 'にほんご', 'tiếng Nhật'],
          ['学校', 'がっこう', 'trường học'],
          ['学生', 'がくせい', 'học sinh, sinh viên'],
          ['先生', 'せんせい', 'giáo viên'],
          ['大学', 'だいがく', 'đại học'],
          ['会社', 'かいしゃ', 'công ty'],
          ['会社員', 'かいしゃいん', 'nhân viên công ty'],
          ['月曜日 … 日曜日', 'げつようび … にちようび', '7 thứ trong tuần'],
          ['何時', 'なんじ', 'mấy giờ'],
          ['一時 / 四時 / 七時 / 九時', 'いちじ / よじ / しちじ / くじ', 'các giờ — 3 cái sau bất quy tắc'],
          ['半', 'はん', 'rưỡi'],
          ['毎日', 'まいにち', 'mỗi ngày'],
          ['勉強', 'べんきょう', 'học tập (Hán-Việt “miễn cưỡng” nhưng nghĩa khác)'],
          ['時間', 'じかん', 'thời gian'],
          ['二十歳', 'はたち', '20 tuổi — bất quy tắc hoàn toàn'],
          ['中国', 'ちゅうごく', 'Trung Quốc'],
          ['行きます', 'いきます', 'đi'],
          ['働きます', 'はたらきます', 'làm việc'],
          ['三つ / 三時間', 'みっつ / さんじかん', 'ba cái / ba tiếng'],
        ],
        dangerRows: [10, 15],
      },
      {
        id: 'kanji-fe-extra',
        title: '5 chữ thêm cho phần TRẮC NGHIỆM — ít gặp trong bài đọc nhưng hay ra đề',
        note: 'Học 5 chữ này mất 10 phút và phủ nốt phần kanji của đề FE.',
        headers: ['Chữ', 'Đọc', 'Nghĩa', 'Từ ghép hay gặp'],
        rows: [
          ['才 / 歳', 'さい', 'tuổi', '18才 = じゅうはっさい'],
          ['円', 'えん', 'yên (tiền)', '1000円 = せんえん'],
          ['食', 'しょく / た-', 'ăn', '食べます · 食堂'],
          ['誕生日', 'たんじょうび', 'sinh nhật', '誕生日は いつですか'],
          ['英語', 'えいご', 'tiếng Anh', 'KHÔNG phải イギリスご'],
        ],
        dangerRows: [4],
      },
      {
        id: 'kanji-top',
        title: 'Xếp theo tần suất trong đề thật',
        note: 'Luôn học kanji TRONG TỪ GHÉP (学生, 日本語, 先生), đừng học chữ lẻ.',
        headers: ['Kanji', 'Nghĩa', 'Cách đọc', 'Từ ghép mẫu', 'Số lần'],
        rows: [
          ['私', 'tôi', 'わたし', '私は学生です', '86'],
          ['時', 'giờ', 'じ / とき', '3時 = さんじ', '66'],
          ['何', 'gì, bao nhiêu', 'なに / なん', '何時, 何人, 何曜日', '57'],
          ['生', 'sinh, sống', 'せい / なま', '学生, 誕生日, 先生', '38'],
          ['才', 'tuổi', 'さい', '18才 = じゅうはっさい', '36'],
          ['円', 'yên (tiền)', 'えん', '1000円', '29'],
          ['語', 'ngôn ngữ', 'ご', '日本語, 英語', '14'],
          ['校', 'trường học', 'こう', '学校', '13'],
          ['食', 'ăn', 'しょく / た-', '食べます, 食堂', '12'],
          ['間', 'khoảng, giữa', 'かん / あいだ', '時間, 一週間', '11'],
          ['田 / 中', 'ruộng / giữa', 'た / なか・ちゅう', '田中さん, 中国', '5'],
          ['誕', 'sinh', 'たん', '誕生日 = たんじょうび', '4'],
          ['先', 'trước', 'せん', '先生 = せんせい', '4'],
          ['字', 'chữ', 'じ', '漢字, 名字', '4'],
          ['性', 'giới tính', 'せい', '男性, 女性', '4'],
        ],
      },
      {
        id: 'kanji-num',
        title: 'Kanji số — bắt buộc, xuất hiện ở mọi đề',
        headers: ['Kanji', 'Số', 'Kanji', 'Số'],
        rows: [
          ['一', '1 — いち', '七', '7 — しち/なな'],
          ['二', '2 — に', '八', '8 — はち'],
          ['三', '3 — さん', '九', '9 — きゅう/く'],
          ['四', '4 — よん/し', '十', '10 — じゅう'],
          ['五', '5 — ご', '百', '100 — ひゃく'],
          ['六', '6 — ろく', '千 / 万', '1.000 / 10.000'],
        ],
      },
      {
        id: 'kanji-day',
        title: 'Kanji ngày trong tuần & cơ bản',
        headers: ['Kanji', 'Nghĩa', 'Kanji', 'Nghĩa'],
        rows: [
          ['月', 'trăng, tháng', '金', 'vàng, tiền'],
          ['火', 'lửa', '土', 'đất'],
          ['水', 'nước', '日', 'mặt trời, ngày'],
          ['木', 'cây, gỗ', '曜', '(trong 曜日)'],
          ['人', 'người — ひと/じん', '本', 'sách, gốc — ほん'],
          ['学', 'học — がく', '会社', 'công ty — かいしゃ'],
          ['大学', 'đại học — だいがく', '分', 'phút — ふん/ぷん'],
        ],
      },
    ],
    tips: [
      {
        title: 'Quy tắc đoán âm On / Kun',
        body:
          'Kanji ghép với kanji khác → thường đọc âm On (日本人 = にほんじん). ' +
          'Kanji đứng một mình hoặc kèm hiragana → thường đọc âm Kun (人 = ひと, 山 = やま). ' +
          'Không phải luật cứng nhưng đúng phần lớn trường hợp — đủ để đoán khi bí.',
      },
      {
        title: 'Nếu chỉ kịp học một chữ',
        body: '私 (わたし). Nó xuất hiện 86 lần trong 420 câu — nhiều nhất toàn bộ đề thật.',
      },
    ],
  },

  /* ─────────── TỪ VỰNG ─────────── */
  {
    id: 'vocab',
    title: 'Từ vựng lõi (bản rút gọn)',
    icon: '📚',
    summary:
      'Dạng điền chỗ trống (~70% đề) phần lớn kiểm tra collocation từ vựng chứ không phải logic ngữ pháp. ' +
      'Đây là bản RÚT GỌN ~130 từ để đọc lướt nhanh trong ngày thi — bộ đầy đủ 231 từ, có câu ví dụ, ' +
      'tìm kiếm, thẻ lật và bài kiểm tra nằm ở tab “Từ vựng”.',
    tables: [
      {
        id: 'vocab-people',
        title: 'Người, nghề nghiệp, quốc tịch',
        headers: ['Tiếng Nhật', 'Nghĩa', 'Tiếng Nhật', 'Nghĩa'],
        rows: [
          ['わたし', 'tôi', 'あなた', 'bạn'],
          ['がくせい (学生)', 'học sinh, sinh viên', 'せんせい (先生)', 'giáo viên'],
          ['かいしゃいん', 'nhân viên công ty', 'いしゃ', 'bác sĩ'],
          ['ともだち', 'bạn bè', 'かぞく', 'gia đình'],
          ['にほんじん', 'người Nhật', 'ベトナムじん', 'người Việt'],
          ['アメリカじん', 'người Mỹ', 'かんこくじん', 'người Hàn'],
          ['ちゅうごくじん', 'người Trung', 'せいと', 'học trò'],
        ],
      },
      {
        id: 'vocab-school',
        title: 'Trường học & đồ vật',
        headers: ['Tiếng Nhật', 'Nghĩa', 'Tiếng Nhật', 'Nghĩa'],
        rows: [
          ['がっこう (学校)', 'trường học', 'だいがく (大学)', 'đại học'],
          ['きょうしつ', 'lớp học', 'じゅぎょう', 'tiết học'],
          ['ほん (本)', 'sách', 'ノート', 'vở'],
          ['えんぴつ', 'bút chì', 'ペン', 'bút'],
          ['かばん', 'cặp, túi', 'つくえ', 'bàn'],
          ['いす', 'ghế', 'とけい', 'đồng hồ'],
          ['かさ', 'ô, dù', 'かぎ', 'chìa khoá'],
          ['でんわ', 'điện thoại', 'パソコン', 'máy tính'],
          ['テレビ', 'ti-vi', 'カメラ', 'máy ảnh'],
          ['じしょ', 'từ điển', 'しんぶん', 'báo'],
        ],
      },
      {
        id: 'vocab-food',
        title: 'Ăn uống',
        headers: ['Tiếng Nhật', 'Nghĩa', 'Tiếng Nhật', 'Nghĩa'],
        rows: [
          ['ごはん', 'cơm', 'パン', 'bánh mì'],
          ['たまご', 'trứng', 'にく', 'thịt'],
          ['とりにく', 'thịt gà', 'ぶたにく', 'thịt lợn'],
          ['やさい', 'rau', 'さかな', 'cá'],
          ['みず', 'nước', 'おちゃ', 'trà'],
          ['コーヒー', 'cà phê', 'ぎゅうにゅう', 'sữa'],
          ['ビール', 'bia', 'りょうり', 'món ăn'],
          ['あさごはん', 'bữa sáng', 'ひるごはん', 'bữa trưa'],
          ['ばんごはん', 'bữa tối', 'レストラン', 'nhà hàng'],
        ],
      },
      {
        id: 'vocab-place',
        title: 'Nơi chốn & đi lại',
        headers: ['Tiếng Nhật', 'Nghĩa', 'Tiếng Nhật', 'Nghĩa'],
        rows: [
          ['うち / いえ', 'nhà', 'かいしゃ (会社)', 'công ty'],
          ['としょかん', 'thư viện', 'びょういん', 'bệnh viện'],
          ['ぎんこう', 'ngân hàng', 'ゆうびんきょく', 'bưu điện'],
          ['えき', 'nhà ga', 'こうえん', 'công viên'],
          ['スーパー', 'siêu thị', 'コンビニ', 'cửa hàng tiện lợi'],
          ['デパート', 'trung tâm thương mại', 'みせ', 'cửa hàng'],
          ['でんしゃ', 'tàu điện', 'バス', 'xe buýt'],
          ['じてんしゃ', 'xe đạp', 'くるま', 'ô tô'],
          ['ひこうき', 'máy bay', 'あるいて', 'đi bộ'],
        ],
      },
      {
        id: 'vocab-time',
        title: 'Thời gian & sở thích',
        headers: ['Tiếng Nhật', 'Nghĩa', 'Tiếng Nhật', 'Nghĩa'],
        rows: [
          ['きょう', 'hôm nay', 'あした', 'ngày mai'],
          ['きのう', 'hôm qua', 'あさ', 'buổi sáng'],
          ['ひる', 'buổi trưa', 'よる', 'buổi tối'],
          ['ごぜん', 'sáng (AM)', 'ごご', 'chiều (PM)'],
          ['やすみ', 'ngày nghỉ', 'しゅうまつ', 'cuối tuần'],
          ['まいにち', 'mỗi ngày', 'ときどき', 'thỉnh thoảng'],
          ['しゅみ', 'sở thích', 'おんがく', 'âm nhạc'],
          ['どくしょ', 'đọc sách', 'りょこう', 'du lịch'],
          ['えいが', 'phim', 'スポーツ', 'thể thao'],
          ['すいえい', 'bơi lội', 'アルバイト', 'làm thêm'],
        ],
      },
      {
        id: 'vocab-greeting',
        title: 'Chào hỏi & câu trong lớp',
        headers: ['Tiếng Nhật', 'Nghĩa'],
        rows: [
          ['おはようございます', 'Chào buổi sáng'],
          ['こんにちは', 'Xin chào (ban ngày)'],
          ['こんばんは', 'Chào buổi tối'],
          ['はじめまして', 'Rất vui được gặp (lần đầu)'],
          ['よろしくおねがいします', 'Mong được giúp đỡ'],
          ['ありがとうございます', 'Cảm ơn'],
          ['すみません', 'Xin lỗi / làm phiền'],
          ['しつれいします', 'Xin phép (khi vào/ra phòng)'],
          ['もういちど おねがいします', 'Xin nhắc lại một lần nữa'],
          ['わかりません', 'Tôi không hiểu'],
        ],
      },
    ],
  },

  /* ─────────── CHIẾN THUẬT ─────────── */
  {
    id: 'tactics',
    title: 'Chiến thuật phòng thi',
    icon: '🎯',
    summary:
      'Rút từ cấu trúc thật của cả ba phần thi. Phần lớn điểm mất đi không phải vì không biết, ' +
      'mà vì làm bài sai cách.',
    tables: [
      {
        id: 'tac-fe-share',
        title: 'Trắc nghiệm FE — tỉ lệ dạng câu (từ 420 câu thật)',
        headers: ['Dạng câu', 'Tỉ lệ'],
        rows: [
          ['Điền chỗ trống (trợ từ, từ để hỏi, chỉ định, chia động từ, từ vựng)', '~70%'],
          ['Đọc Hán tự → hiragana', '~11%'],
          ['Chọn Hán tự đúng cho từ cho sẵn', '~11%'],
          ['Sắp xếp từ gợi ý thành câu', '~4%'],
          ['Từ mượn katakana → nghĩa tiếng Việt', '~2%'],
          ['Chọn từ khác loại (odd one out)', '~2%'],
        ],
      },
      {
        id: 'tac-pe-score',
        title: 'Thi nói — cơ cấu 100 điểm',
        headers: ['Phần', 'Điểm', 'Bạn phải làm gì'],
        rows: [
          ['READING', '30', 'Đọc to một bài cho sẵn. KHÔNG phải dịch, không phải trả lời câu hỏi.'],
          ['TALKING', '60', '1 câu hỏi không tranh + 3 câu hỏi về một bức tranh.'],
          ['PRESENTING', '10', 'Tác phong: chào, ngồi thẳng, nhìn giám thị, cảm ơn khi ra.'],
        ],
      },
    ],
    tips: [
      {
        title: 'Trắc nghiệm: 30 câu / 45 phút = 1,5 phút/câu',
        body:
          'Câu nào quá 2 phút thì đánh dấu, chọn tạm một đáp án và đi tiếp. Không bao giờ để trống — ' +
          'bỏ trống chắc chắn 0 điểm, đoán còn 25%. Loại đáp án sai rõ ràng trước rồi mới chọn.',
      },
      {
        title: 'Thi nói: 30 giây chuẩn bị dùng thế nào',
        body:
          'Đừng dịch bài. Quét đúng ba thứ: (1) mọi con số — đọc thầm cách đọc một lượt, ' +
          '(2) mọi từ katakana, (3) vị trí は・を・に・で・から・まで để biết chỗ ngắt hơi.',
      },
      {
        title: '10 điểm PRESENTING lấy trước khi nói tiếng Nhật',
        body:
          'しつれいします khi vào → よろしくおねがいします → ngồi thẳng, nhìn giám thị chứ không nhìn bàn → ' +
          'ありがとうございました khi xong. Sinh viên mất số điểm này chỉ vì lí nhí cúi mặt xuống bàn.',
      },
      {
        title: 'Không nghe rõ câu hỏi thì làm gì',
        body:
          'Nói もういちど おねがいします (xin nhắc lại). Hỏi lại KHÔNG bị trừ điểm; đoán bừa rồi trả lời lạc đề thì mất.',
      },
      {
        title: 'Đọc chậm hơn là đọc nhanh',
        body:
          'Phần READING chấm độ chính xác, không chấm tốc độ. Đọc sai một số rồi bình tĩnh đọc lại đúng ' +
          'vẫn tốt hơn đọc lướt cho xong.',
      },
    ],
  },
];
