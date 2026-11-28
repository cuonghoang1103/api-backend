/**
 * 🔁 Luyện câu 2 chiều + ✍️ Tập viết — BÀI 1–3 (JPD113) · 28/11/2026. Khuôn + DSL: luyenCauDsl.ts.
 *
 * Bám: danh sách "Từ mới bài 1/2/3" của cô (= `bN-tu-vung`), ポイント 1–23, chữ Hán của lớp (hanLop.ts: B1 私人才学生校日本語 ·
 * B2 một → vạn + 円 · B3 月火水木金土日曜何年時間分), câu hỏi thi nói JPD113 trong "Luyện nói" của cô Huyền (Bài 1–3: hỏi
 * nghề, nước, tuổi, sinh nhật, sở thích · tầng, giá, của nước nào · đi đâu, học ở đâu, giờ mở cửa). Mọi câu VIẾT MỚI.
 * Quy ước: CHỈ chữ Hán của lớp đến bài đó mới viết chữ Hán (có furigana) — còn lại kana, đúng như tờ đề.
 *
 * Xuất `LUYEN_CAU[1..3]` (mỗi bài `bN-luyen-cau` + `bN-tap-viet`; Bài 3 thêm `b3-thi-thu-viet-113` — đề luyện viết JPD113).
 */
import type { Block, Lesson } from '@/components/sach-hoc/types';
import { baiLuyen, nhom, E, J, R, type DefBai } from './luyenCauDsl';

/* ══════════════════════════════ BÀI 1 — はじめまして ══════════════════════════════ */

