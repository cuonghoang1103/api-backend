/**
 * JPD113 + JPD123 — NGÂN HÀNG LUYỆN NGHE.
 *
 * Vì sao khu này tồn tại: ở kỳ thi trượt, phần mất điểm nặng nhất của bài vấn đáp
 * KHÔNG phải "không nói được" mà là "không nghe hiểu giám thị hỏi gì" — 3 câu tranh
 * và 1 câu cá nhân đều nghe không ra. Nhìn chữ thì hiểu, nghe thì không. Đó là dấu
 * hiệu kinh điển của việc học tiếng Nhật hoàn toàn bằng MẮT.
 *
 * Nghe hiểu không học được bằng cách đọc thêm. Nó chỉ đến bằng số giờ tai tiếp xúc,
 * nên khu này được thiết kế để chạy MỖI NGÀY 10 phút suốt 30 ngày, chứ không phải
 * để cày một buổi.
 *
 * Ba chế độ:
 *  - `mcq`        nghe → chọn nghĩa tiếng Việt (dùng cho câu, mệnh lệnh, từ)
 *  - `dictation`  nghe → gõ lại (kana hoặc chữ số) — chặt hơn hẳn, không đoán được
 *  - `respond`    nghe câu hỏi → tự nói câu trả lời rồi mở đáp án đối chiếu
 *
 * Câu hỏi thi nói KHÔNG chép lại ở đây — panel đọc thẳng từ `speaking.ts` và
 * `personalQA.ts` để hai nơi không bao giờ lệch nhau.
 */

export type ListenMode = 'mcq' | 'dictation' | 'respond';

export interface ListenItem {
  id: string;
  /** Chuỗi đưa cho bộ đọc — luôn là kana/kanji, không phải romaji */
  jp: string;
  /** Nghĩa tiếng Việt (mcq) hoặc đáp án cần gõ (dictation) */
  vi: string;
  /** Cách viết kana, hiện ra khi lật đáp án nếu `jp` có kanji hoặc chữ số */
  kana?: string;
  /** Chấp nhận thêm các cách gõ này ở chế độ dictation */
  accept?: string[];
  /** Lựa chọn tự soạn (mcq). Không có thì panel tự lấy từ các mục khác cùng bộ. */
  options?: string[];
  note?: string;
}

export interface ListenSet {
  id: string;
  title: string;
  desc: string;
  mode: ListenMode;
  /** Gợi ý ngày trong lộ trình dùng bộ này */
  day: string;
  /** Bộ này thuộc môn nào */
  course: 'JPD113' | 'JPD123';
  items: ListenItem[];
}

/* ══════════════════════════════════════════════════════════════
   1 · CẶP TỐI THIỂU — っ, trường âm, ん
   Nghe không phân biệt được thì miệng cũng không đọc phân biệt được.
   ══════════════════════════════════════════════════════════════ */

const MINIMAL_PAIRS: ListenItem[] = [
  { id: 'mp-01', jp: 'きて', vi: 'きて — hãy đến', options: ['きて — hãy đến', 'きって — con tem'], note: 'きって có っ: một nhịp im giữa き và て.' },
  { id: 'mp-02', jp: 'きって', vi: 'きって — con tem', options: ['きて — hãy đến', 'きって — con tem'] },
  { id: 'mp-03', jp: 'おばさん', vi: 'おばさん — cô, dì', options: ['おばさん — cô, dì', 'おばあさん — bà'], note: 'Trường âm あ kéo dài gấp đôi. Gọi nhầm là chuyện lớn ngoài đời.' },
  { id: 'mp-04', jp: 'おばあさん', vi: 'おばあさん — bà', options: ['おばさん — cô, dì', 'おばあさん — bà'] },
  { id: 'mp-05', jp: 'おじさん', vi: 'おじさん — chú, bác', options: ['おじさん — chú, bác', 'おじいさん — ông'] },
  { id: 'mp-06', jp: 'おじいさん', vi: 'おじいさん — ông', options: ['おじさん — chú, bác', 'おじいさん — ông'] },
  { id: 'mp-07', jp: 'ビル', vi: 'ビル — toà nhà', options: ['ビル — toà nhà', 'ビール — bia'], note: 'Bài đọc 7 có ビール. Gọi nhầm ở nhà hàng thì thành gọi toà nhà.' },
  { id: 'mp-08', jp: 'ビール', vi: 'ビール — bia', options: ['ビル — toà nhà', 'ビール — bia'] },
  { id: 'mp-09', jp: 'いえ', vi: 'いえ — nhà', options: ['いえ — nhà', 'いいえ — không'] },
  { id: 'mp-10', jp: 'いいえ', vi: 'いいえ — không', options: ['いえ — nhà', 'いいえ — không'] },
  { id: 'mp-11', jp: 'ここ', vi: 'ここ — chỗ này', options: ['ここ — chỗ này', 'こうこう — trường cấp 3'] },
  { id: 'mp-12', jp: 'こうこう', vi: 'こうこう — trường cấp 3', options: ['ここ — chỗ này', 'こうこう — trường cấp 3'] },
  { id: 'mp-13', jp: 'おと', vi: 'おと — âm thanh', options: ['おと — âm thanh', 'おっと — chồng'] },
  { id: 'mp-14', jp: 'おっと', vi: 'おっと — chồng', options: ['おと — âm thanh', 'おっと — chồng'] },
  { id: 'mp-15', jp: 'びょういん', vi: 'びょういん — bệnh viện', options: ['びょういん — bệnh viện', 'びよういん — tiệm làm tóc'], note: 'びょ là âm ghép MỘT nhịp; びよ là hai nhịp. Cặp này hay bị nhầm nhất.' },
  { id: 'mp-16', jp: 'びよういん', vi: 'びよういん — tiệm làm tóc', options: ['びょういん — bệnh viện', 'びよういん — tiệm làm tóc'] },
  { id: 'mp-17', jp: 'じゅう', vi: 'じゅう — số mười', options: ['じゅう — số mười', 'じゆう — tự do'] },
  { id: 'mp-18', jp: 'じゆう', vi: 'じゆう — tự do', options: ['じゅう — số mười', 'じゆう — tự do'] },
  { id: 'mp-19', jp: 'かれ', vi: 'かれ — anh ấy', options: ['かれ — anh ấy', 'カレー — cà ri'], note: 'Bài đọc 7 có カレー.' },
  { id: 'mp-20', jp: 'カレー', vi: 'カレー — cà ri', options: ['かれ — anh ấy', 'カレー — cà ri'] },
  { id: 'mp-21', jp: 'ちず', vi: 'ちず — bản đồ', options: ['ちず — bản đồ', 'チーズ — phô mai'] },
  { id: 'mp-22', jp: 'チーズ', vi: 'チーズ — phô mai', options: ['ちず — bản đồ', 'チーズ — phô mai'] },
  { id: 'mp-23', jp: 'かど', vi: 'かど — góc đường', options: ['かど — góc đường', 'カード — thẻ'] },
  { id: 'mp-24', jp: 'カード', vi: 'カード — thẻ', options: ['かど — góc đường', 'カード — thẻ'] },
  { id: 'mp-25', jp: 'もと', vi: 'もと — gốc, nguồn', options: ['もと — gốc, nguồn', 'もっと — hơn nữa'] },
  { id: 'mp-26', jp: 'もっと', vi: 'もっと — hơn nữa', options: ['もと — gốc, nguồn', 'もっと — hơn nữa'] },
  { id: 'mp-27', jp: 'ゆき', vi: 'ゆき — tuyết', options: ['ゆき — tuyết', 'ゆうき — dũng khí'] },
  { id: 'mp-28', jp: 'ゆうき', vi: 'ゆうき — dũng khí', options: ['ゆき — tuyết', 'ゆうき — dũng khí'] },
  { id: 'mp-29', jp: 'せき', vi: 'せき — chỗ ngồi', options: ['せき — chỗ ngồi', 'せいき — thế kỷ'], note: 'Bài đọc 7 có きんえんせき (chỗ cấm hút thuốc).' },
  { id: 'mp-30', jp: 'せいき', vi: 'せいき — thế kỷ', options: ['せき — chỗ ngồi', 'せいき — thế kỷ'] },
];

