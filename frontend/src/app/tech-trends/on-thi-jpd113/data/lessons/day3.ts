/**
 * NGÀY 3 — Ngữ pháp & trợ từ.
 *
 * Dạng "điền chỗ trống" chiếm ~70% đề FE, và phần lớn chỗ trống đó là TRỢ TỪ.
 * Nên ngày này đáng giá hơn mọi ngày khác về mặt điểm trắc nghiệm.
 */

import type { LessonMap } from './types';

export const DAY3_LESSONS: LessonMap = {
  /* ─────────────────────────────────────────────── */
  'd3-part-wa': {
    goal: 'Đặt đúng は · の · も · か — bốn trợ từ dựng nên toàn bộ câu tự giới thiệu.',
    parts: [
      {
        type: 'text',
        h: 'Trợ từ là gì và vì sao tiếng Việt không có',
        body:
          'Tiếng Việt phân vai bằng THỨ TỰ từ ("tôi ăn cơm" khác "cơm ăn tôi"). Tiếng Nhật phân vai bằng ' +
          'TRỢ TỪ — một chữ nhỏ đứng NGAY SAU danh từ để nói danh từ đó đóng vai gì. Vì thế thứ tự có thể ' +
          'đảo, nhưng trợ từ thì không được sai. Đó cũng là lý do đề thi cho điền chỗ trống chỗ trợ từ.',
      },
      {
        type: 'table',
        h: 'Bộ tứ nền tảng',
        headers: ['Trợ từ', 'Đọc', 'Nhiệm vụ', 'Dịch thô'],
        rows: [
          ['は', 'WA', 'đánh dấu CHỦ ĐỀ của câu', '"còn về… thì"'],
          ['の', 'no', 'nối hai danh từ: sở hữu / thuộc về', '"của"'],
          ['も', 'mo', 'thay chỗ は khi muốn nói "cũng"', '"cũng"'],
          ['か', 'ka', 'đặt CUỐI câu để biến thành câu hỏi', 'dấu "?"'],
        ],
      },
      {
        type: 'examples',
        h: 'は — chủ đề',
        items: [
          {
            jp: '私は 学生です。',
            read: 'わたしは がくせいです',
            romaji: 'watashi wa gakusei desu',
            vi: 'Tôi là sinh viên.',
            note: 'Nhớ: viết chữ は, đọc "wa".',
          },
          {
            jp: '田中さんは 先生です。',
            read: 'たなかさんは せんせいです',
            romaji: 'Tanaka-san wa sensei desu',
            vi: 'Anh Tanaka là giáo viên.',
          },
        ],
      },
      {
        type: 'examples',
        h: 'の — "của", nối danh từ với danh từ',
        items: [
          {
            jp: '私の かばん',
            read: 'わたしの かばん',
            romaji: 'watashi no kaban',
            vi: 'cặp của tôi',
            note: 'Thứ tự NGƯỢC tiếng Việt: sở hữu đứng TRƯỚC. "watashi no kaban" = "tôi CỦA cặp".',
          },
          {
            jp: '日本語の 先生',
            read: 'にほんごの せんせい',
            romaji: 'nihongo no sensei',
            vi: 'giáo viên tiếng Nhật',
          },
          {
            jp: 'これは 私の 本です。',
            read: 'これは わたしの ほんです',
            romaji: 'kore wa watashi no hon desu',
            vi: 'Cái này là sách của tôi.',
          },
        ],
      },
      {
        type: 'examples',
        h: 'も — "cũng", THAY THẾ は chứ không thêm vào',
        items: [
          {
            jp: '私も 学生です。',
            read: 'わたしも がくせいです',
            romaji: 'watashi mo gakusei desu',
            vi: 'Tôi cũng là sinh viên.',
          },
          {
            jp: '私はも 学生です。',
            vi: '(SAI — không được dùng cả は lẫn も)',
            wrong: true,
            note: 'も đứng vào ĐÚNG CHỖ của は. Đây là câu bẫy hay ra đề.',
          },
        ],
      },
      {
        type: 'examples',
        h: 'か — biến câu kể thành câu hỏi',
        items: [
          {
            jp: 'あなたは 学生ですか。',
            read: 'あなたは がくせいですか',
            romaji: 'anata wa gakusei desu ka',
            vi: 'Bạn là sinh viên phải không?',
            note: 'Tiếng Nhật không cần đảo trật tự như tiếng Anh — chỉ thêm か vào cuối. Câu hỏi cũng kết bằng dấu 。chứ không phải "?".',
          },
          {
            jp: 'これは 何ですか。',
            read: 'これは なんですか',
            romaji: 'kore wa nan desu ka',
            vi: 'Cái này là cái gì?',
          },
        ],
      },
      {
        type: 'quiz',
        h: 'Tự kiểm — điền trợ từ',
        items: [
          { q: '私（　）ベトナム人です。', a: 'は — watashi WA betonamujin desu', why: 'Đánh dấu chủ đề.' },
          { q: 'これは 先生（　）本です。', a: 'の — sensei NO hon = sách của thầy' },
          { q: '田中さん（　）学生です。(Tanaka CŨNG là sinh viên)', a: 'も — Tanaka-san MO gakusei desu' },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd3-part-wo': {
    goal: 'Chọn đúng を/に/で/へ — bốn trợ từ bị lẫn nhiều nhất và ra đề nhiều nhất.',
    parts: [
      {
        type: 'table',
        h: 'Phân vai bốn trợ từ',
        headers: ['Trợ từ', 'Đọc', 'Dùng khi nào', 'Câu mẫu'],
        rows: [
          ['を', 'O', 'đánh dấu VẬT BỊ TÁC ĐỘNG (tân ngữ)', 'ごはんを 食べます — ăn cơm'],
          ['に', 'ni', 'ĐÍCH ĐẾN · MỐC THỜI GIAN · nơi TỒN TẠI', '学校に 行きます · 七時に 起きます'],
          ['で', 'de', 'NƠI DIỄN RA hành động · PHƯƠNG TIỆN', '学校で 勉強します · バスで 行きます'],
          ['へ', 'E', 'HƯỚNG đi (gần như thay được cho に)', '日本へ 行きます'],
        ],
      },
      {
        type: 'warn',
        h: 'に và で — chỗ lẫn nhiều nhất cả môn',
        body:
          'Cùng nói về địa điểm nhưng khác vai: に là ĐÍCH bạn đi TỚI hoặc nơi vật TỒN TẠI; で là nơi ' +
          'hành động DIỄN RA. Mẹo phân biệt: động từ 行きます/来ます/帰ります (đi/đến/về) → dùng に. ' +
          'Còn 勉強します/食べます/働きます (làm gì đó tại chỗ) → dùng で.',
      },
      {
        type: 'examples',
        h: 'So sánh cặp đôi để thấy khác biệt',
        items: [
          {
            jp: '学校に 行きます。',
            read: 'がっこうに いきます',
            romaji: 'gakkou NI ikimasu',
            vi: 'Tôi ĐI ĐẾN trường.',
            note: 'Trường là ĐÍCH → に',
          },
          {
            jp: '学校で 勉強します。',
            read: 'がっこうで べんきょうします',
            romaji: 'gakkou DE benkyou shimasu',
            vi: 'Tôi học TẠI trường.',
            note: 'Trường là NƠI DIỄN RA việc học → で',
          },
          {
            jp: '七時に 起きます。',
            read: 'しちじに おきます',
            romaji: 'shichi-ji NI okimasu',
            vi: 'Tôi dậy lúc 7 giờ.',
            note: 'Mốc thời gian cụ thể → に',
          },
          {
            jp: 'バスで 学校へ 行きます。',
            read: 'バスで がっこうへ いきます',
            romaji: 'basu DE gakkou E ikimasu',
            vi: 'Tôi đi đến trường bằng xe buýt.',
            note: 'Một câu có cả で (phương tiện) lẫn へ (hướng) — mẫu câu ra đề rất nhiều.',
          },
        ],
      },
      {
        type: 'tip',
        h: 'に hay へ khi nói hướng đi?',
        body:
          'Ở mức JPD113, hai cái này thay nhau được: 学校に行きます = 学校へ行きます. Đề thường chấp nhận cả ' +
          'hai. Khác biệt nhỏ: に nhấn vào ĐÍCH, へ nhấn vào HƯỚNG. Đừng mất thời gian phân vân — chọn に ' +
          'nếu không chắc.',
      },
      {
        type: 'warn',
        h: 'Thời gian nào KHÔNG có に',
        body:
          'Mốc giờ/ngày cụ thể thì có に (七時に, 日曜日に). Nhưng những từ thời gian tương đối thì KHÔNG: ' +
          '今日 (hôm nay), 明日 (ngày mai), 毎日 (mỗi ngày), 今 (bây giờ) — nói thẳng, không thêm に. ' +
          'Đây là câu bẫy có thật trong đề.',
      },
      {
        type: 'quiz',
        h: 'Tự kiểm',
        items: [
          { q: '図書館（　）本を 読みます。', a: 'で — đọc sách TẠI thư viện', why: 'Hành động diễn ra ở đó → で.' },
          { q: '日本（　）行きます。', a: 'に hoặc へ — đi đến Nhật', why: 'Đích/hướng → に hoặc へ đều được.' },
          { q: '毎日（　）勉強します。', a: 'KHÔNG điền gì — 毎日 勉強します', why: '毎日 là thời gian tương đối, không đi với に.' },
          { q: 'コーヒー（　）飲みます。', a: 'を — uống cà phê', why: 'Cà phê là vật bị tác động → を.' },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd3-part-to': {
    goal: 'Dùng được と, や…など, から…まで để nói câu dài hơn "A là B".',
    parts: [
      {
        type: 'table',
        h: 'Ba nhóm',
        headers: ['Mẫu', 'Nghĩa', 'Câu mẫu'],
        rows: [
          ['A と B', '"A và B" — liệt kê ĐẦY ĐỦ', 'パンと たまごを 食べます — ăn bánh mì và trứng'],
          ['A や B など', '"A, B v.v." — liệt kê KHÔNG đầy đủ', 'パンや たまごなどを 食べます'],
          ['A から B まで', 'từ A đến B (thời gian hoặc nơi chốn)', '九時から 四時まで — từ 9h đến 4h'],
          ['〜と いっしょに', 'cùng với ai đó', '友達と いっしょに 行きます — đi cùng bạn'],
        ],
      },
      {
        type: 'examples',
        h: 'と và や khác nhau ở đâu',
        items: [
          {
            jp: '教室に つくえと いすが あります。',
            read: 'きょうしつに つくえと いすが あります',
            romaji: 'kyoushitsu ni tsukue TO isu ga arimasu',
            vi: 'Trong lớp có bàn và ghế (chỉ có hai thứ đó).',
          },
          {
            jp: '教室に つくえや いすなどが あります。',
            read: 'きょうしつに つくえや いすなどが あります',
            romaji: 'kyoushitsu ni tsukue YA isu NADO ga arimasu',
            vi: 'Trong lớp có bàn, ghế v.v. (còn thứ khác nữa).',
            note: 'や luôn đi cặp với など ở cuối. Đề hay hỏi đúng cặp này.',
          },
        ],
      },
      {
        type: 'examples',
        h: 'から…まで — dùng cho cả giờ lẫn nơi chốn',
        items: [
          {
            jp: '授業は 九時から 四時までです。',
            read: 'じゅぎょうは くじから よじまでです',
            romaji: 'jugyou wa ku-ji kara yo-ji made desu',
            vi: 'Tiết học từ 9 giờ đến 4 giờ.',
          },
          {
            jp: '家から 学校まで バスで 行きます。',
            read: 'いえから がっこうまで バスで いきます',
            romaji: 'ie kara gakkou made basu de ikimasu',
            vi: 'Từ nhà đến trường tôi đi xe buýt.',
          },
          {
            jp: 'ベトナムから 来ました。',
            read: 'ベトナムから きました',
            romaji: 'betonamu kara kimashita',
            vi: 'Tôi đến từ Việt Nam.',
            note: 'Câu này bạn sẽ dùng khi thi nói.',
          },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd3-kore': {
    goal: 'Không còn lẫn これ / この / ここ — ba bộ giống nhau đến khó chịu nhưng có quy tắc cứng.',
    parts: [
      {
        type: 'text',
        h: 'Ba bộ, một quy tắc',
        body:
          'Tiếng Nhật chia khoảng cách làm ba: こ = gần NGƯỜI NÓI · そ = gần NGƯỜI NGHE · あ = xa cả hai. ' +
          'Ba bộ khác nhau ở CHỖ ĐỨNG trong câu chứ không khác về nghĩa khoảng cách.',
      },
      {
        type: 'table',
        h: 'Bảng ba bộ',
        headers: ['Loại', 'gần tôi', 'gần bạn', 'xa cả hai', 'Đứng thế nào'],
        rows: [
          ['Vật (đứng MỘT MÌNH)', 'これ', 'それ', 'あれ', 'これは 本です — Cái này là sách'],
          ['Bổ nghĩa (phải có danh từ SAU)', 'この', 'その', 'あの', 'この 本 — quyển sách này'],
          ['Nơi chốn', 'ここ', 'そこ', 'あそこ', 'ここは 教室です — Đây là lớp học'],
          ['Từ để hỏi', 'どれ', 'どの', 'どこ', 'どれですか / どの本 / どこですか'],
        ],
      },
      {
        type: 'warn',
        h: 'Lỗi kinh điển: これ本 là SAI',
        body:
          'これ đứng MỘT MÌNH, không được kèm danh từ. Muốn nói "quyển sách này" phải dùng この本. ' +
          'Nhớ mẹo: chữ nào kết thúc bằng れ thì đứng một mình; chữ nào kết thúc bằng の thì phải có ' +
          'danh từ theo sau (の "dính" vào danh từ).',
      },
      {
        type: 'examples',
        h: 'Câu mẫu — so sánh trực tiếp',
        items: [
          {
            jp: 'これは 私の かばんです。',
            read: 'これは わたしの かばんです',
            romaji: 'kore wa watashi no kaban desu',
            vi: 'Cái này là cặp của tôi.',
          },
          {
            jp: 'この かばんは 私のです。',
            read: 'この かばんは わたしのです',
            romaji: 'kono kaban wa watashi no desu',
            vi: 'Cái cặp này là của tôi.',
            note: 'Cùng một ý, hai cách nói. Để ý 私の đứng cuối cũng được — の thay cho cả cụm "cái của tôi".',
          },
          {
            jp: 'これ かばんは 私です。',
            vi: '(SAI — これ không được kèm danh từ)',
            wrong: true,
          },
          {
            jp: 'トイレは どこですか。',
            read: 'トイレは どこですか',
            romaji: 'toire wa doko desu ka',
            vi: 'Nhà vệ sinh ở đâu?',
            note: 'Câu hỏi thực dụng nhất cả môn.',
          },
        ],
      },
      {
        type: 'quiz',
        h: 'Tự kiểm',
        items: [
          { q: '（　）は 何ですか。(chỉ vật trong tay mình)', a: 'これ — kore wa nan desu ka' },
          { q: '（　）人は 先生です。(chỉ người ở xa)', a: 'あの — ano hito wa sensei desu', why: 'Có danh từ 人 theo sau → dùng bộ の.' },
          { q: '教室は （　）ですか。', a: 'どこ — kyoushitsu wa doko desu ka', why: 'Hỏi nơi chốn.' },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd3-question-words': {
    goal: 'Nghe ra câu hỏi và biết ngay giám thị đang hỏi cái gì — quan trọng hơn cả việc tự đặt câu hỏi.',
    parts: [
      {
        type: 'table',
        h: '6 từ để hỏi cốt lõi',
        headers: ['Từ hỏi', 'Đọc', 'Hỏi cái gì', 'Câu mẫu'],
        rows: [
          ['何', 'なに / なん', 'cái gì', 'これは 何ですか — Cái này là gì?'],
          ['誰', 'だれ', 'ai', 'あの人は 誰ですか — Người kia là ai?'],
          ['どこ', 'doko', 'ở đâu', 'トイレは どこですか'],
          ['いつ', 'itsu', 'khi nào', '誕生日は いつですか'],
          ['いくら', 'ikura', 'bao nhiêu tiền', 'これは いくらですか'],
          ['どう / どんな', 'dou / donna', 'thế nào / loại nào', '日本語は どうですか — Tiếng Nhật thế nào?'],
        ],
      },
      {
        type: 'text',
        h: '何 đọc なに hay なん?',
        body:
          'Đứng một mình hoặc trước trợ từ を/が thì đọc なに (何を しますか). Đứng trước です hoặc ' +
          'trước một đơn vị đếm thì đọc なん (何ですか, 何時, 何人, 何曜日). Quy tắc thô: nếu ngay sau nó là ' +
          'âm t/d/n thì đọc なん.',
      },
      {
        type: 'tip',
        h: 'Mẹo suy ngược khi làm trắc nghiệm',
        body:
          'Nhìn ĐÁP ÁN trước rồi suy ngược ra từ hỏi. Đáp án là con số tiền → いくら. Đáp án là giờ → 何時. ' +
          'Đáp án là tên người → 誰. Đáp án là địa điểm → どこ. Cách này giải được phần lớn câu hỏi dạng ' +
          '"chọn từ hỏi phù hợp" mà không cần hiểu hết câu.',
      },
      {
        type: 'examples',
        h: 'Cặp hỏi–đáp hay ra đề',
        items: [
          { jp: 'お名前は 何ですか。→ クオンです。', read: 'おなまえは なんですか', vi: 'Tên bạn là gì? → Cường.' },
          { jp: '今 何時ですか。→ 四時です。', read: 'いま なんじですか', vi: 'Mấy giờ rồi? → 4 giờ.' },
          { jp: '誕生日は いつですか。→ 四月八日です。', read: 'たんじょうびは いつですか', vi: 'Sinh nhật khi nào? → 8/4.' },
          { jp: 'ご家族は 何人ですか。→ 四人です。', read: 'ごかぞくは なんにんですか', vi: 'Gia đình mấy người? → 4 người.' },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd3-masu': {
    goal: 'Chia đúng 4 dạng của thể ます — chỉ cần đổi đuôi, không cần chia theo ngôi.',
    parts: [
      {
        type: 'text',
        h: 'Tin tốt: tiếng Nhật không chia theo ngôi',
        body:
          'Không có "I go / he goes". 行きます dùng cho tôi, bạn, anh ấy, họ — y hệt nhau. Bạn chỉ cần ' +
          'đổi đuôi theo THỜI (hiện tại/quá khứ) và theo KHẲNG ĐỊNH/PHỦ ĐỊNH. Bốn dạng, hết.',
      },
      {
        type: 'table',
        h: '4 dạng — lấy 行きます (đi) làm mẫu',
        headers: ['Dạng', 'Đuôi', 'Ví dụ', 'Nghĩa'],
        rows: [
          ['Hiện tại / tương lai — khẳng định', '〜ます', '行きます ikimasu', 'đi / sẽ đi'],
          ['Hiện tại / tương lai — phủ định', '〜ません', '行きません ikimasen', 'không đi'],
          ['Quá khứ — khẳng định', '〜ました', '行きました ikimashita', 'đã đi'],
          ['Quá khứ — phủ định', '〜ませんでした', '行きませんでした ikimasen deshita', 'đã không đi'],
        ],
        note: 'Bốn đuôi này áp cho MỌI động từ thể ます. Học một lần dùng cả đời.',
      },
      {
        type: 'table',
        h: 'Áp thử vào các động từ khác',
        headers: ['Động từ', 'Phủ định', 'Quá khứ', 'Quá khứ phủ định'],
        rows: [
          ['食べます (ăn)', '食べません', '食べました', '食べませんでした'],
          ['飲みます (uống)', '飲みません', '飲みました', '飲みませんでした'],
          ['します (làm)', 'しません', 'しました', 'しませんでした'],
          ['来ます (đến)', '来ません', '来ました', '来ませんでした'],
        ],
      },
      {
        type: 'text',
        h: 'Danh từ + です cũng có 4 dạng tương tự',
        body:
          'です (là) đi theo bộ riêng: です → じゃありません (không phải) → でした (đã là) → ' +
          'じゃありませんでした (đã không phải). Ví dụ: 学生です → 学生じゃありません (không phải sinh viên).',
      },
      {
        type: 'examples',
        h: 'Câu mẫu bốn dạng',
        items: [
          { jp: '毎日 日本語を 勉強します。', read: 'まいにち にほんごを べんきょうします', vi: 'Mỗi ngày tôi học tiếng Nhật.' },
          { jp: '肉を 食べません。', read: 'にくを たべません', vi: 'Tôi không ăn thịt.' },
          { jp: '昨日 学校へ 行きました。', read: 'きのう がっこうへ いきました', vi: 'Hôm qua tôi đã đến trường.' },
          { jp: '昨日 勉強しませんでした。', read: 'きのう べんきょうしませんでした', vi: 'Hôm qua tôi đã không học.' },
        ],
      },
      {
        type: 'quiz',
        h: 'Tự kiểm — chia động từ',
        items: [
          { q: '飲みます → quá khứ khẳng định', a: '飲みました nomimashita — đã uống' },
          { q: '行きます → quá khứ phủ định', a: '行きませんでした ikimasen deshita — đã không đi' },
          { q: '学生です → phủ định', a: '学生じゃありません gakusei ja arimasen — không phải sinh viên' },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd3-verbs-20': {
    goal: 'Thuộc 20 động từ kèm ĐÚNG trợ từ đi với nó — học rời động từ mà không có trợ từ thì vào đề vẫn sai.',
    parts: [
      {
        type: 'text',
        h: 'Học động từ theo CỤM, không học chữ rời',
        body:
          'Đề không hỏi "ăn tiếng Nhật là gì" — đề cho câu thiếu trợ từ. Nên phải nhớ "ごはんを食べます" ' +
          'nguyên cụm, chứ nhớ mỗi 食べます thì đến lúc điền vẫn phân vân を hay に.',
      },
      {
        type: 'table',
        h: '20 động từ + trợ từ đi kèm',
        headers: ['Động từ', 'Đọc', 'Nghĩa', 'Đi với trợ từ'],
        rows: [
          ['行きます', 'いきます', 'đi', '〜に / 〜へ 行きます'],
          ['来ます', 'きます', 'đến', '〜に / 〜へ 来ます · 〜から 来ました'],
          ['帰ります', 'かえります', 'về', '家に 帰ります'],
          ['食べます', 'たべます', 'ăn', '〜を 食べます'],
          ['飲みます', 'のみます', 'uống', '〜を 飲みます'],
          ['見ます', 'みます', 'xem, nhìn', '〜を 見ます'],
          ['聞きます', 'ききます', 'nghe, hỏi', '〜を 聞きます'],
          ['読みます', 'よみます', 'đọc', '〜を 読みます'],
          ['書きます', 'かきます', 'viết', '〜を 書きます'],
          ['話します', 'はなします', 'nói chuyện', '〜と 話します'],
          ['勉強します', 'べんきょうします', 'học tập', '〜を 勉強します · 〜で 勉強します'],
          ['働きます', 'はたらきます', 'làm việc', '〜で 働きます'],
          ['起きます', 'おきます', 'thức dậy', '〜時に 起きます'],
          ['寝ます', 'ねます', 'đi ngủ', '〜時に 寝ます'],
          ['買います', 'かいます', 'mua', '〜を 買います'],
          ['します', 'します', 'làm', '〜を します'],
          ['あります', 'あります', 'có (vật)', '〜に 〜が あります'],
          ['います', 'います', 'có (người, vật sống)', '〜に 〜が います'],
          ['分かります', 'わかります', 'hiểu', '〜が 分かります'],
          ['好きです', 'すきです', 'thích', '〜が 好きです'],
        ],
      },
      {
        type: 'warn',
        h: 'Bốn cái dùng が chứ không dùng を',
        body:
          'あります · います · 分かります · 好きです — bốn cái này đi với が, không phải を. ' +
          '「日本語が 分かります」(hiểu tiếng Nhật) · 「音楽が 好きです」(thích âm nhạc). Đây là bẫy điền trợ từ ' +
          'hay gặp nhất, vì tiếng Việt dịch ra đều thấy giống tân ngữ.',
      },
      {
        type: 'warn',
        h: 'あります hay います?',
        body:
          'あります dùng cho VẬT VÔ TRI (bàn, sách, tiền). います dùng cho NGƯỜI và ĐỘNG VẬT. ' +
          '「机が あります」(có cái bàn) · 「先生が います」(có thầy giáo). Cây cối tính là vô tri → あります.',
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd3-doko-mo': {
    goal: 'Hiểu mẫu "từ hỏi + も + phủ định" — cấu trúc trông lạ nhưng ra đề đều.',
    parts: [
      {
        type: 'text',
        h: 'Công thức',
        body:
          'Ghép TỪ HỎI + も rồi kết câu bằng PHỦ ĐỊNH thì nghĩa thành "không… gì cả / không… đâu cả". ' +
          'Bắt buộc phải có phủ định ở cuối, thiếu là sai ngữ pháp.',
      },
      {
        type: 'table',
        h: 'Bốn mẫu hay gặp',
        headers: ['Mẫu', 'Nghĩa', 'Câu mẫu'],
        rows: [
          ['何も + phủ định', 'không gì cả', '何も 食べません — không ăn gì cả'],
          ['どこも + phủ định', 'không đâu cả', 'どこも 行きません — không đi đâu cả'],
          ['誰も + phủ định', 'không ai cả', '誰も いません — không có ai cả'],
          ['いつも', 'luôn luôn (KHÔNG cần phủ định)', 'いつも 七時に 起きます — luôn dậy lúc 7 giờ'],
        ],
        dangerRows: [3],
        note: 'いつも là ngoại lệ: nó nghĩa "luôn luôn" và đi với câu khẳng định bình thường.',
      },
      {
        type: 'examples',
        h: 'Câu mẫu',
        items: [
          {
            jp: '日曜日は どこも 行きません。',
            read: 'にちようびは どこも いきません',
            romaji: 'nichi-youbi wa doko mo ikimasen',
            vi: 'Chủ Nhật tôi không đi đâu cả.',
          },
          {
            jp: '朝ごはんは 何も 食べませんでした。',
            read: 'あさごはんは なにも たべませんでした',
            romaji: 'asagohan wa nani mo tabemasen deshita',
            vi: 'Bữa sáng tôi đã không ăn gì cả.',
          },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────────────── */
  'd3-speak-group23': {
    goal: 'Trả lời được nhóm câu hỏi về giờ giấc và cảm nhận — phần chiếm nhiều thời lượng nhất khi thi nói.',
    parts: [
      {
        type: 'examples',
        h: 'Nhóm giờ giấc & sinh hoạt',
        items: [
          {
            jp: '毎日 何時に 起きますか。→ 六時に 起きます。',
            read: 'まいにち なんじに おきますか → ろくじに おきます',
            vi: 'Mỗi ngày bạn dậy lúc mấy giờ? → Tôi dậy lúc 6 giờ.',
            note: 'Để ý: 毎日 không có に, nhưng 六時 thì có.',
          },
          {
            jp: '何で 学校へ 行きますか。→ バスで 行きます。',
            read: 'なんで がっこうへ いきますか → バスで いきます',
            vi: 'Bạn đến trường bằng gì? → Bằng xe buýt.',
          },
          {
            jp: '何時に 寝ますか。→ 十一時に 寝ます。',
            read: 'なんじに ねますか → じゅういちじに ねます',
            vi: 'Bạn ngủ lúc mấy giờ? → 11 giờ.',
          },
        ],
      },
      {
        type: 'examples',
        h: 'Nhóm cảm nhận & sở thích',
        items: [
          {
            jp: '日本語は どうですか。→ 難しいですが、おもしろいです。',
            read: 'にほんごは どうですか → むずかしいですが、おもしろいです',
            vi: 'Tiếng Nhật thế nào? → Khó nhưng thú vị.',
            note: 'Mẫu 「〜ですが、〜です」(… nhưng …) làm câu trả lời dài và tự nhiên hơn hẳn — dùng được cho mọi câu hỏi cảm nhận.',
          },
          {
            jp: '何が 好きですか。→ 音楽が 好きです。',
            read: 'なにが すきですか → おんがくが すきです',
            vi: 'Bạn thích gì? → Tôi thích âm nhạc.',
            note: 'Nhớ が chứ không phải を.',
          },
          {
            jp: '休みの日は 何を しますか。→ 本を 読みます。',
            read: 'やすみのひは なにを しますか → ほんを よみます',
            vi: 'Ngày nghỉ bạn làm gì? → Tôi đọc sách.',
          },
        ],
      },
      {
        type: 'tip',
        h: 'Nguyên tắc trả lời khi thi nói',
        body:
          'Trả lời NGẮN nhưng đủ câu, đừng chỉ nói một từ. Hỏi 何時に起きますか mà đáp "六時" thì mất điểm ' +
          'ngữ pháp; đáp "六時に 起きます" là trọn câu. Nếu thêm được một vế nữa bằng 「〜ですが」thì càng tốt.',
      },
    ],
  },
};
