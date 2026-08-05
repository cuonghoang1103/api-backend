/**
 * NGÀY 2 — Con số & thời gian.
 *
 * Đây là ổ mất điểm số một của môn: theo phân tích 420 câu FE thật, số đếm
 * bất quy tắc ra đề nhiều hơn bất kỳ nhóm ngữ pháp nào, và nó cũng là chỗ
 * vấp giữa câu khi đọc to. Mọi con số trong file đều lấy từ bảng đã kiểm
 * trong cheat-sheet của trang.
 */

import type { LessonMap } from './types';

export const DAY2_LESSONS: LessonMap = {
  /* ─────────────────────────────────────────────── */
  'd2-num-basic': {
    goal: 'Đọc và nói được mọi số từ 1 đến 99 mà không phải đếm ngón tay.',
    parts: [
      {
        type: 'text',
        h: 'Hai bộ đọc cho cùng một chữ số',
        body:
          'Số 4, 7, 9 mỗi số có HAI cách đọc, và chọn cách nào tuỳ theo đứng một mình hay ghép với đơn vị. ' +
          'Đây chính là nguồn gốc của gần hết lỗi sai về số. Quy tắc thô: đếm rời rạc thì dùng よん・なな・きゅう ' +
          '(dễ nghe, ít nhầm), còn khi ghép với 時 giờ / 月 tháng thì thường quay về âm Hán し・しち・く.',
      },
      {
        type: 'table',
        h: 'Số 1 → 10',
        headers: ['Số', 'Kanji', 'Cách đọc'],
        rows: [
          ['1', '一', 'いち ichi'],
          ['2', '二', 'に ni'],
          ['3', '三', 'さん san'],
          ['4', '四', 'よん / し yon / shi'],
          ['5', '五', 'ご go'],
          ['6', '六', 'ろく roku'],
          ['7', '七', 'なな / しち nana / shichi'],
          ['8', '八', 'はち hachi'],
          ['9', '九', 'きゅう / く kyuu / ku'],
          ['10', '十', 'じゅう juu'],
        ],
        dangerRows: [3, 6, 8],
      },
      {
        type: 'text',
        h: 'Ghép 11 → 99: cộng và nhân, không có ngoại lệ',
        body:
          'Từ 11 đến 99 tiếng Nhật ghép thẳng như phép tính: hàng chục đọc trước, hàng đơn vị đọc sau. ' +
          '11 = 十一 (じゅういち, "mười một"). 20 = 二十 (にじゅう, "hai mười"). 35 = 三十五 (さんじゅうご). ' +
          'Không có từ riêng cho 20, 30 như tiếng Anh (twenty, thirty) — nên phần này thật ra DỄ hơn tiếng Anh.',
      },
      {
        type: 'examples',
        h: 'Ghép thử',
        items: [
          { jp: '十一', read: 'じゅういち', romaji: 'juu-ichi', vi: '11 = 10 + 1' },
          { jp: '十七', read: 'じゅうなな', romaji: 'juu-nana', vi: '17 = 10 + 7' },
          { jp: '二十', read: 'にじゅう', romaji: 'ni-juu', vi: '20 = 2 × 10' },
          { jp: '四十八', read: 'よんじゅうはち', romaji: 'yon-juu-hachi', vi: '48 = 4 × 10 + 8' },
          { jp: '九十九', read: 'きゅうじゅうきゅう', romaji: 'kyuu-juu-kyuu', vi: '99', note: 'Ở đây 9 dùng きゅう cả hai chỗ.' },
        ],
      },
      {
        type: 'tip',
        h: 'Cách luyện 10 phút',
        body:
          'Đọc to số nhà, biển số xe, giá tiền bạn nhìn thấy quanh mình bằng tiếng Nhật. Não nhớ số nhanh ' +
          'nhất khi số đó gắn với thứ có thật, không phải khi đọc bảng.',
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd2-num-big': {
    goal: 'Đọc đúng 6 chỗ biến âm của trăm/nghìn — đây là những chỗ đề thi cố tình nhắm vào.',
    parts: [
      {
        type: 'text',
        h: 'Vì sao có biến âm',
        body:
          'Người Nhật đổi âm cho dễ đọc: ろく + ひゃく đọc liền thành "rok-pyaku" rồi thành ろっぴゃく. ' +
          'Bạn không cần hiểu lý do — chỉ cần thuộc SÁU chỗ đổi. Các số còn lại đọc thẳng theo công thức.',
      },
      {
        type: 'table',
        h: 'Trăm 百 — chỉ 3 chỗ đổi',
        headers: ['Số', 'Cách đọc', 'Đổi ở đâu'],
        rows: [
          ['100', 'ひゃく hyaku', 'không có いち ở đầu'],
          ['200', 'にひゃく nihyaku', 'đều'],
          ['300', 'さんびゃく sanBYAKU', 'ひゃく → びゃく'],
          ['400', 'よんひゃく yonhyaku', 'đều'],
          ['500', 'ごひゃく gohyaku', 'đều'],
          ['600', 'ろっぴゃく roPPYAKU', 'ろく → ろっ + ぴゃく'],
          ['700', 'ななひゃく nanahyaku', 'đều'],
          ['800', 'はっぴゃく haPPYAKU', 'はち → はっ + ぴゃく'],
          ['900', 'きゅうひゃく kyuuhyaku', 'đều'],
        ],
        dangerRows: [2, 5, 7],
      },
      {
        type: 'table',
        h: 'Nghìn 千 và vạn 万 — 3 chỗ đổi nữa',
        headers: ['Số', 'Cách đọc', 'Ghi chú'],
        rows: [
          ['1.000', 'せん sen', 'KHÔNG có いち — いっせん là sai'],
          ['2.000', 'にせん nisen', 'đều'],
          ['3.000', 'さんぜん sanZEN', 'せん → ぜん'],
          ['8.000', 'はっせん haSSEN', 'はち → はっ'],
          ['10.000', 'いちまん ichiman', 'BẮT BUỘC có いち — まん không đứng một mình'],
        ],
        dangerRows: [0, 2, 3, 4],
        note:
          'Để ý nghịch lý dễ nhầm: 1.000 KHÔNG có いち, nhưng 10.000 thì BẮT BUỘC có いち. ' +
          'Đây là cặp bẫy hay ra đề nhất trong nhóm số lớn.',
      },
      {
        type: 'text',
        h: 'Tiếng Nhật nhóm 4 chữ số, không nhóm 3',
        body:
          'Tiếng Việt nhóm theo nghìn (1.000 / 1.000.000). Tiếng Nhật nhóm theo VẠN 万 = 10.000. Nên ' +
          '83.000 không đọc là "tám mươi ba nghìn" mà là 8 vạn 3 nghìn: はちまん さんぜん. Ở mức JPD113 bạn ' +
          'chỉ cần tới hàng vạn là đủ.',
      },
      {
        type: 'quiz',
        h: 'Tự kiểm',
        items: [
          { q: '600', a: 'ろっぴゃく roppyaku', why: 'Một trong ba chỗ đổi của hàng trăm.' },
          { q: '3.000', a: 'さんぜん sanzen', why: 'せん → ぜん sau さん.' },
          { q: '10.000', a: 'いちまん ichiman', why: 'Phải có いち, khác hẳn 1.000 = せん.' },
          { q: '1.500', a: 'せん ごひゃく sen-gohyaku', why: 'Ghép thẳng: 1000 + 500.' },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd2-num-money': {
    goal: 'Hỏi và trả lời giá tiền trôi chảy — mẫu câu chắc chắn có trong phần thi nói.',
    parts: [
      {
        type: 'text',
        h: 'Đơn vị 円 (えん)',
        body:
          '円 đọc là えん (en), người nước ngoài quen gọi là "yên". Ghép thẳng số vào trước: 500円 = ' +
          'ごひゃくえん. Vì hay đi với số lớn nên đây là chỗ luyện biến âm trăm/nghìn tốt nhất.',
      },
      {
        type: 'examples',
        h: 'Mẫu câu hỏi giá',
        items: [
          {
            jp: 'これは いくらですか。',
            read: 'これは いくらですか',
            romaji: 'kore wa ikura desu ka',
            vi: 'Cái này bao nhiêu tiền?',
            note: 'いくら = bao nhiêu tiền. Câu này ra đề rất nhiều.',
          },
          {
            jp: '八百円です。',
            read: 'はっぴゃくえんです',
            romaji: 'happyaku-en desu',
            vi: '800 yên.',
          },
          {
            jp: 'この本は 千五百円です。',
            read: 'このほんは せんごひゃくえんです',
            romaji: 'kono hon wa sen-gohyaku-en desu',
            vi: 'Quyển sách này 1.500 yên.',
          },
          {
            jp: '全部で いくらですか。',
            read: 'ぜんぶで いくらですか',
            romaji: 'zenbu de ikura desu ka',
            vi: 'Tất cả bao nhiêu tiền?',
          },
        ],
      },
      {
        type: 'table',
        h: 'Giá hay xuất hiện trong đề — đọc to cả bảng',
        headers: ['Giá', 'Đọc'],
        rows: [
          ['100円', 'ひゃくえん'],
          ['300円', 'さんびゃくえん'],
          ['600円', 'ろっぴゃくえん'],
          ['800円', 'はっぴゃくえん'],
          ['1.000円', 'せんえん'],
          ['3.000円', 'さんぜんえん'],
          ['8.000円', 'はっせんえん'],
          ['10.000円', 'いちまんえん'],
        ],
        dangerRows: [1, 2, 3, 5, 6, 7],
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd2-time-hour': {
    goal: 'Nói được mọi mốc giờ không vấp — 時 là kanji ra đề nhiều thứ hai toàn bộ đề (66 lần).',
    parts: [
      {
        type: 'text',
        h: 'Công thức và ba ngoại lệ',
        body:
          'Số + 時 (じ) = giờ. Chín trên mười hai giờ đọc thẳng theo công thức. Chỉ có BA giờ phải học vẹt: ' +
          '4 giờ, 7 giờ, 9 giờ. Nhớ ba cái đó là xong cả bảng.',
      },
      {
        type: 'table',
        h: '12 mốc giờ',
        headers: ['Giờ', 'Đọc', 'Giờ', 'Đọc'],
        rows: [
          ['1時', 'いちじ ichi-ji', '7時', 'しちじ SHICHI-ji'],
          ['2時', 'にじ ni-ji', '8時', 'はちじ hachi-ji'],
          ['3時', 'さんじ san-ji', '9時', 'くじ KU-ji'],
          ['4時', 'よじ YO-ji', '10時', 'じゅうじ juu-ji'],
          ['5時', 'ごじ go-ji', '11時', 'じゅういちじ juuichi-ji'],
          ['6時', 'ろくじ roku-ji', '12時', 'じゅうにじ juuni-ji'],
        ],
        dangerRows: [0, 2, 3],
        note:
          'Ba ô đỏ: 4時 là よじ (không phải よんじ, cũng không phải しじ) · 7時 là しちじ (không phải ななじ) · ' +
          '9時 là くじ (không phải きゅうじ). Đọc to ba cái này 10 lần ngay bây giờ.',
      },
      {
        type: 'examples',
        h: 'Câu hỏi giờ — mẫu bắt buộc thuộc',
        items: [
          {
            jp: '今 何時ですか。',
            read: 'いま なんじですか',
            romaji: 'ima nan-ji desu ka',
            vi: 'Bây giờ là mấy giờ?',
            note: '何時 = なんじ = mấy giờ. 何 là kanji ra đề nhiều thứ ba (57 lần).',
          },
          {
            jp: '四時です。',
            read: 'よじです',
            romaji: 'yo-ji desu',
            vi: '4 giờ.',
          },
          {
            jp: '九時から 四時までです。',
            read: 'くじから よじまでです',
            romaji: 'ku-ji kara yo-ji made desu',
            vi: 'Từ 9 giờ đến 4 giờ.',
            note: 'から = từ · まで = đến. Cặp này ra đề liên tục và cũng dùng khi nói về lịch học.',
          },
          {
            jp: '二時半に 起きます。',
            read: 'にじはんに おきます',
            romaji: 'ni-ji han ni okimasu',
            vi: 'Tôi dậy lúc 2 rưỡi.',
            note: '半 (はん) = rưỡi, đặt SAU giờ. Trợ từ に đánh dấu mốc thời gian.',
          },
        ],
      },
      {
        type: 'warn',
        h: 'Trợ từ に đi với thời gian',
        body:
          'Khi nói "làm gì đó LÚC mấy giờ" thì phải có に: 七時に 起きます (7 giờ tôi dậy). Nhưng ' +
          '今日 (hôm nay), 明日 (ngày mai), 毎日 (mỗi ngày) thì KHÔNG có に. Đây là câu điền trợ từ hay ra đề.',
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd2-time-min': {
    goal: 'Đọc đúng ふん hay ぷん cho mọi mốc phút, không phải đoán.',
    parts: [
      {
        type: 'text',
        h: 'Câu thần chú',
        body:
          '"1 – 3 – 4 – 6 – 8 – 10 là ぷん, còn lại là ふん." Đọc câu này 5 lần, nó giải quyết cả bảng. ' +
          'Nguyên nhân: những số này kết thúc bằng âm ngắt hoặc âm ん nên đẩy ふ thành ぷ.',
      },
      {
        type: 'table',
        h: 'Bảng phút',
        headers: ['Phút', 'Đọc', 'Phút', 'Đọc'],
        rows: [
          ['1分', 'いっぷん ip-pun', '6分', 'ろっぷん rop-pun'],
          ['2分', 'にふん ni-fun', '7分', 'ななふん nana-fun'],
          ['3分', 'さんぷん san-pun', '8分', 'はっぷん hap-pun'],
          ['4分', 'よんぷん yon-pun', '9分', 'きゅうふん kyuu-fun'],
          ['5分', 'ごふん go-fun', '10分', 'じゅっぷん jup-pun'],
          ['30分', 'さんじゅっぷん = 半 はん', '何分', 'なんぷん nan-pun'],
        ],
        dangerRows: [0, 2, 4, 5],
        note: '30 phút nói được cả hai kiểu: さんじゅっぷん hoặc gọn hơn là 半 (はん). Trong thi nói cứ dùng 半 cho nhanh.',
      },
      {
        type: 'examples',
        h: 'Ghép giờ + phút',
        items: [
          { jp: '七時十五分', read: 'しちじ じゅうごふん', romaji: 'shichi-ji juugo-fun', vi: '7 giờ 15' },
          { jp: '四時半', read: 'よじはん', romaji: 'yo-ji han', vi: '4 giờ rưỡi' },
          { jp: '九時十分', read: 'くじ じゅっぷん', romaji: 'ku-ji jup-pun', vi: '9 giờ 10' },
          { jp: '十二時四十五分', read: 'じゅうにじ よんじゅうごふん', romaji: 'juuni-ji yonjuugo-fun', vi: '12 giờ 45' },
        ],
      },
      {
        type: 'quiz',
        h: 'Tự kiểm — nói to trước khi bấm',
        items: [
          { q: '8分', a: 'はっぷん hap-pun', why: '8 nằm trong nhóm ぷん.' },
          { q: '5分', a: 'ごふん go-fun', why: '5 không nằm trong nhóm ぷん.' },
          { q: '4時4分', a: 'よじ よんぷん yo-ji yon-pun', why: 'Giờ dùng よ, phút dùng よん — cùng chữ 四 mà đọc khác nhau.' },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd2-time-drill': {
    goal: 'Chuyển từ "nghĩ ra được" sang "bật ra ngay" với 20 mốc giờ hay gặp.',
    parts: [
      {
        type: 'steps',
        h: 'Cách luyện',
        items: [
          'Nhìn đồng hồ điện thoại, đọc to giờ hiện tại bằng tiếng Nhật. Làm mỗi lần bạn cầm điện thoại lên trong hôm nay.',
          'Tự đặt 20 mốc: 1:00, 2:30, 4:00, 4:15, 6:45, 7:00, 8:08, 9:00, 9:30, 10:10, 12:00… đọc liên tục không dừng.',
          'Chỗ nào khựng quá 2 giây thì ghi ra giấy, đọc riêng 10 lần.',
          'Vòng cuối: đọc ngược từ 12 giờ về 1 giờ.',
        ],
      },
      {
        type: 'tip',
        h: 'Mốc nào hay khựng nhất',
        body:
          'Gần như ai cũng khựng ở 4:00 (よじ), 7:00 (しちじ), 9:00 (くじ) và mọi phút thuộc nhóm ぷん. ' +
          'Nếu chỉ còn 5 phút, luyện đúng những mốc này.',
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd2-date-month': {
    goal: 'Nói đúng 12 tháng, đặc biệt ba tháng bất quy tắc.',
    parts: [
      {
        type: 'text',
        h: 'Công thức',
        body:
          'Số + 月 (がつ) = tháng. Ba tháng bất quy tắc là 4月, 7月, 9月 — cùng đúng ba số đã bẫy bạn ở ' +
          'phần giờ. Nhưng cách đọc lại KHÁC với giờ, nên đừng suy từ giờ sang.',
      },
      {
        type: 'table',
        h: '12 tháng',
        headers: ['Tháng', 'Đọc', 'Tháng', 'Đọc'],
        rows: [
          ['1月', 'いちがつ', '7月', 'しちがつ SHICHI-gatsu'],
          ['2月', 'にがつ', '8月', 'はちがつ'],
          ['3月', 'さんがつ', '9月', 'くがつ KU-gatsu'],
          ['4月', 'しがつ SHI-gatsu', '10月', 'じゅうがつ'],
          ['5月', 'ごがつ', '11月', 'じゅういちがつ'],
          ['6月', 'ろくがつ', '12月', 'じゅうにがつ'],
        ],
        dangerRows: [0, 2, 3],
      },
      {
        type: 'warn',
        h: 'So sánh với giờ để khỏi lẫn',
        body:
          '4: giờ là よじ nhưng tháng là しがつ. · 7: giờ là しちじ, tháng cũng しちがつ (giống nhau). · ' +
          '9: giờ là くじ, tháng cũng くがつ (giống nhau). Vậy chỉ mỗi số 4 là khác — nhớ đúng chỗ đó.',
      },
      {
        type: 'examples',
        h: 'Câu mẫu',
        items: [
          {
            jp: '誕生日は 四月です。',
            read: 'たんじょうびは しがつです',
            romaji: 'tanjoubi wa shi-gatsu desu',
            vi: 'Sinh nhật tôi vào tháng 4.',
          },
          {
            jp: '何月ですか。',
            read: 'なんがつですか',
            romaji: 'nan-gatsu desu ka',
            vi: 'Tháng mấy?',
          },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd2-date-day': {
    goal: 'Đọc đúng ngày trong tháng — cả cột 1→10 là bất quy tắc, phải học vẹt.',
    parts: [
      {
        type: 'warn',
        h: 'Đây là bảng khó nhất của môn',
        body:
          'Ngày mùng 1 đến mùng 10, cộng thêm 14, 20, 24 — mười ba cách đọc này KHÔNG suy ra được từ số. ' +
          'Không có mẹo, chỉ có học vẹt. Bù lại, các ngày còn lại đọc thẳng: số + にち (15日 = じゅうごにち).',
      },
      {
        type: 'table',
        h: '13 ngày bất quy tắc — học vẹt',
        headers: ['Ngày', 'Đọc', 'Ngày', 'Đọc'],
        rows: [
          ['1日', 'ついたち tsuitachi', '8日', 'ようか youka'],
          ['2日', 'ふつか futsuka', '9日', 'ここのか kokonoka'],
          ['3日', 'みっか mikka', '10日', 'とおか tooka'],
          ['4日', 'よっか yokka', '14日', 'じゅうよっか juu-yokka'],
          ['5日', 'いつか itsuka', '20日', 'はつか hatsuka'],
          ['6日', 'むいか muika', '24日', 'にじゅうよっか nijuu-yokka'],
          ['7日', 'なのか nanoka', '何日', 'なんにち nan-nichi'],
        ],
        dangerRows: [0, 1, 2, 3, 4, 5],
      },
      {
        type: 'tip',
        h: 'Mẹo giảm tải: chỉ có 3 gốc phải nhớ',
        body:
          'Để ý 4日 = よっか và 14日 = じゅうよっか và 24日 = にじゅうよっか — cùng một gốc よっか, chỉ thêm ' +
          'hàng chục phía trước. Vậy thực chất chỉ phải học 10 cái đầu + はつか (20). Mười một thứ, không phải mười ba.',
      },
      {
        type: 'warn',
        h: 'Hai cặp lẫn nhau nhiều nhất',
        body:
          '4日 よっか và 8日 ようか — chỉ khác một chữ. · 10日 とおか có TRƯỜNG ÂM (とお, đọc kéo dài "tôô-ka"), ' +
          'đọc ngắn thành "toka" là sai. Đây là ca ngoại lệ お + お đã học hôm qua.',
      },
      {
        type: 'examples',
        h: 'Ngày tháng đầy đủ — thứ tự ngược với tiếng Việt',
        items: [
          {
            jp: '八月四日',
            read: 'はちがつ よっか',
            romaji: 'hachi-gatsu yokka',
            vi: 'Ngày 4 tháng 8',
            note: 'Tiếng Nhật nói THÁNG TRƯỚC, NGÀY SAU — ngược với tiếng Việt.',
          },
          {
            jp: '誕生日は 十二月二十日です。',
            read: 'たんじょうびは じゅうにがつ はつかです',
            romaji: 'tanjoubi wa juuni-gatsu hatsuka desu',
            vi: 'Sinh nhật tôi ngày 20 tháng 12.',
          },
          {
            jp: '今日は 何日ですか。',
            read: 'きょうは なんにちですか',
            romaji: 'kyou wa nan-nichi desu ka',
            vi: 'Hôm nay ngày mấy?',
          },
        ],
      },
      {
        type: 'quiz',
        h: 'Tự kiểm',
        items: [
          { q: '1日', a: 'ついたち tsuitachi', why: 'Không hề giống いち. Bất quy tắc hoàn toàn.' },
          { q: '20日', a: 'はつか hatsuka', why: 'Không phải にじゅうにち.' },
          { q: '10日', a: 'とおか tooka', why: 'Có trường âm お + お, đọc kéo dài.' },
          { q: '15日', a: 'じゅうごにち juugo-nichi', why: 'Từ 11 trở đi (trừ 14, 20, 24) đọc thẳng số + にち.' },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd2-date-week': {
    goal: 'Nói được 7 thứ và hiểu logic kanji của chúng để khỏi học vẹt.',
    parts: [
      {
        type: 'text',
        h: 'Bảy thứ = bảy nguyên tố + 曜日',
        body:
          'Mỗi thứ là một kanji nguyên tố + 曜日 (ようび). Người Việt học cái này rất nhanh vì các kanji đó ' +
          'đều là chữ Hán quen: 月 nguyệt, 火 hoả, 水 thuỷ, 木 mộc, 金 kim, 土 thổ, 日 nhật. Thứ tự y hệt ' +
          'thứ tự "nguyệt hoả thuỷ mộc kim thổ nhật" — đọc thuộc như một câu là xong.',
      },
      {
        type: 'table',
        h: '7 thứ',
        headers: ['Thứ (VN)', 'Tiếng Nhật', 'Đọc', 'Kanji nghĩa gì'],
        rows: [
          ['Thứ Hai', '月曜日', 'げつようび getsu-youbi', '月 = mặt trăng (NGUYỆT)'],
          ['Thứ Ba', '火曜日', 'かようび ka-youbi', '火 = lửa (HOẢ)'],
          ['Thứ Tư', '水曜日', 'すいようび sui-youbi', '水 = nước (THUỶ)'],
          ['Thứ Năm', '木曜日', 'もくようび moku-youbi', '木 = cây (MỘC)'],
          ['Thứ Sáu', '金曜日', 'きんようび kin-youbi', '金 = vàng (KIM)'],
          ['Thứ Bảy', '土曜日', 'どようび do-youbi', '土 = đất (THỔ)'],
          ['Chủ Nhật', '日曜日', 'にちようび nichi-youbi', '日 = mặt trời (NHẬT)'],
        ],
      },
      {
        type: 'warn',
        h: 'Bẫy: 月 có hai cách đọc',
        body:
          'Trong 月曜日 nó đọc げつ (getsu), nhưng trong 一月 (tháng 1) nó đọc がつ (gatsu). Cùng một chữ, ' +
          'hai âm khác nhau tuỳ từ. Tương tự 日: trong 日曜日 là にち, trong 一日 (mùng 1) là ついたち.',
      },
      {
        type: 'examples',
        h: 'Câu mẫu',
        items: [
          {
            jp: '今日は 何曜日ですか。',
            read: 'きょうは なんようびですか',
            romaji: 'kyou wa nan-youbi desu ka',
            vi: 'Hôm nay là thứ mấy?',
          },
          {
            jp: '水曜日に 日本語を 勉強します。',
            read: 'すいようびに にほんごを べんきょうします',
            romaji: 'sui-youbi ni nihongo o benkyou shimasu',
            vi: 'Thứ Tư tôi học tiếng Nhật.',
            note: 'Thứ đi với trợ từ に giống mốc giờ.',
          },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd2-date-age': {
    goal: 'Nói đúng tuổi của mình — câu chắc chắn bị hỏi khi thi nói.',
    parts: [
      {
        type: 'text',
        h: 'Số + 才 (さい)',
        body:
          '才 và 歳 là hai cách viết của cùng một chữ "tuổi", đọc đều là さい. Đề thi dùng cả hai. ' +
          'Ghép thẳng số vào trước, trừ vài chỗ có âm ngắt và MỘT ngoại lệ lớn.',
      },
      {
        type: 'table',
        h: 'Tuổi hay dùng',
        headers: ['Tuổi', 'Đọc', 'Ghi chú'],
        rows: [
          ['1才', 'いっさい is-sai', 'có âm ngắt'],
          ['8才', 'はっさい has-sai', 'có âm ngắt'],
          ['10才', 'じゅっさい jus-sai', 'có âm ngắt'],
          ['18才', 'じゅうはっさい juu-has-sai', '10 + 8, âm ngắt ở 8'],
          ['19才', 'じゅうきゅうさい juu-kyuu-sai', 'đều'],
          ['20才 / 二十歳', 'はたち HATACHI', 'BẤT QUY TẮC HOÀN TOÀN'],
          ['21才', 'にじゅういっさい nijuu-is-sai', 'quay lại quy tắc thường'],
          ['何才', 'なんさい nan-sai', 'mấy tuổi'],
        ],
        dangerRows: [0, 1, 2, 3, 5],
        note:
          '20 tuổi là はたち — không liên quan gì tới にじゅう. Nó ra đề rất nhiều và cũng xuất hiện trong ' +
          'bài đọc thi nói. Nếu bạn 20 tuổi thì đây là câu bạn sẽ phải nói.',
      },
      {
        type: 'examples',
        h: 'Câu hỏi tuổi',
        items: [
          {
            jp: '何才ですか。',
            read: 'なんさいですか',
            romaji: 'nan-sai desu ka',
            vi: 'Bạn bao nhiêu tuổi?',
          },
          {
            jp: 'おいくつですか。',
            read: 'おいくつですか',
            romaji: 'o-ikutsu desu ka',
            vi: 'Anh/chị bao nhiêu tuổi? (lịch sự hơn)',
            note: 'Giám thị nhiều khả năng dùng câu này. Nghe được nó là quan trọng hơn tự nói được.',
          },
          {
            jp: '二十歳です。',
            read: 'はたちです',
            romaji: 'hatachi desu',
            vi: 'Tôi 20 tuổi.',
          },
        ],
      },
      {
        type: 'table',
        h: 'Tiện thể: tầng 階 (かい) — cùng kiểu biến âm',
        headers: ['Tầng', 'Đọc', 'Ghi chú'],
        rows: [
          ['1階', 'いっかい ik-kai', 'âm ngắt'],
          ['3階', 'さんがい san-GAI', 'かい → がい, ngoại lệ duy nhất'],
          ['6階', 'ろっかい rok-kai', 'âm ngắt'],
          ['8階', 'はっかい hak-kai', 'âm ngắt'],
          ['10階', 'じゅっかい juk-kai', 'âm ngắt'],
          ['何階', 'なんがい nan-gai', 'tầng mấy'],
        ],
        dangerRows: [1, 5],
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd2-exam-review': {
    goal: 'Biến đề vừa làm sai thành danh sách việc cần học, thay vì chỉ biết mình được mấy điểm.',
    parts: [
      {
        type: 'text',
        h: 'Điểm số không quan trọng bằng phân loại lỗi',
        body:
          'Một đề FE làm sai 20 câu nghe rất tệ, nhưng nếu 15 câu trong đó cùng một lỗi (ví dụ đọc số) thì ' +
          'bạn chỉ có MỘT vấn đề, sửa một buổi là xong. Cho nên phải phân loại chứ đừng đếm.',
      },
      {
        type: 'steps',
        h: 'Lập sổ lỗi trong 20 phút',
        items: [
          'Kẻ 4 cột: Câu · Tôi chọn · Đáp án · LOẠI LỖI.',
          'Loại lỗi chỉ dùng 5 nhãn: SỐ · TRỢ TỪ · TỪ VỰNG · KANJI · ĐỌC NHẦM ĐỀ.',
          'Điền hết các câu sai, không bỏ câu nào kể cả câu "đoán bừa mà đúng" — đoán đúng vẫn là lỗ hổng.',
          'Đếm số câu theo từng nhãn. Nhãn nào nhiều nhất chính là việc phải làm đầu tiên ngày mai.',
          'Với nhãn nhiều nhất: mở đúng mục tương ứng trong tab "Bảng tra cứu" đọc lại, rồi làm lại riêng những câu đó.',
        ],
      },
      {
        type: 'tip',
        h: 'Câu đoán bừa mà đúng',
        body:
          'Đánh dấu riêng những câu bạn không chắc nhưng chọn trúng. Đó là điểm may, không phải điểm thật — ' +
          'vào phòng thi thật thì may thường không lặp lại.',
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd2-speak-group1': {
    goal: 'Trả lời trôi 5 câu hỏi thông tin cá nhân — nhóm câu chắc chắn được hỏi đầu buổi.',
    parts: [
      {
        type: 'examples',
        h: '5 cặp hỏi–đáp cốt lõi',
        items: [
          {
            jp: 'お名前は？ → 〈クオン〉です。',
            read: 'おなまえは → クオンです',
            romaji: 'o-namae wa → Kuon desu',
            vi: 'Tên bạn là gì? → Tôi là Cường.',
            note: 'Câu ĐẦU TIÊN của mọi buổi thi nói.',
          },
          {
            jp: 'お国は どちらですか。→ ベトナムです。',
            read: 'おくには どちらですか → ベトナムです',
            romaji: 'o-kuni wa dochira desu ka → betonamu desu',
            vi: 'Bạn từ nước nào? → Việt Nam.',
          },
          {
            jp: 'お仕事は？ → 学生です。',
            read: 'おしごとは → がくせいです',
            romaji: 'o-shigoto wa → gakusei desu',
            vi: 'Bạn làm nghề gì? → Tôi là sinh viên.',
          },
          {
            jp: '何才ですか。→ 〈二十歳〉です。',
            read: 'なんさいですか → はたちです',
            romaji: 'nan-sai desu ka → hatachi desu',
            vi: 'Bạn bao nhiêu tuổi? → Tôi 20 tuổi.',
          },
          {
            jp: '誕生日は いつですか。→ 〈四月八日〉です。',
            read: 'たんじょうびは いつですか → しがつ ようかです',
            romaji: 'tanjoubi wa itsu desu ka → shi-gatsu youka desu',
            vi: 'Sinh nhật bạn khi nào? → Ngày 8 tháng 4.',
            note: 'Đây là chỗ bài học số hôm nay gặp lại phần thi nói — tháng trước, ngày sau.',
          },
        ],
      },
      {
        type: 'tip',
        h: 'Cách tập cho ra phản xạ',
        body:
          'Nhờ người nhà đọc câu hỏi tiếng Việt ngẫu nhiên, bạn bật ra câu tiếng Nhật. Không có ai thì tự ghi ' +
          'âm 5 câu hỏi, phát lại rồi trả lời. Quan trọng là KHÔNG theo thứ tự — thi thật giám thị hỏi lộn xộn.',
      },
    ],
  },
};