const B1: DefBai = {
  n: 1,
  ten: 'はじめまして — tự giới thiệu: tên, nước, nghề, tuổi, sinh nhật, sở thích',
  mau: [
    ['**N1 は N2 です** (P1)', 'Tôi **là** sinh viên.', 'Tôi **は** sinh viên **です**. — です đứng CUỐI, không có từ riêng cho "là" ở giữa', '{私|わたし}は{学生|がくせい}です。'],
    ['**N1 は N2 ですか** (P2)', 'Anh ấy **có phải** là sinh viên **không**?', 'Anh ấy は sinh viên です **か**. — chỉ thêm か, KHÔNG đảo trật tự', 'パクさんは{学生|がくせい}ですか。'],
    ['**N2 じゃありません** (P2)', 'Tôi **không phải** người Nhật.', 'Tôi は người Nhật **じゃありません**. — "không" nằm ở CUỐI câu', '{私|わたし}は{日本人|にほんじん}じゃありません。'],
    ['**どちら／いつ／何** (P3)', 'Bạn đến từ nước **nào**? / Sinh nhật **khi nào**?', 'Từ để hỏi đứng ĐÚNG CHỖ của câu trả lời: 〜は **どちら** ですか', 'たんじょうびは いつですか。'],
    ['**N1 の N2** (P4)', 'Sinh viên **(của) trường** FPT · Tên **của tôi**', 'NGƯỢC tiếng Việt: trường FPT **の** sinh viên · tôi **の** tên', '{私|わたし}の なまえ'],
    ['**N1 と N2** (P5)', 'Bóng đá **và** bơi lội', 'Giống tiếng Việt, nhưng と CHỈ nối danh từ', 'サッカーと すいえい'],
    ['**N も** (P6)', 'Tôi **cũng** là sinh viên.', 'も THAY CHỖ は (không viết はも): {私|わたし}**も** sinh viên です', '{私|わたし}も{学生|がくせい}です。'],
  ],
  buoc: [
    { label: '① Tìm chủ đề', sub: 'Tôi / Anh Park… ⇒ + は (đọc "wa")' },
    { label: '② Tìm danh từ đứng sau "là"', sub: 'sinh viên, người Nhật, 19 tuổi…' },
    { label: '③ Có "của" thì lật ngược', sub: 'sinh viên trường FPT ⇒ FPTだいがく の {学生|がくせい}' },
    { label: '④ Đuôi câu', sub: 'です (là) · ですか (phải không?) · じゃありません (không phải)' },
  ],
  loi: [
    '~~{私|わたし}は{学生|がくせい}。~~ — thiếu **です**: câu lịch sự luôn kết bằng です (thi nói thiếu です là trừ điểm).',
    '~~{学生|がくせい}の FPTだいがく~~ — dịch xuôi "sinh viên của FPT". Đúng: **FPTだいがく の {学生|がくせい}** (cái lớn đứng trước の).',
    '~~{私|わたし}は マイさん です。~~ — **さん** chỉ gọi NGƯỜI KHÁC, không bao giờ tự gọi mình.',
    '~~{私|わたし}も は ~~ / ~~{私|わたし}はも~~ — も đã thay chỗ は, không đi cùng nhau.',
    'Hỏi nước: **おくには どちらですか** — trả lời bằng TÊN NƯỚC (ベトナムです), hỏi người nước nào mới thêm 〜{人|じん}.',
    '**は** trợ từ đọc là **"wa"**, viết vẫn là は (không viết わ). **何** trước です đọc **なん**.',
    '{日本人|にほんじん}・ベトナム{人|じん} đọc **じん**; một mình "người" là **{人|ひと}** (あの{人|ひと} — Bài 2).',
  ],
  cau: [
    ...nhom('P1 · N1 は N2 です', [
      ['Tôi là Lan.', '{私|わたし} は ^ラン です。'],
      ['Chị Linh là người Việt Nam.', '^リン-さん は ベトナム{人|じん} です。'],
      ['Anh Tanaka là người Nhật.', '^たなか-さん は {日本人|にほんじん} です。'],
      ['Chị Mai là sinh viên.', '^マイ-さん は {学生|がくせい} です。'],
      ['Anh Kim là người Hàn Quốc.', '^キム-さん は かんこく{人|じん} です。'],
      ['Tôi là nhân viên công ty.', '{私|わたし} は かいしゃいん です。', ['かいしゃいん です。']],
      ['Anh Lee là người Trung Quốc.', '^リー-さん は ちゅうごく{人|じん} です。'],
      ['Chị Emma là người Úc.', '^エマ-さん は オーストラリア{人|じん} です。'],
      ['Chị Natasha là người Nga.', '^ナターシャ-さん は ロシア{人|じん} です。'],
      ['Anh Mario là người Ý.', '^マリオ-さん は イタリア{人|じん} です。'],
      ['Rất vui được gặp. Tôi là Minh.', 'はじめまして。 ^ミン です。'],
      ['(Tôi) là Nam. (Tôi) là người Việt Nam.', '^ナム です。 ベトナム{人|じん} です。'],
      ['Tên bạn là gì? — Là Hoa.', 'おなまえ は？ —— ^ホア です。'],
    ]),
    ...nhom('P2 · ですか／はい・いいえ・じゃありません', [
      ['Chị Linh có phải là sinh viên không?', '^リン-さん は {学生|がくせい} です か。'],
      ['Vâng, tôi là người Việt Nam.', 'はい、 ベトナム{人|じん} です。'],
      ['Chị Sato có phải là người Nhật không?', '^さとう-さん は {日本人|にほんじん} です か。'],
      ['Không, tôi không phải là giáo viên.', 'いいえ、 きょうし じゃ ありません。', ['いいえ、 きょうし では ありません。']],
      ['Chị Lan không phải là giáo viên.', '^ラン-さん は せんせい じゃ ありません。', ['^ラン-さん は せんせい では ありません。']],
      ['Tôi không phải là nhân viên công ty.', '{私|わたし} は かいしゃいん じゃ ありません。', ['{私|わたし} は かいしゃいん では ありません。']],
      ['Anh Marco là người Ý phải không? — Vâng, đúng vậy.', '^マルコ-さん は イタリア{人|じん} です か。 —— はい、 そう です。'],
      ['Chị Anna có phải là giáo viên không? — Vâng, đúng vậy.', '^アンナ-さん は せんせい です か。 —— はい、 そう です。'],
      ['Anh Wan có phải là sinh viên trường tiếng Nhật không?', '^ワン-さん は {日本語学校|にほんごがっこう} の {学生|がくせい} です か。'],
      ['Anh Carlos không phải là người Mỹ. Anh ấy là người Brazil.', '^カルロス-さん は アメリカ{人|じん} じゃ ありません。 ブラジル{人|じん} です。', ['^カルロス-さん は アメリカ{人|じん} では ありません。 ブラジル{人|じん} です。']],
      ['Anh Kim có phải là nhân viên công ty không? — Không, anh ấy là giáo viên.', '^キム-さん は かいしゃいん です か。 —— いいえ、 せんせい です。'],
    ]),
    ...nhom('P3 · どちら／いつ／何（なん）', [
      ['Bạn bao nhiêu tuổi? — Tôi 19 tuổi.', 'なんさい です か。 —— {19|じゅうきゅう}{才|さい} です。'],
      ['Chị Hoa 20 tuổi.', '^ホア-さん は はたち です。'],
      ['Anh Daniel bao nhiêu tuổi?', '^ダニエル-さん は なんさい です か。'],
      ['Anh Wan bao nhiêu tuổi? — 26 tuổi.', '^ワン-さん は なんさい です か。 —— {26|にじゅうろく}{才|さい} です。'],
      ['Nghề của bạn là gì? — Tôi là sinh viên.', 'おしごと は？ —— {学生|がくせい} です。'],
      ['Sở thích của anh Kimura là gì?', '^きむら-さん の しゅみ は なん です か。'],
      ['Sinh nhật của bạn là khi nào?', 'おたんじょうび は いつ です か。', ['たんじょうび は いつ です か。']],
      ['Sinh nhật là khi nào? — Ngày 14 tháng 2.', 'たんじょうび は いつ です か。 —— {2|に}がつ {14日|じゅうよっか} です。'],
      ['Sinh nhật của tôi là ngày 20 tháng 5.', '{私|わたし} の たんじょうび は {5|ご}がつ {20日|はつか} です。'],
      ['Sinh nhật của anh Marco là ngày 3 tháng 7.', '^マルコ-さん の たんじょうび は {7|しち}がつ {3日|みっか} です。'],
      ['Sinh nhật của chị Wan là khi nào? — Ngày 1 tháng 1.', '^ワン-さん の たんじょうび は いつ です か。 —— {1|いち}がつ {1日|ついたち} です。'],
      ['Chị Anna đến từ nước nào? — Nước Mỹ.', '^アンナ-さん の おくに は どちら です か。 —— アメリカ です。'],
      ['Anh Natapon đến từ nước nào? — Thái Lan.', '^ナタポン-さん の おくに は どちら です か。 —— タイ です。'],
    ]),
    ...nhom('P4 · N1 の N2', [
      ['Tên tôi là Hùng.', '{私|わたし} の なまえ は ^フン です。'],
      ['Tôi là sinh viên Đại học FPT.', '{私|わたし} は FPT だいがく の {学生|がくせい} です。'],
      ['Chị Yamada là giáo viên tiếng Nhật.', '^やまだ-さん は {日本語|にほんご} の せんせい です。'],
      ['Anh Carlos là nhân viên công ty ABC.', '^カルロス-さん は ABC の しゃいん です。'],
      ['Tôi là nhân viên của Toyota.', '{私|わたし} は トヨタ の しゃいん です。'],
      ['Sở thích của chị Anna là đọc sách.', '^アンナ-さん の しゅみ は どくしょ です。'],
      ['Anh Hùng là sinh viên Đại học Hà Nội.', '^フン-さん は ハノイ だいがく の {学生|がくせい} です。'],
      ['Tôi là giáo viên trường cấp 3 Sakura.', '{私|わたし} は さくら こうこう の きょうし です。'],
      ['Anh Lâm là sinh viên trường tiếng Nhật Aozora.', '^ラム-さん は あおぞら {日本語学校|にほんごがっこう} の {学生|がくせい} です。'],
    ]),
    ...nhom('P5 · N1 と N2', [
      ['Sở thích của tôi là âm nhạc và du lịch.', '{私|わたし} の しゅみ は おんがく と りょこう です。'],
      ['Sở thích của anh Tanaka là tennis và bơi lội.', '^たなか-さん の しゅみ は テニス と すいえい です。'],
      ['Sở thích của chị Mai là xem phim và nấu ăn.', '^マイ-さん の しゅみ は えいが と りょうり です。'],
      ['Anh Marco và anh Wan là sinh viên.', '^マルコ-さん と ^ワン-さん は {学生|がくせい} です。'],
      ['Anh Kim và chị Park là người Hàn Quốc.', '^キム-さん と ^パク-さん は かんこく{人|じん} です。'],
      ['Sở thích của tôi là nấu ăn, đọc sách và xem phim.', '{私|わたし} の しゅみ は りょうり と どくしょ と えいが です。'],
      ['Sở thích của chị là thể thao và âm nhạc phải không?', '^リン-さん の しゅみ は スポーツ と おんがく です か。'],
    ]),
    ...nhom('P6 · N も', [
      ['Anh Lee cũng là người Trung Quốc.', '^リー-さん も ちゅうごく{人|じん} です。'],
      ['Sở thích của tôi cũng là bóng đá.', '{私|わたし} の しゅみ も サッカー です。'],
      ['Chị Anna là giáo viên. Chị Maryam cũng là giáo viên.', '^アンナ-さん は せんせい です。 ^マリヤム-さん も せんせい です。'],
      ['Anh Park cũng là sinh viên phải không? — Vâng, anh ấy cũng là sinh viên.', '^パク-さん も {学生|がくせい} です か。 —— はい、 ^パク-さん も {学生|がくせい} です。'],
      ['Tôi không phải là người Nhật. Anh Carlos cũng không phải là người Nhật.', '{私|わたし} は {日本人|にほんじん} じゃ ありません。 ^カルロス-さん も {日本人|にほんじん} じゃ ありません。', ['{私|わたし} は {日本人|にほんじん} では ありません。 ^カルロス-さん も {日本人|にほんじん} では ありません。']],
      ['Sinh nhật của tôi cũng là ngày 10 tháng 10. Giống nhau nhỉ!', '{私|わたし} の たんじょうび も {10|じゅう}がつ {10日|とおか} です。 おなじ です ね。'],
    ]),
    ...nhom('Chào hỏi · đáp lời', [
      ['A, xin lỗi… Anh có phải là anh Marco không?', 'あのう、 すみません。 ^マルコ-さん です か。'],
      ['Thế à. Anh là người Ý à?', 'そう です か。 イタリア{人|じん} です か。'],
      ['Xin chào. Tôi là Lan, sinh viên Đại học FPT.', 'こんにちは。 FPT だいがく の {学生|がくせい} の ^ラン です。'],
      ['Mong được giúp đỡ. — Tôi cũng vậy, mong được giúp đỡ.', 'どうぞ よろしく。 —— こちらこそ、 どうぞ よろしく。'],
    ]),
    ...nhom('Thi nói · hỏi – đáp không tranh', [
      ['— Bạn là sinh viên phải không? — Vâng. Tôi là sinh viên Đại học FPT.', '{学生|がくせい} です か。 —— はい、 FPT だいがく の {学生|がくせい} です。'],
      ['— Bạn có phải nhân viên công ty không? — Không, tôi là sinh viên.', 'かいしゃいん です か。 —— いいえ、 かいしゃいん じゃ ありません。 {学生|がくせい} です。', ['かいしゃいん です か。 —— いいえ、 かいしゃいん では ありません。 {学生|がくせい} です。']],
      ['— Bạn là người Việt Nam phải không? — Vâng, tôi là người Việt Nam.', 'ベトナム{人|じん} です か。 —— はい、 ベトナム{人|じん} です。'],
      ['— Bạn có phải người Nhật không? — Không, tôi là người Việt Nam.', '{日本人|にほんじん} です か。 —— いいえ、 ベトナム{人|じん} です。'],
      ['— Sở thích của bạn là bóng đá và bơi lội phải không? — Không, là đọc sách.', 'しゅみ は サッカー と すいえい です か。 —— いいえ、 どくしょ です。'],
    ]),
    ...nhom('Tả tranh · tự giới thiệu (câu dài)', [
      ['Anh Suzuki là người Nhật. Anh ấy 30 tuổi. Anh ấy là nhân viên công ty.', '^すずき-さん は {日本人|にほんじん} です。 {30|さんじゅっ}{才|さい} です。 かいしゃいん です。'],
      ['Sinh nhật của anh Suzuki là ngày 20 tháng 10. Sở thích là bơi lội và du lịch.', '^すずき-さん の たんじょうび は {10|じゅう}がつ {20日|はつか} です。 しゅみ は すいえい と りょこう です。'],
      ['Anh Carlos là người Brazil. Anh ấy 41 tuổi. Anh ấy là giáo viên.', '^カルロス-さん は ブラジル{人|じん} です。 {41|よんじゅういっ}{才|さい} です。 せんせい です。'],
      ['Sở thích của anh Carlos là thể thao và nấu ăn.', '^カルロス-さん の しゅみ は スポーツ と りょうり です。'],
      ['Tôi là sinh viên Đại học FPT. Tôi 20 tuổi.', '{私|わたし} は FPT だいがく の {学生|がくせい} です。 はたち です。'],
      ['Sở thích của tôi là bóng đá và âm nhạc. Sinh nhật của tôi là ngày 2 tháng 9.', '{私|わたし} の しゅみ は サッカー と おんがく です。 たんじょうび は {9|く}がつ {2日|ふつか} です。'],
      ['Rất vui được gặp. Tôi là Nam, người Việt Nam. Rất mong được giúp đỡ.', 'はじめまして。 ^ナム です。 ベトナム{人|じん} です。 どうぞ よろしく おねがいします。'],
    ]),
  ],
  vietTu: {
    私: 'わたし · tôi', 人: 'ひと · người', 日本: 'にほん · Nhật Bản', 日本人: 'にほんじん · người Nhật', 日本語: 'にほんご · tiếng Nhật',
    学生: 'がくせい · sinh viên', 学校: 'がっこう · trường học', 日本語学校: 'にほんごがっこう · trường tiếng Nhật', 才: 'さい · tuổi (viết thay 歳)',
    本: 'ほん · sách; gốc', 生: 'せい · sinh; sống',
  },
  chep: [
    ['はじめまして。 {私|わたし} は ^ラン です。', 'Rất vui được gặp. Tôi là Lan.'],
    ['{私|わたし} は ベトナム{人|じん} です。', 'Tôi là người Việt Nam.'],
    ['FPT だいがく の {学生|がくせい} です。', 'Tôi là sinh viên Đại học FPT.'],
    ['{19|じゅうきゅう}{才|さい} です。', 'Tôi 19 tuổi.'],
    ['しゅみ は おんがく と りょこう です。', 'Sở thích là âm nhạc và du lịch.'],
    ['^たなか-さん は {日本人|にほんじん} じゃ ありません。', 'Anh Tanaka không phải người Nhật.'],
    ['{私|わたし} も {学生|がくせい} です。', 'Tôi cũng là sinh viên.'],
    ['どうぞ よろしく おねがいします。', 'Rất mong được giúp đỡ.'],
  ],
  doan: {
    de: '**Viết đoạn tự giới thiệu 5 câu** (đúng khuôn Reading + câu hỏi thi nói JPD113): chào → tên → nước → trường / nghề → tuổi + sinh nhật → sở thích → câu kết.',
    goiY: ['はじめまして。〜です。', '〜{人|じん}です。', '〜だいがく の {学生|がくせい}です。', '〜{才|さい}です。たんじょうびは 〜がつ 〜{日|にち}です。', 'しゅみは 〜と 〜です。どうぞ よろしく おねがいします。'],
    mau: [
      ['はじめまして。 ^ミン です。', 'Rất vui được gặp. Tôi là Minh.'],
      ['ベトナム{人|じん} です。 FPT だいがく の {学生|がくせい} です。', 'Tôi là người Việt Nam. Tôi là sinh viên Đại học FPT.'],
      ['{19|じゅうきゅう}{才|さい} です。 たんじょうび は {6|ろく}がつ {8日|ようか} です。', 'Tôi 19 tuổi. Sinh nhật là ngày 8 tháng 6.'],
      ['しゅみ は サッカー と えいが です。', 'Sở thích là bóng đá và phim.'],
      ['どうぞ よろしく おねがいします。', 'Rất mong được giúp đỡ.'],
    ],
  },
  lien: [
    { id: 'b1-noi', label: '🎤 Luyện nói Bài 1 (dạng thi)', vi: 'câu hỏi giám thị + trả lời mẫu + ghi âm' },
    { id: 'b1-doc-to', label: '🎙️ Đọc to kiểu đề Bài 1', vi: 'đoạn Reading 40 điểm, máy chấm phát âm' },
    { id: 'lt-b1-noi-viet', label: '🗣️ Luyện thêm: Nói & viết Bài 1', vi: 'thẻ nhân vật có tranh, bài viết' },
    { id: 'lt-b1-de-tong-hop', label: '📝 Đề tổng hợp Bài 1 (45 phút)', vi: 'từ vựng · chữ Hán · ngữ pháp · nghe · đọc' },
    { id: 'on113-cau-truc', label: '🧭 Ôn thi JPD113 — cấu trúc đề', vi: 'thi nói gồm gì, cách tính điểm' },
  ],
  thiGhi: [
    'Thi nói JPD113: **Reading** (đọc to một đoạn tự giới thiệu — mỗi câu ở trên là một câu kiểu đề) + **Talking** 3 câu có tranh + 1 câu không tranh. Nhóm "Thi nói" và "Tả tranh" ở bộ câu trên đúng dạng hỏi của cô.',
    'Trả lời **trọn câu** (はい、FPTだいがくの{学生|がくせい}です), đừng chỉ "はい".',
  ],
};

