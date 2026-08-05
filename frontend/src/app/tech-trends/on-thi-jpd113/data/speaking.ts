/**
 * JPD113 — Ngân hàng thi nói (PE).
 *
 * Toàn bộ nội dung ở đây là ngân hàng THẬT của môn: 13 bài đọc,
 * 22 câu hỏi không tranh, 6 bộ tranh (37 câu). Giám thị bốc trong
 * đúng ngân hàng này, nên đây là phần duy nhất của kỳ thi mà bạn
 * biết trước 100% đề — cũng là chỗ dễ lấy 9-10 nhất.
 *
 * Cơ cấu điểm: READING 30 · TALKING 60 · PRESENTING 10.
 *
 * Phần `answer` của 22 câu hỏi dùng placeholder {{key}} — trang sẽ
 * thay bằng hồ sơ cá nhân người học nhập, để mỗi người có một bộ
 * câu trả lời của riêng mình thay vì học thuộc câu của người khác.
 */

/* ══════════════════ HỒ SƠ CÁ NHÂN ══════════════════ */

export interface ProfileField {
  key: string;
  label: string;
  /** Giá trị mặc định — để trang vẫn đọc được khi chưa nhập gì */
  fallback: string;
  hint: string;
}

export const PROFILE_FIELDS: ProfileField[] = [
  {
    key: 'name',
    label: 'Tên bạn (viết bằng katakana)',
    fallback: 'クオン',
    hint: 'Tên người nước ngoài viết bằng katakana. Ví dụ: Cường → クオン, Nam → ナム, Linh → リン.',
  },
  {
    key: 'country',
    label: 'Quốc tịch',
    fallback: 'ベトナム',
    hint: 'ベトナム = Việt Nam. Câu trả lời đầy đủ sẽ là ベトナムです。',
  },
  {
    key: 'city',
    label: 'Đang sống ở đâu',
    fallback: 'ハノイ',
    hint: 'ハノイ = Hà Nội · ホーチミン = TP.HCM · ダナン = Đà Nẵng · ハイフォン = Hải Phòng.',
  },
  {
    key: 'job',
    label: 'Nghề nghiệp',
    fallback: 'がくせい',
    hint: 'がくせい = sinh viên · かいしゃいん = nhân viên công ty · せんせい = giáo viên.',
  },
  {
    key: 'school',
    label: 'Tên trường',
    fallback: 'FPTだいがく',
    hint: 'FPT đọc là エフピーティー. Đại học = だいがく. Ví dụ: FPTだいがく.',
  },
  {
    key: 'grade',
    label: 'Năm thứ mấy',
    fallback: '2',
    hint: 'Chỉ nhập SỐ. Đọc: 1 いち · 2 に · 3 さん · 4 よ (よねんせい, KHÔNG phải しねんせい).',
  },
  {
    key: 'major',
    label: 'Ngành học',
    fallback: 'IT',
    hint: 'IT đọc アイティー · けいざい = kinh tế · にほんご = tiếng Nhật · ビジネス = kinh doanh.',
  },
  {
    key: 'age',
    label: 'Tuổi',
    fallback: 'はたち',
    hint: '⚠ 20 tuổi = はたち (KHÔNG phải にじゅっさい). 21 = にじゅういっさい · 19 = じゅうきゅうさい · 22 = にじゅうにさい.',
  },
  {
    key: 'birthyear',
    label: 'Năm sinh',
    fallback: 'にせんろく',
    hint: '2004 = にせんよん · 2005 = にせんご · 2006 = にせんろく · 2007 = にせんなな. Trang sẽ tự thêm ねん.',
  },
  {
    key: 'birthday',
    label: 'Sinh nhật',
    fallback: 'はちがつ よっか',
    hint: 'Đọc tháng + ngày. Ví dụ 4/8 → はちがつ よっか. Nhớ ngày 1–10 bất quy tắc.',
  },
  {
    key: 'hobby',
    label: 'Sở thích',
    fallback: 'おんがくと どくしょ',
    hint: 'おんがく = âm nhạc · どくしょ = đọc sách · スポーツ · りょこう = du lịch · えいが = phim.',
  },
  {
    key: 'wake',
    label: 'Giờ thức dậy',
    fallback: 'ろくじはん',
    hint: 'Ví dụ 6:30 → ろくじはん. Chú ý 4時=よじ, 7時=しちじ, 9時=くじ.',
  },
  {
    key: 'sleep',
    label: 'Giờ đi ngủ',
    fallback: 'じゅういちじ',
    hint: 'Ví dụ 11 giờ đêm → よる じゅういちじ.',
  },
  {
    key: 'transport',
    label: 'Phương tiện đi học/đi làm',
    fallback: 'バス',
    hint: 'バス · じてんしゃ (xe đạp) · バイク · でんしゃ (tàu). Đi bộ thì trả lời riêng: あるいて 行きます.',
  },
  {
    key: 'breakfast',
    label: 'Món ăn sáng',
    fallback: 'パン',
    hint: 'パン = bánh mì · ごはん = cơm · フォー.',
  },
  {
    key: 'weekend',
    label: 'Việc làm ngày nghỉ',
    fallback: 'えいがを みます',
    hint: 'Viết cả cụm động từ: えいがを みます · スポーツを します · ほんを よみます.',
  },
];

