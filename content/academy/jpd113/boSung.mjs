/**
 * JPD113 — phần bổ sung 22/11/2026: KHÔNG soạn lại kiến thức (khoá Dekiru /language/ja/dekiru đã có Bài 0–3 rất dày:
 * từ vựng đúng danh sách của lớp, ngữ pháp ポイント 1–23, chữ Hán chính thức, nghe, nói, slide theo slot, luyện thêm,
 * đề tổng hợp, thi thử JPD113, 19 video). Ở đây chỉ:
 *   1. Mục "Bắt đầu tại đây — Lộ trình 3 tuần Block 5 & bản đồ tài nguyên" (2 bài): lộ trình từng slot/ngày dẫn sang bài
 *      sẵn có + bảng đối chiếu đề cương ↔ Dekiru ↔ Academy ↔ video.
 *   2. Thẻ "Học sâu trên khoá Dekiru" gắn CUỐI các bài Academy cũ (chỉ chèn thêm, không sửa chữ cũ).
 *   3. Đính chính đã xác minh: syllabus mới 14469 (QĐ 1028, 21/08/2026) CÓ công bố số câu/thời lượng; thang chấm nói
 *      có hai bản (30/60/10 cũ · 40/55/5 bản hướng dẫn 09/06/2025).
 * Ghép vào môn bằng ganBoSung(spec) ở cuối content/academy/JPD113.mjs.
 */

const REF = 'ref=%2Fcourses%2Felementary-japanese-1-a11%2Flearn&reflabel=JPD113%20%E2%80%94%20Elementary%20Japanese';
const DK = (id) => `/language/ja/dekiru?bai=${id}&${REF}`;
const AC = (slug) => `/courses/elementary-japanese-1-a11/learn?lessonSlug=${slug}`;
const EXAM = '/exam?course=JPD113';
const ONTHI = '/tech-trends/on-thi-jpd113';

/* Nhãn ngắn của các bài trên khoá Dekiru (đúng id trong frontend/src/app/language/[code]/dekiru/bai/manifest.ts). */
const NHAN = {
  'bat-dau': ['Start here (Dekiru course)', 'Bắt đầu tại đây (khoá Dekiru)'],
  'b0-hiragana': ['Hiragana — 46 basic kana', 'Hiragana — 46 chữ cơ bản'],
  'b0-dakuon': ['Voiced sounds & combined sounds', 'Âm đục & âm ghép'],
  'b0-katakana': ['Katakana', 'Katakana'],
  'b0-am-dac-biet': ['っ, long vowels, ん, は・へ・を', 'っ, trường âm, ん, は・へ・を'],
  'b0-chao-hoi': ['Greetings, classroom phrases & exam-room etiquette', 'Chào hỏi, câu trong lớp & nghi thức phòng thi'],
  'b0-luyen-kana': ['🎌 Kana trainer (progress board)', '🎌 Luyện bảng chữ (bảng tiến độ)'],
  'lt-b0-hiragana-hang': ['Hiragana row by row (148 items)', 'Hiragana theo hàng (148 câu)'],
  'lt-b0-cap-nham': ['Look-alike kana (80 items)', 'Cặp chữ dễ nhầm (80 câu)'],
  'lt-b0-am-duc-ghep': ['Dakuten & ゃゅょ (97 items)', 'Âm đục & âm ghép (97 câu)'],
  'lt-b0-am-dac-biet': ['Hear っ / long vowels / ん (62 items)', 'Nghe っ / trường âm / ん (62 câu)'],
  'lt-b0-katakana': ['Katakana words (125 items)', 'Katakana & từ mượn (125 câu)'],
  'lt-b0-doc-tu-viet': ['Read real Lesson 1–2 words', 'Đọc từ thật của Bài 1–2'],
  'lt-b0-de-kiem-tra': ['Kana test — 80 items, 40 min', 'Đề kiểm tra bảng chữ — 80 câu, 40 phút'],
  'b1-tu-vung': ['Lesson 1 words (class list)', 'Từ vựng Bài 1 (danh sách của lớp)'],
  'b1-ngu-phap': ['Lesson 1 grammar — points 1–6', 'Ngữ pháp Bài 1 — ポイント 1–6'],
  'b1-han-lop': ['Lesson 1 class kanji', 'Chữ Hán của lớp · Bài 1'],
  'b1-nghe': ['Lesson 1 listening', 'Luyện nghe Bài 1'],
  'b1-noi': ['Lesson 1 speaking (exam style)', 'Luyện nói Bài 1 (dạng đề)'],
  'b1-doc-to': ['Lesson 1 read-aloud (Reading part)', 'Đọc to Bài 1 (phần Reading)'],
  'b1-luyen-nho': ['🃏 Lesson 1 flashcards', '🃏 Luyện nhớ Bài 1'],
  'slide-tong-hop-b1': ['Lesson 1 summary slides', 'Slide tổng hợp Bài 1'],
  's113-b1-01-chao-hoi-ten': ['🎬 L1 · greetings & names', '🎬 B1 · chào hỏi & tên'],
  's113-b1-02-nuoc-nguoi': ['🎬 L1 · countries & nationality', '🎬 B1 · nước & người nước nào'],
  's113-b1-03-truong-nghe': ['🎬 L1 · school, job, N の N', '🎬 B1 · trường, nghề, N の N'],
  's113-b1-04-tuoi-ngay-sinh': ['🎬 L1 · age, months, days, birthday', '🎬 B1 · tuổi, tháng, ngày, sinh nhật'],
  's113-b1-05-so-thich': ['🎬 L1 · hobbies, と, も', '🎬 B1 · sở thích, と, も'],
  's113-b1-06-tong-hop-noi-han': ['🎬 L1 · full self-intro + kanji', '🎬 B1 · tự giới thiệu trọn + chữ Hán'],
  's113-slide-b1-slot-07-chao-ten-nuoc-nghe': ['📽️ Slot 7 slides', '📽️ Slide slot 7'],
  's113-slide-b1-slot-08-n-no-n-tuoi-ngay-sinh': ['📽️ Slot 8 slides', '📽️ Slide slot 8'],
  's113-slide-b1-slot-09-luyen-st2-so-thich-to': ['📽️ Slot 9 slides', '📽️ Slide slot 9'],
  's113-slide-b1-slot-10-mo-kanji-on-bai-1': ['📽️ Slot 10 slides', '📽️ Slide slot 10'],
  'lt-b1-tu-vung': ['L1 extra · words (~150)', 'Luyện thêm B1 · từ vựng (~150 câu)'],
  'lt-b1-chu-han': ['L1 extra · kanji', 'Luyện thêm B1 · chữ Hán'],
  'lt-b1-ngu-phap-1': ['L1 extra · grammar 1 (です/じゃありません)', 'Luyện thêm B1 · ngữ pháp 1 (です/じゃありません)'],
  'lt-b1-ngu-phap-2': ['L1 extra · grammar 2 (dates, age, の)', 'Luyện thêm B1 · ngữ pháp 2 (ngày, tuổi, の)'],
  'lt-b1-ngu-phap-3': ['L1 extra · grammar 3 (と, も)', 'Luyện thêm B1 · ngữ pháp 3 (と, も)'],
  'lt-b1-ngu-phap-tron': ['L1 extra · mixed grammar', 'Luyện thêm B1 · ngữ pháp trộn'],
  'lt-b1-doc-hieu': ['L1 extra · reading', 'Luyện thêm B1 · đọc hiểu'],
  'lt-b1-nghe': ['L1 extra · listening (9 clips)', 'Luyện thêm B1 · nghe (9 đoạn)'],
  'lt-b1-noi-viet': ['L1 extra · speaking & writing', 'Luyện thêm B1 · nói & viết'],
  'lt-b1-de-tong-hop': ['L1 test · 45 min, 100 pts', 'Đề tổng hợp B1 · 45 phút, 100 điểm'],
  'b2-tu-vung': ['Lesson 2 words (class list)', 'Từ vựng Bài 2 (danh sách của lớp)'],
  'b2-ngu-phap': ['Lesson 2 grammar — points 7–15', 'Ngữ pháp Bài 2 — ポイント 7–15'],
  'b2-han-lop': ['Lesson 2 class kanji (numbers, 円)', 'Chữ Hán của lớp · Bài 2 (số, 円)'],
  'b2-nghe': ['Lesson 2 listening', 'Luyện nghe Bài 2'],
  'b2-noi': ['Lesson 2 speaking (exam style)', 'Luyện nói Bài 2 (dạng đề)'],
  'b2-doc-to': ['Lesson 2 read-aloud', 'Đọc to Bài 2'],
  'b2-luyen-nho': ['🃏 Lesson 2 flashcards', '🃏 Luyện nhớ Bài 2'],
  'slide-tong-hop-b2': ['Lesson 2 summary slides', 'Slide tổng hợp Bài 2'],
  's113-b2-01-noi-chon-toa-nha': ['🎬 L2 · places, floors', '🎬 B2 · nơi chốn, tầng mấy'],
  's113-b2-02-do-vat-gan-xa': ['🎬 L2 · これ/この', '🎬 B2 · これ/この'],
  's113-b2-03-so-va-gia-tien': ['🎬 L2 · numbers & prices', '🎬 B2 · số & giá tiền'],
  's113-b2-04-sieu-thi-mua-do': ['🎬 L2 · をください, 〜つ', '🎬 B2 · をください, 〜つ'],
  's113-b2-05-nha-hang-goi-mon': ['🎬 L2 · restaurant, 何の/どこの', '🎬 B2 · nhà hàng, 何の/どこの'],
  's113-b2-06-cua-ai-tieng-gi-tong-hop': ['🎬 L2 · だれの, 〜語で + review', '🎬 B2 · だれの, 〜語で + tổng hợp'],
  's113-slide-b2-slot-11-kiem-tra-1-mo-bai-2-tang': ['📽️ Slot 11 slides', '📽️ Slide slot 11'],
  's113-slide-b2-slot-12-koko-kochira-kore-ikura': ['📽️ Slot 12 slides', '📽️ Slide slot 12'],
  's113-slide-b2-slot-13-kono-kudasai-doc-gia': ['📽️ Slot 13 slides', '📽️ Slide slot 13'],
  's113-slide-b2-slot-14-nha-hang-nan-no-doko-no-dare-no': ['📽️ Slot 14 slides', '📽️ Slide slot 14'],
  's113-slide-b2-slot-15-kanji-so-on-bai-2': ['📽️ Slot 15 slides (Lesson 2)', '📽️ Slide slot 15 (Bài 2)'],
  'lt-b2-tu-vung': ['L2 extra · words (~190)', 'Luyện thêm B2 · từ vựng (~190 câu)'],
  'lt-b2-chu-han': ['L2 extra · kanji', 'Luyện thêm B2 · chữ Hán'],
  'lt-b2-ngu-phap-1': ['L2 extra · grammar 1 (ko-so-a, 〜階)', 'Luyện thêm B2 · ngữ pháp 1 (ko-so-a, 〜階)'],
  'lt-b2-ngu-phap-2': ['L2 extra · grammar 2 (prices, 〜つ)', 'Luyện thêm B2 · ngữ pháp 2 (giá, 〜つ)'],
  'lt-b2-ngu-phap-3': ['L2 extra · grammar 3 (何の/どこの/だれの/〜語で)', 'Luyện thêm B2 · ngữ pháp 3 (何の/どこの/だれの/〜語で)'],
  'lt-b2-ngu-phap-tron': ['L2 extra · mixed grammar', 'Luyện thêm B2 · ngữ pháp trộn'],
  'lt-b2-doc-hieu': ['L2 extra · reading', 'Luyện thêm B2 · đọc hiểu'],
  'lt-b2-nghe': ['L2 extra · listening (9 clips)', 'Luyện thêm B2 · nghe (9 đoạn)'],
  'lt-b2-noi-viet': ['L2 extra · speaking & writing', 'Luyện thêm B2 · nói & viết'],
  'lt-b2-de-tong-hop': ['L2 test · 45 min, 100 pts', 'Đề tổng hợp B2 · 45 phút, 100 điểm'],
  'b3-tu-vung': ['Lesson 3 words (class list)', 'Từ vựng Bài 3 (danh sách của lớp)'],
  'b3-ngu-phap': ['Lesson 3 grammar — points 16–23', 'Ngữ pháp Bài 3 — ポイント 16–23'],
  'b3-han-lop': ['Lesson 3 class kanji', 'Chữ Hán của lớp · Bài 3'],
  'b3-nghe': ['Lesson 3 listening', 'Luyện nghe Bài 3'],
  'b3-noi': ['Lesson 3 speaking (exam style)', 'Luyện nói Bài 3 (dạng đề)'],
  'b3-doc-to': ['Lesson 3 read-aloud', 'Đọc to Bài 3'],
  'b3-luyen-nho': ['🃏 Lesson 3 flashcards', '🃏 Luyện nhớ Bài 3'],
  'slide-tong-hop-b3': ['Lesson 3 summary slides', 'Slide tổng hợp Bài 3'],
  's113-b3-01-doc-gio-hoi-gio-mo-cua': ['🎬 L3 · time, opening hours', '🎬 B3 · giờ, giờ mở cửa'],
  's113-b3-02-thu-thang-ngay-lich-nam': ['🎬 L3 · weekdays, dates, school year', '🎬 B3 · thứ, ngày, lịch năm'],
  's113-b3-03-dong-tu-masu-he-wo': ['🎬 L3 · ます/ません, へ, を', '🎬 B3 · ます/ません, へ, を'],
  's113-b3-04-ni-gio-de-noi-ke-mot-ngay': ['🎬 L3 · に (time), で (place)', '🎬 B3 · に (mốc giờ), で (nơi làm)'],
  's113-b3-05-ya-nado-nanimo-dokoemo': ['🎬 L3 · や〜など, 何も, どこへも', '🎬 B3 · や〜など, 何も, どこへも'],
  's113-b3-06-chu-han-gio-thu-buoi': ['🎬 L3 · kanji (time, weekdays)', '🎬 B3 · chữ Hán (giờ, thứ)'],
  's113-b3-07-on-bai-3-thi-noi-lesson-3': ['🎬 L3 · review + Lesson 3 speaking', '🎬 B3 · ôn + thi nói Lesson 3'],
  's113-slide-b3-slot-15-mo-bai-3-may-gio': ['📽️ Slot 15 slides (Lesson 3)', '📽️ Slide slot 15 (Bài 3)'],
  's113-slide-b3-slot-16-kara-made-thu-kanji-3': ['📽️ Slot 16 slides', '📽️ Slide slot 16'],
  's113-slide-b3-slot-17-lich-trinh-masu-wo-he-masen': ['📽️ Slot 17 slides', '📽️ Slide slot 17'],
  's113-slide-b3-slot-18-de-moi-ngay-ni-ya-nanimo': ['📽️ Slot 18 slides', '📽️ Slide slot 18'],
  's113-slide-b3-slot-19-kara-made-v-dokoemo-on-bai-3': ['📽️ Slot 19 slides', '📽️ Slide slot 19'],
  'lt-b3-tu-vung': ['L3 extra · words (80 words)', 'Luyện thêm B3 · từ vựng (80 từ)'],
  'lt-b3-chu-han': ['L3 extra · kanji', 'Luyện thêm B3 · chữ Hán'],
  'lt-b3-ngu-phap-gio-ngay': ['L3 extra · time, weekdays, dates', 'Luyện thêm B3 · giờ, thứ, ngày tháng'],
  'lt-b3-ngu-phap-1': ['L3 extra · grammar 1 (ます, へ, を)', 'Luyện thêm B3 · ngữ pháp 1 (ます, へ, を)'],
  'lt-b3-ngu-phap-2': ['L3 extra · grammar 2 (に vs で vs へ)', 'Luyện thêm B3 · ngữ pháp 2 (に / で / へ)'],
  'lt-b3-ngu-phap-3': ['L3 extra · grammar 3 (から〜まで, や, 何も)', 'Luyện thêm B3 · ngữ pháp 3 (から〜まで, や, 何も)'],
  'lt-b3-ngu-phap-tron': ['L3 extra · mixed grammar', 'Luyện thêm B3 · ngữ pháp trộn'],
  'lt-b3-doc-hieu': ['L3 extra · reading', 'Luyện thêm B3 · đọc hiểu'],
  'lt-b3-nghe': ['L3 extra · listening (10 clips)', 'Luyện thêm B3 · nghe (10 đoạn)'],
  'lt-b3-noi-viet': ['L3 extra · 5 speaking sets', 'Luyện thêm B3 · 5 bộ câu hỏi thi nói'],
  'lt-b3-de-tong-hop': ['L3 test · 60 min, 100 pts', 'Đề tổng hợp B3 · 60 phút, 100 điểm'],
  'b3-thi-thu-113-de-1': ['📝 JPD113 mock exam 1', '📝 Đề thi thử JPD113 số 1'],
  'b3-thi-thu-113-de-2': ['📝 JPD113 mock exam 2', '📝 Đề thi thử JPD113 số 2'],
  'b3-thi-thu-113-de-3': ['📝 JPD113 mock exam 3', '📝 Đề thi thử JPD113 số 3'],
  'b3-thi-thu-113-chien-luoc': ['🧭 Exam strategy & point-losing mistakes', '🧭 Chiến lược thi & lỗi mất điểm'],
  'b3-thi-thu-113-tu-cham': ['📊 Self-scoring sheet', '📊 Bảng tự chấm'],
  'on113-cau-truc': ['JPD113 speaking: format & marking (06/2025)', 'Thi nói JPD113: cấu trúc & cách chấm (06/2025)'],
  'on113-ngu-phap-tu-vung': ['JPD113 review: grammar & vocab', 'Ôn JPD113: ngữ pháp & từ vựng'],
  'on113-doc-to': ['JPD113 review: read-aloud', 'Ôn JPD113: đọc to'],
  'on113-noi-mau': ['JPD113 review: model answers', 'Ôn JPD113: mẫu trả lời'],
  'on113-de-tong-hop': ['JPD113 review: mixed test', 'Ôn JPD113: đề tổng hợp'],
  'on113-loi-mat-diem': ['JPD113 review: point-losing mistakes', 'Ôn JPD113: lỗi mất điểm'],
};

