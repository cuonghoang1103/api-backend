/**
 * Bài 13 — 私のおすすめ (Thứ tôi giới thiệu) · できる日本語 初級 第13課, p.221–236 · JPD113/JPD123.
 *
 * Ngữ pháp: ポイント 108–112 (p.279–280): Vた形ことがあります · 普通形＋N (bổ nghĩa cho danh từ) ·
 * Vテ形います (đang mặc / đội / đeo — trạng thái) · 知っています／知りません · N1というN2
 * + ôn thể た (表 p.283) và bảng 丁寧形 ↔ 普通形 (表 p.284) vì ポイント 108, 109 dựa trên chúng.
 * Từ vựng: đủ 40 mục của trang ことば p.235 (8 + 25 + 7) — từ Bài 8 trở đi cô không phát
 * danh sách riêng nên trang ことば của sách là chuẩn. Từ ở chân bài đọc / bài nghe
 * (駅弁, 切符, 特急電車, 手袋, 毛糸…) nằm ở mục "Từ thêm".
 * Hội thoại, câu ví dụ, bài đọc, kịch bản nghe: VIẾT MỚI theo đúng tình huống của sách
 * (xem ../SOAN-BAI.md). Chỉ dùng lại tên nhân vật; tên quán, khách sạn, ca sĩ là tự đặt.
 *
 * Nhân vật (giới tính quyết định giọng đọc, theo bai1.ts): nữ = パク, アンナ, ワン, 木村, 山口 ·
 * nam = ダニエル, マルコ, 西川. Hội thoại: role 'a'/'c' = giọng nữ, 'b'/'examiner' = giọng nam.
 * Nghe: voice 'ja-nu' = nữ, 'ja-nam' = nam.
 */
import type { Block, Lesson } from '@/components/sach-hoc/types';

/**
 * Đáp án gõ tay: viết một lần bằng {漢字|かな}, hàm sinh đủ cách viết chữ Hán / kana
 * (máy chấm đã tự bỏ dấu câu, dấu cách và đổi chữ số toàn khổ). Phần tử đầu = dạng
 * toàn chữ Hán, là đáp án hiển thị.
 */
const V = (...xs: string[]): string[] => {
  const out = new Set<string>();
  for (const x of xs) {
    const slots = x
      .split(/(\{[^|}]+\|[^}]+\})/)
      .filter(Boolean)
      .map((p) => {
        const m = /^\{([^|}]+)\|([^}]+)\}$/.exec(p);
        return m ? [m[1], m[2]] : [p];
      });
    const n = slots.filter((s) => s.length > 1).length;
    if (n <= 8) {
      let acc = [''];
      for (const s of slots) acc = acc.flatMap((a) => s.map((c) => a + c));
      acc.forEach((a) => out.add(a));
    } else {
      out.add(slots.map((s) => s[0]).join(''));
      out.add(slots.map((s) => s[s.length - 1]).join(''));
      slots.forEach((s, i) => {
        if (s.length > 1) out.add(slots.map((t, j) => (j === i ? t[1] : t[0])).join(''));
      });
    }
  }
  return [...out];
};

/* ═══════════════════════════ 1. HỘI THOẠI ═══════════════════════════ */

