/**
 * 🎬 Video bài giảng của IELTS Tập 2 — khoá = id bài (`t2dN-…`, `t2-bat-dau`), hiện đầu bài (VideoBai.tsx).
 * Cùng quy trình và định dạng với `../videos.ts` của Tập 1 (oEmbed + playabilityStatus OK + playableInEmbed;
 * kiểm cả loạt: `node scripts/yt-check.mjs <id…>`). Không dùng lại ID đã gắn ở Tập 1 cho cùng nội dung.
 */
import type { LessonVideo } from '@/components/sach-hoc/types';

export const VIDEO_BAI_T2: Record<string, LessonVideo[]> = {
  't2-bat-dau': [
    {"id":"uXTHtMFNNOo","credit":"IELTS Nguyễn Huyền — 5 sai lầm khi tự học IELTS tại nhà","dur":"11:45","lang":"vi","note":"Cô Huyền chỉ ra 5 sai lầm hay gặp khi tự học IELTS ở nhà; xem trước khi bắt đầu Ngày 1, ghi lại sai lầm nào mình đang mắc để tránh trong 24 ngày của Tập 2."},
  ],
  't2d1-ngu-phap': [
    {"id":"ryRu8zFCKZE","credit":"BBC Learning English — Articles - 6 Minute Grammar","dur":"6:04","lang":"en","note":"BBC giảng gọn khi nào dùng a / an / the và khi nào không dùng mạo từ; xem trước để nắm khung, bật phụ đề nếu cần."},
    {"id":"3D6PYG_yiuA","credit":"English with Lucy — 9 RULES OF ARTICLES - A, AN, THE or 'THEE' ? - Use and pronounce correctly every time!","dur":"24:30","lang":"en","note":"Lucy đi qua 9 quy tắc mạo từ, có cả chọn a hay an theo ÂM đầu và cách đọc the; dừng sau mỗi quy tắc, đối chiếu với các mục của bài (phần tên địa danh học kỹ trong bài)."},
  ],
  't2d1-nghe': [
    {"id":"s03OhjTiO8s","credit":"English Pro Tips - IELTS Preparation — IELTS Listening Test - Form Completion, Multiple Choice, and Sentence Completion","dur":"12:59","lang":"en","note":"Chiến lược làm Form completion (đọc trước, đoán loại từ, chú ý giới hạn số từ) kèm bài luyện; tập trung phần Form completion, bật phụ đề khi nghe lại đoạn sai."},
  ],
  't2d1-noi': [
    {"id":"FUNeZlSQhRY","credit":"English Speaking Success — Most Common IELTS Speaking Part 1 Questions and Answers","dur":"17:42","lang":"en","note":"Keith O'Hare (cựu giám khảo) trả lời các câu Part 1 hay gặp, có Work/Study và Hometown; để ý cách anh trả lời 2–3 câu có lý do, khớp khung A–R–E của bài."},
    {"id":"drEIArT9g2c","credit":"IELTS with Charles — IELTS Speaking Part 1 | Cách Nói Về WORK AND STUDY trong IELTS Speaking","dur":"5:09","lang":"vi","note":"Thầy Charles giảng bằng tiếng Việt cách nói về Work and Study ở Part 1 kèm câu mẫu; nghe xong tự nói lại câu trả lời của mình theo khung."},
  ],
  't2d2-tu-vung': [
    {"id":"31wecrlYThI","credit":"IELTS Charlie — IELTS Vocabulary from the Academic Word List (Words 1 to 5)","dur":"10:44","lang":"en","note":"5 từ đầu Academic Word List (analyse, approach, area, assess, assume) — đúng nhóm AWL sublist 1 của bài; chép ví dụ và họ từ vào sổ."},
    {"id":"MjBQpsVbShs","credit":"English Pro Tips - IELTS Preparation — IELTS Vocabulary | The Environment","dur":"18:43","lang":"en","note":"Từ vựng chủ đề Môi trường cho IELTS (pollution, emissions, renewable…); dừng để đọc to từng cụm, chọn 5 cụm dùng được cho Writing Task 2."},
  ],
  't2d2-doc': [
    {"id":"HHU8fVwN-Po","credit":"The IELTS Coach — IELTS Academic Reading   Summary Completion   Passage 2","dur":"5:49","lang":"en","note":"Làm mẫu một bài Summary completion lấy từ trong bài đọc: tìm vị trí, đoán loại từ, kiểm giới hạn số từ; tự làm trước rồi mới xem đáp án."},
    {"id":"tUmsidprGJw","credit":"IELTS Thanh Loan — Cách làm bài Summary completion trong IELTS Reading cùng mẹo hay| IELTS Thanh Loan","dur":"34:21","lang":"vi","note":"Cô Thanh Loan giảng tiếng Việt cách làm Summary completion từng bước; xem phần giảng chiến thuật và một bài làm mẫu, phần còn lại xem nếu còn thời gian."},
  ],
  't2d2-viet': [
    {"id":"y9Gn6aVRqaI","credit":"IELTS Liz — IELTS Writing Task 2  Essay - Paragraph Length","dur":"13:17","lang":"en","note":"IELTS Liz: mỗi đoạn thân bài Task 2 nên dài bao nhiêu và cần những ý gì; đối chiếu với khung P-E-E (Point – Explain – Example) của bài."},
    {"id":"DmbStYw8YKI","credit":"The Forum  — Hướng dẫn chi tiết Writing task 2:  ‘To what extent do you agree or disagree’ | THE FORUM CENTER","dur":"14:25","lang":"vi","note":"The Forum hướng dẫn bằng tiếng Việt dạng \"To what extent do you agree or disagree\" từ mở bài tới thân bài; xem để chắc cách nêu quan điểm rõ ngay từ đầu."},
  ],
  't2d3-ngu-phap': [
    {"id":"92XBCRYZ1S8","credit":"English with Lucy — IN / ON / AT - Prepositions of PLACE AND TIME | English Grammar Lesson (+ Free PDF & Quiz)","dur":"13:57","lang":"en","note":"Lucy giảng IN / ON / AT cho cả thời gian và nơi chốn kèm quiz; dừng làm quiz cuối video rồi so với bảng giới từ của bài."},
    {"id":"p_lgP_XwDig","credit":"7ESL Learning English — The Super Easy Way to Learn Prepositions of Place and Movement in English","dur":"9:08","lang":"en","note":"Giới từ nơi chốn và chuyển động (into, across, through, along…) bằng hình minh hoạ; nói to câu mẫu, dùng lại khi chỉ đường ở bài Nghe."},
  ],
  't2d3-nghe': [
    {"id":"Qi1QNE6Qxes","credit":"The IELTS Coach — IELTS Listening Practice - Prices","dur":"5:59","lang":"en","note":"Luyện nghe chép giá tiền như IELTS Listening; dừng video, viết đáp án rồi mới xem kết quả."},
    {"id":"n9E-1kURLEk","credit":"The IELTS Coach — IELTS Listening Practice - Dates","dur":"5:58","lang":"en","note":"Luyện nghe chép ngày tháng (cách đọc và cách viết đúng); làm hết bài, ghi lại các lỗi hay nhầm."},
  ],
  't2d3-noi': [
    {"id":"N3x1cvJoy38","credit":"English Speaking Success — 3 Steps to a Perfect IELTS Speaking Part 2 Answer","dur":"14:45","lang":"en","note":"Keith O'Hare chỉ 3 bước trả lời Part 2: dùng 1 phút ghi chú, đi theo cue card, kéo dài đủ 2 phút; tập ghi chú theo cách này trước khi làm Describe a person."},
    {"id":"569HgmNEyCg","credit":"Luyện Thi IELTS LangGo — Mock test IELTS Speaking Part 2: Describe Someone You Admire - IELTS LangGo","dur":"6:41","lang":"en","note":"Bài thi thử Part 2 \"Describe someone you admire\" của LangGo; nghe cách thí sinh tả người, rồi tự nói 2 phút về người bạn chọn."},
  ],
  't2d4-tu-vung': [
    {"id":"l6XCOoO0Mpk","credit":"Learn English with Papa Teach Me — ALL Prefixes and Suffixes! - English Lesson","dur":"13:59","lang":"en","note":"Tổng hợp tiền tố và hậu tố thường gặp (un-, dis-, re-, -tion, -ful, -less…); đúng phần tiền tố / hậu tố của bài, tự đoán nghĩa từ mới trước khi thầy giải thích."},
    {"id":"EcksSPweIHI","credit":"POC English — English Vocabulary: Health & Diet Collocations 💪🥗🧘‍♀️","dur":"20:24","lang":"en","note":"Collocation chủ đề Sức khoẻ & ăn uống (balanced diet, cut down on…); chọn 8–10 cụm khớp từ vựng của bài để chép vào sổ."},
  ],
  't2d4-doc': [
    {"id":"UMLdnjXixMY","credit":"IELTSMaterial - IELTS Preparation & Study Abroad — IELTS 2024 Reading - NOTE Completion Tips & Tricks (with Practice Question)","dur":"9:32","lang":"en","note":"Mẹo làm Note completion trong Reading kèm câu luyện; làm bài luyện trong video trước khi nghe giải thích."},
    {"id":"RtTIJ_V9gmI","credit":"IELTS Understood — Note Completion in IELTS Reading: Tips and Strategies for Band 9","dur":"12:44","lang":"en","note":"Chiến thuật Note completion từng bước: đọc ghi chú, đoán loại từ, tìm từ đồng nghĩa trong bài; đối chiếu với cách làm 2 bước của bài học."},
  ],
  't2d4-viet': [
    {"id":"XATlmM286wg","credit":"IELTS-up Online lessons — IELTS Writing task 1: line graph","dur":"12:03","lang":"en","note":"Bài giảng kinh điển về line graph Task 1: mở bài, overview, thân bài và từ chỉ xu hướng; dừng ở phần overview để so với khung overview 2 câu của bài."},
    {"id":"fXRjDmiiWtQ","credit":"Tự Học IELTS — Cách viết IELTS Writing Task 1 Line graph","dur":"20:44","lang":"vi","note":"Giảng bằng tiếng Việt cách viết trọn một bài line graph; xem lại nếu phần tiếng Anh ở trên còn chưa rõ."},
  ],
  't2d5-ngu-phap': [
    {"id":"vM5trdispow","credit":"Arnel's Everyday English — PAST SIMPLE or PRESENT PERFECT? | Let's learn and compare! - English Tenses","dur":"13:45","lang":"en","note":"So sánh quá khứ đơn với hiện tại hoàn thành qua dòng thời gian, có bài tập; dừng lại tự chọn thì trước khi xem đáp án."},
    {"id":"Lc9rXlryhFM","credit":"Teacher, I have a question — ALREADY, YET, JUST, FOR e SINCE - Aula de Inglês #92","dur":"6:44","lang":"en","note":"Cách dùng already, yet, just, for, since với hiện tại hoàn thành (vị trí trong câu, for + khoảng, since + mốc)."},
  ],
  't2d5-nghe': [
    {"id":"k__RgNzPuBE","credit":"IELTSMaterial - IELTS Preparation & Study Abroad — IELTS Listening Table Completion Tips | DAY 1 | IELTS 2023 in 45 Days","dur":"7:56","lang":"en","note":"Mẹo Table completion trong Listening (đọc tiêu đề cột, đoán loại từ từng ô) kèm câu luyện; làm câu luyện trước khi xem đáp án."},
    {"id":"yI4Vpw59Dfo","credit":"English with Lucy — English Dictation Practice - Listening Test (MAX SCORE: 71)","dur":"14:55","lang":"en","note":"Bài nghe chép chính tả của Lucy (tự chấm điểm); làm như phần Dictation 3 của bài: nghe, dừng, viết, rồi so đáp án."},
  ],
  't2d5-noi': [
    {"id":"eig1L1OMZmY","credit":"English Speaking Success — IELTS Speaking - Better Connectors, Better Fluency","dur":"16:21","lang":"en","note":"Keith O'Hare giới thiệu từ nối nói tự nhiên giúp kéo dài câu trả lời và trôi chảy hơn; chọn 5 cụm để dùng trong câu Wh- của Part 1."},
    {"id":"Xjz1VGkKR48","credit":"ZIM Academy — Cách phát triển câu trả lời ăn điểm IELTS Speaking Part 1 | Anh Ngữ ZIM","dur":"5:01","lang":"vi","note":"ZIM giảng tiếng Việt cách phát triển câu trả lời Part 1 cho người mới; áp dụng ngay cho 3 câu hỏi Wh- trong bài."},
  ],
  't2d6-tu-vung': [
    {"id":"PL_-z497Q-o","credit":"English with Emma · engVid — IELTS & TOEFL Vocabulary - Technology","dur":"11:53","lang":"en","note":"Emma (engVid) dạy từ vựng chủ đề Technology cho IELTS; ghi lại các từ trùng bài và câu ví dụ."},
    {"id":"CiNggzdWkIo","credit":"Khan Academy — Using context clues to figure out new words | Reading | Khan Academy","dur":"4:47","lang":"en","note":"Khan Academy giải thích cách dùng manh mối ngữ cảnh để đoán nghĩa từ mới — đúng kỹ năng đoán nghĩa của bài."},
  ],
  't2d6-doc': [
    {"id":"JkWwZt8UwA4","credit":"Fastrack IELTS — Band 9 IELTS Reading TRUE - FALSE - NOT GIVEN | Strategy & Practice","dur":"19:29","lang":"en","note":"Chiến thuật True / False / Not Given kèm bài luyện; chú ý phần phân biệt False với Not Given — đó là bẫy lớn nhất của bài."},
    {"id":"RlWN9KNFVXw","credit":"Tự Học IELTS — Cách làm IELTS Reading: TRUE - FALSE - NOT GIVEN","dur":"15:42","lang":"vi","note":"Giảng bằng tiếng Việt cách làm TFNG; xem để chắc từng bẫy (từ tuyệt đối, so sánh, thông tin thiếu) trước khi làm bài tập."},
  ],
  't2d6-viet': [
    {"id":"YBtSHDYty9s","credit":"English Pro Tips - IELTS Preparation — IELTS Writing Task 2: Plan and Write a Complete Discussion Essay with Useful Vocabulary","dur":"19:05","lang":"en","note":"Lập dàn ý và viết trọn một bài Discussion (discuss both views) kèm từ vựng hữu ích; tập lập dàn ý 5 phút cùng video."},
    {"id":"zUyQGlSoz2M","credit":"The Forum  — Hướng dẫn chi tiết Writing task 2: Discuss both views | THE FORUM CENTER","dur":"11:15","lang":"vi","note":"The Forum hướng dẫn tiếng Việt dạng Discuss both views: chia đoạn, nêu quan điểm của mình ở đâu."},
  ],
  't2d7-ngu-phap': [
    {"id":"UISiuiPd_FY","credit":"To Fluency — Will vs Be Going To vs Present Continuous: Talk About the Future in English (Jack Explains)","dur":"12:37","lang":"en","note":"Jack giải thích khi nào dùng will, be going to và hiện tại tiếp diễn để nói về tương lai, nhiều ví dụ."},
    {"id":"79Yxp84s0KI","credit":"English Panda — Future Plans in English Conversation | Will, Going to, Present Continuous, Present Simple","dur":"3:50","lang":"en","note":"Hội thoại ngắn dùng đủ 4 cách nói tương lai, có cả hiện tại đơn cho lịch trình; nghe rồi tự nhận ra mỗi câu dùng cách nào."},
  ],
  't2d7-nghe': [
    {"id":"twjWvYQ-saM","credit":"Fastrack IELTS — IELTS Listening MAPS: New Strategy + Practice","dur":"21:16","lang":"en","note":"Chiến thuật Map labelling (định hướng, mốc, ngôn ngữ vị trí) kèm bài luyện; làm bài luyện trong video và ghi lại cụm chỉ vị trí."},
    {"id":"_KLGlBMUDJk","credit":"Tự Học IELTS — Cách làm IELTS Listening Map Labeling","dur":"15:39","lang":"vi","note":"Giảng tiếng Việt cách làm Map labelling từng bước; xem nếu còn lúng túng với từ chỉ hướng."},
  ],
  't2d7-noi': [
    {"id":"x9aCR1oDJs4","credit":"English Speaking Success — IELTS Speaking Part 2: Band 9 TEMPLATES - #3 PLACES","dur":"15:27","lang":"en","note":"Keith O'Hare: khung trả lời Part 2 cho chủ đề nơi chốn (places); dùng khung này để tự nói 2 phút về nơi bạn chọn."},
    {"id":"vL8P4njRlTs","credit":"IELTS with Charles — IELTS Speaking Part 2 | Describe A Place You Like To Visit","dur":"3:51","lang":"vi","note":"Thầy Charles phân tích bài mẫu \"Describe a place you like to visit\"; nghe cách sắp ý rồi tự nói lại theo ghi chú."},
  ],
  't2d8-tu-vung': [
    {"id":"5WGDTOm3xRk","credit":"Oxford Online English — How to Talk About Transport and Driving in English - Spoken English Lesson","dur":"18:10","lang":"en","note":"Oxford Online English: cách nói về giao thông và đi lại bằng tiếng Anh tự nhiên; chép các cụm về tắc đường, phương tiện công cộng."},
    {"id":"QnYAQmATdgc","credit":"IELTS Plus — IELTS English Podcast - Speaking Topic: Urbanization","dur":"12:15","lang":"en","note":"Podcast IELTS chủ đề đô thị hoá (urbanisation); nghe cách dùng từ vựng thành phố trong câu trả lời Speaking."},
  ],
  't2d8-doc': [
    {"id":"A2yZ-ywqmUk","credit":"IELTS Jacky — IELTS Reading – Short Answer Questions","dur":"10:51","lang":"en","note":"Cách làm Short-answer questions: đọc câu hỏi, gạch từ hỏi, tìm đáp án đúng giới hạn số từ."},
    {"id":"rlsqbSFOBCg","credit":"IELTS Liz — Vocabulary for IELTS: Paraphrasing Tips","dur":"10:50","lang":"en","note":"IELTS Liz: các cách paraphrase (từ đồng nghĩa, đổi loại từ, đổi cấu trúc) — đúng phần \"paraphrase 3 cách\" của bài."},
  ],
  't2d8-viet': [
    {"id":"E3U1Y1jgGls","credit":"IELTS Liz — IELTS Writing Task 1: How to Describe a Bar Chart","dur":"18:26","lang":"en","note":"IELTS Liz hướng dẫn mô tả bar chart Task 1 (chọn đặc điểm chính, nhóm số liệu); xem hết rồi đối chiếu bài mẫu của bài học."},
    {"id":"mO0dFhMvVFU","credit":"IELTS ASMR — Làm sao để \"make comparisons where relevant\"? | IELTS writing Task 1","dur":"8:13","lang":"en","note":"Cách so sánh số liệu trong Task 1 (higher than, twice as…, the largest); đúng phần ngôn ngữ so sánh của bài."},
  ],
  't2d9-ngu-phap': [
    {"id":"oGr7l3q7SMI","credit":"English with Lucy — Comparative & Superlative Adjectives - English Grammar Lesson (with PDF & Quiz)","dur":"10:19","lang":"en","note":"Lucy giảng so sánh hơn và so sánh nhất (-er/-est, more/most, bất quy tắc) kèm quiz; làm quiz cuối video."},
    {"id":"bJyW_s9p8vk","credit":"Learn English with Bob the Canadian — Describing and Comparing Things Using AS and AS in English","dur":"5:22","lang":"en","note":"Bob giải thích so sánh bằng as … as và not as … as qua ví dụ thật; tự đặt 3 câu so sánh về hai thứ quanh bạn."},
  ],
  't2d9-nghe': [
    {"id":"VSteuEhXQqY","credit":"TELC UK Training, Education and Language Courses — IELTS practice test- listening part 1 section 1 and 2","dur":"9:01","lang":"en","note":"Bài nghe IELTS Section 1 và 2 để luyện như đề nhỏ của bài; làm đúng giờ, không dừng, rồi mới so đáp án."},
  ],
  't2d9-noi': [
    {"id":"Ua2vZVnZ9E8","credit":"IELTS Jacky — How To Paraphrase Speaking Part 1 Questions","dur":"2:59","lang":"en","note":"IELTS Jacky chỉ cách paraphrase lại câu hỏi Part 1 ở đầu câu trả lời; tập nhắc lại 5 câu hỏi theo cách đó."},
    {"id":"dSOWHQIcO_s","credit":"English Pro Tips - IELTS Preparation — 8 Difficult IELTS Speaking Part 1 Questions (And How to Answer Them)","dur":"27:56","lang":"en","note":"8 câu Part 1 khó và cách trả lời; xem các câu gần với 12 chủ đề của bài, phần còn lại xem sau."},
  ],
  't2d10-tu-vung': [
    {"id":"YtAAYarZY04","credit":"English Pro Tips - IELTS Preparation — Essential Vocabulary for IELTS Academic Task 1","dur":"22:21","lang":"en","note":"Từ vựng thiết yếu cho Academic Task 1: xu hướng (rise, decline, fluctuate…) và cách đặt trạng từ; đúng phần ngôn ngữ xu hướng vòng 2."},
    {"id":"BYugl_oy7Z4","credit":"Trung T. Le Học tiếng Anh — 1.1.5. Academic Word List - Từ học thuật - Sublist 2","dur":"7:29","lang":"vi","note":"Giới thiệu bằng tiếng Việt các từ học thuật trong AWL sublist 2; chép họ từ vào sổ như bài yêu cầu."},
  ],
  't2d10-doc': [
    {"id":"CFXiTWdb4mY","credit":"Fastrack IELTS — IELTS Reading Band 9 | Multiple Choice Questions","dur":"14:39","lang":"en","note":"Chiến thuật Multiple choice trong Reading (loại đáp án bẫy, tìm vùng thông tin) kèm bài luyện."},
    {"id":"ryuxNwMv698","credit":"The Forum  — Kỹ thuật tối thượng MULTIPLE CHOICE | THE FORUM CENTER","dur":"6:52","lang":"vi","note":"The Forum giảng tiếng Việt kỹ thuật làm Multiple choice; xem để nắm cách loại trừ đáp án."},
  ],
  't2d10-viet': [
    {"id":"h5TyJtIIaOk","credit":"IELTS Jacky — IELTS Writing Task 2  – How To Write Advantages Disadvantages Essays","dur":"21:39","lang":"en","note":"IELTS Jacky hướng dẫn trọn dạng Advantages / disadvantages: nhận dạng đề, dàn ý, viết đoạn."},
    {"id":"DItz_lnAG78","credit":"Lilie IELTS — how to correctly answer \"do the advantages OUTWEIGH the disadvantages\" - ielts writing task 2","dur":"11:55","lang":"en","note":"Lilie giải thích cách trả lời đúng câu hỏi \"Do the advantages outweigh the disadvantages?\" — đúng phần \"outweigh\" của bài."},
  ],
  't2d11-ngu-phap': [
    {"id":"1VaoDZpzWTw","credit":"English with Lucy — GERUND (-ing) or INFINITIVE (to) - When & How to Use them! (+ Free PDF & Quiz)","dur":"14:07","lang":"en","note":"Lucy giảng khi nào dùng V-ing, khi nào dùng to V, kèm danh sách động từ và quiz."},
    {"id":"-s1gu725tA4","credit":"Ellii (formerly ESL Library) — Gerunds & Infinitives – English Grammar Lessons","dur":"7:30","lang":"en","note":"Ellii tóm tắt gerund & infinitive gọn, có V-ing sau giới từ; dùng để ôn lại sau video trên."},
  ],
  't2d11-nghe': [
    {"id":"hOAsUNNyPIs","credit":"E2 IELTS — IELTS Listening: Don't Make These 4 Mistakes!","dur":"13:19","lang":"en","note":"E2 IELTS chỉ 4 kiểu bẫy (distractor) trong Listening, có kiểu người nói sửa lại ý \"actually, no…\"; đúng trọng tâm bài."},
    {"id":"YCYu1GuqRdo","credit":"Smash Exams (IELTS) — IELTS listening: How to use signpost language skills","dur":"2:55","lang":"en","note":"Cách dùng từ báo hiệu (signpost language) để biết người nói chuyển ý; ghi lại các cụm báo hiệu."},
  ],
  't2d11-noi': [
    {"id":"7zaCPkgMhiU","credit":"English Speaking Success — IELTS Speaking Part 2: Band 9 TEMPLATES - #6 THINGS","dur":"21:28","lang":"en","note":"Keith O'Hare: khung trả lời Part 2 cho chủ đề đồ vật (things); dùng khung để tự nói 2 phút về một đồ vật."},
    {"id":"XGFd5efNjWU","credit":"English lessons with Yulia — IELTS Speaking part 2. DESCRIBE an object that is important to you","dur":"5:08","lang":"en","note":"Bài mẫu \"Describe an object that is important to you\"; nghe cách mô tả hình dáng, công dụng, lý do quan trọng."},
  ],
  't2d12-tu-vung': [
    {"id":"LMrqR-aOXTU","credit":"English Speaking Success — IELTS Speaking Vocabulary: FOOD and HEALTHY EATING","dur":"14:58","lang":"en","note":"Keith O'Hare dạy từ vựng chủ đề Food và ăn uống lành mạnh cho Speaking; chép các cụm khớp bài."},
    {"id":"piPRo327p7o","credit":"English With Teacher Levi — Slow English: Agriculture Vocabulary - English Listening Practice","dur":"13:21","lang":"en","note":"Từ vựng nông nghiệp được nói chậm lại cho dễ nghe; nghe, nhắc lại từng câu (shadowing) và chép các từ trùng bài."},
  ],
  't2d12-doc': [
    {"id":"SXdMpskBDmA","credit":"Fastrack IELTS — IELTS Reading Matching Headings | Best Tips + Practice Tasks","dur":"9:01","lang":"en","note":"Mẹo làm Matching headings kèm bài luyện: đọc câu đầu/cuối đoạn, tìm ý chính, cẩn thận heading bẫy."},
    {"id":"-JZGqRchRKI","credit":"The Forum  — Matching Heading dùng kỹ thuật tối thượng Reversed Reading sáng tạo bởi Huy Forum","dur":"19:18","lang":"vi","note":"The Forum giảng tiếng Việt kỹ thuật Matching headings; xem nếu vẫn hay chọn nhầm heading."},
  ],
  't2d12-viet': [
    {"id":"tgwibVefUKk","credit":"IELTS Advantage — IELTS Writing Task 1: Ace Pie Charts in Minutes [+ Free Task 1 PDF]","dur":"23:36","lang":"en","note":"IELTS Advantage hướng dẫn pie chart Task 1, cả một và nhiều biểu đồ tròn; tập viết overview cùng video."},
    {"id":"HN7uJj6uo9U","credit":"ZIM Academy — Cách viết Pie chart IELTS Writing task 1 - Phần 1 | Anh Ngữ ZIM","dur":"9:55","lang":"vi","note":"ZIM giảng tiếng Việt cách viết pie chart (phần 1); xem lại nếu chưa rõ cách nhóm số liệu."},
  ],
  't2d13-ngu-phap': [
    {"id":"ZYdIhPgIDkg","credit":"mmmEnglish — When To Use ZERO + FIRST Conditional Sentences | Accurate English Grammar","dur":"15:52","lang":"en","note":"mmmEnglish phân biệt câu điều kiện loại 0 và loại 1 qua ví dụ thật; dừng tự đặt câu cho mỗi loại."},
    {"id":"N5lcszNFnOs","credit":"Teachers Mark and Matt — Future Clauses - 1st Conditional: IF / WHEN / AS SOON AS / UNLESS","dur":"7:37","lang":"en","note":"Mệnh đề thời gian tương lai với if / when / as soon as / unless (không dùng will sau chúng) — đúng phần unless / as soon as của bài."},
  ],
  't2d13-nghe': [
    {"id":"3fJPAsRVCf4","credit":"English Pro Tips - IELTS Preparation — IELTS Listening | Best Strategy for Multiple Choice Questions","dur":"14:22","lang":"en","note":"Chiến thuật Multiple choice trong Listening (cả dạng chọn hai đáp án) kèm luyện tập — dạng chính của Part 3."},
    {"id":"x7G6IIld4Qs","credit":"IELTSMaterial - IELTS Preparation & Study Abroad — IELTS Listening 2024 Flowchart Completion | DAY 6 | IELTS in 45 Days #ielts2024 #ieltspreparation","dur":"8:37","lang":"en","note":"Mẹo Flow-chart completion trong Listening kèm câu luyện; làm trước khi xem đáp án."},
  ],
  't2d13-noi': [
    {"id":"pMx9ogGoZN4","credit":"English Speaking Success — How to Start Speaking in IELTS Part 3","dur":"17:51","lang":"en","note":"Keith O'Hare chỉ cách mở đầu câu trả lời Part 3: nêu ý kiến, lý do, ví dụ; tập ngay với câu hỏi trong bài."},
    {"id":"TXXC7Wje8xE","credit":"The IELTS Workshop — Cách trả lời IELTS Speaking part 3 thuyết phục","dur":"3:15","lang":"en","note":"Cách trả lời Part 3 thuyết phục (ý kiến + giải thích + ví dụ) gói gọn 3 phút; dùng để ôn trước khi tự nói."},
  ],
  't2d14-tu-vung': [
    {"id":"RlkJ1H2qkm0","credit":"English Speaking Success — Travel Vocabulary for IELTS students","dur":"16:31","lang":"en","note":"Keith O'Hare dạy từ vựng chủ đề Du lịch cho IELTS; ghi lại các cụm dùng được cho Speaking và Writing."},
    {"id":"ygBOqPvG-XA","credit":"IELTS Plus — IELTS English Podcast - Speaking Topic: Tourism","dur":"13:08","lang":"en","note":"Podcast IELTS chủ đề Tourism: nghe từ vựng du lịch trong câu trả lời thật."},
  ],
  't2d14-doc': [
    {"id":"8BSLSn3N9Fg","credit":"English Pro Tips - IELTS Preparation — IELTS Reading | Get full marks in Sentence Completion tasks","dur":"18:41","lang":"en","note":"Chiến thuật Sentence completion trong Reading kèm bài luyện; làm bài luyện trước khi xem đáp án."},
    {"id":"H5ClKJTcBvw","credit":"The IELTS Workshop — CÁCH LÀM DẠNG BÀI SENTENCE COMPLETION TRONG IELTS READING | IELTS 4 SKILLS by The IELTS Workshop","dur":"4:12","lang":"en","note":"Tóm tắt nhanh các bước làm Sentence completion; xem để ôn lại trước khi làm bài."},
  ],
  't2d14-viet': [
    {"id":"_9nrTXOdiII","credit":"IELTS-up Online lessons — IELTS Writing task 2: causes solutions essay","dur":"17:54","lang":"en","note":"Bài giảng dạng Causes / Solutions Task 2: dàn ý và cách viết từng đoạn; đối chiếu với dạng Cause / effect của bài."},
    {"id":"ZCsQXumEzqY","credit":"ZIM Academy — Chiến lược làm dạng bài Cause - Problem - Solution trong IELTS Writing Task 2","dur":"10:35","lang":"vi","note":"ZIM giảng tiếng Việt chiến lược dạng Cause – Problem – Solution; xem để phân biệt các biến thể đề."},
  ],
  't2d15-ngu-phap': [
    {"id":"j25CFx-4g0I","credit":"Arnel's Everyday English — RELATIVE PRONOUNS | RELATIVE CLAUSES | ADJECTIVE CLAUSES - who, which, that, whose, whom","dur":"15:44","lang":"en","note":"Arnel giảng đại từ quan hệ who, which, that, whose, whom và mệnh đề quan hệ, nhiều ví dụ."},
    {"id":"eFmfoeTkhH0","credit":"EasyTeaching — Relative Clauses (Defining & Non-Defining) | EasyTeaching","dur":"6:48","lang":"en","note":"Phân biệt mệnh đề quan hệ xác định và không xác định; bài này chỉ học loại XÁC ĐỊNH, phần không xác định xem để biết."},
  ],
  't2d15-nghe': [
    {"id":"uFh_xt93M_E","credit":"The IELTS Coach — IELTS Listening Tips - Different Accents","dur":"5:19","lang":"en","note":"Mẹo nghe các giọng khác nhau trong IELTS (Anh, Úc…); chú ý cách giọng Úc đọc nguyên âm."},
    {"id":"-EUDydVAe7g","credit":"English Simplified — Australian Accent Listening Practice | Short English Story for Beginners 🐦‍⬛","dur":"12:33","lang":"en","note":"Truyện ngắn giọng Úc cho người mới; nghe 2 lần, lần 2 bật phụ đề để quen giọng trước khi làm bài."},
  ],
  't2d15-noi': [
    {"id":"BIrneFzd9HU","credit":"English Speaking Success — IELTS Speaking Part 2: Band 9 TEMPLATES - #4 EVENTS","dur":"22:10","lang":"en","note":"Keith O'Hare: khung trả lời Part 2 cho chủ đề sự kiện (events); dùng khung để kể một sự kiện trong 2 phút."},
    {"id":"XEEDQox-SgI","credit":"Pronunciation with Emma — The Schwa Sound: How to Pronounce the Schwa in Words and Sentences (The Complete Guide)","dur":"15:58","lang":"en","note":"Âm yếu /ə/ (schwa) trong từ và trong câu; nhại theo từng ví dụ — đúng phần âm yếu của bài."},
  ],
  't2d16-tu-vung': [
    {"id":"HXTFwnAgWmM","credit":"Mr. English Channel — English Podcast for Beginners (A2–B1) | Let's Talk About Money 💰 Easy Ways to Save & Budget","dur":"20:04","lang":"en","note":"Podcast dễ nghe (A2–B1) về tiền bạc, tiết kiệm và chi tiêu; nghe và chép các cụm về tiền."},
    {"id":"nh8r9SDmHn4","credit":"English with Cambridge — What are collocations? | English Language Learning Tips | Cambridge English","dur":"2:30","lang":"en","note":"Cambridge English giải thích collocation là gì và vì sao cần học theo cụm — đúng phần collocation mở đầu."},
  ],
  't2d16-doc': [
    {"id":"XnpsdFWhm6M","credit":"Fastrack IELTS — Master All IELTS Reading Matching Questions in One Video","dur":"28:44","lang":"en","note":"Fastrack giảng các dạng Matching trong Reading; tập trung phần Matching information (đoạn nào chứa thông tin)."},
    {"id":"paYa8OXC0t8","credit":"The Forum  — Hướng dẫn kỹ thuật xử lý hiệu quả dạng bài Matching Information | THE FORUM CENTER","dur":"3:24","lang":"vi","note":"The Forum giảng tiếng Việt kỹ thuật làm Matching information."},
  ],
  't2d16-viet': [
    {"id":"bgO-qjK3l2A","credit":"Write to the Top — IELTS Academic Task 1 Writing: Tables","dur":"10:53","lang":"en","note":"Hướng dẫn viết Task 1 dạng bảng (table): đọc bảng, nhóm số liệu, viết overview."},
    {"id":"95kMPpp3muY","credit":"Lilie IELTS — 3 tips for *grouping* and *selecting* data in an ielts writing task 1 table","dur":"11:38","lang":"en","note":"Lilie: 3 mẹo nhóm và chọn số nổi bật trong bảng — đúng phần \"chọn số nổi bật\" của bài."},
  ],
  't2d17-ngu-phap': [
    {"id":"OsWmxQfyG8k","credit":"Oxford Online English — IELTS Writing - Using Linking Words and Phrases to Improve Your Score","dur":"21:40","lang":"en","note":"Oxford Online English: dùng từ nối trong IELTS Writing đúng chỗ và không lạm dụng; dừng làm các câu luyện."},
    {"id":"nLxL-O7OzWY","credit":"Interactive English — Vocabulary - however, nevertheless, nonetheless, in addition, moreover, furthermore","dur":"11:53","lang":"en","note":"Phân biệt however, nevertheless, in addition, moreover, furthermore (nghĩa và dấu câu)."},
  ],
  't2d17-nghe': [
    {"id":"mll-NB-G10U","credit":"Derek Callan - English for Professionals — 14 Ways to Agree And Disagree - Business English Meetings","dur":"6:10","lang":"en","note":"14 cách đồng ý và phản đối trong cuộc họp; ghi lại để nhận ra khi nghe Part 3."},
    {"id":"yxw77hO0Gmc","credit":"Derek Callan - English for Professionals — 28 Advanced Phrases For Meetings - Business English Meetings","dur":"8:33","lang":"en","note":"28 cụm dùng trong họp (nêu ý kiến, chốt việc, phân công); nghe và nhắc lại."},
  ],
  't2d17-noi': [
    {"id":"rnJCKda4oWU","credit":"Oxford Online English — Sentence Stress in English Pronunciation","dur":"13:24","lang":"en","note":"Oxford Online English giảng trọng âm câu: nhấn từ mang nội dung, đọc lướt từ chức năng; nhại theo ví dụ."},
    {"id":"_P7_69FeqnU","credit":"Pronunciation with Emma — Sentence Stress and Intonation in English (The Complete Guide)","dur":"13:58","lang":"en","note":"Emma giảng trọng âm câu và ngữ điệu; tập đọc to câu nêu ý kiến theo đúng nhịp."},
  ],
  't2d18-tu-vung': [
    {"id":"IIcVZsxA-nk","credit":"Write to the Top — IELTS TOEFL Vocabulary: The News Media","dur":"18:34","lang":"en","note":"Từ vựng học thuật chủ đề truyền thông và tin tức (news media); chép các cụm dùng được cho Task 2."},
    {"id":"Y5cC5mKErsg","credit":"IELTS Plus — IELTS English Podcast - Speaking Topic: Advertising","dur":"11:30","lang":"en","note":"Podcast IELTS chủ đề Advertising: nghe từ vựng quảng cáo trong câu trả lời Speaking."},
  ],
  't2d18-doc': [
    {"id":"FSkhLB3tSTg","credit":"E2 IELTS — IELTS Reading METHODS: Match Sentence Endings","dur":"10:02","lang":"en","note":"E2 IELTS chỉ cách làm Matching sentence endings (đoán ngữ pháp, tìm vị trí trong bài)."},
    {"id":"fOfq9UngwD0","credit":"IELTS Thanh Loan — Cách làm dạng Matching Sentence Endings IELTS Reading cho người mới bắt đầu| IELTS Thanh Loan","dur":"24:06","lang":"vi","note":"Cô Thanh Loan giảng tiếng Việt dạng Matching sentence endings cho người mới bắt đầu."},
  ],
  't2d18-viet': [
    {"id":"9Cp2al4nf98","credit":"Fastrack IELTS — Ace Your IELTS Writing Task 2: Sample Essay with Two Direct Questions","dur":"14:13","lang":"en","note":"Bài mẫu Task 2 dạng hai câu hỏi trực tiếp: trả lời đủ cả hai câu, mỗi câu một đoạn."},
    {"id":"pX3N4fMr5aE","credit":"Học IELTS Writing không khó cùng IELTS Thanh Loan — Bài 21: Cách trả lời dạng TWO-PART QUESTION trong IELTS Writing Task 2 band 7.0+| IELTS Thanh Loan","dur":"15:51","lang":"vi","note":"Cô Thanh Loan giảng tiếng Việt cách trả lời dạng Two-part question."},
  ],
  't2d19-ngu-phap': [
    {"id":"CzoxIVPtPgI","credit":"BBC Learning English — Indirect Questions - 6 Minute Grammar","dur":"6:11","lang":"en","note":"BBC 6 Minute Grammar giảng câu hỏi gián tiếp (Could you tell me where…?) — chú ý trật tự từ."},
    {"id":"zNUhMBmPbTU","credit":"English with Lucy — Question Tags | Easily Speak Like a Native!*","dur":"6:35","lang":"en","note":"Lucy giảng question tags (isn't it?, don't you?) và ngữ điệu khi hỏi."},
  ],
  't2d19-nghe': [
    {"id":"VqXvVOeWHRs","credit":"English Pro Tips - IELTS Preparation — Best Strategy + Practice | IELTS Listening - Note Completion Questions","dur":"19:44","lang":"en","note":"Chiến thuật Note completion trong Listening kèm luyện tập — dạng chính của Part 4."},
    {"id":"whqUiPHqYRU","credit":"Asad Yaqub IELTS — 4 SUPER DUPER TIPS FOR IELTS LISTENING Part 4 By Asad Yaqub","dur":"19:15","lang":"en","note":"4 mẹo làm Listening Part 4 (bài giảng một người nói); nghe phần mẹo, rồi áp dụng vào bài."},
  ],
  't2d19-noi': [
    {"id":"xie82EzXJL8","credit":"English Speaking Success — IELTS Speaking Part 2: Band 9 TEMPLATES - #5 ACTIVITIES","dur":"18:29","lang":"en","note":"Keith O'Hare: khung trả lời Part 2 cho chủ đề hoạt động (activities); dùng khung để tự nói 2 phút."},
    {"id":"TejnbgBDcF0","credit":"IELTS with Charles — Band 8.0 Speaking Part 2: Describe an activity you enjoy doing alone in your free time","dur":"4:33","lang":"vi","note":"Thầy Charles phân tích bài mẫu \"Describe an activity you enjoy doing alone in your free time\"."},
  ],
  't2d20-tu-vung': [
    {"id":"QHOmj2TO4mM","credit":"Oxford Online English — Talk About Sports in English - Improve Spoken English Conversation","dur":"13:39","lang":"en","note":"Oxford Online English: nói về thể thao bằng tiếng Anh (play / go / do, các cụm thường dùng)."},
    {"id":"CCARtG5fklM","credit":"Learn English with Cambridge — English vocabulary for talking about sport | Learn English with Cambridge","dur":"8:15","lang":"en","note":"Cambridge English: từ vựng nói về thể thao; ghi các cụm dùng được cho Speaking."},
  ],
  't2d20-doc': [
    {"id":"vasdA8N77-I","credit":"IELTS with Juva — IELTS Reading YES NO NOT GIVEN Tips and Practice Test | BEST Strategy","dur":"11:42","lang":"en","note":"Chiến thuật Yes / No / Not Given (quan điểm tác giả) kèm bài luyện."},
    {"id":"ZCv_P0ndO6A","credit":"The Forum  — Phân biệt Yes/No/Not Given trong IELTS READING | THE FORUM CENTER","dur":"4:10","lang":"vi","note":"The Forum phân biệt Yes/No/Not Given với True/False/Not Given bằng tiếng Việt."},
  ],
  't2d20-viet': [
    {"id":"q9evxl9hCg8","credit":"Lilie IELTS — How to Describe a Process Diagram [IELTS Writing Task 1 Band 9 Guide]","dur":"12:29","lang":"en","note":"Lilie hướng dẫn mô tả process diagram: câu bị động, từ chỉ trình tự, overview."},
    {"id":"MWAA57dKgyc","credit":"English Pro Tips - IELTS Preparation — IELTS Task 1 Masterclass - Process Diagrams","dur":"12:39","lang":"en","note":"Bài giảng trọn dạng Process diagram Task 1; xem để đối chiếu với bài mẫu band 5 của bài học."},
  ],
  't2d21-ngu-phap': [
    {"id":"yZeCWdZeKUk","credit":"Learn English with Bob the Canadian — How to Talk about the Past with \"Used To\" and \"Would\"","dur":"5:12","lang":"en","note":"Bob giải thích used to và would để nói thói quen trong quá khứ (would không dùng cho trạng thái)."},
    {"id":"Dpsu_XSwX4k","credit":"SandJ English — Past Progressive \"was/were + -ing\" + \"when/while\" (English Grammar)","dur":"6:56","lang":"en","note":"Quá khứ tiếp diễn was/were + V-ing với when / while; tự đặt 3 câu theo mẫu."},
  ],
  't2d21-nghe': [
    {"id":"jJwyAetqMWQ","credit":"AcademicEnglishHelp — IELTS Listening Practice Test with Answers Parts 3 and 4 2022","dur":"13:32","lang":"en","note":"Bài nghe thử Part 3 và Part 4 có đáp án; làm đúng giờ, không dừng, rồi tự chấm."},
  ],
  't2d21-noi': [
    {"id":"_qmB8v4Jlek","credit":"IELTS buddy — IELTS Speaking Part 3: Comparing the past with the present","dur":"3:40","lang":"en","note":"Cách trả lời câu Part 3 so sánh quá khứ và hiện tại (in the past…, nowadays…)."},
    {"id":"fzegwutPz60","credit":"English Pro Tips - IELTS Preparation — How to Answer ANY IELTS Speaking Part 3 Question","dur":"23:13","lang":"en","note":"Cách trả lời mọi câu hỏi Part 3; xem phần so sánh và phần nêu lý do."},
  ],
  't2d22-tu-vung': [
    {"id":"PGs6Bl4hWfE","credit":"Write to the Top — IELTS TOEFL Academic Vocabulary: Family","dur":"15:51","lang":"en","note":"Từ vựng học thuật chủ đề Gia đình (family structure, generation gap…)."},
    {"id":"MxNP-i4sQP8","credit":"Fastrack IELTS — IELTS Speaking Part 1  | FAMILY | Sample answers and vocabulary","dur":"8:12","lang":"en","note":"Câu mẫu Part 1 chủ đề Family kèm từ vựng; nghe rồi tự trả lời."},
  ],
  't2d22-doc': [
    {"id":"mFBac4vmXAA","credit":"IELTS with Juva — IELTS Reading Diagram Label Completion Tips and Practice Test | STEP-BY-STEP Explanations","dur":"13:01","lang":"en","note":"Diagram label completion từng bước kèm bài luyện; làm trước khi xem giải thích."},
    {"id":"f9FxdzQfH-I","credit":"IELTS Nguyễn Huyền — IELTS READING - DIAGRAM LABELLING","dur":"7:50","lang":"vi","note":"Cô Huyền giảng tiếng Việt cách làm Diagram labelling khi vốn từ còn hạn chế."},
  ],
  't2d22-viet': [
    {"id":"XU5sMqd2eP0","credit":"E2 IELTS — IELTS Academic Writing Task 1 Maps","dur":"14:23","lang":"en","note":"E2 IELTS hướng dẫn Task 1 dạng bản đồ: so sánh trước / sau, bị động quá khứ."},
    {"id":"2tjSJwDM0vI","credit":"The Forum  — Hướng dẫn viết các dạng Map trong IELTS Writing Task 1 cùng anh Huy 9.0 IELTS | THE FORUM CENTER","dur":"12:05","lang":"vi","note":"The Forum giảng tiếng Việt các dạng Map Task 1."},
  ],
  't2d23-ngu-phap': [
    {"id":"A30ZYDpmMZk","credit":"EnglishAcademy101 — How to Use SO SUCH TOO ENOUGH | B1 English Grammar","dur":"7:19","lang":"en","note":"Cách dùng so, such, too, enough (B1) với ví dụ rõ; dừng làm câu luyện."},
    {"id":"AgckxyJUcAE","credit":"English with Aga — SO, SUCH, SUCH A and SUCH AN in English - what's the difference and how to use them","dur":"5:41","lang":"en","note":"Phân biệt so, such, such a / such an; dùng để ôn lại."},
  ],
  't2d23-nghe': [
    {"id":"v3axTdVoYkY","credit":"E2 IELTS — IELTS Listening Practice Test with Answers","dur":"29:00","lang":"en","note":"Đề Listening đủ 4 phần có đáp án; làm như thi thật, không dừng, rồi tự chấm."},
  ],
  't2d23-noi': [
    {"id":"U1S1ihBcV9Q","credit":"IELTS Fighter — Mocktest - IELTS Speaking band 3.5-4.0| IELTS FIGHTER","dur":"9:08","lang":"en","note":"Thi thử Speaking band 3.5–4.0 của IELTS Fighter: thấy điểm yếu (câu ngắn, ngừng lâu) để tránh."},
    {"id":"v137mM7S2zM","credit":"IELTS Fighter — Mock Test - IELTS Speaking band 7.0 | IELTS FIGHTER","dur":"8:51","lang":"en","note":"Thi thử Speaking band 7.0 để so với video trên: kéo dài ý, từ nối, phát âm rõ."},
  ],
  't2d24-tu-vung': [
    {"id":"p6GotgTf6aI","credit":"IELTS Plus — IELTS English Podcast - Speaking Topic: Cities","dur":"9:41","lang":"en","note":"Podcast IELTS chủ đề Cities; nghe từ vựng thành phố trong câu trả lời thật."},
    {"id":"pYBBy8DsKvw","credit":"Tự Học IELTS — Nâng câp từ vựng IELTS Speaking - Home/Accommodation {PDF}","dur":"8:32","lang":"vi","note":"Cô Huyền giảng tiếng Việt từ vựng chủ đề Home / Accommodation."},
  ],
  't2d24-doc': [
    {"id":"ZMVkP5ZD-6U","credit":"E2 IELTS — Time Management in IELTS Reading: BEST STRATEGY","dur":"25:00","lang":"en","note":"E2 IELTS chỉ cách chia thời gian 60 phút cho 3 passage; áp dụng ngay khi làm bài đọc đủ 3 passage."},
  ],
  't2d24-viet': [
    {"id":"-fMylOUECkI","credit":"E2 IELTS — IELTS Writing: Don't Make These 7 Mistakes!","dur":"12:19","lang":"en","note":"E2 IELTS chỉ 7 lỗi Writing hay làm mất điểm; đối chiếu với 12 lỗi mất điểm oan của bài."},
    {"id":"3-QoPcJHQws","credit":"British Council | English — English for Emails: Formal and informal language","dur":"2:55","lang":"en","note":"British Council: ngôn ngữ trang trọng và thân mật trong email; đúng phần email formal / informal."},
  ],
};