const SO_AC = {"jpd113-quiz-1":"Quiz 1","jpd113-quiz-so":"Quiz 2 (số)","jpd113-quiz-dong-tu":"Quiz 3","jpd113-nguphap-chuong4":"TT ngữ pháp Ch4","jpd113-nguphap-chuong5":"TT ngữ pháp Ch5","jpd113-nguphap-chuong6":"TT ngữ pháp Ch6","jpd113-final-exam-fe":"FE","jpd113-hiragana-goc":"1.1","jpd113-hiragana-bien-am":"1.2","jpd113-n-truong-am-tro-tu":"1.3","jpd113-katakana":"2.1","jpd113-chao-hoi-so":"3.1","jpd113-so-dem-day-du":"3.2","jpd113-tien-gia-ca":"3.3","jpd113-ngay-gio-tuoi":"3.4","jpd113-youbi":"3.5","jpd113-dem-tang":"3.6","jpd113-bai-1-ngu-phap":"4.1","jpd113-mo-ka":"4.2","jpd113-quoc-tich-nghe-nghiep":"4.3","jpd113-tu-trong-ngon-ngu-khac":"4.4","jpd113-bai-2-3-ngu-phap":"5.1","jpd113-kono-sono-ano":"5.2","jpd113-tu-de-hoi":"5.3","jpd113-tro-tu-wo-ni-de-e":"5.4","jpd113-kochira-dokono-nanno":"5.5","jpd113-to-ya-nado":"5.6","jpd113-masu-form":"6.1","jpd113-dong-tu-thuong-gap":"6.2","jpd113-idou-full":"6.3","jpd113-kara-made":"6.4","jpd113-kanji":"7.1","jpd113-kanji-so-thoi-gian":"7.2","jpd113-kanji-nguoi-truong-hoc":"7.3","jpd113-speaking-cau-truc":"S.1","jpd113-speaking-doc-1-7":"S.2","jpd113-speaking-doc-8-13":"S.3","jpd113-speaking-cau-hoi-khong-tranh":"S.4","jpd113-speaking-cau-hoi-co-tranh":"S.5","jpd113-speaking-lo-trinh-meo":"S.6"};
const acLink = (s) => { if (!SO_AC[s]) throw new Error(`JPD113 boSung: thiếu số bài Academy '${s}'`); return a(AC(s), `Academy ${SO_AC[s]}`); };
const a = (href, text) => `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
const dk = (id, k) => {
  if (!NHAN[id]) throw new Error(`JPD113 boSung: thiếu nhãn cho bài Dekiru '${id}'`);
  return a(DK(id), NHAN[id][k === 'en' ? 0 : 1]);
};
const dks = (ids, k) => ids.map((id) => dk(id, k)).join('<br>');

function the(href, ico, title, sub, cta) {
  return `<a class="link-card codelab" href="${href}" target="_blank" rel="noopener">
  <span class="lc-ico">${ico}</span>
  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>
  <span class="lc-cta">${cta}</span>