/* ══════════════════════════════════════════════════════════════
   2 · CHÍNH TẢ KANA — nghe rồi gõ lại
   ══════════════════════════════════════════════════════════════ */

const KANA_DICTATION: ListenItem[] = [
  { id: 'kd-01', jp: 'ねこ', vi: 'ねこ', accept: ['neko', 'mèo'], note: 'mèo' },
  { id: 'kd-02', jp: 'いぬ', vi: 'いぬ', accept: ['inu', 'chó'], note: 'chó' },
  { id: 'kd-03', jp: 'やま', vi: 'やま', accept: ['yama', 'núi'], note: 'núi' },
  { id: 'kd-04', jp: 'そら', vi: 'そら', accept: ['sora'], note: 'bầu trời' },
  { id: 'kd-05', jp: 'みず', vi: 'みず', accept: ['mizu'], note: 'nước' },
  { id: 'kd-06', jp: 'たまご', vi: 'たまご', accept: ['tamago'], note: 'trứng — có trong bài đọc 6' },
  { id: 'kd-07', jp: 'さかな', vi: 'さかな', accept: ['sakana'], note: 'cá' },
  { id: 'kd-08', jp: 'やさい', vi: 'やさい', accept: ['yasai'], note: 'rau — có trong bài đọc 7' },
  { id: 'kd-09', jp: 'かばん', vi: 'かばん', accept: ['kaban'], note: 'cặp sách — ん là một nhịp riêng' },
  { id: 'kd-10', jp: 'でんわ', vi: 'でんわ', accept: ['denwa'], note: 'điện thoại' },
  { id: 'kd-11', jp: 'ともだち', vi: 'ともだち', accept: ['tomodachi'], note: 'bạn bè' },
  { id: 'kd-12', jp: 'かぞく', vi: 'かぞく', accept: ['kazoku'], note: 'gia đình' },
  { id: 'kd-13', jp: 'ぎんこう', vi: 'ぎんこう', accept: ['ginkou', 'ginko'], note: 'ngân hàng — 銀行, trường âm こう = "kôô"' },
  { id: 'kd-14', jp: 'がっこう', vi: 'がっこう', accept: ['gakkou', 'gakko'], note: 'trường học — có っ VÀ trường âm' },
  { id: 'kd-15', jp: 'きって', vi: 'きって', accept: ['kitte'], note: 'con tem — っ' },
  { id: 'kd-16', jp: 'ざっし', vi: 'ざっし', accept: ['zasshi'], note: 'tạp chí — っ' },
  { id: 'kd-17', jp: 'いっしょ', vi: 'いっしょ', accept: ['issho'], note: 'cùng nhau — っ + âm ghép' },
  { id: 'kd-18', jp: 'しんぶん', vi: 'しんぶん', accept: ['shinbun', 'shimbun'], note: 'báo — có trong bài đọc 5' },
  { id: 'kd-19', jp: 'せんせい', vi: 'せんせい', accept: ['sensei', 'sensee'], note: 'giáo viên — えい đọc là "êê"' },
  { id: 'kd-20', jp: 'がくせい', vi: 'がくせい', accept: ['gakusei', 'gakusee'], note: 'học sinh' },
  { id: 'kd-21', jp: 'かいしゃいん', vi: 'かいしゃいん', accept: ['kaishain'], note: 'nhân viên công ty' },
  { id: 'kd-22', jp: 'びょういん', vi: 'びょういん', accept: ['byouin', 'byoin'], note: 'bệnh viện' },
  { id: 'kd-23', jp: 'じてんしゃ', vi: 'じてんしゃ', accept: ['jitensha'], note: 'xe đạp' },
  { id: 'kd-24', jp: 'でんしゃ', vi: 'でんしゃ', accept: ['densha'], note: 'tàu điện' },
  { id: 'kd-25', jp: 'ひこうき', vi: 'ひこうき', accept: ['hikouki', 'hikoki'], note: 'máy bay' },
  { id: 'kd-26', jp: 'としょかん', vi: 'としょかん', accept: ['toshokan'], note: 'thư viện — có trong bài đọc 12' },
  { id: 'kd-27', jp: 'きょうしつ', vi: 'きょうしつ', accept: ['kyoushitsu', 'kyoshitsu'], note: 'lớp học' },
  { id: 'kd-28', jp: 'じしょ', vi: 'じしょ', accept: ['jisho'], note: 'từ điển' },
  { id: 'kd-29', jp: 'しゅくだい', vi: 'しゅくだい', accept: ['shukudai'], note: 'bài tập về nhà' },
  { id: 'kd-30', jp: 'おちゃ', vi: 'おちゃ', accept: ['ocha', 'cha'], note: 'trà' },
  { id: 'kd-31', jp: 'ぎゅうにゅう', vi: 'ぎゅうにゅう', accept: ['gyuunyuu', 'gyunyu'], note: 'sữa — hai âm ghép và hai trường âm liền nhau' },
  { id: 'kd-32', jp: 'くだもの', vi: 'くだもの', accept: ['kudamono'], note: 'hoa quả' },
  { id: 'kd-33', jp: 'にほんご', vi: 'にほんご', accept: ['nihongo'], note: 'tiếng Nhật' },
  { id: 'kd-34', jp: 'まいにち', vi: 'まいにち', accept: ['mainichi'], note: 'mỗi ngày' },
  { id: 'kd-35', jp: 'ゆうびんきょく', vi: 'ゆうびんきょく', accept: ['yuubinkyoku', 'yubinkyoku'], note: 'bưu điện — từ dài nhất bộ này' },
  { id: 'kd-36', jp: 'とうきょう', vi: 'とうきょう', accept: ['toukyou', 'tokyo', 'toukyo'], note: 'Tokyo — 5 nhịp: と-お-きょ-お… thực ra là とー-きょー' },
];