const HOI_THOAI: Lesson = {
  id: 'b13-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — 私のおすすめ Kinh nghiệm, giới thiệu, hỏi thông tin',
  goal: 'Hỏi bạn đã từng làm gì để lấy thông tin mình cần và kể kinh nghiệm của mình, giới thiệu một nơi / món đồ / người nổi tiếng mình thích (cả tả người đang mặc gì), và đặt câu hỏi để tìm được chỗ phù hợp.',
  minutes: 40,
  blocks: [
    {
      t: 'note',
      title: 'Học xong bài 13 bạn làm được (できる)',
      items: [
        '**① {経験|けいけん}から** — hỏi bạn **đã từng** đi / xem / ăn … chưa (～たことがありますか) để lấy thông tin mình cần (vé mua ở đâu, bao nhiêu tiền, chỗ nào ngon), và **kể kinh nghiệm** của mình cho bạn.',
        '**② おすすめします** — **giới thiệu** một cửa hàng, một nơi chơi, một người nổi tiếng: "～という店を知っていますか", "～は…ことができる店ですよ", và chỉ người trên TV: "**{赤|あか}い{帽子|ぼうし}をかぶっている人**です".',
        '**③ {教|おし}えてください** — **đặt câu hỏi** để lấy được thông tin mình cần: "どこかいい店を知っていますか", "どこにありますか", "どんな店ですか".',
        '**できる！** — cả nhóm làm **bảng khảo sát** (アンケート) về "thứ bạn giới thiệu", hỏi nhiều người, tổng hợp rồi trình bày trước lớp.',
      ],
    },
    {
      t: 'table',
      caption: 'Bức tranh chung của bài — hỏi kinh nghiệm, giới thiệu, hỏi thông tin',
      head: ['Lúc', 'Câu then chốt', 'Romaji', 'ポイント'],
      rows: [
        ['Hỏi kinh nghiệm', '{相撲|すもう}を{見|み}たことがありますか。——はい、{2回|にかい}あります。', 'Sumou o mita koto ga arimasu ka. — Hai, nikai arimasu.', '108'],
        ['Chưa từng lần nào', '{1回|いっかい}も{行|い}ったことがありません。', 'Ikkai mo itta koto ga arimasen.', '108'],
        ['Hỏi có biết không', 'おいしい{店|みせ}を{知|し}っていますか。——いいえ、{知|し}りません。', 'Oishii mise o shitte imasu ka. — Iie, shirimasen.', '111'],
        ['Giới thiệu tên lạ', '「はなまる」という{店|みせ}がいいですよ。', '"Hanamaru" to iu mise ga ii desu yo.', '112'],
        ['Giải thích đó là gì', '{新鮮|しんせん}な{魚|さかな}を{食|た}べることができる{店|みせ}です。', 'Shinsen na sakana o taberu koto ga dekiru mise desu.', '109'],
        ['Chỉ người', 'あの{白|しろ}いシャツを{着|き}ている{人|ひと}です。', 'Ano shiroi shatsu o kite iru hito desu.', '109, 110'],
        ['Tìm thông tin', 'みんなで{飲|の}み{会|かい}をする{店|みせ}を{探|さが}しています。', 'Minna de nomikai o suru mise o sagashite imasu.', '109'],
      ],
    },

    /* ── ① 経験から ── */
    { t: 'h', text: '① {経験|けいけん}から — Hỏi kinh nghiệm của bạn' },
    {
      t: 'p',
      text: 'Tình huống: ở một **buổi giao lưu** ({交流会|こうりゅうかい}), bạn nói chuyện với người Nhật mới quen. Tháng sau **bố mẹ** bạn sang chơi, bạn muốn đưa bố mẹ đi xem **{相撲|すもう}**. Bạn hỏi người kia **đã từng** xem chưa, **vé mua ở đâu**, **xem xong đi đâu**, **gần đó có quán nào ngon** — tức là lấy thông tin từ kinh nghiệm của người khác.',
    },
    {
      t: 'dialogue',
      title: 'Ở buổi giao lưu — bố mẹ sắp sang',
      lines: [
        { who: 'ワン', role: 'a', text: '{山口|やまぐち}さん、{来月|らいげつ}、{国|くに}から{両親|りょうしん}が{来|き}ます。', ro: 'Yamaguchi-san, raigetsu, kuni kara ryoushin ga kimasu.', vi: 'Chị Yamaguchi, tháng sau bố mẹ em từ quê sang.' },
        { who: '{山口|やまぐち}', role: 'c', text: 'そうですか。いいですね。どこへ{行|い}きますか。', ro: 'Sou desu ka. Ii desu ne. Doko e ikimasu ka.', vi: 'Vậy à. Hay quá. Em định đi đâu?' },
        { who: 'ワン', role: 'a', text: '{両親|りょうしん}と{相撲|すもう}を{見|み}たいです。{山口|やまぐち}さんは{相撲|すもう}を{見|み}たことがありますか。', ro: 'Ryoushin to sumou o mitai desu. Yamaguchi-san wa sumou o mita koto ga arimasu ka.', vi: 'Em muốn đi xem sumo với bố mẹ. Chị đã từng xem sumo chưa?' },
        { who: '{山口|やまぐち}', role: 'c', text: 'ええ、あります。{何回|なんかい}も{見|み}ましたよ。とてもおもしろいです。', ro: 'Ee, arimasu. Nankai mo mimashita yo. Totemo omoshiroi desu.', vi: 'Có chứ. Chị xem nhiều lần rồi. Hay lắm.' },
        { who: 'ワン', role: 'a', text: 'そうですか。チケットはどこで{買|か}いましたか。', ro: 'Sou desu ka. Chiketto wa doko de kaimashita ka.', vi: 'Vậy ạ. Chị mua vé ở đâu?' },
        { who: '{山口|やまぐち}', role: 'c', text: 'インターネットで{買|か}いました。{簡単|かんたん}ですよ。', ro: 'Intaanetto de kaimashita. Kantan desu yo.', vi: 'Chị mua trên mạng. Dễ lắm.' },
        { who: 'ワン', role: 'a', text: 'いくらでしたか。', ro: 'Ikura deshita ka.', vi: 'Bao nhiêu tiền ạ?' },
        { who: '{山口|やまぐち}', role: 'c', text: '{1枚|いちまい}{8,000円|はっせんえん}くらいでした。', ro: 'Ichimai hassen en kurai deshita.', vi: 'Khoảng 8.000 yên một vé.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Xem xong đi đâu? — hỏi quán ngon',
      lines: [
        { who: 'ワン', role: 'a', text: '{相撲|すもう}のあとで、{浅草|あさくさ}へ{行|い}きたいです。{浅草|あさくさ}においしいレストランがありますか。', ro: 'Sumou no ato de, Asakusa e ikitai desu. Asakusa ni oishii resutoran ga arimasu ka.', vi: 'Xem sumo xong em muốn đi Asakusa. Ở Asakusa có nhà hàng nào ngon không ạ?' },
        { who: '{山口|やまぐち}', role: 'c', text: 'ええ。「あさひ」という{天|てん}ぷらの{店|みせ}がいいですよ。', ro: 'Ee. "Asahi" to iu tenpura no mise ga ii desu yo.', vi: 'Có. Quán tempura tên là "Asahi" ngon lắm.' },
        { who: 'ワン', role: 'a', text: 'あさひ？', ro: 'Asahi?', vi: 'Asahi ạ?' },
        { who: '{山口|やまぐち}', role: 'c', text: 'はい。{古|ふる}くて、{有名|ゆうめい}な{店|みせ}です。{私|わたし}は{先月|せんげつ}、{家族|かぞく}と{行|い}きました。', ro: 'Hai. Furukute, yuumei na mise desu. Watashi wa sengetsu, kazoku to ikimashita.', vi: 'Ừ. Là quán lâu đời và nổi tiếng. Tháng trước chị đi với gia đình.' },
        { who: 'ワン', role: 'a', text: '{高|たか}いですか。', ro: 'Takai desu ka.', vi: 'Có đắt không ạ?' },
        { who: '{山口|やまぐち}', role: 'c', text: 'いいえ、{安|やす}いですよ。{1人|ひとり}{2,000円|にせんえん}くらいです。', ro: 'Iie, yasui desu yo. Hitori nisen en kurai desu.', vi: 'Không, rẻ lắm. Khoảng 2.000 yên một người.' },
        { who: 'ワン', role: 'a', text: 'そうですか。ありがとうございます。{両親|りょうしん}と{行|い}きます。', ro: 'Sou desu ka. Arigatou gozaimasu. Ryoushin to ikimasu.', vi: 'Vậy ạ. Cảm ơn chị. Em sẽ đi với bố mẹ.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Kể kinh nghiệm của mình — từng / chưa từng',
      lines: [
        { who: 'ダニエル', role: 'b', text: 'パクさんは{富士山|ふじさん}に{登|のぼ}ったことがありますか。', ro: 'Paku-san wa Fujisan ni nobotta koto ga arimasu ka.', vi: 'Park đã từng leo núi Phú Sĩ chưa?' },
        { who: 'パク', role: 'a', text: 'いいえ、{1回|いっかい}もありません。ダニエルさんは？', ro: 'Iie, ikkai mo arimasen. Danieru-san wa?', vi: 'Chưa, chưa lần nào. Còn Daniel?' },
        { who: 'ダニエル', role: 'b', text: '{私|わたし}は{去年|きょねん}の{夏|なつ}、{登|のぼ}りました。{上|うえ}から{見|み}た{景色|けしき}がとてもきれいでしたよ。', ro: 'Watashi wa kyonen no natsu, noborimashita. Ue kara mita keshiki ga totemo kirei deshita yo.', vi: 'Tôi leo hè năm ngoái. Cảnh nhìn từ trên đỉnh đẹp lắm.' },
        { who: 'パク', role: 'a', text: 'いいですね。{私|わたし}は{北海道|ほっかいどう}へ{行|い}ったことがあります。{冬|ふゆ}にスキーをしました。', ro: 'Ii desu ne. Watashi wa Hokkaidou e itta koto ga arimasu. Fuyu ni sukii o shimashita.', vi: 'Hay nhỉ. Tôi thì đã từng đến Hokkaido. Mùa đông tôi trượt tuyết.' },
        { who: 'ダニエル', role: 'b', text: '{北海道|ほっかいどう}はどうでしたか。', ro: 'Hokkaidou wa dou deshita ka.', vi: 'Hokkaido thế nào?' },
        { who: 'パク', role: 'a', text: 'とても{寒|さむ}かったです。でも、{魚|さかな}が{新鮮|しんせん}で、おいしかったです。', ro: 'Totemo samukatta desu. Demo, sakana ga shinsen de, oishikatta desu.', vi: 'Lạnh lắm. Nhưng cá tươi và ngon.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{相撲|すもう}を{見|み}たことがありますか。——はい、あります。', ro: 'Sumou o mita koto ga arimasu ka. — Hai, arimasu.', vi: 'Bạn đã từng xem sumo chưa? — Rồi, tôi từng xem. — ポイント 108' },
        { en: '{1回|いっかい}も{沖縄|おきなわ}へ{行|い}ったことがありません。', ro: 'Ikkai mo Okinawa e itta koto ga arimasen.', vi: 'Tôi chưa từng đi Okinawa lần nào. — ポイント 108' },
        { en: '{何回|なんかい}も{食|た}べたことがあります。', ro: 'Nankai mo tabeta koto ga arimasu.', vi: 'Tôi đã ăn nhiều lần rồi.' },
        { en: '{飛行機|ひこうき}のチケットはいくらでしたか。——{5万円|ごまんえん}くらいでした。', ro: 'Hikouki no chiketto wa ikura deshita ka. — Gomanen kurai deshita.', vi: 'Vé máy bay bao nhiêu tiền? — Khoảng 50.000 yên. (hỏi tiếp chi tiết bằng quá khứ)' },
        { en: 'おいしいレストランを{知|し}っていますか。——ええ、「{北山|きたやま}」というレストランがいいですよ。', ro: 'Oishii resutoran o shitte imasu ka. — Ee, "Kitayama" to iu resutoran ga ii desu yo.', vi: 'Bạn biết nhà hàng nào ngon không? — Có, nhà hàng tên "Kitayama" ngon đấy. — ポイント 111, 112' },
        { en: 'あさひ？', ro: 'Asahi?', vi: 'Asahi ạ? (nhắc lại cái tên lạ, lên giọng — để người kia giải thích thêm)' },
      ],
    },

    /* ── ② おすすめします ── */
    { t: 'h', text: '② おすすめします — Giới thiệu thứ mình thích' },
    {
      t: 'p',
      text: 'Tình huống: ở **ký túc xá**, vừa xem tạp chí, vừa xem TV vừa nói chuyện. Bạn **giới thiệu** một cửa hàng đang **được giới trẻ yêu thích** ({若|わか}い{人|ひと}に{人気|にんき}がある), rủ bạn cùng đi. Trên TV có nhóm nhạc, bạn chỉ **người mình thích** bằng cách tả người đó **đang mặc / đội / đeo** gì.',
    },
    {
      t: 'dialogue',
      title: 'Xem tạp chí — cửa hàng đang được yêu thích',
      lines: [
        { who: 'アンナ', role: 'c', text: 'パクさん、「ひまわり」というデパートを{知|し}っていますか。', ro: 'Paku-san, "Himawari" to iu depaato o shitte imasu ka.', vi: 'Park, cậu có biết cửa hàng bách hoá tên "Himawari" không?' },
        { who: 'パク', role: 'a', text: 'ひまわり？いいえ、{知|し}りません。', ro: 'Himawari? Iie, shirimasen.', vi: 'Himawari á? Không, mình không biết.' },
        { who: 'アンナ', role: 'c', text: '{若|わか}い{人|ひと}に{人気|にんき}があるデパートですよ。ほら、この{雑誌|ざっし}を{見|み}てください。', ro: 'Wakai hito ni ninki ga aru depaato desu yo. Hora, kono zasshi o mite kudasai.', vi: 'Là cửa hàng bách hoá được giới trẻ thích lắm đấy. Nhìn này, xem tạp chí này đi.' },
        { who: 'パク', role: 'a', text: 'へえ。{何|なに}を{売|う}っていますか。', ro: 'Hee. Nani o utte imasu ka.', vi: 'Ồ. Ở đó bán gì?' },
        { who: 'アンナ', role: 'c', text: 'かわいい{服|ふく}や{帽子|ぼうし}やサングラスなどを{売|う}っています。{安|やす}くて、デザインがいいですよ。', ro: 'Kawaii fuku ya boushi ya sangurasu nado o utte imasu. Yasukute, dezain ga ii desu yo.', vi: 'Bán quần áo, mũ, kính râm dễ thương… Vừa rẻ vừa đẹp mẫu.' },
        { who: 'パク', role: 'a', text: 'いいですね。{今度|こんど}、{一緒|いっしょ}に{行|い}きませんか。', ro: 'Ii desu ne. Kondo, issho ni ikimasen ka.', vi: 'Hay đấy. Lần tới đi cùng nhau không?' },
        { who: 'アンナ', role: 'c', text: 'ええ、ぜひ。', ro: 'Ee, zehi.', vi: 'Ừ, nhất định rồi.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Xem TV — người đó là ai?',
      lines: [
        { who: 'アンナ', role: 'c', text: 'あっ、「スターズ」だ！', ro: 'A, "Sutaazu" da!', vi: 'A, nhóm "Stars" kìa!' },
        { who: 'ダニエル', role: 'b', text: 'すたーず？{誰|だれ}ですか。', ro: 'Sutaazu? Dare desu ka.', vi: 'Stars? Là ai vậy?' },
        { who: 'アンナ', role: 'c', text: '{今|いま}、とても{人気|にんき}がある{歌手|かしゅ}のグループです。{私|わたし}は{山田|やまだ}ケンが{大好|だいす}きです。', ro: 'Ima, totemo ninki ga aru kashu no guruupu desu. Watashi wa Yamada Ken ga daisuki desu.', vi: 'Là nhóm ca sĩ đang rất nổi bây giờ. Mình mê Yamada Ken lắm.' },
        { who: 'ダニエル', role: 'b', text: '{山田|やまだ}ケン？どの{人|ひと}ですか。', ro: 'Yamada Ken? Dono hito desu ka.', vi: 'Yamada Ken? Người nào?' },
        { who: 'アンナ', role: 'c', text: 'あの{人|ひと}です。{赤|あか}い{帽子|ぼうし}をかぶっている{人|ひと}です。', ro: 'Ano hito desu. Akai boushi o kabutte iru hito desu.', vi: 'Người kia kìa. Người đang đội mũ đỏ.' },
        { who: 'ダニエル', role: 'b', text: 'ああ、サングラスをかけている{人|ひと}ですね。かっこいいですね。', ro: 'Aa, sangurasu o kakete iru hito desu ne. Kakkoii desu ne.', vi: 'À, người đang đeo kính râm nhỉ. Ngầu nhỉ.' },
        { who: 'アンナ', role: 'c', text: 'はい。{歌|うた}も{上手|じょうず}ですよ。', ro: 'Hai. Uta mo jouzu desu yo.', vi: 'Ừ. Hát cũng hay nữa.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Giới thiệu nơi chơi — "đó là nơi có thể …"',
      lines: [
        { who: 'マルコ', role: 'b', text: 'ワンさん、「ふじまるランド」を{知|し}っていますか。', ro: 'Wan-san, "Fujimaru Rando" o shitte imasu ka.', vi: 'Wang, cậu biết "Fujimaru Land" không?' },
        { who: 'ワン', role: 'a', text: 'ふじまるランド？', ro: 'Fujimaru Rando?', vi: 'Fujimaru Land á?' },
        { who: 'マルコ', role: 'b', text: '{日本一|にほんいち}{長|なが}いジェットコースターに{乗|の}ることができる{遊園地|ゆうえんち}ですよ。', ro: 'Nihonichi nagai jetto koosutaa ni noru koto ga dekiru yuuenchi desu yo.', vi: 'Là công viên giải trí có thể đi tàu lượn siêu tốc dài nhất Nhật Bản đấy.' },
        { who: 'ワン', role: 'a', text: 'へえ。おもしろいですね。', ro: 'Hee. Omoshiroi desu ne.', vi: 'Ồ. Hay nhỉ.' },
        { who: 'マルコ', role: 'b', text: 'はい。{夜|よる}は{観覧車|かんらんしゃ}から{見|み}える{景色|けしき}もきれいですよ。デートにもいいですよ。', ro: 'Hai. Yoru wa kanransha kara mieru keshiki mo kirei desu yo. Deeto ni mo ii desu yo.', vi: 'Ừ. Buổi tối cảnh nhìn từ đu quay cũng đẹp. Đi hẹn hò cũng hợp lắm.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '「ひまわり」というデパートを{知|し}っていますか。——いいえ、{知|し}りません。', ro: '"Himawari" to iu depaato o shitte imasu ka. — Iie, shirimasen.', vi: 'Bạn có biết cửa hàng bách hoá tên "Himawari" không? — Không, tôi không biết. — ポイント 111, 112' },
        { en: '{若|わか}い{人|ひと}に{人気|にんき}がある{店|みせ}です。', ro: 'Wakai hito ni ninki ga aru mise desu.', vi: 'Là cửa hàng được giới trẻ yêu thích. — ポイント 109' },
        { en: '{電気製品|でんきせいひん}が{安|やす}い{店|みせ}です。', ro: 'Denki seihin ga yasui mise desu.', vi: 'Là cửa hàng bán đồ điện rẻ. — ポイント 109 (イA + N)' },
        { en: 'どの{人|ひと}ですか。——{白|しろ}いシャツを{着|き}ている{人|ひと}です。', ro: 'Dono hito desu ka. — Shiroi shatsu o kite iru hito desu.', vi: 'Người nào? — Người đang mặc áo sơ mi trắng. — ポイント 110' },
        { en: '{眼鏡|めがね}をかけている{人|ひと}です。／ネクタイをしている{人|ひと}です。', ro: 'Megane o kakete iru hito desu. / Nekutai o shite iru hito desu.', vi: 'Người đang đeo kính. / Người đang đeo cà vạt.' },
        { en: 'へえ。／ほら、……。', ro: 'Hee. / Hora, …….', vi: 'Ồ (ngạc nhiên, thấy hay). / Nhìn này, … (chỉ cho người kia xem).' },
      ],
    },

    /* ── ③ 教えてください ── */
    { t: 'h', text: '③ {教|おし}えてください — Hỏi để lấy thông tin' },
    {
      t: 'p',
      text: 'Tình huống: tháng sau cả lớp tổ chức **tiệc nướng** (バーベキュー). Bạn là người lo việc nên phải **tìm công viên** được phép nướng thịt, **tìm chỗ mua thịt rẻ**. Bạn hỏi bạn bè: "**どこか**いい{公園|こうえん}を{知|し}っていますか" → "**どこにありますか**" → "**どんな**{店|みせ}ですか" → "**いくらですか**".',
    },
    {
      t: 'dialogue',
      title: 'Tìm công viên nướng thịt được',
      lines: [
        { who: 'パク', role: 'a', text: 'マルコさん、{何|なに}をしていますか。', ro: 'Maruko-san, nani o shite imasu ka.', vi: 'Marco, cậu đang làm gì đấy?' },
        { who: 'マルコ', role: 'b', text: 'バーベキューができる{公園|こうえん}を{探|さが}しています。{来月|らいげつ}、クラスのみんなでバーベキューをしますから。', ro: 'Baabekyuu ga dekiru kouen o sagashite imasu. Raigetsu, kurasu no minna de baabekyuu o shimasu kara.', vi: 'Mình đang tìm công viên có thể nướng thịt. Vì tháng sau cả lớp cùng nhau làm tiệc nướng.' },
        { who: 'パク', role: 'a', text: 'そうですか。インターネットで{探|さが}していますか。', ro: 'Sou desu ka. Intaanetto de sagashite imasu ka.', vi: 'Vậy à. Cậu tìm trên mạng à?' },
        { who: 'マルコ', role: 'b', text: 'はい。でも、たくさんありますから、わかりません。パクさん、どこかいい{公園|こうえん}を{知|し}っていますか。', ro: 'Hai. Demo, takusan arimasu kara, wakarimasen. Paku-san, dokoka ii kouen o shitte imasu ka.', vi: 'Ừ. Nhưng nhiều quá nên mình không biết chọn. Park có biết công viên nào tốt không?' },
        { who: 'パク', role: 'a', text: 'そうですねえ。「ひかり{公園|こうえん}」はどうですか。{広|ひろ}くて、きれいですよ。', ro: 'Sou desu nee. "Hikari kouen" wa dou desu ka. Hirokute, kirei desu yo.', vi: 'Để xem nào. "Công viên Hikari" thì sao? Rộng và sạch đẹp lắm.' },
        { who: 'マルコ', role: 'b', text: 'へえ、そうですか。どこにありますか。', ro: 'Hee, sou desu ka. Doko ni arimasu ka.', vi: 'Ồ, vậy à. Nó ở đâu?' },
        { who: 'パク', role: 'a', text: 'さくら{駅|えき}の{近|ちか}くにあります。{駅|えき}から{歩|ある}いて{5分|ごふん}ですよ。', ro: 'Sakura eki no chikaku ni arimasu. Eki kara aruite gofun desu yo.', vi: 'Gần ga Sakura. Từ ga đi bộ 5 phút thôi.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Mua thịt ở đâu rẻ?',
      lines: [
        { who: 'マルコ', role: 'b', text: 'それから、{肉|にく}を{安|やす}く{買|か}うことができる{店|みせ}を{知|し}っていますか。', ro: 'Sorekara, niku o yasuku kau koto ga dekiru mise o shitte imasu ka.', vi: 'Còn nữa, cậu có biết cửa hàng nào mua thịt được rẻ không?' },
        { who: 'パク', role: 'a', text: 'ええ。「まるやま」という{肉屋|にくや}がいいですよ。{私|わたし}はいつもそこで{買|か}います。', ro: 'Ee. "Maruyama" to iu nikuya ga ii desu yo. Watashi wa itsumo soko de kaimasu.', vi: 'Có. Hàng thịt tên "Maruyama" được lắm. Mình luôn mua ở đó.' },
        { who: 'マルコ', role: 'b', text: 'まるやま？どこにありますか。', ro: 'Maruyama? Doko ni arimasu ka.', vi: 'Maruyama? Ở đâu vậy?' },
        { who: 'パク', role: 'a', text: '{新宿|しんじゅく}にあります。{肉|にく}は{100|ひゃく}グラム{150円|ひゃくごじゅうえん}くらいです。{野菜|やさい}も{売|う}っていますよ。', ro: 'Shinjuku ni arimasu. Niku wa hyaku guramu hyakugojuu en kurai desu. Yasai mo utte imasu yo.', vi: 'Ở Shinjuku. Thịt khoảng 150 yên 100 gam. Có bán cả rau nữa.' },
        { who: 'マルコ', role: 'b', text: '{安|やす}いですね。{材料|ざいりょう}はそこでみんな{買|か}います。ありがとうございました。', ro: 'Yasui desu ne. Zairyou wa soko de minna kaimasu. Arigatou gozaimashita.', vi: 'Rẻ nhỉ. Nguyên liệu mình sẽ mua hết ở đó. Cảm ơn cậu nhé.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'みんなで{飲|の}み{会|かい}をする{店|みせ}を{探|さが}しています。', ro: 'Minna de nomikai o suru mise o sagashite imasu.', vi: 'Tôi đang tìm quán để cả nhóm cùng nhậu. — ポイント 109' },
        { en: 'どこかいい{店|みせ}を{知|し}っていますか。', ro: 'Dokoka ii mise o shitte imasu ka.', vi: 'Bạn có biết quán nào (ở đâu đó) được không? — どこか + ポイント 111' },
        { en: '「わいわい」はどうですか。{料理|りょうり}がおいしいですよ。', ro: '"Waiwai" wa dou desu ka. Ryouri ga oishii desu yo.', vi: 'Quán "Waiwai" thì sao? Đồ ăn ngon đấy. (giới thiệu bằng ～はどうですか)' },
        { en: 'へえ、そうですか。どこにありますか。——{新宿|しんじゅく}にありますよ。', ro: 'Hee, sou desu ka. Doko ni arimasu ka. — Shinjuku ni arimasu yo.', vi: 'Ồ, vậy à. Ở đâu? — Ở Shinjuku đấy.' },
        { en: 'パーティーでよくするゲームは{何|なん}ですか。——しりとりをよくします。', ro: 'Paatii de yoku suru geemu wa nan desu ka. — Shiritori o yoku shimasu.', vi: 'Trò chơi hay chơi ở tiệc là gì? — Hay chơi nối chữ (shiritori). — ポイント 109' },
        { en: '{簡単|かんたん}で、おもしろいゲームですよ。', ro: 'Kantan de, omoshiroi geemu desu yo.', vi: 'Là trò chơi đơn giản mà vui lắm. (ナA で + イA — Bài 8)' },
      ],
    },

    /* ── 話読聞書 ── */
    { t: 'h', text: '④ Nói–Đọc–Nghe–Viết (話読聞書) — {私|わたし}のおすすめ (Thứ tôi giới thiệu)' },
    {
      t: 'p',
      text: 'Bài đọc mẫu (viết mới, cùng kiểu với sách): ミン giới thiệu một quán cà phê mình thích — **thứ tôi giới thiệu là gì**, **đó là … như thế nào** (普通形 + N), **ở đó làm được gì** (～ことができます) — rồi khuyên người đọc đi thử. Đọc to, rồi viết đoạn của bạn theo khung bên dưới.',
    },
    {
      t: 'passage',
      title: '{私|わたし}のおすすめ',
      paras: [
        { text: '{私|わたし}のおすすめは「こもれび」という{喫茶店|きっさてん}です。こもれびは{駅|えき}から{歩|ある}いて{3分|さんぷん}のところにある{小|ちい}さい{店|みせ}です。{店|みせ}の{人|ひと}がとても{親切|しんせつ}で、{若|わか}い{人|ひと}に{人気|にんき}があります。ここで{新鮮|しんせん}な{果物|くだもの}のケーキを{食|た}べることができます。{毎朝|まいあさ}{店|みせ}の{人|ひと}が{作|つく}るケーキは{本当|ほんとう}においしいです。{窓|まど}から{公園|こうえん}の{木|き}が{見|み}えますから、{春|はる}は{桜|さくら}、{秋|あき}は{紅葉|こうよう}を{見|み}ることができます。{私|わたし}は{何回|なんかい}も{行|い}ったことがあります。{時間|じかん}がある{人|ひと}はぜひ{行|い}ってください。' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{私|わたし}のおすすめは「こもれび」という{喫茶店|きっさてん}です。', ro: 'Watashi no osusume wa "Komorebi" to iu kissaten desu.', vi: 'Thứ tôi giới thiệu là quán cà phê tên "Komorebi". — ポイント 112' },
        { en: 'こもれびは{駅|えき}から{歩|ある}いて{3分|さんぷん}のところにある{小|ちい}さい{店|みせ}です。', ro: 'Komorebi wa eki kara aruite sanpun no tokoro ni aru chiisai mise desu.', vi: 'Komorebi là một quán nhỏ nằm ở chỗ cách ga 3 phút đi bộ. — ポイント 109' },
        { en: 'ここで{新鮮|しんせん}な{果物|くだもの}のケーキを{食|た}べることができます。', ro: 'Koko de shinsen na kudamono no keeki o taberu koto ga dekimasu.', vi: 'Ở đây có thể ăn bánh hoa quả tươi. — ことができます (Bài 9–10)' },
        { en: '{毎朝|まいあさ}{店|みせ}の{人|ひと}が{作|つく}るケーキは{本当|ほんとう}においしいです。', ro: 'Maiasa mise no hito ga tsukuru keeki wa hontou ni oishii desu.', vi: 'Bánh mà nhân viên quán làm mỗi sáng thật sự rất ngon. — ポイント 109 (chủ ngữ trong cụm dùng が)' },
        { en: '{私|わたし}は{何回|なんかい}も{行|い}ったことがあります。', ro: 'Watashi wa nankai mo itta koto ga arimasu.', vi: 'Tôi đã đi nhiều lần rồi. — ポイント 108' },
        { en: '{時間|じかん}がある{人|ひと}はぜひ{行|い}ってください。', ro: 'Jikan ga aru hito wa zehi itte kudasai.', vi: 'Ai có thời gian thì nhất định hãy đi nhé. — ポイント 109' },
      ],
    },
    {
      t: 'note',
      title: 'Viết đoạn "Thứ tôi giới thiệu" theo khung (3 câu gợi ý của sách)',
      items: [
        '**おすすめは{何|なん}ですか** → {私|わたし}のおすすめは「___」という ___ です。',
        '**どんな○○ですか** → ___ は ___（普通形）___ です。 Ví dụ: {駅|えき}から{近|ちか}い{店|みせ}です／{若|わか}い{人|ひと}に{人気|にんき}がある{店|みせ}です.',
        '**{何|なに}ができますか** → ___ で ___ ことができます。',
        'Thêm kinh nghiệm: {私|わたし}は ___ たことがあります。 Thêm lý do: ___ から、{楽|たの}しいです／おすすめです。',
        '**Câu kết:** ___ が{好|す}きな{人|ひと}／{時間|じかん}がある{人|ひと}は、ぜひ ___ てください。',
        'Từ thêm ở chân bài đọc của sách: おすすめ (thứ giới thiệu), {駅弁|えきべん} (cơm hộp bán ở ga), {切符|きっぷ} (vé), {特急電車|とっきゅうでんしゃ} (tàu tốc hành), ～{分|ぶん} (phần — {5枚分|ごまいぶん} = lượng 5 vé). Xem **Từ vựng · Từ thêm**.',
      ],
    },

    /* ── できる！ ── */
    { t: 'h', text: 'できる！— Làm khảo sát "thứ bạn giới thiệu"' },
    {
      t: 'p',
      text: 'Nhiệm vụ 4 bước như sách: ① chia nhóm, **chọn chủ đề** (quán ăn bạn giới thiệu, nơi hẹn hò bạn thích…) → ② **làm phiếu khảo sát** (nghĩ câu hỏi, thứ tự câu hỏi, các lựa chọn trả lời) → ③ **đi hỏi** nhiều người → ④ **tổng hợp và trình bày**. Dưới đây là phiếu mẫu và bài trình bày mẫu dùng đủ 5 ポイント của bài.',
    },
    {
      t: 'table',
      caption: 'Phiếu khảo sát mẫu — "おすすめのデートの{場所|ばしょ}" (tự đặt)',
      head: ['Số', 'Câu hỏi', 'Lựa chọn trả lời'],
      rows: [
        ['1', 'デートをしたことがありますか。', 'はい／いいえ'],
        ['2', 'デートでよく{行|い}く{場所|ばしょ}はどこですか。', '{映画館|えいがかん}・{遊園地|ゆうえんち}・レストラン・{公園|こうえん}・その{他|ほか}'],
        ['3', '「さくら{公園|こうえん}」という{公園|こうえん}を{知|し}っていますか。', '{知|し}っています／{知|し}りません'],
        ['4', 'おすすめのデートの{場所|ばしょ}はどこですか。どうしてですか。', '（{自由|じゆう}に{書|か}いてください）'],
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{私|わたし}たちのアンケートのテーマは「おすすめのデートの{場所|ばしょ}」です。', ro: 'Watashitachi no ankeeto no teema wa "osusume no deeto no basho" desu.', vi: 'Chủ đề khảo sát của nhóm chúng tôi là "nơi hẹn hò bạn giới thiệu".' },
        { en: '{20人|にじゅうにん}に{聞|き}きました。デートをしたことがある{人|ひと}は{15人|じゅうごにん}でした。', ro: 'Nijuunin ni kikimashita. Deeto o shita koto ga aru hito wa juugonin deshita.', vi: 'Chúng tôi hỏi 20 người. Người đã từng hẹn hò là 15 người. — ポイント 108 + 109' },
        { en: 'デートでよく{行|い}く{場所|ばしょ}は{映画館|えいがかん}がいちばん{多|おお}かったです。', ro: 'Deeto de yoku iku basho wa eigakan ga ichiban ookatta desu.', vi: 'Nơi hay đi khi hẹn hò thì rạp chiếu phim nhiều nhất. — ポイント 109' },
        { en: '「さくら{公園|こうえん}」という{公園|こうえん}を{知|し}っている{人|ひと}は{5人|ごにん}だけでした。', ro: '"Sakura kouen" to iu kouen o shitte iru hito wa gonin dake deshita.', vi: 'Người biết công viên tên "Sakura" chỉ có 5 người. — ポイント 111, 112, 109' },
        { en: 'いちばん{人気|にんき}がある{場所|ばしょ}は{遊園地|ゆうえんち}でした。ジェットコースターに{乗|の}ることができますから。', ro: 'Ichiban ninki ga aru basho wa yuuenchi deshita. Jetto koosutaa ni noru koto ga dekimasu kara.', vi: 'Nơi được yêu thích nhất là công viên giải trí. Vì có thể đi tàu lượn siêu tốc.' },
        { en: '{以上|いじょう}です。ありがとうございました。', ro: 'Ijou desu. Arigatou gozaimashita.', vi: 'Tôi xin hết. Cảm ơn mọi người. (câu kết khi trình bày)' },
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */
/* Đủ 40 mục của trang ことば p.235: chủ đề 1 (8) = A 8 · chủ đề 2 (25) = B 6 + C 6 + D 3 + E 5 + F 5 ·
 * chủ đề 3 (7) = G 7. */

const TU_VUNG: Lesson = {
  id: 'b13-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 40 từ của trang ことば Bài 13',
  goal: 'Thuộc đủ 40 từ của Bài 13 (kinh nghiệm, cửa hàng – nơi chơi, quần áo và động từ "mặc / đội / đeo", màu sắc, chuẩn bị tiệc) và dùng được mỗi từ trong một câu hỏi kinh nghiệm, giới thiệu hoặc tả người.',
  minutes: 40,
  blocks: [
    {
      t: 'p',
      text: 'Đủ **40 từ** trên trang ことば (p.235), giữ đúng 3 chủ đề của sách: **{経験|けいけん}から** (8 từ — nhóm A), **おすすめします** (25 từ — nhóm B, C, D, E, F), **{教|おし}えてください** (7 từ — nhóm G). Từ Bài 8 cô không phát danh sách riêng nên đây là chuẩn. Số **1 / 2 / 3** sau động từ = nhóm động từ. Câu ví dụ chỉ dùng từ Bài 1–13. Cách học: bấm 🔊 → đọc to 3 lần → che nghĩa, tự nói.',
    },
    {
      t: 'note',
      title: 'Cách đọc romaji trong khoá',
      items: [
        'Trường âm viết theo đúng chữ kana: {紅葉|こうよう} → **kouyou**, {相撲|すもう} → **sumou**, {帽子|ぼうし} → boushi, {遊園地|ゆうえんち} → **yuuenchi**, {材料|ざいりょう} → zairyou, {練習|れんしゅう} → renshuu, ジェットコースター → **jetto koosutaa**, スカート → sukaato.',
        'Âm ngắt っ viết đôi phụ âm: {1回|いっかい} → **ikkai**, バスケットボール → **basukettobooru**, ジェットコースター → jetto.',
        'Âm っ + か ở số lần: {1回|いっかい} ikkai, {6回|ろっかい} rokkai, {8回|はっかい} hakkai, {10回|じゅっかい} jukkai — đọc có ngắt nhịp.',
      ],
    },

    { t: 'h', text: 'A. Kinh nghiệm, du lịch (8 từ — chủ đề 1)' },
    {
      t: 'vocab',
      items: [
        { w: '{紅葉|こうよう}', pos: 'danh từ', ipa: 'kouyou', vi: 'lá đỏ mùa thu, mùa lá đổi màu (cũng đọc もみじ)', ex: '{京都|きょうと}の{紅葉|こうよう}を{見|み}たことがありますか。', exRo: 'Kyouto no kouyou o mita koto ga arimasu ka.', exVi: 'Bạn đã từng ngắm lá đỏ ở Kyoto chưa?' },
        { w: 'サービス', pos: 'danh từ', ipa: 'saabisu', vi: 'dịch vụ, cách phục vụ (サービスがいい = phục vụ tốt)', ex: 'このホテルはサービスがいいですよ。', exRo: 'Kono hoteru wa saabisu ga ii desu yo.', exVi: 'Khách sạn này phục vụ tốt lắm.' },
        { w: '{相撲|すもう}', pos: 'danh từ', ipa: 'sumou', vi: 'sumo (môn vật truyền thống Nhật)', ex: '{両親|りょうしん}と{相撲|すもう}を{見|み}に{行|い}きたいです。', exRo: 'Ryoushin to sumou o mi ni ikitai desu.', exVi: 'Tôi muốn đi xem sumo cùng bố mẹ.' },
        { w: 'ホテル', pos: 'danh từ', ipa: 'hoteru', vi: 'khách sạn', ex: '{駅|えき}から{近|ちか}いホテルを{知|し}っていますか。', exRo: 'Eki kara chikai hoteru o shitte imasu ka.', exVi: 'Bạn có biết khách sạn nào gần ga không?' },
        { w: '{知|し}ります［{知|し}る］1', pos: 'động từ nhóm 1', ipa: 'shirimasu [shiru]', vi: 'biết (thông tin, nơi chốn, người). Dùng dạng **知っています** (biết) ↔ **知りません** (không biết)', ex: 'この{店|みせ}を{知|し}っていますか。——いいえ、{知|し}りません。', exRo: 'Kono mise o shitte imasu ka. — Iie, shirimasen.', exVi: 'Bạn biết quán này không? — Không, tôi không biết.' },
        { w: 'デート・します［デート・する］3', pos: 'động từ nhóm 3', ipa: 'deeto shimasu [deeto suru]', vi: 'hẹn hò (デート = buổi hẹn hò)', ex: '{日曜日|にちようび}、{遊園地|ゆうえんち}でデートをします。', exRo: 'Nichiyoubi, yuuenchi de deeto o shimasu.', exVi: 'Chủ nhật tôi hẹn hò ở công viên giải trí.' },
        { w: '{1回|いっかい}も', pos: 'cụm phó từ', ipa: 'ikkai mo', vi: 'chưa … lần nào, không … lần nào (luôn đi với câu PHỦ ĐỊNH)', ex: '{1回|いっかい}も{飛行機|ひこうき}に{乗|の}ったことがありません。', exRo: 'Ikkai mo hikouki ni notta koto ga arimasen.', exVi: 'Tôi chưa đi máy bay lần nào.' },
        { w: '{何回|なんかい}も', pos: 'cụm phó từ', ipa: 'nankai mo', vi: 'nhiều lần (đi với câu KHẲNG ĐỊNH). Khác {何回|なんかい}？ = mấy lần?', ex: 'この{映画|えいが}は{何回|なんかい}も{見|み}たことがあります。', exRo: 'Kono eiga wa nankai mo mita koto ga arimasu.', exVi: 'Phim này tôi đã xem nhiều lần rồi.' },
      ],
    },
    {
      t: 'table',
      caption: 'Đếm số lần — ～{回|かい} (đã gặp ở Bài 9, ôn lại để trả lời "đã từng mấy lần")',
      head: ['Số lần', 'Đọc', 'Romaji', 'Câu'],
      rows: [
        ['1 lần', '{1回|いっかい}', 'ikkai', '{1回|いっかい}あります。'],
        ['2 lần', '{2回|にかい}', 'nikai', '{2回|にかい}{行|い}ったことがあります。'],
        ['3 lần', '{3回|さんかい}', 'sankai', '{3回|さんかい}{見|み}ました。'],
        ['6 lần', '{6回|ろっかい}', 'rokkai', '—'],
        ['8 lần', '{8回|はっかい}', 'hakkai', '—'],
        ['10 lần', '{10回|じゅっかい}', 'jukkai', '—'],
        ['mấy lần?', '{何回|なんかい}', 'nankai', '{何回|なんかい}{行|い}ったことがありますか。'],
        ['nhiều lần', '{何回|なんかい}も', 'nankai mo', '{何回|なんかい}も{行|い}ったことがあります。'],
        ['chưa lần nào', '{1回|いっかい}も～ません', 'ikkai mo ~masen', '{1回|いっかい}も{行|い}ったことがありません。'],
      ],
    },

    { t: 'h', text: 'B. Người, cửa hàng, nơi chơi (6 từ — chủ đề 2)' },
    {
      t: 'vocab',
      items: [
        { w: '{男|おとこ}の{人|ひと}', pos: 'danh từ', ipa: 'otoko no hito', vi: 'người đàn ông, người nam', ex: 'あの{男|おとこ}の{人|ひと}は{誰|だれ}ですか。', exRo: 'Ano otoko no hito wa dare desu ka.', exVi: 'Người đàn ông kia là ai?' },
        { w: '{女|おんな}の{人|ひと}', pos: 'danh từ', ipa: 'onna no hito', vi: 'người phụ nữ, người nữ', ex: '{眼鏡|めがね}をかけている{女|おんな}の{人|ひと}が{木村|きむら}さんです。', exRo: 'Megane o kakete iru onna no hito ga Kimura-san desu.', exVi: 'Người phụ nữ đang đeo kính là chị Kimura.' },
        { w: '（お）{店|みせ}', pos: 'danh từ', ipa: '(o)mise', vi: 'cửa hàng, quán (お店 — lịch sự hơn)', ex: 'どこかいいお{店|みせ}を{知|し}っていますか。', exRo: 'Dokoka ii omise o shitte imasu ka.', exVi: 'Bạn có biết quán nào được không?' },
        { w: '{遊園地|ゆうえんち}', pos: 'danh từ', ipa: 'yuuenchi', vi: 'công viên giải trí (có tàu lượn, đu quay…)', ex: '{遊園地|ゆうえんち}へ{行|い}ったことがありますか。', exRo: 'Yuuenchi e itta koto ga arimasu ka.', exVi: 'Bạn đã từng đi công viên giải trí chưa?' },
        { w: 'ジェットコースター', pos: 'danh từ', ipa: 'jetto koosutaa', vi: 'tàu lượn siêu tốc', ex: 'ジェットコースターに{乗|の}ったことがありません。{乗|の}りたいです。', exRo: 'Jetto koosutaa ni notta koto ga arimasen. Noritai desu.', exVi: 'Tôi chưa từng đi tàu lượn siêu tốc. Tôi muốn đi thử.' },
        { w: '{電気製品|でんきせいひん}', pos: 'danh từ', ipa: 'denki seihin', vi: 'đồ điện, đồ điện tử (TV, máy ảnh, máy tính…)', ex: 'あの{店|みせ}は{電気製品|でんきせいひん}が{安|やす}いです。', exRo: 'Ano mise wa denki seihin ga yasui desu.', exVi: 'Cửa hàng kia bán đồ điện rẻ.' },
      ],
    },

    { t: 'h', text: 'C. Quần áo, phụ kiện (6 từ — chủ đề 2)' },
    {
      t: 'vocab',
      items: [
        { w: 'サングラス', pos: 'danh từ', ipa: 'sangurasu', vi: 'kính râm (đeo: サングラスをかけます)', ex: 'サングラスをかけている{人|ひと}は{誰|だれ}ですか。', exRo: 'Sangurasu o kakete iru hito wa dare desu ka.', exVi: 'Người đang đeo kính râm là ai?' },
        { w: '{眼鏡|めがね}', pos: 'danh từ', ipa: 'megane', vi: 'kính mắt (đeo: 眼鏡をかけます)', ex: '{西川|にしかわ}さんはいつも{眼鏡|めがね}をかけています。', exRo: 'Nishikawa-san wa itsumo megane o kakete imasu.', exVi: 'Anh Nishikawa lúc nào cũng đeo kính.' },
        { w: 'シャツ', pos: 'danh từ', ipa: 'shatsu', vi: 'áo sơ mi, áo (mặc: シャツを着ます)', ex: '{今日|きょう}は{白|しろ}いシャツを{着|き}ています。', exRo: 'Kyou wa shiroi shatsu o kite imasu.', exVi: 'Hôm nay tôi mặc áo sơ mi trắng.' },
        { w: 'スカート', pos: 'danh từ', ipa: 'sukaato', vi: 'váy (mặc: スカートをはきます)', ex: '{青|あお}いスカートをはいている{人|ひと}がパクさんです。', exRo: 'Aoi sukaato o haite iru hito ga Paku-san desu.', exVi: 'Người đang mặc váy xanh là Park.' },
        { w: 'ネクタイ', pos: 'danh từ', ipa: 'nekutai', vi: 'cà vạt (đeo: ネクタイをします)', ex: '{会社|かいしゃ}へ{行|い}くとき、ネクタイをします。', exRo: 'Kaisha e iku toki, nekutai o shimasu.', exVi: 'Khi đi làm, tôi đeo cà vạt.' },
        { w: '{帽子|ぼうし}', pos: 'danh từ', ipa: 'boushi', vi: 'mũ, nón (đội: 帽子をかぶります)', ex: '{暑|あつ}いですから、{帽子|ぼうし}をかぶったほうがいいですよ。', exRo: 'Atsui desu kara, boushi o kabutta hou ga ii desu yo.', exVi: 'Trời nóng nên đội mũ thì hơn. (～ほうがいい Bài 12)' },
      ],
    },

    { t: 'h', text: 'D. Được yêu thích, bán, ở trọ (3 từ — chủ đề 2)' },
    {
      t: 'vocab',
      items: [
        { w: '{人気|にんき}', pos: 'danh từ', ipa: 'ninki', vi: 'sự được yêu thích, nổi tiếng (N に人気があります = được N yêu thích; 人気がある店 = quán đông khách)', ex: 'この{歌手|かしゅ}は{若|わか}い{人|ひと}に{人気|にんき}があります。', exRo: 'Kono kashu wa wakai hito ni ninki ga arimasu.', exVi: 'Ca sĩ này được giới trẻ yêu thích.' },
        { w: '{売|う}ります［{売|う}る］1', pos: 'động từ nhóm 1', ipa: 'urimasu [uru]', vi: 'bán (↔ 買います mua). ～を売っています = có bán ~', ex: 'あの{店|みせ}は{安|やす}い{浴衣|ゆかた}を{売|う}っています。', exRo: 'Ano mise wa yasui yukata o utte imasu.', exVi: 'Cửa hàng kia có bán yukata rẻ.' },
        { w: '{泊|と}まります［{泊|と}まる］1', pos: 'động từ nhóm 1', ipa: 'tomarimasu [tomaru]', vi: 'trọ lại, nghỉ lại qua đêm (nơi + に泊まります)', ex: '{京都|きょうと}で{泊|と}まったホテルはとてもきれいでした。', exRo: 'Kyouto de tomatta hoteru wa totemo kirei deshita.', exVi: 'Khách sạn tôi trọ ở Kyoto rất đẹp.' },
      ],
    },

    { t: 'h', text: 'E. Động từ "mặc / đội / đeo / đi" (5 từ — chủ đề 2)' },
    {
      t: 'p',
      text: 'Tiếng Việt chỉ có "mặc, đội, đeo, đi (giày)". Tiếng Nhật chọn **động từ theo bộ phận cơ thể** — chọn sai là sai nghĩa. Học thuộc bảng tổng hợp ngay dưới năm từ này.',
    },
    {
      t: 'vocab',
      items: [
        { w: '{着|き}ます［{着|き}る］2', pos: 'động từ nhóm 2', ipa: 'kimasu [kiru]', vi: 'mặc (áo, đồ phần TRÊN hoặc cả người: シャツ, セーター, {浴衣|ゆかた}, コート). ⚠ khác {来|き}ます (đến) — cùng âm きます', ex: '{日本|にほん}で{浴衣|ゆかた}を{着|き}たことがあります。', exRo: 'Nihon de yukata o kita koto ga arimasu.', exVi: 'Tôi đã từng mặc yukata ở Nhật.' },
        { w: 'はきます［はく］1', pos: 'động từ nhóm 1', ipa: 'hakimasu [haku]', vi: 'mặc / đi (đồ phần DƯỚI và chân: スカート, ズボン, {靴|くつ}, {靴下|くつした})', ex: '{黒|くろ}いズボンをはいている{人|ひと}はマルコさんです。', exRo: 'Kuroi zubon o haite iru hito wa Maruko-san desu.', exVi: 'Người đang mặc quần đen là Marco.' },
        { w: 'かぶります［かぶる］1', pos: 'động từ nhóm 1', ipa: 'kaburimasu [kaburu]', vi: 'đội (lên ĐẦU: {帽子|ぼうし})', ex: '{赤|あか}い{帽子|ぼうし}をかぶっている{人|ひと}が{好|す}きです。', exRo: 'Akai boushi o kabutte iru hito ga suki desu.', exVi: 'Tôi thích người đang đội mũ đỏ.' },
        { w: 'かけます［かける］2', pos: 'động từ nhóm 2', ipa: 'kakemasu [kakeru]', vi: 'đeo (KÍNH: {眼鏡|めがね}, サングラス). Cùng chữ với 電話をかけます (gọi điện) — nghĩa theo tân ngữ', ex: '{本|ほん}を{読|よ}むとき、{眼鏡|めがね}をかけます。', exRo: 'Hon o yomu toki, megane o kakemasu.', exVi: 'Khi đọc sách tôi đeo kính.' },
        { w: 'します［する］3', pos: 'động từ nhóm 3', ipa: 'shimasu [suru]', vi: 'đeo (phụ kiện: ネクタイ, {時計|とけい}, マフラー…) — ネクタイをします', ex: 'パーティーのとき、ネクタイをしたほうがいいです。', exRo: 'Paatii no toki, nekutai o shita hou ga ii desu.', exVi: 'Khi đi tiệc thì nên đeo cà vạt.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng tổng hợp — mặc / đội / đeo theo bộ phận (học thuộc)',
      head: ['Bộ phận', 'Động từ', 'Đồ vật', 'Đang mặc (ポイント 110)'],
      rows: [
        ['Đầu', 'かぶります', '{帽子|ぼうし}', '{帽子|ぼうし}をかぶっています'],
        ['Mắt', 'かけます', '{眼鏡|めがね}・サングラス', '{眼鏡|めがね}をかけています'],
        ['Thân trên / cả người', '{着|き}ます', 'シャツ・セーター・コート・{浴衣|ゆかた}・{服|ふく}', 'シャツを{着|き}ています'],
        ['Thân dưới, chân', 'はきます', 'スカート・ズボン・{靴|くつ}・{靴下|くつした}', 'スカートをはいています'],
        ['Phụ kiện', 'します', 'ネクタイ・{時計|とけい}・マフラー', 'ネクタイをしています'],
        ['Cởi, tháo (mọi thứ trên)', '{脱|ぬ}ぎます／とります', '{服|ふく}・{靴|くつ} → {脱|ぬ}ぎます; {帽子|ぼうし}・{眼鏡|めがね} → とります', '（Bài 12: {靴|くつ}を{脱|ぬ}いでください）'],
      ],
    },

    { t: 'h', text: 'F. Màu sắc, tuổi, tươi (5 từ — chủ đề 2)' },
    {
      t: 'vocab',
      items: [
        { w: '{青|あお}い', pos: 'tính từ đuôi い', ipa: 'aoi', vi: 'xanh (xanh dương; cả xanh lá của đèn giao thông, trời, biển)', ex: '{青|あお}いシャツを{着|き}ている{人|ひと}が{西川|にしかわ}さんです。', exRo: 'Aoi shatsu o kite iru hito ga Nishikawa-san desu.', exVi: 'Người mặc áo xanh là anh Nishikawa.' },
        { w: '{赤|あか}い', pos: 'tính từ đuôi い', ipa: 'akai', vi: 'đỏ', ex: '{赤|あか}いスカートを{買|か}いました。', exRo: 'Akai sukaato o kaimashita.', exVi: 'Tôi đã mua cái váy đỏ.' },
        { w: '{黄色|きいろ}い', pos: 'tính từ đuôi い', ipa: 'kiiroi', vi: 'vàng (màu vàng) — 黄色 (danh từ) + い', ex: '{木村|きむら}さんは{今日|きょう}、{黄色|きいろ}いシャツを{着|き}ています。', exRo: 'Kimura-san wa kyou, kiiroi shatsu o kite imasu.', exVi: 'Hôm nay chị Kimura mặc áo vàng.' },
        { w: '{若|わか}い', pos: 'tính từ đuôi い', ipa: 'wakai', vi: 'trẻ (tuổi)', ex: 'ここは{若|わか}い{人|ひと}に{人気|にんき}がある{店|みせ}です。', exRo: 'Koko wa wakai hito ni ninki ga aru mise desu.', exVi: 'Đây là quán được giới trẻ yêu thích.' },
        { w: '{新鮮|しんせん}（な）', pos: 'tính từ đuôi な', ipa: 'shinsen (na)', vi: 'tươi, tươi sống (cá, rau, hoa quả)', ex: 'この{店|みせ}は{新鮮|しんせん}な{魚|さかな}を{食|た}べることができます。', exRo: 'Kono mise wa shinsen na sakana o taberu koto ga dekimasu.', exVi: 'Quán này có thể ăn cá tươi.' },
      ],
    },
    {
      t: 'table',
      caption: 'Màu sắc — tính từ い và danh từ (ôn + thêm)',
      head: ['Màu', 'Tính từ (trước danh từ)', 'Danh từ (～の／～です)', 'Ghi chú'],
      rows: [
        ['đỏ', '{赤|あか}い', '{赤|あか}', '{赤|あか}いシャツ'],
        ['xanh dương', '{青|あお}い', '{青|あお}', '{青|あお}い{空|そら}'],
        ['vàng', '{黄色|きいろ}い', '{黄色|きいろ}', '{黄色|きいろ}い{帽子|ぼうし}'],
        ['trắng', '{白|しろ}い', '{白|しろ}', '{白|しろ}いシャツ (Bài 7–8)'],
        ['đen', '{黒|くろ}い', '{黒|くろ}', '{黒|くろ}い{靴|くつ} (Bài 8)'],
        ['xanh lá', '—', '{緑|みどり}', '{緑|みどり}のスカート (không có ~~緑い~~)'],
        ['nâu', '—', '{茶色|ちゃいろ}', '{茶色|ちゃいろ}い cũng dùng'],
      ],
    },

    { t: 'h', text: 'G. Chuẩn bị tiệc, tìm chỗ (7 từ — chủ đề 3)' },
    {
      t: 'vocab',
      items: [
        { w: '{材料|ざいりょう}', pos: 'danh từ', ipa: 'zairyou', vi: 'nguyên liệu, vật liệu (nấu ăn, làm đồ)', ex: 'バーベキューの{材料|ざいりょう}はどこで{買|か}いますか。', exRo: 'Baabekyuu no zairyou wa doko de kaimasu ka.', exVi: 'Nguyên liệu cho tiệc nướng mua ở đâu?' },
        { w: '{場所|ばしょ}', pos: 'danh từ', ipa: 'basho', vi: 'nơi, địa điểm, chỗ', ex: 'お{花見|はなみ}をする{場所|ばしょ}を{探|さが}しています。', exRo: 'Ohanami o suru basho o sagashite imasu.', exVi: 'Tôi đang tìm chỗ để ngắm hoa anh đào.' },
        { w: 'バスケットボール', pos: 'danh từ', ipa: 'basukettobooru', vi: 'bóng rổ', ex: 'バスケットボールを{練習|れんしゅう}することができる{場所|ばしょ}を{知|し}っていますか。', exRo: 'Basukettobooru o renshuu suru koto ga dekiru basho o shitte imasu ka.', exVi: 'Bạn có biết chỗ nào có thể tập bóng rổ không?' },
        { w: '{浴衣|ゆかた}', pos: 'danh từ', ipa: 'yukata', vi: 'yukata (áo kimono vải mỏng mặc mùa hè)', ex: '「エトス」という{店|みせ}は{安|やす}い{浴衣|ゆかた}がたくさんあります。', exRo: '"Etosu" to iu mise wa yasui yukata ga takusan arimasu.', exVi: 'Cửa hàng tên "Etos" có nhiều yukata rẻ.' },
        { w: 'どこか', pos: 'danh từ (bất định)', ipa: 'dokoka', vi: 'đâu đó, một nơi nào đó (どこかいい店 = quán nào đó được). Khác どこ (ở đâu?)', ex: 'どこかいい{公園|こうえん}を{知|し}っていますか。', exRo: 'Dokoka ii kouen o shitte imasu ka.', exVi: 'Bạn có biết công viên nào (ở đâu đó) tốt không?' },
        { w: '{練習|れんしゅう}・します［{練習|れんしゅう}・する］3', pos: 'động từ nhóm 3', ipa: 'renshuu shimasu [renshuu suru]', vi: 'luyện tập', ex: '{毎日|まいにち}ピアノを{練習|れんしゅう}しています。', exRo: 'Mainichi piano o renshuu shite imasu.', exVi: 'Ngày nào tôi cũng tập piano.' },
        { w: 'みんなで', pos: 'cụm phó từ', ipa: 'minna de', vi: 'mọi người cùng nhau, cả nhóm cùng', ex: 'みんなで{飲|の}み{会|かい}をする{店|みせ}を{探|さが}しています。', exRo: 'Minna de nomikai o suru mise o sagashite imasu.', exVi: 'Tôi đang tìm quán để cả nhóm cùng nhậu.' },
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp trong từ bài 13',
      items: [
        '**{知|し}っています ↔ {知|し}りません**: "biết" dùng dạng ～ています, nhưng "không biết" là **知りません** — không có ~~知っていません~~ (ポイント 111).',
        '**{知|し}っています ↔ わかります**: 知っています = có thông tin trong đầu (biết quán, biết người, biết số điện thoại); わかります = hiểu (câu hỏi, tiếng Nhật, ý nghĩa). ~~この店がわかりますか~~ → この店を**知っていますか**.',
        '**{着|き}ます (mặc) ↔ {来|き}ます (đến)**: cùng đọc きます. Thể て giống nhau (きて), thể từ điển khác: **着る** / **来る**; thể ない: **着ない** / **来ない**.',
        '**Mặc / đội / đeo** đừng dùng một động từ cho tất cả: ~~帽子を着ます~~ → **かぶります**; ~~眼鏡を着ます~~ → **かけます**; ~~スカートを着ます~~ → **はきます**; ~~ネクタイを着ます~~ → **します**.',
        '**{1回|いっかい}も** chỉ đi với phủ định: ~~1回も行ったことがあります~~ → **1回も行ったことがありません**. Muốn nói "một lần" khẳng định: **1回あります**.',
        '**どこか ↔ どこ**: どこ**へ**行きますか = đi đâu? (hỏi địa điểm) · どこ**か**へ行きますか = có đi đâu đó không? (trả lời はい／いいえ).',
        '**{紅葉|こうよう} ↔ もみじ**: cùng chữ 紅葉; こうよう = hiện tượng lá đổi màu; もみじ = lá phong đỏ. Sách dùng こうよう.',
      ],
    },

    { t: 'h', text: 'Từ thêm (sách có ở bài đọc, bài nghe, 言ってみよう — chỉ cần nghe hiểu)' },
    {
      t: 'table',
      head: ['Từ / câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['おすすめ', 'osusume', 'Thứ được giới thiệu / gợi ý (私のおすすめ = thứ tôi giới thiệu). おすすめします = tôi giới thiệu'],
        ['{経験|けいけん}', 'keiken', 'Kinh nghiệm, trải nghiệm (tên chủ đề 1)'],
        ['{情報|じょうほう}', 'jouhou', 'Thông tin'],
        ['{交流会|こうりゅうかい}', 'kouryuukai', 'Buổi giao lưu'],
        ['{両親|りょうしん}', 'ryoushin', 'Bố mẹ (của mình)'],
        ['{登|のぼ}ります［{登|のぼ}る］1', 'noborimasu [noboru]', 'Leo (núi) — {富士山|ふじさん}に{登|のぼ}ります (câu mẫu ポイント 108)'],
        ['{景色|けしき}', 'keshiki', 'Phong cảnh (bài đọc)'],
        ['{駅弁|えきべん}', 'ekiben', 'Cơm hộp bán ở ga, trên tàu (chân bài đọc)'],
        ['{切符|きっぷ}', 'kippu', 'Vé (tàu, xe) (chân bài đọc)'],
        ['{特急電車|とっきゅうでんしゃ}', 'tokkyuu densha', 'Tàu điện tốc hành (chân bài đọc)'],
        ['{新幹線|しんかんせん}', 'shinkansen', 'Tàu cao tốc Shinkansen'],
        ['～{分|ぶん}', '~bun', 'Phần, lượng tương ứng ({5枚分|ごまいぶん} = lượng 5 vé) (chân bài đọc — sách in ～分; đọc ぶん, không phải ふん "phút")'],
        ['{手袋|てぶくろ}', 'tebukuro', 'Găng tay (chân bài nghe) — đeo: {手袋|てぶくろ}をします'],
        ['{毛糸|けいと}', 'keito', 'Len (sợi len) — {毛糸|けいと}の{帽子|ぼうし} = mũ len (chân bài nghe)'],
        ['{予約|よやく}', 'yoyaku', 'Đặt trước (phòng, bàn) — {予約|よやく}します'],
        ['{居酒屋|いざかや}', 'izakaya', 'Quán nhậu kiểu Nhật'],
        ['{飲|の}み{会|かい}', 'nomikai', 'Buổi đi nhậu, liên hoan uống'],
        ['お{花見|はなみ}', 'ohanami', 'Ngắm hoa anh đào'],
        ['しりとり', 'shiritori', 'Trò nối chữ (từ sau bắt đầu bằng âm cuối của từ trước)'],
        ['お{好|この}み{焼|や}き', 'okonomiyaki', 'Bánh xèo Nhật'],
        ['{有名人|ゆうめいじん}', 'yuumeijin', 'Người nổi tiếng'],
        ['{歌手|かしゅ}', 'kashu', 'Ca sĩ'],
        ['かっこいい', 'kakkoii', 'Ngầu, đẹp trai, phong độ'],
        ['{服|ふく}', 'fuku', 'Quần áo'],
        ['ズボン', 'zubon', 'Quần dài'],
        ['{靴|くつ}／{靴下|くつした}', 'kutsu / kutsushita', 'Giày / tất'],
        ['セーター', 'seetaa', 'Áo len'],
        ['へえ', 'hee', 'Ồ (ngạc nhiên, thấy hay)'],
        ['ほら', 'hora', 'Nhìn này, đấy (chỉ cho người khác xem)'],
        ['アンケート', 'ankeeto', 'Phiếu khảo sát (できる！)'],
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b13-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp — ポイント 108–112: たことがあります, 普通形＋N, ています (đang mặc), 知っています, という',
  goal: 'Nói "đã từng / chưa từng" với thể た, dùng cả một câu thể thường để bổ nghĩa cho danh từ (quán mà tôi hay đi, người đang đội mũ đỏ), tả người đang mặc – đội – đeo gì, hỏi – đáp "có biết … không" đúng dạng, và giới thiệu một cái tên lạ bằng という.',
  minutes: 90,
  blocks: [
    {
      t: 'p',
      text: 'Bài 13 có **5 điểm ngữ pháp** (ポイント 108–112). Ba chủ đề của sách dùng chúng như sau: **{経験|けいけん}から** 108, 111, 112 · **おすすめします** 109, 110 · **{教|おし}えてください** 109. Hai điểm lớn nhất là **108** (dựa trên **thể た**) và **109** (dựa trên **thể thường 普通形**) — nên phần "Chuẩn bị" ôn lại hai hình thái này trước. Mỗi điểm có công thức → ví dụ → cặp hỏi–đáp → bảng thay thế → lỗi hay mắc.',
    },
    {
      t: 'table',
      caption: 'Bản đồ 5 điểm ngữ pháp',
      head: ['ポイント', 'Mẫu', 'Nghĩa', 'Ví dụ ngắn'],
      rows: [
        ['108', 'Vた形 ことがあります', 'Đã từng V (kinh nghiệm)', '{富士山|ふじさん}に{登|のぼ}ったことがあります。'],
        ['109', '普通形 ＋ N', 'N mà … (cả câu bổ nghĩa cho danh từ)', '{私|わたし}がよく{読|よ}む{雑誌|ざっし}です。'],
        ['110', 'Vテ形 います', 'Đang mặc / đội / đeo … (trạng thái)', '{黄色|きいろ}いシャツを{着|き}ています。'],
        ['111', '{知|し}っています／{知|し}りません', 'Biết / không biết', 'パン{屋|や}を{知|し}っていますか。——いいえ、{知|し}りません。'],
        ['112', 'N1 という N2', 'N2 tên là N1', '「さくら」という{歌|うた}です。'],
      ],
    },

    /* ── Chuẩn bị: thể た ── */
    { t: 'h', text: 'Chuẩn bị ① — Thể た (タ形): cách chia (ôn Bài 11)' },
    {
      t: 'p',
      text: 'Thể た là **quá khứ thể thường** ({食|た}べた = đã ăn). Cách chia **y hệt thể て**, chỉ đổi て → **た**, で → **だ**. Thuộc thể て (Bài 7) là thuộc thể た.',
    },
    {
      t: 'table',
      caption: 'Quy tắc chia thể た (từ thể ます) — giống thể て',
      head: ['Nhóm', 'Âm trước ます', 'Thể た', 'Ví dụ'],
      rows: [
        ['1', 'い・ち・り', '～った', '{買|か}います → {買|か}**った** · {持|も}ちます → {持|も}**った** · {登|のぼ}ります → {登|のぼ}**った**'],
        ['1', 'み・び・に', '～んだ', '{飲|の}みます → {飲|の}**んだ** · {遊|あそ}びます → {遊|あそ}**んだ** · {死|し}にます → {死|し}**んだ**'],
        ['1', 'き', '～いた', '{聞|き}きます → {聞|き}**いた** · はきます → は**いた** · **{行|い}きます → {行|い}った** (ngoại lệ)'],
        ['1', 'ぎ', '～いだ', '{泳|およ}ぎます → {泳|およ}**いだ**'],
        ['1', 'し', '～した', '{話|はな}します → {話|はな}**した**'],
        ['2', '(bỏ ます)', '～た', '{食|た}べます → {食|た}べ**た** · {見|み}ます → {見|み}**た** · {着|き}ます → {着|き}**た** · かけます → かけ**た**'],
        ['3', '—', 'した・{来|き}た', 'します → **した** · {来|き}ます → **{来|き}た** · デートします → デート**した**'],
      ],
    },
    {
      t: 'table',
      caption: 'Động từ hay dùng với ～たことがあります',
      head: ['Thể ます', 'Nhóm', 'Thể た', 'Romaji', '～たことがあります'],
      rows: [
        ['{行|い}きます', '1 ⚠', '{行|い}った', 'itta', '{沖縄|おきなわ}へ{行|い}ったことがあります'],
        ['{登|のぼ}ります', '1', '{登|のぼ}った', 'nobotta', '{富士山|ふじさん}に{登|のぼ}ったことがあります'],
        ['{乗|の}ります', '1', '{乗|の}った', 'notta', 'ジェットコースターに{乗|の}ったことがあります'],
        ['{泊|と}まります', '1', '{泊|と}まった', 'tomatta', 'このホテルに{泊|と}まったことがあります'],
        ['{飲|の}みます', '1', '{飲|の}んだ', 'nonda', '{日本|にほん}のお{酒|さけ}を{飲|の}んだことがあります'],
        ['{会|あ}います', '1', '{会|あ}った', 'atta', '{有名人|ゆうめいじん}に{会|あ}ったことがあります'],
        ['{食|た}べます', '2', '{食|た}べた', 'tabeta', 'お{好|この}み{焼|や}きを{食|た}べたことがあります'],
        ['{見|み}ます', '2', '{見|み}た', 'mita', '{相撲|すもう}を{見|み}たことがあります'],
        ['{着|き}ます', '2', '{着|き}た', 'kita', '{浴衣|ゆかた}を{着|き}たことがあります'],
        ['します', '3', 'した', 'shita', 'スキーをしたことがあります'],
        ['{来|き}ます', '3', '{来|き}た', 'kita', 'ここに{来|き}たことがあります'],
      ],
    },

    /* ── Chuẩn bị: 普通形 ── */
    { t: 'h', text: 'Chuẩn bị ② — Thể thường (普通形) (表 p.284)' },
    {
      t: 'p',
      text: 'Thể thường = dạng "trần" không có です／ます. Bạn đã dùng nó khi nói chuyện với bạn thân (友達言葉, Bài 11). Ở Bài 13 nó có việc mới: **đứng trước danh từ để bổ nghĩa** (ポイント 109). Bảng dưới là 4 thì của mỗi loại từ.',
    },
    {
      t: 'table',
      caption: '丁寧形 (lịch sự) ↔ 普通形 (thể thường) — 表 p.284',
      head: ['Loại', '丁寧形', '普通形', 'Nghĩa'],
      rows: [
        ['V', '{行|い}きます', '{行|い}く', 'đi'],
        ['V', '{行|い}きません', '{行|い}かない', 'không đi'],
        ['V', '{行|い}きました', '{行|い}った', 'đã đi'],
        ['V', '{行|い}きませんでした', '{行|い}かなかった', 'đã không đi'],
        ['V', 'あります／ありません', 'ある／**ない**', 'có / không có'],
        ['イA', 'おいしいです／おいしくないです', 'おいしい／おいしくない', 'ngon / không ngon'],
        ['イA', 'おいしかったです／おいしくなかったです', 'おいしかった／おいしくなかった', 'đã ngon / đã không ngon'],
        ['ナA', '{元気|げんき}です／{元気|げんき}じゃありません', '{元気|げんき}**だ**／{元気|げんき}じゃない', 'khoẻ / không khoẻ'],
        ['ナA', '{元気|げんき}でした／{元気|げんき}じゃありませんでした', '{元気|げんき}だった／{元気|げんき}じゃなかった', 'đã khoẻ / đã không khoẻ'],
        ['N', '{休|やす}みです／{休|やす}みじゃありません', '{休|やす}み**だ**／{休|やす}みじゃない', 'là ngày nghỉ / không phải'],
        ['N', '{休|やす}みでした／{休|やす}みじゃありませんでした', '{休|やす}みだった／{休|やす}みじゃなかった', 'đã là / đã không phải'],
        ['khác', '{食|た}べています', '{食|た}べている', 'đang ăn'],
        ['khác', '{食|た}べることができます', '{食|た}べることができる', 'có thể ăn'],
        ['khác', '{食|た}べたことがあります', '{食|た}べたことがある', 'đã từng ăn'],
        ['khác', '{食|た}べたいです', '{食|た}べたい', 'muốn ăn'],
      ],
    },

    /* ── ポイント 108 ── */
    { t: 'h', text: 'ポイント 108 — Vた形 ことがあります (Đã từng V)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（N を／に／へ）Vた ことがあります。',
          vi: 'Nói **kinh nghiệm** — trong đời đã từng làm V (ít nhất một lần). Ghép **thể た + ことがあります**. Không nói thời điểm cụ thể.',
          examples: [
            { en: '{私|わたし}は{富士山|ふじさん}に{登|のぼ}ったことがあります。', ro: 'Watashi wa Fujisan ni nobotta koto ga arimasu.', vi: 'Tôi đã từng leo núi Phú Sĩ. (câu mẫu của sách)' },
            { en: '{日本|にほん}の{相撲|すもう}を{見|み}たことがあります。', ro: 'Nihon no sumou o mita koto ga arimasu.', vi: 'Tôi đã từng xem sumo Nhật.' },
            { en: '{京都|きょうと}のホテルに{泊|と}まったことがあります。', ro: 'Kyouto no hoteru ni tomatta koto ga arimasu.', vi: 'Tôi đã từng ở khách sạn ở Kyoto.' },
            { en: '{浴衣|ゆかた}を{着|き}たことがあります。', ro: 'Yukata o kita koto ga arimasu.', vi: 'Tôi đã từng mặc yukata.' },
          ],
        },
        {
          formula: '（{1回|いっかい}も）Vた ことがありません。',
          vi: 'Chưa từng. Thêm **{1回|いっかい}も** = "chưa lần nào" (nhấn mạnh).',
          examples: [
            { en: '{私|わたし}は{1回|いっかい}も{北海道|ほっかいどう}へ{行|い}ったことがありません。', ro: 'Watashi wa ikkai mo Hokkaidou e itta koto ga arimasen.', vi: 'Tôi chưa từng đến Hokkaido lần nào. (câu mẫu của sách)' },
            { en: 'ジェットコースターに{乗|の}ったことがありません。', ro: 'Jetto koosutaa ni notta koto ga arimasen.', vi: 'Tôi chưa từng đi tàu lượn siêu tốc.' },
          ],
        },
        {
          formula: 'Hỏi: Vた ことがありますか。 → はい、あります。／いいえ、ありません。',
          vi: 'Câu trả lời ngắn chỉ cần **あります／ありません** (không cần lặp lại cả câu). Muốn nói số lần: **{2回|にかい}あります**, **{何回|なんかい}もあります**, **{1回|いっかい}もありません**.',
          examples: [
            { en: 'A：{沖縄|おきなわ}へ{行|い}ったことがありますか。B：はい、あります。{去年|きょねん}{行|い}きました。', ro: 'A: Okinawa e itta koto ga arimasu ka. B: Hai, arimasu. Kyonen ikimashita.', vi: 'A: Bạn đã từng đi Okinawa chưa? B: Rồi. Tôi đi năm ngoái.' },
            { en: 'A：{相撲|すもう}を{見|み}たことがありますか。B：いいえ、{1回|いっかい}もありません。', ro: 'A: Sumou o mita koto ga arimasu ka. B: Iie, ikkai mo arimasen.', vi: 'A: Bạn đã từng xem sumo chưa? B: Chưa, chưa lần nào.' },
            { en: 'A：{何回|なんかい}{行|い}ったことがありますか。B：{3回|さんかい}あります。', ro: 'A: Nankai itta koto ga arimasu ka. B: Sankai arimasu.', vi: 'A: Bạn đã đi mấy lần rồi? B: 3 lần.' },
          ],
        },
        {
          formula: 'Hỏi tiếp chi tiết bằng quá khứ ～ました／～でした',
          vi: 'Sau khi biết người kia **đã từng**, hỏi chi tiết của **lần đó** thì dùng quá khứ thường: いつ{行|い}きましたか · どうでしたか · いくらでしたか · {何|なに}をしましたか.',
          examples: [
            { en: 'A：{飛行機|ひこうき}のチケットはいくらでしたか。B：{5万円|ごまんえん}くらいでした。', ro: 'A: Hikouki no chiketto wa ikura deshita ka. B: Gomanen kurai deshita.', vi: 'A: Vé máy bay bao nhiêu? B: Khoảng 50.000 yên.' },
            { en: 'A：{北海道|ほっかいどう}はどうでしたか。B：{寒|さむ}かったですが、{魚|さかな}がおいしかったです。', ro: 'A: Hokkaidou wa dou deshita ka. B: Samukatta desu ga, sakana ga oishikatta desu.', vi: 'A: Hokkaido thế nào? B: Lạnh nhưng cá ngon.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — ___たことがありますか → はい、あります／いいえ、ありません',
      head: ['Việc (thể ます)', 'Thể た', 'Câu hỏi', 'Trả lời'],
      rows: [
        ['{沖縄|おきなわ}へ{行|い}きます', '{行|い}った', '{沖縄|おきなわ}へ{行|い}ったことがありますか。', 'はい、あります。{先月|せんげつ}{行|い}きました。'],
        ['ふじまるランドで{遊|あそ}びます', '{遊|あそ}んだ', 'ふじまるランドで{遊|あそ}んだことがありますか。', 'いいえ、ありません。'],
        ['{富士山|ふじさん}に{登|のぼ}ります', '{登|のぼ}った', '{富士山|ふじさん}に{登|のぼ}ったことがありますか。', 'いいえ、{1回|いっかい}もありません。'],
        ['{相撲|すもう}を{見|み}ます', '{見|み}た', '{相撲|すもう}を{見|み}たことがありますか。', 'はい、{何回|なんかい}もあります。'],
        ['{京都|きょうと}のホテルに{泊|と}まります', '{泊|と}まった', '{京都|きょうと}のホテルに{泊|と}まったことがありますか。', 'はい、{2回|にかい}あります。'],
        ['{浴衣|ゆかた}を{着|き}ます', '{着|き}た', '{浴衣|ゆかた}を{着|き}たことがありますか。', 'はい、あります。'],
        ['{日本|にほん}でデートします', 'デートした', '{日本|にほん}でデートしたことがありますか。', 'いいえ、ありません。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — たことがあります',
      items: [
        'Chia sai thể た: ~~行きたことがあります~~ → **行ったことがあります**; ~~見ったこと~~ → **見たこと**; ~~登りたこと~~ → **登ったこと**.',
        'Dùng thể từ điển: {行|い}**く**ことがあります = "thỉnh thoảng có khi đi" (nghĩa khác, chưa học). Kinh nghiệm luôn là **thể た**.',
        'Có thời điểm cụ thể thì **không** dùng ことがあります: ~~先月沖縄へ行ったことがあります~~ → **先月沖縄へ行きました**. "Đã từng" = không nói lúc nào.',
        'Việc thường ngày ai cũng làm (ăn cơm, ngủ…) không nói ～たことがあります — chỉ dùng cho trải nghiệm đáng kể.',
        '{1回|いっかい}も + **ありません** (phủ định). ~~1回もあります~~ sai.',
      ],
    },

    /* ── ポイント 109 ── */
    { t: 'h', text: 'ポイント 109 — 普通形 ＋ N (Cả câu bổ nghĩa cho danh từ)' },
    {
      t: 'p',
      text: 'Tiếng Việt đặt phần bổ nghĩa **sau** danh từ: "quán **mà tôi hay đi**". Tiếng Nhật đặt **trước**, và phần đó là một câu **thể thường**: **{私|わたし}がよく{行|い}く{店|みせ}**. Bạn đã biết dạng ngắn (おいしい{店|みせ}, {静|しず}かな{町|まち}) — ポイント 109 cho phép đặt **cả một câu** vào chỗ đó.',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '［câu thể thường］ ＋ N',
          vi: 'Động từ ở thể thường (辞書形／ない／た／なかった／ている／ことができる…) đứng ngay trước danh từ. Không có です／ます ở giữa.',
          examples: [
            { en: 'これは{私|わたし}がよく{読|よ}む{雑誌|ざっし}です。', ro: 'Kore wa watashi ga yoku yomu zasshi desu.', vi: 'Đây là tạp chí tôi hay đọc. (câu mẫu của sách)' },
            { en: '{私|わたし}がよく{行|い}くレストランは{渋谷|しぶや}にあります。', ro: 'Watashi ga yoku iku resutoran wa Shibuya ni arimasu.', vi: 'Nhà hàng tôi hay đi ở Shibuya. (câu mẫu của sách)' },
            { en: '{今度|こんど}みんなで{飲|の}み{会|かい}をする{店|みせ}を{探|さが}しています。', ro: 'Kondo minna de nomikai o suru mise o sagashite imasu.', vi: 'Tôi đang tìm quán mà lần tới cả nhóm sẽ đi nhậu. (câu mẫu của sách)' },
            { en: '{昨日|きのう}{買|か}ったシャツはとても{安|やす}かったです。', ro: 'Kinou katta shatsu wa totemo yasukatta desu.', vi: 'Cái áo hôm qua tôi mua rất rẻ. (thể た + N)' },
            { en: '{新鮮|しんせん}な{魚料理|さかなりょうり}を{食|た}べることができる{居酒屋|いざかや}です。', ro: 'Shinsen na sakana ryouri o taberu koto ga dekiru izakaya desu.', vi: 'Là quán nhậu có thể ăn món cá tươi. (ことができる + N)' },
            { en: '{白|しろ}いシャツを{着|き}ている{人|ひと}は{誰|だれ}ですか。', ro: 'Shiroi shatsu o kite iru hito wa dare desu ka.', vi: 'Người đang mặc áo sơ mi trắng là ai? (ている + N)' },
            { en: '{行|い}ったことがない{場所|ばしょ}へ{行|い}きたいです。', ro: 'Itta koto ga nai basho e ikitai desu.', vi: 'Tôi muốn đi đến nơi chưa từng đi. (ことがない + N)' },
          ],
        },
        {
          formula: '［イA／ナAな／Nの］ ＋ N',
          vi: 'Tính từ, danh từ cũng có thể mang cả cụm phía trước: **{駅|えき}から{近|ちか}い**ホテル, **サービスがいい**ホテル, **{紅葉|こうよう}がきれいな**ところ, **{若|わか}い{人|ひと}に{人気|にんき}がある**{店|みせ}. ⚠ Trước danh từ: ナA giữ **な** (không phải だ); N nối bằng **の**.',
          examples: [
            { en: 'サービスがいいホテルを{知|し}っていますか。', ro: 'Saabisu ga ii hoteru o shitte imasu ka.', vi: 'Bạn biết khách sạn nào phục vụ tốt không?' },
            { en: '{紅葉|こうよう}がきれいなところはどこですか。', ro: 'Kouyou ga kirei na tokoro wa doko desu ka.', vi: 'Chỗ nào lá đỏ đẹp?' },
            { en: '{部屋|へや}から{海|うみ}が{見|み}えるホテルに{泊|と}まりたいです。', ro: 'Heya kara umi ga mieru hoteru ni tomaritai desu.', vi: 'Tôi muốn ở khách sạn mà từ phòng nhìn thấy biển.' },
            { en: '{京都|きょうと}の{有名|ゆうめい}なお{土産|みやげ}は{何|なん}ですか。', ro: 'Kyouto no yuumei na omiyage wa nan desu ka.', vi: 'Quà nổi tiếng của Kyoto là gì?' },
          ],
        },
        {
          formula: 'Chủ ngữ bên trong cụm: が (không dùng は)',
          vi: 'Người làm hành động **trong** cụm bổ nghĩa đi với **が**: {私|わたし}**が**よく{行|い}く{店|みせ}. は dành cho chủ đề của **cả câu lớn**: {私|わたし}がよく{行|い}く{店|みせ}**は**{新宿|しんじゅく}にあります.',
          examples: [
            { en: '{母|はは}が{作|つく}る{料理|りょうり}がいちばん{好|す}きです。', ro: 'Haha ga tsukuru ryouri ga ichiban suki desu.', vi: 'Tôi thích nhất món mẹ nấu.' },
            { en: 'パクさんが{好|す}きな{歌手|かしゅ}は{誰|だれ}ですか。', ro: 'Paku-san ga suki na kashu wa dare desu ka.', vi: 'Ca sĩ mà Park thích là ai?' },
          ],
        },
        {
          formula: 'Hỏi: どんな N ですか。 → ［câu thể thường］N です。',
          vi: 'Người nghe hỏi "là N thế nào?" → trả lời bằng một cụm bổ nghĩa. Đây là cách **giới thiệu** chính của Bài 13.',
          examples: [
            { en: 'A：もみじ{屋|や}はどんな{店|みせ}ですか。B：{新鮮|しんせん}な{魚料理|さかなりょうり}を{食|た}べることができる{居酒屋|いざかや}ですよ。', ro: 'A: Momijiya wa donna mise desu ka. B: Shinsen na sakana ryouri o taberu koto ga dekiru izakaya desu yo.', vi: 'A: Momijiya là quán thế nào? B: Là quán nhậu có thể ăn món cá tươi đấy.' },
            { en: 'A：{田中|たなか}レイはどの{人|ひと}ですか。B：{眼鏡|めがね}をかけている{人|ひと}です。', ro: 'A: Tanaka Rei wa dono hito desu ka. B: Megane o kakete iru hito desu.', vi: 'A: Tanaka Rei là người nào? B: Là người đang đeo kính.' },
            { en: 'A：パーティーでよくするゲームは{何|なん}ですか。B：しりとりをよくします。', ro: 'A: Paatii de yoku suru geemu wa nan desu ka. B: Shiritori o yoku shimasu.', vi: 'A: Trò chơi hay chơi ở tiệc là gì? B: Hay chơi nối chữ.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Một danh từ, nhiều cụm bổ nghĩa — {店|みせ} (quán, cửa hàng)',
      head: ['Dạng', 'Cụm bổ nghĩa + 店', 'Nghĩa'],
      rows: [
        ['V辞書形', '{私|わたし}がよく{行|い}く{店|みせ}', 'quán tôi hay đi'],
        ['Vない', '{誰|だれ}も{知|し}らない{店|みせ}', 'quán không ai biết'],
        ['Vた', '{先週|せんしゅう}{行|い}った{店|みせ}', 'quán tuần trước đã đi'],
        ['Vなかった', '{昨日|きのう}{行|い}かなかった{店|みせ}', 'quán hôm qua (mình) đã không đi'],
        ['Vている', '{安|やす}い{浴衣|ゆかた}を{売|う}っている{店|みせ}', 'quán đang bán yukata rẻ'],
        ['Vことができる', '{肉|にく}を{安|やす}く{買|か}うことができる{店|みせ}', 'quán có thể mua thịt rẻ'],
        ['Vたことがある', '{私|わたし}が{行|い}ったことがある{店|みせ}', 'quán tôi đã từng đi'],
        ['イA', '{電気製品|でんきせいひん}が{安|やす}い{店|みせ}', 'quán đồ điện rẻ'],
        ['イA (N に人気がある)', '{若|わか}い{人|ひと}に{人気|にんき}がある{店|みせ}', 'quán được giới trẻ thích'],
        ['ナA', '{料理|りょうり}が{有名|ゆうめい}な{店|みせ}', 'quán nổi tiếng về món ăn'],
        ['N の', '{駅|えき}の{前|まえ}の{店|みせ}', 'quán trước ga'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — Aは［___］Nです (giới thiệu một nơi)',
      head: ['Tên (A)', 'Cụm bổ nghĩa', 'N', 'Câu hoàn chỉnh'],
      rows: [
        ['キャンディ', 'かわいい{服|ふく}がたくさんある', '{店|みせ}', 'キャンディはかわいい{服|ふく}がたくさんある{店|みせ}です。'],
        ['サカイ{電器|でんき}', '{電気製品|でんきせいひん}が{安|やす}い', '{店|みせ}', 'サカイ{電器|でんき}は{電気製品|でんきせいひん}が{安|やす}い{店|みせ}です。'],
        ['ふじまるランド', '{日本一|にほんいち}{長|なが}いジェットコースターがある', '{遊園地|ゆうえんち}', 'ふじまるランドは{日本一|にほんいち}{長|なが}いジェットコースターがある{遊園地|ゆうえんち}です。'],
        ['ひかり{公園|こうえん}', 'バーベキューができる', '{公園|こうえん}', 'ひかり{公園|こうえん}はバーベキューができる{公園|こうえん}です。'],
        ['エトス', '{安|やす}い{浴衣|ゆかた}を{売|う}っている', '{店|みせ}', 'エトスは{安|やす}い{浴衣|ゆかた}を{売|う}っている{店|みせ}です。'],
        ['ロマン', 'お{菓子|かし}の{作|つく}り{方|かた}の{本|ほん}も{売|う}っている', '{店|みせ}', 'ロマンはお{菓子|かし}の{作|つく}り{方|かた}の{本|ほん}も{売|う}っている{店|みせ}です。'],
        ['わたなべ{音楽教室|おんがくきょうしつ}', '{駅|えき}から{近|ちか}い', '{教室|きょうしつ}', 'わたなべ{音楽教室|おんがくきょうしつ}は{駅|えき}から{近|ちか}い{教室|きょうしつ}です。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — 普通形＋N',
      items: [
        'Giữ thể lịch sự trước danh từ: ~~よく行きます店~~ → **よく行く店**; ~~食べることができます店~~ → **食べることができる店**.',
        'Dùng は trong cụm: ~~私はよく行く店は…~~ → **私が**よく行く店は….',
        'ナA thêm だ: ~~きれいだところ~~ → **きれいなところ**. N thêm だ: ~~学生だ人~~ → **学生の人**.',
        'Đặt cụm bổ nghĩa sau danh từ như tiếng Việt: ~~店 私がよく行く~~ → cụm **luôn đứng trước**.',
        'Câu dài: tìm danh từ **cuối cùng** trước は／が／を của câu lớn — mọi thứ đứng trước nó đều là phần bổ nghĩa. {私|わたし}がよく{行|い}く**レストラン**は{渋谷|しぶや}にあります → chủ đề là レストラン.',
      ],
    },

    /* ── ポイント 110 ── */
    { t: 'h', text: 'ポイント 110 — Vテ形 います (Đang mặc / đội / đeo — trạng thái)' },
    {
      t: 'p',
      text: '～ています bạn đã gặp nhiều lần: đang làm (Bài 7 — {食|た}べています), sống / làm việc (Bài 8 — {住|す}んでいます), chưa (Bài 10 — まだ～ていません), thói quen (Bài 11 — {毎朝|まいあさ}{飲|の}んでいます). Bài 13 thêm một nghĩa: **trạng thái sau khi đã mặc / đội / đeo** — "đang mặc" = trên người đang có cái áo đó, không phải đang xỏ tay vào áo.',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N（người）は［đồ］を［着て／はいて／かぶって／かけて／して］います。',
          vi: 'Tả trang phục của ai đó **bây giờ**. Chọn động từ theo bộ phận (bảng ở **Từ vựng · E**).',
          examples: [
            { en: '{西川|にしかわ}さんは{今日|きょう}、{黄色|きいろ}いシャツを{着|き}ています。', ro: 'Nishikawa-san wa kyou, kiiroi shatsu o kite imasu.', vi: 'Hôm nay anh Nishikawa mặc áo sơ mi vàng. (câu mẫu của sách)' },
            { en: 'パクさんは{赤|あか}いスカートをはいています。', ro: 'Paku-san wa akai sukaato o haite imasu.', vi: 'Park đang mặc váy đỏ.' },
            { en: 'マルコさんは{青|あお}い{帽子|ぼうし}をかぶっています。', ro: 'Maruko-san wa aoi boushi o kabutte imasu.', vi: 'Marco đang đội mũ xanh.' },
            { en: '{木村|きむら}さんは{眼鏡|めがね}をかけています。', ro: 'Kimura-san wa megane o kakete imasu.', vi: 'Chị Kimura đang đeo kính.' },
            { en: 'ダニエルさんはネクタイをしています。', ro: 'Danieru-san wa nekutai o shite imasu.', vi: 'Daniel đang đeo cà vạt.' },
          ],
        },
        {
          formula: '［đồ］を Vている 人 ＝ người đang mặc … (dùng để chỉ ra một người)',
          vi: 'Kết hợp với ポイント 109: dùng trang phục làm "nhãn" để chỉ người trong đám đông, trên TV, trong ảnh. Hỏi **どの{人|ひと}ですか** → đáp **～ている{人|ひと}です**.',
          examples: [
            { en: 'A：{山下|やました}ショウはどの{人|ひと}ですか。B：あの{人|ひと}です。{白|しろ}いシャツを{着|き}ている{人|ひと}です。', ro: 'A: Yamashita Shou wa dono hito desu ka. B: Ano hito desu. Shiroi shatsu o kite iru hito desu.', vi: 'A: Yamashita Shou là người nào? B: Người kia. Người đang mặc áo sơ mi trắng.' },
            { en: 'サングラスをかけている{男|おとこ}の{人|ひと}は{誰|だれ}ですか。', ro: 'Sangurasu o kakete iru otoko no hito wa dare desu ka.', vi: 'Người đàn ông đang đeo kính râm là ai?' },
            { en: '{帽子|ぼうし}をかぶっている{女|おんな}の{人|ひと}が{私|わたし}の{姉|あね}です。', ro: 'Boushi o kabutte iru onna no hito ga watashi no ane desu.', vi: 'Người phụ nữ đang đội mũ là chị gái tôi.' },
          ],
        },
        {
          formula: 'Hỏi – đáp: {何|なに}を{着|き}ていますか／{誰|だれ}が～ていますか',
          vi: 'Câu có tranh trong đề thi rất hay hỏi kiểu này. Trả lời đúng động từ + đúng trợ từ.',
          examples: [
            { en: 'A：アンナさんは{何|なに}を{着|き}ていますか。B：{青|あお}いシャツを{着|き}ています。', ro: 'A: Anna-san wa nani o kite imasu ka. B: Aoi shatsu o kite imasu.', vi: 'A: Anna đang mặc gì? B: Đang mặc áo xanh.' },
            { en: 'A：{誰|だれ}が{眼鏡|めがね}をかけていますか。B：{西川|にしかわ}さんがかけています。', ro: 'A: Dare ga megane o kakete imasu ka. B: Nishikawa-san ga kakete imasu.', vi: 'A: Ai đang đeo kính? B: Anh Nishikawa đang đeo.' },
            { en: 'A：ワンさんは{帽子|ぼうし}をかぶっていますか。B：いいえ、かぶっていません。', ro: 'A: Wan-san wa boushi o kabutte imasu ka. B: Iie, kabutte imasen.', vi: 'A: Wang có đội mũ không? B: Không, không đội.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — ___を___ている人です (chỉ người trên TV — 言ってみよう p.228)',
      head: ['Tên', 'Đồ', 'Động từ', 'Câu trả lời "どの人ですか"'],
      rows: [
        ['{山下|やました}ショウ', '{白|しろ}いシャツ', '{着|き}ています', '{白|しろ}いシャツを{着|き}ている{人|ひと}です。'],
        ['{中井|なかい}ごろう', '{帽子|ぼうし}', 'かぶっています', '{帽子|ぼうし}をかぶっている{人|ひと}です。'],
        ['{田中|たなか}レイ', '{眼鏡|めがね}', 'かけています', '{眼鏡|めがね}をかけている{人|ひと}です。'],
        ['{木村|きむら}あや', '{赤|あか}いスカート', 'はいています', '{赤|あか}いスカートをはいている{人|ひと}です。'],
        ['{松田|まつだ}ジュン', 'ネクタイ', 'しています', 'ネクタイをしている{人|ひと}です。'],
        ['—', 'サングラス', 'かけています', 'サングラスをかけている{人|ひと}です。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — ています (mặc)',
      items: [
        'Dùng một động từ cho mọi đồ: ~~帽子を着ています~~, ~~眼鏡を着ています~~ → **かぶっています**, **かけています**.',
        '"Hôm nay tôi mặc áo trắng" (đang trên người) → **{着|き}ています**, không phải ~~着ます~~ (= sẽ mặc / thường mặc).',
        '{着|き}ています (mặc) và {来|き}ています (đã đến, đang ở đây) viết kana giống nhau: きています — phân biệt bằng tân ngữ: シャツを**着**ています / {学校|がっこう}に**来**ています.',
        'Trả lời "không mặc" → **～ていません** (かぶっていません), không phải ~~かぶりません~~.',
      ],
    },

    /* ── ポイント 111 ── */
    { t: 'h', text: 'ポイント 111 — {知|し}っています／{知|し}りません (Biết / không biết)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N を {知|し}っていますか。 → はい、{知|し}っています。／いいえ、{知|し}りません。',
          vi: '{知|し}ります là động từ đặc biệt: **khẳng định** dùng dạng ～ています (**知っています**), còn **phủ định** dùng dạng ～ません (**知りません**). Không có ~~知っていません~~.',
          examples: [
            { en: 'おいしいパン{屋|や}を{知|し}っていますか。——はい、{知|し}っています。／いいえ、{知|し}りません。', ro: 'Oishii pan\'ya o shitte imasu ka. — Hai, shitte imasu. / Iie, shirimasen.', vi: 'Bạn có biết tiệm bánh mì nào ngon không? — Có, tôi biết. / Không, tôi không biết. (câu mẫu của sách)' },
            { en: '{木村|きむら}さんの{電話番号|でんわばんごう}を{知|し}っていますか。——いいえ、{知|し}りません。', ro: 'Kimura-san no denwa bangou o shitte imasu ka. — Iie, shirimasen.', vi: 'Bạn biết số điện thoại của chị Kimura không? — Không, tôi không biết.' },
            { en: 'この{歌手|かしゅ}を{知|し}っていますか。——ええ、よく{知|し}っていますよ。', ro: 'Kono kashu o shitte imasu ka. — Ee, yoku shitte imasu yo.', vi: 'Bạn biết ca sĩ này không? — Có, biết rõ luôn.' },
          ],
        },
        {
          formula: 'どこか／{何|なに}か ＋ いい N を {知|し}っていますか。',
          vi: 'Câu hỏi then chốt để **xin thông tin** (chủ đề 1, 3): "có biết chỗ nào / cái gì hay không?". Người trả lời thường giới thiệu luôn bằng という (ポイント 112).',
          examples: [
            { en: 'どこかいい{店|みせ}を{知|し}っていますか。——ええ、「わいわい」はどうですか。', ro: 'Dokoka ii mise o shitte imasu ka. — Ee, "Waiwai" wa dou desu ka.', vi: 'Bạn biết quán nào được không? — Có, quán "Waiwai" thì sao?' },
            { en: '{京都|きょうと}のおいしいレストランを{知|し}っていますか。——ええ、「{北山|きたやま}」というレストランがいいですよ。', ro: 'Kyouto no oishii resutoran o shitte imasu ka. — Ee, "Kitayama" to iu resutoran ga ii desu yo.', vi: 'Bạn biết nhà hàng nào ngon ở Kyoto không? — Có, nhà hàng "Kitayama" ngon đấy.' },
          ],
        },
        {
          formula: '{知|し}りました ＝ đã biết được (vừa mới biết)',
          vi: 'Dạng ～ました nghĩa là "(vào lúc đó) đã biết được, được biết": {雑誌|ざっし}でこの{店|みせ}を{知|し}りました = Tôi biết đến quán này qua tạp chí.',
          examples: [
            { en: 'インターネットでこのホテルを{知|し}りました。', ro: 'Intaanetto de kono hoteru o shirimashita.', vi: 'Tôi biết đến khách sạn này qua Internet.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — ___を知っていますか',
      head: ['Hỏi', 'Biết', 'Không biết'],
      rows: [
        ['サービスがいいホテルを{知|し}っていますか', 'ええ、ロイヤル・ホテルがいいですよ。', 'すみません、{知|し}りません。'],
        ['{京都|きょうと}の{有名|ゆうめい}なお{土産|みやげ}を{知|し}っていますか', 'ええ、{八|や}つ{橋|はし}というお{菓子|かし}が{有名|ゆうめい}ですよ。', 'いいえ、{知|し}りません。'],
        ['おいしいお{酒|さけ}を{知|し}っていますか', 'ええ、「{都|みやこ}」というお{酒|さけ}がおいしいですよ。', 'すみません、よく{知|し}りません。'],
        ['{紅葉|こうよう}がきれいなところを{知|し}っていますか', 'ええ、{清水寺|きよみずでら}というお{寺|てら}がきれいですよ。', 'いいえ、{知|し}りません。'],
        ['ワンさんの{住所|じゅうしょ}を{知|し}っていますか', 'はい、{知|し}っています。', 'いいえ、{知|し}りません。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — 知っています',
      items: [
        '~~知っていません~~ → **知りません**. ~~知ります~~ (dạng ます hiện tại) gần như không dùng để nói "tôi biết" → **知っています**.',
        '**知っています ↔ わかります**: biết thông tin (quán, người, số điện thoại) → 知っています; hiểu (câu hỏi, bài, ý) → わかります. ~~この問題を知っていますか~~ (hỏi có hiểu bài) → **わかりますか**.',
        'Trợ từ: N **を** {知|し}っています (không phải ~~が~~). "Tôi không biết" với người lạ: **すみません、ちょっとわかりません** cũng hay dùng khi bị hỏi đường.',
      ],
    },

    /* ── ポイント 112 ── */
    { t: 'h', text: 'ポイント 112 — N1 という N2 (N2 có tên là N1)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '「N1（tên riêng）」という N2（loại）',
          vi: 'Giới thiệu một **cái tên người nghe có thể chưa biết**: tên + という + đó là loại gì. "Quán **tên là** Kitayama", "bài hát **tên là** Sakura".',
          examples: [
            { en: 'これは「さくら」という{歌|うた}です。', ro: 'Kore wa "Sakura" to iu uta desu.', vi: 'Đây là bài hát tên "Sakura". (câu mẫu của sách)' },
            { en: '{北山|きたやま}というレストランがいいですよ。', ro: 'Kitayama to iu resutoran ga ii desu yo.', vi: 'Nhà hàng tên Kitayama ngon lắm.' },
            { en: '{八|や}つ{橋|はし}というお{菓子|かし}は{京都|きょうと}の{有名|ゆうめい}なお{土産|みやげ}です。', ro: 'Yatsuhashi to iu okashi wa Kyouto no yuumei na omiyage desu.', vi: 'Bánh tên Yatsuhashi là quà nổi tiếng của Kyoto.' },
            { en: '「ひかり」という{公園|こうえん}を{知|し}っていますか。', ro: '"Hikari" to iu kouen o shitte imasu ka.', vi: 'Bạn có biết công viên tên "Hikari" không?' },
          ],
        },
        {
          formula: 'Người nghe: N1？ (nhắc lại tên, lên giọng) → Người nói giải thích: N1 は ～ N2 です。',
          vi: 'Khi nghe tên lạ, người Nhật **nhắc lại cái tên với giọng hỏi** (sách in bằng hiragana: もみじや？, ぐれいと？) — đó là tín hiệu "tôi không biết, giải thích thêm đi". Người giới thiệu trả lời bằng câu ポイント 109.',
          examples: [
            { en: 'A：もみじ{屋|や}を{知|し}っていますか。B：もみじや？A：{新鮮|しんせん}な{魚料理|さかなりょうり}を{食|た}べることができる{居酒屋|いざかや}ですよ。', ro: 'A: Momijiya o shitte imasu ka. B: Momijiya? A: Shinsen na sakana ryouri o taberu koto ga dekiru izakaya desu yo.', vi: 'A: Bạn biết Momijiya không? B: Momijiya á? A: Là quán nhậu có thể ăn món cá tươi đấy.' },
            { en: 'A：このホテルのちゃんちゃん{焼|や}きという{料理|りょうり}はおいしいですよ。B：ちゃんちゃん{焼|や}き？', ro: 'A: Kono hoteru no chanchan\'yaki to iu ryouri wa oishii desu yo. B: Chanchan\'yaki?', vi: 'A: Món tên chanchan-yaki của khách sạn này ngon lắm. B: Chanchan-yaki á?' },
          ],
        },
        {
          formula: 'Hỏi tên: これは{何|なん}という N ですか。',
          vi: 'Hỏi "cái này tên là gì?" — dùng khi thấy một món ăn, bài hát, loài hoa lạ.',
          examples: [
            { en: 'A：これは{何|なん}という{料理|りょうり}ですか。B：お{好|この}み{焼|や}きです。', ro: 'A: Kore wa nan to iu ryouri desu ka. B: Okonomiyaki desu.', vi: 'A: Món này tên là gì? B: Okonomiyaki.' },
            { en: 'A：これは{何|なん}という{歌|うた}ですか。B：「ひまわり」という{歌|うた}です。', ro: 'A: Kore wa nan to iu uta desu ka. B: "Himawari" to iu uta desu.', vi: 'A: Bài này tên gì? B: Bài tên "Himawari".' },
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — という',
      items: [
        'Nhầm với の: {北山|きたやま}**の**レストラン = nhà hàng **của** (ông) Kitayama / ở Kitayama; {北山|きたやま}**という**レストラン = nhà hàng **tên là** Kitayama.',
        'Tên ai cũng biết thì không cần という: ~~東京という町~~ nghe như người nghe không biết Tokyo. Dùng という khi tên **lạ với người nghe**.',
        'Viết đúng: という (と + いう), đọc **to iu** — không phải ~~とゆう~~ khi viết (khi nói nghe giống "toyuu").',
      ],
    },

    /* ── Tổng kết ── */
    { t: 'h', text: 'Tổng kết — câu hỏi của Bài 13 và cách trả lời' },
    {
      t: 'table',
      head: ['Câu hỏi', 'Dùng khi', 'Trả lời mẫu', 'ポイント'],
      rows: [
        ['～たことがありますか。', 'Hỏi kinh nghiệm', 'はい、あります。／いいえ、{1回|いっかい}もありません。', '108'],
        ['{何回|なんかい}～たことがありますか。', 'Hỏi số lần', '{2回|にかい}あります。／{何回|なんかい}もあります。', '108'],
        ['～はどうでしたか。／いくらでしたか。', 'Hỏi chi tiết lần đó', '～かったです。／～くらいでした。', '108'],
        ['どんな N ですか。', 'Hỏi là N thế nào', '［câu thể thường］N です。', '109'],
        ['どの{人|ひと}ですか。', 'Chỉ người', '～を～ている{人|ひと}です。', '109, 110'],
        ['{何|なに}を{着|き}ていますか。', 'Hỏi trang phục', '～を{着|き}て／はいて／かぶって／かけています。', '110'],
        ['（どこか）いい N を{知|し}っていますか。', 'Xin thông tin', 'ええ、「～」という N がいいですよ。／いいえ、{知|し}りません。', '111, 112'],
        ['N1？', 'Nghe tên lạ', 'N1 は［～］N2 です。', '112, 109'],
        ['これは{何|なん}という N ですか。', 'Hỏi tên', '「～」という N です。', '112'],
      ],
    },
    {
      t: 'build',
      id: 'b13-np-ghep',
      title: 'Ghép câu — dùng đủ 5 điểm ngữ pháp',
      items: [
        { vi: 'Tôi đã từng leo núi Phú Sĩ.', chips: ['{富士山|ふじさん}に', '{登|のぼ}った', 'ことが', 'あります', '{登|のぼ}る', 'を'], answer: ['{富士山|ふじさん}に', '{登|のぼ}った', 'ことが', 'あります'], ro: 'Fujisan ni nobotta koto ga arimasu.' },
        { vi: 'Tôi chưa từng đi Hokkaido lần nào.', chips: ['{1回|いっかい}も', '{北海道|ほっかいどう}へ', '{行|い}った', 'ことが', 'ありません', 'あります', '{行|い}き'], answer: ['{1回|いっかい}も', '{北海道|ほっかいどう}へ', '{行|い}った', 'ことが', 'ありません'], ro: 'Ikkai mo Hokkaidou e itta koto ga arimasen.' },
        { vi: 'Bạn đã từng xem sumo chưa?', chips: ['{相撲|すもう}を', '{見|み}た', 'ことが', 'ありますか', '{見|み}ます', 'に'], answer: ['{相撲|すもう}を', '{見|み}た', 'ことが', 'ありますか'], ro: 'Sumou o mita koto ga arimasu ka.' },
        { vi: 'Đây là tạp chí tôi hay đọc.', chips: ['これは', '{私|わたし}が', 'よく', '{読|よ}む', '{雑誌|ざっし}です', '{読|よ}みます', '{私|わたし}は'], answer: ['これは', '{私|わたし}が', 'よく', '{読|よ}む', '{雑誌|ざっし}です'], ro: 'Kore wa watashi ga yoku yomu zasshi desu.' },
        { vi: 'Tôi đang tìm quán để cả nhóm đi nhậu.', chips: ['みんなで', '{飲|の}み{会|かい}を', 'する', '{店|みせ}を', '{探|さが}しています', 'します', '{店|みせ}に'], answer: ['みんなで', '{飲|の}み{会|かい}を', 'する', '{店|みせ}を', '{探|さが}しています'], ro: 'Minna de nomikai o suru mise o sagashite imasu.' },
        { vi: 'Là quán nhậu có thể ăn món cá tươi.', chips: ['{新鮮|しんせん}な', '{魚料理|さかなりょうり}を', '{食|た}べる', 'ことができる', '{居酒屋|いざかや}です', 'ことができます', '{新鮮|しんせん}だ'], answer: ['{新鮮|しんせん}な', '{魚料理|さかなりょうり}を', '{食|た}べる', 'ことができる', '{居酒屋|いざかや}です'], ro: 'Shinsen na sakana ryouri o taberu koto ga dekiru izakaya desu.' },
        { vi: 'Là cửa hàng được giới trẻ yêu thích.', chips: ['{若|わか}い', '{人|ひと}に', '{人気|にんき}が', 'ある', '{店|みせ}です', 'あります', '{人|ひと}を'], answer: ['{若|わか}い', '{人|ひと}に', '{人気|にんき}が', 'ある', '{店|みせ}です'], ro: 'Wakai hito ni ninki ga aru mise desu.' },
        { vi: 'Hôm nay anh Nishikawa mặc áo sơ mi vàng.', chips: ['{西川|にしかわ}さんは', '{今日|きょう}、', '{黄色|きいろ}い', 'シャツを', '{着|き}ています', 'はいています', 'かぶっています'], answer: ['{西川|にしかわ}さんは', '{今日|きょう}、', '{黄色|きいろ}い', 'シャツを', '{着|き}ています'], ro: 'Nishikawa-san wa kyou, kiiroi shatsu o kite imasu.' },
        { vi: 'Là người đang đội mũ đỏ.', chips: ['{赤|あか}い', '{帽子|ぼうし}を', 'かぶっている', '{人|ひと}です', 'かけている', '{着|き}ている'], answer: ['{赤|あか}い', '{帽子|ぼうし}を', 'かぶっている', '{人|ひと}です'], ro: 'Akai boushi o kabutte iru hito desu.' },
        { vi: 'Người đàn ông đang đeo kính là ai?', chips: ['{眼鏡|めがね}を', 'かけている', '{男|おとこ}の{人|ひと}は', '{誰|だれ}ですか', 'かぶっている', '{着|き}ている'], answer: ['{眼鏡|めがね}を', 'かけている', '{男|おとこ}の{人|ひと}は', '{誰|だれ}ですか'], ro: 'Megane o kakete iru otoko no hito wa dare desu ka.' },
        { vi: 'Bạn có biết quán nào (ở đâu đó) được không?', chips: ['どこか', 'いい', '{店|みせ}を', '{知|し}っていますか', '{知|し}りますか', 'どこ'], answer: ['どこか', 'いい', '{店|みせ}を', '{知|し}っていますか'], ro: 'Dokoka ii mise o shitte imasu ka.' },
        { vi: 'Không, tôi không biết.', chips: ['いいえ、', '{知|し}りません', '{知|し}っていません', '{知|し}りませんでした'], answer: ['いいえ、', '{知|し}りません'], ro: 'Iie, shirimasen.' },
        { vi: 'Nhà hàng tên Kitayama ngon lắm.', chips: ['{北山|きたやま}', 'という', 'レストランが', 'いいですよ', 'の', 'レストランを'], answer: ['{北山|きたやま}', 'という', 'レストランが', 'いいですよ'], ro: 'Kitayama to iu resutoran ga ii desu yo.' },
        { vi: 'Món này tên là gì?', chips: ['これは', '{何|なん}という', '{料理|りょうり}ですか', '{何|なん}の', 'どんな'], answer: ['これは', '{何|なん}という', '{料理|りょうり}ですか'], ro: 'Kore wa nan to iu ryouri desu ka.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b13-np-kiem',
      title: 'Kiểm tra nhanh ngữ pháp Bài 13',
      items: [
        { q: 'Thể た của {行|い}きます là:', options: ['{行|い}きた', '{行|い}いた', '{行|い}った', '{行|い}んだ'], correct: 2, why: 'Ngoại lệ: {行|い}きます → **{行|い}った**.' },
        { q: '"Tôi đã từng mặc yukata":', options: ['{浴衣|ゆかた}を{着|き}ることがあります。', '{浴衣|ゆかた}を{着|き}たことがあります。', '{浴衣|ゆかた}を{着|き}ましたことがあります。', '{浴衣|ゆかた}を{着|き}てことがあります。'], correct: 1, why: 'Kinh nghiệm = **thể た** + ことがあります (ポイント 108).' },
        { q: '「{沖縄|おきなわ}へ{行|い}ったことがありますか。」 — chưa lần nào:', options: ['いいえ、{1回|いっかい}もありません。', 'いいえ、{1回|いっかい}もあります。', 'いいえ、{行|い}きません。', 'いいえ、{何回|なんかい}もありません。'], correct: 0, why: '**{1回|いっかい}も** + phủ định.' },
        { q: '"Quán mà tôi hay đi":', options: ['{私|わたし}はよく{行|い}く{店|みせ}', '{私|わたし}がよく{行|い}きます{店|みせ}', '{私|わたし}がよく{行|い}く{店|みせ}', '{店|みせ}{私|わたし}がよく{行|い}く'], correct: 2, why: 'Thể thường + N, chủ ngữ trong cụm dùng **が** (ポイント 109).' },
        { q: '「{紅葉|こうよう}が＿ところはどこですか。」', options: ['きれい', 'きれいだ', 'きれいな', 'きれいの'], correct: 2, why: 'ナA trước danh từ giữ **な**.' },
        { q: '"Người đang đội mũ":', options: ['{帽子|ぼうし}を{着|き}ている{人|ひと}', '{帽子|ぼうし}をかぶっている{人|ひと}', '{帽子|ぼうし}をかけている{人|ひと}', '{帽子|ぼうし}をはいている{人|ひと}'], correct: 1, why: 'Đồ đội đầu → **かぶります** (ポイント 110).' },
        { q: '"Người đang đeo kính":', options: ['{眼鏡|めがね}をかけている{人|ひと}', '{眼鏡|めがね}をしている{人|ひと}', '{眼鏡|めがね}を{着|き}ている{人|ひと}', '{眼鏡|めがね}をかぶっている{人|ひと}'], correct: 0, why: 'Kính → **かけます**.' },
        { q: '"Park đang mặc váy xanh":', options: ['パクさんは{青|あお}いスカートを{着|き}ています。', 'パクさんは{青|あお}いスカートをはいています。', 'パクさんは{青|あお}いスカートをしています。', 'パクさんは{青|あお}いスカートをはきます。'], correct: 1, why: 'Đồ phần dưới → **はきます**, và đang mặc → **ています**.' },
        { q: '「この{店|みせ}を{知|し}っていますか。」 — không biết:', options: ['いいえ、{知|し}っていません。', 'いいえ、{知|し}りません。', 'いいえ、わかりませんでした。', 'いいえ、{知|し}りませんでした。'], correct: 1, why: 'Phủ định = **{知|し}りません** (ポイント 111).' },
        { q: '"Nhà hàng tên là Kitayama":', options: ['{北山|きたやま}のレストラン', '{北山|きたやま}というレストラン', '{北山|きたやま}なレストラン', 'レストランという{北山|きたやま}'], correct: 1, why: 'Tên + **という** + loại (ポイント 112).' },
        { q: 'Bạn nghe tên lạ 「ぐれいと」. Bạn nói:', options: ['ぐれいと？', 'ぐれいとですね。わかりました。', 'ぐれいとを{知|し}っています。', 'はい、そうです。'], correct: 0, why: 'Nhắc lại tên, lên giọng → người kia sẽ giải thích.' },
        { q: '"Món này tên là gì?":', options: ['これは{何|なん}の{料理|りょうり}ですか。', 'これは{何|なん}という{料理|りょうり}ですか。', 'これはどんな{料理|りょうり}ですか。', 'これは{何|なに}が{料理|りょうり}ですか。'], correct: 1, why: 'Hỏi tên → **{何|なん}という** N ですか.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const KANJI: Lesson = {
  id: 'b13-kanji',
  kind: 'kanji',
  title: 'Chữ Hán — trong từ vựng Bài 13',
  goal: 'Nhận mặt và đọc đúng mọi chữ Hán trong 40 từ của Bài 13 (kinh nghiệm, cửa hàng, quần áo, màu sắc, chuẩn bị tiệc), đọc được câu không furigana như đề thi, và viết tay được các chữ ✍ hay gặp.',
  minutes: 35,
  blocks: [
    {
      t: 'p',
      text: 'Phần Reading của đề thi có **4 từ chữ Hán gạch chân, KHÔNG furigana (12 điểm)** — đó là chỗ nhiều bạn mất điểm. Học theo **cả từ** ({遊園地|ゆうえんち}, {電気製品|でんきせいひん}) chứ đừng học chữ rời. **Âm On** (音, gốc Hán) thường dùng khi hai chữ Hán đứng cạnh nhau; **âm Kun** (訓, âm Nhật) khi chữ đứng một mình hoặc có đuôi kana ({店|みせ}, {売|う}ります). Bài này có nhiều từ **đọc cả cụm** (熟字訓): {眼鏡|めがね}, {相撲|すもう}, {浴衣|ゆかた} — không ghép từ âm từng chữ. Cột **Mức**: 👁 **nhận mặt** = đọc và hiểu là đủ (ưu tiên cho phần đọc); ✍ **nên viết** = ít nét, gặp rất nhiều, nên tập viết tay.',
    },
    {
      t: 'table',
      caption: '1. Kinh nghiệm, số lần, người',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài', 'Mức'],
      rows: [
        ['一', 'イチ・イッ', 'ひと(つ)', 'NHẤT (một)', '{1回|いっかい}も (viết số: 1回)', '✍'],
        ['回', 'カイ', 'まわ(る)', 'HỒI (lần; quay)', '{1回|いっかい}も · {何回|なんかい}も', '✍'],
        ['何', 'カ', 'なに・なん', 'HÀ (gì)', '{何回|なんかい}も', '✍'],
        ['知', 'チ', 'し(る)', 'TRI (biết)', '{知|し}ります', '✍'],
        ['男', 'ダン・ナン', 'おとこ', 'NAM (đàn ông)', '{男|おとこ}の{人|ひと}', '✍'],
        ['女', 'ジョ・ニョ', 'おんな', 'NỮ (phụ nữ)', '{女|おんな}の{人|ひと}', '✍'],
        ['人', 'ジン・ニン', 'ひと', 'NHÂN (người)', '{男|おとこ}の{人|ひと} · {人気|にんき} (ニン)', '✍'],
        ['相', 'ソウ', 'あい', 'TƯƠNG (cùng nhau)', '{相撲|すもう} (đọc cả cụm)', '👁'],
        ['撲', 'ボク', '—', 'PHÁC (đánh)', '{相撲|すもう} (đọc cả cụm)', '👁'],
        ['紅', 'コウ', 'べに', 'HỒNG (đỏ thắm)', '{紅葉|こうよう}', '👁'],
        ['葉', 'ヨウ', 'は', 'DIỆP (lá)', '{紅葉|こうよう}', '👁'],
      ],
    },
    {
      t: 'table',
      caption: '2. Cửa hàng, nơi chơi, đồ vật, động từ',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài', 'Mức'],
      rows: [
        ['店', 'テン', 'みせ', 'ĐIẾM (tiệm)', '（お）{店|みせ}', '✍'],
        ['気', 'キ・ケ', '—', 'KHÍ', '{人気|にんき} · {電気製品|でんきせいひん}', '✍'],
        ['地', 'チ・ジ', '—', 'ĐỊA (đất)', '{遊園地|ゆうえんち}', '✍'],
        ['子', 'シ・ス', 'こ', 'TỬ (con)', '{帽子|ぼうし} (シ)', '✍'],
        ['遊', 'ユウ', 'あそ(ぶ)', 'DU (chơi)', '{遊園地|ゆうえんち}', '👁'],
        ['園', 'エン', 'その', 'VIÊN (vườn)', '{遊園地|ゆうえんち}', '👁'],
        ['電', 'デン', '—', 'ĐIỆN', '{電気製品|でんきせいひん}', '👁'],
        ['製', 'セイ', '—', 'CHẾ (chế tạo)', '{電気製品|でんきせいひん}', '👁'],
        ['品', 'ヒン', 'しな', 'PHẨM (hàng hoá)', '{電気製品|でんきせいひん} (ヒン)', '👁'],
        ['眼', 'ガン', 'め', 'NHÃN (mắt)', '{眼鏡|めがね} (đọc cả cụm)', '👁'],
        ['鏡', 'キョウ', 'かがみ', 'KÍNH (gương)', '{眼鏡|めがね} (đọc cả cụm)', '👁'],
        ['帽', 'ボウ', '—', 'MẠO (mũ)', '{帽子|ぼうし}', '👁'],
        ['売', 'バイ', 'う(る)', 'MẠI (bán)', '{売|う}ります', '👁'],
        ['泊', 'ハク', 'と(まる)', 'BẠC (trọ lại)', '{泊|と}まります', '👁'],
        ['着', 'チャク', 'き(る)・つ(く)', 'TRƯỚC (mặc; đến nơi)', '{着|き}ます', '👁'],
      ],
    },
    {
      t: 'table',
      caption: '3. Màu sắc, tính chất',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài', 'Mức'],
      rows: [
        ['青', 'セイ', 'あお(い)', 'THANH (xanh)', '{青|あお}い', '✍'],
        ['赤', 'セキ', 'あか(い)', 'XÍCH (đỏ)', '{赤|あか}い', '✍'],
        ['色', 'ショク・シキ', 'いろ', 'SẮC (màu)', '{黄色|きいろ}い', '✍'],
        ['新', 'シン', 'あたら(しい)', 'TÂN (mới)', '{新鮮|しんせん}', '✍'],
        ['黄', 'コウ・オウ', 'き', 'HOÀNG (vàng)', '{黄色|きいろ}い', '👁'],
        ['若', 'ジャク', 'わか(い)', 'NHƯỢC (trẻ)', '{若|わか}い', '👁'],
        ['鮮', 'セン', 'あざ(やか)', 'TIÊN (tươi)', '{新鮮|しんせん}', '👁'],
      ],
    },
    {
      t: 'table',
      caption: '4. Chuẩn bị, luyện tập',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài', 'Mức'],
      rows: [
        ['材', 'ザイ', '—', 'TÀI (vật liệu)', '{材料|ざいりょう}', '👁'],
        ['料', 'リョウ', '—', 'LIỆU (nguyên liệu; phí)', '{材料|ざいりょう} · {料理|りょうり}', '👁'],
        ['場', 'ジョウ', 'ば', 'TRƯỜNG (chỗ)', '{場所|ばしょ} (ば — Kun)', '👁'],
        ['所', 'ショ', 'ところ', 'SỞ (nơi)', '{場所|ばしょ} (しょ — On)', '👁'],
        ['浴', 'ヨク', 'あ(びる)', 'DỤC (tắm)', '{浴衣|ゆかた} (đọc cả cụm)', '👁'],
        ['衣', 'イ', 'ころも', 'Y (áo)', '{浴衣|ゆかた} (đọc cả cụm)', '👁'],
        ['練', 'レン', 'ね(る)', 'LUYỆN', '{練習|れんしゅう}', '👁'],
        ['習', 'シュウ', 'なら(う)', 'TẬP (học)', '{練習|れんしゅう}', '👁'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ',
      items: [
        '**Hán Việt đoán nghĩa**: 遊園地 = DU VIÊN ĐỊA (đất vườn để chơi = công viên giải trí), 電気製品 = ĐIỆN KHÍ CHẾ PHẨM (sản phẩm chạy điện), 新鮮 = TÂN TIÊN (mới tươi), 材料 = TÀI LIỆU (nguyên liệu, không phải "tài liệu" giấy tờ!), 練習 = LUYỆN TẬP, 人気 = NHÂN KHÍ (được lòng người), 紅葉 = HỒNG DIỆP (lá đỏ).',
        '**男 = 田 + 力**: người dùng **sức** (力) làm **ruộng** (田) → đàn ông. **女** — hình người phụ nữ quỳ.',
        '**青 / 赤 / 黄色**: ba màu của bài; 黄 + 色 = きいろ (màu vàng), thêm い thành tính từ 黄色い.',
        '**Đọc cả cụm (熟字訓)**: {眼鏡|めがね} (~~がんきょう~~), {相撲|すもう} (~~そうぼく~~), {浴衣|ゆかた} (~~よくい~~) — nhìn cả khối chữ là đọc luôn.',
        '**場所 = ば + しょ**: chữ đầu Kun, chữ sau On (ghép lai Kun + On, gọi là 湯桶読み). Học theo từ, đừng cố suy.',
      ],
    },

    /* ── Đứng riêng hay đứng chung ── */
    { t: 'h', text: 'Đứng riêng hay đứng chung — một chữ, hai cách đọc' },
    {
      t: 'p',
      text: 'Cùng một chữ Hán, **đứng riêng** (thường có đuôi kana) thì đọc âm **Kun**; **ghép với chữ Hán khác** thì thường đọc âm **On**. Bảng dưới đây lấy chữ của Bài 13, cột phải là những từ ghép bạn sẽ gặp rất sớm (nhiều từ đã học ở bài trước) — đọc qua để khi gặp chữ quen trong từ lạ vẫn đoán được âm.',
    },
    {
      t: 'table',
      caption: 'Kun khi đứng riêng ↔ On trong từ ghép',
      head: ['Chữ', 'Đứng riêng (Kun)', 'Trong từ ghép (On)'],
      rows: [
        ['知', '{知|し}ります — biết', '{知人|ちじん} — người quen'],
        ['回', '{回|まわ}ります — quay, đi vòng', '{1回|いっかい} — một lần · {今回|こんかい} — lần này'],
        ['何', '{何|なに}・{何|なん} — cái gì', '{何回|なんかい} · {何人|なんにん} — 何 hầu như luôn đọc Kun なに／なん, kể cả trong từ ghép'],
        ['男', '{男|おとこ} — đàn ông', '{男性|だんせい} — nam giới · {長男|ちょうなん} — con trai cả'],
        ['女', '{女|おんな} — phụ nữ', '{女性|じょせい} — nữ giới · {彼女|かのじょ} — cô ấy, bạn gái'],
        ['人', '{人|ひと} — người', '{日本人|にほんじん} — người Nhật (ジン) · {3人|さんにん} (ニン) · {人気|にんき}'],
        ['店', '{店|みせ} — cửa hàng', '{喫茶店|きっさてん} — quán cà phê (B10) · {店員|てんいん} — nhân viên cửa hàng'],
        ['遊', '{遊|あそ}びます — chơi', '{遊園地|ゆうえんち} — công viên giải trí'],
        ['園', '{園|その} — khu vườn (ít dùng)', '{公園|こうえん} — công viên · {動物園|どうぶつえん} (B10) · {遊園地|ゆうえんち}'],
        ['気', '— (hầu như không đứng riêng)', '{元気|げんき} · {天気|てんき} · {人気|にんき} · {電気|でんき}'],
        ['電', '—', '{電話|でんわ} · {電車|でんしゃ} · {電気|でんき}'],
        ['品', '{品|しな} — hàng hoá', '{製品|せいひん} — sản phẩm · {食品|しょくひん} — thực phẩm'],
        ['子', '{子|こ}ども — trẻ em', '{帽子|ぼうし} — mũ (シ) · {椅子|いす} — ghế (ス)'],
        ['売', '{売|う}ります — bán', '{売店|ばいてん} — quầy bán hàng (ở ga)'],
        ['泊', '{泊|と}まります — trọ lại', '{1泊|いっぱく} — một đêm (khách sạn) (ハク → **ぱく**)'],
        ['着', '{着|き}ます — mặc', '{到着|とうちゃく} — đến nơi (biển ở sân bay) · {着物|きもの} (Kun + Kun)'],
        ['青', '{青|あお}い — xanh', '{青春|せいしゅん} — tuổi xuân (bài đọc của sách: 青春18きっぷ)'],
        ['赤', '{赤|あか}い — đỏ', '{赤道|せきどう} — xích đạo · {赤|あか}ちゃん — em bé (Kun)'],
        ['色', '{色|いろ} — màu', '{景色|けしき} — phong cảnh (シキ, đọc đặc biệt け)'],
        ['新', '{新|あたら}しい — mới', '{新聞|しんぶん} — báo · {新幹線|しんかんせん} · {新鮮|しんせん}'],
        ['若', '{若|わか}い — trẻ', '{若者|わかもの} — giới trẻ (Kun + Kun)'],
        ['葉', '{葉|は} — lá', '{紅葉|こうよう} — lá đỏ · {言葉|ことば} — từ ngữ (Kun, ば)'],
        ['場', '{場所|ばしょ}・{広場|ひろば} (ば)', '{会場|かいじょう} — hội trường · {駐車場|ちゅうしゃじょう} — bãi đỗ xe'],
        ['所', '{所|ところ} — nơi, chỗ', '{住所|じゅうしょ} — địa chỉ · {場所|ばしょ} · {台所|だいどころ} — bếp'],
        ['習', '{習|なら}います — học (từ ai)', '{練習|れんしゅう} — luyện tập · {予習|よしゅう} — chuẩn bị bài · {復習|ふくしゅう} — ôn bài'],
        ['料', '—', '{料理|りょうり} — món ăn · {材料|ざいりょう} · {料金|りょうきん} — phí'],
      ],
    },
    {
      t: 'note',
      title: 'Cách đọc bất quy tắc hay gặp',
      items: [
        '**Đọc cả cụm (熟字訓)**: {眼鏡|めがね}, {相撲|すもう}, {浴衣|ゆかた}, {景色|けしき}, {今日|きょう}, {上手|じょうず}, お{土産|みやげ} (B10).',
        '**Biến âm っ／ぱ** khi ghép số: {1回|いっかい}, {6回|ろっかい}, {10回|じゅっかい}; {1泊|いっぱく}. Cùng quy luật với {1本|いっぽん}, {1杯|いっぱい} (Bài 9).',
        '**Một chữ nhiều âm On**: 人 = ジン ({日本人|にほんじん}) / ニン ({人気|にんき}, {3人|さんにん}); 気 = キ ({元気|げんき}) / ケ ({気配|けはい}, hiếm); 色 = ショク / シキ ({景色|けしき}).',
        '**Đừng nhầm hình**: 着 (mặc) ↔ 看 (xem, không học ở đây) · 青 (xanh) ↔ 晴 (nắng, có 日 bên trái) · 泊 (trọ) ↔ 白 (trắng, bên phải chữ 泊 chính là 白).',
      ],
    },

    {
      t: 'mcq',
      id: 'b13-kj-doc',
      title: 'Đọc chữ Hán — chọn cách đọc đúng',
      items: [
        { q: '紅葉', options: ['こうよう', 'こうは', 'べには', 'くれは'], correct: 0, why: '紅 コウ + 葉 ヨウ = **こうよう**.' },
        { q: '相撲', options: ['そうぼく', 'すもう', 'あいぼく', 'すうもう'], correct: 1, why: 'Đọc cả cụm: **すもう**.' },
        { q: '知っています', options: ['ちっています', 'しっています', 'しりっています', 'わかっています'], correct: 1, why: '知 し + って = **しっています**.' },
        { q: '何回も', options: ['なにかいも', 'なんかいも', 'なんまわりも', 'かかいも'], correct: 1, why: '**なんかいも** — nhiều lần.' },
        { q: '1回も', options: ['いちかいも', 'いっかいも', 'ひとかいも', 'いっかいもう'], correct: 1, why: 'いち + かい → **いっかい**.' },
        { q: '女の人', options: ['おとこのひと', 'おんなのひと', 'じょのひと', 'おんなのにん'], correct: 1, why: '**おんなのひと** — người phụ nữ.' },
        { q: '遊園地', options: ['ゆうえんち', 'ゆうえんじ', 'あそえんち', 'ゆえんち'], correct: 0, why: '**ゆうえんち** — trường âm ゆう.' },
        { q: '電気製品', options: ['でんきせいひん', 'でんきせいしな', 'でんけせいひん', 'でんきせひん'], correct: 0, why: '**でんきせいひん**.' },
        { q: '眼鏡', options: ['がんきょう', 'めかがみ', 'めがね', 'がんかがみ'], correct: 2, why: 'Đọc cả cụm: **めがね**.' },
        { q: '帽子', options: ['ぼうこ', 'ぼうし', 'ぼし', 'もうし'], correct: 1, why: '**ぼうし** (子 đọc シ).' },
        { q: '人気', options: ['ひとけ', 'じんき', 'にんき', 'ひとき'], correct: 2, why: 'Được yêu thích = **にんき**.' },
        { q: '売ります', options: ['かいます', 'うります', 'ばいります', 'とります'], correct: 1, why: '**うります** — bán (↔ 買います かいます).' },
        { q: '泊まります', options: ['とまります', 'しろまります', 'はくまります', 'とめます'], correct: 0, why: '**とまります** — trọ lại.' },
        { q: '着ます (mặc)', options: ['つきます', 'きます', 'ちゃくます', 'ぎます'], correct: 1, why: '**きます** — cùng âm với 来ます.' },
        { q: '黄色い', options: ['こういろい', 'きいろい', 'おういろい', 'きしょくい'], correct: 1, why: '黄 き + 色 いろ + い = **きいろい**.' },
        { q: '若い', options: ['わかい', 'じゃくい', 'にがい', 'わるい'], correct: 0, why: '**わかい** — trẻ.' },
        { q: '新鮮', options: ['しんせん', 'あたらせん', 'しんぜん', 'しんさん'], correct: 0, why: '**しんせん** — tươi.' },
        { q: '材料', options: ['ざいりょう', 'さいりょう', 'ざいりょ', 'ざいりよう'], correct: 0, why: '**ざいりょう** — nguyên liệu (trường âm りょう).' },
        { q: '場所', options: ['じょうしょ', 'ばしょ', 'ばところ', 'ばじょ'], correct: 1, why: 'ば (Kun) + しょ (On) = **ばしょ**.' },
        { q: '浴衣', options: ['よくい', 'ゆかた', 'よくころも', 'ゆうかた'], correct: 1, why: 'Đọc cả cụm: **ゆかた**.' },
        { q: '練習', options: ['れんしゅう', 'れんしゅ', 'ねんしゅう', 'れんならい'], correct: 0, why: '**れんしゅう** — luyện tập.' },
        { q: '青い', options: ['あかい', 'あおい', 'せいい', 'しろい'], correct: 1, why: '**あおい** — xanh. (赤い あかい — đỏ)' },
      ],
    },

    /* ── Đọc không furigana ── */
    { t: 'h', text: 'Từ chữ Hán hay gặp trong đề đọc — đọc KHÔNG furigana' },
    {
      t: 'p',
      text: 'Đề thi in chữ Hán **trần**, không có chữ nhỏ bên trên. Mỗi câu dưới đây hiện chữ Hán không furigana: đọc to cả câu → bấm hiện cách đọc + nghe → tự chấm. Chưa đọc được từ nào thì quay lại bảng chữ ở trên.',
    },
    {
      t: 'readkanji',
      id: 'b13-doc-kanji',
      title: 'Đọc to từng câu — chữ Hán Bài 13',
      note: 'Mỗi câu có ít nhất một từ chữ Hán của Bài 13. Chỗ hay sai: 眼鏡 めがね, 相撲 すもう, 浴衣 ゆかた, 人気 にんき, 1回 いっかい, 場所 ばしょ, 着ています きています.',
      items: [
        { text: 'きょうとの{紅葉|こうよう}をみたことがありますか。', ro: 'Kyouto no kouyou o mita koto ga arimasu ka.', vi: 'Bạn đã từng ngắm lá đỏ ở Kyoto chưa?' },
        { text: 'このホテルはサービスがいいです。', ro: 'Kono hoteru wa saabisu ga ii desu.', vi: 'Khách sạn này phục vụ tốt.' },
        { text: 'りょうしんと{相撲|すもう}をみにいきたいです。', ro: 'Ryoushin to sumou o mi ni ikitai desu.', vi: 'Tôi muốn đi xem sumo cùng bố mẹ.' },
        { text: 'おいしいパンやを{知|し}っていますか。', ro: 'Oishii pan\'ya o shitte imasu ka.', vi: 'Bạn biết tiệm bánh mì nào ngon không?' },
        { text: 'いいえ、{知|し}りません。', ro: 'Iie, shirimasen.', vi: 'Không, tôi không biết.' },
        { text: '{1回|いっかい}もほっかいどうへいったことがありません。', ro: 'Ikkai mo Hokkaidou e itta koto ga arimasen.', vi: 'Tôi chưa từng đến Hokkaido lần nào.' },
        { text: 'このえいがは{何回|なんかい}もみました。', ro: 'Kono eiga wa nankai mo mimashita.', vi: 'Phim này tôi đã xem nhiều lần.' },
        { text: 'あの{男|おとこ}の{人|ひと}はだれですか。', ro: 'Ano otoko no hito wa dare desu ka.', vi: 'Người đàn ông kia là ai?' },
        { text: '{眼鏡|めがね}をかけている{女|おんな}の{人|ひと}がきむらさんです。', ro: 'Megane o kakete iru onna no hito ga Kimura-san desu.', vi: 'Người phụ nữ đang đeo kính là chị Kimura.' },
        { text: 'どこかいいお{店|みせ}を{知|し}っていますか。', ro: 'Dokoka ii omise o shitte imasu ka.', vi: 'Bạn biết quán nào được không?' },
        { text: 'にちようび、{遊園地|ゆうえんち}でデートをしました。', ro: 'Nichiyoubi, yuuenchi de deeto o shimashita.', vi: 'Chủ nhật tôi hẹn hò ở công viên giải trí.' },
        { text: 'あのみせは{電気製品|でんきせいひん}がやすいです。', ro: 'Ano mise wa denki seihin ga yasui desu.', vi: 'Cửa hàng kia bán đồ điện rẻ.' },
        { text: '{赤|あか}い{帽子|ぼうし}をかぶっている人がすきです。', ro: 'Akai boushi o kabutte iru hito ga suki desu.', vi: 'Tôi thích người đang đội mũ đỏ.' },
        { text: 'にしかわさんはきょう、{黄色|きいろ}いシャツを{着|き}ています。', ro: 'Nishikawa-san wa kyou, kiiroi shatsu o kite imasu.', vi: 'Hôm nay anh Nishikawa mặc áo sơ mi vàng.' },
        { text: '{青|あお}いスカートをはいている人がパクさんです。', ro: 'Aoi sukaato o haite iru hito ga Paku-san desu.', vi: 'Người đang mặc váy xanh là Park.' },
        { text: '{若|わか}い{人|ひと}に{人気|にんき}があるデパートです。', ro: 'Wakai hito ni ninki ga aru depaato desu.', vi: 'Là cửa hàng bách hoá được giới trẻ yêu thích.' },
        { text: 'あのみせはやすい{浴衣|ゆかた}を{売|う}っています。', ro: 'Ano mise wa yasui yukata o utte imasu.', vi: 'Cửa hàng kia có bán yukata rẻ.' },
        { text: 'きょうとで{泊|と}まったホテルはきれいでした。', ro: 'Kyouto de tomatta hoteru wa kirei deshita.', vi: 'Khách sạn tôi trọ ở Kyoto rất đẹp.' },
        { text: '{新鮮|しんせん}なさかなをたべることができるみせです。', ro: 'Shinsen na sakana o taberu koto ga dekiru mise desu.', vi: 'Là quán có thể ăn cá tươi.' },
        { text: 'バーベキューの{材料|ざいりょう}はどこでかいますか。', ro: 'Baabekyuu no zairyou wa doko de kaimasu ka.', vi: 'Nguyên liệu tiệc nướng mua ở đâu?' },
        { text: 'おはなみをする{場所|ばしょ}をさがしています。', ro: 'Ohanami o suru basho o sagashite imasu.', vi: 'Tôi đang tìm chỗ để ngắm hoa anh đào.' },
        { text: 'まいにちバスケットボールを{練習|れんしゅう}しています。', ro: 'Mainichi basukettobooru o renshuu shite imasu.', vi: 'Ngày nào tôi cũng tập bóng rổ.' },
        { text: 'みんなでのみかいをする{店|みせ}をさがしています。', ro: 'Minna de nomikai o suru mise o sagashite imasu.', vi: 'Tôi đang tìm quán để cả nhóm đi nhậu.' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b13-doc-doan',
      title: 'Đọc to đoạn văn kiểu đề thi (30 giây chuẩn bị)',
      note: 'Mỗi đoạn ~100 chữ, 4 từ chữ Hán + vài từ katakana như đề thật. Đọc liền mạch, không dừng giữa từ.',
      items: [
        {
          text: 'わたしはきょねん、はじめてきょうとへいきました。{紅葉|こうよう}がとてもきれいでした。えきからちかいホテルに{泊|と}まりました。そのホテルはサービスがよくて、りょうりもおいしかったです。わたしはまだ{相撲|すもう}をみたことがありません。こんどみたいです。',
          ro: 'Watashi wa kyonen, hajimete Kyouto e ikimashita. Kouyou ga totemo kirei deshita. Eki kara chikai hoteru ni tomarimashita. Sono hoteru wa saabisu ga yokute, ryouri mo oishikatta desu. Watashi wa mada sumou o mita koto ga arimasen. Kondo mitai desu.',
          vi: 'Năm ngoái lần đầu tiên tôi đi Kyoto. Lá đỏ rất đẹp. Tôi ở khách sạn gần ga. Khách sạn đó phục vụ tốt, đồ ăn cũng ngon. Tôi vẫn chưa từng xem sumo. Lần tới tôi muốn xem.',
        },
        {
          text: 'きのう、テレビで「スターズ」というグループをみました。わかいひとに{人気|にんき}があります。{赤|あか}い{帽子|ぼうし}をかぶっているひとがケンさんです。{眼鏡|めがね}をかけているひとはタクさんです。わたしはケンさんがいちばんすきです。',
          ro: 'Kinou, terebi de "Sutaazu" to iu guruupu o mimashita. Wakai hito ni ninki ga arimasu. Akai boushi o kabutte iru hito ga Ken-san desu. Megane o kakete iru hito wa Taku-san desu. Watashi wa Ken-san ga ichiban suki desu.',
          vi: 'Hôm qua tôi xem nhóm tên "Stars" trên TV. Nhóm được giới trẻ yêu thích. Người đội mũ đỏ là Ken. Người đeo kính là Taku. Tôi thích Ken nhất.',
        },
        {
          text: 'らいげつ、クラスのみんなでバーベキューをします。わたしはバーベキューができる{場所|ばしょ}をさがしています。パクさんにききました。「ひかりこうえんはどうですか。ひろくて、きれいですよ。」にくやさいなどの{材料|ざいりょう}は「まるやま」という{店|みせ}でかいます。',
          ro: 'Raigetsu, kurasu no minna de baabekyuu o shimasu. Watashi wa baabekyuu ga dekiru basho o sagashite imasu. Paku-san ni kikimashita. "Hikari kouen wa dou desu ka. Hirokute, kirei desu yo." Niku ya yasai nado no zairyou wa "Maruyama" to iu mise de kaimasu.',
          vi: 'Tháng sau cả lớp làm tiệc nướng. Tôi đang tìm chỗ có thể nướng thịt. Tôi đã hỏi Park. "Công viên Hikari thì sao? Rộng và sạch đẹp lắm." Nguyên liệu như thịt, rau thì mua ở cửa hàng tên "Maruyama".',
        },
        {
          text: 'えきのちかくに「ゆめや」というみせがあります。やすい{浴衣|ゆかた}やかわいいシャツを{売|う}っています。みせのひとはいつも{黄色|きいろ}いシャツを{着|き}ています。わたしは{何回|なんかい}もいったことがあります。みなさんもぜひいってください。',
          ro: 'Eki no chikaku ni "Yumeya" to iu mise ga arimasu. Yasui yukata ya kawaii shatsu o utte imasu. Mise no hito wa itsumo kiiroi shatsu o kite imasu. Watashi wa nankai mo itta koto ga arimasu. Minasan mo zehi itte kudasai.',
          vi: 'Gần ga có cửa hàng tên "Yumeya". Ở đó bán yukata rẻ và áo sơ mi dễ thương. Nhân viên cửa hàng lúc nào cũng mặc áo màu vàng. Tôi đã đến đó nhiều lần. Mọi người cũng nhất định hãy đến nhé.',
        },
      ],
    },

    {
      t: 'write',
      id: 'b13-viet-kanji',
      title: 'Tập viết tay chữ Hán Bài 13 — ✍ trước, 👁 sau',
      note: '15 chữ đầu là nhóm ✍ nên viết (ít nét, gặp rất nhiều) — viết cho thạo. Phần còn lại là 👁 nhận mặt: viết thử một lượt để nhớ mặt chữ là đủ. Bấm ▶ Thứ tự nét trước khi viết; viết xong nhờ ✨ AI xem chữ.',
      chars: ['一', '回', '何', '知', '男', '女', '人', '店', '気', '地', '子', '青', '赤', '色', '新', '売', '相', '撲', '紅', '葉', '遊', '園', '電', '製', '品', '眼', '鏡', '帽', '泊', '着', '黄', '若', '鮮', '材', '料', '場', '所', '浴', '衣', '練', '習'],
    },
  ],
};

/* ═══════════════════════════ 5. NGHE ═══════════════════════════ */

const NGHE: Lesson = {
  id: 'b13-nghe',
  kind: 'listening',
  title: 'Luyện nghe — giới thiệu gì? người nào? ở đâu, vì sao?',
  goal: 'Nghe người khác giới thiệu để bắt được tên (～という), đặc điểm (cụm bổ nghĩa trước danh từ) và lý do; nghe tả trang phục để chỉ đúng người; nghe hỏi kinh nghiệm để biết ai đã từng làm gì.',
  minutes: 40,
  blocks: [
    {
      t: 'note',
      title: 'Cách nghe',
      items: [
        '**Tên lạ** luôn đi kèm **という**: 「～」という{店|みせ}／ホテル／お{菓子|かし}. Người nghe hay nhắc lại tên bằng giọng hỏi (～？) — ngay sau đó là **lời giải thích**, chỗ quan trọng nhất.',
        '**Cụm bổ nghĩa đứng TRƯỚC danh từ**: nghe cả cụm, chờ tới danh từ cuối (店, 人, ホテル) mới biết đang nói về cái gì. {電気製品|でんきせいひん}が{安|やす}い **{店|みせ}** — đồ điện rẻ là đặc điểm của cửa hàng.',
        '**Trang phục**: bắt cặp **đồ + động từ** (シャツを{着|き}ている, {帽子|ぼうし}をかぶっている, {眼鏡|めがね}をかけている) và **màu** (赤い, 青い, 黄色い, 白い, 黒い).',
        '**Kinh nghiệm**: ～たことがあります = đã từng; **{1回|いっかい}も**～ません = chưa lần nào; **{何回|なんかい}も** = nhiều lần.',
        'Bẫy: gợi ý đầu tiên hay bị gạt đi ("でも、ちょっと{高|たか}いです…"). Luôn lấy thông tin **cuối cùng** người nghe chấp nhận.',
      ],
    },

    /* ── Bài 1 ── */
    { t: 'h', text: 'Bài 1 — Bố mẹ sang chơi: được giới thiệu gì? (やってみよう)' },
    {
      t: 'p',
      text: 'Park nói chuyện với chị Kimura (người Nhật). Bố mẹ Park sắp sang Nhật. Nghe, rồi trả lời: (1) chị Kimura **giới thiệu hai thứ gì**? (2) Park **đã hỏi những câu gì** để lấy thông tin?',
    },
    {
      t: 'listen',
      id: 'b13-ng-1',
      title: 'Park và chị Kimura',
      note: 'Bắt: tên đi với という, đó là loại gì, và các câu hỏi của Park (～たことがありますか, ～を知っていますか, どこ／いくら).',
      lines: [
        { who: 'パク', voice: 'ja-nu', text: '{木村|きむら}さん、{来週|らいしゅう}、{国|くに}から{両親|りょうしん}が{来|き}ます。{両親|りょうしん}と{温泉|おんせん}へ{行|い}きたいです。', ro: 'Kimura-san, raishuu, kuni kara ryoushin ga kimasu. Ryoushin to onsen e ikitai desu.', vi: 'Chị Kimura, tuần sau bố mẹ em từ quê sang. Em muốn đi suối nước nóng với bố mẹ.' },
        { who: '{木村|きむら}', voice: 'ja-nu', text: 'いいですね。', ro: 'Ii desu ne.', vi: 'Hay đấy.' },
        { who: 'パク', voice: 'ja-nu', text: '{木村|きむら}さんは{箱根|はこね}へ{行|い}ったことがありますか。', ro: 'Kimura-san wa Hakone e itta koto ga arimasu ka.', vi: 'Chị đã từng đi Hakone chưa?' },
        { who: '{木村|きむら}', voice: 'ja-nu', text: 'ええ、{何回|なんかい}もありますよ。「やまなみ」というホテルがいいですよ。{部屋|へや}から{富士山|ふじさん}が{見|み}えるホテルです。', ro: 'Ee, nankai mo arimasu yo. "Yamanami" to iu hoteru ga ii desu yo. Heya kara Fujisan ga mieru hoteru desu.', vi: 'Có, nhiều lần rồi. Khách sạn tên "Yamanami" được lắm. Là khách sạn từ phòng nhìn thấy núi Phú Sĩ.' },
        { who: 'パク', voice: 'ja-nu', text: 'へえ。{高|たか}いですか。', ro: 'Hee. Takai desu ka.', vi: 'Ồ. Có đắt không ạ?' },
        { who: '{木村|きむら}', voice: 'ja-nu', text: '{1人|ひとり}{1万円|いちまんえん}くらいでした。サービスもよかったですよ。', ro: 'Hitori ichiman en kurai deshita. Saabisu mo yokatta desu yo.', vi: 'Khoảng 10.000 yên một người. Phục vụ cũng tốt nữa.' },
        { who: 'パク', voice: 'ja-nu', text: 'そうですか。それから、{箱根|はこね}の{有名|ゆうめい}なお{土産|みやげ}を{知|し}っていますか。', ro: 'Sou desu ka. Sorekara, Hakone no yuumei na omiyage o shitte imasu ka.', vi: 'Vậy ạ. Còn nữa, chị có biết quà nổi tiếng của Hakone không?' },
        { who: '{木村|きむら}', voice: 'ja-nu', text: 'ええ。{黒|くろ}たまごという{卵|たまご}が{有名|ゆうめい}ですよ。{温泉|おんせん}で{作|つく}る{黒|くろ}い{卵|たまご}です。', ro: 'Ee. Kurotamago to iu tamago ga yuumei desu yo. Onsen de tsukuru kuroi tamago desu.', vi: 'Có. Món trứng tên "trứng đen" nổi tiếng lắm. Là trứng màu đen luộc bằng nước suối nóng.' },
        { who: 'パク', voice: 'ja-nu', text: 'くろたまご？おもしろいですね。ありがとうございます。', ro: 'Kurotamago? Omoshiroi desu ne. Arigatou gozaimasu.', vi: 'Trứng đen ạ? Thú vị ghê. Cảm ơn chị.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b13-ng-1-q',
      title: 'Câu hỏi bài 1',
      items: [
        { q: '(1) {木村|きむら}さんのおすすめは{何|なん}ですか。', options: ['やまなみ（ホテル）と{黒|くろ}たまご（お{土産|みやげ}）', 'やまなみ（{温泉|おんせん}）と{富士山|ふじさん}', '{箱根|はこね}（ホテル）と{黒|くろ}たまご（レストラン）', '{富士山|ふじさん}とお{土産|みやげ}の{店|みせ}'], correct: 0, why: '「やまなみ」**という**ホテル + {黒|くろ}たまご**という**{卵|たまご} (お土産).' },
        { q: 'やまなみはどんなホテルですか。', options: ['{駅|えき}から{近|ちか}いホテル', '{部屋|へや}から{富士山|ふじさん}が{見|み}えるホテル', '{部屋|へや}から{海|うみ}が{見|み}えるホテル', '{安|やす}くて{新|あたら}しいホテル'], correct: 1, why: '**{部屋|へや}から{富士山|ふじさん}が{見|み}える**ホテルです (ポイント 109).' },
        { q: 'ホテルはいくらでしたか。', options: ['{1人|ひとり}{1,000円|せんえん}', '{1人|ひとり}{5,000円|ごせんえん}', '{1人|ひとり}{1万円|いちまんえん}くらい', '{2人|ふたり}{1万円|いちまんえん}'], correct: 2, why: '{1人|ひとり}**{1万円|いちまんえん}くらい**でした.' },
        { q: '(2) パクさんがした{質問|しつもん}はどれですか。', options: ['{箱根|はこね}へ{行|い}ったことがありますか／{有名|ゆうめい}なお{土産|みやげ}を{知|し}っていますか', '{箱根|はこね}はどこにありますか／{何|なに}を{食|た}べましたか', '{温泉|おんせん}が{好|す}きですか／いつ{行|い}きましたか', 'ホテルを{予約|よやく}しましたか／{卵|たまご}はいくらですか'], correct: 0, why: 'Hỏi kinh nghiệm (**～たことがありますか**) và hỏi thông tin (**～を{知|し}っていますか**) — đúng hai cách của chủ đề 1. Ngoài ra còn {高|たか}いですか.' },
      ],
    },

    /* ── Bài 2 ── */
    { t: 'h', text: 'Bài 2 — Cửa hàng anh Nishikawa giới thiệu · Ca sĩ Anna thích (やってみよう)' },
    {
      t: 'listen',
      id: 'b13-ng-2a',
      title: '① Cửa hàng anh Nishikawa giới thiệu: ヤマト電器',
      note: 'Điền trong đầu: ヤマト電器は ___ 電気製品を ___ 店です。お店の人は ___ です。',
      lines: [
        { who: 'パク', voice: 'ja-nu', text: '{西川|にしかわ}さん、パソコンを{買|か}いたいです。どこかいい{店|みせ}を{知|し}っていますか。', ro: 'Nishikawa-san, pasokon o kaitai desu. Dokoka ii mise o shitte imasu ka.', vi: 'Anh Nishikawa, em muốn mua máy tính. Anh có biết cửa hàng nào được không?' },
        { who: '{西川|にしかわ}', voice: 'ja-nam', text: 'ヤマト{電器|でんき}はどうですか。', ro: 'Yamato denki wa dou desu ka.', vi: 'Yamato Denki thì sao?' },
        { who: 'パク', voice: 'ja-nu', text: 'やまとでんき？', ro: 'Yamato denki?', vi: 'Yamato Denki ạ?' },
        { who: '{西川|にしかわ}', voice: 'ja-nam', text: 'ええ。いろいろな{国|くに}の{電気製品|でんきせいひん}を{安|やす}く{売|う}っている{店|みせ}です。{駅|えき}の{前|まえ}にありますよ。', ro: 'Ee. Iroiro na kuni no denki seihin o yasuku utte iru mise desu. Eki no mae ni arimasu yo.', vi: 'Ừ. Là cửa hàng bán rẻ đồ điện của nhiều nước. Ở trước ga đấy.' },
        { who: 'パク', voice: 'ja-nu', text: 'そうですか。{日本語|にほんご}があまりわかりませんが、{大丈夫|だいじょうぶ}ですか。', ro: 'Sou desu ka. Nihongo ga amari wakarimasen ga, daijoubu desu ka.', vi: 'Vậy ạ. Em không hiểu tiếng Nhật lắm, có sao không ạ?' },
        { who: '{西川|にしかわ}', voice: 'ja-nam', text: '{大丈夫|だいじょうぶ}ですよ。お{店|みせ}の{人|ひと}はとても{親切|しんせつ}です。{英語|えいご}も{話|はな}すことができますよ。', ro: 'Daijoubu desu yo. Omise no hito wa totemo shinsetsu desu. Eigo mo hanasu koto ga dekimasu yo.', vi: 'Không sao đâu. Nhân viên ở đó rất tử tế. Họ nói được cả tiếng Anh.' },
      ],
    },
    {
      t: 'listen',
      id: 'b13-ng-2b',
      title: '② Ca sĩ Anna thích: 森ユミ',
      note: 'Điền trong đầu: 森ユミは ___ 人です。',
      lines: [
        { who: 'ダニエル', voice: 'ja-nam', text: 'アンナさん、どうしたんですか。', ro: 'Anna-san, dou shita n desu ka.', vi: 'Anna, có chuyện gì vậy?' },
        { who: 'アンナ', voice: 'ja-nu', text: 'あっ、{森|もり}ユミです！{私|わたし}がいちばん{好|す}きな{歌手|かしゅ}です。', ro: 'A, Mori Yumi desu! Watashi ga ichiban suki na kashu desu.', vi: 'A, Mori Yumi kìa! Ca sĩ mình thích nhất đấy.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'もりゆみ？どの{人|ひと}ですか。{帽子|ぼうし}をかぶっている{人|ひと}ですか。', ro: 'Mori Yumi? Dono hito desu ka. Boushi o kabutte iru hito desu ka.', vi: 'Mori Yumi? Người nào? Người đang đội mũ à?' },
        { who: 'アンナ', voice: 'ja-nu', text: 'いいえ、{帽子|ぼうし}の{人|ひと}の{隣|となり}です。{赤|あか}いスカートをはいて、{眼鏡|めがね}をかけている{人|ひと}です。', ro: 'Iie, boushi no hito no tonari desu. Akai sukaato o haite, megane o kakete iru hito desu.', vi: 'Không, bên cạnh người đội mũ. Người mặc váy đỏ và đeo kính.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'ああ、あの{人|ひと}ですか。{歌|うた}が{上手|じょうず}ですね。', ro: 'Aa, ano hito desu ka. Uta ga jouzu desu ne.', vi: 'À, người đó à. Hát hay nhỉ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b13-ng-2-q',
      title: 'Câu hỏi bài 2',
      items: [
        { q: 'ヤマト{電器|でんき}はどんな{店|みせ}ですか。', options: ['{日本|にほん}の{電気製品|でんきせいひん}だけを{売|う}っている{店|みせ}', 'いろいろな{国|くに}の{電気製品|でんきせいひん}を{安|やす}く{売|う}っている{店|みせ}', '{新|あたら}しいパソコンを{作|つく}っている{店|みせ}', '{駅|えき}から{遠|とお}い{大|おお}きい{店|みせ}'], correct: 1, why: '**いろいろな{国|くに}の**{電気製品|でんきせいひん}を**{安|やす}く{売|う}っている**{店|みせ}です.' },
        { q: 'お{店|みせ}の{人|ひと}はどうですか。', options: ['{親切|しんせつ}です。{英語|えいご}も{話|はな}すことができます', '{若|わか}いです', '{日本語|にほんご}だけ{話|はな}します', 'あまり{親切|しんせつ}じゃありません'], correct: 0, why: 'とても**{親切|しんせつ}**です。{英語|えいご}も{話|はな}すことができますよ.' },
        { q: '{森|もり}ユミはどの{人|ひと}ですか。', options: ['{帽子|ぼうし}をかぶっている{人|ひと}', '{赤|あか}いスカートをはいて、{眼鏡|めがね}をかけている{人|ひと}', '{赤|あか}いシャツを{着|き}ている{人|ひと}', 'サングラスをかけている{人|ひと}'], correct: 1, why: 'Bẫy: ダニエル đoán người đội mũ — アンナ nói **いいえ**, bên cạnh: {赤|あか}いスカートを**はいて**、{眼鏡|めがね}を**かけている**{人|ひと}.' },
      ],
    },

    /* ── Bài 3 ── */
    { t: 'h', text: 'Bài 3 — Ở đâu? Vì sao? (やってみよう)' },
    {
      t: 'p',
      text: 'Hai đoạn hội thoại: người hỏi đang tìm chỗ cho một việc. Nghe và trả lời **chỗ được giới thiệu là đâu** và **vì sao**.',
    },
    {
      t: 'listen',
      id: 'b13-ng-3a',
      title: '① Tìm quán liên hoan',
      lines: [
        { who: 'マルコ', voice: 'ja-nam', text: 'ワンさん、{来週|らいしゅう}、クラスのみんなで{飲|の}み{会|かい}をします。どこかいい{店|みせ}を{知|し}っていますか。', ro: 'Wan-san, raishuu, kurasu no minna de nomikai o shimasu. Dokoka ii mise o shitte imasu ka.', vi: 'Wang, tuần sau cả lớp đi liên hoan. Cậu biết quán nào được không?' },
        { who: 'ワン', voice: 'ja-nu', text: 'そうですねえ。「たぬき」はどうですか。{料理|りょうり}がおいしいですよ。', ro: 'Sou desu nee. "Tanuki" wa dou desu ka. Ryouri ga oishii desu yo.', vi: 'Để xem. Quán "Tanuki" thì sao? Đồ ăn ngon đấy.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'でも、たぬきはちょっと{高|たか}いですね。', ro: 'Demo, Tanuki wa chotto takai desu ne.', vi: 'Nhưng Tanuki hơi đắt nhỉ.' },
        { who: 'ワン', voice: 'ja-nu', text: 'じゃ、「げんき{屋|や}」はどうですか。{安|やす}くて、{広|ひろ}い{部屋|へや}がある{店|みせ}です。{30人|さんじゅうにん}ぐらい{入|はい}ることができますよ。', ro: 'Ja, "Genkiya" wa dou desu ka. Yasukute, hiroi heya ga aru mise desu. Sanjuunin gurai hairu koto ga dekimasu yo.', vi: 'Vậy "Genkiya" thì sao? Là quán rẻ và có phòng rộng. Vào được khoảng 30 người đấy.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'いいですね。そこにします。', ro: 'Ii desu ne. Soko ni shimasu.', vi: 'Được đấy. Chọn chỗ đó.' },
      ],
    },
    {
      t: 'listen',
      id: 'b13-ng-3b',
      title: '② Tìm chỗ tập bóng rổ',
      lines: [
        { who: 'アンナ', voice: 'ja-nu', text: 'ダニエルさん、バスケットボールを{練習|れんしゅう}する{場所|ばしょ}を{探|さが}しています。', ro: 'Danieru-san, basukettobooru o renshuu suru basho o sagashite imasu.', vi: 'Daniel, mình đang tìm chỗ tập bóng rổ.' },
        { who: 'ダニエル', voice: 'ja-nam', text: '{大学|だいがく}の{体育館|たいいくかん}はどうですか。', ro: 'Daigaku no taiikukan wa dou desu ka.', vi: 'Nhà thể thao của trường thì sao?' },
        { who: 'アンナ', voice: 'ja-nu', text: '{体育館|たいいくかん}は{土曜日|どようび}と{日曜日|にちようび}に{使|つか}うことができません。', ro: 'Taiikukan wa doyoubi to nichiyoubi ni tsukau koto ga dekimasen.', vi: 'Nhà thể thao thì thứ Bảy, Chủ nhật không dùng được.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'そうですか。じゃ、みなみ{公園|こうえん}がいいですよ。バスケットボールのコートがある{公園|こうえん}です。{週末|しゅうまつ}も{使|つか}うことができます。{駅|えき}からも{近|ちか}いですよ。', ro: 'Sou desu ka. Ja, Minami kouen ga ii desu yo. Basukettobooru no kooto ga aru kouen desu. Shuumatsu mo tsukau koto ga dekimasu. Eki kara mo chikai desu yo.', vi: 'Vậy à. Thế thì công viên Minami được đấy. Là công viên có sân bóng rổ. Cuối tuần cũng dùng được. Lại gần ga nữa.' },
        { who: 'アンナ', voice: 'ja-nu', text: 'へえ、{知|し}りませんでした。{今度|こんど}{行|い}きます。', ro: 'Hee, shirimasen deshita. Kondo ikimasu.', vi: 'Ồ, mình không biết đấy. Lần tới mình sẽ đi.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b13-ng-3-q',
      title: 'Câu hỏi bài 3 — どこですか・どうしてですか',
      items: [
        { q: '① どこですか。', options: ['たぬき', 'げんき{屋|や}', '{大学|だいがく}の{食堂|しょくどう}', 'ワンさんの{家|いえ}'], correct: 1, why: 'Bẫy: たぬき bị gạt đi vì **{高|たか}い**. Chốt: **げんき{屋|や}** → そこにします.' },
        { q: '① どうしてですか。', options: ['{料理|りょうり}がおいしいですから', '{安|やす}くて、{広|ひろ}い{部屋|へや}がありますから', '{駅|えき}から{近|ちか}いですから', 'ワンさんがよく{行|い}きますから'], correct: 1, why: '**{安|やす}くて、{広|ひろ}い{部屋|へや}がある**{店|みせ}です — {30人|さんじゅうにん}ぐらい{入|はい}れる.' },
        { q: '② どこですか。', options: ['{大学|だいがく}の{体育館|たいいくかん}', 'みなみ{公園|こうえん}', 'ひかり{公園|こうえん}', '{駅|えき}の{前|まえ}'], correct: 1, why: '{体育館|たいいくかん} không dùng được cuối tuần → **みなみ{公園|こうえん}**.' },
        { q: '② どうしてですか。', options: ['{広|ひろ}くて、きれいですから', 'コートがあって、{週末|しゅうまつ}も{使|つか}うことができますから', '{安|やす}いですから', '{大学|だいがく}の{中|なか}にありますから'], correct: 1, why: 'バスケットボールの**コートがある**{公園|こうえん}・**{週末|しゅうまつ}も{使|つか}うことができます**・{駅|えき}からも{近|ちか}い.' },
        { q: '「へえ、{知|し}りませんでした」の{意味|いみ}は？', options: ['Ồ, mình không biết đấy (trước giờ)', 'Ồ, mình không hiểu', 'Mình không muốn biết', 'Mình đã biết rồi'], correct: 0, why: '{知|し}り**ませんでした** = trước lúc được nói thì không biết. (ポイント 111)' },
      ],
    },

    /* ── Bài 4 ── */
    { t: 'h', text: 'Bài 4 — Hội thoại dài: đi Kyoto mùa lá đỏ (もう{一度|いちど}{聞|き}こう)' },
    {
      t: 'listen',
      id: 'b13-ng-4',
      title: 'Anna hỏi chị Yamaguchi về chuyến đi Kyoto',
      note: 'Nghe cả đoạn một lần, rồi trả lời câu hỏi. Nghe lại lần hai để kiểm tra.',
      lines: [
        { who: 'アンナ', voice: 'ja-nu', text: '{山口|やまぐち}さん、{私|わたし}は{来月|らいげつ}、{初|はじ}めて{京都|きょうと}へ{行|い}きます。{山口|やまぐち}さんは{京都|きょうと}へ{行|い}ったことがありますか。', ro: 'Yamaguchi-san, watashi wa raigetsu, hajimete Kyouto e ikimasu. Yamaguchi-san wa Kyouto e itta koto ga arimasu ka.', vi: 'Chị Yamaguchi, tháng sau lần đầu tiên em đi Kyoto. Chị đã từng đi Kyoto chưa?' },
        { who: '{山口|やまぐち}', voice: 'ja-nu', text: 'ええ、{何回|なんかい}もありますよ。{秋|あき}の{京都|きょうと}は{紅葉|こうよう}がとてもきれいです。', ro: 'Ee, nankai mo arimasu yo. Aki no Kyouto wa kouyou ga totemo kirei desu.', vi: 'Có, nhiều lần rồi. Kyoto mùa thu lá đỏ đẹp lắm.' },
        { who: 'アンナ', voice: 'ja-nu', text: '{今|いま}、{泊|と}まるホテルを{探|さが}しています。どこかいいホテルを{知|し}っていますか。', ro: 'Ima, tomaru hoteru o sagashite imasu. Dokoka ii hoteru o shitte imasu ka.', vi: 'Giờ em đang tìm khách sạn để ở. Chị có biết khách sạn nào được không?' },
        { who: '{山口|やまぐち}', voice: 'ja-nu', text: 'そうですねえ。「さくら{荘|そう}」はどうですか。', ro: 'Sou desu nee. "Sakurasou" wa dou desu ka.', vi: 'Để xem. "Sakurasou" thì sao?' },
        { who: 'アンナ', voice: 'ja-nu', text: 'さくらそう？', ro: 'Sakurasou?', vi: 'Sakurasou ạ?' },
        { who: '{山口|やまぐち}', voice: 'ja-nu', text: '{古|ふる}い{日本|にほん}の{家|いえ}に{泊|と}まることができるホテルです。{浴衣|ゆかた}を{着|き}ることもできますよ。{私|わたし}は{去年|きょねん}、{母|はは}と{泊|と}まりました。', ro: 'Furui Nihon no ie ni tomaru koto ga dekiru hoteru desu. Yukata o kiru koto mo dekimasu yo. Watashi wa kyonen, haha to tomarimashita.', vi: 'Là khách sạn có thể ở trong một ngôi nhà Nhật cổ. Còn có thể mặc yukata nữa. Năm ngoái chị ở đó với mẹ.' },
        { who: 'アンナ', voice: 'ja-nu', text: 'いいですね。{駅|えき}から{近|ちか}いですか。', ro: 'Ii desu ne. Eki kara chikai desu ka.', vi: 'Hay quá. Có gần ga không ạ?' },
        { who: '{山口|やまぐち}', voice: 'ja-nu', text: 'バスで{15分|じゅうごふん}ぐらいです。{清水寺|きよみずでら}まで{歩|ある}いて{行|い}くことができますよ。', ro: 'Basu de juugofun gurai desu. Kiyomizudera made aruite iku koto ga dekimasu yo.', vi: 'Đi xe buýt khoảng 15 phút. Có thể đi bộ tới chùa Kiyomizu đấy.' },
        { who: 'アンナ', voice: 'ja-nu', text: '{料理|りょうり}はどうでしたか。', ro: 'Ryouri wa dou deshita ka.', vi: 'Đồ ăn thế nào ạ?' },
        { who: '{山口|やまぐち}', voice: 'ja-nu', text: 'とてもおいしかったです。{湯豆腐|ゆどうふ}という{料理|りょうり}がありますから、ぜひ{食|た}べてください。', ro: 'Totemo oishikatta desu. Yudoufu to iu ryouri ga arimasu kara, zehi tabete kudasai.', vi: 'Ngon lắm. Có món tên "yudofu" (đậu phụ nấu nước nóng), nhất định em ăn thử nhé.' },
        { who: 'アンナ', voice: 'ja-nu', text: 'わかりました。{予約|よやく}はどうしますか。', ro: 'Wakarimashita. Yoyaku wa dou shimasu ka.', vi: 'Em hiểu rồi. Đặt phòng thế nào ạ?' },
        { who: '{山口|やまぐち}', voice: 'ja-nu', text: 'インターネットで{予約|よやく}することができますよ。それから、{京都|きょうと}はたくさん{歩|ある}きますから、{新|あたら}しい{靴|くつ}じゃなくて、いつもはいている{靴|くつ}をはいて{行|い}ったほうがいいですよ。', ro: 'Intaanetto de yoyaku suru koto ga dekimasu yo. Sorekara, Kyouto wa takusan arukimasu kara, atarashii kutsu ja nakute, itsumo haite iru kutsu o haite itta hou ga ii desu yo.', vi: 'Có thể đặt trên mạng. Còn nữa, ở Kyoto đi bộ nhiều nên đừng đi giày mới, đi đôi giày em vẫn hay đi thì hơn.' },
        { who: 'アンナ', voice: 'ja-nu', text: 'はい、そうします。ありがとうございました。', ro: 'Hai, sou shimasu. Arigatou gozaimashita.', vi: 'Vâng, em sẽ làm vậy. Cảm ơn chị.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b13-ng-4-q',
      title: 'Câu hỏi bài 4',
      items: [
        { q: 'アンナさんは{京都|きょうと}へ{行|い}ったことがありますか。', options: ['はい、{1回|いっかい}あります', 'はい、{何回|なんかい}もあります', 'いいえ、ありません', 'わかりません'], correct: 2, why: '{来月|らいげつ}、**{初|はじ}めて**{京都|きょうと}へ{行|い}きます → chưa từng. ({何回|なんかい}も là của {山口|やまぐち}さん)' },
        { q: 'さくら{荘|そう}はどんなホテルですか。', options: ['{新|あたら}しくて{大|おお}きいホテル', '{古|ふる}い{日本|にほん}の{家|いえ}に{泊|と}まることができるホテル', '{駅|えき}の{前|まえ}にあるホテル', '{部屋|へや}から{海|うみ}が{見|み}えるホテル'], correct: 1, why: '**{古|ふる}い{日本|にほん}の{家|いえ}に{泊|と}まることができる**ホテルです (ポイント 109).' },
        { q: 'さくら{荘|そう}で{何|なに}ができますか。', options: ['{浴衣|ゆかた}を{着|き}ることができます', '{浴衣|ゆかた}を{買|か}うことができます', 'スキーをすることができます', '{相撲|すもう}を{見|み}ることができます'], correct: 0, why: '**{浴衣|ゆかた}を{着|き}ることもできます**よ.' },
        { q: '{駅|えき}からどうやって{行|い}きますか。', options: ['{歩|ある}いて{15分|じゅうごふん}', 'バスで{15分|じゅうごふん}ぐらい', '{電車|でんしゃ}で{5分|ごふん}', 'タクシーで{10分|じゅっぷん}'], correct: 1, why: '**バスで{15分|じゅうごふん}ぐらい**. Đi bộ là tới chùa Kiyomizu.' },
        { q: '{山口|やまぐち}さんのおすすめの{料理|りょうり}は{何|なん}ですか。', options: ['{天|てん}ぷら', '{湯豆腐|ゆどうふ}', 'お{好|この}み{焼|や}き', 'ちゃんちゃん{焼|や}き'], correct: 1, why: '**{湯豆腐|ゆどうふ}という{料理|りょうり}**がありますから、ぜひ{食|た}べてください.' },
        { q: '{山口|やまぐち}さんはどんな{靴|くつ}をはいて{行|い}ったほうがいいと{言|い}いましたか。', options: ['{新|あたら}しい{靴|くつ}', 'いつもはいている{靴|くつ}', '{高|たか}い{靴|くつ}', '{黒|くろ}い{靴|くつ}'], correct: 1, why: '{新|あたら}しい{靴|くつ}じゃなくて、**いつもはいている{靴|くつ}**をはいて{行|い}ったほうがいい (ポイント 109 + ～ほうがいい Bài 12).' },
      ],
    },

    /* ── Bài 5 ── */
    { t: 'h', text: 'Bài 5 — Ai là ai? (nghe tả trang phục)' },
    {
      t: 'p',
      text: 'Ảnh chụp ở buổi tiệc có 6 người ⓐ–ⓕ (tả bằng bảng). Nghe 5 câu, mỗi câu nói về một người — chọn đúng người.',
    },
    {
      t: 'table',
      caption: 'Ảnh buổi tiệc (tả bằng lời)',
      head: ['Kí hiệu', 'Người trong ảnh'],
      rows: [
        ['ⓐ', 'Nam, áo sơ mi trắng, đeo cà vạt xanh'],
        ['ⓑ', 'Nữ, váy đỏ, đội mũ trắng'],
        ['ⓒ', 'Nam, áo sơ mi vàng, đeo kính râm'],
        ['ⓓ', 'Nữ, áo xanh, đeo kính, mặc quần đen'],
        ['ⓔ', 'Nam, mặc yukata, không đeo kính'],
        ['ⓕ', 'Nữ, váy vàng, đeo kính'],
      ],
    },
    {
      t: 'listen',
      id: 'b13-ng-5',
      title: '5 câu tả người',
      lines: [
        { who: '①', voice: 'ja-nu', text: 'パクさんは{赤|あか}いスカートをはいて、{白|しろ}い{帽子|ぼうし}をかぶっている{人|ひと}です。', ro: 'Paku-san wa akai sukaato o haite, shiroi boushi o kabutte iru hito desu.', vi: 'Park là người mặc váy đỏ, đội mũ trắng.' },
        { who: '②', voice: 'ja-nam', text: '{西川|にしかわ}さんはネクタイをしています。{白|しろ}いシャツを{着|き}ています。', ro: 'Nishikawa-san wa nekutai o shite imasu. Shiroi shatsu o kite imasu.', vi: 'Anh Nishikawa đeo cà vạt. Mặc áo sơ mi trắng.' },
        { who: '③', voice: 'ja-nu', text: '{木村|きむら}さんは{眼鏡|めがね}をかけています。スカートじゃなくて、ズボンをはいています。', ro: 'Kimura-san wa megane o kakete imasu. Sukaato ja nakute, zubon o haite imasu.', vi: 'Chị Kimura đeo kính. Không mặc váy mà mặc quần.' },
        { who: '④', voice: 'ja-nam', text: 'マルコさんは{日本|にほん}の{服|ふく}を{着|き}ています。{眼鏡|めがね}はかけていません。', ro: 'Maruko-san wa Nihon no fuku o kite imasu. Megane wa kakete imasen.', vi: 'Marco mặc đồ Nhật. Không đeo kính.' },
        { who: '⑤', voice: 'ja-nu', text: 'サングラスをかけている{人|ひと}がダニエルさんです。{黄色|きいろ}いシャツを{着|き}ています。', ro: 'Sangurasu o kakete iru hito ga Danieru-san desu. Kiiroi shatsu o kite imasu.', vi: 'Người đeo kính râm là Daniel. Mặc áo vàng.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b13-ng-5-q',
      title: 'Câu hỏi bài 5 — ⓐ〜ⓕのどの人ですか',
      items: [
        { q: '① パクさん', options: ['ⓑ', 'ⓕ', 'ⓓ', 'ⓔ'], correct: 0, why: '{赤|あか}いスカート + {白|しろ}い{帽子|ぼうし} → ⓑ.' },
        { q: '② {西川|にしかわ}さん', options: ['ⓒ', 'ⓐ', 'ⓔ', 'ⓓ'], correct: 1, why: 'ネクタイ**をしています** + {白|しろ}いシャツ → ⓐ.' },
        { q: '③ {木村|きむら}さん', options: ['ⓕ', 'ⓓ', 'ⓑ', 'ⓐ'], correct: 1, why: 'Bẫy: ⓕ cũng đeo kính nhưng mặc váy. {木村|きむら}さん **ズボンをはいています** → ⓓ.' },
        { q: '④ マルコさん', options: ['ⓐ', 'ⓒ', 'ⓔ', 'ⓑ'], correct: 2, why: '{日本|にほん}の{服|ふく} = {浴衣|ゆかた}, {眼鏡|めがね}はかけていません → ⓔ.' },
        { q: '⑤ ダニエルさん', options: ['ⓒ', 'ⓕ', 'ⓐ', 'ⓔ'], correct: 0, why: 'サングラス**をかけている** + {黄色|きいろ}いシャツ → ⓒ.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 6. NÓI (dạng thi) ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b13-noi',
  kind: 'speaking',
  title: 'Luyện nói — câu hỏi thi về kinh nghiệm, thứ bạn giới thiệu, người trong tranh mặc gì',
  goal: 'Trả lời trọn câu, đúng trợ từ các câu hỏi thi liên quan Bài 13 (～たことがありますか, おすすめは何ですか, ～を知っていますか, 何を着ていますか), nhìn tranh người / quảng cáo mà trả lời, đóng vai hỏi – giới thiệu, và đọc to trôi chảy.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Đề thi nói JPD (theo "Hướng dẫn ôn thi" của bộ môn) — Bài 13 nằm ở đâu',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 13 xuất hiện ở đâu'],
      rows: [
        ['Reading', '40', 'Chuẩn bị 30 giây, đọc to đoạn ~100–110 chữ (4 từ chữ Hán gạch chân, 4 từ katakana, 70–80 chữ hiragana).', 'Đoạn kể kinh nghiệm / giới thiệu một nơi: {紅葉|こうよう}, {泊|と}まります, {人気|にんき}, ホテル, サービス…'],
        ['Talking — có tranh', '3 × 15', 'Nhìn tranh (nhóm người, quảng cáo cửa hàng…) trả lời 3 câu.', '{何|なに}を{着|き}ていますか · どの{人|ひと}ですか · どんな{店|みせ}ですか'],
        ['Talking — không tranh', '1 × 10', 'Trả lời 1 câu về bản thân.', '～たことがありますか · おすすめの～は{何|なん}ですか · ～を{知|し}っていますか'],
        ['Presenting', '5', 'Chào khi vào và khi ra.', 'しつれいします／ありがとうございました。'],
      ],
    },
    {
      t: 'note',
      title: 'Luật chấm cần nhớ (trừ điểm thật)',
      items: [
        '**Sai trợ từ: −2 điểm** mỗi lỗi. Bài 13 soát kỹ: {富士山|ふじさん}**に**{登|のぼ}った · {沖縄|おきなわ}**へ**{行|い}った · ホテル**に**{泊|と}まった · ～こと**が**あります · N **を**{知|し}っています · シャツ**を**{着|き}ています · 私**が**よく行く店 (trong cụm dùng が).',
        '**Câu có/không quên はい／いいえ**: bị trừ. 「～たことがありますか」 → **はい、あります／いいえ、ありません**, rồi thêm một câu.',
        '**Sai nội dung = mất trọn câu**: hỏi "đã từng chưa" mà trả lời quá khứ đơn không có ý kinh nghiệm vẫn được, nhưng trả lời bằng thể từ điển (~~行くことがあります~~) là sai nghĩa. "Không biết" nói ~~知っていません~~ là sai dạng.',
        'Được xin nhắc lại câu hỏi **tối đa 2 lần, không bị trừ**: **もう{一度|いちど}お{願|ねが}いします** · **ゆっくりお{願|ねが}いします**.',
        'Luôn trả lời **câu đầy đủ**, lặp lại động từ của câu hỏi; câu giới thiệu thì thêm **lý do** (～から) để câu dài hơn.',
      ],
    },

    /* ── Không tranh ① ── */
    { t: 'h', text: 'Câu hỏi không tranh ① — Đã từng … chưa? (～たことがありますか)' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: kinh nghiệm',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{日本|にほん}へ{行|い}ったことがありますか。', ro: 'Nihon e itta koto ga arimasu ka.', vi: 'Em đã từng đi Nhật chưa?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{1回|いっかい}もありません。でも、{来年|らいねん}{行|い}きたいです。', ro: 'Iie, ikkai mo arimasen. Demo, rainen ikitai desu.', vi: 'Chưa ạ, chưa lần nào. Nhưng sang năm em muốn đi.' },
        { who: 'Giám thị', role: 'examiner', text: '{日本|にほん}の{料理|りょうり}を{食|た}べたことがありますか。', ro: 'Nihon no ryouri o tabeta koto ga arimasu ka.', vi: 'Em đã từng ăn món Nhật chưa?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、あります。すしとラーメンを{何回|なんかい}も{食|た}べました。とてもおいしかったです。', ro: 'Hai, arimasu. Sushi to raamen o nankai mo tabemashita. Totemo oishikatta desu.', vi: 'Rồi ạ. Em đã ăn sushi và ramen nhiều lần. Rất ngon ạ.' },
        { who: 'Giám thị', role: 'examiner', text: '{着物|きもの}や{浴衣|ゆかた}を{着|き}たことがありますか。', ro: 'Kimono ya yukata o kita koto ga arimasu ka.', vi: 'Em đã từng mặc kimono hay yukata chưa?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、ありません。{一度|いちど}{着|き}たいです。', ro: 'Iie, arimasen. Ichido kitai desu.', vi: 'Chưa ạ. Em muốn mặc thử một lần.' },
        { who: 'Giám thị', role: 'examiner', text: '{富士山|ふじさん}に{登|のぼ}ったことがありますか。', ro: 'Fujisan ni nobotta koto ga arimasu ka.', vi: 'Em đã từng leo núi Phú Sĩ chưa?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、ありません。でも、ファンシーパンに{登|のぼ}ったことがあります。', ro: 'Iie, arimasen. Demo, Fanshiipan ni nobotta koto ga arimasu.', vi: 'Chưa ạ. Nhưng em đã từng leo Fansipan.' },
        { who: 'Giám thị', role: 'examiner', text: 'ホーチミンへ{何回|なんかい}{行|い}ったことがありますか。', ro: 'Hoochimin e nankai itta koto ga arimasu ka.', vi: 'Em đã đi TP.HCM mấy lần rồi?' },
        { who: 'Bạn', role: 'candidate', text: '{2回|にかい}あります。{去年|きょねん}の{夏|なつ}も{行|い}きました。', ro: 'Nikai arimasu. Kyonen no natsu mo ikimashita.', vi: '2 lần ạ. Hè năm ngoái em cũng đi.' },
        { who: 'Giám thị', role: 'examiner', text: '{有名人|ゆうめいじん}に{会|あ}ったことがありますか。', ro: 'Yuumeijin ni atta koto ga arimasu ka.', vi: 'Em đã từng gặp người nổi tiếng chưa?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、あります。ハノイで{有名|ゆうめい}な{歌手|かしゅ}に{会|あ}いました。', ro: 'Hai, arimasu. Hanoi de yuumei na kashu ni aimashita.', vi: 'Rồi ạ. Em đã gặp một ca sĩ nổi tiếng ở Hà Nội.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở câu ～たことがありますか',
      items: [
        'Trả lời ngắn **はい、あります／いいえ、ありません** là đủ ý — rồi **thêm một câu** (khi nào, thế nào, muốn làm) để câu dài và ghi điểm.',
        'Nói thời điểm thì chuyển sang quá khứ thường: ~~去年の夏行ったことがあります~~ → **去年の夏行きました**.',
        '"Mấy lần" → **～回あります**; chưa lần nào → **1回もありません** (không phải ~~0回あります~~).',
        'Trợ từ theo động từ gốc: 山**に**登る, 人**に**会う, 国**へ**行く, ホテル**に**泊まる — giữ nguyên khi thêm ことがあります.',
      ],
    },

    /* ── Không tranh ② ── */
    { t: 'h', text: 'Câu hỏi không tranh ② — Thứ bạn giới thiệu (おすすめ)' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: おすすめ',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'ハノイのおすすめの{場所|ばしょ}はどこですか。', ro: 'Hanoi no osusume no basho wa doko desu ka.', vi: 'Nơi em giới thiệu ở Hà Nội là đâu?' },
        { who: 'Bạn', role: 'candidate', text: 'ホアンキエム{湖|こ}です。{町|まち}の{真|ま}ん{中|なか}にある{湖|みずうみ}です。{週末|しゅうまつ}は{夜|よる}、{湖|みずうみ}のまわりを{歩|ある}くことができます。', ro: 'Hoankiemu-ko desu. Machi no mannaka ni aru mizuumi desu. Shuumatsu wa yoru, mizuumi no mawari o aruku koto ga dekimasu.', vi: 'Là hồ Hoàn Kiếm ạ. Là cái hồ nằm ở giữa thành phố. Cuối tuần buổi tối có thể đi bộ quanh hồ.' },
        { who: 'Giám thị', role: 'examiner', text: 'ベトナムのおすすめの{料理|りょうり}は{何|なん}ですか。', ro: 'Betonamu no osusume no ryouri wa nan desu ka.', vi: 'Món ăn Việt Nam em giới thiệu là gì?' },
        { who: 'Bạn', role: 'candidate', text: 'ブンチャーです。{焼|や}いた{肉|にく}と{野菜|やさい}を{一緒|いっしょ}に{食|た}べる{料理|りょうり}です。{安|やす}くて、おいしいですよ。', ro: 'Bunchaa desu. Yaita niku to yasai o issho ni taberu ryouri desu. Yasukute, oishii desu yo.', vi: 'Là bún chả ạ. Là món ăn thịt nướng cùng với rau. Rẻ và ngon lắm.' },
        { who: 'Giám thị', role: 'examiner', text: 'よく{行|い}く{店|みせ}はどこですか。', ro: 'Yoku iku mise wa doko desu ka.', vi: 'Quán em hay đi là ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: '{私|わたし}がよく{行|い}く{店|みせ}は{学校|がっこう}の{近|ちか}くのカフェです。{静|しず}かで、{勉強|べんきょう}することができますから。', ro: 'Watashi ga yoku iku mise wa gakkou no chikaku no kafe desu. Shizuka de, benkyou suru koto ga dekimasu kara.', vi: 'Quán em hay đi là quán cà phê gần trường. Vì yên tĩnh và có thể học bài.' },
        { who: 'Giám thị', role: 'examiner', text: '{好|す}きな{歌手|かしゅ}は{誰|だれ}ですか。どんな{人|ひと}ですか。', ro: 'Suki na kashu wa dare desu ka. Donna hito desu ka.', vi: 'Ca sĩ em thích là ai? Là người thế nào?' },
        { who: 'Bạn', role: 'candidate', text: 'ソンタンMTPです。ベトナムの{若|わか}い{人|ひと}にとても{人気|にんき}がある{歌手|かしゅ}です。', ro: 'Sontan emutiipii desu. Betonamu no wakai hito ni totemo ninki ga aru kashu desu.', vi: 'Là Sơn Tùng M-TP ạ. Là ca sĩ rất được giới trẻ Việt Nam yêu thích.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở nhóm này',
      items: [
        'Khung trả lời: **tên** (「～」という N／N です) → **là N thế nào** (普通形 + N) → **lý do / làm được gì** (～から／～ことができます).',
        'Cụm bổ nghĩa giữ thể thường: ~~よく行きます店~~ → **よく行く店**; ~~人気がありますの歌手~~ → **人気がある歌手**.',
        'Tên tiếng Việt đọc theo katakana gần đúng là được (ブンチャー, ホアンキエム) — giám thị chấm ngữ pháp, không chấm cách phiên âm.',
      ],
    },

    /* ── Không tranh ③ ── */
    { t: 'h', text: 'Câu hỏi không tranh ③ — Có biết … không? Hôm nay mặc gì?' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: 知っていますか・着ています',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'この{近|ちか}くのおいしいレストランを{知|し}っていますか。', ro: 'Kono chikaku no oishii resutoran o shitte imasu ka.', vi: 'Em có biết nhà hàng ngon nào gần đây không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{知|し}っています。「フォー24」というレストランがおいしいですよ。', ro: 'Hai, shitte imasu. "Foo nijuuyon" to iu resutoran ga oishii desu yo.', vi: 'Có ạ. Nhà hàng tên "Phở 24" ngon lắm.' },
        { who: 'Giám thị', role: 'examiner', text: '{日本|にほん}の{歌|うた}を{知|し}っていますか。', ro: 'Nihon no uta o shitte imasu ka.', vi: 'Em có biết bài hát Nhật nào không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい。「さくら」という{歌|うた}を{知|し}っています。', ro: 'Hai. "Sakura" to iu uta o shitte imasu.', vi: 'Có ạ. Em biết bài hát tên "Sakura".' },
        { who: 'Giám thị', role: 'examiner', text: '{先生|せんせい}の{電話番号|でんわばんごう}を{知|し}っていますか。', ro: 'Sensei no denwa bangou o shitte imasu ka.', vi: 'Em có biết số điện thoại của cô không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{知|し}りません。', ro: 'Iie, shirimasen.', vi: 'Không ạ, em không biết.' },
        { who: 'Giám thị', role: 'examiner', text: '{今日|きょう}、{何|なに}を{着|き}ていますか。', ro: 'Kyou, nani o kite imasu ka.', vi: 'Hôm nay em đang mặc gì?' },
        { who: 'Bạn', role: 'candidate', text: '{白|しろ}いシャツを{着|き}ています。{黒|くろ}いズボンをはいています。', ro: 'Shiroi shatsu o kite imasu. Kuroi zubon o haite imasu.', vi: 'Em đang mặc áo sơ mi trắng. Mặc quần đen.' },
        { who: 'Giám thị', role: 'examiner', text: '{眼鏡|めがね}をかけていますか。', ro: 'Megane o kakete imasu ka.', vi: 'Em có đeo kính không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、かけていません。', ro: 'Iie, kakete imasen.', vi: 'Không ạ, em không đeo.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở nhóm này',
      items: [
        '"Không biết" = **いいえ、知りません** — cực kỳ hay bị trừ vì nói ~~知っていません~~.',
        '"Có biết" = **はい、知っています** + giới thiệu bằng **「～」という N** — câu dài, đủ ý.',
        'Hỏi 何を着ていますか → dùng đúng động từ cho từng món: シャツ **を着ています**, ズボン／スカート **をはいています**, 眼鏡 **をかけています**.',
        'Không mặc / không đeo → **～ていません** (かけていません), không phải ~~かけません~~.',
      ],
    },

    /* ── Có tranh ── */
    { t: 'h', text: 'Câu hỏi có tranh — nhóm người, quảng cáo cửa hàng' },
    {
      t: 'p',
      text: 'Tranh thi được viết lại thành bảng (không dùng ảnh). Với tranh Bài 13, giám thị hay hỏi: **N さんは{何|なに}を{着|き}ていますか · {誰|だれ}が～をかけていますか · ～さんはどの{人|ひと}ですか · ここはどんな{店|みせ}ですか · ここで{何|なに}を{売|う}っていますか**.',
    },
    {
      t: 'table',
      caption: 'Tranh 1 — bốn người đứng trước cổng trường',
      head: ['Tên', 'Trang phục'],
      rows: [
        ['ダニエル', 'áo sơ mi xanh, đeo cà vạt'],
        ['ワン', 'váy vàng, đội mũ trắng'],
        ['マルコ', 'áo sơ mi đỏ, đeo kính râm'],
        ['アンナ', 'áo trắng, quần xanh, đeo kính'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 1 — hỏi – đáp',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'ダニエルさんは{何|なに}を{着|き}ていますか。', ro: 'Danieru-san wa nani o kite imasu ka.', vi: 'Daniel đang mặc gì?' },
        { who: 'Bạn', role: 'candidate', text: '{青|あお}いシャツを{着|き}ています。ネクタイもしています。', ro: 'Aoi shatsu o kite imasu. Nekutai mo shite imasu.', vi: 'Anh ấy đang mặc áo sơ mi xanh. Còn đeo cà vạt nữa.' },
        { who: 'Giám thị', role: 'examiner', text: '{誰|だれ}が{帽子|ぼうし}をかぶっていますか。', ro: 'Dare ga boushi o kabutte imasu ka.', vi: 'Ai đang đội mũ?' },
        { who: 'Bạn', role: 'candidate', text: 'ワンさんが{帽子|ぼうし}をかぶっています。', ro: 'Wan-san ga boushi o kabutte imasu.', vi: 'Wang đang đội mũ ạ.' },
        { who: 'Giám thị', role: 'examiner', text: 'マルコさんはどの{人|ひと}ですか。', ro: 'Maruko-san wa dono hito desu ka.', vi: 'Marco là người nào?' },
        { who: 'Bạn', role: 'candidate', text: '{赤|あか}いシャツを{着|き}て、サングラスをかけている{人|ひと}です。', ro: 'Akai shatsu o kite, sangurasu o kakete iru hito desu.', vi: 'Là người mặc áo đỏ và đeo kính râm.' },
        { who: 'Giám thị', role: 'examiner', text: 'アンナさんはスカートをはいていますか。', ro: 'Anna-san wa sukaato o haite imasu ka.', vi: 'Anna có mặc váy không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、はいていません。{青|あお}いズボンをはいています。', ro: 'Iie, haite imasen. Aoi zubon o haite imasu.', vi: 'Không ạ. Chị ấy mặc quần xanh.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh 2 — quảng cáo trong tạp chí',
      head: ['Tên cửa hàng', 'Quảng cáo nói gì'],
      rows: [
        ['もみじ{屋|や}', 'quán nhậu · cá tươi · rẻ'],
        ['キャンディ', 'nhiều quần áo dễ thương · giới trẻ thích'],
        ['サカイ{電器|でんき}', 'đồ điện rẻ! · máy ảnh, máy tính, điện thoại'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 2 — hỏi – đáp',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'もみじ{屋|や}はどんな{店|みせ}ですか。', ro: 'Momijiya wa donna mise desu ka.', vi: 'Momijiya là quán thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{新鮮|しんせん}な{魚|さかな}を{食|た}べることができる{居酒屋|いざかや}です。{安|やす}いです。', ro: 'Shinsen na sakana o taberu koto ga dekiru izakaya desu. Yasui desu.', vi: 'Là quán nhậu có thể ăn cá tươi. Rẻ ạ.' },
        { who: 'Giám thị', role: 'examiner', text: 'キャンディで{何|なに}を{売|う}っていますか。', ro: 'Kyandi de nani o utte imasu ka.', vi: 'Candy bán gì?' },
        { who: 'Bạn', role: 'candidate', text: 'かわいい{服|ふく}をたくさん{売|う}っています。{若|わか}い{人|ひと}に{人気|にんき}がある{店|みせ}です。', ro: 'Kawaii fuku o takusan utte imasu. Wakai hito ni ninki ga aru mise desu.', vi: 'Bán rất nhiều quần áo dễ thương. Là cửa hàng được giới trẻ thích.' },
        { who: 'Giám thị', role: 'examiner', text: 'カメラを{買|か}いたいです。どの{店|みせ}がいいですか。', ro: 'Kamera o kaitai desu. Dono mise ga ii desu ka.', vi: 'Tôi muốn mua máy ảnh. Cửa hàng nào tốt?' },
        { who: 'Bạn', role: 'candidate', text: 'サカイ{電器|でんき}がいいですよ。{電気製品|でんきせいひん}が{安|やす}い{店|みせ}ですから。', ro: 'Sakai denki ga ii desu yo. Denki seihin ga yasui mise desu kara.', vi: 'Sakai Denki được đấy ạ. Vì là cửa hàng đồ điện rẻ.' },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo cho câu có tranh',
      items: [
        '"N は{何|なに}を{着|き}ていますか" → **N は** bỏ đi cũng được, nhưng động từ phải đúng món: **{着|き}て／はいて／かぶって／かけて／して います**.',
        '"{誰|だれ}が～ていますか" → **N が**～ています (giữ が của câu hỏi).',
        '"どの{人|ひと}ですか" → hai đặc điểm nối bằng thể て: {赤|あか}いシャツを{着|き}**て**、サングラスをかけている{人|ひと}です.',
        '"どんな{店|みせ}ですか" → **普通形 + {店|みせ}です** + một câu thêm (安いです／人気があります).',
      ],
    },

    /* ── Đóng vai ── */
    { t: 'h', text: 'Đóng vai — hỏi kinh nghiệm, hỏi thông tin (luyện hai người)' },
    {
      t: 'dialogue',
      title: 'Vai 1 — A sắp đón bố mẹ, hỏi B kinh nghiệm (やってみよう p.225)',
      lines: [
        { who: 'A', role: 'a', text: 'Bさん、{冬休|ふゆやす}みに{両親|りょうしん}が{来|き}ます。どこかいいところを{知|し}っていますか。', ro: 'B-san, fuyuyasumi ni ryoushin ga kimasu. Dokoka ii tokoro o shitte imasu ka.', vi: 'B ơi, nghỉ đông bố mẹ mình sang. Cậu biết chỗ nào hay không?' },
        { who: 'B', role: 'b', text: '{温泉|おんせん}はどうですか。{私|わたし}は{箱根|はこね}の{温泉|おんせん}へ{行|い}ったことがあります。とてもよかったですよ。', ro: 'Onsen wa dou desu ka. Watashi wa Hakone no onsen e itta koto ga arimasu. Totemo yokatta desu yo.', vi: 'Suối nước nóng thì sao? Mình đã từng đi suối nóng Hakone. Tuyệt lắm.' },
        { who: 'A', role: 'a', text: 'いいですね。どこに{泊|と}まりましたか。', ro: 'Ii desu ne. Doko ni tomarimashita ka.', vi: 'Hay đấy. Cậu đã trọ ở đâu?' },
        { who: 'B', role: 'b', text: '「やまなみ」というホテルです。{部屋|へや}から{富士山|ふじさん}が{見|み}えるホテルですよ。', ro: '"Yamanami" to iu hoteru desu. Heya kara Fujisan ga mieru hoteru desu yo.', vi: 'Khách sạn tên "Yamanami". Là khách sạn từ phòng nhìn thấy núi Phú Sĩ đấy.' },
        { who: 'A', role: 'a', text: 'へえ。いくらでしたか。', ro: 'Hee. Ikura deshita ka.', vi: 'Ồ. Hết bao nhiêu tiền?' },
        { who: 'B', role: 'b', text: '{1人|ひとり}{1万円|いちまんえん}くらいでした。', ro: 'Hitori ichiman en kurai deshita.', vi: 'Khoảng 10.000 yên một người.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Vai 2 — A là trưởng nhóm tiệc ngắm hoa, hỏi B thông tin (ロールプレイ p.233)',
      lines: [
        { who: 'A', role: 'a', text: 'Bさん、{来月|らいげつ}、クラスのみんなでお{花見|はなみ}をします。どこかいい{場所|ばしょ}を{知|し}っていますか。', ro: 'B-san, raigetsu, kurasu no minna de ohanami o shimasu. Dokoka ii basho o shitte imasu ka.', vi: 'B ơi, tháng sau cả lớp đi ngắm hoa. Cậu biết chỗ nào đẹp không?' },
        { who: 'B', role: 'b', text: 'ええ。「さくら{公園|こうえん}」はどうですか。{桜|さくら}がとてもきれいな{公園|こうえん}ですよ。', ro: 'Ee. "Sakura kouen" wa dou desu ka. Sakura ga totemo kirei na kouen desu yo.', vi: 'Có. Công viên "Sakura" thì sao? Là công viên hoa anh đào rất đẹp.' },
        { who: 'A', role: 'a', text: 'どこにありますか。', ro: 'Doko ni arimasu ka.', vi: 'Nó ở đâu?' },
        { who: 'B', role: 'b', text: '{駅|えき}の{近|ちか}くにあります。{駅|えき}から{歩|ある}いて{10分|じゅっぷん}です。', ro: 'Eki no chikaku ni arimasu. Eki kara aruite juppun desu.', vi: 'Gần ga. Từ ga đi bộ 10 phút.' },
        { who: 'A', role: 'a', text: '{飲|の}み{物|もの}や{食|た}べ{物|もの}はどこで{買|か}うことができますか。', ro: 'Nomimono ya tabemono wa doko de kau koto ga dekimasu ka.', vi: 'Đồ uống, đồ ăn thì mua được ở đâu?' },
        { who: 'B', role: 'b', text: '{公園|こうえん}の{前|まえ}に{大|おお}きいスーパーがありますよ。', ro: 'Kouen no mae ni ookii suupaa ga arimasu yo.', vi: 'Trước công viên có siêu thị lớn đấy.' },
      ],
    },

    /* ── Reading ── */
    { t: 'h', text: 'Đọc to — Reading (40 điểm)' },
    {
      t: 'p',
      text: 'Đề đọc dài khoảng 100–110 ký tự: **4 từ chữ Hán** gạch chân (12đ), **4 từ katakana** (12đ), còn lại hiragana (16đ, sai một ký tự −0,2đ). 30 giây chuẩn bị. Bốn đoạn dưới đây viết đúng khuôn đó, chỉ dùng từ Bài 1–13. Tắt furigana khi đã quen (hoặc luyện ở **Chữ Hán · Đọc không furigana**).',
    },
    {
      t: 'examples',
      items: [
        {
          en: 'わたしはきょねんのあき、ともだちときょうとへいきました。{紅葉|こうよう}がとてもきれいでした。えきからちかいホテルに{泊|と}まりました。サービスがよくて、りょうりもおいしかったです。ホテルでゆかたをきました。ジェットコースターやカラオケもたのしかったです。',
          ro: 'Watashi wa kyonen no aki, tomodachi to Kyouto e ikimashita. Kouyou ga totemo kirei deshita. Eki kara chikai hoteru ni tomarimashita. Saabisu ga yokute, ryouri mo oishikatta desu. Hoteru de yukata o kimashita. Jetto koosutaa ya karaoke mo tanoshikatta desu.',
          vi: 'Mùa thu năm ngoái tôi đi Kyoto với bạn. Lá đỏ rất đẹp. Chúng tôi ở khách sạn gần ga. Phục vụ tốt, đồ ăn cũng ngon. Ở khách sạn tôi đã mặc yukata. Tàu lượn và karaoke cũng vui.',
        },
        {
          en: 'わたしのおすすめは「キャンディ」というみせです。わかいひとに{人気|にんき}があるみせです。かわいいシャツやスカートをたくさん{売|う}っています。サングラスもやすいです。わたしはなんかいもいったことがあります。みなさんもぜひいってください。',
          ro: 'Watashi no osusume wa "Kyandi" to iu mise desu. Wakai hito ni ninki ga aru mise desu. Kawaii shatsu ya sukaato o takusan utte imasu. Sangurasu mo yasui desu. Watashi wa nankai mo itta koto ga arimasu. Minasan mo zehi itte kudasai.',
          vi: 'Thứ tôi giới thiệu là cửa hàng tên "Candy". Là cửa hàng được giới trẻ thích. Bán rất nhiều áo sơ mi và váy dễ thương. Kính râm cũng rẻ. Tôi đã đến nhiều lần. Mọi người cũng nhất định hãy đến nhé.',
        },
        {
          en: 'しゃしんのまんなかで{赤|あか}いぼうしをかぶっているひとがパクさんです。そのとなりでめがねをかけているひとはにしかわさんです。にしかわさんはネクタイをしています。{黄色|きいろ}いシャツをきているひとはマルコさんです。みんなパーティーでうたをうたいました。',
          ro: 'Shashin no mannaka de akai boushi o kabutte iru hito ga Paku-san desu. Sono tonari de megane o kakete iru hito wa Nishikawa-san desu. Nishikawa-san wa nekutai o shite imasu. Kiiroi shatsu o kite iru hito wa Maruko-san desu. Minna paatii de uta o utaimashita.',
          vi: 'Người đội mũ đỏ ở giữa ảnh là Park. Người đeo kính bên cạnh là anh Nishikawa. Anh Nishikawa đeo cà vạt. Người mặc áo vàng là Marco. Mọi người đã hát ở bữa tiệc.',
        },
        {
          en: 'らいげつ、クラスのみんなでバーベキューをします。わたしはリーダーですから、ばしょと{材料|ざいりょう}をさがしています。「ひかりこうえん」というこうえんがひろくていいです。にくはスーパーでかいます。みんなでサッカーの{練習|れんしゅう}もしたいです。',
          ro: 'Raigetsu, kurasu no minna de baabekyuu o shimasu. Watashi wa riidaa desu kara, basho to zairyou o sagashite imasu. "Hikari kouen" to iu kouen ga hirokute ii desu. Niku wa suupaa de kaimasu. Minna de sakkaa no renshuu mo shitai desu.',
          vi: 'Tháng sau cả lớp làm tiệc nướng. Tôi là trưởng nhóm nên đang tìm chỗ và nguyên liệu. Công viên tên "Hikari" rộng, rất được. Thịt thì mua ở siêu thị. Cả nhóm cũng muốn tập bóng đá cùng nhau.',
        },
      ],
    },
    {
      t: 'note',
      title: 'Chỗ dễ đọc sai trong bốn đoạn trên',
      items: [
        '**紅葉 こうよう**, **泊まりました とまりました**, **人気 にんき**, **売っています うっています**, **赤い あかい**, **黄色い きいろい**, **材料 ざいりょう**, **練習 れんしゅう** — từ chữ Hán dạng đề thi.',
        'Katakana kéo dài / âm ngắt: ジェットコースター jetto koosutaa, カラオケ, キャンディ kyandi, サングラス, ネクタイ, パーティー paatii, バーベキュー baabekyuu, リーダー riidaa, スーパー suupaa, サッカー sakkaa.',
        'Cụm bổ nghĩa đọc liền một hơi tới danh từ: **わかいひとににんきがある**みせ, **あかいぼうしをかぶっている**ひと — đừng ngắt giữa cụm.',
        'は đọc **wa**, を đọc **o**, へ đọc **e**: パクさん**は**, ぼうし**を**, きょうと**へ**.',
      ],
    },

    /* ── Tự ghi âm ── */
    { t: 'h', text: 'Tự ghi âm — trả lời không nhìn đáp án' },
    {
      t: 'speak',
      id: 'b13-noi-ghi-am',
      part: '1',
      questions: [
        'にほんへ いったことが ありますか。',
        'にほんの りょうりを たべたことが ありますか。',
        'ゆかたを きたことが ありますか。',
        'ホーチミンへ なんかい いったことが ありますか。',
        'ハノイの おすすめの ばしょは どこですか。',
        'ベトナムの おすすめの りょうりは なんですか。',
        'よく いく みせは どこですか。',
        'すきな かしゅは だれですか。どんな ひとですか。',
        'この ちかくの おいしい レストランを しっていますか。',
        'きょう、なにを きていますか。',
        'めがねを かけていますか。',
        'どこか いい こうえんを しっていますか。',
      ],
    },
  ],
};

/* ═══════════════════════════ 7. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b13-bai-tap',
  kind: 'homework',
  title: 'Bài tập về nhà — Bài 13 (có đáp án)',
  goal: 'Tự chia thể た, dịch, đổi dạng câu (kinh nghiệm, cụm bổ nghĩa danh từ, đang mặc), chọn trợ từ – từ vựng – câu đáp và ghép câu Bài 13 không cần nhìn bài học.',
  minutes: 50,
  blocks: [
    {
      t: 'p',
      text: 'Gõ tiếng Nhật bằng bộ gõ (gõ romaji, máy đổi sang kana). Chữ Hán hay kana đều được chấp nhận; dấu câu và dấu cách không tính. Nếu máy chấm sai mà bạn tin mình đúng, bấm **Hỏi gia sư** ngay dưới câu đó.',
    },
    {
      t: 'quiz',
      id: 'b13-bt-dich',
      title: 'Dịch sang tiếng Nhật',
      kind: 'translate',
      grammar: 'Vたことがあります · 1回も～ありません · 普通形＋N · Vています (mặc/đội/đeo) · 知っています／知りません · N1というN2',
      items: [
        { q: 'Tôi đã từng leo núi Phú Sĩ.', answers: V('{富士山|ふじさん}に{登|のぼ}ったことがあります。', '{私|わたし}は{富士山|ふじさん}に{登|のぼ}ったことがあります。'), hint: '富士山に, 登ります → 登った' },
        { q: 'Tôi chưa từng đi Hokkaido lần nào.', answers: V('{1回|いっかい}も{北海道|ほっかいどう}へ{行|い}ったことがありません。', '{北海道|ほっかいどう}へ{1回|いっかい}も{行|い}ったことがありません。', '{1回|いっかい}も{北海道|ほっかいどう}に{行|い}ったことがありません。', '{北海道|ほっかいどう}に{1回|いっかい}も{行|い}ったことがありません。'), hint: '1回も, 北海道, 行った' },
        { q: 'Bạn đã từng xem sumo chưa?', answers: V('{相撲|すもう}を{見|み}たことがありますか。'), hint: '相撲, 見た' },
        { q: 'Tôi đã từng ở khách sạn đó nhiều lần.', answers: V('そのホテルに{何回|なんかい}も{泊|と}まったことがあります。', '{何回|なんかい}もそのホテルに{泊|と}まったことがあります。'), hint: 'ホテルに, 何回も, 泊まった' },
        { q: 'Đây là tạp chí tôi hay đọc.', answers: V('これは{私|わたし}がよく{読|よ}む{雑誌|ざっし}です。'), hint: '私が よく 読む + 雑誌' },
        { q: 'Nhà hàng tôi hay đi ở Shibuya.', answers: V('{私|わたし}がよく{行|い}くレストランは{渋谷|しぶや}にあります。'), hint: '私が よく 行く レストラン は …にあります' },
        { q: 'Tôi đang tìm quán để cả nhóm đi nhậu.', answers: V('みんなで{飲|の}み{会|かい}をする{店|みせ}を{探|さが}しています。'), hint: 'みんなで, 飲み会をする + 店' },
        { q: 'Là cửa hàng bán đồ điện rẻ.', answers: V('{電気製品|でんきせいひん}が{安|やす}い{店|みせ}です。', '{電気製品|でんきせいひん}を{安|やす}く{売|う}っている{店|みせ}です。'), hint: '電気製品が安い + 店' },
        { q: 'Là quán nhậu có thể ăn cá tươi.', answers: V('{新鮮|しんせん}な{魚|さかな}を{食|た}べることができる{居酒屋|いざかや}です。', '{新鮮|しんせん}な{魚料理|さかなりょうり}を{食|た}べることができる{居酒屋|いざかや}です。'), hint: '新鮮な, 食べることができる + 居酒屋' },
        { q: 'Là cửa hàng bách hoá được giới trẻ yêu thích.', answers: V('{若|わか}い{人|ひと}に{人気|にんき}があるデパートです。'), hint: '若い人に 人気がある + デパート' },
        { q: 'Hôm nay anh Nishikawa mặc áo sơ mi vàng.', answers: V('{西川|にしかわ}さんは{今日|きょう}、{黄色|きいろ}いシャツを{着|き}ています。', '{今日|きょう}、{西川|にしかわ}さんは{黄色|きいろ}いシャツを{着|き}ています。'), hint: '黄色い, シャツを着ています' },
        { q: 'Park đang mặc váy đỏ.', answers: V('パクさんは{赤|あか}いスカートをはいています。'), hint: '赤い, スカートをはきます' },
        { q: 'Người đang đội mũ xanh là Marco.', answers: V('{青|あお}い{帽子|ぼうし}をかぶっている{人|ひと}はマルコさんです。', '{青|あお}い{帽子|ぼうし}をかぶっている{人|ひと}がマルコさんです。'), hint: '青い帽子を かぶっている + 人' },
        { q: 'Người đàn ông đang đeo kính là ai?', answers: V('{眼鏡|めがね}をかけている{男|おとこ}の{人|ひと}は{誰|だれ}ですか。'), hint: '眼鏡を かけている + 男の人' },
        { q: 'Bạn có biết quán nào được không? (ở đâu đó)', answers: V('どこかいい{店|みせ}を{知|し}っていますか。', 'どこかいいお{店|みせ}を{知|し}っていますか。'), hint: 'どこか, いい店, 知っています' },
        { q: 'Không, tôi không biết.', answers: V('いいえ、{知|し}りません。'), hint: '知りません (không phải 知っていません)' },
        { q: 'Nhà hàng tên Kitayama ngon lắm.', answers: V('{北山|きたやま}というレストランがいいですよ。', '{北山|きたやま}というレストランがおいしいですよ。', '「{北山|きたやま}」というレストランがいいですよ。', '「{北山|きたやま}」というレストランがおいしいですよ。'), hint: '北山 + という + レストラン' },
        { q: 'Đây là bài hát tên "Sakura".', answers: V('これは「さくら」という{歌|うた}です。', 'これはさくらという{歌|うた}です。'), hint: '「さくら」という歌' },
      ],
    },
    {
      t: 'quiz',
      id: 'b13-bt-doi-dang',
      title: 'Đổi dạng — viết lại theo yêu cầu (gõ chữ Hán hoặc kana)',
      kind: 'fill',
      grammar: 'ます → た (giống thể て: った／んだ／いた／いだ／した · nhóm 2: bỏ ます + た · した／来た) · たことがあります · 普通形＋N · ています',
      items: [
        { q: '{登|のぼ}ります → thể た', answers: V('{登|のぼ}った') },
        { q: '{泊|と}まります → thể た', answers: V('{泊|と}まった') },
        { q: '{行|い}きます → thể た', answers: V('{行|い}った') },
        { q: '{遊|あそ}びます → thể た', answers: V('{遊|あそ}んだ') },
        { q: '{着|き}ます (mặc) → thể た', answers: V('{着|き}た') },
        { q: 'デートします → thể た', answers: V('デートした') },
        { q: '{浴衣|ゆかた}を{着|き}ます → "đã từng" (～たことがあります)', answers: V('{浴衣|ゆかた}を{着|き}たことがあります') },
        { q: 'ジェットコースターに{乗|の}ります → "chưa lần nào" (1回も～)', answers: V('{1回|いっかい}もジェットコースターに{乗|の}ったことがありません', 'ジェットコースターに{1回|いっかい}も{乗|の}ったことがありません') },
        { q: '{私|わたし}はよく{雑誌|ざっし}を{読|よ}みます → "tạp chí tôi hay đọc" (…{雑誌|ざっし})', answers: V('{私|わたし}がよく{読|よ}む{雑誌|ざっし}') },
        { q: '{昨日|きのう}シャツを{買|か}いました → "cái áo hôm qua tôi mua" (…シャツ)', answers: V('{昨日|きのう}{買|か}ったシャツ', '{私|わたし}が{昨日|きのう}{買|か}ったシャツ') },
        { q: '{駅|えき}から{近|ちか}いです + ホテル → "khách sạn gần ga"', answers: V('{駅|えき}から{近|ちか}いホテル') },
        { q: '{紅葉|こうよう}がきれいです + ところ → "chỗ lá đỏ đẹp"', answers: V('{紅葉|こうよう}がきれいなところ', '{紅葉|こうよう}がきれいな{所|ところ}') },
        { q: '{帽子|ぼうし} → "đang đội" (～ています)', answers: V('{帽子|ぼうし}をかぶっています') },
        { q: '{眼鏡|めがね} → "đang đeo" (～ています)', answers: V('{眼鏡|めがね}をかけています') },
        { q: 'スカート → "đang mặc" (～ています)', answers: V('スカートをはいています') },
        { q: 'ネクタイ → "đang đeo" (～ています)', answers: V('ネクタイをしています') },
      ],
    },
    {
      t: 'mcq',
      id: 'b13-bt-tro-tu',
      title: 'Chọn trợ từ đúng',
      items: [
        { q: '{富士山|ふじさん}＿{登|のぼ}ったことがあります。', options: ['を', 'に', 'で', 'が'], correct: 1, why: 'Leo lên núi → **に**登ります.' },
        { q: '{京都|きょうと}のホテル＿{泊|と}まりました。', options: ['を', 'で', 'に', 'へ'], correct: 2, why: 'Trọ tại → **に**泊まります.' },
        { q: '{相撲|すもう}を{見|み}たこと＿ありますか。', options: ['を', 'が', 'に', 'は'], correct: 1, why: '～こと**が**あります (ポイント 108).' },
        { q: '{私|わたし}＿よく{行|い}く{店|みせ}は{新宿|しんじゅく}にあります。', options: ['は', 'が', 'を', 'に'], correct: 1, why: 'Chủ ngữ trong cụm bổ nghĩa → **が** (ポイント 109).' },
        { q: '{若|わか}い{人|ひと}＿{人気|にんき}がある{店|みせ}です。', options: ['が', 'を', 'に', 'で'], correct: 2, why: 'Được ai yêu thích → N **に**人気があります.' },
        { q: '{白|しろ}いシャツ＿{着|き}ている{人|ひと}です。', options: ['が', 'を', 'に', 'で'], correct: 1, why: 'Đồ mặc là tân ngữ → **を**着ています.' },
        { q: 'おいしいパン{屋|や}＿{知|し}っていますか。', options: ['が', 'に', 'を', 'で'], correct: 2, why: 'N **を**知っています (ポイント 111).' },
        { q: '「さくら」＿いう{歌|うた}です。', options: ['を', 'と', 'が', 'の'], correct: 1, why: 'N1 **と**いう N2 (ポイント 112).' },
        { q: '{紅葉|こうよう}がきれい＿ところはどこですか。', options: ['だ', 'な', 'の', 'に'], correct: 1, why: 'ナA trước danh từ → **な**.' },
        { q: 'みんな＿{飲|の}み{会|かい}をします。', options: ['が', 'で', 'に', 'を'], correct: 1, why: 'Cả nhóm cùng nhau → みんな**で**.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b13-bt-tu-vung',
      title: 'Chọn từ đúng',
      items: [
        { q: '{眼鏡|めがね}を＿います。', options: ['{着|き}て', 'はいて', 'かけて', 'かぶって'], correct: 2, why: 'Kính → **かけます**.' },
        { q: '{帽子|ぼうし}を＿います。', options: ['かぶって', 'かけて', 'して', '{着|き}て'], correct: 0, why: 'Mũ → **かぶります**.' },
        { q: 'ネクタイを＿います。', options: ['{着|き}て', 'はいて', 'して', 'かぶって'], correct: 2, why: 'Cà vạt → **します**.' },
        { q: 'ズボンを＿います。', options: ['はいて', '{着|き}て', 'かけて', 'して'], correct: 0, why: 'Đồ phần dưới → **はきます**.' },
        { q: 'このホテルは＿がいいです。ホテルの{人|ひと}がとても{親切|しんせつ}です。', options: ['{人気|にんき}', 'サービス', '{紅葉|こうよう}', '{材料|ざいりょう}'], correct: 1, why: 'Phục vụ tốt → **サービス**がいい.' },
        { q: 'この{魚|さかな}は＿で、おいしいです。', options: ['{若|わか}い', '{新鮮|しんせん}', '{黄色|きいろ}い', '{人気|にんき}'], correct: 1, why: 'Cá tươi → **{新鮮|しんせん}**で (ナA).' },
        { q: 'ジェットコースターに{乗|の}りたいです。＿へ{行|い}きましょう。', options: ['{遊園地|ゆうえんち}', 'ホテル', '{電気製品|でんきせいひん}', '{材料|ざいりょう}'], correct: 0, why: 'Tàu lượn ở **{遊園地|ゆうえんち}**.' },
        { q: 'あの{店|みせ}はパソコンやカメラなどの＿が{安|やす}いです。', options: ['{浴衣|ゆかた}', '{電気製品|でんきせいひん}', '{帽子|ぼうし}', 'サービス'], correct: 1, why: 'Máy tính, máy ảnh = **{電気製品|でんきせいひん}**.' },
        { q: 'カレーの＿を{買|か}いに{行|い}きます。', options: ['{場所|ばしょ}', '{材料|ざいりょう}', 'デート', '{紅葉|こうよう}'], correct: 1, why: 'Nguyên liệu nấu cà ri → **{材料|ざいりょう}**.' },
        { q: '{沖縄|おきなわ}へ{行|い}ったことがありません。＿{行|い}ったことがありません。', options: ['{何回|なんかい}も', '{1回|いっかい}も', 'よく', 'ときどき'], correct: 1, why: 'Chưa lần nào → **{1回|いっかい}も** + phủ định.' },
        { q: 'この{映画|えいが}が{大好|だいす}きです。＿{見|み}ました。', options: ['{1回|いっかい}も', '{何回|なんかい}も', 'どこか', 'みんなで'], correct: 1, why: 'Thích lắm → xem **nhiều lần** = {何回|なんかい}も.' },
        { q: '＿いい{公園|こうえん}を{知|し}っていますか。', options: ['どこ', 'どこか', 'どれ', 'どんな'], correct: 1, why: '"Chỗ nào đó" (trả lời có/không) → **どこか**.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b13-bt-hoi-dap',
      title: 'Chọn câu đáp đúng',
      items: [
        { q: 'A：{北海道|ほっかいどう}へ{行|い}ったことがありますか。 (B đã đi 3 lần)', options: ['はい、{3回|さんかい}あります。', 'はい、{3回|さんかい}{行|い}きます。', 'いいえ、{3回|さんかい}ありません。', 'はい、{行|い}くことがあります。'], correct: 0, why: '**{3回|さんかい}あります** (ポイント 108).' },
        { q: 'A：{相撲|すもう}を{見|み}たことがありますか。 (B chưa bao giờ)', options: ['いいえ、{見|み}ませんでした。', 'いいえ、{1回|いっかい}もありません。', 'いいえ、まだ{見|み}ます。', 'はい、ありません。'], correct: 1, why: 'Chưa từng → **いいえ、{1回|いっかい}もありません**.' },
        { q: 'A：いいホテルを{知|し}っていますか。 (B không biết)', options: ['いいえ、{知|し}っていません。', 'いいえ、{知|し}りません。', 'いいえ、わかりませんでした。', 'はい、{知|し}りません。'], correct: 1, why: '**{知|し}りません** (ポイント 111).' },
        { q: 'A：どこかいいお{店|みせ}を{知|し}っていますか。', options: ['ええ、「わいわい」はどうですか。{料理|りょうり}がおいしいですよ。', 'はい、どこかです。', 'はい、{知|し}ります。', 'ええ、どこですか。'], correct: 0, why: 'Biết → giới thiệu luôn tên + lý do.' },
        { q: 'A：「もみじ{屋|や}」を{知|し}っていますか。 (B chưa nghe tên này)', options: ['もみじや？', 'はい、もみじ{屋|や}です。', 'もみじ{屋|や}をください。', 'いいえ、もみじ{屋|や}じゃありません。'], correct: 0, why: 'Nhắc lại tên, lên giọng → A sẽ giải thích (ポイント 112).' },
        { q: 'A：{山下|やました}ショウはどの{人|ひと}ですか。', options: ['{白|しろ}いシャツを{着|き}ている{人|ひと}です。', '{白|しろ}いシャツを{着|き}ます。', '{白|しろ}いシャツの{人|ひと}を{着|き}ています。', '{山下|やました}ショウは{人|ひと}です。'], correct: 0, why: '**～ている{人|ひと}です** (ポイント 109 + 110).' },
        { q: 'A：もみじ{屋|や}はどんな{店|みせ}ですか。', options: ['{新鮮|しんせん}な{魚|さかな}を{食|た}べることができる{店|みせ}です。', '{新鮮|しんせん}な{魚|さかな}を{食|た}べることができます{店|みせ}です。', 'もみじ{屋|や}という{店|みせ}です。', 'はい、いい{店|みせ}です。'], correct: 0, why: 'Cụm bổ nghĩa ở thể thường: ことが**できる**{店|みせ}.' },
      ],
    },
    {
      t: 'build',
      id: 'b13-bt-ghep',
      title: 'Ghép câu — hỏi kinh nghiệm, giới thiệu, chỉ người',
      items: [
        { vi: 'Chị đã từng xem sumo chưa?', chips: ['{相撲|すもう}を', '{見|み}た', 'ことが', 'ありますか', '{見|み}る', 'のが'], answer: ['{相撲|すもう}を', '{見|み}た', 'ことが', 'ありますか'], ro: 'Sumou o mita koto ga arimasu ka.' },
        { vi: 'Rồi, tôi đã xem nhiều lần.', chips: ['はい、', '{何回|なんかい}も', '{見|み}ました', '{1回|いっかい}も', '{見|み}ません'], answer: ['はい、', '{何回|なんかい}も', '{見|み}ました'], ro: 'Hai, nankai mo mimashita.' },
        { vi: 'Vé máy bay bao nhiêu tiền?', chips: ['{飛行機|ひこうき}の', 'チケットは', 'いくら', 'でしたか', 'を', 'どこ'], answer: ['{飛行機|ひこうき}の', 'チケットは', 'いくら', 'でしたか'], ro: 'Hikouki no chiketto wa ikura deshita ka.' },
        { vi: 'Bạn có biết khách sạn nào phục vụ tốt không?', chips: ['サービスが', 'いい', 'ホテルを', '{知|し}っていますか', 'ホテルが', '{知|し}りますか'], answer: ['サービスが', 'いい', 'ホテルを', '{知|し}っていますか'], ro: 'Saabisu ga ii hoteru o shitte imasu ka.' },
        { vi: 'Bánh tên Yatsuhashi nổi tiếng lắm.', chips: ['{八|や}つ{橋|はし}', 'という', 'お{菓子|かし}が', '{有名|ゆうめい}ですよ', 'の', 'お{菓子|かし}を'], answer: ['{八|や}つ{橋|はし}', 'という', 'お{菓子|かし}が', '{有名|ゆうめい}ですよ'], ro: 'Yatsuhashi to iu okashi ga yuumei desu yo.' },
        { vi: 'Candy là cửa hàng có nhiều quần áo dễ thương.', chips: ['キャンディは', 'かわいい{服|ふく}が', 'たくさん', 'ある', '{店|みせ}です', 'あります', 'キャンディが'], answer: ['キャンディは', 'かわいい{服|ふく}が', 'たくさん', 'ある', '{店|みせ}です'], ro: 'Kyandi wa kawaii fuku ga takusan aru mise desu.' },
        { vi: 'Người đang đội mũ đỏ là ai?', chips: ['{赤|あか}い', '{帽子|ぼうし}を', 'かぶっている', '{人|ひと}は', '{誰|だれ}ですか', 'かけている'], answer: ['{赤|あか}い', '{帽子|ぼうし}を', 'かぶっている', '{人|ひと}は', '{誰|だれ}ですか'], ro: 'Akai boushi o kabutte iru hito wa dare desu ka.' },
        { vi: 'Tôi đang tìm công viên có thể nướng thịt.', chips: ['バーベキューが', 'できる', '{公園|こうえん}を', '{探|さが}しています', 'できます', '{公園|こうえん}に'], answer: ['バーベキューが', 'できる', '{公園|こうえん}を', '{探|さが}しています'], ro: 'Baabekyuu ga dekiru kouen o sagashite imasu.' },
        { vi: 'Ồ, vậy à. Nó ở đâu?', chips: ['へえ、', 'そうですか。', 'どこに', 'ありますか', 'どこか', 'いますか'], answer: ['へえ、', 'そうですか。', 'どこに', 'ありますか'], ro: 'Hee, sou desu ka. Doko ni arimasu ka.' },
        { vi: 'Trò chơi hay chơi ở tiệc là gì?', chips: ['パーティーで', 'よく', 'する', 'ゲームは', '{何|なん}ですか', 'します', 'ゲームが'], answer: ['パーティーで', 'よく', 'する', 'ゲームは', '{何|なん}ですか'], ro: 'Paatii de yoku suru geemu wa nan desu ka.' },
      ],
    },
  ],
};

export const BAI_13: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, KANJI, NGHE, NOI, BAI_TAP];

/* ═══════════════════ 📖 THEO SÁCH — Bài 13 (p.221–236) ═══════════════════
 * Cùng khuôn với ./sach2.ts: mỗi trang = tiêu đề (số trang + mục) → tả tranh bằng lời
 * của mình + mục tiêu できる → cô hỏi–bạn đáp → mẹo trả lời (chỉ tới ポイント và mục
 * trên web) → câu mẫu cho từng số của 言ってみよう. KHÔNG ghi đáp án CD やってみよう.
 * Người học mẫu: "ミン" (Minh), sinh viên Việt ở ĐH FPT, quê Hà Nội.
 */

type SLine = Extract<Block, { t: 'dialogue' }>['lines'][number];
type SEx = { en: string; ro: string; vi: string };

/** Cô giáo hỏi. */
const C = (text: string, ro: string, vi: string): SLine => ({ who: 'Cô giáo', role: 'examiner', text, ro, vi });
/** Bạn trả lời. */
const S = (text: string, ro: string, vi: string): SLine => ({ who: 'Bạn', role: 'candidate', text, ro, vi });
const E = (en: string, ro: string, vi: string): SEx => ({ en, ro, vi });

/** Một trang (hoặc một cặp trang): tiêu đề → tả tranh/mục đích → [khối thêm] → cô hỏi–bạn đáp → mẹo. */
function trang(h: string, p: string, lines: SLine[], meo: string[], extra: Block[] = []): Block[] {
  return [
    { t: 'h', text: h },
    { t: 'p', text: p },
    ...extra,
    { t: 'dialogue', title: 'Cô hỏi — bạn trả lời', lines },
    { t: 'note', title: 'Mẹo trả lời', items: meo },
  ];
}

/** Danh sách câu mẫu cho từng số / từng gợi ý của 言ってみよう. */
const mau = (items: SEx[]): Block => ({ t: 'examples', items });

const CACH_DUNG: Block = {
  t: 'note',
  title: 'Dùng phần này thế nào',
  items: [
    'Mở sách đúng trang ghi ở tiêu đề, nhìn tranh trước, rồi mới đọc phần tả tranh ở đây.',
    'Bấm nghe đoạn "Cô hỏi — bạn trả lời", đọc to phần của **Bạn** 3 lần, sau đó che đáp án và tự trả lời khi nghe câu hỏi.',
    'Luôn trả lời **đủ câu**, có です／ます ở cuối, câu hỏi có/không thì mở đầu bằng **はい／いいえ** (thi JPD trừ điểm nếu quên).',
    'Không nghe rõ câu cô hỏi: nói **もう{一度|いちど}お{願|ねが}いします** hoặc **ゆっくりお{願|ねが}いします**.',
    'Bài nghe やってみよう: ở đây KHÔNG ghi đáp án CD — chỉ ghi cần bắt từ nào. Nghe trên lớp rồi tự điền.',
    'Chỗ nào có tên ミン (Minh), ハノイ (Hà Nội), FPT{大学|だいがく}… là thông tin mẫu — thay bằng thông tin THẬT của bạn.',
    'Dòng dịch "VI" dưới mỗi mục tiêu / tình huống trong sách (p.222, 223, 226, 227, 230, 231) thực ra là **tiếng Hàn** (lỗi in / chung khuôn 4 thứ tiếng) — bỏ qua, dùng phần tả bằng tiếng Việt ở đây.',
  ],
};

export const SACH_13: Lesson = {
  id: 'b13-sach',
  kind: 'review',
  title: 'Theo sách — Bài 13 (trang 221–236)',
  goal: 'Nhìn tranh buổi giao lưu, ký túc xá, quán cà phê trong sách là nói được: đã từng / chưa từng, hỏi thông tin từ kinh nghiệm của bạn, giới thiệu quán – nơi chơi – người nổi tiếng bằng cụm bổ nghĩa, chỉ người theo trang phục, và hỏi để tìm chỗ phù hợp.',
  minutes: 60,
  blocks: [
    CACH_DUNG,

    ...trang(
      'Trang 221 · 話してみよう・聞いてみよう — Mở bài 私のおすすめ',
      '**話してみよう** — 4 ảnh không lời: (1) một chồng hộp đĩa CD / DVD (nhạc, phim), một chiếc đĩa nằm phía trước; (2) ba người bạn trẻ (hai nữ một nam) chụm đầu, bạn nam giơ máy ảnh chụp cả nhóm; (3) ảnh ghép: nửa trên một đôi nam nữ đứng ngắm thành phố bên kia mặt nước (chỗ hẹn hò ngắm cảnh), nửa dưới mấy đôi chân ngâm trong bể **tắm chân nước nóng** (足湯) và người ngâm mình trong suối nóng; (4) **tàu lượn siêu tốc** chở đầy khách đang lộn vòng, phía sau có **vòng đu quay** — công viên giải trí. Mục đích: nói về phim, nhạc, nơi đi chơi, nơi hẹn hò **mình giới thiệu**. **聞いてみよう** (CD C31): nghe trước đoạn hội thoại dài của bài — chính là trang 236.',
      [
        C('（ảnh 4）ここはどこですか。', '(shashin 4) Koko wa doko desu ka.', '(ảnh 4) Đây là đâu?'),
        S('{遊園地|ゆうえんち}です。ジェットコースターがあります。', 'Yuuenchi desu. Jetto koosutaa ga arimasu.', 'Là công viên giải trí ạ. Có tàu lượn siêu tốc.'),
        C('ミンさんはジェットコースターに{乗|の}ったことがありますか。', 'Min-san wa jetto koosutaa ni notta koto ga arimasu ka.', 'Minh đã từng đi tàu lượn chưa?'),
        S('はい、あります。{去年|きょねん}、ダナンで{乗|の}りました。', 'Hai, arimasu. Kyonen, Danan de norimashita.', 'Rồi ạ. Năm ngoái em đi ở Đà Nẵng.'),
        C('（ảnh 3）デートにいい{場所|ばしょ}はどこですか。', '(shashin 3) Deeto ni ii basho wa doko desu ka.', '(ảnh 3) Chỗ nào hợp để hẹn hò?'),
        S('{夜景|やけい}がきれいなところがいいです。', 'Yakei ga kirei na tokoro ga ii desu.', 'Chỗ có cảnh đêm đẹp thì được ạ.'),
        C('（ảnh 1）ミンさんのおすすめの{映画|えいが}は{何|なん}ですか。', '(shashin 1) Min-san no osusume no eiga wa nan desu ka.', '(ảnh 1) Phim Minh giới thiệu là phim gì?'),
        S('「ドラえもん」という{映画|えいが}です。{子|こ}どもも{大人|おとな}も{見|み}ることができる{映画|えいが}です。', '"Doraemon" to iu eiga desu. Kodomo mo otona mo miru koto ga dekiru eiga desu.', 'Là phim tên "Doraemon" ạ. Là phim cả trẻ con lẫn người lớn đều xem được.'),
      ],
      [
        'Hỏi kinh nghiệm → **はい、あります／いいえ、ありません** + một câu (khi nào, ở đâu) — ポイント 108.',
        'Giới thiệu phim / nơi → **「～」という N です** (ポイント 112) + **N はこんな～N です** bằng cụm bổ nghĩa (ポイント 109).',
        '夜景 (cảnh đêm), 大人 (người lớn) là từ tự thêm cho câu mẫu — có thể thay bằng きれいな{公園|こうえん}.',
        'Xem **Hội thoại · Bức tranh chung của bài** và **Ngữ pháp · ポイント 108, 109, 112**.',
      ],
    ),

    ...trang(
      'Trang 222–223 · チャレンジ! {経験|けいけん}から',
      'Trang 222: tình huống — **đang nói chuyện với người Nhật mới quen ở buổi giao lưu** (交流会). Tranh: biển "さくらセンター" trên cửa kính, bảng tin dán hai tờ thông báo. Ô (1): bong bóng "**来月**" + hình người ngồi ghế máy bay, mũi tên "**両親**" với hình bố mẹ trên máy bay — tháng sau bố mẹ sang; bong bóng nét chấm: gia đình ba người → trận **sumo**; bong bóng nhỏ có tấm **vé** và "?" — hỏi mua vé thế nào; bong bóng "**インターネット**" — trả lời: mua trên mạng. Hai người (một nam một nữ) đang nói chuyện. Ô (2): xem sumo xong ▶ **浅草** (cổng chùa treo đèn lồng); bong bóng "浅草" + hình **nhà hàng** (biển dao nĩa) và "?" — ở Asakusa có nhà hàng nào ngon không. Ô (3): bong bóng "**すみだ**" + hình một quán có biển "すみだ" — giới thiệu quán tên Sumida. Trang 223: tranh lớn quầy bar ở buổi giao lưu, một nam một nữ ngồi ghế cao cầm cốc nói chuyện, một anh đeo túi đi ngang, phía sau một chị ôm tập tờ rơi đứng cạnh bảng trắng. **Mục tiêu できる:** lấy được thông tin mình muốn biết từ kinh nghiệm của bạn, và kể kinh nghiệm của mình cho bạn. ☞ ポイント 108, 111, 112.',
      [
        C('ミンさん、{来月|らいげつ}{何|なに}がありますか。', 'Min-san, raigetsu nani ga arimasu ka.', 'Minh, tháng sau có chuyện gì?'),
        S('{来月|らいげつ}、ベトナムから{両親|りょうしん}が{来|き}ます。{両親|りょうしん}と{相撲|すもう}を{見|み}たいです。', 'Raigetsu, Betonamu kara ryoushin ga kimasu. Ryoushin to sumou o mitai desu.', 'Tháng sau bố mẹ em từ Việt Nam sang. Em muốn xem sumo với bố mẹ.'),
        C('{私|わたし}は{相撲|すもう}を{何回|なんかい}も{見|み}たことがありますよ。', 'Watashi wa sumou o nankai mo mita koto ga arimasu yo.', 'Cô đã xem sumo nhiều lần rồi đấy.'),
        S('そうですか。チケットはどこで{買|か}いましたか。', 'Sou desu ka. Chiketto wa doko de kaimashita ka.', 'Vậy ạ. Cô mua vé ở đâu ạ?'),
        C('インターネットで{買|か}いました。', 'Intaanetto de kaimashita.', 'Cô mua trên mạng.'),
        S('{浅草|あさくさ}においしいレストランがありますか。', 'Asakusa ni oishii resutoran ga arimasu ka.', 'Ở Asakusa có nhà hàng nào ngon không ạ?'),
        C('ええ、「すみだ」という{店|みせ}がいいですよ。', 'Ee, "Sumida" to iu mise ga ii desu yo.', 'Có, quán tên "Sumida" được lắm.'),
        S('すみだ？どんな{店|みせ}ですか。', 'Sumida? Donna mise desu ka.', 'Sumida ạ? Là quán thế nào ạ?'),
      ],
      [
        '**ポイント 108 ～たことがあります** (đã từng) · **ポイント 111 知っています／知りません** · **ポイント 112 ～というN** (tên lạ).',
        'Thứ tự lấy thông tin: **nói hoàn cảnh** (来月両親が来ます) → **hỏi kinh nghiệm** (～たことがありますか) → **hỏi chi tiết bằng quá khứ** (どこで買いましたか・いくらでしたか) → **hỏi giới thiệu** (いいレストランを知っていますか).',
        'Nghe tên lạ → **nhắc lại tên + ？** rồi hỏi **どんな店ですか**.',
        'Xem **Hội thoại · ① 経験から** và **Ngữ pháp · ポイント 108**.',
      ],
    ),

    ...trang(
      'Trang 224 · 言ってみよう (chủ đề 1) — Số 1: ～たことがありますか · Số 2: ～という N',
      '**Số 1:** "tháng sau bố mẹ sang nên tôi muốn đi … . B đã từng đi … chưa?" → "rồi, tháng trước" → hỏi thêm một chi tiết (vé bao nhiêu…) → trả lời: 例 **Okinawa** (hình cổng đền và cây nhiệt đới); ① **ふじまるランド** (công viên giải trí có đu quay); ② **núi Phú Sĩ** (núi tuyết); ③ **sumo** (hai đô vật, khán giả); ④ **Kyoto** (hình chùa). **Số 2:** "tôi sẽ đi Kyoto với gia đình. B có biết … không?" → "có, … tên là … được đấy" → cảm ơn. Bảng gợi ý của số 2 nằm ở trang 225. Lề trang có lại hai ô truyện (2) và (3) của trang 222.',
      [
        C('ミンさん、{富士山|ふじさん}に{登|のぼ}ったことがありますか。', 'Min-san, Fujisan ni nobotta koto ga arimasu ka.', 'Minh đã từng leo núi Phú Sĩ chưa?'),
        S('いいえ、{1回|いっかい}もありません。{先生|せんせい}は{登|のぼ}ったことがありますか。', 'Iie, ikkai mo arimasen. Sensei wa nobotta koto ga arimasu ka.', 'Chưa ạ, chưa lần nào. Cô đã từng leo chưa ạ?'),
        C('はい、{去年|きょねん}{登|のぼ}りました。', 'Hai, kyonen noborimashita.', 'Rồi, năm ngoái cô leo.'),
        S('そうですか。{何時間|なんじかん}ぐらいかかりましたか。', 'Sou desu ka. Nanjikan gurai kakarimashita ka.', 'Vậy ạ. Mất khoảng mấy tiếng ạ?'),
        C('{6時間|ろくじかん}ぐらいかかりました。', 'Rokujikan gurai kakarimashita.', 'Mất khoảng 6 tiếng.'),
      ],
      [
        'Số 1: chia **thể た** của động từ hợp với nơi: 行きます → **行った** (Okinawa, Kyoto, ふじまるランド) · 登ります → **登った** (Phú Sĩ) · 見ます → **見た** (sumo).',
        'Câu hỏi thêm (có ♪ trong sách) là **quá khứ thường**: チケットはいくらでしたか · 何時間ぐらいかかりましたか · どうでしたか.',
        'Xem **Ngữ pháp · ポイント 108 — bảng thay thế**.',
      ],
      [
        mau([
          E('{来月|らいげつ}、{国|くに}から{両親|りょうしん}が{来|き}ますから、{沖縄|おきなわ}へ{行|い}きたいです。Bさんは{沖縄|おきなわ}へ{行|い}ったことがありますか。— はい、あります。{先月|せんげつ}{行|い}きました。— {飛行機|ひこうき}のチケットはいくらでしたか。— {4万円|よんまんえん}ぐらいでした。', 'Raigetsu, kuni kara ryoushin ga kimasu kara, Okinawa e ikitai desu. B-san wa Okinawa e itta koto ga arimasu ka. — Hai, arimasu. Sengetsu ikimashita. — Hikouki no chiketto wa ikura deshita ka. — Yonman en gurai deshita.', 'Số 1 例 — Okinawa (giá vé tự đặt).'),
          E('Bさんはふじまるランドへ{行|い}ったことがありますか。— はい、あります。— {何|なに}がおもしろかったですか。— ジェットコースターがおもしろかったです。', 'B-san wa Fujimaru Rando e itta koto ga arimasu ka. — Hai, arimasu. — Nani ga omoshirokatta desu ka. — Jetto koosutaa ga omoshirokatta desu.', 'Số 1 ① — ふじまるランド.'),
          E('Bさんは{富士山|ふじさん}に{登|のぼ}ったことがありますか。— はい、あります。— {何時間|なんじかん}ぐらいかかりましたか。— {6時間|ろくじかん}ぐらいかかりました。', 'B-san wa Fujisan ni nobotta koto ga arimasu ka. — Hai, arimasu. — Nanjikan gurai kakarimashita ka. — Rokujikan gurai kakarimashita.', 'Số 1 ② — núi Phú Sĩ.'),
          E('Bさんは{相撲|すもう}を{見|み}たことがありますか。— はい、あります。— チケットはどこで{買|か}いましたか。— インターネットで{買|か}いました。', 'B-san wa sumou o mita koto ga arimasu ka. — Hai, arimasu. — Chiketto wa doko de kaimashita ka. — Intaanetto de kaimashita.', 'Số 1 ③ — sumo.'),
          E('Bさんは{京都|きょうと}へ{行|い}ったことがありますか。— はい、あります。— どこがよかったですか。— お{寺|てら}がとてもきれいでした。', 'B-san wa Kyouto e itta koto ga arimasu ka. — Hai, arimasu. — Doko ga yokatta desu ka. — Otera ga totemo kirei deshita.', 'Số 1 ④ — Kyoto.'),
          E('{家族|かぞく}と{京都|きょうと}へ{旅行|りょこう}に{行|い}きます。Bさんはおいしいレストランを{知|し}っていますか。— ええ、{北山|きたやま}というレストランがいいですよ。— そうですか。ありがとうございます。', 'Kazoku to Kyouto e ryokou ni ikimasu. B-san wa oishii resutoran o shitte imasu ka. — Ee, Kitayama to iu resutoran ga ii desu yo. — Sou desu ka. Arigatou gozaimasu.', 'Số 2 例 (các số ①–④ ở trang 225).'),
        ]),
      ],
    ),

    ...trang(
      'Trang 225 · 言ってみよう số 2 (bảng) · やってみよう · ■ hỏi bạn cùng lớp (chủ đề 1)',
      '**Bảng số 2** (trái: điều muốn hỏi — phải: tên + loại): 例 nhà hàng ngon → 北山・nhà hàng; ① **khách sạn phục vụ tốt** → ロイヤル・khách sạn; ② **quà nổi tiếng của Kyoto** → 八つ橋・bánh kẹo (hình hộp bánh tam giác); ③ **rượu ngon** → 都・rượu (chén và chai rượu); ④ **chỗ lá đỏ đẹp** → 清水寺・chùa (chùa trên sườn đồi). **やってみよう** (CD C35): (1) thứ được giới thiệu là gì (2 thứ); (2) người hỏi đã đặt **câu hỏi gì** để lấy thông tin. **■** Hỏi bạn cùng lớp nên làm gì / đi đâu khi: ⓐ bố mẹ sang; ⓑ đi hẹn hò; ⓒ muốn nghỉ ngơi thong thả; ⓓ về nước nên mua quà; ⓔ nghỉ hè / nghỉ đông đi du lịch.',
      [
        C('サービスがいいホテルを{知|し}っていますか。', 'Saabisu ga ii hoteru o shitte imasu ka.', 'Em có biết khách sạn nào phục vụ tốt không?'),
        S('ええ、ロイヤル・ホテルがいいですよ。', 'Ee, Roiyaru hoteru ga ii desu yo.', 'Có ạ, khách sạn Royal được lắm.'),
        C('ⓓ {国|くに}へ{帰|かえ}ります。お{土産|みやげ}はどこで{買|か}ったらいいですか。', 'Kuni e kaerimasu. Omiyage wa doko de kattara ii desu ka.', 'ⓓ Cô sắp về nước. Quà nên mua ở đâu?'),
        S('{空港|くうこう}の{店|みせ}がいいですよ。{日本|にほん}の{有名|ゆうめい}なお{菓子|かし}がたくさんありますから。', 'Kuukou no mise ga ii desu yo. Nihon no yuumei na okashi ga takusan arimasu kara.', 'Cửa hàng ở sân bay được đấy ạ. Vì có nhiều bánh kẹo nổi tiếng của Nhật.'),
        C('ⓑ デートをします。どこがいいですか。', 'Deeto o shimasu. Doko ga ii desu ka.', 'ⓑ Cô đi hẹn hò. Chỗ nào được?'),
        S('ふじまるランドはどうですか。ジェットコースターや{観覧車|かんらんしゃ}に{乗|の}ることができますよ。', 'Fujimaru Rando wa dou desu ka. Jetto koosutaa ya kanransha ni noru koto ga dekimasu yo.', 'Fujimaru Land thì sao ạ? Có thể đi tàu lượn và đu quay đấy.'),
      ],
      [
        'Bảng số 2: **[điều muốn hỏi] を知っていますか** → **[tên] という [loại] がいいですよ／有名ですよ／おいしいですよ**.',
        'Điều muốn hỏi thường là một **cụm bổ nghĩa** (サービスがいいホテル, 紅葉がきれいなところ) — ポイント 109.',
        'Câu cô hỏi "～たらいいですか" (nên … thì tốt) là mẫu của Bài 15 — ở Bài 13 chỉ cần nghe hiểu và trả lời **～がいいですよ／～はどうですか**.',
        'やってみよう: bắt **tên đi với という** và **câu hỏi có ～たことがありますか／～を知っていますか**; không có đáp án ở đây. Luyện: **Luyện nghe · Bài 1**.',
        'Xem **Ngữ pháp · ポイント 111 — bảng thay thế** (có đủ 5 dòng của bảng này).',
      ],
      [
        mau([
          E('サービスがいいホテルを{知|し}っていますか。— ええ、ロイヤル・ホテルというホテルがいいですよ。', 'Saabisu ga ii hoteru o shitte imasu ka. — Ee, Roiyaru hoteru to iu hoteru ga ii desu yo.', 'Số 2 ① — khách sạn.'),
          E('{京都|きょうと}の{有名|ゆうめい}なお{土産|みやげ}を{知|し}っていますか。— ええ、{八|や}つ{橋|はし}というお{菓子|かし}がいいですよ。', 'Kyouto no yuumei na omiyage o shitte imasu ka. — Ee, Yatsuhashi to iu okashi ga ii desu yo.', 'Số 2 ② — quà.'),
          E('おいしいお{酒|さけ}を{知|し}っていますか。— ええ、{都|みやこ}というお{酒|さけ}がいいですよ。', 'Oishii osake o shitte imasu ka. — Ee, Miyako to iu osake ga ii desu yo.', 'Số 2 ③ — rượu.'),
          E('{紅葉|こうよう}がきれいなところを{知|し}っていますか。— ええ、{清水寺|きよみずでら}というお{寺|てら}がいいですよ。', 'Kouyou ga kirei na tokoro o shitte imasu ka. — Ee, Kiyomizudera to iu otera ga ii desu yo.', 'Số 2 ④ — chùa.'),
          E('ⓐ {両親|りょうしん}が{来|き}ます。どこかいいところを{知|し}っていますか。— {浅草|あさくさ}はどうですか。{古|ふる}いお{寺|てら}がありますよ。', 'Ryoushin ga kimasu. Dokoka ii tokoro o shitte imasu ka. — Asakusa wa dou desu ka. Furui otera ga arimasu yo.', '■ ⓐ bố mẹ sang.'),
          E('ⓒ ゆっくり{休|やす}みたいです。— {温泉|おんせん}はどうですか。{私|わたし}は{箱根|はこね}の{温泉|おんせん}へ{行|い}ったことがあります。とてもよかったですよ。', 'Yukkuri yasumitai desu. — Onsen wa dou desu ka. Watashi wa Hakone no onsen e itta koto ga arimasu. Totemo yokatta desu yo.', '■ ⓒ nghỉ ngơi.'),
          E('ⓔ {夏休|なつやす}みに{旅行|りょこう}に{行|い}きます。— {北海道|ほっかいどう}はどうですか。{夏|なつ}は{涼|すず}しくて、{魚|さかな}が{新鮮|しんせん}ですよ。', 'Natsuyasumi ni ryokou ni ikimasu. — Hokkaidou wa dou desu ka. Natsu wa suzushikute, sakana ga shinsen desu yo.', '■ ⓔ du lịch hè.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 226–227 · チャレンジ! おすすめします',
      'Trang 226: tình huống — **ở ký túc xá, vừa xem tạp chí / TV vừa nói chuyện với bạn**. Tranh: phòng sinh hoạt chung, một cô búi tóc và một cô tóc ngắn ngồi bàn tròn xem tạp chí đang mở; phía sau một chàng trai ngồi sofa cầm lon nước nhìn sang. Ô (1): cô búi tóc chỉ vào tạp chí hỏi "**サンサン？**" (trang quảng cáo "人気のデパート サンサン"), bạn kia ghé lại tò mò; bong bóng: "**若い人**" (ba bạn trẻ) ⇒ cửa hàng "サンサン" — được giới trẻ thích; một người nói "**一緒に**" — rủ đi cùng. Trang 227: tranh lớn phòng khách, TV chiếu **nhóm nhạc** bốn người (ba nam một nữ) cầm micro hát, một cô đứng ở cửa quay lại chỉ vào TV, háo hức. Ô (2): cô gái chỉ và nói "**木村ユウト**", bong bóng là nhóm nhạc với dấu "?"; chàng trai tóc xoăn cầm lon nước: "**かっこいい**?"; cảnh sau cô gái nhắm mắt mỉm cười, trái tim ♥, nghĩ về một thành viên (được tô sáng) — chàng trai vẫn "?". **Mục tiêu できる:** nói được về đồ vật, nơi chốn, con người mình giới thiệu. ☞ ポイント 109, 110.',
      [
        C('ミンさん、サンサンを{知|し}っていますか。', 'Min-san, Sansan o shitte imasu ka.', 'Minh có biết Sansan không?'),
        S('サンサン？いいえ、{知|し}りません。', 'Sansan? Iie, shirimasen.', 'Sansan ạ? Không, em không biết.'),
        C('{若|わか}い{人|ひと}に{人気|にんき}があるデパートですよ。', 'Wakai hito ni ninki ga aru depaato desu yo.', 'Là cửa hàng bách hoá được giới trẻ thích đấy.'),
        S('へえ。{今度|こんど}、{一緒|いっしょ}に{行|い}きませんか。', 'Hee. Kondo, issho ni ikimasen ka.', 'Ồ. Lần tới đi cùng nhau không ạ?'),
        C('（ô 2）あっ、{木村|きむら}ユウト！', '(koma 2) A, Kimura Yuuto!', '(ô 2) A, Kimura Yuto!'),
        S('きむらゆうと？どの{人|ひと}ですか。', 'Kimura Yuuto? Dono hito desu ka.', 'Kimura Yuto ạ? Người nào ạ?'),
        C('あの{人|ひと}です。{白|しろ}いシャツを{着|き}ている{人|ひと}です。', 'Ano hito desu. Shiroi shatsu o kite iru hito desu.', 'Người kia. Người đang mặc áo sơ mi trắng.'),
        S('かっこいいですね。{先生|せんせい}は{木村|きむら}ユウトが{好|す}きですか。', 'Kakkoii desu ne. Sensei wa Kimura Yuuto ga suki desu ka.', 'Ngầu nhỉ. Cô thích Kimura Yuto ạ?'),
      ],
      [
        '**ポイント 109 普通形＋N** (若い人に人気があるデパート) · **ポイント 110 ～ています** (đang mặc: シャツを着ている人).',
        'Màu áo trong tranh sách có thể khác — nhìn tranh mà đổi 白い／青い／赤い／黄色い và đổi động từ theo món đồ.',
        'Xem **Hội thoại · ② おすすめします** và **Từ vựng · E (mặc / đội / đeo)**.',
      ],
    ),

    ...trang(
      'Trang 228 · 言ってみよう (chủ đề 2) — Số 1: ～は…Nですよ · Số 2: どの人ですか',
      '**Số 1:** "Bạn biết … không?" → "…？" → "… là [cửa hàng / nơi] mà …" → "ồ" → thêm một câu (♪) → "vậy à": tranh một nam một nữ cùng xem tạp chí; bốn quảng cáo: 例 **もみじ屋** — "món cá tươi" (có huy hiệu tròn nhỏ không đọc rõ, có lẽ là "居酒屋"); ① **キャンデイ** (in như vậy trong sách) — hai chiếc áo phông, "nhiều quần áo dễ thương ♪"; ② **サカイ電器** — "đồ điện rẻ!", hình máy ảnh, máy tính, điện thoại; ③ **ジェットコースター** — "日本一" "長い！" trên hình vòng lộn của tàu lượn. **Số 2:** "A, …!" → "…？ người nào?" → "người kia, người đang mặc …" → "A thích … à?" → "rất thích": màn hình TV có một hàng người ngồi, đánh số; danh sách tên: 例 **山下ショウ** · ① **中井ごろう** · ② **田中レイ** · ③ **木村あや** · ④ **松田ジュン**.',
      [
        C('サカイ{電器|でんき}を{知|し}っていますか。', 'Sakai denki o shitte imasu ka.', 'Em có biết Sakai Denki không?'),
        S('さかいでんき？', 'Sakai denki?', 'Sakai Denki ạ?'),
        C('{電気製品|でんきせいひん}が{安|やす}い{店|みせ}ですよ。', 'Denki seihin ga yasui mise desu yo.', 'Là cửa hàng đồ điện rẻ đấy.'),
        S('へえ。パソコンもありますか。', 'Hee. Pasokon mo arimasu ka.', 'Ồ. Có cả máy tính không ạ?'),
        C('（TV）あっ、{田中|たなか}レイ！', '(terebi) A, Tanaka Rei!', '(TV) A, Tanaka Rei!'),
        S('たなかれい？どの{人|ひと}ですか。', 'Tanaka Rei? Dono hito desu ka.', 'Tanaka Rei ạ? Người nào ạ?'),
        C('{眼鏡|めがね}をかけている{人|ひと}です。', 'Megane o kakete iru hito desu.', 'Người đang đeo kính.'),
      ],
      [
        'Số 1: câu giải thích luôn kết thúc bằng **[cụm thể thường] + 店／遊園地 + ですよ**. Câu ♪ thêm một nhận xét: おいしくて、安いですよ／とても長いですよ.',
        'Số 2: trang phục từng người do tranh quyết định — nhìn tranh rồi chọn **着ている／はいている／かぶっている／かけている／している**. Câu mẫu bên dưới dùng trang phục giả định.',
        'Xem **Ngữ pháp · ポイント 109 — bảng thay thế** và **ポイント 110 — bảng thay thế (chỉ người trên TV)**.',
      ],
      [
        mau([
          E('もみじ{屋|や}を{知|し}っていますか。— もみじや？— もみじ{屋|や}は{新鮮|しんせん}な{魚料理|さかなりょうり}を{食|た}べることができる{居酒屋|いざかや}ですよ。— へえ。— {安|やす}くて、おいしいですよ。— そうですか。', 'Momijiya o shitte imasu ka. — Momijiya? — Momijiya wa shinsen na sakana ryouri o taberu koto ga dekiru izakaya desu yo. — Hee. — Yasukute, oishii desu yo. — Sou desu ka.', 'Số 1 例.'),
          E('キャンディを{知|し}っていますか。— きゃんでぃ？— キャンディはかわいい{服|ふく}がたくさんある{店|みせ}ですよ。— へえ。— {安|やす}いですよ。', 'Kyandi o shitte imasu ka. — Kyandi? — Kyandi wa kawaii fuku ga takusan aru mise desu yo. — Hee. — Yasui desu yo.', 'Số 1 ① — cửa hàng quần áo.'),
          E('サカイ{電器|でんき}を{知|し}っていますか。— さかいでんき？— サカイ{電器|でんき}は{電気製品|でんきせいひん}が{安|やす}い{店|みせ}ですよ。— へえ。— カメラやパソコンもありますよ。', 'Sakai denki o shitte imasu ka. — Sakai denki? — Sakai denki wa denki seihin ga yasui mise desu yo. — Hee. — Kamera ya pasokon mo arimasu yo.', 'Số 1 ② — cửa hàng đồ điện.'),
          E('ふじまるランドを{知|し}っていますか。— ふじまるらんど？— {日本一|にほんいち}{長|なが}いジェットコースターに{乗|の}ることができる{遊園地|ゆうえんち}ですよ。— へえ。— とてもおもしろいですよ。', 'Fujimaru Rando o shitte imasu ka. — Fujimaru Rando? — Nihonichi nagai jetto koosutaa ni noru koto ga dekiru yuuenchi desu yo. — Hee. — Totemo omoshiroi desu yo.', 'Số 1 ③ — tàu lượn (tên công viên tự đặt, lấy từ trang 224).'),
          E('あっ、{山下|やました}ショウ！— やましたしょう？どの{人|ひと}ですか。— あの{人|ひと}です。{白|しろ}いシャツを{着|き}ている{人|ひと}です。— Aさんは{山下|やました}ショウが{好|す}きですか。— はい、とても{好|す}きです。', 'A, Yamashita Shou! — Yamashita Shou? Dono hito desu ka. — Ano hito desu. Shiroi shatsu o kite iru hito desu. — A-san wa Yamashita Shou ga suki desu ka. — Hai, totemo suki desu.', 'Số 2 例.'),
          E('{中井|なかい}ごろうはどの{人|ひと}ですか。— {帽子|ぼうし}をかぶっている{人|ひと}です。', 'Nakai Gorou wa dono hito desu ka. — Boushi o kabutte iru hito desu.', 'Số 2 ① (trang phục giả định — nhìn tranh để đổi).'),
          E('{田中|たなか}レイはどの{人|ひと}ですか。— {眼鏡|めがね}をかけている{人|ひと}です。', 'Tanaka Rei wa dono hito desu ka. — Megane o kakete iru hito desu.', 'Số 2 ②.'),
          E('{木村|きむら}あやはどの{人|ひと}ですか。— スカートをはいている{人|ひと}です。', 'Kimura Aya wa dono hito desu ka. — Sukaato o haite iru hito desu.', 'Số 2 ③.'),
          E('{松田|まつだ}ジュンはどの{人|ひと}ですか。— ネクタイをしている{人|ひと}です。', 'Matsuda Jun wa dono hito desu ka. — Nekutai o shite iru hito desu.', 'Số 2 ④.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 229 · やってみよう · ■ giới thiệu nơi / người nổi tiếng bạn thích (chủ đề 2)',
      '**やってみよう** (CD C38) — nghe rồi viết: **1** cửa hàng anh Nishikawa giới thiệu: **サカイ電器** — tranh một cô tóc xoăn hỏi chàng trai "どこかいい店を知っていますか", sau lưng là biển cửa hàng "SAKAI サカイ電器"; khung điền: サカイ電器は ___ 電気製品を ___ 店です。お店の人は ___ です。 **2** ca sĩ Park giới thiệu: **田中愛** — một nam một nữ xem TV có bốn ca sĩ đang hát, cô gái hỏi "田中愛はどの人ですか"; khung điền: 田中愛は ___ 人です。 **■** Giới thiệu với bạn cùng lớp **nơi bạn thích** hoặc **người nổi tiếng bạn thích**.',
      [
        C('ミンさんのおすすめの{場所|ばしょ}を{教|おし}えてください。', 'Min-san no osusume no basho o oshiete kudasai.', 'Minh hãy giới thiệu nơi em thích.'),
        S('{私|わたし}のおすすめは「ハノイ{旧市街|きゅうしがい}」です。{古|ふる}い{店|みせ}がたくさんある{町|まち}です。おいしいフォーを{食|た}べることができます。', 'Watashi no osusume wa "Hanoi kyuushigai" desu. Furui mise ga takusan aru machi desu. Oishii foo o taberu koto ga dekimasu.', 'Nơi em giới thiệu là "Phố cổ Hà Nội". Là khu phố có nhiều cửa hàng lâu đời. Có thể ăn phở ngon.'),
        C('{好|す}きな{有名人|ゆうめいじん}は{誰|だれ}ですか。', 'Suki na yuumeijin wa dare desu ka.', 'Người nổi tiếng em thích là ai?'),
        S('ソンタンMTPという{歌手|かしゅ}です。ベトナムの{若|わか}い{人|ひと}にとても{人気|にんき}がある{歌手|かしゅ}です。', 'Sontan emutiipii to iu kashu desu. Betonamu no wakai hito ni totemo ninki ga aru kashu desu.', 'Là ca sĩ tên Sơn Tùng M-TP. Là ca sĩ rất được giới trẻ Việt Nam yêu thích.'),
      ],
      [
        'やってみよう 1: ô trống đầu là **cụm bổ nghĩa cho 電気製品** (loại đồ điện gì), ô thứ hai là **cách bán** (～く売っている), ô cuối là **tính từ tả nhân viên**. Không có đáp án ở đây. Luyện: **Luyện nghe · Bài 2**.',
        'やってみよう 2: ô trống là **trang phục** — nghe đồ + động từ (～を着ている／かけている…).',
        '■: khung 3 câu — **tên (という)** → **là N thế nào (普通形＋N)** → **làm được gì / vì sao thích**.',
        '旧市街 (phố cổ) là từ tự thêm cho bài của Minh — thay bằng nơi thật của bạn.',
      ],
    ),

    ...trang(
      'Trang 230–231 · チャレンジ! {教|おし}えてください',
      'Trang 230: tình huống — **đang tìm địa điểm trên Internet**. Tranh: một anh ngồi trước máy tính cầm bút chỉ vào màn hình, một anh khác đứng xem; trang web tiêu đề "**東京の公園**" và dòng "**バーベキューができる！**". Ô (1): anh đứng hỏi, bong bóng là ba người quanh bếp nướng có chữ "**公園**" — muốn nướng thịt ở công viên; bong bóng "**いい公園？**"; bong bóng khác: "**みどり公園**" với hình người đi bộ và biểu tượng ga "駅", nét đứt ghi "**5分**" — công viên Midori cách ga 5 phút. Trang 231: tình huống phụ — **nhờ bạn giới thiệu cửa hàng**. Tranh lớn: hai người đàn ông ngồi bàn quán cà phê dưới đèn thả, mỗi người một tách, giữa là chậu cây cao. Ô (2): bong bóng "**来月**" + ba người nướng thịt; bong bóng quầy **hàng thịt** (biển 肉, người bán, bảng giá) + "**どこ**?"; tiếp: bong bóng "**新宿**" và "**はなまる**" (hình cửa hàng tên はなまる) + "?"; bong bóng giá: một món thịt "**100g 80円**", một xiên "**1本 20円**", một bó hành "**50円**". **Mục tiêu できる:** đặt câu hỏi để lấy được thông tin mình muốn biết. ☞ ポイント 109.',
      [
        C('ミンさん、{何|なに}を{探|さが}していますか。', 'Min-san, nani o sagashite imasu ka.', 'Minh, em đang tìm gì vậy?'),
        S('バーベキューができる{公園|こうえん}を{探|さが}しています。{先生|せんせい}、どこかいい{公園|こうえん}を{知|し}っていますか。', 'Baabekyuu ga dekiru kouen o sagashite imasu. Sensei, dokoka ii kouen o shitte imasu ka.', 'Em đang tìm công viên có thể nướng thịt. Cô có biết công viên nào được không ạ?'),
        C('みどり{公園|こうえん}はどうですか。{駅|えき}から{歩|ある}いて{5分|ごふん}ですよ。', 'Midori kouen wa dou desu ka. Eki kara aruite gofun desu yo.', 'Công viên Midori thì sao? Từ ga đi bộ 5 phút đấy.'),
        S('{肉|にく}を{安|やす}く{買|か}うことができる{店|みせ}も{知|し}っていますか。', 'Niku o yasuku kau koto ga dekiru mise mo shitte imasu ka.', 'Cô có biết cả cửa hàng mua thịt được rẻ không ạ?'),
        C('ええ、{新宿|しんじゅく}の「はなまる」がいいですよ。', 'Ee, Shinjuku no "Hanamaru" ga ii desu yo.', 'Có, "Hanamaru" ở Shinjuku được lắm.'),
        S('いくらぐらいですか。', 'Ikura gurai desu ka.', 'Khoảng bao nhiêu tiền ạ?'),
        C('{肉|にく}は{100|ひゃく}グラム{80円|はちじゅうえん}です。', 'Niku wa hyaku guramu hachijuu en desu.', 'Thịt 80 yên 100 gam.'),
      ],
      [
        '**ポイント 109**: điều mình tìm = **cụm bổ nghĩa + N** — バーベキューができる公園, 肉を安く買うことができる店, みんなで飲み会をする店.',
        'Chuỗi câu hỏi lấy thông tin: **どこかいい N を知っていますか** → **どこにありますか** → **どんな N ですか** → **いくらですか／何がありますか**.',
        'Đếm: 1**本** (xiên, que — Bài 9), 100グラム, 50円.',
        'Xem **Hội thoại · ③ 教えてください** và **Ngữ pháp · ポイント 109**.',
      ],
    ),

    ...trang(
      'Trang 232 · 言ってみよう (chủ đề 3) — Số 1: どこかいいお店を知っていますか',
      '**Số 1:** "B đang làm gì?" → "đang tìm … . Bạn có biết chỗ nào được không?" → "để xem… … thì sao? …" → "ồ, vậy à. Ở đâu?" (♪) → "ở … đấy" (♪): 例 quán cho **buổi nhậu cả nhóm** → わいわい／đồ ăn ngon; ① **bánh ngọt** (người bưng đĩa trước quầy bánh) → オレンジ／có nhiều loại bánh và đồ uống; ② **yukata** (áo gấp) → エトス／có nhiều yukata rẻ; ③ **bánh kẹo** (hộp bánh ghi お菓子) → ロマン／bán cả sách dạy làm bánh; ④ **chỗ đá bóng** (hai người đá bóng cạnh sân rào) → みどり公園／rất rộng; ⑤ **học piano** (người chơi piano, nốt nhạc) → わたなべ音楽教室／gần ga.',
      [
        C('ミンさん、{何|なに}をしていますか。', 'Min-san, nani o shite imasu ka.', 'Minh đang làm gì đấy?'),
        S('{安|やす}い{浴衣|ゆかた}を{売|う}っている{店|みせ}を{探|さが}しています。どこかいいお{店|みせ}を{知|し}っていますか。', 'Yasui yukata o utte iru mise o sagashite imasu. Dokoka ii omise o shitte imasu ka.', 'Em đang tìm cửa hàng bán yukata rẻ. Cô có biết cửa hàng nào được không ạ?'),
        C('そうですねえ。エトスはどうですか。{安|やす}い{浴衣|ゆかた}がたくさんありますよ。', 'Sou desu nee. Etosu wa dou desu ka. Yasui yukata ga takusan arimasu yo.', 'Để xem. Etos thì sao? Có nhiều yukata rẻ đấy.'),
        S('へえ、そうですか。どこにありますか。', 'Hee, sou desu ka. Doko ni arimasu ka.', 'Ồ, vậy ạ. Ở đâu ạ?'),
        C('{渋谷|しぶや}にありますよ。', 'Shibuya ni arimasu yo.', 'Ở Shibuya đấy.'),
      ],
      [
        'Câu đầu của B = **[điều cần] + N を探しています** — dùng đúng cụm bổ nghĩa của tranh: みんなで飲み会をする店, いろいろなケーキがある店, サッカーを練習する場所, ピアノを習う教室.',
        'Giới thiệu: **N はどうですか** + lý do. Nơi chốn trong ♪ do bạn tự chọn (新宿, 渋谷, 駅の前…).',
        'Xem **Ngữ pháp · ポイント 109 — bảng thay thế (giới thiệu một nơi)** có đủ 5 cửa hàng này.',
      ],
      [
        mau([
          E('Bさん、{何|なに}をしていますか。— みんなで{飲|の}み{会|かい}をするお{店|みせ}を{探|さが}しています。どこかいいお{店|みせ}を{知|し}っていますか。— そうですねえ。わいわいはどうですか。{料理|りょうり}がおいしいですよ。— へえ、そうですか。どこにありますか。— {新宿|しんじゅく}にありますよ。', 'B-san, nani o shite imasu ka. — Minna de nomikai o suru omise o sagashite imasu. Dokoka ii omise o shitte imasu ka. — Sou desu nee. Waiwai wa dou desu ka. Ryouri ga oishii desu yo. — Hee, sou desu ka. Doko ni arimasu ka. — Shinjuku ni arimasu yo.', 'Số 1 例.'),
          E('おいしいケーキを{食|た}べることができるお{店|みせ}を{探|さが}しています。— オレンジはどうですか。いろいろなケーキや{飲|の}み{物|もの}などがありますよ。', 'Oishii keeki o taberu koto ga dekiru omise o sagashite imasu. — Orenji wa dou desu ka. Iroiro na keeki ya nomimono nado ga arimasu yo.', 'Số 1 ① — bánh ngọt.'),
          E('{浴衣|ゆかた}を{売|う}っているお{店|みせ}を{探|さが}しています。— エトスはどうですか。{安|やす}い{浴衣|ゆかた}がたくさんありますよ。', 'Yukata o utte iru omise o sagashite imasu. — Etosu wa dou desu ka. Yasui yukata ga takusan arimasu yo.', 'Số 1 ② — yukata.'),
          E('お{菓子|かし}の{材料|ざいりょう}を{売|う}っているお{店|みせ}を{探|さが}しています。— ロマンはどうですか。お{菓子|かし}の{作|つく}り{方|かた}の{本|ほん}も{売|う}っていますよ。', 'Okashi no zairyou o utte iru omise o sagashite imasu. — Roman wa dou desu ka. Okashi no tsukurikata no hon mo utte imasu yo.', 'Số 1 ③ — bánh kẹo (材料 — từ của bài).'),
          E('サッカーを{練習|れんしゅう}する{場所|ばしょ}を{探|さが}しています。— みどり{公園|こうえん}はどうですか。とても{広|ひろ}いですよ。', 'Sakkaa o renshuu suru basho o sagashite imasu. — Midori kouen wa dou desu ka. Totemo hiroi desu yo.', 'Số 1 ④ — chỗ đá bóng.'),
          E('ピアノを{習|なら}う{教室|きょうしつ}を{探|さが}しています。— わたなべ{音楽教室|おんがくきょうしつ}はどうですか。{駅|えき}から{近|ちか}いですよ。', 'Piano o narau kyoushitsu o sagashite imasu. — Watanabe ongaku kyoushitsu wa dou desu ka. Eki kara chikai desu yo.', 'Số 1 ⑤ — lớp piano.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 233 · 言ってみよう số 2 · やってみよう · ロールプレイ (chủ đề 3)',
      '**Số 2:** "tháng sau tôi tổ chức tiệc với bạn cùng lớp" → "hay nhỉ" → "ở tiệc, B hay … gì?" → "hay … " → "…？" → "là … đơn giản mà vui": 例 **trò chơi** (người đội mũ tiệc chơi trò) → しりとり／trò chơi đơn giản, vui; ① **bài hát** (người hát, đàn guitar) → 「ひまわり」／bài hát vui; ② **món ăn** (người nấu ăn ở tiệc) → お好み焼き／món đơn giản, ngon. **やってみよう** (CD C41): nghe 2 đoạn, viết **ở đâu** và **vì sao**. **ロールプレイ:** Ⓐ lớp định tổ chức [nhậu · tiệc nướng · ngắm hoa], bạn là trưởng nhóm — hỏi B đủ thông tin; Ⓑ trả lời câu hỏi của A.',
      [
        C('{来月|らいげつ}、クラスメイトとパーティーをします。', 'Raigetsu, kurasumeito to paatii o shimasu.', 'Tháng sau cô tổ chức tiệc với lớp.'),
        S('そうですか。いいですね。', 'Sou desu ka. Ii desu ne.', 'Vậy ạ. Hay quá ạ.'),
        C('ミンさん、パーティーでよく{作|つく}る{料理|りょうり}は{何|なん}ですか。', 'Min-san, paatii de yoku tsukuru ryouri wa nan desu ka.', 'Minh, món em hay nấu ở tiệc là món gì?'),
        S('そうですねえ。{春巻|はるま}きをよく{作|つく}ります。', 'Sou desu nee. Harumaki o yoku tsukurimasu.', 'Để em nghĩ. Em hay làm nem rán ạ.'),
        C('はるまき？', 'Harumaki?', 'Harumaki á?'),
        S('はい。{簡単|かんたん}で、おいしいベトナムの{料理|りょうり}ですよ。', 'Hai. Kantan de, oishii Betonamu no ryouri desu yo.', 'Vâng. Là món Việt Nam đơn giản mà ngon ạ.'),
      ],
      [
        'Số 2: câu hỏi là **ポイント 109** — パーティーで**よくする**ゲーム／**よく歌う**歌／**よく作る**料理. Trả lời **N をよく～ます** rồi giải thích **～で、～N ですよ**.',
        'やってみよう: nghe **N はどうですか** + lý do **～から／～くて**. Gợi ý đầu hay bị gạt — lấy chỗ được chốt. Không có đáp án ở đây. Luyện: **Luyện nghe · Bài 3**.',
        'ロールプレイ: A phải hỏi đủ **場所・材料・値段 (giá)**: どこかいい場所を知っていますか → どこにありますか → 材料はどこで買うことができますか → いくらですか.',
        'Xem **Luyện nói · Đóng vai — Vai 2**.',
      ],
      [
        mau([
          E('{来月|らいげつ}、クラスメイトとパーティーをします。— そうですか。いいですね。— Bさん、パーティーでよくするゲームは{何|なん}ですか。— そうですねえ。しりとりをよくします。— しりとり？— はい。{簡単|かんたん}で、おもしろいゲームですよ。', 'Raigetsu, kurasumeito to paatii o shimasu. — Sou desu ka. Ii desu ne. — B-san, paatii de yoku suru geemu wa nan desu ka. — Sou desu nee. Shiritori o yoku shimasu. — Shiritori? — Hai. Kantan de, omoshiroi geemu desu yo.', 'Số 2 例.'),
          E('パーティーでよく{歌|うた}う{歌|うた}は{何|なん}ですか。—「ひまわり」をよく{歌|うた}います。— ひまわり？— はい。{楽|たの}しい{歌|うた}ですよ。', 'Paatii de yoku utau uta wa nan desu ka. — "Himawari" o yoku utaimasu. — Himawari? — Hai. Tanoshii uta desu yo.', 'Số 2 ①.'),
          E('パーティーでよく{作|つく}る{料理|りょうり}は{何|なん}ですか。— お{好|この}み{焼|や}きをよく{作|つく}ります。— おこのみやき？— はい。{簡単|かんたん}で、おいしい{料理|りょうり}ですよ。', 'Paatii de yoku tsukuru ryouri wa nan desu ka. — Okonomiyaki o yoku tsukurimasu. — Okonomiyaki? — Hai. Kantan de, oishii ryouri desu yo.', 'Số 2 ②.'),
          E('（ロールプレイ・A）{来月|らいげつ}、クラスのみんなでお{花見|はなみ}をします。どこかいい{場所|ばしょ}を{知|し}っていますか。—（B）さくら{公園|こうえん}はどうですか。{桜|さくら}がたくさんある{公園|こうえん}ですよ。—（A）{飲|の}み{物|もの}はどこで{買|か}うことができますか。—（B）{公園|こうえん}の{前|まえ}のコンビニで{買|か}うことができますよ。', '(Rooru purei, A) Raigetsu, kurasu no minna de ohanami o shimasu. Dokoka ii basho o shitte imasu ka. — (B) Sakura kouen wa dou desu ka. Sakura ga takusan aru kouen desu yo. — (A) Nomimono wa doko de kau koto ga dekimasu ka. — (B) Kouen no mae no konbini de kau koto ga dekimasu yo.', 'ロールプレイ — một mẫu (お花見).'),
        ]),
      ],
    ),

    ...trang(
      'Trang 234 · できる! — Làm khảo sát rồi trình bày',
      'Nhiệm vụ tổng hợp: tìm hiểu **thông tin được giới thiệu** và **thông tin có ích cho cuộc sống** bằng phiếu khảo sát (アンケート), hỏi nhiều người, tổng hợp và trình bày. 4 bước: (1) chia nhóm, **chọn chủ đề** (ví dụ: ○○ bạn giới thiệu, ○○ bạn thích…); (2) **làm phiếu**: nghĩ câu hỏi, thứ tự câu hỏi, các lựa chọn trả lời; (3) **đi khảo sát**; (4) **tổng hợp kết quả và trình bày**.',
      [
        C('{皆|みな}さんのアンケートのテーマは{何|なん}ですか。', 'Minasan no ankeeto no teema wa nan desu ka.', 'Chủ đề khảo sát của nhóm em là gì?'),
        S('「おすすめのデートの{場所|ばしょ}」です。', '"Osusume no deeto no basho" desu.', 'Là "nơi hẹn hò bạn giới thiệu" ạ.'),
        C('{何人|なんにん}に{聞|き}きましたか。', 'Nannin ni kikimashita ka.', 'Các em đã hỏi bao nhiêu người?'),
        S('{20人|にじゅうにん}に{聞|き}きました。いちばん{人気|にんき}がある{場所|ばしょ}は{遊園地|ゆうえんち}でした。', 'Nijuunin ni kikimashita. Ichiban ninki ga aru basho wa yuuenchi deshita.', 'Chúng em hỏi 20 người. Nơi được thích nhất là công viên giải trí ạ.'),
      ],
      [
        'Câu hỏi trong phiếu nên dùng đủ mẫu của bài: **～たことがありますか** (108), **よく行く～はどこですか** (109), **～という～を知っていますか** (111, 112).',
        'Trình bày: テーマ → 何人に聞きましたか → kết quả (～人でした／いちばん人気がある～は～でした) → **以上です**.',
        'Xem **Hội thoại · できる！— phiếu khảo sát mẫu + bài trình bày mẫu**.',
      ],
    ),

    ...trang(
      'Trang 234 · 話読聞書「{私|わたし}のおすすめ」 — Thứ tôi giới thiệu',
      'Ô 話読聞書 có một đoạn ngắn khoảng 9 câu: người viết giới thiệu **một loại vé tàu giá rẻ dùng cho kỳ nghỉ dài** — với vé đó một ngày đi đâu cũng được; chỉ mua được vào các kỳ nghỉ xuân, hè…; một xấp gồm 5 lượt dùng có giá khoảng mười một nghìn yên; đi du lịch với bạn thì dùng chung được; không đi được tàu cao tốc Shinkansen và tàu tốc hành, nhưng rất hợp với người thích du lịch — vì được **ngắm cảnh từ cửa sổ tàu**, **ăn cơm hộp bán ở ga** (駅弁); ai có thời gian thì hãy thử. Ba câu gợi ý bên lề (cô sẽ hỏi đúng 3 câu này): **おすすめは何ですか · どんな○○ですか · 何ができますか**. Từ ở chân bài: おすすめ, 駅弁, 切符, 特急電車, ～分. Nhiệm vụ: viết và đọc đoạn về **thứ BẠN giới thiệu** theo đúng 3 câu đó.',
      [
        C('ミンさんのおすすめは{何|なん}ですか。', 'Min-san no osusume wa nan desu ka.', 'Thứ Minh giới thiệu là gì?'),
        S('{私|わたし}のおすすめは「グラブ」というアプリです。', 'Watashi no osusume wa "Gurabu" to iu apuri desu.', 'Thứ em giới thiệu là ứng dụng tên "Grab" ạ.'),
        C('どんなアプリですか。', 'Donna apuri desu ka.', 'Là ứng dụng thế nào?'),
        S('バイクやタクシーを{安|やす}く{呼|よ}ぶことができるアプリです。ベトナムの{若|わか}い{人|ひと}に{人気|にんき}があります。', 'Baiku ya takushii o yasuku yobu koto ga dekiru apuri desu. Betonamu no wakai hito ni ninki ga arimasu.', 'Là ứng dụng có thể gọi xe máy, taxi giá rẻ. Được giới trẻ Việt Nam yêu thích.'),
        C('{何|なに}ができますか。', 'Nani ga dekimasu ka.', 'Có thể làm được gì?'),
        S('{食|た}べ{物|もの}を{注文|ちゅうもん}することもできます。ベトナムへ{来|く}る{人|ひと}はぜひ{使|つか}ってください。', 'Tabemono o chuumon suru koto mo dekimasu. Betonamu e kuru hito wa zehi tsukatte kudasai.', 'Cũng có thể đặt đồ ăn. Ai đến Việt Nam thì nhất định hãy dùng nhé.'),
      ],
      [
        '3 câu hỏi = 3 mẫu: **「～」という N です** (112) · **[cụm thể thường] N です** (109) · **～ことができます** (Bài 9–10).',
        'Thêm một câu kinh nghiệm **何回も使ったことがあります** (108) là bài của bạn đủ ý như bài mẫu.',
        '～分 ở chân bài đọc: sách in **～分**, trong bài nghĩa là "phần, lượng" (5枚分 = lượng 5 vé) nên đọc **ぶん**, không phải ふん (phút).',
        'アプリ (ứng dụng), 呼ぶ (gọi), 注文 (đặt món) là từ tự thêm cho bài của Minh — thay bằng thứ thật của bạn.',
        'Xem **Hội thoại · ④ Nói–Đọc–Nghe–Viết — 私のおすすめ** (bài mẫu mới + khung viết).',
      ],
    ),

    { t: 'h', text: 'Trang 235 · ことば — Từ vựng của bài' },
    {
      t: 'p',
      text: 'Trang liệt kê 40 từ theo 3 chủ đề: (1) 経験から — lá đỏ mùa thu, dịch vụ, sumo, khách sạn, biết, hẹn hò, chưa … lần nào, nhiều lần; (2) おすすめします — người đàn ông, người phụ nữ, cửa hàng, công viên giải trí, tàu lượn siêu tốc, đồ điện, kính râm, kính mắt, áo sơ mi, váy, cà vạt, mũ, sự được yêu thích, bán, đội, trọ lại, mặc (đồ phần dưới), đeo (kính — 眼鏡をかけます), mặc (áo), đeo (cà vạt — ネクタイをします), xanh, đỏ, vàng, trẻ, tươi; (3) 教えてください — nguyên liệu, địa điểm, bóng rổ, yukata, đâu đó, luyện tập, mọi người cùng nhau. Không có tranh. Đủ nghĩa, romaji, ví dụ: xem mục **Từ vựng** của Bài 13.',
    },
    {
      t: 'note',
      title: 'Mẹo',
      items: [
        'Cô hay kiểm tra nhanh bằng **năm động từ mặc / đội / đeo** (着ます・はきます・かぶります・かけます・します) — ôn ở **Từ vựng · Bảng tổng hợp**.',
        'Cặp dễ nhầm: **1回も (phủ định) ↔ 何回も (khẳng định)** · **知っています ↔ 知りません** · **着ます (mặc) ↔ 来ます (đến)**.',
        'Xem **Từ vựng · Bài 13** và **Chữ Hán · Bài 13**.',
      ],
    },

    ...trang(
      'Trang 236 · もう{一度|いちど}{聞|き}こう — Nghe lại cả bài',
      'Nghe lại đoạn ở trang 221 (CD C31). **Wang** kể với **chị Yamaguchi** rằng nghỉ đông này lần đầu cô đi **Hokkaido** và hỏi chị đã từng đi chưa — chị đi **3 lần** rồi, đã trượt tuyết và ăn đồ ngon. Wang đang **tìm khách sạn** để ở, hỏi chị có biết chỗ nào tốt không — chị giới thiệu một khách sạn (tên lạ, Wang nhắc lại bằng giọng hỏi): **gần ga, từ phòng nhìn thấy biển**, năm ngoái chị ở đó với bạn; đồ ăn **rất ngon, nhiều món cá tươi**; có một **món nướng đặc sản** của khách sạn nên nhất định ăn thử; **đặt phòng được trên Internet**; mùa đông Hokkaido rất lạnh nên **mang mũ len và găng tay** thì hơn. Từ ở chân trang: 手袋, 毛糸. Cô sẽ hỏi lại các chi tiết.',
      [
        C('ワンさんは{北海道|ほっかいどう}へ{行|い}ったことがありますか。', 'Wan-san wa Hokkaidou e itta koto ga arimasu ka.', 'Wang đã từng đi Hokkaido chưa?'),
        S('いいえ、ありません。{冬休|ふゆやす}みに{初|はじ}めて{行|い}きます。', 'Iie, arimasen. Fuyuyasumi ni hajimete ikimasu.', 'Chưa ạ. Nghỉ đông bạn ấy đi lần đầu.'),
        C('{山口|やまぐち}さんは{何回|なんかい}{行|い}ったことがありますか。', 'Yamaguchi-san wa nankai itta koto ga arimasu ka.', 'Chị Yamaguchi đã đi mấy lần?'),
        S('{3回|さんかい}あります。', 'Sankai arimasu.', '3 lần ạ.'),
        C('{山口|やまぐち}さんのおすすめのホテルはどんなホテルですか。', 'Yamaguchi-san no osusume no hoteru wa donna hoteru desu ka.', 'Khách sạn chị Yamaguchi giới thiệu là khách sạn thế nào?'),
        S('{駅|えき}から{近|ちか}くて、{部屋|へや}から{海|うみ}が{見|み}えるホテルです。', 'Eki kara chikakute, heya kara umi ga mieru hoteru desu.', 'Là khách sạn gần ga, từ phòng nhìn thấy biển ạ.'),
        C('{北海道|ほっかいどう}へ{何|なに}を{持|も}って{行|い}ったほうがいいですか。', 'Hokkaidou e nani o motte itta hou ga ii desu ka.', 'Đi Hokkaido nên mang theo gì?'),
        S('{毛糸|けいと}の{帽子|ぼうし}や{手袋|てぶくろ}を{持|も}って{行|い}ったほうがいいです。とても{寒|さむ}いですから。', 'Keito no boushi ya tebukuro o motte itta hou ga ii desu. Totemo samui desu kara.', 'Nên mang mũ len và găng tay ạ. Vì rất lạnh.'),
      ],
      [
        '**毛糸の帽子** = mũ len (毛糸 = sợi len) — đội: **かぶります**; **手袋** = găng tay — đeo: **します**／**はめます**.',
        'Câu hỏi "どんなホテルですか" → trả lời bằng cụm bổ nghĩa nối bằng て: 駅から**近くて**、部屋から海が**見える**ホテル (ポイント 109).',
        'Câu hỏi quá khứ về lần đó (料理はどうでしたか) → **～かったです／～でした**.',
        'Xem **Luyện nghe · Bài 4 — Hội thoại dài: đi Kyoto mùa lá đỏ** (kịch bản mới cùng tình huống).',
      ],
    ),

    { t: 'h', text: 'Cô hỏi — bạn trả lời: ghép nhanh câu trả lời' },
    {
      t: 'build',
      id: 'b13-sach-ghep',
      title: 'Nghe câu hỏi (tiếng Việt) → ghép câu trả lời tiếng Nhật',
      items: [
        { vi: 'Cô hỏi 富士山に登ったことがありますか → "Chưa ạ, chưa lần nào."', chips: ['いいえ、', '{1回|いっかい}も', 'ありません。', 'あります。', '{何回|なんかい}も'], answer: ['いいえ、', '{1回|いっかい}も', 'ありません。'], ro: 'Iie, ikkai mo arimasen.' },
        { vi: 'Cô hỏi 沖縄へ行ったことがありますか → "Rồi ạ. Tháng trước em đi."', chips: ['はい、', 'あります。', '{先月|せんげつ}', '{行|い}きました。', '{行|い}ったことがあります。', 'ありません。'], answer: ['はい、', 'あります。', '{先月|せんげつ}', '{行|い}きました。'], ro: 'Hai, arimasu. Sengetsu ikimashita.' },
        { vi: 'Hỏi cô: "Cô có biết nhà hàng nào ngon không ạ?"', chips: ['おいしい', 'レストランを', '{知|し}っていますか。', '{知|し}りますか。', 'レストランが'], answer: ['おいしい', 'レストランを', '{知|し}っていますか。'], ro: 'Oishii resutoran o shitte imasu ka.' },
        { vi: 'Cô hỏi サンサンを知っていますか → "Không, em không biết."', chips: ['いいえ、', '{知|し}りません。', '{知|し}っていません。', '{知|し}りませんでした。'], answer: ['いいえ、', '{知|し}りません。'], ro: 'Iie, shirimasen.' },
        { vi: 'Giới thiệu: "Quán tên Sumida ngon lắm ạ."', chips: ['すみだ', 'という', '{店|みせ}が', 'いいですよ。', 'の', '{店|みせ}を'], answer: ['すみだ', 'という', '{店|みせ}が', 'いいですよ。'], ro: 'Sumida to iu mise ga ii desu yo.' },
        { vi: 'Giải thích: "Là cửa hàng đồ điện rẻ ạ."', chips: ['{電気製品|でんきせいひん}が', '{安|やす}い', '{店|みせ}です。', '{安|やす}いです', '{電気製品|でんきせいひん}を'], answer: ['{電気製品|でんきせいひん}が', '{安|やす}い', '{店|みせ}です。'], ro: 'Denki seihin ga yasui mise desu.' },
        { vi: 'Cô hỏi 山下ショウはどの人ですか → "Là người đang mặc áo sơ mi trắng ạ."', chips: ['{白|しろ}い', 'シャツを', '{着|き}ている', '{人|ひと}です。', 'はいている', '{着|き}ます'], answer: ['{白|しろ}い', 'シャツを', '{着|き}ている', '{人|ひと}です。'], ro: 'Shiroi shatsu o kite iru hito desu.' },
        { vi: 'Cô hỏi 何を探していますか → "Em đang tìm công viên có thể nướng thịt."', chips: ['バーベキューが', 'できる', '{公園|こうえん}を', '{探|さが}しています。', 'できます', '{公園|こうえん}が'], answer: ['バーベキューが', 'できる', '{公園|こうえん}を', '{探|さが}しています。'], ro: 'Baabekyuu ga dekiru kouen o sagashite imasu.' },
        { vi: 'Cô giới thiệu "わいわいはどうですか" → "Ồ, vậy ạ. Ở đâu ạ?"', chips: ['へえ、', 'そうですか。', 'どこに', 'ありますか。', 'どこか', 'いますか。'], answer: ['へえ、', 'そうですか。', 'どこに', 'ありますか。'], ro: 'Hee, sou desu ka. Doko ni arimasu ka.' },
        { vi: 'Cô hỏi パーティーでよく作る料理は何ですか → "Em hay làm okonomiyaki ạ."', chips: ['お{好|この}み{焼|や}きを', 'よく', '{作|つく}ります。', '{作|つく}る', 'が'], answer: ['お{好|この}み{焼|や}きを', 'よく', '{作|つく}ります。'], ro: 'Okonomiyaki o yoku tsukurimasu.' },
      ],
    },
  ],
};