/* ══════════════════════════════ BÀI 2 — 買い物・食事 ══════════════════════════════ */

const B2: DefBai = {
  n: 2,
  ten: 'どこですか・いくらですか — chỉ chỗ, chỉ đồ, hỏi giá, mua đồ, gọi món',
  mau: [
    ['**これ／それ／あれ は N です** (P7)', '**Cái này** là ví.', 'Giống tiếng Việt về chỗ đứng; これ gần tôi · それ gần bạn · あれ xa cả hai', 'それは さいふです。'],
    ['**この／その／あの N** (P8)', 'Cái đồng hồ **này**', '"này/đó/kia" đứng **TRƯỚC** danh từ (ngược tiếng Việt): **この** とけい', 'この とけいは いくらですか。'],
    ['**N は どこですか** (P9)', 'Thang máy **ở đâu**?', 'Nơi chốn + は + **どこ** ですか — không có động từ "ở"', 'エレベーターは どこですか。'],
    ['**N を（〜つ）ください** (P10)', 'Cho tôi **hai** quả táo.', 'Vật + **を** + SỐ LƯỢNG + ください — số đứng SAU を, ngay trước ください', 'リンゴを ふたつ ください。'],
    ['**いくらですか** (P11)', 'Cái này **bao nhiêu tiền**?', 'これは **いくら** ですか — trả lời: số + {円|えん}', 'これは {三百|さんびゃく}{円|えん}です。'],
    ['**何の N / どこの N** (P12–13)', 'Sách **(về) gì** / Máy ảnh **của nước nào**', 'Từ hỏi + **の** + danh từ: **なんの** {本|ほん} · **どこの** カメラ', 'これは どこの カメラですか。'],
    ['**だれの N** (P14)', 'Cặp **của ai**?', '**だれの** かばん — trả lời: マルコさん**の**です (bỏ danh từ đã biết)', 'これは だれの かばんですか。'],
    ['**N（〜語）で 何ですか** (P15)', '"Pen" **tiếng Nhật** là gì?', '「pen」は {日本語|にほんご}**で** なんですか — で = "bằng (thứ tiếng)"', '「watch」は {日本語|にほんご}で なんですか。'],
  ],
  buoc: [
    { label: '① Đồ vật / nơi chốn là chủ đề', sub: 'これ・この とけい・トイレ… + は' },
    { label: '② "này / đó / kia" đi với danh từ?', sub: 'có danh từ ⇒ この／その／あの + N · không có ⇒ これ／それ／あれ' },
    { label: '③ Hỏi gì?', sub: 'ở đâu ⇒ どこ · bao nhiêu tiền ⇒ いくら · của ai ⇒ だれの · của nước nào ⇒ どこの' },
    { label: '④ Mua: vật を số lượng ください', sub: 'コーヒーを ひとつ ください。' },
  ],
  loi: [
    '~~この は とけい です~~ / ~~これ とけい~~ — **この** luôn có danh từ đi SAU (この とけい); **これ** đứng một mình (これは とけいです).',
    '~~ふたつ リンゴ を ください~~ — số lượng đứng **sau を**: リンゴを **ふたつ** ください.',
    '~~とけい は どこ の です か~~ khi hỏi nước sản xuất thì hay nói **どこの とけいですか**; trả lời {日本|にほん}の です (bỏ danh từ lặp lại).',
    'Hỏi tầng: **なんがい** (không phải なんかい); 3 tầng **さんがい**, 1 tầng **いっかい**, 6 **ろっかい**, 8 **はっかい**.',
    'Đọc giá: 300 **さんびゃく**, 600 **ろっぴゃく**, 800 **はっぴゃく**, 3000 **さんぜん**, 8000 **はっせん**, 1 vạn **いちまん** (không nói じゅうせん).',
    '**ください** là xin MÓN ĐỒ; chữ "xin mời" khi đưa đồ là **どうぞ**.',
  ],
  cau: [
    ...nhom('P7 · これ／それ／あれ', [
      ['Cái này là cục tẩy.', 'これ は けしゴム です。'],
      ['Cái đó là ví tiền của tôi.', 'それ は {私|わたし} の さいふ です。'],
      ['Cái kia là đồng hồ phải không?', 'あれ は とけい です か。'],
      ['Cái này là gì? — Là kim từ điển.', 'これ は なん です か。 —— でんしじしょ です。'],
      ['Cái đó là gì? — Là bánh ngọt.', 'それ は なん です か。 —— ケーキ です。'],
      ['Cái kia không phải là máy ảnh. Là máy tính.', 'あれ は カメラ じゃ ありません。 パソコン です。', ['あれ は カメラ では ありません。 パソコン です。']],
    ]),
    ...nhom('P8 · この／その／あの N', [
      ['Cho tôi cái máy ảnh này.', 'この カメラ を ください。'],
      ['Người kia là ai? — Là chị Anna.', 'あの {人|ひと} は だれ です か。 —— ^アンナ-さん です。'],
      ['Cái quần kia giá 5.000 yên.', 'あの ズボン は {五千|ごせん}{円|えん} です。'],
      ['Quyển sách này là sách tiếng Nhật.', 'この {本|ほん} は {日本語|にほんご} の {本|ほん} です。'],
      ['Cái điện thoại này là của tôi.', 'この けいたいでんわ は {私|わたし} の です。'],
      ['Cái đồng hồ đó bao nhiêu tiền?', 'その とけい は いくら です か。'],
    ]),
    ...nhom('P9 · ここ／そこ／あそこ／どこ・〜階', [
      ['Xin lỗi, thang máy ở đâu ạ?', 'あのう、 エレベーター は どこ です か。'],
      ['Quầy thông tin ở chỗ này.', 'インフォメーション は ここ です。'],
      ['Quầy thu ngân ở chỗ đó (gần anh).', 'レジ は そこ です。'],
      ['Nơi hút thuốc ở đằng kia.', 'きつえんじょ は あそこ です。'],
      ['Đây là trường tiếng Nhật Sakura.', 'ここ は さくら {日本語学校|にほんごがっこう} です。'],
      ['Quầy thu ngân ở phía này ạ. (lịch sự)', 'レジ は こちら です。'],
      ['Siêu thị ở tầng hầm.', 'スーパー は ちか です。'],
      ['Quán cà phê ở tầng 9.', 'きっさてん は {9階|きゅうかい} です。'],
      ['Cửa hàng 100 yên ở tầng 3.', '{百|ひゃく}{円|えん}ショップ は {3階|さんがい} です。'],
      ['Xin lỗi, máy ATM ở đâu ạ?', 'すみません、 ATM は どこ です か。'],
      ['Thang cuốn ở đâu? — Ở đằng kia.', 'エスカレーター は どこ です か。 —— あそこ です。'],
      ['Hiệu sách ở tầng mấy? — Ở tầng 5.', '{本|ほん}や は なんがい です か。 —— {5階|ごかい} です。'],
      ['Hiệu giày ở tầng 2 phải không? — Không, ở tầng 4.', 'くつや は {2階|にかい} です か。 —— いいえ、 {4階|よんかい} です。'],
      ['Nhà hàng ở tầng 8 ạ. — Cảm ơn.', 'レストラン は {8階|はっかい} です。 —— ありがとうございます。', ['レストラン は {8階|はちかい} です。 —— ありがとうございます。']],
      ['— Thư viện Đại học FPT ở tầng mấy? — Ở tầng 2.', 'FPT だいがく の としょかん は なんがい です か。 —— {二階|にかい} です。'],
    ]),
    ...nhom('P10 · N を（〜つ）ください', [
      ['Cho tôi hai quả táo.', 'リンゴ を ふたつ ください。'],
      ['Cho tôi ba quả trứng.', 'たまご を みっつ ください。'],
      ['Cho tôi cái ví này.', 'この さいふ を ください。'],
      ['Vậy thì, cho tôi một cái kia.', 'じゃ、 あれ を ひとつ ください。'],
      ['Cho tôi bốn cái bánh ngọt này.', 'この ケーキ を よっつ ください。'],
      ['Cho tôi hamburg steak và cơm.', 'ハンバーグ と ライス を ください。'],
      ['Cho tôi một cái này và hai cái kia.', 'これ を ひとつ と あれ を ふたつ ください。'],
      ['Cho tôi gọi món. — Vâng, xin mời.', 'ちゅうもん を おねがいします。 —— はい、 どうぞ。'],
      ['Cho tôi trà đen. À không, cho tôi trà xanh.', 'こうちゃ を ください。 あ、 いいえ、 おちゃ を ください。'],
    ]),
    ...nhom('P11 · いくらですか・〜円', [
      ['Cái này bao nhiêu tiền? — 300 yên.', 'これ は いくら です か。 —— {三百|さんびゃく}{円|えん} です。'],
      ['Cà phê giá 450 yên.', 'コーヒー は {四百五十|よんひゃくごじゅう}{円|えん} です。'],
      ['Cái đồng hồ đó giá 8.000 yên.', 'その とけい は {八千|はっせん}{円|えん} です。'],
      ['Đôi giày giá 12.000 yên.', 'くつ は {一万二千|いちまんにせん}{円|えん} です。'],
      ['Bánh mì bao nhiêu tiền? — 180 yên.', 'パン は いくら です か。 —— {百八十|ひゃくはちじゅう}{円|えん} です。'],
      ['Con cá này bao nhiêu tiền? — 700 yên.', 'この さかな は いくら です か。 —— {七百|ななひゃく}{円|えん} です。'],
      ['Cái máy ảnh kia bao nhiêu? — 28.000 yên.', 'あの カメラ は いくら です か。 —— {二万八千|にまんはっせん}{円|えん} です。'],
      ['Cà ri 600 yên. Súp 300 yên.', 'カレー は {六百|ろっぴゃく}{円|えん} です。 スープ は {三百|さんびゃく}{円|えん} です。'],
      ['Vậy thì, cho tôi cái đồng hồ 9.000 yên.', 'じゃ、 {九千|きゅうせん}{円|えん} の とけい を ください。'],
    ]),
    ...nhom('P12 · なんの N', [
      ['Đây là sách gì? — Sách tiếng Anh.', 'これ は なん の {本|ほん} です か。 —— えいご の {本|ほん} です。'],
      ['Đó là thịt gì? — Thịt gà.', 'それ は なん の にく です か。 —— とりにく です。'],
      ['Đó là bánh gì? — Bánh dâu tây.', 'それ は なん の ケーキ です か。 —— イチゴ の ケーキ です。'],
      ['Đây là nước ép gì? — Nước ép táo.', 'これ は なん の ジュース です か。 —— リンゴ の ジュース です。'],
    ]),
    ...nhom('P13 · どこの N', [
      ['Đây là rượu vang của Đức.', 'これ は ドイツ の ワイン です。'],
      ['Cái bánh này là của Pháp.', 'この ケーキ は フランス の です。'],
      ['Đây là gạo của Việt Nam.', 'これ は ベトナム の こめ です。'],
      ['Món cà ri này là cà ri Ấn Độ.', 'この カレー は インド の カレー です。'],
      ['Đây là máy ảnh của nước nào? — Máy ảnh Nhật.', 'これ は どこ の カメラ です か。 —— {日本|にほん} の カメラ です。'],
      ['Cái đồng hồ đó của nước nào? — Của Ý.', 'その とけい は どこ の です か。 —— イタリア の です。'],
    ]),
    ...nhom('P14 · だれの N', [
      ['Cái ví đó là của tôi.', 'その さいふ は {私|わたし} の です。'],
      ['Cái bút này không phải của tôi.', 'この ペン は {私|わたし} の じゃ ありません。', ['この ペン は {私|わたし} の では ありません。']],
      ['Cái điện thoại kia là của ai?', 'あの けいたいでんわ は だれ の です か。'],
      ['Đây là cặp của ai? — Của anh Marco.', 'これ は だれ の かばん です か。 —— ^マルコ-さん の です。'],
    ]),
    ...nhom('P15 · 〜語で なんですか', [
      ['"Tokei" tiếng Anh là gì?', '「とけい」 は えいご で なん です か。'],
      ['"Kaban" tiếng Anh là "bag".', '「かばん」 は えいご で 「bag」 です。'],
      ['"Watch" tiếng Nhật là gì? — Là "tokei".', '「watch」 は {日本語|にほんご} で なん です か。 —— 「とけい」 です。'],
      ['"Eraser" tiếng Nhật là gì? — Là "keshigomu".', '「eraser」 は {日本語|にほんご} で なん です か。 —— 「けしゴム」 です。'],
    ]),
    ...nhom('Mua đồ · tả tranh (câu dài)', [
      ['Kính chào quý khách. — Xin lỗi, áo phông ở đâu ạ?', 'いらっしゃいませ。 —— すみません、 Tシャツ は どこ です か。'],
      ['Cái áo phông này bao nhiêu? — 1.500 yên. — Vậy cho tôi hai cái.', 'この Tシャツ は いくら です か。 —— {千五百|せんごひゃく}{円|えん} です。 —— じゃ、 ふたつ ください。'],
      ['Đây là đồng hồ của Pháp. Giá 2.800 yên.', 'これ は フランス の とけい です。 {二千八百|にせんはっぴゃく}{円|えん} です。'],
      ['Siêu thị ở tầng hầm. Giấy vệ sinh cũng ở tầng hầm.', 'スーパー は ちか です。 トイレットペーパー も ちか です。'],
      ['Hiệu sách ở tầng 6. Sách tiếng Nhật giá 2.000 yên.', '{本|ほん}や は {6階|ろっかい} です。 {日本語|にほんご} の {本|ほん} は {二千|にせん}{円|えん} です。'],
    ]),
  ],
  vietTu: {
    一: 'いち · một', 二: 'に · hai', 三: 'さん · ba', 四: 'よん · bốn', 五: 'ご · năm', 六: 'ろく · sáu', 七: 'なな · bảy', 八: 'はち · tám', 九: 'きゅう · chín', 十: 'じゅう · mười',
    三百円: 'さんびゃくえん · 300 yên', 六百円: 'ろっぴゃくえん · 600 yên', 八千円: 'はっせんえん · 8000 yên', 一万円: 'いちまんえん · 1 vạn yên', 千五百円: 'せんごひゃくえん · 1500 yên',
  },
  chep: [
    ['これ は なん です か。', 'Cái này là cái gì?'],
    ['この とけい は いくら です か。', 'Cái đồng hồ này bao nhiêu tiền?'],
    ['{三千五百|さんぜんごひゃく}{円|えん} です。', '3.500 yên.'],
    ['トイレ は どこ です か。', 'Nhà vệ sinh ở đâu?'],
    ['リンゴ を ふたつ ください。', 'Cho tôi hai quả táo.'],
    ['これ は {日本|にほん} の カメラ です。', 'Đây là máy ảnh Nhật.'],
    ['それ は だれ の かばん です か。', 'Đó là cặp của ai?'],
    ['{本|ほん}や は {3階|さんがい} です。', 'Hiệu sách ở tầng 3.'],
  ],
  doan: {
    de: '**Viết đoạn 4–5 câu: "Ở trung tâm mua sắm"** — chỗ nào ở tầng mấy, bạn mua gì, của nước nào, bao nhiêu tiền.',
    goiY: ['〜は 〜{階|かい}です。', 'これは 〜の 〜です。', '〜は {三千|さんぜん}{円|えん}です。', '〜を ふたつ ください。'],
    mau: [
      ['ここ は デパート です。 {本|ほん}や は {5階|ごかい} です。', 'Đây là trung tâm thương mại. Hiệu sách ở tầng 5.'],
      ['カメラ は {3階|さんがい} です。', 'Máy ảnh ở tầng 3.'],
      ['この カメラ は {日本|にほん} の です。 {三万|さんまん}{円|えん} です。', 'Máy ảnh này là của Nhật. Giá 30.000 yên.'],
      ['あの カメラ は かんこく の です。 {二万|にまん}{円|えん} です。', 'Máy ảnh kia là của Hàn Quốc. Giá 20.000 yên.'],
      ['じゃ、 この カメラ を ください。', 'Vậy cho tôi cái máy ảnh này.'],
    ],
  },
  lien: [
    { id: 'b2-noi', label: '🎤 Luyện nói Bài 2 (dạng thi)', vi: 'tầng mấy, bao nhiêu tiền, của nước nào' },
    { id: 'b2-doc-to', label: '🎙️ Đọc to kiểu đề Bài 2', vi: 'đoạn Reading có số, giá tiền' },
    { id: 'lt-b2-noi-viet', label: '🗣️ Luyện thêm: Nói & viết Bài 2', vi: 'thẻ nhân vật có nước và giá' },
    { id: 'lt-b2-de-tong-hop', label: '📝 Đề tổng hợp Bài 2 (45 phút)' },
  ],
  thiGhi: ['Câu hỏi có tranh Bài 2 của cô: スーパーは どこですか · 百円ショップは 三階ですか · くつやは 何階ですか · これは どこの 〜ですか · いくらですか — nhóm P9, P11, P13 ở trên luyện đúng các câu này.'],
};