/* ══════════════════════════════════════════════════════════════
   3 · SỐ — nghe rồi viết ra chữ số
   ══════════════════════════════════════════════════════════════ */

const NUMBER_DICTATION: ListenItem[] = [
  { id: 'nm-01', jp: 'ろく', vi: '6' },
  { id: 'nm-02', jp: 'じゅうはち', vi: '18' },
  { id: 'nm-03', jp: 'にじゅうご', vi: '25' },
  { id: 'nm-04', jp: 'さんじゅうきゅう', vi: '39' },
  { id: 'nm-05', jp: 'よんじゅうよん', vi: '44' },
  { id: 'nm-06', jp: 'ごじゅうしち', vi: '57', note: 'しち = 7, cách đọc thứ hai của số bảy' },
  { id: 'nm-07', jp: 'ななじゅうに', vi: '72' },
  { id: 'nm-08', jp: 'はちじゅうろく', vi: '86' },
  { id: 'nm-09', jp: 'きゅうじゅういち', vi: '91' },
  { id: 'nm-10', jp: 'ひゃく', vi: '100' },
  { id: 'nm-11', jp: 'さんびゃく', vi: '300', note: 'BIẾN ÂM: さん + ひゃく → さんびゃく' },
  { id: 'nm-12', jp: 'ろっぴゃく', vi: '600', note: 'BIẾN ÂM + っ' },
  { id: 'nm-13', jp: 'はっぴゃく', vi: '800', note: 'BIẾN ÂM + っ' },
  { id: 'nm-14', jp: 'せん', vi: '1000' },
  { id: 'nm-15', jp: 'さんぜん', vi: '3000', note: 'BIẾN ÂM: さん + せん → さんぜん' },
  { id: 'nm-16', jp: 'はっせん', vi: '8000', note: 'có っ' },
  { id: 'nm-17', jp: 'いちまん', vi: '10000', accept: ['1 vạn', '10.000'], note: 'Tiếng Nhật đếm theo VẠN, không theo nghìn' },
  { id: 'nm-18', jp: 'ごまん', vi: '50000', accept: ['5 vạn', '50.000'] },
  { id: 'nm-19', jp: 'じゅうななさい', vi: '17', accept: ['17 tuổi'], note: '17 tuổi' },
  { id: 'nm-20', jp: 'はたち', vi: '20', accept: ['20 tuổi'], note: '20 tuổi — BẤT QUY TẮC, không phải にじゅっさい' },
  { id: 'nm-21', jp: 'ろくじゅうはっさい', vi: '68', accept: ['68 tuổi'], note: '68 tuổi — có っ' },
  { id: 'nm-22', jp: 'いっさい', vi: '1', accept: ['1 tuổi'], note: '1 tuổi — có っ' },
  { id: 'nm-23', jp: 'ひとつ', vi: '1', accept: ['1 cái', 'một'], note: 'một cái — bộ đếm bất quy tắc' },
  { id: 'nm-24', jp: 'みっつ', vi: '3', accept: ['3 cái', 'ba'], note: 'ba cái' },
  { id: 'nm-25', jp: 'やっつ', vi: '8', accept: ['8 cái', 'tám'], note: 'tám cái' },
  { id: 'nm-26', jp: 'とお', vi: '10', accept: ['10 cái', 'mười'], note: 'mười cái — と-お hai nhịp, ngoại lệ おお' },
  { id: 'nm-27', jp: 'ひとり', vi: '1', accept: ['1 người', 'một người'], note: 'một người — bất quy tắc' },
  { id: 'nm-28', jp: 'ふたり', vi: '2', accept: ['2 người', 'hai người'], note: 'hai người — bất quy tắc' },
  { id: 'nm-29', jp: 'さんにん', vi: '3', accept: ['3 người', 'ba người'], note: 'ba người — có trong bài đọc 7' },
  { id: 'nm-30', jp: 'ごひゃくえん', vi: '500', accept: ['500 yên', '500 en'], note: '500 yên' },
  { id: 'nm-31', jp: 'ごじゅうごまん', vi: '550000', accept: ['550.000', '55 vạn'], note: '550.000 — giá điện thoại trong bộ tranh 2' },
];

