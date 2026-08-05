/**
 * JPD113 — bộ thẻ lật CHỮ HÁN → CÁCH ĐỌC → NGHĨA.
 *
 * Vì sao tách riêng khỏi tab Từ vựng: tab đó lật theo TỪ VỰNG (nhìn わたし
 * đoán nghĩa), còn ở đây mặt trước luôn là MẶT CHỮ HÁN — đúng thứ đề thi
 * bắt làm ở dạng "đọc kanji" (~11% đề FE) và đúng thứ chặn người học ở
 * 13 bài đọc thi nói: nhìn 会社員 mà không bật ra được かいしゃいん.
 *
 * Ba dòng của mặt sau theo đúng thứ tự não cần: cách đọc (thứ phải bật ra
 * khi thi nói) → nghĩa tiếng Việt → từ Hán-Việt làm mấu nhớ.
 *
 * Nguồn dữ liệu: các bảng đã kiểm trong cheat-sheet (số/giờ/ngày/thứ,
 * 20 từ đọc bài, kanji theo tần suất), `HANVIET_TABLE` và bộ từ vựng
 * JPD113. Hai bộ cuối được SINH TỰ ĐỘNG từ nguồn thay vì chép tay, để
 * không bao giờ lệch với phần còn lại của trang.
 */

import { HANVIET_TABLE } from './names';
import { VOCAB_WORDS } from './vocab';
import { VOCAB_FREQ } from './vocabRank';

export interface KanjiCard {
  /** Mặt trước — dạng viết như xuất hiện trong bài (kanji, hoặc katakana ở bộ ngoại lai) */
  word: string;
  /** Mặt sau dòng 1 — cách đọc bằng kana */
  kana: string;
  /** Mặt sau dòng 2 — nghĩa tiếng Việt */
  meaning: string;
  /** Mặt sau dòng 3 — từ Hán-Việt tương ứng, dùng làm mấu nhớ */
  hanviet?: string;
  /** Bẫy hay sai, hiện dưới cùng khi lật */
  note?: string;
  /** true = cách đọc bất quy tắc, không suy ra được — tô đỏ */
  danger?: boolean;
}

export interface KanjiDeck {
  id: string;
  name: string;
  icon: string;
  desc: string;
  cards: KanjiCard[];
}

export const KANJI_CARD_KEY = 'jpd113:kanjicard:v1';
export const KANJI_MISS_KEY = 'jpd113:kanjicard-miss:v1';

/* ══════════════ 1. HAI MƯƠI TỪ ĐỦ ĐỌC HẾT BÀI ══════════════ */