</a>`;
}
const theDk = (id, k) => the(DK(id), '🗾', NHAN[id][k === 'en' ? 0 : 1], k === 'en' ? 'Interactive lesson with audio on the Dekiru course' : 'Bài tương tác có giọng đọc trên khoá Dekiru', 'DEKIRU →');

/* ═══════════════════════ 1. LỘ TRÌNH 3 TUẦN BLOCK 5 ═══════════════════════ */
/* Một dòng = một slot của lớp (slot n = tiết 3n−2…3n, đúng bảng 60 tiết của syllabus 14469). */
const SLOT = [
  { s: 1, tuan: 1, lop: ['Course intro · hiragana: first 20 + next 26 · greetings 1', 'Giới thiệu môn · hiragana: 20 chữ đầu + 26 chữ tiếp · chào hỏi 1'],
    hoc: ['b0-hiragana', 'b0-luyen-kana', 'lt-b0-hiragana-hang'], ac: ['jpd113-hiragana-goc'],
    noi: ['おはようございます / こんにちは / こんばんは — say each 5× aloud', 'おはようございます / こんにちは / こんばんは — nói to mỗi câu 5 lần'],
    kiem: ['Read the 46 hiragana in random order, under 2 s each, in the kana trainer', 'Đọc 46 chữ hiragana theo thứ tự ngẫu nhiên, mỗi chữ dưới 2 giây (bảng luyện kana)'] },
  { s: 2, tuan: 1, lop: ['Voiced sounds ゛゜ · combined sounds ゃゅょ · greetings 2–3 · classroom phrases', 'Âm đục ゛゜ · âm ghép ゃゅょ · chào hỏi 2–3 · câu trong lớp'],
    hoc: ['b0-dakuon', 'lt-b0-am-duc-ghep', 'b0-chao-hoi'], ac: ['jpd113-hiragana-bien-am', 'jpd113-chao-hoi-so'],
    noi: ['Classroom phrases: もう一度お願いします · わかりません · すみません', 'Câu trong lớp: もう一度お願いします · わかりません · すみません'],
    kiem: ['Tell きや (2 beats) from きゃ (1 beat) by ear', 'Nghe phân biệt được きや (2 nhịp) và きゃ (1 nhịp)'] },
  { s: 3, tuan: 1, lop: ['Long vowels · small っ · numbers · greetings 4', 'Trường âm · âm ngắt っ · số đếm · chào hỏi 4'],
    hoc: ['b0-am-dac-biet', 'lt-b0-am-dac-biet'], ac: ['jpd113-n-truong-am-tro-tu', 'jpd113-so-dem-day-du'],
    noi: ['Count 1–100 aloud; read は/へ/を as particles: わたしは = wa', 'Đếm to 1–100; đọc は/へ/を khi là trợ từ: わたしは = wa'],
    kiem: ['Hear おばさん vs おばあさん, きて vs きって correctly (62-item set ≥ 85%)', 'Nghe đúng おばさん/おばあさん, きて/きって (bộ 62 câu ≥ 85%)'] },
  { s: 4, tuan: 1, lop: ['Greetings 5 · full hiragana review · katakana: intro + first 20', 'Chào hỏi 5 · tổng ôn hiragana · katakana: giới thiệu + 20 chữ đầu'],
    hoc: ['b0-katakana', 'lt-b0-cap-nham'], ac: ['jpd113-katakana'],
    noi: ['Read country names aloud: ベトナム · アメリカ · オーストラリア', 'Đọc to tên nước: ベトナム · アメリカ · オーストラリア'],
    kiem: ['Write all hiragana on blank paper from memory (no gaps)', 'Viết cả bảng hiragana ra giấy trắng từ trí nhớ (không ô trống)'] },
  { s: 5, tuan: 1, lop: ['Katakana: next 26 · long vowels ー', 'Katakana: 26 chữ tiếp · trường âm ー'],
    hoc: ['lt-b0-katakana'], ac: ['jpd113-katakana'],
    noi: ['Read loanwords with ー: コーヒー · スーパー · エレベーター', 'Đọc từ mượn có ー: コーヒー · スーパー · エレベーター'],
    kiem: ['No more シ/ツ and ソ/ン confusion (look-alike set ≥ 90%)', 'Hết nhầm シ/ツ, ソ/ン (bộ cặp dễ nhầm ≥ 90%)'] },
  { s: 6, tuan: 1, lop: ['Katakana っ + combined · full kana review · textbook introduction', 'Katakana âm ngắt + âm ghép · ôn tổng hợp kana · giới thiệu giáo trình'],
    hoc: ['lt-b0-doc-tu-viet', 'lt-b0-de-kiem-tra'], ac: ['jpd113-quiz-1'],
    noi: ['Read the Lesson 1 words in kana aloud (preview)', 'Đọc to từ Bài 1 bằng kana (học trước)'],
    kiem: ['Kana test (80 items, 40 min) ≥ 85/100 → ready for Lesson 1', 'Đề bảng chữ (80 câu, 40 phút) ≥ 85/100 → sẵn sàng vào Bài 1'] },
  { s: 7, tuan: 2, lop: ['Lesson 1 ST1: name · country · job (points 1–3, どちら)', 'Bài 1 ST1: tên · nước · nghề (ポイント 1–3, どちら)'],
    hoc: ['s113-slide-b1-slot-07-chao-ten-nuoc-nghe', 's113-b1-01-chao-hoi-ten', 's113-b1-02-nuoc-nguoi', 'b1-tu-vung'], ac: ['jpd113-bai-1-ngu-phap', 'jpd113-quoc-tich-nghe-nghiep'],
    noi: ['Answer お名前は？ / お国はどちらですか / お仕事は？ in full sentences', 'Trả lời trọn câu お名前は？ / お国はどちらですか / お仕事は？'],
    kiem: ['Switch です ↔ じゃありません ↔ ですか for any noun without hesitation', 'Đổi です ↔ じゃありません ↔ ですか với mọi danh từ không ngập ngừng'] },
  { s: 8, tuan: 2, lop: ['ST1 N の N · ST2 age 〜歳 · いつ, 〜月〜日', 'ST1 N の N · ST2 tuổi 〜歳 · いつ, 〜月〜日'],
    hoc: ['s113-slide-b1-slot-08-n-no-n-tuoi-ngay-sinh', 's113-b1-03-truong-nghe', 's113-b1-04-tuoi-ngay-sinh', 'lt-b1-ngu-phap-2'], ac: ['jpd113-ngay-gio-tuoi'],
    noi: ['Say your age and birthday; read 1日–10日, 14日, 20日, 24日 aloud', 'Nói tuổi và sinh nhật của bạn; đọc to 1日–10日, 14日, 20日, 24日'],
    kiem: ['Read 20 random dates correctly (only 1 mistake allowed)', 'Đọc đúng 20 ngày tháng ngẫu nhiên (sai tối đa 1)'] },
  { s: 9, tuan: 2, lop: ['ST2 practice · ST3 hobbies 何ですか · N と N', 'Luyện ST2 · ST3 sở thích 何ですか · N と N'],
    hoc: ['s113-slide-b1-slot-09-luyen-st2-so-thich-to', 's113-b1-05-so-thich', 'lt-b1-ngu-phap-3'], ac: ['jpd113-mo-ka'],
    noi: ['30-second self-introduction (name, country, school, age, birthday, hobby)', 'Tự giới thiệu 30 giây (tên, nước, trường, tuổi, sinh nhật, sở thích)'],
    kiem: ['Record the self-intro: no missing です, no さん after your own name', 'Ghi âm bài tự giới thiệu: không thiếu です, không gắn さん cho tên mình'] },
  { s: 10, tuan: 2, lop: ['ST3 N も · Lesson 1 kanji · Lesson 1 review', 'ST3 N も · chữ Hán Bài 1 · ôn Bài 1'],
    hoc: ['s113-slide-b1-slot-10-mo-kanji-on-bai-1', 'b1-han-lop', 's113-b1-06-tong-hop-noi-han', 'lt-b1-ngu-phap-tron'], ac: ['jpd113-kanji-nguoi-truong-hoc', 'jpd113-nguphap-chuong4'],
    noi: ['Lesson 1 speaking questions (exam style) + read-aloud Lesson 1', 'Câu hỏi nói Bài 1 (dạng đề) + đọc to Bài 1'],
    kiem: ['GATE for small test 1: Lesson 1 test ≥ 80/100 and kana test ≥ 85/100', 'CỔNG trước Small test 1: đề tổng hợp B1 ≥ 80/100 và đề bảng chữ ≥ 85/100'], cong: ['lt-b1-de-tong-hop', 'lt-b0-de-kiem-tra'] },
  { s: 11, tuan: 2, lop: ['⭐ SMALL TEST 1 (kana + Lesson 1, 20%) · Lesson 2 ST1 何階', '⭐ SMALL TEST 1 (bảng chữ + Bài 1, 20%) · Bài 2 ST1 何階'],
    hoc: ['s113-slide-b2-slot-11-kiem-tra-1-mo-bai-2-tang', 's113-b2-01-noi-chon-toa-nha', 'b2-tu-vung'], ac: ['jpd113-dem-tang'],
    noi: ['〜は何階ですか → 3階(さんがい)です; read 1階–10階 aloud', '〜は何階ですか → 3階(さんがい)です; đọc to 1階–10階'],
    kiem: ['Read 1階 いっかい · 3階 さんがい · 6階 ろっかい · 8階 はっかい · 10階 じゅっかい without looking', 'Đọc 1階 いっかい · 3階 さんがい · 6階 ろっかい · 8階 はっかい · 10階 じゅっかい không nhìn'] },
  { s: 12, tuan: 2, lop: ['ST1 ここ・そこ・あそこ / こちら… · ST2 いくら, これ・それ・あれ', 'ST1 ここ・そこ・あそこ / こちら… · ST2 いくら, これ・それ・あれ'],
    hoc: ['s113-slide-b2-slot-12-koko-kochira-kore-ikura', 's113-b2-02-do-vat-gan-xa', 's113-b2-03-so-va-gia-tien', 'lt-b2-ngu-phap-1'], ac: ['jpd113-bai-2-3-ngu-phap', 'jpd113-kochira-dokono-nanno', 'jpd113-tien-gia-ca'],
    noi: ['Ask & answer price: これはいくらですか → 〜円です', 'Hỏi – đáp giá: これはいくらですか → 〜円です'],
    kiem: ['Read 300 · 600 · 800 · 3,000 · 8,000 · 10,000 yen correctly', 'Đọc đúng 300 · 600 · 800 · 3.000 · 8.000 · 10.000 yên'] },
  { s: 13, tuan: 3, lop: ['ST2 この N · N をください · reading prices', 'ST2 この N · N をください · đọc giá'],
    hoc: ['s113-slide-b2-slot-13-kono-kudasai-doc-gia', 's113-b2-04-sieu-thi-mua-do', 'lt-b2-ngu-phap-2'], ac: ['jpd113-kono-sono-ano'],
    noi: ['Shop role-play: いらっしゃいませ → この〜をください', 'Nhập vai mua hàng: いらっしゃいませ → この〜をください'],
    kiem: ['これ (alone) vs この + noun: never “このはいくらですか”', 'これ (đứng một mình) vs この + danh từ: không bao giờ “このはいくらですか”'] },
  { s: 14, tuan: 3, lop: ['ST3 restaurant: 何の N · 〜語で · どこの N · 〜つ · だれの N', 'ST3 nhà hàng: 何の N · 〜語で · どこの N · 〜つ · だれの N'],
    hoc: ['s113-slide-b2-slot-14-nha-hang-nan-no-doko-no-dare-no', 's113-b2-05-nha-hang-goi-mon', 's113-b2-06-cua-ai-tieng-gi-tong-hop', 'lt-b2-ngu-phap-3'], ac: ['jpd113-tu-de-hoi', 'jpd113-tu-trong-ngon-ngu-khac'],
    noi: ['Order food: ご注文は？ → カレーを二つください; これはベトナム語で何ですか', 'Gọi món: ご注文は？ → カレーを二つください; これはベトナム語で何ですか'],
    kiem: ['Count ひとつ…とお in order and back', 'Đếm ひとつ…とお xuôi và ngược'] },
  { s: 15, tuan: 3, lop: ['Lesson 2 kanji + review · Lesson 3 ST1 今何時ですか', 'Chữ Hán Bài 2 + ôn Bài 2 · Bài 3 ST1 今何時ですか'],
    hoc: ['s113-slide-b2-slot-15-kanji-so-on-bai-2', 'b2-han-lop', 's113-slide-b3-slot-15-mo-bai-3-may-gio', 's113-b3-01-doc-gio-hoi-gio-mo-cua'], ac: ['jpd113-kanji-so-thoi-gian', 'jpd113-nguphap-chuong5'],
    noi: ['Tell the time: 4時 よじ · 7時 しちじ · 9時 くじ · 〜分 ふん/ぷん', 'Nói giờ: 4時 よじ · 7時 しちじ · 9時 くじ · 〜分 ふん/ぷん'],
    kiem: ['Lesson 2 test ≥ 80/100', 'Đề tổng hợp B2 ≥ 80/100'], cong: ['lt-b2-de-tong-hop'] },
  { s: 16, tuan: 3, lop: ['ST1 〜から〜までです · 何曜日 · Lesson 3 kanji', 'ST1 〜から〜までです · 何曜日 · chữ Hán Bài 3'],
    hoc: ['s113-slide-b3-slot-16-kara-made-thu-kanji-3', 's113-b3-02-thu-thang-ngay-lich-nam', 'b3-han-lop', 'lt-b3-ngu-phap-gio-ngay'], ac: ['jpd113-youbi', 'jpd113-kara-made'],
    noi: ['図書館は何時から何時までですか → 〜から〜までです', '図書館は何時から何時までですか → 〜から〜までです'],
    kiem: ['Read 月火水木金土日 + 曜日 in under 10 s', 'Đọc 月火水木金土日 + 曜日 dưới 10 giây'] },
  { s: 17, tuan: 3, lop: ['ST2 Vます (plans) · 〜を · 〜へ · Vません', 'ST2 Vます (dự định) · 〜を · 〜へ · Vません'],
    hoc: ['s113-slide-b3-slot-17-lich-trinh-masu-wo-he-masen', 's113-b3-03-dong-tu-masu-he-wo', 'lt-b3-ngu-phap-1'], ac: ['jpd113-masu-form', 'jpd113-dong-tu-thuong-gap'],
    noi: ['Weekend plans: 日曜日、どこへ行きますか → 〜へ行きます', 'Kế hoạch cuối tuần: 日曜日、どこへ行きますか → 〜へ行きます'],
    kiem: ['All 14 Lesson 3 verbs in ます / ません forms', 'Đủ 14 động từ Bài 3 ở dạng ます / ません'] },
  { s: 18, tuan: 3, lop: ['ST2 〜で · ST3 Vます (habits) · や〜など · 何も · 〜に', 'ST2 〜で · ST3 Vます (thói quen) · や〜など · 何も · 〜に'],
    hoc: ['s113-slide-b3-slot-18-de-moi-ngay-ni-ya-nanimo', 's113-b3-04-ni-gio-de-noi-ke-mot-ngay', 's113-b3-05-ya-nado-nanimo-dokoemo', 'lt-b3-ngu-phap-2'], ac: ['jpd113-tro-tu-wo-ni-de-e', 'jpd113-to-ya-nado'],
    noi: ['Your day: 毎朝何時に起きますか · どこで勉強しますか', 'Một ngày của bạn: 毎朝何時に起きますか · どこで勉強しますか'],
    kiem: ['へ / に / で / を fill-ins ≥ 9/10 (the most-lost FE point)', 'Điền へ / に / で / を ≥ 9/10 (chỗ mất điểm FE nhiều nhất)'] },
  { s: 19, tuan: 3, lop: ['ST3 〜から〜まで V · どこへも行きません · Lesson 3 review', 'ST3 〜から〜まで V · どこへも行きません · ôn Bài 3'],
    hoc: ['s113-slide-b3-slot-19-kara-made-v-dokoemo-on-bai-3', 's113-b3-07-on-bai-3-thi-noi-lesson-3', 'lt-b3-ngu-phap-tron', 'lt-b3-noi-viet'], ac: ['jpd113-idou-full', 'jpd113-nguphap-chuong6'],
    noi: ['5 speaking sets of Lesson 3 (3 picture questions + 1 personal)', '5 bộ câu hỏi thi nói Bài 3 (3 câu tranh + 1 câu cá nhân)'],
    kiem: ['GATE for small test 2: Lesson 3 test ≥ 75/100 + one real FE paper ≥ 6/10', 'CỔNG trước Small test 2: đề tổng hợp B3 ≥ 75/100 + một đề FE thật ≥ 6/10'], cong: ['lt-b3-de-tong-hop'] },
  { s: 20, tuan: 3, lop: ['⭐ SMALL TEST 2 (Lessons 2–3, 20%) · final-exam review', '⭐ SMALL TEST 2 (Bài 2–3, 20%) · ôn thi cuối kỳ'],
    hoc: ['on113-cau-truc', 'on113-ngu-phap-tu-vung', 'on113-loi-mat-diem'], ac: ['jpd113-speaking-cau-truc', 'jpd113-final-exam-fe'],
    noi: ['Full speaking run: greet → read aloud (30 s prep) → 4 questions → greet out', 'Chạy thử trọn bài nói: chào → đọc to (chuẩn bị 30 giây) → 4 câu hỏi → chào ra'],
    kiem: ['Mock exams 1–3 + real FE papers (see “After the block”)', 'Đề thi thử 1–3 + đề FE thật (xem “Sau slot 20”)'] },
];

function loTrinhBang(k) {
  const en = k === 'en';
  const head = en
    ? '<tr><th>Slot</th><th>In class (syllabus 14469)</th><th>Study at home (60–90 min, ideally the evening BEFORE the slot)</th><th>Speak (10–15 min)</th><th>Self-check — done when…</th></tr>'
    : '<tr><th>Slot</th><th>Trên lớp (syllabus 14469)</th><th>Tự học ở nhà (60–90 phút, tốt nhất tối HÔM TRƯỚC slot)</th><th>Luyện nói (10–15 phút)</th><th>Tự kiểm — đạt khi…</th></tr>';
  const nhom = { 1: en ? 'Week 1 · Mon 30/11 → Sun 06/12 — kana (slots 1–6)' : 'Tuần 1 · T2 30/11 → CN 06/12 — bảng chữ (slot 1–6)', 2: en ? 'Week 2 · Mon 07/12 → Sun 13/12 — Lesson 1 + small test 1 + start Lesson 2 (slots 7–12)' : 'Tuần 2 · T2 07/12 → CN 13/12 — Bài 1 + Small test 1 + mở Bài 2 (slot 7–12)', 3: en ? 'Week 3 · Mon 14/12 → Sun 20/12 — Lesson 2 end + Lesson 3 + small test 2 (slots 13–20)' : 'Tuần 3 · T2 14/12 → CN 20/12 — hết Bài 2 + Bài 3 + Small test 2 (slot 13–20)' };
  let out = '';
  let tuan = 0;
  for (const r of SLOT) {
    if (r.tuan !== tuan) {
      tuan = r.tuan;
      out += `</tbody></table>\n<h4>${nhom[tuan]}</h4>\n<table><thead>${head}</thead><tbody>\n`;
    }
    const ac = r.ac.map(acLink).join('<br>');
    const cong = r.cong ? `<br>➜ ${dks(r.cong, k)}` : '';
    out += `<tr><td><b>${r.s}</b></td><td>${r.lop[en ? 0 : 1]}</td><td>${dks(r.hoc, k)}<br><small>${ac}</small></td><td>${r.noi[en ? 0 : 1]}</td><td>${r.kiem[en ? 0 : 1]}${cong}</td></tr>\n`;
  }
  return out.replace(/^<\/tbody><\/table>\n/, '') + '</tbody></table>';
}

const UU_TIEN = [
  [['Numbers, dates, times, prices, floors', 'Số, ngày tháng, giờ, giá, tầng'], ['FE kanji/number items, every read-aloud passage, most picture questions', 'Câu chữ Hán/số của FE, mọi bài đọc to, phần lớn câu tranh'], ['lt-b1-ngu-phap-2', 'lt-b3-ngu-phap-gio-ngay', 's113-b2-03-so-va-gia-tien']],
  [['Particles へ / に / で / を / の / も', 'Trợ từ へ / に / で / を / の / も'], ['The largest block of FE fill-in items; −2 per wrong particle when speaking', 'Khối câu điền lớn nhất của FE; nói sai trợ từ −2 điểm'], ['lt-b3-ngu-phap-2', 'lt-b1-ngu-phap-tron', 'lt-b3-ngu-phap-tron']],
  [['Reading kanji in 【 】 / choosing kanji', 'Đọc chữ Hán trong 【 】 / chọn chữ Hán'], ['≈ 1 in 5 FE items; 4 underlined kanji words in the read-aloud', '≈ 1/5 số câu FE; 4 từ chữ Hán gạch chân trong bài đọc to'], ['b1-han-lop', 'b2-han-lop', 'b3-han-lop']],
  [['はい／いいえ + full sentence when speaking', 'はい／いいえ + trọn câu khi nói'], ['Forgetting はい／いいえ: up to −5 per question', 'Quên はい／いいえ: trừ tới 5 điểm/câu'], ['on113-noi-mau', 'lt-b3-noi-viet']],
  [['Hearing the examiner’s question', 'Nghe hiểu câu hỏi của giám thị'], ['A misunderstood question loses the whole question', 'Hiểu sai câu hỏi là mất cả câu'], ['lt-b1-nghe', 'lt-b2-nghe', 'lt-b3-nghe']],
  [['Katakana inside the read-aloud passage', 'Katakana trong bài đọc to'], ['4 katakana words in every passage (12 points in the 06/2025 guide)', '4 từ katakana trong mỗi bài đọc (12 điểm theo hướng dẫn 06/2025)'], ['lt-b0-katakana', 'b1-doc-to', 'b3-doc-to']],
];

function uuTienBang(k) {
  const en = k === 'en';
  const head = en ? '<tr><th>Where points are lost</th><th>Why it matters</th><th>Fix it with</th></tr>' : '<tr><th>Chỗ hay mất điểm</th><th>Vì sao quan trọng</th><th>Sửa bằng</th></tr>';
  return `<table><thead>${head}</thead><tbody>\n${UU_TIEN.map((r) => `<tr><td><b>${r[0][en ? 0 : 1]}</b></td><td>${r[1][en ? 0 : 1]}</td><td>${dks(r[2], k)}</td></tr>`).join('\n')}\n</tbody></table>`;
}

const SAU_BLOCK = (k) => {
  const en = k === 'en';
  return `<ol>