/* ══════════════════════════════════════════════════════════════
   4 · GIỜ — nghe rồi viết ra kiểu 6:30
   ══════════════════════════════════════════════════════════════ */

const TIME_DICTATION: ListenItem[] = [
  { id: 'tm-01', jp: 'いちじ', vi: '1:00' },
  { id: 'tm-02', jp: 'よじ', vi: '4:00', note: '4時 = よじ. KHÔNG BAO GIỜ よんじ hay しじ — lỗi số một ở bài đọc 12.' },
  { id: 'tm-03', jp: 'しちじ', vi: '7:00', note: '7時 = しちじ' },
  { id: 'tm-04', jp: 'くじ', vi: '9:00', note: '9時 = くじ, không phải きゅうじ' },
  { id: 'tm-05', jp: 'じゅうにじ', vi: '12:00' },
  { id: 'tm-06', jp: 'ごじはん', vi: '5:30', note: 'はん = rưỡi' },
  { id: 'tm-07', jp: 'はちじはん', vi: '8:30' },
  { id: 'tm-08', jp: 'じゅうにじはん', vi: '12:30', note: 'Có trong bài đọc 12' },
  { id: 'tm-09', jp: 'さんじじゅうごふん', vi: '3:15', note: 'ごふん — đọc ふん' },
  { id: 'tm-10', jp: 'ろくじじゅっぷん', vi: '6:10', note: 'じゅっぷん — đọc ぷん và có っ' },
  { id: 'tm-11', jp: 'しちじにじゅうごふん', vi: '7:25' },
  { id: 'tm-12', jp: 'くじよんじゅうごふん', vi: '9:45' },
  { id: 'tm-13', jp: 'よじさんじゅっぷん', vi: '4:30' },
  { id: 'tm-14', jp: 'にじごふん', vi: '2:05' },
  { id: 'tm-15', jp: 'じゅういちじよんじゅうごふん', vi: '11:45' },
  { id: 'tm-16', jp: 'はちじよんじゅっぷん', vi: '8:40' },
  { id: 'tm-17', jp: 'いちじいっぷん', vi: '1:01', note: 'いっぷん — 1 phút, có っ và đọc ぷん' },
  { id: 'tm-18', jp: 'ごじさんぷん', vi: '5:03', note: 'さんぷん — 3 phút đọc ぷん' },
  { id: 'tm-19', jp: 'ごぜんくじ', vi: '9:00', accept: ['9:00 sáng', '9h sáng'], note: 'ごぜん = sáng' },
  { id: 'tm-20', jp: 'ごごごじはん', vi: '5:30', accept: ['5:30 chiều', '17:30'], note: 'ごご = chiều. Câu này có ba chữ ご liền — nghe rất dễ rối.' },
];

/* ══════════════════════════════════════════════════════════════
   5 · NGÀY, THÁNG, THỨ — nghe rồi chọn nghĩa
   ══════════════════════════════════════════════════════════════ */