export const PROFILE_STORAGE_KEY = 'jpd113:profile:v1';

/* ══════════════════ 13 BÀI ĐỌC ══════════════════ */

export type ReadingLevel = 'easy' | 'medium' | 'hard';

export interface ReadingPassage {
  n: number;
  level: ReadingLevel;
  title: string;
  jp: string;
  romaji: string;
  vi: string;
  /** Chỗ dễ vấp — đọc trước khi luyện */
  watch: string;
}

export const READINGS: ReadingPassage[] = [
  {
    n: 1,
    level: 'easy',
    title: 'Tự giới thiệu — Anna',
    jp: 'はじめまして、私はアンナです。オーストラリア人です。さくら日本語学校の学生です。ことし、二十歳です。私のしゅみはおんがくとどくしょです。よろしくおねがいします。',
    romaji:
      'Hajimemashite, watashi wa Anna desu. Oosutoraria-jin desu. Sakura nihongo gakkou no gakusei desu. Kotoshi, hatachi desu. Watashi no shumi wa ongaku to dokusho desu. Yoroshiku onegaishimasu.',
    vi: 'Rất vui được gặp, tôi là Anna. Tôi là người Úc. Tôi là học sinh trường Nhật ngữ Sakura. Năm nay tôi 20 tuổi. Sở thích của tôi là âm nhạc và đọc sách. Mong được giúp đỡ.',
    watch: '二十歳 = はたち (bất quy tắc, KHÔNG đọc にじゅっさい) · オーストラリア là katakana dài, dễ vấp.',
  },
  {
    n: 2,
    level: 'easy',
    title: 'Giới thiệu người khác — Kim',
    jp: 'みなさん、おはようございます。こちらはキムさんです。キムさんはかんこく人です。キムさんのしゅみはすいえいとテニスです。いま、なごやたんきだいがくのがくせいです。学校で日本語をべんきょうしています。',
    romaji:
      'Minasan, ohayou gozaimasu. Kochira wa Kimu-san desu. Kimu-san wa kankoku-jin desu. Kimu-san no shumi wa suiei to tenisu desu. Ima, Nagoya tanki daigaku no gakusei desu. Gakkou de nihongo o benkyou shite imasu.',
    vi: 'Chào buổi sáng mọi người. Đây là anh/chị Kim. Kim là người Hàn Quốc. Sở thích của Kim là bơi lội và tennis. Hiện tại Kim là sinh viên trường cao đẳng Nagoya. Kim đang học tiếng Nhật ở trường.',
    watch: 'こちらは = "đây là (người)" lịch sự · べんきょうしています là thể ～ています của JPD123, cứ đọc y nguyên.',
  },
  {
    n: 3,
    level: 'easy',
    title: 'Thầy Watt',
    jp: 'ワットさんはアメリカ人です。おおさか大学の先生です。61才です。ワットさんのしゅみはおんがくとスポーツです。きむらさんのしゅみもスポーツです。学校で日本語をべんきょうしています。',
    romaji:
      'Watto-san wa amerika-jin desu. Oosaka daigaku no sensei desu. Rokujuu-issai desu. Watto-san no shumi wa ongaku to supootsu desu. Kimura-san no shumi mo supootsu desu. Gakkou de nihongo o benkyou shite imasu.',
    vi: 'Ông Watt là người Mỹ. Ông là giáo viên trường Đại học Osaka. Ông 61 tuổi. Sở thích của ông Watt là âm nhạc và thể thao. Sở thích của ông Kimura cũng là thể thao. Ông đang học tiếng Nhật ở trường.',
    watch: '61才 = ろくじゅう いっ さい (có つ nhỏ) · しゅみ も = "cũng".',
  },
  {
    n: 4,
    level: 'easy',
    title: 'Giới thiệu cô Emmy',
    jp: 'みなさん、こんばんは。こちらはエミーさんです。エミーさんはオーストラリア人です。エミーさんのしゅみはりょこうとサッカーです。いま、わかやまたんきだいがくの先生です。学校で日本語をおしえています。よろしくおねがいします。',
    romaji:
      'Minasan, konbanwa. Kochira wa Emii-san desu. Emii-san wa oosutoraria-jin desu. Emii-san no shumi wa ryokou to sakkaa desu. Ima, Wakayama tanki daigaku no sensei desu. Gakkou de nihongo o oshiete imasu. Yoroshiku onegaishimasu.',
    vi: 'Chào buổi tối mọi người. Đây là cô Emmy. Emmy là người Úc. Sở thích của Emmy là du lịch và bóng đá. Hiện cô là giáo viên trường cao đẳng Wakayama. Cô dạy tiếng Nhật ở trường. Mong được giúp đỡ.',
    watch: 'Cùng khuôn với bài 2 — chỉ đổi tên, nước, sở thích, và おしえて (dạy) thay cho べんきょうして (học).',
  },
  {
    n: 5,
    level: 'hard',
    title: 'Một tuần của anh Tanaka',
    jp: '私はたなかです。日本人です。私はかいしゃいんです。月曜日から金曜日まで、会社へいきます。あさ、ごぜん9時からごご5時はんまで会社ではたらきます。土曜日のごぜん、しんぶんをよみます。ごご、うちでDVDをみます。日曜日、こうえんでテニスをします。',
    romaji:
      'Watashi wa Tanaka desu. Nihonjin desu. Watashi wa kaishain desu. Getsuyoubi kara kinyoubi made, kaisha e ikimasu. Asa, gozen ku-ji kara gogo go-ji han made kaisha de hatarakimasu. Doyoubi no gozen, shinbun o yomimasu. Gogo, uchi de DVD o mimasu. Nichiyoubi, kouen de tenisu o shimasu.',
    vi: 'Tôi là Tanaka. Tôi là người Nhật. Tôi là nhân viên công ty. Từ thứ Hai đến thứ Sáu tôi đi đến công ty. Buổi sáng, tôi làm việc ở công ty từ 9 giờ sáng đến 5 rưỡi chiều. Sáng thứ Bảy tôi đọc báo. Buổi chiều tôi xem DVD ở nhà. Chủ Nhật tôi chơi tennis ở công viên.',
    watch:
      'KHÓ vì dồn đủ mọi loại số: thứ trong tuần, 9時 = くじ (không phải きゅうじ), 5時はん, ごぜん/ごご — cộng mẫu から…まで hai lần và ba trợ từ nơi chốn khác nhau (へ, で, で).',
  },
  {
    n: 6,
    level: 'medium',
    title: 'Hội thoại — món oyakodon',
    jp: 'A: あれは なんですか。\nB: おやこどんです。\nA: おやこどん？ おやこどんはなにの りょうりですか。\nB: とりにくと たまごの りょうりです。\nA: 「たまご」は えいごで なんですか。\nB: 「egg」です。',
    romaji:
      'A: Are wa nan desu ka. B: Oyakodon desu. A: Oyakodon? Oyakodon wa nani no ryouri desu ka. B: Toriniku to tamago no ryouri desu. A: "Tamago" wa eigo de nan desu ka. B: "Egg" desu.',
    vi: 'A: Kia là gì vậy? B: Là oyakodon. A: Oyakodon? Oyakodon là món gì? B: Là món làm từ thịt gà và trứng. A: "Tamago" tiếng Anh là gì? B: Là "egg".',
    watch: 'Đọc hai vai với nhịp hơi khác nhau để giám thị nghe ra đây là hội thoại.',
  },
  {
    n: 7,
    level: 'hard',
    title: 'Hội thoại nhà hàng (dài nhất)',
    jp: 'てんいん：いらっしゃいませ。こんにちは。なんめいさまですか。\nダニエル：三人です。\nてんいん：きんえんせきと きつえんせき、どちらを ごりようですか。\nダニエル：きんえんせきをおねがいします。\nてんいん：はい、こちらへどうぞ。\nパク：すみません！ ちゅうもんをおねがいします。\nワン：私、ハンバーグと ライス。\nダニエル：私も ハンバーグと ライス。それから、このビールは どこの ビールですか。\nてんいん：ドイツの ビールです。\nダニエル：じゃ、ビールを 2つください。\nパク：これは なんの カレーですか。\nてんいん：とりにくと やさいの カレーです。\nてんいん：はい、ハンバーグを 2つと ライスを 2つと カレーを 1つと ビールを 3つですね。\nてんいん：かしこまりました。しょうしょうおまちください。',
    romaji:
      'Ten-in: Irasshaimase. Konnichiwa. Nanmeisama desu ka. Danieru: San-nin desu. … Danieru: Ja, biiru o futatsu kudasai. … Ten-in: Kashikomarimashita. Shoushou omachi kudasai.',
    vi: 'Nhân viên: Xin mời vào. Xin chào. Quý khách mấy người ạ? Daniel: Ba người. NV: Chỗ cấm hút thuốc hay được hút thuốc ạ? … Daniel: Vậy cho hai cốc bia. Park: Đây là cà ri gì vậy? NV: Cà ri gà và rau. NV: Vâng, hai hamburger, hai cơm, một cà ri và ba bia ạ. NV: Vâng ạ. Xin quý khách đợi một chút.',
    watch:
      'KHÓ NHẤT về từ ngữ: kính ngữ nhà hàng chưa từng học (いらっしゃいませ, ごりよう, かしこまりました, しょうしょうおまちください). Bạn chỉ cần ĐỌC đúng — học chúng như một khối âm thanh, đừng cố phân tích ngữ pháp.',
  },
  {
    n: 8,
    level: 'medium',
    title: 'Hội thoại — thói quen buổi tối',
    jp: 'A：Bさん、まいばん、何時にねますか。\nB：12時にねます。\nA：そうですか。よる、何をしますか。\nB：インターネットをします。本をよみます。Aさんは何をしますか。\nA：私はまいばん、べんきょうします。\nB：何時から何時までべんきょうしますか。\nA：8時から12時までべんきょうします。',
    romaji:
      'A: B-san, maiban, nanji ni nemasu ka. B: Juuni-ji ni nemasu. A: Sou desu ka. Yoru, nani o shimasu ka. B: Intaanetto o shimasu. Hon o yomimasu. … A: Hachi-ji kara juuni-ji made benkyou shimasu.',
    vi: 'A: B ơi, mỗi tối bạn ngủ lúc mấy giờ? B: Tôi ngủ lúc 12 giờ. A: Vậy à. Buổi tối bạn làm gì? B: Tôi lướt internet. Tôi đọc sách. Còn A thì làm gì? A: Mỗi tối tôi học bài. B: Bạn học từ mấy giờ đến mấy giờ? A: Tôi học từ 8 giờ đến 12 giờ.',
    watch: '何時に (に đánh dấu mốc giờ) và 何時から何時まで — hai mẫu chắc chắn có trong phần hỏi đáp.',
  },
  {
    n: 9,
    level: 'hard',
    title: 'Một ngày của tôi — MỌI SỐ VIẾT BẰNG KANJI',
    jp: '私は日本語学校の学生です。日本人ではありません。ともだちと私はベトナム人や中国人などです。月曜日から金曜日まで、まいにち九時から四時まで日本語を勉強します。土曜日と日曜日は学校に行きません。私は「はたち」です。日本語の本が三つあります。まいにち三時間日本語をべんきょうします。これは私の一日です。あさ七時におきます。学校で日本語をべんきょうします。うちで本をよみます。よる十一時にねます。',
    romaji:
      'Watashi wa nihongo gakkou no gakusei desu. Nihonjin de wa arimasen. Tomodachi to watashi wa betonamujin ya chuugokujin nado desu. Getsuyoubi kara kinyoubi made, mainichi ku-ji kara yo-ji made nihongo o benkyou shimasu. … Asa shichi-ji ni okimasu. … Yoru juuichi-ji ni nemasu.',
    vi: 'Tôi là học sinh trường Nhật ngữ. Tôi không phải người Nhật. Bạn tôi và tôi là người Việt Nam, người Trung Quốc và những nước khác. Từ thứ Hai đến thứ Sáu, mỗi ngày tôi học tiếng Nhật từ 9 giờ đến 4 giờ. Thứ Bảy và Chủ Nhật tôi không đi học. Tôi 20 tuổi. Tôi có ba quyển sách tiếng Nhật. Mỗi ngày tôi học tiếng Nhật ba tiếng. Đây là một ngày của tôi. Buổi sáng tôi dậy lúc 7 giờ. Tôi học tiếng Nhật ở trường. Tôi đọc sách ở nhà. Buổi tối 11 giờ tôi đi ngủ.',
    watch:
      'KHÓ NHẤT ngân hàng: mọi con số viết bằng kanji — 九時 (くじ), 四時 (よじ), 三つ (みっつ), 三時間 (さんじかん), 七時 (しちじ), 十一時 (じゅういちじ), 一日 (いちにち). MẸO: trước khi đọc, khoanh mọi kanji số và đọc thầm chúng một lượt — 10 giây đó ngăn được cú đứng hình giữa câu.',
  },
  {
    n: 10,
    level: 'medium',
    title: 'Thầy Tanaka đi làm',
    jp: 'たなかさんは毎日会社にいきます。たなかさんは会社ではたらきます。会社でたなかさんは日本語をおしえます。たなかさんは日本語の先生です。せいとはベトナム人です。せいとは毎日日本語をべんきょうします。',
    romaji:
      'Tanaka-san wa mainichi kaisha ni ikimasu. Tanaka-san wa kaisha de hatarakimasu. Kaisha de Tanaka-san wa nihongo o oshiemasu. Tanaka-san wa nihongo no sensei desu. Seito wa Betonamujin desu. Seito wa mainichi nihongo o benkyou shimasu.',
    vi: 'Anh Tanaka mỗi ngày đi đến công ty. Anh Tanaka làm việc ở công ty. Ở công ty anh Tanaka dạy tiếng Nhật. Anh Tanaka là giáo viên tiếng Nhật. Học trò là người Việt Nam. Học trò mỗi ngày học tiếng Nhật.',
    watch: 'Cặp đối chiếu kinh điển: 会社に いきます (đích đến) ≠ 会社で はたらきます (nơi làm việc).',
  },
  {
    n: 11,
    level: 'easy',
    title: 'Bài 5 viết có dấu cách (bài tặng điểm)',
    jp: '私 は たなか です。日本人です。私 は かいしゃいん です。月曜日から金曜日まで、かいしゃ へ いきます。あさ、ごぜん9時 から ごご5時半まで かいしゃではたらきます。土曜日のごぜん、しんぶんをよみます。ごご、うちでDVDをみます。日曜日、こうえんでテニスをします。',
    romaji: 'Giống hệt bài 5.',
    vi: 'Nội dung y hệt bài 5, chỉ viết tách chữ và nhiều kana hơn.',
    watch:
      'Nếu đã luyện bài 5 thì bài này miễn phí — chỗ tách chữ chính là chỗ nên lấy hơi. Bốc trúng bài này coi như trúng số.',
  },
  {
    n: 12,
    level: 'medium',
    title: 'Wan — vừa học vừa làm thêm',
    jp: '私はワンです。私は日本語学校の学生です。月曜日から金曜日まで、学校へいきます。あさ、9時から12時半まで日本語を勉強します。しゅうまつ、としょかんへいきます。としょかんで、ほんをよみます。水曜日と土曜日、コンビニでアルバイトをします。4時から8時まで働きます。',
    romaji:
      'Watashi wa Wan desu. Watashi wa nihongo gakkou no gakusei desu. … Suiyoubi to doyoubi, konbini de arubaito o shimasu. Yo-ji kara hachi-ji made hatarakimasu.',
    vi: 'Tôi là Wan. Tôi là học sinh trường Nhật ngữ. Từ thứ Hai đến thứ Sáu tôi đi học. Buổi sáng tôi học tiếng Nhật từ 9 giờ đến 12 rưỡi. Cuối tuần tôi đến thư viện. Ở thư viện tôi đọc sách. Thứ Tư và thứ Bảy tôi làm thêm ở cửa hàng tiện lợi. Tôi làm từ 4 giờ đến 8 giờ.',
    watch: '4時 = よじ (không bao giờ là よんじ hay しじ) — lỗi sai phổ biến nhất ở bài này. 12時半 = じゅうにじ はん.',
  },
  {
    n: 13,
    level: 'easy',
    title: 'Gupta — học nhạc ở Nhật',
    jp: '私はグプタです。アメリカ人です。私は日本の大学でおんがくをべんきょうします。月曜日から木曜日まで、大学でべんきょうします。金曜日と土曜日に「カラオケのみせ」でアルバイトをします。日曜日、こうえんでサッカーをします。',
    romaji:
      'Watashi wa Guputa desu. Amerika-jin desu. Watashi wa Nihon no daigaku de ongaku o benkyou shimasu. … Nichiyoubi, kouen de sakkaa o shimasu.',
    vi: 'Tôi là Gupta. Tôi là người Mỹ. Tôi học âm nhạc ở một trường đại học tại Nhật. Từ thứ Hai đến thứ Năm tôi học ở đại học. Thứ Sáu và thứ Bảy tôi làm thêm ở "quán karaoke". Chủ Nhật tôi đá bóng ở công viên.',
    watch: 'Bài dễ, khuôn quen thuộc. Chỉ cần đọc đều và rõ.',
  },
];