<li>${en ? 'Day 1 after slot 20' : 'Ngày 1 sau slot 20'}: ${dk('b3-thi-thu-113-de-1', k)} → ${dk('b3-thi-thu-113-tu-cham', k)}</li>
<li>${en ? 'Day 2' : 'Ngày 2'}: ${a(EXAM, en ? '2 real FE papers in the Exam Room, timer 30 min' : '2 đề FE thật trong Phòng thi, tự bấm 30 phút')} + ${dk('on113-loi-mat-diem', k)}</li>
<li>${en ? 'Day 3' : 'Ngày 3'}: ${dk('b3-thi-thu-113-de-2', k)} + ${a(AC('jpd113-speaking-doc-1-7'), en ? 'Academy read-aloud bank S.2–S.3' : 'Academy ngân hàng bài đọc S.2–S.3')}</li>
<li>${en ? 'Day 4' : 'Ngày 4'}: ${a(EXAM, en ? '2 more real FE papers' : '2 đề FE thật nữa')} + ${a(AC('jpd113-speaking-cau-hoi-co-tranh'), en ? 'picture-question sets S.5' : 'bộ câu tranh S.5')}</li>
<li>${en ? 'Day 5 (eve of the exam)' : 'Ngày 5 (trước ngày thi)'}: ${dk('b3-thi-thu-113-de-3', k)} ${en ? 'once, then only flashcards' : 'một lượt, sau đó chỉ ôn thẻ'} (${dk('b1-luyen-nho', k)} · ${dk('b2-luyen-nho', k)} · ${dk('b3-luyen-nho', k)}) — ${en ? 'sleep early' : 'ngủ sớm'}.</li>
</ol>`;
};

const loTrinh = {
  title: 'Start here — 3-week Block 5 plan for JPD113 (from 30/11/2026), slot by slot|||Bắt đầu tại đây — Lộ trình 3 tuần Block 5 cho JPD113 (từ 30/11/2026), từng slot',
  slug: 'jpd113-block5-lo-trinh',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Lộ trình 3 tuần Block 5 (30/11–20/12/2026) theo đúng 20 slot của syllabus 14469: mỗi slot học trước bài nào (dẫn sang khoá Dekiru + Academy), luyện nói gì, tự kiểm gì, cổng trước hai Small test và kế hoạch 5 ngày ôn thi cuối kỳ.',
  content: `
