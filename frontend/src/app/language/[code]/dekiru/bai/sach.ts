/**
 * "📖 Theo sách" — học kèm TỪNG TRANG sách できる日本語 初級 (Bài 1–3).
 *
 * Vì sao có phần này: trên lớp cô liên tục chỉ vào một trang / một bức tranh
 * trong sách rồi hỏi. Với mỗi trang, người học cần biết: trang đó nói về gì,
 * cô sẽ hỏi gì, và trả lời thế nào.
 *
 * Quy tắc (../SOAN-BAI.md): KHÔNG chép sách — tranh được TẢ LẠI bằng lời của
 * mình, câu hỏi–đáp đều viết mới (chỉ dùng lại tên nhân vật và vài câu chào cố
 * định). Mọi câu tiếng Nhật có `ro` (romaji) và `vi`; chữ Hán viết {漢字|かな}.
 * Người học mẫu: "ミン" (Minh) — sinh viên Việt ở ĐH FPT; khi luyện thì thay
 * bằng tên, tuổi, ngày sinh, sở thích THẬT của bạn.
 *
 * Số trang = số in trên sách (bài 1 p.15–30, bài 2 p.31–46, bài 3 p.47–66).
 */
import type { Block, Lesson } from '@/components/sach-hoc/types';

type Line = Extract<Block, { t: 'dialogue' }>['lines'][number];
type Ex = { en: string; ro: string; vi: string };

/** Cô giáo hỏi. */
const C = (text: string, ro: string, vi: string): Line => ({ who: 'Cô giáo', role: 'examiner', text, ro, vi });
/** Bạn trả lời. */
const S = (text: string, ro: string, vi: string): Line => ({ who: 'Bạn', role: 'candidate', text, ro, vi });
const E = (en: string, ro: string, vi: string): Ex => ({ en, ro, vi });

/** Một trang (hoặc một cặp trang): tiêu đề → tả tranh/mục đích → [khối thêm] → cô hỏi–bạn đáp → mẹo. */
function trang(h: string, p: string, lines: Line[], meo: string[], extra: Block[] = []): Block[] {
  return [
    { t: 'h', text: h },
    { t: 'p', text: p },
    ...extra,
    { t: 'dialogue', title: 'Cô hỏi — bạn trả lời', lines },
    { t: 'note', title: 'Mẹo trả lời', items: meo },
  ];
}

/** Danh sách câu mẫu cho từng số / từng gợi ý của 言ってみよう. */
const mau = (items: Ex[]): Block => ({ t: 'examples', items });

const CACH_DUNG: Block = {
  t: 'note',
  title: 'Dùng phần này thế nào',
  items: [
    'Mở sách đúng trang ghi ở tiêu đề, nhìn tranh trước, rồi mới đọc phần tả tranh ở đây.',
    'Bấm nghe đoạn "Cô hỏi — bạn trả lời", đọc to phần của **Bạn** 3 lần, sau đó che đáp án và tự trả lời khi nghe câu hỏi.',
    'Luôn trả lời **đủ câu**, có です／ます ở cuối, câu hỏi có/không thì mở đầu bằng **はい／いいえ** (thi JPD113 trừ điểm nếu quên).',
    'Không nghe rõ câu cô hỏi: nói **もう{一度|いちど}お{願|ねが}いします** (mō ichido onegaishimasu — xin cô nói lại một lần nữa). Trong thi được xin nhắc lại 2 lần mà không bị trừ điểm.',
    'Chỗ nào có tên ミン (Minh), FPT{大学|だいがく}… là thông tin mẫu — thay bằng thông tin THẬT của bạn.',
  ],
};

/* ══════════════════════════ BÀI 1 — はじめまして ══════════════════════════ */

