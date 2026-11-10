/**
 * 🎬 Video YouTube TUYỂN CHỌN cho khoá tiếng Nhật Dekiru — hiện đầu mỗi bài (VideoBai.tsx).
 *
 * ⚠️ TÁCH HẲN với `videos.ts`: `videos.ts` là video mp4 CHÍNH CHỦ mình tự render (do dự án video
 * tự sinh + tự ghi đè — `videoNeo`). File này là nguồn NGOÀI (YouTube), SOẠN TAY, không bị ghi đè.
 * Hai nguồn sống song song: bài nào đã có mp4 của mình thì dùng mp4; chưa có thì học tạm bằng YouTube ở đây.
 *
 * Mỗi video phải qua `node scripts/yt-check.mjs <id…>` (oEmbed) ⇒ CÓ THẬT + nhúng được + `credit`
 * đúng `author_name — title`. Tiêu chí tuyển: giảng rõ (ưu tiên tiếng Anh, dễ cho người mới), đúng
 * kiến thức, khớp đúng điểm ngữ pháp/level của bài. Khoá tự bật phụ đề tiếng Anh (cc_load_policy).
 *
 * Dạng: `{ [lessonId]: LessonVideo[] }` — `lessonId` đúng `?bai=…` (vd `b1-ngu-phap`).
 */
import type { LessonVideo } from '@/components/sach-hoc/types';