const READING: KanjiCard[] = [
  { word: '私', kana: 'わたし', meaning: 'tôi', hanviet: 'TƯ', note: 'Chữ ra đề nhiều nhất: 86 lần trong 420 câu.' },
  { word: '日本', kana: 'にほん', meaning: 'nước Nhật', hanviet: 'NHẬT BẢN' },
  { word: '日本語', kana: 'にほんご', meaning: 'tiếng Nhật', hanviet: 'NHẬT BẢN NGỮ' },
  { word: '学校', kana: 'がっこう', meaning: 'trường học', hanviet: 'HỌC HIỆU', note: 'Có âm ngắt っ — đọc "gak-kou", hai nhịp rõ ràng.' },
  { word: '学生', kana: 'がくせい', meaning: 'học sinh, sinh viên', hanviet: 'HỌC SINH' },
  { word: '先生', kana: 'せんせい', meaning: 'thầy, cô giáo', hanviet: 'TIÊN SINH' },
  { word: '大学', kana: 'だいがく', meaning: 'trường đại học', hanviet: 'ĐẠI HỌC' },
  { word: '会社', kana: 'かいしゃ', meaning: 'công ty', hanviet: 'HỘI XÃ' },
  { word: '会社員', kana: 'かいしゃいん', meaning: 'nhân viên công ty', hanviet: 'HỘI XÃ VIÊN' },
  { word: '何時', kana: 'なんじ', meaning: 'mấy giờ', hanviet: 'HÀ THỜI' },
  { word: '半', kana: 'はん', meaning: 'rưỡi (30 phút)', hanviet: 'BÁN', note: '2時半 = にじはん = 2 giờ rưỡi.' },
  { word: '毎日', kana: 'まいにち', meaning: 'mỗi ngày, hằng ngày', hanviet: 'MỖI NHẬT' },
  { word: '時間', kana: 'じかん', meaning: 'thời gian', hanviet: 'THỜI GIAN' },
  {
    word: '勉強',
    kana: 'べんきょう',
    meaning: 'học tập',
    hanviet: 'MIỄN CƯỠNG',
    danger: true,
    note: 'Hán-Việt là "miễn cưỡng" nhưng nghĩa tiếng Nhật là HỌC TẬP — đừng suy theo nghĩa Việt.',
  },
  { word: '中国', kana: 'ちゅうごく', meaning: 'Trung Quốc', hanviet: 'TRUNG QUỐC' },
  { word: '行きます', kana: 'いきます', meaning: 'đi', hanviet: 'HÀNH', note: 'Kanji + đuôi hiragana → đọc âm Kun: い-きます.' },
  {
    word: '働きます',
    kana: 'はたらきます',
    meaning: 'làm việc',
    hanviet: 'ĐỘNG',
    note: '働 là chữ do người Nhật tự chế (人 + 動), mượn âm "động" của 動 — người Trung Quốc cũng không có chữ này.',
  },
  { word: '来ます', kana: 'きます', meaning: 'đến', hanviet: 'LAI', danger: true, note: '来 đổi âm theo thì: きます / きました / こない — học nguyên cụm.' },
  { word: '見ます', kana: 'みます', meaning: 'xem, nhìn', hanviet: 'KIẾN' },
  { word: '食べます', kana: 'たべます', meaning: 'ăn', hanviet: 'THỰC' },
  { word: '飲みます', kana: 'のみます', meaning: 'uống', hanviet: 'ẨM' },
  { word: '読みます', kana: 'よみます', meaning: 'đọc', hanviet: 'ĐỘC' },
  { word: '書きます', kana: 'かきます', meaning: 'viết', hanviet: 'THƯ' },
  { word: '聞きます', kana: 'ききます', meaning: 'nghe, hỏi', hanviet: 'VĂN' },
];

/* ══════════════ 2. SỐ · GIỜ · NGÀY VIẾT BẰNG KANJI ══════════════ */

/**
 * Cụm chứ không phải chữ rời: đề thi luôn viết 四時, 二十日 — biết 四 = よん
 * mà không biết 四時 = よじ thì vẫn sai. Toàn bộ số liệu dưới đây lấy từ
 * các bảng số đếm của cheat-sheet.
 */
