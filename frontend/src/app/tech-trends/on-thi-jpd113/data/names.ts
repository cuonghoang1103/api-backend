/**
 * Viết tên tiếng Việt bằng katakana.
 *
 * Câu đầu tiên giám thị hỏi trong phần thi nói là おなまえは？ nên đây là
 * thứ đầu tiên mọi người cần, mà giáo trình lại không dạy.
 *
 * LƯU Ý QUAN TRỌNG: chuyển tự tên riêng KHÔNG có chuẩn duy nhất. Cùng một
 * tên có thể viết vài kiểu và đều được chấp nhận — giám thị không chấm
 * chính tả katakana của tên bạn, họ chỉ cần nghe ra. Bảng dưới ghi cách
 * viết phổ biến nhất, kèm biến thể hay gặp khi có.
 */

export interface NameRule {
  pattern: string;
  vi: string;
  kata: string;
  note: string;
}

/** Vì sao tên bị đổi dạng khi sang katakana */
export const NAME_RULES: NameRule[] = [
  {
    pattern: 'Dấu thanh',
    vi: 'sắc, huyền, hỏi, ngã, nặng',
    kata: '— bỏ hết —',
    note: 'Tiếng Nhật không có thanh điệu. Cường và Cương viết giống nhau: クオン.',
  },
  {
    pattern: 'ư, ơ',
    vi: 'Cường, Hương, Sơn',
    kata: 'ウ hoặc オ',
    note: 'Tiếng Nhật không có âm ư/ơ nên phải mượn âm gần nhất.',
  },
  {
    pattern: 'n · ng · nh cuối',
    vi: 'Lan, Long, Minh',
    kata: 'ン',
    note: 'Mọi âm mũi cuối đều gom về ン — đây là lý do nhiều tên khác nhau lại thành giống nhau.',
  },
  {
    pattern: 'c · ch · t cuối',
    vi: 'Ngọc, Đức, Việt',
    kata: 'ック / ット',
    note: 'Phải thêm nguyên âm vì tiếng Nhật không kết thúc bằng phụ âm (trừ ン).',
  },
  {
    pattern: 'Đ',
    vi: 'Đức, Đạt',
    kata: 'ド / ドゥ',
    note: 'Không có âm Đ riêng, dùng hàng ダ.',
  },
  {
    pattern: 'V',
    vi: 'Vân, Vũ, Việt',
    kata: 'ヴ hoặc バ',
    note: 'ヴ sát âm hơn nhưng バ dễ đọc hơn với người Nhật — dùng cái nào cũng được.',
  },
  {
    pattern: 'Ph · Th · Kh · Ng · Nh · Tr',
    vi: 'Phong, Thanh, Khanh, Nga, Nhung, Trang',
    kata: 'フ · タ/ティ · カ/ク · グ · ニ · チ',
    note: 'Các phụ âm ghép tiếng Việt đều phải quy về một hàng kana gần nhất.',
  },
];

export interface NameEntry {
  vi: string;
  kata: string;
  romaji: string;
}