/* ══════════════════════════════ BÀI 3 — スケジュール ══════════════════════════════ */

const B3: DefBai = {
  n: 3,
  ten: 'スケジュール — giờ, thứ, ngày; một ngày của tôi; đi đâu, làm gì, ở đâu',
  mau: [
    ['**V ます／V ません** (P16)', 'Tôi **ăn** / **không ăn**.', 'Động từ ĐỨNG CUỐI câu: たべ**ます** / たべ**ません**', 'まいにち べんきょうします。'],
    ['**N へ いきます** (P17)', 'Tôi **đi** đến ngân hàng.', 'Nơi đến + **へ** (đọc "e") + いきます／きます／かえります', 'ぎんこう へ いきます。'],
    ['**N を V** (P18)', 'Tôi ăn **sushi**.', 'Tôi は sushi **を** ăn — tân ngữ + を đứng TRƯỚC động từ (S-O-V)', 'すしを たべます。'],
    ['**[giờ] に V** (P19)', 'Tôi dậy **lúc 6 giờ**.', '6時 **に** おきます — giờ, thứ, ngày tháng + に; まいにち・あさ・いま KHÔNG thêm に', '{6|ろく}{時|じ}に おきます。'],
    ['**[nơi] で V** (P20)', 'Tôi học **ở thư viện**.', 'Nơi xảy ra hành động + **で** (khác へ = hướng đi tới)', 'としょかんで べんきょうします。'],
    ['**N から N まで** (P21)', '**Từ** 9 giờ **đến** 5 giờ', 'Giống tiếng Việt: 9時**から** 5時**まで**', 'ぎんこうは {9|く}{時|じ}から {3|さん}{時|じ}までです。'],
    ['**N1 や N2 など** (P22)', 'rau, thịt **v.v.**', 'Liệt kê VÀI thứ tiêu biểu (khác と = kể đủ)', 'やさいや にくなどを かいます。'],
    ['**何も／どこへも V ません** (P23)', '**Không** ăn **gì cả** / **không** đi **đâu cả**', 'Từ hỏi + も + động từ PHỦ ĐỊNH', '{何|なに}も たべません。'],
  ],
  buoc: [
    { label: '① Thời gian lên đầu', sub: 'まいあさ / {7|しち}{時|じ}に / {日曜日|にちようび}は…' },
    { label: '② Nơi chốn + trợ từ', sub: 'đi tới ⇒ へ · làm ở ⇒ で' },
    { label: '③ Cái gì + を', sub: 'パンを・テレビを・テニスを' },
    { label: '④ Động từ ます ở CUỐI', sub: 'たべます / たべません / たべますか' },
  ],
  loi: [
    '~~たべます パン を~~ — dịch theo thứ tự tiếng Việt. Động từ luôn ở **cuối**: パンを たべます.',
    '~~としょかん に べんきょうします~~ — làm việc Ở đâu dùng **で**: としょかん**で** べんきょうします (に/へ chỉ nơi ĐI TỚI).',
    '~~まいにち に~~ / ~~いま に~~ — まいにち・まいあさ・いま・あさ không đi với に; **giờ, thứ, ngày tháng** mới có に.',
    'Đọc giờ: **4時 よじ · 7時 しちじ · 9時 くじ**; phút: 1・3・4・6・8・10 phút đọc **ぷん** (いっぷん, さんぷん, じゅっぷん…).',
    '~~{何|なに}も たべます~~ — 何も / どこへも luôn đi với động từ **phủ định** ません.',
    'Trợ từ **へ** đọc là **"e"**, **を** đọc là **"o"** — nhưng viết đúng chữ へ, を.',
  ],
  cau: [
    ...nhom('Giờ · thứ · ngày', [
      ['Bây giờ là 4 giờ 45.', 'いま {4|よ}{時|じ} {45|よんじゅうご}{分|ふん} です。'],
      ['Bây giờ là mấy giờ? — 2 giờ 10 phút chiều.', 'いま {何時|なんじ} です か。 —— ごご {2|に}{時|じ} {10|じゅっ}{分|ぷん} です。'],
      ['Bài kiểm tra vào thứ mấy? — Thứ năm.', 'テスト は {何曜日|なんようび} です か。 —— {木曜日|もくようび} です。'],
      ['Kỳ nghỉ của trường bắt đầu từ ngày mấy tháng mấy?', '{学校|がっこう} の やすみ は {何月|なんがつ}{何日|なんにち} から です か。'],
      ['Ngày nghỉ là thứ mấy? — Thứ tư.', 'やすみ は {何曜日|なんようび} です か。 —— {水曜日|すいようび} です。'],
      ['Ngân hàng nghỉ thứ bảy và chủ nhật.', 'ぎんこう の やすみ は {土曜日|どようび} と {日曜日|にちようび} です。'],
    ]),
    ...nhom('P16 · Vます／Vません', [
      ['Tôi không làm thêm.', 'アルバイト を しません。'],
      ['Mỗi tối tôi lên mạng.', 'まいばん インターネット を します。'],
      ['Tôi uống cà phê. Tôi không uống trà.', 'コーヒー を のみます。 おちゃ を のみません。'],
      ['Bạn có xem tivi không? — Không, tôi không xem.', 'テレビ を みます か。 —— いいえ、 みません。'],
      ['Mỗi sáng bạn có ăn sáng không? — Có, tôi ăn.', 'まいあさ あさごはん を たべます か。 —— はい、 たべます。'],
      ['Chị Wan có đọc báo không? — Không, chị ấy không đọc.', '^ワン-さん は しんぶん を よみます か。 —— いいえ、 よみません。'],
      ['Anh Tanaka làm việc ở công ty. Anh ấy không làm thêm.', '^たなか-さん は かいしゃ で はたらきます。 アルバイト は しません。'],
    ]),
    ...nhom('P17 · へ いきます／きます／かえります', [
      ['Tôi đi ngân hàng.', 'ぎんこう へ いきます。'],
      ['Anh Park đi đến bưu điện.', '^パク-さん は ゆうびんきょく へ いきます。'],
      ['Bạn đi đâu? — Tôi đi công viên.', 'どこ へ いきます か。 —— こうえん へ いきます。'],
      ['Thứ bảy tôi đi biển.', '{土曜日|どようび} に うみ へ いきます。'],
      ['Anh Tanaka đến Việt Nam vào tháng 4.', '^たなか-さん は {4月|しがつ} に ベトナム へ きます。'],
      ['Tôi về nhà lúc 9 giờ tối.', 'よる {9|く}{時|じ} に うち へ かえります。'],
      ['Kỳ nghỉ hè bạn có về nước không? — Có, tôi về Việt Nam.', 'なつやすみ、 くに へ かえります か。 —— はい、 ベトナム へ かえります。'],
    ]),
    ...nhom('P18 · N を V', [
      ['Tôi ăn sushi.', 'すし を たべます。'],
      ['Tôi xem DVD.', 'DVD を みます。'],
      ['Tôi đọc sách tiếng Nhật.', '{日本語|にほんご} の {本|ほん} を よみます。'],
      ['Bạn uống gì? — Tôi uống sữa.', '{何|なに} を のみます か。 —— ぎゅうにゅう を のみます。'],
      ['Buổi sáng tôi ăn bánh mì và hoa quả.', 'あさ パン と くだもの を たべます。'],
      ['Chủ nhật bạn làm gì? — Tôi chơi tennis.', '{日曜日|にちようび} に {何|なに} を します か。 —— テニス を します。'],
    ]),
    ...nhom('P19 · [giờ・thứ・ngày] に V', [
      ['Tôi ngủ lúc 11 giờ tối.', 'よる {11|じゅういち}{時|じ} に ねます。'],
      ['Mỗi sáng tôi dậy lúc 6 giờ rưỡi.', 'まいあさ {6|ろく}{時|じ}はん に おきます。'],
      ['Thứ hai tôi đi làm thêm.', '{月曜日|げつようび} に アルバイト を します。'],
      ['Buổi tối tôi ăn cơm lúc 7 giờ.', 'よる {7|しち}{時|じ} に ごはん を たべます。'],
      ['Ngày 15 tháng 8 tôi xem pháo hoa.', '{8月|はちがつ}{15日|じゅうごにち} に はなび を みます。'],
      ['Mấy giờ bạn về nhà? — Tôi về lúc 7 giờ.', '{何時|なんじ} に うち へ かえります か。 —— {7|しち}{時|じ} に かえります。'],
      ['Mùa xuân tôi đi ngắm hoa anh đào.', 'はる に はなみ を します。'],
    ]),
    ...nhom('P20 · [nơi] で V', [
      ['Tôi làm thêm ở siêu thị.', 'スーパー で アルバイト を します。'],
      ['Tôi mua cơm hộp ở siêu thị.', 'スーパー で べんとう を かいます。'],
      ['Chị Kimura làm việc ở bệnh viện.', '^きむら-さん は びょういん で はたらきます。'],
      ['Tôi chơi bóng đá ở công viên.', 'こうえん で サッカー を します。'],
      ['Tôi chơi tennis ở nhà thi đấu.', 'たいいくかん で テニス を します。'],
      ['Chủ nhật tôi xem phim ở nhà.', '{日曜日|にちようび} に うち で えいが を みます。'],
      ['Bạn ăn trưa ở đâu? — Tôi ăn ở trường.', 'どこ で ひるごはん を たべます か。 —— {学校|がっこう} で たべます。'],
    ]),
    ...nhom('P21 · から〜まで', [
      ['Thư viện mở đến mấy giờ?', 'としょかん は {何時|なんじ} まで です か。'],
      ['Ngân hàng mở từ 9 giờ đến 3 giờ.', 'ぎんこう は {9|く}{時|じ} から {3|さん}{時|じ} まで です。'],
      ['Giờ học từ 8 giờ đến 12 giờ.', 'じゅぎょう は {8|はち}{時|じ} から {12|じゅうに}{時|じ} まで です。'],
      ['Bưu điện mở từ thứ hai đến thứ sáu.', 'ゆうびんきょく は {月曜日|げつようび} から {金曜日|きんようび} まで です。'],
      ['Kỳ thi từ thứ tư đến thứ sáu.', 'テスト は {水曜日|すいようび} から {金曜日|きんようび} まで です。'],
      ['Siêu thị mở từ 10 giờ sáng đến 9 giờ tối.', 'スーパー は ごぜん {10|じゅう}{時|じ} から ごご {9|く}{時|じ} まで です。'],
      ['Tôi làm thêm từ 6 giờ đến 10 giờ tối.', 'よる {6|ろく}{時|じ} から {10|じゅう}{時|じ} まで アルバイト を します。'],
      ['Kỳ nghỉ từ khi nào đến khi nào? — Từ ngày 1 đến ngày 5 tháng 5.', 'やすみ は いつ から いつ まで です か。 —— {5月|ごがつ}{1日|ついたち} から {5日|いつか} まで です。'],
    ]),
    ...nhom('P22 · N や N など', [
      ['Tôi mua rau, thịt v.v.', 'やさい や にく など を かいます。'],
      ['Buổi sáng tôi ăn salad, phô mai v.v.', 'あさ サラダ や チーズ など を たべます。'],
      ['Ở cửa hàng tiện lợi tôi mua cơm hộp, nước ép v.v.', 'コンビニ で べんとう や ジュース など を かいます。'],
      ['Ngày nghỉ tôi xem phim, DVD v.v.', 'やすみ の {日|ひ} は えいが や DVD など を みます。'],
    ]),
    ...nhom('P23 · 何も／どこへも〜ません', [
      ['Tôi không mua gì cả.', '{何|なに}も かいません。'],
      ['Tôi không uống gì cả.', '{何|なに}も のみません。'],
      ['Buổi sáng tôi không ăn gì cả.', 'あさ は {何|なに}も たべません。'],
      ['Thứ bảy tôi không đi đâu cả.', '{土曜日|どようび} は どこ へ も いきません。'],
      ['Tối thứ sáu bạn đi đâu? — Tôi không đi đâu cả.', '{金曜日|きんようび} の よる、 どこ へ いきます か。 —— どこ へ も いきません。'],
    ]),
    ...nhom('Thi nói · hỏi – đáp', [
      ['— Ngày nghỉ bạn đi đâu? — Tôi đi thư viện.', 'やすみ の {日|ひ}、 どこ へ いきます か。 —— としょかん へ いきます。'],
      ['— Bạn học ở đâu? — Tôi học ở nhà.', 'どこ で べんきょうします か。 —— うち で べんきょうします。'],
      ['— Hằng ngày bạn có nghe nhạc không? — Có, tối nào tôi cũng nghe.', 'まいにち おんがく を ききます か。 —— はい、 まいばん ききます。'],
      ['— Siêu thị mở từ mấy giờ đến mấy giờ? — Từ 6 giờ sáng đến 7 giờ 15 tối.', 'スーパー は {何時|なんじ} から {何時|なんじ} まで です か。 —— ごぜん {6|ろく}{時|じ} から ごご {7|しち}{時|じ} {15|じゅうご}{分|ふん} まで です。'],
    ]),
    ...nhom('Kể một ngày (câu dài)', [
      ['Mỗi sáng tôi dậy lúc 6 giờ. Tôi ăn bánh mì. Tôi uống sữa.', 'まいあさ {6|ろく}{時|じ} に おきます。 パン を たべます。 ぎゅうにゅう を のみます。'],
      ['Mỗi tối tôi xem tivi. Tôi ngủ lúc 12 giờ.', 'まいばん テレビ を みます。 {12|じゅうに}{時|じ} に ねます。'],
      ['Tôi học ở trường từ 9 giờ đến 4 giờ. Tối tôi về nhà lúc 7 giờ.', '{9|く}{時|じ} から {4|よ}{時|じ} まで {学校|がっこう} で べんきょうします。 よる {7|しち}{時|じ} に うち へ かえります。'],
      ['Thứ bảy tôi làm thêm ở nhà hàng. Chủ nhật tôi không đi đâu cả.', '{土曜日|どようび} は レストラン で アルバイト を します。 {日曜日|にちようび} は どこ へ も いきません。'],
      ['Tuần lễ Vàng tôi đi biển. Ở biển tôi ăn tiệc nướng.', 'ゴールデンウイーク に うみ へ いきます。 うみ で バーベキュー を します。'],
    ]),
  ],
  vietTu: {
    月: 'つき · mặt trăng; げつ', 火: 'ひ · lửa; か', 水: 'みず · nước; すい', 木: 'き · cây; もく', 金: 'きん · vàng, tiền', 土: 'つち · đất; ど',
    日曜日: 'にちようび · chủ nhật', 月曜日: 'げつようび · thứ hai', 何時: 'なんじ · mấy giờ', 時間: 'じかん · thời gian', 何年: 'なんねん · năm nào', 十分: 'じゅっぷん · 10 phút',
  },
  chep: [
    ['いま {何時|なんじ} です か。', 'Bây giờ là mấy giờ?'],
    ['まいあさ {6|ろく}{時|じ} に おきます。', 'Mỗi sáng tôi dậy lúc 6 giờ.'],
    ['{月曜日|げつようび} から {金曜日|きんようび} まで はたらきます。', 'Tôi làm việc từ thứ hai đến thứ sáu.'],
    ['としょかん で べんきょうします。', 'Tôi học ở thư viện.'],
    ['{土曜日|どようび} に うみ へ いきます。', 'Thứ bảy tôi đi biển.'],
    ['{日曜日|にちようび} は どこ へ も いきません。', 'Chủ nhật tôi không đi đâu cả.'],
    ['{何|なに}も たべません。', 'Tôi không ăn gì cả.'],
    ['ぎんこう は {9|く}{時|じ} から {3|さん}{時|じ} まで です。', 'Ngân hàng mở từ 9 giờ đến 3 giờ.'],
  ],
  doan: {
    de: '**Kể lịch trình một ngày của bạn (5 câu)** — dậy lúc mấy giờ, ăn gì, học / làm ở đâu từ mấy giờ đến mấy giờ, về nhà lúc mấy giờ, tối làm gì, ngủ lúc mấy giờ.',
    goiY: ['まいあさ 〜{時|じ}に おきます。', '〜を たべます。', '〜{時|じ}から 〜{時|じ}まで 〜で べんきょうします。', 'よる 〜を みます／ききます。', '〜{時|じ}に ねます。'],
    mau: [
      ['まいあさ {6|ろく}{時|じ}はん に おきます。', 'Mỗi sáng tôi dậy lúc 6 giờ rưỡi.'],
      ['あさごはん は パン です。 コーヒー を のみます。', 'Bữa sáng là bánh mì. Tôi uống cà phê.'],
      ['{8|はち}{時|じ} から {12|じゅうに}{時|じ} まで {学校|がっこう} で べんきょうします。', 'Từ 8 giờ đến 12 giờ tôi học ở trường.'],
      ['ごご は コンビニ で アルバイト を します。 よる {9|く}{時|じ} に うち へ かえります。', 'Buổi chiều tôi làm thêm ở cửa hàng tiện lợi. Tối 9 giờ tôi về nhà.'],
      ['よる テレビ を みます。 {11|じゅういち}{時|じ} に ねます。', 'Buổi tối tôi xem tivi. Tôi ngủ lúc 11 giờ.'],
    ],
  },
  lien: [
    { id: 'b3-thi-thu-viet-113', label: '📝 Đề luyện VIẾT JPD113 (Bài 1–3)', vi: '2 đề viết tay: chữ Hán · trợ từ · sắp câu · dịch · đọc · viết đoạn' },
    { id: 'b3-thi-thu-113-de-1', label: '🎤 Thi thử nói JPD113 — Đề 1', vi: 'tờ đề Reading + câu hỏi giám thị' },
    { id: 'on113-de-tong-hop', label: '📝 Ôn JPD113 — đề luyện tổng hợp 77 câu' },
    { id: 'on113-noi-mau', label: '🗣️ Ôn JPD113 — mẫu trả lời 27 câu hỏi' },
    { id: 'on113-loi-mat-diem', label: '🩺 Lỗi hay mất điểm khi thi nói' },
    { id: 'b3-noi', label: '🎤 Luyện nói Bài 3 (dạng thi)' },
  ],
  thiGhi: ['Câu hỏi thi nói Bài 3 của cô: やすみの日、どこへ いきますか · どこで べんきょうしますか · まいにち おんがくを ききますか · なつやすみ くにへ かえりますか + tranh giờ mở cửa (〜から〜まで, ngày nghỉ) — có đủ trong nhóm "Thi nói" và P21.'],
};