const NUMBERS: KanjiCard[] = [
  { word: '一時', kana: 'いちじ', meaning: '1 giờ' },
  { word: '四時', kana: 'よじ', meaning: '4 giờ', danger: true, note: 'KHÔNG phải よんじ cũng không phải しじ.' },
  { word: '七時', kana: 'しちじ', meaning: '7 giờ', danger: true, note: 'Dùng âm し chứ không phải なな.' },
  { word: '九時', kana: 'くじ', meaning: '9 giờ', danger: true, note: 'KHÔNG phải きゅうじ.' },
  { word: '十時半', kana: 'じゅうじはん', meaning: '10 giờ rưỡi' },
  { word: '一分', kana: 'いっぷん', meaning: '1 phút', danger: true, note: 'Thần chú: 1–3–4–6–8–10 là ぷん, còn lại ふん.' },
  { word: '三分', kana: 'さんぷん', meaning: '3 phút', danger: true },
  { word: '八分', kana: 'はっぷん', meaning: '8 phút', danger: true },
  { word: '十分', kana: 'じゅっぷん', meaning: '10 phút', danger: true },
  { word: '何分', kana: 'なんぷん', meaning: 'mấy phút' },
  { word: '一日', kana: 'ついたち', meaning: 'ngày mùng 1', danger: true, note: 'Cả cột ngày 1→10 đều bất quy tắc, phải học vẹt.' },
  { word: '二日', kana: 'ふつか', meaning: 'ngày mùng 2', danger: true },
  { word: '四日', kana: 'よっか', meaning: 'ngày mùng 4', danger: true },
  { word: '八日', kana: 'ようか', meaning: 'ngày mùng 8', danger: true, note: 'Rất hay bị lẫn với 四日 よっか.' },
  { word: '十日', kana: 'とおか', meaning: 'ngày mùng 10', danger: true, note: 'Trường âm おお hiếm gặp — đọc kéo dài "tôô-ka".' },
  { word: '二十日', kana: 'はつか', meaning: 'ngày 20', danger: true },
  { word: '何日', kana: 'なんにち', meaning: 'ngày mấy' },
  { word: '一月', kana: 'いちがつ', meaning: 'tháng 1' },
  { word: '四月', kana: 'しがつ', meaning: 'tháng 4', danger: true, note: 'Tháng dùng し, KHÔNG phải よん.' },
  { word: '七月', kana: 'しちがつ', meaning: 'tháng 7', danger: true },
  { word: '九月', kana: 'くがつ', meaning: 'tháng 9', danger: true },
  { word: '何月', kana: 'なんがつ', meaning: 'tháng mấy' },
  { word: '二十歳', kana: 'はたち', meaning: '20 tuổi', danger: true, note: 'Bất quy tắc hoàn toàn, ra đề rất nhiều. Viết 二十才 cũng đọc はたち.' },
  { word: '十八才', kana: 'じゅうはっさい', meaning: '18 tuổi', danger: true, note: 'はち + さい → はっさい (âm ngắt).' },
  { word: '何才', kana: 'なんさい', meaning: 'mấy tuổi', note: 'Lịch sự hơn: おいくつですか.' },
  { word: '千円', kana: 'せんえん', meaning: '1.000 yên', danger: true, note: 'KHÔNG có いち ở đầu — いっせんえん là sai.' },
  { word: '三千円', kana: 'さんぜんえん', meaning: '3.000 yên', danger: true, note: 'せん → ぜん sau さん.' },
  { word: '六百円', kana: 'ろっぴゃくえん', meaning: '600 yên', danger: true, note: 'ろく + ひゃく → ろっぴゃく.' },
  { word: '一人', kana: 'ひとり', meaning: 'một người', danger: true },
  { word: '二人', kana: 'ふたり', meaning: 'hai người', danger: true, note: 'Từ 3 người trở đi mới đều: さんにん, よにん…' },
  { word: '何人', kana: 'なんにん', meaning: 'mấy người' },
  { word: '一つ', kana: 'ひとつ', meaning: 'một cái', danger: true },
  { word: '三つ', kana: 'みっつ', meaning: 'ba cái', danger: true },
  { word: '三時間', kana: 'さんじかん', meaning: 'ba tiếng đồng hồ', note: '三時 = 3 giờ (điểm), 三時間 = 3 tiếng (khoảng) — thêm 間 là đổi nghĩa.' },
  { word: '一週間', kana: 'いっしゅうかん', meaning: 'một tuần', danger: true },
];

/* ══════════════ 3. THỨ TRONG TUẦN ══════════════ */

const WEEKDAYS: KanjiCard[] = [
  { word: '月曜日', kana: 'げつようび', meaning: 'thứ Hai', hanviet: 'NGUYỆT DIỆU NHẬT', note: '月 ở đây đọc げつ chứ không phải がつ.' },
  { word: '火曜日', kana: 'かようび', meaning: 'thứ Ba', hanviet: 'HOẢ DIỆU NHẬT' },
  { word: '水曜日', kana: 'すいようび', meaning: 'thứ Tư', hanviet: 'THUỶ DIỆU NHẬT' },
  { word: '木曜日', kana: 'もくようび', meaning: 'thứ Năm', hanviet: 'MỘC DIỆU NHẬT' },
  { word: '金曜日', kana: 'きんようび', meaning: 'thứ Sáu', hanviet: 'KIM DIỆU NHẬT' },
  { word: '土曜日', kana: 'どようび', meaning: 'thứ Bảy', hanviet: 'THỔ DIỆU NHẬT' },
  { word: '日曜日', kana: 'にちようび', meaning: 'Chủ Nhật', hanviet: 'NHẬT DIỆU NHẬT' },
  { word: '何曜日', kana: 'なんようび', meaning: 'thứ mấy', note: 'Câu hỏi hay ra đề: 今日は 何曜日ですか。' },
];

