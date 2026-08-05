/**
 * Những việc còn lại của lộ trình — phần lớn là việc THAO TÁC (làm đề, luyện
 * gõ, chạy lại bài) chứ không phải kiến thức mới, nên bài ở đây ngắn hơn:
 * chủ yếu là cách làm cho đúng và bẫy hay mắc. Riêng `d3-kochira` là kiến
 * thức thật nên viết đủ như các bài chính.
 */

import type { LessonMap } from './types';

export const EXTRA_LESSONS: LessonMap = {
  /* ───────── kiến thức thật ───────── */
  'd3-kochira': {
    goal: 'Dùng đúng bộ lịch sự こちら/そちら/あちら và hai mẫu hỏi どこの / なんの.',
    parts: [
      {
        type: 'text',
        h: 'こちら là bản LỊCH SỰ của ここ',
        body:
          'Cùng nghĩa nhưng trang trọng hơn, nên hay xuất hiện đúng lúc thi nói — giám thị dùng chúng khi ' +
          'hỏi bạn. Nghe hiểu được quan trọng hơn tự nói được.',
      },
      {
        type: 'table',
        h: 'Đối chiếu thường ↔ lịch sự',
        headers: ['Thường', 'Lịch sự', 'Nghĩa'],
        rows: [
          ['ここ', 'こちら', 'chỗ này / phía này'],
          ['そこ', 'そちら', 'chỗ đó'],
          ['あそこ', 'あちら', 'chỗ kia'],
          ['どこ', 'どちら', 'chỗ nào / nước nào'],
          ['だれ', 'どなた', 'ai (lịch sự)'],
        ],
      },
      {
        type: 'examples',
        h: 'Câu giám thị hay dùng',
        items: [
          {
            jp: 'お国は どちらですか。',
            read: 'おくには どちらですか',
            romaji: 'o-kuni wa dochira desu ka',
            vi: 'Bạn đến từ nước nào?',
            note: 'どちら ở đây KHÔNG hỏi phương hướng mà hỏi NƯỚC. Trả lời: ベトナムです。',
          },
          {
            jp: 'あの方は どなたですか。',
            read: 'あのかたは どなたですか',
            romaji: 'ano kata wa donata desu ka',
            vi: 'Vị kia là ai ạ?',
          },
        ],
      },
      {
        type: 'table',
        h: 'どこの vs なんの — hai câu hỏi hay lẫn',
        headers: ['Mẫu', 'Hỏi về', 'Ví dụ', 'Trả lời'],
        rows: [
          ['どこの 〈N〉', 'XUẤT XỨ / hãng nào', 'どこの カメラですか', '日本の カメラです'],
          ['なんの 〈N〉', 'NỘI DUNG / loại gì', 'なんの 本ですか', '日本語の 本です'],
        ],
        note: 'Mẹo: どこの hỏi "của ĐÂU", なんの hỏi "về CÁI GÌ".',
      },
    ],
  },

  /* ───────── việc thao tác: làm đề ───────── */
  'd2-exam-d1': {
    goal: 'Làm đề đầu tiên đúng cách để kết quả nói lên được điều gì đó.',
    parts: [
      {
        type: 'steps',
        h: 'Quy tắc khi làm đề',
        items: [
          'Bấm giờ thật 45 phút. Làm quá giờ thì điểm không phản ánh được năng lực thi.',
          'KHÔNG tra cứu, không mở tab Bảng tra cứu giữa chừng — tra thì đề mất hết giá trị đo.',
          'Câu không biết vẫn chọn, nhưng đánh dấu lại để lát nữa phân biệt "biết" với "đoán trúng".',
          'Nộp bài rồi mới xem đáp án, và chuyển ngay sang việc soi lỗi — đừng chỉ nhìn điểm.',
        ],
      },
      {
        type: 'tip',
        h: 'Điểm lần đầu thấp là bình thường',
        body:
          'Mới học hai ngày mà làm đề đủ 45 phút thì 4-5/10 đã là ổn. Giá trị của đề này không nằm ở điểm ' +
          'mà ở chỗ nó chỉ ra bạn đang hổng nhóm nào.',
      },
    ],
  },

  'd3-exam-234': {
    goal: 'Cày ba đề liên tiếp mà vẫn rút được bài học, không phải làm cho có.',
    parts: [
      {
        type: 'steps',
        h: 'Nhịp làm ba đề',
        items: [
          'Đề 2: làm, chấm, soi lỗi NGAY. Đừng làm liền ba đề rồi mới chấm — sai giống nhau ba lần thì phí hai lần.',
          'Trước đề 3: đọc lại đúng những mục bạn vừa sai ở đề 2 (5-10 phút).',
          'Đề 3: làm, chấm, soi lỗi. So xem lỗi cũ còn lặp lại không.',
          'Đề 4: đây là đề đo tiến bộ. Nếu vẫn sai đúng nhóm cũ thì phải học lại nhóm đó cho tử tế, không phải làm thêm đề.',
        ],
      },
      {
        type: 'warn',
        h: 'Làm nhiều đề không tự nó làm bạn giỏi lên',
        body:
          'Đề chỉ ĐO. Thứ làm bạn khá lên là việc học lại đúng chỗ hổng giữa hai lần đo. Ba đề mà không soi ' +
          'lỗi thì giá trị bằng một đề.',
      },
    ],
  },

  'd4-exam-567': {
    goal: 'Ba đề cuối trước ngày thi — mục tiêu là ổn định, không phải phá kỷ lục.',
    parts: [
      {
        type: 'steps',
        h: 'Cách làm',
        items: [
          'Làm đúng điều kiện phòng thi: bấm giờ, không tra, không dừng giữa chừng.',
          'Ghi lại điểm ba đề. Nếu ba điểm chênh nhau nhiều thì bạn đang phụ thuộc may rủi — xem lại nhóm hay sai.',
          'Soi lỗi gộp cả ba đề, tìm nhóm lỗi lặp lại nhiều nhất.',
          'Nhóm lặp nhiều nhất chính là thứ duy nhất đáng học tiếp trong tối nay.',
        ],
      },
    ],
  },

  'd3-exam-log': {
    goal: 'Giữ sổ lỗi sống, không để nó thành danh sách chép rồi bỏ đó.',
    parts: [
      {
        type: 'steps',
        h: 'Cập nhật cuối ngày 3',
        items: [
          'Gộp lỗi của cả bốn đề đã làm vào một bảng chung, vẫn theo 5 nhãn: SỐ · TRỢ TỪ · TỪ VỰNG · KANJI · ĐỌC NHẦM ĐỀ.',
          'Đếm lại số câu theo nhãn. Nhãn nào tụt xuống thì gạch đi — bạn đã chữa được.',
          'Nhãn nào vẫn đứng nguyên sau ba ngày là chỗ cần đổi cách học, không phải học thêm.',
          'Đọc lại toàn bộ sổ lỗi một lượt trước khi ngủ. Đọc lỗi của chính mình nhớ lâu hơn đọc lý thuyết.',
        ],
      },
    ],
  },

  'd5-errorlog': {
    goal: 'Lần đọc cuối — nạp lại đúng những chỗ bản thân từng sai.',
    parts: [
      {
        type: 'tip',
        h: 'Đọc thế nào cho hiệu quả',
        body:
          'Đọc từng dòng sổ lỗi, và với mỗi dòng tự trả lời TRƯỚC rồi mới nhìn đáp án. Đọc lướt qua đáp án ' +
          'thì não coi như đã biết và không ghi nhớ gì thêm. 15 phút kiểu này giá trị hơn 1 tiếng đọc lý thuyết.',
      },
      {
        type: 'warn',
        h: 'Nếu sổ lỗi quá dài',
        body:
          'Chỉ đọc nhóm nhãn nhiều nhất và nhóm SỐ. Số đếm là thứ dễ mất điểm nhất mà cũng dễ cứu nhất ' +
          'trong vài phút cuối.',
      },
    ],
  },

  'd5-final-exam': {
    goal: 'Một đề cuối để làm nóng, không phải để đánh giá bản thân.',
    parts: [
      {
        type: 'warn',
        h: 'Đề này KHÔNG dùng để phán xét',
        body:
          'Làm để đầu vào nhịp làm bài, quen lại dạng câu. Điểm thấp cũng đừng để nó ảnh hưởng tâm lý — ' +
          'kết quả một đề vào buổi sáng ngày thi không dự báo được gì. Nếu bạn dễ lo lắng thì bỏ hẳn việc ' +
          'này, đọc cheat-sheet là đủ.',
      },
      {
        type: 'steps',
        h: 'Nếu làm',
        items: [
          'Chọn đề CHƯA từng làm, để không bị điểm ảo do nhớ đáp án cũ.',
          'Bấm giờ, làm liền mạch.',
          'Chấm xong chỉ xem những câu sai thuộc nhóm SỐ và TRỢ TỪ, hai nhóm còn cứu kịp.',
          'Dừng lại. Không học tiếp cái mới.',
        ],
      },
    ],
  },

  /* ───────── việc thao tác: luyện & ôn ───────── */
  'd2-vocab-time': {
    goal: 'Nạp 51 từ về thời gian và nơi chốn — nhóm từ xuất hiện dày nhất trong đề đọc.',
    parts: [
      {
        type: 'steps',
        h: 'Cách dùng tab Từ vựng cho hiệu quả',
        items: [
          'Mở tab "Từ vựng" → lọc chủ đề "Thời gian, Thứ & Lịch trình" và "Nơi chốn công cộng".',
          'Chế độ Tra cứu: đọc lướt cả danh sách một lượt, bấm "đã thuộc" cho từ nào bạn chắc chắn biết.',
          'Chuyển sang Lật thẻ — nó tự bỏ qua từ bạn đã đánh dấu thuộc.',
          'Cuối cùng làm một vòng Trắc nghiệm 15 câu để kiểm.',
          'Bật nút "🔥 Chỉ học 60 từ hay ra đề nhất" nếu thiếu thời gian — nó lọc theo tần suất trong kho đề thật.',
        ],
      },
    ],
  },

  'd3-vocab-daily': {
    goal: 'Nạp 72 từ về ăn uống, đồ vật và động từ.',
    parts: [
      {
        type: 'tip',
        h: 'Học động từ thì học cả trợ từ',
        body:
          'Ở nhóm động từ, đừng chỉ nhớ nghĩa. Nhớ nguyên cụm "ごはんを 食べます", "学校で 働きます" — đề ' +
          'không hỏi nghĩa mà hỏi trợ từ. Xem bảng 20 động từ + trợ từ ở việc "20 động từ thường gặp".',
      },
      {
        type: 'steps',
        h: 'Quy trình',
        items: [
          'Tab "Từ vựng" → lọc "Ăn uống", "Đồ vật cá nhân", "Động từ ます-form".',
          'Lật thẻ hết một lượt, đánh dấu từ đã thuộc.',
          'Chuyển sang chế độ "Viết đáp án" cho nhóm động từ — tự gõ khó hơn trắc nghiệm nhưng nhớ lâu hơn hẳn.',
          'Xem bảng "từ hay sai" cuối buổi, luyện riêng những từ đó.',
        ],
      },
    ],
  },

  'd2-exam-quiz': {
    goal: 'Kiểm tra riêng nhóm số — nhóm mất điểm số một.',
    parts: [
      {
        type: 'steps',
        h: 'Làm và xử lý kết quả',
        items: [
          'Làm hết, không tra bảng.',
          'Câu sai thuộc GIỜ hay PHÚT hay NGÀY hay TIỀN? Ghi rõ loại.',
          'Mở đúng bảng đó trong tab "Bảng tra cứu", đọc lại, đọc TO các dòng bất quy tắc.',
          'Làm lại quiz. Dưới 80% thì lặp lại chu trình — nhóm số đáng để lặp vì nó ra đề nhiều nhất.',
        ],
      },
    ],
  },

  'd4-drill-kanji': {
    goal: 'Luyện chữ Hán cả hai chiều: nhìn chữ ra âm, và nghe âm nhớ ra chữ.',
    parts: [
      {
        type: 'steps',
        h: 'Hai khu luyện trên trang này',
        items: [
          'Tab "Luyện gõ chữ" → bộ 49 kanji: có kiểu "chọn cách đọc" và "chọn mặt chữ" — đúng hai dạng đề FE.',
          'Tab "Bảng tra cứu" → mục Chữ Hán → khu LẬT THẺ: 142 thẻ, 6 bộ, có cả trắc nghiệm 3 chiều.',
          'Chạy bộ "Từ đọc bài" trước (24 thẻ) — đây là bộ phục vụ thẳng phần thi nói.',
          'Rồi bộ "Số · giờ · ngày" (35 thẻ) — đây là bộ phục vụ trắc nghiệm.',
          'Chữ nào sai hai lần trở lên thì viết ra giấy 10 lần.',
        ],
      },
    ],
  },

  /* ───────── việc thao tác: thi nói ───────── */
  'd2-speak-read345': {
    goal: 'Ba bài đọc tiếp theo, giữ đúng quy trình 5 lượt.',
    parts: [
      {
        type: 'steps',
        h: 'Quy trình cho mỗi bài',
        items: [
          'Lượt 1-2: nhìn romaji, đọc chậm, dừng ở chữ chưa chắc.',
          'Lượt 3-4: che romaji, chỉ nhìn tiếng Nhật.',
          'Lượt 5: ghi âm, nghe lại, đánh dấu chỗ vấp.',
          'Chú ý các con số trong bài — hôm nay bạn vừa học số, đây là chỗ áp dụng ngay.',
        ],
      },
    ],
  },

  'd3-speak-read678': {
    goal: 'Ba bài tiếp theo, bắt đầu chú ý tới ngắt câu và ngữ điệu.',
    parts: [
      {
        type: 'tip',
        h: 'Ngắt câu ở đâu',
        body:
          'Nghỉ ngắn ở dấu 、 · nghỉ dài và hạ giọng ở dấu 。 · nghỉ nhẹ sau trợ từ は. Ngắt đúng giúp giám ' +
          'thị nghe rõ cấu trúc câu, và giúp bạn không hụt hơi giữa câu dài.',
      },
      {
        type: 'steps',
        h: 'Quy trình',
        items: [
          'Đọc 5 lượt như các bài trước.',
          'Lượt cuối: đánh dấu bằng bút chì chỗ bạn định ngắt, rồi đọc theo đúng dấu đó.',
          'Ghi âm và nghe lại — lần này nghe xem có đọc liền tù tì không ngắt hay không.',
        ],
      },
    ],
  },

  'd4-read-hard': {
    goal: 'Xử lý riêng ba bài khó nhất thay vì đọc đều tay cả 13 bài.',
    parts: [
      {
        type: 'text',
        h: 'Vì sao ba bài đó khó',
        body:
          'Chúng dài hơn, có nhiều con số hơn, và có bài viết số TOÀN BẰNG KANJI (九時から四時まで thay vì ' +
          '9時から4時まで). Ngữ pháp thì vẫn dễ như các bài khác — cái khó chỉ nằm ở mặt chữ.',
      },
      {
        type: 'steps',
        h: 'Cách đánh',
        items: [
          'Chép riêng những cụm số bằng kanji trong bài ra giấy, ghi cách đọc bên cạnh.',
          'Đọc riêng danh sách đó 5 lượt cho tới khi bật ra ngay.',
          'Quay lại đọc cả bài, 5 lượt.',
          'Ghi âm lượt cuối, nghe lại — nếu vẫn khựng ở số thì lặp lại bước 2.',
        ],
      },
      {
        type: 'tip',
        h: 'Nhớ bảng đối chiếu',
        body:
          '3時 = 三時 = さんじ. Số viết bằng chữ số hay bằng kanji thì ĐỌC GIỐNG HỆT NHAU — xem bảng đối ' +
          'chiếu trong mục "Số đếm" của tab Bảng tra cứu.',
      },
    ],
  },

  'd4-talk-mock': {
    goal: 'Thi thử một lần trọn vẹn để biết cảm giác thật trước khi vào phòng.',
    parts: [
      {
        type: 'steps',
        h: 'Dựng lại điều kiện thi',
        items: [
          'Ngồi thẳng ở bàn, không nằm, không cầm điện thoại. Tư thế ảnh hưởng giọng nói thật sự.',
          'Chạy trọn kịch bản: 4 câu tác phong → đọc một bài → trả lời 8-10 câu hỏi bốc ngẫu nhiên → tả một bộ tranh.',
          'Ghi âm TOÀN BỘ, không dừng giữa chừng dù có vấp.',
          'Nghe lại và chấm mình theo ba tiêu chí: có nói đủ câu không · có to rõ không · có im lặng quá 5 giây lần nào không.',
        ],
      },
      {
        type: 'tip',
        h: 'Im lặng là kẻ thù lớn nhất',
        body:
          'Vấp mà vẫn nói tiếp thì mất ít điểm. Im lặng 10 giây thì mất nhiều hơn hẳn. Tập phản xạ: chưa nghĩ ' +
          'ra thì nói 「ちょっと まってください」rồi nghĩ tiếp — vẫn là đang giao tiếp bằng tiếng Nhật.',
      },
    ],
  },

  'd5-read-hard3': {
    goal: 'Lần đọc cuối cho ba bài khó, sáng ngày thi.',
    parts: [
      {
        type: 'tip',
        h: 'Đọc thế nào sáng nay',
        body:
          'Chỉ đọc TO một lượt mỗi bài, chậm và rõ. Không phân tích, không tra từ mới. Mục đích là làm nóng ' +
          'miệng và nhắc lại nhịp, không phải học thêm.',
      },
    ],
  },

  'd5-talk-run': {
    goal: 'Chạy nhanh toàn bộ câu trả lời của chính mình để chúng nằm sẵn trên đầu lưỡi.',
    parts: [
      {
        type: 'steps',
        h: '15 phút chạy',
        items: [
          'Mở tab "Thi nói & đọc" với hồ sơ đã điền.',
          'Che phần trả lời, chỉ nhìn câu hỏi, tự nói to. Không dừng lại sửa, cứ chạy hết.',
          'Vòng hai: chỉ chạy lại những câu vừa khựng.',
          'Kết thúc bằng 5 câu về bản thân (tên, nước, nghề, tuổi, sở thích) — chắc chắn được hỏi.',
        ],
      },
    ],
  },

  'd5-manner': {
    goal: 'Bốn câu tác phong phải bật ra không cần nghĩ.',
    parts: [
      {
        type: 'examples',
        h: 'Nhẩm theo đúng thứ tự dùng',
        items: [
          { jp: '失礼します。', read: 'しつれいします', vi: 'khi gõ cửa và bước VÀO' },
          { jp: 'よろしくおねがいします。', read: 'よろしくおねがいします', vi: 'sau khi nói tên mình' },
          { jp: 'ありがとうございました。', read: 'ありがとうございました', vi: 'khi thi xong' },
          { jp: '失礼しました。', read: 'しつれいしました', vi: 'khi RỜI phòng' },
        ],
      },
      {
        type: 'tip',
        h: '10 điểm dễ nhất cả kỳ thi',
        body:
          'PRESENTING chấm thái độ chứ không chấm ngoại ngữ. Bốn câu này cộng với ngồi thẳng, nhìn giám ' +
          'thị và nói to là gần như trọn 10 điểm — lấy được trước khi nói câu tiếng Nhật nào.',
      },
    ],
  },
};