/* ══════════════════ 📝 ĐỀ LUYỆN VIẾT JPD113 (Bài 1–3) — 2 đề ══════════════════ */

const MC = (q: string, options: string[], correct: number, why: string) => ({ q, options, correct, why });
const BD = (vi: string, s: string, nhieu: string[] = []) => {
  const chips = s.trim().split(/\s+/).map(J);
  return { vi, chips: [...chips, ...nhieu], answer: chips, ro: R(s) };
};

type De = {
  so: 'A' | 'B';
  docHan: ReturnType<typeof MC>[];
  chonHan: ReturnType<typeof MC>[];
  troTu: ReturnType<typeof MC>[];
  tuVung: ReturnType<typeof MC>[];
  sapXep: ReturnType<typeof BD>[];
  dich: Parameters<typeof nhom>[1];
  doc: { tieuDe: string; paras: string[]; cau: ReturnType<typeof MC>[] };
  viet: { de: string; goiY: string[]; mau: [string, string][] };
};

function deViet(d: De): Block[] {
  const p = `b3-tv113-${d.so.toLowerCase()}`;
  return [
    { t: 'h', text: `Đề ${d.so} — 60 phút, 50 điểm` },
    { t: 'p', text: '**Làm trên giấy trước** (in đề bằng nút 🖨️ của trình duyệt hoặc chép câu hỏi vào vở), canh 60 phút; xong mới bấm chọn / gõ ở đây để chấm. Phần dịch và viết đoạn: **viết tay** rồi so với đáp án.' },
    { t: 'mcq', id: `${p}-doc-han`, title: `I. Chọn cách đọc đúng của chữ Hán (${d.docHan.length} câu · 1 điểm/câu)`, items: d.docHan },
    { t: 'mcq', id: `${p}-chon-han`, title: `II. Chọn chữ Hán đúng (${d.chonHan.length} câu · 1 điểm/câu)`, items: d.chonHan },
    { t: 'mcq', id: `${p}-tro-tu`, title: `III. Điền trợ từ (${d.troTu.length} câu · 1 điểm/câu)`, items: d.troTu },
    { t: 'mcq', id: `${p}-tu-vung`, title: `IV. Từ vựng — chọn từ đúng (${d.tuVung.length} câu · 1 điểm/câu)`, items: d.tuVung },
    { t: 'build', id: `${p}-sap-xep`, title: `V. Sắp xếp thành câu đúng (${d.sapXep.length} câu · 1 điểm/câu)`, items: d.sapXep },
    { t: 'luyenCau', id: `${p}-dich`, bai: 3, title: `VI. Dịch Việt → Nhật — viết tay rồi xem đáp án (${d.dich.length} câu · 2 điểm/câu)`, cau: nhom(`Đề ${d.so} · dịch`, d.dich) },
    { t: 'passage', title: `VII. Đọc hiểu — ${d.doc.tieuDe}`, paras: d.doc.paras.map((x) => ({ text: J(x) })) },
    { t: 'mcq', id: `${p}-doc`, title: `VII. Câu hỏi đọc hiểu (${d.doc.cau.length} câu · 1 điểm/câu)`, items: d.doc.cau },
    { t: 'giayViet', id: `${p}-viet`, kieu: 'doan', title: 'VIII. Viết đoạn (5 điểm)', de: d.viet.de, goiY: d.viet.goiY, mau: d.viet.mau.map(([s, vi]) => E(s, vi)), dong: 5 },
  ];
}

