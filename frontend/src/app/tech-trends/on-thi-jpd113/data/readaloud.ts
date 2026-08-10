/**
 * JPD113 — 13 BÀI ĐỌC CHIA THEO CỤM (文節) + FURIGANA.
 *
 * Vì sao có file này: biên bản kỳ thi trượt ghi rất rõ ba lỗi ở phần thi ĐỌC —
 * "đọc còn ngắt không trôi chảy", "chữ Hán không thuộc và đọc đúng chữ nào",
 * "không đọc được cả câu mà đọc từng chữ". Ba lỗi đó có chung một nguyên nhân:
 * bài đọc được nhìn như một CHUỖI CHỮ RỜI chứ không phải một chuỗi CỤM.
 *
 * Cách chữa là kỹ thuật, không phải chăm chỉ hơn:
 *   1. Cắt sẵn bài thành cụm — mỗi cụm là một hơi, một đơn vị nghĩa.
 *   2. Mỗi cụm có kana ĐẦY ĐỦ, nên không có chữ Hán nào là chỗ đứng hình.
 *   3. Mỗi cụm có nghĩa riêng, nên người đọc biết mình đang đọc cái gì —
 *      đọc có nghĩa thì ngữ điệu tự đúng, đọc vẹt thì không bao giờ đúng.
 *
 * Luật ngắt dùng ở đây (giữ nguyên khi thêm bài mới):
 *   · ngắt SAU trợ từ khi hết một cụm (は・も・を・に・で・へ・と・から・まで)
 *   · ngắt ở 、và 。
 *   · KHÔNG ngắt giữa một từ (会社員 đọc liền, không tách 会社 / 員)
 *   · từ để hỏi + です đọc liền một hơi
 *
 * `n` khớp với `READINGS[].n` trong `speaking.ts` — đừng đánh số lại.
 */

export interface Chunk {
  /** Mặt chữ đúng như trong đề (có kanji) */
  jp: string;
  /** Cách đọc đầy đủ bằng kana — đây là thứ khoá lại mọi chữ Hán */
  kana: string;
  romaji: string;
  vi: string;
  /** Cảnh báo riêng cho cụm này — chỉ ghi khi thật sự có bẫy */
  warn?: string;
}

export interface ReadLine {
  /** Vai nói, chỉ có ở bài hội thoại */
  speaker?: string;
  chunks: Chunk[];
}

export interface KanjiNote {
  c: string;
  yomi: string;
  vi: string;
}

export interface ReadPiece {
  n: number;
  title: string;
  level: 'easy' | 'medium' | 'hard';
  lines: ReadLine[];
  /** Mọi chữ Hán có trong bài — danh sách hữu hạn, học hết là hết vấp */
  kanji: KanjiNote[];
  tips: string[];
}

