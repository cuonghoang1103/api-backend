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
  // ── Ngày 7–15 (soạn 12/11/2026). Mỗi ID đã qua: yt-check (oEmbed, credit = đúng `author_name — title`),
  //    trang xem `playabilityStatus: OK` + `playableInEmbed: true`. Không trùng ID đã có trong videos.ts, không ID nào dùng hai lần.
  'd7-ngu-phap': [
    {"id":"1N1MpESNE6o","credit":"BBC Learning English — Adjectives and adverbs - 6 Minute Grammar","dur":"6:17","lang":"en","note":"Catherine và Finn của BBC giải thích tính từ (mô tả danh từ) khác trạng từ (mô tả động từ) thế nào, các trạng từ không theo luật -ly như well, fast, hard, và có câu đố cuối bài — xem trước mục 1, 4 và 6."},
    {"id":"4J9vt7dbdvs","credit":"Adam’s English Lessons · engVid — Bored or Boring? Learn about -ED and -ING adjectives in English","dur":"5:27","lang":"en","note":"Thầy Adam phân biệt tính từ đuôi -ed (người cảm thấy: bored) và -ing (thứ gây ra cảm giác: boring) trên bảng trắng — đúng mục 3 của bài; nói to từng cặp theo thầy."},
  ],
  'd7-tu-vung': [
    {"id":"s1HxJVusR2w","credit":"BBC Learning English — What is the future of work? ⏲️ 6 Minute English","dur":"6:22","lang":"en","note":"Neil và Beth bàn về tương lai của công việc sau Covid (làm từ xa, làm kết hợp, công việc biến mất?) và giải thích từ mới cuối chương trình — nghe để gặp lại từ chủ đề Remote Work trong ngữ cảnh thật; bật phụ đề."},
    {"id":"7FJNBRuwbPU","credit":"BBC Learning English — Work: Phrasal verbs with Georgie","dur":"2:54","lang":"en","note":"Video ngắn của BBC về cụm động từ chủ đề công việc kèm mẹo khi nào tách được cụm động từ bằng tân ngữ — xem trước mục 2 (10 cụm động từ) để quen cách dùng."},
  ],
  'd7-nghe': [
    {"id":"3Gj2EGaLbrk","credit":"E2 IELTS — IELTS Listening Form Completion with Alex","dur":"10:21","lang":"en","note":"Thầy Alex (E2) làm mẫu một bài điền phiếu Listening Part 1: đọc phiếu trước, đoán loại thông tin, nghe bẫy sửa lời — tự làm cùng video rồi so đáp án, đúng 6 bước trong bài."},
    {"id":"HYp08TMG5uw","credit":"IELTS Liz — IELTS Listening: Problems with numbers","dur":"5:59","lang":"en","note":"Bài kiểm tra ngắn của IELTS Liz về các cặp số dễ nhầm như 15/50, 16/60 và cách đọc đúng trọng âm — làm cùng video trước phần Luyện phát âm -teen / -ty cuối bài."},
  ],
  'd7-bai-tap': [
    {"id":"13TLUMw6og0","credit":"Woodward English — Comparative and Superlative Adjectives - English Grammar Lesson","dur":"11:07","lang":"en","note":"Bảng quy tắc so sánh hơn – so sánh nhất (cheaper / the cheapest, more useful / the most useful, good → better → best) kèm ví dụ — xem trước Bài II và III, nơi có câu chia dạng so sánh."},
  ],
  'd8-doc': [
    {"id":"VAbZ6jiXXtI","credit":"IELTS Jacky — IELTS Reading – How To Answer Table Completion Questions","dur":"17:06","lang":"en","note":"Thầy Jacky làm mẫu dạng Table Completion từng bước: đọc tiêu đề hàng/cột, đoán loại từ cho mỗi ô, dò vị trí trong bài và giữ đúng giới hạn số từ — khớp 6 bước của bài."},
    {"id":"_Ryw_hSTNSU","credit":"The Forum  — Xử lý dạng bài Điền Từ trong IELTS Reading | THE FORUM CENTER","dur":"5:33","lang":"vi","note":"Thầy Huy (The Forum) giảng bằng tiếng Việt cách xử lý các dạng điền từ của Reading (bảng, ghi chú, câu) — xem nếu chưa chắc cách đoán loại từ và chép đúng từ trong bài."},
  ],
  'd8-viet': [
    {"id":"suu0KfL7jzs","credit":"IELTS Liz — IELTS Writing Tips: How to Put Examples in Your Essay","dur":"6:29","lang":"en","note":"Cách đưa ví dụ vào đoạn thân bài Task 2 (For example, For instance, such as…) và ví dụ nên cụ thể đến mức nào — đúng mục 5 \"Ví dụ\" của bài."},
    {"id":"d33KtQP7QNo","credit":"Học IELTS Writing không khó cùng IELTS Thanh Loan — Bài 7: Cách viết Thân Bài | Body Paragraphs trong hay IELTS Writing Task 2 (P1)| IELTS Thanh Loan","dur":"26:18","lang":"vi","note":"Cô Thanh Loan giảng bằng tiếng Việt bố cục một đoạn thân bài Task 2 (câu chủ đề → giải thích → ví dụ) — xem để chắc cấu trúc 3 phần trước khi tự viết đoạn văn."},
  ],
  'd8-noi': [
    {"id":"hoyhPZDp3dE","credit":"Oxford Online English — How to Talk About Your Free Time and Hobbies in English - Spoken English Lesson","dur":"9:10","lang":"en","note":"Bài nói về thời gian rảnh và sở thích: hỏi – trả lời về sở thích, nói vì sao thích, nói mức độ thường xuyên — nghe và nhại theo các câu mẫu rồi áp vào khung trả lời của bài."},
    {"id":"rgWse3tloTw","credit":"BBC Learning English — 👄 Consonant /ŋ/ in 'rung', 'anger' and 'thanks' - English Pronunciation Tips","dur":"2:13","lang":"en","note":"Cách phát âm âm mũi /ŋ/ và phân biệt với /n/ — luyện cho mục 7 (âm /ŋ/ cuối -ing); nhìn khẩu hình và đọc to theo."},
  ],
  'd8-bai-tap': [
    {"id":"wZkOnS7ja7o","credit":"Simple English Videos — Sports and the verbs 'play' 'go' and 'do': Learn English with Simple English Videos","dur":"6:30","lang":"en","note":"Môn nào đi với play, môn nào với go, môn nào với do, kèm tên nhiều môn thể thao — xem trước Bài IV (play / do / go + V-ing)."},
  ],
  'd9-ngu-phap': [
    {"id":"AKzG_ZS-Ydg","credit":"Ellii (formerly ESL Library) — Present Progressive – Grammar & Verb Tenses","dur":"5:01","lang":"en","note":"Thì hiện tại tiếp diễn (am / is / are + V-ing) qua hình minh hoạ: khi nào dùng, chủ ngữ nào đi với am/is/are, có bài luyện cuối video — xem trước mục 1–2."},
    {"id":"LkyCYeDdvgI","credit":"Woodward English — Past Simple Tense in English - Regular and Irregular Verbs Grammar lesson","dur":"17:43","lang":"en","note":"Quá khứ đơn đầy đủ: động từ có quy tắc (-ed), bất quy tắc, câu phủ định với did not và câu hỏi Did…? — khớp mục 5–8 của bài; có thể dừng ở từng phần để làm bài dịch tương ứng."},
  ],
  'd9-tu-vung': [
    {"id":"bqPbeYWvFt4","credit":"AcademicEnglishHelp — IELTS Speaking Band 8 - Volunteer Work","dur":"5:00","lang":"en","note":"Một buổi trả lời mẫu IELTS Speaking về chủ đề tình nguyện: nghe cách thí sinh dùng từ chủ đề và từ nối để trả lời dài, có lý do — rồi tự trả lời cùng câu hỏi bằng từ vựng của bài."},
  ],
  'd9-nghe': [
    {"id":"_HomSxvEl24","credit":"E2 IELTS — Band 9 Phrases and Vocabulary for IELTS Map Labelling","dur":"10:40","lang":"en","note":"Thầy Jay giảng các cụm chỉ đường và vị trí hay gặp trong dạng Map Labelling (opposite, next to, at the end of…) — xem trước mục 3 rồi mới làm câu 16–20."},
    {"id":"1anUzldZeNw","credit":"IELTS Nguyễn Huyền — Cách làm IELTS Listening Map Completion","dur":"19:03","lang":"vi","note":"Cô Huyền giảng bằng tiếng Việt cách làm bài bản đồ: tìm điểm bắt đầu, lần theo lời chỉ đường, nghe từ vị trí — xem nếu còn lúng túng sau video tiếng Anh."},
  ],
  'd9-bai-tap': [
    {"id":"OsW5sV3GMDM","credit":"BBC Learning English — Present Simple and Present Continuous: The Grammar Gameshow Episode 1","dur":"5:24","lang":"en","note":"Trò chơi đố vui của BBC về hiện tại đơn và hiện tại tiếp diễn — trả lời trước người chơi trong video để ôn trước Bài I và II (chọn thì theo dấu hiệu)."},
  ],
  'd10-doc': [
    {"id":"qrXRxIVZH3c","credit":"Fastrack IELTS — IELTS Reading Matching Features & Information","dur":"13:33","lang":"en","note":"Chiến thuật dạng Matching Features (và Matching Information) rồi áp dụng vào bài luyện — tập trung phần Matching Features: khoanh tên trước, đọc kỹ quanh từng tên, nhận ra từ đồng nghĩa."},
    {"id":"vrPoj_i5LB0","credit":"The Forum  — NCS TS 9.0 IELTS Reading hướng dẫn cách làm Name Matching | THE FORUM CENTER","dur":"8:42","lang":"vi","note":"Thầy Huy (The Forum) giảng bằng tiếng Việt cách làm dạng nối tên người (Name Matching — chính là Matching Features với danh sách tên) — đối chiếu với 5 bước và 3 bẫy của bài."},
  ],
  'd10-viet': [
    {"id":"3MWdwj7V594","credit":"IELTS Jacky — IELTS Writing Task 2 - How To Write a Task 2 Conclusion","dur":"9:57","lang":"en","note":"Thầy Jacky giải thích kết bài cần làm gì, cấu trúc một kết bài tốt và 4 lỗi hay gặp (thêm ý mới, chép lại mở bài…) — khớp mục 2 và 3 của bài."},
    {"id":"LIINx4rwdJ8","credit":"Học IELTS Writing không khó cùng IELTS Thanh Loan — Bài 10: Cách viết đoạn văn KẾT LUẬN trong IELTS Writing Task 2 chỉ 2 phút hiệu quả| IELTS Thanh Loan","dur":"12:17","lang":"vi","note":"Cô Thanh Loan giảng bằng tiếng Việt cách viết kết bài Task 2 nhanh: nhắc lại quan điểm + tóm tắt lý do bằng lời khác — xem trước khi viết kết bài ở mục 5."},
  ],
  'd10-noi': [
    {"id":"SqfhrDUUqWU","credit":"mmmEnglish — Adverbs of Frequency | English Grammar | Speak Clearly & Confidently","dur":"7:24","lang":"en","note":"Cô Emma dạy trạng từ tần suất (always, usually, often, sometimes, rarely, never): nghĩa, vị trí trong câu và cách đọc — đúng mục 2 của bài; nói lại câu mẫu về thói quen của chính bạn."},
    {"id":"3dA7P5arkyc","credit":"BBC Learning English — Used to - 6 Minute Grammar","dur":"6:03","lang":"en","note":"BBC giải thích used to + V để nói thói quen ngày xưa nay không còn, kèm câu phủ định và câu hỏi — xem trước mục 3; chú ý cách họ đọc used to /juːst tə/."},
  ],
  'd10-bai-tap': [
    {"id":"w-0FSBudtd0","credit":"English with Lucy — USED TO / USE TO / BE USED TO / GET USED TO / WOULD DO - English Grammar Lesson (+ Free PDF & Quiz)","dur":"11:18","lang":"en","note":"Phân biệt used to + V (ngày xưa hay làm) với be/get used to + V-ing (quen với) và would — đúng bẫy của Phần II và III; làm câu đố cuối video."},
  ],
  'd11-ngu-phap': [
    {"id":"CqRloBkyqQs","credit":"Oxford Online English — Collocations in English - Learn English Vocabulary","dur":"14:15","lang":"en","note":"Collocation là gì và các kiểu kết hợp hay gặp (động từ + danh từ, tính từ + danh từ, trạng từ + tính từ…) kèm ví dụ — khớp mục 1 và 4–7 của bài."},
    {"id":"LWigoLHN9WU","credit":"Learn English with Rebecca · engVid — Basic English Word Order: Place & Time","dur":"11:45","lang":"en","note":"Cô Rebecca giải thích vì sao nói \"I went to school at 7:00\" chứ không phải \"at 7:00 to school\": nơi chốn trước thời gian — đúng mục 2 (trật tự S – V – O – cách thức – nơi chốn – thời gian)."},
  ],
  'd11-tu-vung': [
    {"id":"JuDV1ey79eY","credit":"Woodward English — IELTS Academic Writing Task 1 | Describing Trends | IELTS Vocabulary & Word Order | Business English","dur":"29:29","lang":"en","note":"Bài đầy đủ về từ tả xu hướng cho biểu đồ đường và cột: động từ – danh từ tăng/giảm/dao động, trạng từ – tính từ mức độ và trật tự từ trong câu — video dài, xem theo từng phần ứng với mục 1–3 của bài."},
    {"id":"0d5Id6vQ7-s","credit":"Học IELTS Writing không khó cùng IELTS Thanh Loan — Bài 5: Từ vựng \"xịn\" MÔ TẢ XU HƯỚNG trong IELTS WRITING TASK 1 bạn cần biết| IELTS Thanh Loan","dur":"12:58","lang":"vi","note":"Cô Thanh Loan giảng bằng tiếng Việt bộ từ mô tả tăng, giảm, dao động, giữ nguyên trong Task 1 — xem để chắc nghĩa và cách dùng trước khi làm bài dịch tả xu hướng."},
  ],
  'd11-nghe': [
    {"id":"d6ou1eTJH3I","credit":"E2 IELTS — IELTS Listening: How to Answer Matching Questions!","dur":"19:44","lang":"en","note":"Chiến thuật dạng nối (matching) trong Listening — dạng nối người với ý kiến hay gặp ở Part 3 — có hai bài luyện kèm đáp án; tự làm trước khi xem lời giải."},
    {"id":"vpmJTSntyVw","credit":"IELTS Advantage — New Strategy For IELTS Listening Multiple Choice [+ Free Listening PDF]","dur":"11:42","lang":"en","note":"Chiến thuật trắc nghiệm Listening: các phương án đều có thể được nhắc tới, đáp án là ý được chốt — đúng cái bẫy \"nêu ý → bị phản bác → đổi ý\" của Part 3; bỏ qua đoạn quảng cáo khoá học."},
  ],
  'd11-bai-tap': [
    {"id":"CGW_NiXOJhY","credit":"Simple English Videos — Make and Do - Collocations and Fixed Expressions","dur":"4:02","lang":"en","note":"Các cụm cố định đi với make (make a mistake, make a decision…) và do (do research…) — xem trước Phần I (điền collocation make / do / take / pay…)."},
  ],
  'd12-doc': [
    {"id":"WYl9PX7Ua_Q","credit":"IELTS Liz — IELTS Reading Tips: True False Not Given","dur":"24:05","lang":"en","note":"Bài trọn vẹn của IELTS Liz về TRUE / FALSE / NOT GIVEN: phân biệt FALSE (bài nói ngược) với NOT GIVEN (bài không nói), có bài luyện và 10 lỗi hay gặp — xem hết, khớp sơ đồ 2 câu hỏi của bài."},
    {"id":"AnwBQkTyFhw","credit":"The Forum  — Hướng dẫn kỹ thuật là True/False/Not Given cùng Huy Forum","dur":"12:53","lang":"vi","note":"Thầy Huy (The Forum) giảng bằng tiếng Việt kỹ thuật làm True/False/Not Given — xem nếu vẫn nhầm FALSE với NOT GIVEN sau video tiếng Anh."},
  ],
  'd12-viet': [
    {"id":"lnL0qvcVo1Q","credit":"IELTS Advantage — IELTS Task 1 Line Graphs in 5 Simple Steps","dur":"13:59","lang":"en","note":"5 bước viết một bài Task 1 biểu đồ đường: phân tích biểu đồ, paraphrase mở bài, overview không số, hai thân bài có số liệu — đúng quy trình 20 phút của bài."},
    {"id":"fxggz2yJcmI","credit":"ZIM Academy — Cách viết Line Graph IELTS Writing Task 1 từ A-Z | Anh Ngữ ZIM","dur":"29:06","lang":"vi","note":"ZIM giảng bằng tiếng Việt cách viết bài biểu đồ đường từ A đến Z (mở bài, overview, chia thân bài, chọn số liệu) — xem để chắc cách chia nhóm thân bài trước khi tự viết."},
  ],
  'd12-noi': [
    {"id":"KaK-VDFqgHc","credit":"IELTS Liz — IELTS Speaking Part 3: Urban vs Rural Life","dur":"10:47","lang":"en","note":"IELTS Liz trả lời mẫu câu hỏi Part 3 so sánh sống ở thành phố và nông thôn: nêu quan điểm, giải thích, cho ví dụ và nói về mọi người nói chung — áp dụng đúng khung O–R–E của bài."},
    {"id":"b4Aj3k65HSo","credit":"BBC Learning English — 👄 Voiceless consonant /θ/ in 'thin’, ‘think’ & 'path’ - English Pronunciation Tips","dur":"1:23","lang":"en","note":"Cách đặt lưỡi giữa hai hàm răng để phát âm /θ/ trong think, thin, path — luyện cho mục 5; đừng đọc thành \"sink\" hay \"tink\"."},
  ],
  'd12-bai-tap': [
    {"id":"aLLTq-l0IeY","credit":"E2 IELTS — IELTS Reading Test - Tips & Strategies for True, False, Not Given","dur":"19:10","lang":"en","note":"Thầy Mark (E2) ôn chiến thuật True / False / Not Given và cho bạn tự làm câu luyện — làm cùng video trước Phần I của bài tập."},
  ],
  'd13-ngu-phap': [
    {"id":"36wG9pSYu7Q","credit":"English with Lucy — MODAL VERBS: All you need to know about CAN, COULD, MAY, MIGHT, MUST, SHOULD, SHALL, WILL and WOULD","dur":"18:51","lang":"en","note":"Toàn bộ động từ khuyết thiếu: luật modal + V nguyên mẫu, phủ định, câu hỏi, nghĩa của từng modal và cách đọc — xem hết, khớp mục 1–6 của bài."},
    {"id":"psU1junFZFA","credit":"IELTS Fighter — Unit 11: Động từ khuyết thiếu - Modal verbs và ví dụ bài tập chi tiết có đáp án chi tiết","dur":"20:34","lang":"vi","note":"Cô giáo IELTS Fighter giảng bằng tiếng Việt động từ khuyết thiếu kèm bài tập có đáp án — xem để chắc nghĩa từng modal, nhất là mustn't khác don't have to."},
  ],
  'd13-tu-vung': [
    {"id":"-XcALxwXJVY","credit":"BBC Learning English — Can apps teach you a language? ⏲️ 6 Minute English","dur":"6:15","lang":"en","note":"Neil và Pippa bàn về học ngôn ngữ bằng ứng dụng so với học trên lớp (tiện lợi, học mọi lúc, có hiệu quả không?) và giải thích từ mới cuối chương trình — nghe để lấy ý cho Ngân hàng ý ưu/nhược điểm."},
    {"id":"kHoC0hWdHDM","credit":"IELTS Fighter — IELTS Vocabulary topic Education - Từ vựng tiếng Anh chủ đề Giáo dục| IELTS FIGHTER","dur":"10:32","lang":"vi","note":"Từ vựng chủ đề Giáo dục giảng bằng tiếng Việt, dùng cho Speaking và Writing — ôn nhóm \"từ chung về học tập\" và collocation của bài."},
  ],
  'd13-nghe': [
    {"id":"aQAcJbZ7Iyg","credit":"E2 IELTS — IELTS Listening Note Completion in 2026 for Band 9 Success","dur":"16:10","lang":"en","note":"Chiến thuật dạng Note Completion (dạng chính của Part 4): đọc ghi chú trước, đoán loại từ, nghe paraphrase, đúng giới hạn số từ — xem trước Practice 1."},
    {"id":"Or1Tzn3UqV0","credit":"ABC Education — Study English - Series 3, Episode 15: Listening for Signpost Words","dur":"10:00","lang":"en","note":"Chương trình Study English (luyện IELTS) của đài ABC Úc về từ tín hiệu (signpost words) trong bài nói — đúng mục 3; bật phụ đề CC."},
  ],
  'd13-bai-tap': [
    {"id":"RrGcwoHTHus","credit":"Ellii (formerly ESL Library) — Modals of Necessity & Obligation – Grammar & Verb Tenses","dur":"8:16","lang":"en","note":"must / have to / have got to trong câu khẳng định, phủ định (mustn't khác don't have to) và câu hỏi, có bài luyện cuối video — ôn trước Phần II–IV."},
  ],
  'd14-doc': [
    {"id":"cc9SOmmUQmI","credit":"IELTS with Juva — IELTS Reading Summary Completion Tips and Practice Test | MUST-KNOW Strategy","dur":"13:38","lang":"en","note":"Cách làm Summary Completion rồi giải từng câu của một bài luyện — tự làm từng câu trước khi xem lời giải, chú ý cách đoán loại từ và tìm paraphrase."},
    {"id":"vsMpXfFNcjw","credit":"IELTS Thanh Loan — Chiến thuật làm bài SUMMARY COMPLETION để chinh phục IELTS Reading band 9.0| IELTS Thanh Loan","dur":"9:28","lang":"vi","note":"Cô Thanh Loan giảng bằng tiếng Việt chiến thuật Summary Completion — xem để chắc các bước trước khi làm bài có hộp từ."},
  ],
  'd14-viet': [
    {"id":"gCo9L1nLlQ0","credit":"IELTS Liz — IELTS Discussion Essay: Useful Academic Expressions","dur":"5:21","lang":"en","note":"Các cụm học thuật để trình bày hai quan điểm trái ngược trong bài Discussion (On the one hand… / On the other hand…, It is argued that…) — đối chiếu với khung câu mục 4–5."},
    {"id":"qGkXUD2ZKAE","credit":"ZIM Academy — Chiến lược làm dạng bài Discussion trong IELTS Writing Task 2","dur":"10:55","lang":"vi","note":"ZIM giảng bằng tiếng Việt chiến lược dạng Discuss both views: phân tích đề, bàn đủ hai quan điểm và nêu ý kiến riêng — khớp mục 2–3 (3 nhiệm vụ, dàn ý 4 đoạn)."},
  ],
  'd14-noi': [
    {"id":"wTePj4_qGLE","credit":"E2 IELTS — 2 Quick Methods for the IELTS Speaking 1-Minute Preparation Time","dur":"6:52","lang":"en","note":"Thầy Jay chỉ hai cách ghi chú nhanh trong 1 phút chuẩn bị Part 2 — so với cách ghi bằng sơ đồ ý ở mục 4, chọn cách hợp với bạn."},
    {"id":"ELoHqiOxnH8","credit":"Pronunciation with Emma — How to Pronounce 'ed' Endings in English (+ FREE PDF 📎)","dur":"12:10","lang":"en","note":"Ba cách đọc đuôi -ed (/t/, /d/, /ɪd/) và các ngoại lệ — luyện cho mục 8, rất cần khi kể chuyện quá khứ ở Part 2."},
  ],
  'd14-bai-tap': [
    {"id":"MGR0TP7ZOJM","credit":"Fastrack IELTS — Band 9 IELTS Writing Task 2 SAMPLE ANSWER | Discuss both views","dur":"12:44","lang":"en","note":"Phân tích một bài mẫu Discuss both views band cao — chú ý câu mở bài và kết bài để làm Bài V (viết mở bài + kết bài)."},
  ],
  'd15-ngu-phap': [
    {"id":"dpOzi5GSYPo","credit":"Ellii (formerly ESL Library) — The Passive Voice – Grammar & Verb Tenses","dur":"11:02","lang":"en","note":"So sánh câu chủ động và bị động, công thức be + V3 qua các thì, khi nào dùng bị động và khi nào có by… — xem hết, khớp mục 1–6 của bài."},
    {"id":"a9GnbpR96Ow","credit":"Elight Learning English — Làm chủ câu bị động (Passive Voice) trong 5 phút [Ngữ pháp tiếng Anh cơ bản - Các loại câu #6]","dur":"11:23","lang":"vi","note":"Giảng bằng tiếng Việt cách đổi câu chủ động sang bị động theo từng bước — xem nếu còn lúng túng ở mục 2 (4 bước đổi câu)."},
  ],
  'd15-tu-vung': [
    {"id":"PhVlFDNAmUQ","credit":"IELTS Liz — IELTS Writing Task 1 Map Vocabulary","dur":"9:47","lang":"en","note":"Từ vựng và mẫu câu tả vị trí và thay đổi trên bản đồ Task 1 (hướng, giới từ vị trí, động từ biến đổi) — khớp mục 1–4 của bài."},
    {"id":"vgw7B1aqH8o","credit":"IELTS Nguyễn Huyền — IELTS WRITING TASK 1 PROCESS CHO NGƯỜI MỚI BẮT ĐẦU","dur":"14:32","lang":"vi","note":"Cô Huyền giảng bằng tiếng Việt từng bước viết bài Task 1 dạng quy trình cho người mới — xem trước mục 6–8 (động từ quy trình, từ nối trình tự, bài mẫu)."},
  ],
  'd15-nghe': [
    {"id":"xqSFwO_8FnU","credit":"Pronunciation with Emma — Listening Practice (IELTS) | Telephone Numbers (Telephone English)","dur":"7:56","lang":"en","note":"Bài nghe chép số điện thoại kiểu Listening Part 1 (có oh, double…) — dừng video, viết số ra giấy rồi mới xem đáp án; đúng bẫy số 2 của bài."},
    {"id":"rgIjmos4yDE","credit":"The IELTS Coach — Listening Practice Numbers 13 or 30","dur":"3:51","lang":"en","note":"Luyện nghe phân biệt 13 / 30 (và các cặp -teen / -ty) theo trọng âm — làm cùng video trước mục 4 của bài."},
  ],
  'd15-bai-tap': [
    {"id":"LrsdF_1YNfs","credit":"IELTS Advantage — Task 1 Process Diagrams: Transform Band 6 to 9 [+ Free Task 1 PDF]","dur":"22:33","lang":"en","note":"Cách viết bài Task 1 quy trình: mở bài, overview (số bước, điểm đầu – cuối), thân bài dùng câu bị động và từ nối trình tự — xem trước Bài VI (quy trình làm nước mắm); bỏ qua đoạn quảng cáo khoá học."},
  ],
};