const DATE_MCQ: ListenItem[] = [
  { id: 'dt-01', jp: 'ついたち', vi: 'mùng 1', note: 'Bất quy tắc' },
  { id: 'dt-02', jp: 'ふつか', vi: 'mùng 2' },
  { id: 'dt-03', jp: 'みっか', vi: 'mùng 3' },
  { id: 'dt-04', jp: 'よっか', vi: 'mùng 4' },
  { id: 'dt-05', jp: 'いつか', vi: 'mùng 5' },
  { id: 'dt-06', jp: 'むいか', vi: 'mùng 6' },
  { id: 'dt-07', jp: 'なのか', vi: 'mùng 7' },
  { id: 'dt-08', jp: 'ようか', vi: 'mùng 8' },
  { id: 'dt-09', jp: 'ここのか', vi: 'mùng 9' },
  { id: 'dt-10', jp: 'とおか', vi: 'mùng 10', note: 'NGOẠI LỆ おお — と-お-か, không phải とうか' },
  { id: 'dt-11', jp: 'じゅうよっか', vi: 'ngày 14', note: 'Vẫn giữ よっか' },
  { id: 'dt-12', jp: 'はつか', vi: 'ngày 20', note: 'Bất quy tắc — không phải にじゅうにち' },
  { id: 'dt-13', jp: 'にじゅうよっか', vi: 'ngày 24' },
  { id: 'dt-14', jp: 'しがつ', vi: 'tháng 4', note: 'し chứ không phải よん' },
  { id: 'dt-15', jp: 'しちがつ', vi: 'tháng 7', note: 'しち chứ không phải なな' },
  { id: 'dt-16', jp: 'くがつ', vi: 'tháng 9', note: 'く chứ không phải きゅう' },
  { id: 'dt-17', jp: 'げつようび', vi: 'thứ Hai', note: '月 NGUYỆT' },
  { id: 'dt-18', jp: 'かようび', vi: 'thứ Ba', note: '火 HOẢ' },
  { id: 'dt-19', jp: 'すいようび', vi: 'thứ Tư', note: '水 THUỶ' },
  { id: 'dt-20', jp: 'もくようび', vi: 'thứ Năm', note: '木 MỘC' },
  { id: 'dt-21', jp: 'きんようび', vi: 'thứ Sáu', note: '金 KIM' },
  { id: 'dt-22', jp: 'どようび', vi: 'thứ Bảy', note: '土 THỔ' },
  { id: 'dt-23', jp: 'にちようび', vi: 'Chủ Nhật', note: '日 NHẬT' },
  { id: 'dt-24', jp: 'きょう', vi: 'hôm nay' },
  { id: 'dt-25', jp: 'あした', vi: 'ngày mai' },
  { id: 'dt-26', jp: 'きのう', vi: 'hôm qua' },
  { id: 'dt-27', jp: 'まいにち', vi: 'mỗi ngày' },
  { id: 'dt-28', jp: 'まいばん', vi: 'mỗi tối', note: 'Có trong bài đọc 8' },
  { id: 'dt-29', jp: 'しゅうまつ', vi: 'cuối tuần', note: 'Có trong bài đọc 12' },
  { id: 'dt-30', jp: 'ことし', vi: 'năm nay', note: 'Có trong bài đọc 1' },
];

/* ══════════════════════════════════════════════════════════════
   6 · MỆNH LỆNH LỚP HỌC — cô giáo nói cả buổi bằng những câu này
   ══════════════════════════════════════════════════════════════ */

const CLASSROOM_MCQ: ListenItem[] = [
  { id: 'cl-01', jp: 'きいて ください。', vi: 'Hãy nghe.' },
  { id: 'cl-02', jp: 'よんで ください。', vi: 'Hãy đọc.' },
  { id: 'cl-03', jp: 'かいて ください。', vi: 'Hãy viết.' },
  { id: 'cl-04', jp: 'みて ください。', vi: 'Hãy nhìn.' },
  { id: 'cl-05', jp: 'いって ください。', vi: 'Hãy nói / nhắc lại.' },
  { id: 'cl-06', jp: 'もう いちど おねがいします。', vi: 'Xin nhắc lại một lần nữa.', note: 'CÂU CỨU HỘ — hỏi lại không bị trừ điểm.' },
  { id: 'cl-07', jp: 'ゆっくり おねがいします。', vi: 'Xin nói chậm lại.', note: 'CÂU CỨU HỘ' },
  { id: 'cl-08', jp: 'わかりますか。', vi: 'Bạn có hiểu không?' },
  { id: 'cl-09', jp: 'わかりません。', vi: 'Tôi không hiểu.' },
  { id: 'cl-10', jp: 'しつもんが ありますか。', vi: 'Có câu hỏi gì không?' },
  { id: 'cl-11', jp: 'きょうかしょを あけて ください。', vi: 'Hãy mở sách giáo khoa.' },
  { id: 'cl-12', jp: 'すわって ください。', vi: 'Hãy ngồi xuống.' },
  { id: 'cl-13', jp: 'たって ください。', vi: 'Hãy đứng lên.' },
  { id: 'cl-14', jp: 'ちょっと まって ください。', vi: 'Đợi một chút.', note: 'CÂU CỨU HỘ' },
  { id: 'cl-15', jp: 'はじめましょう。', vi: 'Bắt đầu nào.' },
  { id: 'cl-16', jp: 'おわりましょう。', vi: 'Kết thúc nhé.' },
  { id: 'cl-17', jp: 'じゃ、つぎの ひと。', vi: 'Vậy, người tiếp theo.' },
  { id: 'cl-18', jp: 'もう いちど いって ください。', vi: 'Hãy nói lại một lần nữa.' },
  { id: 'cl-19', jp: 'しつれいします。', vi: 'Xin phép (khi vào phòng).', note: 'Câu tác phong 1' },
  { id: 'cl-20', jp: 'よろしく おねがいします。', vi: 'Mong được giúp đỡ.', note: 'Câu tác phong 2' },
  { id: 'cl-21', jp: 'ありがとう ございました。', vi: 'Xin cảm ơn.', note: 'Câu tác phong 3' },
  { id: 'cl-22', jp: 'しつれいしました。', vi: 'Xin phép (khi ra khỏi phòng).', note: 'Câu tác phong 4' },
];

/* ══════════════════════════════════════════════════════════════
   7 · TỪ KATAKANA — nghĩa đã biết sẵn, chỉ cần quen ÂM
   ══════════════════════════════════════════════════════════════ */

