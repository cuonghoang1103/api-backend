/**
 * NGÀY 1 — Đọc được chữ.
 *
 * Mọi bài ở đây dạy đủ để không phải mở nguồn khác: quy tắc → bảng →
 * ví dụ có dịch → bẫy → tự kiểm. Ví dụ ưu tiên lấy từ chính đề thi và
 * giáo trình JPD113 chứ không lấy từ vựng lạ.
 */

import type { LessonMap } from './types';

export const DAY1_LESSONS: LessonMap = {
  /* ─────────────────────────────────────────────── */
  'd1-hira-46': {
    goal: 'Nhìn bất kỳ chữ hiragana nào cũng đọc ra âm trong dưới 1 giây, không phải dò bảng.',
    parts: [
      {
        type: 'text',
        h: 'Hiragana là gì và vì sao phải học trước',
        body:
          'Tiếng Nhật có 3 bộ chữ dùng CHUNG trong một câu: hiragana (chữ mềm, dùng cho từ thuần Nhật và ' +
          'phần đuôi ngữ pháp), katakana (chữ cứng, dùng cho từ mượn) và kanji (chữ Hán). Hiragana là bộ ' +
          'nền: mọi câu đều có nó, và trong đề thi phần lớn chữ bạn thấy là hiragana. Không đọc được ' +
          'hiragana thì không làm được câu nào, kể cả câu chỉ hỏi ngữ pháp.',
      },
      {
        type: 'text',
        h: 'Cấu trúc: 5 nguyên âm × 9 phụ âm',
        body:
          'Bảng 46 chữ KHÔNG phải 46 thứ rời rạc. Nó là một lưới: 5 nguyên âm a-i-u-e-o, rồi mỗi phụ âm ' +
          'ghép lần lượt với 5 nguyên âm đó. Học được hàng あ và nắm được quy luật thì 9 hàng còn lại chỉ ' +
          'là ghép phụ âm vào. Đây là lý do người ta học xong kana trong một ngày.',
      },
      {
        type: 'table',
        h: 'Toàn bộ 46 âm — học theo HÀNG NGANG, mỗi lần một hàng',
        headers: ['Hàng', 'a', 'i', 'u', 'e', 'o'],
        rows: [
          ['— (nguyên âm)', 'あ a', 'い i', 'う u', 'え e', 'お o'],
          ['K', 'か ka', 'き ki', 'く ku', 'け ke', 'こ ko'],
          ['S', 'さ sa', 'し SHI', 'す su', 'せ se', 'そ so'],
          ['T', 'た ta', 'ち CHI', 'つ TSU', 'て te', 'と to'],
          ['N', 'な na', 'に ni', 'ぬ nu', 'ね ne', 'の no'],
          ['H', 'は ha', 'ひ hi', 'ふ FU', 'へ he', 'ほ ho'],
          ['M', 'ま ma', 'み mi', 'む mu', 'め me', 'も mo'],
          ['Y', 'や ya', '—', 'ゆ yu', '—', 'よ yo'],
          ['R', 'ら ra', 'り ri', 'る ru', 'れ re', 'ろ ro'],
          ['W', 'わ wa', '—', '—', '—', 'を O'],
          ['N cuối', 'ん n', '', '', '', ''],
        ],
        note:
          'Bốn ô viết HOA là bốn chỗ lệch quy luật, phải nhớ riêng: し đọc "shi" chứ không phải "si", ' +
          'ち là "chi" không phải "ti", つ là "tsu" không phải "tu", ふ là "fu" không phải "hu". ' +
          'を chỉ dùng làm trợ từ và luôn đọc "o".',
      },
      {
        type: 'steps',
        h: 'Cách học 45 phút cho hết bảng',
        items: [
          'Chia 10 hàng thành 5 cụm: (あ か) — (さ た) — (な は) — (ま や) — (ら わ ん).',
          'Mỗi cụm 8 phút: đọc to từng chữ 3 lần, vừa đọc vừa viết ra giấy. Miệng + tay + mắt cùng lúc thì nhớ nhanh gấp ba so với chỉ nhìn.',
          'Học xong một cụm, che bảng, viết lại cụm đó từ trí nhớ. Sai chữ nào khoanh tròn chữ đó.',
          'Sang cụm mới, nhưng trước đó đọc lướt lại các cụm cũ 30 giây.',
          'Cuối cùng mở tab "Luyện gõ chữ" trên trang này, chọn bộ hiragana, chạy một vòng 20 câu.',
        ],
      },
      {
        type: 'tip',
        h: 'Mẹo nhớ hình bằng liên tưởng',
        body:
          'あ giống chữ "あ" có dấu thập ở trên — nghĩ tới chữ A viết ngoáy. き giống chìa khoá (key). ' +
          'く giống mỏ chim đang mổ (ku-ku). め có vòng tròn như con mắt (me = mắt trong tiếng Nhật). ' +
          'ね có đuôi xoắn như đuôi mèo (neko = mèo). Liên tưởng nào cũng được, miễn là của bạn.',
      },
      {
        type: 'quiz',
        h: 'Tự kiểm — đọc thành tiếng rồi mới bấm',
        items: [
          { q: 'ねこ', a: 'neko — con mèo' },
          { q: 'つくえ', a: 'tsukue — cái bàn', why: 'つ là "tsu", không phải "tu".' },
          { q: 'しつもん', a: 'shitsumon — câu hỏi', why: 'し = shi, つ = tsu, ん = n (một nhịp riêng).' },
          { q: 'ふゆ', a: 'fuyu — mùa đông', why: 'ふ là "fu", không phải "hu".' },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd1-hira-write': {
    goal: 'Viết được cả bảng ra giấy trắng, và không còn lẫn 6 cặp chữ hay nhầm nhất.',
    parts: [
      {
        type: 'text',
        h: 'Vì sao phải chép tay dù thi trên máy',
        body:
          'Chép tay không phải để thi viết — nó để tay ghi nhớ hình chữ. Người chỉ nhìn bảng sẽ nhận ra ' +
          'chữ khi thấy nó ĐỨNG MỘT MÌNH, nhưng vào bài đọc, chữ nằm giữa dòng thì lẫn ngay. Đề JPD113 ' +
          'có dạng "chọn mặt chữ" và bài đọc to — cả hai đều cần nhận mặt chữ tức thì.',
      },
      {
        type: 'table',
        h: '6 cặp lẫn nhau nhiều nhất — phân biệt bằng ĐIỂM KHÁC, không bằng cảm giác',
        headers: ['Cặp', 'Phân biệt thế nào', 'Từ để nhớ'],
        rows: [
          ['は ha / ほ ho', 'ほ có THÊM một nét ngang (2 gạch ngang), は chỉ 1', 'はな (hoa) / ほん (sách)'],
          ['ぬ nu / め me', 'ぬ có vòng xoắn ở đuôi, め thì không', 'いぬ (chó) / め (mắt)'],
          ['れ re / わ wa / ね ne', 'đuôi: れ hất thẳng ra, わ cong vào, ね xoắn tròn', 'これ (cái này) / わたし (tôi) / ねこ (mèo)'],
          ['さ sa / き ki', 'き có 2 nét ngang, さ chỉ 1', 'さかな (cá) / きって (tem)'],
          ['る ru / ろ ro', 'る có vòng khép ở cuối, ろ để mở', 'みる (xem) / ろく (số 6)'],
          ['あ a / お o', 'お có dấu chấm bên phải, あ không', 'あさ (buổi sáng) / おかね (tiền)'],
        ],
        dangerRows: [0, 1, 2],
      },
      {
        type: 'steps',
        h: 'Quy trình 25 phút',
        items: [
          'Lượt 1 (12 phút): nhìn bảng, chép cả 46 chữ, mỗi chữ 3 lần, vừa viết vừa đọc to âm của nó.',
          'Lượt 2 (10 phút): CHE bảng, viết lại cả 46 chữ theo thứ tự あ か さ た な は ま や ら わ.',
          'Đối chiếu, khoanh tròn chữ viết sai hoặc quên.',
          'Riêng những chữ khoanh tròn: viết thêm 10 lần mỗi chữ (3 phút).',
        ],
      },
      {
        type: 'tip',
        h: 'Thứ tự nét — nguyên tắc chung',
        body:
          'Trên xuống dưới, trái sang phải, nét ngang trước nét dọc. Không cần học thuộc từng chữ; ' +
          'viết theo nguyên tắc này là chữ ra đúng hình và tay quen nhanh hơn.',
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd1-hira-dakuten': {
    goal: 'Đọc đúng 25 âm đục / bán đục và không lẫn は–ば–ぱ khi gặp trong bài.',
    parts: [
      {
        type: 'text',
        h: 'Chỉ là hai dấu nhỏ, không phải chữ mới',
        body:
          'Bạn KHÔNG phải học thêm 25 chữ. Đây vẫn là những chữ vừa học, chỉ thêm dấu ở góc trên bên phải: ' +
          'dấu " (dakuten, hai gạch nhỏ) làm âm "đục đi", dấu ° (handakuten, vòng tròn nhỏ) chỉ dùng cho ' +
          'hàng は và biến nó thành "p". Nắm quy luật thì 20 phút là xong.',
      },
      {
        type: 'table',
        h: 'Quy luật biến âm — nhớ 5 dòng này là đủ',
        headers: ['Gốc', 'Thêm "', 'Kết quả', 'Ví dụ'],
        rows: [
          ['か ki-ku-ke-ko (K)', 'が ぎ ぐ げ ご', 'G', 'がっこう gakkou — trường học'],
          ['さ し す せ そ (S)', 'ざ じ ず ぜ ぞ', 'Z (riêng じ = JI)', 'かんじ kanji — chữ Hán'],
          ['た ち つ て と (T)', 'だ ぢ づ で ど', 'D (ぢづ hiếm gặp)', 'だいがく daigaku — đại học'],
          ['は ひ ふ へ ほ (H)', 'ば び ぶ べ ぼ', 'B', 'べんきょう benkyou — học tập'],
          ['は ひ ふ へ ほ (H)', 'ぱ ぴ ぷ ぺ ぽ (dấu °)', 'P', 'いっぱい ippai — đầy, nhiều'],
        ],
        note: 'じ (ji) và ず (zu) gặp thường xuyên; ぢ và づ gần như không xuất hiện trong đề JPD113 — đừng tốn thời gian cho chúng.',
      },
      {
        type: 'examples',
        h: 'Nghe khác nhau thế nào — đọc to từng cặp',
        items: [
          { jp: 'はん', romaji: 'han', vi: 'rưỡi (2時半 = 2 giờ rưỡi)' },
          { jp: 'ばん', romaji: 'ban', vi: 'buổi tối / số thứ tự' },
          { jp: 'ぱん', romaji: 'pan', vi: 'bánh mì (パン, thường viết katakana)' },
          { jp: 'かんこく', romaji: 'kankoku', vi: 'Hàn Quốc' },
          { jp: 'ぎんこう', romaji: 'ginkou', vi: 'ngân hàng', note: 'か → が chỉ khác hai gạch nhỏ mà đổi hẳn nghĩa.' },
        ],
      },
      {
        type: 'quiz',
        h: 'Tự kiểm',
        items: [
          { q: 'ざっし', a: 'zasshi — tạp chí', why: 'ざ = za, っ là nhịp nghỉ nên đọc "zas-shi".' },
          { q: 'でんわ', a: 'denwa — điện thoại' },
          { q: 'ぶんぽう', a: 'bunpou — ngữ pháp', why: 'ぽ có dấu ° nên là "po", không phải "bo".' },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd1-hira-youon': {
    goal: 'Đọc đúng 33 âm ghép trong MỘT nhịp, và đọc đúng chỗ ngắt っ — hai lỗi này chiếm phần lớn điểm trừ khi đọc to.',
    parts: [
      {
        type: 'text',
        h: 'Phần 1 — Âm ghép (拗音 youon): chữ nhỏ ゃゅょ',
        body:
          'Khi ゃ ゅ ょ được viết NHỎ và đứng sau một chữ hàng い (き し ち に ひ み り và bản đục của chúng), ' +
          'hai chữ dính lại thành MỘT âm, đọc trong MỘT nhịp. き + ゃ = きゃ đọc "kya" — một nhịp, ' +
          'không phải "ki-ya" hai nhịp. Đây là chỗ người mới hay đọc thừa nhịp và bị trừ điểm khi đọc to.',
      },
      {
        type: 'table',
        h: 'Toàn bộ 33 âm ghép',
        headers: ['Gốc', '+ ゃ', '+ ゅ', '+ ょ'],
        rows: [
          ['き ki', 'きゃ kya', 'きゅ kyu', 'きょ kyo'],
          ['し shi', 'しゃ SHA', 'しゅ SHU', 'しょ SHO'],
          ['ち chi', 'ちゃ CHA', 'ちゅ CHU', 'ちょ CHO'],
          ['に ni', 'にゃ nya', 'にゅ nyu', 'にょ nyo'],
          ['ひ hi', 'ひゃ hya', 'ひゅ hyu', 'ひょ hyo'],
          ['み mi', 'みゃ mya', 'みゅ myu', 'みょ myo'],
          ['り ri', 'りゃ rya', 'りゅ ryu', 'りょ ryo'],
          ['ぎ gi', 'ぎゃ gya', 'ぎゅ gyu', 'ぎょ gyo'],
          ['じ ji', 'じゃ JA', 'じゅ JU', 'じょ JO'],
          ['び bi', 'びゃ bya', 'びゅ byu', 'びょ byo'],
          ['ぴ pi', 'ぴゃ pya', 'ぴゅ pyu', 'ぴょ pyo'],
        ],
        note:
          'Ô viết HOA là chỗ không đọc theo công thức: しゃ là "sha" chứ không phải "shya", ちゃ là "cha", ' +
          'じゃ là "ja". Nhớ ba hàng này thì hết bảng.',
      },
      {
        type: 'examples',
        h: 'Âm ghép trong từ có thật của đề',
        items: [
          { jp: '会社', read: 'かいしゃ', romaji: 'kaisha', vi: 'công ty', note: 'しゃ một nhịp — "kai-sha", 3 nhịp tổng cộng.' },
          { jp: '会社員', read: 'かいしゃいん', romaji: 'kaishain', vi: 'nhân viên công ty' },
          { jp: '勉強', read: 'べんきょう', romaji: 'benkyou', vi: 'học tập', note: 'きょ một nhịp, rồi う kéo dài thành "kyoo".' },
          { jp: '旅行', read: 'りょこう', romaji: 'ryokou', vi: 'du lịch' },
          { jp: '教師', read: 'きょうし', romaji: 'kyoushi', vi: 'giáo viên (tên nghề)' },
          { jp: '病院', read: 'びょういん', romaji: 'byouin', vi: 'bệnh viện' },
        ],
      },
      {
        type: 'warn',
        h: 'Chữ nhỏ vs chữ to — đổi hẳn từ',
        body:
          'きゃ (nhỏ, 1 nhịp, "kya") khác きや (to, 2 nhịp, "ki-ya"). じゅう (10) khác じゆう (tự do). ' +
          'Trong đề in, chữ nhỏ thấp hơn và nằm sát chân dòng — nhìn kỹ trước khi đọc.',
      },
      {
        type: 'text',
        h: 'Phần 2 — Âm ngắt っ (tsu nhỏ): một nhịp IM LẶNG',
        body:
          'っ không phát ra âm nào. Nó là một nhịp NGHỈ, và nó làm phụ âm ngay sau nó bị "gấp đôi". ' +
          'がっこう không đọc "ga-kou" (3 nhịp) mà đọc "gak-kou" — bốn nhịp: が / っ / こ / う. Cách tập ' +
          'dễ nhất: đọc tới っ thì ngậm miệng lại đúng một nhịp rồi mới bật ra chữ tiếp theo.',
      },
      {
        type: 'examples',
        h: 'Cặp chỉ khác っ mà khác hẳn nghĩa — bẫy kinh điển',
        items: [
          { jp: 'きて', romaji: 'kite', vi: 'hãy đến' },
          { jp: 'きって', romaji: 'kit-te', vi: 'con tem', note: 'Thêm っ là đổi hẳn từ.' },
          { jp: 'おと', romaji: 'oto', vi: 'âm thanh' },
          { jp: 'おっと', romaji: 'ot-to', vi: 'chồng' },
          { jp: 'さか', romaji: 'saka', vi: 'con dốc' },
          { jp: 'さっか', romaji: 'sak-ka', vi: 'tác giả' },
        ],
      },
      {
        type: 'table',
        h: 'っ trong những từ chắc chắn gặp ở đề',
        headers: ['Từ', 'Đọc', 'Nghĩa'],
        rows: [
          ['学校', 'がっこう gak-kou', 'trường học'],
          ['雑誌', 'ざっし zas-shi', 'tạp chí'],
          ['切手', 'きって kit-te', 'con tem'],
          ['一分', 'いっぷん ip-pun', '1 phút'],
          ['八分', 'はっぷん hap-pun', '8 phút'],
          ['十分', 'じゅっぷん jup-pun', '10 phút'],
          ['一週間', 'いっしゅうかん is-shuukan', 'một tuần'],
          ['十八才', 'じゅうはっさい juu-has-sai', '18 tuổi'],
        ],
        note: 'Để ý: っ xuất hiện dày đặc ở SỐ ĐẾM. Đây là lý do ngày mai (số & thời gian) sẽ dễ hơn nhiều nếu hôm nay đọc っ chuẩn.',
      },
      {
        type: 'quiz',
        h: 'Tự kiểm — đếm nhịp trước khi bấm',
        items: [
          { q: 'がっこう có mấy nhịp?', a: '4 nhịp: が / っ / こ / う', why: 'っ tính là một nhịp dù không phát âm.' },
          { q: 'しゅくだい đọc thế nào?', a: 'shuku-dai — bài tập về nhà', why: 'しゅ là MỘT nhịp, không đọc "shi-yu".' },
          { q: 'いっぱい', a: 'ip-pai — đầy, nhiều', why: 'っ + ぱ → phụ âm p gấp đôi.' },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd1-hira-mora': {
    goal: 'Đếm đúng nhịp của từ và đọc đủ độ dài trường âm — lỗi trừ điểm số một khi thi đọc to.',
    parts: [
      {
        type: 'text',
        h: 'Tiếng Nhật đếm NHỊP, không đếm âm tiết',
        body:
          'Người Việt quen đếm âm tiết (mỗi tiếng một chữ). Tiếng Nhật đếm "mora" — mỗi kana một nhịp, ' +
          'kể cả ん và っ, và mỗi ký tự kéo dài cũng là một nhịp. Giám thị nghe ra ngay khi bạn đọc thiếu ' +
          'nhịp, vì nhịp sai làm từ nghe thành từ khác.',
      },
      {
        type: 'table',
        h: 'Đếm thử',
        headers: ['Từ', 'Tách nhịp', 'Số nhịp'],
        rows: [
          ['せんせい', 'せ / ん / せ / い', '4 — không phải 3'],
          ['がっこう', 'が / っ / こ / う', '4'],
          ['にほん', 'に / ほ / ん', '3'],
          ['コーヒー', 'コ / ー / ヒ / ー', '4'],
          ['かいしゃいん', 'か / い / しゃ / い / ん', '5 — しゃ chỉ 1 nhịp'],
        ],
      },
      {
        type: 'text',
        h: 'ん — một nhịp riêng, không dính vào chữ trước',
        body:
          'ん không bao giờ đứng đầu từ, và nó luôn chiếm trọn một nhịp. せんせい phải đọc đủ bốn nhịp ' +
          '"se-n-se-e", không phải "sen-see" hai nhịp kiểu tiếng Việt. Tập bằng cách gõ nhịp xuống bàn: ' +
          'mỗi nhịp một cái gõ.',
      },
      {
        type: 'text',
        h: 'Trường âm — kéo dài đúng một nhịp nữa',
        body:
          'Hiragana kéo dài bằng cách THÊM nguyên âm phía sau; katakana kéo dài bằng gạch ngang ー. ' +
          'Kéo dài không phải "đọc to hơn" mà là "đọc lâu gấp đôi".',
      },
      {
        type: 'table',
        h: 'Quy tắc kéo dài của hiragana',
        headers: ['Hàng', 'Thêm gì', 'Ví dụ', 'Đọc'],
        rows: [
          ['あ (a)', '+ あ', 'おかあさん', 'okaasan — mẹ'],
          ['い (i)', '+ い', 'おにいさん', 'oniisan — anh trai'],
          ['う (u)', '+ う', 'すうがく', 'suugaku — toán học'],
          ['え (e)', '+ い (thường)', 'せんせい・えいが', 'sensee (đọc "ee") · eega — phim'],
          ['え (e)', '+ え (ngoại lệ)', 'おねえさん', 'oneesan — chị gái'],
          ['お (o)', '+ う (thường)', 'おとうさん・こうこう', 'otoosan — bố · kookoo — cấp 3'],
          ['お (o)', '+ お (ngoại lệ)', 'おおきい・とおい・十日 とおか', 'ookii — to · tooi — xa · tooka — ngày 10'],
        ],
        dangerRows: [4, 6],
        note:
          'Hai hàng đỏ là ngoại lệ phải học vẹt. Đặc biệt 十日 (とおか, ngày 10) — nó có trong bảng ngày ' +
          'mà bạn sẽ học ngày mai, và rất hay bị đọc nhầm thành "tooka" ngắn.',
      },
      {
        type: 'examples',
        h: 'Cặp chỉ khác trường âm mà khác nghĩa — đọc sai là hiểu sai',
        items: [
          { jp: 'おばさん', romaji: 'obasan', vi: 'cô, bác gái' },
          { jp: 'おばあさん', romaji: 'obaasan', vi: 'bà' },
          { jp: 'おじさん', romaji: 'ojisan', vi: 'chú, bác trai' },
          { jp: 'おじいさん', romaji: 'ojiisan', vi: 'ông' },
          { jp: 'ゆき', romaji: 'yuki', vi: 'tuyết' },
          { jp: 'ゆうき', romaji: 'yuuki', vi: 'dũng khí' },
          { jp: 'ビル', romaji: 'biru', vi: 'toà nhà' },
          { jp: 'ビール', romaji: 'biiru', vi: 'bia', note: 'Cặp này ra đề katakana nhiều nhất.' },
        ],
      },
      {
        type: 'tip',
        h: 'Cách tự sửa khi đọc bài thi',
        body:
          'Đọc chậm và gõ ngón tay xuống đùi theo từng nhịp. Thà chậm mà đủ nhịp còn hơn nhanh mà nuốt — ' +
          'phần READING chấm phát âm rõ và đúng, không chấm tốc độ.',
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd1-hira-particles': {
    goal: 'Đọc đúng は/へ/を trong mọi câu — ba chữ này có trong gần như mọi câu của đề.',
    parts: [
      {
        type: 'text',
        h: 'Ba chữ có hai cách đọc',
        body:
          'Đây là ngoại lệ chính tả duy nhất bạn cần nhớ ở mức sơ cấp: ba chữ này khi làm TRỢ TỪ ' +
          '(tức là làm nhiệm vụ ngữ pháp trong câu) thì đọc khác với khi làm một phần của từ.',
      },
      {
        type: 'table',
        h: 'Đọc thế nào và khi nào',
        headers: ['Chữ', 'Đọc khi là trợ từ', 'Nhiệm vụ', 'Đọc khi nằm trong từ'],
        rows: [
          ['は', 'WA', 'đánh dấu chủ đề: "còn về…thì"', 'HA — はな hana (hoa), はん han (rưỡi)'],
          ['へ', 'E', 'chỉ hướng đi: "về phía…"', 'HE — へや heya (căn phòng)'],
          ['を', 'O', 'đánh dấu tân ngữ (vật bị tác động)', 'を chỉ dùng làm trợ từ, luôn đọc O'],
        ],
      },
      {
        type: 'examples',
        h: 'Câu mẫu — đọc to cả câu',
        items: [
          {
            jp: '私は 学生です。',
            read: 'わたしは がくせいです',
            romaji: 'watashi WA gakusei desu',
            vi: 'Tôi là sinh viên.',
            note: 'は ở đây là trợ từ → đọc "wa". Câu này gần như chắc chắn xuất hiện trong bài thi nói.',
          },
          {
            jp: '学校へ 行きます。',
            read: 'がっこうへ いきます',
            romaji: 'gakkou E ikimasu',
            vi: 'Tôi đi đến trường.',
            note: 'へ chỉ hướng → đọc "e".',
          },
          {
            jp: 'ごはんを 食べます。',
            read: 'ごはんを たべます',
            romaji: 'gohan O tabemasu',
            vi: 'Tôi ăn cơm.',
            note: 'を đánh dấu "cơm" là thứ bị ăn → luôn đọc "o".',
          },
          {
            jp: 'これは 私の かばんです。',
            read: 'これは わたしの かばんです',
            romaji: 'kore WA watashi no kaban desu',
            vi: 'Cái này là cặp của tôi.',
          },
        ],
      },
      {
        type: 'warn',
        h: 'Cách nhận ra は là trợ từ trong 1 giây',
        body:
          'Trợ từ は luôn đứng NGAY SAU một danh từ và có khoảng trắng/ngắt nhịp sau nó. Nếu は dính liền ' +
          'trong một từ (はな, はは, はん) thì đọc "ha". Trong đề JPD113, は đứng ngay sau 私 / これ / ' +
          'tên người thì 100% là trợ từ.',
      },
      {
        type: 'quiz',
        h: 'Tự kiểm — đọc câu thành tiếng',
        items: [
          { q: '私は ベトナム人です。', a: 'watashi WA betonamujin desu — Tôi là người Việt Nam.', why: 'は sau 私 là trợ từ → "wa".' },
          { q: 'はは は 先生です。', a: 'haha WA sensei desu — Mẹ tôi là giáo viên.', why: 'はは (mẹ) đọc "haha"; は đứng riêng sau nó mới là trợ từ đọc "wa".' },
          { q: '日本へ 行きます。', a: 'nihon E ikimasu — Tôi đi Nhật.' },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd1-kata-46': {
    goal: 'Đọc được katakana mà không phải dịch ngược qua hiragana trong đầu.',
    parts: [
      {
        type: 'text',
        h: 'Katakana dùng làm gì',
        body:
          'Cùng 46 âm y hệt hiragana, chỉ khác hình. Dùng cho: từ mượn tiếng nước ngoài (テレビ tivi), ' +
          'tên nước và tên người nước ngoài (ベトナム, アメリカ), và tên bạn khi tự giới thiệu. ' +
          'Trong đề JPD113 katakana chiếm khoảng 2% số câu trắc nghiệm, nhưng ở phần THI NÓI thì bắt buộc: ' +
          'câu đầu tiên giám thị hỏi là お名前は？ và bạn phải đọc/viết được tên mình bằng katakana.',
      },
      {
        type: 'steps',
        h: 'Học theo CẶP, không học lại từ đầu',
        items: [
          'Mở bảng katakana trong tab "Bảng tra cứu" của trang này, để cạnh bảng hiragana.',
          'Đọc theo cặp cùng âm: あ↔ア, い↔イ, う↔ウ… Mỗi cặp đọc to một lần. Bạn đã biết ÂM rồi, chỉ cần gắn hình mới vào.',
          'Chú ý những cặp có hình gần giống nhau, học nhanh hơn: か↔カ, せ↔セ, り↔リ, も↔モ, へ↔ヘ (へ giống hệt!), や↔ヤ.',
          'Cuối cùng chạy một vòng "Luyện gõ chữ" → bộ katakana trên trang này.',
        ],
      },
      {
        type: 'table',
        h: 'Katakana có nét thẳng và góc cạnh — vài chữ dễ nhớ nhất',
        headers: ['Katakana', 'Âm', 'Mẹo'],
        rows: [
          ['ア', 'a', 'giống chữ あ bị "duỗi thẳng"'],
          ['カ', 'ka', 'gần như y hệt か, chỉ bỏ nét cuối'],
          ['ヘ', 'he', 'GIỐNG HỆT へ — một chữ cho không'],
          ['リ', 'ri', 'giống り, hai nét thẳng'],
          ['ト', 'to', 'chữ T có gạch ngang → "to"'],
          ['ロ', 'ro', 'hình vuông, giống chữ 口'],
          ['ー', '(kéo dài)', 'gạch ngang, không phải chữ — dùng để kéo dài âm trước'],
        ],
      },
      {
        type: 'examples',
        h: 'Tập đọc bằng từ bạn đã biết nghĩa',
        items: [
          { jp: 'テレビ', romaji: 'terebi', vi: 'tivi (television)' },
          { jp: 'パソコン', romaji: 'pasokon', vi: 'máy tính (personal computer)' },
          { jp: 'コーヒー', romaji: 'koohii', vi: 'cà phê', note: 'Hai gạch ー = hai nhịp kéo dài. 4 nhịp tổng cộng.' },
          { jp: 'ベトナム', romaji: 'betonamu', vi: 'Việt Nam' },
          { jp: 'アルバイト', romaji: 'arubaito', vi: 'việc làm thêm (từ tiếng Đức Arbeit)' },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd1-kata-confuse': {
    goal: 'Phân biệt シ/ツ và ソ/ン trong nửa giây, không đoán mò.',
    parts: [
      {
        type: 'text',
        h: 'Vì sao bốn chữ này khó',
        body:
          'Chúng chỉ khác nhau ở HƯỚNG NÉT và VỊ TRÍ CHẤM — in nhỏ trên đề thì gần như giống hệt. ' +
          'Nhưng có hai quy tắc cứng, dùng được mọi lúc.',
      },
      {
        type: 'table',
        h: 'Quy tắc 1 — đếm nét, rồi nhìn hướng nét dài',
        headers: ['Chữ', 'Âm', 'Số nét', 'Nét dài đi hướng nào', 'Chấm nằm đâu'],
        rows: [
          ['シ', 'shi', '3', 'từ DƯỚI đi LÊN ↗', 'hai chấm xếp DỌC bên trái'],
          ['ツ', 'tsu', '3', 'từ TRÊN đi XUỐNG ↘', 'hai chấm xếp NGANG ở trên'],
          ['ン', 'n', '2', 'từ DƯỚI đi LÊN ↗', 'một chấm bên trái'],
          ['ソ', 'so', '2', 'từ TRÊN đi XUỐNG ↘', 'một chấm ở trên'],
        ],
        note: 'Gộp lại: シ và ン đi LÊN · ツ và ソ đi XUỐNG. Chỉ cần nhớ đúng một câu này.',
      },
      {
        type: 'tip',
        h: 'Quy tắc 2 — liên tưởng sang hiragana',
        body:
          'シ ↔ し: cả hai đều có nét cong hất LÊN. ツ ↔ つ: cả hai đều có nét quét NGANG ở trên. ' +
          'Nhớ được cặp này thì tự suy ra ソ (giống ツ, đi xuống) và ン (giống シ, đi lên).',
      },
      {
        type: 'tip',
        h: 'Quy tắc 3 — mẹo vị trí trong từ',
        body:
          'ン gần như KHÔNG BAO GIỜ đứng đầu từ (giống ん trong hiragana). Nên nếu chữ đó ở đầu từ thì ' +
          'nó là ソ chứ không phải ン. Ngược lại, ン rất hay ở CUỐI từ: パソコン, レストラン, ベトナム… ',
      },
      {
        type: 'examples',
        h: 'Từ thật để tập nhận mặt',
        items: [
          { jp: 'テニス', romaji: 'tenisu', vi: 'quần vợt', note: 'ス chứ không phải ヌ — ス có nét hất chéo.' },
          { jp: 'シャツ', romaji: 'shatsu', vi: 'áo sơ mi', note: 'Có CẢ シ lẫn ツ trong một từ — bài tập tốt nhất.' },
          { jp: 'ソフト', romaji: 'sofuto', vi: 'phần mềm', note: 'ソ đứng đầu từ.' },
          { jp: 'パソコン', romaji: 'pasokon', vi: 'máy tính', note: 'ソ ở giữa, ン ở cuối — so hai chữ ngay trong một từ.' },
          { jp: 'レストラン', romaji: 'resutoran', vi: 'nhà hàng', note: 'ン cuối từ.' },
        ],
      },
      {
        type: 'table',
        h: 'Bốn cặp khác cũng hay lẫn — xem luôn cho hết',
        headers: ['Cặp', 'Phân biệt'],
        rows: [
          ['ク ku / ワ wa / フ fu', 'ク có nét chéo trong góc · ワ mở rộng như cái miệng · フ chỉ một nét gãy'],
          ['ス su / ヌ nu', 'ヌ có nét ngang cắt qua, ス thì không'],
          ['ロ ro / 口 (kanji miệng)', 'giống hệt nhau — phân biệt bằng ngữ cảnh: katakana thì nằm giữa các katakana khác'],
          ['エ e / 工 (kanji công)', 'cũng giống hệt — như trên'],
        ],
      },
      {
        type: 'quiz',
        h: 'Tự kiểm',
        items: [
          { q: 'コンピューター — chữ thứ hai là ン hay ソ?', a: 'ン (n) — konpyuutaa, máy tính', why: 'Nét dài đi từ dưới lên, và ソ hiếm khi đứng giữa sau コ.' },
          { q: 'ツアー đọc là gì?', a: 'tsuaa — chuyến du lịch (tour)', why: 'ツ = tsu (nét đi xuống, hai chấm ngang).' },
          { q: 'Chữ nào gần như không bao giờ mở đầu một từ?', a: 'ン (n)', why: 'Giống ん trong hiragana.' },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd1-kata-words': {
    goal: 'Đọc trôi 25 từ katakana hay ra đề nhất, không phải ghép từng chữ.',
    parts: [
      {
        type: 'text',
        h: 'Cách đọc từ mượn',
        body:
          'Từ mượn là tiếng Anh (hoặc Pháp/Đức) bị "bẻ" cho vừa hệ âm tiếng Nhật: mỗi phụ âm phải kèm một ' +
          'nguyên âm, nên "test" thành テスト te-su-to. Mẹo: đọc to lên rồi đoán ngược về tiếng Anh — ' +
          'đúng 80% trường hợp bạn sẽ nhận ra từ.',
      },
      {
        type: 'table',
        h: 'Đồ vật & nơi chốn',
        headers: ['Katakana', 'Đọc', 'Nghĩa'],
        rows: [
          ['テレビ', 'terebi', 'tivi'],
          ['パソコン', 'pasokon', 'máy tính cá nhân'],
          ['カメラ', 'kamera', 'máy ảnh'],
          ['ペン', 'pen', 'bút'],
          ['ノート', 'nooto', 'vở'],
          ['スマホ', 'sumaho', 'điện thoại thông minh'],
          ['レストラン', 'resutoran', 'nhà hàng'],
          ['スーパー', 'suupaa', 'siêu thị'],
          ['コンビニ', 'konbini', 'cửa hàng tiện lợi'],
          ['トイレ', 'toire', 'nhà vệ sinh'],
          ['バス', 'basu', 'xe buýt'],
          ['エレベーター', 'erebeetaa', 'thang máy'],
        ],
      },
      {
        type: 'table',
        h: 'Ăn uống, sở thích, việc làm',
        headers: ['Katakana', 'Đọc', 'Nghĩa'],
        rows: [
          ['コーヒー', 'koohii', 'cà phê'],
          ['パン', 'pan', 'bánh mì'],
          ['テニス', 'tenisu', 'quần vợt'],
          ['サッカー', 'sakkaa', 'bóng đá'],
          ['スポーツ', 'supootsu', 'thể thao'],
          ['スキー', 'sukii', 'trượt tuyết'],
          ['パーティー', 'paatii', 'buổi tiệc'],
          ['アルバイト', 'arubaito', 'việc làm thêm'],
          ['テスト', 'tesuto', 'bài kiểm tra'],
          ['エンジニア', 'enjinia', 'kỹ sư'],
        ],
      },
      {
        type: 'table',
        h: 'Tên nước — chắc chắn dùng khi thi nói',
        headers: ['Katakana', 'Đọc', 'Nước'],
        rows: [
          ['ベトナム', 'betonamu', 'Việt Nam'],
          ['アメリカ', 'amerika', 'Mỹ'],
          ['オーストラリア', 'oosutoraria', 'Úc'],
          ['ドイツ', 'doitsu', 'Đức'],
          ['フランス', 'furansu', 'Pháp'],
          ['イギリス', 'igirisu', 'Anh'],
          ['タイ', 'tai', 'Thái Lan'],
          ['インド', 'indo', 'Ấn Độ'],
        ],
        note: 'Câu bạn sẽ nói: ベトナムから 来ました。(betonamu kara kimashita — Tôi đến từ Việt Nam.)',
      },
      {
        type: 'warn',
        h: 'Bẫy hay ra đề',
        body:
          '英語 (tiếng Anh) là えいご, KHÔNG phải イギリスご. イギリス là tên NƯỚC Anh, còn ngôn ngữ thì ' +
          'dùng kanji 英語. Đây là câu bẫy có thật trong đề FE.',
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd1-speak-manner': {
    goal: 'Thuộc lòng 4 câu tác phong — 10 điểm PRESENTING lấy được trước khi nói câu tiếng Nhật nào.',
    parts: [
      {
        type: 'text',
        h: 'Vì sao đây là điểm dễ nhất cả kỳ thi',
        body:
          'Thang điểm thi nói: READING 30 · TALKING 60 · PRESENTING 10. Phần PRESENTING chấm THÁI ĐỘ ' +
          'và tác phong, không chấm trình độ tiếng Nhật. Bạn chỉ cần vào phòng đúng cách, chào đúng câu, ' +
          'ngồi thẳng, nhìn giám thị, nói to rõ — là gần như trọn 10 điểm.',
      },
      {
        type: 'examples',
        h: '4 câu theo đúng thứ tự dùng',
        items: [
          {
            jp: '失礼します。',
            read: 'しつれいします',
            romaji: 'shitsurei shimasu',
            vi: 'Xin phép (khi BƯỚC VÀO phòng)',
            note: 'Gõ cửa 2-3 tiếng, mở cửa, nói câu này rồi mới bước vào. Cúi nhẹ 15 độ.',
          },
          {
            jp: 'よろしくおねがいします。',
            read: 'よろしくおねがいします',
            romaji: 'yoroshiku onegai shimasu',
            vi: 'Rất mong được giúp đỡ (đầu buổi, sau khi ngồi xuống)',
            note: 'Câu vạn năng của tiếng Nhật. Nói sau khi tự giới thiệu tên.',
          },
          {
            jp: 'ありがとうございました。',
            read: 'ありがとうございました',
            romaji: 'arigatou gozaimashita',
            vi: 'Cảm ơn ạ (khi thi xong)',
            note: 'Dạng quá khứ ございました vì việc đã xong — dùng ございます sẽ hơi lệch.',
          },
          {
            jp: '失礼しました。',
            read: 'しつれいしました',
            romaji: 'shitsurei shimashita',
            vi: 'Xin phép (khi RỜI phòng)',
            note: 'Cũng là dạng quá khứ. Nói ở cửa, cúi chào rồi mới ra.',
          },
        ],
      },
      {
        type: 'steps',
        h: 'Kịch bản 60 giây đầu tiên — tập trước gương 3 lượt',
        items: [
          'Gõ cửa 2-3 tiếng → mở cửa → 「失礼します」→ cúi nhẹ → bước vào.',
          'Đi tới ghế, đứng thẳng, chờ giám thị mời ngồi (hoặc hỏi 「すわってもいいですか」).',
          'Ngồi xuống, lưng thẳng, hai tay để trên bàn hoặc trên đùi.',
          'Giám thị hỏi 「お名前は？」→ trả lời 「<tên bạn>です。よろしくおねがいします。」',
          'Suốt buổi: nhìn vào giám thị khi nói, không nhìn xuống bàn. Không hiểu thì hỏi lại 「もういちど おねがいします」(mou ichido onegai shimasu — xin nhắc lại).',
        ],
      },
      {
        type: 'tip',
        h: 'Ba câu cứu nguy khi bí',
        body:
          '「すみません、もういちど おねがいします」 — xin lỗi, nhắc lại giúp em. · ' +
          '「ちょっと まってください」 — chờ em một chút. · ' +
          '「わかりません」 — em không hiểu. Nói được ba câu này BẰNG TIẾNG NHẬT còn hơn im lặng hoặc chuyển sang tiếng Việt.',
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd1-speak-profile': {
    goal: 'Có sẵn 5 câu về bản thân, thuộc lòng, dùng được cho phần lớn câu hỏi TALKING.',
    parts: [
      {
        type: 'text',
        h: 'Dùng ô Hồ sơ trên chính trang này',
        body:
          'Mở tab "Thi nói & đọc" → phần "Hồ sơ thi nói" ở đầu. Điền tên, quốc tịch, nghề, tuổi, sinh nhật, ' +
          'sở thích, giờ dậy, phương tiện đi học. Trang sẽ tự ghép hồ sơ của bạn vào 22 câu hỏi mẫu và ' +
          'sinh ra câu trả lời tiếng Nhật hoàn chỉnh — bạn chỉ việc học thuộc.',
      },
      {
        type: 'examples',
        h: '5 câu cốt lõi (thay phần trong ngoặc bằng thông tin của bạn)',
        items: [
          {
            jp: '私は 〈クオン〉です。',
            read: 'わたしは クオンです',
            romaji: 'watashi wa Kuon desu',
            vi: 'Tôi là Cường.',
            note: 'Tên tiếng Việt viết bằng katakana — tra bảng tên trong tab "Thi nói & đọc". Cường = クオン.',
          },
          {
            jp: '私は ベトナム人です。',
            read: 'わたしは ベトナムじんです',
            romaji: 'watashi wa betonamujin desu',
            vi: 'Tôi là người Việt Nam.',
            note: 'Tên nước + 人 (じん) = người nước đó.',
          },
          {
            jp: '私は 学生です。/ 会社員です。',
            read: 'がくせいです / かいしゃいんです',
            romaji: 'gakusei desu / kaishain desu',
            vi: 'Tôi là sinh viên. / Tôi là nhân viên công ty.',
          },
          {
            jp: '〈二十〉歳です。',
            read: 'はたちです',
            romaji: 'hatachi desu',
            vi: 'Tôi 20 tuổi.',
            note: '20 tuổi là はたち — bất quy tắc hoàn toàn, không đọc "nijuusai".',
          },
          {
            jp: '〈音楽〉が 好きです。',
            read: 'おんがくが すきです',
            romaji: 'ongaku ga suki desu',
            vi: 'Tôi thích âm nhạc.',
            note: 'Mẫu 〈danh từ〉が好きです dùng được cho mọi câu hỏi về sở thích.',
          },
        ],
      },
      {
        type: 'tip',
        h: 'Học thuộc kiểu nào cho vào đầu',
        body:
          'Đừng đọc thầm. Nói TO cả 5 câu, 5 lượt, như đang trả lời thật. Sau đó úp giấy xuống và tự hỏi ' +
          'mình bằng tiếng Việt ("tên gì?", "mấy tuổi?") rồi bật ra câu tiếng Nhật. Bật được không cần nghĩ ' +
          'mới tính là thuộc.',
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd1-speak-read12': {
    goal: 'Đọc trôi hai bài dễ nhất, đúng nhịp và đúng trường âm.',
    parts: [
      {
        type: 'steps',
        h: 'Quy trình 5 lượt cho mỗi bài',
        items: [
          'Lượt 1 — đọc chậm, nhìn romaji, dừng ở mọi chữ chưa chắc. Mục tiêu là ĐÚNG, không phải nhanh.',
          'Lượt 2 — vẫn nhìn romaji, đọc liền mạch hơn, chú ý っ và trường âm.',
          'Lượt 3 — che romaji, chỉ nhìn bản tiếng Nhật. Vấp chỗ nào thì mở romaji xem lại đúng chỗ đó.',
          'Lượt 4 — đọc to như đang thi, có ngắt câu ở dấu 、và dấu 。',
          'Lượt 5 — thu âm bằng điện thoại rồi nghe lại. Bạn sẽ tự nghe ra chỗ nuốt nhịp.',
        ],
      },
      {
        type: 'warn',
        h: 'Hai chỗ vấp nhiều nhất trong bài 1-2',
        body:
          '二十歳 đọc はたち (không phải "nijuusai") · オーストラリア có hai chỗ kéo dài (オー và ーラ) nên ' +
          'dài 7 nhịp. Đọc thiếu nhịp ở hai chỗ này là mất điểm phát âm.',
      },
      {
        type: 'tip',
        h: 'Ngắt câu ở đâu',
        body:
          'Dấu 、 (phẩy) = nghỉ ngắn. Dấu 。 (chấm tròn) = nghỉ dài, hạ giọng. Sau trợ từ は cũng nên ' +
          'nghỉ nhẹ — nó giúp giám thị nghe rõ cấu trúc câu và giúp bạn không bị hụt hơi.',
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd1-check-quiz': {
    goal: 'Đo xem kana đã thật sự vào đầu chưa, và tìm đúng chỗ hổng để vá.',
    parts: [
      {
        type: 'steps',
        h: 'Làm thế nào cho có ích',
        items: [
          'Làm hết một lượt, KHÔNG tra bảng giữa chừng — tra thì kết quả vô nghĩa.',
          'Chấm xong, ghi ra giấy những chữ sai.',
          'Với mỗi chữ sai: quay lại đúng bài học chứa nó, đọc lại phần đó, viết chữ đó 10 lần.',
          'Làm lại quiz lần hai. Đạt 90% trở lên mới coi là xong ngày 1.',
        ],
      },
      {
        type: 'tip',
        h: 'Sai bao nhiêu là bình thường',
        body:
          'Lần đầu sai 10-15 chữ là chuyện thường sau một ngày học. Vấn đề không phải sai bao nhiêu mà là ' +
          'có quay lại vá đúng chỗ sai hay không.',
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd1-drill-kana': {
    goal: 'Chuyển từ "nhớ ra được" sang "phản xạ" — mục tiêu là tốc độ, không phải độ đúng.',
    parts: [
      {
        type: 'text',
        h: 'Vì sao cần luyện gõ chứ không chỉ đọc',
        body:
          'Đọc bảng thì bạn có thời gian nghĩ. Trong phòng thi và khi đọc to thì không. Khu "Luyện gõ chữ" ' +
          'trên trang này bắt bạn ra âm ngay, và nó đếm chữ nào bạn hay sai để bốc lại chữ đó nhiều hơn.',
      },
      {
        type: 'steps',
        h: 'Cách chạy',
        items: [
          'Vào tab "Luyện gõ chữ" → chọn bộ hiragana 46 → làm một vòng 20 câu.',
          'Sang bộ hiragana biến âm (58 chữ) → một vòng.',
          'Sang katakana 46 → một vòng, rồi katakana biến âm.',
          'Xem bảng "chữ hay sai nhất" ở cuối, chép 5 chữ đầu ra giấy, viết mỗi chữ 10 lần.',
          'Chạy lại bộ nào vừa dưới 90%.',
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd1-check-blank': {
    goal: 'Nghiệm thu ngày 1: viết được cả hai bảng ra giấy trắng, không nhìn gì.',
    parts: [
      {
        type: 'steps',
        h: 'Cách tự kiểm nghiêm túc',
        items: [
          'Lấy tờ giấy trắng, kẻ lưới 10 hàng × 5 cột.',
          'Viết hiragana từ trí nhớ theo thứ tự あ か さ た な は ま や ら わ. Bỏ trống ô nào không nhớ.',
          'Làm tương tự với katakana ở mặt sau.',
          'Đối chiếu với bảng trong tab "Bảng tra cứu". Đếm số ô trống + số ô sai.',
          'Dưới 5 lỗi mỗi bảng = đạt, sang ngày 2. Trên 5 lỗi = học lại đúng những hàng đó rồi kiểm lại.',
        ],
      },
      {
        type: 'tip',
        h: 'Nếu hết ngày mà vẫn chưa đạt',
        body:
          'Đừng ở lại ngày 1 quá lâu. Kana sẽ tiếp tục ngấm trong lúc bạn học số và ngữ pháp ở ngày 2-3, ' +
          'vì mọi thứ đều viết bằng kana. Sang ngày 2 và mỗi sáng dành 10 phút chạy lại "Luyện gõ chữ".',
      },
    ],
  },
};
