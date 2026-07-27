// JPD113 — Reading (Đọc hiểu) exam papers for Exam Room.
// Modeled as kind:'FE' (reuses the existing MCQ auto-grade + review pipeline
// unchanged — see project memory for why: Exam/ExamQuestion "kind" is a plain
// unvalidated VARCHAR(10) string but every submit route hardcodes 'FE'/'PE',
// so a brand-new "READING" kind would need new routes; FE gives 100% working
// auto-grade + review for zero backend risk). Each exam = one reading passage.
// `instructions` carries the passage + romaji + translation + kanji notes +
// tips (the "answer key" for self-study); `questions` are comprehension MCQ.
// Đề 1-6 = the 6 passages from the teacher's original doc (kept verbatim,
// source:'REAL'). Đề 7-16 = new passages authored to cover the rest of the
// JPD113 syllabus (source:'SAMPLE').

export default {
  course: { courseCode: 'JPD113' },
  exams: [
    // ═══════════════════ ĐỀ 1 — gốc (さくら日本語学校) ═══════════════════
    {
      kind: 'FE',
      code: 'READ-D1',
      source: 'REAL',
      sortOrder: 100,
      title: 'Reading — Passage 1: A student\'s weekly life (school fees)|||Đọc — Đề 1: Cuộc sống hằng tuần của một học sinh (học phí)',
      description: 'Bài đọc gốc từ giáo viên — tự giới thiệu trường học, học phí, thời khoá biểu, sở thích.',
      durationMinutes: 15,
      totalPoints: 5,
      passMark: 3,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions:
        '<div class="ml-en"><h3>Passage</h3><p>私は　さくら日本語学校の　学生です。まいつき、日本語の　クラスに　83000円を　はらいます。学校の　じゅぎょうは　月曜日と　水曜日に　あります。あさの　九時から　はじまり、十一時に　おわります。土曜日と　日曜日は　じゅぎょうが　ありませんので、ともだちと　600円の　ランチを　たべに　いきます。ピンポンが　ダイスキです。</p>' +
        '<h3>Romaji</h3><p>Watashi wa Sakura Nihongo Gakkō no gakusei desu. Maitsuki, nihongo no kurasu ni hachiman-sanzen-en o haraimasu. Gakkō no jugyō wa getsuyōbi to suiyōbi ni arimasu. Asa no kuji kara hajimari, jūichiji ni owarimasu. Doyōbi to nichiyōbi wa jugyō ga arimasen node, tomodachi to roppyaku-en no ranchi o tabe ni ikimasu. Pinpon ga daisuki desu.</p>' +
        '<h3>Translation</h3><p>I am a student at Sakura Japanese Language School. Every month I pay 83,000 yen for the Japanese class. School classes are on Monday and Wednesday. They start at 9am and end at 11am. Saturday and Sunday have no classes, so I go eat 600-yen lunch with friends. I love ping-pong.</p>' +
        '<h3>Key kanji</h3><ul><li>私 (わたし) — tôi</li><li>日本語 (にほんご) — tiếng Nhật</li><li>学校 (がっこう) — trường học</li><li>月曜日／水曜日／土曜日／日曜日 — các thứ trong tuần</li><li>円 (えん) — yên (tiền)</li></ul></div>' +
        '<div class="ml-vi"><h3>Đoạn văn</h3><p>私は　さくら日本語学校の　学生です。まいつき、日本語の　クラスに　83000円を　はらいます。学校の　じゅぎょうは　月曜日と　水曜日に　あります。あさの　九時から　はじまり、十一時に　おわります。土曜日と　日曜日は　じゅぎょうが　ありませんので、ともだちと　600円の　ランチを　たべに　いきます。ピンポンが　ダイスキです。</p>' +
        '<h3>Phiên âm (romaji)</h3><p>Watashi wa Sakura Nihongo Gakkō no gakusei desu. Maitsuki, nihongo no kurasu ni <b>hachiman-sanzen-en</b> o haraimasu. Gakkō no jugyō wa getsuyōbi to suiyōbi ni arimasu. Asa no kuji kara hajimari, jūichiji ni owarimasu. Doyōbi to nichiyōbi wa jugyō ga arimasen node, tomodachi to <b>roppyaku-en</b> no ranchi o tabe ni ikimasu. Pinpon ga daisuki desu.</p>' +
        '<h3>Dịch nghĩa</h3><p>Tôi là học sinh trường Nhật ngữ Sakura. Mỗi tháng tôi trả 83.000 yên cho lớp tiếng Nhật. Lớp học của trường vào thứ Hai và thứ Tư. Bắt đầu từ 9 giờ sáng, kết thúc lúc 11 giờ. Thứ Bảy và Chủ Nhật không có lớp nên tôi đi ăn trưa 600 yên với bạn bè. Tôi rất thích bóng bàn.</p>' +
        '<h3>Chữ Hán đáng nhớ</h3><ul><li><b>私</b> (わたし) — tôi, kanji xuất hiện nhiều nhất đề thi thật</li><li><b>日本語</b> (にほんご) — tiếng Nhật</li><li><b>学校</b> (がっこう) — trường học</li><li><b>円</b> (えん) — đơn vị tiền yên</li><li><b>月・水・土・日</b> — 4 trong 7 kanji ngày trong tuần</li></ul>' +
        '<h3>Mẹo đọc &amp; lưu ý</h3><p><b>Bẫy số:</b> 83000円 đọc là <b>はちまん さんぜん えん</b> (không phải "8300円"!) — nhớ quy tắc nhóm 4 chữ số (万) đã học ở Chương 3. 600円 = <b>ろっぴゃくえん</b> (biến âm ひゃく→ぴゃく sau ろく). Câu "土曜日と日曜日はじゅぎょうがありませんので" dùng ので (vì) để giải thích lý do — chưa học sâu ở JPD113 nhưng hiểu nghĩa "vì...nên..." là đủ để đọc hiểu.</p></div>',
      questions: [
        {
          kind: 'MCQ', points: 1,
          prompt: '学校の　じゅぎょうは　何曜日に　ありますか。|||Lớp học của trường vào (những) thứ nào?',
          options: [
            { text: '月曜日と　水曜日|||Thứ Hai và thứ Tư' },
            { text: '火曜日と　木曜日|||Thứ Ba và thứ Năm' },
            { text: '土曜日と　日曜日|||Thứ Bảy và Chủ Nhật' },
            { text: '月曜日と　金曜日|||Thứ Hai và thứ Sáu' },
          ],
          correctIndexes: [0],
          explanation: 'The passage says "学校のじゅぎょうは月曜日と水曜日にあります" — classes are Monday and Wednesday.|||Câu "学校のじゅぎょうは月曜日と水曜日にあります" nói rõ lớp học vào thứ Hai và thứ Tư.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'じゅぎょうは　何時に　はじまりますか。|||Lớp học bắt đầu lúc mấy giờ?',
          options: [
            { text: '8時|||8 giờ' },
            { text: '9時|||9 giờ' },
            { text: '10時|||10 giờ' },
            { text: '11時|||11 giờ' },
          ],
          correctIndexes: [1],
          explanation: '"あさの九時からはじまり" = starts from 9am.|||"あさの九時からはじまり" = bắt đầu từ 9 giờ sáng. Chú ý: 11時 là giờ KẾT THÚC (おわります), không phải giờ bắt đầu.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: '一か月の　じゅぎょう料は　いくらですか。|||Học phí một tháng là bao nhiêu?',
          options: [
            { text: '8,300円|||8.300 yên' },
            { text: '83,000円|||83.000 yên' },
            { text: '38,000円|||38.000 yên' },
            { text: '830,000円|||830.000 yên' },
          ],
          correctIndexes: [1],
          explanation: '83000円 = はちまんさんぜんえん. This is the #1 trap in this passage — read the digit grouping carefully.|||83000円 = はちまんさんぜんえん. Đây là bẫy số 1 của bài — đọc kỹ cách nhóm chữ số, đừng nhầm 8.300 hay 830.000.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: '週末（しゅうまつ）、友達と何をしますか。|||Cuối tuần, người này làm gì với bạn?',
          options: [
            { text: '600円のランチを食べる|||Ăn trưa 600 yên' },
            { text: '日本語を勉強する|||Học tiếng Nhật' },
            { text: '買い物をする|||Đi mua sắm' },
            { text: '旅行する|||Đi du lịch' },
          ],
          correctIndexes: [0],
          explanation: '"ともだちと600円のランチをたべにいきます" — goes to eat a 600-yen lunch with friends.|||"ともだちと600円のランチをたべにいきます" — đi ăn trưa 600 yên với bạn bè vào cuối tuần (vì không có lớp).',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'この人の　しゅみは　何ですか。|||Sở thích của người này là gì?',
          options: [
            { text: 'サッカー|||Bóng đá' },
            { text: 'ピンポン|||Bóng bàn' },
            { text: 'どくしょ|||Đọc sách' },
            { text: 'おんがく|||Âm nhạc' },
          ],
          correctIndexes: [1],
          explanation: '"ピンポンがダイスキです" = loves ping-pong.|||"ピンポンがダイスキです" = rất thích bóng bàn (ダイスキ = だいすき, viết katakana để nhấn mạnh).',
        },
      ],
    },

    // ═══════════════════ ĐỀ 2 — gốc (Australia, part-time job) ═══════════════════
    {
      kind: 'FE',
      code: 'READ-D2',
      source: 'REAL',
      sortOrder: 101,
      title: 'Reading — Passage 2: An Australian student\'s schedule|||Đọc — Đề 2: Thời khoá biểu của một du học sinh Úc',
      description: 'Bài đọc gốc — quốc tịch, giờ học, hoạt động cuối tuần, việc làm thêm.',
      durationMinutes: 15,
      totalPoints: 5,
      passMark: 3,
      isPublished: true,
      instructions:
        '<div class="ml-en"><h3>Passage</h3><p>私は　日本語学校の　学生です。オーストラリア人です。私の　日本語の　クラスは　月曜日と　水曜日に　あります。まいかい、九時から　十時はん　までです。土曜日と　日曜日は　学校が　ありませんので、ともだちと　ときどき　こうえんに　いきます。やすみの　日に　アルバイトを　します。</p>' +
        '<h3>Romaji</h3><p>Watashi wa Nihongo Gakkō no gakusei desu. Ōsutoraria-jin desu. Watashi no nihongo no kurasu wa getsuyōbi to suiyōbi ni arimasu. Maikai, kuji kara jūji-han made desu. Doyōbi to nichiyōbi wa gakkō ga arimasen node, tomodachi to tokidoki kōen ni ikimasu. Yasumi no hi ni arubaito o shimasu.</p>' +
        '<h3>Translation</h3><p>I am a student at a Japanese language school. I am Australian. My Japanese class is on Monday and Wednesday, each time from 9:00 to 10:30. Saturday and Sunday there is no school, so I sometimes go to the park with friends. On days off I do a part-time job.</p>' +
        '<h3>Key kanji</h3><ul><li>人 (じん) — người/quốc tịch</li><li>九・十 — số 9, 10</li><li>休み (やすみ) — nghỉ</li></ul></div>' +
        '<div class="ml-vi"><h3>Đoạn văn</h3><p>私は　日本語学校の　学生です。オーストラリア人です。私の　日本語の　クラスは　月曜日と　水曜日に　あります。まいかい、九時から　十時はん　までです。土曜日と　日曜日は　学校が　ありませんので、ともだちと　ときどき　こうえんに　いきます。やすみの　日に　アルバイトを　します。</p>' +
        '<h3>Phiên âm (romaji)</h3><p>Watashi wa Nihongo Gakkō no gakusei desu. Ōsutoraria-jin desu. Watashi no nihongo no kurasu wa getsuyōbi to suiyōbi ni arimasu. Maikai, <b>kuji kara jūji-han made</b> desu. Doyōbi to nichiyōbi wa gakkō ga arimasen node, tomodachi to tokidoki kōen ni ikimasu. Yasumi no hi ni <b>arubaito</b> o shimasu.</p>' +
        '<h3>Dịch nghĩa</h3><p>Tôi là học sinh trường tiếng Nhật. Tôi là người Úc. Lớp tiếng Nhật của tôi vào thứ Hai và thứ Tư. Mỗi lần từ 9 giờ đến 10 giờ rưỡi. Thứ Bảy và Chủ Nhật trường không có lớp nên tôi thỉnh thoảng đi công viên với bạn. Vào ngày nghỉ tôi làm thêm (アルバイト).</p>' +
        '<h3>Chữ Hán đáng nhớ</h3><ul><li><b>人</b> (じん/ひと) — người, ghép sau tên nước = quốc tịch (オーストラリア<b>人</b>)</li><li><b>九</b>・<b>十</b> — số 9, 10 (く／きゅう, じゅう)</li><li><b>休み</b> (やすみ) — nghỉ, ngày nghỉ</li><li><b>友達</b> (ともだち) — bạn bè</li></ul>' +
        '<h3>Mẹo đọc &amp; lưu ý</h3><p>十時はん = <b>じゅうじはん</b> (10 giờ rưỡi) — はん(半) nghĩa "rưỡi", ghép sau giờ. アルバイト là từ mượn tiếng Đức (Arbeit) qua tiếng Nhật, nghĩa "việc làm thêm" — từ vựng rất hay gặp trong bài đọc thật dù không thuộc bảng chữ chính khoá JPD113.</p></div>',
      questions: [
        {
          kind: 'MCQ', points: 1,
          prompt: 'この人は　何人ですか。|||Người này là người nước nào?',
          options: [{ text: 'アメリカ人|||Người Mỹ' }, { text: 'オーストラリア人|||Người Úc' }, { text: 'イギリス人|||Người Anh' }, { text: 'ドイツ人|||Người Đức' }],
          correctIndexes: [1],
          explanation: '"オーストラリア人です" — is Australian.|||"オーストラリア人です" — là người Úc, nói ngay sau câu tự giới thiệu là học sinh.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'クラスは　何時から　何時までですか。|||Lớp học từ mấy giờ đến mấy giờ?',
          options: [{ text: '8時から9時まで|||8h-9h' }, { text: '9時から10時はんまで|||9h-10h30' }, { text: '9時から11時まで|||9h-11h' }, { text: '10時から11時はんまで|||10h-11h30' }],
          correctIndexes: [1],
          explanation: '"九時から十時はんまでです" = 9:00 to 10:30.|||"九時から十時はんまでです" = từ 9 giờ đến 10 giờ 30.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: '土曜日と　日曜日、ともだちと　どこへ　いきますか。|||Thứ Bảy Chủ Nhật đi đâu với bạn?',
          options: [{ text: 'がっこう|||trường học' }, { text: 'こうえん|||công viên' }, { text: 'としょかん|||thư viện' }, { text: 'デパート|||trung tâm thương mại' }],
          correctIndexes: [1],
          explanation: '"ともだちとときどきこうえんにいきます" — sometimes goes to the park.|||"ともだちとときどきこうえんにいきます" — thỉnh thoảng đi công viên với bạn.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'やすみの　日に　何を　しますか。|||Vào ngày nghỉ, người này làm gì?',
          options: [{ text: 'べんきょうします|||Học bài' }, { text: 'アルバイトをします|||Làm thêm' }, { text: 'りょうりをします|||Nấu ăn' }, { text: 'テレビをみます|||Xem TV' }],
          correctIndexes: [1],
          explanation: '"やすみの日にアルバイトをします" — does a part-time job on days off.|||"やすみの日にアルバイトをします" — làm thêm vào ngày nghỉ.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'クラスは　何曜日に　ありますか。|||Lớp học vào (những) thứ nào?',
          options: [{ text: '月・水|||Thứ Hai, Thứ Tư' }, { text: '火・木|||Thứ Ba, Thứ Năm' }, { text: '土・日|||Thứ Bảy, Chủ Nhật' }, { text: '水・金|||Thứ Tư, Thứ Sáu' }],
          correctIndexes: [0],
          explanation: '"クラスは月曜日と水曜日にあります" — same days as Passage 1, good pattern to memorize.|||"クラスは月曜日と水曜日にあります" — giống mẫu ở Đề 1, một khuôn hay lặp trong đề thi thật.',
        },
      ],
    },

    // ═══════════════════ ĐỀ 3 — gốc (France, Paris) ═══════════════════
    {
      kind: 'FE',
      code: 'READ-D3',
      source: 'REAL',
      sortOrder: 102,
      title: 'Reading — Passage 3: Studying every day in Paris|||Đọc — Đề 3: Học tiếng Nhật mỗi ngày ở Paris',
      description: 'Bài đọc gốc — nơi ở, thời gian học mỗi ngày, sở thích máy tính.',
      durationMinutes: 15,
      totalPoints: 4,
      passMark: 2,
      isPublished: true,
      instructions:
        '<div class="ml-en"><h3>Passage</h3><p>私は　フランスの　パリ―に　すんで　います。まいにち　日本語を　べんきょうして　います。月曜日から　金曜日までは　学校で　べんきょうしますが、土曜日と　日曜日は　いえで　べんきょうします。べんきょうの　時間は　だいたい　一日　三時間です。コンピューターが　だいすきです。</p>' +
        '<h3>Romaji</h3><p>Watashi wa Furansu no Pari ni sunde imasu. Mainichi nihongo o benkyō shite imasu. Getsuyōbi kara kin\'yōbi made wa gakkō de benkyō shimasu ga, doyōbi to nichiyōbi wa ie de benkyō shimasu. Benkyō no jikan wa daitai ichinichi sanjikan desu. Konpyūtā ga daisuki desu.</p>' +
        '<h3>Translation</h3><p>I live in Paris, France. I study Japanese every day. From Monday to Friday I study at school, but on Saturday and Sunday I study at home. Study time is roughly 3 hours a day. I love computers.</p>' +
        '<h3>Key kanji</h3><ul><li>住んで (すんで) — sống, ở</li><li>時間 (じかん) — thời gian</li><li>三 (さん) — số 3</li></ul></div>' +
        '<div class="ml-vi"><h3>Đoạn văn</h3><p>私は　フランスの　パリ―に　すんで　います。まいにち　日本語を　べんきょうして　います。月曜日から　金曜日までは　学校で　べんきょうしますが、土曜日と　日曜日は　いえで　べんきょうします。べんきょうの　時間は　だいたい　一日　三時間です。コンピューターが　だいすきです。</p>' +
        '<h3>Phiên âm (romaji)</h3><p>Watashi wa Furansu no Pari ni sunde imasu. Mainichi nihongo o benkyō shite imasu. Getsuyōbi kara kin\'yōbi made wa gakkō de benkyō shimasu ga, doyōbi to nichiyōbi wa ie de benkyō shimasu. Benkyō no jikan wa daitai ichinichi <b>sanjikan</b> desu. Konpyūtā ga daisuki desu.</p>' +
        '<h3>Dịch nghĩa</h3><p>Tôi sống ở Paris, Pháp. Mỗi ngày tôi học tiếng Nhật. Từ thứ Hai đến thứ Sáu tôi học ở trường, nhưng thứ Bảy và Chủ Nhật tôi học ở nhà. Thời gian học khoảng 3 tiếng một ngày. Tôi rất thích máy tính.</p>' +
        '<h3>Chữ Hán đáng nhớ</h3><ul><li><b>住</b>んで (すんで) — sống/ở, gốc động từ 住みます</li><li><b>時間</b> (じかん) — thời gian, chữ 時 (giờ) xuất hiện rất nhiều lần trong đề thi thật</li><li><b>三</b> — số 3, cẩn thận đọc 三時間 = さんじかん (không phải さんじ+かん tách rời)</li><li><b>月〜金</b> — dãy 5 kanji ngày trong tuần từ thứ Hai đến thứ Sáu</li></ul>' +
        '<h3>Mẹo đọc &amp; lưu ý</h3><p>Cấu trúc "AからBまで" (từ A đến B) rất hay gặp — ở đây "月曜日から金曜日まで" (từ thứ Hai đến thứ Sáu). Trợ từ が cuối câu 1 không phải chủ ngữ mà là "nhưng" (giống しかし) — ý nghĩa: học ở trường CÁC ngày trong tuần NHƯNG ở nhà cuối tuần.</p></div>',
      questions: [
        {
          kind: 'MCQ', points: 1,
          prompt: 'この人は　どこに　すんで　いますか。|||Người này sống ở đâu?',
          options: [{ text: '日本|||Nhật Bản' }, { text: 'フランス|||Pháp' }, { text: 'ドイツ|||Đức' }, { text: 'イギリス|||Anh' }],
          correctIndexes: [1],
          explanation: '"フランスのパリ―にすんでいます" — lives in Paris, France.|||"フランスのパリ―にすんでいます" — sống ở Paris, Pháp.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: '土曜日と日曜日は　どこで　べんきょうしますか。|||Thứ Bảy Chủ Nhật học ở đâu?',
          options: [{ text: '学校|||trường học' }, { text: 'いえ|||nhà' }, { text: 'としょかん|||thư viện' }, { text: 'カフェ|||quán cà phê' }],
          correctIndexes: [1],
          explanation: '"土曜日と日曜日はいえでべんきょうします" — studies at home on weekends.|||"土曜日と日曜日はいえでべんきょうします" — cuối tuần học ở nhà (khác trong tuần học ở trường).',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: '一日、だいたい　何時間　べんきょうしますか。|||Mỗi ngày học khoảng mấy tiếng?',
          options: [{ text: '1時間|||1 tiếng' }, { text: '2時間|||2 tiếng' }, { text: '3時間|||3 tiếng' }, { text: '4時間|||4 tiếng' }],
          correctIndexes: [2],
          explanation: '"べんきょうの時間はだいたい一日三時間です" — about 3 hours a day.|||"べんきょうの時間はだいたい一日三時間です" — khoảng 3 tiếng một ngày.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'この人は　何が　だいすきですか。|||Người này rất thích cái gì?',
          options: [{ text: 'スポーツ|||Thể thao' }, { text: 'コンピューター|||Máy tính' }, { text: 'りょうり|||Nấu ăn' }, { text: 'えいが|||Phim ảnh' }],
          correctIndexes: [1],
          explanation: '"コンピューターがだいすきです" — loves computers.|||"コンピューターがだいすきです" — rất thích máy tính.',
        },
      ],
    },

    // ═══════════════════ ĐỀ 4 — gốc (Brazil, FPT) ═══════════════════
    {
      kind: 'FE',
      code: 'READ-D4',
      source: 'REAL',
      sortOrder: 103,
      title: 'Reading — Passage 4: A Brazilian FPT student in Tokyo|||Đọc — Đề 4: Sinh viên FPT người Brazil ở Tokyo',
      description: 'Bài đọc gốc — sinh nhật, mua sách, giá tiền, thể thao.',
      durationMinutes: 15,
      totalPoints: 5,
      passMark: 3,
      isPublished: true,
      instructions:
        '<div class="ml-en"><h3>Passage</h3><p>私は　ブラジルから　きた　ｆｐｔ大学の学生です。たんじょうびは　四月七日です。いま　トウキョウに　います。日本語の　本を　かいました。この本は　二百五十円でした。ほかにも　300円と　600円の　本も　あります。学校で　つかう　ノートは　3さつで　3000円、ペンは　5本で　8000円です。月曜日から　金曜日まで　学校に　いきます。サッカーや　バスケットボールなどが　すきです。</p>' +
        '<h3>Romaji</h3><p>Watashi wa Burajiru kara kita FPT daigaku no gakusei desu. Tanjōbi wa shigatsu nanoka desu. Ima Tōkyō ni imasu. Nihongo no hon o kaimashita. Kono hon wa nihyaku-gojū-en deshita. Hoka ni mo sanbyaku-en to roppyaku-en no hon mo arimasu. Gakkō de tsukau nōto wa san-satsu de sanzen-en, pen wa go-hon de hassen-en desu. Getsuyōbi kara kin\'yōbi made gakkō ni ikimasu. Sakkā ya basukettobōru nado ga suki desu.</p>' +
        '<h3>Translation</h3><p>I am an FPT University student who came from Brazil. My birthday is April 7th. I am in Tokyo now. I bought a Japanese book — this book was 250 yen. There are also 300-yen and 600-yen books. Notebooks used at school are 3,000 yen for 3, pens are 8,000 yen for 5. I go to school Monday to Friday. I like soccer, basketball, etc.</p>' +
        '<h3>Key kanji</h3><ul><li>四月七日 — ngày 4/7</li><li>本 (ほん) — sách; cũng là đơn vị đếm vật dài (5本 pens)</li><li>大学 (だいがく) — đại học</li></ul></div>' +
        '<div class="ml-vi"><h3>Đoạn văn</h3><p>私は　ブラジルから　きた　ｆｐｔ大学の学生です。たんじょうびは　四月七日です。いま　トウキョウに　います。日本語の　本を　かいました。この本は　二百五十円でした。ほかにも　300円と　600円の　本も　あります。学校で　つかう　ノートは　3さつで　3000円、ペンは　5本で　8000円です。月曜日から　金曜日まで　学校に　いきます。サッカーや　バスケットボールなどが　すきです。</p>' +
        '<h3>Phiên âm (romaji)</h3><p>Watashi wa Burajiru kara kita FPT daigaku no gakusei desu. Tanjōbi wa <b>shigatsu nanoka</b> desu. Ima Tōkyō ni imasu. Nihongo no hon o kaimashita. Kono hon wa <b>nihyaku-gojū-en</b> deshita. Hoka ni mo sanbyaku-en to roppyaku-en no hon mo arimasu. Gakkō de tsukau nōto wa san-satsu de sanzen-en, pen wa go-hon de hassen-en desu. Getsuyōbi kara kin\'yōbi made gakkō ni ikimasu. Sakkā ya basukettobōru nado ga suki desu.</p>' +
        '<h3>Dịch nghĩa</h3><p>Tôi là sinh viên đại học FPT đến từ Brazil. Sinh nhật tôi là ngày 7 tháng 4. Bây giờ tôi đang ở Tokyo. Tôi đã mua một quyển sách tiếng Nhật — quyển này giá 250 yên. Ngoài ra còn có sách giá 300 yên và 600 yên. Vở dùng ở trường là 3.000 yên cho 3 quyển, bút là 8.000 yên cho 5 cây. Tôi đi học từ thứ Hai đến thứ Sáu. Tôi thích bóng đá, bóng rổ, v.v.</p>' +
        '<h3>Chữ Hán đáng nhớ</h3><ul><li><b>四月七日</b> — ngày 4/7: 四月=しがつ (bất quy tắc), 七日=なのか (một trong 10 từ ngày cổ)</li><li><b>本</b> (ほん) — vừa là "sách", vừa là trợ số từ đếm vật dài (5<b>本</b>=ごほん, cây bút)</li><li><b>大学</b> (だいがく) — đại học, khác 学校(がっこう, trường nói chung)</li><li><b>百・千</b> — hàng trăm/nghìn trong 二百五十円</li></ul>' +
        '<h3>Mẹo đọc &amp; lưu ý</h3><p>Đây là bài đọc DÀY ĐẶC số nhất trong 6 bài gốc — luyện kỹ 3 nhóm số: (1) ngày tháng 四月七日=しがつ なのか, (2) giá tiền 二百五十円=にひゃくごじゅうえん／300円=さんびゃくえん／600円=ろっぴゃくえん／3000円=さんぜんえん／8000円=はっせんえん (chú ý 8000 biến âm thành はっせん, không phải はちせん), (3) trợ số từ khác nhau: さつ (quyển sách/vở) vs 本(ほん) (cây bút, vật dài) — CÙNG LÀ ĐỒ VĂN PHÒNG nhưng đếm khác nhau tuỳ hình dạng.</p></div>',
      questions: [
        {
          kind: 'MCQ', points: 1,
          prompt: 'この人の　たんじょうびは　いつですか。|||Sinh nhật người này là khi nào?',
          options: [{ text: '四月七日|||Ngày 7 tháng 4' }, { text: '七月四日|||Ngày 4 tháng 7' }, { text: '四月十七日|||Ngày 17 tháng 4' }, { text: '十四月七日|||(không có tháng này)' }],
          correctIndexes: [0],
          explanation: '"たんじょうびは四月七日です" — April 7th (しがつ なのか).|||"たんじょうびは四月七日です" — ngày 7 tháng 4 (しがつ なのか). Chú ý thứ tự tháng-ngày trong tiếng Nhật.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: '本は　いくらでしたか。|||Quyển sách đã mua giá bao nhiêu?',
          options: [{ text: '150円|||150 yên' }, { text: '250円|||250 yên' }, { text: '350円|||350 yên' }, { text: '500円|||500 yên' }],
          correctIndexes: [1],
          explanation: '"この本は二百五十円でした" — this book was 250 yen.|||"この本は二百五十円でした" — quyển sách đã mua giá 250 yên (300円 và 600円 là các quyển KHÁC được nhắc thêm).',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'ペンは　5本で　いくらですか。|||5 cây bút giá bao nhiêu?',
          options: [{ text: '3,000円|||3.000 yên' }, { text: '5,000円|||5.000 yên' }, { text: '8,000円|||8.000 yên' }, { text: '80,000円|||80.000 yên' }],
          correctIndexes: [2],
          explanation: '"ペンは5本で8000円です" = 5 pens for 8,000 yen (8000 = はっせん, watch the rendaku).|||"ペンは5本で8000円です" = 5 cây bút giá 8.000 yên (8000円=はっせんえん, biến âm dễ nhầm với 3.000円 của ノート).',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'この人は　何が　すきですか。|||Người này thích gì?',
          options: [{ text: 'サッカーとバスケットボール|||Bóng đá và bóng rổ' }, { text: 'テニスとすいえい|||Tennis và bơi lội' }, { text: 'どくしょとおんがく|||Đọc sách và âm nhạc' }, { text: 'りょこうとりょうり|||Du lịch và nấu ăn' }],
          correctIndexes: [0],
          explanation: '"サッカーやバスケットボールなどがすきです" — likes soccer, basketball, etc.|||"サッカーやバスケットボールなどがすきです" — thích bóng đá, bóng rổ, v.v.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'この人は　どの　大学の　学生ですか。|||Người này là sinh viên trường đại học nào?',
          options: [{ text: 'とうきょう大学|||Đại học Tokyo' }, { text: 'fpt大学|||Đại học FPT' }, { text: 'めいじ大学|||Đại học Meiji' }, { text: 'さくら大学|||Đại học Sakura' }],
          correctIndexes: [1],
          explanation: '"ｆｐｔ大学の学生です" — is an FPT University student.|||"ｆｐｔ大学の学生です" — là sinh viên đại học FPT, đến từ Brazil.',
        },
      ],
    },

    // ═══════════════════ ĐỀ 5 — gốc (UK, London, 2 people) ═══════════════════
    {
      kind: 'FE',
      code: 'READ-D5',
      source: 'REAL',
      sortOrder: 104,
      title: 'Reading — Passage 5: Two friends from London|||Đọc — Đề 5: Hai người bạn đến từ London',
      description: 'Bài đọc gốc — đi cùng bạn, học phí, giờ học, ăn trưa.',
      durationMinutes: 12,
      totalPoints: 4,
      passMark: 2,
      isPublished: true,
      instructions:
        '<div class="ml-en"><h3>Passage</h3><p>私は　トモダチと　二人で　イギリスの　ロンドンから　きました。まいつき、日本語の　クラスに三千円を　はらいます。学校の　じゅぎょうは　月曜日と　水曜日に　あります。あさの　九時から　はじまり、十一時に　おわります。土曜日と　日曜日は　じゅぎょうが　ありませんので、ともだちと　八百円の　ランチを　たべに　いきます。</p>' +
        '<h3>Romaji</h3><p>Watashi wa tomodachi to futari de Igirisu no Rondon kara kimashita. Maitsuki, nihongo no kurasu ni sanzen-en o haraimasu. Gakkō no jugyō wa getsuyōbi to suiyōbi ni arimasu. Asa no kuji kara hajimari, jūichiji ni owarimasu. Doyōbi to nichiyōbi wa jugyō ga arimasen node, tomodachi to happyaku-en no ranchi o tabe ni ikimasu.</p>' +
        '<h3>Translation</h3><p>I came from London, England, together with a friend — two of us. Every month I pay 3,000 yen for the Japanese class. School classes are Monday and Wednesday, 9am to 11am. No classes on weekends, so I go eat an 800-yen lunch with friends.</p>' +
        '<h3>Key kanji</h3><ul><li>二人 (ふたり) — hai người</li><li>三千円 — 3.000 yên</li></ul></div>' +
        '<div class="ml-vi"><h3>Đoạn văn</h3><p>私は　トモダチと　二人で　イギリスの　ロンドンから　きました。まいつき、日本語の　クラスに三千円を　はらいます。学校の　じゅぎょうは　月曜日と　水曜日に　あります。あさの　九時から　はじまり、十一時に　おわります。土曜日と　日曜日は　じゅぎょうが　ありませんので、ともだちと　八百円の　ランチを　たべに　いきます。</p>' +
        '<h3>Phiên âm (romaji)</h3><p>Watashi wa tomodachi to futari de Igirisu no Rondon kara kimashita. Maitsuki, nihongo no kurasu ni <b>sanzen-en</b> o haraimasu. Gakkō no jugyō wa getsuyōbi to suiyōbi ni arimasu. Asa no kuji kara hajimari, jūichiji ni owarimasu. Doyōbi to nichiyōbi wa jugyō ga arimasen node, tomodachi to <b>happyaku-en</b> no ranchi o tabe ni ikimasu.</p>' +
        '<h3>Dịch nghĩa</h3><p>Tôi cùng một người bạn — hai người — đến từ London, nước Anh. Mỗi tháng tôi trả 3.000 yên cho lớp tiếng Nhật. Lớp học của trường vào thứ Hai và thứ Tư, từ 9 giờ đến 11 giờ sáng. Cuối tuần không có lớp nên tôi đi ăn trưa 800 yên với bạn.</p>' +
        '<h3>Chữ Hán đáng nhớ</h3><ul><li><b>二人</b> (ふたり) — hai người, cách đếm người đặc biệt (không phải にじん)</li><li><b>三千円</b> — さんぜんえん (biến âm せん→ぜん sau さん)</li><li><b>八百円</b> — はっぴゃくえん (biến âm ひゃく→ぴゃく sau はち, có gấp đôi phụ âmっ)</li></ul>' +
        '<h3>Mẹo đọc &amp; lưu ý</h3><p>So sánh trực tiếp với Đề 1 và Đề 6 — CẢ BA bài đều dùng gần như y hệt một khuôn câu ("まいつき...を はらいます。学校のじゅぎょうは...土曜日と日曜日は...ランチを たべにいきます"), chỉ đổi quốc gia/số tiền. Đây chính là kỹ thuật đề thi thật hay dùng: LẶP KHUÔN CÂU, ĐỔI SỐ LIỆU — học thuộc khuôn câu này là giải được rất nhiều bài đọc dạng tự giới thiệu.</p></div>',
      questions: [
        {
          kind: 'MCQ', points: 1,
          prompt: 'この人は　どこから　きましたか。|||Người này đến từ đâu?',
          options: [{ text: 'アメリカのニューヨーク|||New York, Mỹ' }, { text: 'イギリスのロンドン|||London, Anh' }, { text: 'フランスのパリ|||Paris, Pháp' }, { text: 'ドイツのベルリン|||Berlin, Đức' }],
          correctIndexes: [1],
          explanation: '"イギリスのロンドンからきました" — came from London, England.|||"イギリスのロンドンからきました" — đến từ London, nước Anh.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: '何人で　きましたか。|||Đi cùng mấy người?',
          options: [{ text: '一人|||Một mình' }, { text: '二人|||Hai người' }, { text: '三人|||Ba người' }, { text: '四人|||Bốn người' }],
          correctIndexes: [1],
          explanation: '"トモダチと二人できました" — came together with a friend, two people.|||"トモダチと二人できました" — đến cùng một người bạn, tổng hai người.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: '一か月、じゅぎょう料は　いくらですか。|||Học phí một tháng bao nhiêu?',
          options: [{ text: '300円|||300 yên' }, { text: '800円|||800 yên' }, { text: '3,000円|||3.000 yên' }, { text: '8,000円|||8.000 yên' }],
          correctIndexes: [2],
          explanation: '"日本語のクラスに三千円をはらいます" = pays 3,000 yen/month (800円 is the lunch price, a common trap).|||"日本語のクラスに三千円をはらいます" = trả 3.000 yên/tháng (800円 là giá ăn trưa, hay bị nhầm với học phí).',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: '土曜日と　日曜日、ランチは　いくらですか。|||Cuối tuần bữa trưa giá bao nhiêu?',
          options: [{ text: '600円|||600 yên' }, { text: '800円|||800 yên' }, { text: '3,000円|||3.000 yên' }, { text: 'ただ（無料）|||Miễn phí' }],
          correctIndexes: [1],
          explanation: '"八百円のランチをたべにいきます" — 800-yen lunch.|||"八百円のランチをたべにいきます" — ăn trưa 800 yên (khác Đề 1 là 600円 — đọc kỹ số của TỪNG bài, đừng nhớ nhầm giữa các bài đọc na ná nhau).',
        },
      ],
    },

    // ═══════════════════ ĐỀ 6 — gốc (Philippines, alone) ═══════════════════
    {
      kind: 'FE',
      code: 'READ-D6',
      source: 'REAL',
      sortOrder: 105,
      title: 'Reading — Passage 6: Alone from the Philippines|||Đọc — Đề 6: Một mình đến từ Philippines',
      description: 'Bài đọc gốc — cùng khuôn câu với Đề 1/5 nhưng số liệu khác, luyện phân biệt.',
      durationMinutes: 12,
      totalPoints: 4,
      passMark: 2,
      isPublished: true,
      instructions:
        '<div class="ml-en"><h3>Passage</h3><p>私は　一人で　フィリピンから　きました。まいつき、日本語の　クラスに八千円を　はらいます。学校の　じゅぎょうは月曜日と　水曜日に　あります。あさの　九時から　はじまり、十一時に　おわります。土曜日と　日曜日は　じゅぎょうが　ありませんので、ともだちと六百円の　ランチを　たべに　いきます。</p>' +
        '<h3>Romaji</h3><p>Watashi wa hitori de Firipin kara kimashita. Maitsuki, nihongo no kurasu ni hassen-en o haraimasu. Gakkō no jugyō wa getsuyōbi to suiyōbi ni arimasu. Asa no kuji kara hajimari, jūichiji ni owarimasu. Doyōbi to nichiyōbi wa jugyō ga arimasen node, tomodachi to roppyaku-en no ranchi o tabe ni ikimasu.</p>' +
        '<h3>Translation</h3><p>I came alone from the Philippines. Every month I pay 8,000 yen for the Japanese class. School classes are Monday and Wednesday, 9am to 11am. No classes on weekends, so I go eat a 600-yen lunch with friends.</p>' +
        '<h3>Key kanji</h3><ul><li>一人 (ひとり) — một mình</li><li>八千円 — 8.000 yên</li></ul></div>' +
        '<div class="ml-vi"><h3>Đoạn văn</h3><p>私は　一人で　フィリピンから　きました。まいつき、日本語の　クラスに八千円を　はらいます。学校の　じゅぎょうは月曜日と　水曜日に　あります。あさの　九時から　はじまり、十一時に　おわります。土曜日と　日曜日は　じゅぎょうが　ありませんので、ともだちと六百円の　ランチを　たべに　いきます。</p>' +
        '<h3>Phiên âm (romaji)</h3><p>Watashi wa <b>hitori de</b> Firipin kara kimashita. Maitsuki, nihongo no kurasu ni <b>hassen-en</b> o haraimasu. Gakkō no jugyō wa getsuyōbi to suiyōbi ni arimasu. Asa no kuji kara hajimari, jūichiji ni owarimasu. Doyōbi to nichiyōbi wa jugyō ga arimasen node, tomodachi to roppyaku-en no ranchi o tabe ni ikimasu.</p>' +
        '<h3>Dịch nghĩa</h3><p>Tôi đến từ Philippines một mình. Mỗi tháng tôi trả 8.000 yên cho lớp tiếng Nhật. Lớp học của trường vào thứ Hai và thứ Tư, từ 9 giờ đến 11 giờ sáng. Cuối tuần không có lớp nên tôi đi ăn trưa 600 yên với bạn.</p>' +
        '<h3>Chữ Hán đáng nhớ</h3><ul><li><b>一人</b> (ひとり) — một mình, đối lập với 二人(ふたり) ở Đề 5</li><li><b>八千円</b> — はっせんえん (8000, biến âm っせ đặc biệt, KHÔNG phải はちせんえん)</li></ul>' +
        '<h3>Mẹo đọc &amp; lưu ý</h3><p>So Đề 1／5／6: cùng khuôn câu, khác đúng 3 chỗ (nước xuất thân, số tiền học phí, số tiền ăn trưa). Đây là dạng bài "MẪU LẶP LẠI" hay gặp trong đề thi FE thật — nếu quen khuôn câu, chỉ cần "quét" số liệu là làm nhanh gấp đôi. Chú ý 八千円(8000)＝はっせん khác 三千円(3000, Đề 5)＝さんぜん và 83000(Đề 1)＝はちまんさんぜん — ba cách đọc "8" hoàn toàn khác nhau tuỳ ngữ cảnh.</p></div>',
      questions: [
        {
          kind: 'MCQ', points: 1,
          prompt: 'この人は　何人で　きましたか。|||Người này đến một mình hay có ai đi cùng?',
          options: [{ text: '一人で|||Một mình' }, { text: '二人で|||Hai người' }, { text: '三人で|||Ba người' }, { text: '家族と|||Cùng gia đình' }],
          correctIndexes: [0],
          explanation: '"一人でフィリピンからきました" — came alone from the Philippines.|||"一人でフィリピンからきました" — đến một mình từ Philippines.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: '一か月、いくら　はらいますか。|||Mỗi tháng trả bao nhiêu?',
          options: [{ text: '600円|||600 yên' }, { text: '3,000円|||3.000 yên' }, { text: '8,000円|||8.000 yên' }, { text: '83,000円|||83.000 yên' }],
          correctIndexes: [2],
          explanation: '"日本語のクラスに八千円をはらいます" = 8,000 yen/month.|||"日本語のクラスに八千円をはらいます" = trả 8.000 yên/tháng (はっせんえん).',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'この人は　どこから　きましたか。|||Người này đến từ đâu?',
          options: [{ text: 'タイ|||Thái Lan' }, { text: 'フィリピン|||Philippines' }, { text: 'かんこく|||Hàn Quốc' }, { text: 'ちゅうごく|||Trung Quốc' }],
          correctIndexes: [1],
          explanation: '"フィリピンからきました" — came from the Philippines.|||"フィリピンからきました" — đến từ Philippines.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: '週末、ランチは　いくらですか。|||Cuối tuần ăn trưa giá bao nhiêu?',
          options: [{ text: '600円|||600 yên' }, { text: '800円|||800 yên' }, { text: '8,000円|||8.000 yên' }, { text: '無料|||Miễn phí' }],
          correctIndexes: [0],
          explanation: '"ともだちと六百円のランチをたべにいきます" — 600-yen lunch, same price as Passage 1 (but a different learner!).|||"ともだちと六百円のランチをたべにいきます" — 600 yên, TRÙNG giá với Đề 1 nhưng khác học phí — đọc kỹ tránh nhầm giữa các bài.',
        },
      ],
    },

    // ═══════════════════ ĐỀ 7 — mới (Korean, demonstratives) ═══════════════════
    {
      kind: 'FE',
      code: 'READ-D7',
      source: 'SAMPLE',
      sortOrder: 106,
      title: 'Reading — Passage 7: Kim\'s classroom (この／その)|||Đọc — Đề 7: Lớp học của Kim (この／その)',
      description: 'Bài mới — luyện この/その/あの và trợ từ で.',
      durationMinutes: 12,
      totalPoints: 5,
      passMark: 3,
      isPublished: true,
      instructions:
        '<div class="ml-en"><h3>Passage</h3><p>私はキムです。かんこくじんです。がくせいです。にほんごがっこうの　がくせいです。きょうしつに　つくえと　いすが　あります。この　つくえは　わたしのです。その　ペンは　ともだちのです。わたしは　まいにち　としょかんで　べんきょうします。としょかんで　にほんごの　ほんを　よみます。この　ほんは　500円でした。わたしの　しゅみは　どくしょです。</p>' +
        '<h3>Romaji</h3><p>Watashi wa Kimu desu. Kankoku-jin desu. Gakusei desu. Nihongo gakkō no gakusei desu. Kyōshitsu ni tsukue to isu ga arimasu. Kono tsukue wa watashi no desu. Sono pen wa tomodachi no desu. Watashi wa mainichi toshokan de benkyō shimasu. Toshokan de nihongo no hon o yomimasu. Kono hon wa gohyaku-en deshita. Watashi no shumi wa dokusho desu.</p>' +
        '<h3>Translation</h3><p>I am Kim. I am Korean. I am a student — a student at a Japanese language school. There is a desk and a chair in the classroom. This desk is mine. That pen (near you) belongs to a friend. I study at the library every day. I read Japanese books at the library. This book was 500 yen. My hobby is reading.</p>' +
        '<h3>Key kanji</h3><ul><li>教室 (きょうしつ) — lớp học</li><li>図書館 (としょかん) — thư viện</li></ul></div>' +
        '<div class="ml-vi"><h3>Đoạn văn</h3><p>私はキムです。かんこくじんです。がくせいです。にほんごがっこうの　がくせいです。きょうしつに　つくえと　いすが　あります。この　つくえは　わたしのです。その　ペンは　ともだちのです。わたしは　まいにち　としょかんで　べんきょうします。としょかんで　にほんごの　ほんを　よみます。この　ほんは　500円でした。わたしの　しゅみは　どくしょです。</p>' +
        '<h3>Phiên âm (romaji)</h3><p>Watashi wa Kimu desu. Kankoku-jin desu. Gakusei desu. Nihongo gakkō no gakusei desu. Kyōshitsu ni tsukue to isu ga arimasu. <b>Kono</b> tsukue wa watashi no desu. <b>Sono</b> pen wa tomodachi no desu. Watashi wa mainichi toshokan <b>de</b> benkyō shimasu. Toshokan de nihongo no hon o yomimasu. Kono hon wa gohyaku-en deshita. Watashi no shumi wa dokusho desu.</p>' +
        '<h3>Dịch nghĩa</h3><p>Tôi là Kim. Tôi là người Hàn Quốc. Tôi là học sinh — học sinh trường tiếng Nhật. Trong lớp có bàn và ghế. Cái bàn này là của tôi. Cây bút đó (gần bạn) là của bạn tôi. Tôi học ở thư viện mỗi ngày. Tôi đọc sách tiếng Nhật ở thư viện. Quyển sách này giá 500 yên. Sở thích của tôi là đọc sách.</p>' +
        '<h3>Chữ Hán đáng nhớ</h3><ul><li><b>教室</b> (きょうしつ) — lớp học/phòng học</li><li><b>図書館</b> (としょかん) — thư viện, chữ 図 hiếm gặp nhưng 館(かん) hay xuất hiện ở tên địa điểm</li><li><b>毎日</b> (まいにち) — mỗi ngày</li></ul>' +
        '<h3>Mẹo đọc &amp; lưu ý</h3><p>Bài này test đúng bẫy lớn nhất của Chương 5: <b>この</b>つくえ (đứng trước danh từ つくえ) khác <b>その</b>ペン (đứng trước danh từ ペン) — cả hai đều PHẢI có danh từ theo ngay sau, không đứng một mình. Nếu thấy これ/それ đứng MỘT MÌNH thì đó là dạng khác (Chương 5.1). で trong "としょかんでべんきょうします" là trợ từ NƠI HÀNH ĐỘNG (không phải điểm đến).</p></div>',
      questions: [
        {
          kind: 'MCQ', points: 1,
          prompt: 'キムさんは　何人ですか。|||Kim là người nước nào?',
          options: [{ text: 'にほんじん|||Người Nhật' }, { text: 'かんこくじん|||Người Hàn' }, { text: 'ちゅうごくじん|||Người Trung' }, { text: 'タイじん|||Người Thái' }],
          correctIndexes: [1],
          explanation: '"かんこくじんです" — is Korean.|||"かんこくじんです" — là người Hàn Quốc.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'この　つくえは　だれのですか。|||Cái bàn này là của ai?',
          options: [{ text: 'キムさんの|||Của Kim' }, { text: 'ともだちの|||Của bạn' }, { text: 'せんせいの|||Của giáo viên' }, { text: 'だれのでもない|||Không của ai' }],
          correctIndexes: [0],
          explanation: '"このつくえはわたしのです" — this desk is mine (Kim\'s).|||"このつくえはわたしのです" — cái bàn này là của tôi (Kim).',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'キムさんは　どこで　べんきょうしますか。|||Kim học ở đâu?',
          options: [{ text: 'きょうしつ|||Lớp học' }, { text: 'としょかん|||Thư viện' }, { text: 'カフェ|||Quán cà phê' }, { text: 'うち|||Nhà' }],
          correctIndexes: [1],
          explanation: '"まいにちとしょかんでべんきょうします" — studies at the library every day.|||"まいにちとしょかんでべんきょうします" — học ở thư viện mỗi ngày.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: '本は　いくらでしたか。|||Quyển sách giá bao nhiêu?',
          options: [{ text: '50円|||50 yên' }, { text: '500円|||500 yên' }, { text: '5,000円|||5.000 yên' }, { text: '50,000円|||50.000 yên' }],
          correctIndexes: [1],
          explanation: '"この本は500円でした" — this book was 500 yen.|||"この本は500円でした" — quyển sách này giá 500 yên.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'キムさんの　しゅみは　何ですか。|||Sở thích của Kim là gì?',
          options: [{ text: 'どくしょ|||Đọc sách' }, { text: 'サッカー|||Bóng đá' }, { text: 'おんがく|||Âm nhạc' }, { text: 'りょこう|||Du lịch' }],
          correctIndexes: [0],
          explanation: '"わたしのしゅみはどくしょです" — my hobby is reading.|||"わたしのしゅみはどくしょです" — sở thích của tôi là đọc sách.',
        },
      ],
    },

    // ═══════════════════ ĐỀ 8 — mới (Chinese, verbs daily routine) ═══════════════════
    {
      kind: 'FE',
      code: 'READ-D8',
      source: 'SAMPLE',
      sortOrder: 107,
      title: 'Reading — Passage 8: Wang\'s daily routine (verbs)|||Đọc — Đề 8: Sinh hoạt hằng ngày của Wang (động từ)',
      description: 'Bài mới — chuỗi động từ thể ます trong sinh hoạt hằng ngày.',
      durationMinutes: 12,
      totalPoints: 5,
      passMark: 3,
      isPublished: true,
      instructions:
        '<div class="ml-en"><h3>Passage</h3><p>わたしは　ワンです。ちゅうごくじんです。まいあさ　6時に　おきます。7時に　あさごはんを　たべます。8時に　がっこうへ　いきます。がっこうで　にほんごを　べんきょうします。ひるごはんは　がっこうで　たべます。ごご　3時に　うちへ　かえります。うちで　テレビを　みます。よる　10時に　ねます。</p>' +
        '<h3>Romaji</h3><p>Watashi wa Wan desu. Chūgoku-jin desu. Maiasa rokuji ni okimasu. Shichiji ni asagohan o tabemasu. Hachiji ni gakkō e ikimasu. Gakkō de nihongo o benkyō shimasu. Hirugohan wa gakkō de tabemasu. Gogo sanji ni uchi e kaerimasu. Uchi de terebi o mimasu. Yoru jūji ni nemasu.</p>' +
        '<h3>Translation</h3><p>I am Wang. I am Chinese. Every morning I get up at 6. I eat breakfast at 7. I go to school at 8. I study Japanese at school. I eat lunch at school. At 3pm I go home. I watch TV at home. I sleep at 10pm.</p>' +
        '<h3>Key kanji</h3><ul><li>朝 (あさ) — buổi sáng</li><li>夜 (よる) — buổi tối</li></ul></div>' +
        '<div class="ml-vi"><h3>Đoạn văn</h3><p>わたしは　ワンです。ちゅうごくじんです。まいあさ　6時に　おきます。7時に　あさごはんを　たべます。8時に　がっこうへ　いきます。がっこうで　にほんごを　べんきょうします。ひるごはんは　がっこうで　たべます。ごご　3時に　うちへ　かえります。うちで　テレビを　みます。よる　10時に　ねます。</p>' +
        '<h3>Phiên âm (romaji)</h3><p>Watashi wa Wan desu. Chūgoku-jin desu. Maiasa rokuji ni <b>okimasu</b>. Shichiji ni asagohan o <b>tabemasu</b>. Hachiji ni gakkō <b>e ikimasu</b>. Gakkō <b>de</b> nihongo o benkyō shimasu. Hirugohan wa gakkō de tabemasu. Gogo sanji ni uchi e <b>kaerimasu</b>. Uchi de terebi o <b>mimasu</b>. Yoru jūji ni <b>nemasu</b>.</p>' +
        '<h3>Dịch nghĩa</h3><p>Tôi là Wang. Tôi là người Trung Quốc. Mỗi sáng tôi dậy lúc 6 giờ. Lúc 7 giờ tôi ăn sáng. Lúc 8 giờ tôi đi đến trường. Ở trường tôi học tiếng Nhật. Tôi ăn trưa ở trường. Lúc 3 giờ chiều tôi về nhà. Ở nhà tôi xem TV. Lúc 10 giờ tối tôi đi ngủ.</p>' +
        '<h3>Chữ Hán đáng nhớ</h3><ul><li><b>朝</b> (あさ) — buổi sáng, ghép 毎<b>朝</b>(まいあさ)＝mỗi sáng</li><li><b>夜</b> (よる) — buổi tối/đêm</li><li><b>午後</b> (ごご) — buổi chiều (đối lập 午前ごぜん＝buổi sáng)</li></ul>' +
        '<h3>Mẹo đọc &amp; lưu ý</h3><p>Đây là bài "bảng động từ" thu nhỏ — mỗi câu là MỘT động từ Chương 6 kèm đúng trợ từ: 6時<b>に</b>おきます (thời điểm), がっこう<b>へ</b>いきます (hướng đi), がっこう<b>で</b>べんきょうします (nơi hành động), テレビ<b>を</b>みます (tân ngữ). Học thuộc bài này = ôn lại toàn bộ 4 trợ từ を/に/で/へ trong một đoạn duy nhất.</p></div>',
      questions: [
        {
          kind: 'MCQ', points: 1,
          prompt: 'ワンさんは　何時に　おきますか。|||Wang dậy lúc mấy giờ?',
          options: [{ text: '5時|||5 giờ' }, { text: '6時|||6 giờ' }, { text: '7時|||7 giờ' }, { text: '8時|||8 giờ' }],
          correctIndexes: [1],
          explanation: '"まいあさ6時におきます" — gets up at 6 every morning.|||"まいあさ6時におきます" — mỗi sáng dậy lúc 6 giờ.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'がっこうで　何を　べんきょうしますか。|||Học gì ở trường?',
          options: [{ text: 'えいご|||Tiếng Anh' }, { text: 'にほんご|||Tiếng Nhật' }, { text: 'すうがく|||Toán' }, { text: 'かんこくご|||Tiếng Hàn' }],
          correctIndexes: [1],
          explanation: '"がっこうでにほんごをべんきょうします" — studies Japanese at school.|||"がっこうでにほんごをべんきょうします" — học tiếng Nhật ở trường.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'ひるごはんは　どこで　たべますか。|||Ăn trưa ở đâu?',
          options: [{ text: 'うち|||Nhà' }, { text: 'がっこう|||Trường' }, { text: 'レストラン|||Nhà hàng' }, { text: 'カフェ|||Quán cà phê' }],
          correctIndexes: [1],
          explanation: '"ひるごはんはがっこうでたべます" — eats lunch at school.|||"ひるごはんはがっこうでたべます" — ăn trưa ở trường.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'うちで　何を　しますか。|||Ở nhà làm gì?',
          options: [{ text: 'べんきょうします|||Học bài' }, { text: 'テレビをみます|||Xem TV' }, { text: 'りょうりをします|||Nấu ăn' }, { text: 'ねます（すぐに）|||Đi ngủ ngay' }],
          correctIndexes: [1],
          explanation: '"うちでテレビをみます" — watches TV at home (then sleeps at 10pm, a separate later action).|||"うちでテレビをみます" — xem TV ở nhà (sau đó mới đi ngủ lúc 10 giờ, hai hành động khác nhau).',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: '何時に　ねますか。|||Đi ngủ lúc mấy giờ?',
          options: [{ text: '9時|||9 giờ' }, { text: '10時|||10 giờ' }, { text: '11時|||11 giờ' }, { text: '12時|||12 giờ' }],
          correctIndexes: [1],
          explanation: '"よる10時にねます" — sleeps at 10pm.|||"よる10時にねます" — đi ngủ lúc 10 giờ tối.',
        },
      ],
    },

    // ═══════════════════ ĐỀ 9 — mới (German, あります/います) ═══════════════════
    {
      kind: 'FE',
      code: 'READ-D9',
      source: 'SAMPLE',
      sortOrder: 108,
      title: 'Reading — Passage 9: Schmidt\'s room (あります／います)|||Đọc — Đề 9: Phòng của Schmidt (あります／います)',
      description: 'Bài mới — phân biệt あります (vô tri) và います (hữu sinh).',
      durationMinutes: 10,
      totalPoints: 4,
      passMark: 2,
      isPublished: true,
      instructions:
        '<div class="ml-en"><h3>Passage</h3><p>わたしは　シュミットです。ドイツじんです。かいしゃいんです。わたしの　へやに　つくえが　あります。つくえの　うえに　パソコンが　あります。へやに　ねこが　います。かばんの　なかに　ほんと　ペンが　あります。まいばん、ねこと　あそびます。</p>' +
        '<h3>Romaji</h3><p>Watashi wa Shumitto desu. Doitsu-jin desu. Kaishain desu. Watashi no heya ni tsukue ga arimasu. Tsukue no ue ni pasokon ga arimasu. Heya ni neko ga imasu. Kaban no naka ni hon to pen ga arimasu. Maiban, neko to asobimasu.</p>' +
        '<h3>Translation</h3><p>I am Schmidt. I am German, a company employee. There is a desk in my room. There is a laptop on the desk. There is a cat in the room. There are a book and a pen inside my bag. Every night, I play with the cat.</p>' +
        '<h3>Key kanji</h3><ul><li>会社員 (かいしゃいん) — nhân viên công ty</li><li>中 (なか) — bên trong</li></ul></div>' +
        '<div class="ml-vi"><h3>Đoạn văn</h3><p>わたしは　シュミットです。ドイツじんです。かいしゃいんです。わたしの　へやに　つくえが　あります。つくえの　うえに　パソコンが　あります。へやに　ねこが　います。かばんの　なかに　ほんと　ペンが　あります。まいばん、ねこと　あそびます。</p>' +
        '<h3>Phiên âm (romaji)</h3><p>Watashi wa Shumitto desu. Doitsu-jin desu. Kaishain desu. Watashi no heya ni tsukue ga <b>arimasu</b>. Tsukue no ue ni pasokon ga <b>arimasu</b>. Heya ni neko ga <b>imasu</b>. Kaban no naka ni hon to pen ga <b>arimasu</b>. Maiban, neko to asobimasu.</p>' +
        '<h3>Dịch nghĩa</h3><p>Tôi là Schmidt. Tôi là người Đức, nhân viên công ty. Trong phòng tôi có một cái bàn. Trên bàn có một laptop. Trong phòng có một con mèo. Trong cặp có sách và bút. Mỗi tối tôi chơi với con mèo.</p>' +
        '<h3>Chữ Hán đáng nhớ</h3><ul><li><b>会社員</b> (かいしゃいん) — nhân viên công ty, ghép 会社(công ty)+員(thành viên)</li><li><b>中</b> (なか) — bên trong, ghép sau danh từ+の: かばんの<b>中</b></li><li><b>上</b> (うえ) — bên trên, つくえの<b>上</b></li></ul>' +
        '<h3>Mẹo đọc &amp; lưu ý</h3><p>Đếm lại: bài có 4 câu "Nが Vます", trong đó 3 câu dùng <b>あります</b> (つくえ, パソコン, ほんとペン — đều VÔ TRI) và đúng 1 câu dùng <b>います</b> (ねこ — HỮU SINH). Đây chính là kỹ thuật đề thi hay dùng: nhét nhiều câu あります liên tiếp rồi chèn MỘT câu います để test xem học sinh có tự động hoá theo quán tính hay thực sự hiểu quy tắc.</p></div>',
      questions: [
        {
          kind: 'MCQ', points: 1,
          prompt: 'へやに　何が　いますか。|||Trong phòng có (con) gì?',
          options: [{ text: 'いぬ|||Chó' }, { text: 'ねこ|||Mèo' }, { text: 'とり|||Chim' }, { text: 'なにもいません|||Không có gì' }],
          correctIndexes: [1],
          explanation: '"へやにねこがいます" — there is a cat in the room (います, animate).|||"へやにねこがいます" — trong phòng có con mèo (います vì mèo là vật hữu sinh).',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'つくえの　うえに　何が　ありますか。|||Trên bàn có gì?',
          options: [{ text: 'ほん|||Sách' }, { text: 'パソコン|||Laptop' }, { text: 'ねこ|||Mèo' }, { text: 'かばん|||Cặp' }],
          correctIndexes: [1],
          explanation: '"つくえのうえにパソコンがあります" — a laptop is on the desk.|||"つくえのうえにパソコンがあります" — trên bàn có một máy tính xách tay.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'かばんの　なかに　何が　ありますか。|||Trong cặp có gì?',
          options: [{ text: 'ほんとペン|||Sách và bút' }, { text: 'パソコンとねこ|||Laptop và mèo' }, { text: 'つくえといす|||Bàn và ghế' }, { text: 'なにもありません|||Không có gì' }],
          correctIndexes: [0],
          explanation: '"かばんのなかにほんとペンがあります" — a book and pen are in the bag.|||"かばんのなかにほんとペンがあります" — trong cặp có sách và bút.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'シュミットさんは　何を　しますか。|||Schmidt làm gì mỗi tối?',
          options: [{ text: 'べんきょうします|||Học bài' }, { text: 'ねこと　あそびます|||Chơi với mèo' }, { text: 'テレビをみます|||Xem TV' }, { text: 'ほんをよみます|||Đọc sách' }],
          correctIndexes: [1],
          explanation: '"まいばん、ねことあそびます" — plays with the cat every night.|||"まいばん、ねことあそびます" — mỗi tối chơi với con mèo.',
        },
      ],
    },

    // ═══════════════════ ĐỀ 10 — mới (Thai, shopping/price) ═══════════════════
    {
      kind: 'FE',
      code: 'READ-D10',
      source: 'SAMPLE',
      sortOrder: 109,
      title: 'Reading — Passage 10: Mariam went shopping|||Đọc — Đề 10: Mariam đi mua sắm',
      description: 'Bài mới — luyện đọc giá tiền và いくらでしたか (thì quá khứ).',
      durationMinutes: 10,
      totalPoints: 4,
      passMark: 2,
      isPublished: true,
      instructions:
        '<div class="ml-en"><h3>Passage</h3><p>わたしは　マリヤムです。タイじんです。100円ショップで　はたらいて　います。きょう、デパートへ　いきました。くつを　かいました。くつは　3,500円でした。かばんも　かいました。かばんは　6,200円でした。ぜんぶで　9,700円　はらいました。たかかったです。</p>' +
        '<h3>Romaji</h3><p>Watashi wa Mariyamu desu. Tai-jin desu. Hyaku-en shoppu de hataraite imasu. Kyō, depāto e ikimashita. Kutsu o kaimashita. Kutsu wa sanzen-gohyaku-en deshita. Kaban mo kaimashita. Kaban wa rokusen-nihyaku-en deshita. Zenbu de kyūsen-nanahyaku-en haraimashita. Takakatta desu.</p>' +
        '<h3>Translation</h3><p>I am Mariam. I am Thai. I work at a 100-yen shop. Today I went to a department store. I bought shoes — the shoes were 3,500 yen. I also bought a bag — the bag was 6,200 yen. I paid 9,700 yen in total. It was expensive.</p>' +
        '<h3>Key kanji</h3><ul><li>今日 (きょう) — hôm nay</li><li>全部 (ぜんぶ) — tất cả</li></ul></div>' +
        '<div class="ml-vi"><h3>Đoạn văn</h3><p>わたしは　マリヤムです。タイじんです。100円ショップで　はたらいて　います。きょう、デパートへ　いきました。くつを　かいました。くつは　3,500円でした。かばんも　かいました。かばんは　6,200円でした。ぜんぶで　9,700円　はらいました。たかかったです。</p>' +
        '<h3>Phiên âm (romaji)</h3><p>Watashi wa Mariyamu desu. Tai-jin desu. Hyaku-en shoppu de hataraite imasu. Kyō, depāto e ikimashita. Kutsu o kaimashita. Kutsu wa <b>sanzen-gohyaku-en</b> deshita. Kaban mo kaimashita. Kaban wa <b>rokusen-nihyaku-en</b> deshita. Zenbu de <b>kyūsen-nanahyaku-en</b> haraimashita. Takakatta desu.</p>' +
        '<h3>Dịch nghĩa</h3><p>Tôi là Mariam. Tôi là người Thái. Tôi làm việc ở cửa hàng 100 yên. Hôm nay tôi đã đi trung tâm thương mại. Tôi đã mua giày — giày giá 3.500 yên. Tôi cũng mua cặp — cặp giá 6.200 yên. Tổng cộng tôi đã trả 9.700 yên. Đắt quá.</p>' +
        '<h3>Chữ Hán đáng nhớ</h3><ul><li><b>今日</b> (きょう) — hôm nay</li><li><b>全部</b> (ぜんぶ) — tất cả, tổng cộng — 「ぜんぶで」＝"tổng cộng là"</li></ul>' +
        '<h3>Mẹo đọc &amp; lưu ý</h3><p>いくら<b>でした</b>か (quá khứ của です) khác いくら<b>です</b>か (hiện tại) — bài này toàn dùng thì quá khứ vì đang KỂ LẠI việc đã mua. Phép cộng đơn giản kiểm tra hiểu bài: 3.500 + 6.200 = 9.700 — nếu học sinh tính sai nghĩa là đọc nhầm một trong hai số giá.</p></div>',
      questions: [
        {
          kind: 'MCQ', points: 1,
          prompt: 'マリヤムさんは　どこで　はたらいて　いますか。|||Mariam làm việc ở đâu?',
          options: [{ text: '100円ショップ|||Cửa hàng 100 yên' }, { text: 'デパート|||Trung tâm thương mại' }, { text: 'がっこう|||Trường học' }, { text: 'レストラン|||Nhà hàng' }],
          correctIndexes: [0],
          explanation: '"100円ショップではたらいています" — works at a 100-yen shop.|||"100円ショップではたらいています" — làm việc ở cửa hàng 100 yên.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'くつは　いくらでしたか。|||Giày giá bao nhiêu?',
          options: [{ text: '350円|||350 yên' }, { text: '3,500円|||3.500 yên' }, { text: '6,200円|||6.200 yên' }, { text: '9,700円|||9.700 yên' }],
          correctIndexes: [1],
          explanation: '"くつは3,500円でした" — the shoes were 3,500 yen.|||"くつは3,500円でした" — giày giá 3.500 yên.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'ぜんぶで　いくら　はらいましたか。|||Tổng cộng đã trả bao nhiêu?',
          options: [{ text: '3,500円|||3.500 yên' }, { text: '6,200円|||6.200 yên' }, { text: '9,700円|||9.700 yên' }, { text: '10,000円|||10.000 yên' }],
          correctIndexes: [2],
          explanation: '3,500 + 6,200 = 9,700 — "ぜんぶで9,700円はらいました".|||3.500 + 6.200 = 9.700 — "ぜんぶで9,700円はらいました" (trả tổng cộng 9.700 yên).',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'マリヤムさんは　何を　かいましたか。|||Mariam đã mua gì?',
          options: [{ text: 'くつとかばん|||Giày và cặp' }, { text: 'ほんとペン|||Sách và bút' }, { text: 'ふくとくつ|||Quần áo và giày' }, { text: 'かばんとふく|||Cặp và quần áo' }],
          correctIndexes: [0],
          explanation: '"くつをかいました" and "かばんもかいました" — bought shoes and a bag.|||"くつをかいました" và "かばんもかいました" — đã mua giày và (cũng) cặp.',
        },
      ],
    },

    // ═══════════════════ ĐỀ 11 — mới (Japanese local, 曜日 schedule) ═══════════════════
    {
      kind: 'FE',
      code: 'READ-D11',
      source: 'SAMPLE',
      sortOrder: 110,
      title: 'Reading — Passage 11: Tanaka\'s weekly timetable (曜日)|||Đọc — Đề 11: Thời khoá biểu của Tanaka (曜日)',
      description: 'Bài mới — luyện đọc thứ trong tuần và phân biệt lịch học/nghỉ.',
      durationMinutes: 10,
      totalPoints: 4,
      passMark: 2,
      isPublished: true,
      instructions:
        '<div class="ml-en"><h3>Passage</h3><p>わたしは　たなかです。にほんじんです。だいがくせいです。月曜日と　水曜日と　金曜日に　にほんごの　じゅぎょうが　あります。火曜日は　すうがくです。木曜日は　やすみです。土曜日と　日曜日も　やすみです。木曜日、としょかんで　べんきょうします。</p>' +
        '<h3>Romaji</h3><p>Watashi wa Tanaka desu. Nihon-jin desu. Daigakusei desu. Getsuyōbi to suiyōbi to kin\'yōbi ni nihongo no jugyō ga arimasu. Kayōbi wa sūgaku desu. Mokuyōbi wa yasumi desu. Doyōbi to nichiyōbi mo yasumi desu. Mokuyōbi, toshokan de benkyō shimasu.</p>' +
        '<h3>Translation</h3><p>I am Tanaka. I am Japanese, a university student. I have Japanese class on Monday, Wednesday and Friday. Tuesday is math. Thursday is a day off. Saturday and Sunday are also days off. On Thursdays I study at the library.</p>' +
        '<h3>Key kanji</h3><ul><li>大学生 (だいがくせい) — sinh viên đại học</li><li>数学 (すうがく) — môn Toán</li></ul></div>' +
        '<div class="ml-vi"><h3>Đoạn văn</h3><p>わたしは　たなかです。にほんじんです。だいがくせいです。月曜日と　水曜日と　金曜日に　にほんごの　じゅぎょうが　あります。火曜日は　すうがくです。木曜日は　やすみです。土曜日と　日曜日も　やすみです。木曜日、としょかんで　べんきょうします。</p>' +
        '<h3>Phiên âm (romaji)</h3><p>Watashi wa Tanaka desu. Nihon-jin desu. Daigakusei desu. <b>Getsuyōbi to suiyōbi to kin\'yōbi</b> ni nihongo no jugyō ga arimasu. Kayōbi wa sūgaku desu. Mokuyōbi wa yasumi desu. Doyōbi to nichiyōbi mo yasumi desu. Mokuyōbi, toshokan de benkyō shimasu.</p>' +
        '<h3>Dịch nghĩa</h3><p>Tôi là Tanaka. Tôi là người Nhật, sinh viên đại học. Thứ Hai, thứ Tư và thứ Sáu tôi có lớp tiếng Nhật. Thứ Ba là môn Toán. Thứ Năm nghỉ. Thứ Bảy và Chủ Nhật cũng nghỉ. Vào thứ Năm tôi học ở thư viện.</p>' +
        '<h3>Chữ Hán đáng nhớ</h3><ul><li><b>大学生</b> (だいがくせい) — sinh viên đại học, khác 学生(がくせい, học sinh nói chung)</li><li><b>数学</b> (すうがく) — môn Toán</li><li><b>火・木</b> — hai chữ ngày trong tuần ít xuất hiện hơn 月/水/日 nhưng vẫn cần nhớ</li></ul>' +
        '<h3>Mẹo đọc &amp; lưu ý</h3><p>Chú ý bẫy: 木曜日 xuất hiện HAI LẦN với hai ý khác nhau — lần 1 nói "nghỉ" (木曜日はやすみです), lần 2 lại nói "học ở thư viện vào thứ Năm" — KHÔNG mâu thuẫn, vì "nghỉ" ở đây nghĩa là nghỉ LỚP CHÍNH KHOÁ, không phải nghỉ hoàn toàn không làm gì. Đọc kỹ để không chọn nhầm đáp án "thứ Năm không làm gì cả".</p></div>',
      questions: [
        {
          kind: 'MCQ', points: 1,
          prompt: 'にほんごの　じゅぎょうは　何曜日ですか。|||Lớp tiếng Nhật vào (những) thứ nào?',
          options: [{ text: '月・水・金|||Hai, Tư, Sáu' }, { text: '火・木・土|||Ba, Năm, Bảy' }, { text: '月・火・水|||Hai, Ba, Tư' }, { text: '水・木・金|||Tư, Năm, Sáu' }],
          correctIndexes: [0],
          explanation: '"月曜日と水曜日と金曜日ににほんごのじゅぎょうがあります" — Japanese class on Mon/Wed/Fri.|||"月曜日と水曜日と金曜日ににほんごのじゅぎょうがあります" — lớp tiếng Nhật vào thứ Hai, Tư, Sáu.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: '火曜日は　何の　じゅぎょうですか。|||Thứ Ba học môn gì?',
          options: [{ text: 'にほんご|||Tiếng Nhật' }, { text: 'すうがく|||Toán' }, { text: 'えいご|||Tiếng Anh' }, { text: 'なし（やすみ）|||Không có (nghỉ)' }],
          correctIndexes: [1],
          explanation: '"火曜日はすうがくです" — Tuesday is math.|||"火曜日はすうがくです" — thứ Ba là môn Toán.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: '木曜日、たなかさんは　何を　しますか。|||Thứ Năm Tanaka làm gì?',
          options: [{ text: 'にほんごをべんきょうする|||Học tiếng Nhật' }, { text: 'すうがくをべんきょうする|||Học Toán' }, { text: 'としょかんでべんきょうする|||Học ở thư viện' }, { text: 'アルバイトをする|||Đi làm thêm' }],
          correctIndexes: [2],
          explanation: 'Thursday has no class ("やすみ"), but the passage adds "木曜日、としょかんでべんきょうします" — self-study at the library.|||Thứ Năm không có lớp chính khoá ("やすみ"), nhưng câu cuối nói rõ "木曜日、としょかんでべんきょうします" — tự học ở thư viện.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'やすみは　何曜日ですか。（ぜんぶ　えらんでください　ではなく、いちばん　あう　こたえ）|||Ngày nghỉ (chính khoá) là những thứ nào?',
          options: [{ text: '木・土・日|||Năm, Bảy, CN' }, { text: '月・水・金|||Hai, Tư, Sáu' }, { text: '火・木|||Ba, Năm' }, { text: '土・日だけ|||Chỉ Bảy, CN' }],
          correctIndexes: [0],
          explanation: '"木曜日はやすみです。土曜日と日曜日もやすみです" — Thursday, Saturday, Sunday are days off (no class).|||"木曜日はやすみです。土曜日と日曜日もやすみです" — thứ Năm, thứ Bảy, Chủ Nhật đều là ngày không có lớp chính khoá.',
        },
      ],
    },

    // ═══════════════════ ĐỀ 12 — mới (American, question words) ═══════════════════
    {
      kind: 'FE',
      code: 'READ-D12',
      source: 'SAMPLE',
      sortOrder: 111,
      title: 'Reading — Passage 12: Scott\'s friend Carlos (question words)|||Đọc — Đề 12: Bạn của Scott là Carlos (từ để hỏi)',
      description: 'Bài mới — luyện だれ/いつ và mối quan hệ giữa các nhân vật.',
      durationMinutes: 10,
      totalPoints: 4,
      passMark: 2,
      isPublished: true,
      instructions:
        '<div class="ml-en"><h3>Passage</h3><p>わたしは　スコットです。アメリカじんです。エンジニアです。きょうは　木曜日です。あした　友達に　あいます。友達の　なまえは　カルロスです。カルロスさんは　ブラジルじんです。あさって、かいしゃで　かいぎが　あります。かいぎは　2時からです。</p>' +
        '<h3>Romaji</h3><p>Watashi wa Sukotto desu. Amerika-jin desu. Enjinia desu. Kyō wa mokuyōbi desu. Ashita tomodachi ni aimasu. Tomodachi no namae wa Karurosu desu. Karurosu-san wa Burajiru-jin desu. Asatte, kaisha de kaigi ga arimasu. Kaigi wa niji kara desu.</p>' +
        '<h3>Translation</h3><p>I am Scott. I am American, an engineer. Today is Thursday. Tomorrow I will meet a friend. My friend\'s name is Carlos. Carlos is Brazilian. The day after tomorrow, there is a meeting at the company. The meeting is from 2 o\'clock.</p>' +
        '<h3>Key kanji</h3><ul><li>明日 (あした) — ngày mai</li><li>会議 (かいぎ) — cuộc họp</li></ul></div>' +
        '<div class="ml-vi"><h3>Đoạn văn</h3><p>わたしは　スコットです。アメリカじんです。エンジニアです。きょうは　木曜日です。あした　友達に　あいます。友達の　なまえは　カルロスです。カルロスさんは　ブラジルじんです。あさって、かいしゃで　かいぎが　あります。かいぎは　2時からです。</p>' +
        '<h3>Phiên âm (romaji)</h3><p>Watashi wa Sukotto desu. Amerika-jin desu. Enjinia desu. Kyō wa mokuyōbi desu. <b>Ashita</b> tomodachi ni aimasu. Tomodachi no namae wa Karurosu desu. Karurosu-san wa Burajiru-jin desu. <b>Asatte</b>, kaisha de kaigi ga arimasu. Kaigi wa niji kara desu.</p>' +
        '<h3>Dịch nghĩa</h3><p>Tôi là Scott. Tôi là người Mỹ, kỹ sư. Hôm nay là thứ Năm. Ngày mai tôi sẽ gặp một người bạn. Tên bạn tôi là Carlos. Carlos là người Brazil. Ngày kia, có cuộc họp ở công ty. Cuộc họp bắt đầu từ 2 giờ.</p>' +
        '<h3>Chữ Hán đáng nhớ</h3><ul><li><b>明日</b> (あした) — ngày mai</li><li><b>会議</b> (かいぎ) — cuộc họp, ghép hai chữ 会(gặp/hội)+議(bàn luận)</li><li><b>今日</b>／<b>明日</b> — hôm nay/ngày mai, dễ nhầm mặt chữ vì cùng có 日</li></ul>' +
        '<h3>Mẹo đọc &amp; lưu ý</h3><p>Bài luyện chuỗi thời gian: きょう(hôm nay, thứ Năm) → あした(ngày mai) → あさって(ngày kia) — ba mốc liên tiếp hay bị hỏi trong bài đọc thật. Nếu hôm nay là thứ Năm thì あした là thứ Sáu, あさって là thứ Bảy — bài tập suy luận ẩn không nói thẳng ra.</p></div>',
      questions: [
        {
          kind: 'MCQ', points: 1,
          prompt: 'あした、スコットさんは　だれに　あいますか。|||Ngày mai Scott gặp ai?',
          options: [{ text: 'せんせい|||Giáo viên' }, { text: 'カルロスさん|||Carlos' }, { text: 'かいしゃのひと|||Người ở công ty' }, { text: 'かぞく|||Gia đình' }],
          correctIndexes: [1],
          explanation: '"あした友達にあいます。友達のなまえはカルロスです" — meets a friend named Carlos tomorrow.|||"あした友達にあいます。友達のなまえはカルロスです" — ngày mai gặp một người bạn tên Carlos.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'カルロスさんは　何人ですか。|||Carlos là người nước nào?',
          options: [{ text: 'アメリカじん|||Người Mỹ' }, { text: 'ブラジルじん|||Người Brazil' }, { text: 'にほんじん|||Người Nhật' }, { text: 'かんこくじん|||Người Hàn' }],
          correctIndexes: [1],
          explanation: '"カルロスさんはブラジルじんです" — Carlos is Brazilian.|||"カルロスさんはブラジルじんです" — Carlos là người Brazil.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'かいぎは　いつですか。|||Cuộc họp là khi nào?',
          options: [{ text: 'きょう|||Hôm nay' }, { text: 'あした|||Ngày mai' }, { text: 'あさって|||Ngày kia' }, { text: '来週|||Tuần sau' }],
          correctIndexes: [2],
          explanation: '"あさって、かいしゃでかいぎがあります" — the meeting is the day after tomorrow.|||"あさって、かいしゃでかいぎがあります" — cuộc họp diễn ra vào ngày kia.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'かいぎは　何時からですか。|||Cuộc họp bắt đầu từ mấy giờ?',
          options: [{ text: '1時|||1 giờ' }, { text: '2時|||2 giờ' }, { text: '3時|||3 giờ' }, { text: '4時|||4 giờ' }],
          correctIndexes: [1],
          explanation: '"かいぎは2時からです" — the meeting is from 2 o\'clock.|||"かいぎは2時からです" — cuộc họp bắt đầu từ 2 giờ.',
        },
      ],
    },

    // ═══════════════════ ĐỀ 13 — mới (Vietnamese self-intro) ═══════════════════
    {
      kind: 'FE',
      code: 'READ-D13',
      source: 'SAMPLE',
      sortOrder: 112,
      title: 'Reading — Passage 13: Nguyen\'s self-introduction|||Đọc — Đề 13: Bài tự giới thiệu của Nguyen',
      description: 'Bài mới — mẫu tự giới thiệu đầy đủ như thi thật, luyện tuổi/chuyên ngành/sở thích.',
      durationMinutes: 10,
      totalPoints: 5,
      passMark: 3,
      isPublished: true,
      instructions:
        '<div class="ml-en"><h3>Passage</h3><p>はじめまして。わたしは　グエンです。ベトナムじんです。20さいです。だいがくの　がくせいです。せんこうは　コンピュータサイエンスです。しゅみは　サッカーです。にほんごを　1ねんかん　べんきょうして　います。にほんの　アニメが　すきです。どうぞ　よろしく　おねがいします。</p>' +
        '<h3>Romaji</h3><p>Hajimemashite. Watashi wa Guen desu. Betonamu-jin desu. Nijussai desu. Daigaku no gakusei desu. Senkō wa konpyūta saiensu desu. Shumi wa sakkā desu. Nihongo o ichinenkan benkyō shite imasu. Nihon no anime ga suki desu. Dōzo yoroshiku onegaishimasu.</p>' +
        '<h3>Translation</h3><p>Nice to meet you. I am Nguyen. I am Vietnamese, 20 years old, a university student. My major is Computer Science. My hobby is soccer. I have been studying Japanese for one year. I like Japanese anime. Pleased to meet you.</p>' +
        '<h3>Key kanji</h3><ul><li>専攻 (せんこう) — chuyên ngành</li><li>年間 (ねんかん) — khoảng thời gian (năm)</li></ul></div>' +
        '<div class="ml-vi"><h3>Đoạn văn</h3><p>はじめまして。わたしは　グエンです。ベトナムじんです。20さいです。だいがくの　がくせいです。せんこうは　コンピュータサイエンスです。しゅみは　サッカーです。にほんごを　1ねんかん　べんきょうして　います。にほんの　アニメが　すきです。どうぞ　よろしく　おねがいします。</p>' +
        '<h3>Phiên âm (romaji)</h3><p>Hajimemashite. Watashi wa Guen desu. Betonamu-jin desu. <b>Nijussai</b> desu. Daigaku no gakusei desu. Senkō wa konpyūta saiensu desu. Shumi wa sakkā desu. Nihongo o <b>ichinenkan</b> benkyō shite imasu. Nihon no anime ga suki desu. Dōzo yoroshiku onegaishimasu.</p>' +
        '<h3>Dịch nghĩa</h3><p>Rất vui được gặp bạn. Tôi là Nguyen. Tôi là người Việt Nam, 20 tuổi, sinh viên đại học. Chuyên ngành của tôi là Khoa học Máy tính. Sở thích của tôi là bóng đá. Tôi đã học tiếng Nhật được 1 năm. Tôi thích anime Nhật Bản. Mong được giúp đỡ.</p>' +
        '<h3>Chữ Hán đáng nhớ</h3><ul><li><b>専攻</b> (せんこう) — chuyên ngành, từ vựng nâng cao nhưng hay gặp trong bài tự giới thiệu sinh viên</li><li><b>年間</b> (ねんかん) — khoảng ... năm, ghép sau số: 1<b>年間</b>＝1ねんかん (một năm, chỉ khoảng thời gian kéo dài, khác 1年＝một năm/năm thứ nhất)</li></ul>' +
        '<h3>Mẹo đọc &amp; lưu ý</h3><p>20さい luôn đọc là <b>はたち</b> (bất quy tắc, đã học Chương 3) — nếu nghe/đọc thấy "にじゅっさい" trong đáp án là SAI. Câu にほんごを1ねんかんべんきょうしています dùng thể ています (đang tiếp diễn/đã kéo dài) — ngoài phạm vi ngữ pháp chính JPD113 nhưng nghĩa "đã học được 1 năm và vẫn đang học" khá trực quan để đọc hiểu.</p></div>',
      questions: [
        {
          kind: 'MCQ', points: 1,
          prompt: 'グエンさんは　何さいですか。|||Nguyen bao nhiêu tuổi?',
          options: [{ text: '18さい|||18 tuổi' }, { text: '19さい|||19 tuổi' }, { text: '20さい（はたち）|||20 tuổi (はたち)' }, { text: '21さい|||21 tuổi' }],
          correctIndexes: [2],
          explanation: '"20さいです" — read はたち, an irregular exception.|||"20さいです" — đọc là はたち, một ngoại lệ bất quy tắc cần nhớ.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'せんこうは　何ですか。|||Chuyên ngành là gì?',
          options: [{ text: 'コンピュータサイエンス|||Khoa học máy tính' }, { text: 'にほんご|||Tiếng Nhật' }, { text: 'けいざい|||Kinh tế' }, { text: 'すうがく|||Toán' }],
          correctIndexes: [0],
          explanation: '"せんこうはコンピュータサイエンスです" — major is Computer Science.|||"せんこうはコンピュータサイエンスです" — chuyên ngành là Khoa học Máy tính.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'にほんごを　どのくらい　べんきょうして　いますか。|||Đã học tiếng Nhật bao lâu?',
          options: [{ text: '半年|||Nửa năm' }, { text: '1ねんかん|||1 năm' }, { text: '2ねんかん|||2 năm' }, { text: '3ねんかん|||3 năm' }],
          correctIndexes: [1],
          explanation: '"にほんごを1ねんかんべんきょうしています" — has been studying Japanese for one year.|||"にほんごを1ねんかんべんきょうしています" — đã học tiếng Nhật được 1 năm.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'グエンさんの　しゅみは　何ですか。|||Sở thích của Nguyen là gì?',
          options: [{ text: 'バスケットボール|||Bóng rổ' }, { text: 'サッカー|||Bóng đá' }, { text: 'すいえい|||Bơi lội' }, { text: 'テニス|||Tennis' }],
          correctIndexes: [1],
          explanation: '"しゅみはサッカーです" — hobby is soccer.|||"しゅみはサッカーです" — sở thích là bóng đá.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'グエンさんは　何が　すきですか。|||Nguyen thích gì?',
          options: [{ text: 'にほんのアニメ|||Anime Nhật Bản' }, { text: 'にほんのりょうり|||Món ăn Nhật' }, { text: 'にほんのおんがく|||Âm nhạc Nhật' }, { text: 'にほんのえいが|||Phim Nhật' }],
          correctIndexes: [0],
          explanation: '"にほんのアニメがすきです" — likes Japanese anime.|||"にほんのアニメがすきです" — thích anime Nhật Bản.',
        },
      ],
    },

    // ═══════════════════ ĐỀ 14 — mới (Australian, time & age heavy) ═══════════════════
    {
      kind: 'FE',
      code: 'READ-D14',
      source: 'SAMPLE',
      sortOrder: 113,
      title: 'Reading — Passage 14: Teacher Daniel\'s morning routine|||Đọc — Đề 14: Buổi sáng của thầy Daniel',
      description: 'Bài mới — luyện tuổi/sinh nhật/giờ giấc dày đặc, cùng khuôn nhân vật với slide Speaking.',
      durationMinutes: 12,
      totalPoints: 5,
      passMark: 3,
      isPublished: true,
      instructions:
        '<div class="ml-en"><h3>Passage</h3><p>わたしは　ダニエルです。オーストラリアじんです。せんせいです。31さいです。たんじょうびは　7月24日です。まいあさ　6時半に　おきます。7時に　あさごはんを　たべます。7時45分に　がっこうへ　いきます。じゅぎょうは　8時から　4時までです。しゅみは　どくしょと　りょうりです。</p>' +
        '<h3>Romaji</h3><p>Watashi wa Danieru desu. Ōsutoraria-jin desu. Sensei desu. Sanjūissai desu. Tanjōbi wa shichigatsu nijūyokka desu. Maiasa rokuji-han ni okimasu. Shichiji ni asagohan o tabemasu. Shichiji yonjūgofun ni gakkō e ikimasu. Jugyō wa hachiji kara yoji made desu. Shumi wa dokusho to ryōri desu.</p>' +
        '<h3>Translation</h3><p>I am Daniel. I am Australian, a teacher, 31 years old. My birthday is July 24th. Every morning I get up at 6:30. I eat breakfast at 7:00. I go to school at 7:45. Classes are from 8:00 to 4:00. My hobbies are reading and cooking.</p>' +
        '<h3>Key kanji</h3><ul><li>先生 (せんせい) — giáo viên</li><li>半 (はん) — rưỡi</li></ul></div>' +
        '<div class="ml-vi"><h3>Đoạn văn</h3><p>わたしは　ダニエルです。オーストラリアじんです。せんせいです。31さいです。たんじょうびは　7月24日です。まいあさ　6時半に　おきます。7時に　あさごはんを　たべます。7時45分に　がっこうへ　いきます。じゅぎょうは　8時から　4時までです。しゅみは　どくしょと　りょうりです。</p>' +
        '<h3>Phiên âm (romaji)</h3><p>Watashi wa Danieru desu. Ōsutoraria-jin desu. Sensei desu. Sanjūissai desu. Tanjōbi wa <b>shichigatsu nijūyokka</b> desu. Maiasa rokuji-han ni okimasu. Shichiji ni asagohan o tabemasu. Shichiji yonjūgofun ni gakkō e ikimasu. Jugyō wa hachiji kara yoji made desu. Shumi wa dokusho to ryōri desu.</p>' +
        '<h3>Dịch nghĩa</h3><p>Tôi là Daniel. Tôi là người Úc, giáo viên, 31 tuổi. Sinh nhật tôi là ngày 24 tháng 7. Mỗi sáng tôi dậy lúc 6 giờ 30. Lúc 7 giờ tôi ăn sáng. Lúc 7 giờ 45 tôi đi đến trường. Tiết học từ 8 giờ đến 4 giờ. Sở thích của tôi là đọc sách và nấu ăn.</p>' +
        '<h3>Chữ Hán đáng nhớ</h3><ul><li><b>先生</b> (せんせい) — giáo viên/thầy cô</li><li><b>半</b> (はん) — rưỡi, ghép sau giờ: 6時<b>半</b>＝6時30分</li><li><b>7月24日</b> — 7月＝しちがつ (bất quy tắc), 24日＝にじゅうよっか (bất quy tắc)</li></ul>' +
        '<h3>Mẹo đọc &amp; lưu ý</h3><p>Bài này gom TẤT CẢ điểm bất quy tắc về số của Chương 3 vào một đoạn: 31さい (đọc thường, KHÔNG phải はたち vì không phải 20), 7月(しちがつ, không phải なながつ), 24日(にじゅうよっか, không phải にじゅうよんにち), 6時半(ろくじはん). Đọc chậm và soát lại từng số một lần nữa nếu làm bài thi thật gặp đoạn dày đặc số như thế này.</p></div>',
      questions: [
        {
          kind: 'MCQ', points: 1,
          prompt: 'ダニエルさんは　何さいですか。|||Daniel bao nhiêu tuổi?',
          options: [{ text: '13さい|||13 tuổi' }, { text: '30さい|||30 tuổi' }, { text: '31さい|||31 tuổi' }, { text: '41さい|||41 tuổi' }],
          correctIndexes: [2],
          explanation: '"31さいです" — 31 years old.|||"31さいです" — 31 tuổi.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'たんじょうびは　いつですか。|||Sinh nhật khi nào?',
          options: [{ text: '7月4日|||4/7' }, { text: '7月14日|||14/7' }, { text: '7月24日|||24/7' }, { text: '4月27日|||27/4' }],
          correctIndexes: [2],
          explanation: '"たんじょうびは7月24日です" — July 24th (しちがつ にじゅうよっか).|||"たんじょうびは7月24日です" — ngày 24 tháng 7 (しちがつ にじゅうよっか).',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: '何時に　おきますか。|||Dậy lúc mấy giờ?',
          options: [{ text: '6時|||6 giờ' }, { text: '6時半|||6 giờ 30' }, { text: '7時|||7 giờ' }, { text: '7時45分|||7 giờ 45' }],
          correctIndexes: [1],
          explanation: '"まいあさ6時半におきます" — gets up at 6:30 every morning.|||"まいあさ6時半におきます" — mỗi sáng dậy lúc 6 giờ 30.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'じゅぎょうは　何時から　何時までですか。|||Tiết học từ mấy giờ đến mấy giờ?',
          options: [{ text: '7時から3時まで|||7h-3h' }, { text: '8時から4時まで|||8h-4h' }, { text: '9時から5時まで|||9h-5h' }, { text: '7時45分から4時まで|||7h45-4h' }],
          correctIndexes: [1],
          explanation: '"じゅぎょうは8時から4時までです" — classes from 8:00 to 4:00.|||"じゅぎょうは8時から4時までです" — tiết học từ 8 giờ đến 4 giờ.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'ダニエルさんの　しゅみは　何ですか。|||Sở thích của Daniel là gì?',
          options: [{ text: 'どくしょとりょうり|||Đọc sách và nấu ăn' }, { text: 'サッカーとおんがく|||Bóng đá và âm nhạc' }, { text: 'すいえいとりょこう|||Bơi lội và du lịch' }, { text: 'テニスとえいが|||Tennis và phim ảnh' }],
          correctIndexes: [0],
          explanation: '"しゅみはどくしょとりょうりです" — hobbies are reading and cooking.|||"しゅみはどくしょとりょうりです" — sở thích là đọc sách và nấu ăn.',
        },
      ],
    },

    // ═══════════════════ ĐỀ 15 — mới (friends, も/か) ═══════════════════
    {
      kind: 'FE',
      code: 'READ-D15',
      source: 'SAMPLE',
      sortOrder: 114,
      title: 'Reading — Passage 15: An & Mai, two friends (も／か)|||Đọc — Đề 15: An và Mai, hai người bạn (も／か)',
      description: 'Bài mới — luyện trợ từ も (cũng) và か (hỏi) qua so sánh hai người.',
      durationMinutes: 10,
      totalPoints: 4,
      passMark: 2,
      isPublished: true,
      instructions:
        '<div class="ml-en"><h3>Passage</h3><p>アンさんは　がくせいです。マイさんも　がくせいです。アンさんは　ベトナムじんです。マイさんも　ベトナムじんです。アンさんは　にほんごを　べんきょうします。マイさんも　にほんごを　べんきょうします。でも、アンさんは　えいごを　べんきょうしません。マイさんは　えいごも　べんきょうします。</p>' +
        '<h3>Romaji</h3><p>An-san wa gakusei desu. Mai-san mo gakusei desu. An-san wa Betonamu-jin desu. Mai-san mo Betonamu-jin desu. An-san wa nihongo o benkyō shimasu. Mai-san mo nihongo o benkyō shimasu. Demo, An-san wa eigo o benkyō shimasen. Mai-san wa eigo mo benkyō shimasu.</p>' +
        '<h3>Translation</h3><p>An is a student. Mai is also a student. An is Vietnamese. Mai is also Vietnamese. An studies Japanese. Mai also studies Japanese. But An does not study English. Mai also studies English.</p>' +
        '<h3>Key kanji</h3><ul><li>英語 (えいご) — tiếng Anh</li></ul></div>' +
        '<div class="ml-vi"><h3>Đoạn văn</h3><p>アンさんは　がくせいです。マイさんも　がくせいです。アンさんは　ベトナムじんです。マイさんも　ベトナムじんです。アンさんは　にほんごを　べんきょうします。マイさんも　にほんごを　べんきょうします。でも、アンさんは　えいごを　べんきょうしません。マイさんは　えいごも　べんきょうします。</p>' +
        '<h3>Phiên âm (romaji)</h3><p>An-san wa gakusei desu. Mai-san <b>mo</b> gakusei desu. An-san wa Betonamu-jin desu. Mai-san <b>mo</b> Betonamu-jin desu. An-san wa nihongo o benkyō shimasu. Mai-san <b>mo</b> nihongo o benkyō shimasu. Demo, An-san wa eigo o benkyō <b>shimasen</b>. Mai-san wa eigo <b>mo</b> benkyō shimasu.</p>' +
        '<h3>Dịch nghĩa</h3><p>An là sinh viên. Mai cũng là sinh viên. An là người Việt Nam. Mai cũng là người Việt Nam. An học tiếng Nhật. Mai cũng học tiếng Nhật. Nhưng An không học tiếng Anh. Mai cũng học (cả) tiếng Anh (nữa).</p>' +
        '<h3>Chữ Hán đáng nhớ</h3><ul><li><b>英語</b> (えいご) — tiếng Anh, so với 日本語(にほんご)＝tiếng Nhật, cùng ghép với 語(ご, ngôn ngữ)</li></ul>' +
        '<h3>Mẹo đọc &amp; lưu ý</h3><p>Bài này là bài tập ĐẶC BIỆT về も: 3 câu đầu dùng も vì Mai GIỐNG An hoàn toàn (cũng là sinh viên, cũng người Việt, cũng học tiếng Nhật). Nhưng câu cuối "マイさんはえいごもべんきょうします" KHÔNG so sánh với An (vì An không học tiếng Anh) — も ở đây nghĩa "học tiếng Anh THÊM/NỮA" (ngoài tiếng Nhật đã học), một cách dùng も khác: "thêm một thứ nữa", không phải "giống người khác". Đây là sắc thái nâng cao học sinh giỏi cần để ý.</p></div>',
      questions: [
        {
          kind: 'MCQ', points: 1,
          prompt: 'マイさんは　何人ですか。|||Mai là người nước nào?',
          options: [{ text: 'にほんじん|||Người Nhật' }, { text: 'ベトナムじん|||Người Việt Nam' }, { text: 'アメリカじん|||Người Mỹ' }, { text: 'かんこくじん|||Người Hàn' }],
          correctIndexes: [1],
          explanation: '"マイさんもベトナムじんです" — Mai is also Vietnamese (same as An).|||"マイさんもベトナムじんです" — Mai cũng là người Việt Nam, giống An.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'アンさんは　えいごを　べんきょうしますか。|||An có học tiếng Anh không?',
          options: [{ text: 'はい、べんきょうします|||Có, có học' }, { text: 'いいえ、べんきょうしません|||Không, không học' }, { text: 'ときどきべんきょうします|||Thỉnh thoảng học' }, { text: 'かいてありません|||Không nói tới' }],
          correctIndexes: [1],
          explanation: '"アンさんはえいごをべんきょうしません" — An does not study English.|||"アンさんはえいごをべんきょうしません" — An không học tiếng Anh.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'マイさんは　何を　べんきょうしますか。|||Mai học (những) môn gì?',
          options: [{ text: 'にほんごだけ|||Chỉ tiếng Nhật' }, { text: 'えいごだけ|||Chỉ tiếng Anh' }, { text: 'にほんごとえいご|||Tiếng Nhật và tiếng Anh' }, { text: 'なにも　べんきょうしません|||Không học gì' }],
          correctIndexes: [2],
          explanation: '"マイさんもにほんごをべんきょうします" + "マイさんはえいごもべんきょうします" — studies both Japanese and English.|||"マイさんもにほんごをべんきょうします" + "マイさんはえいごもべんきょうします" — Mai học cả tiếng Nhật và tiếng Anh.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'マイさんも　がくせいですか。|||Mai cũng là sinh viên phải không?',
          options: [{ text: 'はい|||Đúng vậy' }, { text: 'いいえ|||Không phải' }, { text: 'わかりません|||Không rõ' }, { text: 'せんせいです|||Là giáo viên' }],
          correctIndexes: [0],
          explanation: '"マイさんもがくせいです" — Mai is also a student.|||"マイさんもがくせいです" — Mai cũng là sinh viên.',
        },
      ],
    },

    // ═══════════════════ ĐỀ 16 — mới (mixed review capstone) ═══════════════════
    {
      kind: 'FE',
      code: 'READ-D16',
      source: 'SAMPLE',
      sortOrder: 115,
      title: 'Reading — Passage 16: A full review day (mixed grammar)|||Đọc — Đề 16: Một ngày ôn tập tổng hợp (trộn ngữ pháp)',
      description: 'Bài mới — bài đọc tổng hợp cuối cùng, trộn ngày/giờ/tiền/động từ/chỉ định — luyện trước khi thi thật.',
      durationMinutes: 15,
      totalPoints: 5,
      passMark: 3,
      isPublished: true,
      instructions:
        '<div class="ml-en"><h3>Passage</h3><p>きょうは　9月14日、木曜日です。いま　午後3時です。わたしは　いま　としょかんに　います。この　としょかんは　学校の　中に　あります。私は　毎日　ここで　べんきょうします。今日は　日本語の　ほんを　3さつ　よみました。1さつ　1,200円でした。ぜんぶで　3,600円でした。6時に　うちへ　かえります。うちで　ばんごはんを　たべて、9時に　ねます。</p>' +
        '<h3>Romaji</h3><p>Kyō wa kugatsu jūyokka, mokuyōbi desu. Ima gogo sanji desu. Watashi wa ima toshokan ni imasu. Kono toshokan wa gakkō no naka ni arimasu. Watashi wa mainichi koko de benkyō shimasu. Kyō wa nihongo no hon o sansatsu yomimashita. Issatsu senni-hyaku-en deshita. Zenbu de sanzen-roppyaku-en deshita. Rokuji ni uchi e kaerimasu. Uchi de bangohan o tabete, kuji ni nemasu.</p>' +
        '<h3>Translation</h3><p>Today is September 14th, Thursday. It is now 3pm. I am now at the library. This library is inside the school. I study here every day. Today I read 3 Japanese books. Each book was 1,200 yen. In total it was 3,600 yen. I go home at 6. At home I eat dinner, and sleep at 9.</p>' +
        '<h3>Key kanji</h3><ul><li>今 (いま) — bây giờ</li><li>週 (しゅう)／毎日 (まいにち) — mỗi ngày</li><li>冊 (さつ) — trợ số từ đếm sách</li></ul></div>' +
        '<div class="ml-vi"><h3>Đoạn văn</h3><p>きょうは　9月14日、木曜日です。いま　午後3時です。わたしは　いま　としょかんに　います。この　としょかんは　学校の　中に　あります。私は　毎日　ここで　べんきょうします。今日は　日本語の　ほんを　3さつ　よみました。1さつ　1,200円でした。ぜんぶで　3,600円でした。6時に　うちへ　かえります。うちで　ばんごはんを　たべて、9時に　ねます。</p>' +
        '<h3>Phiên âm (romaji)</h3><p>Kyō wa <b>kugatsu jūyokka</b>, mokuyōbi desu. Ima gogo sanji desu. Watashi wa ima toshokan ni <b>imasu</b>. Kono toshokan wa gakkō no naka ni <b>arimasu</b>. Watashi wa mainichi koko de benkyō shimasu. Kyō wa nihongo no hon o <b>sansatsu</b> yomimashita. Issatsu senni-hyaku-en deshita. Zenbu de sanzen-roppyaku-en deshita. Rokuji ni uchi e kaerimasu. Uchi de bangohan o tabete, kuji ni nemasu.</p>' +
        '<h3>Dịch nghĩa</h3><p>Hôm nay là ngày 14 tháng 9, thứ Năm. Bây giờ là 3 giờ chiều. Tôi hiện đang ở thư viện. Thư viện này nằm trong trường. Tôi học ở đây mỗi ngày. Hôm nay tôi đã đọc 3 quyển sách tiếng Nhật. Mỗi quyển giá 1.200 yên. Tổng cộng 3.600 yên. Tôi về nhà lúc 6 giờ. Ở nhà tôi ăn tối, và ngủ lúc 9 giờ.</p>' +
        '<h3>Chữ Hán đáng nhớ</h3><ul><li><b>今</b> (いま) — bây giờ, khác 毎日(まいにち, mỗi ngày) tuy cùng nói về thời gian</li><li><b>冊</b> (さつ) — trợ số từ đếm sách/vở, gặp lại từ Đề 4 (ノート3さつ)</li><li><b>9月14日</b> — 9月＝くがつ (bất quy tắc), 14日＝じゅうよっか (bất quy tắc — ghép よっか của "4日" vào phía sau じゅう)</li></ul>' +
        '<h3>Mẹo đọc &amp; lưu ý</h3><p>Đây là bài ôn TỔNG HỢP cuối cùng — có đủ: ngày tháng bất quy tắc (9月14日), giờ (午後3時), あります/います (この としょかんは...あります vì thư viện vô tri; わたしは...います vì người), phép nhân đơn giản (3さつ×1,200円=3,600円), và chuỗi động từ cuối ngày (かえります→たべて→ねます). Nếu làm được hết 5 câu hỏi của bài này mà không cần đọc lại, bạn đã sẵn sàng cho phần Reading của đề thi thật.</p></div>',
      questions: [
        {
          kind: 'MCQ', points: 1,
          prompt: '今日は　何月何日ですか。|||Hôm nay là ngày mấy?',
          options: [{ text: '9月4日|||Ngày 4/9' }, { text: '9月14日|||Ngày 14/9' }, { text: '9月24日|||Ngày 24/9' }, { text: '4月9日|||Ngày 9/4' }],
          correctIndexes: [1],
          explanation: '"きょうは9月14日" — September 14th (くがつ じゅうよっか).|||"きょうは9月14日" — ngày 14 tháng 9 (くがつ じゅうよっか).',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: '今、何時ですか。|||Bây giờ mấy giờ?',
          options: [{ text: '午前3時|||3 giờ sáng' }, { text: '午後3時|||3 giờ chiều' }, { text: '午後6時|||6 giờ chiều' }, { text: '午後9時|||9 giờ tối' }],
          correctIndexes: [1],
          explanation: '"いま午後3時です" — it is now 3pm.|||"いま午後3時です" — bây giờ là 3 giờ chiều.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: '本を　何さつ　よみましたか。|||Đã đọc mấy quyển sách?',
          options: [{ text: '1さつ|||1 quyển' }, { text: '2さつ|||2 quyển' }, { text: '3さつ|||3 quyển' }, { text: '4さつ|||4 quyển' }],
          correctIndexes: [2],
          explanation: '"日本語のほんを3さつよみました" — read 3 books.|||"日本語のほんを3さつよみました" — đã đọc 3 quyển sách tiếng Nhật.',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'ぜんぶで　いくらでしたか。|||Tổng cộng bao nhiêu tiền?',
          options: [{ text: '1,200円|||1.200 yên' }, { text: '2,400円|||2.400 yên' }, { text: '3,600円|||3.600 yên' }, { text: '4,800円|||4.800 yên' }],
          correctIndexes: [2],
          explanation: '3 books × 1,200 yen = 3,600 yen — "ぜんぶで3,600円でした".|||3 quyển × 1.200 yên = 3.600 yên — "ぜんぶで3,600円でした".',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: '何時に　うちへ　かえりますか。|||Mấy giờ về nhà?',
          options: [{ text: '3時|||3 giờ' }, { text: '5時|||5 giờ' }, { text: '6時|||6 giờ' }, { text: '9時|||9 giờ' }],
          correctIndexes: [2],
          explanation: '"6時にうちへかえります" — goes home at 6 (then sleeps at 9, a later separate action).|||"6時にうちへかえります" — về nhà lúc 6 giờ (9時 là giờ ĐI NGỦ, một mốc thời gian khác, đừng nhầm lẫn).',
        },
      ],
    },
  ],
};
