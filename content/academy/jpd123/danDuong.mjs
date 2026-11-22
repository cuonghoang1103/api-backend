/**
 * JPD123 · Academy — bài DẪN ĐƯỜNG sang khoá できる日本語 (22/11/2026).
 *
 * Đề cương JPD123 (FLM 14470) = Dekiru Bài 4–7. Toàn bộ phần dạy — hội thoại có tiếng, từ vựng,
 * ngữ pháp ポイント 24–71, chữ Hán của lớp, nghe, nói, slide theo Slot của cô, luyện thêm hàng nghìn câu,
 * kiểm tra đúng form, thi thử nói/viết cuối kỳ — ĐÃ CÓ ở `/language/ja/dekiru` (app: `/jp`).
 * Ở đây chỉ có: 0.3 lộ trình 3 tuần (block 5) và 0.4 bản đồ "học bài nào ở đâu", cộng link-card gắn
 * vào cuối các bài khái niệm cũ (LINK_BAI_CU). Mọi id mục Dekiru đã đối chiếu với manifest.ts (ready).
 */
import { bai, chenCuoi } from './_chung.mjs';

const AC = (slug) => `/courses/elementary-japanese-1-a12/learn?lessonSlug=${slug}`;

/* ═══════════════════════ 0.3 — LỘ TRÌNH 3 TUẦN ═══════════════════════ */