/* ══════════════ 4. CHỮ HAY RA ĐỀ TRẮC NGHIỆM ══════════════ */

const FE_EXTRA: KanjiCard[] = [
  { word: '名前', kana: 'なまえ', meaning: 'tên', hanviet: 'DANH TIỀN', note: 'Câu đầu tiên giám thị hỏi: お名前は？' },
  { word: '英語', kana: 'えいご', meaning: 'tiếng Anh', hanviet: 'ANH NGỮ', danger: true, note: 'KHÔNG phải イギリスご.' },
  { word: '誕生日', kana: 'たんじょうび', meaning: 'sinh nhật', hanviet: 'ĐẢN SINH NHẬT' },
  { word: '漢字', kana: 'かんじ', meaning: 'chữ Hán', hanviet: 'HÁN TỰ' },
  { word: '男性', kana: 'だんせい', meaning: 'nam giới', hanviet: 'NAM TÍNH' },
  { word: '女性', kana: 'じょせい', meaning: 'nữ giới', hanviet: 'NỮ TÍNH' },
  { word: '食堂', kana: 'しょくどう', meaning: 'nhà ăn, căng-tin', hanviet: 'THỰC ĐƯỜNG' },
  { word: '田中さん', kana: 'たなかさん', meaning: 'anh/chị Tanaka', note: 'Tên người hay xuất hiện nhất trong đề — 田 = ruộng, 中 = giữa.' },
  { word: '日本人', kana: 'にほんじん', meaning: 'người Nhật', hanviet: 'NHẬT BẢN NHÂN', note: 'Kanji ghép kanji → âm On: にほんじん, không phải にほんひと.' },
  { word: '韓国', kana: 'かんこく', meaning: 'Hàn Quốc', hanviet: 'HÀN QUỐC' },
  { word: '医者', kana: 'いしゃ', meaning: 'bác sĩ', hanviet: 'Y GIẢ' },
  { word: '教師', kana: 'きょうし', meaning: 'giáo viên (tên nghề)', hanviet: 'GIÁO SƯ', note: 'Nói về nghề của mình dùng 教師, gọi người khác mới dùng 先生.' },
  { word: '銀行', kana: 'ぎんこう', meaning: 'ngân hàng', hanviet: 'NGÂN HÀNG' },
  { word: '図書館', kana: 'としょかん', meaning: 'thư viện', hanviet: 'ĐỒ THƯ QUÁN' },
  { word: '病院', kana: 'びょういん', meaning: 'bệnh viện', hanviet: 'BỆNH VIỆN', danger: true, note: 'びょういん (bệnh viện) khác びよういん (tiệm làm tóc) đúng một trường âm.' },
  { word: '電話', kana: 'でんわ', meaning: 'điện thoại', hanviet: 'ĐIỆN THOẠI' },
  { word: '新聞', kana: 'しんぶん', meaning: 'báo', hanviet: 'TÂN VĂN', danger: true, note: 'Hán-Việt "tân văn" nhưng nghĩa là TỜ BÁO, không phải tin tức mới.' },
  { word: '自転車', kana: 'じてんしゃ', meaning: 'xe đạp', hanviet: 'TỰ CHUYỂN XA' },
  { word: '音楽', kana: 'おんがく', meaning: 'âm nhạc', hanviet: 'ÂM NHẠC' },
  { word: '料理', kana: 'りょうり', meaning: 'món ăn, nấu ăn', hanviet: 'LIỆU LÝ', danger: true, note: 'Hán-Việt không giúp gì ở từ này — nhớ thẳng nghĩa.' },
  { word: '旅行', kana: 'りょこう', meaning: 'du lịch', hanviet: 'LỮ HÀNH' },
  { word: '読書', kana: 'どくしょ', meaning: 'đọc sách', hanviet: 'ĐỘC THƯ' },
  { word: '公園', kana: 'こうえん', meaning: 'công viên', hanviet: 'CÔNG VIÊN' },
];

