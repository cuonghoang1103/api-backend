/**
 * Bài 40 — N3 総復習 (Ôn tập & THI THỬ JLPT N3) · TIẾP SAU SÁCH, cấp N3 (xem ../SOAN-BAI.md mục 8 phần D).
 * Bài CUỐI chặng 36–40 và cuối cả cấp N3 (Bài 26–39) ⇒ KHÔNG có mục A–C (hội thoại, từ vựng, buổi học, luyện thêm) mà thay bằng
 * ĐỀ THI THỬ đúng cấu trúc đề JLPT N3 hiện hành + ôn tổng hợp cả cấp. Khuôn: Bài 25 (thi thử N4).
 *   1. b40-thi-thu-gioi-thieu      — cấu trúc đề N3 (3 phần · 30′ / 70′ / 40′), thang 180 = 3 mục × 60, điểm đạt 95, điểm liệt 19 mỗi mục.
 *   2. b40-thi-thu-1-moji-goi      — Đề 1 · 言語知識（文字・語彙）: 漢字読み 8 · 表記 6 · 文脈規定 11 · 言い換え類義 5 · 用法 5 = 35 câu.
 *   3. b40-thi-thu-2-bunpo-dokkai  — Đề 1 · 言語知識（文法）・読解: 文法形式 13 · 文の組み立て 5 · 文章の文法 5 · 短文 4 · 中文 6 · 長文 4 ·
 *                                    情報検索 2 = 39 câu.
 *   4. b40-thi-thu-3-choukai       — Đề 1 · 聴解: 課題理解 6 · ポイント理解 6 · 概要理解 3 · 発話表現 4 (mỗi câu một cảnh `canh`) ·
 *                                    即時応答 9 = 28 câu. (Đề 1 tổng 102 câu.)
 *   5. b40-thi-thu-bang-diem       — quy đổi câu đúng → 3 điểm mục /60, điểm liệt 19, A/B/C 参考情報, bảng "sai câu nào ôn Bài nào" (Bài 26–39).
 *   6. b40-on-tap-ngu-phap         — tổng ôn MỌI mẫu N3 Bài 26–39 + 10 bảng nhóm hay bị gài nhầm + 45 câu + 8 câu ghép.
 *   7. b40-on-tap-tu-vung-han-tu   — chữ Hán Bài 26–39 theo bài, bẫy đọc (trường âm / âm ngắt / âm đục), đồng âm khác chữ, 類義語, tự – tha
 *                                    động từ, コロケーション + 40 câu + 20 câu đọc chữ không furigana.
 *   8. b40-de-2                    — Đề thi thử số 2 rút gọn (47 câu đủ 3 phần) để thi lại sau khi ôn.
 * Số câu mỗi 問題 theo bảng "問題構成" công bố của JLPT (số câu là MỨC THƯỜNG GẶP — đề thật mỗi kỳ có thể chênh 1–2 câu).
 * Người học đã xong Bài 1–15 (ポイント 1–124), Bài 16–24 (N4), Bài 25 (ôn N4) và Bài 26–39 (N3: ～うちに・間に・最中に・たとたん ·
 * ～せいで・おかげで・ため・によって · ～くせに・ものの・にもかかわらず・に対して · ～ほど・くらい・ば～ほど・さえ～ば・うえに · ～って・
 * とのことだ・ということだ・とか・にとって・として · ～に違いない・はずがない・わけがない・っぽい・わけだ・わけではない・わけにはいかない ·
 * ～ものだ・ことだ・につれて・にしたがって・一方だ · ～によると・に基づいて・をもとに・に沿って・とともに・を中心に · ～がちだ・気味・
 * っぱなし・ようとする・としたら · ～させられる・させていただく・ばよかった · ～というのは・とは・という意味だ・ということは・とか～とか・
 * やら～やら・にしても · kính ngữ đầy đủ (Bài 37) · 接続詞 cho đọc hiểu (Bài 38) · văn nói rút gọn (Bài 39)). Đề CHỈ dùng ngữ pháp /
 * từ / chữ Hán đã học tới Bài 39; chữ Hán được hỏi ở 漢字読み・表記 lấy từ chữ mới của Bài 26–39 (hanTu26.ts…hanTu39.ts) ghép với chữ
 * của lớp / Bài 16–24. Bài 40 KHÔNG dạy chữ Hán mới ⇒ không có hanTu40.ts.
 * Đề, bài đọc, kịch bản nghe: VIẾT MỚI 100%, không chép đề JLPT thật hay sách luyện thi nào (新完全マスター, 総まとめ, 公式問題集…).
 * Chỉ giữ DẠNG đề (số 問題, số câu, thời gian, kiểu lời dẫn) — kiến thức chung.
 *
 * Nhân vật (giới tính quyết định giọng đọc, theo sách p.14): nữ = パク, ワン, アンナ, メアリー, マリヤム, 山口, 木村, リン, 鈴木,
 * {佐藤先生|さとうせんせい} · nam = マルコ, ダニエル, ナタポン, カルロス, 西川, 本田先生, {小林店長|こばやしてんちょう}, {森課長|もりかちょう}, {田村|たむら}.
 * Nối tiếp: リン (nữ, năm nhất みなと大学, từng làm thêm ở ひまわり食堂) · カルロス, パク (cùng ゼミ của cô 佐藤) · ダニエル, マリヤム (国際寮)
 * · ワン (thực tập ở さくらシステム), 鈴木 (nữ, nhân viên さくらシステム), 森課長 · 田村 (công ty khách hàng 東京商事).
 * Người phụ (chỉ nói trong bài nghe): ナレーター (người dẫn đề) — ja-nu · {事務|じむ}の{人|ひと} (nghe 75) — nam, ja-nam ·
 * {管理人|かんりにん}さん (nghe 77, đề 2 nghe 38) — nam, ja-nam · {店内|てんない}アナウンス (nghe 83) — nữ, ja-nu · ラジオのパーソナリティー
 * (nghe 87) — nam, ja-nam · {店員|てんいん} (nghe 99) — nam, ja-nam · {駅|えき}のアナウンス (đề 2 nghe 40) — nữ, ja-nu.
 * Nghe: 'ja-nu' = nữ, 'ja-nam' = nam (bộ kiểm chỉ nhận hai giọng này). Lời dẫn kiểu đề JLPT là dòng ナレーター đầu và cuối mỗi bài
 * (không dùng `listen.dan` — khuôn đó đọc tiếng Anh). Hình: tên trong scripts/hinh/fluent-catalog.json (Fluent Emoji).
 */
import type { Block, Lesson } from '@/components/sach-hoc/types';

type Item = { q: string; options: string[]; correct: number; why: string };
const Q = (q: string, options: string[], correct: number, why: string): Item => ({ q, options, correct, why });
/** Đáp án đúng `dung` đặt vào vị trí `pos` giữa các đáp án nhiễu `sai` — để rải đều 1/2/3/4 mà không đếm tay. */
const QP = (q: string, dung: string, sai: string[], pos: number, why: string): Item =>
  Q(q, [...sai.slice(0, pos), dung, ...sai.slice(pos)], pos, why);

type LL = [who: string, voice: 'ja-nu' | 'ja-nam', text: string, ro: string, vi: string];
const NG = (id: string, title: string, note: string, lines: LL[]): Block => ({
  t: 'listen',
  id,
  title,
  note,
  lines: lines.map(([who, voice, text, ro, vi]) => ({ who, voice, text, ro, vi })),
});
const NA = 'ナレーター';
const MCQ = (id: string, title: string, items: Item[]): Block => ({ t: 'mcq', id, title, items });

/* ═══════════════════════════ 1. GIỚI THIỆU ĐỀ N3 ═══════════════════════════ */

const CAU_TRUC_DE: Block = {
  t: 'table',
  caption: 'Đề JLPT N3 — 3 phần thi, 140 phút, khoảng 102 câu (Đề 1 của bài này theo ĐÚNG bảng này; số câu là mức thường gặp, đề thật có thể chênh 1–2 câu)',
  head: ['Phần thi (科目)', 'Thời gian', '問題 (mondai)', 'Làm gì', 'Số câu'],
  rows: [
    ['① 言語知識（文字・語彙）', '**30 phút**', '問題1 漢字読み', 'Đọc chữ Hán: chọn cách đọc (hiragana) của từ gạch chân', '8'],
    ['', '', '問題2 表記', 'Ngược lại: từ viết bằng hiragana → chọn cách viết chữ Hán đúng', '6'],
    ['', '', '問題3 文脈規定', 'Chọn từ hợp ngữ cảnh để điền vào （　）', '11'],
    ['', '', '問題4 言い換え類義', 'Chọn từ / cụm từ GẦN NGHĨA NHẤT với phần gạch chân', '5'],
    ['', '', '問題5 用法', 'Cho một từ — chọn câu dùng từ đó ĐÚNG', '5'],
    ['② 言語知識（文法）・読解', '**70 phút**', '問題1 文法形式の判断', 'Chọn mẫu ngữ pháp / dạng chia đúng cho （　）', '13'],
    ['', '', '問題2 文の組み立て', 'Sắp 4 mảnh thành câu, chọn mảnh nằm ở ô ★', '5'],
    ['', '', '問題3 文章の文法', 'Một bài văn có 5 chỗ trống — chọn mẫu / từ nối hợp mạch văn', '5'],
    ['', '', '問題4 内容理解（短文）', '4 đoạn ngắn ~150–200 chữ (email, thông báo, ghi chú, ý kiến) — mỗi đoạn 1 câu', '4'],
    ['', '', '問題5 内容理解（中文）', '2 bài ~350–500 chữ (tuỳ bút, kể trải nghiệm) — mỗi bài 3 câu', '6'],
    ['', '', '問題6 内容理解（長文）', '1 bài dài ~550–800 chữ (bình luận, ý kiến) — 4 câu', '4'],
    ['', '', '問題7 情報検索', 'Tờ quảng cáo / bảng thông tin ~600 chữ — tìm đúng mục theo điều kiện', '2'],
    ['③ 聴解', '**40 phút**', '問題1 課題理解', 'Nghe hội thoại → người đó sẽ làm gì (trước tiên)', '6'],
    ['', '', '問題2 ポイント理解', 'Nghe câu hỏi TRƯỚC (có thời gian đọc lựa chọn), rồi nghe → lý do / điểm chính', '6'],
    ['', '', '問題3 概要理解', 'Nghe một đoạn (độc thoại / hội thoại) → chủ đề, ý chính, thái độ người nói. Câu hỏi + lựa chọn CHỈ NGHE', '3'],
    ['', '', '問題4 発話表現', 'Nhìn tranh (ở web: đọc cảnh) → người có mũi tên nói gì', '4'],
    ['', '', '問題5 即時応答', 'Nghe một câu ngắn → chọn câu đáp hợp (không in gì trên đề)', '9'],
    ['**Tổng**', '**140 phút**', '', '', '**102 câu** (35 + 23 + 16 + 28)'],
  ],
};

const THANG_DIEM: Block = {
  t: 'table',
  caption: 'Thang điểm N3 — 3 mục chấm, mỗi mục 60, tổng 180',
  head: ['Mục chấm điểm (得点区分)', 'Gồm câu nào', 'Thang điểm', 'Điểm liệt (基準点)'],
  rows: [
    ['言語知識（文字・語彙・文法）', 'Phần ① (35 câu) + phần 文法 của phần ② (23 câu) = **58 câu**', '0 – 60', '**19**'],
    ['読解', 'Phần 読解 của phần ② = **16 câu**', '0 – 60', '**19**'],
    ['聴解', 'Phần ③ = **28 câu**', '0 – 60', '**19**'],
    ['**総合得点 (tổng)**', '', '**0 – 180**', 'Đạt (合格): **≥ 95** VÀ không mục nào dưới 19'],
  ],
};

const SO_N4_N3: Block = {
  t: 'table',
  caption: 'N3 khác N4 (Bài 25) ở đâu',
  head: ['', 'N4 (Bài 25)', 'N3 (bài này)', 'Hệ quả khi ôn'],
  rows: [
    ['Thời gian', '25′ / 55′ / 35′ = 115′', '**30′ / 70′ / 40′ = 140′**', 'Phần ② dài hơn hẳn — luyện sức bền đọc 70 phút liền.'],
    ['Mục chấm điểm', '2 mục: 言語知識・読解 /120 + 聴解 /60', '**3 mục**: 言語知識 /60 + **読解 /60** + 聴解 /60', '読解 thành một mục RIÊNG có điểm liệt — chỉ 16 câu mà nặng 60 điểm (≈ 3,75 điểm/câu). Một câu đọc sai "đắt" gấp ba câu từ vựng.'],
    ['Điểm đạt / liệt', '90 · liệt 38 / 19', '**95 · liệt 19 / 19 / 19**', 'Không được bỏ mảng nào: giỏi ngữ pháp mà đọc chậm vẫn trượt.'],
    ['Dạng đề mới', '—', '言い換え hỏi **từ / cụm từ** (không cả câu) · **長文** · **概要理解** · 即時応答 9 câu', 'Bài 38 (đọc) và Bài 39 (nghe) đã luyện riêng từng dạng.'],
    ['Furigana', 'Có cho chữ khó', 'Ít hơn hẳn — gần như chỉ chữ ngoài phạm vi N3', 'Tắt furigana khi làm đề (nút trên trang) — trừ các chữ người học chưa gặp.'],
  ],
};

const GIOI_THIEU: Lesson = {
  id: 'b40-thi-thu-gioi-thieu',
  kind: 'review',
  title: 'Thi thử N3 · Đọc trước: cấu trúc đề JLPT N3, thang 180 = 3 × 60, điểm đạt 95, điểm liệt 19, mẹo phân giờ, cách đọc bảng điểm',
  goal: 'Nắm chắc đề JLPT N3 có 3 phần (文字・語彙 30 phút · 文法・読解 70 phút · 聴解 40 phút), mỗi phần có những 問題 nào và khoảng bao nhiêu câu; biết cách tính điểm theo 3 mục 言語知識 / 読解 / 聴解 (mỗi mục 60), điểm đạt 95 và điểm liệt 19 của từng mục; biết phân giờ và đọc được bảng điểm JLPT gửi về — để làm hai đề thi thử của bài này như thi thật.',
  minutes: 25,
  blocks: [
    {
      t: 'recap',
      title: 'Bài 40 dùng thế nào',
      items: [
        'Đây là bài **tổng kết cả cấp N3** (Bài 26–39). Không có từ mới, ngữ pháp mới, chữ Hán mới — chỉ có **ĐỀ THI THỬ** và **ôn tổng hợp**.',
        'Thứ tự làm: ① đọc mục này → ② làm **Đề 1** đủ 3 phần, **bấm giờ thật** (30′ → 70′ → 40′), không tra cứu → ③ chấm ở mục **Bảng điểm**, tra bảng "sai câu nào ôn Bài nào" → ④ học lại bằng mục **Ôn ngữ pháp** và **Ôn từ vựng – chữ Hán** → ⑤ làm **Đề 2** (rút gọn) để kiểm tra lại.',
        'Đề viết theo ĐÚNG cấu trúc đề N3 (số 問題, số câu, thời gian, kiểu lời dẫn tiếng Nhật) — từ vựng, ngữ pháp, chữ Hán chỉ lấy trong những gì khoá đã dạy tới Bài 39.',
        'Mục tiêu: Đề 1 **≥ 70 / 102 câu** và mỗi mục ≥ 60% là đủ tự tin đi thi N3 thật; đạt vạch 95 điểm nhưng có mục sát 19: ôn theo bảng rồi làm Đề 2; dưới vạch: học lại các Bài sai nhiều (bảng điểm chỉ rõ) trước khi thi lại.',
      ],
    },
    { t: 'h', text: '1. Cấu trúc đề N3 — 3 phần, 140 phút' },
    {
      t: 'p',
      text: 'Ngày thi, bạn ngồi **ba phần liền nhau** (có nghỉ giữa phần): phần ① 30 phút chỉ có chữ Hán và từ vựng; phần ② **70 phút** gồm ngữ pháp **và** đọc hiểu chung một quỹ giờ (tự chia giờ); phần ③ 40 phút nghe — băng chạy liên tục, không dừng, không nghe lại.',
    },
    CAU_TRUC_DE,
    {
      t: 'note',
      title: 'Ba điều người mới lên N3 hay bất ngờ',
      items: [
        '**Đề hoàn toàn bằng tiếng Nhật**, lời dẫn của N3 viết kiểu văn viết: 「＿＿のことばの{読|よ}み{方|かた}として{最|もっと}もよいものを、1・2・3・4から{一|ひと}つえらびなさい。」 Hai đề ở đây giữ đúng kiểu lời dẫn đó — đọc quen trước để ngày thi không mất giây nào.',
        '**Số câu mỗi 問題 không cố định tuyệt đối.** Bảng trên là con số JLPT công bố làm "mức tham khảo"; có kỳ 文脈規定 10 câu, 即時応答 8 câu… Đừng hoảng khi đếm thấy lệch 1–2 câu.',
        '**問題3 概要理解 và 問題5 即時応答 không in gì trên đề** — cả câu hỏi lẫn lựa chọn chỉ nghe. Ở web, 概要理解 vẫn in 4 lựa chọn để dễ chấm; hãy che lựa chọn đi, nghe xong tự nói ý chính trước rồi mới nhìn.',
      ],
    },
    SO_N4_N3,
    { t: 'h', text: '2. Thang điểm 180 — điểm đạt và điểm liệt' },
    THANG_DIEM,
    {
      t: 'note',
      title: 'Luật đạt — cần CẢ BỐN điều kiện (giống luật thật của JLPT)',
      items: [
        '**Tổng ≥ 95 / 180** **và** 言語知識 ≥ **19** **và** 読解 ≥ **19** **và** 聴解 ≥ **19**. Thiếu điểm liệt một mục là **TRƯỢT dù tổng cao**: ví dụ 言語知識 55 + 読解 18 + 聴解 50 = 123 điểm vẫn trượt vì 読解 < 19.',
        '**読解 chỉ có 16 câu** nên mỗi câu ≈ 3,75 điểm: sai 11 câu đọc là đã xuống dưới 19. Đây là mục người Việt hay "gãy" nhất — vì đọc chậm, hết giờ ở phần ②.',
        'Câu sai **không bị trừ điểm** ⇒ KHÔNG bỏ trống câu nào. Không biết thì loại bớt đáp án sai rồi đoán.',
        'Điểm thật của JLPT là **điểm quy chuẩn (尺度得点)** — không phải "số câu đúng × hệ số" — nên bảng quy đổi ở mục **Bảng điểm** chỉ là **ước lượng**, đủ để biết mình đang ở đâu so với vạch 95 / 19.',
      ],
    },
    { t: 'h', text: '3. Mẹo phân giờ từng phần' },
    {
      t: 'table',
      caption: 'Phân giờ gợi ý (dùng đúng như thế khi làm Đề 1)',
      head: ['Phần', 'Chia giờ', 'Mẹo'],
      rows: [
        ['① 文字・語彙 30′', '問題1–2 (14 câu): **6′** · 問題3 (11 câu): **9′** · 問題4–5 (10 câu): **11′** · soát + tô phiếu: **4′**', '漢字読み: nhìn **trường âm**, **âm ngắt (っ)**, **âm đục (゛)** — đáp án nhiễu chỉ khác đúng chỗ đó (えいきょう ↔ えいきょ). 表記: cảnh giác **chữ đồng âm** (放送 ↔ 包装) và **chữ trông giống** (責 ↔ 積). 用法: thay từ vào từng câu, câu nào "nghe Nhật" nhất; làm sau cùng.'],
        ['② 文法・読解 70′', '文法 23 câu: **20′** · 短文 4 bài: **10′** · 中文 2 bài: **14′** · 長文: **12′** · 情報検索: **8′** · soát: **6′**', 'Làm 文法 nhanh, **không quá 20 phút** — câu khó thì đánh dấu, đoán, đi tiếp. Câu ★: ghép **cặp mảnh chắc chắn** trước (Vる＋につれて, N＋さえ). 読解: đọc **câu hỏi trước**, gạch từ khoá; đáp án đúng thường **nói lại bằng từ khác**. 情報検索: viết điều kiện ra lề (ngày, giờ, tiền, đối tượng) rồi loại từng mục.'],
        ['③ 聴解 40′', 'Không chia được — băng tự chạy', '問題1: bẫy việc **đã xong / để sau / người khác làm** (～てある・あとでいい・～なくてもいい・それより). 問題2: đọc lựa chọn trong 20 giây được cho → biết phải bắt **lý do / điều gì**; cẩn thận lý do bị **phủ định** (～わけじゃない・それもあるけど). 問題3: nghe **từ lặp lại** + câu cuối. 問題4–5: chọn ngay khi nghe xong, **không tiếc câu trước**.'],
      ],
    },
    {
      t: 'note',
      title: 'Ngày thi',
      items: [
        'Phiếu trả lời tô bằng **bút chì (HB)**. Mang tẩy, đồng hồ đeo tay thường (không dùng đồng hồ thông minh).',
        'Phần ② dễ hết giờ nhất: **mốc 20 phút** phải xong 文法, **mốc 44 phút** phải xong 短文 + 中文. Trễ mốc thì đoán phần còn lại của bài đang đọc rồi sang bài kế — 長文 4 câu đáng 15 điểm 読解, đừng để mất trắng.',
        'Phần ③: khoảng lặng giữa các câu của 問題1–2 dùng để **đọc trước 4 lựa chọn** câu kế tiếp. Với 問題3–5 (không in chữ), ghi nhanh 1–2 từ khoá ra giấy nháp trong lúc nghe.',
      ],
    },
    { t: 'h', text: '4. Cách đọc bảng điểm JLPT gửi về (合否結果通知書)' },
    {
      t: 'table',
      caption: 'Những ô có trên bảng kết quả N3',
      head: ['Ô trên bảng', 'Nghĩa', 'Đọc thế nào'],
      rows: [
        ['得点区分別得点', 'Điểm từng mục', 'Ba số: 言語知識（文字・語彙・文法）/60 · 読解 /60 · 聴解 /60 — so từng số với điểm liệt 19.'],
        ['総合得点', 'Tổng điểm', 'Số /180 — so với 95.'],
        ['参考情報', 'Thông tin tham khảo', 'Hai chữ A / B / C cho **文字・語彙** và **文法** (hai mảng nằm chung mục 言語知識 — không phải điểm): **A** = đúng từ 67% trở lên · **B** = 34% đến dưới 67% · **C** = dưới 34%. Biết được mục 言語知識 thấp là do từ vựng hay do ngữ pháp.'],
        ['合格 ／ 不合格', 'Đạt / Không đạt', '合格 kèm giấy chứng nhận (認定結果及び成績に関する証明書).'],
      ],
    },
    {
      t: 'p',
      text: 'Ở mục **Bảng điểm** của bài này, bạn tự làm đúng việc đó cho Đề 1: quy đổi số câu đúng ra ba điểm mục + tổng, xét điểm liệt, tự xếp A / B / C cho 文字・語彙 và 文法 — rồi tra bảng để biết phải ôn Bài nào trong Bài 26–39.',
    },
  ],
};

/* ═══════════════════════════ 2. ĐỀ 1 · 文字・語彙 ═══════════════════════════ */

const DE1_MOJI: Lesson = {
  id: 'b40-thi-thu-1-moji-goi',
  kind: 'review',
  title: 'Thi thử N3 · Đề 1 · Phần ① 言語知識（文字・語彙）— 35 câu, 30 phút',
  goal: 'Làm phần chữ Hán và từ vựng của đề N3 trong 30 phút: đọc đúng chữ Hán của Bài 26–39 không cần furigana, chọn đúng chữ cho từ viết bằng hiragana (kể cả chữ đồng âm, chữ trông giống), chọn từ hợp ngữ cảnh, nhận ra từ / cụm từ cùng nghĩa và câu dùng từ đúng.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: 'Trước khi làm',
      items: [
        '**Bấm giờ 30 phút.** Không tra từ, không mở bài cũ. Làm hết 35 câu rồi mới bấm xem đáp án.',
        'Từ được hỏi ở 問題1 (in đậm) **không có furigana** — đừng bật furigana của trang để "nhìn trộm". Các chữ khác trong câu có furigana để bạn hiểu câu.',
        'Ghi số câu đúng của từng 問題 (1–8, 9–14, 15–25, 26–30, 31–35) để chấm ở mục **Bảng điểm**.',
      ],
    },
    { t: 'h', text: 'もんだい1 ＿＿のことばの{読|よ}み{方|かた}として{最|もっと}もよいものを、1・2・3・4から{一|ひと}つえらびなさい。' },
    MCQ('b40-d1-kanji-yomi', '問題1 漢字読み（1〜8）', [
      Q('（1）{大雨|おおあめ}の **影響** で、{電車|でんしゃ}が{一時間|いちじかん}{遅|おく}れた。', ['えいこう', 'えいきょう', 'ええきょう', 'えいきょ'], 1,
        '**{影響|えいきょう}** (eikyou — ảnh hưởng) — chữ 影・響 Bài 27. 影 đọc **エイ** (không phải ええ), 響 đọc **キョウ** có trường âm う. Hai bẫy: thiếu trường âm (えいきょ) và đọc theo 高 (えいこう).'),
      Q('（2）**普段** は{自転車|じてんしゃ}で{通学|つうがく}しているが、{雨|あめ}の{日|ひ}はバスに{乗|の}る。', ['ふだん', 'ふたん', 'ぶだん', 'ふうだん'], 0,
        '**{普段|ふだん}** (fudan — thường ngày) — 普 Bài 29 (フ, không trường âm) + 段 Bài 18 (ダン, âm đục). Từ vựng Bài 29.'),
      Q('（3）{駅|えき}から{大学|だいがく}までの **距離** は{約|やく}{二|に}キロだ。', ['きょうり', 'ぎょり', 'きより', 'きょり'], 3,
        '**{距離|きょり}** (kyori — khoảng cách) — chữ 距・離 Bài 36. 距 đọc **キョ** (ngắn, không đục), 離 đọc **リ**. ({約|やく} "khoảng" — Bài 33.)'),
      Q('（4）{日本|にほん}の{人口|じんこう}は、{少|すこ}しずつ **減少** している。', ['げんしょ', 'けんしょう', 'げんしょう', 'げんじょう'], 2,
        '**{減少|げんしょう}** (genshou — giảm) — 減 Bài 21 (ゲン, có dấu đục) + 少 (ショウ, có trường âm). Từ vựng Bài 33, đi cặp với {増加|ぞうか}.'),
      Q('（5）{彼|かれ}はテストの{点|てん}が{悪|わる}かったことを、{親|おや}に **隠して** いた。', ['なくして', 'かくして', 'ためして', 'もどして'], 1,
        '**{隠|かく}す** (kakusu — giấu) — chữ 隠 Bài 31; tự động từ là {隠|かく}れる (nấp). なくす (làm mất), ためす (thử), もどす (trả về chỗ cũ) là động từ khác.'),
      Q('（6）{予定|よてい}が{決|き}まったら、**詳しい** {時間|じかん}を{連絡|れんらく}します。', ['くわしい', 'くやしい', 'けわしい', 'こまかい'], 0,
        '**{詳|くわ}しい** (kuwashii — chi tiết, tường tận) — chữ 詳 Bài 31. こまかい là cách đọc của **{細|こま}かい** (chữ 細 cùng Bài 31, nghĩa gần) — bẫy "nghĩa gần, chữ khác". くやしい = {悔|くや}しい (Bài 35).'),
      Q('（7）この{町|まち}は、{新|あたら}しい{駅|えき}ができてから{大|おお}きく **発展** した。', ['はつてん', 'ほってん', 'はっでん', 'はってん'], 3,
        '**{発展|はってん}** (hatten — phát triển) — 発 Bài 17 + 展 Bài 32. ハツ + テン ⇒ âm ngắt **はってん**; テン KHÔNG đục. Phân biệt {発達|はったつ} (cơ thể, năng lực phát triển) — Bài 32.'),
      Q('（8）{課長|かちょう}に{書類|しょるい}のミスを **指摘** された。', ['しせき', 'してい', 'してき', 'しってき'], 2,
        '**{指摘|してき}** (shiteki — chỉ ra lỗi) — 指 Bài 17 + 摘 Bài 35 (テキ). Không có âm ngắt. 指定 (してい — chỉ định, {指定席|していせき}) là từ khác.'),
    ]),
    { t: 'h', text: 'もんだい2 ＿＿のことばを{漢字|かんじ}で{書|か}くとき、{最|もっと}もよいものを、1・2・3・4から{一|ひと}つえらびなさい。' },
    MCQ('b40-d1-hyouki', '問題2 表記（9〜14）', [
      Q('（9）{二|ふた}つのデータを **ひかく** して、{違|ちが}いを{調|しら}べた。', ['比格', '比較', '批較', '皆較'], 1,
        '**比較** (hikaku — so sánh) — 比 Bài 28 + 較 Bài 36. **批** (Bài 38, {批判|ひはん}) có thêm bộ thủ 扌 — bẫy chữ trông giống. 格 (Bài 21, {合格|ごうかく}) cùng âm カク nhưng khác chữ.'),
      Q('（10）{雨|あめ}のため、{運動会|うんどうかい}は{来週|らいしゅう}に **えんき** になった。', ['延期', '廷期', '延基', '廷基'], 0,
        '**延期** (enki — hoãn) — 延 Bài 37 + 期 Bài 26. 延 và 廷 (triều đình) cùng bộ 廴 nhưng phần bên trong khác: 延 là 丿＋止, 廷 là 壬. 基 (Bài 33, {基本|きほん}) cùng bộ phận 其 với 期 nhưng nghĩa là "nền", không phải "kỳ hạn".'),
      Q('（11）{警察|けいさつ}が{事故|じこ}の{原因|げんいん}を **ちょうさ** している。', ['調差', '週査', '週差', '調査'], 3,
        '**調査** (chousa — điều tra) — 調 + 査 Bài 29 (木 + 且). 差 (さ — chênh lệch, Bài 33) cùng âm サ; 週 trông giống 調 ở phần 周 — hai bẫy ghép lại.'),
      Q('（12）{父|ちち}は{銀行|ぎんこう}に **つとめて** います。', ['努めて', '務めて', '勤めて', '動めて'], 2,
        '**勤めて** — {会社|かいしゃ}・{銀行|ぎんこう}に{勤|つと}める = làm việc ở (một nơi) — chữ 勤 Bài 30 ({勤務|きんむ}). Ba chữ cùng đọc つとめる: **{努|つと}める** (cố gắng — {努力|どりょく} Bài 21) · **{務|つと}める** (đảm nhận vai trò: {司会|しかい}を{務|つと}める — {業務|ぎょうむ} Bài 30) · **{勤|つと}める** (làm việc ở nơi nào). 動 không có cách đọc つとめる.'),
      Q('（13）{自分|じぶん}の{行動|こうどう}には **せきにん** を{持|も}ちなさい。', ['積任', '責任', '責認', '積認'], 1,
        '**責任** (sekinin — trách nhiệm) — 責 + 任 Bài 28. **積** (Bài 33, {積極的|せっきょくてき}) cùng âm セキ, thêm bộ 禾 — bẫy kinh điển. 認 (Bài 28, {確認|かくにん}) đọc ニン nhưng nghĩa "nhận, công nhận".'),
      Q('（14）プレゼントなので、お{店|みせ}の{人|ひと}にきれいに **ほうそう** してもらった。', ['放送', '包送', '放装', '包装'], 3,
        '**包装** (housou — gói hàng, gói quà) — 包 Bài 36 + 装. **{放送|ほうそう}** (phát sóng — Bài 27) đọc Y HỆT — chỉ ngữ cảnh "gói quà" mới phân biệt được. Đây là dạng bẫy 同音異義語 hay gặp nhất của 表記.'),
    ]),
    { t: 'h', text: 'もんだい3 （　）に{入|い}れるのに{最|もっと}もよいものを、1・2・3・4から{一|ひと}つえらびなさい。' },
    MCQ('b40-d1-bunmyaku', '問題3 文脈規定（15〜25）', [
      Q('（15）レポートの{締|し}め{切|き}りに{間|ま}に{合|あ}うように、{昨日|きのう}は（　）してしまった。', ['{居眠|いねむ}り', '{徹夜|てつや}', '{二度寝|にどね}', '{夜食|やしょく}'], 1,
        'Để kịp hạn chót ⇒ thức trắng đêm: **{徹夜|てつや}する** (tetsuya — Bài 26). {居眠|いねむ}り = ngủ gật (Bài 26), {二度寝|にどね} = ngủ nướng (Bài 34), {夜食|やしょく} = bữa khuya (Bài 34) — không có lý do "để kịp hạn".'),
      Q('（16）{大|おお}きな{台風|たいふう}が{近|ちか}づいているので、{海|うみ}の{近|ちか}くに{住|す}む{人|ひと}は{早|はや}めに（　）してください。', ['{遅延|ちえん}', '{延期|えんき}', '{再開|さいかい}', '{避難|ひなん}'], 3,
        'Bão đến ⇒ dân ven biển **{避難|ひなん}する** (hinan — sơ tán) — Bài 27. {遅延|ちえん} (tàu chậm), {延期|えんき} (hoãn sự kiện), {再開|さいかい} (mở lại) không có chủ ngữ là NGƯỜI dân.'),
      Q('（17）{会議|かいぎ}で、{新|あたら}しい{計画|けいかく}に{反対|はんたい}する{理由|りゆう}をはっきり（　）した。', ['{主張|しゅちょう}', '{納得|なっとく}', '{誤解|ごかい}', '{勘違|かんちが}い'], 0,
        '**理由を{主張|しゅちょう}する** (shuchou — khẳng định, nêu mạnh ý mình) — Bài 28; đi với はっきり. {納得|なっとく} (thấy thoả đáng) là phía NGƯỜI NGHE; {誤解|ごかい}・{勘違|かんちが}い (hiểu lầm, nhầm) không đi với はっきり.'),
      Q('（18）{先生|せんせい}の{説明|せつめい}を{聞|き}いて、なぜ{答|こた}えが{違|ちが}うのか、やっと（　）できた。', ['{提案|ていあん}', '{指示|しじ}', '{納得|なっとく}', '{推測|すいそく}'], 2,
        'Nghe giải thích xong mới "à, ra vậy" ⇒ **{納得|なっとく}できた** (nattoku — Bài 28). {推測|すいそく} = đoán khi CHƯA có lời giải thích (Bài 31) — ngược tình huống; {提案|ていあん}, {指示|しじ} là việc của người nói.'),
      Q('（19）{毎朝|まいあさ}{走|はし}ろうと{決|き}めたのに、{結局|けっきょく}（　）で{終|お}わってしまった。', ['{口癖|くちぐせ}', '{三日坊主|みっかぼうず}', '{後回|あとまわ}し', '{自慢|じまん}'], 1,
        'Quyết tâm rồi bỏ ngang ⇒ **{三日坊主|みっかぼうず}** (mikka bouzu — cả thèm chóng chán, Bài 34). {口癖|くちぐせ} = câu cửa miệng, {後回|あとまわ}し = để sau, {自慢|じまん} = khoe — cùng Bài 34.'),
      Q('（20）{雨|あめ}の{日|ひ}が{続|つづ}いて、{洗濯物|せんたくもの}がなかなか（　）。', ['{乾|かわ}かない', '{冷|ひ}えない', '{散|ち}らからない', '{揺|ゆ}れない'], 0,
        '**{洗濯物|せんたくもの}が{乾|かわ}く** (kawaku — khô) — Bài 26 (chữ 乾), {洗濯物|せんたくもの} Bài 34. {冷|ひ}える (bị lạnh), {散|ち}らかる (bừa bộn), {揺|ゆ}れる (rung lắc) không hợp "mưa mãi".'),
      Q('（21）{人気|にんき}の{商品|しょうひん}なので、{店|みせ}に{行|い}ったときにはもう（　）だった。', ['{在庫|ざいこ}', '{返品|へんぴん}', '{空席|くうせき}', '{品切|しなぎ}れ'], 3,
        'Hàng hot, đến nơi thì đã **{品切|しなぎ}れ** (shinagire — hết hàng, Bài 38). {在庫|ざいこ} = hàng còn trong kho (ngược nghĩa), {返品|へんぴん} = trả hàng, {空席|くうせき} = ghế trống (Bài 39) — không nói về hàng hoá.'),
      Q('（22）{日本|にほん}では、{目上|めうえ}の{人|ひと}を（　）にするのは{失礼|しつれい}です。', ['{割|わ}り{勘|かん}', '{呼|よ}び{捨|す}て', '{建前|たてまえ}', 'お{辞儀|じぎ}'], 1,
        '**{呼|よ}び{捨|す}てにする** (yobisute — gọi trống không, không kèm さん) — Bài 36. Cấu trúc "người を ～にする" chỉ hợp với {呼|よ}び{捨|す}て. {割|わ}り{勘|かん} = chia tiền; お{辞儀|じぎ} = cúi chào (lịch sự, không thất lễ).'),
      Q('（23）スマートフォンは{急速|きゅうそく}に（　）し、{今|いま}ではお{年寄|としよ}りの{多|おお}くも{使|つか}っている。', ['{発達|はったつ}', '{開発|かいはつ}', '{普及|ふきゅう}', '{進歩|しんぽ}'], 2,
        'Vế sau "nay cả người già cũng dùng" = lan rộng tới mọi người ⇒ **{普及|ふきゅう}する** (fukyuu — phổ cập, Bài 32). {進歩|しんぽ} = kỹ thuật tiến bộ (không nói chuyện nhiều người dùng); {発達|はったつ} = cơ thể, năng lực phát triển; {開発|かいはつ} cần tân ngữ (～を{開発|かいはつ}する).'),
      Q('（24）{新|あたら}しい{職場|しょくば}の{仕事|しごと}は{大変|たいへん}だが、{毎日|まいにち}がとても（　）している。', ['{精一杯|せいいっぱい}', '{前向|まえむ}き', '{有意義|ゆういぎ}', '{充実|じゅうじつ}'], 3,
        '**{毎日|まいにち}が{充実|じゅうじつ}している** (juujitsu — đầy đủ, trọn vẹn, Bài 35) — chỉ 充実 đi được với **～している**. {有意義|ゆういぎ}な・{前向|まえむ}きな là tính từ な; {精一杯|せいいっぱい} là phó từ / danh từ ("hết sức").'),
      Q('（25）{試験|しけん}の{前|まえ}の{日|ひ}は{緊張|きんちょう}して、（　）お{菓子|かし}を{食|た}べすぎてしまう。', ['つい', 'せめて', 'どうせ', 'とりあえず'], 0,
        '**つい ～てしまう** (tsui — lỡ, bất giác, Bài 34) — cặp cố định. せめて (ít nhất thì), どうせ (đằng nào cũng), とりあえず (trước mắt) — Bài 39 — không đi với "lỡ ăn quá nhiều".'),
    ]),
    { t: 'h', text: 'もんだい4 ＿＿に{意味|いみ}が{最|もっと}も{近|ちか}いものを、1・2・3・4から{一|ひと}つえらびなさい。' },
    MCQ('b40-d1-iikae', '問題4 言い換え類義（26〜30）', [
      Q('（26）{弟|おとうと}は **{飽|あ}きっぽい** {性格|せいかく}だ。', ['すぐ{怒|おこ}る', '{何|なん}でもすぐやめてしまう', '{忘|わす}れ{物|もの}が{多|おお}い', '{子|こ}どもみたいな'], 1,
        '**{飽|あ}きっぽい** (akippoi — mau chán) — Vます＋っぽい "hay…" (Bài 31 ④) ⇒ làm gì cũng nhanh chán bỏ. すぐ{怒|おこ}る = {怒|おこ}りっぽい; {忘|わす}れ{物|もの}が{多|おお}い = {忘|わす}れっぽい; {子|こ}どもみたいな = {子|こ}どもっぽい — ba từ cùng họ っぽい làm nhiễu.'),
      Q('（27）{事故|じこ}のため、{電車|でんしゃ}は{現在|げんざい}、{運転|うんてん}を **{見合|みあ}わせて** います。', ['{一時|いちじ}{止|と}めて', '{遅|おく}らせて', '{早|はや}めて', '{再開|さいかい}して'], 0,
        '**{運転|うんてん}を{見合|みあ}わせる** (miawaseru — tạm dừng để chờ xem tình hình, Bài 27) ≈ **{一時|いちじ}{止|と}める**. {再開|さいかい}する (chạy lại) gần như ngược nghĩa; {遅|おく}らせる・{早|はや}める (Bài 39) là dời giờ.'),
      Q('（28）{弟|おとうと}の{部屋|へや}は、いつも **{散|ち}らかっている**。', ['{汚|よご}れている', '{静|しず}かだ', '{暗|くら}い', '{片付|かたづ}いていない'], 3,
        '**{散|ち}らかっている** (chirakatte iru — bừa bộn, đồ vứt lung tung, Bài 34) ≈ **{片付|かたづ}いていない** (chưa được dọn gọn). Bẫy: {汚|よご}れている = BẨN (có vết bẩn) — một căn phòng có thể bừa mà không bẩn. Tha động từ: ～を{散|ち}らかす (bày bừa).'),
      Q('（29）**{恐|おそ}らく** {明日|あした}も{雨|あめ}だろう。', ['きっと', '{必|かなら}ず', 'たぶん', '{決|けっ}して'], 2,
        '**{恐|おそ}らく** (osoraku — có lẽ, văn viết, Bài 31) ≈ **たぶん**; cả hai hay đi với ～だろう. きっと (chắc chắn — người nói tin mạnh hơn), {必|かなら}ず (nhất định), {決|けっ}して～ない (tuyệt đối không) đều quá mạnh.'),
      Q('（30）{鈴木|すずき}さんは **{気|き}が{利|き}く** {人|ひと}だ。', ['{自分|じぶん}の{意見|いけん}をはっきり{言|い}う', '{周|まわ}りのことによく{気|き}がつく', 'すぐに{心配|しんぱい}する', '{怒|おこ}りっぽい'], 1,
        '**{気|き}が{利|き}く** (ki ga kiku — tinh ý, chu đáo, Bài 35) ≈ **{周|まわ}りのことによく{気|き}がつく** (để ý thấy người khác cần gì và làm trước). Đừng nhầm với {気|き}にする (lo lắng — đáp án 3).'),
    ]),
    { t: 'h', text: 'もんだい5 つぎのことばの{使|つか}い{方|かた}として{最|もっと}もよいものを、1・2・3・4から{一|ひと}つえらびなさい。' },
    MCQ('b40-d1-youhou', '問題5 用法（31〜35）', [
      Q('（31）{夢中|むちゅう}', [
        '{夢中|むちゅう}で、{昨日|きのう}の{夜|よる}は{怖|こわ}い{夢|ゆめ}を{見|み}た。',
        '{弟|おとうと}はゲームに{夢中|むちゅう}になって、{晩|ばん}ご{飯|はん}も{忘|わす}れていた。',
        '{彼|かれ}は{夢中|むちゅう}な{人|ひと}なので、{約束|やくそく}をよく{忘|わす}れる。',
        '{試験|しけん}が{夢中|むちゅう}で、よく{眠|ねむ}れなかった。',
      ], 1,
        '**N に{夢中|むちゅう}になる** (muchuu — mải mê đến quên cả xung quanh, Bài 26). Câu 1 nhầm với {夢|ゆめ} (giấc mơ); câu 3 dùng như tính từ chỉ tính cách — sai; câu 4 phải là {試験|しけん}が{心配|しんぱい}で.'),
      Q('（32）{配慮|はいりょ}', [
        '{高齢者|こうれいしゃ}に{配慮|はいりょ}して、{案内|あんない}の{文字|もじ}を{大|おお}きくした。',
        '{毎月|まいつき}、{給料|きゅうりょう}の{一部|いちぶ}を{配慮|はいりょ}している。',
        '{先生|せんせい}に{宿題|しゅくだい}を{配慮|はいりょ}してもらった。',
        '{駅|えき}で{切符|きっぷ}を{配慮|はいりょ}した。',
      ], 0,
        '**N に{配慮|はいりょ}する** (hairyo — quan tâm, cân nhắc để không gây bất tiện cho ai, Bài 37/38). Câu 2 nhầm với {貯金|ちょきん}; câu 3 nhầm "giúp đỡ"; câu 4 nhầm {購入|こうにゅう} / {買|か}う.'),
      Q('（33）{見直|みなお}す', [
        '{久|ひさ}しぶりに{友達|ともだち}と{見直|みなお}して、{楽|たの}しかった。',
        '{窓|まど}から{外|そと}の{景色|けしき}を{見直|みなお}した。',
        '{眼鏡|めがね}を{見直|みなお}したら、よく{見|み}えるようになった。',
        '{提出|ていしゅつ}する{前|まえ}に、レポートをもう{一度|いちど}{見直|みなお}した。',
      ], 3,
        '**{見直|みなお}す** (minaosu — xem lại, rà soát lại cho đúng, Bài 34). Câu 1 nhầm {会|あ}う; câu 2 chỉ là {眺|なが}める／{見|み}る; câu 3 phải là {眼鏡|めがね}を{変|か}えたら. (Nghĩa thứ hai "nhìn nhận lại ai đó tốt hơn": {彼|かれ}を{見直|みなお}した — cũng Bài 34.)'),
      Q('（34）{受|う}け{入|い}れる', [
        '{雨|あめ}が{降|ふ}りそうなので、{洗濯物|せんたくもの}を{部屋|へや}に{受|う}け{入|い}れた。',
        '{銀行|ぎんこう}でお{金|かね}を{受|う}け{入|い}れた。',
        'この{会社|かいしゃ}は{今年|ことし}、{留学生|りゅうがくせい}を{十人|じゅうにん}{受|う}け{入|い}れることにした。',
        '{友達|ともだち}から{届|とど}いたメールを{受|う}け{入|い}れた。',
      ], 2,
        '**{受|う}け{入|い}れる** (ukeireru — tiếp nhận, đón nhận người / ý kiến / văn hoá, Bài 36). Câu 1 phải là {取|と}り{込|こ}む (cất đồ phơi vào); câu 2 là {預|あず}ける／{下|お}ろす; câu 4 là {受|う}け{取|と}る (nhận đồ, thư).'),
      Q('（35）{手間|てま}', [
        '{忙|いそが}しくて{手間|てま}がないので、{今日|きょう}は{行|い}けません。',
        '{手間|てま}がかかるが、{手作|てづく}りのお{弁当|べんとう}はやっぱりおいしい。',
        '{食|た}べる{前|まえ}に、{手間|てま}をよく{洗|あら}ってください。',
        'この{時計|とけい}は{手間|てま}が{高|たか}いので、{買|か}えない。',
      ], 1,
        '**{手間|てま}がかかる** (tema ga kakaru — tốn công, Bài 32). Câu 1 phải là {時間|じかん}がない／{暇|ひま}がない; câu 3 nhầm với {手|て}; câu 4 nhầm với {値段|ねだん}.'),
    ]),
    {
      t: 'note',
      title: 'Xong phần ① — ghi điểm',
      items: [
        'Ghi số câu đúng: 問題1 __/8 · 問題2 __/6 · 問題3 __/11 · 問題4 __/5 · 問題5 __/5 ⇒ **文字・語彙 __/35**.',
        'Nghỉ 5 phút rồi sang **Phần ② 文法・読解 (70 phút)**. Chưa xem bảng ôn vội — chấm một lần cho cả đề ở mục **Bảng điểm**.',
      ],
    },
  ],
};

/* ═══════════════════════════ 3. ĐỀ 1 · 文法・読解 ═══════════════════════════ */

const DE1_BUNPO: Lesson = {
  id: 'b40-thi-thu-2-bunpo-dokkai',
  kind: 'review',
  title: 'Thi thử N3 · Đề 1 · Phần ② 言語知識（文法）・読解 — 39 câu, 70 phút',
  goal: 'Làm phần ngữ pháp và đọc hiểu của đề N3 trong 70 phút: chọn đúng mẫu N3 (うちに, おかげで, くせに, うえに, ば～ほど, とのことだ, に違いない, わけではない, ものだ, に基づいて, 気味, させられる, kính ngữ…), sắp câu ★, điền 5 chỗ trống của bài văn; đọc email, thông báo, ghi chú, đoạn ý kiến, hai bài văn vừa, một bài bình luận dài và một bảng thông tin để tìm đúng câu trả lời.',
  minutes: 70,
  blocks: [
    {
      t: 'recap',
      title: 'Trước khi làm',
      items: [
        '**Bấm giờ 70 phút** cho cả 文法 (câu 36–58) lẫn 読解 (câu 59–74). Gợi ý: 文法 ~20 phút, 短文 ~10, 中文 ~14, 長文 ~12, 情報検索 ~8, soát ~6.',
        '問題2 ★: viết thứ tự 4 mảnh ra giấy rồi mới chọn — ô ★ trong đề này **không phải lúc nào cũng ở ô thứ 3** (đề thật cũng vậy).',
        '読解: đọc **câu hỏi trước**, gạch từ khoá, rồi mới đọc bài. Câu trả lời đúng thường được **nói lại bằng từ khác**; đáp án "có chữ giống hệt trong bài" hay là bẫy. Tắt furigana khi đọc nếu bạn đã thuộc chữ Bài 26–39.',
      ],
    },

    /* ── 文法 ── */
    { t: 'h', text: 'もんだい1 つぎの{文|ぶん}の（　）に{入|い}れるのに{最|もっと}もよいものを、1・2・3・4から{一|ひと}つえらびなさい。' },
    MCQ('b40-d1-bunpou', '問題1 文法形式の判断（36〜48）', [
      QP('（36）{若|わか}い（　）、いろいろな{国|くに}へ{行|い}っておきたい。', 'うちに', ['あとで', '{最中|さいちゅう}に', 'とたんに'], 0,
        'Nhân lúc còn trẻ (trước khi trạng thái thay đổi) + vế sau ý chí ⇒ **イA＋うちに** (wakai uchi ni) — Bài 26 ①. {最中|さいちゅう}に cần N の／Vている; とたんに cần Vた; "{若|わか}いあとで" không có.'),
      QP('（37）{先輩|せんぱい}が{手伝|てつだ}ってくれた（　）、{仕事|しごと}が{早|はや}く{終|お}わった。', 'おかげで', ['せいで', 'ものの', 'くせに'], 2,
        'Kết quả TỐT nhờ người khác + biết ơn ⇒ **おかげで** (tetsudatte kureta okage de) — Bài 27 ③. せいで dùng cho kết quả xấu (đổ lỗi); ものの = "tuy… nhưng" — vế sau phải trái ý; くせに = chê trách.'),
      QP('（38）{兄|あに}は{自分|じぶん}では{何|なに}もしない（　）、{文句|もんく}ばかり{言|い}う。', 'くせに', ['ものの', 'ほど', 'とともに'], 1,
        'Chê người khác "đã… mà còn…", cùng chủ ngữ ({兄|あに}) ⇒ **くせに** (nani mo shinai kuse ni) — Bài 28 ①. ものの là văn viết khách quan, không mang giọng chê; ほど・とともに không phải ngược ý.'),
      QP('（39）この{仕事|しごと}は{難|むずか}しい（　）、{給料|きゅうりょう}も{安|やす}い。', 'うえに', ['ものの', 'さえ', 'ほど'], 3,
        'Hai điều XẤU cộng dồn, có **も** ở vế sau ⇒ **うえに** "không những… mà còn" (muzukashii ue ni, kyuuryou mo yasui) — Bài 29 ⑧. ものの đòi vế sau ngược chiều; さえ đứng sau danh từ; ほど là mức độ.'),
      QP('（40）{練習|れんしゅう}すれば（　）、{上手|じょうず}になるはずだ。', 'するほど', ['したほど', 'しているほど', 'するくらい'], 0,
        '**～ば ～ほど** "càng… càng…": lặp lại CÙNG động từ, vế sau ở thể từ điển — {練習|れんしゅう}すれば{練習|れんしゅう}する**ほど** (renshuu sureba suru hodo) — Bài 29 ⑥. くらい không ghép với ば thành "càng…càng".'),
      QP('（41）さっき{山口|やまぐち}さんから{電話|でんわ}があって、{会議|かいぎ}に{少|すこ}し{遅|おく}れる（　）。', 'とのことです', ['ことです', 'ものです', 'わけがありません'], 2,
        'Chuyển lời nhắn của người khác, trang trọng ⇒ **普通形＋とのことです** (okureru to no koto desu) — Bài 30 ②. ことです = lời khuyên "nên" (Bài 32); ものです = lẽ thường (Bài 32); わけがない = phủ định mạnh.'),
      QP('（42）あんなに{毎日|まいにち}{練習|れんしゅう}していたのだから、カルロスさんは{合格|ごうかく}した（　）。', 'に{違|ちが}いない', ['わけではない', 'はずがない', 'ことはない'], 1,
        'Căn cứ "luyện mỗi ngày như thế" ⇒ người nói tin chắc ⇒ **～に{違|ちが}いない** (goukaku shita ni chigai nai) — Bài 31 ①. はずがない (không lẽ nào) ngược nghĩa; わけではない là phủ định một phần; ことはない = không cần phải.'),
      QP('（43）{野菜|やさい}が{嫌|きら}いな（　）が、{毎日|まいにち}{食|た}べたいとは{思|おも}わない。', 'わけではない', ['わけがない', 'わけにはいかない', 'ものだ'], 3,
        'Phủ định một phần "không phải là ghét, nhưng…" ⇒ **ナAな＋わけではない** (kirai na wake de wa nai) — Bài 31 ⑥. わけがない = "làm gì có chuyện" (phủ định toàn bộ); わけにはいかない = không thể (vì lẽ phải) — Bài 31 ③ ⑦.'),
      QP('（44）{子|こ}どもの{頃|ころ}は、よくこの{川|かわ}で{兄|あに}と{泳|およ}いだ（　）。', 'ものだ', ['ことだ', 'わけだ', 'はずだ'], 2,
        'Hồi tưởng THÓI QUEN ngày xưa (よく + Vた) ⇒ **Vた＋ものだ** (oyoida mono da) — Bài 32 ②. ことだ = lời khuyên; わけだ = thảo nào; はずだ = lẽ ra — không hồi tưởng.'),
      QP('（45）アンケートの{結果|けっか}（　）、{来年|らいねん}の{計画|けいかく}を{立|た}てた。', 'に{基|もと}づいて', ['に{対|たい}して', 'にとって', 'によると'], 1,
        'Lấy kết quả khảo sát làm CĂN CỨ để lập kế hoạch ⇒ **N＋に{基|もと}づいて** (kekka ni motozuite) — Bài 33 ②. によると (theo nguồn tin) phải kết bằng ～そうだ／～とのことだ, không đi với hành động "lập kế hoạch"; に{対|たい}して = đối với; にとって = đối với (góc nhìn).'),
      QP('（46）{今朝|けさ}から{少|すこ}し{風邪|かぜ}（　）なので、{今日|きょう}は{早|はや}めに{寝|ね}ます。', '{気味|ぎみ}', ['がち', '{一方|いっぽう}', 'くせ'], 0,
        '"Hơi bị" — trạng thái nhẹ đang có NGAY LÚC NÀY ({今朝|けさ}から{少|すこ}し) ⇒ **N＋{気味|ぎみ}** ({風邪気味|かぜぎみ} — kazegimi) — Bài 34 ②. がち = hay bị, thành xu hướng lặp lại (không hợp "từ sáng nay"); {一方|いっぽう}だ cần V辞書形.'),
      QP('（47）{部長|ぶちょう}に、{同|おな}じ{資料|しりょう}を{三回|さんかい}も{書|か}き{直|なお}さ（　）。', 'せられた', ['れた', 'せた', 'せてもらった'], 3,
        'Bị BẮT làm (không muốn) ⇒ sai khiến bị động: {書|か}き{直|なお}す → {書|か}き{直|なお}させる → **{書|か}き{直|なお}させられた** (kakinaosaserareta) — Bài 35 ①②. Động từ tận cùng す KHÔNG rút gọn thành ～さされる. {書|か}き{直|なお}された = (tài liệu của tôi) bị người khác viết lại; ～させてもらった = được cho phép — không hợp "những ba lần".'),
      QP('（48）では、{明日|あした}の{午前中|ごぜんちゅう}に、{御社|おんしゃ}へ{資料|しりょう}をお{届|とど}け（　）。', 'いたします', ['になります', 'なさいます', 'くださいます'], 2,
        'Việc của MÌNH làm hướng tới khách ⇒ khiêm nhường **お＋Vます＋いたします** (otodoke itashimasu) — Bài 37 ②. お～になる・なさる・くださる là tôn kính — dùng cho việc của khách.'),
    ]),
    { t: 'h', text: 'もんだい2 つぎの{文|ぶん}の ★ に{入|はい}る{最|もっと}もよいものを、1・2・3・4から{一|ひと}つえらびなさい。' },
    MCQ('b40-d1-kumitate', '問題2 文の組み立て（49〜53）', [
      Q('（49）{年|とし}を ＿＿ ＿＿ ★ ＿＿ きた。', ['{落|お}ちて', 'とる', '{体力|たいりょく}が', 'につれて'], 2,
        'Câu đúng: {年|とし}を **とる につれて {体力|たいりょく}が {落|お}ちて** きた (toshi o toru ni tsurete tairyoku ga ochite kita — càng có tuổi sức càng giảm). Ô ★ (thứ 3) = **{体力|たいりょく}が**. V辞書形＋につれて — Bài 32 ⑥; ～てくる (thay đổi dần) — N4.'),
      Q('（50）{大切|たいせつ}な ＿＿ ★ ＿＿ ＿＿ {鳴|な}ってしまった。', ['{私|わたし}の', '{携帯電話|けいたいでんわ}が', '{会議|かいぎ}の', '{最中|さいちゅう}に'], 3,
        'Câu đúng: {大切|たいせつ}な **{会議|かいぎ}の {最中|さいちゅう}に {私|わたし}の {携帯電話|けいたいでんわ}が** {鳴|な}ってしまった (kaigi no saichuu ni watashi no keitai denwa ga natte shimatta). Ô ★ (thứ 2) = **{最中|さいちゅう}に**. N の＋{最中|さいちゅう}に — Bài 26 ⑤; ghép chắc trước: {大切|たいせつ}な + {会議|かいぎ}の.'),
      Q('（51）{大事|だいじ}な{試験|しけん}なので、＿＿ ＿＿ ★ ＿＿ いかない。', ['{休|やす}む', 'わけには', '{熱|ねつ}が', 'あっても'], 0,
        'Câu đúng: **{熱|ねつ}が あっても {休|やす}む わけには** いかない (netsu ga atte mo yasumu wake ni wa ikanai — dù sốt cũng không thể nghỉ). Ô ★ (thứ 3) = **{休|やす}む**. V辞書形＋わけにはいかない — Bài 31 ⑦; mảnh わけには luôn đứng sát trước いかない.'),
      Q('（52）{課長|かちょう}の ＿＿ ＿＿ ＿＿ ★ 、{会議|かいぎ}は{来週|らいしゅう}に{延期|えんき}になったそうです。', ['{先方|せんぽう}の', '{都合|つごう}で', '{話|はなし}に', 'よると'], 1,
        'Câu đúng: {課長|かちょう}の **{話|はなし}に よると {先方|せんぽう}の {都合|つごう}で** 、{会議|かいぎ}は… (kachou no hanashi ni yoru to, senpou no tsugou de… — theo lời trưởng phòng, vì phía đối tác bận…). Ô ★ (thứ 4) = **{都合|つごう}で**. N によると … ～そうだ — Bài 33 ①; N で chỉ nguyên nhân — ポイント 124.'),
      Q('（53）インターネットに ＿＿ ＿＿ ★ ＿＿ 、どこでも{仕事|しごと}ができる。', ['あれば', 'つながる', 'パソコン', 'さえ'], 3,
        'Câu đúng: インターネットに **つながる パソコン さえ あれば** 、どこでも… (tsunagaru pasokon sae areba — chỉ cần có cái máy tính nối mạng). Ô ★ (thứ 3) = **さえ**. N さえ ～ば — Bài 29 ⑦; mệnh đề つながる bổ nghĩa cho パソコン.'),
    ]),
    { t: 'h', text: 'もんだい3 つぎの{文章|ぶんしょう}を{読|よ}んで、{文章|ぶんしょう}{全体|ぜんたい}の{内容|ないよう}を{考|かんが}えて、[54]から[58]の{中|なか}に{入|はい}る{最|もっと}もよいものを、1・2・3・4から{一|ひと}つえらびなさい。' },
    {
      t: 'passage',
      title: '問題3 文章の文法 — リンさんの{作文|さくぶん}「{日本|にほん}に{来|き}て{気|き}づいたこと」',
      intro: 'Đọc cả bài một lượt trước, rồi chọn cho [54]–[58] ở câu hỏi ngay dưới.',
      paras: [
        { text: '{私|わたし}は{日本|にほん}に{来|き}て、もうすぐ{一年|いちねん}になる。{来|き}たばかりの{頃|ころ}は、{日本人|にほんじん}はみんな{静|しず}かでまじめだと{思|おも}っていた。 **[54]** 、{大学|だいがく}の{友達|ともだち}と{話|はな}す **[55]** 、そのイメージは{少|すこ}しずつ{変|か}わっていった。' },
        { text: 'たとえば、サークルの{先輩|せんぱい}は、{最初|さいしょ}はほとんど{話|はな}さない{人|ひと}だと{思|おも}っていた。でも、{実際|じっさい}はよく{冗談|じょうだん}を{言|い}って、みんなを{笑|わら}わせる{人|ひと}だった。{話|はな}すのが{嫌|きら}いだった **[56]** 。{初|はじ}めて{会|あ}う{人|ひと}の{前|まえ}では、{緊張|きんちょう}してしまうだけなのだそうだ。' },
        { text: '{今|いま}{思|おも}えば、{日本|にほん}に{来|く}る{前|まえ}に、もっと{日本|にほん}の{文化|ぶんか}について **[57]** と{思|おも}うこともある。でも、{知|し}らないことに{一|ひと}つ{一|ひと}つ{驚|おどろ}きながら{暮|く}らす{毎日|まいにち}も、{留学生|りゅうがくせい}の{私|わたし} **[58]** 、{大切|たいせつ}な{経験|けいけん}なのだと{思|おも}う。' },
      ],
    },
    MCQ('b40-d1-bunshou', '問題3 文章の文法（54〜58）', [
      Q('[54]', ['それで', 'ところが', 'つまり', 'たとえば'], 1,
        'Trước: "lúc mới đến tưởng người Nhật ai cũng ít nói, nghiêm túc". Sau: "hình ảnh ấy dần thay đổi" ⇒ ngược với điều đã nghĩ ⇒ **ところが** (tokoro ga — thế nhưng, trái với dự đoán) — Bài 38 ①. それで = vì thế (thuận); つまり = tức là; たとえば mở ví dụ — đoạn 2 mới là ví dụ.'),
      Q('[55]', ['うちに', 'とたんに', '{最中|さいちゅう}に', '{前|まえ}に'], 0,
        'Trong lúc cứ nói chuyện (lặp lại, kéo dài) thì hình ảnh **thay đổi dần lúc nào không hay** ⇒ **V辞書形＋うちに** (hanasu uchi ni) — Bài 26 ②. とたんに = vừa… thì lập tức (đột ngột — ngược với "{少|すこ}しずつ"); {最中|さいちゅう}に cần sự việc bị chen ngang; {前|まえ}に sai trình tự.'),
      Q('[56]', ['はずだった', 'に{違|ちが}いなかった', 'ものだった', 'わけではなかった'], 3,
        'Câu sau giải thích lý do thật: chỉ là căng thẳng trước người lạ ⇒ phủ định lý do mình đã tưởng: **{嫌|きら}いだったわけではなかった** "không phải là anh ấy ghét nói" (wake de wa nakatta) — Bài 31 ⑥. に{違|ちが}いなかった khẳng định ngược lại; はずだった = lẽ ra đã.'),
      Q('[57]', ['{調|しら}べておくことだ', '{調|しら}べておくわけだ', '{調|しら}べておけばよかった', '{調|しら}べておいたものだ'], 2,
        '"{今|いま}{思|おも}えば" + tiếc việc mình đã KHÔNG làm ⇒ **～ておけばよかった** "giá mà đã tìm hiểu trước" (shirabete okeba yokatta) — Bài 35 ⑤. ことだ = lời khuyên cho người khác; ものだ = hồi tưởng thói quen (mà thực tế cô ấy KHÔNG tìm hiểu).'),
      Q('[58]', ['に{対|たい}して', 'にとって', 'として', 'によって'], 1,
        'Đánh giá "quan trọng" từ GÓC NHÌN của tôi ⇒ **N＋にとって** (watashi ni totte, taisetsu na keiken) — Bài 30 ⑥. に{対|たい}して = hướng tới đối tượng (thái độ, hành động); として = với tư cách (vai trò); によって = tuỳ theo / bởi — Bảng phân biệt Bài 30 ⑧.'),
    ]),

    /* ── 読解 ── */
    { t: 'h', text: 'もんだい4 つぎの(1)から(4)の{文章|ぶんしょう}を{読|よ}んで、{質問|しつもん}に{答|こた}えなさい。{答|こた}えは、1・2・3・4から{最|もっと}もよいものを{一|ひと}つえらびなさい。' },
    {
      t: 'passage',
      title: '問題4（1）— {森課長|もりかちょう}からのメール',
      intro: 'Email gửi cho cả phòng kinh doanh của さくらシステム.',
      paras: [
        { text: '{件名|けんめい}：{打|う}ち{合|あ}わせの{日時|にちじ}{変更|へんこう}について' },
        { text: '{営業部|えいぎょうぶ}の{皆|みな}さん　お{疲|つか}れ{様|さま}です。{森|もり}です。' },
        { text: '{明日|あした}10{時|じ}から{予定|よてい}していた{東京商事|とうきょうしょうじ}との{打|う}ち{合|あ}わせですが、{先方|せんぽう}の{都合|つごう}により、{明後日|あさって}（{木曜日|もくようび}）の14{時|じ}からに{変更|へんこう}になりました。{場所|ばしょ}は{同|おな}じ{第二会議室|だいにかいぎしつ}です。' },
        { text: 'なお、{資料|しりょう}は{前回|ぜんかい}のものを{使|つか}いますので、{新|あたら}しく{作|つく}る{必要|ひつよう}はありません。ただし、{資料|しりょう}の{中|なか}のグラフは、{最新|さいしん}の{数字|すうじ}に{直|なお}しておいてください。' },
      ],
    },
    MCQ('b40-d1-tanbun-1', '問題4（59）', [
      Q('（59）このメールを{読|よ}んだ{人|ひと}は、{何|なに}をしなければなりませんか。', [
        '{明日|あした}の10{時|じ}までに、{新|あたら}しい{資料|しりょう}を{作|つく}る',
        '{木曜日|もくようび}の{打|う}ち{合|あ}わせまでに、{資料|しりょう}のグラフを{直|なお}す',
        '{第二会議室|だいにかいぎしつ}を、{明後日|あさって}の14{時|じ}に{予約|よやく}する',
        '{東京商事|とうきょうしょうじ}に、{打|う}ち{合|あ}わせの{日時|にちじ}を{連絡|れんらく}する',
      ], 1,
        'Hai từ nối quyết định (Bài 38 ⑦): **なお** — tài liệu dùng bản cũ, **không cần làm mới** (loại 1); **ただし** — nhưng biểu đồ phải **sửa theo số mới nhất** ⇒ đáp án 2. Phòng họp "{同|おな}じ" (không cần đặt), và chính đối tác đổi lịch nên không cần báo họ.'),
    ]),
    {
      t: 'passage',
      title: '問題4（2）— {図書館|としょかん}のお{知|し}らせ',
      intro: 'Thông báo dán ở cửa thư viện trường.',
      paras: [
        { text: 'みなと{大学|だいがく}{図書館|としょかん}からのお{知|し}らせ' },
        { text: '{館内|かんない}{工事|こうじ}のため、7{月|がつ}20{日|か}（{月|げつ}）から26{日|にち}（{日|にち}）まで、2{階|かい}の{自習室|じしゅうしつ}は{使|つか}えません。1{階|かい}の{席|せき}と{本|ほん}の{貸|か}し{出|だ}しは、いつも{通|どお}り{利用|りよう}できます。' },
        { text: 'また、この{期間|きかん}に{借|か}りた{本|ほん}の{返却|へんきゃく}{期限|きげん}は、{通常|つうじょう}より{一週間|いっしゅうかん}{長|なが}い3{週間|しゅうかん}となります。なお、{工事|こうじ}の{期間|きかん}{中|ちゅう}も、{本|ほん}の{返却|へんきゃく}は{入|い}り{口|ぐち}の{返却|へんきゃく}ポストで24{時間|じかん}{受|う}け{付|つ}けます。' },
      ],
    },
    MCQ('b40-d1-tanbun-2', '問題4（60）', [
      Q('（60）このお{知|し}らせから{分|わ}かることは{何|なん}ですか。', [
        '7{月|がつ}20{日|か}から26{日|にち}まで、{図書館|としょかん}は{閉館|へいかん}する',
        '{工事|こうじ}の{間|あいだ}は、{本|ほん}を{借|か}りることができない',
        '{工事|こうじ}の{間|あいだ}に{借|か}りた{本|ほん}は、3{週間|しゅうかん}{借|か}りていられる',
        '{工事|こうじ}の{間|あいだ}は、{本|ほん}を{返|かえ}すことができない',
      ], 2,
        'Chỉ phòng tự học tầng 2 đóng; **ghế tầng 1 và mượn sách vẫn như thường** (loại 1, 2); trả sách vẫn nhận 24 giờ ở hòm trả (loại 4). Câu then chốt: **この{期間|きかん}に{借|か}りた{本|ほん}の{返却|へんきゃく}{期限|きげん}は…3{週間|しゅうかん}** ⇒ đáp án 3 (nói lại bằng từ khác: {返却|へんきゃく}{期限|きげん} 3 tuần = mượn được 3 tuần). {返却|へんきゃく} — Bài 38/39.'),
    ]),
    {
      t: 'passage',
      title: '問題4（3）— マリヤムさんのメモ',
      intro: 'Tờ ghi chú dán ở cửa phòng ダニエル (ký túc xá).',
      paras: [
        { text: 'ダニエルさんへ' },
        { text: '{今朝|けさ}、ダニエルさん{宛|あ}ての{荷物|にもつ}が{届|とど}いたので、{管理人室|かんりにんしつ}で{預|あず}かってもらっています。{管理人|かんりにん}さんは{夕方|ゆうがた}6{時|じ}までいるそうです。' },
        { text: 'それから、{明日|あした}の{交流会|こうりゅうかい}の{飲|の}み{物|もの}ですが、{私|わたし}がまとめて{買|か}っておくので、ダニエルさんは{紙|かみ}コップだけ{持|も}ってきてください。　マリヤム' },
      ],
    },
    MCQ('b40-d1-tanbun-3', '問題4（61）', [
      Q('（61）このメモを{読|よ}んで、ダニエルさんがしなければならないことは{何|なん}ですか。', [
        '6{時|じ}までに{管理人室|かんりにんしつ}へ{荷物|にもつ}を{取|と}りに{行|い}き、{明日|あした}は{紙|かみ}コップを{持|も}っていく',
        '{管理人室|かんりにんしつ}に{荷物|にもつ}を{預|あず}けて、{明日|あした}は{飲|の}み{物|もの}を{買|か}っていく',
        'マリヤムさんに{荷物|にもつ}を{渡|わた}して、{紙|かみ}コップを{買|か}う',
        '6{時|じ}までに{飲|の}み{物|もの}を{買|か}って、{管理人室|かんりにんしつ}に{届|とど}ける',
      ], 0,
        'Đồ của ダニエル đang được quản lý **{預|あず}かって**(giữ hộ — Bài 30) và quản lý chỉ có mặt **đến 6 giờ** ⇒ phải đến lấy trước 6 giờ. Đồ uống thì マリヤム **{買|か}っておく** (Bài 18) ⇒ ダニエル chỉ mang **{紙|かみ}コップだけ**. Đáp án 2 nhầm {預|あず}ける ↔ {預|あず}かる.'),
    ]),
    {
      t: 'passage',
      title: '問題4（4）— {新聞|しんぶん}の{投書|とうしょ}',
      intro: 'Một đoạn ý kiến bạn đọc gửi báo.',
      paras: [
        { text: 'わからない{言葉|ことば}があると、すぐにスマートフォンで{調|しら}べる{人|ひと}が{多|おお}い。{確|たし}かに{便利|べんり}だが、すぐに{調|しら}べたことは、すぐに{忘|わす}れてしまいがちだ。{私|わたし}は、{調|しら}べる{前|まえ}に、まず{前後|ぜんご}の{文|ぶん}から{意味|いみ}を{想像|そうぞう}してみることにしている。{想像|そうぞう}が{当|あ}たっていても{外|はず}れていても、{一度|いちど}{自分|じぶん}で{考|かんが}えた{言葉|ことば}は、{記憶|きおく}に{残|のこ}りやすいからだ。' },
      ],
    },
    MCQ('b40-d1-tanbun-4', '問題4（62）', [
      Q('（62）{筆者|ひっしゃ}が{言|い}いたいことは{何|なに}か。', [
        'わからない{言葉|ことば}は、スマートフォンで{調|しら}べないほうがいい',
        'スマートフォンで{調|しら}べた{言葉|ことば}は、{意味|いみ}が{正|ただ}しくないことが{多|おお}い',
        '{前後|ぜんご}の{文|ぶん}を{読|よ}めば、{言葉|ことば}の{意味|いみ}は{必|かなら}ずわかる',
        '{言葉|ことば}の{意味|いみ}を{調|しら}べる{前|まえ}に、{自分|じぶん}で{考|かんが}えてみるとよい',
      ], 3,
        'Cấu trúc ý kiến (Bài 38 ⑩⑪): **{確|たし}かに{便利|べんり}だが** (thừa nhận ý ngược lại) → ý chính sau だが: **{調|しら}べる{前|まえ}に…{想像|そうぞう}してみる** + lý do **～からだ** ⇒ đáp án 4. Người viết KHÔNG bảo đừng tra (loại 1: quá mạnh); "{当|あ}たっていても{外|はず}れていても" ⇒ đoán có thể sai (loại 3).'),
    ]),

    { t: 'h', text: 'もんだい5 つぎの(1)と(2)の{文章|ぶんしょう}を{読|よ}んで、{質問|しつもん}に{答|こた}えなさい。{答|こた}えは、1・2・3・4から{最|もっと}もよいものを{一|ひと}つえらびなさい。' },
    {
      t: 'passage',
      title: '問題5（1）— 「すみません」という{言葉|ことば}',
      paras: [
        { text: '{日本|にほん}に{来|き}たばかりの{頃|ころ}、{私|わたし}は「すみません」という{言葉|ことば}がよくわからなかった。{店|みせ}で{店員|てんいん}を{呼|よ}ぶときも、{道|みち}を{譲|ゆず}ってもらったときも、プレゼントをもらったときも、{日本人|にほんじん}は「すみません」と{言|い}う。{謝|あやま}る{言葉|ことば}だと{思|おも}っていたので、{悪|わる}いことをしていないのになぜ{謝|あやま}るのか、{不思議|ふしぎ}だった。' },
        { text: 'ある{日|ひ}、ゼミの{先生|せんせい}にそのことを{聞|き}いてみた。{先生|せんせい}によると、「すみません」には「あなたに{手間|てま}をかけさせてしまって{申|もう}し{訳|わけ}ない」という{気持|きも}ちが{含|ふく}まれているそうだ。 **①つまり**、{相手|あいて}がしてくれたことに{対|たい}して、{感謝|かんしゃ}と{申|もう}し{訳|わけ}なさを{同時|どうじ}に{伝|つた}える{言葉|ことば}なのだ。そう{聞|き}いて、{私|わたし}はなるほどと{思|おも}った。' },
        { text: 'しかし、{使|つか}いすぎには{注意|ちゅうい}が{必要|ひつよう}だとも{先生|せんせい}はおっしゃった。うれしいことをしてもらったときは、「すみません」より「ありがとうございます」のほうが、{相手|あいて}の{気持|きも}ちも{明|あか}るくなる、というのだ。それ{以来|いらい}、{私|わたし}は{感謝|かんしゃ}の{気持|きも}ちが{強|つよ}いときには、「ありがとう」と{言|い}うようにしている。' },
      ],
    },
    MCQ('b40-d1-chuubun-1', '問題5（1）（63〜65）', [
      Q('（63）{筆者|ひっしゃ}が{日本|にほん}に{来|き}たばかりの{頃|ころ}、{不思議|ふしぎ}に{思|おも}ったことは{何|なに}か。', [
        '{店員|てんいん}を{呼|よ}ぶとき、{日本人|にほんじん}が{大|おお}きな{声|こえ}を{出|だ}すこと',
        'プレゼントをもらっても、{日本人|にほんじん}がお{礼|れい}を{言|い}わないこと',
        '{悪|わる}いことをしていないのに、{日本人|にほんじん}が「すみません」と{言|い}うこと',
        '{日本人|にほんじん}が「ありがとう」をほとんど{使|つか}わないこと',
      ], 2,
        'Câu then chốt đoạn 1: **{悪|わる}いことをしていないのになぜ{謝|あやま}るのか、{不思議|ふしぎ}だった** ⇒ đáp án 3 (のに — Bài 19). Bài không nói người Nhật "không cảm ơn" hay "ít dùng ありがとう" — đó là suy diễn quá đà.'),
      Q('（64）「①つまり」の{後|あと}で、{筆者|ひっしゃ}は「すみません」をどんな{言葉|ことば}だと{説明|せつめい}しているか。', [
        '{相手|あいて}に{感謝|かんしゃ}しながら、{手間|てま}をかけさせたことを{申|もう}し{訳|わけ}なく{思|おも}う{気持|きも}ちを{伝|つた}える{言葉|ことば}',
        '{悪|わる}いことをしたときだけに{使|つか}う、{謝|あやま}るための{言葉|ことば}',
        '{店|みせ}で{店員|てんいん}を{呼|よ}ぶときにしか{使|つか}わない{言葉|ことば}',
        '{相手|あいて}の{気持|きも}ちを{明|あか}るくするために{使|つか}う{言葉|ことば}',
      ], 0,
        '**つまり** = nói lại ý vừa rồi bằng lời khác (Bài 38 ⑤) ⇒ câu sau つまり: **{感謝|かんしゃ}と{申|もう}し{訳|わけ}なさを{同時|どうじ}に{伝|つた}える{言葉|ことば}** ⇒ đáp án 1 (diễn đạt lại: ～ながら = {同時|どうじ}に). Đáp án 4 là tác dụng của ありがとう ở đoạn 3.'),
      Q('（65）{先生|せんせい}によると、どんなときに「ありがとうございます」と{言|い}うほうがいいか。', [
        '{相手|あいて}に{迷惑|めいわく}をかけてしまったとき',
        '{店|みせ}で{店員|てんいん}を{呼|よ}ぶとき',
        '{相手|あいて}の{話|はなし}がよくわからなかったとき',
        'うれしいことをしてもらったとき',
      ], 3,
        'Đoạn 3: **うれしいことをしてもらったときは、「すみません」より「ありがとうございます」のほうが…** ⇒ đáp án 4. "～というのだ" = (thầy) nói rằng… — truyền lại lời người khác (ôn Bài 30).'),
    ]),
    {
      t: 'passage',
      title: '問題5（2）— ワンさんの{実習|じっしゅう}レポートから',
      paras: [
        { text: 'インターンシップの{二日目|ふつかめ}、{私|わたし}は{大|おお}きな{失敗|しっぱい}をした。{課長|かちょう}に{頼|たの}まれた{資料|しりょう}のコピーを、{部数|ぶすう}を{間違|まちが}えて{二十部|にじゅうぶ}も{多|おお}く{作|つく}ってしまったのだ。すぐに{言|い}わなければと{思|おも}ったが、{叱|しか}られるのが{怖|こわ}くて、{言|い}い{出|だ}せなかった。 **①その{日|ひ}の{午後|ごご}**、{資料|しりょう}が{多|おお}すぎることに{気|き}づいた{先輩|せんぱい}の{鈴木|すずき}さんが、{課長|かちょう}に{報告|ほうこく}してくれた。' },
        { text: '{夕方|ゆうがた}、{課長|かちょう}に{呼|よ}ばれた。{叱|しか}られると{思|おも}っていたが、{課長|かちょう}は「{失敗|しっぱい}は{誰|だれ}にでもある。でも、{黙|だま}っていると、{小|ちい}さな{問題|もんだい}が{大|おお}きな{問題|もんだい}になってしまうんだ」と{静|しず}かに{言|い}った。{紙|かみ}を{無駄|むだ}にしたことより、すぐに{報告|ほうこく}しなかったことのほうが{問題|もんだい}だったのだ。' },
        { text: 'この{経験|けいけん}から、{私|わたし}は **②「{報連相|ほうれんそう}」の{本当|ほんとう}の{意味|いみ}** を{学|まな}んだ。{報告|ほうこく}は、うまくいったときにするものだと{思|おも}っていた。しかし{本当|ほんとう}は、うまくいかなかったときに{早|はや}く{報告|ほうこく}することが、いちばん{大切|たいせつ}なのだ。' },
      ],
    },
    MCQ('b40-d1-chuubun-2', '問題5（2）（66〜68）', [
      Q('（66）「①その{日|ひ}の{午後|ごご}」、{何|なに}があったか。', [
        'ワンさんが、{自分|じぶん}の{失敗|しっぱい}を{課長|かちょう}に{話|はな}した',
        '{鈴木|すずき}さんが、{資料|しりょう}が{多|おお}すぎることに{気|き}づいて、{課長|かちょう}に{伝|つた}えた',
        '{課長|かちょう}が、ワンさんに{資料|しりょう}のコピーを{頼|たの}んだ',
        '{鈴木|すずき}さんが、{多|おお}すぎた{資料|しりょう}を{全部|ぜんぶ}{片付|かたづ}けた',
      ], 1,
        'Câu ngay sau ①: **{気|き}づいた{先輩|せんぱい}の{鈴木|すずき}さんが、{課長|かちょう}に{報告|ほうこく}してくれた** (～てくれた — Bài 18) ⇒ đáp án 2. ワン **{言|い}い{出|だ}せなかった** (không dám nói) ⇒ loại 1; việc nhờ photo là chuyện buổi sáng.'),
      Q('（67）{課長|かちょう}が{一番|いちばん}{問題|もんだい}だと{考|かんが}えたことは{何|なに}か。', [
        '{紙|かみ}を{無駄|むだ}にしたこと',
        'コピーの{部数|ぶすう}を{間違|まちが}えたこと',
        '{鈴木|すずき}さんに{迷惑|めいわく}をかけたこと',
        '{失敗|しっぱい}をすぐに{報告|ほうこく}しなかったこと',
      ], 3,
        'So sánh **A より B のほうが** (N4): **{紙|かみ}を{無駄|むだ}にしたことより、すぐに{報告|ほうこく}しなかったことのほうが{問題|もんだい}だった** ⇒ đáp án 4. "{失敗|しっぱい}は{誰|だれ}にでもある" ⇒ bản thân lỗi đếm sai không phải điều chính (loại 2).'),
      Q('（68）{筆者|ひっしゃ}が{学|まな}んだ「②「{報連相|ほうれんそう}」の{本当|ほんとう}の{意味|いみ}」とはどんなことか。', [
        'うまくいかなかったときほど、{早|はや}く{報告|ほうこく}しなければならないこと',
        '{報告|ほうこく}は、{仕事|しごと}がうまくいったときにするものだということ',
        '{失敗|しっぱい}しないように、いつも{先輩|せんぱい}に{相談|そうだん}すること',
        '{叱|しか}られないように、{失敗|しっぱい}を{隠|かく}しておくこと',
      ], 0,
        'Hai câu cuối: suy nghĩ CŨ (**うまくいったときにするものだと{思|おも}っていた** — loại 2) **しかし{本当|ほんとう}は** ⇒ ý MỚI: **うまくいかなかったときに{早|はや}く{報告|ほうこく}すること** ⇒ đáp án 1. Bẫy kinh điển: đáp án lặp lại đúng suy nghĩ cũ trước しかし. ({報連相|ほうれんそう} — Bài 35/37.)'),
    ]),

    { t: 'h', text: 'もんだい6 つぎの{文章|ぶんしょう}を{読|よ}んで、{質問|しつもん}に{答|こた}えなさい。{答|こた}えは、1・2・3・4から{最|もっと}もよいものを{一|ひと}つえらびなさい。' },
    {
      t: 'passage',
      title: '問題6 内容理解（長文）— {本屋|ほんや}がなくなった{町|まち}で',
      intro: 'Bài bình luận ~800 chữ. Đọc 4 câu hỏi trước, đánh dấu ① ② trong bài.',
      paras: [
        { text: '{私|わたし}の{住|す}む{町|まち}から、{最後|さいご}の{本屋|ほんや}がなくなった。{駅前|えきまえ}で{五十年|ごじゅうねん}{続|つづ}いた{店|みせ}で、{子|こ}どもの{頃|ころ}から{何度|なんど}も{通|かよ}った{場所|ばしょ}だった。' },
        { text: '{本屋|ほんや}が{減|へ}っているのは、{私|わたし}の{町|まち}だけではない。ある{調査|ちょうさ}によると、{全国|ぜんこく}の{本屋|ほんや}の{数|かず}は、この{二十年|にじゅうねん}でおよそ{半分|はんぶん}になったという。インターネットで{本|ほん}が{簡単|かんたん}に{買|か}えるようになったことや、{紙|かみ}の{本|ほん}ではなく{電子書籍|でんししょせき}で{読|よ}む{人|ひと}が{増|ふ}えたことが、{主|おも}な{原因|げんいん}だと{考|かんが}えられている。' },
        { text: '{確|たし}かに、インターネットは{便利|べんり}だ。{読|よ}みたい{本|ほん}の{名前|なまえ}を{入|い}れれば、{次|つぎ}の{日|ひ}には{家|いえ}に{届|とど}く。{私|わたし}もよく{利用|りよう}している。しかし、{閉店|へいてん}の{前|まえ}の{日|ひ}、 **①{久|ひさ}しぶりにその{本屋|ほんや}に{行|い}ってみて**、{気|き}づいたことがある。' },
        { text: 'その{日|ひ}、{私|わたし}は{料理|りょうり}の{本|ほん}を{買|か}うつもりで{店|みせ}に{入|はい}った。ところが、{棚|たな}の{間|あいだ}を{歩|ある}いているうちに、{旅行|りょこう}の{本|ほん}や、{昔|むかし}の{町|まち}の{写真|しゃしん}を{集|あつ}めた{本|ほん}が、{次々|つぎつぎ}に{目|め}に{入|はい}ってきた。{結局|けっきょく}、{私|わたし}は{料理|りょうり}の{本|ほん}と{一緒|いっしょ}に、{買|か}う{予定|よてい}のなかった{本|ほん}を{三冊|さんさつ}も{買|か}ってしまった。インターネットでは、{自分|じぶん}が{探|さが}している{本|ほん}しか{見|み}つからない。 **②{本屋|ほんや}では、{探|さが}していなかった{本|ほん}に{出会|であ}うことができるのだ。**' },
        { text: 'もちろん、{本屋|ほんや}だけが{特別|とくべつ}だと{言|い}いたいわけではない。{図書館|としょかん}にも、{同|おな}じような{出会|であ}いはあるだろう。{大切|たいせつ}なのは、{自分|じぶん}の「{好|す}き」の{外|そと}にあるものに{触|ふ}れる{機会|きかい}を、{生活|せいかつ}の{中|なか}に{残|のこ}しておくことではないだろうか。{便利|べんり}さだけを{求|もと}めていると、そうした{機会|きかい}は、{知|し}らないうちに{少|すく}なくなっていく{一方|いっぽう}だ。' },
        { text: '{最後|さいご}の{本屋|ほんや}がなくなった{今|いま}、{私|わたし}は{週|しゅう}に{一度|いちど}、{図書館|としょかん}の{棚|たな}の{間|あいだ}をゆっくり{歩|ある}くことにしている。' },
      ],
    },
    MCQ('b40-d1-choubun', '問題6（69〜72）', [
      Q('（69）{本屋|ほんや}が{減|へ}っている{主|おも}な{原因|げんいん}は{何|なん}だと{考|かんが}えられているか。', [
        'インターネットで{本|ほん}を{買|か}ったり、{電子書籍|でんししょせき}で{読|よ}んだりする{人|ひと}が{増|ふ}えたこと',
        '{町|まち}の{人口|じんこう}が{減|へ}って、{本|ほん}を{読|よ}む{人|ひと}が{少|すく}なくなったこと',
        '{本|ほん}の{値段|ねだん}が{高|たか}くなって、{買|か}う{人|ひと}が{減|へ}ったこと',
        '{図書館|としょかん}が{増|ふ}えて、{本|ほん}を{借|か}りる{人|ひと}が{多|おお}くなったこと',
      ], 0,
        'Đoạn 2: **インターネットで{本|ほん}が{簡単|かんたん}に{買|か}えるようになったことや、…{電子書籍|でんししょせき}で{読|よ}む{人|ひと}が{増|ふ}えたことが、{主|おも}な{原因|げんいん}** ⇒ đáp án 1 (～たり～たり nói lại "～ことや～こと"). ～によると…という (Bài 33 ①) là số liệu của khảo sát, không phải ý người viết.'),
      Q('（70）「①{久|ひさ}しぶりにその{本屋|ほんや}に{行|い}ってみて」とあるが、{本屋|ほんや}で{筆者|ひっしゃ}はどうしたか。', [
        '{料理|りょうり}の{本|ほん}を{探|さが}したが、{見|み}つからなかった',
        '{料理|りょうり}の{本|ほん}だけを{買|か}って、すぐに{帰|かえ}った',
        '{料理|りょうり}の{本|ほん}のほかに、{買|か}う{予定|よてい}のなかった{本|ほん}も{買|か}った',
        '{旅行|りょこう}の{本|ほん}を{買|か}うつもりだったが、{料理|りょうり}の{本|ほん}を{買|か}った',
      ], 2,
        'Đoạn 4: **{料理|りょうり}の{本|ほん}と{一緒|いっしょ}に、{買|か}う{予定|よてい}のなかった{本|ほん}を{三冊|さんさつ}も{買|か}ってしまった** ⇒ đáp án 3. Đáp án 4 đảo ngược: ý định ban đầu là sách nấu ăn (～つもりで).'),
      Q('（71）「②{本屋|ほんや}では、{探|さが}していなかった{本|ほん}に{出会|であ}うことができる」とあるが、なぜか。', [
        '{本屋|ほんや}の{店員|てんいん}が、おすすめの{本|ほん}を{教|おし}えてくれるから',
        '{棚|たな}の{間|あいだ}を{歩|ある}いていると、{探|さが}していない{本|ほん}も{目|め}に{入|はい}るから',
        '{本屋|ほんや}には、インターネットで{買|か}えない{本|ほん}しかないから',
        '{本屋|ほんや}では、{本|ほん}を{安|やす}く{買|か}うことができるから',
      ], 1,
        'Lý do nằm ngay trước ②: **{棚|たな}の{間|あいだ}を{歩|ある}いているうちに（ôn Bài 26）、{旅行|りょこう}の{本|ほん}や…が{次々|つぎつぎ}に{目|め}に{入|はい}ってきた** + đối chiếu với mạng: **{探|さが}している{本|ほん}しか{見|み}つからない** ⇒ đáp án 2. Bài không hề nhắc nhân viên hay giá sách.'),
      Q('（72）この{文章|ぶんしょう}で{筆者|ひっしゃ}が{最|もっと}も{言|い}いたいことは{何|なに}か。', [
        '{町|まち}から{本屋|ほんや}がなくならないように、{本屋|ほんや}で{本|ほん}を{買|か}うべきだ',
        'インターネットより{図書館|としょかん}で{本|ほん}を{借|か}りるほうが{便利|べんり}だ',
        '{便利|べんり}なインターネットを{使|つか}って、{本|ほん}をたくさん{読|よ}むほうがいい',
        '{自分|じぶん}の「{好|す}き」の{外|そと}にあるものに{出会|であ}う{機会|きかい}を、{生活|せいかつ}の{中|なか}に{残|のこ}しておくことが{大切|たいせつ}だ',
      ], 3,
        'Tín hiệu ý chính (Bài 38 ⑩): **{大切|たいせつ}なのは、～ことではないだろうか** ⇒ đáp án 4. Câu **{本屋|ほんや}だけが{特別|とくべつ}だと{言|い}いたいわけではない** (Bài 31 ⑥) loại 1; người viết vẫn dùng mạng, chỉ cảnh báo "{便利|べんり}さだけを{求|もと}めていると…{少|すく}なくなっていく{一方|いっぽう}だ" (Bài 32 ⑧).'),
    ]),

    { t: 'h', text: 'もんだい7 {右|みぎ}のページは、「みなと{市|し}{国際交流|こくさいこうりゅう}センター」の{日本語教室|にほんごきょうしつ}の{案内|あんない}である。これを{読|よ}んで、{下|した}の{質問|しつもん}に{答|こた}えなさい。{答|こた}えは、1・2・3・4から{最|もっと}もよいものを{一|ひと}つえらびなさい。' },
    {
      t: 'table',
      caption: 'みなと{市|し}{国際交流|こくさいこうりゅう}センター　{日本語|にほんご}ボランティア{教室|きょうしつ}のご{案内|あんない}（10{月|がつ}〜12{月|がつ}）',
      head: ['{教室|きょうしつ}', '{曜日|ようび}・{時間|じかん}', 'レベル', '{内容|ないよう}', '{参加費|さんかひ}', '{申|もう}し{込|こ}み'],
      rows: [
        ['A', '{火曜日|かようび} 18:30〜20:00', '{初級|しょきゅう}', '{会話|かいわ}', '{無料|むりょう}', '{当日|とうじつ}{受付|うけつけ}'],
        ['B', '{水曜日|すいようび} 10:00〜11:30', '{中級|ちゅうきゅう}', '{漢字|かんじ}・{読解|どっかい}', '1{回|かい} 500{円|えん}', '{前|まえ}の{週|しゅう}までに{電話|でんわ}で'],
        ['C', '{土曜日|どようび} 13:00〜15:00', '{中級|ちゅうきゅう}', '{日本語能力試験|にほんごのうりょくしけん}N3{対策|たいさく}', '1{回|かい} 1,000{円|えん}（{教材費|きょうざいひ}を{含|ふく}む）', 'センターの{窓口|まどぐち}で（{定員|ていいん}15{名|めい}・{先着順|せんちゃくじゅん}）'],
        ['D', '{土曜日|どようび} 15:30〜17:00', '{上級|じょうきゅう}', 'ビジネス{日本語|にほんご}（{敬語|けいご}・メール）', '1{回|かい} 1,000{円|えん}', 'メールで（{定員|ていいん}10{名|めい}・{多|おお}い{場合|ばあい}は{抽選|ちゅうせん}）'],
        ['E', '{日曜日|にちようび} 10:00〜12:00', '{中級|ちゅうきゅう}', '{会話|かいわ}・{作文|さくぶん}', '{無料|むりょう}', '{当日|とうじつ}{受付|うけつけ}（{子|こ}ども{連|づ}れでも{参加|さんか}できます）'],
      ],
    },
    {
      t: 'note',
      title: '{注意事項|ちゅういじこう}（ご{案内|あんない}の{下|した}の{注意書|ちゅういが}き）',
      items: [
        '{参加|さんか}できるのは、みなと{市|し}に{住|す}んでいる{方|かた}、または{市内|しない}の{学校|がっこう}・{会社|かいしゃ}に{通|かよ}っている{方|かた}です。',
        '{祝日|しゅくじつ}はお{休|やす}みです。{参加費|さんかひ}は{毎回|まいかい}、{教室|きょうしつ}で{払|はら}ってください。',
      ],
    },
    MCQ('b40-d1-jouhou', '問題7 情報検索（73〜74）', [
      Q('（73）ダニエルさんは、みなと{大学|だいがく}の{留学生|りゅうがくせい}で、{来月|らいげつ}N3を{受|う}ける。{平日|へいじつ}は{毎日|まいにち}{夕方|ゆうがた}6{時|じ}まで{授業|じゅぎょう}があり、{日曜日|にちようび}はアルバイトがある。{試験|しけん}のための{勉強|べんきょう}ができる{教室|きょうしつ}に{参加|さんか}したい。ダニエルさんはどの{教室|きょうしつ}に、どうやって{申|もう}し{込|こ}むか。', [
        'Bの{教室|きょうしつ}に、{前|まえ}の{週|しゅう}までに{電話|でんわ}で{申|もう}し{込|こ}む',
        'Cの{教室|きょうしつ}に、センターの{窓口|まどぐち}で{申|もう}し{込|こ}む',
        'Dの{教室|きょうしつ}に、メールで{申|もう}し{込|こ}む',
        'Eの{教室|きょうしつ}に、{当日|とうじつ}{行|い}って{申|もう}し{込|こ}む',
      ], 1,
        'Lọc điều kiện: "để thi" ⇒ chỉ **C (N3{対策|たいさく})**; còn kiểm giờ: thứ Bảy chiều — ダニエル không có lớp, không đi làm (chỉ làm Chủ nhật) ⇒ hợp. Cách đăng ký của C: **センターの{窓口|まどぐち}で** ⇒ đáp án 2. Sinh viên trường trong thành phố ⇒ đủ điều kiện ({市内|しない}の{学校|がっこう}に{通|かよ}っている).'),
      Q('（74）ワンさんは{隣|となり}の{市|し}に{住|す}んでいて、みなと{市|し}にあるさくらシステムで{働|はたら}いている。{仕事|しごと}で{使|つか}う{敬語|けいご}とメールを{勉強|べんきょう}したい。ワンさんについて{正|ただ}しいものはどれか。', [
        'みなと{市|し}に{住|す}んでいないので、{参加|さんか}できない',
        '{申|もう}し{込|こ}めば、{必|かなら}ず{参加|さんか}できる',
        '4{回|かい}{参加|さんか}すると、{参加費|さんかひ}は{全部|ぜんぶ}で4,000{円|えん}になる',
        '{当日|とうじつ}、センターに{行|い}けば{参加|さんか}できる',
      ], 2,
        'Lớp hợp: **D (ビジネス日本語)**. Điều kiện: làm việc ở công ty trong thành phố ⇒ **được** tham gia (loại 1 — bẫy "không sống ở thành phố"). D đăng ký qua mail, **đông thì bốc thăm** ({抽選|ちゅうせん} — Bài 38) ⇒ không chắc chắn (loại 2), không nhận tại chỗ (loại 4). 1.000 yên × 4 = **4.000 yên** ⇒ đáp án 3.'),
    ]),
    {
      t: 'note',
      title: 'Xong phần ② — ghi điểm',
      items: [
        '文法: 問題1 __/13 · 問題2 __/5 · 問題3 __/5 ⇒ **文法 __/23**. (Cộng với 文字・語彙 __/35 ⇒ **言語知識 __/58**.)',
        '読解: 問題4 __/4 · 問題5 __/6 · 問題6 __/4 · 問題7 __/2 ⇒ **読解 __/16**.',
        'Hết giờ mà chưa xong? Ghi lại bạn dừng ở câu nào — mục **Bảng điểm** có lời khuyên riêng cho người "đọc không kịp".',
      ],
    },
  ],
};

/* ═══════════════════════════ 4. ĐỀ 1 · 聴解 ═══════════════════════════ */

const DE1_CHOUKAI: Lesson = {
  id: 'b40-thi-thu-3-choukai',
  kind: 'review',
  title: 'Thi thử N3 · Đề 1 · Phần ③ 聴解 — 28 câu, 40 phút (課題理解 6 · ポイント理解 6 · 概要理解 3 · 発話表現 4 · 即時応答 9)',
  goal: 'Làm phần nghe của đề N3 như thi thật — nghe MỘT lần: biết việc phải làm trước tiên giữa nhiều việc bị gạt đi, bắt đúng lý do / điểm được hỏi (kể cả khi lý do khác bị phủ định), nắm ý chính và thái độ của một đoạn nói, chọn câu nói hợp tình huống (kính ngữ công sở, nhờ – đề nghị giúp – xin phép) và đáp nhanh câu nói thường ngày có văn nói rút gọn.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      title: 'Cách làm như thi thật',
      items: [
        'Mỗi bài: bấm 🔊 **MỘT lần**, KHÔNG mở lời thoại, chọn đáp án ngay. Làm hết 28 câu rồi mới mở lời thoại (có romaji + nghĩa) để soát.',
        '問題1 課題理解 (75–80): câu hỏi nói ở ĐẦU và CUỐI bài. Nghe kỹ việc bị gạt: **～てある・～ておいた (xong rồi) · あとでいい・そのあとでいい · ちょっと{待|ま}って · それより・{先|さき}に** (ôn Bài 39 ⑨).',
        '問題2 ポイント理解 (81–86): đọc 4 lựa chọn TRƯỚC (đề thật có ~20 giây), rồi nghe đúng **lý do / điều** được hỏi. Lý do bị phủ định (**～わけじゃない・それもあるけど・それも{違|ちが}う**) gần như luôn là đáp án nhiễu.',
        '問題3 概要理解 (87–89): đề thật KHÔNG in câu hỏi lẫn lựa chọn. Che 4 lựa chọn, nghe xong **tự nói ý chính bằng một câu**, rồi mới nhìn. 問題4–5 (90–102): nghe xong là chọn, không nghĩ lại câu trước.',
      ],
    },

    /* ── 問題1 課題理解 ── */
    { t: 'h', text: 'もんだい1 — 課題理解（75〜80）: もんだい1では、まず{質問|しつもん}を{聞|き}いてください。それから{話|はなし}を{聞|き}いて、{問題用紙|もんだいようし}の1から4の{中|なか}から、{最|もっと}もよいものを{一|ひと}つえらんでください。' },
    NG('b40-d1-ng-75', '（75）{女|おんな}の{学生|がくせい}はこのあとまず{何|なに}をしますか', '問題1 課題理解 — Bài 26 (奨学金・研究室), Bài 33 (用紙), ～たほうがいい, ～ていただく (Bài 24/37).', [
      [NA, 'ja-nu', '{大学|だいがく}の{事務室|じむしつ}で、{女|おんな}の{学生|がくせい}と{事務|じむ}の{人|ひと}が{話|はな}しています。{女|おんな}の{学生|がくせい}はこのあとまず{何|なに}をしますか。', 'Daigaku no jimushitsu de, onna no gakusei to jimu no hito ga hanashite imasu. Onna no gakusei wa kono ato mazu nani o shimasu ka.', 'Ở văn phòng hành chính của trường, một nữ sinh và nhân viên văn phòng đang nói chuyện. Sau đây nữ sinh trước tiên sẽ làm gì?'],
      ['リン', 'ja-nu', 'すみません、{奨学金|しょうがくきん}の{申|もう}し{込|こ}みをしたいんですが。', 'Sumimasen, shougakukin no moushikomi o shitai n desu ga.', 'Xin lỗi, em muốn nộp hồ sơ xin học bổng ạ.'],
      ['{事務|じむ}の{人|ひと}', 'ja-nam', 'はい。{申込書|もうしこみしょ}と{成績証明書|せいせきしょうめいしょ}、それから{先生|せんせい}の{推薦書|すいせんしょ}が{必要|ひつよう}です。{締|し}め{切|き}りは{来週|らいしゅう}の{金曜日|きんようび}です。', 'Hai. Moushikomisho to seiseki shoumeisho, sorekara sensei no suisensho ga hitsuyou desu. Shimekiri wa raishuu no kinyoubi desu.', 'Vâng. Cần đơn đăng ký, giấy chứng nhận kết quả học tập và thư giới thiệu của giảng viên. Hạn chót là thứ Sáu tuần sau.'],
      ['リン', 'ja-nu', '{申込書|もうしこみしょ}はもう{書|か}いてきました。{成績証明書|せいせきしょうめいしょ}はどこでもらえますか。', 'Moushikomisho wa mou kaite kimashita. Seiseki shoumeisho wa doko de moraemasu ka.', 'Đơn thì em viết sẵn mang tới rồi. Giấy chứng nhận kết quả thì em lấy ở đâu ạ?'],
      ['{事務|じむ}の{人|ひと}', 'ja-nam', '{成績証明書|せいせきしょうめいしょ}は、あちらの{機械|きかい}で、{学生証|がくせいしょう}があればすぐ{出|だ}せますよ。ただ、{推薦書|すいせんしょ}は{先生|せんせい}に{書|か}いていただくのに{一週間|いっしゅうかん}ぐらいかかることが{多|おお}いので、そちらを{先|さき}にお{願|ねが}いしたほうがいいですね。', 'Seiseki shoumeisho wa, achira no kikai de, gakuseishou ga areba sugu dasemasu yo. Tada, suisensho wa sensei ni kaite itadaku no ni isshuukan gurai kakaru koto ga ooi node, sochira o saki ni onegai shita hou ga ii desu ne.', 'Giấy chứng nhận thì in ngay ở cái máy đằng kia nếu có thẻ sinh viên. Có điều thư giới thiệu nhờ thầy cô viết thường mất khoảng một tuần, nên em nhờ việc đó trước thì hơn.'],
      ['リン', 'ja-nu', 'そうですか。じゃあ、{証明書|しょうめいしょ}はあとにして、{先|さき}に{先生|せんせい}の{研究室|けんきゅうしつ}に{行|い}ってきます。', 'Sou desu ka. Jaa, shoumeisho wa ato ni shite, saki ni sensei no kenkyuushitsu ni itte kimasu.', 'Vậy ạ. Thế em để giấy chứng nhận sau, đi tới phòng nghiên cứu của thầy cô trước.'],
      ['{事務|じむ}の{人|ひと}', 'ja-nam', 'あ、{先生|せんせい}にお{願|ねが}いするときは、この{用紙|ようし}も{一緒|いっしょ}に{渡|わた}してくださいね。', 'A, sensei ni onegai suru toki wa, kono youshi mo issho ni watashite kudasai ne.', 'À, khi nhờ thầy cô thì đưa kèm tờ mẫu này nhé.'],
      ['リン', 'ja-nu', 'はい、わかりました。', 'Hai, wakarimashita.', 'Vâng, em hiểu rồi.'],
      [NA, 'ja-nu', '{女|おんな}の{学生|がくせい}はこのあとまず{何|なに}をしますか。', 'Onna no gakusei wa kono ato mazu nani o shimasu ka.', 'Sau đây nữ sinh trước tiên sẽ làm gì?'],
    ]),
    MCQ('b40-d1-ng-75-q', '（75）', [
      Q('（75）{女|おんな}の{学生|がくせい}はこのあとまず{何|なに}をしますか。', ['{申込書|もうしこみしょ}を{書|か}く', '{機械|きかい}で{成績証明書|せいせきしょうめいしょ}を{出|だ}す', '{先生|せんせい}に{推薦書|すいせんしょ}を{頼|たの}みに{行|い}く', '{事務室|じむしつ}に{用紙|ようし}を{出|だ}す'], 2,
        'Đơn → **もう{書|か}いてきました** (xong); giấy chứng nhận → **あとにして** (để sau); câu chốt: **{先|さき}に{先生|せんせい}の{研究室|けんきゅうしつ}に{行|い}ってきます** (Saki ni sensei no kenkyuushitsu ni itte kimasu) ⇒ đi nhờ thầy cô viết thư giới thiệu. Tờ mẫu là đưa cho THẦY CÔ, không nộp văn phòng.'),
    ]),
    NG('b40-d1-ng-76', '（76）{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか', '問題1 課題理解 — Bài 18 (～てある・～ておく), Bài 37 (来社・お送りします), Bài 39 (～ところ・ちょっと待って).', [
      [NA, 'ja-nu', '{会社|かいしゃ}で、{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}が{話|はな}しています。{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Kaisha de, otoko no hito to onna no hito ga hanashite imasu. Onna no hito wa kono ato mazu nani o shimasu ka.', 'Ở công ty, một người đàn ông và một người phụ nữ đang nói chuyện. Sau đây người phụ nữ trước tiên sẽ làm gì?'],
      ['{森課長|もりかちょう}', 'ja-nam', 'ワンさん、{明日|あした}の{田村|たむら}さんの{来社|らいしゃ}の{件|けん}だけど、{準備|じゅんび}はどう？', 'Wan-san, ashita no Tamura-san no raisha no ken da kedo, junbi wa dou?', 'Wan này, chuyện anh Tamura đến công ty mai ấy, chuẩn bị tới đâu rồi?'],
      ['ワン', 'ja-nu', 'はい、{会議室|かいぎしつ}は{予約|よやく}してあります。お{茶|ちゃ}も{用意|ようい}しておきます。', 'Hai, kaigishitsu wa yoyaku shite arimasu. Ocha mo youi shite okimasu.', 'Vâng, phòng họp em đã đặt sẵn. Trà em cũng sẽ chuẩn bị sẵn ạ.'],
      ['{森課長|もりかちょう}', 'ja-nam', 'ありがとう。{資料|しりょう}は？', 'Arigatou. Shiryou wa?', 'Cảm ơn. Còn tài liệu?'],
      ['ワン', 'ja-nu', '{今|いま}から{印刷|いんさつ}しようと{思|おも}っていたところです。', 'Ima kara insatsu shiyou to omotte ita tokoro desu.', 'Em đang định in ngay bây giờ ạ.'],
      ['{森課長|もりかちょう}', 'ja-nam', 'あ、{印刷|いんさつ}はちょっと{待|ま}って。さっき{田村|たむら}さんから、{少|すこ}し{直|なお}してほしいってメールが{来|き}たんだ。{先|さき}に{僕|ぼく}が{直|なお}すから。', 'A, insatsu wa chotto matte. Sakki Tamura-san kara, sukoshi naoshite hoshii tte meeru ga kita n da. Saki ni boku ga naosu kara.', 'À, khoan in đã. Lúc nãy anh Tamura gửi mail bảo muốn sửa một chút. Anh sẽ sửa trước.'],
      ['ワン', 'ja-nu', 'わかりました。では、その{間|あいだ}に{何|なに}かすることはありますか。', 'Wakarimashita. Dewa, sono aida ni nani ka suru koto wa arimasu ka.', 'Em hiểu rồi. Vậy trong lúc đó em có việc gì làm không ạ?'],
      ['{森課長|もりかちょう}', 'ja-nam', 'そうだなあ……{田村|たむら}さん、うちに{来|く}るのは{初|はじ}めてだから、{駅|えき}からの{地図|ちず}をメールで{送|おく}っておいてくれる？ それを{先|さき}にお{願|ねが}い。', 'Sou da naa…… Tamura-san, uchi ni kuru no wa hajimete da kara, eki kara no chizu o meeru de okutte oite kureru? Sore o saki ni onegai.', 'Để xem… Anh Tamura lần đầu đến công ty mình, nên em gửi trước bản đồ từ ga qua mail giúp anh nhé. Làm việc đó trước nhé.'],
      ['ワン', 'ja-nu', 'はい、すぐお{送|おく}りします。', 'Hai, sugu ookuri shimasu.', 'Vâng, em gửi ngay ạ.'],
      [NA, 'ja-nu', '{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Onna no hito wa kono ato mazu nani o shimasu ka.', 'Sau đây người phụ nữ trước tiên sẽ làm gì?'],
    ]),
    MCQ('b40-d1-ng-76-q', '（76）', [
      Q('（76）{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', ['{会議室|かいぎしつ}を{予約|よやく}する', '{資料|しりょう}を{印刷|いんさつ}する', '{資料|しりょう}を{直|なお}す', '{田村|たむら}さんに{地図|ちず}を{送|おく}る'], 3,
        'Phòng họp → **{予約|よやく}してあります** (xong — Bài 18); in → **ちょっと{待|ま}って**; sửa tài liệu → **{僕|ぼく}が{直|なお}す** (người KHÁC làm); câu chốt: **{地図|ちず}をメールで{送|おく}っておいてくれる？ それを{先|さき}にお{願|ねが}い** ⇒ gửi bản đồ.'),
    ]),
    NG('b40-d1-ng-77', '（77）{留学生|りゅうがくせい}はこのあとまず{何|なに}をしますか', '問題1 課題理解 — Bài 39 (駐輪・申請), ～てある (Bài 18), ～ないと～ない, そのあとでいい.', [
      [NA, 'ja-nu', '{寮|りょう}で、{男|おとこ}の{留学生|りゅうがくせい}と{管理人|かんりにん}さんが{話|はな}しています。{留学生|りゅうがくせい}はこのあとまず{何|なに}をしますか。', 'Ryou de, otoko no ryuugakusei to kanrinin-san ga hanashite imasu. Ryuugakusei wa kono ato mazu nani o shimasu ka.', 'Ở ký túc xá, một nam du học sinh và bác quản lý đang nói chuyện. Sau đây du học sinh trước tiên sẽ làm gì?'],
      ['ダニエル', 'ja-nam', 'すみません、{自転車|じてんしゃ}を{寮|りょう}の{駐輪場|ちゅうりんじょう}に{置|お}きたいんですが。', 'Sumimasen, jitensha o ryou no chuurinjou ni okitai n desu ga.', 'Xin lỗi, cháu muốn để xe đạp ở bãi xe của ký túc xá ạ.'],
      ['{管理人|かんりにん}さん', 'ja-nam', 'じゃあ、このシールを{自転車|じてんしゃ}に{貼|は}ってもらいます。その{前|まえ}に、この{申請書|しんせいしょ}に{名前|なまえ}と{部屋|へや}の{番号|ばんごう}を{書|か}いてください。', 'Jaa, kono shiiru o jitensha ni hatte moraimasu. Sono mae ni, kono shinseisho ni namae to heya no bangou o kaite kudasai.', 'Vậy cháu dán miếng tem này lên xe. Trước đó, viết tên và số phòng vào tờ đơn này nhé.'],
      ['ダニエル', 'ja-nam', 'はい。', 'Hai.', 'Vâng.'],
      ['{管理人|かんりにん}さん', 'ja-nam', 'それから、{自転車|じてんしゃ}の{登録|とうろく}はしてありますか。{日本|にほん}では、{自転車|じてんしゃ}を{買|か}うとき、{店|みせ}で{登録|とうろく}するんですが。', 'Sorekara, jitensha no touroku wa shite arimasu ka. Nihon de wa, jitensha o kau toki, mise de touroku suru n desu ga.', 'À còn nữa, xe đã đăng ký chưa? Ở Nhật, khi mua xe đạp người ta đăng ký luôn ở cửa hàng.'],
      ['ダニエル', 'ja-nam', 'あ、まだです。{先輩|せんぱい}からもらった{自転車|じてんしゃ}なので。', 'A, mada desu. Senpai kara moratta jitensha na node.', 'À, chưa ạ. Xe này cháu được anh khoá trên cho.'],
      ['{管理人|かんりにん}さん', 'ja-nam', 'そうですか。{登録|とうろく}がないと、シールは{渡|わた}せないんですよ。{駅前|えきまえ}の{自転車屋|じてんしゃや}でできますから、{先|さき}にそちらに{行|い}ってください。{申請書|しんせいしょ}は、そのあとでいいですよ。', 'Sou desu ka. Touroku ga nai to, shiiru wa watasemasen n desu yo. Ekimae no jitenshaya de dekimasu kara, saki ni sochira ni itte kudasai. Shinseisho wa, sono ato de ii desu yo.', 'Vậy à. Chưa đăng ký thì bác không đưa tem được đâu. Ở tiệm xe đạp trước ga làm được, cháu đi đến đó trước đi. Tờ đơn thì để sau cũng được.'],
      ['ダニエル', 'ja-nam', 'わかりました。じゃ、{今|いま}から{行|い}ってきます。', 'Wakarimashita. Ja, ima kara itte kimasu.', 'Cháu hiểu rồi. Vậy cháu đi ngay bây giờ.'],
      [NA, 'ja-nu', '{留学生|りゅうがくせい}はこのあとまず{何|なに}をしますか。', 'Ryuugakusei wa kono ato mazu nani o shimasu ka.', 'Sau đây du học sinh trước tiên sẽ làm gì?'],
    ]),
    MCQ('b40-d1-ng-77-q', '（77）', [
      Q('（77）{留学生|りゅうがくせい}はこのあとまず{何|なに}をしますか。', ['{自転車屋|じてんしゃや}で{自転車|じてんしゃ}を{登録|とうろく}する', '{申請書|しんせいしょ}に{名前|なまえ}を{書|か}く', '{自転車|じてんしゃ}にシールを{貼|は}る', '{先輩|せんぱい}に{自転車|じてんしゃ}を{返|かえ}す'], 0,
        'Bẫy thứ tự: lúc đầu bác bảo "その{前|まえ}に、この{申請書|しんせいしょ}に…" (nghe như việc đầu tiên), nhưng sau đó ĐỔI: **{登録|とうろく}がないと、シールは{渡|わた}せない…{先|さき}にそちらに{行|い}ってください。{申請書|しんせいしょ}は、そのあとでいい** ⇒ ra tiệm xe đạp đăng ký trước. (Bài 39 ⑩ — bẫy đổi ý giữa chừng.)'),
    ]),
    NG('b40-d1-ng-78', '（78）{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか', '問題1 課題理解 — Bài 39 (～とく = ～ておく, văn nói), ～たほうが早い, じゃあ～は僕が.', [
      [NA, 'ja-nu', '{食堂|しょくどう}で、{店長|てんちょう}とアルバイトの{女|おんな}の{人|ひと}が{話|はな}しています。{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Shokudou de, tenchou to arubaito no onna no hito ga hanashite imasu. Onna no hito wa kono ato mazu nani o shimasu ka.', 'Ở quán ăn, ông chủ quán và một cô nhân viên làm thêm đang nói chuyện. Sau đây cô ấy trước tiên sẽ làm gì?'],
      ['{小林店長|こばやしてんちょう}', 'ja-nam', 'リンさん、{今日|きょう}は{夜|よる}に{団体|だんたい}の{予約|よやく}が{入|はい}ってるから、{開店|かいてん}{前|まえ}にやることが{多|おお}いよ。', 'Rin-san, kyou wa yoru ni dantai no yoyaku ga haitteru kara, kaiten mae ni yaru koto ga ooi yo.', 'Rin này, tối nay có khách đoàn đặt bàn, nên trước giờ mở cửa nhiều việc lắm đấy.'],
      ['リン', 'ja-nu', 'はい。テーブルを{並|なら}べ{替|か}えましょうか。', 'Hai. Teeburu o narabekaemashou ka.', 'Vâng. Để em kê lại bàn nhé?'],
      ['{小林店長|こばやしてんちょう}', 'ja-nam', 'それは{二人|ふたり}でやったほうが{早|はや}いから、あとで{一緒|いっしょ}にやろう。{先|さき}に{野菜|やさい}を{切|き}っといてくれる？', 'Sore wa futari de yatta hou ga hayai kara, ato de issho ni yarou. Saki ni yasai o kittoite kureru?', 'Việc đó hai người làm nhanh hơn, lát nữa cùng làm. Em thái rau sẵn trước giúp anh nhé?'],
      ['リン', 'ja-nu', 'わかりました。……あ、{店長|てんちょう}、{玉|たま}ねぎがもうほとんどありません。', 'Wakarimashita. ……A, tenchou, tamanegi ga mou hotondo arimasen.', 'Em hiểu rồi. … Ơ, anh ơi, hành tây gần hết rồi.'],
      ['{小林店長|こばやしてんちょう}', 'ja-nam', 'え、ほんと？ じゃあ、{野菜|やさい}は{僕|ぼく}が{切|き}るから、{悪|わる}いけど、{隣|となり}のスーパーで{玉|たま}ねぎ{買|か}ってきてくれる？', 'E, honto? Jaa, yasai wa boku ga kiru kara, warui kedo, tonari no suupaa de tamanegi katte kite kureru?', 'Hả, thật à? Vậy rau để anh thái, phiền em ra siêu thị bên cạnh mua hành tây giúp anh nhé?'],
      ['リン', 'ja-nu', 'はい、すぐ{行|い}ってきます。', 'Hai, sugu itte kimasu.', 'Vâng, em đi ngay.'],
      [NA, 'ja-nu', '{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Onna no hito wa kono ato mazu nani o shimasu ka.', 'Sau đây người phụ nữ trước tiên sẽ làm gì?'],
    ]),
    MCQ('b40-d1-ng-78-q', '（78）', [
      Q('（78）{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', ['{野菜|やさい}を{切|き}る', '{玉|たま}ねぎを{買|か}いに{行|い}く', 'テーブルを{並|なら}べ{替|か}える', '{団体|だんたい}の{予約|よやく}を{確認|かくにん}する'], 1,
        'Kê bàn → **あとで{一緒|いっしょ}にやろう**; thái rau → lúc đầu giao cho リン (**{切|き}っといて** = {切|き}っておいて — Bài 39 ①) nhưng ĐỔI: **{野菜|やさい}は{僕|ぼく}が{切|き}るから** ⇒ リン đi **mua hành tây**. Đáp án 1 là bẫy "việc được giao trước rồi bị chuyển cho người khác".'),
    ]),
    NG('b40-d1-ng-79', '（79）{男|おとこ}の{学生|がくせい}はこのあとまず{何|なに}をしますか', '問題1 課題理解 — Bài 33 (集計・グラフ・流れ・まとめる), ～ているところ, 順番が逆.', [
      [NA, 'ja-nu', '{大学|だいがく}で、{先生|せんせい}と{男|おとこ}の{学生|がくせい}が{話|はな}しています。{男|おとこ}の{学生|がくせい}はこのあとまず{何|なに}をしますか。', 'Daigaku de, sensei to otoko no gakusei ga hanashite imasu. Otoko no gakusei wa kono ato mazu nani o shimasu ka.', 'Ở trường đại học, giảng viên và một nam sinh đang nói chuyện. Sau đây nam sinh trước tiên sẽ làm gì?'],
      ['{佐藤先生|さとうせんせい}', 'ja-nu', 'カルロスさん、{来週|らいしゅう}の{発表|はっぴょう}の{準備|じゅんび}は{進|すす}んでいますか。', 'Karurosu-san, raishuu no happyou no junbi wa susunde imasu ka.', 'Carlos, việc chuẩn bị thuyết trình tuần sau tiến triển tới đâu rồi?'],
      ['カルロス', 'ja-nam', 'はい。アンケートの{集計|しゅうけい}は{終|お}わったので、{今|いま}、グラフを{作|つく}っているところです。', 'Hai. Ankeeto no shuukei wa owatta node, ima, gurafu o tsukutte iru tokoro desu.', 'Vâng. Tổng hợp phiếu khảo sát xong rồi, giờ em đang làm biểu đồ ạ.'],
      ['{佐藤先生|さとうせんせい}', 'ja-nu', 'そうですか。グラフもいいですが、{発表|はっぴょう}の{流|なが}れはもう{決|き}まっていますか。', 'Sou desu ka. Gurafu mo ii desu ga, happyou no nagare wa mou kimatte imasu ka.', 'Vậy à. Biểu đồ cũng tốt, nhưng mạch bài thuyết trình đã định chưa?'],
      ['カルロス', 'ja-nam', 'いえ、まだです。グラフができてから{考|かんが}えようと{思|おも}っていました。', 'Ie, mada desu. Gurafu ga dekite kara kangaeyou to omotte imashita.', 'Dạ chưa. Em định làm xong biểu đồ rồi mới nghĩ.'],
      ['{佐藤先生|さとうせんせい}', 'ja-nu', 'それは{順番|じゅんばん}が{逆|ぎゃく}ですね。{何|なに}をいちばん{伝|つた}えたいかを{先|さき}に{決|き}めないと、どのグラフが{必要|ひつよう}かもわからないでしょう。まず、{発表|はっぴょう}の{流|なが}れを{簡単|かんたん}にまとめて、{私|わたし}に{見|み}せてください。グラフはそのあとで{大丈夫|だいじょうぶ}です。', 'Sore wa junban ga gyaku desu ne. Nani o ichiban tsutaetai ka o saki ni kimenai to, dono gurafu ga hitsuyou ka mo wakaranai deshou. Mazu, happyou no nagare o kantan ni matomete, watashi ni misete kudasai. Gurafu wa sono ato de daijoubu desu.', 'Thế là ngược thứ tự rồi. Không quyết trước điều muốn truyền đạt nhất thì cũng không biết cần biểu đồ nào. Trước hết em tóm tắt mạch thuyết trình rồi cho cô xem. Biểu đồ để sau cũng được.'],
      ['カルロス', 'ja-nam', 'わかりました。{今日|きょう}{中|じゅう}にまとめて、メールでお{送|おく}りします。', 'Wakarimashita. Kyoujuu ni matomete, meeru de ookuri shimasu.', 'Em hiểu rồi. Trong hôm nay em sẽ tóm tắt và gửi cô qua mail.'],
      [NA, 'ja-nu', '{男|おとこ}の{学生|がくせい}はこのあとまず{何|なに}をしますか。', 'Otoko no gakusei wa kono ato mazu nani o shimasu ka.', 'Sau đây nam sinh trước tiên sẽ làm gì?'],
    ]),
    MCQ('b40-d1-ng-79-q', '（79）', [
      Q('（79）{男|おとこ}の{学生|がくせい}はこのあとまず{何|なに}をしますか。', ['アンケートを{集計|しゅうけい}する', 'グラフを{作|つく}る', '{発表|はっぴょう}の{流|なが}れをまとめる', '{発表|はっぴょう}の{練習|れんしゅう}をする'], 2,
        'Tổng hợp → **{終|お}わった**; biểu đồ → đang làm nhưng cô bảo **そのあとで{大丈夫|だいじょうぶ}**; câu chốt có **まず**: **まず、{発表|はっぴょう}の{流|なが}れを{簡単|かんたん}にまとめて** (Mazu, happyou no nagare o kantan ni matomete) ⇒ đáp án 3.'),
    ]),
    NG('b40-d1-ng-80', '（80）{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか', '問題1 課題理解 — Bài 30 (～って, ～なんだって), Bài 39 (満席・～とく), ～たら困る.', [
      [NA, 'ja-nu', '{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}が{映画|えいが}について{話|はな}しています。{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Otoko no hito to onna no hito ga eiga ni tsuite hanashite imasu. Otoko no hito wa kono ato mazu nani o shimasu ka.', 'Một người đàn ông và một người phụ nữ đang nói về phim. Sau đây người đàn ông trước tiên sẽ làm gì?'],
      ['アンナ', 'ja-nu', 'マルコさん、{土曜日|どようび}の{映画|えいが}、チケットもう{買|か}った？', 'Maruko-san, doyoubi no eiga, chiketto mou katta?', 'Marco ơi, vé phim thứ Bảy cậu mua chưa?'],
      ['マルコ', 'ja-nam', 'まだ。{今夜|こんや}ネットで{買|か}おうと{思|おも}って。', 'Mada. Kon-ya netto de kaou to omotte.', 'Chưa. Tớ định tối nay mua trên mạng.'],
      ['アンナ', 'ja-nu', 'あ、それなんだけど、{土曜日|どようび}の{夜|よる}の{回|かい}は、もうすぐ{満席|まんせき}になりそうなんだって。{昼|ひる}の{回|かい}にしない？', 'A, sore na n da kedo, doyoubi no yoru no kai wa, mou sugu manseki ni narisou na n da tte. Hiru no kai ni shinai?', 'À, chuyện đó này, nghe nói suất tối thứ Bảy sắp kín chỗ rồi. Mình chọn suất trưa nhé?'],
      ['マルコ', 'ja-nam', 'いいよ。でも、{昼|ひる}だと、{映画|えいが}の{前|まえ}にご{飯|はん}を{食|た}べる{時間|じかん}がないね。', 'Ii yo. Demo, hiru da to, eiga no mae ni gohan o taberu jikan ga nai ne.', 'Được thôi. Nhưng suất trưa thì không có thời gian ăn trước khi xem nhỉ.'],
      ['アンナ', 'ja-nu', '{映画|えいが}のあとで{食|た}べればいいよ。あのお{店|みせ}は{予約|よやく}しなくても{入|はい}れるし。', 'Eiga no ato de tabereba ii yo. Ano omise wa yoyaku shinakute mo haireru shi.', 'Xem xong rồi ăn là được. Quán đó không đặt trước cũng vào được mà.'],
      ['マルコ', 'ja-nam', 'そうだね。じゃ、{昼|ひる}の{回|かい}のチケット、{今|いま}すぐ{二枚|にまい}{買|か}っとくよ。{席|せき}がなくなったら{困|こま}るし。', 'Sou da ne. Ja, hiru no kai no chiketto, ima sugu nimai kattoku yo. Seki ga nakunattara komaru shi.', 'Ừ nhỉ. Vậy tớ mua sẵn ngay hai vé suất trưa. Hết chỗ thì phiền.'],
      ['アンナ', 'ja-nu', 'ありがとう。お{金|かね}はあとで{払|はら}うね。', 'Arigatou. Okane wa ato de harau ne.', 'Cảm ơn nhé. Tiền thì lát tớ trả.'],
      [NA, 'ja-nu', '{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Otoko no hito wa kono ato mazu nani o shimasu ka.', 'Sau đây người đàn ông trước tiên sẽ làm gì?'],
    ]),
    MCQ('b40-d1-ng-80-q', '（80）', [
      Q('（80）{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか。', ['{夜|よる}の{回|かい}のチケットを{買|か}う', 'レストランを{予約|よやく}する', 'アンナさんにお{金|かね}を{払|はら}う', '{昼|ひる}の{回|かい}のチケットを{買|か}う'], 3,
        'Suất tối → **{満席|まんせき}になりそう** ⇒ đổi sang suất trưa; quán ăn → **{予約|よやく}しなくても{入|はい}れる**; tiền → ANNA trả cho Marco, lại "あとで". Câu chốt: **{昼|ひる}の{回|かい}のチケット、{今|いま}すぐ{二枚|にまい}{買|か}っとく** (～とく = ～ておく).'),
    ]),

    /* ── 問題2 ポイント理解 ── */
    { t: 'h', text: 'もんだい2 — ポイント理解（81〜86）: もんだい2では、まず{質問|しつもん}を{聞|き}いてください。そのあと、{問題用紙|もんだいようし}のせんたくしを{読|よ}んでください。{読|よ}む{時間|じかん}があります。それから{話|はなし}を{聞|き}いて、{最|もっと}もよいものを{一|ひと}つえらんでください。' },
    NG('b40-d1-ng-81', '（81）{女|おんな}の{学生|がくせい}はどうしてアルバイトをやめましたか', '問題2 ポイント理解 — lý do bị phủ định lần lượt (ううん、～は悪くなかった · それも違う) → 実はね (Bài 39 ⑧) → lý do thật.', [
      [NA, 'ja-nu', '{男|おとこ}の{学生|がくせい}と{女|おんな}の{学生|がくせい}が{話|はな}しています。{女|おんな}の{学生|がくせい}はどうしてアルバイトをやめましたか。', 'Otoko no gakusei to onna no gakusei ga hanashite imasu. Onna no gakusei wa doushite arubaito o yamemashita ka.', 'Một nam sinh và một nữ sinh đang nói chuyện. Vì sao nữ sinh đã nghỉ làm thêm?'],
      ['ダニエル', 'ja-nam', 'マリヤムさん、{駅前|えきまえ}のカフェのバイト、やめたんだって？', 'Mariyamu-san, ekimae no kafe no baito, yameta n da tte?', 'Maryam, nghe nói cậu nghỉ làm ở quán cà phê trước ga rồi à?'],
      ['マリヤム', 'ja-nu', 'うん、{先月|せんげつ}でやめたの。', 'Un, sengetsu de yameta no.', 'Ừ, tớ nghỉ từ tháng trước.'],
      ['ダニエル', 'ja-nam', 'どうして？ {時給|じきゅう}が{安|やす}かったとか？', 'Doushite? Jikyuu ga yasukatta toka?', 'Sao thế? Lương giờ thấp hay sao?'],
      ['マリヤム', 'ja-nu', 'ううん、{時給|じきゅう}は{悪|わる}くなかったよ。{店長|てんちょう}もいい{人|ひと}だったし。', 'Uun, jikyuu wa waruku nakatta yo. Tenchou mo ii hito datta shi.', 'Không, lương giờ không tệ đâu. Quản lý cũng là người tốt nữa.'],
      ['ダニエル', 'ja-nam', 'じゃあ、{遠|とお}かったから？', 'Jaa, tookatta kara?', 'Vậy là vì xa à?'],
      ['マリヤム', 'ja-nu', '{自転車|じてんしゃ}で{十分|じゅっぷん}だから、それも{違|ちが}う。{実|じつ}はね、{来年|らいねん}{大学院|だいがくいん}を{受|う}けることにしたの。それで、{夜|よる}は{試験|しけん}の{勉強|べんきょう}に{使|つか}いたくて。', 'Jitensha de juppun da kara, sore mo chigau. Jitsu wa ne, rainen daigakuin o ukeru koto ni shita no. Sorede, yoru wa shiken no benkyou ni tsukaitakute.', 'Đạp xe có mười phút nên cũng không phải. Thật ra, tớ quyết định sang năm thi cao học. Nên buổi tối tớ muốn dành để ôn thi.'],
      ['ダニエル', 'ja-nam', 'そうだったんだ。', 'Sou datta n da.', 'Ra là vậy.'],
      ['マリヤム', 'ja-nu', '{店長|てんちょう}は、{週|しゅう}に{一回|いっかい}だけでも{続|つづ}けていいって{言|い}ってくれたんだけど、どっちも{中途半端|ちゅうとはんぱ}になるのが{嫌|いや}で。', 'Tenchou wa, shuu ni ikkai dake demo tsuzukete ii tte itte kureta n da kedo, dotchi mo chuutohanpa ni naru no ga iya de.', 'Quản lý bảo tuần một buổi thôi cũng được, cứ làm tiếp, nhưng tớ không muốn cả hai đều dở dang.'],
      [NA, 'ja-nu', '{女|おんな}の{学生|がくせい}はどうしてアルバイトをやめましたか。', 'Onna no gakusei wa doushite arubaito o yamemashita ka.', 'Vì sao nữ sinh đã nghỉ làm thêm?'],
    ]),
    MCQ('b40-d1-ng-81-q', '（81）', [
      Q('（81）{女|おんな}の{学生|がくせい}はどうしてアルバイトをやめましたか。', ['{時給|じきゅう}が{安|やす}かったから', '{店|みせ}が{遠|とお}かったから', '{店長|てんちょう}が{厳|きび}しかったから', '{試験|しけん}の{勉強|べんきょう}をしたいから'], 3,
        'Lương → **{悪|わる}くなかった**; quản lý → **いい{人|ひと}**; đường xa → **それも{違|ちが}う**. Sau **{実|じつ}はね** mới là lý do thật: **{夜|よる}は{試験|しけん}の{勉強|べんきょう}に{使|つか}いたくて** (Yoru wa shiken no benkyou ni tsukaitakute). ～ことにした — Bài 21.'),
    ]),
    NG('b40-d1-ng-82', '（82）{会議|かいぎ}はどうして{延期|えんき}になりましたか', '問題2 ポイント理解 — ～って聞いた (Bài 30), ～みたいで, 実は, ～ということになる (Bài 21/30).', [
      [NA, 'ja-nu', '{会社|かいしゃ}で、{女|おんな}の{人|ひと}と{男|おとこ}の{人|ひと}が{話|はな}しています。{会議|かいぎ}はどうして{延期|えんき}になりましたか。', 'Kaisha de, onna no hito to otoko no hito ga hanashite imasu. Kaigi wa doushite enki ni narimashita ka.', 'Ở công ty, một người phụ nữ và một người đàn ông đang nói chuyện. Vì sao cuộc họp bị hoãn?'],
      ['{山口|やまぐち}', 'ja-nu', '{西川|にしかわ}さん、{明日|あした}の{会議|かいぎ}、{延期|えんき}になったんですって？', 'Nishikawa-san, ashita no kaigi, enki ni natta n desu tte?', 'Anh Nishikawa, nghe nói cuộc họp mai bị hoãn à?'],
      ['{西川|にしかわ}', 'ja-nam', 'ええ。{部長|ぶちょう}が{出張|しゅっちょう}だからって{聞|き}いたんですけど、それは{違|ちが}うみたいで。', 'Ee. Buchou ga shucchou da kara tte kiita n desu kedo, sore wa chigau mitai de.', 'Vâng. Tôi nghe bảo là vì trưởng phòng đi công tác, nhưng hình như không phải.'],
      ['{山口|やまぐち}', 'ja-nu', 'え、じゃあ、{何|なん}で？', 'E, jaa, nande?', 'Ơ, thế vì sao?'],
      ['{西川|にしかわ}', 'ja-nam', '{部長|ぶちょう}の{出張|しゅっちょう}は{来週|らいしゅう}からなんです。{実|じつ}は、{取引先|とりひきさき}から{新|あたら}しい{資料|しりょう}が{届|とど}くのが{遅|おく}れていて、それを{見|み}てから{話|はな}し{合|あ}おうということになったんです。', 'Buchou no shucchou wa raishuu kara na n desu. Jitsu wa, torihikisaki kara atarashii shiryou ga todoku no ga okurete ite, sore o mite kara hanashiaou to iu koto ni natta n desu.', 'Trưởng phòng đi công tác từ tuần sau cơ. Thật ra là tài liệu mới từ đối tác gửi đến bị chậm, nên mọi người thống nhất là xem xong rồi mới bàn.'],
      ['{山口|やまぐち}', 'ja-nu', 'そうなんですか。{会議室|かいぎしつ}が{取|と}れなかったのかと{思|おも}いました。', 'Sou na n desu ka. Kaigishitsu ga torenakatta no ka to omoimashita.', 'Thế à. Tôi cứ tưởng là không đặt được phòng họp.'],
      ['{西川|にしかわ}', 'ja-nam', '{会議室|かいぎしつ}は{空|あ}いてたんですよ。', 'Kaigishitsu wa aiteta n desu yo.', 'Phòng họp thì vẫn trống mà.'],
      [NA, 'ja-nu', '{会議|かいぎ}はどうして{延期|えんき}になりましたか。', 'Kaigi wa doushite enki ni narimashita ka.', 'Vì sao cuộc họp bị hoãn?'],
    ]),
    MCQ('b40-d1-ng-82-q', '（82）', [
      Q('（82）{会議|かいぎ}はどうして{延期|えんき}になりましたか。', ['{部長|ぶちょう}が{出張|しゅっちょう}するから', '{取引先|とりひきさき}の{資料|しりょう}がまだ{届|とど}いていないから', '{会議室|かいぎしつ}が{予約|よやく}できなかったから', '{西川|にしかわ}さんの{準備|じゅんび}が{間|ま}に{合|あ}わないから'], 1,
        'Tin đồn "trưởng phòng đi công tác" → **それは{違|ちが}うみたいで**; phòng họp → **{空|あ}いてた**. Sau **{実|じつ}は**: **{取引先|とりひきさき}から{新|あたら}しい{資料|しりょう}が{届|とど}くのが{遅|おく}れていて** ⇒ đáp án 2 (nói lại: "chưa đến").'),
    ]),
    NG('b40-d1-ng-83', '（83）{今日|きょう}、{半額|はんがく}になるものは{何|なん}ですか', '問題2 ポイント理解 — thông báo trong cửa hàng (kính ngữ ございます・いたします, Bài 37), số: 二割引き (Bài 33 ～割), なお (Bài 38).', [
      [NA, 'ja-nu', 'スーパーでアナウンスを{聞|き}いています。{今日|きょう}、{半額|はんがく}になるものは{何|なん}ですか。', 'Suupaa de anaunsu o kiite imasu. Kyou, hangaku ni naru mono wa nan desu ka.', 'Bạn đang nghe thông báo ở siêu thị. Hôm nay thứ gì được giảm nửa giá?'],
      ['{店内|てんない}アナウンス', 'ja-nu', '{本日|ほんじつ}もさくらマートにご{来店|らいてん}いただき、まことにありがとうございます。ただいまより、タイムセールのご{案内|あんない}をいたします。{野菜|やさい}{売|う}り{場|ば}では、すべての{野菜|やさい}を{二割引|にわりび}きいたします。また、パンはすべて{半額|はんがく}となっております。', 'Honjitsu mo Sakura Maato ni goraiten itadaki, makoto ni arigatou gozaimasu. Tadaima yori, taimu seeru no goannai o itashimasu. Yasai uriba de wa, subete no yasai o niwaribiki itashimasu. Mata, pan wa subete hangaku to natte orimasu.', 'Cảm ơn quý khách hôm nay lại ghé Sakura Mart. Sau đây xin thông báo chương trình giảm giá theo giờ. Ở quầy rau, toàn bộ rau giảm 20%. Ngoài ra, toàn bộ bánh mì giảm nửa giá.'],
      ['{店内|てんない}アナウンス', 'ja-nu', 'なお、お{肉|にく}のセールは{明日|あした}の{予定|よてい}でございます。お{魚|さかな}{売|う}り{場|ば}では、お{刺身|さしみ}をお{買|か}い{上|あ}げのお{客様|きゃくさま}に、お{味噌汁|みそしる}を{一|ひと}つプレゼントいたします。', 'Nao, oniku no seeru wa ashita no yotei de gozaimasu. Osakana uriba de wa, osashimi o okaiage no okyakusama ni, omisoshiru o hitotsu purezento itashimasu.', 'Ngoài ra, chương trình giảm giá thịt dự kiến vào ngày mai. Ở quầy cá, quý khách mua sashimi sẽ được tặng một bát súp miso.'],
      [NA, 'ja-nu', '{今日|きょう}、{半額|はんがく}になるものは{何|なん}ですか。', 'Kyou, hangaku ni naru mono wa nan desu ka.', 'Hôm nay thứ gì được giảm nửa giá?'],
    ]),
    MCQ('b40-d1-ng-83-q', '（83）', [
      Q('（83）{今日|きょう}、{半額|はんがく}になるものは{何|なん}ですか。', ['パン', '{野菜|やさい}', 'お{肉|にく}', 'お{刺身|さしみ}'], 0,
        '**パンはすべて{半額|はんがく}となっております** (Pan wa subete hangaku to natte orimasu) ⇒ bánh mì. Rau chỉ **{二割引|にわりび}き** (giảm 20% — 一割 = 10%, Bài 33); thịt → **{明日|あした}**; sashimi → được TẶNG súp, không giảm giá.'),
    ]),
    NG('b40-d1-ng-84', '（84）{男|おとこ}の{学生|がくせい}は、{発表|はっぴょう}で{何|なに}がいちばん{大変|たいへん}だったと{言|い}っていますか', '問題2 ポイント理解 — lần lượt loại: 話すのは大丈夫だった · グラフも～てもらってた → câu then chốt それがいちばんつらかった.', [
      [NA, 'ja-nu', '{女|おんな}の{学生|がくせい}と{男|おとこ}の{学生|がくせい}が{話|はな}しています。{男|おとこ}の{学生|がくせい}は、{発表|はっぴょう}で{何|なに}がいちばん{大変|たいへん}だったと{言|い}っていますか。', 'Onna no gakusei to otoko no gakusei ga hanashite imasu. Otoko no gakusei wa, happyou de nani ga ichiban taihen datta to itte imasu ka.', 'Một nữ sinh và một nam sinh đang nói chuyện. Nam sinh nói điều gì vất vả nhất trong buổi thuyết trình?'],
      ['パク', 'ja-nu', 'カルロスさん、{昨日|きのう}の{発表|はっぴょう}、お{疲|つか}れさま。すごくよかったよ。', 'Karurosu-san, kinou no happyou, otsukaresama. Sugoku yokatta yo.', 'Carlos, buổi thuyết trình hôm qua vất vả rồi. Hay lắm đấy.'],
      ['カルロス', 'ja-nam', 'ありがとう。でも、すごく{緊張|きんちょう}したよ。', 'Arigatou. Demo, sugoku kinchou shita yo.', 'Cảm ơn. Nhưng mình căng thẳng kinh khủng.'],
      ['パク', 'ja-nu', '{日本語|にほんご}で{話|はな}すのが{大変|たいへん}だった？', 'Nihongo de hanasu no ga taihen datta?', 'Nói bằng tiếng Nhật vất vả à?'],
      ['カルロス', 'ja-nam', '{話|はな}すのは、{何回|なんかい}も{練習|れんしゅう}したから{大丈夫|だいじょうぶ}だったんだ。グラフも{先生|せんせい}に{見|み}てもらってたし。', 'Hanasu no wa, nankai mo renshuu shita kara daijoubu datta n da. Gurafu mo sensei ni mite moratteta shi.', 'Phần nói thì mình luyện mấy lần rồi nên ổn. Biểu đồ cũng đã nhờ cô xem trước.'],
      ['パク', 'ja-nu', 'じゃあ、{何|なに}が？', 'Jaa, nani ga?', 'Vậy là cái gì?'],
      ['カルロス', 'ja-nam', '{最後|さいご}の{質問|しつもん}。{先輩|せんぱい}に、{思|おも}ってもいなかったことを{聞|き}かれて、すぐに{答|こた}えられなかったんだよ。それがいちばんつらかった。', 'Saigo no shitsumon. Senpai ni, omotte mo inakatta koto o kikarete, sugu ni kotaerarenakatta n da yo. Sore ga ichiban tsurakatta.', 'Phần hỏi đáp cuối. Bị anh chị khoá trên hỏi điều mình hoàn toàn không ngờ tới, mình không trả lời ngay được. Đó là cái khổ nhất.'],
      [NA, 'ja-nu', '{男|おとこ}の{学生|がくせい}は、{発表|はっぴょう}で{何|なに}がいちばん{大変|たいへん}だったと{言|い}っていますか。', 'Otoko no gakusei wa, happyou de nani ga ichiban taihen datta to itte imasu ka.', 'Nam sinh nói điều gì vất vả nhất trong buổi thuyết trình?'],
    ]),
    MCQ('b40-d1-ng-84-q', '（84）', [
      Q('（84）{男|おとこ}の{学生|がくせい}は、{発表|はっぴょう}で{何|なに}がいちばん{大変|たいへん}だったと{言|い}っていますか。', ['{日本語|にほんご}で{話|はな}すこと', 'グラフを{作|つく}ること', '{質問|しつもん}に{答|こた}えること', '{時間|じかん}を{守|まも}ること'], 2,
        'Nói → **{大丈夫|だいじょうぶ}だった**; biểu đồ → **{先生|せんせい}に{見|み}てもらってた** (= ～てもらっていた, Bài 39 ①). Câu then chốt: **{質問|しつもん}…すぐに{答|こた}えられなかった…それがいちばんつらかった**. ({聞|き}かれて — bị động Bài 22.)'),
    ]),
    NG('b40-d1-ng-85', '（85）{田村|たむら}さんは、{森課長|もりかちょう}に{何|なに}を{伝|つた}えてほしいと{言|い}っていますか', '問題2 ポイント理解 — điện thoại công việc (Bài 37): うち・そと 弊社 ↔ 御社, 復唱, 折り返しは不要, 申し伝えます.', [
      [NA, 'ja-nu', '{会社|かいしゃ}で、{女|おんな}の{人|ひと}が{電話|でんわ}に{出|で}ました。{田村|たむら}さんは、{森課長|もりかちょう}に{何|なに}を{伝|つた}えてほしいと{言|い}っていますか。', 'Kaisha de, onna no hito ga denwa ni demashita. Tamura-san wa, Mori-kachou ni nani o tsutaete hoshii to itte imasu ka.', 'Ở công ty, một người phụ nữ nhấc máy. Anh Tamura muốn nhắn trưởng phòng Mori điều gì?'],
      ['ワン', 'ja-nu', 'お{電話|でんわ}ありがとうございます。さくらシステムでございます。', 'Odenwa arigatou gozaimasu. Sakura Shisutemu de gozaimasu.', 'Cảm ơn quý khách đã gọi. Sakura System xin nghe.'],
      ['{田村|たむら}', 'ja-nam', '{東京商事|とうきょうしょうじ}の{田村|たむら}と{申|もう}します。いつもお{世話|せわ}になっております。{森課長|もりかちょう}はいらっしゃいますか。', 'Toukyou Shouji no Tamura to moushimasu. Itsumo osewa ni natte orimasu. Mori-kachou wa irasshaimasu ka.', 'Tôi là Tamura của Tokyo Shoji. Cảm ơn quý công ty luôn giúp đỡ. Trưởng phòng Mori có ở đó không ạ?'],
      ['ワン', 'ja-nu', '{申|もう}し{訳|わけ}ございません。{森|もり}はただいま{会議中|かいぎちゅう}でございます。', 'Moushiwake gozaimasen. Mori wa tadaima kaigichuu de gozaimasu.', 'Thành thật xin lỗi. Mori hiện đang họp ạ.'],
      ['{田村|たむら}', 'ja-nam', 'そうですか。では、{伝言|でんごん}をお{願|ねが}いできますか。{明後日|あさって}の{打|う}ち{合|あ}わせですが、{時間|じかん}はそのままで、{場所|ばしょ}を{弊社|へいしゃ}から{御社|おんしゃ}に{変|か}えていただけないか、ということなんです。', 'Sou desu ka. Dewa, dengon o onegai dekimasu ka. Asatte no uchiawase desu ga, jikan wa sono mama de, basho o heisha kara onsha ni kaete itadakenai ka, to iu koto na n desu.', 'Vậy à. Thế cho tôi nhắn lại được không? Về buổi họp ngày kia, giờ giữ nguyên, nhưng không biết có thể đổi địa điểm từ công ty chúng tôi sang quý công ty được không.'],
      ['ワン', 'ja-nu', '{明後日|あさって}の{打|う}ち{合|あ}わせを、{時間|じかん}は{変|か}えずに、{場所|ばしょ}を{弊社|へいしゃ}に{変更|へんこう}、ということですね。', 'Asatte no uchiawase o, jikan wa kaezu ni, basho o heisha ni henkou, to iu koto desu ne.', 'Buổi họp ngày kia, giữ nguyên giờ, đổi địa điểm sang công ty chúng tôi, có phải vậy không ạ?'],
      ['{田村|たむら}', 'ja-nam', 'はい。それと、{折|お}り{返|かえ}しのお{電話|でんわ}は{結構|けっこう}です。メールでお{返事|へんじ}いただければ{助|たす}かります。', 'Hai. Sore to, orikaeshi no odenwa wa kekkou desu. Meeru de ohenji itadakereba tasukarimasu.', 'Vâng. Còn nữa, không cần gọi lại đâu. Trả lời qua mail giúp tôi là tốt rồi.'],
      ['ワン', 'ja-nu', 'かしこまりました。{森|もり}に{申|もう}し{伝|つた}えます。', 'Kashikomarimashita. Mori ni moushitsutaemasu.', 'Vâng ạ. Tôi sẽ chuyển lời tới Mori.'],
      [NA, 'ja-nu', '{田村|たむら}さんは、{森課長|もりかちょう}に{何|なに}を{伝|つた}えてほしいと{言|い}っていますか。', 'Tamura-san wa, Mori-kachou ni nani o tsutaete hoshii to itte imasu ka.', 'Anh Tamura muốn nhắn trưởng phòng Mori điều gì?'],
    ]),
    MCQ('b40-d1-ng-85-q', '（85）', [
      Q('（85）{田村|たむら}さんは、{森課長|もりかちょう}に{何|なに}を{伝|つた}えてほしいと{言|い}っていますか。', ['{打|う}ち{合|あ}わせの{時間|じかん}を{変|か}えてほしい', 'すぐに{電話|でんわ}をしてほしい', '{打|う}ち{合|あ}わせをやめたい', '{打|う}ち{合|あ}わせの{場所|ばしょ}を{変|か}えてほしい'], 3,
        '**{時間|じかん}はそのままで、{場所|ばしょ}を{弊社|へいしゃ}から{御社|おんしゃ}に{変|か}えていただけないか** ⇒ đổi ĐỊA ĐIỂM. Gọi lại → **{結構|けっこう}です** (không cần). Để ý うち・そと (Bài 37 ③): Tamura nói {弊社|へいしゃ} = công ty Tamura; ワン nhắc lại "{弊社|へいしゃ}に" = công ty của ワン — cùng một nơi (さくらシステム), chỉ đổi người nói.'),
    ]),
    NG('b40-d1-ng-86', '（86）{女|おんな}の{人|ひと}が{郊外|こうがい}に{引|ひ}っ{越|こ}したいちばんの{理由|りゆう}は{何|なん}ですか', '問題2 ポイント理解 — それもあるけど (lý do phụ) · 実はそんなに変わらない · ～たかったの (lý do chính).', [
      [NA, 'ja-nu', '{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}が{話|はな}しています。{女|おんな}の{人|ひと}が{郊外|こうがい}に{引|ひ}っ{越|こ}したいちばんの{理由|りゆう}は{何|なん}ですか。', 'Otoko no hito to onna no hito ga hanashite imasu. Onna no hito ga kougai ni hikkoshita ichiban no riyuu wa nan desu ka.', 'Một người đàn ông và một người phụ nữ đang nói chuyện. Lý do chính khiến người phụ nữ chuyển ra ngoại ô là gì?'],
      ['マルコ', 'ja-nam', 'アンナさん、{引|ひ}っ{越|こ}したんだって？ {郊外|こうがい}のほうに。', 'Anna-san, hikkoshita n da tte? Kougai no hou ni.', 'Anna, nghe nói cậu chuyển nhà à? Ra phía ngoại ô.'],
      ['アンナ', 'ja-nu', 'うん。{会社|かいしゃ}まで{一時間|いちじかん}かかるようになっちゃったけどね。', 'Un. Kaisha made ichijikan kakaru you ni nacchatta kedo ne.', 'Ừ. Có điều giờ đến công ty mất cả tiếng.'],
      ['マルコ', 'ja-nam', '{家賃|やちん}が{安|やす}いから？', 'Yachin ga yasui kara?', 'Vì tiền nhà rẻ à?'],
      ['アンナ', 'ja-nu', 'それもあるけど、{実|じつ}はそんなに{変|か}わらないの。{前|まえ}の{部屋|へや}、{狭|せま}かったけど{安|やす}かったから。', 'Sore mo aru kedo, jitsu wa sonna ni kawaranai no. Mae no heya, semakatta kedo yasukatta kara.', 'Cũng có phần, nhưng thật ra không chênh mấy. Phòng cũ tuy chật nhưng rẻ mà.'],
      ['マルコ', 'ja-nam', 'じゃあ、どうして？', 'Jaa, doushite?', 'Thế sao lại chuyển?'],
      ['アンナ', 'ja-nu', '{犬|いぬ}を{飼|か}いたかったの。{前|まえ}のマンションはペットがだめだったから。{今|いま}の{家|いえ}は{小|ちい}さい{庭|にわ}もあるし、{近|ちか}くに{公園|こうえん}もあって、{最高|さいこう}だよ。', 'Inu o kaitakatta no. Mae no manshon wa petto ga dame datta kara. Ima no ie wa chiisai niwa mo aru shi, chikaku ni kouen mo atte, saikou da yo.', 'Tớ muốn nuôi chó. Chung cư cũ cấm nuôi thú cưng. Nhà bây giờ có cả khoảnh vườn nhỏ, gần đó lại có công viên, tuyệt lắm.'],
      [NA, 'ja-nu', '{女|おんな}の{人|ひと}が{郊外|こうがい}に{引|ひ}っ{越|こ}したいちばんの{理由|りゆう}は{何|なん}ですか。', 'Onna no hito ga kougai ni hikkoshita ichiban no riyuu wa nan desu ka.', 'Lý do chính khiến người phụ nữ chuyển ra ngoại ô là gì?'],
    ]),
    MCQ('b40-d1-ng-86-q', '（86）', [
      Q('（86）{女|おんな}の{人|ひと}が{郊外|こうがい}に{引|ひ}っ{越|こ}したいちばんの{理由|りゆう}は{何|なん}ですか。', ['{家賃|やちん}が{安|やす}いから', '{犬|いぬ}を{飼|か}いたかったから', '{部屋|へや}が{広|ひろ}いから', '{会社|かいしゃ}に{近|ちか}いから'], 1,
        'Tiền nhà → **それもあるけど、{実|じつ}はそんなに{変|か}わらない** (lý do phụ, bị hạ xuống); công ty → giờ còn XA hơn (一時間). Lý do chính: **{犬|いぬ}を{飼|か}いたかったの** + căn cứ: chung cư cũ cấm thú cưng. ({郊外|こうがい} — Bài 32; ～ようになっちゃった — Bài 21 + Bài 39 ②.)'),
    ]),

    /* ── 問題3 概要理解 ── */
    { t: 'h', text: 'もんだい3 — 概要理解（87〜89）: もんだい3は、{問題用紙|もんだいようし}に{何|なに}も{印刷|いんさつ}されていません。この{問題|もんだい}は、{全体|ぜんたい}としてどんな{内容|ないよう}かを{聞|き}く{問題|もんだい}です。{話|はなし}の{前|まえ}に{質問|しつもん}はありません。まず{話|はなし}を{聞|き}いてください。それから、{質問|しつもん}とせんたくしを{聞|き}いて、{最|もっと}もよいものを{一|ひと}つえらんでください。' },
    {
      t: 'note',
      title: 'Ở web, 4 lựa chọn được in để chấm — hãy che chúng lại',
      items: [
        'Nghe hết bài, tự nói **một câu tiếng Việt**: "người này đang nói về…" / "người này nghĩ…". Rồi mới mở 4 lựa chọn.',
        'Dấu hiệu ý chính (Bài 39 ⑧): **từ lặp lại nhiều lần**, câu sau **でも・ただ・実は**, câu kết **～てはいかがでしょうか・～と思う・～ほうがいい**.',
      ],
    },
    NG('b40-d1-ng-87', '（87）ラジオで{男|おとこ}の{人|ひと}が{話|はな}しています', '問題3 概要理解 (chủ đề) — từ lặp lại: 朝 ×6; ví dụ của bản thân (30 phút đọc sách) + lợi ích thứ hai (それに); câu kết ～てみてはいかがでしょうか.', [
      [NA, 'ja-nu', 'ラジオで{男|おとこ}の{人|ひと}が{話|はな}しています。', 'Rajio de otoko no hito ga hanashite imasu.', 'Một người đàn ông đang nói trên radio.'],
      ['パーソナリティー', 'ja-nam', '{皆|みな}さん、{朝|あさ}の{時間|じかん}をどう{過|す}ごしていますか。ぎりぎりまで{寝|ね}ている、という{方|かた}も{多|おお}いのではないでしょうか。{実|じつ}は、{朝|あさ}は{頭|あたま}がすっきりしていて、{勉強|べんきょう}や{仕事|しごと}に{集中|しゅうちゅう}しやすい{時間|じかん}だと{言|い}われています。', 'Minasan, asa no jikan o dou sugoshite imasu ka. Girigiri made nete iru, to iu kata mo ooi no de wa nai deshou ka. Jitsu wa, asa wa atama ga sukkiri shite ite, benkyou ya shigoto ni shuuchuu shiyasui jikan da to iwarete imasu.', 'Các bạn sử dụng thời gian buổi sáng thế nào? Chắc nhiều bạn ngủ sát giờ mới dậy nhỉ. Thật ra, người ta nói buổi sáng đầu óc tỉnh táo, là lúc dễ tập trung học và làm việc.'],
      ['パーソナリティー', 'ja-nam', '{私|わたし}も{去年|きょねん}から、{毎朝|まいあさ}{三十分|さんじゅっぷん}{早|はや}く{起|お}きて、{本|ほん}を{読|よ}むようにしています。たった{三十分|さんじゅっぷん}ですが、{一年|いちねん}でずいぶんたくさんの{本|ほん}が{読|よ}めました。それに、{朝|あさ}に{一|ひと}つ{予定|よてい}を{終|お}わらせておくと、{一日|いちにち}を{気持|きも}ちよく{始|はじ}められるんです。', 'Watashi mo kyonen kara, maiasa sanjuppun hayaku okite, hon o yomu you ni shite imasu. Tatta sanjuppun desu ga, ichinen de zuibun takusan no hon ga yomemashita. Sore ni, asa ni hitotsu yotei o owarasete oku to, ichinichi o kimochi yoku hajimerareru n desu.', 'Tôi cũng từ năm ngoái mỗi sáng dậy sớm 30 phút để đọc sách. Chỉ 30 phút thôi nhưng một năm tôi đã đọc được khá nhiều sách. Thêm nữa, sáng ra làm xong trước một việc thì bắt đầu ngày mới rất dễ chịu.'],
      ['パーソナリティー', 'ja-nam', '{早起|はやお}きは{三日坊主|みっかぼうず}で{終|お}わりがちですが、まずは{十分|じゅっぷん}からでも{始|はじ}めてみてはいかがでしょうか。', 'Hayaoki wa mikka bouzu de owarigachi desu ga, mazu wa juppun kara demo hajimete mite wa ikaga deshou ka.', 'Dậy sớm hay bị bỏ ngang sau vài hôm, nhưng thử bắt đầu từ mười phút trước xem sao các bạn?'],
      [NA, 'ja-nu', '{男|おとこ}の{人|ひと}は{何|なに}について{話|はな}していますか。', 'Otoko no hito wa nani ni tsuite hanashite imasu ka.', 'Người đàn ông đang nói về điều gì?'],
    ]),
    MCQ('b40-d1-ng-87-q', '（87）（che lựa chọn, tự nói ý chính trước）', [
      Q('（87）{男|おとこ}の{人|ひと}は{何|なに}について{話|はな}していますか。', ['{朝|あさ}{早|はや}く{起|お}きるための{方法|ほうほう}', '{朝|あさ}の{時間|じかん}を{使|つか}うことのよさ', '{夜|よる}ふかしをすることの{問題|もんだい}', '{朝|あさ}ご{飯|はん}を{食|た}べることの{大切|たいせつ}さ'], 1,
        'Cả bài: buổi sáng **{集中|しゅうちゅう}しやすい** + ví dụ đọc sách 30 phút + **それに** lợi ích thứ hai (bắt đầu ngày dễ chịu) ⇒ **cái hay của việc dùng thời gian buổi sáng**. Đáp án 1 bẫy: bài KHÔNG dạy cách dậy sớm, chỉ khuyên "bắt đầu từ 10 phút". ({終|お}わりがち — Bài 34 ①.)'),
    ]),
    NG('b40-d1-ng-88', '（88）{女|おんな}の{人|ひと}と{男|おとこ}の{人|ひと}が、{旅行|りょこう}の{写真|しゃしん}について{話|はな}しています', '問題3 概要理解 (ý kiến) — ～ばっかり (Bài 39), 撮るなとは言わない (không cấm) · でも → ý chính ～たほうが、ずっと心に残ると思う.', [
      [NA, 'ja-nu', '{女|おんな}の{人|ひと}と{男|おとこ}の{人|ひと}が、{旅行|りょこう}の{写真|しゃしん}について{話|はな}しています。', 'Onna no hito to otoko no hito ga, ryokou no shashin ni tsuite hanashite imasu.', 'Một người phụ nữ và một người đàn ông đang nói về ảnh du lịch.'],
      ['ダニエル', 'ja-nam', 'パクさん、{京都|きょうと}の{旅行|りょこう}どうだった？ {写真|しゃしん}、たくさん{撮|と}った？', 'Paku-san, Kyouto no ryokou dou datta? Shashin, takusan totta?', 'Park, chuyến đi Kyoto thế nào? Chụp nhiều ảnh không?'],
      ['パク', 'ja-nu', 'それがね、{今回|こんかい}はあんまり{撮|と}らなかったの。', 'Sore ga ne, konkai wa anmari toranakatta no.', 'Chuyện là lần này tớ không chụp mấy.'],
      ['ダニエル', 'ja-nam', 'え、どうして？ スマホ{忘|わす}れたとか？', 'E, doushite? Sumaho wasureta toka?', 'Ơ, sao vậy? Quên điện thoại hay gì?'],
      ['パク', 'ja-nu', 'ううん。{前|まえ}の{旅行|りょこう}のとき、{写真|しゃしん}を{撮|と}ることばっかりに{夢中|むちゅう}になって、{家|いえ}に{帰|かえ}ってから、{景色|けしき}をちゃんと{見|み}てなかったことに{気|き}づいたんだ。{写真|しゃしん}は{何百枚|なんびゃくまい}もあるのに、{何|なに}も{覚|おぼ}えてないの。', 'Uun. Mae no ryokou no toki, shashin o toru koto bakkari ni muchuu ni natte, ie ni kaette kara, keshiki o chanto mitenakatta koto ni kizuita n da. Shashin wa nanbyakumai mo aru noni, nani mo oboetenai no.', 'Không. Chuyến trước tớ mải mê chụp ảnh, về nhà mới nhận ra là mình chẳng ngắm cảnh cho đàng hoàng. Ảnh thì có cả mấy trăm tấm mà chẳng nhớ gì.'],
      ['ダニエル', 'ja-nam', 'ああ、わかる。', 'Aa, wakaru.', 'À, hiểu rồi.'],
      ['パク', 'ja-nu', 'もちろん、{撮|と}るなとは{言|い}わないよ。{思|おも}い{出|で}になるし。でも、{一|ひと}つの{場所|ばしょ}で{何枚|なんまい}か{撮|と}ったら、あとはスマホをしまって、{自分|じぶん}の{目|め}でゆっくり{見|み}たほうが、ずっと{心|こころ}に{残|のこ}ると{思|おも}う。', 'Mochiron, toru na to wa iwanai yo. Omoide ni naru shi. Demo, hitotsu no basho de nanmai ka tottara, ato wa sumaho o shimatte, jibun no me de yukkuri mita hou ga, zutto kokoro ni nokoru to omou.', 'Tất nhiên tớ không bảo là đừng chụp. Ảnh thành kỷ niệm mà. Nhưng ở mỗi chỗ chụp vài tấm xong thì cất điện thoại đi, tự mắt mình ngắm thong thả, tớ nghĩ sẽ đọng lại trong lòng hơn nhiều.'],
      [NA, 'ja-nu', '{女|おんな}の{人|ひと}は、{旅行|りょこう}の{写真|しゃしん}についてどう{考|かんが}えていますか。', 'Onna no hito wa, ryokou no shashin ni tsuite dou kangaete imasu ka.', 'Người phụ nữ nghĩ thế nào về ảnh du lịch?'],
    ]),
    MCQ('b40-d1-ng-88-q', '（88）（che lựa chọn, tự nói ý chính trước）', [
      Q('（88）{女|おんな}の{人|ひと}は、{旅行|りょこう}の{写真|しゃしん}についてどう{考|かんが}えていますか。', ['{旅行|りょこう}では、{写真|しゃしん}をたくさん{撮|と}ったほうがいい', '{旅行|りょこう}では、{写真|しゃしん}を{撮|と}らないほうがいい', 'スマホより、カメラで{撮|と}ったほうがいい', '{写真|しゃしん}は{少|すこ}しにして、{自分|じぶん}の{目|め}で{見|み}ることが{大切|たいせつ}だ'], 3,
        '**{撮|と}るなとは{言|い}わない** ⇒ loại 2 (cô ấy KHÔNG cấm chụp). Sau **でも**: **{何枚|なんまい}か{撮|と}ったら…{自分|じぶん}の{目|め}でゆっくり{見|み}たほうが、ずっと{心|こころ}に{残|のこ}る** ⇒ đáp án 4. Đáp án 1 ngược ý; 3 không được nhắc tới.'),
    ]),
    NG('b40-d1-ng-89', '（89）{大学|だいがく}の{授業|じゅぎょう}で、{先生|せんせい}が{話|はな}しています', '問題3 概要理解 (chủ đề) — từ khoá 評価; ba phần % (感想 30 · 発表 30 · レポート 40) + なお (lưu ý vắng mặt).', [
      [NA, 'ja-nu', '{大学|だいがく}の{授業|じゅぎょう}で、{先生|せんせい}が{話|はな}しています。', 'Daigaku no jugyou de, sensei ga hanashite imasu.', 'Trong giờ học ở trường đại học, thầy giáo đang nói.'],
      ['{本田先生|ほんだせんせい}', 'ja-nam', '{今日|きょう}は{一回目|いっかいめ}の{授業|じゅぎょう}ですので、まず、この{授業|じゅぎょう}の{評価|ひょうか}について{説明|せつめい}しておきます。この{授業|じゅぎょう}には{期末試験|きまつしけん}がありません。その{代|か}わり、{毎週|まいしゅう}、{授業|じゅぎょう}の{最後|さいご}に{短|みじか}い{感想|かんそう}を{書|か}いてもらいます。これが{全体|ぜんたい}の30パーセントです。', 'Kyou wa ikkaime no jugyou desu node, mazu, kono jugyou no hyouka ni tsuite setsumei shite okimasu. Kono jugyou ni wa kimatsu shiken ga arimasen. Sono kawari, maishuu, jugyou no saigo ni mijikai kansou o kaite moraimasu. Kore ga zentai no sanjuu paasento desu.', 'Hôm nay là buổi học đầu tiên nên trước hết tôi giải thích cách đánh giá của môn này. Môn này không có thi cuối kỳ. Thay vào đó, mỗi tuần cuối giờ các bạn viết một bài cảm nghĩ ngắn. Phần này chiếm 30% tổng điểm.'],
      ['{本田先生|ほんだせんせい}', 'ja-nam', 'それから、{学期|がっき}の{途中|とちゅう}で{一回|いっかい}、グループで{発表|はっぴょう}をしてもらいます。これも30パーセント。{残|のこ}りの40パーセントは、{学期|がっき}の{最後|さいご}に{出|だ}すレポートです。なお、{欠席|けっせき}が{五回|ごかい}を{超|こ}えると{単位|たんい}は{出|だ}せませんので、{気|き}をつけてください。', 'Sorekara, gakki no tochuu de ikkai, guruupu de happyou o shite moraimasu. Kore mo sanjuu paasento. Nokori no yonjuu paasento wa, gakki no saigo ni dasu repooto desu. Nao, kesseki ga gokai o koeru to tan-i wa dasemasen node, ki o tsukete kudasai.', 'Tiếp theo, giữa học kỳ các bạn thuyết trình nhóm một lần. Phần này cũng 30%. 40% còn lại là bài báo cáo nộp cuối kỳ. Ngoài ra, vắng quá năm buổi thì không được cấp tín chỉ, các bạn lưu ý.'],
      [NA, 'ja-nu', '{先生|せんせい}は{何|なに}について{話|はな}していますか。', 'Sensei wa nani ni tsuite hanashite imasu ka.', 'Thầy giáo đang nói về điều gì?'],
    ]),
    MCQ('b40-d1-ng-89-q', '（89）（che lựa chọn, tự nói ý chính trước）', [
      Q('（89）{先生|せんせい}は{何|なに}について{話|はな}していますか。', ['{成績|せいせき}のつけ{方|かた}', '{授業|じゅぎょう}の{内容|ないよう}', 'レポートの{書|か}き{方|かた}', '{期末試験|きまつしけん}の{日程|にってい}'], 0,
        'Câu mở đã nói chủ đề: **この{授業|じゅぎょう}の{評価|ひょうか}について{説明|せつめい}しておきます** ({評価|ひょうか} — Bài 35), sau đó toàn số phần trăm ⇒ **cách cho điểm**. {期末試験|きまつしけん} → **ありません** (bẫy nghe thấy từ); báo cáo chỉ là một phần 40%, thầy không dạy cách viết.'),
    ]),

    /* ── 問題4 発話表現 ── */
    { t: 'h', text: 'もんだい4 — 発話表現（90〜93）: もんだい4では、{絵|え}を{見|み}ながら{質問|しつもん}を{聞|き}いてください。→（やじるし）の{人|ひと}は{何|なん}と{言|い}いますか。1から3の{中|なか}から、{最|もっと}もよいものを{一|ひと}つえらんでください。' },
    {
      t: 'p',
      text: 'Đề thật có TRANH (người có mũi tên →). Ở đây mỗi câu có một **cảnh** vẽ bằng hình + lời tả thay cho tranh; người dẫn đọc tình huống rồi đọc 3 phương án. Ba phương án thường khác nhau ở **AI làm** (～ていただく ↔ ～てさしあげる ↔ ～させていただく) và **kính ngữ đúng hướng**.',
    },
    { t: 'canh', anh: ['woman-office-worker', 'man-office-worker', 'page-facing-up'], caption: 'Tranh (90): văn phòng. Một nữ nhân viên mới (có mũi tên) cầm tập tài liệu, đứng cạnh bàn anh đồng nghiệp đàn anh đang bận gõ máy. Cô muốn anh xem qua giúp tài liệu mình làm.' },
    NG('b40-d1-ng-90', '（90）→の{人|ひと}は{何|なん}と{言|い}いますか', '問題4 発話表現 — nhờ người trên XEM giúp: お忙しいところ (クッション言葉, Bài 35/37) + 目を通していただけないでしょうか.', [
      [NA, 'ja-nu', '{先輩|せんぱい}に、{自分|じぶん}が{作|つく}った{書類|しょるい}を{見|み}てもらいたいです。{何|なん}と{言|い}いますか。', 'Senpai ni, jibun ga tsukutta shorui o mite moraitai desu. Nan to iimasu ka.', 'Bạn muốn đàn anh xem giúp tài liệu mình làm. Bạn nói gì?'],
      [NA, 'ja-nu', '1、お{忙|いそが}しいところすみません。この{書類|しょるい}、{目|め}を{通|とお}していただけないでしょうか。　2、お{忙|いそが}しいところすみません。この{書類|しょるい}、{目|め}を{通|とお}してさしあげましょうか。　3、お{忙|いそが}しいところすみません。この{書類|しょるい}、{目|め}を{通|とお}させていただきます。', 'Ichi, oisogashii tokoro sumimasen. Kono shorui, me o tooshite itadakenai deshou ka. Ni, oisogashii tokoro sumimasen. Kono shorui, me o tooshite sashiagemashou ka. San, oisogashii tokoro sumimasen. Kono shorui, me o toosasete itadakimasu.', '1. Xin lỗi anh đang bận. Anh có thể xem qua giúp em tài liệu này được không ạ? 2. Xin lỗi anh đang bận. Để em xem qua tài liệu này cho anh nhé? 3. Xin lỗi anh đang bận. Em xin phép xem qua tài liệu này.'],
    ]),
    MCQ('b40-d1-ng-90-q', '（90）', [
      Q('（90）{先輩|せんぱい}に{自分|じぶん}の{書類|しょるい}を{見|み}てもらいたい', ['1', '2', '3'], 0,
        'Mình NHỜ người trên làm ⇒ **～ていただけないでしょうか** (bậc nhờ lịch sự cao — Bài 35 ⑧) + {目|め}を{通|とお}す (xem qua — Bài 35). 2 **～てさしあげましょうか** = mình đề nghị làm CHO anh ấy — ngược vai; 3 **～させていただきます** = thông báo MÌNH sẽ (tự) xem — không phải nhờ anh ấy xem.'),
    ]),
    { t: 'canh', anh: ['woman', 'dress', 'shopping-bags'], caption: 'Tranh (91): cửa hàng quần áo. Một cô gái (có mũi tên) cầm chiếc váy trên móc, chỉ về phía phòng thử đồ có rèm; nhân viên cửa hàng đứng gần đó.' },
    NG('b40-d1-ng-91', '（91）→の{人|ひと}は{何|なん}と{言|い}いますか', '問題4 発話表現 — XIN PHÉP cho mình: ～てもいいですか (N5/N4) ↔ nhờ người khác ～ていただけますか ↔ sai khiến ～させましょうか.', [
      [NA, 'ja-nu', '{店|みせ}で、{気|き}に{入|い}った{服|ふく}を{着|き}てみたいです。{店員|てんいん}に{何|なん}と{言|い}いますか。', 'Mise de, ki ni itta fuku o kite mitai desu. Ten-in ni nan to iimasu ka.', 'Ở cửa hàng, bạn muốn mặc thử bộ đồ mình thích. Bạn nói gì với nhân viên?'],
      [NA, 'ja-nu', '1、すみません、これ、{着|き}てみていただけますか。　2、すみません、これ、{着|き}てみてもいいですか。　3、すみません、これ、{着|き}させましょうか。', 'Ichi, sumimasen, kore, kite mite itadakemasu ka. Ni, sumimasen, kore, kite mite mo ii desu ka. San, sumimasen, kore, kisasemashou ka.', '1. Xin lỗi, chị mặc thử cái này giúp tôi được không? 2. Xin lỗi, tôi mặc thử cái này được không? 3. Xin lỗi, để tôi cho (ai đó) mặc cái này nhé?'],
    ]),
    MCQ('b40-d1-ng-91-q', '（91）', [
      Q('（91）{店|みせ}で{服|ふく}を{着|き}てみたい', ['1', '2', '3'], 1,
        'Xin phép cho CHÍNH MÌNH ⇒ **{着|き}てみてもいいですか** (～てみる + ～てもいい). 1 nhờ NHÂN VIÊN mặc thử — sai người; 3 thể sai khiến **{着|き}させる** = bắt / cho người khác mặc.'),
    ]),
    { t: 'canh', anh: ['woman-student', 'package', 'man-student'], caption: 'Tranh (92): hành lang ký túc xá. Một nữ sinh đang một mình khiêng thùng các-tông to, trông rất nặng. Nam sinh (có mũi tên) vừa đi tới.' },
    NG('b40-d1-ng-92', '（92）→の{人|ひと}は{何|なん}と{言|い}いますか', '問題4 発話表現 — ĐỀ NGHỊ GIÚP với bạn: V(よ)うか (thể ý chí + か, Bài 16) ↔ nhờ ～てもらえる？ ↔ sai khiến bị động (Bài 35).', [
      [NA, 'ja-nu', '{友達|ともだち}が{重|おも}そうな{荷物|にもつ}を{運|はこ}んでいます。{手伝|てつだ}いたいです。{何|なん}と{言|い}いますか。', 'Tomodachi ga omosou na nimotsu o hakonde imasu. Tetsudaitai desu. Nan to iimasu ka.', 'Bạn của bạn đang khiêng một thùng đồ trông rất nặng. Bạn muốn giúp. Bạn nói gì?'],
      [NA, 'ja-nu', '1、{重|おも}そうだね。{手伝|てつだ}ってもらえる？　2、{重|おも}かったら、{運|はこ}ばせられるよ。　3、{重|おも}そうだね。{半分|はんぶん}{持|も}とうか。', 'Ichi, omosou da ne. Tetsudatte moraeru? Ni, omokattara, hakobaserareru yo. San, omosou da ne. Hanbun motou ka.', '1. Trông nặng nhỉ. Cậu giúp tớ được không? 2. Nếu nặng thì sẽ bị bắt khiêng đấy. 3. Trông nặng nhỉ. Để tớ cầm một nửa nhé?'],
    ]),
    MCQ('b40-d1-ng-92-q', '（92）', [
      Q('（92）{友達|ともだち}の{荷物|にもつ}を{運|はこ}ぶのを{手伝|てつだ}いたい', ['1', '2', '3'], 2,
        'Mình đề nghị giúp bạn ⇒ **{持|も}とうか** (thể ý chí + か "để tớ… nhé?"). 1 **{手伝|てつだ}ってもらえる？** = nhờ bạn giúp MÌNH — ngược vai; 2 **{運|はこ}ばせられる** = bị bắt khiêng (sai khiến bị động — Bài 35) — vô nghĩa ở đây.'),
    ]),
    { t: 'canh', anh: ['woman-office-worker', 'man-office-worker', 'elevator'], caption: 'Tranh (93): trước cửa thang máy của công ty. Nữ nhân viên (có mũi tên) cúi chào một vị khách của công ty đối tác vừa họp xong, đang chuẩn bị về.' },
    NG('b40-d1-ng-93', '（93）→の{人|ひと}は{何|なん}と{言|い}いますか', '問題4 発話表現 — cảm ơn khách đã đến: わざわざお越しいただき (お越し = tôn kính của 来る, Bài 37) ↔ ご苦労様 (sai với người trên / khách) ↔ 参る (khiêm nhường — sai hướng).', [
      [NA, 'ja-nu', 'お{客様|きゃくさま}が{会社|かいしゃ}に{来|き}て、{今|いま}から{帰|かえ}ります。お{礼|れい}を{言|い}います。{何|なん}と{言|い}いますか。', 'Okyakusama ga kaisha ni kite, ima kara kaerimasu. Orei o iimasu. Nan to iimasu ka.', 'Khách đã đến công ty, giờ chuẩn bị về. Bạn nói lời cảm ơn. Bạn nói gì?'],
      [NA, 'ja-nu', '1、{本日|ほんじつ}は、わざわざお{越|こ}しいただき、ありがとうございました。　2、{本日|ほんじつ}は、ご{苦労様|くろうさま}でした。　3、{本日|ほんじつ}は、わざわざ{参|まい}っていただき、ありがとうございました。', 'Ichi, honjitsu wa, wazawaza okoshi itadaki, arigatou gozaimashita. Ni, honjitsu wa, gokurousama deshita. San, honjitsu wa, wazawaza maitte itadaki, arigatou gozaimashita.', '1. Hôm nay cảm ơn anh đã cất công đến. 2. Hôm nay anh vất vả rồi. 3. Hôm nay cảm ơn anh đã "khiêm nhường đến" (dùng sai kính ngữ).'],
    ]),
    MCQ('b40-d1-ng-93-q', '（93）', [
      Q('（93）{帰|かえ}るお{客様|きゃくさま}にお{礼|れい}を{言|い}う', ['1', '2', '3'], 0,
        '**わざわざお{越|こ}しいただき、ありがとうございました** — お{越|こ}し = tôn kính của {来|く}る (Bài 37 bảng động từ). 2 **ご{苦労様|くろうさま}** là câu người TRÊN nói với người dưới — thất lễ với khách (Bài 37 ⑪); 3 **{参|まい}る** là khiêm nhường — chỉ dùng cho việc của MÌNH.'),
    ]),

    /* ── 問題5 即時応答 ── */
    { t: 'h', text: 'もんだい5 — 即時応答（94〜102）: もんだい5では、{問題用紙|もんだいようし}に{何|なに}も{印刷|いんさつ}されていません。まず{文|ぶん}を{聞|き}いてください。それから、そのへんじを{聞|き}いて、1から3の{中|なか}から、{最|もっと}もよいものを{一|ひと}つえらんでください。' },
    NG('b40-d1-ng-94', '（94）〜（96）{最|もっと}もよいへんじをえらんでください', '問題5 即時応答 — ① nhờ làm sẵn (～といてくれる？) · ② tiếc vì không mang ô (～ばよかった, Bài 35) · ③ sếp hỏi xác nhận (～てあるよね？).', [
      [NA, 'ja-nu', '（94）', 'Kyuujuuyon.', 'Câu 94.'],
      ['{鈴木|すずき}', 'ja-nu', 'ワンさん、この{資料|しりょう}、{明日|あした}までにまとめといてくれる？', 'Wan-san, kono shiryou, ashita made ni matometoite kureru?', 'Wan ơi, tài liệu này em tổng hợp sẵn trước mai giúp chị nhé?'],
      ['ワン', 'ja-nu', '1、はい、{明日|あした}までにまとめておきます。　2、はい、まとめてもらいます。　3、いいえ、まとめていません。', 'Ichi, hai, ashita made ni matomete okimasu. Ni, hai, matomete moraimasu. San, iie, matomete imasen.', '1. Vâng, em sẽ tổng hợp sẵn trước mai ạ. 2. Vâng, em sẽ nhờ (ai đó) tổng hợp. 3. Không, em chưa tổng hợp.'],
      [NA, 'ja-nu', '（95）', 'Kyuujuugo.', 'Câu 95.'],
      ['カルロス', 'ja-nam', 'あ、{雨|あめ}{降|ふ}ってきちゃった。{傘|かさ}{持|も}ってくればよかった。', 'A, ame futte kichatta. Kasa motte kureba yokatta.', 'Ôi, mưa rồi. Biết thế mang ô theo.'],
      ['リン', 'ja-nu', '1、よかったね。　2、{私|わたし}の{折|お}りたたみ{傘|がさ}、{使|つか}う？　3、{傘|かさ}、{持|も}ってきたんだね。', 'Ichi, yokatta ne. Ni, watashi no oritatami gasa, tsukau? San, kasa, motte kita n da ne.', '1. May quá nhỉ. 2. Dùng ô gấp của tớ không? 3. Cậu mang ô theo rồi nhỉ.'],
      [NA, 'ja-nu', '（96）', 'Kyuujuuroku.', 'Câu 96.'],
      ['{森課長|もりかちょう}', 'ja-nam', 'ワンさん、{田村|たむら}さんにはもう{連絡|れんらく}してあるよね？', 'Wan-san, Tamura-san ni wa mou renraku shite aru yo ne?', 'Wan này, em liên lạc với anh Tamura rồi chứ nhỉ?'],
      ['ワン', 'ja-nu', '1、はい、{連絡|れんらく}してくださいました。　2、いいえ、{田村|たむら}さんはいらっしゃいません。　3、はい、{昨日|きのう}メールでお{伝|つた}えしてあります。', 'Ichi, hai, renraku shite kudasaimashita. Ni, iie, Tamura-san wa irasshaimasen. San, hai, kinou meeru de otsutae shite arimasu.', '1. Vâng, (ai đó) đã liên lạc cho ạ. 2. Không, anh Tamura không có ở đây ạ. 3. Vâng, hôm qua em đã báo qua mail rồi ạ.'],
    ]),
    MCQ('b40-d1-ng-94-q', '（94）〜（96）', [
      Q('（94）「この{資料|しりょう}、{明日|あした}までにまとめといてくれる？」', ['1', '2', '3'], 0,
        '**まとめといて** = まとめておいて (Bài 39 ①); được nhờ ⇒ nhận lời **はい、～ておきます**. 2 đẩy việc cho người khác; 3 trả lời câu hỏi "làm chưa?" — không khớp lời nhờ.'),
      Q('（95）「{傘|かさ}{持|も}ってくればよかった。」', ['1', '2', '3'], 1,
        '**～ばよかった** = tiếc "giá mà đã…" (Bài 35 ⑤) ⇒ bạn KHÔNG có ô ⇒ đáp hợp: cho mượn **{折|お}りたたみ{傘|がさ}、{使|つか}う？**. 1 nghe "よかった" mà đáp "よかったね" — bẫy lặp từ; 3 hiểu ngược (tưởng đã mang).'),
      Q('（96）「{田村|たむら}さんにはもう{連絡|れんらく}してあるよね？」', ['1', '2', '3'], 2,
        'Xác nhận việc đã làm ⇒ **はい、{昨日|きのう}メールでお{伝|つた}えしてあります** (お～する khiêm nhường hướng tới khách + ～てある). 1 dùng くださる cho việc của mình — sai; 2 trả lời câu hỏi khác.'),
    ]),
    NG('b40-d1-ng-97', '（97）〜（99）{最|もっと}もよいへんじをえらんでください', '問題5 即時応答 — ④ hỏi lại điều quên (～だっけ？, Bài 39 ⑤) · ⑤ được thầy cô khen · ⑥ nhân viên hỏi (お～する).', [
      [NA, 'ja-nu', '（97）', 'Kyuujuunana.', 'Câu 97.'],
      ['ダニエル', 'ja-nam', '{明日|あした}のテスト、{範囲|はんい}どこまでだっけ？', 'Ashita no tesuto, han-i doko made dakke?', 'Bài kiểm tra mai, phạm vi đến đâu ấy nhỉ?'],
      ['マリヤム', 'ja-nu', '1、{明日|あした}はテストだよ。　2、{三課|さんか}から{五課|ごか}までだよ。　3、{範囲|はんい}、{決|き}めといたよ。', 'Ichi, ashita wa tesuto da yo. Ni, sanka kara goka made da yo. San, han-i, kimetoita yo.', '1. Mai có kiểm tra đấy. 2. Từ bài 3 đến bài 5. 3. Tớ quyết phạm vi sẵn rồi.'],
      [NA, 'ja-nu', '（98）', 'Kyuujuuhachi.', 'Câu 98.'],
      ['{佐藤先生|さとうせんせい}', 'ja-nu', 'リンさん、このレポート、よく{書|か}けていましたよ。', 'Rin-san, kono repooto, yoku kakete imashita yo.', 'Rin, bài báo cáo này em viết tốt lắm.'],
      ['リン', 'ja-nu', '1、{本当|ほんとう}ですか。ありがとうございます。　2、{先生|せんせい}も、よく{書|か}けましたね。　3、いいえ、まだ{書|か}いていません。', 'Ichi, hontou desu ka. Arigatou gozaimasu. Ni, sensei mo, yoku kakemashita ne. San, iie, mada kaite imasen.', '1. Thật ạ? Em cảm ơn cô. 2. Cô cũng viết tốt đấy ạ. 3. Không, em chưa viết.'],
      [NA, 'ja-nu', '（99）', 'Kyuujuukyuu.', 'Câu 99.'],
      ['{店員|てんいん}', 'ja-nam', 'お{箸|はし}はおつけしますか。', 'Ohashi wa otsuke shimasu ka.', 'Quý khách có lấy đũa không ạ?'],
      ['アンナ', 'ja-nu', '1、はい、おつけします。　2、お{箸|はし}でいただきます。　3、はい、お{願|ねが}いします。', 'Ichi, hai, otsuke shimasu. Ni, ohashi de itadakimasu. San, hai, onegai shimasu.', '1. Vâng, tôi xin kèm vào. 2. Tôi xin ăn bằng đũa. 3. Vâng, nhờ anh.'],
    ]),
    MCQ('b40-d1-ng-97-q', '（97）〜（99）', [
      Q('（97）「{明日|あした}のテスト、{範囲|はんい}どこまでだっけ？」', ['1', '2', '3'], 1,
        '**～だっけ？** = hỏi lại điều mình quên (Bài 39 ⑤) ⇒ trả lời đúng thông tin: **{三課|さんか}から{五課|ごか}までだよ**. 1 chỉ lặp lại "mai có kiểm tra"; 3 **{決|き}めといた** — người học không tự quyết phạm vi.'),
      Q('（98）「このレポート、よく{書|か}けていましたよ。」', ['1', '2', '3'], 0,
        'Được người trên khen ⇒ **{本当|ほんとう}ですか。ありがとうございます**. 2 "khen lại" cô giáo kiểu đánh giá người trên — thất lễ; 3 mâu thuẫn (bài đã chấm rồi).'),
      Q('（99）「お{箸|はし}はおつけしますか。」', ['1', '2', '3'], 2,
        'Nhân viên hỏi bằng khiêm nhường **お～する** ⇒ khách nhận: **はい、お{願|ねが}いします**. 1 lặp lại khiêm nhường của nhân viên — sai vai (bẫy lặp mẫu, Bài 39); 2 không trả lời câu hỏi có/không.'),
    ]),
    NG('b40-d1-ng-100', '（100）〜（102）{最|もっと}もよいへんじをえらんでください', '問題5 即時応答 — ⑦ than (せっかく～のに) · ⑧ sếp nhờ (～てもらえないかな) · ⑨ chê nhẹ (思ったほど～ない, Bài 29 ②).', [
      [NA, 'ja-nu', '（100）', 'Hyaku.', 'Câu 100.'],
      ['{山口|やまぐち}', 'ja-nu', 'せっかく{来|き}たのに、お{店|みせ}、{休|やす}みだったなんて……。', 'Sekkaku kita noni, omise, yasumi datta nante…….', 'Mất công đến mà quán lại nghỉ cơ chứ…'],
      ['{西川|にしかわ}', 'ja-nam', '1、{来|き}てよかったね。　2、{残念|ざんねん}だったね。また{今度|こんど}{来|こ}よう。　3、{休|やす}むなら{連絡|れんらく}してね。', 'Ichi, kite yokatta ne. Ni, zannen datta ne. Mata kondo koyou. San, yasumu nara renraku shite ne.', '1. May mà đến nhỉ. 2. Tiếc thật. Lần sau mình lại đến nhé. 3. Nếu nghỉ thì báo nhé.'],
      [NA, 'ja-nu', '（101）', 'Hyaku ichi.', 'Câu 101.'],
      ['{小林店長|こばやしてんちょう}', 'ja-nam', '{悪|わる}いけど、{今日|きょう}{一時間|いちじかん}だけ{残|のこ}ってもらえないかな。', 'Warui kedo, kyou ichijikan dake nokotte moraenai ka na.', 'Phiền cậu, hôm nay ở lại thêm một tiếng thôi được không?'],
      ['ナタポン', 'ja-nam', '1、はい、{残|のこ}ってあげます。　2、はい、{残|のこ}ってもらいます。　3、はい、{大丈夫|だいじょうぶ}ですよ。', 'Ichi, hai, nokotte agemasu. Ni, hai, nokotte moraimasu. San, hai, daijoubu desu yo.', '1. Vâng, tôi ở lại cho anh. 2. Vâng, tôi sẽ nhờ (ai đó) ở lại. 3. Vâng, được ạ.'],
      [NA, 'ja-nu', '（102）', 'Hyaku ni.', 'Câu 102.'],
      ['マルコ', 'ja-nam', 'この{店|みせ}のラーメン、{思|おも}ったほどおいしくなかったね。', 'Kono mise no raamen, omotta hodo oishiku nakatta ne.', 'Ramen quán này không ngon như mình tưởng nhỉ.'],
      ['アンナ', 'ja-nu', '1、うん、もっとおいしいと{思|おも}ってた。　2、うん、{思|おも}ったよりおいしかったね。　3、じゃ、もう{一杯|いっぱい}{食|た}べよう。', 'Ichi, un, motto oishii to omotteta. Ni, un, omotta yori oishikatta ne. San, ja, mou ippai tabeyou.', '1. Ừ, tớ cứ tưởng ngon hơn. 2. Ừ, ngon hơn mình tưởng nhỉ. 3. Vậy ăn thêm bát nữa đi.'],
    ]),
    MCQ('b40-d1-ng-100-q', '（100）〜（102）', [
      Q('（100）「せっかく{来|き}たのに、お{店|みせ}、{休|やす}みだったなんて……。」', ['1', '2', '3'], 1,
        '**せっかく～のに** = mất công… vậy mà (tiếc) ⇒ đồng cảm: **{残念|ざんねん}だったね。また{今度|こんど}{来|こ}よう**. 1 ngược cảm xúc; 3 nói như với chủ quán.'),
      Q('（101）「{今日|きょう}{一時間|いちじかん}だけ{残|のこ}ってもらえないかな。」', ['1', '2', '3'], 2,
        'Sếp nhờ ⇒ nhận lời **はい、{大丈夫|だいじょうぶ}ですよ**. 1 **～てあげます** với người trên là kẻ cả, thất lễ; 2 lặp lại mẫu nhờ (～てもらう) — sai vai.'),
      Q('（102）「{思|おも}ったほどおいしくなかったね。」', ['1', '2', '3'], 0,
        '**{思|おも}ったほど～ない** = không… như mình tưởng (Bài 29 ②) ⇒ đồng ý: **もっとおいしいと{思|おも}ってた**. 2 hiểu ngược ("ngon hơn tưởng" là ～より); 3 không hợp lời chê.'),
    ]),
    {
      t: 'note',
      title: 'Xong Đề 1 — ghi điểm',
      items: [
        '聴解: 問題1 __/6 · 問題2 __/6 · 問題3 __/3 · 問題4 __/4 · 問題5 __/9 ⇒ **聴解 __/28**.',
        'Mở lời thoại các bài sai, nghe lại 2 lần có chữ + romaji, đánh dấu **câu then chốt** mình bỏ lỡ — rồi sang mục **Bảng điểm** để quy đổi và tra Bài cần ôn.',
      ],
    },
  ],
};

/* ═══════════════════════════ 5. BẢNG ĐIỂM ĐỀ 1 ═══════════════════════════ */

const BANG_DIEM: Lesson = {
  id: 'b40-thi-thu-bang-diem',
  kind: 'review',
  title: 'Thi thử N3 · Đề 1 · Bảng điểm — quy đổi ra 3 mục /60, tổng /180, điểm liệt 19, A/B/C, sai câu nào ôn Bài nào',
  goal: 'Từ số câu đúng của Đề 1 tính ra điểm 言語知識 /60, 読解 /60, 聴解 /60 và tổng /180; biết mình đạt hay trượt (95 điểm + điểm liệt 19 cho CẢ BA mục); tự xếp A / B / C cho 文字・語彙 và 文法 như bảng điểm JLPT; rồi tra từng câu sai về đúng Bài – mục cần ôn trong Bài 26–39.',
  minutes: 25,
  blocks: [
    {
      t: 'recap',
      title: 'Chấm theo 4 bước',
      items: [
        '① Cộng số câu đúng theo **3 mục**: **言語知識** = 文字・語彙 (1–35) + 文法 (36–58) → /58 · **読解** (59–74) → /16 · **聴解** (75–102) → /28.',
        '② Tra ba bảng quy đổi bên dưới (hoặc tự tính: 言語知識 = đúng × 60 ÷ 58; 読解 = đúng × 60 ÷ 16; 聴解 = đúng × 60 ÷ 28 — làm tròn xuống).',
        '③ Xét đạt: tổng ≥ 95 **và** mỗi mục ≥ 19.',
        '④ Đánh dấu từng câu sai trong bảng "sai câu nào ôn Bài nào" → học lại đúng mục đó (mục **Ôn ngữ pháp** / **Ôn từ vựng – chữ Hán** của bài này gom sẵn) → làm **Đề 2**.',
      ],
    },
    { t: 'h', text: '1. Quy đổi số câu đúng → điểm (ước lượng)' },
    {
      t: 'table',
      caption: '言語知識（文字・語彙・文法）— 58 câu → 60 điểm (điểm liệt 19)',
      head: ['Câu đúng', 'Điểm', 'Câu đúng', 'Điểm', 'Câu đúng', 'Điểm'],
      rows: [
        ['58', '60', '42', '43', '28', '28'],
        ['55', '56', '40', '41', '25', '25'],
        ['52', '53', '38', '39', '22', '22'],
        ['50', '51', '35', '36', '20', '20'],
        ['48', '49', '32', '33', '**19**', '**19** ← vạch liệt'],
        ['45', '46', '30', '31', '18', '18 ✗ dưới liệt'],
      ],
    },
    {
      t: 'table',
      caption: '読解 — 16 câu → 60 điểm (điểm liệt 19) — mỗi câu ≈ 3,75 điểm',
      head: ['Câu đúng', 'Điểm', 'Câu đúng', 'Điểm', 'Câu đúng', 'Điểm'],
      rows: [
        ['16', '60', '12', '45', '8', '30'],
        ['15', '56', '11', '41', '7', '26'],
        ['14', '52', '10', '37', '**6**', '**22** ← cần tối thiểu'],
        ['13', '48', '9', '33', '5', '18 ✗ dưới liệt'],
      ],
    },
    {
      t: 'table',
      caption: '聴解 — 28 câu → 60 điểm (điểm liệt 19)',
      head: ['Câu đúng', 'Điểm', 'Câu đúng', 'Điểm', 'Câu đúng', 'Điểm'],
      rows: [
        ['28', '60', '20', '42', '12', '25'],
        ['26', '55', '18', '38', '10', '21'],
        ['24', '51', '16', '34', '**9**', '**19** ← vạch liệt'],
        ['22', '47', '14', '30', '8', '17 ✗ dưới liệt'],
      ],
    },
    {
      t: 'table',
      caption: 'Ví dụ — đọc kết quả',
      head: ['言語知識 đúng', '読解 đúng', '聴解 đúng', 'Điểm (60 / 60 / 60)', 'Tổng', 'Kết quả'],
      rows: [
        ['45 / 58', '12 / 16', '20 / 28', '46 / 45 / 42', '133', '**合格** — vững, sẵn sàng thi thật'],
        ['35 / 58', '9 / 16', '14 / 28', '36 / 33 / 30', '99', '**合格** — đạt nhưng sát; ôn theo bảng rồi làm Đề 2'],
        ['30 / 58', '8 / 16', '14 / 28', '31 / 30 / 30', '91', '**不合格** — tổng dưới 95'],
        ['52 / 58', '13 / 16', '8 / 28', '53 / 48 / 17', '118', '**不合格** — tổng cao nhưng 聴解 dưới điểm liệt 19'],
        ['50 / 58', '5 / 16', '22 / 28', '51 / 18 / 47', '116', '**不合格** — 読解 dưới điểm liệt (chỉ sai 11 câu đọc!)'],
      ],
    },
    { t: 'h', text: '2. Tự xếp A / B / C như 参考情報 trên bảng điểm JLPT' },
    {
      t: 'table',
      caption: 'A = đúng ≥ 67% · B = 34–66% · C = dưới 34% (N3 chỉ xếp cho 文字・語彙 và 文法)',
      head: ['Mảng', 'Câu', 'A', 'B', 'C — phải học lại trước'],
      rows: [
        ['文字・語彙', '1–35', '24–35', '12–23', '0–11'],
        ['文法', '36–58', '16–23', '8–15', '0–7'],
        ['(読解 — tự đánh giá)', '59–74', '≥ 11 câu: tốt', '6–10', '< 6: dưới điểm liệt'],
        ['(聴解 — tự đánh giá)', '75–102', '≥ 19 câu: tốt', '9–18', '< 9: dưới điểm liệt'],
      ],
    },
    { t: 'h', text: '3. Sai câu nào → ôn Bài nào / mẫu nào' },
    {
      t: 'table',
      caption: '文字・語彙 (1–35)',
      head: ['Câu', 'Nội dung', 'Ôn ở đâu'],
      rows: [
        ['15, 20, 31', 'từ 徹夜 · 乾く · 夢中', 'Bài 26 — Từ vựng (chữ 乾)'],
        ['1, 16, 27', 'chữ 影響 · từ 避難 · 見合わせる', 'Bài 27 — Chữ Hán + Từ vựng (tin tức, thời tiết, giao thông)'],
        ['9, 13, 17, 18', 'chữ 比較 (↔ 批) · 責任 (↔ 積) · từ 主張 · 納得', 'Bài 28 — Chữ Hán + Từ vựng (thảo luận)'],
        ['2, 11', 'chữ 普段 · 調査 (査 ↔ 差)', 'Bài 29 — Chữ Hán'],
        ['12', '勤める ↔ 務める ↔ 努める', 'Bài 30 — Chữ Hán (勤・務) + Bài 21 (努)'],
        ['5, 6, 26, 29', 'chữ 隠す · 詳しい (↔ 細かい) · từ 飽きっぽい · 恐らく', 'Bài 31 — Chữ Hán + Từ vựng (～っぽい)'],
        ['7, 23, 35', 'chữ 発展 · từ 普及 · 手間', 'Bài 32 — Chữ Hán + Từ vựng (thay đổi & phát triển)'],
        ['4', 'từ 減少 (↔ 増加)', 'Bài 33 — Từ vựng (con số & xu hướng)'],
        ['19, 25, 28, 33', 'từ 三日坊主 · つい · 散らかる · 見直す', 'Bài 34 — Từ vựng (thói quen, nhà cửa)'],
        ['8, 24, 30', 'chữ 指摘 · từ 充実 · 気が利く', 'Bài 35 — Chữ Hán + Từ vựng (nơi làm việc)'],
        ['3, 14, 22, 34', 'chữ 距離 · 包装 (↔ 放送) · từ 呼び捨て · 受け入れる', 'Bài 36 — Chữ Hán + Từ vựng (văn hoá, phép lịch sự)'],
        ['10, 32', 'chữ 延期 · từ 配慮', 'Bài 37 — Chữ Hán + Từ vựng'],
        ['21', 'từ 品切れ (↔ 在庫 · 空席)', 'Bài 38 — Từ vựng (thông báo, cửa hàng) · Bài 39 (空席)'],
      ],
    },
    {
      t: 'table',
      caption: '文法 (36–58)',
      head: ['Câu', 'Mẫu', 'Ôn ở đâu'],
      rows: [
        ['36, 55', '～うちに (1) nhân lúc · (2) trong lúc… thì dần', 'Bài 26 — Ngữ pháp ① ② + bảng うちに ↔ 間に ↔ 前に'],
        ['50', 'N の 最中に', 'Bài 26 — Ngữ pháp ⑤'],
        ['37', '～おかげで ↔ せいで', 'Bài 27 — Ngữ pháp ① ③ + bảng phân biệt'],
        ['38', '～くせに ↔ ものの', 'Bài 28 — Ngữ pháp ① ② + bảng のに ↔ くせに ↔ ものの'],
        ['39', '～うえに', 'Bài 29 — Ngữ pháp ⑧'],
        ['40, 53', '～ば～ほど · N さえ～ば', 'Bài 29 — Ngữ pháp ⑥ ⑦'],
        ['41', '～とのことだ', 'Bài 30 — Ngữ pháp ②'],
        ['58', 'N にとって ↔ に対して ↔ として', 'Bài 30 — Ngữ pháp ⑥ ⑦ ⑧'],
        ['42', '～に違いない', 'Bài 31 — Ngữ pháp ①'],
        ['43, 56', '～わけではない', 'Bài 31 — Ngữ pháp ⑥'],
        ['51', '～わけにはいかない', 'Bài 31 — Ngữ pháp ⑦'],
        ['44', 'Vた ものだ (hồi tưởng)', 'Bài 32 — Ngữ pháp ②'],
        ['49', '～につれて', 'Bài 32 — Ngữ pháp ⑥'],
        ['52', 'N によると … そうだ', 'Bài 33 — Ngữ pháp ①'],
        ['45', 'N に基づいて', 'Bài 33 — Ngữ pháp ② + bảng に基づいて ↔ をもとに ↔ に沿って'],
        ['46', 'N 気味 ↔ がち', 'Bài 34 — Ngữ pháp ① ② ③'],
        ['47', 'V(さ)せられる (bị bắt làm)', 'Bài 35 — Ngữ pháp ① ②'],
        ['57', '～ておけばよかった', 'Bài 35 — Ngữ pháp ⑤'],
        ['48', 'お～いたします (khiêm nhường)', 'Bài 37 — Ngữ pháp ① ②'],
        ['54', 'ところが (từ nối nghịch)', 'Bài 38 — Ngữ pháp ①'],
      ],
    },
    {
      t: 'table',
      caption: '読解 (59–74)',
      head: ['Câu', 'Bài đọc — điểm mấu chốt', 'Ôn ở đâu'],
      rows: [
        ['59', 'email công việc — なお / ただし đổi nghĩa câu', 'Bài 38 ⑦ · Bài 37 (email)'],
        ['60', 'thông báo thư viện — loại từng điều kiện, 返却期限', 'Bài 38 (お知らせ, 返却) · chiến thuật 短文'],
        ['61', 'ghi chú — 預かる ↔ 預ける, ～ておく, giờ giấc', 'Bài 30 Từ vựng · Bài 18'],
        ['62', 'đoạn ý kiến — 確かに～だが → ý chính + ～からだ', 'Bài 38 ⑩ ⑪ · Bài 34 (～がち)'],
        ['63, 64, 65', 'tuỳ bút "すみません" — つまり nói lại, 先生によると～そうだ', 'Bài 38 ⑤ · Bài 33 ① · Bài 36 (văn hoá)'],
        ['66, 67, 68', 'báo cáo thực tập — ～てくれた, AよりBのほうが, しかし本当は (ý cũ ↔ ý mới)', 'Bài 35 · Bài 37 (報連相) · Bài 38 ⑪'],
        ['69, 70, 71, 72', 'bình luận dài — ～によると～という, ～うちに, ～わけではない, ～一方だ, ～ではないだろうか', 'Bài 33 ① · Bài 26 ② · Bài 31 ⑥ · Bài 32 ⑧ · Bài 38 ⑩'],
        ['73, 74', 'bảng lớp học — lọc điều kiện, 抽選・先着順・定員, tính tiền', 'Bài 38 — Từ vựng + chiến thuật 情報検索'],
      ],
    },
    {
      t: 'table',
      caption: '聴解 (75–102)',
      head: ['Câu', 'Bài nghe — điều phải bắt', 'Ôn ở đâu'],
      rows: [
        ['75–80', 'làm gì TRƯỚC — việc đã xong (～てある), để sau (あとでいい), người khác làm, ĐỔI Ý giữa chừng', 'Bài 39 ⑨ ⑩ · Bài 18 · Nghe Bài 39 (課題理解)'],
        ['81, 82, 86', 'lý do thật sau 実は — lý do bị phủ định (それも違う · それもあるけど)', 'Bài 39 ⑧ · Nghe Bài 39 (ポイント理解)'],
        ['83', 'thông báo cửa hàng — ございます・いたします, ～割引き, なお', 'Bài 37 · Bài 33 (～割) · Bài 38 ⑦'],
        ['84', 'điều vất vả nhất — loại lần lượt, câu chốt それがいちばん…', 'Bài 39 · Bài 22 (bị động 聞かれる)'],
        ['85', 'điện thoại công việc — 弊社 ↔ 御社, 復唱, 折り返しは結構です', 'Bài 37 ③ ④ · Bài 30'],
        ['87–89', 'ý chính / ý kiến — từ lặp lại, でも, câu kết', 'Bài 39 ⑫ (chiến thuật 概要理解)'],
        ['90–93', 'nói gì — ～ていただけないでしょうか · ～てもいいですか · V(よ)うか · お越しいただき', 'Bài 35 ⑧ ⑨ · Bài 37 · Bài 16 (thể ý chí)'],
        ['94–102', 'đáp nhanh — ～といて, ～ばよかった, ～てあるよね, ～だっけ, お～しますか, せっかく～のに, 思ったほど～ない', 'Bài 39 ① ⑤ · Bài 35 ⑤ · Bài 37 · Bài 29 ②'],
      ],
    },
    {
      t: 'note',
      title: 'Sau khi chấm — học gì trước',
      items: [
        'Mảng nào bị **C** → học lại mảng đó trước (文字・語彙 → mục **Ôn từ vựng – chữ Hán**; 文法 → mục **Ôn ngữ pháp**).',
        '**読解 dưới 10 câu**: thường là do HẾT GIỜ chứ không phải không hiểu. Làm lại phần Đọc của Bài 38 (8 bài + đề mini 30 phút) với đồng hồ, mỗi ngày 2 bài, luôn đọc câu hỏi trước. Ở phần ②, ép 文法 xong trong 20 phút.',
        '**聴解 dưới 15 câu**: mỗi ngày 3 bài nghe của Bài 39 (và Bài 26–37) — lần 1 không chữ, lần 2 bật lời thoại + romaji đọc to theo (shadowing), lần 3 không chữ. Ghi lại **câu then chốt** của mỗi bài vào sổ.',
        'Đếm số câu sai **theo Bài** (cộng các bảng trên): Bài nào sai **≥ 3 câu** → làm lại **Bài tập** + **Luyện thêm** của Bài đó.',
        'Ôn xong (khoảng 1–2 tuần) → làm **Đề 2** (rút gọn, 47 câu). Mục tiêu: tăng ít nhất 10% so với Đề 1 ở mảng yếu nhất.',
      ],
    },
  ],
};

/* ═══════════════════════════ 6. ÔN NGỮ PHÁP N3 ═══════════════════════════ */

const NP_TONG_A: Block = {
  t: 'table',
  caption: 'A. Toàn bộ mẫu ngữ pháp N3 của khoá — Bài 26–31',
  head: ['Bài', 'Mẫu (cách nối)', 'Nghĩa / dùng khi', 'Ví dụ'],
  rows: [
    ['26', 'Vる・Vない・イA・ナAな・Nの ＋ **うちに** (1)', 'nhân lúc còn… (trước khi thay đổi) — vế sau ý chí', '{熱|あつ}いうちに{食|た}べて。(Atsui uchi ni tabete.)'],
    ['26', 'Vている・Vない ＋ **うちに** (2)', 'trong lúc… thì (tự nhiên) đã… — vế sau thay đổi không chủ ý', '{話|はな}しているうちに{仲良|なかよ}くなった。'],
    ['26', 'Vている・Nの ＋ **間**（あいだ）', 'suốt khoảng… — vế sau kéo dài (ずっと～ていた)', '{夏休|なつやす}みの{間|あいだ}、ずっと{実家|じっか}にいた。'],
    ['26', 'Vている・Nの ＋ **間に**', 'trong khoảng… thì (một việc xảy ra / làm xong)', '{留守|るす}の{間|あいだ}に{荷物|にもつ}が{届|とど}いた。'],
    ['26', 'Vている・Nの ＋ **最中に／最中だ**', 'đúng lúc đang giữa chừng thì (bị chen ngang)', '{会議|かいぎ}の{最中|さいちゅう}に{電話|でんわ}が{鳴|な}った。'],
    ['26', 'Vた ＋ **とたん（に）**', 'vừa… thì lập tức (bất ngờ, ngoài ý muốn)', '{立|た}ち{上|あ}がったとたん、めまいがした。'],
    ['27', '普通形 (Nの・ナAな) ＋ **せいで／せいだ** · **せいか**', 'tại vì (kết quả xấu, đổ lỗi) · có lẽ vì', '{雨|あめ}のせいで{試合|しあい}が{中止|ちゅうし}になった。'],
    ['27', '普通形 (Nの・ナAな) ＋ **おかげで／おかげだ**', 'nhờ (kết quả tốt, biết ơn)', '{先生|せんせい}のおかげで{合格|ごうかく}できた。'],
    ['27', '普通形 (Nの) ＋ **ため（に）** — nguyên nhân', 'vì — văn viết, thông báo, tin tức (≠ ために mục đích Bài 21)', '{大雪|おおゆき}のため、{電車|でんしゃ}が{運休|うんきゅう}している。'],
    ['27', 'N ＋ **によって／により／による N**', 'nguyên nhân · phương tiện · tuỳ theo · tác nhân của bị động', '{国|くに}によって{習慣|しゅうかん}が{違|ちが}う。'],
    ['28', '普通形 (ナAな・Nの) ＋ **くせに**', 'đã… mà còn… (chê trách người khác, văn nói)', '{知|し}っているくせに{教|おし}えてくれない。'],
    ['28', '普通形 ＋ **ものの**', 'tuy (đúng là)… nhưng thực tế… (văn viết, chưa như mong đợi)', '{買|か}ったものの、まだ{一度|いちど}も{使|つか}っていない。'],
    ['28', '普通形 (ナA・N: bỏ だ／である) ＋ **にもかかわらず**', 'mặc dù… vẫn (trang trọng, khách quan)', '{雨|あめ}にもかかわらず、{大勢|おおぜい}の{人|ひと}が{集|あつ}まった。'],
    ['28', '**けれども／けど／が**', '"nhưng" — khác mức trang trọng; còn để mở lời, bỏ lửng làm mềm', 'すみませんが、ちょっとよろしいですか。'],
    ['28', 'N ＋ **に対して／に対する N** · ～のに対して', '(1) đối với, hướng tới (2) trái lại, ngược với', '{兄|あに}が{静|しず}かなのに{対|たい}して、{弟|おとうと}はよく{話|はな}す。'],
    ['29', '～**ほど** · N1 は N2 ほど～ない · ～ほど～はない', 'đến mức · không… bằng · không gì… bằng', '{今年|ことし}は{去年|きょねん}ほど{暑|あつ}くない。'],
    ['29', '～**くらい／ぐらい**', 'đến mức (≈ ほど, văn nói) · chỉ… thôi mà (xem nhẹ)', 'あいさつぐらいしなさい。'],
    ['29', '～**ば～ほど**', 'càng… càng…', '{練習|れんしゅう}すればするほど{上手|じょうず}になる。'],
    ['29', 'N **さえ** ～ば · Vます さえすれば', 'chỉ cần… là · (Nさえ) ngay cả', '{時間|じかん}さえあれば{行|い}ける。'],
    ['29', '普通形 (ナAな・Nの) ＋ **うえ（に）**', 'không những… mà còn… (cùng chiều)', 'この{店|みせ}は{安|やす}いうえに、おいしい。'],
    ['30', '普通形 ＋ **って** · ～んだって', 'truyền lời thân mật: nghe nói / bảo là', '{明日|あした}、{休講|きゅうこう}だって。'],
    ['30', '普通形 ＋ **とのことだ**', 'chuyển lời nhắn (trang trọng)', '{少|すこ}し{遅|おく}れるとのことです。'],
    ['30', '普通形 ＋ **ということだ** (1)(2)', '(1) nghe nói, được biết (2) tức là, có nghĩa là', 'つまり、{中止|ちゅうし}ということですね。'],
    ['30', '普通形 ＋ **とか**', 'nghe đâu (không chắc)', '{来月|らいげつ}{結婚|けっこん}するとか。'],
    ['30', 'N ＋ **にとって** · N ＋ **として**', 'đối với (góc nhìn) · với tư cách, vai trò', '{私|わたし}にとって{大切|たいせつ}な{経験|けいけん}だ。'],
    ['31', '普通形 (ナA・N bỏ だ) ＋ **に違いない**', 'chắc chắn là (tin chắc, chủ quan)', '{犯人|はんにん}はあの{人|ひと}に{違|ちが}いない。'],
    ['31', '普通形 (ナAな・Nの) ＋ **はずがない** · **わけがない**', 'không lẽ nào (có căn cứ) · làm gì có chuyện (mạnh, chủ quan)', '{彼|かれ}が{嘘|うそ}をつくはずがない。'],
    ['31', 'N・Vます・イA bỏ い ＋ **っぽい**', 'có vẻ, ngả về; hay…', '{忘|わす}れっぽい · {子|こ}どもっぽい'],
    ['31', '普通形 (ナAな・Nの) ＋ **わけだ**', 'thảo nào · tức là', '{道理|どうり}で{寒|さむ}いわけだ。'],
    ['31', '～**わけではない** · ～ないわけではない', 'không hẳn là · không phải là không', '{嫌|きら}いなわけではない。'],
    ['31', 'Vる ＋ **わけにはいかない** · Vない＋わけにはいかない', 'không thể (vì lẽ phải) · không thể không', '{大事|だいじ}な{日|ひ}だから、{休|やす}むわけにはいかない。'],
  ],
};

const NP_TONG_B: Block = {
  t: 'table',
  caption: 'B. Toàn bộ mẫu ngữ pháp N3 của khoá — Bài 32–39',
  head: ['Bài', 'Mẫu (cách nối)', 'Nghĩa / dùng khi', 'Ví dụ'],
  rows: [
    ['32', 'Vる・Vない・イA・ナAな ＋ **ものだ** · ものではない', 'lẽ thường, bản chất · không nên (theo lẽ thường)', '{人|ひと}の{話|はなし}は{最後|さいご}まで{聞|き}くものだ。'],
    ['32', 'Vた ＋ **ものだ**', 'hồi ấy thường hay… (hồi tưởng thói quen xưa)', 'よくこの{川|かわ}で{遊|あそ}んだものだ。'],
    ['32', '～**ものだ** (cảm thán) · ～たいものだ', 'thật là…! · mong sao…', '{時|とき}が{経|た}つのは{早|はや}いものだ。'],
    ['32', 'Vる・Vない ＋ **ことだ** · Vる ＋ **ことはない**', 'nên…, tốt nhất là (lời khuyên) · không cần phải', '{心配|しんぱい}することはないよ。'],
    ['32', 'Vる・N ＋ **につれて**', 'càng… thì càng / theo đà', '{年|とし}をとるにつれて、{体力|たいりょく}が{落|お}ちる。'],
    ['32', 'Vる・N ＋ **にしたがって**', '(1) theo đà (2) tuân theo (につれて KHÔNG có nghĩa 2)', '{係員|かかりいん}の{指示|しじ}にしたがってください。'],
    ['32', 'Vる (thay đổi) ＋ **一方だ**', 'ngày càng…, cứ thế mãi (một chiều)', '{物価|ぶっか}は{上|あ}がる{一方|いっぽう}だ。'],
    ['33', 'N ＋ **によると／によれば**', 'theo (nguồn tin) — vế sau ～そうだ／～とのことだ／～らしい', '{天気予報|てんきよほう}によると、{明日|あした}は{雪|ゆき}だそうだ。'],
    ['33', 'N ＋ **に基づいて／に基づく N**', 'dựa trên, căn cứ vào (dữ liệu, sự thật, luật)', 'データに{基|もと}づいて{判断|はんだん}する。'],
    ['33', 'N ＋ **をもとに（して）／をもとにした N**', 'lấy… làm chất liệu / nền (tạo cái mới)', '{実話|じつわ}をもとにした{映画|えいが}'],
    ['33', 'N ＋ **に沿って／に沿った N**', 'dọc theo · theo đúng, bám sát (kế hoạch, mong muốn)', '{計画|けいかく}に{沿|そ}って{進|すす}める。'],
    ['33', 'N・Vる ＋ **とともに**', '(a) cùng với (b) đồng thời (c) theo đà', '{家族|かぞく}とともに{暮|く}らす。'],
    ['33', 'N ＋ **を中心に（して）／を中心とした N**', 'lấy… làm trung tâm, chủ yếu ở', '{若者|わかもの}を{中心|ちゅうしん}に{人気|にんき}がある。'],
    ['34', 'Vます・N ＋ **がちだ**', 'hay bị, dễ có xu hướng (xấu, lặp lại)', '{冬|ふゆ}は{運動不足|うんどうぶそく}になりがちだ。'],
    ['34', 'Vます・N ＋ **気味**', 'hơi có vẻ, hơi bị (đang có, mức nhẹ)', '{少|すこ}し{風邪気味|かぜぎみ}だ。'],
    ['34', 'Vます ＋ **っぱなし** · Vた ＋ まま', 'để nguyên / cứ… suốt · giữ nguyên trạng thái', '{電気|でんき}をつけっぱなしにする。'],
    ['34', 'V(よ)う ＋ **とする** · ～ようとしない', 'định / cố làm · vừa định thì… · không chịu', '{出|で}かけようとしたとき、{雨|あめ}が{降|ふ}り{出|だ}した。'],
    ['34', '普通形 ＋ **としたら／とすれば／とすると**', 'giả sử… thì · nếu đúng là… thì', '{宝|たから}くじが{当|あ}たったとしたら、{何|なに}をする？'],
    ['35', 'V **させられる** (使役受身)', 'bị bắt làm · bị khiến cho (cảm xúc: 考えさせられる)', '{部長|ぶちょう}に{三回|さんかい}も{書|か}き{直|なお}させられた。'],
    ['35', 'V **させていただく**', '(khiêm nhường) thông báo việc mình làm · cảm ơn · xin phép', '{本日|ほんじつ}は{休|やす}ませていただきます。'],
    ['35', '～**ばよかった** · ～ばよかったのに · ～ばいいのに', 'giá mà đã… (tiếc việc của mình) · phải chi (người khác)', 'もっと{早|はや}く{聞|き}けばよかった。'],
    ['35', '～**ていただけないでしょうか** · お／ご～いただけないでしょうか', 'nhờ vả lịch sự bậc cao (+ クッション言葉)', 'お{手数|てすう}ですが、ご{確認|かくにん}いただけないでしょうか。'],
    ['36', 'N **というのは** ～ことだ · ～。というのは～からだ', 'định nghĩa (văn nói lịch sự) · sở dĩ… là vì', '「{割|わ}り{勘|かん}」というのは、{皆|みな}で{同|おな}じ{金額|きんがく}を{払|はら}うことです。'],
    ['36', 'N **とは** ～ことだ · 普通形＋とは', 'định nghĩa (văn viết) · không ngờ…!', 'まさか{彼|かれ}が{来|く}るとは{思|おも}わなかった。'],
    ['36', '「X」は「Y」**という意味だ** · ～**ということは**～ということだ', 'X nghĩa là Y · việc… có nghĩa là…', '{満席|まんせき}ということは、{入|はい}れないということだ。'],
    ['36', '～**とか**～とか · ～**やら**～**やら**', 'liệt kê ví dụ (nói) · nào là… nào là… (lộn xộn, cảm xúc lẫn lộn)', 'うれしいやら{恥|は}ずかしいやら'],
    ['36', '～**にしても** · ～にしても～にしても', 'dù là… thì cũng · dù A hay B', '{冗談|じょうだん}にしても、{言|い}いすぎだ。'],
    ['37', '**敬語** 5 loại: 尊敬語・謙譲語Ⅰ・謙譲語Ⅱ・丁寧語・美化語', 'ai làm? hướng tới ai? nói với ai? + うち・そと (弊社 ↔ 御社)', '{森|もり}はただいま{席|せき}を{外|はず}しております。'],
    ['38', '**接続詞**: しかし・ところが／だから・その結果／さらに・しかも／一方・逆に／つまり・要するに／なぜなら／ただし・なお', 'tín hiệu đọc hiểu: nghịch · thuận · thêm · đối chiếu · tóm · lý do · bổ sung', 'ただし、{当日|とうじつ}の{申|もう}し{込|こ}みはできません。'],
    ['39', '**văn nói rút gọn**: ～てる・～とく・～ちゃう・～なきゃ・～って・～じゃん・～っけ', 'NGHE ra các mẫu đã học khi nói nhanh', '{資料|しりょう}、まとめといて。(= まとめておいて)'],
  ],
};

const NP_THOI_DIEM: Block = {
  t: 'table',
  caption: 'Nhóm hay nhầm ① — THỜI ĐIỂM: うちに · 間 · 間に · 最中に · とたん · 前に (Bài 26)',
  head: ['Mẫu', 'Vế sau', 'Dấu hiệu nhận ra', 'Ví dụ'],
  rows: [
    ['うちに (1)', 'ý chí (làm ngay kẻo muộn)', 'trạng thái SẮP thay đổi: 若い・熱い・明るい・～ないうちに', '{忘|わす}れないうちにメモしておこう。'],
    ['うちに (2)', 'thay đổi KHÔNG chủ ý (～ようになった・～てきた)', 'việc lặp lại, kéo dài: ～ているうちに', '{聞|き}いているうちに{眠|ねむ}くなった。'],
    ['間（あいだ）', 'việc KÉO DÀI suốt khoảng đó', 'ずっと・～ていた', '{待|ま}っている{間|あいだ}、ずっと{本|ほん}を{読|よ}んでいた。'],
    ['間に', 'một việc XONG / xảy ra trong khoảng đó', 'vế sau là điểm, không kéo dài', '{寝|ね}ている{間|あいだ}に{雨|あめ}が{止|や}んだ。'],
    ['最中に', 'bị CHEN NGANG (thường không mong muốn)', 'N の・Vている ＋ 最中に', '{食事|しょくじ}の{最中|さいちゅう}に{地震|じしん}が{起|お}きた。'],
    ['たとたん', 'việc BẤT NGỜ xảy ra ngay — KHÔNG dùng ý chí của mình', 'Vた ＋ とたん', '{外|そと}に{出|で}たとたん、{雨|あめ}が{降|ふ}ってきた。'],
    ['前に (ポイント 106)', 'trình tự đơn thuần', 'Vる ＋ 前に', '{寝|ね}る{前|まえ}に{歯|は}を{磨|みが}く。'],
  ],
};

const NP_NGUYEN_NHAN: Block = {
  t: 'table',
  caption: 'Nhóm hay nhầm ② — NGUYÊN NHÂN: せいで · おかげで · ため · によって · から／ので · で (Bài 27)',
  head: ['Mẫu', 'Kết quả', 'Sắc thái / văn phong', 'Ví dụ'],
  rows: [
    ['せいで／せいか', 'XẤU', 'đổ lỗi; せいか = "có lẽ vì"', '{寝不足|ねぶそく}のせいか、{頭|あたま}が{痛|いた}い。'],
    ['おかげで', 'TỐT (mỉa mai: xấu)', 'biết ơn', 'みんなのおかげで{成功|せいこう}した。'],
    ['ため（に）', 'trung tính', 'văn viết, thông báo — vế sau KHÔNG nhờ / rủ', '{工事|こうじ}のため、{通行止|つうこうど}めです。'],
    ['によって／により', 'trung tính', 'tin tức, rất trang trọng; còn nghĩa phương tiện / tuỳ theo / tác nhân', '{台風|たいふう}により、{多|おお}くの{便|びん}が{欠航|けっこう}した。'],
    ['から／ので', 'mọi loại', 'から chủ quan (vế sau nhờ / ra lệnh được); ので khách quan, mềm', '{危|あぶ}ないから、{入|はい}らないで。'],
    ['N で (ポイント 124)', 'mọi loại', 'ngắn, chỉ đi với danh từ', '{風邪|かぜ}で{学校|がっこう}を{休|やす}んだ。'],
  ],
};

const NP_NGUOC_Y: Block = {
  t: 'table',
  caption: 'Nhóm hay nhầm ③ — NGƯỢC Ý: のに · くせに · ものの · にもかかわらず · けれども (Bài 19, 28)',
  head: ['Mẫu', 'Cảm xúc', 'Nói / viết', 'Chủ ngữ', 'Ví dụ'],
  rows: [
    ['のに', 'tiếc, bất mãn, ngạc nhiên', 'cả hai', 'tự do', '{約束|やくそく}したのに、{来|こ}なかった。'],
    ['くせに', 'CHÊ, khinh (mạnh)', 'văn nói', 'cùng chủ ngữ, là NGƯỜI KHÁC', '{子|こ}どものくせに{生意気|なまいき}だ。'],
    ['ものの', 'trung tính — "đúng là A, nhưng thực tế chưa như mong"', 'văn viết', 'tự do (cả bản thân)', '{免許|めんきょ}は{取|と}ったものの、{運転|うんてん}していない。'],
    ['にもかかわらず', 'khách quan, trang trọng', 'văn viết, tin tức', 'tự do', '{平日|へいじつ}にもかかわらず、{会場|かいじょう}は{満員|まんいん}だった。'],
    ['けれども／けど／が', 'nhẹ', 'けれども → けど (nói) → が (cả hai)', 'tự do', '{高|たか}いけど、おいしい。'],
  ],
};

const NP_MUC_DO: Block = {
  t: 'table',
  caption: 'Nhóm hay nhầm ④ — MỨC ĐỘ · ĐIỀU KIỆN · THÊM VÀO: ほど · くらい · ば～ほど · さえ～ば · だけ／しか · うえに · し (Bài 29)',
  head: ['Mẫu', 'Phân biệt', 'Ví dụ'],
  rows: [
    ['ほど ↔ くらい', 'cùng "đến mức"; くらい văn nói hơn. Chỉ **くらい** có nghĩa xem nhẹ ("ít nhất cũng"); chỉ **ほど** dùng trong ～ほど～ない so sánh chuẩn', '{泣|な}きたいほど{痛|いた}い · {電話|でんわ}くらいしてよ'],
    ['ば～ほど ↔ につれて', 'ば～ほど: quy luật chung "càng… càng" · につれて: thay đổi diễn ra theo thời gian (Bài 32)', '{考|かんが}えれば{考|かんが}えるほどわからない'],
    ['さえ～ば ↔ だけ ↔ しか～ない', 'さえ～ば: điều kiện TỐI THIỂU là đủ · だけ: chỉ (trung tính) · しか～ない: chỉ (chê ít, luôn phủ định)', '{薬|くすり}さえ{飲|の}めば{治|なお}る · {百円|ひゃくえん}しかない'],
    ['うえに ↔ し ↔ しかも・その上', 'うえに: cộng dồn cùng chiều, vế sau KHÔNG nhờ / ra lệnh · し: liệt kê lý do (Bài 17) · しかも／その上: từ nối đầu câu', '{雨|あめ}が{降|ふ}っているうえに、{風|かぜ}も{強|つよ}い'],
  ],
};

const NP_TRUYEN_LOI: Block = {
  t: 'table',
  caption: 'Nhóm hay nhầm ⑤ — TRUYỀN LỜI & GÓC NHÌN: って · そうだ · とのことだ · ということだ · らしい · とか · にとって · に対して · として (Bài 20, 28, 30)',
  head: ['Mẫu', 'Dùng khi', 'Mức trang trọng', 'Ví dụ'],
  rows: [
    ['～って／～んだって', 'kể lại lời / tin với bạn bè', 'thân mật', '{明日|あした}{休|やす}みだって。'],
    ['～そうだ (ポイント 119)', 'nghe / đọc được, chép lại tin', 'trung tính', '{雪|ゆき}が{降|ふ}るそうだ。'],
    ['～とのことだ', 'CHUYỂN LỜI NHẮN của một người cụ thể', 'trang trọng (công việc)', '{後|あと}でお{電話|でんわ}するとのことです。'],
    ['～ということだ', '(1) tin có nguồn rõ, khách quan (2) tóm lại "tức là"', 'trang trọng', '{会議|かいぎ}は{中止|ちゅうし}ということだ。'],
    ['～らしい (Bài 20)', 'suy đoán từ thông tin nghe được', 'trung tính', '{彼|かれ}、{引|ひ}っ{越|こ}すらしいよ。'],
    ['～とか', '"nghe đâu" — không chắc chắn', 'thân mật', '{来月|らいげつ}{帰国|きこく}するとか。'],
    ['にとって', 'đánh giá từ GÓC NHÌN của N (大切だ・難しい・ありがたい)', '—', '{学生|がくせい}にとって{奨学金|しょうがくきん}はありがたい。'],
    ['に対して', 'HÀNH ĐỘNG / thái độ hướng TỚI N; hoặc đối chiếu', '—', 'お{客様|きゃくさま}に{対|たい}して{丁寧|ていねい}に{話|はな}す。'],
    ['として', 'VAI TRÒ, tư cách', '—', '{通訳|つうやく}として{会議|かいぎ}に{出|で}た。'],
  ],
};

const NP_SUY_LUAN: Block = {
  t: 'table',
  caption: 'Nhóm hay nhầm ⑥ — SUY LUẬN & わけ: に違いない · はずだ · だろう · かもしれない · はずがない · わけがない · わけだ · わけではない · わけにはいかない (Bài 20, 31)',
  head: ['Mẫu', 'Nghĩa', 'Độ chắc / sắc thái', 'Ví dụ'],
  rows: [
    ['に違いない', 'chắc chắn là', '★★★★ tin chắc, chủ quan, văn viết', '{彼|かれ}が{犯人|はんにん}に{違|ちが}いない。'],
    ['はずだ', 'lẽ ra, chắc là (có căn cứ logic)', '★★★', 'もう{着|つ}いたはずだ。'],
    ['だろう／でしょう', 'có lẽ', '★★', '{明日|あした}は{晴|は}れるだろう。'],
    ['かもしれない', 'có thể', '★', '{遅|おく}れるかもしれない。'],
    ['はずがない ↔ わけがない', 'không lẽ nào ↔ làm gì có chuyện', 'はず: dựa căn cứ · わけ: mạnh, cảm tính', 'そんなこと、できるわけがない。'],
    ['わけだ ↔ はずだ', 'わけだ: hiểu ra kết luận SAU khi biết lý do ("thảo nào") · はずだ: suy ra TRƯỚC', '—', '{窓|まど}が{開|あ}いていた。{寒|さむ}いわけだ。'],
    ['わけではない ↔ ないわけではない', 'không hẳn là ↔ không phải là không (có một chút)', 'phủ định MỘT PHẦN', '{行|い}きたくないわけではない。'],
    ['わけにはいかない', 'không thể (vì lẽ phải, trách nhiệm) ≠ Vられない (không có khả năng)', '—', '{約束|やくそく}したから、やめるわけにはいかない。'],
  ],
};

const NP_BIEN_DOI: Block = {
  t: 'table',
  caption: 'Nhóm hay nhầm ⑦ — BIẾN ĐỔI & CĂN CỨ: につれて · にしたがって · とともに · 一方だ · によると · に基づいて · をもとに · に沿って (Bài 32, 33)',
  head: ['Mẫu', 'Phân biệt', 'Ví dụ'],
  rows: [
    ['につれて ↔ にしたがって ↔ とともに', 'cả ba = "theo đà"; にしたがって còn "tuân theo" (指示・ルール); とともに còn "cùng với / đồng thời", trang trọng nhất', '{経済|けいざい}の{発展|はってん}とともに、{生活|せいかつ}が{変|か}わった。'],
    ['一方だ', 'thay đổi MỘT CHIỀU không dừng (thường xấu) — V辞書形 chỉ biến đổi (増える・減る・悪化する)', '{人口|じんこう}は{減|へ}る{一方|いっぽう}だ。'],
    ['によると', 'NGUỒN tin — vế sau phải là truyền tin (～そうだ／とのことだ) hoặc ～ことがわかった', '{調査|ちょうさ}によると、{半数|はんすう}がスマホで{本|ほん}を{読|よ}むそうだ。'],
    ['に基づいて ↔ をもとに', '基づいて: căn cứ CHẶT, không lệch (データ・法律・事実) · をもとに: lấy làm CHẤT LIỆU rồi sáng tạo thêm (小説・映画)', '{事実|じじつ}に{基|もと}づいた{報告|ほうこく} · {昔話|むかしばなし}をもとにした{劇|げき}'],
    ['に沿って', 'dọc theo (川・道) · theo đúng (計画・マニュアル・希望)', 'お{客様|きゃくさま}の{希望|きぼう}に{沿|そ}ったプラン'],
  ],
};

const NP_TRANG_THAI: Block = {
  t: 'table',
  caption: 'Nhóm hay nhầm ⑧ — XU HƯỚNG · TRẠNG THÁI · GIẢ ĐỊNH: がち · 気味 · っぽい · っぱなし · たまま · ようとする · としたら (Bài 31, 34)',
  head: ['Mẫu', 'Nghĩa', 'Dấu hiệu', 'Ví dụ'],
  rows: [
    ['がち', 'hay bị (LẶP LẠI thành xu hướng, xấu)', 'つい・どうしても・冬は', '{雨|あめ}の{日|ひ}は{家|いえ}にこもりがちだ。'],
    ['気味', 'hơi bị (ĐANG có, mức nhẹ)', '少し・ちょっと・最近', 'ちょっと{寝不足気味|ねぶそくぎみ}だ。'],
    ['っぽい', 'có vẻ / ngả về / hay (tính chất)', 'N・Vます・イA', '{熱|ねつ}っぽい · {怒|おこ}りっぽい'],
    ['っぱなし ↔ たまま', 'っぱなし: để nguyên (thường CHÊ) / cứ… suốt · たまま: chỉ tả trạng thái giữ nguyên', '—', '{水|みず}を{出|だ}しっぱなしにしないで · {靴|くつ}を{履|は}いたまま{入|はい}る'],
    ['ようとする ↔ つもり ↔ ようと思う', 'ようとする: cố / sắp làm (thấy được từ ngoài) · つもり: ý định đã quyết · ようと思う: đang tính', '—', '{寝|ね}ようとしたら、{電話|でんわ}が{鳴|な}った。'],
    ['としたら ↔ たら ↔ なら', 'としたら: GIẢ ĐỊNH xa thực tế / giả sử điều nghe được là đúng · たら: điều kiện thường · なら: nhặt chủ đề người kia nói', '仮に・もし', '{仮|かり}に{百万円|ひゃくまんえん}あるとしたら？'],
  ],
};

const NP_KHUYEN: Block = {
  t: 'table',
  caption: 'Nhóm hay nhầm ⑨ — LỜI KHUYÊN & TIẾC: ものだ · ことだ · ほうがいい · ばよかった · ばよかったのに · ばいいのに (Bài 32, 35)',
  head: ['Mẫu', 'Nói về', 'Ví dụ'],
  rows: [
    ['ものだ', 'LẼ THƯỜNG, chung cho mọi người (không chỉ một ai)', '{学生|がくせい}は{勉強|べんきょう}するものだ。'],
    ['ことだ', 'lời khuyên CỤ THỂ của người trên cho một người', '{合格|ごうかく}したいなら、{毎日|まいにち}{練習|れんしゅう}することだ。'],
    ['ほうがいい (ポイント 105)', 'lời khuyên thường ngày, mềm', '{早|はや}く{寝|ね}たほうがいいよ。'],
    ['ばよかった', 'TIẾC việc của MÌNH (đã không làm / đã làm)', '{傘|かさ}を{持|も}ってくればよかった。'],
    ['ばよかったのに', 'tiếc / trách nhẹ chuyện của NGƯỜI KHÁC', '{言|い}ってくれればよかったのに。'],
    ['ばいいのに', 'mong / gợi ý cho hiện tại – tương lai', '{少|すこ}し{休|やす}めばいいのに。'],
  ],
};

const NP_GIAI_THICH: Block = {
  t: 'table',
  caption: 'Nhóm hay nhầm ⑩ — GIẢI THÍCH · LIỆT KÊ · NHƯỢNG BỘ: というのは · とは · って · とか · やら · たり · にしても · ても (Bài 36)',
  head: ['Mẫu', 'Phân biệt', 'Ví dụ'],
  rows: [
    ['というのは ↔ とは ↔ って', 'cùng định nghĩa: というのは (nói lịch sự) · とは (viết, tiêu đề) · って (nói thân mật)', '「KY」って{何|なん}？'],
    ['とか～とか ↔ やら～やら ↔ たり～たり', 'とか: ví dụ (nói) · やら: nhiều thứ lộn xộn, cảm xúc lẫn lộn · たり: liệt kê HÀNH ĐỘNG', '{泣|な}いたり{笑|わら}ったり · {驚|おどろ}くやら{喜|よろこ}ぶやら'],
    ['にしても ↔ ても', 'にしても: "dù (chấp nhận điều đó) thì cũng…", hay đi với N / 疑問詞 · ても: điều kiện ngược thông thường', 'いずれにしても、{連絡|れんらく}します。'],
  ],
};

const ON_NGU_PHAP: Lesson = {
  id: 'b40-on-tap-ngu-phap',
  kind: 'review',
  title: 'Ôn tập N3 · Tổng ôn ngữ pháp — mọi mẫu N3 Bài 26–39, 10 nhóm hay bị gài nhầm, 45 câu + 8 câu ghép',
  goal: 'Nhìn lại một lượt MỌI mẫu ngữ pháp N3 của khoá (mẫu · cách nối · nghĩa · ví dụ · ở Bài nào), nắm chắc 10 nhóm đề N3 hay gài bẫy nhất (thời điểm, nguyên nhân, ngược ý, mức độ, truyền lời, suy luận, biến đổi – căn cứ, trạng thái, lời khuyên – tiếc, giải thích – liệt kê) và làm 45 câu kiểu 文法形式の判断 + 8 câu ghép để tự kiểm tra.',
  minutes: 100,
  blocks: [
    {
      t: 'recap',
      title: 'Cách dùng mục này',
      items: [
        'Đọc lướt bảng A và B, **đánh dấu mẫu nào nhìn vào chưa tự đặt được một câu** → mở lại đúng Bài ghi ở cột đầu.',
        'Mười bảng ① – ⑩ là nơi đề N3 "đặt bẫy": mỗi câu 文法形式 thường có 2 đáp án cùng nhóm. Đọc to ví dụ mỗi bảng 2 lần.',
        'Làm 45 câu (3 nhóm × 15) + 8 câu ghép. Câu sai: đọc giải thích, rồi tự đặt **1 câu mới** bằng mẫu đó và ghi vào sổ.',
      ],
    },
    { t: 'h', text: '1. Toàn bộ mẫu ngữ pháp N3 của khoá' },
    NP_TONG_A,
    NP_TONG_B,
    { t: 'h', text: '2. Mười nhóm hay bị gài nhầm — đề N3 hỏi đúng chỗ này' },
    NP_THOI_DIEM,
    {
      t: 'note',
      title: 'Mẹo chọn nhanh nhóm thời điểm',
      items: [
        'Vế sau là **ý chí của mình** (～よう・～ておきたい・～てください) ⇒ chỉ **うちに (1)**; たとたん KHÔNG BAO GIỜ đi với ý chí.',
        'Có **ずっと** / vế sau kéo dài ⇒ **間**; vế sau là một việc xong / xảy ra ⇒ **間に**.',
        'Có cảm giác "bị chen ngang đúng lúc đang dở" ⇒ **最中に**; "vừa… thì bất ngờ" ⇒ **たとたん**.',
      ],
    },
    NP_NGUYEN_NHAN,
    NP_NGUOC_Y,
    {
      t: 'note',
      title: 'Bẫy kinh điển của nhóm ngược ý',
      items: [
        'Câu **khen** hoặc nói về chính mình ⇒ KHÔNG dùng **くせに** (chỉ để chê người khác): {若|わか}いのに{丁寧|ていねい}だ ✓ — ~~{若|わか}いくせに{丁寧|ていねい}だ~~.',
        'Vế sau là **nhờ / rủ / ra lệnh** ⇒ không dùng ものの・にもかかわらず・うえに (văn khách quan).',
        'ものの = "đúng là A (thừa nhận), nhưng…": ～たものの thường kể việc đã làm mà kết quả chưa tới ({始|はじ}めたものの、{続|つづ}かない).',
      ],
    },
    NP_MUC_DO,
    NP_TRUYEN_LOI,
    NP_SUY_LUAN,
    {
      t: 'note',
      title: 'Phân biệt nhanh bốn mẫu わけ',
      items: [
        '**わけだ** = "thảo nào" (hiểu ra) · **わけがない** = "làm gì có" (phủ định 100%) · **わけではない** = "không hẳn" (phủ định một phần) · **わけにはいかない** = "không thể (vì lẽ phải)".',
        'Mẹo: câu sau có **でも / が + ý ngược nhẹ** ⇒ thường là わけではない ({嫌|きら}いなわけではないが…). Câu có **大事な・約束した・責任** ⇒ わけにはいかない.',
      ],
    },
    NP_BIEN_DOI,
    NP_TRANG_THAI,
    NP_KHUYEN,
    NP_GIAI_THICH,
    {
      t: 'note',
      title: 'Kính ngữ & sai khiến bị động — 4 lỗi đề N3 hay bắt (Bài 35, 37)',
      items: [
        'Việc của MÌNH hướng tới khách: お／ご～**する・いたす** (お{届|とど}けいたします) — việc của KHÁCH: お／ご～**になる・ください** (ご{記入|きにゅう}ください).',
        'Nói về sếp mình với người NGOÀI công ty: không kính ngữ, không さん: 「{森|もり}は{外出|がいしゅつ}しております」.',
        'させられる = **bị BẮT** (khó chịu) ↔ させてもらう／させていただく = **được CHO PHÉP** (biết ơn) — cùng sai khiến, khác hẳn cảm xúc.',
        'Nhóm 1 tận cùng **す** không rút gọn: {話|はな}させられる (~~{話|はな}さされる~~); nhóm 1 khác rút được: {待|ま}たされる・{飲|の}まされる.',
      ],
    },
    { t: 'h', text: '3. Luyện tập — 45 câu + 8 câu ghép' },
    MCQ('b40-np-1', 'Nhóm 1 — thời điểm, nguyên nhân, ngược ý, mức độ (15 câu)', [
      QP('（1）{暗|くら}くならない（　）、{家|いえ}に{帰|かえ}りましょう。', 'うちに', ['{間|あいだ}に', '{最中|さいちゅう}に', 'とたんに'], 0,
        'Trước khi trời tối (trạng thái sắp thay đổi) + vế sau rủ rê ⇒ **Vない＋うちに** (kuraku naranai uchi ni) — Bài 26 ①.'),
      QP('（2）{夏休|なつやす}みの（　）、ずっと{国|くに}に{帰|かえ}っていた。', '{間|あいだ}', ['{間|あいだ}に', 'うちに', '{最中|さいちゅう}に'], 1,
        'Có **ずっと** + vế sau kéo dài (～ていた) ⇒ **Nの間** (natsuyasumi no aida) — Bài 26 ③. 間に đòi vế sau là một việc xảy ra / xong.'),
      QP('（3）{授業|じゅぎょう}の（　）に、{携帯電話|けいたいでんわ}が{鳴|な}ってしまった。', '{最中|さいちゅう}', ['とたん', 'うち', 'くせ'], 2,
        'Đúng lúc đang giữa giờ học thì bị chen ngang (～てしまった) ⇒ **Nの最中に** (jugyou no saichuu ni) — Bài 26 ⑤. とたん cần Vた; "授業のうちに" không tự nhiên.'),
      QP('（4）ドアを{開|あ}けた（　）、{猫|ねこ}が{飛|と}び{出|だ}してきた。', 'とたん', ['{最中|さいちゅう}', 'うち', '{間|あいだ}'], 3,
        'Vừa mở cửa thì BẤT NGỜ mèo lao ra ⇒ **Vた＋とたん** (aketa totan) — Bài 26 ⑥.'),
      QP('（5）{寝坊|ねぼう}した（　）、{電車|でんしゃ}に{乗|の}り{遅|おく}れた。', 'せいで', ['おかげで', 'くせに', 'ものの'], 0,
        'Kết quả xấu do lỗi (ngủ quên) ⇒ **せいで** (nebou shita sei de) — Bài 27 ①.'),
      QP('（6）{最近|さいきん}{寝不足|ねぶそく}の（　）、{仕事|しごと}に{集中|しゅうちゅう}できない。', 'せいか', ['おかげか', 'くせに', 'うえに'], 1,
        '"Có lẽ vì thiếu ngủ" (không chắc) ⇒ **Nのせいか** (nebusoku no sei ka) — Bài 27 ②. おかげか dùng cho kết quả tốt.'),
      QP('（7）{大雪|おおゆき}の（　）、{本日|ほんじつ}の{授業|じゅぎょう}は{休講|きゅうこう}とします。', 'ため', ['おかげで', 'くせに', 'とたん'], 2,
        'Thông báo trang trọng, nguyên nhân khách quan ⇒ **Nのため** (ooyuki no tame) — Bài 27 ④.'),
      QP('（8）この{料理|りょうり}の{作|つく}り{方|かた}は、{地域|ちいき}（　）{少|すこ}しずつ{違|ちが}う。', 'によって', ['にとって', 'に{対|たい}して', 'として'], 3,
        '"Tuỳ theo vùng mà khác nhau" ⇒ **Nによって～違う** (chiiki ni yotte chigau) — Bài 27 ⑦.'),
      QP('（9）{彼|かれ}はまだ{若|わか}い（　）、{言葉遣|ことばづか}いがとても{丁寧|ていねい}だ。', 'のに', ['くせに', 'おかげで', 'せいで'], 0,
        'Câu KHEN, trái với dự đoán ⇒ **のに** (wakai noni). くせに chỉ dùng để chê — Bài 28 bảng ⑦.'),
      QP('（10）{一生懸命|いっしょうけんめい}{勉強|べんきょう}した（　）、{試験|しけん}には{合格|ごうかく}できなかった。', 'ものの', ['くせに', 'おかげで', 'うえに'], 1,
        '"Đúng là đã học chăm, nhưng kết quả không như mong" ⇒ **Vたものの** (benkyou shita mono no) — Bài 28 ②. くせに không dùng cho chính mình.'),
      QP('（11）{台風|たいふう}が{近|ちか}づいている（　）、{多|おお}くの{人|ひと}が{海|うみ}に{来|き}ていた。', 'にもかかわらず', ['おかげで', 'ために', 'うちに'], 2,
        'Khách quan, kiểu tin tức: "mặc dù bão đến gần vẫn…" ⇒ **にもかかわらず** — Bài 28 ③.'),
      QP('（12）{今年|ことし}の{夏|なつ}は、{去年|きょねん}（　）{暑|あつ}くない。', 'ほど', ['ばかり', 'さえ', 'だけ'], 3,
        '**N1はN2ほど～ない** = không… bằng (kyonen hodo atsuku nai) — Bài 29 ②.'),
      QP('（13）{時間|じかん}（　）あれば、もっと{上手|じょうず}に{書|か}けたのに。', 'さえ', ['ほど', 'くらい', 'うえに'], 0,
        'Điều kiện tối thiểu "chỉ cần có thời gian" ⇒ **Nさえ～ば** (jikan sae areba) — Bài 29 ⑦; ～のに cuối câu = tiếc.'),
      QP('（14）あの{店|みせ}は{値段|ねだん}が{高|たか}い（　）、{店員|てんいん}の{態度|たいど}も{悪|わる}い。', 'うえに', ['くせに', 'ものの', 'ほど'], 1,
        'Hai điều xấu cộng dồn + **も** ⇒ **うえに** (takai ue ni) — Bài 29 ⑧.'),
      QP('（15）{忙|いそが}しくても、あいさつ（　）しなさい。', 'ぐらい', ['ほど', 'ばかり', 'うえに'], 2,
        'Xem nhẹ "ít nhất thì cũng chào hỏi" ⇒ **Nぐらい** (aisatsu gurai) — Bài 29 ⑤; ほど KHÔNG có nghĩa này.'),
    ]),
    MCQ('b40-np-2', 'Nhóm 2 — truyền lời, suy luận, biến đổi, căn cứ (15 câu)', [
      QP('（16）（{課長|かちょう}に）「{田村|たむら}さんからお{電話|でんわ}がありました。{会議|かいぎ}に{少|すこ}し{遅|おく}れる（　）。」', 'とのことです', ['んだって', 'って', 'とか'], 0,
        'Chuyển lời nhắn cho SẾP ⇒ trang trọng **とのことです** — Bài 30 ②. んだって・って・とか là văn nói thân mật.'),
      QP('（17）（{友達|ともだち}に）「ねえ、{駅前|えきまえ}に{新|あたら}しいカフェができた（　）。」', 'んだって', ['とのことです', 'ものです', 'わけです'], 1,
        'Kể tin nghe được với BẠN ⇒ **～んだって** (dekita n da tte) — Bài 30 ①.'),
      QP('（18）{彼|かれ}は{毎晩|まいばん}{遅|おそ}くまで{練習|れんしゅう}している。{試合|しあい}に{勝|か}ちたい（　）。', 'に{違|ちが}いない', ['わけがない', 'はずがない', 'ことはない'], 2,
        'Từ việc thấy anh ấy luyện tập ⇒ tin chắc **～に違いない** — Bài 31 ①.'),
      QP('（19）あんなにまじめな{彼|かれ}が、{嘘|うそ}をつく（　）。', 'はずがない', ['に{違|ちが}いない', 'わけだ', 'ものだ'], 3,
        'Căn cứ "anh ấy rất nghiêm túc" ⇒ **はずがない** "không lẽ nào" — Bài 31 ②.'),
      QP('（20）A「この{部屋|へや}、{寒|さむ}いね。」 B「あ、{窓|まど}が{開|あ}いてる。{道理|どうり}で{寒|さむ}い（　）。」', 'わけだ', ['はずがない', 'わけではない', 'ことだ'], 0,
        '**道理で～わけだ** = thảo nào — hiểu ra lý do (Bài 31 ⑤). ({開|あ}いてる = {開|あ}いている, Bài 39.)'),
      QP('（21）{日本料理|にほんりょうり}が{全部|ぜんぶ}{好|す}きな（　）。{納豆|なっとう}は{苦手|にがて}だ。', 'わけではない', ['わけだ', 'に{違|ちが}いない', 'わけがない'], 1,
        '"Không phải là thích TẤT CẢ" — phủ định một phần (全部 + わけではない) — Bài 31 ⑥.'),
      QP('（22）{明日|あした}は{大事|だいじ}な{会議|かいぎ}があるので、{休|やす}む（　）。', 'わけにはいかない', ['わけがない', 'わけではない', 'ことはない'], 2,
        'Vì trách nhiệm ⇒ "không thể nghỉ" **わけにはいかない** — Bài 31 ⑦.'),
      QP('（23）{季節|きせつ}が{変|か}わる（　）、{町|まち}の{景色|けしき}も{変|か}わっていく。', 'につれて', ['によって', 'に{対|たい}して', 'について'], 3,
        'Thay đổi theo đà ⇒ **Vる＋につれて** (kawaru ni tsurete) — Bài 32 ⑥.'),
      QP('（24）{係員|かかりいん}の{指示|しじ}（　）、{落|お}ち{着|つ}いて{避難|ひなん}してください。', 'にしたがって', ['につれて', 'とともに', 'をもとに'], 0,
        '"Tuân theo chỉ dẫn" ⇒ chỉ **にしたがって** có nghĩa này (Bài 32 ⑦); につれて không.'),
      QP('（25）この{町|まち}の{人口|じんこう}は{減|へ}る（　）。', '{一方|いっぽう}だ', ['ものだ', 'ことだ', 'わけだ'], 1,
        'Thay đổi một chiều, không dừng ⇒ **Vる＋一方だ** (heru ippou da) — Bài 32 ⑧.'),
      QP('（26）{天気予報|てんきよほう}（　）、{明日|あした}は{雪|ゆき}が{降|ふ}るそうだ。', 'によると', ['に{基|もと}づいて', 'をもとに', 'に{沿|そ}って'], 2,
        'Nguồn tin + **～そうだ** ở cuối ⇒ **によると** — Bài 33 ①.'),
      QP('（27）この{映画|えいが}は、{実際|じっさい}にあった{事件|じけん}（　）{作|つく}られた。', 'をもとに', ['によると', 'に{対|たい}して', 'にとって'], 3,
        'Lấy vụ việc thật làm CHẤT LIỆU để làm phim ⇒ **をもとに** — Bài 33 ③.'),
      QP('（28）{会議|かいぎ}は、お{配|くば}りした{資料|しりょう}の{順番|じゅんばん}（　）{進|すす}めます。', 'に{沿|そ}って', ['によると', 'につれて', 'にとって'], 0,
        '"Bám theo đúng thứ tự tài liệu" ⇒ **に沿って** — Bài 33 ④.'),
      QP('（29）{彼女|かのじょ}は{歌手|かしゅ}である（　）、{作家|さっか}としても{有名|ゆうめい}だ。', 'とともに', ['につれて', 'によって', 'とは'], 1,
        '"Vừa là… đồng thời…" ⇒ **Nであるとともに** — Bài 33 ⑤(b).'),
      QP('（30）このアニメは、{若者|わかもの}（　）{人気|にんき}が{広|ひろ}がっている。', 'を{中心|ちゅうしん}に', ['に{対|たい}して', 'として', 'をもとに'], 2,
        '"Chủ yếu trong giới trẻ" ⇒ **を中心に** — Bài 33 ⑥.'),
    ]),
    MCQ('b40-np-3', 'Nhóm 3 — trạng thái, giả định, bị bắt, kính ngữ, giải thích, liệt kê (15 câu)', [
      QP('（31）{冬|ふゆ}は{寒|さむ}くて、{運動不足|うんどうぶそく}になり（　）だ。', 'がち', ['{気味|ぎみ}', 'っぽい', 'っぱなし'], 3,
        'Xu hướng lặp lại mỗi mùa đông ⇒ **Vます＋がち** (narigachi) — Bài 34 ①.'),
      QP('（32）{最近|さいきん}{忙|いそが}しくて、{少|すこ}し{疲|つか}れ（　）だ。', '{気味|ぎみ}', ['{一方|いっぽう}', 'っぱなし', 'ようと'], 0,
        '"Hơi" mệt — đang có, mức nhẹ ⇒ **疲れ気味** (tsukaregimi) — Bài 34 ②.'),
      QP('（33）{電気|でんき}をつけ（　）にして、{寝|ね}てしまった。', 'っぱなし', ['がち', '{気味|ぎみ}', 'ほど'], 1,
        'Để nguyên đèn bật (chê) ⇒ **Vます＋っぱなし** (tsukeppanashi) — Bài 34 ④.'),
      QP('（34）{家|いえ}を（　）とき、{電話|でんわ}が{鳴|な}った。', '{出|で}ようとした', ['{出|で}るつもりの', '{出|で}たところの', '{出|で}ようと{思|おも}う'], 2,
        '"Vừa định ra khỏi nhà thì…" ⇒ **V(よ)うとしたとき** — Bài 34 ⑤(2).'),
      QP('（35）{弟|おとうと}は{何度|なんど}{言|い}っても、{部屋|へや}を{片付|かたづ}けよう（　）。', 'としない', ['とした', 'としたら', 'とともに'], 3,
        '"Nói mấy cũng KHÔNG CHỊU dọn" ⇒ **V(よ)うとしない** — Bài 34 ⑤(3).'),
      QP('（36）もし{日本|にほん}に{住|す}む（　）、どの{町|まち}がいいですか。', 'としたら', ['としても', 'にしても', 'ものの'], 0,
        'Giả định + câu hỏi ⇒ **普通形＋としたら** — Bài 34 ⑦.'),
      QP('（37）{子|こ}どもの{頃|ころ}、{母|はは}に{嫌|きら}いな{野菜|やさい}を{食|た}べ（　）。', 'させられた', ['られた', 'させた', 'させてもらった'], 1,
        'Bị mẹ BẮT ăn (không muốn) ⇒ **食べさせられた** — Bài 35 ②.'),
      QP('（38）{課長|かちょう}、{熱|ねつ}があるので、{今日|きょう}は{早|はや}めに{帰|かえ}らせて（　）。', 'いただけないでしょうか', ['さしあげませんか', 'いらっしゃいませんか', 'おりませんか'], 2,
        'Xin phép người trên cho MÌNH làm, lịch sự cao ⇒ **～させていただけないでしょうか** — Bài 35 ④⑨.'),
      QP('（39）あのとき、{先生|せんせい}に（　）。{今|いま}になって{後悔|こうかい}している。', '{相談|そうだん}すればよかった', ['{相談|そうだん}すればいい', '{相談|そうだん}することだ', '{相談|そうだん}するものだ'], 3,
        'Tiếc việc mình đã không làm ⇒ **～ばよかった** — Bài 35 ⑤.'),
      QP('（40）{先生|せんせい}、{私|わたし}が{書|か}いた{作文|さくぶん}を、もう（　）か。', 'ご{覧|らん}になりました', ['{拝見|はいけん}しました', '{見|み}させていただきました', 'お{見|み}しました'], 0,
        'Việc của THẦY ⇒ tôn kính **ご覧になる** — Bài 37 bảng động từ. 拝見する là khiêm nhường (việc của mình).'),
      QP('（41）「{部長|ぶちょう}は{今|いま}、どちらに（　）か。」', 'いらっしゃいます', ['おります', '{参|まい}ります', '{伺|うかが}います'], 1,
        'Hỏi về người trên ⇒ tôn kính **いらっしゃる** — Bài 37.'),
      QP('（42）「{報連相|ほうれんそう}」（　）、{報告|ほうこく}・{連絡|れんらく}・{相談|そうだん}のことです。', 'というのは', ['とか', 'やら', 'にしても'], 2,
        'Định nghĩa một từ ⇒ **Nというのは～ことです** — Bài 36 ①.'),
      QP('（43）{合格|ごうかく}の{知|し}らせを{聞|き}いて、うれしい（　）{驚|おどろ}いた（　）で、{涙|なみだ}が{出|で}た。', 'やら・やら', ['たり・たり', 'とか・とか', 'し・し'], 3,
        'Cảm xúc lẫn lộn ⇒ **～やら～やら** — Bài 36 ⑥.'),
      QP('（44）どんなに{忙|いそが}しい（　）、{電話|でんわ}ぐらいできるでしょう。', 'にしても', ['とたん', 'くせに', 'うちに'], 0,
        '"Dù có bận đến đâu thì cũng…" ⇒ **どんなに～にしても** — Bài 36 ⑦.'),
      QP('（45）A「{明日|あした}、{雨|あめ}だって。」 B「{雨|あめ}だ（　）、{試合|しあい}は{中止|ちゅうし}だね。」', 'としたら', ['にしても', 'ものの', 'くせに'], 1,
        'Giả sử tin nghe được là đúng thì… ⇒ **Nだとしたら** — Bài 34 ⑦.'),
    ]),
    {
      t: 'build',
      id: 'b40-np-ghep',
      title: 'Ghép câu — 8 câu dùng mẫu N3 (có mảnh nhiễu)',
      items: [
        { vi: 'Nhân lúc còn nóng thì ăn đi.', chips: ['{熱|あつ}い', 'うちに', '{食|た}べて', 'ください', '{間|あいだ}に'], answer: ['{熱|あつ}い', 'うちに', '{食|た}べて', 'ください'], ro: 'Atsui uchi ni tabete kudasai.' },
        { vi: 'Nhờ thầy mà tôi đã đỗ.', chips: ['{先生|せんせい}の', 'おかげで', '{合格|ごうかく}', 'できました', 'せいで'], answer: ['{先生|せんせい}の', 'おかげで', '{合格|ごうかく}', 'できました'], ro: 'Sensei no okage de goukaku dekimashita.' },
        { vi: 'Càng đọc càng thấy thú vị.', chips: ['{読|よ}めば', '{読|よ}む', 'ほど', 'おもしろい', 'くらい'], answer: ['{読|よ}めば', '{読|よ}む', 'ほど', 'おもしろい'], ro: 'Yomeba yomu hodo omoshiroi.' },
        { vi: 'Không phải là tôi ghét anh ấy.', chips: ['{彼|かれ}が', '{嫌|きら}いな', 'わけでは', 'ありません', 'わけが'], answer: ['{彼|かれ}が', '{嫌|きら}いな', 'わけでは', 'ありません'], ro: 'Kare ga kirai na wake de wa arimasen.' },
        { vi: 'Giá cả cứ ngày một tăng.', chips: ['{物価|ぶっか}は', '{上|あ}がる', '{一方|いっぽう}', 'です', 'ものだ'], answer: ['{物価|ぶっか}は', '{上|あ}がる', '{一方|いっぽう}', 'です'], ro: 'Bukka wa agaru ippou desu.' },
        { vi: 'Tôi bị trưởng phòng bắt làm thêm giờ.', chips: ['{部長|ぶちょう}に', '{残業|ざんぎょう}', 'を', 'させられました', 'されました'], answer: ['{部長|ぶちょう}に', '{残業|ざんぎょう}', 'を', 'させられました'], ro: 'Buchou ni zangyou o saseraremashita.' },
        { vi: 'Theo dự báo thời tiết thì mai trời mưa.', chips: ['{天気予報|てんきよほう}', 'によると', '{明日|あした}は', '{雨|あめ}だ', 'そうです', 'に{基|もと}づいて'], answer: ['{天気予報|てんきよほう}', 'によると', '{明日|あした}は', '{雨|あめ}だ', 'そうです'], ro: 'Tenki yohou ni yoru to, ashita wa ame da sou desu.' },
        { vi: 'Giá mà tôi đã hỏi sớm hơn.', chips: ['もっと', '{早|はや}く', '{聞|き}けば', 'よかった', 'いい'], answer: ['もっと', '{早|はや}く', '{聞|き}けば', 'よかった'], ro: 'Motto hayaku kikeba yokatta.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 7. ÔN TỪ VỰNG – CHỮ HÁN N3 ═══════════════════════════ */

const HAN_THEO_BAI: Block = {
  t: 'table',
  caption: 'Chữ Hán mới của Bài 26–39 (≈ 300 chữ) và từ trọng tâm — che cột "Từ" rồi tự đọc',
  head: ['Bài', 'Chữ mới', 'Từ trọng tâm (đọc)'],
  rows: [
    ['26 留学生活', '途 端 講 義 研 究 専 論 提 期 限 寮 賃 突 偶 寄 頑 互 際 乾', '{途端|とたん}・{講義|こうぎ}・{研究|けんきゅう}・{専攻|せんこう}・{論文|ろんぶん}・{提出|ていしゅつ}・{期限|きげん}・{寮|りょう}・{家賃|やちん}・{突然|とつぜん}・{偶然|ぐうぜん}・{立|た}ち{寄|よ}る・{頑張|がんば}る・お{互|たが}い・{国際|こくさい}・{乾|かわ}く'],
    ['27 ニュース', '原 因 影 響 政 民 件 状 候 速 路 価 値 法 種 類 告 和 戦 争', '{原因|げんいん}・{影響|えいきょう}・{政府|せいふ}・{国民|こくみん}・{事件|じけん}・{状況|じょうきょう}・{気候|きこう}・{速報|そくほう}・{道路|どうろ}・{物価|ぶっか}・{値上|ねあ}がり・{方法|ほうほう}・{種類|しゅるい}・{報告|ほうこく}・{平和|へいわ}・{戦争|せんそう}'],
    ['28 意見を言う', '賛 議 判 断 否 認 疑 得 納 責 任 態 協 述 示 個 的 満 感 比', '{賛成|さんせい}・{議論|ぎろん}・{判断|はんだん}・{否定|ひてい}・{認|みと}める・{疑問|ぎもん}・{納得|なっとく}・{説得|せっとく}・{責任|せきにん}・{態度|たいど}・{協力|きょうりょく}・{述|の}べる・{示|しめ}す・{個人|こじん}・{積極的|せっきょくてき}・{満足|まんぞく}・{感想|かんそう}・{比|くら}べる'],
    ['29 健康', '程 首 退 呼 適 普 腹 煙 貧 抜 更 良 血 骨 胃 汗 検 査 栄 養 診 防', '{程度|ていど}・{首|くび}・{退院|たいいん}・{呼吸|こきゅう}・{適度|てきど}・{普段|ふだん}・{満腹|まんぷく}・{煙|けむり}・{貧血|ひんけつ}・{抜|ぬ}く・{更|さら}に・{仲良|なかよ}く・{血圧|けつあつ}・{骨折|こっせつ}・{胃|い}・{汗|あせ}・{検査|けんさ}・{栄養|えいよう}・{診察|しんさつ}・{予防|よぼう}'],
    ['30 伝言', '絡 務 勤 役 資 求 望 欠 誤 頂 打 追 完 到 数 預 了 御 承 依', '{連絡|れんらく}・{業務|ぎょうむ}・{勤務|きんむ}・{役割|やくわり}・{資格|しかく}・{求|もと}める・{希望|きぼう}・{欠席|けっせき}・{誤|あやま}り・{頂|いただ}く・{打|う}ち{合|あ}わせ・{追加|ついか}・{完了|かんりょう}・{到着|とうちゃく}・{人数|にんずう}・{預|あず}かる・{御社|おんしゃ}・{承|うけたまわ}る・{依頼|いらい}'],
    ['31 推理', '推 測 現 解 能 性 恐 隠 罪 容 像 細 詳 深 過 在 印 象 鍵 袋', '{推理|すいり}・{推測|すいそく}・{現場|げんば}・{解決|かいけつ}・{可能性|かのうせい}・{恐|おそ}らく・{隠|かく}す・{犯罪|はんざい}・{容疑者|ようぎしゃ}・{想像|そうぞう}・{細|こま}かい・{詳|くわ}しい・{深夜|しんや}・{過去|かこ}・{現在|げんざい}・{印象|いんしょう}・{鍵|かぎ}・{袋|ふくろ}'],
    ['32 昔と今', '歴 史 昭 紀 進 展 移 技 科 器 街 村 齢 老 孫 懐 憶 流 未 常', '{歴史|れきし}・{昭和|しょうわ}・{世紀|せいき}・{進歩|しんぽ}・{発展|はってん}・{移|うつ}り{変|か}わる・{技術|ぎじゅつ}・{科学|かがく}・{食器|しょっき}・{商店街|しょうてんがい}・{村|むら}・{年齢|ねんれい}・{老人|ろうじん}・{孫|まご}・{懐|なつ}かしい・{記憶|きおく}・{流行|りゅうこう}・{未来|みらい}・{日常|にちじょう}'],
    ['33 調査', '統 均 率 倍 億 順 占 等 各 基 沿 識 規 向 共 収 支 積 傾 択', '{統計|とうけい}・{平均|へいきん}・{確率|かくりつ}・～{倍|ばい}・～{億|おく}・{順位|じゅんい}・{占|し}める・{平等|びょうどう}・{各地|かくち}・{基準|きじゅん}・{沿|そ}う・{知識|ちしき}・{規模|きぼ}・{方向|ほうこう}・{共通|きょうつう}・{収入|しゅうにゅう}・{支出|ししゅつ}・{面積|めんせき}・{傾向|けいこう}・{選択肢|せんたくし}'],
    ['34 習慣', '癖 坊 則 付 散 濯 節 改 善 継 姿 勢 肩 腰 掃 除 仮 乱 整 菓 我 慢', '{口癖|くちぐせ}・{三日坊主|みっかぼうず}・{不規則|ふきそく}・{片付|かたづ}ける・{散|ち}らかる・{洗濯物|せんたくもの}・{節約|せつやく}・{改善|かいぜん}・{継続|けいぞく}・{姿勢|しせい}・{肩|かた}・{腰|こし}・{掃除|そうじ}・{仮|かり}に・{乱|みだ}れる・{整理|せいり}・お{菓子|かし}・{我慢|がまん}・{自慢|じまん}'],
    ['35 インターン', '僚 署 属 歓 修 耐 摘 刷 快 励 訓 惜 悩 充 精 評 締 悔 余 叱 褒', '{同僚|どうりょう}・{部署|ぶしょ}・{配属|はいぞく}・{歓迎会|かんげいかい}・{修正|しゅうせい}・{耐|た}える・{指摘|してき}・{印刷|いんさつ}・{快|こころよ}く・{励|はげ}ます・{教訓|きょうくん}・{惜|お}しい・{悩|なや}む・{充実|じゅうじつ}・{精一杯|せいいっぱい}・{評価|ひょうか}・{締|し}め{切|き}り・{後悔|こうかい}・{余裕|よゆう}・{叱|しか}る・{褒|ほ}める'],
    ['36 文化の違い', '異 較 祝 贈 包 列 譲 握 距 離 旧 般 徴 周 囲 宗 儀 恥 燃 省 略', '{異文化|いぶんか}・{比較|ひかく}・{祝日|しゅくじつ}・{贈|おく}り{物|もの}・{包装|ほうそう}・{行列|ぎょうれつ}・{譲|ゆず}る・{握手|あくしゅ}・{距離|きょり}・{離|はな}れる・{旧正月|きゅうしょうがつ}・{一般的|いっぱんてき}・{特徴|とくちょう}・{周|まわ}り・{雰囲気|ふんいき}・{宗教|しゅうきょう}・{礼儀|れいぎ}・{恥|はじ}をかく・{燃|も}えるごみ・{省略|しょうりゃく}'],
    ['37 職場の日本語', '丁 寧 謙 挨 拶 宛 添 至 致 遣 縮 司 刺 貴 延 封 筒 秘 尋 誠 扱', '{丁寧語|ていねいご}・{謙譲語|けんじょうご}・{謙虚|けんきょ}・{挨拶|あいさつ}・{宛名|あてな}・{添付|てんぷ}・{至急|しきゅう}・{一致|いっち}・{言葉遣|ことばづか}い・{恐縮|きょうしゅく}・{上司|じょうし}・{名刺|めいし}・{貴社|きしゃ}・{延期|えんき}・{封筒|ふうとう}・{秘書|ひしょ}・{尋|たず}ねる・{誠|まこと}に・{扱|あつか}う'],
    ['38 読解 N3', '筆 掲 載 募 抽 臨 営 条 額 慮 環 境 策 効 量 源 逆 批 及 府 易 造', '{筆者|ひっしゃ}・{掲示板|けいじばん}・{掲載|けいさい}・{募集|ぼしゅう}・{抽選|ちゅうせん}・{臨時|りんじ}・{営業|えいぎょう}・{条件|じょうけん}・{金額|きんがく}・{配慮|はいりょ}・{環境|かんきょう}・{対策|たいさく}・{効果|こうか}・{大量|たいりょう}・{資源|しげん}・{逆|ぎゃく}に・{批判|ひはん}・{普及|ふきゅう}・{政府|せいふ}・{容易|ようい}・{製造|せいぞう}'],
    ['39 聴解 N3', '聴 符 往 換 駐 輪 渋 滞 税 替 領 振 算 症 傷 希 補 却 訂 催 請', '{聴解|ちょうかい}・{切符|きっぷ}・{往復|おうふく}・{乗|の}り{換|か}え・{駐車場|ちゅうしゃじょう}・{駐輪場|ちゅうりんじょう}・{渋滞|じゅうたい}・{税込|ぜいこ}み・{両替|りょうがえ}・{領収書|りょうしゅうしょ}・{振|ふ}り{込|こ}む・{予算|よさん}・{花粉症|かふんしょう}・{傷|きず}・{希望|きぼう}・{補習|ほしゅう}・{返却|へんきゃく}・{訂正|ていせい}・{開催|かいさい}・{請求書|せいきゅうしょ}'],
  ],
};

const BAY_DOC: Block = {
  t: 'table',
  caption: 'Bẫy ĐỌC của 漢字読み — trường âm · âm ngắt · âm đục · âm On ↔ Kun (đáp án nhiễu của đề chỉ khác đúng chỗ này)',
  head: ['Loại bẫy', 'Từ (đọc đúng)', 'Đáp án nhiễu hay gặp', 'Mẹo nhớ'],
  rows: [
    ['Trường âm う／い', '{影響|えいきょう} · {状況|じょうきょう} · {減少|げんしょう} · {評価|ひょうか}', 'えいきょ · じょうきょ · げんしょ · ひょっか', 'Âm On có -ou / -ei hầu như luôn dài: 響 キョウ, 況 キョウ, 評 ヒョウ.'],
    ['Âm ngắt っ', '{発展|はってん} · {指摘|してき} · {一致|いっち} · {骨折|こっせつ} · {納得|なっとく}', 'はつてん · しってき · いちち · こつせつ', 'ツ／チ／ク／キ đứng trước âm k, s, t, p ⇒ thường thành っ (ハツ＋テン ⇒ はってん). 指摘 KHÔNG có っ.'],
    ['Âm đục / bán đục', '{普段|ふだん} · {距離|きょり} · {一般|いっぱん} · {心配|しんぱい} · {渋滞|じゅうたい}', 'ぶだん · ぎょり · いっはん · しんはい · しゅうたい', '般 / 配 đứng sau ん・っ hay đổi sang ぱん／ぱい; 普 luôn フ, 距 luôn キョ (không đục); 渋 là ジュウ (đục).'],
    ['On ↔ Kun', '{細|こま}かい ↔ {詳|くわ}しい · {隠|かく}す ↔ {隠|かく}れる · {預|あず}かる ↔ {預|あず}ける · お{互|たが}い', 'đọc On cho từ có okurigana, hoặc đọc Kun của một chữ GẦN NGHĨA (詳しい → こまかい)', 'Chữ đứng một mình + okurigana ⇒ đọc Kun. Trong từ ghép hai chữ ⇒ thường đọc On: {詳細|しょうさい} (Bài 30) — 細 ở đây là サイ, không phải こま.'],
    ['Đọc đặc biệt', '{梅雨|つゆ} · {雰囲気|ふんいき} · {土産|みやげ} · {一人前|いちにんまえ} · {三日坊主|みっかぼうず}', 'ばいう (cũng đúng, văn viết) · ふいんき (sai phổ biến)', 'Học theo cả từ, không ghép âm từng chữ.'],
  ],
};

const DONG_AM: Block = {
  t: 'table',
  caption: 'Bẫy VIẾT của 表記 — chữ đồng âm khác nghĩa · chữ trông giống',
  head: ['Đọc', 'Chữ đúng theo nghĩa', 'Chữ nhiễu', 'Phân biệt'],
  rows: [
    ['ほうそう', '{放送|ほうそう} (phát sóng — Bài 27) · {包装|ほうそう} (gói hàng — Bài 36)', '—', 'Ti vi, loa ⇒ 放送; quà, hàng ⇒ 包装.'],
    ['つとめる', '{勤|つと}める (làm ở…) · {務|つと}める (đảm nhận vai) · {努|つと}める (cố gắng)', '動める', '{会社|かいしゃ}に{勤|つと}める · {司会|しかい}を{務|つと}める · {改善|かいぜん}に{努|つと}める.'],
    ['かいとう', '{回答|かいとう} (trả lời khảo sát, câu hỏi — Bài 33) · {解答|かいとう} (lời giải bài thi)', '回当', 'アンケートに{回答|かいとう}する · {試験|しけん}の{解答|かいとう}.'],
    ['いがい', '{意外|いがい} (bất ngờ — Bài 33) · {以外|いがい} (ngoài ra)', '意害', '{結果|けっか}は{意外|いがい}だった · {日曜|にちよう}{以外|いがい}は{働|はたら}く.'],
    ['きかい', '{機械|きかい} (máy móc — Bài 32) · {機会|きかい} (cơ hội)', '器械 (dụng cụ — hiếm)', '{新|あたら}しい{機械|きかい} · {話|はな}す{機会|きかい}.'],
    ['そう', '{沿|そ}う (dọc theo, theo đúng — Bài 33) · {添|そ}う (đi kèm — Bài 37 {添付|てんぷ})', '治う', '{川|かわ}に{沿|そ}って{歩|ある}く · {期待|きたい}に{沿|そ}う／{添|そ}う (cả hai được thấy).'],
    ['Chữ trông giống', '責 ↔ 積 · 比 ↔ 批 · 調 ↔ 週 · 査 ↔ 差 · 憶 ↔ 億 · 延 ↔ 廷 · 預 ↔ 頂', '—', 'Nhìn bộ thủ: 積 có 禾 (lúa — tích trữ), 批 có 扌 (tay — phê), 憶 có 忄 (tim — nhớ), 億 có 亻 (người — con số).'],
  ],
};

const RUI_GI: Block = {
  t: 'table',
  caption: '類義語 hay ra ở 言い換え — từ N3 ↔ cách nói dễ hơn',
  head: ['Từ (Bài)', '≈ Nghĩa gần nhất', 'Bẫy cần loại'],
  rows: [
    ['{恐|おそ}らく (31)', 'たぶん', 'きっと (chắc hơn) · {必|かなら}ず'],
    ['{散|ち}らかっている (34)', '{片付|かたづ}いていない', '{汚|よご}れている (bẩn ≠ bừa)'],
    ['{見合|みあ}わせる (27)', '{一時|いちじ}{止|と}める', '{中止|ちゅうし}する (bỏ hẳn)'],
    ['{延期|えんき}する (27)', '{別|べつ}の{日|ひ}に{変|か}える／{遅|おく}らせる', '{中止|ちゅうし}する'],
    ['{飽|あ}きっぽい (31)', 'すぐ{嫌|いや}になってやめる', '{怒|おこ}りっぽい · {忘|わす}れっぽい'],
    ['{気|き}が{利|き}く (35)', '{周|まわ}りによく{気|き}がつく', '{気|き}にする (lo lắng)'],
    ['ぎりぎり (34)', 'もう{少|すこ}しで{間|ま}に{合|あ}わないところ', '{余裕|よゆう}で'],
    ['さっそく (37/39)', 'すぐに', 'とりあえず (tạm thời)'],
    ['{徐々|じょじょ}に (32) · {次第|しだい}に (26)', '{少|すこ}しずつ', '{急|きゅう}に · すっかり'],
    ['{曖昧|あいまい} (36)', 'はっきりしない', '{複雑|ふくざつ}'],
    ['{臨時|りんじ} (38)', 'いつもとは{違|ちが}って、その{時|とき}だけ', '{定休日|ていきゅうび} (nghỉ định kỳ)'],
    ['{万一|まんいち} (34)', 'もしも', 'たまに'],
  ],
};

const TU_THA: Block = {
  t: 'table',
  caption: 'Cặp tự động từ ↔ tha động từ của N3 (đề hay hỏi trợ từ が ↔ を)',
  head: ['Tự động từ (N が)', 'Tha động từ (N を)', 'Ví dụ'],
  rows: [
    ['{散|ち}らかる', '{散|ち}らかす (Bài 34)', '{部屋|へや}が{散|ち}らかる · {子|こ}どもがおもちゃを{散|ち}らかす'],
    ['{隠|かく}れる', '{隠|かく}す (Bài 31)', '{猫|ねこ}が{隠|かく}れる · {秘密|ひみつ}を{隠|かく}す'],
    ['{伝|つた}わる', '{伝|つた}える (Bài 30)', '{気持|きも}ちが{伝|つた}わる · {用件|ようけん}を{伝|つた}える'],
    ['{乾|かわ}く', '{乾|かわ}かす', '{洗濯物|せんたくもの}が{乾|かわ}く · {髪|かみ}を{乾|かわ}かす'],
    ['{冷|ひ}える', '{冷|ひ}やす', '{体|からだ}が{冷|ひ}える · ジュースを{冷|ひ}やす'],
    ['{覚|さ}める', '{覚|さ}ます', '{目|め}が{覚|さ}める · {目|め}を{覚|さ}ます'],
    ['{広|ひろ}まる／{広|ひろ}がる', '{広|ひろ}める／{広|ひろ}げる (Bài 32)', 'うわさが{広|ひろ}まる · {地図|ちず}を{広|ひろ}げる'],
    ['{進|すす}む', '{進|すす}める (Bài 35)', '{工事|こうじ}が{進|すす}む · {仕事|しごと}を{進|すす}める'],
    ['{起|お}こる', '{起|お}こす (Bài 27)', '{事故|じこ}が{起|お}こる · {事故|じこ}を{起|お}こす'],
    ['{乱|みだ}れる', '{乱|みだ}す', '{生活|せいかつ}リズムが{乱|みだ}れる · {列|れつ}を{乱|みだ}す'],
    ['({預|あず}かる — nhận giữ)', '{預|あず}ける — gửi (Bài 30)', 'không phải cặp tự/tha mà là NHẬN ↔ GỬI: {荷物|にもつ}を{預|あず}ける → {管理人|かんりにん}が{預|あず}かる'],
  ],
};

const KET_HOP: Block = {
  t: 'table',
  caption: 'コロケーション (kết hợp từ) N3 hay gặp ở 文脈規定 — học cả cụm',
  head: ['Danh từ', 'Động từ đi kèm', 'Nghĩa'],
  rows: [
    ['{手間|てま}', 'がかかる／をかける', 'tốn công'],
    ['{気|き}', 'を{遣|つか}う · が{利|き}く · がつく · にする', 'giữ ý · tinh ý · nhận ra · bận tâm'],
    ['{空気|くうき}', 'を{読|よ}む', 'biết ý, hiểu bầu không khí'],
    ['{目|め}', 'を{通|とお}す', 'xem qua'],
    ['{声|こえ}', 'をかける', 'gọi, bắt chuyện, rủ'],
    ['{恥|はじ}', 'をかく', 'bị bẽ mặt'],
    ['{例|れい}', 'を{挙|あ}げる', 'nêu ví dụ'],
    ['{意見|いけん}', 'が{分|わ}かれる · を{述|の}べる', 'ý kiến chia rẽ · trình bày ý kiến'],
    ['{手|て}', 'が{空|あ}く', 'rảnh tay'],
    ['{身|み}', 'につける', 'học được, trang bị cho mình'],
    ['{年|とし}', 'をとる', 'có tuổi'],
    ['{目標|もくひょう}', 'を{立|た}てる · を{達成|たっせい}する', 'đặt mục tiêu · đạt mục tiêu'],
    ['{責任|せきにん}', 'を{持|も}つ／を{取|と}る', 'có trách nhiệm / chịu trách nhiệm'],
    ['{運転|うんてん}', 'を{見合|みあ}わせる · を{再開|さいかい}する', 'tạm dừng chạy · chạy lại'],
  ],
};

const ON_TU_HAN: Lesson = {
  id: 'b40-on-tap-tu-vung-han-tu',
  kind: 'review',
  title: 'Ôn tập N3 · Từ vựng & chữ Hán — chữ mới Bài 26–39, bẫy đọc, bẫy viết, 類義語, tự – tha động từ, コロケーション, 40 câu + 20 câu đọc chữ',
  goal: 'Ôn lại toàn bộ chữ Hán mới của Bài 26–39 qua từ trọng tâm của từng bài, nắm các kiểu bẫy của 漢字読み (trường âm, âm ngắt, âm đục, On ↔ Kun) và 表記 (chữ đồng âm, chữ trông giống), các cặp 類義語 hay ra ở 言い換え, cặp tự – tha động từ và kết hợp từ — rồi làm 40 câu trắc nghiệm và 20 câu đọc chữ không furigana như đề thật.',
  minutes: 90,
  blocks: [
    {
      t: 'recap',
      title: 'Cách dùng mục này',
      items: [
        'Bảng 1: **che cột "Từ"**, nhìn chữ, nói ra một từ có chữ đó + cách đọc. Chữ nào bí ⇒ mở thẻ chữ Hán của Bài tương ứng.',
        'Bảng 2–3 là "bản đồ bẫy" của 漢字読み・表記 — đọc trước khi làm câu 1–25 bên dưới.',
        'Bảng 4–6 phục vụ 言い換え・文脈規定・用法. Làm xong 40 câu thì sang **Đọc chữ không furigana** (tắt furigana, đọc to rồi bấm xem).',
      ],
    },
    { t: 'h', text: '1. Chữ Hán mới của Bài 26–39' },
    HAN_THEO_BAI,
    {
      t: 'note',
      title: 'Lưu ý về "cấp" của chữ Hán',
      items: [
        'JLPT **không công bố** danh sách chữ chính thức cho từng cấp. Khoá xếp chữ theo các bảng tham khảo phổ biến: phần lớn là chữ N3, một số chữ các bảng xếp N2 (影・響・寮・偶・沿・傾・択・握・距…) nhưng các TỪ chứa chúng ({影響|えいきょう}・{距離|きょり}・{傾向|けいこう}…) rất hay gặp ở đề N3.',
        'Đề N3 thường **không bắt viết** chữ — bắt ĐỌC (漢字読み) và CHỌN chữ đúng (表記). Ưu tiên nhận mặt + đọc đúng cả từ.',
      ],
    },
    { t: 'h', text: '2. Bẫy đọc & bẫy viết' },
    BAY_DOC,
    DONG_AM,
    { t: 'h', text: '3. Nghĩa gần, cặp động từ, kết hợp từ' },
    RUI_GI,
    TU_THA,
    KET_HOP,
    { t: 'h', text: '4. Luyện tập — 40 câu' },
    MCQ('b40-tv-1', '漢字読み — 15 câu (chữ Bài 26–39)', [
      QP('（1）{事故|じこ}の **原因** はまだわかっていない。', 'げんいん', ['げいいん', 'がんいん', 'げんにん'], 0, '**{原因|げんいん}** (gen-in — nguyên nhân) — Bài 27. 原 ゲン + 因 イン.'),
      QP('（2）{現在|げんざい}の **状況** を{説明|せつめい}してください。', 'じょうきょう', ['じょきょう', 'じょうきょ', 'しょうきょう'], 1, '**{状況|じょうきょう}** — Bài 27; cả hai âm đều dài: ジョウ・キョウ.'),
      QP('（3）{最後|さいご}は{自分|じぶん}で **判断** しなさい。', 'はんだん', ['ばんだん', 'はんたん', 'はんだい'], 2, '**{判断|はんだん}** — Bài 28. 断 đọc ダン (đục).'),
      QP('（4）{病院|びょういん}で{血液|けつえき}の **検査** を{受|う}けた。', 'けんさ', ['げんさ', 'けんさい', 'けんざ'], 3, '**{検査|けんさ}** — Bài 29. 検 ケン (không đục), 査 サ.'),
      QP('（5）{明日|あした}の{予定|よてい}が{決|き}まったら **連絡** します。', 'れんらく', ['れんら', 'れいらく', 'れんかく'], 0, '**{連絡|れんらく}** — chữ 絡 Bài 30 (ラク).'),
      QP('（6）それはただの **推測** です。{証拠|しょうこ}はありません。', 'すいそく', ['すいしょく', 'ついそく', 'すいぞく'], 1, '**{推測|すいそく}** (suisoku — phỏng đoán) — Bài 31; {証拠|しょうこ} (chứng cứ) cùng bài.'),
      QP('（7）{日本|にほん}の **歴史** を{勉強|べんきょう}している。', 'れきし', ['りきし', 'れきしい', 'れっし'], 2, '**{歴史|れきし}** — Bài 32. 歴 レキ, 史 シ (ngắn).'),
      QP('（8）{今月|こんげつ}の{気温|きおん}は{例年|れいねん}の **平均** より{高|たか}い。', 'へいきん', ['へいぎん', 'ひょうきん', 'べいきん'], 3, '**{平均|へいきん}** — Bài 33. 均 キン (không đục).'),
      QP('（9）{座|すわ}るときは **姿勢** に{気|き}をつけましょう。', 'しせい', ['しせ', 'すがたせい', 'じせい'], 0, '**{姿勢|しせい}** — Bài 34. 姿 đứng riêng là すがた, trong từ ghép đọc シ.'),
      QP('（10）{課長|かちょう}に{仕事|しごと}を **評価** された。', 'ひょうか', ['ひょか', 'ひょうが', 'へいか'], 1, '**{評価|ひょうか}** — Bài 35. 評 ヒョウ (dài).'),
      QP('（11）{国|くに}によって **宗教** が{違|ちが}う。', 'しゅうきょう', ['しゅきょう', 'そうきょう', 'しゅうきょ'], 2, '**{宗教|しゅうきょう}** — Bài 36. 宗 シュウ (dài).'),
      QP('（12）お{客様|きゃくさま}には **丁寧** に{話|はな}してください。', 'ていねい', ['ちょうねい', 'ていない', 'てねい'], 3, '**{丁寧|ていねい}** — Bài 37.'),
      QP('（13）ごみを{減|へ}らして **環境** を{守|まも}ろう。', 'かんきょう', ['かんきょ', 'がんきょう', 'かんけい'], 0, '**{環境|かんきょう}** — Bài 38.'),
      QP('（14）{事故|じこ}で{道路|どうろ}が **渋滞** している。', 'じゅうたい', ['じゅたい', 'しゅうたい', 'じゅうだい'], 1, '**{渋滞|じゅうたい}** — Bài 27 (từ) / Bài 39 (chữ). 渋 ジュウ (dài, đục).'),
      QP('（15）{記事|きじ}の{間違|まちが}いを **訂正** した。', 'ていせい', ['ちょうせい', 'てせい', 'ていしょう'], 2, '**{訂正|ていせい}** — Bài 39.'),
    ]),
    MCQ('b40-tv-2', '表記 — 10 câu (chữ đồng âm, chữ trông giống)', [
      QP('（16）この{工場|こうじょう}では、{新|あたら}しい **きかい** を{使|つか}っている。', '機械', ['機会', '危械', '期会'], 0, 'Máy móc ⇒ **機械** (Bài 32). {機会|きかい} = cơ hội (cùng âm, nghĩa khác) — bẫy đồng âm.'),
      QP('（17）アンケートに **かいとう** してください。', '回答', ['解答', '回当', '解当'], 1, 'Trả lời khảo sát ⇒ **回答** (Bài 33). 解答 = lời giải bài thi.'),
      QP('（18）{試験|しけん}の{結果|けっか}は **いがい** だった。', '意外', ['以外', '意害', '異外'], 2, 'Bất ngờ ⇒ **意外** (Bài 33). 以外 = ngoài ra. 異 (Bài 36) cùng âm イ.'),
      QP('（19）{大学生|だいがくせい}を **たいしょう** に{調査|ちょうさ}した。', '対象', ['対照', '大象', '対像'], 3, 'Đối tượng ⇒ **対象** (Bài 28). 対照 = đối chiếu; 像 (Bài 31) là "hình tượng".'),
      QP('（20）{指摘|してき}されたところを **しゅうせい** した。', '修正', ['習正', '修整', '終正'], 0, '**修正** (sửa cho đúng) — Bài 35.'),
      QP('（21）{大学|だいがく}のホームページに{写真|しゃしん}を **けいさい** した。', '掲載', ['掲裁', '渇載', '掲栽'], 1, '**掲載** (đăng) — Bài 38. 裁・栽 cùng bộ phận 𢦏, khác bộ thủ.'),
      QP('（22）{電車|でんしゃ}でお{年寄|としよ}りに{席|せき}を **ゆずった**。', '譲った', ['壌った', '嬢った', '穣った'], 2, '**譲る** (nhường) — Bài 36: bộ 言 (lời nói — "nhường lời"). Ba chữ nhiễu cùng phần 襄.'),
      QP('（23）{旅行|りょこう}の{間|あいだ}、{犬|いぬ}を{友達|ともだち}に **あずけた**。', '預けた', ['頂けた', '項けた', '須けた'], 3, '**預ける** (gửi) — Bài 30. 頂 (いただく — Bài 30) cùng bộ 頁 — bẫy chữ trông giống.'),
      QP('（24）{進路|しんろ}のことで **なやんで** いる。', '悩んで', ['脳んで', '悩やんで', '凶んで'], 0, '**悩む** (phiền não) — Bài 35: bộ 忄 (tim). 脳 (não) bộ 月. Okurigana chỉ có む.'),
      QP('（25）{明日|あした}は **ちょうかい** の{試験|しけん}がある。', '聴解', ['徴解', '聴介', '聴改'], 1, '**聴解** (nghe hiểu) — Bài 39. 徴 (Bài 36, {特徴|とくちょう}) cùng âm チョウ, khác bộ.'),
    ]),
    MCQ('b40-tv-3', '文脈規定・言い換え・用法 — 15 câu', [
      QP('（26）{彼|かれ}の{意見|いけん}に（　）する{人|ひと}は{少|すく}なかった。', '{賛成|さんせい}', ['{満足|まんぞく}', '{比較|ひかく}', '{判断|はんだん}'], 0, '**N に{賛成|さんせい}する** — Bài 23/28.'),
      QP('（27）{会議|かいぎ}では、{反対|はんたい}の（　）から{意見|いけん}を{述|の}べた。', '{立場|たちば}', ['{態度|たいど}', '{根拠|こんきょ}', '{結論|けつろん}'], 1, '**～の{立場|たちば}から** = từ lập trường — Bài 28.'),
      QP('（28）{病気|びょうき}を（　）するために、よく{手|て}を{洗|あら}う。', '{予防|よぼう}', ['{診察|しんさつ}', '{治療|ちりょう}', '{検査|けんさ}'], 2, '**{予防|よぼう}する** (phòng ngừa) — Bài 29.'),
      QP('（29）{目上|めうえ}の{人|ひと}と{話|はな}すときは、（　）に{気|き}をつけなさい。', '{言葉遣|ことばづか}い', ['{気遣|きづか}い', '{距離|きょり}', '{行列|ぎょうれつ}'], 0, '**{言葉遣|ことばづか}い** (cách ăn nói) — Bài 37.'),
      QP('（30）この{仕事|しごと}は（　）が{多|おお}いので、{一人|ひとり}では{無理|むり}だ。', '{作業|さぎょう}', ['{教訓|きょうくん}', '{休暇|きゅうか}', '{感心|かんしん}'], 1, '**{作業|さぎょう}が{多|おお}い** (nhiều thao tác phải làm) — Bài 35.'),
      QP('（31）この{店|みせ}は **{臨時|りんじ}** {休業|きゅうぎょう}です。', 'いつもとは{違|ちが}って、その{日|ひ}だけ', ['{毎週|まいしゅう}{決|き}まった{日|ひ}に', 'ずっと{長|なが}い{間|あいだ}', '{朝|あさ}だけ'], 0, '**{臨時|りんじ}** = đột xuất, chỉ lần này — Bài 38. Nghỉ cố định hằng tuần là {定休日|ていきゅうび} (Bài 39).'),
      QP('（32）**{万一|まんいち}** {地震|じしん}が{起|お}きたら、{机|つくえ}の{下|した}に{入|はい}ってください。', 'もしも', ['ときどき', 'すぐに', 'やっと'], 0, '**{万一|まんいち}** ≈ もしも (lỡ như) — Bài 34.'),
      QP('（33）{彼|かれ}の{説明|せつめい}は **{曖昧|あいまい}** だった。', 'はっきりしなかった', ['とても{長|なが}かった', 'わかりやすかった', 'おもしろかった'], 3, '**{曖昧|あいまい}** ≈ はっきりしない (mơ hồ) — Bài 36.'),
      QP('（34）{学生|がくせい}たちは **{真剣|しんけん}** に{話|はなし}を{聞|き}いていた。', 'まじめに', ['{楽|たの}しそうに', '{静|しず}かに', 'ゆっくり'], 2, '**{真剣|しんけん}** ≈ まじめ, hết lòng — Bài 28.'),
      QP('（35）**とりあえず** {水|みず}をください。', 'まず{先|さき}に', ['もっと', '{最後|さいご}に', '{何度|なんど}も'], 1, '**とりあえず** ≈ まず (trước mắt, tạm) — Bài 39.'),
      Q('（36）{引|ひ}き{受|う}ける', ['{友達|ともだち}からの{手紙|てがみ}を{引|ひ}き{受|う}けた。', '{先輩|せんぱい}に{頼|たの}まれた{仕事|しごと}を{引|ひ}き{受|う}けた。', '{銀行|ぎんこう}でお{金|かね}を{引|ひ}き{受|う}けた。', '{試験|しけん}に{引|ひ}き{受|う}けて、うれしかった。'], 1,
        '**{引|ひ}き{受|う}ける** = nhận làm (việc, trách nhiệm) — Bài 31. Thư ⇒ {受|う}け{取|と}る; tiền ⇒ {引|ひ}き{出|だ}す／{下|お}ろす; thi ⇒ {受|う}かる.'),
      Q('（37）{苦労|くろう}', ['{留学|りゅうがく}したばかりの{頃|ころ}は、{言葉|ことば}で{苦労|くろう}した。', 'この{料理|りょうり}は{苦労|くろう}で、{食|た}べられない。', '{苦労|くろう}なので、{少|すこ}し{休|やす}みます。', '{友達|ともだち}に{苦労|くろう}をあげた。'], 0,
        '**N で{苦労|くろう}する** = vất vả vì — Bài 28. Câu 2 nhầm {苦|にが}い (đắng); câu 3 nhầm {疲|つか}れた.'),
      Q('（38）{継続|けいぞく}', ['{雨|あめ}が{継続|けいぞく}して、{洗濯物|せんたくもの}が{乾|かわ}かない。', '{電車|でんしゃ}が{駅|えき}に{継続|けいぞく}した。', '{毎日|まいにち}の{運動|うんどう}を{継続|けいぞく}することが{大切|たいせつ}だ。', '{彼|かれ}は{継続|けいぞく}な{人|ひと}だ。'], 2,
        '**{継続|けいぞく}する** = duy trì việc mình làm lâu dài — Bài 34. Mưa kéo dài ⇒ {降|ふ}り{続|つづ}く; tàu đến ⇒ {到着|とうちゃく}.'),
      Q('（39）{延長|えんちょう}', ['{会議|かいぎ}を{来週|らいしゅう}に{延長|えんちょう}した。', '{背|せ}が{延長|えんちょう}した。', '{道|みち}が{延長|えんちょう}で、{歩|ある}きにくい。', '{本|ほん}の{返却|へんきゃく}{期限|きげん}を{一週間|いっしゅうかん}{延長|えんちょう}した。'], 3,
        '**{延長|えんちょう}する** = kéo dài thêm thời hạn / thời gian — Bài 38. Dời sang ngày khác ⇒ {延期|えんき} (câu 1 — bẫy cặp 延長 ↔ 延期); cao lên ⇒ {伸|の}びる.'),
      Q('（40）{戸惑|とまど}う', ['{初|はじ}めて{日本|にほん}の{駅|えき}を{使|つか}ったとき、{乗|の}り{換|か}えの{多|おお}さに{戸惑|とまど}った。', '{家|いえ}の{戸|と}を{戸惑|とまど}ってください。', '{試験|しけん}に{合格|ごうかく}して、{戸惑|とまど}いました。', '{友達|ともだち}と{戸惑|とまど}って、{映画|えいが}を{見|み}た。'], 0,
        '**{戸惑|とまど}う** = bối rối, lúng túng vì không biết làm sao — Bài 36. Câu 3 vui mừng không phải 戸惑う.'),
    ]),
    { t: 'h', text: '5. Đọc chữ không furigana — 20 câu' },
    {
      t: 'readkanji',
      id: 'b40-doc-kanji',
      title: 'Tắt furigana, đọc to từng câu rồi bấm xem cách đọc (chữ Bài 26–39)',
      note: 'Như đề thật: câu không có furigana. Đọc trọn câu, chú ý trường âm, âm ngắt, âm đục.',
      items: [
        { text: '{台風|たいふう}の{影響|えいきょう}で、{列車|れっしゃ}が{運休|うんきゅう}した。', ro: 'Taifuu no eikyou de, ressha ga unkyuu shita.', vi: 'Do ảnh hưởng của bão, tàu ngừng chạy.' },
        { text: '{会議|かいぎ}で{自分|じぶん}の{意見|いけん}を{述|の}べた。', ro: 'Kaigi de jibun no iken o nobeta.', vi: 'Tôi đã trình bày ý kiến của mình trong cuộc họp.' },
        { text: '{彼|かれ}の{説明|せつめい}に{納得|なっとく}できなかった。', ro: 'Kare no setsumei ni nattoku dekinakatta.', vi: 'Tôi không thấy thoả đáng với lời giải thích của anh ấy.' },
        { text: '{健康診断|けんこうしんだん}で{血圧|けつあつ}を{測|はか}った。', ro: 'Kenkou shindan de ketsuatsu o hakatta.', vi: 'Đo huyết áp khi khám sức khoẻ.' },
        { text: '{至急|しきゅう}、{担当者|たんとうしゃ}に{連絡|れんらく}してください。', ro: 'Shikyuu, tantousha ni renraku shite kudasai.', vi: 'Hãy liên lạc gấp với người phụ trách.' },
        { text: '{事件|じけん}の{現場|げんば}に{犯人|はんにん}の{足跡|あしあと}が{残|のこ}っていた。', ro: 'Jiken no genba ni hannin no ashiato ga nokotte ita.', vi: 'Ở hiện trường vụ án còn dấu chân của hung thủ.' },
        { text: '{昭和|しょうわ}の{商店街|しょうてんがい}は{今|いま}も{懐|なつ}かしい{雰囲気|ふんいき}だ。', ro: 'Shouwa no shoutengai wa ima mo natsukashii fun-iki da.', vi: 'Khu phố buôn bán thời Showa đến giờ vẫn mang bầu không khí hoài niệm.' },
        { text: '{調査|ちょうさ}の{結果|けっか}を{統計|とうけい}にまとめた。', ro: 'Chousa no kekka o toukei ni matometa.', vi: 'Tôi tổng hợp kết quả khảo sát thành số liệu thống kê.' },
        { text: '{回答者|かいとうしゃ}の{半数|はんすう}が「はい」を{選|えら}んだ。', ro: 'Kaitousha no hansuu ga "hai" o eranda.', vi: 'Một nửa số người trả lời đã chọn "có".' },
        { text: '{机|つくえ}の{上|うえ}が{散|ち}らかっていて、{書類|しょるい}が{見|み}つからない。', ro: 'Tsukue no ue ga chirakatte ite, shorui ga mitsukaranai.', vi: 'Trên bàn bừa bộn nên không tìm thấy giấy tờ.' },
        { text: '{毎朝|まいあさ}の{散歩|さんぽ}を{継続|けいぞく}している。', ro: 'Maiasa no sanpo o keizoku shite iru.', vi: 'Tôi duy trì việc đi dạo mỗi sáng.' },
        { text: '{新|あたら}しい{部署|ぶしょ}に{配属|はいぞく}された。', ro: 'Atarashii busho ni haizoku sareta.', vi: 'Tôi được phân về bộ phận mới.' },
        { text: '{先輩|せんぱい}に{書類|しょるい}のミスを{指摘|してき}された。', ro: 'Senpai ni shorui no misu o shiteki sareta.', vi: 'Tôi bị đàn anh chỉ ra lỗi trong giấy tờ.' },
        { text: '{電車|でんしゃ}でお{年寄|としよ}りに{席|せき}を{譲|ゆず}った。', ro: 'Densha de otoshiyori ni seki o yuzutta.', vi: 'Tôi nhường ghế cho người già trên tàu.' },
        { text: '{日本|にほん}と{比較|ひかく}すると、{距離|きょり}の{感覚|かんかく}が{違|ちが}う。', ro: 'Nihon to hikaku suru to, kyori no kankaku ga chigau.', vi: 'So với Nhật thì cảm giác về khoảng cách khác.' },
        { text: '{資料|しりょう}を{添付|てんぷ}いたしましたので、ご{確認|かくにん}ください。', ro: 'Shiryou o tenpu itashimashita node, gokakunin kudasai.', vi: 'Tôi đã đính kèm tài liệu, xin anh/chị kiểm tra.' },
        { text: '{会議|かいぎ}は{来週|らいしゅう}に{延期|えんき}になった。', ro: 'Kaigi wa raishuu ni enki ni natta.', vi: 'Cuộc họp đã bị hoãn sang tuần sau.' },
        { text: '{応募者|おうぼしゃ}が{多|おお}い{場合|ばあい}は{抽選|ちゅうせん}になります。', ro: 'Oubosha ga ooi baai wa chuusen ni narimasu.', vi: 'Trường hợp nhiều người đăng ký sẽ bốc thăm.' },
        { text: '{環境|かんきょう}を{守|まも}るための{対策|たいさく}が{必要|ひつよう}だ。', ro: 'Kankyou o mamoru tame no taisaku ga hitsuyou da.', vi: 'Cần biện pháp để bảo vệ môi trường.' },
        { text: '{駐車場|ちゅうしゃじょう}の{料金|りょうきん}は{税込|ぜいこ}みで{五百円|ごひゃくえん}です。', ro: 'Chuushajou no ryoukin wa zeikomi de gohyaku en desu.', vi: 'Phí bãi đỗ xe là 500 yên đã gồm thuế.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 8. ĐỀ 2 (RÚT GỌN) ═══════════════════════════ */

const DE_2: Lesson = {
  id: 'b40-de-2',
  kind: 'review',
  title: 'Thi thử N3 · Đề 2 (rút gọn) — 47 câu đủ 3 phần: 文字・語彙 17 · 文法 11 · 読解 6 · 聴解 13 (~75 phút)',
  goal: 'Làm lại một đề N3 rút gọn sau khi đã ôn theo bảng điểm Đề 1: đủ mọi dạng 問題 (漢字読み, 表記, 文脈規定, 言い換え類義, 用法, 文法形式, 文の組み立て, 短文, 中文, 情報検索, 課題理解, ポイント理解, 概要理解, 発話表現, 即時応答) với từ, mẫu và tình huống KHÁC Đề 1 — để kiểm tra mình đã thật sự sửa được chỗ yếu.',
  minutes: 75,
  blocks: [
    {
      t: 'recap',
      title: 'Cách làm Đề 2',
      items: [
        'Bấm giờ: **文字・語彙 15′ → 文法・読解 30′ → 聴解 ~25′** (tỉ lệ giống đề thật, rút gọn theo số câu). Không tra cứu.',
        'Chấm ở ghi chú cuối đề. Mục tiêu: **mảng yếu nhất ở Đề 1 tăng ≥ 10%**. Câu nào sai — mỗi câu có ghi Bài cần ôn trong phần giải thích.',
      ],
    },

    /* ── 文字・語彙 ── */
    { t: 'h', text: 'もんだい1 ＿＿のことばの{読|よ}み{方|かた}として{最|もっと}もよいものを、1・2・3・4から{一|ひと}つえらびなさい。' },
    MCQ('b40-d2-kanji-yomi', '問題1 漢字読み（1〜4）', [
      Q('（1）{事故|じこ}の{後|あと}、{現場|げんば}の **状況** を{確|たし}かめた。', ['じょうきょ', 'しょうきょう', 'じょうきょう', 'じょきょう'], 2,
        '**{状況|じょうきょう}** — Bài 27. Cả ジョウ và キョウ đều dài, ジョ có dấu đục.'),
      Q('（2）{駅前|えきまえ}の{店|みせ}は、{今日|きょう}は **臨時** {休業|きゅうぎょう}だ。', ['りんじ', 'りんし', 'いんじ', 'りんじい'], 0,
        '**{臨時|りんじ}** (rinji — đột xuất) — Bài 38. 時 trong từ ghép này đọc ジ (đục).'),
      Q('（3）{試合|しあい}の{後|あと}、{相手|あいて}の{選手|せんしゅ}と **握手** した。', ['あくしゅう', 'あくて', 'あっしゅ', 'あくしゅ'], 3,
        '**{握手|あくしゅ}** (akushu — bắt tay) — Bài 36. 手 đọc シュ (ngắn); đứng riêng mới là て.'),
      Q('（4）{毎日|まいにち}の{努力|どりょく}を **継続** することが{大切|たいせつ}だ。', ['けいそく', 'けいぞく', 'けいしょく', 'けいぞっく'], 1,
        '**{継続|けいぞく}** (keizoku — duy trì) — Bài 34. 続 trong từ ghép đọc ゾク (đục, không っ).'),
    ]),
    { t: 'h', text: 'もんだい2 ＿＿のことばを{漢字|かんじ}で{書|か}くとき、{最|もっと}もよいものを、1・2・3・4から{一|ひと}つえらびなさい。' },
    MCQ('b40-d2-hyouki', '問題2 表記（5〜7）', [
      Q('（5）{会議|かいぎ}で{新|あたら}しいアイデアを **ていあん** した。', ['提案', '堤案', '提安', '程案'], 0,
        '**提案** (teian — đề xuất) — 提 Bài 26 (bộ 扌 tay — "đưa ra"). 堤 (đê) bộ 土; 程 (Bài 29, {程度|ていど}) cùng âm テイ.'),
      Q('（6）{川|かわ}に **そって** {桜|さくら}の{木|き}が{並|なら}んでいる。', ['添って', '沿って', '治って', '浴って'], 1,
        '**沿って** (dọc theo) — Bài 33, bộ 氵 (nước — "men theo dòng"). **{添|そ}う** (Bài 37, {添付|てんぷ}) cũng đọc そう nhưng nghĩa "đi kèm" — không dùng cho "dọc con sông".'),
      Q('（7）{子|こ}どもの{頃|ころ}の **きおく** は、ほとんどない。', ['記億', '紀憶', '紀億', '記憶'], 3,
        '**記憶** (kioku — ký ức) — 憶 Bài 32, bộ 忄 (tim — "nhớ"). **億** (Bài 33, một trăm triệu) bộ 亻 — bẫy chữ trông giống. 紀 (Bài 32, {世紀|せいき}) cùng âm キ.'),
    ]),
    { t: 'h', text: 'もんだい3 （　）に{入|い}れるのに{最|もっと}もよいものを、1・2・3・4から{一|ひと}つえらびなさい。' },
    MCQ('b40-d2-bunmyaku', '問題3 文脈規定（8〜12）', [
      Q('（8）{事故|じこ}で{道路|どうろ}が（　）していて、{約束|やくそく}の{時間|じかん}に{遅|おく}れた。', ['{運休|うんきゅう}', '{延期|えんき}', '{渋滞|じゅうたい}', '{停電|ていでん}'], 2,
        '**{道路|どうろ}が{渋滞|じゅうたい}する** (tắc đường) — Bài 27. {運休|うんきゅう} dùng cho tàu xe ngừng chạy; {延期|えんき} cho sự kiện.'),
      Q('（9）{試験|しけん}の{日|ひ}は、{時間|じかん}に（　）を{持|も}って{家|いえ}を{出|で}よう。', ['{余裕|よゆう}', '{余計|よけい}', '{充実|じゅうじつ}', '{手間|てま}'], 0,
        '**{時間|じかん}に{余裕|よゆう}を{持|も}つ** (để dư thời gian) — Bài 34. {余計|よけい} (thừa, không cần) — Bài 35, nghĩa xấu.'),
      Q('（10）{申|もう}し{込|こ}みの{順番|じゅんばん}に{関係|かんけい}なく、（　）で{参加者|さんかしゃ}を{決|き}めます。', ['{先着順|せんちゃくじゅん}', '{定員|ていいん}', '{窓口|まどぐち}', '{抽選|ちゅうせん}'], 3,
        '"Không liên quan thứ tự đăng ký" ⇒ **{抽選|ちゅうせん}** (bốc thăm) — Bài 38. {先着順|せんちゃくじゅん} chính là "theo thứ tự" — ngược điều kiện.'),
      Q('（11）{駅|えき}で（　）{高校|こうこう}の{友達|ともだち}に{会|あ}った。', ['{当然|とうぜん}', '{偶然|ぐうぜん}', '{必|かなら}ず', '{確|たし}か'], 1,
        '**{偶然|ぐうぜん}** (tình cờ) — Bài 26. {当然|とうぜん} = đương nhiên (Bài 28).'),
      Q('（12）{説明書|せつめいしょ}の（　）どおりに{組|く}み{立|た}てたら、うまくできた。', ['{手順|てじゅん}', '{手段|しゅだん}', '{手間|てま}', '{手数料|てすうりょう}'], 0,
        '**{手順|てじゅん}どおりに** (theo đúng các bước) — Bài 33. {手段|しゅだん} = phương tiện (Bài 27); {手数料|てすうりょう} = phí (Bài 39). Bốn từ cùng chữ 手 — bẫy hình thức.'),
    ]),
    { t: 'h', text: 'もんだい4 ＿＿に{意味|いみ}が{最|もっと}も{近|ちか}いものを、1・2・3・4から{一|ひと}つえらびなさい。' },
    MCQ('b40-d2-iikae', '問題4 言い換え類義（13〜15）', [
      Q('（13）**ぎりぎり** で{授業|じゅぎょう}に{間|ま}に{合|あ}った。', ['{少|すこ}し{早|はや}めに', 'もう{少|すこ}しで{遅|おく}れるところで', 'ゆっくり{歩|ある}いて', '{予定|よてい}どおりに'], 1,
        '**ぎりぎり** = sát nút (Bài 34) ≈ **もう{少|すこ}しで{遅|おく}れるところ** (suýt nữa thì muộn).'),
      Q('（14）メールを{読|よ}んで、**さっそく** {返事|へんじ}を{書|か}いた。', ['ゆっくり', '{何度|なんど}も', 'すぐに', 'とりあえず'], 2,
        '**さっそく** = ngay lập tức (Bài 37/39) ≈ **すぐに**. とりあえず = trước mắt, tạm thời — khác.'),
      Q('（15）{新|あたら}しい{生活|せいかつ}に **{徐々|じょじょ}に** {慣|な}れてきた。', ['{急|きゅう}に', 'すっかり', 'やっと', '{少|すこ}しずつ'], 3,
        '**{徐々|じょじょ}に** = từ từ (Bài 32) ≈ **{少|すこ}しずつ**. すっかり = hoàn toàn; やっと = cuối cùng thì.'),
    ]),
    { t: 'h', text: 'もんだい5 つぎのことばの{使|つか}い{方|かた}として{最|もっと}もよいものを、1・2・3・4から{一|ひと}つえらびなさい。' },
    MCQ('b40-d2-youhou', '問題5 用法（16〜17）', [
      Q('（16）{余計|よけい}', [
        '{試験|しけん}に{合格|ごうかく}して、{余計|よけい}な{気持|きも}ちになった。',
        '{余計|よけい}なことを{言|い}って、{友達|ともだち}を{怒|おこ}らせてしまった。',
        'お{金|かね}が{余計|よけい}なので、たくさん{買|か}い{物|もの}をした。',
        'この{料理|りょうり}は{余計|よけい}で、とてもおいしい。',
      ], 1,
        '**{余計|よけい}な N** = thừa, không cần thiết (Bài 35) — {余計|よけい}なことを{言|い}う (nói điều không nên nói). Câu 3 nhầm {余裕|よゆう}がある.'),
      Q('（17）{実感|じっかん}', [
        '{日本|にほん}に{来|き}て{一年|いちねん}、{日本語|にほんご}が{上手|じょうず}になったと{実感|じっかん}している。',
        '{明日|あした}は{雨|あめ}が{降|ふ}ると{実感|じっかん}している。',
        'この{本|ほん}は{実感|じっかん}なので、とてもおもしろい。',
        '{先生|せんせい}に{授業|じゅぎょう}の{実感|じっかん}を{聞|き}かれた。',
      ], 0,
        '**{実感|じっかん}する** = cảm nhận rõ bằng trải nghiệm thật (Bài 35). Đoán thời tiết ⇒ {予想|よそう}; cảm nghĩ về giờ học ⇒ {感想|かんそう} (Bài 28).'),
    ]),

    /* ── 文法 ── */
    { t: 'h', text: 'もんだい6 つぎの{文|ぶん}の（　）に{入|い}れるのに{最|もっと}もよいものを、1・2・3・4から{一|ひと}つえらびなさい。（文法形式の判断）' },
    MCQ('b40-d2-bunpou', '文法形式の判断（18〜25）', [
      QP('（18）{雨|あめ}が{降|ふ}らない（　）、{洗濯物|せんたくもの}を{取|と}り{込|こ}もう。', 'うちに', ['{最中|さいちゅう}に', 'とたんに', '{間|あいだ}'], 1,
        'Trước khi trời mưa + ý chí (～よう) ⇒ **Vない＋うちに** — Bài 26 ①.'),
      QP('（19）{十年|じゅうねん}も{日本|にほん}に{住|す}んでいる（　）、{漢字|かんじ}がほとんど{読|よ}めないなんて{驚|おどろ}いた。', 'にもかかわらず', ['おかげで', 'ために', 'うえに'], 3,
        '"Mặc dù sống những mười năm…" + kết quả trái dự đoán ⇒ **にもかかわらず** — Bài 28 ③.'),
      QP('（20）この{仕事|しごと}は、{経験|けいけん}（　）あれば{誰|だれ}でもできる。', 'さえ', ['ほど', 'ばかり', 'とか'], 0,
        'Điều kiện tối thiểu ⇒ **Nさえ～ば** — Bài 29 ⑦.'),
      QP('（21）ニュースによると、{台風|たいふう}は{今夜|こんや}{関東|かんとう}に{近|ちか}づく（　）。', 'ということだ', ['わけだ', 'ものだ', 'ことだ'], 2,
        '**～によると、～ということだ** — truyền tin có nguồn (Bài 30 ③ + Bài 33 ①).'),
      QP('（22）この{問題|もんだい}は{難|むずか}しすぎて、{一年生|いちねんせい}に{解|と}ける（　）。', 'わけがない', ['わけだ', 'に{違|ちが}いない', 'ものだ'], 1,
        '"Khó quá" ⇒ phủ định mạnh **わけがない** (làm gì giải được) — Bài 31 ③.'),
      QP('（23）{携帯電話|けいたいでんわ}の{普及|ふきゅう}（　）、{公衆電話|こうしゅうでんわ}は{少|すく}なくなった。', 'とともに', ['に{対|たい}して', 'にとって', 'について'], 0,
        'Thay đổi theo đà ⇒ **Nとともに** (c) — Bài 33 ⑤.'),
      QP('（24）{窓|まど}を{開|あ}け（　）で{出|で}かけてしまった。', 'っぱなし', ['がち', '{気味|ぎみ}', 'ほど'], 3,
        'Để nguyên cửa sổ mở (chê) ⇒ **Vます＋っぱなし** — Bài 34 ④.'),
      QP('（25）お{客様|きゃくさま}、こちらの{用紙|ようし}にお{名前|なまえ}をご{記入|きにゅう}（　）。', 'ください', ['いたします', 'させていただきます', '{申|もう}し{上|あ}げます'], 2,
        'Mời KHÁCH làm ⇒ **ご＋N＋ください** (tôn kính) — Bài 37. いたします・申し上げます là khiêm nhường (việc của mình).'),
    ]),
    { t: 'h', text: 'もんだい7 つぎの{文|ぶん}の ★ に{入|はい}る{最|もっと}もよいものを、1・2・3・4から{一|ひと}つえらびなさい。（文の組み立て）' },
    MCQ('b40-d2-kumitate', '文の組み立て（26〜28）', [
      Q('（26）この{本|ほん}は ＿＿ ＿＿ ★ ＿＿ {書|か}かれている。', ['もとに', '{実際|じっさい}に', '{事件|じけん}を', 'あった'], 2,
        'Câu đúng: **{実際|じっさい}に あった {事件|じけん}を もとに** {書|か}かれている. Ô ★ (thứ 3) = **{事件|じけん}を**. N をもとに — Bài 33 ③; bị động 書かれる — Bài 22.'),
      Q('（27）もし ＿＿ ＿＿ ★ ＿＿ 、{何|なに}をしたいですか。', ['としたら', 'もらえる', '{一|いっ}か{月|げつ}の', '{休|やす}みが'], 1,
        'Câu đúng: もし **{一|いっ}か{月|げつ}の {休|やす}みが もらえる としたら** 、… Ô ★ (thứ 3) = **もらえる**. 普通形＋としたら — Bài 34 ⑦.'),
      Q('（28）これから、＿＿ ＿＿ ★ ＿＿ {説明|せつめい}します。', ['{沿|そ}って', '{今|いま}', '{配|くば}った', '{資料|しりょう}に'], 3,
        'Câu đúng: **{今|いま} {配|くば}った {資料|しりょう}に {沿|そ}って** {説明|せつめい}します. Ô ★ (thứ 3) = **{資料|しりょう}に**. N に沿って — Bài 33 ④.'),
    ]),

    /* ── 読解 ── */
    { t: 'h', text: 'もんだい8 つぎの{文章|ぶんしょう}を{読|よ}んで、{質問|しつもん}に{答|こた}えなさい。（内容理解・短文）' },
    {
      t: 'passage',
      title: '（29）— {寮|りょう}のお{知|し}らせ',
      paras: [
        { text: '{国際寮|こくさいりょう}のみなさんへ' },
        { text: '{来週|らいしゅう}、{各部屋|かくへや}のエアコンの{点検|てんけん}を{行|おこな}います。{点検|てんけん}は11{月|がつ}12{日|にち}（{火|か}）から14{日|か}（{木|もく}）までの3{日間|みっかかん}で、1{部屋|へや}{約|やく}20{分|ぷん}です。{部屋|へや}{番号|ばんごう}ごとの{日時|にちじ}は、1{階|かい}の{掲示板|けいじばん}に{貼|は}ってあります。' },
        { text: '{当日|とうじつ}、{部屋|へや}にいられない{場合|ばあい}は、{前|まえ}の{日|ひ}までに{管理人室|かんりにんしつ}に{鍵|かぎ}を{預|あず}けてください。なお、{点検|てんけん}の{日時|にちじ}の{変更|へんこう}はできません。　{管理人|かんりにん}' },
      ],
    },
    MCQ('b40-d2-tanbun', '（29）', [
      Q('（29）{点検|てんけん}の{日|ひ}に{部屋|へや}にいられない{人|ひと}は、どうしなければなりませんか。', [
        '{掲示板|けいじばん}を{見|み}て、{別|べつ}の{日|ひ}に{変|か}えてもらう',
        '{点検|てんけん}の{前|まえ}の{日|ひ}までに、{管理人室|かんりにんしつ}に{鍵|かぎ}を{預|あず}ける',
        '{点検|てんけん}の{当日|とうじつ}に、{管理人室|かんりにんしつ}に{電話|でんわ}する',
        '{鍵|かぎ}をドアの{前|まえ}に{置|お}いておく',
      ], 1,
        '**{前|まえ}の{日|ひ}までに{管理人室|かんりにんしつ}に{鍵|かぎ}を{預|あず}けてください** ⇒ đáp án 2. **なお、{日時|にちじ}の{変更|へんこう}はできません** loại 1 (Bài 38 ⑦ — なお mở thông tin bổ sung quan trọng).'),
    ]),
    { t: 'h', text: 'もんだい9 つぎの{文章|ぶんしょう}を{読|よ}んで、{質問|しつもん}に{答|こた}えなさい。（内容理解・中文）' },
    {
      t: 'passage',
      title: '（30〜32）— {三日坊主|みっかぼうず}の{私|わたし}が{続|つづ}けられたこと',
      paras: [
        { text: '{私|わたし}は{昔|むかし}から{三日坊主|みっかぼうず}だ。ジョギングも{日記|にっき}も、{始|はじ}めては{三日|みっか}でやめてしまった。そんな{私|わたし}が、{漢字|かんじ}の{勉強|べんきょう}だけは{一年|いちねん}{続|つづ}いている。' },
        { text: '{理由|りゆう}の{一|ひと}つは、{目標|もくひょう}を{小|ちい}さくしたことだ。{最初|さいしょ}は「{毎日|まいにち}{漢字|かんじ}を{二十|にじゅう}{覚|おぼ}える」と{決|き}めたが、{一週間|いっしゅうかん}でやめてしまった。そこで、「{寝|ね}る{前|まえ}に{一|ひと}つだけ{書|か}く」ことにした。{一|ひと}つなら、{疲|つか}れていてもできる。 **①{不思議|ふしぎ}なことに**、{一|ひと}つ{書|か}くと、もう{一|ひと}つ{書|か}きたくなる{日|ひ}も{多|おお}い。' },
        { text: 'もう{一|ひと}つは、{記録|きろく}をつけたことだ。カレンダーに、{書|か}いた{日|ひ}は{丸|まる}をつける。{丸|まる}が{続|つづ}くと、それを{途中|とちゅう}で{切|き}りたくないという{気持|きも}ちになる。' },
        { text: '{大|おお}きな{目標|もくひょう}を{立|た}てるのは{悪|わる}いことではない。しかし、{続|つづ}けることが{目的|もくてき}なら、「これなら{絶対|ぜったい}にできる」と{思|おも}えるくらい{小|ちい}さく{始|はじ}めるほうがいいと{思|おも}う。' },
      ],
    },
    MCQ('b40-d2-chuubun', '（30〜32）', [
      Q('（30）{筆者|ひっしゃ}が{漢字|かんじ}の{勉強|べんきょう}を{続|つづ}けられた{理由|りゆう}として、{正|ただ}しいものはどれか。', [
        '{毎日|まいにち}{漢字|かんじ}を{二十|にじゅう}{覚|おぼ}えることにしたから',
        '{寝|ね}る{前|まえ}に{一|ひと}つだけ{書|か}くことにしたから',
        '{友達|ともだち}と{一緒|いっしょ}に{勉強|べんきょう}したから',
        'ジョギングをやめて、{時間|じかん}ができたから',
      ], 1,
        'Đoạn 2: mục tiêu 20 chữ → **{一週間|いっしゅうかん}でやめてしまった** (thất bại); **そこで**「{寝|ね}る{前|まえ}に{一|ひと}つだけ{書|か}く」**ことにした** ⇒ đáp án 2 (ことにする — Bài 21).'),
      Q('（31）「①{不思議|ふしぎ}なことに」とあるが、{何|なに}が{不思議|ふしぎ}なのか。', [
        '{一|ひと}つだけのつもりでも、もっと{書|か}きたくなる{日|ひ}が{多|おお}いこと',
        '{疲|つか}れていると、{一|ひと}つも{書|か}けないこと',
        'カレンダーに{丸|まる}をつけると、{勉強|べんきょう}が{嫌|いや}になること',
        '{三日|みっか}で{勉強|べんきょう}をやめてしまうこと',
      ], 0,
        'Câu ngay sau ①: **{一|ひと}つ{書|か}くと、もう{一|ひと}つ{書|か}きたくなる{日|ひ}も{多|おお}い** ⇒ đáp án 1. "{一|ひと}つなら、{疲|つか}れていてもできる" loại 2.'),
      Q('（32）{筆者|ひっしゃ}の{考|かんが}えに{合|あ}うのはどれか。', [
        '{大|おお}きな{目標|もくひょう}を{立|た}てるのはよくない',
        '{記録|きろく}をつけると、{勉強|べんきょう}が{続|つづ}かなくなる',
        '{続|つづ}けたいなら、とても{小|ちい}さな{目標|もくひょう}から{始|はじ}めるほうがいい',
        '{三日坊主|みっかぼうず}の{人|ひと}は、{漢字|かんじ}の{勉強|べんきょう}をしないほうがいい',
      ], 2,
        'Đoạn cuối: **{大|おお}きな{目標|もくひょう}を{立|た}てるのは{悪|わる}いことではない**(loại 1). **しかし**… **{小|ちい}さく{始|はじ}めるほうがいい** ⇒ đáp án 3 (ý chính sau しかし — Bài 38 ①⑩). くらい "đến mức" — Bài 29 ④.'),
    ]),
    { t: 'h', text: 'もんだい10 {右|みぎ}のページは、{市民|しみん}プールの{料金表|りょうきんひょう}である。これを{読|よ}んで、{質問|しつもん}に{答|こた}えなさい。（情報検索）' },
    {
      t: 'table',
      caption: 'みなと{市民|しみん}プール　{利用料金|りようりょうきん}',
      head: ['{区分|くぶん}', '1{回|かい}', '{回数券|かいすうけん}（11{回分|かいぶん}）'],
      rows: [
        ['{一般|いっぱん}', '600{円|えん}', '6,000{円|えん}'],
        ['{学生|がくせい}（{高校生|こうこうせい}・{大学生|だいがくせい}）', '400{円|えん}', '4,000{円|えん}'],
        ['{子|こ}ども（{中学生|ちゅうがくせい}{以下|いか}）', '200{円|えん}', '2,000{円|えん}'],
      ],
    },
    {
      t: 'note',
      title: '{注意|ちゅうい}',
      items: [
        '{学生|がくせい}{料金|りょうきん}は、{受付|うけつけ}で{学生証|がくせいしょう}を{見|み}せてください。',
        '{平日|へいじつ}の{夜|よる}（18{時|じ}{以降|いこう}）は、1{回|かい}の{料金|りょうきん}が{半額|はんがく}になります（{回数券|かいすうけん}は{除|のぞ}く）。',
        '{毎週|まいしゅう}{月曜日|げつようび}は{休館日|きゅうかんび}です。',
      ],
    },
    MCQ('b40-d2-jouhou', '（33〜34）', [
      Q('（33）{大学生|だいがくせい}のリンさんは、{水曜日|すいようび}の{夜|よる}7{時|じ}にプールへ{行|い}って、{学生証|がくせいしょう}を{見|み}せた。いくら{払|はら}うか。', ['600{円|えん}', '400{円|えん}', '300{円|えん}', '200{円|えん}'], 3,
        'Sinh viên: 400 yên; thứ Tư là **{平日|へいじつ}**, 7 giờ tối là sau 18 giờ ⇒ **{半額|はんがく}** ⇒ 200 yên. Bẫy 300 yên = nửa giá vé người lớn… cũng không, chỉ là số nhiễu.'),
      Q('（34）{大学生|だいがくせい}のカルロスさんは、{土曜日|どようび}と{日曜日|にちようび}だけ、{全部|ぜんぶ}で11{回|かい}{行|い}くつもりだ。{最|もっと}も{安|やす}くするには、いくら{払|はら}えばいいか。', ['2,200{円|えん}', '4,000{円|えん}', '4,400{円|えん}', '6,000{円|えん}'], 1,
        'Cuối tuần ⇒ KHÔNG được giảm nửa giá (chỉ ngày thường buổi tối) ⇒ 400 × 11 = 4.400 yên; **{回数券|かいすうけん}** sinh viên 11 lần = **4.000 yên** ⇒ rẻ nhất. 2.200 yên là bẫy áp nhầm giá tối ngày thường.'),
    ]),

    /* ── 聴解 ── */
    { t: 'h', text: 'もんだい11 — 聴解（35〜47）: 課題理解 2 · ポイント理解 2 · 概要理解 1 · 発話表現 2 · 即時応答 6. Mỗi bài nghe MỘT lần.' },
    NG('b40-d2-ng-35', '（35）インターンの{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか', '課題理解 — ～てある (xong) · ～てからでいい (để sau) · でも、メールの前に (chen việc lên trước) · 伺う (Bài 37).', [
      [NA, 'ja-nu', '{会社|かいしゃ}で、{先輩|せんぱい}とインターンの{女|おんな}の{人|ひと}が{話|はな}しています。インターンの{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Kaisha de, senpai to intaan no onna no hito ga hanashite imasu. Intaan no onna no hito wa kono ato mazu nani o shimasu ka.', 'Ở công ty, một chị đàn chị và một nữ thực tập sinh đang nói chuyện. Sau đây nữ thực tập sinh trước tiên sẽ làm gì?'],
      ['ワン', 'ja-nu', '{鈴木|すずき}さん、{来週|らいしゅう}の{歓迎会|かんげいかい}のお{店|みせ}、{予約|よやく}しましょうか。', 'Suzuki-san, raishuu no kangeikai no omise, yoyaku shimashou ka.', 'Chị Suzuki, để em đặt quán cho tiệc chào mừng tuần sau nhé?'],
      ['{鈴木|すずき}', 'ja-nu', 'お{店|みせ}はもう{予約|よやく}してあるの。それより、{参加|さんか}する{人|ひと}がまだはっきりしないから、みんなにメールで{聞|き}いてくれる？', 'Omise wa mou yoyaku shite aru no. Sore yori, sanka suru hito ga mada hakkiri shinai kara, minna ni meeru de kiite kureru?', 'Quán thì chị đặt rồi. Quan trọng hơn, chưa rõ ai tham gia, em hỏi mọi người qua mail giúp chị nhé?'],
      ['ワン', 'ja-nu', 'はい。お{店|みせ}にも{人数|にんずう}を{連絡|れんらく}しておきましょうか。', 'Hai. Omise ni mo ninzuu o renraku shite okimashou ka.', 'Vâng. Em báo trước số người cho quán luôn nhé?'],
      ['{鈴木|すずき}', 'ja-nu', 'それは{人数|にんずう}が{決|き}まってからでいいよ。あ、でも、メールの{前|まえ}に、{課長|かちょう}にご{都合|つごう}を{伺|うかが}ってくれる？ {課長|かちょう}の{都合|つごう}で{日|ひ}にちが{変|か}わるかもしれないから。', 'Sore wa ninzuu ga kimatte kara de ii yo. A, demo, meeru no mae ni, kachou ni gotsugou o ukagatte kureru? Kachou no tsugou de hinichi ga kawaru kamo shirenai kara.', 'Cái đó đợi chốt số người rồi hẵng báo. À, nhưng trước khi gửi mail, em hỏi trưởng phòng xem lịch có tiện không nhé? Có khi tuỳ lịch trưởng phòng mà đổi ngày đấy.'],
      ['ワン', 'ja-nu', 'わかりました。すぐ{課長|かちょう}に{伺|うかが}ってきます。', 'Wakarimashita. Sugu kachou ni ukagatte kimasu.', 'Em hiểu rồi. Em đi hỏi trưởng phòng ngay ạ.'],
      [NA, 'ja-nu', 'インターンの{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Intaan no onna no hito wa kono ato mazu nani o shimasu ka.', 'Sau đây nữ thực tập sinh trước tiên sẽ làm gì?'],
    ]),
    MCQ('b40-d2-ng-35-q', '（35）', [
      Q('（35）インターンの{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', ['{店|みせ}を{予約|よやく}する', 'みんなに{参加|さんか}するか{聞|き}く', '{店|みせ}に{人数|にんずう}を{連絡|れんらく}する', '{課長|かちょう}に{都合|つごう}を{聞|き}く'], 3,
        'Quán → **{予約|よやく}してある**; báo số người → **{決|き}まってからでいい**; mail hỏi mọi người → bị chen: **メールの{前|まえ}に、{課長|かちょう}にご{都合|つごう}を{伺|うかが}って** ⇒ hỏi trưởng phòng trước ({伺|うかが}う = khiêm nhường của {聞|き}く — Bài 37).'),
    ]),
    NG('b40-d2-ng-36', '（36）{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか', '課題理解 — Bài 39 (紛失・再発行・手数料・身分証明書), ただ、その前に～てみてはいかがですか.', [
      [NA, 'ja-nu', '{駅|えき}の{窓口|まどぐち}で、{女|おんな}の{人|ひと}と{駅員|えきいん}が{話|はな}しています。{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Eki no madoguchi de, onna no hito to ekiin ga hanashite imasu. Onna no hito wa kono ato mazu nani o shimasu ka.', 'Ở quầy nhà ga, một người phụ nữ và nhân viên nhà ga đang nói chuyện. Sau đây người phụ nữ trước tiên sẽ làm gì?'],
      ['マリヤム', 'ja-nu', 'すみません、{定期券|ていきけん}をなくしてしまったんですが……。', 'Sumimasen, teikiken o nakushite shimatta n desu ga…….', 'Xin lỗi, tôi lỡ làm mất vé tháng…'],
      ['{駅員|えきいん}', 'ja-nam', 'そうですか。{再発行|さいはっこう}はできますが、{手数料|てすうりょう}が{五百円|ごひゃくえん}かかります。それから、{身分証明書|みぶんしょうめいしょ}が{必要|ひつよう}です。', 'Sou desu ka. Saihakkou wa dekimasu ga, tesuuryou ga gohyaku en kakarimasu. Sorekara, mibun shoumeisho ga hitsuyou desu.', 'Vậy à. Cấp lại thì được, nhưng mất phí 500 yên. Và cần giấy tờ tuỳ thân.'],
      ['マリヤム', 'ja-nu', '{在留|ざいりゅう}カードなら{持|も}っています。', 'Zairyuu kaado nara motte imasu.', 'Thẻ cư trú thì tôi có mang.'],
      ['{駅員|えきいん}', 'ja-nam', 'それで{大丈夫|だいじょうぶ}です。ただ、その{前|まえ}に、お{忘|わす}れ{物|もの}センターに{届|とど}いていないか、{確認|かくにん}してみてはいかがですか。{届|とど}いていれば、{再発行|さいはっこう}しなくて{済|す}みますから。あちらの{窓口|まどぐち}です。', 'Sore de daijoubu desu. Tada, sono mae ni, owasuremono sentaa ni todoite inai ka, kakunin shite mite wa ikaga desu ka. Todoite ireba, saihakkou shinakute sumimasu kara. Achira no madoguchi desu.', 'Thẻ đó được. Có điều trước đó, chị thử kiểm tra xem có ai mang nộp ở trung tâm đồ thất lạc chưa? Nếu có thì không phải cấp lại. Quầy đằng kia ạ.'],
      ['マリヤム', 'ja-nu', 'そうですね。じゃあ、まずそちらで{聞|き}いてみます。', 'Sou desu ne. Jaa, mazu sochira de kiite mimasu.', 'Phải rồi. Vậy tôi hỏi ở đó trước.'],
      [NA, 'ja-nu', '{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Onna no hito wa kono ato mazu nani o shimasu ka.', 'Sau đây người phụ nữ trước tiên sẽ làm gì?'],
    ]),
    MCQ('b40-d2-ng-36-q', '（36）', [
      Q('（36）{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', ['お{忘|わす}れ{物|もの}センターで{聞|き}く', '{定期券|ていきけん}の{再発行|さいはっこう}を{申|もう}し{込|こ}む', '{手数料|てすうりょう}を{払|はら}う', '{身分証明書|みぶんしょうめいしょ}を{取|と}りに{帰|かえ}る'], 0,
        'Giấy tờ → **{在留|ざいりゅう}カードなら{持|も}っています** (không cần về lấy); cấp lại + phí là việc SAU. Câu chốt: **その{前|まえ}に…{確認|かくにん}してみてはいかがですか** → **まずそちらで{聞|き}いてみます**.'),
    ]),
    NG('b40-d2-ng-37', '（37）{男|おとこ}の{学生|がくせい}はどうして{遅|おく}れましたか', 'ポイント理解 — hai lý do bị phủ định (違うよ · 時間どおりだった) → 実は.', [
      [NA, 'ja-nu', '{女|おんな}の{学生|がくせい}と{男|おとこ}の{学生|がくせい}が{話|はな}しています。{男|おとこ}の{学生|がくせい}はどうして{遅|おく}れましたか。', 'Onna no gakusei to otoko no gakusei ga hanashite imasu. Otoko no gakusei wa doushite okuremashita ka.', 'Một nữ sinh và một nam sinh đang nói chuyện. Vì sao nam sinh đến muộn?'],
      ['パク', 'ja-nu', 'カルロスさん、{遅|おそ}かったね。{寝坊|ねぼう}？', 'Karurosu-san, osokatta ne. Nebou?', 'Carlos, cậu đến muộn thế. Ngủ quên à?'],
      ['カルロス', 'ja-nam', '{違|ちが}うよ、ちゃんと{起|お}きたよ。{電車|でんしゃ}も{時間|じかん}どおりだったし。', 'Chigau yo, chanto okita yo. Densha mo jikan doori datta shi.', 'Không, tớ dậy đúng giờ mà. Tàu cũng chạy đúng giờ.'],
      ['パク', 'ja-nu', 'じゃあ、どうしたの？', 'Jaa, dou shita no?', 'Thế sao vậy?'],
      ['カルロス', 'ja-nam', '{実|じつ}は、{駅|えき}まで{行|い}ってから、{発表|はっぴょう}の{資料|しりょう}を{家|いえ}に{忘|わす}れたことに{気|き}づいて、{取|と}りに{帰|かえ}ったんだ。', 'Jitsu wa, eki made itte kara, happyou no shiryou o ie ni wasureta koto ni kizuite, tori ni kaetta n da.', 'Thật ra tớ ra tới ga rồi mới nhận ra để quên tài liệu thuyết trình ở nhà, nên quay về lấy.'],
      ['パク', 'ja-nu', 'そうだったんだ。{間|ま}に{合|あ}ってよかったね。', 'Sou datta n da. Ma ni atte yokatta ne.', 'Ra vậy. Kịp là may rồi.'],
      [NA, 'ja-nu', '{男|おとこ}の{学生|がくせい}はどうして{遅|おく}れましたか。', 'Otoko no gakusei wa doushite okuremashita ka.', 'Vì sao nam sinh đến muộn?'],
    ]),
    MCQ('b40-d2-ng-37-q', '（37）', [
      Q('（37）{男|おとこ}の{学生|がくせい}はどうして{遅|おく}れましたか。', ['{寝坊|ねぼう}したから', '{電車|でんしゃ}が{遅|おく}れたから', '{資料|しりょう}を{取|と}りに{家|いえ}に{帰|かえ}ったから', '{道|みち}に{迷|まよ}ったから'], 2,
        'Ngủ quên → **{違|ちが}うよ**; tàu → **{時間|じかん}どおり**. Sau **{実|じつ}は**: **{資料|しりょう}を{家|いえ}に{忘|わす}れた…{取|と}りに{帰|かえ}った** ⇒ đáp án 3.'),
    ]),
    NG('b40-d2-ng-38', '（38）{管理人|かんりにん}さんは、{留学生|りゅうがくせい}に{何|なに}をしてほしいと{言|い}っていますか', 'ポイント理解 — khen trước (～てくれてるね) → ただね (Bài 38/39 đảo ý) → yêu cầu thật ～てくれる？.', [
      [NA, 'ja-nu', '{寮|りょう}で、{管理人|かんりにん}さんと{男|おとこ}の{留学生|りゅうがくせい}が{話|はな}しています。{管理人|かんりにん}さんは、{留学生|りゅうがくせい}に{何|なに}をしてほしいと{言|い}っていますか。', 'Ryou de, kanrinin-san to otoko no ryuugakusei ga hanashite imasu. Kanrinin-san wa, ryuugakusei ni nani o shite hoshii to itte imasu ka.', 'Ở ký túc xá, bác quản lý và một nam du học sinh đang nói chuyện. Bác quản lý muốn du học sinh làm gì?'],
      ['{管理人|かんりにん}さん', 'ja-nam', 'ダニエルさん、ちょっといいかな。ごみの{分別|ぶんべつ}、ちゃんとやってくれてるね。ありがとう。{部屋|へや}もきれいに{使|つか}ってくれてるし。', 'Danieru-san, chotto ii ka na. Gomi no bunbetsu, chanto yatte kureteru ne. Arigatou. Heya mo kirei ni tsukatte kureteru shi.', 'Daniel ơi, bác nói chút được không. Cháu phân loại rác đàng hoàng, cảm ơn nhé. Phòng ốc cũng giữ sạch sẽ.'],
      ['ダニエル', 'ja-nam', 'いえ……。', 'Ie…….', 'Dạ, không có gì…'],
      ['{管理人|かんりにん}さん', 'ja-nam', 'ただね、{最近|さいきん}、{夜|よる}{遅|おそ}くに{洗濯機|せんたくき}を{回|まわ}してるでしょう。{隣|となり}の{部屋|へや}の{人|ひと}から、{音|おと}がうるさくて{眠|ねむ}れないって{言|い}われてね。{洗濯|せんたく}は{夜|よる}{十時|じゅうじ}までにしてくれる？', 'Tada ne, saikin, yoru osoku ni sentakuki o mawashiteru deshou. Tonari no heya no hito kara, oto ga urusakute nemurenai tte iwarete ne. Sentaku wa yoru juuji made ni shite kureru?', 'Có điều, dạo này cháu chạy máy giặt khuya lắm phải không. Người phòng bên cạnh than với bác là ồn quá không ngủ được. Cháu giặt trước 10 giờ tối giúp bác nhé?'],
      ['ダニエル', 'ja-nam', 'あ、すみません。{気|き}がつきませんでした。これから{気|き}をつけます。', 'A, sumimasen. Ki ga tsukimasen deshita. Kore kara ki o tsukemasu.', 'À, cháu xin lỗi. Cháu không để ý. Từ giờ cháu sẽ chú ý.'],
      [NA, 'ja-nu', '{管理人|かんりにん}さんは、{留学生|りゅうがくせい}に{何|なに}をしてほしいと{言|い}っていますか。', 'Kanrinin-san wa, ryuugakusei ni nani o shite hoshii to itte imasu ka.', 'Bác quản lý muốn du học sinh làm gì?'],
    ]),
    MCQ('b40-d2-ng-38-q', '（38）', [
      Q('（38）{管理人|かんりにん}さんは、{留学生|りゅうがくせい}に{何|なに}をしてほしいと{言|い}っていますか。', ['ごみの{分|わ}け{方|かた}を{直|なお}すこと', '{夜|よる}{遅|おそ}く{洗濯機|せんたくき}を{使|つか}わないこと', '{部屋|へや}をきれいに{掃除|そうじ}すること', '{友達|ともだち}を{部屋|へや}に{呼|よ}ばないこと'], 1,
        'Rác, phòng → được **khen** (～てくれてるね). Sau **ただね**: **{洗濯|せんたく}は{夜|よる}{十時|じゅうじ}までにしてくれる？** ⇒ đừng chạy máy giặt khuya. (～てる = ～ている — Bài 39 ①.)'),
    ]),
    NG('b40-d2-ng-39', '（39）{留学生|りゅうがくせい}センターの{人|ひと}が{話|はな}しています', '概要理解 — chủ đề nằm ở câu đầu (避難訓練を行います), phần sau là chi tiết (giờ, cách đi, nơi tập trung, ngoại lệ).', [
      [NA, 'ja-nu', '{留学生|りゅうがくせい}センターの{人|ひと}が{話|はな}しています。', 'Ryuugakusei sentaa no hito ga hanashite imasu.', 'Nhân viên trung tâm du học sinh đang nói.'],
      ['センターの{人|ひと}', 'ja-nu', '{皆|みな}さん、こんにちは。{来週|らいしゅう}の{水曜日|すいようび}の{午後|ごご}、{寮|りょう}で{避難訓練|ひなんくんれん}を{行|おこな}います。{午後|ごご}{三時|さんじ}に「{地震|じしん}が{起|お}きました」という{放送|ほうそう}がありますので、{放送|ほうそう}が{聞|き}こえたら、エレベーターは{使|つか}わずに{階段|かいだん}で{下|お}りて、{駐車場|ちゅうしゃじょう}に{集|あつ}まってください。', 'Minasan, konnichiwa. Raishuu no suiyoubi no gogo, ryou de hinan kunren o okonaimasu. Gogo sanji ni "jishin ga okimashita" to iu housou ga arimasu node, housou ga kikoetara, erebeetaa wa tsukawazu ni kaidan de orite, chuushajou ni atsumatte kudasai.', 'Chào các bạn. Chiều thứ Tư tuần sau, ký túc xá sẽ diễn tập sơ tán. 3 giờ chiều sẽ có loa thông báo "Đã xảy ra động đất", khi nghe thấy, các bạn không dùng thang máy mà đi cầu thang xuống, tập trung ở bãi đỗ xe.'],
      ['センターの{人|ひと}', 'ja-nu', '{訓練|くんれん}は{三十分|さんじゅっぷん}ぐらいで{終|お}わります。その{日|ひ}、{授業|じゅぎょう}などで{寮|りょう}にいない{人|ひと}は、{参加|さんか}しなくてもかまいませんが、{前|まえ}の{日|ひ}までに{管理人室|かんりにんしつ}に{伝|つた}えておいてください。', 'Kunren wa sanjuppun gurai de owarimasu. Sono hi, jugyou nado de ryou ni inai hito wa, sanka shinakute mo kamaimasen ga, mae no hi made ni kanrininshitsu ni tsutaete oite kudasai.', 'Buổi diễn tập kết thúc trong khoảng 30 phút. Ngày đó ai có giờ học không ở ký túc xá thì không tham gia cũng được, nhưng hãy báo trước cho phòng quản lý trước ngày hôm đó.'],
      [NA, 'ja-nu', '{何|なに}についての{話|はなし}ですか。', 'Nani ni tsuite no hanashi desu ka.', 'Đây là bài nói về điều gì?'],
    ]),
    MCQ('b40-d2-ng-39-q', '（39）（che lựa chọn, tự nói ý chính trước）', [
      Q('（39）{何|なに}についての{話|はなし}ですか。', ['{地震|じしん}が{起|お}きたときの{逃|に}げ{方|かた}', '{来週|らいしゅう}の{避難訓練|ひなんくんれん}の{案内|あんない}', '{寮|りょう}の{新|あたら}しい{規則|きそく}', '{授業|じゅぎょう}の{休講|きゅうこう}のお{知|し}らせ'], 1,
        'Câu đầu nêu chủ đề: **{来週|らいしゅう}の{水曜日|すいようび}の{午後|ごご}、{寮|りょう}で{避難訓練|ひなんくんれん}を{行|おこな}います**, phần sau là giờ, cách đi, ngoại lệ ⇒ **thông báo buổi diễn tập**. Đáp án 1 chỉ là MỘT chi tiết (đi cầu thang) — bẫy "chi tiết thay cho ý chính" của 概要理解.'),
    ]),
    { t: 'canh', anh: ['man-office-worker', 'face-with-thermometer', 'office-building'], caption: 'Tranh (40): văn phòng. Một nam nhân viên (có mũi tên) mặt đỏ vì sốt, tay đặt lên trán, đứng trước bàn trưởng phòng.' },
    NG('b40-d2-ng-40', '（40）→の{人|ひと}は{何|なん}と{言|い}いますか', '発話表現 — xin phép cho MÌNH về sớm: 早退させていただけないでしょうか (Bài 23 早退 + Bài 35 ④⑨).', [
      [NA, 'ja-nu', '{熱|ねつ}があるので、{会社|かいしゃ}を{早|はや}く{帰|かえ}りたいです。{課長|かちょう}に{何|なん}と{言|い}いますか。', 'Netsu ga aru node, kaisha o hayaku kaeritai desu. Kachou ni nan to iimasu ka.', 'Bạn bị sốt nên muốn về sớm. Bạn nói gì với trưởng phòng?'],
      [NA, 'ja-nu', '1、{申|もう}し{訳|わけ}ありませんが、{熱|ねつ}があるので、{早退|そうたい}させていただけないでしょうか。　2、{申|もう}し{訳|わけ}ありませんが、{熱|ねつ}があるので、{早退|そうたい}していただけないでしょうか。　3、{申|もう}し{訳|わけ}ありませんが、{熱|ねつ}があるので、{早退|そうたい}させてさしあげましょうか。', 'Ichi, moushiwake arimasen ga, netsu ga aru node, soutai sasete itadakenai deshou ka. Ni, moushiwake arimasen ga, netsu ga aru node, soutai shite itadakenai deshou ka. San, moushiwake arimasen ga, netsu ga aru node, soutai sasete sashiagemashou ka.', '1. Xin lỗi, vì em bị sốt, anh có thể cho em về sớm được không ạ? 2. Xin lỗi, vì em bị sốt, anh có thể về sớm giúp em được không? 3. Xin lỗi, vì em bị sốt, để em cho anh về sớm nhé?'],
    ]),
    { t: 'canh', anh: ['woman-student', 'man-student', 'party-popper'], caption: 'Tranh (41): sân trường. Nữ sinh (có mũi tên) gặp một bạn nam đang cầm tờ giấy báo "合格" (đỗ), mặt rạng rỡ.' },
    NG('b40-d2-ng-41', '（41）→の{人|ひと}は{何|なん}と{言|い}いますか', '発話表現 — chúc mừng tin vừa nghe: ～んだって？ (Bài 30) + おめでとう.', [
      [NA, 'ja-nu', '{友達|ともだち}が{試験|しけん}に{合格|ごうかく}したと{聞|き}きました。{何|なん}と{言|い}いますか。', 'Tomodachi ga shiken ni goukaku shita to kikimashita. Nan to iimasu ka.', 'Bạn nghe tin bạn mình thi đỗ. Bạn nói gì?'],
      [NA, 'ja-nu', '1、{合格|ごうかく}したら、おめでとう。　2、{合格|ごうかく}するって。よかったね。　3、{合格|ごうかく}したんだって？ おめでとう！', 'Ichi, goukaku shitara, omedetou. Ni, goukaku suru tte. Yokatta ne. San, goukaku shita n da tte? Omedetou!', '1. Nếu đỗ thì chúc mừng nhé. 2. Nghe nói (cậu) sẽ đỗ đấy. Tốt quá nhỉ. 3. Nghe nói cậu đỗ rồi hả? Chúc mừng nhé!'],
    ]),
    MCQ('b40-d2-ng-40-q', '（40）〜（41）', [
      Q('（40）{熱|ねつ}があって、{早|はや}く{帰|かえ}りたい', ['1', '2', '3'], 0,
        'Xin phép cho MÌNH ⇒ **{早退|そうたい}させていただけないでしょうか**. 2 nhờ TRƯỞNG PHÒNG về sớm; 3 ～てさしあげる = mình làm cho sếp — vô nghĩa và thất lễ.'),
      Q('（41）{友達|ともだち}が{合格|ごうかく}したと{聞|き}いた', ['1', '2', '3'], 2,
        'Xác nhận tin vừa nghe + chúc mừng ⇒ **{合格|ごうかく}したんだって？ おめでとう！** 1 dùng ～たら — như thể chưa có kết quả; 2 nói chuyện tương lai.'),
    ]),
    NG('b40-d2-ng-42', '（42）〜（44）{最|もっと}もよいへんじをえらんでください', '即時応答 — ① sếp nhờ (～といてくれる？) · ② bạn tiếc thay (～ばよかったのに, Bài 35 ⑥) · ③ nhân viên hỏi (お持ちですか).', [
      [NA, 'ja-nu', '（42）', 'Yonjuuni.', 'Câu 42.'],
      ['{森課長|もりかちょう}', 'ja-nam', 'ワンさん、この{書類|しょるい}、{十部|じゅうぶ}コピーしといてくれる？', 'Wan-san, kono shorui, juubu kopii shitoite kureru?', 'Wan này, photo sẵn mười bản tài liệu này giúp anh nhé?'],
      ['ワン', 'ja-nu', '1、はい、コピーしてもらいます。　2、はい、{十部|じゅうぶ}ですね。すぐにいたします。　3、いいえ、{十部|じゅうぶ}じゃありません。', 'Ichi, hai, kopii shite moraimasu. Ni, hai, juubu desu ne. Sugu ni itashimasu. San, iie, juubu ja arimasen.', '1. Vâng, em sẽ nhờ (ai đó) photo. 2. Vâng, mười bản ạ. Em làm ngay. 3. Không, không phải mười bản.'],
      [NA, 'ja-nu', '（43）', 'Yonjuusan.', 'Câu 43.'],
      ['リン', 'ja-nu', '{昨日|きのう}の{飲|の}み{会|かい}、{来|く}ればよかったのに。すごく{楽|たの}しかったよ。', 'Kinou no nomikai, kureba yokatta noni. Sugoku tanoshikatta yo.', 'Tiệc hôm qua cậu đến thì hay biết mấy. Vui cực luôn.'],
      ['ダニエル', 'ja-nam', '1、{来|き}てよかったね。　2、うん、{行|い}ったよ。　3、ごめん、レポートが{終|お}わらなくて。', 'Ichi, kite yokatta ne. Ni, un, itta yo. San, gomen, repooto ga owaranakute.', '1. May mà đến nhỉ. 2. Ừ, tớ đi rồi mà. 3. Xin lỗi, báo cáo của tớ chưa xong.'],
      [NA, 'ja-nu', '（44）', 'Yonjuuyon.', 'Câu 44.'],
      ['{店員|てんいん}', 'ja-nu', 'ポイントカードはお{持|も}ちですか。', 'Pointo kaado wa omochi desu ka.', 'Quý khách có thẻ tích điểm không ạ?'],
      ['マルコ', 'ja-nam', '1、いえ、{持|も}っていません。　2、はい、お{持|も}ちします。　3、いいえ、お{持|も}ちになりません。', 'Ichi, ie, motte imasen. Ni, hai, omochi shimasu. San, iie, omochi ni narimasen.', '1. Không, tôi không có. 2. Vâng, để tôi mang giúp. 3. Không, (ngài) không có.'],
    ]),
    MCQ('b40-d2-ng-42-q', '（42）〜（44）', [
      Q('（42）「この{書類|しょるい}、{十部|じゅうぶ}コピーしといてくれる？」', ['1', '2', '3'], 1,
        'Sếp nhờ ⇒ nhắc lại để xác nhận + nhận việc khiêm nhường: **{十部|じゅうぶ}ですね。すぐにいたします** (Bài 37). 1 đẩy việc; 3 không khớp.'),
      Q('（43）「{昨日|きのう}の{飲|の}み{会|かい}、{来|く}ればよかったのに。」', ['1', '2', '3'], 2,
        '**～ばよかったのに** = tiếc là cậu đã KHÔNG đến (Bài 35 ⑥) ⇒ giải thích lý do: **ごめん、レポートが{終|お}わらなくて**. 2 mâu thuẫn (đã không đến); 1 bẫy lặp "よかった".'),
      Q('（44）「ポイントカードはお{持|も}ちですか。」', ['1', '2', '3'], 0,
        '**お{持|も}ちですか** = tôn kính "quý khách có… không" ⇒ khách trả lời bình thường **いえ、{持|も}っていません**. 2 お持ちします = khiêm nhường "để tôi mang" — nghĩa khác; 3 dùng tôn kính cho chính mình.'),
    ]),
    NG('b40-d2-ng-45', '（45）〜（47）{最|もっと}もよいへんじをえらんでください', '即時応答 — ④ bạn nhận xét (眠そうだね) · ⑤ cô báo nghỉ (～ようと思うんですが) · ⑥ đồng nghiệp than (～わけないよ, Bài 31).', [
      [NA, 'ja-nu', '（45）', 'Yonjuugo.', 'Câu 45.'],
      ['ダニエル', 'ja-nam', 'マリヤムさん、さっきから{眠|ねむ}そうだね。', 'Mariyamu-san, sakki kara nemusou da ne.', 'Maryam, nãy giờ trông cậu buồn ngủ nhỉ.'],
      ['マリヤム', 'ja-nu', '1、うん、よく{寝|ね}たからね。　2、うん、{昨日|きのう}{徹夜|てつや}しちゃって。　3、{眠|ねむ}ってばかりいるね。', 'Ichi, un, yoku neta kara ne. Ni, un, kinou tetsuya shichatte. San, nemutte bakari iru ne.', '1. Ừ, vì tớ ngủ ngon mà. 2. Ừ, hôm qua tớ lỡ thức trắng đêm. 3. Cậu toàn ngủ thôi nhỉ.'],
      [NA, 'ja-nu', '（46）', 'Yonjuuroku.', 'Câu 46.'],
      ['{佐藤先生|さとうせんせい}', 'ja-nu', 'カルロスさん、{来週|らいしゅう}のゼミは{休講|きゅうこう}にしようと{思|おも}うんですが。', 'Karurosu-san, raishuu no zemi wa kyuukou ni shiyou to omou n desu ga.', 'Carlos, tuần sau cô định cho nghỉ buổi seminar.'],
      ['カルロス', 'ja-nam', '1、はい、{休講|きゅうこう}させていただきます。　2、では、{休講|きゅうこう}してあげましょうか。　3、わかりました。{皆|みな}に{伝|つた}えておきます。', 'Ichi, hai, kyuukou sasete itadakimasu. Ni, dewa, kyuukou shite agemashou ka. San, wakarimashita. Mina ni tsutaete okimasu.', '1. Vâng, em xin phép cho nghỉ. 2. Vậy để em cho cô nghỉ nhé? 3. Em hiểu rồi. Em sẽ báo cho mọi người.'],
      [NA, 'ja-nu', '（47）', 'Yonjuunana.', 'Câu 47.'],
      ['{西川|にしかわ}', 'ja-nam', 'この{仕事|しごと}、{明日|あした}までに{終|お}わるわけないよ。', 'Kono shigoto, ashita made ni owaru wake nai yo.', 'Việc này làm gì có chuyện xong trước mai.'],
      ['{山口|やまぐち}', 'ja-nu', '1、じゃあ、{課長|かちょう}に{相談|そうだん}してみようか。　2、よかった、{終|お}わったね。　3、うん、{明日|あした}までに{終|お}わるはずだね。', 'Ichi, jaa, kachou ni soudan shite miyou ka. Ni, yokatta, owatta ne. San, un, ashita made ni owaru hazu da ne.', '1. Vậy mình thử bàn với trưởng phòng nhé. 2. May quá, xong rồi nhỉ. 3. Ừ, chắc chắn xong trước mai nhỉ.'],
    ]),
    MCQ('b40-d2-ng-45-q', '（45）〜（47）', [
      Q('（45）「さっきから{眠|ねむ}そうだね。」', ['1', '2', '3'], 1,
        'Trông buồn ngủ (様態そう — Bài 20) ⇒ giải thích: **{昨日|きのう}{徹夜|てつや}しちゃって** (～ちゃう — Bài 39 ②). 1 ngược logic; 3 nói như về người khác.'),
      Q('（46）「{来週|らいしゅう}のゼミは{休講|きゅうこう}にしようと{思|おも}うんですが。」', ['1', '2', '3'], 2,
        'Cô báo kế hoạch ⇒ sinh viên nhận và truyền đạt: **わかりました。{皆|みな}に{伝|つた}えておきます**. 1 dùng させていただく như thể mình quyết cho nghỉ; 2 ～てあげる với cô — thất lễ.'),
      Q('（47）「この{仕事|しごと}、{明日|あした}までに{終|お}わるわけないよ。」', ['1', '2', '3'], 0,
        '**～わけない** = làm gì có chuyện (Bài 31 ③) ⇒ việc không kịp ⇒ đề xuất cách giải quyết: **{課長|かちょう}に{相談|そうだん}してみようか**. 3 lặp lại theo nghĩa ngược (はず = chắc chắn xong).'),
    ]),
    {
      t: 'note',
      title: 'Chấm Đề 2',
      items: [
        '文字・語彙 __/17 · 文法 __/11 · 読解 __/6 · 聴解 __/13 ⇒ tổng __/47.',
        'Quy đổi nhanh theo tỉ lệ: **言語知識** = (文字・語彙 + 文法) ÷ 28 × 60 · **読解** = đúng ÷ 6 × 60 · **聴解** = đúng ÷ 13 × 60. Mỗi mục cần ≥ 19 (≈ 32%), tổng ≥ 95 (≈ 53%) — giống luật của Đề 1.',
        'So với Đề 1: mảng nào tăng < 10% ⇒ quay lại đúng bảng ôn của mảng đó trong mục **Ôn ngữ pháp** / **Ôn từ vựng – chữ Hán**, và làm lại Luyện thêm của các Bài được ghi trong phần giải thích câu sai.',
        'Sẵn sàng thi thật khi: Đề 1 ≥ 70% **và** Đề 2 ≥ 70%, không mục nào dưới 50%. Sau N3 là **Bài 41** — bước vào N2.',
      ],
    },
  ],
};

export const BAI_40: Lesson[] = [GIOI_THIEU, DE1_MOJI, DE1_BUNPO, DE1_CHOUKAI, BANG_DIEM, ON_NGU_PHAP, ON_TU_HAN, DE_2];
