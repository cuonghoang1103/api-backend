/**
 * 🎬 Video bài giảng của IELTS Tập 5 — khoá = id bài (`t5dN-…`, `t5-bat-dau`), hiện đầu bài (VideoBai.tsx).
 * Cùng quy trình và định dạng với `../videos.ts` của Tập 1 (oEmbed + playabilityStatus OK + playableInEmbed;
 * kiểm cả loạt: `node scripts/yt-check.mjs <id…>`). Không dùng lại ID đã gắn ở Tập 1–3 cho cùng nội dung.
 * Mức band 7–8+: bài mẫu band 8–9, so sánh band 7 / band 8, chiến thuật Passage 3 / Part 4; ngày làm đề và ngày
 * mổ đề gắn video chiến thuật làm đề / phân tích lỗi đúng kỹ năng. Bài homework / review không gắn.
 */
import type { LessonVideo } from '@/components/sach-hoc/types';

export const VIDEO_BAI_T5: Record<string, LessonVideo[]> = {
  't5d1-ngu-phap': [
    {"id":"kajoEOfT8w4","credit":"EAPFoundation.com — Hedging (cautious language) in Academic Writing","dur":"14:09","lang":"en","note":"Giảng kỹ hedging trong văn học thuật: động từ tường thuật, modal, trạng từ chỉ mức chắc và lỗi rào đón quá liều; xem hết rồi so với phần “hedging đúng liều” của bài, chú ý ví dụ một nhận định chỉ cần một lớp rào."},
    {"id":"9cGxewHh3bw","credit":"Academic English UK — Hedging Language - Academic Writing","dur":"4:47","lang":"en","note":"Tóm gọn các nhóm từ hedging (may/might, appear to, tend to, possibly…) theo mức chắc chắn; dừng ở từng ví dụ, tự nói nhận định đó mạnh hay yếu hơn câu gốc."},
  ],
  't5d1-doc': [
    {"id":"RJeHnYqGB0g","credit":"AcademicEnglishHelp — IELTS Reading Yes No Not Given Band 9 Strategy","dur":"15:43","lang":"en","note":"Chiến thuật YES / NO / NOT GIVEN cho câu hỏi về QUAN ĐIỂM người viết: phân biệt \"trái ý tác giả\" với \"tác giả không nói\"; làm theo phần thực hành trong video trước khi xem đáp án, chú ý bẫy mức chắc chắn (some / most / all)."},
  ],
  't5d1-nghe': [
    {"id":"SYHWCn0GqCw","credit":"IELTS Advantage — How Do I Get Band 9 in IELTS Listening? [+ Free Listening PDF]","dur":"11:09","lang":"en","note":"Những thói quen của người đạt Listening band 9: đọc trước câu hỏi, đoán loại từ, theo dõi lời sửa; áp ngay vào Form completion Part 1 tốc độ thật của bài."},
    {"id":"raE87U2TLJo","credit":"Aussie English — Pronunciation: T-flap & Glottal Stop | Learn Australian English | Aussie Accent","dur":"4:13","lang":"en","note":"Phân biệt flap /t/ (water → “wadder”) và glottal stop (/t/ nuốt thành tiếng ngắt) qua giọng Úc; nghe lặp từng ví dụ, đúng hai hiện tượng bài học yêu cầu nhận ra."},
  ],
  't5d2-tu-vung': [
    {"id":"p7NltvIOr-g","credit":"Now English 24 — Lexical Resource and Topic-Specific Vocabulary for IELTS, (Government)","dur":"18:46","lang":"en","note":"Từ vựng chủ đề Chính phủ và hành chính ở mức IELTS (collocation, cụm danh từ); dùng để ôn vòng 2 phần Chính phủ & chi tiêu công, ghi lại cụm nào chưa có trong sổ từ."},
    {"id":"wECaImP7-ks","credit":"IELTS with Charles — IELTS Speaking Band 8: Arts | Sample Answers with Advanced Vocabulary","dur":"9:56","lang":"en","note":"Bài mẫu Speaking band 8 chủ đề Arts kèm từ vựng nâng cao; nghe cách dùng từ chủ đề trong câu trả lời thật, rồi tự trả lời lại một câu bằng 2–3 cụm mới."},
  ],
  't5d2-viet': [
    {"id":"_LwCwsFDRdE","credit":"E2 IELTS — IELTS Writing Task 2 Essay Guide - Band 6 to Band 8+","dur":"21:00","lang":"en","note":"E2 so sánh bài Task 2 band 6 và band 8+ theo từng tiêu chí: lập luận phát triển, liên kết, từ chính xác; xem song song với hai bài mẫu band 7 / band 8 cùng đề của bài."},
    {"id":"JbGgFuvLQm0","credit":"IELTS Advantage — How Do I Get Band 8.5 in IELTS Writing Task 2?","dur":"30:10","lang":"en","note":"Phân tích một bài Task 2 lên band 8.5: điều gì làm bài vượt band 7 (ý sâu, ví dụ cụ thể, câu không lỗi); dùng làm danh sách tự chấm trước khi viết lại bài của bạn."},
  ],
  't5d2-noi': [
    {"id":"XwgskILvIfU","credit":"IELTS by IDP — IELTS Speaking: Band 7 vs. Band 8 - Fluency and Coherence","dur":"2:48","lang":"en","note":"Video chính thức của IDP: hai thí sinh band 7 và band 8 cạnh nhau ở tiêu chí Fluency & Coherence — thấy rõ “ngắt vì nghĩ nội dung” khác “ngắt vì tìm từ”; đúng trọng tâm bài."},
    {"id":"WAVTPzCdLbA","credit":"IELTS Advantage — Fix These 3 Things To Get Band 8","dur":"18:36","lang":"en","note":"Ba điểm cần sửa để từ band 7 lên band 8 Speaking (trọng tâm Part 3: phát triển ý, tự nhiên, chính xác); xem sau phần so sánh band 7 / band 8 của bài."},
  ],
  't5d3-ngu-phap': [
    {"id":"tMPotzdaw4s","credit":"Espresso English — Subject-Verb Agreement: 10 TRICKY cases! 😬","dur":"7:49","lang":"en","note":"Mười trường hợp hoà hợp chủ – vị khó (chủ ngữ dài, each/every, a number of / the number of, danh từ tập hợp…); dừng ở từng câu tự chọn động từ — đúng loại lỗi dai dẳng cần truy trong sổ lỗi."},
    {"id":"kKtj_a-ETw4","credit":"WUWritingCenter — Advanced Subject-Verb Agreement","dur":"4:29","lang":"en","note":"Hoà hợp chủ – vị nâng cao trong câu học thuật dài (chủ ngữ bị mệnh đề chen giữa, đảo ngữ); ngắn, xem để chốt lại sau video trên."},
  ],
  't5d3-doc': [
    {"id":"va7X0SmsHEE","credit":"IELTS Understood — IELTS Reading Practice: How to Answer True/False/Not Given Questions (and Get Band 9)","dur":"17:03","lang":"en","note":"Luyện TFNG trên một đoạn đọc thật, giải thích vì sao từng câu là False chứ không phải Not Given; hợp với dạng “suy luận một bước” của bài."},
  ],
  't5d3-noi': [
    {"id":"inNn7zrWKMQ","credit":"English Pro Tips - IELTS Preparation — IELTS Speaking | 8 Question Types You Must Prepare For","dur":"20:46","lang":"en","note":"Tám kiểu câu hỏi Part 1 (sở thích, thói quen, quá khứ, tương lai, mô tả, so sánh, ý kiến, câu hỏi nối) và cách mở rộng từng kiểu; dùng để luyện nhịp trả lời ba nhịp của bài."},
    {"id":"IevmdO16GuE","credit":"IELTS Advantage — IELTS Speaking Test- Perfect Band 9","dur":"7:32","lang":"en","note":"Một bài thi Speaking band 9 trọn vẹn; tập trung phần Part 1 — câu trả lời tự nhiên, vừa đủ dài, idiom chen khéo — rồi tự trả lời lại cùng câu hỏi."},
  ],
  't5d4-tu-vung': [
    {"id":"yxcYcIPxAQw","credit":"IELTS Energy TV — Use This “Less Common” Academic IELTS Vocabulary - IELTS Energy Podcast 1313","dur":"14:12","lang":"en","note":"Cách dùng từ “ít gặp” (less common vocabulary) cho đúng — điều kiện của Lexical Resource band 8; nghe để biết khi nào từ hiếm là điểm cộng và khi nào thành lỗi dùng sai."},
  ],
  't5d4-viet': [
    {"id":"evOBy0B1a2U","credit":"IELTS with Ralph — IELTS Writing Task 2 Sample Band 9 Opinion Essay","dur":"19:08","lang":"en","note":"Phân tích một bài Opinion band 9 từng đoạn: lập trường rõ từ đầu, lập luận sâu, ví dụ cụ thể chứ không khái quát; so với khung bài Opinion band 8 của bài học."},
    {"id":"w9tVmGia0_c","credit":"Fastrack IELTS — How to Get a Band 9 in IELTS Writing Task 2 (Proven System)","dur":"14:09","lang":"en","note":"Quy trình viết Task 2 band 9 của Fastrack (phân tích đề → ý chính → phát triển → kiểm); xem phần phát triển ý và ví dụ để tránh lập luận chung chung."},
  ],
  't5d4-nghe': [
    {"id":"3oQNETB8RdA","credit":"Fastrack IELTS — IELTS Listening MULTIPLE CHOICE | Band 9 Strategy & Practice","dur":"25:56","lang":"en","note":"Chiến thuật trắc nghiệm Listening (dạng chính của Part 2–3) mức band 9: nghe ý chứ không bắt từ, loại phương án bị nhắc rồi bác; dừng tự làm phần luyện tập."},
  ],
  't5d5-ngu-phap': [
    {"id":"147EEKjSOHw","credit":"Building Blocks English — Participle Clauses and Reduced Relative Clauses","dur":"18:34","lang":"en","note":"Mệnh đề phân từ và mệnh đề quan hệ rút gọn — hai mảnh chính để dựng câu phức nhiều tầng không lỗi; xem hết, chép lại các ví dụ ghép hai câu thành một."},
    {"id":"8nC27LPY_Lg","credit":"SMASH English - Cambridge English Exam Preparation — PARTICIPLE CLAUSES - All you need to know! - English Grammar for B2 First/C1 Advanced","dur":"9:45","lang":"en","note":"Tổng hợp mệnh đề phân từ (-ing, -ed, having + V3) cho trình độ C1; chú ý phần chủ ngữ của phân từ phải trùng chủ ngữ câu chính (nền cho bài chủ ngữ treo ở Ngày 9)."},
  ],
  't5d5-doc': [
    {"id":"DWmo6nbhP0M","credit":"Fastrack IELTS — Band 9 IELTS Reading MATCHING HEADINGS","dur":"13:27","lang":"en","note":"Matching Headings mức band 9: đọc tiêu đề như CHỨC NĂNG của đoạn (nêu vấn đề, phản bác, đề xuất), không bắt từ trùng; làm cùng bài luyện trong video."},
  ],
  't5d5-nghe': [
    {"id":"5kOuxAXDT-A","credit":"E2 IELTS — IELTS Listening Part 4: Stop Losing Easy Marks and Increase Your Score","dur":"10:20","lang":"en","note":"Những chỗ mất điểm dễ ở Part 4 (bài giảng, Note completion): theo dõi tiêu đề ghi chú, giới hạn số từ, chính tả; xem trước khi làm bài giảng 8 phút của bài."},
    {"id":"AYLo2GJ3Mog","credit":"ETJ English — Connected Speech: Linking | RP British Pronunciation Lesson","dur":"9:12","lang":"en","note":"Nối âm trong lời nói liền (phụ âm + nguyên âm, chèn /j/ /w/ /r/) giọng Anh chuẩn; nghe lặp từng cụm để nhận ra chuỗi nối âm trong bài giảng tốc độ thật."},
  ],
  't5d6-tu-vung': [
    {"id":"tPrdQAefy4U","credit":"IELTS Advantage — Common Synonyms That Will Destroy Your IELTS Score","dur":"22:47","lang":"en","note":"Vì sao “từ đồng nghĩa” không thay nhau được: khác độ mạnh, thái độ, collocation và văn phong — đúng trọng tâm “paraphrase mà không đổi nghĩa” của bài; ghi lại các cặp dễ dùng sai."},
  ],
  't5d6-viet': [
    {"id":"bpBr2slbJsA","credit":"E2 IELTS — IELTS Academic Writing Task 1 - Mixed Charts","dur":"11:10","lang":"en","note":"Cách viết Task 1 mixed charts: chọn đặc điểm chính của từng biểu đồ, nối hai biểu đồ trong overview; xem trước khi làm đề mixed charts của bài."},
    {"id":"3-bGeUzjeEA","credit":"IELTS with Ralph — How I Got Band 9 in IELTS Writing Task 1 — Mixed Charts Made Easy!","dur":"13:52","lang":"en","note":"Bài mẫu mixed charts band 9 phân tích từng câu (overview gộp hai biểu đồ, số liệu chọn lọc); dùng để so với bài viết của bạn."},
  ],
  't5d6-noi': [
    {"id":"WVkeEFs1hUo","credit":"IELTS by IDP — Band 9 | IELTS Speaking test sample – Part 3 (Anuradha)","dur":"5:22","lang":"en","note":"Mẫu Part 3 band 9 chính thức của IDP: nghe cách thí sinh đưa quan điểm, nhượng bộ rồi phản biện, rào đón khi nói; ghi lại các cụm chuyển ý."},
    {"id":"4Fspx4fXFQM","credit":"English Pro Tips - IELTS Preparation — 5 Methods to Develop Answers in IELTS Part 3","dur":"17:26","lang":"en","note":"Năm cách phát triển câu trả lời Part 3 (nguyên nhân – hệ quả, so sánh, ví dụ, giả định, cân hai phía); luyện cùng phần phản biện và nhượng bộ của bài."},
  ],
  't5d7-ngu-phap': [
    {"id":"_5LNF2ZN19s","credit":"IELTS Examiner Will — Passive Voice in IELTS Writing: Why Band 6 Stays Band 6","dur":"10:23","lang":"en","note":"Cựu giám khảo giải thích khi nào và vì sao dùng bị động trong Writing (nhất là Task 1 process) và giám khảo chấm nó thế nào; đúng vòng 3 bị động của bài."},
  ],
  't5d7-doc': [
    {"id":"nXMUx0KUbC8","credit":"IELTS with Ralph — Best IELTS Reading Strategy to Answer Short Answer Questions","dur":"14:11","lang":"en","note":"Chiến thuật Short answer questions: giới hạn số từ, chép đúng từ trong bài, xác định loại thông tin cần tìm; làm bài luyện trong video."},
    {"id":"X-YAG8FmFIg","credit":"IELTS Jacky — IELTS Reading – How To Answer Sentence Completion Questions","dur":"13:46","lang":"en","note":"Sentence completion: đáp án phải vừa đúng nghĩa vừa khớp ngữ pháp câu hỏi, chép nguyên từ trong bài; đúng hai luật “chép đúng từ, khớp đúng ngữ pháp” của bài."},
  ],
  't5d7-noi': [
    {"id":"JVf2tLiXeCQ","credit":"Fastrack IELTS — Band 9 IELTS Speaking SAMPLE ANSWERS | Describing PEOPLE","dur":"14:57","lang":"en","note":"Bài mẫu Part 2 band 9 tả người: chi tiết cụ thể, cảm xúc, giọng kể có lên xuống; nghe rồi tự kể lại một người bằng chi tiết cảm quan như bài học."},
  ],
  't5d8-tu-vung': [
    {"id":"AVuC13JIumQ","credit":"Learn English with Papa Teach Me — Crime and Law English Vocabulary! - IELTS Essential Vocabulary!","dur":"18:39","lang":"en","note":"Từ vựng Tội phạm & Pháp luật (offence, sentence, deterrent, rehabilitation…) giảng có ví dụ; dùng ôn vòng 2 phần Tội phạm, chú ý collocation đi kèm."},
    {"id":"npm3P3J4gAM","credit":"IELTS Thanh Loan — Từ vựng chất & Ý tưởng hay IELTS Writing cho chủ đề Aging Population","dur":"19:25","lang":"vi","note":"(Tiếng Việt) Từ vựng và ý tưởng chất lượng cao cho đề Già hoá dân số: cụm từ, lập luận nguyên nhân – hệ quả – giải pháp; xem để bổ sung phần Già hoá vòng 2."},
  ],
  't5d8-viet': [
    {"id":"p-r65jaSz4o","credit":"IELTS Advantage — IELTS Writing Tips You MUST Know Before Your Test","dur":"29:22","lang":"en","note":"Những điều phải biết trước giờ thi Writing: chia 20/40 phút, làm Task nào trước, chừa thời gian soát; áp vào buổi làm Writing Đề 9 trong 60 phút."},
    {"id":"uzQXM-2jtS8","credit":"Lilie IELTS — how to finish writing task 2 quickly and have time for error-checking / discuss both views","dur":"24:35","lang":"en","note":"Cách viết Task 2 nhanh để còn thời gian soát lỗi (lên dàn ý gọn, câu mẫu có sẵn); xem phần quản lý thời gian trước khi bấm giờ 60 phút."},
  ],
  't5d8-nghe': [
    {"id":"gfTqr_9BMjs","credit":"IELTS Advantage — The ONLY IELTS Listening Strategy You Need","dur":"12:38","lang":"en","note":"Một chiến thuật xuyên suốt cho cả bài Listening (đọc trước, đoán, theo dõi, chép) — dùng làm quy trình trước khi làm Listening Đề 9."},
    {"id":"q6D7RDbYvTw","credit":"Fastrack IELTS — Complete Guide to IELTS Listening (For Band 9)","dur":"16:33","lang":"en","note":"Hướng dẫn trọn bài Listening cho band 9: từng Part, từng dạng câu và bẫy thường gặp; xem lướt phần Part 3–4 trước khi làm đề."},
  ],
  't5d9-ngu-phap': [
    {"id":"fojkyh3qfHI","credit":"Kevin Spaans — PARALLEL STRUCTURE | English Lesson","dur":"5:29","lang":"en","note":"Cấu trúc song song (parallelism): các vế nối bằng and / or / not only… but also phải cùng dạng; dừng ở ví dụ tự sửa câu lệch."},
    {"id":"M6AzQ99bYO8","credit":"Kevin Spaans — DANGLING & MISPLACED MODIFIERS | English Lesson","dur":"7:04","lang":"en","note":"Chủ ngữ treo (dangling) và bổ ngữ đặt sai chỗ (misplaced): nhận ra và sửa câu dài cho rõ chủ thể — đúng hai lỗi trọng tâm của bài."},
  ],
  't5d9-doc': [
    {"id":"1u7T3osp7O4","credit":"IELTS with Juva — IELTS Reading Matching Headings - BEST Tips and Practice Test","dur":"10:56","lang":"en","note":"Mẹo + bài luyện Matching Headings; làm lại sau khi mổ câu sai ở Đề 9, chú ý cách loại tiêu đề chỉ khớp một chi tiết của đoạn."},
    {"id":"i0g5EYiUAxo","credit":"IELTS with Juva — IELTS Reading Yes, No, Not Given Practice Test with Answers | BAND 9 Strategy","dur":"13:43","lang":"en","note":"Bài luyện YES / NO / NOT GIVEN có đáp án và chiến thuật band 9; làm lại để kiểm xem đã sửa kiểu sai “nhầm NO với NOT GIVEN” ghi trong sổ lỗi Đề 9 chưa."},
  ],
  't5d9-nghe': [
    {"id":"LZEG2hAcgE0","credit":"English Speakology — The Distractor Trap in IELTS Listening: How to Spot It & Stop Losing Marks","dur":"8:45","lang":"en","note":"Bẫy đánh lạc hướng (distractor): người nói nhắc phương án rồi bác, sửa lời; nhận diện tín hiệu “actually / no, sorry / rather” — đúng ba kiểu bẫy cần luyện lại."},
  ],
  't5d10-viet': [
    {"id":"QjBt2-FKhQE","credit":"AcademicEnglishHelp — IELTS Task 1 Compare Maps Band 9 Writing","dur":"15:51","lang":"en","note":"Bài mẫu Task 1 so sánh hai bản đồ band 9: overview thay đổi chính, ngôn ngữ vị trí và biến đổi; xem khi mổ bài map của Writing Đề 9."},
    {"id":"xX5mAodbX44","credit":"IELTS with Ralph — IELTS Task 2 Sample Band 9 Discussion Essay","dur":"19:12","lang":"en","note":"Bài Discussion (discuss both views) band 9: trình bày công bằng hai góc rồi nêu lập trường tinh; so với khung Discussion band 8 của bài."},
  ],
  't5d10-noi': [
    {"id":"QOTwvvApB8E","credit":"English Speaking Success — How IELTS Speaking is Scored: How to Get a Band 9.","dur":"12:43","lang":"en","note":"Keith giải thích cách chấm Speaking theo 4 tiêu chí và điều cần cho band cao; dùng làm thước khi mổ bài nói Speaking Đề 9."},
  ],
  't5d11-ngu-phap': [
    {"id":"4clDYkIcOUI","credit":"English with Jennifer — Ellipsis: How to Omit Words and Speak English Naturally","dur":"15:10","lang":"en","note":"Lược từ (ellipsis) để nói tự nhiên, không lặp: “I’d like to, but I can’t”, “Yes, I have”…; nghe và nhại theo, đúng mảng ellipsis của bài."},
    {"id":"7HnmrjPz06I","credit":"IELTS by IDP — IELTS Speaking: Band 7 vs. Band 8 - Grammatical Range and Accuracy","dur":"3:08","lang":"en","note":"Video chính thức của IDP: band 7 và band 8 khác nhau thế nào ở tiêu chí Grammatical Range & Accuracy khi nói; nghe câu phức của thí sinh band 8."},
  ],
  't5d11-doc': [
    {"id":"d1_CoVNLBW0","credit":"IELTS Understood — IELTS Reading Passage 3 Practice (The HARDEST Passage)","dur":"36:25","lang":"en","note":"Làm trọn một Passage 3 (đoạn khó nhất) có giải thích từng câu; bấm giờ 15–20 phút tự làm trước, rồi xem lời giải — luyện đúng loại bài lập luận trừu tượng."},
  ],
  't5d11-noi': [
    {"id":"W-EkenvTvyA","credit":"IELTS by IDP — IELTS Speaking: Band 7 vs. Band 8 - Lexical Resource","dur":"3:14","lang":"en","note":"Video chính thức của IDP: band 7 và band 8 khác nhau ở Lexical Resource — từ ít gặp và idiom dùng chính xác, tự nhiên; xem trước phần idiom của bài."},
    {"id":"vBovBC8ZoUM","credit":"English Pro Tips - IELTS Preparation — My 10 Best Idioms for IELTS Speaking","dur":"15:53","lang":"en","note":"Mười idiom dùng được trong IELTS Speaking kèm ngữ cảnh đúng; chỉ chọn 2–3 cái hợp với bạn và đặt câu, tránh nhồi idiom."},
  ],
  't5d12-tu-vung': [
    {"id":"t-Q2YWvWgmQ","credit":"polýMATHY — Latin plurals in English","dur":"12:12","lang":"en","note":"Số nhiều gốc Latin trong tiếng Anh (criterion → criteria, phenomenon → phenomena, datum → data, hypothesis → hypotheses…); đúng phần số nhiều gốc Latin của bài."},
  ],
  't5d12-viet': [
    {"id":"y_L-zZKqzjY","credit":"IELTS with Ralph — IELTS Process Diagram Band 9 | Step by Step Full Analysis","dur":"24:56","lang":"en","note":"Phân tích đầy đủ một bài process diagram band 9 từng bước; chú ý cách chia quy trình thành giai đoạn trong overview và thân bài."},
    {"id":"3f_5C6cmeeA","credit":"IELTS with Ralph — Band 9 Strategy to Answer IELTS Task 1 Process Diagram","dur":"17:46","lang":"en","note":"Chiến thuật band 9 cho process diagram: đếm giai đoạn, viết overview nêu số bước và điểm đầu – cuối; áp vào quy trình HAI giai đoạn của bài."},
  ],
  't5d12-nghe': [
    {"id":"jgp8fuyNwkY","credit":"IELTS Jacky — IELTS Listening – Summary Completion Questions","dur":"13:16","lang":"en","note":"Dạng Summary completion trong Listening: dự đoán từ loại, theo dõi các đoạn tóm tắt khi nghe bài giảng; dừng làm bài luyện trong video."},
  ],
  't5d13-ngu-phap': [
    {"id":"Dj0ePce_xmE","credit":"Arnel's Everyday English — CLEFT SENTENCES | advanced complex sentences in English + TEST!","dur":"21:30","lang":"en","note":"Câu chẻ (It is … that / What … is …) dùng để nhấn mạnh trong văn viết; có bài kiểm tra cuối — đúng phần câu chẻ trong Task 2."},
    {"id":"Y5Mv87X-Uz8","credit":"To The Point English with Ben.  — INVERSION - a simple guide! Advanced English grammar - C1 Advanced and C2 Proficiency Cambridge exam","dur":"9:55","lang":"en","note":"Đảo ngữ (Not only…, Rarely…, Should…) cấp C1–C2 giải thích gọn; nhớ nguyên tắc “dùng vừa đủ, đúng chỗ” của bài, không nhồi đảo ngữ."},
  ],
  't5d13-doc': [
    {"id":"A_1U_eB3OfE","credit":"IELTS Understood — How to Find Answers Fast in IELTS Reading (Band 9 Strategy)","dur":"35:17","lang":"en","note":"Cách tìm đáp án nhanh trong Reading theo chiến thuật band 9 (định vị bằng từ khoá khó đổi, đọc kỹ vùng chứa đáp án); xem trước lần làm đủ 3 passage trong 55 phút."},
  ],
  't5d13-nghe': [
    {"id":"wYcV_jYQFyw","credit":"Fastrack IELTS — IELTS Listening Matching Information | TIPS, STRATEGY, PRACTICE","dur":"13:35","lang":"en","note":"Dạng Matching trong Listening (nối người nói với ý kiến): theo dõi ai nói gì, ai đồng ý với ai; đúng kỹ năng của seminar Part 3 trong bài."},
  ],
  't5d14-viet': [
    {"id":"D1dXH-vOSIA","credit":"Fastrack IELTS — The Complete Guide to 5 IELTS Essay Types (+Band 9 Examples)","dur":"18:41","lang":"en","note":"Năm dạng đề Task 2 và cách nhận ra từng dạng, kèm ví dụ band 9; dùng để luyện nhận dạng đề lạ, đếm nhiệm vụ trong 2 phút."},
    {"id":"Q_YYmAo2U3Q","credit":"Fastrack IELTS — Can you EASILY answer any IELTS Writing Task 2 question?","dur":"14:13","lang":"en","note":"Cách đọc và trả lời BẤT KỲ đề Task 2 nào (kể cả đề trộn dạng): xác định từng nhiệm vụ của câu hỏi trước khi chọn khung bài."},
  ],
  't5d14-noi': [
    {"id":"VucCPwjXTUw","credit":"TED-IELTS — How to Deal with Difficult Cue Cards [IELTS Speaking Part 2]","dur":"14:02","lang":"en","note":"Vì sao có thẻ Part 2 khó hơn và xử lý khi gặp thẻ lạ (mượn chuyện có sẵn, bám ý chính của thẻ); đúng tình huống “đề hiếm” của bài."},
    {"id":"wSj6PTySYLM","credit":"Billie English — Contrastive Stress | Sentence Stress | English Pronunciation","dur":"16:34","lang":"en","note":"Nhấn tương phản (contrastive stress): đổi trọng âm câu để đối lập ý (“I said TUESDAY, not Thursday”); nghe và nhại theo các ví dụ."},
  ],
  't5d15-ngu-phap': [
    {"id":"2FOptwGnD8I","credit":"Oxford Online English — How to Use Formal and Informal English - English Speaking and Writing Fluency","dur":"21:53","lang":"en","note":"Phân biệt tiếng Anh trang trọng – trung tính – thân mật trong nói và viết (từ vựng, ngữ pháp, độ dài câu); xem hết, ghi các cặp từ đổi văn phong."},
    {"id":"hdKYl8Tg_FQ","credit":"BBC Learning English — Formal English and informal English - BBC English Masterclass","dur":"4:08","lang":"en","note":"BBC giải thích ngắn khác biệt formal / informal qua ví dụ thực tế; xem để chốt lại sau video trên."},
  ],
  't5d15-doc': [
    {"id":"qfE07tfENSg","credit":"IELTS Jacky — IELTS Reading – How To Answer Matching Information Questions","dur":"17:31","lang":"en","note":"Cách làm Matching Information (thông tin nằm ở đoạn nào), kèm bài luyện; chú ý một đoạn có thể dùng nhiều lần và thông tin thường bị paraphrase mạnh."},
    {"id":"tyKfUecMnWM","credit":"The IELTS Workshop — Chiến thuật làm bài Matching Features trong IELTS Reading | IELTS 4 SKILLS by The IELTS Workshop","dur":"7:25","lang":"vi","note":"(Tiếng Việt) Chiến thuật Matching Features: dò tên người / học thuyết trước, rồi đọc kỹ ý của từng người — hợp bài có nhiều học giả, nhiều quan điểm."},
  ],
  't5d15-noi': [
    {"id":"OvWDWx8Rshw","credit":"Learn English with Rebecca · engVid — How to disagree politely in English","dur":"20:03","lang":"en","note":"Các mức phản đối lịch sự trong tiếng Anh, từ mềm tới thẳng, dùng ở công việc và thảo luận; ghi lại câu mở đầu nhượng bộ trước khi phản biện."},
    {"id":"F5h3tLtgVrI","credit":"BBC Learning English — Disagreeing - 10 - English at Work gives you the language to disagree","dur":"3:59","lang":"en","note":"BBC English at Work: tình huống văn phòng có phản đối và thương lượng, ngôn ngữ dùng thật; nghe tình huống rồi xem phần giải thích cụm từ."},
  ],
  't5d16-tu-vung': [
    {"id":"UbJzVPoWnx0","credit":"E2 IELTS — E2 IELTS Writing Task 2 | How to score 8+ in Vocabulary | TOP TIPS by Jay","dur":"12:15","lang":"en","note":"Cách đạt 8+ tiêu chí từ vựng trong Task 2: collocation, từ chủ đề chính xác, tránh từ “làm màu”; dùng khi ôn lại kho từ 33 chủ đề."},
  ],
  't5d16-viet': [
    {"id":"SWVs5NYLuP8","credit":"IELTS with Juva — IELTS Writing Task 2 Advantages and Disadvantages | BAND 9 Sample Answer Step-by Step","dur":"21:05","lang":"en","note":"Bài mẫu Advantages / Disadvantages band 9 dựng từng bước (dàn ý, đoạn thân, kết luận); so với bài của bạn trước khi làm Writing Đề 10."},
  ],
  't5d16-nghe': [
    {"id":"lpF5_EZIKVE","credit":"IELTS Advantage — Get BAND 9 After Using These Listening Tips","dur":"13:18","lang":"en","note":"Mẹo Listening dẫn tới band 9 (nghe ý, theo dõi lời sửa, bẫy số và phủ định); xem trước khi làm Listening Đề 10."},
  ],
  't5d17-ngu-phap': [
    {"id":"SkMVAesuSwc","credit":"English with Alex · engVid — English Grammar: The 5 Most Frequent Article Mistakes","dur":"9:51","lang":"en","note":"Năm lỗi mạo từ thường gặp nhất (danh từ trừu tượng, danh từ chung chung, “the” với khái niệm…); dừng tự sửa từng câu — đúng chuỗi lỗi mạo từ vòng 3."},
    {"id":"3e7fZTVRW1w","credit":"English with Lucy — Well, clearly, we need to discuss commas.","dur":"9:56","lang":"en","note":"Các quy tắc dấu phẩy quan trọng (sau trạng ngữ đầu câu, mệnh đề quan hệ không xác định, liệt kê, comma splice); đúng phần dấu phẩy của bài."},
  ],
  't5d17-doc': [
    {"id":"mLSoJ6VuDxc","credit":"IELTS Understood — Understanding Paraphrasing in IELTS Reading (Step-by-Step)","dur":"22:03","lang":"en","note":"Paraphrase trong Reading giải thích từng bước: đổi loại từ, đổi cấu trúc, đảo chiều so sánh; dùng khi mổ từng câu sai của Reading Đề 10."},
    {"id":"OdHuufxqwfI","credit":"Fastrack IELTS — 10 common IELTS Reading mistakes that can ruin your score","dur":"11:18","lang":"en","note":"Mười lỗi phổ biến làm mất điểm Reading; đối chiếu với nhãn lỗi trong sổ của bạn sau Đề 10."},
  ],
  't5d17-nghe': [
    {"id":"X9LztgjC3EI","credit":"E2 IELTS — IELTS Listening Part 2: The Mistakes Stopping You From Band 7+","dur":"10:05","lang":"en","note":"Những lỗi chặn band 7+ ở Listening Part 2 (bản đồ, trắc nghiệm, thông tin bị sửa); xem trước bài nghe người bản ngữ kể về một sự kiện."},
    {"id":"8aomq8d4MSk","credit":"English Speaking Success — Why Your English Sounds Flat — Fix Your Intonation in 10 Minutes","dur":"14:23","lang":"en","note":"Sửa giọng nói “phẳng”: ngữ điệu lên xuống, nhấn ý quan trọng khi kể; luyện cùng phần ngữ điệu kể chuyện của bài."},
  ],
  't5d18-tu-vung': [
    {"id":"eEn2wyDZiyM","credit":"Interactive English — Advanced Idioms (C1-C2) to Build Your Vocabulary","dur":"20:38","lang":"en","note":"Idiom C1–C2 kèm ngữ cảnh dùng; chọn những idiom dùng được để lập luận, kể và thương lượng như ba nhóm trong bài."},
    {"id":"gZgHfvuEWOg","credit":"British English Teacher Roy — Why the British Rarely Say What They Mean (and How to Understand Them Anyway)","dur":"27:21","lang":"en","note":"Người Anh nói giảm, nói tránh (understatement) và cách hiểu đúng ý thật; đúng phần “nói giảm kiểu Anh” của bài."},
  ],
  't5d18-viet': [
    {"id":"xDi8-f8FJ7Q","credit":"IELTS with Ralph — How to Get Band 9 in IELTS Task 1 Maps","dur":"12:57","lang":"en","note":"Bài mẫu Task 1 Map band 9: cấu trúc, thì và từ vựng mô tả thay đổi; xem rồi tự chuyển sang bản đồ có mốc tương lai (is to be / is due to / is expected to)."},
    {"id":"qgoLTf5b99A","credit":"Fastrack IELTS — Band 9 Vocabulary for IELTS Academic Writing Task 1: MAPS","dur":"20:42","lang":"en","note":"Từ vựng band 9 cho Task 1 Maps (vị trí, xây mới, phá bỏ, mở rộng); ghi các động từ dùng được ở bị động tương lai."},
  ],
  't5d18-noi': [
    {"id":"lPinxUDxhVs","credit":"Derek Callan - English for Professionals — 62 Useful Phrases For Negotiating - Business English (FREE E-Phrasebook)","dur":"8:13","lang":"en","note":"62 cụm từ dùng khi đàm phán (đề xuất, nhượng bộ, từ chối, chốt); đúng mảng thương lượng nhiều vòng của bài."},
    {"id":"ZHenb2_eOTU","credit":"Adam’s English Lessons · engVid — Professional & Business English: Negotiating Vocabulary","dur":"12:50","lang":"en","note":"engVid: từ vựng đàm phán trong công việc (leverage, counter-offer, compromise…) có ví dụ; xem sau video trên."},
  ],
  't5d19-ngu-phap': [
    {"id":"K_XikoZwM3M","credit":"Arnel's Everyday English — if...MIXED CONDITIONALS | advanced English grammar","dur":"21:29","lang":"en","note":"Câu điều kiện hỗn hợp (quá khứ → hiện tại và ngược lại) giảng kỹ kèm ví dụ; dừng ở từng ví dụ tự xác định mốc thời gian của từng vế."},
    {"id":"OUwkVFgaL5E","credit":"English with Lucy — The Subjunctive in English - Complete Advanced English Grammar Lesson","dur":"7:55","lang":"en","note":"Thức giả định (I suggest that he be…, It is essential that…, If I were…) cấp nâng cao; đúng phần thức giả định của bài."},
  ],
  't5d19-doc': [
    {"id":"M_NP2v7rV8Y","credit":"IELTS Advantage — IELTS Reading Band 9 in 4 Steps (Simpler Than You Think)","dur":"15:26","lang":"en","note":"Bốn bước làm Reading của học viên band 9; dùng trước lần làm đủ đề thứ 2, chú ý bước kiểm lại câu đã khoanh."},
  ],
  't5d19-noi': [
    {"id":"D_npkVsb25o","credit":"Rachel's English — Shoulda, Woulda, Coulda - American English Pronunciation!","dur":"4:34","lang":"en","note":"Cách nói tắt would have / could have / should have → would’ve (“woulda”) trong lời nói nhanh; nghe và nhại theo, đúng phần 🔊 của bài."},
    {"id":"dmozaTka7zs","credit":"English with Emma · engVid — Speak English Naturally with WOULD contractions: I'D, YOU'D, HE'D...","dur":"5:32","lang":"en","note":"Dạng rút gọn của would (I’d, you’d, he’d…) và cách nghe phân biệt với had; nghe để nhận ra “if I’d …” trong câu giả định."},
  ],
  't5d20-viet': [
    {"id":"RTwTtu-YsnM","credit":"Fastrack IELTS — BAND 9 IELTS Writing Task 2 SAMPLE Essay | PROBLEM - SOLUTIONS","dur":"20:50","lang":"en","note":"Bài mẫu Problem – Solutions band 9 giải thích từng đoạn; chú ý giải pháp phải khớp đúng nguyên nhân đã nêu — như “giải pháp đúng tầng” của bài."},
    {"id":"TpUAgV-dTV4","credit":"IELTS with Juva — IELTS Writing Task 2 PROBLEM - SOLUTION Essay | BEST Structure for BAND 9","dur":"20:26","lang":"en","note":"Khung bài Problem – Solution band 9 và cách phát triển chuỗi cơ chế nguyên nhân → hệ quả; so với bài mẫu band 8 về cận thị ở trẻ em."},
  ],
  't5d20-nghe': [
    {"id":"gp3TF1Gz-qs","credit":"World Friends — ONE language, FIVE accents! Can you tell the difference?(US,UK,Australia,Ireland,New Zealand)","dur":"5:20","lang":"en","note":"Năm người nói cùng đoạn văn bằng năm giọng (Mỹ, Anh, Úc, Ireland, New Zealand); nghe để quen khác biệt nguyên âm trước bài giảng giọng Ireland / New Zealand."},
  ],
  't5d21-ngu-phap': [
    {"id":"4K0npnSYjJE","credit":"Adam’s English Lessons · engVid — English Grammar - Inversion: \"Had I known...\", \"Should you need...\"","dur":"7:38","lang":"en","note":"Đảo ngữ điều kiện “Had I known…”, “Should you need…” — dạng đảo ngữ “nói được” trong Part 3; nghe và đặt câu theo."},
    {"id":"zubBOxy6Qu4","credit":"English Speaking 360 — CLEFT SENTENCES Made Easy | All 6 Types Explained: It-Clefts, Wh-Clefts, Reversed clefts, and more!","dur":"25:44","lang":"en","note":"Sáu loại câu chẻ (it-cleft, wh-cleft, reversed…) kèm ví dụ; chú ý wh-cleft “What I find interesting is…” — dạng dùng tự nhiên nhất khi nói Part 3."},
  ],
  't5d21-doc': [
    {"id":"apOCnYpR-9g","credit":"IELTS Advantage — This BAND 9 IELTS Reading Strategy Changes Everything","dur":"10:37","lang":"en","note":"Cách người band 9 đọc bài Reading khác người khác (đọc hiểu một lượt thay vì dò đi dò lại); đúng chiến thuật “đọc một lượt, không quay lại” của bài."},
    {"id":"2KyxTcL-0ZM","credit":"Lilie IELTS — How This One Simple Method Helped Me Get Band 9 Twice in IELTS Reading","dur":"18:04","lang":"en","note":"Phương pháp làm Reading giúp tác giả hai lần đạt band 9 (đọc theo thứ tự câu hỏi, đánh dấu khi đọc); dùng để lập kế hoạch 55 phút của bạn."},
  ],
  't5d21-nghe': [
    {"id":"wv01kkwGzb8","credit":"BBC World Service — How to get your best night’s sleep - What in the World podcast, BBC World Service","dur":"13:03","lang":"en","note":"Podcast thật của BBC World Service tốc độ bản ngữ; nghe một lượt không phụ đề, tóm ý chính, rồi nghe lại có phụ đề kiểm tra."},
    {"id":"yoa0eIuWcsg","credit":"English with Lucy — British vs. New Zealand vs. Australian English Accents (+ Free PDF & Quiz)","dur":"18:24","lang":"en","note":"So sánh giọng Anh, New Zealand và Úc (nguyên âm, ngữ điệu, từ địa phương); hợp với podcast giọng New Zealand · Anh trong bài."},
  ],
  't5d22-tu-vung': [
    {"id":"0EPYNMJv-oQ","credit":"BBC Learning English — BOX SET: 6 Minute English - 'Artificial intelligence' English mega-class! 30 minutes of new vocab!","dur":"30:33","lang":"en","note":"Tổng hợp 6 Minute English chủ đề AI của BBC (30 phút, nhiều từ mới); nghe từng đoạn 6 phút, ghi từ dùng được cho đề Task 2 về AI và đạo đức."},
  ],
  't5d22-viet': [
    {"id":"UvsH5y91Eoo","credit":"Professor Mark Egan  — How to Write a Critical Analysis Essay (Professor Explains)","dur":"5:58","lang":"en","note":"Giáo sư giải thích cách viết bài phân tích phản biện: tóm nhận định, đánh giá bằng chứng, chỉ ra giả định và lỗ hổng; đúng khung bài phản biện ~300 từ."},
    {"id":"3gdMJ19QqRc","credit":"University of York Writing Centre — Building a critical argument","dur":"3:51","lang":"en","note":"Xây một lập luận phản biện trong văn học thuật (khác mô tả ở chỗ đánh giá); ngắn, xem trước khi viết đoạn phản biện."},
  ],
  't5d22-noi': [
    {"id":"fjgWwf5CYEI","credit":"IELTS with Charles — IELTS Speaking Band 7.5+ Mock Test with Feedback | IELTS with Charles","dur":"12:41","lang":"en","note":"Thi thử Speaking band 7.5+ có nhận xét từng điểm mạnh / yếu theo tiêu chí; xem như một lượt “mổ đề” mẫu trước khi tự mổ Speaking Đề 10."},
    {"id":"WP2LcgMq-_8","credit":"IELTS Advantage — How to Start IELTS Speaking Answers Like a Band 9 Student","dur":"14:56","lang":"en","note":"Cách mở câu trả lời như học viên band 9 (không lặp nguyên câu hỏi, paraphrase rồi vào thẳng ý); đúng phần paraphrase tinh của bài."},
  ],
  't5d23-ngu-phap': [
    {"id":"8X0qITD3VWk","credit":"TED-IELTS — How to Check your IELTS Essay for Mistakes","dur":"5:43","lang":"en","note":"Cách soát bài viết IELTS tìm lỗi theo từng lượt; dùng cùng bảng tự soát 6 lượt của bài."},
    {"id":"OH_uPnjRgEU","credit":"Dr Clare Lynch — Proofreading: catch more errors","dur":"7:26","lang":"en","note":"Mẹo đọc soát để bắt nhiều lỗi hơn (đọc chậm, đọc theo từng loại lỗi, đọc ngược); áp vào lượt soát cuối mỗi bài viết."},
  ],
  't5d23-doc': [
    {"id":"CjG2yIiA0Pc","credit":"Your Academic Voice — IELTS Reading Inference Questions: Master Them Easily!","dur":"13:33","lang":"en","note":"Câu hỏi suy luận (inference) trong Reading: đáp án không nằm sẵn trong chữ, phải nối các câu; dừng làm từng ví dụ trước khi xem giải."},
    {"id":"pE-ko4rSoaA","credit":"Lilie IELTS — my band 9 strategies for true false not given, matching information&multiple choice in ielts reading","dur":"35:28","lang":"en","note":"Chiến thuật band 9 cho TFNG, Matching information và trắc nghiệm, có phân tích bẫy; xem các đoạn về TFNG và trắc nghiệm để đối chiếu với tám bẫy của bài."},
  ],
  't5d23-noi': [
    {"id":"Cy-OmEB-L1w","credit":"IELTS Official — IELTS Speaking test sample - Part 3 (Monika, Band 8)","dur":"4:30","lang":"en","note":"Mẫu Part 3 band 8 chính thức của IELTS: nghe cách thí sinh trả lời câu hỏi trừu tượng, đưa góc nhìn khác mà vẫn lịch sự."},
    {"id":"2ANrFWj7LRA","credit":"IELTS by IDP — IELTS Speaking: Band 7 vs. Band 8 - Pronunciation","dur":"2:53","lang":"en","note":"Video chính thức của IDP: band 7 và band 8 khác nhau ở Pronunciation (nối âm, nhịp, ngữ điệu); hợp với phần 🔊 nối âm chuỗi của bài."},
  ],
  't5d24-tu-vung': [
    {"id":"h26AUbHfdXg","credit":"EAPFoundation.com — 25 Common Collocations for Academic English Writing","dur":"11:22","lang":"en","note":"25 collocation học thuật hay dùng (play a role, draw a conclusion, pose a threat…) kèm ví dụ; đúng phần cụm AWL làm khung câu của bài."},
  ],
  't5d24-viet': [
    {"id":"jVxx1c1cq1w","credit":"English Pro Tips - IELTS Preparation — Band 9 IELTS essay in 14 minutes -  Sentence by Sentence Breakdown","dur":"13:48","lang":"en","note":"Phân tích một bài Task 2 band 9 từng câu một trong 14 phút; xem để biết bài band 9 trông thế nào trước khi làm Writing Đề 11."},
    {"id":"5o_oph2vhGM","credit":"E2 IELTS — Band 9 IELTS Writing Sample: IELTS Exam Tips and Tricks","dur":"11:50","lang":"en","note":"Bài mẫu Writing band 9 kèm mẹo khi làm bài thi thật; xem lướt trước buổi làm đề 60 phút."},
  ],
  't5d24-nghe': [
    {"id":"VExCSkDBHDA","credit":"Fastrack IELTS — 3 IELTS Listening Techniques to Understand EVERYTHING","dur":"4:32","lang":"en","note":"Ba kỹ thuật nghe để không lỡ thông tin (đoán trước, theo dõi từ tín hiệu, nghe ý thay vì từ); dùng trước Listening Đề 11."},
  ],
  't5d25-ngu-phap': [
    {"id":"W5rhHdYEwY4","credit":"Maltalingua English Language School — Dependent Prepositions - Free English Vocabulary Lesson C1+ (Advanced)","dur":"5:05","lang":"en","note":"Giới từ cố định sau động từ / tính từ / danh từ ở mức C1+; dừng tự điền giới từ trước khi xem đáp án — đúng vùng lỗi giới từ cố định của bài."},
    {"id":"cPE_pSBfIUg","credit":"English with Greg — Which Preposition to Use after Verbs... EXPLAINED! 🔥","dur":"13:30","lang":"en","note":"Chọn giới từ đúng sau động từ (depend on, consist of, result in / from…) có giải thích logic; ghi các cặp hay sai vào sổ lỗi."},
  ],
  't5d25-doc': [
    {"id":"8ylh_iQhM6U","credit":"IELTS with Ralph — Best Strategy to Answer Multiple Choice Questions in IELTS Reading","dur":"9:36","lang":"en","note":"Chiến thuật trắc nghiệm Reading: loại phương án “đúng chủ đề nhưng sai vế”, “có chữ trong bài nhưng không trả lời câu hỏi”; đúng hai bẫy lặp lại của Đề 11."},
  ],
  't5d25-nghe': [
    {"id":"Z-S-NsbrPCQ","credit":"E2 IELTS — 8 things to know about computer-delivered IELTS Listening","dur":"7:03","lang":"en","note":"Tám điều cần biết về Listening trên máy tính (xem lại câu, chép đáp án trực tiếp, thời gian kiểm cuối 2 phút); đúng quy trình kiểm của bài thi máy."},
    {"id":"_O2RHxsAugg","credit":"IELTS Official — IELTS on computer - Listening test tutorial","dur":"2:11","lang":"en","note":"Hướng dẫn chính thức giao diện Listening trên máy tính của IELTS; xem để quen thao tác trước khi thi."},
  ],
  't5d26-viet': [
    {"id":"PZyZg70oe9A","credit":"Ross IELTS Academy — How to write a band 9 Overview in Academic IELTS Writing Task 1","dur":"6:47","lang":"en","note":"Cách viết overview band 9 cho Task 1 (chọn 2 đặc điểm chính, không số liệu); dùng làm khuôn cho 7 dạng biểu đồ của sprint."},
    {"id":"XN6lH3X50oQ","credit":"The IELTS Teacher — IELTS Writing Task 1: Overviews","dur":"13:01","lang":"en","note":"Overview Task 1 cho nhiều dạng (line, bar, pie, table, process, map) kèm ví dụ; luyện viết overview trong 3 phút cho mỗi dạng."},
  ],
  't5d26-noi': [
    {"id":"x3WIdoKq5FI","credit":"IELTS Jacky — Speaking Part 2 – Planning Strategy 1:  How To Prepare Your Talk in 1 Minute","dur":"7:42","lang":"en","note":"Cách lập kế hoạch bài nói trong 1 phút chuẩn bị (ghi từ khoá theo ô); đúng mảng ghi chú bốn ô của bài."},
  ],
  't5d27-ngu-phap': [
    {"id":"y0h3bgc7jZc","credit":"English with Lucy — The 7 Grammar Mistakes that Advanced Learners Make","dur":"12:29","lang":"en","note":"Bảy lỗi ngữ pháp người học trình độ cao vẫn mắc; đối chiếu với bảng 44 điểm và sáu cụm hay mất điểm của bài."},
    {"id":"79zqFG7zdnA","credit":"BBC Learning English — Grammar: Advanced Learner Mistakes - BBC English Masterclass","dur":"3:29","lang":"en","note":"BBC: các lỗi ngữ pháp tinh của người học nâng cao; ngắn, xem rồi tự kiểm bài viết gần nhất của bạn."},
  ],
  't5d27-doc': [
    {"id":"N0RxRl9allI","credit":"IELTS Advantage — Get Band 9 After Using These Reading Strategies","dur":"15:09","lang":"en","note":"Các chiến thuật Reading giúp lên band 9 (đọc hiểu, quản lý thời gian, xử lý câu khó); xem trước lần làm đủ đề thứ 3."},
  ],
  't5d27-noi': [
    {"id":"1MMIoxZVjV0","credit":"E2 IELTS — IELTS Speaking Part 3 -  Questions with Jay & Alex","dur":"22:35","lang":"en","note":"E2 thực hành Part 3 với nhiều kiểu câu hỏi (so sánh, dự đoán, đánh giá, nguyên nhân); đúng sprint Part 3 nhiều chức năng câu hỏi của bài."},
    {"id":"82684V9YvG0","credit":"IELTS Energy TV — Fabulous Formal Fillers for IELTS Speaking Part 3","dur":"4:07","lang":"en","note":"Các cụm “mua thời gian” trang trọng dùng ở Part 3 (That’s an interesting question…, I’ve never really thought about…); nghe và nói nhanh, giọng thấp như bài yêu cầu."},
  ],
  't5d28-viet': [
    {"id":"0JJHbByTYis","credit":"Lilie IELTS — how to *fully develop* body paragraphs - writing task 2 double question/two-part question essay","dur":"11:07","lang":"en","note":"Cách phát triển đầy đủ đoạn thân bài cho dạng hai câu hỏi (two-part question); chú ý hai nửa cân nhau như bài mẫu band 8."},
    {"id":"u9mQJ8dPysM","credit":"IELTS Jacky — IELTS Writing Task 2 – How To Write Double Question Essays","dur":"19:59","lang":"en","note":"Cách viết bài dạng hai câu hỏi (double question): trả lời đủ từng câu, một lập trường xuyên suốt; xem trước khi viết đề của bài."},
  ],
  't5d28-nghe': [
    {"id":"S_TVcsCFpTM","credit":"IELTS Advantage — Get BAND 9 After Using These Listening Tips","dur":"31:59","lang":"en","note":"Hai học viên kẹt ở band 7 Listening và điều họ đổi để lên band 9; xem trước đề Listening đủ 40 câu, mục tiêu 35+."},
  ],
  't5d29-ngay-thi': [
    {"id":"bOQOxGjm8rY","credit":"E2 IELTS — IELTS Test Day 2026: What It Actually Looks Like","dur":"11:22","lang":"en","note":"Ngày thi IELTS thực tế diễn ra thế nào (giấy tờ, phòng thi, thứ tự các phần); xem để không bất ngờ trong ngày thi thật."},
    {"id":"OYS3ys_iTpw","credit":"TakeIELTS Official — IELTS One Skill Retake - What is IELTS One Skill Retake?","dur":"2:34","lang":"en","note":"Video chính thức: One Skill Retake là gì, ai được thi lại một kỹ năng; đúng phần One Skill Retake của bài."},
  ],
  't5d29-doc': [
    {"id":"BQbXC22Yujc","credit":"Fastrack IELTS — IELTS Reading Question Types | Strategy & Practice","dur":"20:22","lang":"en","note":"Tổng hợp các dạng câu hỏi Reading kèm chiến thuật và luyện tập; dùng để soát checklist 16 dạng của bài."},
  ],
  't5d29-nghe': [
    {"id":"m7jjTTsbjec","credit":"Fastrack IELTS — The Ultimate Guide to IELTS Listening","dur":"20:49","lang":"en","note":"Hướng dẫn trọn bài Listening: mọi dạng câu, luật chép đáp án, bẫy; dùng để soát checklist 14 dạng Listening."},
    {"id":"Z16XUXJyVIk","credit":"IELTS Jacky — IELTS Listening – The 10 Types of Questions","dur":"8:39","lang":"en","note":"Các dạng câu hỏi Listening được liệt kê và giải thích ngắn; xem để kiểm bạn nhớ đủ dạng."},
  ],
  't5d30-tu-vung': [
    {"id":"T_e_NlAX3yE","credit":"The Present Writer — Học TỪ VỰNG tiếng Anh hiệu quả với phương pháp Spaced Repetition","dur":"11:33","lang":"en","note":"Phương pháp lặp lại ngắt quãng (spaced repetition) để nhớ từ lâu; dùng khi lập lịch ôn sau khoá như bài hướng dẫn."},
  ],
  't5d30-viet': [
    {"id":"w_HVUbayNF0","credit":"English Pro Tips - IELTS Preparation — IELTS Writing Guide | Band Descriptors Explained","dur":"27:53","lang":"en","note":"Giải thích band descriptors Writing theo 4 tiêu chí; dùng làm thước tự chấm bài viết lại theo 4 tiêu chí band 8."},
    {"id":"WmAQIHcS87g","credit":"IELTS Advantage — From Band 6.5 to 8: IELTS Writing Makeover","dur":"33:33","lang":"en","note":"Sửa một bài viết thật từ band 6.5 lên 8 từng câu; xem cách viết lại để áp vào bài yếu nhất của bạn."},
  ],
  't5d30-noi': [
    {"id":"zcWIcECLKmo","credit":"IELTS Advantage — IELTS Speaking Test with Feedback – Band 8.5 [+ Free Speaking PDF]","dur":"10:58","lang":"en","note":"Bài thi Speaking band 8.5 có nhận xét của giáo viên; xem trước buổi thi với giám khảo AI, ghi lại dấu hiệu band 8 ở cả 4 tiêu chí."},
    {"id":"vy0cP4G0wIo","credit":"Ross IELTS Academy — IELTS Speaking Test Band Score 8.5 | Full Feedback & Tips (2025)","dur":"17:31","lang":"en","note":"Thêm một bài thi Speaking band 8.5 có nhận xét đầy đủ; so sánh với câu trả lời của chính bạn ở Speaking Đề 12."},
  ],
};