// [ngày, slot trên lớp [en,vi], học/ôn (mảng [id, nhãn]), nói 20' [en,vi], tự kiểm [en,vi]]
const NGAY = [
  // ── Tuần 1 · Bài 4 + mở Bài 5
  [1, ['Slot 1 · L4.1 どこ', 'Slot 1 · L4.1 どこ'], [['b4-hoi-thoai', 'Hội thoại B4'], ['b4-tu-vung', 'Từ vựng B4'], ['slot-01-l4-1-vi-tri-thoi-gian-di-duong', 'Slot 1']],
    ['Answer aloud: ハノイからホーチミンまでどのくらいですか (time + transport, full sentence).', 'Nói to: ハノイからホーチミンまでどのくらいですか (đủ thời gian + phương tiện, trọn câu).'],
    ['You can say where your hometown is (北・南・真ん中) and how long it takes, without notes.', 'Nói được quê ở đâu (北・南・真ん中) và đi mất bao lâu mà không nhìn giấy.']],
  [2, ['Slot 2 · L4.2 + kanji 4', 'Slot 2 · L4.2 + chữ Hán 4'], [['slot-02-l4-2-tinh-tu-kanji-4', 'Slot 2'], ['b4-ngu-phap', 'Ngữ pháp B4'], ['b4-han-lop', 'Chữ Hán lớp B4']],
    ['Describe your town with 3 adjectives: どんなところですか → にぎやかなところです…', 'Tả thành phố bằng 3 tính từ: どんなところですか → にぎやかなところです…'],
    ['Write the negative of 10 adjectives from memory (incl. いい → よくない, きれい → きれいじゃない).', 'Viết thể phủ định của 10 tính từ không nhìn bảng (có いい → よくない, きれい → きれいじゃない).']],
  [3, ['Slot 3 · L4.2 cont. + L4.3', 'Slot 3 · L4.2 tiếp + L4.3'], [['slot-03-l4-2-tiep-l4-3-aru-soshite-ga-thoi-tiet', 'Slot 3'], ['lt-b4-ngu-phap-1', 'Luyện thêm NP1'], ['lt-b4-ngu-phap-2', 'Luyện thêm NP2']],
    ['All 9 Lesson-4 exam questions in the speaking guide, aloud (b4-noi).', 'Cả 9 câu hỏi thi nói Bài 4 trong hướng dẫn thi, nói to (b4-noi).'],
    ['Practice sets NP1 + NP2 at 80% or better.', 'Luyện thêm NP1 + NP2 đạt từ 80%.']],
  [4, ['Slot 4 · L4.3 cont. + review L4', 'Slot 4 · L4.3 tiếp + ôn B4'], [['slot-04-l4-3-tiep-on-tap-b4', 'Slot 4'], ['b4-noi', 'Luyện nói B4'], ['b4-doc-to', 'Đọc to kiểu đề B4']],
    ['Read 2 exam-style passages from b4-doc-to aloud, recording yourself once.', 'Đọc to 2 đoạn kiểu đề trong b4-doc-to, tự ghi âm một lần.'],
    ['Lesson 4 written check (40 questions): 32 or more.', 'Kiểm tra Bài 4 phần viết (40 câu): từ 32 câu đúng.']],
  [5, ['Slot 5 · L5.1 週末', 'Slot 5 · L5.1 週末'], [['b5-hoi-thoai', 'Hội thoại B5'], ['b5-tu-vung', 'Từ vựng B5'], ['slot-05-l5-1-qua-khu-dong-tu', 'Slot 5']],
    ['きのう何をしましたか / きのうどこかへ行きましたか — answer in 2 sentences with それから.', 'きのう何をしましたか / きのうどこかへ行きましたか — trả lời 2 câu, nối bằng それから.'],
    ['Conjugate 15 verbs into ました / ませんでした aloud with no mistakes.', 'Chia 15 động từ sang ました / ませんでした thành tiếng, không sai.']],
  [6, ['Slot 6–7 · L5.1 cont. + L5.2', 'Slot 6–7 · L5.1 tiếp + L5.2'], [['slot-06-l5-1-tiep-l5-2-tro-tu-sorekara-qua-khu-tinh-tu', 'Slot 6'], ['slot-07-l5-2-tiep-doushite-kara', 'Slot 7'], ['lt-b5-ngu-phap-1', 'Luyện thêm NP1']],
    ['どうしてきのう学校へ行きませんでしたか → reason + から, full sentence.', 'どうしてきのう学校へ行きませんでしたか → lý do + から, trọn câu.'],
    ['Past adjectives: たかかった / よかった / ひまでした / あめでした — 10 items correct.', 'Quá khứ tính từ: たかかった / よかった / ひまでした / あめでした — đúng 10/10.']],
  [7, ['(review day)', '(ngày ôn)'], [['lt-b4-de-tong-hop', 'Đề tổng hợp B4'], ['b4-kiem-tra-noi', 'Kiểm tra nói B4'], ['b4-luyen-nho', 'Luyện nhớ B4']],
    ['Full mock of the Lesson-4 speaking check (2 readings + 6 Q&amp;A), recorded.', 'Làm trọn kiểm tra nói Bài 4 (2 đoạn đọc + 6 câu hỏi), có ghi âm.'],
    ['Lesson 4 combined test (100 points): 75 or more. List every mistake in your notebook.', 'Đề tổng hợp Bài 4 (100 điểm): từ 75. Chép mọi câu sai vào sổ.']],
  // ── Tuần 2 · Bài 5 + Test 1 + Bài 6
  [8, ['Slot 8 · L5.3 今度の休みに', 'Slot 8 · L5.3 今度の休みに'], [['slot-08-l5-3-hoshii-suki-tai-ni-ikimasu', 'Slot 8'], ['lt-b5-ngu-phap-2', 'Luyện thêm NP2'], ['lt-b5-ngu-phap-3', 'Luyện thêm NP3']],
    ['Lesson-5 exam questions 5–8: 何がいちばんほしいですか · お金がたくさんあります。何をしたいですか · あした何をしに行きますか.', 'Câu hỏi thi Bài 5 số 5–8: 何がいちばんほしいですか · お金がたくさんあります。何をしたいですか · あした何をしに行きますか.'],
    ['Make 5 sentences with ～へ～に行きます (one with 買い物に, one with 見に).', 'Đặt 5 câu ～へ～に行きます (có 1 câu 買い物に, 1 câu 見に).']],
  [9, ['Slot 9 · kanji 5 + review L5', 'Slot 9 · chữ Hán 5 + ôn B5'], [['slot-09-kanji-5-on-tap-l5-chua-b5', 'Slot 9'], ['b5-han-lop', 'Chữ Hán lớp B5'], ['lt-b5-chu-han', 'Luyện thêm chữ Hán B5']],
    ['All 8 Lesson-5 exam questions aloud, then 1 exam-style reading.', 'Cả 8 câu hỏi thi Bài 5 nói to, rồi 1 đoạn đọc kiểu đề.'],
    ['Lesson 5 written check (40 questions): 32 or more.', 'Kiểm tra Bài 5 phần viết (40 câu): từ 32 câu đúng.']],
  [10, ['Slot 10 · review kanji 5, L4–5, open L6.1', 'Slot 10 · ôn chữ Hán 5, B4–5, mở L6.1'], [['slot-10-on-kanji-5-on-b4-b5-l6-1', 'Slot 10'], ['on-giua-ky-b4-5-dap-an', 'Ôn giữa kỳ B4–5'], ['bt-b45-tu-vung-ngu-phap-dap-an', 'BT B4–5 của cô']],
    ['Mixed Q&amp;A from Lessons 4–5 (pick 10 at random), no notes.', 'Hỏi–đáp trộn Bài 4–5 (bốc ngẫu nhiên 10 câu), không nhìn.'],
    ['The teacher’s midterm review set: 80% or better — this is what Small test 1 looks like.', 'Bộ ôn giữa kỳ của cô: từ 80% — đó là hình dạng Small test 1.']],
  [11, ['Slot 11 · SMALL TEST 1 (L4–5) + L6.1', 'Slot 11 · SMALL TEST 1 (B4–5) + L6.1'], [['slot-11-test1-l6-1-tiep', 'Slot 11'], ['b6-hoi-thoai', 'Hội thoại B6'], ['b6-tu-vung', 'Từ vựng B6']],
    ['Invite and decline: いっしょに～ませんか → すみません、～はちょっと… → また今度.', 'Rủ và từ chối: いっしょに～ませんか → すみません、～はちょっと… → また今度.'],
    ['After the test: write down every question you were unsure about and look each one up today.', 'Sau bài test: ghi lại mọi câu còn phân vân và tra hết trong ngày.']],
  [12, ['Slot 12 · L6.2 どちらがいいですか', 'Slot 12 · L6.2 どちらがいいですか'], [['slot-12-l6-2-docchi', 'Slot 12'], ['b6-ngu-phap', 'Ngữ pháp B6'], ['lt-b6-np-2', 'Luyện thêm NP2']],
    ['Lesson-6 exam questions 2–7 (いちばん / どちら), answering with が and のほうが.', 'Câu hỏi thi Bài 6 số 2–7 (いちばん / どちら), trả lời bằng が và のほうが.'],
    ['10 comparison sentences: より, いちばん, どちらも — check the particles one by one.', '10 câu so sánh: より, いちばん, どちらも — soát từng trợ từ.']],
  [13, ['Slot 13–14 · L6.3 約束 + kanji 6', 'Slot 13–14 · L6.3 約束 + chữ Hán 6'], [['slot-13-l6-3-yakusoku', 'Slot 13'], ['slot-14-kanji6-on-l6-chua-b6', 'Slot 14'], ['b6-han-lop', 'Chữ Hán lớp B6']],
    ['もう～ましたか → はい、もう～ました / いいえ、まだです (never まだ～ませんでした).', 'もう～ましたか → はい、もう～ました / いいえ、まだです (không bao giờ まだ～ませんでした).'],
    ['Practice set NP3 (もう/まだ, よ, ね, どうですか) at 80% or better.', 'Luyện thêm NP3 (もう/まだ, よ, ね, どうですか) đạt từ 80%.']],
  [14, ['(review day)', '(ngày ôn)'], [['b6-kiem-tra-viet', 'Kiểm tra viết B6'], ['b6-kiem-tra-noi', 'Kiểm tra nói B6'], ['lt-b6-de-tong-hop', 'Đề tổng hợp B6']],
    ['Lesson-6 speaking check, recorded; from today read 1 passage a day from the final-exam reading bank.', 'Kiểm tra nói Bài 6, có ghi âm; từ hôm nay mỗi ngày đọc 1 đoạn trong ngân hàng Reading thi cuối kỳ.'],
    ['Lesson 6 written check: 32/40 or more.', 'Kiểm tra viết Bài 6: từ 32/40.']],
  // ── Tuần 3 · Bài 7 + Test 2 + thi cuối kỳ
  [15, ['Slot 15 · L7.1 道がわかりません', 'Slot 15 · L7.1 道がわかりません'], [['slot-15-on-kanji6-l7-1', 'Slot 15'], ['b7-hoi-thoai', 'Hội thoại B7'], ['lt-b7-np-1', 'Luyện thêm NP1']],
    ['Lesson-7 exam questions 1–4: FPT大学はどこにありますか · ～の近くに何がありますか.', 'Câu hỏi thi Bài 7 số 1–4: FPT大学はどこにありますか · ～の近くに何がありますか.'],
    ['あります vs います and に vs で: 10 sentences without a mistake.', 'あります hay います, に hay で: 10 câu không sai.']],
  [16, ['Slot 16 · L7.2 て-form', 'Slot 16 · L7.2 thể て'], [['slot-16-l7-2-chuan-bi-tiec', 'Slot 16'], ['chia-the-te-bt-bai-7', 'Chia thể て 49 động từ'], ['lt-b7-the-te', 'Luyện thêm thể て']],
    ['Say ～てください requests for 10 verbs (まどを開けてください…).', 'Nói câu nhờ ～てください với 10 động từ (まどを開けてください…).'],
    ['The teacher’s 49-verb て-form sheet: 46 or more correct (watch 行って, 帰って, 切って, 起きて).', 'Bảng chia thể て 49 động từ của cô: từ 46 đúng (soi 行って, 帰って, 切って, 起きて).']],
  [17, ['Slot 17 · L7.2 cont. + kanji 7', 'Slot 17 · L7.2 tiếp + chữ Hán 7'], [['slot-17-l7-2-tiep-kanji7', 'Slot 17'], ['b7-han-lop', 'Chữ Hán lớp B7'], ['lt-b7-chu-han', 'Luyện thêm chữ Hán B7']],
    ['Lesson-7 exam questions 5–7: 何でパンをきりますか · ベトナム人は何でご飯を食べますか.', 'Câu hỏi thi Bài 7 số 5–7: 何でパンをきりますか · ベトナム人は何でご飯を食べますか.'],
    ['All 43 class kanji of Lessons 4–7: read each inside a word, 40 or more correct.', 'Đủ 43 chữ Hán của lớp Bài 4–7: đọc trong từ, từ 40 chữ đúng.']],
  [18, ['Slot 18 · L7.3 パーティー', 'Slot 18 · L7.3 パーティー'], [['slot-18-l7-3-tiec', 'Slot 18'], ['lt-b7-np-2', 'Luyện thêm NP2'], ['lt-b7-noi-viet', 'Nói &amp; viết B7']],
    ['Picture questions: ～さんは何をしていますか / だれが～ていますか — describe a party picture in 4 sentences.', 'Câu hỏi có tranh: ～さんは何をしていますか / だれが～ていますか — tả tranh bữa tiệc bằng 4 câu.'],
    ['Practice set NP2 (～てください, ～ています, ～ましょうか) at 80% or better.', 'Luyện thêm NP2 (～てください, ～ています, ～ましょうか) đạt từ 80%.']],
  [19, ['Slot 19 · review L7', 'Slot 19 · ôn B7'], [['slot-19-on-kanji7-on-l7-chua-bt7', 'Slot 19'], ['de-luyen-b6-7', 'Đề luyện B6–7 (40 câu)'], ['bt-tu-vung-ngu-phap-b6-7', 'BT B6–7 của cô']],
    ['Speaking mock tests 1–3 (each: reading A-x + 3 questions B-x).', 'Đề thi thử nói 1–3 (mỗi đề: đọc A-x + 3 câu hỏi B-x).'],
    ['Lesson 6–7 practice test (40 questions): 32 or more — the shape of Small test 2.', 'Đề luyện Bài 6–7 (40 câu): từ 32 — đúng hình dạng Small test 2.']],
  [20, ['Slot 20 · SMALL TEST 2 (L6–7) + review', 'Slot 20 · SMALL TEST 2 (B6–7) + ôn tập'], [['b7-thi-thu-123-form', 'Form thi nói'], ['b7-thi-thu-123-qa', 'Ngân hàng 67 câu Q&amp;A'], ['b7-thi-thu-123-reading', '20 đoạn Reading']],
    ['Speaking mock tests 4–7. Answer every question of the 67-question bank once, aloud.', 'Đề thi thử nói 4–7. Trả lời một lượt cả 67 câu trong ngân hàng, nói to.'],
    ['Self-scored mock speaking test: 80/100 or more on two different sets.', 'Tự chấm đề thi thử nói: từ 80/100 ở hai đề khác nhau.']],
  [21, ['(before the final)', '(trước ngày thi cuối kỳ)'], [['b7-thi-thu-123-viet-a', 'Đề viết A'], ['cuoi-ky-chu-han', 'Chữ Hán B4–7'], ['cuoi-ky-chia-dong-tu', 'Chia động từ']],
    ['Speaking mock tests 8–10 with a friend or CuongMini playing the examiner; practise the greeting on entering and leaving.', 'Đề thi thử nói 8–10, nhờ bạn hoặc CuongMini làm giám thị; tập câu chào khi vào và khi ra.'],
    ['Written final paper A, timed: 70% or better. Re-read your mistake notebook one last time.', 'Đề viết cuối kỳ A, bấm giờ: từ 70%. Đọc lại sổ lỗi lần cuối.']],
];