const KATAKANA_MCQ: ListenItem[] = [
  { id: 'kt-01', jp: 'テレビ', vi: 'ti vi' },
  { id: 'kt-02', jp: 'パソコン', vi: 'máy tính cá nhân' },
  { id: 'kt-03', jp: 'コーヒー', vi: 'cà phê' },
  { id: 'kt-04', jp: 'テニス', vi: 'quần vợt' },
  { id: 'kt-05', jp: 'サッカー', vi: 'bóng đá' },
  { id: 'kt-06', jp: 'アルバイト', vi: 'việc làm thêm', note: 'Từ tiếng Đức, không phải tiếng Anh — có trong bài đọc 12 và 13' },
  { id: 'kt-07', jp: 'コンビニ', vi: 'cửa hàng tiện lợi' },
  { id: 'kt-08', jp: 'インターネット', vi: 'internet' },
  { id: 'kt-09', jp: 'ビール', vi: 'bia' },
  { id: 'kt-10', jp: 'カレー', vi: 'cà ri' },
  { id: 'kt-11', jp: 'ハンバーグ', vi: 'thịt viên sốt (hamburg steak)', note: 'Có trong bài đọc 7' },
  { id: 'kt-12', jp: 'ライス', vi: 'cơm (kiểu nhà hàng)' },
  { id: 'kt-13', jp: 'カラオケ', vi: 'karaoke', note: 'Có trong bài đọc 13' },
  { id: 'kt-14', jp: 'ノート', vi: 'vở' },
  { id: 'kt-15', jp: 'ボールペン', vi: 'bút bi' },
  { id: 'kt-16', jp: 'スポーツ', vi: 'thể thao' },
  { id: 'kt-17', jp: 'レストラン', vi: 'nhà hàng' },
  { id: 'kt-18', jp: 'デパート', vi: 'trung tâm thương mại' },
  { id: 'kt-19', jp: 'バス', vi: 'xe buýt' },
  { id: 'kt-20', jp: 'タクシー', vi: 'taxi' },
  { id: 'kt-21', jp: 'ベトナム', vi: 'Việt Nam' },
  { id: 'kt-22', jp: 'ハノイ', vi: 'Hà Nội' },
  { id: 'kt-23', jp: 'オーストラリア', vi: 'Úc', note: 'Katakana dài nhất trong bài đọc 1 — rất dễ vấp' },
  { id: 'kt-24', jp: 'イタリア', vi: 'Ý', note: 'Bộ tranh 1' },
];

/* ══════════════════════════════════════════════════════════════
   8 · CÂU NGẮN HẰNG NGÀY (JPD113) — nghe cả câu, không phải từ rời
   ══════════════════════════════════════════════════════════════ */

const SENTENCE_MCQ: ListenItem[] = [
  { id: 'sn-01', jp: 'わたしは がくせいです。', vi: 'Tôi là học sinh.' },
  { id: 'sn-02', jp: 'わたしは がくせいじゃ ありません。', vi: 'Tôi không phải học sinh.', note: 'DANH TỪ phủ định bằng じゃありません' },
  { id: 'sn-03', jp: 'まいにち にほんごを べんきょうします。', vi: 'Mỗi ngày tôi học tiếng Nhật.' },
  { id: 'sn-04', jp: 'あした がっこうへ いきません。', vi: 'Ngày mai tôi không đi học.', note: 'ĐỘNG TỪ phủ định bằng ません' },
  { id: 'sn-05', jp: 'しちじに おきます。', vi: 'Tôi dậy lúc 7 giờ.', note: 'に đánh dấu mốc giờ' },
  { id: 'sn-06', jp: 'うちで ほんを よみます。', vi: 'Tôi đọc sách ở nhà.', note: 'で = nơi diễn ra hành động' },
  { id: 'sn-07', jp: 'かいしゃへ いきます。', vi: 'Tôi đi đến công ty.', note: 'へ = hướng đi' },
  { id: 'sn-08', jp: 'かいしゃで はたらきます。', vi: 'Tôi làm việc ở công ty.', note: 'Cặp đối chiếu với câu trên — bài đọc 10' },
  { id: 'sn-09', jp: 'これは わたしの ほんです。', vi: 'Đây là sách của tôi.' },
  { id: 'sn-10', jp: 'それは だれの かばんですか。', vi: 'Cái cặp đó là của ai?' },
  { id: 'sn-11', jp: 'あれは なんですか。', vi: 'Kia là cái gì?', note: 'Bài đọc 6' },
  { id: 'sn-12', jp: 'この ほんは いくらですか。', vi: 'Quyển sách này giá bao nhiêu?' },
  { id: 'sn-13', jp: 'にちようび、どこも いきません。', vi: 'Chủ Nhật tôi không đi đâu cả.', note: 'どこも đi với いきません' },
  { id: 'sn-14', jp: 'にちようび、なにも しません。', vi: 'Chủ Nhật tôi không làm gì cả.', note: 'なにも đi với しません' },
  { id: 'sn-15', jp: 'げつようびから きんようびまで はたらきます。', vi: 'Tôi làm việc từ thứ Hai đến thứ Sáu.', note: 'から…まで — bài đọc 5' },
  { id: 'sn-16', jp: 'わたしの しゅみは おんがくです。', vi: 'Sở thích của tôi là âm nhạc.' },
  { id: 'sn-17', jp: 'ともだちと えいがを みます。', vi: 'Tôi xem phim với bạn.', note: 'と = cùng với' },
  { id: 'sn-18', jp: 'バスで がっこうへ いきます。', vi: 'Tôi đi học bằng xe buýt.', note: 'で = phương tiện' },
  { id: 'sn-19', jp: 'いま なんじですか。', vi: 'Bây giờ là mấy giờ?' },
  { id: 'sn-20', jp: 'おなまえは なんですか。', vi: 'Tên bạn là gì?' },
  { id: 'sn-21', jp: 'おくには どちらですか。', vi: 'Bạn đến từ nước nào?' },
  { id: 'sn-22', jp: 'なんさいですか。', vi: 'Bạn bao nhiêu tuổi?' },
  { id: 'sn-23', jp: 'よる じゅうにじに ねます。', vi: 'Buổi tối tôi ngủ lúc 12 giờ.', note: 'Bài đọc 8' },
  { id: 'sn-24', jp: 'こちらは キムさんです。', vi: 'Đây là anh/chị Kim.', note: 'Bài đọc 2 — こちら giới thiệu người, lịch sự' },
];