<div class="ml-en">
<span class="eyebrow">JPD113 · Block 5 · 30/11 → 20/12/2026</span>
<h2>Three weeks, twenty slots, one pass</h2>
<p class="lead">Block 5 squeezes the whole course — 20 slots of 135 minutes — into three weeks. That is roughly one slot every day, so there is no “catching up next week”. This plan tells you, for every slot, what to study the evening before, what to say out loud, and how to know you are ready. It does not re-teach anything: every link opens a lesson that already exists on the Dekiru course or in this Academy course.</p>
<p class="nhan">Source of the slot contents: FLM · Syllabus ID 14469 · Decision 1028/QĐ-ĐHFPT dated 21/08/2026 (60 periods = 20 slots; slot n = periods 3n−2…3n)</p>
<div class="callout danger"><span class="badge">Rules that fail people before any exam</span><ul>
<li><b>Attendance ≥ 80%</b> to be allowed into the final: with 20 slots that means <b>at most 4 absences</b>. Ask your teacher how lateness is counted.</li>
<li><b>Every column must be &gt; 0</b>: small test 1 (20%), small test 2 (20%), participation (15%). Missing one small test = you cannot pass.</li>
<li><b>Final exam ≥ 4/10</b> (MC 30 items + speaking), <b>no skill at 0</b>, and the course total ≥ 5/10.</li>
</ul></div>
<div class="note-ct">The plan below is written by CuongThai. Dates of the slots depend on your class timetable: copy your real slot dates from FAP next to each slot number. If your class has two slots on one day, do both rows the evening before. The week split assumes about one slot a day, Monday to Saturday, with double slots where needed.</div>
<h3>Before 30/11 — if you still have days</h3>
<p>Do the kana now. Lesson 1 starts at slot 7, which is the second Monday; everyone who failed this course before says the same thing — kana that is “almost known” collapses under exam time. Use ${dk('b0-luyen-kana', 'en')} 20 minutes a day and pass ${dk('lt-b0-de-kiem-tra', 'en')} before the block starts.</p>
<h3>Your daily 90 minutes</h3>
<ol><li><b>10 min</b> — flashcards of the current lesson (🃏 Luyện nhớ).</li><li><b>35 min</b> — the “study at home” links of the NEXT slot (learn it before the teacher teaches it).</li><li><b>20 min</b> — one extra-practice set (luyện thêm) of the slot you just had.</li><li><b>15 min</b> — the speaking task, recorded on your phone, replayed once.</li><li><b>10 min</b> — the self-check; write every mistake in a notebook page “mistakes”.</li></ol>
<h3>Slot-by-slot plan</h3>
${loTrinhBang('en')}
<h3>After slot 20 — five days to the final</h3>
<p>The final exam date is set by the school after the block. Use the last days like this:</p>
${SAU_BLOCK('en')}
<div class="callout warn"><span class="badge">Timing</span> Syllabus 14469 gives the MC part <b>30 items in 30 minutes</b> and speaking <b>10 minutes per student</b> (one passage + 3–5 questions). The Exam Room papers allow 45 minutes — practise with a 30-minute timer.</div>
<h3>Where JPD113 points are lost — fix these first</h3>
${uuTienBang('en')}
<h3>📌 Summary</h3>
<ul><li>Learn each slot the evening before; class becomes the second time you see it.</li><li>Kana must be finished by slot 6 — test it with the 80-item kana paper.</li><li>Two gates: Lesson 1 test before small test 1, Lesson 3 test before small test 2.</li><li>Speak every day, recorded — speaking is 30% of the course on its own.</li><li>Numbers, particles and kanji-in-words are where the marks are; train them first.</li></ul>
${the(AC('jpd113-ban-do-tai-nguyen'), '🗺️', 'Resource map: syllabus ↔ Dekiru ↔ Academy ↔ videos', 'Find every lesson that covers a syllabus row.', 'OPEN →')}
${the(DK('bat-dau'), '🗾', 'Open the Dekiru course (Lessons 0–3)', 'Interactive lessons with audio, slides, extra practice and mock exams.', 'DEKIRU →')}
</div>
<div class="ml-vi">
<span class="eyebrow">JPD113 · Block 5 · 30/11 → 20/12/2026</span>
<h2>Ba tuần, hai mươi slot, một lần qua môn</h2>
<p class="lead">Block 5 nén cả môn — 20 slot, mỗi slot 135 phút — vào ba tuần. Tức là gần như ngày nào cũng có một slot, không có chuyện “tuần sau gỡ lại”. Lộ trình này nói cho bạn, với từng slot: tối hôm trước học bài nào, nói to câu gì, và biết thế nào là đã sẵn sàng. Nó không dạy lại gì cả: mọi liên kết đều mở một bài ĐÃ CÓ trên khoá Dekiru hoặc trong chính môn Academy này.</p>
<p class="nhan">Nguồn nội dung từng slot: FLM · Syllabus ID 14469 · QĐ 1028/QĐ-ĐHFPT ngày 21/08/2026 (60 tiết = 20 slot; slot n = tiết 3n−2…3n)</p>
<div class="callout danger"><span class="badge">Luật làm trượt môn trước cả khi thi</span><ul>
<li><b>Đi học ≥ 80%</b> mới được thi cuối kỳ: với 20 slot nghĩa là <b>vắng tối đa 4 slot</b>. Hỏi giảng viên cách tính đi muộn.</li>
<li><b>Mọi cột phải &gt; 0</b>: Small test 1 (20%), Small test 2 (20%), chuyên cần – tham gia (15%). Vắng một bài kiểm tra nhỏ = không thể qua môn.</li>
<li><b>Thi cuối kỳ ≥ 4/10</b> (trắc nghiệm 30 câu + nói), <b>không kỹ năng nào bị 0</b>, và tổng môn ≥ 5/10.</li>
</ul></div>
<div class="note-ct">Lộ trình dưới đây do CuongThai soạn. Ngày cụ thể của từng slot tuỳ thời khoá biểu lớp bạn: chép ngày thật trên FAP vào cạnh số slot. Lớp có ngày học 2 slot thì làm cả hai dòng vào tối hôm trước. Cách chia tuần giả định khoảng một slot mỗi ngày, Thứ 2 – Thứ 7, có ngày học đôi khi cần.</div>
<h3>Trước 30/11 — nếu còn ngày</h3>
<p>Làm xong bảng chữ ngay bây giờ. Bài 1 bắt đầu từ slot 7 (Thứ 2 tuần thứ hai); ai từng trượt môn này cũng nói một điều — bảng chữ “gần thuộc” sẽ sụp khi vào phòng thi. Dùng ${dk('b0-luyen-kana', 'vi')} 20 phút mỗi ngày và qua ${dk('lt-b0-de-kiem-tra', 'vi')} trước khi block bắt đầu.</p>
<h3>90 phút mỗi ngày của bạn</h3>
<ol><li><b>10 phút</b> — thẻ ghi nhớ của bài đang học (🃏 Luyện nhớ).</li><li><b>35 phút</b> — các liên kết “tự học ở nhà” của slot KẾ TIẾP (học trước khi cô dạy).</li><li><b>20 phút</b> — một bộ luyện thêm của slot vừa học.</li><li><b>15 phút</b> — bài luyện nói, ghi âm bằng điện thoại, nghe lại một lần.</li><li><b>10 phút</b> — tự kiểm; ghi mọi lỗi vào một trang sổ “lỗi của tôi”.</li></ol>
<h3>Lộ trình từng slot</h3>
${loTrinhBang('vi')}
<h3>Sau slot 20 — năm ngày tới thi cuối kỳ</h3>
<p>Ngày thi cuối kỳ do trường xếp sau block. Dùng những ngày cuối như sau:</p>
${SAU_BLOCK('vi')}
<div class="callout warn"><span class="badge">Thời gian</span> Syllabus 14469 ghi phần trắc nghiệm <b>30 câu trong 30 phút</b> và phần nói <b>10 phút/sinh viên</b> (1 đoạn văn + 3–5 câu hỏi). Đề trong Phòng thi cho 45 phút — hãy tự bấm 30 phút khi luyện.</div>
<h3>Chỗ JPD113 hay mất điểm — sửa trước tiên</h3>
${uuTienBang('vi')}
<h3>📌 Tóm tắt</h3>
<ul><li>Học mỗi slot vào tối hôm trước; giờ trên lớp thành lần thứ hai bạn gặp bài.</li><li>Bảng chữ phải xong trước hết slot 6 — kiểm bằng đề bảng chữ 80 câu.</li><li>Hai cổng: đề tổng hợp Bài 1 trước Small test 1, đề tổng hợp Bài 3 trước Small test 2.</li><li>Nói mỗi ngày, có ghi âm — riêng phần nói đã là 30% điểm môn.</li><li>Số, trợ từ và chữ Hán trong từ là nơi có điểm; luyện chúng trước.</li></ul>
${the(AC('jpd113-ban-do-tai-nguyen'), '🗺️', 'Bản đồ tài nguyên: đề cương ↔ Dekiru ↔ Academy ↔ video', 'Tìm mọi bài phủ một dòng của đề cương.', 'MỞ →')}
${the(DK('bat-dau'), '🗾', 'Mở khoá Dekiru (Bài 0–3)', 'Bài tương tác có giọng đọc, slide, luyện thêm và đề thi thử.', 'DEKIRU →')}
</div>
`,
};

/* ═══════════════════════ 2. BẢN ĐỒ ĐỐI CHIẾU ═══════════════════════ */
/* [nội dung đề cương EN/VI, tiết, CLO, [bài Dekiru], [bài Academy], video] */
const BAN_DO = [
  [['Course intro, hiragana (46 + voiced + combined), greetings 1–5, classroom phrases, long vowels, っ, numbers', 'Giới thiệu môn, hiragana (46 + âm đục + âm ghép), chào hỏi 1–5, câu trong lớp, trường âm, っ, số đếm'], '1–10', 'CLO1',
    ['b0-hiragana', 'b0-dakuon', 'b0-am-dac-biet', 'b0-chao-hoi', 'b0-luyen-kana', 'lt-b0-hiragana-hang', 'lt-b0-am-duc-ghep', 'lt-b0-am-dac-biet'],
    ['jpd113-hiragana-goc', 'jpd113-hiragana-bien-am', 'jpd113-n-truong-am-tro-tu', 'jpd113-chao-hoi-so', 'jpd113-so-dem-day-du'], ['none (gap)', 'chưa có (lỗ hổng)']],
  [['Katakana (46 + long vowels + っ + combined), kana review, textbook intro', 'Katakana (46 + trường âm + っ + âm ghép), ôn kana, giới thiệu giáo trình'], '11–18', 'CLO1',
    ['b0-katakana', 'lt-b0-katakana', 'lt-b0-cap-nham', 'lt-b0-doc-tu-viet', 'lt-b0-de-kiem-tra'],
    ['jpd113-katakana', 'jpd113-quiz-1'], ['none (gap)', 'chưa có (lỗ hổng)']],
  [['第1課 ST1: 私は〜です · お国はどちらですか · お仕事は〜ですか / じゃありません · N の N', '第1課 ST1: 私は〜です · お国はどちらですか · お仕事は〜ですか / じゃありません · N の N'], '19–22', 'CLO2–3',
    ['s113-b1-01-chao-hoi-ten', 's113-b1-02-nuoc-nguoi', 's113-b1-03-truong-nghe', 'b1-ngu-phap', 'b1-tu-vung', 'lt-b1-ngu-phap-1'],
    ['jpd113-bai-1-ngu-phap', 'jpd113-quoc-tich-nghe-nghiep'], ['3 mp4 (Dekiru + Academy)', '3 mp4 (Dekiru + Academy)']],
  [['第1課 ST2: 〜歳です · いつ · 〜月〜日', '第1課 ST2: 〜歳です · いつ · 〜月〜日'], '23–26', 'CLO2–3',
    ['s113-b1-04-tuoi-ngay-sinh', 'lt-b1-ngu-phap-2'], ['jpd113-ngay-gio-tuoi'], ['1 mp4', '1 mp4']],
  [['第1課 ST3: 何ですか · N と N · N も · Lesson 1 kanji 私人才学生校日本語 · review', '第1課 ST3: 何ですか · N と N · N も · chữ Hán Bài 1 私人才学生校日本語 · ôn'], '27–30', 'CLO2–4',
    ['s113-b1-05-so-thich', 's113-b1-06-tong-hop-noi-han', 'b1-han-lop', 'lt-b1-ngu-phap-3', 'b1-noi', 'b1-doc-to'],
    ['jpd113-mo-ka', 'jpd113-kanji', 'jpd113-kanji-nguoi-truong-hoc', 'jpd113-nguphap-chuong4'], ['2 mp4', '2 mp4']],
  [['Small test 1 (kana + Lesson 1) — MC 30–35 items, 35 min, 20%', 'Small test 1 (bảng chữ + Bài 1) — trắc nghiệm 30–35 câu, 35 phút, 20%'], '31', 'CLO1–2',
    ['lt-b0-de-kiem-tra', 'lt-b1-de-tong-hop'], ['jpd113-quiz-1'], ['—', '—']],
  [['第2課 ST1: 何階ですか · ここ・そこ・あそこ · こちら・そちら・あちら', '第2課 ST1: 何階ですか · ここ・そこ・あそこ · こちら・そちら・あちら'], '32–35', 'CLO2–3',
    ['s113-b2-01-noi-chon-toa-nha', 'lt-b2-ngu-phap-1'], ['jpd113-dem-tang', 'jpd113-bai-2-3-ngu-phap', 'jpd113-kochira-dokono-nanno'], ['1 mp4', '1 mp4']],
  [['第2課 ST2: いくらですか · これ・それ・あれ · この N · N をください · reading prices', '第2課 ST2: いくらですか · これ・それ・あれ · この N · N をください · đọc giá'], '36–39', 'CLO2–4',
    ['s113-b2-02-do-vat-gan-xa', 's113-b2-03-so-va-gia-tien', 's113-b2-04-sieu-thi-mua-do', 'lt-b2-ngu-phap-2'], ['jpd113-kono-sono-ano', 'jpd113-tien-gia-ca', 'jpd113-so-dem-day-du'], ['3 mp4', '3 mp4']],
  [['第2課 ST3: 何の N · 〜語で · どこの N · N を〜つください · だれの N · Lesson 2 kanji (numbers, 円) · review', '第2課 ST3: 何の N · 〜語で · どこの N · N を〜つください · だれの N · chữ Hán Bài 2 (số, 円) · ôn'], '40–44', 'CLO2–4',
    ['s113-b2-05-nha-hang-goi-mon', 's113-b2-06-cua-ai-tieng-gi-tong-hop', 'b2-han-lop', 'lt-b2-ngu-phap-3', 'b2-noi', 'b2-doc-to'],
    ['jpd113-tu-de-hoi', 'jpd113-tu-trong-ngon-ngu-khac', 'jpd113-kanji-so-thoi-gian', 'jpd113-nguphap-chuong5'], ['2 mp4', '2 mp4']],
  [['第3課 ST1: 今何時ですか · 〜から〜までです · 何曜日ですか · Lesson 3 kanji', '第3課 ST1: 今何時ですか · 〜から〜までです · 何曜日ですか · chữ Hán Bài 3'], '45–48', 'CLO2–3',
    ['s113-b3-01-doc-gio-hoi-gio-mo-cua', 's113-b3-02-thu-thang-ngay-lich-nam', 's113-b3-06-chu-han-gio-thu-buoi', 'b3-han-lop', 'lt-b3-ngu-phap-gio-ngay'],
    ['jpd113-youbi', 'jpd113-kara-made', 'jpd113-kanji-so-thoi-gian'], ['3 mp4', '3 mp4']],
  [['第3課 ST2: Vます (plans) · 〜を · 〜へ · Vません · 〜で', '第3課 ST2: Vます (dự định) · 〜を · 〜へ · Vません · 〜で'], '49–52', 'CLO2–3',
    ['s113-b3-03-dong-tu-masu-he-wo', 's113-b3-04-ni-gio-de-noi-ke-mot-ngay', 'lt-b3-ngu-phap-1', 'lt-b3-ngu-phap-2'],
    ['jpd113-masu-form', 'jpd113-dong-tu-thuong-gap', 'jpd113-tro-tu-wo-ni-de-e'], ['2 mp4', '2 mp4']],
  [['第3課 ST3: Vます (habits) · や〜など · 何も〜ません · 〜に · 〜から〜まで V · どこへも · review', '第3課 ST3: Vます (thói quen) · や〜など · 何も〜ません · 〜に · 〜から〜まで V · どこへも · ôn'], '53–57', 'CLO2–4',
    ['s113-b3-05-ya-nado-nanimo-dokoemo', 's113-b3-07-on-bai-3-thi-noi-lesson-3', 'lt-b3-ngu-phap-3', 'b3-noi', 'b3-doc-to', 'lt-b3-noi-viet'],
    ['jpd113-to-ya-nado', 'jpd113-idou-full', 'jpd113-nguphap-chuong6', 'jpd113-quiz-dong-tu'], ['2 mp4', '2 mp4']],
  [['Small test 2 (Lessons 2–3) — MC 30–35 items, 35 min, 20%', 'Small test 2 (Bài 2–3) — trắc nghiệm 30–35 câu, 35 phút, 20%'], '58', 'CLO1–2',
    ['lt-b2-de-tong-hop', 'lt-b3-de-tong-hop'], ['jpd113-quiz-so', 'jpd113-quiz-dong-tu'], ['—', '—']],
  [['Final review · FE: MC 30 items (15%) + speaking 1 passage + 3–5 questions (30%)', 'Ôn cuối kỳ · FE: trắc nghiệm 30 câu (15%) + nói 1 đoạn văn + 3–5 câu hỏi (30%)'], '59–60', 'CLO1–4',
    ['on113-cau-truc', 'on113-ngu-phap-tu-vung', 'on113-doc-to', 'on113-noi-mau', 'on113-de-tong-hop', 'on113-loi-mat-diem', 'b3-thi-thu-113-de-1', 'b3-thi-thu-113-de-2', 'b3-thi-thu-113-de-3', 'b3-thi-thu-113-chien-luoc'],
    ['jpd113-speaking-cau-truc', 'jpd113-speaking-doc-1-7', 'jpd113-speaking-doc-8-13', 'jpd113-speaking-cau-hoi-khong-tranh', 'jpd113-speaking-cau-hoi-co-tranh', 'jpd113-speaking-lo-trinh-meo', 'jpd113-final-exam-fe'], ['1 mp4 (Lesson 3 speaking) + Academy S.1, S.4', '1 mp4 (thi nói Bài 3) + Academy S.1, S.4']],
];

function banDoBang(k) {
  const en = k === 'en';
  const head = en
    ? '<tr><th>Syllabus content</th><th>Periods</th><th>CLO</th><th>Dekiru course (/language/ja/dekiru)</th><th>This Academy course</th><th>Video</th></tr>'
    : '<tr><th>Nội dung đề cương</th><th>Tiết</th><th>CLO</th><th>Khoá Dekiru (/language/ja/dekiru)</th><th>Môn Academy này</th><th>Video</th></tr>';
  return `<table><thead>${head}</thead><tbody>\n${BAN_DO.map((r) => `<tr><td>${r[0][en ? 0 : 1]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${dks(r[3], k)}</td><td>${r[4].map(acLink).join('<br>')}</td><td>${r[5][en ? 0 : 1]}</td></tr>`).join('\n')}\n</tbody></table>`;
}

const banDo = {
  title: 'Resource map — every syllabus row ↔ Dekiru course ↔ this Academy course ↔ videos|||Bản đồ tài nguyên — từng dòng đề cương ↔ khoá Dekiru ↔ môn Academy ↔ video',
  slug: 'jpd113-ban-do-tai-nguyen',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Bảng đối chiếu đề cương JPD113 (60 tiết, syllabus 14469) với bài trên khoá Dekiru, bài trong môn Academy và video: học mỗi dòng ở đâu, luyện thêm ở đâu, đề kiểm tra nào.',
  content: `