const MAT_DIEM = [
  [['Speaking · Q&amp;A', 'Nói · Hỏi–đáp'], ['Short answers (just ハノイです) when a full sentence is expected; forgetting はい／いいえ; wrong particle; silence over 10 seconds.', 'Trả lời cụt (chỉ ハノイです) khi cần trọn câu; quên はい／いいえ; sai trợ từ; im quá 10 giây.'], 'b7-thi-thu-123-form'],
  [['Speaking · Reading', 'Nói · Đọc'], ['Misreading the underlined kanji words (東京, 午後, 毎週, 来週, 名前, 今年 = ことし, 今日 = きょう) and long katakana vowels.', 'Đọc sai từ chữ Hán gạch chân (東京, 午後, 毎週, 来週, 名前, 今年 = ことし, 今日 = きょう) và trường âm katakana.'], 'b7-thi-thu-123-reading'],
  [['Adjectives', 'Tính từ'], ['いい → よくない / よかった; きれい・ゆうめい・きらい are な-adjectives; 大きいな町 is wrong.', 'いい → よくない / よかった; きれい・ゆうめい・きらい là tính từ な; 大きいな町 là sai.'], 'b4-ngu-phap'],
  [['Time words', 'Thời gian'], ['２時 (2 o’clock) vs ２時間 (2 hours); ふん / ぷん (いっぷん, さんぷん, じゅっぷん).', '２時 (2 giờ) khác ２時間 (2 tiếng); ふん / ぷん (いっぷん, さんぷん, じゅっぷん).'], 'b4-ngu-phap'],
  [['Existence', 'Tồn tại'], ['あります for things, います for people/animals; event → で～があります, location → に～があります.', 'あります cho đồ vật, います cho người/con vật; sự kiện → で～があります, nơi tồn tại → に～があります.'], 'b7-ngu-phap'],
  [['もう / まだ', 'もう / まだ'], ['いいえ、まだです — not まだ食べませんでした.', 'いいえ、まだです — không phải まだ食べませんでした.'], 'b6-ngu-phap'],
  [['て-form', 'Thể て'], ['行きます → 行って (exception); 帰る・入る・切る are group 1; 起きる・借りる・見る・いる are group 2.', '行きます → 行って (ngoại lệ); 帰る・入る・切る là nhóm 1; 起きる・借りる・見る・いる là nhóm 2.'], 'chia-the-te-bt-bai-7'],
  [['Question words', 'Từ để hỏi'], ['どちら (two choices) / どれ (three or more, stands alone) / どの + noun; どう vs どんな + noun.', 'どちら (2 lựa chọn) / どれ (từ 3, đứng một mình) / どの + danh từ; どう khác どんな + danh từ.'], 'cuoi-ky-ngu-phap'],
];