/* ══════════════════════════════════════════════════════════════
   9 · CÂU JPD123 — động từ, tính từ, mời rủ, mong muốn
   ══════════════════════════════════════════════════════════════ */

const JPD123_MCQ: ListenItem[] = [
  { id: 'j2-01', jp: 'いっしょに ごはんを たべませんか。', vi: 'Cùng đi ăn cơm không?', note: '～ませんか = lời mời' },
  { id: 'j2-02', jp: 'ええ、いいですね。たべましょう。', vi: 'Ừ, hay đấy. Cùng ăn nào.', note: '～ましょう = đã thống nhất' },
  { id: 'j2-03', jp: 'すみません、ちょっと…', vi: 'Xin lỗi, hơi bất tiện… (LỜI TỪ CHỐI)', note: 'Người Nhật không nói thẳng "không". Câu bỏ lửng ちょっと… CHÍNH LÀ từ chối.' },
  { id: 'j2-04', jp: 'あした ひまですか。', vi: 'Ngày mai bạn rảnh không?' },
  { id: 'j2-05', jp: 'コーヒーを のみませんか。', vi: 'Uống cà phê không?' },
  { id: 'j2-06', jp: 'この ケーキは おいしいです。', vi: 'Cái bánh này ngon.', note: 'Tính từ い' },
  { id: 'j2-07', jp: 'あの みせは たかくないです。', vi: 'Cửa hàng kia không đắt.', note: 'Tính từ い phủ định: たかい → たかくない' },
  { id: 'j2-08', jp: 'この へやは しずかです。', vi: 'Căn phòng này yên tĩnh.', note: 'Tính từ な' },
  { id: 'j2-09', jp: 'この へやは しずかじゃ ありません。', vi: 'Căn phòng này không yên tĩnh.', note: 'Tính từ な phủ định' },
  { id: 'j2-10', jp: 'にほんへ いきたいです。', vi: 'Tôi muốn đi Nhật.', note: '～たい = muốn LÀM' },
  { id: 'j2-11', jp: 'あたらしい パソコンが ほしいです。', vi: 'Tôi muốn có máy tính mới.', note: 'ほしい = muốn CÓ, dùng が' },
  { id: 'j2-12', jp: 'わたしは おんがくが すきです。', vi: 'Tôi thích âm nhạc.', note: 'すき dùng が chứ không dùng を' },
  { id: 'j2-13', jp: 'やさいが きらいです。', vi: 'Tôi ghét rau.' },
  { id: 'j2-14', jp: 'あたまが いたいですから、やすみます。', vi: 'Vì đau đầu nên tôi nghỉ.', note: 'から đứng SAU vế lý do — ngược thứ tự tiếng Việt' },
  { id: 'j2-15', jp: 'いま、なにを して いますか。', vi: 'Bây giờ bạn đang làm gì?', note: '～ています = đang diễn ra' },
  { id: 'j2-16', jp: 'にほんごを べんきょうして います。', vi: 'Tôi đang học tiếng Nhật.', note: 'Đã xuất hiện sẵn trong bài đọc 2 và 4 của JPD113' },
  { id: 'j2-17', jp: 'とうきょうは おおさかより おおきいです。', vi: 'Tokyo lớn hơn Osaka.', note: 'より = hơn' },
  { id: 'j2-18', jp: 'なつと ふゆと どちらが すきですか。', vi: 'Bạn thích mùa hè hay mùa đông hơn?' },
  { id: 'j2-19', jp: 'ふゆの ほうが すきです。', vi: 'Tôi thích mùa đông hơn.', note: '～のほうが = vế được chọn' },
  { id: 'j2-20', jp: 'クラスで いちばん せが たかいです。', vi: 'Cao nhất lớp.', note: 'いちばん = nhất' },
  { id: 'j2-21', jp: 'ちょっと まって ください。', vi: 'Đợi một chút.', note: 'Thể て + ください' },
  { id: 'j2-22', jp: 'もう ごはんを たべましたか。', vi: 'Bạn ăn cơm chưa?', note: 'もう = đã…rồi' },
  { id: 'j2-23', jp: 'いいえ、まだです。', vi: 'Chưa.', note: 'まだです = chưa (trả lời gọn)' },
  { id: 'j2-24', jp: 'きのう えいがを みました。', vi: 'Hôm qua tôi đã xem phim.', note: 'ました = quá khứ' },
  { id: 'j2-25', jp: 'きのう どこも いきませんでした。', vi: 'Hôm qua tôi không đi đâu cả.', note: 'ませんでした = quá khứ phủ định' },
  { id: 'j2-26', jp: 'かいものに いきます。', vi: 'Tôi đi mua sắm.', note: '～に いきます = đi để làm gì' },
  { id: 'j2-27', jp: 'あまり たかくないです。', vi: 'Không đắt lắm.', note: 'あまり BẮT BUỘC đi với phủ định' },
  { id: 'j2-28', jp: 'ぜんぜん わかりません。', vi: 'Hoàn toàn không hiểu.', note: 'ぜんぜん cũng bắt buộc đi với phủ định' },
];

/* ══════════════════════════════════════════════════════════════
   GOM BỘ
   ══════════════════════════════════════════════════════════════ */