export const READ_PIECES: ReadPiece[] = [
  /* ─────────────── 1 ─────────────── */
  {
    n: 1,
    title: 'Tự giới thiệu — Anna',
    level: 'easy',
    lines: [
      {
        chunks: [
          { jp: 'はじめまして、', kana: 'はじめまして、', romaji: 'Hajimemashite,', vi: 'Rất vui được gặp,' },
          { jp: '私は', kana: 'わたしは', romaji: 'watashi wa', vi: 'tôi thì' },
          { jp: 'アンナです。', kana: 'アンナです。', romaji: 'Anna desu.', vi: 'là Anna.' },
          { jp: 'オーストラリア人です。', kana: 'オーストラリアじんです。', romaji: 'Oosutoraria-jin desu.', vi: 'Tôi là người Úc.', warn: 'Katakana dài nhất ngân hàng — オー kéo dài, ラ-リ-ア ba nhịp rõ. Đọc chậm hẳn ở cụm này.' },
          { jp: 'さくら日本語学校の', kana: 'さくらにほんごがっこうの', romaji: 'Sakura nihongo gakkou no', vi: 'của trường Nhật ngữ Sakura' },
          { jp: '学生です。', kana: 'がくせいです。', romaji: 'gakusei desu.', vi: 'tôi là học sinh.' },
          { jp: 'ことし、', kana: 'ことし、', romaji: 'Kotoshi,', vi: 'Năm nay,' },
          { jp: '二十歳です。', kana: 'はたちです。', romaji: 'hatachi desu.', vi: 'tôi 20 tuổi.', warn: '二十歳 = はたち. BẤT QUY TẮC — không bao giờ đọc にじゅっさい.' },
          { jp: '私のしゅみは', kana: 'わたしのしゅみは', romaji: 'Watashi no shumi wa', vi: 'Sở thích của tôi thì' },
          { jp: 'おんがくと', kana: 'おんがくと', romaji: 'ongaku to', vi: 'là âm nhạc và' },
          { jp: 'どくしょです。', kana: 'どくしょです。', romaji: 'dokusho desu.', vi: 'đọc sách.' },
          { jp: 'よろしくおねがいします。', kana: 'よろしくおねがいします。', romaji: 'Yoroshiku onegaishimasu.', vi: 'Mong được giúp đỡ.' },
        ],
      },
    ],
    kanji: [
      { c: '私', yomi: 'わたし', vi: 'tôi (TƯ) — chữ ra đề nhiều nhất: 86 lần' },
      { c: '人', yomi: 'じん', vi: 'người (NHÂN) — hậu tố quốc tịch' },
      { c: '日本語', yomi: 'にほんご', vi: 'tiếng Nhật (NHẬT BẢN NGỮ)' },
      { c: '学校', yomi: 'がっこう', vi: 'trường học (HỌC HIỆU) — có っ' },
      { c: '学生', yomi: 'がくせい', vi: 'học sinh (HỌC SINH)' },
      { c: '二十歳', yomi: 'はたち', vi: '20 tuổi — đọc bất quy tắc' },
    ],
    tips: [
      'Bài mở đầu dễ nhất — nếu bốc trúng bài này coi như được tặng điểm.',
      'Hai chỗ duy nhất có thể vấp: オーストラリア và 二十歳. Đọc riêng hai cụm đó 10 lần trước khi ghép cả bài.',
    ],
  },

  /* ─────────────── 2 ─────────────── */
  {
    n: 2,
    title: 'Giới thiệu người khác — Kim',
    level: 'easy',
    lines: [
      {
        chunks: [
          { jp: 'みなさん、', kana: 'みなさん、', romaji: 'Minasan,', vi: 'Mọi người,' },
          { jp: 'おはようございます。', kana: 'おはようございます。', romaji: 'ohayou gozaimasu.', vi: 'chào buổi sáng.' },
          { jp: 'こちらは', kana: 'こちらは', romaji: 'Kochira wa', vi: 'Đây là' },
          { jp: 'キムさんです。', kana: 'キムさんです。', romaji: 'Kimu-san desu.', vi: 'anh/chị Kim.', warn: 'こちらは = "đây là (người)", cách giới thiệu lịch sự. KHÔNG dùng これ cho người.' },
          { jp: 'キムさんは', kana: 'キムさんは', romaji: 'Kimu-san wa', vi: 'Kim thì' },
          { jp: 'かんこく人です。', kana: 'かんこくじんです。', romaji: 'kankoku-jin desu.', vi: 'là người Hàn Quốc.' },
          { jp: 'キムさんのしゅみは', kana: 'キムさんのしゅみは', romaji: 'Kimu-san no shumi wa', vi: 'Sở thích của Kim thì' },
          { jp: 'すいえいと', kana: 'すいえいと', romaji: 'suiei to', vi: 'là bơi lội và' },
          { jp: 'テニスです。', kana: 'テニスです。', romaji: 'tenisu desu.', vi: 'quần vợt.' },
          { jp: 'いま、', kana: 'いま、', romaji: 'Ima,', vi: 'Hiện tại,' },
          { jp: 'なごやたんきだいがくの', kana: 'なごやたんきだいがくの', romaji: 'Nagoya tanki daigaku no', vi: 'của trường cao đẳng Nagoya' },
          { jp: 'がくせいです。', kana: 'がくせいです。', romaji: 'gakusei desu.', vi: 'Kim là sinh viên.' },
          { jp: '学校で', kana: 'がっこうで', romaji: 'Gakkou de', vi: 'Ở trường' },
          { jp: '日本語を', kana: 'にほんごを', romaji: 'nihongo o', vi: 'tiếng Nhật' },
          { jp: 'べんきょうしています。', kana: 'べんきょうしています。', romaji: 'benkyou shite imasu.', vi: 'Kim đang học.', warn: '～ています là ngữ pháp JPD123. Ở JPD113 cứ đọc y nguyên như một khối, chưa cần phân tích.' },
        ],
      },
    ],
    kanji: [
      { c: '人', yomi: 'じん', vi: 'người (NHÂN)' },
      { c: '学校', yomi: 'がっこう', vi: 'trường học (HỌC HIỆU)' },
      { c: '日本語', yomi: 'にほんご', vi: 'tiếng Nhật' },
    ],
    tips: [
      'Bài 2 và bài 4 CÙNG MỘT KHUÔN — chỉ đổi tên, nước, sở thích và động từ cuối. Học một bài là gần như xong hai bài.',
      'なごやたんきだいがく viết toàn kana nên dài và dễ trôi tuột. Nhớ ngắt sau の.',
    ],
  },

  /* ─────────────── 3 ─────────────── */
  {
    n: 3,
    title: 'Thầy Watt',
    level: 'easy',
    lines: [
      {
        chunks: [
          { jp: 'ワットさんは', kana: 'ワットさんは', romaji: 'Watto-san wa', vi: 'Ông Watt thì' },
          { jp: 'アメリカ人です。', kana: 'アメリカじんです。', romaji: 'Amerika-jin desu.', vi: 'là người Mỹ.', warn: 'ワット có っ ngay trong tên — ワッ (ngậm một nhịp) rồi mới ト.' },
          { jp: 'おおさか大学の', kana: 'おおさかだいがくの', romaji: 'Oosaka daigaku no', vi: 'của Đại học Osaka' },
          { jp: '先生です。', kana: 'せんせいです。', romaji: 'sensei desu.', vi: 'ông là giáo viên.', warn: 'おおさか là NGOẠI LỆ おお (đọc "ôô", không phải "ô-u"). せんせい đọc "sen-sêê".' },
          { jp: '61才です。', kana: 'ろくじゅういっさいです。', romaji: 'Rokujuu-issai desu.', vi: 'Ông 61 tuổi.', warn: '61才 = ろくじゅう + いっさい. CÓ っ — ngậm một nhịp giữa い và さ.' },
          { jp: 'ワットさんのしゅみは', kana: 'ワットさんのしゅみは', romaji: 'Watto-san no shumi wa', vi: 'Sở thích của ông Watt thì' },
          { jp: 'おんがくと', kana: 'おんがくと', romaji: 'ongaku to', vi: 'là âm nhạc và' },
          { jp: 'スポーツです。', kana: 'スポーツです。', romaji: 'supootsu desu.', vi: 'thể thao.' },
          { jp: 'きむらさんのしゅみも', kana: 'きむらさんのしゅみも', romaji: 'Kimura-san no shumi mo', vi: 'Sở thích của ông Kimura CŨNG' },
          { jp: 'スポーツです。', kana: 'スポーツです。', romaji: 'supootsu desu.', vi: 'là thể thao.', warn: 'も thay chỗ は để nói "cũng". Đọc nhấn nhẹ vào も cho rõ ý.' },
          { jp: '学校で', kana: 'がっこうで', romaji: 'Gakkou de', vi: 'Ở trường' },
          { jp: '日本語を', kana: 'にほんごを', romaji: 'nihongo o', vi: 'tiếng Nhật' },
          { jp: 'べんきょうしています。', kana: 'べんきょうしています。', romaji: 'benkyou shite imasu.', vi: 'ông đang học.' },
        ],
      },
    ],
    kanji: [
      { c: '人', yomi: 'じん', vi: 'người (NHÂN)' },
      { c: '大学', yomi: 'だいがく', vi: 'đại học (ĐẠI HỌC)' },
      { c: '先生', yomi: 'せんせい', vi: 'giáo viên (TIÊN SINH)' },
      { c: '才', yomi: 'さい', vi: 'tuổi (TÀI) — ra đề 36 lần' },
      { c: '学校', yomi: 'がっこう', vi: 'trường học' },
      { c: '日本語', yomi: 'にほんご', vi: 'tiếng Nhật' },
    ],
    tips: [
      'Bài này là bài luyện っ tốt nhất: ワット và 61才 (ろくじゅういっさい) đều có っ.',
      'Nhớ nhấn も ở cụm きむらさんのしゅみも — đó là điểm khác biệt nghĩa duy nhất trong bài.',
    ],
  },

  /* ─────────────── 4 ─────────────── */
  {
    n: 4,
    title: 'Giới thiệu cô Emmy',
    level: 'easy',
    lines: [
      {
        chunks: [
          { jp: 'みなさん、', kana: 'みなさん、', romaji: 'Minasan,', vi: 'Mọi người,' },
          { jp: 'こんばんは。', kana: 'こんばんは。', romaji: 'konbanwa.', vi: 'chào buổi tối.', warn: 'こんばんは — chữ は cuối đọc "wa" vì nó là trợ từ đã hoá thành lời chào.' },
          { jp: 'こちらは', kana: 'こちらは', romaji: 'Kochira wa', vi: 'Đây là' },
          { jp: 'エミーさんです。', kana: 'エミーさんです。', romaji: 'Emii-san desu.', vi: 'cô Emmy.' },
          { jp: 'エミーさんは', kana: 'エミーさんは', romaji: 'Emii-san wa', vi: 'Emmy thì' },
          { jp: 'オーストラリア人です。', kana: 'オーストラリアじんです。', romaji: 'Oosutoraria-jin desu.', vi: 'là người Úc.' },
          { jp: 'エミーさんのしゅみは', kana: 'エミーさんのしゅみは', romaji: 'Emii-san no shumi wa', vi: 'Sở thích của Emmy thì' },
          { jp: 'りょこうと', kana: 'りょこうと', romaji: 'ryokou to', vi: 'là du lịch và' },
          { jp: 'サッカーです。', kana: 'サッカーです。', romaji: 'sakkaa desu.', vi: 'bóng đá.', warn: 'サッカー: っ rồi カー kéo dài. Bốn nhịp: サ-ッ-カ-ー.' },
          { jp: 'いま、', kana: 'いま、', romaji: 'Ima,', vi: 'Hiện tại,' },
          { jp: 'わかやまたんきだいがくの', kana: 'わかやまたんきだいがくの', romaji: 'Wakayama tanki daigaku no', vi: 'của trường cao đẳng Wakayama' },
          { jp: '先生です。', kana: 'せんせいです。', romaji: 'sensei desu.', vi: 'cô là giáo viên.' },
          { jp: '学校で', kana: 'がっこうで', romaji: 'Gakkou de', vi: 'Ở trường' },
          { jp: '日本語を', kana: 'にほんごを', romaji: 'nihongo o', vi: 'tiếng Nhật' },
          { jp: 'おしえています。', kana: 'おしえています。', romaji: 'oshiete imasu.', vi: 'cô đang dạy.', warn: 'おしえて = DẠY, khác べんきょうして = HỌC ở bài 2. Đây là chỗ duy nhất hai bài khác nhau về nghĩa.' },
          { jp: 'よろしくおねがいします。', kana: 'よろしくおねがいします。', romaji: 'Yoroshiku onegaishimasu.', vi: 'Mong được giúp đỡ.' },
        ],
      },
    ],
    kanji: [
      { c: '人', yomi: 'じん', vi: 'người (NHÂN)' },
      { c: '先生', yomi: 'せんせい', vi: 'giáo viên (TIÊN SINH)' },
      { c: '学校', yomi: 'がっこう', vi: 'trường học' },
      { c: '日本語', yomi: 'にほんご', vi: 'tiếng Nhật' },
    ],
    tips: ['Cùng khuôn bài 2. Chỉ cần nhớ おしえて (dạy) thay cho べんきょうして (học).'],
  },

  /* ─────────────── 5 ─────────────── */
  {
    n: 5,
    title: 'Một tuần của anh Tanaka',
    level: 'hard',
    lines: [
      {
        chunks: [
          { jp: '私は', kana: 'わたしは', romaji: 'Watashi wa', vi: 'Tôi thì' },
          { jp: 'たなかです。', kana: 'たなかです。', romaji: 'Tanaka desu.', vi: 'là Tanaka.' },
          { jp: '日本人です。', kana: 'にほんじんです。', romaji: 'Nihonjin desu.', vi: 'Tôi là người Nhật.' },
          { jp: '私は', kana: 'わたしは', romaji: 'Watashi wa', vi: 'Tôi thì' },
          { jp: 'かいしゃいんです。', kana: 'かいしゃいんです。', romaji: 'kaishain desu.', vi: 'là nhân viên công ty.' },
          { jp: '月曜日から', kana: 'げつようびから', romaji: 'Getsuyoubi kara', vi: 'Từ thứ Hai' },
          { jp: '金曜日まで、', kana: 'きんようびまで、', romaji: 'kinyoubi made,', vi: 'đến thứ Sáu,' },
          { jp: '会社へ', kana: 'かいしゃへ', romaji: 'kaisha e', vi: 'đến công ty', warn: 'へ ở đây đọc "E", không đọc "he". Đây là một trong ba chữ đổi cách đọc khi làm trợ từ.' },
          { jp: 'いきます。', kana: 'いきます。', romaji: 'ikimasu.', vi: 'tôi đi.' },
          { jp: 'あさ、', kana: 'あさ、', romaji: 'Asa,', vi: 'Buổi sáng,' },
          { jp: 'ごぜん9時から', kana: 'ごぜんくじから', romaji: 'gozen ku-ji kara', vi: 'từ 9 giờ sáng', warn: '9時 = くじ. KHÔNG PHẢI きゅうじ — đây là lỗi sai phổ biến nhất của bài này.' },
          { jp: 'ごご5時はんまで', kana: 'ごごごじはんまで', romaji: 'gogo go-ji han made', vi: 'đến 5 rưỡi chiều', warn: 'BA CHỮ ご LIỀN NHAU: ご-ご-ご-じ. Đọc chậm, tách rõ, đây là chỗ vấp kinh điển.' },
          { jp: '会社で', kana: 'かいしゃで', romaji: 'kaisha de', vi: 'ở công ty', warn: 'で khác へ ở trên: へ = đi ĐẾN, で = làm việc TẠI. Cặp đối chiếu ra đề rất nhiều.' },
          { jp: 'はたらきます。', kana: 'はたらきます。', romaji: 'hatarakimasu.', vi: 'tôi làm việc.' },
          { jp: '土曜日のごぜん、', kana: 'どようびのごぜん、', romaji: 'Doyoubi no gozen,', vi: 'Sáng thứ Bảy,' },
          { jp: 'しんぶんを', kana: 'しんぶんを', romaji: 'shinbun o', vi: 'báo' },
          { jp: 'よみます。', kana: 'よみます。', romaji: 'yomimasu.', vi: 'tôi đọc.' },
          { jp: 'ごご、', kana: 'ごご、', romaji: 'Gogo,', vi: 'Buổi chiều,' },
          { jp: 'うちで', kana: 'うちで', romaji: 'uchi de', vi: 'ở nhà' },
          { jp: 'DVDを', kana: 'ディーブイディーを', romaji: 'DVD o', vi: 'DVD', warn: 'DVD đọc từng chữ cái kiểu Nhật: ディー・ブイ・ディー. Đừng đọc theo tiếng Anh.' },
          { jp: 'みます。', kana: 'みます。', romaji: 'mimasu.', vi: 'tôi xem.' },
          { jp: '日曜日、', kana: 'にちようび、', romaji: 'Nichiyoubi,', vi: 'Chủ Nhật,' },
          { jp: 'こうえんで', kana: 'こうえんで', romaji: 'kouen de', vi: 'ở công viên' },
          { jp: 'テニスを', kana: 'テニスを', romaji: 'tenisu o', vi: 'quần vợt' },
          { jp: 'します。', kana: 'します。', romaji: 'shimasu.', vi: 'tôi chơi.' },
        ],
      },
    ],
    kanji: [
      { c: '私', yomi: 'わたし', vi: 'tôi (TƯ)' },
      { c: '日本人', yomi: 'にほんじん', vi: 'người Nhật (NHẬT BẢN NHÂN)' },
      { c: '月曜日', yomi: 'げつようび', vi: 'thứ Hai (NGUYỆT DIỆU NHẬT)' },
      { c: '金曜日', yomi: 'きんようび', vi: 'thứ Sáu (KIM DIỆU NHẬT)' },
      { c: '土曜日', yomi: 'どようび', vi: 'thứ Bảy (THỔ DIỆU NHẬT)' },
      { c: '日曜日', yomi: 'にちようび', vi: 'Chủ Nhật (NHẬT DIỆU NHẬT)' },
      { c: '会社', yomi: 'かいしゃ', vi: 'công ty (HỘI XÃ)' },
      { c: '時', yomi: 'じ', vi: 'giờ (THỜI) — ra đề 66 lần' },
    ],
    tips: [
      'Bài KHÓ vì dồn đủ mọi loại số cùng một chỗ. Trước khi đọc, khoanh hết 月/金/土/日曜日 và 9時/5時はん rồi đọc thầm chúng — 10 giây đó cứu cả bài.',
      'Ba trợ từ nơi chốn khác nhau trong một bài: へ (đến), で (tại công ty), で (tại nhà/công viên). Đọc rõ từng chữ.',
    ],
  },

  /* ─────────────── 6 ─────────────── */
  {
    n: 6,
    title: 'Hội thoại — món oyakodon',
    level: 'medium',
    lines: [
      {
        speaker: 'A',
        chunks: [
          { jp: 'あれは', kana: 'あれは', romaji: 'Are wa', vi: 'Kia thì' },
          { jp: 'なんですか。', kana: 'なんですか。', romaji: 'nan desu ka.', vi: 'là cái gì vậy?', warn: 'なんですか đọc LIỀN một hơi, đừng ngắt giữa なん và です.' },
        ],
      },
      {
        speaker: 'B',
        chunks: [{ jp: 'おやこどんです。', kana: 'おやこどんです。', romaji: 'Oyakodon desu.', vi: 'Là oyakodon.' }],
      },
      {
        speaker: 'A',
        chunks: [
          { jp: 'おやこどん？', kana: 'おやこどん？', romaji: 'Oyakodon?', vi: 'Oyakodon?', warn: 'Câu hỏi lại — lên giọng ở cuối, hơi ngạc nhiên. Giám thị nghe ra đây là hội thoại nhờ chỗ này.' },
          { jp: 'おやこどんは', kana: 'おやこどんは', romaji: 'Oyakodon wa', vi: 'Oyakodon thì' },
          { jp: 'なにの', kana: 'なにの', romaji: 'nani no', vi: 'là món' },
          { jp: 'りょうりですか。', kana: 'りょうりですか。', romaji: 'ryouri desu ka.', vi: 'gì vậy?' },
        ],
      },
      {
        speaker: 'B',
        chunks: [
          { jp: 'とりにくと', kana: 'とりにくと', romaji: 'Toriniku to', vi: 'Là món làm từ thịt gà và' },
          { jp: 'たまごの', kana: 'たまごの', romaji: 'tamago no', vi: 'trứng.' },
          { jp: 'りょうりです。', kana: 'りょうりです。', romaji: 'ryouri desu.', vi: '' },
        ],
      },
      {
        speaker: 'A',
        chunks: [
          { jp: '「たまご」は', kana: '「たまご」は', romaji: '"Tamago" wa', vi: '"Tamago" thì' },
          { jp: 'えいごで', kana: 'えいごで', romaji: 'eigo de', vi: 'trong tiếng Anh' },
          { jp: 'なんですか。', kana: 'なんですか。', romaji: 'nan desu ka.', vi: 'gọi là gì?', warn: 'えいごで = "bằng tiếng Anh" — で ở đây là phương tiện, không phải nơi chốn.' },
        ],
      },
      {
        speaker: 'B',
        chunks: [{ jp: '「egg」です。', kana: '「エッグ」です。', romaji: '"Eggu" desu.', vi: 'Là "egg".' }],
      },
    ],
    kanji: [],
    tips: [
      'Bài không có chữ Hán nào — toàn kana. Nếu kana chắc thì bài này rất nhẹ.',
      'Đọc HAI VAI với nhịp khác nhau: A hỏi thì lên giọng cuối câu, B trả lời thì xuống giọng. Đây là điểm giám thị đánh giá "đọc thành câu" hay không.',
    ],
  },

  /* ─────────────── 7 ─────────────── */
  {
    n: 7,
    title: 'Hội thoại nhà hàng (dài nhất)',
    level: 'hard',
    lines: [
      {
        speaker: 'てんいん (nhân viên)',
        chunks: [
          { jp: 'いらっしゃいませ。', kana: 'いらっしゃいませ。', romaji: 'Irasshaimase.', vi: 'Xin mời vào.', warn: 'CÓ っ: い-らっ-しゃ-い-ま-せ. Học như một khối âm thanh, đừng phân tích ngữ pháp.' },
          { jp: 'こんにちは。', kana: 'こんにちは。', romaji: 'Konnichiwa.', vi: 'Xin chào.' },
          { jp: 'なんめいさまですか。', kana: 'なんめいさまですか。', romaji: 'Nanmeisama desu ka.', vi: 'Quý khách mấy người ạ?' },
        ],
      },
      {
        speaker: 'ダニエル',
        chunks: [{ jp: '三人です。', kana: 'さんにんです。', romaji: 'San-nin desu.', vi: 'Ba người.', warn: '三人 = さんにん. Nhớ ひとり (1) và ふたり (2) mới là hai chỗ bất quy tắc.' }],
      },
      {
        speaker: 'てんいん',
        chunks: [
          { jp: 'きんえんせきと', kana: 'きんえんせきと', romaji: 'Kin-en-seki to', vi: 'Chỗ cấm hút thuốc và' },
          { jp: 'きつえんせき、', kana: 'きつえんせき、', romaji: 'kitsuen-seki,', vi: 'chỗ được hút thuốc,' },
          { jp: 'どちらを', kana: 'どちらを', romaji: 'dochira o', vi: 'quý khách dùng' },
          { jp: 'ごりようですか。', kana: 'ごりようですか。', romaji: 'goriyou desu ka.', vi: 'bên nào ạ?', warn: 'きんえん (cấm hút) ≠ きつえん (hút thuốc) — hai từ chỉ khác một âm mà nghĩa ngược nhau.' },
        ],
      },
      {
        speaker: 'ダニエル',
        chunks: [{ jp: 'きんえんせきをおねがいします。', kana: 'きんえんせきをおねがいします。', romaji: 'Kin-en-seki o onegaishimasu.', vi: 'Cho tôi chỗ cấm hút thuốc.' }],
      },
      {
        speaker: 'てんいん',
        chunks: [
          { jp: 'はい、', kana: 'はい、', romaji: 'Hai,', vi: 'Vâng,' },
          { jp: 'こちらへどうぞ。', kana: 'こちらへどうぞ。', romaji: 'kochira e douzo.', vi: 'mời đi lối này.' },
        ],
      },
      {
        speaker: 'パク',
        chunks: [
          { jp: 'すみません！', kana: 'すみません！', romaji: 'Sumimasen!', vi: 'Xin lỗi!' },
          { jp: 'ちゅうもんをおねがいします。', kana: 'ちゅうもんをおねがいします。', romaji: 'Chuumon o onegaishimasu.', vi: 'Cho tôi gọi món.' },
        ],
      },
      {
        speaker: 'ワン',
        chunks: [
          { jp: '私、', kana: 'わたし、', romaji: 'Watashi,', vi: 'Tôi thì,' },
          { jp: 'ハンバーグと', kana: 'ハンバーグと', romaji: 'hanbaagu to', vi: 'thịt viên sốt và' },
          { jp: 'ライス。', kana: 'ライス。', romaji: 'raisu.', vi: 'cơm.' },
        ],
      },
      {
        speaker: 'ダニエル',
        chunks: [
          { jp: '私も', kana: 'わたしも', romaji: 'Watashi mo', vi: 'Tôi CŨNG' },
          { jp: 'ハンバーグと', kana: 'ハンバーグと', romaji: 'hanbaagu to', vi: 'thịt viên sốt và' },
          { jp: 'ライス。', kana: 'ライス。', romaji: 'raisu.', vi: 'cơm.' },
          { jp: 'それから、', kana: 'それから、', romaji: 'Sorekara,', vi: 'Với lại,' },
          { jp: 'このビールは', kana: 'このビールは', romaji: 'kono biiru wa', vi: 'bia này' },
          { jp: 'どこの', kana: 'どこの', romaji: 'doko no', vi: 'là bia' },
          { jp: 'ビールですか。', kana: 'ビールですか。', romaji: 'biiru desu ka.', vi: 'của nước nào?', warn: 'ビール (bia) chứ không phải ビル (toà nhà) — kéo dài ー.' },
        ],
      },
      {
        speaker: 'てんいん',
        chunks: [{ jp: 'ドイツの ビールです。', kana: 'ドイツの ビールです。', romaji: 'Doitsu no biiru desu.', vi: 'Là bia Đức ạ.' }],
      },
      {
        speaker: 'ダニエル',
        chunks: [
          { jp: 'じゃ、', kana: 'じゃ、', romaji: 'Ja,', vi: 'Vậy thì,' },
          { jp: 'ビールを', kana: 'ビールを', romaji: 'biiru o', vi: 'cho hai cốc bia' },
          { jp: '2つください。', kana: 'ふたつください。', romaji: 'futatsu kudasai.', vi: '', warn: '2つ = ふたつ. KHÔNG đọc につ — bộ đếm ひとつ〜とお bất quy tắc hoàn toàn.' },
        ],
      },
      {
        speaker: 'パク',
        chunks: [
          { jp: 'これは', kana: 'これは', romaji: 'Kore wa', vi: 'Đây là' },
          { jp: 'なんの', kana: 'なんの', romaji: 'nan no', vi: 'cà ri' },
          { jp: 'カレーですか。', kana: 'カレーですか。', romaji: 'karee desu ka.', vi: 'loại gì vậy?' },
        ],
      },
      {
        speaker: 'てんいん',
        chunks: [
          { jp: 'とりにくと', kana: 'とりにくと', romaji: 'Toriniku to', vi: 'Là cà ri gà và' },
          { jp: 'やさいの', kana: 'やさいの', romaji: 'yasai no', vi: 'rau ạ.' },
          { jp: 'カレーです。', kana: 'カレーです。', romaji: 'karee desu.', vi: '' },
        ],
      },
      {
        speaker: 'てんいん',
        chunks: [
          { jp: 'はい、', kana: 'はい、', romaji: 'Hai,', vi: 'Vâng,' },
          { jp: 'ハンバーグを 2つと', kana: 'ハンバーグを ふたつと', romaji: 'hanbaagu o futatsu to', vi: 'hai phần thịt viên,' },
          { jp: 'ライスを 2つと', kana: 'ライスを ふたつと', romaji: 'raisu o futatsu to', vi: 'hai phần cơm,' },
          { jp: 'カレーを 1つと', kana: 'カレーを ひとつと', romaji: 'karee o hitotsu to', vi: 'một cà ri' },
          { jp: 'ビールを 3つですね。', kana: 'ビールを みっつですね。', romaji: 'biiru o mittsu desu ne.', vi: 'và ba bia, đúng không ạ?', warn: 'BA BỘ ĐẾM LIỀN NHAU: ふたつ・ひとつ・みっつ. Cụm khó nhất cả ngân hàng — luyện riêng 20 lần.' },
        ],
      },
      {
        speaker: 'てんいん',
        chunks: [
          { jp: 'かしこまりました。', kana: 'かしこまりました。', romaji: 'Kashikomarimashita.', vi: 'Vâng ạ.' },
          { jp: 'しょうしょうおまちください。', kana: 'しょうしょうおまちください。', romaji: 'Shoushou omachi kudasai.', vi: 'Xin quý khách đợi một chút.' },
        ],
      },
    ],
    kanji: [
      { c: '三人', yomi: 'さんにん', vi: 'ba người (TAM NHÂN)' },
      { c: '私', yomi: 'わたし', vi: 'tôi (TƯ)' },
      { c: '2つ', yomi: 'ふたつ', vi: 'hai cái' },
      { c: '1つ', yomi: 'ひとつ', vi: 'một cái' },
      { c: '3つ', yomi: 'みっつ', vi: 'ba cái' },
    ],
    tips: [
      'Bài DÀI NHẤT và khó nhất về từ ngữ: kính ngữ nhà hàng (いらっしゃいませ, ごりよう, かしこまりました, しょうしょうおまちください) chưa từng được dạy trong giáo trình.',
      'Bạn chỉ cần ĐỌC ĐÚNG, không cần hiểu ngữ pháp. Học từng câu kính ngữ như một khối âm thanh, nghe mẫu 10 lần rồi nhại.',
      'Chỗ chết người là câu tổng kết đơn cuối bài với ba bộ đếm liền nhau. Tách riêng ra luyện trước, rồi mới ghép vào bài.',
    ],
  },

  /* ─────────────── 8 ─────────────── */
  {
    n: 8,
    title: 'Hội thoại — thói quen buổi tối',
    level: 'medium',
    lines: [
      {
        speaker: 'A',
        chunks: [
          { jp: 'Bさん、', kana: 'ビーさん、', romaji: 'B-san,', vi: 'B ơi,' },
          { jp: 'まいばん、', kana: 'まいばん、', romaji: 'maiban,', vi: 'mỗi tối,' },
          { jp: '何時にねますか。', kana: 'なんじにねますか。', romaji: 'nanji ni nemasu ka.', vi: 'bạn ngủ lúc mấy giờ?', warn: '何時 = なんじ. に đánh dấu MỐC GIỜ — mẫu chắc chắn có trong phần hỏi đáp.' },
        ],
      },
      {
        speaker: 'B',
        chunks: [{ jp: '12時にねます。', kana: 'じゅうにじにねます。', romaji: 'Juuni-ji ni nemasu.', vi: 'Tôi ngủ lúc 12 giờ.' }],
      },
      {
        speaker: 'A',
        chunks: [
          { jp: 'そうですか。', kana: 'そうですか。', romaji: 'Sou desu ka.', vi: 'Vậy à.' },
          { jp: 'よる、', kana: 'よる、', romaji: 'Yoru,', vi: 'Buổi tối,' },
          { jp: '何をしますか。', kana: 'なにをしますか。', romaji: 'nani o shimasu ka.', vi: 'bạn làm gì?', warn: '何 ở đây đọc なに (không phải なん) vì đi với を. 何時 thì đọc なん.' },
        ],
      },
      {
        speaker: 'B',
        chunks: [
          { jp: 'インターネットをします。', kana: 'インターネットをします。', romaji: 'Intaanetto o shimasu.', vi: 'Tôi lướt internet.' },
          { jp: '本をよみます。', kana: 'ほんをよみます。', romaji: 'Hon o yomimasu.', vi: 'Tôi đọc sách.' },
          { jp: 'Aさんは何をしますか。', kana: 'エーさんはなにをしますか。', romaji: 'A-san wa nani o shimasu ka.', vi: 'Còn A thì làm gì?' },
        ],
      },
      {
        speaker: 'A',
        chunks: [
          { jp: '私はまいばん、', kana: 'わたしはまいばん、', romaji: 'Watashi wa maiban,', vi: 'Mỗi tối tôi' },
          { jp: 'べんきょうします。', kana: 'べんきょうします。', romaji: 'benkyou shimasu.', vi: 'học bài.' },
        ],
      },
      {
        speaker: 'B',
        chunks: [
          { jp: '何時から何時まで', kana: 'なんじからなんじまで', romaji: 'Nanji kara nanji made', vi: 'Từ mấy giờ đến mấy giờ' },
          { jp: 'べんきょうしますか。', kana: 'べんきょうしますか。', romaji: 'benkyou shimasu ka.', vi: 'bạn học?', warn: '何時から何時まで — mẫu から…まで chắc chắn ra đề. Đọc liền mạch, ngắt sau まで.' },
        ],
      },
      {
        speaker: 'A',
        chunks: [
          { jp: '8時から12時まで', kana: 'はちじからじゅうにじまで', romaji: 'Hachi-ji kara juuni-ji made', vi: 'Từ 8 giờ đến 12 giờ' },
          { jp: 'べんきょうします。', kana: 'べんきょうします。', romaji: 'benkyou shimasu.', vi: 'tôi học.' },
        ],
      },
    ],
    kanji: [
      { c: '何時', yomi: 'なんじ', vi: 'mấy giờ (HÀ THỜI)' },
      { c: '何', yomi: 'なに / なん', vi: 'cái gì (HÀ) — ra đề 57 lần' },
      { c: '本', yomi: 'ほん', vi: 'sách (BẢN)' },
      { c: '私', yomi: 'わたし', vi: 'tôi (TƯ)' },
      { c: '時', yomi: 'じ', vi: 'giờ (THỜI)' },
    ],
    tips: [
      'Bài này dạy đúng một điểm quan trọng: 何 có HAI cách đọc. 何時 = なんじ, 何を = なにを. Nhớ luật: trước じ thì なん, trước を thì なに.',
      'Hội thoại hai vai — đổi nhịp giọng để nghe ra hai người.',
    ],
  },

  /* ─────────────── 9 ─────────────── */
  {
    n: 9,
    title: 'Một ngày của tôi — MỌI SỐ VIẾT BẰNG KANJI',
    level: 'hard',
    lines: [
      {
        chunks: [
          { jp: '私は日本語学校の', kana: 'わたしはにほんごがっこうの', romaji: 'Watashi wa nihongo gakkou no', vi: 'Tôi là của trường Nhật ngữ' },
          { jp: '学生です。', kana: 'がくせいです。', romaji: 'gakusei desu.', vi: 'học sinh.' },
          { jp: '日本人ではありません。', kana: 'にほんじんではありません。', romaji: 'Nihonjin de wa arimasen.', vi: 'Tôi không phải người Nhật.', warn: 'ではありません — chữ は giữa câu vẫn đọc "wa". Đây là phủ định của DANH TỪ.' },
          { jp: 'ともだちと私は', kana: 'ともだちとわたしは', romaji: 'Tomodachi to watashi wa', vi: 'Bạn tôi và tôi thì' },
          { jp: 'ベトナム人や', kana: 'ベトナムじんや', romaji: 'Betonamu-jin ya', vi: 'là người Việt Nam,' },
          { jp: '中国人などです。', kana: 'ちゅうごくじんなどです。', romaji: 'chuugoku-jin nado desu.', vi: 'người Trung Quốc và những nước khác.', warn: 'や…など = liệt kê VÍ DỤ (còn nữa), khác と = liệt kê ĐẦY ĐỦ.' },
          { jp: '月曜日から', kana: 'げつようびから', romaji: 'Getsuyoubi kara', vi: 'Từ thứ Hai' },
          { jp: '金曜日まで、', kana: 'きんようびまで、', romaji: 'kinyoubi made,', vi: 'đến thứ Sáu,' },
          { jp: 'まいにち九時から', kana: 'まいにちくじから', romaji: 'mainichi ku-ji kara', vi: 'mỗi ngày từ 9 giờ', warn: '九時 = くじ. Số viết bằng kanji nên không có gợi ý gì — phải thuộc.' },
          { jp: '四時まで', kana: 'よじまで', romaji: 'yo-ji made', vi: 'đến 4 giờ', warn: '四時 = よじ. KHÔNG BAO GIỜ よんじ hay しじ.' },
          { jp: '日本語を勉強します。', kana: 'にほんごをべんきょうします。', romaji: 'nihongo o benkyou shimasu.', vi: 'tôi học tiếng Nhật.' },
          { jp: '土曜日と日曜日は', kana: 'どようびとにちようびは', romaji: 'Doyoubi to nichiyoubi wa', vi: 'Thứ Bảy và Chủ Nhật thì' },
          { jp: '学校に行きません。', kana: 'がっこうにいきません。', romaji: 'gakkou ni ikimasen.', vi: 'tôi không đi học.', warn: '行きません — ĐỘNG TỪ phủ định bằng ません, khác ではありません của danh từ ở trên.' },
          { jp: '私は「はたち」です。', kana: 'わたしは「はたち」です。', romaji: 'Watashi wa "hatachi" desu.', vi: 'Tôi 20 tuổi.' },
          { jp: '日本語の本が', kana: 'にほんごのほんが', romaji: 'Nihongo no hon ga', vi: 'Sách tiếng Nhật thì' },
          { jp: '三つあります。', kana: 'みっつあります。', romaji: 'mittsu arimasu.', vi: 'tôi có ba quyển.', warn: '三つ = みっつ (bộ đếm bất quy tắc), KHÔNG phải さんつ.' },
          { jp: 'まいにち三時間', kana: 'まいにちさんじかん', romaji: 'Mainichi san-jikan', vi: 'Mỗi ngày ba tiếng', warn: '三時間 = さんじかん (khoảng thời gian), khác 三時 = さんじ (mốc giờ). Một chữ 間 đổi cả nghĩa.' },
          { jp: '日本語をべんきょうします。', kana: 'にほんごをべんきょうします。', romaji: 'nihongo o benkyou shimasu.', vi: 'tôi học tiếng Nhật.' },
          { jp: 'これは私の一日です。', kana: 'これはわたしのいちにちです。', romaji: 'Kore wa watashi no ichinichi desu.', vi: 'Đây là một ngày của tôi.', warn: '一日 = いちにち (một ngày). Nếu là NGÀY MÙNG 1 thì lại đọc ついたち — cùng mặt chữ, hai cách đọc.' },
          { jp: 'あさ七時におきます。', kana: 'あさしちじにおきます。', romaji: 'Asa shichi-ji ni okimasu.', vi: 'Buổi sáng tôi dậy lúc 7 giờ.', warn: '七時 = しちじ, không phải ななじ.' },
          { jp: '学校で日本語を', kana: 'がっこうでにほんごを', romaji: 'Gakkou de nihongo o', vi: 'Ở trường tiếng Nhật' },
          { jp: 'べんきょうします。', kana: 'べんきょうします。', romaji: 'benkyou shimasu.', vi: 'tôi học.' },
          { jp: 'うちで本をよみます。', kana: 'うちでほんをよみます。', romaji: 'Uchi de hon o yomimasu.', vi: 'Ở nhà tôi đọc sách.' },
          { jp: 'よる十一時にねます。', kana: 'よるじゅういちじにねます。', romaji: 'Yoru juuichi-ji ni nemasu.', vi: 'Buổi tối 11 giờ tôi đi ngủ.' },
        ],
      },
    ],
    kanji: [
      { c: '九時', yomi: 'くじ', vi: '9 giờ (CỬU THỜI)' },
      { c: '四時', yomi: 'よじ', vi: '4 giờ (TỨ THỜI)' },
      { c: '七時', yomi: 'しちじ', vi: '7 giờ (THẤT THỜI)' },
      { c: '十一時', yomi: 'じゅういちじ', vi: '11 giờ' },
      { c: '三つ', yomi: 'みっつ', vi: 'ba cái (TAM)' },
      { c: '三時間', yomi: 'さんじかん', vi: 'ba tiếng đồng hồ (TAM THỜI GIAN)' },
      { c: '一日', yomi: 'いちにち', vi: 'một ngày (NHẤT NHẬT)' },
      { c: '中国人', yomi: 'ちゅうごくじん', vi: 'người Trung Quốc (TRUNG QUỐC NHÂN)' },
      { c: '勉強', yomi: 'べんきょう', vi: 'học tập (MIỄN CƯỠNG)' },
      { c: '行きません', yomi: 'いきません', vi: 'không đi (HÀNH)' },
      { c: '本', yomi: 'ほん', vi: 'sách (BẢN)' },
    ],
    tips: [
      'BÀI KHÓ NHẤT NGÂN HÀNG: mọi con số đều viết bằng kanji, không có kana gợi ý.',
      'BẮT BUỘC làm trước khi đọc: khoanh 九時・四時・三つ・三時間・七時・十一時・一日, đọc thầm chúng một lượt. Mười giây đó là khác biệt giữa đọc trôi và đứng hình.',
      'Bài này cũng dạy cặp phủ định: DANH TỪ → ではありません, ĐỘNG TỪ → ません. Ra đề rất dày.',
    ],
  },

  /* ─────────────── 10 ─────────────── */
  {
    n: 10,
    title: 'Thầy Tanaka đi làm',
    level: 'medium',
    lines: [
      {
        chunks: [
          { jp: 'たなかさんは毎日', kana: 'たなかさんはまいにち', romaji: 'Tanaka-san wa mainichi', vi: 'Anh Tanaka mỗi ngày' },
          { jp: '会社にいきます。', kana: 'かいしゃにいきます。', romaji: 'kaisha ni ikimasu.', vi: 'đi đến công ty.', warn: '会社に いきます = ĐÍCH ĐẾN.' },
          { jp: 'たなかさんは会社で', kana: 'たなかさんはかいしゃで', romaji: 'Tanaka-san wa kaisha de', vi: 'Anh Tanaka ở công ty' },
          { jp: 'はたらきます。', kana: 'はたらきます。', romaji: 'hatarakimasu.', vi: 'làm việc.', warn: '会社で はたらきます = NƠI DIỄN RA. Cặp に ≠ で này là cặp đối chiếu kinh điển nhất của cả môn.' },
          { jp: '会社でたなかさんは', kana: 'かいしゃでたなかさんは', romaji: 'Kaisha de Tanaka-san wa', vi: 'Ở công ty anh Tanaka' },
          { jp: '日本語をおしえます。', kana: 'にほんごをおしえます。', romaji: 'nihongo o oshiemasu.', vi: 'dạy tiếng Nhật.' },
          { jp: 'たなかさんは日本語の', kana: 'たなかさんはにほんごの', romaji: 'Tanaka-san wa nihongo no', vi: 'Anh Tanaka là giáo viên' },
          { jp: '先生です。', kana: 'せんせいです。', romaji: 'sensei desu.', vi: 'tiếng Nhật.' },
          { jp: 'せいとはベトナム人です。', kana: 'せいとはベトナムじんです。', romaji: 'Seito wa Betonamu-jin desu.', vi: 'Học trò là người Việt Nam.' },
          { jp: 'せいとは毎日', kana: 'せいとはまいにち', romaji: 'Seito wa mainichi', vi: 'Học trò mỗi ngày' },
          { jp: '日本語をべんきょうします。', kana: 'にほんごをべんきょうします。', romaji: 'nihongo o benkyou shimasu.', vi: 'học tiếng Nhật.' },
        ],
      },
    ],
    kanji: [
      { c: '毎日', yomi: 'まいにち', vi: 'mỗi ngày (MỖI NHẬT)' },
      { c: '会社', yomi: 'かいしゃ', vi: 'công ty (HỘI XÃ)' },
      { c: '日本語', yomi: 'にほんご', vi: 'tiếng Nhật' },
      { c: '先生', yomi: 'せんせい', vi: 'giáo viên (TIÊN SINH)' },
      { c: '人', yomi: 'じん', vi: 'người (NHÂN)' },
    ],
    tips: [
      'Bài ngắn, khuôn lặp lại nhiều. Điểm học duy nhất: に (đích đến) ≠ で (nơi làm việc) — đọc rõ hai chữ này.',
      'Chú ý おしえます (dạy) ở giữa bài, khác べんきょうします (học) ở cuối bài.',
    ],
  },

  /* ─────────────── 11 ─────────────── */
  {
    n: 11,
    title: 'Bài 5 viết có dấu cách (bài tặng điểm)',
    level: 'easy',
    lines: [
      {
        chunks: [
          { jp: '私 は たなか です。', kana: 'わたし は たなか です。', romaji: 'Watashi wa Tanaka desu.', vi: 'Tôi là Tanaka.' },
          { jp: '日本人です。', kana: 'にほんじんです。', romaji: 'Nihonjin desu.', vi: 'Tôi là người Nhật.' },
          { jp: '私 は かいしゃいん です。', kana: 'わたし は かいしゃいん です。', romaji: 'Watashi wa kaishain desu.', vi: 'Tôi là nhân viên công ty.' },
          { jp: '月曜日から金曜日まで、', kana: 'げつようびからきんようびまで、', romaji: 'Getsuyoubi kara kinyoubi made,', vi: 'Từ thứ Hai đến thứ Sáu,' },
          { jp: 'かいしゃ へ いきます。', kana: 'かいしゃ へ いきます。', romaji: 'kaisha e ikimasu.', vi: 'tôi đến công ty.' },
          { jp: 'あさ、ごぜん9時 から', kana: 'あさ、ごぜんくじ から', romaji: 'Asa, gozen ku-ji kara', vi: 'Buổi sáng, từ 9 giờ sáng' },
          { jp: 'ごご5時半まで', kana: 'ごごごじはんまで', romaji: 'gogo go-ji han made', vi: 'đến 5 rưỡi chiều' },
          { jp: 'かいしゃではたらきます。', kana: 'かいしゃではたらきます。', romaji: 'kaisha de hatarakimasu.', vi: 'tôi làm việc ở công ty.' },
          { jp: '土曜日のごぜん、', kana: 'どようびのごぜん、', romaji: 'Doyoubi no gozen,', vi: 'Sáng thứ Bảy,' },
          { jp: 'しんぶんをよみます。', kana: 'しんぶんをよみます。', romaji: 'shinbun o yomimasu.', vi: 'tôi đọc báo.' },
          { jp: 'ごご、うちでDVDをみます。', kana: 'ごご、うちでディーブイディーをみます。', romaji: 'Gogo, uchi de DVD o mimasu.', vi: 'Buổi chiều, tôi xem DVD ở nhà.' },
          { jp: '日曜日、こうえんで', kana: 'にちようび、こうえんで', romaji: 'Nichiyoubi, kouen de', vi: 'Chủ Nhật, ở công viên' },
          { jp: 'テニスをします。', kana: 'テニスをします。', romaji: 'tenisu o shimasu.', vi: 'tôi chơi quần vợt.' },
        ],
      },
    ],
    kanji: [
      { c: '私', yomi: 'わたし', vi: 'tôi (TƯ)' },
      { c: '日本人', yomi: 'にほんじん', vi: 'người Nhật' },
      { c: '月曜日', yomi: 'げつようび', vi: 'thứ Hai' },
      { c: '金曜日', yomi: 'きんようび', vi: 'thứ Sáu' },
      { c: '土曜日', yomi: 'どようび', vi: 'thứ Bảy' },
      { c: '日曜日', yomi: 'にちようび', vi: 'Chủ Nhật' },
      { c: '5時半', yomi: 'ごじはん', vi: '5 rưỡi (BÁN = rưỡi)' },
    ],
    tips: [
      'Nội dung Y HỆT bài 5, chỉ viết tách chữ và nhiều kana hơn. Luyện bài 5 xong thì bài này miễn phí.',
      'CHỖ TÁCH CHỮ CHÍNH LÀ CHỖ NÊN LẤY HƠI — đề đã ngắt cụm sẵn giúp bạn. Bốc trúng bài này coi như trúng số.',
    ],
  },

  /* ─────────────── 12 ─────────────── */
  {
    n: 12,
    title: 'Wan — vừa học vừa làm thêm',
    level: 'medium',
    lines: [
      {
        chunks: [
          { jp: '私はワンです。', kana: 'わたしはワンです。', romaji: 'Watashi wa Wan desu.', vi: 'Tôi là Wan.' },
          { jp: '私は日本語学校の', kana: 'わたしはにほんごがっこうの', romaji: 'Watashi wa nihongo gakkou no', vi: 'Tôi là của trường Nhật ngữ' },
          { jp: '学生です。', kana: 'がくせいです。', romaji: 'gakusei desu.', vi: 'học sinh.' },
          { jp: '月曜日から金曜日まで、', kana: 'げつようびからきんようびまで、', romaji: 'Getsuyoubi kara kinyoubi made,', vi: 'Từ thứ Hai đến thứ Sáu,' },
          { jp: '学校へいきます。', kana: 'がっこうへいきます。', romaji: 'gakkou e ikimasu.', vi: 'tôi đi học.' },
          { jp: 'あさ、9時から', kana: 'あさ、くじから', romaji: 'Asa, ku-ji kara', vi: 'Buổi sáng, từ 9 giờ' },
          { jp: '12時半まで', kana: 'じゅうにじはんまで', romaji: 'juuni-ji han made', vi: 'đến 12 rưỡi', warn: '12時半 = じゅうにじ はん.' },
          { jp: '日本語を勉強します。', kana: 'にほんごをべんきょうします。', romaji: 'nihongo o benkyou shimasu.', vi: 'tôi học tiếng Nhật.' },
          { jp: 'しゅうまつ、', kana: 'しゅうまつ、', romaji: 'Shuumatsu,', vi: 'Cuối tuần,' },
          { jp: 'としょかんへいきます。', kana: 'としょかんへいきます。', romaji: 'toshokan e ikimasu.', vi: 'tôi đến thư viện.' },
          { jp: 'としょかんで、', kana: 'としょかんで、', romaji: 'Toshokan de,', vi: 'Ở thư viện,' },
          { jp: 'ほんをよみます。', kana: 'ほんをよみます。', romaji: 'hon o yomimasu.', vi: 'tôi đọc sách.' },
          { jp: '水曜日と土曜日、', kana: 'すいようびとどようび、', romaji: 'Suiyoubi to doyoubi,', vi: 'Thứ Tư và thứ Bảy,' },
          { jp: 'コンビニで', kana: 'コンビニで', romaji: 'konbini de', vi: 'ở cửa hàng tiện lợi' },
          { jp: 'アルバイトをします。', kana: 'アルバイトをします。', romaji: 'arubaito o shimasu.', vi: 'tôi làm thêm.' },
          { jp: '4時から8時まで', kana: 'よじからはちじまで', romaji: 'Yo-ji kara hachi-ji made', vi: 'Từ 4 giờ đến 8 giờ', warn: '4時 = よじ. Đây là LỖI SAI PHỔ BIẾN NHẤT ở bài này — không bao giờ đọc よんじ hay しじ.' },
          { jp: '働きます。', kana: 'はたらきます。', romaji: 'hatarakimasu.', vi: 'tôi làm việc.', warn: '働きます — cùng nghĩa với はたらきます ở bài 5 nhưng viết bằng kanji. Chữ 働 (ĐỘNG) chỉ xuất hiện ở bài này.' },
        ],
      },
    ],
    kanji: [
      { c: '私', yomi: 'わたし', vi: 'tôi (TƯ)' },
      { c: '日本語学校', yomi: 'にほんごがっこう', vi: 'trường Nhật ngữ' },
      { c: '学生', yomi: 'がくせい', vi: 'học sinh' },
      { c: '水曜日', yomi: 'すいようび', vi: 'thứ Tư (THUỶ DIỆU NHẬT)' },
      { c: '12時半', yomi: 'じゅうにじはん', vi: '12 rưỡi' },
      { c: '4時', yomi: 'よじ', vi: '4 giờ' },
      { c: '8時', yomi: 'はちじ', vi: '8 giờ' },
      { c: '働きます', yomi: 'はたらきます', vi: 'làm việc (ĐỘNG)' },
      { c: '勉強', yomi: 'べんきょう', vi: 'học tập (MIỄN CƯỠNG)' },
    ],
    tips: [
      'Bài này có 4時 = よじ ở gần cuối, đúng chỗ người đọc đã mệt và dễ buông. Luyện riêng cụm 4時から8時まで.',
      'Chú ý 働きます viết bằng kanji — chữ này KHÔNG xuất hiện ở bài 5 (bài đó viết はたらきます bằng kana).',
    ],
  },

  /* ─────────────── 13 ─────────────── */
  {
    n: 13,
    title: 'Gupta — học nhạc ở Nhật',
    level: 'easy',
    lines: [
      {
        chunks: [
          { jp: '私はグプタです。', kana: 'わたしはグプタです。', romaji: 'Watashi wa Guputa desu.', vi: 'Tôi là Gupta.' },
          { jp: 'アメリカ人です。', kana: 'アメリカじんです。', romaji: 'Amerika-jin desu.', vi: 'Tôi là người Mỹ.' },
          { jp: '私は日本の大学で', kana: 'わたしはにほんのだいがくで', romaji: 'Watashi wa Nihon no daigaku de', vi: 'Tôi ở một trường đại học tại Nhật' },
          { jp: 'おんがくをべんきょうします。', kana: 'おんがくをべんきょうします。', romaji: 'ongaku o benkyou shimasu.', vi: 'học âm nhạc.' },
          { jp: '月曜日から木曜日まで、', kana: 'げつようびからもくようびまで、', romaji: 'Getsuyoubi kara mokuyoubi made,', vi: 'Từ thứ Hai đến thứ Năm,' },
          { jp: '大学でべんきょうします。', kana: 'だいがくでべんきょうします。', romaji: 'daigaku de benkyou shimasu.', vi: 'tôi học ở đại học.' },
          { jp: '金曜日と土曜日に', kana: 'きんようびとどようびに', romaji: 'Kinyoubi to doyoubi ni', vi: 'Thứ Sáu và thứ Bảy' },
          { jp: '「カラオケのみせ」で', kana: '「カラオケのみせ」で', romaji: '"karaoke no mise" de', vi: 'ở "quán karaoke"' },
          { jp: 'アルバイトをします。', kana: 'アルバイトをします。', romaji: 'arubaito o shimasu.', vi: 'tôi làm thêm.' },
          { jp: '日曜日、こうえんで', kana: 'にちようび、こうえんで', romaji: 'Nichiyoubi, kouen de', vi: 'Chủ Nhật, ở công viên' },
          { jp: 'サッカーをします。', kana: 'サッカーをします。', romaji: 'sakkaa o shimasu.', vi: 'tôi đá bóng.' },
        ],
      },
    ],
    kanji: [
      { c: '私', yomi: 'わたし', vi: 'tôi (TƯ)' },
      { c: '人', yomi: 'じん', vi: 'người (NHÂN)' },
      { c: '日本', yomi: 'にほん', vi: 'Nhật Bản (NHẬT BẢN)' },
      { c: '大学', yomi: 'だいがく', vi: 'đại học (ĐẠI HỌC)' },
      { c: '木曜日', yomi: 'もくようび', vi: 'thứ Năm (MỘC DIỆU NHẬT)' },
    ],
    tips: [
      'Bài dễ, khuôn quen thuộc, không có số bất quy tắc nào. Chỉ cần đọc đều và rõ.',
      'グプタ và サッカー là hai cụm katakana duy nhất — chú ý っ trong サッカー.',
    ],
  },
];