export const loTrinh = bai(
  'jpd123-lo-trinh-3-tuan',
  '0.3 — 3-week plan (block 5): what to study, say aloud and self-check each day|||0.3 — Lộ trình 3 tuần (block 5): mỗi ngày học gì, luyện nói gì, tự kiểm gì',
  'Lộ trình 21 ngày cho người học lại JPD123 trong block 3 tuần: mỗi ngày một buổi trên lớp, việc học kèm link tới đúng mục trong khoá Dekiru, 20 phút luyện nói và một mốc tự kiểm.',
  (L) => `<span class="eyebrow">${L.t('Section 0 · Lesson 0.3', 'Mục 0 · Bài 0.3')}</span>
<h2>${L.t('A 3-week plan to pass JPD123', 'Lộ trình 3 tuần để qua JPD123')}</h2>
<p class="lead">${L.t(
    'JPD123 covers Dekiru lessons 4–7. In a 3-week block the 20 class slots come about seven a week, so there is no slack: every day has one slot to prepare and review, 20 minutes of speaking, and one self-check you must pass before moving on. Each link opens the exact section of the Dekiru course on this site (desktop app: <code>/jp</code>).',
    'JPD123 học Dekiru Bài 4–7. Trong block 3 tuần, 20 slot trên lớp dồn khoảng bảy slot mỗi tuần, nên không có ngày thừa: mỗi ngày có một slot để chuẩn bị và ôn, 20 phút luyện nói, và một mốc tự kiểm phải đạt rồi mới đi tiếp. Mỗi link mở đúng mục trong khoá Dekiru trên web (app desktop: <code>/jp</code>).')}</p>
<p class="nhan">${L.t('Source: FLM · Syllabus 14470 (decision 1028, 21/08/2026) · the official JPD123 speaking guide for students', 'Nguồn: FLM · Syllabus 14470 (QĐ 1028/QĐ-ĐHFPT ngày 21/08/2026) · "JPD123 HD thi nói (Dành cho SV)"')}</p>

<h3>${L.t('What decides the result', 'Điều gì quyết định kết quả')}</h3>
${L.bang([['Component', 'Cột điểm'], ['Weight', 'Trọng số'], ['Content', 'Nội dung']], [
    [['Small test 1', 'Small test 1'], '20%', ['Multiple choice, vocabulary/grammar/kanji/reading, Lessons 4–5', 'Trắc nghiệm từ vựng, ngữ pháp, chữ Hán, đọc — Bài 4–5']],
    [['Small test 2', 'Small test 2'], '20%', ['Same format, Lessons 6–7', 'Cùng dạng, Bài 6–7']],
    [['Attendance &amp; participation', 'Chuyên cần &amp; tham gia'], '15%', ['5% attendance + 10% attitude and activity in class', '5% đi học + 10% thái độ, tích cực trên lớp']],
    [['Final · speaking', 'Cuối kỳ · Nói'], '<b>30%</b>', ['Read one passage + answer 3 questions (1 with a picture), Lessons 4–7', 'Đọc 1 đoạn + trả lời 3 câu hỏi (1 câu có tranh), Bài 4–7']],
    [['Final · written', 'Cuối kỳ · Viết'], '15%', ['30 multiple-choice questions in 30 minutes: vocabulary, grammar, kanji, reading', '30 câu trắc nghiệm trong 30 phút: từ vựng, ngữ pháp, chữ Hán, đọc hiểu']],
  ])}
<div class="callout warn">${L.t(
    '<b>Four conditions, all at once:</b> attend at least 80% of class hours (otherwise you may not sit the final) · final exam score ≥ 4/10 · no skill of the final scored 0 · overall average ≥ 5/10. Speaking alone is 30% — the largest single component — so you speak <em>every day from day 1</em>, not only in week 3.',
    '<b>Bốn điều kiện cùng lúc:</b> đi học tối thiểu 80% số giờ (thiếu là không được thi cuối kỳ) · điểm thi cuối kỳ ≥ 4/10 · không kỹ năng nào của bài thi cuối bị 0 · tổng điểm ≥ 5/10. Riêng phần Nói đã 30% — cột lớn nhất — nên bạn luyện nói <em>mỗi ngày từ ngày 1</em>, không đợi tới tuần 3.')}</div>

<h3>${L.t('The daily rhythm (about 2.5 hours outside class)', 'Nhịp mỗi ngày (khoảng 2,5 giờ ngoài giờ lên lớp)')}</h3>
<ol>
<li>${L.t('<b>Before class, 30 min:</b> the conversation and vocabulary of the slot (listen to the audio in the Dekiru lesson, read the words aloud once).', '<b>Trước giờ học, 30 phút:</b> hội thoại và từ vựng của slot (nghe tiếng trong bài Dekiru, đọc to từ mới một lượt).')}</li>
<li>${L.t('<b>After class, 60 min:</b> the "Slot N" lesson (it follows the teacher’s slides in order), then one practice set.', '<b>Sau giờ học, 60 phút:</b> mục "Slot N" (đi đúng thứ tự slide của cô), rồi một bộ luyện thêm.')}</li>
<li>${L.t('<b>Speaking, 20 min:</b> the column below — always aloud, always a full sentence, record yourself at least every other day.', '<b>Luyện nói, 20 phút:</b> cột bên dưới — luôn nói thành tiếng, luôn trọn câu, ít nhất hai ngày một lần tự ghi âm.')}</li>
<li>${L.t('<b>Self-check, 15 min:</b> the last column. Not reached → redo tomorrow morning before the new slot; do not skip ahead.', '<b>Tự kiểm, 15 phút:</b> cột cuối. Chưa đạt → làm lại sáng hôm sau trước slot mới; không nhảy cóc.')}</li>
<li>${L.t('<b>Mistake notebook:</b> every wrong answer goes in, with the rule that fixes it. Re-read it on days 7, 14 and 21.', '<b>Sổ lỗi:</b> mọi câu sai chép vào, kèm luật sửa nó. Đọc lại vào ngày 7, 14 và 21.')}</li>
</ol>

<h3>${L.t('Day by day', 'Từng ngày')}</h3>
<p>${L.t('Day 1 = Monday 30/11/2026 if you take it in block 5 of Fall 2026 (day 21 = Sunday 20/12). The real dates of the class slots, Small tests and final exam are set by the school — shift the rows to match your timetable, keep the order.', 'Ngày 1 = thứ Hai 30/11/2026 nếu bạn học ở block 5 kỳ Fall 2026 (ngày 21 = Chủ nhật 20/12). Ngày thật của các slot, Small test và thi cuối kỳ do trường xếp — dời hàng cho khớp thời khoá biểu của bạn, giữ nguyên thứ tự.')}</p>
${L.bang([['Day', 'Ngày'], ['In class', 'Trên lớp'], ['Study / review (opens Dekiru)', 'Học / ôn (mở khoá Dekiru)'], ['Speak 20 min', 'Nói 20 phút'], ['Self-check — passed when…', 'Tự kiểm — đạt khi…']],
    NGAY.map(([n, slot, hoc, noi, kiem]) => [
      `<b>${n}</b>${n === 1 ? L.t('<br>week 1', '<br>tuần 1') : n === 8 ? L.t('<br>week 2', '<br>tuần 2') : n === 15 ? L.t('<br>week 3', '<br>tuần 3') : ''}`,
      slot,
      hoc.map(([id, nhan]) => L.a(id, id === nhan ? id : [id, nhan])).join('<br>'),
      noi, kiem,
    ]))}
<p class="ghi-chu">${L.t('Link labels show the section id so you can also find it by name in the Dekiru table of contents.', 'Nhãn link trong bảng hiện tiếng Việt; trong khoá Dekiru, mục nằm đúng ở bài tương ứng (Bài 4 → Bài 7) và ở mục Ôn thi.')}</p>

<h3>${L.t('Weekly checkpoints', 'Mốc cuối mỗi tuần')}</h3>
<ul>
<li>${L.t('<b>End of week 1:</b> Lesson-4 written check ≥ 32/40, and all Lesson-4 exam questions answered without notes.', '<b>Hết tuần 1:</b> kiểm tra viết Bài 4 ≥ 32/40, và trả lời được mọi câu hỏi thi Bài 4 không nhìn.')}</li>
<li>${L.t('<b>End of week 2:</b> Small test 1 done; the teacher’s midterm review set ≥ 80%; Lesson-6 written check ≥ 32/40.', '<b>Hết tuần 2:</b> đã thi Small test 1; bộ ôn giữa kỳ của cô ≥ 80%; kiểm tra viết Bài 6 ≥ 32/40.')}</li>
<li>${L.t('<b>End of week 3:</b> two self-scored speaking mock tests ≥ 80/100; written paper A ≥ 70%; the 49-verb て-form sheet ≥ 46.', '<b>Hết tuần 3:</b> hai đề thi thử nói tự chấm ≥ 80/100; đề viết A ≥ 70%; bảng chia thể て 49 động từ ≥ 46.')}</li>
</ul>

<h3>${L.t('Where marks are usually lost', 'Chỗ hay mất điểm nhất')}</h3>
${L.bang([['Area', 'Phần'], ['What goes wrong', 'Sai ở đâu'], ['Fix it in', 'Sửa ở']],
    MAT_DIEM.map(([phan, sai, id]) => [phan, sai, L.a(id, id)]))}

<h3>${L.t('Behind schedule? Cut in this order', 'Bị chậm? Cắt theo thứ tự này')}</h3>
<ol>
<li>${L.t('Never cut: speaking 20 min, the "Slot N" lesson of the day, the て-form sheet.', 'Không bao giờ cắt: 20 phút nói, mục "Slot N" của ngày, bảng chia thể て.')}</li>
<li>${L.t('Cut first: the extra practice sets (lt-…) beyond the one listed, the 📖 "By the book" pages, the picture-vocabulary cards.', 'Cắt trước: các bộ luyện thêm (lt-…) ngoài bộ đã ghi, mục 📖 Theo sách, thẻ từ vựng bằng hình.')}</li>
<li>${L.t('Two days behind: merge a review day (day 7 or 14) into the next day, keep its self-check.', 'Chậm hai ngày: gộp ngày ôn (ngày 7 hoặc 14) vào ngày kế, vẫn giữ mốc tự kiểm của nó.')}</li>
</ol>

${L.the('b7-thi-thu-123-form', '🎙️', ['Speaking final: format, scoring, room routine', 'Thi nói cuối kỳ: form đề, cách chấm, quy trình phòng thi'], ['Reading 45 · Q&amp;A 45 · manner 10 — then 10 full mock tests.', 'Reading 45 · Q&amp;A 45 · tác phong 10 — kèm 10 đề thi thử trọn bộ.'])}
${L.the(`/courses/elementary-japanese-1-a12/learn?lessonSlug=jpd123-ban-do-dekiru`, '🗺️', ['Lesson 0.4 — the full map', 'Bài 0.4 — Bản đồ đầy đủ'], ['Which Dekiru section, school session and video belongs to each lesson.', 'Mỗi bài Dekiru: mục nào, buổi FLM nào, video nào.'], 'ACADEMY →')}`,
  { isFreePreview: true },
);