const SACH_1: Lesson = {
  id: 'b1-sach',
  kind: 'review',
  title: 'Theo sách — Bài 1 (trang 15–30)',
  goal: 'Mở sách trang nào cũng biết trang đó nói gì, cô sẽ hỏi gì và trả lời được bằng mẫu câu của Bài 1.',
  minutes: 50,
  blocks: [
    CACH_DUNG,

    ...trang(
      'Trang 14 · 登場人物 — Các nhân vật của sách',
      'Trang vẽ chân dung 13 nhân vật sẽ xuất hiện suốt cả cuốn sách, mỗi người có nhãn tên (パク được vẽ cả người, đang đi và giơ tay — nhân vật chính). Trang này không có chữ nào về nước hay nghề; những thông tin đó lộ ra dần trong các bài. Cô hay chỉ vào một khuôn mặt và hỏi "người này là ai?" để kiểm tra bạn đọc được katakana.',
      [
        C('この{人|ひと}はだれですか。', 'Kono hito wa dare desu ka.', 'Người này là ai?'),
        S('パクさんです。', 'Paku-san desu.', 'Là chị Park.'),
        C('パクさんは{学生|がくせい}ですか。', 'Paku-san wa gakusei desu ka.', 'Park là học sinh à?'),
        S('はい、{学生|がくせい}です。あおぞら{日本語学校|にほんごがっこう}の{学生|がくせい}です。', 'Hai, gakusei desu. Aozora nihongo gakkō no gakusei desu.', 'Vâng, là học sinh. Học sinh trường tiếng Nhật Aozora.'),
        C('この{人|ひと}は？', 'Kono hito wa?', 'Còn người này?'),
        S('{本田先生|ほんだせんせい}です。', 'Honda-sensei desu.', 'Là thầy Honda.'),
      ],
      [
        '**だれ** (ai) chính thức học ở Bài 2 nhưng cô dùng ngay từ đầu — nghe だれ thì trả lời bằng TÊN + さん + です.',
        'Gọi người khác thêm **さん**; gọi giáo viên thì thay さん bằng **{先生|せんせい}** (本田先生, không nói 本田先生さん). Không bao giờ thêm さん vào tên mình.',
        'Bảng nước + nghề của từng nhân vật: xem **Hội thoại · bảng nhân vật** ở đầu bài 1.',
      ],
    ),

    ...trang(
      'Trang 15 · 話してみよう・聞いてみよう — Mở bài はじめまして',
      '**話してみよう** là 4 bức tranh không lời để khởi động: (1) một tấm danh thiếp của một nhân viên công ty ABE rút ra khỏi hộp đựng; (2) hai người mặc vest bắt tay nhau ở quầy lễ tân một văn phòng; (3) ba bạn trẻ ngoài con đường có hàng cây đang cúi chào nhau; (4) một thanh niên mặc vest đưa danh thiếp cho hai người trong văn phòng. Mục đích: nói xem khi gặp lần đầu người Nhật làm gì (cúi chào, trao danh thiếp, nói はじめまして). **聞いてみよう** là nghe TRƯỚC cả đoạn hội thoại của bài (chính là đoạn ở trang 30) — chưa cần hiểu hết, chỉ cần bắt được tên người, nước, nghề.',
      [
        C('この{人|ひと}の{名前|なまえ}は{何|なん}ですか。', 'Kono hito no namae wa nan desu ka.', '(chỉ tấm danh thiếp) Tên người này là gì?'),
        S('カルロスさんです。', 'Karurosu-san desu.', 'Là anh Carlos.'),
        C('カルロスさんは{会社員|かいしゃいん}ですか。', 'Karurosu-san wa kaishain desu ka.', 'Carlos là nhân viên công ty à?'),
        S('はい、{会社員|かいしゃいん}です。ABEの{社員|しゃいん}です。', 'Hai, kaishain desu. Ē-bī-ī no shain desu.', 'Vâng, là nhân viên công ty. Nhân viên của công ty ABE.'),
        C('はじめまして。{本田|ほんだ}です。', 'Hajimemashite. Honda desu.', '(cô đóng vai như tranh 2) Rất vui được gặp. Tôi là Honda.'),
        S('はじめまして。ミンです。どうぞよろしくお{願|ねが}いします。', 'Hajimemashite. Min desu. Dōzo yoroshiku onegaishimasu.', 'Rất vui được gặp. Em là Minh. Rất mong được giúp đỡ.'),
      ],
      [
        'Cô hay hỏi bằng tiếng Việt: "Tranh này người ta đang làm gì?" → trả lời: cúi chào (おじぎ ojigi), trao danh thiếp (めいし meishi) bằng hai tay, nói はじめまして.',
        'Khi cô đóng vai người mới gặp: đáp bằng bộ 3 câu **はじめまして → ～です → よろしくお願いします** (ポイント 1).',
        'Học lời chào: xem **Hội thoại · mục 1** và **Từ vựng · Chủ đề 1c**.',
      ],
    ),

    ...trang(
      'Trang 16–17 · チャレンジ! 私の名前・国・仕事',
      'Trang 16: ba sinh viên (hai nữ, một nam) đứng giữa bàn ghế trong lớp, cạnh cửa sổ — ngày đầu gặp nhau ở trường. Các ô nhỏ: (1) hai người trao đổi tên; (2) một người hỏi tên bằng bong bóng hình người + dấu "?"; (3) một cô gái nói mình là người Trung Quốc; ô có quả địa cầu + dấu "?" là đoán/hỏi nước của nhau. Trang 17: phòng sinh hoạt chung ký túc xá, hai cặp ngồi sofa nói chuyện với người mới quen. Ô (4) hỏi công việc; ô (5) hỏi "bạn là nhân viên công ty à?" và trả lời; ô (6) một cô gái nói mình học trường tiếng Nhật あおぞら. **Mục tiêu できる:** nói được tên, nước, công việc của mình và hỏi người khác những điều đó. チャレンジ = "thử nói trước khi học" — cô sẽ cho bạn đóng vai người trong tranh.',
      [
        C('はじめまして。{私|わたし}は{本田|ほんだ}です。', 'Hajimemashite. Watashi wa Honda desu.', 'Rất vui được gặp. Tôi là Honda.'),
        S('はじめまして。ミンです。どうぞよろしくお{願|ねが}いします。', 'Hajimemashite. Min desu. Dōzo yoroshiku onegaishimasu.', 'Rất vui được gặp. Em là Minh. Rất mong được giúp đỡ.'),
        C('ミンさん、お{国|くに}はどちらですか。', 'Min-san, o-kuni wa dochira desu ka.', 'Minh đến từ nước nào?'),
        S('ベトナムです。', 'Betonamu desu.', 'Việt Nam ạ.'),
        C('お{仕事|しごと}は？', 'O-shigoto wa?', 'Còn công việc?'),
        S('{学生|がくせい}です。FPT{大学|だいがく}の{学生|がくせい}です。', 'Gakusei desu. Efu-pī-tī daigaku no gakusei desu.', 'Em là sinh viên. Sinh viên Đại học FPT.'),
        C('（ô 3）この{人|ひと}は{中国人|ちゅうごくじん}ですか。', '(ô 3) Kono hito wa Chūgokujin desu ka.', '(ô 3) Người này là người Trung Quốc à?'),
        S('はい、{中国人|ちゅうごくじん}です。', 'Hai, Chūgokujin desu.', 'Vâng, là người Trung Quốc.'),
        C('（ô 6）この{人|ひと}は{会社員|かいしゃいん}ですか。', '(ô 6) Kono hito wa kaishain desu ka.', '(ô 6) Người này là nhân viên công ty à?'),
        S('いいえ、{会社員|かいしゃいん}じゃありません。{学生|がくせい}です。', 'Iie, kaishain ja arimasen. Gakusei desu.', 'Không, không phải nhân viên công ty. Là học sinh.'),
      ],
      [
        'Dùng **ポイント 1** (N1 は N2 です), **ポイント 2** (～ですか／はい・いいえ／じゃありません), **ポイント 3** (どちら), **ポイント 4** (FPT大学**の**学生).',
        'Hỏi お国 (nước) → trả lời **tên nước** (ベトナムです), KHÔNG trả lời ベトナム人です. Hỏi ～人ですか mới trả lời ～人です.',
        'Câu hỏi có/không mà sai thì: いいえ + ～じゃありません + câu ĐÚNG (…学生です). Nói thêm câu đúng được điểm cao hơn.',
        'Xem **Hội thoại · mục 1** và **Ngữ pháp · ポイント 1–4**.',
      ],
    ),

    ...trang(
      'Trang 18–19 · 言ってみよう (chủ đề 1) — 6 bài tập',
      'Trang luyện nói theo mẫu: mỗi số là một mẫu hội thoại có chỗ gạch dưới, bên dưới là các tranh gợi ý (例 = ví dụ, ①②… = bạn tự thay). Mặt cười ☺ nghĩa là: luyện xong với tranh thì nói lại bằng thông tin CỦA BẠN. **Số 1:** chào và nói tên — rẽ hai nhánh: người kia nói tên luôn, hoặc chỉ chào lại mà quên tên (khi đó bạn hỏi tên). **Số 2:** tên + quốc tịch. **Số 3:** hỏi nước (お国はどちらですか). **Số 4:** hỏi công việc — tranh gợi ý: 例 người mặc vest (nhân viên công ty), ① thanh niên ôm sách (học sinh/sinh viên), ② người phụ nữ đeo kính cầm sách (giáo viên). **Số 5:** "B là học sinh à?" — trả lời có hoặc không. **Số 6:** phủ định rồi nói đúng + nói trường/công ty: ① hỏi học sinh? → thật ra là nhân viên công ty ABE; ② hỏi nhân viên công ty? → thật ra là giáo viên trường THPT さくら. Câu mẫu bên dưới là đáp án cho từng số, viết bằng thông tin mẫu.',
      [
        C('（số 4 — tranh ①）この{人|ひと}のお{仕事|しごと}は？', '(số 4 — tranh 1) Kono hito no o-shigoto wa?', '(số 4, tranh ①) Người này làm nghề gì?'),
        S('{学生|がくせい}です。', 'Gakusei desu.', 'Là học sinh / sinh viên.'),
        C('（tranh ②）この{人|ひと}は？', '(tranh 2) Kono hito wa?', '(tranh ②) Còn người này?'),
        S('{教師|きょうし}です。', 'Kyōshi desu.', 'Là giáo viên.'),
        C('（số 6 — ②）Bさんは{会社員|かいしゃいん}ですか。', '(số 6 — 2) B-san wa kaishain desu ka.', '(số 6, ②) B là nhân viên công ty à?'),
        S('いいえ、{会社員|かいしゃいん}じゃありません。{教師|きょうし}です。さくら{高校|こうこう}の{教師|きょうし}です。', 'Iie, kaishain ja arimasen. Kyōshi desu. Sakura kōkō no kyōshi desu.', 'Không, không phải nhân viên công ty. Là giáo viên. Giáo viên trường THPT Sakura.'),
        C('ミンさんは{会社員|かいしゃいん}ですか。', 'Min-san wa kaishain desu ka.', '(☺ nói về bạn) Minh là nhân viên công ty à?'),
        S('いいえ、{会社員|かいしゃいん}じゃありません。{学生|がくせい}です。FPT{大学|だいがく}の{学生|がくせい}です。', 'Iie, kaishain ja arimasen. Gakusei desu. Efu-pī-tī daigaku no gakusei desu.', 'Không, em không phải nhân viên công ty. Em là sinh viên Đại học FPT.'),
      ],
      [
        '**{教師|きょうし}** = nói nghề CỦA MÌNH ("tôi là giáo viên"); **{先生|せんせい}** = gọi / nói về giáo viên người khác. Cô hỏi "tranh ② là ai" thì 教師です hay 先生です đều được.',
        '**{社員|しゃいん}** luôn đi sau tên công ty (ABEの社員); **{会社員|かいしゃいん}** đứng một mình (nghề "nhân viên công ty").',
        'Số 5 có hai nhánh ⇒ cô sẽ hỏi cả hai: tập cả **はい、学生です** và **いいえ、学生じゃありません。会社員です。**',
        'Xem **Ngữ pháp · ポイント 2** (phủ định) và **ポイント 4** (の).',
      ],
      [
        mau([
          E('はじめまして。{私|わたし}はミンです。よろしくお{願|ねが}いします。', 'Hajimemashite. Watashi wa Min desu. Yoroshiku onegaishimasu.', 'Số 1 — chào và nói tên.'),
          E('はじめまして。リンです。こちらこそ、よろしくお{願|ねが}いします。', 'Hajimemashite. Rin desu. Kochira koso, yoroshiku onegaishimasu.', 'Số 1, nhánh 1 — người kia đáp lại có nói tên.'),
          E('あのう、すみません。お{名前|なまえ}は？', 'Anō, sumimasen. O-namae wa?', 'Số 1, nhánh 2 — người kia quên nói tên, bạn hỏi lại.'),
          E('はじめまして。ミンです。ベトナム{人|じん}です。よろしくお{願|ねが}いします。', 'Hajimemashite. Min desu. Betonamu-jin desu. Yoroshiku onegaishimasu.', 'Số 2 — tên + quốc tịch.'),
          E('リンさん、お{国|くに}はどちらですか。— ベトナムです。— そうですか。', 'Rin-san, o-kuni wa dochira desu ka. — Betonamu desu. — Sō desu ka.', 'Số 3 — hỏi nước và đáp.'),
          E('{私|わたし}は{会社員|かいしゃいん}です。／{学生|がくせい}です。／{教師|きょうし}です。', 'Watashi wa kaishain desu. / Gakusei desu. / Kyōshi desu.', 'Số 4 — 例 nhân viên công ty · ① học sinh · ② giáo viên.'),
          E('はい、{学生|がくせい}です。／いいえ、{学生|がくせい}じゃありません。{会社員|かいしゃいん}です。', 'Hai, gakusei desu. / Iie, gakusei ja arimasen. Kaishain desu.', 'Số 5 — hai nhánh có / không.'),
          E('いいえ、{学生|がくせい}じゃありません。{会社員|かいしゃいん}です。ABEの{社員|しゃいん}です。', 'Iie, gakusei ja arimasen. Kaishain desu. Ē-bī-ī no shain desu.', 'Số 6 ① — không phải học sinh, là nhân viên công ty ABE.'),
          E('いいえ、{会社員|かいしゃいん}じゃありません。{教師|きょうし}です。さくら{高校|こうこう}の{教師|きょうし}です。', 'Iie, kaishain ja arimasen. Kyōshi desu. Sakura kōkō no kyōshi desu.', 'Số 6 ② — không phải nhân viên công ty, là giáo viên THPT Sakura.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 19 · やってみよう (chủ đề 1) — Nghe và điền bảng tên・nước・nghề',
      'Bài nghe CD: bảng có 4 người chia hai cặp (パク – メアリー, ワン – 木村); bạn nghe rồi điền **nước** (chọn trong: Trung Quốc, Hàn Quốc, Mỹ) và **nghề** (chọn 1 trong 3 hình người: cầm vở, mặc áo vest, đang thuyết trình). Nghe để bắt đúng hai thứ: tên nước đứng ngay trước です sau câu お国は…, và từ chỉ nghề 学生／会社員／教師. Dòng ■ cuối trang: đi hỏi các bạn cùng lớp nước và nghề, rồi nhớ tên từng người — cô sẽ gọi bạn lên hỏi lại về một bạn khác.',
      [
        C('パクさんのお{国|くに}はどちらですか。', 'Paku-san no o-kuni wa dochira desu ka.', 'Park đến từ nước nào?'),
        S('{韓国|かんこく}です。', 'Kankoku desu.', 'Hàn Quốc.'),
        C('{木村|きむら}さんは{中国人|ちゅうごくじん}ですか。', 'Kimura-san wa Chūgokujin desu ka.', 'Kimura là người Trung Quốc à?'),
        S('いいえ、{中国人|ちゅうごくじん}じゃありません。{日本人|にほんじん}です。', 'Iie, Chūgokujin ja arimasen. Nihonjin desu.', 'Không, không phải người Trung Quốc. Là người Nhật.'),
        C('リンさんのお{仕事|しごと}は？', 'Rin-san no o-shigoto wa?', '(hỏi về bạn cùng lớp) Linh làm gì?'),
        S('{学生|がくせい}です。FPT{大学|だいがく}の{学生|がくせい}です。', 'Gakusei desu. Efu-pī-tī daigaku no gakusei desu.', 'Là sinh viên. Sinh viên Đại học FPT.'),
      ],
      [
        'Nghe mà thấy **じゃありません** thì đáp án KHÔNG phải từ đứng trước nó, mà là từ ở câu sau.',
        'Nói về người khác: **Tên + さん の お国は／お仕事は** (ポイント 4). Trả lời bỏ chủ ngữ cho gọn: 韓国です.',
        'Luyện nghe kiểu này: **Luyện nghe · Bài nghe 1–2**.',
      ],
    ),

    ...trang(
      'Trang 20–21 · チャレンジ! 私の誕生日',
      'Trang 20: tiệc chào mừng ở ký túc xá (phòng treo dây giấy và tấm biển 歓迎会 = tiệc chào đón). Một cô gái đứng lên, chắp tay, tự giới thiệu với ba người đang ngồi quanh bàn có cốc và bát bánh. Ô (1) gợi ý nội dung giới thiệu: tên, lá cờ (nước), trường tiếng Nhật あおぞら, và số **26** (tuổi). Trang 21: vẫn ở tiệc, cô gái cầm cốc nói chuyện với một anh tóc xoăn. Ô (2): hình bánh sinh nhật + dấu "?" và hai ngày 3/21, 10/4 — hỏi và so sánh ngày sinh. **Mục tiêu できる:** nói được tuổi của mình; nói và hỏi ngày sinh.',
      [
        C('{自己紹介|じこしょうかい}をしてください。', 'Jiko shōkai o shite kudasai.', 'Em hãy tự giới thiệu.'),
        S('はじめまして。ミンです。ベトナム{人|じん}です。FPT{大学|だいがく}の{学生|がくせい}です。{20歳|はたち}です。よろしくお{願|ねが}いします。', 'Hajimemashite. Min desu. Betonamu-jin desu. Efu-pī-tī daigaku no gakusei desu. Hatachi desu. Yoroshiku onegaishimasu.', 'Rất vui được gặp. Em là Minh, người Việt Nam, sinh viên ĐH FPT, 20 tuổi. Mong được giúp đỡ.'),
        C('（ô 1）この{人|ひと}は{何歳|なんさい}ですか。', '(ô 1) Kono hito wa nansai desu ka.', '(ô 1) Người này bao nhiêu tuổi?'),
        S('{26歳|にじゅうろくさい}です。', 'Nijūroku-sai desu.', '26 tuổi.'),
        C('ミンさんの{誕生日|たんじょうび}はいつですか。', 'Min-san no tanjōbi wa itsu desu ka.', 'Sinh nhật của Minh là khi nào?'),
        S('{3月|さんがつ}{15日|じゅうごにち}です。', 'Sangatsu jūgonichi desu.', 'Ngày 15 tháng 3.'),
        C('（ô 2 — chỉ 10/4）これは{何月何日|なんがつなんにち}ですか。', '(ô 2) Kore wa nangatsu nannichi desu ka.', '(chỉ 10/4) Đây là ngày mấy tháng mấy?'),
        S('{10月|じゅうがつ}{4日|よっか}です。', 'Jūgatsu yokka desu.', 'Ngày 4 tháng 10.'),
      ],
      [
        'Người Nhật viết **tháng/ngày**: 10/4 = **tháng 10 ngày 4**, KHÔNG phải 10 tháng 4 như tiếng Việt. Đây là lỗi hay gặp nhất của trang này.',
        'Tuổi đặc biệt: 1 **いっさい**, 8 **はっさい**, 10 **じゅっさい**, 20 **はたち**. Ngày đặc biệt: 4日 **よっか**, 14日 **じゅうよっか**, 20日 **はつか**, 24日 **にじゅうよっか**.',
        'Hỏi tuổi = **何歳ですか** (lịch sự hơn: おいくつですか); hỏi ngày sinh = **誕生日はいつですか** (ポイント 3).',
        'Xem **Ngữ pháp · ポイント 1, 3** và **Từ vựng · Chủ đề 2** (bảng tháng, ngày).',
      ],
    ),

    ...trang(
      'Trang 22 · 言ってみよう (chủ đề 2) — Tự giới thiệu có tuổi · Hỏi ngày sinh',
      '**Số 1:** tự giới thiệu dài một mạch: tên → nước → trường → tuổi → よろしく (tranh gợi ý giống ô 1 trang 20). **Số 2:** hỏi ngày sinh, tranh là bánh sinh nhật và các ngày: 例 10/4, ① 5/28, ② 7/14, ③ 4/20, ④ 9/10. Bạn đóng B, đọc ngày theo gợi ý. Trang này cô hay chỉ từng số ①–④ và bắt đọc nhanh.',
      [
        C('（②）{誕生日|たんじょうび}はいつですか。', '(2) Tanjōbi wa itsu desu ka.', '(chỉ ②) Sinh nhật là khi nào?'),
        S('{7月|しちがつ}{14日|じゅうよっか}です。', 'Shichigatsu jūyokka desu.', 'Ngày 14 tháng 7.'),
        C('③は？', 'San wa?', 'Còn ③?'),
        S('{4月|しがつ}{20日|はつか}です。', 'Shigatsu hatsuka desu.', 'Ngày 20 tháng 4.'),
        C('④は？', 'Yon wa?', 'Còn ④?'),
        S('{9月|くがつ}{10日|とおか}です。', 'Kugatsu tōka desu.', 'Ngày 10 tháng 9.'),
        C('リンさんの{誕生日|たんじょうび}は{何月何日|なんがつなんにち}ですか。', 'Rin-san no tanjōbi wa nangatsu nannichi desu ka.', 'Sinh nhật Linh là ngày mấy tháng mấy?'),
        S('{12月|じゅうにがつ}{1日|ついたち}です。', 'Jūnigatsu tsuitachi desu.', 'Ngày 1 tháng 12.'),
      ],
      [
        'Tháng đọc lệch: 4月 **しがつ**, 7月 **しちがつ**, 9月 **くがつ**. Ngày 1–10 đọc riêng (ついたち, ふつか, みっか, よっか, いつか, むいか, なのか, ようか, ここのか, とおか).',
        'Nghe "Aさんの誕生日は？" (bỏ いつですか) vẫn là hỏi ngày sinh — trả lời như thường.',
        'Xem **Từ vựng · Chủ đề 2** và **Bài tập** (phần đọc ngày).',
      ],
      [
        mau([
          E('はじめまして。{私|わたし}はミンです。ベトナム{人|じん}です。FPT{大学|だいがく}の{学生|がくせい}です。{20歳|はたち}です。よろしくお{願|ねが}いします。', 'Hajimemashite. Watashi wa Min desu. Betonamu-jin desu. Efu-pī-tī daigaku no gakusei desu. Hatachi desu. Yoroshiku onegaishimasu.', 'Số 1 — tự giới thiệu đủ 5 ý.'),
          E('{5月|ごがつ}{28日|にじゅうはちにち}です。', 'Gogatsu nijūhachinichi desu.', 'Số 2 ① — 5/28.'),
          E('{7月|しちがつ}{14日|じゅうよっか}です。', 'Shichigatsu jūyokka desu.', 'Số 2 ② — 7/14.'),
          E('{4月|しがつ}{20日|はつか}です。', 'Shigatsu hatsuka desu.', 'Số 2 ③ — 4/20.'),
          E('{9月|くがつ}{10日|とおか}です。', 'Kugatsu tōka desu.', 'Số 2 ④ — 9/10.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 23 · やってみよう (chủ đề 2) — Nghe tuổi, ngày sinh · Bảng cung hoàng đạo',
      'Hai bài nghe. **Bài 1:** ba người カルロス, ワン, 木村 tự giới thiệu — điền nước (Trung Quốc / Nhật / Brazil), nghề (học sinh / nhân viên công ty / giáo viên) và tuổi. **Bài 2:** nghe ngày sinh của マリヤム, アンナ, ダニエル, ナタポン và điền (tháng)(ngày). Cuối trang có **bảng 12 cung hoàng đạo** (星座 seiza) với khoảng ngày sinh — để vui: hỏi ngày sinh bạn rồi đoán cung. Hai dòng ■: tự giới thiệu trước lớp; đi hỏi ngày sinh các bạn và cô. Ở hoạt động này BẠN là người hỏi cô.',
      [
        S('{先生|せんせい}の{誕生日|たんじょうび}はいつですか。', 'Sensei no tanjōbi wa itsu desu ka.', '(bạn hỏi cô) Sinh nhật của cô là khi nào ạ?'),
        C('{11月|じゅういちがつ}{3日|みっか}です。', 'Jūichigatsu mikka desu.', 'Ngày 3 tháng 11.'),
        S('そうですか。', 'Sō desu ka.', 'Vậy ạ.'),
        C('カルロスさんのお{国|くに}はどちらですか。', 'Karurosu-san no o-kuni wa dochira desu ka.', 'Carlos đến từ nước nào?'),
        S('ブラジルです。', 'Burajiru desu.', 'Brazil.'),
        C('ミンさんは{何座|なにざ}ですか。', 'Min-san wa naniza desu ka.', '(vui) Minh cung gì?'),
        S('うお{座|ざ}です。', 'Uoza desu.', 'Cung Song Ngư ạ. (sinh 15/3)'),
      ],
      [
        'Hỏi cô: dùng **先生の～** — không gọi cô bằng tên + さん, không dùng あなた.',
        'Nghe tuổi: chờ tiếng **～さい**; nghe ngày: chờ **～がつ** rồi **～にち／～か**.',
        '星座 (cung hoàng đạo) không có trong đề thi — chỉ là từ thêm. Trọng tâm vẫn là **いつですか → ～月～日です**.',
        'Xem **Luyện nghe · Bài nghe 2–3**.',
      ],
    ),

    ...trang(
      'Trang 24–25 · チャレンジ! 私の趣味',
      'Trang 24: trong lớp học, một anh đeo kính ngồi vắt vẻo trên bàn, khoanh tay cười. Ô (1): một người hỏi "趣味?" — người kia có bong bóng quả bóng đá. Ô (2): hỏi sở thích một anh — anh ấy nghĩ tới vali (du lịch) và rạp chiếu phim (hai sở thích). Trang 25: ba bạn ngồi nói chuyện; ô (3): anh đeo kính được hỏi sở thích, bong bóng là bát, dao thớt (nấu ăn) kèm dấu "!" — bạn nữ ngạc nhiên / thích thú. **Mục tiêu できる:** nói và hỏi sở thích; nói được "tôi cũng vậy".',
      [
        C('ミンさんの{趣味|しゅみ}は{何|なん}ですか。', 'Min-san no shumi wa nan desu ka.', 'Sở thích của Minh là gì?'),
        S('サッカーです。', 'Sakkā desu.', 'Bóng đá ạ.'),
        C('（ô 2）この{人|ひと}の{趣味|しゅみ}は{何|なん}ですか。', '(ô 2) Kono hito no shumi wa nan desu ka.', '(ô 2) Sở thích của người này là gì?'),
        S('{旅行|りょこう}と{映画|えいが}です。', 'Ryokō to eiga desu.', 'Du lịch và xem phim.'),
        C('{私|わたし}の{趣味|しゅみ}は{料理|りょうり}です。', 'Watashi no shumi wa ryōri desu.', 'Sở thích của cô là nấu ăn.'),
        S('あっ、{私|わたし}の{趣味|しゅみ}も{料理|りょうり}です。', 'A, watashi no shumi mo ryōri desu.', 'Ồ, sở thích của em cũng là nấu ăn.'),
        C('ミンさんの{趣味|しゅみ}はテニスですか。', 'Min-san no shumi wa tenisu desu ka.', 'Sở thích của Minh là tennis à?'),
        S('いいえ、テニスじゃありません。サッカーと{音楽|おんがく}です。', 'Iie, tenisu ja arimasen. Sakkā to ongaku desu.', 'Không, không phải tennis. Là bóng đá và âm nhạc.'),
      ],
      [
        '**ポイント 3** (何 — trước です đọc **なん**), **ポイント 5** (N1 **と** N2 = và, nối 2 danh từ), **ポイント 6** (**も** = cũng, thay cho は).',
        'Muốn nói "tôi cũng vậy": đổi **は** thành **も** — 私の趣味**も**料理です. Không nói 私の趣味もは.',
        'Xem **Hội thoại · mục 3** và **Ngữ pháp · ポイント 5, 6**.',
      ],
    ),

    ...trang(
      'Trang 26 · 言ってみよう (chủ đề 3) — Hỏi sở thích · "tôi cũng…"',
      '**Số 1/2:** hỏi sở thích; nhánh 例1 một sở thích (tranh cậu bé đá bóng), 例2 hai sở thích nối bằng と (tranh người đọc sách + hai người xem phim). Gợi ý: ① người đeo tai nghe có nốt nhạc (âm nhạc), ② vợt và bóng tennis, ③ vali kéo + bát và thớt (du lịch và nấu ăn). **Số 3:** sở thích giống nhau → dùng も: 例 tennis, ① người bơi (bơi lội), ② người chống cằm đọc sách (đọc sách), ③ tai nghe (âm nhạc), ④ hai người xem màn hình (xem phim).',
      [
        C('（①）{趣味|しゅみ}は{何|なん}ですか。', '(1) Shumi wa nan desu ka.', '(chỉ ①) Sở thích là gì?'),
        S('{音楽|おんがく}です。', 'Ongaku desu.', 'Âm nhạc.'),
        C('（③）は？', '(3) wa?', 'Còn ③?'),
        S('{旅行|りょこう}と{料理|りょうり}です。', 'Ryokō to ryōri desu.', 'Du lịch và nấu ăn.'),
        C('{私|わたし}の{趣味|しゅみ}は{水泳|すいえい}です。', 'Watashi no shumi wa suiei desu.', 'Sở thích của cô là bơi.'),
        S('あ、{私|わたし}の{趣味|しゅみ}も{水泳|すいえい}です。', 'A, watashi no shumi mo suiei desu.', 'A, sở thích của em cũng là bơi.'),
      ],
      [
        'Tranh có HAI thứ ⇒ phải nói đủ hai, nối bằng **と**. Nói thiếu một thứ là mất ý.',
        'Trả lời có thể nói đủ (**私の趣味は**テニスです) hoặc gọn (テニスです) — cả hai đều đúng.',
        'Xem **Ngữ pháp · ポイント 5, 6** và **Từ vựng · Chủ đề 3**.',
      ],
      [
        mau([
          E('サッカーです。', 'Sakkā desu.', 'Số 1/2 例1 — bóng đá.'),
          E('{読書|どくしょ}と{映画|えいが}です。', 'Dokusho to eiga desu.', 'Số 1/2 例2 — đọc sách và phim.'),
          E('{音楽|おんがく}です。', 'Ongaku desu.', 'Số 1/2 ① — âm nhạc.'),
          E('テニスです。', 'Tenisu desu.', 'Số 1/2 ② — tennis.'),
          E('{旅行|りょこう}と{料理|りょうり}です。', 'Ryokō to ryōri desu.', 'Số 1/2 ③ — du lịch và nấu ăn.'),
          E('あ、{私|わたし}の{趣味|しゅみ}も{水泳|すいえい}です。', 'A, watashi no shumi mo suiei desu.', 'Số 3 ① — bơi lội (tôi cũng vậy).'),
          E('あ、{私|わたし}の{趣味|しゅみ}も{読書|どくしょ}です。', 'A, watashi no shumi mo dokusho desu.', 'Số 3 ② — đọc sách.'),
          E('あ、{私|わたし}の{趣味|しゅみ}も{音楽|おんがく}です。', 'A, watashi no shumi mo ongaku desu.', 'Số 3 ③ — âm nhạc.'),
          E('あ、{私|わたし}の{趣味|しゅみ}も{映画|えいが}です。', 'A, watashi no shumi mo eiga desu.', 'Số 3 ④ — xem phim.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 27 · やってみよう (chủ đề 3) — Nghe sở thích',
      'Nghe CD hai cặp (パク – カルロス, アンナ – マルコ) nói về sở thích, rồi chọn tranh a–g: vali (du lịch), tai nghe (âm nhạc), hai người xem màn hình (phim), bát và thớt (nấu ăn), người bơi (bơi lội), cậu bé đá bóng (bóng đá), người đọc sách (đọc sách). Chú ý: một người có thể có HAI sở thích (nghe と), và câu có も nghĩa là người thứ hai giống người thứ nhất. Dòng ■: hỏi sở thích các bạn và cô — trong lớp có ai cùng sở thích với bạn không?',
      [
        S('{先生|せんせい}の{趣味|しゅみ}は{何|なん}ですか。', 'Sensei no shumi wa nan desu ka.', '(bạn hỏi cô) Sở thích của cô là gì ạ?'),
        C('{読書|どくしょ}です。', 'Dokusho desu.', 'Đọc sách.'),
        S('あっ、{私|わたし}の{趣味|しゅみ}も{読書|どくしょ}です。', 'A, watashi no shumi mo dokusho desu.', 'Ồ, sở thích của em cũng là đọc sách.'),
        C('パクさんの{趣味|しゅみ}は{何|なん}ですか。', 'Paku-san no shumi wa nan desu ka.', 'Sở thích của Park là gì?'),
        S('{旅行|りょこう}と{映画|えいが}です。', 'Ryokō to eiga desu.', 'Du lịch và xem phim.'),
        C('リンさんの{趣味|しゅみ}もサッカーですか。', 'Rin-san no shumi mo sakkā desu ka.', 'Sở thích của Linh cũng là bóng đá à?'),
        S('いいえ、サッカーじゃありません。{水泳|すいえい}です。', 'Iie, sakkā ja arimasen. Suiei desu.', 'Không, không phải bóng đá. Là bơi lội.'),
      ],
      [
        'Nghe **も** ⇒ đáp án của người sau GIỐNG người trước — đừng để trống.',
        'Câu hỏi có も (～の趣味も…ですか) vẫn trả lời bằng はい／いいえ như thường.',
        'Xem **Luyện nghe · Bài nghe 4**.',
      ],
    ),

    ...trang(
      'Trang 28 · できる! — Kết bạn rồi giới thiệu bạn mới',
      'Nhiệm vụ tổng hợp cả bài, không có tranh, để trống chỗ ghi chép: đi hỏi nhiều người về nước, công việc, sở thích… để làm quen; sau đó cho biết bạn đã hỏi ai và **giới thiệu người đó cho người khác**. Cách làm: (1) chào + hỏi tên; (2) hỏi お国, お仕事, 誕生日, 趣味 và ghi lại; (3) đứng lên nói về người đó bằng câu "(Tên)さんは…です". Cô sẽ chỉ vào một bạn và hỏi bạn về người đó.',
      [
        C('この{人|ひと}はだれですか。', 'Kono hito wa dare desu ka.', '(chỉ bạn bạn vừa phỏng vấn) Người này là ai?'),
        S('リンさんです。', 'Rin-san desu.', 'Là bạn Linh.'),
        C('リンさんのお{国|くに}は？', 'Rin-san no o-kuni wa?', 'Nước của Linh?'),
        S('ベトナムです。', 'Betonamu desu.', 'Việt Nam.'),
        C('お{仕事|しごと}は？', 'O-shigoto wa?', 'Công việc?'),
        S('{学生|がくせい}です。FPT{大学|だいがく}の{学生|がくせい}です。', 'Gakusei desu. Efu-pī-tī daigaku no gakusei desu.', 'Sinh viên. Sinh viên ĐH FPT.'),
        C('リンさんの{趣味|しゅみ}は{何|なん}ですか。', 'Rin-san no shumi wa nan desu ka.', 'Sở thích của Linh là gì?'),
        S('{音楽|おんがく}と{映画|えいが}です。', 'Ongaku to eiga desu.', 'Âm nhạc và phim.'),
      ],
      [
        'Giới thiệu người khác = giống tự giới thiệu, chỉ đổi 私は thành **(Tên)さんは**; không dùng はじめまして cho người khác.',
        'Dùng hết ポイント 1–6 trong một đoạn: は・です・じゃありません・の・と・も.',
        'Xem **Hội thoại · できる！** và **Luyện nói · Câu hỏi có tranh (thẻ nhân vật)**.',
      ],
      [
        mau([
          E('リンさんはベトナム{人|じん}です。FPT{大学|だいがく}の{学生|がくせい}です。{19歳|じゅうきゅうさい}です。{趣味|しゅみ}は{音楽|おんがく}と{映画|えいが}です。', 'Rin-san wa Betonamu-jin desu. Efu-pī-tī daigaku no gakusei desu. Jūkyū-sai desu. Shumi wa ongaku to eiga desu.', 'Mẫu giới thiệu một bạn mới quen cho cả lớp.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 28 · 話読聞書「自己紹介」 — Đoạn tự giới thiệu viết',
      'Ô 話読聞書 (Nói–Đọc–Nghe–Viết) có một đoạn tự giới thiệu ngắn của パク: tên, nước, trường, tuổi, sở thích, lời chào cuối. Bên cạnh có ba bong bóng gợi ý câu hỏi: tên, **biệt danh** (ニックネーム), sở thích. Nhiệm vụ: đọc to đoạn mẫu, rồi **viết đoạn của chính bạn** theo cùng thứ tự và đọc trước lớp. Đây cũng chính là dạng bài **Reading 40 điểm** trong thi nói JPD113.',
      [
        C('ミンさんのニックネームは{何|なん}ですか。', 'Min-san no nikkunēmu wa nan desu ka.', 'Biệt danh của Minh là gì?'),
        S('「ミンミン」です。', '"Minmin" desu.', 'Là "Minmin" ạ.'),
        C('{自己紹介|じこしょうかい}を{読|よ}んでください。', 'Jiko shōkai o yonde kudasai.', 'Em đọc bài tự giới thiệu của em đi.'),
        S('はじめまして。{私|わたし}はミンです。ベトナム{人|じん}です。FPT{大学|だいがく}の{学生|がくせい}です。{20歳|はたち}です。{趣味|しゅみ}はサッカーと{音楽|おんがく}です。どうぞよろしくお{願|ねが}いします。', 'Hajimemashite. Watashi wa Min desu. Betonamu-jin desu. Efu-pī-tī daigaku no gakusei desu. Hatachi desu. Shumi wa sakkā to ongaku desu. Dōzo yoroshiku onegaishimasu.', 'Rất vui được gặp. Tôi là Minh, người Việt Nam, sinh viên ĐH FPT, 20 tuổi. Sở thích là bóng đá và âm nhạc. Rất mong được giúp đỡ.'),
      ],
      [
        'Thứ tự chuẩn 6 câu: **はじめまして → 名前 → 国(人) → 学校/仕事 → 歳 → 趣味 → よろしく**. Học thuộc thứ tự này là không bao giờ bí.',
        'Đọc to: は trong 私**は**, 趣味**は** đọc **wa**; 学生 đọc **がくせい** (gakusei, chữ u gần như câm).',
        'Xem **Luyện nói · 自己紹介 — bài mẫu** và **Luyện nói · Đọc to**.',
      ],
    ),

    { t: 'h', text: 'Trang 29 · ことば — Từ vựng của bài' },
    {
      t: 'p',
      text: 'Trang liệt kê từ mới theo 3 chủ đề nhỏ (tên–nước–nghề, ngày sinh, sở thích). Không có tranh, cô thường chỉ gọi đọc từ hoặc hỏi nghĩa. Toàn bộ từ trang này (và danh sách cô phát) đã có đủ nghĩa, romaji, câu ví dụ ở mục **Từ vựng** của Bài 1 — xem ở đó.',
    },
    { t: 'note', title: 'Mẹo', items: ['Cô hỏi "～は日本語で何ですか" (… tiếng Nhật là gì) thì trả lời **「từ」です** — mẫu này học kỹ ở Bài 2 (ポイント 15).', 'Xem **Từ vựng · Bài 1** và **Chữ Hán · Bài 1**.'] },

    ...trang(
      'Trang 30 · もう一度聞こう — Nghe lại cả bài',
      'Đây là bài nghe đã nghe ở trang 15, giờ nghe lại khi đã học xong. Nội dung: パク chào カルロス, hai người tự giới thiệu; パク hỏi nước của カルロス (Brazil) và hỏi anh có phải sinh viên không (không — nhân viên công ty); カルロス hỏi lại, パク là học sinh trường tiếng Nhật あおぞら; cuối cùng nói về sở thích và phát hiện cả hai cùng thích một thứ. Cụm mới ở cuối trang: わあ、同じですね (Wā, onaji desu ne — Ồ, giống nhau nhỉ). Cô sẽ hỏi lại các sự kiện trong đoạn hội thoại.',
      [
        C('カルロスさんのお{国|くに}はどちらですか。', 'Karurosu-san no o-kuni wa dochira desu ka.', 'Carlos đến từ nước nào?'),
        S('ブラジルです。', 'Burajiru desu.', 'Brazil.'),
        C('カルロスさんは{学生|がくせい}ですか。', 'Karurosu-san wa gakusei desu ka.', 'Carlos là sinh viên à?'),
        S('いいえ、{学生|がくせい}じゃありません。{会社員|かいしゃいん}です。', 'Iie, gakusei ja arimasen. Kaishain desu.', 'Không, không phải sinh viên. Là nhân viên công ty.'),
        C('パクさんはどこの{学生|がくせい}ですか。', 'Paku-san wa doko no gakusei desu ka.', 'Park là học sinh của trường nào?'),
        S('あおぞら{日本語学校|にほんごがっこう}の{学生|がくせい}です。', 'Aozora nihongo gakkō no gakusei desu.', 'Học sinh trường tiếng Nhật Aozora.'),
        C('パクさんの{趣味|しゅみ}は{何|なん}ですか。', 'Paku-san no shumi wa nan desu ka.', 'Sở thích của Park là gì?'),
        S('{旅行|りょこう}と{映画|えいが}です。', 'Ryokō to eiga desu.', 'Du lịch và xem phim.'),
        C('カルロスさんの{趣味|しゅみ}も{映画|えいが}ですか。', 'Karurosu-san no shumi mo eiga desu ka.', 'Sở thích của Carlos cũng là phim à?'),
        S('はい、カルロスさんの{趣味|しゅみ}も{映画|えいが}です。', 'Hai, Karurosu-san no shumi mo eiga desu.', 'Vâng, sở thích của Carlos cũng là xem phim.'),
      ],
      [
        '**どこの学生ですか** = học ở trường nào (ポイント 13, Bài 2) — nhưng nằm trong đề thi Lesson 1 ("どこのきょうしですか"). Trả lời: **Tên trường + の + 学生/教師です**.',
        'Câu hỏi có/không: đề thi trừ tới 5 điểm nếu quên はい／いいえ.',
        'Xem **Luyện nghe · Bài nghe 5 (hội thoại dài)** và **Luyện nói · Câu hỏi không tranh**.',
      ],
    ),

    { t: 'h', text: 'Cô hỏi — bạn trả lời: ghép nhanh câu trả lời' },
    {
      t: 'build',
      id: 'b1-sach-ghep',
      title: 'Nghe câu hỏi (tiếng Việt) → ghép câu trả lời tiếng Nhật',
      items: [
        { vi: 'Cô hỏi お国はどちらですか → "Việt Nam ạ."', chips: ['ベトナム', 'です。', 'ベトナム人', 'は'], answer: ['ベトナム', 'です。'], ro: 'Betonamu desu.' },
        { vi: 'Cô hỏi 会社員ですか → "Không, em không phải nhân viên công ty. Em là sinh viên."', chips: ['いいえ、', '{会社員|かいしゃいん}', 'じゃありません。', '{学生|がくせい}です。', 'はい、'], answer: ['いいえ、', '{会社員|かいしゃいん}', 'じゃありません。', '{学生|がくせい}です。'], ro: 'Iie, kaishain ja arimasen. Gakusei desu.' },
        { vi: 'Cô hỏi お仕事は？ → "Em là sinh viên Đại học FPT."', chips: ['FPT{大学|だいがく}の', '{学生|がくせい}です。', '{学生|がくせい}の', 'と'], answer: ['FPT{大学|だいがく}の', '{学生|がくせい}です。'], ro: 'Efu-pī-tī daigaku no gakusei desu.' },
        { vi: 'Cô hỏi 何歳ですか → "Em 20 tuổi."', chips: ['{20歳|はたち}', 'です。', 'いつ', 'の'], answer: ['{20歳|はたち}', 'です。'], ro: 'Hatachi desu.' },
        { vi: 'Cô hỏi 誕生日はいつですか → "Ngày 4 tháng 10."', chips: ['{10月|じゅうがつ}', '{4日|よっか}', 'です。', '{4月|しがつ}', '{10日|とおか}'], answer: ['{10月|じゅうがつ}', '{4日|よっか}', 'です。'], ro: 'Jūgatsu yokka desu.' },
        { vi: 'Cô hỏi 趣味は何ですか → "Sở thích của em là du lịch và nấu ăn."', chips: ['{私|わたし}の', '{趣味|しゅみ}は', '{旅行|りょこう}と', '{料理|りょうり}です。', 'も'], answer: ['{私|わたし}の', '{趣味|しゅみ}は', '{旅行|りょこう}と', '{料理|りょうり}です。'], ro: 'Watashi no shumi wa ryokō to ryōri desu.' },
        { vi: 'Cô nói "Sở thích của cô là tennis" → "Ồ, sở thích của em cũng là tennis."', chips: ['あっ、', '{私|わたし}の', '{趣味|しゅみ}も', 'テニスです。', '{趣味|しゅみ}は'], answer: ['あっ、', '{私|わたし}の', '{趣味|しゅみ}も', 'テニスです。'], ro: 'A, watashi no shumi mo tenisu desu.' },
        { vi: 'Cô chỉ tranh hỏi だれですか → "Là anh Carlos. Nhân viên công ty ABE."', chips: ['カルロスさんです。', 'ABEの', '{社員|しゃいん}です。', '{会社員|かいしゃいん}の'], answer: ['カルロスさんです。', 'ABEの', '{社員|しゃいん}です。'], ro: 'Karurosu-san desu. Ē-bī-ī no shain desu.' },
      ],
    },
  ],
};

/* ══════════════════════════ BÀI 2 — 買い物・食事 ══════════════════════════ */

const SACH_2: Lesson = {
  id: 'b2-sach',
  kind: 'review',
  title: 'Theo sách — Bài 2 (trang 31–46)',
  goal: 'Nhìn tranh toà nhà, cửa hàng, thực đơn trong sách là hỏi–đáp được tầng, chỗ, giá, món, xuất xứ và đồ của ai.',
  minutes: 55,
  blocks: [
    CACH_DUNG,

    ...trang(
      'Trang 31 · 話してみよう・聞いてみよう — Mở bài 買い物・食事',
      '**話してみよう** — 4 tranh không lời: (1) hai phụ nữ trong siêu thị, một người xách giỏ, đang chọn đồ hộp trên kệ; (2) cận cảnh thẻ tín dụng, mấy tờ tiền giấy Nhật và tiền xu; (3) quầy thu ngân cửa hàng tiện lợi, nhân viên đưa chai nước cho một anh xách cặp, bên cạnh là đồng nghiệp; (4) quầy bánh/đồ ăn sẵn có nhãn giá nhỏ trước từng món, một phụ nữ chỉ tay chọn món. Mục đích: nói chuyện mua sắm, tiền ở Nhật, đi ăn. **聞いてみよう**: nghe trước cả đoạn hội thoại của bài (パク hỏi quầy thông tin → mua điện thoại → đi ăn nhà hàng), chính là trang 46.',
      [
        C('（tranh 1）ここはどこですか。', '(tranh 1) Koko wa doko desu ka.', '(tranh 1) Đây là đâu?'),
        S('スーパーです。', 'Sūpā desu.', 'Là siêu thị.'),
        C('（tranh 3）ここは{何|なん}ですか。', '(tranh 3) Koko wa nan desu ka.', '(tranh 3) Chỗ này là gì?'),
        S('レジです。', 'Reji desu.', 'Là quầy tính tiền.'),
        C('（tranh 2）これは{何|なん}ですか。', '(tranh 2) Kore wa nan desu ka.', '(tranh 2) Đây là gì?'),
        S('{日本|にほん}のお{金|かね}です。', 'Nihon no okane desu.', 'Là tiền Nhật.'),
        C('（tranh 4, chỉ nhãn giá）これはいくらですか。', '(tranh 4) Kore wa ikura desu ka.', '(tranh 4) Món này bao nhiêu tiền?'),
        S('{300円|さんびゃくえん}です。', 'Sanbyaku-en desu.', '300 yên. (đọc số trên nhãn cô chỉ)'),
      ],
      [
        '**ここ** = chỗ này (ポイント 9), **これ** = cái này (ポイント 7), **いくら** = bao nhiêu tiền (ポイント 11).',
        'Đọc giá: số + **えん**. Số khó: 300 **さんびゃく**, 600 **ろっぴゃく**, 800 **はっぴゃく**, 3,000 **さんぜん**, 8,000 **はっせん**, 10,000 **いちまん**.',
        'Xem **Ngữ pháp · Số đếm & đọc giá tiền**.',
      ],
    ),

    ...trang(
      'Trang 32–33 · チャレンジ! どこですか',
      'Hai trang là **mặt cắt một toà nhà mua sắm** tên ニコニコショッピングビル, nhìn xuyên qua từng tầng: trên cùng là nhà hàng Ý và thang cuốn; tầng điện máy サカイ (TV, tủ lạnh, máy tính); tầng đồ đồng giá 100 yên (bát đĩa); tầng quần áo giảm giá, giày, túi; tầng trệt có quầy thông tin với nhân viên nữ, máy ATM, bàn cà phê; tầng hầm là siêu thị. Các ô: (1) khách hỏi quầy thông tin điện máy サカイ ở tầng mấy → nhân viên đáp "4F"; (2-1) khách hỏi một người qua đường thang cuốn ở đâu → người kia chỉ tay; (2-2) trong cửa hàng điện máy, khách hỏi nhân viên máy ảnh ở đâu → nhân viên chỉ vào tủ kính. **Mục tiêu できる:** hỏi được thứ mình muốn mua nằm ở đâu.',
      [
        C('ここはどこですか。', 'Koko wa doko desu ka.', '(chỉ quầy ở tầng trệt) Đây là đâu?'),
        S('インフォメーションです。', 'Infomēshon desu.', 'Là quầy thông tin.'),
        C('サカイ{電器|でんき}は{何階|なんがい}ですか。', 'Sakai denki wa nangai desu ka.', 'Điện máy Sakai ở tầng mấy?'),
        S('{4階|よんかい}です。', 'Yonkai desu.', 'Tầng 4.'),
        C('（ô 2-1）エスカレーターはどこですか。', '(ô 2-1) Esukarētā wa doko desu ka.', '(ô 2-1) Thang cuốn ở đâu?'),
        S('あそこです。', 'Asoko desu.', 'Ở đằng kia. (chỉ tay)'),
        C('（ô 2-2）カメラはどこですか。', '(ô 2-2) Kamera wa doko desu ka.', '(ô 2-2) Máy ảnh ở đâu?'),
        S('こちらです。', 'Kochira desu.', '(đóng vai nhân viên) Ở phía này ạ.'),
      ],
      [
        '**ポイント 9**: ここ／そこ／あそこ／どこ — bản lịch sự (nhân viên hay dùng): **こちら／そちら／あちら／どちら**.',
        'Chọn từ theo khoảng cách: gần BẠN → ここ; gần CÔ → そこ; xa cả hai → あそこ. Khi trả lời hãy chỉ tay theo.',
        '**何階** đọc **なんがい**; 3階 **さんがい**; 1階 **いっかい**; 4階 **よんかい**.',
        'Xem **Hội thoại · Tình huống 1** và **Ngữ pháp · ポイント 9**.',
      ],
    ),

    ...trang(
      'Trang 34–35 · 言ってみよう (chủ đề 1) — Tầng mấy · Ở đâu',
      '**Số 1:** hỏi quầy thông tin cửa hàng ở tầng mấy, dùng **bảng sơ đồ tầng** (mỗi tầng vẽ hình hàng hoá): 5階 nhà hàng + WC; 4階 điện máy サカイ; 3階 shop 100 yên; 2階 giày, quần áo; 1階 cà phê, bánh, ATM, WC; 地下1階 siêu thị. Gợi ý: 例 shop 100 yên, ① siêu thị, ② tiệm giày, ③ tiệm bánh kem, ④ điện máy サカイ. **Số 2-1:** hỏi người qua đường chỗ nào đó ở đâu (tranh đông người trong toà nhà): 例 thang cuốn, ① WC, ② ATM, ③ quầy thông tin, ④ quán cà phê. **Số 2-2:** trong cửa hàng điện máy hỏi nhân viên món hàng ở đâu: 例 điện thoại di động, ① máy ảnh, ② máy tính, ③ từ điển điện tử.',
      [
        C('スーパーは{何階|なんがい}ですか。', 'Sūpā wa nangai desu ka.', 'Siêu thị ở tầng mấy?'),
        S('{地下|ちか}{1階|いっかい}です。', 'Chika ikkai desu.', 'Tầng hầm 1.'),
        C('ケーキ{屋|や}は{2階|にかい}ですか。', 'Kēki-ya wa nikai desu ka.', 'Tiệm bánh kem ở tầng 2 à?'),
        S('いいえ、{2階|にかい}じゃありません。{1階|いっかい}です。', 'Iie, nikai ja arimasen. Ikkai desu.', 'Không, không phải tầng 2. Tầng 1.'),
        C('レストランは{何階|なんがい}ですか。', 'Resutoran wa nangai desu ka.', 'Nhà hàng ở tầng mấy?'),
        S('{5階|ごかい}です。', 'Gokai desu.', 'Tầng 5.'),
        C('トイレはどこですか。', 'Toire wa doko desu ka.', 'Nhà vệ sinh ở đâu?'),
        S('{1階|いっかい}と{5階|ごかい}です。', 'Ikkai to gokai desu.', 'Ở tầng 1 và tầng 5.'),
      ],
      [
        'Đề thi JPD113 Bài 2 có đúng câu hỏi tranh sơ đồ tầng: **スーパーはどこですか／百円ショップは三階ですか／くつやは何階ですか／トイレはどこですか** — luyện kỹ trang này.',
        'Câu hỏi "…は三階ですか" là câu có/không ⇒ phải **はい／いいえ** trước.',
        'Hỏi người lạ mở đầu bằng **あのう、すみません**; cảm ơn: **どうもありがとうございます**.',
        'Xem **Luyện nói · Câu hỏi CÓ tranh** và **Luyện nghe · Bài 1–2**.',
      ],
      [
        mau([
          E('すみません、スーパーは{何階|なんがい}ですか。— {地下|ちか}{1階|いっかい}です。', 'Sumimasen, sūpā wa nangai desu ka. — Chika ikkai desu.', 'Số 1 ① — siêu thị: tầng hầm 1.'),
          E('{靴屋|くつや}は{何階|なんがい}ですか。— {2階|にかい}です。', 'Kutsuya wa nangai desu ka. — Nikai desu.', 'Số 1 ② — tiệm giày: tầng 2.'),
          E('ケーキ{屋|や}は{何階|なんがい}ですか。— {1階|いっかい}です。', 'Kēki-ya wa nangai desu ka. — Ikkai desu.', 'Số 1 ③ — tiệm bánh kem: tầng 1.'),
          E('サカイ{電器|でんき}は{何階|なんがい}ですか。— {4階|よんかい}です。', 'Sakai denki wa nangai desu ka. — Yonkai desu.', 'Số 1 ④ — điện máy Sakai: tầng 4.'),
          E('あのう、すみません。トイレはどこですか。— トイレですか。あそこですよ。', 'Anō, sumimasen. Toire wa doko desu ka. — Toire desu ka. Asoko desu yo.', 'Số 2-1 ① — WC (tương tự ② ATM, ③ インフォメーション, ④ {喫茶店|きっさてん}).'),
          E('すみません、カメラはどこですか。— カメラはこちらです。', 'Sumimasen, kamera wa doko desu ka. — Kamera wa kochira desu.', 'Số 2-2 ① — máy ảnh (tương tự ② パソコン, ③ {電子辞書|でんしじしょ}).'),
        ]),
      ],
    ),

    ...trang(
      'Trang 35 · やってみよう・ロールプレイ (chủ đề 1)',
      '**やってみよう:** nghe CD, trả lời "từ điển điện tử ở tầng mấy, chỗ nào trong tầng" — chọn tầng trên bảng (5F…B1) và chọn 1 trong 3 tranh vị trí (hộp trên kệ / chỗ anh nhân viên chỉ vào máy tính / kệ trưng bày cạnh nhân viên nữ). Nghe hai thông tin: **～階** và **こちら／そちら／あちら**. **ロールプレイ** ba vai: A là khách — hỏi quầy lễ tân cửa hàng ở đâu, rồi vào cửa hàng hỏi món hàng ở đâu; B là lễ tân toà nhà; C là nhân viên cửa hàng. Trong lớp cô thường đóng B và C, bạn đóng A.',
      [
        C('いらっしゃいませ。', 'Irasshaimase.', '(lễ tân) Xin chào quý khách.'),
        S('すみません、{電子辞書|でんしじしょ}は{何階|なんがい}ですか。', 'Sumimasen, denshi jisho wa nangai desu ka.', 'Xin lỗi, từ điển điện tử ở tầng mấy ạ?'),
        C('{4階|よんかい}です。', 'Yonkai desu.', 'Tầng 4.'),
        S('ありがとうございます。', 'Arigatō gozaimasu.', 'Cảm ơn ạ.'),
        C('（nhân viên tầng 4）いらっしゃいませ。', 'Irasshaimase.', '(nhân viên tầng 4) Xin chào quý khách.'),
        S('あのう、{電子辞書|でんしじしょ}はどこですか。', 'Anō, denshi jisho wa doko desu ka.', 'Dạ, từ điển điện tử ở đâu ạ?'),
        C('{電子辞書|でんしじしょ}はあちらです。', 'Denshi jisho wa achira desu.', 'Từ điển điện tử ở đằng kia ạ.'),
        S('どうもありがとうございます。', 'Dōmo arigatō gozaimasu.', 'Cảm ơn nhiều ạ.'),
      ],
      [
        'Hai bước hỏi: ở quầy thông tin hỏi **何階ですか**, vào cửa hàng hỏi **どこですか**.',
        'Nhân viên nói **いらっしゃいませ** thì khách KHÔNG đáp lại câu đó — chỉ cần nói すみません rồi hỏi.',
        'Xem **Luyện nói · Đóng vai** và **Luyện nghe · Bài 2**.',
      ],
    ),

    ...trang(
      'Trang 36–37 · チャレンジ! いくらですか',
      'Trang 36: cửa hàng quần áo treo biển SALE, giảm 20%. Một nhân viên nữ tóc dài đưa chiếc áo trên móc cho một khách nữ tóc ngắn xem. Ô (1): khách nghĩ "¥?" về món đang cầm → nhân viên đáp ¥4,000; ô (2): khách chỉ món trên ma-nơ-canh hỏi giá → ¥3,000. Trang 37: khách nữ ướm chiếc áo phông in ba ngôi sao lớn, nhân viên nam cầm chiếc quần dài; phía sau có quầy thu ngân. Ô (3): khách đưa tiền, nhân viên cúi chào — mua xong. **Mục tiêu できる:** hỏi được giá thứ muốn mua (và mua nó).',
      [
        C('（ô 1）これはいくらですか。', '(ô 1) Kore wa ikura desu ka.', '(ô 1) Cái này bao nhiêu tiền?'),
        S('{4,000円|よんせんえん}です。', 'Yonsen-en desu.', '4.000 yên.'),
        C('（ô 2）あれはいくらですか。', '(ô 2) Are wa ikura desu ka.', '(ô 2, món trên ma-nơ-canh ở xa) Cái kia bao nhiêu tiền?'),
        S('{3,000円|さんぜんえん}です。', 'Sanzen-en desu.', '3.000 yên.'),
        C('いらっしゃいませ。', 'Irasshaimase.', '(cô đóng nhân viên) Xin chào quý khách.'),
        S('すみません、このTシャツはいくらですか。', 'Sumimasen, kono T-shatsu wa ikura desu ka.', 'Xin lỗi, cái áo phông này bao nhiêu tiền?'),
        C('{2,500円|にせんごひゃくえん}です。', 'Nisen gohyaku-en desu.', '2.500 yên.'),
        S('じゃ、これをください。', 'Ja, kore o kudasai.', 'Vậy cho tôi cái này.'),
      ],
      [
        '**ポイント 7** これ／それ／あれ (đứng một mình), **ポイント 8** この／その／あの + danh từ, **ポイント 10** ～をください, **ポイント 11** いくら.',
        'Món trong tay BẠN → これ／この; món trong tay CÔ (nhân viên) → それ／その; món ở xa → あれ／あの. Khi khách nói これ thì nhân viên đáp bằng それ.',
        'Xem **Hội thoại · Tình huống 2** và **Ngữ pháp · ポイント 7, 8, 10, 11**.',
      ],
    ),

    ...trang(
      'Trang 38 · 言ってみよう (chủ đề 2) — これはいくら・このTシャツはいくら・それをください',
      '**Số 1:** tranh quầy túi xách, quần áo, mỗi món có một số ①–⑤ gắn vào và nhãn giá — bạn chỉ vào món, hỏi "cái này bao nhiêu", nhân viên đọc giá (例 là chiếc túi ¥3,000). **Số 2:** hỏi bằng この + tên món: 例 áo phông, rồi túi xách, áo trên kệ, quần trên ma-nơ-canh, mũ/túi. **Số 3:** so sánh hai món rồi chọn mua: hỏi giá món mình cầm (この…), hỏi giá món nhân viên cầm (その…), rồi quyết định **じゃ、それをください**. Giá ở câu mẫu dưới đây là giá ví dụ — trong lớp hãy đọc đúng số trên nhãn trong tranh.',
      [
        C('いらっしゃいませ。', 'Irasshaimase.', 'Xin chào quý khách.'),
        S('すみません。このかばんはいくらですか。', 'Sumimasen. Kono kaban wa ikura desu ka.', 'Xin lỗi, cái túi này bao nhiêu tiền?'),
        C('{5,000円|ごせんえん}です。', 'Gosen-en desu.', '5.000 yên.'),
        S('そうですか。そのかばんはいくらですか。', 'Sō desu ka. Sono kaban wa ikura desu ka.', 'Vậy à. Còn cái túi đó bao nhiêu?'),
        C('{3,800円|さんぜんはっぴゃくえん}です。', 'Sanzen happyaku-en desu.', '3.800 yên.'),
        S('じゃ、それをください。', 'Ja, sore o kudasai.', 'Vậy cho tôi cái đó.'),
      ],
      [
        'Sau **この／その／あの** BẮT BUỘC có danh từ (このかばん); sau **これ／それ／あれ** thì KHÔNG (これは…). Sai chỗ này là lỗi người Việt hay mắc nhất.',
        '**じゃ** = "vậy thì" — dùng khi đã quyết định.',
        'Xem **Ngữ pháp · ポイント 7, 8** và **Bài tập về nhà · Bài 2**.',
      ],
      [
        mau([
          E('あのう、これはいくらですか。— {8,000円|はっせんえん}です。', 'Anō, kore wa ikura desu ka. — Hassen-en desu.', 'Số 1 — chỉ món ①…⑤, đọc giá trên nhãn (giá ví dụ).'),
          E('すみません。この{時計|とけい}はいくらですか。— {6,000円|ろくせんえん}です。', 'Sumimasen. Kono tokei wa ikura desu ka. — Rokusen-en desu.', 'Số 2 — この + tên món (Tシャツ／かばん／ズボン／{時計|とけい}).'),
          E('このズボンはいくらですか。— {3,000円|さんぜんえん}です。— そのズボンは？— {1,900円|せんきゅうひゃくえん}です。— じゃ、それをください。', 'Kono zubon wa ikura desu ka. — Sanzen-en desu. — Sono zubon wa? — Senkyūhyaku-en desu. — Ja, sore o kudasai.', 'Số 3 — so sánh hai món rồi mua.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 39 · やってみよう・絵を見て2人で話しましょう (chủ đề 2)',
      'Đầu trang hai tranh nhỏ: kệ quần áo giảm 30% (khách nam ướm áo) và quầy đồng hồ đeo tay. **やってみよう:** nghe hai đoạn mua bán, điền giá từng món (a, b…) và khoanh món người đó quyết định mua. **Truyện tranh 6 khung (nói theo tranh, hai người):** (1) khách nam hỏi quầy thông tin về máy ảnh/máy tính → "4F"; (2) anh lên tầng 4, gặp nhân viên nữ; (3) hai người đứng trước kệ hàng; (4) khách chỉ một món hỏi giá → ¥14,000; (5) chỉ món khác → ¥28,000; (6) cả hai vui vẻ, mua xong. Cô sẽ bảo bạn nói lại cả câu chuyện theo tranh.',
      [
        S('すみません、カメラは{何階|なんがい}ですか。', 'Sumimasen, kamera wa nangai desu ka.', '(khung 1) Xin lỗi, máy ảnh ở tầng mấy?'),
        C('{4階|よんかい}です。', 'Yonkai desu.', 'Tầng 4.'),
        S('（khung 4）これはいくらですか。', 'Kore wa ikura desu ka.', '(khung 4) Cái này bao nhiêu tiền?'),
        C('{14,000円|いちまんよんせんえん}です。', 'Ichiman yonsen-en desu.', '14.000 yên.'),
        S('（khung 5）あれはいくらですか。', 'Are wa ikura desu ka.', '(khung 5) Cái kia bao nhiêu?'),
        C('{28,000円|にまんはっせんえん}です。', 'Niman hassen-en desu.', '28.000 yên.'),
        S('じゃ、これをください。', 'Ja, kore o kudasai.', '(khung 6) Vậy cho tôi cái này.'),
      ],
      [
        'Số lớn: 10,000 = **いちまん** (không phải じゅうせん). 14,000 = いちまん・よんせん; 28,000 = にまん・はっせん.',
        'Nói theo tranh: mỗi khung MỘT câu, theo đúng thứ tự Hỏi tầng → Hỏi chỗ → Hỏi giá → Mua.',
        'Xem **Luyện nghe · Bài 3** và **Luyện nói · Đóng vai**.',
      ],
    ),

    ...trang(
      'Trang 40–41 · チャレンジ! レストラン',
      'Trang 40: nhà hàng, ba khách (hai nữ, một nam) ngồi ghế băng cầm thực đơn, mỗi người một cốc nước; anh phục vụ cầm sổ và bút ghi món. Ô (1): khách thấy món "とんかつ" và hình con heo — hỏi đây là món gì; (2): không hiểu từ ぶたにく, hỏi tiếng Anh là gì → "pork"; (3): khách nam chỉ chai bia hỏi bia nước nào → "U.S.A."; (4): gọi món: 2 tonkatsu, 1 cà ri, 3 bia. Trang 41: quầy thu ngân (CASHIER), khách nam đang trả tiền; ở bàn phía trước còn bát đĩa và **một chiếc ví bị bỏ quên**, một khách nữ chỉ về phía đó. Ô (5): hỏi "ví này của ai?", anh khách ngạc nhiên. **Mục tiêu できる:** gọi món ở nhà hàng; hỏi đồ bỏ quên là của ai.',
      [
        C('これは{何|なん}の{料理|りょうり}ですか。', 'Kore wa nan no ryōri desu ka.', 'Đây là món (làm từ) gì?'),
        S('{豚肉|ぶたにく}の{料理|りょうり}です。', 'Butaniku no ryōri desu.', 'Là món thịt heo.'),
        C('「ぶたにく」は{英語|えいご}で{何|なん}ですか。', '"Butaniku" wa eigo de nan desu ka.', '"Butaniku" tiếng Anh là gì?'),
        S('「pork」です。', '"Pōku" desu.', 'Là "pork".'),
        C('これはどこのビールですか。', 'Kore wa doko no bīru desu ka.', 'Đây là bia nước nào?'),
        S('アメリカのビールです。', 'Amerika no bīru desu.', 'Bia Mỹ.'),
        C('ご{注文|ちゅうもん}、どうぞ。', 'Go-chūmon, dōzo.', 'Mời quý khách gọi món.'),
        S('とんかつを{2|ふた}つとカレーを{1|ひと}つください。', 'Tonkatsu o futatsu to karē o hitotsu kudasai.', 'Cho tôi 2 tonkatsu và 1 cà ri.'),
        C('（trang 41）これはだれの{財布|さいふ}ですか。', 'Kore wa dare no saifu desu ka.', '(trang 41) Cái ví này của ai?'),
        S('{私|わたし}の{財布|さいふ}です。ありがとうございます。', 'Watashi no saifu desu. Arigatō gozaimasu.', 'Ví của tôi. Cảm ơn ạ.'),
      ],
      [
        '**ポイント 12** 何のN (món/loại gì), **ポイント 13** どこのN (của nước/nơi nào), **ポイント 14** 誰のN (của ai), **ポイント 15** ～語で (bằng tiếng…), **ポイント 10** ～を～つください.',
        '何の／どこの／誰の + N: trả lời thay từ hỏi bằng câu trả lời, GIỮ nguyên N: 何の料理 → 豚肉**の料理**です.',
        'Đề thi Bài 2 có: **これはなんのりょうりですか／～はだれのですか／これはどこの～ですか／ここはレストランです。ご注文どうぞ／これはベトナム語でなんですか**.',
        'Xem **Hội thoại · Tình huống 3–4** và **Ngữ pháp · ポイント 12–15**.',
      ],
    ),

    ...trang(
      'Trang 42–43 · 言ってみよう (chủ đề 3) — Món gì · Nước nào · Gọi món · Của ai',
      '**Số 1–2:** thực đơn có hình món: 例 món thịt heo, ① thịt gà, ② thịt bò, ③ súp rau, và phần nước ép/bánh: ④ táo, ⑤ dâu tây — hỏi "đây là món gì", rồi hỏi từ đó tiếng Anh là gì. **Số 3:** thực đơn đồ uống có giá: 例 bia A (Mỹ), ① bia B (Đức), ② rượu vang (Ý), ③ hồng trà (Ấn Độ) — hỏi "của nước nào". **Số 4:** gọi món theo số lượng: 例 cà ri ×1, ① cà phê ×3, ② bánh ×2 + hồng trà ×2, ③ hamburg ×2 + cơm ×1 + bánh mì ×1, ④ tonkatsu ×3 + bia ×2 + nước ép ×1. **Số 5:** thấy đồ bỏ quên — hỏi của ai; hai nhánh: của mình, hoặc của người C (gọi C lại). Gợi ý: 例 máy ảnh, ① điện thoại, ② túi, ③ ví, ④ đồng hồ.',
      [
        C('（④）これは{何|なん}のジュースですか。', 'Kore wa nan no jūsu desu ka.', '(chỉ ④) Đây là nước ép gì?'),
        S('リンゴのジュースです。', 'Ringo no jūsu desu.', 'Nước ép táo.'),
        C('「リンゴ」は{英語|えいご}で{何|なん}ですか。', '"Ringo" wa eigo de nan desu ka.', '"Ringo" tiếng Anh là gì?'),
        S('「apple」です。', '"Appuru" desu.', 'Là "apple".'),
        C('この{紅茶|こうちゃ}はどこの{紅茶|こうちゃ}ですか。', 'Kono kōcha wa doko no kōcha desu ka.', 'Hồng trà này của nước nào?'),
        S('インドの{紅茶|こうちゃ}です。', 'Indo no kōcha desu.', 'Hồng trà Ấn Độ.'),
        C('はい、どうぞ。', 'Hai, dōzo.', '(phục vụ) Vâng, mời quý khách.'),
        S('ケーキを{2|ふた}つと{紅茶|こうちゃ}を{2|ふた}つください。', 'Kēki o futatsu to kōcha o futatsu kudasai.', 'Cho tôi 2 bánh và 2 hồng trà.'),
        C('あ、{時計|とけい}！これはだれの{時計|とけい}ですか。', 'A, tokei! Kore wa dare no tokei desu ka.', 'Ơ, đồng hồ! Cái đồng hồ này của ai?'),
        S('あ、それはリンさんの{時計|とけい}です。リンさん、{時計|とけい}！', 'A, sore wa Rin-san no tokei desu. Rin-san, tokei!', 'À, đó là đồng hồ của Linh. Linh ơi, đồng hồ!'),
      ],
      [
        'Đếm đồ: **ひとつ・ふたつ・みっつ・よっつ・いつつ・むっつ・ななつ・やっつ・ここのつ・とお**. Hai món: **AをXつと BをYつください**.',
        'Cô hỏi "これはベトナム語で何ですか" → **「từ tiếng Việt」です** (ví dụ「cơm」です).',
        'Đồ của ai: **私の～です** / **(Tên)さんの～です**; có thể bỏ danh từ: 私のです.',
        'Xem **Luyện nghe · Bài 4–6** và **Ngữ pháp · ポイント 10, 12–15**.',
      ],
      [
        mau([
          E('これは{何|なん}の{料理|りょうり}ですか。— {鶏肉|とりにく}の{料理|りょうり}です。', 'Kore wa nan no ryōri desu ka. — Toriniku no ryōri desu.', 'Số 1–2 ① — thịt gà (② {牛肉|ぎゅうにく} bò, ③ {野菜|やさい}のスープ).'),
          E('「{牛肉|ぎゅうにく}」は{英語|えいご}で{何|なん}ですか。—「beef」です。', '"Gyūniku" wa eigo de nan desu ka. — "Bīfu" desu.', 'Số 1–2 — hỏi tiếng Anh.'),
          E('これはどこのビールですか。— ドイツのビールです。', 'Kore wa doko no bīru desu ka. — Doitsu no bīru desu.', 'Số 3 ① — bia Đức (② イタリアのワイン, ③ インドの{紅茶|こうちゃ}).'),
          E('すみません、{注文|ちゅうもん}をお{願|ねが}いします。— はい、どうぞ。— コーヒーを{3|みっ}つください。', 'Sumimasen, chūmon o onegaishimasu. — Hai, dōzo. — Kōhī o mittsu kudasai.', 'Số 4 ① — 3 cà phê.'),
          E('ハンバーグを{2|ふた}つとライスを{1|ひと}つとパンを{1|ひと}つください。', 'Hanbāgu o futatsu to raisu o hitotsu to pan o hitotsu kudasai.', 'Số 4 ③.'),
          E('とんかつを{3|みっ}つとビールを{2|ふた}つとジュースを{1|ひと}つください。', 'Tonkatsu o mittsu to bīru o futatsu to jūsu o hitotsu kudasai.', 'Số 4 ④.'),
          E('あ、{財布|さいふ}！これはだれの{財布|さいふ}ですか。— あ、それは{私|わたし}の{財布|さいふ}です。ありがとうございます。', 'A, saifu! Kore wa dare no saifu desu ka. — A, sore wa watashi no saifu desu. Arigatō gozaimasu.', 'Số 5 ③ — ví, nhánh "của tôi".'),
        ]),
      ],
    ),

    ...trang(
      'Trang 43 · やってみよう・ロールプレイ (chủ đề 3) — Nghe gọi món',
      '**やってみよう:** nghe khách gọi món, điền SỐ LƯỢNG vào bảng món: cà ri, tonkatsu, hamburg (ô mẫu đã có số 2), 親子丼 (cơm gà trứng), cơm, bánh mì, nước ép, cà phê, rượu vang, bia. Nghe số đếm ～つ ngay sau tên món. **ロールプレイ:** A là khách vào nhà hàng gọi món; B là nhân viên hỏi và nhắc lại order. Cô thường đóng nhân viên.',
      [
        C('いらっしゃいませ。こちらへどうぞ。', 'Irasshaimase. Kochira e dōzo.', 'Xin chào quý khách. Mời đi lối này.'),
        S('すみません、{注文|ちゅうもん}をお{願|ねが}いします。', 'Sumimasen, chūmon o onegaishimasu.', 'Xin lỗi, cho tôi gọi món.'),
        C('はい、どうぞ。', 'Hai, dōzo.', 'Vâng, mời quý khách.'),
        S('{親子丼|おやこどん}を{1|ひと}つとコーヒーを{2|ふた}つください。', 'Oyakodon o hitotsu to kōhī o futatsu kudasai.', 'Cho tôi 1 cơm gà trứng và 2 cà phê.'),
        C('{親子丼|おやこどん}を{1|ひと}つとコーヒーを{2|ふた}つですね。', 'Oyakodon o hitotsu to kōhī o futatsu desu ne.', '1 cơm gà trứng và 2 cà phê, phải không ạ?'),
        S('はい。', 'Hai.', 'Vâng.'),
      ],
      [
        'Nhân viên nhắc lại + **ですね** để xác nhận → bạn chỉ cần **はい** (hoặc sửa: いいえ、コーヒーは{1|ひと}つです).',
        'Đề thi: cô nói "ここはレストランです。ご注文どうぞ" → trả lời ngay **～を～つください**, không cần hỏi lại.',
        'Xem **Luyện nghe · Bài 4** và **Luyện nói · Đóng vai**.',
      ],
    ),

    ...trang(
      'Trang 44 · できる! — Đi mua sắm, đi ăn · Chợ đồ cũ trong lớp',
      'Nhiệm vụ ngoài lớp: đi siêu thị mua đồ, rồi vào quán ăn. **Trong lớp (教室でできる!):** tổ chức **chợ đồ cũ (フリーマーケット)** — (1) người bán tự đặt giá cho món mình bán (thử nghĩ: ở Nhật món đó giá bao nhiêu?); (2) người mua hỏi món hàng bán ở chỗ nào; (3) người mua hỏi giá rồi mua. Dùng lại hết mẫu câu của cả bài.',
      [
        C('いらっしゃいませ。', 'Irasshaimase.', '(cô bán hàng) Xin chào.'),
        S('すみません、ペンはどこですか。', 'Sumimasen, pen wa doko desu ka.', 'Xin lỗi, bút ở đâu ạ?'),
        C('ペンはここです。', 'Pen wa koko desu.', 'Bút ở đây.'),
        S('このペンはいくらですか。', 'Kono pen wa ikura desu ka.', 'Cái bút này bao nhiêu tiền?'),
        C('{100円|ひゃくえん}です。', 'Hyaku-en desu.', '100 yên.'),
        S('じゃ、これを{2|ふた}つください。', 'Ja, kore o futatsu kudasai.', 'Vậy cho tôi 2 cái.'),
        C('{200円|にひゃくえん}です。ありがとうございます。', 'Nihyaku-en desu. Arigatō gozaimasu.', '200 yên. Cảm ơn quý khách.'),
      ],
      [
        'Một lượt mua đủ 4 bước: **どこですか → いくらですか → ～をください → ありがとうございます**.',
        'Khi bạn là người bán: **いらっしゃいませ**, trả lời chỗ bằng ここ／こちら, giá bằng ～円です.',
        'Xem **Hội thoại · できる！フリーマーケット**.',
      ],
    ),

    ...trang(
      'Trang 44 · 話読聞書「好きな店」 — Cửa hàng tôi thích',
      'Ô 話読聞書 có một đoạn rất ngắn giới thiệu một tiệm bánh mì mà người viết thích: tên tiệm, là tiệm gì, bánh của tiệm, giá mỗi cái, và "ngon". Bên cạnh có ba câu hỏi gợi ý để phỏng vấn bạn: tên cửa hàng là gì, ở đó có gì, bao nhiêu tiền. Nhiệm vụ: viết một đoạn giống thế về quán BẠN thích (quán ở Việt Nam cũng được, giá tính bằng ドン — đồng) rồi đọc cho lớp.',
      [
        C('{好|す}きな{店|みせ}の{名前|なまえ}は{何|なん}ですか。', 'Suki na mise no namae wa nan desu ka.', 'Tên cửa hàng em thích là gì?'),
        S('ハイランズです。', 'Hairanzu desu.', 'Là Highlands.'),
        C('{何|なに}がありますか。', 'Nani ga arimasu ka.', 'Ở đó có gì?'),
        S('コーヒーとケーキがあります。', 'Kōhī to kēki ga arimasu.', 'Có cà phê và bánh.'),
        C('コーヒーはいくらですか。', 'Kōhī wa ikura desu ka.', 'Cà phê bao nhiêu tiền?'),
        S('{1|ひと}つ{29,000|にまんきゅうせん}ドンです。', 'Hitotsu niman kyūsen-don desu.', 'Một ly 29.000 đồng.'),
      ],
      [
        '**～があります** (có…) là mẫu của Bài 4 — ở đây chỉ cần nhớ nguyên câu: **Aと Bがあります**.',
        'Đoạn mẫu của bạn: ここは…です。…の{店|みせ}です。これは…の…です。{1|ひと}つ…です。おいしいです。',
        'Xem **Hội thoại · Đọc – nói: 好きな店**.',
      ],
      [
        mau([
          E('ここはハイランズです。{喫茶店|きっさてん}です。これはハイランズのコーヒーです。{1|ひと}つ{29,000|にまんきゅうせん}ドンです。おいしいです。', 'Koko wa Hairanzu desu. Kissaten desu. Kore wa Hairanzu no kōhī desu. Hitotsu niman kyūsen-don desu. Oishii desu.', 'Đoạn mẫu "quán tôi thích" của bạn.'),
        ]),
      ],
    ),

    { t: 'h', text: 'Trang 45 · ことば — Từ vựng của bài' },
    {
      t: 'p',
      text: 'Trang liệt kê từ mới theo 3 chủ đề (どこですか — nơi chốn, đồ vật; いくらですか — chỉ đồ, quần áo, giá; レストラン — món ăn, đồ uống, nước, đồ bỏ quên). Không có tranh. Đủ nghĩa, romaji, ví dụ: xem mục **Từ vựng** của Bài 2.',
    },
    { t: 'note', title: 'Mẹo', items: ['Cô hay gọi đọc nhanh cặp **ここ／こちら, そこ／そちら, あそこ／あちら** và các số tầng — ôn ở **Từ vựng · 1** và **Ngữ pháp · Số đếm**.', 'Xem **Từ vựng · Bài 2** và **Chữ Hán · Bài 2**.'] },

    ...trang(
      'Trang 46 · もう一度聞こう — Nghe lại cả bài',
      'Nghe lại đoạn đã nghe ở trang 31, gồm ba cảnh: **ở quầy thông tin** — パク hỏi điện máy サカイ ở tầng mấy (tầng 4); **ở tầng 4** — hỏi điện thoại di động ở đâu (đằng kia), hỏi giá hai chiếc (29.800 yên và 12.000 yên) rồi chọn mua chiếc rẻ hơn; **ở nhà hàng** — được dẫn tới bàn, nhận thực đơn, hỏi món cà ri làm từ thịt gì và "butaniku" tiếng Anh là gì; マルコ hỏi bia của nước nào (Đức) rồi gọi 2 cà ri, 2 bia. Cụm mới cuối trang: こちらへどうぞ (mời đi lối này), メニュー (thực đơn), 少々お待ちください (xin chờ một chút).',
      [
        C('サカイ{電器|でんき}は{何階|なんがい}ですか。', 'Sakai denki wa nangai desu ka.', 'Điện máy Sakai ở tầng mấy?'),
        S('{4階|よんかい}です。', 'Yonkai desu.', 'Tầng 4.'),
        C('パクさんの{携帯電話|けいたいでんわ}はいくらですか。', 'Paku-san no keitai denwa wa ikura desu ka.', 'Chiếc điện thoại Park mua giá bao nhiêu?'),
        S('{12,000円|いちまんにせんえん}です。', 'Ichiman nisen-en desu.', '12.000 yên.'),
        C('カレーは{何|なん}のカレーですか。', 'Karē wa nan no karē desu ka.', 'Cà ri là cà ri gì?'),
        S('{豚肉|ぶたにく}のカレーです。', 'Butaniku no karē desu.', 'Cà ri thịt heo.'),
        C('ビールはどこのビールですか。', 'Bīru wa doko no bīru desu ka.', 'Bia là bia nước nào?'),
        S('ドイツのビールです。', 'Doitsu no bīru desu.', 'Bia Đức.'),
        C('カレーとビールはいくつですか。', 'Karē to bīru wa ikutsu desu ka.', 'Cà ri và bia gọi mấy phần?'),
        S('カレーを{2|ふた}つとビールを{2|ふた}つです。', 'Karē o futatsu to bīru o futatsu desu.', '2 cà ri và 2 bia.'),
      ],
      [
        '**少々お待ちください** (shōshō omachi kudasai) — nhân viên nói sau khi nhận order; bạn không cần đáp.',
        'Câu hỏi về số lượng: **いくつ** (mấy cái) — trả lời bằng ～つ.',
        'Xem **Luyện nghe · Bài 1–6** và **Luyện nói · Câu hỏi KHÔNG có tranh**.',
      ],
    ),

    { t: 'h', text: 'Cô hỏi — bạn trả lời: ghép nhanh câu trả lời' },
    {
      t: 'build',
      id: 'b2-sach-ghep',
      title: 'Nghe câu hỏi (tiếng Việt) → ghép câu trả lời tiếng Nhật',
      items: [
        { vi: 'Cô hỏi スーパーは何階ですか → "Tầng hầm 1."', chips: ['{地下|ちか}', '{1階|いっかい}', 'です。', '{何階|なんがい}'], answer: ['{地下|ちか}', '{1階|いっかい}', 'です。'], ro: 'Chika ikkai desu.' },
        { vi: 'Cô hỏi 百円ショップは三階ですか → "Vâng, tầng 3."', chips: ['はい、', '{3階|さんがい}', 'です。', 'いいえ、'], answer: ['はい、', '{3階|さんがい}', 'です。'], ro: 'Hai, sangai desu.' },
        { vi: 'Cô hỏi トイレはどこですか (ở xa) → "Ở đằng kia."', chips: ['あそこ', 'です。', 'ここ', 'あれ'], answer: ['あそこ', 'です。'], ro: 'Asoko desu.' },
        { vi: 'Bạn hỏi giá cái túi bạn đang cầm: "Cái túi này bao nhiêu tiền?"', chips: ['この', 'かばんは', 'いくらですか。', 'これ', 'どこですか。'], answer: ['この', 'かばんは', 'いくらですか。'], ro: 'Kono kaban wa ikura desu ka.' },
        { vi: 'Cô hỏi これは何の料理ですか → "Món thịt bò."', chips: ['{牛肉|ぎゅうにく}の', '{料理|りょうり}です。', '{何|なん}の', 'どこの'], answer: ['{牛肉|ぎゅうにく}の', '{料理|りょうり}です。'], ro: 'Gyūniku no ryōri desu.' },
        { vi: 'Cô hỏi これはどこのワインですか → "Rượu vang Ý."', chips: ['イタリアの', 'ワインです。', 'イタリア{語|ご}で', 'だれの'], answer: ['イタリアの', 'ワインです。'], ro: 'Itaria no wain desu.' },
        { vi: 'Cô nói ご注文どうぞ → "Cho tôi 2 cà ri và 1 cà phê."', chips: ['カレーを', '{2|ふた}つと', 'コーヒーを', '{1|ひと}つ', 'ください。', 'は'], answer: ['カレーを', '{2|ふた}つと', 'コーヒーを', '{1|ひと}つ', 'ください。'], ro: 'Karē o futatsu to kōhī o hitotsu kudasai.' },
        { vi: 'Cô hỏi この財布はだれのですか → "Là ví của Linh."', chips: ['リンさんの', '{財布|さいふ}です。', 'だれの', 'どこの'], answer: ['リンさんの', '{財布|さいふ}です。'], ro: 'Rin-san no saifu desu.' },
      ],
    },
  ],
};

/* ══════════════════════════ BÀI 3 — スケジュール ══════════════════════════ */

const SACH_3: Lesson = {
  id: 'b3-sach',
  kind: 'review',
  title: 'Theo sách — Bài 3 (trang 47–66)',
  goal: 'Nhìn biển giờ mở cửa, bảng lịch năm, tranh sinh hoạt trong sách là hỏi–đáp được giờ, ngày, đi đâu, làm gì, mỗi ngày thế nào.',
  minutes: 60,
  blocks: [
    CACH_DUNG,

    ...trang(
      'Trang 47 · 話してみよう・聞いてみよう — Mở bài スケジュール',
      '**話してみよう** — 4 tranh không lời: (1) sảnh đến ở sân bay (biển ARRIVAL LOBBY), phía sau là băng-rôn lễ nhập học trường tiếng Nhật あおぞら với một người phát biểu, bên cạnh một phụ nữ xem thể thao trên TV — những sự kiện trong một năm; (2) thư viện: một nam một nữ ngồi học cùng nhau cạnh giá sách; (3) một phụ nữ nhìn bảng thời gian biểu trên tường, lấy tay che miệng — hoảng vì sắp trễ giờ; (4) một cuốn sổ lịch mở, có cài bút. Mục đích: nói chuyện về giờ giấc, lịch trình. **聞いてみよう**: nghe trước cả đoạn hội thoại của bài (lịch của trường, gọi điện hỏi giờ thư viện, chiều nay đi đâu) — chính là trang 66.',
      [
        C('（tranh 2）ここはどこですか。', '(tranh 2) Koko wa doko desu ka.', '(tranh 2) Đây là đâu?'),
        S('{図書館|としょかん}です。', 'Toshokan desu.', 'Là thư viện.'),
        C('{図書館|としょかん}で{何|なに}をしますか。', 'Toshokan de nani o shimasu ka.', 'Ở thư viện làm gì?'),
        S('{本|ほん}を{読|よ}みます。{日本語|にほんご}を{勉強|べんきょう}します。', 'Hon o yomimasu. Nihongo o benkyō shimasu.', 'Đọc sách. Học tiếng Nhật.'),
        C('{今|いま}、{何時|なんじ}ですか。', 'Ima, nanji desu ka.', 'Bây giờ là mấy giờ?'),
        S('{10時|じゅうじ}{15分|じゅうごふん}です。', 'Jūji jūgofun desu.', '10 giờ 15 phút. (đọc giờ thật / giờ trên đồng hồ cô chỉ)'),
        C('（tranh 3）この{人|ひと}は{何時|なんじ}に{学校|がっこう}へ{行|い}きますか。', '(tranh 3) Kono hito wa nanji ni gakkō e ikimasu ka.', '(tranh 3) Người này mấy giờ đi học?'),
        S('{9時|くじ}に{行|い}きます。', 'Kuji ni ikimasu.', 'Đi lúc 9 giờ. (trả lời theo giờ bạn đoán)'),
      ],
      [
        'Đề thi Bài 3 hỏi đúng kiểu này: **図書館で何をしますか** → **N を V ます** (ポイント 18, 20).',
        'Giờ: 4時 **よじ**, 7時 **しちじ**, 9時 **くじ**; phút: 1 いっぷん, 3 さんぷん, 4 よんぷん, 6 ろっぷん, 10 じゅっぷん, 15 じゅうごふん, 30 さんじゅっぷん (= 半 はん).',
        'Xem **Ngữ pháp · Chuẩn bị ① — Đọc giờ**.',
      ],
    ),

    ...trang(
      'Trang 48–49 · チャレンジ! 何時までですか',
      'Trang 48: ở ký túc xá, một phụ nữ gọi điện bằng điện thoại bàn có dây xoắn, tay cầm tấm thẻ nhỏ; cạnh đó một người đàn ông cầm tờ rơi. Ô (1): hai người, dấu "?" và hình đồng hồ — hỏi bây giờ mấy giờ; ô (2): cô ấy gọi điện, bong bóng có hai đồng hồ nối nhau (từ… đến…) — hỏi thư viện mở từ mấy giờ đến mấy giờ; đầu dây kia là một ông đeo kính. Trang 49: quầy thư viện, ông đeo kính nghe điện thoại, cạnh đó tấm biển **giờ mở cửa 9–5, ngày nghỉ thứ Hai**. Ô (3): hỏi "nghỉ ngày nào?" với dãy thứ trong tuần. **Mục tiêu できる:** gọi điện hỏi cơ sở công cộng giờ mở cửa và ngày nghỉ.',
      [
        C('{今|いま}、{何時|なんじ}ですか。', 'Ima, nanji desu ka.', 'Bây giờ mấy giờ?'),
        S('{3時|さんじ}{半|はん}です。', 'Sanji han desu.', '3 giờ rưỡi.'),
        C('（trang 49）{図書館|としょかん}は{何時|なんじ}から{何時|なんじ}までですか。', 'Toshokan wa nanji kara nanji made desu ka.', '(nhìn biển) Thư viện mở từ mấy giờ đến mấy giờ?'),
        S('{9時|くじ}から{5時|ごじ}までです。', 'Kuji kara goji made desu.', 'Từ 9 giờ đến 5 giờ.'),
        C('{休|やす}みはいつですか。', 'Yasumi wa itsu desu ka.', 'Ngày nghỉ là khi nào?'),
        S('{月曜日|げつようび}です。', 'Getsuyōbi desu.', 'Thứ Hai.'),
        C('{図書館|としょかん}は{日曜日|にちようび}も{休|やす}みですか。', 'Toshokan wa nichiyōbi mo yasumi desu ka.', 'Thư viện chủ nhật cũng nghỉ à?'),
        S('いいえ、{日曜日|にちようび}は{休|やす}みじゃありません。', 'Iie, nichiyōbi wa yasumi ja arimasen.', 'Không, chủ nhật không nghỉ.'),
      ],
      [
        '**ポイント 21**: N **から** N **まで** (từ… đến…) dùng cho giờ, thứ, ngày.',
        'Thứ: 月 げつ(Hai) 火 か(Ba) 水 すい(Tư) 木 もく(Năm) 金 きん(Sáu) 土 ど(Bảy) 日 にち(CN) + **ようび**. Người Nhật bắt đầu tuần từ **Chủ nhật** (日月火…) — đừng nhầm 日 là thứ Hai.',
        'Gọi điện: bên kia nhấc máy nói **はい、～です**; bạn mở đầu **すみません** hoặc **あのう、すみません**.',
        'Xem **Hội thoại · ①** và **Ngữ pháp · ポイント 21**.',
      ],
    ),

    ...trang(
      'Trang 50 · 言ってみよう (chủ đề 1) — Hỏi giờ · Giờ mở cửa và ngày nghỉ',
      '**Số 1:** hỏi giờ hiện tại (tranh hai người + đồng hồ). **Số 2:** gọi điện hỏi giờ mở cửa và ngày nghỉ; bốn toà nhà có ghi giờ: 例 thư viện さくら 9:00–7:00, nghỉ thứ Hai; ① bệnh viện さくら 9:30–15:00, nghỉ thứ Tư; ② nhà thi đấu わかば 8:30 sáng – 9:00 tối, nghỉ thứ Năm; ③ bưu điện みどり 9:00–5:00, nghỉ thứ Bảy và Chủ nhật. Cô chỉ vào một toà nhà và hỏi.',
      [
        C('（①）さくら{病院|びょういん}は{何時|なんじ}から{何時|なんじ}までですか。', 'Sakura byōin wa nanji kara nanji made desu ka.', '(①) Bệnh viện Sakura mở từ mấy giờ đến mấy giờ?'),
        S('{9時半|くじはん}から{3時|さんじ}までです。', 'Kuji han kara sanji made desu.', 'Từ 9 giờ rưỡi đến 3 giờ.'),
        C('{休|やす}みは？', 'Yasumi wa?', 'Ngày nghỉ?'),
        S('{水曜日|すいようび}です。', 'Suiyōbi desu.', 'Thứ Tư.'),
        C('（②）わかば{体育館|たいいくかん}は？', 'Wakaba taiikukan wa?', '(②) Còn nhà thi đấu Wakaba?'),
        S('{午前|ごぜん}{8時半|はちじはん}から{午後|ごご}{9時|くじ}までです。{休|やす}みは{木曜日|もくようび}です。', 'Gozen hachiji han kara gogo kuji made desu. Yasumi wa mokuyōbi desu.', 'Từ 8 giờ rưỡi sáng đến 9 giờ tối. Nghỉ thứ Năm.'),
        C('（③）みどり{郵便局|ゆうびんきょく}の{休|やす}みはいつですか。', 'Midori yūbinkyoku no yasumi wa itsu desu ka.', '(③) Bưu điện Midori nghỉ khi nào?'),
        S('{土曜日|どようび}と{日曜日|にちようび}です。', 'Doyōbi to nichiyōbi desu.', 'Thứ Bảy và Chủ nhật.'),
      ],
      [
        'Người Nhật nói giờ 12 tiếng: **15:00 = 午後3時** (ごご さんじ). Thêm **午前** (sáng) / **午後** (chiều-tối) để rõ nghĩa.',
        'Hai ngày nghỉ: nối bằng **と** (土曜日と日曜日) — ポイント 5 của Bài 1.',
        'Đề thi có tranh biển giờ kiểu "6:00AM～7:15PM, Closed: Wed" → **午前6時から午後7時15分までです。休みは水曜日です。**',
        'Xem **Luyện nói · Câu hỏi có tranh — biển giờ mở cửa**.',
      ],
      [
        mau([
          E('すみません。{今|いま}、{何時|なんじ}ですか。— {10時|じゅうじ}です。— ありがとうございます。', 'Sumimasen. Ima, nanji desu ka. — Jūji desu. — Arigatō gozaimasu.', 'Số 1 — hỏi giờ.'),
          E('はい、さくら{病院|びょういん}です。— すみません。そちらは{何時|なんじ}から{何時|なんじ}までですか。— {9時半|くじはん}から{3時|さんじ}までです。', 'Hai, Sakura byōin desu. — Sumimasen. Sochira wa nanji kara nanji made desu ka. — Kuji han kara sanji made desu.', 'Số 2 ① — bệnh viện (nghỉ {水曜日|すいようび}).'),
          E('{午前|ごぜん}{8時半|はちじはん}から{午後|ごご}{9時|くじ}までです。— {休|やす}みは{木曜日|もくようび}です。', 'Gozen hachiji han kara gogo kuji made desu. — Yasumi wa mokuyōbi desu.', 'Số 2 ② — nhà thi đấu.'),
          E('{9時|くじ}から{5時|ごじ}までです。— {休|やす}みは{土曜日|どようび}と{日曜日|にちようび}です。', 'Kuji kara goji made desu. — Yasumi wa doyōbi to nichiyōbi desu.', 'Số 2 ③ — bưu điện.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 51 · やってみよう (chủ đề 1) — Nghe giờ mở cửa',
      'Nghe ba cuộc gọi tới thư viện さくら, ngân hàng たいよう, bưu điện さくら và điền bảng: **giờ** (từ ~ đến; dòng ngân hàng có thêm một khoảng giờ thứ hai) và **ngày nghỉ**. Nghe: số trước **から** là giờ mở, trước **まで** là giờ đóng, sau **休みは** là ngày nghỉ. Dòng ■: hỏi giờ mở cửa thư viện, ngân hàng, bưu điện… ở thành phố của bạn — cô sẽ hỏi về nơi bạn sống.',
      [
        C('FPT{大学|だいがく}の{図書館|としょかん}は{何時|なんじ}から{何時|なんじ}までですか。', 'Efu-pī-tī daigaku no toshokan wa nanji kara nanji made desu ka.', 'Thư viện ĐH FPT mở từ mấy giờ đến mấy giờ?'),
        S('{午前|ごぜん}{8時|はちじ}から{午後|ごご}{9時|くじ}までです。', 'Gozen hachiji kara gogo kuji made desu.', 'Từ 8 giờ sáng đến 9 giờ tối. (nói theo giờ thật của trường bạn)'),
        C('{銀行|ぎんこう}は{何曜日|なんようび}から{何曜日|なんようび}までですか。', 'Ginkō wa nan’yōbi kara nan’yōbi made desu ka.', 'Ngân hàng làm từ thứ mấy đến thứ mấy?'),
        S('{月曜日|げつようび}から{金曜日|きんようび}までです。', 'Getsuyōbi kara kin’yōbi made desu.', 'Từ thứ Hai đến thứ Sáu.'),
        C('{郵便局|ゆうびんきょく}の{休|やす}みは{何曜日|なんようび}ですか。', 'Yūbinkyoku no yasumi wa nan’yōbi desu ka.', 'Bưu điện nghỉ thứ mấy?'),
        S('{日曜日|にちようび}です。', 'Nichiyōbi desu.', 'Chủ nhật.'),
      ],
      [
        'Đề thi Lesson 3: **～は何時から何時までですか／何曜日から何曜日までですか／いつからいつまでですか／～の休みは何曜日ですか** — cùng một khuôn **A から B までです**.',
        'Hỏi 何曜日 → trả lời ～曜日; hỏi いつ → trả lời ngày hoặc thứ đều được.',
        'Xem **Luyện nghe · Bài 1** và **Luyện nói · Câu hỏi không tranh ①**.',
      ],
    ),

    ...trang(
      'Trang 52–53 · チャレンジ! 私のスケジュール',
      'Trang 52: thầy giáo đứng chỉ vào bảng trắng ghi **lịch cả năm của trường**: tháng 4 ngắm hoa, 21/5 tiệc du học sinh, 24/6 du lịch xe buýt, tháng 8 nghỉ hè; ba học sinh ngồi nghe. Ô (1): tiệc du học sinh — hỏi làm gì ở đó; ô (2): du lịch xe buýt — hình người đi → núi Phú Sĩ, hỏi đi đâu. Trang 53: bốn bạn ngồi nói chuyện trong lớp. Ô (3): nghỉ hè 2/8–24/8 — hình máy bay bay về một ngôi nhà (về nước?); ô (4): tháng 12 — người đi tới bản đồ Hokkaido có người trượt tuyết. **Mục tiêu できる:** hỏi về lịch năm của trường và nói kế hoạch trong năm của mình.',
      [
        C('{留学生|りゅうがくせい}パーティーはいつですか。', 'Ryūgakusei pātī wa itsu desu ka.', 'Tiệc du học sinh là khi nào?'),
        S('{5月|ごがつ}{21日|にじゅういちにち}です。', 'Gogatsu nijūichinichi desu.', 'Ngày 21 tháng 5.'),
        C('バス{旅行|りょこう}はどこへ{行|い}きますか。', 'Basu ryokō wa doko e ikimasu ka.', 'Du lịch xe buýt đi đâu?'),
        S('{富士山|ふじさん}へ{行|い}きます。', 'Fujisan e ikimasu.', 'Đi núi Phú Sĩ.'),
        C('{夏休|なつやす}みはいつからいつまでですか。', 'Natsuyasumi wa itsu kara itsu made desu ka.', 'Nghỉ hè từ khi nào đến khi nào?'),
        S('{8月|はちがつ}{2日|ふつか}から{24日|にじゅうよっか}までです。', 'Hachigatsu futsuka kara nijūyokka made desu.', 'Từ ngày 2 đến ngày 24 tháng 8.'),
        C('ミンさんは{夏休|なつやす}み、{何|なに}をしますか。', 'Min-san wa natsuyasumi, nani o shimasu ka.', 'Nghỉ hè Minh làm gì?'),
        S('{海|うみ}へ{行|い}きます。', 'Umi e ikimasu.', 'Em đi biển.'),
        C('{冬休|ふゆやす}み、{北海道|ほっかいどう}へ{行|い}きますか。', 'Fuyuyasumi, Hokkaidō e ikimasu ka.', 'Nghỉ đông em có đi Hokkaido không?'),
        S('いいえ、{行|い}きません。アルバイトをします。', 'Iie, ikimasen. Arubaito o shimasu.', 'Không, em không đi. Em đi làm thêm.'),
      ],
      [
        '**ポイント 16** Vます／Vません, **ポイント 17** 場所 **へ** 行きます／帰ります, **ポイント 18** N **を** Vます, **ポイント 20** 場所 **で** Vます.',
        'Hỏi có/không bằng động từ → trả lời **はい、Vます／いいえ、Vません** (lặp lại động từ, KHÔNG trả lời はい、そうです).',
        'Đề thi: "なつやすみ くにへ かえりますか" — ở Việt Nam có thể hiểu là về quê: **はい、帰ります** / **いいえ、帰りません。～へ行きます**.',
        'Xem **Hội thoại · ②** và **Ngữ pháp · ポイント 16–18, 20**.',
      ],
    ),

    ...trang(
      'Trang 54–55 · 言ってみよう (chủ đề 2) — Ngày đó làm gì · Đi đâu · Nghỉ có về không · Tuần lễ Vàng',
      '**Số 1:** bảng lịch năm + tranh hoạt động — nói sự kiện rồi trả lời "làm gì?": 例 ngắm hoa (10/4) → ngắm hoa anh đào, ăn cơm hộp; ① tiệc du học sinh (25/6); ② homestay (6–9/8, tranh pháo hoa + nướng thịt); ③ du lịch Hokkaido (14–17/1, trượt tuyết + ăn uống). **Số 2:** sự kiện → "đi đâu?": 例 du lịch xe buýt → núi Phú Sĩ; ① homestay (4–7/8) → Kyoto; ② du lịch trượt tuyết (26, 27/12) → Hokkaido. **Số 3:** kỳ nghỉ + "có… không?", hai nhánh có/không: 例 nghỉ xuân · về nước; ① nghỉ thu · làm thêm; ② nghỉ đông · đi du lịch; ③ nghỉ hè · đi biển. **Số 4:** Tuần lễ Vàng làm gì — đi đâu rồi làm gì ở đó: 例 công viên (BBQ), ① Hakata (lễ hội), ② Aomori (ngắm hoa), ③ Hokkaido (trượt tuyết).',
      [
        C('{6月|ろくがつ}{25日|にじゅうごにち}は{何|なん}ですか。', 'Rokugatsu nijūgonichi wa nan desu ka.', 'Ngày 25/6 là gì?'),
        S('{留学生|りゅうがくせい}パーティーです。', 'Ryūgakusei pātī desu.', 'Tiệc du học sinh.'),
        C('{何|なに}をしますか。', 'Nani o shimasu ka.', 'Làm gì?'),
        S('{料理|りょうり}を{食|た}べます。お{酒|さけ}を{飲|の}みます。', 'Ryōri o tabemasu. O-sake o nomimasu.', 'Ăn đồ ăn. Uống rượu.'),
        C('スキー{旅行|りょこう}はどこへ{行|い}きますか。', 'Sukī ryokō wa doko e ikimasu ka.', 'Du lịch trượt tuyết đi đâu?'),
        S('{北海道|ほっかいどう}へ{行|い}きます。', 'Hokkaidō e ikimasu.', 'Đi Hokkaido.'),
        C('{秋休|あきやす}み、アルバイトをしますか。', 'Akiyasumi, arubaito o shimasu ka.', 'Nghỉ thu em làm thêm không?'),
        S('はい、します。', 'Hai, shimasu.', 'Có, em làm.'),
        C('ゴールデンウィーク、{何|なに}をしますか。', 'Gōruden wīku, nani o shimasu ka.', 'Tuần lễ Vàng em làm gì?'),
        S('{公園|こうえん}へ{行|い}きます。{公園|こうえん}でバーベキューをします。', 'Kōen e ikimasu. Kōen de bābekyū o shimasu.', 'Em đi công viên. Nướng thịt ở công viên.'),
      ],
      [
        '**へ** = hướng tới (đi ĐẾN đâu, đọc **e**); **で** = nơi xảy ra hành động (làm gì Ở đâu). 公園**へ**行きます · 公園**で**バーベキューをします.',
        'Ai đó kể kế hoạch hay → đáp **いいですね** (hay nhỉ); ngạc nhiên nhẹ → **へえ** / **えっ**.',
        'Xem **Ngữ pháp · ポイント 17, 18, 20** và **Luyện nghe · Bài 2–3**.',
      ],
      [
        mau([
          E('{6月|ろくがつ}{25日|にじゅうごにち}は{留学生|りゅうがくせい}パーティーです。— {料理|りょうり}を{食|た}べます。お{酒|さけ}を{飲|の}みます。', 'Rokugatsu nijūgonichi wa ryūgakusei pātī desu. — Ryōri o tabemasu. O-sake o nomimasu.', 'Số 1 ①.'),
          E('{8月|はちがつ}{6日|むいか}から{9日|ここのか}まではホームステイです。— {花火|はなび}を{見|み}ます。バーベキューをします。', 'Hachigatsu muika kara kokonoka made wa hōmusutei desu. — Hanabi o mimasu. Bābekyū o shimasu.', 'Số 1 ②.'),
          E('{1月|いちがつ}{14日|じゅうよっか}から{17日|じゅうしちにち}までは{北海道|ほっかいどう}{旅行|りょこう}です。— スキーをします。おすしを{食|た}べます。', 'Ichigatsu jūyokka kara jūshichinichi made wa Hokkaidō ryokō desu. — Sukī o shimasu. O-sushi o tabemasu.', 'Số 1 ③.'),
          E('{8月|はちがつ}{4日|よっか}から{7日|なのか}までホームステイです。— どこへ{行|い}きますか。— {京都|きょうと}へ{行|い}きます。', 'Hachigatsu yokka kara nanoka made hōmusutei desu. — Doko e ikimasu ka. — Kyōto e ikimasu.', 'Số 2 ①.'),
          E('{12月|じゅうにがつ}{26日|にじゅうろくにち}と{27日|にじゅうしちにち}はスキー{旅行|りょこう}です。— {北海道|ほっかいどう}へ{行|い}きます。', 'Jūnigatsu nijūrokunichi to nijūshichinichi wa sukī ryokō desu. — Hokkaidō e ikimasu.', 'Số 2 ②.'),
          E('{冬休|ふゆやす}み、{旅行|りょこう}をしますか。— はい、します。／いいえ、しません。', 'Fuyuyasumi, ryokō o shimasu ka. — Hai, shimasu. / Iie, shimasen.', 'Số 3 ② (tương tự ① {秋休|あきやす}み・アルバイト, ③ {夏休|なつやす}み・{海|うみ}へ{行|い}きます).'),
          E('{博多|はかた}へ{行|い}きます。{博多|はかた}でお{祭|まつ}りを{見|み}ます。', 'Hakata e ikimasu. Hakata de o-matsuri o mimasu.', 'Số 4 ① (② {青森|あおもり}で{桜|さくら}を{見|み}ます, ③ {北海道|ほっかいどう}でスキーをします).'),
        ]),
      ],
    ),

    ...trang(
      'Trang 56–57 · やってみよう・ペアで話しましょう (chủ đề 2) — Lịch cả năm',
      '**やってみよう (trang 56):** nghe và điền **khi nào** (tháng, ngày; một câu có cả giờ) và **làm gì** — chọn tranh a–f: đi Osaka, đi Yokohama, nướng thịt, hai người cầm micro và cốc (hát, uống), ngồi ăn cơm hộp, một người ngồi ăn một mình. **Nói theo cặp:** A không biết lịch trường, chọn sự kiện trong khung (ngắm hoa, pháo hoa, lễ hội, tiệc, du lịch xe buýt, du lịch trượt tuyết, homestay, kiểm tra, nghỉ hè, nghỉ đông) và hỏi B; B nhìn **bảng lịch 12 tháng ở trang 57** để trả lời (mỗi sự kiện có ngày, có khi có giờ, địa điểm và việc sẽ làm). Cô thường cầm trang 57 và hỏi bạn.',
      [
        C('お{花見|はなみ}はいつですか。', 'O-hanami wa itsu desu ka.', 'Ngắm hoa là khi nào?'),
        S('{4月|しがつ}{6日|むいか}です。', 'Shigatsu muika desu.', 'Ngày 6 tháng 4.'),
        C('{何|なに}をしますか。', 'Nani o shimasu ka.', 'Làm gì?'),
        S('{桜|さくら}を{見|み}ます。お{弁当|べんとう}を{食|た}べます。', 'Sakura o mimasu. O-bentō o tabemasu.', 'Ngắm hoa anh đào. Ăn cơm hộp.'),
        C('{冬休|ふゆやす}みはいつからいつまでですか。', 'Fuyuyasumi wa itsu kara itsu made desu ka.', 'Nghỉ đông từ khi nào đến khi nào?'),
        S('{12月|じゅうにがつ}{20日|はつか}から{1月|いちがつ}{7日|なのか}までです。', 'Jūnigatsu hatsuka kara ichigatsu nanoka made desu.', 'Từ 20/12 đến 7/1.'),
        C('{留学生|りゅうがくせい}パーティーは{何時|なんじ}からですか。', 'Ryūgakusei pātī wa nanji kara desu ka.', 'Tiệc du học sinh bắt đầu từ mấy giờ?'),
        S('{午後|ごご}{2時|にじ}からです。{学校|がっこう}の{2階|にかい}です。', 'Gogo niji kara desu. Gakkō no nikai desu.', 'Từ 2 giờ chiều. Ở tầng 2 của trường.'),
        C('スキー{旅行|りょこう}はどこへ{行|い}きますか。', 'Sukī ryokō wa doko e ikimasu ka.', 'Du lịch trượt tuyết đi đâu?'),
        S('{長野|ながの}へ{行|い}きます。', 'Nagano e ikimasu.', 'Đi Nagano.'),
      ],
      [
        'Chỉ hỏi giờ bắt đầu: **何時からですか** → **～時からです** (không cần まで).',
        'Ngày 6 **むいか**, 7 **なのか**, 20 **はつか** — ba ngày hay đọc sai trên bảng lịch này.',
        'Xem **Ngữ pháp · Chuẩn bị ② — Thứ, tháng, ngày** và **Luyện nghe · Bài 6 (chép ngày)**.',
      ],
    ),

    ...trang(
      'Trang 58–59 · チャレンジ! どんな毎日？',
      'Trang 58: giờ giải lao trong lớp, hai bạn nữ nói chuyện (một người xách túi đồ ăn), một bạn nam đeo ba lô bước vào. Ô (1): dãy thứ trong tuần + dấu "?" + người ăn ở bàn có đồng hồ — hỏi "ngày nào cũng … à?"; ô (2): bát, cốc, hộp sữa — ăn gì, uống gì; ô (3): một bạn nữ ăn với đĩa và nĩa; ô (4): đồng hồ + người vừa thức dậy cạnh cửa sổ — mấy giờ dậy. Trang 59: bên trái một bạn nữ ngồi một mình ăn sandwich, uống hộp nước; bên phải sau giờ học, hai bạn đứng ở cửa lớp. Ô (5): ngôi nhà ban đêm, laptop, hai đồng hồ — buổi tối làm gì, từ mấy giờ đến mấy giờ; ô (6): 午後 (buổi chiều), người đi → dấu gạch chéo (không đi đâu) hoặc → quán cà phê — chiều nay đi đâu. **Mục tiêu できる:** nói và hỏi về sinh hoạt hằng ngày.',
      [
        C('{毎日|まいにち}、{朝|あさ}ご{飯|はん}を{食|た}べますか。', 'Mainichi, asagohan o tabemasu ka.', 'Ngày nào em cũng ăn sáng không?'),
        S('はい、{食|た}べます。', 'Hai, tabemasu.', 'Có, em ăn.'),
        C('{何|なに}を{食|た}べますか。', 'Nani o tabemasu ka.', 'Ăn gì?'),
        S('フォーやパンなどを{食|た}べます。', 'Fō ya pan nado o tabemasu.', 'Em ăn phở, bánh mì, v.v.'),
        C('{毎朝|まいあさ}、{何時|なんじ}に{起|お}きますか。', 'Maiasa, nanji ni okimasu ka.', 'Mỗi sáng mấy giờ em dậy?'),
        S('{6時半|ろくじはん}に{起|お}きます。', 'Rokuji han ni okimasu.', 'Em dậy lúc 6 giờ rưỡi.'),
        C('{毎晩|まいばん}、{何時|なんじ}に{寝|ね}ますか。', 'Maiban, nanji ni nemasu ka.', 'Mỗi tối mấy giờ em ngủ?'),
        S('{11時|じゅういちじ}に{寝|ね}ます。', 'Jūichiji ni nemasu.', 'Em ngủ lúc 11 giờ.'),
        C('{午後|ごご}、どこへ{行|い}きますか。', 'Gogo, doko e ikimasu ka.', 'Chiều nay em đi đâu?'),
        S('どこへも{行|い}きません。うちで{勉強|べんきょう}します。', 'Doko e mo ikimasen. Uchi de benkyō shimasu.', 'Em không đi đâu cả. Em học ở nhà.'),
      ],
      [
        '**ポイント 19** giờ cụ thể + **に** (6時半**に**起きます) — nhưng 毎朝／毎日／毎晩／今 KHÔNG có に.',
        '**ポイント 22** A **や** B **など** = A, B… (liệt kê vài thứ, còn nữa); **ポイント 23** **何も**／**どこへも** + Vません = không… gì / không đi đâu cả.',
        'Đề thi Lesson 3: **毎朝、何時に食べますか／何を買いますか・見ますか・読みますか・聞きますか／毎朝パンを食べますか／どこへ行きますか**.',
        'Xem **Hội thoại · ③** và **Ngữ pháp · ポイント 19, 22, 23**.',
      ],
    ),

    ...trang(
      'Trang 60–62 · 言ってみよう (chủ đề 3) — 6 bài tập về một ngày',
      '**Số 1 (tr.60):** "hằng ngày có … không?" — tranh lớp học với bong bóng: 例 laptop (dùng internet), ① cửa hàng tiện lợi "24" (đi combini), ② hộp sữa (uống sữa), ③ tờ báo (đọc báo), ④ bữa sáng (ăn sáng). **Số 2–3 (tr.60–61):** "có ăn sáng không?" — nhánh có: ăn gì, uống gì (dùng や…など); nhánh không: sáng không ăn gì cả, chỉ uống cà phê. Tranh bữa sáng: 例1 sữa chua, súp, bánh mì, sữa; 例2 sữa chua, trứng luộc, bánh mì, cà phê; ① trà, trái cây, trứng, bánh mì; ② cơm, súp miso, món kèm (bữa sáng kiểu Nhật); ③ sữa chua, salad, bánh mì, nước; ④ sữa chua, trứng, bánh mì, sữa. **Số 4–5 (tr.61):** mấy giờ làm gì / từ mấy giờ đến mấy giờ — tranh đồng hồ: 例1 mỗi sáng đến trường, 例2 mỗi ngày học, ① mỗi sáng (dậy), ② mỗi ngày (ngủ), ③ mỗi tối, ④ mỗi ngày + toà nhà (làm việc). Tranh ①–④ chỉ có đồng hồ và hình nhỏ — đoán động từ theo hình, trả lời theo giờ của BẠN (icon 💬). **Số 6 (tr.62):** "chiều nay đi đâu?" — 例1 không đi đâu, dùng internet ở nhà; 例2 thư viện, học tiếng Nhật; ① không đi đâu, đọc sách ở nhà; ② không đi đâu, dùng máy tính/điện thoại; ③ siêu thị, mua đồ (cá…); ④ quán cà phê, uống cà phê.',
      [
        C('{毎日|まいにち}、{新聞|しんぶん}を{読|よ}みますか。', 'Mainichi, shinbun o yomimasu ka.', 'Hằng ngày em có đọc báo không?'),
        S('いいえ、{読|よ}みません。', 'Iie, yomimasen.', 'Không, em không đọc.'),
        C('{毎日|まいにち}、コンビニへ{行|い}きますか。', 'Mainichi, konbini e ikimasu ka.', 'Ngày nào em cũng đi cửa hàng tiện lợi à?'),
        S('はい、{行|い}きます。', 'Hai, ikimasu.', 'Vâng, em đi.'),
        C('{朝|あさ}、{何|なに}を{飲|の}みますか。', 'Asa, nani o nomimasu ka.', 'Buổi sáng em uống gì?'),
        S('{牛乳|ぎゅうにゅう}を{飲|の}みます。', 'Gyūnyū o nomimasu.', 'Em uống sữa.'),
        C('{毎日|まいにち}、{何時|なんじ}から{何時|なんじ}まで{勉強|べんきょう}しますか。', 'Mainichi, nanji kara nanji made benkyō shimasu ka.', 'Mỗi ngày em học từ mấy giờ đến mấy giờ?'),
        S('{7時|しちじ}から{9時|くじ}まで{勉強|べんきょう}します。', 'Shichiji kara kuji made benkyō shimasu.', 'Em học từ 7 giờ đến 9 giờ.'),
        C('{午後|ごご}、どこへ{行|い}きますか。', 'Gogo, doko e ikimasu ka.', 'Chiều nay em đi đâu?'),
        S('{図書館|としょかん}へ{行|い}きます。{図書館|としょかん}で{本|ほん}を{読|よ}みます。', 'Toshokan e ikimasu. Toshokan de hon o yomimasu.', 'Em đi thư viện. Đọc sách ở thư viện.'),
      ],
      [
        'Không ăn gì: **何も食べません** (không phải 何を食べません). Không đi đâu: **どこへも行きません**.',
        'Hỏi 何時に～ますか → **～時に～ます**; hỏi 何時から何時まで → **～時から～時まで～ます** (giữ động từ ở cuối).',
        'Xem **Ngữ pháp · ポイント 19–23** và **Luyện nói · Câu hỏi không tranh ②③**.',
      ],
      [
        mau([
          E('{毎日|まいにち}、コンビニへ{行|い}きますか。— はい、{行|い}きます。', 'Mainichi, konbini e ikimasu ka. — Hai, ikimasu.', 'Số 1 ① (② {牛乳|ぎゅうにゅう}を{飲|の}みます, ③ {新聞|しんぶん}を{読|よ}みます, ④ {朝|あさ}ご{飯|はん}を{食|た}べます).'),
          E('ご{飯|はん}やみそ{汁|しる}などを{食|た}べます。お{茶|ちゃ}を{飲|の}みます。', 'Gohan ya misoshiru nado o tabemasu. O-cha o nomimasu.', 'Số 2–3 ② — bữa sáng kiểu Nhật.'),
          E('サラダやパンなどを{食|た}べます。ジュースを{飲|の}みます。', 'Sarada ya pan nado o tabemasu. Jūsu o nomimasu.', 'Số 2–3 ③.'),
          E('いいえ。{私|わたし}は{朝|あさ}、{何|なに}も{食|た}べません。{牛乳|ぎゅうにゅう}を{飲|の}みます。', 'Iie. Watashi wa asa, nani mo tabemasen. Gyūnyū o nomimasu.', 'Số 2–3 nhánh "không ăn gì".'),
          E('{毎朝|まいあさ}、{何時|なんじ}に{起|お}きますか。— {6時|ろくじ}に{起|お}きます。', 'Maiasa, nanji ni okimasu ka. — Rokuji ni okimasu.', 'Số 4–5 ① (đoán theo tranh).'),
          E('{毎日|まいにち}、{何時|なんじ}から{何時|なんじ}まで{働|はたら}きますか。— {9時|くじ}から{6時|ろくじ}まで{働|はたら}きます。', 'Mainichi, nanji kara nanji made hatarakimasu ka. — Kuji kara rokuji made hatarakimasu.', 'Số 4–5 ④ (toà nhà = công ty).'),
          E('どこへも{行|い}きません。うちで{本|ほん}を{読|よ}みます。', 'Doko e mo ikimasen. Uchi de hon o yomimasu.', 'Số 6 ①.'),
          E('スーパーへ{行|い}きます。スーパーで{魚|さかな}を{買|か}います。', 'Sūpā e ikimasu. Sūpā de sakana o kaimasu.', 'Số 6 ③.'),
          E('{喫茶店|きっさてん}へ{行|い}きます。{喫茶店|きっさてん}でコーヒーを{飲|の}みます。', 'Kissaten e ikimasu. Kissaten de kōhī o nomimasu.', 'Số 6 ④.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 63 · やってみよう・ペアで話しましょう (chủ đề 3) — Nghe "làm gì" · Rút thẻ nhập vai',
      '**やってみよう:** nghe và chọn việc mỗi người làm, tranh a–f: một anh ngồi ăn, một chị đọc báo, một anh dùng laptop, một chị uống trà, một anh ngồi viết/học, một anh cầm điều khiển xem TV. **Nói theo cặp:** A rút một thẻ và **nhập vai** người trên thẻ; B hỏi A về một ngày của người đó. Bốn thẻ: ⓐ anh che miệng ngáp (thiếu ngủ), ⓑ chị xoa vai (mỏi vai — làm việc nhiều), ⓒ chị cầm sổ tay và túi (bận rộn), ⓓ chị đọc báo. Cô đóng B, hỏi bạn — bạn phải bịa câu trả lời hợp với tranh.',
      [
        C('（thẻ ⓐ）{毎晩|まいばん}、{何時|なんじ}に{寝|ね}ますか。', 'Maiban, nanji ni nemasu ka.', '(thẻ ⓐ) Mỗi tối mấy giờ ngủ?'),
        S('{2時|にじ}に{寝|ね}ます。インターネットをします。', 'Niji ni nemasu. Intānetto o shimasu.', '2 giờ mới ngủ. (vì) dùng internet.'),
        C('{毎朝|まいあさ}、{何時|なんじ}に{起|お}きますか。', 'Maiasa, nanji ni okimasu ka.', 'Mỗi sáng mấy giờ dậy?'),
        S('{6時|ろくじ}に{起|お}きます。', 'Rokuji ni okimasu.', '6 giờ.'),
        C('（thẻ ⓑ）{毎日|まいにち}、{何時|なんじ}から{何時|なんじ}まで{働|はたら}きますか。', 'Mainichi, nanji kara nanji made hatarakimasu ka.', '(thẻ ⓑ) Mỗi ngày làm việc từ mấy giờ đến mấy giờ?'),
        S('{8時|はちじ}から{9時|くじ}まで{働|はたら}きます。', 'Hachiji kara kuji made hatarakimasu.', 'Làm từ 8 giờ đến 9 giờ (tối).'),
        C('（thẻ ⓓ）{毎朝|まいあさ}、{新聞|しんぶん}を{読|よ}みますか。', 'Maiasa, shinbun o yomimasu ka.', '(thẻ ⓓ) Sáng nào cũng đọc báo à?'),
        S('はい、{読|よ}みます。コーヒーも{飲|の}みます。', 'Hai, yomimasu. Kōhī mo nomimasu.', 'Vâng, đọc. Cũng uống cà phê.'),
      ],
      [
        '**Nhập vai = vẫn nói "tôi"** — không nói "người này…". Câu trả lời chỉ cần HỢP LÝ với tranh, không có đáp án duy nhất.',
        'Thêm một câu giải thích (インターネットをします) sẽ được điểm "hiểu câu hỏi" cao hơn.',
        'Xem **Luyện nghe · Bài 4** và **Luyện nói · Nói liền một đoạn**.',
      ],
    ),

    ...trang(
      'Trang 64 · できる! — Hỏi lịch trường / công ty của bạn',
      'Nhiệm vụ: hỏi giáo viên (hoặc người ở công ty) về lịch của trường/công ty bạn và điền hai bảng trống: bảng 1 — tên hoạt động + ( ) giờ ~ giờ (giờ học, giờ thư viện, giờ nghỉ trưa…); bảng 2 — tên sự kiện + ( ) tháng ngày ~ tháng ngày (kỳ thi, kỳ nghỉ, lễ…). Ở đây BẠN là người hỏi; sau đó cô sẽ hỏi lại bạn để kiểm tra.',
      [
        S('{先生|せんせい}、テストはいつですか。', 'Sensei, tesuto wa itsu desu ka.', '(bạn hỏi cô) Thưa cô, bài kiểm tra là khi nào ạ?'),
        C('{10月|じゅうがつ}{20日|はつか}です。', 'Jūgatsu hatsuka desu.', 'Ngày 20 tháng 10.'),
        C('FPT{大学|だいがく}の{授業|じゅぎょう}は{何時|なんじ}から{何時|なんじ}までですか。', 'Efu-pī-tī daigaku no jugyō wa nanji kara nanji made desu ka.', 'Giờ học ở ĐH FPT từ mấy giờ đến mấy giờ?'),
        S('{7時|しちじ}{30分|さんじゅっぷん}から{9時|くじ}{50分|ごじゅっぷん}までです。', 'Shichiji sanjuppun kara kuji gojuppun made desu.', 'Từ 7 giờ 30 đến 9 giờ 50. (theo lịch thật của bạn)'),
        C('テトの{休|やす}みはいつからいつまでですか。', 'Teto no yasumi wa itsu kara itsu made desu ka.', 'Nghỉ Tết từ khi nào đến khi nào?'),
        S('{2月|にがつ}{10日|とおか}から{2月|にがつ}{20日|はつか}までです。', 'Nigatsu tōka kara nigatsu hatsuka made desu.', 'Từ 10/2 đến 20/2.'),
      ],
      [
        'Hỏi cô dùng **先生、～はいつですか** — mở đầu gọi 先生 cho lịch sự.',
        'Phút đọc biến âm: 30分 **さんじゅっぷん**, 50分 **ごじゅっぷん**, 10分 **じゅっぷん**, 20分 **にじゅっぷん** (có thể nói 7時半 thay 7時30分).',
        'Xem **Hội thoại · できる！** và **Ngữ pháp · ポイント 21**.',
      ],
    ),

    ...trang(
      'Trang 64 · 話読聞書「私の1週間」 — Một tuần của tôi',
      'Ô 話読聞書 có đoạn văn ngắn của một học sinh trường tiếng Nhật kể về một tuần của mình: những ngày đi học và giờ học buổi sáng, cuối tuần (週末 — shūmatsu) đi thư viện đọc sách, hai ngày trong tuần làm thêm ở cửa hàng tiện lợi và giờ làm. Bên cạnh là hai câu gợi ý: hằng ngày làm gì, cuối tuần làm gì. Nhiệm vụ: đọc hiểu rồi **viết đoạn "một tuần của tôi"** của bạn. Đây đúng là dạng đoạn **Reading 40 điểm** của thi JPD113 (bài đọc mẫu trong hướng dẫn thi nói về một bạn đi học từ thứ Hai đến thứ Sáu, cuối tuần đi thư viện, làm thêm ở combini).',
      [
        C('{毎日|まいにち}、{何|なに}をしますか。', 'Mainichi, nani o shimasu ka.', 'Hằng ngày em làm gì?'),
        S('{月曜日|げつようび}から{金曜日|きんようび}まで{学校|がっこう}へ{行|い}きます。{日本語|にほんご}を{勉強|べんきょう}します。', 'Getsuyōbi kara kin’yōbi made gakkō e ikimasu. Nihongo o benkyō shimasu.', 'Từ thứ Hai đến thứ Sáu em đi học. Em học tiếng Nhật.'),
        C('{週末|しゅうまつ}、{何|なに}をしますか。', 'Shūmatsu, nani o shimasu ka.', 'Cuối tuần em làm gì?'),
        S('{図書館|としょかん}へ{行|い}きます。{図書館|としょかん}で{本|ほん}を{読|よ}みます。', 'Toshokan e ikimasu. Toshokan de hon o yomimasu.', 'Em đi thư viện, đọc sách ở thư viện.'),
        C('アルバイトをしますか。', 'Arubaito o shimasu ka.', 'Em có làm thêm không?'),
        S('はい、します。{土曜日|どようび}に{喫茶店|きっさてん}で{働|はたら}きます。', 'Hai, shimasu. Doyōbi ni kissaten de hatarakimasu.', 'Có. Thứ Bảy em làm ở quán cà phê.'),
      ],
      [
        'Thứ trong tuần + **に** (土曜日**に**) là được; 週末 và 毎日 thì KHÔNG thêm に.',
        'Đoạn 5–6 câu, mỗi câu một ý: đi học mấy ngày → giờ học → học gì → cuối tuần → làm thêm.',
        'Xem **Hội thoại · ④ 私の1週間** và **Luyện nói · Reading**.',
      ],
      [
        mau([
          E('{私|わたし}はFPT{大学|だいがく}の{学生|がくせい}です。{月曜日|げつようび}から{金曜日|きんようび}まで{学校|がっこう}へ{行|い}きます。{毎朝|まいあさ}{7時半|しちじはん}から{12時|じゅうにじ}まで{勉強|べんきょう}します。{週末|しゅうまつ}、{図書館|としょかん}へ{行|い}きます。{土曜日|どようび}、{喫茶店|きっさてん}でアルバイトをします。{6時|ろくじ}から{10時|じゅうじ}まで{働|はたら}きます。', 'Watashi wa Efu-pī-tī daigaku no gakusei desu. Getsuyōbi kara kin’yōbi made gakkō e ikimasu. Maiasa shichiji han kara jūniji made benkyō shimasu. Shūmatsu, toshokan e ikimasu. Doyōbi, kissaten de arubaito o shimasu. Rokuji kara jūji made hatarakimasu.', 'Đoạn mẫu "Một tuần của tôi" của bạn (thay bằng lịch thật).'),
        ]),
      ],
    ),

    { t: 'h', text: 'Trang 65 · ことば — Từ vựng của bài' },
    {
      t: 'p',
      text: 'Trang liệt kê từ mới theo 3 chủ đề (giờ, nơi công cộng; lịch năm, mùa, sự kiện, động từ đi/về/ăn/uống/xem/làm; sinh hoạt hằng ngày, đồ ăn, động từ mua/nghe/làm việc/đọc/dậy/ngủ/học/đến). Động từ có ghi nhóm 1, 2, 3 và thể từ điển trong ngoặc — tạm thời chỉ cần thể ます. Đủ nghĩa, romaji, ví dụ: xem mục **Từ vựng** của Bài 3.',
    },
    { t: 'note', title: 'Mẹo', items: ['14 động từ thể ます là trọng tâm: cô hay đọc tiếng Việt và bắt nói nhanh thể ます và ません — ôn ở **Từ vựng · G. 14 động từ**.', 'Xem **Từ vựng · Bài 3** và **Chữ Hán · Bài 3**.'] },

    ...trang(
      'Trang 66 · もう一度聞こう — Nghe lại cả bài',
      'Nghe lại đoạn ở trang 47, ba cảnh: **trong lớp** — thầy 本田 giới thiệu lịch của trường (ngày đi du lịch xe buýt, nghỉ hè từ… đến…); ダニエル hỏi パク nghỉ hè làm gì — パク về nước, còn ダニエル không về mà đi Hokkaido; **qua điện thoại** — パク hỏi thư viện mở từ mấy giờ đến mấy giờ (sáng 9 giờ đến chiều 5 giờ) và nghỉ ngày nào (thứ Hai); **sau giờ học** — アンナ hỏi パク chiều nay làm gì, パク đi thư viện, アンナ cũng đi. Cô sẽ hỏi lại các chi tiết.',
      [
        C('バス{旅行|りょこう}はいつですか。', 'Basu ryokō wa itsu desu ka.', 'Du lịch xe buýt là khi nào?'),
        S('{6月|ろくがつ}{24日|にじゅうよっか}です。', 'Rokugatsu nijūyokka desu.', 'Ngày 24 tháng 6.'),
        C('パクさんは{夏休|なつやす}み、{何|なに}をしますか。', 'Paku-san wa natsuyasumi, nani o shimasu ka.', 'Nghỉ hè Park làm gì?'),
        S('{国|くに}へ{帰|かえ}ります。', 'Kuni e kaerimasu.', 'Về nước.'),
        C('ダニエルさんも{国|くに}へ{帰|かえ}りますか。', 'Danieru-san mo kuni e kaerimasu ka.', 'Daniel cũng về nước à?'),
        S('いいえ、{帰|かえ}りません。{北海道|ほっかいどう}へ{行|い}きます。', 'Iie, kaerimasen. Hokkaidō e ikimasu.', 'Không, không về. Đi Hokkaido.'),
        C('{図書館|としょかん}の{休|やす}みはいつですか。', 'Toshokan no yasumi wa itsu desu ka.', 'Thư viện nghỉ khi nào?'),
        S('{月曜日|げつようび}です。', 'Getsuyōbi desu.', 'Thứ Hai.'),
        C('アンナさんは{午後|ごご}、どこへ{行|い}きますか。', 'Anna-san wa gogo, doko e ikimasu ka.', 'Chiều nay Anna đi đâu?'),
        S('{図書館|としょかん}へ{行|い}きます。', 'Toshokan e ikimasu.', 'Đi thư viện.'),
      ],
      [
        '**あっ、私も行きます** = "Ồ, tôi cũng đi" — も đứng sau người (私も), động từ giữ nguyên.',
        'Nghe hội thoại dài: chú ý người hỏi và người trả lời — câu hỏi của cô có thể về NGƯỜI THỨ HAI (ダニエルさんも…).',
        'Xem **Luyện nghe · Bài 2** và **Luyện nói · Câu hỏi không tranh**.',
      ],
    ),

    { t: 'h', text: 'Cô hỏi — bạn trả lời: ghép nhanh câu trả lời' },
    {
      t: 'build',
      id: 'b3-sach-ghep',
      title: 'Nghe câu hỏi (tiếng Việt) → ghép câu trả lời tiếng Nhật',
      items: [
        { vi: 'Cô hỏi 図書館は何時から何時までですか → "Từ 9 giờ đến 5 giờ."', chips: ['{9時|くじ}', 'から', '{5時|ごじ}', 'まで', 'です。', 'に'], answer: ['{9時|くじ}', 'から', '{5時|ごじ}', 'まで', 'です。'], ro: 'Kuji kara goji made desu.' },
        { vi: 'Cô hỏi 休みは何曜日ですか → "Thứ Bảy và Chủ nhật."', chips: ['{土曜日|どようび}と', '{日曜日|にちようび}', 'です。', 'から'], answer: ['{土曜日|どようび}と', '{日曜日|にちようび}', 'です。'], ro: 'Doyōbi to nichiyōbi desu.' },
        { vi: 'Cô hỏi 休みの日、どこへ行きますか → "Em đi thư viện."', chips: ['{図書館|としょかん}', 'へ', '{行|い}きます。', 'で', 'を'], answer: ['{図書館|としょかん}', 'へ', '{行|い}きます。'], ro: 'Toshokan e ikimasu.' },
        { vi: 'Cô hỏi 図書館で何をしますか → "Em học tiếng Nhật ở thư viện."', chips: ['{図書館|としょかん}で', '{日本語|にほんご}を', '{勉強|べんきょう}します。', '{図書館|としょかん}へ'], answer: ['{図書館|としょかん}で', '{日本語|にほんご}を', '{勉強|べんきょう}します。'], ro: 'Toshokan de nihongo o benkyō shimasu.' },
        { vi: 'Cô hỏi 毎朝、何時に起きますか → "Em dậy lúc 6 giờ rưỡi."', chips: ['{6時半|ろくじはん}', 'に', '{起|お}きます。', 'で', '{寝|ね}ます。'], answer: ['{6時半|ろくじはん}', 'に', '{起|お}きます。'], ro: 'Rokuji han ni okimasu.' },
        { vi: 'Cô hỏi 毎日、音楽を聞きますか → "Không, em không nghe."', chips: ['いいえ、', '{聞|き}きません。', '{聞|き}きます。', 'はい、'], answer: ['いいえ、', '{聞|き}きません。'], ro: 'Iie, kikimasen.' },
        { vi: 'Cô hỏi 朝、何を食べますか → "Em không ăn gì cả. Em uống cà phê."', chips: ['{何|なに}も', '{食|た}べません。', 'コーヒーを', '{飲|の}みます。', '{何|なに}を'], answer: ['{何|なに}も', '{食|た}べません。', 'コーヒーを', '{飲|の}みます。'], ro: 'Nani mo tabemasen. Kōhī o nomimasu.' },
        { vi: 'Cô hỏi 夏休み、国へ帰りますか → "Không, em không về. Em đi biển."', chips: ['いいえ、', '{帰|かえ}りません。', '{海|うみ}へ', '{行|い}きます。', '{海|うみ}で'], answer: ['いいえ、', '{帰|かえ}りません。', '{海|うみ}へ', '{行|い}きます。'], ro: 'Iie, kaerimasen. Umi e ikimasu.' },
      ],
    },
  ],
};

export const SACH: Record<number, Lesson> = { 1: SACH_1, 2: SACH_2, 3: SACH_3 };