/* ══════════════ 5. HÁN-VIỆT (sinh từ bảng đang hiển thị) ══════════════ */

/**
 * Lấy thẳng `HANVIET_TABLE` — chính bảng người học vừa đọc ngay phía trên
 * trong mục này. Chép tay lại sẽ có ngày lệch nhau.
 */
const HANVIET_CARDS: KanjiCard[] = HANVIET_TABLE.map((h) => ({
  word: h.kanji,
  kana: h.kana,
  meaning: h.meaning,
  hanviet: h.hanviet,
}));

/* ══════════════ 6. KATAKANA HAY RA ĐỀ (sinh từ bộ từ vựng) ══════════════ */

const KATA_RE = /^[゠-ヿㇰ-ㇿ゙-゜ｦ-ﾟ]+$/;

/**
 * Katakana không phải chữ Hán, nhưng cùng một nỗi khổ: nhìn mặt chữ mà
 * không bật ra được âm. Lọc thẳng từ bộ 231 từ và xếp theo tần suất ra đề
 * (`VOCAB_FREQ`) để 24 thẻ đầu là 24 từ đáng thuộc nhất.
 */
const KATAKANA_CARDS: KanjiCard[] = VOCAB_WORDS.filter((w) => KATA_RE.test(w.word))
  .map((w) => ({
    word: w.word,
    kana: w.kana,
    meaning: w.meaning,
    freq: VOCAB_FREQ[w.word]?.freq ?? 0,
  }))
  .sort((a, b) => b.freq - a.freq)
  .slice(0, 24)
  .map(({ word, kana, meaning }) => ({ word, kana, meaning }));

/* ══════════════ BỘ THẺ ══════════════ */

export const KANJI_DECKS: KanjiDeck[] = [
  {
    id: 'reading',
    name: 'Từ đọc bài',
    icon: '📖',
    desc: 'Những cụm phủ gần hết 38 chữ Hán của 13 bài đọc thi nói. Học bộ này trước.',
    cards: READING,
  },
  {
    id: 'numbers',
    name: 'Số · giờ · ngày',
    icon: '🔢',
    desc: 'Ổ bất quy tắc lớn nhất của môn: 四時 よじ, 一日 ついたち, 二十歳 はたち…',
    cards: NUMBERS,
  },
  {
    id: 'weekdays',
    name: 'Thứ trong tuần',
    icon: '📅',
    desc: 'Bảy thứ + 何曜日. Ra đề đều đặn ở cả trắc nghiệm lẫn thi nói.',
    cards: WEEKDAYS,
  },
  {
    id: 'hanviet',
    name: 'Hán-Việt',
    icon: '🇻🇳',
    desc: 'Nghĩa bạn đã biết sẵn từ tiếng Việt — chỉ còn phải nhớ cách đọc.',
    cards: HANVIET_CARDS,
  },
  {
    id: 'fe',
    name: 'Hay ra trắc nghiệm',
    icon: '🎯',
    desc: 'Chữ ít gặp trong bài đọc nhưng xuất hiện nhiều ở 420 câu đề FE.',
    cards: FE_EXTRA,
  },
  {
    id: 'katakana',
    name: 'Katakana',
    icon: '🔠',
    desc: '24 từ katakana hay ra đề nhất, xếp theo tần suất trong kho đề thật.',
    cards: KATAKANA_CARDS,
  },
];

/** Gộp mọi bộ, khử trùng theo mặt chữ — dùng cho lựa chọn "Tất cả". */
export const ALL_KANJI_CARDS: KanjiCard[] = (() => {
  const seen = new Set<string>();
  const out: KanjiCard[] = [];
  for (const deck of KANJI_DECKS) {
    for (const c of deck.cards) {
      if (seen.has(c.word)) continue;
      seen.add(c.word);
      out.push(c);
    }
  }
  return out;
})();
