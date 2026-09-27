/**
 * "📖 Theo sách" — học kèm TỪNG TRANG sách できる日本語 初級 (Bài 4–6).
 * Phần tiếp của ./sach.ts (Bài 1–3), cùng khuôn: mỗi trang = tiêu đề (số trang +
 * mục) → tả tranh bằng lời của mình + mục tiêu できる → cô hỏi–bạn đáp → mẹo trả
 * lời (chỉ tới ポイント và mục trên web) → câu mẫu cho từng số của 言ってみよう.
 *
 * Quy tắc (../SOAN-BAI.md): KHÔNG chép sách — tranh được TẢ LẠI, hội thoại viết
 * mới, bài đọc 話読聞書 thay bằng bài của người học; KHÔNG đưa đáp án bài nghe
 * CD (やってみよう) — chỉ nói cần nghe từ nào. Mọi câu tiếng Nhật có `ro` + `vi`;
 * chữ Hán viết {漢字|かな}. Người học mẫu: "ミン" (Minh), sinh viên Việt ở ĐH FPT,
 * quê Hà Nội — khi luyện thì thay bằng thông tin THẬT của bạn.
 *
 * Số trang = số in trên sách (bài 4 p.67–82, bài 5 p.83–100, bài 6 p.101–116).
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
    'Không nghe rõ câu cô hỏi: nói **もう{一度|いちど}お{願|ねが}いします** (mō ichido onegaishimasu — xin cô nói lại một lần nữa).',
    'Bài nghe やってみよう: ở đây KHÔNG ghi đáp án CD — chỉ ghi cần bắt từ nào. Nghe trên lớp rồi tự điền.',
    'Chỗ nào có tên ミン (Minh), ハノイ (Hà Nội), FPT{大学|だいがく}… là thông tin mẫu — thay bằng thông tin THẬT của bạn.',
  ],
};

/* ══════════════════════════ BÀI 4 — 私の国・町 ══════════════════════════ */