/* ═══════════════════════ 0.4 — BẢN ĐỒ ═══════════════════════ */

const BAI = [
  { n: 4, ten: ['My country, my town', 'Đất nước, thành phố của tôi'], jp: '私の国・町', flm: 'b001', flmTxt: '1–13', slot: '1–4', np: '24–36',
    kanji: '東 京 名 前 国 男 女 区 市', lt: 'lt-b4-ngu-phap-tron', kt: 'b4-kiem-tra-viet', ktn: 'b4-kiem-tra-noi',
    ac: [['jpd123-tinh-tu', '3.1–3.5'], ['jpd123-dem-thoi-gian', '4.2']] },
  { n: 5, ten: ['Days off', 'Ngày nghỉ'], jp: '休みの日', flm: 'b014', flmTxt: '14–28', slot: '5–10', np: '37–47',
    kanji: '先 週 毎 午 後 見 食 飲 買 物 行 休', lt: 'lt-b5-ngu-phap-tron', kt: 'b5-kiem-tra-viet', ktn: 'b5-kiem-tra-noi',
    ac: [['jpd123-dong-tu-masu', '1.1'], ['jpd123-mong-muon', '5.1–5.4']] },
  { n: 6, ten: ['Together!', 'Cùng nhau!'], jp: '一緒に！', flm: 'b029', flmTxt: '29–42', slot: '10–14', np: '48–60',
    kanji: '今 来 帰 会 社 聞 読 書 話', lt: 'lt-b6-np-3', kt: 'b6-kiem-tra-viet', ktn: 'b6-kiem-tra-noi',
    ac: [['jpd123-moi-ru', '4.1'], ['jpd123-so-sanh-hon-kem', '6.1–6.3'], ['jpd123-sac-thai-hoi-thoai', '5.5']] },
  { n: 7, ten: ['At a friend’s home', 'Ở nhà bạn'], jp: '友達の家で', flm: 'b043', flmTxt: '43–56', slot: '15–19', np: '61–71',
    kanji: '寺 言 貝 田 力 門 肉 料 理 野 半 大 小', lt: 'lt-b7-np-3', kt: 'b7-kiem-tra-viet', ktn: 'b7-kiem-tra-noi',
    ac: [['jpd123-the-te', '7.1–7.4']] },
];

