/**
 * Đọc · Nghe · Viết · Nói của chặng 3, gom vào một file.
 *
 * Hai chặng trước tách mỗi kỹ năng một file. Từ chặng 3 gom lại vì mỗi kỹ năng
 * ở đây ít đầu mục hơn nhưng mỗi đầu mục nặng hơn — tách ra thành bốn file
 * ngắn chỉ làm khó tìm. Bundle chỉ quan tâm tới các export nên hình dạng dữ
 * liệu vẫn y hệt hai chặng đầu.
 */
import type {
  ReadingPassage, ListeningExercise, ListeningSource, WritingTask, SpeakingTopic,
} from '../types';

/* ══════════════════════ ĐỌC ══════════════════════ */

export const READINGS3: ReadingPassage[] = [
  {
    id: 's3r1',
    title: 'The Quiet Decline of the Office Telephone',
    titleVi: 'Sự lụi tàn lặng lẽ của điện thoại bàn',
    level: 'B2 — độ khó gần đề thật, paraphrase dày',
    words: 512,
    minutes: 20,
    paragraphs: [
      { label: 'A', text: 'For most of the twentieth century the telephone sat at the centre of office life. A desk without one was not really a desk. Yet in many organisations the handset has now been removed altogether, and its disappearance says more about how work has changed than about the technology itself.' },
      { label: 'B', text: 'The first pressure came from email, which offered something the telephone could not: a written record. A colleague who agreed to something by phone could later remember it differently, whereas an email settled the question. This advantage mattered most in large organisations, where decisions pass through many hands and nobody can recall every conversation.' },
      { label: 'C', text: 'Messaging platforms then removed a second advantage. The telephone had been the fastest way to reach someone, but a message that appears instantly on a screen is faster still, and it does not demand that both people are free at the same moment. Dr Helena Ruiz, who studies workplace communication, argues that this asynchronous quality is the decisive factor: a call interrupts, whereas a message waits.' },
      { label: 'D', text: 'Not everyone regards the shift as progress. Professor Daniel Okafor points out that written exchanges lose tone, and that misunderstandings which a thirty-second call would have resolved can escalate over several days of terse messages. He also notes that junior staff learn a great deal from overhearing how experienced colleagues handle difficult conversations, an education that vanishes when those conversations move into private text channels.' },
      { label: 'E', text: 'The evidence on productivity is mixed and, in Ruiz view, frequently misread. Studies showing fewer interruptions after telephones were removed are often cited as proof of improvement, but they rarely measure whether the interrupted work was worth protecting. A short call that prevents a week of wasted effort is an interruption well spent.' },
      { label: 'F', text: 'What seems clear is that the telephone did not fail on its own terms. It remained excellent at what it always did well: conveying tone, resolving ambiguity quickly, and allowing two people to think aloud together. It declined because organisations came to value written records and uninterrupted time more highly than those qualities, a choice that was rarely made explicitly and has never really been examined.' },
    ],
    glossary: [
      { en: 'handset', ipa: '/ˈhændset/', vi: 'ống nghe điện thoại' },
      { en: 'asynchronous', ipa: '/eɪˈsɪŋkrənəs/', vi: 'không đồng thời' },
      { en: 'terse', ipa: '/tɜːs/', vi: 'cộc lốc, cụt lủn' },
      { en: 'escalate', ipa: '/ˈeskəleɪt/', vi: 'leo thang' },
      { en: 'vanish', ipa: '/ˈvænɪʃ/', vi: 'biến mất' },
      { en: 'ambiguity', ipa: '/ˌæmbɪˈɡjuːəti/', vi: 'sự mơ hồ' },
      { en: 'explicitly', ipa: '/ɪkˈsplɪsɪtli/', vi: 'một cách rõ ràng, minh thị' },
    ],
    questions: [
      { kind: 'MATCH', q: 'Which person argues that the timing of communication is the decisive factor?', options: ['Dr Helena Ruiz', 'Professor Daniel Okafor', 'The writer', 'Neither'], answer: 'Dr Helena Ruiz', why: 'Đoạn C: Ruiz cho rằng tính "asynchronous" — không đòi hai người rảnh cùng lúc — mới là yếu tố quyết định.', whyNot: 'Okafor bàn về giọng điệu và việc học nghề của nhân viên mới, không bàn về thời điểm.' },
      { kind: 'MATCH', q: 'Which person is concerned about how new staff learn?', options: ['Professor Daniel Okafor', 'Dr Helena Ruiz', 'The writer', 'Neither'], answer: 'Professor Daniel Okafor', why: 'Đoạn D: Okafor lưu ý nhân viên trẻ học nhiều nhờ nghe lỏm cách đồng nghiệp kỳ cựu xử lý cuộc trò chuyện khó.', whyNot: 'Dạng Matching Features — quét TÊN RIÊNG trước, rồi đọc kỹ phần quanh tên.' },
      { kind: 'TFNG', q: 'Email became popular mainly because it was cheaper than telephone calls.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'NOT GIVEN', why: 'Đoạn B nêu lợi thế của email là có BẢN GHI viết, hoàn toàn không nhắc tới chi phí.', whyNot: 'Bẫy quen thuộc: lý do nêu ra hợp lý ngoài đời nhưng bài không hề nói.' },
      { kind: 'YNNG', q: 'The writer believes the telephone declined because it stopped working well.', options: ['YES', 'NO', 'NOT GIVEN'], answer: 'NO', why: 'Đoạn F nói ngược hẳn: "the telephone did not fail on its own terms" — nó vẫn giỏi đúng những việc nó vốn giỏi.', whyNot: 'Dạng YNNG hỏi QUAN ĐIỂM tác giả. Viết TRUE/FALSE là mất điểm dù hiểu đúng.' },
      { kind: 'YNNG', q: 'The writer thinks organisations made this change after careful consideration.', options: ['YES', 'NO', 'NOT GIVEN'], answer: 'NO', why: 'Câu cuối đoạn F: lựa chọn đó "was rarely made explicitly and has never really been examined".', whyNot: 'Tác giả nêu quan điểm rõ ràng ở câu cuối — dạng YNNG rất hay hỏi vào đó.' },
      { kind: 'MCQ', q: 'According to paragraph E, what is the problem with studies showing fewer interruptions?', options: ['They use too few participants.', 'They do not check whether the interrupted work mattered.', 'They were funded by technology companies.', 'They only looked at large organisations.'], answer: 'They do not check whether the interrupted work mattered.', why: 'Đoạn E: các nghiên cứu "rarely measure whether the interrupted work was worth protecting".', whyNot: 'A, C, D nghe hợp lý nhưng bài không nói. Đây là bẫy "đúng ngoài đời, không có trong bài".' },
      { kind: 'GAP', q: 'Okafor says written exchanges lose ____________.', answer: 'tone', why: 'Đoạn D: "written exchanges lose tone".', whyNot: 'Chép nguyên văn một từ.' },
      { kind: 'GAP', q: 'A call interrupts, whereas a message ____________.', answer: 'waits', why: 'Đoạn C: "a call interrupts, whereas a message waits".', whyNot: 'Câu đối lập rất gọn — đề hay lấy đúng cặp này.' },
      { kind: 'MCQ', q: 'What does the writer say the telephone remained good at?', options: ['Creating written records', 'Conveying tone and resolving ambiguity quickly', 'Reaching people who are busy', 'Protecting uninterrupted time'], answer: 'Conveying tone and resolving ambiguity quickly', why: 'Đoạn F liệt kê đúng ba thứ: truyền giọng điệu, giải toả mơ hồ nhanh, và cho hai người cùng nghĩ thành tiếng.', whyNot: 'A và D chính là những thứ tổ chức chuyển sang coi trọng HƠN, không phải điểm mạnh của điện thoại.' },
      { kind: 'HEADING', q: 'Choose the best heading for Paragraph B.', options: ['Something the phone could not offer', 'A faster way to reach someone', 'What was lost along the way', 'Reading the evidence wrongly'], answer: 'Something the phone could not offer', why: 'Đoạn B nói về lợi thế email có mà điện thoại không có: bản ghi viết.', whyNot: '"A faster way" là đoạn C, "What was lost" là đoạn D, "Reading the evidence wrongly" là đoạn E.' },
    ],
    strategy: [
      'Bài có HAI tên riêng — khoanh tròn ngay lần đọc đầu, dạng Matching Features bám hoàn toàn vào đó.',
      'Bài này trộn TFNG và YNNG. Đọc kỹ đề: hỏi THÔNG TIN thì trả lời TRUE/FALSE, hỏi QUAN ĐIỂM thì YES/NO. Viết nhầm là mất điểm dù hiểu đúng.',
      'Phân biệt quan điểm TÁC GIẢ với quan điểm người được trích. "Okafor points out…" là ý Okafor.',
      'Ở độ khó này, đáp án gần như không dùng lại từ trong câu hỏi. Tự nghĩ 2 cách diễn đạt lại rồi mới quét.',
    ],
    translation:
      'A. Suốt phần lớn thế kỷ XX, điện thoại nằm ở trung tâm đời sống văn phòng. Một cái bàn không có điện thoại thì chưa thật sự là bàn làm việc. Vậy mà ở nhiều tổ chức, ống nghe nay đã bị gỡ bỏ hẳn, và sự biến mất đó nói về việc công việc đã thay đổi thế nào nhiều hơn là nói về bản thân công nghệ.\n\n'
      + 'B. Sức ép đầu tiên đến từ email, thứ mang lại điều mà điện thoại không có: một bản ghi bằng chữ. Một đồng nghiệp đã đồng ý điều gì qua điện thoại sau này có thể nhớ khác đi, trong khi một email thì giải quyết dứt điểm câu hỏi đó. Lợi thế này quan trọng nhất ở các tổ chức lớn, nơi quyết định đi qua nhiều tầng và không ai nhớ nổi mọi cuộc trò chuyện.\n\n'
      + 'C. Các nền tảng nhắn tin sau đó xoá nốt lợi thế thứ hai. Điện thoại từng là cách nhanh nhất để tiếp cận ai đó, nhưng một tin nhắn hiện ngay trên màn hình còn nhanh hơn, và nó không đòi hỏi cả hai người phải rảnh cùng lúc. Tiến sĩ Helena Ruiz, người nghiên cứu về giao tiếp nơi làm việc, cho rằng chính tính không đồng thời này mới là yếu tố quyết định: một cuộc gọi thì cắt ngang, còn một tin nhắn thì chờ.\n\n'
      + 'D. Không phải ai cũng coi thay đổi này là tiến bộ. Giáo sư Daniel Okafor chỉ ra rằng trao đổi bằng chữ làm mất giọng điệu, và những hiểu lầm mà một cuộc gọi ba mươi giây có thể giải quyết lại leo thang qua nhiều ngày nhắn tin cộc lốc. Ông cũng lưu ý rằng nhân viên trẻ học được rất nhiều nhờ nghe lỏm cách các đồng nghiệp kỳ cựu xử lý những cuộc trò chuyện khó — một sự học biến mất khi các cuộc trò chuyện đó chuyển vào kênh nhắn tin riêng tư.\n\n'
      + 'E. Bằng chứng về năng suất thì lẫn lộn, và theo Ruiz, thường bị đọc sai. Các nghiên cứu cho thấy ít bị ngắt quãng hơn sau khi bỏ điện thoại hay được viện dẫn như bằng chứng của sự cải thiện, nhưng chúng hiếm khi đo xem công việc bị ngắt quãng có đáng được bảo vệ hay không. Một cuộc gọi ngắn ngăn được cả tuần công sức lãng phí là một lần ngắt quãng rất đáng.\n\n'
      + 'F. Điều có vẻ rõ ràng là điện thoại không thất bại theo tiêu chuẩn của chính nó. Nó vẫn xuất sắc ở đúng những việc nó luôn làm tốt: truyền giọng điệu, giải toả mơ hồ nhanh, và cho phép hai người cùng nghĩ thành tiếng. Nó lụi tàn vì các tổ chức chuyển sang coi trọng bản ghi viết và thời gian không bị ngắt quãng hơn những phẩm chất ấy — một lựa chọn hiếm khi được đưa ra một cách minh thị và chưa bao giờ thật sự được xem xét lại.',
  },
];

/* ══════════════════════ NGHE ══════════════════════ */

export const LISTENINGS3: ListeningExercise[] = [
  {
    id: 's3l1',
    title: 'Tutorial: Choosing a Dissertation Topic',
    titleVi: 'Buổi tư vấn: chọn đề tài luận văn',
    kind: 'Section 3 — ba người nói, nhiều lần đổi ý',
    level: 'Khó · đúng độ khó đề thật',
    context:
      'Ba người: giảng viên và hai sinh viên. Section 3 ở độ khó này có nhiều lần đảo ý và ý kiến trái chiều. '
      + 'Quy tắc: đáp án là quyết định CUỐI CÙNG, và phải theo được AI nói câu chốt.',
    lines: [
      { who: 'Giảng viên', text: 'Right, you two have had a week to think. Where have you got to?' },
      { who: 'Priya', text: 'We started with social media and political opinion, but the literature is enormous.' },
      { who: 'Tom', text: 'And most of it is American, which does not transfer well to our context.' },
      { who: 'Giảng viên', text: 'That is a fair objection. What is the alternative?' },
      { who: 'Priya', text: 'Local news deserts — towns that have lost their only newspaper. There is almost nothing published on the UK case.' },
      { who: 'Giảng viên', text: 'Now that is genuinely under-researched. How would you gather data?' },
      { who: 'Tom', text: 'Interviews with residents, I thought. Maybe thirty of them.' },
      { who: 'Giảng viên', text: 'Thirty interviews is a full year of work once you include transcription.' },
      { who: 'Priya', text: 'What if we did twelve interviews but went much deeper with each one?' },
      { who: 'Giảng viên', text: 'That is far more realistic. Twelve, done properly, will tell you more than thirty rushed ones.' },
      { who: 'Tom', text: 'Twelve it is. And we could combine that with circulation figures from the archive.' },
      { who: 'Giảng viên', text: 'Good — that gives you a quantitative element as well. Now, who is doing what?' },
      { who: 'Priya', text: 'I will handle the interviews since I have done fieldwork before.' },
      { who: 'Tom', text: 'And I will do the archive work and the statistics.' },
      { who: 'Priya', text: 'Although actually, Tom, you are better with people than I am. Perhaps we should swap.' },
      { who: 'Tom', text: 'Honestly I would rather not — I find interviews exhausting. Let us keep it as it was.' },
      { who: 'Giảng viên', text: 'Fine. Send me a two-page proposal by the end of the month — the thirtieth at the latest.' },
    ],
    questions: [
      { q: 'What was their original topic?', answer: 'social media and political opinion', alt: ['social media', 'social media and politics'], why: '"We started with social media and political opinion" — nhưng bị bỏ vì tài liệu quá nhiều và chủ yếu là của Mỹ.' },
      { q: 'Why did they reject it?', answer: 'the literature is enormous and mostly American', alt: ['too much literature', 'most of it is American', 'the literature is enormous'], why: 'Hai lý do do hai người nêu: Priya nói tài liệu khổng lồ, Tom nói phần lớn là của Mỹ nên không hợp bối cảnh.' },
      { q: 'What is their final topic?', answer: 'local news deserts', alt: ['news deserts', 'towns that have lost their only newspaper'], why: 'Priya đề xuất và giảng viên xác nhận "genuinely under-researched".' },
      { q: 'How many interviews will they finally do?', answer: '12', alt: ['twelve'], why: 'Ban đầu Tom nói 30, giảng viên bảo quá sức, Priya đề xuất 12 sâu hơn, Tom chốt "Twelve it is". Bẫy: 30 được nói TRƯỚC.' },
      { q: 'What quantitative data will they add?', answer: 'circulation figures', alt: ['circulation figures from the archive', 'circulation data'], why: '"we could combine that with circulation figures from the archive" — giảng viên khen vì cho thêm phần định lượng.' },
      { q: 'Who will do the interviews?', answer: 'Priya', why: 'Priya nhận vì đã làm điền dã. Có đề xuất ĐỔI nhưng Tom từ chối, nên phân công GIỮ NGUYÊN — đây là bẫy chính của bài.' },
      { q: 'Who will do the statistics?', answer: 'Tom', why: 'Tom nhận phần lưu trữ và thống kê, và giữ nguyên sau khi từ chối đổi.' },
      { q: 'The proposal is due on the ____________.', answer: '30th', alt: ['thirtieth', '30'], why: '"by the end of the month — the thirtieth at the latest".' },
    ],
    listenFor: ['Although actually / I would rather not (đề xuất đổi RỒI BỊ TỪ CHỐI)', 'Twelve it is (câu chốt)', 'con số nói trước không phải đáp án', 'Let us keep it as it was'],
    tips: [
      'Bẫy khó nhất của bài: có một lần đề xuất ĐỔI VIỆC nhưng bị TỪ CHỐI. Đáp án là phân công ban đầu, không phải đề xuất đổi. Phải nghe hết cả cụm.',
      'Section 3 ba người nói thì phải bám AI nói gì, không chỉ bám nội dung. Ghi tên tắt bên cạnh mỗi ý.',
      'Nghe "Although actually…" là biết sắp có đề xuất thay đổi — nhưng chờ xem người kia có ĐỒNG Ý không.',
    ],
  },
];

export const LISTENING_SOURCES3: ListeningSource[] = [
  { name: '6 Minute English (playlist)', channel: 'BBC Learning English', kind: 'playlist', ytId: 'PLcetZ6gSk96-FECmH9l7Vlx5VDigvgZpt', level: 'B1–B2 — nghe chủ động, chép chính tả', how: 'Chặng 3 dùng nguồn này để CHÉP CHÍNH TẢ hằng ngày, rồi phân loại lỗi theo bài 14 chặng 2. Nghe không chép thì không chẩn đoán được gì.' },
  { name: 'British Council IELTS (playlist chính thức)', channel: 'TakeIELTS Official — British Council', kind: 'playlist', ytId: 'PLrt2nkX3MUeBNAcBAap6B313_tlVRCAxz', level: 'Hướng dẫn về kỳ thi', how: 'Xem các video về tiêu chí chấm Writing — chặng 3 là chặng Writing quyết định, nên hiểu tiêu chí là việc đáng làm nhất.' },
  { name: '6 Minute English — bộ tổng hợp 1 giờ', channel: 'BBC Learning English', kind: 'video', ytId: 'fcN0BXzK8bg', level: 'B2 — luyện sức bền', how: 'Nghe liền một tiếng để quen với việc không được nghỉ — đúng cảm giác Section 4 của đề thật.' },
];

/* ══════════════════════ VIẾT ══════════════════════ */

export const WRITINGS3: WritingTask[] = [
  {
    id: 's3w1',
    task: 'Task 1 (Academic)',
    title: 'Biểu đồ cột — chi tiêu hộ gia đình bốn nước',
    figure: {
      kind: 'bar',
      title: 'Household spending by category in four countries (% of total)',
      note: 'Số liệu tự đặt cho bài luyện, không lấy từ đề thi thật.',
      unit: '%',
      categories: ['Housing', 'Food', 'Transport', 'Leisure'],
      series: [
        { name: 'Country A', values: [32, 18, 15, 12] },
        { name: 'Country B', values: [24, 30, 12, 8] },
        { name: 'Country C', values: [28, 22, 20, 14] },
      ],
    },
    prompt: 'The bar chart below shows household spending by category in three countries, as a percentage of total spending. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
    promptVi: 'Biểu đồ cột cho biết tỷ lệ chi tiêu hộ gia đình theo từng hạng mục ở ba quốc gia. Tóm tắt bằng cách chọn và tường thuật các đặc điểm chính, có so sánh khi cần.',
    minWords: 150,
    minutes: 20,
    outline: [
      { part: 'Câu mở', what: 'Viết lại đề. KHÔNG chép — phần chép không tính vào số từ.' },
      { part: 'Câu tổng quan', what: 'BẮT BUỘC, không có số liệu. Ở biểu đồ so sánh nhiều nhóm, tổng quan nên nêu: hạng mục nào cao nhất ở đâu, và khác biệt lớn nhất giữa các nước.' },
      { part: 'Thân 1', what: 'Nhóm giống nhau: nhà ở đứng đầu ở A và C.' },
      { part: 'Thân 2', what: 'Nhóm khác biệt: B chi cho thực phẩm nhiều nhất — đây là đặc điểm đáng viết nhất.' },
    ],
    phrases: [
      { en: 'The bar chart compares…', vi: 'Biểu đồ cột so sánh…' },
      { en: 'Housing accounted for the largest share in…', vi: 'Nhà ở chiếm tỷ trọng lớn nhất ở…' },
      { en: 'By contrast, in Country B…', vi: 'Ngược lại, ở nước B…' },
      { en: 'at 30%, almost double the figure for…', vi: 'ở mức 30%, gần gấp đôi con số của…' },
      { en: 'The pattern was broadly similar in A and C.', vi: 'Khuôn mẫu ở A và C khá giống nhau.' },
      { en: 'the most striking difference', vi: 'khác biệt nổi bật nhất' },
    ],
    sample: {
      band: 'Mức 7.0 — tổng quan sắc, nhóm theo khuôn mẫu',
      text: 'The bar chart compares how households in three countries divided their spending across four categories, expressed as a percentage of total expenditure.\n\nOverall, housing was the single largest cost in two of the three countries, and the most striking difference lies in Country B, where food rather than housing dominated the household budget.\n\nIn Countries A and C the pattern was broadly similar. Housing took the largest share in both, at 32% and 28% respectively, followed by food at 18% and 22%. Transport and leisure accounted for the remainder, with Country C spending somewhat more on both than Country A did.\n\nCountry B departed from this pattern in one clear respect. Food absorbed 30% of household spending there, almost double the figure for Country A, while housing accounted for only 24%. Spending on leisure was also lowest in Country B, at 8%, which is a third less than the corresponding figure in Country C.',
      note: '176 từ. Điểm ăn điểm ở band 7.0: câu tổng quan không chỉ nêu cái cao nhất mà nêu được KHUÔN MẪU và ngoại lệ. Nhóm hai nước giống nhau vào một đoạn, nước khác biệt vào đoạn riêng — đó là "chọn lọc thông tin", không phải liệt kê.',
    },
    weakSample: {
      band: 'Mức 6.0 — đúng nhưng chỉ liệt kê, không nhóm',
      text: 'The bar chart shows household spending by category in three countries. In Country A, housing is 32%, food is 18%, transport is 15% and leisure is 12%. In Country B, housing is 24%, food is 30%, transport is 12% and leisure is 8%. In Country C, housing is 28%, food is 22%, transport is 20% and leisure is 14%. Overall, we can see that the figures are different in each country.',
      problems: [
        'Liệt kê từng nước theo thứ tự, không nhóm theo khuôn mẫu. Đây là "đọc biểu đồ" chứ không phải "chọn lọc".',
        'Câu tổng quan đặt ở CUỐI và rỗng: "the figures are different" không nói được gì.',
        'Không có so sánh nào giữa các nước — mà đề yêu cầu rõ "make comparisons where relevant".',
        'Bỏ sót đặc điểm quan trọng nhất: nước B là ngoại lệ vì thực phẩm vượt nhà ở.',
        'Dùng thì hiện tại "is" cho toàn bộ số liệu, lặp một cấu trúc 12 lần.',
      ],
    },
    mistakes: [
      { wrong: 'Overall, the figures are different in each country.', right: 'Overall, housing was the largest cost in two of the three countries, and the most striking difference lies in Country B.', why: 'Câu tổng quan phải nêu KHUÔN MẪU và ngoại lệ. "Khác nhau" là điều hiển nhiên với mọi biểu đồ so sánh.' },
      { wrong: 'Liệt kê lần lượt từng nước.', right: 'Nhóm các nước GIỐNG nhau vào một đoạn, nước KHÁC BIỆT vào đoạn riêng.', why: 'Tiêu chí Task Achievement chấm khả năng chọn lọc và nhóm. Liệt kê máy móc chặn trần ở khoảng 6.0.' },
      { wrong: 'In Country A, housing is 32%.', right: 'Housing took the largest share in Country A, at 32%.', why: 'Nêu Ý NGHĨA của con số (lớn nhất) rồi mới đưa số, thay vì đọc số trơ.' },
    ],
  },
  {
    id: 's3w2',
    task: 'Task 2 (Nguyên nhân & giải pháp)',
    title: 'Vì sao người trẻ rời bỏ nghề truyền thống',
    prompt: 'In many countries, young people are increasingly unwilling to take up traditional crafts and trades. Why is this happening, and what could be done to encourage them? Write at least 250 words.',
    promptVi: 'Ở nhiều nước, người trẻ ngày càng không muốn theo các nghề thủ công truyền thống. Vì sao vậy, và có thể làm gì để khuyến khích họ?',
    minWords: 250,
    minutes: 40,
    outline: [
      { part: 'Mở bài', what: 'Viết lại đề + nói rõ bài sẽ bàn nguyên nhân rồi giải pháp.' },
      { part: 'Thân 1 — Nguyên nhân', what: 'HAI nguyên nhân được giải thích sâu, mỗi cái có ví dụ. Không liệt kê bốn nguyên nhân nông.' },
      { part: 'Thân 2 — Giải pháp', what: 'Giải pháp phải ỨNG với nguyên nhân vừa nêu. Đây là chỗ bài 6.0 hay đứt gãy.' },
      { part: 'Kết bài', what: 'Chốt nguyên nhân gốc và giải pháp khả thi nhất, có điều kiện kèm theo.' },
    ],
    phrases: [
      { en: 'The principal cause is…', vi: 'Nguyên nhân chính là…' },
      { en: 'This is compounded by…', vi: 'Điều này còn bị làm trầm trọng thêm bởi…' },
      { en: 'stem from', vi: 'bắt nguồn từ' },
      { en: 'One measure that follows directly from this is…', vi: 'Một biện pháp suy ra trực tiếp từ đó là…' },
      { en: 'be perceived as', vi: 'bị coi là' },
      { en: 'provided that', vi: 'với điều kiện là' },
    ],
    sample: {
      band: 'Mức 7.0 — giải pháp ỨNG với nguyên nhân, có điều kiện ở kết bài',
      text: 'Across much of the world, workshops that once passed skills from one generation to the next are struggling to recruit anyone under thirty. This essay will consider why traditional trades have lost their appeal before suggesting what might realistically reverse the trend.\n\nThe principal cause is economic rather than cultural. A carpenter or weaver typically earns less than an office worker with comparable years of training, and the income is far less predictable. A young person choosing between a salaried job and a craft is therefore choosing between security and risk, and most choose security. This is compounded by status: decades of policy in many countries have treated university as the default route and vocational work as what happens to those who fail, a message that families absorb long before their children make any decision.\n\nThe measures that follow from this analysis are reasonably clear. Since the barrier is largely financial, paid apprenticeships that guarantee an income during training would remove the most immediate obstacle, as Germany has demonstrated over several decades. Changing perceptions is slower but not impossible: if schools presented craft training alongside academic routes rather than beneath them, and if successful makers were as visible as successful graduates, the status gap would narrow.\n\nIn short, young people are not rejecting craft itself; they are responding rationally to the incentives placed in front of them. Change those incentives and the response will change too, provided that the effort is sustained long enough for a full generation to notice.',
      note: '265 từ. Ba điểm ở mức 7.0: (1) nguyên nhân nêu ĐÚNG HAI cái nhưng mỗi cái được giải thích và có ví dụ; (2) mỗi giải pháp ứng thẳng với một nguyên nhân đã nêu, không phải danh sách rời; (3) kết bài diễn giải lại vấn đề ở tầng sâu hơn ("phản ứng hợp lý trước động cơ") và kèm điều kiện.',
    },
    weakSample: {
      band: 'Mức 6.0 — đúng cấu trúc nhưng ý nông và giải pháp rời rạc',
      text: 'Nowadays, many young people do not want to do traditional jobs. There are several reasons for this problem and also some solutions.\n\nFirstly, traditional jobs earn less money. Secondly, young people prefer to work in offices. Thirdly, these jobs are hard and tiring. Fourthly, parents want their children to go to university.\n\nThere are some solutions. The government should give money to traditional workers. Schools should teach students about traditional culture. The media should make programmes about traditional jobs. Companies should pay higher salaries.\n\nIn conclusion, traditional jobs are important for our culture and everyone should work together to protect them.',
      problems: [
        'Mở bài dùng "Nowadays" và không viết lại đề — mất cơ hội ăn điểm ngay câu đầu.',
        'Bốn nguyên nhân, mỗi cái đúng một câu, không cái nào được giải thích hay có ví dụ.',
        'Giải pháp KHÔNG ứng với nguyên nhân: nêu "cha mẹ muốn con vào đại học" rồi lại đề xuất "truyền thông làm chương trình".',
        'Kết bài chuyển sang lý do văn hoá, trong khi cả bài nói về kinh tế — không nhất quán.',
        'Lặp cấu trúc "should + V" năm lần liền.',
        'Chỉ 106 từ, dưới mức tối thiểu 250.',
      ],
    },
    mistakes: [
      { wrong: 'Nêu 4 nguyên nhân, mỗi cái một câu.', right: 'Nêu 2 nguyên nhân, mỗi cái giải thích kỹ và có ví dụ cụ thể.', why: 'Task Response chấm ĐỘ TRIỂN KHAI, không chấm số lượng ý. Đây là khác biệt rõ nhất giữa 6.0 và 7.0.' },
      { wrong: 'Nguyên nhân: cha mẹ muốn con vào đại học. Giải pháp: truyền thông làm chương trình.', right: 'Nguyên nhân: nghề thủ công bị coi là lựa chọn của người thất bại. Giải pháp: nhà trường trình bày đào tạo nghề NGANG HÀNG với con đường học thuật.', why: 'Giải pháp phải ứng thẳng với nguyên nhân vừa nêu. Hai danh sách rời nhau bị chấm là thiếu mạch lạc.' },
      { wrong: 'Kết bài chuyển sang lý do văn hoá trong khi cả bài nói về kinh tế.', right: 'Kết bài diễn giải lại chính luận điểm của bài ở tầng sâu hơn.', why: 'Kết bài lệch chủ đề làm hỏng tính nhất quán — bị trừ ở cả Task Response lẫn Coherence.' },
    ],
  },
];

/* ══════════════════════ NÓI ══════════════════════ */

export const SPEAKINGS3: SpeakingTopic[] = [
  {
    id: 's3sp1',
    part: 'Part 3',
    title: 'Tradition and change',
    titleVi: 'Truyền thống và đổi thay',
    phrases: [
      { en: 'That rather depends on what we mean by…', vi: 'Cái đó còn tuỳ ta hiểu… là gì.' },
      { en: 'I think there is a distinction to be drawn between…', vi: 'Tôi nghĩ cần phân biệt giữa…' },
      { en: 'The usual argument is…, but I am not sure it holds.', vi: 'Lập luận thường thấy là…, nhưng tôi không chắc nó đứng vững.' },
      { en: 'If anything, the opposite is true.', vi: 'Nếu có thì ngược lại mới đúng.' },
      { en: 'It varies enormously from place to place.', vi: 'Chuyện đó khác nhau rất nhiều tuỳ nơi.' },
    ],
    questions: [
      {
        q: 'Should governments spend money preserving traditional crafts?',
        qVi: 'Chính phủ có nên chi tiền bảo tồn nghề thủ công truyền thống không?',
        weak: 'Yes, because traditional crafts are part of our culture and we should protect them.',
        good: 'That rather depends on what we mean by preserving. If it means paying people to produce objects nobody buys, then I am sceptical — that turns a living craft into a museum exhibit, and the skills do not really survive because nobody depends on them. But if it means funding apprenticeships so that the knowledge transfers to someone who will then make a living from it, that seems entirely justified. The distinction matters because the two policies look similar on paper and produce completely different outcomes.',
        goodVi: 'Cái đó còn tuỳ ta hiểu "bảo tồn" là gì. Nếu là trả tiền cho người ta làm ra những món chẳng ai mua, tôi hoài nghi — như vậy là biến một nghề đang sống thành hiện vật bảo tàng, và kỹ năng không thật sự sống sót vì chẳng ai phụ thuộc vào nó. Nhưng nếu là tài trợ cho việc học nghề để kiến thức truyền sang một người rồi sẽ sống được bằng nghề đó, thì hoàn toàn xứng đáng. Sự phân biệt này quan trọng vì hai chính sách trông giống nhau trên giấy mà cho kết quả hoàn toàn khác.',
        why: 'Câu cụt đúng nhưng là câu ai cũng nói được. Câu đủ ăn điểm nhờ PHÂN BIỆT hai cách hiểu của chính câu hỏi rồi trả lời khác nhau cho từng cách. Đây là kỹ thuật mạnh nhất ở Part 3 vì nó vừa cho thấy tư duy vừa tự nhiên kéo dài câu trả lời gấp ba.',
      },
      {
        q: 'Do you think globalisation makes cultures more similar?',
        qVi: 'Bạn có nghĩ toàn cầu hoá làm các nền văn hoá giống nhau hơn không?',
        weak: 'Yes, I think so. Now everyone wears the same clothes and eats the same food.',
        good: 'On the surface, obviously yes — the same coffee chains and the same phones everywhere. But I think that is the least interesting layer. What people actually believe, how families are organised, what counts as rude — those have converged far less, and in some cases the opposite has happened, because contact with outsiders makes people more conscious of what is distinctively theirs. So I would say globalisation has made the visible layer uniform while leaving the deeper one largely intact, which is why travelling still feels foreign even when the shops look familiar.',
        goodVi: 'Bề ngoài thì rõ ràng là có — cùng những chuỗi cà phê, cùng loại điện thoại ở khắp nơi. Nhưng tôi nghĩ đó là tầng ít thú vị nhất. Người ta thật sự tin gì, gia đình tổ chức ra sao, điều gì bị coi là bất lịch sự — những cái đó hội tụ ít hơn nhiều, và đôi khi còn ngược lại, vì tiếp xúc với người ngoài làm người ta ý thức hơn về cái riêng của mình. Nên tôi cho rằng toàn cầu hoá làm tầng nhìn thấy được trở nên đồng nhất trong khi tầng sâu vẫn gần như nguyên vẹn — đó là lý do đi nước ngoài vẫn thấy lạ dù cửa hàng trông quen thuộc.',
        why: 'Kỹ thuật ở đây là TÁCH TẦNG: bề mặt và chiều sâu. Nó cho phép bạn vừa đồng ý vừa không đồng ý mà không mâu thuẫn, và kết bằng một quan sát cụ thể. Ở band 7 giám khảo tìm đúng loại lập luận có cấu trúc như vậy.',
      },
    ],
  },
];

export const SPEAKING_RULES3: { title: string; body: string }[] = [
  { title: 'Phân biệt cách hiểu của chính câu hỏi', body: '"That depends on what we mean by X" — rồi trả lời khác nhau cho từng cách hiểu. Đây là kỹ thuật mạnh nhất ở Part 3: vừa cho thấy tư duy, vừa tự nhiên kéo dài câu trả lời gấp ba mà không cần thêm kiến thức.' },
  { title: 'Tách tầng: bề mặt và chiều sâu', body: 'Với câu hỏi về xu hướng xã hội, tách "cái nhìn thấy được" khỏi "cái bên dưới". Cho phép bạn vừa đồng ý vừa phản biện mà không mâu thuẫn.' },
  { title: 'Tự phản biện trước khi giám khảo làm', body: 'Nêu quan điểm rồi thêm "The usual argument is…, but I am not sure it holds". Cho thấy bạn đã nghĩ tới phía kia — dấu hiệu rõ của band 7.' },
  { title: 'Ở chặng này, nội dung bắt đầu quan trọng', body: 'Band 6.5 trở xuống chỉ chấm cách nói. Từ 7.0, câu trả lời rỗng dù trôi chảy vẫn bị hạn chế ở Coherence, vì "coherence" gồm cả việc ý có nối nhau hợp lý không.' },
];
