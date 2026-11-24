/**
 * 🎬 Video bài giảng của IELTS Tập 3 (band 5.0 → 6.0) — khoá = id bài (`t3dN-…`), hiện đầu bài (VideoBai.tsx).
 * Cùng quy trình và định dạng với `../videos.ts` của Tập 1 (oEmbed + playabilityStatus OK + playableInEmbed;
 * kiểm cả loạt: `node scripts/yt-check.mjs <id…>`). Không dùng lại ID đã gắn ở Tập 1/2/4/5 cho cùng nội dung.
 * Bài homework / review không gắn video. Hướng dẫn chọn video: docs/video-youtube-tieng-anh.md.
 */
import type { LessonVideo } from '@/components/sach-hoc/types';

export const VIDEO_BAI_T3: Record<string, LessonVideo[]> = {
  't3d1-ngu-phap': [
    {"id":"sCiG6rlk2Bc","credit":"Brian Wiles — Learn All English Verb Tenses (Easiest Method)","dur":"8:53","lang":"en","note":"Tổng quan cả hệ thì tiếng Anh theo hai trục thời gian (quá khứ – hiện tại – tương lai) và dạng (đơn – tiếp diễn – hoàn thành); xem trước khi điền bảng 12 thì của bài, mỗi thì dừng lại tự đặt một câu về mình."},
    {"id":"p_LBYUO8Ai4","credit":"English with Lucy — Learn the Perfect Tenses Easily in 12 Minutes","dur":"11:58","lang":"en","note":"Các thì hoàn thành trong 12 phút: hiện tại hoàn thành tiếp diễn (have been V-ing) và quá khứ hoàn thành (had V3) — đúng hai điểm chính của bài; chép lại câu ví dụ mốc trước – sau vào sổ."},
  ],
  't3d1-doc': [
    {"id":"ojvgT62XtpY","credit":"Fastrack IELTS — Proven IELTS Reading Techniques to Read Faster","dur":"10:13","lang":"en","note":"Kỹ thuật đọc nhanh cho IELTS Reading: lướt bố cục trước, đọc câu hỏi rồi mới đọc kỹ — khớp bước skim 3 phút + gạch từ khoá của bài; làm theo trên một passage thật."},
    {"id":"0FYsVVXmMZM","credit":"English Lessons with Dori — IELTS READING: How to recognise paraphrasing!","dur":"8:13","lang":"en","note":"Cách nhận ra paraphrase trong một đoạn đọc thật bằng thay đồng nghĩa và đổi cấu trúc — luyện 4 mức paraphrase của bài; dừng video tự viết lại câu trước khi xem."},
  ],
  't3d1-nghe': [
    {"id":"66aG5P0kQpU","credit":"English with Lucy — ONE language, THREE accents - UK vs. USA vs. AUS English! (+ Free PDF)","dur":"20:12","lang":"en","note":"So sánh giọng Anh – Mỹ – Úc qua cùng một câu: nguyên âm, chữ r, cách đọc số; bật phụ đề lần đầu, lần hai tắt phụ đề và đoán người nói là giọng nào."},
  ],
  't3d2-tu-vung': [
    {"id":"RiUTWwdhMDg","credit":"English with Alex · engVid — IELTS & TOEFL Academic Vocabulary - Nouns (AWL)","dur":"7:27","lang":"en","note":"Danh từ học thuật hay gặp (aspect, indication, trend…) thuộc Academic Word List; chép họ từ (danh – động – tính) của mỗi từ giống cách học sublist 3 trong bài."},
    {"id":"BKsZ0snCRs4","credit":"English Vocabulary With Tiffani — TOPICAL ENGLISH VOCABULARY | ENGLISH WORDS ABOUT EDUCATION","dur":"15:43","lang":"en","note":"Từ vựng chủ đề Giáo dục (vòng 2) với câu ví dụ; chọn 10 từ chưa có trong thẻ của bài, đặt câu dùng cho Speaking Part 3 / Task 2."},
  ],
  't3d2-viet': [
    {"id":"psnTcr04uNY","credit":"IELTS Understood — Why This IELTS Writing Task 2 Essay Got Band 6 (And Not Higher)","dur":"18:35","lang":"en","note":"Phân tích một bài Task 2 được band 6: từng đoạn mạnh/yếu ở đâu và vì sao không lên 7 (xem đoạn 16:09 phần chấm điểm) — đúng tinh thần tự chấm theo descriptors của bài."},
    {"id":"ou09VS5aI-E","credit":"Write to the Top — IELTS Writing: How an Essay Is Scored (band 6.5)","dur":"15:24","lang":"en","note":"Một bài luận được chấm theo bốn tiêu chí (TR, CC, LR, GRA) ra band 6.5; dùng cách chấm này để tự chấm bài của mình và ghi lỗi vào sổ lỗi."},
  ],
  't3d2-noi': [
    {"id":"owNwjiGd-RU","credit":"IELTS by IDP — IELTS Speaking: Bands 5 to 8 - Fluency and Coherence","dur":"6:01","lang":"en","note":"Video chính thức IDP so sánh thí sinh band 5 đến band 8 ở tiêu chí Fluency & Coherence (Part 3); nghe và ghi lại điểm khác nhau giữa band 5 và band 6."},
    {"id":"GV9BKyDJlks","credit":"IELTS Official — IELTS Speaking test sample - Part 3 (Maxim, Band 6)","dur":"5:00","lang":"en","note":"Bài nói mẫu chính thức band 6 kèm nhận xét giám khảo (Part 3, chủ đề Hobbies); đọc phần nhận xét trong mô tả video rồi so với bài nói của mình."},
  ],
  't3d3-ngu-phap': [
    {"id":"azrYbrC-xXg","credit":"Adam’s English Lessons · engVid — English Grammar: When NOT to use an article – 9 rules","dur":"18:39","lang":"en","note":"9 trường hợp KHÔNG dùng mạo từ (zero article) — nhóm lỗi band 6 hay sót; dừng ở mỗi quy tắc tự viết một câu đúng và một câu sai để so."},
    {"id":"oW7L46mVJEc","credit":"Learn English | Let's Talk - Free English Lessons — 5 Advanced Rules to use Articles (an, an, the) correctly | Mistakes with Articles | English Grammar","dur":"11:15","lang":"en","note":"5 quy tắc nâng cao dùng a/an/the và lỗi thường gặp với the + danh từ chung; làm lại các ví dụ trong video trước khi làm bài tập của bài."},
  ],
  't3d3-doc': [
    {"id":"FcKNgCmLSm4","credit":"IELTS with Juva — IELTS Reading TRUE, FALSE, NOT GIVEN Tips that INSTANTLY Improve Your Score","dur":"8:39","lang":"en","note":"Mẹo phân biệt True / False / Not Given nhanh và chắc (ôn vòng 3); áp dụng ngay cho bài đọc trong bài, nhất là câu NOT GIVEN."},
    {"id":"TCAHxYJzdCA","credit":"IELTS with Elvira Malik — IELTS Reading Paraphrasing Examples - Part 01","dur":"4:19","lang":"en","note":"Ví dụ paraphrase trong IELTS Reading (câu hỏi ↔ câu trong bài) — ôn nhanh 8 phép paraphrase của bài; tự tìm cặp tương ứng trước khi video chỉ ra."},
  ],
  't3d3-noi': [
    {"id":"5DW-KqQU2gI","credit":"IELTS Speaking for Success — Answers, vocabulary and grammar | IELTS Speaking Part 1 | Weather 🌦️","dur":"15:38","lang":"en","note":"Speaking Part 1 chủ đề Weather: câu trả lời mẫu, từ vựng và ngữ pháp; nghe một câu, dừng, tự trả lời câu đó theo khung 2–3 câu của bài."},
    {"id":"mV_CEIroJs8","credit":"BBC Learning English — 👄 Tim's pronunciation workshop: Consonant - vowel linking","dur":"2:42","lang":"en","note":"BBC: nối âm phụ âm + nguyên âm (consonant–vowel linking) — đúng phần nối âm của bài; đọc to theo từng câu mẫu."},
  ],
  't3d4-tu-vung': [
    {"id":"ZaPL39N_GTg","credit":"TED-IELTS — Crime and Punishment Vocabulary for IELTS Students","dur":"13:04","lang":"en","note":"Từ vựng Crime and Punishment cho học viên IELTS; nghe lần hai và chép những collocation trùng với thẻ từ của bài."},
    {"id":"gplH-yaAHcQ","credit":"IELTS Plus — IELTS English Podcast - Speaking Topic: Crime & Punishment","dur":"11:24","lang":"en","note":"Podcast IELTS chủ đề Crime & Punishment: câu hỏi Speaking và trả lời mẫu; nghe kèm phụ đề, chép cụm về hình phạt và phòng chống tội phạm."},
  ],
  't3d4-viet': [
    {"id":"A6_0QjlNJqk","credit":"Fastrack IELTS — Complete Guide to IELTS Academic Writing Task 1","dur":"21:58","lang":"en","note":"Hướng dẫn trọn Task 1 Academic của Fastrack: mở bài, overview chọn đặc điểm chính, nhóm số liệu ở thân bài; xem kỹ phần overview."},
    {"id":"HtHNd8_G4F8","credit":"Tự Học IELTS — Cách viết Overview cho TẤT CẢ CÁC DẠNG BÀI trong IELTS Writing Task 1","dur":"7:58","lang":"vi","note":"Cách viết Overview cho mọi dạng Task 1 (giảng tiếng Việt): chọn 2 điểm nổi bật, không đưa số liệu — đúng trọng tâm bài."},
  ],
  't3d4-nghe': [
    {"id":"AkW0IeF46cA","credit":"IELTS Liz — IELTS Listening Tips: Multiple Choice","dur":"23:20","lang":"en","note":"IELTS Liz: chiến thuật Listening Multiple choice — đọc trước câu hỏi, cảnh giác đáp án bị nhắc tới rồi bị loại; luyện cùng các câu ví dụ trong video."},
    {"id":"FQ1T-Nm1cGA","credit":"Fastrack IELTS — New IELTS Listening MAP Strategy & Practice (for Band 9)","dur":"16:56","lang":"en","note":"Chiến thuật Map labelling: định hướng bản đồ, từ chỉ vị trí, đi theo đường người nói tả; làm phần luyện tập trong video trước khi nghe bài của bài học."},
  ],
  't3d5-ngu-phap': [
    {"id":"BG-20HkLQzo","credit":"Speak Confident English — Future Continuous and Future Perfect Explained | Advanced English Grammar","dur":"19:33","lang":"en","note":"Tương lai tiếp diễn và tương lai hoàn thành giải thích từng bước kèm ví dụ; ghi lại mốc \"by 2030\" dùng với will have V3."},
    {"id":"8kB46Gqtixw","credit":"IELTS ASMR — FUTURE Task 1 IELTS - Từ Vựng & Ngữ Pháp","dur":"9:26","lang":"vi","note":"Viết số liệu dự đoán (năm tương lai) trong Task 1: từ vựng và ngữ pháp — đúng phần \"dự báo trong Task 1\" của bài (giảng bằng tiếng Việt)."},
  ],
  't3d5-doc': [
    {"id":"ETOdOzk0wGM","credit":"English Pro Tips - IELTS Preparation — IELTS Reading Matching Headings | Best Strategy + Practice","dur":"20:43","lang":"en","note":"Matching headings: tìm ý chính đoạn, phân biệt ý chính với chi tiết; làm phần luyện tập trong video, dừng trước khi xem đáp án."},
  ],
  't3d5-nghe': [
    {"id":"VYeBYn970a8","credit":"English with Lucy — How to read ALL NUMBERS in English - BIG NUMBERS, Decimals, Dates, Fractions, Phones, Ordinals","dur":"20:27","lang":"en","note":"Cách đọc MỌI loại số: số lớn, thập phân, phân số, ngày tháng, năm — đúng trọng tâm bài; nghe và đọc to theo, rồi tự chép số khi tắt phụ đề."},
    {"id":"WcRAuT_b7ZA","credit":"The IELTS Coach — IELTS Listening Practice Numbers 2","dur":"4:09","lang":"en","note":"Bài luyện nghe số kiểu IELTS; dừng video và tự viết số ra giấy trước khi xem đáp án."},
  ],
  't3d6-tu-vung': [
    {"id":"h2jBsmGKwLs","credit":"Adam’s English Lessons · engVid — Vocabulary: Talking about POLITICS in English","dur":"8:34","lang":"en","note":"engVid: từ vựng nói về chính trị (government, policy, election…); chép các từ dùng được cho đề Task 2 về chi tiêu công."},
    {"id":"dGnju-_KyYE","credit":"Adam’s English Lessons · engVid — Political Vocabulary in English: 21 Common Terms","dur":"17:45","lang":"en","note":"21 thuật ngữ chính trị thông dụng giải thích trên bảng; chọn những từ trùng thẻ Government & public spending của bài để ôn."},
  ],
  't3d6-viet': [
    {"id":"dBaWLSgXH2U","credit":"English Pro Tips - IELTS Preparation — How to write an Agree-Disagree Essay for IELTS","dur":"12:43","lang":"en","note":"Cách viết bài Agree / Disagree (opinion essay) từ mở bài có thesis đến thân bài; đối chiếu với cách viết thesis \"có mức độ\" của bài."},
    {"id":"edLuMiCUzlQ","credit":"Lilie IELTS — how to fully address all parts of the question/ielts task 2 to what extent do you agree or disagree","dur":"9:47","lang":"en","note":"Trả lời đủ mọi phần của đề \"To what extent do you agree or disagree\" — lỗi hay làm mất điểm Task Response ở band 6; soát lại dàn ý của mình sau khi xem."},
  ],
  't3d6-noi': [
    {"id":"o0EvovjnGuQ","credit":"English Speaking Success — 5 Tips to Improve Your IELTS Speaking Part 3 Answers","dur":"28:40","lang":"en","note":"5 mẹo phát triển câu trả lời Part 3 (lý do, ví dụ, so sánh…); tập trung phần lý do + ví dụ cho câu hỏi \"Why…?\" của bài."},
    {"id":"boTGzmYJv0w","credit":"IELTS with Charles — The ONLY IELTS Speaking Part 3 Framework You Need","dur":"5:16","lang":"en","note":"Một khung trả lời Part 3 ngắn gọn; tập trả lời 3 câu \"Why do you think…?\" của bài theo khung này, ghi âm lại."},
  ],
  't3d7-ngu-phap': [
    {"id":"gqtmM3bVMaE","credit":"English with Greg — 🔥 EXPLAINED! When to use the Infinitive and Gerund After Verbs","dur":"10:14","lang":"en","note":"Động từ + to V hay V-ing: nhóm động từ và quy tắc nhớ; dừng ở mỗi nhóm tự đặt câu."},
    {"id":"eFlQAEd_AKA","credit":"English with Lucy — I am BORED or I am BORING? | Use -ED vs -ING Adjectives Correctly!","dur":"10:12","lang":"en","note":"Tính từ -ed và -ing (bored / boring…) và lỗi hay gặp; làm phần quiz trong video."},
  ],
  't3d7-doc': [
    {"id":"fOq14hqIhng","credit":"IELTS Nguyễn Huyền — IELTS READING SHORT ANSWER QUESTIONS","dur":"12:12","lang":"vi","note":"Giảng bằng tiếng Việt cách làm Short answer questions; xem nếu còn nhầm giới hạn từ hoặc chép sai dạng từ."},
    {"id":"v_oQTT08czc","credit":"IELTS Whiz — IELTS Reading – Short answer questions","dur":"2:48","lang":"en","note":"Tóm tắt ngắn dạng Short-answer questions trong Reading: đọc kỹ giới hạn số từ, tìm từ khoá; xem trước khi làm bài."},
  ],
  't3d7-noi': [
    {"id":"UGCYjjObu2A","credit":"IELTS Official — IELTS Speaking test sample - Part 2 (Michal, Band 6.5)","dur":"3:11","lang":"en","note":"Bài nói mẫu chính thức band 6.5 Part 2 \"A well-known person\" kèm nhận xét giám khảo; nghe cách sắp xếp ý rồi đọc nhận xét trong mô tả video."},
    {"id":"Hrk-cvJyAuo","credit":"English Speaking Success — IELTS Speaking Part 2: Band 9 TEMPLATES - #2. PEOPLE","dur":"14:17","lang":"en","note":"Khung trả lời Part 2 cho mọi đề tả người; dùng khung này soạn bài \"người có ảnh hưởng tới bạn\" và nói thử 2 phút."},
  ],
  't3d8-tu-vung': [
    {"id":"wZ_c6SLbv6A","credit":"IELTS Plus — IELTS English Podcast - Speaking Topic: Buildings","dur":"10:29","lang":"en","note":"Podcast IELTS chủ đề Buildings (kiến trúc, nhà cao tầng, công trình cũ – mới); nghe kèm phụ đề, chép collocation về kiến trúc."},
    {"id":"BmH722JfWVU","credit":"English Speaking Success — IELTS Speaking Topic - Home and Accommodation","dur":"19:06","lang":"en","note":"Chủ đề Home & Accommodation trong IELTS Speaking với từ vựng và câu mẫu; ôn các từ về nhà ở trùng thẻ của bài."},
  ],
  't3d8-viet': [
    {"id":"mTDjuQ-G31I","credit":"Fastrack IELTS — The KEY to IELTS Academic Writing Task 1: LINE GRAPH","dur":"18:06","lang":"en","note":"Cách viết Task 1 line graph: nhóm các đường, chọn đặc điểm cho overview, mô tả giao cắt; áp dụng cho đề có đường tổng của bài."},
    {"id":"JxgA-qqw2m8","credit":"IELTS Liz — IELTS Line Graph: 4 Main Complex Sentence Stuctures","dur":"7:33","lang":"en","note":"IELTS Liz: 4 cấu trúc câu phức để mô tả line graph — tăng điểm GRA; chép 4 khung câu và viết lại 2 câu trong bài của mình."},
  ],
  't3d8-nghe': [
    {"id":"yaO7JMcWbj8","credit":"Ross IELTS Academy — IELTS Listening Matching Questions – Solve Live Without Losing Marks","dur":"3:22","lang":"en","note":"Giải trực tiếp một bài Matching trong Listening, cách không mất điểm khi người nói nhắc nhiều lựa chọn; xem rồi áp vào Part 3 của bài."},
  ],
  't3d9-ngu-phap': [
    {"id":"EgxMPbpY-Nc","credit":"Learn English with Rebecca · engVid — Master English ADJECTIVES + PREPOSITIONS","dur":"14:48","lang":"en","note":"Tính từ + giới từ (interested in, responsible for…) — đúng phần giới từ phụ thuộc của bài; tự che giới từ trong ví dụ và đoán trước khi nghe."},
    {"id":"k_vfm81eYD0","credit":"Khan Academy — Using context clues to determine the meaning of a word | Reading | Khan Academy","dur":"3:30","lang":"en","note":"Khan Academy: dùng manh mối ngữ cảnh để đoán nghĩa từ mới — phần \"đoán nghĩa từ ngữ cảnh\" của bài; xem ngắn rồi luyện với bài đọc."},
  ],
  't3d9-doc': [
    {"id":"BN6gONH8oRI","credit":"IELTS Fighter — Unit 6 IELTS Reading online - Bí kíp ăn điểm SENTENCE COMPLETION| IELTS FIGHTER","dur":"25:26","lang":"vi","note":"Bí kíp Sentence completion (giảng tiếng Việt) cho vòng 3 của dạng này; xem phần chiến thuật, phần chữa đề có thể tua nhanh."},
    {"id":"zF4UsF-E6Q8","credit":"IELTS Jacky — IELTS Reading – How To Answer Summary Completion Questions","dur":"15:00","lang":"en","note":"IELTS Jacky: cách làm Summary completion (có và không có hộp từ) — đoán loại từ, tìm vùng thông tin; áp dụng cho phần Summary có hộp từ của bài."},
  ],
  't3d9-nghe': [
    {"id":"XdRkvJN2lwY","credit":"Nbyula - Study & Work Abroad — Common Distractors in the IELTS Listening Section | IELTS Full Course Playlist","dur":"7:23","lang":"en","note":"Các kiểu bẫy (distractor) trong IELTS Listening: người nói đổi ý, nhắc nhiều đáp án gần nhau — đúng trọng tâm bài; ghi lại từ báo hiệu đổi ý (actually, no wait…)."},
  ],
  't3d10-tu-vung': [
    {"id":"CF7N7S9Hg8s","credit":"IELTS Speaking for Success — Answers and vocabulary for SCIENCE 🧬 | IELTS Speaking Part 1 (2022)","dur":"14:24","lang":"en","note":"Speaking Part 1 chủ đề Science: câu trả lời mẫu và từ vựng; chép cụm từ về nghiên cứu, thí nghiệm dùng được cho Part 3 / Task 2."},
    {"id":"hhmNNs47PMo","credit":"BBC Learning English — Searching for life on another planet ⏲️ 6 Minute English","dur":"6:14","lang":"en","note":"BBC 6 Minute English: tìm sự sống trên hành tinh khác — nghe từ vựng vũ trụ trong ngữ cảnh; bật phụ đề, ghi 6 từ chủ chốt cuối video."},
  ],
  't3d10-viet': [
    {"id":"v6kYss_Mp-g","credit":"Lilie IELTS — *how* and *where* to give your opinion in discuss both these views//ielts writing task 2","dur":"13:08","lang":"en","note":"Đưa ý kiến ở đâu và thế nào trong dạng \"Discuss both views and give your opinion\"; đối chiếu với bố cục hai thân bài cân đối của bài."},
    {"id":"ejgRreTxE_w","credit":"Học IELTS Writing không khó cùng IELTS Thanh Loan — Bài 14: IELTS Writing Task 2 dạng Discuss Both Views and Give Your Opinion| IELTS Thanh Loan","dur":"20:22","lang":"vi","note":"Dạng Discuss both views and give your opinion giảng bằng tiếng Việt, có dàn ý và bài mẫu; xem để chắc đã hiểu yêu cầu đề."},
  ],
  't3d10-noi': [
    {"id":"TpbKE3mEmZE","credit":"Phoenix English — Agreeing - Disagreeing - Partly agreeing | Learning English phrases for better speaking","dur":"6:27","lang":"en","note":"Cụm câu đồng ý, không đồng ý và đồng ý một phần (partly agreeing); đọc to theo để luyện ngữ điệu nhượng bộ."},
    {"id":"l84qrIxphBY","credit":"Adam’s English Lessons · engVid — 20 Two-Word Expressions to Agree & Disagree in English","dur":"10:15","lang":"en","note":"engVid: 20 cụm hai từ để đồng ý / không đồng ý (fair enough, not exactly…); ghi các cụm đồng ý một phần dùng cho câu hỏi \"Do you agree that…?\"."},
  ],
  't3d11-ngu-phap': [
    {"id":"ipLl73dKdw8","credit":"Học IELTS Writing không khó cùng IELTS Thanh Loan — Bài 13: SO SÁNH HƠN trong IELTS WRITING TASK 1 đa dạng ngữ pháp, siêu chi tiết| IELTS Thanh Loan","dur":"16:33","lang":"vi","note":"Các cấu trúc so sánh dùng trong Writing Task 1 (giảng tiếng Việt): so sánh hơn, gấp nhiều lần, phân số… — khớp bài so sánh nâng cao cho Task 1."},
    {"id":"CpGz0hlaVTU","credit":"English Speaking 360 — THE MORE, THE BETTER / THE LESS, THE BETTER Comparative Correlatives   ADVANCED ENGLISH GRAMMAR","dur":"11:34","lang":"en","note":"Cấu trúc \"the more…, the more…\" (comparative correlatives) với nhiều ví dụ; tự viết 3 câu về số liệu hoặc xã hội theo mẫu."},
  ],
  't3d11-doc': [
    {"id":"XuRfzG7zRzE","credit":"E2 IELTS — IELTS Reading: Multiple Choice PRACTICE QUESTIONS with Jay!","dur":"9:12","lang":"en","note":"E2: phân tích một câu Multiple choice thật trong Reading, cách loại từng đáp án sai — đúng kỹ năng loại ba đáp án của bài."},
  ],
  't3d11-noi': [
    {"id":"2d858oKdkK4","credit":"splendidspeaking — IELTS Speaking: Improve your Fluency with Fillers","dur":"4:58","lang":"en","note":"Dùng cụm đệm (fillers) để giữ mạch khi nói Part 3 thay vì im lặng; tập các cụm trong video cùng chunks của bài."},
    {"id":"TGun4KJhGZU","credit":"English Pro Tips - IELTS Preparation — 10 Essential Phrases for IELTS Speaking","dur":"7:29","lang":"en","note":"10 cụm câu thiết yếu cho IELTS Speaking (mở đầu ý, nêu ví dụ, kết ý); đọc theo và đưa vào sổ chunks."},
  ],
  't3d12-tu-vung': [
    {"id":"oDxNH1dpkoo","credit":"IELTS Plus — IELTS English Podcast - Speaking Topic: History","dur":"11:19","lang":"en","note":"Podcast IELTS chủ đề History: câu hỏi Speaking và trả lời mẫu; chép các cụm về lịch sử, bảo tồn di sản."},
  ],
  't3d12-viet': [
    {"id":"dR5Muw6D5kQ","credit":"Fastrack IELTS — Step-by-Step Guide to IELTS Academic Writing Task 1 (BAR Chart)","dur":"16:30","lang":"en","note":"Hướng dẫn từng bước Task 1 bar chart: nhóm số liệu, chọn so sánh cho overview; áp dụng cho đề nhiều nhóm không có trục thời gian của bài."},
    {"id":"4-nStiezRLA","credit":"English Pro Tips - IELTS Preparation — IELTS Academic Task 1 Masterclass | Bar Graphs","dur":"17:51","lang":"en","note":"Masterclass bar graph Task 1 với bài mẫu; chú ý phần so sánh giữa các nhóm và cách xử lý hai biểu đồ cột."},
  ],
  't3d12-nghe': [
    {"id":"3RJmdolWhjs","credit":"IELTS Energy TV — CLIPS! Understand New Zealand Accents for IELTS: IELTS Energy 1102","dur":"4:37","lang":"en","note":"Nghe quen giọng New Zealand cho IELTS (nguyên âm đặc trưng); nghe hai lần, lần hai tắt phụ đề."},
    {"id":"-aBW-RHtcrE","credit":"IELTS Advantage — Band 9 Strategy for IELTS Listening Maps [+ Free Listening PDF]","dur":"30:35","lang":"en","note":"Chiến thuật Map labelling kèm bài luyện (vòng 3); xem phần chiến thuật đầu, phần luyện tập dừng lại tự làm trước khi xem đáp án."},
  ],
  't3d13-ngu-phap': [
    {"id":"CmqOXaSUpFo","credit":"Oxford Online English — How to Use the Passive Voice in English - English Grammar Lesson","dur":"14:06","lang":"en","note":"Câu bị động ở mọi thì và với động từ khuyết thiếu, khi nào nên dùng bị động; làm lại các ví dụ chuyển chủ động → bị động."},
    {"id":"nkAyggAM1q4","credit":"mmmEnglish — How to use the Passive Voice 😅 English Grammar Lesson","dur":"14:30","lang":"en","note":"mmmEnglish: cách dùng bị động, kể cả câu có tân ngữ kép và by + tác nhân; ghi các ví dụ dùng được cho Task 1 process."},
  ],
  't3d13-doc': [
    {"id":"kPVypFj4O6w","credit":"IELTS with Juva — Multiple Choice Questions Strategy IELTS Reading for EASY BAND 9","dur":"21:36","lang":"en","note":"Chiến thuật Multiple choice trong Reading kèm bài luyện; áp dụng cho cả dạng chọn TWO / THREE đáp án của bài — mỗi đáp án phải có bằng chứng riêng."},
  ],
  't3d14-tu-vung': [
    {"id":"nyk-6Vwm6LI","credit":"IELTS By Verbalist — Work Related Vocabulary for IELTS | Less Common Words and Idioms related to Work, Employment and Job","dur":"20:19","lang":"en","note":"Từ vựng và thành ngữ về công việc, việc làm (ít phổ biến hơn) cho IELTS; chép những từ về quyền lợi lao động, điều kiện làm việc."},
    {"id":"c5UrjfguQV4","credit":"IELTS with Fiona — IELTS Vocabulary: How to use the Academic Word List (AWL) for IELTS preparation","dur":"11:17","lang":"en","note":"Cách dùng Academic Word List khi luyện IELTS: tìm danh sách, học theo họ từ, đưa vào Task 2 — hỗ trợ học AWL sublist 5 của bài."},
  ],
  't3d14-viet': [
    {"id":"c_iMuGaIXd8","credit":"Lilie IELTS — what does OUTWEIGH mean in *do the advantages OUTWEIGH the disadvantages*//ielts writing task 2","dur":"13:30","lang":"en","note":"\"Outweigh\" nghĩa là gì và trả lời dạng \"Do the advantages outweigh the disadvantages?\" cho đúng — đúng trọng tâm bài; xem trước khi lập dàn ý."},
    {"id":"XDED0m6yRq0","credit":"ZIM Academy — Chiến lược làm dạng bài Advantage & Disadvantage trong IELTS Writing Task 2","dur":"12:11","lang":"vi","note":"Chiến lược dạng Advantage & Disadvantage trong Task 2 (giảng tiếng Việt): bố cục và cách trả lời đề \"outweigh\"."},
  ],
  't3d14-noi': [
    {"id":"eW3BPSrEhyE","credit":"EnglishTestStore — IELTS Speaking Part 2 - Describe a public park or natural area you enjoy visiting","dur":"6:02","lang":"en","note":"Part 2 mẫu: \"Describe a public park or natural area you enjoy visiting\"; nghe cách đi qua từng gợi ý của cue card, rồi tự nói 2 phút về một nơi công cộng."},
  ],
  't3d15-ngu-phap': [
    {"id":"vXp0ETWXbWo","credit":"English with Lucy — THE CONDITIONALS - 0,1,2 & 3 Conditionals& QUIZ - English Grammar Lesson (+ Free PDF & Quiz)","dur":"10:58","lang":"en","note":"Câu điều kiện 0, 1, 2, 3 kèm quiz; tập trung loại 2 và 3 của bài, làm quiz cuối video."},
    {"id":"B6Si3Op79Sw","credit":"SMASH English - Cambridge English Exam Preparation — I WISH & IF ONLY (wishes and regrets) - English Grammar for B2 First (FCE)","dur":"7:10","lang":"en","note":"I wish và If only để nói ước muốn và hối tiếc (hiện tại, quá khứ); dừng ở mỗi mẫu tự viết một câu về bản thân."},
  ],
  't3d15-doc': [
    {"id":"EvKwziifIVM","credit":"IELTS with Juva — IELTS Reading Table Completion Practice Test | MUST-KNOW Tips","dur":"16:49","lang":"en","note":"Table completion trong Reading kèm bài luyện; dừng làm trước khi xem lời giải, chú ý giới hạn số từ."},
    {"id":"lJv8umQDtCA","credit":"Ross IELTS Academy — Band 9 Tips for Table Completion in the IELTS Reading Test - General and Academic","dur":"9:00","lang":"en","note":"Mẹo Table completion: đọc tiêu đề hàng/cột để đoán loại thông tin cần điền; ôn nhanh trước bài đọc của bài."},
  ],
  't3d15-noi': [
    {"id":"6j815ujOq7k","credit":"Clear English Academy with Keenyn Rhodes — How to Pronounce Past Modal Contractions: HAVE","dur":"9:33","lang":"en","note":"Cách đọc nối would've, could've, should've, might've — đúng phần nối âm của bài; đọc to theo từng câu mẫu."},
  ],
  't3d16-tu-vung': [
    {"id":"jjHrmSyew8M","credit":"English Speaking Success — 20 Essential English Phrases to talk about The Economy","dur":"17:03","lang":"en","note":"20 cụm diễn đạt về kinh tế (economic growth, recession…) cho IELTS; chép cụm dùng được cho chủ đề Business & globalisation."},
    {"id":"rE6IesKI_t0","credit":"IELTS Mastery with Nash Akthar — IELTS Vocabulary. Useful words and phrases related to \"Globalisation\"","dur":"4:54","lang":"en","note":"Từ và cụm từ chủ đề Globalisation cho IELTS; xem nhanh, ghi các collocation vào thẻ từ của bài."},
  ],
  't3d16-viet': [
    {"id":"G0EgpM35sNQ","credit":"English Pro Tips - IELTS Preparation — IELTS Academic Task 1 | Pie Charts Made Easy","dur":"16:37","lang":"en","note":"Task 1 pie chart từng bước: nhóm phần trăm, so sánh giữa các biểu đồ tròn; áp dụng cho đề hai pie theo năm của bài."},
    {"id":"bNnQEExqxfw","credit":"Lilie IELTS — easiest way to *compare* 3 pie charts - ielts writing task 1","dur":"10:11","lang":"en","note":"Cách so sánh 3 biểu đồ tròn trong Task 1 — hợp phần 3–4 pie (nước × năm) của bài."},
  ],
  't3d16-nghe': [
    {"id":"ZonAqBmUF30","credit":"Fastrack IELTS — Get Better at IELTS Listening in 11 Minutes","dur":"11:17","lang":"en","note":"Các kỹ thuật Listening giúp theo kịp khi chỉ được nghe một lần (đọc trước, đoán đáp án, theo dấu hiệu chuyển câu); xem trước khi làm đề nhỏ không tua của bài."},
  ],
  't3d17-ngu-phap': [
    {"id":"a_mFlafGyy8","credit":"Oxford English Now — Defining and Non-Defining Relative Clauses - English Grammar Lesson","dur":"12:52","lang":"en","note":"Mệnh đề quan hệ xác định và không xác định (dấu phẩy, which/who); làm lại ví dụ thêm mệnh đề không xác định vào câu."},
    {"id":"W-lgmBwBOpE","credit":"Oxford English Now — Reduced Relative Clauses - Defining and Non- Defining  Relative Clauses - Advanced Grammar Lesson","dur":"11:27","lang":"en","note":"Rút gọn mệnh đề quan hệ bằng V-ing / V-ed — đúng phần rút gọn của bài; tự rút gọn các câu ví dụ trước khi xem đáp án."},
  ],
  't3d17-doc': [
    {"id":"o5WclFL8mjg","credit":"IELTS with Ralph — How to Master IELTS Reading Flow Charts (Band +8 Tips)","dur":"9:46","lang":"en","note":"Phương pháp làm Flow-chart completion trong Reading: hiểu logic quy trình, tìm nhanh vùng đáp án; dùng cùng bài đọc quy trình của bài."},
    {"id":"-auLt9_llAI","credit":"IELTS Jacky — IELTS Reading – How To Answer Diagram Labelling Questions","dur":"13:21","lang":"en","note":"IELTS Jacky: cách làm Diagram labelling trong Reading; chú ý giới hạn từ và từ chỉ vị trí trên hình."},
  ],
  't3d17-nghe': [
    {"id":"fHdv4JEF-n8","credit":"Luyện Thi IELTS LangGo — IELTS LISTENING: Các bước làm bài nghe Flow Chart cực chi tiết - IELTS LangGo","dur":"5:09","lang":"vi","note":"Hướng dẫn Flow-chart completion trong Listening (giảng tiếng Việt): đọc trước các bước, đoán loại từ cần điền."},
    {"id":"ua-y0OEha1Y","credit":"IELTS with Juva — IELTS Listening Multiple Choice Questions | BEST Strategy and Practice","dur":"11:44","lang":"en","note":"Chiến thuật Listening Multiple choice kèm luyện tập, gồm cách xử lý câu chọn HAI đáp án; dừng tự làm trước khi xem đáp án."},
  ],
  't3d18-tu-vung': [
    {"id":"APUx2YN7sH4","credit":"English with Lucy — How to describe personality and character in English (with pronunciation)","dur":"15:56","lang":"en","note":"English with Lucy: mô tả tính cách và phẩm chất bằng tiếng Anh, có phát âm; chép tính từ tính cách trùng thẻ Personality của bài."},
    {"id":"0TNG3uPcey0","credit":"BBC Learning English — Friendships: Phrasal verbs with Georgie","dur":"2:25","lang":"en","note":"BBC: phrasal verbs về tình bạn (get on with, fall out…) — bổ sung cho kho 150 cụm động từ của bài."},
  ],
  't3d18-viet': [
    {"id":"DIa0UFn2Svw","credit":"Luyện Thi IELTS LangGo — Tuyệt Chiêu Ăn Điểm IELTS Writing Task 2: Problems & Solutions ||Luyện thi IELTS online hiệu quả","dur":"9:51","lang":"vi","note":"Cách viết dạng Problems & Solutions trong Task 2 (giảng tiếng Việt), bố cục và câu mẫu."},
    {"id":"SNEiynRLDfo","credit":"IELTS Charlie — IELTS Writing Task 2: Sample Problem Solution Essay","dur":"20:38","lang":"en","note":"Phân tích một bài mẫu Problem – solution: mỗi vấn đề đi với giải pháp tương ứng; đọc theo và đánh dấu câu nối vấn đề – giải pháp."},
  ],
  't3d18-noi': [
    {"id":"-AOQl94ZYn8","credit":"Learn English with Bob the Canadian — Common Questions You'll Be Asked During An English Job Interview","dur":"12:58","lang":"en","note":"Những câu hỏi thường gặp trong buổi phỏng vấn xin việc bằng tiếng Anh và cách trả lời; dừng sau mỗi câu hỏi tự trả lời như Part 1."},
    {"id":"-JNjsOX0N0c","credit":"Rachel's English — English Job Interview Dos & Dont's! | English Conversation Practice","dur":"35:13","lang":"en","note":"Rachel's English: nên và không nên trong phỏng vấn xin việc, có đoạn phỏng vấn mẫu — dùng cho phần \"nghe một buổi phỏng vấn mẫu\" của bài; xem phần phỏng vấn mẫu là đủ."},
  ],
  't3d19-ngu-phap': [
    {"id":"eplQBhE0-Hg","credit":"English with Lucy — REPORTED SPEECH in English - Indirect Speech | Reported Speech | Direct Speech (+ Free PDF & Quiz)","dur":"7:37","lang":"en","note":"Câu tường thuật: lùi thì, đổi đại từ, câu hỏi và mệnh lệnh; làm quiz cuối video."},
    {"id":"Pu_3OgQxe2s","credit":"BBC Learning English — 6 Minute Vocabulary: How to use English reporting verbs like 'insist', 'demand' and 'advise'","dur":"6:17","lang":"en","note":"BBC 6 Minute Vocabulary: động từ tường thuật như insist, demand, advise và cấu trúc theo sau — đúng phần động từ tường thuật học thuật của bài."},
  ],
  't3d19-doc': [
    {"id":"A0u2IGNmAcQ","credit":"BestMyTest — IELTS Academic Reading -  Matching Information","dur":"29:11","lang":"en","note":"Bài giảng Matching information: đoạn nào chứa ví dụ, lý do, mô tả… cách quét tìm chi tiết; xem phần chiến thuật, phần luyện tập dừng tự làm."},
  ],
  't3d19-noi': [
    {"id":"VzA9tW7xAr8","credit":"IELTS with Charles — IELTS Speaking Part 3: How to impress the examiner (Giving other opinions) | Band 6.5+","dur":"5:51","lang":"en","note":"Part 3: nêu ý kiến người khác (\"Some people say…\") rồi đưa ý của mình — đúng kỹ năng thuật lại ý người khác của bài."},
    {"id":"9QMjG7wIjhI","credit":"IELTS by IDP — IELTS Speaking Test Video Series Part 3","dur":"6:55","lang":"en","note":"Video IDP: buổi luyện Part 3 (thảo luận hai chiều) kèm lời khuyên; quan sát cách thí sinh mở rộng ý khi nói về quan điểm của người khác."},
  ],
  't3d20-tu-vung': [
    {"id":"0zFjJAZH5mA","credit":"Write to the Top — IELTS  TOEFL Academic Vocabulary: Transportation & Travel","dur":"14:41","lang":"en","note":"Từ vựng học thuật chủ đề Giao thông & Du lịch cho IELTS/TOEFL; chép collocation về giao thông công cộng, ùn tắc, hạ tầng."},
    {"id":"Fxi4uYmCrPo","credit":"BBC Learning English — Talking about public transport 🚌🚈🚋 Real Easy English","dur":"5:38","lang":"en","note":"BBC Real Easy English: nói về giao thông công cộng qua hội thoại thật; nghe và nhại lại các câu ngắn."},
  ],
  't3d20-viet': [
    {"id":"I4wOYAoAf9Q","credit":"IELTS ASMR — Dynamic Table Chart không còn khó | ASMR Task 1 Writing","dur":"12:58","lang":"vi","note":"Cách phân tích và viết bảng có số liệu thay đổi theo thời gian trong Task 1 (giảng tiếng Việt); áp dụng cho bảng hai chiều có hàng/cột Total của bài."},
    {"id":"EnhN9hwTD1M","credit":"ZIM Academy — Cách viết dạng Table IELTS Writing Task 1 | Anh Ngữ ZIM","dur":"16:17","lang":"vi","note":"Cách viết dạng Table Task 1 (giảng tiếng Việt): chọn và nhóm số liệu cho overview; xem nếu còn liệt kê số liệu theo từng ô."},
  ],
  't3d20-nghe': [
    {"id":"qTRbeyHR_4o","credit":"IELTS Jacky — IELTS Listening – Sentence Completion Questions","dur":"11:02","lang":"en","note":"IELTS Jacky: cách làm Sentence completion trong Listening — đoán loại từ, nghe paraphrase, giới hạn từ; luyện trước phần Part 3 của bài."},
  ],
  't3d21-ngu-phap': [
    {"id":"ZYd3whIRpik","credit":"Arnel's Everyday English — IN SPITE OF | DESPITE | ALTHOUGH | EVEN THOUGH | THOUGH - improve your grammar","dur":"7:25","lang":"en","note":"Although / even though / despite / in spite of: cấu trúc theo sau khác nhau; tự viết lại câu đổi qua lại giữa although và despite."},
    {"id":"Iinar3iM8NE","credit":"English with Emma · engVid — Learn English: Cause & Effect – so, since, hence, due to, as a result...","dur":"12:13","lang":"en","note":"engVid: từ nối nguyên nhân – kết quả (due to, as a result, hence…); ghi cấu trúc due to + danh từ khác because + mệnh đề."},
  ],
  't3d21-nghe': [
    {"id":"kvF4hR4tvqc","credit":"TakeIELTS Official — IELTS Listening: Topics and practice questions  | TakeIELTS Preparation","dur":"27:19","lang":"en","note":"Video chính thức TakeIELTS: bốn phần của bài Listening, chủ đề và dạng câu hỏi, kèm câu hỏi luyện tập — xem trước khi làm đề đủ 40 câu của bài."},
    {"id":"exh3VAKXZ88","credit":"Chau Khanh Linh — IELTS 9.0 LISTENING✨ 7 Tips Ăn Liền + Lời Khuyên Lâu Dài","dur":"9:52","lang":"vi","note":"7 mẹo làm Listening và lời khuyên luyện lâu dài (tiếng Việt); xem sau khi chấm đề để chọn mẹo sửa đúng lỗi của mình."},
  ],
  't3d22-tu-vung': [
    {"id":"1QaTfmDe2FI","credit":"IELTS Plus — IELTS English Podcast - Speaking Topic: Nature and Wildlife","dur":"11:14","lang":"en","note":"Podcast IELTS chủ đề Nature & Wildlife; nghe kèm phụ đề, chép cụm về bảo tồn động vật và đa dạng sinh học."},
    {"id":"IPITs7xuKX0","credit":"IELTS Energy TV — Fantastic 8+ IELTS Vocabulary for Animals","dur":"6:03","lang":"en","note":"Từ vựng band cao về động vật cho IELTS; chọn những từ trùng thẻ Animals & biodiversity của bài để ôn."},
  ],
  't3d22-viet': [
    {"id":"wJdfD1EHTq0","credit":"Smash Exams (IELTS) — IELTS double question essay / direct question essay :Full Guide","dur":"20:50","lang":"en","note":"Hướng dẫn đầy đủ dạng double / direct question essay: bố cục, trả lời từng câu hỏi rõ ràng; dùng làm checklist trước khi viết."},
    {"id":"eAOtAglgHsQ","credit":"ZIM Academy — Chiến lược làm dạng bài Two-part question trong IELTS Writing Task 2","dur":"7:58","lang":"en","note":"Chiến lược làm dạng Two-part questions trong Task 2: trả lời đủ từng câu hỏi, mỗi câu một đoạn — đúng việc \"đếm đủ vế\" của bài."},
  ],
  't3d22-noi': [
    {"id":"ELlWdOgnRvY","credit":"IELTS with Charles — IELTS Speaking Part 2: Topic - Events (Brand New Part 2 Technique!) | Band 7+","dur":"8:17","lang":"en","note":"Part 2 chủ đề Events: một kỹ thuật kể sự kiện theo trình tự thời gian; tập kể lại một sự kiện quá khứ của mình theo cách này."},
  ],
  't3d23-ngu-phap': [
    {"id":"9SrEEPt4MQA","credit":"Adam’s English Lessons · engVid — Advanced English Grammar: Noun Clauses","dur":"18:30","lang":"en","note":"engVid: mệnh đề danh ngữ (that / wh- / whether…) làm chủ ngữ, tân ngữ; dừng ở mỗi loại tự viết một câu."},
    {"id":"ZDXwtvgZ41o","credit":"LearnAmericanEnglishOnline — It's + adjective + infinitive","dur":"3:28","lang":"en","note":"Cấu trúc It's + tính từ + to V; xem ngắn rồi viết 3 câu \"It is important / essential… to…\" cho Task 2."},
  ],
  't3d23-doc': [
    {"id":"-bcAPxIL6nE","credit":"The Forum  — Hướng dẫn kỹ thuật dạng bài YES/NO/NOT GIVEN cùng anh Huy Forum 9.0 IELTS | THE FORUM CENTER","dur":"4:58","lang":"vi","note":"Kỹ thuật làm Yes / No / Not Given (giảng tiếng Việt), chú ý từ chỉ mức độ và từ cực đoan; xem ngắn để ôn."},
    {"id":"fY4XD7NcDSM","credit":"Fastrack IELTS — IELTS Reading Practice | TRUE - FALSE - NOT GIVEN | YES - NO - NOT GIVEN","dur":"23:31","lang":"en","note":"Fastrack: luyện True/False/Not Given và Yes/No/Not Given trên bài đọc thật, phân biệt dạng thông tin và dạng quan điểm tác giả; dừng tự làm trước khi xem lời giải."},
  ],
  't3d23-noi': [
    {"id":"_AvtJZodl2s","credit":"IELTS with Charles — IELTS Speaking Part 3: A Simple Formula for Better Answers!","dur":"6:29","lang":"en","note":"Một công thức đơn giản để trả lời Part 3 sâu hơn: nêu ý, lý do, ví dụ, cân nhắc mặt kia — dùng cho câu hỏi đánh giá \"Is it a good thing that…?\"."},
  ],
  't3d24-tu-vung': [
    {"id":"hG-8XYuhZAw","credit":"IELTS Thanh Loan — Từ vựng IELTS chủ đề Năng Lượng - IELTS Vocabulary topic Energy | IELTS Thanh Loan","dur":"7:21","lang":"vi","note":"Từ vựng IELTS chủ đề Năng lượng (giảng tiếng Việt): năng lượng tái tạo, nhiên liệu hoá thạch…; chép vào thẻ Energy & resources."},
    {"id":"e4kYvMEQU3w","credit":"Oxford Online English — Describe Trends in Business English - Describing Statistics, Sales and Market Trends","dur":"15:25","lang":"en","note":"Oxford Online English: mô tả xu hướng và số liệu (rise sharply, level off…) — kho collocation dùng thẳng cho Task 1."},
  ],
  't3d24-viet': [
    {"id":"MQQ5OSSQqnY","credit":"Lilie IELTS — How to Describe Mixed Charts With a Lot of Data [IELTS Writing Task 1 Pie Chart and Table]","dur":"10:27","lang":"en","note":"Cách mô tả mixed charts nhiều số liệu (pie + table): chọn và nhóm số liệu; đối chiếu bài của mình sau khi viết."},
    {"id":"MNBRjdlG1zo","credit":"IELTS with Ralph — IELTS Task 1 Mixed Charts Two Charts, One Band 9 Report","dur":"28:01","lang":"en","note":"Mixed charts: hai biểu đồ khác loại thành một bài Task 1 hoàn chỉnh; chú ý cách viết overview nối hai hình."},
  ],
  't3d24-nghe': [
    {"id":"AKYr5u9O_oc","credit":"IELTSx IELTS for Academic Entry — Listening: Unit 4: Table Completion","dur":"3:25","lang":"en","note":"IELTSx (Đại học Queensland): Table completion trong Listening — đọc trước hàng/cột để đoán thông tin; xem ngắn trước phần Part 4 của bài."},
    {"id":"NVt2dDoyDjk","credit":"Luyện Thi IELTS LangGo — IELTS LISTENING: TRỌN BỘ BÍ QUYẾT LÀM DẠNG BÀI TABLE COMPLETION| IELTS LANGGO","dur":"4:55","lang":"vi","note":"Hướng dẫn Table completion trong Listening (giảng tiếng Việt); xem nếu còn điền sai loại từ."},
  ],
  't3d25-ngu-phap': [
    {"id":"32e3QlxHq7k","credit":"Academic English UK — What is Nominalisation? How to nominalise a sentence in academic writing.","dur":"8:19","lang":"en","note":"Danh hoá (nominalisation) là gì và cách danh hoá một câu trong văn học thuật — đúng phần danh hoá mức 1 của bài; tự danh hoá các câu ví dụ."},
    {"id":"zQrrgcifXJo","credit":"Academic English UK — Noun Phrases in Academic Writing","dur":"9:23","lang":"en","note":"Cụm danh từ trong văn học thuật: thêm bổ ngữ trước và sau danh từ; viết lại 2 câu Task 2 của mình bằng cụm danh từ dài hơn."},
  ],
  't3d25-doc': [
    {"id":"hBw2_ilz6eU","credit":"BestMyTest — IELTS Academic Reading - Summary Completion","dur":"32:24","lang":"en","note":"Bài giảng Summary completion (lấy từ trong bài) trong Reading Academic kèm luyện tập; xem phần chiến thuật đầu, phần luyện tập dừng tự làm."},
    {"id":"5GlwyROjqtI","credit":"IELTS Từ Đầu by Thế Quang  — Cách làm dạng Summary Completion trong 28 phút siêu dễ hiểu để 9.0 IELTS Reading.","dur":"28:14","lang":"vi","note":"Chữa một đoạn Summary completion khó (giảng tiếng Việt), tư duy tìm vùng thông tin và loại từ; xem sau khi tự làm bài."},
  ],
  't3d25-nghe': [
    {"id":"Vf-cBKFiVRI","credit":"Fastrack IELTS — 12 costly IELTS Listening mistakes you're probably making","dur":"21:19","lang":"en","note":"12 lỗi Listening tốn điểm hay gặp (chính tả, số ít – số nhiều, bẫy đổi ý…); đối chiếu với năm loại bẫy của bài và đánh dấu lỗi mình mắc."},
  ],
  't3d26-tu-vung': [
    {"id":"QnxESeRB2j4","credit":"Learn English with Bob the Canadian — An English Lesson About Travel and Tourism 🧳🚌✈️","dur":"10:37","lang":"en","note":"Bài học về du lịch và ngành du lịch (tourism) bằng tiếng Anh dễ nghe; chép từ về tác động của du lịch."},
    {"id":"NHvbdPZi82I","credit":"The IELTS Workshop — TỪ VỰNG VÀ NGỮ PHÁP CHO CHỦ ĐỀ TRAVEL VÀ TOURISM | IELTS 4 SKILLS by The IELTS Workshop","dur":"4:48","lang":"en","note":"Từ vựng và ngữ pháp cho chủ đề Travel & Tourism trong IELTS; ôn nhanh các collocation trùng thẻ của bài."},
  ],
  't3d26-viet': [
    {"id":"L0Mr-O9AGmw","credit":"ABC Australia — Presenting business information using charts and graphs | Business of English #8 | ABC Australia","dur":"10:13","lang":"en","note":"ABC Australia: trình bày thông tin kinh doanh bằng biểu đồ — ngôn ngữ báo cáo số liệu trong công việc; ghi các câu mở đầu và câu chỉ xu hướng."},
    {"id":"elgXDFNTNEc","credit":"Derek Callan - English for Professionals — 28 Phrases For Business Reports","dur":"6:05","lang":"en","note":"28 cụm câu dùng trong báo cáo kinh doanh (mục đích, kết quả, kiến nghị); chọn 5 cụm đưa vào báo cáo ngắn của bài."},
  ],
  't3d26-noi': [
    {"id":"samIlXQFCfg","credit":"Fastrack IELTS — How to answer ANY IELTS Speaking Part 2 - even if you have nothing to say","dur":"13:23","lang":"en","note":"Cách trả lời mọi đề Part 2, kể cả khi không biết nói gì — đúng phần đề lạ \"mượn khung\" của bài; tập với 2 đề lạ."},
    {"id":"mAa40H-kBAs","credit":"IELTS with Charles — Band 8.0 Speaking Part 2: Describe an item on which you spent more than expected","dur":"4:19","lang":"en","note":"Part 2 mẫu \"Describe an item on which you spent more than expected\" — đề tả đồ vật; nghe cách triển khai rồi tự nói 2 phút."},
  ],
  't3d27-ngu-phap': [
    {"id":"pQYbAna-WjM","credit":"Writing Better — Punctuation marks: Comma, Colon, Semicolon","dur":"10:11","lang":"en","note":"Dấu phẩy, dấu hai chấm, dấu chấm phẩy: khi nào dùng, lỗi hay gặp — đúng phần dấu câu của bài; sửa lại một đoạn bài viết của mình."},
    {"id":"qRrTb00wG2w","credit":"Complete Test Success — IELTS Writing - Common Grammar Mistakes","dur":"10:00","lang":"en","note":"Lỗi ngữ pháp thường gặp trong IELTS Writing; đối chiếu với sổ lỗi và bảng tự soát 6 lượt của bài."},
  ],
  't3d27-doc': [
    {"id":"Tn7E2PNfASg","credit":"Fastrack IELTS — Get Better at IELTS Reading in 13 Minutes","dur":"13:42","lang":"en","note":"Cách tiến bộ nhanh ở IELTS Reading: quản lý thời gian và cách làm cả bài; xem trước khi làm đủ 3 passage 60 phút."},
  ],
  't3d27-noi': [
    {"id":"8H-WeY9GSf8","credit":"TakeIELTS Official — IELTS Speaking test practice: improve fluency and coherence in English","dur":"4:47","lang":"en","note":"Video chính thức TakeIELTS: luyện fluency và coherence trong Speaking; xem rồi áp vào bài ghi âm tự chấm."},
    {"id":"GLYNHixRlm8","credit":"English Speaking Success — Why you hesitate in English - and how to fix it today","dur":"11:38","lang":"en","note":"Vì sao ta ngập ngừng khi nói tiếng Anh và cách sửa ngay — giúp mục tiêu \"không im quá 3 giây\" của bài."},
  ],
  't3d28-tu-vung': [
    {"id":"eJF-pyj_jkI","credit":"IELTS Plus — IELTS English Podcast - Speaking Topic: Books","dur":"10:15","lang":"en","note":"Podcast IELTS chủ đề Books: câu hỏi Speaking và trả lời mẫu; chép cụm về thói quen đọc sách."},
    {"id":"eh2SJiKfMrc","credit":"POC English — English Vocabulary (Confusing Words)!","dur":"13:19","lang":"en","note":"Các cặp từ tiếng Anh dễ nhầm, giải thích và ví dụ — bổ sung cho 16 cặp từ dễ nhầm của bài."},
  ],
  't3d28-viet': [
    {"id":"e059yh60SaI","credit":"IELTS with Juva — IELTS Writing Process Diagram Task 1 IN 12 MINUTES","dur":"12:35","lang":"en","note":"Task 1 process diagram trong 12 phút: overview đếm số bước, câu bị động và từ nối trình tự; áp dụng cho bài process của bài."},
    {"id":"71_QjSBhqN8","credit":"English Pro Tips - IELTS Preparation — How to Describe Map Diagrams in IELTS (Full Lesson)","dur":"14:57","lang":"en","note":"Mô tả bản đồ trong Task 1: thay đổi qua các mốc, vị trí và so sánh địa điểm — dùng cho phần map ba mốc và map chọn địa điểm của bài."},
  ],
  't3d28-nghe': [
    {"id":"4OdikzWw-Lo","credit":"IELTS Jacky — IELTS Listening – Map & Plan Questions","dur":"13:07","lang":"en","note":"IELTS Jacky: câu hỏi Map & Plan trong Listening; chú ý từ chỉ hướng và vị trí, luyện cùng ví dụ trong video."},
    {"id":"1LuGkszzKHs","credit":"BestMyTest — IELTS Listening - Plan/Map/Diagram Labelling","dur":"25:41","lang":"en","note":"Bài giảng Plan / Map / Diagram labelling trong Listening kèm luyện tập; xem phần chiến thuật, phần luyện tập dừng tự làm."},
  ],
  't3d29-ngu-phap': [
    {"id":"z960ck7wBBs","credit":"Arnel's Everyday English — CAUSATIVE VERBS - HAVE | GET | MAKE | LET - English grammar lesson","dur":"13:38","lang":"en","note":"Động từ sai khiến have / get / make / let với ví dụ và bài kiểm tra; làm bài kiểm tra cuối video."},
    {"id":"cRyPrHCKX9A","credit":"British Council | English — How to use get and have in the causative – a Mini English Lesson","dur":"2:57","lang":"en","note":"British Council: have / get something done ngắn gọn; xem để ôn nhanh dạng bị động sai khiến."},
  ],
  't3d29-doc': [
    {"id":"N0ePX99GM70","credit":"Adam’s English Lessons · engVid — IELTS – 3 Reading Strategies","dur":"16:51","lang":"en","note":"engVid: 3 chiến thuật IELTS Reading — đọc bố cục, đọc câu hỏi trước, quản lý thời gian; ôn trước khi luyện 900 từ / 20 phút."},
    {"id":"eQIHLkTNuj8","credit":"IELTS Understood — IELTS Reading Section 3 Practice (The Hardest Part)","dur":"36:46","lang":"en","note":"Chữa một Reading Passage 3 (phần khó nhất) từng câu; tự làm passage trước, rồi xem phần giải các câu mình sai."},
  ],
  't3d29-nghe': [
    {"id":"7UZi4B6r0WU","credit":"TakeIELTS Official — IELTS Listening Skills: Improve your Band Score  | TakeIELTS Preparation","dur":"11:31","lang":"en","note":"Video chính thức TakeIELTS: mẹo và chiến thuật nâng band Listening, ôn lại dạng câu hỏi; xem trước đề đủ 40 câu lần 2."},
  ],
  't3d30-tu-vung': [
    {"id":"6zoe5WQ1c8E","credit":"English Speaking Success — Useful IDIOMS for Any Topic in IELTS Speaking","dur":"25:01","lang":"en","note":"Thành ngữ dùng được cho mọi chủ đề IELTS Speaking và cách dùng tự nhiên; chọn 10 idiom trùng danh sách 30 idiom của bài."},
    {"id":"f8mamMiJsO0","credit":"English Pro Tips - IELTS Preparation — Idioms for IELTS… that Native Speakers Actually Use","dur":"18:28","lang":"en","note":"Những idiom người bản xứ thật sự dùng, cách đưa vào IELTS Speaking tự nhiên; chọn idiom trùng danh sách 30 idiom của bài."},
  ],
  't3d30-viet': [
    {"id":"1aQZ7_tfgps","credit":"IELTS Advantage — Simple Fixes That Turn a Band 6 Essay Into Band 8 [+ Free Task 2 PDF]","dur":"24:10","lang":"en","note":"Những chỗ sửa đơn giản biến bài band 6 lên cao hơn: mở bài, câu chủ đề, triển khai ý — dùng khi viết lại bài cũ theo sổ lỗi."},
    {"id":"iXrG2Pf_VRI","credit":"Fastrack IELTS — IELTS Writing Task 2: Band 6 vs. Band 7+ | Ex-examiner’s Feedback","dur":"15:02","lang":"en","note":"So sánh bài band 6 và band 7+ với nhận xét của cựu giám khảo; tự so bài viết lại của mình với hai bản."},
  ],
  't3d30-noi': [
    {"id":"1WifdEajCeg","credit":"Ross IELTS Academy — IELTS Speaking Test band score 6 with feedback 2025","dur":"17:21","lang":"en","note":"Thi thử Speaking trọn 3 Part với thí sinh band 6, có nhận xét; xem trước buổi thi với giám khảo AI để biết band 6 nghe như thế nào."},
    {"id":"BZ2WrtRBc9w","credit":"IELTS with Charles — IELTS Speaking Band 6.0+ Mock Test with Feedback | IELTS with Charles","dur":"13:47","lang":"en","note":"Thêm một bài thi thử band 6.0+ kèm nhận xét kiểu giám khảo: điểm mạnh và chỗ cần sửa để lên 6.5; ghi 3 điểm áp dụng cho mình."},
  ],
};