export const banDo = bai(
  'jpd123-ban-do-dekiru',
  '0.4 — The map: where to study each Dekiru lesson (4–7)|||0.4 — Bản đồ: học từng bài Dekiru 4–7 ở đâu',
  'Bảng đối chiếu đề cương JPD123 (Dekiru Bài 4–7) với các mục đã có: khoá Dekiru trên web/app, buổi FLM kèm slide của trường, bài khái niệm trong Academy và phần ôn thi.',
  (L) => `<span class="eyebrow">${L.t('Section 0 · Lesson 0.4', 'Mục 0 · Bài 0.4')}</span>
<h2>${L.t('Where everything lives', 'Học cái gì ở đâu')}</h2>
<p class="lead">${L.t(
    'The JPD123 syllabus is exactly Dekiru lessons 4–7 (grammar points ポイント 24–71, about 300 words, 43 class kanji). The full teaching of those lessons — conversations with audio, vocabulary, grammar, the teacher’s slide-by-slide slots, thousands of practice questions, exam-format checks and the final-exam mock tests — is in the <b>Dekiru course</b> on this site. This Academy course holds the official FLM syllabus, the school’s slides per session, short concept lessons and exam information. Use the table to jump.',
    'Đề cương JPD123 chính là Dekiru Bài 4–7 (ngữ pháp ポイント 24–71, khoảng 300 từ, 43 chữ Hán của lớp). Phần dạy trọn vẹn các bài đó — hội thoại có tiếng, từ vựng, ngữ pháp, từng slot theo slide của cô, hàng nghìn câu luyện, kiểm tra đúng form thi và đề thi thử cuối kỳ — nằm ở <b>khoá Dekiru</b> trên web. Khoá Academy này giữ syllabus FLM chính thức, slide của trường theo từng buổi, các bài khái niệm ngắn và thông tin thi. Dùng bảng dưới để nhảy tới đúng chỗ.')}</p>
<p class="nhan">${L.t('Source: FLM · Syllabus 14470 · the lecturer’s official class-kanji list (Lessons 1–7)', 'Nguồn: FLM · Syllabus 14470 · danh sách "Chữ Hán" Bài 1–7 của cô')}</p>

${L.bang([['Dekiru lesson', 'Bài Dekiru'], ['School sessions (FLM) · slides', 'Buổi FLM · slide lớp'], ['Learn (Dekiru course)', 'Học (khoá Dekiru)'], ['Practise &amp; check', 'Luyện &amp; tự kiểm'], ['Academy concept lessons', 'Bài khái niệm Academy']],
    BAI.map((b) => [
      `<b>${L.t('Lesson', 'Bài')} ${b.n}</b><br>${b.jp}<br>${L.t(b.ten[0], b.ten[1])}<br>ポイント ${b.np}`,
      `<a href="${AC(`jpd123-flm-${b.flm}`)}">${L.t('Sessions', 'Buổi')} ${b.flmTxt}</a><br>Slot ${b.slot}`,
      [L.a({ buoi: b.n + 1 }, [`Lesson ${b.n} (all)`, `Bài ${b.n} (toàn bộ)`]), L.a(`b${b.n}-ngu-phap`, ['Grammar', 'Ngữ pháp']), L.a(`b${b.n}-han-lop`, ['Class kanji', 'Chữ Hán của lớp']), L.a(`b${b.n}-noi`, ['Speaking', 'Luyện nói'])].join('<br>'),
      [L.a(b.lt, ['Mixed practice', 'Luyện trộn']), L.a(b.kt, ['Written check (40 q)', 'Kiểm tra viết (40 câu)']), L.a(b.ktn, ['Speaking check', 'Kiểm tra nói'])].join('<br>'),
      b.ac.map(([s, so]) => `<a href="${AC(s)}">${so}</a>`).join(' · '),
    ]))}

<h3>${L.t('The 43 class kanji (official list)', '43 chữ Hán của lớp (danh sách chính thức)')}</h3>
${L.bang([['Lesson', 'Bài'], ['Kanji', 'Chữ'], ['Study', 'Học']], BAI.map((b) => [`${b.n}`, `<b>${b.kanji}</b>`, L.a(`lt-b${b.n}-chu-han`, ['Practice set', 'Bộ luyện chữ Hán'])]))}
<p class="ghi-chu">${L.t('Kanji tests use the word, not the bare character: 東京, 午後, 毎週, 来週, 会社, 料理, 半分, 大人 (おとな).', 'Bài kiểm tra hỏi chữ trong TỪ, không hỏi chữ rời: 東京, 午後, 毎週, 来週, 会社, 料理, 半分, 大人 (おとな).')}</p>

<h3>${L.t('Exams: where to practise each one', 'Từng kỳ thi: luyện ở đâu')}</h3>
${L.the('on-giua-ky-b4-5-dap-an', '📝', ['Small test 1 (Lessons 4–5)', 'Small test 1 (Bài 4–5)'], ['The teacher’s midterm review set with answers and explanations, plus the Kanji Mid sheet.', 'Bộ ôn giữa kỳ của cô có đáp án + giải thích, kèm phiếu Kanji Mid.'])}
${L.the('de-luyen-b6-7', '📝', ['Small test 2 (Lessons 6–7)', 'Small test 2 (Bài 6–7)'], ['40 questions in the same shape: vocabulary, kanji with look-alike distractors, grammar.', '40 câu đúng khuôn: từ vựng, chữ Hán có chữ nhiễu na ná, ngữ pháp.'])}
${L.the('b7-thi-thu-123-form', '🎙️', ['Final · speaking (30%)', 'Cuối kỳ · Nói (30%)'], ['Exam format and scoring, then 20 reading passages, the 67-question Q&amp;A bank and 10 mock tests.', 'Form đề và cách chấm, rồi 20 đoạn Reading, ngân hàng 67 câu Q&amp;A và 10 đề thi thử.'])}
${L.the('b7-thi-thu-123-viet-a', '✍️', ['Final · written (15%)', 'Cuối kỳ · Viết (15%)'], ['Written papers A and B over Lessons 4–7, plus the 8-part final review (grammar, kanji, verbs, listening…).', 'Đề viết A và B Bài 4–7, kèm 8 bài ôn cuối kỳ (ngữ pháp, chữ Hán, chia động từ, nghe…).'])}
${L.the('chia-the-te-bt-bai-7', '🔁', ['て-form: the teacher’s 49-verb sheet', 'Thể て: bảng 49 động từ của cô'], ['Answers for every verb plus the fast rule — the single most tested form in Lesson 7.', 'Đáp án từng động từ + cách chia nhanh — thể được hỏi nhiều nhất ở Bài 7.'])}
${L.the('/exam?course=JPD123', '🗂️', ['Exam room: past papers', 'Phòng thi: đề các kỳ trước'], ['Scanned past exam pages for JPD123.', 'Trang đề thi các kỳ trước của JPD123.'], 'EXAM →')}

<div class="note-ct">${L.t(
    'Videos: the Dekiru lessons carry their own lecture videos (about 9–10 per lesson, e.g. "ポイント 24–27", "class kanji Lesson 4", "speaking: exam questions"); several Academy concept lessons reuse the same videos. Concept lessons marked ★ in chapters 3 and 6 (adverbial く／に, ほど) go beyond the syllabus — useful, but not tested in JPD123.',
    'Video: các bài Dekiru có sẵn video giảng riêng (khoảng 9–10 video mỗi bài, vd. "ポイント 24–27", "chữ Hán của lớp Bài 4", "nói: câu hỏi thi"); vài bài khái niệm Academy dùng lại đúng các video đó. Những bài khái niệm có dấu ★ ở chương 3 và 6 (く／に bổ nghĩa động từ, ほど) là ngoài đề cương — có ích nhưng JPD123 không thi.')}</div>`,
  { isFreePreview: true },
);