/** ~60 tên người Việt hay gặp, xếp theo bảng chữ cái */
export const NAME_TABLE: NameEntry[] = [
  { vi: 'An / Anh', kata: 'アン', romaji: 'An' },
  { vi: 'Bảo', kata: 'バオ', romaji: 'Bao' },
  { vi: 'Bình', kata: 'ビン', romaji: 'Bin' },
  { vi: 'Chi', kata: 'チー', romaji: 'Chii' },
  { vi: 'Cường', kata: 'クオン', romaji: 'Kuon' },
  { vi: 'Dung', kata: 'ズン', romaji: 'Zun' },
  { vi: 'Dũng', kata: 'ズン', romaji: 'Zun' },
  { vi: 'Duy', kata: 'ズイ', romaji: 'Zui' },
  { vi: 'Đạt', kata: 'ダット', romaji: 'Datto' },
  { vi: 'Đức', kata: 'ドゥック', romaji: 'Dukku' },
  { vi: 'Giang', kata: 'ザン', romaji: 'Zan' },
  { vi: 'Hà', kata: 'ハー', romaji: 'Haa' },
  { vi: 'Hải', kata: 'ハイ', romaji: 'Hai' },
  { vi: 'Hạnh / Hằng', kata: 'ハン', romaji: 'Han' },
  { vi: 'Hiếu', kata: 'ヒエウ', romaji: 'Hieu' },
  { vi: 'Hoa', kata: 'ホア', romaji: 'Hoa' },
  { vi: 'Hoàng', kata: 'ホアン', romaji: 'Hoan' },
  { vi: 'Hùng', kata: 'フン', romaji: 'Fun' },
  { vi: 'Hương', kata: 'フオン', romaji: 'Fuon' },
  { vi: 'Huy', kata: 'フイ', romaji: 'Fui' },
  { vi: 'Khanh / Khánh', kata: 'カイン', romaji: 'Kain' },
  { vi: 'Kiên', kata: 'キエン', romaji: 'Kien' },
  { vi: 'Lan', kata: 'ラン', romaji: 'Ran' },
  { vi: 'Linh', kata: 'リン', romaji: 'Rin' },
  { vi: 'Loan', kata: 'ロアン', romaji: 'Roan' },
  { vi: 'Long', kata: 'ロン', romaji: 'Ron' },
  { vi: 'Mai', kata: 'マイ', romaji: 'Mai' },
  { vi: 'Minh', kata: 'ミン', romaji: 'Min' },
  { vi: 'My / Mỹ', kata: 'ミー', romaji: 'Mii' },
  { vi: 'Nam', kata: 'ナム', romaji: 'Namu' },
  { vi: 'Nga', kata: 'ガー', romaji: 'Gaa' },
  { vi: 'Ngân', kata: 'ガン', romaji: 'Gan' },
  { vi: 'Ngọc', kata: 'ゴック', romaji: 'Gokku' },
  { vi: 'Nguyên / Nguyễn', kata: 'グエン', romaji: 'Guen' },
  { vi: 'Nhung', kata: 'ニュン', romaji: 'Nyun' },
  { vi: 'Oanh', kata: 'オアン', romaji: 'Oan' },
  { vi: 'Phong', kata: 'フォン', romaji: 'Fon' },
  { vi: 'Phú / Phúc', kata: 'フー / フック', romaji: 'Fuu / Fukku' },
  { vi: 'Phương', kata: 'フオン', romaji: 'Fuon' },
  { vi: 'Quang', kata: 'クアン', romaji: 'Kuan' },
  { vi: 'Quân', kata: 'クアン', romaji: 'Kuan' },
  { vi: 'Quỳnh', kata: 'クイン', romaji: 'Kuin' },
  { vi: 'Sơn', kata: 'ソン', romaji: 'Son' },
  { vi: 'Tâm', kata: 'タム', romaji: 'Tamu' },
  { vi: 'Thanh', kata: 'タイン', romaji: 'Tain' },
  { vi: 'Thảo', kata: 'タオ', romaji: 'Tao' },
  { vi: 'Thắng', kata: 'タン', romaji: 'Tan' },
  { vi: 'Thu', kata: 'トゥー', romaji: 'Tuu' },
  { vi: 'Thùy / Thủy', kata: 'トゥイ', romaji: 'Tui' },
  { vi: 'Tiến', kata: 'ティエン', romaji: 'Tien' },
  { vi: 'Trang', kata: 'チャン', romaji: 'Chan' },
  { vi: 'Trung', kata: 'チュン', romaji: 'Chun' },
  { vi: 'Tú', kata: 'トゥー', romaji: 'Tuu' },
  { vi: 'Tuấn', kata: 'トゥアン', romaji: 'Tuan' },
  { vi: 'Vân', kata: 'ヴァン / バン', romaji: 'Van / Ban' },
  { vi: 'Việt', kata: 'ヴィエット / ベト', romaji: 'Vietto / Beto' },
  { vi: 'Vũ', kata: 'ヴー / ブー', romaji: 'Vuu / Buu' },
  { vi: 'Yến', kata: 'イエン', romaji: 'Ien' },
];

/** Họ hay gặp — dùng khi giám thị hỏi họ tên đầy đủ */
export const SURNAME_TABLE: NameEntry[] = [
  { vi: 'Nguyễn', kata: 'グエン', romaji: 'Guen' },
  { vi: 'Trần', kata: 'チャン', romaji: 'Chan' },
  { vi: 'Lê', kata: 'レー', romaji: 'Ree' },
  { vi: 'Phạm', kata: 'ファム', romaji: 'Famu' },
  { vi: 'Hoàng / Huỳnh', kata: 'ホアン / フイン', romaji: 'Hoan / Fuin' },
  { vi: 'Phan', kata: 'ファン', romaji: 'Fan' },
  { vi: 'Vũ / Võ', kata: 'ヴー / ヴォー', romaji: 'Vuu / Voo' },
  { vi: 'Đặng', kata: 'ダン', romaji: 'Dan' },
  { vi: 'Bùi', kata: 'ブイ', romaji: 'Bui' },
  { vi: 'Đỗ', kata: 'ドー', romaji: 'Doo' },
  { vi: 'Hồ', kata: 'ホー', romaji: 'Hoo' },
  { vi: 'Ngô', kata: 'ゴー', romaji: 'Goo' },
  { vi: 'Dương', kata: 'ズオン', romaji: 'Zuon' },
  { vi: 'Lý', kata: 'リー', romaji: 'Rii' },
];