const DE_A: De = {
  so: 'A',
  docHan: [
    MC('**日本語**', ['にっぽんご', 'にほんご', 'にほんこ', 'にほご'], 1, '日本 = にほん; 日本語 = にほんご.'),
    MC('**学生**', ['がっせい', 'がくせ', 'がくせい', 'かくせい'], 2, '学 がく + 生 せい — trường âm えい.'),
    MC('**九時**', ['きゅうじ', 'くじ', 'きゅじ', 'くうじ'], 1, '9 giờ đọc **くじ** (không phải きゅうじ).'),
    MC('**月曜日**', ['がつようび', 'げつようび', 'つきようび', 'げつようひ'], 1, '月 trong thứ đọc **げつ**; 曜日 = ようび.'),
    MC('**三百円**', ['さんひゃくえん', 'さんぴゃくえん', 'さんびゃくえん', 'みひゃくえん'], 2, '300 = **さんびゃく** (biến âm).'),
    MC('**何時**', ['なにじ', 'なんじ', 'なんとき', 'いつじ'], 1, '何 + đơn vị ⇒ **なん**: なんじ, なんようび.'),
    MC('**私**', ['わだし', 'あたし', 'わたし', 'わたくし'], 2, 'Trong bài: わたし.'),
    MC('**水曜日**', ['みずようび', 'すいようび', 'すようび', 'みようび'], 1, '水 trong thứ đọc **すい**.'),
  ],
  chonHan: [
    MC('**がっこう**', ['学生', '学校', '字校', '学交'], 1, 'がっこう = 学校 (校 bộ 木 bên trái).'),
    MC('**にほんじん**', ['日本人', '日木人', '目本人', '日本入'], 0, '本 có nét ngang dưới (khác 木); 人 hai nét dang ra (khác 入).'),
    MC('**ろくせんえん**', ['六百円', '六千円', '六万円', '八千円'], 1, 'せん = 千; ろくせん = 六千.'),
    MC('**きんようび**', ['金曜日', '金月日', '全曜日', '木曜日'], 0, 'Thứ sáu = 金曜日.'),
    MC('**なんぷん**', ['何分', '何時', '何半', '可分'], 0, 'ふん/ぷん = 分.'),
  ],
  troTu: [
    MC('{私|わたし}（　）ベトナム{人|じん}です。', ['の', 'は', 'を', 'へ'], 1, 'Chủ đề + **は**.'),
    MC('FPTだいがく（　）{学生|がくせい}です。', ['は', 'と', 'の', 'に'], 2, 'Tổ chức **の** người: FPTだいがく**の**{学生|がくせい}.'),
    MC('ワンさんは{学生|がくせい}です。マイさん（　）{学生|がくせい}です。', ['も', 'は', 'の', 'と'], 0, '"cũng" ⇒ **も** thay は.'),
    MC('まいあさ {6|ろく}{時|じ}（　）おきます。', ['で', 'に', 'を', 'へ'], 1, 'Giờ + **に**.'),
    MC('としょかん（　）べんきょうします。', ['へ', 'に', 'で', 'を'], 2, 'Nơi làm việc gì ⇒ **で**.'),
    MC('{日曜日|にちようび}に うみ（　）いきます。', ['を', 'で', 'へ', 'の'], 2, 'Đi tới ⇒ **へ** (đọc e).'),
    MC('コーヒー（　）のみます。', ['を', 'が', 'へ', 'で'], 0, 'Tân ngữ ⇒ **を**.'),
    MC('ぎんこうは {9|く}{時|じ}（　）{3|さん}{時|じ}までです。', ['まで', 'から', 'に', 'と'], 1, 'Từ … đến … ⇒ **から**〜まで.'),
  ],
  tuVung: [
    MC('Người ta nói "よろしく おねがいします". Bạn đáp:', ['そうですか。', 'こちらこそ。', 'すみません。', 'いらっしゃいませ。'], 1, 'Đáp lại よろしく: **こちらこそ**（よろしく）.'),
    MC('Hỏi giá:', ['どこですか。', 'いくらですか。', 'だれですか。', 'いつですか。'], 1, 'Bao nhiêu tiền = **いくら**.'),
    MC('"Thư viện" là:', ['びょういん', 'ぎんこう', 'としょかん', 'こうえん'], 2, 'としょかん = thư viện; びょういん = bệnh viện.'),
    MC('Ngày 20 đọc là:', ['にじゅうにち', 'はつか', 'はたち', 'ふつか'], 1, '20 (ngày) = **はつか**; はたち = 20 tuổi.'),
    MC('Cái ở GẦN NGƯỜI NGHE là:', ['これ', 'それ', 'あれ', 'どれ'], 1, 'それ = gần người nghe.'),
  ],
  sapXep: [
    BD('Sở thích của tôi là âm nhạc và du lịch.', '{私|わたし}の しゅみは おんがくと りょこうです。', ['も']),
    BD('Cái đồng hồ này bao nhiêu tiền?', 'この とけいは いくらですか。', ['これ']),
    BD('Tôi học ở thư viện từ 9 giờ.', '{9|く}{時|じ}から としょかんで べんきょうします。', ['へ']),
    BD('Chủ nhật tôi không đi đâu cả.', '{日曜日|にちようび}は どこへも いきません。', ['いきます']),
    BD('Cho tôi hai quả táo.', 'リンゴを ふたつ ください。', ['が']),
  ],
  dich: [
    ['Tôi là sinh viên trường tiếng Nhật.', '{私|わたし} は {日本語学校|にほんごがっこう} の {学生|がくせい} です。'],
    ['Anh Daniel không phải là người Mỹ.', '^ダニエル-さん は アメリカ{人|じん} じゃ ありません。', ['^ダニエル-さん は アメリカ{人|じん} では ありません。']],
    ['Thang máy ở đằng kia.', 'エレベーター は あそこ です。'],
    ['Đây là máy tính của nước nào?', 'これ は どこ の パソコン です か。'],
    ['Mỗi tối tôi học tiếng Nhật ở nhà.', 'まいばん うち で {日本語|にほんご} を べんきょうします。'],
    ['Bưu điện mở từ 9 giờ đến 5 giờ.', 'ゆうびんきょく は {9|く}{時|じ} から {5|ご}{時|じ} まで です。'],
  ],
  doc: {
    tieuDe: 'わたしの いちにち (Một ngày của tôi)',
    paras: [
      '{私|わたし} は ^ホア です。 FPT だいがく の {学生|がくせい} です。 {19|じゅうきゅう}{才|さい} です。',
      'まいあさ {6|ろく}{時|じ} に おきます。 あさごはん は パン です。 {7|しち}{時|じ}はん に {学校|がっこう} へ いきます。',
      'じゅぎょう は {8|はち}{時|じ} から {12|じゅうに}{時|じ} まで です。 ひるごはん は {学校|がっこう} で たべます。',
      '{月曜日|げつようび} と {水曜日|すいようび} は コンビニ で アルバイト を します。 {日曜日|にちようび} は どこ へ も いきません。 うち で えいが を みます。',
    ],
    cau: [
      MC('ホアさんは まいあさ {何時|なんじ}に おきますか。', ['{6|ろく}{時|じ}', '{6|ろく}{時|じ}はん', '{7|しち}{時|じ}はん', '{8|はち}{時|じ}'], 0, 'Đoạn 2: まいあさ {6|ろく}{時|じ}に おきます.'),
      MC('じゅぎょうは {何時|なんじ}までですか。', ['{8|はち}{時|じ}', '{12|じゅうに}{時|じ}', '{7|しち}{時|じ}はん', '{6|ろく}{時|じ}'], 1, '{8|はち}{時|じ}から {12|じゅうに}{時|じ}まで.'),
      MC('ホアさんは どこで アルバイトを しますか。', ['{学校|がっこう}', 'うち', 'コンビニ', 'スーパー'], 2, 'コンビニで アルバイトを します.'),
      MC('{日曜日|にちようび}、ホアさんは {何|なに}を しますか。', ['アルバイトを します', 'うちで えいがを みます', '{学校|がっこう}へ いきます', 'パンを かいます'], 1, '{日曜日|にちようび}は どこへも いきません。うちで えいがを みます.'),
    ],
  },
  viet: {
    de: 'Tự giới thiệu (tên · nước · trường · tuổi · sở thích) rồi kể **một ngày** của bạn — tổng 5 câu.',
    goiY: ['はじめまして。〜です。〜{人|じん}です。', '〜の {学生|がくせい}です。〜{才|さい}です。', 'しゅみは 〜です。', 'まいあさ 〜{時|じ}に おきます。〜で べんきょうします。'],
    mau: [
      ['はじめまして。 ^ナム です。 ベトナム{人|じん} です。', 'Rất vui được gặp. Tôi là Nam. Tôi là người Việt Nam.'],
      ['FPT だいがく の {学生|がくせい} です。 はたち です。', 'Tôi là sinh viên Đại học FPT. Tôi 20 tuổi.'],
      ['しゅみ は サッカー です。', 'Sở thích là bóng đá.'],
      ['まいあさ {7|しち}{時|じ} に おきます。 {9|く}{時|じ} から {4|よ}{時|じ} まで {学校|がっこう} で べんきょうします。', 'Mỗi sáng tôi dậy lúc 7 giờ. Từ 9 giờ đến 4 giờ tôi học ở trường.'],
      ['よる {11|じゅういち}{時|じ} に ねます。', 'Buổi tối tôi ngủ lúc 11 giờ.'],
    ],
  },
};

