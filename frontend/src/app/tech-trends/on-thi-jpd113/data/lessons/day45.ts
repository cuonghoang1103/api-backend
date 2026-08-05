/**
 * NGÀY 4 — Thi nói, đọc hiểu & kanji · NGÀY 5 — Ngày thi.
 *
 * Ngày 4 là ngày đáng giá nhất về ĐIỂM: phần Nói chiếm 30/45 trọng số bài thi
 * cuối, gấp đôi trắc nghiệm. Ngày 5 không học kiến thức mới — chỉ tổng duyệt
 * và chiến thuật phòng thi.
 */

import type { LessonMap } from './types';

export const DAY45_LESSONS: LessonMap = {
  /* ══════════════════ NGÀY 4 ══════════════════ */

  'd4-read-all13': {
    goal: 'Đọc trôi cả 13 bài, tự nghe lại và tự sửa được lỗi phát âm của mình.',
    parts: [
      {
        type: 'text',
        h: 'READING chấm gì',
        body:
          '30/100 điểm thi nói. Giám thị chấm: đọc ĐÚNG chữ, đủ NHỊP (trường âm, っ, ん), ngắt câu hợp lý ' +
          'và nói đủ TO. Không chấm tốc độ, không chấm giọng hay. Đọc chậm mà chuẩn được điểm cao hơn ' +
          'đọc nhanh mà nuốt chữ.',
      },
      {
        type: 'steps',
        h: 'Cách chạy hết 13 bài trong một buổi',
        items: [
          'Mở tab "Thi nói & đọc" trên trang này — 13 bài đều có sẵn romaji, bản dịch và ghi chú kanji.',
          'Mỗi bài: đọc 2 lượt (một lượt nhìn romaji, một lượt chỉ nhìn tiếng Nhật). Đừng đọc 5 lượt bài dễ rồi hết giờ cho bài khó.',
          'Ghi âm lượt thứ hai bằng điện thoại. Nghe lại NGAY, đánh dấu chỗ vấp.',
          'Chỗ vấp thường rơi vào: số đếm, trường âm, っ. Đọc riêng chỗ đó 5 lần rồi đọc lại cả câu.',
          'Sau khi xong 13 bài, quay lại 3 bài tệ nhất và đọc thêm 3 lượt mỗi bài.',
        ],
      },
      {
        type: 'tip',
        h: 'Vì sao phải GHI ÂM',
        body:
          'Khi đang đọc, não bận giải mã chữ nên không nghe được chính mình. Nghe lại là cách duy nhất ' +
          'phát hiện mình đang nuốt trường âm hay bỏ nhịp っ. Đây là mẹo hiệu quả nhất của cả ngày 4.',
      },
    ],
  },

  'd4-read-30s': {
    goal: 'Dùng hết 30 giây chuẩn bị đúng cách thay vì ngồi im lo lắng.',
    parts: [
      {
        type: 'steps',
        h: 'Làm gì trong 30 giây đó',
        items: [
          'Giây 1-5: đọc lướt cả bài, KHÔNG đọc kỹ. Chỉ để biết bài dài bao nhiêu, có mấy câu.',
          'Giây 5-20: săn ba thứ hay vấp — CON SỐ (giờ, tuổi, ngày), KANJI lạ, và từ KATAKANA dài.',
          'Giây 20-28: nhẩm thầm đúng những chỗ vừa săn được. Không nhẩm cả bài, không kịp đâu.',
          'Giây 28-30: hít sâu một hơi. Bắt đầu đọc với giọng to hơn mức bạn tưởng là đủ.',
        ],
      },
      {
        type: 'warn',
        h: 'Vấp giữa chừng thì làm gì',
        body:
          'Dừng lại, đọc lại TỪ ĐẦU CÂU đó, rồi đi tiếp. Đừng đọc lại cả bài và đừng xin lỗi bằng tiếng Việt. ' +
          'Giám thị chấm cả bài chứ không trừ chết một lỗi.',
      },
    ],
  },

  'd4-kanji-35': {
    goal: 'Nhận mặt và đọc được các chữ Hán hay ra đề nhất, học theo TỪ chứ không theo chữ rời.',
    parts: [
      {
        type: 'text',
        h: 'Chiến lược: 20 từ thay vì 38 chữ',
        body:
          'Toàn bộ 13 bài đọc chỉ có 38 chữ Hán khác nhau, và 10 chữ đầu đã phủ ~70% số lần xuất hiện. ' +
          'Nhưng đừng học chữ rời — trong bài, kanji luôn nằm trong những TỪ lặp đi lặp lại. Học 20 từ là ' +
          'đọc được bài, và 一二三四七九十 với 月火水木金土日 đã nằm sẵn trong đám từ đó.',
      },
      {
        type: 'table',
        h: 'Sáu chữ ra đề nhiều nhất (đếm từ 420 câu FE thật)',
        headers: ['Kanji', 'Nghĩa', 'Đọc', 'Từ ghép mẫu', 'Số lần'],
        rows: [
          ['私', 'tôi', 'わたし', '私は 学生です', '86'],
          ['時', 'giờ', 'じ / とき', '3時 = さんじ', '66'],
          ['何', 'gì, bao nhiêu', 'なに / なん', '何時, 何人, 何曜日', '57'],
          ['生', 'sinh, sống', 'せい / なま', '学生, 誕生日, 先生', '38'],
          ['才', 'tuổi', 'さい', '18才 = じゅうはっさい', '36'],
          ['円', 'yên (tiền)', 'えん', '1000円 = せんえん', '29'],
        ],
      },
      {
        type: 'tip',
        h: 'Dùng khu Lật thẻ trên trang này',
        body:
          'Tab "Bảng tra cứu" → mục "Chữ Hán" → khu LẬT THẺ ngay đầu mục: 142 thẻ chia 6 bộ, mặt trước là ' +
          'mặt chữ, lật ra có cách đọc + nghĩa + từ Hán-Việt. Bộ "Từ đọc bài" chính là 20 từ nói ở trên. ' +
          'Học ở đó hiệu quả hơn nhìn bảng, vì nó bắt bạn tự nhớ trước khi lật.',
      },
      {
        type: 'text',
        h: 'Lợi thế riêng của người Việt',
        body:
          'Kanji vào tiếng Nhật và từ Hán-Việt vào tiếng Việt cùng một gốc. 時間 là THỜI GIAN, 銀行 là ' +
          'NGÂN HÀNG, 図書館 là ĐỒ THƯ QUÁN (thư viện). Bạn đã biết NGHĨA từ trước, chỉ còn phải nhớ CÁCH ĐỌC — ' +
          'nhẹ hơn hẳn người học phương Tây phải học cả hai. Nhưng đừng suy bừa: 勉強 là "miễn cưỡng" mà ' +
          'nghĩa là HỌC TẬP, 料理 là "liệu lý" mà nghĩa là MÓN ĂN.',
      },
    ],
  },

  'd4-kanji-onkun': {
    goal: 'Đoán được cách đọc của một chữ Hán lạ thay vì bỏ trống.',
    parts: [
      {
        type: 'text',
        h: 'Âm On và âm Kun',
        body:
          'Mỗi kanji thường có hai kiểu đọc. Âm ON là âm mượn từ tiếng Hán — nghe gần giống Hán-Việt. ' +
          'Âm KUN là từ thuần Nhật gán vào chữ đó — nghe không liên quan gì tới Hán-Việt.',
      },
      {
        type: 'table',
        h: 'Quy tắc đoán — đúng phần lớn trường hợp',
        headers: ['Tình huống', 'Thường đọc', 'Ví dụ'],
        rows: [
          ['Kanji ghép với kanji khác', 'âm ON', '日本人 = にほんじん · 学生 = がくせい'],
          ['Kanji đứng một mình', 'âm KUN', '人 = ひと · 山 = やま'],
          ['Kanji + đuôi hiragana', 'âm KUN', '食べます = たべます · 行きます = いきます'],
        ],
      },
      {
        type: 'examples',
        h: 'Cùng một chữ, hai cách đọc',
        items: [
          { jp: '人', read: 'ひと', vi: 'người (đứng một mình → Kun)' },
          { jp: '日本人', read: 'にほんじん', vi: 'người Nhật (ghép kanji → On)' },
          { jp: '食べます', read: 'たべます', vi: 'ăn (có đuôi hiragana → Kun)' },
          { jp: '食堂', read: 'しょくどう', vi: 'nhà ăn (ghép kanji → On)' },
        ],
      },
      {
        type: 'warn',
        h: 'Đây là mẹo đoán, không phải luật',
        body:
          'Có ngoại lệ, nhất là ở số đếm và ngày tháng (一日 = ついたち chẳng theo quy tắc nào). Dùng quy tắc ' +
          'này khi bí trong phòng thi, đừng dùng để thay việc học thuộc những từ hay ra đề.',
      },
    ],
  },

  'd4-talk-22': {
    goal: 'Trả lời được 22 câu hỏi TALKING mà không phải nghĩ — phần chiếm 60/100 điểm thi nói.',
    parts: [
      {
        type: 'text',
        h: 'TALKING chấm gì',
        body:
          'Chấm việc bạn HIỂU câu hỏi và trả lời được thành câu, không chấm câu trả lời hay dở. Trả lời ' +
          'thật hay bịa đều được — miễn đúng ngữ pháp. Nên đừng cố kể chuyện dài; kể sai ngữ pháp còn tệ ' +
          'hơn nói một câu ngắn đúng.',
      },
      {
        type: 'steps',
        h: 'Cách chạy 22 câu trong 40 phút',
        items: [
          'Mở tab "Thi nói & đọc", điền xong Hồ sơ cá nhân nếu chưa điền — trang tự sinh câu trả lời cho bạn.',
          'Lượt 1: đọc câu hỏi, đọc câu trả lời mẫu, nói to theo. Làm hết 22 câu.',
          'Lượt 2: che câu trả lời, chỉ nhìn câu hỏi, tự nói. Câu nào bí thì mở ra xem rồi nói lại.',
          'Lượt 3: nhờ ai đó hỏi LỘN XỘN, hoặc tự bốc ngẫu nhiên. Thi thật không hỏi theo thứ tự.',
        ],
      },
      {
        type: 'table',
        h: 'Ba khuôn câu trả lời dùng được cho gần hết 22 câu',
        headers: ['Khuôn', 'Dùng khi', 'Ví dụ'],
        rows: [
          ['〈N〉です。', 'hỏi về danh tính, nghề, tuổi, ngày', '学生です · はたちです'],
          ['〈N〉が 好きです。', 'hỏi về sở thích', '音楽が 好きです'],
          ['〈時間〉に 〈V〉ます。', 'hỏi về sinh hoạt', '六時に 起きます'],
        ],
      },
      {
        type: 'tip',
        h: 'Ba câu cứu nguy — học thuộc trước tất cả',
        body:
          '「もういちど おねがいします」 (xin nhắc lại) · 「ちょっと まってください」 (chờ em chút) · ' +
          '「すみません、わかりません」 (xin lỗi, em không hiểu). Nói được ba câu này BẰNG TIẾNG NHẬT vẫn ' +
          'được tính là giao tiếp; im lặng hoặc nói tiếng Việt thì mất điểm.',
      },
    ],
  },

  'd4-talk-pictures': {
    goal: 'Mô tả được tranh bằng 6 khuôn câu, không cần vốn từ rộng.',
    parts: [
      {
        type: 'table',
        h: '6 khuôn mô tả tranh — thay danh từ là dùng được cho mọi tranh',
        headers: ['Khuôn', 'Nghĩa', 'Ví dụ'],
        rows: [
          ['これは 〈N〉です。', 'Đây là …', 'これは 本です'],
          ['〈N〉が あります / います。', 'Có … (vật / người)', '机が あります · 学生が います'],
          ['〈N〉は 〈nơi〉に あります。', '… ở tại …', 'かばんは つくえの 上に あります'],
          ['〈người〉は 〈V〉ています。', '… đang làm …', '学生は 本を 読んでいます'],
          ['〈N〉は 〈tính từ〉です。', '… thì …', 'この へやは 大きいです'],
          ['〈số〉〈đơn vị〉 あります。', 'có mấy cái', 'いすが 四つ あります'],
        ],
      },
      {
        type: 'table',
        h: 'Từ chỉ vị trí — ghép với の như "の上に"',
        headers: ['Từ', 'Đọc', 'Nghĩa'],
        rows: [
          ['上', 'うえ', 'trên'],
          ['下', 'した', 'dưới'],
          ['中', 'なか', 'trong'],
          ['前', 'まえ', 'trước'],
          ['後ろ', 'うしろ', 'sau'],
          ['となり', 'tonari', 'bên cạnh'],
        ],
        note: 'Công thức: 〈A〉は 〈B〉の 〈vị trí〉に あります。→ 本は つくえの 上に あります (Sách ở trên bàn).',
      },
      {
        type: 'tip',
        h: 'Không biết tên đồ vật thì làm sao',
        body:
          'Nói cái bạn BIẾT tên. Tranh có 10 thứ mà bạn chỉ biết 3 thì tả 3 thứ đó, thành câu đầy đủ. ' +
          'Giám thị chấm câu bạn nói ra, không chấm số vật bạn bỏ sót.',
      },
    ],
  },

  'd4-reading-exams': {
    goal: 'Làm đề đọc hiểu đúng chiến thuật — đọc câu hỏi trước, đọc bài sau.',
    parts: [
      {
        type: 'steps',
        h: 'Thứ tự làm bài đọc hiểu',
        items: [
          'Đọc CÂU HỎI trước, đọc bài sau. Biết mình cần tìm gì thì đọc bài nhanh gấp đôi.',
          'Quét bài tìm đúng thông tin cần: con số, tên người, địa điểm, thời gian.',
          'Câu hỏi về số/giờ/tuổi thì tìm thẳng con số trong bài, không cần hiểu hết câu.',
          'Câu nào không chắc thì khoanh lại, làm tiếp, quay lại sau. Đừng đọc đi đọc lại một câu.',
        ],
      },
      {
        type: 'tip',
        h: 'Không hiểu hết bài vẫn làm đúng được',
        body:
          'Bài đọc JPD113 dùng đi dùng lại một khung câu: 私は〈tên〉です · 〈tuổi〉才です · ' +
          '〈nơi〉に住んでいます · 〈giờ〉に起きます. Nắm khung này thì chỉ cần bắt được vài từ khoá là trả lời được.',
      },
    ],
  },

  /* ══════════════════ NGÀY 5 — NGÀY THI ══════════════════ */

  'd5-cheatsheet': {
    goal: 'Nạp lại toàn bộ thứ dễ quên vào đầu ngay trước giờ thi, đúng thứ tự ưu tiên.',
    parts: [
      {
        type: 'steps',
        h: 'Thứ tự đọc lướt (30 phút, đừng học cái mới)',
        items: [
          'Số bất quy tắc trước: 四時 よじ · 七時 しちじ · 九時 くじ · 一日 ついたち · 二十日 はつか · 二十歳 はたち.',
          'Nhóm ぷん: 1-3-4-6-8-10 phút.',
          'Biến âm trăm/nghìn: 300 さんびゃく · 600 ろっぴゃく · 800 はっぴゃく · 1000 せん · 3000 さんぜん · 10000 いちまん.',
          'Trợ từ: bảng に vs で, và bốn động từ đi với が (あります・います・分かります・好きです).',
          'Cuối cùng lướt bảng 20 từ kanji của bài đọc.',
        ],
      },
      {
        type: 'warn',
        h: 'Hôm nay KHÔNG học kiến thức mới',
        body:
          'Thứ mới học trong ngày thi hiếm khi vào đầu, mà lại làm loãng thứ đã thuộc. Chỉ ôn lại, ' +
          'chỉ củng cố. Nếu thấy một mục hoàn toàn lạ thì bỏ qua, đừng dừng lại học.',
      },
    ],
  },

  'd5-tactic-fe': {
    goal: 'Không bỏ trống câu nào và không mất điểm vì lỗi kỹ thuật.',
    parts: [
      {
        type: 'steps',
        h: 'Chiến thuật làm trắc nghiệm',
        items: [
          'Vòng 1: làm hết những câu chắc chắn, nhanh. Câu nào lăn tăn thì đánh dấu, bỏ qua NGAY, đừng nghĩ lâu.',
          'Vòng 2: quay lại câu đã đánh dấu, loại trừ dần đáp án sai.',
          'Vòng 3: câu vẫn không biết thì VẪN CHỌN — trắc nghiệm không trừ điểm câu sai, bỏ trống là chắc chắn mất.',
          'Còn 5 phút cuối: rà soát xem có câu nào chưa tô đáp án không.',
        ],
      },
      {
        type: 'tip',
        h: 'Mẹo loại trừ khi bí',
        body:
          'Câu điền trợ từ: nhìn ĐỘNG TỪ cuối câu. 行きます/来ます → に hoặc へ. 食べます/読みます/見ます → を. ' +
          'あります/います/好きです/分かります → が. Riêng mẹo này gỡ được kha khá câu.',
      },
    ],
  },

  'd5-tactic-speak': {
    goal: 'Vào phòng thi nói với đúng nhịp và đúng thái độ.',
    parts: [
      {
        type: 'steps',
        h: 'Ba việc quyết định điểm',
        items: [
          'Đọc CHẬM hơn mức bạn nghĩ là đủ chậm. Phần READING chấm đúng và rõ, không chấm tốc độ — đọc nhanh chỉ làm lộ chỗ nuốt nhịp.',
          'Nói TO. Giám thị không chấm được thứ họ không nghe rõ. To hơn bình thường một bậc là vừa.',
          'Nhìn giám thị khi trả lời, ngồi thẳng. Đây là phần PRESENTING — 10 điểm cho không, chỉ cần tác phong.',
        ],
      },
      {
        type: 'examples',
        h: 'Bốn câu tác phong — nhẩm lần cuối',
        items: [
          { jp: '失礼します。', read: 'しつれいします', vi: 'khi bước VÀO phòng' },
          { jp: 'よろしくおねがいします。', read: 'よろしくおねがいします', vi: 'đầu buổi, sau khi giới thiệu tên' },
          { jp: 'ありがとうございました。', read: 'ありがとうございました', vi: 'khi thi xong' },
          { jp: '失礼しました。', read: 'しつれいしました', vi: 'khi RỜI phòng' },
        ],
      },
      {
        type: 'warn',
        h: 'Không hiểu câu hỏi thì đừng im',
        body:
          'Nói 「もういちど おねがいします」 — xin nhắc lại. Giám thị sẽ hỏi lại, và bản thân việc bạn ' +
          'phản ứng được bằng tiếng Nhật đã là điểm giao tiếp. Im lặng mới là mất điểm.',
      },
    ],
  },
};