export const VIDEO_YT: Record<string, LessonVideo[]> = {
  // ── N5 · Bài 1 — tự giới thiệu: 「〜は〜です」, trợ từ は, đuôi です ──
  'b1-ngu-phap': [
    { id: 'qAxpv3cCHO8', credit: 'ShekMatz Japan — HOW TO INTRODUCE YOURSELF in JAPANESE | EASY for BEGINNERS | FREE TUTORIAL', dur: '8:28', lang: 'en', note: 'Giới thiệu bản thân cho người mới: mẫu 「わたしは〜です」, trợ từ は và đuôi です — xem xong tự nói một câu giới thiệu tên mình.' },
  ],
  // ── N5 · Bài 2 — これ・それ・あれ, số đếm, giá tiền ──
  'b2-ngu-phap': [
    { id: 'xCKCTufjw7c', credit: 'MYsensei — Genki L2  #3 これ、それ、あれ/kore, sore, are: pointing words (JLPT N5)', dur: '8:16', lang: 'en', note: 'Phân biệt これ・それ・あれ (cái này/cái đó/cái kia) — mẫu chỉ đồ vật của bài; xem xong tự hỏi–đáp 「これはいくらですか」khi mua sắm.' },
  ],
  // ── N5 · Bài 3 — thể ます/ません (hiện tại lịch sự), lịch trình, giờ giấc ──
  'b3-ngu-phap': [
    { id: '1-WP81xXaRU', credit: 'BonBon’s Japanese Lesson — JLPTN5 Verbs - Group1 / Masu-Form (Polite Form)', dur: '12:46', lang: 'en', note: 'Chia động từ sang thể ます/ません (thể lịch sự hiện tại) — xem xong tự nói lịch một ngày bằng 「〜ます／〜ません」.' },
  ],
  // ── N5 · Bài 4 — tính từ い và な ──
  'b4-ngu-phap': [
    { id: 'LMz8EvO8C7o', credit: 'Mochi Real Japanese — 【SUPER GUIDE】Everything about い and な Adjective! Plain, Polite, Negative and Past', dur: '9:15', lang: 'en', note: 'Toàn bộ tính từ い và な: khẳng định, phủ định, quá khứ, nối câu — xem xong tự tả đất nước/thành phố mình bằng 2–3 tính từ.' },
  ],
  // ── N5 · Bài 5 — 「〜たいです」 (muốn làm gì), quá khứ, lý do ──
  'b5-ngu-phap': [
    { id: 'DgqoUnAPC5Q', credit: 'Ninjapanese — 【JLPT N5】I WANT TO in Japanese たい(tai) Form | Japanese vocabulary / real conversation - Japan travel', dur: '11:31', lang: 'en', note: 'Mẫu 「〜たいです」 (muốn làm gì) — điểm chính của bài; xem xong tự nói 3 việc mình muốn làm ngày nghỉ.' },
  ],
  // ── N5 · Bài 6 — rủ rê 「〜ませんか／〜ましょう」, so sánh ──
  'b6-ngu-phap': [
    { id: 'gFmJXJAyStY', credit: 'Learn Japanese with Moon-chan — Learn Japanese masenka (ませんか) | ませんか VS ましょうか | Learn Japanese grammar for beginners', dur: '4:02', lang: 'en', note: 'Rủ rê bằng 「〜ませんか」 (cậu … không?) và 「〜ましょうか」 (mình … nhé) — xem xong tự rủ bạn đi đâu đó.' },
  ],
  // ── N5 · Bài 7 — thể て (nền tảng cho mọi mẫu て) ──
  'b7-ngu-phap': [
    { id: 'HAdmKhVjVs8', credit: 'Jouzu Juls (上手 ジューズ) — The ULTIMATE Japanese Te-Form CHEAT SHEET 【て Form】', dur: '11:27', lang: 'en', note: 'Cách chia thể て của cả ba nhóm động từ — nền tảng cho mọi mẫu て của bài; luyện chia tới khi không cần nhìn bảng.' },
  ],
  // ── N5 · Bài 8 — あげる・もらう・くれる (cho – nhận) ──
  'b8-ngu-phap': [
    { id: 'ErXyQMbjhaI', credit: 'Ninjapanese — GIVE vs RECEIVE in Japanese 🇯🇵 あげる(ageru), もらう(morau), くれる(kureru)', dur: '13:06', lang: 'en', note: 'Phân biệt あげる・もらう・くれる (cho đi / nhận về / được cho) — xem xong tự nói ai cho/tặng mình cái gì.' },
  ],
  // ── N5 · Bài 9 — thể từ điển (辞書形) ──
  'b9-ngu-phap': [
    { id: '9rlIx9CTfrY', credit: 'Ninjapanese — 【N5】How to Make じしょform (Dictionary-form) 🇯🇵Japanese Grammar Verb conjugation', dur: '12:16', lang: 'en', note: 'Cách đưa động từ về thể từ điển (辞書形) — gốc để ghép 「〜ことができます」 và nhiều mẫu sau; luyện nhận nhóm I/II/III.' },
  ],
  // ── N5 · Bài 10 — 「〜てもいいですか」 (xin phép), 「〜ないでください」 (cấm) ──
  'b10-ngu-phap': [
    { id: 'ZskrDL0LtFc', credit: 'Shiro Neko Japanese — [GENKI Lesson 6] How to use TE form to give/ask permission (-てもいいですか？）', dur: '6:04', lang: 'en', note: 'Xin phép bằng 「〜てもいいですか」 và cấm bằng 「〜ないでください」 — xem xong tự hỏi xin phép làm một việc.' },
  ],
  // ── N5 · Bài 11 — 「〜たり〜たり」 (liệt kê ví dụ) ──
  'b11-ngu-phap': [
    { id: 'COwCYl8gnm4', credit: 'Shiro Neko Japanese — 〜たり〜たり (tari)  🐱 How to list example actions in Japanese', dur: '8:03', lang: 'en', note: 'Mẫu 「〜たり〜たり」 liệt kê vài việc tiêu biểu — xem xong tự kể 2–3 việc hay làm cuối tuần.' },
  ],
  // ── N5 · Bài 12 — 「〜たほうがいい／〜ないほうがいい」 (khuyên nên/không nên) ──
  'b12-ngu-phap': [
    { id: 'exPDFQIJ4jA', credit: 'Shiro Neko Japanese — How to use ほうがいい (hou ga ii)🐱 "You should / It’s better to" - Give advice in Japanese', dur: '7:21', lang: 'en', note: 'Khuyên nhủ bằng 「〜たほうがいい／〜ないほうがいい」 (nên / không nên) — xem xong tự cho một lời khuyên sức khoẻ.' },
  ],
  // ── N5 · Bài 13 — 「〜たことがあります」 (từng làm) ──
  'b13-ngu-phap': [
    { id: 'RsVEZCA05Bs', credit: 'Shiro Neko Japanese — [GENKI Lesson 11] ことがある ( koto ga aru ) ★ I have done / I have experienced', dur: '6:23', lang: 'en', note: 'Mẫu 「〜たことがあります」 kể kinh nghiệm đã từng làm — xem xong tự nói một việc mình đã từng/chưa từng làm.' },
  ],
  // ── N5 · Bài 14 — nghĩa vụ 「〜なければなりません」, cấm 「〜てはいけません」 ──
  'b14-ngu-phap': [
    { id: 'Y3A-JviViZ4', credit: 'Learn Japanese - Coto Japanese Academy — JLPT N4 Grammar - なければいけません (nakereba ikemasen): How to express "must"/"have to" in Japanese', dur: '4:53', lang: 'en', note: 'Nghĩa vụ 「〜なければなりません」 và cấm 「〜てはいけません」 — xem xong tự nói một quy định ở lớp/nhà.' },
  ],
  // ── N5 · Bài 15 — điều kiện 「〜と／〜たら／〜ば／〜なら」, phỏng đoán 「〜そうです」 ──
  'b15-ngu-phap': [
    { id: 'ocZfV_3gAM0', credit: 'Learn Japanese with Moon-chan — Mastering Japanese Conditionals: と, たら, ば, なら', dur: '11:10', lang: 'en', note: 'Câu điều kiện 「〜と／〜たら／〜ば／〜なら」 — gồm 〜と và 〜たら của bài; xem xong tự đặt một câu "nếu … thì …".' },
  ],
  // ── N4 · Bài 16 — thể khả năng 可能形, thể ý chí, 〜つもり ──
  'b16-ngu-phap': [
    { id: 'A529XiJ1SP8', credit: 'EasyJapaneseE — JLPT N4 Grammar Adding the meaning of “can (able)” - using potential form verbs', dur: '7:43', lang: 'en', note: 'Thể khả năng (〜られる／〜できる) — "làm được việc gì"; xem xong tự nói 2 việc mình làm được bằng tiếng Nhật.' },
  ],
  // ── N4 · Bài 17 — 「〜やすい／〜にくい」, 〜すぎる, 〜ば・〜なら ──
  'b17-ngu-phap': [
    { id: 'QF34gbqroTw', credit: 'Learn Japanese with Moon-chan — How to Use やすい & にくい (and むずかしい) (N4)', dur: '5:03', lang: 'en', note: 'Mẫu 「〜やすい／〜にくい」 (dễ / khó làm) — xem xong tự tả một thứ dễ dùng và một thứ khó dùng.' },
  ],
  // ── N4 · Bài 18 — 「〜てあげる／〜てくれる／〜てもらう」 (làm ơn cho nhau) ──
  'b18-ngu-phap': [
    { id: 'Sfi_wws7eQo', credit: 'KANJI - Link — Learn Japanese: TE-ageru & TE-kureru (てあげる・てくれる), Doing something for someone [JLPT N5]', dur: '4:53', lang: 'en', note: 'Làm giúp nhau bằng 「〜てあげる／〜てくれる」 (làm cho ai / được ai làm cho) — xem xong tự kể một lần ai đó giúp mình.' },
  ],
  // ── N4 · Bài 19 — 「〜てしまう」, 〜てみる, 〜ところ, 〜のに ──
  'b19-ngu-phap': [
    { id: 'hKM1LzN0afI', credit: 'Learn Japanese - Coto Japanese Academy — JLPT N4 Grammar ～てしまう (~te shimau): "to do something accidentally or with determination" in Japanese', dur: '4:06', lang: 'en', note: 'Mẫu 「〜てしまう」 (lỡ làm / làm xong dứt khoát) — xem xong tự kể một việc mình lỡ làm.' },
  ],
  // ── N4 · Bài 20 — phỏng đoán 「〜ようだ／〜みたい／〜らしい／〜そう」 ──
  'b20-ngu-phap': [
    { id: 'DZnO58AGbAM', credit: 'Norman Vargas — みたい VS よう VS そう VS らしい VS っぽい | How to say “IT LOOKS LIKE” in Japanese | JLPT N4 grammar', dur: '14:59', lang: 'en', note: 'So sánh みたい・よう・そう・らしい (có vẻ / nghe nói / trông như) — đúng nhóm phỏng đoán của bài; xem xong chọn đúng mẫu cho một tin đồn.' },
  ],
  // ── N4 · Bài 21 — mục đích 「〜ために／〜ように」, 〜ようになる ──
  'b21-ngu-phap': [
    { id: 'lu301BrUPg4', credit: 'Learn Japanese with Moon-chan — ために VS ように | Learn N4 Japanese grammar', dur: '6:47', lang: 'en', note: 'Phân biệt 「〜ために」 và 「〜ように」 (để / sao cho) khi nói mục tiêu — xem xong tự nói mình học để làm gì.' },
  ],
  // ── N4 · Bài 22 — thể bị động 受身, 〜ばかり ──
  'b22-ngu-phap': [
    { id: 'Ogc627RbHYM', credit: 'Learn Japanese with Moon-chan — Learn Japanese Passive Voice | Learn N4 Japanese grammar', dur: '9:11', lang: 'en', note: 'Thể bị động (〜られる) — "bị / được làm gì"; xem xong tự kể một chuyện phiền mình "bị" ai đó gây ra.' },
  ],
  // ── N4 · Bài 23 — thể sai khiến 使役, mệnh lệnh, 〜ように言う ──
  'b23-ngu-phap': [
    { id: 'sWoib_8lvck', credit: 'Learn Japanese - Coto Japanese Academy — JLPT N4 Grammar: ～させる ("to make someone do ~" in Japanese)', dur: '6:05', lang: 'en', note: 'Thể sai khiến 「〜させる」 (bắt / cho phép ai làm) — xem xong đặt một câu cha mẹ bắt mình làm việc nhà hồi nhỏ.' },
  ],
  // ── N4 · Bài 24 — kính ngữ 尊敬語, khiêm nhường ngữ 謙譲語, 〜かどうか ──
  'b24-ngu-phap': [
    { id: 'MtUmtQiYz30', credit: 'Masa Sensei — # 111 Learn Japanese - Honorific Form & Humble Form (尊敬語・そんけいご＆謙譲語・けんじょうご)Business Japaneseビジネス日本語入門', dur: '13:48', lang: 'en', note: 'Kính ngữ (尊敬語) và khiêm nhường ngữ (謙譲語) — nền tảng nói chuyện lịch sự khi thăm công ty; học thuộc vài động từ đặc biệt.' },
  ],
  // ── N3 · Bài 26 — 「〜うちに」, 〜間に, 〜最中に, 〜たとたん ──
  'b26-ngu-phap': [
    { id: 'KM2K7WByQLw', credit: 'Japanese with Yuka  — [ZOOM 9/26] N3 Grammar 〜うちに ...uchini', dur: '10:28', lang: 'en', note: 'Mẫu 「〜うちに」 (tranh thủ khi còn …) và khác với 「〜間に」 — xem xong đặt câu "làm X khi còn Y".' },
  ],
  // ── N3 · Bài 27 — 〜せいで (kết quả XẤU) ↔ 〜おかげで (kết quả TỐT) ──
  'b27-ngu-phap': [
    { id: 'CW95rkDFphA', credit: 'Learn Japanese with Moon-chan — せいで VS おかげで | Learn N3 Japanese grammar', dur: '3:43', lang: 'en', note: 'So sánh 「せいで」(do… nên kết quả xấu) với 「おかげで」(nhờ… nên kết quả tốt) — đúng hai mẫu của bài; nghe cách phân biệt rồi làm phần điền ở dưới.' },
  ],
  // ── N3 · Bài 28 — 「〜くせに」, 〜ものの, 〜にもかかわらず, 〜に対して ──
  'b28-ngu-phap': [
    { id: '5qa7EIeIUN4', credit: 'Masa Sensei — # 174 Learn Japanese【～くせに／くせして】even though, and yet, in spite of the fact that - N3 Grammar -', dur: '12:09', lang: 'en', note: 'Mẫu 「〜くせに」 (dù … mà lại …, có ý chê trách) — một mẫu tương phản của bài; xem xong đặt câu phàn nàn ai đó.' },
  ],
  // ── N3 · Bài 29 — 「〜ば〜ほど」 (càng…càng…), 〜ほど, 〜くらい ──
  'b29-ngu-phap': [
    { id: 'En7NQPslma0', credit: '日本語 to 旅 〜Nihongo to Tabi〜 — N3文法 #14【〜ば〜ほど】', dur: '8:21', lang: 'en', note: 'Mẫu 「〜ば〜ほど」 (càng … càng …) — xem xong đặt một câu "càng học càng …".' },
  ],
  // ── N3 · Bài 30 — 「〜ということだ／〜とのことだ」 (nghe nói, tức là), 〜にとって ──
  'b30-ngu-phap': [
    { id: 'iZYfyXCFV4U', credit: 'Masa Sensei — # 127 Learn Japanese - ということだ/ということです（explanation or interpretation of something）', dur: '11:14', lang: 'en', note: 'Mẫu 「〜ということだ／〜とのことだ」 (nghe nói, tức là) để nhắn/thuật lại — xem xong tự thuật lại một lời nhắn.' },
  ],
  // ── N3 · Bài 31 — 「〜に違いない」, 〜はずがない, 〜わけだ・わけではない ──
  'b31-ngu-phap': [
    { id: 'Yy1gPAlMsiM', credit: 'Learn Japanese - Coto Japanese Academy — JLPT N3 Grammar に違いない (~ni chigainai) : How to say "I’m sure, without a doubt" in Japanese', dur: '3:11', lang: 'en', note: 'Mẫu 「〜に違いない」 (chắc chắn là, suy ra) — mẫu suy luận của bài; xem xong đặt câu suy đoán có căn cứ.' },
  ],
  // ── N3 · Bài 32 — 「〜につれて」, 〜ものだ, 〜一方だ ──
  'b32-ngu-phap': [
    { id: 'Cy7q6k71_MI', credit: 'じゃぱすた/Let\'s study Japanese — 【JLPT／N3文法】～につれて', dur: '8:55', lang: 'en', note: 'Mẫu 「〜につれて」 (càng … theo thời gian thì …) nói sự biến đổi — xem xong tả một thay đổi giữa xưa và nay.' },
  ],
  // ── N3 · Bài 33 — 「〜によると」, 〜に基づいて, 〜をもとに, 〜とともに ──
  'b33-ngu-phap': [
    { id: '32jPKfz6L2E', credit: 'Learn Japanese - Coto Japanese Academy — JLPT N3 Grammar: 〜によると~よれば (~ni Yoru to ~Yoreba) | How to Say "According to" in Japanese', dur: '2:25', lang: 'en', note: 'Mẫu 「〜によると／〜によれば」 (theo … [nguồn tin]) dùng khi dẫn nguồn, khảo sát — xem xong tự dẫn một nguồn: "theo báo …". (Video hơi ngắn nhưng khớp đúng mẫu chính.)' },
  ],
  // ── N3 · Bài 34 — 「〜がちだ」, 〜気味, 〜っぱなし ──
  'b34-ngu-phap': [
    { id: 'yJCmFCjbaok', credit: 'Game Gengo ゲーム言語 — LEARN JLPT N3 Grammar #7 「がち・がたい・気味・ごとに」 (GACHI, GATAI, GIMI, GOTONI) - Game Gengo', dur: '13:01', lang: 'en', note: 'Mẫu 「〜がち」 (hay bị, thường) và 「〜気味」 (hơi có xu hướng) — đúng hai mẫu thói quen của bài; xem xong tả một thói quen hay mắc.' },
  ],
  // ── N3 · Bài 35 — thể sai khiến bị động 「〜させられる」, 〜させていただく ──
  'b35-ngu-phap': [
    { id: 'aD2g72z1EAM', credit: 'Masa Sensei — # 129 Learn Japanese ～されます／～させられます to be made to do something (Causative-Passive)', dur: '10:38', lang: 'en', note: 'Thể sai khiến bị động 「〜させられる」 (bị bắt phải làm) — xem xong kể một việc hồi thực tập bị bắt làm.' },
  ],
  // ── N3 · Bài 36 — 「〜というのは／〜とは」 (định nghĩa), 〜やら, 〜にしても ──
  'b36-ngu-phap': [
    { id: 'i0hZarGGbaE', credit: 'JLPT Class — TOIUNOWA - JLPT N3 N4 N5 (GRAMMAR) | " This means, The meaning of ... " IN Japanese language', dur: '6:56', lang: 'en', note: 'Mẫu 「〜というのは／〜とは」 (… nghĩa là, … là) để định nghĩa, giải thích — xem xong tự giải nghĩa một từ.' },
  ],
  // ── N3 · Bài 37 — tiếng Nhật công sở: kính ngữ, email, điện thoại ──
  'b37-ngu-phap': [
    { id: 'RE7e6fmNsgM', credit: 'あつこせんせい — 33 Essential Polite Japanese Phrases for the Workplace - Learn Business Japanese', dur: '5:59', lang: 'en', note: '33 câu lịch sự cốt lõi nơi công sở (chào hỏi, nhờ vả, xin lỗi) — xem xong học thuộc 5 câu dùng ngay ở công ty.' },
  ],
  // ── N2 · Bài 41 — 「〜際に／〜に際して／〜にあたって」, 〜をきっかけに ──
  'b41-ngu-phap': [
    { id: '6-q6j0G4Ogs', credit: 'じゃぱすた/Let\'s study Japanese — 【JLPT／N2文法】に際して', dur: '10:18', lang: 'en', note: 'Mẫu 「〜に際して／〜にあたって」 (nhân dịp, khi bắt đầu việc trọng đại) — mẫu trang trọng của bài tìm việc; xem xong đặt câu "nhân dịp …".' },
  ],
  // ── N2 · Bài 42 — 「〜に限らず」, 〜をはじめ, 〜を問わず, 〜にかかわらず ──
  'b42-ngu-phap': [
    { id: '4wg54qAtW9o', credit: '日本語 to 旅 〜Nihongo to Tabi〜 — N2文法 #34【〜に限らず】', dur: '6:57', lang: 'en', note: 'Mẫu 「〜に限らず」 (không chỉ … mà …) — một mẫu "không giới hạn" của bài; xem xong đặt câu mở rộng phạm vi.' },
  ],
  // ── N2 · Bài 43 — 「〜にしては」, 〜からすると, 〜わりに, 〜はともかく ──
  'b43-ngu-phap': [
    { id: 'pbqp8kRKDWE', credit: '日本語勉強チャンネル — JLPT N2 文法#54【～にしては】learn japanese/日本語を楽しく勉強', dur: '8:43', lang: 'en', note: 'Mẫu 「〜にしては」 (so với … thì lại bất ngờ) — mẫu đánh giá của bài; xem xong đặt câu nhận xét trái mong đợi.' },
  ],
  // ── N2 · Bài 44 — 「〜あげく」, 〜末に, 〜きり, 〜次第 ──
  'b44-ngu-phap': [
    { id: '-p666JXTyNY', credit: 'Learn Japanese - Coto Japanese Academy — JLPT N2 Grammar - あげく (ageku): How to say "In the end"/"After all~" in Japanese', dur: '6:09', lang: 'en', note: 'Mẫu 「〜あげく(に)」 (sau bao … rốt cuộc lại …, kết cục xấu) — xem xong kể một chuyện "loay hoay mãi rồi …".' },
  ],
  // ── N2 · Bài 45 — 「〜ざるを得ない」, 〜ずにはいられない, 〜てたまらない ──
  'b45-ngu-phap': [
    { id: 'tl_gBGWN0SA', credit: 'Meiji Academy - Japanese Language & Culture — ～ざるを得ない Can’t Help (Doing); Have No Choice But To~ | JLPT N2 Grammar', dur: '7:26', lang: 'en', note: 'Mẫu 「〜ざるを得ない」 (đành phải, không còn cách nào khác) — mẫu bổn phận của bài; xem xong đặt câu "buộc phải …".' },
  ],
  // ── N2 · Bài 46 — 「〜かねる／〜かねない」, 〜得る, 〜おそれがある ──
  'b46-ngu-phap': [
    { id: 'zbAd98FvhHA', credit: 'Nippon Necota — JLPT N2 Grammar  〜かねる/〜かねない　Necota’s Japanese Classroom ねこた日本語教室', dur: '10:37', lang: 'en', note: 'Phân biệt 「〜かねる」 (khó lòng làm) và 「〜かねない」 (e rằng sẽ xảy ra điều xấu) — đúng cặp rủi ro của bài.' },
  ],
  // ── N2 · Bài 47 — 「〜からには」, 〜しかない, 〜ほかない, 〜以上は ──
  'b47-ngu-phap': [
    { id: '9hnnLgWbQGs', credit: 'Japanese Lessons with Mom & Daughter — JLPT N2/からには /N2 grammar/N2 文法 /日本語会話/Japanese conversation', dur: '4:58', lang: 'en', note: 'Mẫu 「〜からには」 (đã … thì phải …, thể hiện quyết tâm) — xem xong đặt câu "đã nhận việc thì phải …".' },
  ],
  // ── N2 · Bài 48 — 「〜ばかりに」, 〜ことから, 〜だけに, 〜ものだから ──
  'b48-ngu-phap': [
    { id: 'vp1CKgOvYpw', credit: 'Japanese Lessons with Mom & Daughter — JLPT N2/ばかりに/せいで/N2 grammar/日本語会話/Japanese conversation/N2文法/日本語', dur: '6:34', lang: 'en', note: 'Mẫu 「〜ばかりに」 (chỉ vì … mà ra nông nỗi) nói nhân quả xấu, so với せいで — xem xong đặt câu "chỉ vì … nên …".' },
  ],
  // ── N2 · Bài 49 — 「〜に伴って」, 〜一方で, 〜かと思うと, 〜や否や ──
  'b49-ngu-phap': [
    { id: 'qtuph-fkpck', credit: '日本語 to 旅 〜Nihongo to Tabi〜 — N2文法 #51【〜にともなって】', dur: '10:42', lang: 'en', note: 'Mẫu 「〜に伴って」 (đi kèm với …, cùng biến đổi) — mẫu biến đổi của bài; xem xong tả một thay đổi kéo theo thay đổi khác.' },
  ],
  // ── N2 · Bài 50 — nhóm tương phản: 〜反面 (và 対して・一方で cùng nghĩa "mặt này… mặt kia") ──
  'b50-ngu-phap': [
    { id: '_yyU0l7V1hM', credit: 'Yoshiko’s Japanese class — Japanese Lesson 対して(たいして)、反面（はんめん）、一方で （いっぽうで）#68', dur: '5:38', lang: 'en', note: 'Nhóm mẫu tương phản 対して・反面・一方で (trong đó 反面 là điểm của bài 50): hiểu sắc thái "mặt này… nhưng mặt kia", rồi đối chiếu với các mẫu còn lại trong bài.' },
  ],
  // ── N2 · Bài 51 — nhấn mạnh 「〜さえ／〜すら／〜こそ」, 〜ものがある, 〜ことか ──
  'b51-ngu-phap': [
    { id: 'h7MfFFtG-jo', credit: 'Meshclass 日本語 — 【JLPT N2文法】だけ / さえ / すら /こそ の違いを学ぼう！', dur: '8:55', lang: 'en', note: 'Phân biệt だけ・さえ・すら・こそ (ngay cả … / chính … mới) — đúng nhóm nhấn mạnh của bài; xem xong chọn đúng trợ từ nhấn.' },
  ],
  // ── N2 · Bài 52 — 「〜べきだ」, 〜上で, 〜面で, 〜ねばならない ──
  'b52-ngu-phap': [
    { id: '-PY7gFtBI3w', credit: 'Masa Sensei — # 166 Learn Japanese【〜べきだ／～べきです】should do; supposed to do - N3 Grammar -', dur: '9:10', lang: 'en', note: 'Mẫu 「〜べきだ」 (nên, buộc phải về lẽ phải) hay dùng trong báo cáo/luận — xem xong viết một câu kiến nghị "nên …".' },
  ],
  // ── N2 · Bài 53 — email công việc: kính ngữ nâng cao, 「〜させていただきます」 ──
  'b53-ngu-phap': [
    { id: 'GUK6f-4VVPE', credit: 'Learn Japanese - Coto Japanese Academy — Let’s debunk 敬語! Japanese language for business purposes. #n2 #JLPTN2', dur: '5:37', lang: 'en', note: 'Kính ngữ cho email/công việc, gồm 「〜させていただきます」 (xin phép được …) — xem xong viết một câu mở đầu email lịch sự.' },
  ],
};