<div class="ml-en">
<span class="eyebrow">JPD113 · Resource map</span>
<h2>Where to study each line of the syllabus</h2>
<p class="lead">JPD113 material on this site lives in three places. <b>The Dekiru course</b> (/language/ja/dekiru) is the deepest: the class word lists, grammar points 1–23, the official class kanji, listening with Japanese voices, speaking with pronunciation scoring, slides per class slot, hundreds of extra-practice items per lesson, a test per lesson and three full mock exams. <b>This Academy course</b> keeps the compact explanations, the speaking banks S.1–S.6 and the FLM session pages. <b>The Exam Room</b> holds 14 real FE papers.</p>
<p class="nhan">Source of the syllabus rows: FLM · Syllabus ID 14469 · Decision 1028/QĐ-ĐHFPT dated 21/08/2026</p>
<h3>Syllabus ↔ resources</h3>
${banDoBang('en')}
<h3>Practice papers at a glance</h3>
<ul>
<li><b>Small test 1</b> (kana + Lesson 1): ${dk('lt-b0-de-kiem-tra', 'en')} · ${dk('lt-b1-de-tong-hop', 'en')} · ${a(AC('jpd113-quiz-1'), 'Academy Quiz 1')}</li>
<li><b>Small test 2</b> (Lessons 2–3): ${dk('lt-b2-de-tong-hop', 'en')} · ${dk('lt-b3-de-tong-hop', 'en')} · ${a(EXAM, 'real FE papers (they cover Lessons 1–3)')}</li>
<li><b>Final exam</b>: ${dk('b3-thi-thu-113-de-1', 'en')} · ${dk('b3-thi-thu-113-de-2', 'en')} · ${dk('b3-thi-thu-113-de-3', 'en')} · ${a(EXAM, '14 real FE papers in the Exam Room')} · ${a(ONTHI, 'JPD113 exam-prep tools (read-aloud, personal Q&amp;A, kanji cards)')}</li>
</ul>
<div class="callout warn"><span class="badge">Two versions of the speaking marking</span> The Academy speaking pages (S.1) and the exam-prep tools use <b>READING 30 · TALKING 60 · PRESENTING 10</b>. The speaking review guide dated <b>09/06/2025</b> used on the Dekiru course (${dk('on113-cau-truc', 'en')}) uses <b>READING 40 · TALKING 55 · PRESENTING 5</b>, with detailed deductions. The practice is identical; ask your teacher which version your term uses.</div>
<h3>Gaps found while building this map</h3>
<ul><li><b>No video yet for the kana part</b> (periods 1–18, Dekiru Lesson 0 and Academy chapters 1–2). Use the FLM session slides of periods 1–18 in this course and the kana trainer until videos exist.</li><li>No separate multiple-choice paper in the exact small-test shape — the lesson tests and FE papers above cover the same scope.</li></ul>
${the(AC('jpd113-block5-lo-trinh'), '🗓️', '3-week Block 5 plan', 'What to study before each slot.', 'OPEN →')}
</div>
<div class="ml-vi">
<span class="eyebrow">JPD113 · Bản đồ tài nguyên</span>
<h2>Mỗi dòng đề cương học ở đâu</h2>
<p class="lead">Tài liệu JPD113 trên web nằm ở ba nơi. <b>Khoá Dekiru</b> (/language/ja/dekiru) là sâu nhất: danh sách từ mới của lớp, ngữ pháp ポイント 1–23, chữ Hán chính thức của lớp, nghe giọng Nhật, nói có chấm phát âm, slide theo từng slot, hàng trăm câu luyện thêm mỗi bài, đề tổng hợp mỗi bài và ba đề thi thử trọn vẹn. <b>Môn Academy này</b> giữ phần giải thích gọn, ngân hàng thi nói S.1–S.6 và các trang buổi học FLM. <b>Phòng thi</b> có 14 đề FE thật.</p>
<p class="nhan">Nguồn các dòng đề cương: FLM · Syllabus ID 14469 · QĐ 1028/QĐ-ĐHFPT ngày 21/08/2026</p>
<h3>Đề cương ↔ tài nguyên</h3>
${banDoBang('vi')}
<h3>Đề luyện — nhìn một lượt</h3>
<ul>
<li><b>Small test 1</b> (bảng chữ + Bài 1): ${dk('lt-b0-de-kiem-tra', 'vi')} · ${dk('lt-b1-de-tong-hop', 'vi')} · ${a(AC('jpd113-quiz-1'), 'Academy Quiz 1')}</li>
<li><b>Small test 2</b> (Bài 2–3): ${dk('lt-b2-de-tong-hop', 'vi')} · ${dk('lt-b3-de-tong-hop', 'vi')} · ${a(EXAM, 'đề FE thật (phủ Bài 1–3)')}</li>
<li><b>Thi cuối kỳ</b>: ${dk('b3-thi-thu-113-de-1', 'vi')} · ${dk('b3-thi-thu-113-de-2', 'vi')} · ${dk('b3-thi-thu-113-de-3', 'vi')} · ${a(EXAM, '14 đề FE thật trong Phòng thi')} · ${a(ONTHI, 'bộ công cụ ôn thi JPD113 (đọc to, hỏi đáp về bạn, thẻ chữ Hán)')}</li>
</ul>
<div class="callout warn"><span class="badge">Hai bản thang chấm thi nói</span> Trang thi nói của Academy (S.1) và bộ công cụ ôn thi dùng <b>READING 30 · TALKING 60 · PRESENTING 10</b>. Bản hướng dẫn ôn thi nói ngày <b>09/06/2025</b> mà khoá Dekiru dùng (${dk('on113-cau-truc', 'vi')}) ghi <b>READING 40 · TALKING 55 · PRESENTING 5</b>, kèm mức trừ chi tiết. Cách luyện giống hệt nhau; hỏi giảng viên kỳ của bạn dùng bản nào.</div>
<h3>Lỗ hổng phát hiện khi lập bản đồ</h3>
<ul><li><b>Phần bảng chữ chưa có video</b> (tiết 1–18, Bài 0 của Dekiru và chương 1–2 của Academy). Trong lúc chờ, dùng slide buổi FLM tiết 1–18 trong môn này và bảng luyện kana.</li><li>Chưa có đề trắc nghiệm riêng đúng khuôn Small test — các đề tổng hợp từng bài và đề FE ở trên phủ cùng phạm vi.</li></ul>
${the(AC('jpd113-block5-lo-trinh'), '🗓️', 'Lộ trình 3 tuần Block 5', 'Học gì trước mỗi slot.', 'MỞ →')}
</div>
`,
};

export const sectionBlock5 = {
  title: 'Start here — Block 5 plan & resource map (links to the Dekiru course)|||Bắt đầu tại đây — Lộ trình Block 5 & bản đồ tài nguyên (dẫn sang khoá Dekiru)',
  description: 'Lộ trình 3 tuần Block 5 (30/11–20/12/2026) theo 20 slot của syllabus 14469 và bảng đối chiếu đề cương ↔ khoá Dekiru ↔ Academy ↔ video. Không dạy lại — chỉ dẫn đúng bài đã có.',
  lessons: [loTrinh, banDo],
};

/* ═══════════════════════ 3. THẺ "HỌC SÂU TRÊN DEKIRU" CHO BÀI CŨ ═══════════════════════ */
const GAN = {
  'jpd113-gioi-thieu': ['bat-dau'],
  'jpd113-hiragana-goc': ['b0-hiragana', 'b0-luyen-kana', 'lt-b0-hiragana-hang'],
  'jpd113-hiragana-bien-am': ['b0-dakuon', 'lt-b0-am-duc-ghep'],
  'jpd113-n-truong-am-tro-tu': ['b0-am-dac-biet', 'lt-b0-am-dac-biet'],
  'jpd113-katakana': ['b0-katakana', 'lt-b0-katakana', 'lt-b0-cap-nham'],
  'jpd113-quiz-1': ['lt-b0-de-kiem-tra'],
  'jpd113-chao-hoi-so': ['b0-chao-hoi'],
  'jpd113-so-dem-day-du': ['s113-b2-03-so-va-gia-tien', 'lt-b2-ngu-phap-2'],
  'jpd113-tien-gia-ca': ['s113-b2-03-so-va-gia-tien', 's113-b2-04-sieu-thi-mua-do'],
  'jpd113-ngay-gio-tuoi': ['s113-b1-04-tuoi-ngay-sinh', 'lt-b3-ngu-phap-gio-ngay'],
  'jpd113-youbi': ['s113-b3-02-thu-thang-ngay-lich-nam'],
  'jpd113-dem-tang': ['s113-b2-01-noi-chon-toa-nha'],
  'jpd113-quiz-so': ['lt-b3-ngu-phap-gio-ngay', 'lt-b1-ngu-phap-2'],
  'jpd113-nguphap-chuong3': ['lt-b1-ngu-phap-2', 'lt-b3-ngu-phap-gio-ngay'],
  'jpd113-bai-1-ngu-phap': ['s113-b1-01-chao-hoi-ten', 'b1-ngu-phap', 'lt-b1-ngu-phap-1'],
  'jpd113-mo-ka': ['s113-b1-05-so-thich', 'lt-b1-ngu-phap-3'],
  'jpd113-quoc-tich-nghe-nghiep': ['s113-b1-02-nuoc-nguoi', 's113-b1-03-truong-nghe'],
  'jpd113-tu-trong-ngon-ngu-khac': ['s113-b2-06-cua-ai-tieng-gi-tong-hop'],
  'jpd113-nguphap-chuong4': ['slide-tong-hop-b1', 'lt-b1-ngu-phap-tron', 'lt-b1-de-tong-hop'],
  'jpd113-bai-2-3-ngu-phap': ['s113-b2-02-do-vat-gan-xa', 'lt-b2-ngu-phap-1'],
  'jpd113-kono-sono-ano': ['s113-b2-02-do-vat-gan-xa'],
  'jpd113-tu-de-hoi': ['s113-b2-05-nha-hang-goi-mon', 'lt-b2-ngu-phap-3'],
  'jpd113-tro-tu-wo-ni-de-e': ['s113-b3-03-dong-tu-masu-he-wo', 's113-b3-04-ni-gio-de-noi-ke-mot-ngay', 'lt-b3-ngu-phap-2'],
  'jpd113-kochira-dokono-nanno': ['s113-b2-01-noi-chon-toa-nha', 's113-b2-05-nha-hang-goi-mon'],
  'jpd113-to-ya-nado': ['s113-b3-05-ya-nado-nanimo-dokoemo'],
  'jpd113-nguphap-chuong5': ['slide-tong-hop-b2', 'lt-b2-ngu-phap-tron', 'lt-b2-de-tong-hop'],
  'jpd113-masu-form': ['s113-b3-03-dong-tu-masu-he-wo', 'lt-b3-ngu-phap-1'],
  'jpd113-dong-tu-thuong-gap': ['b3-tu-vung', 'lt-b3-ngu-phap-1'],
  'jpd113-idou-full': ['s113-b3-05-ya-nado-nanimo-dokoemo', 'lt-b3-ngu-phap-3'],
  'jpd113-kara-made': ['s113-b3-01-doc-gio-hoi-gio-mo-cua', 'lt-b3-ngu-phap-3'],
  'jpd113-quiz-dong-tu': ['lt-b3-ngu-phap-tron'],
  'jpd113-nguphap-chuong6': ['slide-tong-hop-b3', 'lt-b3-ngu-phap-tron', 'lt-b3-de-tong-hop'],
  'jpd113-kanji': ['b1-han-lop', 'lt-b1-chu-han'],
  'jpd113-kanji-so-thoi-gian': ['b2-han-lop', 'b3-han-lop', 's113-b3-06-chu-han-gio-thu-buoi'],
  'jpd113-kanji-nguoi-truong-hoc': ['b1-han-lop'],
  'jpd113-speaking-cau-truc': ['on113-cau-truc', 'b3-thi-thu-113-chien-luoc'],
  'jpd113-speaking-doc-1-7': ['b1-doc-to', 'b2-doc-to', 'on113-doc-to'],
  'jpd113-speaking-doc-8-13': ['b3-doc-to', 'on113-doc-to'],
  'jpd113-speaking-cau-hoi-khong-tranh': ['on113-noi-mau', 'lt-b1-noi-viet'],
  'jpd113-speaking-cau-hoi-co-tranh': ['lt-b3-noi-viet', 'b2-noi'],
  'jpd113-speaking-lo-trinh-meo': ['b3-thi-thu-113-de-1', 'on113-loi-mat-diem'],
  'jpd113-final-exam-pe': ['on113-cau-truc'],
  'jpd113-final-exam-fe': ['on113-ngu-phap-tu-vung', 'b3-thi-thu-113-de-1'],
};

function khoiThe(ids) {
  for (const id of ids) if (!NHAN[id]) throw new Error(`JPD113 boSung: thiếu nhãn '${id}'`);
  const en = `<h3>🗾 Go deeper on the Dekiru course</h3>\n${ids.map((id) => theDk(id, 'en')).join('\n')}`;
  const vi = `<h3>🗾 Học sâu bài này trên khoá Dekiru</h3>\n${ids.map((id) => theDk(id, 'vi')).join('\n')}`;
  return `\n<div class="ml-en">\n${en}\n</div>\n<div class="ml-vi">\n${vi}\n</div>\n`;
}

/* ═══════════════════════ 4. ĐÍNH CHÍNH (đặt ĐẦU bài, không sửa chữ cũ) ═══════════════════════ */
const DINH_CHINH_SYL = `
<div class="ml-en"><div class="callout warn"><span class="badge">Update 22/11/2026 — new syllabus</span> The current FLM syllabus is <b>ID 14469</b> (Decision 1028/QĐ-ĐHFPT, 21/08/2026). Unlike the older 14232 quoted below, it <b>does publish formats and durations</b>: small test 1 and 2 — multiple choice, <b>30–35 items, 35 minutes</b> each (1 = kana + Lesson 1, 2 = Lessons 2–3); final exam 40 minutes in total — <b>MC 30 items in 30 minutes</b> (vocabulary, grammar, kanji of Lessons 1–3; 15%) and <b>speaking 10 minutes per student</b>: read one passage + answer 3–5 questions (30%). Pass conditions: on-going marks &gt; 0, final ≥ 4/10, total ≥ 5/10, and <b>no skill of the final at 0</b>. Where the text below says the syllabus gives no item counts or durations, it refers to the old version.</div></div>
<div class="ml-vi"><div class="callout warn"><span class="badge">Cập nhật 22/11/2026 — syllabus mới</span> Syllabus FLM hiện hành là <b>ID 14469</b> (QĐ 1028/QĐ-ĐHFPT, 21/08/2026). Khác bản 14232 cũ được trích bên dưới, bản này <b>CÓ công bố dạng đề và thời lượng</b>: Small test 1 và 2 — trắc nghiệm, <b>30–35 câu, 35 phút</b> mỗi bài (bài 1 = bảng chữ + Bài 1, bài 2 = Bài 2–3); thi cuối kỳ tổng 40 phút — <b>trắc nghiệm 30 câu trong 30 phút</b> (từ vựng, ngữ pháp, chữ Hán Bài 1–3; 15%) và <b>nói 10 phút/sinh viên</b>: đọc 1 đoạn văn + trả lời 3–5 câu hỏi (30%). Điều kiện qua: điểm quá trình &gt; 0, thi cuối kỳ ≥ 4/10, tổng ≥ 5/10, và <b>không kỹ năng nào của bài thi cuối bị 0</b>. Chỗ nào bên dưới nói syllabus không nêu số câu hay thời lượng là nói về bản cũ.</div></div>
`;
const DINH_CHINH_NOI = `
<div class="ml-en"><div class="callout warn"><span class="badge">Update 22/11/2026 — two marking versions</span> The scale below (30 / 60 / 10) is the older one. The speaking review guide dated <b>09/06/2025</b> gives <b>READING 40</b> (4 underlined kanji words 12 · 4 katakana words 12 · 70–80 hiragana 16, −0.2 per wrong character) · <b>TALKING 55</b> (3 picture questions × 15 + 1 personal question × 10) · <b>PRESENTING 5</b>. It is explained in full on the Dekiru course: <a href="${DK('on113-cau-truc')}" target="_blank" rel="noopener">JPD113 speaking: format &amp; marking</a>. Syllabus 14469 itself says: 10 minutes per student, one passage + 3–5 questions. Ask your teacher which scale your term uses — the way to practise is the same.</div></div>
<div class="ml-vi"><div class="callout warn"><span class="badge">Cập nhật 22/11/2026 — hai bản thang chấm</span> Thang điểm bên dưới (30 / 60 / 10) là bản cũ. Bản hướng dẫn ôn thi nói ngày <b>09/06/2025</b> ghi <b>READING 40</b> (4 từ chữ Hán gạch chân 12 · 4 từ katakana 12 · 70–80 chữ hiragana 16, sai 1 ký tự −0,2) · <b>TALKING 55</b> (3 câu có tranh × 15 + 1 câu cá nhân × 10) · <b>PRESENTING 5</b>. Giải thích đầy đủ trên khoá Dekiru: <a href="${DK('on113-cau-truc')}" target="_blank" rel="noopener">Thi nói JPD113: cấu trúc &amp; cách chấm</a>. Chính syllabus 14469 ghi: 10 phút/sinh viên, 1 đoạn văn + 3–5 câu hỏi. Hỏi giảng viên kỳ của bạn dùng thang nào — cách luyện thì như nhau.</div></div>
`;
const DAU_BAI = {
  'jpd113-dieu-kien-qua-mon': DINH_CHINH_SYL,
  'jpd113-final-exam-fe': DINH_CHINH_SYL,
  'jpd113-final-exam-pe': DINH_CHINH_SYL,
  'jpd113-speaking-cau-truc': DINH_CHINH_NOI,
};

/** Ghép phần bổ sung vào spec JPD113 (gọi ở cuối JPD113.mjs). Chỉ CHÈN: không xoá bài, không đổi slug. */
export function ganBoSung(spec) {
  const secs = spec.sections;
  const daGan = new Set();
  for (const s of secs) {
    for (const l of s.lessons || []) {
      if (DAU_BAI[l.slug] && l.content) l.content = DAU_BAI[l.slug] + l.content;
      if (GAN[l.slug]) {
        l.content = (l.content || '') + khoiThe(GAN[l.slug]);
        daGan.add(l.slug);
      }
    }
    if (/^Final Exam\|\|\|/.test(s.title || '')) {
      s.description = 'Thi cuối kỳ JPD113 có HAI PHẦN: trắc nghiệm 30 câu/30 phút (từ vựng, ngữ pháp, chữ Hán Bài 1–3) 15% + NÓI 10 phút/sinh viên (1 đoạn văn + 3–5 câu hỏi) 30% — tổng 45%, phải đạt ≥4/10 và không phần nào 0 điểm (syllabus 14469). KHÔNG có kỳ thi thực hành riêng.';
    }
  }
  const thieu = Object.keys(GAN).filter((k) => !daGan.has(k));
  if (thieu.length) throw new Error(`JPD113 boSung: không tìm thấy bài để gắn thẻ: ${thieu.join(', ')}`);
  const i0 = secs.findIndex((s) => /^Section 0 —/.test(s.title || ''));
  secs.splice(i0 + 1, 0, sectionBlock5);
  return spec;
}