/* ══════════════════ 22 CÂU HỎI KHÔNG TRANH ══════════════════ */

export interface SpeakQuestion {
  n: number;
  group: string;
  jp: string;
  vi: string;
  /** Có thể chứa {{key}} — thay bằng hồ sơ cá nhân */
  answer: string;
  note?: string;
}

export const TALK_GROUPS = [
  'Nhóm 1 — Thông tin cá nhân',
  'Nhóm 2 — Cảm nhận & dịch từ',
  'Nhóm 3 — Lịch sinh hoạt & giờ giấc',
  'Nhóm 4 — Thói quen & thời gian rảnh',
] as const;

export const TALK_QUESTIONS: SpeakQuestion[] = [
  {
    n: 1,
    group: TALK_GROUPS[0],
    jp: 'おなまえは？',
    vi: 'Tên bạn là gì?',
    answer: 'わたしの なまえは {{name}} です。',
  },
  {
    n: 2,
    group: TALK_GROUPS[0],
    jp: 'おくには どちらですか。',
    vi: 'Bạn đến từ nước nào?',
    answer: '{{country}} です。',
  },
  {
    n: 3,
    group: TALK_GROUPS[0],
    jp: 'おしごとは？',
    vi: 'Công việc của bạn là gì?',
    answer: 'わたしの しごとは {{job}} です。',
  },
  {
    n: 4,
    group: TALK_GROUPS[0],
    jp: 'たんじょうびは いつですか。',
    vi: 'Sinh nhật bạn khi nào?',
    answer: 'わたしの たんじょうびは {{birthday}} です。',
    note: 'Nhớ ngày 1–10 bất quy tắc: ついたち, ふつか, みっか, よっか…',
  },
  {
    n: 5,
    group: TALK_GROUPS[0],
    jp: 'しゅみは なんですか。',
    vi: 'Sở thích của bạn là gì?',
    answer: 'わたしの しゅみは {{hobby}} です。',
  },
  {
    n: 6,
    group: TALK_GROUPS[1],
    jp: 'にほんの りょうりは どうですか。',
    vi: 'Bạn thấy món ăn Nhật thế nào?',
    answer: 'とても おいしいです。',
  },
  {
    n: 7,
    group: TALK_GROUPS[1],
    jp: 'ぶたにく は えいごで なんですか。',
    vi: 'Thịt lợn tiếng Anh là gì?',
    answer: '「ぶたにく」は えいごで「pork」です。',
    note: 'Trả lời ngắn ポークです cũng được chấp nhận, nhưng dùng mẫu đầy đủ được điểm cao hơn.',
  },
  {
    n: 8,
    group: TALK_GROUPS[2],
    jp: 'まいにち、なんじに おきますか。',
    vi: 'Hằng ngày bạn dậy lúc mấy giờ?',
    answer: 'わたしは まいにち、{{wake}} に おきます。',
  },
  {
    n: 9,
    group: TALK_GROUPS[2],
    jp: 'なんじから なんじまで はたらきますか。',
    vi: 'Bạn làm việc từ mấy giờ đến mấy giờ?',
    answer: 'ごぜん9じから ごご6じまで はたらきます。',
    note: 'Là sinh viên thì đổi thành べんきょうします và dùng giờ học thật của bạn.',
  },
  {
    n: 10,
    group: TALK_GROUPS[2],
    jp: 'あなたの ひるやすみは なんじから なんじまでですか。',
    vi: 'Giờ nghỉ trưa của bạn từ mấy giờ đến mấy giờ?',
    answer: 'ひるやすみは じゅうにじから いちじまでです。',
  },
  {
    n: 11,
    group: TALK_GROUPS[1],
    jp: '「コンピュータ」は ベトナム語で なんですか。',
    vi: 'Máy tính tiếng Việt là gì?',
    answer: '「コンピュータ」は ベトナム語で「máy tính」です。',
  },
  {
    n: 12,
    group: TALK_GROUPS[2],
    jp: 'まいにち、何をしますか。／何時に おきますか／何時に ねますか。',
    vi: 'Hằng ngày bạn làm gì? Dậy lúc mấy giờ? Ngủ lúc mấy giờ?',
    answer:
      'まいにち、わたしは 学校に 行きます。まいあさ、わたしは {{wake}} に おきます。わたしは よる {{sleep}} に ねます。',
  },
  {
    n: 13,
    group: TALK_GROUPS[3],
    jp: 'まいあさ、何を たべますか。',
    vi: 'Mỗi sáng bạn ăn gì?',
    answer: 'まいあさ、わたしは {{breakfast}} を たべます。',
  },
  {
    n: 14,
    group: TALK_GROUPS[3],
    jp: 'まいにち、コーヒーを飲みますか。／日本語を べんきょうしますか。',
    vi: 'Hằng ngày bạn có uống cà phê không? Có học tiếng Nhật không?',
    answer: 'まいにち、わたしは コーヒーを のみます。まいにち、わたしは 日本語を べんきょうします。',
    note: 'Nếu không uống thì のみません — nhớ trả lời đủ câu, đừng chỉ はい／いいえ.',
  },
  {
    n: 15,
    group: TALK_GROUPS[3],
    jp: '休みの日、何をしますか。',
    vi: 'Ngày nghỉ bạn làm gì?',
    answer: '休みの日、わたしは {{weekend}}。',
  },
  {
    n: 16,
    group: TALK_GROUPS[2],
    jp: '今は何時ですか。',
    vi: 'Bây giờ là mấy giờ?',
    answer: '今は ○じ○ふんです。',
    note: 'Câu này phải nhìn đồng hồ trả lời thật — ôn kỹ bảng giờ/phút để không vấp.',
  },
  {
    n: 17,
    group: TALK_GROUPS[3],
    jp: '日曜日はどこに行きますか。',
    vi: 'Chủ Nhật bạn đi đâu?',
    answer: 'こうえんへ 行きます。',
    note: 'Đáp án gốc スポーツを しに行きます dùng ngữ pháp JPD123. Ở A1.1 trả lời こうえんへ 行きます là đúng và an toàn.',
  },
  {
    n: 18,
    group: TALK_GROUPS[3],
    jp: 'やすみの日はどこに行きますか。',
    vi: 'Ngày nghỉ bạn đi đâu?',
    answer: 'こうえんへ 行きます。',
  },
  {
    n: 19,
    group: TALK_GROUPS[3],
    jp: 'やすみの日はなにをしますか。',
    vi: 'Ngày nghỉ bạn làm gì?',
    answer: '{{weekend}}。',
    note: 'BẪY: câu 18 hỏi どこ (nơi chốn) còn câu 19 hỏi なに (hoạt động). Nghe kỹ từ để hỏi trước khi đáp — nhầm là mất điểm dù tiếng Nhật hoàn hảo.',
  },
  {
    n: 20,
    group: TALK_GROUPS[3],
    jp: 'あさごはんに何をたべますか。',
    vi: 'Bữa sáng bạn ăn gì?',
    answer: '{{breakfast}} を たべます。',
  },
  {
    n: 21,
    group: TALK_GROUPS[3],
    jp: 'ばんごはんに何をのみますか。',
    vi: 'Bữa tối bạn uống gì?',
    answer: 'おちゃを のみます。',
  },
  {
    n: 22,
    group: TALK_GROUPS[3],
    jp: '学校へはなんで行きますか。',
    vi: 'Bạn đến trường bằng gì?',
    answer: '{{transport}} で 行きます。',
    note: 'BẪY: なんで ở đây là "bằng phương tiện gì", KHÔNG phải "tại sao". Đi bộ thì nói あるいて 行きます (không có で).',
  },
];