/* ═════════════ link-card gắn vào CUỐI các bài khái niệm cũ (không xoá chữ) ═════════════ */

const C = (id, title, sub) => (L) => L.the(id, '🇯🇵', title, sub);
const N = (n) => [`Dekiru Lesson ${n} in full`, `Học trọn ở Dekiru Bài ${n}`];

export const LINK_BAI_CU = {
  'jpd123-gioi-thieu': (L) => L.the('/courses/elementary-japanese-1-a12/learn?lessonSlug=jpd123-lo-trinh-3-tuan', '🗓️', ['3-week plan (Lesson 0.3)', 'Lộ trình 3 tuần (Bài 0.3)'], ['Day-by-day plan with links into the Dekiru course.', 'Kế hoạch từng ngày, link thẳng vào khoá Dekiru.'], 'ACADEMY →'),
  'jpd123-dong-tu-masu': C('b5-ngu-phap', N(5), ['ポイント 37: ました / ませんでした, with audio and exercises.', 'ポイント 37: ました / ませんでした, có tiếng và bài tập.']),
  'jpd123-tro-tu': C('cuoi-ky-ngu-phap', ['Particle decision table (Lessons 4–7)', 'Bảng chọn trợ từ (Bài 4–7)'], ['Every particle use tested in the final, with common mistakes.', 'Mọi cách dùng trợ từ có trong đề cuối kỳ, kèm lỗi hay mắc.']),
  'jpd123-tinh-tu': C('b4-ngu-phap', N(4), ['ポイント 24–36: adjectives, あります, どんな, どうですか.', 'ポイント 24–36: tính từ, あります, どんな, どうですか.']),
  'jpd123-tinh-tu-chia-4-dang': C('b5-ngu-phap', N(5), ['Past forms of adjectives and nouns (ポイント 38).', 'Quá khứ của tính từ và danh từ (ポイント 38).']),
  'jpd123-tu-chi-muc-do': C('b4-ngu-phap', N(4), ['とても / 少し / あまり～ない in context (Lesson 4.3).', 'とても / 少し / あまり～ない trong ngữ cảnh (Bài 4.3).']),
  'jpd123-lien-tu': C('b4-ngu-phap', N(4), ['そして and ～が、～ (Lesson 4.2); それから in Lesson 5.', 'そして và ～が、～ (Bài 4.2); それから ở Bài 5.']),
  'jpd123-nguphap-chuong3': C('lt-b4-ngu-phap-tron', ['Lesson 4 mixed practice', 'Luyện trộn Bài 4'], ['Particles, question words, conjugation, error correction.', 'Trợ từ, từ để hỏi, chia từ, sửa câu sai.']),
  'jpd123-moi-ru': C('b6-ngu-phap', N(6), ['ポイント 48–52: ませんか, ましょう, ～はちょっと…, ～枚.', 'ポイント 48–52: ませんか, ましょう, ～はちょっと…, ～枚.']),
  'jpd123-dem-thoi-gian': C('b4-ngu-phap', N(4), ['～時間 / ～分 and から～まで どのくらい (Lesson 4.1).', '～時間 / ～分 và から～まで どのくらい (Bài 4.1).']),
  'jpd123-mong-muon': C('b5-ngu-phap', N(5), ['ポイント 39–41: 好き / ほしい / ～たい.', 'ポイント 39–41: 好き / ほしい / ～たい.']),
  'jpd123-muc-dich-chuyen-di': C('b5-ngu-phap', N(5), ['ポイント 42: ～へ～に行きます.', 'ポイント 42: ～へ～に行きます.']),
  'jpd123-so-thich': C('b5-ngu-phap', N(5), ['ポイント 39: N が好きです / 嫌いです.', 'ポイント 39: N が好きです / 嫌いです.']),
  'jpd123-qua-khu-ly-do': C('b5-ngu-phap', N(5), ['ポイント 44–47: どうして～から, どこか, と, それから.', 'ポイント 44–47: どうして～から, どこか, と, それから.']),
  'jpd123-sac-thai-hoi-thoai': C('b6-ngu-phap', N(6), ['ポイント 57–60: もう／まだ, ね, よ, どうですか.', 'ポイント 57–60: もう／まだ, ね, よ, どうですか.']),
  'jpd123-so-sanh-hon-kem': C('b6-ngu-phap', N(6), ['ポイント 53–56: いちばん, より, どちら, のほうが.', 'ポイント 53–56: いちばん, より, どちら, のほうが.']),
  'jpd123-so-sanh-nhat': C('b6-ngu-phap', N(6), ['ポイント 53: N1 で N2 が いちばん A です.', 'ポイント 53: N1 で N2 が いちばん A です.']),
  'jpd123-cau-hoi-so-sanh': C('b6-ngu-phap', N(6), ['ポイント 55–56: どちらが / のほうが / どちらも.', 'ポイント 55–56: どちらが / のほうが / どちらも.']),
  'jpd123-nguphap-chuong6': C('lt-b6-np-2', ['Lesson 6 practice: comparison', 'Luyện thêm Bài 6: so sánh'], ['About 70 questions on いちばん, より, どちら.', 'Khoảng 70 câu về いちばん, より, どちら.']),
  'jpd123-the-te': C('b7-ngu-phap', N(7), ['ポイント 61–71 and the full て-form.', 'ポイント 61–71 và trọn bộ thể て.']),
  'jpd123-bang-chia-the-te': C('chia-the-te-bt-bai-7', ['The teacher’s 49-verb て-form sheet', 'Bảng chia thể て 49 động từ của cô'], ['Answers + the fast rule.', 'Đáp án + cách chia nhanh.']),
  'jpd123-teimasu': C('b7-ngu-phap', N(7), ['ポイント 64: ～ています, with picture questions.', 'ポイント 64: ～ています, kèm câu hỏi có tranh.']),
  'jpd123-ton-tai-dung-cu-cach-lam': C('b7-ngu-phap', N(7), ['ポイント 61–62, 66, 71: location, 方, で (tool).', 'ポイント 61–62, 66, 71: vị trí, 方, で (dụng cụ).']),
  'jpd123-kanji': C('cuoi-ky-chu-han', ['All class kanji of Lessons 4–7', 'Toàn bộ chữ Hán của lớp Bài 4–7'], ['Readings in words + look-alike traps (聞／間／問, 買／貝, 午／牛).', 'Đọc trong từ + bẫy chữ na ná (聞／間／問, 買／貝, 午／牛).']),
  'jpd123-final-exam-pe': (L) => [
    L.the('b7-thi-thu-123-form', '🎙️', ['Speaking final: format &amp; scoring', 'Thi nói cuối kỳ: form đề &amp; cách chấm'], ['Reading 45 · Q&amp;A 45 · manner 10, room routine, ways to lose marks.', 'Reading 45 · Q&amp;A 45 · tác phong 10, quy trình phòng thi, lỗi mất điểm.']),
    L.the('b7-thi-thu-123-reading', '📖', ['20 exam-style reading passages', '20 đoạn Reading đúng form đề'], ['Class kanji underlined, as on the real sheet.', 'Chữ Hán của lớp gạch chân như tờ đề thật.']),
    L.the('b7-thi-thu-123-qa', '💬', ['Q&amp;A bank: 67 questions (Lessons 4.1 → 7)', 'Ngân hàng Q&amp;A: 67 câu (Bài 4.1 → 7)'], ['With model answers and picture questions.', 'Có câu trả lời mẫu và câu hỏi có tranh.']),
    L.the('b7-thi-thu-123-de-1', '⏱️', ['Mock speaking test 1 (of 10)', 'Đề thi thử nói 1 (trong 10 đề)'], ['Reading A-1 + Q&amp;A B-1.', 'Reading A-1 + Q&amp;A B-1.']),
  ].join('\n'),
  'jpd123-final-exam-fe': (L) => [
    L.the('cuoi-ky-cau-truc', '🧭', ['Final review: structure and strategy', 'Ôn cuối kỳ: cấu trúc và chiến lược'], ['Question types of the teacher’s review set, part by part.', 'Các dạng câu trong bộ ôn của cô, từng phần.']),
    L.the('b7-thi-thu-123-viet-a', '✍️', ['Written final paper A', 'Đề viết cuối kỳ A'], ['Lessons 4–7: kanji, vocabulary, grammar, reading. Paper B follows it.', 'Bài 4–7: chữ Hán, từ vựng, ngữ pháp, đọc. Đề B ở ngay sau.']),
  ].join('\n'),
};

/** Gắn link-card vào các bài cũ theo slug (chỉ chèn, không xoá). */
export function ganLinkDekiru(sections) {
  return sections.map((s) => ({ ...s, lessons: s.lessons.map((l) => (LINK_BAI_CU[l.slug] ? chenCuoi(l, LINK_BAI_CU[l.slug]) : l)) }));
}
