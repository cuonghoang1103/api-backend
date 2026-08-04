/**
 * Bài đọc chặng 2 — 3 bài TỰ VIẾT, khó hơn chặng 1 rõ rệt.
 *
 * Ba thứ nâng lên so với chặng 1:
 *   1. Độ dài ~450 từ (chặng 1: ~280) và câu phức hơn.
 *   2. Đủ các dạng câu hỏi mới học ở tab Dạng câu hỏi: thêm Yes/No/Not Given
 *      và Matching Features, vốn không có ở chặng 1.
 *   3. Đáp án được PARAPHRASE nhiều hơn — câu hỏi gần như không dùng lại từ
 *      trong bài, đúng như đề thật. Đây là điểm khiến người học chặng 2 thấy
 *      khó dù đọc hiểu được từng câu.
 *
 * Vẫn tự viết, không chép đề Cambridge.
 */
import type { ReadingPassage } from '../types';

export const READINGS2: ReadingPassage[] = [
  /* ═══════════════════ BÀI 1 ═══════════════════ */
  {
    id: 's2r1',
    title: 'The Four-Day Week: Evidence So Far',
    titleVi: 'Tuần làm việc bốn ngày: bằng chứng đến nay',
    level: 'B1+ — dạng nêu ý kiến, có Yes/No/Not Given',
    words: 452,
    minutes: 20,
    paragraphs: [
      {
        label: 'A',
        text:
          'The idea of a shorter working week is not new. In 1930 the economist John Maynard Keynes predicted '
          + 'that within a century most people would work only fifteen hours a week, since machines would do '
          + 'the rest. That prediction has clearly not come true. Working hours did fall steadily until the '
          + '1980s, but since then progress has largely stalled in most wealthy countries.',
      },
      {
        label: 'B',
        text:
          'Interest revived after 2019, when a number of organisations began formal trials. The best known ran '
          + 'in the United Kingdom, where around sixty companies gave staff a day off each week with no '
          + 'reduction in pay. Participants ranged from small software firms to a fish-and-chip shop. Most of '
          + 'the organisations that took part chose to continue the arrangement after the trial ended, which '
          + 'supporters treat as the strongest evidence available.',
      },
      {
        label: 'C',
        text:
          'The reported benefits were consistent. Staff described lower levels of stress and better sleep, and '
          + 'the number of days lost to illness fell. Several firms found it easier to recruit, since a shorter '
          + 'week is unusual enough to attract attention. Revenue, on average, did not decline. Dr Elena Marsh, '
          + 'who advised one of the trials, argues that these gains come mainly from cutting waste: meetings '
          + 'were shortened, and tasks that added little value were simply dropped.',
      },
      {
        label: 'D',
        text:
          'Critics are less convinced. Professor Aiden Croft points out that the companies which volunteered '
          + 'were not typical: they were mostly small, mostly office-based, and already interested in the idea. '
          + 'A factory or a hospital cannot simply remove a fifth of its working time. He also notes that the '
          + 'trials measured results over a few months, which tells us little about what happens over a decade.',
      },
      {
        label: 'E',
        text:
          'There is a further complication. In several trials, staff reported working more intensely during the '
          + 'four days they were present. For some employees this was a fair exchange. Others found the '
          + 'compressed schedule tiring, particularly those with caring responsibilities who had less '
          + 'flexibility during the working day. The average figures published afterwards concealed this '
          + 'variation entirely.',
      },
      {
        label: 'F',
        text:
          'What seems reasonably clear is that the model suits some kinds of work far better than others, and '
          + 'that its success depends less on the number of days than on whether an organisation is willing to '
          + 'abandon unproductive habits. In that sense the four-day week may matter mainly as a prompt: it '
          + 'forces managers to ask which activities actually produce value, a question few of them ask otherwise.',
      },
    ],
    glossary: [
      { en: 'stall', ipa: '/stɔːl/', vi: 'chững lại, đứng im' },
      { en: 'trial', ipa: '/ˈtraɪəl/', vi: 'cuộc thử nghiệm' },
      { en: 'revenue', ipa: '/ˈrevənjuː/', vi: 'doanh thu' },
      { en: 'recruit', ipa: '/rɪˈkruːt/', vi: 'tuyển dụng' },
      { en: 'compressed', ipa: '/kəmˈprest/', vi: 'bị nén lại, dồn lại' },
      { en: 'conceal', ipa: '/kənˈsiːl/', vi: 'che giấu' },
      { en: 'abandon', ipa: '/əˈbændən/', vi: 'từ bỏ' },
      { en: 'prompt', ipa: '/prɒmpt/', vi: 'cú hích, sự thúc đẩy' },
    ],
    questions: [
      {
        kind: 'TFNG',
        q: 'Keynes expected that people in the twenty-first century would work far fewer hours.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'TRUE',
        why:
          'Đoạn A: Keynes dự đoán "within a century most people would work only fifteen hours a week". Một thế '
          + 'kỷ tính từ 1930 là thế kỷ XXI.',
        whyNot:
          'Chú ý paraphrase: bài viết "fifteen hours a week", câu hỏi viết "far fewer hours". Không có từ nào '
          + 'trùng ngoài "hours".',
      },
      {
        kind: 'TFNG',
        q: 'Working hours in rich countries have continued to fall since the 1980s.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        why:
          'Đoạn A nói ngược: giờ làm giảm đều tới thập niên 1980, "but since then progress has largely stalled".',
        whyNot: 'Bài CÓ nói về đúng giai đoạn này và nói ngược lại câu hỏi → FALSE, không phải NOT GIVEN.',
      },
      {
        kind: 'TFNG',
        q: 'All the organisations in the UK trial were technology companies.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        why:
          'Đoạn B: "Participants ranged from small software firms to a fish-and-chip shop" — có cả quán cá rán, '
          + 'không phải toàn công ty công nghệ.',
        whyNot: 'Từ tuyệt đối "All" trong câu hỏi là dấu hiệu cảnh báo — kiểm kỹ là thấy sai ngay.',
      },
      {
        kind: 'MATCH',
        q: 'Which paragraph explains why the benefits appeared, according to one adviser?',
        options: ['Paragraph B', 'Paragraph C', 'Paragraph D', 'Paragraph E'],
        answer: 'Paragraph C',
        why:
          'Đoạn C: Dr Marsh cho rằng lợi ích đến chủ yếu từ việc cắt bỏ lãng phí — họp ngắn lại, bỏ việc ít giá trị.',
        whyNot: 'Đoạn D là ý phê phán, đoạn E là chuyện cường độ làm việc.',
      },
      {
        kind: 'MATCH',
        q: 'Which person argues that the companies studied were not representative?',
        options: ['Dr Elena Marsh', 'Professor Aiden Croft', 'John Maynard Keynes', 'The writer'],
        answer: 'Professor Aiden Croft',
        why:
          'Đoạn D: Croft chỉ ra rằng các công ty tình nguyện tham gia "were not typical" — nhỏ, làm văn phòng, '
          + 'và vốn đã quan tâm tới ý tưởng này.',
        whyNot:
          'Dạng Matching Features: quét tìm TÊN RIÊNG (viết hoa nên rất dễ thấy) rồi đọc kỹ phần quanh tên đó.',
      },
      {
        kind: 'GAP',
        q: 'Croft says the trials only measured results over a few ____________.',
        answer: 'months',
        why: 'Đoạn D: "the trials measured results over a few months".',
        whyNot: 'Chép nguyên văn, giữ số nhiều. Điền "month" là sai dạng.',
      },
      {
        kind: 'MCQ',
        q: 'According to paragraph E, why did some staff dislike the four-day week?',
        options: [
          'They were paid less than before.',
          'The remaining days felt more intense and tiring.',
          'They had to travel further to work.',
          'Their managers disapproved of it.',
        ],
        answer: 'The remaining days felt more intense and tiring.',
        why:
          'Đoạn E: nhân viên báo là làm việc căng hơn trong bốn ngày có mặt; một số thấy lịch bị dồn lại gây mệt.',
        whyNot:
          'A sai vì đoạn B nói rõ "with no reduction in pay". C và D không có trong bài — đây là phương án '
          + '"hợp lý ngoài đời nhưng bài không nói".',
      },
      {
        kind: 'MCQ',
        q: 'What point does paragraph E make about the published average figures?',
        options: [
          'They were calculated incorrectly.',
          'They hid the fact that experiences differed widely.',
          'They were based on too few companies.',
          'They were not released to the public.',
        ],
        answer: 'They hid the fact that experiences differed widely.',
        why: 'Câu cuối đoạn E: "The average figures published afterwards concealed this variation entirely."',
        whyNot: 'conceal = che giấu. Đây là chỗ paraphrase: "concealed this variation" → "hid… differed widely".',
      },
      {
        kind: 'MCQ',
        q: 'In paragraph F, what does the writer suggest is the model’s main value?',
        options: [
          'It reduces costs for every type of business.',
          'It makes managers question which activities are actually useful.',
          'It proves Keynes was right.',
          'It should be made compulsory.',
        ],
        answer: 'It makes managers question which activities are actually useful.',
        why:
          'Đoạn F: mô hình này "may matter mainly as a prompt: it forces managers to ask which activities '
          + 'actually produce value".',
        whyNot:
          'A quá rộng — bài nói rõ mô hình chỉ hợp với MỘT SỐ loại công việc. C và D bài không hề nói.',
      },
      {
        kind: 'TFNG',
        q: 'The writer believes the four-day week is suitable for every industry.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        why:
          'Đoạn F nói ngược: mô hình "suits some kinds of work far better than others". Đoạn D cũng nêu nhà máy '
          + 'và bệnh viện không bỏ được một phần năm thời gian làm việc.',
        whyNot: 'Lại là từ tuyệt đối "every" — luôn phải kiểm kỹ khi gặp.',
      },
    ],
    strategy: [
      'Bài này có TÊN RIÊNG của hai nhà nghiên cứu — khoanh tròn chúng ngay lần đọc đầu, dạng Matching Features bám hoàn toàn vào đó.',
      'Đáp án ở chặng 2 hầu như KHÔNG dùng lại từ trong bài. Đọc câu hỏi xong, tự nghĩ 2 cách bài có thể diễn đạt lại rồi mới quét.',
      'Gặp từ tuyệt đối trong câu hỏi (All, every, only, always) thì gần như luôn phải kiểm rất kỹ — đây là bẫy quen thuộc.',
      'Phân biệt quan điểm của TÁC GIẢ với quan điểm của người được trích. "Croft points out…" là ý của Croft, không phải của tác giả.',
    ],
    translation:
      'A. Ý tưởng về tuần làm việc ngắn hơn không mới. Năm 1930, nhà kinh tế John Maynard Keynes dự đoán rằng '
      + 'trong vòng một thế kỷ, phần lớn mọi người sẽ chỉ làm mười lăm giờ một tuần vì máy móc làm phần còn lại. '
      + 'Dự đoán đó rõ ràng đã không thành sự thật. Số giờ làm việc có giảm đều cho tới thập niên 1980, nhưng từ '
      + 'đó tiến trình phần lớn đã chững lại ở hầu hết các nước giàu.\n\n'
      + 'B. Sự quan tâm sống lại sau năm 2019, khi một số tổ chức bắt đầu các cuộc thử nghiệm chính thức. Nổi '
      + 'tiếng nhất diễn ra ở Anh, nơi khoảng sáu mươi công ty cho nhân viên nghỉ thêm một ngày mỗi tuần mà không '
      + 'giảm lương. Đơn vị tham gia trải từ các công ty phần mềm nhỏ tới một quán cá rán. Phần lớn tổ chức tham '
      + 'gia đã chọn duy trì cách sắp xếp này sau khi thử nghiệm kết thúc, điều mà phe ủng hộ coi là bằng chứng '
      + 'mạnh nhất hiện có.\n\n'
      + 'C. Các lợi ích được báo cáo khá nhất quán. Nhân viên mô tả mức căng thẳng thấp hơn và ngủ tốt hơn, số '
      + 'ngày nghỉ ốm giảm. Vài công ty thấy tuyển người dễ hơn, vì tuần làm ngắn đủ lạ để gây chú ý. Doanh thu, '
      + 'tính trung bình, không giảm. Tiến sĩ Elena Marsh, người tư vấn cho một trong các thử nghiệm, cho rằng '
      + 'những cải thiện này chủ yếu đến từ việc cắt bỏ lãng phí: các cuộc họp được rút ngắn, và những việc ít '
      + 'giá trị thì đơn giản là bị bỏ đi.\n\n'
      + 'D. Phe phê phán thì ít bị thuyết phục hơn. Giáo sư Aiden Croft chỉ ra rằng các công ty tình nguyện tham '
      + 'gia không điển hình: phần lớn là công ty nhỏ, phần lớn làm việc văn phòng, và vốn đã quan tâm tới ý '
      + 'tưởng này. Một nhà máy hay một bệnh viện không thể đơn giản cắt bỏ một phần năm thời gian làm việc. Ông '
      + 'cũng lưu ý rằng các thử nghiệm đo kết quả trong vài tháng, điều đó cho ta biết rất ít về chuyện gì xảy '
      + 'ra sau một thập kỷ.\n\n'
      + 'E. Còn một điểm phức tạp nữa. Trong vài thử nghiệm, nhân viên cho biết họ làm việc căng hơn trong bốn '
      + 'ngày có mặt. Với một số người, đó là sự đánh đổi công bằng. Người khác thấy lịch làm bị dồn lại gây mệt, '
      + 'nhất là những ai còn phải chăm sóc người thân nên ít linh hoạt hơn trong ngày làm việc. Các con số trung '
      + 'bình công bố sau đó đã che giấu hoàn toàn sự khác biệt này.\n\n'
      + 'F. Điều có vẻ khá rõ là mô hình này hợp với một số loại công việc hơn hẳn các loại khác, và thành công '
      + 'của nó phụ thuộc vào việc tổ chức có sẵn sàng từ bỏ những thói quen kém hiệu quả hay không, chứ không '
      + 'phụ thuộc vào số ngày. Theo nghĩa đó, tuần làm bốn ngày có lẽ quan trọng chủ yếu như một cú hích: nó '
      + 'buộc người quản lý phải hỏi hoạt động nào thật sự tạo ra giá trị — câu hỏi mà ít người trong số họ đặt ra.',
  },

  /* ═══════════════════ BÀI 2 ═══════════════════ */
  {
    id: 's2r2',
    title: 'How Cities Cool Themselves',
    titleVi: 'Thành phố tự làm mát bằng cách nào',
    level: 'B1+ — bài khoa học, có Matching Headings',
    words: 438,
    minutes: 20,
    paragraphs: [
      {
        label: 'A',
        text:
          'On a summer afternoon, the centre of a large city can be several degrees warmer than the countryside '
          + 'around it. The difference is not caused by the weather. It is produced by the city itself, and '
          + 'scientists have a name for it: the urban heat island. Dark surfaces such as asphalt absorb sunlight '
          + 'during the day and release it slowly after dark, so the night never cools down properly.',
      },
      {
        label: 'B',
        text:
          'Buildings make the problem worse in two ways. Their walls trap heat between them, rather like the '
          + 'sides of a narrow canyon, so warm air cannot escape upwards. In addition, air conditioning units '
          + 'move heat from inside a building to the street outside. The cooler the offices, in other words, the '
          + 'hotter the pavement — a fact that becomes uncomfortable during a heatwave, when everyone runs their '
          + 'machines at once.',
      },
      {
        label: 'C',
        text:
          'The oldest remedy is also the cheapest. Trees cool a street in two separate ways: they block sunlight '
          + 'before it reaches the ground, and they release water vapour through their leaves, which lowers the '
          + 'temperature of the surrounding air. A single mature tree can have a measurable effect on the '
          + 'pavement beneath it. Planting programmes are popular with residents, though they take decades to '
          + 'deliver their full benefit and require watering in exactly the dry periods when water is scarce.',
      },
      {
        label: 'D',
        text:
          'A quicker option is to change the colour of the city. Painting roofs white, or covering them with '
          + 'reflective material, sends sunlight back into the sky instead of absorbing it. Buildings treated in '
          + 'this way stay noticeably cooler inside, which reduces the demand for air conditioning and therefore '
          + 'the heat pushed out into the streets. The technique is cheap and can be applied to an existing '
          + 'building in an afternoon. Its weakness is that it does nothing for pedestrians at street level.',
      },
      {
        label: 'E',
        text:
          'Water is the third approach. Fountains, ponds and small canals cool the air as the water evaporates. '
          + 'Some cities have uncovered rivers that were buried under roads decades ago, a process known as '
          + 'daylighting. The results can be striking, but the cost is high and the space required is space that '
          + 'cannot be used for housing — a difficult argument to win in a city where rents are already beyond '
          + 'the reach of many residents.',
      },
      {
        label: 'F',
        text:
          'No single method solves the problem. Most researchers now argue for a combination, chosen according '
          + 'to the shape of the particular city. What matters more than the choice of technique, they suggest, '
          + 'is that heat is treated as a planning question from the beginning, rather than as something to be '
          + 'corrected once the concrete has set.',
      },
    ],
    glossary: [
      { en: 'absorb', ipa: '/əbˈzɔːb/', vi: 'hấp thụ' },
      { en: 'trap', ipa: '/træp/', vi: 'giữ lại, bẫy lại' },
      { en: 'remedy', ipa: '/ˈremədi/', vi: 'cách khắc phục' },
      { en: 'vapour', ipa: '/ˈveɪpə(r)/', vi: 'hơi nước' },
      { en: 'reflective', ipa: '/rɪˈflektɪv/', vi: 'phản chiếu' },
      { en: 'pedestrian', ipa: '/pəˈdestriən/', vi: 'người đi bộ' },
      { en: 'evaporate', ipa: '/ɪˈvæpəreɪt/', vi: 'bốc hơi' },
      { en: 'striking', ipa: '/ˈstraɪkɪŋ/', vi: 'ấn tượng, nổi bật' },
    ],
    questions: [
      {
        kind: 'HEADING',
        q: 'Choose the best heading for Paragraph C.',
        options: [
          'The traditional solution and its limits',
          'Why buildings add to the heat',
          'Bringing back hidden rivers',
          'A problem the city creates for itself',
        ],
        answer: 'The traditional solution and its limits',
        why:
          'Đoạn C nói về cây xanh — "the oldest remedy" — kèm hai hạn chế: mất hàng chục năm mới có tác dụng '
          + 'đầy đủ, và cần tưới đúng vào mùa khô khi nước khan hiếm.',
        whyNot:
          '"Why buildings add to the heat" là đoạn B, "Bringing back hidden rivers" là đoạn E, "A problem the '
          + 'city creates for itself" là đoạn A.',
      },
      {
        kind: 'HEADING',
        q: 'Choose the best heading for Paragraph D.',
        options: [
          'Fast, cheap, but only for those indoors',
          'The cost of using space for water',
          'Two ways trees help',
          'Planning from the start',
        ],
        answer: 'Fast, cheap, but only for those indoors',
        why:
          'Đoạn D: sơn mái trắng rẻ, làm được trong một buổi chiều, nhưng "does nothing for pedestrians at '
          + 'street level" — chỉ giúp người trong nhà.',
        whyNot: 'Tiêu đề phải bao được CẢ đoạn: vừa ưu điểm vừa nhược điểm. Chọn tiêu đề chỉ đúng một câu là sai.',
      },
      {
        kind: 'TFNG',
        q: 'The urban heat island is caused mainly by unusual weather patterns.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        why: 'Đoạn A nói ngược: "The difference is not caused by the weather. It is produced by the city itself."',
        whyNot: 'Bài phủ định thẳng điều câu hỏi khẳng định → FALSE.',
      },
      {
        kind: 'MCQ',
        q: 'According to paragraph B, what is the effect of air conditioning on a street?',
        options: [
          'It cools the street as well as the building.',
          'It moves heat out of the building and into the street.',
          'It has no measurable effect outdoors.',
          'It reduces the need for trees.',
        ],
        answer: 'It moves heat out of the building and into the street.',
        why:
          'Đoạn B: máy điều hoà "move heat from inside a building to the street outside" — văn phòng càng mát '
          + 'thì vỉa hè càng nóng.',
        whyNot: 'A ngược hẳn với bài. C và D không có trong bài.',
      },
      {
        kind: 'GAP',
        q: 'Trees lower the temperature partly by releasing water ____________ through their leaves.',
        answer: 'vapour',
        alt: ['vapor'],
        why: 'Đoạn C: "they release water vapour through their leaves".',
        whyNot: 'Chép nguyên văn. Bài dùng chính tả Anh-Anh "vapour"; cách viết Anh-Mỹ cũng được chấp nhận.',
      },
      {
        kind: 'GAP',
        q: 'Uncovering rivers that were buried under roads is called ____________.',
        answer: 'daylighting',
        why: 'Đoạn E: "a process known as daylighting".',
        whyNot:
          'Cụm "known as" báo hiệu một thuật ngữ sắp được đặt tên — dấu hiệu rất dễ quét khi tìm đáp án.',
      },
      {
        kind: 'MCQ',
        q: 'What is given as the main drawback of the water-based approach?',
        options: [
          'It does not lower the temperature much.',
          'It uses space that could be used for housing.',
          'It requires new technology.',
          'It only works at night.',
        ],
        answer: 'It uses space that could be used for housing.',
        why:
          'Đoạn E: chi phí cao và diện tích cần dùng là diện tích "cannot be used for housing" — khó thuyết phục '
          + 'ở thành phố mà giá thuê đã quá tầm với.',
        whyNot: 'A ngược với bài ("The results can be striking"). C và D không có trong bài.',
      },
      {
        kind: 'TFNG',
        q: 'Painting roofs white can be done on a building that already exists.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'TRUE',
        why: 'Đoạn D: "can be applied to an existing building in an afternoon".',
        whyNot: 'Thông tin trực tiếp, chỉ đổi cách diễn đạt: "an existing building" → "a building that already exists".',
      },
      {
        kind: 'MATCH',
        q: 'Which paragraph compares streets to a landscape feature?',
        options: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph E'],
        answer: 'Paragraph B',
        why: 'Đoạn B ví các bức tường giữ nhiệt "rather like the sides of a narrow canyon" — so sánh với hẻm núi.',
        whyNot:
          'Dạng Matching Information: câu hỏi không theo thứ tự bài, nên phải quét từng đoạn tìm dấu hiệu so sánh.',
      },
      {
        kind: 'MCQ',
        q: 'What do most researchers now recommend, according to paragraph F?',
        options: [
          'Choosing one method and applying it everywhere',
          'Combining methods to suit each particular city',
          'Waiting for cheaper technology',
          'Moving people out of city centres',
        ],
        answer: 'Combining methods to suit each particular city',
        why:
          'Đoạn F: "Most researchers now argue for a combination, chosen according to the shape of the '
          + 'particular city."',
        whyNot: 'A ngược hẳn với bài. C và D không xuất hiện.',
      },
    ],
    strategy: [
      'Matching Headings: LÀM SAU CÙNG dù nó in ở đầu. Lúc đó bạn đã đọc kỹ bài nên chọn nhanh hơn nhiều.',
      'Tiêu đề phải bao được CẢ đoạn. Tiêu đề chỉ đúng với một câu trong đoạn là bẫy kinh điển.',
      'Cụm "known as", "called", "a process known as" báo hiệu một thuật ngữ — rất dễ quét, đề hay hỏi vào đó.',
      'Bài khoa học thường mỗi đoạn một giải pháp kèm một nhược điểm. Đọc xong mỗi đoạn tự tóm tắt: giải pháp gì, dở chỗ nào.',
    ],
    translation:
      'A. Vào một buổi chiều mùa hè, trung tâm một thành phố lớn có thể ấm hơn vùng nông thôn xung quanh vài độ. '
      + 'Chênh lệch đó không do thời tiết gây ra. Nó do chính thành phố tạo ra, và các nhà khoa học có tên gọi cho '
      + 'hiện tượng này: đảo nhiệt đô thị. Các bề mặt sẫm màu như nhựa đường hấp thụ ánh nắng ban ngày rồi nhả ra '
      + 'từ từ sau khi trời tối, nên ban đêm không bao giờ mát hẳn.\n\n'
      + 'B. Các toà nhà làm vấn đề tệ hơn theo hai cách. Tường của chúng giữ nhiệt lại ở giữa, khá giống hai vách '
      + 'của một hẻm núi hẹp, nên khí nóng không thoát lên được. Ngoài ra, máy điều hoà chuyển nhiệt từ trong nhà '
      + 'ra ngoài đường. Nói cách khác, văn phòng càng mát thì vỉa hè càng nóng — điều trở nên khó chịu trong đợt '
      + 'nắng nóng, khi mọi người cùng bật máy một lúc.\n\n'
      + 'C. Cách khắc phục lâu đời nhất cũng là cách rẻ nhất. Cây xanh làm mát con phố theo hai cách riêng biệt: '
      + 'chúng chặn ánh nắng trước khi chạm mặt đất, và chúng nhả hơi nước qua lá, làm giảm nhiệt độ không khí '
      + 'xung quanh. Một cây trưởng thành có thể tạo ra hiệu quả đo được trên vỉa hè bên dưới nó. Các chương trình '
      + 'trồng cây được người dân ưa chuộng, dù phải mất hàng chục năm mới phát huy hết tác dụng và cần tưới đúng '
      + 'vào những đợt khô hạn khi nước khan hiếm.\n\n'
      + 'D. Một lựa chọn nhanh hơn là đổi màu của thành phố. Sơn mái nhà màu trắng, hoặc phủ vật liệu phản chiếu, '
      + 'sẽ hắt ánh nắng trở lại bầu trời thay vì hấp thụ nó. Các toà nhà được xử lý như vậy mát hơn hẳn bên trong, '
      + 'nhờ đó giảm nhu cầu điều hoà và do đó giảm lượng nhiệt đẩy ra đường. Kỹ thuật này rẻ và có thể áp dụng cho '
      + 'một toà nhà đã xây xong chỉ trong một buổi chiều. Điểm yếu của nó là không giúp gì cho người đi bộ dưới '
      + 'đường.\n\n'
      + 'E. Nước là hướng thứ ba. Đài phun, ao và kênh nhỏ làm mát không khí khi nước bốc hơi. Một số thành phố đã '
      + 'khơi lại những dòng sông bị chôn dưới đường hàng chục năm trước, một quá trình gọi là daylighting. Kết quả '
      + 'có thể rất ấn tượng, nhưng chi phí cao và phần diện tích cần dùng là diện tích không thể dành cho nhà ở — '
      + 'một lập luận khó thắng ở thành phố mà giá thuê vốn đã quá tầm với của nhiều cư dân.\n\n'
      + 'F. Không phương pháp đơn lẻ nào giải quyết được vấn đề. Phần lớn nhà nghiên cứu hiện ủng hộ việc kết hợp, '
      + 'chọn theo hình dạng của từng thành phố cụ thể. Điều quan trọng hơn cả việc chọn kỹ thuật nào, họ cho rằng, '
      + 'là nhiệt phải được xem là một vấn đề quy hoạch ngay từ đầu, chứ không phải thứ đi sửa sau khi bê tông đã đông.',
  },

  /* ═══════════════════ BÀI 3 ═══════════════════ */
  {
    id: 's2r3',
    title: 'Why We Remember Some Things and Not Others',
    titleVi: 'Vì sao ta nhớ điều này mà quên điều kia',
    level: 'B1+ — bài tâm lý học, có Yes/No/Not Given',
    words: 445,
    minutes: 20,
    paragraphs: [
      {
        label: 'A',
        text:
          'Most people assume that memory works like a recording: events are stored somewhere and later played '
          + 'back. Psychologists abandoned that picture long ago. Remembering is closer to reconstruction than to '
          + 'playback, which is why two people who attended the same meeting can give accounts that differ in '
          + 'important details while both being entirely sincere.',
      },
      {
        label: 'B',
        text:
          'What survives in memory depends less on how long we studied something than on what we did with it. In '
          + 'a classic set of experiments, participants were shown lists of words and asked different questions '
          + 'about each one: whether it was printed in capitals, whether it rhymed with another word, or whether '
          + 'it would fit sensibly into a given sentence. Those who had thought about meaning remembered far more '
          + 'words, even though nobody had been told there would be a test.',
      },
      {
        label: 'C',
        text:
          'The finding has an obvious application to study habits, though it is widely ignored. Reading a page '
          + 'again is pleasant, because the material feels increasingly familiar, and that familiarity is easily '
          + 'mistaken for knowledge. Testing yourself is unpleasant for the opposite reason: it exposes what you '
          + 'cannot do. Yet learners who test themselves consistently outperform those who reread, often by a '
          + 'wide margin, and the gap grows as the delay before the final test increases.',
      },
      {
        label: 'D',
        text:
          'Spacing matters as much as method. Studying a topic in several short sessions spread across days '
          + 'produces better long-term retention than the same total time spent in one sitting. The explanation '
          + 'usually offered is that partial forgetting between sessions makes the next retrieval more effortful, '
          + 'and effortful retrieval strengthens the memory. This is inconvenient advice, since cramming feels '
          + 'productive and often works well enough for an exam the following morning.',
      },
      {
        label: 'E',
        text:
          'Emotion complicates the picture. Strongly emotional events are usually recalled with great confidence, '
          + 'and people are often surprised to learn that such memories are not necessarily more accurate than '
          + 'ordinary ones. Confidence and accuracy are only loosely connected. In several studies, participants '
          + 'who described a dramatic public event years later were certain of details that could be shown, from '
          + 'contemporary records, to be wrong.',
      },
      {
        label: 'F',
        text:
          'None of this means memory is unreliable in any practical sense. For most everyday purposes it works '
          + 'well. But it is worth remembering that the feeling of certainty is produced by the brain along with '
          + 'the memory itself, and is not evidence about the outside world.',
      },
    ],
    glossary: [
      { en: 'reconstruction', ipa: '/ˌriːkənˈstrʌkʃn/', vi: 'sự dựng lại' },
      { en: 'sincere', ipa: '/sɪnˈsɪə(r)/', vi: 'thành thật' },
      { en: 'rhyme', ipa: '/raɪm/', vi: 'gieo vần' },
      { en: 'retention', ipa: '/rɪˈtenʃn/', vi: 'sự lưu giữ (trí nhớ)' },
      { en: 'retrieval', ipa: '/rɪˈtriːvl/', vi: 'sự truy xuất, nhớ lại' },
      { en: 'effortful', ipa: '/ˈefətfl/', vi: 'tốn công sức' },
      { en: 'cram', ipa: '/kræm/', vi: 'học nhồi' },
      { en: 'contemporary', ipa: '/kənˈtemprəri/', vi: 'cùng thời' },
    ],
    questions: [
      {
        kind: 'YNNG',
        q: 'The writer thinks the idea of memory as a recording is mistaken.',
        options: ['YES', 'NO', 'NOT GIVEN'],
        answer: 'YES',
        why:
          'Đoạn A: "Psychologists abandoned that picture long ago" và người viết nói nhớ lại giống dựng lại hơn '
          + 'là phát lại — tức là đồng tình rằng cách hiểu kia sai.',
        whyNot:
          'Chú ý dạng này trả lời YES/NO (hỏi quan điểm), KHÔNG phải TRUE/FALSE. Viết nhầm là mất điểm dù hiểu đúng.',
      },
      {
        kind: 'YNNG',
        q: 'The writer believes rereading is a good way to prepare for an exam.',
        options: ['YES', 'NO', 'NOT GIVEN'],
        answer: 'NO',
        why:
          'Đoạn C: người tự kiểm tra "consistently outperform those who reread, often by a wide margin". Người '
          + 'viết còn nói cảm giác quen thuộc khi đọc lại "is easily mistaken for knowledge".',
        whyNot: 'Bài nêu quan điểm ngược rõ ràng → NO.',
      },
      {
        kind: 'YNNG',
        q: 'The writer thinks students should stop studying the night before an exam.',
        options: ['YES', 'NO', 'NOT GIVEN'],
        answer: 'NOT GIVEN',
        why:
          'Đoạn D có nhắc học nhồi "often works well enough for an exam the following morning", nhưng người viết '
          + 'KHÔNG hề khuyên nên hay không nên học đêm trước.',
        whyNot:
          'Bẫy: bài có nhắc tới chủ đề (học nhồi, thi sáng hôm sau) nên dễ tưởng là có quan điểm. Có nhắc tới '
          + 'KHÁC với có nêu quan điểm.',
      },
      {
        kind: 'MCQ',
        q: 'In the experiments described in paragraph B, which group remembered the most words?',
        options: [
          'Those who noticed the words were in capitals',
          'Those who thought about what the words meant',
          'Those who studied the longest',
          'Those who were told there would be a test',
        ],
        answer: 'Those who thought about what the words meant',
        why: 'Đoạn B: "Those who had thought about meaning remembered far more words."',
        whyNot:
          'C là bẫy: bài nói rõ điều quyết định KHÔNG phải thời gian học mà là bạn làm gì với nội dung. D ngược '
          + 'hẳn — bài nói "nobody had been told there would be a test".',
      },
      {
        kind: 'GAP',
        q: 'Familiarity gained from rereading is easily mistaken for ____________.',
        answer: 'knowledge',
        why: 'Đoạn C: "that familiarity is easily mistaken for knowledge".',
        whyNot: 'Chép nguyên văn một từ.',
      },
      {
        kind: 'MCQ',
        q: 'Why does spacing study sessions help, according to paragraph D?',
        options: [
          'Because students feel less tired',
          'Because partial forgetting makes the next recall more effortful',
          'Because it allows more total study time',
          'Because teachers prefer it',
        ],
        answer: 'Because partial forgetting makes the next recall more effortful',
        why:
          'Đoạn D: quên một phần giữa các buổi khiến lần nhớ lại sau tốn công hơn, "and effortful retrieval '
          + 'strengthens the memory".',
        whyNot:
          'C sai: bài nói rõ là CÙNG tổng thời gian ("the same total time"), chỉ khác cách chia. A và D không có trong bài.',
      },
      {
        kind: 'TFNG',
        q: 'Memories of emotional events are always more accurate than ordinary memories.',
        options: ['TRUE', 'FALSE', 'NOT GIVEN'],
        answer: 'FALSE',
        why:
          'Đoạn E nói ngược: những ký ức đó "are not necessarily more accurate than ordinary ones", và có người '
          + 'chắc chắn về chi tiết mà hồ sơ cùng thời chứng minh là sai.',
        whyNot: 'Từ tuyệt đối "always" — luôn là dấu hiệu phải kiểm kỹ.',
      },
      {
        kind: 'GAP',
        q: 'The writer says confidence and accuracy are only ____________ connected.',
        answer: 'loosely',
        why: 'Đoạn E: "Confidence and accuracy are only loosely connected."',
        whyNot: 'Điền "weakly" tuy nghĩa gần vẫn sai — dạng Completion bắt lấy nguyên văn.',
      },
      {
        kind: 'MATCH',
        q: 'Which paragraph explains why two honest people can describe the same event differently?',
        options: ['Paragraph A', 'Paragraph C', 'Paragraph D', 'Paragraph E'],
        answer: 'Paragraph A',
        why:
          'Đoạn A: nhớ lại là dựng lại chứ không phải phát lại, "which is why two people who attended the same '
          + 'meeting can give accounts that differ… while both being entirely sincere".',
        whyNot: 'Đoạn E nói về ký ức cảm xúc và sự tự tin, không nói về hai người mô tả khác nhau.',
      },
      {
        kind: 'MCQ',
        q: 'What is the writer’s overall conclusion in paragraph F?',
        options: [
          'Memory cannot be trusted for anything.',
          'Memory works well in daily life, but the feeling of certainty proves nothing.',
          'Memory improves with age.',
          'Only written records should be trusted.',
        ],
        answer: 'Memory works well in daily life, but the feeling of certainty proves nothing.',
        why:
          'Đoạn F: "For most everyday purposes it works well" nhưng cảm giác chắc chắn do não tạo ra cùng với ký '
          + 'ức, "and is not evidence about the outside world".',
        whyNot:
          'A quá mạnh, bài nói ngược lại ngay câu đầu đoạn F. C và D không có trong bài. Phương án quá tuyệt đối '
          + 'thường sai ở câu hỏi ý chính.',
      },
    ],
    strategy: [
      'Yes/No/Not Given hỏi QUAN ĐIỂM của tác giả, khác True/False/Not Given hỏi thông tin. Viết nhầm YES thành TRUE là mất điểm oan.',
      'Phân biệt "bài có nhắc tới chủ đề" với "tác giả có nêu quan điểm về nó". Nhắc tới mà không nêu quan điểm → NOT GIVEN.',
      'Câu hỏi về ý chính làm SAU CÙNG, và loại ngay các phương án có từ tuyệt đối (always, never, only, cannot).',
      'Bài tâm lý học hay có thí nghiệm — đọc kỹ ai làm gì và kết quả nhóm nào cao hơn, đề gần như luôn hỏi vào đó.',
    ],
    translation:
      'A. Phần lớn mọi người cho rằng trí nhớ hoạt động như một bản ghi: sự việc được lưu ở đâu đó rồi phát lại '
      + 'sau. Các nhà tâm lý học đã bỏ hình dung đó từ lâu. Nhớ lại gần với việc dựng lại hơn là phát lại, và đó '
      + 'là lý do hai người cùng dự một cuộc họp có thể kể lại khác nhau ở những chi tiết quan trọng mà cả hai đều '
      + 'hoàn toàn thành thật.\n\n'
      + 'B. Thứ còn lại trong trí nhớ phụ thuộc vào việc ta ĐÃ LÀM GÌ với nội dung đó nhiều hơn là ta học nó bao '
      + 'lâu. Trong một loạt thí nghiệm kinh điển, người tham gia được cho xem danh sách từ và hỏi những câu khác '
      + 'nhau về từng từ: từ đó có in hoa không, có gieo vần với từ khác không, hay có hợp lý khi đặt vào một câu '
      + 'cho sẵn không. Những người đã nghĩ về NGHĨA nhớ được nhiều từ hơn hẳn, dù không ai được báo trước là sẽ '
      + 'có bài kiểm tra.\n\n'
      + 'C. Phát hiện này có ứng dụng rõ ràng cho cách học, dù nó bị bỏ qua rộng rãi. Đọc lại một trang thì dễ '
      + 'chịu, vì nội dung ngày càng thấy quen, mà cảm giác quen đó rất dễ bị nhầm thành đã biết. Tự kiểm tra thì '
      + 'khó chịu vì lý do ngược lại: nó phơi ra những gì bạn chưa làm được. Vậy mà người tự kiểm tra luôn vượt '
      + 'trội so với người đọc lại, thường là cách biệt lớn, và khoảng cách đó càng rộng khi thời gian chờ tới bài '
      + 'kiểm tra cuối càng dài.\n\n'
      + 'D. Cách giãn cách quan trọng ngang với phương pháp. Học một chủ đề trong vài buổi ngắn rải ra nhiều ngày '
      + 'cho khả năng lưu giữ lâu dài tốt hơn so với cùng tổng thời gian đó dồn vào một lần. Cách giải thích thường '
      + 'được đưa ra là việc quên một phần giữa các buổi làm cho lần nhớ lại sau tốn công hơn, mà nhớ lại tốn công '
      + 'thì củng cố trí nhớ. Đây là lời khuyên bất tiện, vì học nhồi tạo cảm giác hiệu quả và thường cũng đủ dùng '
      + 'cho bài thi sáng hôm sau.\n\n'
      + 'E. Cảm xúc làm bức tranh phức tạp thêm. Những sự kiện giàu cảm xúc thường được nhớ lại với sự tự tin lớn, '
      + 'và người ta hay bất ngờ khi biết rằng những ký ức đó không nhất thiết chính xác hơn ký ức thường. Sự tự '
      + 'tin và độ chính xác chỉ liên hệ lỏng lẻo với nhau. Trong vài nghiên cứu, người tham gia mô tả một sự kiện '
      + 'chấn động nhiều năm sau đã chắc chắn về những chi tiết mà hồ sơ cùng thời chứng minh được là sai.\n\n'
      + 'F. Điều này không có nghĩa trí nhớ là không đáng tin theo nghĩa thực tế nào. Với phần lớn mục đích hằng '
      + 'ngày, nó hoạt động tốt. Nhưng đáng nhớ rằng cảm giác chắc chắn được não tạo ra cùng lúc với chính ký ức, '
      + 'và nó không phải bằng chứng về thế giới bên ngoài.',
  },
];
