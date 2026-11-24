/**
 * 🎬 Video bài giảng của IELTS Tập 4 — khoá = id bài (`t4dN-…`, `t4-bat-dau`), hiện đầu bài (VideoBai.tsx).
 * Cùng quy trình và định dạng với `../videos.ts` của Tập 1 (oEmbed + playabilityStatus OK + playableInEmbed;
 * kiểm cả loạt: `node scripts/yt-check.mjs <id…>`). Không dùng lại ID đã gắn ở Tập 1–3 / Tập 5 cho cùng nội dung.
 * Mức band 6–7: Passage 3, bài giảng Part 4, collocation học thuật, Writing / Speaking band 7 (so sánh band 6 vs 7).
 * Bài homework / review không gắn; t4d13-nghe để trống vì chưa có video Table / Summary completion Part 4 đủ tốt.
 */
import type { LessonVideo } from '@/components/sach-hoc/types';

export const VIDEO_BAI_T4: Record<string, LessonVideo[]> = {
  't4-bat-dau': [
    {"id":"baIkTadn2oA","credit":"IELTS Advantage — From Band 6 to 8 Using One Simple Strategy","dur":"8:00","lang":"en","note":"Câu chuyện một học viên kẹt ở band 6 qua nhiều lần thi và cách đổi chiến lược để vượt lên; xem trước khi vào Ngày 1 để hiểu vì sao Tập 4 soi từng lỗi nhỏ thay vì học thêm mẹo."},
  ],
  't4d1-ngu-phap': [
    {"id":"q-Jkx670rT8","credit":"BBC Learning English — GRAMMAR: How to use the definite article with abstract uncountable nouns","dur":"6:05","lang":"en","note":"BBC giảng mạo từ the với danh từ trừu tượng không đếm được (đúng phần ★ của bài: phần bổ nghĩa phía sau quyết định có the hay không); dừng ở mỗi ví dụ, tự nói câu trước khi nghe đáp án."},
    {"id":"tjPoypKI11g","credit":"mmmEnglish — Uncountable English Nouns | Fix Common Grammar Mistakes & Errors","dur":"9:33","lang":"en","note":"mmmEnglish sửa lỗi danh từ không đếm được hay gặp (research, advice, evidence…); xem xong đối chiếu với danh sách 30 từ không thêm -s trong bài."},
  ],
  't4d1-doc': [
    {"id":"WBH8g2_f6x8","credit":"IELTS with Juva — IELTS Reading Practice Test (Passage 3) -  Multiple Choice - YES NO NOT GIVEN -Flow Chart Completion","dur":"38:37","lang":"en","note":"Luyện trọn một Passage 3 có YES / NO / NOT GIVEN, Multiple choice và Flow-chart, giải thích cách định vị ý trong văn bản lập luận; tự làm (dừng hình) trước khi xem giải, có thể xem 1.25×."},
  ],
  't4d1-nghe': [
    {"id":"lrLWiteBdnw","credit":"IELTS Liz — IELTS Listening for Plurals","dur":"12:26","lang":"en","note":"IELTS Liz luyện nghe -s số nhiều (bẫy mất điểm số 1 của Part 1); làm theo các câu trong video, ghi đáp án ra giấy rồi mới xem giải."},
    {"id":"rU4pdykPl6Y","credit":"English Lessons with Dori — IELTS Listening: Spelling TIPS- english video","dur":"8:02","lang":"en","note":"Những kiểu đánh vần gặp ở Section 1 và đáp án viết thế nào thì được chấp nhận; dùng cùng bảng soát 8 dòng của bài."},
  ],
  't4d2-tu-vung': [
    {"id":"7wS5WEMpg1g","credit":"IELTS Charlie — Learn 20 Advanced Environment Words for IELTS","dur":"21:12","lang":"en","note":"20 từ môi trường nâng cao kèm cách dùng trong câu; ghi lại cụm nào chưa có trong sổ (net zero, mitigate, tipping point…) và tự đặt câu Task 2."},
  ],
  't4d2-viet': [
    {"id":"x1Yk1Nrz8Ek","credit":"IELTS Understood — What a Band 7 IELTS Writing Task 2 Essay REALLY Looks Like","dur":"24:54","lang":"en","note":"Một bài Task 2 band 7 thật sự trông thế nào, soi theo 4 tiêu chí; xem song song với hai bài mẫu band 6 / band 7 của bài học, đánh dấu chỗ làm nên khác biệt."},
    {"id":"yG0VhICSLqk","credit":"E2 IELTS — E2 IELTS Writing | 7 Steps to Achieve Band 7+","dur":"14:33","lang":"en","note":"E2 tóm 7 bước để Task 2 lên band 7+; dùng làm bảng tự kiểm khi viết lại bài cũ ở cuối bài học."},
  ],
  't4d2-noi': [
    {"id":"FjgeI68Iry8","credit":"English Speaking Success — IELTS Speaking Part 1: Answer Any Question Confidently (Band 7+)","dur":"12:34","lang":"en","note":"Keith O'Hare (IELTS Speaking Success) dạy trả lời Part 1 band 7+: thẳng ý rồi thêm chi tiết cụ thể; dừng sau mỗi câu hỏi mẫu, tự trả lời 15–20 giây rồi mới nghe mẫu."},
  ],
  't4d3-ngu-phap': [
    {"id":"4pEchpp9pIc","credit":"Academic English UK — Academic Grammar: the most common tenses in academic writing","dur":"7:53","lang":"en","note":"Những thì dùng nhiều nhất trong văn học thuật và lý do dùng (hiện tại đơn cho sự thật, hiện tại hoàn thành cho xu hướng tới nay, quá khứ cho nghiên cứu đã làm); xem trước phần lý thuyết của bài."},
    {"id":"sS3YBvaq5Bk","credit":"IELTS-Blog — How to use the Present Perfect verb tense correctly and get Band 7, 8 or 9 in IELTS","dur":"12:14","lang":"en","note":"Dùng hiện tại hoàn thành đúng trong IELTS (since / for, xu hướng kéo tới hiện tại, phân biệt với quá khứ đơn); làm ví dụ trong video rồi đối chiếu với phần luyện chia thì của bài."},
  ],
  't4d3-doc': [
    {"id":"7U91NAQzSys","credit":"E2 IELTS — IELTS Reading Match Headings with Alex","dur":"18:36","lang":"en","note":"E2 giảng Matching Headings: đọc ý chính của cả đoạn (không săn từ khoá), loại tiêu đề chỉ khớp một chi tiết; làm cùng ví dụ trong video trước khi xem giải."},
    {"id":"mbUFS-CQt60","credit":"The Forum  — Siêu Hot - Hướng dẫn Matching Heading siêu khó cùng anh Huy 9.0 IELTS | THE FORUM CENTER","dur":"36:24","lang":"vi","note":"Huy Forum chữa một bài Matching Headings rất khó, nơi tiêu đề nói bằng ý ẩn chứ không lặp từ (tiếng Việt); xem sau khi đã tự làm bài đọc của ngày."},
  ],
  't4d3-noi': [
    {"id":"MVT2aL4L9Eg","credit":"English Speaking Success — Advanced connectors and phrases for IELTS Speaking: How to give opinions","dur":"22:28","lang":"en","note":"Keith O'Hare dạy từ nối và cụm nêu ý kiến linh hoạt cho Speaking (không lặp “I think”); chép lại 8–10 cụm hợp giọng mình rồi dùng ngay trong phần luyện Part 3."},
    {"id":"HvdcDzG56ik","credit":"IELTS Official — IELTS Speaking test sample - Part 3 (Hendrik, Band 7)","dur":"4:58","lang":"en","note":"Mẫu Part 3 band 7 thật của IELTS Official; nghe cách thí sinh chuyển giữa quá khứ – hiện tại – tương lai và nối ý, rồi tự trả lời lại cùng câu hỏi."},
  ],
  't4d4-tu-vung': [
    {"id":"p3nTto5TvEE","credit":"IELTS with Charles — IELTS Speaking Phrases: Happiness | Band 7+ Vocabulary","dur":"6:21","lang":"en","note":"Cụm từ chủ đề hạnh phúc ở mức band 7+ dùng được trong Speaking; tự nói lại một câu trả lời có 2–3 cụm mới."},
    {"id":"oRO9kdtl8m8","credit":"Learn English Lab — 20-Minute Psychology & Mental Health Vocabulary || English Listening Practice Podcast","dur":"20:12","lang":"en","note":"Bài nghe dạng podcast 20 phút về từ vựng tâm lý và sức khoẻ tinh thần; bật phụ đề tiếng Anh lượt đầu, lượt hai tắt phụ đề và chép lại từ chưa có trong sổ."},
  ],
  't4d4-nghe': [
    {"id":"8wr7ZYaqdrw","credit":"Asad Yaqub IELTS — IELTS LISTENING MCQs In Part 2 By Asad Yaqub","dur":"19:54","lang":"en","note":"Chiến thuật Multiple choice riêng cho Part 2 Listening: phương án bị paraphrase, phương án được nhắc rồi bị loại; làm cùng các câu trong video trước khi xem giải."},
    {"id":"cm4DQkuQHiM","credit":"Lilie IELTS — how I got 8.5 THREE TIMES in ielts listening//my secret for handling multiple choice questions","dur":"16:36","lang":"en","note":"Lilie (8.5 Listening ba lần) chia sẻ cách xử lý câu hỏi trắc nghiệm dài: đọc gì trước, nghe gì để loại; áp ngay vào bài nghe Part 2 của ngày."},
  ],
  't4d4-viet': [
    {"id":"1gmPcH0a07E","credit":"Lilie IELTS — how to write a *detailed* example in ielts writing task 2","dur":"14:09","lang":"en","note":"Lilie dạy viết ví dụ CỤ THỂ trong Task 2 (thay cho câu khái quát) — đúng tầng thứ ba của “ý mở rộng ba tầng”; sau khi xem, viết lại ví dụ trong đoạn thân bài của bạn."},
    {"id":"rXVR-nE2jvw","credit":"IELTS Advantage — How To Write A Band 9 Task 2 Main Body Paragraph","dur":"36:29","lang":"en","note":"IELTS Advantage dựng một đoạn thân bài band 9 từ ý chính → giải thích → ví dụ; xem đoạn đầu ~20 phút là đủ ý cho bài, phần còn lại xem khi rảnh."},
  ],
  't4d5-ngu-phap': [
    {"id":"H8E5EF0IEN0","credit":"BBC Learning English — How to use participle clauses - improve your grammar with English Masterclass from the BBC","dur":"4:09","lang":"en","note":"BBC Masterclass về participle clauses (V-ing / V-ed / having V3 rút gọn mệnh đề); ngắn, xem trước rồi làm phần biến đổi câu của bài."},
    {"id":"wGIMv4p5-u8","credit":"English with Em — Reduced relative clauses – Advanced English Grammar for Academic Writing","dur":"24:47","lang":"en","note":"Rút gọn mệnh đề quan hệ cho văn học thuật (chủ động → V-ing, bị động → V3) và lỗi chủ ngữ treo; xem đoạn đầu ~15 phút, đối chiếu với phần “chủ ngữ treo” của bài."},
  ],
  't4d5-doc': [
    {"id":"-yUsaA2-MsM","credit":"IELTS Jacky — IELTS Reading – How To Answer True, False, Not Given Questions","dur":"14:35","lang":"en","note":"Cách làm True / False / Not Given theo từng bước và cách phân biệt FALSE với NOT GIVEN; tự làm ví dụ trong video trước, đối chiếu với ba bẫy band 7 trong bài."},
  ],
  't4d5-nghe': [
    {"id":"1fsun94V2e8","credit":"IELTS Worldly — IELTS Listening Matching Questions: 13 Tips and Strategies for Academic and General Training","dur":"4:07","lang":"en","note":"13 mẹo cho dạng Matching trong Listening (đọc trước danh sách, nghe paraphrase, cẩn thận khi người nói đổi ý); ngắn, xem trước bài nghe Part 3 bốn người."},
  ],
  't4d6-tu-vung': [
    {"id":"4PQWUaR-kbQ","credit":"To The Point English with Ben.  — VERB + NOUN COLLOCATIONS - Advanced English vocabulary for your exam","dur":"14:03","lang":"en","note":"Collocation động từ + danh từ ở mức nâng cao (pose a threat, conduct research…); dừng ở mỗi cụm, tự đặt một câu Task 2 dùng cụm đó."},
    {"id":"f--9qW3NnQo","credit":"Fastrack IELTS — IELTS Writing Task 2 VOCABULARY | Collocations","dur":"11:27","lang":"en","note":"Collocation cho Task 2 của Fastrack IELTS; chép những cụm khớp chủ đề bạn hay gặp và thêm vào sổ collocation của bài."},
  ],
  't4d6-viet': [
    {"id":"lXrSfpQfyNc","credit":"AB:C — IELTS Writing Task 1 Written Step by Step: Line Graph, Band 7 to Band 9","dur":"27:59","lang":"en","note":"Một bài line graph viết ở band 7 rồi viết lại lên band 8 và 9 — thấy rõ khác biệt giữa các bậc; xem đoạn bài band 7 trước, so với bài của bạn."},
  ],
  't4d6-noi': [
    {"id":"gGPJWl0bIoU","credit":"IELTS with Charles — IELTS Speaking Part 2 | How To Talk About People (Band 7+)","dur":"7:05","lang":"en","note":"Cách nói về một người trong Part 2 ở mức band 7+ (ngoại hình ít thôi, kể việc người đó làm); áp vào đề tả người của ngày."},
    {"id":"53uFAQ7ulTg","credit":"The IELTS Workshop — BÀI MẪU SPEAKING IELTS PART 2 - DESCRIBE A BEAUTIFUL PLACE | SPEAKING SAMPLE by The IELTS Workshop","dur":"5:50","lang":"en","note":"Bài mẫu Part 2 tả một nơi đẹp, có mạch kể; nghe cách đặt một câu chuyện nhỏ vào phần tả nơi chốn rồi tự nói lại 2 phút."},
  ],
  't4d7-ngu-phap': [
    {"id":"P7dcdEoNA_E","credit":"BBC Learning English — Grammar: Giving emphasis in English - BBC English Masterclass","dur":"3:29","lang":"en","note":"BBC Masterclass về cách nhấn mạnh trong tiếng Anh (câu chẻ It is… that…, What… is…); ngắn, xem trước phần câu chẻ của bài."},
    {"id":"AzNxZGC-Hg0","credit":"BBC Learning English — BBC English Masterclass: Inversion 1: After Negative or Limiting Adverbs","dur":"3:43","lang":"en","note":"BBC Masterclass về đảo ngữ sau trạng từ phủ định / hạn chế (Never have…, Not only…); xem trước phần đảo ngữ, nhớ lời khuyên “đúng liều” của bài."},
  ],
  't4d7-doc': [
    {"id":"47E909Irq8Q","credit":"Total-IELTS — How to Ace IELTS Reading: Multiple Choice Strategies","dur":"7:40","lang":"en","note":"Chiến thuật Multiple choice trong Reading: đọc câu hỏi trước, định vị đoạn, loại phương án đúng thông tin nhưng không trả lời câu hỏi; xem trước bài Passage 3 của ngày."},
    {"id":"82X8HlM4_cM","credit":"The Forum  — Cách làm hiệu quả dạng Reading Multiple Choice | THE FORUM CENTER","dur":"5:27","lang":"vi","note":"The Forum hướng dẫn ngắn cách làm Multiple choice trong Reading (tiếng Việt); xem như phần ôn nhanh."},
  ],
  't4d7-noi': [
    {"id":"L0WEtMXptG4","credit":"IELTSlab — IELTS Speaking Part 3 - Predicting","dur":"14:18","lang":"en","note":"Kiểu câu hỏi dự đoán tương lai trong Part 3 và cách trả lời có mức chắc chắn (likely, I'd imagine…); tự trả lời các câu trong video trước khi nghe mẫu."},
  ],
  't4d8-tu-vung': [
    {"id":"6IzsMds3kuE","credit":"IELTS Charlie — IELTS Vocabulary Builder: Healthcare","dur":"12:00","lang":"en","note":"Từ vựng hệ thống y tế (healthcare) cho IELTS, mức band 7; ghi lại cụm về chính sách y tế dùng được trong Task 2 / Part 3."},
    {"id":"Qc2g-AwjrGg","credit":"English Lessons with Kate — Smart English Idioms to Describe Character and Personality | Upgrade your English","dur":"9:42","lang":"en","note":"Thành ngữ tả tính cách người (smart idioms) kèm ví dụ; chọn 3–4 thành ngữ hợp với bạn để dùng trong Speaking, không dùng trong Writing."},
  ],
  't4d8-nghe': [
    {"id":"_6jgygopp40","credit":"IELTS Liz — IELTS Listening Tips: Predicting Answers","dur":"10:22","lang":"en","note":"IELTS Liz dạy đoán trước đáp án (loại từ, số / chữ) — kỹ năng chính của Note completion trong bài giảng Part 4; luyện theo các ví dụ trong video."},
    {"id":"7Xzz0Wgqe28","credit":"IELTSMaterial - IELTS Preparation & Study Abroad — IELTS 2024 Listening Sentence Completion Tips (Target Band 8.5)","dur":"10:36","lang":"en","note":"Mẹo Sentence completion trong Listening (đọc giới hạn số từ, nghe paraphrase); dùng cho nửa câu 6–10 của bài giảng Part 4."},
  ],
  't4d8-viet': [
    {"id":"7yroT9XB_mw","credit":"IELTS OVERSIMPLIFIED — IELTS Writing Task 1 - Stacked Bar Chart (Working Patterns)","dur":"13:22","lang":"en","note":"Tả biểu đồ cột chồng (stacked bar) từng bước: mỗi cột là một tổng chia phần; đúng dạng bài của ngày, xem trước khi viết."},
    {"id":"uGOSXlQUTT4","credit":"AcademicEnglishHelp — IELTS Task 1 Bar Graphs Vocabulary and Strategy","dur":"10:04","lang":"en","note":"Từ vựng và chiến thuật cho bar graph (so sánh cột, nhóm số liệu, overview); dùng cho phần cột nhóm (grouped) của bài."},
  ],
  't4d9-ngu-phap': [
    {"id":"NpydaXt-Lg8","credit":"English with D — IELTS WRITING TASK 1 FUTURE PREDICTIONS AND TRENDS","dur":"8:29","lang":"en","note":"Cách viết dự báo và xu hướng tương lai trong Task 1 kèm câu mẫu; đối chiếu với bảng ngôn ngữ so sánh & dự báo của bài."},
  ],
  't4d9-doc': [
    {"id":"l3yWmXbC36s","credit":"Khan Academy — Analyzing tone through word choice | Reading | Khan Academy","dur":"5:05","lang":"en","note":"Khan Academy: đọc ra giọng điệu tác giả qua cách chọn từ; ngắn, xem trước phần suy luận giọng điệu (mỉa mai, dè dặt) của bài."},
    {"id":"6_cQCglIJy8","credit":"Megan Hall — Identifying an Author's Tone","dur":"15:45","lang":"en","note":"Bài giảng nhận diện giọng điệu tác giả và phân biệt tone với mood, có nhiều ví dụ; xem để mở rộng vốn từ chỉ giọng điệu (sceptical, ironic…) dùng trong câu hỏi trắc nghiệm."},
  ],
  't4d9-nghe': [
    {"id":"fEe-G3jkjmA","credit":"Arion Training Systems — IELTS Listening Part 1 & 2: Spot Distractors Before the Audio | Cambridge 12","dur":"33:40","lang":"en","note":"Tập nhận ra mồi nhử của Part 1 và Part 2 NGAY khi đọc câu hỏi, trước khi băng chạy (đề Cambridge 12); xem trước đề nhỏ 20 câu một lần nghe của ngày."},
  ],
  't4d10-tu-vung': [
    {"id":"tiGWQpNTQFw","credit":"IELTS Plus — IELTS English Podcast - Speaking Topic: Art","dur":"7:14","lang":"en","note":"Podcast IELTS chủ đề Art: từ vựng nghệ thuật trong câu trả lời thật; bật phụ đề, chép cụm dùng được cho Part 3 về nghệ thuật."},
    {"id":"H079cxQ4jKk","credit":"JForrest English — 21 Confusing English Words | English Vocabulary","dur":"23:51","lang":"en","note":"21 cặp từ dễ nhầm và cách dùng đúng; dừng ở mỗi cặp, tự đặt câu rồi đối chiếu với phần sắc thái từ đồng nghĩa của bài."},
  ],
  't4d10-viet': [
    {"id":"qPPJKOnTuTA","credit":"IELTS with Juva — Discussion Essay IELTS Writing Task 2 | Band 9 SAMPLE ANSWER and Structure","dur":"19:51","lang":"en","note":"Cấu trúc bài Discussion (discuss both views and give your opinion) và bài mẫu band 9; chú ý cách thesis nêu lập trường ngay mở bài và đánh giá từng góc."},
  ],
  't4d10-noi': [
    {"id":"Qx4DzLeNUY4","credit":"Tony IELTS Box — IELTS Speaking Part 2: Describe an Object You Use Every Day | Band 8 Sample Answer","dur":"8:50","lang":"en","note":"Năm cách kéo dài câu trả lời khi tả đồ vật trong Part 2 (so sánh, quay về quá khứ, thói quen, tưởng tượng mất nó, nhìn rộng ra); thử từng cách với đề của ngày."},
    {"id":"GwSqwhmyWCs","credit":"IELTS with Charles — 5 Everyday Idioms Used by Native Speakers (Perfect for IELTS Speaking)","dur":"7:50","lang":"en","note":"Năm thành ngữ đời thường người bản xứ hay dùng, kèm cách cài vào câu trả lời Speaking; chọn 1–2 cái hợp với đề tả đồ vật / hoạt động của bạn."},
  ],
  't4d11-ngu-phap': [
    {"id":"q18hOBP49KM","credit":"Get Grammarous with Kerry Sensei — NOUN CLAUSES | Advanced English","dur":"6:27","lang":"en","note":"Mệnh đề danh ngữ (that / wh- / whether…) ở mức nâng cao, làm chủ ngữ và tân ngữ; dừng ở ví dụ, tự viết lại câu dài theo mẫu."},
    {"id":"NBO021DwP48","credit":"JForrest English — GERUND (ing) or INFINITIVE (to) – Everything You Need to Know!","dur":"18:11","lang":"en","note":"Gerund (V-ing) hay infinitive (to V): quy tắc, động từ đổi nghĩa và lỗi hay gặp; xem trước phần verb pattern của bài."},
  ],
  't4d11-doc': [
    {"id":"9xWGL7KJ3vI","credit":"IELTS THÊM PHẠM — Tuyệt chiêu xử lý dạng bài NOTE COMPLETION trong IELTS Reading","dur":"6:31","lang":"en","note":"Mẹo làm Note completion trong Reading (đoán loại từ, giới hạn số từ, tìm theo thứ tự); xem trước bài đọc Passage 3 của ngày."},
  ],
  't4d11-noi': [
    {"id":"GqHqM_pYKT4","credit":"IELTS with Charles — IELTS Speaking Part 3: Brand New Technique! (Contrasting Society) | Band 6.5+","dur":"7:52","lang":"en","note":"Kỹ thuật Part 3 “đối chiếu xã hội” (so hai nhóm người / hai thời điểm) để câu trả lời có mức độ và có chiều sâu; áp vào câu hỏi “To what extent…?”: nói rõ đồng ý tới đâu rồi chống đỡ bằng phép so sánh."},
  ],
  't4d12-tu-vung': [
    {"id":"R4hxNtMRInU","credit":"Beautiful British English — Describing Numbers Percentages & Fractions for IELTS Academic Writing Task 1","dur":"15:14","lang":"en","note":"Cách diễn đạt số, phần trăm và phân số trong Task 1 (a third, the vast majority, roughly half…); xem trước phần tỉ lệ / gộp nhóm của bài."},
    {"id":"IBfi9h56o3A","credit":"IELTS ASMR — “Đa dạng hóa cấu trúc report số liệu” | IELTS writing TASK 1","dur":"8:53","lang":"en","note":"Đa dạng cấu trúc câu khi báo cáo số liệu Task 1 để không lặp một khuôn; chép các khuôn hay rồi viết lại 2 câu của bạn."},
  ],
  't4d12-nghe': [
    {"id":"7NtwJNJCOHQ","credit":"IELTS Nguyễn Huyền — IELTS Listening Dạng Flowchart Completion","dur":"20:09","lang":"vi","note":"Hướng dẫn trọn dạng Flow-chart completion trong Listening (tiếng Việt): đọc mạch các bước trước, nghe theo thứ tự, cẩn thận khi người nói đổi ý; xem trước bài nghe Part 3."},
  ],
  't4d12-viet': [
    {"id":"EWLelXJ2ecM","credit":"IELTS Official — Coherence and Cohesion in the IELTS Writing test","dur":"4:52","lang":"en","note":"IELTS Official giải thích tiêu chí Coherence & Cohesion trong Writing — chấm thế nào, không chỉ đếm từ nối; xem trước khi viết lại đoạn của bài."},
    {"id":"TiY6Sp3dWSk","credit":"Fastrack IELTS — Master IELTS Writing Coherence & Cohesion | 3 Elements for Band 9","dur":"13:44","lang":"en","note":"Ba thành phần của liên kết band cao (tham chiếu, chia đoạn, từ nối đúng liều); đối chiếu với phần this / such + danh từ tóm của bài."},
  ],
  't4d13-ngu-phap': [
    {"id":"avN7bygyYaA","credit":"English Pro Tips - IELTS Preparation — Hedging in IELTS Writing and Speaking","dur":"18:25","lang":"en","note":"Hedging trong IELTS Writing và Speaking: modal, động từ rào đón, cấu trúc vô nhân xưng (It is believed that…); làm ví dụ trong video rồi viết lại 3 câu khẳng định quá chắc của bạn."},
    {"id":"Q2nEU8YaJso","credit":"i-Speak English — Cambridge C1 Grammar Ellipsis & Substitution - Essential English Grammar for CAE Advanced Exam","dur":"11:39","lang":"en","note":"Ellipsis và substitution mức C1 (one / do so / so / not…), đúng phần liên kết nâng cao của bài; dừng ở mỗi ví dụ để tự rút gọn câu."},
  ],
  't4d13-doc': [
    {"id":"G8Y2liwGRl8","credit":"IELTS Advantage — IELTS Reading Tips + Tricks: Ultimate Guide 2027","dur":"14:41","lang":"en","note":"Tổng hợp mẹo Reading của IELTS Advantage, gồm chia thời gian cho cả 3 passage; xem trước khi làm đề đủ 40 câu trong 60 phút."},
  ],
  't4d14-tu-vung': [
    {"id":"N8VAEBGNNZ4","credit":"IELTS Plus — IELTS English Podcast - Speaking Topic: Money","dur":"11:17","lang":"en","note":"Podcast IELTS chủ đề Money: từ vựng tiền bạc và tiêu dùng trong câu trả lời Speaking; bật phụ đề, chép cụm dùng được."},
    {"id":"EQuzh8nuWng","credit":"IELTS Plus — IELTS English Podcast - Speaking Topic: Helping & Charity","dur":"10:40","lang":"en","note":"Podcast IELTS chủ đề giúp đỡ & từ thiện, phần tình nguyện vòng 2 của bài; nghe rồi tự trả lời một câu hỏi Part 3 về tình nguyện."},
  ],
  't4d14-viet': [
    {"id":"KjD2TgxreSU","credit":"Học IELTS Writing không khó cùng IELTS Thanh Loan — Bài 28: Template dang Advantages Outweigh Disadvantages IELTS Writing Task 2 cực đỉnh","dur":"28:56","lang":"vi","note":"IELTS Thanh Loan giảng dàn bài dạng “Do the advantages outweigh the disadvantages?” (tiếng Việt): thesis phải nêu rõ bên nào nặng hơn; đối chiếu với phần phán quyết “outweigh” của bài."},
  ],
  't4d14-noi': [
    {"id":"AQchmQYjqdk","credit":"IELTS with Charles — IELTS Speaking Band 7: Festivals | Sample Answers with Advanced Vocabulary","dur":"10:31","lang":"en","note":"Câu trả lời mẫu band 7 chủ đề lễ hội / sự kiện có từ vựng nâng cao; nghe cách kể một sự kiện có khoảnh khắc đáng nhớ rồi tự kể theo 5 chặng của bài."},
  ],
  't4d15-ngu-phap': [
    {"id":"WJ9IJrLGX6Q","credit":"Fastrack IELTS — 11 Linking Words to Nail Your IELTS Writing","dur":"19:33","lang":"en","note":"11 từ nối dùng đúng trong IELTS Writing và vị trí của chúng trong câu / đoạn; chú ý lời nhắc không nhồi từ nối, đúng tinh thần “đúng liều” của bài."},
  ],
  't4d15-doc': [
    {"id":"RYRoZTQnDMM","credit":"IELTS with Juva — IELTS Reading Matching Sentence Endings - BEST Tips and Practice Test","dur":"15:59","lang":"en","note":"Mẹo và bài luyện Matching sentence endings: dùng nghĩa chứ không chỉ ngữ pháp để loại đuôi câu; làm phần luyện trong video trước khi xem giải."},
  ],
  't4d15-noi': [
    {"id":"q03C_WBqy9I","credit":"The IELTS Workshop — [IELTS 4 Skills] 6 Tips Trả Lời Câu Hỏi Khó Trong Speaking Part 3 Từ Thầy Đặng Trần Tùng","dur":"6:52","lang":"en","note":"6 mẹo trả lời câu hỏi Part 3 khó (giải thích nguyên nhân – hệ quả, đưa ví dụ); áp vào phần lập luận chuỗi của bài."},
    {"id":"UD8v2G-zVlc","credit":"Pronunciation with Emma — Speak English more fluently with 'thought groups' (linking, rhythm, and pausing)","dur":"10:26","lang":"en","note":"Nhóm ý (thought groups) và chỗ ngắt nghỉ để nói trôi và rõ nghĩa — đúng phần 🔊 pause mang nghĩa; nói theo từng ví dụ trong video."},
  ],
  't4d16-tu-vung': [
    {"id":"6RqKV-9MAMQ","credit":"IELTS Plus — IELTS English Podcast - Speaking Topic: Society","dur":"11:16","lang":"en","note":"Podcast IELTS chủ đề Society: từ vựng vấn đề xã hội và bình đẳng; bật phụ đề, chép cụm cho Task 2 / Part 3."},
    {"id":"tl5xTAbC8Rk","credit":"Your English Web: Weekly English video lessons — English vocabulary lesson B2 - Immigration - Vocabulario en inglés","dur":"6:33","lang":"en","note":"Từ vựng B2 chủ đề nhập cư (immigrant, emigrate, asylum…); xem trước phần di cư của bài, phân biệt các từ dễ nhầm."},
  ],
  't4d16-nghe': [
    {"id":"W1kuA2GuXks","credit":"E2 IELTS — IELTS Listening Map Labelling with Alex","dur":"13:09","lang":"en","note":"E2 giảng Map labelling: định hướng, ngôn ngữ chỉ vị trí, theo dõi người nói khi đổi hướng nhìn; làm cùng bản đồ trong video."},
    {"id":"l1LKp-q9k50","credit":"E2 IELTS — IELTS Listening Map Labelling Practice with Alex!","dur":"11:02","lang":"en","note":"Bài luyện Map labelling của E2 để thực hành ngay sau phần lý thuyết; tự làm rồi mới xem đáp án."},
  ],
  't4d16-viet': [
    {"id":"TJF6rZ66xTk","credit":"IELTS with Ralph — How I Write a Band 9 IELTS Writing Task 1 Table","dur":"24:19","lang":"en","note":"Viết từng bước một bài Task 1 dạng bảng ở band 9: chọn số đáng nói, so sánh chéo theo hàng và cột; xem trước khi viết bảng ba chiều của ngày."},
  ],
  't4d17-ngu-phap': [
    {"id":"ZE4yH4wxpj4","credit":"EAPFoundation.com — Reporting Verbs in Academic Writing","dur":"12:20","lang":"en","note":"EAPFoundation giảng reporting verbs trong văn học thuật (argue, claim, suggest… và sắc thái của từng động từ); xem trước phần tường thuật học thuật của bài."},
    {"id":"bQt2jl2BCrg","credit":"Oxford English Now — The Causative - HAVE | GET - have something done - English Grammar","dur":"5:10","lang":"en","note":"Causative have / get something done ngắn gọn, nhiều ví dụ; đối chiếu với phần causative band 7 của bài."},
  ],
  't4d17-doc': [
    {"id":"OxrBPkboU3Y","credit":"Asad Yaqub IELTS — ACADEMIC IELTS READING: HOW TO SOLVE DIAGRAMS IN A MINUTE BY ASAD YAQUB","dur":"5:14","lang":"en","note":"Cách làm Diagram label completion nhanh: đi theo sơ đồ, tìm đúng đoạn mô tả quy trình kỹ thuật; xem trước bài đọc Passage 3 của ngày."},
    {"id":"4923UARv_N4","credit":"IELTS Whiz — IELTS Reading – Flow chart and diagram completion","dur":"2:49","lang":"en","note":"Tóm gọn cách làm Flow-chart và Diagram completion trong Reading; xem như phần ôn nhanh."},
  ],
  't4d17-nghe': [
    {"id":"dY57DZxrJu4","credit":"Learn English Lab — IELTS Listening Section 3 & 4 Tips || Advanced English Listening Practice","dur":"39:06","lang":"en","note":"Luyện nghe Section 3 & 4 dạng podcast: hội thoại học thuật và bài giảng, kèm mẹo ghi chú; xem 15–20 phút đầu trước đề nhỏ, phần còn lại để luyện nghe thêm."},
  ],
  't4d18-tu-vung': [
    {"id":"5FckhZyQepc","credit":"English Speaking Success — Can I use Idioms in IELTS Speaking?","dur":"5:57","lang":"en","note":"Keith O'Hare trả lời thẳng: có nên dùng idiom trong IELTS Speaking không và dùng thế nào cho tự nhiên; đúng câu hỏi của bài “lúc nào dùng”."},
    {"id":"JRQ_1IXc4jI","credit":"E2 IELTS — Idioms for IELTS Preparation | Online IELTS Test Tips","dur":"14:18","lang":"en","note":"E2 phân biệt thành ngữ kiểu tục ngữ (nên tránh) với cụm thành ngữ (idiomatic phrases) và chỗ dùng được trong Writing / Speaking; dùng cho phần register của bài."},
  ],
  't4d18-viet': [
    {"id":"_F5Q2DLaNDw","credit":"Fastrack IELTS — BAND 9 IELTS Writing Task 1 SAMPLE | Academic - Pie Charts","dur":"18:09","lang":"en","note":"Bài mẫu band 9 Task 1 dạng biểu đồ tròn của Fastrack IELTS, giải thích cách chọn ý và so sánh giữa các pie; đối chiếu với cách nhóm của bài học."},
  ],
  't4d18-noi': [
    {"id":"kNH50UvI3W8","credit":"AcademicEnglishHelp — IELTS Speaking Part 3 - How to get a high score","dur":"10:02","lang":"en","note":"Cách đạt điểm cao Part 3: diễn đạt lại câu hỏi, nêu ý, giải thích, dùng ví dụ cá nhân hay xã hội; tự trả lời câu hỏi mẫu trước khi nghe."},
    {"id":"A6aE4nceJt8","credit":"Oxford Online English — Intonation in English - English Pronunciation Lesson","dur":"15:45","lang":"en","note":"Ngữ điệu trong tiếng Anh: lên giọng, xuống giọng và ngữ điệu thể hiện thái độ; nói theo từng ví dụ, đúng phần 🔊 ngữ điệu thái độ."},
  ],
  't4d19-ngu-phap': [
    {"id":"FuWk4lTt3UE","credit":"mmmEnglish — Mixed Conditionals | English Grammar | Examples & Practice","dur":"13:09","lang":"en","note":"mmmEnglish giảng câu điều kiện hỗn hợp (quá khứ → hiện tại và ngược lại) kèm bài luyện; dừng ở phần luyện, tự làm trước."},
    {"id":"Kqkp92G5Tlk","credit":"Your English Web: Weekly English video lessons — English grammar - Conditional sentences without 'if' - condicionales inglés","dur":"7:32","lang":"en","note":"Câu điều kiện không dùng if (provided, as long as, supposing, unless…); xem trước phần “từ thay if” của bài."},
  ],
  't4d19-doc': [
    {"id":"QZwB5V_0gyY","credit":"Asad Yaqub IELTS — ACADEMIC IELTS READING: WHICH PARA CONTAINS THE FOLLOWING BY ASAD YAQUB","dur":"16:43","lang":"en","note":"Cách làm dạng “Which paragraph contains the following information?” (Matching information): xác định LOẠI thông tin cần tìm trước; làm theo ví dụ trong video."},
  ],
  't4d19-noi': [
    {"id":"jgIv1GUgeMk","credit":"Better English Teaching Lab - with Marie -  — IELTS Speaking Exam Part 3 \"Hypothetical\" Questions | Band 9 Strategies","dur":"8:04","lang":"en","note":"Chiến thuật trả lời câu hỏi giả định trong Part 3 (If…, would…, giả định quá khứ); tự trả lời các câu trong video trước khi nghe mẫu."},
  ],
  't4d20-tu-vung': [
    {"id":"S2BUJ0QFfOc","credit":"Now English 24 — Lexical Resource and Topic Specific Vocabulary for IELTS, (Technology)","dur":"17:06","lang":"en","note":"Từ vựng chủ đề công nghệ ở mức IELTS (Lexical Resource theo chủ đề); ghi lại cụm về đổi mới công nghệ chưa có trong sổ."},
    {"id":"VBx-CatWQDw","credit":"IELTS with Charles — IELTS Speaking Band 7: Technology | Sample Answers with Advanced Vocabulary","dur":"8:28","lang":"en","note":"Câu trả lời mẫu band 7 chủ đề Technology có từ vựng nâng cao; nghe cách dùng từ trong ngữ cảnh rồi tự trả lời lại."},
  ],
  't4d20-nghe': [
    {"id":"nX-xshA_0m8","credit":"Learning Strategies Center Cornell — How to Use Cornell Notes","dur":"4:05","lang":"en","note":"Trung tâm học tập của chính Đại học Cornell hướng dẫn ghi chú Cornell (cột gợi ý, phần ghi chú, phần tóm tắt); xem trước khi nghe bài giảng 8 phút."},
    {"id":"3kxF1-jkz-U","credit":"BBC Learning English — How to listen and make notes in English: Study Skills","dur":"4:15","lang":"en","note":"BBC Study Skills: cách vừa nghe vừa ghi chú bằng tiếng Anh (viết tắt, ký hiệu, chỉ ghi từ khoá); dùng cùng khung Cornell của bài."},
  ],
  't4d20-viet': [
    {"id":"PnWND7JpRDQ","credit":"Carl Kwan — How to Prepare a Presentation with the Correct Structure","dur":"4:48","lang":"en","note":"Cấu trúc một bài thuyết trình đúng (mở – thân – kết, thông điệp chính); dùng làm khung khi viết kịch bản thuyết trình 3 phút."},
    {"id":"J4FGtp_cGrU","credit":"Academic English UK — How to write an effective academic summary","dur":"9:32","lang":"en","note":"Cách viết bản tóm tắt học thuật hiệu quả (ý chính, diễn đạt lại, không chen ý mình); áp cho bản tóm tắt 80–100 từ của bài."},
  ],
  't4d21-ngu-phap': [
    {"id":"dNlkHtMgcPQ","credit":"TED-Ed — Beware of nominalizations (AKA zombie nouns) - Helen Sword","dur":"5:05","lang":"en","note":"TED-Ed về “zombie nouns”: danh hoá quá đà làm câu nặng và tối nghĩa — đúng phần “lúc nên trả về động từ” của bài."},
    {"id":"P8UM5xv8644","credit":"Oxford Online English — How to Use Colons and Semicolons in English - English Writing Lesson","dur":"10:12","lang":"en","note":"Cách dùng dấu hai chấm và dấu chấm phẩy trong văn viết tiếng Anh; đúng phần dấu câu band 7 của bài, làm ví dụ trong video."},
  ],
  't4d21-doc': [
    {"id":"JKYHb9MjxWs","credit":"IELTS Advantage — Band 5.0 to 8.0 in IELTS Reading Using One Simple Strategy","dur":"10:30","lang":"en","note":"IELTS Advantage trình bày một chiến lược Reading giúp người học đi từ band 5 lên 8; xem trước khi làm đề 3 passage lần 2."},
  ],
  't4d21-nghe': [
    {"id":"HxzJGM_aQ7A","credit":"englii - Learn English with Claire — Test your English Listening with Irish accents","dur":"16:01","lang":"en","note":"Thử nghe giọng Ireland ở nhiều mức độ; nghe lần đầu không phụ đề, lần hai bật phụ đề để thấy âm nào khác giọng Anh chuẩn."},
    {"id":"97N2h-CMxv0","credit":"PAPI English — I bet you can't understand Scottish English -  Easy to Hard","dur":"10:21","lang":"en","note":"Giọng Scotland từ dễ tới khó; mục tiêu chỉ là nhận ra giọng và quen nhịp, không cần hiểu hết đoạn khó."},
  ],
  't4d22-tu-vung': [
    {"id":"fqZpHtZ6sWE","credit":"Tracy Wang — IELTS Speaking Part 3 – Children's behavior and discipline","dur":"11:51","lang":"en","note":"Câu trả lời Part 3 về hành vi và kỷ luật trẻ em, có từ vựng nuôi dạy con; nghe rồi tự trả lời một câu về vai trò của cha mẹ."},
    {"id":"iIBGw1fKl9A","credit":"IELTS Thanh Loan — Từ vựng IELTS chủ đề Gia đình - IELTS Vocabulary Topic Family [Family and children]","dur":"7:04","lang":"vi","note":"IELTS Thanh Loan dạy từ vựng chủ đề gia đình và con cái (giảng bằng tiếng Việt); xem để ôn nghĩa và cách dùng các cụm nuôi dạy con."},
  ],
  't4d22-viet': [
    {"id":"kp-XjuWVWOg","credit":"Ahmad Belal — IELTS Writing task 2 -  Problem and Solution Essay - Band 7","dur":"11:34","lang":"en","note":"Cấu trúc và bài mẫu Task 2 dạng Problem / Solution ở band 7; sau khi xem, thêm vào mỗi giải pháp một câu đánh giá nó có làm được không (ai làm, tốn gì, vướng gì) như bài học yêu cầu."},
    {"id":"utvkq_oYsIY","credit":"IELTS Thanh Loan — Bài 15: Hướng dẫn viết bài văn CAUSE-SOLUTION trong IELTS Writing Task 2 | IELTS Thanh Loan","dur":"27:30","lang":"vi","note":"IELTS Thanh Loan hướng dẫn viết bài Cause / Solution bằng tiếng Việt, có dàn ý và câu mẫu; xem nếu cần ôn lại khung bài bằng tiếng Việt."},
  ],
  't4d22-noi': [
    {"id":"L5V8B7FFJbU","credit":"Derek Callan - English for Professionals — How To Handle Questions - Business English Presentations","dur":"9:46","lang":"en","note":"Cách xử lý câu hỏi sau thuyết trình (cảm ơn, diễn đạt lại câu hỏi, câu khó, câu không biết); chép các câu khung để dùng trong phần Q&A của bài."},
    {"id":"PS90YsHjAU4","credit":"British Council | English — How to deal with questions during a presentation","dur":"2:35","lang":"en","note":"British Council: các cụm ngắn để xử lý câu hỏi trong lúc thuyết trình; xem như phần ôn nhanh."},
  ],
  't4d23-ngu-phap': [
    {"id":"HISR0P-y3x4","credit":"English Speaking Success — Complex Sentences for IELTS Speaking","dur":"24:13","lang":"en","note":"Keith O'Hare dạy dùng câu phức khi NÓI (không phải viết) ở IELTS Speaking; dừng ở ví dụ, tự nói lại câu theo khung."},
    {"id":"wY3v7Oly_MQ","credit":"Accent's Way English with Hadar — Intonation of Tag Questions (+ FREE practice PDF)","dur":"9:39","lang":"en","note":"Ngữ điệu câu hỏi đuôi: lên giọng khi hỏi thật, xuống giọng khi chờ đồng ý; luyện theo bài thực hành trong video."},
  ],
  't4d23-doc': [
    {"id":"eyfGxSDBoE4","credit":"IELTS Whiz — IELTS Reading – Matching Names With Statements Task","dur":"9:24","lang":"en","note":"Cách làm Matching names / features: ghép nhận định với đúng người nói trong bài; xem trước bài đọc Passage 3 của ngày."},
    {"id":"NUcpe7VDXjw","credit":"IELTS Từ Đầu by Thế Quang  — Cách làm dạng MATCHING NAMES chỉ 33 phút siêu dễ hiểu đạt 9.0 IELTS Reading cùng thầy Thế Quang.","dur":"33:04","lang":"vi","note":"Thế Quang (9.0 Reading) giảng kỹ dạng Matching names bằng tiếng Việt; xem khi còn hay gán nhầm quan điểm cho học giả."},
  ],
  't4d23-noi': [
    {"id":"LNxPH1J_rHU","credit":"KevinTeachesMe — IELTS Speaking Part 3: How to Give Band 7+ Answers with Examples","dur":"15:02","lang":"en","note":"Cách trả lời Part 3 band 7+ bằng ví dụ: đi từ khái niệm xuống ví dụ rồi quay lại ý chung; áp vào câu hỏi trừu tượng của bài."},
    {"id":"GjnI0mRVv7A","credit":"IELTS Official — IELTS Speaking test sample - Part 3 (Aashish, Band 7.5)","dur":"5:08","lang":"en","note":"Mẫu Part 3 band 7.5 thật của IELTS Official; nghe cách thí sinh xử lý câu hỏi trừu tượng rồi tự trả lời lại."},
  ],
  't4d24-tu-vung': [
    {"id":"VnP6XRiHq4E","credit":"7ESL Learning English — Learn Useful Adjective Noun Collocations to Improve your Spoken English","dur":"12:30","lang":"en","note":"Collocation tính từ + danh từ thông dụng (heavy traffic, strong evidence…); chọn những cụm hợp văn học thuật để thêm vào sổ."},
    {"id":"rJwwuA4Io98","credit":"Worldwide ELT — C1 Collocations: Adverb + Adjective (Unit 21W, Level C1)","dur":"6:17","lang":"en","note":"Collocation trạng từ + tính từ mức C1 (highly likely, widely available…); dừng ở mỗi cụm, tự đặt câu Task 1 / Task 2."},
  ],
  't4d24-nghe': [
    {"id":"Bhx4mi649YQ","credit":"ABC Education — Academic English: Listening For Note Taking","dur":"9:09","lang":"en","note":"Kỹ năng nghe bài giảng học thuật để ghi chú: nghe từ báo hiệu (signposting) để biết bài đang chuyển “trạm”; xem trước bài giảng 10 phút."},
    {"id":"P8gm1bpOeEs","credit":"The IELTS Workshop — [IELTS 4 Skills] Chiến Thuật Làm Dạng Matching \"Siêu Khó\" Trong Bài Thi Listening","dur":"8:37","lang":"vi","note":"The IELTS Workshop giảng chiến thuật làm Matching “siêu khó” trong Listening (tiếng Việt); dùng khi một người nói liền nhiều đặc điểm."},
  ],
  't4d24-viet': [
    {"id":"0zCeM5C2aJU","credit":"Fastrack IELTS — Band 9 IELTS Academic Writing Task 1 SAMPLE ANSWER (Chart + Table)","dur":"16:40","lang":"en","note":"Bài mẫu Task 1 band 9 dạng biểu đồ + bảng, có giải thích cách chọn và sắp ý; đối chiếu với bài band 6 vs band 7 trong bài học."},
  ],
  't4d25-ngu-phap': [
    {"id":"Bqgj7rspfVo","credit":"Katya SAT | ivy tutors network — Learn to comprehend long sentences. Reading Comprehension Lesson for Complex Sence Structure.","dur":"8:04","lang":"en","note":"Cách hiểu câu dài: tìm chủ ngữ – động từ chính, gỡ từng lớp mệnh đề; đúng mục tiêu gỡ câu phức Passage 3 của bài."},
  ],
  't4d25-doc': [
    {"id":"orJ97BtWm-M","credit":"IELTS Worldly — How to Solve Summary Completion Questions in the IELTS Reading Test?","dur":"3:07","lang":"en","note":"Các bước làm Summary completion: đọc tóm tắt đoán loại từ, định vị đoạn, chú ý giới hạn số từ hoặc hộp từ; ngắn, xem trước bài đọc Passage 3 của ngày."},
  ],
  't4d25-nghe': [
    {"id":"qBMnzSS0pbQ","credit":"English Speakology — IELTS Listening Strategy and Practice for 2026 | Band 9 Listening Tips","dur":"18:32","lang":"en","note":"Chiến thuật Listening kèm luyện tập (đọc trước, đoán đáp án, theo dõi lời sửa); xem trước khi làm đề 40 câu một lần nghe."},
  ],
  't4d26-tu-vung': [
    {"id":"TNNwtmzXdy0","credit":"IELTS Plus — IELTS English Podcast - Speaking Topic: Food","dur":"10:23","lang":"en","note":"Podcast IELTS chủ đề Food: từ vựng thực phẩm trong câu trả lời Speaking; ghi lại cụm về thực phẩm công nghiệp / an toàn thực phẩm."},
    {"id":"UFZzuGPXdx8","credit":"IELTS Energy TV — 7+ IELTS Vocabulary for News and Media","dur":"6:08","lang":"en","note":"Từ vựng band 7+ về tin tức và truyền thông; xem cho phần báo chí & quảng cáo của bài."},
  ],
  't4d26-viet': [
    {"id":"NUhDP30IRKk","credit":"Jeff Su — Write an Amazing Cover Letter: 3 Golden Rules (Template included)","dur":"7:26","lang":"en","note":"Ba nguyên tắc viết cover letter hay (có mẫu); áp vào phần cover letter của bài, viết theo khung rồi soát lại."},
    {"id":"w9ddKTChI78","credit":"Enjoy English With Mrs. A — HOW TO WRITE A FORMAL LETTER / EMAIL IN ENGLISH | CAMBRIDGE EXAM WRITING STRUCTURE","dur":"13:30","lang":"en","note":"Cấu trúc thư / email trang trọng chuẩn Cambridge (mở thư, mục đích, đoạn chính, kết thư); dùng cho các thư nhắc lần 2, phàn nàn, từ chối, xin gia hạn."},
  ],
  't4d26-noi': [
    {"id":"FXUH-yMG7n0","credit":"IELTS with Charles — IELTS Speaking Part 2 | Describe A Good Law","dur":"3:40","lang":"en","note":"Bài mẫu Part 2 “Describe a good law” — đề trừu tượng của ngày; nghe cách dựng nền và cân nhắc rồi tự nói lại theo khung NEO → NỀN → CẢNH → CÂN."},
    {"id":"AeS0Zvi31cg","credit":"Learnivo  — Describe a Piece of Advice You Recently Received | IELTS Speaking Part 2 3 | Learnivo #ieltsspeaking","dur":"10:49","lang":"en","note":"Part 2 và Part 3 cho đề “a piece of advice you received”; tự nói 2 phút trước, rồi nghe mẫu và so cách kể."},
  ],
  't4d27-ngu-phap': [
    {"id":"q-FOsRON-7A","credit":"English with Greg — The Subjunctive Mood in English Grammar… Explained Simply!","dur":"13:58","lang":"en","note":"Thức giả định (subjunctive) giải thích dễ hiểu: I suggest that he be…, It is essential that…; xem trước phần giả định của bài."},
    {"id":"A5_9Pru_Aq0","credit":"Tim Noosa — Learn English: Fronting (Advanced - Proficiency)","dur":"10:26","lang":"en","note":"Fronting (đưa thành phần lên đầu câu) ở mức nâng cao, kèm ví dụ; đối chiếu với phần fronting của bài."},
  ],
  't4d27-doc': [
    {"id":"_2suhrfSX0I","credit":"IELTS Fastlane — 7 Mistakes to Avoid in IELTS Reading 2025 - Part 3 Tips and Tricks for Band 9","dur":"9:41","lang":"en","note":"Bảy lỗi cần tránh trong IELTS Reading; xem trước đề 3 passage lần 3, đánh dấu lỗi nào bạn hay mắc ở Passage 3."},
  ],
  't4d27-noi': [
    {"id":"xnaOzlC2RXg","credit":"Ross IELTS Academy — IELTS Speaking Test band score 7 with feedback","dur":"17:21","lang":"en","note":"Một bài thi Speaking band 7 kèm nhận xét của giáo viên theo tiêu chí; xem trước khi tự thu âm full test, dùng nhận xét làm thước tự chấm."},
    {"id":"3jDj7u-OWNU","credit":"IELTS with Charles — IELTS Speaking Band 7.5 Mock Test with Feedback | IELTS with Charles","dur":"11:18","lang":"en","note":"Mock test Speaking band 7.5 có nhận xét; so bài thu âm của bạn với bài này để thấy chỗ còn thiếu ở mỗi tiêu chí."},
  ],
  't4d28-tu-vung': [
    {"id":"GXqeqNlpNOs","credit":"IELTS with Juva — 40 Advanced IELTS Vocabulary Synonyms for Band 7+","dur":"27:28","lang":"en","note":"40 cặp từ đồng nghĩa nâng cao cho band 7+; dùng làm lượt ôn ghép từ, dừng ở mỗi từ để tự nói từ đồng nghĩa trước."},
  ],
  't4d28-nghe': [
    {"id":"lIfBV0ZKnZY","credit":"IELTS With Dr. Nasir — IELTS Listening 2026 : Avoid Distractor Traps","dur":"15:52","lang":"en","note":"Nhận diện mồi nhử trong Listening (người nói sửa lời, đổi kế hoạch, phương án gây nhầm); xem trước đề nhỏ Part 3 + Part 4 săn bẫy."},
  ],
  't4d28-viet': [
    {"id":"FAUbhn5N0SI","credit":"Lilie IELTS — Have trouble developing your paragraphs? Try this method! - Writing Task 2 Double Question Essay","dur":"11:32","lang":"en","note":"Lilie dạy phát triển đoạn văn cho dạng Double question (Two-part question): mỗi câu hỏi một đoạn, trả lời thẳng rồi giải thích; xem trước khi viết đề của ngày."},
  ],
  't4d29-ngu-phap': [
    {"id":"cBbQ9zB11fA","credit":"E2 IELTS — How to Write Complex IELTS Sentences","dur":"18:19","lang":"en","note":"E2 dạy viết câu phức trong IELTS Writing; xem để ôn tổng ngữ pháp, đối chiếu với bảng 20 điểm C1 của bài."},
    {"id":"Ym6t-PaKN2Y","credit":"IELTS Understood — How to Use Complex Sentences in IELTS Writing and Improve Your Grammar (Band 7+ Examples)","dur":"16:41","lang":"en","note":"Câu phức trong Writing kèm ví dụ band 7+ và lỗi hay gặp; dùng cho phần tự soát ngữ pháp cuối tập."},
  ],
  't4d29-doc': [
    {"id":"LTwGFtt5lV4","credit":"TOPPERS WORLD — IELTS Reading Time Strategy | Finish Every Passage on Time","dur":"8:57","lang":"en","note":"Chiến lược chia thời gian Reading để làm hết mọi passage; dùng khi quyết định thứ tự passage theo độ khó của riêng bạn."},
    {"id":"p7qvvVl2fiI","credit":"Ross IELTS Academy — IELTS Reading: Manage your time and Answer all questions","dur":"2:46","lang":"en","note":"Quản lý thời gian và trả lời đủ mọi câu trong Reading; ngắn, xem như phần ôn nhanh của luật 90 giây."},
  ],
  't4d29-nghe': [
    {"id":"5uGKjyMReQ4","credit":"IELTS with Juva — Why You Can't Score Band 7+ in IELTS Listening and How to Fix It","dur":"17:59","lang":"en","note":"Vì sao nhiều người kẹt dưới band 7 Listening và cách sửa; xem trước đề 40 câu lần 2, ghi lại lỗi nào giống mình."},
  ],
  't4d30-tu-vung': [
    {"id":"IRXK9Ad0Muo","credit":"IELTS with Charles — IELTS Speaking Strategies for Difficult Topics (Band 7+)","dur":"4:14","lang":"en","note":"Chiến thuật nói khi gặp chủ đề khó / lạ trong Speaking (band 7+); áp vào phần 20 chủ đề lạ của bài."},
    {"id":"b2HP3X6HLb4","credit":"IELTS Plus — IELTS Speaking Part 1 TEMPLATE and STRATEGY!","dur":"6:48","lang":"en","note":"Khung trả lời Part 1 dùng được cho mọi chủ đề; ôn lại trước khi luyện 30 chủ đề Part 1."},
  ],
  't4d30-viet': [
    {"id":"7UXyGF3wFEM","credit":"IELTS with Juva — IELTS Writing Task 2 Mistakes That Stop You From Getting Band 7+","dur":"17:23","lang":"en","note":"Các lỗi Task 2 khiến bài không lên được band 7+; dùng làm danh sách soát khi viết lại bài."},
    {"id":"2XNViJ0gymI","credit":"English Pro Tips - IELTS Preparation — 8 Reasons You're NOT Getting 7+ in IELTS Writing","dur":"9:42","lang":"en","note":"Tám lý do bài Writing không lên được band 7+; dùng làm danh sách soát khi viết lại 3 bài theo sổ lỗi."},
  ],
  't4d30-noi': [
    {"id":"SyT0F53atYo","credit":"IELTS with Charles — IELTS Speaking Band 6.5–7.0 Mock Test | IELTS with Charles","dur":"9:33","lang":"en","note":"Mock test Speaking band 6.5–7.0 trọn ba Part; xem trước khi luyện với giám khảo AI để biết ngưỡng band 7 nghe thế nào."},
    {"id":"Vo0jEeUvgbw","credit":"IELTS with Huyen — If I don't understand a question in IELTS Speaking, I will do this. | IELTS with Huyen","dur":"5:32","lang":"en","note":"Phải làm gì khi không hiểu câu hỏi trong IELTS Speaking (xin nhắc lại, xin giải thích đúng cách); đúng phần “xin nhắc lại câu hỏi đúng cách” của bài."},
  ],
};