/** Luật ngắt — hiện ở đầu khu Đọc to, người học đọc trước khi luyện */
export const CHUNK_RULES = [
  {
    n: 1,
    rule: 'Ngắt SAU trợ từ khi hết một cụm',
    detail: 'は・も・を・に・で・へ・と・から・まで. Ví dụ: わたしは / にほんごがっこうの / がくせいです。',
  },
  {
    n: 2,
    rule: 'Ngắt ở dấu 、và 。',
    detail: 'Dấu 、là chỗ lấy hơi ngắn, dấu 。là chỗ lấy hơi dài và hạ giọng.',
  },
  {
    n: 3,
    rule: 'KHÔNG ngắt giữa một từ',
    detail: '会社員 đọc liền một hơi (かいしゃいん), không tách thành 会社 / 員. Đây chính là lỗi "đọc từng chữ".',
  },
  {
    n: 4,
    rule: 'Từ để hỏi + です đọc liền một hơi',
    detail: 'なんですか, いくらですか, なんじですか — đọc như một khối, đừng ngắt giữa.',
  },
  {
    n: 5,
    rule: 'Trước khi đọc: 10 giây quét kanji',
    detail:
      'Giám thị đưa bài thì ĐỪNG đọc ngay. Quét cả bài, khoanh mọi chữ Hán (nhất là kanji SỐ), đọc thầm chúng một lượt. Mười giây đó ngăn được cú đứng hình giữa câu.',
  },
];

export const READALOUD_STORAGE_KEY = 'jpd113:readaloud:v1';

/** Ghép cả bài thành một chuỗi để đọc liền mạch */
export function pieceFullText(p: ReadPiece): string {
  return p.lines.map((l) => l.chunks.map((c) => c.kana).join('')).join(' ');
}

export function pieceChunkCount(p: ReadPiece): number {
  return p.lines.reduce((s, l) => s + l.chunks.length, 0);
}
