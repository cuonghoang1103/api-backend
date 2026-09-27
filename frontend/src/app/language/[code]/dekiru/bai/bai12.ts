/**
 * Bài 12 — 病気・けが (Ốm đau, chấn thương) · できる日本語 初級 第12課, p.205–220 · JPD113/JPD123.
 *
 * Ngữ pháp: ポイント 104–107 (p.279): 普通形んです · Vた形／Vナイ形ほうがいいです ·
 * ［V辞書形／Nの／～時間・～日］前に、___ · Vテ形から、___ + ôn 普通形 / タ形 (表 p.283–284).
 * Từ vựng: đủ 51 mục của trang ことば p.219 (17 + 18 + 16) — từ Bài 8 trở đi cô không
 * phát danh sách riêng nên trang ことば của sách là chuẩn. Từ ở chân bài đọc/nghe
 * (処方箋, 赤い, 材料, ジューサー, キャベツ, トマト, ニンジン) nằm ở mục "Từ thêm".
 * Hội thoại, câu ví dụ, bài đọc, kịch bản nghe: VIẾT MỚI theo đúng tình huống của sách
 * (xem ../SOAN-BAI.md). Chỉ dùng lại tên nhân vật; tên bệnh viện, quán… là tự đặt.
 *
 * Nhân vật (giới tính quyết định giọng đọc, theo bai1.ts): nữ = パク, アンナ, ワン ·
 * nam = ダニエル, マルコ, カルロス. Hội thoại: role 'a'/'c' = giọng nữ, 'b'/'examiner' = giọng nam.
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
  id: 'b12-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — 病気・けが Kể triệu chứng, khuyên bạn, đi khám bệnh',
  goal: 'Kể triệu chứng khi thấy mệt và xin về sớm / giải thích vì sao nghỉ, hỏi thăm người ốm, khuyên bạn nên làm gì – không nên làm gì, và ở bệnh viện – hiệu thuốc thì nói được bị từ bao giờ, đã uống thuốc gì, nghe hiểu lời dặn "làm A xong rồi mới B", "trước khi … thì …".',
  minutes: 40,
  blocks: [
    {
      t: 'note',
      title: 'Học xong bài 12 bạn làm được (できる)',
      items: [
        '**① {体|からだ}の{調子|ちょうし}** — khi thấy mệt: **kể triệu chứng ngắn gọn** (đau đầu, sốt, không muốn ăn…) và **xin về sớm**; hôm sau **giải thích vì sao hôm qua nghỉ** ("mình bị cảm") và đáp lời hỏi thăm ("nhờ trời, khỏi rồi").',
        '**② アドバイス** — thấy bạn không khoẻ thì **khuyên**: nên làm gì (～たほうがいいです), không nên làm gì (～ないほうがいいです); nói về **việc tốt cho sức khoẻ**.',
        '**③ {病院|びょういん}で** — ở bệnh viện: làm thủ tục (đưa thẻ bảo hiểm, chờ ở phòng chờ), **kể triệu chứng + từ bao giờ** (～てから、痛くなりました), trả lời "đã uống thuốc chưa" (～前に飲みました); ở hiệu thuốc **nghe hiểu cách uống thuốc** (1日に3回、ご飯を食べてから／寝る前に).',
        '**できる！** — nhóm 3 người đóng vai: **người ốm – bạn của người ốm – bác sĩ**. Bác sĩ hỏi theo thẻ gợi ý rồi dặn dò.',
      ],
    },
    {
      t: 'table',
      caption: 'Bức tranh chung của bài — từ lúc thấy mệt đến lúc lấy thuốc',
      head: ['Lúc', 'Câu then chốt', 'Romaji', 'ポイント'],
      rows: [
        ['Bạn trông mệt', 'どうしたんですか。——{頭|あたま}が{痛|いた}いんです。', 'Dou shita n desu ka. — Atama ga itai n desu.', '104'],
        ['Xin về sớm', '{先生|せんせい}、{早|はや}く{帰|かえ}ってもいいですか。——{熱|ねつ}があるんです。', 'Sensei, hayaku kaette mo ii desu ka. — Netsu ga aru n desu.', '104 (+89)'],
        ['Hôm sau', '{昨日|きのう}、どうしたんですか。——{風邪|かぜ}をひいたんです。', 'Kinou, dou shita n desu ka. — Kaze o hiita n desu.', '104'],
        ['Được hỏi thăm', 'おかげさまで、もう{治|なお}りました。', 'Okagesama de, mou naorimashita.', '—'],
        ['Khuyên bạn', '{病院|びょういん}へ{行|い}ったほうがいいですよ。', 'Byouin e itta hou ga ii desu yo.', '105'],
        ['Khuyên đừng', '{冷|つめ}たいものを{食|た}べないほうがいいですよ。', 'Tsumetai mono o tabenai hou ga ii desu yo.', '105'],
        ['Kể với bác sĩ', '{昨日|きのう}、{晩|ばん}ご{飯|はん}を{食|た}べてから、{痛|いた}くなりました。', 'Kinou, bangohan o tabete kara, itaku narimashita.', '107'],
        ['Đã uống thuốc chưa', 'はい、{寝|ね}る{前|まえ}に{飲|の}みました。', 'Hai, neru mae ni nomimashita.', '106'],
        ['Hiệu thuốc dặn', 'この{薬|くすり}はご{飯|はん}を{食|た}べてから{飲|の}んでください。', 'Kono kusuri wa gohan o tabete kara nonde kudasai.', '106, 107'],
      ],
    },

    /* ── ① 体の調子 ── */
    { t: 'h', text: '① {体|からだ}の{調子|ちょうし} — Tình trạng sức khoẻ' },
    {
      t: 'p',
      text: 'Tình huống: **giờ nghỉ giữa tiết** trong lớp. Một bạn ngồi ôm đầu. Bạn bên cạnh hỏi **どうしたんですか** (sao thế?) — người mệt trả lời bằng **～んです** (giải thích tình trạng). Rồi bạn đó **xin cô cho về sớm**. **Hôm sau**, ở chỗ làm thêm, người quen hỏi "hôm qua bạn làm sao thế?" — kể lại và nói đã khỏi.',
    },
    {
      t: 'dialogue',
      title: 'Giờ nghỉ — "Sao thế?"',
      lines: [
        { who: 'ワン', role: 'a', text: 'マルコさん、どうしたんですか。', ro: 'Maruko-san, dou shita n desu ka.', vi: 'Marco, cậu sao thế?' },
        { who: 'マルコ', role: 'b', text: 'ちょっと{頭|あたま}が{痛|いた}いんです。', ro: 'Chotto atama ga itai n desu.', vi: 'Mình hơi đau đầu.' },
        { who: 'ワン', role: 'a', text: 'えっ、{大丈夫|だいじょうぶ}ですか。{顔|かお}が{赤|あか}いですよ。{熱|ねつ}がありますか。', ro: 'E, daijoubu desu ka. Kao ga akai desu yo. Netsu ga arimasu ka.', vi: 'Hả, cậu có sao không? Mặt đỏ lắm đấy. Có sốt không?' },
        { who: 'マルコ', role: 'b', text: 'ええ、{少|すこ}しあるんです。それに、{食欲|しょくよく}もないんです。', ro: 'Ee, sukoshi aru n desu. Sore ni, shokuyoku mo nai n desu.', vi: 'Ừ, hơi sốt. Thêm nữa là mình cũng chẳng muốn ăn.' },
        { who: 'ワン', role: 'a', text: 'それはいけませんね。{今日|きょう}は{早|はや}く{帰|かえ}ったほうがいいですよ。', ro: 'Sore wa ikemasen ne. Kyou wa hayaku kaetta hou ga ii desu yo.', vi: 'Thế thì không ổn rồi. Hôm nay cậu nên về sớm đi.' },
        { who: 'マルコ', role: 'b', text: 'そうですね。{先生|せんせい}に{聞|き}きます。', ro: 'Sou desu ne. Sensei ni kikimasu.', vi: 'Ừ nhỉ. Mình hỏi cô.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Xin cô cho về sớm',
      lines: [
        { who: 'マルコ', role: 'b', text: 'あのう、{先生|せんせい}、{早|はや}く{帰|かえ}ってもいいですか。', ro: 'Anou, sensei, hayaku kaette mo ii desu ka.', vi: 'Dạ, thưa cô, em về sớm được không ạ?' },
        { who: '{先生|せんせい}', role: 'c', text: 'どうしたんですか。', ro: 'Dou shita n desu ka.', vi: 'Em làm sao thế?' },
        { who: 'マルコ', role: 'b', text: '{熱|ねつ}があるんです。{頭|あたま}も{痛|いた}いんです。', ro: 'Netsu ga aru n desu. Atama mo itai n desu.', vi: 'Em bị sốt ạ. Đầu cũng đau nữa.' },
        { who: '{先生|せんせい}', role: 'c', text: 'それはいけませんね。いいですよ。{病院|びょういん}へ{行|い}ってくださいね。', ro: 'Sore wa ikemasen ne. Ii desu yo. Byouin e itte kudasai ne.', vi: 'Thế thì không ổn rồi. Được, em về đi. Nhớ đi bệnh viện nhé.' },
        { who: 'マルコ', role: 'b', text: 'はい。すみません。{明日|あした}のテストも{休|やす}んでもいいですか。', ro: 'Hai. Sumimasen. Ashita no tesuto mo yasunde mo ii desu ka.', vi: 'Vâng. Em xin lỗi. Bài kiểm tra ngày mai em nghỉ cũng được chứ ạ?' },
        { who: '{先生|せんせい}', role: 'c', text: 'ええ、{体|からだ}が{大切|たいせつ}ですから。お{大事|だいじ}に。', ro: 'Ee, karada ga taisetsu desu kara. Odaiji ni.', vi: 'Được, sức khoẻ là quan trọng mà. Em giữ gìn sức khoẻ nhé.' },
        { who: 'マルコ', role: 'b', text: 'ありがとうございます。{失礼|しつれい}します。', ro: 'Arigatou gozaimasu. Shitsurei shimasu.', vi: 'Em cảm ơn cô. Em xin phép ạ.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hôm sau, ở quán làm thêm — "Hôm qua cậu làm sao thế?"',
      lines: [
        { who: 'パク', role: 'a', text: 'マルコさん、{昨日|きのう}、どうしたんですか。アルバイトに{来|き}ませんでしたね。', ro: 'Maruko-san, kinou, dou shita n desu ka. Arubaito ni kimasen deshita ne.', vi: 'Marco, hôm qua cậu làm sao thế? Không thấy đến làm thêm nhỉ.' },
        { who: 'マルコ', role: 'b', text: '{風邪|かぜ}をひいたんです。{熱|ねつ}が{39度|さんじゅうきゅうど}あったんです。', ro: 'Kaze o hiita n desu. Netsu ga sanjuukyuu do atta n desu.', vi: 'Mình bị cảm. Sốt tới 39 độ.' },
        { who: 'パク', role: 'a', text: 'えっ？{大丈夫|だいじょうぶ}ですか。', ro: 'E? Daijoubu desu ka.', vi: 'Hả? Cậu có sao không?' },
        { who: 'マルコ', role: 'b', text: 'はい。おかげさまで、もう{治|なお}りました。{薬|くすり}を{飲|の}んで、たくさん{寝|ね}ましたから。', ro: 'Hai. Okagesama de, mou naorimashita. Kusuri o nonde, takusan nemashita kara.', vi: 'Ừ. Nhờ trời, khỏi rồi. Vì mình uống thuốc rồi ngủ thật nhiều.' },
        { who: 'パク', role: 'a', text: 'そうですか。よかったですね。でも、{今日|きょう}は{無理|むり}をしないでくださいね。', ro: 'Sou desu ka. Yokatta desu ne. Demo, kyou wa muri o shinaide kudasai ne.', vi: 'Vậy à. Tốt quá. Nhưng hôm nay đừng cố quá sức nhé.' },
        { who: 'マルコ', role: 'b', text: 'ありがとうございます。', ro: 'Arigatou gozaimasu.', vi: 'Cảm ơn cậu.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'どうしたんですか。——{歯|は}が{痛|いた}いんです。', ro: 'Dou shita n desu ka. — Ha ga itai n desu.', vi: 'Bạn sao thế? — Tôi đau răng. — ポイント 104' },
        { en: 'どうしたんですか。——{気持|きも}ちが{悪|わる}いんです。', ro: 'Dou shita n desu ka. — Kimochi ga warui n desu.', vi: 'Sao thế? — Tôi thấy buồn nôn / khó chịu trong người. — ポイント 104' },
        { en: '{大丈夫|だいじょうぶ}ですか。——はい、{大丈夫|だいじょうぶ}です。', ro: 'Daijoubu desu ka. — Hai, daijoubu desu.', vi: 'Bạn có sao không? — Vâng, tôi không sao.' },
        { en: 'それはいけませんね。お{大事|だいじ}に。', ro: 'Sore wa ikemasen ne. Odaiji ni.', vi: 'Thế thì không ổn rồi. Giữ gìn sức khoẻ nhé. (nói với người ốm)' },
        { en: '{昨日|きのう}、どうしたんですか。——{風邪|かぜ}をひいたんです。', ro: 'Kinou, dou shita n desu ka. — Kaze o hiita n desu.', vi: 'Hôm qua bạn làm sao thế? — Tôi bị cảm. — ポイント 104 (quá khứ: ひいた + んです)' },
        { en: 'おかげさまで、もう{治|なお}りました。——よかったですね。', ro: 'Okagesama de, mou naorimashita. — Yokatta desu ne.', vi: 'Nhờ trời / nhờ mọi người, tôi khỏi rồi. — Tốt quá nhỉ.' },
        { en: '{明日|あした}のテストを{休|やす}んでもいいですか。——{体|からだ}の{調子|ちょうし}がよくないんです。', ro: 'Ashita no tesuto o yasunde mo ii desu ka. — Karada no choushi ga yokunai n desu.', vi: 'Em nghỉ bài kiểm tra ngày mai được không ạ? — Vì em thấy trong người không khoẻ.' },
      ],
    },

    /* ── ② アドバイス ── */
    { t: 'h', text: '② アドバイス — Lời khuyên' },
    {
      t: 'p',
      text: 'Tình huống: trong lớp, một bạn trông **uể oải**. Hỏi ra mới biết hôm qua bạn ấy **về sớm, uống thuốc** — vậy mà tối nay lại định đi **nhậu (飲み会)**. Bạn bên cạnh **khuyên** (～たほうがいいですよ / ～ないほうがいいですよ). Cảnh sau: một bạn kêu **dạo này (最近) người không khoẻ** — hai người nói chuyện về **việc tốt cho sức khoẻ** (体にいいこと): mình làm gì mỗi sáng, bạn có làm không, nên làm gì.',
    },
    {
      t: 'dialogue',
      title: 'Bị cảm mà vẫn định đi nhậu',
      lines: [
        { who: 'パク', role: 'a', text: 'ダニエルさん、{元気|げんき}がないですね。どうしたんですか。', ro: 'Danieru-san, genki ga nai desu ne. Dou shita n desu ka.', vi: 'Daniel, trông cậu không có sức sống gì cả. Sao thế?' },
        { who: 'ダニエル', role: 'b', text: '{風邪|かぜ}なんです。{昨日|きのう}、{早|はや}く{帰|かえ}って、{薬|くすり}を{飲|の}みました。', ro: 'Kaze na n desu. Kinou, hayaku kaette, kusuri o nomimashita.', vi: 'Mình bị cảm. Hôm qua mình về sớm rồi uống thuốc.' },
        { who: 'パク', role: 'a', text: 'そうですか。{今日|きょう}はうちでゆっくり{休|やす}んだほうがいいですよ。', ro: 'Sou desu ka. Kyou wa uchi de yukkuri yasunda hou ga ii desu yo.', vi: 'Vậy à. Hôm nay cậu nên ở nhà nghỉ ngơi cho thoải mái.' },
        { who: 'ダニエル', role: 'b', text: 'でも、{今晩|こんばん}、クラスの{飲|の}み{会|かい}があるんです。', ro: 'Demo, konban, kurasu no nomikai ga aru n desu.', vi: 'Nhưng tối nay lớp có buổi nhậu.' },
        { who: 'パク', role: 'a', text: 'えっ、{飲|の}み{会|かい}には{行|い}かないほうがいいですよ。お{酒|さけ}もあまり{飲|の}まないほうがいいです。', ro: 'E, nomikai ni wa ikanai hou ga ii desu yo. Osake mo amari nomanai hou ga ii desu.', vi: 'Hả, cậu không nên đi nhậu đâu. Cũng không nên uống rượu nhiều.' },
        { who: 'ダニエル', role: 'b', text: 'そうですね。じゃ、{今日|きょう}は{早|はや}く{寝|ね}ます。', ro: 'Sou desu ne. Ja, kyou wa hayaku nemasu.', vi: 'Ừ nhỉ. Vậy hôm nay mình đi ngủ sớm.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Dạo này người không khoẻ — việc tốt cho sức khoẻ',
      lines: [
        { who: 'アンナ', role: 'c', text: 'カルロスさん、どうしたんですか。{眠|ねむ}そうですね。', ro: 'Karurosu-san, dou shita n desu ka. Nemusou desu ne.', vi: 'Carlos, sao thế? Trông cậu buồn ngủ ghê.' },
        { who: 'カルロス', role: 'b', text: '{最近|さいきん}、あまり{体|からだ}の{調子|ちょうし}がよくないんです。すぐ{疲|つか}れるんです。', ro: 'Saikin, amari karada no choushi ga yokunai n desu. Sugu tsukareru n desu.', vi: 'Dạo này người mình không được khoẻ lắm. Mình mau mệt lắm.' },
        { who: 'アンナ', role: 'c', text: 'そうですか。{私|わたし}は{毎朝|まいあさ}、{野菜|やさい}ジュースを{飲|の}んでいます。カルロスさんは{野菜|やさい}を{食|た}べていますか。', ro: 'Sou desu ka. Watashi wa maiasa, yasai juusu o nonde imasu. Karurosu-san wa yasai o tabete imasu ka.', vi: 'Vậy à. Mình thì sáng nào cũng uống nước ép rau. Carlos có ăn rau không?' },
        { who: 'カルロス', role: 'b', text: 'いいえ、{全然|ぜんぜん}{食|た}べていません。{野菜|やさい}はあまり{好|す}きじゃないんです。', ro: 'Iie, zenzen tabete imasen. Yasai wa amari suki ja nai n desu.', vi: 'Không, mình chẳng ăn gì cả. Mình không thích rau lắm.' },
        { who: 'アンナ', role: 'c', text: '{体|からだ}にいいですから、できるだけ{食|た}べたほうがいいですよ。それから、{睡眠|すいみん}も{大切|たいせつ}です。{毎晩|まいばん}{何時間|なんじかん}{寝|ね}ていますか。', ro: 'Karada ni ii desu kara, dekirudake tabeta hou ga ii desu yo. Sorekara, suimin mo taisetsu desu. Maiban nanjikan nete imasu ka.', vi: 'Vì tốt cho sức khoẻ nên cậu cố ăn càng nhiều càng tốt. Còn nữa, giấc ngủ cũng quan trọng. Tối nào cậu ngủ mấy tiếng?' },
        { who: 'カルロス', role: 'b', text: '{5時間|ごじかん}ぐらいです。{寝|ね}る{前|まえ}に、いつもゲームをするんです。', ro: 'Gojikan gurai desu. Neru mae ni, itsumo geemu o suru n desu.', vi: 'Khoảng 5 tiếng. Trước khi ngủ mình toàn chơi game.' },
        { who: 'アンナ', role: 'c', text: 'ああ、{寝|ね}る{前|まえ}にゲームはしないほうがいいですよ。{7時間|ななじかん}{以上|いじょう}{寝|ね}たほうがいいです。', ro: 'Aa, neru mae ni geemu wa shinai hou ga ii desu yo. Nanajikan ijou neta hou ga ii desu.', vi: 'À, trước khi ngủ đừng chơi game thì hơn. Nên ngủ từ 7 tiếng trở lên.' },
        { who: 'カルロス', role: 'b', text: 'はい、わかりました。', ro: 'Hai, wakarimashita.', vi: 'Ừ, mình hiểu rồi.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{早|はや}く{病院|びょういん}へ{行|い}ったほうがいいですよ。', ro: 'Hayaku byouin e itta hou ga ii desu yo.', vi: 'Bạn nên đi bệnh viện sớm đi. — ポイント 105 (た形)' },
        { en: '{今日|きょう}はあまり{冷|つめ}たいものを{食|た}べないほうがいいですよ。', ro: 'Kyou wa amari tsumetai mono o tabenai hou ga ii desu yo.', vi: 'Hôm nay bạn đừng ăn đồ lạnh nhiều thì hơn. — ポイント 105 (ない形)' },
        { en: 'できるだけ{声|こえ}を{出|だ}さないほうがいいです。', ro: 'Dekirudake koe o dasanai hou ga ii desu.', vi: 'Hết mức có thể thì đừng nói (đừng phát ra tiếng) thì hơn.' },
        { en: '{体|からだ}にいいですから、{毎日|まいにち}{運動|うんどう}をしたほうがいいです。', ro: 'Karada ni ii desu kara, mainichi undou o shita hou ga ii desu.', vi: 'Vì tốt cho cơ thể nên mỗi ngày nên vận động.' },
        { en: '{何|なに}か{体|からだ}にいいことをしていますか。——はい、{毎朝|まいあさ}{走|はし}っています。', ro: 'Nanika karada ni ii koto o shite imasu ka. — Hai, maiasa hashitte imasu.', vi: 'Bạn có làm việc gì tốt cho sức khoẻ không? — Có, sáng nào tôi cũng chạy bộ.' },
        { en: 'はい、わかりました。／そうですね。', ro: 'Hai, wakarimashita. / Sou desu ne.', vi: 'Vâng, tôi hiểu rồi. / Ừ nhỉ. (đáp lời khuyên)' },
      ],
    },

    /* ── ③ 病院で ── */
    { t: 'h', text: '③ {病院|びょういん}で — Ở bệnh viện và hiệu thuốc' },
    {
      t: 'p',
      text: 'Tình huống: **quầy tiếp tân** bệnh viện — đưa **thẻ bảo hiểm** (保険証), điền tên, địa chỉ, **chờ ở phòng chờ**. Vào **phòng khám**, bác sĩ hỏi **どうしましたか** (bị làm sao?), **いつからですか** (từ bao giờ?), **何か薬を飲みましたか** (đã uống thuốc gì chưa?). Rồi ra **hiệu thuốc** (薬局): dược sĩ dặn cách uống: **1日に3回**, uống **sau khi ăn** (～てから) hay **trước khi ngủ** (～前に).',
    },
    {
      t: 'dialogue',
      title: 'Ở quầy tiếp tân',
      lines: [
        { who: '{受付|うけつけ}の{人|ひと}', role: 'c', text: 'こんにちは。{靴|くつ}を{脱|ぬ}いでから、{入|はい}ってください。', ro: 'Konnichiwa. Kutsu o nuide kara, haitte kudasai.', vi: 'Xin chào. Anh cởi giày rồi mới vào nhé.' },
        { who: 'マルコ', role: 'b', text: 'はい。すみません、{初|はじ}めてなんです。', ro: 'Hai. Sumimasen, hajimete na n desu.', vi: 'Vâng. Xin lỗi, tôi đến lần đầu.' },
        { who: '{受付|うけつけ}の{人|ひと}', role: 'c', text: 'じゃ、この{紙|かみ}に{名前|なまえ}と{住所|じゅうしょ}を{書|か}いてから、{保険証|ほけんしょう}と{一緒|いっしょ}に{出|だ}してください。', ro: 'Ja, kono kami ni namae to juusho o kaite kara, hokenshou to issho ni dashite kudasai.', vi: 'Vậy anh viết tên và địa chỉ vào tờ giấy này, rồi nộp cùng thẻ bảo hiểm.' },
        { who: 'マルコ', role: 'b', text: 'はい。……お{願|ねが}いします。', ro: 'Hai. …… Onegai shimasu.', vi: 'Vâng. … Nhờ chị.' },
        { who: '{受付|うけつけ}の{人|ひと}', role: 'c', text: 'はい。じゃ、{待合室|まちあいしつ}で{待|ま}ってください。{名前|なまえ}を{呼|よ}びますから。', ro: 'Hai. Ja, machiaishitsu de matte kudasai. Namae o yobimasu kara.', vi: 'Vâng. Anh chờ ở phòng chờ nhé. Chúng tôi sẽ gọi tên.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Trong phòng khám',
      lines: [
        { who: '{医者|いしゃ}', role: 'examiner', text: 'どうしましたか。', ro: 'Dou shimashita ka.', vi: 'Anh bị làm sao?' },
        { who: 'マルコ', role: 'b', text: 'おなかがとても{痛|いた}いんです。それに、{気持|きも}ちも{悪|わる}いんです。', ro: 'Onaka ga totemo itai n desu. Sore ni, kimochi mo warui n desu.', vi: 'Tôi đau bụng lắm. Thêm nữa là thấy buồn nôn.' },
        { who: '{医者|いしゃ}', role: 'examiner', text: 'いつからですか。', ro: 'Itsu kara desu ka.', vi: 'Từ bao giờ?' },
        { who: 'マルコ', role: 'b', text: '{昨日|きのう}、{晩|ばん}ご{飯|はん}を{食|た}べてから、{痛|いた}くなりました。{冷|つめ}たいものをたくさん{食|た}べたんです。', ro: 'Kinou, bangohan o tabete kara, itaku narimashita. Tsumetai mono o takusan tabeta n desu.', vi: 'Hôm qua, sau khi ăn tối thì bắt đầu đau. Tôi đã ăn nhiều đồ lạnh.' },
        { who: '{医者|いしゃ}', role: 'examiner', text: '{何|なに}か{薬|くすり}を{飲|の}みましたか。', ro: 'Nanika kusuri o nomimashita ka.', vi: 'Anh đã uống thuốc gì chưa?' },
        { who: 'マルコ', role: 'b', text: 'はい、{病院|びょういん}へ{来|く}る{前|まえ}に{飲|の}みました。', ro: 'Hai, byouin e kuru mae ni nomimashita.', vi: 'Rồi ạ, tôi uống trước khi đến bệnh viện.' },
        { who: '{医者|いしゃ}', role: 'examiner', text: 'そうですか。じゃ、{上着|うわぎ}を{脱|ぬ}いで、ここに{横|よこ}になってください。……ここは{痛|いた}いですか。', ro: 'Sou desu ka. Ja, uwagi o nuide, koko ni yoko ni natte kudasai. …… Koko wa itai desu ka.', vi: 'Vậy à. Anh cởi áo khoác rồi nằm xuống đây. … Chỗ này có đau không?' },
        { who: 'マルコ', role: 'b', text: 'はい、{痛|いた}いです。', ro: 'Hai, itai desu.', vi: 'Có, đau ạ.' },
        { who: '{医者|いしゃ}', role: 'examiner', text: '{大丈夫|だいじょうぶ}ですよ。{薬|くすり}を{出|だ}しますから、{薬局|やっきょく}でもらってください。{今日|きょう}は{柔|やわ}らかいものを{食|た}べたほうがいいですね。{冷|つめ}たいものは{飲|の}んだり{食|た}べたりしないでください。', ro: 'Daijoubu desu yo. Kusuri o dashimasu kara, yakkyoku de moratte kudasai. Kyou wa yawarakai mono o tabeta hou ga ii desu ne. Tsumetai mono wa nondari tabetari shinaide kudasai.', vi: 'Không sao đâu. Tôi kê thuốc, anh nhận ở hiệu thuốc nhé. Hôm nay anh nên ăn đồ mềm. Đừng ăn uống đồ lạnh.' },
        { who: 'マルコ', role: 'b', text: 'はい、わかりました。ありがとうございました。', ro: 'Hai, wakarimashita. Arigatou gozaimashita.', vi: 'Vâng, tôi hiểu rồi. Cảm ơn bác sĩ.' },
        { who: '{医者|いしゃ}', role: 'examiner', text: 'お{大事|だいじ}に。', ro: 'Odaiji ni.', vi: 'Anh giữ gìn sức khoẻ nhé.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Ở hiệu thuốc — dặn cách uống',
      lines: [
        { who: '{薬剤師|やくざいし}', role: 'c', text: 'マルコさん。お{薬|くすり}です。この{白|しろ}い{薬|くすり}は{1日|いちにち}に{3回|さんかい}、ご{飯|はん}を{食|た}べてから{飲|の}んでください。', ro: 'Maruko-san. Okusuri desu. Kono shiroi kusuri wa ichinichi ni sankai, gohan o tabete kara nonde kudasai.', vi: 'Anh Marco. Thuốc của anh đây. Thuốc trắng này ngày 3 lần, uống sau khi ăn.' },
        { who: 'マルコ', role: 'b', text: '{1日|いちにち}に{3回|さんかい}、ご{飯|はん}を{食|た}べてからですね。', ro: 'Ichinichi ni sankai, gohan o tabete kara desu ne.', vi: 'Ngày 3 lần, sau khi ăn nhỉ.' },
        { who: '{薬剤師|やくざいし}', role: 'c', text: 'はい。それから、この{小|ちい}さい{薬|くすり}は{寝|ね}る{前|まえ}に{1|ひと}つ{飲|の}んでください。{飲|の}む{前|まえ}に、よく{説明書|せつめいしょ}を{読|よ}んでくださいね。', ro: 'Hai. Sorekara, kono chiisai kusuri wa neru mae ni hitotsu nonde kudasai. Nomu mae ni, yoku setsumeisho o yonde kudasai ne.', vi: 'Vâng. Còn viên nhỏ này thì uống một viên trước khi ngủ. Trước khi uống nhớ đọc kỹ tờ hướng dẫn nhé.' },
        { who: 'マルコ', role: 'b', text: 'あのう、{今日|きょう}、お{風呂|ふろ}に{入|はい}ってもいいですか。', ro: 'Anou, kyou, ofuro ni haitte mo ii desu ka.', vi: 'Dạ, hôm nay tôi tắm bồn được không?' },
        { who: '{薬剤師|やくざいし}', role: 'c', text: '{熱|ねつ}がありませんから、シャワーを{浴|あ}びてもいいですよ。でも、{長|なが}くお{風呂|ふろ}に{入|はい}らないほうがいいです。お{大事|だいじ}に。', ro: 'Netsu ga arimasen kara, shawaa o abite mo ii desu yo. Demo, nagaku ofuro ni hairanai hou ga ii desu. Odaiji ni.', vi: 'Anh không sốt nên tắm vòi sen thì được. Nhưng đừng ngâm bồn lâu thì hơn. Anh giữ gìn sức khoẻ nhé.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{靴|くつ}を{脱|ぬ}いでから、{入|はい}ってください。', ro: 'Kutsu o nuide kara, haitte kudasai.', vi: 'Cởi giày rồi (mới) vào. — ポイント 107' },
        { en: '{保険証|ほけんしょう}を{出|だ}してから、{待合室|まちあいしつ}で{待|ま}ってください。', ro: 'Hokenshou o dashite kara, machiaishitsu de matte kudasai.', vi: 'Nộp thẻ bảo hiểm xong thì chờ ở phòng chờ. — ポイント 107' },
        { en: 'どうしましたか。——{昨日|きのう}からのどが{痛|いた}いんです。', ro: 'Dou shimashita ka. — Kinou kara nodo ga itai n desu.', vi: 'Anh/chị bị làm sao? — Tôi đau họng từ hôm qua. (câu bác sĩ hỏi)' },
        { en: 'いつからですか。——{走|はし}ってから、{痛|いた}くなりました。', ro: 'Itsu kara desu ka. — Hashitte kara, itaku narimashita.', vi: 'Từ bao giờ? — Sau khi chạy thì bị đau. — ポイント 107 + 95' },
        { en: '{何|なに}か{薬|くすり}を{飲|の}みましたか。——はい、{1時間|いちじかん}{前|まえ}に{飲|の}みました。', ro: 'Nanika kusuri o nomimashita ka. — Hai, ichijikan mae ni nomimashita.', vi: 'Đã uống thuốc gì chưa? — Rồi, tôi uống cách đây 1 tiếng. — ポイント 106' },
        { en: 'この{薬|くすり}を{飲|の}む{前|まえ}に、よく{説明書|せつめいしょ}を{読|よ}んでください。', ro: 'Kono kusuri o nomu mae ni, yoku setsumeisho o yonde kudasai.', vi: 'Trước khi uống thuốc này hãy đọc kỹ tờ hướng dẫn. — ポイント 106' },
        { en: '{食事|しょくじ}の{30分|さんじゅっぷん}{前|まえ}に、この{薬|くすり}を{飲|の}んでください。', ro: 'Shokuji no sanjuppun mae ni, kono kusuri o nonde kudasai.', vi: 'Uống thuốc này 30 phút trước bữa ăn. — ポイント 106 (N の + thời gian + 前に)' },
      ],
    },

    /* ── 話読聞書 ── */
    { t: 'h', text: '④ Nói–Đọc–Nghe–Viết (話読聞書) — {体|からだ}にいいこと (Việc tốt cho sức khoẻ)' },
    {
      t: 'p',
      text: 'Bài đọc mẫu (viết mới, cùng kiểu với sách): ダニエル kể **việc tốt cho sức khoẻ** mà anh làm mỗi ngày — **làm gì**, **bao lâu / bao nhiêu** (どのくらい), **làm thế nào** (どうやって) — rồi khuyên người đọc. Đọc to, rồi viết đoạn của bạn theo khung bên dưới.',
    },
    {
      t: 'passage',
      title: '{私|わたし}の{体|からだ}にいいこと',
      paras: [
        { text: '{皆|みな}さんは{何|なに}か{体|からだ}にいいことをしていますか。{私|わたし}は{毎朝|まいあさ}、{学校|がっこう}へ{行|い}く{前|まえ}に、{公園|こうえん}を{30分|さんじゅっぷん}{走|はし}っています。{走|はし}ってから、シャワーを{浴|あ}びて、{朝|あさ}ご{飯|はん}を{食|た}べます。{朝|あさ}ご{飯|はん}は{自分|じぶん}で{作|つく}ります。{卵|たまご}と{野菜|やさい}と{果物|くだもの}をたくさん{食|た}べます。それから、{夜|よる}は{寝|ね}る{前|まえ}に、{携帯|けいたい}を{見|み}ません。{毎晩|まいばん}{7時間|ななじかん}{以上|いじょう}{寝|ね}ます。{前|まえ}はよく{風邪|かぜ}をひきましたが、{今|いま}はとても{元気|げんき}です。{皆|みな}さんもできるだけ{運動|うんどう}をしたほうがいいですよ。' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{皆|みな}さんは{何|なに}か{体|からだ}にいいことをしていますか。', ro: 'Minasan wa nanika karada ni ii koto o shite imasu ka.', vi: 'Mọi người có làm việc gì tốt cho sức khoẻ không?' },
        { en: '{私|わたし}は{毎朝|まいあさ}、{学校|がっこう}へ{行|い}く{前|まえ}に、{公園|こうえん}を{30分|さんじゅっぷん}{走|はし}っています。', ro: 'Watashi wa maiasa, gakkou e iku mae ni, kouen o sanjuppun hashitte imasu.', vi: 'Sáng nào trước khi đến trường tôi cũng chạy 30 phút trong công viên. — ポイント 106 + ています (thói quen, Bài 11)' },
        { en: '{走|はし}ってから、シャワーを{浴|あ}びて、{朝|あさ}ご{飯|はん}を{食|た}べます。', ro: 'Hashitte kara, shawaa o abite, asagohan o tabemasu.', vi: 'Chạy xong tôi tắm vòi sen rồi ăn sáng. — ポイント 107' },
        { en: '{朝|あさ}ご{飯|はん}は{自分|じぶん}で{作|つく}ります。', ro: 'Asagohan wa jibun de tsukurimasu.', vi: 'Bữa sáng tôi tự nấu.' },
        { en: '{毎晩|まいばん}{7時間|ななじかん}{以上|いじょう}{寝|ね}ます。', ro: 'Maiban nanajikan ijou nemasu.', vi: 'Tối nào tôi cũng ngủ từ 7 tiếng trở lên.' },
        { en: '{皆|みな}さんもできるだけ{運動|うんどう}をしたほうがいいですよ。', ro: 'Minasan mo dekirudake undou o shita hou ga ii desu yo.', vi: 'Mọi người cũng nên cố vận động càng nhiều càng tốt nhé. — ポイント 105' },
      ],
    },
    {
      t: 'note',
      title: 'Viết đoạn "Việc tốt cho sức khoẻ" theo khung (trả lời 3 câu gợi ý của sách)',
      items: [
        '**{何|なに}か{体|からだ}にいいことをしていますか** → {私|わたし}は{毎朝|まいあさ}／{毎晩|まいばん} ___ ています。',
        '**どのくらいしていますか** → {1日|いちにち}に ___ {分|ふん}／{時間|じかん}・{1週間|いっしゅうかん}に ___ {回|かい} ___ ています。',
        '**どうやってしていますか** → ___ {前|まえ}に、___。／___ てから、___。 (ポイント 106, 107)',
        '**Câu kết:** {皆|みな}さんも ___ たほうがいいですよ。 (ポイント 105)',
        'Từ ở chân bài đọc của sách: {材料|ざいりょう} (nguyên liệu), ジューサー (máy ép), キャベツ (bắp cải), トマト (cà chua), ニンジン (cà rốt).',
      ],
    },

    /* ── できる！ ── */
    { t: 'h', text: 'できる！— Đóng vai: người ốm, bạn, bác sĩ' },
    {
      t: 'p',
      text: 'Nhiệm vụ như sách: nhóm 3 người chọn vai **người ốm (病気の人)**, **bạn của người ốm**, **bác sĩ (医者)**. ① Người ốm nói chuyện với bạn (kể triệu chứng, bạn khuyên). ② Người ốm vào khám: bác sĩ **hỏi theo thẻ** rồi **dặn dò** (tự chọn trong thẻ). Dưới đây là thẻ gợi ý (viết lại bằng bảng) và một kịch bản mẫu.',
    },
    {
      t: 'table',
      caption: 'Thẻ của bác sĩ — hỏi bệnh nhân (患者に聞くこと) → câu hỏi hoàn chỉnh',
      head: ['Gợi ý trên thẻ', 'Bác sĩ hỏi', 'Romaji'],
      rows: [
        ['{熱|ねつ}があります', '{熱|ねつ}がありますか。', 'Netsu ga arimasu ka.'],
        ['のど／{頭|あたま}／おなかが{痛|いた}いです', 'のどが{痛|いた}いですか。', 'Nodo ga itai desu ka.'],
        ['{気持|きも}ちが{悪|わる}いです', '{気持|きも}ちが{悪|わる}いですか。', 'Kimochi ga warui desu ka.'],
        ['{食欲|しょくよく}がありません', '{食欲|しょくよく}がありますか。', 'Shokuyoku ga arimasu ka.'],
        ['せき／{鼻水|はなみず}が{出|で}ます', 'せきが{出|で}ますか。', 'Seki ga demasu ka.'],
        ['アレルギーがあります', 'アレルギーがありますか。', 'Arerugii ga arimasu ka.'],
        ['よく{寝|ね}ます', 'よく{寝|ね}ていますか。', 'Yoku nete imasu ka.'],
        ['{1日|いちにち}に{3回|さんかい}{食事|しょくじ}します', '{1日|いちにち}に{3回|さんかい}{食事|しょくじ}をしていますか。', 'Ichinichi ni sankai shokuji o shite imasu ka.'],
        ['お{酒|さけ}を{飲|の}みます', 'お{酒|さけ}を{飲|の}みますか。', 'Osake o nomimasu ka.'],
        ['たばこを{吸|す}います', 'たばこを{吸|す}いますか。', 'Tabako o suimasu ka.'],
        ['{最近|さいきん}ストレスがあります', '{最近|さいきん}、ストレスがありますか。', 'Saikin, sutoresu ga arimasu ka.'],
      ],
    },
    {
      t: 'table',
      caption: 'Thẻ của bác sĩ — dặn bệnh nhân (患者に言うこと, tự chọn) → câu dặn hoàn chỉnh',
      head: ['Gợi ý trên thẻ', 'Bác sĩ dặn', 'Romaji'],
      rows: [
        ['{早|はや}く{寝|ね}ます', '{今日|きょう}は{早|はや}く{寝|ね}たほうがいいです。', 'Kyou wa hayaku neta hou ga ii desu.'],
        ['ゆっくり{休|やす}みます', 'うちでゆっくり{休|やす}んでください。', 'Uchi de yukkuri yasunde kudasai.'],
        ['{1日|いちにち}に{3回|さんかい}{食事|しょくじ}をします', '{1日|いちにち}に{3回|さんかい}{食事|しょくじ}をしたほうがいいです。', 'Ichinichi ni sankai shokuji o shita hou ga ii desu.'],
        ['{1日|いちにち}に＿{回|かい}{薬|くすり}を{飲|の}みます（＿{前|まえ}に・＿てから）', '{1日|いちにち}に{2回|にかい}、ご{飯|はん}を{食|た}べてから{薬|くすり}を{飲|の}んでください。', 'Ichinichi ni nikai, gohan o tabete kara kusuri o nonde kudasai.'],
        ['よく{手|て}を{洗|あら}って、うがいをします', 'よく{手|て}を{洗|あら}って、うがいをしてください。', 'Yoku te o aratte, ugai o shite kudasai.'],
        ['よく{目|め}を{洗|あら}います', 'よく{目|め}を{洗|あら}ったほうがいいです。', 'Yoku me o aratta hou ga ii desu.'],
        ['{出|で}かけるとき、マスクをします', '{出|で}かけるとき、マスクをしてください。', 'Dekakeru toki, masuku o shite kudasai.'],
        ['{柔|やわ}らかいものを{食|た}べます', '{柔|やわ}らかいものを{食|た}べたほうがいいです。', 'Yawarakai mono o tabeta hou ga ii desu.'],
        ['お{酒|さけ}を{飲|の}みません', 'お{酒|さけ}を{飲|の}まないほうがいいです。', 'Osake o nomanai hou ga ii desu.'],
        ['たばこを{吸|す}いません', 'たばこを{吸|す}わないほうがいいです。', 'Tabako o suwanai hou ga ii desu.'],
        ['シャワーを{浴|あ}びません', '{今日|きょう}はシャワーを{浴|あ}びないでください。', 'Kyou wa shawaa o abinaide kudasai.'],
        ['{冷|つめ}たいものを{飲|の}んだり、{食|た}べたりしません', '{冷|つめ}たいものを{飲|の}んだり{食|た}べたりしないでください。', 'Tsumetai mono o nondari tabetari shinaide kudasai.'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Kịch bản mẫu — ① người ốm và bạn',
      lines: [
        { who: 'アンナ', role: 'c', text: 'ワンさん、どうしたんですか。', ro: 'Wan-san, dou shita n desu ka.', vi: 'Wang, cậu sao thế?' },
        { who: 'ワン', role: 'a', text: '{朝|あさ}から{頭|あたま}が{痛|いた}いんです。せきも{出|で}るんです。', ro: 'Asa kara atama ga itai n desu. Seki mo deru n desu.', vi: 'Từ sáng mình đau đầu. Còn bị ho nữa.' },
        { who: 'アンナ', role: 'c', text: '{大丈夫|だいじょうぶ}ですか。{早|はや}く{病院|びょういん}へ{行|い}ったほうがいいですよ。', ro: 'Daijoubu desu ka. Hayaku byouin e itta hou ga ii desu yo.', vi: 'Cậu có sao không? Nên đi bệnh viện sớm đi.' },
        { who: 'ワン', role: 'a', text: 'そうですね。{授業|じゅぎょう}が{終|お}わってから、{行|い}きます。', ro: 'Sou desu ne. Jugyou ga owatte kara, ikimasu.', vi: 'Ừ nhỉ. Hết giờ học mình sẽ đi.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Kịch bản mẫu — ② người ốm và bác sĩ',
      lines: [
        { who: '{医者|いしゃ}', role: 'examiner', text: 'どうしましたか。', ro: 'Dou shimashita ka.', vi: 'Cô bị làm sao?' },
        { who: 'ワン', role: 'a', text: '{頭|あたま}が{痛|いた}いんです。せきも{出|で}るんです。', ro: 'Atama ga itai n desu. Seki mo deru n desu.', vi: 'Tôi đau đầu. Cũng bị ho nữa.' },
        { who: '{医者|いしゃ}', role: 'examiner', text: 'いつからですか。{熱|ねつ}はありますか。', ro: 'Itsu kara desu ka. Netsu wa arimasu ka.', vi: 'Từ bao giờ? Có sốt không?' },
        { who: 'ワン', role: 'a', text: '{今朝|けさ}からです。{熱|ねつ}は{37度|さんじゅうななど}です。', ro: 'Kesa kara desu. Netsu wa sanjuunana do desu.', vi: 'Từ sáng nay ạ. Sốt 37 độ.' },
        { who: '{医者|いしゃ}', role: 'examiner', text: '{食欲|しょくよく}はありますか。よく{寝|ね}ていますか。', ro: 'Shokuyoku wa arimasu ka. Yoku nete imasu ka.', vi: 'Có ăn được không? Có ngủ đủ không?' },
        { who: 'ワン', role: 'a', text: '{食欲|しょくよく}はあります。でも、{最近|さいきん}、{試験|しけん}があって、あまり{寝|ね}ていないんです。', ro: 'Shokuyoku wa arimasu. Demo, saikin, shiken ga atte, amari nete inai n desu.', vi: 'Tôi vẫn ăn được. Nhưng dạo này có thi nên tôi ngủ không được bao nhiêu.' },
        { who: '{医者|いしゃ}', role: 'examiner', text: '{風邪|かぜ}ですね。{今日|きょう}は{早|はや}く{寝|ね}たほうがいいです。{出|で}かけるとき、マスクをしてください。{薬|くすり}は{1日|いちにち}に{3回|さんかい}、ご{飯|はん}を{食|た}べてから{飲|の}んでください。', ro: 'Kaze desu ne. Kyou wa hayaku neta hou ga ii desu. Dekakeru toki, masuku o shite kudasai. Kusuri wa ichinichi ni sankai, gohan o tabete kara nonde kudasai.', vi: 'Cảm rồi. Hôm nay cô nên ngủ sớm. Khi ra ngoài nhớ đeo khẩu trang. Thuốc ngày 3 lần, uống sau khi ăn.' },
        { who: 'ワン', role: 'a', text: 'はい、わかりました。ありがとうございました。', ro: 'Hai, wakarimashita. Arigatou gozaimashita.', vi: 'Vâng, tôi hiểu rồi. Cảm ơn bác sĩ.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */
/* Đủ 51 mục của trang ことば p.219: chủ đề 1 (17) = A 9 + B 8 · chủ đề 2 (18) = C 7 + D 11 ·
 * chủ đề 3 (16) = E 8 + F 8. */

const TU_VUNG: Lesson = {
  id: 'b12-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 51 từ của trang ことば Bài 12',
  goal: 'Thuộc đủ 51 từ của Bài 12 (triệu chứng, lời khuyên, bệnh viện – hiệu thuốc) và dùng được mỗi từ trong một câu kể bệnh, khuyên bạn hoặc làm thủ tục khám bệnh.',
  minutes: 45,
  blocks: [
    {
      t: 'p',
      text: 'Đủ **51 từ** trên trang ことば (p.219), giữ đúng 3 chủ đề của sách: **{体|からだ}の{調子|ちょうし}** (17 từ — nhóm A, B), **アドバイス** (18 từ — nhóm C, D), **{病院|びょういん}で** (16 từ — nhóm E, F). Từ Bài 8 cô không phát danh sách riêng nên đây là chuẩn. Số **1 / 2 / 3** sau động từ = nhóm động từ. **{出|だ}します** xuất hiện hai lần trên trang (chủ đề 2: {声|こえ}を{出|だ}します; chủ đề 3: {保険証|ほけんしょう}を{出|だ}します) — ở đây cũng tách hai mục như sách. Câu ví dụ chỉ dùng từ Bài 1–12. Cách học: bấm 🔊 → đọc to 3 lần → che nghĩa, tự nói.',
    },
    {
      t: 'note',
      title: 'Cách đọc romaji trong khoá',
      items: [
        'Trường âm viết theo đúng chữ kana: {病気|びょうき} → **byouki**, {調子|ちょうし} → choushi, {大丈夫|だいじょうぶ} → **daijoubu**, {保険証|ほけんしょう} → hokenshou, シャワー → **shawaa**.',
        'Âm ngắt っ viết đôi phụ âm: {薬局|やっきょく} → **yakkyoku**, ゆっくり → yukkuri.',
        'Âm ghép một nhịp: {病院|びょういん} **byouin** (4 nhịp: びょ・う・い・ん) ≠ {美容院|びよういん} biyouin (tiệm làm tóc, 5 nhịp).',
        '**～んです** viết tách: {痛|いた}いんです → **itai n desu**, {風邪|かぜ}なんです → kaze na n desu.',
      ],
    },

    { t: 'h', text: 'A. Sức khoẻ & triệu chứng (9 từ — chủ đề 1)' },
    {
      t: 'vocab',
      items: [
        { w: 'けが', pos: 'danh từ', ipa: 'kega', vi: 'vết thương, chấn thương (けがをします = bị thương)', ex: 'サッカーをして、{足|あし}にけがをしたんです。', exRo: 'Sakkaa o shite, ashi ni kega o shita n desu.', exVi: 'Tôi chơi bóng đá và bị thương ở chân.' },
        { w: '{食欲|しょくよく}', pos: 'danh từ', ipa: 'shokuyoku', vi: 'sự thèm ăn, cảm giác muốn ăn (食欲があります / ありません = ăn được / không muốn ăn)', ex: '{風邪|かぜ}をひいて、{食欲|しょくよく}がないんです。', exRo: 'Kaze o hiite, shokuyoku ga nai n desu.', exVi: 'Tôi bị cảm nên chẳng muốn ăn.' },
        { w: '{調子|ちょうし}', pos: 'danh từ', ipa: 'choushi', vi: 'tình trạng, thể trạng (体の調子 = tình trạng cơ thể; 調子がいい / 悪い)', ex: '{最近|さいきん}、{体|からだ}の{調子|ちょうし}がいいです。', exRo: 'Saikin, karada no choushi ga ii desu.', exVi: 'Dạo này người tôi khoẻ.' },
        { w: '{熱|ねつ}', pos: 'danh từ', ipa: 'netsu', vi: 'cơn sốt; nhiệt (熱があります = bị sốt)', ex: '{昨日|きのう}から{熱|ねつ}があるんです。', exRo: 'Kinou kara netsu ga aru n desu.', exVi: 'Tôi bị sốt từ hôm qua.' },
        { w: '{病気|びょうき}', pos: 'danh từ', ipa: 'byouki', vi: 'bệnh, ốm (病気になります = bị ốm)', ex: '{母|はは}は{病気|びょうき}で、{病院|びょういん}にいます。', exRo: 'Haha wa byouki de, byouin ni imasu.', exVi: 'Mẹ tôi bị ốm, đang ở bệnh viện.' },
        { w: 'のど', pos: 'danh từ', ipa: 'nodo', vi: 'cổ họng (のどが痛い = đau họng; Bài 10: のどがかわきます = khát)', ex: 'のどが{痛|いた}いですから、{今日|きょう}はカラオケに{行|い}きません。', exRo: 'Nodo ga itai desu kara, kyou wa karaoke ni ikimasen.', exVi: 'Vì đau họng nên hôm nay tôi không đi karaoke.' },
        { w: '{歯|は}', pos: 'danh từ', ipa: 'ha', vi: 'răng (歯が痛い = đau răng; 歯を磨きます = đánh răng)', ex: '{甘|あま}いものを{食|た}べて、{歯|は}が{痛|いた}くなりました。', exRo: 'Amai mono o tabete, ha ga itaku narimashita.', exVi: 'Ăn đồ ngọt xong thì bị đau răng.' },
        { w: '{飲|の}み{会|かい}', pos: 'danh từ', ipa: 'nomikai', vi: 'buổi nhậu, tiệc uống rượu (của lớp, công ty)', ex: '{今晩|こんばん}、アルバイトの{飲|の}み{会|かい}があります。', exRo: 'Konban, arubaito no nomikai ga arimasu.', exVi: 'Tối nay có buổi nhậu của chỗ làm thêm.' },
        { w: '～{度|ど}', pos: 'hậu tố', ipa: '~do', vi: '~ độ (nhiệt độ; 何度ですか = bao nhiêu độ?)', ex: '{熱|ねつ}は{何度|なんど}ですか。——{38度|さんじゅうはちど}です。', exRo: 'Netsu wa nando desu ka. — Sanjuuhachi do desu.', exVi: 'Sốt bao nhiêu độ? — 38 độ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Cách nói triệu chứng (ghép từ Bài 8, 10, 11, 12) — dùng với ～んです',
      head: ['Triệu chứng', 'Câu', 'Romaji'],
      rows: [
        ['Đau đầu', '{頭|あたま}が{痛|いた}いんです。', 'Atama ga itai n desu.'],
        ['Đau bụng', 'おなかが{痛|いた}いんです。', 'Onaka ga itai n desu.'],
        ['Đau họng', 'のどが{痛|いた}いんです。', 'Nodo ga itai n desu.'],
        ['Đau răng', '{歯|は}が{痛|いた}いんです。', 'Ha ga itai n desu.'],
        ['Sốt', '{熱|ねつ}があるんです。', 'Netsu ga aru n desu.'],
        ['Không muốn ăn', '{食欲|しょくよく}がないんです。', 'Shokuyoku ga nai n desu.'],
        ['Buồn nôn, khó chịu', '{気持|きも}ちが{悪|わる}いんです。', 'Kimochi ga warui n desu.'],
        ['Ho / sổ mũi', 'せきが{出|で}るんです。／{鼻水|はなみず}が{出|で}るんです。', 'Seki ga deru n desu. / Hanamizu ga deru n desu.'],
        ['Ngứa', '{目|め}がかゆいんです。', 'Me ga kayui n desu.'],
        ['Bị cảm', '{風邪|かぜ}をひいたんです。／{風邪|かぜ}なんです。', 'Kaze o hiita n desu. / Kaze na n desu.'],
        ['Bị thương', '{足|あし}にけがをしたんです。', 'Ashi ni kega o shita n desu.'],
        ['Bị bỏng', '{手|て}にやけどをしたんです。', 'Te ni yakedo o shita n desu.'],
        ['Người không khoẻ', '{体|からだ}の{調子|ちょうし}が{悪|わる}いんです。／よくないんです。', 'Karada no choushi ga warui n desu. / Yokunai n desu.'],
      ],
    },

    { t: 'h', text: 'B. Hỏi thăm, trả lời & động từ (8 từ — chủ đề 1)' },
    {
      t: 'vocab',
      items: [
        { w: '{治|なお}ります［{治|なお}る］1', pos: 'động từ nhóm 1', ipa: 'naorimasu [naoru]', vi: 'khỏi (bệnh), lành (風邪が治りました = khỏi cảm)', ex: 'おかげさまで、{風邪|かぜ}はもう{治|なお}りました。', exRo: 'Okagesama de, kaze wa mou naorimashita.', exVi: 'Nhờ trời, tôi khỏi cảm rồi.' },
        { w: '{悪|わる}い', pos: 'tính từ đuôi い', ipa: 'warui', vi: 'xấu, tồi; (sức khoẻ) không tốt (↔ いい)', ex: '{今日|きょう}は{体|からだ}の{調子|ちょうし}が{悪|わる}いんです。', exRo: 'Kyou wa karada no choushi ga warui n desu.', exVi: 'Hôm nay người tôi không khoẻ.' },
        { w: '{気持|きも}ちが{悪|わる}い', pos: 'cụm tính từ', ipa: 'kimochi ga warui', vi: 'buồn nôn, khó chịu trong người (cũng dùng: ghê, kinh)', ex: 'バスの{中|なか}で{気持|きも}ちが{悪|わる}くなりました。', exRo: 'Basu no naka de kimochi ga waruku narimashita.', exVi: 'Tôi thấy buồn nôn khi ở trên xe buýt.' },
        { w: '{大丈夫|だいじょうぶ}（な）', pos: 'tính từ đuôi な', ipa: 'daijoubu (na)', vi: 'không sao, ổn (大丈夫ですか = có sao không?)', ex: '{大丈夫|だいじょうぶ}ですか。——はい、もう{大丈夫|だいじょうぶ}です。', exRo: 'Daijoubu desu ka. — Hai, mou daijoubu desu.', exVi: 'Bạn có sao không? — Vâng, giờ ổn rồi.' },
        { w: '{早|はや}く', pos: 'phó từ', ipa: 'hayaku', vi: 'sớm; nhanh (早く帰ります = về sớm; 早く行ったほうがいい = nên đi sớm)', ex: '{先生|せんせい}、{今日|きょう}は{早|はや}く{帰|かえ}ってもいいですか。', exRo: 'Sensei, kyou wa hayaku kaette mo ii desu ka.', exVi: 'Thưa cô, hôm nay em về sớm được không ạ?' },
        { w: 'おかげさまで', pos: 'câu nói', ipa: 'okagesama de', vi: 'nhờ trời / nhờ anh chị (đáp lời hỏi thăm khi mọi việc tốt)', ex: 'お{母|かあ}さんは{元気|げんき}ですか。——はい、おかげさまで。', exRo: 'Okaasan wa genki desu ka. — Hai, okagesama de.', exVi: 'Mẹ bạn khoẻ không? — Vâng, nhờ trời vẫn khoẻ.' },
        { w: 'お{大事|だいじ}に', pos: 'câu nói', ipa: 'odaiji ni', vi: 'giữ gìn sức khoẻ nhé, mau khoẻ nhé (chỉ nói với người đang ốm / bị thương)', ex: 'それはいけませんね。お{大事|だいじ}に。', exRo: 'Sore wa ikemasen ne. Odaiji ni.', exVi: 'Thế thì không ổn rồi. Giữ gìn sức khoẻ nhé.' },
        { w: 'それはいけませんね', pos: 'câu nói', ipa: 'sore wa ikemasen ne', vi: 'thế thì không ổn / tội nghiệp quá (đáp khi nghe người khác bị ốm, gặp chuyện xấu)', ex: '{熱|ねつ}が{39度|さんじゅうきゅうど}あるんです。——それはいけませんね。', exRo: 'Netsu ga sanjuukyuu do aru n desu. — Sore wa ikemasen ne.', exVi: 'Tôi sốt 39 độ. — Thế thì không ổn rồi.' },
      ],
    },

    { t: 'h', text: 'C. Lời khuyên — danh từ (7 từ — chủ đề 2)' },
    {
      t: 'vocab',
      items: [
        { w: 'シャワー', pos: 'danh từ', ipa: 'shawaa', vi: 'vòi sen (シャワーを浴びます = tắm vòi sen)', ex: '{運動|うんどう}してから、シャワーを{浴|あ}びます。', exRo: 'Undou shite kara, shawaa o abimasu.', exVi: 'Vận động xong tôi tắm vòi sen.' },
        { w: '{睡眠|すいみん}', pos: 'danh từ', ipa: 'suimin', vi: 'giấc ngủ, việc ngủ', ex: '{睡眠|すいみん}はとても{大切|たいせつ}です。{毎晩|まいばん}よく{寝|ね}てください。', exRo: 'Suimin wa totemo taisetsu desu. Maiban yoku nete kudasai.', exVi: 'Giấc ngủ rất quan trọng. Tối nào cũng hãy ngủ cho đủ.' },
        { w: '{歯医者|はいしゃ}', pos: 'danh từ', ipa: 'haisha', vi: 'nha sĩ; phòng khám nha khoa (歯医者へ行きます)', ex: '{歯|は}が{痛|いた}いですから、{歯医者|はいしゃ}へ{行|い}ったほうがいいですよ。', exRo: 'Ha ga itai desu kara, haisha e itta hou ga ii desu yo.', exVi: 'Đau răng thì nên đi nha sĩ đấy.' },
        { w: 'やけど', pos: 'danh từ', ipa: 'yakedo', vi: 'vết bỏng (やけどをします = bị bỏng)', ex: '{料理|りょうり}を{作|つく}るとき、{手|て}にやけどをしました。', exRo: 'Ryouri o tsukuru toki, te ni yakedo o shimashita.', exVi: 'Lúc nấu ăn tôi bị bỏng tay.' },
        { w: 'こと', pos: 'danh từ', ipa: 'koto', vi: 'việc, điều (trừu tượng: 体にいいこと = việc tốt cho sức khoẻ; 楽しいこと = điều vui)', ex: '{何|なに}か{体|からだ}にいいことをしていますか。', exRo: 'Nanika karada ni ii koto o shite imasu ka.', exVi: 'Bạn có làm việc gì tốt cho sức khoẻ không?' },
        { w: 'もの', pos: 'danh từ', ipa: 'mono', vi: 'đồ, thứ (cụ thể: 冷たいもの = đồ lạnh; 柔らかいもの = đồ mềm)', ex: '{冷|つめ}たいものをたくさん{食|た}べないほうがいいです。', exRo: 'Tsumetai mono o takusan tabenai hou ga ii desu.', exVi: 'Không nên ăn nhiều đồ lạnh.' },
        { w: '{以上|いじょう}', pos: 'danh từ', ipa: 'ijou', vi: 'trở lên, hơn (8時間以上 = từ 8 tiếng trở lên)', ex: '{毎日|まいにち}{8時間|はちじかん}{以上|いじょう}{寝|ね}ています。', exRo: 'Mainichi hachijikan ijou nete imasu.', exVi: 'Ngày nào tôi cũng ngủ từ 8 tiếng trở lên.' },
      ],
    },

    { t: 'h', text: 'D. Lời khuyên — động từ, tính từ, phó từ (11 từ — chủ đề 2)' },
    {
      t: 'vocab',
      items: [
        { w: '{出|だ}します［{出|だ}す］1（{声|こえ}を{出|だ}します）', pos: 'động từ nhóm 1', ipa: 'dashimasu [dasu]', vi: 'phát ra, đưa ra (声を出します = nói thành tiếng, lên tiếng)', ex: 'のどが{痛|いた}いですから、{声|こえ}を{出|だ}さないほうがいいです。', exRo: 'Nodo ga itai desu kara, koe o dasanai hou ga ii desu.', exVi: 'Đau họng thì không nên nói (phát ra tiếng).' },
        { w: '{塗|ぬ}ります［{塗|ぬ}る］1', pos: 'động từ nhóm 1', ipa: 'nurimasu [nuru]', vi: 'bôi, thoa (thuốc); sơn', ex: 'やけどをしたんですか。この{薬|くすり}を{塗|ぬ}ったほうがいいですよ。', exRo: 'Yakedo o shita n desu ka. Kono kusuri o nutta hou ga ii desu yo.', exVi: 'Bạn bị bỏng à? Nên bôi thuốc này đấy.' },
        { w: '{浴|あ}びます［{浴|あ}びる］2', pos: 'động từ nhóm 2', ipa: 'abimasu [abiru]', vi: 'tắm (vòi sen) — シャワーを浴びます', ex: '{熱|ねつ}がありますから、シャワーを{浴|あ}びないでください。', exRo: 'Netsu ga arimasu kara, shawaa o abinaide kudasai.', exVi: 'Vì đang sốt nên đừng tắm vòi sen.' },
        { w: '{出|で}かけます［{出|で}かける］2', pos: 'động từ nhóm 2', ipa: 'dekakemasu [dekakeru]', vi: 'ra ngoài, đi ra ngoài (đi chơi, đi có việc)', ex: '{出|で}かけるとき、マスクをしたほうがいいです。', exRo: 'Dekakeru toki, masuku o shita hou ga ii desu.', exVi: 'Khi ra ngoài nên đeo khẩu trang.' },
        { w: '{運動|うんどう}・します［{運動|うんどう}・する］3', pos: 'động từ nhóm 3', ipa: 'undou shimasu [undou suru]', vi: 'vận động, tập thể dục (運動 = sự vận động)', ex: '{体|からだ}にいいですから、{毎日|まいにち}{運動|うんどう}をしたほうがいいです。', exRo: 'Karada ni ii desu kara, mainichi undou o shita hou ga ii desu.', exVi: 'Vì tốt cho sức khoẻ nên mỗi ngày nên vận động.' },
        { w: '{固|かた}い', pos: 'tính từ đuôi い', ipa: 'katai', vi: 'cứng (↔ 柔らかい mềm)', ex: '{歯|は}が{痛|いた}いときは、{固|かた}いものを{食|た}べないほうがいいです。', exRo: 'Ha ga itai toki wa, katai mono o tabenai hou ga ii desu.', exVi: 'Khi đau răng thì không nên ăn đồ cứng.' },
        { w: '{柔|やわ}らかい', pos: 'tính từ đuôi い', ipa: 'yawarakai', vi: 'mềm', ex: '{今日|きょう}は{柔|やわ}らかいものを{食|た}べてください。', exRo: 'Kyou wa yawarakai mono o tabete kudasai.', exVi: 'Hôm nay hãy ăn đồ mềm.' },
        { w: '{体|からだ}にいい', pos: 'cụm tính từ', ipa: 'karada ni ii', vi: 'tốt cho sức khoẻ, tốt cho cơ thể (↔ 体に悪い)', ex: '{野菜|やさい}は{体|からだ}にいいです。たばこは{体|からだ}に{悪|わる}いです。', exRo: 'Yasai wa karada ni ii desu. Tabako wa karada ni warui desu.', exVi: 'Rau tốt cho sức khoẻ. Thuốc lá có hại cho sức khoẻ.' },
        { w: '{自分|じぶん}で', pos: 'phó từ', ipa: 'jibun de', vi: 'tự mình, tự (làm) (自分 = bản thân)', ex: '{自分|じぶん}で{料理|りょうり}を{作|つく}っていますか。', exRo: 'Jibun de ryouri o tsukutte imasu ka.', exVi: 'Bạn có tự nấu ăn không?' },
        { w: 'できるだけ', pos: 'phó từ', ipa: 'dekirudake', vi: 'càng … càng tốt, hết mức có thể', ex: 'できるだけ{野菜|やさい}を{食|た}べたほうがいいです。', exRo: 'Dekirudake yasai o tabeta hou ga ii desu.', exVi: 'Nên ăn rau càng nhiều càng tốt.' },
        { w: 'ゆっくり', pos: 'phó từ', ipa: 'yukkuri', vi: 'thong thả, thoải mái (nghỉ ngơi); chậm rãi (ゆっくり休んでください = nghỉ ngơi cho khoẻ)', ex: '{今日|きょう}はうちでゆっくり{休|やす}んでください。', exRo: 'Kyou wa uchi de yukkuri yasunde kudasai.', exVi: 'Hôm nay hãy ở nhà nghỉ ngơi cho khoẻ. (câu mẫu của sách: ゆっくり休んでください)' },
      ],
    },

    { t: 'h', text: 'E. Bệnh viện & hiệu thuốc — danh từ (8 từ — chủ đề 3)' },
    {
      t: 'vocab',
      items: [
        { w: '{薬剤師|やくざいし}', pos: 'danh từ', ipa: 'yakuzaishi', vi: 'dược sĩ', ex: '{薬局|やっきょく}で{薬剤師|やくざいし}に{薬|くすり}をもらいました。', exRo: 'Yakkyoku de yakuzaishi ni kusuri o moraimashita.', exVi: 'Tôi nhận thuốc từ dược sĩ ở hiệu thuốc.' },
        { w: '{上着|うわぎ}', pos: 'danh từ', ipa: 'uwagi', vi: 'áo khoác, áo ngoài', ex: '{上着|うわぎ}を{脱|ぬ}いで、ここに{座|すわ}ってください。', exRo: 'Uwagi o nuide, koko ni suwatte kudasai.', exVi: 'Cởi áo khoác ra rồi ngồi đây.' },
        { w: 'コンタクトレンズ', pos: 'danh từ', ipa: 'kontakuto renzu', vi: 'kính áp tròng', ex: '{目|め}がかゆいときは、コンタクトレンズをしないほうがいいです。', exRo: 'Me ga kayui toki wa, kontakuto renzu o shinai hou ga ii desu.', exVi: 'Khi ngứa mắt thì không nên đeo kính áp tròng.' },
        { w: '{説明書|せつめいしょ}', pos: 'danh từ', ipa: 'setsumeisho', vi: 'tờ hướng dẫn, sách hướng dẫn sử dụng', ex: '{薬|くすり}を{飲|の}む{前|まえ}に、{説明書|せつめいしょ}を{読|よ}んでください。', exRo: 'Kusuri o nomu mae ni, setsumeisho o yonde kudasai.', exVi: 'Trước khi uống thuốc hãy đọc tờ hướng dẫn.' },
        { w: '（お）{風呂|ふろ}', pos: 'danh từ', ipa: '(o)furo', vi: 'bồn tắm, việc tắm bồn (お風呂に入ります = tắm bồn — dùng に入ります)', ex: '{今日|きょう}はお{風呂|ふろ}に{入|はい}らないほうがいいです。', exRo: 'Kyou wa ofuro ni hairanai hou ga ii desu.', exVi: 'Hôm nay không nên tắm bồn.' },
        { w: '{保険証|ほけんしょう}', pos: 'danh từ', ipa: 'hokenshou', vi: 'thẻ bảo hiểm y tế', ex: '{受付|うけつけ}で{保険証|ほけんしょう}を{出|だ}してください。', exRo: 'Uketsuke de hokenshou o dashite kudasai.', exVi: 'Hãy nộp thẻ bảo hiểm ở quầy tiếp tân.' },
        { w: '{待合室|まちあいしつ}', pos: 'danh từ', ipa: 'machiaishitsu', vi: 'phòng chờ (bệnh viện, nhà ga)', ex: '{名前|なまえ}を{呼|よ}びますから、{待合室|まちあいしつ}で{待|ま}ってください。', exRo: 'Namae o yobimasu kara, machiaishitsu de matte kudasai.', exVi: 'Chúng tôi sẽ gọi tên, xin chờ ở phòng chờ.' },
        { w: '{薬局|やっきょく}', pos: 'danh từ', ipa: 'yakkyoku', vi: 'hiệu thuốc, nhà thuốc', ex: '{病院|びょういん}の{前|まえ}の{薬局|やっきょく}で{薬|くすり}をもらいました。', exRo: 'Byouin no mae no yakkyoku de kusuri o moraimashita.', exVi: 'Tôi lấy thuốc ở hiệu thuốc trước bệnh viện.' },
      ],
    },

    { t: 'h', text: 'F. Bệnh viện & hiệu thuốc — động từ, tính từ (8 từ — chủ đề 3)' },
    {
      t: 'vocab',
      items: [
        { w: '{出|だ}します［{出|だ}す］1（{保険証|ほけんしょう}を{出|だ}します）', pos: 'động từ nhóm 1', ipa: 'dashimasu [dasu]', vi: 'nộp, đưa ra, xuất trình (giấy tờ); (bác sĩ) kê (thuốc) — 薬を出します', ex: '{保険証|ほけんしょう}を{出|だ}してください。', exRo: 'Hokenshou o dashite kudasai.', exVi: 'Xin xuất trình thẻ bảo hiểm. (câu mẫu của sách)' },
        { w: '{脱|ぬ}ぎます［{脱|ぬ}ぐ］1', pos: 'động từ nhóm 1', ipa: 'nugimasu [nugu]', vi: 'cởi (giày, áo, mũ) (↔ 着ます mặc, 履きます đi giày)', ex: '{靴|くつ}を{脱|ぬ}いでから、{入|はい}ってください。', exRo: 'Kutsu o nuide kara, haitte kudasai.', exVi: 'Cởi giày rồi mới vào.' },
        { w: '{走|はし}ります［{走|はし}る］1', pos: 'động từ nhóm 1', ipa: 'hashirimasu [hashiru]', vi: 'chạy (nhóm 1 dù đuôi る: 走らない, 走って)', ex: '{昨日|きのう}、たくさん{走|はし}ってから、{足|あし}が{痛|いた}くなりました。', exRo: 'Kinou, takusan hashitte kara, ashi ga itaku narimashita.', exVi: 'Hôm qua chạy nhiều xong thì bị đau chân.' },
        { w: '{待|ま}ちます［{待|ま}つ］1', pos: 'động từ nhóm 1', ipa: 'machimasu [matsu]', vi: 'chờ, đợi (người/việc + を)', ex: 'ここで{少|すこ}し{待|ま}ってください。', exRo: 'Koko de sukoshi matte kudasai.', exVi: 'Xin chờ ở đây một chút.' },
        { w: '{磨|みが}きます［{磨|みが}く］1', pos: 'động từ nhóm 1', ipa: 'migakimasu [migaku]', vi: 'đánh (răng), đánh bóng (歯を磨きます = đánh răng)', ex: '{歯|は}を{磨|みが}いてから、{寝|ね}ます。', exRo: 'Ha o migaite kara, nemasu.', exVi: 'Đánh răng xong rồi mới đi ngủ. (câu mẫu của ポイント 107)' },
        { w: '{横|よこ}になります［{横|よこ}になる］1', pos: 'động từ nhóm 1', ipa: 'yoko ni narimasu [yoko ni naru]', vi: 'nằm xuống (横 = bên cạnh, chiều ngang)', ex: 'ベッドに{横|よこ}になってください。', exRo: 'Beddo ni yoko ni natte kudasai.', exVi: 'Hãy nằm xuống giường.' },
        { w: '{準備|じゅんび}・します［{準備|じゅんび}・する］3', pos: 'động từ nhóm 3', ipa: 'junbi shimasu [junbi suru]', vi: 'chuẩn bị (準備 = sự chuẩn bị)', ex: '{薬|くすり}を{準備|じゅんび}しますから、{待合室|まちあいしつ}で{待|ま}ってください。', exRo: 'Kusuri o junbi shimasu kara, machiaishitsu de matte kudasai.', exVi: 'Chúng tôi chuẩn bị thuốc, xin chờ ở phòng chờ.' },
        { w: 'かゆい', pos: 'tính từ đuôi い', ipa: 'kayui', vi: 'ngứa', ex: '{目|め}がかゆいんです。', exRo: 'Me ga kayui n desu.', exVi: 'Tôi bị ngứa mắt.' },
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp trong từ bài 12',
      items: [
        '**{出|だ}します ↔ {出|で}ます ↔ {出|で}かけます**: 出**し**ます = đưa ra, nộp (**を**: 保険証を出します, 声を出します); 出ます = ra khỏi (**を**: 家を出ます) / chảy ra (**が**: せきが出ます); 出かけます = ra ngoài đi chơi, đi có việc.',
        '**お{風呂|ふろ}に{入|はい}ります ↔ シャワーを{浴|あ}びます**: bồn tắm dùng **に入ります** (~~お風呂を浴びます~~); vòi sen dùng **を浴びます**.',
        '**お{大事|だいじ}に** chỉ nói với **người đang ốm / bị thương** — không dùng để chào bình thường, không tự nói về mình.',
        '**それはいけませんね** ≠ "không được": ở đây là **lời cảm thông** ("thế thì tệ quá"). Còn ～てはいけません (cấm) học ở Bài 14.',
        '**{治|なお}ります** là tự động từ: **{風邪|かぜ}が{治|なお}りました** (cảm khỏi rồi). Không nói ~~風邪を治りました~~.',
        '**こと ↔ もの**: こと = việc, điều (trừu tượng: 体にいい**こと**をします); もの = đồ vật, thứ cầm/ăn được (冷たい**もの**を食べます).',
        '**{医者|いしゃ} ↔ {歯医者|はいしゃ}**: 歯医者 đọc **は**いしゃ (không phải ~~はいいしゃ~~). **{病院|びょういん} (byouin) ↔ {美容院|びよういん} (biyouin)** — chỉ khác một nhịp.',
        '**{走|はし}ります** trông như nhóm 2 nhưng là **nhóm 1**: 走**らない**, 走**って**, 走**った**.',
        '**{横|よこ}になります** (nằm xuống) ≠ {寝|ね}ます (ngủ, đi ngủ). Bác sĩ bảo nằm lên giường khám: **ベッドに横になってください**.',
      ],
    },

    { t: 'h', text: 'Từ thêm (sách có ở bài đọc, bài nghe, thẻ できる — chỉ cần nghe hiểu)' },
    {
      t: 'table',
      head: ['Từ / câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['{処方箋|しょほうせん}', 'shohousen', 'Đơn thuốc (chân bài nghe) — 処方箋を出します = kê đơn'],
        ['{赤|あか}い', 'akai', 'Đỏ (chân bài nghe) — 顔が赤い = mặt đỏ'],
        ['{材料|ざいりょう}', 'zairyou', 'Nguyên liệu (chân bài đọc)'],
        ['ジューサー', 'juusaa', 'Máy ép trái cây (chân bài đọc)'],
        ['キャベツ', 'kyabetsu', 'Bắp cải (chân bài đọc)'],
        ['トマト', 'tomato', 'Cà chua (chân bài đọc)'],
        ['ニンジン', 'ninjin', 'Cà rốt (chân bài đọc)'],
        ['{風邪|かぜ}をひきます', 'kaze o hikimasu', 'Bị cảm (ひきます — Bài 11)'],
        ['せき', 'seki', 'Ho (せきが出ます)'],
        ['{鼻水|はなみず}', 'hanamizu', 'Nước mũi (鼻水が出ます = sổ mũi)'],
        ['アレルギー', 'arerugii', 'Dị ứng'],
        ['ストレス', 'sutoresu', 'Căng thẳng (stress)'],
        ['マスク', 'masuku', 'Khẩu trang (マスクをします = đeo khẩu trang)'],
        ['うがい', 'ugai', 'Súc miệng, súc họng (うがいをします)'],
        ['{患者|かんじゃ}', 'kanja', 'Bệnh nhân (thẻ できる)'],
        ['{受付|うけつけ}', 'uketsuke', 'Quầy tiếp tân (Bài 9–10)'],
        ['{健康|けんこう}', 'kenkou', 'Sức khoẻ (健康チェック = kiểm tra sức khoẻ)'],
        ['{食事|しょくじ}', 'shokuji', 'Bữa ăn, việc ăn (食事の前に = trước bữa ăn)'],
        ['{医者|いしゃ}', 'isha', 'Bác sĩ (Bài 8)'],
        ['{口|くち}を{開|あ}けてください', 'kuchi o akete kudasai', 'Há miệng ra (bác sĩ nói)'],
        ['{1日|いちにち}に{3回|さんかい}', 'ichinichi ni sankai', '1 ngày 3 lần'],
        ['{4日分|よっかぶん}', 'yokkabun', 'Lượng dùng cho 4 ngày (trên túi thuốc)'],
        ['{食前|しょくぜん}・{食後|しょくご}', 'shokuzen / shokugo', 'Trước bữa ăn / sau bữa ăn (in trên túi thuốc)'],
        ['{体温計|たいおんけい}', 'taionkei', 'Nhiệt kế'],
        ['{早退|そうたい}・{欠席|けっせき}', 'soutai / kesseki', 'Về sớm / vắng mặt (mục tiêu できる của sách)'],
        ['{無理|むり}をしないでください', 'muri o shinaide kudasai', 'Đừng cố quá sức'],
        ['{眠|ねむ}そうです', 'nemusou desu', 'Trông buồn ngủ (眠い — Bài 11)'],
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b12-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp — ポイント 104–107: ～んです, ～たほうがいいです／～ないほうがいいです, ～前に, ～てから',
  goal: 'Đổi được câu sang thể thường (普通形) để ghép ～んです giải thích tình trạng, hỏi どうしたんですか, khuyên nên / không nên làm gì, nói "trước khi …" (và "… trước đây"), "làm A xong rồi mới B" — đủ để kể bệnh, khuyên bạn và nghe lời dặn của bác sĩ.',
  minutes: 80,
  blocks: [
    {
      t: 'p',
      text: 'Bài 12 có **4 điểm ngữ pháp** (ポイント 104–107), nhưng cả bốn đều **đứng sau một hình thái động từ**: thể thường (普通形), thể た, thể ない, thể từ điển, thể て. Nên trước tiên ôn nhanh **thể thường** và **thể た** (đã gặp ở Bài 11 — 表 p.283–284). Ba chủ đề của sách dùng chúng như sau: **{体|からだ}の{調子|ちょうし}** 104 · **アドバイス** 105 · **{病院|びょういん}で** 106, 107. Mỗi điểm: công thức → ví dụ → cặp hỏi–đáp → bảng thay thế → lỗi hay mắc.',
    },
    {
      t: 'table',
      caption: 'Bản đồ 4 điểm ngữ pháp',
      head: ['ポイント', 'Mẫu', 'Nghĩa', 'Ví dụ ngắn'],
      rows: [
        ['104', '{普通形|ふつうけい} ＋ んです（ナA／N：～なんです）', 'Giải thích tình trạng, lý do; hỏi với vẻ quan tâm', 'どうしたんですか。——{頭|あたま}が{痛|いた}いんです。'],
        ['105', 'Vた ／ Vない ＋ ほうがいいです', 'Nên V / không nên V (khuyên)', '{病院|びょういん}へ{行|い}ったほうがいいです。お{酒|さけ}を{飲|の}まないほうがいいです。'],
        ['106', 'V{辞書形|じしょけい}／Nの／［～{時間|じかん}・～{日|にち}］ ＋ {前|まえ}に、___', 'Trước khi V / trước N; ~ trước (cách đây ~)', '{寝|ね}る{前|まえ}に、{薬|くすり}を{飲|の}みます。{1週間|いっしゅうかん}{前|まえ}に、{風邪|かぜ}をひきました。'],
        ['107', 'Vて ＋ から、___', 'Làm V xong rồi (mới) …', '{歯|は}を{磨|みが}いてから、{寝|ね}ます。'],
      ],
    },

    /* ── Ôn: thể thường, thể た ── */
    { t: 'h', text: 'Trước tiên — Thể thường (普通形) và thể た (ôn Bài 10–11)' },
    {
      t: 'p',
      text: '**Thể thường** là dạng câu "không です／ます" — dạng dùng khi nói với bạn thân (Bài 11) và dạng **đứng trước** rất nhiều mẫu ngữ pháp (～んです, ～とき, ～と思います…). Mỗi loại từ có 4 dạng: khẳng định / phủ định / quá khứ / quá khứ phủ định. **Thể た** (quá khứ thể thường) chia **y hệt thể て**, chỉ đổi て→た, で→だ.',
    },
    {
      t: 'table',
      caption: 'Thể lịch sự (丁寧形) ↔ thể thường (普通形) — 表 p.284',
      head: ['Loại', 'Lịch sự (です／ます)', 'Thể thường', 'Romaji'],
      rows: [
        ['V', '{行|い}きます', '{行|い}く', 'iku'],
        ['V', '{行|い}きません', '{行|い}かない', 'ikanai'],
        ['V', '{行|い}きました', '{行|い}った', 'itta'],
        ['V', '{行|い}きませんでした', '{行|い}かなかった', 'ikanakatta'],
        ['V (ある)', 'あります／ありません', 'ある／**ない**', 'aru / nai'],
        ['V (ある)', 'ありました／ありませんでした', 'あった／**なかった**', 'atta / nakatta'],
        ['イA', '{痛|いた}いです／{痛|いた}くないです', '{痛|いた}い／{痛|いた}くない', 'itai / itakunai'],
        ['イA', '{痛|いた}かったです／{痛|いた}くなかったです', '{痛|いた}かった／{痛|いた}くなかった', 'itakatta / itakunakatta'],
        ['ナA', '{元気|げんき}です／{元気|げんき}じゃありません', '{元気|げんき}**だ**／{元気|げんき}じゃない', 'genki da / genki ja nai'],
        ['ナA', '{元気|げんき}でした／{元気|げんき}じゃありませんでした', '{元気|げんき}だった／{元気|げんき}じゃなかった', 'genki datta / genki ja nakatta'],
        ['N', '{風邪|かぜ}です／{風邪|かぜ}じゃありません', '{風邪|かぜ}**だ**／{風邪|かぜ}じゃない', 'kaze da / kaze ja nai'],
        ['N', '{風邪|かぜ}でした／{風邪|かぜ}じゃありませんでした', '{風邪|かぜ}だった／{風邪|かぜ}じゃなかった', 'kaze datta / kaze ja nakatta'],
      ],
    },
    {
      t: 'table',
      caption: 'Chia thể た theo nhóm (giống hệt thể て của Bài 7)',
      head: ['Nhóm', 'Đuôi thể ます', 'Thể た', 'Ví dụ'],
      rows: [
        ['1', '～います・～ちます・～ります', '～った', '{洗|あら}います → {洗|あら}った · {待|ま}ちます → {待|ま}った · {治|なお}ります → {治|なお}った'],
        ['1', '～みます・～びます・～にます', '～んだ', '{休|やす}みます → {休|やす}んだ · {飲|の}みます → {飲|の}んだ · {遊|あそ}びます → {遊|あそ}んだ'],
        ['1', '～きます', '～いた', '{磨|みが}きます → {磨|みが}いた · {書|か}きます → {書|か}いた (⚠ {行|い}きます → **{行|い}った**)'],
        ['1', '～ぎます', '～いだ', '{脱|ぬ}ぎます → {脱|ぬ}いだ · {泳|およ}ぎます → {泳|およ}いだ'],
        ['1', '～します', '～した', '{出|だ}します → {出|だ}した · {話|はな}します → {話|はな}した'],
        ['2', 'bỏ ます', '＋た', '{寝|ね}ます → {寝|ね}た · {浴|あ}びます → {浴|あ}びた · {出|で}かけます → {出|で}かけた'],
        ['3', 'します・{来|き}ます', 'した・{来|き}た', '{運動|うんどう}します → {運動|うんどう}した · {来|き}ます → {来|き}た'],
      ],
    },
    {
      t: 'table',
      caption: 'Động từ của Bài 12 — thể ます → từ điển → て → た → ない (học một lượt)',
      head: ['Thể ます', 'Nhóm', 'Từ điển', 'Thể て', 'Thể た', 'Thể ない', 'Nghĩa'],
      rows: [
        ['{治|なお}ります', '1', '{治|なお}る', '{治|なお}って', '{治|なお}った', '{治|なお}らない', 'khỏi'],
        ['{出|だ}します', '1', '{出|だ}す', '{出|だ}して', '{出|だ}した', '{出|だ}さない', 'đưa ra, phát ra'],
        ['{塗|ぬ}ります', '1', '{塗|ぬ}る', '{塗|ぬ}って', '{塗|ぬ}った', '{塗|ぬ}らない', 'bôi'],
        ['{脱|ぬ}ぎます', '1', '{脱|ぬ}ぐ', '{脱|ぬ}いで', '{脱|ぬ}いだ', '{脱|ぬ}がない', 'cởi'],
        ['{走|はし}ります', '1 ⚠', '{走|はし}る', '{走|はし}って', '{走|はし}った', '{走|はし}らない', 'chạy'],
        ['{待|ま}ちます', '1', '{待|ま}つ', '{待|ま}って', '{待|ま}った', '{待|ま}たない', 'chờ'],
        ['{磨|みが}きます', '1', '{磨|みが}く', '{磨|みが}いて', '{磨|みが}いた', '{磨|みが}かない', 'đánh (răng)'],
        ['{横|よこ}になります', '1', '{横|よこ}になる', '{横|よこ}になって', '{横|よこ}になった', '{横|よこ}にならない', 'nằm xuống'],
        ['{浴|あ}びます', '2', '{浴|あ}びる', '{浴|あ}びて', '{浴|あ}びた', '{浴|あ}びない', 'tắm (vòi sen)'],
        ['{出|で}かけます', '2', '{出|で}かける', '{出|で}かけて', '{出|で}かけた', '{出|で}かけない', 'ra ngoài'],
        ['{運動|うんどう}します', '3', '{運動|うんどう}する', '{運動|うんどう}して', '{運動|うんどう}した', '{運動|うんどう}しない', 'vận động'],
        ['{準備|じゅんび}します', '3', '{準備|じゅんび}する', '{準備|じゅんび}して', '{準備|じゅんび}した', '{準備|じゅんび}しない', 'chuẩn bị'],
        ['{飲|の}みます', '1', '{飲|の}む', '{飲|の}んで', '{飲|の}んだ', '{飲|の}まない', 'uống'],
        ['{休|やす}みます', '1', '{休|やす}む', '{休|やす}んで', '{休|やす}んだ', '{休|やす}まない', 'nghỉ'],
        ['{行|い}きます', '1 ⚠', '{行|い}く', '{行|い}って', '{行|い}った', '{行|い}かない', 'đi'],
        ['{吸|す}います', '1', '{吸|す}う', '{吸|す}って', '{吸|す}った', '{吸|す}わない', 'hút'],
        ['ひきます（{風邪|かぜ}を）', '1', 'ひく', 'ひいて', 'ひいた', 'ひかない', 'bị (cảm)'],
        ['{寝|ね}ます', '2', '{寝|ね}る', '{寝|ね}て', '{寝|ね}た', '{寝|ね}ない', 'ngủ'],
        ['{食|た}べます', '2', '{食|た}べる', '{食|た}べて', '{食|た}べた', '{食|た}べない', 'ăn'],
        ['{来|き}ます', '3', '{来|く}る', '{来|き}て', '{来|き}た', '{来|こ}ない', 'đến'],
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp khi đổi sang thể thường',
      items: [
        '**ナA và N**: thể thường khẳng định có **だ** ({元気|げんき}だ, {風邪|かぜ}だ) — nhưng khi ghép ～んです thì **だ → な**: {風邪|かぜ}**な**んです (xem ポイント 104).',
        '**イA không thêm だ**: {痛|いた}い (~~痛いだ~~). Quá khứ: {痛|いた}**かった** (~~痛いでした~~).',
        '**いい** chia theo **よ**: よくない, よかった, よくなかった (~~いくない~~, ~~いかった~~).',
        '**{行|い}きます → {行|い}った** (ngoại lệ duy nhất của nhóm ～きます). **{来|き}ます**: từ điển {来|く}る, ない {来|こ}ない, た {来|き}た — chữ 来 đổi âm ba kiểu.',
        '**ある → ない** (phủ định), không có ~~あらない~~.',
      ],
    },

    /* ── ポイント 104 ── */
    { t: 'h', text: 'ポイント 104 — 普通形 ＋ んです (Giải thích: "là vì…, chuyện là…")' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'V／イA thể thường ＋ んです',
          vi: 'Dùng khi **giải thích tình trạng, lý do** — nhất là khi người kia thấy bạn lạ (mặt tái, về sớm, vắng mặt) và hỏi. Nghe mềm, có cảm xúc hơn câu です／ます thường. Quá khứ, phủ định: đổi ở phần thể thường rồi mới + んです.',
          examples: [
            { en: '{熱|ねつ}があるんです。', ro: 'Netsu ga aru n desu.', vi: 'Tôi bị sốt (ấy mà). — câu mẫu của sách' },
            { en: 'けがをしたんです。', ro: 'Kega o shita n desu.', vi: 'Tôi bị thương (chuyện là thế). — câu mẫu của sách (quá khứ: した + んです)' },
            { en: '{頭|あたま}が{痛|いた}いんです。', ro: 'Atama ga itai n desu.', vi: 'Tôi đau đầu. — câu mẫu của sách (イA + んです)' },
            { en: '{食欲|しょくよく}がないんです。', ro: 'Shokuyoku ga nai n desu.', vi: 'Tôi không muốn ăn. (ある → ない)' },
            { en: '{昨日|きのう}、{全然|ぜんぜん}{寝|ね}なかったんです。', ro: 'Kinou, zenzen nenakatta n desu.', vi: 'Hôm qua tôi không ngủ được chút nào. (quá khứ phủ định)' },
            { en: '{昨日|きのう}は{頭|あたま}が{痛|いた}かったんです。', ro: 'Kinou wa atama ga itakatta n desu.', vi: 'Hôm qua tôi bị đau đầu. (イA quá khứ)' },
          ],
        },
        {
          formula: 'ナA／N ＋ なんです',
          vi: 'ナA và danh từ: **bỏ だ, thêm な** + んです (hộp của sách: {暇|ひま} → {暇|ひま}なんです, {風邪|かぜ} → {風邪|かぜ}なんです). Quá khứ thì giữ だった: {風邪|かぜ}だったんです.',
          examples: [
            { en: '{風邪|かぜ}なんです。', ro: 'Kaze na n desu.', vi: 'Tôi bị cảm. — câu mẫu của sách' },
            { en: '{今日|きょう}は{暇|ひま}なんです。', ro: 'Kyou wa hima na n desu.', vi: 'Hôm nay tôi rảnh (mà). — hộp của sách' },
            { en: '{野菜|やさい}が{好|す}きじゃないんです。', ro: 'Yasai ga suki ja nai n desu.', vi: 'Tôi không thích rau. (ナA phủ định: じゃない + んです)' },
            { en: '{昨日|きのう}は{病気|びょうき}だったんです。', ro: 'Kinou wa byouki datta n desu.', vi: 'Hôm qua tôi bị ốm. (N quá khứ)' },
          ],
        },
        {
          formula: 'どうしたんですか。 ／ どうしましたか。',
          vi: '**どうしたんですか** = "Bạn sao thế?" — hỏi khi **thấy** người kia có vẻ không ổn (quan tâm). **どうしましたか** là câu bác sĩ / nhân viên hay dùng ("Anh bị làm sao?"). Hai câu cùng trả lời bằng **～んです**.',
          examples: [
            { en: 'どうしたんですか。——{歯|は}が{痛|いた}いんです。', ro: 'Dou shita n desu ka. — Ha ga itai n desu.', vi: 'Sao thế? — Tôi đau răng.' },
            { en: '{昨日|きのう}、どうしたんですか。——{風邪|かぜ}をひいたんです。', ro: 'Kinou, dou shita n desu ka. — Kaze o hiita n desu.', vi: 'Hôm qua bạn làm sao thế? — Tôi bị cảm.' },
            { en: '（{医者|いしゃ}）どうしましたか。——のどが{痛|いた}いんです。', ro: '(Isha) Dou shimashita ka. — Nodo ga itai n desu.', vi: '(Bác sĩ) Anh bị làm sao? — Tôi đau họng.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Đổi câu thường → câu ～んです (4 loại từ)',
      head: ['Câu です／ます', 'Thể thường', 'Câu ～んです', 'Romaji'],
      rows: [
        ['{熱|ねつ}があります。', 'ある', '{熱|ねつ}があるんです。', 'Netsu ga aru n desu.'],
        ['{食欲|しょくよく}がありません。', 'ない', '{食欲|しょくよく}がないんです。', 'Shokuyoku ga nai n desu.'],
        ['{足|あし}にけがをしました。', 'した', '{足|あし}にけがをしたんです。', 'Ashi ni kega o shita n desu.'],
        ['{薬|くすり}を{飲|の}みませんでした。', '{飲|の}まなかった', '{薬|くすり}を{飲|の}まなかったんです。', 'Kusuri o nomanakatta n desu.'],
        ['のどが{痛|いた}いです。', '{痛|いた}い', 'のどが{痛|いた}いんです。', 'Nodo ga itai n desu.'],
        ['{体|からだ}の{調子|ちょうし}がよくないです。', 'よくない', '{体|からだ}の{調子|ちょうし}がよくないんです。', 'Karada no choushi ga yokunai n desu.'],
        ['{目|め}がかゆかったです。', 'かゆかった', '{目|め}がかゆかったんです。', 'Me ga kayukatta n desu.'],
        ['{今日|きょう}は{暇|ひま}です。', '{暇|ひま}だ', '{今日|きょう}は{暇|ひま}なんです。', 'Kyou wa hima na n desu.'],
        ['{風邪|かぜ}です。', '{風邪|かぜ}だ', '{風邪|かぜ}なんです。', 'Kaze na n desu.'],
        ['{昨日|きのう}は{休|やす}みでした。', '{休|やす}みだった', '{昨日|きのう}は{休|やす}みだったんです。', 'Kinou wa yasumi datta n desu.'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Cặp hỏi – đáp với ～んです',
      lines: [
        { who: 'A', role: 'a', text: 'どうしたんですか。{元気|げんき}がないですね。', ro: 'Dou shita n desu ka. Genki ga nai desu ne.', vi: 'Sao thế? Trông bạn không khoẻ.' },
        { who: 'B', role: 'b', text: '{昨日|きのう}からおなかが{痛|いた}いんです。', ro: 'Kinou kara onaka ga itai n desu.', vi: 'Tôi đau bụng từ hôm qua.' },
        { who: 'A', role: 'a', text: '{昨日|きのう}、{飲|の}み{会|かい}に{来|き}ませんでしたね。どうしたんですか。', ro: 'Kinou, nomikai ni kimasen deshita ne. Dou shita n desu ka.', vi: 'Hôm qua bạn không đến buổi nhậu nhỉ. Sao thế?' },
        { who: 'B', role: 'b', text: 'アルバイトがあったんです。', ro: 'Arubaito ga atta n desu.', vi: 'Tôi có ca làm thêm.' },
        { who: 'A', role: 'a', text: 'あれ？{今日|きょう}は{食|た}べないんですか。', ro: 'Are? Kyou wa tabenai n desu ka.', vi: 'Ơ? Hôm nay bạn không ăn à?' },
        { who: 'B', role: 'b', text: 'ええ、{歯|は}が{痛|いた}いんです。{固|かた}いものは{食|た}べることができないんです。', ro: 'Ee, ha ga itai n desu. Katai mono wa taberu koto ga dekinai n desu.', vi: 'Ừ, tôi đau răng. Đồ cứng thì không ăn được.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — どうしたんですか。——___んです。',
      head: ['Hỏi', 'Tình trạng (thể thường)', 'Câu trả lời'],
      rows: [
        ['どうしたんですか。', 'のどが{痛|いた}い', 'のどが{痛|いた}いんです。'],
        ['どうしたんですか。', '{熱|ねつ}がある', '{熱|ねつ}があるんです。'],
        ['どうしたんですか。', '{気持|きも}ちが{悪|わる}い', '{気持|きも}ちが{悪|わる}いんです。'],
        ['どうしたんですか。', '{食欲|しょくよく}がない', '{食欲|しょくよく}がないんです。'],
        ['どうしたんですか。', '{手|て}にやけどをした', '{手|て}にやけどをしたんです。'],
        ['{昨日|きのう}、どうしたんですか。', '{風邪|かぜ}をひいた', '{風邪|かぜ}をひいたんです。'],
        ['{昨日|きのう}、どうしたんですか。', '{熱|ねつ}が{39度|さんじゅうきゅうど}あった', '{熱|ねつ}が{39度|さんじゅうきゅうど}あったんです。'],
        ['どうしたんですか。', '{風邪|かぜ}だ → な', '{風邪|かぜ}なんです。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — ～んです',
      items: [
        '~~{風邪|かぜ}んです~~, ~~{風邪|かぜ}だんです~~ → **{風邪|かぜ}なんです**; ~~{暇|ひま}だんです~~ → **{暇|ひま}なんです**.',
        '~~{痛|いた}いですんです~~, ~~{熱|ねつ}がありますんです~~ → phải đổi sang **thể thường** trước: {痛|いた}いんです, {熱|ねつ}があるんです.',
        '~~{痛|いた}いなんです~~ → イA **không** thêm な: {痛|いた}いんです.',
        'Quá khứ đổi ở **phần trước んです**, không phải ở です: {風邪|かぜ}をひい**た**んです (~~ひくんでした~~).',
        'Đừng lạm dụng: nói thông tin bình thường ("tôi là sinh viên") thì dùng です. ～んです dùng khi **giải thích / hỏi lý do** cho tình huống trước mắt. Hỏi người trên bằng ～んですか về chuyện riêng tư có thể nghe tò mò — với bạn bè, thầy cô khi hỏi thăm ốm thì tự nhiên.',
        'Với bạn thân (thể thường, Bài 11): どうし**たの**？——{頭|あたま}が{痛|いた}**いんだ**／{痛|いた}**いの**。 (nghe hiểu là đủ).',
      ],
    },

    /* ── ポイント 105 ── */
    { t: 'h', text: 'ポイント 105 — Vた／Vない ほうがいいです (Nên / không nên)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'Vた ＋ ほうがいいです',
          vi: 'Khuyên **nên làm V**. Dùng **thể た** (dù nói về việc chưa làm). Thường kèm lý do ～から, cuối câu thêm **よ** (～ほうがいいですよ) cho mềm và nhiệt tình.',
          examples: [
            { en: '{野菜|やさい}をたくさん{食|た}べたほうがいいです。', ro: 'Yasai o takusan tabeta hou ga ii desu.', vi: 'Nên ăn nhiều rau. — câu mẫu của sách' },
            { en: '{早|はや}く{病院|びょういん}へ{行|い}ったほうがいいですよ。', ro: 'Hayaku byouin e itta hou ga ii desu yo.', vi: 'Bạn nên đi bệnh viện sớm đi.' },
            { en: '{歯|は}が{痛|いた}いんですか。{歯医者|はいしゃ}へ{行|い}ったほうがいいですよ。', ro: 'Ha ga itai n desu ka. Haisha e itta hou ga ii desu yo.', vi: 'Bạn đau răng à? Nên đi nha sĩ đấy.' },
            { en: 'この{薬|くすり}を{塗|ぬ}ったほうがいいです。', ro: 'Kono kusuri o nutta hou ga ii desu.', vi: 'Nên bôi thuốc này.' },
            { en: 'うちでゆっくり{休|やす}んだほうがいいですよ。', ro: 'Uchi de yukkuri yasunda hou ga ii desu yo.', vi: 'Bạn nên ở nhà nghỉ ngơi cho khoẻ.' },
          ],
        },
        {
          formula: 'Vない ＋ ほうがいいです',
          vi: 'Khuyên **không nên làm V**. Dùng **thể ない** (hiện tại) — KHÔNG dùng ~~なかった~~. Hay đi với **あまり** (không nên … nhiều) và **できるだけ** (cố hết mức đừng …).',
          examples: [
            { en: 'あまりお{酒|さけ}を{飲|の}まないほうがいいです。', ro: 'Amari osake o nomanai hou ga ii desu.', vi: 'Không nên uống rượu nhiều. — câu mẫu của sách' },
            { en: '{今日|きょう}はあまり{冷|つめ}たいものを{食|た}べないほうがいいですよ。', ro: 'Kyou wa amari tsumetai mono o tabenai hou ga ii desu yo.', vi: 'Hôm nay đừng ăn nhiều đồ lạnh thì hơn.' },
            { en: 'できるだけ{声|こえ}を{出|だ}さないほうがいいです。', ro: 'Dekirudake koe o dasanai hou ga ii desu.', vi: 'Cố hết mức đừng nói (phát ra tiếng) thì hơn.' },
            { en: '{熱|ねつ}がありますから、お{風呂|ふろ}に{入|はい}らないほうがいいです。', ro: 'Netsu ga arimasu kara, ofuro ni hairanai hou ga ii desu.', vi: 'Vì đang sốt nên không nên tắm bồn.' },
            { en: 'たばこは{体|からだ}に{悪|わる}いですから、{吸|す}わないほうがいいですよ。', ro: 'Tabako wa karada ni warui desu kara, suwanai hou ga ii desu yo.', vi: 'Thuốc lá có hại nên đừng hút thì hơn.' },
          ],
        },
        {
          formula: 'Người được khuyên đáp: はい、わかりました。／そうですね。／はい、そうします。',
          vi: 'Nhận lời khuyên: **はい、わかりました** (vâng, tôi hiểu rồi), **そうですね** (ừ nhỉ), **はい、そうします** (vâng, tôi sẽ làm thế).',
          examples: [
            { en: 'A：できるだけ{運動|うんどう}をしたほうがいいですよ。B：はい、わかりました。', ro: 'A: Dekirudake undou o shita hou ga ii desu yo. B: Hai, wakarimashita.', vi: 'A: Bạn nên cố vận động càng nhiều càng tốt. B: Vâng, tôi hiểu rồi.' },
            { en: 'A：{早|はや}く{寝|ね}たほうがいいですよ。B：そうですね。そうします。', ro: 'A: Hayaku neta hou ga ii desu yo. B: Sou desu ne. Sou shimasu.', vi: 'A: Bạn nên ngủ sớm đi. B: Ừ nhỉ. Tôi sẽ làm thế.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Cặp hỏi – đáp: khuyên bạn theo triệu chứng (言ってみよう p.212)',
      lines: [
        { who: 'A', role: 'a', text: 'どうしたんですか。', ro: 'Dou shita n desu ka.', vi: 'Sao thế?' },
        { who: 'B', role: 'b', text: '{昨日|きのう}の{夜|よる}から{頭|あたま}が{痛|いた}いんです。', ro: 'Kinou no yoru kara atama ga itai n desu.', vi: 'Tôi đau đầu từ tối qua.' },
        { who: 'A', role: 'a', text: '{大丈夫|だいじょうぶ}ですか。{今日|きょう}はうちでゆっくり{休|やす}んだほうがいいですよ。', ro: 'Daijoubu desu ka. Kyou wa uchi de yukkuri yasunda hou ga ii desu yo.', vi: 'Bạn có sao không? Hôm nay nên ở nhà nghỉ ngơi đi.' },
        { who: 'B', role: 'b', text: 'はい。', ro: 'Hai.', vi: 'Ừ.' },
        { who: 'A', role: 'a', text: '{毎日|まいにち}、{自分|じぶん}で{料理|りょうり}を{作|つく}っていますか。', ro: 'Mainichi, jibun de ryouri o tsukutte imasu ka.', vi: 'Ngày nào bạn cũng tự nấu ăn chứ?' },
        { who: 'B', role: 'b', text: 'いいえ、{全然|ぜんぜん}{作|つく}っていません。いつもコンビニのお{弁当|べんとう}です。', ro: 'Iie, zenzen tsukutte imasen. Itsumo konbini no obentou desu.', vi: 'Không, tôi chẳng nấu gì cả. Lúc nào cũng ăn cơm hộp cửa hàng tiện lợi.' },
        { who: 'A', role: 'a', text: 'そうですか。{体|からだ}にいいですから、できるだけ{自分|じぶん}で{作|つく}ったほうがいいですよ。', ro: 'Sou desu ka. Karada ni ii desu kara, dekirudake jibun de tsukutta hou ga ii desu yo.', vi: 'Vậy à. Vì tốt cho sức khoẻ nên bạn cố tự nấu thì hơn.' },
        { who: 'B', role: 'b', text: 'はい、わかりました。', ro: 'Hai, wakarimashita.', vi: 'Vâng, tôi hiểu rồi.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — (triệu chứng)んです → ___ほうがいいですよ',
      head: ['Triệu chứng', 'Lời khuyên (thể ます)', 'Câu khuyên'],
      rows: [
        ['{昨日|きのう}からおなかが{痛|いた}い', '{冷|つめ}たいものを{食|た}べません', 'あまり{冷|つめ}たいものを{食|た}べないほうがいいですよ。'],
        ['{朝|あさ}から{歯|は}が{痛|いた}い', '{歯医者|はいしゃ}へ{行|い}きます', '{歯医者|はいしゃ}へ{行|い}ったほうがいいですよ。'],
        ['{今朝|けさ}、やけどをした', '{薬|くすり}を{塗|ぬ}ります', '{薬|くすり}を{塗|ぬ}ったほうがいいですよ。'],
        ['おとといからのどが{痛|いた}い', '{声|こえ}を{出|だ}しません', 'できるだけ{声|こえ}を{出|だ}さないほうがいいですよ。'],
        ['{昨日|きのう}の{夜|よる}から{頭|あたま}が{痛|いた}い', 'うちでゆっくり{休|やす}みます', 'うちでゆっくり{休|やす}んだほうがいいですよ。'],
        ['{最近|さいきん}{体|からだ}の{調子|ちょうし}がよくない', '{運動|うんどう}をします', 'できるだけ{運動|うんどう}をしたほうがいいですよ。'],
        ['{最近|さいきん}すぐ{疲|つか}れる', '{8時間|はちじかん}{以上|いじょう}{寝|ね}ます', '{8時間|はちじかん}{以上|いじょう}{寝|ね}たほうがいいですよ。'],
        ['{熱|ねつ}がある', 'シャワーを{浴|あ}びません', 'シャワーを{浴|あ}びないほうがいいですよ。'],
        ['{目|め}がかゆい', 'コンタクトレンズをしません', 'コンタクトレンズをしないほうがいいですよ。'],
        ['{風邪|かぜ}をひいた', '{出|で}かけるとき、マスクをします', '{出|で}かけるとき、マスクをしたほうがいいですよ。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — ほうがいいです',
      items: [
        '~~{行|い}くほうがいいです~~ — sách dạy **thể た** cho câu khẳng định: {行|い}**った**ほうがいいです. (Người Nhật đôi khi nói 行くほうがいい, nhưng khi thi dùng た cho chắc.)',
        '~~{飲|の}まなかったほうがいいです~~ → **{飲|の}まない**ほうがいいです (phủ định dùng ない hiện tại).',
        '~~{休|やす}みたほうがいい~~ → thể た của {休|やす}みます là **{休|やす}んだ**: {休|やす}んだほうがいい. Chia sai thể た là lỗi hay gặp nhất.',
        'ほう**が**いい (không phải ~~ほうはいい~~, ~~ほうにいい~~).',
        'Đây là lời khuyên **khá mạnh**. Với thầy cô, người trên: nói nhẹ bằng câu hỏi (～たらどうですか — học sau) hoặc chỉ nói lý do. Với bạn bè, bác sĩ với bệnh nhân: dùng tự nhiên.',
        'Phân biệt: ～ないでください (Bài 10) = **nhờ / yêu cầu** đừng làm; ～ないほうがいいです = **khuyên** đừng làm (vì tốt cho người nghe).',
      ],
    },

    /* ── ポイント 106 ── */
    { t: 'h', text: 'ポイント 106 — V辞書形／Nの／［～時間・～日］前に、___ (Trước khi …)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'V{辞書形|じしょけい} ＋ {前|まえ}に、___',
          vi: 'Làm việc sau **trước khi** làm V. Động từ trước 前に **luôn ở thể từ điển** — kể cả khi cả câu nói về quá khứ (thì quá khứ nằm ở cuối câu).',
          examples: [
            { en: 'ご{飯|はん}を{食|た}べる{前|まえ}に、{薬|くすり}を{飲|の}みます。', ro: 'Gohan o taberu mae ni, kusuri o nomimasu.', vi: 'Tôi uống thuốc trước khi ăn cơm. — câu mẫu của sách' },
            { en: '{寝|ね}る{前|まえ}に、この{薬|くすり}を{塗|ぬ}ってください。', ro: 'Neru mae ni, kono kusuri o nutte kudasai.', vi: 'Hãy bôi thuốc này trước khi đi ngủ.' },
            { en: 'この{薬|くすり}を{飲|の}む{前|まえ}に、よく{説明書|せつめいしょ}を{読|よ}んでください。', ro: 'Kono kusuri o nomu mae ni, yoku setsumeisho o yonde kudasai.', vi: 'Trước khi uống thuốc này hãy đọc kỹ tờ hướng dẫn.' },
            { en: '{病院|びょういん}へ{来|く}る{前|まえ}に、{薬|くすり}を{飲|の}みました。', ro: 'Byouin e kuru mae ni, kusuri o nomimashita.', vi: 'Tôi đã uống thuốc trước khi đến bệnh viện. (quá khứ ở cuối câu; 来る vẫn là thể từ điển)' },
          ],
        },
        {
          formula: 'N の ＋ {前|まえ}に、___',
          vi: 'Trước **sự kiện N** (bữa ăn, giờ học, bài kiểm tra…). Nhớ **の**.',
          examples: [
            { en: '{食事|しょくじ}の{前|まえ}に、{手|て}を{洗|あら}います。', ro: 'Shokuji no mae ni, te o araimasu.', vi: 'Rửa tay trước bữa ăn. — câu mẫu của sách' },
            { en: '{朝|あさ}ご{飯|はん}の{前|まえ}に、{薬|くすり}を{飲|の}みました。', ro: 'Asagohan no mae ni, kusuri o nomimashita.', vi: 'Tôi đã uống thuốc trước bữa sáng.' },
            { en: '{食事|しょくじ}の{30分|さんじゅっぷん}{前|まえ}に、この{薬|くすり}を{飲|の}んでください。', ro: 'Shokuji no sanjuppun mae ni, kono kusuri o nonde kudasai.', vi: 'Hãy uống thuốc này 30 phút trước bữa ăn. (N の + khoảng thời gian + 前に)' },
          ],
        },
        {
          formula: '［～{時間|じかん}・～{日|にち}・～{週間|しゅうかん}…］ ＋ {前|まえ}に、___',
          vi: 'Khoảng thời gian + 前に = **cách đây ~, ~ trước** (tính từ bây giờ). Không có の.',
          examples: [
            { en: '{1週間|いっしゅうかん}{前|まえ}に、{風邪|かぜ}をひきました。', ro: 'Isshuukan mae ni, kaze o hikimashita.', vi: 'Tôi bị cảm cách đây một tuần. — câu mẫu của sách' },
            { en: '{1時間|いちじかん}{前|まえ}に、{薬|くすり}を{飲|の}みました。', ro: 'Ichijikan mae ni, kusuri o nomimashita.', vi: 'Tôi uống thuốc cách đây 1 tiếng.' },
            { en: '{3日|みっか}{前|まえ}に、{足|あし}にけがをしたんです。', ro: 'Mikka mae ni, ashi ni kega o shita n desu.', vi: 'Tôi bị thương ở chân 3 ngày trước.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Cặp hỏi – đáp: 何か薬を飲みましたか (言ってみよう p.216)',
      lines: [
        { who: '{医者|いしゃ}', role: 'examiner', text: '{何|なに}か{薬|くすり}を{飲|の}みましたか。', ro: 'Nanika kusuri o nomimashita ka.', vi: 'Anh/chị đã uống thuốc gì chưa?' },
        { who: 'A', role: 'a', text: 'はい、{昼|ひる}ご{飯|はん}を{食|た}べる{前|まえ}に{飲|の}みました。', ro: 'Hai, hirugohan o taberu mae ni nomimashita.', vi: 'Rồi ạ, tôi uống trước khi ăn trưa.' },
        { who: '{医者|いしゃ}', role: 'examiner', text: '{何|なに}か{薬|くすり}を{飲|の}みましたか。', ro: 'Nanika kusuri o nomimashita ka.', vi: 'Đã uống thuốc gì chưa?' },
        { who: 'B', role: 'b', text: 'はい、{昨日|きのう}、{寝|ね}る{前|まえ}に{飲|の}みました。', ro: 'Hai, kinou, neru mae ni nomimashita.', vi: 'Rồi ạ, tôi uống tối qua trước khi ngủ.' },
        { who: '{医者|いしゃ}', role: 'examiner', text: 'いつ{飲|の}みましたか。', ro: 'Itsu nomimashita ka.', vi: 'Uống lúc nào?' },
        { who: 'A', role: 'a', text: '{1時間|いちじかん}{前|まえ}に{飲|の}みました。', ro: 'Ichijikan mae ni nomimashita.', vi: 'Tôi uống cách đây 1 tiếng.' },
        { who: '{医者|いしゃ}', role: 'examiner', text: '{何|なに}か{薬|くすり}を{飲|の}みましたか。', ro: 'Nanika kusuri o nomimashita ka.', vi: 'Đã uống thuốc gì chưa?' },
        { who: 'B', role: 'b', text: 'いいえ、まだ{飲|の}んでいません。', ro: 'Iie, mada nonde imasen.', vi: 'Chưa ạ, tôi chưa uống. (まだ～ていません — Bài 10)' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — ___前に、___',
      head: ['Trước (V từ điển／Nの／thời gian)', 'Việc làm', 'Câu hoàn chỉnh'],
      rows: [
        ['{昼|ひる}ご{飯|はん}を{食|た}べます → {食|た}べる', '{薬|くすり}を{飲|の}みました', '{昼|ひる}ご{飯|はん}を{食|た}べる{前|まえ}に、{薬|くすり}を{飲|の}みました。'],
        ['{病院|びょういん}へ{来|き}ます → {来|く}る', '{薬|くすり}を{飲|の}みました', '{病院|びょういん}へ{来|く}る{前|まえ}に、{薬|くすり}を{飲|の}みました。'],
        ['{寝|ね}ます → {寝|ね}る', 'この{薬|くすり}を{塗|ぬ}ってください', '{寝|ね}る{前|まえ}に、この{薬|くすり}を{塗|ぬ}ってください。'],
        ['{出|で}かけます → {出|で}かける', 'マスクをします', '{出|で}かける{前|まえ}に、マスクをします。'],
        ['{運動|うんどう}します → {運動|うんどう}する', '{水|みず}を{飲|の}んだほうがいいです', '{運動|うんどう}する{前|まえ}に、{水|みず}を{飲|の}んだほうがいいです。'],
        ['{朝|あさ}ご{飯|はん} → {朝|あさ}ご{飯|はん}の', '{薬|くすり}を{飲|の}みました', '{朝|あさ}ご{飯|はん}の{前|まえ}に、{薬|くすり}を{飲|の}みました。'],
        ['{食事|しょくじ} → {食事|しょくじ}の{30分|さんじゅっぷん}', 'この{薬|くすり}を{飲|の}んでください', '{食事|しょくじ}の{30分|さんじゅっぷん}{前|まえ}に、この{薬|くすり}を{飲|の}んでください。'],
        ['{1時間|いちじかん}', '{薬|くすり}を{飲|の}みました', '{1時間|いちじかん}{前|まえ}に、{薬|くすり}を{飲|の}みました。'],
        ['{1週間|いっしゅうかん}', '{風邪|かぜ}をひきました', '{1週間|いっしゅうかん}{前|まえ}に、{風邪|かぜ}をひきました。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — 前に',
      items: [
        '~~{寝|ね}ます{前|まえ}に~~, ~~{寝|ね}た{前|まえ}に~~ → **{寝|ね}る{前|まえ}に** (luôn thể từ điển, kể cả chuyện hôm qua).',
        '~~{食事|しょくじ}{前|まえ}に~~ (thiếu の) → **{食事|しょくじ}の{前|まえ}に**. (Trên túi thuốc có chữ {食前|しょくぜん} — là từ ghép viết tắt, khác.)',
        '~~{1週間|いっしゅうかん}の{前|まえ}に~~ → khoảng thời gian **không có の**: {1週間|いっしゅうかん}{前|まえ}に.',
        '**{前|まえ}** ở Bài 2 là **phía trước (vị trí)**: {駅|えき}の{前|まえ}に (trước ga). Bài 12 là **trước (thời gian)**: {食事|しょくじ}の{前|まえ}に. Cùng chữ, cùng の — phân biệt bằng N là nơi hay là sự kiện.',
        '{来|き}ます → từ điển **{来|く}る**: {病院|びょういん}へ**{来|く}る**{前|まえ}に (~~来る~~ đọc くる, không phải きる).',
      ],
    },

    /* ── ポイント 107 ── */
    { t: 'h', text: 'ポイント 107 — Vて から、___ (Làm V xong rồi mới …)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'V1て ＋ から、V2',
          vi: 'Làm **V1 xong rồi (mới) làm V2** — nhấn mạnh **thứ tự**: V1 phải xong trước. Người dặn dùng để chỉ thủ tục (cởi giày rồi mới vào); người bệnh dùng để nói **từ lúc nào** bị (ăn tối xong thì bị đau).',
          examples: [
            { en: '{歯|は}を{磨|みが}いてから、{寝|ね}ます。', ro: 'Ha o migaite kara, nemasu.', vi: 'Đánh răng xong rồi mới đi ngủ. — câu mẫu của sách' },
            { en: '{靴|くつ}を{脱|ぬ}いでから、{入|はい}ってください。', ro: 'Kutsu o nuide kara, haitte kudasai.', vi: 'Cởi giày rồi mới vào.' },
            { en: 'ご{飯|はん}を{食|た}べてから、この{薬|くすり}を{飲|の}んでください。', ro: 'Gohan o tabete kara, kono kusuri o nonde kudasai.', vi: 'Ăn cơm xong rồi uống thuốc này.' },
            { en: '{昨日|きのう}、{晩|ばん}ご{飯|はん}を{食|た}べてから、{痛|いた}くなりました。', ro: 'Kinou, bangohan o tabete kara, itaku narimashita.', vi: 'Hôm qua, sau khi ăn tối thì bắt đầu đau.' },
            { en: '{今日|きょう}、アルバイトが{終|お}わってから、{病院|びょういん}へ{行|い}きます。', ro: 'Kyou, arubaito ga owatte kara, byouin e ikimasu.', vi: 'Hôm nay làm thêm xong tôi sẽ đi bệnh viện.' },
          ],
        },
        {
          formula: 'いつから（{痛|いた}い）ですか。 —— ～てから、～くなりました。',
          vi: 'Bác sĩ hỏi **いつから** (từ khi nào) → trả lời bằng **thời điểm + から** ({昨日|きのう}から) hoặc **～てから + ～くなりました** (Bài 10 ポイント 95).',
          examples: [
            { en: 'いつからですか。——{昨日|きのう}からです。', ro: 'Itsu kara desu ka. — Kinou kara desu.', vi: 'Từ bao giờ? — Từ hôm qua.' },
            { en: 'いつからですか。——{走|はし}ってから、{痛|いた}くなりました。', ro: 'Itsu kara desu ka. — Hashitte kara, itaku narimashita.', vi: 'Từ bao giờ? — Chạy xong thì bị đau.' },
            { en: 'おとといの{夜|よる}、うちへ{帰|かえ}ってから、のどが{痛|いた}くなりました。', ro: 'Ototoi no yoru, uchi e kaette kara, nodo ga itaku narimashita.', vi: 'Tối hôm kia, về nhà xong thì bị đau họng.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Cặp hỏi – đáp: ở bệnh viện (言ってみよう p.216)',
      lines: [
        { who: '{病院|びょういん}の{人|ひと}', role: 'c', text: '{靴|くつ}を{脱|ぬ}いでから、{入|はい}ってください。', ro: 'Kutsu o nuide kara, haitte kudasai.', vi: 'Cởi giày rồi mới vào.' },
        { who: 'A', role: 'a', text: 'はい。', ro: 'Hai.', vi: 'Vâng.' },
        { who: '{医者|いしゃ}', role: 'examiner', text: 'どうしましたか。', ro: 'Dou shimashita ka.', vi: 'Chị bị làm sao?' },
        { who: 'A', role: 'a', text: 'おなかがとても{痛|いた}いんです。', ro: 'Onaka ga totemo itai n desu.', vi: 'Tôi đau bụng lắm.' },
        { who: '{医者|いしゃ}', role: 'examiner', text: 'いつからですか。', ro: 'Itsu kara desu ka.', vi: 'Từ bao giờ?' },
        { who: 'A', role: 'a', text: '{昨日|きのう}、{晩|ばん}ご{飯|はん}を{食|た}べてから、{痛|いた}くなりました。', ro: 'Kinou, bangohan o tabete kara, itaku narimashita.', vi: 'Hôm qua, sau khi ăn tối thì bị đau.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — V1てから、V2',
      head: ['V1 (xong trước)', 'V2 (sau đó)', 'Câu hoàn chỉnh'],
      rows: [
        ['{靴|くつ}を{脱|ぬ}ぎます', '{入|はい}ってください', '{靴|くつ}を{脱|ぬ}いでから、{入|はい}ってください。'],
        ['{保険証|ほけんしょう}を{出|だ}します', '{待合室|まちあいしつ}で{待|ま}ってください', '{保険証|ほけんしょう}を{出|だ}してから、{待合室|まちあいしつ}で{待|ま}ってください。'],
        ['{名前|なまえ}を{書|か}きます', '{保険証|ほけんしょう}を{出|だ}してください', '{名前|なまえ}を{書|か}いてから、{保険証|ほけんしょう}を{出|だ}してください。'],
        ['{上着|うわぎ}を{脱|ぬ}ぎます', '{横|よこ}になってください', '{上着|うわぎ}を{脱|ぬ}いでから、{横|よこ}になってください。'],
        ['ご{飯|はん}を{食|た}べます', 'この{薬|くすり}を{飲|の}んでください', 'ご{飯|はん}を{食|た}べてから、この{薬|くすり}を{飲|の}んでください。'],
        ['{歯|は}を{磨|みが}きます', '{寝|ね}ます', '{歯|は}を{磨|みが}いてから、{寝|ね}ます。'],
        ['{運動|うんどう}します', 'シャワーを{浴|あ}びます', '{運動|うんどう}してから、シャワーを{浴|あ}びます。'],
        ['{走|はし}ります', '{足|あし}が{痛|いた}くなりました', '{走|はし}ってから、{足|あし}が{痛|いた}くなりました。'],
        ['{固|かた}いものを{食|た}べます', '{歯|は}が{痛|いた}くなりました', '{固|かた}いものを{食|た}べてから、{歯|は}が{痛|いた}くなりました。'],
        ['{手|て}を{洗|あら}います', 'うがいをします', '{手|て}を{洗|あら}ってから、うがいをします。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — てから',
      items: [
        '~~{食|た}べたから~~ = **vì đã ăn** (から lý do sau thể た)! "Ăn xong rồi" phải là **{食|た}べてから** (thể て).',
        '~~{食|た}べるから~~ = **vì sẽ ăn**. Luôn: thể **て** + から.',
        '**～てから** nhấn mạnh thứ tự của **2 việc**; **Vて、Vて、V** (Bài 7) chỉ kể nối tiếp nhiều việc. Bác sĩ dặn "phải ăn xong mới uống" → てから.',
        'Thì của cả câu nằm ở **V2**: {歯|は}を{磨|みが}いてから、{寝|ね}**ました** (quá khứ) / {寝|ね}**ます** (thói quen).',
        '**～前に ↔ ～てから** ngược nhau: {食|た}べる**前に**{飲|の}みます (uống trước khi ăn) ≠ {食|た}べて**から**{飲|の}みます (ăn xong mới uống). Nghe nhầm là uống thuốc sai giờ — bài nghe hiệu thuốc luôn gài bẫy này.',
      ],
    },

    /* ── Tổng kết ── */
    { t: 'h', text: 'Tổng kết — câu hỏi của Bài 12 và cách trả lời' },
    {
      t: 'table',
      head: ['Câu hỏi / câu nói', 'Tình huống', 'Trả lời mẫu', 'ポイント'],
      rows: [
        ['どうしたんですか。', 'Bạn thấy mình mệt', '{頭|あたま}が{痛|いた}いんです。／{風邪|かぜ}なんです。', '104'],
        ['{昨日|きのう}、どうしたんですか。', 'Hỏi vì sao hôm qua nghỉ', '{熱|ねつ}があったんです。', '104'],
        ['{大丈夫|だいじょうぶ}ですか。', 'Hỏi thăm', 'はい、おかげさまで、もう{治|なお}りました。', '—'],
        ['（{熱|ねつ}があるんです。）', 'Nghe người khác ốm', 'それはいけませんね。お{大事|だいじ}に。', '—'],
        ['～たほうがいいですよ。', 'Được khuyên', 'はい、わかりました。／そうですね。', '105'],
        ['どうしましたか。（{医者|いしゃ}）', 'Bác sĩ hỏi', 'のどが{痛|いた}いんです。', '104'],
        ['いつからですか。', 'Từ bao giờ', '{昨日|きのう}からです。／～てから、{痛|いた}くなりました。', '107'],
        ['{何|なに}か{薬|くすり}を{飲|の}みましたか。', 'Đã uống thuốc chưa', 'はい、{寝|ね}る{前|まえ}に{飲|の}みました。', '106'],
        ['いつ{薬|くすり}を{飲|の}みますか。', 'Hỏi lại dược sĩ', 'ご{飯|はん}を{食|た}べてから／{寝|ね}る{前|まえ}に{飲|の}みます。', '106, 107'],
      ],
    },
    {
      t: 'build',
      id: 'b12-np-ghep',
      title: 'Ghép câu — dùng đủ 4 điểm ngữ pháp',
      items: [
        { vi: 'Sao thế? — Tôi đau đầu.', chips: ['どうしたんですか。', '{頭|あたま}が', '{痛|いた}いんです', '{痛|いた}いなんです', 'を'], answer: ['どうしたんですか。', '{頭|あたま}が', '{痛|いた}いんです'], ro: 'Dou shita n desu ka. Atama ga itai n desu.' },
        { vi: 'Tôi bị cảm.', chips: ['{風邪|かぜ}', 'なんです', 'だんです', 'んです'], answer: ['{風邪|かぜ}', 'なんです'], ro: 'Kaze na n desu.' },
        { vi: 'Hôm qua tôi bị sốt.', chips: ['{昨日|きのう}、', '{熱|ねつ}が', 'あったんです', 'ありましたんです', 'を'], answer: ['{昨日|きのう}、', '{熱|ねつ}が', 'あったんです'], ro: 'Kinou, netsu ga atta n desu.' },
        { vi: 'Bạn nên đi bệnh viện sớm.', chips: ['{早|はや}く', '{病院|びょういん}へ', '{行|い}った', 'ほうがいいですよ', '{行|い}く', 'ほうはいいですよ'], answer: ['{早|はや}く', '{病院|びょういん}へ', '{行|い}った', 'ほうがいいですよ'], ro: 'Hayaku byouin e itta hou ga ii desu yo.' },
        { vi: 'Không nên uống nhiều rượu.', chips: ['あまり', 'お{酒|さけ}を', '{飲|の}まない', 'ほうがいいです', '{飲|の}まなかった', '{飲|の}んだ'], answer: ['あまり', 'お{酒|さけ}を', '{飲|の}まない', 'ほうがいいです'], ro: 'Amari osake o nomanai hou ga ii desu.' },
        { vi: 'Hôm nay nên ở nhà nghỉ ngơi cho khoẻ.', chips: ['{今日|きょう}は', 'うちで', 'ゆっくり', '{休|やす}んだ', 'ほうがいいです', '{休|やす}みた'], answer: ['{今日|きょう}は', 'うちで', 'ゆっくり', '{休|やす}んだ', 'ほうがいいです'], ro: 'Kyou wa uchi de yukkuri yasunda hou ga ii desu.' },
        { vi: 'Tôi uống thuốc trước khi ăn cơm.', chips: ['ご{飯|はん}を', '{食|た}べる', '{前|まえ}に、', '{薬|くすり}を', '{飲|の}みます', '{食|た}べた', '{食|た}べて'], answer: ['ご{飯|はん}を', '{食|た}べる', '{前|まえ}に、', '{薬|くすり}を', '{飲|の}みます'], ro: 'Gohan o taberu mae ni, kusuri o nomimasu.' },
        { vi: 'Rửa tay trước bữa ăn.', chips: ['{食事|しょくじ}の', '{前|まえ}に、', '{手|て}を', '{洗|あら}います', '{食事|しょくじ}', 'から'], answer: ['{食事|しょくじ}の', '{前|まえ}に、', '{手|て}を', '{洗|あら}います'], ro: 'Shokuji no mae ni, te o araimasu.' },
        { vi: 'Tôi bị cảm cách đây một tuần.', chips: ['{1週間|いっしゅうかん}', '{前|まえ}に、', '{風邪|かぜ}を', 'ひきました', 'の', 'から'], answer: ['{1週間|いっしゅうかん}', '{前|まえ}に、', '{風邪|かぜ}を', 'ひきました'], ro: 'Isshuukan mae ni, kaze o hikimashita.' },
        { vi: 'Đánh răng xong rồi đi ngủ.', chips: ['{歯|は}を', '{磨|みが}いて', 'から、', '{寝|ね}ます', '{磨|みが}いた', '{前|まえ}に、'], answer: ['{歯|は}を', '{磨|みが}いて', 'から、', '{寝|ね}ます'], ro: 'Ha o migaite kara, nemasu.' },
        { vi: 'Cởi giày rồi mới vào.', chips: ['{靴|くつ}を', '{脱|ぬ}いで', 'から、', '{入|はい}ってください', '{脱|ぬ}いだ', '{脱|ぬ}ぐ'], answer: ['{靴|くつ}を', '{脱|ぬ}いで', 'から、', '{入|はい}ってください'], ro: 'Kutsu o nuide kara, haitte kudasai.' },
        { vi: 'Hôm qua sau khi ăn tối thì bị đau.', chips: ['{昨日|きのう}、', '{晩|ばん}ご{飯|はん}を', '{食|た}べてから、', '{痛|いた}く', 'なりました', '{食|た}べたから、', '{痛|いた}いに'], answer: ['{昨日|きのう}、', '{晩|ばん}ご{飯|はん}を', '{食|た}べてから、', '{痛|いた}く', 'なりました'], ro: 'Kinou, bangohan o tabete kara, itaku narimashita.' },
        { vi: 'Uống thuốc này 30 phút trước bữa ăn.', chips: ['{食事|しょくじ}の', '{30分|さんじゅっぷん}', '{前|まえ}に、', 'この{薬|くすり}を', '{飲|の}んでください', 'から、'], answer: ['{食事|しょくじ}の', '{30分|さんじゅっぷん}', '{前|まえ}に、', 'この{薬|くすり}を', '{飲|の}んでください'], ro: 'Shokuji no sanjuppun mae ni, kono kusuri o nonde kudasai.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b12-np-kiem',
      title: 'Kiểm tra nhanh ngữ pháp Bài 12',
      items: [
        { q: 'Thể た của {休|やす}みます là:', options: ['{休|やす}みた', '{休|やす}んだ', '{休|やす}った', '{休|やす}いた'], correct: 1, why: '～みます → **～んだ** (giống thể て 休んで).' },
        { q: 'Thể た của {磨|みが}きます là:', options: ['{磨|みが}きた', '{磨|みが}った', '{磨|みが}いた', '{磨|みが}んだ'], correct: 2, why: '～きます → **～いた**.' },
        { q: '「どうしたんですか。」——「{風邪|かぜ}＿。」', options: ['んです', 'なんです', 'だんです', 'のんです'], correct: 1, why: 'N + **な**んです (ポイント 104).' },
        { q: '「どうしたんですか。」——「{頭|あたま}が＿。」', options: ['{痛|いた}いんです', '{痛|いた}いなんです', '{痛|いた}いですんです', '{痛|いた}いだんです'], correct: 0, why: 'イA + んです, không thêm な.' },
        { q: '"Hôm qua tôi bị sốt" (giải thích lý do vắng):', options: ['{熱|ねつ}がありますんです。', '{熱|ねつ}があったんです。', '{熱|ねつ}があるでした。', '{熱|ねつ}がありましたなんです。'], correct: 1, why: 'Thể thường quá khứ **あった** + んです.' },
        { q: '"Bạn nên đi nha sĩ":', options: ['{歯医者|はいしゃ}へ{行|い}ったほうがいいですよ。', '{歯医者|はいしゃ}へ{行|い}きたほうがいいですよ。', '{歯医者|はいしゃ}へ{行|い}ってほうがいいですよ。', '{歯医者|はいしゃ}へ{行|い}かないでほうがいいですよ。'], correct: 0, why: 'Thể た **{行|い}った** + ほうがいいです (ポイント 105).' },
        { q: '"Không nên uống nhiều đồ lạnh":', options: ['{冷|つめ}たいものを{飲|の}まなかったほうがいいです。', '{冷|つめ}たいものを{飲|の}まないほうがいいです。', '{冷|つめ}たいものを{飲|の}みませんほうがいいです。', '{冷|つめ}たいものを{飲|の}まないでほうがいいです。'], correct: 1, why: 'Phủ định: **Vない** + ほうがいいです.' },
        { q: '「＿{前|まえ}に、{歯|は}を{磨|みが}きます。」', options: ['{寝|ね}ます', '{寝|ね}る', '{寝|ね}た', '{寝|ね}て'], correct: 1, why: 'Thể từ điển + 前に (ポイント 106).' },
        { q: '「{昨日|きのう}、＿{前|まえ}に、{薬|くすり}を{飲|の}みました。」', options: ['{寝|ね}た', '{寝|ね}る', '{寝|ね}ました', '{寝|ね}て'], correct: 1, why: 'Dù nói về hôm qua, trước 前に vẫn là **thể từ điển**.' },
        { q: '「{食事|しょくじ}＿{前|まえ}に、{手|て}を{洗|あら}います。」', options: ['を', 'の', 'に', '—（không cần）'], correct: 1, why: 'N **の** 前に.' },
        { q: '"Tôi uống thuốc cách đây 1 tiếng":', options: ['{1時間|いちじかん}の{前|まえ}に{飲|の}みました。', '{1時間|いちじかん}{前|まえ}に{飲|の}みました。', '{1時間|いちじかん}から{飲|の}みました。', '{1時間|いちじかん}{前|まえ}で{飲|の}みました。'], correct: 1, why: 'Khoảng thời gian + 前に, **không có の**.' },
        { q: '"Ăn cơm xong rồi uống thuốc này":', options: ['ご{飯|はん}を{食|た}べたから、この{薬|くすり}を{飲|の}んでください。', 'ご{飯|はん}を{食|た}べてから、この{薬|くすり}を{飲|の}んでください。', 'ご{飯|はん}を{食|た}べるから、この{薬|くすり}を{飲|の}んでください。', 'ご{飯|はん}を{食|た}べる{前|まえ}に、この{薬|くすり}を{飲|の}んでください。'], correct: 1, why: '**Vて + から** (ポイント 107). 食べたから = "vì đã ăn".' },
        { q: '「いつからですか。」 — trả lời đúng:', options: ['{走|はし}ってから、{痛|いた}くなりました。', '{走|はし}ったから、{痛|いた}いになりました。', '{走|はし}る{前|まえ}に、{痛|いた}いです。', '{走|はし}りましたから、{痛|いた}くです。'], correct: 0, why: 'Vてから + イA‑く なりました.' },
        { q: 'Người bạn nói「{熱|ねつ}が{39度|さんじゅうきゅうど}あるんです。」— bạn đáp:', options: ['おかげさまで。', 'それはいけませんね。', 'よかったですね。', 'いただきます。'], correct: 1, why: 'Cảm thông khi nghe tin xấu: **それはいけませんね**.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const KANJI: Lesson = {
  id: 'b12-kanji',
  kind: 'kanji',
  title: 'Chữ Hán — trong từ vựng Bài 12',
  goal: 'Nhận mặt và đọc đúng mọi chữ Hán trong 51 từ của Bài 12 (triệu chứng, lời khuyên, bệnh viện – hiệu thuốc), đọc được câu không furigana như đề thi, và viết tay được các chữ ✍ hay gặp.',
  minutes: 35,
  blocks: [
    {
      t: 'p',
      text: 'Phần Reading của đề thi có **4 từ chữ Hán gạch chân, KHÔNG furigana (12 điểm)** — đó là chỗ nhiều bạn mất điểm. Học theo **cả từ** ({病気|びょうき}, {保険証|ほけんしょう}) chứ đừng học chữ rời. **Âm On** (音, gốc Hán) thường dùng khi hai chữ Hán đứng cạnh nhau; **âm Kun** (訓, âm Nhật) khi chữ đứng một mình hoặc có đuôi kana ({歯|は}, {治|なお}ります). Cột **Mức**: 👁 **nhận mặt** = đọc và hiểu là đủ (ưu tiên cho phần đọc); ✍ **nên viết** = ít nét, gặp rất nhiều, nên tập viết tay.',
    },
    {
      t: 'table',
      caption: '1. Cơ thể, triệu chứng, hỏi thăm (chủ đề 1)',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài', 'Mức'],
      rows: [
        ['体', 'タイ', 'からだ', 'THỂ (cơ thể)', '{体|からだ}の{調子|ちょうし}', '✍'],
        ['気', 'キ', '—', 'KHÍ', '{病気|びょうき} · {気持|きも}ち', '✍'],
        ['食', 'ショク', 'た(べる)', 'THỰC (ăn)', '{食欲|しょくよく}', '✍'],
        ['子', 'シ・ス', 'こ', 'TỬ (con)', '{調子|ちょうし} (シ)', '✍'],
        ['会', 'カイ', 'あ(う)', 'HỘI (gặp)', '{飲|の}み{会|かい}', '✍'],
        ['大', 'ダイ・タイ', 'おお(きい)', 'ĐẠI (to)', '{大丈夫|だいじょうぶ} · お{大事|だいじ}に', '✍'],
        ['早', 'ソウ', 'はや(い)', 'TẢO (sớm)', '{早|はや}く', '✍'],
        ['病', 'ビョウ', 'やまい', 'BỆNH', '{病気|びょうき}', '👁'],
        ['熱', 'ネツ', 'あつ(い)', 'NHIỆT (nóng)', '{熱|ねつ}', '👁'],
        ['歯', 'シ', 'は', 'XỈ (răng)', '{歯|は}', '👁'],
        ['欲', 'ヨク', 'ほ(しい)', 'DỤC (muốn)', '{食欲|しょくよく}', '👁'],
        ['調', 'チョウ', 'しら(べる)', 'ĐIỀU (điều chỉnh)', '{調子|ちょうし}', '👁'],
        ['飲', 'イン', 'の(む)', 'ẨM (uống)', '{飲|の}み{会|かい}', '👁'],
        ['度', 'ド', 'たび', 'ĐỘ', '～{度|ど}', '👁'],
        ['治', 'ジ・チ', 'なお(る)', 'TRỊ (chữa)', '{治|なお}ります', '👁'],
        ['悪', 'アク', 'わる(い)', 'ÁC (xấu)', '{悪|わる}い', '👁'],
        ['持', 'ジ', 'も(つ)', 'TRÌ (cầm)', '{気持|きも}ち', '👁'],
        ['丈', 'ジョウ', 'たけ', 'TRƯỢNG', '{大丈夫|だいじょうぶ}', '👁'],
        ['夫', 'フ・フウ', 'おっと', 'PHU (chồng)', '{大丈夫|だいじょうぶ} (ぶ)', '👁'],
        ['事', 'ジ', 'こと', 'SỰ (việc)', 'お{大事|だいじ}に', '👁'],
      ],
    },
    {
      t: 'table',
      caption: '2. Lời khuyên (chủ đề 2)',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài', 'Mức'],
      rows: [
        ['上', 'ジョウ', 'うえ・うわ', 'THƯỢNG (trên)', '{以上|いじょう} · {上着|うわぎ}', '✍'],
        ['出', 'シュツ', 'で(る)・だ(す)', 'XUẤT (ra)', '{出|だ}します · {出|で}かけます', '✍'],
        ['自', 'ジ', 'みずか(ら)', 'TỰ (tự mình)', '{自分|じぶん}で', '✍'],
        ['分', 'ブン・フン', 'わ(かる)', 'PHÂN', '{自分|じぶん} (ブン)', '✍'],
        ['医', 'イ', '—', 'Y (chữa bệnh)', '{歯医者|はいしゃ}', '👁'],
        ['者', 'シャ', 'もの', 'GIẢ (người)', '{歯医者|はいしゃ}', '👁'],
        ['睡', 'スイ', '—', 'THUỴ (ngủ)', '{睡眠|すいみん}', '👁'],
        ['眠', 'ミン', 'ねむ(い)', 'MIÊN (ngủ)', '{睡眠|すいみん}', '👁'],
        ['以', 'イ', '—', 'DĨ', '{以上|いじょう}', '👁'],
        ['塗', 'ト', 'ぬ(る)', 'ĐỒ (bôi)', '{塗|ぬ}ります', '👁'],
        ['浴', 'ヨク', 'あ(びる)', 'DỤC (tắm)', '{浴|あ}びます', '👁'],
        ['運', 'ウン', 'はこ(ぶ)', 'VẬN', '{運動|うんどう}', '👁'],
        ['動', 'ドウ', 'うご(く)', 'ĐỘNG', '{運動|うんどう}', '👁'],
        ['固', 'コ', 'かた(い)', 'CỐ (cứng)', '{固|かた}い', '👁'],
        ['柔', 'ジュウ', 'やわ(らかい)', 'NHU (mềm)', '{柔|やわ}らかい', '👁'],
      ],
    },
    {
      t: 'table',
      caption: '3. Bệnh viện & hiệu thuốc (chủ đề 3)',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài', 'Mức'],
      rows: [
        ['明', 'メイ', 'あか(るい)', 'MINH (sáng)', '{説明書|せつめいしょ}', '✍'],
        ['書', 'ショ', 'か(く)', 'THƯ (viết)', '{説明書|せつめいしょ}', '✍'],
        ['走', 'ソウ', 'はし(る)', 'TẨU (chạy)', '{走|はし}ります', '✍'],
        ['薬', 'ヤク', 'くすり', 'DƯỢC (thuốc)', '{薬剤師|やくざいし} · {薬局|やっきょく}', '👁'],
        ['剤', 'ザイ', '—', 'TỄ (thuốc pha)', '{薬剤師|やくざいし}', '👁'],
        ['師', 'シ', '—', 'SƯ (thầy)', '{薬剤師|やくざいし}', '👁'],
        ['局', 'キョク', '—', 'CỤC', '{薬局|やっきょく}', '👁'],
        ['着', 'チャク', 'き(る)', 'TRƯỚC (mặc)', '{上着|うわぎ} (ぎ)', '👁'],
        ['説', 'セツ', 'と(く)', 'THUYẾT (giảng)', '{説明書|せつめいしょ}', '👁'],
        ['風', 'フウ・フ', 'かぜ', 'PHONG (gió)', 'お{風呂|ふろ} (フ)', '👁'],
        ['呂', 'ロ', '—', 'LỮ', 'お{風呂|ふろ}', '👁'],
        ['保', 'ホ', 'たも(つ)', 'BẢO', '{保険証|ほけんしょう}', '👁'],
        ['険', 'ケン', 'けわ(しい)', 'HIỂM', '{保険証|ほけんしょう}', '👁'],
        ['証', 'ショウ', '—', 'CHỨNG (giấy chứng)', '{保険証|ほけんしょう}', '👁'],
        ['待', 'タイ', 'ま(つ)', 'ĐÃI (chờ)', '{待|ま}ちます · {待合室|まちあいしつ}', '👁'],
        ['合', 'ゴウ', 'あ(う)', 'HỢP', '{待合室|まちあいしつ} (あい)', '👁'],
        ['室', 'シツ', 'むろ', 'THẤT (phòng)', '{待合室|まちあいしつ}', '👁'],
        ['脱', 'ダツ', 'ぬ(ぐ)', 'THOÁT (cởi)', '{脱|ぬ}ぎます', '👁'],
        ['磨', 'マ', 'みが(く)', 'MA (mài)', '{磨|みが}きます', '👁'],
        ['横', 'オウ', 'よこ', 'HOÀNH (ngang)', '{横|よこ}になります', '👁'],
        ['準', 'ジュン', '—', 'CHUẨN', '{準備|じゅんび}', '👁'],
        ['備', 'ビ', 'そな(える)', 'BỊ', '{準備|じゅんび}', '👁'],
      ],
    },
    {
      t: 'table',
      caption: '4. Chữ đi kèm hay gặp trong bài (từ các bài trước — ôn)',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ', 'Mức'],
      rows: [
        ['邪', 'ジャ', '—', 'TÀ', '{風邪|かぜ} (đọc cả cụm)', '👁'],
        ['頭', 'トウ・ズ', 'あたま', 'ĐẦU', '{頭|あたま}', '👁'],
        ['痛', 'ツウ', 'いた(い)', 'THỐNG (đau)', '{痛|いた}い', '👁'],
        ['院', 'イン', '—', 'VIỆN', '{病院|びょういん}', '👁'],
        ['前', 'ゼン', 'まえ', 'TIỀN (trước)', '～{前|まえ}に', '✍'],
        ['回', 'カイ', 'まわ(る)', 'HỒI (lần)', '{1日|いちにち}に{3回|さんかい}', '✍'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ',
      items: [
        '**Hán Việt đoán nghĩa**: 病気 = BỆNH KHÍ (bệnh), 食欲 = THỰC DỤC (muốn ăn), 睡眠 = THUỴ MIÊN (giấc ngủ), 運動 = VẬN ĐỘNG, 自分 = TỰ PHÂN (bản thân), 説明書 = THUYẾT MINH THƯ (giấy thuyết minh = tờ hướng dẫn), 保険証 = BẢO HIỂM CHỨNG (thẻ bảo hiểm), 薬局 = DƯỢC CỤC, 薬剤師 = DƯỢC TỄ SƯ (dược sĩ), 準備 = CHUẨN BỊ, 以上 = DĨ THƯỢNG (trở lên).',
        '**歯** có chữ 止 ở trên + hàm răng (米 trong khung) ở dưới — nhìn như hàm răng. **歯医者** = răng + y + người = nha sĩ.',
        '**薬** = 艹 (cỏ) + 楽 (vui) — thuốc làm từ cỏ cây cho người vui khoẻ lại.',
        '**Đọc đặc biệt**: 風邪 **かぜ** (đọc cả cụm) · 大丈夫 だい**じょう**ぶ · 上着 **うわ**ぎ (上 đọc うわ) · 薬局 **やっ**きょく · 歯医者 **は**いしゃ · 待合室 **まちあい**しつ (hai chữ đầu đọc Kun) · 気持ち **き**もち.',
        '**体 ↔ 休**: 体 (cơ thể) = 亻 + 本; 休 (nghỉ) = 亻 + 木. Người tựa gốc cây là **nghỉ**; người + gốc (本) là **thân thể**.',
      ],
    },

    /* ── Đứng riêng hay đứng chung ── */
    { t: 'h', text: 'Đứng riêng hay đứng chung — một chữ, hai cách đọc' },
    {
      t: 'p',
      text: 'Cùng một chữ Hán, **đứng riêng** (thường có đuôi kana) thì đọc âm **Kun**; **ghép với chữ Hán khác** thì thường đọc âm **On**. Bảng dưới lấy chữ của Bài 12, cột phải là những từ ghép bạn sẽ gặp rất sớm (nhiều từ đã học ở bài trước) — đọc hàng ngang để thấy cùng một chữ đổi âm thế nào.',
    },
    {
      t: 'table',
      caption: 'Kun khi đứng riêng ↔ On trong từ ghép',
      head: ['Chữ', 'Đứng riêng (Kun)', 'Trong từ ghép (On)'],
      rows: [
        ['体', '{体|からだ} — cơ thể', '{体育|たいいく} — thể dục · {体温|たいおん} — thân nhiệt'],
        ['熱', '{熱|あつ}い — nóng (đồ vật, đồ uống)', '{熱|ねつ} — cơn sốt (đứng riêng nhưng đọc On!) · {情熱|じょうねつ} — nhiệt huyết'],
        ['歯', '{歯|は} — răng', '{歯科|しか} — nha khoa · {歯医者|はいしゃ} (đặc biệt: đọc は)'],
        ['食', '{食|た}べます — ăn', '{食欲|しょくよく} — thèm ăn · {食事|しょくじ} — bữa ăn · {食堂|しょくどう} — nhà ăn'],
        ['調', '{調|しら}べます — tra cứu', '{調子|ちょうし} — tình trạng'],
        ['子', '{子|こ}ども — trẻ con', '{調子|ちょうし} — tình trạng (シ) · {様子|ようす} — dáng vẻ (ス)'],
        ['飲', '{飲|の}みます — uống · {飲|の}み{会|かい}', '{飲食|いんしょく} — ăn uống'],
        ['会', '{会|あ}います — gặp', '{飲|の}み{会|かい} — buổi nhậu · {会社|かいしゃ} — công ty · {会話|かいわ} — hội thoại'],
        ['治', '{治|なお}ります — khỏi', '{政治|せいじ} — chính trị'],
        ['悪', '{悪|わる}い — xấu, không khoẻ', '{最悪|さいあく} — tệ nhất'],
        ['持', '{持|も}ちます — cầm · {気持|きも}ち — cảm giác', '{支持|しじ} — ủng hộ'],
        ['大', '{大|おお}きい — to', '{大丈夫|だいじょうぶ} · お{大事|だいじ}に · {大学|だいがく} (ダイ) · {大切|たいせつ} (タイ)'],
        ['早', '{早|はや}く — sớm, nhanh', '{早退|そうたい} — về sớm'],
        ['事', '{事|こと} — việc', 'お{大事|だいじ}に · {食事|しょくじ} — bữa ăn · {仕事|しごと} — công việc (ごと: đặc biệt)'],
        ['者', '{者|もの} — người (văn viết)', '{医者|いしゃ} · {歯医者|はいしゃ} — nha sĩ · {学者|がくしゃ} — học giả'],
        ['眠', '{眠|ねむ}い — buồn ngủ (B11)', '{睡眠|すいみん} — giấc ngủ'],
        ['上', '{上|うえ} — trên · {上着|うわぎ} (うわ)', '{以上|いじょう} — trở lên · {上手|じょうず} — giỏi'],
        ['出', '{出|で}ます・{出|だ}します・{出|で}かけます', '{出発|しゅっぱつ} — xuất phát · {出席|しゅっせき} — có mặt'],
        ['浴', '{浴|あ}びます — tắm (vòi sen)', '{入浴|にゅうよく} — tắm bồn (văn viết)'],
        ['運', '{運|はこ}びます — chở, mang', '{運動|うんどう} — vận động · {運転|うんてん} — lái xe (B9)'],
        ['動', '{動|うご}きます — chuyển động', '{運動|うんどう} · {動物|どうぶつ} — động vật (B10)'],
        ['分', '{分|わ}かります — hiểu', '{自分|じぶん} — bản thân (ブン) · {5分|ごふん} (フン) · {10分|じゅっぷん} (プン)'],
        ['固', '{固|かた}い — cứng', '{固定|こてい} — cố định'],
        ['柔', '{柔|やわ}らかい — mềm', '{柔道|じゅうどう} — nhu đạo (judo)'],
        ['薬', '{薬|くすり} — thuốc', '{薬局|やっきょく} (やく → **やっ**) · {薬剤師|やくざいし}'],
        ['着', '{着|き}ます — mặc · {上着|うわぎ} (ぎ)', '{到着|とうちゃく} — đến nơi'],
        ['明', '{明|あか}るい — sáng', '{説明|せつめい} — giải thích · {説明書|せつめいしょ}'],
        ['書', '{書|か}きます — viết', '{説明書|せつめいしょ} · {辞書|じしょ} — từ điển · {図書館|としょかん}'],
        ['風', '{風|かぜ} — gió', '{台風|たいふう} — bão · お{風呂|ふろ} (フ)'],
        ['待', '{待|ま}ちます — chờ · {待合室|まちあいしつ} (まち)', '{招待|しょうたい} — mời'],
        ['合', '{合|あ}います — hợp · {待合室|まちあいしつ} (あい)', '{集合|しゅうごう} — tập hợp (B10)'],
        ['室', '— (hầu như không đứng riêng)', '{教室|きょうしつ} — lớp học · {待合室|まちあいしつ} — phòng chờ'],
        ['走', '{走|はし}ります — chạy', '{走者|そうしゃ} — người chạy (văn viết)'],
        ['横', '{横|よこ} — bên cạnh, ngang · {横|よこ}になります', '{横断歩道|おうだんほどう} — vạch sang đường'],
        ['病', '{病|やまい} — bệnh (văn cổ)', '{病気|びょうき} · {病院|びょういん} — bệnh viện'],
      ],
    },
    {
      t: 'note',
      title: 'Cách đọc bất quy tắc hay gặp trong bài (thuộc lòng)',
      items: [
        '**Đọc cả cụm (熟字訓)** — không ghép từ âm từng chữ: {風邪|かぜ} (~~ふうじゃ~~), {今朝|けさ}, {今日|きょう}, {昨日|きのう}, {一日|ついたち} (ngày mùng 1) ≠ {1日|いちにち} (một ngày).',
        '**Kun + Kun + On** trong một từ: {待合室|まちあいしつ} = まち (Kun) + あい (Kun) + しつ (On). {上着|うわぎ} = うわ + ぎ (cả hai Kun, 着 đục thành ぎ).',
        '**Âm ngắt っ** khi On gặp phụ âm k: {薬|やく} + {局|きょく} → **やっ**きょく; {学|がく} + {校|こう} → **がっ**こう.',
        '**Một chữ nhiều âm**: 分 = ブン ({自分|じぶん}) / フン・プン ({5分|ごふん}, {10分|じゅっぷん}) / わ ({分|わ}かります); 大 = ダイ ({大丈夫|だいじょうぶ}) / タイ ({大切|たいせつ}) / おお ({大|おお}きい).',
        '**熱** đứng riêng mà đọc On (**ねつ** — cơn sốt); còn tính từ "nóng" là {熱|あつ}い (Kun). Hai từ khác nhau, cùng chữ.',
      ],
    },

    {
      t: 'mcq',
      id: 'b12-kj-doc',
      title: 'Đọc chữ Hán — chọn cách đọc đúng',
      items: [
        { q: '病気', options: ['びょうき', 'びょき', 'びょういん', 'やまいき'], correct: 0, why: '病 ビョウ + 気 キ = **びょうき** (trường âm).' },
        { q: '食欲', options: ['しょくよく', 'たべよく', 'しょくほし', 'しょよく'], correct: 0, why: '**しょくよく** — thèm ăn.' },
        { q: '調子', options: ['ちょうこ', 'ちょうし', 'ちょし', 'しらべこ'], correct: 1, why: '子 đọc **シ** ở đây: ちょうし.' },
        { q: '熱', options: ['あつ', 'ねつ', 'ねち', 'ひ'], correct: 1, why: 'Cơn sốt = **ねつ** (On đứng riêng).' },
        { q: '歯', options: ['し', 'は', 'ば', 'め'], correct: 1, why: 'Răng = **は**.' },
        { q: '飲み会', options: ['のみかい', 'のみあい', 'いんかい', 'のみえ'], correct: 0, why: '**のみかい** — buổi nhậu.' },
        { q: '治ります', options: ['なおります', 'ちります', 'じります', 'なります'], correct: 0, why: '**なおります** — khỏi.' },
        { q: '大丈夫', options: ['たいじょうぶ', 'だいじょうふ', 'だいじょうぶ', 'おおじょうぶ'], correct: 2, why: '**だいじょうぶ** (夫 đọc ぶ).' },
        { q: '気持ち', options: ['きもち', 'けもち', 'きじち', 'きもつ'], correct: 0, why: '**きもち**.' },
        { q: '睡眠', options: ['すいみん', 'すいめん', 'ねむみん', 'すみん'], correct: 0, why: '**すいみん** — giấc ngủ.' },
        { q: '歯医者', options: ['はいいしゃ', 'しいしゃ', 'はいしゃ', 'はいじゃ'], correct: 2, why: '**はいしゃ** (không lặp い).' },
        { q: '以上', options: ['いうえ', 'いじょう', 'いしょう', 'いぞう'], correct: 1, why: '**いじょう** — trở lên.' },
        { q: '運動', options: ['うんどう', 'うんど', 'うんとう', 'はこどう'], correct: 0, why: '**うんどう**.' },
        { q: '自分', options: ['じぶん', 'じふん', 'しぶん', 'じぷん'], correct: 0, why: '分 đọc **ブン** ở đây: じぶん.' },
        { q: '薬剤師', options: ['くすりざいし', 'やくざいし', 'やくさいし', 'やっざいし'], correct: 1, why: '**やくざいし** — dược sĩ.' },
        { q: '上着', options: ['うえぎ', 'じょうちゃく', 'うわぎ', 'うわき'], correct: 2, why: '上 đọc **うわ**, 着 đục **ぎ**: うわぎ.' },
        { q: '説明書', options: ['せつめいしょ', 'せつめしょ', 'せつみょうしょ', 'せいめいしょ'], correct: 0, why: '**せつめいしょ** — tờ hướng dẫn.' },
        { q: 'お風呂', options: ['おかぜろ', 'おふうろ', 'おふろ', 'おぶろ'], correct: 2, why: '風 đọc **フ**: おふろ.' },
        { q: '保険証', options: ['ほけんしょう', 'ほけんしょ', 'ほうけんしょう', 'ほけんじょう'], correct: 0, why: '**ほけんしょう** — thẻ bảo hiểm.' },
        { q: '待合室', options: ['たいごうしつ', 'まちあいしつ', 'まちごうしつ', 'まつあいしつ'], correct: 1, why: 'Hai chữ đầu đọc Kun: **まちあいしつ**.' },
        { q: '薬局', options: ['やくきょく', 'くすりきょく', 'やっきょく', 'やきょく'], correct: 2, why: 'やく + きょく → **やっきょく** (âm ngắt).' },
        { q: '脱ぎます', options: ['だつぎます', 'ぬぎます', 'ぬきます', 'はぎます'], correct: 1, why: '**ぬぎます** — cởi.' },
        { q: '磨きます', options: ['みがきます', 'まきます', 'みかきます', 'けずきます'], correct: 0, why: '**みがきます** — đánh (răng).' },
        { q: '横になります', options: ['おうになります', 'よこになります', 'よこにします', 'たてになります'], correct: 1, why: '**よこになります** — nằm xuống.' },
        { q: '準備', options: ['じゅんび', 'じゅんぴ', 'じゅうび', 'しゅんび'], correct: 0, why: '**じゅんび** — chuẩn bị.' },
        { q: '風邪', options: ['ふうじゃ', 'かぜ', 'かじゃ', 'ふじゃ'], correct: 1, why: 'Đọc cả cụm: **かぜ**.' },
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
      id: 'b12-doc-kanji',
      title: 'Đọc to từng câu — chữ Hán Bài 12',
      note: 'Mỗi câu có ít nhất một từ chữ Hán của Bài 12. Chỗ hay sai: 調子 ちょうし, 熱 ねつ, 歯医者 はいしゃ, 上着 うわぎ, 薬局 やっきょく, 待合室 まちあいしつ, 風邪 かぜ.',
      items: [
        { text: 'どうしたんですか。——{頭|あたま}が{痛|いた}いんです。', ro: 'Dou shita n desu ka. — Atama ga itai n desu.', vi: 'Sao thế? — Tôi đau đầu.' },
        { text: 'きのうから{熱|ねつ}があるんです。', ro: 'Kinou kara netsu ga aru n desu.', vi: 'Tôi bị sốt từ hôm qua.' },
        { text: 'かぜをひいて、{食欲|しょくよく}がないんです。', ro: 'Kaze o hiite, shokuyoku ga nai n desu.', vi: 'Tôi bị cảm nên chẳng muốn ăn.' },
        { text: 'さいきん、{体|からだ}の{調子|ちょうし}がよくないんです。', ro: 'Saikin, karada no choushi ga yokunai n desu.', vi: 'Dạo này người tôi không khoẻ.' },
        { text: 'はははびょうきで、びょういんにいます。', ro: 'Haha wa byouki de, byouin ni imasu.', vi: 'Mẹ tôi bị ốm, đang ở bệnh viện.' },
        { text: 'あさから{歯|は}が{痛|いた}いんです。', ro: 'Asa kara ha ga itai n desu.', vi: 'Tôi đau răng từ sáng.' },
        { text: 'こんばん、クラスの{飲|の}み{会|かい}があります。', ro: 'Konban, kurasu no nomikai ga arimasu.', vi: 'Tối nay lớp có buổi nhậu.' },
        { text: 'バスのなかで{気持|きも}ちが{悪|わる}くなりました。', ro: 'Basu no naka de kimochi ga waruku narimashita.', vi: 'Trên xe buýt tôi thấy buồn nôn.' },
        { text: '{大丈夫|だいじょうぶ}ですか。——おかげさまで、もう{治|なお}りました。', ro: 'Daijoubu desu ka. — Okagesama de, mou naorimashita.', vi: 'Bạn có sao không? — Nhờ trời, tôi khỏi rồi.' },
        { text: 'それはいけませんね。お{大事|だいじ}に。', ro: 'Sore wa ikemasen ne. Odaiji ni.', vi: 'Thế thì không ổn rồi. Giữ gìn sức khoẻ nhé.' },
        { text: 'せんせい、{早|はや}くかえってもいいですか。', ro: 'Sensei, hayaku kaette mo ii desu ka.', vi: 'Thưa cô, em về sớm được không ạ?' },
        { text: '{歯医者|はいしゃ}へいったほうがいいですよ。', ro: 'Haisha e itta hou ga ii desu yo.', vi: 'Bạn nên đi nha sĩ đấy.' },
        { text: 'まいにち{8時間|はちじかん}{以上|いじょう}ねています。', ro: 'Mainichi hachijikan ijou nete imasu.', vi: 'Ngày nào tôi cũng ngủ từ 8 tiếng trở lên.' },
        { text: '{睡眠|すいみん}はとてもたいせつです。', ro: 'Suimin wa totemo taisetsu desu.', vi: 'Giấc ngủ rất quan trọng.' },
        { text: 'のどがいたいですから、こえを{出|だ}さないほうがいいです。', ro: 'Nodo ga itai desu kara, koe o dasanai hou ga ii desu.', vi: 'Đau họng thì không nên nói.' },
        { text: 'やけどをしたんですか。このくすりを{塗|ぬ}ってください。', ro: 'Yakedo o shita n desu ka. Kono kusuri o nutte kudasai.', vi: 'Bạn bị bỏng à? Hãy bôi thuốc này.' },
        { text: 'ねつがありますから、シャワーを{浴|あ}びないでください。', ro: 'Netsu ga arimasu kara, shawaa o abinaide kudasai.', vi: 'Đang sốt nên đừng tắm vòi sen.' },
        { text: '{出|で}かけるとき、マスクをしたほうがいいです。', ro: 'Dekakeru toki, masuku o shita hou ga ii desu.', vi: 'Khi ra ngoài nên đeo khẩu trang.' },
        { text: 'できるだけ{運動|うんどう}をしたほうがいいですよ。', ro: 'Dekirudake undou o shita hou ga ii desu yo.', vi: 'Nên vận động càng nhiều càng tốt.' },
        { text: 'はがいたいときは、{固|かた}いものをたべないで、{柔|やわ}らかいものをたべてください。', ro: 'Ha ga itai toki wa, katai mono o tabenaide, yawarakai mono o tabete kudasai.', vi: 'Khi đau răng đừng ăn đồ cứng, hãy ăn đồ mềm.' },
        { text: '{自分|じぶん}でりょうりをつくっていますか。', ro: 'Jibun de ryouri o tsukutte imasu ka.', vi: 'Bạn có tự nấu ăn không?' },
        { text: 'うけつけで{保険証|ほけんしょう}を{出|だ}してください。', ro: 'Uketsuke de hokenshou o dashite kudasai.', vi: 'Hãy nộp thẻ bảo hiểm ở quầy tiếp tân.' },
        { text: '{待合室|まちあいしつ}で{待|ま}ってください。', ro: 'Machiaishitsu de matte kudasai.', vi: 'Xin chờ ở phòng chờ.' },
        { text: 'くつを{脱|ぬ}いでから、はいってください。', ro: 'Kutsu o nuide kara, haitte kudasai.', vi: 'Cởi giày rồi mới vào.' },
        { text: '{上着|うわぎ}をぬいで、ベッドに{横|よこ}になってください。', ro: 'Uwagi o nuide, beddo ni yoko ni natte kudasai.', vi: 'Cởi áo khoác rồi nằm xuống giường.' },
        { text: 'きのう、たくさん{走|はし}ってから、あしがいたくなりました。', ro: 'Kinou, takusan hashitte kara, ashi ga itaku narimashita.', vi: 'Hôm qua chạy nhiều xong thì bị đau chân.' },
        { text: 'はを{磨|みが}いてから、ねます。', ro: 'Ha o migaite kara, nemasu.', vi: 'Đánh răng xong rồi đi ngủ.' },
        { text: 'くすりをのむまえに、{説明書|せつめいしょ}をよんでください。', ro: 'Kusuri o nomu mae ni, setsumeisho o yonde kudasai.', vi: 'Trước khi uống thuốc hãy đọc tờ hướng dẫn.' },
        { text: '{薬局|やっきょく}で{薬剤師|やくざいし}にくすりをもらいました。', ro: 'Yakkyoku de yakuzaishi ni kusuri o moraimashita.', vi: 'Tôi nhận thuốc từ dược sĩ ở hiệu thuốc.' },
        { text: 'きょうはお{風呂|ふろ}にはいらないほうがいいです。', ro: 'Kyou wa ofuro ni hairanai hou ga ii desu.', vi: 'Hôm nay không nên tắm bồn.' },
        { text: 'めがかゆいですから、コンタクトレンズをしません。', ro: 'Me ga kayui desu kara, kontakuto renzu o shimasen.', vi: 'Vì ngứa mắt nên tôi không đeo kính áp tròng.' },
        { text: 'くすりを{準備|じゅんび}しますから、すこし{待|ま}ってください。', ro: 'Kusuri o junbi shimasu kara, sukoshi matte kudasai.', vi: 'Chúng tôi chuẩn bị thuốc, xin chờ một chút.' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b12-doc-doan',
      title: 'Đọc to đoạn văn kiểu đề thi (30 giây chuẩn bị)',
      note: 'Mỗi đoạn ~100 chữ, khoảng 4 từ chữ Hán + vài từ katakana như đề thật. Đọc liền mạch, không dừng giữa từ.',
      items: [
        {
          text: 'きのう、がっこうでマルコさんのかおがあかかったです。「どうしたんですか。」「{熱|ねつ}があるんです。{食欲|しょくよく}もないんです。」マルコさんは{早|はや}くうちへかえりました。きょう、マルコさんに{会|あ}いました。「おかげさまで、もう{治|なお}りました。」よかったです。',
          ro: 'Kinou, gakkou de Maruko-san no kao ga akakatta desu. "Dou shita n desu ka." "Netsu ga aru n desu. Shokuyoku mo nai n desu." Maruko-san wa hayaku uchi e kaerimashita. Kyou, Maruko-san ni aimashita. "Okagesama de, mou naorimashita." Yokatta desu.',
          vi: 'Hôm qua ở trường mặt Marco đỏ bừng. "Sao thế?" "Mình bị sốt. Cũng chẳng muốn ăn." Marco về nhà sớm. Hôm nay tôi gặp Marco. "Nhờ trời, mình khỏi rồi." Tốt quá.',
        },
        {
          text: 'さいきん、{体|からだ}の{調子|ちょうし}がよくないんです。ともだちにそうだんしました。「まいにち{運動|うんどう}をしていますか。」「ぜんぜんしていません。」「{睡眠|すいみん}もたいせつですよ。8じかんいじょうねたほうがいいです。」あしたから、あさジョギングをします。',
          ro: 'Saikin, karada no choushi ga yokunai n desu. Tomodachi ni soudan shimashita. "Mainichi undou o shite imasu ka." "Zenzen shite imasen." "Suimin mo taisetsu desu yo. Hachijikan ijou neta hou ga ii desu." Ashita kara, asa jogingu o shimasu.',
          vi: 'Dạo này người tôi không khoẻ. Tôi hỏi ý kiến bạn. "Ngày nào cậu cũng vận động chứ?" "Mình chẳng vận động gì cả." "Giấc ngủ cũng quan trọng đấy. Nên ngủ từ 8 tiếng trở lên." Từ mai sáng nào tôi cũng sẽ chạy bộ.',
        },
        {
          text: 'びょういんへいきました。うけつけで{保険証|ほけんしょう}をだして、{待合室|まちあいしつ}でまちました。いしゃ：「どうしましたか。」わたし：「きのう、ばんごはんをたべてから、おなかがいたくなったんです。」いしゃ：「{上着|うわぎ}をぬいで、ベッドによこになってください。」',
          ro: 'Byouin e ikimashita. Uketsuke de hokenshou o dashite, machiaishitsu de machimashita. Isha: "Dou shimashita ka." Watashi: "Kinou, bangohan o tabete kara, onaka ga itaku natta n desu." Isha: "Uwagi o nuide, beddo ni yoko ni natte kudasai."',
          vi: 'Tôi đi bệnh viện. Nộp thẻ bảo hiểm ở quầy rồi chờ ở phòng chờ. Bác sĩ: "Anh bị làm sao?" Tôi: "Hôm qua ăn tối xong thì tôi bị đau bụng." Bác sĩ: "Anh cởi áo khoác rồi nằm lên giường."',
        },
        {
          text: '{薬局|やっきょく}で{薬剤師|やくざいし}がいいました。「このくすりは1にちに3かい、ごはんをたべてからのんでください。このピンクのくすりはねるまえにのんでください。のむまえに、{説明書|せつめいしょ}をよくよんでください。」わたしは「はい、わかりました」といいました。',
          ro: 'Yakkyoku de yakuzaishi ga iimashita. "Kono kusuri wa ichinichi ni sankai, gohan o tabete kara nonde kudasai. Kono pinku no kusuri wa neru mae ni nonde kudasai. Nomu mae ni, setsumeisho o yoku yonde kudasai." Watashi wa "Hai, wakarimashita" to iimashita.',
          vi: 'Ở hiệu thuốc dược sĩ nói: "Thuốc này ngày 3 lần, uống sau khi ăn. Thuốc màu hồng này uống trước khi ngủ. Trước khi uống hãy đọc kỹ tờ hướng dẫn." Tôi nói "Vâng, tôi hiểu rồi".',
        },
      ],
    },

    {
      t: 'write',
      id: 'b12-viet-kanji',
      title: 'Tập viết tay chữ Hán Bài 12 — ✍ trước, 👁 sau',
      note: '16 chữ đầu là nhóm ✍ nên viết (ít nét, gặp rất nhiều) — viết cho thạo. Phần còn lại là 👁 nhận mặt: viết thử một lượt để nhớ mặt chữ là đủ. Bấm ▶ Thứ tự nét trước khi viết; viết xong nhờ ✨ AI xem chữ.',
      chars: ['体', '気', '食', '子', '会', '大', '早', '上', '出', '自', '分', '明', '書', '走', '前', '回', '病', '熱', '歯', '欲', '調', '飲', '度', '治', '悪', '持', '丈', '夫', '事', '医', '者', '睡', '眠', '以', '塗', '浴', '運', '動', '固', '柔', '薬', '剤', '師', '局', '着', '説', '風', '呂', '保', '険', '証', '待', '合', '室', '脱', '磨', '横', '準', '備', '邪', '頭', '痛', '院'],
    },
  ],
};

/* ═══════════════════════════ 5. NGHE ═══════════════════════════ */

const NGHE: Lesson = {
  id: 'b12-nghe',
  kind: 'listening',
  title: 'Luyện nghe — ai bị gì? khuyên gì? uống thuốc lúc nào?',
  goal: 'Nghe bạn bè kể triệu chứng và biết người kia sẽ làm gì giúp, nghe lời khuyên (nên / không nên), nghe bác sĩ – dược sĩ để biết bị từ bao giờ, đã uống thuốc chưa, uống thuốc mấy lần và trước hay sau khi ăn.',
  minutes: 40,
  blocks: [
    {
      t: 'note',
      title: 'Cách nghe',
      items: [
        '**Triệu chứng**: bắt bộ phận cơ thể + {痛|いた}い (頭／のど／おなか／歯／足), **熱がある**, **食欲がない**, **気持ちが悪い**, **けが／やけどをした**. Câu có **～んです** thường chính là câu trả lời.',
        '**Lời khuyên**: nghe đuôi **～たほうがいい** (nên) ↔ **～ないほうがいい** (không nên). Hai đuôi nghe gần giống — tập trung vào **ない**.',
        '**Thời điểm**: **いつから** → nghe **～から** (昨日から, 今朝から) hoặc **～てから** (食べてから). **何か薬を飲みましたか** → nghe **～前に飲みました** hoặc **まだ飲んでいません**.',
        '**Cách uống thuốc**: ghi nháp 3 thứ — **mấy lần** (1日に～回), **trước hay sau khi ăn** (～前に ↔ ～てから), **thuốc nào** (白い／赤い／小さい).',
        'Bẫy: người nói đổi ý hoặc sửa lại ("いいえ、…です"). Luôn lấy thông tin **cuối cùng**.',
      ],
    },

    /* ── Bài 1 ── */
    { t: 'h', text: 'Bài 1 — Ai bị gì? Bạn làm gì giúp? (やってみよう)' },
    {
      t: 'p',
      text: 'Ba đoạn hội thoại ngắn trong lớp. Nghe và điền vào bảng: **người không khoẻ bị làm sao** và **người bạn sẽ làm gì**.',
    },
    {
      t: 'table',
      caption: 'Bảng điền (điền trong đầu rồi làm câu hỏi bên dưới)',
      head: ['', 'Người không khoẻ — bị gì?', 'Người bạn — làm gì?'],
      rows: [
        ['①', 'アンナ — ？', 'ダニエル — ？'],
        ['②', 'カルロス — ？', 'パク — ？'],
        ['③', 'ワン — ？', 'マルコ — ？'],
      ],
    },
    {
      t: 'listen',
      id: 'b12-ng-1a',
      title: '① Anna và Daniel',
      lines: [
        { who: 'ダニエル', voice: 'ja-nam', text: 'アンナさん、どうしたんですか。', ro: 'Anna-san, dou shita n desu ka.', vi: 'Anna, cậu sao thế?' },
        { who: 'アンナ', voice: 'ja-nu', text: 'のどが{痛|いた}いんです。{声|こえ}があまり{出|で}ないんです。', ro: 'Nodo ga itai n desu. Koe ga amari denai n desu.', vi: 'Mình đau họng. Gần như không ra tiếng.' },
        { who: 'ダニエル', voice: 'ja-nam', text: '{大丈夫|だいじょうぶ}ですか。{薬|くすり}はありますか。', ro: 'Daijoubu desu ka. Kusuri wa arimasu ka.', vi: 'Cậu có sao không? Có thuốc không?' },
        { who: 'アンナ', voice: 'ja-nu', text: 'いいえ、ないんです。', ro: 'Iie, nai n desu.', vi: 'Không, mình không có.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'じゃ、{私|わたし}が{薬局|やっきょく}へ{行|い}って、{薬|くすり}を{買|か}ってきます。ここで{待|ま}っていてください。', ro: 'Ja, watashi ga yakkyoku e itte, kusuri o katte kimasu. Koko de matte ite kudasai.', vi: 'Vậy mình ra hiệu thuốc mua thuốc về cho. Cậu chờ ở đây nhé.' },
      ],
    },
    {
      t: 'listen',
      id: 'b12-ng-1b',
      title: '② Carlos và Park',
      lines: [
        { who: 'パク', voice: 'ja-nu', text: 'カルロスさん、{顔|かお}が{白|しろ}いですよ。', ro: 'Karurosu-san, kao ga shiroi desu yo.', vi: 'Carlos, mặt cậu tái nhợt kìa.' },
        { who: 'カルロス', voice: 'ja-nam', text: 'ええ……おなかが{痛|いた}いんです。{昼|ひる}ご{飯|はん}を{食|た}べてから、ずっと{痛|いた}いんです。', ro: 'Ee…… onaka ga itai n desu. Hirugohan o tabete kara, zutto itai n desu.', vi: 'Ừ… mình đau bụng. Từ lúc ăn trưa xong cứ đau suốt.' },
        { who: 'パク', voice: 'ja-nu', text: '{早|はや}く{帰|かえ}ったほうがいいですよ。{私|わたし}が{先生|せんせい}に{言|い}います。', ro: 'Hayaku kaetta hou ga ii desu yo. Watashi ga sensei ni iimasu.', vi: 'Cậu nên về sớm đi. Mình sẽ nói với cô.' },
        { who: 'カルロス', voice: 'ja-nam', text: 'ありがとうございます。お{願|ねが}いします。', ro: 'Arigatou gozaimasu. Onegai shimasu.', vi: 'Cảm ơn cậu. Nhờ cậu nhé.' },
      ],
    },
    {
      t: 'listen',
      id: 'b12-ng-1c',
      title: '③ Wang và Marco',
      lines: [
        { who: 'マルコ', voice: 'ja-nam', text: 'ワンさん、その{足|あし}、どうしたんですか。', ro: 'Wan-san, sono ashi, dou shita n desu ka.', vi: 'Wang, cái chân kia làm sao thế?' },
        { who: 'ワン', voice: 'ja-nu', text: '{朝|あさ}、{駅|えき}で{走|はし}ったんです。それで、けがをしたんです。', ro: 'Asa, eki de hashitta n desu. Sorede, kega o shita n desu.', vi: 'Sáng nay mình chạy ở nhà ga. Thế là bị thương.' },
        { who: 'マルコ', voice: 'ja-nam', text: '{痛|いた}いですか。', ro: 'Itai desu ka.', vi: 'Có đau không?' },
        { who: 'ワン', voice: 'ja-nu', text: 'ええ、とても。{歩|ある}くことができないんです。', ro: 'Ee, totemo. Aruku koto ga dekinai n desu.', vi: 'Ừ, đau lắm. Mình không đi được.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'じゃ、{授業|じゅぎょう}の{後|あと}で、{一緒|いっしょ}に{病院|びょういん}へ{行|い}きましょう。タクシーを{呼|よ}びます。', ro: 'Ja, jugyou no ato de, issho ni byouin e ikimashou. Takushii o yobimasu.', vi: 'Vậy học xong mình cùng đi bệnh viện nhé. Mình sẽ gọi taxi.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b12-ng-1-q',
      title: 'Câu hỏi bài 1',
      items: [
        { q: '① アンナさんはどうしたんですか。', options: ['{熱|ねつ}がある', 'のどが{痛|いた}い', '{頭|あたま}が{痛|いた}い', '{食欲|しょくよく}がない'], correct: 1, why: '**のどが{痛|いた}いんです**。{声|こえ}があまり{出|で}ない.' },
        { q: '① ダニエルさんは{何|なに}をしますか。', options: ['{病院|びょういん}へ{一緒|いっしょ}に{行|い}く', '{先生|せんせい}に{言|い}う', '{薬|くすり}を{買|か}ってくる', 'タクシーを{呼|よ}ぶ'], correct: 2, why: '{薬局|やっきょく}へ{行|い}って、**{薬|くすり}を{買|か}ってきます** (ポイント 92, Bài 10).' },
        { q: '② カルロスさんはいつから{痛|いた}いですか。', options: ['{朝|あさ}から', '{昼|ひる}ご{飯|はん}を{食|た}べてから', '{昨日|きのう}の{夜|よる}から', '{授業|じゅぎょう}の{前|まえ}から'], correct: 1, why: '**{昼|ひる}ご{飯|はん}を{食|た}べてから**、ずっと{痛|いた}いんです (ポイント 107).' },
        { q: '② パクさんは{何|なに}をしますか。', options: ['{薬|くすり}を{買|か}ってくる', '{先生|せんせい}に{言|い}う', '{一緒|いっしょ}に{帰|かえ}る', '{病院|びょういん}に{電話|でんわ}する'], correct: 1, why: '{私|わたし}が**{先生|せんせい}に{言|い}います**。' },
        { q: '③ ワンさんはどうしたんですか。', options: ['{手|て}にやけどをした', '{足|あし}にけがをした', 'おなかが{痛|いた}い', '{気持|きも}ちが{悪|わる}い'], correct: 1, why: '{駅|えき}で{走|はし}って、**けがをした**んです — chân.' },
        { q: '③ マルコさんは{何|なに}をしますか。', options: ['{薬|くすり}を{塗|ぬ}る', '{先生|せんせい}に{言|い}う', '{一緒|いっしょ}に{病院|びょういん}へ{行|い}く', '{薬局|やっきょく}へ{行|い}く'], correct: 2, why: '{授業|じゅぎょう}の{後|あと}で、**{一緒|いっしょ}に{病院|びょういん}へ{行|い}きましょう**。' },
      ],
    },

    /* ── Bài 2 ── */
    { t: 'h', text: 'Bài 2 — Bạn khuyên gì? (やってみよう)' },
    {
      t: 'table',
      caption: 'Các lựa chọn',
      head: ['Kí hiệu', 'Lời khuyên'],
      rows: [
        ['ⓐ', '{歯医者|はいしゃ}へ{行|い}く'],
        ['ⓑ', '{8時間|はちじかん}{以上|いじょう}{寝|ね}る'],
        ['ⓒ', 'お{酒|さけ}を{飲|の}まない'],
        ['ⓓ', '{野菜|やさい}を{食|た}べる'],
        ['ⓔ', 'シャワーを{浴|あ}びない'],
        ['ⓕ', 'できるだけ{声|こえ}を{出|だ}さない'],
      ],
    },
    {
      t: 'listen',
      id: 'b12-ng-2a',
      title: '① Wang khuyên Carlos',
      lines: [
        { who: 'ワン', voice: 'ja-nu', text: 'カルロスさん、{眠|ねむ}そうですね。', ro: 'Karurosu-san, nemusou desu ne.', vi: 'Carlos, trông cậu buồn ngủ ghê.' },
        { who: 'カルロス', voice: 'ja-nam', text: 'ええ、{最近|さいきん}、{毎晩|まいばん}{4時間|よじかん}ぐらいしか{寝|ね}ていないんです。', ro: 'Ee, saikin, maiban yojikan gurai shika nete inai n desu.', vi: 'Ừ, dạo này tối nào mình cũng chỉ ngủ khoảng 4 tiếng.' },
        { who: 'ワン', voice: 'ja-nu', text: 'えっ、{4時間|よじかん}？それは{体|からだ}に{悪|わる}いですよ。{8時間|はちじかん}{以上|いじょう}{寝|ね}たほうがいいですよ。', ro: 'E, yojikan? Sore wa karada ni warui desu yo. Hachijikan ijou neta hou ga ii desu yo.', vi: 'Hả, 4 tiếng? Thế có hại cho sức khoẻ lắm. Cậu nên ngủ từ 8 tiếng trở lên.' },
        { who: 'カルロス', voice: 'ja-nam', text: 'そうですね。{今晩|こんばん}は{早|はや}く{寝|ね}ます。', ro: 'Sou desu ne. Konban wa hayaku nemasu.', vi: 'Ừ nhỉ. Tối nay mình sẽ ngủ sớm.' },
      ],
    },
    {
      t: 'listen',
      id: 'b12-ng-2b',
      title: '② Park khuyên Marco',
      lines: [
        { who: 'パク', voice: 'ja-nu', text: 'マルコさん、{風邪|かぜ}は{大丈夫|だいじょうぶ}ですか。', ro: 'Maruko-san, kaze wa daijoubu desu ka.', vi: 'Marco, cảm của cậu đỡ chưa?' },
        { who: 'マルコ', voice: 'ja-nam', text: 'まだ{熱|ねつ}が{少|すこ}しあるんです。でも、{今晩|こんばん}、{飲|の}み{会|かい}に{行|い}きます。', ro: 'Mada netsu ga sukoshi aru n desu. Demo, konban, nomikai ni ikimasu.', vi: 'Mình vẫn hơi sốt. Nhưng tối nay mình vẫn đi nhậu.' },
        { who: 'パク', voice: 'ja-nu', text: 'えっ、{飲|の}み{会|かい}？うーん、{行|い}ってもいいですが、お{酒|さけ}は{飲|の}まないほうがいいですよ。', ro: 'E, nomikai? Uun, itte mo ii desu ga, osake wa nomanai hou ga ii desu yo.', vi: 'Hả, đi nhậu? Ừm, đi thì được, nhưng đừng uống rượu thì hơn.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'わかりました。ジュースを{飲|の}みます。', ro: 'Wakarimashita. Juusu o nomimasu.', vi: 'Mình hiểu rồi. Mình sẽ uống nước quả.' },
      ],
    },
    {
      t: 'listen',
      id: 'b12-ng-2c',
      title: '③ Daniel khuyên Anna',
      lines: [
        { who: 'アンナ', voice: 'ja-nu', text: 'ダニエルさん、{昨日|きのう}からのどが{痛|いた}いんです。{歯|は}も{少|すこ}し{痛|いた}いんです。', ro: 'Danieru-san, kinou kara nodo ga itai n desu. Ha mo sukoshi itai n desu.', vi: 'Daniel ơi, mình đau họng từ hôm qua. Răng cũng hơi đau.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'そうですか。{歯医者|はいしゃ}へ{行|い}ったほうが……。あ、でも、{歯|は}は{少|すこ}しですね。', ro: 'Sou desu ka. Haisha e itta hou ga……. A, demo, ha wa sukoshi desu ne.', vi: 'Vậy à. Cậu nên đi nha sĩ… À mà răng chỉ hơi đau thôi nhỉ.' },
        { who: 'アンナ', voice: 'ja-nu', text: 'はい。のどがとても{痛|いた}いんです。', ro: 'Hai. Nodo ga totemo itai n desu.', vi: 'Ừ. Họng mới đau lắm.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'じゃ、{今日|きょう}はできるだけ{声|こえ}を{出|だ}さないほうがいいですよ。カラオケもだめですよ。', ro: 'Ja, kyou wa dekirudake koe o dasanai hou ga ii desu yo. Karaoke mo dame desu yo.', vi: 'Vậy hôm nay cậu cố đừng nói nhiều thì hơn. Karaoke cũng không được đâu đấy.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b12-ng-2-q',
      title: 'Câu hỏi bài 2 — chọn lời khuyên',
      items: [
        { q: '① ワンさんのアドバイスは？', options: ['ⓐ', 'ⓑ', 'ⓒ', 'ⓓ', 'ⓔ', 'ⓕ'], correct: 1, why: '**{8時間|はちじかん}{以上|いじょう}{寝|ね}たほうがいい**ですよ = ⓑ.' },
        { q: '② パクさんのアドバイスは？', options: ['ⓐ', 'ⓑ', 'ⓒ', 'ⓓ', 'ⓔ', 'ⓕ'], correct: 2, why: '{飲|の}み{会|かい}に{行|い}ってもいいが、**お{酒|さけ}は{飲|の}まないほうがいい** = ⓒ.' },
        { q: '③ ダニエルさんのアドバイスは？', options: ['ⓐ', 'ⓑ', 'ⓒ', 'ⓓ', 'ⓔ', 'ⓕ'], correct: 5, why: 'Bẫy: câu {歯医者|はいしゃ}へ… bị bỏ dở. Lời khuyên cuối: **できるだけ{声|こえ}を{出|だ}さないほうがいい** = ⓕ.' },
        { q: '② マルコさんは{今晩|こんばん}{何|なに}を{飲|の}みますか。', options: ['お{酒|さけ}', 'ジュース', '{水|みず}', '{薬|くすり}'], correct: 1, why: '**ジュース**を{飲|の}みます。' },
      ],
    },

    /* ── Bài 3 ── */
    { t: 'h', text: 'Bài 3 — Ở bệnh viện: từ bao giờ? đã uống thuốc chưa? uống lúc nào? (やってみよう)' },
    {
      t: 'p',
      text: 'Hai bệnh nhân khám rồi ra hiệu thuốc. (1) Nghe: **bị từ bao giờ**, **đã uống thuốc chưa**. (2) Nghe lại: **uống thuốc mới lúc nào**.',
    },
    {
      t: 'listen',
      id: 'b12-ng-3a',
      title: '① Marco — đau bụng',
      lines: [
        { who: '{医者|いしゃ}', voice: 'ja-nam', text: 'どうしましたか。', ro: 'Dou shimashita ka.', vi: 'Anh bị làm sao?' },
        { who: 'マルコ', voice: 'ja-nam', text: 'おなかが{痛|いた}いんです。', ro: 'Onaka ga itai n desu.', vi: 'Tôi đau bụng.' },
        { who: '{医者|いしゃ}', voice: 'ja-nam', text: 'いつからですか。', ro: 'Itsu kara desu ka.', vi: 'Từ bao giờ?' },
        { who: 'マルコ', voice: 'ja-nam', text: '{今朝|けさ}からです。{朝|あさ}ご{飯|はん}を{食|た}べてから、{痛|いた}くなりました。', ro: 'Kesa kara desu. Asagohan o tabete kara, itaku narimashita.', vi: 'Từ sáng nay ạ. Ăn sáng xong thì bắt đầu đau.' },
        { who: '{医者|いしゃ}', voice: 'ja-nam', text: '{何|なに}か{薬|くすり}を{飲|の}みましたか。', ro: 'Nanika kusuri o nomimashita ka.', vi: 'Anh đã uống thuốc gì chưa?' },
        { who: 'マルコ', voice: 'ja-nam', text: 'はい、{病院|びょういん}へ{来|く}る{前|まえ}に、うちの{薬|くすり}を{飲|の}みました。', ro: 'Hai, byouin e kuru mae ni, uchi no kusuri o nomimashita.', vi: 'Rồi ạ, trước khi đến bệnh viện tôi uống thuốc có sẵn ở nhà.' },
        { who: '{薬剤師|やくざいし}', voice: 'ja-nu', text: '（{薬局|やっきょく}で）マルコさん、この{薬|くすり}は{1日|いちにち}に{2回|にかい}、{朝|あさ}と{晩|ばん}、ご{飯|はん}を{食|た}べてから{飲|の}んでください。', ro: '(Yakkyoku de) Maruko-san, kono kusuri wa ichinichi ni nikai, asa to ban, gohan o tabete kara nonde kudasai.', vi: '(Ở hiệu thuốc) Anh Marco, thuốc này ngày 2 lần, sáng và tối, uống sau khi ăn.' },
      ],
    },
    {
      t: 'listen',
      id: 'b12-ng-3b',
      title: '② Anna — đau đầu, sốt',
      lines: [
        { who: '{医者|いしゃ}', voice: 'ja-nam', text: 'どうしましたか。', ro: 'Dou shimashita ka.', vi: 'Chị bị làm sao?' },
        { who: 'アンナ', voice: 'ja-nu', text: '{頭|あたま}が{痛|いた}いんです。{熱|ねつ}もあるんです。', ro: 'Atama ga itai n desu. Netsu mo aru n desu.', vi: 'Tôi đau đầu. Còn bị sốt nữa.' },
        { who: '{医者|いしゃ}', voice: 'ja-nam', text: 'いつからですか。', ro: 'Itsu kara desu ka.', vi: 'Từ bao giờ?' },
        { who: 'アンナ', voice: 'ja-nu', text: '{昨日|きのう}の{夜|よる}からです。アルバイトから{帰|かえ}ってから、{熱|ねつ}が{出|で}ました。', ro: 'Kinou no yoru kara desu. Arubaito kara kaette kara, netsu ga demashita.', vi: 'Từ tối qua ạ. Đi làm thêm về xong thì bị sốt.' },
        { who: '{医者|いしゃ}', voice: 'ja-nam', text: '{何|なに}か{薬|くすり}を{飲|の}みましたか。', ro: 'Nanika kusuri o nomimashita ka.', vi: 'Chị đã uống thuốc gì chưa?' },
        { who: 'アンナ', voice: 'ja-nu', text: 'いいえ、まだ{飲|の}んでいません。', ro: 'Iie, mada nonde imasen.', vi: 'Chưa ạ, tôi chưa uống.' },
        { who: '{薬剤師|やくざいし}', voice: 'ja-nu', text: '（{薬局|やっきょく}で）アンナさん、この{白|しろ}い{薬|くすり}は{1日|いちにち}に{3回|さんかい}、{食事|しょくじ}の{30分|さんじゅっぷん}{前|まえ}に{飲|の}んでください。それから、{熱|ねつ}が{高|たか}いときは、この{赤|あか}い{薬|くすり}を{飲|の}んでください。', ro: '(Yakkyoku de) Anna-san, kono shiroi kusuri wa ichinichi ni sankai, shokuji no sanjuppun mae ni nonde kudasai. Sorekara, netsu ga takai toki wa, kono akai kusuri o nonde kudasai.', vi: '(Ở hiệu thuốc) Chị Anna, thuốc trắng này ngày 3 lần, uống 30 phút trước bữa ăn. Còn khi sốt cao thì uống thuốc đỏ này.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b12-ng-3-q',
      title: 'Câu hỏi bài 3',
      items: [
        { q: '① マルコさんはいつから{調子|ちょうし}が{悪|わる}いですか。', options: ['{昨日|きのう}の{夜|よる}から', '{今朝|けさ}、{朝|あさ}ご{飯|はん}を{食|た}べてから', '{昼|ひる}ご{飯|はん}の{後|あと}から', '{3日|みっか}{前|まえ}から'], correct: 1, why: '**{今朝|けさ}から**です。**{朝|あさ}ご{飯|はん}を{食|た}べてから**、{痛|いた}くなりました。' },
        { q: '① マルコさんは{薬|くすり}を{飲|の}みましたか。', options: ['いいえ、まだ{飲|の}んでいません', 'はい、{病院|びょういん}へ{来|く}る{前|まえ}に{飲|の}みました', 'はい、{寝|ね}る{前|まえ}に{飲|の}みました', 'はい、ご{飯|はん}を{食|た}べてから{飲|の}みました'], correct: 1, why: '**{病院|びょういん}へ{来|く}る{前|まえ}に**、うちの{薬|くすり}を{飲|の}みました (ポイント 106).' },
        { q: '① マルコさんはいつ{薬|くすり}を{飲|の}みますか。', options: ['{1日|いちにち}{3回|さんかい}、{食事|しょくじ}の{前|まえ}', '{1日|いちにち}{2回|にかい}、{朝|あさ}と{晩|ばん}、ご{飯|はん}を{食|た}べてから', '{寝|ね}る{前|まえ}', '{1日|いちにち}{2回|にかい}、ご{飯|はん}を{食|た}べる{前|まえ}'], correct: 1, why: '**{1日|いちにち}に{2回|にかい}、{朝|あさ}と{晩|ばん}、ご{飯|はん}を{食|た}べてから** (ポイント 107).' },
        { q: '② アンナさんはいつから{調子|ちょうし}が{悪|わる}いですか。', options: ['{今朝|けさ}から', '{昨日|きのう}の{夜|よる}、アルバイトから{帰|かえ}ってから', 'おとといから', 'アルバイトの{前|まえ}から'], correct: 1, why: '**{昨日|きのう}の{夜|よる}**から — アルバイトから**{帰|かえ}ってから**、{熱|ねつ}が{出|で}ました.' },
        { q: '② アンナさんは{薬|くすり}を{飲|の}みましたか。', options: ['はい、{飲|の}みました', 'いいえ、まだ{飲|の}んでいません'], correct: 1, why: 'いいえ、**まだ{飲|の}んでいません**。' },
        { q: '② {白|しろ}い{薬|くすり}はいつ{飲|の}みますか。', options: ['{食事|しょくじ}の{30分|さんじゅっぷん}{前|まえ}', 'ご{飯|はん}を{食|た}べてから', '{寝|ね}る{前|まえ}', '{熱|ねつ}が{高|たか}いとき'], correct: 0, why: '{1日|いちにち}に{3回|さんかい}、**{食事|しょくじ}の{30分|さんじゅっぷん}{前|まえ}に**. {熱|ねつ}が{高|たか}いとき = thuốc **đỏ**.' },
      ],
    },

    /* ── Bài 4 ── */
    { t: 'h', text: 'Bài 4 — Hội thoại dài: ở trường → bệnh viện → hiệu thuốc (もう{一度|いちど}{聞|き}こう)' },
    {
      t: 'listen',
      id: 'b12-ng-4',
      title: 'Carlos bị ngứa mắt',
      note: 'Nghe cả đoạn một lần, rồi trả lời câu hỏi. Nghe lại lần hai để kiểm tra. Từ mới trong đoạn: {目薬|めぐすり} (thuốc nhỏ mắt).',
      lines: [
        { who: 'アンナ', voice: 'ja-nu', text: '（{学校|がっこう}で）カルロスさん、どうしたんですか。{目|め}が{赤|あか}いですよ。', ro: '(Gakkou de) Karurosu-san, dou shita n desu ka. Me ga akai desu yo.', vi: '(Ở trường) Carlos, cậu sao thế? Mắt đỏ kìa.' },
        { who: 'カルロス', voice: 'ja-nam', text: '{3日|みっか}{前|まえ}から{目|め}がかゆいんです。', ro: 'Mikka mae kara me ga kayui n desu.', vi: 'Mình bị ngứa mắt từ 3 hôm trước.' },
        { who: 'アンナ', voice: 'ja-nu', text: '{病院|びょういん}へ{行|い}きましたか。', ro: 'Byouin e ikimashita ka.', vi: 'Cậu đi bệnh viện chưa?' },
        { who: 'カルロス', voice: 'ja-nam', text: 'いいえ、まだです。', ro: 'Iie, mada desu.', vi: 'Chưa.' },
        { who: 'アンナ', voice: 'ja-nu', text: '{早|はや}く{行|い}ったほうがいいですよ。それから、コンタクトレンズはしないほうがいいですよ。', ro: 'Hayaku itta hou ga ii desu yo. Sorekara, kontakuto renzu wa shinai hou ga ii desu yo.', vi: 'Cậu nên đi sớm đi. Còn nữa, đừng đeo kính áp tròng thì hơn.' },
        { who: 'カルロス', voice: 'ja-nam', text: 'そうですね。{授業|じゅぎょう}が{終|お}わってから、{行|い}きます。', ro: 'Sou desu ne. Jugyou ga owatte kara, ikimasu.', vi: 'Ừ nhỉ. Học xong mình sẽ đi.' },
        { who: '{受付|うけつけ}の{人|ひと}', voice: 'ja-nu', text: '（{病院|びょういん}で）{保険証|ほけんしょう}を{出|だ}してください。それから、この{紙|かみ}に{名前|なまえ}と{住所|じゅうしょ}を{書|か}いてから、{待合室|まちあいしつ}で{待|ま}ってください。', ro: '(Byouin de) Hokenshou o dashite kudasai. Sorekara, kono kami ni namae to juusho o kaite kara, machiaishitsu de matte kudasai.', vi: '(Ở bệnh viện) Anh nộp thẻ bảo hiểm nhé. Rồi viết tên và địa chỉ vào tờ này, xong thì chờ ở phòng chờ.' },
        { who: '{医者|いしゃ}', voice: 'ja-nam', text: 'カルロスさん、どうぞ。……どうしましたか。', ro: 'Karurosu-san, douzo. …… Dou shimashita ka.', vi: 'Anh Carlos, mời vào. … Anh bị làm sao?' },
        { who: 'カルロス', voice: 'ja-nam', text: '{目|め}がかゆいんです。{3日|みっか}{前|まえ}に、{公園|こうえん}で{走|はし}ってから、かゆくなりました。', ro: 'Me ga kayui n desu. Mikka mae ni, kouen de hashitte kara, kayuku narimashita.', vi: 'Tôi bị ngứa mắt. 3 hôm trước, sau khi chạy ở công viên thì bị ngứa.' },
        { who: '{医者|いしゃ}', voice: 'ja-nam', text: 'ああ、アレルギーですね。{目薬|めぐすり}を{出|だ}しますから、{薬局|やっきょく}でもらってください。{1週間|いっしゅうかん}、コンタクトレンズはしないでください。{外|そと}から{帰|かえ}ってから、よく{目|め}を{洗|あら}ってくださいね。', ro: 'Aa, arerugii desu ne. Megusuri o dashimasu kara, yakkyoku de moratte kudasai. Isshuukan, kontakuto renzu wa shinaide kudasai. Soto kara kaette kara, yoku me o aratte kudasai ne.', vi: 'À, dị ứng rồi. Tôi kê thuốc nhỏ mắt, anh nhận ở hiệu thuốc nhé. Trong một tuần đừng đeo kính áp tròng. Đi ngoài về thì rửa mắt kỹ nhé.' },
        { who: '{薬剤師|やくざいし}', voice: 'ja-nu', text: '（{薬局|やっきょく}で）この{目薬|めぐすり}は{1日|いちにち}に{4回|よんかい}です。{使|つか}う{前|まえ}に、{手|て}を{洗|あら}ってください。それから、{寝|ね}る{前|まえ}に、この{薬|くすり}を{目|め}の{周|まわ}りに{塗|ぬ}ってください。', ro: '(Yakkyoku de) Kono megusuri wa ichinichi ni yonkai desu. Tsukau mae ni, te o aratte kudasai. Sorekara, neru mae ni, kono kusuri o me no mawari ni nutte kudasai.', vi: '(Ở hiệu thuốc) Thuốc nhỏ mắt này ngày 4 lần. Trước khi dùng hãy rửa tay. Còn nữa, trước khi ngủ bôi thuốc này quanh mắt.' },
        { who: 'カルロス', voice: 'ja-nam', text: 'はい、わかりました。ありがとうございました。', ro: 'Hai, wakarimashita. Arigatou gozaimashita.', vi: 'Vâng, tôi hiểu rồi. Cảm ơn chị.' },
        { who: '{薬剤師|やくざいし}', voice: 'ja-nu', text: 'お{大事|だいじ}に。', ro: 'Odaiji ni.', vi: 'Anh giữ gìn sức khoẻ nhé.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b12-ng-4-q',
      title: 'Câu hỏi bài 4',
      items: [
        { q: 'カルロスさんはどうしたんですか。', options: ['{目|め}が{痛|いた}い', '{目|め}がかゆい', '{頭|あたま}が{痛|いた}い', '{熱|ねつ}がある'], correct: 1, why: '**{目|め}がかゆいんです**。' },
        { q: 'いつからですか。', options: ['{昨日|きのう}から', '{3日|みっか}{前|まえ}から', '{1週間|いっしゅうかん}{前|まえ}から', '{今朝|けさ}から'], correct: 1, why: '**{3日|みっか}{前|まえ}**から — {公園|こうえん}で{走|はし}ってから.' },
        { q: 'アンナさんのアドバイスは{何|なん}ですか。（2つ）', options: ['{早|はや}く{病院|びょういん}へ{行|い}く・コンタクトレンズをしない', '{目|め}を{洗|あら}う・{寝|ね}る', '{薬|くすり}を{塗|ぬ}る・{運動|うんどう}をしない', '{授業|じゅぎょう}を{休|やす}む・{薬局|やっきょく}へ{行|い}く'], correct: 0, why: '**{早|はや}く{行|い}ったほうがいい** + **コンタクトレンズはしないほうがいい**.' },
        { q: '{病院|びょういん}で、カルロスさんは{最初|さいしょ}に{何|なに}をしましたか。', options: ['{待合室|まちあいしつ}で{待|ま}った', '{保険証|ほけんしょう}を{出|だ}した', '{目|め}を{洗|あら}った', '{薬|くすり}をもらった'], correct: 1, why: '{受付|うけつけ}: **{保険証|ほけんしょう}を{出|だ}して**ください → {名前|なまえ}を{書|か}いてから → {待合室|まちあいしつ}.' },
        { q: '{医者|いしゃ}は{何|なに}と{言|い}いましたか。', options: ['{外|そと}から{帰|かえ}る{前|まえ}に、{目|め}を{洗|あら}ってください', '{外|そと}から{帰|かえ}ってから、よく{目|め}を{洗|あら}ってください', '{毎日|まいにち}コンタクトレンズをしてください', 'お{風呂|ふろ}に{入|はい}らないでください'], correct: 1, why: '**{外|そと}から{帰|かえ}ってから**、よく{目|め}を{洗|あら}って (sau khi về). Bẫy 前に ↔ てから.' },
        { q: '{目薬|めぐすり}は{1日|いちにち}に{何回|なんかい}ですか。', options: ['{2回|にかい}', '{3回|さんかい}', '{4回|よんかい}', '{寝|ね}る{前|まえ}に{1回|いっかい}'], correct: 2, why: '{1日|いちにち}に**{4回|よんかい}**. Thuốc **bôi** mới là trước khi ngủ.' },
        { q: '{目薬|めぐすり}を{使|つか}う{前|まえ}に、{何|なに}をしますか。', options: ['{目|め}を{洗|あら}います', '{手|て}を{洗|あら}います', '{薬|くすり}を{塗|ぬ}ります', 'コンタクトレンズをします'], correct: 1, why: '{使|つか}う{前|まえ}に、**{手|て}を{洗|あら}って**ください.' },
      ],
    },

    /* ── Bài 5 ── */
    { t: 'h', text: 'Bài 5 — Trước hay sau? (～前に ↔ ～てから)' },
    {
      t: 'p',
      text: 'Nghe 6 lời dặn ngắn. Việc được dặn phải làm **TRƯỚC** hay **SAU** việc kia? Ví dụ "uống thuốc … ăn cơm": uống **trước khi ăn** → chọn **Trước**; ăn xong mới uống → **Sau**.',
    },
    {
      t: 'listen',
      id: 'b12-ng-5',
      title: '6 lời dặn',
      lines: [
        { who: '①', voice: 'ja-nu', text: 'この{薬|くすり}はご{飯|はん}を{食|た}べる{前|まえ}に{飲|の}んでください。', ro: 'Kono kusuri wa gohan o taberu mae ni nonde kudasai.', vi: 'Thuốc này uống trước khi ăn cơm.' },
        { who: '②', voice: 'ja-nam', text: '{靴|くつ}を{脱|ぬ}いでから、{入|はい}ってください。', ro: 'Kutsu o nuide kara, haitte kudasai.', vi: 'Cởi giày rồi mới vào.' },
        { who: '③', voice: 'ja-nu', text: 'この{薬|くすり}はお{風呂|ふろ}に{入|はい}ってから{塗|ぬ}ってください。', ro: 'Kono kusuri wa ofuro ni haitte kara nutte kudasai.', vi: 'Thuốc này bôi sau khi tắm.' },
        { who: '④', voice: 'ja-nam', text: '{運動|うんどう}する{前|まえ}に、{水|みず}を{飲|の}んだほうがいいですよ。', ro: 'Undou suru mae ni, mizu o nonda hou ga ii desu yo.', vi: 'Trước khi vận động nên uống nước.' },
        { who: '⑤', voice: 'ja-nu', text: '{寝|ね}る{前|まえ}に、{歯|は}を{磨|みが}いてくださいね。', ro: 'Neru mae ni, ha o migaite kudasai ne.', vi: 'Trước khi ngủ nhớ đánh răng nhé.' },
        { who: '⑥', voice: 'ja-nam', text: '{手|て}を{洗|あら}ってから、ご{飯|はん}を{食|た}べましょう。', ro: 'Te o aratte kara, gohan o tabemashou.', vi: 'Rửa tay xong rồi ăn cơm nào.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b12-ng-5-q',
      title: 'Câu hỏi bài 5 — Trước hay Sau?',
      items: [
        { q: '① Uống thuốc — so với ăn cơm', options: ['Trước', 'Sau'], correct: 0, why: '{食|た}べる**{前|まえ}に** → trước khi ăn.' },
        { q: '② Cởi giày — so với đi vào', options: ['Trước', 'Sau'], correct: 0, why: '{脱|ぬ}いで**から**{入|はい}る → cởi giày **trước**, vào sau.' },
        { q: '③ Bôi thuốc — so với tắm bồn', options: ['Trước', 'Sau'], correct: 1, why: 'お{風呂|ふろ}に{入|はい}って**から**{塗|ぬ}る → bôi **sau** khi tắm.' },
        { q: '④ Uống nước — so với vận động', options: ['Trước', 'Sau'], correct: 0, why: '{運動|うんどう}する**{前|まえ}に** → trước.' },
        { q: '⑤ Đánh răng — so với đi ngủ', options: ['Trước', 'Sau'], correct: 0, why: '{寝|ね}る**{前|まえ}に** → trước khi ngủ.' },
        { q: '⑥ Ăn cơm — so với rửa tay', options: ['Trước', 'Sau'], correct: 1, why: '{手|て}を{洗|あら}って**から**ご{飯|はん}を{食|た}べる → ăn **sau** khi rửa tay.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 6. NÓI (dạng thi) ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b12-noi',
  kind: 'speaking',
  title: 'Luyện nói — câu hỏi thi về sức khoẻ, lời khuyên, trước khi / sau khi',
  goal: 'Trả lời trọn câu, đúng trợ từ các câu hỏi thi liên quan Bài 12 (どうしたんですか, 体にいいことをしていますか, ～前に／～てから何をしますか, ～とき、どうしますか), nhìn tranh triệu chứng / túi thuốc / bảng bệnh viện mà trả lời, đóng vai xin về sớm – khuyên bạn – khám bệnh, và đọc to trôi chảy.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Đề thi nói JPD (theo "Hướng dẫn ôn thi" của bộ môn) — Bài 12 nằm ở đâu',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 12 xuất hiện ở đâu'],
      rows: [
        ['Reading', '40', 'Chuẩn bị 30 giây, đọc to đoạn ~100–110 chữ (4 từ chữ Hán gạch chân, 4 từ katakana, 70–80 chữ hiragana).', 'Đoạn kể bị ốm, đi khám: {病気|びょうき}, {保険証|ほけんしょう}, {薬局|やっきょく}, シャワー, マスク…'],
        ['Talking — có tranh', '3 × 15', 'Nhìn tranh (người bị đau, túi thuốc, bảng bệnh viện) trả lời 3 câu.', 'この{人|ひと}はどうしたんですか · {1日|いちにち}に{何回|なんかい}{飲|の}みますか · いつ{飲|の}みますか'],
        ['Talking — không tranh', '1 × 10', 'Trả lời 1 câu về bản thân.', '{体|からだ}にいいことをしていますか · {寝|ね}る{前|まえ}に{何|なに}をしますか · {風邪|かぜ}のとき、どうしますか'],
        ['Presenting', '5', 'Chào khi vào và khi ra.', 'しつれいします／ありがとうございました。'],
      ],
    },
    {
      t: 'note',
      title: 'Luật chấm cần nhớ (trừ điểm thật)',
      items: [
        '**Sai trợ từ: −2 điểm** mỗi lỗi. Bài 12 soát kỹ: {頭|あたま}**が**{痛|いた}い, {熱|ねつ}**が**ある, {風邪|かぜ}**を**ひく, {食事|しょくじ}**の**{前|まえ}に, {1日|いちにち}**に**{3回|さんかい}, お{風呂|ふろ}**に**{入|はい}る, シャワー**を**{浴|あ}びる.',
        '**Câu có/không quên はい／いいえ**: bị trừ. 「{毎日|まいにち}{運動|うんどう}をしていますか」 → **はい、しています／いいえ、していません**.',
        '**Sai nội dung = mất trọn câu**: hỏi "trước khi ngủ làm gì" (前に) mà trả lời việc làm SAU khi về nhà; hỏi "bị làm sao" mà trả lời "tôi đi bệnh viện".',
        'Được xin nhắc lại câu hỏi **tối đa 2 lần, không bị trừ**: **もう{一度|いちど}お{願|ねが}いします** · **ゆっくりお{願|ねが}いします**.',
        'Luôn trả lời **câu đầy đủ**, lặp lại động từ của câu hỏi, thêm một câu lý do (～から) để câu dài hơn.',
      ],
    },

    /* ── Không tranh ① ── */
    { t: 'h', text: 'Câu hỏi không tranh ① — Sức khoẻ của bạn' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: 体の調子・体にいいこと',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{最近|さいきん}、{体|からだ}の{調子|ちょうし}はどうですか。', ro: 'Saikin, karada no choushi wa dou desu ka.', vi: 'Dạo này sức khoẻ của em thế nào?' },
        { who: 'Bạn', role: 'candidate', text: 'とてもいいです。{毎日|まいにち}{元気|げんき}です。', ro: 'Totemo ii desu. Mainichi genki desu.', vi: 'Rất tốt ạ. Ngày nào em cũng khoẻ.' },
        { who: 'Giám thị', role: 'examiner', text: '{何|なに}か{体|からだ}にいいことをしていますか。', ro: 'Nanika karada ni ii koto o shite imasu ka.', vi: 'Em có làm việc gì tốt cho sức khoẻ không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、しています。{毎朝|まいあさ}、{公園|こうえん}で{30分|さんじゅっぷん}{走|はし}っています。', ro: 'Hai, shite imasu. Maiasa, kouen de sanjuppun hashitte imasu.', vi: 'Có ạ. Sáng nào em cũng chạy 30 phút ở công viên.' },
        { who: 'Giám thị', role: 'examiner', text: '{毎日|まいにち}{運動|うんどう}をしていますか。', ro: 'Mainichi undou o shite imasu ka.', vi: 'Em có vận động mỗi ngày không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、していません。{時間|じかん}がないんです。でも、{週末|しゅうまつ}はサッカーをします。', ro: 'Iie, shite imasen. Jikan ga nai n desu. Demo, shuumatsu wa sakkaa o shimasu.', vi: 'Không ạ. Em không có thời gian. Nhưng cuối tuần em chơi bóng đá.' },
        { who: 'Giám thị', role: 'examiner', text: '{毎晩|まいばん}{何時間|なんじかん}{寝|ね}ていますか。', ro: 'Maiban nanjikan nete imasu ka.', vi: 'Mỗi tối em ngủ mấy tiếng?' },
        { who: 'Bạn', role: 'candidate', text: '{7時間|ななじかん}ぐらい{寝|ね}ています。', ro: 'Nanajikan gurai nete imasu.', vi: 'Em ngủ khoảng 7 tiếng ạ.' },
        { who: 'Giám thị', role: 'examiner', text: '{自分|じぶん}で{料理|りょうり}を{作|つく}っていますか。', ro: 'Jibun de ryouri o tsukutte imasu ka.', vi: 'Em có tự nấu ăn không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{作|つく}っています。{野菜|やさい}の{料理|りょうり}をよく{作|つく}ります。', ro: 'Hai, tsukutte imasu. Yasai no ryouri o yoku tsukurimasu.', vi: 'Có ạ. Em hay nấu món rau.' },
        { who: 'Giám thị', role: 'examiner', text: '{果物|くだもの}を{食|た}べていますか。', ro: 'Kudamono o tabete imasu ka.', vi: 'Em có ăn hoa quả không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{毎日|まいにち}{食|た}べています。バナナが{好|す}きです。', ro: 'Hai, mainichi tabete imasu. Banana ga suki desu.', vi: 'Có ạ, ngày nào em cũng ăn. Em thích chuối.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở nhóm này',
      items: [
        'Câu hỏi **～ていますか** (thói quen, Bài 11) → trả lời **～ています／～ていません**, không đổi sang ~~～ます~~ khi phủ định: ~~いいえ、しません~~ nghe như "không bao giờ làm".',
        '**{何|なに}か～をしていますか** là câu có/không → mở đầu **はい、しています／いいえ、していません**, rồi mới kể việc cụ thể.',
        'Nói "không" thì thêm lý do bằng **～んです** ({時間|じかん}がないんです) — đúng điểm ngữ pháp của bài, ghi điểm.',
      ],
    },

    /* ── Không tranh ② ── */
    { t: 'h', text: 'Câu hỏi không tranh ② — Khi bị ốm thì sao?' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: 風邪のとき・アドバイス',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{風邪|かぜ}をひいたとき、どうしますか。', ro: 'Kaze o hiita toki, dou shimasu ka.', vi: 'Khi bị cảm em làm gì? (mẫu ～とき、どうしますか — Bài 11)' },
        { who: 'Bạn', role: 'candidate', text: '{薬|くすり}を{飲|の}んで、うちでゆっくり{休|やす}みます。', ro: 'Kusuri o nonde, uchi de yukkuri yasumimasu.', vi: 'Em uống thuốc rồi ở nhà nghỉ ngơi.' },
        { who: 'Giám thị', role: 'examiner', text: '{風邪|かぜ}のとき、{何|なに}をしないほうがいいですか。', ro: 'Kaze no toki, nani o shinai hou ga ii desu ka.', vi: 'Khi bị cảm thì không nên làm gì?' },
        { who: 'Bạn', role: 'candidate', text: 'お{酒|さけ}を{飲|の}まないほうがいいです。それから、{冷|つめ}たいものを{食|た}べないほうがいいです。', ro: 'Osake o nomanai hou ga ii desu. Sorekara, tsumetai mono o tabenai hou ga ii desu.', vi: 'Không nên uống rượu. Và không nên ăn đồ lạnh.' },
        { who: 'Giám thị', role: 'examiner', text: '{友達|ともだち}が「{最近|さいきん}、{夜|よる}あまり{寝|ね}ていないんです」と{言|い}いました。どんなアドバイスをしますか。', ro: 'Tomodachi ga "Saikin, yoru amari nete inai n desu" to iimashita. Donna adobaisu o shimasu ka.', vi: 'Bạn em nói "Dạo này buổi tối mình ngủ không được bao nhiêu". Em khuyên thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{寝|ね}る{前|まえ}に、{携帯|けいたい}を{見|み}ないほうがいいですよ。{昼|ひる}、{運動|うんどう}をしたほうがいいですよ。', ro: 'Neru mae ni, keitai o minai hou ga ii desu yo. Hiru, undou o shita hou ga ii desu yo.', vi: 'Trước khi ngủ đừng xem điện thoại thì hơn. Ban ngày nên vận động.' },
        { who: 'Giám thị', role: 'examiner', text: '{最近|さいきん}、{病院|びょういん}へ{行|い}きましたか。', ro: 'Saikin, byouin e ikimashita ka.', vi: 'Gần đây em có đi bệnh viện không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{行|い}きました。{1か月|いっかげつ}{前|まえ}に、{歯|は}が{痛|いた}かったんです。{歯医者|はいしゃ}へ{行|い}きました。', ro: 'Hai, ikimashita. Ikkagetsu mae ni, ha ga itakatta n desu. Haisha e ikimashita.', vi: 'Có ạ. Một tháng trước em bị đau răng. Em đã đi nha sĩ.' },
        { who: 'Giám thị', role: 'examiner', text: 'たばこを{吸|す}いますか。', ro: 'Tabako o suimasu ka.', vi: 'Em có hút thuốc không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{吸|す}いません。たばこは{体|からだ}に{悪|わる}いですから。', ro: 'Iie, suimasen. Tabako wa karada ni warui desu kara.', vi: 'Không ạ. Vì thuốc lá có hại cho sức khoẻ.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở nhóm này',
      items: [
        'Câu hỏi "**{何|なに}をしないほうがいいですか**" → trả lời bằng **～ないほうがいいです** (phủ định). Câu hỏi "{何|なに}をしたほうがいいですか" → **～たほうがいいです**.',
        '**{風邪|かぜ}をひいたとき** (động từ た + とき) và **{風邪|かぜ}のとき** (N の とき) — hai cách hỏi, cùng nghĩa.',
        'Giám thị đóng vai bạn kể bệnh → bạn đáp như người khuyên: **～たほうがいいですよ** (thêm よ nghe tự nhiên).',
      ],
    },

    /* ── Không tranh ③ ── */
    { t: 'h', text: 'Câu hỏi không tranh ③ — Trước khi … / sau khi …' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: ～前に・～てから',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{寝|ね}る{前|まえ}に、{何|なに}をしますか。', ro: 'Neru mae ni, nani o shimasu ka.', vi: 'Trước khi ngủ em làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{寝|ね}る{前|まえ}に、{歯|は}を{磨|みが}いて、{少|すこ}し{本|ほん}を{読|よ}みます。', ro: 'Neru mae ni, ha o migaite, sukoshi hon o yomimasu.', vi: 'Trước khi ngủ em đánh răng rồi đọc sách một chút.' },
        { who: 'Giám thị', role: 'examiner', text: '{朝|あさ}、{起|お}きてから、{何|なに}をしますか。', ro: 'Asa, okite kara, nani o shimasu ka.', vi: 'Buổi sáng ngủ dậy xong em làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{起|お}きてから、シャワーを{浴|あ}びて、{朝|あさ}ご{飯|はん}を{食|た}べます。', ro: 'Okite kara, shawaa o abite, asagohan o tabemasu.', vi: 'Dậy xong em tắm vòi sen rồi ăn sáng.' },
        { who: 'Giám thị', role: 'examiner', text: 'うちへ{帰|かえ}ってから、{何|なに}をしますか。', ro: 'Uchi e kaette kara, nani o shimasu ka.', vi: 'Về nhà xong em làm gì?' },
        { who: 'Bạn', role: 'candidate', text: 'うちへ{帰|かえ}ってから、{手|て}を{洗|あら}って、{晩|ばん}ご{飯|はん}を{作|つく}ります。', ro: 'Uchi e kaette kara, te o aratte, bangohan o tsukurimasu.', vi: 'Về nhà xong em rửa tay rồi nấu cơm tối.' },
        { who: 'Giám thị', role: 'examiner', text: '{今日|きょう}、{学校|がっこう}へ{来|く}る{前|まえ}に、{何|なに}をしましたか。', ro: 'Kyou, gakkou e kuru mae ni, nani o shimashita ka.', vi: 'Hôm nay trước khi đến trường em đã làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{学校|がっこう}へ{来|く}る{前|まえ}に、{日本語|にほんご}の{言葉|ことば}を{勉強|べんきょう}しました。', ro: 'Gakkou e kuru mae ni, Nihongo no kotoba o benkyou shimashita.', vi: 'Trước khi đến trường em đã ôn từ vựng tiếng Nhật.' },
        { who: 'Giám thị', role: 'examiner', text: 'ご{飯|はん}を{食|た}べる{前|まえ}に、{何|なに}をしますか。', ro: 'Gohan o taberu mae ni, nani o shimasu ka.', vi: 'Trước khi ăn cơm em làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{手|て}を{洗|あら}います。', ro: 'Te o araimasu.', vi: 'Em rửa tay ạ.' },
        { who: 'Giám thị', role: 'examiner', text: '{日本語|にほんご}の{勉強|べんきょう}を{始|はじ}めてから、どのくらいですか。', ro: 'Nihongo no benkyou o hajimete kara, dono kurai desu ka.', vi: 'Em bắt đầu học tiếng Nhật được bao lâu rồi?' },
        { who: 'Bạn', role: 'candidate', text: '{日本語|にほんご}の{勉強|べんきょう}を{始|はじ}めてから、{4か月|よんかげつ}です。', ro: 'Nihongo no benkyou o hajimete kara, yonkagetsu desu.', vi: 'Từ khi bắt đầu học tiếng Nhật được 4 tháng ạ.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở nhóm này',
      items: [
        'Câu hỏi quá khứ **{来|く}る{前|まえ}に{何|なに}をしましたか** → động từ trước 前に giữ **thể từ điển**, chỉ đổi **cuối câu** sang ～ました.',
        '**～てから{何|なに}をしますか** → nhắc lại vế ～てから rồi kể: {起|お}きてから、～ます. Có thể nối nhiều việc bằng Vて、Vて、V.',
        '**～てから、どのくらいですか** = "từ khi … được bao lâu" — trả lời bằng khoảng thời gian: {4か月|よんかげつ}です／{1年|いちねん}です.',
      ],
    },

    /* ── Có tranh ── */
    { t: 'h', text: 'Câu hỏi có tranh — người bị đau, túi thuốc, bảng bệnh viện' },
    {
      t: 'p',
      text: 'Tranh thi được viết lại thành bảng (không dùng ảnh). Với tranh Bài 12, giám thị hay hỏi: **この{人|ひと}はどうしたんですか · {何|なに}を{飲|の}んでいますか · {1日|いちにち}に{何回|なんかい}{飲|の}みますか · いつ{飲|の}みますか · {何日分|なんにちぶん}ですか · {病院|びょういん}に{入|はい}る{前|まえ}に{何|なに}をしますか**.',
    },
    {
      t: 'table',
      caption: 'Tranh 1 — bốn người không khoẻ',
      head: ['Người', 'Tranh vẽ'],
      rows: [
        ['① {男|おとこ}の{人|ひと}', 'Ôm má, nhăn mặt (đau răng)'],
        ['② {女|おんな}の{人|ひと}', 'Ôm trán, cầm nhiệt kế 38,5 độ'],
        ['③ {子|こ}ども', 'Ôm bụng'],
        ['④ {学生|がくせい}', 'Chân quấn băng, chống nạng'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 1 — hỏi – đáp',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '①の{男|おとこ}の{人|ひと}はどうしたんですか。', ro: 'Ichi no otoko no hito wa dou shita n desu ka.', vi: 'Người đàn ông ① bị làm sao?' },
        { who: 'Bạn', role: 'candidate', text: '{歯|は}が{痛|いた}いんです。', ro: 'Ha ga itai n desu.', vi: 'Anh ấy đau răng.' },
        { who: 'Giám thị', role: 'examiner', text: '②の{女|おんな}の{人|ひと}は{熱|ねつ}がありますか。', ro: 'Ni no onna no hito wa netsu ga arimasu ka.', vi: 'Người phụ nữ ② có sốt không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、あります。{38度|さんじゅうはちど}{5分|ごぶ}です。', ro: 'Hai, arimasu. Sanjuuhachi do gobu desu.', vi: 'Có ạ. 38 độ 5.' },
        { who: 'Giám thị', role: 'examiner', text: '④の{学生|がくせい}はどうしたんですか。', ro: 'Yon no gakusei wa dou shita n desu ka.', vi: 'Cậu học sinh ④ bị làm sao?' },
        { who: 'Bạn', role: 'candidate', text: '{足|あし}にけがをしたんです。', ro: 'Ashi ni kega o shita n desu.', vi: 'Cậu ấy bị thương ở chân.' },
        { who: 'Giám thị', role: 'examiner', text: '①の{男|おとこ}の{人|ひと}に、どんなアドバイスをしますか。', ro: 'Ichi no otoko no hito ni, donna adobaisu o shimasu ka.', vi: 'Em khuyên người đàn ông ① thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{歯医者|はいしゃ}へ{行|い}ったほうがいいです。{固|かた}いものを{食|た}べないほうがいいです。', ro: 'Haisha e itta hou ga ii desu. Katai mono o tabenai hou ga ii desu.', vi: 'Nên đi nha sĩ. Không nên ăn đồ cứng.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh 2 — túi thuốc (内服薬)',
      head: ['Mục', 'Ghi trên túi'],
      rows: [
        ['Tên', 'グエン・ミン {様|さま}'],
        ['Cách dùng', '{1日|いちにち}{3回|さんかい} · {5日分|いつかぶん}'],
        ['Lúc uống', '{食後|しょくご} (sau bữa ăn) — sáng, trưa, tối'],
        ['Mỗi lần', '2 viên (2{錠|じょう})'],
        ['Nơi phát', 'みどり{病院|びょういん} — tầng 1 có {薬局|やっきょく}'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 2 — hỏi – đáp',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'これは{何|なん}ですか。', ro: 'Kore wa nan desu ka.', vi: 'Đây là cái gì?' },
        { who: 'Bạn', role: 'candidate', text: '{薬|くすり}です。ミンさんの{薬|くすり}です。', ro: 'Kusuri desu. Min-san no kusuri desu.', vi: 'Là thuốc ạ. Thuốc của Minh.' },
        { who: 'Giám thị', role: 'examiner', text: 'この{薬|くすり}は{1日|いちにち}に{何回|なんかい}{飲|の}みますか。', ro: 'Kono kusuri wa ichinichi ni nankai nomimasu ka.', vi: 'Thuốc này ngày uống mấy lần?' },
        { who: 'Bạn', role: 'candidate', text: '{1日|いちにち}に{3回|さんかい}{飲|の}みます。', ro: 'Ichinichi ni sankai nomimasu.', vi: 'Ngày uống 3 lần.' },
        { who: 'Giám thị', role: 'examiner', text: 'いつ{飲|の}みますか。', ro: 'Itsu nomimasu ka.', vi: 'Uống lúc nào?' },
        { who: 'Bạn', role: 'candidate', text: 'ご{飯|はん}を{食|た}べてから{飲|の}みます。', ro: 'Gohan o tabete kara nomimasu.', vi: 'Uống sau khi ăn cơm.' },
        { who: 'Giám thị', role: 'examiner', text: '{何日分|なんにちぶん}ですか。', ro: 'Nannichibun desu ka.', vi: 'Thuốc cho mấy ngày?' },
        { who: 'Bạn', role: 'candidate', text: '{5日分|いつかぶん}です。', ro: 'Itsukabun desu.', vi: 'Cho 5 ngày ạ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh 3 — bảng hướng dẫn ở cửa phòng khám',
      head: ['Thứ tự', 'Bảng ghi (tả lại)'],
      rows: [
        ['1', 'Cởi giày, để lên giá giày'],
        ['2', 'Quầy {受付|うけつけ}: nộp {保険証|ほけんしょう}, điền tên – địa chỉ'],
        ['3', 'Ngồi ở {待合室|まちあいしつ} chờ gọi tên'],
        ['Giờ', '9:00–12:00 · 14:00–18:00 · Chủ nhật nghỉ'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 3 — hỏi – đáp',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{病院|びょういん}に{入|はい}る{前|まえ}に、{何|なに}をしますか。', ro: 'Byouin ni hairu mae ni, nani o shimasu ka.', vi: 'Trước khi vào phòng khám phải làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{靴|くつ}を{脱|ぬ}ぎます。', ro: 'Kutsu o nugimasu.', vi: 'Cởi giày ạ.' },
        { who: 'Giám thị', role: 'examiner', text: '{受付|うけつけ}で{何|なに}を{出|だ}しますか。', ro: 'Uketsuke de nani o dashimasu ka.', vi: 'Ở quầy tiếp tân nộp cái gì?' },
        { who: 'Bạn', role: 'candidate', text: '{保険証|ほけんしょう}を{出|だ}します。', ro: 'Hokenshou o dashimasu.', vi: 'Nộp thẻ bảo hiểm ạ.' },
        { who: 'Giám thị', role: 'examiner', text: '{名前|なまえ}と{住所|じゅうしょ}を{書|か}いてから、どこで{待|ま}ちますか。', ro: 'Namae to juusho o kaite kara, doko de machimasu ka.', vi: 'Viết tên và địa chỉ xong thì chờ ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: '{待合室|まちあいしつ}で{待|ま}ちます。', ro: 'Machiaishitsu de machimasu.', vi: 'Chờ ở phòng chờ ạ.' },
        { who: 'Giám thị', role: 'examiner', text: '{日曜日|にちようび}、この{病院|びょういん}へ{行|い}くことができますか。', ro: 'Nichiyoubi, kono byouin e iku koto ga dekimasu ka.', vi: 'Chủ nhật có thể đến bệnh viện này không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、できません。{日曜日|にちようび}は{休|やす}みです。', ro: 'Iie, dekimasen. Nichiyoubi wa yasumi desu.', vi: 'Không ạ. Chủ nhật nghỉ.' },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo cho câu có tranh',
      items: [
        '"**この{人|ひと}はどうしたんですか**" → trả lời bằng **～んです** (đúng mẫu của câu hỏi): {歯|は}が{痛|いた}いんです／けがをしたんです.',
        'Túi thuốc: **{1日|いちにち}に{3回|さんかい}** (có に), **{5日分|いつかぶん}** (ngày đọc theo lịch: みっか, よっか, いつか), {食後|しょくご} → nói ra thành **ご{飯|はん}を{食|た}べてから**, {食前|しょくぜん} → **ご{飯|はん}を{食|た}べる{前|まえ}に**.',
        'Bảng thủ tục: hỏi "trước khi …" → việc đứng **trước** trong bảng; hỏi "～てから, ở đâu" → việc đứng **sau**.',
      ],
    },

    /* ── Đóng vai ── */
    { t: 'h', text: 'Đóng vai — xin về sớm, khuyên bạn, khám bệnh (luyện hai người)' },
    {
      t: 'dialogue',
      title: 'Vai 1 — A là học sinh không khoẻ, B là thầy/cô (言ってみよう 1-2, p.208)',
      lines: [
        { who: 'A', role: 'a', text: 'あのう、{先生|せんせい}、{病院|びょういん}へ{行|い}ってきてもいいですか。', ro: 'Anou, sensei, byouin e itte kite mo ii desu ka.', vi: 'Dạ thưa thầy, em đi bệnh viện (rồi quay lại) được không ạ?' },
        { who: 'B', role: 'b', text: 'どうしたんですか。', ro: 'Dou shita n desu ka.', vi: 'Em làm sao thế?' },
        { who: 'A', role: 'a', text: 'のどが{痛|いた}いんです。{熱|ねつ}も{少|すこ}しあるんです。', ro: 'Nodo ga itai n desu. Netsu mo sukoshi aru n desu.', vi: 'Em đau họng. Cũng hơi sốt ạ.' },
        { who: 'B', role: 'b', text: 'それはいけませんね。いいですよ。お{大事|だいじ}に。', ro: 'Sore wa ikemasen ne. Ii desu yo. Odaiji ni.', vi: 'Thế thì không ổn rồi. Được, em đi đi. Giữ gìn sức khoẻ nhé.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Vai 2 — hôm sau: A hỏi vì sao B vắng, B kể (言ってみよう 1-3, p.208)',
      lines: [
        { who: 'A', role: 'a', text: 'Bさん、{昨日|きのう}、どうしたんですか。{授業|じゅぎょう}に{来|き}ませんでしたね。', ro: 'B-san, kinou, dou shita n desu ka. Jugyou ni kimasen deshita ne.', vi: 'B ơi, hôm qua cậu làm sao thế? Không đến lớp nhỉ.' },
        { who: 'B', role: 'b', text: '{熱|ねつ}が{39度|さんじゅうきゅうど}あったんです。', ro: 'Netsu ga sanjuukyuu do atta n desu.', vi: 'Mình sốt 39 độ.' },
        { who: 'A', role: 'a', text: 'えっ？{大丈夫|だいじょうぶ}ですか。', ro: 'E? Daijoubu desu ka.', vi: 'Hả? Cậu có sao không?' },
        { who: 'B', role: 'b', text: 'はい。おかげさまで、もう{元気|げんき}になりました。', ro: 'Hai. Okagesama de, mou genki ni narimashita.', vi: 'Ừ. Nhờ trời, mình khoẻ lại rồi.' },
        { who: 'A', role: 'a', text: 'そうですか。よかったですね。', ro: 'Sou desu ka. Yokatta desu ne.', vi: 'Vậy à. Tốt quá nhỉ.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Vai 3 — A là bác sĩ, B là bệnh nhân (ペアで話しましょう p.217)',
      lines: [
        { who: 'A', role: 'examiner', text: 'どうしましたか。', ro: 'Dou shimashita ka.', vi: 'Anh bị làm sao?' },
        { who: 'B', role: 'b', text: 'おなかが{痛|いた}いんです。', ro: 'Onaka ga itai n desu.', vi: 'Tôi đau bụng.' },
        { who: 'A', role: 'examiner', text: 'いつからですか。', ro: 'Itsu kara desu ka.', vi: 'Từ bao giờ?' },
        { who: 'B', role: 'b', text: '{昨日|きのう}の{昼|ひる}からです。{昼|ひる}ご{飯|はん}を{食|た}べてから、{痛|いた}くなりました。', ro: 'Kinou no hiru kara desu. Hirugohan o tabete kara, itaku narimashita.', vi: 'Từ trưa hôm qua. Ăn trưa xong thì bị đau.' },
        { who: 'A', role: 'examiner', text: '{何|なに}か{薬|くすり}を{飲|の}みましたか。', ro: 'Nanika kusuri o nomimashita ka.', vi: 'Đã uống thuốc gì chưa?' },
        { who: 'B', role: 'b', text: 'はい、{今朝|けさ}、{朝|あさ}ご{飯|はん}の{前|まえ}に{飲|の}みました。', ro: 'Hai, kesa, asagohan no mae ni nomimashita.', vi: 'Rồi ạ, sáng nay trước bữa sáng tôi đã uống.' },
        { who: 'A', role: 'examiner', text: 'じゃ、ここに{横|よこ}になってください。……{薬|くすり}を{出|だ}しますから、{1日|いちにち}に{3回|さんかい}、ご{飯|はん}を{食|た}べてから{飲|の}んでください。', ro: 'Ja, koko ni yoko ni natte kudasai. …… Kusuri o dashimasu kara, ichinichi ni sankai, gohan o tabete kara nonde kudasai.', vi: 'Vậy anh nằm xuống đây. … Tôi kê thuốc, ngày 3 lần, uống sau khi ăn.' },
        { who: 'B', role: 'b', text: 'はい、わかりました。ありがとうございました。', ro: 'Hai, wakarimashita. Arigatou gozaimashita.', vi: 'Vâng, tôi hiểu rồi. Cảm ơn bác sĩ.' },
      ],
    },

    /* ── Reading ── */
    { t: 'h', text: 'Đọc to — Reading (40 điểm)' },
    {
      t: 'p',
      text: 'Đề đọc dài khoảng 100–110 ký tự: **4 từ chữ Hán** gạch chân (12đ), **4 từ katakana** (12đ), còn lại hiragana (16đ, sai một ký tự −0,2đ). 30 giây chuẩn bị. Bốn đoạn dưới đây viết đúng khuôn đó, chỉ dùng từ Bài 1–12. Tắt furigana khi đã quen (hoặc luyện ở **Chữ Hán · Đọc không furigana**).',
    },
    {
      t: 'examples',
      items: [
        {
          en: 'きのう、アルバイトのてんちょうに{電話|でんわ}しました。「すみません、{熱|ねつ}があるんです。きょうはやすんでもいいですか。」「それはいけませんね。おだいじに。」わたしはくすりをのんで、ベッドでねました。きょうはもうげんきです。{睡眠|すいみん}はたいせつですね。',
          ro: 'Kinou, arubaito no tenchou ni denwa shimashita. "Sumimasen, netsu ga aru n desu. Kyou wa yasunde mo ii desu ka." "Sore wa ikemasen ne. Odaiji ni." Watashi wa kusuri o nonde, beddo de nemashita. Kyou wa mou genki desu. Suimin wa taisetsu desu ne.',
          vi: 'Hôm qua tôi gọi điện cho quản lý chỗ làm thêm. "Xin lỗi, em bị sốt. Hôm nay em nghỉ được không ạ?" "Thế thì không ổn rồi. Giữ gìn sức khoẻ nhé." Tôi uống thuốc rồi ngủ trên giường. Hôm nay tôi đã khoẻ rồi. Giấc ngủ quan trọng thật.',
        },
        {
          en: 'わたしはまいあさ、ジョギングをしています。はしってから、シャワーをあびて、{自分|じぶん}でサンドイッチをつくります。トマトとキャベツをたくさんいれます。{野菜|やさい}はからだにいいですから、みなさんもできるだけたべたほうがいいですよ。',
          ro: 'Watashi wa maiasa, jogingu o shite imasu. Hashitte kara, shawaa o abite, jibun de sandoicchi o tsukurimasu. Tomato to kyabetsu o takusan iremasu. Yasai wa karada ni ii desu kara, minasan mo dekirudake tabeta hou ga ii desu yo.',
          vi: 'Sáng nào tôi cũng chạy bộ. Chạy xong tôi tắm vòi sen rồi tự làm bánh mì kẹp. Tôi cho nhiều cà chua và bắp cải. Rau tốt cho sức khoẻ nên mọi người cũng nên ăn càng nhiều càng tốt.',
        },
        {
          en: 'びょういんのうけつけで{保険証|ほけんしょう}をだしました。{待合室|まちあいしつ}でさんじゅっぷんまちました。いしゃは「かぜですね。きょうはおふろにはいらないでください」といいました。{薬局|やっきょく}でくすりをもらいました。ごはんをたべてから、のみます。',
          ro: 'Byouin no uketsuke de hokenshou o dashimashita. Machiaishitsu de sanjuppun machimashita. Isha wa "Kaze desu ne. Kyou wa ofuro ni hairanaide kudasai" to iimashita. Yakkyoku de kusuri o moraimashita. Gohan o tabete kara, nomimasu.',
          vi: 'Tôi nộp thẻ bảo hiểm ở quầy tiếp tân bệnh viện. Tôi chờ 30 phút ở phòng chờ. Bác sĩ nói "Cảm rồi. Hôm nay đừng tắm bồn." Tôi nhận thuốc ở hiệu thuốc. Tôi uống sau khi ăn cơm.',
        },
        {
          en: 'めがかゆいとき、コンタクトレンズをしないほうがいいです。そとからかえってから、よくてとかおをあらってください。でかけるまえに、マスクをしてください。{説明書|せつめいしょ}をよんでから、めぐすりをつかってください。はやくよくなりますよ。',
          ro: 'Me ga kayui toki, kontakuto renzu o shinai hou ga ii desu. Soto kara kaette kara, yoku te to kao o aratte kudasai. Dekakeru mae ni, masuku o shite kudasai. Setsumeisho o yonde kara, megusuri o tsukatte kudasai. Hayaku yoku narimasu yo.',
          vi: 'Khi ngứa mắt thì không nên đeo kính áp tròng. Đi ngoài về hãy rửa tay và mặt kỹ. Trước khi ra ngoài hãy đeo khẩu trang. Đọc tờ hướng dẫn xong rồi dùng thuốc nhỏ mắt. Sẽ mau khỏi thôi.',
        },
      ],
    },
    {
      t: 'note',
      title: 'Chỗ dễ đọc sai trong bốn đoạn trên',
      items: [
        '**熱 ねつ**, **睡眠 すいみん**, **自分 じぶん**, **野菜 やさい**, **保険証 ほけんしょう**, **待合室 まちあいしつ**, **薬局 やっきょく**, **説明書 せつめいしょ** — từ chữ Hán dạng đề thi.',
        'Katakana kéo dài / âm ngắt: アルバイト, ベッド **beddo**, ジョギング, シャワー **shawaa**, サンドイッチ **sandoicchi**, トマト, キャベツ, コンタクトレンズ, マスク.',
        '～んです đọc liền: あるんです (**aru n desu**). ～ほうがいいです: **tabeta hou ga ii desu**.',
        'は đọc **wa**, を đọc **o**, へ đọc **e**: きょう**は**, {保険証|ほけんしょう}**を**, そと**から**.',
      ],
    },

    /* ── Tự ghi âm ── */
    { t: 'h', text: 'Tự ghi âm — trả lời không nhìn đáp án' },
    {
      t: 'speak',
      id: 'b12-noi-ghi-am',
      part: '1',
      questions: [
        'さいきん、からだの ちょうしは どうですか。',
        'なにか からだに いい ことを して いますか。',
        'まいにち うんどうを して いますか。',
        'まいばん なんじかん ねて いますか。',
        'かぜを ひいた とき、どう しますか。',
        'かぜの とき、なにを しない ほうが いいですか。',
        'ねる まえに、なにを しますか。',
        'あさ、おきてから、なにを しますか。',
        'うちへ かえってから、なにを しますか。',
        'ごはんを たべる まえに、なにを しますか。',
        'さいきん、びょういんへ いきましたか。',
        'ともだちが「あたまが いたいんです」と いいました。どんな アドバイスを しますか。',
      ],
    },
  ],
};

/* ═══════════════════════════ 7. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b12-bai-tap',
  kind: 'homework',
  title: 'Bài tập về nhà — Bài 12 (có đáp án)',
  goal: 'Tự chia thể た / thể thường, dịch, đổi dạng câu, chọn trợ từ – từ vựng – câu đáp và ghép câu Bài 12 không cần nhìn bài học.',
  minutes: 50,
  blocks: [
    {
      t: 'p',
      text: 'Gõ tiếng Nhật bằng bộ gõ (gõ romaji, máy đổi sang kana). Chữ Hán hay kana đều được chấp nhận; dấu câu và dấu cách không tính. Nếu máy chấm sai mà bạn tin mình đúng, bấm **Hỏi gia sư** ngay dưới câu đó.',
    },
    {
      t: 'quiz',
      id: 'b12-bt-dich',
      title: 'Dịch sang tiếng Nhật',
      kind: 'translate',
      grammar: '普通形 + んです（ナA／N：なんです）· Vた／Vない ほうがいいです · V辞書形／Nの／thời gian + 前に · Vてから',
      items: [
        { q: 'Sao thế? (hỏi bạn trông mệt)', answers: V('どうしたんですか。', 'どうしたの。'), hint: 'どうした + んですか' },
        { q: 'Tôi đau đầu. (giải thích)', answers: V('{頭|あたま}が{痛|いた}いんです。'), hint: '頭, 痛い + んです' },
        { q: 'Tôi bị sốt.', answers: V('{熱|ねつ}があるんです。', '{熱|ねつ}があります。'), hint: '熱があります → ある + んです' },
        { q: 'Tôi bị cảm. (dùng 風邪 + です)', answers: V('{風邪|かぜ}なんです。', '{風邪|かぜ}をひいたんです。'), hint: 'N + なんです' },
        { q: 'Hôm qua tôi bị thương. (giải thích vì sao nghỉ)', answers: V('{昨日|きのう}、けがをしたんです。', '{昨日|きのう}けがをしたんです。'), hint: 'けがをしました → した + んです' },
        { q: 'Tôi không muốn ăn (không có cảm giác thèm ăn).', answers: V('{食欲|しょくよく}がないんです。', '{食欲|しょくよく}がありません。'), hint: '食欲がありません → ない + んです' },
        { q: 'Nhờ trời, tôi khỏi rồi.', answers: V('おかげさまで、もう{治|なお}りました。', 'おかげさまで、{治|なお}りました。'), hint: 'おかげさまで, もう, 治ります' },
        { q: 'Bạn nên đi bệnh viện sớm.', answers: V('{早|はや}く{病院|びょういん}へ{行|い}ったほうがいいですよ。', '{早|はや}く{病院|びょういん}に{行|い}ったほうがいいですよ。', '{早|はや}く{病院|びょういん}へ{行|い}ったほうがいいです。', '{早|はや}く{病院|びょういん}に{行|い}ったほうがいいです。'), hint: '早く, 病院, 行った + ほうがいい' },
        { q: 'Không nên uống nhiều rượu.', answers: V('あまりお{酒|さけ}を{飲|の}まないほうがいいです。', 'お{酒|さけ}をあまり{飲|の}まないほうがいいです。', 'あまりお{酒|さけ}を{飲|の}まないほうがいいですよ。'), hint: 'あまり, お酒, 飲まない + ほうがいい' },
        { q: 'Hôm nay nên ở nhà nghỉ ngơi cho khoẻ.', answers: V('{今日|きょう}はうちでゆっくり{休|やす}んだほうがいいです。', '{今日|きょう}はうちでゆっくり{休|やす}んだほうがいいですよ。', '{今日|きょう}は{家|いえ}でゆっくり{休|やす}んだほうがいいです。'), hint: 'うちで, ゆっくり, 休んだ + ほうがいい' },
        { q: 'Nên vận động càng nhiều càng tốt.', answers: V('できるだけ{運動|うんどう}をしたほうがいいです。', 'できるだけ{運動|うんどう}したほうがいいです。', 'できるだけ{運動|うんどう}をしたほうがいいですよ。'), hint: 'できるだけ, 運動をした + ほうがいい' },
        { q: 'Uống thuốc trước khi ăn cơm.', answers: V('ご{飯|はん}を{食|た}べる{前|まえ}に、{薬|くすり}を{飲|の}みます。', 'ご{飯|はん}を{食|た}べる{前|まえ}に{薬|くすり}を{飲|の}んでください。'), hint: '食べる (từ điển) + 前に' },
        { q: 'Rửa tay trước bữa ăn.', answers: V('{食事|しょくじ}の{前|まえ}に、{手|て}を{洗|あら}います。', '{食事|しょくじ}の{前|まえ}に{手|て}を{洗|あら}ってください。'), hint: '食事の前に' },
        { q: 'Tôi bị cảm cách đây một tuần.', answers: V('{1週間|いっしゅうかん}{前|まえ}に、{風邪|かぜ}をひきました。', '{一週間|いっしゅうかん}{前|まえ}に、{風邪|かぜ}をひきました。'), hint: '1週間前に (không の)' },
        { q: 'Đánh răng xong rồi đi ngủ.', answers: V('{歯|は}を{磨|みが}いてから、{寝|ね}ます。'), hint: '磨いて + から' },
        { q: 'Cởi giày rồi mới vào.', answers: V('{靴|くつ}を{脱|ぬ}いでから、{入|はい}ってください。'), hint: '脱いで + から' },
        { q: '(Bác sĩ hỏi từ bao giờ) Hôm qua sau khi ăn tối thì bị đau.', answers: V('{昨日|きのう}、{晩|ばん}ご{飯|はん}を{食|た}べてから、{痛|いた}くなりました。', '{昨日|きのう}、{晩|ばん}ご{飯|はん}を{食|た}べてから{痛|いた}くなったんです。'), hint: '食べてから + 痛くなりました' },
        { q: 'Nộp thẻ bảo hiểm xong thì chờ ở phòng chờ.', answers: V('{保険証|ほけんしょう}を{出|だ}してから、{待合室|まちあいしつ}で{待|ま}ってください。'), hint: '保険証を出して + から, 待合室で待って' },
      ],
    },
    {
      t: 'quiz',
      id: 'b12-bt-doi-dang',
      title: 'Đổi dạng — viết lại theo yêu cầu (gõ chữ Hán hoặc kana)',
      kind: 'fill',
      grammar: 'Thể た = thể て đổi て→た · 普通形 + んです (N／ナA: なんです) · Vた／Vないほうがいいです · V辞書形前に · Vてから',
      items: [
        { q: '{休|やす}みます → thể た', answers: V('{休|やす}んだ') },
        { q: '{磨|みが}きます → thể た', answers: V('{磨|みが}いた') },
        { q: '{脱|ぬ}ぎます → thể た', answers: V('{脱|ぬ}いだ') },
        { q: '{走|はし}ります → thể た', answers: V('{走|はし}った') },
        { q: '{行|い}きます → thể た', answers: V('{行|い}った') },
        { q: '{熱|ねつ}があります → ～んです', answers: V('{熱|ねつ}があるんです') },
        { q: '{頭|あたま}が{痛|いた}かったです → ～んです', answers: V('{頭|あたま}が{痛|いた}かったんです') },
        { q: '{風邪|かぜ}です → ～んです', answers: V('{風邪|かぜ}なんです') },
        { q: '{暇|ひま}です → ～んです', answers: V('{暇|ひま}なんです') },
        { q: '{歯医者|はいしゃ}へ{行|い}きます → khuyên nên (～ほうがいいです)', answers: V('{歯医者|はいしゃ}へ{行|い}ったほうがいいです', '{歯医者|はいしゃ}に{行|い}ったほうがいいです') },
        { q: 'シャワーを{浴|あ}びます → khuyên không nên (～ほうがいいです)', answers: V('シャワーを{浴|あ}びないほうがいいです') },
        { q: '{声|こえ}を{出|だ}します → khuyên không nên (～ほうがいいです)', answers: V('{声|こえ}を{出|だ}さないほうがいいです') },
        { q: '{寝|ね}ます ＋ {薬|くすり}を{塗|ぬ}ります → "trước khi ngủ bôi thuốc" (～前に)', answers: V('{寝|ね}る{前|まえ}に{薬|くすり}を{塗|ぬ}ります', '{寝|ね}る{前|まえ}に、{薬|くすり}を{塗|ぬ}ります') },
        { q: '{運動|うんどう}します ＋ シャワーを{浴|あ}びます → "vận động xong rồi tắm" (～てから)', answers: V('{運動|うんどう}してからシャワーを{浴|あ}びます', '{運動|うんどう}をしてからシャワーを{浴|あ}びます') },
      ],
    },
    {
      t: 'mcq',
      id: 'b12-bt-tro-tu',
      title: 'Chọn trợ từ / từ nối đúng',
      items: [
        { q: '{頭|あたま}＿{痛|いた}いんです。', options: ['を', 'が', 'に', 'で'], correct: 1, why: 'Bộ phận đau → **が**痛い.' },
        { q: '{風邪|かぜ}＿ひきました。', options: ['が', 'に', 'を', 'で'], correct: 2, why: '風邪**を**ひきます (cụm cố định).' },
        { q: '{足|あし}＿けがをしました。', options: ['を', 'に', 'が', 'で'], correct: 1, why: 'Bị thương **ở** chỗ nào → **に**.' },
        { q: '{食事|しょくじ}＿{前|まえ}に、{手|て}を{洗|あら}います。', options: ['を', 'に', 'の', 'で'], correct: 2, why: 'N **の** 前に.' },
        { q: '{1日|いちにち}＿{3回|さんかい}{飲|の}んでください。', options: ['で', 'に', 'を', 'が'], correct: 1, why: 'Trong một khoảng (1 ngày) bao nhiêu lần → **に**.' },
        { q: 'お{風呂|ふろ}＿{入|はい}らないほうがいいです。', options: ['を', 'で', 'に', 'が'], correct: 2, why: 'お風呂**に**入ります.' },
        { q: 'シャワー＿{浴|あ}びます。', options: ['に', 'を', 'で', 'が'], correct: 1, why: 'シャワー**を**浴びます.' },
        { q: '{歯|は}を{磨|みが}いて＿、{寝|ね}ます。', options: ['から', 'まで', 'ので', 'より'], correct: 0, why: 'Vて + **から** (ポイント 107).' },
        { q: 'ベッド＿{横|よこ}になってください。', options: ['を', 'に', 'が', 'へ'], correct: 1, why: 'Nằm **lên** giường → **に**.' },
        { q: '{保険証|ほけんしょう}＿{出|だ}してください。', options: ['を', 'が', 'に', 'で'], correct: 0, why: 'Tân ngữ → **を**出します.' },
        { q: '{体|からだ}＿いいですから、{運動|うんどう}をしたほうがいいです。', options: ['が', 'に', 'を', 'で'], correct: 1, why: '体**に**いい (tốt **cho** cơ thể).' },
      ],
    },
    {
      t: 'mcq',
      id: 'b12-bt-tu-vung',
      title: 'Chọn từ đúng',
      items: [
        { q: '{風邪|かぜ}をひいて、＿がないんです。何も{食|た}べたくないです。', options: ['{食欲|しょくよく}', '{睡眠|すいみん}', '{調子|ちょうし}', '{熱|ねつ}'], correct: 0, why: 'Không muốn ăn → **{食欲|しょくよく}**がない.' },
        { q: '{熱|ねつ}は{何|なん}＿ですか。——{38|さんじゅうはち}＿です。', options: ['{回|かい}', '{度|ど}', '{分|ふん}', '{時間|じかん}'], correct: 1, why: 'Nhiệt độ → **～{度|ど}**.' },
        { q: '{歯|は}が{痛|いた}いんです。——＿へ{行|い}ったほうがいいですよ。', options: ['{薬局|やっきょく}', '{歯医者|はいしゃ}', '{待合室|まちあいしつ}', '{飲|の}み{会|かい}'], correct: 1, why: 'Đau răng → **{歯医者|はいしゃ}** (nha sĩ).' },
        { q: '{料理|りょうり}を{作|つく}るとき、{手|て}に＿をしました。', options: ['けが', 'やけど', 'シャワー', '{運動|うんどう}'], correct: 1, why: 'Nấu ăn bị bỏng → **やけど**.' },
        { q: 'やけどをしたんですか。この{薬|くすり}を＿ください。', options: ['{飲|の}んで', '{塗|ぬ}って', '{磨|みが}いて', '{脱|ぬ}いで'], correct: 1, why: 'Thuốc bôi → **{塗|ぬ}って**.' },
        { q: '{歯|は}が{痛|いた}いときは、＿ものを{食|た}べないほうがいいです。', options: ['{柔|やわ}らかい', '{固|かた}い', 'かゆい', '{大丈夫|だいじょうぶ}な'], correct: 1, why: 'Đau răng → đừng ăn đồ **cứng** ({固|かた}い).' },
        { q: '{毎晩|まいばん}{8時間|はちじかん}＿{寝|ね}ています。', options: ['{以上|いじょう}', '{前|まえ}', 'から', 'ごろ'], correct: 0, why: 'Từ 8 tiếng **trở lên** → **{以上|いじょう}**.' },
        { q: '{薬|くすり}を{飲|の}む{前|まえ}に、＿を{読|よ}んでください。', options: ['{保険証|ほけんしょう}', '{説明書|せつめいしょ}', '{上着|うわぎ}', 'コンタクトレンズ'], correct: 1, why: 'Đọc **tờ hướng dẫn** ({説明書|せつめいしょ}).' },
        { q: '{医者|いしゃ}：{上着|うわぎ}を{脱|ぬ}いで、ベッドに＿ください。', options: ['{走|はし}って', '{横|よこ}になって', '{出|で}かけて', '{準備|じゅんび}して'], correct: 1, why: 'Nằm xuống → **{横|よこ}になって**.' },
        { q: '{目|め}が＿んです。コンタクトレンズをしないほうがいいですね。', options: ['{固|かた}い', 'かゆい', '{柔|やわ}らかい', '{早|はや}い'], correct: 1, why: 'Mắt **ngứa** → かゆい.' },
        { q: 'A：{熱|ねつ}があるんです。B：＿。お{大事|だいじ}に。', options: ['おかげさまで', 'それはいけませんね', 'よかったですね', 'いただきます'], correct: 1, why: 'Cảm thông → **それはいけませんね**.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b12-bt-hoi-dap',
      title: 'Chọn câu đáp đúng',
      items: [
        { q: 'A：どうしたんですか。', options: ['おなかが{痛|いた}いんです。', 'はい、どうぞ。', 'おかげさまで。', 'お{大事|だいじ}に。'], correct: 0, why: 'Giải thích tình trạng → **～んです**.' },
        { q: 'A：{昨日|きのう}、どうしたんですか。{授業|じゅぎょう}に{来|き}ませんでしたね。', options: ['{風邪|かぜ}をひくんです。', '{風邪|かぜ}をひいたんです。', '{風邪|かぜ}なんでした。', '{風邪|かぜ}をひきたいです。'], correct: 1, why: 'Chuyện hôm qua → thể た: **ひいたんです**.' },
        { q: 'A：{大丈夫|だいじょうぶ}ですか。（B đã khỏi）', options: ['はい、おかげさまで、もう{治|なお}りました。', 'はい、お{大事|だいじ}に。', 'いいえ、{大丈夫|だいじょうぶ}です。', 'それはいけませんね。'], correct: 0, why: 'Đáp lời hỏi thăm: **おかげさまで**.' },
        { q: 'A：{早|はや}く{寝|ね}たほうがいいですよ。', options: ['はい、わかりました。', 'いいえ、{寝|ね}ません。', 'お{大事|だいじ}に。', 'どうしたんですか。'], correct: 0, why: 'Nhận lời khuyên → **はい、わかりました**.' },
        { q: '{医者|いしゃ}：いつからですか。', options: ['{昨日|きのう}からです。', '{1日|いちにち}に{3回|さんかい}です。', 'ご{飯|はん}の{前|まえ}です。', '{38度|さんじゅうはちど}です。'], correct: 0, why: 'いつから → **thời điểm + から**.' },
        { q: '{医者|いしゃ}：{何|なに}か{薬|くすり}を{飲|の}みましたか。', options: ['はい、{寝|ね}る{前|まえ}に{飲|の}みました。', 'はい、{寝|ね}た{前|まえ}に{飲|の}みました。', 'はい、{飲|の}んだほうがいいです。', 'いいえ、{飲|の}まないでください。'], correct: 0, why: '**{寝|ね}る{前|まえ}に** (thể từ điển) + 飲みました.' },
        { q: '{薬剤師|やくざいし}：ご{飯|はん}を{食|た}べてから{飲|の}んでください。 — Khi nào uống?', options: ['Trước bữa ăn', 'Sau bữa ăn', 'Trong bữa ăn', 'Trước khi ngủ'], correct: 1, why: '～**てから** = sau khi.' },
      ],
    },
    {
      t: 'build',
      id: 'b12-bt-ghep',
      title: 'Ghép câu — từ lúc thấy mệt đến lúc lấy thuốc',
      items: [
        { vi: 'Sao thế? Mặt bạn đỏ lắm.', chips: ['どうしたんですか。', '{顔|かお}が', '{赤|あか}いですよ', '{顔|かお}を', '{赤|あか}いんですか'], answer: ['どうしたんですか。', '{顔|かお}が', '{赤|あか}いですよ'], ro: 'Dou shita n desu ka. Kao ga akai desu yo.' },
        { vi: 'Tôi bị sốt từ hôm qua.', chips: ['{昨日|きのう}から', '{熱|ねつ}が', 'あるんです', 'ありますんです', '{熱|ねつ}を'], answer: ['{昨日|きのう}から', '{熱|ねつ}が', 'あるんです'], ro: 'Kinou kara netsu ga aru n desu.' },
        { vi: 'Thưa cô, em về sớm được không ạ?', chips: ['{先生|せんせい}、', '{早|はや}く', '{帰|かえ}っても', 'いいですか', '{帰|かえ}りても', '{早|はや}い'], answer: ['{先生|せんせい}、', '{早|はや}く', '{帰|かえ}っても', 'いいですか'], ro: 'Sensei, hayaku kaette mo ii desu ka.' },
        { vi: 'Thế thì không ổn rồi. Giữ gìn sức khoẻ nhé.', chips: ['それは', 'いけませんね。', 'お{大事|だいじ}に。', 'おかげさまで。', 'よかったですね。'], answer: ['それは', 'いけませんね。', 'お{大事|だいじ}に。'], ro: 'Sore wa ikemasen ne. Odaiji ni.' },
        { vi: 'Hôm nay không nên tắm vòi sen.', chips: ['{今日|きょう}は', 'シャワーを', '{浴|あ}びない', 'ほうがいいです', '{浴|あ}びなかった', 'シャワーに'], answer: ['{今日|きょう}は', 'シャワーを', '{浴|あ}びない', 'ほうがいいです'], ro: 'Kyou wa shawaa o abinai hou ga ii desu.' },
        { vi: 'Viết tên xong rồi nộp thẻ bảo hiểm.', chips: ['{名前|なまえ}を', '{書|か}いてから、', '{保険証|ほけんしょう}を', '{出|だ}してください', '{書|か}く{前|まえ}に、', '{出|で}てください'], answer: ['{名前|なまえ}を', '{書|か}いてから、', '{保険証|ほけんしょう}を', '{出|だ}してください'], ro: 'Namae o kaite kara, hokenshou o dashite kudasai.' },
        { vi: 'Tôi uống thuốc trước khi đến bệnh viện.', chips: ['{病院|びょういん}へ', '{来|く}る', '{前|まえ}に', '{飲|の}みました', '{来|き}た', '{来|き}て'], answer: ['{病院|びょういん}へ', '{来|く}る', '{前|まえ}に', '{飲|の}みました'], ro: 'Byouin e kuru mae ni nomimashita.' },
        { vi: 'Cởi áo khoác rồi nằm xuống giường.', chips: ['{上着|うわぎ}を', '{脱|ぬ}いでから、', 'ベッドに', '{横|よこ}になってください', 'ベッドを', '{脱|ぬ}ぐから、'], answer: ['{上着|うわぎ}を', '{脱|ぬ}いでから、', 'ベッドに', '{横|よこ}になってください'], ro: 'Uwagi o nuide kara, beddo ni yoko ni natte kudasai.' },
        { vi: 'Thuốc này ngày 3 lần, uống sau khi ăn.', chips: ['この{薬|くすり}は', '{1日|いちにち}に', '{3回|さんかい}、', 'ご{飯|はん}を{食|た}べてから', '{飲|の}んでください', 'ご{飯|はん}を{食|た}べたから'], answer: ['この{薬|くすり}は', '{1日|いちにち}に', '{3回|さんかい}、', 'ご{飯|はん}を{食|た}べてから', '{飲|の}んでください'], ro: 'Kono kusuri wa ichinichi ni sankai, gohan o tabete kara nonde kudasai.' },
        { vi: 'Trước khi uống hãy đọc kỹ tờ hướng dẫn.', chips: ['{飲|の}む', '{前|まえ}に、', 'よく', '{説明書|せつめいしょ}を', '{読|よ}んでください', '{飲|の}んだ', '{保険証|ほけんしょう}を'], answer: ['{飲|の}む', '{前|まえ}に、', 'よく', '{説明書|せつめいしょ}を', '{読|よ}んでください'], ro: 'Nomu mae ni, yoku setsumeisho o yonde kudasai.' },
      ],
    },
  ],
};

export const BAI_12: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, KANJI, NGHE, NOI, BAI_TAP];

/* ═══════════════════ 📖 THEO SÁCH — Bài 12 (p.205–220) ═══════════════════
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
    'Luôn trả lời **đủ câu**, có です／ます ở cuối, câu hỏi có/không thì mở đầu bằng **はい／いいえ** (thi JPD113 trừ điểm nếu quên).',
    'Không nghe rõ câu cô hỏi: nói **もう{一度|いちど}お{願|ねが}いします** hoặc **ゆっくりお{願|ねが}いします** (ゆっくり — từ của bài này).',
    'Bài nghe やってみよう: ở đây KHÔNG ghi đáp án CD — chỉ ghi cần bắt từ nào. Nghe trên lớp rồi tự điền.',
    'Chỗ nào có tên ミン (Minh), ハノイ (Hà Nội), FPT{大学|だいがく}… là thông tin mẫu — thay bằng thông tin THẬT của bạn.',
    'Dòng dịch "VI" in trong sách ở p.206, 207, 210, 211, 214, 215 thực ra là **tiếng Hàn** (lỗi in / chung khuôn nhiều thứ tiếng) — dùng phần tả bằng tiếng Việt ở đây.',
    'Vài tranh gợi ý của 言ってみよう chỉ có hình, không có chữ; chỗ nào tranh khó đoán, câu mẫu ở đây ghi "(tranh: …)" và đưa cách nói hợp lý nhất — nếu cô dùng từ khác thì theo cô.',
  ],
};

export const SACH_12: Lesson = {
  id: 'b12-sach',
  kind: 'review',
  title: 'Theo sách — Bài 12 (trang 205–220)',
  goal: 'Nhìn tranh ốm đau, lớp học, bệnh viện, hiệu thuốc trong sách là nói được: bị làm sao (～んです), xin về sớm, kể lý do vắng, khuyên nên / không nên, làm thủ tục khám, kể bị từ bao giờ, đã uống thuốc lúc nào, và hiểu lời dặn uống thuốc.',
  minutes: 60,
  blocks: [
    CACH_DUNG,

    ...trang(
      'Trang 205 · 話してみよう・聞いてみよう — Mở bài 病気・けが',
      '**話してみよう** — 4 ảnh không lời: (1) một người đàn ông nằm trên giường, tay để gần trán; một phụ nữ cúi xuống lấy đồ từ túi, phía sau một người đàn ông bưng chậu nước — cảnh chăm người ốm ở nhà; (2) một phụ nữ ngồi bàn uống thuốc với cốc nước, bên cạnh là hộp thuốc gia đình mở nắp; (3) cận cảnh túi thuốc của hiệu thuốc: ghi tên bệnh nhân, "1 ngày 3 lần, cho 4 ngày", ô trước / sau bữa ăn, ba biểu tượng sáng – trưa – tối, tên bệnh viện; bên cạnh là nhiệt kế điện tử và một tấm thẻ (kiểu thẻ bảo hiểm); (4) bác sĩ dùng ống nghe khám ngực một bệnh nhân nam, y tá cầm bảng kẹp giấy đứng sau. Mục đích: nói về ốm đau, uống thuốc, đi khám. **聞いてみよう** (CD C18): nghe trước đoạn hội thoại dài của bài — chính là trang 220.',
      [
        C('（ảnh 1）この{人|ひと}はどうしたんですか。', '(shashin 1) Kono hito wa dou shita n desu ka.', '(ảnh 1) Người này bị làm sao?'),
        S('{病気|びょうき}なんです。{熱|ねつ}があるんです。', 'Byouki na n desu. Netsu ga aru n desu.', 'Anh ấy bị ốm. Bị sốt ạ.'),
        C('（ảnh 2）この{人|ひと}は{何|なに}をしていますか。', '(shashin 2) Kono hito wa nani o shite imasu ka.', '(ảnh 2) Người này đang làm gì?'),
        S('{薬|くすり}を{飲|の}んでいます。', 'Kusuri o nonde imasu.', 'Cô ấy đang uống thuốc.'),
        C('（ảnh 3）この{薬|くすり}は{1日|いちにち}に{何回|なんかい}{飲|の}みますか。', '(shashin 3) Kono kusuri wa ichinichi ni nankai nomimasu ka.', '(ảnh 3) Thuốc này ngày uống mấy lần?'),
        S('{1日|いちにち}に{3回|さんかい}{飲|の}みます。', 'Ichinichi ni sankai nomimasu.', 'Ngày uống 3 lần ạ.'),
        C('ミンさんは{最近|さいきん}、{病院|びょういん}へ{行|い}きましたか。', 'Min-san wa saikin, byouin e ikimashita ka.', 'Gần đây Minh có đi bệnh viện không?'),
        S('いいえ、{行|い}っていません。{元気|げんき}です。', 'Iie, itte imasen. Genki desu.', 'Không ạ. Em khoẻ ạ.'),
      ],
      [
        'Cô hỏi "**どうしたんですか**" về người trong ảnh → trả lời bằng **～んです** (ポイント 104). Danh từ thì **～なんです**: {病気|びょうき}なんです.',
        '"Mấy lần một ngày" → **{1日|いちにち}に～{回|かい}** (nhớ に).',
        'Xem **Hội thoại · Bức tranh chung của bài** và **Ngữ pháp · ポイント 104**.',
      ],
    ),

    ...trang(
      'Trang 206–207 · チャレンジ! {体|からだ}の{調子|ちょうし}',
      'Trang 206: **giờ nghỉ trong lớp**. Tranh lớn: một bạn nam ngồi ôm má / đầu; một bạn khác cúi xuống hỏi han (dấu "?"); bên phải một người mặc sơ mi thắt cà vạt cầm tập hồ sơ đứng nhìn (thầy/cô). Ô 1-1: hai bạn, bong bóng hình người sờ trán — bạn kia **thấy mệt**. Ô 1-2: chữ "早く" + mũi tên từ người đi bộ tới ngôi nhà, lại hình người sờ trán — **xin về sớm vì không khoẻ**. Trang 207: **hôm sau, ở quán làm thêm** — phòng nghỉ nhân viên có máy chấm công "IN・BREAK・OUT", một nam nhân viên đội mũ ngồi bàn giơ tay chào, một nữ đứng đối diện. Ô 1-3a: chữ "昨日" + "?" + hình sờ trán — **hôm qua làm sao thế?**; ô 1-3b: chữ "大丈夫" + "?", bong bóng người uống gì đó và người nằm ngủ "ZZZ" — **uống thuốc, ngủ, đã khoẻ**. **Mục tiêu できる:** khi thấy mệt, kể triệu chứng ngắn gọn để xin về sớm, hoặc nói lý do vắng mặt. ☞ ポイント 104.',
      [
        C('ミンさん、どうしたんですか。', 'Min-san, dou shita n desu ka.', 'Minh, em sao thế?'),
        S('{頭|あたま}が{痛|いた}いんです。', 'Atama ga itai n desu.', 'Em đau đầu ạ.'),
        C('{大丈夫|だいじょうぶ}ですか。', 'Daijoubu desu ka.', 'Em có sao không?'),
        S('あのう、{先生|せんせい}、{早|はや}く{帰|かえ}ってもいいですか。{熱|ねつ}もあるんです。', 'Anou, sensei, hayaku kaette mo ii desu ka. Netsu mo aru n desu.', 'Dạ thưa cô, em về sớm được không ạ? Em cũng bị sốt.'),
        C('それはいけませんね。いいですよ。お{大事|だいじ}に。', 'Sore wa ikemasen ne. Ii desu yo. Odaiji ni.', 'Thế thì không ổn rồi. Được, em về đi. Giữ gìn sức khoẻ nhé.'),
        C('（{次|つぎ}の{日|ひ}）ミンさん、{昨日|きのう}、どうしたんですか。', '(Tsugi no hi) Min-san, kinou, dou shita n desu ka.', '(Hôm sau) Minh, hôm qua em làm sao thế?'),
        S('{風邪|かぜ}をひいたんです。でも、{薬|くすり}を{飲|の}んで、よく{寝|ね}ました。', 'Kaze o hiita n desu. Demo, kusuri o nonde, yoku nemashita.', 'Em bị cảm ạ. Nhưng em uống thuốc rồi ngủ kỹ.'),
        C('もう{大丈夫|だいじょうぶ}ですか。', 'Mou daijoubu desu ka.', 'Giờ ổn rồi chứ?'),
        S('はい、おかげさまで、もう{治|なお}りました。', 'Hai, okagesama de, mou naorimashita.', 'Vâng, nhờ cô, em khỏi rồi ạ.'),
      ],
      [
        '**ポイント 104 ～んです**: giải thích tình trạng. Hôm nay: {痛|いた}**い**んです; hôm qua: ひい**た**んです (thể た + んです).',
        'Đáp lời hỏi thăm: **おかげさまで** + tình trạng hiện tại (もう{治|なお}りました／もう{元気|げんき}です).',
        'Xin về sớm = **{早|はや}く{帰|かえ}ってもいいですか** (ポイント 89, Bài 10) + lý do ～んです.',
        'Xem **Hội thoại · ① 体の調子** và **Ngữ pháp · ポイント 104**.',
      ],
    ),

    ...trang(
      'Trang 208 · 言ってみよう (chủ đề 1) — Số 1: どうしたんですか · Số 2: xin về sớm / xin nghỉ · Số 3: hôm qua làm sao thế?',
      '**Số 1:** "sao thế?" → "(tôi bị …)んです" → "có sao không?" — tranh: 例 người ôm má (đau răng); ① người ôm cổ họng; ② người ôm bụng, mặt khó chịu; ③ cô gái ôm đầu, có vạch đau; ④ người ngồi trước bàn ăn mà không ăn được; ⑤ người cầm cốc / bát uống, mặt mệt mỏi. **Số 2:** "thưa thầy, em … được không?" → "sao thế?" → "…んです" → "thế thì không ổn. Giữ gìn sức khoẻ": 例 về sớm / đau đầu; ① đi bệnh viện (rồi quay lại) / đau họng; ② nghỉ bài kiểm tra ngày mai / người không khoẻ. **Số 3:** "hôm qua sao thế? (không thấy đến …)" → "tôi bị …" → "có sao không?" → "nhờ trời khỏi rồi" → "tốt quá": 例 bạn bè cụng ly ở buổi nhậu, người vắng mặt bị cảm; ① nhiệt kế 39,0°; ② một người giơ nắm tay (khoẻ lại) cạnh người sờ má / đầu.',
      [
        C('ミンさん、どうしたんですか。', 'Min-san, dou shita n desu ka.', 'Minh, em sao thế?'),
        S('のどが{痛|いた}いんです。', 'Nodo ga itai n desu.', 'Em đau họng ạ.'),
        C('{大丈夫|だいじょうぶ}ですか。', 'Daijoubu desu ka.', 'Em có sao không?'),
        S('あのう、{先生|せんせい}、{明日|あした}のテストを{休|やす}んでもいいですか。', 'Anou, sensei, ashita no tesuto o yasunde mo ii desu ka.', 'Dạ thưa cô, bài kiểm tra ngày mai em nghỉ được không ạ?'),
        C('どうしたんですか。', 'Dou shita n desu ka.', 'Em làm sao?'),
        S('{体|からだ}の{調子|ちょうし}がよくないんです。', 'Karada no choushi ga yokunai n desu.', 'Em thấy trong người không khoẻ ạ.'),
        C('それはいけませんね。お{大事|だいじ}に。', 'Sore wa ikemasen ne. Odaiji ni.', 'Thế thì không ổn rồi. Giữ gìn sức khoẻ nhé.'),
      ],
      [
        'Số 1: **bộ phận + が{痛|いた}いんです**; không muốn ăn: **{食欲|しょくよく}がないんです** (ある → ない); buồn nôn: **{気持|きも}ちが{悪|わる}いんです**.',
        'Số 2: đổi thể ます → **thể て + もいいですか**: {行|い}ってきても, {休|やす}んでも. Lý do dùng ～んです: よくない**んです**.',
        'Số 3: chuyện hôm qua → **thể た + んです**: ひいた, あった. Đáp: **おかげさまで、もう{治|なお}りました** → người kia: **よかったですね**.',
        'Xem **Ngữ pháp · ポイント 104 — bảng thay thế** và **Luyện nói · Vai 1, Vai 2**.',
      ],
      [
        mau([
          E('どうしたんですか。— {歯|は}が{痛|いた}いんです。— {大丈夫|だいじょうぶ}ですか。', 'Dou shita n desu ka. — Ha ga itai n desu. — Daijoubu desu ka.', 'Số 1 例 — đau răng.'),
          E('どうしたんですか。— のどが{痛|いた}いんです。— {大丈夫|だいじょうぶ}ですか。', 'Dou shita n desu ka. — Nodo ga itai n desu. — Daijoubu desu ka.', 'Số 1 ① — đau họng.'),
          E('どうしたんですか。— おなかが{痛|いた}いんです。— {大丈夫|だいじょうぶ}ですか。', 'Dou shita n desu ka. — Onaka ga itai n desu. — Daijoubu desu ka.', 'Số 1 ② — đau bụng.'),
          E('どうしたんですか。— {頭|あたま}が{痛|いた}いんです。— {大丈夫|だいじょうぶ}ですか。', 'Dou shita n desu ka. — Atama ga itai n desu. — Daijoubu desu ka.', 'Số 1 ③ — đau đầu.'),
          E('どうしたんですか。— {食欲|しょくよく}がないんです。— {大丈夫|だいじょうぶ}ですか。', 'Dou shita n desu ka. — Shokuyoku ga nai n desu. — Daijoubu desu ka.', 'Số 1 ④ — không ăn được.'),
          E('どうしたんですか。— {気持|きも}ちが{悪|わる}いんです。— {大丈夫|だいじょうぶ}ですか。', 'Dou shita n desu ka. — Kimochi ga warui n desu. — Daijoubu desu ka.', 'Số 1 ⑤ — (tranh: uống xong mặt mệt) buồn nôn, khó chịu.'),
          E('あのう、{先生|せんせい}、{早|はや}く{帰|かえ}ってもいいですか。— どうしたんですか。— {頭|あたま}が{痛|いた}いんです。— それはいけませんね。お{大事|だいじ}に。', 'Anou, sensei, hayaku kaette mo ii desu ka. — Dou shita n desu ka. — Atama ga itai n desu. — Sore wa ikemasen ne. Odaiji ni.', 'Số 2 例.'),
          E('あのう、{先生|せんせい}、{病院|びょういん}へ{行|い}ってきてもいいですか。— どうしたんですか。— のどが{痛|いた}いんです。— それはいけませんね。お{大事|だいじ}に。', 'Anou, sensei, byouin e itte kite mo ii desu ka. — Dou shita n desu ka. — Nodo ga itai n desu. — Sore wa ikemasen ne. Odaiji ni.', 'Số 2 ① — đi bệnh viện rồi quay lại (行ってきます + てもいいですか).'),
          E('あのう、{先生|せんせい}、{明日|あした}のテストを{休|やす}んでもいいですか。— どうしたんですか。— {体|からだ}の{調子|ちょうし}がよくないんです。— それはいけませんね。お{大事|だいじ}に。', 'Anou, sensei, ashita no tesuto o yasunde mo ii desu ka. — Dou shita n desu ka. — Karada no choushi ga yokunai n desu. — Sore wa ikemasen ne. Odaiji ni.', 'Số 2 ②.'),
          E('Bさん、{昨日|きのう}、どうしたんですか。{飲|の}み{会|かい}に{来|き}ませんでしたね。— {風邪|かぜ}をひいたんです。— えっ？{大丈夫|だいじょうぶ}ですか。— はい。おかげさまで、もう{治|なお}りました。— そうですか。よかったですね。', 'B-san, kinou, dou shita n desu ka. Nomikai ni kimasen deshita ne. — Kaze o hiita n desu. — E? Daijoubu desu ka. — Hai. Okagesama de, mou naorimashita. — Sou desu ka. Yokatta desu ne.', 'Số 3 例.'),
          E('Bさん、{昨日|きのう}、どうしたんですか。{授業|じゅぎょう}に{来|き}ませんでしたね。— {熱|ねつ}が{39度|さんじゅうきゅうど}あったんです。— えっ？{大丈夫|だいじょうぶ}ですか。— はい。おかげさまで、もう{治|なお}りました。', 'B-san, kinou, dou shita n desu ka. Jugyou ni kimasen deshita ne. — Netsu ga sanjuukyuu do atta n desu. — E? Daijoubu desu ka. — Hai. Okagesama de, mou naorimashita.', 'Số 3 ① — nhiệt kế 39,0°.'),
          E('Bさん、{昨日|きのう}、どうしたんですか。— {頭|あたま}が{痛|いた}かったんです。— えっ？{大丈夫|だいじょうぶ}ですか。— はい。おかげさまで、もう{元気|げんき}になりました。— よかったですね。', 'B-san, kinou, dou shita n desu ka. — Atama ga itakatta n desu. — E? Daijoubu desu ka. — Hai. Okagesama de, mou genki ni narimashita. — Yokatta desu ne.', 'Số 3 ② — (tranh: người sờ đầu/má → giơ nắm tay khoẻ lại). イA quá khứ 痛かった + んです.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 209 · やってみよう (chủ đề 1) — Nghe điền bảng + nói theo tranh "hôm sau"',
      '**Nghe (CD C22):** bảng hai cột — **người không khoẻ** bị gì / **bạn** làm gì giúp. Dòng 例 đã điền sẵn (ワン sốt → マルコ cùng đi bệnh viện); dòng 1 (アンナ / ダニエル) và dòng 2 (カルロス / パク) để trống. **Nói theo tranh:** hàng 1 — một chị đeo kính ("?") hỏi một anh đang ôm bụng; bong bóng viên thuốc "?" và mũi tên về nhà (hỏi đã uống thuốc chưa, rồi về nhà). Hàng 2 "▶次の日": (a) chữ "昨日 早く" + mũi tên về nhà + nhiệt kế 39,0° — hỏi hôm qua sao về sớm; (b) mũi tên tới bệnh viện rồi viên thuốc — đã đi khám, uống thuốc; (c) người ngủ "ZZZ" cạnh người giơ nắm tay — ngủ nhiều, giờ khoẻ.',
      [
        C('どうしたんですか。', 'Dou shita n desu ka.', 'Em sao thế?'),
        S('おなかが{痛|いた}いんです。', 'Onaka ga itai n desu.', 'Em đau bụng ạ.'),
        C('{薬|くすり}を{飲|の}みましたか。', 'Kusuri o nomimashita ka.', 'Em uống thuốc chưa?'),
        S('いいえ、まだ{飲|の}んでいません。{早|はや}く{帰|かえ}って、{飲|の}みます。', 'Iie, mada nonde imasen. Hayaku kaette, nomimasu.', 'Chưa ạ. Em về sớm rồi uống.'),
        C('（{次|つぎ}の{日|ひ}）{昨日|きのう}、{早|はや}く{帰|かえ}りましたね。どうしたんですか。', '(Tsugi no hi) Kinou, hayaku kaerimashita ne. Dou shita n desu ka.', '(Hôm sau) Hôm qua em về sớm nhỉ. Làm sao thế?'),
        S('{熱|ねつ}が{39度|さんじゅうきゅうど}あったんです。{病院|びょういん}へ{行|い}って、{薬|くすり}をもらいました。', 'Netsu ga sanjuukyuu do atta n desu. Byouin e itte, kusuri o moraimashita.', 'Em sốt 39 độ ạ. Em đi bệnh viện rồi lấy thuốc.'),
        C('{今日|きょう}は{大丈夫|だいじょうぶ}ですか。', 'Kyou wa daijoubu desu ka.', 'Hôm nay ổn chưa?'),
        S('はい、たくさん{寝|ね}ましたから、もう{元気|げんき}です。', 'Hai, takusan nemashita kara, mou genki desu.', 'Vâng, em ngủ nhiều nên giờ khoẻ rồi ạ.'),
      ],
      [
        'Nghe bảng: bắt **bộ phận + 痛い / 熱 / けが** (cột trái) và **động từ của người bạn**: {薬|くすり}を{買|か}ってきます, {先生|せんせい}に{言|い}います, {一緒|いっしょ}に{病院|びょういん}へ{行|い}きます… Không có đáp án CD ở đây — luyện kiểu bài này: **Luyện nghe · Bài 1**.',
        'Tranh "hôm sau": kể theo thứ tự tranh bằng **Vて、Vて** (Bài 7): {病院|びょういん}へ{行|い}って、{薬|くすり}をもらいました.',
        '"Đã uống thuốc chưa" → chưa: **まだ{飲|の}んでいません** (Bài 10).',
      ],
    ),

    ...trang(
      'Trang 210–211 · チャレンジ! アドバイス',
      'Trang 210: **trong lớp, một bạn trông uể oải**. Tranh lớn: cô gái buộc tóc đuôi ngựa quay sang nhìn một bạn nam chống cằm nhắm mắt; phía sau hai bạn đứng nói chuyện, chỉ vào vở. Ô 1-1a: "?" + bong bóng "早く" + mũi tên về nhà + viên thuốc — **hôm qua về sớm, uống thuốc**; ô 1-1b: chữ "今晩" + nhóm ba người → nhóm cụng ly, bong bóng "風邪" hình người uống — **tối nay có buổi nhậu, nhưng đang cảm**. Trang 211: lớp học — cô giáo đeo kính đứng cạnh bảng tin; bạn nam ôm đầu mệt mỏi; bạn nữ quay sang lo lắng. Ô 1-2a: "?" + "最近" + hình người có vạch mệt quanh đầu — **dạo này người không khoẻ**; ô 1-2b: "体にいいこと？" + "毎朝" — bong bóng người nấu ăn và người ăn — **mỗi sáng mình làm việc tốt cho sức khoẻ, cậu có làm không?**; ô 1-2c: bàn tay bắt chéo (không làm) ↔ giơ ngón cái / cầm quả táo (nên làm) — **bạn lắc đầu, bạn kia khuyên**. **Mục tiêu できる:** khuyên được bạn đang không khoẻ. ☞ ポイント 105.',
      [
        C('ミンさん、{元気|げんき}がないですね。どうしたんですか。', 'Min-san, genki ga nai desu ne. Dou shita n desu ka.', 'Minh, trông em mệt thế. Sao vậy?'),
        S('{風邪|かぜ}なんです。{昨日|きのう}、{早|はや}く{帰|かえ}って、{薬|くすり}を{飲|の}みました。', 'Kaze na n desu. Kinou, hayaku kaette, kusuri o nomimashita.', 'Em bị cảm ạ. Hôm qua em về sớm rồi uống thuốc.'),
        C('{今晩|こんばん}、クラスの{飲|の}み{会|かい}がありますね。', 'Konban, kurasu no nomikai ga arimasu ne.', 'Tối nay lớp có buổi nhậu nhỉ.'),
        S('はい。でも、{行|い}かないほうがいいですね。', 'Hai. Demo, ikanai hou ga ii desu ne.', 'Vâng. Nhưng em không nên đi nhỉ.'),
        C('ええ、うちでゆっくり{休|やす}んだほうがいいですよ。', 'Ee, uchi de yukkuri yasunda hou ga ii desu yo.', 'Ừ, em nên ở nhà nghỉ ngơi đi.'),
        C('ミンさんは{何|なに}か{体|からだ}にいいことをしていますか。', 'Min-san wa nanika karada ni ii koto o shite imasu ka.', 'Minh có làm việc gì tốt cho sức khoẻ không?'),
        S('いいえ、{何|なに}もしていません。', 'Iie, nani mo shite imasen.', 'Không ạ, em chẳng làm gì cả.'),
        C('じゃ、{毎朝|まいあさ}、{少|すこ}し{運動|うんどう}をしたほうがいいですよ。', 'Ja, maiasa, sukoshi undou o shita hou ga ii desu yo.', 'Vậy mỗi sáng em nên vận động một chút.'),
        S('はい、わかりました。', 'Hai, wakarimashita.', 'Vâng, em hiểu rồi ạ.'),
      ],
      [
        '**ポイント 105**: nên = **Vた**ほうがいいです ({休|やす}んだ, した); không nên = **Vない**ほうがいいです ({行|い}かない).',
        'Kèm lý do bằng **～から** và cuối câu **よ**: {体|からだ}にいいですから、～たほうがいいですよ.',
        'Xem **Hội thoại · ② アドバイス** và **Ngữ pháp · ポイント 105**.',
      ],
    ),

    ...trang(
      'Trang 212 · 言ってみよう (chủ đề 2) — Số 1: khuyên theo triệu chứng · Số 2: việc tốt cho sức khoẻ',
      '**Số 1:** "sao thế?" → "từ … bị …" → "có sao không? Hôm nay nên / không nên …" → "vâng". Mỗi cặp tranh: bên trái triệu chứng + từ khi nào, bên phải lời khuyên: 例 từ hôm qua, cô gái ôm bụng → đừng ăn đồ lạnh nhiều; ① từ sáng, anh ôm má (đau răng) → đi nha sĩ; ② sáng nay, cô gái nhìn bàn tay / cánh tay → bôi thuốc; ③ từ hôm kia, cô gái ôm cổ họng → cố đừng nói; ④ từ tối qua, cô gái ôm đầu → ở nhà nghỉ ngơi. **Số 2:** hội thoại mẫu dài: "dạo này người không khoẻ" → "mình ngày nào cũng vận động. Cậu có không?" → "mình chẳng làm gì" → "tốt cho sức khoẻ, cố vận động đi" → "ừ" (gợi ý thay thế ở đầu trang 213).',
      [
        C('どうしたんですか。', 'Dou shita n desu ka.', 'Em sao thế?'),
        S('{朝|あさ}から{歯|は}が{痛|いた}いんです。', 'Asa kara ha ga itai n desu.', 'Em đau răng từ sáng ạ.'),
        C('{大丈夫|だいじょうぶ}ですか。{歯医者|はいしゃ}へ{行|い}ったほうがいいですよ。', 'Daijoubu desu ka. Haisha e itta hou ga ii desu yo.', 'Em có sao không? Em nên đi nha sĩ đi.'),
        S('はい。', 'Hai.', 'Vâng.'),
        C('ミンさん、どうしたんですか。', 'Min-san, dou shita n desu ka.', 'Minh, sao thế?'),
        S('{最近|さいきん}、あまり{体|からだ}の{調子|ちょうし}がよくないんです。', 'Saikin, amari karada no choushi ga yokunai n desu.', 'Dạo này người em không được khoẻ lắm.'),
        C('そうですねえ。{私|わたし}は{毎日|まいにち}{運動|うんどう}をしています。ミンさんは{毎日|まいにち}{運動|うんどう}をしていますか。', 'Sou desu nee. Watashi wa mainichi undou o shite imasu. Min-san wa mainichi undou o shite imasu ka.', 'Để xem nào. Cô thì ngày nào cũng vận động. Minh có vận động mỗi ngày không?'),
        S('{私|わたし}は{全然|ぜんぜん}していません。', 'Watashi wa zenzen shite imasen.', 'Em hoàn toàn không ạ.'),
        C('{体|からだ}にいいですから、できるだけ{運動|うんどう}をしたほうがいいですよ。', 'Karada ni ii desu kara, dekirudake undou o shita hou ga ii desu yo.', 'Vì tốt cho sức khoẻ nên em cố vận động càng nhiều càng tốt nhé.'),
        S('はい、わかりました。', 'Hai, wakarimashita.', 'Vâng, em hiểu rồi ạ.'),
      ],
      [
        'Số 1: triệu chứng + **từ khi nào**: {昨日|きのう}から／{朝|あさ}から／{今朝|けさ}／おとといから／{昨日|きのう}の{夜|よる}から. Tranh ② (nhìn bàn tay) là **bị bỏng** → **やけどをしたんです** → {薬|くすり}を{塗|ぬ}ったほうがいい.',
        'Lời khuyên phủ định có **あまり** / **できるだけ**: あまり{冷|つめ}たいものを{食|た}べない, できるだけ{声|こえ}を{出|だ}さない.',
        'Số 2: câu hỏi **～ていますか** → đáp **{全然|ぜんぜん}～ていません** (Bài 9 全然 + phủ định).',
        'Xem **Ngữ pháp · ポイント 105 — bảng thay thế**.',
      ],
      [
        mau([
          E('どうしたんですか。— {昨日|きのう}からおなかが{痛|いた}いんです。— {大丈夫|だいじょうぶ}ですか。{今日|きょう}はあまり{冷|つめ}たいものを{食|た}べないほうがいいですよ。— はい。', 'Dou shita n desu ka. — Kinou kara onaka ga itai n desu. — Daijoubu desu ka. Kyou wa amari tsumetai mono o tabenai hou ga ii desu yo. — Hai.', 'Số 1 例.'),
          E('どうしたんですか。— {朝|あさ}から{歯|は}が{痛|いた}いんです。— {大丈夫|だいじょうぶ}ですか。{歯医者|はいしゃ}へ{行|い}ったほうがいいですよ。— はい。', 'Dou shita n desu ka. — Asa kara ha ga itai n desu. — Daijoubu desu ka. Haisha e itta hou ga ii desu yo. — Hai.', 'Số 1 ①.'),
          E('どうしたんですか。— {今朝|けさ}、やけどをしたんです。— {大丈夫|だいじょうぶ}ですか。{薬|くすり}を{塗|ぬ}ったほうがいいですよ。— はい。', 'Dou shita n desu ka. — Kesa, yakedo o shita n desu. — Daijoubu desu ka. Kusuri o nutta hou ga ii desu yo. — Hai.', 'Số 1 ② — (tranh: nhìn bàn tay) bị bỏng.'),
          E('どうしたんですか。— おとといからのどが{痛|いた}いんです。— {大丈夫|だいじょうぶ}ですか。できるだけ{声|こえ}を{出|だ}さないほうがいいですよ。— はい。', 'Dou shita n desu ka. — Ototoi kara nodo ga itai n desu. — Daijoubu desu ka. Dekirudake koe o dasanai hou ga ii desu yo. — Hai.', 'Số 1 ③.'),
          E('どうしたんですか。— {昨日|きのう}の{夜|よる}から{頭|あたま}が{痛|いた}いんです。— {大丈夫|だいじょうぶ}ですか。うちでゆっくり{休|やす}んだほうがいいですよ。— はい。', 'Dou shita n desu ka. — Kinou no yoru kara atama ga itai n desu. — Daijoubu desu ka. Uchi de yukkuri yasunda hou ga ii desu yo. — Hai.', 'Số 1 ④.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 213 · 言ってみよう số 2 (gợi ý) + やってみよう (chủ đề 2) — Lời khuyên & 健康チェック',
      '**Gợi ý thay thế cho số 2** (đầu trang): 例 người duỗi chân, tập tạ, chạy bộ — vận động; ① cô gái cầm dĩa, quả bí và rau đã cắt — ăn rau; ② "8時間以上" + người nằm ngủ — ngủ từ 8 tiếng trở lên; ③ người uống nước cạnh hàng chai nước — uống nhiều nước. **Nghe (CD C25):** "bạn khuyên gì?" — hai chỗ trống (lời khuyên của ワン, của パク), chọn trong 4 lựa chọn ⓐ đi bệnh viện ⓑ ngủ nhiều ⓒ không hút thuốc ⓓ vận động. **健康チェック:** bảng 8 câu hỏi có/không để hỏi bạn cùng lớp, rồi **khuyên người có từ 3 câu "không" trở lên**.',
      [
        C('ミンさんは{毎日|まいにち}{運動|うんどう}をしていますか。', 'Min-san wa mainichi undou o shite imasu ka.', 'Minh có vận động mỗi ngày không?'),
        S('いいえ、していません。', 'Iie, shite imasen.', 'Không ạ.'),
        C('{1日|いちにち}に{30分|さんじゅっぷん}{以上|いじょう}{歩|ある}いていますか。', 'Ichinichi ni sanjuppun ijou aruite imasu ka.', 'Một ngày em có đi bộ từ 30 phút trở lên không?'),
        S('はい、{歩|ある}いています。{駅|えき}から{学校|がっこう}まで{歩|ある}きます。', 'Hai, aruite imasu. Eki kara gakkou made arukimasu.', 'Có ạ. Em đi bộ từ ga đến trường.'),
        C('{食欲|しょくよく}がありますか。', 'Shokuyoku ga arimasu ka.', 'Em ăn có ngon miệng không?'),
        S('はい、あります。', 'Hai, arimasu.', 'Có ạ.'),
        C('{8時間|はちじかん}{以上|いじょう}{寝|ね}ていますか。', 'Hachijikan ijou nete imasu ka.', 'Em có ngủ từ 8 tiếng trở lên không?'),
        S('いいえ、{寝|ね}ていません。{6時間|ろくじかん}ぐらいです。', 'Iie, nete imasen. Rokujikan gurai desu.', 'Không ạ. Khoảng 6 tiếng thôi.'),
        C('じゃ、もう{少|すこ}し{寝|ね}たほうがいいですね。{果物|くだもの}も{食|た}べたほうがいいですよ。', 'Ja, mou sukoshi neta hou ga ii desu ne. Kudamono mo tabeta hou ga ii desu yo.', 'Vậy em nên ngủ thêm một chút. Cũng nên ăn hoa quả nữa.'),
      ],
      [
        'Bảng 健康チェック toàn câu **～ていますか** (thói quen) → đáp **はい、～ています／いいえ、～ていません**.',
        'Người có từ 3 câu "không" → khuyên theo đúng câu "không" đó: ～**た**ほうがいいですよ.',
        'Nghe C25: bắt đuôi **～たほうがいい／～ないほうがいい** và động từ đi trước. Không có đáp án CD ở đây — luyện: **Luyện nghe · Bài 2**.',
      ],
      [
        mau([
          E('Bさんは{毎日|まいにち}{運動|うんどう}をしていますか。— {全然|ぜんぜん}していません。— {体|からだ}にいいですから、できるだけ{運動|うんどう}をしたほうがいいですよ。', 'B-san wa mainichi undou o shite imasu ka. — Zenzen shite imasen. — Karada ni ii desu kara, dekirudake undou o shita hou ga ii desu yo.', 'Số 2 例 — vận động.'),
          E('{私|わたし}は{毎日|まいにち}{野菜|やさい}を{食|た}べています。Bさんは{野菜|やさい}を{食|た}べていますか。— {全然|ぜんぜん}{食|た}べていません。— {体|からだ}にいいですから、できるだけ{食|た}べたほうがいいですよ。', 'Watashi wa mainichi yasai o tabete imasu. B-san wa yasai o tabete imasu ka. — Zenzen tabete imasen. — Karada ni ii desu kara, dekirudake tabeta hou ga ii desu yo.', 'Số 2 ① — ăn rau.'),
          E('{私|わたし}は{毎日|まいにち}{8時間|はちじかん}{以上|いじょう}{寝|ね}ています。Bさんは？— {私|わたし}は{5時間|ごじかん}ぐらいです。— {体|からだ}にいいですから、できるだけ{8時間|はちじかん}{以上|いじょう}{寝|ね}たほうがいいですよ。', 'Watashi wa mainichi hachijikan ijou nete imasu. B-san wa? — Watashi wa gojikan gurai desu. — Karada ni ii desu kara, dekirudake hachijikan ijou neta hou ga ii desu yo.', 'Số 2 ② — ngủ 8 tiếng trở lên.'),
          E('{私|わたし}は{毎日|まいにち}{水|みず}をたくさん{飲|の}んでいます。Bさんは？— {私|わたし}はあまり{飲|の}んでいません。— {体|からだ}にいいですから、できるだけたくさん{飲|の}んだほうがいいですよ。', 'Watashi wa mainichi mizu o takusan nonde imasu. B-san wa? — Watashi wa amari nonde imasen. — Karada ni ii desu kara, dekirudake takusan nonda hou ga ii desu yo.', 'Số 2 ③ — uống nhiều nước.'),
          E('{1日|いちにち}に{3回|さんかい}、{食事|しょくじ}をしていますか。— いいえ、{朝|あさ}ご{飯|はん}を{食|た}べていません。— {朝|あさ}ご{飯|はん}を{食|た}べたほうがいいですよ。', 'Ichinichi ni sankai, shokuji o shite imasu ka. — Iie, asagohan o tabete imasen. — Asagohan o tabeta hou ga ii desu yo.', '健康チェック câu 4 — một mẫu hỏi và khuyên.'),
          E('{自分|じぶん}で{料理|りょうり}を{作|つく}っていますか。— いいえ、{作|つく}っていません。— {自分|じぶん}で{作|つく}ったほうがいいですよ。', 'Jibun de ryouri o tsukutte imasu ka. — Iie, tsukutte imasen. — Jibun de tsukutta hou ga ii desu yo.', '健康チェック câu 5.'),
          E('{楽|たの}しいことをしていますか。— はい、{週末|しゅうまつ}、{友達|ともだち}とカラオケに{行|い}っています。', 'Tanoshii koto o shite imasu ka. — Hai, shuumatsu, tomodachi to karaoke ni itte imasu.', '健康チェック câu 8.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 214–215 · チャレンジ! {病院|びょういん}で',
      'Trang 214: **quầy tiếp tân bệnh viện** — nhân viên sau quầy cong đưa một tờ phiếu / thẻ cho bệnh nhân nam; phía sau là ghế chờ có người ngồi, hành lang có cửa và biển. Bên phải: cận cảnh anh ấy ngồi, tay đưa lên gần mặt như đang nghĩ, nhìn về phía bác sĩ (không thấy trong tranh). Ô 1-1: phiếu "名前 / 住所" đang được viết → bàn tay đưa thẻ "保険証" → người ngồi chờ — **viết phiếu, nộp thẻ bảo hiểm, chờ**. Ô 1-2: "?" + "昨日" với mặt trăng, người sờ đầu → mũi tên về nhà → người sờ đầu — **kể từ tối qua, về nhà xong thì bị**. Trang 215: bác sĩ ngồi bàn máy tính, đeo ống nghe, cười nói; y tá cầm bảng kẹp và lọ thuốc nhỏ. Bên phải: quầy **hiệu thuốc** "調剤室" — dược sĩ nữ áo blouse đưa túi thuốc cho khách nam. Ô 2-1: lọ thuốc, viên thuốc "?" → người uống thuốc với nước + đồng hồ — **đã uống thuốc lúc nào**; ô 2-2: "1日に3回" + ba lần người uống thuốc — **cách uống**. **Mục tiêu できる:** ở bệnh viện kể được triệu chứng ngắn gọn và nghe hiểu chỉ dẫn của bác sĩ. ☞ ポイント 106, 107.',
      [
        C('（{受付|うけつけ}）{保険証|ほけんしょう}を{出|だ}してください。', '(Uketsuke) Hokenshou o dashite kudasai.', '(Tiếp tân) Em nộp thẻ bảo hiểm nhé.'),
        S('はい。お{願|ねが}いします。', 'Hai. Onegai shimasu.', 'Vâng. Nhờ chị ạ.'),
        C('この{紙|かみ}に{名前|なまえ}と{住所|じゅうしょ}を{書|か}いてから、{待合室|まちあいしつ}で{待|ま}ってください。', 'Kono kami ni namae to juusho o kaite kara, machiaishitsu de matte kudasai.', 'Viết tên và địa chỉ vào tờ này rồi chờ ở phòng chờ nhé.'),
        C('（{医者|いしゃ}）どうしましたか。', '(Isha) Dou shimashita ka.', '(Bác sĩ) Em bị làm sao?'),
        S('{頭|あたま}が{痛|いた}いんです。{昨日|きのう}の{夜|よる}、うちへ{帰|かえ}ってから、{痛|いた}くなりました。', 'Atama ga itai n desu. Kinou no yoru, uchi e kaette kara, itaku narimashita.', 'Em đau đầu ạ. Tối qua về nhà xong thì bắt đầu đau.'),
        C('{何|なに}か{薬|くすり}を{飲|の}みましたか。', 'Nanika kusuri o nomimashita ka.', 'Em đã uống thuốc gì chưa?'),
        S('はい、{寝|ね}る{前|まえ}に{飲|の}みました。', 'Hai, neru mae ni nomimashita.', 'Rồi ạ, em uống trước khi ngủ.'),
        C('（{薬剤師|やくざいし}）この{薬|くすり}は{1日|いちにち}に{3回|さんかい}、ご{飯|はん}を{食|た}べてから{飲|の}んでください。', '(Yakuzaishi) Kono kusuri wa ichinichi ni sankai, gohan o tabete kara nonde kudasai.', '(Dược sĩ) Thuốc này ngày 3 lần, uống sau khi ăn.'),
        S('{1日|いちにち}に{3回|さんかい}、ご{飯|はん}を{食|た}べてからですね。わかりました。', 'Ichinichi ni sankai, gohan o tabete kara desu ne. Wakarimashita.', 'Ngày 3 lần, sau khi ăn nhỉ. Em hiểu rồi ạ.'),
      ],
      [
        '**ポイント 107 ～てから**: thủ tục ({書|か}いてから、{待|ま}って) và "từ lúc nào bị" ({帰|かえ}ってから、{痛|いた}くなりました).',
        '**ポイント 106 ～前に**: "đã uống thuốc lúc nào" → **{寝|ね}る{前|まえ}に／{1時間|いちじかん}{前|まえ}に{飲|の}みました**.',
        'Nghe dặn xong **nhắc lại để xác nhận**: ～ですね。わかりました — cô chấm câu này.',
        'Xem **Hội thoại · ③ 病院で** và **Ngữ pháp · ポイント 106, 107**.',
      ],
    ),

    ...trang(
      'Trang 216 · 言ってみよう (chủ đề 3) — Số 1-1: ～てから (thủ tục) · 1-2: bị từ bao giờ · 2-1: uống thuốc lúc nào',
      '**1-1:** nhân viên bệnh viện dặn "làm A xong rồi B" → "vâng". Tranh: 例 cởi giày → giày để lên giá; ① bong bóng "保険証" → người ngồi ghế chờ cầm giấy; ② phiếu "名前" có dòng kẻ → thẻ "保険証" ở quầy "受付"; ③ người nằm trên giường khám → viên thuốc; ④ người đang ăn → người uống (thuốc). **1-2:** bác sĩ: "bị làm sao?" → "đau … lắm" → "từ bao giờ?" → "(lúc) … xong thì bị đau". 例 hôm qua, ăn tối → ôm bụng; ① tối hôm kia, xách túi về nhà → sờ cổ họng / đầu; ② hôm qua, chạy → ôm ngực / bụng khó chịu; ③ hôm qua, cô gái tay che miệng mặt ngạc nhiên → sờ má nhăn nhó. **2-1:** bác sĩ: "đã uống thuốc gì chưa?" → "rồi, uống trước khi …": 例 ăn trưa; ① đến bệnh viện; ② hôm qua, ngủ; ③ bữa sáng; ④ 1 tiếng.',
      [
        C('{靴|くつ}を{脱|ぬ}いでから、{入|はい}ってください。', 'Kutsu o nuide kara, haitte kudasai.', 'Cởi giày rồi mới vào nhé.'),
        S('はい。', 'Hai.', 'Vâng.'),
        C('どうしましたか。', 'Dou shimashita ka.', 'Em bị làm sao?'),
        S('おなかがとても{痛|いた}いんです。', 'Onaka ga totemo itai n desu.', 'Em đau bụng lắm ạ.'),
        C('いつからですか。', 'Itsu kara desu ka.', 'Từ bao giờ?'),
        S('{昨日|きのう}、{晩|ばん}ご{飯|はん}を{食|た}べてから、{痛|いた}くなりました。', 'Kinou, bangohan o tabete kara, itaku narimashita.', 'Hôm qua ăn tối xong thì bị đau ạ.'),
        C('{何|なに}か{薬|くすり}を{飲|の}みましたか。', 'Nanika kusuri o nomimashita ka.', 'Em đã uống thuốc gì chưa?'),
        S('はい、{病院|びょういん}へ{来|く}る{前|まえ}に{飲|の}みました。', 'Hai, byouin e kuru mae ni nomimashita.', 'Rồi ạ, em uống trước khi đến bệnh viện.'),
      ],
      [
        '1-1: đổi động từ đầu sang **thể て + から**: {脱|ぬ}ぎます → {脱|ぬ}いで, {出|だ}します → {出|だ}して, {書|か}きます → {書|か}いて.',
        '1-2: **thời điểm, Vてから、(bộ phận が) イA‑く なりました** — ghép ポイント 107 với ～くなります (Bài 10).',
        '2-1: trước 前に luôn là **thể từ điển** ({来|く}る, {寝|ね}る) hoặc **Nの** ({朝|あさ}ご{飯|はん}の) hoặc **khoảng thời gian** ({1時間|いちじかん}, không の).',
        'Xem **Ngữ pháp · ポイント 106, 107 — bảng thay thế**.',
      ],
      [
        mau([
          E('{靴|くつ}を{脱|ぬ}いでから、{入|はい}ってください。— はい。', 'Kutsu o nuide kara, haitte kudasai. — Hai.', '1-1 例.'),
          E('{保険証|ほけんしょう}を{出|だ}してから、{待合室|まちあいしつ}で{待|ま}ってください。— はい。', 'Hokenshou o dashite kara, machiaishitsu de matte kudasai. — Hai.', '1-1 ① — nộp thẻ bảo hiểm → ngồi chờ.'),
          E('この{紙|かみ}に{名前|なまえ}を{書|か}いてから、{受付|うけつけ}に{保険証|ほけんしょう}を{出|だ}してください。— はい。', 'Kono kami ni namae o kaite kara, uketsuke ni hokenshou o dashite kudasai. — Hai.', '1-1 ② — viết tên → nộp thẻ ở quầy.'),
          E('ベッドで{少|すこ}し{横|よこ}になってから、この{薬|くすり}を{飲|の}んでください。— はい。', 'Beddo de sukoshi yoko ni natte kara, kono kusuri o nonde kudasai. — Hai.', '1-1 ③ — (tranh: nằm giường khám → thuốc) nằm nghỉ một lát rồi uống thuốc.'),
          E('ご{飯|はん}を{食|た}べてから、この{薬|くすり}を{飲|の}んでください。— はい。', 'Gohan o tabete kara, kono kusuri o nonde kudasai. — Hai.', '1-1 ④ — ăn xong rồi uống thuốc.'),
          E('どうしましたか。— おなかがとても{痛|いた}いんです。— いつからですか。— {昨日|きのう}、{晩|ばん}ご{飯|はん}を{食|た}べてから、{痛|いた}くなりました。', 'Dou shimashita ka. — Onaka ga totemo itai n desu. — Itsu kara desu ka. — Kinou, bangohan o tabete kara, itaku narimashita.', '1-2 例.'),
          E('どうしましたか。— のどがとても{痛|いた}いんです。— いつからですか。— おとといの{夜|よる}、うちへ{帰|かえ}ってから、{痛|いた}くなりました。', 'Dou shimashita ka. — Nodo ga totemo itai n desu. — Itsu kara desu ka. — Ototoi no yoru, uchi e kaette kara, itaku narimashita.', '1-2 ① — (tranh sờ cổ / đầu) có thể nói {頭|あたま}が cũng được.'),
          E('どうしましたか。— おなかがとても{痛|いた}いんです。— いつからですか。— {昨日|きのう}、{走|はし}ってから、{痛|いた}くなりました。', 'Dou shimashita ka. — Onaka ga totemo itai n desu. — Itsu kara desu ka. — Kinou, hashitte kara, itaku narimashita.', '1-2 ② — chạy xong thì đau. (Tranh ôm ngực/bụng; "ngực" chưa học → nói おなか hoặc {気持|きも}ちが{悪|わる}くなりました.)'),
          E('どうしましたか。— {歯|は}がとても{痛|いた}いんです。— いつからですか。— {昨日|きのう}、{冷|つめ}たいものを{食|た}べてから、{痛|いた}くなりました。', 'Dou shimashita ka. — Ha ga totemo itai n desu. — Itsu kara desu ka. — Kinou, tsumetai mono o tabete kara, itaku narimashita.', '1-2 ③ — (tranh: che miệng → ôm má) đau răng sau khi ăn đồ lạnh / cứng.'),
          E('{何|なに}か{薬|くすり}を{飲|の}みましたか。— はい、{昼|ひる}ご{飯|はん}を{食|た}べる{前|まえ}に{飲|の}みました。', 'Nanika kusuri o nomimashita ka. — Hai, hirugohan o taberu mae ni nomimashita.', '2-1 例.'),
          E('はい、{病院|びょういん}へ{来|く}る{前|まえ}に{飲|の}みました。', 'Hai, byouin e kuru mae ni nomimashita.', '2-1 ① — 来ます → **来る**.'),
          E('はい、{昨日|きのう}、{寝|ね}る{前|まえ}に{飲|の}みました。', 'Hai, kinou, neru mae ni nomimashita.', '2-1 ②.'),
          E('はい、{朝|あさ}ご{飯|はん}の{前|まえ}に{飲|の}みました。', 'Hai, asagohan no mae ni nomimashita.', '2-1 ③ — N の前に.'),
          E('はい、{1時間|いちじかん}{前|まえ}に{飲|の}みました。', 'Hai, ichijikan mae ni nomimashita.', '2-1 ④ — thời gian + 前に (không の).'),
        ]),
      ],
    ),

    ...trang(
      'Trang 217 · 言ってみよう số 2-2 + やってみよう (chủ đề 3) — Lời dặn của dược sĩ',
      '**2-2:** dược sĩ dặn "trước khi …, hãy …" → "vâng, tôi hiểu rồi": 例 uống thuốc này・đọc kỹ tờ hướng dẫn; ① ăn cơm・uống thuốc này; ② ngủ・bôi thuốc này; ③ bữa ăn・30 phút・uống thuốc này. Tranh gợi ý: tờ ghi "1日3回" + viên thuốc "?", hai người nói chuyện. **Nghe (CD C30):** hai bệnh nhân ở bệnh viện — người 1 (nam ôm bụng), người 2 (nữ đeo kính sờ trán): (1) bị từ bao giờ? đã uống thuốc chưa? (2) nghe lại: uống thuốc lúc nào? **Nói theo tranh:** chuỗi 6 ô một buổi khám: bác sĩ hỏi bệnh nhân ôm bụng → hỏi từ mấy giờ → thuốc + đồng hồ + "今" (đã uống thuốc lúc nào) → bác sĩ chỉ giường khám, bệnh nhân nằm → bác sĩ đưa thuốc / giấy → "1日に3回" uống sau khi ăn.',
      [
        C('この{薬|くすり}を{飲|の}む{前|まえ}に、よく{説明書|せつめいしょ}を{読|よ}んでください。', 'Kono kusuri o nomu mae ni, yoku setsumeisho o yonde kudasai.', 'Trước khi uống thuốc này, đọc kỹ tờ hướng dẫn nhé.'),
        S('はい、わかりました。', 'Hai, wakarimashita.', 'Vâng, em hiểu rồi ạ.'),
        C('（ペア・{医者|いしゃ}）どうしましたか。', '(Pea, isha) Dou shimashita ka.', '(Cặp — bác sĩ) Em bị làm sao?'),
        S('おなかが{痛|いた}いんです。', 'Onaka ga itai n desu.', 'Em đau bụng ạ.'),
        C('{何時|なんじ}ごろからですか。', 'Nanji goro kara desu ka.', 'Từ khoảng mấy giờ?'),
        S('{11時|じゅういちじ}ごろからです。', 'Juuichiji goro kara desu.', 'Từ khoảng 11 giờ ạ.'),
        C('{何|なに}か{薬|くすり}を{飲|の}みましたか。', 'Nanika kusuri o nomimashita ka.', 'Đã uống thuốc gì chưa?'),
        S('はい、{30分|さんじゅっぷん}{前|まえ}に{飲|の}みました。', 'Hai, sanjuppun mae ni nomimashita.', 'Rồi ạ, em uống cách đây 30 phút.'),
        C('じゃ、ここに{横|よこ}になってください。……{薬|くすり}を{出|だ}します。{1日|いちにち}に{3回|さんかい}、ご{飯|はん}を{食|た}べてから{飲|の}んでください。', 'Ja, koko ni yoko ni natte kudasai. …… Kusuri o dashimasu. Ichinichi ni sankai, gohan o tabete kara nonde kudasai.', 'Vậy em nằm xuống đây. … Tôi kê thuốc. Ngày 3 lần, uống sau khi ăn.'),
        S('はい、わかりました。ありがとうございました。', 'Hai, wakarimashita. Arigatou gozaimashita.', 'Vâng, em hiểu rồi. Cảm ơn bác sĩ ạ.'),
      ],
      [
        '2-2: động từ trước 前に đổi sang **thể từ điển**: {飲|の}みます → {飲|の}む, {食|た}べます → {食|た}べる, {寝|ね}ます → {寝|ね}る. Danh từ + thời gian: **{食事|しょくじ}の{30分|さんじゅっぷん}{前|まえ}に**.',
        'Nghe C30: ghi nháp **いつから** + **薬: có/chưa** + **lúc uống (前に／てから)**. Không có đáp án CD ở đây — luyện: **Luyện nghe · Bài 3, Bài 5**.',
        'Chuỗi 6 ô: xem **Luyện nói · Vai 3** (kịch bản bác sĩ – bệnh nhân đầy đủ).',
      ],
      [
        mau([
          E('この{薬|くすり}を{飲|の}む{前|まえ}に、よく{説明書|せつめいしょ}を{読|よ}んでください。— はい、わかりました。', 'Kono kusuri o nomu mae ni, yoku setsumeisho o yonde kudasai. — Hai, wakarimashita.', '2-2 例.'),
          E('ご{飯|はん}を{食|た}べる{前|まえ}に、この{薬|くすり}を{飲|の}んでください。— はい、わかりました。', 'Gohan o taberu mae ni, kono kusuri o nonde kudasai. — Hai, wakarimashita.', '2-2 ①.'),
          E('{寝|ね}る{前|まえ}に、この{薬|くすり}を{塗|ぬ}ってください。— はい、わかりました。', 'Neru mae ni, kono kusuri o nutte kudasai. — Hai, wakarimashita.', '2-2 ②.'),
          E('{食事|しょくじ}の{30分|さんじゅっぷん}{前|まえ}に、この{薬|くすり}を{飲|の}んでください。— はい、わかりました。', 'Shokuji no sanjuppun mae ni, kono kusuri o nonde kudasai. — Hai, wakarimashita.', '2-2 ③ — N の + thời gian + 前に.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 218 · できる! — Người ốm, bạn, bác sĩ (đóng vai 3 người)',
      'Câu hỏi của trang: "Khi bị ốm, bạn nói chuyện gì với bạn bè hay bác sĩ?" Nhiệm vụ: (1) nhóm 3 người chọn vai **người ốm – bạn của người ốm – bác sĩ**; (2) người ốm nói chuyện với bạn; (3) người ốm nói chuyện với bác sĩ — **bác sĩ vừa nhìn thẻ vừa nói**. Thẻ có hai cột: **患者に聞くこと** (11 điều hỏi bệnh nhân: sốt, đau họng/đầu/bụng, buồn nôn, không muốn ăn, ho/sổ mũi, dị ứng, ngủ có ngon không, ngày ăn 3 bữa không, uống rượu, hút thuốc, gần đây có căng thẳng không) và **患者に言うこと** (12 điều dặn, tự chọn: ngủ sớm, nghỉ ngơi, ăn 3 bữa, uống thuốc ngày ＿ lần (trước ＿ / sau khi ＿), rửa tay và súc họng, rửa mắt, đeo khẩu trang khi ra ngoài, ăn đồ mềm, không uống rượu, không hút thuốc, không tắm vòi sen, không ăn uống đồ lạnh).',
      [
        C('（{医者|いしゃ}）どうしましたか。', '(Isha) Dou shimashita ka.', '(Bác sĩ) Em bị làm sao?'),
        S('せきが{出|で}るんです。のども{痛|いた}いんです。', 'Seki ga deru n desu. Nodo mo itai n desu.', 'Em bị ho ạ. Họng cũng đau.'),
        C('{熱|ねつ}はありますか。', 'Netsu wa arimasu ka.', 'Có sốt không?'),
        S('いいえ、ありません。', 'Iie, arimasen.', 'Không ạ.'),
        C('たばこを{吸|す}いますか。', 'Tabako o suimasu ka.', 'Em có hút thuốc không?'),
        S('はい、{1日|いちにち}に{10本|じっぽん}ぐらい{吸|す}います。', 'Hai, ichinichi ni jippon gurai suimasu.', 'Có ạ, một ngày khoảng 10 điếu.'),
        C('たばこは{吸|す}わないほうがいいですよ。{出|で}かけるとき、マスクをしてください。{薬|くすり}は{1日|いちにち}に{2回|にかい}、{朝|あさ}ご{飯|はん}と{晩|ばん}ご{飯|はん}を{食|た}べてから{飲|の}んでください。', 'Tabako wa suwanai hou ga ii desu yo. Dekakeru toki, masuku o shite kudasai. Kusuri wa ichinichi ni nikai, asagohan to bangohan o tabete kara nonde kudasai.', 'Em không nên hút thuốc. Khi ra ngoài đeo khẩu trang. Thuốc ngày 2 lần, uống sau bữa sáng và bữa tối.'),
        S('はい、わかりました。ありがとうございました。', 'Hai, wakarimashita. Arigatou gozaimashita.', 'Vâng, em hiểu rồi. Cảm ơn bác sĩ ạ.'),
      ],
      [
        'Vai bác sĩ: đổi mỗi dòng thẻ thành **câu hỏi ～ますか** ({熱|ねつ}がありますか, お{酒|さけ}を{飲|の}みますか) rồi dặn bằng **～てください／～たほうがいい／～ないほうがいい**.',
        'Dòng "{1日|いちにち}に＿{回|かい}{薬|くすり}を{飲|の}みます（＿{前|まえ}に・＿てから）" = chỗ ghép **ポイント 106 + 107** — cô hay kiểm tra chỗ này.',
        'Vai người ốm: trả lời bằng **～んです**, bị từ bao giờ bằng **～から／～てから**.',
        'Xem **Hội thoại · できる！** (thẻ viết lại thành câu hoàn chỉnh + kịch bản mẫu).',
      ],
    ),

    ...trang(
      'Trang 218 · 話読聞書「{体|からだ}にいいこと」 — Việc tốt cho sức khoẻ',
      'Ô 話読聞書 có một đoạn ngắn khoảng 8 câu: người viết hỏi người đọc có làm gì tốt cho sức khoẻ không, rồi kể mình **mỗi sáng trước khi ăn** tự làm **nước ép rau** để uống; cách làm đơn giản — cắt rau cho vào máy ép; nguyên liệu là cà rốt, bắp cải, cà chua…; nên cho thêm một ít trái cây; và rủ mọi người cùng uống cho khoẻ. Từ ở chân bài: 材料, ジューサー, キャベツ, トマト, ニンジン. Ba câu gợi ý bên cạnh (cô sẽ hỏi đúng 3 câu này): **何か体にいいことをしていますか · どのくらいしていますか · どうやってしていますか**. Nhiệm vụ: viết và đọc đoạn về việc tốt cho sức khoẻ của BẠN.',
      [
        C('{何|なに}か{体|からだ}にいいことをしていますか。', 'Nanika karada ni ii koto o shite imasu ka.', 'Em có làm việc gì tốt cho sức khoẻ không?'),
        S('はい、しています。{毎朝|まいあさ}、{学校|がっこう}へ{行|い}く{前|まえ}に、{湖|みずうみ}の{周|まわ}りを{走|はし}っています。', 'Hai, shite imasu. Maiasa, gakkou e iku mae ni, mizuumi no mawari o hashitte imasu.', 'Có ạ. Sáng nào trước khi đi học em cũng chạy quanh hồ.'),
        C('どのくらいしていますか。', 'Dono kurai shite imasu ka.', 'Em làm bao lâu / bao nhiêu?'),
        S('{1日|いちにち}に{20分|にじゅっぷん}ぐらいです。{1週間|いっしゅうかん}に{5回|ごかい}{走|はし}ります。', 'Ichinichi ni nijuppun gurai desu. Isshuukan ni gokai hashirimasu.', 'Một ngày khoảng 20 phút. Một tuần em chạy 5 lần.'),
        C('どうやってしていますか。', 'Douyatte shite imasu ka.', 'Em làm như thế nào?'),
        S('{走|はし}る{前|まえ}に、{水|みず}を{飲|の}みます。{走|はし}ってから、シャワーを{浴|あ}びて、{朝|あさ}ご{飯|はん}を{食|た}べます。{皆|みな}さんも{運動|うんどう}をしたほうがいいですよ。', 'Hashiru mae ni, mizu o nomimasu. Hashitte kara, shawaa o abite, asagohan o tabemasu. Minasan mo undou o shita hou ga ii desu yo.', 'Trước khi chạy em uống nước. Chạy xong em tắm vòi sen rồi ăn sáng. Mọi người cũng nên vận động nhé.'),
      ],
      [
        '3 câu hỏi = 3 mẫu: **～ています** (thói quen) · **{1日|いちにち}に～{分|ふん}／{1週間|いっしゅうかん}に～{回|かい}** (Bài 9) · **～前に／～てから** (ポイント 106, 107).',
        'Câu kết bằng **～たほうがいいですよ** (ポイント 105) là bài của bạn đủ ý như bài mẫu.',
        '湖 (hồ), 周り (xung quanh) là từ tự thêm cho bài của Minh — thay bằng việc thật của bạn.',
        'Xem **Hội thoại · ④ Nói–Đọc–Nghe–Viết — 体にいいこと** (bài mẫu mới + khung viết).',
      ],
    ),

    { t: 'h', text: 'Trang 219 · ことば — Từ vựng của bài' },
    {
      t: 'p',
      text: 'Trang liệt kê 51 từ theo 3 chủ đề: (1) 体の調子 (17) — chấn thương, thèm ăn, tình trạng, sốt, bệnh, cổ họng, răng, buổi nhậu, ～độ, khỏi, xấu / không khoẻ, buồn nôn, không sao, sớm, おかげさまで, お大事に, それはいけませんね; (2) アドバイス (18) — vòi sen, giấc ngủ, nha sĩ, bỏng, こと, もの, trở lên, phát ra (声を出します), bôi, tắm (vòi sen), ra ngoài, vận động, cứng, mềm, tốt cho sức khoẻ, tự mình, càng … càng tốt, thong thả (ゆっくり休んでください); (3) 病院で (16) — dược sĩ, áo khoác, kính áp tròng, tờ hướng dẫn, bồn tắm, thẻ bảo hiểm, phòng chờ, hiệu thuốc, nộp (保険証を出してください), cởi, chạy, chờ, đánh (răng), nằm xuống, chuẩn bị, ngứa. Không có tranh. Đủ nghĩa, romaji, ví dụ: xem mục **Từ vựng** của Bài 12.',
    },
    {
      t: 'note',
      title: 'Mẹo',
      items: [
        'Cô hay kiểm tra nhanh bằng cặp dễ lẫn: **出します／出ます／出かけます · お風呂に入ります／シャワーを浴びます · こと／もの · 固い／柔らかい · 横になります／寝ます** — ôn ở **Từ vựng · Nhầm lẫn hay gặp**.',
        'Với mỗi động từ mới, thuộc luôn **thể て, thể た, thể ない** (脱いで・脱いだ・脱がない, 走って・走った・走らない) — cả 4 ポイント của bài đều cần. Bảng: **Ngữ pháp · Động từ của Bài 12**.',
        'Xem **Từ vựng · Bài 12** và **Chữ Hán · Bài 12**.',
      ],
    },

    ...trang(
      'Trang 220 · もう{一度|いちど}{聞|き}こう — Nghe lại cả bài',
      'Nghe lại đoạn ở trang 205 (CD C18), ba cảnh. **Ở trường:** ダニエル thấy mặt パク đỏ, hỏi sao thế — パク **sốt từ hôm qua, cũng đau họng**; chưa đi bệnh viện; ダニエル khuyên **nên đi sớm**; パク nói **làm thêm xong** sẽ đi. **Ở bệnh viện:** nhân viên gọi tên パク vào; bác sĩ hỏi bị làm sao, **bao nhiêu độ** — **38 độ**; bác sĩ bảo há miệng, kết luận **cảm**, dặn **uống thuốc và nghỉ ngơi**; パク hỏi mai **ra ngoài được không** — được, nhưng **đừng đến chỗ đông người**; bác sĩ **kê đơn**, bảo ra hiệu thuốc lấy thuốc. **Ở hiệu thuốc:** dược sĩ dặn thuốc **ngày 3 lần**; **thuốc đỏ uống trước khi ăn**, thuốc kia **uống sau khi ăn**. Từ ở chân trang: 処方箋 (đơn thuốc), 赤い (đỏ). Cô sẽ hỏi lại các chi tiết.',
      [
        C('パクさんはどうしたんですか。', 'Paku-san wa dou shita n desu ka.', 'Park bị làm sao?'),
        S('{昨日|きのう}から{熱|ねつ}があるんです。のども{痛|いた}いんです。', 'Kinou kara netsu ga aru n desu. Nodo mo itai n desu.', 'Bạn ấy sốt từ hôm qua. Họng cũng đau ạ.'),
        C('ダニエルさんはどんなアドバイスをしましたか。', 'Danieru-san wa donna adobaisu o shimashita ka.', 'Daniel đã khuyên gì?'),
        S('「{早|はや}く{病院|びょういん}へ{行|い}ったほうがいいですよ」。', 'Hayaku byouin e itta hou ga ii desu yo.', '(Bạn ấy khuyên) "Nên đi bệnh viện sớm đi."'),
        C('パクさんはいつ{病院|びょういん}へ{行|い}きますか。', 'Paku-san wa itsu byouin e ikimasu ka.', 'Park đi bệnh viện lúc nào?'),
        S('アルバイトが{終|お}わってから、{行|い}きます。', 'Arubaito ga owatte kara, ikimasu.', 'Làm thêm xong rồi đi ạ.'),
        C('{熱|ねつ}は{何度|なんど}でしたか。', 'Netsu wa nando deshita ka.', 'Sốt bao nhiêu độ?'),
        S('{38度|さんじゅうはちど}でした。', 'Sanjuuhachi do deshita.', '38 độ ạ.'),
        C('{明日|あした}、パクさんは{出|で}かけてもいいですか。', 'Ashita, Paku-san wa dekakete mo ii desu ka.', 'Ngày mai Park ra ngoài được không?'),
        S('はい、いいです。でも、{人|ひと}が{多|おお}いところは{行|い}かないほうがいいです。', 'Hai, ii desu. Demo, hito ga ooi tokoro wa ikanai hou ga ii desu.', 'Được ạ. Nhưng không nên đến chỗ đông người.'),
        C('{赤|あか}い{薬|くすり}はいつ{飲|の}みますか。', 'Akai kusuri wa itsu nomimasu ka.', 'Thuốc đỏ uống lúc nào?'),
        S('ご{飯|はん}を{食|た}べる{前|まえ}に{飲|の}みます。', 'Gohan o taberu mae ni nomimasu.', 'Uống trước khi ăn cơm ạ.'),
      ],
      [
        'Thuốc **đỏ → 前に**, thuốc kia → **てから**: đây là bẫy chính của đoạn nghe — ghi nháp ngay khi nghe.',
        '**{処方箋|しょほうせん}を{出|だ}します** = kê đơn (出します thứ ba: đưa ra giấy tờ). **{何度|なんど}ですか** = bao nhiêu độ.',
        'Cô hỏi "khuyên gì" → chỉ cần nhắc lại **đúng câu khuyên**: {早|はや}く{病院|びょういん}へ{行|い}ったほうがいいですよ (cách thuật lại "… と言いました" học ở bài sau).',
        'Xem **Luyện nghe · Bài 4 — Hội thoại dài** (kịch bản mới cùng tình huống).',
      ],
    ),

    { t: 'h', text: 'Cô hỏi — bạn trả lời: ghép nhanh câu trả lời' },
    {
      t: 'build',
      id: 'b12-sach-ghep',
      title: 'Nghe câu hỏi (tiếng Việt) → ghép câu trả lời tiếng Nhật',
      items: [
        { vi: 'Cô hỏi どうしたんですか → "Em đau họng ạ."', chips: ['のどが', '{痛|いた}いんです。', 'のどを', '{痛|いた}いなんです。'], answer: ['のどが', '{痛|いた}いんです。'], ro: 'Nodo ga itai n desu.' },
        { vi: 'Cô hỏi 昨日、どうしたんですか → "Em bị cảm ạ."', chips: ['{風邪|かぜ}を', 'ひいたんです。', 'ひくんです。', '{風邪|かぜ}が'], answer: ['{風邪|かぜ}を', 'ひいたんです。'], ro: 'Kaze o hiita n desu.' },
        { vi: 'Cô hỏi 大丈夫ですか → "Vâng, nhờ cô, em khỏi rồi ạ."', chips: ['はい、', 'おかげさまで、', 'もう', '{治|なお}りました。', 'お{大事|だいじ}に。'], answer: ['はい、', 'おかげさまで、', 'もう', '{治|なお}りました。'], ro: 'Hai, okagesama de, mou naorimashita.' },
        { vi: 'Xin cô: "Thưa cô, em đi bệnh viện rồi quay lại được không ạ?"', chips: ['{先生|せんせい}、', '{病院|びょういん}へ', '{行|い}ってきても', 'いいですか。', '{行|い}きても', '{病院|びょういん}を'], answer: ['{先生|せんせい}、', '{病院|びょういん}へ', '{行|い}ってきても', 'いいですか。'], ro: 'Sensei, byouin e itte kite mo ii desu ka.' },
        { vi: 'Khuyên bạn: "Cậu nên đi nha sĩ đi."', chips: ['{歯医者|はいしゃ}へ', '{行|い}った', 'ほうがいいですよ。', '{行|い}く', '{行|い}かない'], answer: ['{歯医者|はいしゃ}へ', '{行|い}った', 'ほうがいいですよ。'], ro: 'Haisha e itta hou ga ii desu yo.' },
        { vi: 'Khuyên bạn: "Hôm nay đừng ăn nhiều đồ lạnh thì hơn."', chips: ['{今日|きょう}は', 'あまり', '{冷|つめ}たいものを', '{食|た}べない', 'ほうがいいですよ。', '{食|た}べなかった'], answer: ['{今日|きょう}は', 'あまり', '{冷|つめ}たいものを', '{食|た}べない', 'ほうがいいですよ。'], ro: 'Kyou wa amari tsumetai mono o tabenai hou ga ii desu yo.' },
        { vi: 'Bác sĩ hỏi いつからですか → "Hôm qua ăn tối xong thì bị đau ạ."', chips: ['{昨日|きのう}、', '{晩|ばん}ご{飯|はん}を', '{食|た}べてから、', '{痛|いた}くなりました。', '{食|た}べたから、', '{痛|いた}いになりました。'], answer: ['{昨日|きのう}、', '{晩|ばん}ご{飯|はん}を', '{食|た}べてから、', '{痛|いた}くなりました。'], ro: 'Kinou, bangohan o tabete kara, itaku narimashita.' },
        { vi: 'Bác sĩ hỏi 何か薬を飲みましたか → "Rồi ạ, em uống trước khi ngủ."', chips: ['はい、', '{寝|ね}る', '{前|まえ}に', '{飲|の}みました。', '{寝|ね}た', '{寝|ね}て'], answer: ['はい、', '{寝|ね}る', '{前|まえ}に', '{飲|の}みました。'], ro: 'Hai, neru mae ni nomimashita.' },
        { vi: 'Nhân viên dặn: "Nộp thẻ bảo hiểm xong thì chờ ở phòng chờ."', chips: ['{保険証|ほけんしょう}を', '{出|だ}してから、', '{待合室|まちあいしつ}で', '{待|ま}ってください。', '{出|で}てから、', '{待合室|まちあいしつ}に'], answer: ['{保険証|ほけんしょう}を', '{出|だ}してから、', '{待合室|まちあいしつ}で', '{待|ま}ってください。'], ro: 'Hokenshou o dashite kara, machiaishitsu de matte kudasai.' },
        { vi: 'Dược sĩ dặn: "Uống thuốc này 30 phút trước bữa ăn."', chips: ['{食事|しょくじ}の', '{30分|さんじゅっぷん}', '{前|まえ}に、', 'この{薬|くすり}を', '{飲|の}んでください。', '{食事|しょくじ}', 'から、'], answer: ['{食事|しょくじ}の', '{30分|さんじゅっぷん}', '{前|まえ}に、', 'この{薬|くすり}を', '{飲|の}んでください。'], ro: 'Shokuji no sanjuppun mae ni, kono kusuri o nonde kudasai.' },
      ],
    },
  ],
};