/* ══════════════════ HÁN-VIỆT ══════════════════ */

export interface HanVietPair {
  kanji: string;
  kana: string;
  hanviet: string;
  meaning: string;
}

/**
 * Lợi thế riêng của người học Việt Nam: rất nhiều từ ghép kanji trong
 * JPD113 trùng khớp với từ Hán-Việt đã nằm sẵn trong tiếng mẹ đẻ. Nhìn
 * mặt chữ là đoán được nghĩa mà không cần học thuộc gì thêm.
 */
export const HANVIET_TABLE: HanVietPair[] = [
  { kanji: '学生', kana: 'がくせい', hanviet: 'HỌC SINH', meaning: 'học sinh, sinh viên' },
  { kanji: '先生', kana: 'せんせい', hanviet: 'TIÊN SINH', meaning: 'thầy, cô giáo' },
  { kanji: '大学', kana: 'だいがく', hanviet: 'ĐẠI HỌC', meaning: 'trường đại học' },
  { kanji: '学校', kana: 'がっこう', hanviet: 'HỌC HIỆU', meaning: 'trường học' },
  { kanji: '日本', kana: 'にほん', hanviet: 'NHẬT BẢN', meaning: 'nước Nhật' },
  { kanji: '中国', kana: 'ちゅうごく', hanviet: 'TRUNG QUỐC', meaning: 'Trung Quốc' },
  { kanji: '韓国', kana: 'かんこく', hanviet: 'HÀN QUỐC', meaning: 'Hàn Quốc' },
  { kanji: '英語', kana: 'えいご', hanviet: 'ANH NGỮ', meaning: 'tiếng Anh' },
  { kanji: '日本語', kana: 'にほんご', hanviet: 'NHẬT BẢN NGỮ', meaning: 'tiếng Nhật' },
  { kanji: '会社', kana: 'かいしゃ', hanviet: 'HỘI XÃ', meaning: 'công ty' },
  { kanji: '会社員', kana: 'かいしゃいん', hanviet: 'HỘI XÃ VIÊN', meaning: 'nhân viên công ty' },
  { kanji: '時間', kana: 'じかん', hanviet: 'THỜI GIAN', meaning: 'thời gian' },
  { kanji: '教師', kana: 'きょうし', hanviet: 'GIÁO SƯ', meaning: 'giáo viên (nghề)' },
  { kanji: '医者', kana: 'いしゃ', hanviet: 'Y GIẢ', meaning: 'bác sĩ' },
  { kanji: '料理', kana: 'りょうり', hanviet: 'LIỆU LÝ', meaning: 'món ăn, nấu ăn' },
  { kanji: '音楽', kana: 'おんがく', hanviet: 'ÂM NHẠC', meaning: 'âm nhạc' },
  { kanji: '読書', kana: 'どくしょ', hanviet: 'ĐỘC THƯ', meaning: 'đọc sách' },
  { kanji: '旅行', kana: 'りょこう', hanviet: 'LỮ HÀNH', meaning: 'du lịch' },
  { kanji: '図書館', kana: 'としょかん', hanviet: 'ĐỒ THƯ QUÁN', meaning: 'thư viện' },
  { kanji: '病院', kana: 'びょういん', hanviet: 'BỆNH VIỆN', meaning: 'bệnh viện' },
  { kanji: '銀行', kana: 'ぎんこう', hanviet: 'NGÂN HÀNG', meaning: 'ngân hàng' },
  { kanji: '公園', kana: 'こうえん', hanviet: 'CÔNG VIÊN', meaning: 'công viên' },
  { kanji: '電話', kana: 'でんわ', hanviet: 'ĐIỆN THOẠI', meaning: 'điện thoại' },
  { kanji: '自転車', kana: 'じてんしゃ', hanviet: 'TỰ CHUYỂN XA', meaning: 'xe đạp' },
  { kanji: '新聞', kana: 'しんぶん', hanviet: 'TÂN VĂN', meaning: 'báo' },
  { kanji: '誕生日', kana: 'たんじょうび', hanviet: 'ĐẢN SINH NHẬT', meaning: 'sinh nhật' },
  { kanji: '漢字', kana: 'かんじ', hanviet: 'HÁN TỰ', meaning: 'chữ Hán' },
  { kanji: '勉強', kana: 'べんきょう', hanviet: 'MIỄN CƯỠNG', meaning: 'học tập' },
];

