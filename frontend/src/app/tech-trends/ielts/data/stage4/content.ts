/**
 * Chặng 4 (6.5 → 7.5) — từ vựng, bài tập và bốn kỹ năng, gom một file.
 *
 * Từ vựng ở đây ÍT về số lượng nhưng chọn theo tiêu chí khác hẳn: mỗi mục là
 * một chỗ người ở band 6.5 hay dùng CHƯA CHÍNH XÁC. Học thêm 300 từ mới không
 * đưa ai từ 6.5 lên 7.5; dùng đúng 100 từ đã biết thì có.
 */
import type {
  VocabTopic, ExerciseSet, ReadingPassage, ListeningExercise, ListeningSource,
  WritingTask, SpeakingTopic,
} from '../types';

/* ══════════════════ TỪ VỰNG ══════════════════ */

export const VOCAB4: VocabTopic[] = [
  {
    id: 's4-hedge',
    title: 'Cách nói giảm nhẹ (hedging)',
    icon: '🪶',
    why: 'Văn học thuật hiếm khi khẳng định tuyệt đối. Giảm nhẹ không phải nói yếu — nó là nói CHÍNH XÁC về mức độ chắc chắn, và là dấu hiệu rõ nhất của band 7+.',
    words: [
      { en: 'tend to', ipa: '/tend tuː/', vi: 'có xu hướng', pos: 'phr v', ex: 'Larger cities tend to have better public transport.', exVi: 'Các thành phố lớn có xu hướng có giao thông công cộng tốt hơn.' },
      { en: 'be likely to', ipa: '/bi ˈlaɪkli tuː/', vi: 'có khả năng', pos: 'phr', ex: 'Prices are likely to rise further.', exVi: 'Giá có khả năng còn tăng.' },
      { en: 'may well', ipa: '/meɪ wel/', vi: 'rất có thể', pos: 'phr', ex: 'This may well be the main cause.', exVi: 'Đây rất có thể là nguyên nhân chính.' },
      { en: 'appear to', ipa: '/əˈpɪə tuː/', vi: 'có vẻ', pos: 'phr v', ex: 'The policy appears to have worked.', exVi: 'Chính sách có vẻ đã có hiệu quả.' },
      { en: 'broadly speaking', ipa: '/ˈbrɔːdli ˈspiːkɪŋ/', vi: 'nói chung', pos: 'phr', ex: 'Broadly speaking, the trend is upward.', exVi: 'Nói chung, xu hướng là đi lên.' },
      { en: 'with some exceptions', ipa: '/wɪð sʌm ɪkˈsepʃnz/', vi: 'trừ vài ngoại lệ', pos: 'phr', ex: 'With some exceptions, this holds across Europe.', exVi: 'Trừ vài ngoại lệ, điều này đúng khắp châu Âu.' },
      { en: 'the evidence suggests', ipa: '/ði ˈevɪdəns səˈdʒests/', vi: 'bằng chứng cho thấy', pos: 'phr', ex: 'The evidence suggests a weak link.', exVi: 'Bằng chứng cho thấy một mối liên hệ yếu.' },
      { en: 'to a great extent', ipa: '/tuː ə ɡreɪt ɪkˈstent/', vi: 'ở mức độ lớn', pos: 'phr', ex: 'To a great extent, this is a funding problem.', exVi: 'Ở mức độ lớn, đây là vấn đề kinh phí.' },
      { en: 'in part', ipa: '/ɪn pɑːt/', vi: 'một phần', pos: 'phr', ex: 'The rise is in part due to migration.', exVi: 'Mức tăng một phần do di cư.' },
      { en: 'arguably', ipa: '/ˈɑːɡjuəbli/', vi: 'có thể nói là', pos: 'adv', ex: 'This is arguably the central issue.', exVi: 'Có thể nói đây là vấn đề trung tâm.' },
    ],
  },
  {
    id: 's4-degree',
    title: 'Thang mức độ — chọn đúng sắc thái',
    icon: '📏',
    why: 'Dùng từ mạnh cho việc nhỏ là lỗi kín mà giám khảo bắt ngay. Học theo THANG, không học từ lẻ.',
    words: [
      { en: 'dip', ipa: '/dɪp/', vi: 'giảm rất nhẹ', pos: 'v', ex: 'Sales dipped by 2%.', exVi: 'Doanh số giảm nhẹ 2%.' },
      { en: 'decline', ipa: '/dɪˈklaɪn/', vi: 'suy giảm (mức vừa)', pos: 'v', ex: 'Attendance declined over five years.', exVi: 'Số người dự giảm trong năm năm.' },
      { en: 'plummet', ipa: '/ˈplʌmɪt/', vi: 'lao dốc (rất mạnh)', pos: 'v', ex: 'Share prices plummeted by 40%.', exVi: 'Giá cổ phiếu lao dốc 40%.' },
      { en: 'relevant', ipa: '/ˈreləvənt/', vi: 'có liên quan (mức nhẹ)', pos: 'adj', ex: 'This factor is relevant but minor.', exVi: 'Yếu tố này có liên quan nhưng nhỏ.' },
      { en: 'significant', ipa: '/sɪɡˈnɪfɪkənt/', vi: 'đáng kể', pos: 'adj', ex: 'There was a significant improvement.', exVi: 'Có một cải thiện đáng kể.' },
      { en: 'crucial', ipa: '/ˈkruːʃl/', vi: 'then chốt', pos: 'adj', ex: 'Timing is crucial here.', exVi: 'Thời điểm ở đây là then chốt.' },
      { en: 'indispensable', ipa: '/ˌɪndɪˈspensəbl/', vi: 'không thể thiếu', pos: 'adj', ex: 'Clean water is indispensable.', exVi: 'Nước sạch là không thể thiếu.' },
      { en: 'problematic', ipa: '/ˌprɒbləˈmætɪk/', vi: 'có vấn đề', pos: 'adj', ex: 'The methodology is problematic.', exVi: 'Phương pháp có vấn đề.' },
      { en: 'detrimental', ipa: '/ˌdetrɪˈmentl/', vi: 'gây hại', pos: 'adj', ex: 'Long hours are detrimental to health.', exVi: 'Làm việc nhiều giờ gây hại cho sức khoẻ.' },
      { en: 'catastrophic', ipa: '/ˌkætəˈstrɒfɪk/', vi: 'thảm hoạ', pos: 'adj', ex: 'The flood had catastrophic consequences.', exVi: 'Trận lụt gây hậu quả thảm hoạ.' },
    ],
  },
  {
    id: 's4-concise',
    title: 'Thay lối viết vòng vo',
    icon: '✂️',
    why: 'Band 7 gọn mà đủ. Chỗ tiết kiệm được dùng để thêm ví dụ — thứ thật sự ăn điểm.',
    words: [
      { en: 'because (thay "due to the fact that")', ipa: '/bɪˈkɒz/', vi: 'vì', pos: 'conj', ex: 'Because many people work remotely, …', exVi: 'Vì nhiều người làm việc từ xa,…' },
      { en: 'although (thay "in spite of the fact that")', ipa: '/ɔːlˈðəʊ/', vi: 'mặc dù', pos: 'conj', ex: 'Although costs rose, demand held.', exVi: 'Mặc dù chi phí tăng, nhu cầu vẫn giữ.' },
      { en: 'currently (thay "at this point in time")', ipa: '/ˈkʌrəntli/', vi: 'hiện nay', pos: 'adv', ex: 'Currently, three schemes are running.', exVi: 'Hiện nay có ba chương trình đang chạy.' },
      { en: 'can (thay "has the ability to")', ipa: '/kæn/', vi: 'có thể', pos: 'modal', ex: 'Many people can work remotely.', exVi: 'Nhiều người có thể làm việc từ xa.' },
      { en: 'if (thay "in the event that")', ipa: '/ɪf/', vi: 'nếu', pos: 'conj', ex: 'If funding stops, the scheme ends.', exVi: 'Nếu ngừng cấp vốn, chương trình kết thúc.' },
      { en: 'draw a conclusion', ipa: '/drɔː ə kənˈkluːʒn/', vi: 'rút ra kết luận', pos: 'phr', ex: 'We can draw the conclusion that…', exVi: 'Ta có thể rút ra kết luận rằng…' },
      { en: 'pose a question', ipa: '/pəʊz ə ˈkwestʃən/', vi: 'đặt ra câu hỏi', pos: 'phr', ex: 'This poses an obvious question.', exVi: 'Điều này đặt ra một câu hỏi hiển nhiên.' },
      { en: 'meet a need', ipa: '/miːt ə niːd/', vi: 'đáp ứng nhu cầu', pos: 'phr', ex: 'The service meets a real need.', exVi: 'Dịch vụ đáp ứng một nhu cầu thật.' },
      { en: 'widely held', ipa: '/ˈwaɪdli held/', vi: 'được nhiều người tin', pos: 'adj', ex: 'It is a widely held belief.', exVi: 'Đó là một niềm tin phổ biến.' },
      { en: 'heavily dependent on', ipa: '/ˈhevɪli dɪˈpendənt ɒn/', vi: 'phụ thuộc nặng vào', pos: 'phr', ex: 'The town is heavily dependent on tourism.', exVi: 'Thị trấn phụ thuộc nặng vào du lịch.' },
    ],
  },
];

