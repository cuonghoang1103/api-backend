/**
 * Bài 6 — 一緒に！ (Cùng nhau!) · できる日本語 初級 · JPD113/JPD123.
 *
 * Ngữ pháp: ポイント 48–60 (Vませんか · Vましょう · Nがあります · N1(場所)でN2があります ·
 * Nが(~枚・~つ)あります · N1でN2がいちばんAです · N1はN2よりAです ·
 * N1とN2とどちらがAですか · Nのほうが(A)です · もうVましたか/まだです · Nはどうですか ·
 * ___ね · ___よ) + bảng đếm ～枚 (表 p.287).
 * Từ vựng: đủ 55 từ + 8 câu mẫu trong danh sách từ mới Bài 6 của cô (sổ tra JPD123,
 * mục 1–63). Danh sách của cô dịch câu 「ああ、日曜日はちょっと…」 là "thứ 7" — 日曜日 là
 * CHỦ NHẬT, trong bài dùng nghĩa đúng.
 * Hội thoại, câu ví dụ, bài đọc, kịch bản nghe: VIẾT MỚI theo đúng tình huống của sách
 * (xem ../SOAN-BAI.md). Tên quán, rạp, sự kiện trong bài là tự đặt.
 *
 * Vai: アンナ, ワン — nữ (a / c); パク, ダニエル — nam (b). Giám thị — examiner.
 */
