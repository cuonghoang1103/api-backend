/**
 * 🎬 Video bài giảng của khoá IELTS — hiện đầu mỗi bài (VideoBai.tsx).
 *
 * Mỗi video đã qua: oEmbed (credit = đúng `author_name — title`), trang xem
 * `playabilityStatus: OK` (loại video hội viên), `playableInEmbed`. Kiểm lại
 * cả loạt: `node scripts/yt-check.mjs <id…>`. Đổi video: sửa thẳng file này.
 */
import type { LessonVideo } from '@/components/sach-hoc/types';

export const VIDEO_BAI: Record<string, LessonVideo[]> = {
  'bat-dau': [
    {"id":"tOFm-zoI6-w","credit":"TakeIELTS Official — Understand the IELTS test format: The ultimate guide  | TakeIELTS Preparation","dur":"12:13","lang":"en","note":"Video chính thức của IELTS: giới thiệu 4 kỹ năng Nghe–Đọc–Viết–Nói, thời gian từng phần và cách tính band 0–9; xem hết, bật phụ đề nếu cần."},
    {"id":"JbTOyXSbYBA","credit":"IELTS Fighter — IELTS là gì? Cấu trúc đề thi IELTS - Thang điểm IELTS 2026| IELTS FIGHTER","dur":"9:06","lang":"vi","note":"Giải thích bằng tiếng Việt IELTS là gì, cấu trúc 4 phần thi và thang điểm; xem để chắc chắn đã hiểu video tiếng Anh ở trên."},
  ],
  'd1-ngu-phap': [
    {"id":"nvVdIJ0las0","credit":"Ellii (formerly ESL Library) — Simple Present – Grammar & Verb Tenses","dur":"4:50","lang":"en","note":"Thì hiện tại đơn qua hình minh hoạ rõ ràng: khi nào dùng, thêm -s/-es với he/she/it, câu phủ định và câu hỏi với do/does; làm luôn bài luyện ở cuối video."},
    {"id":"n6l9JFrEfF8","credit":"Mark Kulek — Subject + Verb + Object - SVO pattern (English grammar practice) | Learn English - Mark Kulek ESL","dur":"7:09","lang":"en","note":"Mẫu câu S + V + O với từng thành phần được tô màu; nghe và đọc nhại theo từng câu để quen trật tự Chủ ngữ – Động từ – Tân ngữ."},
  ],
  'd1-tu-vung': [
    {"id":"c1KFqXL0I0Q","credit":"BBC Learning English — Talking about social media: 📱👍❤️ Real Easy English","dur":"5:24","lang":"en","note":"Tiếng Anh rất dễ của BBC về thói quen dùng mạng xã hội (post, share, like, follow…); nghe các câu nói thật rồi tự nói một câu về mình."},
    {"id":"GPCHtLsh73k","credit":"Adam’s English Lessons · engVid — SOCIAL MEDIA Vocabulary in English: 30 words to learn","dur":"19:51","lang":"en","note":"Thầy Adam giảng 30 từ mạng xã hội trên bảng trắng; tập trung các từ trùng bài học (hashtag, viral, influencer, feed…), từ lạ như troll, meme có thể để sau."},
  ],
  'd1-nghe': [
    {"id":"lMb7IF356OE","credit":"Pronunciation with Emma — How to Pronounce the Alphabet in British English","dur":"4:33","lang":"en","note":"Cách đọc 26 chữ cái theo giọng Anh (giọng hay gặp trong IELTS) và các cặp dễ nhầm; nghe và đọc to theo từng chữ."},
    {"id":"Ovx8wZKxTSM","credit":"IELTS Liz — IELTS Listening: English Names","dur":"8:32","lang":"en","note":"Luyện nghe chép tên người được đánh vần như trong IELTS Listening; dừng video, tự viết tên ra giấy rồi mới xem đáp án."},
  ],
  'd1-bai-tap': [
    {"id":"pSL2fwBNh58","credit":"Woodward English — Change the Subject + Verb – Present Simple Tense – English Grammar Exercises","dur":"10:26","lang":"en","note":"Bài tập đổi chủ ngữ rồi chia lại động từ ở hiện tại đơn (I like → he likes), giúp trực tiếp phần III; dừng video trả lời từng câu trước khi xem đáp án."},
  ],
  'd2-doc': [
    {"id":"m9x9fZCBIMY","credit":"TakeIELTS Official — IELTS Academic Reading: Question types, strategies and tips  | TakeIELTS Preparation","dur":"11:24","lang":"en","note":"Video chính thức: bài Reading có 3 đoạn văn, 40 câu, 60 phút và các dạng câu hỏi; xem hết để nhận ra 8 dạng câu hỏi trong bài học."},
    {"id":"pSkjHMs9GjY","credit":"IELTS Simon — IELTS Reading: keyword technique","dur":"4:10","lang":"en","note":"Thầy Simon chỉ cách gạch từ khoá trong câu hỏi rồi dò tìm chúng trong bài đọc; đây đúng là cách làm 2 bước của bài học."},
  ],
  'd2-viet': [
    {"id":"yvt8RzGNhBc","credit":"IELTS Advantage — Understand IELTS Writing Task 2 in 5 Minutes","dur":"5:54","lang":"en","note":"Tóm tắt Writing Task 2: đề bài trông thế nào, 40 phút, tối thiểu 250 từ, và khung bài luận mở bài – thân bài – kết bài."},
    {"id":"v4aezQmTBps","credit":"TakeIELTS Official — How IELTS Writing is marked! (band score breakdown and tips)","dur":"5:27","lang":"en","note":"Video chính thức về cách chấm Writing: 4 tiêu chí (Task Response, Coherence & Cohesion, Lexical Resource, Grammar) và cách ra band; đối chiếu với mục 4–5 của bài học."},
  ],
  'd2-noi': [
    {"id":"MowXdaxK0fQ","credit":"E2 IELTS — Understand IELTS Speaking in JUST 9 Minutes!","dur":"9:00","lang":"en","note":"Thầy Jay giải thích 3 phần của bài thi Nói: Part 1 hỏi về bản thân, Part 2 nói 2 phút theo cue card, Part 3 thảo luận; xem hết."},
    {"id":"cQ-kYU3uSP0","credit":"TakeIELTS Official — IELTS Speaking mock test | TakeIELTS Preparation","dur":"14:32","lang":"en","note":"Một buổi thi Nói thử do IELTS chính thức dựng: xem giám khảo hỏi gì và thí sinh trả lời đủ 3 phần ra sao; bật phụ đề và chú ý Part 1."},
  ],
  'd2-bai-tap': [
    {"id":"KPJoKXZsqDs","credit":"IELTS Nguyễn Huyền — IELTS READING    Cach tim tu khoa Keywords","dur":"14:09","lang":"vi","note":"Cô Huyền giảng bằng tiếng Việt cách chọn từ khoá trong câu hỏi và đoán cách chúng được diễn đạt lại trong bài đọc; xem trước khi làm 5 bài tìm từ khoá."},
  ],
  'd3-ngu-phap': [
    {"id":"kmI_2wCewpU","credit":"Arnel's Everyday English — ALL PERSONAL PRONOUNS | I, me, my, mine, myself ...","dur":"17:29","lang":"en","note":"Bảng đầy đủ đại từ nhân xưng: chủ ngữ (I), tân ngữ (me), tính từ sở hữu (my), đại từ sở hữu (mine), phản thân (myself) — ứng với mục 1–4 của bài; this/that, who/which học trong bài."},
    {"id":"ZT7B4enrn50","credit":"Woodward English — Possessive Pronouns in English | Mine, Yours, His, Hers, Ours, Theirs | Learn English","dur":"9:31","lang":"en","note":"Phân biệt my và mine: mine thay cho \"my + danh từ\" để khỏi lặp từ; xem kỹ để làm mục 3 của bài."},
  ],
  'd3-tu-vung': [
    {"id":"bk-vHLWxoLY","credit":"BBC Learning English — Education: Phrasal verbs with Georgie","dur":"3:05","lang":"en","note":"Video ngắn của BBC về cụm động từ chủ đề học tập, có ví dụ trên màn hình; đối chiếu với 10 cụm động từ trong mục 2."},
    {"id":"pelaA7lp0d8","credit":"Everything English with John — Vocabulary: Phrasal Verbs for Study, Phrasal Verb Practice #englishvocabulary","dur":"13:12","lang":"en","note":"Giảng chậm 8 cụm động từ về việc học, trong đó go over, brush up (on), drop out, hand in trùng với bài; tập trung 4 cụm này."},
  ],
  'd3-nghe': [
    {"id":"JtSagQoXdZI","credit":"mmmEnglish — English Listening Practice | Story + Dictation","dur":"10:56","lang":"en","note":"Bài nghe chép có sẵn: nghe câu chuyện một lần lấy ý chính rồi chép lại từng câu — đúng 5 bước trong bài; tạm dừng sau mỗi câu để viết."},
    {"id":"874qidnsTWM","credit":"TRẦN TRINH TƯỜNG — Chép Chính Tả - Phương Pháp Luyện Nghe Hiệu Quả Được Rất Nhiều Cao Thủ IELTS Áp Dụng","dur":"8:37","lang":"vi","note":"Giải thích bằng tiếng Việt vì sao và cách luyện nghe chép chính tả từng bước; xem để hiểu phương pháp trước khi làm bài 22 chỗ trống."},
  ],
  'd3-bai-tap': [
    {"id":"boxixZkx0WU","credit":"Learn English with Rebecca · engVid — Confusing Subject & Object Pronouns: HE or HIM? I or ME? SHE AND I or HER AND I...?","dur":"15:25","lang":"en","note":"Cô Rebecca chỉ cách chọn I hay me, he hay him theo vị trí trong câu (trước động từ = chủ ngữ, sau động từ/giới từ = tân ngữ) — giúp thẳng phần III; làm theo các câu ví dụ trên bảng."},
  ],
  'd4-doc': [
    {"id":"VMElU-C6DnA","credit":"E2 IELTS — Master IELTS Reading Sentence Completion with These Expert Tips!","dur":"12:07","lang":"en","note":"Cô Natasha (E2) làm mẫu dạng Sentence Completion từng bước: gạch từ khoá, đoán loại từ cần điền, tìm chỗ paraphrase và giữ đúng giới hạn số từ — xem hết, đúng các bước trong bài."},
  ],
  'd4-viet': [
    {"id":"1IVFRWCpNxE","credit":"IELTS Advantage — IELTS Writing Task 1 Introductions [+ Free Task 1 PDF]","dur":"13:21","lang":"en","note":"Cách viết câu mở bài Task 1 bằng cách paraphrase đề (đổi từ, đổi cấu trúc) — tập trung phần ví dụ viết lại câu đề, bỏ qua đoạn quảng cáo khoá học."},
    {"id":"zjzuxyVlkR8","credit":"IELTS Liz — IELTS Writing Task 1: Conclusion or Overview","dur":"4:01","lang":"en","note":"Video ngắn giải thích vì sao Task 1 cần Overview (tóm xu hướng chính, không số liệu) chứ không phải kết luận — khớp đúng mục \"Overview là đoạn quan trọng nhất\"."},
  ],
  'd4-noi': [
    {"id":"OyPvI_NxZU8","credit":"E2 IELTS — IELTS Speaking Part 1 - Questions with Jay & Alex","dur":"16:48","lang":"en","note":"Jay và Alex trả lời mẫu các câu hỏi Part 1 (nhiều câu dạng Yes/No): chú ý cách họ trả lời thẳng rồi thêm lý do/ví dụ thay vì chỉ nói \"Yes\" — có thể bật phụ đề."},
    {"id":"C2c0zG47k3k","credit":"English with Liz — How to Pronounce Monophthongs - Vowel Sounds - British English RP Accent","dur":"10:25","lang":"en","note":"Luyện 12 nguyên âm đơn giọng Anh-Anh (cặp ngắn–dài như /ɪ/–/iː/, /ʊ/–/uː/) cho phần Phát âm của bài — nhìn khẩu hình và nói theo từng âm."},
  ],
  'd4-bai-tap': [
    {"id":"E0jCDsWoM1A","credit":"IELTS Liz — IELTS Speaking Part 1: Common Questions","dur":"7:15","lang":"en","note":"15 kiểu câu hỏi Part 1 lặp đi lặp lại (Do you like…? Do you often…? …) — xem để nhận ra khung câu hỏi trước khi làm bài điền từ cho câu trả lời mẫu."},
  ],
  'd5-ngu-phap': [
    {"id":"bhgzqbv9Rxk","credit":"English with Emma · engVid — English for Beginners: Countable & Uncountable Nouns","dur":"22:17","lang":"en","note":"Bài cho người mới: vì sao nói \"a dollar\" mà không nói \"a money\", khi nào thêm -s, dùng a/an/some/any và much/many — xem hết, cô Emma nói chậm và viết bảng rõ."},
    {"id":"YsagocS1wGo","credit":"Learn English with Rebecca · engVid — English Grammar Tricks - Countable & Uncountable Nouns","dur":"5:58","lang":"en","note":"Video ngắn ôn lại các lỗi kinh điển \"a furniture\", \"much books\" — xem sau bài chính để tự kiểm tra."},
  ],
  'd5-tu-vung': [
    {"id":"50ogY2R0suk","credit":"Business English Benjamin · engVid — Working from Home: Vocabulary, Phrases, and more","dur":"13:22","lang":"en","note":"Từ vựng và cụm từ về làm việc tại nhà — tập trung phần đầu (từ, cụm từ trên bảng); phần bàn về thế hệ millennials sau đó chỉ để luyện nghe thêm."},
    {"id":"8E8DQnmd4zs","credit":"BBC Learning English — Flexible working - 6 Minute English","dur":"6:17","lang":"en","note":"Hai người dẫn BBC trò chuyện về làm việc linh hoạt/từ xa và giải thích từ mới cuối chương trình — luyện nghe từ vựng chủ đề trong ngữ cảnh thật, nên bật phụ đề."},
  ],
  'd5-nghe': [
    {"id":"tMiyzuO1qMs","credit":"BBC Ideas — What multitasking does to your brain | BBC Ideas","dur":"3:17","lang":"en","note":"Hoạt hình ngắn cùng chủ đề bài nghe (đa nhiệm và bộ não) — nghe trước để nắm từ khoá như multitask, attention, switch rồi mới làm Practice 1."},
  ],
  'd5-bai-tap': [
    {"id":"ZrQJaLemaoE","credit":"Learn English with Bob the Canadian — 12 Phrasal Verbs You Can Use At Work: An English Lesson","dur":"8:18","lang":"en","note":"Bob giải thích chậm, có ví dụ, các cụm động từ dùng ở chỗ làm — xem để quen cách dùng cụm động từ trước khi làm Bài II (dịch câu dùng cụm động từ)."},
  ],
  'd6-doc': [
    {"id":"YglvhY4VHIw","credit":"IELTS Fighter — IELTS Reading TIPS:  Completing Tables and Flow Charts","dur":"15:03","lang":"vi","note":"Cô giáo giảng bằng tiếng Việt cách làm dạng điền bảng và sơ đồ quy trình (flow-chart): đọc theo thứ tự các bước, đoán loại từ, đúng giới hạn số từ — tập trung phần flow-chart."},
    {"id":"WcEBCIrXFak","credit":"IELTSMaterial - IELTS Preparation & Study Abroad — IELTS Reading Flow Chart Completion Practice Questions & Answers","dur":"8:37","lang":"en","note":"Một bài flow-chart luyện tập có giải đáp án — tự làm trước khi xem lời giải, chú ý cách đáp án theo đúng thứ tự trong đoạn văn."},
  ],
  'd6-viet': [
    {"id":"YngqHl_BLOU","credit":"IELTS Liz — IELTS Writing Task 2: How to write an introduction","dur":"17:38","lang":"en","note":"Bài trọn vẹn về mở bài Task 2 cho dạng Opinion: câu nền (paraphrase đề) + câu thesis nêu quan điểm — xem hết, đúng hai việc bài học yêu cầu."},
    {"id":"SpAIW4p8wkw","credit":"IELTS Liz — IELTS Writing Task 2 Tips: Expressing your Opinion","dur":"6:15","lang":"en","note":"Cách nêu quan điểm trong bài luận (có được dùng \"I\", \"my\" không, câu nào nên dùng) — giúp viết câu thesis cho đúng giọng văn."},
  ],
  'd6-noi': [
    {"id":"VV21y_AGL6Y","credit":"IELTS Liz — IELTS speaking part 1: What's your favourite...?","dur":"6:00","lang":"en","note":"Cách phát triển câu trả lời cho một câu hỏi Wh- hay gặp ở Part 1: trả lời thẳng rồi thêm lý do, chi tiết — áp dụng y như vậy cho câu hỏi về thói quen và gia đình."},
    {"id":"vL1iGL11Jzg","credit":"mmmEnglish — Pronunciation Practice 👄 Difficult Vowel Sounds [DIPHTHONGS]","dur":"9:28","lang":"en","note":"Luyện các nhị trùng âm (diphthongs) cho phần Phát âm của bài: nhìn khẩu hình cô Emma, nói theo, chú ý lướt từ âm đầu sang âm sau."},
  ],
  'd6-bai-tap': [
    {"id":"kvLWEYLvzYU","credit":"Oxford Online English — IELTS Essay - How to Write an Introduction (Using Paraphrasing)","dur":"15:25","lang":"en","note":"Cách paraphrase đề để viết mở bài và lỗi số một người học hay mắc — giúp đúng kỹ năng của bài tập (điền chỗ trống ở câu paraphrase và câu thesis)."},
  ],
};