/* ══════════════════ BÀI TẬP ══════════════════ */

export const EXERCISES4: ExerciseSet[] = [
  { lessonId: 'e1', items: [
    { kind: 'choice', q: 'Mô tả band 7 dùng cụm nào?', options: ['produces frequent error-free sentences', 'uses complex vocabulary', 'writes long essays', 'has a wide range of ideas'], answer: 'produces frequent error-free sentences', why: 'Giám khảo đếm số CÂU KHÔNG LỖI. Câu hay mà có một lỗi mạo từ vẫn là câu có lỗi.' },
    { kind: 'fix', q: 'The government should invest in the education.', hint: 'Một mạo từ thừa.', answer: 'The government should invest in education.', why: 'Danh từ trừu tượng nói chung KHÔNG có "the".' },
    { kind: 'choice', q: 'Ở band 6.5, việc nào giúp lên 7.0 nhiều hơn?', options: ['Tăng tỷ lệ câu không lỗi', 'Học thêm cấu trúc phức tạp', 'Viết dài hơn', 'Dùng nhiều từ hiếm hơn'], answer: 'Tăng tỷ lệ câu không lỗi', why: 'Thêm cấu trúc mới ở chặng này thường làm TĂNG số lỗi.' },
    { kind: 'choice', q: 'Mục tiêu tỷ lệ câu sạch của chặng 4?', options: ['Trên 70%', 'Trên 30%', '100%', 'Không có mục tiêu'], answer: 'Trên 70%', why: 'Đây là phép kiểm quan trọng nhất của chặng 4.' },
    { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Các chính phủ nên đầu tư vào giáo dục.', answer: 'Governments should invest in education.', why: 'Số nhiều nói chung, không mạo từ ở cả hai danh từ.' },
  ] },
  { lessonId: 'e2', items: [
    { kind: 'fix', q: 'The government should invest in the education to solve the poverty.', hint: 'Ba mạo từ thừa.', answer: 'Governments should invest in education to reduce poverty.', why: 'education và poverty là danh từ trừu tượng nói chung — không "the".' },
    { kind: 'gap', q: 'Điền "the" hoặc bỏ trống: ____________ education system in Vietnam is changing.', answer: 'The', why: 'Đã xác định (hệ thống cụ thể của Việt Nam) → có "the".' },
    { kind: 'choice', q: 'Câu nào ĐÚNG?', options: ['Research shows that…', 'The research shows that… (nói chung)', 'A research shows that…', 'Researches show that…'], answer: 'Research shows that…', why: 'Nói chung, không đếm được → không mạo từ, không -s, động từ số ít.' },
    { kind: 'fix', q: 'The technology has changed the way we work.', hint: 'Một mạo từ thừa.', answer: 'Technology has changed the way we work.', why: '"technology" nói chung không có "the". Nhưng "the way" thì đúng vì đã xác định.' },
    { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Nghiên cứu gần đây cho thấy mối liên hệ yếu.', answer: 'Recent research suggests a weak link.', alt: ['Recent research shows a weak link.'], why: 'research không đếm được: không "a", không -s, động từ số ít.' },
  ] },
  { lessonId: 'e3', items: [
    { kind: 'fix', q: 'Recent researches show that these evidences are strong.', hint: 'Hai danh từ không đếm được bị thêm -s.', answer: 'Recent research shows that this evidence is strong.', why: 'research và evidence không đếm được → không -s, động từ số ít, "this" chứ không "these".' },
    { kind: 'fix', q: 'Car causes pollution in big city.', hint: 'Nói chung thì dùng số nhiều.', answer: 'Cars cause pollution in big cities.', why: 'Danh từ đếm được nói chung phải ở số nhiều.' },
    { kind: 'choice', q: 'Từ nào ĐẾM ĐƯỢC?', options: ['machine', 'machinery', 'equipment', 'legislation'], answer: 'machine', why: 'machinery, equipment, legislation đều không đếm được. machine thì đếm được.' },
    { kind: 'gap', q: 'Điền: The government has made significant ____________ in this area. (tiến bộ)', answer: 'progress', why: 'progress không đếm được — không "progresses", không "a progress".' },
    { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Bằng chứng còn hạn chế.', answer: 'The evidence is limited.', why: 'evidence không đếm được → động từ số ít "is".' },
  ] },
  { lessonId: 'e4', items: [
    { kind: 'fix', q: 'The report discusses about the increase of crime and emphasises on prevention.', hint: 'Hai giới từ thừa, một giới từ sai.', answer: 'The report discusses the increase in crime and emphasises prevention.', why: '"discuss" và "emphasise" KHÔNG có giới từ; "increase" đi với "in".' },
    { kind: 'gap', q: 'Điền giới từ: There has been a sharp increase ____________ unemployment.', answer: 'in', why: 'an increase IN — không phải "of".' },
    { kind: 'gap', q: 'Điền giới từ: The team carried out research ____________ water quality.', answer: 'into', alt: ['on'], why: 'research INTO / ON — không phải "about".' },
    { kind: 'fix', q: 'The committee comprises of five members.', hint: 'Một giới từ thừa.', answer: 'The committee comprises five members.', alt: ['The committee consists of five members.'], why: '"comprise" KHÔNG có "of". "consist" thì có.' },
    { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Con số của Pháp thấp hơn nhiều.', answer: 'The figure for France was much lower.', why: 'figure FOR — không phải "of".' },
  ] },
  { lessonId: 'e5', items: [
    { kind: 'fix', q: 'The number of students who live in halls have risen.', hint: 'Chủ ngữ thật là gì?', answer: 'The number of students who live in halls has risen.', why: 'Chủ ngữ là "The number" (số ít), không phải "students". Mệnh đề chen giữa đánh lừa.' },
    { kind: 'choice', q: 'Bảng soát band 7 gồm mấy lượt?', options: ['6 lượt, mỗi lượt một loại lỗi', '1 lượt tìm mọi lỗi', '3 lượt', '10 lượt'], answer: '6 lượt, mỗi lượt một loại lỗi', why: 'Mắt không bắt được nhiều loại lỗi cùng lúc. Ở band 6.5 lỗi còn lại đều là lỗi kín.' },
    { kind: 'fix', q: 'In 2010 the figure rises to 30% and then falls.', hint: 'Sai thì cho số liệu quá khứ.', answer: 'In 2010 the figure rose to 30% and then fell.', why: 'Số liệu có mốc quá khứ → dùng thì quá khứ, và nhất quán cả câu.' },
    { kind: 'choice', q: 'Lượt soát nào hay bắt được lỗi khi chủ ngữ dài?', options: ['Hợp chủ–vị', 'Mạo từ', 'Giới từ', 'Số nhiều'], answer: 'Hợp chủ–vị', why: 'Mệnh đề chen giữa chủ ngữ và động từ làm ta chia theo nhầm danh từ.' },
    { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Số lượng sinh viên đã tăng.', answer: 'The number of students has risen.', why: 'Chủ ngữ "The number" số ít → "has".' },
  ] },
  { lessonId: 'pr1', items: [
    { kind: 'fix', q: 'Sales plummeted by 2% last year.', hint: 'Sai sắc thái mức độ.', answer: 'Sales dipped slightly, by 2%, last year.', alt: ['Sales fell slightly, by 2%, last year.'], why: '"plummet" là rơi thẳng đứng. Dùng cho 2% là sai nặng về sắc thái.' },
    { kind: 'choice', q: 'Xếp từ nhẹ tới mạnh: decline · dip · plummet', options: ['dip → decline → plummet', 'plummet → decline → dip', 'decline → dip → plummet', 'dip → plummet → decline'], answer: 'dip → decline → plummet', why: 'Học theo THANG, không học từ lẻ.' },
    { kind: 'choice', q: 'Mức 40% giảm nên dùng từ nào?', options: ['plummeted', 'dipped', 'edged down', 'levelled off'], answer: 'plummeted', why: '40% là mức rất mạnh — đây đúng là chỗ dùng "plummet".' },
    { kind: 'choice', q: 'Vì sao dùng từ hiếm sai ngữ cảnh bị trừ nặng?', options: ['Giám khảo đọc là bạn không nắm nghĩa thật của từ', 'Vì từ hiếm khó đọc', 'Vì bài dài hơn', 'Không bị trừ'], answer: 'Giám khảo đọc là bạn không nắm nghĩa thật của từ', why: 'Ở band 7, dùng từ thường mà đúng hơn hẳn dùng từ hiếm mà sai.' },
    { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Doanh số giảm nhẹ 2%.', answer: 'Sales dipped slightly by 2%.', alt: ['Sales fell slightly by 2%.'], why: 'Chọn đúng mức độ quan trọng hơn chọn từ hiếm.' },
  ] },
  { lessonId: 'pr2', items: [
    { kind: 'fix', q: 'Technology always makes people lazy and destroys communication.', hint: 'Quá tuyệt đối.', answer: 'Technology may well reduce certain kinds of effort, and in some contexts it appears to weaken face-to-face communication.', why: 'Câu tuyệt đối dễ bị bác bằng một phản ví dụ, nên YẾU về lập luận.' },
    { kind: 'gap', q: 'Điền cụm giảm nhẹ: Larger cities ____________ ____________ have better transport. (có xu hướng)', answer: 'tend to', why: 'tend to — cụm giảm nhẹ dùng nhiều nhất trong văn học thuật.' },
    { kind: 'choice', q: 'Nói giảm nhẹ có phải là nói yếu không?', options: ['Không — nó là nói CHÍNH XÁC về mức độ chắc chắn', 'Có, nó làm lập luận yếu đi', 'Chỉ dùng khi không chắc', 'Chỉ dùng ở Speaking'], answer: 'Không — nó là nói CHÍNH XÁC về mức độ chắc chắn', why: 'Và câu giảm nhẹ khó bác hơn nên thực ra MẠNH hơn về lập luận.' },
    { kind: 'translate', q: 'Dịch, có GIẢM NHẸ:', hint: 'Đây rất có thể là nguyên nhân chính.', answer: 'This may well be the main cause.', why: '"may well" = rất có thể — mạnh hơn "may" nhưng chưa khẳng định.' },
    { kind: 'translate', q: 'Dịch, có GIẢM NHẸ:', hint: 'Nói chung, xu hướng là đi lên, trừ vài ngoại lệ.', answer: 'Broadly speaking, the trend is upward, with some exceptions.', why: 'Hai lớp giảm nhẹ trong một câu — vừa đủ, không thừa.' },
  ] },
  { lessonId: 'pr3', items: [
    { kind: 'fix', q: 'Due to the fact that there are a large number of people who have the ability to work remotely at this point in time, offices are emptier.', hint: 'Ba lối vòng vo.', answer: 'Because many people can now work remotely, offices are emptier.', why: '24 từ xuống 7 từ, nghĩa không đổi. Chỗ tiết kiệm dùng để thêm ví dụ.' },
    { kind: 'gap', q: 'Thay "due to the fact that" bằng một từ: ____________', answer: 'because', why: 'Bốn từ xuống một từ.' },
    { kind: 'gap', q: 'Thay "has the ability to" bằng một từ: ____________', answer: 'can', why: 'Ba từ xuống một từ.' },
    { kind: 'choice', q: 'Vì sao band 7 chuộng viết gọn?', options: ['Gọn mà đủ, và chỗ tiết kiệm dùng để thêm ví dụ', 'Vì đề giới hạn số từ', 'Vì viết nhanh hơn', 'Vì dễ soát hơn'], answer: 'Gọn mà đủ, và chỗ tiết kiệm dùng để thêm ví dụ', why: 'Ví dụ cụ thể mới là thứ ăn điểm Task Response.' },
    { kind: 'translate', q: 'Dịch cho GỌN:', hint: 'Mặc dù chi phí tăng, nhu cầu vẫn giữ nguyên.', answer: 'Although costs rose, demand held steady.', alt: ['Although costs rose, demand remained steady.'], why: 'Dùng "Although" thay cho "in spite of the fact that".' },
  ] },
  { lessonId: 'pr4', items: [
    { kind: 'choice', q: 'Ở band 7, lạm dụng từ nối bị trừ vì sao?', options: ['Bị coi là "mechanical use of cohesive devices"', 'Vì bài dài hơn', 'Vì khó đọc', 'Không bị trừ'], answer: 'Bị coi là "mechanical use of cohesive devices"', why: 'Mở đầu mọi câu bằng Moreover/Furthermore là dấu hiệu bài học thuộc.' },
    { kind: 'fix', q: 'Firstly, costs are high. Moreover, staff are unhappy. Furthermore, quality has fallen. In addition, customers complain.', hint: 'Bốn câu bốn nhãn dán.', answer: 'Costs are high and staff are unhappy. Quality has fallen too, and customers have begun to complain.', why: 'Nối ý bằng chính khái niệm và bằng "and/too", không phải bằng nhãn.' },
    { kind: 'choice', q: 'Khi nào NÊN dùng từ nối?', options: ['Khi quan hệ giữa hai ý KHÔNG hiển nhiên', 'Ở đầu mỗi câu', 'Ở mỗi đoạn một lần', 'Càng nhiều càng tốt'], answer: 'Khi quan hệ giữa hai ý KHÔNG hiển nhiên', why: 'Từ nối là biển chỉ đường — cắm biển ở mỗi bước chân làm người đọc mệt.' },
    { kind: 'choice', q: 'Văn tự nhiên nối ý bằng gì?', options: ['Lặp lại khái niệm và dùng đại từ', 'Từ nối ở mọi câu', 'Dấu chấm phẩy', 'Câu hỏi tu từ'], answer: 'Lặp lại khái niệm và dùng đại từ', why: 'Đây là cách người bản xứ nối ý trong văn học thuật thật.' },
    { kind: 'translate', q: 'Dịch, KHÔNG dùng từ nối nào:', hint: 'Chi phí rõ nhất là tiền bạc. Chi phí thứ hai, ít thấy hơn, là xã hội.', answer: 'The most obvious cost is financial. A second, less visible cost is social.', why: 'Nối bằng chính khái niệm "cost" — tự nhiên hơn hẳn "Moreover".' },
  ] },
  { lessonId: 'pr5', items: [
    { kind: 'fix', q: 'From this data we can make a conclusion that the policy has a wide support.', hint: 'Ba lỗi kết hợp tinh.', answer: 'From these data we can draw the conclusion that the policy has widespread support.', why: '"data" số nhiều trong văn học thuật; "draw" chứ không "make" kết luận; "widespread support" chứ không "a wide support".' },
    { kind: 'gap', q: 'Điền động từ: This ____________ an obvious question. (đặt ra)', answer: 'poses', alt: ['raises'], why: 'pose / raise a question — không dùng "give".' },
    { kind: 'gap', q: 'Điền: The service ____________ a real need. (đáp ứng)', answer: 'meets', why: 'meet a need — không dùng "solve a need".' },
    { kind: 'choice', q: 'Cụm nào TỰ NHIÊN?', options: ['a widely held belief', 'a wide belief', 'a broad belief', 'a large belief'], answer: 'a widely held belief', why: 'Cặp cố định — ba cách kia đều hiểu được nhưng không tự nhiên.' },
    { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Thị trấn phụ thuộc nặng vào du lịch.', answer: 'The town is heavily dependent on tourism.', why: '"heavily dependent" — trạng từ đi với tính từ cụ thể, không đổi được sang "strongly".' },
  ] },
  { lessonId: 'n1', items: [
    { kind: 'choice', q: 'Tiếng Anh nhấn vào loại từ nào?', options: ['Từ mang THÔNG TIN MỚI', 'Từ dài nhất', 'Động từ', 'Từ đầu câu'], answer: 'Từ mang THÔNG TIN MỚI', why: 'Và hạ thấp phần đã biết. Đó là cách người nghe biết đâu là ý chính.' },
    { kind: 'choice', q: 'Nói đều một nhịp bị chấm là gì?', options: ['monotonous — trừ điểm Pronunciation', 'fluent', 'clear', 'formal'], answer: 'monotonous — trừ điểm Pronunciation', why: 'Nói trôi mà đều đều vẫn bị chặn ở band 6.5.' },
    { kind: 'choice', q: 'Giọng LÊN ở cuối câu báo hiệu gì?', options: ['Câu chưa xong, còn nói tiếp', 'Câu đã hết ý', 'Đang hỏi lại', 'Đang tức giận'], answer: 'Câu chưa xong, còn nói tiếp', why: 'Xuống giọng báo hiệu đã hết ý — tín hiệu quan trọng cho người nghe.' },
    { kind: 'choice', q: '"I did not say she STOLE the money" (nhấn STOLE) nghĩa là gì?', options: ['Tôi nói cô ấy làm gì đó khác với tiền, không phải trộm', 'Người khác nói điều đó', 'Cô ấy không lấy tiền', 'Không phải tiền'], answer: 'Tôi nói cô ấy làm gì đó khác với tiền, không phải trộm', why: 'Cùng một câu, năm cách nhấn cho năm nghĩa khác nhau.' },
    { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Tôi thu âm rồi nghe lại giọng của mình.', answer: 'I record myself and listen back.', why: 'Cách duy nhất để biết mình có ngữ điệu hay không.' },
  ] },
  { lessonId: 'n2', items: [
    { kind: 'choice', q: '"an apple" nối âm thành gì?', options: ['/əˈnæpl/', '/æn ˈæpl/', '/ə ˈæpl/', '/ænəpl/'], answer: '/əˈnæpl/', why: 'Phụ âm cuối nối với nguyên âm đầu — hiện tượng gây khó nghe nhất.' },
    { kind: 'choice', q: 'Từ "of" trong câu nói nhanh đọc thế nào?', options: ['/əv/ — âm yếu', '/ɒf/ rõ ràng', '/oʊv/', 'Bị bỏ hẳn'], answer: '/əv/ — âm yếu', why: 'Từ chức năng (of, to, and, a) luôn bị đọc nhẹ trong câu nói tự nhiên.' },
    { kind: 'choice', q: 'Vì sao đọc rời từng từ là không tốt?', options: ['Nghe như đọc bảng chữ, và khiến bạn không nhận ra chúng khi người khác nói nhanh', 'Vì chậm hơn', 'Vì sai ngữ pháp', 'Không có vấn đề gì'], answer: 'Nghe như đọc bảng chữ, và khiến bạn không nhận ra chúng khi người khác nói nhanh', why: 'Nói và nghe liên quan chặt: không phát ra được thì thường không nghe ra.' },
    { kind: 'gap', q: '"next day" nói nhanh mất âm nào? ____________', answer: 't', alt: ['/t/', 'âm t'], why: 'next day → /neksdeɪ/. Hiện tượng nuốt âm giữa hai phụ âm.' },
    { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Nhặt nó lên.', answer: 'Pick it up.', why: 'Nói tự nhiên là /pɪkɪtʌp/ — ba từ nối thành một khối.' },
  ] },
  { lessonId: 'n3', items: [
    { kind: 'choice', q: 'Nói quá trang trọng ở Speaking bị sao?', options: ['Bị chấm là không tự nhiên', 'Được điểm cao', 'Không ảnh hưởng', 'Chỉ ảnh hưởng ở Part 1'], answer: 'Bị chấm là không tự nhiên', why: 'Speaking và Writing có tiêu chuẩn khác nhau về mức trang trọng.' },
    { kind: 'fix', q: 'It is incumbent upon governments to ameliorate this situation.', hint: 'Quá trang trọng cho văn nói.', answer: 'I think governments really need to do something about this.', alt: ['Governments should probably do something about this.'], why: 'Nói như một người có học đang trò chuyện — ý sâu, từ vừa phải.' },
    { kind: 'choice', q: 'Cụm nào DÙNG ĐƯỢC ở Part 3?', options: ['the thing is… / to be fair… / I mean…', 'Chỉ dùng từ hàn lâm', 'Không dùng cụm nói chuyện nào', 'Chỉ dùng câu bị động'], answer: 'the thing is… / to be fair… / I mean…', why: 'Người bản xứ có học vẫn dùng cụm nói chuyện khi bàn chuyện nghiêm túc.' },
    { kind: 'choice', q: 'Câu nào vừa tự nhiên vừa học thuật?', options: ['I think there is a real tension between those two goals.', 'It is incumbent upon us to ameliorate…', 'Yeah it is bad I guess.', 'This is very very important.'], answer: 'I think there is a real tension between those two goals.', why: 'Ý sâu (nêu được mâu thuẫn) mà từ ngữ vừa phải.' },
    { kind: 'translate', q: 'Dịch tự nhiên, KHÔNG hàn lâm:', hint: 'Nói cho công bằng thì cả hai bên đều có lý.', answer: 'To be fair, both sides have a point.', why: '"To be fair" và "have a point" — tự nhiên mà vẫn nghiêm túc.' },
  ] },
  { lessonId: 'n4', items: [
    { kind: 'choice', q: 'Phân bổ 40 phút Task 2 ở band 7?', options: ['5 dàn ý — 30 viết — 5 soát', '40 viết liền', '10 dàn ý — 30 viết', '35 viết — 5 dàn ý'], answer: '5 dàn ý — 30 viết — 5 soát', why: 'Mốc chặng 4: xong trong 38 phút mà vẫn còn thời gian soát.' },
    { kind: 'choice', q: 'Dàn ý ĐỦ phải có gì?', options: ['Câu chủ đề + ví dụ CỤ THỂ đã nghĩ sẵn cho mỗi đoạn', 'Chỉ tên chủ đề mỗi đoạn', 'Cả câu hoàn chỉnh', 'Không cần dàn ý'], answer: 'Câu chủ đề + ví dụ CỤ THỂ đã nghĩ sẵn cho mỗi đoạn', why: 'Vừa viết vừa nghĩ ý là lý do chính khiến người ta hết giờ.' },
    { kind: 'choice', q: 'Ở band 6.5, 5 phút soát đáng giá hơn hay một ý thêm vào đáng giá hơn?', options: ['5 phút soát', 'Một ý thêm vào', 'Bằng nhau', 'Tuỳ đề'], answer: '5 phút soát', why: 'Lỗi vặt mới là thứ đang chặn bạn ở 6.5, không phải thiếu ý.' },
    { kind: 'choice', q: 'Nên dừng viết ở phút thứ mấy?', options: ['35', '40', '38', '30'], answer: '35', why: 'Dừng ở 35 để có trọn 5 phút soát theo bảng 6 lượt.' },
    { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Tôi dừng viết ở phút thứ ba mươi lăm để soát bài.', answer: 'I stop writing at the thirty-fifth minute so that I can check my work.', alt: ['I stop writing after thirty-five minutes to check my work.'], why: 'Mệnh đề mục đích "so that" — dùng đúng là tự nhiên.' },
  ] },
  { lessonId: 'n5', items: [
    { kind: 'choice', q: 'Phép kiểm quan trọng nhất của chặng 4?', options: ['Tỷ lệ câu KHÔNG LỖI trên 70%', 'Viết được 400 từ', 'Thuộc 6.000 từ', 'Nói được 5 phút'], answer: 'Tỷ lệ câu KHÔNG LỖI trên 70%', why: 'Mô tả band 7 dùng đúng cụm "frequent error-free sentences" — thứ đo được.' },
    { kind: 'choice', q: 'Mốc Reading và Listening của chặng 4?', options: ['35+/40', '30+/40', '40/40', '25+/40'], answer: '35+/40', why: '30+ là mốc chặng 3. Chặng 4 là 35+ và phải ổn định.' },
    { kind: 'choice', q: 'Mốc từ vựng của chặng 4?', options: ['~6.000 từ, dùng được mà không gượng', '~4.000 từ', '~2.500 từ', '~10.000 từ'], answer: '~6.000 từ, dùng được mà không gượng', why: 'Chú ý vế sau: "dùng được mà không gượng" quan trọng hơn con số.' },
    { kind: 'choice', q: 'Đo trình độ bằng cảm giác có vấn đề gì?', options: ['Không đo được thứ giám khảo thật sự nhìn: số câu không lỗi', 'Mất thời gian', 'Quá khắt khe', 'Không có vấn đề'], answer: 'Không đo được thứ giám khảo thật sự nhìn: số câu không lỗi', why: 'Cảm giác "viết hay" và tỷ lệ câu sạch là hai chuyện khác nhau.' },
    { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Bảy mươi phần trăm số câu của tôi không có lỗi.', answer: 'Seventy per cent of my sentences are error-free.', why: 'Đây là con số bạn cần đạt để kết thúc lộ trình.' },
  ] },
];

/* ══════════════════ ĐỌC ══════════════════ */

export const READINGS4: ReadingPassage[] = [
  {
    id: 's4r1',
    title: 'The Limits of Measuring What Matters',
    titleVi: 'Giới hạn của việc đo lường',
    level: 'C1 — độ khó passage 3 của đề thật',
    words: 359,
    minutes: 13,
    paragraphs: [
      { label: 'A', text: 'Organisations measure what they can, and then behave as though what they have measured is what matters. The distinction sounds pedantic until one considers the consequences, which are visible in almost every institution that has adopted performance targets over the past forty years.' },
      { label: 'B', text: 'The mechanism is well documented. Once a measure becomes a target, the people being measured optimise for the measure rather than for the underlying purpose. Hospitals judged on waiting times find ways to reclassify waiting. Schools judged on pass rates concentrate resources on students near the borderline, since moving a candidate from a near-pass to a pass improves the statistic while helping a struggling student does not.' },
      { label: 'C', text: 'It would be convenient to conclude that measurement is therefore harmful, but the evidence does not support so simple a verdict. Institutions that measure nothing are not thereby fairer; they are merely opaque, and opacity tends to favour those already advantaged. The problem is not measurement itself but the assumption that a number can substitute for judgement.' },
      { label: 'D', text: 'Professor Ines Vargas argues that the damage occurs at a specific point: when a measure is used to allocate rewards and punishments rather than to prompt enquiry. A waiting-time figure that leads a manager to ask why the queue has grown is useful. The same figure attached to a bonus becomes something to be managed rather than understood.' },
      { label: 'E', text: 'Her critics respond that this distinction, while elegant, is difficult to maintain in practice. Dr Peter Lund notes that any published measure acquires consequences whether or not anyone intends them, because reputations respond to numbers. On this view, the choice is not between measures with and without consequences, but between different kinds of distortion.' },
      { label: 'F', text: 'What both sides accept is that the qualities institutions most want tend to be the hardest to count. The teacher who changes how a student thinks, the doctor who recognises what a patient has not said — these leave no trace in any dataset, and a system that rewards only the countable will, over time, select against them. That is not an argument for abandoning measurement. It is an argument for holding its results more lightly than we usually do.' },
    ],
    glossary: [
      { en: 'pedantic', ipa: '/pɪˈdæntɪk/', vi: 'câu nệ chữ nghĩa' },
      { en: 'optimise for', ipa: '/ˈɒptɪmaɪz fə/', vi: 'tối ưu theo' },
      { en: 'borderline', ipa: '/ˈbɔːdəlaɪn/', vi: 'ngưỡng, ranh giới' },
      { en: 'verdict', ipa: '/ˈvɜːdɪkt/', vi: 'phán quyết, kết luận' },
      { en: 'opaque', ipa: '/əʊˈpeɪk/', vi: 'mờ đục, không minh bạch' },
      { en: 'allocate', ipa: '/ˈæləkeɪt/', vi: 'phân bổ' },
      { en: 'prompt enquiry', ipa: '/prɒmpt ɪnˈkwaɪəri/', vi: 'thúc đẩy tìm hiểu' },
      { en: 'distortion', ipa: '/dɪˈstɔːʃn/', vi: 'sự méo mó' },
    ],
    questions: [
      { kind: 'MATCH', q: 'Which person distinguishes between measures used for enquiry and measures used for reward?', options: ['Professor Ines Vargas', 'Dr Peter Lund', 'The writer', 'Neither'], answer: 'Professor Ines Vargas', why: 'Đoạn D: Vargas cho rằng thiệt hại xảy ra khi thước đo dùng để phân bổ thưởng phạt thay vì để thúc đẩy tìm hiểu.', whyNot: 'Lund là người PHẢN BÁC sự phân biệt đó ở đoạn E.' },
      { kind: 'MATCH', q: 'Which person argues that any published measure has consequences regardless of intention?', options: ['Dr Peter Lund', 'Professor Ines Vargas', 'The writer', 'Neither'], answer: 'Dr Peter Lund', why: 'Đoạn E: Lund lưu ý mọi thước đo được công bố đều mang hệ quả dù có ai định vậy hay không, vì danh tiếng phản ứng theo con số.', whyNot: 'Dạng Matching Features ở độ khó này: hai người có quan điểm GẦN nhau nên phải đọc kỹ chi tiết khác biệt.' },
      { kind: 'YNNG', q: 'The writer believes that institutions should stop measuring performance.', options: ['YES', 'NO', 'NOT GIVEN'], answer: 'NO', why: 'Đoạn C bác bỏ kết luận đơn giản đó, và câu cuối đoạn F nói thẳng: "That is not an argument for abandoning measurement."', whyNot: 'Bẫy lớn nhất của bài: đọc lướt đoạn B rất dễ tưởng tác giả phản đối đo lường.' },
      { kind: 'YNNG', q: 'The writer thinks institutions that measure nothing are fairer.', options: ['YES', 'NO', 'NOT GIVEN'], answer: 'NO', why: 'Đoạn C: các tổ chức không đo gì "are not thereby fairer; they are merely opaque", và sự mờ đục có lợi cho người vốn đã có lợi thế.', whyNot: 'Tác giả nêu quan điểm rõ ràng và ngược với câu hỏi.' },
      { kind: 'MCQ', q: 'Why do schools judged on pass rates focus on borderline students?', options: ['Because those students work hardest', 'Because moving them across the line improves the statistic', 'Because teachers prefer them', 'Because they are the majority'], answer: 'Because moving them across the line improves the statistic', why: 'Đoạn B nêu thẳng cơ chế: đẩy một thí sinh từ suýt đỗ sang đỗ làm đẹp số liệu, còn giúp học sinh yếu thì không.', whyNot: 'A, C, D không có trong bài — bẫy "hợp lý ngoài đời".' },
      { kind: 'GAP', q: 'Once a measure becomes a target, people optimise for the measure rather than the underlying ____________.', answer: 'purpose', why: 'Đoạn B: "optimise for the measure rather than for the underlying purpose".', whyNot: 'Chép nguyên văn.' },
      { kind: 'GAP', q: 'The writer says the problem is the assumption that a number can substitute for ____________.', answer: 'judgement', why: 'Đoạn C câu cuối: "the assumption that a number can substitute for judgement".', whyNot: 'Chính tả Anh-Anh "judgement"; bản Anh-Mỹ "judgment" cũng gặp nhưng bài dùng bản Anh-Anh.' },
      { kind: 'MCQ', q: 'According to paragraph F, what do both sides agree on?', options: ['Measurement should be abandoned', 'The qualities institutions most want are the hardest to count', 'Rewards should be increased', 'Datasets are always accurate'], answer: 'The qualities institutions most want are the hardest to count', why: 'Đoạn F mở bằng "What both sides accept is that…" rồi nêu đúng ý đó.', whyNot: 'Cụm "What both sides accept" là biển chỉ đường rất rõ — đề hay hỏi vào đó.' },
      { kind: 'MCQ', q: 'What does the writer conclude about the results of measurement?', options: ['They should be ignored', 'They should be held more lightly than usual', 'They should determine all decisions', 'They should be kept secret'], answer: 'They should be held more lightly than usual', why: 'Câu cuối bài: "It is an argument for holding its results more lightly than we usually do."', whyNot: 'A quá mạnh — tác giả đã bác việc bỏ hẳn đo lường ở chính câu trước đó.' },
      { kind: 'TFNG', q: 'Performance targets have been used in institutions for around forty years.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'TRUE', why: 'Đoạn A: hệ quả thấy được ở "almost every institution that has adopted performance targets over the past forty years".', whyNot: 'Thông tin trực tiếp nhưng nằm ở mệnh đề phụ cuối đoạn — dễ đọc lướt qua.' },
    ],
    strategy: [
      'Ở độ khó passage 3, câu YNNG là chỗ mất điểm nhiều nhất. Đọc đoạn C và đoạn cuối TRƯỚC khi trả lời câu về quan điểm — tác giả hay bác bỏ ở đó chính điều mà đoạn đầu gợi ra.',
      'Hai chuyên gia có quan điểm GẦN nhau: một người phân biệt hai cách dùng thước đo, người kia bảo phân biệt đó khó giữ. Phải đọc kỹ chi tiết khác biệt, không chỉ nhớ "ai ủng hộ ai phản đối".',
      'Cụm báo hiệu ở độ khó này rất giá trị: "What both sides accept is…", "It would be convenient to conclude… but". Chúng dẫn thẳng tới đáp án.',
      'Đừng để đoạn B dẫn dắt. Bài nêu vấn đề ở B rồi BÁC BỎ kết luận đơn giản ở C — đây là cấu trúc lập luận rất hay gặp ở passage 3.',
    ],
    translation:
      'A. Các tổ chức đo cái họ đo được, rồi hành xử như thể cái họ đã đo chính là cái quan trọng. Sự phân biệt này nghe có vẻ câu nệ cho tới khi ta xét tới hệ quả của nó — thứ nhìn thấy được ở gần như mọi định chế đã áp dụng chỉ tiêu hiệu suất trong bốn mươi năm qua.\n\n'
      + 'B. Cơ chế đã được ghi nhận rõ. Một khi thước đo trở thành chỉ tiêu, người bị đo sẽ tối ưu theo THƯỚC ĐO chứ không theo mục đích nằm bên dưới. Bệnh viện bị đánh giá theo thời gian chờ sẽ tìm cách phân loại lại việc chờ. Trường học bị đánh giá theo tỷ lệ đỗ sẽ dồn nguồn lực vào học sinh sát ngưỡng, vì đẩy một thí sinh từ suýt đỗ sang đỗ làm đẹp số liệu, còn giúp một học sinh đang chật vật thì không.\n\n'
      + 'C. Sẽ tiện lợi nếu kết luận rằng đo lường là có hại, nhưng bằng chứng không ủng hộ một phán quyết đơn giản đến thế. Các tổ chức không đo gì cả không vì thế mà công bằng hơn; chúng chỉ mờ đục hơn, và sự mờ đục có xu hướng có lợi cho những người vốn đã có lợi thế. Vấn đề không nằm ở bản thân việc đo lường mà ở giả định rằng một con số có thể thay thế cho sự phán đoán.\n\n'
      + 'D. Giáo sư Ines Vargas cho rằng thiệt hại xảy ra ở một điểm cụ thể: khi thước đo được dùng để phân bổ thưởng phạt thay vì để thúc đẩy tìm hiểu. Một con số về thời gian chờ khiến người quản lý hỏi vì sao hàng đợi dài ra là hữu ích. Cũng con số đó gắn với tiền thưởng thì trở thành thứ để quản lý chứ không phải để hiểu.\n\n'
      + 'E. Những người phản biện bà đáp lại rằng sự phân biệt ấy, dù thanh nhã, rất khó giữ trong thực tế. Tiến sĩ Peter Lund lưu ý rằng bất kỳ thước đo nào được công bố đều mang theo hệ quả, dù có ai chủ ý hay không, bởi danh tiếng phản ứng theo con số. Theo cách nhìn này, lựa chọn không phải giữa thước đo có và không có hệ quả, mà giữa những kiểu méo mó khác nhau.\n\n'
      + 'F. Điều cả hai phía đều chấp nhận là những phẩm chất mà các định chế mong muốn nhất lại thường là thứ khó đếm nhất. Người thầy làm thay đổi cách một học sinh suy nghĩ, người bác sĩ nhận ra điều mà bệnh nhân đã KHÔNG nói — những thứ đó không để lại dấu vết trong bất kỳ tập dữ liệu nào, và một hệ thống chỉ thưởng cho cái đếm được thì theo thời gian sẽ loại bỏ chính họ. Đó không phải lập luận để từ bỏ đo lường. Đó là lập luận để cầm kết quả của nó nhẹ tay hơn ta vẫn thường làm.',
  },
];

/* ══════════════════ NGHE ══════════════════ */

export const LISTENINGS4: ListeningExercise[] = [
  {
    id: 's4l1',
    title: 'Lecture: Why Predictions Fail',
    titleVi: 'Bài giảng: vì sao dự đoán thường sai',
    kind: 'Section 4 — bài giảng học thuật, nói liên tục',
    level: 'Rất khó · từ vựng học thuật dày, không nhắc lại',
    context:
      'Section 4 ở độ khó band 7.5: nói liên tục, từ vựng học thuật dày, không ai nhắc lại. Đọc TOÀN BỘ ghi '
      + 'chú trước và đoán loại từ cho từng chỗ trống — đó là thứ quyết định.',
    lines: [
      { who: 'Giảng viên', text: 'Today I want to examine why expert predictions perform so poorly, and why this finding has proved so difficult to act upon.' },
      { who: 'Giảng viên', text: 'The most systematic evidence comes from long-running studies in which specialists were asked to assign probabilities to future events, and their forecasts were then scored against what actually happened.' },
      { who: 'Giảng viên', text: 'The headline result was uncomfortable. Across many domains, the average expert performed only marginally better than chance, and in some fields no better at all.' },
      { who: 'Giảng viên', text: 'What proved more interesting was the variation within the group. A minority forecast consistently well, and the difference between them and the rest had almost nothing to do with credentials or years of experience.' },
      { who: 'Giảng viên', text: 'It had to do with style of reasoning. The weaker forecasters tended to hold one large organising idea and to interpret every new development through it. The stronger ones drew on several partial explanations and were noticeably readier to change their minds.' },
      { who: 'Giảng viên', text: 'A second finding concerns confidence. Certainty was, if anything, inversely related to accuracy: the forecasters who expressed the least doubt were on average the least reliable.' },
      { who: 'Giảng viên', text: 'Now, why has this been so hard to apply? Partly because institutions reward confidence. A committee asked to choose between two advisers will usually prefer the one who sounds certain, even when uncertainty is the more honest position.' },
      { who: 'Giảng viên', text: 'One last point, and it matters for your essays. The studies do not show that expertise is worthless. They show that expertise improves understanding of a situation while doing very little for prediction — and those are not the same thing at all.' },
    ],
    questions: [
      { q: 'On average, experts performed only ____________ better than chance.', answer: 'marginally', why: '"the average expert performed only marginally better than chance". Từ "only" báo hiệu một hạn định sắp tới.' },
      { q: 'The difference between good and poor forecasters had almost nothing to do with credentials or years of ____________.', answer: 'experience', why: '"nothing to do with credentials or years of experience".' },
      { q: 'Weaker forecasters tended to hold one large ____________ idea.', answer: 'organising', alt: ['organizing'], why: '"to hold one large organising idea and to interpret every new development through it".' },
      { q: 'Stronger forecasters were readier to ____________ their minds.', answer: 'change', why: '"noticeably readier to change their minds".' },
      { q: 'Certainty was ____________ related to accuracy.', answer: 'inversely', why: '"Certainty was, if anything, inversely related to accuracy" — tức là càng chắc chắn càng kém chính xác.' },
      { q: 'Institutions reward ____________.', answer: 'confidence', why: '"Partly because institutions reward confidence." Câu trả lời cho câu hỏi "vì sao khó áp dụng".' },
      { q: 'Expertise improves understanding of a situation but does little for ____________.', answer: 'prediction', why: 'Câu cuối: "expertise improves understanding of a situation while doing very little for prediction".' },
      { q: 'A committee usually prefers the adviser who sounds ____________.', answer: 'certain', why: '"will usually prefer the one who sounds certain, even when uncertainty is the more honest position".' },
    ],
    listenFor: ['only / if anything (báo hiệu hạn định)', 'What proved more interesting was… (chuyển ý)', 'Now, why has this been… (đặt câu hỏi rồi tự trả lời)', 'One last point (ý cuối)'],
    tips: [
      'Ở độ khó này, từ báo hiệu quan trọng hơn bao giờ hết. "if anything" báo hiệu một điều chỉnh mạnh — ở đây nó dẫn tới từ "inversely", một trong những đáp án khó nhất bài.',
      'Bài giảng đặt câu hỏi rồi tự trả lời ("Now, why has this been so hard to apply? Partly because…"). Câu trả lời luôn theo ngay sau — đề hay hỏi vào đó.',
      '"One last point, and it matters for your essays" — cụm này báo hiệu ý tổng kết. Đừng buông tai ở phút cuối.',
      'Đoán loại từ trước khi nghe: chỗ trống sau "one large ___ idea" chắc chắn là TÍNH TỪ. Biết vậy thì bắt nhanh hơn nhiều.',
    ],
  },
];

export const LISTENING_SOURCES4: ListeningSource[] = [
  { name: '6 Minute English (playlist)', channel: 'BBC Learning English', kind: 'playlist', ytId: 'PLcetZ6gSk96-FECmH9l7Vlx5VDigvgZpt', level: 'B2 — nghe không phụ đề', how: 'Ở chặng 4, nghe MỘT LẦN không phụ đề rồi tóm tắt lại bằng lời mình. Nếu tóm tắt được thì đã đủ; chép chính tả chỉ dùng cho đoạn nào tóm tắt sai.' },
  { name: 'British Council IELTS (playlist chính thức)', channel: 'TakeIELTS Official — British Council', kind: 'playlist', ytId: 'PLrt2nkX3MUeBNAcBAap6B313_tlVRCAxz', level: 'Hướng dẫn tiêu chí', how: 'Xem kỹ phần mô tả band 7 và 8 để biết chính xác giám khảo tìm gì — chặng này ăn nhau ở độ chính xác nên hiểu tiêu chí là bắt buộc.' },
];

/* ══════════════════ VIẾT ══════════════════ */

export const WRITINGS4: WritingTask[] = [
  {
    id: 's4w1',
    task: 'Task 1 (Academic)',
    title: 'Sơ đồ quy trình — tái chế chai nhựa',
    figure: {
      kind: 'process',
      title: 'The recycling process for plastic bottles',
      note: 'Sơ đồ tự dựng cho bài luyện. Task 1 dạng process bắt buộc dùng BỊ ĐỘNG và từ nối trình tự.',
      steps: [
        { label: 'Collection', note: 'bottles collected from households' },
        { label: 'Sorting', note: 'separated by colour and type' },
        { label: 'Washing', note: 'labels and residue removed' },
        { label: 'Shredding', note: 'broken into small flakes' },
        { label: 'Melting', note: 'heated and formed into pellets' },
        { label: 'Manufacturing', note: 'pellets made into new products' },
      ],
    },
    prompt: 'The diagram below shows the process by which plastic bottles are recycled. Summarise the information by selecting and reporting the main features. Write at least 150 words.',
    promptVi: 'Sơ đồ cho biết quy trình tái chế chai nhựa. Tóm tắt thông tin bằng cách chọn và tường thuật các đặc điểm chính.',
    minWords: 150,
    minutes: 20,
    outline: [
      { part: 'Câu mở', what: 'Viết lại đề. Nêu quy trình gồm mấy giai đoạn — đây là cách paraphrase tự nhiên nhất cho dạng process.' },
      { part: 'Câu tổng quan', what: 'Nêu: quy trình gồm bao nhiêu bước, bắt đầu từ đâu và kết thúc ở đâu. KHÔNG mô tả chi tiết bước nào.' },
      { part: 'Thân 1', what: 'Ba bước đầu (thu gom → phân loại → rửa). Dùng BỊ ĐỘNG và từ nối trình tự.' },
      { part: 'Thân 2', what: 'Ba bước sau (nghiền → nấu chảy → sản xuất).' },
    ],
    phrases: [
      { en: 'The diagram illustrates the stages involved in…', vi: 'Sơ đồ minh hoạ các giai đoạn của…' },
      { en: 'Overall, the process consists of six main stages, beginning with… and ending with…', vi: 'Nhìn chung, quy trình gồm sáu giai đoạn chính, bắt đầu từ… và kết thúc ở…' },
      { en: 'In the first stage, … are collected from…', vi: 'Ở giai đoạn đầu,… được thu gom từ…' },
      { en: 'Once this has been done, …', vi: 'Sau khi việc này hoàn tất,…' },
      { en: 'The bottles are then…', vi: 'Sau đó các chai được…' },
      { en: 'At this point, … before being…', vi: 'Ở giai đoạn này,… trước khi được…' },
      { en: 'In the final stage, …', vi: 'Ở giai đoạn cuối,…' },
    ],
    sample: {
      band: 'Mức 7.5 — bị động nhất quán, từ nối trình tự đa dạng',
      text: 'The diagram illustrates the stages involved in turning used plastic bottles into new products.\n\nOverall, the process consists of six main stages, beginning with the collection of bottles from households and ending with the manufacture of new items. It is a linear process, and each stage prepares the material for the one that follows.\n\nIn the first stage, empty bottles are collected from households and taken to a processing facility, where they are sorted according to colour and plastic type. Once this separation has been completed, the sorted bottles are washed so that labels, adhesives and any remaining residue can be removed. This cleaning step is essential, since contamination at this point would affect everything downstream.\n\nThe material is then shredded into small flakes, which are heated until they melt and subsequently formed into uniform pellets. In the final stage, these pellets are sold to manufacturers and moulded into new products, at which point the material re-enters the supply chain and the cycle can begin again.',
      note: '181 từ. Ba dấu hiệu band 7.5: (1) bị động nhất quán suốt bài — dạng process bắt buộc; (2) từ nối trình tự KHÔNG lặp (In the first stage / Once this has been completed / then / subsequently / In the final stage); (3) thêm được nhận xét về bản chất quy trình ("It is a linear process") và về lý do một bước tồn tại ("contamination would affect everything downstream") — đó là "chọn lọc đặc điểm chính", không chỉ liệt kê bước.',
    },
    weakSample: {
      band: 'Mức 6.5 — đúng nhưng chủ động và lặp từ nối',
      text: 'The diagram shows how plastic bottles are recycled. There are six stages in the process.\n\nFirst, workers collect the bottles from households. Then they sort the bottles by colour and type. Then they wash the bottles to remove the labels. Then they shred the bottles into small flakes. Then they melt the flakes and make pellets. Finally, factories use the pellets to make new products.\n\nIn conclusion, the recycling process has six stages and it helps the environment.',
      problems: [
        'Dùng CHỦ ĐỘNG với chủ ngữ "workers"/"they" — sơ đồ không hề cho biết ai làm. Dạng process bắt buộc bị động.',
        'Lặp "Then" bốn lần liền — bị trừ nặng ở Coherence vì dùng từ nối máy móc.',
        'Câu tổng quan gộp vào câu mở và quá sơ sài ("There are six stages").',
        'Câu kết nêu Ý KIẾN ("it helps the environment") — Task 1 tuyệt đối không bình luận.',
        'Không có nhận xét nào về bản chất quy trình, chỉ liệt kê bước.',
        'Chỉ 78 từ, dưới mức tối thiểu.',
      ],
    },
    mistakes: [
      { wrong: 'First, workers collect the bottles.', right: 'In the first stage, bottles are collected from households.', why: 'Sơ đồ không cho biết AI làm. Đưa "workers" vào là thêm thông tin không có trong đề — vừa sai bị động vừa sai Task Achievement.' },
      { wrong: 'Then… Then… Then… Then…', right: 'Once this has been completed… The material is then… subsequently… In the final stage…', why: 'Lặp một từ nối bốn lần bị chấm là "mechanical use of cohesive devices" — đúng lỗi ở bài 9 chặng 4.' },
      { wrong: 'In conclusion, it helps the environment.', right: '(Bỏ hẳn. Task 1 không có kết luận và không nêu ý kiến.)', why: 'Task 1 chỉ tường thuật. Bình luận về lợi ích môi trường là lạc yêu cầu.' },
    ],
  },
  {
    id: 's4w2',
    task: 'Task 2 (Hai phần)',
    title: 'Đề hai vế — đo lường trong giáo dục',
    prompt: 'Some educational systems rely heavily on standardised testing to measure student performance. What are the advantages of this approach, and do you think the disadvantages outweigh them? Write at least 250 words.',
    promptVi: 'Một số hệ thống giáo dục dựa nhiều vào thi chuẩn hoá để đo kết quả học sinh. Cách này có lợi ích gì, và bạn có cho rằng bất lợi lớn hơn lợi ích không?',
    minWords: 250,
    minutes: 40,
    outline: [
      { part: 'Mở bài', what: 'Viết lại đề + trả lời THẲNG cả HAI vế. Đề hai câu hỏi thì mở bài phải chạm cả hai.' },
      { part: 'Thân 1', what: 'Lợi ích — giải thích sâu 2 lợi ích, có ví dụ.' },
      { part: 'Thân 2', what: 'Bất lợi — và quan trọng: CÂN chúng với lợi ích, không chỉ liệt kê.' },
      { part: 'Kết bài', what: 'Trả lời dứt khoát vế thứ hai (có/không lớn hơn) kèm điều kiện.' },
    ],
    phrases: [
      { en: 'The case for standardised testing rests on…', vi: 'Lập luận ủng hộ thi chuẩn hoá dựa trên…' },
      { en: 'Its most obvious merit is…', vi: 'Ưu điểm rõ nhất của nó là…' },
      { en: 'The difficulty arises when…', vi: 'Khó khăn nảy sinh khi…' },
      { en: 'On balance, I would argue that…', vi: 'Cân nhắc tất cả, tôi cho rằng…' },
      { en: 'provided that', vi: 'với điều kiện là' },
      { en: 'This is not a reason to abandon X, but to…', vi: 'Đây không phải lý do để bỏ X, mà là để…' },
    ],
    sample: {
      band: 'Mức 7.5 — cân được hai vế, kết luận có điều kiện',
      text: 'Many education systems now depend on standardised examinations to judge how much students have learned. This essay will set out the strongest arguments in favour of that practice before considering whether its costs are, on balance, greater.\n\nThe case for standardised testing rests on comparability. Because every candidate answers the same questions under the same conditions, results can be compared across schools and regions in a way that teacher assessment cannot easily match. This matters most for students from weaker schools, whose ability might otherwise be judged by reputation rather than performance. A second merit is accountability: without common measures, a school that is failing its pupils can remain undetected for years, since the only people in a position to notice are those with least incentive to report it.\n\nThe difficulty arises when the measure begins to shape what is taught. Where results carry serious consequences, schools rationally narrow the curriculum towards what is examined, and time spent on anything unexamined comes to look like time wasted. There is also good evidence that heavy testing regimes select for a particular kind of student — one who performs under time pressure — rather than for understanding as such.\n\nOn balance, I would argue that the disadvantages do not outweigh the benefits, but only under a specific condition: that results are used to prompt investigation rather than to allocate rewards. A test that tells an inspector where to look is valuable. The same test attached to a school funding formula becomes something to be managed, and at that point it stops measuring what it was designed to measure.',
      note: '278 từ. Bốn dấu hiệu band 7.5: (1) trả lời ĐỦ cả hai vế của đề, kể cả ở mở bài; (2) mỗi lợi ích được giải thích tới tầng "vì sao điều đó quan trọng", không dừng ở việc nêu; (3) đoạn bất lợi không liệt kê mà CÂN với lợi ích; (4) kết luận dứt khoát nhưng KÈM ĐIỀU KIỆN, và điều kiện đó được giải thích — đây là thứ phân biệt 7.5 với 6.5.',
    },
    weakSample: {
      band: 'Mức 6.5 — tốt nhưng không cân hai vế và kết luận lửng',
      text: 'Standardised testing is used in many countries to measure student performance. This essay will discuss the advantages and disadvantages of this approach.\n\nThere are several advantages. Firstly, standardised tests are fair because every student takes the same test. Secondly, they allow schools to be compared. Thirdly, they are cheap to administer and mark. Fourthly, parents can see how their child is doing.\n\nHowever, there are also disadvantages. Standardised tests cause stress for students. They also encourage teachers to teach to the test. Furthermore, they do not measure creativity or teamwork. In addition, some students perform badly under pressure even though they understand the material.\n\nIn conclusion, standardised testing has both advantages and disadvantages, and education systems should think carefully about how much they rely on it.',
      problems: [
        'KHÔNG trả lời vế thứ hai của đề ("do the disadvantages outweigh them?"). Kết bài né bằng "should think carefully" — mất điểm Task Response nặng.',
        'Bốn lợi ích và bốn bất lợi, mỗi cái đúng một câu, không cái nào được giải thích tới tầng "vì sao điều đó quan trọng".',
        'Hai đoạn thân là hai DANH SÁCH song song, không hề cân với nhau. Đề hỏi "outweigh" tức là bắt buộc phải cân.',
        'Lặp từ nối máy móc: Firstly, Secondly, Thirdly, Fourthly, However, Furthermore, In addition.',
        'Mở bài chỉ nói "sẽ bàn ưu và nhược" mà không hé lộ lập trường — ở band 7 nên nêu ngay.',
      ],
    },
    mistakes: [
      { wrong: 'In conclusion, … education systems should think carefully about how much they rely on it.', right: 'On balance, I would argue that the disadvantages do not outweigh the benefits, but only under a specific condition: that results are used to prompt investigation rather than to allocate rewards.', why: 'Đề hỏi rõ "do the disadvantages outweigh them?" — phải TRẢ LỜI. Kết luận có điều kiện được giải thích là dấu hiệu band 7.5; kết luận lửng là trần 6.5.' },
      { wrong: 'Liệt kê 4 lợi ích và 4 bất lợi, mỗi cái một câu.', right: 'Hai lợi ích và hai bất lợi, mỗi cái giải thích tới tầng vì sao nó quan trọng, và có ví dụ.', why: 'Ở band 7.5, độ SÂU của việc triển khai quan trọng hơn số lượng ý — khác biệt này rõ hơn ở chặng 4 so với mọi chặng trước.' },
      { wrong: 'Firstly… Secondly… Thirdly… Furthermore… In addition…', right: 'Nối bằng chính khái niệm: "A second merit is accountability: without common measures, …"', why: 'Lặp nhãn từ nối bị chấm là "mechanical use of cohesive devices" — đúng lỗi ở bài 9 chặng 4.' },
    ],
  },
];

/* ══════════════════ NÓI ══════════════════ */

export const SPEAKINGS4: SpeakingTopic[] = [
  {
    id: 's4sp1',
    part: 'Part 3',
    title: 'Measurement, expertise and trust',
    titleVi: 'Đo lường, chuyên môn và niềm tin',
    phrases: [
      { en: 'I would want to separate two things here.', vi: 'Ở đây tôi muốn tách hai chuyện.' },
      { en: 'The honest answer is that I am not sure, but my instinct is…', vi: 'Thành thật thì tôi không chắc, nhưng cảm nhận của tôi là…' },
      { en: 'That is true up to a point.', vi: 'Điều đó đúng tới một mức nào đó.' },
      { en: 'I suspect the causation runs the other way.', vi: 'Tôi ngờ rằng quan hệ nhân quả đi theo chiều ngược lại.' },
      { en: 'It is worth asking what we lose by doing that.', vi: 'Đáng để hỏi ta mất gì khi làm vậy.' },
    ],
    questions: [
      {
        q: 'Do you think exam results are a good way to judge a student?',
        qVi: 'Bạn có nghĩ điểm thi là cách tốt để đánh giá một học sinh không?',
        weak: 'Not really. Exams only test memory, and some students get nervous, so results do not show the real ability of a student.',
        good: 'I would want to separate two things here — whether exams measure something real, and whether that something is what we actually care about. On the first, I think they do measure something: the ability to work accurately under time pressure is genuine, and it is not nothing. The trouble is the second part. What we say we want from education is judgement, curiosity, the capacity to change your mind — and an exam is almost designed not to detect those, because it rewards producing the expected answer quickly. So my honest position is that exam results are a reasonable proxy for one narrow skill that we have allowed to stand in for a much broader set of qualities, largely because the broader set is so hard to measure.',
        goodVi: 'Ở đây tôi muốn tách hai chuyện — kỳ thi có đo được cái gì đó có thật hay không, và cái đó có phải thứ ta thật sự quan tâm hay không. Về vế đầu, tôi cho là chúng có đo được cái gì đó thật: khả năng làm việc chính xác dưới áp lực thời gian là có thật, và không phải là không đáng gì. Vấn đề nằm ở vế thứ hai. Cái ta nói là muốn ở giáo dục là sự phán đoán, tính tò mò, khả năng thay đổi quan điểm — mà một kỳ thi thì gần như được thiết kế để KHÔNG phát hiện ra những thứ đó, vì nó thưởng cho việc đưa ra đáp án được mong đợi thật nhanh. Nên lập trường thành thật của tôi là điểm thi là một chỉ báo hợp lý cho một kỹ năng hẹp mà chúng ta đã để nó thay mặt cho một tập phẩm chất rộng hơn nhiều, phần lớn vì tập rộng đó quá khó đo.',
        why: 'Câu "yếu" ở đây thực ra là câu band 6.5 — đúng, đủ ý, không sai gì. Câu band 7.5 khác ở ba chỗ: (1) TÁCH câu hỏi thành hai câu hỏi con rồi trả lời riêng từng cái; (2) NHƯỢNG BỘ thật lòng với phía kia ("they do measure something… it is not nothing") thay vì bác bỏ hoàn toàn; (3) câu chốt nêu được một quan sát ở tầng sâu hơn cả câu hỏi. Đây là điểm khác biệt thật giữa 6.5 và 7.5 ở Part 3 — không phải từ vựng khó hơn.',
      },
      {
        q: 'Should we trust experts more than ordinary people?',
        qVi: 'Ta có nên tin chuyên gia hơn người thường không?',
        weak: 'Yes, because experts have studied the subject for many years, so they know more than ordinary people.',
        good: 'That is true up to a point, but I think it depends enormously on what we are asking them to do. If the question is how something works — how a virus spreads, why a bridge failed — then yes, expertise is exactly what you want, and the gap between a specialist and the rest of us is enormous. But if the question is what will happen next, the evidence is much less flattering. Forecasting studies tend to find that specialists do only slightly better than chance, and that the confident ones do worse than the hesitant ones. So I would trust an expert to explain a situation far more than to predict it, and I think a lot of public frustration with experts comes from not making that distinction.',
        goodVi: 'Điều đó đúng tới một mức nào đó, nhưng tôi nghĩ nó phụ thuộc rất nhiều vào việc ta yêu cầu họ làm gì. Nếu câu hỏi là cái gì đó vận hành ra sao — virus lây thế nào, vì sao cây cầu sập — thì đúng, chuyên môn chính là thứ bạn cần, và khoảng cách giữa chuyên gia với phần còn lại là rất lớn. Nhưng nếu câu hỏi là chuyện gì sẽ xảy ra tiếp theo thì bằng chứng kém thuận lợi hơn nhiều. Các nghiên cứu về dự báo thường thấy chuyên gia chỉ nhỉnh hơn ngẫu nhiên chút ít, và người tự tin lại kém hơn người do dự. Nên tôi sẽ tin chuyên gia GIẢI THÍCH một tình huống hơn nhiều so với tin họ DỰ ĐOÁN nó, và tôi nghĩ nhiều bực bội của công chúng với giới chuyên gia đến từ việc không phân biệt hai chuyện đó.',
        why: 'Cấu trúc "đúng tới một mức, nhưng còn tuỳ ta hỏi gì" cho phép bạn vừa đồng ý vừa phản biện mà không mâu thuẫn. Câu chốt lại giải thích được một hiện tượng xã hội (vì sao công chúng bực bội với chuyên gia) — nêu được hệ quả rộng hơn câu hỏi là dấu hiệu rất rõ của band 7.5.',
      },
    ],
  },
];

export const SPEAKING_RULES4: { title: string; body: string }[] = [
  { title: 'Tách câu hỏi thành hai câu hỏi con', body: '"I would want to separate two things here" rồi trả lời riêng từng cái. Đây là kỹ thuật mạnh nhất ở band 7.5 vì nó cho thấy bạn nhìn ra cấu trúc của vấn đề, chứ không chỉ có ý kiến về nó.' },
  { title: 'Nhượng bộ thật lòng với phía kia', body: 'Trước khi phản biện, công nhận điều phía kia đúng — và công nhận cho có sức nặng, không phải cho có lệ. Bác bỏ hoàn toàn nghe non; nhượng bộ rồi mới phản biện nghe chín.' },
  { title: 'Câu chốt phải rộng hơn câu hỏi', body: 'Kết bằng một quan sát giải thích được điều gì đó ngoài phạm vi câu hỏi. Đây là thứ phân biệt 7.5 với 6.5 — không phải từ vựng khó hơn.' },
  { title: 'Được phép nói "tôi không chắc"', body: '"The honest answer is that I am not sure, but my instinct is…" — thừa nhận không chắc rồi vẫn đưa ra lập trường là dấu hiệu tư duy chín, và ăn điểm hơn hẳn việc khẳng định bừa.' },
  { title: 'Ngữ điệu quan trọng ngang nội dung ở đây', body: 'Ở band 7.5, nội dung của bạn đã đủ tốt. Thứ còn chặn thường là Pronunciation: nói trôi mà đều một nhịp. Nhấn vào từ mang thông tin mới, hạ giọng ở phần đã biết.' },
];