import type { Lesson } from '@/components/sach-hoc/types';

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
  id: 'b6-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — 一緒に！ Rủ bạn đi chơi, chọn chỗ, hẹn giờ',
  goal: 'Rủ được bạn đi chơi, nhận lời hoặc từ chối khéo, cùng bạn so sánh để chọn chỗ đi, rồi hẹn ngày – giờ – nơi gặp.',
  minutes: 35,
  blocks: [
    {
      t: 'note',
      title: 'Học xong bài 6 bạn làm được (できる)',
      items: [
        '**① {一緒|いっしょ}に{行|い}きませんか** — **rủ** bạn cùng làm gì đó (đi ăn, xem phim, đi karaoke…); **nhận lời** hoặc **từ chối khéo** khi được rủ.',
        '**② どちらがいいですか** — hỏi bạn **thích gì nhất**, **so sánh** hai lựa chọn (rạp nào gần hơn, quán nào rẻ hơn) để cùng quyết định.',
        '**③ {約束|やくそく}** — **hẹn**: làm gì, ngày nào, mấy giờ, gặp ở đâu; xác nhận lại cho chắc.',
        '**できる！** — tự tìm một sự kiện (buổi hoà nhạc, lễ hội pháo hoa, trận đấu…) rồi rủ bạn và hẹn hò đâu ra đấy.',
      ],
    },
    {
      t: 'table',
      caption: 'Bức tranh chung của bài — một lời rủ đi qua 4 bước',
      head: ['Bước', 'Câu then chốt', 'Romaji', 'ポイント'],
      rows: [
        ['1. Rủ', '{一緒|いっしょ}に{映画|えいが}を{見|み}に{行|い}きませんか。', 'Issho ni eiga o mi ni ikimasen ka.', '48'],
        ['2. Nhận lời / từ chối', 'いいですね。{行|い}きましょう。／すみません。ちょっと……。', 'Ii desu ne. Ikimashou. / Sumimasen. Chotto……', '49'],
        ['3. Chọn', 'AとBとどちらがいいですか。——Aのほうがいいです。', 'A to B to dochira ga ii desu ka. — A no hou ga ii desu.', '53–56'],
        ['4. Hẹn', '{何時|なんじ}に{会|あ}いますか。——{5時|ごじ}はどうですか。——{5時|ごじ}ですね。', 'Nanji ni aimasu ka. — Goji wa dou desu ka. — Goji desu ne.', '57–60'],
      ],
    },

    /* ── ① 一緒に行きませんか ── */
    { t: 'h', text: '① {一緒|いっしょ}に{行|い}きませんか — Cùng đi không?' },
    {
      t: 'p',
      text: 'Tình huống: giờ ra chơi ở lớp tiếng Nhật. Các bạn rủ nhau tối nay, cuối tuần, kỳ nghỉ hè đi đâu đó. Có người nhận lời ngay, có người bận nên **từ chối khéo** — người Nhật gần như không bao giờ nói thẳng "không đi".',
    },
    {
      t: 'dialogue',
      title: 'Rủ đi karaoke — nhận lời',
      lines: [
        { who: 'アンナ', role: 'a', text: 'パクさん、{今晩|こんばん}、{一緒|いっしょ}にカラオケに{行|い}きませんか。', ro: 'Paku-san, konban, issho ni karaoke ni ikimasen ka.', vi: 'Park ơi, tối nay đi karaoke cùng mình không?' },
        { who: 'パク', role: 'b', text: 'カラオケですか。いいですね。{行|い}きましょう。', ro: 'Karaoke desu ka. Ii desu ne. Ikimashou.', vi: 'Karaoke à? Hay đấy. Đi thôi.' },
        { who: 'アンナ', role: 'a', text: 'よかった。ワンさんも{行|い}きますよ。', ro: 'Yokatta. Wan-san mo ikimasu yo.', vi: 'Tốt quá. Wang cũng đi đấy.' },
        { who: 'パク', role: 'b', text: 'そうですか。{楽|たの}しみです。', ro: 'Sou desu ka. Tanoshimi desu.', vi: 'Thế à. Mình mong lắm.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Rủ đi ăn — từ chối khéo',
      lines: [
        { who: 'ワン', role: 'c', text: 'ダニエルさん、{今週|こんしゅう}の{金曜日|きんようび}、{一緒|いっしょ}にご{飯|はん}を{食|た}べませんか。', ro: 'Danieru-san, konshuu no kinyoubi, issho ni gohan o tabemasen ka.', vi: 'Daniel ơi, thứ Sáu tuần này đi ăn cùng mình không?' },
        { who: 'ダニエル', role: 'b', text: 'ああ、{金曜日|きんようび}ですか。すみません。{金曜日|きんようび}はちょっと……。', ro: 'Aa, kinyoubi desu ka. Sumimasen. Kinyoubi wa chotto……', vi: 'À, thứ Sáu à. Xin lỗi nhé. Thứ Sáu thì hơi…' },
        { who: 'ワン', role: 'c', text: 'そうですか。', ro: 'Sou desu ka.', vi: 'Vậy à.' },
        { who: 'ダニエル', role: 'b', text: 'アルバイトがありますから。', ro: 'Arubaito ga arimasu kara.', vi: 'Vì mình có ca làm thêm.' },
        { who: 'ワン', role: 'c', text: 'ああ、そうですか。{残念|ざんねん}です。じゃ、また{今度|こんど}。', ro: 'Aa, sou desu ka. Zannen desu. Ja, mata kondo.', vi: 'À, vậy à. Tiếc quá. Thế thì hẹn lần sau nhé.' },
        { who: 'ダニエル', role: 'b', text: 'はい、また{今度|こんど}。', ro: 'Hai, mata kondo.', vi: 'Ừ, hẹn lần sau.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Trước bảng thông báo — có trận bóng chày',
      lines: [
        { who: 'パク', role: 'b', text: 'あ、{来週|らいしゅう}の{日曜日|にちようび}、{横浜|よこはま}で{野球|やきゅう}の{試合|しあい}がありますよ。', ro: 'A, raishuu no nichiyoubi, Yokohama de yakyuu no shiai ga arimasu yo.', vi: 'A, Chủ Nhật tuần sau có trận bóng chày ở Yokohama đấy.' },
        { who: 'アンナ', role: 'a', text: 'へえ。', ro: 'Hee.', vi: 'Ồ.' },
        { who: 'パク', role: 'b', text: 'アンナさん、{一緒|いっしょ}に{見|み}に{行|い}きませんか。', ro: 'Anna-san, issho ni mi ni ikimasen ka.', vi: 'Anna, đi xem cùng mình không?' },
        { who: 'アンナ', role: 'a', text: 'いいですね。{行|い}きましょう。', ro: 'Ii desu ne. Ikimashou.', vi: 'Hay đấy. Đi thôi.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Có 2 vé hoà nhạc',
      lines: [
        { who: 'ワン', role: 'c', text: 'アンナさんはジャズが{好|す}きですか。', ro: 'Anna-san wa jazu ga suki desu ka.', vi: 'Anna có thích nhạc jazz không?' },
        { who: 'アンナ', role: 'a', text: 'はい、{好|す}きです。', ro: 'Hai, suki desu.', vi: 'Có, mình thích.' },
        { who: 'ワン', role: 'c', text: 'そうですか。ジャズのコンサートのチケットが{2枚|にまい}あります。{一緒|いっしょ}に{行|い}きませんか。', ro: 'Sou desu ka. Jazu no konsaato no chiketto ga nimai arimasu. Issho ni ikimasen ka.', vi: 'Vậy à. Mình có 2 vé buổi hoà nhạc jazz. Đi cùng mình không?' },
        { who: 'アンナ', role: 'a', text: 'わあ、いいですね。ぜひ{行|い}きたいです。', ro: 'Waa, ii desu ne. Zehi ikitai desu.', vi: 'Oa, hay quá. Mình rất muốn đi.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{一緒|いっしょ}に{映画|えいが}を{見|み}ませんか。', ro: 'Issho ni eiga o mimasen ka.', vi: 'Cùng xem phim không? — lời rủ: V**ませんか**.' },
        { en: '{今晩|こんばん}、{飲|の}みに{行|い}きませんか。', ro: 'Konban, nomi ni ikimasen ka.', vi: 'Tối nay đi uống (nhậu) không? — V(bỏ ます)**に{行|い}きませんか** = rủ ĐI để làm gì.' },
        { en: 'いいですね。{行|い}きましょう。', ro: 'Ii desu ne. Ikimashou.', vi: 'Hay đấy. Đi thôi. — nhận lời.' },
        { en: 'すみません。{今晩|こんばん}はちょっと……。{用事|ようじ}がありますから。', ro: 'Sumimasen. Konban wa chotto……. Youji ga arimasu kara.', vi: 'Xin lỗi. Tối nay thì hơi… Vì mình có việc bận. — từ chối khéo.' },
        { en: '{残念|ざんねん}です。じゃ、また{今度|こんど}。', ro: 'Zannen desu. Ja, mata kondo.', vi: 'Tiếc quá. Vậy hẹn lần sau. — người rủ đáp lại khi bị từ chối.' },
        { en: '{横浜|よこはま}で{野球|やきゅう}の{試合|しあい}があります。', ro: 'Yokohama de yakyuu no shiai ga arimasu.', vi: 'Ở Yokohama có trận bóng chày. — N1 (nơi) **で** N2 (sự kiện) **があります**.' },
        { en: 'チケットが{2枚|にまい}あります。', ro: 'Chiketto ga nimai arimasu.', vi: 'Tôi có 2 vé. — N **が** số lượng **あります**.' },
      ],
    },

    /* ── ② どちらがいいですか ── */
    { t: 'h', text: '② どちらがいいですか — Cái nào hơn?' },
    {
      t: 'p',
      text: 'Tình huống: đã rủ được nhau rồi, giờ **chọn**: xem phim gì, xem ở rạp nào, ăn ở quán nào. Các bạn hỏi nhau thích gì **nhất**, rồi **so sánh** hai chỗ (gần/xa, rẻ/đắt, rộng/hẹp) để quyết định.',
    },
    {
      t: 'dialogue',
      title: 'Thích thể loại phim nào nhất?',
      lines: [
        { who: 'パク', role: 'b', text: 'ワンさん、{映画|えいが}で{何|なに}がいちばん{好|す}きですか。', ro: 'Wan-san, eiga de nani ga ichiban suki desu ka.', vi: 'Wang, trong các loại phim bạn thích loại nào nhất?' },
        { who: 'ワン', role: 'c', text: 'コメディーがいちばん{好|す}きです。', ro: 'Komedii ga ichiban suki desu.', vi: 'Mình thích phim hài nhất.' },
        { who: 'パク', role: 'b', text: 'そうですか。じゃ、{土曜日|どようび}、{一緒|いっしょ}にコメディーを{見|み}に{行|い}きませんか。', ro: 'Sou desu ka. Ja, doyoubi, issho ni komedii o mi ni ikimasen ka.', vi: 'Vậy à. Thế thứ Bảy đi xem phim hài cùng mình không?' },
        { who: 'ワン', role: 'c', text: 'いいですね。どこで{見|み}ますか。', ro: 'Ii desu ne. Doko de mimasu ka.', vi: 'Hay đấy. Xem ở đâu?' },
      ],
    },
    {
      t: 'table',
      caption: 'Hai rạp gần trường (thông tin tự đặt)',
      head: ['Rạp', 'Đi thế nào', 'Giá vé'],
      rows: [
        ['さくら{映画館|えいがかん}', '{駅|えき}から{歩|ある}いて{5分|ごふん}', '{1,800円|せんはっぴゃくえん}'],
        ['みなと{映画館|えいがかん}', '{駅|えき}からバスで{20分|にじゅっぷん}', '{1,200円|せんにひゃくえん}'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Rạp nào gần hơn? Rạp nào rẻ hơn?',
      lines: [
        { who: 'パク', role: 'b', text: 'さくら{映画館|えいがかん}とみなと{映画館|えいがかん}があります。', ro: 'Sakura eigakan to Minato eigakan ga arimasu.', vi: 'Có rạp Sakura và rạp Minato.' },
        { who: 'ワン', role: 'c', text: 'さくら{映画館|えいがかん}とみなと{映画館|えいがかん}とどちらが{近|ちか}いですか。', ro: 'Sakura eigakan to Minato eigakan to dochira ga chikai desu ka.', vi: 'Rạp Sakura và rạp Minato, rạp nào gần hơn?' },
        { who: 'パク', role: 'b', text: 'さくら{映画館|えいがかん}のほうが{近|ちか}いです。でも、みなと{映画館|えいがかん}のほうが{安|やす}いですよ。', ro: 'Sakura eigakan no hou ga chikai desu. Demo, Minato eigakan no hou ga yasui desu yo.', vi: 'Rạp Sakura gần hơn. Nhưng rạp Minato rẻ hơn đấy.' },
        { who: 'ワン', role: 'c', text: 'そうですねえ……。さくら{映画館|えいがかん}のほうがいいです。みなと{映画館|えいがかん}は{遠|とお}いですから。', ro: 'Sou desu nee……. Sakura eigakan no hou ga ii desu. Minato eigakan wa tooi desu kara.', vi: 'Để xem nào… Rạp Sakura hơn. Vì rạp Minato xa.' },
        { who: 'パク', role: 'b', text: 'じゃ、さくら{映画館|えいがかん}へ{行|い}きましょう。', ro: 'Ja, Sakura eigakan e ikimashou.', vi: 'Vậy mình đi rạp Sakura nhé.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Ăn gì sau khi xem phim? — ラーメン hay 焼き肉',
      lines: [
        { who: 'アンナ', role: 'a', text: 'ダニエルさん、ラーメンと{焼|や}き{肉|にく}とどちらがいいですか。', ro: 'Danieru-san, raamen to yakiniku to dochira ga ii desu ka.', vi: 'Daniel, mì ramen với thịt nướng, cậu thích cái nào hơn?' },
        { who: 'ダニエル', role: 'b', text: 'そうですねえ。{焼|や}き{肉|にく}のほうがいいです。', ro: 'Sou desu nee. Yakiniku no hou ga ii desu.', vi: 'Để xem nào. Thịt nướng hơn.' },
        { who: 'アンナ', role: 'a', text: '{新宿|しんじゅく}に{焼|や}き{肉|にく}の{食|た}べ{放題|ほうだい}の{店|みせ}がありますよ。{90分|きゅうじゅっぷん}{2,000円|にせんえん}です。', ro: 'Shinjuku ni yakiniku no tabehoudai no mise ga arimasu yo. Kyuujuppun nisen en desu.', vi: 'Ở Shinjuku có quán thịt nướng ăn thoả thích đấy. 90 phút 2.000 yên.' },
        { who: 'ダニエル', role: 'b', text: 'わあ、{安|やす}いですね。{飲|の}み{物|もの}も{飲|の}み{放題|ほうだい}ですか。', ro: 'Waa, yasui desu ne. Nomimono mo nomihoudai desu ka.', vi: 'Oa, rẻ nhỉ. Đồ uống cũng uống thoả thích à?' },
        { who: 'アンナ', role: 'a', text: 'はい、{飲|の}み{物|もの}も{全部|ぜんぶ}{飲|の}み{放題|ほうだい}ですよ。', ro: 'Hai, nomimono mo zenbu nomihoudai desu yo.', vi: 'Có, đồ uống cũng uống thoả thích hết đấy.' },
        { who: 'ダニエル', role: 'b', text: 'いいですね。そこへ{行|い}きましょう。', ro: 'Ii desu ne. Soko e ikimashou.', vi: 'Hay đấy. Đi chỗ đó đi.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{日本|にほん}の{食|た}べ{物|もの}で{何|なに}がいちばん{好|す}きですか。——すき{焼|や}きがいちばん{好|す}きです。', ro: 'Nihon no tabemono de nani ga ichiban suki desu ka. — Sukiyaki ga ichiban suki desu.', vi: 'Trong đồ ăn Nhật bạn thích gì nhất? — Tôi thích sukiyaki nhất.' },
        { en: 'AとBとどちらが{近|ちか}いですか。——Aのほうが{近|ちか}いです。', ro: 'A to B to dochira ga chikai desu ka. — A no hou ga chikai desu.', vi: 'A và B, cái nào gần hơn? — A gần hơn.' },
        { en: '{新宿|しんじゅく}は{渋谷|しぶや}より{近|ちか}いです。', ro: 'Shinjuku wa Shibuya yori chikai desu.', vi: 'Shinjuku gần hơn Shibuya.' },
        { en: 'そうですねえ……。', ro: 'Sou desu nee…….', vi: 'Để xem nào… (câu ngập ngừng khi đang nghĩ câu trả lời).' },
        { en: 'どちらもいいですね。', ro: 'Dochira mo ii desu ne.', vi: 'Cái nào cũng hay nhỉ.' },
      ],
    },

    /* ── ③ 約束 ── */
    { t: 'h', text: '③ {約束|やくそく} — Hẹn nhau' },
    {
      t: 'p',
      text: 'Tình huống: hai bạn muốn **đi chơi cùng nhau lần tới**. Trước khi rủ đi đâu, hỏi xem bạn **đã** đến đó **chưa** (もう～ましたか). Rồi đề xuất (～はどうですか), chốt ngày – giờ – chỗ gặp và nhắc lại để xác nhận (～ですね).',
    },
    {
      t: 'dialogue',
      title: 'Đã đi tháp Tokyo chưa?',
      lines: [
        { who: 'ダニエル', role: 'b', text: 'ワンさん、{今度|こんど}、{一緒|いっしょ}に{遊|あそ}びに{行|い}きませんか。', ro: 'Wan-san, kondo, issho ni asobi ni ikimasen ka.', vi: 'Wang, lần tới đi chơi cùng mình không?' },
        { who: 'ワン', role: 'c', text: 'いいですね。{何|なに}をしますか。', ro: 'Ii desu ne. Nani o shimasu ka.', vi: 'Hay đấy. Làm gì?' },
        { who: 'ダニエル', role: 'b', text: 'ワンさんはもう{東京|とうきょう}タワーへ{行|い}きましたか。', ro: 'Wan-san wa mou Toukyou tawaa e ikimashita ka.', vi: 'Wang đã đi tháp Tokyo chưa?' },
        { who: 'ワン', role: 'c', text: 'いいえ、まだです。', ro: 'Iie, mada desu.', vi: 'Chưa, mình chưa đi.' },
        { who: 'ダニエル', role: 'b', text: 'じゃ、{東京|とうきょう}タワーへ{行|い}きませんか。{景色|けしき}がきれいですよ。', ro: 'Ja, Toukyou tawaa e ikimasen ka. Keshiki ga kirei desu yo.', vi: 'Vậy đi tháp Tokyo không? Phong cảnh đẹp lắm đấy.' },
        { who: 'ワン', role: 'c', text: 'いいですね。そうしましょう。', ro: 'Ii desu ne. Sou shimashou.', vi: 'Hay đấy. Làm vậy đi.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Nhánh khác: bạn ĐÃ đi rồi',
      lines: [
        { who: 'ダニエル', role: 'b', text: 'アンナさんはもう{東京|とうきょう}タワーへ{行|い}きましたか。', ro: 'Anna-san wa mou Toukyou tawaa e ikimashita ka.', vi: 'Anna đã đi tháp Tokyo chưa?' },
        { who: 'アンナ', role: 'a', text: 'はい、{行|い}きました。{先月|せんげつ}、{友達|ともだち}と{行|い}きました。', ro: 'Hai, ikimashita. Sengetsu, tomodachi to ikimashita.', vi: 'Rồi, mình đi rồi. Tháng trước mình đi với bạn.' },
        { who: 'ダニエル', role: 'b', text: 'そうですか。じゃ、お{台場|だいば}へ{行|い}きませんか。', ro: 'Sou desu ka. Ja, Odaiba e ikimasen ka.', vi: 'Vậy à. Thế đi Odaiba không?' },
        { who: 'アンナ', role: 'a', text: 'お{台場|だいば}はまだです。ぜひ{行|い}きたいです。', ro: 'Odaiba wa mada desu. Zehi ikitai desu.', vi: 'Odaiba thì mình chưa đi. Nhất định mình muốn đi.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Rủ ăn お好み焼き, chốt ngày – giờ – chỗ gặp',
      lines: [
        { who: 'アンナ', role: 'a', text: 'パクさん、{一緒|いっしょ}にお{好|この}み{焼|や}きを{食|た}べに{行|い}きませんか。{新宿|しんじゅく}のお{好|この}み{焼|や}きはおいしいですよ。', ro: 'Paku-san, issho ni okonomiyaki o tabe ni ikimasen ka. Shinjuku no okonomiyaki wa oishii desu yo.', vi: 'Park ơi, đi ăn okonomiyaki cùng mình không? Okonomiyaki ở Shinjuku ngon lắm đấy.' },
        { who: 'パク', role: 'b', text: 'へえ。ぜひ{行|い}きたいです。いつ{行|い}きますか。', ro: 'Hee. Zehi ikitai desu. Itsu ikimasu ka.', vi: 'Ồ. Mình rất muốn đi. Khi nào đi?' },
        { who: 'アンナ', role: 'a', text: '{金曜日|きんようび}はどうですか。', ro: 'Kinyoubi wa dou desu ka.', vi: 'Thứ Sáu thì sao?' },
        { who: 'パク', role: 'b', text: 'すみません。{金曜日|きんようび}はちょっと……。{土曜日|どようび}はどうですか。', ro: 'Sumimasen. Kinyoubi wa chotto……. Doyoubi wa dou desu ka.', vi: 'Xin lỗi. Thứ Sáu thì hơi… Thứ Bảy thì sao?' },
        { who: 'アンナ', role: 'a', text: 'いいですよ。{何時|なんじ}に{会|あ}いますか。', ro: 'Ii desu yo. Nanji ni aimasu ka.', vi: 'Được đấy. Mấy giờ gặp?' },
        { who: 'パク', role: 'b', text: '{6時|ろくじ}はどうですか。', ro: 'Rokuji wa dou desu ka.', vi: '6 giờ thì sao?' },
        { who: 'アンナ', role: 'a', text: '{6時|ろくじ}ですね。わかりました。どこで{会|あ}いますか。', ro: 'Rokuji desu ne. Wakarimashita. Doko de aimasu ka.', vi: '6 giờ nhé. Mình hiểu rồi. Gặp ở đâu?' },
        { who: 'パク', role: 'b', text: '{新宿駅|しんじゅくえき}はどうですか。', ro: 'Shinjuku eki wa dou desu ka.', vi: 'Ga Shinjuku thì sao?' },
        { who: 'アンナ', role: 'a', text: 'はい。じゃ、{土曜日|どようび}の{6時|ろくじ}に{新宿駅|しんじゅくえき}で。', ro: 'Hai. Ja, doyoubi no rokuji ni Shinjuku eki de.', vi: 'Ừ. Vậy 6 giờ thứ Bảy ở ga Shinjuku nhé.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'もう{昼|ひる}ご{飯|はん}を{食|た}べましたか。——はい、{食|た}べました。／いいえ、まだです。', ro: 'Mou hirugohan o tabemashita ka. — Hai, tabemashita. / Iie, mada desu.', vi: 'Bạn đã ăn trưa chưa? — Rồi, tôi ăn rồi. / Chưa, tôi chưa ăn.' },
        { en: '{何|なに}を{食|た}べますか。——すき{焼|や}きはどうですか。', ro: 'Nani o tabemasu ka. — Sukiyaki wa dou desu ka.', vi: 'Ăn gì đây? — Sukiyaki thì sao? (đề xuất)' },
        { en: '{5時|ごじ}に{会|あ}いましょう。——{5時|ごじ}ですね。', ro: 'Goji ni aimashou. — Goji desu ne.', vi: 'Gặp nhau lúc 5 giờ nhé. — 5 giờ nhé. (nhắc lại để xác nhận)' },
        { en: 'この{店|みせ}のラーメンはおいしいですよ。', ro: 'Kono mise no raamen wa oishii desu yo.', vi: 'Ramen quán này ngon lắm đấy. — ～よ: báo cho người nghe điều họ chưa biết.' },
        { en: 'いいですね。そうしましょう。／わかりました。', ro: 'Ii desu ne. Sou shimashou. / Wakarimashita.', vi: 'Hay đấy, làm vậy đi. / Mình hiểu rồi (đồng ý).' },
      ],
    },

    /* ── 話読聞書 ── */
    { t: 'h', text: '④ Nói–Đọc–Nghe–Viết (話読聞書) — {私|わたし}の{好|す}きな{日本|にほん}の{食|た}べ{物|もの}' },
    {
      t: 'p',
      text: 'Bài đọc mẫu (viết mới, cùng kiểu với sách): một bạn giới thiệu món Nhật mình thích **nhất** rồi **rủ** người đọc đi ăn cùng. Đọc to từng câu, rồi viết một đoạn y khung về món bạn thích.',
    },
    {
      t: 'passage',
      title: 'すき{焼|や}きを{食|た}べに{行|い}きませんか',
      paras: [
        { text: '{皆|みな}さんは{日本|にほん}の{食|た}べ{物|もの}で{何|なに}がいちばん{好|す}きですか。{私|わたし}はすき{焼|や}きがいちばん{好|す}きです。すき{焼|や}きは{牛肉|ぎゅうにく}と{野菜|やさい}の{料理|りょうり}です。{少|すこ}し{甘|あま}いです。{私|わたし}はラーメンも{好|す}きですが、すき{焼|や}きのほうが{好|す}きです。{新宿|しんじゅく}においしいすき{焼|や}きの{店|みせ}がありますよ。{今度|こんど}、{一緒|いっしょ}に{食|た}べに{行|い}きませんか。' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{皆|みな}さんは{日本|にほん}の{食|た}べ{物|もの}で{何|なに}がいちばん{好|す}きですか。', ro: 'Minasan wa Nihon no tabemono de nani ga ichiban suki desu ka.', vi: 'Các bạn thích món gì nhất trong các món Nhật?' },
        { en: '{私|わたし}はすき{焼|や}きがいちばん{好|す}きです。', ro: 'Watashi wa sukiyaki ga ichiban suki desu.', vi: 'Tôi thích sukiyaki nhất.' },
        { en: 'すき{焼|や}きは{牛肉|ぎゅうにく}と{野菜|やさい}の{料理|りょうり}です。{少|すこ}し{甘|あま}いです。', ro: 'Sukiyaki wa gyuuniku to yasai no ryouri desu. Sukoshi amai desu.', vi: 'Sukiyaki là món thịt bò và rau. Hơi ngọt.' },
        { en: '{私|わたし}はラーメンも{好|す}きですが、すき{焼|や}きのほうが{好|す}きです。', ro: 'Watashi wa raamen mo suki desu ga, sukiyaki no hou ga suki desu.', vi: 'Tôi cũng thích ramen, nhưng thích sukiyaki hơn.' },
        { en: '{新宿|しんじゅく}においしいすき{焼|や}きの{店|みせ}がありますよ。', ro: 'Shinjuku ni oishii sukiyaki no mise ga arimasu yo.', vi: 'Ở Shinjuku có quán sukiyaki ngon đấy. — {場所|ばしょ}に N があります (Bài 4) + よ.' },
        { en: '{今度|こんど}、{一緒|いっしょ}に{食|た}べに{行|い}きませんか。', ro: 'Kondo, issho ni tabe ni ikimasen ka.', vi: 'Lần tới đi ăn cùng tôi không?' },
      ],
    },
    {
      t: 'note',
      title: 'Viết đoạn "Món tôi thích nhất" theo khung',
      items: [
        '**Câu 1 — hỏi mở đầu:** {皆|みな}さんは ___ で{何|なに}がいちばん{好|す}きですか。',
        '**Câu 2 — món của bạn:** {私|わたし}は ___ がいちばん{好|す}きです。',
        '**Câu 3 — món đó là gì, vị ra sao:** ___ は ___ の{料理|りょうり}です。とても／{少|すこ}し ___ いです。',
        '**Câu 4 — so sánh:** {私|わたし}は ___ も{好|す}きですが、___ のほうが{好|す}きです。',
        '**Câu 5 — rủ:** {今度|こんど}、{一緒|いっしょ}に ___ を{食|た}べに{行|い}きませんか。',
        'Từ {皆|みな}さん (các bạn — từ thêm), {牛肉|ぎゅうにく}, {野菜|やさい}, {料理|りょうり} (Bài 2), {甘|あま}い, {少|すこ}し (Bài 4). Câu 4 dùng ～が、～ (nhưng, Bài 4) + ポイント 56.',
      ],
    },

    /* ── できる！ ── */
    { t: 'h', text: 'できる！— Tìm một sự kiện rồi rủ bạn' },
    {
      t: 'p',
      text: 'Nhiệm vụ 3 bước như sách: ① tra trên mạng/tạp chí một sự kiện (ngày, nơi, giá vé) → ② rủ bạn → ③ bàn và hẹn. Dưới đây là 4 tấm poster tự đặt để luyện; mỗi dòng là một cuộc rủ hoàn chỉnh.',
    },
    {
      t: 'table',
      caption: 'Bảng sự kiện cuối tuần (tự đặt)',
      head: ['Sự kiện', 'Ở đâu', 'Khi nào', 'Câu rủ'],
      rows: [
        ['{花火|はなび}{大会|たいかい} (lễ hội pháo hoa)', '{横浜|よこはま}', '{7月|しちがつ}{27日|にじゅうしちにち}（{土|ど}）{7時|しちじ}〜', '{横浜|よこはま}で{花火|はなび}{大会|たいかい}があります。{一緒|いっしょ}に{見|み}に{行|い}きませんか。'],
        ['ジャズコンサート', '{上野|うえの}', '{来週|らいしゅう}の{金曜日|きんようび}{6時|ろくじ}〜', 'チケットが{2枚|にまい}あります。{一緒|いっしょ}に{行|い}きませんか。'],
        ['サッカーの{試合|しあい}', '{東京|とうきょう}', '{今月|こんげつ}の{20日|はつか}', '{一緒|いっしょ}にサッカーの{試合|しあい}を{見|み}に{行|い}きませんか。'],
        ['{夏|なつ}のセール', 'みどりデパート', '{来月|らいげつ}の{1日|ついたち}から', '{一緒|いっしょ}に{水着|みずぎ}を{買|か}いに{行|い}きませんか。'],
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */
/* Đủ 55 từ + 8 câu mẫu của "Từ mới bài 6" (sổ tra JPD123 mục 1–63), chia 7 nhóm:
 * 7 + 10 + 4 + 11 + 9 + 6 + 8 = 55. */

const TU_VUNG: Lesson = {
  id: 'b6-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 55 từ của danh sách Bài 6',
  goal: 'Thuộc đủ 55 từ (và 8 câu mẫu) trong danh sách từ mới Bài 6 của cô; mỗi từ dùng được trong một câu rủ, câu so sánh hoặc câu hẹn.',
  minutes: 40,
  blocks: [
    {
      t: 'p',
      text: 'Đủ **55 từ** trong danh sách "Từ mới bài 6" cô phát (sổ tra JPD123 có 63 dòng: 55 từ + **8 câu mẫu**, câu mẫu nằm ở cuối bài này). Chia thành 7 nhóm theo chủ đề. Câu ví dụ chỉ dùng từ Bài 1–6, nói lại được ngay. Cách học: bấm 🔊 → đọc to 3 lần → che nghĩa, tự nói.',
    },
    {
      t: 'note',
      title: 'Cách đọc romaji trong khoá',
      items: [
        'Trường âm viết theo đúng chữ kana: {来週|らいしゅう} → **raishuu**, {約束|やくそく} → yakusoku, {遠|とお}い → **tooi**, コンサート → **konsaato**, ラーメン → **raamen**.',
        'Âm ngắt っ viết đôi phụ âm: {一緒|いっしょ}に → **issho ni**, チケット → **chiketto**.',
        'ん trước nguyên âm: {残念|ざんねん} → zannen; {金曜日|きんようび} → kinyoubi (đọc kin-you-bi).',
      ],
    },

    { t: 'h', text: 'A. Thời gian & kế hoạch (7 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{今週|こんしゅう}', pos: 'danh từ', ipa: 'konshuu', vi: 'tuần này', ex: '{今週|こんしゅう}の{土曜日|どようび}、{一緒|いっしょ}に{映画|えいが}を{見|み}ませんか。', exRo: 'Konshuu no doyoubi, issho ni eiga o mimasen ka.', exVi: 'Thứ Bảy tuần này cùng xem phim không?' },
        { w: '{来週|らいしゅう}', pos: 'danh từ', ipa: 'raishuu', vi: 'tuần sau', ex: '{来週|らいしゅう}の{月曜日|げつようび}、テストがあります。', exRo: 'Raishuu no getsuyoubi, tesuto ga arimasu.', exVi: 'Thứ Hai tuần sau có bài kiểm tra.' },
        { w: '{今月|こんげつ}', pos: 'danh từ', ipa: 'kongetsu', vi: 'tháng này', ex: '{今月|こんげつ}の{20日|はつか}、コンサートがあります。', exRo: 'Kongetsu no hatsuka, konsaato ga arimasu.', exVi: 'Ngày 20 tháng này có buổi hoà nhạc.' },
        { w: '{来月|らいげつ}', pos: 'danh từ', ipa: 'raigetsu', vi: 'tháng sau', ex: '{来月|らいげつ}の{15日|じゅうごにち}、ドライブに{行|い}きませんか。', exRo: 'Raigetsu no juugonichi, doraibu ni ikimasen ka.', exVi: 'Ngày 15 tháng sau đi lái xe dạo chơi không?' },
        { w: '{約束|やくそく}', pos: 'danh từ', ipa: 'yakusoku', vi: 'cuộc hẹn; lời hứa (約束があります = có hẹn)', ex: '{明日|あした}、{友達|ともだち}と{約束|やくそく}があります。', exRo: 'Ashita, tomodachi to yakusoku ga arimasu.', exVi: 'Ngày mai tôi có hẹn với bạn.' },
        { w: '{用事|ようじ}', pos: 'danh từ', ipa: 'youji', vi: 'việc bận, việc riêng (lý do từ chối lịch sự nhất)', ex: '{今晩|こんばん}、{用事|ようじ}があります。', exRo: 'Konban, youji ga arimasu.', exVi: 'Tối nay tôi có việc bận. (câu mẫu của cô)' },
        { w: '{季節|きせつ}', pos: 'danh từ', ipa: 'kisetsu', vi: 'mùa (xuân, hạ, thu, đông)', ex: '{季節|きせつ}で{何|なに}がいちばん{好|す}きですか。——{秋|あき}がいちばん{好|す}きです。', exRo: 'Kisetsu de nani ga ichiban suki desu ka. — Aki ga ichiban suki desu.', exVi: 'Trong các mùa bạn thích mùa nào nhất? — Tôi thích mùa thu nhất.' },
      ],
    },
    {
      t: 'table',
      caption: 'Ôn trọn bộ tuần – tháng (表 p.288) — Bài 5 đã có 先週/先月',
      head: ['', 'trước', 'này', 'sau'],
      rows: [
        ['Tuần ({週|しゅう})', '{先週|せんしゅう} senshuu', '**{今週|こんしゅう}** konshuu', '**{来週|らいしゅう}** raishuu'],
        ['Tháng ({月|げつ})', '{先月|せんげつ} sengetsu', '**{今月|こんげつ}** kongetsu', '**{来月|らいげつ}** raigetsu'],
        ['Năm', '{去年|きょねん} kyonen', '{今年|ことし} kotoshi', '{来年|らいねん} rainen'],
        ['Ngày', '{昨日|きのう} kinou', '{今日|きょう} kyou', '{明日|あした} ashita'],
      ],
    },

    { t: 'h', text: 'B. Giải trí & sự kiện (10 từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'カラオケ', pos: 'danh từ', ipa: 'karaoke', vi: 'hát karaoke (カラオケに行きます = đi karaoke)', ex: '{週末|しゅうまつ}、カラオケに{行|い}きませんか。', exRo: 'Shuumatsu, karaoke ni ikimasen ka.', exVi: 'Cuối tuần đi karaoke không?' },
        { w: 'コンサート', pos: 'danh từ', ipa: 'konsaato', vi: 'buổi hoà nhạc', ex: '{上野|うえの}でピアノのコンサートがあります。', exRo: 'Ueno de piano no konsaato ga arimasu.', exVi: 'Ở Ueno có buổi hoà nhạc piano.' },
        { w: '{試合|しあい}', pos: 'danh từ', ipa: 'shiai', vi: 'trận đấu', ex: '{横浜|よこはま}で{野球|やきゅう}の{試合|しあい}があります。', exRo: 'Yokohama de yakyuu no shiai ga arimasu.', exVi: 'Ở Yokohama có trận bóng chày. (câu mẫu của cô)' },
        { w: '{野球|やきゅう}', pos: 'danh từ', ipa: 'yakyuu', vi: 'bóng chày', ex: 'スポーツで{野球|やきゅう}がいちばんおもしろいです。', exRo: 'Supootsu de yakyuu ga ichiban omoshiroi desu.', exVi: 'Trong các môn thể thao, bóng chày hay nhất.' },
        { w: 'セール', pos: 'danh từ', ipa: 'seeru', vi: 'đợt giảm giá, bán hạ giá (sale)', ex: 'デパートで{夏|なつ}のセールがあります。', exRo: 'Depaato de natsu no seeru ga arimasu.', exVi: 'Ở trung tâm thương mại có đợt giảm giá mùa hè.' },
        { w: 'ドライブ', pos: 'danh từ', ipa: 'doraibu', vi: 'lái xe đi dạo, đi chơi bằng ô tô (ドライブをします／ドライブに行きます)', ex: '{日曜日|にちようび}、{富士山|ふじさん}へドライブに{行|い}きます。', exRo: 'Nichiyoubi, Fujisan e doraibu ni ikimasu.', exVi: 'Chủ Nhật tôi lái xe đi chơi núi Phú Sĩ.' },
        { w: 'ジャズ', pos: 'danh từ', ipa: 'jazu', vi: 'nhạc jazz', ex: '{音楽|おんがく}でジャズがいちばん{好|す}きです。', exRo: 'Ongaku de jazu ga ichiban suki desu.', exVi: 'Trong các loại nhạc tôi thích jazz nhất.' },
        { w: 'コメディー', pos: 'danh từ', ipa: 'komedii', vi: 'phim hài, hài kịch', ex: 'コメディーとアニメとどちらが{好|す}きですか。', exRo: 'Komedii to anime to dochira ga suki desu ka.', exVi: 'Phim hài và phim hoạt hình, bạn thích cái nào hơn?' },
        { w: '{歌手|かしゅ}', pos: 'danh từ', ipa: 'kashu', vi: 'ca sĩ', ex: '{日本|にほん}の{歌手|かしゅ}で{誰|だれ}がいちばん{好|す}きですか。', exRo: 'Nihon no kashu de dare ga ichiban suki desu ka.', exVi: 'Trong các ca sĩ Nhật bạn thích ai nhất?' },
        { w: 'ツアー', pos: 'danh từ', ipa: 'tsuaa', vi: 'tour du lịch', ex: '{京都|きょうと}のツアーと{北海道|ほっかいどう}のツアーとどちらが{安|やす}いですか。', exRo: 'Kyouto no tsuaa to Hokkaidou no tsuaa to dochira ga yasui desu ka.', exVi: 'Tour Kyoto và tour Hokkaido, tour nào rẻ hơn?' },
      ],
    },

    { t: 'h', text: 'C. Đồ vật & cách đếm (4 từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'チケット', pos: 'danh từ', ipa: 'chiketto', vi: 'vé (xem phim, hoà nhạc, trận đấu)', ex: 'サッカーのチケットが{2枚|にまい}あります。', exRo: 'Sakkaa no chiketto ga nimai arimasu.', exVi: 'Tôi có 2 vé xem bóng đá.' },
        { w: '～{枚|まい}', pos: 'hậu tố đếm', ipa: '~mai', vi: '~ tờ, ~ tấm, ~ chiếc (đồ mỏng, phẳng: vé, giấy, áo phông, đĩa, tem)', ex: 'チケットが{2枚|にまい}あります。', exRo: 'Chiketto ga nimai arimasu.', exVi: 'Tôi có 2 vé. (câu mẫu của cô)' },
        { w: '{地図|ちず}', pos: 'danh từ', ipa: 'chizu', vi: 'bản đồ', ex: '{東京|とうきょう}の{地図|ちず}がありますか。', exRo: 'Toukyou no chizu ga arimasu ka.', exVi: 'Bạn có bản đồ Tokyo không?' },
        { w: '{水着|みずぎ}', pos: 'danh từ', ipa: 'mizugi', vi: 'đồ bơi', ex: 'セールで{水着|みずぎ}を{買|か}いました。', exRo: 'Seeru de mizugi o kaimashita.', exVi: 'Tôi đã mua đồ bơi trong đợt giảm giá.' },
      ],
    },

    { t: 'h', text: 'D. Ăn uống & địa điểm (11 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{食|た}べ{物|もの}', pos: 'danh từ', ipa: 'tabemono', vi: 'đồ ăn, món ăn', ex: '{日本|にほん}の{食|た}べ{物|もの}で{何|なに}がいちばん{好|す}きですか。', exRo: 'Nihon no tabemono de nani ga ichiban suki desu ka.', exVi: 'Trong đồ ăn Nhật bạn thích gì nhất?' },
        { w: '{飲|の}み{物|もの}', pos: 'danh từ', ipa: 'nomimono', vi: 'đồ uống', ex: '{飲|の}み{物|もの}は{何|なに}がいいですか。——お{茶|ちゃ}がいいです。', exRo: 'Nomimono wa nani ga ii desu ka. — Ocha ga ii desu.', exVi: 'Đồ uống bạn muốn gì? — Trà là được.' },
        { w: '{焼|や}き{肉|にく}', pos: 'danh từ', ipa: 'yakiniku', vi: 'thịt nướng (kiểu Nhật – Hàn, tự nướng tại bàn)', ex: '{今晩|こんばん}、{焼|や}き{肉|にく}を{食|た}べに{行|い}きませんか。', exRo: 'Konban, yakiniku o tabe ni ikimasen ka.', exVi: 'Tối nay đi ăn thịt nướng không?' },
        { w: 'ラーメン', pos: 'danh từ', ipa: 'raamen', vi: 'mì ramen (mì nước Nhật)', ex: 'この{店|みせ}のラーメンはとてもおいしいですよ。', exRo: 'Kono mise no raamen wa totemo oishii desu yo.', exVi: 'Ramen quán này ngon lắm đấy.' },
        { w: '{食|た}べ{放題|ほうだい}', pos: 'danh từ', ipa: 'tabehoudai', vi: 'ăn thoả thích, ăn buffet (trả một giá, ăn không giới hạn trong thời gian quy định)', ex: 'ケーキの{食|た}べ{放題|ほうだい}は{90分|きゅうじゅっぷん}{1,500円|せんごひゃくえん}です。', exRo: 'Keeki no tabehoudai wa kyuujuppun sen gohyaku en desu.', exVi: 'Buffet bánh ngọt 90 phút 1.500 yên.' },
        { w: 'コース', pos: 'danh từ', ipa: 'koosu', vi: 'set món (thực đơn trọn gói); khoá học', ex: 'AコースとBコースとどちらがいいですか。', exRo: 'Ee koosu to bii koosu to dochira ga ii desu ka.', exVi: 'Set A và set B, cái nào hơn?' },
        { w: '{居酒屋|いざかや}', pos: 'danh từ', ipa: 'izakaya', vi: 'quán nhậu kiểu Nhật (vừa uống rượu vừa ăn món nhỏ)', ex: '{新宿|しんじゅく}の{居酒屋|いざかや}はどうですか。', exRo: 'Shinjuku no izakaya wa dou desu ka.', exVi: 'Quán nhậu ở Shinjuku thì sao?' },
        { w: 'お{好|この}み{焼|や}き', pos: 'danh từ', ipa: 'okonomiyaki', vi: 'bánh xèo Nhật (bột, bắp cải, thịt, trứng nướng trên vỉ, rưới sốt)', ex: 'お{好|この}み{焼|や}きを{食|た}べに{行|い}きませんか。', exRo: 'Okonomiyaki o tabe ni ikimasen ka.', exVi: 'Đi ăn okonomiyaki không?' },
        { w: 'すき{焼|や}き', pos: 'danh từ', ipa: 'sukiyaki', vi: 'món sukiyaki (lẩu nhúng thịt bò và rau, nước dùng ngọt)', ex: 'うちで{日本|にほん}の{料理|りょうり}を{作|つく}ります。すき{焼|や}きはどうですか。', exRo: 'Uchi de Nihon no ryouri o tsukurimasu. Sukiyaki wa dou desu ka.', exVi: 'Mình nấu món Nhật ở nhà. Sukiyaki thì sao?' },
        { w: '{映画館|えいがかん}', pos: 'danh từ', ipa: 'eigakan', vi: 'rạp chiếu phim', ex: 'どこで{見|み}ますか。——さくら{映画館|えいがかん}はどうですか。{駅|えき}から{歩|ある}いて{5分|ごふん}です。', exRo: 'Doko de mimasu ka. — Sakura eigakan wa dou desu ka. Eki kara aruite gofun desu.', exVi: 'Xem ở đâu? — Rạp Sakura thì sao? Từ ga đi bộ 5 phút.' },
        { w: '{地下鉄|ちかてつ}', pos: 'danh từ', ipa: 'chikatetsu', vi: 'tàu điện ngầm', ex: 'バスと{地下鉄|ちかてつ}とどちらが{早|はや}いですか。——{地下鉄|ちかてつ}のほうが{早|はや}いです。', exRo: 'Basu to chikatetsu to dochira ga hayai desu ka. — Chikatetsu no hou ga hayai desu.', exVi: 'Xe buýt và tàu điện ngầm, cái nào nhanh hơn? — Tàu điện ngầm nhanh hơn.' },
      ],
    },

    { t: 'h', text: 'E. Tính từ & từ so sánh (9 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{近|ちか}い', pos: 'tính từ đuôi い', ipa: 'chikai', vi: 'gần', ex: 'さくら{映画館|えいがかん}のほうが{近|ちか}いです。', exRo: 'Sakura eigakan no hou ga chikai desu.', exVi: 'Rạp Sakura gần hơn.' },
        { w: '{遠|とお}い', pos: 'tính từ đuôi い', ipa: 'tooi', vi: 'xa', ex: '{学校|がっこう}はうちから{遠|とお}いです。', exRo: 'Gakkou wa uchi kara tooi desu.', exVi: 'Trường xa nhà tôi.' },
        { w: '{早|はや}い', pos: 'tính từ đuôi い', ipa: 'hayai', vi: 'sớm; nhanh (về thời gian — đi tàu nào đến sớm hơn)', ex: '{電車|でんしゃ}はバスより{早|はや}いです。', exRo: 'Densha wa basu yori hayai desu.', exVi: 'Tàu điện nhanh (đến sớm) hơn xe buýt.' },
        { w: '{広|ひろ}い', pos: 'tính từ đuôi い', ipa: 'hiroi', vi: 'rộng', ex: 'みどり{公園|こうえん}はさくら{公園|こうえん}より{広|ひろ}いです。', exRo: 'Midori kouen wa Sakura kouen yori hiroi desu.', exVi: 'Công viên Midori rộng hơn công viên Sakura.' },
        { w: '{残念|ざんねん}（な）', pos: 'tính từ đuôi な', ipa: 'zannen (na)', vi: 'tiếc, đáng tiếc (đáp lại khi bị từ chối)', ex: 'そうですか。{残念|ざんねん}です。', exRo: 'Sou desu ka. Zannen desu.', exVi: 'Vậy à. Tiếc quá.' },
        { w: 'どちら', pos: 'từ để hỏi', ipa: 'dochira', vi: 'cái nào, bên nào (chọn 1 trong 2); cũng là どこ lịch sự', ex: 'ラーメンとすしとどちらがいいですか。', exRo: 'Raamen to sushi to dochira ga ii desu ka.', exVi: 'Ramen và sushi, cái nào hơn?' },
        { w: 'どちらも', pos: 'phó từ', ipa: 'dochira mo', vi: 'cả hai, bên nào cũng', ex: 'どちらも{好|す}きです。', exRo: 'Dochira mo suki desu.', exVi: 'Cái nào tôi cũng thích.' },
        { w: 'いちばん', pos: 'phó từ', ipa: 'ichiban', vi: 'nhất, số một', ex: 'クラスでアンナさんがいちばん{早|はや}いです。', exRo: 'Kurasu de Anna-san ga ichiban hayai desu.', exVi: 'Trong lớp Anna (đến) sớm nhất.' },
        { w: '{全部|ぜんぶ}', pos: 'danh từ / phó từ', ipa: 'zenbu', vi: 'tất cả, toàn bộ', ex: 'ケーキを{全部|ぜんぶ}{食|た}べました。', exRo: 'Keeki o zenbu tabemashita.', exVi: 'Tôi đã ăn hết bánh.' },
      ],
    },

    { t: 'h', text: 'F. Động từ & phó từ (6 từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'あります［ある］', pos: 'động từ nhóm 1', ipa: 'arimasu [aru]', vi: 'có (Bài 6: có hẹn, có việc, có sự kiện, có vé; khác Bài 4: ở đâu có cái gì)', ex: '{今晩|こんばん}、{時間|じかん}がありますか。——はい、あります。', exRo: 'Konban, jikan ga arimasu ka. — Hai, arimasu.', exVi: 'Tối nay bạn có thời gian không? — Có.' },
        { w: '{遊|あそ}びます［{遊|あそ}ぶ］', pos: 'động từ nhóm 1', ipa: 'asobimasu [asobu]', vi: 'chơi, đi chơi (遊びに行きます = đi chơi)', ex: '{今度|こんど}、うちへ{遊|あそ}びに{来|き}ませんか。', exRo: 'Kondo, uchi e asobi ni kimasen ka.', exVi: 'Lần tới đến nhà mình chơi không?' },
        { w: '{一緒|いっしょ}に', pos: 'phó từ', ipa: 'issho ni', vi: 'cùng nhau, cùng với', ex: '{一緒|いっしょ}に{帰|かえ}りましょう。', exRo: 'Issho ni kaerimashou.', exVi: 'Cùng về đi.' },
        { w: 'ぜひ', pos: 'phó từ', ipa: 'zehi', vi: 'nhất định, rất (muốn) (đi với ～たいです)', ex: 'ぜひ{行|い}きたいです。', exRo: 'Zehi ikitai desu.', exVi: 'Tôi rất muốn đi.' },
        { w: 'まだ', pos: 'phó từ', ipa: 'mada', vi: 'chưa; vẫn (いいえ、まだです = chưa)', ex: 'もうお{台場|だいば}へ{行|い}きましたか。——いいえ、まだです。', exRo: 'Mou Odaiba e ikimashita ka. — Iie, mada desu.', exVi: 'Bạn đi Odaiba chưa? — Chưa.' },
        { w: 'もう', pos: 'phó từ', ipa: 'mou', vi: 'đã, rồi (もう～ましたか = đã … chưa?)', ex: 'もう{昼|ひる}ご{飯|はん}を{食|た}べましたか。——はい、{食|た}べました。', exRo: 'Mou hirugohan o tabemashita ka. — Hai, tabemashita.', exVi: 'Bạn ăn trưa chưa? — Rồi, tôi ăn rồi.' },
      ],
    },

    { t: 'h', text: 'G. Câu giao tiếp — rủ, nhận lời, từ chối, hẹn (8 mục)' },
    {
      t: 'vocab',
      items: [
        { w: 'いいですね', pos: 'câu nói', ipa: 'ii desu ne', vi: 'hay đấy, được đấy (nhận lời rủ)', ex: 'A：{一緒|いっしょ}に{映画|えいが}を{見|み}に{行|い}きませんか。B：いいですね。{行|い}きましょう。', exRo: 'A: Issho ni eiga o mi ni ikimasen ka. B: Ii desu ne. Ikimashou.', exVi: 'A: Đi xem phim cùng mình không? B: Hay đấy. Đi thôi. (câu mẫu của cô)' },
        { w: 'ああ', pos: 'thán từ', ipa: 'aa', vi: 'à, ồ (mở đầu câu, nhất là trước khi từ chối)', ex: 'ああ、{日曜日|にちようび}はちょっと……。', exRo: 'Aa, nichiyoubi wa chotto…….', exVi: 'À, Chủ Nhật thì hơi… (câu mẫu của cô — 日曜日 là CHỦ NHẬT, danh sách ghi "thứ 7" là nhầm)' },
        { w: 'すみません', pos: 'câu nói', ipa: 'sumimasen', vi: 'xin lỗi (khi từ chối lời rủ)', ex: 'A：{今晩|こんばん}{一緒|いっしょ}にご{飯|はん}を{食|た}べませんか。B：すみません。{今晩|こんばん}はちょっと……。', exRo: 'A: Konban issho ni gohan o tabemasen ka. B: Sumimasen. Konban wa chotto…….', exVi: 'A: Tối nay đi ăn cùng mình không? B: Xin lỗi. Tối nay thì không được rồi. (câu mẫu của cô)' },
        { w: 'また{今度|こんど}', pos: 'câu nói', ipa: 'mata kondo', vi: 'hẹn lần sau (khi lời rủ không thành)', ex: '{残念|ざんねん}です。じゃ、また{今度|こんど}。', exRo: 'Zannen desu. Ja, mata kondo.', exVi: 'Tiếc quá. Vậy hẹn lần sau.' },
        { w: 'わあ', pos: 'thán từ', ipa: 'waa', vi: 'oa (ngạc nhiên, vui mừng)', ex: 'わあ、いいですね。', exRo: 'Waa, ii desu ne.', exVi: 'Oa, hay quá!' },
        { w: 'そうですねえ', pos: 'câu nói', ipa: 'sou desu nee', vi: 'để xem nào…, ừ thì… (ngập ngừng khi đang nghĩ câu trả lời; kéo dài ねえ)', ex: 'そうですねえ……。{焼|や}き{肉|にく}のほうがいいです。', exRo: 'Sou desu nee……. Yakiniku no hou ga ii desu.', exVi: 'Để xem nào… Thịt nướng hơn.' },
        { w: 'そうしましょう', pos: 'câu nói', ipa: 'sou shimashou', vi: 'làm như thế đi, cứ vậy nhé (đồng ý với đề xuất)', ex: '{新宿|しんじゅく}の{居酒屋|いざかや}はどうですか。——いいですね。そうしましょう。', exRo: 'Shinjuku no izakaya wa dou desu ka. — Ii desu ne. Sou shimashou.', exVi: 'Quán nhậu ở Shinjuku thì sao? — Hay đấy. Cứ vậy đi.' },
        { w: 'わかりました', pos: 'câu nói', ipa: 'wakarimashita', vi: 'tôi hiểu rồi, được rồi (chấp nhận thông tin, lời hẹn)', ex: '{5時|ごじ}ですね。わかりました。', exRo: 'Goji desu ne. Wakarimashita.', exVi: '5 giờ nhé. Mình hiểu rồi.' },
      ],
    },

    { t: 'h', text: '8 câu mẫu trong danh sách của cô (mục 18–20, 24–25, 27, 29–30)' },
    {
      t: 'examples',
      items: [
        { en: '{今晩|こんばん}、{用事|ようじ}があります。', ro: 'Konban, youji ga arimasu.', vi: 'Tối nay tôi có việc bận. — ポイント 50' },
        { en: '{横浜|よこはま}で{野球|やきゅう}の{試合|しあい}があります。', ro: 'Yokohama de yakyuu no shiai ga arimasu.', vi: 'Ở Yokohama có trận bóng chày. — ポイント 51' },
        { en: 'チケットが{2枚|にまい}あります。', ro: 'Chiketto ga nimai arimasu.', vi: 'Tôi có 2 vé. — ポイント 52' },
        { en: 'A：{一緒|いっしょ}に{映画|えいが}を{見|み}に{行|い}きませんか。', ro: 'A: Issho ni eiga o mi ni ikimasen ka.', vi: 'Đi xem phim với tôi không? — ポイント 48' },
        { en: 'B：いいですね。{行|い}きましょう。', ro: 'B: Ii desu ne. Ikimashou.', vi: 'Hay đấy. Chúng ta cùng đi! — ポイント 49' },
        { en: 'ああ、{日曜日|にちようび}はちょっと……。', ro: 'Aa, nichiyoubi wa chotto…….', vi: 'À, Chủ Nhật thì không được. (danh sách ghi "thứ 7" — nhầm: 日曜日 = Chủ Nhật, {土曜日|どようび} mới là thứ Bảy)' },
        { en: 'A：{今晩|こんばん}{一緒|いっしょ}にご{飯|はん}を{食|た}べませんか。', ro: 'A: Konban issho ni gohan o tabemasen ka.', vi: 'Tối nay đi ăn với tôi không?' },
        { en: 'B：すみません。{今晩|こんばん}はちょっと……。', ro: 'B: Sumimasen. Konban wa chotto…….', vi: 'Xin lỗi, tối nay thì không được rồi.' },
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp trong từ bài 6',
      items: [
        '**{近|ちか}い／{遠|とお}い** là tính từ đuôi い: 「{駅|えき}は{近|ちか}いです」「{駅|えき}は{遠|とお}くないです」 (phủ định い→くない, Bài 4). Sang Bài 7 sẽ gặp {近|ちか}く (danh từ "chỗ gần") — khác từ loại.',
        '**{早|はや}い** = sớm / nhanh về THỜI GIAN. "Nhanh" về tốc độ viết {速|はや}い (cùng âm) — trong bài chỉ dùng {早|はや}い.',
        '**もう** (đã) ↔ **まだ** (chưa). Câu trả lời "chưa" là **いいえ、まだです**, không phải ~~いいえ、まだ{食|た}べませんでした~~.',
        '**～{枚|まい}** chỉ dùng cho đồ mỏng phẳng. Vé, áo phông, tờ giấy: {枚|まい}. Quả táo, cái bánh: ～つ (Bài 2).',
        '**{残念|ざんねん}です** là người RỦ nói khi bị từ chối — người từ chối không nói câu này về mình.',
      ],
    },

    { t: 'h', text: 'Từ thêm (sách có, danh sách của cô không có — chỉ cần nghe hiểu)' },
    {
      t: 'table',
      head: ['Từ / câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['{誘|さそ}います', 'sasoimasu', 'Rủ, mời (tên hoạt động của bài)'],
        ['{楽|たの}しみです', 'tanoshimi desu', 'Mong chờ lắm (chuyện sắp tới)'],
        ['よかった', 'yokatta', 'Tốt quá, may quá (khi bạn nhận lời)'],
        ['（お）{店|みせ}', '(o)mise', 'Cửa hàng, quán'],
        ['{皆|みな}さん', 'minasan', 'Các bạn, mọi người'],
        ['ソース', 'soosu', 'Nước sốt'],
        ['ピザ', 'piza', 'Bánh pizza (Bài 7)'],
        ['{花火|はなび}{大会|たいかい}', 'hanabi taikai', 'Lễ hội pháo hoa'],
        ['{飲|の}み{放題|ほうだい}', 'nomihoudai', 'Uống thoả thích'],
        ['{時間|じかん}がありますか', 'jikan ga arimasu ka', 'Bạn có rảnh (có thời gian) không?'],
        ['いいですよ', 'ii desu yo', 'Được chứ, OK (đồng ý đề xuất)'],
        ['へえ', 'hee', 'Ồ, thế à (ngạc nhiên, thích thú)'],
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b6-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp — ポイント 48–60: rủ, so sánh, hẹn',
  goal: 'Rủ – nhận lời – từ chối khéo đúng mẫu, nói "có hẹn / có sự kiện / có 2 vé", so sánh nhất – hơn – chọn 1 trong 2, hỏi "đã … chưa", đề xuất và xác nhận cuộc hẹn.',
  minutes: 75,
  blocks: [
    {
      t: 'p',
      text: 'Bài 6 có **13 điểm ngữ pháp** (ポイント 48–60), chia làm ba cụm đúng theo ba tình huống của bài: **rủ** (48–52), **so sánh để chọn** (53–56), **hẹn** (57–60). Gần như không có hình thái động từ mới: chỉ cần đổi đuôi **～ます** thành **～ませんか / ～ましょう** — đuôi ます bạn đã thuộc từ Bài 3.',
    },
    {
      t: 'table',
      caption: 'Bản đồ 13 điểm ngữ pháp',
      head: ['ポイント', 'Mẫu', 'Nghĩa', 'Ví dụ ngắn'],
      rows: [
        ['48', 'Vませんか', 'Rủ: "… không?"', '{一緒|いっしょ}に{行|い}きませんか。'],
        ['49', 'Vましょう', 'Nhận lời / đề xuất: "… thôi, … nhé"', '{行|い}きましょう。'],
        ['50', 'N があります', 'Có (hẹn, việc, bài thi, thời gian…)', '{約束|やくそく}があります。'],
        ['51', 'N1(nơi) で N2 があります', 'Ở N1 có (diễn ra) sự kiện N2', '{横浜|よこはま}で{試合|しあい}があります。'],
        ['52', 'N が (～{枚|まい}・～つ) あります', 'Có bao nhiêu cái N', 'チケットが{2枚|にまい}あります。'],
        ['53', 'N1 で N2 が いちばん A です', 'Trong N1, N2 là A nhất', 'スポーツで{野球|やきゅう}がいちばんおもしろいです。'],
        ['54', 'N1 は N2 より A です', 'N1 A hơn N2', 'ベトナムは{日本|にほん}より{暑|あつ}いです。'],
        ['55', 'N1 と N2 と どちらが A ですか', 'N1 và N2, cái nào A hơn?', '{夏|なつ}と{冬|ふゆ}とどちらが{好|す}きですか。'],
        ['56', 'N の ほうが (A) です', 'N (thì) A hơn', '{夏|なつ}のほうが{好|す}きです。'],
        ['57', 'もう Vましたか → はい、Vました／いいえ、まだです', 'Đã … chưa? → Rồi / Chưa', 'もう{食|た}べましたか。'],
        ['58', 'N は どうですか', 'Đề xuất: "N thì sao?"', '{5時|ごじ}はどうですか。'],
        ['59', '___ね', 'Nhắc lại để xác nhận', '{5時|ごじ}ですね。'],
        ['60', '___よ', 'Báo cho người nghe điều họ chưa biết', 'おいしいですよ。'],
      ],
    },

    /* ── ポイント 48 ── */
    { t: 'h', text: 'ポイント 48 — V ませんか (Rủ: "… không?")' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（{一緒|いっしょ}に）N を V ませんか。',
          vi: 'Cùng làm V không? — lấy thể ます, đổi **ます → ませんか**. Thêm {一緒|いっしょ}に (cùng nhau) để rõ là lời rủ.',
          examples: [
            { en: '{一緒|いっしょ}にご{飯|はん}を{食|た}べませんか。', ro: 'Issho ni gohan o tabemasen ka.', vi: 'Cùng ăn cơm không?' },
            { en: '{今晩|こんばん}、{一緒|いっしょ}に{映画|えいが}を{見|み}ませんか。', ro: 'Konban, issho ni eiga o mimasen ka.', vi: 'Tối nay cùng xem phim không?' },
            { en: '{週末|しゅうまつ}、{一緒|いっしょ}にテニスをしませんか。', ro: 'Shuumatsu, issho ni tenisu o shimasen ka.', vi: 'Cuối tuần cùng chơi tennis không?' },
          ],
        },
        {
          formula: 'N1（nơi）へ V(bỏ ます) に {行|い}きませんか。',
          vi: 'Rủ ĐI đâu đó ĐỂ làm gì — ghép với ポイント 42 (Bài 5): V bỏ ます + に + {行|い}きます.',
          examples: [
            { en: '{一緒|いっしょ}に{映画|えいが}を{見|み}に{行|い}きませんか。', ro: 'Issho ni eiga o mi ni ikimasen ka.', vi: 'Cùng đi xem phim không?' },
            { en: '{新宿|しんじゅく}へ{飲|の}みに{行|い}きませんか。', ro: 'Shinjuku e nomi ni ikimasen ka.', vi: 'Đi Shinjuku uống (nhậu) không?' },
            { en: '{今度|こんど}、{一緒|いっしょ}に{遊|あそ}びに{行|い}きませんか。', ro: 'Kondo, issho ni asobi ni ikimasen ka.', vi: 'Lần tới cùng đi chơi không?' },
          ],
        },
        {
          formula: 'N1（nơi）へ N2（việc）に {行|い}きませんか。',
          vi: 'Danh từ chỉ hoạt động (カラオケ, {買|か}い{物|もの}, ドライブ, {食事|しょくじ}, {旅行|りょこう}) đứng thẳng trước に.',
          examples: [
            { en: '{今晩|こんばん}、カラオケに{行|い}きませんか。', ro: 'Konban, karaoke ni ikimasen ka.', vi: 'Tối nay đi karaoke không?' },
            { en: '{渋谷|しぶや}へ{買|か}い{物|もの}に{行|い}きませんか。', ro: 'Shibuya e kaimono ni ikimasen ka.', vi: 'Đi Shibuya mua sắm không?' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Đổi đuôi: ～ます → ～ませんか (động từ đã học)',
      head: ['Thể ます', '→ Rủ (ませんか)', 'Romaji', 'Nghĩa'],
      rows: [
        ['{行|い}きます', '{行|い}きませんか', 'ikimasen ka', 'đi không?'],
        ['{食|た}べます', '{食|た}べませんか', 'tabemasen ka', 'ăn không?'],
        ['{飲|の}みます', '{飲|の}みませんか', 'nomimasen ka', 'uống không?'],
        ['{見|み}ます', '{見|み}ませんか', 'mimasen ka', 'xem không?'],
        ['します', 'しませんか', 'shimasen ka', 'làm / chơi không?'],
        ['{遊|あそ}びます', '{遊|あそ}びませんか', 'asobimasen ka', 'chơi không?'],
        ['{帰|かえ}ります', '{帰|かえ}りませんか', 'kaerimasen ka', 'về không?'],
        ['{来|き}ます', '{来|き}ませんか', 'kimasen ka', '(đến chỗ tôi) không?'],
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp — ませんか KHÔNG phải câu phủ định',
      items: [
        'Hình thức giống phủ định (ません + か) nhưng nghĩa là **lời rủ lịch sự**. Đừng dịch ~~"Bạn không đi à?"~~ mà là **"Đi (cùng tôi) không?"**.',
        '**{行|い}きますか** = hỏi thông tin "Bạn có đi không?" (người nói có thể không đi). **{行|い}きませんか** = mời "Đi cùng tôi không?". Muốn rủ thì dùng ませんか.',
        'Trả lời lời rủ **không** dùng ~~はい、{行|い}きます~~／~~いいえ、{行|い}きません~~ — nghe như trả lời câu hỏi khô khan, câu phủ định còn rất phũ. Dùng mẫu nhận lời / từ chối ở dưới.',
        'Quên に trước {行|い}きます: ~~{映画|えいが}を{見|み}{行|い}きませんか~~ → {映画|えいが}を{見|み}**に**{行|い}きませんか.',
      ],
    },

    /* ── ポイント 49 ── */
    { t: 'h', text: 'ポイント 49 — V ましょう ("… thôi", "… nhé")' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'いいですね。V ましょう。',
          vi: 'Dùng 1 — **nhận lời** rủ: lặp lại động từ của người rủ, đổi ませんか → **ましょう**.',
          examples: [
            { en: 'A：{一緒|いっしょ}に{飲|の}みに{行|い}きませんか。B：いいですね。{行|い}きましょう。', ro: 'A: Issho ni nomi ni ikimasen ka. B: Ii desu ne. Ikimashou.', vi: 'A: Cùng đi uống không? B: Hay đấy. Đi thôi.' },
            { en: 'A：{一緒|いっしょ}に{食|た}べませんか。B：ええ、{食|た}べましょう。', ro: 'A: Issho ni tabemasen ka. B: Ee, tabemashou.', vi: 'A: Cùng ăn không? B: Ừ, ăn thôi.' },
          ],
        },
        {
          formula: '（{一緒|いっしょ}に）V ましょう。',
          vi: 'Dùng 2 — **đề xuất / chốt** việc cả hai cùng làm (khi biết chắc người kia đồng ý): "… nhé".',
          examples: [
            { en: '{5時|ごじ}に{会|あ}いましょう。', ro: 'Goji ni aimashou.', vi: 'Gặp nhau lúc 5 giờ nhé.' },
            { en: 'じゃ、さくら{映画館|えいがかん}へ{行|い}きましょう。', ro: 'Ja, Sakura eigakan e ikimashou.', vi: 'Vậy đi rạp Sakura nhé.' },
            { en: '{一緒|いっしょ}に{帰|かえ}りましょう。', ro: 'Issho ni kaerimashou.', vi: 'Cùng về thôi.' },
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Hiểu đúng ませんか ↔ ましょう',
      items: [
        '**ませんか** hỏi ý người kia (lịch sự, để người kia có đường từ chối). **ましょう** là "chốt" — dùng khi nhận lời, hoặc khi đã chắc người kia muốn.',
        'Rủ người mới quen / người trên: dùng **ませんか**. Rủ thẳng bằng ~~{行|い}きましょう~~ ngay câu đầu nghe hơi ép.',
        '**そうしましょう** = "làm vậy đi" — nhận lời một ĐỀ XUẤT (～はどうですか) mà không cần lặp lại động từ.',
      ],
    },

    /* ── Mẫu hội thoại rủ – nhận – từ chối ── */
    { t: 'h', text: 'Trọn bộ mẫu: rủ → nhận lời / từ chối khéo (dùng 48 + 49)' },
    {
      t: 'table',
      caption: 'Câu nói ở từng lượt',
      head: ['Lượt', 'Câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['① Hỏi có rảnh không (tuỳ chọn)', '{今度|こんど}の{土曜日|どようび}、{時間|じかん}がありますか。', 'Kondo no doyoubi, jikan ga arimasu ka.', 'Thứ Bảy tới bạn có rảnh không?'],
        ['② Rủ', '{一緒|いっしょ}に N を V に{行|い}きませんか。', 'Issho ni N o V ni ikimasen ka.', 'Cùng đi V N không?'],
        ['③a Nhận lời', 'いいですね。{行|い}きましょう。／ええ、ぜひ。／わあ、ぜひ{行|い}きたいです。', 'Ii desu ne. Ikimashou. / Ee, zehi. / Waa, zehi ikitai desu.', 'Hay đấy, đi thôi. / Ừ, nhất định. / Oa, mình rất muốn đi.'],
        ['③b Từ chối khéo', 'ああ、～ですか。すみません。～はちょっと……。', 'Aa, ~ desu ka. Sumimasen. ~ wa chotto…….', 'À, ~ à. Xin lỗi. ~ thì hơi…'],
        ['④ Lý do (tuỳ chọn)', '{用事|ようじ}がありますから。／アルバイトがありますから。', 'Youji ga arimasu kara. / Arubaito ga arimasu kara.', 'Vì có việc bận. / Vì có ca làm thêm. (ポイント 47 + 50)'],
        ['⑤ Người rủ đáp lại', 'そうですか。{残念|ざんねん}です。じゃ、また{今度|こんど}。', 'Sou desu ka. Zannen desu. Ja, mata kondo.', 'Vậy à. Tiếc quá. Hẹn lần sau nhé.'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Mẫu 1 — nhận lời',
      lines: [
        { who: 'A', role: 'a', text: 'Bさん、{今週|こんしゅう}の{日曜日|にちようび}、{時間|じかん}がありますか。', ro: 'B-san, konshuu no nichiyoubi, jikan ga arimasu ka.', vi: 'B ơi, Chủ Nhật tuần này bạn rảnh không?' },
        { who: 'B', role: 'b', text: 'はい、ありますよ。', ro: 'Hai, arimasu yo.', vi: 'Có, mình rảnh.' },
        { who: 'A', role: 'a', text: '{一緒|いっしょ}に{富士山|ふじさん}へドライブに{行|い}きませんか。', ro: 'Issho ni Fujisan e doraibu ni ikimasen ka.', vi: 'Cùng lái xe đi núi Phú Sĩ không?' },
        { who: 'B', role: 'b', text: 'わあ、いいですね。{行|い}きましょう。', ro: 'Waa, ii desu ne. Ikimashou.', vi: 'Oa, hay quá. Đi thôi.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Mẫu 2 — từ chối khéo',
      lines: [
        { who: 'A', role: 'a', text: 'Bさん、あさって、{一緒|いっしょ}にバーベキューをしませんか。', ro: 'B-san, asatte, issho ni baabekyuu o shimasen ka.', vi: 'B ơi, ngày kia cùng nướng BBQ không?' },
        { who: 'B', role: 'b', text: 'ああ、あさってですか。すみません。あさってはちょっと……。', ro: 'Aa, asatte desu ka. Sumimasen. Asatte wa chotto…….', vi: 'À, ngày kia à. Xin lỗi. Ngày kia thì hơi…' },
        { who: 'A', role: 'a', text: 'そうですか。', ro: 'Sou desu ka.', vi: 'Vậy à.' },
        { who: 'B', role: 'b', text: '{月曜日|げつようび}にテストがありますから。', ro: 'Getsuyoubi ni tesuto ga arimasu kara.', vi: 'Vì thứ Hai mình có bài thi.' },
        { who: 'A', role: 'a', text: 'ああ、そうですか。{残念|ざんねん}です。じゃ、また{今度|こんど}。', ro: 'Aa, sou desu ka. Zannen desu. Ja, mata kondo.', vi: 'À, vậy à. Tiếc quá. Vậy hẹn lần sau.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — tự tạo cuộc rủ mới',
      head: ['Khi nào', 'Rủ làm gì (～ませんか)', 'Nếu từ chối: lý do (～がありますから)'],
      rows: [
        ['{今晩|こんばん}', 'ご{飯|はん}を{食|た}べに{行|い}きませんか', '{用事|ようじ}がありますから'],
        ['{今週|こんしゅう}の{金曜日|きんようび}', '{映画|えいが}を{見|み}に{行|い}きませんか', 'アルバイトがありますから'],
        ['{来週|らいしゅう}の{日曜日|にちようび}', 'サッカーをしませんか', '{友達|ともだち}と{約束|やくそく}がありますから'],
        ['{夏休|なつやす}み', '{一緒|いっしょ}に{旅行|りょこう}に{行|い}きませんか', 'アルバイトがありますから'],
        ['{来月|らいげつ}の{15日|じゅうごにち}', 'ドライブに{行|い}きませんか', '{約束|やくそく}がありますから'],
        ['{週末|しゅうまつ}', '{買|か}い{物|もの}に{行|い}きませんか', '{用事|ようじ}がありますから'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc khi từ chối',
      items: [
        '~~いいえ、{行|い}きません~~ — đúng ngữ pháp nhưng rất thô. Luôn dùng **すみません。～はちょっと……** (bỏ lửng, hạ giọng ở ちょっと).',
        'ちょっと đứng sau **thời điểm hoặc việc** bị từ chối, có は: **{今晩|こんばん}は**ちょっと, **カラオケは**ちょっと.',
        'Lý do chỉ cần một câu ngắn với **～がありますから**. Không cần nói thật chi tiết — {用事|ようじ} (việc riêng) là lý do hoàn hảo.',
      ],
    },

    /* ── ポイント 50 ── */
    { t: 'h', text: 'ポイント 50 — N が あります (có hẹn, có việc, có sự kiện)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（thời điểm、）N が あります。',
          vi: 'Có N — N là **việc / kế hoạch / sự kiện** của mình: {約束|やくそく}, {用事|ようじ}, テスト, アルバイト, {試合|しあい}, {授業|じゅぎょう}, パーティー, {時間|じかん}.',
          examples: [
            { en: '{明日|あした}、{友達|ともだち}と{約束|やくそく}があります。', ro: 'Ashita, tomodachi to yakusoku ga arimasu.', vi: 'Ngày mai tôi có hẹn với bạn.' },
            { en: '{今晩|こんばん}、{用事|ようじ}があります。', ro: 'Konban, youji ga arimasu.', vi: 'Tối nay tôi có việc bận.' },
            { en: '{金曜日|きんようび}にテストがあります。', ro: 'Kinyoubi ni tesuto ga arimasu.', vi: 'Thứ Sáu có bài kiểm tra.' },
          ],
        },
        {
          formula: 'N が ありますか。 → はい、あります。／いいえ、ありません。',
          vi: 'Hỏi – đáp có/không.',
          examples: [
            { en: '{今晩|こんばん}、{時間|じかん}がありますか。', ro: 'Konban, jikan ga arimasu ka.', vi: 'Tối nay bạn có thời gian (rảnh) không?' },
            { en: 'はい、あります。／いいえ、ありません。', ro: 'Hai, arimasu. / Iie, arimasen.', vi: 'Có. / Không.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp',
      lines: [
        { who: 'A', role: 'a', text: '{明日|あした}、アルバイトがありますか。', ro: 'Ashita, arubaito ga arimasu ka.', vi: 'Mai bạn có ca làm thêm không?' },
        { who: 'B', role: 'b', text: 'いいえ、ありません。', ro: 'Iie, arimasen.', vi: 'Không có.' },
        { who: 'A', role: 'a', text: 'じゃ、{時間|じかん}がありますか。', ro: 'Ja, jikan ga arimasu ka.', vi: 'Thế bạn có rảnh không?' },
        { who: 'B', role: 'b', text: 'はい、ありますよ。', ro: 'Hai, arimasu yo.', vi: 'Có, rảnh đấy.' },
        { who: 'A', role: 'a', text: 'あさっては？', ro: 'Asatte wa?', vi: 'Còn ngày kia?' },
        { who: 'B', role: 'b', text: 'あさっては{約束|やくそく}があります。', ro: 'Asatte wa yakusoku ga arimasu.', vi: 'Ngày kia mình có hẹn.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế',
      head: ['Khi nào', 'N', 'が あります。'],
      rows: [
        ['{今晩|こんばん} · {明日|あした} · {週末|しゅうまつ}', '{約束|やくそく} · {用事|ようじ}', 'が あります。'],
        ['{月曜日|げつようび}に · {来週|らいしゅう}', 'テスト · {日本語|にほんご}の{授業|じゅぎょう}', 'が あります。'],
        ['{土曜日|どようび}に · {今月|こんげつ}の{20日|はつか}に', 'パーティー · {試合|しあい}', 'が あります。'],
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp — trợ từ が và あります／います',
      items: [
        'Luôn là **が** あります: ~~{約束|やくそく}を あります~~, ~~{用事|ようじ}は あります~~ (は chỉ dùng khi so sánh/đối lập: {今日|きょう}は{約束|やくそく}がありません。{明日|あした}はあります).',
        'Bài 4 bạn đã học {場所|ばしょ}**に** N があります (ở đâu có cái gì). Bài 6 mở rộng: あります còn nghĩa là "có (việc, kế hoạch)".',
        'Người, con vật dùng **います** (Bài 7): {友達|ともだち}が{来|き}ます chứ không nói ~~{友達|ともだち}があります~~.',
      ],
    },

    /* ── ポイント 51 ── */
    { t: 'h', text: 'ポイント 51 — N1（nơi）で N2 が あります (sự kiện diễn ra ở đâu)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1（nơi）で N2（sự kiện）が あります。',
          vi: 'Ở N1 có (tổ chức) N2. Sự kiện là việc **xảy ra** → nơi chốn đi với **で** (như ポイント 20: nơi làm việc gì).',
          examples: [
            { en: '{今晩|こんばん}、{横浜|よこはま}でサッカーの{試合|しあい}があります。', ro: 'Konban, Yokohama de sakkaa no shiai ga arimasu.', vi: 'Tối nay ở Yokohama có trận bóng đá.' },
            { en: '{上野|うえの}でジャズのコンサートがあります。', ro: 'Ueno de jazu no konsaato ga arimasu.', vi: 'Ở Ueno có buổi hoà nhạc jazz.' },
            { en: 'デパートで{夏|なつ}のセールがあります。', ro: 'Depaato de natsu no seeru ga arimasu.', vi: 'Ở trung tâm thương mại có đợt giảm giá mùa hè.' },
          ],
        },
        {
          formula: 'どこで N2 が ありますか。／いつ N2 が ありますか。',
          vi: 'Hỏi nơi / thời điểm của sự kiện.',
          examples: [
            { en: 'どこで{花火|はなび}{大会|たいかい}がありますか。——{横浜|よこはま}であります。', ro: 'Doko de hanabi taikai ga arimasu ka. — Yokohama de arimasu.', vi: 'Lễ hội pháo hoa tổ chức ở đâu? — Ở Yokohama.' },
            { en: 'いつコンサートがありますか。——{来週|らいしゅう}の{金曜日|きんようび}にあります。', ro: 'Itsu konsaato ga arimasu ka. — Raishuu no kinyoubi ni arimasu.', vi: 'Khi nào có buổi hoà nhạc? — Thứ Sáu tuần sau.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'で hay に? — cùng động từ あります, hai trợ từ khác nhau',
      head: ['Mẫu', 'Câu', 'N là gì'],
      rows: [
        ['Bài 4 — {場所|ばしょ} **に** N があります', '{公園|こうえん}**に**{桜|さくら}があります。 (Kouen ni sakura ga arimasu.)', 'VẬT tồn tại, nằm yên ở đó (cây, toà nhà, quán)'],
        ['Bài 6 — {場所|ばしょ} **で** N があります', '{公園|こうえん}**で**お{花見|はなみ}があります。 (Kouen de ohanami ga arimasu.)', 'SỰ KIỆN diễn ra ở đó (buổi ngắm hoa, trận đấu, tiệc)'],
        ['Bài 4', '{新宿|しんじゅく}**に**{居酒屋|いざかや}があります。', 'Quán nhậu = nơi chốn/vật'],
        ['Bài 6', '{居酒屋|いざかや}**で**パーティーがあります。', 'Bữa tiệc = sự kiện'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp trước bảng thông báo',
      lines: [
        { who: 'A', role: 'a', text: 'あ、{花火|はなび}{大会|たいかい}がありますよ。', ro: 'A, hanabi taikai ga arimasu yo.', vi: 'A, có lễ hội pháo hoa đấy.' },
        { who: 'B', role: 'b', text: 'どこでありますか。', ro: 'Doko de arimasu ka.', vi: 'Tổ chức ở đâu?' },
        { who: 'A', role: 'a', text: '{箱根|はこね}であります。', ro: 'Hakone de arimasu.', vi: 'Ở Hakone.' },
        { who: 'B', role: 'b', text: 'いつですか。', ro: 'Itsu desu ka.', vi: 'Khi nào?' },
        { who: 'A', role: 'a', text: '{7月|しちがつ}{24日|にじゅうよっか}です。{7時|しちじ}からです。{一緒|いっしょ}に{見|み}に{行|い}きませんか。', ro: 'Shichigatsu nijuuyokka desu. Shichiji kara desu. Issho ni mi ni ikimasen ka.', vi: 'Ngày 24 tháng 7. Từ 7 giờ. Cùng đi xem không?' },
        { who: 'B', role: 'b', text: 'いいですね。{行|い}きましょう。', ro: 'Ii desu ne. Ikimashou.', vi: 'Hay đấy. Đi thôi.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế',
      head: ['N1（nơi）で', 'N2（sự kiện）が', 'あります。'],
      rows: [
        ['{横浜|よこはま}で · {東京|とうきょう}ドームで', '{野球|やきゅう}の{試合|しあい} · サッカーの{試合|しあい}', 'が あります。'],
        ['{上野|うえの}で · {学校|がっこう}で', 'ジャズのコンサート · ピアノのコンサート', 'が あります。'],
        ['{浅草|あさくさ}で · {箱根|はこね}で', 'お{祭|まつ}り · {花火|はなび}{大会|たいかい}', 'が あります。'],
        ['デパートで · ショッピングビルで', 'セール · {夏|なつ}のセール', 'が あります。'],
      ],
    },

    /* ── ポイント 52 ── */
    { t: 'h', text: 'ポイント 52 — N が（～{枚|まい}・～つ…）あります (có bao nhiêu)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N が + số lượng + あります。',
          vi: 'Số lượng (có từ đếm) đứng **sau が, ngay trước động từ** — giống ポイント 10: N を ～つ ください.',
          examples: [
            { en: '{映画|えいが}のチケットが{2枚|にまい}あります。', ro: 'Eiga no chiketto ga nimai arimasu.', vi: 'Tôi có 2 vé xem phim.' },
            { en: 'ケーキが{3|みっ}つあります。{一緒|いっしょ}に{食|た}べませんか。', ro: 'Keeki ga mittsu arimasu. Issho ni tabemasen ka.', vi: 'Có 3 cái bánh. Cùng ăn không?' },
            { en: '{東京|とうきょう}の{地図|ちず}が{1枚|いちまい}あります。', ro: 'Toukyou no chizu ga ichimai arimasu.', vi: 'Có 1 tấm bản đồ Tokyo.' },
          ],
        },
        {
          formula: 'N が {何枚|なんまい}／いくつ ありますか。',
          vi: 'Hỏi số lượng: đồ mỏng phẳng → {何枚|なんまい}; đồ nói chung → いくつ.',
          examples: [
            { en: 'チケットが{何枚|なんまい}ありますか。——{4枚|よんまい}あります。', ro: 'Chiketto ga nanmai arimasu ka. — Yonmai arimasu.', vi: 'Có mấy vé? — Có 4 vé.' },
            { en: 'りんごがいくつありますか。——{5|いつ}つあります。', ro: 'Ringo ga ikutsu arimasu ka. — Itsutsu arimasu.', vi: 'Có mấy quả táo? — Có 5 quả.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Đếm ～{枚|まい} (表 p.287) — đều, không biến âm (dễ hơn ～つ và ～{階|かい})',
      head: ['Số', '～{枚|まい}', 'Romaji', 'So với ～つ'],
      rows: [
        ['1', 'いちまい', 'ichimai', 'ひとつ'],
        ['2', 'にまい', 'nimai', 'ふたつ'],
        ['3', 'さんまい', 'sanmai', 'みっつ'],
        ['4', '**よんまい**', 'yonmai', 'よっつ'],
        ['5', 'ごまい', 'gomai', 'いつつ'],
        ['6', 'ろくまい', 'rokumai', 'むっつ'],
        ['7', '**ななまい**', 'nanamai', 'ななつ'],
        ['8', 'はちまい', 'hachimai', 'やっつ'],
        ['9', '**きゅうまい**', 'kyuumai', 'ここのつ'],
        ['10', 'じゅうまい', 'juumai', 'とお'],
        ['？', '**なんまい**', 'nanmai', 'いくつ'],
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp với ～枚',
      items: [
        'Quên từ đếm: ~~チケットが2あります~~ → チケットが**{2枚|にまい}**あります.',
        'Đọc 4, 7, 9: **よん**まい, **なな**まい, **きゅう**まい — không đọc ~~しまい~~, ~~しちまい~~, ~~くまい~~.',
        '{枚|まい} chỉ cho đồ **mỏng, phẳng**: vé, tờ giấy, áo phông, đĩa CD, bản đồ, ảnh. Đồ khối (bánh, táo, cốc): ～つ.',
        'Vị trí: tiếng Việt "có **2** vé", tiếng Nhật "vé が **2 tấm** có" — số lượng đứng ngay trước あります.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: có vé thì rủ',
      lines: [
        { who: 'A', role: 'a', text: 'Bさんはサッカーが{好|す}きですか。', ro: 'B-san wa sakkaa ga suki desu ka.', vi: 'B có thích bóng đá không?' },
        { who: 'B', role: 'b', text: 'はい、とても{好|す}きです。', ro: 'Hai, totemo suki desu.', vi: 'Có, rất thích.' },
        { who: 'A', role: 'a', text: 'そうですか。サッカーのチケットが{2枚|にまい}あります。{一緒|いっしょ}に{見|み}に{行|い}きませんか。', ro: 'Sou desu ka. Sakkaa no chiketto ga nimai arimasu. Issho ni mi ni ikimasen ka.', vi: 'Vậy à. Mình có 2 vé bóng đá. Cùng đi xem không?' },
        { who: 'B', role: 'b', text: 'わあ、いいですね。{行|い}きましょう。', ro: 'Waa, ii desu ne. Ikimashou.', vi: 'Oa, hay quá. Đi thôi.' },
      ],
    },

    /* ── ポイント 53 ── */
    { t: 'h', text: 'ポイント 53 — N1 で N2 が いちばん A です (nhất)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1（phạm vi）で {何|なに}／どこ／{誰|だれ}／いつ が いちばん A ですか。',
          vi: 'Trong phạm vi N1, cái gì / ở đâu / ai / khi nào là A nhất? — phạm vi đi với **で**, từ để hỏi đi với **が**.',
          examples: [
            { en: 'スポーツで{何|なに}がいちばんおもしろいですか。', ro: 'Supootsu de nani ga ichiban omoshiroi desu ka.', vi: 'Trong các môn thể thao, môn nào hay nhất?' },
            { en: '{東京|とうきょう}でどこがいちばんにぎやかですか。', ro: 'Toukyou de doko ga ichiban nigiyaka desu ka.', vi: 'Ở Tokyo chỗ nào náo nhiệt nhất?' },
            { en: 'クラスで{誰|だれ}がいちばん{早|はや}いですか。', ro: 'Kurasu de dare ga ichiban hayai desu ka.', vi: 'Trong lớp ai (đến) sớm nhất?' },
            { en: '{1年|いちねん}でいつがいちばん{暑|あつ}いですか。', ro: 'Ichinen de itsu ga ichiban atsui desu ka.', vi: 'Trong một năm, lúc nào nóng nhất?' },
          ],
        },
        {
          formula: 'N2 が いちばん A です。',
          vi: 'Trả lời: thay từ để hỏi bằng đáp án, **giữ が**.',
          examples: [
            { en: '{野球|やきゅう}がいちばんおもしろいです。', ro: 'Yakyuu ga ichiban omoshiroi desu.', vi: 'Bóng chày hay nhất.' },
            { en: '{新宿|しんじゅく}がいちばんにぎやかです。', ro: 'Shinjuku ga ichiban nigiyaka desu.', vi: 'Shinjuku náo nhiệt nhất.' },
            { en: '{8月|はちがつ}がいちばん{暑|あつ}いです。', ro: 'Hachigatsu ga ichiban atsui desu.', vi: 'Tháng 8 nóng nhất.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp (dạng câu thi nói hay gặp)',
      lines: [
        { who: 'A', role: 'a', text: '{日本|にほん}の{食|た}べ{物|もの}で{何|なに}がいちばん{好|す}きですか。', ro: 'Nihon no tabemono de nani ga ichiban suki desu ka.', vi: 'Trong đồ ăn Nhật bạn thích gì nhất?' },
        { who: 'B', role: 'b', text: 'ラーメンがいちばん{好|す}きです。', ro: 'Raamen ga ichiban suki desu.', vi: 'Tôi thích ramen nhất.' },
        { who: 'A', role: 'a', text: 'ベトナム{料理|りょうり}で{何|なに}がいちばんおいしいですか。', ro: 'Betonamu ryouri de nani ga ichiban oishii desu ka.', vi: 'Trong các món Việt, món nào ngon nhất?' },
        { who: 'B', role: 'b', text: 'フォーがいちばんおいしいです。', ro: 'Foo ga ichiban oishii desu.', vi: 'Phở ngon nhất.' },
        { who: 'A', role: 'a', text: '{季節|きせつ}でいつがいちばん{好|す}きですか。', ro: 'Kisetsu de itsu ga ichiban suki desu ka.', vi: 'Trong các mùa bạn thích mùa nào nhất?' },
        { who: 'B', role: 'b', text: '{春|はる}がいちばん{好|す}きです。', ro: 'Haru ga ichiban suki desu.', vi: 'Tôi thích mùa xuân nhất.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế',
      head: ['N1 で', 'từ để hỏi が いちばん', 'A ですか。'],
      rows: [
        ['{映画|えいが}で · {音楽|おんがく}で · スポーツで', '{何|なに}が いちばん', '{好|す}きですか · おもしろいですか'],
        ['{東京|とうきょう}で · ベトナムで', 'どこが いちばん', 'きれいですか · にぎやかですか · {有名|ゆうめい}ですか'],
        ['{歌手|かしゅ}で · クラスで', '{誰|だれ}が いちばん', '{好|す}きですか · {早|はや}いですか'],
        ['{季節|きせつ}で · {1年|いちねん}で', 'いつが いちばん', '{好|す}きですか · {暑|あつ}いですか · {寒|さむ}いですか'],
        ['{新宿|しんじゅく}の{居酒屋|いざかや}で', 'どこが いちばん', '{安|やす}いですか'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với いちばん',
      items: [
        'Từ để hỏi **không bao giờ đi với は**: ~~{何|なに}はいちばん{好|す}きですか~~ → {何|なに}**が**いちばん{好|す}きですか. Trả lời cũng giữ が: ラーメン**が**いちばん{好|す}きです.',
        'Phạm vi đi với **で** (trong số…): ~~スポーツは{何|なに}が～~~ nghe được nhưng mẫu chuẩn của bài là スポーツ**で**.',
        'Chọn đúng từ để hỏi: đồ vật/môn → {何|なに}; nơi → どこ; người → {誰|だれ}; mùa, tháng → いつ (hoặc {何|なに}). Nghe câu hỏi có từ nào thì trả lời đúng loại đó.',
      ],
    },

    /* ── ポイント 54 ── */
    { t: 'h', text: 'ポイント 54 — N1 は N2 より A です (hơn)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1 は N2 より A です。',
          vi: 'N1 A hơn N2. **より** gắn vào vật bị đem ra so sánh (vật "kém" hơn). Tính từ **giữ nguyên**, không thêm từ "hơn".',
          examples: [
            { en: '{新宿|しんじゅく}は{渋谷|しぶや}より{近|ちか}いです。', ro: 'Shinjuku wa Shibuya yori chikai desu.', vi: 'Shinjuku gần hơn Shibuya.' },
            { en: 'ベトナムは{日本|にほん}より{暑|あつ}いです。', ro: 'Betonamu wa Nihon yori atsui desu.', vi: 'Việt Nam nóng hơn Nhật.' },
            { en: '{7月|しちがつ}は{8月|はちがつ}より{雨|あめ}が{多|おお}いです。', ro: 'Shichigatsu wa hachigatsu yori ame ga ooi desu.', vi: 'Tháng 7 mưa nhiều hơn tháng 8.' },
            { en: '{地下鉄|ちかてつ}はバスより{早|はや}いです。', ro: 'Chikatetsu wa basu yori hayai desu.', vi: 'Tàu điện ngầm nhanh (đến sớm) hơn xe buýt.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Đọc từ phải sang trái cho dễ hiểu',
      head: ['Tiếng Việt', 'Tiếng Nhật', 'Ghi nhớ'],
      rows: [
        ['Hà Nội **lạnh hơn** Sài Gòn.', 'ハノイは ホーチミンより {寒|さむ}いです。', 'より đi sau **Sài Gòn** (cái bị so)'],
        ['Rạp A **rẻ hơn** rạp B.', 'A{映画館|えいがかん}は B{映画館|えいがかん}より {安|やす}いです。', 'Chủ đề (は) là cái "hơn"'],
        ['Công viên Midori **rộng hơn** công viên Sakura.', 'みどり{公園|こうえん}は さくら{公園|こうえん}より {広|ひろ}いです。', 'Tính từ không đổi dạng'],
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp — đặt より sai chỗ',
      items: [
        '~~{渋谷|しぶや}より{新宿|しんじゅく}は{近|ちか}いです~~ nghe rối. Giữ thứ tự **N1 は N2 より A**: {新宿|しんじゅく}は{渋谷|しぶや}より{近|ちか}いです.',
        'Đảo ngược nghĩa là lỗi nặng (đổi nghĩa cả câu): {新宿|しんじゅく}は{渋谷|しぶや}より{近|ちか}い = Shinjuku GẦN hơn; muốn nói Shibuya gần hơn thì {渋谷|しぶや}は{新宿|しんじゅく}より{近|ちか}い.',
        'Không thêm ~~もっと~~ hay ~~より{近|ちか}いです より~~ — một より là đủ.',
      ],
    },

    /* ── ポイント 55 ── */
    { t: 'h', text: 'ポイント 55 — N1 と N2 と どちらが A ですか (cái nào hơn?)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1 と N2 と どちらが A ですか。',
          vi: 'N1 và N2, cái nào A hơn? — chọn **1 trong 2** luôn dùng **どちら** (kể cả khi hỏi về người, nơi, thời gian), đi với **が**.',
          examples: [
            { en: '{夏|なつ}と{冬|ふゆ}とどちらが{好|す}きですか。', ro: 'Natsu to fuyu to dochira ga suki desu ka.', vi: 'Mùa hè và mùa đông, bạn thích mùa nào hơn?' },
            { en: 'ラーメンと{焼|や}き{肉|にく}とどちらがいいですか。', ro: 'Raamen to yakiniku to dochira ga ii desu ka.', vi: 'Ramen và thịt nướng, cái nào hơn? (bạn muốn cái nào?)' },
            { en: 'バスと{地下鉄|ちかてつ}とどちらが{早|はや}いですか。', ro: 'Basu to chikatetsu to dochira ga hayai desu ka.', vi: 'Xe buýt và tàu điện ngầm, cái nào nhanh hơn?' },
            { en: '{京都|きょうと}と{大阪|おおさか}とどちらが{遠|とお}いですか。', ro: 'Kyouto to Oosaka to dochira ga tooi desu ka.', vi: 'Kyoto và Osaka, chỗ nào xa hơn?' },
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với どちら',
      items: [
        'Đủ **hai と**: N1 **と** N2 **と** どちらが… Quên と thứ hai (~~{夏|なつ}と{冬|ふゆ}どちらが~~) là lỗi trợ từ −2 điểm khi thi.',
        '**どちらが**, không phải ~~どちらは~~ (từ để hỏi đi với が — giống ポイント 53).',
        'Đừng dùng ~~{何|なに}が~~ khi chỉ có 2 lựa chọn: có 2 → どちら; có 3 trở lên → {何|なに}／どこ／{誰|だれ}／いつ + いちばん.',
        'どちら ở Bài 1 (お{国|くに}はどちらですか) là **どこ lịch sự** — cùng chữ, khác nghĩa. Có "N1 と N2 と" đứng trước thì là "cái nào hơn".',
      ],
    },

    /* ── ポイント 56 ── */
    { t: 'h', text: 'ポイント 56 — N の ほうが（A）です (N hơn)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N の ほうが A です。',
          vi: 'Trả lời câu どちら: cái được chọn + **のほうが** + tính từ của câu hỏi. ほう = "phía, bên".',
          examples: [
            { en: '{夏|なつ}のほうが{好|す}きです。', ro: 'Natsu no hou ga suki desu.', vi: 'Tôi thích mùa hè hơn.' },
            { en: '{地下鉄|ちかてつ}のほうが{早|はや}いです。', ro: 'Chikatetsu no hou ga hayai desu.', vi: 'Tàu điện ngầm nhanh hơn.' },
            { en: '{焼|や}き{肉|にく}のほうがいいです。', ro: 'Yakiniku no hou ga ii desu.', vi: 'Thịt nướng hơn (tôi chọn thịt nướng).' },
          ],
        },
        {
          formula: 'N1 の ほうが N2 より A です。',
          vi: 'Trả lời đầy đủ nhất: kết hợp 56 + 54.',
          examples: [
            { en: 'みどり{公園|こうえん}のほうがさくら{公園|こうえん}より{広|ひろ}いです。', ro: 'Midori kouen no hou ga Sakura kouen yori hiroi desu.', vi: 'Công viên Midori rộng hơn công viên Sakura.' },
          ],
        },
        {
          formula: 'どちらも A です。',
          vi: 'Cả hai như nhau: "cái nào cũng A".',
          examples: [
            { en: 'どちらも{好|す}きです。', ro: 'Dochira mo suki desu.', vi: 'Cái nào tôi cũng thích.' },
            { en: 'どちらもおいしいですよ。', ro: 'Dochira mo oishii desu yo.', vi: 'Món nào cũng ngon đấy.' },
          ],
        },
        {
          formula: 'N の ほうが A です。N2 は ～から。',
          vi: 'Thêm lý do bằng ～から (ポイント 47) — câu trả lời thi nói được điểm cao.',
          examples: [
            { en: '{新宿|しんじゅく}のほうがいいです。{新宿|しんじゅく}は{渋谷|しぶや}より{近|ちか}いですから。', ro: 'Shinjuku no hou ga ii desu. Shinjuku wa Shibuya yori chikai desu kara.', vi: 'Shinjuku hơn. Vì Shinjuku gần hơn Shibuya.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: chọn 1 trong 2',
      lines: [
        { who: 'A', role: 'a', text: 'コーヒーとお{茶|ちゃ}とどちらがいいですか。', ro: 'Koohii to ocha to dochira ga ii desu ka.', vi: 'Cà phê và trà, bạn dùng gì?' },
        { who: 'B', role: 'b', text: 'お{茶|ちゃ}のほうがいいです。', ro: 'Ocha no hou ga ii desu.', vi: 'Cho mình trà.' },
        { who: 'A', role: 'a', text: 'ベトナムと{日本|にほん}とどちらが{暑|あつ}いですか。', ro: 'Betonamu to Nihon to dochira ga atsui desu ka.', vi: 'Việt Nam và Nhật, bên nào nóng hơn?' },
        { who: 'B', role: 'b', text: 'ベトナムのほうが{暑|あつ}いです。', ro: 'Betonamu no hou ga atsui desu.', vi: 'Việt Nam nóng hơn.' },
        { who: 'A', role: 'a', text: 'ジャズとコメディー{映画|えいが}とどちらが{好|す}きですか。', ro: 'Jazu to komedii eiga to dochira ga suki desu ka.', vi: 'Nhạc jazz và phim hài, bạn thích cái nào hơn?' },
        { who: 'B', role: 'b', text: 'そうですねえ……。どちらも{好|す}きです。', ro: 'Sou desu nee……. Dochira mo suki desu.', vi: 'Để xem nào… Mình thích cả hai.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — hỏi どちら, đáp のほうが',
      head: ['N1 と N2 と', 'どちらが A ですか。', '→ Trả lời'],
      rows: [
        ['さくら{映画館|えいがかん}と みなと{映画館|えいがかん}と', 'どちらが{近|ちか}いですか。', 'さくら{映画館|えいがかん}のほうが{近|ちか}いです。'],
        ['A コースと B コースと', 'どちらが{安|やす}いですか。', 'B コースのほうが{安|やす}いです。'],
        ['みどり{公園|こうえん}と わかば{公園|こうえん}と', 'どちらが{広|ひろ}いですか。', 'みどり{公園|こうえん}のほうが{広|ひろ}いです。'],
        ['JRと {地下鉄|ちかてつ}と', 'どちらが{早|はや}いですか。', 'JRのほうが{早|はや}いです。'],
        ['すしと すき{焼|や}きと', 'どちらが{好|す}きですか。', 'どちらも{好|す}きです。'],
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp với ほうが',
      items: [
        'Đủ ba mảnh **の ほう が**: ~~{夏|なつ}ほうが~~, ~~{夏|なつ}のほうは~~ → {夏|なつ}**のほうが**.',
        'Câu trả lời lặp lại **đúng tính từ của câu hỏi**: hỏi {近|ちか}い → đáp {近|ちか}いです. Hỏi {近|ちか}い mà đáp ~~{安|やす}いです~~ là sai nội dung.',
        'Chỉ được dùng のほうが khi có **so sánh**. Câu thường không so sánh: {夏|なつ}が{好|す}きです (không có ほう).',
      ],
    },

    /* ── ポイント 57 ── */
    { t: 'h', text: 'ポイント 57 — もう V ましたか → はい、V ました／いいえ、まだです' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'もう V ましたか。',
          vi: '(Bạn) đã V chưa? — もう + thể quá khứ ～ました (Bài 5) + か.',
          examples: [
            { en: 'もうふじまるランドへ{行|い}きましたか。', ro: 'Mou Fujimaru rando e ikimashita ka.', vi: 'Bạn đã đi Fujimaru Land chưa?' },
            { en: 'もう{昼|ひる}ご{飯|はん}を{食|た}べましたか。', ro: 'Mou hirugohan o tabemashita ka.', vi: 'Bạn ăn trưa chưa?' },
            { en: 'もうその{映画|えいが}を{見|み}ましたか。', ro: 'Mou sono eiga o mimashita ka.', vi: 'Bạn xem bộ phim đó chưa?' },
          ],
        },
        {
          formula: 'はい、（もう）V ました。／いいえ、まだです。',
          vi: 'Rồi: はい + ～ました. Chưa: **いいえ、まだです** — ngắn gọn, KHÔNG chia động từ.',
          examples: [
            { en: 'はい、{行|い}きました。', ro: 'Hai, ikimashita.', vi: 'Rồi, tôi đi rồi.' },
            { en: 'いいえ、まだです。', ro: 'Iie, mada desu.', vi: 'Chưa.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp → dẫn tới lời rủ',
      lines: [
        { who: 'A', role: 'a', text: 'Bさんはもう{浅草|あさくさ}へ{行|い}きましたか。', ro: 'B-san wa mou Asakusa e ikimashita ka.', vi: 'B đã đi Asakusa chưa?' },
        { who: 'B', role: 'b', text: 'いいえ、まだです。', ro: 'Iie, mada desu.', vi: 'Chưa.' },
        { who: 'A', role: 'a', text: 'じゃ、{今度|こんど}の{日曜日|にちようび}、{一緒|いっしょ}に{行|い}きませんか。{浅草|あさくさ}は{楽|たの}しいですよ。', ro: 'Ja, kondo no nichiyoubi, issho ni ikimasen ka. Asakusa wa tanoshii desu yo.', vi: 'Vậy Chủ Nhật tới cùng đi không? Asakusa vui lắm đấy.' },
        { who: 'B', role: 'b', text: 'いいですね。そうしましょう。', ro: 'Ii desu ne. Sou shimashou.', vi: 'Hay đấy. Làm vậy đi.' },
        { who: 'A', role: 'a', text: 'もうすき{焼|や}きを{食|た}べましたか。', ro: 'Mou sukiyaki o tabemashita ka.', vi: 'Bạn ăn sukiyaki chưa?' },
        { who: 'B', role: 'b', text: 'はい、{食|た}べました。{先週|せんしゅう}、{友達|ともだち}のうちで{食|た}べました。', ro: 'Hai, tabemashita. Senshuu, tomodachi no uchi de tabemashita.', vi: 'Rồi, ăn rồi. Tuần trước mình ăn ở nhà bạn.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế',
      head: ['もう', 'N を／へ V ましたか。', 'はい / いいえ'],
      rows: [
        ['もう', '{東京|とうきょう}タワーへ{行|い}きましたか。', 'はい、{行|い}きました。／いいえ、まだです。'],
        ['もう', '「キングマン」を{見|み}ましたか。', 'はい、{見|み}ました。／いいえ、まだです。'],
        ['もう', 'お{好|この}み{焼|や}きを{食|た}べましたか。', 'はい、{食|た}べました。／いいえ、まだです。'],
        ['もう', 'チケットを{買|か}いましたか。', 'はい、{買|か}いました。／いいえ、まだです。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — "chưa" không phải ませんでした',
      items: [
        '~~いいえ、{行|い}きませんでした~~ = "Không, (lúc đó) tôi đã không đi" — trả lời một câu hỏi về MỘT LẦN trong quá khứ, không phải "chưa từng đến". Trả lời もう～ましたか thì dùng **いいえ、まだです**.',
        '(Bài 10 sẽ học cách nói dài: まだ{行|い}っていません. Bây giờ chỉ cần まだです.)',
        'Hỏi {昨日|きのう}、～ましたか (không có もう) thì mới trả lời いいえ、～ませんでした (Bài 5).',
      ],
    },

    /* ── ポイント 58 ── */
    { t: 'h', text: 'ポイント 58 — N は どうですか (Đề xuất: "N thì sao?")' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N は どうですか。',
          vi: 'Đưa ra một **gợi ý** (ngày, giờ, nơi, món) để người kia chọn. Nhẹ nhàng hơn ましょう.',
          examples: [
            { en: '{何|なに}を{食|た}べますか。——おすしはどうですか。', ro: 'Nani o tabemasu ka. — Osushi wa dou desu ka.', vi: 'Ăn gì đây? — Sushi thì sao?' },
            { en: '{何時|なんじ}に{会|あ}いますか。——{5時|ごじ}はどうですか。', ro: 'Nanji ni aimasu ka. — Goji wa dou desu ka.', vi: 'Mấy giờ gặp? — 5 giờ thì sao?' },
            { en: 'どこで{会|あ}いますか。——{新宿駅|しんじゅくえき}はどうですか。', ro: 'Doko de aimasu ka. — Shinjuku eki wa dou desu ka.', vi: 'Gặp ở đâu? — Ga Shinjuku thì sao?' },
            { en: 'いつ{行|い}きますか。——{土曜日|どようび}はどうですか。', ro: 'Itsu ikimasu ka. — Doyoubi wa dou desu ka.', vi: 'Khi nào đi? — Thứ Bảy thì sao?' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Đáp lại một đề xuất',
      head: ['Ý', 'Câu', 'Romaji'],
      rows: [
        ['Đồng ý', 'いいですね。そうしましょう。／いいですよ。', 'Ii desu ne. Sou shimashou. / Ii desu yo.'],
        ['Đồng ý + xác nhận', '{5時|ごじ}ですね。わかりました。', 'Goji desu ne. Wakarimashita.'],
        ['Không được, đề xuất khác', '{5時|ごじ}はちょっと……。{6時|ろくじ}はどうですか。', 'Goji wa chotto……. Rokuji wa dou desu ka.'],
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp — hai nghĩa của どうですか',
      items: [
        'Bài 4: **N は どうですか** hỏi **cảm nhận** — {日本|にほん}の{料理|りょうり}はどうですか → おいしいです (Món Nhật thế nào? → Ngon).',
        'Bài 6: N は どうですか là **gợi ý** — {5時|ごじ}はどうですか → いいですね (5 giờ được không? → Được).',
        'Phân biệt bằng ngữ cảnh: đang bàn chuyện hẹn (mấy giờ, ở đâu, ăn gì) → gợi ý; đang hỏi về trải nghiệm → hỏi cảm nhận. Trong đề thi nói, 「{日本|にほん}の{料理|りょうり}はどうですか」 là câu hỏi CẢM NHẬN.',
      ],
    },

    /* ── ポイント 59 ── */
    { t: 'h', text: 'ポイント 59 — ___ね (nhắc lại để xác nhận)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（thông tin vừa nghe）ですね。',
          vi: 'Nhắc lại thông tin người kia vừa nói + ね để **xác nhận** "… nhé / … phải không". Rất cần khi chốt hẹn.',
          examples: [
            { en: '{5時|ごじ}に{会|あ}いましょう。——{5時|ごじ}ですね。', ro: 'Goji ni aimashou. — Goji desu ne.', vi: 'Gặp lúc 5 giờ nhé. — 5 giờ nhé.' },
            { en: '{新宿駅|しんじゅくえき}で{会|あ}いましょう。——{新宿駅|しんじゅくえき}ですね。わかりました。', ro: 'Shinjuku eki de aimashou. — Shinjuku eki desu ne. Wakarimashita.', vi: 'Gặp ở ga Shinjuku nhé. — Ga Shinjuku nhé. Mình hiểu rồi.' },
            { en: 'じゃ、{土曜日|どようび}の{1時|いちじ}に{上野駅|うえのえき}ですね。', ro: 'Ja, doyoubi no ichiji ni Ueno eki desu ne.', vi: 'Vậy là 1 giờ thứ Bảy ở ga Ueno nhé.' },
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'ね của Bài 4 và ね của Bài 6',
      items: [
        'Bài 4 (ポイント 36): ね = **tìm sự đồng tình** "… nhỉ": きれいですね (Đẹp nhỉ). Đáp: そうですね.',
        'Bài 6 (ポイント 59): ね = **xác nhận lại thông tin** "… nhé / đúng không": {5時|ごじ}ですね. Đáp: はい (hoặc gật đầu).',
        'Ngữ điệu: ね xác nhận lên giọng nhẹ; ね đồng tình kéo dài, xuống giọng.',
      ],
    },

    /* ── ポイント 60 ── */
    { t: 'h', text: 'ポイント 60 — ___よ (báo cho người nghe biết)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（câu）よ。',
          vi: 'Thêm よ cuối câu khi nói điều **người nghe chưa biết** — thông tin mới, lời giới thiệu, lời khuyên: "… đấy", "… mà".',
          examples: [
            { en: 'この{映画|えいが}はとてもおもしろいですよ。', ro: 'Kono eiga wa totemo omoshiroi desu yo.', vi: 'Phim này hay lắm đấy.' },
            { en: '{上野|うえの}においしいお{好|この}み{焼|や}きの{店|みせ}がありますよ。', ro: 'Ueno ni oishii okonomiyaki no mise ga arimasu yo.', vi: 'Ở Ueno có quán okonomiyaki ngon đấy.' },
            { en: 'JRのほうがいいですよ。', ro: 'JR no hou ga ii desu yo.', vi: 'Đi JR thì hơn đấy.' },
            { en: 'あ、{横浜|よこはま}で{花火|はなび}{大会|たいかい}がありますよ。', ro: 'A, Yokohama de hanabi taikai ga arimasu yo.', vi: 'A, ở Yokohama có lễ hội pháo hoa đấy.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'ね hay よ?',
      head: ['', 'ね (59 / Bài 4)', 'よ (60)'],
      rows: [
        ['Thông tin thuộc về', 'cả hai đều biết / vừa được nghe', 'chỉ **người nói** biết'],
        ['Ví dụ', '{5時|ごじ}ですね。(nhắc lại)', '{5時|ごじ}からですよ。(báo tin)'],
        ['Rủ + giới thiệu', '—', 'お{好|この}み{焼|や}きはおいしいですよ。{一緒|いっしょ}に{行|い}きませんか。'],
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận khi dùng よ',
      items: [
        'Nói với thầy cô, giám thị: hạn chế よ trong câu trả lời thông thường (~~はい、{学生|がくせい}ですよ~~ nghe như "tôi là SV mà, hỏi gì lạ") — trả lời thi chỉ cần です／ます.',
        'Dùng よ để **khen, giới thiệu, khuyên** — đúng chỗ nhất là ngay trước một lời rủ: ～はおいしいですよ。{一緒|いっしょ}に{行|い}きませんか.',
      ],
    },

    /* ── Tổng kết ── */
    { t: 'h', text: 'Tổng kết — câu hỏi của Bài 6 và cách trả lời' },
    {
      t: 'table',
      head: ['Câu hỏi', 'Hỏi về', 'Trả lời mẫu', 'ポイント'],
      rows: [
        ['{一緒|いっしょ}に～ませんか。', 'Lời rủ', 'いいですね。～ましょう。／すみません。～はちょっと……。', '48, 49'],
        ['{時間|じかん}がありますか。', 'Có rảnh không', 'はい、あります。／いいえ、{用事|ようじ}があります。', '50'],
        ['どこで～がありますか。', 'Nơi diễn ra sự kiện', '{横浜|よこはま}であります。', '51'],
        ['チケットが{何枚|なんまい}ありますか。', 'Số lượng', '{2枚|にまい}あります。', '52'],
        ['N1で{何|なに}がいちばんAですか。', 'Nhất', 'N2がいちばんAです。', '53'],
        ['N1とN2とどちらがAですか。', 'Chọn 1 trong 2', 'N1のほうがAです。／どちらもAです。', '55, 56 (+54)'],
        ['もう～ましたか。', 'Đã … chưa', 'はい、～ました。／いいえ、まだです。', '57'],
        ['{何時|なんじ}に／どこで{会|あ}いますか。', 'Hẹn', '～はどうですか。——～ですね。わかりました。', '58, 59'],
      ],
    },
    {
      t: 'build',
      id: 'b6-np-ghep',
      title: 'Ghép câu — dùng đủ 13 điểm ngữ pháp',
      items: [
        { vi: 'Tối nay cùng ăn cơm không?', chips: ['{今晩|こんばん}、', '{一緒|いっしょ}に', 'ご{飯|はん}を', '{食|た}べませんか', '{食|た}べましょう', 'が'], answer: ['{今晩|こんばん}、', '{一緒|いっしょ}に', 'ご{飯|はん}を', '{食|た}べませんか'], ro: 'Konban, issho ni gohan o tabemasen ka.' },
        { vi: 'Cùng đi xem phim không?', chips: ['{一緒|いっしょ}に', '{映画|えいが}を', '{見|み}に', '{行|い}きませんか', '{見|み}', 'で'], answer: ['{一緒|いっしょ}に', '{映画|えいが}を', '{見|み}に', '{行|い}きませんか'], ro: 'Issho ni eiga o mi ni ikimasen ka.' },
        { vi: 'Hay đấy. Đi thôi.', chips: ['いいですね。', '{行|い}きましょう', '{行|い}きませんか', 'ちょっと'], answer: ['いいですね。', '{行|い}きましょう'], ro: 'Ii desu ne. Ikimashou.' },
        { vi: 'Xin lỗi. Thứ Bảy thì hơi…', chips: ['すみません。', '{土曜日|どようび}は', 'ちょっと……', '{土曜日|どようび}に', 'いいですね'], answer: ['すみません。', '{土曜日|どようび}は', 'ちょっと……'], ro: 'Sumimasen. Doyoubi wa chotto…….' },
        { vi: 'Ngày mai tôi có hẹn với bạn.', chips: ['{明日|あした}、', '{友達|ともだち}と', '{約束|やくそく}が', 'あります', 'を', 'います'], answer: ['{明日|あした}、', '{友達|ともだち}と', '{約束|やくそく}が', 'あります'], ro: 'Ashita, tomodachi to yakusoku ga arimasu.' },
        { vi: 'Ở Yokohama có trận bóng chày.', chips: ['{横浜|よこはま}で', '{野球|やきゅう}の', '{試合|しあい}が', 'あります', '{横浜|よこはま}に', 'を'], answer: ['{横浜|よこはま}で', '{野球|やきゅう}の', '{試合|しあい}が', 'あります'], ro: 'Yokohama de yakyuu no shiai ga arimasu.' },
        { vi: 'Tôi có 2 vé hoà nhạc.', chips: ['コンサートの', 'チケットが', '{2枚|にまい}', 'あります', '{2|ふた}つ', 'を'], answer: ['コンサートの', 'チケットが', '{2枚|にまい}', 'あります'], ro: 'Konsaato no chiketto ga nimai arimasu.' },
        { vi: 'Trong các môn thể thao, bạn thích môn nào nhất?', chips: ['スポーツで', '{何|なに}が', 'いちばん', '{好|す}きですか', '{何|なに}は', 'より'], answer: ['スポーツで', '{何|なに}が', 'いちばん', '{好|す}きですか'], ro: 'Supootsu de nani ga ichiban suki desu ka.' },
        { vi: 'Việt Nam nóng hơn Nhật.', chips: ['ベトナムは', '{日本|にほん}より', '{暑|あつ}いです', 'のほうが', 'いちばん'], answer: ['ベトナムは', '{日本|にほん}より', '{暑|あつ}いです'], ro: 'Betonamu wa Nihon yori atsui desu.' },
        { vi: 'Ramen và thịt nướng, cái nào hơn?', chips: ['ラーメンと', '{焼|や}き{肉|にく}と', 'どちらが', 'いいですか', 'どちらは', '{何|なに}が'], answer: ['ラーメンと', '{焼|や}き{肉|にく}と', 'どちらが', 'いいですか'], ro: 'Raamen to yakiniku to dochira ga ii desu ka.' },
        { vi: 'Tàu điện ngầm nhanh hơn.', chips: ['{地下鉄|ちかてつ}', 'の', 'ほう', 'が', '{早|はや}いです', 'より', 'は'], answer: ['{地下鉄|ちかてつ}', 'の', 'ほう', 'が', '{早|はや}いです'], ro: 'Chikatetsu no hou ga hayai desu.' },
        { vi: 'Bạn đã đi tháp Tokyo chưa?', chips: ['もう', '{東京|とうきょう}タワーへ', '{行|い}きましたか', 'まだ', '{行|い}きますか'], answer: ['もう', '{東京|とうきょう}タワーへ', '{行|い}きましたか'], ro: 'Mou Toukyou tawaa e ikimashita ka.' },
        { vi: 'Chưa.', chips: ['いいえ、', 'まだです', 'もうです', '{行|い}きませんでした'], answer: ['いいえ、', 'まだです'], ro: 'Iie, mada desu.' },
        { vi: '6 giờ thì sao? (đề xuất giờ gặp)', chips: ['{6時|ろくじ}', 'は', 'どうですか', 'に', 'どちらですか'], answer: ['{6時|ろくじ}', 'は', 'どうですか'], ro: 'Rokuji wa dou desu ka.' },
        { vi: 'Ga Shinjuku nhé. Mình hiểu rồi.', chips: ['{新宿駅|しんじゅくえき}', 'ですね。', 'わかりました', 'ですよ。', 'そうですねえ'], answer: ['{新宿駅|しんじゅくえき}', 'ですね。', 'わかりました'], ro: 'Shinjuku eki desu ne. Wakarimashita.' },
        { vi: 'Okonomiyaki ngon lắm đấy.', chips: ['お{好|この}み{焼|や}きは', 'とても', 'おいしいです', 'よ', 'ね', 'が'], answer: ['お{好|この}み{焼|や}きは', 'とても', 'おいしいです', 'よ'], ro: 'Okonomiyaki wa totemo oishii desu yo.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b6-np-kiem',
      title: 'Kiểm tra nhanh ngữ pháp Bài 6',
      items: [
        { q: 'Muốn RỦ bạn đi karaoke, câu nào đúng?', options: ['カラオケに{行|い}きますか。', 'カラオケに{行|い}きませんか。', 'カラオケに{行|い}きません。', 'カラオケに{行|い}きました。'], correct: 1, why: 'Rủ = **Vませんか** (ポイント 48). 行きますか chỉ là hỏi thông tin.' },
        { q: 'Bạn được rủ và muốn nhận lời:', options: ['はい、{行|い}きます。', 'いいですね。{行|い}きましょう。', 'いいえ、{行|い}きません。', '{残念|ざんねん}です。'], correct: 1, why: 'Nhận lời: いいですね + **Vましょう** (ポイント 49).' },
        { q: 'Từ chối khéo lời rủ tối nay:', options: ['いいえ、{行|い}きません。', 'すみません。{今晩|こんばん}はちょっと……。', '{今晩|こんばん}はだめです。', 'また{今度|こんど}。'], correct: 1, why: '**すみません。～はちょっと……** là cách từ chối chuẩn.' },
        { q: '「{明日|あした}、テスト＿あります。」', options: ['を', 'に', 'が', 'で'], correct: 2, why: 'N **が** あります (ポイント 50).' },
        { q: '「{上野|うえの}＿コンサートがあります。」 (có buổi hoà nhạc ở Ueno)', options: ['に', 'で', 'へ', 'を'], correct: 1, why: 'Sự kiện diễn ra ở đâu → **で** (ポイント 51). に dùng cho vật tồn tại.' },
        { q: '"Tôi có 3 vé" là:', options: ['チケットが{3|みっ}つあります。', 'チケットが{3枚|さんまい}あります。', '{3枚|さんまい}チケットです。', 'チケットを{3枚|さんまい}あります。'], correct: 1, why: 'Vé mỏng phẳng → ～{枚|まい}; N **が** {3枚|さんまい} あります (ポイント 52).' },
        { q: '「スポーツ＿{何|なに}がいちばんおもしろいですか。」', options: ['は', 'で', 'に', 'と'], correct: 1, why: 'Phạm vi so sánh nhất → **で** (ポイント 53).' },
        { q: '"Shinjuku gần hơn Shibuya":', options: ['{渋谷|しぶや}は{新宿|しんじゅく}より{近|ちか}いです。', '{新宿|しんじゅく}は{渋谷|しぶや}より{近|ちか}いです。', '{新宿|しんじゅく}より{渋谷|しぶや}は{近|ちか}いです。', '{新宿|しんじゅく}は{渋谷|しぶや}のほう{近|ちか}いです。'], correct: 1, why: '**N1 は N2 より A**: より gắn vào cái bị so (Shibuya) (ポイント 54).' },
        { q: '「{夏|なつ}と{冬|ふゆ}と＿が{好|す}きですか。」', options: ['{何|なに}', 'どちら', 'どこ', 'いつ'], correct: 1, why: 'Chọn 1 trong 2 → **どちら** (ポイント 55).' },
        { q: 'Trả lời 「バスと{地下鉄|ちかてつ}とどちらが{早|はや}いですか」:', options: ['{地下鉄|ちかてつ}が{早|はや}いです。', '{地下鉄|ちかてつ}のほうが{早|はや}いです。', '{地下鉄|ちかてつ}のほうは{早|はや}いです。', '{地下鉄|ちかてつ}はいちばん{早|はや}いです。'], correct: 1, why: '**N のほうが A** (ポイント 56).' },
        { q: '「もうお{好|この}み{焼|や}きを{食|た}べましたか。」 Bạn chưa ăn:', options: ['いいえ、{食|た}べませんでした。', 'いいえ、まだです。', 'いいえ、もうです。', 'はい、まだです。'], correct: 1, why: '"Chưa" = **いいえ、まだです** (ポイント 57).' },
        { q: 'Đề xuất giờ gặp: "7 giờ thì sao?"', options: ['{7時|しちじ}はどうですか。', '{7時|しちじ}はどちらですか。', '{7時|しちじ}ですよ。', '{7時|しちじ}にどうですか。'], correct: 0, why: '**N は どうですか** (ポイント 58).' },
        { q: 'Bạn nghe 「{3時|さんじ}に{会|あ}いましょう」. Nhắc lại để xác nhận:', options: ['{3時|さんじ}ですよ。', '{3時|さんじ}ですね。', '{3時|さんじ}ですか。', '{3時|さんじ}ましょう。'], correct: 1, why: 'Xác nhận thông tin vừa nghe → **～ですね** (ポイント 59).' },
        { q: 'Giới thiệu cho bạn điều bạn chưa biết: "Quán này rẻ lắm đấy."', options: ['この{店|みせ}は{安|やす}いですね。', 'この{店|みせ}は{安|やす}いですよ。', 'この{店|みせ}は{安|やす}いですか。', 'この{店|みせ}は{安|やす}いましょう。'], correct: 1, why: 'Báo thông tin mới → **よ** (ポイント 60).' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const KANJI: Lesson = {
  id: 'b6-kanji',
  kind: 'kanji',
  title: 'Chữ Hán — trong từ vựng Bài 6',
  goal: 'Nhận mặt và đọc đúng mọi chữ Hán trong 55 từ của Bài 6: thời gian, sự kiện, đồ ăn, nơi chốn, tính từ so sánh.',
  minutes: 25,
  blocks: [
    {
      t: 'p',
      text: 'Phần Reading của đề thi có **4 từ chữ Hán gạch chân, không furigana (12 điểm)**. Học theo **cả từ** ({約束|やくそく}, {映画館|えいがかん}) chứ đừng học chữ rời. **Âm On** (音, gốc Hán) thường dùng khi hai chữ Hán đứng cạnh nhau; **âm Kun** (訓, âm Nhật) khi chữ đứng một mình hoặc có đuôi kana ({近|ちか}い, {遊|あそ}びます).',
    },
    {
      t: 'note',
      title: 'Cột Mức: 👁 nhận mặt · ✍ nên viết — và học chữ Hán THEO TỪ',
      items: [
        '👁 **nhận mặt** = gặp trong câu thì **đọc được và hiểu nghĩa** là đủ — phần lớn chữ trong bài; đây là thứ phần Đọc của đề (không furigana) kiểm tra.',
        '✍ **nên viết** = chữ ít nét, gặp rất nhiều (số, 日 月 火 水 木 金 土, 人 山 川 大 小 上 下 中…) — tập viết tay cho thuộc. Bài này có 12 chữ ✍, xếp đầu phần tập viết.',
        '**Học chữ Hán THEO TỪ**: nhớ {学生|がくせい} = gakusei, {先生|せんせい} = sensei như một khối âm, không bắt thuộc âm On/Kun của từng chữ rời. Cột âm On/Kun chỉ để tra và để đoán khi gặp từ mới; đề thi luôn hỏi cách đọc CẢ TỪ.',
      ],
    },
    {
      t: 'table',
      caption: '1. Thời gian & kế hoạch',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['今', '✍', 'コン・キン', 'いま', 'KIM (nay)', '{今週|こんしゅう} · {今月|こんげつ} · {今晩|こんばん} · {今度|こんど}'],
        ['来', '✍', 'ライ', 'く(る)・き(ます)', 'LAI (đến)', '{来週|らいしゅう} · {来月|らいげつ} · {来年|らいねん}'],
        ['週', '👁', 'シュウ', '—', 'CHU (tuần)', '{今週|こんしゅう} · {来週|らいしゅう} · {週末|しゅうまつ}'],
        ['月', '✍', 'ゲツ・ガツ', 'つき', 'NGUYỆT (tháng)', '{今月|こんげつ} · {来月|らいげつ} · {7月|しちがつ}'],
        ['約', '👁', 'ヤク', '—', 'ƯỚC (hẹn)', '{約束|やくそく}'],
        ['束', '👁', 'ソク', 'たば', 'THÚC (buộc)', '{約束|やくそく}'],
        ['用', '👁', 'ヨウ', 'もち(いる)', 'DỤNG (dùng)', '{用事|ようじ}'],
        ['事', '👁', 'ジ', 'こと', 'SỰ (việc)', '{用事|ようじ} · {食事|しょくじ}'],
        ['季', '👁', 'キ', '—', 'QUÝ (mùa)', '{季節|きせつ}'],
        ['節', '👁', 'セツ', 'ふし', 'TIẾT (tiết, mùa)', '{季節|きせつ}'],
      ],
    },
    {
      t: 'table',
      caption: '2. Giải trí, sự kiện, đồ vật',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['試', '👁', 'シ', 'ため(す)', 'THÍ (thử)', '{試合|しあい}'],
        ['合', '👁', 'ゴウ・ガッ', 'あ(う)', 'HỢP', '{試合|しあい} (đọc **あい**)'],
        ['野', '👁', 'ヤ', 'の', 'DÃ (đồng)', '{野球|やきゅう} · {野菜|やさい}'],
        ['球', '👁', 'キュウ', 'たま', 'CẦU (quả bóng)', '{野球|やきゅう}'],
        ['歌', '👁', 'カ', 'うた', 'CA (hát)', '{歌手|かしゅ} · {歌|うた}'],
        ['手', '✍', 'シュ', 'て', 'THỦ (tay; người làm nghề)', '{歌手|かしゅ}'],
        ['枚', '👁', 'マイ', '—', 'MAI (tấm, tờ)', '～{枚|まい} · {何枚|なんまい}'],
        ['地', '👁', 'チ・ジ', '—', 'ĐỊA (đất)', '{地図|ちず} · {地下鉄|ちかてつ}'],
        ['図', '👁', 'ズ・ト', 'はか(る)', 'ĐỒ (bản vẽ)', '{地図|ちず} · {図書館|としょかん}'],
        ['水', '✍', 'スイ', 'みず', 'THUỶ (nước)', '{水着|みずぎ} (みず + ぎ)'],
        ['着', '👁', 'チャク', 'き(る)', 'TRƯỚC (mặc)', '{水着|みずぎ} (き → **ぎ**)'],
      ],
    },
    {
      t: 'table',
      caption: '3. Ăn uống & nơi chốn',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['食', '✍', 'ショク', 'た(べる)', 'THỰC (ăn)', '{食|た}べ{物|もの} · {食|た}べ{放題|ほうだい} · {食事|しょくじ}'],
        ['飲', '👁', 'イン', 'の(む)', 'ẨM (uống)', '{飲|の}み{物|もの}'],
        ['物', '👁', 'ブツ・モツ', 'もの', 'VẬT (đồ)', '{食|た}べ{物|もの} · {飲|の}み{物|もの} · {買|か}い{物|もの}'],
        ['焼', '👁', 'ショウ', 'や(く)', 'THIÊU (nướng)', '{焼|や}き{肉|にく} · すき{焼|や}き · お{好|この}み{焼|や}き'],
        ['肉', '✍', 'ニク', '—', 'NHỤC (thịt)', '{焼|や}き{肉|にく} · {牛肉|ぎゅうにく}'],
        ['放', '👁', 'ホウ', 'はな(す)', 'PHÓNG (thả)', '{食|た}べ{放題|ほうだい}'],
        ['題', '👁', 'ダイ', '—', 'ĐỀ', '{食|た}べ{放題|ほうだい} (ほう + だい)'],
        ['好', '✍', 'コウ', 'す(き)・この(む)', 'HẢO (thích)', '{好|す}き · お{好|この}み{焼|や}き'],
        ['居', '👁', 'キョ', 'い(る)', 'CƯ (ở)', '{居酒屋|いざかや}'],
        ['酒', '👁', 'シュ', 'さけ・さか', 'TỬU (rượu)', '{居酒屋|いざかや} (**さか**) · お{酒|さけ}'],
        ['屋', '👁', 'オク', 'や', 'ỐC (nhà, quán)', '{居酒屋|いざかや} · {本屋|ほんや}'],
        ['映', '👁', 'エイ', 'うつ(る)', 'ÁNH (chiếu)', '{映画|えいが} · {映画館|えいがかん}'],
        ['画', '👁', 'ガ・カク', '—', 'HOẠ (tranh)', '{映画|えいが} · {映画館|えいがかん}'],
        ['館', '👁', 'カン', '—', 'QUÁN (toà nhà lớn)', '{映画館|えいがかん} · {図書館|としょかん} · {体育館|たいいくかん}'],
        ['下', '✍', 'カ・ゲ', 'した', 'HẠ (dưới)', '{地下鉄|ちかてつ} · {地下|ちか}'],
        ['鉄', '👁', 'テツ', '—', 'THIẾT (sắt)', '{地下鉄|ちかてつ}'],
      ],
    },
    {
      t: 'table',
      caption: '4. Tính từ, động từ, phó từ',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['近', '✍', 'キン', 'ちか(い)', 'CẬN (gần)', '{近|ちか}い'],
        ['遠', '👁', 'エン', 'とお(い)', 'VIỄN (xa)', '{遠|とお}い'],
        ['早', '✍', 'ソウ', 'はや(い)', 'TẢO (sớm)', '{早|はや}い'],
        ['広', '👁', 'コウ', 'ひろ(い)', 'QUẢNG (rộng)', '{広|ひろ}い'],
        ['残', '👁', 'ザン', 'のこ(る)', 'TÀN (còn lại)', '{残念|ざんねん}'],
        ['念', '👁', 'ネン', '—', 'NIỆM', '{残念|ざんねん}'],
        ['全', '👁', 'ゼン', 'まった(く)', 'TOÀN', '{全部|ぜんぶ}'],
        ['部', '👁', 'ブ', '—', 'BỘ (phần)', '{全部|ぜんぶ}'],
        ['一', '✍', 'イチ・イツ', 'ひと(つ)', 'NHẤT', '{一緒|いっしょ}に (イチ → **いっ**)'],
        ['緒', '👁', 'ショ・チョ', 'お', 'TỰ (đầu mối)', '{一緒|いっしょ}に'],
        ['遊', '👁', 'ユウ', 'あそ(ぶ)', 'DU (chơi)', '{遊|あそ}びます'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ',
      items: [
        '**Hán Việt đoán nghĩa**: 約束 = ƯỚC THÚC (hẹn ước), 残念 = TÀN NIỆM (tiếc nuối), 映画館 = ÁNH HOẠ QUÁN (rạp chiếu phim), 地下鉄 = ĐỊA HẠ THIẾT (sắt dưới đất = tàu điện ngầm), 全部 = TOÀN BỘ, 季節 = QUÝ TIẾT, 歌手 = CA THỦ.',
        '**今・来 + 週・月**: 今 = này, 来 = tới. 今週 / 来週 đọc しゅう; 今月 / 来月 đọc げつ (không phải ~~がつ~~ — がつ chỉ dùng khi có số: {7月|しちがつ}).',
        '**焼 = や(く)** "nướng": 焼き肉 (thịt nướng), すき焼き, お好み焼き — cả ba món của bài đều có chữ này.',
        '**Biến âm cần nhớ**: 水着 みず**ぎ** (không ~~みずき~~), 居酒屋 い**ざか**や (酒 さけ → さか), 一緒 **いっ**しょ, 試合 し**あい**.',
      ],
    },
    {
      t: 'mcq',
      id: 'b6-kj-doc',
      title: 'Đọc chữ Hán — chọn cách đọc đúng',
      items: [
        { q: '今週', options: ['いましゅう', 'こんしゅう', 'こんしゅ', 'きんしゅう'], correct: 1, why: '今 コン + 週 シュウ = **こんしゅう**.' },
        { q: '来月', options: ['らいがつ', 'らいげつ', 'くるげつ', 'らいつき'], correct: 1, why: 'Không có số → 月 đọc **げつ**: らいげつ.' },
        { q: '約束', options: ['やくそく', 'やくそっく', 'やっそく', 'よくそく'], correct: 0, why: '**やくそく** — cuộc hẹn.' },
        { q: '用事', options: ['ようこと', 'ようじ', 'よじ', 'ようし'], correct: 1, why: '**ようじ** (trường âm よう).' },
        { q: '試合', options: ['しごう', 'しあい', 'しがっ', 'ためあい'], correct: 1, why: '合 ở đây đọc Kun **あい**: しあい.' },
        { q: '野球', options: ['のきゅう', 'やきゅう', 'やきゅ', 'やたま'], correct: 1, why: '**やきゅう** — bóng chày (trường âm きゅう).' },
        { q: '水着', options: ['みずき', 'すいちゃく', 'みずぎ', 'みずちゃく'], correct: 2, why: 'き biến thành **ぎ**: みずぎ.' },
        { q: '地図', options: ['ちず', 'じず', 'ちと', 'じと'], correct: 0, why: '**ちず** — bản đồ.' },
        { q: '残念', options: ['ざんねん', 'さんねん', 'ざねん', 'のこねん'], correct: 0, why: '**ざんねん** — tiếc.' },
        { q: '一緒に', options: ['いちしょに', 'いっしょに', 'いしょに', 'ひとしょに'], correct: 1, why: 'いち → **いっ** (âm ngắt): いっしょに.' },
        { q: '食べ放題', options: ['たべほうだい', 'たべほだい', 'しょくほうだい', 'たべはなだい'], correct: 0, why: '**たべほうだい** — ăn thoả thích.' },
        { q: '居酒屋', options: ['いさけや', 'いざかや', 'きょしゅや', 'いさかや'], correct: 1, why: '酒 さけ → **ざか**: いざかや.' },
        { q: '映画館', options: ['えいがかん', 'えがかん', 'えいかかん', 'えいがやかた'], correct: 0, why: '**えいがかん** — rạp chiếu phim.' },
        { q: '地下鉄', options: ['じかてつ', 'ちかてつ', 'ちしたてつ', 'ちかでつ'], correct: 1, why: '**ちかてつ** — tàu điện ngầm.' },
        { q: '歌手', options: ['うたて', 'かしゅ', 'かて', 'かしゅう'], correct: 1, why: '**かしゅ** — ca sĩ (しゅ ngắn).' },
        { q: '季節', options: ['きせつ', 'きぶし', 'きせち', 'けせつ'], correct: 0, why: '**きせつ** — mùa.' },
        { q: '遠い', options: ['とうい', 'とおい', 'えんい', 'とい'], correct: 1, why: '**とおい** — viết お, không phải ~~とうい~~.' },
        { q: '全部', options: ['ぜんぶ', 'せんぶ', 'ぜんべ', 'ぜぶ'], correct: 0, why: '**ぜんぶ** — tất cả.' },
        { q: 'お好み焼き', options: ['おすきみやき', 'おこのみやき', 'おこうみやき', 'おこのみしょうき'], correct: 1, why: '好 đọc **この(む)** ở đây: おこのみやき.' },
        { q: '焼き肉', options: ['やきにく', 'しょうにく', 'やきじく', 'やにく'], correct: 0, why: '**やきにく** — thịt nướng.' },
      ],
    },

    /* ── Đứng riêng / đứng chung ── */
    { t: 'h', text: 'Đứng riêng hay đứng chung — một chữ, hai cách đọc' },
    {
      t: 'p',
      text: 'Quy tắc gần đúng: **chữ đứng một mình / có đuôi kana → âm Kun** (âm Nhật); **hai chữ Hán ghép với nhau → âm On** (âm Hán). Bảng dưới là các chữ Bài 6 có cả hai cách đọc — đọc hàng ngang để thấy cùng một chữ đổi âm thế nào. Từ ghi "(Bài x)" là từ của bài khác; "(sẽ gặp)" là từ của bài sau — chỉ cần nhận mặt.',
    },
    {
      t: 'table',
      caption: 'Chữ Bài 6 — đứng riêng (Kun) ↔ trong từ ghép (On)',
      head: ['Chữ', 'Đứng riêng (Kun) — từ, nghĩa', 'Trong từ ghép (On) — từ, nghĩa'],
      rows: [
        ['今', '{今|いま} ima — bây giờ', '{今週|こんしゅう} konshuu · {今月|こんげつ} kongetsu · {今度|こんど} kondo'],
        ['来', '{来|き}ます kimasu — đến', '{来週|らいしゅう} raishuu · {来月|らいげつ} raigetsu · {来年|らいねん} (Bài 5)'],
        ['月', '{月|つき} tsuki — mặt trăng', '{今月|こんげつ} · {来月|らいげつ} (げつ) · {7月|しちがつ} (がつ — có số)'],
        ['束', '{束|たば} taba — bó (hoa…) (sẽ gặp)', '{約束|やくそく} yakusoku — cuộc hẹn'],
        ['事', '{事|こと} koto — việc', '{用事|ようじ} youji — việc bận · {食事|しょくじ} (Bài 5)'],
        ['合', '{合|あ}います aimasu — hợp (sẽ gặp) · {試合|しあい} (あい: Kun!)', '{合格|ごうかく} goukaku — thi đỗ (sẽ gặp)'],
        ['野', '{野|の} no — cánh đồng (hiếm)', '{野球|やきゅう} yakyuu · {野菜|やさい} yasai (Bài 2)'],
        ['球', '{球|たま} tama — quả bóng (hiếm)', '{野球|やきゅう} yakyuu — bóng chày'],
        ['歌', '{歌|うた} uta — bài hát · {歌|うた}います', '{歌手|かしゅ} kashu — ca sĩ'],
        ['手', '{手|て} te — tay', '{歌手|かしゅ} kashu · ({上手|じょうず}: đặc biệt — Bài 9)'],
        ['水', '{水|みず} mizu · {水着|みずぎ} mizugi (Kun + Kun)', '{水曜日|すいようび} suiyoubi (Bài 3)'],
        ['着', '{着|き}ます kimasu — mặc (sẽ gặp) · {水着|みずぎ} (ぎ)', '{到着|とうちゃく} touchaku — đến nơi (sẽ gặp)'],
        ['食', '{食|た}べ{物|もの} tabemono · {食|た}べ{放題|ほうだい}', '{食事|しょくじ} shokuji (Bài 5)'],
        ['物', '{食|た}べ{物|もの} · {飲|の}み{物|もの} · {買|か}い{物|もの} (もの)', '{動物|どうぶつ} doubutsu — động vật (sẽ gặp) · ({果物|くだもの}: đặc biệt)'],
        ['肉', '{肉|にく} niku (đứng riêng vẫn On — ngoại lệ)', '{焼|や}き{肉|にく} yakiniku · {牛肉|ぎゅうにく} (Bài 2)'],
        ['好', '{好|す}き suki · お{好|この}み{焼|や}き okonomiyaki', '{好物|こうぶつ} koubutsu — món khoái khẩu (sẽ gặp)'],
        ['酒', 'お{酒|さけ} osake · {居酒屋|いざかや} (さか)', '{日本酒|にほんしゅ} nihonshu — rượu sake (sẽ gặp)'],
        ['下', '{下|した} shita — phía dưới (Bài 7)', '{地下鉄|ちかてつ} chikatetsu · {地下|ちか} (Bài 2)'],
        ['近', '{近|ちか}い chikai — gần', '{最近|さいきん} saikin — dạo này (Bài 9)'],
        ['遠', '{遠|とお}い tooi — xa', '{遠足|えんそく} ensoku — dã ngoại (sẽ gặp)'],
        ['全', '{全|まった}く mattaku — hoàn toàn (hiếm)', '{全部|ぜんぶ} zenbu · {全然|ぜんぜん} (Bài 9)'],
        ['一', '{一|ひと}つ hitotsu · {一人|ひとり} (Bài 5)', '{一緒|いっしょ}に issho ni (いち → いっ) · {一年中|いちねんじゅう} (Bài 4)'],
        ['遊', '{遊|あそ}びます asobimasu — chơi', '{遊園地|ゆうえんち} yuuenchi — công viên giải trí (sẽ gặp)'],
        ['画', '— (không đứng riêng)', '{映画|えいが} eiga · {映画館|えいがかん} eigakan · {漫画|まんが} (Bài 9)'],
      ],
    },
    {
      t: 'note',
      title: 'Cách đọc bất quy tắc hay gặp trong bài (thuộc lòng)',
      items: [
        '**{今月|こんげつ} / {来月|らいげつ} / {先月|せんげつ}** — không có số thì 月 đọc **げつ**; có số mới đọc がつ ({7月|しちがつ}).',
        '**{試合|しあい}** shiai (合 đọc Kun あい) · **{水着|みずぎ}** mizugi (き → ぎ) · **{居酒屋|いざかや}** izakaya (さけ → さか).',
        '**{一緒|いっしょ}に** issho ni (いち → いっ) · **{地図|ちず}** chizu (viết ず, không ~~づ~~) · **{遠|とお}い** tooi (viết お, không ~~う~~).',
        '**{一枚|いちまい}, {二枚|にまい}, {三枚|さんまい}** — 枚 không đổi âm, dễ nhất trong các đơn vị đếm.',
        '**{二人|ふたり}で** futari de — hai người (Bài 5); **{今度|こんど}** kondo — lần tới (không ~~いまど~~).',
        '**{好|す}き** (thích) nhưng **お{好|この}み{焼|や}き** (この) — cùng chữ 好, hai âm Kun.',
      ],
    },

    /* ── Đọc không furigana ── */
    { t: 'h', text: 'Từ chữ Hán hay gặp trong đề đọc — đọc KHÔNG furigana' },
    {
      t: 'p',
      text: 'Đề Reading in chữ Hán **không có furigana**. Luyện: nhìn câu (chữ Hán để trần), **đọc to** trước, rồi mới bấm hiện cách đọc + nghe máy đọc, tự chấm đúng/sai. Câu ngắn trước, đoạn dài sau.',
    },
    {
      t: 'readkanji',
      id: 'b6-doc-kanji',
      title: 'Đọc to từng câu — từ chữ Hán Bài 6',
      note: 'Chỗ vấp nhiều nhất: 来月 (らいげつ), 試合 (しあい), 水着 (みずぎ), 居酒屋 (いざかや), 一緒に (いっしょに), 遠い (とおい).',
      items: [
        { text: '{今週|こんしゅう}の{土曜日|どようび}、{一緒|いっしょ}に{映画|えいが}を{見|み}ませんか。', ro: 'Konshuu no doyoubi, issho ni eiga o mimasen ka.', vi: 'Thứ Bảy tuần này cùng đi xem phim không?' },
        { text: '{映画館|えいがかん}の{前|まえ}で{会|あ}いましょう。', ro: 'Eigakan no mae de aimashou.', vi: 'Gặp nhau trước rạp chiếu phim nhé.' },
        { text: 'すみません、{土曜日|どようび}は{約束|やくそく}があります。', ro: 'Sumimasen, doyoubi wa yakusoku ga arimasu.', vi: 'Xin lỗi, thứ Bảy mình có hẹn rồi.' },
        { text: '{来週|らいしゅう}の{月曜日|げつようび}は{用事|ようじ}があります。', ro: 'Raishuu no getsuyoubi wa youji ga arimasu.', vi: 'Thứ Hai tuần sau mình có việc bận.' },
        { text: '{来月|らいげつ}、{東京|とうきょう}で{野球|やきゅう}の{試合|しあい}があります。', ro: 'Raigetsu, Toukyou de yakyuu no shiai ga arimasu.', vi: 'Tháng sau ở Tokyo có trận bóng chày.' },
        { text: '{好|す}きな{歌手|かしゅ}のコンサートのチケットが{2枚|にまい}あります。', ro: 'Suki na kashu no konsaato no chiketto ga nimai arimasu.', vi: 'Mình có 2 vé buổi hoà nhạc của ca sĩ mình thích.' },
        { text: '{地下鉄|ちかてつ}の{地図|ちず}がありますか。', ro: 'Chikatetsu no chizu ga arimasu ka.', vi: 'Bạn có bản đồ tàu điện ngầm không?' },
        { text: '{地下鉄|ちかてつ}で{行|い}きましょう。', ro: 'Chikatetsu de ikimashou.', vi: 'Đi bằng tàu điện ngầm đi.' },
        { text: '{季節|きせつ}で{何|なに}がいちばん{好|す}きですか。', ro: 'Kisetsu de nani ga ichiban suki desu ka.', vi: 'Trong các mùa bạn thích mùa nào nhất?' },
        { text: '{日本|にほん}の{食|た}べ{物|もの}で{焼|や}き{肉|にく}がいちばん{好|す}きです。', ro: 'Nihon no tabemono de yakiniku ga ichiban suki desu.', vi: 'Trong đồ ăn Nhật tôi thích thịt nướng nhất.' },
        { text: 'すき{焼|や}きとお{好|この}み{焼|や}きと、どちらがおいしいですか。', ro: 'Sukiyaki to okonomiyaki to, dochira ga oishii desu ka.', vi: 'Sukiyaki và okonomiyaki, món nào ngon hơn?' },
        { text: '{駅|えき}は{学校|がっこう}より{近|ちか}いです。', ro: 'Eki wa gakkou yori chikai desu.', vi: 'Nhà ga gần hơn trường học.' },
        { text: '{海|うみ}は{山|やま}より{遠|とお}いです。', ro: 'Umi wa yama yori tooi desu.', vi: 'Biển xa hơn núi.' },
        { text: 'この{居酒屋|いざかや}は{広|ひろ}いです。そして、{食|た}べ{放題|ほうだい}があります。', ro: 'Kono izakaya wa hiroi desu. Soshite, tabehoudai ga arimasu.', vi: 'Quán nhậu này rộng. Và có ăn thoả thích.' },
        { text: '{飲|の}み{物|もの}は{何|なに}がいいですか。', ro: 'Nomimono wa nani ga ii desu ka.', vi: 'Đồ uống thì bạn chọn gì?' },
        { text: 'もう{水着|みずぎ}を{買|か}いましたか。— いいえ、まだです。', ro: 'Mou mizugi o kaimashita ka. — Iie, mada desu.', vi: 'Bạn mua đồ bơi chưa? — Chưa.' },
        { text: '{残念|ざんねん}ですね。また{今度|こんど}。', ro: 'Zannen desu ne. Mata kondo.', vi: 'Tiếc quá nhỉ. Hẹn lần sau.' },
        { text: 'チケットは{全部|ぜんぶ}で{3枚|さんまい}です。', ro: 'Chiketto wa zenbu de sanmai desu.', vi: 'Vé tất cả là 3 tấm.' },
        { text: '{週末|しゅうまつ}、{友達|ともだち}と{遊|あそ}びました。', ro: 'Shuumatsu, tomodachi to asobimashita.', vi: 'Cuối tuần tôi đi chơi với bạn.' },
        { text: '{明日|あした}の{朝|あさ}は{早|はや}いです。', ro: 'Ashita no asa wa hayai desu.', vi: 'Sáng mai (mình phải dậy) sớm.' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b6-doc-doan',
      title: 'Đọc to cả đoạn — khuôn đề Reading',
      note: 'Như đề thật: đoạn ngắn, vài từ chữ Hán không furigana. 30 giây nhìn trước, rồi đọc to một lượt không dừng; xong mới bấm hiện cách đọc để tự chấm.',
      items: [
        { text: 'リンさん、{来週|らいしゅう}の{日曜日|にちようび}、{一緒|いっしょ}に{海|うみ}へ{行|い}きませんか。{新|あたら}しい{水着|みずぎ}を{買|か}いました。{地下鉄|ちかてつ}とバスで{1時間|いちじかん}くらいです。{駅|えき}で{9時|くじ}に{会|あ}いましょう。', ro: 'Rin-san, raishuu no nichiyoubi, issho ni umi e ikimasen ka. Atarashii mizugi o kaimashita. Chikatetsu to basu de ichijikan kurai desu. Eki de kuji ni aimashou.', vi: 'Linh ơi, Chủ nhật tuần sau cùng đi biển không? Mình mới mua đồ bơi. Đi tàu điện ngầm và xe buýt khoảng 1 tiếng. Gặp nhau ở ga lúc 9 giờ nhé.' },
        { text: '「{今月|こんげつ}の{20日|はつか}に{大学|だいがく}の{体育館|たいいくかん}でバスケットボールの{試合|しあい}があります。チケットが{2枚|にまい}あります。{一緒|いっしょ}に{見|み}ませんか。」「すみません。その{日|ひ}は{約束|やくそく}があります。{残念|ざんねん}です。」', ro: 'Kongetsu no hatsuka ni daigaku no taiikukan de basukettobooru no shiai ga arimasu. Chiketto ga nimai arimasu. Issho ni mimasen ka. Sumimasen. Sono hi wa yakusoku ga arimasu. Zannen desu.', vi: '"Ngày 20 tháng này ở nhà thi đấu của trường có trận bóng rổ. Mình có 2 vé. Cùng đi xem không?" "Xin lỗi. Hôm đó mình có hẹn rồi. Tiếc quá."' },
        { text: '{私|わたし}は{季節|きせつ}で{秋|あき}がいちばん{好|す}きです。{夏|なつ}より{涼|すず}しいです。そして、{食|た}べ{物|もの}がおいしいです。{秋|あき}は{友達|ともだち}と{焼|や}き{肉|にく}を{食|た}べに{行|い}きます。', ro: 'Watashi wa kisetsu de aki ga ichiban suki desu. Natsu yori suzushii desu. Soshite, tabemono ga oishii desu. Aki wa tomodachi to yakiniku o tabe ni ikimasu.', vi: 'Trong các mùa tôi thích mùa thu nhất. Mát hơn mùa hè. Và đồ ăn ngon. Mùa thu tôi đi ăn thịt nướng với bạn.' },
        { text: '{駅|えき}の{前|まえ}に{居酒屋|いざかや}があります。{広|ひろ}いです。そして、{安|やす}いです。{食|た}べ{放題|ほうだい}のコースは{3000円|さんぜんえん}です。{駅|えき}からあまり{遠|とお}くないですから、{一緒|いっしょ}に{行|い}きましょう。', ro: 'Eki no mae ni izakaya ga arimasu. Hiroi desu. Soshite, yasui desu. Tabehoudai no koosu wa sanzen en desu. Eki kara amari tooku nai desu kara, issho ni ikimashou.', vi: 'Trước ga có một quán nhậu. Rộng. Và rẻ. Suất ăn thoả thích 3.000 yên. Không xa ga lắm nên cùng đi nhé.' },
      ],
    },
    {
      t: 'write',
      id: 'b6-viet-kanji',
      title: 'Tập viết tay 48 chữ Hán của Bài 6 — ✍ chữ nên viết trước',
      note: '12 chữ đầu là ✍ (ít nét, gặp rất nhiều) — ưu tiên viết thuộc. 36 chữ sau là 👁: tập vài lượt cho nhớ mặt chữ là đủ. Mỗi nhóm 10 chữ (bấm dải chữ để chuyển nhóm). Bấm ▶ Thứ tự nét trước khi viết; viết xong nhờ ✨ AI xem chữ.',
      chars: ['今', '来', '月', '手', '水', '食', '肉', '好', '下', '近', '早', '一', '週', '約', '束', '用', '事', '季', '節', '試', '合', '野', '球', '歌', '枚', '地', '図', '着', '飲', '物', '焼', '放', '題', '居', '酒', '屋', '映', '画', '館', '鉄', '遠', '広', '残', '念', '全', '部', '緒', '遊'],
    },
  ],
};

/* ═══════════════════════════ 5. NGHE ═══════════════════════════ */

const NGHE: Lesson = {
  id: 'b6-nghe',
  kind: 'listening',
  title: 'Luyện nghe — nhận lời hay từ chối? chọn quán nào? hẹn lúc nào?',
  goal: 'Nghe ra người được rủ nhận lời hay từ chối, nghe so sánh để biết chọn cái nào và vì sao, và ghi lại được việc – ngày – giờ – nơi hẹn.',
  minutes: 40,
  blocks: [
    {
      t: 'note',
      title: 'Cách nghe',
      items: [
        '**Nhận lời** nghe thấy: いいですね · ～ましょう · ぜひ · そうしましょう. **Từ chối** nghe thấy: ちょっと…… · すみません · {用事|ようじ}／アルバイトがありますから · また{今度|こんど}.',
        'Nghe so sánh: bắt từ **のほうが** — cái đứng trước のほうが là cái được chọn. より đứng sau cái THUA.',
        'Nghe hẹn: bắt **3 con số/từ**: ngày (～{日|か}／～{曜日|ようび}), giờ (～{時|じ}), nơi (～{駅|えき}). Người nói thường **nhắc lại** ở câu ～ですね cuối cùng — đó là thông tin chốt.',
        'Bẫy: đề xuất đầu tiên hay bị đổi (～はちょっと…… ～はどうですか). Luôn lấy thông tin **cuối cùng**.',
      ],
    },

    /* ── Bài 1: ○ hay × ── */
    { t: 'h', text: 'Bài 1 — Hai người có cùng đi không? (○ / ×)' },
    {
      t: 'p',
      text: 'Nghe 5 đoạn ngắn. Mỗi đoạn một người rủ. Người kia nhận lời (○) hay từ chối (×)?',
    },
    {
      t: 'listen',
      id: 'b6-ng-1a',
      title: '①',
      lines: [
        { who: 'アンナ', voice: 'ja-nu', text: 'パクさん、{今晩|こんばん}、{一緒|いっしょ}にラーメンを{食|た}べに{行|い}きませんか。', ro: 'Paku-san, konban, issho ni raamen o tabe ni ikimasen ka.', vi: 'Park, tối nay đi ăn ramen cùng mình không?' },
        { who: 'パク', voice: 'ja-nam', text: 'ラーメンですか。いいですね。{行|い}きましょう。', ro: 'Raamen desu ka. Ii desu ne. Ikimashou.', vi: 'Ramen à. Hay đấy. Đi thôi.' },
      ],
    },
    {
      t: 'listen',
      id: 'b6-ng-1b',
      title: '②',
      lines: [
        { who: 'ワン', voice: 'ja-nu', text: 'ダニエルさん、{週末|しゅうまつ}、カラオケに{行|い}きませんか。', ro: 'Danieru-san, shuumatsu, karaoke ni ikimasen ka.', vi: 'Daniel, cuối tuần đi karaoke không?' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'ああ、{週末|しゅうまつ}ですか。すみません。{週末|しゅうまつ}はちょっと……。{国|くに}から{友達|ともだち}が{来|き}ますから。', ro: 'Aa, shuumatsu desu ka. Sumimasen. Shuumatsu wa chotto……. Kuni kara tomodachi ga kimasu kara.', vi: 'À, cuối tuần à. Xin lỗi. Cuối tuần thì hơi… Vì có bạn từ quê sang.' },
        { who: 'ワン', voice: 'ja-nu', text: 'そうですか。{残念|ざんねん}です。', ro: 'Sou desu ka. Zannen desu.', vi: 'Vậy à. Tiếc quá.' },
      ],
    },
    {
      t: 'listen',
      id: 'b6-ng-1c',
      title: '③',
      lines: [
        { who: 'パク', voice: 'ja-nam', text: 'アンナさん、{野球|やきゅう}のチケットが{2枚|にまい}あります。{土曜日|どようび}、{一緒|いっしょ}に{見|み}に{行|い}きませんか。', ro: 'Anna-san, yakyuu no chiketto ga nimai arimasu. Doyoubi, issho ni mi ni ikimasen ka.', vi: 'Anna, mình có 2 vé bóng chày. Thứ Bảy cùng đi xem không?' },
        { who: 'アンナ', voice: 'ja-nu', text: 'わあ、{野球|やきゅう}！ぜひ{行|い}きたいです。', ro: 'Waa, yakyuu! Zehi ikitai desu.', vi: 'Oa, bóng chày! Mình rất muốn đi.' },
      ],
    },
    {
      t: 'listen',
      id: 'b6-ng-1d',
      title: '④',
      lines: [
        { who: 'ダニエル', voice: 'ja-nam', text: 'ワンさん、{来週|らいしゅう}の{水曜日|すいようび}、{一緒|いっしょ}にセールに{行|い}きませんか。', ro: 'Wan-san, raishuu no suiyoubi, issho ni seeru ni ikimasen ka.', vi: 'Wang, thứ Tư tuần sau cùng đi đợt giảm giá không?' },
        { who: 'ワン', voice: 'ja-nu', text: 'いいですね。あ、でも、{水曜日|すいようび}はアルバイトがあります。すみません。', ro: 'Ii desu ne. A, demo, suiyoubi wa arubaito ga arimasu. Sumimasen.', vi: 'Hay đấy. A, nhưng thứ Tư mình có ca làm thêm. Xin lỗi.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'そうですか。じゃ、また{今度|こんど}。', ro: 'Sou desu ka. Ja, mata kondo.', vi: 'Vậy à. Thế hẹn lần sau.' },
      ],
    },
    {
      t: 'listen',
      id: 'b6-ng-1e',
      title: '⑤',
      lines: [
        { who: 'アンナ', voice: 'ja-nu', text: 'パクさん、{今度|こんど}、うちで{一緒|いっしょ}にすき{焼|や}きを{作|つく}りませんか。', ro: 'Paku-san, kondo, uchi de issho ni sukiyaki o tsukurimasen ka.', vi: 'Park, lần tới cùng nấu sukiyaki ở nhà mình không?' },
        { who: 'パク', voice: 'ja-nam', text: 'すき{焼|や}きですか。わあ、いいですね。ぜひ！', ro: 'Sukiyaki desu ka. Waa, ii desu ne. Zehi!', vi: 'Sukiyaki à? Oa, hay quá. Nhất định rồi!' },
        { who: 'アンナ', voice: 'ja-nu', text: 'よかった。じゃ、{日曜日|にちようび}はどうですか。', ro: 'Yokatta. Ja, nichiyoubi wa dou desu ka.', vi: 'Tốt quá. Vậy Chủ Nhật được không?' },
        { who: 'パク', voice: 'ja-nam', text: 'いいですよ。', ro: 'Ii desu yo.', vi: 'Được chứ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b6-ng-1-q',
      title: 'Câu hỏi bài 1 — ○ (cùng làm) hay × (không)',
      items: [
        { q: '① ラーメン', options: ['○', '×'], correct: 0, why: 'いいですね。**{行|い}きましょう**。→ nhận lời.' },
        { q: '② カラオケ', options: ['○', '×'], correct: 1, why: '{週末|しゅうまつ}は**ちょっと**…… + lý do から → từ chối.' },
        { q: '③ {野球|やきゅう}', options: ['○', '×'], correct: 0, why: '**ぜひ{行|い}きたいです** → nhận lời.' },
        { q: '④ セール', options: ['○', '×'], correct: 1, why: 'Bẫy: mở đầu いいですね nhưng sau đó **アルバイトがあります。すみません** → từ chối; Daniel đáp また{今度|こんど}.' },
        { q: '⑤ すき{焼|や}き', options: ['○', '×'], correct: 0, why: 'いいですね。ぜひ！+ chốt ngày Chủ Nhật → cùng làm.' },
      ],
    },

    /* ── Bài 2: chọn quán ── */
    { t: 'h', text: 'Bài 2 — Cuối tuần đi ăn ở quán nào? (やってみよう)' },
    {
      t: 'table',
      caption: 'Ba quảng cáo (tự đặt)',
      head: ['Quán', 'Món', 'Giá', 'Từ ga Shinjuku'],
      rows: [
        ['ⓐ まるや', 'すし {食|た}べ{放題|ほうだい}', '{90分|きゅうじゅっぷん} {2,500円|にせんごひゃくえん}', '{歩|ある}いて{15分|じゅうごふん}'],
        ['ⓑ やまと', '{焼|や}き{肉|にく} {食|た}べ{放題|ほうだい}', '{90分|きゅうじゅっぷん} {1,800円|せんはっぴゃくえん}', '{歩|ある}いて{3分|さんぷん}'],
        ['ⓒ ほしぞら', '{焼|や}き{肉|にく} {食|た}べ{放題|ほうだい}（ケーキもあります）', '{90分|きゅうじゅっぷん} {1,500円|せんごひゃくえん}', 'バスで{20分|にじゅっぷん}'],
      ],
    },
    {
      t: 'listen',
      id: 'b6-ng-2',
      title: 'Wang và Park chọn quán',
      note: 'Nghe: đi khi nào, chọn quán nào (ⓐ ⓑ ⓒ), vì sao.',
      lines: [
        { who: 'ワン', voice: 'ja-nu', text: 'パクさん、{今週|こんしゅう}の{土曜日|どようび}、{一緒|いっしょ}に{食事|しょくじ}に{行|い}きませんか。', ro: 'Paku-san, konshuu no doyoubi, issho ni shokuji ni ikimasen ka.', vi: 'Park, thứ Bảy tuần này đi ăn cùng mình không?' },
        { who: 'パク', voice: 'ja-nam', text: 'いいですね。{何|なに}を{食|た}べますか。', ro: 'Ii desu ne. Nani o tabemasu ka.', vi: 'Hay đấy. Ăn gì?' },
        { who: 'ワン', voice: 'ja-nu', text: 'すしと{焼|や}き{肉|にく}とどちらがいいですか。', ro: 'Sushi to yakiniku to dochira ga ii desu ka.', vi: 'Sushi và thịt nướng, cậu thích cái nào hơn?' },
        { who: 'パク', voice: 'ja-nam', text: 'そうですねえ。{焼|や}き{肉|にく}のほうがいいです。', ro: 'Sou desu nee. Yakiniku no hou ga ii desu.', vi: 'Để xem nào. Thịt nướng hơn.' },
        { who: 'ワン', voice: 'ja-nu', text: '{焼|や}き{肉|にく}の{食|た}べ{放題|ほうだい}の{店|みせ}が{二|ふた}つあります。やまととほしぞらです。ほしぞらのほうが{安|やす}いですよ。ケーキもあります。', ro: 'Yakiniku no tabehoudai no mise ga futatsu arimasu. Yamato to Hoshizora desu. Hoshizora no hou ga yasui desu yo. Keeki mo arimasu.', vi: 'Có hai quán thịt nướng buffet: Yamato và Hoshizora. Hoshizora rẻ hơn đấy. Có cả bánh ngọt.' },
        { who: 'パク', voice: 'ja-nam', text: 'でも、ほしぞらは{駅|えき}から{遠|とお}いですね。やまとは{駅|えき}から{歩|ある}いて{3分|さんぷん}ですよ。', ro: 'Demo, Hoshizora wa eki kara tooi desu ne. Yamato wa eki kara aruite sanpun desu yo.', vi: 'Nhưng Hoshizora xa ga nhỉ. Yamato thì từ ga đi bộ 3 phút thôi đấy.' },
        { who: 'ワン', voice: 'ja-nu', text: 'そうですね。{土曜日|どようび}はバスが{少|すく}ないです。じゃ、やまとへ{行|い}きましょう。', ro: 'Sou desu ne. Doyoubi wa basu ga sukunai desu. Ja, Yamato e ikimashou.', vi: 'Đúng nhỉ. Thứ Bảy ít xe buýt. Vậy đi Yamato nhé.' },
        { who: 'パク', voice: 'ja-nam', text: 'はい、そうしましょう。', ro: 'Hai, sou shimashou.', vi: 'Ừ, làm vậy đi.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b6-ng-2-q',
      title: 'Câu hỏi bài 2',
      items: [
        { q: 'いつ{行|い}きますか。', options: ['{今週|こんしゅう}の{金曜日|きんようび}', '{今週|こんしゅう}の{土曜日|どようび}', '{来週|らいしゅう}の{土曜日|どようび}', '{日曜日|にちようび}'], correct: 1, why: 'ワン：**{今週|こんしゅう}の{土曜日|どようび}**、{一緒|いっしょ}に{食事|しょくじ}に{行|い}きませんか。' },
        { q: 'パクさんはすしと{焼|や}き{肉|にく}とどちらがいいですか。', options: ['すし', '{焼|や}き{肉|にく}', 'どちらも', 'ケーキ'], correct: 1, why: '**{焼|や}き{肉|にく}のほうが**いいです。' },
        { q: 'どの{店|みせ}へ{行|い}きますか。', options: ['ⓐ まるや', 'ⓑ やまと', 'ⓒ ほしぞら', 'Chưa quyết'], correct: 1, why: 'Bẫy: ほしぞら rẻ hơn nhưng xa → chốt **やまとへ{行|い}きましょう**.' },
        { q: 'どうしてその{店|みせ}へ{行|い}きますか。', options: ['{安|やす}いですから', '{駅|えき}から{近|ちか}いですから', 'ケーキがありますから', 'すしがおいしいですから'], correct: 1, why: 'Yamato {駅|えき}から{歩|ある}いて{3分|さんぷん}; ほしぞらは{遠|とお}い, thứ Bảy ít xe buýt → vì **gần ga**.' },
      ],
    },

    /* ── Bài 3: hẹn ── */
    { t: 'h', text: 'Bài 3 — Park làm gì, khi nào, ở đâu? (lịch hẹn)' },
    {
      t: 'p',
      text: 'Hôm nay là **thứ Hai ngày 10**. Park rủ Anna. Nghe và điền vào lịch: làm gì, ngày nào, mấy giờ, gặp ở đâu.',
    },
    {
      t: 'listen',
      id: 'b6-ng-3',
      title: 'Park rủ Anna đi xem phim',
      lines: [
        { who: 'パク', voice: 'ja-nam', text: 'アンナさん、もう「キングマン」を{見|み}ましたか。', ro: 'Anna-san, mou "Kinguman" o mimashita ka.', vi: 'Anna đã xem phim "Kingman" chưa?' },
        { who: 'アンナ', voice: 'ja-nu', text: 'いいえ、まだです。おもしろいですか。', ro: 'Iie, mada desu. Omoshiroi desu ka.', vi: 'Chưa. Có hay không?' },
        { who: 'パク', voice: 'ja-nam', text: 'とてもおもしろいですよ。{一緒|いっしょ}に{見|み}に{行|い}きませんか。', ro: 'Totemo omoshiroi desu yo. Issho ni mi ni ikimasen ka.', vi: 'Hay lắm đấy. Cùng đi xem không?' },
        { who: 'アンナ', voice: 'ja-nu', text: 'いいですね。いつ{行|い}きますか。', ro: 'Ii desu ne. Itsu ikimasu ka.', vi: 'Hay đấy. Khi nào đi?' },
        { who: 'パク', voice: 'ja-nam', text: '{今週|こんしゅう}の{金曜日|きんようび}はどうですか。', ro: 'Konshuu no kinyoubi wa dou desu ka.', vi: 'Thứ Sáu tuần này thì sao?' },
        { who: 'アンナ', voice: 'ja-nu', text: '{14日|じゅうよっか}ですか。すみません、{金曜日|きんようび}はちょっと……。アルバイトがありますから。{土曜日|どようび}はどうですか。', ro: 'Juuyokka desu ka. Sumimasen, kinyoubi wa chotto……. Arubaito ga arimasu kara. Doyoubi wa dou desu ka.', vi: 'Ngày 14 à. Xin lỗi, thứ Sáu thì hơi… Vì mình có ca làm thêm. Thứ Bảy thì sao?' },
        { who: 'パク', voice: 'ja-nam', text: 'いいですよ。{15日|じゅうごにち}ですね。{何時|なんじ}に{会|あ}いますか。', ro: 'Ii desu yo. Juugonichi desu ne. Nanji ni aimasu ka.', vi: 'Được. Ngày 15 nhé. Mấy giờ gặp?' },
        { who: 'アンナ', voice: 'ja-nu', text: '{映画|えいが}は{1時|いちじ}からですね。{12時半|じゅうにじはん}はどうですか。', ro: 'Eiga wa ichiji kara desu ne. Juuniji han wa dou desu ka.', vi: 'Phim chiếu từ 1 giờ nhỉ. 12 rưỡi thì sao?' },
        { who: 'パク', voice: 'ja-nam', text: '{12時半|じゅうにじはん}ですね。どこで{会|あ}いますか。{渋谷駅|しぶやえき}はどうですか。', ro: 'Juuniji han desu ne. Doko de aimasu ka. Shibuya eki wa dou desu ka.', vi: '12 rưỡi nhé. Gặp ở đâu? Ga Shibuya thì sao?' },
        { who: 'アンナ', voice: 'ja-nu', text: 'はい、わかりました。じゃ、{土曜日|どようび}の{12時半|じゅうにじはん}に{渋谷駅|しぶやえき}で。', ro: 'Hai, wakarimashita. Ja, doyoubi no juuniji han ni Shibuya eki de.', vi: 'Ừ, mình hiểu rồi. Vậy 12 rưỡi thứ Bảy ở ga Shibuya nhé.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b6-ng-3-q',
      title: 'Điền vào lịch hẹn',
      kind: 'fill',
      items: [
        { q: '{何|なに}をしますか。(Làm gì? — viết tiếng Việt hoặc tiếng Nhật)', answers: ['xem phim', 'đi xem phim', 'xem phim Kingman', '映画を見ます', 'えいがをみます', '映画', 'えいが', 'キングマンを見ます'] },
        { q: '{何日|なんにち}ですか。(ngày mấy — chỉ viết số)', answers: ['15', '15日', 'じゅうごにち'], hint: 'Anna đổi từ thứ Sáu sang thứ Bảy' },
        { q: '{何曜日|なんようび}ですか。', answers: ['土曜日', 'どようび', 'thứ Bảy', 'thứ bảy', 'thu bay', 'doyoubi'] },
        { q: '{何時|なんじ}に{会|あ}いますか。(viết dạng 12:30)', answers: ['12:30', '12時半', 'じゅうにじはん', '12時30分', '12h30'] },
        { q: 'どこで{会|あ}いますか。', answers: ['渋谷駅', 'しぶやえき', 'ga Shibuya', 'Shibuya', 'shibuya eki', '渋谷'] },
      ],
    },

    /* ── Bài 4: hội thoại dài (もう一度聞こう) ── */
    { t: 'h', text: 'Bài 4 — Hội thoại dài: lễ hội pháo hoa (もう{一度|いちど}{聞|き}こう)' },
    {
      t: 'listen',
      id: 'b6-ng-4',
      title: 'Daniel rủ Wang đi xem pháo hoa',
      note: 'Nghe cả bài 2 lần rồi trả lời 6 câu.',
      lines: [
        { who: 'ダニエル', voice: 'ja-nam', text: 'ワンさん。', ro: 'Wan-san.', vi: 'Wang ơi.' },
        { who: 'ワン', voice: 'ja-nu', text: 'はい、{何|なん}ですか。', ro: 'Hai, nan desu ka.', vi: 'Ơi, gì vậy?' },
        { who: 'ダニエル', voice: 'ja-nam', text: '{今度|こんど}の{日曜日|にちようび}、{時間|じかん}がありますか。', ro: 'Kondo no nichiyoubi, jikan ga arimasu ka.', vi: 'Chủ Nhật này bạn có rảnh không?' },
        { who: 'ワン', voice: 'ja-nu', text: '{日曜日|にちようび}ですか。はい、ありますよ。', ro: 'Nichiyoubi desu ka. Hai, arimasu yo.', vi: 'Chủ Nhật à. Có, mình rảnh.' },
        { who: 'ダニエル', voice: 'ja-nam', text: '{横浜|よこはま}で{花火|はなび}{大会|たいかい}があります。{一緒|いっしょ}に{見|み}に{行|い}きませんか。', ro: 'Yokohama de hanabi taikai ga arimasu. Issho ni mi ni ikimasen ka.', vi: 'Ở Yokohama có lễ hội pháo hoa. Cùng đi xem không?' },
        { who: 'ワン', voice: 'ja-nu', text: 'わあ、{花火|はなび}！ぜひ{行|い}きたいです。{何時|なんじ}からですか。', ro: 'Waa, hanabi! Zehi ikitai desu. Nanji kara desu ka.', vi: 'Oa, pháo hoa! Mình rất muốn đi. Từ mấy giờ?' },
        { who: 'ダニエル', voice: 'ja-nam', text: '{7時|しちじ}から{8時半|はちじはん}までですよ。', ro: 'Shichiji kara hachiji han made desu yo.', vi: 'Từ 7 giờ đến 8 rưỡi đấy.' },
        { who: 'ワン', voice: 'ja-nu', text: 'じゃ、{一緒|いっしょ}に{晩|ばん}ご{飯|はん}も{食|た}べませんか。', ro: 'Ja, issho ni bangohan mo tabemasen ka.', vi: 'Vậy cùng ăn tối luôn không?' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'いいですね。ワンさんは{日本|にほん}の{食|た}べ{物|もの}で{何|なに}がいちばん{好|す}きですか。', ro: 'Ii desu ne. Wan-san wa Nihon no tabemono de nani ga ichiban suki desu ka.', vi: 'Hay đấy. Wang thích món Nhật nào nhất?' },
        { who: 'ワン', voice: 'ja-nu', text: 'ラーメンがいちばん{好|す}きです。', ro: 'Raamen ga ichiban suki desu.', vi: 'Mình thích ramen nhất.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'そうですか。{横浜|よこはま}の{駅|えき}においしいラーメンの{店|みせ}がありますよ。そこへ{行|い}きましょう。', ro: 'Sou desu ka. Yokohama no eki ni oishii raamen no mise ga arimasu yo. Soko e ikimashou.', vi: 'Vậy à. Ở ga Yokohama có quán ramen ngon đấy. Đi chỗ đó nhé.' },
        { who: 'ワン', voice: 'ja-nu', text: 'はい。{何時|なんじ}に{会|あ}いますか。', ro: 'Hai. Nanji ni aimasu ka.', vi: 'Ừ. Mấy giờ gặp?' },
        { who: 'ダニエル', voice: 'ja-nam', text: '{5時|ごじ}はどうですか。{5時|ごじ}に{横浜駅|よこはまえき}で。', ro: 'Goji wa dou desu ka. Goji ni Yokohama eki de.', vi: '5 giờ thì sao? 5 giờ ở ga Yokohama.' },
        { who: 'ワン', voice: 'ja-nu', text: '{5時|ごじ}ですね。あ、ダニエルさん、{電車|でんしゃ}とバスとどちらが{早|はや}いですか。', ro: 'Goji desu ne. A, Danieru-san, densha to basu to dochira ga hayai desu ka.', vi: '5 giờ nhé. À Daniel, tàu điện và xe buýt, cái nào nhanh hơn?' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'そうですねえ。{電車|でんしゃ}のほうが{早|はや}いですよ。バスより{20分|にじゅっぷん}{早|はや}いです。', ro: 'Sou desu nee. Densha no hou ga hayai desu yo. Basu yori nijuppun hayai desu.', vi: 'Để xem. Tàu điện nhanh hơn đấy. Nhanh hơn xe buýt 20 phút.' },
        { who: 'ワン', voice: 'ja-nu', text: 'じゃ、{電車|でんしゃ}で{行|い}きます。{花火|はなび}、{楽|たの}しみです。', ro: 'Ja, densha de ikimasu. Hanabi, tanoshimi desu.', vi: 'Vậy mình đi tàu điện. Mong xem pháo hoa quá.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b6-ng-4-q',
      title: 'Câu hỏi bài 4',
      items: [
        { q: '{花火|はなび}{大会|たいかい}はどこでありますか。', options: ['{東京|とうきょう}', '{横浜|よこはま}', '{上野|うえの}', '{箱根|はこね}'], correct: 1, why: '**{横浜|よこはま}で**{花火|はなび}{大会|たいかい}があります。' },
        { q: '{花火|はなび}は{何時|なんじ}から{何時|なんじ}までですか。', options: ['{5時|ごじ}〜{7時|しちじ}', '{7時|しちじ}〜{8時|はちじ}', '{7時|しちじ}〜{8時半|はちじはん}', '{8時|はちじ}〜{9時半|くじはん}'], correct: 2, why: '**{7時|しちじ}から{8時半|はちじはん}まで**ですよ。' },
        { q: '{2人|ふたり}は{一緒|いっしょ}に{何|なに}を{食|た}べますか。', options: ['お{好|この}み{焼|や}き', 'ラーメン', 'すし', '{焼|や}き{肉|にく}'], correct: 1, why: 'ワンさんはラーメンがいちばん{好|す}き → おいしいラーメンの{店|みせ}へ{行|い}きましょう.' },
        { q: '{何時|なんじ}に、どこで{会|あ}いますか。', options: ['{5時|ごじ}・{横浜駅|よこはまえき}', '{7時|しちじ}・{横浜駅|よこはまえき}', '{5時|ごじ}・{東京駅|とうきょうえき}', '{8時半|はちじはん}・ラーメンの{店|みせ}'], correct: 0, why: '{5時|ごじ}に{横浜駅|よこはまえき}で — ワン nhắc lại: {5時|ごじ}ですね.' },
        { q: '{電車|でんしゃ}とバスとどちらが{早|はや}いですか。', options: ['バス', '{電車|でんしゃ}', 'どちらも', 'Không nói'], correct: 1, why: '**{電車|でんしゃ}のほうが**{早|はや}いですよ。バスより{20分|にじゅっぷん}{早|はや}いです。' },
        { q: 'ワンさんは{何|なに}で{行|い}きますか。', options: ['バスで', '{電車|でんしゃ}で', '{地下鉄|ちかてつ}で', '{歩|ある}いて'], correct: 1, why: 'じゃ、**{電車|でんしゃ}で**{行|い}きます。' },
      ],
    },

    /* ── Bài 5: nghe so sánh ── */
    { t: 'h', text: 'Bài 5 — Nghe câu so sánh: cái nào hơn?' },
    {
      t: 'listen',
      id: 'b6-ng-5',
      title: '5 câu so sánh',
      note: 'Mỗi câu nghe xong, trả lời: cái nào được nói là "hơn" / "nhất".',
      lines: [
        { who: '①', voice: 'ja-nu', text: 'さくら{公園|こうえん}はみどり{公園|こうえん}より{広|ひろ}いです。', ro: 'Sakura kouen wa Midori kouen yori hiroi desu.', vi: 'Công viên Sakura rộng hơn công viên Midori.' },
        { who: '②', voice: 'ja-nam', text: 'Aコースより、Bコースのほうが{安|やす}いですよ。', ro: 'Ee koosu yori, bii koosu no hou ga yasui desu yo.', vi: 'Set B rẻ hơn set A đấy.' },
        { who: '③', voice: 'ja-nu', text: '{季節|きせつ}で{秋|あき}がいちばん{好|す}きです。', ro: 'Kisetsu de aki ga ichiban suki desu.', vi: 'Trong các mùa tôi thích mùa thu nhất.' },
        { who: '④', voice: 'ja-nam', text: '{地下鉄|ちかてつ}とバスとどちらが{早|はや}いですか。——バスのほうが{早|はや}いです。', ro: 'Chikatetsu to basu to dochira ga hayai desu ka. — Basu no hou ga hayai desu.', vi: 'Tàu điện ngầm và xe buýt, cái nào nhanh hơn? — Xe buýt nhanh hơn.' },
        { who: '⑤', voice: 'ja-nu', text: '{映画館|えいがかん}は{駅|えき}から{遠|とお}いです。{居酒屋|いざかや}のほうが{近|ちか}いです。', ro: 'Eigakan wa eki kara tooi desu. Izakaya no hou ga chikai desu.', vi: 'Rạp chiếu phim xa ga. Quán nhậu gần hơn.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b6-ng-5-q',
      title: 'Câu hỏi bài 5',
      items: [
        { q: '① Công viên nào rộng hơn?', options: ['さくら{公園|こうえん}', 'みどり{公園|こうえん}', 'Bằng nhau'], correct: 0, why: 'N1 は N2 **より** A: さくら{公園|こうえん} là chủ đề → さくら rộng hơn. より gắn với cái thua (みどり).' },
        { q: '② Set nào rẻ hơn?', options: ['Aコース', 'Bコース', 'Bằng nhau'], correct: 1, why: 'Bコース**のほうが**{安|やす}い.' },
        { q: '③ Người nói thích mùa nào nhất?', options: ['{春|はる}', '{夏|なつ}', '{秋|あき}', '{冬|ふゆ}'], correct: 2, why: '**{秋|あき}がいちばん**{好|す}きです.' },
        { q: '④ Cái nào nhanh hơn?', options: ['{地下鉄|ちかてつ}', 'バス', 'Bằng nhau'], correct: 1, why: 'Bẫy: {地下鉄|ちかてつ} được nói trước, nhưng đáp **バスのほうが**{早|はや}いです.' },
        { q: '⑤ Chỗ nào gần ga hơn?', options: ['{映画館|えいがかん}', '{居酒屋|いざかや}', 'Không nói'], correct: 1, why: '{映画館|えいがかん}は{遠|とお}い; **{居酒屋|いざかや}のほうが{近|ちか}い**.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 6. NÓI (dạng thi) ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b6-noi',
  kind: 'speaking',
  title: 'Luyện nói — câu hỏi thi về rủ, sở thích, so sánh, hẹn',
  goal: 'Trả lời trọn câu, đúng trợ từ các câu hỏi thi liên quan Bài 6 (thích gì nhất, cái nào hơn, đã … chưa, có rảnh không, lời rủ), nhìn tranh poster/bảng giá mà trả lời, đóng vai rủ – từ chối – hẹn, và đọc to trôi chảy.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Đề thi nói JPD (theo "Hướng dẫn ôn thi" của bộ môn) — Bài 6 nằm ở đâu',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 6 xuất hiện ở đâu'],
      rows: [
        ['Reading', '40', 'Chuẩn bị 30 giây, đọc to đoạn ~100–110 chữ (4 từ chữ Hán gạch chân, 4 từ katakana, 70–80 chữ hiragana).', 'Đoạn kể có hẹn, có sự kiện, rủ bạn: {約束|やくそく}があります · ～ませんか.'],
        ['Talking — có tranh', '3 × 15', 'Nhìn tranh (poster, vé, bảng giá hai quán…) trả lời 3 câu.', 'どこで～がありますか · どちらが{安|やす}いですか · チケットが{何枚|なんまい}ありますか'],
        ['Talking — không tranh', '1 × 10', 'Trả lời 1 câu về bản thân.', '～で{何|なに}がいちばん{好|す}きですか · AとBとどちらが{好|す}きですか · {週末|しゅうまつ}、どこへ{行|い}きますか'],
        ['Presenting', '5', 'Chào khi vào và khi ra.', 'しつれいします／ありがとうございました。'],
      ],
    },
    {
      t: 'note',
      title: 'Luật chấm cần nhớ (trừ điểm thật)',
      items: [
        '**Sai trợ từ: −2 điểm** mỗi lỗi. Bài 6 soát kỹ: **で**いちばん, **が**いちばん, N1 **と** N2 **と** どちら**が**, **の**ほう**が**, ～**が**あります, (nơi)**で**(sự kiện)があります.',
        '**Câu có/không quên はい／いいえ**: bị trừ (tối đa 5 điểm). 「もう～ましたか」 → **はい、～ました／いいえ、まだです**.',
        '**Sai nội dung = mất trọn câu**: hỏi どちら mà trả lời cả hai thứ không chọn, hỏi いちばん mà trả lời bằng のほうが, hỏi {近|ちか}い mà đáp {安|やす}い.',
        'Được xin nhắc lại câu hỏi **tối đa 2 lần, không bị trừ**: **もう{一度|いちど}お{願|ねが}いします** · **ゆっくりお{願|ねが}いします**.',
        'Luôn trả lời **câu đầy đủ**, lặp lại tính từ / động từ của câu hỏi, thêm một lý do ～から nếu kịp.',
      ],
    },

    /* ── Không tranh ① sở thích nhất ── */
    { t: 'h', text: 'Câu hỏi không tranh ① — Thích gì NHẤT (いちばん)' },
    {
      t: 'p',
      text: 'Các câu dưới đây khớp ngân hàng câu hỏi thi (「{何|なに}が{好|す}きですか」「ベトナム{料理|りょうり}で{何|なに}が{好|す}きですか」「{日本|にほん}の{料理|りょうり}はどうですか」 trong bộ câu hỏi về bản thân) và mở rộng bằng mẫu いちばん của Bài 6. Câu trả lời là **mẫu** — thay bằng sở thích thật của bạn nhưng **giữ khung câu**.',
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: いちばん',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{日本|にほん}の{食|た}べ{物|もの}で{何|なに}がいちばん{好|す}きですか。', ro: 'Nihon no tabemono de nani ga ichiban suki desu ka.', vi: 'Trong đồ ăn Nhật bạn thích gì nhất?' },
        { who: 'Bạn', role: 'candidate', text: '{日本|にほん}の{食|た}べ{物|もの}でおすしがいちばん{好|す}きです。', ro: 'Nihon no tabemono de osushi ga ichiban suki desu.', vi: 'Trong đồ ăn Nhật tôi thích sushi nhất.' },
        { who: 'Giám thị', role: 'examiner', text: 'ベトナム{料理|りょうり}で{何|なに}が{好|す}きですか。', ro: 'Betonamu ryouri de nani ga suki desu ka.', vi: 'Trong các món Việt bạn thích món gì?' },
        { who: 'Bạn', role: 'candidate', text: 'フォーがいちばん{好|す}きです。とてもおいしいですよ。', ro: 'Foo ga ichiban suki desu. Totemo oishii desu yo.', vi: 'Tôi thích phở nhất. Rất ngon đấy ạ.' },
        { who: 'Giám thị', role: 'examiner', text: 'スポーツで{何|なに}がいちばん{好|す}きですか。', ro: 'Supootsu de nani ga ichiban suki desu ka.', vi: 'Trong các môn thể thao bạn thích môn nào nhất?' },
        { who: 'Bạn', role: 'candidate', text: 'サッカーがいちばん{好|す}きです。', ro: 'Sakkaa ga ichiban suki desu.', vi: 'Tôi thích bóng đá nhất.' },
        { who: 'Giám thị', role: 'examiner', text: '{季節|きせつ}でいつがいちばん{好|す}きですか。', ro: 'Kisetsu de itsu ga ichiban suki desu ka.', vi: 'Bạn thích mùa nào nhất?' },
        { who: 'Bạn', role: 'candidate', text: '{秋|あき}がいちばん{好|す}きです。{秋|あき}は{涼|すず}しいですから。', ro: 'Aki ga ichiban suki desu. Aki wa suzushii desu kara.', vi: 'Tôi thích mùa thu nhất. Vì mùa thu mát mẻ.' },
        { who: 'Giám thị', role: 'examiner', text: 'ベトナムでどこがいちばんきれいですか。', ro: 'Betonamu de doko ga ichiban kirei desu ka.', vi: 'Ở Việt Nam chỗ nào đẹp nhất?' },
        { who: 'Bạn', role: 'candidate', text: 'ハロンがいちばんきれいです。', ro: 'Haron ga ichiban kirei desu.', vi: 'Hạ Long đẹp nhất. (hoặc: ダナンがいちばんきれいです。)' },
        { who: 'Giám thị', role: 'examiner', text: '{日本|にほん}の{料理|りょうり}はどうですか。', ro: 'Nihon no ryouri wa dou desu ka.', vi: 'Bạn thấy món Nhật thế nào? (câu hỏi CẢM NHẬN — Bài 4)' },
        { who: 'Bạn', role: 'candidate', text: 'とてもおいしいです。すき{焼|や}きがいちばんおいしいです。', ro: 'Totemo oishii desu. Sukiyaki ga ichiban oishii desu.', vi: 'Rất ngon ạ. Sukiyaki là ngon nhất.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở câu いちばん',
      items: [
        'Nghe **で + {何|なに}が + いちばん** → đáp **N が いちばん A です**. Không đáp cụt ~~おすしです~~ (mất điểm ngữ pháp) và không đổi sang ~~おすしのほうが～~~ (のほうが chỉ dùng cho 2 lựa chọn).',
        'Giám thị hỏi 「{何|なに}が{好|す}きですか」 không có いちばん → đáp bình thường: ラーメンが{好|す}きです. Muốn ghi điểm thêm: ラーメンが**いちばん**{好|す}きです.',
        '「{日本|にほん}の{料理|りょうり}はどうですか」 là hỏi **cảm nhận** → おいしいです, không phải ~~いいですね。そうしましょう~~ (đó là đáp đề xuất).',
      ],
    },

    /* ── Không tranh ② chọn 1 trong 2 ── */
    { t: 'h', text: 'Câu hỏi không tranh ② — Chọn 1 trong 2 (どちら)' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: どちら → のほうが',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{夏|なつ}と{冬|ふゆ}とどちらが{好|す}きですか。', ro: 'Natsu to fuyu to dochira ga suki desu ka.', vi: 'Mùa hè và mùa đông, bạn thích mùa nào hơn?' },
        { who: 'Bạn', role: 'candidate', text: '{冬|ふゆ}のほうが{好|す}きです。{夏|なつ}はとても{暑|あつ}いですから。', ro: 'Fuyu no hou ga suki desu. Natsu wa totemo atsui desu kara.', vi: 'Tôi thích mùa đông hơn. Vì mùa hè rất nóng.' },
        { who: 'Giám thị', role: 'examiner', text: 'コーヒーとお{茶|ちゃ}とどちらがいいですか。', ro: 'Koohii to ocha to dochira ga ii desu ka.', vi: 'Cà phê và trà, bạn dùng gì?' },
        { who: 'Bạn', role: 'candidate', text: 'コーヒーのほうがいいです。', ro: 'Koohii no hou ga ii desu.', vi: 'Cho tôi cà phê.' },
        { who: 'Giám thị', role: 'examiner', text: 'ハノイとホーチミンとどちらが{暑|あつ}いですか。', ro: 'Hanoi to Hoochimin to dochira ga atsui desu ka.', vi: 'Hà Nội và TP.HCM, nơi nào nóng hơn?' },
        { who: 'Bạn', role: 'candidate', text: 'ホーチミンのほうが{暑|あつ}いです。ホーチミンはハノイより{暑|あつ}いです。', ro: 'Hoochimin no hou ga atsui desu. Hoochimin wa Hanoi yori atsui desu.', vi: 'TP.HCM nóng hơn. TP.HCM nóng hơn Hà Nội.' },
        { who: 'Giám thị', role: 'examiner', text: 'バスとバイクとどちらが{早|はや}いですか。', ro: 'Basu to baiku to dochira ga hayai desu ka.', vi: 'Xe buýt và xe máy, cái nào nhanh hơn?' },
        { who: 'Bạn', role: 'candidate', text: 'バイクのほうが{早|はや}いです。', ro: 'Baiku no hou ga hayai desu.', vi: 'Xe máy nhanh hơn.' },
        { who: 'Giám thị', role: 'examiner', text: '{映画|えいが}と{音楽|おんがく}とどちらが{好|す}きですか。', ro: 'Eiga to ongaku to dochira ga suki desu ka.', vi: 'Phim và âm nhạc, bạn thích cái nào hơn?' },
        { who: 'Bạn', role: 'candidate', text: 'どちらも{好|す}きです。', ro: 'Dochira mo suki desu.', vi: 'Tôi thích cả hai.' },
      ],
    },

    /* ── Không tranh ③ lịch, rủ, đã chưa ── */
    { t: 'h', text: 'Câu hỏi không tranh ③ — Cuối tuần, có rảnh không, đã … chưa, lời rủ' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: kế hoạch và lời rủ',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{週末|しゅうまつ}、どこへ{行|い}きますか。', ro: 'Shuumatsu, doko e ikimasu ka.', vi: 'Cuối tuần bạn đi đâu? (câu trong bộ câu hỏi về bản thân)' },
        { who: 'Bạn', role: 'candidate', text: '{週末|しゅうまつ}、{友達|ともだち}とカラオケに{行|い}きます。', ro: 'Shuumatsu, tomodachi to karaoke ni ikimasu.', vi: 'Cuối tuần tôi đi karaoke với bạn.' },
        { who: 'Giám thị', role: 'examiner', text: '{今晩|こんばん}、{時間|じかん}がありますか。', ro: 'Konban, jikan ga arimasu ka.', vi: 'Tối nay bạn có rảnh không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、ありません。{今晩|こんばん}はアルバイトがあります。', ro: 'Iie, arimasen. Konban wa arubaito ga arimasu.', vi: 'Không ạ. Tối nay tôi có ca làm thêm.' },
        { who: 'Giám thị', role: 'examiner', text: '{明日|あした}、テストがありますか。', ro: 'Ashita, tesuto ga arimasu ka.', vi: 'Ngày mai bạn có bài kiểm tra không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、あります。{日本語|にほんご}のテストがあります。', ro: 'Hai, arimasu. Nihongo no tesuto ga arimasu.', vi: 'Có ạ. Có bài kiểm tra tiếng Nhật.' },
        { who: 'Giám thị', role: 'examiner', text: 'もう{昼|ひる}ご{飯|はん}を{食|た}べましたか。', ro: 'Mou hirugohan o tabemashita ka.', vi: 'Bạn ăn trưa chưa?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{食|た}べました。／いいえ、まだです。', ro: 'Hai, tabemashita. / Iie, mada desu.', vi: 'Rồi ạ. / Chưa ạ.' },
        { who: 'Giám thị', role: 'examiner', text: 'もう{日本|にほん}へ{行|い}きましたか。', ro: 'Mou Nihon e ikimashita ka.', vi: 'Bạn đã đi Nhật chưa?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、まだです。でも、ぜひ{行|い}きたいです。', ro: 'Iie, mada desu. Demo, zehi ikitai desu.', vi: 'Chưa ạ. Nhưng tôi rất muốn đi.' },
        { who: 'Giám thị', role: 'examiner', text: '{今度|こんど}の{日曜日|にちようび}、{一緒|いっしょ}に{映画|えいが}を{見|み}に{行|い}きませんか。', ro: 'Kondo no nichiyoubi, issho ni eiga o mi ni ikimasen ka.', vi: 'Chủ Nhật tới cùng đi xem phim không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいですね。{行|い}きましょう。', ro: 'Ii desu ne. Ikimashou.', vi: 'Hay quá ạ. Đi ạ.' },
        { who: 'Giám thị', role: 'examiner', text: '{今晩|こんばん}、{一緒|いっしょ}にご{飯|はん}を{食|た}べませんか。', ro: 'Konban, issho ni gohan o tabemasen ka.', vi: 'Tối nay cùng đi ăn không? (luyện từ chối)' },
        { who: 'Bạn', role: 'candidate', text: 'すみません。{今晩|こんばん}はちょっと……。{用事|ようじ}がありますから。', ro: 'Sumimasen. Konban wa chotto……. Youji ga arimasu kara.', vi: 'Xin lỗi ạ. Tối nay thì hơi… Vì em có việc bận.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở nhóm này',
      items: [
        '「{時間|じかん}がありますか」 → はい／いいえ + **あります／ありません**. Đừng đáp ~~はい、{時間|じかん}です~~.',
        '「もう～ましたか」 → chưa thì **いいえ、まだです**. ~~いいえ、{食|た}べません~~ (không ăn) là sai nghĩa.',
        'Giám thị giả vờ rủ → đáp như với bạn bè nhưng **lịch sự**: いいですね。{行|い}きましょう (nhận) hoặc すみません。～はちょっと…… (từ chối). Cả hai đều đủ điểm — chọn cái bạn nói trôi hơn.',
      ],
    },

    /* ── Có tranh ── */
    { t: 'h', text: 'Câu hỏi có tranh — poster sự kiện, vé, bảng so sánh hai quán' },
    {
      t: 'p',
      text: 'Tranh thi được viết lại thành bảng (không dùng ảnh). Với tranh Bài 6, giám thị hay hỏi: **これは{何|なん}ですか · どこで／いつ～がありますか · {何時|なんじ}からですか · チケットが{何枚|なんまい}ありますか · どちらが～ですか · どこがいちばん～ですか**.',
    },
    {
      t: 'table',
      caption: 'Tranh 1 — poster',
      head: ['Sự kiện', 'Nơi', 'Ngày', 'Giờ'],
      rows: [
        ['{花火|はなび}{大会|たいかい}', '{横浜|よこはま}', '{7月|しちがつ}{28日|にじゅうはちにち}（{土曜日|どようび}）', '{6時|ろくじ}〜{8時|はちじ}'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 1',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'これは{何|なん}ですか。', ro: 'Kore wa nan desu ka.', vi: 'Đây là gì?' },
        { who: 'Bạn', role: 'candidate', text: 'それは{花火|はなび}{大会|たいかい}のポスターです。', ro: 'Sore wa hanabi taikai no posutaa desu.', vi: 'Đó là poster lễ hội pháo hoa.' },
        { who: 'Giám thị', role: 'examiner', text: 'どこで{花火|はなび}{大会|たいかい}がありますか。', ro: 'Doko de hanabi taikai ga arimasu ka.', vi: 'Lễ hội pháo hoa tổ chức ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: '{横浜|よこはま}で{花火|はなび}{大会|たいかい}があります。', ro: 'Yokohama de hanabi taikai ga arimasu.', vi: 'Lễ hội pháo hoa tổ chức ở Yokohama.' },
        { who: 'Giám thị', role: 'examiner', text: 'いつですか。{何時|なんじ}から{何時|なんじ}までですか。', ro: 'Itsu desu ka. Nanji kara nanji made desu ka.', vi: 'Khi nào? Từ mấy giờ đến mấy giờ?' },
        { who: 'Bạn', role: 'candidate', text: '{7月|しちがつ}{28日|にじゅうはちにち}の{土曜日|どようび}です。{6時|ろくじ}から{8時|はちじ}までです。', ro: 'Shichigatsu nijuuhachinichi no doyoubi desu. Rokuji kara hachiji made desu.', vi: 'Thứ Bảy ngày 28 tháng 7. Từ 6 giờ đến 8 giờ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh 2 — bàn tay cầm vé',
      head: ['Vé', 'Số tấm', 'Ngày / giờ'],
      rows: [['ピアノコンサート', '3{枚|まい}', '{2月|にがつ}{12日|じゅうににち} {7時|しちじ}〜']],
    },
    {
      t: 'dialogue',
      title: 'Tranh 2',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{何|なん}のチケットですか。', ro: 'Nan no chiketto desu ka.', vi: 'Vé gì vậy?' },
        { who: 'Bạn', role: 'candidate', text: 'ピアノのコンサートのチケットです。', ro: 'Piano no konsaato no chiketto desu.', vi: 'Vé buổi hoà nhạc piano.' },
        { who: 'Giám thị', role: 'examiner', text: 'チケットが{何枚|なんまい}ありますか。', ro: 'Chiketto ga nanmai arimasu ka.', vi: 'Có mấy vé?' },
        { who: 'Bạn', role: 'candidate', text: 'チケットが{3枚|さんまい}あります。', ro: 'Chiketto ga sanmai arimasu.', vi: 'Có 3 vé.' },
        { who: 'Giám thị', role: 'examiner', text: 'コンサートは{何時|なんじ}からですか。', ro: 'Konsaato wa nanji kara desu ka.', vi: 'Buổi hoà nhạc bắt đầu từ mấy giờ?' },
        { who: 'Bạn', role: 'candidate', text: '{7時|しちじ}からです。', ro: 'Shichiji kara desu.', vi: 'Từ 7 giờ.' },
        { who: 'Giám thị', role: 'examiner', text: 'じゃ、{一緒|いっしょ}に{行|い}きませんか。', ro: 'Ja, issho ni ikimasen ka.', vi: 'Vậy cùng đi không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいですね。{行|い}きましょう。', ro: 'Ii desu ne. Ikimashou.', vi: 'Hay quá. Đi ạ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh 3 — hai quán ăn',
      head: ['', 'さくら', 'もみじ'],
      rows: [
        ['Món', 'すし {食|た}べ{放題|ほうだい}', 'すし {食|た}べ{放題|ほうだい}'],
        ['Giá', '{2時間|にじかん} {5,000円|ごせんえん}', '{2時間|にじかん} {3,000円|さんぜんえん}'],
        ['Từ ga', '{歩|ある}いて{5分|ごふん}', '{歩|ある}いて{15分|じゅうごふん}'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 3',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'さくらともみじとどちらが{安|やす}いですか。', ro: 'Sakura to Momiji to dochira ga yasui desu ka.', vi: 'Sakura và Momiji, quán nào rẻ hơn?' },
        { who: 'Bạn', role: 'candidate', text: 'もみじのほうが{安|やす}いです。', ro: 'Momiji no hou ga yasui desu.', vi: 'Momiji rẻ hơn.' },
        { who: 'Giám thị', role: 'examiner', text: 'どちらが{駅|えき}から{近|ちか}いですか。', ro: 'Dochira ga eki kara chikai desu ka.', vi: 'Quán nào gần ga hơn?' },
        { who: 'Bạn', role: 'candidate', text: 'さくらのほうが{近|ちか}いです。{駅|えき}から{歩|ある}いて{5分|ごふん}です。', ro: 'Sakura no hou ga chikai desu. Eki kara aruite gofun desu.', vi: 'Sakura gần hơn. Từ ga đi bộ 5 phút.' },
        { who: 'Giám thị', role: 'examiner', text: 'あなたはどちらへ{行|い}きますか。どうしてですか。', ro: 'Anata wa dochira e ikimasu ka. Doushite desu ka.', vi: 'Bạn sẽ đi quán nào? Tại sao?' },
        { who: 'Bạn', role: 'candidate', text: 'もみじへ{行|い}きます。もみじはさくらより{安|やす}いですから。', ro: 'Momiji e ikimasu. Momiji wa Sakura yori yasui desu kara.', vi: 'Tôi đi Momiji. Vì Momiji rẻ hơn Sakura.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở câu có tranh',
      items: [
        'Giám thị cầm tranh nói **これ** → bạn đáp **それ** (Bài 2).',
        '"どこで～がありますか" hỏi nơi SỰ KIỆN → **{横浜|よこはま}で**あります (không phải ~~{横浜|よこはま}に~~).',
        'Đọc số vé bằng **～{枚|まい}**: {3枚|さんまい}. Đọc số tiền: {5,000円|ごせんえん}, {3,000円|さんぜんえん} (さん**ぜん**).',
        '"どうしてですか" → nhắc lại lựa chọn + **～から** (ポイント 44, 47). Câu "N1 は N2 より A ですから" ăn trọn điểm.',
      ],
    },

    /* ── Đóng vai ── */
    { t: 'h', text: 'Đóng vai — rủ, chọn, hẹn (luyện hai người)' },
    {
      t: 'dialogue',
      title: 'Vai 1 — Rủ đi xem trận bóng, bạn từ chối rồi hẹn ngày khác',
      lines: [
        { who: 'A', role: 'a', text: 'Bさん、サッカーが{好|す}きですか。', ro: 'B-san, sakkaa ga suki desu ka.', vi: 'B có thích bóng đá không?' },
        { who: 'B', role: 'b', text: 'はい、とても{好|す}きです。', ro: 'Hai, totemo suki desu.', vi: 'Có, mình rất thích.' },
        { who: 'A', role: 'a', text: '{今週|こんしゅう}の{土曜日|どようび}、{東京|とうきょう}でサッカーの{試合|しあい}があります。チケットが{2枚|にまい}あります。{一緒|いっしょ}に{見|み}に{行|い}きませんか。', ro: 'Konshuu no doyoubi, Toukyou de sakkaa no shiai ga arimasu. Chiketto ga nimai arimasu. Issho ni mi ni ikimasen ka.', vi: 'Thứ Bảy tuần này có trận bóng ở Tokyo. Mình có 2 vé. Cùng đi xem không?' },
        { who: 'B', role: 'b', text: 'ああ、{土曜日|どようび}ですか。すみません。{土曜日|どようび}はちょっと……。アルバイトがありますから。', ro: 'Aa, doyoubi desu ka. Sumimasen. Doyoubi wa chotto……. Arubaito ga arimasu kara.', vi: 'À, thứ Bảy à. Xin lỗi. Thứ Bảy thì hơi… Vì có ca làm thêm.' },
        { who: 'A', role: 'a', text: 'そうですか。{残念|ざんねん}です。{来週|らいしゅう}も{試合|しあい}がありますよ。{来週|らいしゅう}の{日曜日|にちようび}はどうですか。', ro: 'Sou desu ka. Zannen desu. Raishuu mo shiai ga arimasu yo. Raishuu no nichiyoubi wa dou desu ka.', vi: 'Vậy à. Tiếc quá. Tuần sau cũng có trận đấy. Chủ Nhật tuần sau thì sao?' },
        { who: 'B', role: 'b', text: '{日曜日|にちようび}はいいですよ。{行|い}きましょう。', ro: 'Nichiyoubi wa ii desu yo. Ikimashou.', vi: 'Chủ Nhật thì được. Đi thôi.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Vai 2 — Chọn chỗ ăn và chốt giờ – nơi gặp',
      lines: [
        { who: 'A', role: 'a', text: '{一緒|いっしょ}に{晩|ばん}ご{飯|はん}を{食|た}べに{行|い}きませんか。', ro: 'Issho ni bangohan o tabe ni ikimasen ka.', vi: 'Cùng đi ăn tối không?' },
        { who: 'B', role: 'b', text: 'いいですね。{何|なに}を{食|た}べますか。', ro: 'Ii desu ne. Nani o tabemasu ka.', vi: 'Hay đấy. Ăn gì?' },
        { who: 'A', role: 'a', text: 'ラーメンとお{好|この}み{焼|や}きとどちらがいいですか。', ro: 'Raamen to okonomiyaki to dochira ga ii desu ka.', vi: 'Ramen và okonomiyaki, cái nào hơn?' },
        { who: 'B', role: 'b', text: 'そうですねえ。お{好|この}み{焼|や}きのほうがいいです。お{好|この}み{焼|や}きはまだですから。', ro: 'Sou desu nee. Okonomiyaki no hou ga ii desu. Okonomiyaki wa mada desu kara.', vi: 'Để xem. Okonomiyaki hơn. Vì okonomiyaki thì mình chưa (ăn).' },
        { who: 'A', role: 'a', text: 'じゃ、{新宿|しんじゅく}のお{好|この}み{焼|や}きの{店|みせ}はどうですか。おいしいですよ。', ro: 'Ja, Shinjuku no okonomiyaki no mise wa dou desu ka. Oishii desu yo.', vi: 'Vậy quán okonomiyaki ở Shinjuku thì sao? Ngon lắm đấy.' },
        { who: 'B', role: 'b', text: 'いいですね。そうしましょう。{何時|なんじ}に{会|あ}いますか。', ro: 'Ii desu ne. Sou shimashou. Nanji ni aimasu ka.', vi: 'Hay đấy. Làm vậy đi. Mấy giờ gặp?' },
        { who: 'A', role: 'a', text: '{7時|しちじ}に{新宿駅|しんじゅくえき}はどうですか。', ro: 'Shichiji ni Shinjuku eki wa dou desu ka.', vi: '7 giờ ở ga Shinjuku thì sao?' },
        { who: 'B', role: 'b', text: '{7時|しちじ}に{新宿駅|しんじゅくえき}ですね。わかりました。', ro: 'Shichiji ni Shinjuku eki desu ne. Wakarimashita.', vi: '7 giờ ở ga Shinjuku nhé. Mình hiểu rồi.' },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo luyện đóng vai',
      items: [
        '「N は まだです」 = "N thì (tôi) chưa (làm)" — cách nói "chưa" gọn của ポイント 57, dùng được cả làm lý do: お{好|この}み{焼|や}きはまだですから.',
        'Tự đổi vai: người A rủ bằng 1 sự kiện trong bảng できる！ (bài Hội thoại), người B lần này nhận lời, lần sau từ chối rồi hẹn ngày khác (～はどうですか).',
        'Mỗi vai phải có đủ: rủ (ませんか) → đáp (ましょう／ちょっと) → chọn (どちら／のほうが) → hẹn (～はどうですか → ～ですね).',
      ],
    },

    /* ── Reading ── */
    { t: 'h', text: 'Đọc to — Reading (40 điểm)' },
    {
      t: 'p',
      text: 'Đề đọc dài khoảng 100–110 ký tự: **4 từ chữ Hán** gạch chân (12đ), **4 từ katakana** (12đ), còn lại hiragana (16đ, sai một ký tự −0,2đ). 30 giây chuẩn bị. Bốn đoạn dưới đây viết đúng khuôn đó, chỉ dùng từ Bài 1–6. Đoạn "bài đọc gỡ điểm" số 4 và 5 của cô (テストがあります · パーティーがあります · やくそくがありました) cũng dùng đúng mẫu ポイント 50 — đọc lại cả hai. Tắt furigana khi đã quen.',
    },
    {
      t: 'examples',
      items: [
        {
          en: 'こんしゅうの{土曜日|どようび}、{横浜|よこはま}でサッカーのしあいがあります。わたしはチケットがにまいあります。パクさんはサッカーがとてもすきですから、いっしょにみにいきます。しあいはごご{七時|しちじ}からです。{六時|ろくじ}にえきであいます。',
          ro: 'Konshuu no doyoubi, Yokohama de sakkaa no shiai ga arimasu. Watashi wa chiketto ga nimai arimasu. Paku-san wa sakkaa ga totemo suki desu kara, issho ni mi ni ikimasu. Shiai wa gogo shichiji kara desu. Rokuji ni eki de aimasu.',
          vi: 'Thứ Bảy tuần này ở Yokohama có trận bóng đá. Tôi có 2 vé. Park rất thích bóng đá nên chúng tôi cùng đi xem. Trận đấu bắt đầu từ 7 giờ tối. 6 giờ chúng tôi gặp nhau ở ga.',
        },
        {
          en: 'わたしはにほんのたべもので{焼|や}き{肉|にく}がいちばんすきです。ラーメンもすきですが、やきにくのほうがすきです。しんじゅくにやすいたべほうだいのみせがあります。コースは{九十分|きゅうじゅっぷん}、にせんえんです。',
          ro: 'Watashi wa Nihon no tabemono de yakiniku ga ichiban suki desu. Raamen mo suki desu ga, yakiniku no hou ga suki desu. Shinjuku ni yasui tabehoudai no mise ga arimasu. Koosu wa kyuujuppun, nisen en desu.',
          vi: 'Trong đồ ăn Nhật tôi thích thịt nướng nhất. Tôi cũng thích ramen nhưng thích thịt nướng hơn. Ở Shinjuku có quán buffet rẻ. Set 90 phút 2.000 yên.',
        },
        {
          en: 'きょうは{月曜日|げつようび}です。こんばん、ともだちと{約束|やくそく}があります。{六時|ろくじ}にえきであいます。いっしょにカラオケにいきます。あしたはテストがありますから、じゅういちじにうちへかえります。',
          ro: 'Kyou wa getsuyoubi desu. Konban, tomodachi to yakusoku ga arimasu. Rokuji ni eki de aimasu. Issho ni karaoke ni ikimasu. Ashita wa tesuto ga arimasu kara, juuichiji ni uchi e kaerimasu.',
          vi: 'Hôm nay là thứ Hai. Tối nay tôi có hẹn với bạn. 6 giờ chúng tôi gặp nhau ở ga. Chúng tôi cùng đi karaoke. Mai có bài kiểm tra nên 11 giờ tôi về nhà.',
        },
        {
          en: 'しんじゅくにえいがかんがふたつあります。さくらえいがかんはえきからあるいて{五分|ごふん}です。みなとえいがかんはバスで{二十分|にじゅっぷん}です。さくらのほうがちかいです。でも、みなとのほうがやすいです。わたしはコメディーがすきです。',
          ro: 'Shinjuku ni eigakan ga futatsu arimasu. Sakura eigakan wa eki kara aruite gofun desu. Minato eigakan wa basu de nijuppun desu. Sakura no hou ga chikai desu. Demo, Minato no hou ga yasui desu. Watashi wa komedii ga suki desu.',
          vi: 'Ở Shinjuku có hai rạp chiếu phim. Rạp Sakura từ ga đi bộ 5 phút. Rạp Minato đi xe buýt 20 phút. Sakura gần hơn. Nhưng Minato rẻ hơn. Tôi thích phim hài.',
        },
      ],
    },
    {
      t: 'note',
      title: 'Chỗ dễ đọc sai trong bốn đoạn trên',
      items: [
        '**七時 しちじ**, **六時 ろくじ**, **九十分 きゅうじゅっぷん**, **二十分 にじゅっぷん**, **五分 ごふん** — ぷん/ふん đổi theo số (Bài 3). にまい (2 tấm) đọc liền, không ~~にまいい~~.',
        '**焼き肉 やきにく**, **約束 やくそく**, **土曜日 どようび**, **月曜日 げつようび**, **横浜 よこはま** — từ chữ Hán dạng đề thi.',
        'Katakana kéo dài: サッカー sakkaa, チケット chiketto (âm ngắt), コース koosu, コメディー komedii, カラオケ (không có trường âm).',
        'は đọc **wa**, を đọc **o**, へ đọc **e**: パクさん**は**, うち**へ**かえります.',
      ],
    },

    /* ── Tự ghi âm ── */
    { t: 'h', text: 'Tự ghi âm — trả lời không nhìn đáp án' },
    {
      t: 'speak',
      id: 'b6-noi-ghi-am',
      part: '1',
      questions: [
        'にほんのたべもので なにが いちばん すきですか。',
        'ベトナムりょうりで なにが すきですか。',
        'きせつで いつが いちばん すきですか。',
        'なつと ふゆと どちらが すきですか。',
        'コーヒーと おちゃと どちらが いいですか。',
        'しゅうまつ、どこへ いきますか。',
        'こんばん、じかんが ありますか。',
        'もう ひるごはんを たべましたか。',
        'こんどの にちようび、いっしょに えいがを みに いきませんか。',
        'こんばん、いっしょに カラオケに いきませんか。（ことわってください）',
        'なんじに あいますか。ごじは どうですか。',
        'ハノイと ホーチミンと どちらが あついですか。',
      ],
    },
  ],
};

/* ═══════════════════════════ 7. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b6-bai-tap',
  kind: 'homework',
  title: 'Bài tập về nhà — Bài 6 (có đáp án)',
  goal: 'Tự dịch, đổi dạng câu, chọn trợ từ và ghép câu Bài 6 không cần nhìn bài học.',
  minutes: 45,
  blocks: [
    {
      t: 'p',
      text: 'Gõ tiếng Nhật bằng bộ gõ (gõ romaji, máy đổi sang kana). Chữ Hán hay kana đều được chấp nhận; dấu câu và dấu cách không tính. Nếu máy chấm sai mà bạn tin mình đúng, bấm **Hỏi gia sư** ngay dưới câu đó.',
    },
    {
      t: 'quiz',
      id: 'b6-bt-dich',
      title: 'Dịch sang tiếng Nhật',
      kind: 'translate',
      grammar: 'Vませんか · Vましょう · Nがあります · (nơi)でNがあります · Nが～枚あります · N1でN2がいちばんAです · N1はN2よりAです · N1とN2とどちらがAですか · Nのほうが(A)です · もうVましたか／まだです · Nはどうですか · ～ね · ～よ',
      items: [
        { q: 'Tối nay cùng đi ăn cơm không?', answers: V('{今晩|こんばん}、{一緒|いっしょ}にご{飯|はん}を{食|た}べに{行|い}きませんか。', '{今晩|こんばん}、{一緒|いっしょ}にご{飯|はん}を{食|た}べませんか。', '{一緒|いっしょ}に{今晩|こんばん}ご{飯|はん}を{食|た}べに{行|い}きませんか。'), hint: '今晩, 一緒に, ご飯, 食べます' },
        { q: 'Cuối tuần đi karaoke không?', answers: V('{週末|しゅうまつ}、カラオケに{行|い}きませんか。', '{週末|しゅうまつ}、{一緒|いっしょ}にカラオケに{行|い}きませんか。'), hint: '週末, カラオケ' },
        { q: 'Hay đấy. Đi thôi.', answers: V('いいですね。{行|い}きましょう。'), hint: 'いいですね' },
        { q: 'Xin lỗi. Tối nay thì hơi… (từ chối)', answers: V('すみません。{今晩|こんばん}はちょっと。', 'すみません、{今晩|こんばん}はちょっと……', 'すみません。{今晩|こんばん}はちょっと…'), hint: 'すみません, 今晩' },
        { q: 'Vì tôi có việc bận.', answers: V('{用事|ようじ}がありますから。'), hint: '用事, あります' },
        { q: 'Vậy à. Tiếc quá. Vậy hẹn lần sau.', answers: V('そうですか。{残念|ざんねん}です。じゃ、また{今度|こんど}。', 'そうですか。{残念|ざんねん}ですね。じゃ、また{今度|こんど}。'), hint: '残念, また今度' },
        { q: 'Ngày mai tôi có hẹn với bạn.', answers: V('{明日|あした}、{友達|ともだち}と{約束|やくそく}があります。', '{明日|あした}は{友達|ともだち}と{約束|やくそく}があります。'), hint: '明日, 友達, 約束' },
        { q: 'Ở Yokohama có trận bóng chày.', answers: V('{横浜|よこはま}で{野球|やきゅう}の{試合|しあい}があります。'), hint: '横浜, 野球, 試合' },
        { q: 'Tôi có 2 vé hoà nhạc.', answers: V('コンサートのチケットが{2枚|にまい}あります。', '{私|わたし}はコンサートのチケットが{2枚|にまい}あります。', 'コンサートのチケットが{二枚|にまい}あります。'), hint: 'コンサート, チケット, ～枚' },
        { q: 'Trong các môn thể thao, bạn thích môn nào nhất?', answers: V('スポーツで{何|なに}がいちばん{好|す}きですか。', 'スポーツで{何|なに}が{一番|いちばん}{好|す}きですか。'), hint: 'スポーツ, いちばん, 好き' },
        { q: 'Tôi thích sukiyaki nhất.', answers: V('すき{焼|や}きがいちばん{好|す}きです。', '{私|わたし}はすき{焼|や}きがいちばん{好|す}きです。'), hint: 'すき焼き, いちばん' },
        { q: 'Tàu điện ngầm nhanh hơn xe buýt.', answers: V('{地下鉄|ちかてつ}はバスより{早|はや}いです。', '{地下鉄|ちかてつ}のほうがバスより{早|はや}いです。'), hint: '地下鉄, バス, 早い' },
        { q: 'Mùa hè và mùa đông, bạn thích mùa nào hơn?', answers: V('{夏|なつ}と{冬|ふゆ}とどちらが{好|す}きですか。'), hint: '夏, 冬, どちら' },
        { q: 'Tôi thích mùa đông hơn.', answers: V('{冬|ふゆ}のほうが{好|す}きです。', '{私|わたし}は{冬|ふゆ}のほうが{好|す}きです。'), hint: '冬, ほう' },
        { q: 'Cả hai tôi đều thích.', answers: V('どちらも{好|す}きです。'), hint: 'どちらも' },
        { q: 'Rạp Sakura gần hơn rạp Minato.', answers: V('さくら{映画館|えいがかん}はみなと{映画館|えいがかん}より{近|ちか}いです。', 'さくら{映画館|えいがかん}のほうがみなと{映画館|えいがかん}より{近|ちか}いです。'), hint: '映画館, 近い' },
        { q: 'Bạn đã đi tháp Tokyo chưa?', answers: V('もう{東京|とうきょう}タワーへ{行|い}きましたか。', 'もう{東京|とうきょう}タワーに{行|い}きましたか。'), hint: 'もう, 東京タワー' },
        { q: 'Chưa. (trả lời câu trên)', answers: V('いいえ、まだです。'), hint: 'まだ' },
        { q: 'Mấy giờ gặp nhau? — 5 giờ thì sao?', answers: V('{何時|なんじ}に{会|あ}いますか。{5時|ごじ}はどうですか。', '{何時|なんじ}に{会|あ}いますか。{五時|ごじ}はどうですか。'), hint: '何時, 会います, どう' },
        { q: '5 giờ nhé. Mình hiểu rồi.', answers: V('{5時|ごじ}ですね。わかりました。', '{五時|ごじ}ですね。わかりました。'), hint: 'わかりました' },
        { q: 'Okonomiyaki ở Shinjuku ngon lắm đấy.', answers: V('{新宿|しんじゅく}のお{好|この}み{焼|や}きはおいしいですよ。', '{新宿|しんじゅく}のお{好|この}み{焼|や}きはとてもおいしいですよ。'), hint: '新宿, お好み焼き, おいしい' },
        { q: 'Lần tới cùng đi chơi không?', answers: V('{今度|こんど}、{一緒|いっしょ}に{遊|あそ}びに{行|い}きませんか。'), hint: '今度, 一緒に, 遊びます' },
      ],
    },
    {
      t: 'quiz',
      id: 'b6-bt-doi-dang',
      title: 'Đổi dạng — viết lại theo yêu cầu (gõ chữ Hán hoặc kana)',
      kind: 'fill',
      grammar: 'ます → ませんか (rủ) · ます → ましょう (nhận lời / chốt) · もう～ましたか (đã … chưa)',
      items: [
        { q: '{行|い}きます → rủ (～ませんか)', answers: V('{行|い}きませんか') },
        { q: '{食|た}べます → rủ', answers: V('{食|た}べませんか') },
        { q: '{見|み}ます → rủ', answers: V('{見|み}ませんか') },
        { q: 'します → rủ', answers: V('しませんか') },
        { q: '{遊|あそ}びます → rủ', answers: V('{遊|あそ}びませんか') },
        { q: '{飲|の}みます → nhận lời / chốt (～ましょう)', answers: V('{飲|の}みましょう') },
        { q: '{会|あ}います → chốt (～ましょう)', answers: V('{会|あ}いましょう') },
        { q: '{帰|かえ}ります → chốt (～ましょう)', answers: V('{帰|かえ}りましょう') },
        { q: '{映画|えいが}を{見|み}ます → rủ ĐI xem (～に{行|い}きませんか)', answers: V('{映画|えいが}を{見|み}に{行|い}きませんか') },
        { q: 'お{酒|さけ}を{飲|の}みます → rủ ĐI uống (～に{行|い}きませんか)', answers: V('お{酒|さけ}を{飲|の}みに{行|い}きませんか') },
        { q: '{昼|ひる}ご{飯|はん}を{食|た}べます → hỏi "đã … chưa"', answers: V('もう{昼|ひる}ご{飯|はん}を{食|た}べましたか') },
        { q: 'チケットを{買|か}います → hỏi "đã … chưa"', answers: V('もうチケットを{買|か}いましたか') },
      ],
    },
    {
      t: 'mcq',
      id: 'b6-bt-tro-tu',
      title: 'Chọn trợ từ đúng',
      items: [
        { q: '{今晩|こんばん}、{用事|ようじ}＿あります。', options: ['を', 'が', 'に', 'で'], correct: 1, why: 'N **が** あります (ポイント 50).' },
        { q: '{上野|うえの}＿ジャズのコンサートがあります。', options: ['に', 'で', 'を', 'へ'], correct: 1, why: 'Sự kiện diễn ra → **で** (ポイント 51).' },
        { q: '{新宿|しんじゅく}＿おいしいラーメンの{店|みせ}があります。', options: ['に', 'で', 'を', 'と'], correct: 0, why: 'Quán = nơi tồn tại → **に** (Bài 4). Khác với sự kiện (で).' },
        { q: 'チケット＿{3枚|さんまい}あります。', options: ['を', 'が', 'の', 'は'], correct: 1, why: 'N **が** số lượng あります (ポイント 52).' },
        { q: '{映画|えいが}＿{見|み}に{行|い}きませんか。', options: ['が', 'を', 'に', 'で'], correct: 1, why: 'Tân ngữ của 見ます → **を**.' },
        { q: '{映画|えいが}を{見|み}＿{行|い}きませんか。', options: ['に', 'へ', 'で', 'を'], correct: 0, why: 'Mục đích đi: V bỏ ます + **に** {行|い}きます (ポイント 42).' },
        { q: '{季節|きせつ}＿いつがいちばん{好|す}きですか。', options: ['は', 'で', 'に', 'と'], correct: 1, why: 'Phạm vi so sánh nhất → **で** (ポイント 53).' },
        { q: '{季節|きせつ}でいつ＿いちばん{好|す}きですか。', options: ['は', 'が', 'を', 'も'], correct: 1, why: 'Từ để hỏi + **が** (ポイント 53).' },
        { q: 'ベトナムは{日本|にほん}＿{暑|あつ}いです。', options: ['より', 'ほう', 'と', 'で'], correct: 0, why: 'N1 は N2 **より** A (ポイント 54).' },
        { q: 'ラーメン＿{焼|や}き{肉|にく}とどちらがいいですか。', options: ['と', 'や', 'も', 'の'], correct: 0, why: 'N1 **と** N2 と どちら (ポイント 55).' },
        { q: '{焼|や}き{肉|にく}＿ほうがいいです。', options: ['が', 'の', 'は', 'を'], correct: 1, why: 'N **の** ほうが (ポイント 56).' },
        { q: '{焼|や}き{肉|にく}のほう＿いいです。', options: ['は', 'を', 'が', 'に'], correct: 2, why: 'のほう**が** — luôn が.' },
        { q: '{5時|ごじ}＿どうですか。', options: ['に', 'は', 'が', 'で'], correct: 1, why: 'Đề xuất: N **は** どうですか (ポイント 58).' },
        { q: '{新宿駅|しんじゅくえき}＿{会|あ}いましょう。', options: ['に', 'で', 'へ', 'を'], correct: 1, why: 'Nơi làm hành động (gặp) → **で** (ポイント 20).' },
        { q: '{友達|ともだち}＿{約束|やくそく}があります。', options: ['と', 'に', 'で', 'が'], correct: 0, why: 'Hẹn **với** bạn → **と** (ポイント 46).' },
      ],
    },
    {
      t: 'mcq',
      id: 'b6-bt-tu-vung',
      title: 'Từ vựng',
      items: [
        { q: '「{来週|らいしゅう}」 là:', options: ['Tuần này', 'Tuần sau', 'Tuần trước', 'Cuối tuần'], correct: 1, why: 'らいしゅう = tuần sau; こんしゅう = tuần này; せんしゅう = tuần trước.' },
        { q: '「{今月|こんげつ}」 là:', options: ['Tháng này', 'Tháng sau', 'Hôm nay', 'Tối nay'], correct: 0, why: 'こんげつ = tháng này; らいげつ = tháng sau.' },
        { q: '「{用事|ようじ}」 là:', options: ['Cuộc hẹn', 'Việc bận', 'Vé', 'Trận đấu'], correct: 1, why: 'ようじ = việc bận, việc riêng.' },
        { q: '「{水着|みずぎ}」 là:', options: ['Nước uống', 'Đồ bơi', 'Bản đồ', 'Bể bơi'], correct: 1, why: 'みずぎ = đồ bơi.' },
        { q: '「{居酒屋|いざかや}」 là:', options: ['Quán nhậu', 'Rạp phim', 'Siêu thị', 'Quán cà phê'], correct: 0, why: 'いざかや = quán nhậu kiểu Nhật.' },
        { q: '「{食|た}べ{放題|ほうだい}」 là:', options: ['Đồ ăn', 'Ăn thoả thích (buffet)', 'Thịt nướng', 'Set món'], correct: 1, why: 'たべほうだい = ăn thoả thích.' },
        { q: 'Tàu điện ngầm là:', options: ['{電車|でんしゃ}', '{地下鉄|ちかてつ}', '{新幹線|しんかんせん}', 'バス'], correct: 1, why: '**{地下鉄|ちかてつ}** ちかてつ.' },
        { q: '「{早|はや}い」 trái nghĩa gần với:', options: ['{遠|とお}い', '{近|ちか}い', '{広|ひろ}い', '(chậm, muộn — chưa học)'], correct: 3, why: '{早|はや}い = sớm/nhanh; trái nghĩa là {遅|おそ}い (chưa học). {遠|とお}い ↔ {近|ちか}い là một cặp khác.' },
        { q: 'Người được rủ nhưng không đi được, người rủ nói:', options: ['いいですね', '{残念|ざんねん}です', 'わかりました', 'そうしましょう'], correct: 1, why: '**{残念|ざんねん}です** = tiếc quá.' },
        { q: '「ぜひ{行|い}きたいです」 — ぜひ nghĩa là:', options: ['Chưa', 'Đã', 'Nhất định, rất', 'Cùng nhau'], correct: 2, why: 'ぜひ = nhất định (muốn).' },
        { q: 'Câu ngập ngừng khi đang nghĩ:', options: ['そうですねえ', 'そうしましょう', 'わかりました', 'いいですね'], correct: 0, why: '**そうですねえ……** = để xem nào…' },
        { q: '「{歌手|かしゅ}」 là:', options: ['Bài hát', 'Ca sĩ', 'Buổi hoà nhạc', 'Nhạc jazz'], correct: 1, why: 'かしゅ = ca sĩ; うた = bài hát.' },
        { q: '「{季節|きせつ}」 là:', options: ['Mùa', 'Thời tiết', 'Năm', 'Tháng'], correct: 0, why: 'きせつ = mùa.' },
        { q: '「{全部|ぜんぶ}」 là:', options: ['Một nửa', 'Tất cả', 'Một chút', 'Nhất'], correct: 1, why: 'ぜんぶ = tất cả.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b6-bt-hoi-dap',
      title: 'Chọn câu trả lời đúng cho câu hỏi',
      items: [
        { q: '{一緒|いっしょ}に{映画|えいが}を{見|み}に{行|い}きませんか。 (bạn muốn đi)', options: ['はい、{見|み}ません。', 'いいですね。{行|い}きましょう。', 'いいえ、{行|い}きません。', 'もう{見|み}ました。'], correct: 1, why: 'Nhận lời chuẩn.' },
        { q: '{今晩|こんばん}、カラオケに{行|い}きませんか。 (bạn bận)', options: ['いいえ、{行|い}きません。', 'すみません。{今晩|こんばん}はちょっと……。', '{残念|ざんねん}です。', 'カラオケが{好|す}きです。'], correct: 1, why: 'Từ chối khéo.' },
        { q: '{時間|じかん}がありますか。', options: ['はい、{時間|じかん}です。', 'はい、あります。', 'はい、います。', 'はい、ありますか。'], correct: 1, why: 'N が ありますか → **はい、あります**.' },
        { q: 'どこで{試合|しあい}がありますか。', options: ['{横浜|よこはま}にあります。', '{横浜|よこはま}であります。', '{横浜|よこはま}へ{行|い}きます。', '{日曜日|にちようび}です。'], correct: 1, why: 'Sự kiện → **で**あります.' },
        { q: 'チケットが{何枚|なんまい}ありますか。', options: ['{2|ふた}つあります。', '{2枚|にまい}あります。', '{2人|ふたり}です。', '{2時|にじ}です。'], correct: 1, why: '{何枚|なんまい} → ～{枚|まい}.' },
        { q: '{東京|とうきょう}でどこがいちばんにぎやかですか。', options: ['{新宿|しんじゅく}のほうがにぎやかです。', '{新宿|しんじゅく}がいちばんにぎやかです。', '{新宿|しんじゅく}はにぎやかじゃありません。', 'はい、にぎやかです。'], correct: 1, why: 'いちばん hỏi → いちばん đáp (không dùng のほうが).' },
        { q: 'すしとラーメンとどちらが{好|す}きですか。', options: ['すしがいちばん{好|す}きです。', 'すしのほうが{好|す}きです。', 'はい、{好|す}きです。', 'すしとラーメンです。'], correct: 1, why: 'どちら → **のほうが**.' },
        { q: 'もう{昼|ひる}ご{飯|はん}を{食|た}べましたか。 (bạn chưa ăn)', options: ['いいえ、{食|た}べません。', 'いいえ、まだです。', 'いいえ、{食|た}べませんでした。', 'はい、まだです。'], correct: 1, why: 'Chưa → **いいえ、まだです**.' },
        { q: '{何時|なんじ}に{会|あ}いますか。', options: ['{6時|ろくじ}はどうですか。', '{6時|ろくじ}ですよ。', '{6時|ろくじ}のほうがいいです。', 'はい、{会|あ}います。'], correct: 0, why: 'Đề xuất giờ → **～はどうですか**.' },
        { q: '{6時|ろくじ}はどうですか。 (bạn đồng ý)', options: ['{6時|ろくじ}ですね。わかりました。', '{6時|ろくじ}ですよ。', 'すみません。', 'どちらもいいです。'], correct: 0, why: 'Nhắc lại + ね + わかりました.' },
      ],
    },
    {
      t: 'build',
      id: 'b6-bt-ghep',
      title: 'Ghép câu — một cuộc hẹn từ đầu đến cuối',
      items: [
        { vi: 'Chủ Nhật tuần này bạn có rảnh không?', chips: ['{今週|こんしゅう}の', '{日曜日|にちようび}、', '{時間|じかん}が', 'ありますか', 'を', 'いますか'], answer: ['{今週|こんしゅう}の', '{日曜日|にちようび}、', '{時間|じかん}が', 'ありますか'], ro: 'Konshuu no nichiyoubi, jikan ga arimasu ka.' },
        { vi: 'Ở Ueno có buổi hoà nhạc jazz.', chips: ['{上野|うえの}で', 'ジャズの', 'コンサートが', 'あります', '{上野|うえの}に', 'を'], answer: ['{上野|うえの}で', 'ジャズの', 'コンサートが', 'あります'], ro: 'Ueno de jazu no konsaato ga arimasu.' },
        { vi: 'Cùng đi nghe không?', chips: ['{一緒|いっしょ}に', '{聞|き}きに', '{行|い}きませんか', '{行|い}きましょう', 'を'], answer: ['{一緒|いっしょ}に', '{聞|き}きに', '{行|い}きませんか'], ro: 'Issho ni kiki ni ikimasen ka.' },
        { vi: 'Oa, mình rất muốn đi.', chips: ['わあ、', 'ぜひ', '{行|い}きたいです', 'まだ', '{行|い}きません'], answer: ['わあ、', 'ぜひ', '{行|い}きたいです'], ro: 'Waa, zehi ikitai desu.' },
        { vi: 'JR và tàu điện ngầm, cái nào nhanh hơn?', chips: ['JRと', '{地下鉄|ちかてつ}と', 'どちらが', '{早|はや}いですか', 'いちばん', 'より'], answer: ['JRと', '{地下鉄|ちかてつ}と', 'どちらが', '{早|はや}いですか'], ro: 'JR to chikatetsu to dochira ga hayai desu ka.' },
        { vi: 'JR nhanh hơn đấy.', chips: ['JR', 'の', 'ほう', 'が', '{早|はや}いです', 'よ', 'ね'], answer: ['JR', 'の', 'ほう', 'が', '{早|はや}いです', 'よ'], ro: 'JR no hou ga hayai desu yo.' },
        { vi: '1 giờ ở ga Ueno thì sao?', chips: ['{1時|いちじ}に', '{上野駅|うえのえき}は', 'どうですか', 'どちらですか', 'で'], answer: ['{1時|いちじ}に', '{上野駅|うえのえき}は', 'どうですか'], ro: 'Ichiji ni Ueno eki wa dou desu ka.' },
        { vi: '1 giờ ở ga Ueno nhé. Mình hiểu rồi.', chips: ['{1時|いちじ}に', '{上野駅|うえのえき}', 'ですね。', 'わかりました', 'ですよ。'], answer: ['{1時|いちじ}に', '{上野駅|うえのえき}', 'ですね。', 'わかりました'], ro: 'Ichiji ni Ueno eki desu ne. Wakarimashita.' },
        { vi: 'Trong các ca sĩ Nhật, bạn thích ai nhất?', chips: ['{日本|にほん}の', '{歌手|かしゅ}で', '{誰|だれ}が', 'いちばん', '{好|す}きですか', '{誰|だれ}は'], answer: ['{日本|にほん}の', '{歌手|かしゅ}で', '{誰|だれ}が', 'いちばん', '{好|す}きですか'], ro: 'Nihon no kashu de dare ga ichiban suki desu ka.' },
        { vi: 'Công viên Midori rộng hơn công viên Sakura.', chips: ['みどり{公園|こうえん}は', 'さくら{公園|こうえん}より', '{広|ひろ}いです', 'のほうが', 'いちばん'], answer: ['みどり{公園|こうえん}は', 'さくら{公園|こうえん}より', '{広|ひろ}いです'], ro: 'Midori kouen wa Sakura kouen yori hiroi desu.' },
      ],
    },
  ],
};

export const BAI_6: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, KANJI, NGHE, NOI, BAI_TAP];
