/**
 * Bài đọc chặng 1 — 5 bài TỰ VIẾT.
 *
 * VÌ SAO TỰ VIẾT chứ không lấy đề Cambridge: đề thi thật có bản quyền, chép
 * lên web là vi phạm. Tự viết còn được hai cái lợi mà đề thật không có:
 *   - Độ khó chỉnh đúng chặng 1 (A2–B1). Đề Academic thật ở mức C1, người mới
 *     làm sẽ sai vì KHÔNG HIỂU TỪ chứ không phải vì chưa biết dạng câu hỏi —
 *     sai kiểu đó không học được gì.
 *   - Giải thích được từng đáp án, kể cả vì sao các phương án khác sai.
 *
 * Dạng câu hỏi thì giữ NGUYÊN như đề thật (True/False/Not Given, Multiple
 * Choice, Sentence Completion, Matching, Headings) để lên chặng 2 không bỡ ngỡ.
 *
 * Nội dung các bài là kiến thức phổ thông, viết lại bằng lời của khoá học.
 */
import type { ReadingPassage } from '../types';

export const READINGS: ReadingPassage[] = [
  /* ═══════════════════ BÀI 1 ═══════════════════ */
  {
    id: 'r1',
    title: 'The Bicycle Returns to the City',
    titleVi: 'Xe đạp quay lại thành phố',
    level: 'A2 — bài đầu tiên, câu ngắn',
    words: 292,
    minutes: 10,
    paragraphs: [
      {
        label: 'A',
        text:
          'For most of the twentieth century, city planners believed that the car was the future. '
          + 'Wide roads were built, and old streets were made larger so that more cars could pass. '
          + 'In many cities, bicycles slowly disappeared from the roads. People who still rode them '
          + 'were often seen as poor or old-fashioned.',
      },
      {
        label: 'B',
        text:
          'Today the picture is different. Cities such as Copenhagen and Amsterdam are famous for '
          + 'their cycle lanes, and other cities are copying them. In Paris, hundreds of kilometres '
          + 'of new cycle lanes have been added since 2015. Local governments say that bicycles '
          + 'reduce traffic and air pollution, and that they cost far less than new underground lines.',
      },
      {
        label: 'C',
        text:
          'There are health reasons too. Doctors recommend at least thirty minutes of exercise a day, '
          + 'and cycling to work is an easy way to reach that target without going to a gym. Studies '
          + 'in several countries suggest that people who cycle regularly take fewer days off work '
          + 'because of illness.',
      },
      {
        label: 'D',
        text:
          'However, the change is not simple. Many people say they would cycle more if the roads felt '
          + 'safer. Painting a line on a busy road is cheap, but it does not protect a rider from a '
          + 'lorry. Separated lanes, with a physical barrier, work much better, though they take space '
          + 'away from cars and are more expensive to build. Weather is another problem: in very hot '
          + 'or very wet places, few people want to arrive at the office wet through.',
      },
      {
        label: 'E',
        text:
          'Electric bicycles may solve part of this. They allow riders to travel further without '
          + 'arriving tired, and they make hills much easier. Sales of electric bicycles have grown '
          + 'quickly in Europe, and in some countries they now outsell ordinary bicycles. Whether they '
          + 'will change Asian cities in the same way is still unclear.',
      },
    ],
    glossary: [
      { en: 'planner', ipa: '/ˈplænə(r)/', vi: 'nhà quy hoạch' },
      { en: 'disappear', ipa: '/ˌdɪsəˈpɪə(r)/', vi: 'biến mất' },
      { en: 'cycle lane', ipa: '/ˈsaɪkl leɪn/', vi: 'làn đường dành cho xe đạp' },
      { en: 'pollution', ipa: '/pəˈluːʃn/', vi: 'ô nhiễm' },
      { en: 'barrier', ipa: '/ˈbæriə(r)/', vi: 'rào chắn' },
      { en: 'outsell', ipa: '/ˌaʊtˈsel/', vi: 'bán chạy hơn' },
      { en: 'lorry', ipa: '/ˈlɒri/', vi: 'xe tải (Anh-Anh)' },
    ],
    questions: [
      {
        kind: 'TFNG',
        q: 'In the twentieth century, city planners thought cars were more important than bicycles.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'TRUE',
        why:
          'Đoạn A: "city planners believed that the car was the future" và đường được mở rộng cho ô tô, '
          + 'còn xe đạp thì "slowly disappeared". Ý của câu hỏi khớp hoàn toàn với bài.',
        whyNot:
          'FALSE sai vì bài không nói ngược lại. NOT GIVEN sai vì thông tin có rõ ràng trong đoạn A.',
      },
      {
        kind: 'TFNG',
        q: 'Copenhagen has more cycle lanes than Amsterdam.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'NOT GIVEN',
        why:
          'Đoạn B chỉ nói cả hai thành phố "are famous for their cycle lanes" — KHÔNG hề so sánh thành phố '
          + 'nào nhiều hơn. Không có thông tin để trả lời.',
        whyNot:
          'Đây là bẫy kinh điển: bài có nhắc TÊN cả hai thành phố nên người học tưởng là có thông tin. '
          + 'Nhớ quy tắc: bài KHÔNG nhắc tới → NOT GIVEN; bài nói NGƯỢC lại → FALSE.',
      },
      {
        kind: 'TFNG',
        q: 'Building cycle lanes costs more than building new underground railways.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        why:
          'Đoạn B nói ngược lại: xe đạp "cost far less than new underground lines" — rẻ hơn nhiều. Câu hỏi '
          + 'nói đắt hơn, tức là trái với bài.',
        whyNot:
          'Không phải NOT GIVEN vì bài CÓ nói về chi phí, chỉ là nói ngược. Phân biệt: có nói + ngược = '
          + 'FALSE; không nói gì = NOT GIVEN.',
      },
      {
        kind: 'MCQ',
        q: 'According to paragraph C, why is cycling to work useful?',
        options: [
          'It is faster than driving a car.',
          'It helps people get their daily exercise.',
          'It is cheaper than joining a gym.',
          'It makes people work longer hours.',
        ],
        answer: 'It helps people get their daily exercise.',
        why:
          'Đoạn C: bác sĩ khuyên tập ít nhất 30 phút mỗi ngày, và đạp xe đi làm là "an easy way to reach '
          + 'that target" — tức là cách dễ để đạt mức vận động đó.',
        whyNot:
          'A sai: bài không so sánh tốc độ với ô tô. C là bẫy — bài có nhắc "without going to a gym" nhưng '
          + 'nói là KHÔNG CẦN đến phòng gym, không nói về giá tiền. D hoàn toàn không có trong bài.',
      },
      {
        kind: 'MCQ',
        q: 'What does paragraph D say about painted cycle lanes?',
        options: [
          'They are the safest option available.',
          'They are cheap but do not really protect riders.',
          'They take too much space from cars.',
          'They are only useful in dry weather.',
        ],
        answer: 'They are cheap but do not really protect riders.',
        why:
          'Đoạn D: "Painting a line on a busy road is cheap, but it does not protect a rider from a lorry." '
          + 'Đúng hai vế: rẻ + không bảo vệ được.',
        whyNot:
          'A sai: bài nói làn CÓ RÀO CHẮN mới an toàn hơn. C nói về làn tách riêng chứ không phải làn vẽ sơn. '
          + 'D là thông tin về thời tiết, thuộc câu khác trong đoạn.',
      },
      {
        kind: 'GAP',
        q: 'Cycle lanes with a physical ____________ protect riders better than painted lines.',
        answer: 'barrier',
        why:
          'Đoạn D: "Separated lanes, with a physical barrier, work much better". Từ cần điền nằm ngay sau '
          + '"physical" trong bài.',
        whyNot:
          'Dạng điền từ này bắt buộc lấy TỪ NGUYÊN VĂN trong bài. Viết "wall" hay "fence" dù nghĩa gần vẫn '
          + 'bị tính sai.',
      },
      {
        kind: 'GAP',
        q: 'Electric bicycles make ____________ much easier to ride up.',
        answer: 'hills',
        alt: ['hill'],
        why: 'Đoạn E: "they make hills much easier". Bài dùng số nhiều "hills".',
        whyNot: 'Cẩn thận số ít/số nhiều — đề thật chấm rất chặt chỗ này. Chép đúng dạng có trong bài là an toàn nhất.',
      },
      {
        kind: 'TFNG',
        q: 'In some European countries, more electric bicycles are sold than ordinary ones.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'TRUE',
        why:
          'Đoạn E: "in some countries they now outsell ordinary bicycles". "outsell" = bán chạy hơn, đúng '
          + 'với "more … are sold than".',
        whyNot:
          'Câu hỏi dùng từ khác (more … sold) so với bài (outsell) — đây là cách đề thật hay làm. Phải hiểu '
          + 'NGHĨA chứ không tìm từ giống hệt.',
      },
      {
        kind: 'MATCH',
        q: 'Which paragraph mentions a problem caused by climate or weather?',
        options: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
        answer: 'Paragraph D',
        why:
          'Cuối đoạn D: "Weather is another problem: in very hot or very wet places, few people want to '
          + 'arrive at the office wet through."',
        whyNot:
          'Các đoạn kia nói về lịch sử (A), chính sách và chi phí (B), sức khoẻ (C) — không đoạn nào nhắc thời tiết.',
      },
      {
        kind: 'MCQ',
        q: 'What is the writer’s attitude towards electric bicycles in Asia?',
        options: [
          'Certain that they will succeed',
          'Sure that they will fail',
          'Not certain what will happen',
          'Not interested in the question',
        ],
        answer: 'Not certain what will happen',
        why:
          'Câu cuối đoạn E: "Whether they will change Asian cities in the same way is still unclear." — '
          + '"unclear" thể hiện người viết chưa chắc chắn.',
        whyNot:
          'A và B đều quá mạnh: bài không khẳng định thành công hay thất bại. D sai vì người viết CÓ nêu '
          + 'câu hỏi đó ra, tức là có quan tâm.',
      },
    ],
    strategy: [
      'ĐỌC CÂU HỎI TRƯỚC, đọc bài sau. Đọc hết bài rồi mới xem câu hỏi là cách chắc chắn hết giờ.',
      'Với True/False/Not Given, hỏi đúng thứ tự: bài có nhắc tới chuyện này không? Không → NOT GIVEN. Có → nói xuôi hay nói ngược?',
      'Bẫy NOT GIVEN thường là câu SO SÁNH hai thứ mà bài chỉ nhắc tên cả hai chứ không so sánh.',
      'Với dạng điền từ, chép ĐÚNG NGUYÊN VĂN từ trong bài, giữ nguyên số ít/số nhiều.',
      'Gạch chân từ khoá trong câu hỏi (tên riêng, số, năm) rồi quét tìm chúng trong bài — nhanh hơn đọc tuần tự.',
    ],
    translation:
      'A. Trong phần lớn thế kỷ XX, các nhà quy hoạch đô thị tin rằng ô tô là tương lai. Đường lớn được xây, '
      + 'phố cũ được mở rộng để nhiều ô tô đi qua hơn. Ở nhiều thành phố, xe đạp dần biến mất khỏi đường. Người '
      + 'còn đi xe đạp thường bị coi là nghèo hoặc lạc hậu.\n\n'
      + 'B. Ngày nay bức tranh đã khác. Các thành phố như Copenhagen và Amsterdam nổi tiếng về làn đường xe đạp, '
      + 'và những thành phố khác đang học theo. Ở Paris, hàng trăm ki-lô-mét làn xe đạp mới đã được bổ sung từ '
      + 'năm 2015. Chính quyền địa phương nói rằng xe đạp giảm ùn tắc và ô nhiễm không khí, lại tốn ít hơn nhiều '
      + 'so với xây tuyến tàu điện ngầm mới.\n\n'
      + 'C. Còn có lý do sức khoẻ. Bác sĩ khuyên tập thể dục ít nhất ba mươi phút mỗi ngày, và đạp xe đi làm là '
      + 'cách dễ dàng để đạt mức đó mà không cần tới phòng tập. Nghiên cứu ở nhiều nước cho thấy người đạp xe '
      + 'thường xuyên nghỉ ốm ít ngày hơn.\n\n'
      + 'D. Tuy nhiên, thay đổi không đơn giản. Nhiều người nói họ sẽ đạp xe nhiều hơn nếu đường an toàn hơn. Vẽ '
      + 'một vạch sơn trên đường đông thì rẻ, nhưng nó không bảo vệ người đi xe khỏi xe tải. Làn tách riêng, có '
      + 'rào chắn vật lý, hiệu quả hơn nhiều, dù chúng lấy mất chỗ của ô tô và tốn kém hơn. Thời tiết là vấn đề '
      + 'khác: ở nơi rất nóng hoặc rất mưa, ít ai muốn đến văn phòng trong bộ đồ ướt sũng.\n\n'
      + 'E. Xe đạp điện có thể giải quyết được một phần. Chúng cho phép đi xa hơn mà không tới nơi trong tình '
      + 'trạng mệt, và làm việc leo dốc dễ hơn nhiều. Doanh số xe đạp điện tăng nhanh ở châu Âu, và ở một số '
      + 'nước chúng nay bán chạy hơn xe đạp thường. Liệu chúng có thay đổi các thành phố châu Á theo cách tương '
      + 'tự hay không thì vẫn chưa rõ.',
  },

  /* ═══════════════════ BÀI 2 ═══════════════════ */
  {
    id: 'r2',
    title: 'How Honeybees Tell Each Other Where to Go',
    titleVi: 'Ong mật báo cho nhau chỗ có hoa bằng cách nào',
    level: 'A2–B1 — bài khoa học đơn giản',
    words: 270,
    minutes: 11,
    paragraphs: [
      {
        label: 'A',
        text:
          'A single honeybee cannot find enough food for a whole colony. A hive may contain tens of '
          + 'thousands of bees, and they need a steady supply of nectar and pollen. For this reason, '
          + 'bees that find a good source of flowers must tell the others where it is.',
      },
      {
        label: 'B',
        text:
          'They do this by dancing. When a bee returns to the hive, it moves in a particular pattern on '
          + 'the surface of the honeycomb. Other bees crowd around and follow the movement closely. The '
          + 'Austrian scientist Karl von Frisch studied these movements for many years and won a Nobel '
          + 'Prize in 1973 for explaining what they mean.',
      },
      {
        label: 'C',
        text:
          'There are two main dances. If the flowers are close to the hive, the bee runs in small '
          + 'circles. This simply means "food is nearby, go out and look". If the flowers are further '
          + 'away, the bee performs a different dance in the shape of a figure of eight, shaking its '
          + 'body as it moves along the straight middle section.',
      },
      {
        label: 'D',
        text:
          'The second dance carries surprisingly exact information. The direction of the straight part '
          + 'tells the other bees the angle they should fly relative to the sun. The length of time the '
          + 'bee shakes its body tells them how far to travel. A longer shake means a longer journey.',
      },
      {
        label: 'E',
        text:
          'The system has a weakness: the sun moves across the sky during the day. A bee that dances in '
          + 'the morning and a bee that dances in the afternoon must therefore use different angles for '
          + 'the same field of flowers. Bees appear to correct for this automatically, which suggests '
          + 'they keep track of time.',
      },
    ],
    glossary: [
      { en: 'colony', ipa: '/ˈkɒləni/', vi: 'đàn, quần thể' },
      { en: 'hive', ipa: '/haɪv/', vi: 'tổ ong' },
      { en: 'nectar', ipa: '/ˈnektə(r)/', vi: 'mật hoa' },
      { en: 'honeycomb', ipa: '/ˈhʌnikəʊm/', vi: 'tầng sáp ong' },
      { en: 'pattern', ipa: '/ˈpætn/', vi: 'khuôn mẫu, kiểu' },
      { en: 'angle', ipa: '/ˈæŋɡl/', vi: 'góc' },
      { en: 'relative to', ipa: '/ˈrelətɪv tuː/', vi: 'so với, tương đối với' },
    ],
    questions: [
      {
        kind: 'HEADING',
        q: 'Choose the best heading for Paragraph C.',
        options: [
          'Two different messages',
          'The scientist who solved the puzzle',
          'A problem with the system',
          'Why one bee is not enough',
        ],
        answer: 'Two different messages',
        why:
          'Đoạn C mô tả HAI điệu nhảy: vòng tròn nhỏ (hoa gần) và hình số 8 (hoa xa). Tiêu đề phải bao được '
          + 'ý chính của cả đoạn.',
        whyNot:
          '"The scientist…" là đoạn B (von Frisch). "A problem…" là đoạn E (mặt trời di chuyển). "Why one bee '
          + 'is not enough" là đoạn A.',
      },
      {
        kind: 'HEADING',
        q: 'Choose the best heading for Paragraph E.',
        options: [
          'How far and in which direction',
          'The sun keeps moving',
          'Dancing on the honeycomb',
          'Food for thousands',
        ],
        answer: 'The sun keeps moving',
        why:
          'Đoạn E nói về điểm yếu của hệ thống: "the sun moves across the sky during the day", nên góc phải '
          + 'khác nhau giữa sáng và chiều.',
        whyNot:
          '"How far and in which direction" là đoạn D. "Dancing on the honeycomb" là đoạn B. "Food for '
          + 'thousands" là đoạn A.',
      },
      {
        kind: 'TFNG',
        q: 'Karl von Frisch received a Nobel Prize for his work on bees.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'TRUE',
        why: 'Đoạn B: "won a Nobel Prize in 1973 for explaining what they mean".',
        whyNot: 'Thông tin nêu trực tiếp, không cần suy luận.',
      },
      {
        kind: 'TFNG',
        q: 'Von Frisch was the first person to see bees dancing.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'NOT GIVEN',
        why:
          'Bài nói ông NGHIÊN CỨU các chuyển động đó nhiều năm và giải thích Ý NGHĨA của chúng — hoàn toàn '
          + 'không nói ai là người ĐẦU TIÊN nhìn thấy.',
        whyNot:
          'Bẫy rất hay gặp: đề thêm chữ "first" (đầu tiên, duy nhất, tất cả, luôn luôn) vào một thông tin có '
          + 'thật. Gặp các từ tuyệt đối này phải kiểm rất kỹ trong bài.',
      },
      {
        kind: 'MCQ',
        q: 'What does the round dance tell other bees?',
        options: [
          'The exact distance to the flowers',
          'That food can be found close to the hive',
          'The angle to fly relative to the sun',
          'That the hive must move to a new place',
        ],
        answer: 'That food can be found close to the hive',
        why:
          'Đoạn C: nếu hoa ở gần thì ong chạy vòng tròn nhỏ, nghĩa là "food is nearby, go out and look".',
        whyNot:
          'A và C là thông tin của điệu nhảy hình số 8 (đoạn D), không phải điệu vòng tròn. D không có trong bài.',
      },
      {
        kind: 'GAP',
        q: 'The dance used for distant flowers has the shape of a figure of ____________.',
        answer: 'eight',
        alt: ['8'],
        why: 'Đoạn C: "a different dance in the shape of a figure of eight".',
        whyNot: 'Chép nguyên văn từ bài. Bài viết bằng chữ "eight" nên viết chữ là an toàn nhất.',
      },
      {
        kind: 'GAP',
        q: 'The longer the bee shakes its body, the ____________ the journey to the flowers.',
        answer: 'longer',
        why: 'Đoạn D: "A longer shake means a longer journey." Câu hỏi dùng cấu trúc so sánh kép nên vẫn điền "longer".',
        whyNot: 'Điền "long" là sai ngữ pháp trong cấu trúc "the + so sánh hơn, the + so sánh hơn".',
      },
      {
        kind: 'MCQ',
        q: 'Why must a morning dance and an afternoon dance use different angles?',
        options: [
          'Because bees are more tired in the afternoon',
          'Because the flowers move during the day',
          'Because the position of the sun changes',
          'Because the hive turns slowly',
        ],
        answer: 'Because the position of the sun changes',
        why:
          'Đoạn E: "the sun moves across the sky during the day", mà góc bay lại tính TƯƠNG ĐỐI với mặt trời '
          + '(đoạn D), nên cùng một ruộng hoa thì góc buổi sáng khác buổi chiều.',
        whyNot:
          'B vô lý — hoa không di chuyển. A và D không hề có trong bài. Câu này cần ghép thông tin từ HAI '
          + 'đoạn, dạng câu hỏi hay gặp ở đề thật.',
      },
      {
        kind: 'TFNG',
        q: 'Bees seem to be able to keep track of the time of day.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'TRUE',
        why: 'Câu cuối đoạn E: "which suggests they keep track of time".',
        whyNot:
          'Chú ý bài dùng "suggests" (cho thấy, gợi ý) chứ không khẳng định tuyệt đối — mà câu hỏi cũng dùng '
          + '"seem to", mức độ chắc chắn khớp nhau nên vẫn là TRUE.',
      },
      {
        kind: 'MATCH',
        q: 'Which paragraph explains how bees show distance and direction?',
        options: ['Paragraph B', 'Paragraph C', 'Paragraph D', 'Paragraph E'],
        answer: 'Paragraph D',
        why:
          'Đoạn D nói rõ hai thứ: hướng (góc so với mặt trời) và khoảng cách (thời gian rung mình).',
        whyNot:
          'Đoạn C chỉ giới thiệu có hai điệu nhảy chứ chưa giải thích chúng mã hoá thông tin gì.',
      },
    ],
    strategy: [
      'Dạng Matching Headings: đọc câu ĐẦU và câu CUỐI của đoạn trước — ý chính thường nằm ở đó.',
      'Làm Headings SAU khi đã làm các câu khác: lúc đó bạn đã đọc kỹ bài, chọn tiêu đề nhanh hơn nhiều.',
      'Cảnh giác với các từ tuyệt đối trong câu hỏi: first, only, all, always, never. Chúng là dấu hiệu của bẫy NOT GIVEN.',
      'Câu hỏi cần ghép thông tin từ hai đoạn là câu khó nhất — làm cuối cùng, đừng để nó ăn mất thời gian của các câu dễ.',
    ],
    translation:
      'A. Một con ong mật đơn lẻ không thể tìm đủ thức ăn cho cả đàn. Một tổ ong có thể chứa hàng chục nghìn '
      + 'con, và chúng cần nguồn mật hoa và phấn hoa ổn định. Vì vậy, con ong tìm được nguồn hoa tốt phải báo '
      + 'cho những con khác biết chỗ đó ở đâu.\n\n'
      + 'B. Chúng làm việc này bằng cách nhảy múa. Khi một con ong về tổ, nó di chuyển theo một kiểu nhất định '
      + 'trên mặt tầng sáp. Những con khác xúm lại và bám sát chuyển động đó. Nhà khoa học người Áo Karl von '
      + 'Frisch đã nghiên cứu các chuyển động này trong nhiều năm và giành giải Nobel năm 1973 nhờ giải thích '
      + 'được ý nghĩa của chúng.\n\n'
      + 'C. Có hai điệu nhảy chính. Nếu hoa ở gần tổ, ong chạy thành những vòng tròn nhỏ. Điều này đơn giản '
      + 'nghĩa là "thức ăn ở gần đây, ra mà tìm". Nếu hoa ở xa hơn, ong thực hiện một điệu nhảy khác có hình số '
      + 'tám, vừa đi vừa rung mình dọc theo đoạn thẳng ở giữa.\n\n'
      + 'D. Điệu nhảy thứ hai mang thông tin chính xác đến bất ngờ. Hướng của đoạn thẳng cho những con ong khác '
      + 'biết góc chúng cần bay so với mặt trời. Thời gian ong rung mình cho biết phải bay bao xa. Rung càng lâu '
      + 'nghĩa là hành trình càng dài.\n\n'
      + 'E. Hệ thống này có một điểm yếu: mặt trời di chuyển trên bầu trời trong ngày. Một con ong nhảy vào buổi '
      + 'sáng và một con nhảy vào buổi chiều vì thế phải dùng góc khác nhau cho cùng một ruộng hoa. Ong dường như '
      + 'tự động hiệu chỉnh điều này, cho thấy chúng có theo dõi thời gian.',
  },

  /* ═══════════════════ BÀI 3 ═══════════════════ */
  {
    id: 'r3',
    title: 'Why Adults Find Languages Harder Than Children',
    titleVi: 'Vì sao người lớn học ngoại ngữ khó hơn trẻ con',
    level: 'B1 — chủ đề giáo dục, hay ra ở Task 2',
    words: 285,
    minutes: 12,
    paragraphs: [
      {
        label: 'A',
        text:
          'It is commonly said that children learn languages easily while adults struggle. Parents who '
          + 'move abroad often notice that their children are speaking the local language fluently '
          + 'within a year, while they themselves are still searching for words. The observation is '
          + 'real, but the explanation is more complicated than most people think.',
      },
      {
        label: 'B',
        text:
          'One clear difference is pronunciation. Young children can usually produce the sounds of a new '
          + 'language without a foreign accent. Adults rarely manage this, even after decades in a new '
          + 'country. Researchers believe that the brain becomes less flexible at recognising unfamiliar '
          + 'sounds after early childhood, so adults tend to hear new sounds as versions of sounds they '
          + 'already know.',
      },
      {
        label: 'C',
        text:
          'In other areas, however, adults have advantages. They already understand how language works, '
          + 'so grammar rules make sense to them. They can use a dictionary, take notes, and organise '
          + 'their study. Several studies of classroom learning have found that adults make faster '
          + 'progress than children in the first months, particularly in reading and grammar.',
      },
      {
        label: 'D',
        text:
          'The amount of exposure also matters, and it is often forgotten. A child in a new country may '
          + 'hear the language for eight hours a day at school, surrounded by other children who correct '
          + 'them immediately. An adult may spend those same hours in an office where everyone speaks '
          + 'their first language. The child is not simply learning faster; the child is practising far more.',
      },
      {
        label: 'E',
        text:
          'Attitude plays a part too. Children are usually not afraid of making mistakes, while adults '
          + 'may stay silent rather than risk sounding foolish. Since speaking is the main way to improve '
          + 'speaking, this fear slows adults down considerably. Teachers often say that the most '
          + 'successful adult learners are not the cleverest ones, but those who are willing to be wrong.',
      },
    ],
    glossary: [
      { en: 'struggle', ipa: '/ˈstrʌɡl/', vi: 'vật lộn, chật vật' },
      { en: 'fluently', ipa: '/ˈfluːəntli/', vi: 'trôi chảy' },
      { en: 'accent', ipa: '/ˈæksent/', vi: 'giọng, chất giọng vùng miền' },
      { en: 'flexible', ipa: '/ˈfleksəbl/', vi: 'linh hoạt, dễ uốn' },
      { en: 'exposure', ipa: '/ɪkˈspəʊʒə(r)/', vi: 'sự tiếp xúc (với ngôn ngữ)' },
      { en: 'considerably', ipa: '/kənˈsɪdərəbli/', vi: 'đáng kể' },
      { en: 'willing', ipa: '/ˈwɪlɪŋ/', vi: 'sẵn lòng' },
    ],
    questions: [
      {
        kind: 'TFNG',
        q: 'The writer accepts that children often speak a new language sooner than their parents.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'TRUE',
        why:
          'Đoạn A: "The observation is real" — người viết công nhận hiện tượng đó có thật, chỉ nói cách giải '
          + 'thích phức tạp hơn.',
        whyNot:
          'Bẫy ở chỗ đoạn A có chữ "but", làm người đọc tưởng người viết phản bác. Đọc kỹ: ông ấy phản bác '
          + 'CÁCH GIẢI THÍCH, không phản bác hiện tượng.',
      },
      {
        kind: 'MCQ',
        q: 'According to paragraph B, why do adults keep a foreign accent?',
        options: [
          'They do not practise pronunciation enough.',
          'Their brains become less able to notice unfamiliar sounds.',
          'They are not interested in sounding native.',
          'They learn only from books.',
        ],
        answer: 'Their brains become less able to notice unfamiliar sounds.',
        why:
          'Đoạn B: não "becomes less flexible at recognising unfamiliar sounds after early childhood", nên '
          + 'người lớn nghe âm mới thành phiên bản của âm đã biết.',
        whyNot:
          'A, C, D nghe rất hợp lý ngoài đời nhưng KHÔNG có trong bài. Dạng câu hỏi này luôn có phương án '
          + '"đúng ngoài đời nhưng không có trong bài" — chỉ chọn thứ bài có nói.',
      },
      {
        kind: 'TFNG',
        q: 'In classroom studies, adults learned reading and grammar more slowly than children.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        why:
          'Đoạn C nói ngược: "adults make faster progress than children in the first months, particularly in '
          + 'reading and grammar".',
        whyNot: 'Bài CÓ nói về đúng chuyện này và nói ngược lại câu hỏi → FALSE, không phải NOT GIVEN.',
      },
      {
        kind: 'GAP',
        q: 'Adults can organise their learning because they already understand how ____________ works.',
        answer: 'language',
        why: 'Đoạn C: "They already understand how language works".',
        whyNot: 'Điền "grammar" là sai — bài nói "language", và ngữ pháp chỉ là hệ quả nêu ở vế sau.',
      },
      {
        kind: 'MCQ',
        q: 'What point does paragraph D make about children in a new country?',
        options: [
          'They are naturally more intelligent than adults.',
          'They get far more practice than adults do.',
          'They prefer school to work.',
          'They are corrected less often than adults.',
        ],
        answer: 'They get far more practice than adults do.',
        why:
          'Đoạn D: trẻ nghe tiếng đó 8 tiếng/ngày ở trường, còn người lớn ngồi văn phòng nói tiếng mẹ đẻ. '
          + 'Câu chốt: "the child is practising far more".',
        whyNot:
          'A đi ngược với câu "The child is not simply learning faster". D nói ngược bài — trẻ được bạn bè '
          + 'sửa NGAY LẬP TỨC, tức là nhiều hơn chứ không ít hơn.',
      },
      {
        kind: 'GAP',
        q: 'Fear of sounding ____________ can stop adults from speaking.',
        answer: 'foolish',
        why: 'Đoạn E: "rather than risk sounding foolish".',
        whyNot:
          'Điền "stupid" hay "silly" tuy cùng nghĩa nhưng dạng Completion bắt buộc lấy từ NGUYÊN VĂN trong bài.',
      },
      {
        kind: 'TFNG',
        q: 'Teachers believe that intelligence is the most important factor for adult learners.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        why:
          'Đoạn E nói ngược: người học lớn tuổi thành công nhất "are not the cleverest ones, but those who '
          + 'are willing to be wrong".',
        whyNot: 'Bài đề cập đúng chuyện thông minh và bác bỏ nó → FALSE.',
      },
      {
        kind: 'HEADING',
        q: 'Choose the best heading for Paragraph D.',
        options: [
          'How much practice each group really gets',
          'The advantages of being an adult',
          'Losing the ability to hear new sounds',
          'Being brave enough to speak',
        ],
        answer: 'How much practice each group really gets',
        why: 'Cả đoạn D so sánh SỐ GIỜ tiếp xúc: trẻ 8 tiếng ở trường, người lớn ở văn phòng nói tiếng mẹ đẻ.',
        whyNot: '"The advantages of being an adult" là đoạn C, "Losing the ability…" là đoạn B, "Being brave…" là đoạn E.',
      },
      {
        kind: 'MCQ',
        q: 'What is the main idea of the whole passage?',
        options: [
          'Adults should not try to learn new languages.',
          'Children are better at every part of language learning.',
          'The difference between children and adults has several different causes.',
          'Pronunciation is the only thing that matters.',
        ],
        answer: 'The difference between children and adults has several different causes.',
        why:
          'Bài nêu bốn nguyên nhân khác nhau: phát âm (B), lợi thế của người lớn (C), lượng tiếp xúc (D), '
          + 'thái độ (E). Đoạn A đã báo trước: "the explanation is more complicated".',
        whyNot:
          'B sai vì đoạn C nói người lớn TIẾN NHANH HƠN ở ngữ pháp và đọc. A và D là phóng đại, bài không nói vậy.',
      },
      {
        kind: 'MATCH',
        q: 'Which paragraph suggests that being afraid of mistakes slows learning?',
        options: ['Paragraph B', 'Paragraph C', 'Paragraph D', 'Paragraph E'],
        answer: 'Paragraph E',
        why: 'Đoạn E: "this fear slows adults down considerably".',
        whyNot: 'Ba đoạn kia nói về não bộ, lợi thế học thuật và số giờ luyện tập.',
      },
    ],
    strategy: [
      'Câu hỏi "main idea of the whole passage" luôn làm SAU CÙNG — lúc đó bạn đã đọc hết bài.',
      'Phương án nào có từ tuyệt đối (only, every, never, all) thường sai ở câu hỏi ý chính.',
      'Với MCQ, gạch bỏ phương án "đúng ngoài đời nhưng bài không nhắc". Đây là bẫy chiếm phần lớn lỗi sai.',
      'Đoạn có chữ "however", "but" ở đầu thường chứa ý ngược — đề rất hay hỏi vào đúng chỗ đó.',
    ],
    translation:
      'A. Người ta thường nói trẻ con học ngoại ngữ dễ dàng còn người lớn thì chật vật. Bố mẹ chuyển ra nước '
      + 'ngoài thường thấy con mình nói tiếng bản địa trôi chảy trong vòng một năm, trong khi chính họ vẫn đang '
      + 'loay hoay tìm từ. Quan sát đó là có thật, nhưng cách giải thích phức tạp hơn phần lớn mọi người nghĩ.\n\n'
      + 'B. Một khác biệt rõ ràng là phát âm. Trẻ nhỏ thường phát ra được các âm của ngôn ngữ mới mà không mang '
      + 'giọng ngoại quốc. Người lớn hiếm khi làm được, kể cả sau hàng chục năm ở nước mới. Các nhà nghiên cứu '
      + 'cho rằng não bộ trở nên kém linh hoạt trong việc nhận ra âm lạ sau tuổi thơ ấu, nên người lớn có xu '
      + 'hướng nghe âm mới thành phiên bản của những âm họ đã biết.\n\n'
      + 'C. Tuy nhiên ở những mặt khác, người lớn có lợi thế. Họ đã hiểu ngôn ngữ vận hành thế nào nên các quy '
      + 'tắc ngữ pháp có ý nghĩa với họ. Họ biết dùng từ điển, ghi chép và sắp xếp việc học. Nhiều nghiên cứu về '
      + 'học trên lớp cho thấy người lớn tiến bộ nhanh hơn trẻ em trong những tháng đầu, đặc biệt ở kỹ năng đọc '
      + 'và ngữ pháp.\n\n'
      + 'D. Lượng tiếp xúc cũng quan trọng, và điều này hay bị quên. Một đứa trẻ ở nước mới có thể nghe thứ '
      + 'tiếng đó tám tiếng mỗi ngày ở trường, xung quanh là những đứa trẻ khác sửa lỗi cho nó ngay lập tức. '
      + 'Người lớn có thể trải qua đúng số giờ ấy trong văn phòng nơi mọi người nói tiếng mẹ đẻ của họ. Đứa trẻ '
      + 'không đơn thuần học nhanh hơn; đứa trẻ luyện tập nhiều hơn hẳn.\n\n'
      + 'E. Thái độ cũng đóng vai trò. Trẻ con thường không sợ mắc lỗi, còn người lớn có thể im lặng thay vì '
      + 'liều nói ra và nghe có vẻ ngớ ngẩn. Vì nói chính là cách chủ yếu để giỏi nói, nỗi sợ này làm người lớn '
      + 'chậm đi đáng kể. Giáo viên thường nói rằng người lớn học thành công nhất không phải người thông minh '
      + 'nhất, mà là người sẵn lòng chấp nhận mình sai.',
  },

  /* ═══════════════════ BÀI 4 ═══════════════════ */
  {
    id: 'r4',
    title: 'The Long Journey of Tea',
    titleVi: 'Hành trình dài của cây trà',
    level: 'B1 — bài lịch sử, nhiều mốc thời gian',
    words: 275,
    minutes: 12,
    paragraphs: [
      {
        label: 'A',
        text:
          'Tea comes from the leaves of a single plant, Camellia sinensis, which grows naturally in the '
          + 'warm hills of southern China and northern Myanmar. Green tea, black tea and oolong all come '
          + 'from this same plant; the difference lies in how the leaves are treated after picking. '
          + 'Leaves that are dried quickly stay green, while leaves that are left to react with the air '
          + 'turn dark and produce black tea.',
      },
      {
        label: 'B',
        text:
          'Tea was drunk in China long before it was known elsewhere. It spread to Japan through '
          + 'Buddhist monks, who valued it because it helped them stay awake during long periods of '
          + 'meditation. In Japan the drink developed into a formal ceremony with its own rules, rooms '
          + 'and equipment.',
      },
      {
        label: 'C',
        text:
          'European traders brought tea home in the seventeenth century. At first it was extremely '
          + 'expensive and only wealthy families could afford it; tea was kept in locked wooden boxes. '
          + 'As trade increased, the price fell, and by the nineteenth century tea had become an '
          + 'everyday drink in Britain for people of all incomes.',
      },
      {
        label: 'D',
        text:
          'Demand created problems. Britain was paying for Chinese tea with silver, which the government '
          + 'considered unsustainable. Attempts were therefore made to grow tea outside China. Plants and '
          + 'knowledge were taken to India, and large plantations were established in Assam and later in '
          + 'Sri Lanka, then known as Ceylon.',
      },
      {
        label: 'E',
        text:
          'Today tea is the most widely drunk prepared beverage in the world after water, and it is grown '
          + 'in dozens of countries. Yet the plant itself has changed little. A tea bush left alone would '
          + 'grow into a small tree; on plantations it is cut back constantly so that pickers can reach '
          + 'the young leaves, which are the only part used for good-quality tea.',
      },
    ],
    glossary: [
      { en: 'monk', ipa: '/mʌŋk/', vi: 'nhà sư' },
      { en: 'meditation', ipa: '/ˌmedɪˈteɪʃn/', vi: 'thiền định' },
      { en: 'ceremony', ipa: '/ˈserəməni/', vi: 'nghi lễ' },
      { en: 'wealthy', ipa: '/ˈwelθi/', vi: 'giàu có' },
      { en: 'income', ipa: '/ˈɪnkʌm/', vi: 'thu nhập' },
      { en: 'plantation', ipa: '/plænˈteɪʃn/', vi: 'đồn điền' },
      { en: 'beverage', ipa: '/ˈbevərɪdʒ/', vi: 'đồ uống' },
      { en: 'bush', ipa: '/bʊʃ/', vi: 'cây bụi' },
    ],
    questions: [
      {
        kind: 'TFNG',
        q: 'Green tea and black tea are made from different plants.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        why:
          'Đoạn A nói rõ ngược lại: cả ba loại "come from this same plant", khác nhau ở cách xử lý lá sau khi hái.',
        whyNot: 'Bài nêu thẳng thông tin trái với câu hỏi → FALSE.',
      },
      {
        kind: 'GAP',
        q: 'Leaves that are dried ____________ remain green.',
        answer: 'quickly',
        why: 'Đoạn A: "Leaves that are dried quickly stay green".',
        whyNot: 'Chép nguyên trạng từ trong bài; điền "fast" là sai vì bài dùng "quickly".',
      },
      {
        kind: 'MCQ',
        q: 'Why did Buddhist monks value tea?',
        options: [
          'It was cheaper than other drinks.',
          'It kept them awake while meditating.',
          'It was part of a formal ceremony.',
          'It could be grown in temple gardens.',
        ],
        answer: 'It kept them awake while meditating.',
        why: 'Đoạn B: "it helped them stay awake during long periods of meditation".',
        whyNot:
          'C là bẫy: nghi lễ trà CÓ trong bài nhưng phát triển SAU ở Nhật, không phải lý do các nhà sư quý '
          + 'trà. A và D không có trong bài.',
      },
      {
        kind: 'TFNG',
        q: 'When tea first arrived in Europe, only rich people could buy it.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'TRUE',
        why:
          'Đoạn C: "At first it was extremely expensive and only wealthy families could afford it" — thậm chí '
          + 'còn cất trong hộp gỗ có khoá.',
        whyNot: 'Thông tin trực tiếp, không cần suy luận.',
      },
      {
        kind: 'MCQ',
        q: 'Why did Britain try to grow tea outside China?',
        options: [
          'Chinese tea had become poor in quality.',
          'Paying with silver was seen as unsustainable.',
          'Chinese growers refused to sell more tea.',
          'Indian tea tasted better.',
        ],
        answer: 'Paying with silver was seen as unsustainable.',
        why:
          'Đoạn D: Anh trả tiền mua trà Trung Quốc bằng bạc, "which the government considered unsustainable", '
          + 'nên mới tìm cách trồng trà ngoài Trung Quốc.',
        whyNot:
          'A, C, D nghe hợp lý nhưng bài không hề nhắc tới chất lượng, việc từ chối bán, hay vị ngon hơn.',
      },
      {
        kind: 'GAP',
        q: 'Large tea plantations were set up in Assam and in Sri Lanka, which was then called ____________.',
        answer: 'Ceylon',
        why: 'Đoạn D: "in Sri Lanka, then known as Ceylon".',
        whyNot: 'Đây là dạng câu bám vào một chi tiết tên riêng — quét tìm tên nước trong bài là ra ngay.',
      },
      {
        kind: 'TFNG',
        q: 'Tea is the most popular drink in the world.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        why:
          'Đoạn E nói trà là đồ uống PHA CHẾ được uống nhiều nhất "after water" — tức là sau nước lọc. Câu hỏi '
          + 'bỏ mất chữ "after water" nên thành sai.',
        whyNot:
          'Bẫy rất hay gặp: đề bỏ bớt một điều kiện giới hạn trong bài. Phải đọc đủ cả cụm, không dừng ở nửa câu.',
      },
      {
        kind: 'MCQ',
        q: 'Why are tea bushes cut back on plantations?',
        options: [
          'To make the plants live longer',
          'To let pickers reach the young leaves',
          'To protect them from strong sun',
          'To produce more seeds',
        ],
        answer: 'To let pickers reach the young leaves',
        why:
          'Đoạn E: cây được cắt liên tục "so that pickers can reach the young leaves", và lá non là phần duy '
          + 'nhất dùng cho trà ngon.',
        whyNot: 'A, C, D không xuất hiện trong bài.',
      },
      {
        kind: 'MATCH',
        q: 'Which paragraph describes how tea became affordable for ordinary people?',
        options: ['Paragraph B', 'Paragraph C', 'Paragraph D', 'Paragraph E'],
        answer: 'Paragraph C',
        why: 'Đoạn C: giá giảm khi buôn bán tăng, tới thế kỷ XIX trà thành đồ uống hằng ngày "for people of all incomes".',
        whyNot: 'Đoạn D nói về việc mở đồn điền, đoạn E nói về hiện tại.',
      },
      {
        kind: 'GAP',
        q: 'Only the ____________ leaves are used to make good-quality tea.',
        answer: 'young',
        why: 'Đoạn E: "the young leaves, which are the only part used for good-quality tea".',
        whyNot: 'Điền "new" hoặc "fresh" là sai — phải đúng từ trong bài.',
      },
    ],
    strategy: [
      'Bài lịch sử luôn nhiều mốc thời gian và tên riêng — gạch chân chúng ngay lần đọc đầu, câu hỏi hầu như đều bám vào đó.',
      'Bẫy "bỏ bớt điều kiện": bài viết "nhiều nhất SAU nước lọc", câu hỏi viết "nhiều nhất". Luôn đọc hết cả cụm.',
      'Với MCQ hỏi lý do (Why…?), tìm trong bài các từ chỉ nguyên nhân: because, since, so that, therefore, as.',
      'Tên riêng lạ (Ceylon, Assam) rất dễ quét tìm vì viết hoa — dùng chúng làm mốc định vị nhanh trong bài.',
    ],
    translation:
      'A. Trà đến từ lá của một loài cây duy nhất, Camellia sinensis, mọc tự nhiên ở vùng đồi ấm phía nam Trung '
      + 'Quốc và bắc Myanmar. Trà xanh, trà đen và ô long đều từ cùng cây này; khác biệt nằm ở cách xử lý lá sau '
      + 'khi hái. Lá được sấy nhanh thì giữ màu xanh, còn lá để phản ứng với không khí sẽ chuyển sẫm và cho ra '
      + 'trà đen.\n\n'
      + 'B. Trà được uống ở Trung Quốc từ rất lâu trước khi các nơi khác biết đến. Nó lan sang Nhật qua các nhà '
      + 'sư Phật giáo, những người quý trà vì nó giúp họ tỉnh táo trong các buổi thiền dài. Ở Nhật, thức uống này '
      + 'phát triển thành một nghi lễ trang trọng với quy tắc, phòng ốc và dụng cụ riêng.\n\n'
      + 'C. Thương nhân châu Âu mang trà về nhà vào thế kỷ XVII. Ban đầu nó cực kỳ đắt và chỉ gia đình giàu có '
      + 'mới mua nổi; trà được cất trong hộp gỗ có khoá. Khi giao thương tăng lên, giá giảm xuống, và tới thế kỷ '
      + 'XIX trà đã thành đồ uống hằng ngày ở Anh với mọi mức thu nhập.\n\n'
      + 'D. Nhu cầu tạo ra vấn đề. Anh trả tiền mua trà Trung Quốc bằng bạc, điều mà chính phủ coi là không bền '
      + 'vững. Vì thế người ta tìm cách trồng trà bên ngoài Trung Quốc. Cây giống và kiến thức được đưa sang Ấn '
      + 'Độ, các đồn điền lớn được lập ở Assam rồi sau đó ở Sri Lanka, khi ấy gọi là Ceylon.\n\n'
      + 'E. Ngày nay trà là thức uống pha chế được dùng rộng rãi nhất thế giới sau nước lọc, và được trồng ở hàng '
      + 'chục quốc gia. Song bản thân cây trà thay đổi rất ít. Một bụi trà để mặc sẽ mọc thành cây nhỏ; ở đồn '
      + 'điền nó bị cắt tỉa liên tục để người hái với tới được lá non — phần duy nhất dùng cho trà chất lượng cao.',
  },

  /* ═══════════════════ BÀI 5 ═══════════════════ */
  {
    id: 'r5',
    title: 'Does Working from Home Actually Work?',
    titleVi: 'Làm việc tại nhà có thật sự hiệu quả?',
    level: 'B1 — dạng nêu ý kiến hai chiều',
    words: 257,
    minutes: 13,
    paragraphs: [
      {
        label: 'A',
        text:
          'Before 2020, working from home was unusual in most industries. Managers worried that employees '
          + 'would do less work if nobody could see them. When offices closed suddenly, millions of people '
          + 'had to try it, and companies were forced to find out whether those worries were correct.',
      },
      {
        label: 'B',
        text:
          'The results surprised many managers. In several large surveys, employees reported working the '
          + 'same hours or more, partly because the time they used to spend travelling was now spent at '
          + 'the desk. Workers also said they were interrupted less often, which made concentrating on '
          + 'difficult tasks easier.',
      },
      {
        label: 'C',
        text:
          'Not everything improved. New employees suffered most: they had no easy way to ask small '
          + 'questions and learned their jobs more slowly. Creative work that depends on quick discussion '
          + 'also became harder, since a video call has to be arranged in advance, while a conversation in '
          + 'a corridor does not.',
      },
      {
        label: 'D',
        text:
          'Home conditions varied enormously. An employee with a spare room and fast internet had a very '
          + 'different experience from one sharing a small flat with several family members. Surveys that '
          + 'report an average therefore hide a wide range of situations, and this is one reason why '
          + 'different studies reach different conclusions.',
      },
      {
        label: 'E',
        text:
          'Most large companies have now settled on a mixed arrangement, with staff in the office two or '
          + 'three days a week. Supporters argue that this keeps the benefits of both systems. Critics '
          + 'reply that it can produce the worst of both: workers still pay for travel and still lack the '
          + 'full social contact of a traditional office. The argument is far from finished.',
      },
    ],
    glossary: [
      { en: 'employee', ipa: '/ɪmˈplɔɪiː/', vi: 'nhân viên' },
      { en: 'survey', ipa: '/ˈsɜːveɪ/', vi: 'khảo sát' },
      { en: 'interrupt', ipa: '/ˌɪntəˈrʌpt/', vi: 'ngắt quãng, làm gián đoạn' },
      { en: 'concentrate', ipa: '/ˈkɒnsntreɪt/', vi: 'tập trung' },
      { en: 'arrange', ipa: '/əˈreɪndʒ/', vi: 'sắp xếp, hẹn trước' },
      { en: 'vary', ipa: '/ˈveəri/', vi: 'khác nhau, biến thiên' },
      { en: 'arrangement', ipa: '/əˈreɪndʒmənt/', vi: 'cách sắp xếp, thoả thuận' },
    ],
    questions: [
      {
        kind: 'HEADING',
        q: 'Choose the best heading for Paragraph B.',
        options: [
          'The fears turned out to be wrong',
          'Who lost out most',
          'Two or three days in the office',
          'Why studies disagree',
        ],
        answer: 'The fears turned out to be wrong',
        why:
          'Đoạn B cho thấy nỗi lo "nhân viên sẽ làm ít đi" (nêu ở đoạn A) không đúng: họ làm bằng hoặc nhiều '
          + 'giờ hơn, lại ít bị ngắt quãng.',
        whyNot: '"Who lost out most" là đoạn C, "Two or three days" là đoạn E, "Why studies disagree" là đoạn D.',
      },
      {
        kind: 'HEADING',
        q: 'Choose the best heading for Paragraph D.',
        options: [
          'The end of the office',
          'Averages hide big differences',
          'Learning a new job',
          'What managers feared',
        ],
        answer: 'Averages hide big differences',
        why:
          'Đoạn D: điều kiện ở nhà khác nhau rất nhiều, nên khảo sát báo con số TRUNG BÌNH "hide a wide range '
          + 'of situations".',
        whyNot: '"Learning a new job" thuộc đoạn C. "What managers feared" thuộc đoạn A.',
      },
      {
        kind: 'TFNG',
        q: 'Before 2020, most managers expected home workers to be less productive.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'TRUE',
        why: 'Đoạn A: "Managers worried that employees would do less work if nobody could see them."',
        whyNot: 'Thông tin nêu trực tiếp ngay đoạn mở đầu.',
      },
      {
        kind: 'GAP',
        q: 'Employees said they spent their former ____________ time working instead.',
        answer: 'travelling',
        alt: ['travel'],
        why: 'Đoạn B: "the time they used to spend travelling was now spent at the desk".',
        whyNot:
          'Điền "commuting" tuy đúng nghĩa nhưng KHÔNG có trong bài — dạng Completion chỉ chấp nhận từ nguyên văn.',
      },
      {
        kind: 'MCQ',
        q: 'According to paragraph C, which group had the most difficulty?',
        options: [
          'Managers with large teams',
          'Employees who had just joined',
          'Workers with fast internet',
          'People living alone',
        ],
        answer: 'Employees who had just joined',
        why: 'Đoạn C: "New employees suffered most" — họ khó hỏi những câu nhỏ và học việc chậm hơn.',
        whyNot:
          'C và D lấy chi tiết từ đoạn D (điều kiện nhà ở) và đặt sai chỗ. A không có trong bài.',
      },
      {
        kind: 'MCQ',
        q: 'Why did creative work become harder?',
        options: [
          'Employees were more tired at home.',
          'Video calls need to be planned ahead of time.',
          'Companies stopped paying for new equipment.',
          'People preferred to work alone.',
        ],
        answer: 'Video calls need to be planned ahead of time.',
        why:
          'Đoạn C: "a video call has to be arranged in advance, while a conversation in a corridor does not" — '
          + 'đây chính là lý do các cuộc trao đổi nhanh khó xảy ra.',
        whyNot: 'A, C, D không hề xuất hiện trong bài.',
      },
      {
        kind: 'TFNG',
        q: 'All studies of home working reach the same conclusion.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        why:
          'Đoạn D nói ngược: đó là "one reason why different studies reach different conclusions" — các nghiên '
          + 'cứu cho kết luận KHÁC nhau.',
        whyNot: 'Chú ý từ tuyệt đối "All" trong câu hỏi — thường là dấu hiệu của FALSE hoặc NOT GIVEN.',
      },
      {
        kind: 'GAP',
        q: 'Most large companies now ask staff to come to the office ____________ or three days a week.',
        answer: 'two',
        alt: ['2'],
        why: 'Đoạn E: "with staff in the office two or three days a week".',
        whyNot: 'Dạng điền số — chép đúng như bài viết, bài dùng chữ nên viết chữ là an toàn.',
      },
      {
        kind: 'MCQ',
        q: 'What do critics say about the mixed arrangement?',
        options: [
          'It is more expensive for companies.',
          'It may combine the disadvantages of both systems.',
          'It works only for new employees.',
          'It will disappear within a few years.',
        ],
        answer: 'It may combine the disadvantages of both systems.',
        why:
          'Đoạn E: "it can produce the worst of both" — vẫn tốn tiền đi lại mà vẫn thiếu giao tiếp xã hội đầy đủ.',
        whyNot:
          'A nói về chi phí của công ty, nhưng bài nói chi phí của NGƯỜI LAO ĐỘNG. C và D không có trong bài.',
      },
      {
        kind: 'TFNG',
        q: 'The writer believes the debate about home working has been settled.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        why: 'Câu cuối bài: "The argument is far from finished." — tranh luận còn lâu mới xong.',
        whyNot: 'Bài nói rõ điều ngược lại với câu hỏi → FALSE, không phải NOT GIVEN.',
      },
    ],
    strategy: [
      'Bài nêu ý kiến hai chiều luôn có đoạn "ủng hộ" và đoạn "phản đối" — xác định chúng trước, câu hỏi thường bám vào ranh giới giữa hai bên.',
      'Câu cuối bài rất hay là đáp án cho câu hỏi về quan điểm người viết — đọc kỹ câu cuối.',
      'Từ "Supporters argue…" và "Critics reply…" là biển chỉ đường: quan điểm sau đó KHÔNG phải của người viết.',
      'Dạng Heading: đọc câu đầu đoạn trước; nếu câu đầu chỉ là chuyển ý thì đọc tiếp câu thứ hai.',
    ],
    translation:
      'A. Trước năm 2020, làm việc tại nhà là chuyện hiếm ở phần lớn các ngành. Quản lý lo rằng nhân viên sẽ làm '
      + 'ít đi nếu không ai nhìn thấy họ. Khi văn phòng đóng cửa đột ngột, hàng triệu người buộc phải thử, và các '
      + 'công ty buộc phải biết những lo lắng đó có đúng hay không.\n\n'
      + 'B. Kết quả làm nhiều quản lý bất ngờ. Trong vài khảo sát lớn, nhân viên cho biết họ làm việc đúng bằng '
      + 'hoặc nhiều giờ hơn, một phần vì thời gian trước đây dành cho đi lại nay dành cho bàn làm việc. Người lao '
      + 'động cũng nói họ ít bị ngắt quãng hơn, khiến việc tập trung vào công việc khó trở nên dễ hơn.\n\n'
      + 'C. Không phải mọi thứ đều tốt lên. Nhân viên mới chịu thiệt nhiều nhất: họ không có cách dễ dàng để hỏi '
      + 'những câu nhỏ và học việc chậm hơn. Công việc sáng tạo vốn dựa vào trao đổi nhanh cũng khó hơn, vì một '
      + 'cuộc gọi video phải hẹn trước, còn một cuộc nói chuyện ngoài hành lang thì không.\n\n'
      + 'D. Điều kiện tại nhà rất khác nhau. Một nhân viên có phòng riêng và mạng nhanh trải nghiệm hoàn toàn '
      + 'khác người ở chung căn hộ nhỏ với nhiều thành viên gia đình. Vì vậy các khảo sát báo con số trung bình '
      + 'đã che giấu một dải tình huống rất rộng, và đây là một lý do khiến các nghiên cứu khác nhau đi đến những '
      + 'kết luận khác nhau.\n\n'
      + 'E. Phần lớn công ty lớn nay chọn cách sắp xếp hỗn hợp, nhân viên lên văn phòng hai hoặc ba ngày mỗi '
      + 'tuần. Người ủng hộ cho rằng cách này giữ được lợi ích của cả hai hệ thống. Người phản đối đáp lại rằng '
      + 'nó có thể tạo ra cái dở của cả hai: người lao động vẫn tốn tiền đi lại mà vẫn thiếu sự giao tiếp xã hội '
      + 'đầy đủ của văn phòng truyền thống. Cuộc tranh luận còn lâu mới kết thúc.',
  },
];