/* ══════════════════ 6 BỘ TRANH ══════════════════ */

export interface PictureSet {
  n: number;
  title: string;
  /** Dữ liệu trong tranh, viết ra thành chữ để học không cần ảnh gốc */
  data: string[];
  qa: { q: string; a: string }[];
  note: string;
}

export const PICTURE_SETS: PictureSet[] = [
  {
    n: 1,
    title: 'Thẻ thông tin cá nhân',
    data: ['Tên: マリヤム (Mariam)', 'Tuổi: 26', 'Nghề: 学生 (sinh viên)', 'Nước: イタリア (Ý)'],
    qa: [
      { q: 'この人のなまえは？', a: 'マリヤムさんです。' },
      { q: 'マリヤムさんはなんさいですか。', a: 'マリヤムさんは26さいです。' },
      { q: 'マリヤムさんの おしごとはなんですか。', a: 'マリヤムさんの おしごとはがくせいです。' },
      { q: 'マリヤムさんは学生ですか。', a: 'はい、マリヤムさんは学生です。' },
      { q: 'マリヤムさんの お国はどちらですか。', a: 'マリヤムさんの お国はイタリアです。' },
      { q: 'マリヤムさんはイタリアじんですか。', a: 'はい、マリヤムさんはイタリアじんです。' },
    ],
    note:
      'Hai kiểu câu hỏi: なん/どちら → đáp bằng danh từ đầy đủ; “…ですか” dạng có/không → đáp はい／いいえ RỒI nhắc lại cả câu, đừng chỉ nói はい.',
  },
  {
    n: 2,
    title: 'Chiếc điện thoại di động',
    data: ['Đồ vật: けいたいでんわ (điện thoại)', 'Hãng: ノキア (Nokia)', 'Chủ: カルロス (Carlos)', 'Giá: 550.000 VND'],
    qa: [
      { q: 'これはなんですか。', a: 'これはノキアのけいたいでんわです。' },
      { q: 'そのけいたいでんわはだれのですか。', a: 'それはカルロスさんのものです。' },
      { q: 'そのけいたいでんわはなんのですか。', a: 'それはノキアのけいたいでんわです。' },
      { q: 'このけいたいでんわはいくらですか。', a: 'それは ごじゅうごまんドンです。' },
    ],
    note:
      'これ／それ đổi theo người cầm: giám thị cầm tranh nên họ nói この/これ, bạn đáp bằng それ. 550.000 = ごじゅうごまん (55 × 10.000).',
  },
  {
    n: 3,
    title: 'Sơ đồ tầng trung tâm thương mại',
    data: [
      'B1 (地下一階): スーパー',
      'Tầng 1: ケーキや, トイレ',
      'Tầng 2: ほんや',
      'Tầng 3: 100円ショップ, きつえんじょ, トイレ',
      'Tầng 4: サカイでんき',
      'Tầng 5: トイレ',
    ],
    qa: [
      { q: '100円ショップはどこですか。', a: 'さんがいです。' },
      { q: 'サカイでんきはどこですか。', a: 'よんかいです。' },
      { q: 'ほんやはどこですか。', a: 'にかいです。' },
      { q: 'ケーキやはどこですか。', a: 'いっかいです。' },
      { q: 'きつえんじょはどこですか。', a: 'さんがいです。' },
      { q: 'トイレはどこですか。', a: 'いっかい、さんがい、ごかいに あります。' },
      { q: 'スーパーはどこですか。', a: 'ちかいっかいです。' },
    ],
    note:
      'Bộ này kiểm tra thuần cách đếm tầng. Mọi bất quy tắc đều có mặt: いっかい, さんがい (が!), よんかい, ごかい, ちかいっかい. Nói さんかい thay vì さんがい là chỗ mất điểm kinh điển.',
  },
  {
    n: 4,
    title: 'Ba biển hiệu toà nhà',
    data: [
      '[1] さくらびょういん (Bệnh viện Sakura) — 9:30–15:00',
      '[2] さくらとしょかん (Thư viện Sakura) — 9:00–19:00, nghỉ 月曜日',
      '[3] わかば たいいくかん (Nhà thi đấu Wakaba) — 8:30–22:00, nghỉ 水曜日',
    ],
    qa: [
      { q: '[1] これはなんですか。', a: 'びょういんです。' },
      { q: '[1] このびょういんの なまえは なんですか。', a: 'さくらびょういんです。' },
      { q: '[1] なんじから なんじまでですか。', a: 'くじはんから ごごさんじまでです。' },
      { q: '[2] これはなんですか。', a: 'としょかんです。' },
      { q: '[2] なまえは なんですか。', a: 'さくらとしょかんです。' },
      { q: '[2] なんじから なんじまでですか。', a: 'くじから しちじまでです。' },
      { q: '[2] いつ やすみですか。', a: 'げつようびです。' },
      { q: '[3] これはなんですか。', a: 'たいいくかんです。' },
      { q: '[3] なまえは なんですか。', a: 'わかば たいいくかんです。' },
      { q: '[3] なんじから なんじまでですか。', a: 'ごぜんはちじはんから ごごじゅうじまでです。' },
      { q: '[3] いつ やすみですか。', a: 'すいようびです。' },
    ],
    note:
      'Cả bộ chỉ có BỐN khuôn câu hỏi: これはなんですか · なまえは なんですか · なんじから なんじまでですか · いつ やすみですか. Thuộc bốn khuôn đó là xử được mọi tranh biển hiệu.',
  },
  {
    n: 5,
    title: 'Chiếc máy ảnh',
    data: ['Đồ vật: カメラ', 'Hãng: キヤノン (Canon)', 'Chủ: フランク (Frank)', 'Giá: 680 USD'],
    qa: [
      { q: 'これはなんですか。', a: 'これはキヤノンのカメラです。' },
      { q: 'そのカメラはだれのですか。', a: 'それはフランクさんのものです。' },
      { q: 'そのカメラはなんのですか。', a: 'それはキヤノンのカメラです。' },
      { q: 'このカメラはいくらですか。', a: 'それは ろっぴゃくはちじゅうドルです。' },
    ],
    note: '680 = ろっぴゃくはちじゅう — 600 đọc ろっぴゃく chứ không phải ろくひゃく. Cấu trúc y hệt bộ 2.',
  },
  {
    n: 6,
    title: 'Bảng giờ mở cửa nhà thi đấu',
    data: ['たいいくかん (nhà thi đấu)', 'Giờ mở: 05:00–23:30', 'Mở: 月〜木 và 土・日', 'Nghỉ: 金曜日'],
    qa: [
      { q: 'ここは どこですか。', a: 'ここは たいいくかんです。' },
      {
        q: 'なんじから なんじまでですか。',
        a: 'たいいくかんは ごぜんごじから ごごじゅういちじはんまでです。',
      },
      {
        q: 'なんようびから なんようびまでですか。',
        a: 'げつようびから もくようびまでと、どようび・にちようびです。きんようびは やすみです。',
      },
      { q: 'やすみは いつですか。', a: 'やすみは きんようびです。' },
      { q: 'ここで なにを しますか。', a: 'ここで スポーツを します。' },
    ],
    note:
      'Đáp án gốc câu cuối dùng ～たり～たりします (trình độ cao hơn). Ở A1.1 cứ trả lời ここで スポーツを します — đúng hoàn toàn và chỉ dùng ngữ pháp Chương 6.',
  },
];

export const PICTURE_RULE =
  'Quy tắc duy nhất cho phần tranh: LUÔN trả lời bằng câu đầy đủ kết thúc bằng です/ます, nhắc lại danh từ trong câu hỏi. ' +
  'さんがいです hơn さんがい; はい、学生です hơn はい. Trả lời cụt một từ là cách phổ biến nhất khiến sinh viên âm thầm mất điểm — ' +
  'giám thị đang kiểm tra bạn có DỰNG được câu không, chứ không phải bạn có nhìn ra đáp án không.';

/** Thay {{key}} trong mẫu trả lời bằng hồ sơ người học (hoặc giá trị mặc định) */
export function fillAnswer(template: string, profile: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const val = profile[key]?.trim();
    if (val) return val;
    return PROFILE_FIELDS.find((f) => f.key === key)?.fallback ?? `___`;
  });
}