const SACH_4: Lesson = {
  id: 'b4-sach',
  kind: 'review',
  title: 'Theo sách — Bài 4 (trang 67–82)',
  goal: 'Nhìn bản đồ, ảnh phong cảnh, tranh thời tiết trong sách là hỏi–đáp được: quê ở đâu, đi mất bao lâu, là nơi thế nào, có gì, thời tiết và món ăn ra sao.',
  minutes: 60,
  blocks: [
    CACH_DUNG,

    ...trang(
      'Trang 67 · 話してみよう・聞いてみよう — Mở bài 私の国・町',
      '**話してみよう** — 4 tranh không lời: (1) một người mặc đồ trượt tuyết cầm gậy đứng trên núi tuyết, xa xa có người đang trượt; (2) một gia đình ba người ngồi quanh bàn tròn ăn mì, có đũa, bát và chai nước tương; (3) một **ảnh chụp thật** con sông giữa thành phố, bên bờ có tòa tháp rất cao và nhà cửa, trên sông có thuyền; (4) một đôi nam nữ tạo dáng chụp ảnh trước nhà hát hình vỏ sò nổi tiếng của nước Úc. Mục đích: nói về đất nước, thành phố, phong cảnh, thời tiết và món ăn. **聞いてみよう**: nghe trước cả đoạn hội thoại của bài (một bạn hỏi bạn người Thái về quê) — chính là trang 82.',
      [
        C('（tranh 4）ここはどこですか。', '(tranh 4) Koko wa doko desu ka.', '(tranh 4) Đây là đâu?'),
        S('オーストラリアです。シドニーです。', 'Ōsutoraria desu. Shidonī desu.', 'Là nước Úc. Là Sydney.'),
        C('（tranh 1）{冬|ふゆ}ですか。', '(tranh 1) Fuyu desu ka.', '(tranh 1) Mùa đông à?'),
        S('はい、{冬|ふゆ}です。{雪|ゆき}が{多|おお}いです。', 'Hai, fuyu desu. Yuki ga ōi desu.', 'Vâng, mùa đông. Tuyết nhiều.'),
        C('（tranh 3）どんなところですか。', '(tranh 3) Donna tokoro desu ka.', '(tranh 3) Là nơi thế nào?'),
        S('{大|おお}きい{町|まち}です。{高|たか}いビルがあります。', 'Ōkii machi desu. Takai biru ga arimasu.', 'Là thành phố lớn. Có tòa nhà cao.'),
        C('ミンさんのお{国|くに}はどちらですか。', 'Min-san no o-kuni wa dochira desu ka.', 'Minh đến từ nước nào?'),
        S('ベトナムです。ハノイです。', 'Betonamu desu. Hanoi desu.', 'Việt Nam ạ. Hà Nội.'),
      ],
      [
        'Chưa học hết bài thì trả lời bằng mẫu của Bài 1–2 (ここは～です, ～です) cũng được; cô chỉ cần bạn gọi đúng tên nơi.',
        'Tính từ đầu tiên cần thuộc cho trang này: **{大|おお}きい** (lớn), **{高|たか}い** (cao), **{寒|さむ}い** (lạnh), **{雪|ゆき}が{多|おお}い** (nhiều tuyết).',
        'Xem **Hội thoại · Học xong bài này bạn làm được gì?** và **Từ vựng · 4, 5, 7**.',
      ],
    ),

    ...trang(
      'Trang 68–69 · チャレンジ! どこ？',
      'Trang 68: trong lớp, một bạn nữ đứng chỉ tay lên **bản đồ thế giới** dán trên tường, hai bạn nam ngồi nhìn theo. Ô (1): một bạn hỏi nước (quả địa cầu + dấu "?") → bạn đeo kính trả lời "タイ", rồi nói tên thành phố "アユタヤ"; ô (2): bạn kia không biết アユタヤ ở đâu, bạn đeo kính chỉ vào hình nước Thái. Trang 69: bạn đeo kính ngồi viết vở cạnh bản đồ. Ô (2) nhỏ: mũi tên từ 東京 tới バンコク ghi **6h** (máy bay), hỏi đến アユタヤ mất bao lâu; ô (3): trong nước Thái, バンコク → アユタヤ đi xe buýt **1.5h**. **Mục tiêu できる:** nói và hỏi quê mình ở đâu (phía nào của nước), từ đó đến Nhật mất bao lâu, đi bằng gì.',
      [
        C('ミンさんのお{国|くに}はどちらですか。', 'Min-san no o-kuni wa dochira desu ka.', 'Minh đến từ nước nào?'),
        S('ベトナムです。', 'Betonamu desu.', 'Việt Nam ạ.'),
        C('ベトナムのどこですか。', 'Betonamu no doko desu ka.', 'Ở đâu của Việt Nam?'),
        S('ハノイです。', 'Hanoi desu.', 'Hà Nội ạ.'),
        C('ハノイはどこですか。', 'Hanoi wa doko desu ka.', 'Hà Nội ở đâu?'),
        S('ハノイはベトナムの{北|きた}です。', 'Hanoi wa Betonamu no kita desu.', 'Hà Nội ở phía bắc Việt Nam.'),
        C('ハノイから{東京|とうきょう}までどのくらいですか。', 'Hanoi kara Tōkyō made dono kurai desu ka.', 'Từ Hà Nội đến Tokyo mất bao lâu?'),
        S('{飛行機|ひこうき}で{5時間|ごじかん}くらいです。', 'Hikōki de gojikan kurai desu.', 'Đi máy bay khoảng 5 tiếng.'),
        C('（ô 3）バンコクからアユタヤまで{何|なん}で{行|い}きますか。', '(ô 3) Bankoku kara Ayutaya made nan de ikimasu ka.', '(ô 3) Từ Bangkok đến Ayutthaya đi bằng gì?'),
        S('バスで{行|い}きます。{1時間半|いちじかんはん}くらいです。', 'Basu de ikimasu. Ichijikan han kurai desu.', 'Đi xe buýt. Khoảng 1 tiếng rưỡi.'),
      ],
      [
        '**ポイント 29**: (thành phố)は(nước)の **{東|ひがし}／{西|にし}／{南|みなみ}／{北|きた}／{真|ま}ん{中|なか}** です. Hà Nội = 北, Huế／Đà Nẵng = 真ん中, TP.HCM = 南.',
        '**ポイント 30**: **AからBまでどのくらいですか** → **～{時間|じかん}／～{時間半|じかんはん}／～{分|ふん} くらいです**. **ポイント 31**: phương tiện + **で** (飛行機で, バスで, 電車で); đi bộ là **{歩|ある}いて** (KHÔNG có で).',
        'Hà Nội → Tokyo bay thẳng khoảng 5–6 tiếng; nói số nào cũng được miễn đúng mẫu.',
        'Xem **Hội thoại · Tình huống 1** và **Ngữ pháp · ポイント 29, 30, 31**.',
      ],
    ),

    ...trang(
      'Trang 70 · 言ってみよう (chủ đề 1) — Ở đâu của nước nào · Mất bao lâu',
      '**Số 1:** bản đồ thế giới có la bàn (北 trên, 南 dưới, 西 trái, 東 phải); hỏi nước → hỏi thành phố → hỏi thành phố đó nằm phía nào. Gợi ý: 例 Úc／Sydney, ① Hàn Quốc／Seoul, ② Mỹ／Los Angeles. **Số 2/3:** hỏi "từ Tokyo đến … mất bao lâu", trả lời hai chặng: bay tới thủ đô, rồi đi tiếp. Các bản đồ nhỏ ghi số giờ: 例 Tokyo → Bangkok bay 6 tiếng, Bangkok → Ayutthaya xe buýt 1,5 tiếng; ① Tokyo → Seoul bay 2,5 tiếng, Seoul → Daegu 3,5 tiếng; ② Tokyo → Rome bay 12,5 tiếng, Rome → Napoli 1 tiếng. Đọc đúng số và phương tiện vẽ trong tranh.',
      [
        C('（①）お{国|くに}はどちらですか。', '(1) O-kuni wa dochira desu ka.', '(①) Bạn đến từ nước nào?'),
        S('{韓国|かんこく}です。', 'Kankoku desu.', 'Hàn Quốc.'),
        C('{韓国|かんこく}のどこですか。', 'Kankoku no doko desu ka.', 'Ở đâu của Hàn Quốc?'),
        S('ソウルです。ソウルは{韓国|かんこく}の{北|きた}です。', 'Sōru desu. Sōru wa Kankoku no kita desu.', 'Seoul. Seoul ở phía bắc Hàn Quốc.'),
        C('（②）{東京|とうきょう}からナポリまでどのくらいですか。', '(2) Tōkyō kara Napori made dono kurai desu ka.', '(②) Từ Tokyo đến Napoli mất bao lâu?'),
        S('{東京|とうきょう}からローマまで{飛行機|ひこうき}で{12時間半|じゅうにじかんはん}くらいです。ローマからナポリまで{1時間|いちじかん}くらいです。', 'Tōkyō kara Rōma made hikōki de jūnijikan han kurai desu. Rōma kara Napori made ichijikan kurai desu.', 'Từ Tokyo đến Rome đi máy bay khoảng 12 tiếng rưỡi. Từ Rome đến Napoli khoảng 1 tiếng.'),
        C('へえ、{遠|とお}いですね。', 'Hē, tōi desu ne.', 'Ồ, xa nhỉ.'),
        S('はい、{遠|とお}いです。', 'Hai, tōi desu.', 'Vâng, xa ạ.'),
      ],
      [
        'Ba câu hỏi liền nhau luôn theo thứ tự **お国は → ～のどこ → ～はどこ** — nghe câu thứ ba (～はどこですか) thì trả lời bằng **phương hướng** (ポイント 29), không nhắc lại tên thành phố một mình.',
        'Đọc giờ: 2,5 = **{2時間半|にじかんはん}**, 3,5 = **{3時間半|さんじかんはん}**, 12,5 = **{12時間半|じゅうにじかんはん}**. くらい = khoảng (đặt SAU số).',
        'Nghe **へえ** (ồ, thế à) là người nghe ngạc nhiên — không cần trả lời thêm.',
        'Xem **Ngữ pháp · ポイント 29–31** và **Luyện nói · Câu hỏi KHÔNG có tranh**.',
      ],
      [
        mau([
          E('お{国|くに}はどちらですか。— オーストラリアです。— オーストラリアのどこですか。— シドニーです。シドニーはオーストラリアの{東|ひがし}です。', 'O-kuni wa dochira desu ka. — Ōsutoraria desu. — Ōsutoraria no doko desu ka. — Shidonī desu. Shidonī wa Ōsutoraria no higashi desu.', 'Số 1 例 — Úc／Sydney (phía đông).'),
          E('{韓国|かんこく}です。— ソウルです。ソウルは{韓国|かんこく}の{北|きた}です。', 'Kankoku desu. — Sōru desu. Sōru wa Kankoku no kita desu.', 'Số 1 ① — Hàn Quốc／Seoul (phía bắc).'),
          E('アメリカです。— ロサンゼルスです。ロサンゼルスはアメリカの{西|にし}です。', 'Amerika desu. — Rosanzerusu desu. Rosanzerusu wa Amerika no nishi desu.', 'Số 1 ② — Mỹ／Los Angeles (phía tây).'),
          E('{東京|とうきょう}からバンコクまで{飛行機|ひこうき}で{6時間|ろくじかん}くらいです。バンコクからアユタヤまでバスで{1時間半|いちじかんはん}くらいです。', 'Tōkyō kara Bankoku made hikōki de rokujikan kurai desu. Bankoku kara Ayutaya made basu de ichijikan han kurai desu.', 'Số 2/3 例 — hai chặng.'),
          E('{東京|とうきょう}からソウルまで{飛行機|ひこうき}で{2時間半|にじかんはん}くらいです。ソウルからテグまで{電車|でんしゃ}で{3時間半|さんじかんはん}くらいです。', 'Tōkyō kara Sōru made hikōki de nijikan han kurai desu. Sōru kara Tegu made densha de sanjikan han kurai desu.', 'Số 2/3 ① — Seoul, Daegu (phương tiện chặng 2: nói theo hình trong tranh).'),
          E('{東京|とうきょう}からローマまで{飛行機|ひこうき}で{12時間半|じゅうにじかんはん}くらいです。ローマからナポリまで{1時間|いちじかん}くらいです。', 'Tōkyō kara Rōma made hikōki de jūnijikan han kurai desu. Rōma kara Napori made ichijikan kurai desu.', 'Số 2/3 ② — Rome, Napoli.'),
          E('{東京|とうきょう}からハノイまで{飛行機|ひこうき}で{5時間半|ごじかんはん}くらいです。', 'Tōkyō kara Hanoi made hikōki de gojikan han kurai desu.', '☺ nói về bạn — Tokyo → Hà Nội.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 71 · やってみよう (chủ đề 1) — Nghe: quê của ワン ở đâu, bao lâu',
      'Bài nghe CD: bạn ワン kể về quê mình. Bên trái là bản đồ thế giới có 4 điểm a, b, c, d (a gần Nhật / Đông Á, b gần Úc, c ở Bắc Mỹ, d ở Nam Mỹ) — khoanh điểm đúng; cột phải "どのくらい" để trống — ghi thời gian đi. Nghe để bắt: **tên nước**, **phương hướng** (東西南北), **số giờ + 時間／時間半** và **phương tiện + で**. Dòng ■ cuối trang: cùng bạn cùng lớp nhìn bản đồ, nói quê mình ở đâu, cách Nhật bao lâu — cô sẽ gọi bạn lên nói về quê BẠN.',
      [
        C('ミンさんの{町|まち}はどこですか。', 'Min-san no machi wa doko desu ka.', 'Thành phố của Minh ở đâu?'),
        S('ハノイです。ベトナムの{北|きた}です。', 'Hanoi desu. Betonamu no kita desu.', 'Hà Nội ạ. Ở phía bắc Việt Nam.'),
        C('{日本|にほん}からどのくらいですか。', 'Nihon kara dono kurai desu ka.', 'Từ Nhật mất bao lâu?'),
        S('{飛行機|ひこうき}で{5時間半|ごじかんはん}くらいです。', 'Hikōki de gojikan han kurai desu.', 'Đi máy bay khoảng 5 tiếng rưỡi.'),
        C('うちから{学校|がっこう}までどのくらいですか。', 'Uchi kara gakkō made dono kurai desu ka.', 'Từ nhà đến trường mất bao lâu?'),
        S('バイクで{20分|にじゅっぷん}くらいです。', 'Baiku de nijuppun kurai desu.', 'Đi xe máy khoảng 20 phút.'),
        C('{歩|ある}いてどのくらいですか。', 'Aruite dono kurai desu ka.', 'Đi bộ thì bao lâu?'),
        S('{歩|ある}いて{1時間|いちじかん}くらいです。', 'Aruite ichijikan kurai desu.', 'Đi bộ khoảng 1 tiếng.'),
      ],
      [
        'Câu "うちから学校までどのくらいですか" là câu **đề thi JPD113 Bài 4** hay gặp nhất — thuộc sẵn câu trả lời thật của bạn.',
        'Phút đọc lệch: 1 **いっぷん**, 3 **さんぷん**, 5 **ごふん**, 10 **じゅっぷん**, 15 **じゅうごふん**, 20 **にじゅっぷん**, 30 **さんじゅっぷん**.',
        'Xe máy = **バイク**; xe đạp = **{自転車|じてんしゃ}** (Bài 5); đi bộ = **{歩|ある}いて** (không thêm で).',
        'Luyện dạng nghe này: **Luyện nghe · Bài 1 và Bài 2**.',
      ],
    ),

    ...trang(
      'Trang 72–73 · チャレンジ! どんなところ？',
      'Trang 72: trong lớp, hai bạn nam ngồi cạnh bản đồ, một bạn cầm tấm ảnh nhỏ cho bạn kia xem. Ô (1): ảnh con sông có thuyền và cây; ô (2): cả hai giơ tay, bong bóng vẽ nhà cao tầng — nói thành phố của mình lớn hay nhỏ; ô (3): cận cảnh ảnh một ngôi chùa/tháp cổ giữa cây xanh; ô (4): hỏi "thành phố?" → bạn nữ trả lời **モスクワ**, bong bóng vẽ quảng trường đông người. Trang 73: cô giáo giơ tấm ảnh cho một bạn nữ xem. Ô (5): hỏi "Moskva là nơi thế nào?" → bong bóng vẽ nhà thờ mái vòm củ hành lấp lánh (đẹp, nổi tiếng); ô (6): một bạn nam người Úc, quê **パース**, có con sông **スワン川**; ô (7): so sánh thành phố, mặt cười. **Mục tiêu できる:** nói quê mình là nơi thế nào, ở đó có gì; hỏi người khác về quê họ.',
      [
        C('ミンさんの{町|まち}はどんなところですか。', 'Min-san no machi wa donna tokoro desu ka.', 'Thành phố của Minh là nơi thế nào?'),
        S('にぎやかなところです。そして、{古|ふる}いです。', 'Nigiyaka na tokoro desu. Soshite, furui desu.', 'Là nơi nhộn nhịp. Và cổ kính.'),
        C('ハノイに{何|なに}がありますか。', 'Hanoi ni nani ga arimasu ka.', 'Ở Hà Nội có gì?'),
        S('{古|ふる}いお{寺|てら}があります。', 'Furui o-tera ga arimasu.', 'Có chùa cổ.'),
        C('ハノイは{大|おお}きいですか。', 'Hanoi wa ōkii desu ka.', 'Hà Nội lớn không?'),
        S('はい、{大|おお}きいです。{人|ひと}が{多|おお}いです。', 'Hai, ōkii desu. Hito ga ōi desu.', 'Vâng, lớn. Đông người.'),
        C('（ô 5）モスクワはどんなところですか。', '(ô 5) Mosukuwa wa donna tokoro desu ka.', '(ô 5) Moskva là nơi thế nào?'),
        S('きれいなところです。{有名|ゆうめい}な{教会|きょうかい}があります。', 'Kirei na tokoro desu. Yūmei na kyōkai ga arimasu.', 'Là nơi đẹp. Có nhà thờ nổi tiếng.'),
      ],
      [
        '**ポイント 32** どんなN → trả lời **A + N**: イA giữ nguyên (**{古|ふる}い**お寺), ナA thêm **な** (にぎやか**な**ところ) — **ポイント 25**.',
        '**ポイント 28**: nơi **に** vật **が あります** (ハノイ**に**お寺**が**あります). Hỏi: 何がありますか.',
        '**ポイント 34 そして** (và, thêm ý cùng chiều) — **ポイント 35 ～が、～** (nhưng, ý ngược chiều): 大きくないですが、きれいです.',
        'Xem **Hội thoại · Tình huống 2** và **Ngữ pháp · ポイント 24, 25, 28, 32, 34, 35**.',
      ],
    ),

    ...trang(
      'Trang 74 · 言ってみよう (chủ đề 2) — Số 1–3: tả thành phố, câu hỏi có/không, "đây là …"',
      '**Số 1:** 6 tranh phố xá để chọn tính từ: 例 phố có cổng trang trí, đèn lồng, nhiều cửa hàng và xe (nhộn nhịp); ① phố châu Âu nhà gạch đỏ, tháp nhà thờ, vắng người; ② phố mua sắm có mái che rất đông người; ③ phố có mái che nhưng vắng; ④ thị trấn nhỏ ven cảng có thuyền; ⑤ trung tâm thành phố nhiều nhà cao tầng, ô tô. **Số 2:** hỏi "thành phố của B … không?" — trả lời cả hai nhánh: 例1 lớn, 例2 nhộn nhịp, ① nhiều cây xanh, ② đông người, ③ yên tĩnh. **Số 3:** ảnh địa danh Nhật + chú thích: 例 một ngôi chùa gỗ cổ có tháp năm tầng (cũ・chùa), ① lâu đài trắng nhiều tầng mái (lớn・lâu đài), ② ngọn núi có đền nhỏ giữa rừng (đẹp・núi), ③ công viên rộng có đồi và đường mòn (lớn・công viên).',
      [
        C('（①）この{町|まち}はにぎやかですか。', '(1) Kono machi wa nigiyaka desu ka.', '(①) Thành phố này có nhộn nhịp không?'),
        S('いいえ、にぎやかじゃありません。{静|しず}かです。', 'Iie, nigiyaka ja arimasen. Shizuka desu.', 'Không, không nhộn nhịp. Yên tĩnh.'),
        C('ミンさんの{町|まち}は{緑|みどり}が{多|おお}いですか。', 'Min-san no machi wa midori ga ōi desu ka.', 'Thành phố của Minh có nhiều cây xanh không?'),
        S('いいえ、あまり{多|おお}くないです。', 'Iie, amari ōku nai desu.', 'Không, không nhiều lắm.'),
        C('ハノイは{静|しず}かですか。', 'Hanoi wa shizuka desu ka.', 'Hà Nội có yên tĩnh không?'),
        S('いいえ、{静|しず}かじゃありません。にぎやかです。', 'Iie, shizuka ja arimasen. Nigiyaka desu.', 'Không, không yên tĩnh. Nhộn nhịp.'),
        C('（số 3 ①）これは{何|なん}ですか。', '(số 3, 1) Kore wa nan desu ka.', '(số 3, ①) Đây là gì?'),
        S('{姫路城|ひめじじょう}です。{大|おお}きいお{城|しろ}です。', 'Himeji-jō desu. Ōkii o-shiro desu.', 'Là thành Himeji. Là tòa lâu đài lớn.'),
      ],
      [
        '**ポイント 24** phủ định: イA bỏ い thêm **くないです** (大きい → 大きくないです); ナA thêm **じゃありません** (静か → 静かじゃありません). Đặc biệt: **いい → よくないです**.',
        '**{多|おお}い** là イA: nhiều → **{多|おお}くないです**. Không nói 多いじゃありません.',
        'きれい kết thúc bằng い nhưng là **ナA** (きれい**な**山, きれい**じゃありません**) — bẫy hay gặp.',
        'Xem **Ngữ pháp · ポイント 24, 25** (bảng chia tính từ) và **Từ vựng · 5, 6**.',
      ],
      [
        mau([
          E('{私|わたし}の{町|まち}はにぎやかです。', 'Watashi no machi wa nigiyaka desu.', 'Số 1 例 — nhộn nhịp.'),
          E('{私|わたし}の{町|まち}は{静|しず}かです。{古|ふる}いです。', 'Watashi no machi wa shizuka desu. Furui desu.', 'Số 1 ① — yên tĩnh, cổ.'),
          E('{私|わたし}の{町|まち}は{人|ひと}が{多|おお}いです。', 'Watashi no machi wa hito ga ōi desu.', 'Số 1 ② — đông người.'),
          E('{私|わたし}の{町|まち}はあまりにぎやかじゃありません。', 'Watashi no machi wa amari nigiyaka ja arimasen.', 'Số 1 ③ — không nhộn nhịp lắm.'),
          E('{私|わたし}の{町|まち}は{小|ちい}さいです。きれいです。', 'Watashi no machi wa chiisai desu. Kirei desu.', 'Số 1 ④ — nhỏ, đẹp.'),
          E('{私|わたし}の{町|まち}は{大|おお}きいです。ビルが{多|おお}いです。', 'Watashi no machi wa ōkii desu. Biru ga ōi desu.', 'Số 1 ⑤ — lớn, nhiều tòa nhà.'),
          E('Bさんの{町|まち}は{大|おお}きいですか。— はい、{大|おお}きいです。／いいえ、{大|おお}きくないです。', 'B-san no machi wa ōkii desu ka. — Hai, ōkii desu. / Iie, ōkiku nai desu.', 'Số 2 例1 — lớn.'),
          E('— はい、にぎやかです。／いいえ、にぎやかじゃありません。', '— Hai, nigiyaka desu. / Iie, nigiyaka ja arimasen.', 'Số 2 例2 — nhộn nhịp.'),
          E('{緑|みどり}が{多|おお}いですか。— はい、{多|おお}いです。／いいえ、{多|おお}くないです。', 'Midori ga ōi desu ka. — Hai, ōi desu. / Iie, ōku nai desu.', 'Số 2 ① — nhiều cây xanh.'),
          E('{人|ひと}が{多|おお}いですか。— はい、{多|おお}いです。／いいえ、{多|おお}くないです。', 'Hito ga ōi desu ka. — Hai, ōi desu. / Iie, ōku nai desu.', 'Số 2 ② — đông người.'),
          E('{静|しず}かですか。— はい、{静|しず}かです。／いいえ、{静|しず}かじゃありません。', 'Shizuka desu ka. — Hai, shizuka desu. / Iie, shizuka ja arimasen.', 'Số 2 ③ — yên tĩnh.'),
          E('これは{法隆寺|ほうりゅうじ}です。{法隆寺|ほうりゅうじ}は{古|ふる}いお{寺|てら}です。', 'Kore wa Hōryūji desu. Hōryūji wa furui o-tera desu.', 'Số 3 例 — chùa cổ.'),
          E('これは{姫路城|ひめじじょう}です。{姫路城|ひめじじょう}は{大|おお}きいお{城|しろ}です。', 'Kore wa Himeji-jō desu. Himeji-jō wa ōkii o-shiro desu.', 'Số 3 ① — lâu đài lớn.'),
          E('これは{高尾山|たかおさん}です。{高尾山|たかおさん}はきれいな{山|やま}です。', 'Kore wa Takaosan desu. Takaosan wa kirei na yama desu.', 'Số 3 ② — núi đẹp (きれい + な).'),
          E('これはみどり{公園|こうえん}です。みどり{公園|こうえん}は{大|おお}きい{公園|こうえん}です。', 'Kore wa Midori kōen desu. Midori kōen wa ōkii kōen desu.', 'Số 3 ③ — công viên lớn.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 75 · 言ってみよう (chủ đề 2) — Số 4–7: どんなところ · 何がありますか · そして／が',
      '**Số 4:** hỏi "thành phố của B là nơi thế nào?" — gợi ý: 例 nhộn nhịp・nơi, ① tốt・nơi, ② yên tĩnh・nơi, ③ cổ・thành phố, ④ nhỏ・thành phố. **Số 5:** hỏi "ở đó có gì?" rồi hỏi tiếp "… thế nào?": 例 lâu đài／lớn, ① nhà thờ／đẹp, ② chùa／cổ, ③ công viên／lớn. **Số 6 và 7:** nói liền một đoạn 3–4 câu, kèm ảnh thật một lâu đài và một ngọn núi có đền: số 6 nối hai ý tốt bằng **そして**, số 7 nối hai ý ngược nhau bằng **～が、**. Câu mẫu dưới đây dùng địa danh Việt Nam — trên lớp nói theo ảnh trong sách hoặc quê bạn.',
      [
        C('ミンさんの{町|まち}はどんなところですか。', 'Min-san no machi wa donna tokoro desu ka.', 'Thành phố của Minh là nơi thế nào?'),
        S('いいところです。', 'Ii tokoro desu.', 'Là nơi tốt (dễ sống).'),
        C('ハノイに{何|なに}がありますか。', 'Hanoi ni nani ga arimasu ka.', 'Ở Hà Nội có gì?'),
        S('{湖|みずうみ}があります。', 'Mizuumi ga arimasu.', 'Có hồ.'),
        C('どんな{湖|みずうみ}ですか。', 'Donna mizuumi desu ka.', 'Hồ thế nào?'),
        S('{小|ちい}さいですが、とてもきれいな{湖|みずうみ}です。', 'Chiisai desu ga, totemo kirei na mizuumi desu.', 'Nhỏ, nhưng là cái hồ rất đẹp.'),
        C('{町|まち}の{紹介|しょうかい}をしてください。', 'Machi no shōkai o shite kudasai.', 'Em giới thiệu thành phố của em đi.'),
        S('{私|わたし}の{町|まち}に{古|ふる}いお{寺|てら}があります。{一柱寺|いっちゅうじ}です。{小|ちい}さいですが、{有名|ゆうめい}です。そして、きれいです。', 'Watashi no machi ni furui o-tera ga arimasu. Icchūji desu. Chiisai desu ga, yūmei desu. Soshite, kirei desu.', 'Thành phố tôi có ngôi chùa cổ. Là chùa Một Cột. Nhỏ nhưng nổi tiếng. Và đẹp.'),
      ],
      [
        'Số 4: **どんなところ** → **A + ところ／町 + です**. ③④ dùng 町: **{古|ふる}い{町|まち}です**, **{小|ちい}さい{町|まち}です**.',
        'Số 5: hỏi hai bước **何がありますか → どんなNですか**; câu trả lời thứ hai = **A + N + です** (きれい**な**教会です).',
        '**そして** đứng đầu câu sau (…です。そして、…です。); **が** nối giữa câu, sau です (…低いです**が**、きれいです). Không nói そしてが.',
        '{湖|みずうみ} (hồ) không có trong danh sách của cô — nếu quên thì nói {川|かわ} (sông) hoặc {公園|こうえん}.',
        'Xem **Hội thoại · Đọc – nói: 私の町** và **Luyện nói · Bài nói liền — 私の町**.',
      ],
      [
        mau([
          E('Bさんの{町|まち}はどんなところですか。— にぎやかなところです。', 'B-san no machi wa donna tokoro desu ka. — Nigiyaka na tokoro desu.', 'Số 4 例.'),
          E('いいところです。', 'Ii tokoro desu.', 'Số 4 ① — nơi tốt.'),
          E('{静|しず}かなところです。', 'Shizuka na tokoro desu.', 'Số 4 ② — nơi yên tĩnh.'),
          E('{古|ふる}い{町|まち}です。', 'Furui machi desu.', 'Số 4 ③ — thành phố cổ.'),
          E('{小|ちい}さい{町|まち}です。', 'Chiisai machi desu.', 'Số 4 ④ — thành phố nhỏ.'),
          E('{何|なに}がありますか。— お{城|しろ}があります。— どんなお{城|しろ}ですか。— {大|おお}きいお{城|しろ}です。', 'Nani ga arimasu ka. — O-shiro ga arimasu. — Donna o-shiro desu ka. — Ōkii o-shiro desu.', 'Số 5 例 — lâu đài lớn.'),
          E('{教会|きょうかい}があります。— きれいな{教会|きょうかい}です。', 'Kyōkai ga arimasu. — Kirei na kyōkai desu.', 'Số 5 ① — nhà thờ đẹp.'),
          E('お{寺|てら}があります。— {古|ふる}いお{寺|てら}です。', 'O-tera ga arimasu. — Furui o-tera desu.', 'Số 5 ② — chùa cổ.'),
          E('{公園|こうえん}があります。— {大|おお}きい{公園|こうえん}です。', 'Kōen ga arimasu. — Ōkii kōen desu.', 'Số 5 ③ — công viên lớn.'),
          E('フエに{古|ふる}いお{城|しろ}があります。フエのお{城|しろ}はきれいです。そして、{有名|ゆうめい}です。', 'Fue ni furui o-shiro ga arimasu. Fue no o-shiro wa kirei desu. Soshite, yūmei desu.', 'Số 6 (kiểu そして) — Huế có kinh thành cổ; đẹp, và nổi tiếng.'),
          E('{私|わたし}の{町|まち}にきれいな{山|やま}があります。バーデン{山|さん}です。バーデン{山|さん}は{低|ひく}いですが、きれいです。', 'Watashi no machi ni kirei na yama ga arimasu. Bāden-san desu. Bāden-san wa hikui desu ga, kirei desu.', 'Số 7 (kiểu が) — núi Bà Đen: thấp nhưng đẹp.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 75 · やってみよう (chủ đề 2) — Nghe: thành phố của 4 người',
      'Bài nghe CD: bốn người **マルコ, パク, 山口, 木村** kể về thành phố của mình; bạn ghép mỗi người với một ảnh a–d: (a) núi cao nhìn từ cánh đồng, (b) vịnh có nhiều nhà cao tầng ven bờ, (c) chùa cổ có hươu đứng gần, (d) sườn đồi nhà cửa san sát. Nghe để bắt: tính từ (にぎやか, 静か, 古い, 高い…) và **～があります** (có núi, có chùa, có biển…). Dòng ■: nói với bạn cùng lớp quê bạn là nơi thế nào, có gì.',
      [
        C('ミンさんの{町|まち}に{何|なに}がありますか。', 'Min-san no machi ni nani ga arimasu ka.', 'Thành phố của Minh có gì?'),
        S('{川|かわ}と{古|ふる}いお{寺|てら}があります。', 'Kawa to furui o-tera ga arimasu.', 'Có sông và chùa cổ.'),
        C('どんな{川|かわ}ですか。', 'Donna kawa desu ka.', 'Sông thế nào?'),
        S('{大|おお}きい{川|かわ}です。', 'Ōkii kawa desu.', 'Là con sông lớn.'),
        C('{山|やま}がありますか。', 'Yama ga arimasu ka.', 'Có núi không?'),
        S('いいえ、ありません。', 'Iie, arimasen.', 'Không, không có.'),
      ],
      [
        'Phủ định của **あります** là **ありません** — trả lời "không có" chỉ cần **いいえ、ありません**.',
        'Nghe **と** giữa hai danh từ (川と山があります) = có CẢ HAI thứ.',
        'Luyện dạng này: **Luyện nghe · Bài 3 — Thành phố của bốn người**.',
      ],
    ),

    ...trang(
      'Trang 76–77 · チャレンジ! 季節・料理',
      'Trang 76: một bạn nữ đứng cạnh cửa sổ, đeo túi, kéo vali, tay đặt lên trán — đang phân vân (thời tiết bên đó thế nào, mang áo gì?). Ô (1): hai bạn nói chuyện, bong bóng vẽ người lau mồ hôi — "nóng nhỉ"; ô (2): **ペキン 8月?** — người toát mồ hôi (nóng); ô (3): **プサン 8月?** — người có giọt nước (mưa nhiều, ẩm). Trang 77: hai bạn nữ, một người uống nước, phía sau là tờ lịch tháng 8. Ô (4): **モスクワ 8月** — hai người giơ tay vui vẻ (dễ chịu, không nóng); ô (5): **韓国** — món **サムゲタン** (gà hầm sâm), bạn nữ giơ ngón tay giải thích, bạn nam ngạc nhiên (mùa hè mà ăn canh nóng!). **Mục tiêu できる:** nói và hỏi về khí hậu, món ăn của nước/quê mình.',
      [
        C('{暑|あつ}いですね。', 'Atsui desu ne.', 'Nóng nhỉ.'),
        S('そうですね。', 'Sō desu ne.', 'Đúng vậy nhỉ.'),
        C('ハノイも{8月|はちがつ}、{暑|あつ}いですか。', 'Hanoi mo hachigatsu, atsui desu ka.', 'Hà Nội tháng 8 cũng nóng à?'),
        S('はい、とても{暑|あつ}いです。そして、{雨|あめ}が{多|おお}いです。', 'Hai, totemo atsui desu. Soshite, ame ga ōi desu.', 'Vâng, rất nóng. Và mưa nhiều.'),
        C('ハノイは{冬|ふゆ}、どうですか。', 'Hanoi wa fuyu, dō desu ka.', 'Hà Nội mùa đông thế nào?'),
        S('{少|すこ}し{寒|さむ}いです。', 'Sukoshi samui desu.', 'Hơi lạnh.'),
        C('（ô 5）サムゲタンは{何|なん}ですか。', '(ô 5) Samugetan wa nan desu ka.', '(ô 5) Samgyetang là gì?'),
        S('{鶏肉|とりにく}のスープです。{韓国|かんこく}の{料理|りょうり}です。', 'Toriniku no sūpu desu. Kankoku no ryōri desu.', 'Là súp gà. Món Hàn Quốc.'),
      ],
      [
        '**ポイント 36 ～ね**: người nói tìm sự đồng ý → đáp **そうですね**. Đây là câu mở đầu cô hay dùng.',
        '**ポイント 26**: N は + (mùa／tháng／一年中) + 、A です — 東京は6月、雨が多いです. **ポイント 27**: とても／少し + A; **あまり + phủ định** (あまり暑くないです).',
        '**ポイント 33 Nはどうですか**: hỏi "còn N thì sao?" — trả lời lại bằng câu tính từ.',
        '{暑|あつ}い = nóng (thời tiết) ≠ {熱|あつ}い = nóng (đồ vật, đồ uống); {暖|あたた}かい = ấm (thời tiết) ≠ {温|あたた}かい = ấm (đồ ăn, nước).',
        'Xem **Hội thoại · Tình huống 3** và **Ngữ pháp · ポイント 26, 27, 33, 36**.',
      ],
    ),

    ...trang(
      'Trang 78–79 · 言ってみよう (chủ đề 3) — Số 1–5: Thời tiết · "Bên bạn thì sao?" · Món ăn',
      '**Số 1:** tranh người + thời tiết để nói câu "～ですね": 例 người lau mồ hôi (nóng), ① người ôm tay run (lạnh), ② người hơ tay bên lò sưởi, ③ người đứng dưới máy lạnh có gió thổi (mát), ④ người giơ tay dưới trời nắng, cười (trời đẹp). **Số 2/3:** thêm câu hỏi "nước của B tháng … cũng … à?" — tranh: 例 tháng 8 nóng, ① tháng 1 lạnh, ② tháng 6 người che ô (mưa nhiều), ③ mùa thu nắng dịu (mát, dễ chịu); trả lời とても… hoặc あまり…ない. **Số 4:** cả đoạn bốn lượt, người thứ nhất hỏi lại "Bさんの国はどうですか". **Số 5:** "ở nước B, mùa hè ăn gì?" rồi giải thích món đó: 例 mùa hè・ăn, ① mùa đông・ăn, ② ngày nóng・uống, ③ ngày lạnh・uống.',
      [
        C('（①）{寒|さむ}いですね。', '(1) Samui desu ne.', '(①) Lạnh nhỉ.'),
        S('そうですね。', 'Sō desu ne.', 'Đúng vậy nhỉ.'),
        C('ミンさんの{国|くに}も{1月|いちがつ}、{寒|さむ}いですか。', 'Min-san no kuni mo ichigatsu, samui desu ka.', 'Nước Minh tháng 1 cũng lạnh à?'),
        S('ハノイは{少|すこ}し{寒|さむ}いです。でも、ホーチミンはあまり{寒|さむ}くないです。', 'Hanoi wa sukoshi samui desu. Demo, Hōchimin wa amari samuku nai desu.', 'Hà Nội hơi lạnh. Nhưng TP.HCM không lạnh lắm.'),
        C('ベトナムで{冬|ふゆ}に{何|なに}を{食|た}べますか。', 'Betonamu de fuyu ni nani o tabemasu ka.', 'Ở Việt Nam mùa đông ăn gì?'),
        S('フォーを{食|た}べます。', 'Fō o tabemasu.', 'Ăn phở.'),
        C('フォー？「フォー」は{何|なん}ですか。', 'Fō? "Fō" wa nan desu ka.', 'Phở? "Phở" là gì?'),
        S('フォーは{牛肉|ぎゅうにく}のスープとめんです。{温|あたた}かいです。おいしいです。', 'Fō wa gyūniku no sūpu to men desu. Atatakai desu. Oishii desu.', 'Phở là mì với nước dùng thịt bò. Ấm nóng. Ngon.'),
      ],
      [
        'Số 2/3: câu hỏi có **も** (Bさんの国**も**…) vẫn trả lời bằng **はい、とても～／いいえ、あまり～くないです**; muốn khác thì nói luôn cái đúng: いいえ、あまり暑くないです。涼しいです。',
        'Số 5: người Nhật chưa biết món của bạn ⇒ họ hỏi lại 「～」は何ですか — trả lời **(nguyên liệu)の(loại món)です** (ポイント 12 Bài 2) + một tính từ vị (おいしい, 甘い, 辛い…).',
        'Câu hỏi thi Bài 4 (không tranh): **Bさんの国は今、暑いですか／ベトナムの料理はおいしいですか／何がおいしいですか** — trả lời có とても／あまり.',
        'Xem **Ngữ pháp · ポイント 26, 27, 33** và **Luyện nghe · Bài 4, 5**.',
      ],
      [
        mau([
          E('{暑|あつ}いですね。— そうですね。', 'Atsui desu ne. — Sō desu ne.', 'Số 1 例 — nóng.'),
          E('{寒|さむ}いですね。— そうですね。', 'Samui desu ne. — Sō desu ne.', 'Số 1 ① — lạnh.'),
          E('{寒|さむ}いですね。／{暖|あたた}かいですね。— そうですね。', 'Samui desu ne. / Atatakai desu ne. — Sō desu ne.', 'Số 1 ② — người sưởi: nói theo cách cô hiểu tranh (lạnh ⇒ sưởi, hoặc ấm).'),
          E('{涼|すず}しいですね。— そうですね。', 'Suzushii desu ne. — Sō desu ne.', 'Số 1 ③ — mát.'),
          E('{天気|てんき}がいいですね。— そうですね。', 'Tenki ga ii desu ne. — Sō desu ne.', 'Số 1 ④ — trời đẹp.'),
          E('Bさんの{国|くに}も{8月|はちがつ}、{暑|あつ}いですか。— はい、とても{暑|あつ}いです。／いいえ、あまり{暑|あつ}くないです。', 'B-san no kuni mo hachigatsu, atsui desu ka. — Hai, totemo atsui desu. / Iie, amari atsuku nai desu.', 'Số 2/3 例 — tháng 8 nóng.'),
          E('{1月|いちがつ}、{寒|さむ}いですか。— はい、とても{寒|さむ}いです。／いいえ、あまり{寒|さむ}くないです。', 'Ichigatsu, samui desu ka. — Hai, totemo samui desu. / Iie, amari samuku nai desu.', 'Số 2/3 ① — tháng 1 lạnh.'),
          E('{6月|ろくがつ}、{雨|あめ}が{多|おお}いですか。— はい、とても{多|おお}いです。／いいえ、あまり{多|おお}くないです。', 'Rokugatsu, ame ga ōi desu ka. — Hai, totemo ōi desu. / Iie, amari ōku nai desu.', 'Số 2/3 ② — tháng 6 mưa nhiều.'),
          E('{秋|あき}、{涼|すず}しいですか。— はい、とても{涼|すず}しいです。／いいえ、あまり{涼|すず}しくないです。', 'Aki, suzushii desu ka. — Hai, totemo suzushii desu. / Iie, amari suzushiku nai desu.', 'Số 2/3 ③ — mùa thu mát.'),
          E('{毎日|まいにち}、{暑|あつ}いですね。— そうですね。Aさんの{国|くに}も{8月|はちがつ}、{暑|あつ}いですか。— はい、とても{暑|あつ}いです。Bさんの{国|くに}はどうですか。— {私|わたし}の{国|くに}は{8月|はちがつ}、あまり{暑|あつ}くないです。', 'Mainichi, atsui desu ne. — Sō desu ne. A-san no kuni mo hachigatsu, atsui desu ka. — Hai, totemo atsui desu. B-san no kuni wa dō desu ka. — Watashi no kuni wa hachigatsu, amari atsuku nai desu.', 'Số 4 — cả đoạn bốn lượt (ポイント 33 どうですか).'),
          E('ベトナムで{夏|なつ}に{何|なに}を{食|た}べますか。— チェーを{食|た}べます。チェーは{甘|あま}いデザートです。{冷|つめ}たいです。', 'Betonamu de natsu ni nani o tabemasu ka. — Chē o tabemasu. Chē wa amai dezāto desu. Tsumetai desu.', 'Số 5 例 kiểu Việt Nam — mùa hè ăn chè (ngọt, lạnh).'),
          E('{冬|ふゆ}にフォーを{食|た}べます。フォーは{牛肉|ぎゅうにく}のスープとめんです。', 'Fuyu ni fō o tabemasu. Fō wa gyūniku no sūpu to men desu.', 'Số 5 ① — mùa đông ăn phở.'),
          E('{暑|あつ}い{日|ひ}にココナッツジュースを{飲|の}みます。{甘|あま}いです。{冷|つめ}たいです。', 'Atsui hi ni kokonattsu jūsu o nomimasu. Amai desu. Tsumetai desu.', 'Số 5 ② — ngày nóng uống nước dừa.'),
          E('{寒|さむ}い{日|ひ}に{温|あたた}かいお{茶|ちゃ}を{飲|の}みます。{少|すこ}し{苦|にが}いです。', 'Samui hi ni atatakai o-cha o nomimasu. Sukoshi nigai desu.', 'Số 5 ③ — ngày lạnh uống trà nóng.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 79 · やってみよう (chủ đề 3) — Nghe: khí hậu và món ăn',
      'Bài nghe CD: hai người kể về thời tiết và đồ ăn uống ở quê mình; trên sách là hai đoạn văn có chỗ trống — nghe rồi điền **tính từ thời tiết** (暑い, 寒い, 暖かい, 涼しい…), **雨が多い／少ない**, và **tính từ vị** của đồ uống (甘い, 冷たい…). Mẹo: chỗ trống đứng trước **です** thường là tính từ; đứng sau **とても** là tính từ ở dạng khẳng định. Dòng ■: hỏi bạn cùng lớp khí hậu quê họ, ngày nóng/lạnh ăn gì, uống gì.',
      [
        C('ミンさんの{町|まち}は{12月|じゅうにがつ}、どうですか。', 'Min-san no machi wa jūnigatsu, dō desu ka.', 'Thành phố Minh tháng 12 thế nào?'),
        S('{少|すこ}し{寒|さむ}いです。{雨|あめ}が{少|すく}ないです。', 'Sukoshi samui desu. Ame ga sukunai desu.', 'Hơi lạnh. Ít mưa.'),
        C('{暑|あつ}い{日|ひ}に{何|なに}を{飲|の}みますか。', 'Atsui hi ni nani o nomimasu ka.', 'Ngày nóng uống gì?'),
        S('アイスコーヒーを{飲|の}みます。{冷|つめ}たいです。おいしいです。', 'Aisu kōhī o nomimasu. Tsumetai desu. Oishii desu.', 'Uống cà phê đá. Lạnh. Ngon.'),
        C('ベトナムの{料理|りょうり}は{辛|から}いですか。', 'Betonamu no ryōri wa karai desu ka.', 'Món Việt Nam có cay không?'),
        S('いいえ、あまり{辛|から}くないです。', 'Iie, amari karaku nai desu.', 'Không, không cay lắm.'),
      ],
      [
        '**{少|すく}ない** (ít) ≠ **{少|すこ}し** (một chút) — chữ Hán giống nhau, đọc khác nhau.',
        'Luyện: **Luyện nghe · Bài 4 — Thời tiết theo tháng** và **Bài 5 — Món ăn, đồ uống**.',
      ],
    ),

    ...trang(
      'Trang 80 · できる! — Nói về đất nước, quê mình',
      'Nhiệm vụ tổng hợp cả bài: nói chuyện với mọi người về nước/quê của mình. Ba gợi ý: (1) chuẩn bị vài tấm ảnh nơi muốn giới thiệu rồi cho bạn xem và nói; (2) giới thiệu một thứ nổi tiếng hay món ăn mà sách hướng dẫn du lịch KHÔNG có; (3) lễ hội, ngày lễ của nước bạn là khi nào, làm gì, ăn gì. Cô thường gọi từng bạn lên cầm ảnh (hoặc điện thoại) và hỏi dồn.',
      [
        C('これはどこですか。', 'Kore wa doko desu ka.', '(chỉ ảnh bạn mang) Đây là đâu?'),
        S('ハロン{湾|わん}です。ベトナムの{北|きた}です。', 'Haron-wan desu. Betonamu no kita desu.', 'Vịnh Hạ Long. Ở phía bắc Việt Nam.'),
        C('ハノイからどのくらいですか。', 'Hanoi kara dono kurai desu ka.', 'Từ Hà Nội mất bao lâu?'),
        S('バスで{3時間|さんじかん}くらいです。', 'Basu de sanjikan kurai desu.', 'Đi xe buýt khoảng 3 tiếng.'),
        C('どんなところですか。', 'Donna tokoro desu ka.', 'Là nơi thế nào?'),
        S('とてもきれいなところです。そして、{有名|ゆうめい}です。', 'Totemo kirei na tokoro desu. Soshite, yūmei desu.', 'Là nơi rất đẹp. Và nổi tiếng.'),
        C('ベトナムのお{祭|まつ}りはいつですか。', 'Betonamu no o-matsuri wa itsu desu ka.', 'Lễ hội của Việt Nam là khi nào?'),
        S('テトです。{1月|いちがつ}か{2月|にがつ}です。バインチュンを{食|た}べます。', 'Teto desu. Ichigatsu ka nigatsu desu. Bainchun o tabemasu.', 'Là Tết. Tháng 1 hoặc tháng 2. Ăn bánh chưng.'),
      ],
      [
        'Một đoạn giới thiệu đủ ý = **ở đâu (29) → bao lâu (30, 31) → nơi thế nào (32, 25) → có gì (28) → thời tiết (26, 27) → món ăn**.',
        'Tên riêng Việt Nam viết katakana: ハノイ, ホーチミン, フエ, ダナン, ハロン湾, フォー, バインミー.',
        'Xem **Hội thoại · できる！** và **Luyện nói · Bài nói liền — 私の町**.',
      ],
    ),

    ...trang(
      'Trang 80 · 話読聞書「私の国・町」 — Đoạn giới thiệu quê',
      'Ô 話読聞書 có một đoạn khoảng 12 câu của một bạn người Ý giới thiệu thành phố quê mình: nằm ở phía nào của nước, là nơi thế nào, có những công trình gì, có lễ hội gì vào tháng mấy, mùa xuân thời tiết ra sao, và lời mời mọi người đến chơi. Bên cạnh có 5 câu hỏi gợi ý để phỏng vấn nhau: nước nào, nơi thế nào, có gì, cái gì ngon, thời tiết ra sao. Từ mới của đoạn: 美術館 (bảo tàng mỹ thuật), 皆さん (mọi người), いろいろ(な) (nhiều loại), ～から来ました (tôi đến từ…), ぜひ来てください (nhất định hãy đến nhé). Nhiệm vụ: đọc to đoạn mẫu, rồi **viết đoạn của bạn** theo 5 câu hỏi và đọc trước lớp — dạng bài Reading 40 điểm.',
      [
        C('どこから{来|き}ましたか。', 'Doko kara kimashita ka.', 'Em đến từ đâu?'),
        S('ベトナムのハノイから{来|き}ました。', 'Betonamu no Hanoi kara kimashita.', 'Em đến từ Hà Nội, Việt Nam.'),
        C('ハノイで{何|なに}がおいしいですか。', 'Hanoi de nani ga oishii desu ka.', 'Ở Hà Nội cái gì ngon?'),
        S('フォーがおいしいです。', 'Fō ga oishii desu.', 'Phở ngon.'),
        C('{自分|じぶん}の{町|まち}の{紹介|しょうかい}を{読|よ}んでください。', 'Jibun no machi no shōkai o yonde kudasai.', 'Em đọc bài giới thiệu thành phố của em đi.'),
        S('{私|わたし}はベトナムのハノイから{来|き}ました。ハノイはベトナムの{北|きた}です。ハノイはにぎやかなところです。{古|ふる}いお{寺|てら}や{湖|みずうみ}などがあります。{湖|みずうみ}はとてもきれいです。ハノイは{冬|ふゆ}、{少|すこ}し{寒|さむ}いです。そして、フォーがとてもおいしいです。ハノイはいいところです。{皆|みな}さん、ぜひ{来|き}てください。', 'Watashi wa Betonamu no Hanoi kara kimashita. Hanoi wa Betonamu no kita desu. Hanoi wa nigiyaka na tokoro desu. Furui o-tera ya mizuumi nado ga arimasu. Mizuumi wa totemo kirei desu. Hanoi wa fuyu, sukoshi samui desu. Soshite, fō ga totemo oishii desu. Hanoi wa ii tokoro desu. Minasan, zehi kite kudasai.', 'Tôi đến từ Hà Nội, Việt Nam. Hà Nội ở phía bắc Việt Nam. Hà Nội là nơi nhộn nhịp. Có chùa cổ, hồ… Hồ rất đẹp. Hà Nội mùa đông hơi lạnh. Và phở rất ngon. Hà Nội là nơi tốt. Mọi người nhất định hãy đến nhé.'),
      ],
      [
        '**AやBなど** = A, B, v.v. (liệt kê vài thứ tiêu biểu); **AとB** = đúng A và B.',
        '**～から{来|き}ました** (kimashita) là quá khứ của 来ます — học ở Bài 5; ở đây thuộc nguyên cụm.',
        'Đọc to: は trong ハノイ**は** đọc **wa**; 来てください đọc **kite** kudasai.',
        'Xem **Hội thoại · Đọc – nói: 私の町** và **Luyện nói · Đọc to — Reading**.',
      ],
    ),

    { t: 'h', text: 'Trang 81 · ことば — Từ vựng của bài' },
    {
      t: 'p',
      text: 'Trang liệt kê từ mới theo 3 chủ đề: (1) どこ？ — phương hướng 東西南北・真ん中, phương tiện (xe hơi, tàu Shinkansen, tàu điện, máy bay), nhà ga, thành phố, ～時間・～分, 歩いて, くらい, どのくらい; (2) どんなところ？ — cảnh vật và công trình (suối nước nóng, sông, núi, nhà thờ, lâu đài, đền, chùa, tòa nhà), あります, và các tính từ mới/cũ, lớn/nhỏ, cao/thấp, nhiều/ít, đẹp, yên tĩnh, nhộn nhịp, nổi tiếng, どんな, そして; (3) 季節・料理 — mưa, tuyết, tính từ thời tiết (ấm, mát, nóng, lạnh, trời đẹp/xấu), nhiệt độ đồ vật (ấm, nóng, lạnh), vị (ngon, ngọt, cay, đắng, chua), 一年中, あまり, 少し, とても, どう. Không có tranh. Đủ nghĩa, romaji, ví dụ: xem mục **Từ vựng** của Bài 4.',
    },
    { t: 'note', title: 'Mẹo', items: ['Cô hay đọc tiếng Việt rồi bắt nói nhanh cặp tính từ trái nghĩa + dạng phủ định: 大きい↔小さい, 高い↔低い, 多い↔少ない, 暑い↔寒い — ôn ở **Ngữ pháp · bảng chia tính từ**.', 'Xem **Từ vựng · Bài 4** và **Chữ Hán · Bài 4**.'] },

    ...trang(
      'Trang 82 · もう一度聞こう — Nghe lại cả bài',
      'Nghe lại đoạn đã nghe ở trang 67, giờ đã học xong: パク hỏi ナタポン về quê. ナタポン là người Thái; từ Thái sang Nhật mất khoảng 6 tiếng; quê anh là アユタヤ — nơi yên tĩnh và đẹp, có chùa cổ, sông lớn…; chùa về đêm rất đẹp. Anh kể thêm Thái có nhiều trái cây ngon (từ mới: たくさん — nhiều), và từ tháng 11 đến tháng 5 ít mưa, rồi mời パク đến Thái chơi. Cô sẽ hỏi lại các chi tiết này.',
      [
        C('ナタポンさんのお{国|くに}はどちらですか。', 'Natapon-san no o-kuni wa dochira desu ka.', 'Natapon đến từ nước nào?'),
        S('タイです。', 'Tai desu.', 'Thái Lan.'),
        C('タイから{日本|にほん}までどのくらいですか。', 'Tai kara Nihon made dono kurai desu ka.', 'Từ Thái đến Nhật mất bao lâu?'),
        S('{6時間|ろくじかん}くらいです。', 'Rokujikan kurai desu.', 'Khoảng 6 tiếng.'),
        C('アユタヤはどんなところですか。', 'Ayutaya wa donna tokoro desu ka.', 'Ayutthaya là nơi thế nào?'),
        S('{静|しず}かなところです。そして、きれいです。', 'Shizuka na tokoro desu. Soshite, kirei desu.', 'Là nơi yên tĩnh. Và đẹp.'),
        C('アユタヤに{何|なに}がありますか。', 'Ayutaya ni nani ga arimasu ka.', 'Ở Ayutthaya có gì?'),
        S('{古|ふる}いお{寺|てら}や{大|おお}きい{川|かわ}などがあります。', 'Furui o-tera ya ōkii kawa nado ga arimasu.', 'Có chùa cổ, sông lớn…'),
        C('タイは{何月|なんがつ}から{何月|なんがつ}まで{雨|あめ}が{少|すく}ないですか。', 'Tai wa nangatsu kara nangatsu made ame ga sukunai desu ka.', 'Ở Thái, từ tháng mấy đến tháng mấy ít mưa?'),
        S('{11月|じゅういちがつ}から{5月|ごがつ}までです。', 'Jūichigatsu kara gogatsu made desu.', 'Từ tháng 11 đến tháng 5.'),
      ],
      [
        '**～から～まで** dùng cho cả nơi chốn (タイから日本まで) lẫn thời gian (11月から5月まで — Bài 3).',
        'Câu kết **ぜひ来てください** (nhất định hãy đến) — người nghe đáp **はい。ありがとうございます**.',
        'Xem **Luyện nghe · Bài 6 (hội thoại dài)** và **Luyện nói · Câu hỏi KHÔNG có tranh**.',
      ],
    ),

    { t: 'h', text: 'Cô hỏi — bạn trả lời: ghép nhanh câu trả lời' },
    {
      t: 'build',
      id: 'b4-sach-ghep',
      title: 'Nghe câu hỏi (tiếng Việt) → ghép câu trả lời tiếng Nhật',
      items: [
        { vi: 'Cô hỏi ハノイはどこですか → "Hà Nội ở phía bắc Việt Nam."', chips: ['ハノイは', 'ベトナムの', '{北|きた}です。', '{南|みなみ}です。', 'に'], answer: ['ハノイは', 'ベトナムの', '{北|きた}です。'], ro: 'Hanoi wa Betonamu no kita desu.' },
        { vi: 'Cô hỏi うちから学校までどのくらいですか → "Đi xe buýt khoảng 30 phút."', chips: ['バスで', '{30分|さんじゅっぷん}', 'くらいです。', 'バスに', 'まで'], answer: ['バスで', '{30分|さんじゅっぷん}', 'くらいです。'], ro: 'Basu de sanjuppun kurai desu.' },
        { vi: 'Cô hỏi 町はどんなところですか → "Là nơi yên tĩnh."', chips: ['{静|しず}かな', 'ところです。', '{静|しず}か', 'どんな'], answer: ['{静|しず}かな', 'ところです。'], ro: 'Shizuka na tokoro desu.' },
        { vi: 'Cô hỏi 町は大きいですか → "Không, không lớn."', chips: ['いいえ、', '{大|おお}きくないです。', '{大|おお}きいじゃありません。', 'はい、'], answer: ['いいえ、', '{大|おお}きくないです。'], ro: 'Iie, ōkiku nai desu.' },
        { vi: 'Cô hỏi 町に何がありますか → "Có chùa cổ."', chips: ['{古|ふる}い', 'お{寺|てら}が', 'あります。', 'います。', 'お{寺|てら}に'], answer: ['{古|ふる}い', 'お{寺|てら}が', 'あります。'], ro: 'Furui o-tera ga arimasu.' },
        { vi: 'Cô hỏi ベトナムは8月、暑いですか → "Vâng, rất nóng."', chips: ['はい、', 'とても', '{暑|あつ}いです。', 'あまり', '{熱|あつ}いです。'], answer: ['はい、', 'とても', '{暑|あつ}いです。'], ro: 'Hai, totemo atsui desu.' },
        { vi: 'Cô hỏi ベトナムの料理は辛いですか → "Không, không cay lắm."', chips: ['いいえ、', 'あまり', '{辛|から}くないです。', 'とても', '{辛|から}いです。'], answer: ['いいえ、', 'あまり', '{辛|から}くないです。'], ro: 'Iie, amari karaku nai desu.' },
        { vi: 'Nói về quê: "Thành phố tôi không lớn, nhưng là nơi tốt."', chips: ['{私|わたし}の{町|まち}は', '{大|おお}きくないですが、', 'いいところです。', 'そして、', 'いいなところです。'], answer: ['{私|わたし}の{町|まち}は', '{大|おお}きくないですが、', 'いいところです。'], ro: 'Watashi no machi wa ōkiku nai desu ga, ii tokoro desu.' },
      ],
    },
  ],
};

/* ══════════════════════════ BÀI 5 — 休みの日 ══════════════════════════ */

const SACH_5: Lesson = {
  id: 'b5-sach',
  kind: 'review',
  title: 'Theo sách — Bài 5 (trang 83–100)',
  goal: 'Nhìn tranh sinh hoạt ngày nghỉ, lịch, quảng cáo trên tàu trong sách là hỏi–đáp được: đã làm gì, với ai, thấy thế nào, vì sao, kỳ nghỉ tới muốn làm gì.',
  minutes: 60,
  blocks: [
    CACH_DUNG,

    ...trang(
      'Trang 83 · 話してみよう・聞いてみよう — Mở bài 休みの日',
      '**話してみよう** — 4 tranh không lời: (1) một chồng tạp chí du lịch, bìa có chữ 沖縄 (Okinawa) và 北海道 (Hokkaido); (2) một nhà đang làm việc nhà: người hút bụi thảm, người lau bàn, một đôi nấu ăn bên bếp; (3) ba thanh niên đá bóng ngoài sân; (4) hai cô gái dạo phố mua sắm, tay xách túi và cầm đồ ăn vặt. Mục đích: nói ngày nghỉ thường làm gì, đã làm gì. **聞いてみよう**: nghe trước đoạn hội thoại của bài (hai bạn kể Chủ nhật vừa rồi) — chính là trang 100.',
      [
        C('（tranh 3）この{人|ひと}たちは{何|なに}をしますか。', '(tranh 3) Kono hitotachi wa nani o shimasu ka.', '(tranh 3) Những người này làm gì?'),
        S('サッカーをします。', 'Sakkā o shimasu.', 'Đá bóng.'),
        C('（tranh 2）{何|なに}をしますか。', '(tranh 2) Nani o shimasu ka.', '(tranh 2) Họ làm gì?'),
        S('{掃除|そうじ}をします。{料理|りょうり}を{作|つく}ります。', 'Sōji o shimasu. Ryōri o tsukurimasu.', 'Dọn dẹp. Nấu ăn.'),
        C('ミンさんは{休|やす}みの{日|ひ}、{何|なに}をしますか。', 'Min-san wa yasumi no hi, nani o shimasu ka.', 'Ngày nghỉ Minh làm gì?'),
        S('{友達|ともだち}と{買|か}い{物|もの}をします。', 'Tomodachi to kaimono o shimasu.', 'Em đi mua sắm với bạn.'),
        C('（tranh 1）{北海道|ほっかいどう}へ{行|い}きたいですか。', '(tranh 1) Hokkaidō e ikitai desu ka.', '(tranh 1) Em có muốn đi Hokkaido không?'),
        S('はい、{行|い}きたいです。', 'Hai, ikitai desu.', 'Vâng, em muốn đi.'),
      ],
      [
        'Tranh là việc THƯỜNG làm ⇒ dùng **～ます** (Bài 3). Hỏi về hôm qua / Chủ nhật vừa rồi ⇒ **～ました** (ポイント 37).',
        '**～たいです** = muốn làm (ポイント 41) — cô hay hỏi thử ngay trang đầu; trả lời **はい、{行|い}きたいです**.',
        'Xem **Hội thoại · Học xong Bài 5 bạn làm được gì?** và **Từ vựng · 3**.',
      ],
    ),

    ...trang(
      'Trang 84–85 · チャレンジ! 週末 (5-1)',
      'Trang 84: sáng thứ Hai, trong lớp, một bạn nữ và một bạn nam đứng cạnh cửa sổ; trên tường có lịch và đồng hồ chỉ khoảng 9 giờ. Ô (1): "日曜日?" → người đi tới một ngôi nhà, có người bưng bánh sinh nhật cắm nến — Chủ nhật đến nhà bạn dự sinh nhật; ô (2): hỏi lại người kia → người đó đến nhà ai đó, rồi xem phim ở **渋谷**. Trang 85: bảng đen có khung ghi ngày–tháng–thứ; một cô ôm sách nói chuyện với bạn nam đang đưa tay lên cằm suy nghĩ. Ô (3): "昨日?" → ba chàng trai đá bóng; ô (4): hai cô gái đi mua sắm rồi ngồi ăn ở quán. **Mục tiêu できる:** nói và hỏi ngày nghỉ đã làm gì.',
      [
        C('ミンさん、{日曜日|にちようび}、{何|なに}をしましたか。', 'Min-san, nichiyōbi, nani o shimashita ka.', 'Minh, Chủ nhật em đã làm gì?'),
        S('{友達|ともだち}の{家|いえ}へ{行|い}きました。{誕生日|たんじょうび}のパーティーをしました。', 'Tomodachi no ie e ikimashita. Tanjōbi no pātī o shimashita.', 'Em đến nhà bạn. Tổ chức tiệc sinh nhật.'),
        C('（ô 3）{昨日|きのう}、この{人|ひと}たちは{何|なに}をしましたか。', '(ô 3) Kinō, kono hitotachi wa nani o shimashita ka.', '(ô 3) Hôm qua những người này đã làm gì?'),
        S('サッカーをしました。', 'Sakkā o shimashita.', 'Đã đá bóng.'),
        C('（ô 4）だれと{買|か}い{物|もの}をしましたか。', '(ô 4) Dare to kaimono o shimashita ka.', '(ô 4) Đã mua sắm với ai?'),
        S('{友達|ともだち}としました。それから、{食事|しょくじ}をしました。', 'Tomodachi to shimashita. Sorekara, shokuji o shimashita.', 'Với bạn. Sau đó đã đi ăn.'),
        C('{週末|しゅうまつ}、どこかへ{行|い}きましたか。', 'Shūmatsu, dokoka e ikimashita ka.', 'Cuối tuần em có đi đâu không?'),
        S('いいえ、どこも{行|い}きませんでした。うちで{勉強|べんきょう}しました。', 'Iie, doko mo ikimasen deshita. Uchi de benkyō shimashita.', 'Không, em không đi đâu cả. Em học ở nhà.'),
      ],
      [
        '**ポイント 37**: ～ます → **～ました** (đã làm), ～ません → **～ませんでした** (đã không làm).',
        '**ポイント 43**: **どこかへ行きましたか** (có đi đâu không?) là câu có/không ⇒ **はい、～へ行きました** hoặc **いいえ、どこも行きませんでした**. Khác với **どこへ行きましたか** (đi đâu?) ⇒ trả lời tên nơi luôn, không はい／いいえ.',
        '**ポイント 45 それから** (sau đó) nối hai việc theo thứ tự; **ポイント 46 (người)と** = làm cùng ai. Làm một mình = **1{人|ひとり}で**.',
        'Xem **Hội thoại · 5-1 週末** và **Ngữ pháp · ポイント 37, 43, 45, 46**.',
      ],
    ),

    ...trang(
      'Trang 86 · 言ってみよう (5-1) — Số 1–3: Đã làm gì · Có đi đâu không · Đi với ai',
      '**Số 1:** hỏi "Chủ nhật đã làm gì?" — tranh: 例 đi bộ tới nhà có người vẫy tay từ cửa sổ (nhà bạn), ① một anh ngồi viết/đọc trước giá sách, ② hai cô gái gặp nhau có nhãn 渋谷, ③ một anh hút bụi. **Số 2:** "cuối tuần có đi đâu không?" — 例1 có: đi 新宿, mua sắm ở trung tâm thương mại; 例2 không: ở nhà xem TV; ① đi tới chỗ một người đang nướng đồ có khói; ② ③ hai tranh mũi tên ngược lại (không đi đâu, ở nhà làm việc khác: giấy tờ; bánh/hoa); ④ đi 渋谷, có hình máy ảnh/cửa hàng. **Số 3:** "đã làm gì" + **với ai**: 例 đi 箱根 cùng gia đình, ① một đôi ngồi sát nhau (người yêu), ② cả nhà ăn nướng quanh bàn, ③ một anh tự rót đồ uống. Tranh nhỏ ② ③ của số 2 khó đoán — câu mẫu dưới đây là một cách hiểu; cô hiểu khác thì chỉ cần đổi động từ.',
      [
        C('（①）{日曜日|にちようび}、{何|なに}をしましたか。', '(1) Nichiyōbi, nani o shimashita ka.', '(①) Chủ nhật đã làm gì?'),
        S('{本|ほん}を{読|よ}みました。', 'Hon o yomimashita.', 'Đã đọc sách.'),
        C('（③）は？', '(3) wa?', 'Còn ③?'),
        S('{部屋|へや}を{掃除|そうじ}しました。', 'Heya o sōji shimashita.', 'Đã dọn phòng.'),
        C('{週末|しゅうまつ}、どこかへ{行|い}きましたか。', 'Shūmatsu, dokoka e ikimashita ka.', 'Cuối tuần có đi đâu không?'),
        S('はい、{渋谷|しぶや}へ{行|い}きました。{渋谷|しぶや}でカメラを{買|か}いました。', 'Hai, Shibuya e ikimashita. Shibuya de kamera o kaimashita.', 'Có, đã đi Shibuya. Mua máy ảnh ở Shibuya.'),
        C('（số 3 ②）だれとバーベキューをしましたか。', '(số 3, 2) Dare to bābekyū o shimashita ka.', '(số 3, ②) Đã nướng BBQ với ai?'),
        S('{家族|かぞく}としました。', 'Kazoku to shimashita.', 'Với gia đình.'),
      ],
      [
        'Nơi hành động dùng **で** (新宿**で**買い物しました); nơi đi tới dùng **へ** (新宿**へ**行きました) — đừng lẫn.',
        'Bạn gặp ai: **(người)に{会|あ}いました** (友達**に**会いました) — không dùng を.',
        'Làm một mình: **1{人|ひとり}で** (KHÔNG có と).',
        'Xem **Ngữ pháp · Tổng hợp trợ từ** và **Luyện nói · ① Đã làm gì?**.',
      ],
      [
        mau([
          E('{日曜日|にちようび}、{何|なに}をしましたか。— {友達|ともだち}の{家|いえ}へ{行|い}きました。— そうですか。', 'Nichiyōbi, nani o shimashita ka. — Tomodachi no ie e ikimashita. — Sō desu ka.', 'Số 1 例 — đến nhà bạn.'),
          E('{本|ほん}を{読|よ}みました。／{勉強|べんきょう}しました。', 'Hon o yomimashita. / Benkyō shimashita.', 'Số 1 ① — đọc sách / học.'),
          E('{渋谷|しぶや}で{友達|ともだち}に{会|あ}いました。', 'Shibuya de tomodachi ni aimashita.', 'Số 1 ② — gặp bạn ở Shibuya.'),
          E('{部屋|へや}を{掃除|そうじ}しました。', 'Heya o sōji shimashita.', 'Số 1 ③ — dọn phòng.'),
          E('はい、{新宿|しんじゅく}へ{行|い}きました。{新宿|しんじゅく}のデパートで{買|か}い{物|もの}しました。', 'Hai, Shinjuku e ikimashita. Shinjuku no depāto de kaimono shimashita.', 'Số 2 例1 — có đi.'),
          E('いいえ、どこも{行|い}きませんでした。うちでテレビを{見|み}ました。', 'Iie, doko mo ikimasen deshita. Uchi de terebi o mimashita.', 'Số 2 例2 — không đi đâu.'),
          E('はい、{友達|ともだち}の{家|いえ}へ{行|い}きました。{友達|ともだち}の{家|いえ}で{料理|りょうり}を{作|つく}りました。', 'Hai, tomodachi no ie e ikimashita. Tomodachi no ie de ryōri o tsukurimashita.', 'Số 2 ① — đến nhà bạn, nấu ăn/nướng.'),
          E('いいえ、どこも{行|い}きませんでした。うちで{仕事|しごと}をしました。', 'Iie, doko mo ikimasen deshita. Uchi de shigoto o shimashita.', 'Số 2 ② — ở nhà làm việc (giấy tờ).'),
          E('いいえ、どこも{行|い}きませんでした。うちでケーキを{作|つく}りました。', 'Iie, doko mo ikimasen deshita. Uchi de kēki o tsukurimashita.', 'Số 2 ③ — ở nhà làm bánh.'),
          E('はい、{渋谷|しぶや}へ{行|い}きました。{渋谷|しぶや}でカメラを{買|か}いました。', 'Hai, Shibuya e ikimashita. Shibuya de kamera o kaimashita.', 'Số 2 ④ — Shibuya, mua máy ảnh.'),
          E('{家族|かぞく}と{箱根|はこね}へ{行|い}きました。', 'Kazoku to Hakone e ikimashita.', 'Số 3 例 — với gia đình.'),
          E('{恋人|こいびと}と{映画|えいが}を{見|み}ました。', 'Koibito to eiga o mimashita.', 'Số 3 ① — với người yêu.'),
          E('{家族|かぞく}とバーベキューをしました。', 'Kazoku to bābekyū o shimashita.', 'Số 3 ② — BBQ với gia đình.'),
          E('1{人|ひとり}でお{酒|さけ}を{飲|の}みました。', 'Hitori de o-sake o nomimashita.', 'Số 3 ③ — uống rượu một mình (hoặc ルームメイトと).'),
        ]),
      ],
    ),

    ...trang(
      'Trang 87 · 言ってみよう (5-1) số 4 · やってみよう — それから + hỏi thêm một câu',
      '**Số 4:** kể hai việc nối bằng それから, rồi người nghe hỏi thêm MỘT câu theo từ hỏi ghi trong tranh: 例 hôm qua — đến nhà bạn, chơi game → hỏi **どのくらい** (bao lâu); ① hôm qua — gặp người, rồi ngồi ăn → hỏi **どこで**; ② hôm kia (おととい) — cầm gói hàng, rồi dùng máy tính → hỏi **何を**; ③ thứ Bảy tuần trước — viết, rồi đọc sách → hỏi **どのくらい**; ④ **ngày mai** (明日) — đi mua sắm → hỏi **誰と** (chú ý: ngày mai ⇒ dùng ～ます, không phải ～ました). **やってみよう:** nghe CD hai cặp (パク–マルコ, ダニエル–ワン) nói Chủ nhật đi đâu (bạn / 新宿 / 渋谷 / công viên / không đi đâu) và làm gì (tranh あ–く); ghi ký hiệu. Dòng ■: hỏi bạn cùng lớp cuối tuần đã làm gì.',
      [
        C('{昨日|きのう}、{何|なに}をしましたか。', 'Kinō, nani o shimashita ka.', 'Hôm qua em làm gì?'),
        S('{友達|ともだち}に{会|あ}いました。それから、{食事|しょくじ}をしました。', 'Tomodachi ni aimashita. Sorekara, shokuji o shimashita.', 'Em gặp bạn. Sau đó đi ăn.'),
        C('どこで{食事|しょくじ}をしましたか。', 'Doko de shokuji o shimashita ka.', 'Ăn ở đâu?'),
        S('{新宿|しんじゅく}のレストランでしました。', 'Shinjuku no resutoran de shimashita.', 'Ở nhà hàng ở Shinjuku.'),
        C('どのくらいゲームをしましたか。', 'Dono kurai gēmu o shimashita ka.', 'Em chơi game bao lâu?'),
        S('{3時間|さんじかん}くらいしました。', 'Sanjikan kurai shimashita.', 'Khoảng 3 tiếng.'),
        C('{明日|あした}、だれと{買|か}い{物|もの}をしますか。', 'Ashita, dare to kaimono o shimasu ka.', 'Ngày mai em mua sắm với ai?'),
        S('ルームメイトとします。', 'Rūmumeito to shimasu.', 'Với bạn cùng phòng.'),
      ],
      [
        'Nghe từ chỉ thời gian đầu câu để chọn thì: **昨日・おととい・先週・～ました** ↔ **明日・あさって・今度・～ます**.',
        'Trả lời どのくらい: **～時間／～分 くらい** + lặp lại động từ (4時間くらいしました).',
        'Nghe bài やってみよう: nơi đi đứng trước **へ**, việc làm đứng trước **を～ました**; **どこも…ませんでした** = ô ×.',
        'Luyện: **Luyện nghe · Bài 1 — Chủ Nhật đi đâu, làm gì?** và **Bài 5 — Nghe từ chỉ thời gian**.',
      ],
      [
        mau([
          E('{友達|ともだち}の{家|いえ}へ{行|い}きました。それから、ゲームをしました。— どのくらいしましたか。— {4時間|よじかん}くらいしました。', 'Tomodachi no ie e ikimashita. Sorekara, gēmu o shimashita. — Dono kurai shimashita ka. — Yojikan kurai shimashita.', 'Số 4 例 — どのくらい.'),
          E('{友達|ともだち}に{会|あ}いました。それから、{食事|しょくじ}をしました。— どこでしましたか。— {駅|えき}の{近|ちか}くのレストランでしました。', 'Tomodachi ni aimashita. Sorekara, shokuji o shimashita. — Doko de shimashita ka. — Eki no chikaku no resutoran de shimashita.', 'Số 4 ① — どこで.'),
          E('おととい、{買|か}い{物|もの}をしました。それから、パソコンでメールを{書|か}きました。— {何|なに}を{買|か}いましたか。— {新|あたら}しいパソコンを{買|か}いました。', 'Ototoi, kaimono o shimashita. Sorekara, pasokon de mēru o kakimashita. — Nani o kaimashita ka. — Atarashii pasokon o kaimashita.', 'Số 4 ② — 何を.'),
          E('{先週|せんしゅう}の{土曜日|どようび}、{手紙|てがみ}を{書|か}きました。それから、{本|ほん}を{読|よ}みました。— どのくらい{読|よ}みましたか。— {2時間|にじかん}くらい{読|よ}みました。', 'Senshū no doyōbi, tegami o kakimashita. Sorekara, hon o yomimashita. — Dono kurai yomimashita ka. — Nijikan kurai yomimashita.', 'Số 4 ③ — どのくらい.'),
          E('{明日|あした}、{買|か}い{物|もの}に{行|い}きます。— だれと{行|い}きますか。— {友達|ともだち}と{行|い}きます。', 'Ashita, kaimono ni ikimasu. — Dare to ikimasu ka. — Tomodachi to ikimasu.', 'Số 4 ④ — 誰と (ngày mai ⇒ ～ます).'),
        ]),
      ],
    ),

    ...trang(
      'Trang 88–89 · チャレンジ! 休みの後で (5-2)',
      'Trang 88: giờ giải lao, hai bạn nam đứng nói chuyện, một người tựa vào bàn. Ô (1-1): "日曜日" → đến một ngôi nhà → người kể cười tươi (vui); rồi đến lượt hỏi người kia; ô (1-2): **名古屋** — hình tòa lâu đài, hai người ngắm bức ảnh lâu đài lấp lánh (đẹp). Trang 89: một cô đứng khoanh tay bên cửa sổ. Ô (1-3): "日曜日" → ở nhà, ngồi làm việc bên laptop đến tận đêm (vất vả/bận); ô (2): "日曜日?" → đi 渋谷, vào trung tâm thương mại, một đôi ăn kem, rồi thấy chiếc áo sơ mi gắn giá **¥15,000** (đắt nên không mua). **Mục tiêu できる:** nói và hỏi cảm tưởng về ngày nghỉ (vui không, thế nào, vì sao).',
      [
        C('{日曜日|にちようび}、{何|なに}をしましたか。', 'Nichiyōbi, nani o shimashita ka.', 'Chủ nhật em làm gì?'),
        S('{友達|ともだち}の{家|いえ}へ{行|い}きました。', 'Tomodachi no ie e ikimashita.', 'Em đến nhà bạn.'),
        C('{楽|たの}しかったですか。', 'Tanoshikatta desu ka.', 'Có vui không?'),
        S('はい、とても{楽|たの}しかったです。', 'Hai, totemo tanoshikatta desu.', 'Vâng, rất vui.'),
        C('（ô 1-2）{名古屋|なごや}のお{城|しろ}はどうでしたか。', '(ô 1-2) Nagoya no o-shiro wa dō deshita ka.', '(ô 1-2) Lâu đài Nagoya thế nào?'),
        S('とてもきれいでした。', 'Totemo kirei deshita.', 'Rất đẹp.'),
        C('（ô 2）どうしてシャツを{買|か}いませんでしたか。', '(ô 2) Dōshite shatsu o kaimasen deshita ka.', '(ô 2) Tại sao không mua áo sơ mi?'),
        S('{高|たか}かったですから。', 'Takakatta desu kara.', 'Vì đắt.'),
      ],
      [
        '**ポイント 38** quá khứ tính từ: イA **～かったです／～くなかったです** (楽しかった, 楽しくなかった; **いい → よかったです**); ナA và N **～でした／～じゃありませんでした** (きれいでした, 雨でした).',
        '**～はどうでしたか** (… thế nào?) — trả lời bằng tính từ quá khứ, thêm とても／あまり.',
        '**ポイント 44 どうして** + **ポイント 47 ～から**: lý do đặt TRƯỚC から (高かったです**から**). Trả lời ngắn chỉ cần "…ですから。".',
        'Xem **Hội thoại · 5-2 休みの後で** và **Ngữ pháp · ポイント 38, 44, 47**.',
      ],
    ),

    ...trang(
      'Trang 90–91 · 言ってみよう (5-2) — Số 1-1, 1-2, 1-3: Vui không · Thế nào · Đi đâu, làm gì, thấy sao',
      '**Số 1-1 (trang 90):** tranh cả lớp, mỗi người một bong bóng: 例 cô gái kéo vali (du lịch), ① một đôi xem phim, ② một anh ăn đồ xiên nướng (BBQ), ③ một anh ngồi dùng laptop — hỏi "đã làm gì" → "… có vui không?" → hai nhánh vui / không vui. **Số 1-2 (trang 91):** hỏi "… thế nào?" (どうでしたか): 例 xem phim (hay), ① ăn nướng ngoài trời, ② trẻ con đá bóng, ③ cô gái chỉ tay ra biển. **Số 1-3:** kể liền 3 ý: đi đâu → ở đó làm gì → thấy sao: 例 新宿／sushi／ngon, ① 渋谷／quần áo／rẻ, ② 横浜／biển／đẹp, ③ 箱根／suối nước nóng／dễ chịu.',
      [
        C('{週末|しゅうまつ}、{何|なに}をしましたか。', 'Shūmatsu, nani o shimashita ka.', 'Cuối tuần em làm gì?'),
        S('バーベキューをしました。', 'Bābekyū o shimashita.', 'Em ăn nướng BBQ.'),
        C('バーベキューは{楽|たの}しかったですか。', 'Bābekyū wa tanoshikatta desu ka.', 'BBQ có vui không?'),
        S('いいえ、あまり{楽|たの}しくなかったです。{雨|あめ}でしたから。', 'Iie, amari tanoshiku nakatta desu. Ame deshita kara.', 'Không, không vui lắm. Vì trời mưa.'),
        C('（1-2 ③）{海|うみ}はどうでしたか。', '(1-2, 3) Umi wa dō deshita ka.', '(1-2, ③) Biển thế nào?'),
        S('とてもきれいでした。', 'Totemo kirei deshita.', 'Rất đẹp.'),
        C('{日曜日|にちようび}、どこかへ{行|い}きましたか。', 'Nichiyōbi, dokoka e ikimashita ka.', 'Chủ nhật có đi đâu không?'),
        S('はい、{箱根|はこね}へ{行|い}きました。{箱根|はこね}で{温泉|おんせん}に{入|はい}りました。{気持|きも}ちがよかったです。', 'Hai, Hakone e ikimashita. Hakone de onsen ni hairimashita. Kimochi ga yokatta desu.', 'Có, đi Hakone. Tắm suối nước nóng ở Hakone. Rất dễ chịu.'),
      ],
      [
        '**気持ちがいい → 気持ちがよかったです** (いい đổi thành よ). Sai phổ biến: ~~いかったです~~.',
        '**きれい** là ナA ⇒ **きれいでした** (không phải ~~きれかったです~~).',
        'Vào suối nước nóng: **温泉に入ります** — trợ từ **に**.',
        'Xem **Ngữ pháp · ポイント 38** (bảng quá khứ) và **Luyện nói · ② Thế nào? — hỏi cảm tưởng**.',
      ],
      [
        mau([
          E('{旅行|りょこう}をしました。— {旅行|りょこう}は{楽|たの}しかったですか。— はい、{楽|たの}しかったです。／いいえ、{楽|たの}しくなかったです。', 'Ryokō o shimashita. — Ryokō wa tanoshikatta desu ka. — Hai, tanoshikatta desu. / Iie, tanoshiku nakatta desu.', 'Số 1-1 例 — du lịch.'),
          E('{映画|えいが}を{見|み}ました。— {映画|えいが}は{楽|たの}しかったですか。— はい、{楽|たの}しかったです。', 'Eiga o mimashita. — Eiga wa tanoshikatta desu ka. — Hai, tanoshikatta desu.', 'Số 1-1 ① — xem phim.'),
          E('バーベキューをしました。— はい、{楽|たの}しかったです。', 'Bābekyū o shimashita. — Hai, tanoshikatta desu.', 'Số 1-1 ② — BBQ.'),
          E('パソコンでゲームをしました。— いいえ、あまり{楽|たの}しくなかったです。', 'Pasokon de gēmu o shimashita. — Iie, amari tanoshiku nakatta desu.', 'Số 1-1 ③ — dùng máy tính.'),
          E('{友達|ともだち}と{映画|えいが}を{見|み}ました。— {映画|えいが}はどうでしたか。— とてもおもしろかったです。', 'Tomodachi to eiga o mimashita. — Eiga wa dō deshita ka. — Totemo omoshirokatta desu.', 'Số 1-2 例 — phim hay.'),
          E('{公園|こうえん}でバーベキューをしました。— どうでしたか。— とてもおいしかったです。', 'Kōen de bābekyū o shimashita. — Dō deshita ka. — Totemo oishikatta desu.', 'Số 1-2 ① — nướng ngoài trời, ngon.'),
          E('{子|こ}どもとサッカーをしました。— どうでしたか。— {楽|たの}しかったです。', 'Kodomo to sakkā o shimashita. — Dō deshita ka. — Tanoshikatta desu.', 'Số 1-2 ② — đá bóng, vui.'),
          E('{海|うみ}へ{行|い}きました。— どうでしたか。— とてもきれいでした。', 'Umi e ikimashita. — Dō deshita ka. — Totemo kirei deshita.', 'Số 1-2 ③ — biển, đẹp.'),
          E('はい、{新宿|しんじゅく}へ{行|い}きました。{新宿|しんじゅく}でおすしを{食|た}べました。おいしかったです。', 'Hai, Shinjuku e ikimashita. Shinjuku de o-sushi o tabemashita. Oishikatta desu.', 'Số 1-3 例.'),
          E('はい、{渋谷|しぶや}へ{行|い}きました。{渋谷|しぶや}で{服|ふく}を{買|か}いました。{安|やす}かったです。', 'Hai, Shibuya e ikimashita. Shibuya de fuku o kaimashita. Yasukatta desu.', 'Số 1-3 ① — quần áo rẻ.'),
          E('はい、{横浜|よこはま}へ{行|い}きました。{横浜|よこはま}で{海|うみ}を{見|み}ました。きれいでした。', 'Hai, Yokohama e ikimashita. Yokohama de umi o mimashita. Kirei deshita.', 'Số 1-3 ② — biển đẹp.'),
          E('はい、{箱根|はこね}へ{行|い}きました。{箱根|はこね}で{温泉|おんせん}に{入|はい}りました。{気持|きも}ちがよかったです。', 'Hai, Hakone e ikimashita. Hakone de onsen ni hairimashita. Kimochi ga yokatta desu.', 'Số 1-3 ③ — suối nước nóng, dễ chịu.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 92 · 言ってみよう (5-2) số 2 — Thứ Sáu nói kế hoạch · Thứ Hai hỏi "sao không làm?"',
      'Trang chia hai cảnh. **〈Thứ Sáu〉** hỏi "cuối tuần làm gì?" — tranh kế hoạch: 例 mua máy tính, ① chơi tennis (vợt + bóng), ② đi tới một tòa nhà. **〈Thứ Hai〉** hỏi lại "… đã làm chưa?" → "không" → **どうして** → lý do bằng **～から**: 例 anh ngạc nhiên trước chiếc máy tính giá ¥200,000 (đắt), ① làm việc tới khuya (bận), ② nằm trên giường (bị cảm), ③ đi dưới mưa che ô (trời mưa). Ghép kế hoạch nào với lý do nào cũng được — cô sẽ chỉ một cặp.',
      [
        C('（thứ Sáu）{週末|しゅうまつ}、{何|なに}をしますか。', '(thứ Sáu) Shūmatsu, nani o shimasu ka.', '(thứ Sáu) Cuối tuần em làm gì?'),
        S('テニスをします。', 'Tenisu o shimasu.', 'Em chơi tennis.'),
        C('そうですか。いいですね。', 'Sō desu ka. Ii desu ne.', 'Vậy à. Hay nhỉ.'),
        C('（thứ Hai）テニスをしましたか。', '(thứ Hai) Tenisu o shimashita ka.', '(thứ Hai) Em đã chơi tennis chưa? / Có chơi tennis không?'),
        S('いいえ、しませんでした。', 'Iie, shimasen deshita.', 'Không, em đã không chơi.'),
        C('どうしてしませんでしたか。', 'Dōshite shimasen deshita ka.', 'Tại sao không chơi?'),
        S('{雨|あめ}でしたから、しませんでした。', 'Ame deshita kara, shimasen deshita.', 'Vì trời mưa nên em không chơi.'),
      ],
      [
        'Lý do là danh từ／ナA ⇒ **～でしたから** (雨でしたから, 風邪でしたから, 暇じゃありませんでしたから); イA ⇒ **～かったですから** (高かった, 忙しかった).',
        'Trả lời どうして: **～から。** là đủ; nói cả vế sau (**～から、～ませんでした**) được điểm cao hơn.',
        'Câu hỏi thi Bài 5: **どうして日本語を勉強しますか** — trả lời có から (日本の会社で働きたいですから… — たい là ポイント 41).',
        'Xem **Ngữ pháp · ポイント 44, 47** và **Luyện nói · ③ Thích gì, muốn gì, vì sao?**.',
      ],
      [
        mau([
          E('{週末|しゅうまつ}、{何|なに}をしますか。— パソコンを{買|か}います。— そうですか。いいですね。', 'Shūmatsu, nani o shimasu ka. — Pasokon o kaimasu. — Sō desu ka. Ii desu ne.', 'Thứ Sáu 例 — mua máy tính.'),
          E('テニスをします。', 'Tenisu o shimasu.', 'Thứ Sáu ① — chơi tennis.'),
          E('{会社|かいしゃ}へ{行|い}きます。{仕事|しごと}をします。', 'Kaisha e ikimasu. Shigoto o shimasu.', 'Thứ Sáu ② — đến tòa nhà (công ty) làm việc.'),
          E('パソコンを{買|か}いましたか。— いいえ、{買|か}いませんでした。— どうして{買|か}いませんでしたか。— {高|たか}かったですから。', 'Pasokon o kaimashita ka. — Iie, kaimasen deshita. — Dōshite kaimasen deshita ka. — Takakatta desu kara.', 'Thứ Hai 例 — đắt.'),
          E('{忙|いそが}しかったですから、しませんでした。', 'Isogashikatta desu kara, shimasen deshita.', 'Thứ Hai ① — bận.'),
          E('{風邪|かぜ}でしたから、{行|い}きませんでした。', 'Kaze deshita kara, ikimasen deshita.', 'Thứ Hai ② — bị cảm.'),
          E('{雨|あめ}でしたから、しませんでした。', 'Ame deshita kara, shimasen deshita.', 'Thứ Hai ③ — trời mưa.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 93 · やってみよう・ペアで話しましょう (5-2) — Nghe cảm tưởng · Kể bằng ảnh',
      '**やってみよう:** nghe CD ba người マルコ, パク, アンナ kể ngày nghỉ; chọn việc họ làm trong tranh ⓐ–ⓖ (leo núi, dùng máy tính ở nhà, tiệc sinh nhật, xem quần áo, ngồi học, ngâm suối nước nóng, đi mua vé) và chọn cảm tưởng trong các câu あ–き (ngon, nóng, vui, dễ chịu, không hay, nhộn nhịp, đẹp). Nghe động từ ～ました rồi tính từ ～かった／～でした. **ペアで話しましょう:** A chọn 1 trong 3 "ảnh mình chụp hôm nghỉ" (hai người leo núi cùng một bé, một đĩa cơm cà ri, hai người ngồi ăn cơm hộp dưới hoa anh đào) rồi kể; B nghe và hỏi thêm (với ai, thế nào, sau đó…). Cô thường đóng B.',
      [
        C('（ảnh anh đào）これはいつの{写真|しゃしん}ですか。', '(ảnh anh đào) Kore wa itsu no shashin desu ka.', '(ảnh hoa anh đào) Đây là ảnh khi nào?'),
        S('{先週|せんしゅう}の{日曜日|にちようび}の{写真|しゃしん}です。', 'Senshū no nichiyōbi no shashin desu.', 'Ảnh Chủ nhật tuần trước.'),
        C('だれと{行|い}きましたか。', 'Dare to ikimashita ka.', 'Em đi với ai?'),
        S('ルームメイトと{行|い}きました。{公園|こうえん}でお{弁当|べんとう}を{食|た}べました。', 'Rūmumeito to ikimashita. Kōen de o-bentō o tabemashita.', 'Đi với bạn cùng phòng. Ăn cơm hộp ở công viên.'),
        C('どうでしたか。', 'Dō deshita ka.', 'Thế nào?'),
        S('{桜|さくら}がとてもきれいでした。{人|ひと}が{多|おお}かったですから、にぎやかでした。', 'Sakura ga totemo kirei deshita. Hito ga ōkatta desu kara, nigiyaka deshita.', 'Hoa anh đào rất đẹp. Vì đông người nên rất nhộn nhịp.'),
        C('へえ。それから？', 'Hē. Sorekara?', 'Ồ. Sau đó thì sao?'),
        S('それから、{渋谷|しぶや}で{買|か}い{物|もの}をしました。', 'Sorekara, Shibuya de kaimono o shimashita.', 'Sau đó em mua sắm ở Shibuya.'),
      ],
      [
        'Kể theo ảnh đủ 4 ý: **khi nào → với ai → ở đâu làm gì → thế nào (+ vì sao)**.',
        'Nghe **それから？** (rồi sao nữa?) là cô muốn bạn kể tiếp việc thứ hai.',
        'Luyện: **Luyện nghe · Bài 2 — Làm gì và thấy thế nào?** và **Luyện nói · Câu hỏi CÓ tranh**.',
      ],
    ),

    ...trang(
      'Trang 94–95 · チャレンジ! 今度の休みに (5-3)',
      'Trang 94: trong toa tàu điện trên đường đi học về, trần tàu treo quảng cáo tạp chí du lịch, áp phích du lịch 箱根; hai bạn (nữ + nam) đứng phía trước. Ô (1): "今度の休み?" → cô gái cầm sách hướng dẫn, đi 新宿, mặt háo hức; ô (2): hỏi lại → anh kéo vali, có hình trái tim (đi du lịch với người yêu). Trang 95: một anh đeo ba lô nắm tay vịn, ba người ngồi ghế. Ô (3): đi 大阪; ô (4): "今度の休み" → từ nhà đi 渋谷 → rạp chiếu phim. **Mục tiêu できる:** nói và hỏi kỳ nghỉ tới sẽ làm gì, muốn làm gì, muốn có gì.',
      [
        C('{今度|こんど}の{休|やす}みに{何|なに}をしますか。', 'Kondo no yasumi ni nani o shimasu ka.', 'Kỳ nghỉ tới em làm gì?'),
        S('{渋谷|しぶや}へ{映画|えいが}を{見|み}に{行|い}きます。', 'Shibuya e eiga o mi ni ikimasu.', 'Em đi Shibuya xem phim.'),
        C('（ô 2）この{人|ひと}はだれと{旅行|りょこう}しますか。', '(ô 2) Kono hito wa dare to ryokō shimasu ka.', '(ô 2) Người này đi du lịch với ai?'),
        S('{恋人|こいびと}と{旅行|りょこう}します。', 'Koibito to ryokō shimasu.', 'Du lịch với người yêu.'),
        C('ミンさんはどこへ{行|い}きたいですか。', 'Min-san wa doko e ikitai desu ka.', 'Minh muốn đi đâu?'),
        S('{大阪|おおさか}へ{行|い}きたいです。', 'Ōsaka e ikitai desu.', 'Em muốn đi Osaka.'),
        C('{今|いま}、{何|なに}がほしいですか。', 'Ima, nani ga hoshii desu ka.', 'Bây giờ em muốn có gì?'),
        S('{新|あたら}しいパソコンがほしいです。', 'Atarashii pasokon ga hoshii desu.', 'Em muốn có máy tính mới.'),
      ],
      [
        '**ポイント 39** Nが好きです／嫌いです · **ポイント 40** Nが**ほしい**です (muốn CÓ vật) · **ポイント 41** V(bỏ ます)+**たい**です (muốn LÀM) · **ポイント 42** nơi**へ** V(bỏ ます)／N **に行きます** (đi đâu để làm gì).',
        'Phân biệt: **パソコンがほしいです** (muốn có) ↔ **パソコンを買いたいです** (muốn mua). Không nói ~~パソコンをほしいです~~.',
        'ポイント 42: 映画を見**ます** → 映画を見**に行きます**; danh từ hành động: 買い物**に**行きます, 食事**に**行きます.',
        'Xem **Hội thoại · 5-3 今度の休みに** và **Ngữ pháp · ポイント 39–42**.',
      ],
    ),

    ...trang(
      'Trang 96 · 言ってみよう (5-3) — Số 1: muốn có nên đi đâu · Số 2/3: thích gì, định làm gì',
      '**Số 1:** "kỳ nghỉ tới làm gì?" → "vì muốn có X nên đi Y": 例 máy tính・điện máy サカイ, ① xe đạp・tòa nhà ニコニコショッピングビル, ② túi to・trung tâm thương mại, ③ điện thoại di động・秋葉原, ④ ví mới・新宿. **Số 2/3:** trần toa tàu treo 5 quảng cáo: 例 đợt giảm giá lớn của trung tâm thương mại, ① máy chơi game mới ra, ② phim điệp viên sắp chiếu, ③ lễ hội mở cửa biển mùa hè, ④ tour Hokkaido mùa hè; bong bóng ghi thời điểm và nơi: 例 Chủ nhật・新宿, ① tối nay・ở nhà, ② cuối tuần・渋谷, ③ hè năm nay, ④ kỳ nghỉ xuân năm sau. Hỏi "B có thích … không?" → "thích; (lúc đó) sẽ làm … ở …" → A: "tôi cũng muốn …".',
      [
        C('{今度|こんど}の{休|やす}みに{何|なに}をしますか。', 'Kondo no yasumi ni nani o shimasu ka.', 'Kỳ nghỉ tới em làm gì?'),
        S('{自転車|じてんしゃ}がほしいですから、ニコニコショッピングビルへ{行|い}きます。', 'Jitensha ga hoshii desu kara, Nikoniko shoppingu biru e ikimasu.', 'Vì muốn có xe đạp nên em đi tòa nhà Nikoniko.'),
        C('ミンさんはゲームが{好|す}きですか。', 'Min-san wa gēmu ga suki desu ka.', 'Minh có thích game không?'),
        S('はい、{好|す}きです。{今晩|こんばん}、うちでゲームをします。', 'Hai, suki desu. Konban, uchi de gēmu o shimasu.', 'Vâng, thích. Tối nay em chơi game ở nhà.'),
        C('へえ、いいですね。{私|わたし}もゲームをしたいです。', 'Hē, ii desu ne. Watashi mo gēmu o shitai desu.', 'Ồ, hay nhỉ. Cô cũng muốn chơi game.'),
        C('{嫌|きら}いな{食|た}べ{物|もの}がありますか。', 'Kirai na tabemono ga arimasu ka.', 'Em có món nào ghét không?'),
        S('はい、あります。なっとうが{嫌|きら}いです。', 'Hai, arimasu. Nattō ga kirai desu.', 'Có ạ. Em ghét natto.'),
      ],
      [
        '好き／嫌い／ほしい dùng trợ từ **が** (ゲーム**が**好きです). Không thích lắm: **あまり好きじゃありません** (lịch sự hơn 嫌いです).',
        'Lý do + から đứng TRƯỚC, việc làm đứng SAU: **～がほしいですから、～へ行きます**.',
        'Câu hỏi thi Bài 5: **何が好きですか／今、何がほしいですか／夏休みに何をしたいですか／どこへ行きたいですか**.',
        'Xem **Ngữ pháp · ポイント 39, 40, 41, 47** và **Luyện nói · ③ Thích gì, muốn gì, vì sao?**.',
      ],
      [
        mau([
          E('パソコンがほしいですから、サカイ{電器|でんき}へ{行|い}きます。', 'Pasokon ga hoshii desu kara, Sakai denki e ikimasu.', 'Số 1 例.'),
          E('{自転車|じてんしゃ}がほしいですから、ニコニコショッピングビルへ{行|い}きます。', 'Jitensha ga hoshii desu kara, Nikoniko shoppingu biru e ikimasu.', 'Số 1 ① — xe đạp.'),
          E('{大|おお}きいかばんがほしいですから、デパートへ{行|い}きます。', 'Ōkii kaban ga hoshii desu kara, depāto e ikimasu.', 'Số 1 ② — túi to.'),
          E('{携帯電話|けいたいでんわ}がほしいですから、{秋葉原|あきはばら}へ{行|い}きます。', 'Keitai denwa ga hoshii desu kara, Akihabara e ikimasu.', 'Số 1 ③ — điện thoại.'),
          E('{新|あたら}しい{財布|さいふ}がほしいですから、{新宿|しんじゅく}へ{行|い}きます。', 'Atarashii saifu ga hoshii desu kara, Shinjuku e ikimasu.', 'Số 1 ④ — ví mới.'),
          E('Bさんは{買|か}い{物|もの}が{好|す}きですか。— はい、{好|す}きです。{日曜日|にちようび}、{新宿|しんじゅく}で{買|か}い{物|もの}をします。— へえ、いいですね。{私|わたし}も{買|か}い{物|もの}をしたいです。', 'B-san wa kaimono ga suki desu ka. — Hai, suki desu. Nichiyōbi, Shinjuku de kaimono o shimasu. — Hē, ii desu ne. Watashi mo kaimono o shitai desu.', 'Số 2/3 例 — mua sắm.'),
          E('ゲームが{好|す}きです。{今晩|こんばん}、うちでゲームをします。— {私|わたし}もゲームをしたいです。', 'Gēmu ga suki desu. Konban, uchi de gēmu o shimasu. — Watashi mo gēmu o shitai desu.', 'Số 2/3 ① — game, tối nay, ở nhà.'),
          E('{映画|えいが}が{好|す}きです。{週末|しゅうまつ}、{渋谷|しぶや}で{映画|えいが}を{見|み}ます。— {私|わたし}も{映画|えいが}を{見|み}たいです。', 'Eiga ga suki desu. Shūmatsu, Shibuya de eiga o mimasu. — Watashi mo eiga o mitai desu.', 'Số 2/3 ② — phim, cuối tuần, Shibuya.'),
          E('お{祭|まつ}りが{好|す}きです。{今年|ことし}の{夏休|なつやす}み、{海|うみ}のお{祭|まつ}りを{見|み}ます。— {私|わたし}もお{祭|まつ}りを{見|み}たいです。', 'O-matsuri ga suki desu. Kotoshi no natsuyasumi, umi no o-matsuri o mimasu. — Watashi mo o-matsuri o mitai desu.', 'Số 2/3 ③ — lễ hội, hè năm nay.'),
          E('{旅行|りょこう}が{好|す}きです。{来年|らいねん}の{春休|はるやす}み、{北海道|ほっかいどう}へ{行|い}きます。— {私|わたし}も{北海道|ほっかいどう}へ{行|い}きたいです。', 'Ryokō ga suki desu. Rainen no haruyasumi, Hokkaidō e ikimasu. — Watashi mo Hokkaidō e ikitai desu.', 'Số 2/3 ④ — du lịch, xuân năm sau.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 97 · 言ってみよう (5-3) số 4 · やってみよう · ビンゴ',
      '**Số 4:** "kỳ nghỉ tới có đi đâu không?" → "có, đi (nơi) để (làm gì)": 例 lên núi chụp ảnh, ① 上野 — có hình quầy/máy bán vé (xem tranh ở bảo tàng), ② 渋谷 — một đôi ngồi ăn ở nhà hàng, ③ 箱根 — một đôi kéo vali xem bản đồ (du lịch), ④ một anh cầm sách ở quầy hướng dẫn (mượn sách). **やってみよう:** nghe アンナ và マルコ nói kỳ nghỉ tới làm gì, chọn tranh ⓐ–ⓔ (nấu ăn, leo núi, dùng máy tính, xe đạp, ăn lẩu/nướng). **ビンゴ:** viết vào bảng 3×3 những việc cuối tuần sẽ làm và thứ muốn có (mẫu: muốn có xe đạp, muốn xem lễ hội, muốn xem phim hay, muốn có giày), rồi đi hỏi tìm bạn giống mình.',
      [
        C('{今度|こんど}の{休|やす}みにどこかへ{行|い}きますか。', 'Kondo no yasumi ni dokoka e ikimasu ka.', 'Kỳ nghỉ tới em có đi đâu không?'),
        S('はい、{上野|うえの}へ{絵|え}を{見|み}に{行|い}きます。', 'Hai, Ueno e e o mi ni ikimasu.', 'Có, em đi Ueno xem tranh.'),
        C('（④）この{人|ひと}は？', '(4) Kono hito wa?', '(④) Còn người này?'),
        S('{図書館|としょかん}へ{本|ほん}を{借|か}りに{行|い}きます。', 'Toshokan e hon o kari ni ikimasu.', 'Đi thư viện mượn sách.'),
        S('（bingo）{自転車|じてんしゃ}がほしいですか。', '(bingo) Jitensha ga hoshii desu ka.', '(bạn hỏi cô khi chơi bingo) Cô có muốn có xe đạp không?'),
        C('いいえ、ほしくないです。{新|あたら}しい{靴|くつ}がほしいです。', 'Iie, hoshiku nai desu. Atarashii kutsu ga hoshii desu.', 'Không, cô không muốn. Cô muốn đôi giày mới.'),
      ],
      [
        '**ほしい, ～たい** chia như イA: phủ định **ほしくないです**, **行きたくないです**.',
        '**{借|か}ります** = mượn (nhận về); không nhầm với **{貸|か}します** (cho mượn — bài sau).',
        'Hỏi có đi đâu không (ポイント 43) dùng được cả cho TƯƠNG LAI: **どこかへ行きますか**.',
        'Luyện: **Luyện nghe · Bài 3 — Kỳ nghỉ tới làm gì?**.',
      ],
      [
        mau([
          E('はい、{山|やま}へ{写真|しゃしん}を{撮|と}りに{行|い}きます。', 'Hai, yama e shashin o tori ni ikimasu.', 'Số 4 例 — lên núi chụp ảnh.'),
          E('はい、{上野|うえの}へ{絵|え}を{見|み}に{行|い}きます。', 'Hai, Ueno e e o mi ni ikimasu.', 'Số 4 ① — Ueno xem tranh.'),
          E('はい、{渋谷|しぶや}へ{食事|しょくじ}に{行|い}きます。', 'Hai, Shibuya e shokuji ni ikimasu.', 'Số 4 ② — Shibuya đi ăn.'),
          E('はい、{箱根|はこね}へ{旅行|りょこう}に{行|い}きます。', 'Hai, Hakone e ryokō ni ikimasu.', 'Số 4 ③ — Hakone du lịch.'),
          E('はい、{図書館|としょかん}へ{本|ほん}を{借|か}りに{行|い}きます。', 'Hai, toshokan e hon o kari ni ikimasu.', 'Số 4 ④ — thư viện mượn sách.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 98 · できる! — Giới thiệu nơi đã đi, việc đã làm',
      'Nhiệm vụ tổng hợp: giới thiệu cho bạn cùng lớp những nơi đã đi, việc đã làm từ khi đến Nhật (bạn ở Việt Nam thì nói từ khi vào đại học / kỳ nghỉ vừa rồi). 4 bước: (1) nói theo cặp; (2) viết đoạn giới thiệu ngắn; (3) đọc bài của bạn; (4) tìm trong bài của bạn thứ mình cũng đã làm, và thứ mình muốn làm / muốn đi.',
      [
        C('{休|やす}みにどこへ{行|い}きましたか。', 'Yasumi ni doko e ikimashita ka.', 'Kỳ nghỉ em đã đi đâu?'),
        S('ダナンへ{行|い}きました。', 'Danan e ikimashita.', 'Em đã đi Đà Nẵng.'),
        C('ダナンはどうでしたか。', 'Danan wa dō deshita ka.', 'Đà Nẵng thế nào?'),
        S('{海|うみ}がとてもきれいでした。そして、{料理|りょうり}が{安|やす}かったです。', 'Umi ga totemo kirei deshita. Soshite, ryōri ga yasukatta desu.', 'Biển rất đẹp. Và đồ ăn rẻ.'),
        C('リンさんもダナンへ{行|い}きましたか。', 'Rin-san mo Danan e ikimashita ka.', '(hỏi về bài của bạn) Linh cũng đi Đà Nẵng à?'),
        S('いいえ、{行|い}きませんでした。でも、{行|い}きたいです。', 'Iie, ikimasen deshita. Demo, ikitai desu.', 'Không, bạn ấy không đi. Nhưng muốn đi.'),
      ],
      [
        'Bước 4 dùng đúng hai mẫu: **私も～ました** (tôi cũng đã…) và **私も～たいです** (tôi cũng muốn…).',
        'Xem **Hội thoại · できる！** và **Luyện nói · Bài nói mẫu: 私の週末**.',
      ],
    ),

    ...trang(
      'Trang 98 · 話読聞書「楽しい1日」 — Một ngày vui',
      'Ô 話読聞書 có đoạn ngắn khoảng 7 câu: người viết kể Chủ nhật cùng bạn leo một ngọn núi gần nhà — trời đẹp nên rất dễ chịu, ăn cơm hộp trên núi, phong cảnh nhìn từ trên cao rất đẹp, sau đó đi xem một ngôi chùa cổ, và kết: một ngày rất vui, muốn đi lại. Từ mới: 近く (gần đây), 1日 (một ngày), また (lại, lần nữa). Bên cạnh là 4 câu hỏi gợi ý để phỏng vấn: cuối tuần làm gì, đi với ai, thế nào, "rồi sao nữa?". Nhiệm vụ: viết "một ngày vui" CỦA BẠN theo cùng thứ tự rồi đọc to.',
      [
        C('{週末|しゅうまつ}、{何|なに}をしましたか。', 'Shūmatsu, nani o shimashita ka.', 'Cuối tuần em làm gì?'),
        S('{友達|ともだち}と{湖|みずうみ}へ{行|い}きました。', 'Tomodachi to mizuumi e ikimashita.', 'Em đi hồ với bạn.'),
        C('{楽|たの}しい1{日|にち}の{話|はなし}を{読|よ}んでください。', 'Tanoshii ichinichi no hanashi o yonde kudasai.', 'Em đọc bài "một ngày vui" của em đi.'),
        S('{日曜日|にちようび}、{友達|ともだち}とホータイ（{西湖|せいこ}）へ{行|い}きました。{天気|てんき}がよかったですから、{自転車|じてんしゃ}に{乗|の}りました。とても{気持|きも}ちがよかったです。それから、{近|ちか}くの{店|みせ}でフォーを{食|た}べました。とてもおいしかったです。{楽|たの}しい1{日|にち}でした。また{行|い}きたいです。', 'Nichiyōbi, tomodachi to Hōtai (Seiko) e ikimashita. Tenki ga yokatta desu kara, jitensha ni norimashita. Totemo kimochi ga yokatta desu. Sorekara, chikaku no mise de fō o tabemashita. Totemo oishikatta desu. Tanoshii ichinichi deshita. Mata ikitai desu.', 'Chủ nhật tôi đi Hồ Tây với bạn. Vì trời đẹp nên chúng tôi đạp xe. Rất dễ chịu. Sau đó ăn phở ở quán gần đó. Rất ngon. Là một ngày vui. Tôi muốn đi lại.'),
      ],
      [
        'Khung 6 câu dùng lại mãi: **khi nào + với ai + đi đâu → (vì…から) làm gì → cảm tưởng → それから việc 2 → cảm tưởng → また～たいです**.',
        '**{自転車|じてんしゃ}に{乗|の}ります** (đi xe đạp) — trợ từ **に**; động từ 乗ります học kỹ ở bài sau, ở đây thuộc nguyên cụm.',
        '**1{日|いちにち}** (ichinichi) = một ngày ≠ **{1日|ついたち}** (tsuitachi) = ngày mùng 1.',
        'Xem **Hội thoại · Đọc hiểu: 楽しい1日** và **Luyện nói · Đọc to — Reading**.',
      ],
    ),

    { t: 'h', text: 'Trang 99 · ことば — Từ vựng của bài' },
    {
      t: 'p',
      text: 'Trang liệt kê từ mới theo 3 chủ đề: (1) 週末 — hôm nay, ngày mai, ngày kia, hôm qua, hôm kia, tuần trước, cuối tuần, nhà, phòng, trung tâm thương mại, bảo tàng mỹ thuật, game, gia đình, người yêu, bạn, bạn cùng phòng, どこか, động từ gặp/làm (nấu)/mua sắm/đi ăn/giặt/dọn dẹp, それから, 1人で; (2) 休みの後で — sáng nay, tháng trước, năm ngoái, cảm, thời tiết, bữa tối, quần áo, leo/vào, bận, hay, dễ chịu, đắt, rẻ, vui, khó, dễ, vất vả, rảnh, どうして; (3) 今度の休みに — lần tới, tối nay, năm nay, năm sau, anime, tranh, phong cảnh, xe đạp, ảnh, chụp, mượn, ほしい, 好き, 嫌い. Không có tranh. Đủ nghĩa, romaji, ví dụ: xem mục **Từ vựng** của Bài 5.',
    },
    { t: 'note', title: 'Mẹo', items: ['Cô hay bắt đổi nhanh động từ sang **～ました／～ませんでした** và tính từ sang **～かったです／～でした** — ôn ở **Ngữ pháp · Bảng tổng: hiện tại ↔ quá khứ**.', 'Xem **Từ vựng · Bài 5** và **Chữ Hán · Bài 5**.'] },

    ...trang(
      'Trang 100 · もう一度聞こう — Nghe lại cả bài',
      'Nghe lại đoạn ở trang 83: マルコ hỏi パク Chủ nhật làm gì. パク đã ăn nướng BBQ với bạn ở ký túc xá (寮 — ký túc xá): rất vui, được ăn món của nhiều nước; vì đông người nên rất nhộn nhịp. マルコ thì đi 箱根 — đi **một mình** vì bạn phải đi làm; ở đó anh tắm suối nước nóng, rất dễ chịu; anh thích suối nước nóng và muốn đi lại. Cụm mới: いろいろ(な) (nhiều loại), それはよかったですね (thế thì tốt quá nhỉ), また (lại). Cô sẽ hỏi lại các chi tiết.',
      [
        C('パクさんは{日曜日|にちようび}、{何|なに}をしましたか。', 'Paku-san wa nichiyōbi, nani o shimashita ka.', 'Chủ nhật Park đã làm gì?'),
        S('{寮|りょう}の{友達|ともだち}とバーベキューをしました。', 'Ryō no tomodachi to bābekyū o shimashita.', 'Ăn BBQ với bạn ở ký túc xá.'),
        C('バーベキューはどうでしたか。', 'Bābekyū wa dō deshita ka.', 'BBQ thế nào?'),
        S('とても{楽|たの}しかったです。{人|ひと}が{多|おお}かったですから、にぎやかでした。', 'Totemo tanoshikatta desu. Hito ga ōkatta desu kara, nigiyaka deshita.', 'Rất vui. Vì đông người nên nhộn nhịp.'),
        C('マルコさんはどこへ{行|い}きましたか。', 'Maruko-san wa doko e ikimashita ka.', 'Marco đã đi đâu?'),
        S('{箱根|はこね}へ{行|い}きました。', 'Hakone e ikimashita.', 'Đi Hakone.'),
        C('マルコさんは{友達|ともだち}と{行|い}きましたか。', 'Maruko-san wa tomodachi to ikimashita ka.', 'Marco đi với bạn à?'),
        S('いいえ、1{人|ひとり}で{行|い}きました。{友達|ともだち}は{仕事|しごと}でしたから。', 'Iie, hitori de ikimashita. Tomodachi wa shigoto deshita kara.', 'Không, đi một mình. Vì bạn anh ấy phải đi làm.'),
        C('{箱根|はこね}で{何|なに}をしましたか。', 'Hakone de nani o shimashita ka.', 'Ở Hakone đã làm gì?'),
        S('{温泉|おんせん}に{入|はい}りました。とても{気持|きも}ちがよかったです。', 'Onsen ni hairimashita. Totemo kimochi ga yokatta desu.', 'Tắm suối nước nóng. Rất dễ chịu.'),
      ],
      [
        'Người khác kể chuyện vui → đáp **それはよかったですね**; kể chuyện buồn (bị cảm, mưa) → **それは{残念|ざんねん}でしたね** (tiếc quá nhỉ).',
        'Câu hỏi về NGƯỜI THỨ HAI (マルコさんは…) — nghe kỹ tên trước は.',
        'Xem **Luyện nghe · Bài 4 — Hội thoại dài** và **Luyện nói · Câu hỏi KHÔNG có tranh**.',
      ],
    ),

    { t: 'h', text: 'Cô hỏi — bạn trả lời: ghép nhanh câu trả lời' },
    {
      t: 'build',
      id: 'b5-sach-ghep',
      title: 'Nghe câu hỏi (tiếng Việt) → ghép câu trả lời tiếng Nhật',
      items: [
        { vi: 'Cô hỏi 週末、何をしましたか → "Em xem phim với bạn."', chips: ['{友達|ともだち}と', '{映画|えいが}を', '{見|み}ました。', '{見|み}ます。', '{友達|ともだち}に'], answer: ['{友達|ともだち}と', '{映画|えいが}を', '{見|み}ました。'], ro: 'Tomodachi to eiga o mimashita.' },
        { vi: 'Cô hỏi どこかへ行きましたか → "Không, em không đi đâu cả."', chips: ['いいえ、', 'どこも', '{行|い}きませんでした。', 'どこか', '{行|い}きました。'], answer: ['いいえ、', 'どこも', '{行|い}きませんでした。'], ro: 'Iie, doko mo ikimasen deshita.' },
        { vi: 'Cô hỏi 旅行はどうでしたか → "Rất vui."', chips: ['とても', '{楽|たの}しかったです。', '{楽|たの}しいでした。', 'あまり'], answer: ['とても', '{楽|たの}しかったです。'], ro: 'Totemo tanoshikatta desu.' },
        { vi: 'Cô hỏi 海はどうでしたか → "Rất đẹp."', chips: ['とても', 'きれいでした。', 'きれかったです。', 'きれいです。'], answer: ['とても', 'きれいでした。'], ro: 'Totemo kirei deshita.' },
        { vi: 'Cô hỏi どうして行きませんでしたか → "Vì bị cảm."', chips: ['{風邪|かぜ}', 'でしたから。', 'ですから。', 'どうして'], answer: ['{風邪|かぜ}', 'でしたから。'], ro: 'Kaze deshita kara.' },
        { vi: 'Cô hỏi 今、何がほしいですか → "Em muốn có xe đạp mới."', chips: ['{新|あたら}しい', '{自転車|じてんしゃ}が', 'ほしいです。', '{自転車|じてんしゃ}を', 'たいです。'], answer: ['{新|あたら}しい', '{自転車|じてんしゃ}が', 'ほしいです。'], ro: 'Atarashii jitensha ga hoshii desu.' },
        { vi: 'Cô hỏi 夏休みに何をしたいですか → "Em muốn đi Nhật."', chips: ['{日本|にほん}へ', '{行|い}きたいです。', '{行|い}きます。', '{日本|にほん}を'], answer: ['{日本|にほん}へ', '{行|い}きたいです。'], ro: 'Nihon e ikitai desu.' },
        { vi: 'Cô hỏi 今度の休みに何をしますか → "Em đi Shibuya mua quần áo."', chips: ['{渋谷|しぶや}へ', '{服|ふく}を', '{買|か}いに', '{行|い}きます。', '{買|か}います'], answer: ['{渋谷|しぶや}へ', '{服|ふく}を', '{買|か}いに', '{行|い}きます。'], ro: 'Shibuya e fuku o kai ni ikimasu.' },
      ],
    },
  ],
};

/* ══════════════════════════ BÀI 6 — 一緒に！ ══════════════════════════ */

const SACH_6: Lesson = {
  id: 'b6-sach',
  kind: 'review',
  title: 'Theo sách — Bài 6 (trang 101–116)',
  goal: 'Nhìn poster sự kiện, vé, tạp chí so sánh quán trong sách là rủ được bạn, nhận lời hoặc từ chối khéo, so sánh chọn chỗ, và hẹn giờ, chỗ gặp.',
  minutes: 60,
  blocks: [
    CACH_DUNG,

    ...trang(
      'Trang 101 · 話してみよう・聞いてみよう — Mở bài 一緒に！',
      '**話してみよう** — 4 tranh không lời: (1) một cô gái đứng trước một tiệm mì, chỉ tay rủ hai bạn nam vào ăn; (2) mấy tấm vé: vé hòa nhạc cổ điển và vé một trận bóng đá giữa hai đội FC; (3) một nhóm bạn nhảy, hát karaoke dưới quả cầu đèn disco; (4) ba người ngồi sofa cùng xem một cuốn tạp chí du lịch vùng hồ dưới chân núi Phú Sĩ. Mục đích: nói về rủ nhau đi ăn, đi xem, đi chơi. **聞いてみよう**: nghe trước đoạn hội thoại của bài (một bạn rủ bạn kia đi nghe hòa nhạc rồi hẹn giờ) — chính là trang 116.',
      [
        C('（tranh 3）ここはどこですか。', '(tranh 3) Koko wa doko desu ka.', '(tranh 3) Đây là đâu?'),
        S('カラオケです。', 'Karaoke desu.', 'Là quán karaoke.'),
        C('ミンさんはカラオケが{好|す}きですか。', 'Min-san wa karaoke ga suki desu ka.', 'Minh có thích karaoke không?'),
        S('はい、{好|す}きです。', 'Hai, suki desu.', 'Vâng, em thích.'),
        C('じゃ、{今晩|こんばん}、{一緒|いっしょ}にカラオケに{行|い}きませんか。', 'Ja, konban, issho ni karaoke ni ikimasen ka.', 'Vậy tối nay cùng đi karaoke không?'),
        S('いいですね。{行|い}きましょう。', 'Ii desu ne. Ikimashō.', 'Hay đấy. Đi thôi.'),
        C('（tranh 2）これは{何|なん}ですか。', '(tranh 2) Kore wa nan desu ka.', '(tranh 2) Đây là gì?'),
        S('コンサートとサッカーのチケットです。', 'Konsāto to sakkā no chiketto desu.', 'Là vé hòa nhạc và vé bóng đá.'),
      ],
      [
        'Cô hay rủ thử ngay từ trang đầu: nghe **～ませんか** = lời RỦ, không phải câu hỏi phủ định ⇒ đáp **いいですね。～ましょう** hoặc từ chối khéo.',
        'Xem **Hội thoại · ① 一緒に行きませんか** và **Ngữ pháp · ポイント 48, 49**.',
      ],
    ),

    ...trang(
      'Trang 102–103 · チャレンジ! 一緒に行きませんか',
      'Trang 102: **mặt cắt tòa nhà trường học** hai tầng, sáu cảnh nối tiếp như truyện tranh không lời: (1) trong lớp, một người đứng cạnh bảng rủ một bạn nam đứng gần cửa sổ; (2) lớp học trống, đồng hồ treo tường; (3) phòng máy tính không người; (4) hành lang có máy bán nước, một nữ một nam gặp nhau nói chuyện; (5) một bạn nam mở cửa nhìn ra; (6) trước bảng thông báo có dán poster **lễ hội pháo hoa**, bạn nữ chỉ vào poster rủ bạn nam. Trang 103 — các ô gợi ý: (1) "tối nay" → ba người → quán ăn: rủ đi ăn, hai người nghe cười (nhận lời); (2) bong bóng nhân viên quán đồ ăn nhanh: bạn nam lúng túng — có việc làm thêm (từ chối); (3) poster **横浜 花火大会**: có pháo hoa ở Yokohama; (4) bạn nam có hai tấm vé, đưa cho bạn nữ — cô chắp tay vui mừng. **Mục tiêu できる:** rủ bạn; nhận lời hoặc từ chối lời rủ.',
      [
        C('ミンさん、{今晩|こんばん}、{一緒|いっしょ}にご{飯|はん}を{食|た}べませんか。', 'Min-san, konban, issho ni gohan o tabemasen ka.', 'Minh, tối nay cùng đi ăn cơm không?'),
        S('いいですね。{食|た}べましょう。', 'Ii desu ne. Tabemashō.', 'Hay đấy. Đi ăn thôi.'),
        C('{土曜日|どようび}、カラオケに{行|い}きませんか。', 'Doyōbi, karaoke ni ikimasen ka.', 'Thứ Bảy đi karaoke không?'),
        S('ああ、{土曜日|どようび}ですか。すみません。{土曜日|どようび}はちょっと……。アルバイトがありますから。', 'Ā, doyōbi desu ka. Sumimasen. Doyōbi wa chotto…. Arubaito ga arimasu kara.', 'À, thứ Bảy ạ. Xin lỗi. Thứ Bảy thì hơi…. Vì em có việc làm thêm.'),
        C('そうですか。{残念|ざんねん}です。じゃ、また{今度|こんど}。', 'Sō desu ka. Zannen desu. Ja, mata kondo.', 'Vậy à. Tiếc quá. Vậy hẹn lần khác.'),
        C('（ô 3）{横浜|よこはま}で{何|なに}がありますか。', '(ô 3) Yokohama de nani ga arimasu ka.', '(ô 3) Ở Yokohama có gì?'),
        S('{花火大会|はなびたいかい}があります。', 'Hanabi taikai ga arimasu.', 'Có lễ hội pháo hoa.'),
      ],
      [
        '**ポイント 48 ～ませんか** (rủ) · **ポイント 49 ～ましょう** (… thôi) · **ポイント 50 Nがあります** (có hẹn/có việc: 用事があります, 約束があります, アルバイトがあります) · **ポイント 51 nơiでNがあります** (sự kiện diễn ra ở đâu — dùng **で**, không phải に) · **ポイント 52 Nが～枚あります** (có bao nhiêu).',
        'Từ chối kiểu Nhật: **KHÔNG nói いいえ**. Nhắc lại thời gian + すみません + **～はちょっと……** (bỏ lửng) + lý do **～がありますから**.',
        'So sánh: 横浜**に**公園があります (vật ở đâu — Bài 4) ↔ 横浜**で**花火大会があります (sự kiện diễn ra ở đâu).',
        'Xem **Hội thoại · ①** và **Ngữ pháp · Trọn bộ mẫu: rủ → nhận lời / từ chối khéo**.',
      ],
    ),

    ...trang(
      'Trang 104 · 言ってみよう (chủ đề 1) — Số 1: rủ → nhận lời/từ chối · Số 2: từ chối có lý do',
      '**Số 1:** rủ "(khi nào), cùng … không?" — gợi ý: 例 tối nay・ăn cơm, ① thứ Sáu tuần này・phim, ② Chủ nhật tuần sau・bóng đá, ③ nghỉ hè・núi Phú Sĩ, ④ ngày 20 tháng này・hòa nhạc; hai nhánh trả lời: nhận lời (いいですね。～ましょう) hoặc từ chối (ああ、～ですか。すみません。～はちょっと……). **Số 2:** từ chối kèm lý do rồi A đáp "tiếc quá, hẹn lần khác": 例 tối nay・karaoke／có việc; ① nghỉ hè・du lịch／làm thêm; ② ngày kia・BBQ／thứ Hai có bài kiểm tra; ③ cuối tuần・mua sắm／có việc; ④ ngày 15 tháng sau・lái xe dạo chơi／có hẹn.',
      [
        C('（①）{今週|こんしゅう}の{金曜日|きんようび}、{一緒|いっしょ}に{映画|えいが}を{見|み}ませんか。', '(1) Konshū no kin\'yōbi, issho ni eiga o mimasen ka.', '(①) Thứ Sáu tuần này cùng xem phim không?'),
        S('いいですね。{見|み}ましょう。', 'Ii desu ne. Mimashō.', 'Hay đấy. Xem thôi.'),
        C('（③）{夏休|なつやす}み、{一緒|いっしょ}に{富士山|ふじさん}に{登|のぼ}りませんか。', '(3) Natsuyasumi, issho ni Fujisan ni noborimasen ka.', '(③) Nghỉ hè cùng leo núi Phú Sĩ không?'),
        S('ああ、{夏休|なつやす}みですか。すみません。{夏休|なつやす}みはちょっと……。', 'Ā, natsuyasumi desu ka. Sumimasen. Natsuyasumi wa chotto….', 'À, nghỉ hè ạ. Xin lỗi. Nghỉ hè thì hơi….'),
        C('（số 2 ②）あさって、バーベキューをしませんか。', '(số 2, 2) Asatte, bābekyū o shimasen ka.', '(số 2, ②) Ngày kia làm BBQ không?'),
        S('ああ、あさってですか。すみません。あさってはちょっと……。{月曜日|げつようび}にテストがありますから。', 'Ā, asatte desu ka. Sumimasen. Asatte wa chotto…. Getsuyōbi ni tesuto ga arimasu kara.', 'À, ngày kia ạ. Xin lỗi. Ngày kia thì hơi…. Vì thứ Hai có bài kiểm tra.'),
        C('そうですか。{残念|ざんねん}です。じゃ、また{今度|こんど}。', 'Sō desu ka. Zannen desu. Ja, mata kondo.', 'Vậy à. Tiếc quá. Vậy lần sau nhé.'),
      ],
      [
        'Động từ trong lời rủ phải hợp với việc: 映画を**見**ませんか, サッカーを**し**ませんか, 富士山に**登**りませんか, コンサートに**行**きませんか.',
        'Nhận lời bằng **cùng động từ + ましょう**: 見ませんか → 見ましょう; 行きませんか → 行きましょう.',
        'Đề thi Bài 6 (có tranh) hay cho poster rồi cô rủ ⇒ bạn đáp nhận lời; cô có thể yêu cầu "hãy từ chối" ⇒ dùng đủ 4 phần: **ああ、～ですか。すみません。～はちょっと……。～がありますから。**',
        'Xem **Ngữ pháp · ポイント 48, 49, 50** và **Luyện nói · Đóng vai**.',
      ],
      [
        mau([
          E('{今晩|こんばん}、{一緒|いっしょ}にご{飯|はん}を{食|た}べませんか。— いいですね。{食|た}べましょう。／ああ、{今晩|こんばん}ですか。すみません。{今晩|こんばん}はちょっと……。', 'Konban, issho ni gohan o tabemasen ka. — Ii desu ne. Tabemashō. / Ā, konban desu ka. Sumimasen. Konban wa chotto….', 'Số 1 例 — hai nhánh.'),
          E('{今週|こんしゅう}の{金曜日|きんようび}、{一緒|いっしょ}に{映画|えいが}を{見|み}ませんか。— いいですね。{見|み}ましょう。', 'Konshū no kin\'yōbi, issho ni eiga o mimasen ka. — Ii desu ne. Mimashō.', 'Số 1 ① — phim.'),
          E('{来週|らいしゅう}の{日曜日|にちようび}、{一緒|いっしょ}にサッカーをしませんか。— いいですね。しましょう。', 'Raishū no nichiyōbi, issho ni sakkā o shimasen ka. — Ii desu ne. Shimashō.', 'Số 1 ② — bóng đá.'),
          E('{夏休|なつやす}み、{一緒|いっしょ}に{富士山|ふじさん}に{登|のぼ}りませんか。— いいですね。{登|のぼ}りましょう。', 'Natsuyasumi, issho ni Fujisan ni noborimasen ka. — Ii desu ne. Noborimashō.', 'Số 1 ③ — núi Phú Sĩ.'),
          E('{今月|こんげつ}の{20日|はつか}、{一緒|いっしょ}にコンサートに{行|い}きませんか。— ああ、{20日|はつか}ですか。すみません。{20日|はつか}はちょっと……。', 'Kongetsu no hatsuka, issho ni konsāto ni ikimasen ka. — Ā, hatsuka desu ka. Sumimasen. Hatsuka wa chotto….', 'Số 1 ④ — hòa nhạc (nhánh từ chối).'),
          E('{今晩|こんばん}、カラオケに{行|い}きませんか。— ああ、{今晩|こんばん}ですか。すみません。{今晩|こんばん}はちょっと……。{用事|ようじ}がありますから。— ああ、そうですか。{残念|ざんねん}です。じゃ、また{今度|こんど}。', 'Konban, karaoke ni ikimasen ka. — Ā, konban desu ka. Sumimasen. Konban wa chotto…. Yōji ga arimasu kara. — Ā, sō desu ka. Zannen desu. Ja, mata kondo.', 'Số 2 例 — có việc.'),
          E('{夏休|なつやす}み、{旅行|りょこう}に{行|い}きませんか。— すみません。{夏休|なつやす}みはちょっと……。アルバイトがありますから。', 'Natsuyasumi, ryokō ni ikimasen ka. — Sumimasen. Natsuyasumi wa chotto…. Arubaito ga arimasu kara.', 'Số 2 ① — làm thêm.'),
          E('あさって、バーベキューをしませんか。— すみません。あさってはちょっと……。{月曜日|げつようび}にテストがありますから。', 'Asatte, bābekyū o shimasen ka. — Sumimasen. Asatte wa chotto…. Getsuyōbi ni tesuto ga arimasu kara.', 'Số 2 ② — thứ Hai kiểm tra.'),
          E('{週末|しゅうまつ}、{買|か}い{物|もの}に{行|い}きませんか。— すみません。{週末|しゅうまつ}はちょっと……。{用事|ようじ}がありますから。', 'Shūmatsu, kaimono ni ikimasen ka. — Sumimasen. Shūmatsu wa chotto…. Yōji ga arimasu kara.', 'Số 2 ③ — có việc.'),
          E('{来月|らいげつ}の{15日|じゅうごにち}、ドライブに{行|い}きませんか。— すみません。{15日|じゅうごにち}はちょっと……。{約束|やくそく}がありますから。', 'Raigetsu no jūgonichi, doraibu ni ikimasen ka. — Sumimasen. Jūgonichi wa chotto…. Yakusoku ga arimasu kara.', 'Số 2 ④ — có hẹn.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 105 · 言ってみよう số 3–4 · やってみよう · ロールプレイ (chủ đề 1)',
      '**Số 3:** hai người đứng trước **bảng tin sự kiện**, thấy một poster rồi rủ nhau đi xem: 例 trận bóng chày ở sân vận động mái vòm 横浜 ngày 20/6 (CN); ① lễ hội あさくさ ngày 5/6 (thứ Bảy), có hình kiệu; ② pháo hoa 箱根 ngày 24/7 (CN), bắt đầu 7 giờ; ③ đợt giảm giá mùa hè ở ニコニコショッピングビル từ 1/7. **Số 4:** hỏi "có thích … không?" rồi "tôi có 2 vé／có đĩa… cùng … không?": 例 vé bóng đá, ① vé hòa nhạc piano, ② một đĩa CD nhạc, ③ một đĩa DVD phim hoạt hình. **やってみよう:** nghe 5 đoạn rủ, ghi ○ nếu hai người sẽ cùng làm, × nếu từ chối. **ロールプレイ:** A rủ B làm việc A thích; B quyết định đi hay không.',
      [
        C('あ、{浅草|あさくさ}でお{祭|まつ}りがあります。', 'A, Asakusa de o-matsuri ga arimasu.', 'A, ở Asakusa có lễ hội.'),
        S('へえ。いつですか。', 'Hē. Itsu desu ka.', 'Ồ. Khi nào vậy?'),
        C('{6月|ろくがつ}{5日|いつか}です。ミンさん、{一緒|いっしょ}に{見|み}に{行|い}きませんか。', 'Rokugatsu itsuka desu. Min-san, issho ni mi ni ikimasen ka.', 'Ngày 5 tháng 6. Minh, cùng đi xem không?'),
        S('いいですね。{行|い}きましょう。', 'Ii desu ne. Ikimashō.', 'Hay đấy. Đi thôi.'),
        C('ミンさんは{音楽|おんがく}が{好|す}きですか。', 'Min-san wa ongaku ga suki desu ka.', 'Minh có thích âm nhạc không?'),
        S('はい、{好|す}きです。', 'Hai, suki desu.', 'Vâng, em thích.'),
        C('ピアノのコンサートのチケットが{2枚|にまい}あります。{一緒|いっしょ}に{行|い}きませんか。', 'Piano no konsāto no chiketto ga nimai arimasu. Issho ni ikimasen ka.', 'Cô có 2 vé hòa nhạc piano. Cùng đi không?'),
        S('わあ、いいですね。ぜひ{行|い}きたいです。', 'Wā, ii desu ne. Zehi ikitai desu.', 'Ồ, hay quá. Em rất muốn đi.'),
      ],
      [
        '**～を見に行きませんか** = rủ đi (đâu đó) để xem — ghép ポイント 42 (Bài 5) với 48.',
        'Đếm vé, tờ giấy, áo: **～{枚|まい}** — 1枚 いちまい, 2枚 にまい, 3枚 さんまい (ポイント 52). CD/DVD đếm bằng **～枚** hoặc **～つ** đều được ở mức này.',
        'Đọc ngày trên poster: 5日 **いつか**, 20日 **はつか**, 24日 **にじゅうよっか**, 1日 **ついたち**.',
        'Luyện nghe ○×: **Luyện nghe · Bài 1 — Hai người có cùng đi không?** (nghe ちょっと…… ⇒ ×).',
      ],
      [
        mau([
          E('あ、{横浜|よこはま}で{野球|やきゅう}の{試合|しあい}があります。— へえ。— {一緒|いっしょ}に{見|み}に{行|い}きませんか。— いいですね。', 'A, Yokohama de yakyū no shiai ga arimasu. — Hē. — Issho ni mi ni ikimasen ka. — Ii desu ne.', 'Số 3 例 — trận bóng chày.'),
          E('あ、{浅草|あさくさ}でお{祭|まつ}りがあります。{一緒|いっしょ}に{見|み}に{行|い}きませんか。', 'A, Asakusa de o-matsuri ga arimasu. Issho ni mi ni ikimasen ka.', 'Số 3 ① — lễ hội Asakusa.'),
          E('あ、{箱根|はこね}で{花火|はなび}があります。{一緒|いっしょ}に{見|み}に{行|い}きませんか。', 'A, Hakone de hanabi ga arimasu. Issho ni mi ni ikimasen ka.', 'Số 3 ② — pháo hoa Hakone.'),
          E('あ、ニコニコショッピングビルでセールがあります。{一緒|いっしょ}に{買|か}い{物|もの}に{行|い}きませんか。', 'A, Nikoniko shoppingu biru de sēru ga arimasu. Issho ni kaimono ni ikimasen ka.', 'Số 3 ③ — đợt giảm giá.'),
          E('Bさんはサッカーが{好|す}きですか。— はい。— サッカーのチケットが{2枚|にまい}あります。{一緒|いっしょ}に{見|み}に{行|い}きませんか。— わあ、いいですね。{行|い}きましょう。', 'B-san wa sakkā ga suki desu ka. — Hai. — Sakkā no chiketto ga nimai arimasu. Issho ni mi ni ikimasen ka. — Wā, ii desu ne. Ikimashō.', 'Số 4 例 — vé bóng đá.'),
          E('ピアノのコンサートのチケットが{2枚|にまい}あります。{一緒|いっしょ}に{行|い}きませんか。', 'Piano no konsāto no chiketto ga nimai arimasu. Issho ni ikimasen ka.', 'Số 4 ① — vé hòa nhạc piano.'),
          E('{音楽|おんがく}が{好|す}きですか。— はい。— いいCDがあります。{一緒|いっしょ}に{聞|き}きませんか。', 'Ongaku ga suki desu ka. — Hai. — Ii shī-dī ga arimasu. Issho ni kikimasen ka.', 'Số 4 ② — đĩa CD (nghe).'),
          E('アニメが{好|す}きですか。— はい。— アニメのDVDがあります。{一緒|いっしょ}に{見|み}ませんか。', 'Anime ga suki desu ka. — Hai. — Anime no dī-bui-dī ga arimasu. Issho ni mimasen ka.', 'Số 4 ③ — DVD hoạt hình (xem).'),
        ]),
      ],
    ),

    ...trang(
      'Trang 106–107 · チャレンジ! どちらがいいですか',
      'Trang 106: trong lớp, một bạn nam đứng cạnh bàn nói chuyện với ba bạn đang ngồi; phía sau là bảng đen, tủ đồ, bảng tin. Ô (1): anh muốn rủ một bạn nữ và nhóm bạn đi xem phim; ô (2): bong bóng liệt kê thể loại phim (hành động, kinh dị, hài…) — hỏi thích loại nào NHẤT → bạn nữ chọn **コメディー**; ô (3): cả nhóm vào rạp. Trang 107: hai bạn nam cùng nhìn màn hình máy tính, phía sau là bảng ghim giấy note. Ô (2) nhỏ: "tối nay" → đi ăn; bánh mì và cá — thích món nào hơn → sushi; ô (3): màn hình hiện hai quán **さくら寿司** và **みどり寿司**, cái cân so giá: みどり từ 200 yên, さくら từ 300 yên. **Mục tiêu できる:** hỏi ý bạn, so sánh thông tin để cùng quyết định.',
      [
        C('ミンさんは{映画|えいが}で{何|なに}がいちばん{好|す}きですか。', 'Min-san wa eiga de nani ga ichiban suki desu ka.', 'Trong các loại phim, Minh thích gì nhất?'),
        S('コメディーがいちばん{好|す}きです。', 'Komedī ga ichiban suki desu.', 'Em thích phim hài nhất.'),
        C('パンとおすしとどちらが{好|す}きですか。', 'Pan to o-sushi to dochira ga suki desu ka.', 'Bánh mì và sushi, em thích cái nào hơn?'),
        S('おすしのほうが{好|す}きです。', 'O-sushi no hō ga suki desu.', 'Em thích sushi hơn.'),
        C('（ô 3）さくら{寿司|ずし}とみどり{寿司|ずし}とどちらが{安|やす}いですか。', '(ô 3) Sakura-zushi to Midori-zushi to dochira ga yasui desu ka.', '(ô 3) Sakura Sushi và Midori Sushi, quán nào rẻ hơn?'),
        S('みどり{寿司|ずし}のほうが{安|やす}いです。', 'Midori-zushi no hō ga yasui desu.', 'Midori Sushi rẻ hơn.'),
        C('じゃ、どちらへ{行|い}きますか。', 'Ja, dochira e ikimasu ka.', 'Vậy đi quán nào?'),
        S('みどり{寿司|ずし}へ{行|い}きましょう。みどり{寿司|ずし}はさくら{寿司|ずし}より{安|やす}いですから。', 'Midori-zushi e ikimashō. Midori-zushi wa Sakura-zushi yori yasui desu kara.', 'Đi Midori Sushi thôi. Vì Midori rẻ hơn Sakura.'),
      ],
      [
        '**ポイント 53** N1で N2が **いちばん** A です (nhất trong nhóm) · **ポイント 54** N1は N2 **より** A です (N1 hơn N2) · **ポイント 55** N1**と**N2**と どちらが** A ですか · **ポイント 56** N**のほうが** A です.',
        'Trả lời どちら **luôn dùng のほうが** (みどり寿司のほうが安いです) — không trả lời bằng いちばん.',
        'Bằng nhau: **どちらも** + A (どちらも好きです — cả hai đều thích).',
        'Xem **Hội thoại · ② どちらがいいですか** và **Ngữ pháp · ポイント 53–56**.',
      ],
    ),

    ...trang(
      'Trang 108 · 言ってみよう (chủ đề 2) — Số 1: いちばん · Số 2: hai chỗ, chỗ nào hơn',
      '**Số 1:** "trong …, … nhất là gì?": 例 phim・thích, ① đồ ăn Nhật・thích, ② Tokyo・thú vị (hỏi NƠI ⇒ どこ), ③ ca sĩ・thích (hỏi NGƯỜI ⇒ だれ), ④ quán nhậu ở 新宿・rẻ (hỏi quán ⇒ どこ). **Số 2:** rủ đi → "xem ở đâu?" → có hai chỗ → "chỗ nào … hơn?" → chọn: tạp chí gấp ghi số liệu — 例 rạp phim: ニコニコ映画館 đi bộ 5 phút từ ga, ふじ映画館 xe buýt 10 phút (gần hơn); ① chỗ BBQ: công viên さくら 560 m², công viên みどり 28.000 m² (rộng hơn); ② ăn bánh thả ga 90 phút ở 新宿: quán オレンジ 2.500 yên (có cả cà phê, hồng trà), quán ひまわり 1.200 yên (rẻ hơn); ③ ngắm hoa: công viên みどり 38 cây anh đào, công viên わかば 120 cây (nhiều hơn).',
      [
        C('（②）{東京|とうきょう}でどこがいちばんおもしろいですか。', '(2) Tōkyō de doko ga ichiban omoshiroi desu ka.', '(②) Ở Tokyo, chỗ nào thú vị nhất?'),
        S('{秋葉原|あきはばら}がいちばんおもしろいです。', 'Akihabara ga ichiban omoshiroi desu.', 'Akihabara thú vị nhất.'),
        C('（③）{歌手|かしゅ}でだれがいちばん{好|す}きですか。', '(3) Kashu de dare ga ichiban suki desu ka.', '(③) Trong các ca sĩ, em thích ai nhất?'),
        S('ソンタンMTPがいちばん{好|す}きです。', 'Son Tan Emu-tī-pī ga ichiban suki desu.', 'Em thích Sơn Tùng M-TP nhất.'),
        C('（số 2 ①）さくら{公園|こうえん}とみどり{公園|こうえん}とどちらが{広|ひろ}いですか。', '(số 2, 1) Sakura kōen to Midori kōen to dochira ga hiroi desu ka.', '(số 2, ①) Công viên Sakura và Midori, cái nào rộng hơn?'),
        S('みどり{公園|こうえん}のほうが{広|ひろ}いです。', 'Midori kōen no hō ga hiroi desu.', 'Công viên Midori rộng hơn.'),
        C('そうですか。じゃ、みどり{公園|こうえん}へ{行|い}きましょう。', 'Sō desu ka. Ja, Midori kōen e ikimashō.', 'Vậy à. Vậy đi công viên Midori thôi.'),
      ],
      [
        'Từ hỏi trong câu いちばん đổi theo loại: vật／món → **何**, nơi → **どこ**, người → **だれ**, thời gian／mùa → **いつ**. Đây là lỗi hay bị trừ điểm nhất.',
        'Đề thi Bài 6 (không tranh): **日本の食べ物で何がいちばん好きですか／季節でいつがいちばん好きですか／スポーツで何がいちばん好きですか** — thuộc sẵn câu trả lời thật.',
        'Tên người Việt không có sẵn katakana: đọc theo âm (ソンタン, ホアン…) — cô không bắt lỗi chính tả tên riêng.',
        'Xem **Ngữ pháp · ポイント 53, 55, 56** và **Luyện nói · Câu hỏi không tranh ① — Thích gì NHẤT**.',
      ],
      [
        mau([
          E('Bさん、{映画|えいが}で{何|なに}がいちばん{好|す}きですか。— コメディーがいちばん{好|す}きです。', 'B-san, eiga de nani ga ichiban suki desu ka. — Komedī ga ichiban suki desu.', 'Số 1 例 — phim.'),
          E('{日本|にほん}の{食|た}べ{物|もの}で{何|なに}がいちばん{好|す}きですか。— ラーメンがいちばん{好|す}きです。', 'Nihon no tabemono de nani ga ichiban suki desu ka. — Rāmen ga ichiban suki desu.', 'Số 1 ① — đồ ăn Nhật.'),
          E('{東京|とうきょう}でどこがいちばんおもしろいですか。— {渋谷|しぶや}がいちばんおもしろいです。', 'Tōkyō de doko ga ichiban omoshiroi desu ka. — Shibuya ga ichiban omoshiroi desu.', 'Số 1 ② — nơi ⇒ どこ.'),
          E('{歌手|かしゅ}でだれがいちばん{好|す}きですか。— (tên ca sĩ)がいちばん{好|す}きです。', 'Kashu de dare ga ichiban suki desu ka. — (tên) ga ichiban suki desu.', 'Số 1 ③ — người ⇒ だれ.'),
          E('{新宿|しんじゅく}の{居酒屋|いざかや}でどこがいちばん{安|やす}いですか。— (tên quán)がいちばん{安|やす}いです。', 'Shinjuku no izakaya de doko ga ichiban yasui desu ka. — (tên quán) ga ichiban yasui desu.', 'Số 1 ④ — quán ⇒ どこ.'),
          E('ニコニコ{映画館|えいがかん}とふじ{映画館|えいがかん}とどちらが{近|ちか}いですか。— ニコニコ{映画館|えいがかん}のほうが{近|ちか}いです。— じゃ、ニコニコ{映画館|えいがかん}へ{行|い}きましょう。', 'Nikoniko eigakan to Fuji eigakan to dochira ga chikai desu ka. — Nikoniko eigakan no hō ga chikai desu. — Ja, Nikoniko eigakan e ikimashō.', 'Số 2 例 — rạp gần hơn.'),
          E('{一緒|いっしょ}にバーベキューをしませんか。— いいですね。どこでしますか。— さくら{公園|こうえん}とみどり{公園|こうえん}があります。— どちらが{広|ひろ}いですか。— みどり{公園|こうえん}のほうが{広|ひろ}いです。', 'Issho ni bābekyū o shimasen ka. — Ii desu ne. Doko de shimasu ka. — Sakura kōen to Midori kōen ga arimasu. — Dochira ga hiroi desu ka. — Midori kōen no hō ga hiroi desu.', 'Số 2 ① — công viên rộng hơn.'),
          E('オレンジとひまわりとどちらが{安|やす}いですか。— ひまわりのほうが{安|やす}いです。', 'Orenji to Himawari to dochira ga yasui desu ka. — Himawari no hō ga yasui desu.', 'Số 2 ② — quán bánh rẻ hơn.'),
          E('みどり{公園|こうえん}とわかば{公園|こうえん}とどちらが{桜|さくら}が{多|おお}いですか。— わかば{公園|こうえん}のほうが{多|おお}いです。', 'Midori kōen to Wakaba kōen to dochira ga sakura ga ōi desu ka. — Wakaba kōen no hō ga ōi desu.', 'Số 2 ③ — nhiều anh đào hơn.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 109 · 言ってみよう số 3 · やってみよう (chủ đề 2) — Chọn và nói lý do',
      '**Số 3:** "A và B, cái nào tốt hơn?" → "để xem nào… A tốt hơn. Vì A … hơn B" → "vậy chọn A": 例 từ nhà đi 新宿 hay 渋谷 (新宿 gần hơn); ① xe buýt 40 phút hay tàu điện 25 phút; ② hai quán sushi: さくら 2 tiếng 5.000 yên, もみじ 2 tiếng 3.000 yên; ③ hai khay set món: Aコース, Bコース (tự chọn theo sở thích). **やってみよう:** cuối tuần đi ăn với bạn — nghe CD rồi ghi: khi nào, quán nào, vì sao; ba quảng cáo: ⓐ sushi thả ga 90 phút 2.200 yên, quán nổi tiếng nhất Tokyo, đi bộ 15 phút từ ga 新宿; ⓑ thịt nướng thả ga 90 phút 1.800 yên, đồ ăn ngon, 5 phút từ ga; ⓒ thịt nướng thả ga 90 phút 1.200 yên, bánh cũng ngon, 10 phút từ ga. Dòng ■: BẠN chọn quán nào, vì sao — cô sẽ hỏi câu này.',
      [
        C('バスと{電車|でんしゃ}とどちらがいいですか。', 'Basu to densha to dochira ga ii desu ka.', 'Xe buýt và tàu điện, cái nào tốt hơn?'),
        S('そうですねえ。{電車|でんしゃ}のほうがいいです。{電車|でんしゃ}はバスより{早|はや}いですから。', 'Sō desu nē. Densha no hō ga ii desu. Densha wa basu yori hayai desu kara.', 'Để xem nào. Tàu điện tốt hơn. Vì tàu nhanh hơn xe buýt.'),
        C('ミンさんはⓐ〜ⓒのどの{店|みせ}へ{行|い}きますか。', 'Min-san wa ē kara shī no dono mise e ikimasu ka.', 'Minh đi quán nào trong ⓐ–ⓒ?'),
        S('ⓒの{店|みせ}へ{行|い}きます。いちばん{安|やす}いですから。そして、ケーキもおいしいですから。', 'Shī no mise e ikimasu. Ichiban yasui desu kara. Soshite, kēki mo oishii desu kara.', 'Em đi quán ⓒ. Vì rẻ nhất. Và bánh cũng ngon.'),
        C('すしと{焼|や}き{肉|にく}とどちらが{好|す}きですか。', 'Sushi to yakiniku to dochira ga suki desu ka.', 'Sushi và thịt nướng, em thích cái nào hơn?'),
        S('どちらも{好|す}きです。', 'Dochira mo suki desu.', 'Em thích cả hai.'),
      ],
      [
        'Khung trả lời 3 bước: **そうですねえ → Aのほうが～です → Aは Bより～ですから**. Nói đủ 3 bước là trọn điểm.',
        '**{早|はや}い** (sớm, nhanh — về thời gian) dùng cho tàu nhanh hơn; **{近|ちか}い／{遠|とお}い** cho khoảng cách; **{安|やす}い／{高|たか}い** cho giá.',
        'Bài やってみよう: ở đây KHÔNG ghi quán mà hai người trong CD chọn — nghe lý do sau **から** để tìm ra.',
        'Luyện: **Luyện nghe · Bài 2 — Cuối tuần đi ăn ở quán nào?** và **Bài 5 — Nghe câu so sánh**.',
      ],
      [
        mau([
          E('{新宿|しんじゅく}と{渋谷|しぶや}とどちらがいいですか。— そうですねえ。{新宿|しんじゅく}のほうがいいです。{新宿|しんじゅく}は{渋谷|しぶや}より{近|ちか}いですから。— じゃ、{新宿|しんじゅく}へ{行|い}きましょう。', 'Shinjuku to Shibuya to dochira ga ii desu ka. — Sō desu nē. Shinjuku no hō ga ii desu. Shinjuku wa Shibuya yori chikai desu kara. — Ja, Shinjuku e ikimashō.', 'Số 3 例 — gần hơn.'),
          E('{電車|でんしゃ}のほうがいいです。{電車|でんしゃ}はバスより{早|はや}いですから。', 'Densha no hō ga ii desu. Densha wa basu yori hayai desu kara.', 'Số 3 ① — tàu điện nhanh hơn.'),
          E('もみじのほうがいいです。もみじはさくらより{安|やす}いですから。', 'Momiji no hō ga ii desu. Momiji wa Sakura yori yasui desu kara.', 'Số 3 ② — quán rẻ hơn.'),
          E('Aコースのほうがいいです。{私|わたし}は{肉|にく}が{好|す}きですから。', 'Ē kōsu no hō ga ii desu. Watashi wa niku ga suki desu kara.', 'Số 3 ③ — tự chọn, lý do theo sở thích.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 110–111 · チャレンジ! 約束',
      'Trang 110: ô (1): một bạn nam rủ đi ăn, bạn kia hỏi lại "ăn gì?" → bong bóng đĩa mì Ý và chữ **もう** — hỏi "đã ăn món đó chưa?"; ô (2): bong bóng **新宿** + quán **お好み焼き** — đề xuất "quán okonomiyaki ở Shinjuku thì sao?"; bên phải một bạn nữ đứng hé cửa nhìn vào, tay cầm sổ. Trang 111: một bạn nam bước vào phòng, cạnh đó là dãy tủ khóa. Ô (3): dãy thứ trong tuần thu hẹp còn **thứ Sáu, thứ Bảy, Chủ nhật** + "いつ?" — chọn ngày; ô (4): "何時?" → "6時?" → "6時" — chốt giờ và nhắc lại để xác nhận. **Mục tiêu できる:** hẹn nhau: quyết định làm gì, ngày nào, mấy giờ, gặp ở đâu.',
      [
        C('{今度|こんど}、{一緒|いっしょ}にご{飯|はん}を{食|た}べに{行|い}きませんか。', 'Kondo, issho ni gohan o tabe ni ikimasen ka.', 'Lần tới cùng đi ăn cơm không?'),
        S('いいですね。{何|なに}を{食|た}べますか。', 'Ii desu ne. Nani o tabemasu ka.', 'Hay đấy. Ăn gì ạ?'),
        C('ミンさんはもうお{好|この}み{焼|や}きを{食|た}べましたか。', 'Min-san wa mō okonomiyaki o tabemashita ka.', 'Minh đã ăn okonomiyaki chưa?'),
        S('いいえ、まだです。', 'Iie, mada desu.', 'Chưa ạ.'),
        C('じゃ、{新宿|しんじゅく}のお{好|この}み{焼|や}きはどうですか。', 'Ja, Shinjuku no okonomiyaki wa dō desu ka.', 'Vậy okonomiyaki ở Shinjuku thì sao?'),
        S('いいですね。そうしましょう。いつ{行|い}きますか。', 'Ii desu ne. Sō shimashō. Itsu ikimasu ka.', 'Hay đấy. Làm vậy đi. Khi nào đi ạ?'),
        C('{金曜日|きんようび}はどうですか。{6時|ろくじ}に{会|あ}いましょう。', 'Kin\'yōbi wa dō desu ka. Rokuji ni aimashō.', 'Thứ Sáu thì sao? Gặp lúc 6 giờ nhé.'),
        S('{金曜日|きんようび}の{6時|ろくじ}ですね。わかりました。', 'Kin\'yōbi no rokuji desu ne. Wakarimashita.', 'Thứ Sáu 6 giờ nhỉ. Em hiểu rồi.'),
      ],
      [
        '**ポイント 57 もう～ましたか** → **はい、～ました** hoặc **いいえ、まだです** (chưa). Không trả lời ~~いいえ、食べませんでした~~ — câu đó nghĩa là "đã không ăn" (việc đã qua), không phải "chưa".',
        '**ポイント 58 Nはどうですか** ở bài này = ĐỀ XUẤT ("… thì sao?"), khác Bài 4 (hỏi tình trạng). Đồng ý: **いいですね。そうしましょう**.',
        '**ポイント 59 ～ね** nhắc lại để xác nhận (6時ですね) · **ポイント 60 ～よ** báo thông tin người nghe chưa biết (おいしいですよ).',
        'Xem **Hội thoại · ③ 約束** và **Ngữ pháp · ポイント 57–60**.',
      ],
    ),

    ...trang(
      'Trang 112 · 言ってみよう (chủ đề 3) — Số 1: もう…ましたか · Số 2: …よ · Số 3: …はどうですか',
      '**Số 1:** rủ đi chơi → "làm gì?" → "B đã … chưa?" → hai nhánh: chưa ⇒ "vậy đi … không?"; rồi ⇒ đề xuất chỗ khác. Tạp chí gợi ý: 例 đi chơi — tháp Tokyo (nếu rồi thì đổi sang お台場), ① xem phim — bộ phim "キングマン", ② ăn cơm — sukiyaki, ③ lái xe dạo chơi — 箱根 (suối nước nóng, thiên nhiên). **Số 2:** rủ kèm lời "quảng cáo" bằng **～よ**: 例 okonomiyaki／ngon, ① 浅草／vui, ② mì あさひラーメン／rẻ, ③ công viên giải trí ふじまるランド／thú vị, ④ hoa anh đào công viên わかば／đẹp. **Số 3 (đầu):** rủ đi uống cuối tuần → "đi đâu?" → "quán nhậu ở 新宿 thì sao?" → "vậy làm thế đi" (các gợi ý tiếp ở trang 113).',
      [
        C('ミンさんはもう「キングマン」を{見|み}ましたか。', 'Min-san wa mō "Kinguman" o mimashita ka.', 'Minh đã xem phim "Kingman" chưa?'),
        S('はい、{見|み}ました。', 'Hai, mimashita.', 'Rồi ạ, em xem rồi.'),
        C('そうですか。じゃ、{一緒|いっしょ}にドライブに{行|い}きませんか。', 'Sō desu ka. Ja, issho ni doraibu ni ikimasen ka.', 'Vậy à. Vậy cùng đi lái xe dạo không?'),
        S('いいですね。そうしましょう。', 'Ii desu ne. Sō shimashō.', 'Hay đấy. Làm vậy đi.'),
        C('{一緒|いっしょ}にあさひラーメンを{食|た}べに{行|い}きませんか。あさひラーメンは{安|やす}いですよ。', 'Issho ni Asahi rāmen o tabe ni ikimasen ka. Asahi rāmen wa yasui desu yo.', 'Cùng đi ăn mì Asahi không? Mì Asahi rẻ lắm đấy.'),
        S('へえ。ぜひ、{行|い}きたいです。', 'Hē. Zehi, ikitai desu.', 'Ồ. Em rất muốn đi.'),
      ],
      [
        'Nhánh "rồi" ⇒ người rủ đổi đề xuất bằng **じゃ、～へ行きませんか**; nhánh "chưa" ⇒ rủ đi chính chỗ đó.',
        '**ぜひ～たいです** = rất muốn — cách nhận lời nhiệt tình (thay cho いいですね).',
        'Xem **Ngữ pháp · ポイント 57, 60** và **Luyện nói · Câu hỏi không tranh ③**.',
      ],
      [
        mau([
          E('Bさんはもう{東京|とうきょう}タワーへ{行|い}きましたか。— いいえ、まだです。— じゃ、{東京|とうきょう}タワーへ{行|い}きませんか。— いいですね。そうしましょう。', 'B-san wa mō Tōkyō tawā e ikimashita ka. — Iie, mada desu. — Ja, Tōkyō tawā e ikimasen ka. — Ii desu ne. Sō shimashō.', 'Số 1 例 — nhánh "chưa".'),
          E('— はい、{行|い}きました。— そうですか。じゃ、お{台場|だいば}へ{行|い}きませんか。— いいですね。そうしましょう。', '— Hai, ikimashita. — Sō desu ka. Ja, Odaiba e ikimasen ka. — Ii desu ne. Sō shimashō.', 'Số 1 例 — nhánh "rồi".'),
          E('もう「キングマン」を{見|み}ましたか。— いいえ、まだです。— じゃ、「キングマン」を{見|み}ませんか。', 'Mō "Kinguman" o mimashita ka. — Iie, mada desu. — Ja, "Kinguman" o mimasen ka.', 'Số 1 ① — xem phim.'),
          E('もうすき{焼|や}きを{食|た}べましたか。— いいえ、まだです。— じゃ、すき{焼|や}きを{食|た}べませんか。', 'Mō sukiyaki o tabemashita ka. — Iie, mada desu. — Ja, sukiyaki o tabemasen ka.', 'Số 1 ② — ăn sukiyaki.'),
          E('もう{箱根|はこね}へ{行|い}きましたか。— いいえ、まだです。— じゃ、{箱根|はこね}へドライブに{行|い}きませんか。', 'Mō Hakone e ikimashita ka. — Iie, mada desu. — Ja, Hakone e doraibu ni ikimasen ka.', 'Số 1 ③ — lái xe đi Hakone.'),
          E('{一緒|いっしょ}にお{好|この}み{焼|や}きを{食|た}べに{行|い}きませんか。お{好|この}み{焼|や}きはおいしいですよ。— へえ。ぜひ、{行|い}きたいです。', 'Issho ni okonomiyaki o tabe ni ikimasen ka. Okonomiyaki wa oishii desu yo. — Hē. Zehi, ikitai desu.', 'Số 2 例.'),
          E('{一緒|いっしょ}に{浅草|あさくさ}へ{行|い}きませんか。{浅草|あさくさ}は{楽|たの}しいですよ。', 'Issho ni Asakusa e ikimasen ka. Asakusa wa tanoshii desu yo.', 'Số 2 ① — Asakusa vui.'),
          E('あさひラーメンを{食|た}べに{行|い}きませんか。あさひラーメンは{安|やす}いですよ。', 'Asahi rāmen o tabe ni ikimasen ka. Asahi rāmen wa yasui desu yo.', 'Số 2 ② — mì rẻ.'),
          E('ふじまるランドへ{行|い}きませんか。ふじまるランドはおもしろいですよ。', 'Fujimaru rando e ikimasen ka. Fujimaru rando wa omoshiroi desu yo.', 'Số 2 ③ — công viên giải trí.'),
          E('わかば{公園|こうえん}の{桜|さくら}を{見|み}に{行|い}きませんか。わかば{公園|こうえん}の{桜|さくら}はきれいですよ。', 'Wakaba kōen no sakura o mi ni ikimasen ka. Wakaba kōen no sakura wa kirei desu yo.', 'Số 2 ④ — hoa anh đào đẹp.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 113 · 言ってみよう số 3–4 · やってみよう · ペアで話しましょう (chủ đề 3)',
      '**Số 3 (tiếp):** việc định làm／nơi đề xuất: 例 đi uống／quán nhậu ở 新宿, ① đi mua quần áo／渋谷, ② nấu món Nhật ở nhà／sukiyaki, ③ đi ăn／tự chọn, ④ đi chơi／tự chọn. **Số 4:** "mấy giờ gặp?" → "… thì sao?" → nhắc lại "…ね。わかりました": 例 5 giờ, ① 6 giờ, ② ga 新宿 (hỏi chỗ: どこで会いますか), ③ công viên みどり, ④ 4 giờ ở rạp ふじ映画館. **やってみよう:** nghe パク hẹn với mấy người — hôm nay là thứ Hai ngày 10; trên lịch đã có một hẹn mẫu (ngày 10, từ 5 giờ, ga 渋谷) và ngày 22 ghi "làm thêm"; nghe rồi điền việc (tranh ⓐ–ⓔ), ngày, giờ, chỗ gặp. **ペアで話しましょう:** 4 poster (nhà hàng Ý khai trương, hòa nhạc jazz, lễ hội pháo hoa, phim "キングマン" có giờ chiếu) — rủ bạn cùng đi cuối tuần và hẹn cụ thể.',
      [
        C('{週末|しゅうまつ}、{一緒|いっしょ}に{服|ふく}を{買|か}いに{行|い}きませんか。', 'Shūmatsu, issho ni fuku o kai ni ikimasen ka.', 'Cuối tuần cùng đi mua quần áo không?'),
        S('いいですね。どこへ{行|い}きますか。', 'Ii desu ne. Doko e ikimasu ka.', 'Hay đấy. Đi đâu ạ?'),
        C('{渋谷|しぶや}はどうですか。', 'Shibuya wa dō desu ka.', 'Shibuya thì sao?'),
        S('いいですね。そうしましょう。どこで{会|あ}いますか。', 'Ii desu ne. Sō shimashō. Doko de aimasu ka.', 'Hay đấy. Làm vậy đi. Gặp ở đâu ạ?'),
        C('{新宿駅|しんじゅくえき}はどうですか。', 'Shinjuku eki wa dō desu ka.', 'Ga Shinjuku thì sao?'),
        S('{新宿駅|しんじゅくえき}ですね。わかりました。{何時|なんじ}に{会|あ}いますか。', 'Shinjuku eki desu ne. Wakarimashita. Nanji ni aimasu ka.', 'Ga Shinjuku nhỉ. Em hiểu rồi. Mấy giờ gặp ạ?'),
        C('{4時|よじ}はどうですか。', 'Yoji wa dō desu ka.', '4 giờ thì sao?'),
        S('{4時|よじ}に{新宿駅|しんじゅくえき}ですね。わかりました。', 'Yoji ni Shinjuku eki desu ne. Wakarimashita.', '4 giờ ở ga Shinjuku nhỉ. Em hiểu rồi.'),
      ],
      [
        'Chốt hẹn luôn **nhắc lại cả giờ + chỗ + ね** (4時に新宿駅ですね) rồi **わかりました**. Cô chấm điểm đúng câu này.',
        'Giờ: 4時 **よじ** (không phải よんじ), 7時 **しちじ**, 9時 **くじ**. Hỏi chỗ gặp: **どこで会いますか** (で — nơi hành động).',
        'Nghe やってみよう: chú ý thứ／ngày (今日は10日月曜日 — "thứ Bảy này" là ngày nào?), giờ + **に**, nơi + **で**; không có đáp án ở đây.',
        'Luyện: **Luyện nghe · Bài 3 — Park làm gì, khi nào, ở đâu?** và **Luyện nói · Câu hỏi có tranh — poster sự kiện**.',
      ],
      [
        mau([
          E('Bさん、{週末|しゅうまつ}、{一緒|いっしょ}に{飲|の}みに{行|い}きませんか。— いいですね。どこへ{行|い}きますか。— {新宿|しんじゅく}の{居酒屋|いざかや}はどうですか。— いいですね。そうしましょう。', 'B-san, shūmatsu, issho ni nomi ni ikimasen ka. — Ii desu ne. Doko e ikimasu ka. — Shinjuku no izakaya wa dō desu ka. — Ii desu ne. Sō shimashō.', 'Số 3 例.'),
          E('{服|ふく}を{買|か}いに{行|い}きませんか。— どこへ{行|い}きますか。— {渋谷|しぶや}はどうですか。', 'Fuku o kai ni ikimasen ka. — Doko e ikimasu ka. — Shibuya wa dō desu ka.', 'Số 3 ① — Shibuya.'),
          E('うちで{日本|にほん}の{料理|りょうり}を{作|つく}りませんか。— {何|なに}を{作|つく}りますか。— すき{焼|や}きはどうですか。', 'Uchi de Nihon no ryōri o tsukurimasen ka. — Nani o tsukurimasu ka. — Sukiyaki wa dō desu ka.', 'Số 3 ② — sukiyaki (hỏi 何を, không phải どこへ).'),
          E('{食事|しょくじ}に{行|い}きませんか。— どこへ{行|い}きますか。— ベトナム{料理|りょうり}の{店|みせ}はどうですか。', 'Shokuji ni ikimasen ka. — Doko e ikimasu ka. — Betonamu ryōri no mise wa dō desu ka.', 'Số 3 ③ — tự chọn.'),
          E('{遊|あそ}びに{行|い}きませんか。— どこへ{行|い}きますか。— お{台場|だいば}はどうですか。', 'Asobi ni ikimasen ka. — Doko e ikimasu ka. — Odaiba wa dō desu ka.', 'Số 3 ④ — tự chọn.'),
          E('{何時|なんじ}に{会|あ}いますか。— {5時|ごじ}はどうですか。— {5時|ごじ}ですね。わかりました。', 'Nanji ni aimasu ka. — Goji wa dō desu ka. — Goji desu ne. Wakarimashita.', 'Số 4 例.'),
          E('{6時|ろくじ}はどうですか。— {6時|ろくじ}ですね。わかりました。', 'Rokuji wa dō desu ka. — Rokuji desu ne. Wakarimashita.', 'Số 4 ①.'),
          E('どこで{会|あ}いますか。— {新宿駅|しんじゅくえき}はどうですか。— {新宿駅|しんじゅくえき}ですね。わかりました。', 'Doko de aimasu ka. — Shinjuku eki wa dō desu ka. — Shinjuku eki desu ne. Wakarimashita.', 'Số 4 ② — chỗ gặp.'),
          E('どこで{会|あ}いますか。— みどり{公園|こうえん}はどうですか。— みどり{公園|こうえん}ですね。わかりました。', 'Doko de aimasu ka. — Midori kōen wa dō desu ka. — Midori kōen desu ne. Wakarimashita.', 'Số 4 ③.'),
          E('{4時|よじ}にふじ{映画館|えいがかん}はどうですか。— {4時|よじ}にふじ{映画館|えいがかん}ですね。わかりました。', 'Yoji ni Fuji eigakan wa dō desu ka. — Yoji ni Fuji eigakan desu ne. Wakarimashita.', 'Số 4 ④ — giờ + chỗ.'),
          E('{土曜日|どようび}に{花火大会|はなびたいかい}があります。{一緒|いっしょ}に{見|み}に{行|い}きませんか。— いいですね。{何時|なんじ}からですか。— {6時|ろくじ}からですよ。{5時半|ごじはん}に{駅|えき}で{会|あ}いましょう。— {5時半|ごじはん}に{駅|えき}ですね。わかりました。', 'Doyōbi ni hanabi taikai ga arimasu. Issho ni mi ni ikimasen ka. — Ii desu ne. Nanji kara desu ka. — Rokuji kara desu yo. Goji han ni eki de aimashō. — Goji han ni eki desu ne. Wakarimashita.', 'ペアで話しましょう — mẫu với poster pháo hoa.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 114 · できる! — Tìm một sự kiện rồi rủ bạn',
      'Nhiệm vụ tổng hợp: (1) tìm trên tạp chí／internet một sự kiện muốn đi — ghi ngày, địa điểm, giá vé; (2) rủ bạn; (3) bàn với bạn rồi hẹn cụ thể. Trên lớp: mỗi bạn mang một sự kiện thật (ở Hà Nội／TP.HCM cũng được), cô đi quanh lớp và đóng vai người được rủ — có khi nhận lời, có khi từ chối để xem bạn xử lý.',
      [
        S('{先生|せんせい}、{今度|こんど}の{日曜日|にちようび}、{時間|じかん}がありますか。', 'Sensei, kondo no nichiyōbi, jikan ga arimasu ka.', 'Cô ơi, Chủ nhật tới cô có rảnh không ạ?'),
        C('はい、ありますよ。', 'Hai, arimasu yo.', 'Có chứ.'),
        S('ハノイで{日本|にほん}のお{祭|まつ}りがあります。{一緒|いっしょ}に{行|い}きませんか。', 'Hanoi de Nihon no o-matsuri ga arimasu. Issho ni ikimasen ka.', 'Ở Hà Nội có lễ hội Nhật Bản. Cô đi cùng không ạ?'),
        C('いいですね。チケットはいくらですか。', 'Ii desu ne. Chiketto wa ikura desu ka.', 'Hay đấy. Vé bao nhiêu?'),
        S('{50,000|ごまん}ドンです。{安|やす}いですよ。', 'Goman don desu. Yasui desu yo.', '50.000 đồng ạ. Rẻ lắm ạ.'),
        C('じゃ、{行|い}きましょう。{何時|なんじ}に{会|あ}いますか。', 'Ja, ikimashō. Nanji ni aimasu ka.', 'Vậy đi thôi. Mấy giờ gặp?'),
        S('{10時|じゅうじ}はどうですか。{学校|がっこう}の{前|まえ}で{会|あ}いましょう。', 'Jūji wa dō desu ka. Gakkō no mae de aimashō.', '10 giờ được không ạ? Gặp trước cổng trường nhé.'),
        C('{10時|じゅうじ}に{学校|がっこう}の{前|まえ}ですね。わかりました。', 'Jūji ni gakkō no mae desu ne. Wakarimashita.', '10 giờ trước cổng trường nhỉ. Cô hiểu rồi.'),
      ],
      [
        'Mở lời lịch sự trước khi rủ: **～、時間がありますか** (có rảnh không?) — ポイント 50.',
        'Trọn một lượt: **rảnh không → có sự kiện (51) → rủ (48) → giá／giờ → hẹn (58) → xác nhận (59)**.',
        'Xem **Hội thoại · できる！— Tìm một sự kiện rồi rủ bạn** và **Luyện nói · Đóng vai — rủ, chọn, hẹn**.',
      ],
    ),

    ...trang(
      'Trang 114 · 話読聞書「一緒に！」 — Món Nhật tôi thích nhất',
      'Ô 話読聞書 có đoạn ngắn khoảng 8 câu: người viết hỏi mọi người thích món Nhật nào nhất, nói mình thích nhất một món bánh áp chảo (giới thiệu nó giống "pizza của Nhật"), bên trong có thịt, trứng, rau, nước sốt hơi ngọt, rất ngon — và kết bằng lời rủ lần tới cùng đi ăn. Từ mới: ソース (nước sốt), ピザ (pizza), 皆さん (mọi người). Bên cạnh có 3 câu gợi ý: hãy giới thiệu món nên thử, ở Tokyo quán nào ngon, là món thế nào. Nhiệm vụ: viết đoạn về món BẠN thích nhất (món Nhật hoặc món Việt) theo cùng khung — **hỏi → いちばん → món thế nào → có gì bên trong → vị → lời rủ** — rồi đọc to.',
      [
        C('{日本|にほん}の{食|た}べ{物|もの}で{何|なに}がいちばん{好|す}きですか。', 'Nihon no tabemono de nani ga ichiban suki desu ka.', 'Trong đồ ăn Nhật, em thích gì nhất?'),
        S('ラーメンがいちばん{好|す}きです。', 'Rāmen ga ichiban suki desu.', 'Em thích ramen nhất.'),
        C('{好|す}きな{食|た}べ{物|もの}の{話|はなし}を{読|よ}んでください。', 'Suki na tabemono no hanashi o yonde kudasai.', 'Em đọc bài về món em thích đi.'),
        S('{皆|みな}さんはベトナムの{食|た}べ{物|もの}で{何|なに}がいちばん{好|す}きですか。{私|わたし}はバインミーがいちばん{好|す}きです。バインミーはベトナムのサンドイッチです。バインミーの{中|なか}に{肉|にく}や{卵|たまご}や{野菜|やさい}があります。ソースは{少|すこ}し{辛|から}いです。とてもおいしいですよ。そして、{安|やす}いです。{今度|こんど}、{一緒|いっしょ}にバインミーを{食|た}べに{行|い}きませんか。', 'Minasan wa Betonamu no tabemono de nani ga ichiban suki desu ka. Watashi wa bainmī ga ichiban suki desu. Bainmī wa Betonamu no sandoicchi desu. Bainmī no naka ni niku ya tamago ya yasai ga arimasu. Sōsu wa sukoshi karai desu. Totemo oishii desu yo. Soshite, yasui desu. Kondo, issho ni bainmī o tabe ni ikimasen ka.', 'Mọi người thích món Việt nào nhất? Tôi thích bánh mì nhất. Bánh mì là sandwich của Việt Nam. Bên trong có thịt, trứng, rau… Nước sốt hơi cay. Rất ngon đấy. Và rẻ. Lần tới cùng đi ăn bánh mì không?'),
      ],
      [
        '**Nの中に N1やN2があります** = bên trong có N1, N2… (ポイント 28 + や liệt kê).',
        'Bài này dùng gần đủ ポイント của Bài 6: **いちばん (53) · よ (60) · ませんか (48)** — đọc trôi là ôn được cả bài.',
        'Xem **Hội thoại · ④ Nói–Đọc–Nghe–Viết** và **Luyện nói · Đọc to — Reading**.',
      ],
    ),

    { t: 'h', text: 'Trang 115 · ことば — Từ vựng của bài' },
    {
      t: 'p',
      text: 'Trang liệt kê từ mới theo 3 chủ đề: (1) 一緒に行きませんか — tuần này, tuần sau, tháng này, tháng sau, karaoke, hòa nhạc, trận đấu, giảm giá, vé, bản đồ, lái xe dạo, đồ bơi, bóng chày, hẹn, việc bận, ～枚, あります (có hẹn / có sự kiện / có vé), 残念, 一緒に, và các câu giao tiếp いいですね, ああ、～はちょっと……, すみません, また今度, わあ; (2) どちらがいいですか — đồ ăn, đồ uống, thịt nướng, ramen, ăn thả ga, set món, quán nhậu, rạp phim, tàu điện ngầm, ca sĩ, mùa, phim hài, jazz, tour, どちら, どちらも, gần, xa, sớm/nhanh, rộng, いちばん, 全部, そうですねえ; (3) 約束 — okonomiyaki, sukiyaki, đi chơi, ぜひ, まだ, もう, そうしましょう, わかりました. Không có tranh. Đủ nghĩa, romaji, ví dụ: xem mục **Từ vựng** của Bài 6.',
    },
    { t: 'note', title: 'Mẹo', items: ['Cô hay kiểm tra nhanh bộ câu giao tiếp: đọc tiếng Việt "hay đấy / tiếc quá / hẹn lần khác / để xem nào / hiểu rồi" → bạn nói いいですね／残念です／また今度／そうですねえ／わかりました — ôn ở **Từ vựng · G. Câu giao tiếp**.', 'Xem **Từ vựng · Bài 6** và **Chữ Hán · Bài 6**.'] },

    ...trang(
      'Trang 116 · もう一度聞こう — Nghe lại cả bài',
      'Nghe lại đoạn ở trang 101: アンナ hỏi パク thứ Bảy tới có rảnh không, rồi rủ đi nghe **hòa nhạc jazz ở 上野**; パク rất muốn đi. Buổi hòa nhạc từ 2 giờ đến 4 giờ chiều. パク rủ thêm hôm đó cùng ăn tối; アンナ hỏi パク thích món Nhật nào nhất — **okonomiyaki**; ở 上野 có quán okonomiyaki ngon nên hai người sẽ đến đó. Hẹn **1 giờ ở ga 上野**; パク hỏi đi JR hay tàu điện ngầm thì hơn — アンナ nói JR hơn. Cụm mới: (お)店 (quán), 楽しみです (mong chờ quá), よかった (may quá / tốt quá). Cô sẽ hỏi lại các chi tiết.',
      [
        C('アンナさんはパクさんを{何|なに}に{誘|さそ}いましたか。', 'Anna-san wa Paku-san o nani ni sasoimashita ka.', 'Anna rủ Park đi đâu?'),
        S('ジャズのコンサートです。{上野|うえの}であります。', 'Jazu no konsāto desu. Ueno de arimasu.', 'Buổi hòa nhạc jazz. Tổ chức ở Ueno.'),
        C('コンサートは{何時|なんじ}から{何時|なんじ}までですか。', 'Konsāto wa nanji kara nanji made desu ka.', 'Buổi hòa nhạc từ mấy giờ đến mấy giờ?'),
        S('{午後|ごご}{2時|にじ}から{4時|よじ}までです。', 'Gogo niji kara yoji made desu.', 'Từ 2 giờ đến 4 giờ chiều.'),
        C('パクさんは{日本|にほん}の{食|た}べ{物|もの}で{何|なに}がいちばん{好|す}きですか。', 'Paku-san wa Nihon no tabemono de nani ga ichiban suki desu ka.', 'Park thích món Nhật nào nhất?'),
        S('お{好|この}み{焼|や}きがいちばん{好|す}きです。', 'Okonomiyaki ga ichiban suki desu.', 'Thích okonomiyaki nhất.'),
        C('2{人|ふたり}は{何時|なんじ}にどこで{会|あ}いますか。', 'Futari wa nanji ni doko de aimasu ka.', 'Hai người gặp nhau lúc mấy giờ, ở đâu?'),
        S('{1時|いちじ}に{上野駅|うえのえき}で{会|あ}います。', 'Ichiji ni Ueno eki de aimasu.', 'Gặp lúc 1 giờ ở ga Ueno.'),
        C('JRと{地下鉄|ちかてつ}とどちらがいいですか。', 'Jē-āru to chikatetsu to dochira ga ii desu ka.', 'JR và tàu điện ngầm, cái nào tốt hơn?'),
        S('JRのほうがいいです。', 'Jē-āru no hō ga ii desu.', 'JR tốt hơn.'),
      ],
      [
        '**時間がありますか** (có thời gian không = có rảnh không) → **はい** / **すみません、ちょっと……**.',
        '**楽しみです** = mong chờ quá — câu kết sau khi hẹn xong; đáp **そうですね**.',
        'Xem **Luyện nghe · Bài 4 — Hội thoại dài: lễ hội pháo hoa** và **Luyện nói · Câu hỏi không tranh ③**.',
      ],
    ),

    { t: 'h', text: 'Cô hỏi — bạn trả lời: ghép nhanh câu trả lời' },
    {
      t: 'build',
      id: 'b6-sach-ghep',
      title: 'Nghe câu hỏi (tiếng Việt) → ghép câu trả lời tiếng Nhật',
      items: [
        { vi: 'Cô rủ 一緒に映画を見ませんか → "Hay đấy. Xem thôi."', chips: ['いいですね。', '{見|み}ましょう。', '{見|み}ません。', 'いいえ、'], answer: ['いいですね。', '{見|み}ましょう。'], ro: 'Ii desu ne. Mimashō.' },
        { vi: 'Cô rủ 土曜日、カラオケに行きませんか → từ chối: "Xin lỗi. Thứ Bảy thì hơi… Vì em có việc."', chips: ['すみません。', '{土曜日|どようび}は', 'ちょっと……。', '{用事|ようじ}が', 'ありますから。', 'いいえ、'], answer: ['すみません。', '{土曜日|どようび}は', 'ちょっと……。', '{用事|ようじ}が', 'ありますから。'], ro: 'Sumimasen. Doyōbi wa chotto…. Yōji ga arimasu kara.' },
        { vi: 'Cô hỏi 季節でいつがいちばん好きですか → "Em thích mùa thu nhất."', chips: ['{秋|あき}が', 'いちばん', '{好|す}きです。', '{秋|あき}は', 'のほうが'], answer: ['{秋|あき}が', 'いちばん', '{好|す}きです。'], ro: 'Aki ga ichiban suki desu.' },
        { vi: 'Cô hỏi 夏と冬とどちらが好きですか → "Em thích mùa đông hơn."', chips: ['{冬|ふゆ}の', 'ほうが', '{好|す}きです。', 'いちばん', 'より'], answer: ['{冬|ふゆ}の', 'ほうが', '{好|す}きです。'], ro: 'Fuyu no hō ga suki desu.' },
        { vi: 'Nói lý do: "Vì tàu điện nhanh hơn xe buýt."', chips: ['{電車|でんしゃ}は', 'バスより', '{早|はや}いですから。', 'バスの', 'ほうが'], answer: ['{電車|でんしゃ}は', 'バスより', '{早|はや}いですから。'], ro: 'Densha wa basu yori hayai desu kara.' },
        { vi: 'Cô hỏi もう宿題をしましたか → "Chưa ạ."', chips: ['いいえ、', 'まだです。', 'しませんでした。', 'もう'], answer: ['いいえ、', 'まだです。'], ro: 'Iie, mada desu.' },
        { vi: 'Cô hỏi 何を食べますか → đề xuất: "Sushi thì sao ạ?"', chips: ['おすしは', 'どうですか。', 'いかがですか。', 'おすしが'], answer: ['おすしは', 'どうですか。'], ro: 'O-sushi wa dō desu ka.' },
        { vi: 'Cô nói 6時に駅で会いましょう → "6 giờ ở ga nhỉ. Em hiểu rồi."', chips: ['{6時|ろくじ}に', '{駅|えき}ですね。', 'わかりました。', '{駅|えき}ですよ。', '{駅|えき}へ'], answer: ['{6時|ろくじ}に', '{駅|えき}ですね。', 'わかりました。'], ro: 'Rokuji ni eki desu ne. Wakarimashita.' },
      ],
    },
  ],
};

export const SACH_2: Record<number, Lesson> = { 4: SACH_4, 5: SACH_5, 6: SACH_6 };