const DE_B: De = {
  so: 'B',
  docHan: [
    MC('**日本人**', ['にほんひと', 'にっぽんにん', 'にほんじん', 'にほじん'], 2, '〜人 (người nước…) đọc **じん**.'),
    MC('**四時**', ['よんじ', 'しじ', 'よじ', 'よっじ'], 2, '4 giờ = **よじ**.'),
    MC('**八千円**', ['はちせんえん', 'はっせんえん', 'はっぜんえん', 'やせんえん'], 1, '8000 = **はっせん**.'),
    MC('**火曜日**', ['ひようび', 'かようび', 'かようひ', 'びようび'], 1, '火 trong thứ đọc **か**.'),
    MC('**一万円**', ['いちまんえん', 'ひとまんえん', 'いっまんえん', 'いちばんえん'], 0, 'Một vạn = **いちまん** (phải có いち).'),
    MC('**十分**', ['じゅうふん', 'じっぷん／じゅっぷん', 'とおぷん', 'じゅうぶん（đủ）'], 1, '10 phút = **じゅっぷん** (cũng viết じっぷん).'),
    MC('**学校**', ['がくこう', 'がっこう', 'がこう', 'がっこ'], 1, 'がく + こう ⇒ **がっこう** (âm ngắt っ, trường âm う).'),
    MC('**土曜日**', ['つちようび', 'どようび', 'とようび', 'どうようび'], 1, '土 trong thứ = **ど**.'),
  ],
  chonHan: [
    MC('**わたし**', ['私', '払', '和', '仏'], 0, '私 = bộ 禾 (lúa) + ム.'),
    MC('**にほんご**', ['日本語', '日本話', '日木語', '日本吾'], 0, '語 = bộ 言 + 吾.'),
    MC('**じかん**', ['時問', '時間', '寺間', '時門'], 1, '間 = 門 + 日 (khác 問 có 口).'),
    MC('**さんびゃくえん**', ['三千円', '三百円', '三万円', '三白円'], 1, 'ひゃく = 百 (có nét ngang trên — khác 白).'),
    MC('**もくようび**', ['木曜日', '本曜日', '米曜日', '水曜日'], 0, 'Thứ năm = 木曜日.'),
  ],
  troTu: [
    MC('{私|わたし}（　）なまえは ランです。', ['は', 'の', 'も', 'を'], 1, '"tên CỦA tôi" ⇒ **の**.'),
    MC('しゅみは サッカー（　）すいえいです。', ['と', 'の', 'も', 'に'], 0, 'Nối hai danh từ ⇒ **と**.'),
    MC('これ（　）{日本|にほん}の カメラです。', ['を', 'へ', 'は', 'で'], 2, 'Chủ đề ⇒ **は**.'),
    MC('リンゴ（　）みっつ ください。', ['は', 'を', 'が', 'の'], 1, 'Vật + **を** + số lượng + ください.'),
    MC('「pen」は {日本語|にほんご}（　）なんですか。', ['に', 'で', 'を', 'の'], 1, '"bằng tiếng Nhật" ⇒ {日本語|にほんご}**で**.'),
    MC('よる {11|じゅういち}{時|じ}（　）ねます。', ['で', 'へ', 'に', 'を'], 2, 'Giờ + **に**.'),
    MC('スーパー（　）やさいを かいます。', ['で', 'へ', 'に', 'は'], 0, 'Mua Ở siêu thị ⇒ **で**.'),
    MC('{日曜日|にちようび}は どこ（　）も いきません。', ['で', 'に', 'へ', 'を'], 2, 'どこ**へ**も 〜ません.'),
  ],
  tuVung: [
    MC('Muốn gọi người lạ để hỏi đường, bạn mở lời:', ['こちらこそ。', 'あのう、すみません。', 'いらっしゃいませ。', 'どうぞ。'], 1, 'Mở lời lịch sự: **あのう、すみません**.'),
    MC('"Bao nhiêu tuổi" là:', ['なんさい', 'なんじ', 'なんがい', 'いくら'], 0, 'Tuổi = **なんさい** (lịch sự: おいくつ).'),
    MC('Ngày 1 (mùng 1) đọc là:', ['いちにち', 'ついたち', 'ひとつ', 'いっか'], 1, 'Mùng 1 = **ついたち**.'),
    MC('"Làm thêm" là:', ['しごと', 'アルバイト', 'じゅぎょう', 'テスト'], 1, 'アルバイト = việc làm thêm.'),
    MC('Cái ở XA cả hai người là:', ['これ', 'それ', 'あれ', 'この'], 2, 'あれ = xa cả hai.'),
  ],
  sapXep: [
    BD('Anh Park cũng là sinh viên.', '^パク-さんも {学生|がくせい}です。', ['は']),
    BD('Đây là sách của ai?', 'これは だれの {本|ほん}ですか。', ['どこの']),
    BD('Tôi về nhà lúc 7 giờ tối.', 'よる {7|しち}{時|じ}に うちへ かえります。', ['で']),
    BD('Tôi mua rau, thịt v.v. ở siêu thị.', 'スーパーで やさいや にくなどを かいます。', ['と']),
    BD('Buổi sáng tôi không ăn gì cả.', 'あさは {何|なに}も たべません。', ['たべます']),
  ],
  dich: [
    ['Sinh nhật của tôi là ngày 8 tháng 3.', '{私|わたし} の たんじょうび は {3|さん}がつ {8日|ようか} です。', ['{私|わたし} の たんじょうび は {3月|さんがつ} {8日|ようか} です。']],
    ['Chị Lan là giáo viên tiếng Nhật.', '^ラン-さん は {日本語|にほんご} の せんせい です。'],
    ['Cái ví này giá 3.000 yên.', 'この さいふ は {三千|さんぜん}{円|えん} です。'],
    ['Nhà vệ sinh ở tầng mấy?', 'トイレ は なんがい です か。', ['トイレ は {何階|なんがい} です か。']],
    ['Thứ bảy tôi chơi tennis ở công viên.', '{土曜日|どようび} に こうえん で テニス を します。', ['{土曜日|どようび} は こうえん で テニス を します。']],
    ['Kỳ nghỉ từ thứ hai đến thứ tư.', 'やすみ は {月曜日|げつようび} から {水曜日|すいようび} まで です。'],
  ],
  doc: {
    tieuDe: 'デパート (Trung tâm thương mại)',
    paras: [
      'ここ は さくら デパート です。 ごぜん {10|じゅう}{時|じ} から ごご {8|はち}{時|じ} まで です。 やすみ は {水曜日|すいようび} です。',
      'スーパー は ちか です。 くつや は {2階|にかい} です。 {本|ほん}や は {5階|ごかい} です。 レストラン は {7階|ななかい} です。',
      '{私|わたし} は {5階|ごかい} で {日本語|にほんご} の {本|ほん} を かいます。 {本|ほん} は {千二百|せんにひゃく}{円|えん} です。',
    ],
    cau: [
      MC('デパートは {何時|なんじ}までですか。', ['ごご {10|じゅう}{時|じ}', 'ごご {8|はち}{時|じ}', 'ごぜん {10|じゅう}{時|じ}', 'ごご {7|しち}{時|じ}'], 1, 'ごぜん {10|じゅう}{時|じ}から ごご {8|はち}{時|じ}まで.'),
      MC('デパートの やすみは {何曜日|なんようび}ですか。', ['{月曜日|げつようび}', '{水曜日|すいようび}', '{土曜日|どようび}', '{日曜日|にちようび}'], 1, 'やすみは {水曜日|すいようび}です.'),
      MC('くつやは なんがいですか。', ['ちか', '{2階|にかい}', '{5階|ごかい}', '{7階|ななかい}'], 1, 'くつやは {2階|にかい}です.'),
      MC('{本|ほん}は いくらですか。', ['{千|せん}{円|えん}', '{千二百|せんにひゃく}{円|えん}', '{二千|にせん}{円|えん}', '{百二十|ひゃくにじゅう}{円|えん}'], 1, '{本|ほん}は {千二百|せんにひゃく}{円|えん}です.'),
    ],
  },
  viet: {
    de: 'Viết 5 câu về **cửa hàng / trường học gần nhà bạn**: tên, mở cửa từ mấy giờ đến mấy giờ, nghỉ thứ mấy, ở đó có gì / bạn làm gì ở đó.',
    goiY: ['ここは 〜です。', '〜{時|じ}から 〜{時|じ}までです。', 'やすみは 〜{曜日|ようび}です。', '{私|わたし}は そこで 〜を かいます／べんきょうします。'],
    mau: [
      ['ここ は ABC スーパー です。', 'Đây là siêu thị ABC.'],
      ['ごぜん {8|はち}{時|じ} から よる {10|じゅう}{時|じ} まで です。', 'Mở cửa từ 8 giờ sáng đến 10 giờ tối.'],
      ['やすみ は {日曜日|にちようび} です。', 'Ngày nghỉ là chủ nhật.'],
      ['{私|わたし} は まいばん ここ で パン や ぎゅうにゅう など を かいます。', 'Tối nào tôi cũng mua bánh mì, sữa v.v. ở đây.'],
      ['パン は {百五十|ひゃくごじゅう}{円|えん} です。', 'Bánh mì giá 150 yên.'],
    ],
  },
};