export const LISTEN_SETS: ListenSet[] = [
  {
    id: 'set-minimal',
    title: 'Cặp tối thiểu — っ, trường âm, âm ghép',
    desc:
      'Hai từ chỉ khác nhau ĐÚNG MỘT nhịp. Đây là bài tập chữa trực tiếp lỗi "sai âm ngắt, sai trường âm" ' +
      'ở bài thi đọc: tai chưa phân biệt được thì miệng cũng không đọc phân biệt được.',
    mode: 'mcq',
    day: 'Ngày 2 · và lặp lại mỗi tuần',
    course: 'JPD113',
    items: MINIMAL_PAIRS,
  },
  {
    id: 'set-kana',
    title: 'Chính tả kana — nghe rồi gõ lại',
    desc:
      'Chế độ chặt nhất: không có lựa chọn để đoán, phải gõ đúng từng chữ. ' +
      'Gõ được romaji cũng tính đúng nếu bạn chưa cài bộ gõ tiếng Nhật.',
    mode: 'dictation',
    day: 'Ngày 1–6',
    course: 'JPD113',
    items: KANA_DICTATION,
  },
  {
    id: 'set-number',
    title: 'Số, tuổi, giá tiền',
    desc:
      'Nghe rồi viết ra chữ số. Số là chỗ mất điểm số một trong 420 câu FE và cũng là câu hỏi ' +
      'giám thị hay dùng nhất với bộ tranh (なんさいですか, いくらですか).',
    mode: 'dictation',
    day: 'Ngày 7 · Ngày 10',
    course: 'JPD113',
    items: NUMBER_DICTATION,
  },
  {
    id: 'set-time',
    title: 'Giờ & phút',
    desc: 'Nghe rồi viết kiểu 6:30. Bao gồm cả ba giờ bất quy tắc よじ・しちじ・くじ và luật ふん/ぷん.',
    mode: 'dictation',
    day: 'Ngày 8',
    course: 'JPD113',
    items: TIME_DICTATION,
  },
  {
    id: 'set-date',
    title: 'Ngày, tháng, thứ',
    desc: 'Mùng 1 đến mùng 10 và ngày 20 hoàn toàn bất quy tắc — nhóm phải học thuộc lòng.',
    mode: 'mcq',
    day: 'Ngày 9',
    course: 'JPD113',
    items: DATE_MCQ,
  },
  {
    id: 'set-classroom',
    title: 'Mệnh lệnh lớp học & câu cứu hộ',
    desc:
      'Vào kỳ, cô giáo nói những câu này cả buổi. Nghe hiểu chúng là theo được lớp. ' +
      'Kèm 4 câu tác phong phòng thi và 3 câu cứu hộ khi không nghe kịp.',
    mode: 'mcq',
    day: 'Ngày 11 · dùng suốt kỳ',
    course: 'JPD113',
    items: CLASSROOM_MCQ,
  },
  {
    id: 'set-katakana',
    title: 'Từ katakana',
    desc:
      'Nghĩa thì bạn đã biết sẵn (đều là từ mượn), chỉ cần quen ÂM tiếng Nhật của chúng. ' +
      'Nhóm dễ lấy điểm nhất trong luyện nghe.',
    mode: 'mcq',
    day: 'Ngày 3',
    course: 'JPD113',
    items: KATAKANA_MCQ,
  },
  {
    id: 'set-sentence',
    title: 'Câu ngắn JPD113',
    desc:
      'Nghe CẢ CÂU chứ không phải từ rời — bước bắt buộc trước khi nghe được câu hỏi của giám thị. ' +
      'Mọi câu ở đây đều lấy khuôn từ bài đọc hoặc đề thật.',
    mode: 'mcq',
    day: 'Ngày 13–18',
    course: 'JPD113',
    items: SENTENCE_MCQ,
  },
  {
    id: 'set-jpd123',
    title: 'Câu JPD123 — động từ, tính từ, mời rủ',
    desc:
      'Câu dài hơn, nhiều thông tin hơn. Chú ý すみません、ちょっと… — nghe được câu bỏ lửng đó ' +
      'là hiểu đúng rằng người ta đang TỪ CHỐI.',
    mode: 'mcq',
    day: 'Ngày 25–30',
    course: 'JPD123',
    items: JPD123_MCQ,
  },
];

/* ══════════════════════════════════════════════════════════════
   CHẤM BÀI GÕ — cố tình khoan dung
   ══════════════════════════════════════════════════════════════ */

/** Katakana → hiragana, để gõ bảng nào cũng được */
function kataToHira(s: string): string {
  return s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

/**
 * Chuẩn hoá đáp án trước khi so:
 *  - bỏ khoảng trắng, dấu câu, dấu chấm phân cách hàng nghìn
 *  - katakana → hiragana
 *  - thường hoá chữ Latin
 *  - bỏ dấu tiếng Việt (để gõ "mua 1 cai" hay "mùa 1 cái" đều được)
 */
export function normalizeAnswer(s: string): string {
  return kataToHira((s || '').trim())
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[\s.,、。・ー〜~_-]/g, '');
}

/** Đúng nếu khớp `vi` hoặc bất kỳ mục nào trong `accept` (đã chuẩn hoá) */
export function checkListenAnswer(item: ListenItem, input: string): boolean {
  const got = normalizeAnswer(input);
  if (!got) return false;
  const pool = [item.vi, ...(item.accept ?? [])];
  return pool.some((a) => normalizeAnswer(a) === got);
}

export const LISTEN_STORAGE_KEY = 'jpd113:listen:v1';

/** Tổng số mục có thật trong ngân hàng — hiện ở thẻ thống kê */
export const LISTEN_ITEM_COUNT = LISTEN_SETS.reduce((s, x) => s + x.items.length, 0);