const THI_VIET_113: Lesson = {
  id: 'b3-thi-thu-viet-113',
  kind: 'review',
  title: '📝 Đề luyện VIẾT JPD113 (Bài 1–3) — 2 đề: chữ Hán · trợ từ · từ vựng · sắp câu · dịch viết tay · đọc · viết đoạn',
  goal: 'Làm trọn phần viết của JPD113 trong 60 phút: đọc / chọn đúng chữ Hán của lớp Bài 1–3, chọn trợ từ, sắp câu, tự viết câu và đoạn văn có chữ Hán của lớp.',
  minutes: 120,
  ready: true,
  blocks: [
    {
      t: 'recap',
      title: 'Cách dùng đề luyện viết',
      items: [
        'Hai đề A và B cùng khuôn, mỗi đề **60 phút · 50 điểm**: I đọc chữ Hán · II chọn chữ Hán · III trợ từ · IV từ vựng · V sắp xếp câu · VI dịch Việt → Nhật (viết tay) · VII đọc hiểu · VIII viết đoạn.',
        'Chỉ dùng từ, ngữ pháp và **chữ Hán của lớp** Bài 1–3 (私人才学生校日本語 · 一〜万 円 · 月火水木金土日曜何年時間分).',
        '**Đạt ≥ 40/50** ở cả hai đề thì yên tâm phần viết; dưới 30 ⇒ quay lại 🔁 Luyện câu 2 chiều Bài 1–3, lọc "Hay sai".',
        'Sai phần nào ôn phần đó: I–II ⇒ ✍️ Tập viết + Chữ Hán của lớp · III ⇒ bảng "Mẫu câu" đầu mỗi bài luyện câu · VI–VIII ⇒ luyện câu chiều Việt → Nhật.',
      ],
    },
    {
      t: 'moBai',
      title: 'Phần NÓI của JPD113 đã có sẵn — làm kèm',
      items: [
        { id: 'b3-thi-thu-113-de-1', label: '🎤 Thi thử nói JPD113 — Đề 1' },
        { id: 'b3-thi-thu-113-chien-luoc', label: '🧭 Chiến lược thi JPD113' },
        { id: 'on113-de-tong-hop', label: '📝 Ôn JPD113 — đề tổng hợp 77 câu' },
      ],
    },
    ...deViet(DE_A),
    ...deViet(DE_B),
  ],
};

export const LUYEN_CAU: Record<number, Lesson[]> = {
  1: baiLuyen(B1),
  2: baiLuyen(B2),
  3: [...baiLuyen(B3), THI_VIET_113],
};
