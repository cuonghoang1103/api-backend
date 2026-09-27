/**
 * Bài 11 — 私の生活 (Cuộc sống của tôi) · できる日本語 初級 第11課, p.185–204 · JPD113/JPD123.
 *
 * Ngữ pháp: ポイント 98–103 (p.278–279): Vテ形います (thói quen, việc đang làm trong một
 * thời gian) · Vた形りVた形りします · N1は___が、N2は___ · ［イA／ナAな／Nの／V辞書形／
 * Vた形／Vナイ形］とき · ～とき、どうしますか · 友達言葉 (thể thường nói với bạn)
 * + bảng タ形 (表 p.283) + bảng 丁寧形 ↔ 普通形 đủ V / イA / ナA / N (表 p.284).
 * Từ vựng: đủ 49 mục của trang ことば p.203 (26 + 13 + 10) — từ Bài 8 trở đi cô không
 * phát danh sách riêng nên trang ことば của sách là chuẩn. Từ ở bài đọc / bài nghe / ポイント
 * (乾杯, お待たせ, ワールドカップ, 居酒屋, けど…) nằm ở mục "Từ thêm".
 * Hội thoại, câu ví dụ, bài đọc, kịch bản nghe: VIẾT MỚI theo đúng tình huống của sách
 * (xem ../SOAN-BAI.md). Chỉ dùng lại tên nhân vật; tên quán, công viên, phim là tự đặt.
 *
 * Vai (theo bai1.ts / bai9.ts): nữ = パク, ワン, アンナ, メアリー, 山口 (role a / c, giọng
 * ja-nu); nam = 西川, ナタポン, ダニエル, マルコ (role b, giọng ja-nam). Giám thị / cô — examiner.
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
  id: 'b11-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — 私の生活 Cuộc sống bây giờ, tôi ngày trước, nói chuyện với bạn',
  goal: 'Kể và hỏi về cuộc sống hằng ngày (đã quen chưa, thường làm gì, ngày nghỉ làm gì, khi … thì làm sao), kể chuyện ngày trước bằng ～とき, và nói chuyện với bạn bè bằng thể thường (友達言葉): hỏi, rủ, từ chối, xin phép.',
  minutes: 45,
  blocks: [
    {
      t: 'note',
      title: 'Học xong bài 11 bạn làm được (できる)',
      items: [
        '**① {今|いま}の{生活|せいかつ}** — ở quán nhậu sau buổi giao lưu, **kể về cuộc sống hiện tại và hỏi người khác**: đã quen chưa, sống một mình thế nào, học xong thường làm gì, ngày nghỉ làm gì, khi mệt / đau đầu / không ngủ được thì làm sao.',
        '**② {今|いま}の{私|わたし}・{前|まえ}の{私|わたし}** — **kể đơn giản về quá khứ của mình** và hỏi người khác: món đồ này có từ khi nào ("khi sang Nhật bạn tặng"), bắt đầu chơi môn này từ khi nào, vì sao thích.',
        '**③ {友達|ともだち}と** — **nói chuyện với bạn bè bằng "lời bạn bè"** (友達言葉 = thể thường): うん／ううん, 見る？, 忙しくない, 何した？, 食べない？, 貸して, 見てもいい？',
        '**できる！** — mời sinh viên / học sinh Nhật đến lớp, cả nhóm chuẩn bị câu hỏi về sinh hoạt hằng ngày, nói chuyện rồi báo cáo lại trước lớp.',
      ],
    },
    {
      t: 'table',
      caption: 'Bức tranh chung của bài — ba cuộc nói chuyện',
      head: ['Lúc', 'Câu then chốt', 'Romaji', 'ポイント'],
      rows: [
        ['Hỏi thăm cuộc sống', '{初|はじ}めは{少|すこ}し{寂|さび}しかったですが、{今|いま}は{楽|たの}しいです。', 'Hajime wa sukoshi sabishikatta desu ga, ima wa tanoshii desu.', '100'],
        ['Việc làm thường ngày', '{毎朝|まいあさ}、ジョギングをしています。', 'Maiasa, jogingu o shite imasu.', '98'],
        ['Ngày nghỉ', '{音楽|おんがく}を{聞|き}いたりゲームをしたりしています。', 'Ongaku o kiitari geemu o shitari shite imasu.', '99'],
        ['Khi … thì …', '{暇|ひま}なとき、{雑誌|ざっし}を{読|よ}みます。', 'Hima na toki, zasshi o yomimasu.', '101'],
        ['Hỏi cách xử lý', '{頭|あたま}が{痛|いた}いとき、どうしますか。——{薬|くすり}を{飲|の}みます。', 'Atama ga itai toki, dou shimasu ka. — Kusuri o nomimasu.', '102'],
        ['Kể chuyện ngày trước', '{小学生|しょうがくせい}のとき、{水泳|すいえい}を{始|はじ}めました。', 'Shougakusei no toki, suiei o hajimemashita.', '101'],
        ['Món đồ có từ bao giờ', '{日本|にほん}へ{来|く}るとき、{友達|ともだち}がくれました。', 'Nihon e kuru toki, tomodachi ga kuremashita.', '101'],
        ['Nói với bạn', 'よくドラマ{見|み}る？——うん、{見|み}る。／ううん、{見|み}ない。', 'Yoku dorama miru? — Un, miru. / Uun, minai.', '103'],
      ],
    },

    /* ── ① 今の生活 ── */
    { t: 'h', text: '① {今|いま}の{生活|せいかつ} — Cuộc sống bây giờ' },
    {
      t: 'p',
      text: 'Tình huống: sau một buổi **giao lưu** ({交流会|こうりゅうかい}), mọi người rủ nhau ra **quán nhậu** ({居酒屋|いざかや}) nói chuyện. Người Nhật hỏi du học sinh: **đã quen cuộc sống ở Nhật chưa**, **sống một mình** thế nào, **học xong thường làm gì**, **ngày nghỉ làm gì**. Hỏi và kể được cả hai chiều.',
    },
    {
      t: 'dialogue',
      title: 'Đã quen cuộc sống ở Nhật chưa?',
      lines: [
        { who: '西川', role: 'b', text: 'アンナさん、{日本|にほん}の{生活|せいかつ}に{慣|な}れましたか。', ro: 'Anna-san, Nihon no seikatsu ni naremashita ka.', vi: 'Anna, bạn đã quen với cuộc sống ở Nhật chưa?' },
        { who: 'アンナ', role: 'c', text: 'ええ、{慣|な}れました。', ro: 'Ee, naremashita.', vi: 'Vâng, tôi quen rồi.' },
        { who: '西川', role: 'b', text: '{一人|ひとり}{暮|ぐ}らしはどうですか。', ro: 'Hitorigurashi wa dou desu ka.', vi: 'Sống một mình thế nào?' },
        { who: 'アンナ', role: 'c', text: 'そうですねえ。{初|はじ}めは{少|すこ}し{寂|さび}しかったですが、{今|いま}は{楽|たの}しくなりました。', ro: 'Sou desu nee. Hajime wa sukoshi sabishikatta desu ga, ima wa tanoshiku narimashita.', vi: 'Để xem nào. Lúc đầu hơi buồn (cô đơn), nhưng bây giờ đã thấy vui rồi.' },
        { who: '西川', role: 'b', text: 'そうですか。{日本語|にほんご}の{勉強|べんきょう}はどうですか。', ro: 'Sou desu ka. Nihongo no benkyou wa dou desu ka.', vi: 'Vậy à. Việc học tiếng Nhật thế nào?' },
        { who: 'アンナ', role: 'c', text: '{会話|かいわ}は{好|す}きですが、{作文|さくぶん}はあまり{好|す}きじゃありません。{漢字|かんじ}をよく{忘|わす}れますから。', ro: 'Kaiwa wa suki desu ga, sakubun wa amari suki ja arimasen. Kanji o yoku wasuremasu kara.', vi: 'Hội thoại thì tôi thích, nhưng viết văn thì không thích lắm. Vì tôi hay quên chữ Hán.' },
        { who: '西川', role: 'b', text: 'もういろいろなところへ{行|い}きましたか。', ro: 'Mou iroiro na tokoro e ikimashita ka.', vi: 'Bạn đã đi nhiều nơi chưa?' },
        { who: 'アンナ', role: 'c', text: '{近|ちか}いところへは{行|い}きましたが、{遠|とお}いところへはまだ{行|い}っていません。', ro: 'Chikai tokoro e wa ikimashita ga, tooi tokoro e wa mada itte imasen.', vi: 'Những chỗ gần thì tôi đi rồi, nhưng chỗ xa thì chưa đi.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Học xong thường làm gì?',
      lines: [
        { who: 'パク', role: 'a', text: 'マルコさん、{授業|じゅぎょう}は{何時|なんじ}に{終|お}わりますか。', ro: 'Maruko-san, jugyou wa nanji ni owarimasu ka.', vi: 'Marco, giờ học kết thúc lúc mấy giờ?' },
        { who: 'マルコ', role: 'b', text: '{1時|いちじ}に{終|お}わります。{火曜|かよう}と{木曜|もくよう}は{午後|ごご}も{授業|じゅぎょう}があります。', ro: 'Ichiji ni owarimasu. Kayou to mokuyou wa gogo mo jugyou ga arimasu.', vi: 'Kết thúc lúc 1 giờ. Thứ Ba và thứ Năm buổi chiều cũng có tiết.' },
        { who: 'パク', role: 'a', text: 'へえ。それから、いつも{何|なに}をしていますか。', ro: 'Hee. Sorekara, itsumo nani o shite imasu ka.', vi: 'Ồ. Sau đó bạn thường làm gì?' },
        { who: 'マルコ', role: 'b', text: 'コンビニでアルバイトをしています。{1週間|いっしゅうかん}に{3回|さんかい}です。', ro: 'Konbini de arubaito o shite imasu. Isshuukan ni sankai desu.', vi: 'Tôi làm thêm ở cửa hàng tiện lợi. Một tuần 3 buổi.' },
        { who: 'パク', role: 'a', text: 'アルバイトは{大変|たいへん}ですか。', ro: 'Arubaito wa taihen desu ka.', vi: 'Làm thêm có vất vả không?' },
        { who: 'マルコ', role: 'b', text: '{初|はじ}めは{大変|たいへん}でしたが、{今|いま}はおもしろくなりました。{店長|てんちょう}がとても{親切|しんせつ}ですから。', ro: 'Hajime wa taihen deshita ga, ima wa omoshiroku narimashita. Tenchou ga totemo shinsetsu desu kara.', vi: 'Lúc đầu thì vất vả, nhưng bây giờ đã thấy thú vị. Vì cửa hàng trưởng rất tốt bụng.' },
        { who: 'パク', role: 'a', text: 'いいですね。{私|わたし}は{毎週|まいしゅう}{土曜日|どようび}、{書道|しょどう}{教室|きょうしつ}に{通|かよ}っています。', ro: 'Ii desu ne. Watashi wa maishuu doyoubi, shodou kyoushitsu ni kayotte imasu.', vi: 'Hay nhỉ. Tôi thì thứ Bảy hằng tuần đi học lớp thư pháp.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Ngày nghỉ bạn thường làm gì?',
      lines: [
        { who: 'ワン', role: 'c', text: 'ナタポンさんは{休|やす}みの{日|ひ}、よく{何|なに}をしていますか。', ro: 'Natapon-san wa yasumi no hi, yoku nani o shite imasu ka.', vi: 'Natapon, ngày nghỉ bạn hay làm gì?' },
        { who: 'ナタポン', role: 'b', text: 'そうですねえ。うちで{音楽|おんがく}を{聞|き}いたりゲームをしたりしています。', ro: 'Sou desu nee. Uchi de ongaku o kiitari geemu o shitari shite imasu.', vi: 'Để xem. Tôi ở nhà nghe nhạc, chơi game (các thứ).' },
        { who: 'ワン', role: 'c', text: 'そうですか。{外|そと}へは{行|い}きませんか。', ro: 'Sou desu ka. Soto e wa ikimasen ka.', vi: 'Vậy à. Bạn không ra ngoài à?' },
        { who: 'ナタポン', role: 'b', text: '{天気|てんき}がいいとき、{公園|こうえん}へサッカーをしに{行|い}きます。ワンさんは？', ro: 'Tenki ga ii toki, kouen e sakkaa o shi ni ikimasu. Wan-san wa?', vi: 'Khi trời đẹp thì tôi ra công viên chơi bóng đá. Còn Wang?' },
        { who: 'ワン', role: 'c', text: '{私|わたし}は{毎朝|まいあさ}、{公園|こうえん}でジョギングをしています。{休|やす}みの{日|ひ}は{公園|こうえん}へ{行|い}って、{本|ほん}を{読|よ}んだり{絵|え}を{描|か}いたりしています。', ro: 'Watashi wa maiasa, kouen de jogingu o shite imasu. Yasumi no hi wa kouen e itte, hon o yondari e o kaitari shite imasu.', vi: 'Tôi thì sáng nào cũng chạy bộ ở công viên. Ngày nghỉ tôi ra công viên đọc sách, vẽ tranh (các thứ).' },
        { who: 'ナタポン', role: 'b', text: '{雨|あめ}のときは？', ro: 'Ame no toki wa?', vi: 'Còn khi trời mưa?' },
        { who: 'ワン', role: 'c', text: '{雨|あめ}のとき、{部屋|へや}で{雑誌|ざっし}を{読|よ}んだり{日記|にっき}を{書|か}いたりします。', ro: 'Ame no toki, heya de zasshi o yondari nikki o kaitari shimasu.', vi: 'Khi mưa thì tôi ở trong phòng đọc tạp chí, viết nhật ký (các thứ).' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Dạo này — khi … thì bạn làm sao?',
      lines: [
        { who: 'ダニエル', role: 'b', text: '{最近|さいきん}、{夜|よる}、なかなか{寝|ね}ることができません。', ro: 'Saikin, yoru, nakanaka neru koto ga dekimasen.', vi: 'Dạo này buổi tối tôi mãi không ngủ được.' },
        { who: 'アンナ', role: 'c', text: 'そうですか。{私|わたし}は{寝|ね}ることができないとき、{牛乳|ぎゅうにゅう}を{飲|の}みます。', ro: 'Sou desu ka. Watashi wa neru koto ga dekinai toki, gyuunyuu o nomimasu.', vi: 'Vậy à. Tôi thì khi không ngủ được, tôi uống sữa.' },
        { who: 'ダニエル', role: 'b', text: 'へえ。じゃ、{眠|ねむ}いとき、どうしますか。{授業|じゅぎょう}の{前|まえ}、いつも{眠|ねむ}いです。', ro: 'Hee. Ja, nemui toki, dou shimasu ka. Jugyou no mae, itsumo nemui desu.', vi: 'Ồ. Thế khi buồn ngủ thì bạn làm sao? Trước giờ học tôi lúc nào cũng buồn ngủ.' },
        { who: 'アンナ', role: 'c', text: 'コーヒーを{飲|の}みます。それから、{少|すこ}し{散歩|さんぽ}します。', ro: 'Koohii o nomimasu. Sorekara, sukoshi sanpo shimasu.', vi: 'Tôi uống cà phê. Rồi đi dạo một chút.' },
        { who: 'ダニエル', role: 'b', text: '{風邪|かぜ}をひいたときは？', ro: 'Kaze o hiita toki wa?', vi: 'Còn khi bị cảm?' },
        { who: 'アンナ', role: 'c', text: '{学校|がっこう}を{休|やす}んで、{病院|びょういん}へ{行|い}きます。アルバイトを{休|やす}むとき、{店長|てんちょう}に{電話|でんわ}します。', ro: 'Gakkou o yasunde, byouin e ikimasu. Arubaito o yasumu toki, tenchou ni denwa shimasu.', vi: 'Tôi nghỉ học rồi đi bệnh viện. Khi nghỉ làm thêm thì tôi gọi điện cho cửa hàng trưởng.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{日本|にほん}の{生活|せいかつ}に{慣|な}れましたか。——ええ。', ro: 'Nihon no seikatsu ni naremashita ka. — Ee.', vi: 'Bạn quen cuộc sống ở Nhật chưa? — Vâng. (Nに慣れます)' },
        { en: '{初|はじ}めは{少|すこ}し{寂|さび}しかったですが、{今|いま}は{楽|たの}しくなりました。', ro: 'Hajime wa sukoshi sabishikatta desu ga, ima wa tanoshiku narimashita.', vi: 'Lúc đầu hơi buồn, nhưng giờ đã vui rồi. — ポイント 100 + なります (Bài 10)' },
        { en: '{会話|かいわ}は{好|す}きですが、{作文|さくぶん}は{好|す}きじゃありません。', ro: 'Kaiwa wa suki desu ga, sakubun wa suki ja arimasen.', vi: 'Hội thoại thì thích, nhưng viết văn thì không thích. — ポイント 100' },
        { en: 'いつも{何|なに}をしていますか。——アルバイトをしています。', ro: 'Itsumo nani o shite imasu ka. — Arubaito o shite imasu.', vi: 'Bạn thường làm gì? — Tôi làm thêm. — ポイント 98' },
        { en: '{休|やす}みの{日|ひ}、よく{何|なに}をしていますか。——{音楽|おんがく}を{聞|き}いたりゲームをしたりしています。', ro: 'Yasumi no hi, yoku nani o shite imasu ka. — Ongaku o kiitari geemu o shitari shite imasu.', vi: 'Ngày nghỉ bạn hay làm gì? — Nghe nhạc, chơi game… — ポイント 99' },
        { en: '{雨|あめ}のとき、{部屋|へや}で{本|ほん}を{読|よ}みます。', ro: 'Ame no toki, heya de hon o yomimasu.', vi: 'Khi trời mưa, tôi đọc sách trong phòng. — ポイント 101' },
        { en: '{眠|ねむ}いとき、どうしますか。——コーヒーを{飲|の}みます。', ro: 'Nemui toki, dou shimasu ka. — Koohii o nomimasu.', vi: 'Khi buồn ngủ bạn làm thế nào? — Tôi uống cà phê. — ポイント 102' },
        { en: 'そうですねえ。／へえ。', ro: 'Sou desu nee. / Hee.', vi: 'Để xem nào… (đang nghĩ) / Ồ! (ngạc nhiên, thích thú khi nghe kể)' },
      ],
    },

    /* ── ② 今の私・前の私 ── */
    { t: 'h', text: '② {今|いま}の{私|わたし}・{前|まえ}の{私|わたし} — Tôi bây giờ, tôi ngày trước' },
    {
      t: 'p',
      text: 'Tình huống: vẫn ở quán nhậu. Khen một món đồ của bạn → bạn kể **món đồ đó có từ khi nào** (khi sang Nhật, khi đi Ý, khi nhập học…). Hỏi **bắt đầu môn thể thao / sở thích từ bao giờ** → kể: **hồi tiểu học** thấy gì, **vì sao thích**, **vì thế** mà bắt đầu.',
    },
    {
      t: 'dialogue',
      title: 'Cái đó đẹp nhỉ — có từ khi nào?',
      lines: [
        { who: 'パク', role: 'a', text: 'ナタポンさん、その{電子辞書|でんしじしょ}、いいですね。', ro: 'Natapon-san, sono denshi jisho, ii desu ne.', vi: 'Natapon, cái từ điển điện tử đó đẹp nhỉ.' },
        { who: 'ナタポン', role: 'b', text: 'これですか。{日本|にほん}へ{来|く}るとき、{友達|ともだち}がくれました。', ro: 'Kore desu ka. Nihon e kuru toki, tomodachi ga kuremashita.', vi: 'Cái này à? Lúc (chuẩn bị) sang Nhật, bạn tôi tặng.' },
        { who: 'パク', role: 'a', text: 'へえ。いい{友達|ともだち}ですね。', ro: 'Hee. Ii tomodachi desu ne.', vi: 'Ồ. Bạn tốt nhỉ.' },
        { who: 'ナタポン', role: 'b', text: 'パクさんのかばんもすてきですね。', ro: 'Paku-san no kaban mo suteki desu ne.', vi: 'Cái túi của Park cũng đẹp nhỉ.' },
        { who: 'パク', role: 'a', text: 'ありがとうございます。イタリアへ{行|い}ったとき、{買|か}いました。', ro: 'Arigatou gozaimasu. Itaria e itta toki, kaimashita.', vi: 'Cảm ơn. Tôi mua lúc đi Ý (mua ở Ý).' },
        { who: 'ナタポン', role: 'b', text: 'その{時計|とけい}は？', ro: 'Sono tokei wa?', vi: 'Còn cái đồng hồ đó?' },
        { who: 'パク', role: 'a', text: 'これは{大学|だいがく}に{入学|にゅうがく}したとき、{祖父|そふ}にもらいました。{大切|たいせつ}な{時計|とけい}です。', ro: 'Kore wa daigaku ni nyuugaku shita toki, sofu ni moraimashita. Taisetsu na tokei desu.', vi: 'Cái này tôi được ông tặng khi vào đại học. Là chiếc đồng hồ quý.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Bạn bắt đầu … từ khi nào?',
      lines: [
        { who: 'メアリー', role: 'c', text: '{西川|にしかわ}さんの{趣味|しゅみ}は{何|なん}ですか。', ro: 'Nishikawa-san no shumi wa nan desu ka.', vi: 'Sở thích của anh Nishikawa là gì?' },
        { who: '西川', role: 'b', text: 'サッカーです。{毎週|まいしゅう}{日曜日|にちようび}、{試合|しあい}をしています。', ro: 'Sakkaa desu. Maishuu nichiyoubi, shiai o shite imasu.', vi: 'Bóng đá. Chủ Nhật hằng tuần tôi đều đá trận.' },
        { who: 'メアリー', role: 'c', text: 'いつサッカーを{始|はじ}めましたか。', ro: 'Itsu sakkaa o hajimemashita ka.', vi: 'Anh bắt đầu chơi bóng đá từ khi nào?' },
        { who: '西川', role: 'b', text: '{小学生|しょうがくせい}のとき、{始|はじ}めました。{小学生|しょうがくせい}のとき、テレビでワールドカップを{見|み}ました。{選手|せんしゅ}がとてもかっこよかったですから、サッカーが{好|す}きになりました。それで、{始|はじ}めました。', ro: 'Shougakusei no toki, hajimemashita. Shougakusei no toki, terebi de waarudo kappu o mimashita. Senshu ga totemo kakkoyokatta desu kara, sakkaa ga suki ni narimashita. Sorede, hajimemashita.', vi: 'Tôi bắt đầu hồi tiểu học. Hồi tiểu học tôi xem World Cup trên TV. Các cầu thủ rất ngầu nên tôi thích bóng đá. Vì thế tôi bắt đầu chơi.' },
        { who: 'メアリー', role: 'c', text: 'へえ。そうですか。{私|わたし}は{中学生|ちゅうがくせい}のとき、テニスを{始|はじ}めました。{初|はじ}めは{下手|へた}でしたが、だんだん{上手|じょうず}になりました。', ro: 'Hee. Sou desu ka. Watashi wa chuugakusei no toki, tenisu o hajimemashita. Hajime wa heta deshita ga, dandan jouzu ni narimashita.', vi: 'Ồ, vậy à. Tôi thì bắt đầu chơi tennis hồi cấp hai. Lúc đầu chơi dở, nhưng dần dần giỏi lên.' },
        { who: '西川', role: 'b', text: '{今|いま}もしていますか。', ro: 'Ima mo shite imasu ka.', vi: 'Bây giờ vẫn chơi chứ?' },
        { who: 'メアリー', role: 'c', text: 'いいえ、{今|いま}はしていません。でも、また{始|はじ}めたいです。', ro: 'Iie, ima wa shite imasen. Demo, mata hajimetai desu.', vi: 'Không, bây giờ tôi không chơi. Nhưng tôi muốn chơi lại.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Xem ảnh cũ — lần đầu ra nước ngoài',
      lines: [
        { who: '山口', role: 'a', text: 'メアリーさん、この{写真|しゃしん}は{何|なん}ですか。', ro: 'Mearii-san, kono shashin wa nan desu ka.', vi: 'Mary, tấm ảnh này là gì vậy?' },
        { who: 'メアリー', role: 'c', text: '{大学生|だいがくせい}のとき、{初|はじ}めて{外国|がいこく}へ{行|い}きました。そのときの{写真|しゃしん}です。{京都|きょうと}のお{寺|てら}です。', ro: 'Daigakusei no toki, hajimete gaikoku e ikimashita. Sono toki no shashin desu. Kyouto no otera desu.', vi: 'Hồi sinh viên, lần đầu tiên tôi đi nước ngoài. Đây là ảnh lúc đó. Chùa ở Kyoto.' },
        { who: '山口', role: 'a', text: 'へえ。{日本|にほん}が{初|はじ}めての{外国|がいこく}ですか。', ro: 'Hee. Nihon ga hajimete no gaikoku desu ka.', vi: 'Ồ. Nhật là nước ngoài đầu tiên của bạn à?' },
        { who: 'メアリー', role: 'c', text: 'ええ。{国|くに}へ{帰|かえ}るとき、{日本|にほん}の{友達|ともだち}と{別|わか}れました。とても{寂|さび}しかったです。それで、また{日本|にほん}へ{来|き}ました。', ro: 'Ee. Kuni e kaeru toki, Nihon no tomodachi to wakaremashita. Totemo sabishikatta desu. Sorede, mata Nihon e kimashita.', vi: 'Vâng. Lúc về nước tôi phải chia tay các bạn Nhật. Rất buồn. Vì thế tôi lại sang Nhật.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{日本|にほん}へ{来|く}るとき、{友達|ともだち}がくれました。', ro: 'Nihon e kuru toki, tomodachi ga kuremashita.', vi: 'Lúc (sắp) sang Nhật, bạn tôi tặng. — V辞書形 + とき (ポイント 101): việc sau chưa xảy ra.' },
        { en: 'イタリアへ{行|い}ったとき、{買|か}いました。', ro: 'Itaria e itta toki, kaimashita.', vi: 'Khi đi Ý (đã tới Ý) thì mua. — Vた形 + とき (ポイント 101).' },
        { en: '{入学|にゅうがく}したとき、{祖父|そふ}にもらいました。', ro: 'Nyuugaku shita toki, sofu ni moraimashita.', vi: 'Khi nhập học, tôi được ông tặng.' },
        { en: 'いつ{水泳|すいえい}を{始|はじ}めましたか。——{小学生|しょうがくせい}のとき、{始|はじ}めました。', ro: 'Itsu suiei o hajimemashita ka. — Shougakusei no toki, hajimemashita.', vi: 'Bạn bắt đầu bơi từ khi nào? — Tôi bắt đầu hồi tiểu học. — Nのとき' },
        { en: '{選手|せんしゅ}がかっこよかったですから、{水泳|すいえい}が{好|す}きになりました。それで、{始|はじ}めました。', ro: 'Senshu ga kakkoyokatta desu kara, suiei ga suki ni narimashita. Sorede, hajimemashita.', vi: 'Vì vận động viên ngầu quá nên tôi thích bơi. Vì thế tôi bắt đầu.' },
        { en: '{初|はじ}めは{下手|へた}でしたが、だんだん{上手|じょうず}になりました。', ro: 'Hajime wa heta deshita ga, dandan jouzu ni narimashita.', vi: 'Lúc đầu dở, nhưng dần dần giỏi lên.' },
        { en: '{大学生|だいがくせい}のとき、{初|はじ}めて{外国|がいこく}へ{行|い}きました。', ro: 'Daigakusei no toki, hajimete gaikoku e ikimashita.', vi: 'Hồi sinh viên, lần đầu tiên tôi đi nước ngoài.' },
      ],
    },

    /* ── ③ 友達と ── */
    { t: 'h', text: '③ {友達|ともだち}と — Nói chuyện với bạn bè (友達言葉)' },
    {
      t: 'p',
      text: 'Tình huống: **trong lớp học**, giờ giải lao, nói chuyện với bạn cùng lớp. Với bạn thân, người Nhật **không dùng です／ます** mà dùng **thể thường** (普通形) — sách gọi là **友達言葉** ("lời bạn bè"). Câu hỏi chỉ cần **lên giọng cuối câu**, không có か; trả lời **うん** (ừ) / **ううん** (không); hay bỏ trợ từ を, へ. Xem bảng đổi ở **Ngữ pháp · ポイント 103**.',
    },
    {
      t: 'dialogue',
      title: 'Hỏi thói quen, sở thích (thể thường)',
      lines: [
        { who: 'ダニエル', role: 'b', text: 'パクさん、よく{日本|にほん}のドラマ{見|み}る？', ro: 'Paku-san, yoku Nihon no dorama miru?', vi: 'Park, cậu hay xem phim truyền hình Nhật không?' },
        { who: 'パク', role: 'a', text: 'うん、{見|み}る。{毎晩|まいばん}{見|み}てる。ダニエルさんは？', ro: 'Un, miru. Maiban mite ru. Danieru-san wa?', vi: 'Ừ, xem. Tối nào mình cũng xem. Còn Daniel?' },
        { who: 'ダニエル', role: 'b', text: 'ううん、{見|み}ない。ドラマはあんまり{好|す}きじゃない。{映画|えいが}は{好|す}きだけど。', ro: 'Uun, minai. Dorama wa anmari suki ja nai. Eiga wa suki da kedo.', vi: 'Không, mình không xem. Phim truyền hình thì không thích lắm. Phim điện ảnh thì thích.' },
        { who: 'パク', role: 'a', text: 'どんな{映画|えいが}が{好|す}き？', ro: 'Donna eiga ga suki?', vi: 'Cậu thích phim kiểu gì?' },
        { who: 'ダニエル', role: 'b', text: 'アクション{映画|えいが}。{毎日|まいにち}、{忙|いそが}しい？', ro: 'Akushon eiga. Mainichi, isogashii?', vi: 'Phim hành động. Ngày nào cậu cũng bận à?' },
        { who: 'パク', role: 'a', text: 'ううん、{忙|いそが}しくない。{平日|へいじつ}は{暇|ひま}。', ro: 'Uun, isogashiku nai. Heijitsu wa hima.', vi: 'Không, không bận. Ngày thường mình rảnh.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Cuối tuần làm gì? — thể quá khứ thường',
      lines: [
        { who: 'ワン', role: 'c', text: 'マルコさん、{週末|しゅうまつ}、{何|なに}した？', ro: 'Maruko-san, shuumatsu, nani shita?', vi: 'Marco, cuối tuần cậu làm gì?' },
        { who: 'マルコ', role: 'b', text: '{浅草|あさくさ}{行|い}った。{友達|ともだち}と{一緒|いっしょ}に。', ro: 'Asakusa itta. Tomodachi to issho ni.', vi: 'Mình đi Asakusa. Cùng với bạn.' },
        { who: 'ワン', role: 'c', text: 'へえ、どうだった？', ro: 'Hee, dou datta?', vi: 'Ồ, thế nào?' },
        { who: 'マルコ', role: 'b', text: '{楽|たの}しかった。でも、{人|ひと}が{多|おお}かった。ワンさんは？', ro: 'Tanoshikatta. Demo, hito ga ookatta. Wan-san wa?', vi: 'Vui lắm. Nhưng đông người. Còn Wang?' },
        { who: 'ワン', role: 'c', text: 'どこも{行|い}かなかった。うちで{雑誌|ざっし}{読|よ}んだり、{寝|ね}たりした。', ro: 'Doko mo ikanakatta. Uchi de zasshi yondari, netari shita.', vi: 'Mình chẳng đi đâu cả. Ở nhà đọc tạp chí, ngủ này nọ.' },
        { who: 'マルコ', role: 'b', text: 'その{雑誌|ざっし}、{東京|とうきょう}の{雑誌|ざっし}？どこで{買|か}った？', ro: 'Sono zasshi, Toukyou no zasshi? Doko de katta?', vi: 'Cuốn tạp chí đó là tạp chí về Tokyo à? Cậu mua ở đâu?' },
        { who: 'ワン', role: 'c', text: '{買|か}わなかった。{日本人|にほんじん}の{友達|ともだち}がくれた。', ro: 'Kawanakatta. Nihonjin no tomodachi ga kureta.', vi: 'Mình không mua. Bạn người Nhật tặng.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Rủ bạn — nhận lời / từ chối (thể thường)',
      lines: [
        { who: 'アンナ', role: 'c', text: 'ナタポンさん、{土曜日|どようび}、{一緒|いっしょ}にスイーツ{食|た}べ{放題|ほうだい}{行|い}かない？', ro: 'Natapon-san, doyoubi, issho ni suiitsu tabehoudai ikanai?', vi: 'Natapon, thứ Bảy đi ăn buffet đồ ngọt với mình không?' },
        { who: 'ナタポン', role: 'b', text: 'あ、ごめん。{土曜日|どようび}はアルバイトだから。', ro: 'A, gomen. Doyoubi wa arubaito da kara.', vi: 'À, xin lỗi. Vì thứ Bảy mình đi làm thêm.' },
        { who: 'アンナ', role: 'c', text: 'そっか。じゃ、{日曜日|にちようび}は？', ro: 'Sokka. Ja, nichiyoubi wa?', vi: 'Thế à. Vậy Chủ Nhật thì sao?' },
        { who: 'ナタポン', role: 'b', text: '{日曜日|にちようび}は{暇|ひま}。いいね。どこ{行|い}く？', ro: 'Nichiyoubi wa hima. Ii ne. Doko iku?', vi: 'Chủ Nhật thì rảnh. Hay đấy. Đi đâu?' },
        { who: 'アンナ', role: 'c', text: '{駅|えき}の{前|まえ}の「オレンジ」はどう？{2,500円|にせんごひゃくえん}で{少|すこ}し{高|たか}いけど、ケーキがおいしいよ。', ro: 'Eki no mae no "Orenji" wa dou? Nisen gohyaku en de sukoshi takai kedo, keeki ga oishii yo.', vi: 'Quán "Orange" trước ga thì sao? 2.500 yên, hơi đắt nhưng bánh ngon lắm đấy.' },
        { who: 'ナタポン', role: 'b', text: 'いいね。じゃ、また{明日|あした}。', ro: 'Ii ne. Ja, mata ashita.', vi: 'Được đấy. Vậy mai gặp lại nhé.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Trong lớp — nhờ, xin phép bạn (thể thường)',
      lines: [
        { who: 'パク', role: 'a', text: 'マルコさん、{消|け}しゴム{貸|か}して。', ro: 'Maruko-san, keshigomu kashite.', vi: 'Marco, cho mình mượn cục tẩy.' },
        { who: 'マルコ', role: 'b', text: 'うん、いいよ。はい。', ro: 'Un, ii yo. Hai.', vi: 'Ừ, được. Đây.' },
        { who: 'パク', role: 'a', text: 'ありがとう。ちょっと{暑|あつ}いね。エアコン、つけてもいい？', ro: 'Arigatou. Chotto atsui ne. Eakon, tsukete mo ii?', vi: 'Cảm ơn. Hơi nóng nhỉ. Mình bật điều hoà được không?' },
        { who: 'マルコ', role: 'b', text: 'うん、いいよ。あ、その{写真|しゃしん}、{見|み}てもいい？', ro: 'Un, ii yo. A, sono shashin, mite mo ii?', vi: 'Ừ, được. À, mình xem tấm ảnh đó được không?' },
        { who: 'パク', role: 'a', text: 'うん、いいよ。{高校生|こうこうせい}のときの{写真|しゃしん}。', ro: 'Un, ii yo. Koukousei no toki no shashin.', vi: 'Ừ, được. Ảnh hồi mình học cấp ba.' },
        { who: 'マルコ', role: 'b', text: 'あ、もうすぐ{授業|じゅぎょう}だね。{電気|でんき}、{消|け}して。', ro: 'A, mou sugu jugyou da ne. Denki, keshite.', vi: 'À, sắp vào học rồi. Tắt đèn đi. (để chiếu slide)' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'よく{日本|にほん}のドラマ（を）{見|み}る？——うん、{見|み}る。／ううん、{見|み}ない。', ro: 'Yoku Nihon no dorama (o) miru? — Un, miru. / Uun, minai.', vi: 'Hay xem phim Nhật không? — Ừ, xem. / Không, không xem. — ポイント 103' },
        { en: '{毎日|まいにち}、{忙|いそが}しい？——うん、{忙|いそが}しい。／ううん、{忙|いそが}しくない。', ro: 'Mainichi, isogashii? — Un, isogashii. / Uun, isogashiku nai.', vi: 'Ngày nào cũng bận à? — Ừ, bận. / Không, không bận.' },
        { en: '{週末|しゅうまつ}、{何|なに}（を）した？——ふじまるランド（へ）{行|い}った。——どうだった？——{楽|たの}しかった。', ro: 'Shuumatsu, nani (o) shita? — Fujimaru rando (e) itta. — Dou datta? — Tanoshikatta.', vi: 'Cuối tuần làm gì? — Đi Fujimaru Land. — Thế nào? — Vui lắm.' },
        { en: '{週末|しゅうまつ}、{一緒|いっしょ}にご{飯|はん}（を）{食|た}べない？——いいね。／あ、ごめん、アルバイトだから。——そっか。じゃ、また{今度|こんど}。', ro: 'Shuumatsu, issho ni gohan (o) tabenai? — Ii ne. / A, gomen, arubaito da kara. — Sokka. Ja, mata kondo.', vi: 'Cuối tuần đi ăn cơm cùng không? — Hay đấy. / À, xin lỗi, vì phải đi làm thêm. — Thế à. Vậy để lần sau.' },
        { en: 'ララはどう？{高|たか}いけど、おいしいよ。', ro: 'Rara wa dou? Takai kedo, oishii yo.', vi: 'Quán Lala thì sao? Đắt nhưng ngon đấy. — けど = が (nhưng) khi nói thân mật.' },
        { en: '{消|け}しゴム（を）{貸|か}して。——うん、いいよ。', ro: 'Keshigomu (o) kashite. — Un, ii yo.', vi: 'Cho mượn cục tẩy. — Ừ, được. — Vて = Vてください thân mật.' },
        { en: '{写真|しゃしん}（を）{見|み}てもいい？——うん、いいよ。', ro: 'Shashin (o) mite mo ii? — Un, ii yo.', vi: 'Mình xem ảnh được không? — Ừ, được.' },
      ],
    },
    {
      t: 'note',
      title: 'Khi nào dùng 友達言葉, khi nào dùng です／ます?',
      items: [
        '**Thể thường (友達言葉)**: với **bạn bè cùng tuổi, bạn cùng lớp thân**, người trong gia đình, người nhỏ tuổi hơn.',
        '**Thể lịch sự (です／ます)**: với **thầy cô, giám thị, người lớn tuổi, người mới gặp, khách, nhân viên cửa hàng**. Ở quán nhậu mục ①, người mới quen vẫn nói です／ます.',
        '**Trong phòng thi JPD: luôn dùng です／ます.** Trả lời giám thị bằng うん／ううん hay 見る／見ない là **sai** — mất điểm thái độ.',
        'Hai người đang nói lịch sự có thể chuyển dần sang thể thường khi đã thân. Trong bài nghe cuối bài, パク và アンナ (bạn thân) nói thể thường với nhau, còn với 西川 (mới gặp) thì nói です／ます.',
      ],
    },

    /* ── 話読聞書 ── */
    { t: 'h', text: '④ Nói–Đọc–Nghe–Viết (話読聞書) — {今|いま}の{生活|せいかつ} (Cuộc sống bây giờ)' },
    {
      t: 'p',
      text: 'Bài đọc mẫu (viết mới, cùng kiểu với sách): ワン kể **sang Nhật khi nào**, **lúc đầu thế nào — bây giờ ra sao** (ポイント 100), **ngày thường / ngày nghỉ làm gì** (ポイント 98, 99), **làm thêm mấy lần một tuần**, và **sau này muốn làm gì**. Đọc to, rồi viết đoạn của bạn theo khung bên dưới.',
    },
    {
      t: 'passage',
      title: '{私|わたし}の{今|いま}の{生活|せいかつ}',
      paras: [
        { text: '{私|わたし}は{去年|きょねん}の{10月|じゅうがつ}に{日本|にほん}へ{来|き}ました。{初|はじ}めは{日本語|にほんご}がよくわかりませんでしたから、{少|すこ}し{寂|さび}しかったですが、{今|いま}は{日本|にほん}の{生活|せいかつ}に{慣|な}れました。{平日|へいじつ}は{朝|あさ}{9時|くじ}から{1時|いちじ}まで{学校|がっこう}で{勉強|べんきょう}しています。{授業|じゅぎょう}が{終|お}わってから、{図書館|としょかん}で{宿題|しゅくだい}をしたり、クラスメイトと{会話|かいわ}の{練習|れんしゅう}をしたりしています。{休|やす}みの{日|ひ}は、{友達|ともだち}と{買|か}い{物|もの}に{行|い}ったり、{近|ちか}くの{公園|こうえん}を{散歩|さんぽ}したりしています。{1週間|いっしゅうかん}に{3回|さんかい}、レストランでアルバイトをしています。{毎日|まいにち}{忙|いそが}しいですが、とても{楽|たの}しいです。これから、{日本|にほん}でもっといろいろなところへ{行|い}きたいです。' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{私|わたし}は{去年|きょねん}の{10月|じゅうがつ}に{日本|にほん}へ{来|き}ました。', ro: 'Watashi wa kyonen no juugatsu ni Nihon e kimashita.', vi: 'Tôi sang Nhật vào tháng 10 năm ngoái.' },
        { en: '{初|はじ}めは{少|すこ}し{寂|さび}しかったですが、{今|いま}は{日本|にほん}の{生活|せいかつ}に{慣|な}れました。', ro: 'Hajime wa sukoshi sabishikatta desu ga, ima wa Nihon no seikatsu ni naremashita.', vi: 'Lúc đầu hơi buồn, nhưng giờ tôi đã quen với cuộc sống ở Nhật. — ポイント 100' },
        { en: '{平日|へいじつ}は{学校|がっこう}で{勉強|べんきょう}しています。', ro: 'Heijitsu wa gakkou de benkyou shite imasu.', vi: 'Ngày thường tôi học ở trường. — ポイント 98 (việc đang làm trong giai đoạn này)' },
        { en: '{休|やす}みの{日|ひ}は、{友達|ともだち}と{買|か}い{物|もの}に{行|い}ったり、{公園|こうえん}を{散歩|さんぽ}したりしています。', ro: 'Yasumi no hi wa, tomodachi to kaimono ni ittari, kouen o sanpo shitari shite imasu.', vi: 'Ngày nghỉ tôi đi mua sắm với bạn, đi dạo công viên… — ポイント 99' },
        { en: '{1週間|いっしゅうかん}に{3回|さんかい}、アルバイトをしています。', ro: 'Isshuukan ni sankai, arubaito o shite imasu.', vi: 'Một tuần tôi làm thêm 3 lần. — ～に～回 (Bài 9) + ています' },
        { en: '{毎日|まいにち}{忙|いそが}しいですが、とても{楽|たの}しいです。', ro: 'Mainichi isogashii desu ga, totemo tanoshii desu.', vi: 'Ngày nào cũng bận nhưng rất vui.' },
        { en: 'これから、{日本|にほん}でもっといろいろなところへ{行|い}きたいです。', ro: 'Korekara, Nihon de motto iroiro na tokoro e ikitai desu.', vi: 'Từ giờ trở đi, tôi muốn đi nhiều nơi hơn nữa ở Nhật. — これから = từ bây giờ, sau này.' },
      ],
    },
    {
      t: 'note',
      title: 'Viết đoạn "Cuộc sống bây giờ của tôi" theo khung (trả lời 3 câu gợi ý của sách)',
      items: [
        '**Mở đầu** → {私|わたし}は ___{月|がつ}に ___ へ{来|き}ました。／___ {大学|だいがく}に{入学|にゅうがく}しました。',
        '**もう{日本|にほん}の{生活|せいかつ}に{慣|な}れましたか** → {初|はじ}めは ___ でしたが、{今|いま}は ___ に{慣|な}れました。',
        '**{今|いま}の{生活|せいかつ}は{楽|たの}しいですか** → {平日|へいじつ}は ___ ています。{毎日|まいにち} ___ ですが、___ です。',
        '**{休|やす}みの{日|ひ}に、よく{何|なに}をしますか** → {休|やす}みの{日|ひ}は ___ たり ___ たりしています。___ のとき、___ ます。',
        '**Câu kết:** これから、___ たいです。',
        'Người học ở Việt Nam: thay 日本 bằng ハノイ／ダナン…, "sang Nhật" bằng "vào ĐH FPT" (FPT{大学|だいがく}に{入学|にゅうがく}しました).',
      ],
    },

    /* ── できる！ ── */
    { t: 'h', text: 'できる！— Mời người Nhật đến lớp, hỏi về sinh hoạt hằng ngày' },
    {
      t: 'p',
      text: 'Nhiệm vụ 3 bước như sách: ① chia nhóm, **nghĩ câu hỏi** muốn hỏi sinh viên / học sinh Nhật → ② **nói chuyện** với người Nhật (lịch sự: です／ます — vì mới gặp) → ③ **báo cáo** trước lớp những gì đã nghe. Dưới đây là bộ câu hỏi mẫu dùng đủ ポイント của bài và câu báo cáo tương ứng.',
    },
    {
      t: 'table',
      caption: 'Bộ câu hỏi mẫu cho できる！',
      head: ['Muốn biết', 'Câu hỏi (lịch sự)', 'Báo cáo lại (ví dụ)'],
      rows: [
        ['Sáng ra làm gì', '{毎朝|まいあさ}、{何|なに}をしていますか。', '{山田|やまだ}さんは{毎朝|まいあさ}ジョギングをしています。'],
        ['Học xong làm gì', '{授業|じゅぎょう}が{終|お}わってから、いつも{何|なに}をしていますか。', 'アルバイトをしています。{1週間|いっしゅうかん}に{2回|にかい}です。'],
        ['Ngày nghỉ', '{休|やす}みの{日|ひ}、よく{何|なに}をしていますか。', '{映画|えいが}を{見|み}たり{友達|ともだち}と{遊|あそ}んだりしています。'],
        ['Khi rảnh / khi mệt', '{暇|ひま}なとき、{何|なに}をしますか。／{疲|つか}れたとき、どうしますか。', '{疲|つか}れたとき、{甘|あま}いものを{食|た}べます。'],
        ['Sống một mình?', '{一人|ひとり}{暮|ぐ}らしですか。', 'いいえ、{家族|かぞく}と{住|す}んでいます。'],
        ['Quá khứ', '{小学生|しょうがくせい}のとき、{何|なに}が{好|す}きでしたか。', '{小学生|しょうがくせい}のとき、ピアノが{好|す}きでした。'],
        ['Bắt đầu từ bao giờ', 'いつ{今|いま}の{趣味|しゅみ}を{始|はじ}めましたか。', '{中学生|ちゅうがくせい}のとき、ギターを{始|はじ}めました。'],
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */
/* Đủ 49 mục của trang ことば p.203: chủ đề 1 (26) = A 10 + B 4 + C 7 + D 5 ·
 * chủ đề 2 (13) = E 6 + F 7 · chủ đề 3 (10) = G 5 + H 5. */

const TU_VUNG: Lesson = {
  id: 'b11-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 49 từ của trang ことば Bài 11',
  goal: 'Thuộc đủ 49 từ của Bài 11 (sinh hoạt hằng ngày, chuyện ngày trước, lời nói với bạn bè) và dùng được mỗi từ trong một câu kể về cuộc sống của mình.',
  minutes: 40,
  blocks: [
    {
      t: 'p',
      text: 'Đủ **49 từ** trên trang ことば (p.203), giữ đúng 3 chủ đề của sách: **{今|いま}の{生活|せいかつ}** (26 từ — nhóm A–D), **{今|いま}の{私|わたし}・{前|まえ}の{私|わたし}** (13 từ — nhóm E, F), **{友達|ともだち}と** (10 từ — nhóm G, H). Từ Bài 8 cô không phát danh sách riêng nên đây là chuẩn. Số **1 / 2 / 3** sau động từ = nhóm động từ. Câu ví dụ chỉ dùng từ Bài 1–11. Cách học: bấm 🔊 → đọc to 3 lần → che nghĩa, tự nói.',
    },
    {
      t: 'note',
      title: 'Cách đọc romaji trong khoá',
      items: [
        'Trường âm viết theo đúng chữ kana: {生活|せいかつ} → **seikatsu**, {平日|へいじつ} → heijitsu, {毎週|まいしゅう} → **maishuu**, {小学生|しょうがくせい} → shougakusei, {中学生|ちゅうがくせい} → **chuugakusei**, {卒業|そつぎょう} → sotsugyou, {入学|にゅうがく} → nyuugaku, ニュース → **nyuusu**, ううん → **uun**.',
        'Âm ngắt っ viết đôi phụ âm: {日記|にっき} → **nikki**, {雑誌|ざっし} → zasshi, {引|ひ}っ{越|こ}し → **hikkoshi**, そっか → **sokka**.',
        'Biến âm khi ghép: {一人|ひとり} + {暮|く}らし → ひとり**ぐ**らし (hitorigurashi); {散歩|さんぽ} đọc **ぽ** (san**po**).',
        'Thể た mới của bài: {行|い}った → **itta**, {読|よ}んだ → yonda, {聞|き}いた → kiita, {来|き}た → kita, した → shita.',
      ],
    },

    { t: 'h', text: 'A. Cuộc sống hằng ngày (10 từ — chủ đề 1)' },
    {
      t: 'vocab',
      items: [
        { w: '{生活|せいかつ}', pos: 'danh từ', ipa: 'seikatsu', vi: 'cuộc sống, sinh hoạt (日本の生活 = cuộc sống ở Nhật)', ex: '{日本|にほん}の{生活|せいかつ}はどうですか。', exRo: 'Nihon no seikatsu wa dou desu ka.', exVi: 'Cuộc sống ở Nhật thế nào?' },
        { w: '{一人|ひとり}{暮|ぐ}らし', pos: 'danh từ', ipa: 'hitorigurashi', vi: 'sống một mình', ex: '{一人|ひとり}{暮|ぐ}らしは{楽|たの}しいですが、ときどき{寂|さび}しいです。', exRo: 'Hitorigurashi wa tanoshii desu ga, tokidoki sabishii desu.', exVi: 'Sống một mình thì vui, nhưng thỉnh thoảng thấy cô đơn.' },
        { w: '{平日|へいじつ}', pos: 'danh từ', ipa: 'heijitsu', vi: 'ngày thường (thứ Hai – thứ Sáu, ↔ 休みの日)', ex: '{平日|へいじつ}は{学校|がっこう}で{勉強|べんきょう}しています。', exRo: 'Heijitsu wa gakkou de benkyou shite imasu.', exVi: 'Ngày thường tôi học ở trường.' },
        { w: '{毎週|まいしゅう}', pos: 'danh từ', ipa: 'maishuu', vi: 'hằng tuần, mỗi tuần (không cần に)', ex: '{毎週|まいしゅう}{土曜日|どようび}、テニスをしています。', exRo: 'Maishuu doyoubi, tenisu o shite imasu.', exVi: 'Thứ Bảy hằng tuần tôi chơi tennis.' },
        { w: '{初|はじ}め', pos: 'danh từ', ipa: 'hajime', vi: 'lúc đầu, ban đầu (初めは～が、今は～ = lúc đầu … nhưng bây giờ …)', ex: '{初|はじ}めは{大変|たいへん}でしたが、{今|いま}は{楽|たの}しいです。', exRo: 'Hajime wa taihen deshita ga, ima wa tanoshii desu.', exVi: 'Lúc đầu vất vả, nhưng giờ thì vui.' },
        { w: '{店長|てんちょう}', pos: 'danh từ', ipa: 'tenchou', vi: 'cửa hàng trưởng, quản lý cửa hàng (店 cửa hàng + 長 trưởng)', ex: 'アルバイトを{休|やす}むとき、{店長|てんちょう}に{電話|でんわ}します。', exRo: 'Arubaito o yasumu toki, tenchou ni denwa shimasu.', exVi: 'Khi nghỉ làm thêm, tôi gọi điện cho cửa hàng trưởng.' },
        { w: 'クラスメイト', pos: 'danh từ', ipa: 'kurasumeito', vi: 'bạn cùng lớp', ex: '{週末|しゅうまつ}、クラスメイトと{図書館|としょかん}で{勉強|べんきょう}しています。', exRo: 'Shuumatsu, kurasumeito to toshokan de benkyou shite imasu.', exVi: 'Cuối tuần tôi học ở thư viện với bạn cùng lớp.' },
        { w: 'ジョギング', pos: 'danh từ', ipa: 'jogingu', vi: 'chạy bộ (ジョギングをします)', ex: '{毎朝|まいあさ}、{公園|こうえん}でジョギングをしています。', exRo: 'Maiasa, kouen de jogingu o shite imasu.', exVi: 'Sáng nào tôi cũng chạy bộ ở công viên.' },
        { w: '{雑誌|ざっし}', pos: 'danh từ', ipa: 'zasshi', vi: 'tạp chí', ex: '{暇|ひま}なとき、{雑誌|ざっし}を{読|よ}みます。', exRo: 'Hima na toki, zasshi o yomimasu.', exVi: 'Khi rảnh tôi đọc tạp chí.' },
        { w: '{日記|にっき}', pos: 'danh từ', ipa: 'nikki', vi: 'nhật ký (日記を書きます = viết nhật ký)', ex: '{毎晩|まいばん}、{日本語|にほんご}で{日記|にっき}を{書|か}いています。', exRo: 'Maiban, Nihongo de nikki o kaite imasu.', exVi: 'Tối nào tôi cũng viết nhật ký bằng tiếng Nhật.' },
      ],
    },

    { t: 'h', text: 'B. Học tiếng Nhật & cơ thể (4 từ — chủ đề 1)' },
    {
      t: 'vocab',
      items: [
        { w: '{会話|かいわ}', pos: 'danh từ', ipa: 'kaiwa', vi: 'hội thoại, nói chuyện (môn hội thoại)', ex: '{会話|かいわ}は{好|す}きですが、{作文|さくぶん}は{好|す}きじゃありません。', exRo: 'Kaiwa wa suki desu ga, sakubun wa suki ja arimasen.', exVi: 'Hội thoại thì thích, nhưng viết văn thì không thích. (câu của sách, ポイント 100)' },
        { w: '{作文|さくぶん}', pos: 'danh từ', ipa: 'sakubun', vi: 'bài viết, bài văn, viết văn (作文を書きます)', ex: '{明日|あした}までに{作文|さくぶん}を{書|か}いてください。', exRo: 'Ashita made ni sakubun o kaite kudasai.', exVi: 'Hãy viết bài văn trước ngày mai.' },
        { w: 'ひらがな', pos: 'danh từ', ipa: 'hiragana', vi: 'chữ hiragana', ex: '{日本|にほん}へ{来|く}るとき、ひらがなを{勉強|べんきょう}しました。', exRo: 'Nihon e kuru toki, hiragana o benkyou shimashita.', exVi: 'Trước khi sang Nhật, tôi đã học hiragana.' },
        { w: '{頭|あたま}', pos: 'danh từ', ipa: 'atama', vi: 'đầu (頭が痛いです = đau đầu)', ex: '{頭|あたま}が{痛|いた}いとき、{薬|くすり}を{飲|の}みます。', exRo: 'Atama ga itai toki, kusuri o nomimasu.', exVi: 'Khi đau đầu tôi uống thuốc. (ポイント 101, 102)' },
      ],
    },

    { t: 'h', text: 'C. Động từ sinh hoạt (7 từ — chủ đề 1)' },
    {
      t: 'vocab',
      items: [
        { w: '{終|お}わります［{終|お}わる］1', pos: 'động từ nhóm 1', ipa: 'owarimasu [owaru]', vi: 'kết thúc, xong (N が終わります — tự động từ)', ex: '{授業|じゅぎょう}は{何時|なんじ}に{終|お}わりますか。——{1時|いちじ}に{終|お}わります。', exRo: 'Jugyou wa nanji ni owarimasu ka. — Ichiji ni owarimasu.', exVi: 'Giờ học kết thúc lúc mấy giờ? — Lúc 1 giờ.' },
        { w: '{通|かよ}います［{通|かよ}う］1', pos: 'động từ nhóm 1', ipa: 'kayoimasu [kayou]', vi: 'đi lại đều đặn, theo học (nơi + に通います)', ex: '{毎週|まいしゅう}、{書道|しょどう}{教室|きょうしつ}に{通|かよ}っています。', exRo: 'Maishuu, shodou kyoushitsu ni kayotte imasu.', exVi: 'Hằng tuần tôi đi học lớp thư pháp.' },
        { w: 'ひきます［ひく］1', pos: 'động từ nhóm 1', ipa: 'hikimasu [hiku]', vi: 'bị (cảm): 風邪をひきます = bị cảm', ex: '{風邪|かぜ}をひいたとき、{早|はや}く{寝|ね}ます。', exRo: 'Kaze o hiita toki, hayaku nemasu.', exVi: 'Khi bị cảm tôi đi ngủ sớm.' },
        { w: '{休|やす}みます［{休|やす}む］1', pos: 'động từ nhóm 1', ipa: 'yasumimasu [yasumu]', vi: 'nghỉ (học, làm) — Nを休みます: 学校を休みます (nghỉ học)', ex: '{風邪|かぜ}をひきましたから、{学校|がっこう}を{休|やす}みます。', exRo: 'Kaze o hikimashita kara, gakkou o yasumimasu.', exVi: 'Vì bị cảm nên tôi nghỉ học. (ví dụ của sách: 学校を休みます)' },
        { w: '{慣|な}れます［{慣|な}れる］2', pos: 'động từ nhóm 2', ipa: 'naremasu [nareru]', vi: 'quen (với N: Nに慣れます)', ex: 'もう{日本|にほん}の{生活|せいかつ}に{慣|な}れましたか。', exRo: 'Mou Nihon no seikatsu ni naremashita ka.', exVi: 'Bạn đã quen với cuộc sống ở Nhật chưa?' },
        { w: '{忘|わす}れます［{忘|わす}れる］2', pos: 'động từ nhóm 2', ipa: 'wasuremasu [wasureru]', vi: 'quên (Nを忘れます)', ex: 'よく{漢字|かんじ}を{忘|わす}れます。', exRo: 'Yoku kanji o wasuremasu.', exVi: 'Tôi hay quên chữ Hán.' },
        { w: '{散歩|さんぽ}します［{散歩|さんぽ}する］3', pos: 'động từ nhóm 3', ipa: 'sanpo shimasu [sanpo suru]', vi: 'đi dạo (nơi + を散歩します: 公園を散歩します)', ex: '{天気|てんき}がいいとき、{公園|こうえん}を{散歩|さんぽ}します。', exRo: 'Tenki ga ii toki, kouen o sanpo shimasu.', exVi: 'Khi trời đẹp tôi đi dạo công viên.' },
      ],
    },

    { t: 'h', text: 'D. Cảm giác, phó từ & câu nói (5 từ — chủ đề 1)' },
    {
      t: 'vocab',
      items: [
        { w: '{寂|さび}しい', pos: 'tính từ đuôi い', ipa: 'sabishii', vi: 'buồn, cô đơn, trống trải (quá khứ: 寂しかったです)', ex: '{寂|さび}しいとき、{国|くに}の{家族|かぞく}に{電話|でんわ}します。', exRo: 'Sabishii toki, kuni no kazoku ni denwa shimasu.', exVi: 'Khi buồn, tôi gọi điện cho gia đình ở quê. (câu mẫu của sách, ポイント 101)' },
        { w: '{眠|ねむ}い', pos: 'tính từ đuôi い', ipa: 'nemui', vi: 'buồn ngủ', ex: '{眠|ねむ}いとき、コーヒーを{飲|の}みます。', exRo: 'Nemui toki, koohii o nomimasu.', exVi: 'Khi buồn ngủ tôi uống cà phê.' },
        { w: 'たいてい', pos: 'phó từ', ipa: 'taitei', vi: 'thường thì, hầu như (mức độ thường xuyên cao)', ex: '{休|やす}みの{日|ひ}は、たいていうちでゲームをしています。', exRo: 'Yasumi no hi wa, taitei uchi de geemu o shite imasu.', exVi: 'Ngày nghỉ tôi thường ở nhà chơi game.' },
        { w: 'なかなか', pos: 'phó từ', ipa: 'nakanaka', vi: '(+ phủ định) mãi mà không, khó mà — なかなか～ません', ex: '{夜|よる}、なかなか{寝|ね}ることができません。', exRo: 'Yoru, nakanaka neru koto ga dekimasen.', exVi: 'Buổi tối tôi mãi mà không ngủ được.' },
        { w: 'ええ', pos: 'thán từ', ipa: 'ee', vi: 'vâng, ừ (mềm hơn はい, dùng khi nói chuyện)', ex: '{日本|にほん}の{生活|せいかつ}に{慣|な}れましたか。——ええ。', exRo: 'Nihon no seikatsu ni naremashita ka. — Ee.', exVi: 'Quen cuộc sống ở Nhật chưa? — Vâng.' },
      ],
    },

    { t: 'h', text: 'E. Tôi ngày trước — danh từ (6 từ — chủ đề 2)' },
    {
      t: 'vocab',
      items: [
        { w: '{小学生|しょうがくせい}', pos: 'danh từ', ipa: 'shougakusei', vi: 'học sinh tiểu học (小学生のとき = hồi tiểu học)', ex: '{小学生|しょうがくせい}のとき、{水泳|すいえい}を{始|はじ}めました。', exRo: 'Shougakusei no toki, suiei o hajimemashita.', exVi: 'Hồi tiểu học tôi bắt đầu học bơi.' },
        { w: '{中学生|ちゅうがくせい}', pos: 'danh từ', ipa: 'chuugakusei', vi: 'học sinh trung học cơ sở (cấp hai)', ex: '{中学生|ちゅうがくせい}のとき、ギターを{始|はじ}めました。', exRo: 'Chuugakusei no toki, gitaa o hajimemashita.', exVi: 'Hồi cấp hai tôi bắt đầu chơi guitar. (câu mẫu của sách)' },
        { w: 'オリンピック', pos: 'danh từ', ipa: 'orinpikku', vi: 'Thế vận hội Olympic', ex: 'テレビでオリンピックを{見|み}ました。', exRo: 'Terebi de orinpikku o mimashita.', exVi: 'Tôi đã xem Olympic trên TV.' },
        { w: '{選手|せんしゅ}', pos: 'danh từ', ipa: 'senshu', vi: 'tuyển thủ, vận động viên, cầu thủ (水泳選手 = VĐV bơi)', ex: '{水泳|すいえい}{選手|せんしゅ}がかっこよかったです。', exRo: 'Suiei senshu ga kakkoyokatta desu.', exVi: 'Các vận động viên bơi rất ngầu.' },
        { w: '{外国|がいこく}', pos: 'danh từ', ipa: 'gaikoku', vi: 'nước ngoài (外国人 = người nước ngoài)', ex: '{大学生|だいがくせい}のとき、{初|はじ}めて{外国|がいこく}へ{行|い}きました。', exRo: 'Daigakusei no toki, hajimete gaikoku e ikimashita.', exVi: 'Hồi sinh viên, lần đầu tiên tôi đi nước ngoài.' },
        { w: '{祖父|そふ}', pos: 'danh từ', ipa: 'sofu', vi: 'ông (của mình — nói với người ngoài); ông của người khác = おじいさん', ex: 'この{時計|とけい}は{祖父|そふ}にもらいました。', exRo: 'Kono tokei wa sofu ni moraimashita.', exVi: 'Chiếc đồng hồ này tôi được ông tặng.' },
      ],
    },

    { t: 'h', text: 'F. Tôi ngày trước — động từ & phó từ (7 từ — chủ đề 2)' },
    {
      t: 'vocab',
      items: [
        { w: '{始|はじ}めます［{始|はじ}める］2', pos: 'động từ nhóm 2', ipa: 'hajimemasu [hajimeru]', vi: 'bắt đầu (Nを始めます — tha động từ; 始まります = N tự bắt đầu)', ex: 'いつテニスを{始|はじ}めましたか。', exRo: 'Itsu tenisu o hajimemashita ka.', exVi: 'Bạn bắt đầu chơi tennis khi nào?' },
        { w: '{別|わか}れます［{別|わか}れる］2', pos: 'động từ nhóm 2', ipa: 'wakaremasu [wakareru]', vi: 'chia tay, chia li (người + と別れます)', ex: '{国|くに}へ{帰|かえ}るとき、{友達|ともだち}と{別|わか}れました。', exRo: 'Kuni e kaeru toki, tomodachi to wakaremashita.', exVi: 'Lúc về nước tôi đã chia tay các bạn.' },
        { w: '{卒業|そつぎょう}します［{卒業|そつぎょう}する］3', pos: 'động từ nhóm 3', ipa: 'sotsugyou shimasu [sotsugyou suru]', vi: 'tốt nghiệp (trường + を卒業します)', ex: '{高校|こうこう}を{卒業|そつぎょう}したとき、{母|はは}に{時計|とけい}をもらいました。', exRo: 'Koukou o sotsugyou shita toki, haha ni tokei o moraimashita.', exVi: 'Khi tốt nghiệp cấp ba, tôi được mẹ tặng đồng hồ.' },
        { w: '{入学|にゅうがく}します［{入学|にゅうがく}する］3', pos: 'động từ nhóm 3', ipa: 'nyuugaku shimasu [nyuugaku suru]', vi: 'nhập học, vào trường (trường + に入学します)', ex: '{大学|だいがく}に{入学|にゅうがく}したとき、{祖父|そふ}がパソコンをくれました。', exRo: 'Daigaku ni nyuugaku shita toki, sofu ga pasokon o kuremashita.', exVi: 'Khi tôi vào đại học, ông tặng tôi máy tính.' },
        { w: 'だんだん', pos: 'phó từ', ipa: 'dandan', vi: 'dần dần (hay đi với なります)', ex: '{初|はじ}めは{難|むずか}しかったですが、だんだんおもしろくなりました。', exRo: 'Hajime wa muzukashikatta desu ga, dandan omoshiroku narimashita.', exVi: 'Lúc đầu khó, nhưng dần dần trở nên thú vị.' },
        { w: '{初|はじ}めて', pos: 'phó từ', ipa: 'hajimete', vi: 'lần đầu tiên (khác 初め = lúc đầu)', ex: '{去年|きょねん}、{初|はじ}めて{富士山|ふじさん}に{登|のぼ}りました。', exRo: 'Kyonen, hajimete Fujisan ni noborimashita.', exVi: 'Năm ngoái lần đầu tiên tôi leo núi Phú Sĩ. (登ります — Bài 5)' },
        { w: 'それで', pos: 'liên từ', ipa: 'sorede', vi: 'vì thế, cho nên (nối câu nguyên nhân → câu kết quả)', ex: 'サッカーが{好|す}きになりました。それで、{始|はじ}めました。', exRo: 'Sakkaa ga suki ni narimashita. Sorede, hajimemashita.', exVi: 'Tôi thích bóng đá. Vì thế tôi bắt đầu chơi.' },
      ],
    },

    { t: 'h', text: 'G. Trong lớp, với bạn — danh từ & động từ (5 từ — chủ đề 3)' },
    {
      t: 'vocab',
      items: [
        { w: 'エアコン', pos: 'danh từ', ipa: 'eakon', vi: 'máy điều hoà (air conditioner)', ex: '{暑|あつ}いね。エアコン、つけてもいい？', exRo: 'Atsui ne. Eakon, tsukete mo ii?', exVi: 'Nóng nhỉ. Mình bật điều hoà được không? (thể thường)' },
        { w: 'ニュース', pos: 'danh từ', ipa: 'nyuusu', vi: 'tin tức, bản tin', ex: '{毎日|まいにち}、ニュースを{見|み}ますか。', exRo: 'Mainichi, nyuusu o mimasu ka.', exVi: 'Ngày nào bạn cũng xem thời sự không?' },
        { w: '{消|け}します［{消|け}す］1', pos: 'động từ nhóm 1', ipa: 'keshimasu [kesu]', vi: 'tắt (đèn, điều hoà, TV); xoá (消しゴム = cục tẩy)', ex: '{寝|ね}るとき、{電気|でんき}を{消|け}します。', exRo: 'Neru toki, denki o keshimasu.', exVi: 'Khi đi ngủ tôi tắt đèn.' },
        { w: 'つけます［つける］2', pos: 'động từ nhóm 2', ipa: 'tsukemasu [tsukeru]', vi: 'bật (đèn, điều hoà, TV) ↔ 消します', ex: 'ちょっと{寒|さむ}いですから、エアコンをつけてください。', exRo: 'Chotto samui desu kara, eakon o tsukete kudasai.', exVi: 'Hơi lạnh nên hãy bật điều hoà (chế độ sưởi).' },
        { w: '{引|ひ}っ{越|こ}しします［{引|ひ}っ{越|こ}しする］3', pos: 'động từ nhóm 3', ipa: 'hikkoshi shimasu [hikkoshi suru]', vi: 'chuyển nhà (引っ越し = việc chuyển nhà)', ex: '{週末|しゅうまつ}は{引|ひ}っ{越|こ}しです。{忙|いそが}しいです。', exRo: 'Shuumatsu wa hikkoshi desu. Isogashii desu.', exVi: 'Cuối tuần tôi chuyển nhà. Bận lắm.' },
      ],
    },

    { t: 'h', text: 'H. Lời nói với bạn bè (5 từ — chủ đề 3)' },
    {
      t: 'vocab',
      items: [
        { w: 'うん', pos: 'thán từ (thân mật)', ipa: 'un', vi: 'ừ, có (= はい khi nói với bạn)', ex: 'よくカラオケに{行|い}く？——うん、{行|い}く。', exRo: 'Yoku karaoke ni iku? — Un, iku.', exVi: 'Hay đi karaoke không? — Ừ, có đi.' },
        { w: 'ううん', pos: 'thán từ (thân mật)', ipa: 'uun', vi: 'không (= いいえ khi nói với bạn; giọng xuống–lên–xuống)', ex: 'お{酒|さけ}、{飲|の}む？——ううん、{飲|の}まない。', exRo: 'Osake, nomu? — Uun, nomanai.', exVi: 'Uống rượu không? — Không, mình không uống.' },
        { w: 'ごめん', pos: 'câu nói (thân mật)', ipa: 'gomen', vi: 'xin lỗi (= すみません／ごめんなさい khi nói với bạn)', ex: 'あ、ごめん。{土曜日|どようび}はアルバイトだから。', exRo: 'A, gomen. Doyoubi wa arubaito da kara.', exVi: 'À, xin lỗi. Vì thứ Bảy mình đi làm thêm.' },
        { w: 'そっか', pos: 'câu nói (thân mật)', ipa: 'sokka', vi: 'thế à, vậy à (= そうですか khi nói với bạn)', ex: 'そっか。じゃ、また{今度|こんど}。', exRo: 'Sokka. Ja, mata kondo.', exVi: 'Thế à. Vậy để lần sau.' },
        { w: 'また', pos: 'phó từ', ipa: 'mata', vi: 'lại, lần nữa (また今度 = để lần sau; また明日 = mai gặp lại)', ex: 'じゃ、また{明日|あした}。', exRo: 'Ja, mata ashita.', exVi: 'Vậy mai gặp lại nhé.' },
      ],
    },
    {
      t: 'table',
      caption: 'Lịch sự ↔ thân mật — các câu nói ngắn của chủ đề 3',
      head: ['Nói với thầy cô, người lạ (丁寧)', 'Nói với bạn (友達言葉)', 'Nghĩa'],
      rows: [
        ['はい', 'うん', 'Vâng / ừ'],
        ['いいえ', 'ううん', 'Không'],
        ['すみません', 'ごめん', 'Xin lỗi'],
        ['そうですか', 'そっか／そう', 'Vậy à'],
        ['いいですね', 'いいね', 'Hay đấy'],
        ['いいですよ', 'いいよ', 'Được thôi'],
        ['ありがとうございます', 'ありがとう', 'Cảm ơn'],
        ['じゃ、また{今度|こんど}。', 'じゃ、また{今度|こんど}。', 'Vậy để lần sau (dùng được cả hai)'],
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp trong từ bài 11',
      items: [
        '**{初|はじ}め ↔ {初|はじ}めて**: 初め (danh từ) = **lúc đầu** — 初め**は**大変でした; 初めて (phó từ) = **lần đầu tiên** — 初めて日本へ来ました. Đừng nói ~~初めて大変でしたが、今は…~~.',
        '**{始|はじ}めます ↔ {始|はじ}まります**: 始めます = **ai đó bắt đầu** việc gì (**を**): サッカー**を**始めました; 始まります = **việc tự bắt đầu** (**が**): 授業**が**始まります (Bài 3). Tương tự **{終|お}わります** là tự động từ: 授業**が**終わります.',
        '**つけます ↔ {消|け}します** (bật ↔ tắt, **を**). Đừng lẫn với {消|け}しゴム (cục tẩy, Bài 2) — cùng chữ 消 "xoá".',
        '**{休|やす}みます** Bài 11 có trợ từ **を**: {学校|がっこう}**を**休みます (nghỉ học), アルバイト**を**休みます. Bài 10 "nghỉ chân": ベンチ**で**休みます.',
        '**{通|かよ}います** = đi đều đặn tới một nơi trong thời gian dài (trường, lớp, phòng gym) → nơi + **に**, thường dùng **～ています**: 学校**に**通っています. Đi một lần thì dùng 行きます.',
        '**なかなか** chỉ đi với **phủ định** ở trình độ này: なかなか寝ることができ**ません** (mãi không ngủ được). ~~なかなか寝ます~~ sai nghĩa.',
        '**{祖父|そふ}** là "ông **của tôi**" khi nói với người ngoài; ông của bạn → おじいさん (giống {父|ちち}／お{父|とう}さん Bài 8).',
        '**うん／ううん** chỉ nói với bạn bè. **Không bao giờ** trả lời giám thị bằng うん.',
      ],
    },

    { t: 'h', text: 'Từ thêm (sách có ở bài đọc, bài nghe, ポイント, 言ってみよう — chỉ cần nghe hiểu)' },
    {
      t: 'table',
      head: ['Từ / câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['{居酒屋|いざかや}', 'izakaya', 'Quán nhậu kiểu Nhật (tình huống chủ đề 1, 2)'],
        ['{交流会|こうりゅうかい}', 'kouryuukai', 'Buổi giao lưu'],
        ['{知|し}り{合|あ}い', 'shiriai', 'Người quen (知り合った人 = người đã quen)'],
        ['{乾杯|かんぱい}', 'kanpai', 'Cạn ly! (chân bài nghe)'],
        ['お{待|ま}たせ（しました）', 'omatase (shimashita)', 'Xin lỗi đã để bạn chờ (chân bài nghe)'],
        ['ワールドカップ', 'waarudo kappu', 'World Cup (chân bài nghe)'],
        ['{注文|ちゅうもん}', 'chuumon', 'Gọi món, đặt hàng (注文お願いします)'],
        ['{生|なま}ビール', 'nama biiru', 'Bia tươi (bảng trong quán)'],
        ['これから', 'korekara', 'Từ bây giờ, sau này (chân bài đọc)'],
        ['{年表|ねんぴょう}', 'nenpyou', 'Niên biểu, bảng mốc thời gian (やってみよう chủ đề 2)'],
        ['{高校生|こうこうせい}／{大学生|だいがくせい}', 'koukousei / daigakusei', 'Học sinh cấp ba / sinh viên (Bài 8)'],
        ['{電子辞書|でんしじしょ}', 'denshi jisho', 'Từ điển điện tử'],
        ['{消|け}しゴム', 'keshigomu', 'Cục tẩy'],
        ['{食|た}べ{放題|ほうだい}', 'tabehoudai', 'Ăn thả ga, buffet (スイーツ食べ放題 = buffet đồ ngọt)'],
        ['スイーツ', 'suiitsu', 'Đồ ngọt, bánh ngọt'],
        ['{用事|ようじ}', 'youji', 'Việc bận (用事があります — Bài 6)'],
        ['{牛乳|ぎゅうにゅう}', 'gyuunyuu', 'Sữa bò (câu mẫu ポイント 98)'],
        ['{甘|あま}いもの', 'amai mono', 'Đồ ngọt (câu mẫu ポイント 102)'],
        ['{猫|ねこ}', 'neko', 'Con mèo (câu mẫu ポイント 100)'],
        ['{帽子|ぼうし}', 'boushi', 'Cái mũ (câu mẫu ポイント 101)'],
        ['けど', 'kedo', 'Nhưng (= が, khi nói thân mật — ポイント 103)'],
        ['{店員|てんいん}', 'ten-in', 'Nhân viên cửa hàng / quán'],
        ['チラシ', 'chirashi', 'Tờ rơi quảng cáo (bài nghe)'],
        ['お{邪魔|じゃま}します', 'ojama shimasu', 'Xin phép (vào nhà người khác) — đóng vai p.201'],
        ['レポート', 'repooto', 'Bài báo cáo (言ってみよう 2 ③)'],
        ['ハンバーガー', 'hanbaagaa', 'Bánh hamburger (ảnh p.185)'],
        ['ラジオ', 'rajio', 'Radio (言ってみよう 1-2 ②)'],
        ['SNS', 'esu enu esu', 'Mạng xã hội (bài đọc to)'],
        ['{空港|くうこう}', 'kuukou', 'Sân bay (ví dụ 来るとき／来たとき ở ポイント 101)'],
        ['おなかすいたー', 'onaka suitaa', 'Đói quá! (thể thường của おなかがすきました)'],
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b11-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp — ポイント 98–103: ています (thói quen), たり～たり, N1は～が N2は, とき, どうしますか, 友達言葉 (thể thường)',
  goal: 'Chia được thể た và thể thường (普通形) của mọi động từ, tính từ, danh từ đã học; kể thói quen, liệt kê việc làm, đối chiếu hai thứ, nói "khi …", hỏi "khi … thì làm sao", và nói chuyện với bạn bằng thể thường.',
  minutes: 100,
  blocks: [
    {
      t: 'p',
      text: 'Bài 11 có **6 điểm ngữ pháp** (ポイント 98–103) và **hai thứ phải chia mới**: **thể た** (タ形, 表 p.283) và **thể thường** (普通形, 表 p.284). Ba chủ đề của sách dùng chúng như sau: **{今|いま}の{生活|せいかつ}** 98, 99, 100, 101, 102 · **{今|いま}の{私|わたし}・{前|まえ}の{私|わたし}** 101 · **{友達|ともだち}と** 103. Học theo thứ tự: thể た → 98 → 99 → 100 → 101 → 102 → bảng thể thường → 103.',
    },
    {
      t: 'table',
      caption: 'Bản đồ 6 điểm ngữ pháp + 2 hình thái mới',
      head: ['ポイント', 'Mẫu', 'Nghĩa', 'Ví dụ ngắn'],
      rows: [
        ['—', 'Thể た (タ形)', 'Dạng quá khứ thể thường', '{飲|の}みました → {飲|の}んだ'],
        ['98', 'Vテ形 います', 'Thường (làm), đang (làm) trong giai đoạn này', '{毎朝|まいあさ}、{牛乳|ぎゅうにゅう}を{飲|の}んでいます。'],
        ['99', 'Vた形り Vた形り します', 'Làm nào là … nào là … (liệt kê vài việc)', '{本|ほん}を{読|よ}んだり{音楽|おんがく}を{聞|き}いたりします。'],
        ['100', 'N1は ___が、N2は ___', 'N1 thì …, còn N2 thì … (đối chiếu)', '{犬|いぬ}は{好|す}きですが、{猫|ねこ}は{好|す}きじゃありません。'],
        ['101', '［イA／ナAな／Nの／V{辞書形|じしょけい}／Vた／Vない］とき、___', 'Khi …, …', '{暇|ひま}なとき、テレビを{見|み}ます。'],
        ['102', '～とき、どうしますか', 'Khi … thì bạn làm thế nào?', '{疲|つか}れたとき、どうしますか。'],
        ['—', 'Thể thường (普通形)', 'Dạng không です／ます', '{行|い}きません → {行|い}かない'],
        ['103', '{友達|ともだち}{言葉|ことば}', 'Nói với bạn bằng thể thường', '{海|うみ}{行|い}く？——うん、{行|い}く。'],
      ],
    },

    /* ── Thể た ── */
    { t: 'h', text: 'Trước tiên — Thể た (タ形): cách chia' },
    {
      t: 'p',
      text: 'Thể た là **dạng quá khứ thể thường** của động từ ({食|た}べた = đã ăn). Bài 11 cần nó ở **～たり～たり** (ポイント 99), **Vたとき** (ポイント 101) và khi nói với bạn (ポイント 103). Cách chia **rất dễ nếu bạn thuộc thể て** (Bài 7): **đổi て → た, で → だ**. Không có ngoại lệ nào khác ngoài những ngoại lệ đã có của thể て.',
    },
    {
      t: 'table',
      caption: 'Quy tắc: thể て → thể た',
      head: ['Thể て', 'Thể た', 'Ví dụ'],
      rows: [
        ['～て', '～**た**', '{書|か}いて → {書|か}い**た** · {待|ま}って → {待|ま}っ**た** · {話|はな}して → {話|はな}し**た** · {食|た}べて → {食|た}べ**た**'],
        ['～で', '～**だ**', '{泳|およ}いで → {泳|およ}い**だ** · {飲|の}んで → {飲|の}ん**だ** · {遊|あそ}んで → {遊|あそ}ん**だ**'],
        ['Ngoại lệ (giống thể て)', '{行|い}って → **{行|い}った**', 'Không phải ~~行いた~~ (giống 行って, không phải ~~行いて~~).'],
        ['Nhóm 3', 'して → **した** · {来|き}て → **{来|き}た**', '来た đọc **きた** (khác 来ない こない).'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng ナイ形・タ形 (表 p.283) — động từ mẫu của sách',
      head: ['Nhóm', 'Thể ます', 'Thể て', 'Thể た', 'Romaji', 'Thể ない'],
      rows: [
        ['1', '{聞|き}きます', '{聞|き}いて', '{聞|き}いた', 'kiita', '{聞|き}かない'],
        ['1', '{泳|およ}ぎます', '{泳|およ}いで', '{泳|およ}いだ', 'oyoida', '{泳|およ}がない'],
        ['1', '{話|はな}します', '{話|はな}して', '{話|はな}した', 'hanashita', '{話|はな}さない'],
        ['1', '{持|も}ちます', '{持|も}って', '{持|も}った', 'motta', '{持|も}たない'],
        ['1', '{死|し}にます', '{死|し}んで', '{死|し}んだ', 'shinda', '{死|し}なない'],
        ['1', '{遊|あそ}びます', '{遊|あそ}んで', '{遊|あそ}んだ', 'asonda', '{遊|あそ}ばない'],
        ['1', '{飲|の}みます', '{飲|の}んで', '{飲|の}んだ', 'nonda', '{飲|の}まない'],
        ['1', '{帰|かえ}ります', '{帰|かえ}って', '{帰|かえ}った', 'kaetta', '{帰|かえ}らない'],
        ['1', '{使|つか}います', '{使|つか}って', '{使|つか}った', 'tsukatta', '{使|つか}わない'],
        ['1', '{行|い}きます', '※{行|い}って', '※{行|い}った', 'itta', '{行|い}かない'],
        ['2', '{食|た}べます', '{食|た}べて', '{食|た}べた', 'tabeta', '{食|た}べない'],
        ['2', '{起|お}きます', '{起|お}きて', '{起|お}きた', 'okita', '{起|お}きない'],
        ['3', 'します', 'して', 'した', 'shita', 'しない'],
        ['3', '{来|き}ます', '{来|き}て', '{来|き}た', 'kita', '{来|こ}ない'],
      ],
    },
    {
      t: 'table',
      caption: 'Động từ của Bài 11 — ます → て → た → ない (học một lượt cả bốn)',
      head: ['Thể ます', 'Nhóm', 'Thể て', 'Thể た', 'Thể ない', 'Nghĩa'],
      rows: [
        ['{終|お}わります', '1', '{終|お}わって', '{終|お}わった', '{終|お}わらない', 'kết thúc'],
        ['{通|かよ}います', '1', '{通|かよ}って', '{通|かよ}った', '{通|かよ}わない', 'đi (học) đều'],
        ['ひきます', '1', 'ひいて', 'ひいた', 'ひかない', 'bị (cảm)'],
        ['{休|やす}みます', '1', '{休|やす}んで', '{休|やす}んだ', '{休|やす}まない', 'nghỉ'],
        ['{消|け}します', '1', '{消|け}して', '{消|け}した', '{消|け}さない', 'tắt'],
        ['{慣|な}れます', '2', '{慣|な}れて', '{慣|な}れた', '{慣|な}れない', 'quen'],
        ['{忘|わす}れます', '2', '{忘|わす}れて', '{忘|わす}れた', '{忘|わす}れない', 'quên'],
        ['{始|はじ}めます', '2', '{始|はじ}めて', '{始|はじ}めた', '{始|はじ}めない', 'bắt đầu'],
        ['{別|わか}れます', '2', '{別|わか}れて', '{別|わか}れた', '{別|わか}れない', 'chia tay'],
        ['つけます', '2', 'つけて', 'つけた', 'つけない', 'bật'],
        ['{散歩|さんぽ}します', '3', '{散歩|さんぽ}して', '{散歩|さんぽ}した', '{散歩|さんぽ}しない', 'đi dạo'],
        ['{卒業|そつぎょう}します', '3', '{卒業|そつぎょう}して', '{卒業|そつぎょう}した', '{卒業|そつぎょう}しない', 'tốt nghiệp'],
        ['{入学|にゅうがく}します', '3', '{入学|にゅうがく}して', '{入学|にゅうがく}した', '{入学|にゅうがく}しない', 'nhập học'],
        ['{引|ひ}っ{越|こ}しします', '3', '{引|ひ}っ{越|こ}しして', '{引|ひ}っ{越|こ}しした', '{引|ひ}っ{越|こ}ししない', 'chuyển nhà'],
        ['{読|よ}みます (B3)', '1', '{読|よ}んで', '{読|よ}んだ', '{読|よ}まない', 'đọc'],
        ['{描|か}きます (B7)', '1', '{描|か}いて', '{描|か}いた', '{描|か}かない', 'vẽ'],
        ['{会|あ}います (B6)', '1', '{会|あ}って', '{会|あ}った', '{会|あ}わない', 'gặp'],
        ['{見|み}ます (B3)', '2', '{見|み}て', '{見|み}た', '{見|み}ない', 'xem'],
        ['{寝|ね}ます (B3)', '2', '{寝|ね}て', '{寝|ね}た', '{寝|ね}ない', 'ngủ'],
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp khi chia thể た',
      items: [
        '**{行|い}きます → {行|い}った** (không phải ~~行いた~~). Đây là ngoại lệ duy nhất của nhóm 1 — giống 行って.',
        '**{来|き}ます → {来|き}た** đọc **きた**, còn **{来|こ}ない** đọc こない, **{来|く}る** đọc くる. Một chữ 来, ba cách đọc: き・こ・く.',
        '**Âm ngắt っ**: {待|ま}**っ**た, {帰|かえ}**っ**た, {使|つか}**っ**た — đọc có ngắt nhịp (matta, kaetta, tsukatta). Viết thiếu っ là sai chữ.',
        '**で → だ** chứ không phải ~~でた~~: {飲|の}んで → {飲|の}ん**だ**, {泳|およ}いで → {泳|およ}い**だ**.',
        'Mẹo tự kiểm: đọc thể て của từ đó trước (đã thuộc từ Bài 7), rồi chỉ đổi đúng một âm cuối.',
      ],
    },

    /* ── ポイント 98 ── */
    { t: 'h', text: 'ポイント 98 — Vテ形 います (thói quen · việc đang làm trong giai đoạn này)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（{毎朝|まいあさ}／いつも／{毎週|まいしゅう}…）N を Vて います。',
          vi: 'Nói **thói quen lặp đi lặp lại** (sáng nào cũng…, hằng tuần…) hoặc **việc mình đang làm trong một giai đoạn** của cuộc sống (đang làm thêm ở…, đang theo học lớp…). Bài 7 ～ています là "đang làm ngay lúc này"; Bài 11 là "dạo này / thời gian này vẫn thường làm".',
          examples: [
            { en: '{毎朝|まいあさ}、{牛乳|ぎゅうにゅう}を{飲|の}んでいます。', ro: 'Maiasa, gyuunyuu o nonde imasu.', vi: 'Sáng nào tôi cũng uống sữa. (câu mẫu của sách)' },
            { en: '{毎朝|まいあさ}、{公園|こうえん}でジョギングをしています。', ro: 'Maiasa, kouen de jogingu o shite imasu.', vi: 'Sáng nào tôi cũng chạy bộ ở công viên.' },
            { en: 'レストランでアルバイトをしています。', ro: 'Resutoran de arubaito o shite imasu.', vi: 'Tôi đang làm thêm ở nhà hàng. (công việc của giai đoạn này)' },
            { en: '{毎週|まいしゅう}{土曜日|どようび}、{書道|しょどう}{教室|きょうしつ}に{通|かよ}っています。', ro: 'Maishuu doyoubi, shodou kyoushitsu ni kayotte imasu.', vi: 'Thứ Bảy hằng tuần tôi đi học lớp thư pháp.' },
            { en: '{毎晩|まいばん}、{日本語|にほんご}で{日記|にっき}を{書|か}いています。', ro: 'Maiban, Nihongo de nikki o kaite imasu.', vi: 'Tối nào tôi cũng viết nhật ký bằng tiếng Nhật.' },
          ],
        },
        {
          formula: 'Hỏi: いつも／よく {何|なに}をしていますか。',
          vi: 'Hỏi thói quen, sinh hoạt: **いつも** (luôn luôn, thường), **よく** (hay), **{平日|へいじつ}は**, **{休|やす}みの{日|ひ}は**. Trả lời bằng **～ています**; kể tần suất thì thêm ～に～回 (Bài 9).',
          examples: [
            { en: 'A：{授業|じゅぎょう}が{終|お}わってから、いつも{何|なに}をしていますか。B：アルバイトをしています。', ro: 'A: Jugyou ga owatte kara, itsumo nani o shite imasu ka. B: Arubaito o shite imasu.', vi: 'A: Học xong bạn thường làm gì? B: Tôi đi làm thêm. (～てから — Bài 12, chỉ cần nghe hiểu)' },
            { en: 'A：{毎朝|まいあさ}、{何|なに}を{食|た}べていますか。B：パンを{食|た}べています。', ro: 'A: Maiasa, nani o tabete imasu ka. B: Pan o tabete imasu.', vi: 'A: Sáng nào bạn ăn gì? B: Tôi ăn bánh mì.' },
            { en: 'A：{毎日|まいにち}、ニュースを{見|み}ていますか。B：いいえ、あまり{見|み}ていません。', ro: 'A: Mainichi, nyuusu o mite imasu ka. B: Iie, amari mite imasen.', vi: 'A: Ngày nào bạn cũng xem thời sự à? B: Không, tôi không xem mấy.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: '～ています đến Bài 11 có 4 nghĩa — phân biệt nhờ ngữ cảnh',
      head: ['Bài', 'Nghĩa', 'Ví dụ', 'Dấu hiệu'],
      rows: [
        ['7', 'Đang làm **ngay lúc này**', '{今|いま}、{昼|ひる}ご{飯|はん}を{食|た}べています。', '{今|いま}'],
        ['8', '**Trạng thái** kéo dài (kết quả)', '{東京|とうきょう}に{住|す}んでいます。／{結婚|けっこん}しています。', '住む, 結婚する, 働く…'],
        ['10', 'Nhìn kìa, N **đang** V', 'サルがバナナを{食|た}べています。', 'あっ、{見|み}てください'],
        ['11', '**Thói quen / việc của giai đoạn này**', '{毎朝|まいあさ}、{牛乳|ぎゅうにゅう}を{飲|の}んでいます。', '{毎朝|まいあさ}, いつも, {毎週|まいしゅう}, {最近|さいきん}'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — (khi nào) ___ を ___ ています',
      head: ['Khi nào', 'Việc', 'Câu hoàn chỉnh'],
      rows: [
        ['{毎朝|まいあさ}', 'ジョギングをします', '{毎朝|まいあさ}、ジョギングをしています。'],
        ['{毎晩|まいばん}', '{日記|にっき}を{書|か}きます', '{毎晩|まいばん}、{日記|にっき}を{書|か}いています。'],
        ['{毎週|まいしゅう}{日曜日|にちようび}', 'サッカーの{試合|しあい}をします', '{毎週|まいしゅう}{日曜日|にちようび}、サッカーの{試合|しあい}をしています。'],
        ['{平日|へいじつ}', '{学校|がっこう}に{通|かよ}います', '{平日|へいじつ}は{学校|がっこう}に{通|かよ}っています。'],
        ['{1週間|いっしゅうかん}に{2回|にかい}', 'プールで{泳|およ}ぎます', '{1週間|いっしゅうかん}に{2回|にかい}、プールで{泳|およ}いでいます。'],
        ['{最近|さいきん}', '{毎日|まいにち}{雑誌|ざっし}を{読|よ}みます', '{最近|さいきん}、{毎日|まいにち}{雑誌|ざっし}を{読|よ}んでいます。'],
        ['いつも', 'コンビニでアルバイトをします', 'いつもコンビニでアルバイトをしています。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — ています (thói quen)',
      items: [
        'Chia sai thể て: {飲|の}みます → **{飲|の}んで**います (không ~~飲みています~~); {通|かよ}います → **{通|かよ}って**います.',
        '"Sáng nào tôi cũng ăn cơm" nói **{毎朝|まいあさ}ご{飯|はん}を{食|た}べます** cũng đúng (thói quen, thể ます). **～ています** nhấn mạnh "dạo này / giai đoạn này vẫn đang như thế" — sách dùng ～ています khi kể cuộc sống hiện tại.',
        'Phủ định: {見|み}て**いません** (dạo này không xem) — đừng nhầm với まだ～ていません (chưa, Bài 10). Có まだ mới là "chưa".',
        '{毎朝|まいあさ}, {毎晩|まいばん}, {毎週|まいしゅう}, {毎日|まいにち} **không có に** đi sau: ~~毎週に通っています~~.',
      ],
    },

    /* ── ポイント 99 ── */
    { t: 'h', text: 'ポイント 99 — Vた形り Vた形り します (nào là …, nào là …)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'V1た形 り V2た形 り します／しています／しました',
          vi: 'Liệt kê **vài việc tiêu biểu** trong nhiều việc (không kể hết, không theo thứ tự). Thể た + **り**, lặp lại cho mỗi việc, cuối câu luôn có **します** — và **thì của cả câu nằm ở します** cuối cùng (しています = thói quen, しました = đã làm, したいです = muốn làm).',
          examples: [
            { en: '{休|やす}みの{日|ひ}、{家|いえ}で{本|ほん}を{読|よ}んだり{音楽|おんがく}を{聞|き}いたりしています。', ro: 'Yasumi no hi, ie de hon o yondari ongaku o kiitari shite imasu.', vi: 'Ngày nghỉ tôi ở nhà đọc sách, nghe nhạc (các thứ). (câu mẫu của sách)' },
            { en: '{週末|しゅうまつ}、{友達|ともだち}と{買|か}い{物|もの}をしたり{映画|えいが}を{見|み}たりしました。', ro: 'Shuumatsu, tomodachi to kaimono o shitari eiga o mitari shimashita.', vi: 'Cuối tuần tôi đi mua sắm, xem phim với bạn (các thứ). (quá khứ ở しました)' },
            { en: '{日本|にほん}でいろいろなところへ{行|い}ったり、おいしいものを{食|た}べたりしたいです。', ro: 'Nihon de iroiro na tokoro e ittari, oishii mono o tabetari shitai desu.', vi: 'Ở Nhật tôi muốn đi nhiều nơi, ăn đồ ngon…' },
          ],
        },
        {
          formula: '（nơi）へ{行|い}って、V1たり V2たり しています',
          vi: 'Kiểu của 言ってみよう 3 例2: **đi đến đâu đó (Vて)** rồi ở đó **làm nào là … nào là …**.',
          examples: [
            { en: '{公園|こうえん}へ{行|い}って、{本|ほん}を{読|よ}んだり{絵|え}を{描|か}いたりしています。', ro: 'Kouen e itte, hon o yondari e o kaitari shite imasu.', vi: 'Tôi ra công viên, (ở đó) đọc sách, vẽ tranh…' },
            { en: '{図書館|としょかん}へ{行|い}って、ひらがなを{練習|れんしゅう}したりDVDを{見|み}たりしています。', ro: 'Toshokan e itte, hiragana o renshuu shitari DVD o mitari shite imasu.', vi: 'Tôi đến thư viện, luyện hiragana, xem DVD…' },
          ],
        },
        {
          formula: 'Hỏi: {休|やす}みの{日|ひ}、よく{何|なに}をしていますか。',
          vi: 'Câu hỏi hay gặp nhất khi thi. Trả lời bằng **～たり～たりしています** thì được điểm cao hơn câu một việc.',
          examples: [
            { en: 'A：{休|やす}みの{日|ひ}、よく{何|なに}をしていますか。B：{音楽|おんがく}を{聞|き}いたりゲームをしたりしています。', ro: 'A: Yasumi no hi, yoku nani o shite imasu ka. B: Ongaku o kiitari geemu o shitari shite imasu.', vi: 'A: Ngày nghỉ bạn hay làm gì? B: Tôi nghe nhạc, chơi game…' },
            { en: 'A：{週末|しゅうまつ}、{何|なに}をしましたか。B：{部屋|へや}を{掃除|そうじ}したり、{洗濯|せんたく}したりしました。', ro: 'A: Shuumatsu, nani o shimashita ka. B: Heya o souji shitari, sentaku shitari shimashita.', vi: 'A: Cuối tuần bạn làm gì? B: Tôi dọn phòng, giặt đồ…' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — ___たり ___たりしています (theo tranh 言ってみよう 3)',
      head: ['Việc 1', 'Việc 2', 'Câu hoàn chỉnh'],
      rows: [
        ['{音楽|おんがく}を{聞|き}きます', 'ゲームをします', '{音楽|おんがく}を{聞|き}いたりゲームをしたりしています。'],
        ['テレビを{見|み}ます', 'ジョギングをします', 'テレビを{見|み}たりジョギングをしたりしています。'],
        ['{花|はな}の{写真|しゃしん}を{撮|と}ります', 'カフェで{本|ほん}を{読|よ}みます', '{花|はな}の{写真|しゃしん}を{撮|と}ったりカフェで{本|ほん}を{読|よ}んだりしています。'],
        ['ひらがなを{練習|れんしゅう}します', 'DVDを{見|み}ます', '{図書館|としょかん}へ{行|い}って、ひらがなを{練習|れんしゅう}したりDVDを{見|み}たりしています。'],
        ['{友達|ともだち}とご{飯|はん}を{食|た}べます', '{映画|えいが}を{見|み}ます', '{友達|ともだち}に{会|あ}って、ご{飯|はん}を{食|た}べたり{映画|えいが}を{見|み}たりしています。'],
        ['{雑誌|ざっし}を{読|よ}みます', '{日記|にっき}を{書|か}きます', '{雨|あめ}のとき、{雑誌|ざっし}を{読|よ}んだり{日記|にっき}を{書|か}いたりします。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — ～たり～たり',
      items: [
        'Quên **します** ở cuối: ~~本を読んだり音楽を聞いたりです~~ → 聞いたり**します**.',
        'Chỉ để **たり** ở việc đầu: ~~本を読んだり、音楽を聞きます~~ → cả hai việc đều **～たり**.',
        'Chia thì ở giữa câu: ~~読みましたり~~ → luôn là **thể た + り**, thì chỉ đổi ở します cuối (しました).',
        '**～て、～て** (Bài 9) = làm **lần lượt theo thứ tự**; **～たり～たり** = vài việc tiêu biểu, **không theo thứ tự**, có thể còn việc khác nữa.',
      ],
    },

    /* ── ポイント 100 ── */
    { t: 'h', text: 'ポイント 100 — N1は ___が、N2は ___ (N1 thì …, còn N2 thì …)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1 は ［khẳng định］が、N2 は ［phủ định / ngược lại］。',
          vi: '**は** ở đây là は **đối chiếu**: đặt hai thứ cạnh nhau để nói chúng khác nhau. **が** (nhưng — Bài 4) nối hai vế. Hay gặp: **{初|はじ}めは～が、{今|いま}は～** (lúc đầu … nhưng bây giờ …).',
          examples: [
            { en: '{犬|いぬ}は{好|す}きですが、{猫|ねこ}は{好|す}きじゃありません。', ro: 'Inu wa suki desu ga, neko wa suki ja arimasen.', vi: 'Chó thì tôi thích, còn mèo thì không. (câu mẫu của sách)' },
            { en: '{会話|かいわ}は{好|す}きですが、{作文|さくぶん}は{好|す}きじゃありません。', ro: 'Kaiwa wa suki desu ga, sakubun wa suki ja arimasen.', vi: 'Hội thoại thì thích, còn viết văn thì không.' },
            { en: '{初|はじ}めは{少|すこ}し{寂|さび}しかったですが、{今|いま}は{楽|たの}しくなりました。', ro: 'Hajime wa sukoshi sabishikatta desu ga, ima wa tanoshiku narimashita.', vi: 'Lúc đầu hơi buồn, nhưng giờ đã vui rồi.' },
            { en: '{平日|へいじつ}は{忙|いそが}しいですが、{週末|しゅうまつ}は{暇|ひま}です。', ro: 'Heijitsu wa isogashii desu ga, shuumatsu wa hima desu.', vi: 'Ngày thường thì bận, còn cuối tuần thì rảnh.' },
          ],
        },
        {
          formula: 'Trợ từ + は: を・が → は　／　へ → へは　／　に → には　／　で → では　／　と → とは',
          vi: 'Hộp ở sách (p.278): khi đưa một phần câu lên làm vế đối chiếu, **を và が bị thay hẳn bằng は**; các trợ từ khác **giữ nguyên rồi thêm は** phía sau.',
          examples: [
            { en: '{近|ちか}いところ**へは**{行|い}きましたが、{遠|とお}いところ**へは**まだ{行|い}っていません。', ro: 'Chikai tokoro e wa ikimashita ga, tooi tokoro e wa mada itte imasen.', vi: 'Chỗ gần thì tôi đi rồi, còn chỗ xa thì chưa. (へ → へは)' },
            { en: 'ひらがな**は**{書|か}くことができますが、{漢字|かんじ}**は**できません。', ro: 'Hiragana wa kaku koto ga dekimasu ga, kanji wa dekimasen.', vi: 'Hiragana thì viết được, còn chữ Hán thì không. (を → は)' },
            { en: '{学校|がっこう}**では**{日本語|にほんご}を{話|はな}しますが、うち**では**{話|はな}しません。', ro: 'Gakkou de wa Nihongo o hanashimasu ga, uchi de wa hanashimasen.', vi: 'Ở trường thì tôi nói tiếng Nhật, còn ở nhà thì không. (で → では)' },
            { en: 'パクさん**とは**よく{話|はな}しますが、マルコさん**とは**あまり{話|はな}しません。', ro: 'Paku-san to wa yoku hanashimasu ga, Maruko-san to wa amari hanashimasen.', vi: 'Với Park thì tôi hay nói chuyện, còn với Marco thì không mấy. (と → とは)' },
            { en: '{日曜日|にちようび}**には**{試合|しあい}がありますが、{土曜日|どようび}**には**ありません。', ro: 'Nichiyoubi ni wa shiai ga arimasu ga, doyoubi ni wa arimasen.', vi: 'Chủ Nhật thì có trận đấu, còn thứ Bảy thì không. (に → には; が → bỏ)' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — ___は ___が、___は ___ (theo 言ってみよう 1)',
      head: ['Câu hỏi', 'Vế 1', 'Vế 2', 'Câu trả lời'],
      rows: [
        ['{一人|ひとり}{暮|ぐ}らしはどうですか', '{初|はじ}め・{寂|さび}しかった', '{今|いま}・{楽|たの}しくなった', '{初|はじ}めは{少|すこ}し{寂|さび}しかったですが、{今|いま}は{楽|たの}しくなりました。'],
        ['{日本語|にほんご}の{勉強|べんきょう}はどうですか', '{会話|かいわ}・{好|す}き', '{作文|さくぶん}・{好|す}きじゃない', '{会話|かいわ}は{好|す}きですが、{作文|さくぶん}は{好|す}きじゃありません。'],
        ['もういろいろなところへ{行|い}きましたか', '{近|ちか}いところ・{行|い}った', '{遠|とお}いところ・まだ', '{近|ちか}いところへは{行|い}きましたが、{遠|とお}いところへはまだ{行|い}っていません。'],
        ['アルバイトは{大変|たいへん}ですか', '{初|はじ}め・{大変|たいへん}だった', '{今|いま}・おもしろくなった', '{初|はじ}めは{大変|たいへん}でしたが、{今|いま}はおもしろくなりました。'],
        ['{日本|にほん}の{料理|りょうり}はどうですか', 'すし・{好|す}き', '{納豆|なっとう}・{好|す}きじゃない', 'すしは{好|す}きですが、{納豆|なっとう}は{好|す}きじゃありません。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — N1は～が、N2は～',
      items: [
        'Giữ lại を／が trước は: ~~ひらがなをは書くことができます~~ → ひらがな**は**; ~~犬がは好きです~~ → 犬**は**.',
        'Quên trợ từ khi thêm は: ~~遠いところは行っていません~~ nghe được nhưng chuẩn sách là 遠いところ**へは**.',
        'Hai vế **cùng dạng câu** mới rõ đối chiếu: {好|す}きです ↔ {好|す}きじゃありません; {行|い}きました ↔ まだ{行|い}っていません.',
        '{納豆|なっとう} (đậu tương lên men) trong bảng là từ tự thêm — thay bằng món bạn không thích.',
      ],
    },

    /* ── ポイント 101 ── */
    { t: 'h', text: 'ポイント 101 — ［イA／ナAな／Nの／V{辞書形|じしょけい}／Vた形／Vナイ形］とき、___ (Khi …)' },
    {
      t: 'table',
      caption: 'Cách nối với とき — 6 dạng (p.278)',
      head: ['Loại từ', 'Nối', 'Ví dụ (câu mẫu của sách)', 'Nghĩa'],
      rows: [
        ['イA', 'イA（～い）＋とき', '{寂|さび}しいとき、{国|くに}の{家族|かぞく}に{電話|でんわ}します。', 'Khi buồn, tôi gọi điện về nhà.'],
        ['ナA', 'ナA ＋ **な** ＋とき', '{暇|ひま}なとき、テレビを{見|み}ます。', 'Khi rảnh, tôi xem TV.'],
        ['N', 'N ＋ **の** ＋とき', '{中学生|ちゅうがくせい}のとき、ギターを{始|はじ}めました。', 'Hồi cấp hai, tôi bắt đầu chơi guitar.'],
        ['V thể từ điển', 'V{辞書形|じしょけい}＋とき', '{料理|りょうり}を{作|つく}るとき、{本|ほん}を{見|み}ます。', 'Khi nấu ăn, tôi xem sách.'],
        ['V thể ない', 'Vない＋とき', 'アルバイトがないとき、{友達|ともだち}と{遊|あそ}びます。', 'Khi không có ca làm thêm, tôi đi chơi với bạn.'],
        ['V thể た', 'Vた＋とき', 'イタリアへ{行|い}ったとき、この{帽子|ぼうし}を{買|か}いました。', 'Khi đi Ý, tôi mua cái mũ này (mua ở Ý).'],
        ['V thể từ điển', 'V{辞書形|じしょけい}＋とき', '{日本|にほん}へ{来|く}るとき、{父|ちち}に{時計|とけい}をもらいました。', 'Lúc sắp sang Nhật, tôi được bố tặng đồng hồ.'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '［～とき］、（câu chính）。',
          vi: '**とき** = "khi, lúc". Vế trước とき dùng **thể thường** (không bao giờ ~~ますとき~~, ~~ですとき~~). Thì của cả câu do **câu chính** quyết định: thói quen → ～ます; chuyện đã qua → ～ました.',
          examples: [
            { en: '{頭|あたま}が{痛|いた}いとき、{薬|くすり}を{飲|の}みます。', ro: 'Atama ga itai toki, kusuri o nomimasu.', vi: 'Khi đau đầu, tôi uống thuốc.' },
            { en: '{天気|てんき}がいいとき、{公園|こうえん}を{散歩|さんぽ}します。', ro: 'Tenki ga ii toki, kouen o sanpo shimasu.', vi: 'Khi trời đẹp, tôi đi dạo công viên.' },
            { en: '{雨|あめ}のとき、{部屋|へや}で{本|ほん}を{読|よ}みます。', ro: 'Ame no toki, heya de hon o yomimasu.', vi: 'Khi mưa, tôi đọc sách trong phòng.' },
            { en: '{時間|じかん}があるとき、{映画|えいが}を{見|み}に{行|い}きます。', ro: 'Jikan ga aru toki, eiga o mi ni ikimasu.', vi: 'Khi có thời gian, tôi đi xem phim.' },
            { en: '{小学生|しょうがくせい}のとき、{水泳|すいえい}を{始|はじ}めました。', ro: 'Shougakusei no toki, suiei o hajimemashita.', vi: 'Hồi tiểu học, tôi bắt đầu học bơi.' },
          ],
        },
        {
          formula: 'V{辞書形|じしょけい}とき ↔ Vたとき',
          vi: 'Với động từ, chọn dạng theo **thứ tự thời gian**: **V辞書形とき** = việc ở câu chính xảy ra **trước / trong lúc** việc V (V chưa xong); **Vたとき** = việc ở câu chính xảy ra **sau khi V đã xong**.',
          examples: [
            { en: '{日本|にほん}へ{来|く}るとき、{空港|くうこう}で{辞書|じしょ}を{買|か}いました。', ro: 'Nihon e kuru toki, kuukou de jisho o kaimashita.', vi: 'Lúc (trên đường) sang Nhật, tôi mua từ điển ở sân bay (sân bay nước mình — chưa tới Nhật).' },
            { en: '{日本|にほん}へ{来|き}たとき、{空港|くうこう}で{辞書|じしょ}を{買|か}いました。', ro: 'Nihon e kita toki, kuukou de jisho o kaimashita.', vi: 'Khi đã sang tới Nhật, tôi mua từ điển ở sân bay (sân bay ở Nhật).' },
            { en: '{国|くに}へ{帰|かえ}るとき、{友達|ともだち}と{別|わか}れました。', ro: 'Kuni e kaeru toki, tomodachi to wakaremashita.', vi: 'Lúc (chuẩn bị) về nước, tôi chia tay các bạn.' },
            { en: '{風邪|かぜ}をひいたとき、{学校|がっこう}を{休|やす}みます。', ro: 'Kaze o hiita toki, gakkou o yasumimasu.', vi: 'Khi (đã) bị cảm, tôi nghỉ học.' },
            { en: '{寝|ね}るとき、{電気|でんき}を{消|け}します。', ro: 'Neru toki, denki o keshimasu.', vi: 'Khi (sắp) đi ngủ, tôi tắt đèn.' },
          ],
        },
        {
          formula: 'Hỏi: いつ ～ましたか。 → ～とき、～ました。',
          vi: 'Câu hỏi của chủ đề 2: **いつ** + quá khứ. Trả lời bằng mốc đời mình: **{小学生|しょうがくせい}のとき／{15歳|じゅうごさい}のとき／{入学|にゅうがく}したとき**.',
          examples: [
            { en: 'A：いつ{水泳|すいえい}を{始|はじ}めましたか。B：{小学生|しょうがくせい}のとき、{始|はじ}めました。', ro: 'A: Itsu suiei o hajimemashita ka. B: Shougakusei no toki, hajimemashita.', vi: 'A: Bạn bắt đầu bơi khi nào? B: Hồi tiểu học.' },
            { en: 'A：その{時計|とけい}はいつもらいましたか。B：{大学|だいがく}に{入学|にゅうがく}したとき、{祖父|そふ}にもらいました。', ro: 'A: Sono tokei wa itsu moraimashita ka. B: Daigaku ni nyuugaku shita toki, sofu ni moraimashita.', vi: 'A: Đồng hồ đó bạn được tặng khi nào? B: Khi vào đại học, tôi được ông tặng.' },
            { en: 'A：いつギターを{始|はじ}めましたか。B：{15歳|じゅうごさい}のとき、{始|はじ}めました。', ro: 'A: Itsu gitaa o hajimemashita ka. B: Juugosai no toki, hajimemashita.', vi: 'A: Bạn bắt đầu chơi guitar khi nào? B: Năm 15 tuổi.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — ___とき、___ます (theo 言ってみよう 4 của sách)',
      head: ['Tình huống (thể lịch sự)', 'Đổi sang ～とき', 'Câu hoàn chỉnh'],
      rows: [
        ['{雨|あめ}です', '{雨|あめ}のとき', '{雨|あめ}のとき、{部屋|へや}で{本|ほん}を{読|よ}みます。'],
        ['{天気|てんき}がいいです', '{天気|てんき}がいいとき', '{天気|てんき}がいいとき、サッカーをします。'],
        ['{暇|ひま}です', '{暇|ひま}なとき', '{暇|ひま}なとき、ゲームをします。'],
        ['{時間|じかん}があります', '{時間|じかん}があるとき', '{時間|じかん}があるとき、{映画|えいが}を{見|み}に{行|い}きます。'],
        ['アルバイトがありません', 'アルバイトがないとき', 'アルバイトがないとき、{友達|ともだち}と{飲|の}みに{行|い}きます。'],
        ['{疲|つか}れました', '{疲|つか}れたとき', '{疲|つか}れたとき、{甘|あま}いものを{食|た}べます。'],
        ['{高校生|こうこうせい}でした', '{高校生|こうこうせい}のとき', '{高校生|こうこうせい}のとき、{本|ほん}が{好|す}きになりました。'],
        ['{入学|にゅうがく}しました', '{入学|にゅうがく}したとき', '{入学|にゅうがく}したとき、{祖父|そふ}に{時計|とけい}をもらいました。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — とき',
      items: [
        'Quên **な** / **の**: ~~暇とき~~ → **暇な**とき; ~~小学生とき~~ → **小学生の**とき; ~~雨とき~~ → **雨の**とき.',
        'Thêm thừa: ~~寂しいなとき~~, ~~寂しいのとき~~ → イA **nối thẳng**: 寂しいとき. **いい → いいとき** (không đổi).',
        'Dùng thể lịch sự trước とき: ~~行きますとき~~, ~~暇ですとき~~ → **thể thường**: {行|い}くとき／{行|い}ったとき, {暇|ひま}なとき.',
        'Chọn nhầm 来るとき ↔ 来たとき: tự hỏi "lúc đó **đã tới nơi chưa**?" Chưa → 来**る**とき; rồi → 来**た**とき.',
        'Dạng quá khứ của tính từ / danh từ trước とき **ít dùng** ở trình độ này: hồi tiểu học → {小学生|しょうがくせい}**の**とき (không cần ~~小学生だったとき~~).',
        'Hộp trợ từ + は của p.278 cũng dùng ở đây khi muốn đối chiếu: {雨|あめ}のとき**は**うちにいますが、{天気|てんき}がいいとき**は**{公園|こうえん}へ{行|い}きます.',
      ],
    },

    /* ── ポイント 102 ── */
    { t: 'h', text: 'ポイント 102 — ～とき、どうしますか (Khi … thì bạn làm thế nào?)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '［～とき］、どうしますか。——（Vます）。',
          vi: '**どうしますか** = "(bạn) làm thế nào / xử lý ra sao?". Ghép với とき để hỏi cách người khác đối phó với một tình huống. Trả lời bằng **việc mình làm** (～ます), có thể thêm ～たり～たり.',
          examples: [
            { en: '{疲|つか}れたとき、どうしますか。——{甘|あま}いものを{食|た}べます。', ro: 'Tsukareta toki, dou shimasu ka. — Amai mono o tabemasu.', vi: 'Khi mệt, bạn làm thế nào? — Tôi ăn đồ ngọt. (câu mẫu của sách)' },
            { en: '{頭|あたま}が{痛|いた}いとき、どうしますか。——{薬|くすり}を{飲|の}みます。', ro: 'Atama ga itai toki, dou shimasu ka. — Kusuri o nomimasu.', vi: 'Khi đau đầu, bạn làm thế nào? — Tôi uống thuốc.' },
            { en: '{眠|ねむ}いとき、どうしますか。——コーヒーを{飲|の}みます。', ro: 'Nemui toki, dou shimasu ka. — Koohii o nomimasu.', vi: 'Khi buồn ngủ, bạn làm thế nào? — Tôi uống cà phê.' },
            { en: '{道|みち}がわからないとき、どうしますか。——{近|ちか}くの{人|ひと}に{聞|き}きます。', ro: 'Michi ga wakaranai toki, dou shimasu ka. — Chikaku no hito ni kikimasu.', vi: 'Khi không biết đường, bạn làm thế nào? — Tôi hỏi người gần đó.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — ___とき、どうしますか (đủ 6 gợi ý của 言ってみよう 5)',
      head: ['Tình huống', 'Câu hỏi', 'Trả lời mẫu'],
      rows: [
        ['{頭|あたま}が{痛|いた}いです', '{頭|あたま}が{痛|いた}いとき、どうしますか。', '{薬|くすり}を{飲|の}みます。'],
        ['{眠|ねむ}いです', '{眠|ねむ}いとき、どうしますか。', 'コーヒーを{飲|の}みます。'],
        ['アルバイトを{休|やす}みます', 'アルバイトを{休|やす}むとき、どうしますか。', '{店長|てんちょう}に{電話|でんわ}します。'],
        ['{疲|つか}れました', '{疲|つか}れたとき、どうしますか。', 'チョコレートを{食|た}べます。'],
        ['{風邪|かぜ}をひきました', '{風邪|かぜ}をひいたとき、どうしますか。', '{病院|びょういん}へ{行|い}きます。'],
        ['{道|みち}がわかりません', '{道|みち}がわからないとき、どうしますか。', '{近|ちか}くの{人|ひと}に{聞|き}きます。'],
        ['{夜|よる}、なかなか{寝|ね}ることができません', '{寝|ね}ることができないとき、どうしますか。', '{牛乳|ぎゅうにゅう}を{飲|の}みます。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — どうしますか',
      items: [
        'Trả lời bằng cảm giác thay vì việc làm: hỏi どうしますか mà đáp ~~つらいです~~ → phải nói **việc mình làm**: ～ます.',
        '"Mệt rồi, bị cảm rồi" là **thể た** trước とき: {疲|つか}れ**た**とき, {風邪|かぜ}をひい**た**とき (mệt là trạng thái đã xảy ra). "Buồn ngủ, đau đầu" là tính từ → {眠|ねむ}**い**とき, {痛|いた}**い**とき.',
        '**どうしますか** (làm thế nào) ≠ **どうですか** (thấy thế nào, Bài 4). Nghe kỹ: どう**し**ますか.',
      ],
    },

    /* ── 普通形 ── */
    { t: 'h', text: 'Trước ポイント 103 — Thể lịch sự (丁寧形) ↔ thể thường (普通形): bảng đổi đầy đủ' },
    {
      t: 'p',
      text: 'Từ Bài 1 đến giờ bạn nói **thể lịch sự** (丁寧形 — có です／ます). Mỗi câu lịch sự có một **thể thường** (普通形) tương ứng, dùng khi nói với bạn bè (ポイント 103) và dùng **bên trong câu** trước とき, こと… Bảng dưới là bảng 表 p.284 của sách, đủ **4 dạng** (hiện tại / quá khứ × khẳng định / phủ định) cho **động từ, tính từ い, tính từ な, danh từ**.',
    },
    {
      t: 'table',
      caption: 'Động từ — 丁寧形 ↔ 普通形 (表 p.284)',
      head: ['Dạng', '丁寧形 (lịch sự)', '普通形 (thường)', 'Romaji', 'Cách đổi'],
      rows: [
        ['Hiện tại khẳng định', '{行|い}きます', '{行|い}く', 'iku', 'thể từ điển (Bài 9)'],
        ['Hiện tại phủ định', '{行|い}きません', '{行|い}かない', 'ikanai', 'thể ない (Bài 10)'],
        ['Quá khứ khẳng định', '{行|い}きました', '{行|い}った', 'itta', 'thể た (Bài 11)'],
        ['Quá khứ phủ định', '{行|い}きませんでした', '{行|い}かなかった', 'ikanakatta', 'thể ない: ～ない → ～**なかった**'],
        ['Hiện tại khẳng định', 'あります', 'ある', 'aru', ''],
        ['Hiện tại phủ định', 'ありません', '※ない', 'nai', 'đặc biệt — không có ~~あらない~~'],
        ['Quá khứ khẳng định', 'ありました', 'あった', 'atta', ''],
        ['Quá khứ phủ định', 'ありませんでした', '※なかった', 'nakatta', 'đặc biệt'],
      ],
    },
    {
      t: 'table',
      caption: 'Tính từ い — 丁寧形 ↔ 普通形 (表 p.284): chỉ cần BỎ です',
      head: ['Dạng', '丁寧形', '普通形', 'Romaji'],
      rows: [
        ['Hiện tại khẳng định', 'おいしいです', 'おいしい', 'oishii'],
        ['Hiện tại phủ định', 'おいしくないです', 'おいしくない', 'oishiku nai'],
        ['Quá khứ khẳng định', 'おいしかったです', 'おいしかった', 'oishikatta'],
        ['Quá khứ phủ định', 'おいしくなかったです', 'おいしくなかった', 'oishiku nakatta'],
        ['※ いい', 'いいです／よくないです', 'いい／よくない', 'ii / yoku nai'],
        ['※ いい (quá khứ)', 'よかったです／よくなかったです', 'よかった／よくなかった', 'yokatta / yoku nakatta'],
      ],
    },
    {
      t: 'table',
      caption: 'Tính từ な — 丁寧形 ↔ 普通形 (表 p.284)',
      head: ['Dạng', '丁寧形', '普通形', 'Romaji'],
      rows: [
        ['Hiện tại khẳng định', '{元気|げんき}です', '{元気|げんき}だ', 'genki da'],
        ['Hiện tại phủ định', '{元気|げんき}じゃありません', '{元気|げんき}じゃない', 'genki ja nai'],
        ['Quá khứ khẳng định', '{元気|げんき}でした', '{元気|げんき}だった', 'genki datta'],
        ['Quá khứ phủ định', '{元気|げんき}じゃありませんでした', '{元気|げんき}じゃなかった', 'genki ja nakatta'],
      ],
    },
    {
      t: 'table',
      caption: 'Danh từ — 丁寧形 ↔ 普通形 (表 p.284): giống hệt tính từ な',
      head: ['Dạng', '丁寧形', '普通形', 'Romaji'],
      rows: [
        ['Hiện tại khẳng định', '{休|やす}みです', '{休|やす}みだ', 'yasumi da'],
        ['Hiện tại phủ định', '{休|やす}みじゃありません', '{休|やす}みじゃない', 'yasumi ja nai'],
        ['Quá khứ khẳng định', '{休|やす}みでした', '{休|やす}みだった', 'yasumi datta'],
        ['Quá khứ phủ định', '{休|やす}みじゃありませんでした', '{休|やす}みじゃなかった', 'yasumi ja nakatta'],
      ],
    },
    {
      t: 'table',
      caption: 'Các mẫu khác (その他, 表 p.284) — phần đuôi cũng đổi theo cùng quy tắc',
      head: ['丁寧形', '普通形', 'Học ở'],
      rows: [
        ['{食|た}べたいです', '{食|た}べたい', 'Bài 5 (たい đổi như tính từ い)'],
        ['{食|た}べています', '{食|た}べている (nói nhanh: {食|た}べてる)', 'Bài 7, 8, 11'],
        ['{食|た}べることができます', '{食|た}べることができる', 'Bài 9'],
        ['{食|た}べてもいいです', '{食|た}べてもいい', 'Bài 10'],
        ['{食|た}べたほうがいいです', '{食|た}べたほうがいい', 'Bài 12 (sẽ học)'],
        ['{食|た}べたことがあります', '{食|た}べたことがある', 'Bài 13 (sẽ học)'],
        ['{食|た}べてはいけません', '{食|た}べてはいけない', 'Bài 14 (sẽ học)'],
        ['{食|た}べなければなりません', '{食|た}べなければならない', 'Bài 14 (sẽ học)'],
        ['{食|た}べなくてもいいです', '{食|た}べなくてもいい', 'Bài 14 (sẽ học)'],
      ],
    },
    {
      t: 'table',
      caption: 'Luyện đổi — từ của Bài 11 (che cột phải, tự đổi rồi mở ra kiểm tra)',
      head: ['丁寧形', '普通形', 'Loại'],
      rows: [
        ['{見|み}ます／{見|み}ません', '{見|み}る／{見|み}ない', 'V nhóm 2'],
        ['{見|み}ました／{見|み}ませんでした', '{見|み}た／{見|み}なかった', 'V nhóm 2'],
        ['{飲|の}みます／{飲|の}みません', '{飲|の}む／{飲|の}まない', 'V nhóm 1'],
        ['{飲|の}みました／{飲|の}みませんでした', '{飲|の}んだ／{飲|の}まなかった', 'V nhóm 1'],
        ['します／しません', 'する／しない', 'V nhóm 3'],
        ['しました／しませんでした', 'した／しなかった', 'V nhóm 3'],
        ['{来|き}ます／{来|き}ません', '{来|く}る／{来|こ}ない', 'V nhóm 3'],
        ['{来|き}ました／{来|き}ませんでした', '{来|き}た／{来|こ}なかった', 'V nhóm 3'],
        ['{忙|いそが}しいです／{忙|いそが}しくないです', '{忙|いそが}しい／{忙|いそが}しくない', 'イA'],
        ['{楽|たの}しかったです／{楽|たの}しくなかったです', '{楽|たの}しかった／{楽|たの}しくなかった', 'イA'],
        ['{暇|ひま}です／{暇|ひま}じゃありません', '{暇|ひま}だ／{暇|ひま}じゃない', 'ナA'],
        ['{大変|たいへん}でした／{大変|たいへん}じゃありませんでした', '{大変|たいへん}だった／{大変|たいへん}じゃなかった', 'ナA'],
        ['アルバイトです／アルバイトじゃありません', 'アルバイトだ／アルバイトじゃない', 'N'],
        ['{雨|あめ}でした／{雨|あめ}じゃありませんでした', '{雨|あめ}だった／{雨|あめ}じゃなかった', 'N'],
      ],
    },
    {
      t: 'note',
      title: 'Ghi nhớ nhanh — 4 quy tắc đổi sang thể thường',
      items: [
        '**Động từ**: ます → thể từ điển · ません → thể ない · ました → thể た · ませんでした → ～な**かった**.',
        '**Tính từ い**: chỉ **bỏ です** (おいしいです → おいしい). **Không thêm だ**: ~~おいしいだ~~ sai.',
        '**Tính từ な / danh từ**: です → **だ** · じゃありません → じゃ**ない** · でした → **だった** · じゃありませんでした → じゃ**なかった**.',
        '**ない** đổi như tính từ い: ない → なかった (quá khứ). Nên: ありません → **ない**, ありませんでした → **なかった** (hộp ở p.279).',
      ],
    },

    /* ── ポイント 103 ── */
    { t: 'h', text: 'ポイント 103 — {友達|ともだち}{言葉|ことば} (nói với bạn bè bằng thể thường)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'Câu hỏi có/không: ～（普通形）？↗ ——うん、～。／ううん、～ない。',
          vi: 'Câu hỏi với bạn: **thể thường + lên giọng**, **không có か**. Trả lời: **うん** (= はい) / **ううん** (= いいえ) + lặp lại động từ / tính từ ở thể thường. **Trợ từ を, へ thường bị bỏ** (sách để trong ngoặc).',
          examples: [
            { en: '{海|うみ}（へ）{行|い}く？——うん、{行|い}く。／ううん、{行|い}かない。', ro: 'Umi (e) iku? — Un, iku. / Uun, ikanai.', vi: 'Đi biển không? — Ừ, đi. / Không, không đi. (câu mẫu của sách)' },
            { en: 'よくお{酒|さけ}（を）{飲|の}む？——うん、{飲|の}む。／ううん、{飲|の}まない。', ro: 'Yoku osake (o) nomu? — Un, nomu. / Uun, nomanai.', vi: 'Hay uống rượu không? — Ừ, uống. / Không, không uống.' },
            { en: '{毎朝|まいあさ}、ご{飯|はん}（を）{食|た}べる？——ううん、{食|た}べない。', ro: 'Maiasa, gohan (o) taberu? — Uun, tabenai.', vi: 'Sáng nào cũng ăn cơm à? — Không, không ăn.' },
          ],
        },
        {
          formula: 'Tính từ / danh từ: イA？——うん、イA。／ううん、イAくない。　ナA／N？——うん、ナA／N。／ううん、～じゃない。',
          vi: 'Câu hỏi với **tính từ な và danh từ bỏ luôn だ**: {暇|ひま}？ {休|やす}み？ (~~暇だ？~~ nghe cộc). Trả lời khẳng định cũng hay bỏ だ hoặc thêm よ: うん、{暇|ひま}（だよ）.',
          examples: [
            { en: '{毎日|まいにち}、{忙|いそが}しい？——うん、{忙|いそが}しい。／ううん、{忙|いそが}しくない。', ro: 'Mainichi, isogashii? — Un, isogashii. / Uun, isogashiku nai.', vi: 'Ngày nào cũng bận à? — Ừ, bận. / Không, không bận.' },
            { en: '{日本|にほん}の{生活|せいかつ}、{楽|たの}しい？——うん、{楽|たの}しい。', ro: 'Nihon no seikatsu, tanoshii? — Un, tanoshii.', vi: 'Cuộc sống ở Nhật vui không? — Ừ, vui.' },
            { en: 'アルバイト、{大変|たいへん}？——ううん、{大変|たいへん}じゃない。', ro: 'Arubaito, taihen? — Uun, taihen ja nai.', vi: 'Làm thêm vất vả không? — Không, không vất vả.' },
            { en: '{週末|しゅうまつ}、{暇|ひま}？——うん、{暇|ひま}だよ。', ro: 'Shuumatsu, hima? — Un, hima da yo.', vi: 'Cuối tuần rảnh không? — Ừ, rảnh mà.' },
          ],
        },
        {
          formula: 'Quá khứ: {何|なに}（を）した？——～た。——どうだった？——～かった／～だった。',
          vi: 'Hỏi chuyện đã qua bằng **thể た**; hỏi cảm tưởng **どうだった？** (= どうでしたか).',
          examples: [
            { en: '{昨日|きのう}、{何|なに}（を）した？——{友達|ともだち}と{映画|えいが}（を）{見|み}た。', ro: 'Kinou, nani (o) shita? — Tomodachi to eiga (o) mita.', vi: 'Hôm qua làm gì? — Xem phim với bạn. (câu mẫu của sách)' },
            { en: '{週末|しゅうまつ}、{何|なに}した？——{新|あたら}しいデパート{行|い}った。——どうだった？——{人|ひと}が{多|おお}かった。', ro: 'Shuumatsu, nani shita? — Atarashii depaato itta. — Dou datta? — Hito ga ookatta.', vi: 'Cuối tuần làm gì? — Đi trung tâm thương mại mới. — Thế nào? — Đông người lắm.' },
            { en: '「キングマン」{見|み}た？——ううん、{見|み}なかった。', ro: '"Kinguman" mita? — Uun, minakatta.', vi: 'Xem phim "Kingman" chưa? (đã xem không?) — Không, không xem.' },
          ],
        },
        {
          formula: 'Nhờ: Vて。 · Xin phép: Vてもいい？——うん、いいよ。',
          vi: '**Vて** = Vてください (nhờ bạn). **Vてもいい？** = Vてもいいですか. Đồng ý: **うん、いいよ**. Từ chối: **ごめん、～から** (bỏ lửng cũng được).',
          examples: [
            { en: 'それ（を）{見|み}せて。', ro: 'Sore (o) misete.', vi: 'Cho xem cái đó. (câu mẫu của sách)' },
            { en: '{消|け}しゴム（を）{貸|か}して。——うん、いいよ。', ro: 'Keshigomu (o) kashite. — Un, ii yo.', vi: 'Cho mượn cục tẩy. — Ừ, được.' },
            { en: 'このCD（を）{聞|き}いてもいい？——うん、いいよ。', ro: 'Kono CD (o) kiite mo ii? — Un, ii yo.', vi: 'Nghe cái CD này được không? — Ừ, được. (câu mẫu của sách)' },
            { en: 'エアコン（を）{消|け}してもいい？——ごめん、ちょっと{暑|あつ}いから……。', ro: 'Eakon (o) keshite mo ii? — Gomen, chotto atsui kara…….', vi: 'Tắt điều hoà được không? — Xin lỗi, vì hơi nóng…' },
          ],
        },
        {
          formula: 'Rủ: Vない？ ——いいね。／ごめん、～から。——そっか。じゃ、また{今度|こんど}。',
          vi: '**Vない？** (lên giọng) = **Vませんか** (Bài 6). Nhận lời: **いいね**. Từ chối: **ごめん** + lý do + **から** (N／ナA thì ～**だ**から). Người rủ: **そっか。じゃ、また{今度|こんど}**.',
          examples: [
            { en: '{日曜日|にちようび}、{新宿|しんじゅく}でご{飯|はん}（を）{食|た}べない？', ro: 'Nichiyoubi, Shinjuku de gohan (o) tabenai?', vi: 'Chủ Nhật ăn cơm ở Shinjuku không? (câu mẫu của sách)' },
            { en: '{一緒|いっしょ}にサッカーの{試合|しあい}（を）{見|み}に{行|い}かない？——いいね。', ro: 'Issho ni sakkaa no shiai (o) mi ni ikanai? — Ii ne.', vi: 'Đi xem trận bóng cùng không? — Hay đấy.' },
            { en: '{買|か}い{物|もの}に{行|い}かない？——あ、ごめん、{用事|ようじ}があるから。——そっか。じゃ、また{今度|こんど}。', ro: 'Kaimono ni ikanai? — A, gomen, youji ga aru kara. — Sokka. Ja, mata kondo.', vi: 'Đi mua sắm không? — À, xin lỗi, vì mình có việc bận. — Thế à. Vậy để lần sau.' },
            { en: '{海|うみ}{行|い}かない？——ごめん、{週末|しゅうまつ}は{引|ひ}っ{越|こ}しだから。', ro: 'Umi ikanai? — Gomen, shuumatsu wa hikkoshi da kara.', vi: 'Đi biển không? — Xin lỗi, vì cuối tuần mình chuyển nhà. (N + だから)' },
          ],
        },
        {
          formula: '～けど、～よ。 (けど = が "nhưng" · よ = báo cho bạn biết)',
          vi: '**けど** là dạng thân mật của **が** (nhưng). **よ** cuối câu = "đấy / mà" (cho bạn thông tin mới). Đề xuất một nơi: **N はどう？** (= どうですか).',
          examples: [
            { en: 'あの{店|みせ}（は）{高|たか}いけど、おいしいよ。', ro: 'Ano mise (wa) takai kedo, oishii yo.', vi: 'Quán đó đắt nhưng ngon đấy. (câu mẫu của sách)' },
            { en: 'ララはどう？{高|たか}いけど、おいしいよ。', ro: 'Rara wa dou? Takai kedo, oishii yo.', vi: 'Quán Lala thì sao? Đắt nhưng ngon đấy.' },
            { en: 'みどり{公園|こうえん}はどう？{少|すこ}し{遠|とお}いけど、きれいだよ。', ro: 'Midori kouen wa dou? Sukoshi tooi kedo, kirei da yo.', vi: 'Công viên Midori thì sao? Hơi xa nhưng đẹp lắm. (ナA + だよ)' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Đổi câu lịch sự → 友達言葉 (theo 言ってみよう 1-1, 1-2 của sách)',
      head: ['Lịch sự', 'Thân mật (hỏi)', 'Trả lời ○', 'Trả lời ×'],
      rows: [
        ['よく{日本|にほん}のドラマを{見|み}ますか', 'よく{日本|にほん}のドラマ{見|み}る？', 'うん、{見|み}る。', 'ううん、{見|み}ない。'],
        ['よくお{酒|さけ}を{飲|の}みますか', 'よくお{酒|さけ}{飲|の}む？', 'うん、{飲|の}む。', 'ううん、{飲|の}まない。'],
        ['よくカラオケに{行|い}きますか', 'よくカラオケ{行|い}く？', 'うん、{行|い}く。', 'ううん、{行|い}かない。'],
        ['{毎朝|まいあさ}、ご{飯|はん}を{食|た}べますか', '{毎朝|まいあさ}、ご{飯|はん}{食|た}べる？', 'うん、{食|た}べる。', 'ううん、{食|た}べない。'],
        ['{毎日|まいにち}、ニュースを{見|み}ますか', '{毎日|まいにち}、ニュース{見|み}る？', 'うん、{見|み}る。', 'ううん、{見|み}ない。'],
        ['{毎日|まいにち}、{忙|いそが}しいですか', '{毎日|まいにち}、{忙|いそが}しい？', 'うん、{忙|いそが}しい。', 'ううん、{忙|いそが}しくない。'],
        ['{日本|にほん}の{生活|せいかつ}は{楽|たの}しいですか', '{日本|にほん}の{生活|せいかつ}、{楽|たの}しい？', 'うん、{楽|たの}しい。', 'ううん、{楽|たの}しくない。'],
        ['アルバイトは{大変|たいへん}ですか', 'アルバイト、{大変|たいへん}？', 'うん、{大変|たいへん}。', 'ううん、{大変|たいへん}じゃない。'],
        ['{音楽|おんがく}が{好|す}きですか', '{音楽|おんがく}、{好|す}き？', 'うん、{好|す}き。', 'ううん、{好|す}きじゃない。'],
        ['{週末|しゅうまつ}、{暇|ひま}ですか', '{週末|しゅうまつ}、{暇|ひま}？', 'うん、{暇|ひま}。', 'ううん、{暇|ひま}じゃない。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — 友達言葉',
      items: [
        'Trộn hai thể trong một câu: ~~うん、見ます~~, ~~ううん、忙しくないです~~ → **cùng một thể**: うん、{見|み}る / ううん、{忙|いそが}しくない.',
        'Giữ か trong câu hỏi thân mật: ~~見るか？~~ nghe rất thô (giọng ông chú). Chỉ cần **lên giọng**: {見|み}る？↗',
        'Thêm だ sau tính từ い: ~~忙しいだ~~ → {忙|いそが}しい. Và với bạn, câu hỏi ナA／N **bỏ だ**: {暇|ひま}？ (không ~~暇だ？~~).',
        'Từ chối với N／ナA quên だ: ~~アルバイトから~~ → アルバイト**だ**から; ~~暇じゃから~~ → {暇|ひま}じゃない**から**.',
        '**Với giám thị, thầy cô, người lạ: KHÔNG dùng thể thường.** Bài thi nói JPD chấm thái độ; うん／ううん là mất điểm.',
      ],
    },

    /* ── Tổng kết ── */
    { t: 'h', text: 'Tổng kết — câu hỏi của Bài 11 và cách trả lời' },
    {
      t: 'table',
      head: ['Câu hỏi / câu nói', 'Tình huống', 'Trả lời mẫu', 'ポイント'],
      rows: [
        ['いつも{何|なに}をしていますか。', 'Hỏi thói quen', 'アルバイトをしています。', '98'],
        ['{休|やす}みの{日|ひ}、よく{何|なに}をしていますか。', 'Hỏi ngày nghỉ', '～たり～たりしています。', '99'],
        ['{日本語|にほんご}の{勉強|べんきょう}はどうですか。', 'Hỏi cảm nhận', '{会話|かいわ}は～が、{作文|さくぶん}は～。', '100'],
        ['{暇|ひま}なとき、{何|なに}をしますか。', 'Hỏi "khi …"', '{暇|ひま}なとき、～ます。', '101'],
        ['いつ～を{始|はじ}めましたか。', 'Hỏi quá khứ', '{小学生|しょうがくせい}のとき、{始|はじ}めました。', '101'],
        ['{疲|つか}れたとき、どうしますか。', 'Hỏi cách xử lý', '{甘|あま}いものを{食|た}べます。', '102'],
        ['～{見|み}る？／～{忙|いそが}しい？', 'Bạn hỏi', 'うん、～。／ううん、～ない。', '103'],
        ['{一緒|いっしょ}に～ない？', 'Bạn rủ', 'いいね。／ごめん、～から。', '103'],
        ['～て。／～てもいい？', 'Bạn nhờ, xin phép', 'うん、いいよ。', '103'],
      ],
    },
    {
      t: 'build',
      id: 'b11-np-ghep',
      title: 'Ghép câu — dùng đủ 6 điểm ngữ pháp',
      items: [
        { vi: 'Sáng nào tôi cũng uống sữa.', chips: ['{毎朝|まいあさ}、', '{牛乳|ぎゅうにゅう}を', '{飲|の}んでいます', '{飲|の}みています', 'に'], answer: ['{毎朝|まいあさ}、', '{牛乳|ぎゅうにゅう}を', '{飲|の}んでいます'], ro: 'Maiasa, gyuunyuu o nonde imasu.' },
        { vi: 'Tôi đang làm thêm ở cửa hàng tiện lợi.', chips: ['コンビニで', 'アルバイトを', 'しています', 'コンビニに', 'しましょう'], answer: ['コンビニで', 'アルバイトを', 'しています'], ro: 'Konbini de arubaito o shite imasu.' },
        { vi: 'Ngày nghỉ tôi nghe nhạc, chơi game…', chips: ['{休|やす}みの{日|ひ}、', '{音楽|おんがく}を', '{聞|き}いたり', 'ゲームを', 'したり', 'しています', '{聞|き}きたり', 'です'], answer: ['{休|やす}みの{日|ひ}、', '{音楽|おんがく}を', '{聞|き}いたり', 'ゲームを', 'したり', 'しています'], ro: 'Yasumi no hi, ongaku o kiitari geemu o shitari shite imasu.' },
        { vi: 'Hội thoại thì thích, còn viết văn thì không thích.', chips: ['{会話|かいわ}は', '{好|す}きですが、', '{作文|さくぶん}は', '{好|す}きじゃありません', '{会話|かいわ}が', '{作文|さくぶん}を'], answer: ['{会話|かいわ}は', '{好|す}きですが、', '{作文|さくぶん}は', '{好|す}きじゃありません'], ro: 'Kaiwa wa suki desu ga, sakubun wa suki ja arimasen.' },
        { vi: 'Chỗ gần thì đi rồi, còn chỗ xa thì chưa đi.', chips: ['{近|ちか}いところへは', '{行|い}きましたが、', '{遠|とお}いところへは', 'まだ{行|い}っていません', '{近|ちか}いところをは', 'もう'], answer: ['{近|ちか}いところへは', '{行|い}きましたが、', '{遠|とお}いところへは', 'まだ{行|い}っていません'], ro: 'Chikai tokoro e wa ikimashita ga, tooi tokoro e wa mada itte imasen.' },
        { vi: 'Khi rảnh, tôi đọc tạp chí.', chips: ['{暇|ひま}な', 'とき、', '{雑誌|ざっし}を', '{読|よ}みます', '{暇|ひま}の', '{暇|ひま}'], answer: ['{暇|ひま}な', 'とき、', '{雑誌|ざっし}を', '{読|よ}みます'], ro: 'Hima na toki, zasshi o yomimasu.' },
        { vi: 'Hồi tiểu học, tôi bắt đầu học bơi.', chips: ['{小学生|しょうがくせい}の', 'とき、', '{水泳|すいえい}を', '{始|はじ}めました', '{小学生|しょうがくせい}な', '{始|はじ}まりました'], answer: ['{小学生|しょうがくせい}の', 'とき、', '{水泳|すいえい}を', '{始|はじ}めました'], ro: 'Shougakusei no toki, suiei o hajimemashita.' },
        { vi: 'Lúc (sắp) sang Nhật, bạn tôi tặng (cái này).', chips: ['{日本|にほん}へ', '{来|く}る', 'とき、', '{友達|ともだち}が', 'くれました', '{来|き}ます', 'もらいました'], answer: ['{日本|にほん}へ', '{来|く}る', 'とき、', '{友達|ともだち}が', 'くれました'], ro: 'Nihon e kuru toki, tomodachi ga kuremashita.' },
        { vi: 'Khi đi Ý, tôi mua cái túi này.', chips: ['イタリアへ', '{行|い}った', 'とき、', 'このかばんを', '{買|か}いました', '{行|い}きました', '{行|い}いた'], answer: ['イタリアへ', '{行|い}った', 'とき、', 'このかばんを', '{買|か}いました'], ro: 'Itaria e itta toki, kono kaban o kaimashita.' },
        { vi: 'Khi không có ca làm thêm, tôi đi chơi với bạn.', chips: ['アルバイトが', 'ない', 'とき、', '{友達|ともだち}と', '{遊|あそ}びます', 'ありません', 'あらない'], answer: ['アルバイトが', 'ない', 'とき、', '{友達|ともだち}と', '{遊|あそ}びます'], ro: 'Arubaito ga nai toki, tomodachi to asobimasu.' },
        { vi: 'Khi đau đầu, bạn làm thế nào?', chips: ['{頭|あたま}が', '{痛|いた}い', 'とき、', 'どうしますか', 'どうですか', '{痛|いた}いな'], answer: ['{頭|あたま}が', '{痛|いた}い', 'とき、', 'どうしますか'], ro: 'Atama ga itai toki, dou shimasu ka.' },
        { vi: '(Với bạn) Cậu hay xem phim truyền hình Nhật không?', chips: ['よく', '{日本|にほん}の', 'ドラマ', '{見|み}る？', '{見|み}ますか', 'か'], answer: ['よく', '{日本|にほん}の', 'ドラマ', '{見|み}る？'], ro: 'Yoku Nihon no dorama miru?' },
        { vi: '(Với bạn) Không, mình không bận.', chips: ['ううん、', '{忙|いそが}しくない', '{忙|いそが}しくないです', 'うん、', '{忙|いそが}しいじゃない'], answer: ['ううん、', '{忙|いそが}しくない'], ro: 'Uun, isogashiku nai.' },
        { vi: '(Với bạn) Cuối tuần đi ăn cơm cùng không?', chips: ['{週末|しゅうまつ}、', '{一緒|いっしょ}に', 'ご{飯|はん}', '{食|た}べない？', '{食|た}べませんか', '{食|た}べた？'], answer: ['{週末|しゅうまつ}、', '{一緒|いっしょ}に', 'ご{飯|はん}', '{食|た}べない？'], ro: 'Shuumatsu, issho ni gohan tabenai?' },
        { vi: '(Với bạn) Quán đó đắt nhưng ngon đấy.', chips: ['あの{店|みせ}、', '{高|たか}いけど、', 'おいしいよ', '{高|たか}いだけど、', 'おいしいです'], answer: ['あの{店|みせ}、', '{高|たか}いけど、', 'おいしいよ'], ro: 'Ano mise, takai kedo, oishii yo.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b11-np-kiem',
      title: 'Kiểm tra nhanh ngữ pháp Bài 11',
      items: [
        { q: 'Thể た của {行|い}きます là:', options: ['いきた', 'いいた', 'いった', 'いって'], correct: 2, why: 'Ngoại lệ giống thể て: {行|い}って → **{行|い}った**.' },
        { q: 'Thể た của {飲|の}みます là:', options: ['のみた', 'のんだ', 'のんた', 'のった'], correct: 1, why: '{飲|の}んで → で → **だ**: のんだ.' },
        { q: 'Thể た của {来|き}ます là:', options: ['きた', 'こた', 'くた', 'きった'], correct: 0, why: '{来|き}て → **{来|き}た** (đọc きた).' },
        { q: '"Sáng nào tôi cũng chạy bộ" (thói quen giai đoạn này):', options: ['{毎朝|まいあさ}、ジョギングをしました。', '{毎朝|まいあさ}、ジョギングをしています。', '{毎朝|まいあさ}に、ジョギングをしています。', '{毎朝|まいあさ}、ジョギングをしたりします。'], correct: 1, why: 'Thói quen → **～ています**; 毎朝 không có に (ポイント 98).' },
        { q: '「{休|やす}みの{日|ひ}、{本|ほん}を＿{音楽|おんがく}を{聞|き}いたりしています。」', options: ['{読|よ}んで', '{読|よ}んだり', '{読|よ}みたり', '{読|よ}むたり'], correct: 1, why: 'Thể た + り: **{読|よ}んだり** (ポイント 99).' },
        { q: '「{週末|しゅうまつ}、{買|か}い{物|もの}をしたり{映画|えいが}を{見|み}たり＿。」 (chuyện đã qua)', options: ['します', 'しています', 'しました', 'でした'], correct: 2, why: 'Thì của cả câu nằm ở します cuối → **しました**.' },
        { q: '「{近|ちか}いところ＿{行|い}きましたが、{遠|とお}いところ＿まだ{行|い}っていません。」', options: ['をは／をは', 'へは／へは', 'が／が', 'に／を'], correct: 1, why: 'へ + は → **へは** (hộp p.278, ポイント 100).' },
        { q: '「ひらがな＿{書|か}くことができますが、{漢字|かんじ}は{書|か}くことができません。」', options: ['を', 'をは', 'は', 'が'], correct: 2, why: 'を → **は** (を bị thay hẳn).' },
        { q: '"Khi rảnh":', options: ['{暇|ひま}とき', '{暇|ひま}なとき', '{暇|ひま}のとき', '{暇|ひま}いとき'], correct: 1, why: 'ナA + **な** + とき (ポイント 101).' },
        { q: '"Hồi học cấp hai":', options: ['{中学生|ちゅうがくせい}とき', '{中学生|ちゅうがくせい}なとき', '{中学生|ちゅうがくせい}のとき', '{中学生|ちゅうがくせい}だとき'], correct: 2, why: 'N + **の** + とき.' },
        { q: 'Mua từ điển ở sân bay NHẬT sau khi đã tới nơi:', options: ['{日本|にほん}へ{来|く}るとき、{空港|くうこう}で{辞書|じしょ}を{買|か}いました。', '{日本|にほん}へ{来|き}たとき、{空港|くうこう}で{辞書|じしょ}を{買|か}いました。', '{日本|にほん}へ{来|き}ますとき、{辞書|じしょ}を{買|か}いました。', '{日本|にほん}へ{来|こ}ないとき、{辞書|じしょ}を{買|か}いました。'], correct: 1, why: 'Đã tới nơi rồi mới mua → **Vたとき**.' },
        { q: '「{疲|つか}れたとき、どうしますか。」 — câu trả lời đúng kiểu:', options: ['{疲|つか}れました。', '{甘|あま}いものを{食|た}べます。', 'とても{疲|つか}れています。', 'いいですね。'], correct: 1, why: 'どうしますか → nói **việc mình làm** (ポイント 102).' },
        { q: 'Thể thường của {暇|ひま}じゃありませんでした:', options: ['{暇|ひま}じゃない', '{暇|ひま}じゃなかった', '{暇|ひま}だった', '{暇|ひま}くなかった'], correct: 1, why: 'ナA: じゃありませんでした → **じゃなかった** (表 p.284).' },
        { q: 'Thể thường của ありません:', options: ['あらない', 'ない', 'ありない', 'あるない'], correct: 1, why: 'Đặc biệt: ありません → **ない** (hộp p.279).' },
        { q: 'Bạn hỏi 「{毎日|まいにち}、{忙|いそが}しい？」 — bạn KHÔNG bận:', options: ['いいえ、{忙|いそが}しくないです。', 'ううん、{忙|いそが}しくない。', 'ううん、{忙|いそが}しいじゃない。', 'うん、{忙|いそが}しくない。'], correct: 1, why: 'Với bạn: **ううん** + thể thường phủ định **{忙|いそが}しくない**.' },
        { q: 'Bạn rủ 「{一緒|いっしょ}に{海|うみ}{行|い}かない？」 — bạn bận chuyển nhà:', options: ['ごめん、{引|ひ}っ{越|こ}しから。', 'ごめん、{引|ひ}っ{越|こ}しだから。', 'すみません、{引|ひ}っ{越|こ}しですから。', 'ううん、{行|い}く。'], correct: 1, why: 'N + **だ**から; với bạn dùng ごめん (ポイント 103).' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const KANJI: Lesson = {
  id: 'b11-kanji',
  kind: 'kanji',
  title: 'Chữ Hán — trong từ vựng Bài 11',
  goal: 'Nhận mặt và đọc đúng mọi từ chữ Hán trong 49 từ của Bài 11 (sinh hoạt, trường lớp, chuyện ngày trước) — đọc được cả khi KHÔNG có furigana như trong đề đọc; viết tay được các chữ ít nét, hay gặp.',
  minutes: 35,
  blocks: [
    {
      t: 'p',
      text: 'Phần Reading của đề thi có **4 từ chữ Hán gạch chân, KHÔNG có furigana (12 điểm)**. Học chữ Hán theo **cả từ** ({生活|せいかつ} = seikatsu, {小学生|しょうがくせい} = shougakusei) chứ đừng học chữ rời. **Âm On** (音, gốc Hán) thường dùng khi hai chữ Hán đứng cạnh nhau; **âm Kun** (訓, âm Nhật) khi chữ đứng một mình hoặc có đuôi kana ({頭|あたま}, {忘|わす}れます). Cột **Mức**: 👁 **nhận mặt** = đọc và hiểu được là đủ (phần lớn chữ — ưu tiên cho bài đọc); ✍ **nên viết** = chữ ít nét, gặp rất nhiều, nên tập viết tay.',
    },
    {
      t: 'table',
      caption: '1. Cuộc sống & học tập (chủ đề 1)',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['生', '✍', 'セイ・ショウ', 'い(きる)・う(まれる)', 'SINH (sống; học trò)', '{生活|せいかつ} (セイ) · {小学生|しょうがくせい} (セイ)'],
        ['活', '👁', 'カツ', '—', 'HOẠT (hoạt động)', '{生活|せいかつ}'],
        ['一', '✍', 'イチ・イツ', 'ひと(つ)', 'NHẤT (một)', '{一人|ひとり}{暮|ぐ}らし (đọc cả cụm ひとり)'],
        ['人', '✍', 'ジン・ニン', 'ひと', 'NHÂN (người)', '{一人|ひとり}{暮|ぐ}らし'],
        ['暮', '👁', 'ボ', 'く(らす)', 'MỘ (sinh sống; chiều tà)', '{一人|ひとり}{暮|ぐ}らし (く → **ぐ**)'],
        ['平', '👁', 'ヘイ・ビョウ', 'たい(ら)・ひら', 'BÌNH (bằng phẳng)', '{平日|へいじつ}'],
        ['日', '✍', 'ニチ・ジツ', 'ひ・か', 'NHẬT (ngày)', '{平日|へいじつ} (**ジツ**) · {日記|にっき} (**ニッ**)'],
        ['毎', '👁', 'マイ', '—', 'MỖI', '{毎週|まいしゅう}'],
        ['週', '👁', 'シュウ', '—', 'CHU (tuần)', '{毎週|まいしゅう}'],
        ['初', '👁', 'ショ', 'はじ(め)・はじ(めて)', 'SƠ (ban đầu)', '{初|はじ}め · {初|はじ}めて'],
        ['店', '👁', 'テン', 'みせ', 'ĐIẾM (cửa hàng)', '{店長|てんちょう}'],
        ['長', '👁', 'チョウ', 'なが(い)', 'TRƯỞNG／TRƯỜNG (người đứng đầu; dài)', '{店長|てんちょう}'],
        ['会', '✍', 'カイ', 'あ(う)', 'HỘI (gặp)', '{会話|かいわ}'],
        ['話', '👁', 'ワ', 'はな(す)・はなし', 'THOẠI (nói)', '{会話|かいわ}'],
        ['作', '👁', 'サク・サ', 'つく(る)', 'TÁC (làm ra)', '{作文|さくぶん}'],
        ['文', '✍', 'ブン・モン', 'ふみ', 'VĂN (câu văn)', '{作文|さくぶん}'],
        ['記', '👁', 'キ', 'しる(す)', 'KÝ (ghi)', '{日記|にっき}'],
        ['雑', '👁', 'ザツ・ゾウ', '—', 'TẠP (lẫn lộn)', '{雑誌|ざっし} (ザツ → **ザッ**)'],
        ['誌', '👁', 'シ', '—', 'CHÍ (ghi chép)', '{雑誌|ざっし}'],
        ['頭', '👁', 'トウ・ズ', 'あたま', 'ĐẦU', '{頭|あたま}'],
      ],
    },
    {
      t: 'table',
      caption: '2. Động từ & cảm giác (chủ đề 1)',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['休', '✍', 'キュウ', 'やす(む)', 'HƯU (nghỉ)', '{休|やす}みます'],
        ['終', '👁', 'シュウ', 'お(わる)', 'CHUNG (kết thúc)', '{終|お}わります'],
        ['通', '👁', 'ツウ', 'かよ(う)・とお(る)', 'THÔNG (đi qua)', '{通|かよ}います'],
        ['慣', '👁', 'カン', 'な(れる)', 'QUÁN (quen)', '{慣|な}れます'],
        ['忘', '👁', 'ボウ', 'わす(れる)', 'VONG (quên)', '{忘|わす}れます'],
        ['散', '👁', 'サン', 'ち(る)', 'TÁN (tản ra)', '{散歩|さんぽ}します'],
        ['歩', '👁', 'ホ・ポ', 'ある(く)', 'BỘ (đi bộ)', '{散歩|さんぽ} (ホ → **ポ**)'],
        ['寂', '👁', 'ジャク・セキ', 'さび(しい)', 'TỊCH (vắng lặng)', '{寂|さび}しい'],
        ['眠', '👁', 'ミン', 'ねむ(い)・ねむ(る)', 'MIÊN (ngủ)', '{眠|ねむ}い'],
      ],
    },
    {
      t: 'table',
      caption: '3. Tôi ngày trước (chủ đề 2)',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['小', '✍', 'ショウ', 'ちい(さい)・こ', 'TIỂU (nhỏ)', '{小学生|しょうがくせい}'],
        ['中', '✍', 'チュウ', 'なか', 'TRUNG (giữa)', '{中学生|ちゅうがくせい}'],
        ['学', '✍', 'ガク', 'まな(ぶ)', 'HỌC', '{小学生|しょうがくせい} · {入学|にゅうがく}'],
        ['外', '✍', 'ガイ・ゲ', 'そと', 'NGOẠI (ngoài)', '{外国|がいこく}'],
        ['国', '👁', 'コク', 'くに', 'QUỐC (nước)', '{外国|がいこく} (コク)'],
        ['手', '✍', 'シュ', 'て', 'THỦ (tay; người làm nghề)', '{選手|せんしゅ}'],
        ['選', '👁', 'セン', 'えら(ぶ)', 'TUYỂN (chọn)', '{選手|せんしゅ}'],
        ['父', '✍', 'フ', 'ちち', 'PHỤ (cha)', '{祖父|そふ}'],
        ['祖', '👁', 'ソ', '—', 'TỔ (ông bà, tổ tiên)', '{祖父|そふ}'],
        ['入', '✍', 'ニュウ', 'はい(る)・い(れる)', 'NHẬP (vào)', '{入学|にゅうがく}します'],
        ['卒', '👁', 'ソツ', '—', 'TỐT (xong)', '{卒業|そつぎょう}します'],
        ['業', '👁', 'ギョウ', 'わざ', 'NGHIỆP (việc học, nghề)', '{卒業|そつぎょう}'],
        ['始', '👁', 'シ', 'はじ(める)・はじ(まる)', 'THỦY (bắt đầu)', '{始|はじ}めます'],
        ['別', '👁', 'ベツ', 'わか(れる)', 'BIỆT (chia ra)', '{別|わか}れます'],
      ],
    },
    {
      t: 'table',
      caption: '4. Với bạn bè (chủ đề 3)',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['消', '👁', 'ショウ', 'け(す)・き(える)', 'TIÊU (tắt, mất đi)', '{消|け}します'],
        ['引', '👁', 'イン', 'ひ(く)', 'DẪN (kéo)', '{引|ひ}っ{越|こ}し'],
        ['越', '👁', 'エツ', 'こ(す)', 'VIỆT (vượt qua)', '{引|ひ}っ{越|こ}し'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ',
      items: [
        '**Hán Việt đoán nghĩa**: 生活 = SINH HOẠT, 会話 = HỘI THOẠI, 作文 = TÁC VĂN (làm văn), 日記 = NHẬT KÝ, 雑誌 = TẠP CHÍ, 平日 = BÌNH NHẬT (ngày bình thường), 店長 = ĐIẾM TRƯỞNG, 外国 = NGOẠI QUỐC, 選手 = TUYỂN THỦ, 祖父 = TỔ PHỤ (ông), 卒業 = TỐT NGHIỆP, 入学 = NHẬP HỌC, 散歩 = TẢN BỘ. Hầu hết từ Hán Nhật của bài này **giống hệt tiếng Việt** — tận dụng!',
        '**小・中・大**: {小学生|しょうがくせい} (tiểu học) → {中学生|ちゅうがくせい} (cấp hai) → {高校生|こうこうせい} (cấp ba) → {大学生|だいがくせい} (đại học). Ba chữ 小 中 大 đều ✍ — viết được là đọc được cả chuỗi.',
        '**初 ↔ 始**: cùng đọc はじ. **{初|はじ}め／{初|はじ}めて** (lần đầu, lúc đầu — chữ có bộ 衣 "áo" + 刀 "dao": cắt vải là bước đầu may áo); **{始|はじ}めます** (bắt đầu một việc — bộ 女).',
        '**休** = 人 (người) + 木 (cây): người dựa gốc cây = nghỉ.',
        '**Đọc đặc biệt**: 一人 **ひとり** (đọc cả cụm) · 一人暮らし ひとり**ぐ**らし · 日記 **にっ**き · 雑誌 **ざっ**し · 散歩 さん**ぽ** · 平日 へい**じつ**.',
      ],
    },
    {
      t: 'mcq',
      id: 'b11-kj-doc',
      title: 'Đọc chữ Hán — chọn cách đọc đúng',
      items: [
        { q: '生活', options: ['せいかつ', 'しょうかつ', 'せいかち', 'いきかつ'], correct: 0, why: '生 セイ + 活 カツ = **せいかつ**.' },
        { q: '一人暮らし', options: ['いちにんくらし', 'ひとりくらし', 'ひとりぐらし', 'ひとりぼし'], correct: 2, why: 'くらし → **ぐらし** khi ghép: ひとりぐらし.' },
        { q: '平日', options: ['へいにち', 'へいじつ', 'ひらび', 'びょうじつ'], correct: 1, why: '日 đọc **ジツ** ở đây: へいじつ.' },
        { q: '毎週', options: ['まいしゅ', 'まいしゅう', 'まいにち', 'まいとし'], correct: 1, why: '**まいしゅう** (trường âm しゅう).' },
        { q: '日記', options: ['にちき', 'ひき', 'にっき', 'にき'], correct: 2, why: 'ニチ + キ → **にっき** (âm ngắt).' },
        { q: '雑誌', options: ['ざつし', 'ざっし', 'ぞうし', 'ざし'], correct: 1, why: 'ザツ + シ → **ざっし**.' },
        { q: '会話', options: ['かいわ', 'あいわ', 'かいはな', 'かわ'], correct: 0, why: '**かいわ** — hội thoại.' },
        { q: '作文', options: ['さくもん', 'さぶん', 'さくぶん', 'つくぶん'], correct: 2, why: '**さくぶん** — viết văn.' },
        { q: '店長', options: ['てんなが', 'みせちょう', 'てんちょう', 'てんちょ'], correct: 2, why: '**てんちょう** — cửa hàng trưởng.' },
        { q: '初め', options: ['はじめ', 'しょめ', 'はつめ', 'うぶめ'], correct: 0, why: '**はじめ** — lúc đầu.' },
        { q: '頭', options: ['あたま', 'かお', 'くび', 'とう'], correct: 0, why: 'Đứng riêng = **あたま** (đầu).' },
        { q: '慣れます', options: ['かんれます', 'なれます', 'なられます', 'ねれます'], correct: 1, why: '**なれます** — quen.' },
        { q: '忘れます', options: ['わすれます', 'ぼうれます', 'わかれます', 'なれます'], correct: 0, why: '**わすれます** — quên. (別れます = わかれます: chia tay)' },
        { q: '通います', options: ['とおいます', 'かよいます', 'つういます', 'かいます'], correct: 1, why: '**かよいます** — đi học đều đặn.' },
        { q: '散歩', options: ['さんほ', 'さんぽ', 'さんぼ', 'ちるほ'], correct: 1, why: 'ホ → **ぽ**: さんぽ.' },
        { q: '寂しい', options: ['さびしい', 'さみしい', 'じゃくしい', 'せきしい'], correct: 0, why: 'Sách dùng **さびしい** (khẩu ngữ cũng nói さみしい).' },
        { q: '小学生', options: ['しょうがくせい', 'こがくせい', 'しょがくせい', 'しょうがっせい'], correct: 0, why: '**しょうがくせい**.' },
        { q: '中学生', options: ['なかがくせい', 'ちゅうがくせい', 'ちゅがくせい', 'ちゅうがっせい'], correct: 1, why: '**ちゅうがくせい** (trường âm ちゅう).' },
        { q: '外国', options: ['そとくに', 'がいこく', 'げこく', 'がいごく'], correct: 1, why: '**がいこく** — nước ngoài.' },
        { q: '選手', options: ['せんしゅ', 'せんて', 'えらしゅ', 'せんじゅ'], correct: 0, why: '**せんしゅ** — vận động viên.' },
        { q: '祖父', options: ['そぶ', 'そふ', 'そちち', 'じいふ'], correct: 1, why: '**そふ** — ông (của mình).' },
        { q: '卒業', options: ['そつぎょう', 'そつごう', 'そつぎょ', 'そっぎょう'], correct: 0, why: '**そつぎょう** — tốt nghiệp.' },
        { q: '入学', options: ['はいがく', 'にゅうがく', 'いりがく', 'にゅがく'], correct: 1, why: '**にゅうがく** — nhập học.' },
        { q: '引っ越し', options: ['いんこし', 'ひっこし', 'ひきこし', 'ひっこえし'], correct: 1, why: '**ひっこし** — chuyển nhà.' },
        { q: '消します', options: ['しょうします', 'きします', 'けします', 'けいします'], correct: 2, why: '**けします** — tắt. (消しゴム = けしゴム)' },
      ],
    },

    /* ── Đứng riêng hay đứng chung ── */
    { t: 'h', text: 'Đứng riêng hay đứng chung — một chữ, hai cách đọc' },
    {
      t: 'p',
      text: 'Quy tắc gần đúng: **chữ đứng một mình / có đuôi kana → âm Kun** (âm Nhật); **hai chữ Hán ghép với nhau → âm On** (âm Hán). Bảng dưới là các chữ Bài 11 có cả hai cách đọc — đọc hàng ngang để thấy cùng một chữ đổi âm thế nào. Nhiều từ ghép ở cột phải đã học ở bài trước.',
    },
    {
      t: 'table',
      caption: 'Chữ Bài 11 — đứng riêng (Kun) ↔ trong từ ghép (On)',
      head: ['Chữ', 'Đứng riêng (Kun)', 'Trong từ ghép (On)'],
      rows: [
        ['生', '{生|い}きます — sống · {生|う}まれます — được sinh ra', '{生活|せいかつ} — cuộc sống · {学生|がくせい} — học sinh · {先生|せんせい} — giáo viên'],
        ['会', '{会|あ}います — gặp (B6)', '{会話|かいわ} — hội thoại · {会社|かいしゃ} — công ty (B1)'],
        ['話', '{話|はな}します — nói · {話|はなし} — câu chuyện', '{会話|かいわ} — hội thoại · {電話|でんわ} — điện thoại'],
        ['作', '{作|つく}ります — làm, nấu', '{作文|さくぶん} — bài văn'],
        ['日', '{日|ひ} — ngày · {休|やす}みの{日|ひ}', '{日記|にっき} (ニッ) · {毎日|まいにち} (ニチ) · {平日|へいじつ} (ジツ)'],
        ['一', '{一|ひと}つ — một cái · {一人|ひとり} (cả cụm)', '{一週間|いっしゅうかん} — một tuần (イッ) · {一回|いっかい}'],
        ['人', '{人|ひと} — người', '{日本人|にほんじん} (ジン) · {三人|さんにん} (ニン)'],
        ['店', '{店|みせ} — cửa hàng', '{店長|てんちょう} · {店員|てんいん} — nhân viên cửa hàng'],
        ['長', '{長|なが}い — dài', '{店長|てんちょう} · {社長|しゃちょう} — giám đốc'],
        ['初', '{初|はじ}め — lúc đầu · {初|はじ}めて — lần đầu', '{初級|しょきゅう} — sơ cấp (tên sách: できる日本語 **初級**)'],
        ['休', '{休|やす}みます — nghỉ', '{休日|きゅうじつ} — ngày nghỉ'],
        ['終', '{終|お}わります — kết thúc', '{終点|しゅうてん} — bến cuối'],
        ['通', '{通|かよ}います — đi học đều', '{交通|こうつう} — giao thông'],
        ['歩', '{歩|ある}きます — đi bộ (B10)', '{散歩|さんぽ} — đi dạo (ポ)'],
        ['頭', '{頭|あたま} — đầu', '{頭痛|ずつう} — đau đầu (ズ)'],
        ['小', '{小|ちい}さい — nhỏ', '{小学生|しょうがくせい} (ショウ)'],
        ['中', '{中|なか} — bên trong', '{中学生|ちゅうがくせい} · {中国|ちゅうごく} — Trung Quốc'],
        ['学', '{学|まな}びます — học (ít dùng ở sơ cấp)', '{大学|だいがく} · {小学生|しょうがくせい} · {入学|にゅうがく}'],
        ['外', '{外|そと} — bên ngoài', '{外国|がいこく} — nước ngoài · {外国人|がいこくじん}'],
        ['国', '{国|くに} — nước, quê nhà ({国|くに}の{家族|かぞく})', '{外国|がいこく} (コク) · {中国|ちゅうごく} (ゴク — biến âm)'],
        ['手', '{手|て} — tay', '{選手|せんしゅ} · {歌手|かしゅ} — ca sĩ · {上手|じょうず} (đặc biệt)'],
        ['父', '{父|ちち} — bố (mình)', '{祖父|そふ} — ông (mình)'],
        ['入', '{入|はい}ります — vào', '{入学|にゅうがく} — nhập học'],
        ['始', '{始|はじ}めます — bắt đầu', '{開始|かいし} — khai mạc, bắt đầu'],
        ['別', '{別|わか}れます — chia tay', '{特別|とくべつ} — đặc biệt'],
        ['消', '{消|け}します — tắt', '{消防|しょうぼう} — cứu hoả'],
      ],
    },
    {
      t: 'note',
      title: 'Cách đọc bất quy tắc hay gặp trong bài (thuộc lòng)',
      items: [
        '**Đọc cả cụm (熟字訓)**: {一人|ひとり} (~~いちにん~~), {二人|ふたり}, {今日|きょう}, {上手|じょうず} — không ghép từ âm từng chữ.',
        '**Biến âm đục** khi ghép: ひとり + くらし → ひとり**ぐ**らし; さん + ほ → さん**ぽ**; ちゅう + こく → ちゅう**ごく**.',
        '**Âm ngắt っ** khi On gặp phụ âm k/s/t/p: にち + き → **にっ**き; ざつ + し → **ざっ**し; いち + しゅうかん → **いっ**しゅうかん; ひき + こし → **ひっ**こし.',
        '**Một chữ nhiều âm On**: 日 = ニチ ({毎日|まいにち}) / ジツ ({平日|へいじつ}); 人 = ジン ({日本人|にほんじん}) / ニン ({三人|さんにん}); 生 = セイ ({生活|せいかつ}) / ショウ ({一生|いっしょう} — "cả đời").',
      ],
    },

    /* ── Đọc không furigana ── */
    { t: 'h', text: 'Từ chữ Hán hay gặp trong đề đọc — đọc KHÔNG furigana' },
    {
      t: 'p',
      text: 'Đề Reading in chữ Hán **không có furigana**. Luyện: nhìn câu (chữ Hán để trần), **đọc to** trước, rồi mới bấm hiện cách đọc + nghe máy đọc, tự chấm đúng/sai. Câu ngắn trước, đoạn dài sau. Chưa đọc được từ nào thì quay lại bảng chữ ở trên.',
    },
    {
      t: 'readkanji',
      id: 'b11-doc-kanji',
      title: 'Đọc to từng câu — từ chữ Hán Bài 11',
      note: 'Mỗi câu có ít nhất một từ chữ Hán của Bài 11. Chỗ hay sai: 一人暮らし ひとりぐらし, 平日 へいじつ, 日記 にっき, 雑誌 ざっし, 散歩 さんぽ, 中学生 ちゅうがくせい, 卒業 そつぎょう.',
      items: [
        { text: 'にほんの{生活|せいかつ}にもう{慣|な}れましたか。', ro: 'Nihon no seikatsu ni mou naremashita ka.', vi: 'Bạn đã quen với cuộc sống ở Nhật chưa?' },
        { text: '{一人|ひとり}{暮|ぐ}らしは{初|はじ}めは{寂|さび}しかったです。', ro: 'Hitorigurashi wa hajime wa sabishikatta desu.', vi: 'Sống một mình, lúc đầu thì thấy cô đơn.' },
        { text: '{平日|へいじつ}はがっこうでべんきょうしています。', ro: 'Heijitsu wa gakkou de benkyou shite imasu.', vi: 'Ngày thường tôi học ở trường.' },
        { text: '{毎週|まいしゅう}どようび、しょどうきょうしつに{通|かよ}っています。', ro: 'Maishuu doyoubi, shodou kyoushitsu ni kayotte imasu.', vi: 'Thứ Bảy hằng tuần tôi đi học lớp thư pháp.' },
        { text: 'じゅぎょうはいちじに{終|お}わります。', ro: 'Jugyou wa ichiji ni owarimasu.', vi: 'Giờ học kết thúc lúc 1 giờ.' },
        { text: '{会話|かいわ}はすきですが、{作文|さくぶん}はすきじゃありません。', ro: 'Kaiwa wa suki desu ga, sakubun wa suki ja arimasen.', vi: 'Hội thoại thì thích, còn viết văn thì không.' },
        { text: 'まいばん、にほんごで{日記|にっき}をかいています。', ro: 'Maiban, Nihongo de nikki o kaite imasu.', vi: 'Tối nào tôi cũng viết nhật ký bằng tiếng Nhật.' },
        { text: 'ひまなとき、{雑誌|ざっし}をよんだりおんがくをきいたりします。', ro: 'Hima na toki, zasshi o yondari ongaku o kiitari shimasu.', vi: 'Khi rảnh tôi đọc tạp chí, nghe nhạc…' },
        { text: '{頭|あたま}がいたいとき、くすりをのみます。', ro: 'Atama ga itai toki, kusuri o nomimasu.', vi: 'Khi đau đầu, tôi uống thuốc.' },
        { text: 'かぜをひいたとき、がっこうを{休|やす}みます。', ro: 'Kaze o hiita toki, gakkou o yasumimasu.', vi: 'Khi bị cảm, tôi nghỉ học.' },
        { text: 'アルバイトをやすむとき、{店長|てんちょう}にでんわします。', ro: 'Arubaito o yasumu toki, tenchou ni denwa shimasu.', vi: 'Khi nghỉ làm thêm, tôi gọi điện cho cửa hàng trưởng.' },
        { text: 'よくかんじを{忘|わす}れます。', ro: 'Yoku kanji o wasuremasu.', vi: 'Tôi hay quên chữ Hán.' },
        { text: 'てんきがいいとき、こうえんを{散歩|さんぽ}します。', ro: 'Tenki ga ii toki, kouen o sanpo shimasu.', vi: 'Khi trời đẹp, tôi đi dạo công viên.' },
        { text: 'じゅぎょうのまえは、いつも{眠|ねむ}いです。', ro: 'Jugyou no mae wa, itsumo nemui desu.', vi: 'Trước giờ học lúc nào tôi cũng buồn ngủ.' },
        { text: '{小学生|しょうがくせい}のとき、すいえいを{始|はじ}めました。', ro: 'Shougakusei no toki, suiei o hajimemashita.', vi: 'Hồi tiểu học, tôi bắt đầu học bơi.' },
        { text: '{中学生|ちゅうがくせい}のとき、テレビでオリンピックをみました。', ro: 'Chuugakusei no toki, terebi de orinpikku o mimashita.', vi: 'Hồi cấp hai, tôi xem Olympic trên TV.' },
        { text: 'すいえいの{選手|せんしゅ}がかっこよかったです。', ro: 'Suiei no senshu ga kakkoyokatta desu.', vi: 'Các vận động viên bơi rất ngầu.' },
        { text: 'だいがくせいのとき、はじめて{外国|がいこく}へいきました。', ro: 'Daigakusei no toki, hajimete gaikoku e ikimashita.', vi: 'Hồi sinh viên, lần đầu tôi đi nước ngoài.' },
        { text: 'だいがくに{入学|にゅうがく}したとき、{祖父|そふ}にとけいをもらいました。', ro: 'Daigaku ni nyuugaku shita toki, sofu ni tokei o moraimashita.', vi: 'Khi vào đại học, tôi được ông tặng đồng hồ.' },
        { text: 'こうこうを{卒業|そつぎょう}したとき、ともだちと{別|わか}れました。', ro: 'Koukou o sotsugyou shita toki, tomodachi to wakaremashita.', vi: 'Khi tốt nghiệp cấp ba, tôi chia tay các bạn.' },
        { text: 'ねるとき、でんきを{消|け}します。', ro: 'Neru toki, denki o keshimasu.', vi: 'Khi đi ngủ, tôi tắt đèn.' },
        { text: 'しゅうまつは{引|ひ}っ{越|こ}しです。', ro: 'Shuumatsu wa hikkoshi desu.', vi: 'Cuối tuần tôi chuyển nhà.' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b11-doc-doan',
      title: 'Đọc to cả đoạn — khuôn đề Reading (~100 chữ)',
      note: 'Mỗi đoạn ~100 chữ, khoảng 4 từ chữ Hán + vài từ katakana như đề thật. Đọc liền mạch, không dừng giữa từ.',
      items: [
        {
          text: 'わたしはきょねんのしがつににほんへきました。{初|はじ}めはすこし{寂|さび}しかったですが、いまはにほんの{生活|せいかつ}に{慣|な}れました。{平日|へいじつ}はがっこうでべんきょうしています。いっしゅうかんににかい、レストランでアルバイトをしています。まいにちいそがしいですが、たのしいです。',
          ro: 'Watashi wa kyonen no shigatsu ni Nihon e kimashita. Hajime wa sukoshi sabishikatta desu ga, ima wa Nihon no seikatsu ni naremashita. Heijitsu wa gakkou de benkyou shite imasu. Isshuukan ni nikai, resutoran de arubaito o shite imasu. Mainichi isogashii desu ga, tanoshii desu.',
          vi: 'Tôi sang Nhật vào tháng 4 năm ngoái. Lúc đầu hơi cô đơn, nhưng giờ tôi đã quen với cuộc sống ở Nhật. Ngày thường tôi học ở trường. Một tuần 2 lần tôi làm thêm ở nhà hàng. Ngày nào cũng bận nhưng vui.',
        },
        {
          text: 'やすみのひ、わたしはたいていこうえんへいって、{散歩|さんぽ}したりジョギングをしたりしています。あめのときは、へやで{雑誌|ざっし}をよんだりテレビをみたりします。ばんごはんのあとで、にほんごで{日記|にっき}をかいています。でも、よくかんじを{忘|わす}れます。',
          ro: 'Yasumi no hi, watashi wa taitei kouen e itte, sanpo shitari jogingu o shitari shite imasu. Ame no toki wa, heya de zasshi o yondari terebi o mitari shimasu. Bangohan no ato de, Nihongo de nikki o kaite imasu. Demo, yoku kanji o wasuremasu.',
          vi: 'Ngày nghỉ tôi thường ra công viên đi dạo, chạy bộ… Khi mưa thì tôi ở trong phòng đọc tạp chí, xem TV… Sau bữa tối tôi viết nhật ký bằng tiếng Nhật. Nhưng tôi hay quên chữ Hán.',
        },
        {
          text: 'わたしのしゅみはサッカーです。{小学生|しょうがくせい}のとき、テレビでワールドカップをみました。{選手|せんしゅ}がとてもかっこよかったですから、サッカーがすきになりました。それで、サッカーを{始|はじ}めました。いまもまいしゅうにちようび、クラスメイトとしあいをしています。',
          ro: 'Watashi no shumi wa sakkaa desu. Shougakusei no toki, terebi de waarudo kappu o mimashita. Senshu ga totemo kakkoyokatta desu kara, sakkaa ga suki ni narimashita. Sorede, sakkaa o hajimemashita. Ima mo maishuu nichiyoubi, kurasumeito to shiai o shite imasu.',
          vi: 'Sở thích của tôi là bóng đá. Hồi tiểu học tôi xem World Cup trên TV. Các cầu thủ rất ngầu nên tôi thích bóng đá. Vì thế tôi bắt đầu chơi. Bây giờ Chủ Nhật hằng tuần tôi vẫn đá với bạn cùng lớp.',
        },
        {
          text: 'このとけいは、わたしがだいがくに{入学|にゅうがく}したとき、{祖父|そふ}がくれました。そふはわたしが{中学生|ちゅうがくせい}のとき、{外国|がいこく}へいきましたから、あまりあうことができませんでした。わたしのたいせつなとけいです。こうこうを{卒業|そつぎょう}したときのしゃしんもあります。',
          ro: 'Kono tokei wa, watashi ga daigaku ni nyuugaku shita toki, sofu ga kuremashita. Sofu wa watashi ga chuugakusei no toki, gaikoku e ikimashita kara, amari au koto ga dekimasen deshita. Watashi no taisetsu na tokei desu. Koukou o sotsugyou shita toki no shashin mo arimasu.',
          vi: 'Chiếc đồng hồ này ông tặng tôi khi tôi vào đại học. Hồi tôi học cấp hai ông ra nước ngoài nên tôi không gặp ông được mấy. Đây là chiếc đồng hồ quý của tôi. Tôi cũng có ảnh lúc tốt nghiệp cấp ba.',
        },
      ],
    },

    {
      t: 'write',
      id: 'b11-viet-kanji',
      title: 'Tập viết tay chữ Hán Bài 11 — ✍ chữ nên viết trước, rồi đến chữ nhận mặt',
      note: '14 chữ đầu là nhóm ✍ nên viết (ít nét, gặp rất nhiều) — viết cho thạo. Phần còn lại là 👁 nhận mặt: viết thử một lượt để nhớ mặt chữ là đủ. Bấm ▶ Thứ tự nét trước khi viết; viết xong nhờ ✨ AI xem chữ.',
      chars: ['一', '人', '日', '生', '会', '文', '休', '小', '中', '学', '外', '手', '父', '入', '活', '暮', '平', '毎', '週', '初', '店', '長', '話', '作', '記', '雑', '誌', '頭', '終', '通', '慣', '忘', '散', '歩', '寂', '眠', '国', '選', '祖', '卒', '業', '始', '別', '消', '引', '越'],
    },
  ],
};

/* ═══════════════════════════ 5. NGHE ═══════════════════════════ */

const NGHE: Lesson = {
  id: 'b11-nghe',
  kind: 'listening',
  title: 'Luyện nghe — ngày nghỉ làm gì? ảnh nào? nói theo thứ tự nào?',
  goal: 'Nghe người khác kể sinh hoạt và ngày nghỉ để biết ai làm gì, nghe kể chuyện ngày trước để điền niên biểu, nghe bạn bè nói thể thường để nắm nội dung và thứ tự, và phân biệt câu trả lời có/không ở thể thường.',
  minutes: 45,
  blocks: [
    {
      t: 'note',
      title: 'Cách nghe',
      items: [
        '**～たり～たり**: người nói kể **hai (hoặc hơn) việc** — ghi đủ cả hai. Đuôi **～たりしています** = thói quen; **～たりしました** = chuyện đã qua.',
        '**～とき** chia câu thành "điều kiện" và "việc làm": bắt cặp **{雨|あめ}のとき → …**, **{暇|ひま}なとき → …**. Câu hỏi hay hỏi đúng cặp đó.',
        '**Kể chuyện ngày trước**: bắt **mốc tuổi / cấp học** ({5歳|ごさい}, {中学生|ちゅうがくせい}, {大学生|だいがくせい}) và **từ chuyển** {初|はじ}めは… → だんだん… → それで….',
        '**Thể thường**: câu hỏi **không có か** — nghe ngữ điệu lên cuối câu. **ううん** (không) và **うん** (có) rất ngắn, dễ lẫn: ううん dài hơn, xuống–lên–xuống. Đuôi **～ない** = phủ định, **～なかった** = quá khứ phủ định.',
        'Bẫy: câu **{初|はじ}めは～が、{今|いま}は～** — câu hỏi hỏi về **bây giờ** thì lấy vế sau.',
      ],
    },

    /* ── Bài 1 ── */
    { t: 'h', text: 'Bài 1 — Ngày nghỉ, lúc rảnh bạn làm gì? (やってみよう)' },
    {
      t: 'p',
      text: 'Nghe hai đoạn hội thoại. Mỗi người thường làm gì vào ngày nghỉ hoặc lúc rảnh? Chọn trong bảng các việc ⓐ–ⓗ.',
    },
    {
      t: 'table',
      caption: 'Các việc (tả thay cho tranh)',
      head: ['Kí hiệu', 'Việc'],
      rows: [
        ['ⓐ', 'Xem phim ở nhà'],
        ['ⓑ', 'Đạp xe ra biển'],
        ['ⓒ', 'Đi lớp nấu ăn, làm bánh'],
        ['ⓓ', 'Chơi game'],
        ['ⓔ', 'Chạy bộ buổi sáng'],
        ['ⓕ', 'Đọc tạp chí ở thư viện'],
        ['ⓖ', 'Đi karaoke với bạn'],
        ['ⓗ', 'Đá bóng'],
      ],
    },
    {
      t: 'listen',
      id: 'b11-ng-1a',
      title: '① アンナ と ナタポン',
      note: 'Bắt: ～たり～たり (hai việc) và câu ～とき.',
      lines: [
        { who: 'アンナ', voice: 'ja-nu', text: 'ナタポンさんは{休|やす}みの{日|ひ}、よく{何|なに}をしていますか。', ro: 'Natapon-san wa yasumi no hi, yoku nani o shite imasu ka.', vi: 'Natapon, ngày nghỉ bạn hay làm gì?' },
        { who: 'ナタポン', voice: 'ja-nam', text: 'そうですねえ。たいてい{部屋|へや}で{映画|えいが}を{見|み}たりゲームをしたりしています。', ro: 'Sou desu nee. Taitei heya de eiga o mitari geemu o shitari shite imasu.', vi: 'Để xem. Thường thì tôi ở trong phòng xem phim, chơi game…' },
        { who: 'アンナ', voice: 'ja-nu', text: '{外|そと}へは{行|い}きませんか。', ro: 'Soto e wa ikimasen ka.', vi: 'Bạn không ra ngoài à?' },
        { who: 'ナタポン', voice: 'ja-nam', text: '{天気|てんき}がいいとき、{自転車|じてんしゃ}で{海|うみ}へ{行|い}きます。アンナさんは？', ro: 'Tenki ga ii toki, jitensha de umi e ikimasu. Anna-san wa?', vi: 'Khi trời đẹp thì tôi đạp xe ra biển. Còn Anna?' },
        { who: 'アンナ', voice: 'ja-nu', text: '{私|わたし}は{毎週|まいしゅう}{土曜日|どようび}、{料理|りょうり}{教室|きょうしつ}に{通|かよ}っています。{暇|ひま}なとき、うちでケーキを{作|つく}ります。', ro: 'Watashi wa maishuu doyoubi, ryouri kyoushitsu ni kayotte imasu. Hima na toki, uchi de keeki o tsukurimasu.', vi: 'Tôi thì thứ Bảy hằng tuần đi học lớp nấu ăn. Khi rảnh thì tôi làm bánh ở nhà.' },
        { who: 'ナタポン', voice: 'ja-nam', text: 'へえ、すごいですね。', ro: 'Hee, sugoi desu ne.', vi: 'Ồ, giỏi quá nhỉ.' },
      ],
    },
    {
      t: 'listen',
      id: 'b11-ng-1b',
      title: '② {西川|にしかわ} と ワン',
      lines: [
        { who: 'ワン', voice: 'ja-nu', text: '{西川|にしかわ}さん、{暇|ひま}なとき、どんなことをしていますか。', ro: 'Nishikawa-san, hima na toki, donna koto o shite imasu ka.', vi: 'Anh Nishikawa, lúc rảnh anh thường làm những gì?' },
        { who: '西川', voice: 'ja-nam', text: '{毎朝|まいあさ}、{公園|こうえん}でジョギングをしています。それから、{日曜日|にちようび}はサッカーの{試合|しあい}があります。', ro: 'Maiasa, kouen de jogingu o shite imasu. Sorekara, nichiyoubi wa sakkaa no shiai ga arimasu.', vi: 'Sáng nào tôi cũng chạy bộ ở công viên. Còn Chủ Nhật thì có trận bóng đá.' },
        { who: 'ワン', voice: 'ja-nu', text: '{雨|あめ}のときは？', ro: 'Ame no toki wa?', vi: 'Còn khi trời mưa?' },
        { who: '西川', voice: 'ja-nam', text: '{雨|あめ}のときは、{図書館|としょかん}へ{行|い}って、{雑誌|ざっし}を{読|よ}みます。ワンさんは？', ro: 'Ame no toki wa, toshokan e itte, zasshi o yomimasu. Wan-san wa?', vi: 'Khi mưa thì tôi đến thư viện đọc tạp chí. Còn Wang?' },
        { who: 'ワン', voice: 'ja-nu', text: '{私|わたし}は{友達|ともだち}とカラオケに{行|い}ったり、{買|か}い{物|もの}をしたりしています。{一人|ひとり}のときは、{寝|ね}ています。', ro: 'Watashi wa tomodachi to karaoke ni ittari, kaimono o shitari shite imasu. Hitori no toki wa, nete imasu.', vi: 'Tôi thì đi karaoke, mua sắm… với bạn. Lúc một mình thì tôi ngủ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b11-ng-1-q',
      title: 'Câu hỏi bài 1 — ai làm gì?',
      items: [
        { q: 'ナタポンさんは{休|やす}みの{日|ひ}、たいてい{何|なに}をしていますか。', options: ['ⓐとⓓ', 'ⓑとⓗ', 'ⓒとⓖ', 'ⓔとⓕ'], correct: 0, why: '{部屋|へや}で**{映画|えいが}を{見|み}たりゲームをしたり**しています → ⓐ + ⓓ.' },
        { q: 'ナタポンさんは{天気|てんき}がいいとき、どうしますか。', options: ['ⓔ', 'ⓑ', 'ⓗ', 'ⓖ'], correct: 1, why: '{天気|てんき}がいいとき、**{自転車|じてんしゃ}で{海|うみ}へ**{行|い}きます → ⓑ.' },
        { q: 'アンナさんは{暇|ひま}なとき、{何|なに}をしますか。', options: ['ⓐ', 'ⓒ', 'ⓕ', 'ⓓ'], correct: 1, why: '{料理|りょうり}{教室|きょうしつ}に{通|かよ}っています + {暇|ひま}なとき**ケーキを{作|つく}ります** → ⓒ.' },
        { q: '{西川|にしかわ}さんは{雨|あめ}のとき、{何|なに}をしますか。', options: ['ⓔ', 'ⓗ', 'ⓕ', 'ⓐ'], correct: 2, why: '{雨|あめ}のときは、**{図書館|としょかん}へ{行|い}って、{雑誌|ざっし}を{読|よ}みます** → ⓕ. Bẫy: ジョギング (ⓔ) và サッカー (ⓗ) là việc lúc trời không mưa.' },
        { q: 'ワンさんは{友達|ともだち}と{何|なに}をしていますか。', options: ['ⓖ（カラオケ・{買|か}い{物|もの}）', 'ⓒ', 'ⓓ', 'ⓑ'], correct: 0, why: '{友達|ともだち}と**カラオケに{行|い}ったり、{買|か}い{物|もの}をしたり**しています.' },
      ],
    },

    /* ── Bài 2 ── */
    { t: 'h', text: 'Bài 2 — Ảnh trên kệ của Mary: niên biểu "tôi đến bây giờ" (やってみよう)' },
    {
      t: 'p',
      text: 'Trong phòng Mary, Mary và Yamaguchi nói chuyện về những tấm ảnh trên kệ. (1) Hai người nói về những ảnh nào, theo thứ tự nào? (2) Nghe lại rồi điền vào niên biểu của Mary.',
    },
    {
      t: 'table',
      caption: 'Bốn tấm ảnh trên kệ (tả thay cho tranh)',
      head: ['Kí hiệu', 'Ảnh'],
      rows: [
        ['ⓐ', 'Một người đang chơi đàn piano'],
        ['ⓑ', 'Ngôi chùa có tháp năm tầng'],
        ['ⓒ', 'Đội tennis — các bạn mặc đồng phục cầm vợt'],
        ['ⓓ', 'Một cặp vợ chồng lớn tuổi, bên cạnh có chiếc vòng tay'],
      ],
    },
    {
      t: 'listen',
      id: 'b11-ng-2',
      title: 'メアリーさんの{部屋|へや}で',
      note: 'Lần 1: chỉ bắt tên đồ vật / nơi chốn trong mỗi ảnh. Lần 2: bắt mốc thời gian + từ chuyển 初めは / だんだん / それで.',
      lines: [
        { who: '山口', voice: 'ja-nu', text: 'メアリーさん、この{写真|しゃしん}、メアリーさんですか。ピアノ、{上手|じょうず}ですね。', ro: 'Mearii-san, kono shashin, Mearii-san desu ka. Piano, jouzu desu ne.', vi: 'Mary, trong ảnh này là bạn à? Chơi piano giỏi nhỉ.' },
        { who: 'メアリー', voice: 'ja-nu', text: 'ええ。{5歳|ごさい}のとき、ピアノを{始|はじ}めました。{初|はじ}めは{練習|れんしゅう}が{嫌|きら}いでしたが、だんだん{楽|たの}しくなりました。', ro: 'Ee. Gosai no toki, piano o hajimemashita. Hajime wa renshuu ga kirai deshita ga, dandan tanoshiku narimashita.', vi: 'Vâng. Tôi bắt đầu học piano năm 5 tuổi. Lúc đầu ghét tập, nhưng dần dần thấy vui.' },
        { who: '山口', voice: 'ja-nu', text: 'へえ。こちらはテニスの{写真|しゃしん}ですね。', ro: 'Hee. Kochira wa tenisu no shashin desu ne.', vi: 'Ồ. Còn đây là ảnh tennis nhỉ.' },
        { who: 'メアリー', voice: 'ja-nu', text: 'はい。{中学生|ちゅうがくせい}のとき、テニスを{始|はじ}めました。テレビで{大|おお}きい{試合|しあい}を{見|み}ました。{選手|せんしゅ}がとてもかっこよかったですから、テニスが{好|す}きになりました。', ro: 'Hai. Chuugakusei no toki, tenisu o hajimemashita. Terebi de ookii shiai o mimashita. Senshu ga totemo kakkoyokatta desu kara, tenisu ga suki ni narimashita.', vi: 'Vâng. Tôi bắt đầu chơi tennis hồi cấp hai. Tôi xem một trận đấu lớn trên TV. Các tay vợt rất ngầu nên tôi thích tennis.' },
        { who: '山口', voice: 'ja-nu', text: 'あ、これは{京都|きょうと}のお{寺|てら}ですね。', ro: 'A, kore wa Kyouto no otera desu ne.', vi: 'A, đây là chùa ở Kyoto nhỉ.' },
        { who: 'メアリー', voice: 'ja-nu', text: 'ええ。{大学生|だいがくせい}のとき、{初|はじ}めて{日本|にほん}へ{来|き}ました。{友達|ともだち}と{一緒|いっしょ}に{京都|きょうと}のお{寺|てら}を{見|み}たり、{写真|しゃしん}を{撮|と}ったりしました。とても{楽|たの}しかったです。それで、また{日本|にほん}へ{来|き}ました。', ro: 'Ee. Daigakusei no toki, hajimete Nihon e kimashita. Tomodachi to issho ni Kyouto no otera o mitari, shashin o tottari shimashita. Totemo tanoshikatta desu. Sorede, mata Nihon e kimashita.', vi: 'Vâng. Hồi sinh viên, lần đầu tôi đến Nhật. Tôi cùng bạn đi xem chùa ở Kyoto, chụp ảnh… Rất vui. Vì thế tôi lại sang Nhật.' },
        { who: '山口', voice: 'ja-nu', text: 'そうですか。{今|いま}は{日本|にほん}で{働|はたら}いていますね。', ro: 'Sou desu ka. Ima wa Nihon de hataraite imasu ne.', vi: 'Vậy à. Bây giờ bạn đang làm việc ở Nhật nhỉ.' },
        { who: 'メアリー', voice: 'ja-nu', text: 'ええ。{毎晩|まいばん}、{日本語|にほんご}も{勉強|べんきょう}しています。', ro: 'Ee. Maiban, Nihongo mo benkyou shite imasu.', vi: 'Vâng. Tối nào tôi cũng học cả tiếng Nhật nữa.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b11-ng-2-q1',
      title: '(1) Hai người nói về ảnh nào, theo thứ tự nào?',
      items: [
        { q: 'Ảnh thứ 1', options: ['ⓐ', 'ⓑ', 'ⓒ', 'ⓓ'], correct: 0, why: 'ピアノ、{上手|じょうず}ですね → ⓐ.' },
        { q: 'Ảnh thứ 2', options: ['ⓐ', 'ⓑ', 'ⓒ', 'ⓓ'], correct: 2, why: 'テニスの{写真|しゃしん}ですね → ⓒ.' },
        { q: 'Ảnh thứ 3', options: ['ⓐ', 'ⓑ', 'ⓒ', 'ⓓ'], correct: 1, why: '{京都|きょうと}のお{寺|てら}ですね → ⓑ. Ảnh ⓓ không được nhắc tới.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b11-ng-2-q2',
      title: '(2) Nghe lại, điền vào niên biểu của Mary (gõ tiếng Nhật)',
      kind: 'fill',
      grammar: 'Nのとき · 初めは～が、だんだん～なりました · ～から、～が好きになりました · 初めて · ～たり～たりしました',
      items: [
        { q: '{5歳|ごさい}：＿＿を{始|はじ}めました。', answers: V('ピアノ'), hint: 'nhạc cụ' },
        { q: '{初|はじ}めは{練習|れんしゅう}が＿＿でしたが、だんだん{楽|たの}しくなりました。', answers: V('{嫌|きら}い'), hint: 'ghét (ナA)' },
        { q: '{中学生|ちゅうがくせい}：テレビで＿＿を{見|み}ました。', answers: V('{大|おお}きい{試合|しあい}', '{試合|しあい}', 'テニスの{試合|しあい}'), hint: 'trận đấu' },
        { q: '＿＿から、テニスが{好|す}きになりました。', answers: V('{選手|せんしゅ}がかっこよかったです', '{選手|せんしゅ}がとてもかっこよかったです', '{選手|せんしゅ}がかっこよかった'), hint: '選手, かっこいい → quá khứ' },
        { q: '{大学生|だいがくせい}：{初|はじ}めて＿＿へ{来|き}ました。', answers: V('{日本|にほん}'), hint: 'đất nước' },
        { q: '{友達|ともだち}と{一緒|いっしょ}に{京都|きょうと}のお{寺|てら}を{見|み}たり、＿＿を{撮|と}ったりしました。', answers: V('{写真|しゃしん}'), hint: 'chụp cái gì' },
      ],
    },

    /* ── Bài 3 ── */
    { t: 'h', text: 'Bài 3 — Bạn bè nói chuyện: nói theo thứ tự nào? (やってみよう)' },
    {
      t: 'table',
      caption: 'Bốn tranh (tả bằng lời)',
      head: ['Kí hiệu', 'Tranh'],
      rows: [
        ['ⓐ', 'Tờ lịch — hai ngón tay chỉ vào ngày 19 và ngày 26'],
        ['ⓑ', 'Hai bạn nữ ngồi uống nước, một người hỏi "よく…?", có nốt nhạc'],
        ['ⓒ', 'Hai người nhắc tới buổi hoà nhạc "PEACE CONCERT"'],
        ['ⓓ', 'Một bạn đưa cho bạn kia tờ rơi "PEACE"'],
      ],
    },
    {
      t: 'listen',
      id: 'b11-ng-3',
      title: 'パクさんとアンナさん（{友達|ともだち}{言葉|ことば}）',
      note: 'Hai bạn thân nói thể thường. Nghe từ khoá: よく…聞く？ → コンサート → チラシ → {何日|なんにち}？',
      lines: [
        { who: 'パク', voice: 'ja-nu', text: 'アンナさん、よく{音楽|おんがく}{聞|き}く？', ro: 'Anna-san, yoku ongaku kiku?', vi: 'Anna, cậu hay nghe nhạc không?' },
        { who: 'アンナ', voice: 'ja-nu', text: 'うん、{聞|き}く。{毎晩|まいばん}{聞|き}いてる。どうして？', ro: 'Un, kiku. Maiban kiite ru. Doushite?', vi: 'Ừ, nghe. Tối nào cũng nghe. Sao thế?' },
        { who: 'パク', voice: 'ja-nu', text: '{先月|せんげつ}、ピースコンサート{行|い}った？', ro: 'Sengetsu, piisu konsaato itta?', vi: 'Tháng trước cậu có đi buổi hoà nhạc Peace không?' },
        { who: 'アンナ', voice: 'ja-nu', text: 'ううん、{行|い}かなかった。アルバイトだったから。どうだった？', ro: 'Uun, ikanakatta. Arubaito datta kara. Dou datta?', vi: 'Không, mình không đi. Vì phải làm thêm. Thế nào?' },
        { who: 'パク', voice: 'ja-nu', text: 'すごくよかった。それで、これ、{見|み}て。{来月|らいげつ}もあるよ。', ro: 'Sugoku yokatta. Sorede, kore, mite. Raigetsu mo aru yo.', vi: 'Hay cực. Nên này, xem cái này đi. Tháng sau cũng có đấy.' },
        { who: 'アンナ', voice: 'ja-nu', text: 'え、このチラシ、もらってもいい？', ro: 'E, kono chirashi, moratte mo ii?', vi: 'Ơ, mình lấy tờ rơi này được không?' },
        { who: 'パク', voice: 'ja-nu', text: 'うん、いいよ。{一緒|いっしょ}に{行|い}かない？{19日|じゅうくにち}と{26日|にじゅうろくにち}があるけど。', ro: 'Un, ii yo. Issho ni ikanai? Juukunichi to nijuurokunichi ga aru kedo.', vi: 'Ừ, được. Đi cùng không? Có ngày 19 và 26.' },
        { who: 'アンナ', voice: 'ja-nu', text: '{19日|じゅうくにち}はアルバイトだから……{26日|にじゅうろくにち}はどう？', ro: 'Juukunichi wa arubaito da kara…… nijuurokunichi wa dou?', vi: 'Ngày 19 mình làm thêm nên… ngày 26 thì sao?' },
        { who: 'パク', voice: 'ja-nu', text: 'いいね。じゃ、{26日|にじゅうろくにち}。', ro: 'Ii ne. Ja, nijuurokunichi.', vi: 'Được đấy. Vậy ngày 26.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b11-ng-3-q',
      title: 'Câu hỏi bài 3',
      items: [
        { q: 'Thứ tự các tranh:', options: ['ⓑ ▶ ⓒ ▶ ⓓ ▶ ⓐ', 'ⓒ ▶ ⓑ ▶ ⓐ ▶ ⓓ', 'ⓑ ▶ ⓓ ▶ ⓒ ▶ ⓐ', 'ⓐ ▶ ⓑ ▶ ⓒ ▶ ⓓ'], correct: 0, why: 'よく{音楽|おんがく}{聞|き}く？ (ⓑ) → ピースコンサート{行|い}った？ (ⓒ) → チラシ、もらってもいい？ (ⓓ) → {19日|じゅうくにち}と{26日|にじゅうろくにち} (ⓐ).' },
        { q: 'アンナさんは{先月|せんげつ}のコンサートへ{行|い}きましたか。', options: ['はい、{行|い}きました。', 'いいえ、{行|い}きませんでした。', 'まだわかりません。', 'はい、パクさんと{行|い}きました。'], correct: 1, why: 'ううん、**{行|い}かなかった**。アルバイトだったから.' },
        { q: '2{人|ふたり}は{何日|なんにち}にコンサートへ{行|い}きますか。', options: ['{19日|じゅうくにち}', '{26日|にじゅうろくにち}', '{19日|じゅうくにち}と{26日|にじゅうろくにち}', '{来月|らいげつ}は{行|い}きません'], correct: 1, why: '{19日|じゅうくにち}はアルバイトだから → **{26日|にじゅうろくにち}**はどう？ → いいね.' },
      ],
    },

    /* ── Bài 4 ── */
    { t: 'h', text: 'Bài 4 — Hội thoại dài: ở quán nhậu (もう{一度|いちど}{聞|き}こう)' },
    {
      t: 'listen',
      id: 'b11-ng-4',
      title: '{居酒屋|いざかや}で — lịch sự với người mới, thân mật với bạn',
      note: 'Nghe cả đoạn một lần, rồi trả lời câu hỏi. Để ý ai nói です／ます, ai nói thể thường với nhau.',
      lines: [
        { who: 'パク', voice: 'ja-nu', text: '{西川|にしかわ}さん、こんばんは。こちらはマルコさんです。', ro: 'Nishikawa-san, konbanwa. Kochira wa Maruko-san desu.', vi: 'Anh Nishikawa, chào buổi tối. Đây là Marco.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'はじめまして。マルコです。', ro: 'Hajimemashite. Maruko desu.', vi: 'Rất vui được gặp. Tôi là Marco.' },
        { who: '西川', voice: 'ja-nam', text: 'はじめまして。{西川|にしかわ}です。マルコさん、{日本|にほん}の{生活|せいかつ}はどうですか。', ro: 'Hajimemashite. Nishikawa desu. Maruko-san, Nihon no seikatsu wa dou desu ka.', vi: 'Rất vui được gặp. Tôi là Nishikawa. Marco, cuộc sống ở Nhật thế nào?' },
        { who: 'マルコ', voice: 'ja-nam', text: '{初|はじ}めは{食|た}べ{物|もの}が{大変|たいへん}でしたが、{今|いま}は{慣|な}れました。', ro: 'Hajime wa tabemono ga taihen deshita ga, ima wa naremashita.', vi: 'Lúc đầu đồ ăn thì vất vả, nhưng giờ quen rồi.' },
        { who: '西川', voice: 'ja-nam', text: 'そうですか。{日本語|にほんご}の{勉強|べんきょう}は？', ro: 'Sou desu ka. Nihongo no benkyou wa?', vi: 'Vậy à. Còn việc học tiếng Nhật?' },
        { who: 'マルコ', voice: 'ja-nam', text: '{会話|かいわ}は{楽|たの}しいですが、{漢字|かんじ}は{難|むずか}しいです。{毎晩|まいばん}、クラスメイトと{図書館|としょかん}で{勉強|べんきょう}しています。', ro: 'Kaiwa wa tanoshii desu ga, kanji wa muzukashii desu. Maiban, kurasumeito to toshokan de benkyou shite imasu.', vi: 'Hội thoại thì vui, nhưng chữ Hán thì khó. Tối nào tôi cũng học ở thư viện với bạn cùng lớp.' },
        { who: 'アンナ', voice: 'ja-nu', text: 'お{待|ま}たせ。', ro: 'Omatase.', vi: 'Xin lỗi đã để mọi người chờ.' },
        { who: 'パク', voice: 'ja-nu', text: 'あ、アンナさん。{遅|おそ}かったね。', ro: 'A, Anna-san. Osokatta ne.', vi: 'A, Anna. Cậu đến muộn thế.' },
        { who: 'アンナ', voice: 'ja-nu', text: 'ごめん。{授業|じゅぎょう}の{後|あと}、アルバイトがあったから。ああ、おなかすいた。{何|なに}がおいしい？', ro: 'Gomen. Jugyou no ato, arubaito ga atta kara. Aa, onaka suita. Nani ga oishii?', vi: 'Xin lỗi. Vì sau giờ học mình có ca làm thêm. Ôi, đói quá. Món gì ngon?' },
        { who: 'パク', voice: 'ja-nu', text: 'この{料理|りょうり}、おいしいよ。{飲|の}み{物|もの}は？', ro: 'Kono ryouri, oishii yo. Nomimono wa?', vi: 'Món này ngon đấy. Đồ uống thì sao?' },
        { who: 'アンナ', voice: 'ja-nu', text: 'ビール。すみませーん、{注文|ちゅうもん}お{願|ねが}いします。', ro: 'Biiru. Sumimaseen, chuumon onegai shimasu.', vi: 'Bia. Xin lỗi ơi, cho gọi món ạ.' },
        { who: '西川', voice: 'ja-nam', text: 'じゃ、{乾杯|かんぱい}！……アンナさんは{休|やす}みの{日|ひ}、{何|なに}をしていますか。', ro: 'Ja, kanpai! …… Anna-san wa yasumi no hi, nani o shite imasu ka.', vi: 'Nào, cạn ly! … Anna, ngày nghỉ bạn thường làm gì?' },
        { who: 'アンナ', voice: 'ja-nu', text: '{天気|てんき}がいいとき、{自転車|じてんしゃ}で{海|うみ}へ{行|い}ったり、{写真|しゃしん}を{撮|と}ったりしています。{西川|にしかわ}さんは？', ro: 'Tenki ga ii toki, jitensha de umi e ittari, shashin o tottari shite imasu. Nishikawa-san wa?', vi: 'Khi trời đẹp, tôi đạp xe ra biển, chụp ảnh… Còn anh Nishikawa?' },
        { who: '西川', voice: 'ja-nam', text: '{私|わたし}はサッカーです。{中学生|ちゅうがくせい}のとき、{始|はじ}めました。{今度|こんど}の{土曜日|どようび}、{試合|しあい}がありますよ。', ro: 'Watashi wa sakkaa desu. Chuugakusei no toki, hajimemashita. Kondo no doyoubi, shiai ga arimasu yo.', vi: 'Tôi thì bóng đá. Tôi bắt đầu hồi cấp hai. Thứ Bảy tới có trận đấu đấy.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'じゃ、みんなで{見|み}に{行|い}きましょう。', ro: 'Ja, minna de mi ni ikimashou.', vi: 'Vậy mọi người cùng đi xem đi.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b11-ng-4-q',
      title: 'Câu hỏi bài 4',
      items: [
        { q: 'マルコさんは{初|はじ}め、{何|なに}が{大変|たいへん}でしたか。', options: ['{日本語|にほんご}', '{食|た}べ{物|もの}', 'アルバイト', '{一人|ひとり}{暮|ぐ}らし'], correct: 1, why: '{初|はじ}めは**{食|た}べ{物|もの}**が{大変|たいへん}でしたが、{今|いま}は{慣|な}れました.' },
        { q: 'マルコさんにとって、{日本語|にほんご}の{何|なに}が{難|むずか}しいですか。', options: ['{会話|かいわ}', '{作文|さくぶん}', '{漢字|かんじ}', 'ひらがな'], correct: 2, why: '{会話|かいわ}は{楽|たの}しいですが、**{漢字|かんじ}は{難|むずか}しい**です (ポイント 100).' },
        { q: 'マルコさんは{毎晩|まいばん}、{何|なに}をしていますか。', options: ['アルバイトをしています', '{図書館|としょかん}で{勉強|べんきょう}しています', 'サッカーをしています', '{日記|にっき}を{書|か}いています'], correct: 1, why: '{毎晩|まいばん}、クラスメイトと**{図書館|としょかん}で{勉強|べんきょう}して**います (ポイント 98).' },
        { q: 'アンナさんはどうして{遅|おそ}かったですか。', options: ['{授業|じゅぎょう}が{遅|おそ}く{終|お}わりましたから', 'アルバイトがありましたから', '{道|みち}がわかりませんでしたから', '{寝|ね}ていましたから'], correct: 1, why: 'ごめん。{授業|じゅぎょう}の{後|あと}、**アルバイトがあったから** (thể thường với bạn).' },
        { q: 'アンナさんは{天気|てんき}がいいとき、{何|なに}をしていますか。', options: ['サッカーをしています', '{海|うみ}へ{行|い}ったり{写真|しゃしん}を{撮|と}ったりしています', '{図書館|としょかん}へ{行|い}きます', 'ケーキを{作|つく}ります'], correct: 1, why: '{自転車|じてんしゃ}で**{海|うみ}へ{行|い}ったり、{写真|しゃしん}を{撮|と}ったり**しています (ポイント 99, 101).' },
        { q: '{西川|にしかわ}さんはいつサッカーを{始|はじ}めましたか。', options: ['{小学生|しょうがくせい}のとき', '{中学生|ちゅうがくせい}のとき', '{高校生|こうこうせい}のとき', '{大学生|だいがくせい}のとき'], correct: 1, why: '**{中学生|ちゅうがくせい}のとき**、{始|はじ}めました.' },
        { q: 'パクさんとアンナさんはどんな{言葉|ことば}で{話|はな}していますか。', options: ['です／ます（{丁寧|ていねい}）', '{友達|ともだち}{言葉|ことば}（{普通形|ふつうけい}）', '{英語|えいご}', 'わかりません'], correct: 1, why: 'Hai bạn thân: {遅|おそ}かった**ね**, ごめん, ～あった**から**, おいしい**よ** → thể thường.' },
      ],
    },

    /* ── Bài 5 ── */
    { t: 'h', text: 'Bài 5 — うん hay ううん? Có hay không? (thể thường)' },
    {
      t: 'p',
      text: 'Nghe 6 cặp hỏi–đáp ngắn giữa hai người bạn. Người trả lời nói **có** (○) hay **không** (×)?',
    },
    {
      t: 'listen',
      id: 'b11-ng-5',
      title: '6 cặp hỏi – đáp',
      lines: [
        { who: '①', voice: 'ja-nu', text: 'よくカラオケ{行|い}く？——うん、よく{行|い}く。', ro: 'Yoku karaoke iku? — Un, yoku iku.', vi: 'Hay đi karaoke không? — Ừ, hay đi.' },
        { who: '②', voice: 'ja-nam', text: '{毎朝|まいあさ}、ご{飯|はん}{食|た}べる？——ううん、{食|た}べない。', ro: 'Maiasa, gohan taberu? — Uun, tabenai.', vi: 'Sáng nào cũng ăn cơm à? — Không, không ăn.' },
        { who: '③', voice: 'ja-nu', text: '{週末|しゅうまつ}、{暇|ひま}？——ううん、{暇|ひま}じゃない。{引|ひ}っ{越|こ}しだから。', ro: 'Shuumatsu, hima? — Uun, hima ja nai. Hikkoshi da kara.', vi: 'Cuối tuần rảnh không? — Không, không rảnh. Vì chuyển nhà.' },
        { who: '④', voice: 'ja-nam', text: '「キングマン」{見|み}た？——うん、{見|み}た。おもしろかったよ。', ro: '"Kinguman" mita? — Un, mita. Omoshirokatta yo.', vi: 'Xem "Kingman" chưa? — Ừ, xem rồi. Hay lắm.' },
        { who: '⑤', voice: 'ja-nu', text: 'アルバイト、{大変|たいへん}？——ううん、{全然|ぜんぜん}{大変|たいへん}じゃない。', ro: 'Arubaito, taihen? — Uun, zenzen taihen ja nai.', vi: 'Làm thêm vất vả không? — Không, chẳng vất vả gì.' },
        { who: '⑥', voice: 'ja-nam', text: '{昨日|きのう}、{学校|がっこう}{休|やす}んだ？——うん。{風邪|かぜ}ひいたから。', ro: 'Kinou, gakkou yasunda? — Un. Kaze hiita kara.', vi: 'Hôm qua cậu nghỉ học à? — Ừ. Vì bị cảm.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b11-ng-5-q',
      title: 'Câu hỏi bài 5 — ○ hay ×',
      items: [
        { q: '① カラオケに{行|い}きますか', options: ['○', '×'], correct: 0, why: '**うん**、よく{行|い}く.' },
        { q: '② {毎朝|まいあさ}ご{飯|はん}を{食|た}べますか', options: ['○', '×'], correct: 1, why: '**ううん**、{食|た}べ**ない**.' },
        { q: '③ {週末|しゅうまつ}、{暇|ひま}ですか', options: ['○', '×'], correct: 1, why: 'ううん、{暇|ひま}**じゃない** (chuyển nhà).' },
        { q: '④ 「キングマン」を{見|み}ましたか', options: ['○', '×'], correct: 0, why: 'うん、{見|み}**た** (thể た = đã xem).' },
        { q: '⑤ アルバイトは{大変|たいへん}ですか', options: ['○', '×'], correct: 1, why: 'ううん、{全然|ぜんぜん}{大変|たいへん}**じゃない**.' },
        { q: '⑥ {昨日|きのう}、{学校|がっこう}を{休|やす}みましたか', options: ['○', '×'], correct: 0, why: '**うん**。{風邪|かぜ}ひいたから — {休|やす}んだ = thể た của 休みます.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 6. NÓI (dạng thi) ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b11-noi',
  kind: 'speaking',
  title: 'Luyện nói — câu hỏi thi về sinh hoạt hằng ngày, "khi … thì …", chuyện ngày trước',
  goal: 'Trả lời trọn câu, đúng trợ từ các câu hỏi thi liên quan Bài 11 (いつも何をしていますか, 休みの日, ～とき、どうしますか, いつ～始めましたか), nhìn tranh thời gian biểu / niên biểu mà trả lời, đóng vai nói chuyện với bạn bằng thể thường, và đọc to trôi chảy.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Đề thi nói JPD (theo "Hướng dẫn ôn thi" của bộ môn) — Bài 11 nằm ở đâu',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 11 xuất hiện ở đâu'],
      rows: [
        ['Reading', '40', 'Chuẩn bị 30 giây, đọc to đoạn ~100–110 chữ (4 từ chữ Hán gạch chân, 4 từ katakana, 70–80 chữ hiragana).', 'Đoạn kể cuộc sống bây giờ / chuyện ngày trước: {生活|せいかつ}, {平日|へいじつ}, {小学生|しょうがくせい}, アルバイト, ジョギング…'],
        ['Talking — có tranh', '3 × 15', 'Nhìn tranh (thời gian biểu, ngày nghỉ, niên biểu…) trả lời 3 câu.', 'この{人|ひと}は{毎朝|まいあさ}{何|なに}をしていますか · {休|やす}みの{日|ひ}、{何|なに}をしますか · いつ～を{始|はじ}めましたか'],
        ['Talking — không tranh', '1 × 10', 'Trả lời 1 câu về bản thân.', '{休|やす}みの{日|ひ}、よく{何|なに}をしますか · {暇|ひま}なとき · ～とき、どうしますか'],
        ['Presenting', '5', 'Chào khi vào và khi ra.', 'しつれいします／ありがとうございました。 — **luôn thể lịch sự**'],
      ],
    },
    {
      t: 'note',
      title: 'Luật chấm cần nhớ (trừ điểm thật)',
      items: [
        '**Sai trợ từ: −2 điểm** mỗi lỗi. Bài 11 soát kỹ: {生活|せいかつ}**に**{慣|な}れます; {学校|がっこう}**に**{通|かよ}います; {学校|がっこう}**を**{休|やす}みます; {公園|こうえん}**を**{散歩|さんぽ}します; {暇|ひま}**な**とき, {雨|あめ}**の**とき.',
        '**Câu có/không quên はい／いいえ**: bị trừ. Với giám thị **tuyệt đối không うん／ううん** và không nói thể thường.',
        '**Sai nội dung = mất trọn câu**: hỏi "khi … thì làm sao" (どうしますか) mà đáp cảm giác; hỏi "bắt đầu khi nào" (いつ) mà đáp "vì sao".',
        'Được xin nhắc lại câu hỏi **tối đa 2 lần, không bị trừ**: **もう{一度|いちど}お{願|ねが}いします** · **ゆっくりお{願|ねが}いします**.',
        'Câu hỏi "ngày nghỉ làm gì" → trả lời bằng **～たり～たりします** + một câu **～とき** là câu dài, đủ ý, ăn điểm.',
      ],
    },

    /* ── Không tranh ① ── */
    { t: 'h', text: 'Câu hỏi không tranh ① — Sinh hoạt hằng ngày (ています, たり)' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: cuộc sống bây giờ',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{休|やす}みの{日|ひ}、{何|なに}をしますか。', ro: 'Yasumi no hi, nani o shimasu ka.', vi: 'Ngày nghỉ em làm gì? (câu có trong đề speaking.ts)' },
        { who: 'Bạn', role: 'candidate', text: '{休|やす}みの{日|ひ}、{友達|ともだち}と{映画|えいが}を{見|み}たり、カフェでコーヒーを{飲|の}んだりします。', ro: 'Yasumi no hi, tomodachi to eiga o mitari, kafe de koohii o nondari shimasu.', vi: 'Ngày nghỉ em xem phim, uống cà phê ở quán… với bạn.' },
        { who: 'Giám thị', role: 'examiner', text: '{毎朝|まいあさ}、{何|なに}を{食|た}べていますか。', ro: 'Maiasa, nani o tabete imasu ka.', vi: 'Sáng nào em cũng ăn gì?' },
        { who: 'Bạn', role: 'candidate', text: '{毎朝|まいあさ}、フォーを{食|た}べています。', ro: 'Maiasa, foo o tabete imasu.', vi: 'Sáng nào em cũng ăn phở.' },
        { who: 'Giám thị', role: 'examiner', text: '{授業|じゅぎょう}は{何時|なんじ}に{終|お}わりますか。', ro: 'Jugyou wa nanji ni owarimasu ka.', vi: 'Giờ học kết thúc lúc mấy giờ?' },
        { who: 'Bạn', role: 'candidate', text: '{午後|ごご}{5時|ごじ}に{終|お}わります。それから、うちへ{帰|かえ}ります。', ro: 'Gogo goji ni owarimasu. Sorekara, uchi e kaerimasu.', vi: 'Kết thúc lúc 5 giờ chiều. Sau đó em về nhà.' },
        { who: 'Giám thị', role: 'examiner', text: 'アルバイトをしていますか。', ro: 'Arubaito o shite imasu ka.', vi: 'Em có đi làm thêm không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、しています。{1週間|いっしゅうかん}に{3回|さんかい}、カフェで{働|はたら}いています。', ro: 'Hai, shite imasu. Isshuukan ni sankai, kafe de hataraite imasu.', vi: 'Có ạ. Một tuần 3 lần em làm ở quán cà phê.' },
        { who: 'Giám thị', role: 'examiner', text: '{一人|ひとり}{暮|ぐ}らしですか。', ro: 'Hitorigurashi desu ka.', vi: 'Em sống một mình à?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{家族|かぞく}と{住|す}んでいます。', ro: 'Iie, kazoku to sunde imasu.', vi: 'Không ạ, em sống cùng gia đình.' },
        { who: 'Giám thị', role: 'examiner', text: '{日本語|にほんご}の{勉強|べんきょう}はどうですか。', ro: 'Nihongo no benkyou wa dou desu ka.', vi: 'Việc học tiếng Nhật thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{会話|かいわ}はおもしろいですが、{漢字|かんじ}は{難|むずか}しいです。', ro: 'Kaiwa wa omoshiroi desu ga, kanji wa muzukashii desu.', vi: 'Hội thoại thì thú vị, nhưng chữ Hán thì khó ạ.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở nhóm này',
      items: [
        'Câu hỏi dùng **～ていますか** → trả lời **～ています** (lặp đúng hình thái). Câu hỏi dùng **～ますか** → trả lời ～ます hoặc ～たり～たりします.',
        '「アルバイトをしていますか」 → **はい、しています／いいえ、していません**. Không nói ~~はい、します~~ (lệch hình thái).',
        '"Sống cùng gia đình" = **{家族|かぞく}と{住|す}んでいます** (Bài 8). Đừng nói ~~家族に住んでいます~~.',
        'Câu "…はどうですか" hợp nhất với mẫu **ポイント 100**: A**は**～**が**、B**は**～ — đủ hai ý, ăn điểm.',
      ],
    },

    /* ── Không tranh ② ── */
    { t: 'h', text: 'Câu hỏi không tranh ② — Khi … thì làm gì? (とき, どうしますか)' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: ～とき',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{暇|ひま}なとき、{何|なに}をしますか。', ro: 'Hima na toki, nani o shimasu ka.', vi: 'Khi rảnh em làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{暇|ひま}なとき、{音楽|おんがく}を{聞|き}いたり{雑誌|ざっし}を{読|よ}んだりします。', ro: 'Hima na toki, ongaku o kiitari zasshi o yondari shimasu.', vi: 'Khi rảnh em nghe nhạc, đọc tạp chí…' },
        { who: 'Giám thị', role: 'examiner', text: '{雨|あめ}のとき、{何|なに}をしますか。', ro: 'Ame no toki, nani o shimasu ka.', vi: 'Khi trời mưa em làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{雨|あめ}のとき、うちで{映画|えいが}を{見|み}ます。', ro: 'Ame no toki, uchi de eiga o mimasu.', vi: 'Khi mưa em xem phim ở nhà.' },
        { who: 'Giám thị', role: 'examiner', text: '{寂|さび}しいとき、どうしますか。', ro: 'Sabishii toki, dou shimasu ka.', vi: 'Khi buồn em làm thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{寂|さび}しいとき、{友達|ともだち}に{電話|でんわ}します。', ro: 'Sabishii toki, tomodachi ni denwa shimasu.', vi: 'Khi buồn em gọi điện cho bạn.' },
        { who: 'Giám thị', role: 'examiner', text: '{頭|あたま}が{痛|いた}いとき、どうしますか。', ro: 'Atama ga itai toki, dou shimasu ka.', vi: 'Khi đau đầu em làm thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{薬|くすり}を{飲|の}んで、{寝|ね}ます。', ro: 'Kusuri o nonde, nemasu.', vi: 'Em uống thuốc rồi đi ngủ.' },
        { who: 'Giám thị', role: 'examiner', text: '{眠|ねむ}いとき、どうしますか。', ro: 'Nemui toki, dou shimasu ka.', vi: 'Khi buồn ngủ em làm thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{眠|ねむ}いとき、コーヒーを{飲|の}みます。', ro: 'Nemui toki, koohii o nomimasu.', vi: 'Khi buồn ngủ em uống cà phê.' },
        { who: 'Giám thị', role: 'examiner', text: '{風邪|かぜ}をひいたとき、どうしますか。', ro: 'Kaze o hiita toki, dou shimasu ka.', vi: 'Khi bị cảm em làm thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{学校|がっこう}を{休|やす}んで、{病院|びょういん}へ{行|い}きます。', ro: 'Gakkou o yasunde, byouin e ikimasu.', vi: 'Em nghỉ học và đi bệnh viện.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở nhóm này',
      items: [
        '**Nhắc lại vế とき** ở đầu câu trả lời ({暇|ひま}なとき、…) — câu dài hơn, giám thị thấy bạn hiểu câu hỏi.',
        '**どうしますか** → việc làm (～ます). Đừng đáp ~~寂しいです~~.',
        '{学校|がっこう}**を**{休|やす}みます (không phải ~~学校に休みます~~).',
      ],
    },

    /* ── Không tranh ③ ── */
    { t: 'h', text: 'Câu hỏi không tranh ③ — Chuyện ngày trước (いつ, ～のとき)' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: quá khứ của em',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'いつ{日本語|にほんご}の{勉強|べんきょう}を{始|はじ}めましたか。', ro: 'Itsu Nihongo no benkyou o hajimemashita ka.', vi: 'Em bắt đầu học tiếng Nhật khi nào?' },
        { who: 'Bạn', role: 'candidate', text: '{大学|だいがく}に{入学|にゅうがく}したとき、{始|はじ}めました。', ro: 'Daigaku ni nyuugaku shita toki, hajimemashita.', vi: 'Em bắt đầu khi vào đại học.' },
        { who: 'Giám thị', role: 'examiner', text: '{小学生|しょうがくせい}のとき、{何|なに}が{好|す}きでしたか。', ro: 'Shougakusei no toki, nani ga suki deshita ka.', vi: 'Hồi tiểu học em thích gì?' },
        { who: 'Bạn', role: 'candidate', text: '{小学生|しょうがくせい}のとき、サッカーが{好|す}きでした。{毎日|まいにち}{友達|ともだち}とサッカーをしました。', ro: 'Shougakusei no toki, sakkaa ga suki deshita. Mainichi tomodachi to sakkaa o shimashita.', vi: 'Hồi tiểu học em thích bóng đá. Ngày nào em cũng đá bóng với bạn.' },
        { who: 'Giám thị', role: 'examiner', text: 'いつ{今|いま}の{趣味|しゅみ}を{始|はじ}めましたか。', ro: 'Itsu ima no shumi o hajimemashita ka.', vi: 'Em bắt đầu sở thích hiện nay khi nào?' },
        { who: 'Bạn', role: 'candidate', text: '{中学生|ちゅうがくせい}のとき、ギターを{始|はじ}めました。{初|はじ}めは{下手|へた}でしたが、だんだん{上手|じょうず}になりました。', ro: 'Chuugakusei no toki, gitaa o hajimemashita. Hajime wa heta deshita ga, dandan jouzu ni narimashita.', vi: 'Em bắt đầu chơi guitar hồi cấp hai. Lúc đầu dở nhưng dần dần giỏi lên.' },
        { who: 'Giám thị', role: 'examiner', text: 'どうしてギターが{好|す}きになりましたか。', ro: 'Doushite gitaa ga suki ni narimashita ka.', vi: 'Vì sao em thích guitar?' },
        { who: 'Bạn', role: 'candidate', text: 'テレビで{歌手|かしゅ}を{見|み}ました。かっこよかったですから、{好|す}きになりました。', ro: 'Terebi de kashu o mimashita. Kakkoyokatta desu kara, suki ni narimashita.', vi: 'Em xem một ca sĩ trên TV. Vì anh ấy rất ngầu nên em thích.' },
        { who: 'Giám thị', role: 'examiner', text: '{高校|こうこう}を{卒業|そつぎょう}したとき、{何|なに}をもらいましたか。', ro: 'Koukou o sotsugyou shita toki, nani o moraimashita ka.', vi: 'Khi tốt nghiệp cấp ba em được tặng gì?' },
        { who: 'Bạn', role: 'candidate', text: '{父|ちち}に{時計|とけい}をもらいました。', ro: 'Chichi ni tokei o moraimashita.', vi: 'Em được bố tặng đồng hồ.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở nhóm này',
      items: [
        'Hỏi **いつ** → câu trả lời phải có **mốc thời gian**: ～のとき／～たとき／{15歳|じゅうごさい}のとき. Đừng chỉ nói ~~はい、始めました~~.',
        '"Hồi …" với danh từ luôn có **の**: {小学生|しょうがくせい}**の**とき, {子|こ}ども**の**とき, {15歳|じゅうごさい}**の**とき.',
        'Câu hỏi quá khứ (でしたか／ましたか) → trả lời quá khứ (でした／ました). Câu "vì sao" → **～から**.',
      ],
    },

    /* ── Có tranh ── */
    { t: 'h', text: 'Câu hỏi có tranh — thời gian biểu, ngày nghỉ, niên biểu' },
    {
      t: 'p',
      text: 'Tranh thi được viết lại thành bảng (không dùng ảnh). Với tranh Bài 11, giám thị hay hỏi: **この{人|ひと}は{毎朝|まいあさ}{何|なに}をしていますか · {休|やす}みの{日|ひ}、{何|なに}をしますか · ～のとき、{何|なに}をしますか · いつ～を{始|はじ}めましたか**.',
    },
    {
      t: 'table',
      caption: 'Tranh 1 — một tuần của ワンさん',
      head: ['Khi nào', 'Làm gì'],
      rows: [
        ['Mỗi sáng 6 giờ', 'Chạy bộ ở công viên'],
        ['Ngày thường 9:00–13:00', 'Học ở trường'],
        ['Thứ Ba, thứ Năm buổi chiều', 'Làm thêm ở cửa hàng bánh'],
        ['Thứ Bảy', 'Đi lớp nấu ăn'],
        ['Chủ Nhật', 'Dọn phòng, giặt đồ'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 1 — hỏi – đáp',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'ワンさんは{毎朝|まいあさ}、{何|なに}をしていますか。', ro: 'Wan-san wa maiasa, nani o shite imasu ka.', vi: 'Sáng nào Wang cũng làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{毎朝|まいあさ}{6時|ろくじ}に{公園|こうえん}でジョギングをしています。', ro: 'Maiasa rokuji ni kouen de jogingu o shite imasu.', vi: 'Sáng nào 6 giờ bạn ấy cũng chạy bộ ở công viên.' },
        { who: 'Giám thị', role: 'examiner', text: '{授業|じゅぎょう}は{何時|なんじ}に{終|お}わりますか。', ro: 'Jugyou wa nanji ni owarimasu ka.', vi: 'Giờ học kết thúc lúc mấy giờ?' },
        { who: 'Bạn', role: 'candidate', text: '{1時|いちじ}に{終|お}わります。', ro: 'Ichiji ni owarimasu.', vi: 'Kết thúc lúc 1 giờ.' },
        { who: 'Giám thị', role: 'examiner', text: 'ワンさんは{火曜日|かようび}の{午後|ごご}、{何|なに}をしていますか。', ro: 'Wan-san wa kayoubi no gogo, nani o shite imasu ka.', vi: 'Chiều thứ Ba Wang làm gì?' },
        { who: 'Bạn', role: 'candidate', text: 'ケーキ{屋|や}でアルバイトをしています。', ro: 'Keeki-ya de arubaito o shite imasu.', vi: 'Bạn ấy làm thêm ở cửa hàng bánh.' },
        { who: 'Giám thị', role: 'examiner', text: '{日曜日|にちようび}は{何|なに}をしますか。', ro: 'Nichiyoubi wa nani o shimasu ka.', vi: 'Chủ Nhật bạn ấy làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{部屋|へや}を{掃除|そうじ}したり、{洗濯|せんたく}したりします。', ro: 'Heya o souji shitari, sentaku shitari shimasu.', vi: 'Bạn ấy dọn phòng, giặt đồ…' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh 2 — niên biểu của ダニエルさん',
      head: ['Mốc', 'Chuyện gì'],
      rows: [
        ['8 tuổi (tiểu học)', 'Xem Olympic trên TV → thích bơi → bắt đầu học bơi'],
        ['Cấp hai', 'Vào đội bơi của trường, dần dần bơi nhanh hơn'],
        ['18 tuổi', 'Tốt nghiệp cấp ba, được ông tặng đồng hồ'],
        ['Bây giờ', 'Sống ở Nhật, bơi ở bể 1 tuần 2 lần'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 2 — hỏi – đáp',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'ダニエルさんはいつ{水泳|すいえい}を{始|はじ}めましたか。', ro: 'Danieru-san wa itsu suiei o hajimemashita ka.', vi: 'Daniel bắt đầu bơi khi nào?' },
        { who: 'Bạn', role: 'candidate', text: '{小学生|しょうがくせい}のとき、{始|はじ}めました。', ro: 'Shougakusei no toki, hajimemashita.', vi: 'Anh ấy bắt đầu hồi tiểu học.' },
        { who: 'Giám thị', role: 'examiner', text: 'どうして{水泳|すいえい}が{好|す}きになりましたか。', ro: 'Doushite suiei ga suki ni narimashita ka.', vi: 'Vì sao anh ấy thích bơi?' },
        { who: 'Bạn', role: 'candidate', text: 'テレビでオリンピックを{見|み}ました。{選手|せんしゅ}がかっこよかったですから、{好|す}きになりました。', ro: 'Terebi de orinpikku o mimashita. Senshu ga kakkoyokatta desu kara, suki ni narimashita.', vi: 'Anh ấy xem Olympic trên TV. Vì các vận động viên ngầu quá nên anh ấy thích.' },
        { who: 'Giám thị', role: 'examiner', text: '{高校|こうこう}を{卒業|そつぎょう}したとき、{何|なに}をもらいましたか。', ro: 'Koukou o sotsugyou shita toki, nani o moraimashita ka.', vi: 'Khi tốt nghiệp cấp ba, anh ấy được tặng gì?' },
        { who: 'Bạn', role: 'candidate', text: 'おじいさんに{時計|とけい}をもらいました。', ro: 'Ojiisan ni tokei o moraimashita.', vi: 'Anh ấy được ông tặng đồng hồ. (ông của người khác → おじいさん)' },
        { who: 'Giám thị', role: 'examiner', text: '{今|いま}も{泳|およ}いでいますか。', ro: 'Ima mo oyoide imasu ka.', vi: 'Bây giờ anh ấy vẫn bơi chứ?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{1週間|いっしゅうかん}に{2回|にかい}、プールで{泳|およ}いでいます。', ro: 'Hai, isshuukan ni nikai, puuru de oyoide imasu.', vi: 'Có ạ, một tuần 2 lần anh ấy bơi ở bể.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh 3 — ngày nghỉ của ba người',
      head: ['Người', 'Trời đẹp', 'Trời mưa'],
      rows: [
        ['パクさん', 'Đi dạo công viên, chụp ảnh hoa', 'Đọc tạp chí ở nhà'],
        ['マルコさん', 'Đá bóng', 'Chơi game, xem TV'],
        ['アンナさん', 'Đạp xe ra biển', 'Làm bánh'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 3 — hỏi – đáp',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'パクさんは{天気|てんき}がいいとき、{何|なに}をしますか。', ro: 'Paku-san wa tenki ga ii toki, nani o shimasu ka.', vi: 'Khi trời đẹp, Park làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{公園|こうえん}を{散歩|さんぽ}したり、{花|はな}の{写真|しゃしん}を{撮|と}ったりします。', ro: 'Kouen o sanpo shitari, hana no shashin o tottari shimasu.', vi: 'Cô ấy đi dạo công viên, chụp ảnh hoa…' },
        { who: 'Giám thị', role: 'examiner', text: 'マルコさんは{雨|あめ}のとき、{何|なに}をしますか。', ro: 'Maruko-san wa ame no toki, nani o shimasu ka.', vi: 'Khi mưa, Marco làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{雨|あめ}のとき、ゲームをしたりテレビを{見|み}たりします。', ro: 'Ame no toki, geemu o shitari terebi o mitari shimasu.', vi: 'Khi mưa, anh ấy chơi game, xem TV…' },
        { who: 'Giám thị', role: 'examiner', text: '{雨|あめ}のとき、ケーキを{作|つく}る{人|ひと}は{誰|だれ}ですか。', ro: 'Ame no toki, keeki o tsukuru hito wa dare desu ka.', vi: 'Người làm bánh khi trời mưa là ai?' },
        { who: 'Bạn', role: 'candidate', text: 'アンナさんです。', ro: 'Anna-san desu.', vi: 'Là Anna ạ.' },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo cho câu có tranh',
      items: [
        'Tranh có **hai việc** trong một ô → dùng ngay **～たり～たりします**. Tranh có **điều kiện** (trời mưa / trời đẹp) → mở đầu bằng **～とき、**.',
        'Tranh thời gian biểu (mỗi sáng, thứ Ba…) → **～ています** (thói quen). Tranh niên biểu (tuổi, cấp học) → **～のとき、～ました**.',
        'Nói về người trong tranh: ông của họ là **おじいさん**, bố là **お{父|とう}さん** — không dùng {祖父|そふ}／{父|ちち} (chỉ dùng cho người nhà mình).',
      ],
    },

    /* ── Đóng vai ── */
    { t: 'h', text: 'Đóng vai — nói chuyện với bạn bằng thể thường (ロールプレイ p.201)' },
    {
      t: 'dialogue',
      title: 'Vai — A đến nhà bạn B chơi; B hỏi chuyện rồi rủ A đi chơi',
      lines: [
        { who: 'B', role: 'b', text: 'いらっしゃい。どうぞ。', ro: 'Irasshai. Douzo.', vi: 'Vào đi. Mời.' },
        { who: 'A', role: 'a', text: 'お{邪魔|じゃま}します。わあ、きれいな{部屋|へや}だね。', ro: 'Ojama shimasu. Waa, kirei na heya da ne.', vi: 'Mình vào nhé. Ôi, phòng đẹp thế.' },
        { who: 'B', role: 'b', text: 'ありがとう。Aさん、{最近|さいきん}、{忙|いそが}しい？', ro: 'Arigatou. A-san, saikin, isogashii?', vi: 'Cảm ơn. A dạo này bận không?' },
        { who: 'A', role: 'a', text: 'うん、ちょっと{忙|いそが}しい。{平日|へいじつ}はアルバイトしてるから。', ro: 'Un, chotto isogashii. Heijitsu wa arubaito shite ru kara.', vi: 'Ừ, hơi bận. Vì ngày thường mình đi làm thêm.' },
        { who: 'B', role: 'b', text: 'そっか。{休|やす}みの{日|ひ}は{何|なに}してる？', ro: 'Sokka. Yasumi no hi wa nani shite ru?', vi: 'Thế à. Ngày nghỉ cậu làm gì?' },
        { who: 'A', role: 'a', text: '{映画|えいが}{見|み}たり、{寝|ね}たりしてる。', ro: 'Eiga mitari, netari shite ru.', vi: 'Xem phim, ngủ này nọ.' },
        { who: 'B', role: 'b', text: 'じゃ、{今度|こんど}の{日曜日|にちようび}、{一緒|いっしょ}に{映画|えいが}{見|み}に{行|い}かない？', ro: 'Ja, kondo no nichiyoubi, issho ni eiga mi ni ikanai?', vi: 'Vậy Chủ Nhật tới đi xem phim cùng không?' },
        { who: 'A', role: 'a', text: 'いいね。{何|なに}{見|み}る？', ro: 'Ii ne. Nani miru?', vi: 'Được đấy. Xem phim gì?' },
        { who: 'B', role: 'b', text: '「キングマン」はどう？ちょっと{長|なが}いけど、おもしろいよ。', ro: '"Kinguman" wa dou? Chotto nagai kedo, omoshiroi yo.', vi: '"Kingman" thì sao? Hơi dài nhưng hay đấy.' },
        { who: 'A', role: 'a', text: 'いいね。じゃ、また{日曜日|にちようび}に。', ro: 'Ii ne. Ja, mata nichiyoubi ni.', vi: 'Được. Vậy hẹn Chủ Nhật nhé.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Vai — từ chối lời rủ (thể thường)',
      lines: [
        { who: 'A', role: 'a', text: '{週末|しゅうまつ}、{一緒|いっしょ}に{海|うみ}{行|い}かない？', ro: 'Shuumatsu, issho ni umi ikanai?', vi: 'Cuối tuần đi biển cùng không?' },
        { who: 'B', role: 'b', text: 'あ、ごめん。{週末|しゅうまつ}は{引|ひ}っ{越|こ}しだから。', ro: 'A, gomen. Shuumatsu wa hikkoshi da kara.', vi: 'À, xin lỗi. Vì cuối tuần mình chuyển nhà.' },
        { who: 'A', role: 'a', text: 'そっか。じゃ、また{今度|こんど}。', ro: 'Sokka. Ja, mata kondo.', vi: 'Thế à. Vậy để lần sau.' },
      ],
    },
    {
      t: 'note',
      title: 'Ghi nhớ khi đóng vai',
      items: [
        'Vai với **bạn bè** (ロールプレイ p.201): thể thường suốt từ đầu đến cuối — うん／ううん, Vる？, Vない？, ～から, ～けど, よ／ね.',
        'Khi **thi**: nếu giám thị yêu cầu đóng vai bạn bè thì mới nói thể thường; còn trả lời giám thị thì **luôn です／ます**.',
        'お{邪魔|じゃま}します (xin phép vào nhà) và いらっしゃい (mời vào) là câu chào khi đến nhà người khác — dùng được với cả bạn.',
      ],
    },

    /* ── Reading ── */
    { t: 'h', text: 'Đọc to — Reading (40 điểm)' },
    {
      t: 'p',
      text: 'Đề đọc dài khoảng 100–110 ký tự: **4 từ chữ Hán** gạch chân (12đ), **4 từ katakana** (12đ), còn lại hiragana (16đ, sai một ký tự −0,2đ). 30 giây chuẩn bị. Bốn đoạn dưới đây viết đúng khuôn đó, chỉ dùng từ Bài 1–11. Tắt furigana khi đã quen (hoặc luyện ở **Chữ Hán · Đọc không furigana**).',
    },
    {
      t: 'examples',
      items: [
        {
          en: 'わたしはきょねんにほんへきました。{初|はじ}めはさびしかったですが、いまは{生活|せいかつ}になれました。{平日|へいじつ}はがっこうでべんきょうしています。じゅぎょうのあとで、コンビニでアルバイトをしています。やすみのひは、ジョギングをしたりクラスメイトとカラオケにいったりしています。',
          ro: 'Watashi wa kyonen Nihon e kimashita. Hajime wa sabishikatta desu ga, ima wa seikatsu ni naremashita. Heijitsu wa gakkou de benkyou shite imasu. Jugyou no ato de, konbini de arubaito o shite imasu. Yasumi no hi wa, jogingu o shitari kurasumeito to karaoke ni ittari shite imasu.',
          vi: 'Tôi sang Nhật năm ngoái. Lúc đầu cô đơn, nhưng giờ đã quen với cuộc sống. Ngày thường tôi học ở trường. Sau giờ học tôi làm thêm ở cửa hàng tiện lợi. Ngày nghỉ tôi chạy bộ, đi karaoke với bạn cùng lớp…',
        },
        {
          en: 'わたしは{小学生|しょうがくせい}のとき、テレビでオリンピックをみました。すいえいの{選手|せんしゅ}がかっこよかったですから、すいえいをはじめました。{初|はじ}めはへたでしたが、だんだんじょうずになりました。いまもまいしゅうプールでおよいでいます。',
          ro: 'Watashi wa shougakusei no toki, terebi de orinpikku o mimashita. Suiei no senshu ga kakkoyokatta desu kara, suiei o hajimemashita. Hajime wa heta deshita ga, dandan jouzu ni narimashita. Ima mo maishuu puuru de oyoide imasu.',
          vi: 'Hồi tiểu học tôi xem Olympic trên TV. Vì các vận động viên bơi rất ngầu nên tôi bắt đầu học bơi. Lúc đầu bơi dở, nhưng dần dần giỏi lên. Bây giờ tuần nào tôi cũng bơi ở bể.',
        },
        {
          en: 'ひまなとき、わたしはへやで{雑誌|ざっし}をよんだりゲームをしたりします。{頭|あたま}がいたいときは、くすりをのんではやくねます。かぜをひいたときは、がっこうを{休|やす}んで、{店長|てんちょう}にでんわします。アルバイトもやすみますから。',
          ro: 'Hima na toki, watashi wa heya de zasshi o yondari geemu o shitari shimasu. Atama ga itai toki wa, kusuri o nonde hayaku nemasu. Kaze o hiita toki wa, gakkou o yasunde, tenchou ni denwa shimasu. Arubaito mo yasumimasu kara.',
          vi: 'Khi rảnh tôi ở trong phòng đọc tạp chí, chơi game… Khi đau đầu thì tôi uống thuốc rồi ngủ sớm. Khi bị cảm thì tôi nghỉ học và gọi điện cho cửa hàng trưởng. Vì tôi cũng nghỉ làm thêm.',
        },
        {
          en: 'このでんしじしょは、わたしがにほんへくるとき、ともだちがくれました。このとけいは、だいがくに{入学|にゅうがく}したとき、{祖父|そふ}にもらいました。こうこうを{卒業|そつぎょう}したとき、ともだちとわかれました。とてもさびしかったです。でも、いまはSNSでよくはなしています。',
          ro: 'Kono denshi jisho wa, watashi ga Nihon e kuru toki, tomodachi ga kuremashita. Kono tokei wa, daigaku ni nyuugaku shita toki, sofu ni moraimashita. Koukou o sotsugyou shita toki, tomodachi to wakaremashita. Totemo sabishikatta desu. Demo, ima wa SNS de yoku hanashite imasu.',
          vi: 'Cuốn từ điển điện tử này bạn tặng tôi lúc tôi sắp sang Nhật. Chiếc đồng hồ này tôi được ông tặng khi vào đại học. Khi tốt nghiệp cấp ba tôi chia tay các bạn. Rất buồn. Nhưng bây giờ chúng tôi hay nói chuyện qua mạng xã hội.',
        },
      ],
    },
    {
      t: 'note',
      title: 'Chỗ dễ đọc sai trong bốn đoạn trên',
      items: [
        '**生活 せいかつ**, **平日 へいじつ**, **小学生 しょうがくせい**, **選手 せんしゅ**, **雑誌 ざっし**, **店長 てんちょう**, **入学 にゅうがく**, **祖父 そふ**, **卒業 そつぎょう** — từ chữ Hán dạng đề thi.',
        'Katakana kéo dài / âm ngắt: コンビニ, アルバイト, ジョギング jogingu, クラスメイト kurasumeito, カラオケ, オリンピック orinpikku, プール puuru, ゲーム geemu.',
        'Thể て/た đọc liền: のんで (nonde), やすんで (yasunde), およいでいます (oyoide imasu), ひいた (hiita).',
        'は đọc **wa**, を đọc **o**, へ đọc **e**: {初|はじ}め**は**, にほん**へ**, がっこう**を**{休|やす}んで.',
      ],
    },

    /* ── Tự ghi âm ── */
    { t: 'h', text: 'Tự ghi âm — trả lời không nhìn đáp án' },
    {
      t: 'speak',
      id: 'b11-noi-ghi-am',
      part: '1',
      questions: [
        'やすみの ひ、なにを しますか。',
        'まいあさ、なにを たべて いますか。',
        'じゅぎょうは なんじに おわりますか。',
        'アルバイトを して いますか。',
        'にほんごの べんきょうは どうですか。',
        'ひまな とき、なにを しますか。',
        'あめの とき、なにを しますか。',
        'さびしい とき、どう しますか。',
        'あたまが いたい とき、どう しますか。',
        'いつ にほんごの べんきょうを はじめましたか。',
        'しょうがくせいの とき、なにが すきでしたか。',
        'こうこうを そつぎょう した とき、なにを もらいましたか。',
      ],
    },
  ],
};

/* ═══════════════════════════ 7. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b11-bai-tap',
  kind: 'homework',
  title: 'Bài tập về nhà — Bài 11 (có đáp án)',
  goal: 'Tự chia thể た và thể thường, dịch, đổi dạng câu, chọn trợ từ – từ vựng – câu đáp và ghép câu Bài 11 không cần nhìn bài học.',
  minutes: 55,
  blocks: [
    {
      t: 'p',
      text: 'Gõ tiếng Nhật bằng bộ gõ (gõ romaji, máy đổi sang kana). Chữ Hán hay kana đều được chấp nhận; dấu câu và dấu cách không tính. Nếu máy chấm sai mà bạn tin mình đúng, bấm **Hỏi gia sư** ngay dưới câu đó.',
    },
    {
      t: 'quiz',
      id: 'b11-bt-dich',
      title: 'Dịch sang tiếng Nhật',
      kind: 'translate',
      grammar: 'Vています (thói quen) · Vたり Vたりします · N1は～が、N2は～ · ［イA／ナAな／Nの／V辞書形／Vた／Vない］とき · ～とき、どうしますか · 友達言葉',
      items: [
        { q: 'Sáng nào tôi cũng uống sữa.', answers: V('{毎朝|まいあさ}、{牛乳|ぎゅうにゅう}を{飲|の}んでいます。', '{毎朝|まいあさ}、{牛乳|ぎゅうにゅう}を{飲|の}みます。', '{毎朝|まいあさ}、ミルクを{飲|の}んでいます。'), hint: '毎朝, 牛乳, 飲みます → ています' },
        { q: 'Tôi đang làm thêm ở nhà hàng.', answers: V('レストランでアルバイトをしています。', '{私|わたし}はレストランでアルバイトをしています。'), hint: 'レストランで, アルバイト' },
        { q: 'Thứ Bảy hằng tuần tôi đi học lớp thư pháp.', answers: V('{毎週|まいしゅう}{土曜日|どようび}、{書道|しょどう}{教室|きょうしつ}に{通|かよ}っています。', '{毎週|まいしゅう}{土曜日|どようび}に{書道|しょどう}{教室|きょうしつ}に{通|かよ}っています。'), hint: '毎週, 書道教室に通います' },
        { q: 'Ngày nghỉ tôi nghe nhạc, chơi game…', answers: V('{休|やす}みの{日|ひ}、{音楽|おんがく}を{聞|き}いたりゲームをしたりしています。', '{休|やす}みの{日|ひ}、{音楽|おんがく}を{聞|き}いたりゲームをしたりします。', '{休|やす}みの{日|ひ}は{音楽|おんがく}を{聞|き}いたりゲームをしたりしています。'), hint: '聞きます → 聞いたり, します → したり' },
        { q: 'Cuối tuần tôi dọn phòng, giặt đồ… (đã làm)', answers: V('{週末|しゅうまつ}、{部屋|へや}を{掃除|そうじ}したり{洗濯|せんたく}したりしました。', '{週末|しゅうまつ}は{部屋|へや}を{掃除|そうじ}したり{洗濯|せんたく}したりしました。'), hint: '掃除します, 洗濯します — thì ở しました' },
        { q: 'Hội thoại thì tôi thích, còn viết văn thì không thích.', answers: V('{会話|かいわ}は{好|す}きですが、{作文|さくぶん}は{好|す}きじゃありません。', '{会話|かいわ}は{好|す}きですが、{作文|さくぶん}は{好|す}きではありません。'), hint: '会話は～が、作文は～' },
        { q: 'Lúc đầu vất vả, nhưng bây giờ đã thấy vui.', answers: V('{初|はじ}めは{大変|たいへん}でしたが、{今|いま}は{楽|たの}しくなりました。', '{初|はじ}めは{大変|たいへん}でしたが、{今|いま}は{楽|たの}しいです。'), hint: '初めは, 大変, 今は, 楽しくなります' },
        { q: 'Tôi đã quen với cuộc sống ở Nhật.', answers: V('{日本|にほん}の{生活|せいかつ}に{慣|な}れました。', 'もう{日本|にほん}の{生活|せいかつ}に{慣|な}れました。'), hint: '生活に慣れます' },
        { q: 'Khi rảnh, tôi đọc tạp chí.', answers: V('{暇|ひま}なとき、{雑誌|ざっし}を{読|よ}みます。'), hint: '暇な + とき' },
        { q: 'Khi trời mưa, tôi đọc sách trong phòng.', answers: V('{雨|あめ}のとき、{部屋|へや}で{本|ほん}を{読|よ}みます。'), hint: '雨の + とき' },
        { q: 'Hồi cấp hai, tôi bắt đầu chơi guitar.', answers: V('{中学生|ちゅうがくせい}のとき、ギターを{始|はじ}めました。'), hint: '中学生の + とき, 始めます' },
        { q: 'Khi tôi (sắp) sang Nhật, bạn tôi tặng từ điển.', answers: V('{日本|にほん}へ{来|く}るとき、{友達|ともだち}が{辞書|じしょ}をくれました。', '{日本|にほん}に{来|く}るとき、{友達|ともだち}が{辞書|じしょ}をくれました。'), hint: '来る (thể từ điển) + とき, くれました' },
        { q: 'Khi đi Ý, tôi đã mua cái túi này.', answers: V('イタリアへ{行|い}ったとき、このかばんを{買|か}いました。', 'イタリアに{行|い}ったとき、このかばんを{買|か}いました。'), hint: '行った (thể た) + とき' },
        { q: 'Khi không có ca làm thêm, tôi đi chơi với bạn.', answers: V('アルバイトがないとき、{友達|ともだち}と{遊|あそ}びます。'), hint: 'ありません → ない + とき' },
        { q: 'Khi mệt, bạn làm thế nào?', answers: V('{疲|つか}れたとき、どうしますか。'), hint: '疲れた + とき、どうしますか' },
        { q: '(Với bạn) Cậu hay xem phim truyền hình Nhật không?', answers: V('よく{日本|にほん}のドラマ{見|み}る？', 'よく{日本|にほん}のドラマを{見|み}る？'), hint: 'thể thường, không か' },
        { q: '(Với bạn) Không, mình không bận.', answers: V('ううん、{忙|いそが}しくない。'), hint: 'ううん, 忙しくない' },
        { q: '(Với bạn) Cuối tuần đi ăn cơm cùng không?', answers: V('{週末|しゅうまつ}、{一緒|いっしょ}にご{飯|はん}{食|た}べない？', '{週末|しゅうまつ}、{一緒|いっしょ}にご{飯|はん}を{食|た}べない？'), hint: 'Vない？ = Vませんか' },
        { q: '(Với bạn) Cho mình mượn cục tẩy.', answers: V('{消|け}しゴム{貸|か}して。', '{消|け}しゴムを{貸|か}して。'), hint: 'Vて = Vてください' },
      ],
    },
    {
      t: 'quiz',
      id: 'b11-bt-doi-dang',
      title: 'Đổi dạng — viết lại theo yêu cầu (gõ chữ Hán hoặc kana)',
      kind: 'fill',
      grammar: 'thể た: て→た, で→だ (行って→行った) · 普通形: ます→辞書形 · ません→ない · ました→た · ませんでした→なかった · イA: bỏ です · ナA/N: だ・じゃない・だった・じゃなかった · とき: イA／ナAな／Nの／V thể thường',
      items: [
        { q: '{聞|き}きます → thể た', answers: V('{聞|き}いた') },
        { q: '{泳|およ}ぎます → thể た', answers: V('{泳|およ}いだ') },
        { q: '{行|い}きます → thể た', answers: V('{行|い}った') },
        { q: '{休|やす}みます → thể た', answers: V('{休|やす}んだ') },
        { q: '{通|かよ}います → thể た', answers: V('{通|かよ}った') },
        { q: '{忘|わす}れます → thể た', answers: V('{忘|わす}れた') },
        { q: '{来|き}ます → thể た', answers: V('{来|き}た') },
        { q: '{散歩|さんぽ}します → thể た', answers: V('{散歩|さんぽ}した') },
        { q: '{見|み}ませんでした → thể thường', answers: V('{見|み}なかった') },
        { q: '{飲|の}みません → thể thường', answers: V('{飲|の}まない') },
        { q: 'ありませんでした → thể thường', answers: V('なかった') },
        { q: '{忙|いそが}しくないです → thể thường', answers: V('{忙|いそが}しくない') },
        { q: 'よかったです → thể thường', answers: V('よかった') },
        { q: '{暇|ひま}です → thể thường (câu kể)', answers: V('{暇|ひま}だ') },
        { q: '{大変|たいへん}じゃありませんでした → thể thường', answers: V('{大変|たいへん}じゃなかった', '{大変|たいへん}ではなかった') },
        { q: '{休|やす}みでした → thể thường', answers: V('{休|やす}みだった') },
        { q: '{暇|ひま}です → ＿とき', answers: V('{暇|ひま}なとき') },
        { q: '{雨|あめ}です → ＿とき', answers: V('{雨|あめ}のとき') },
        { q: '{眠|ねむ}いです → ＿とき', answers: V('{眠|ねむ}いとき') },
        { q: '{道|みち}がわかりません → ＿とき', answers: V('{道|みち}がわからないとき') },
      ],
    },
    {
      t: 'mcq',
      id: 'b11-bt-tro-tu',
      title: 'Chọn trợ từ đúng',
      items: [
        { q: '{日本|にほん}の{生活|せいかつ}＿{慣|な}れましたか。', options: ['を', 'に', 'で', 'が'], correct: 1, why: 'Quen với N → N**に**{慣|な}れます.' },
        { q: '{毎週|まいしゅう}、{料理|りょうり}{教室|きょうしつ}＿{通|かよ}っています。', options: ['を', 'で', 'に', 'が'], correct: 2, why: 'Nơi đi đều → **に**{通|かよ}います.' },
        { q: '{風邪|かぜ}をひきましたから、{学校|がっこう}＿{休|やす}みます。', options: ['を', 'に', 'で', 'へ'], correct: 0, why: 'Nghỉ (học/làm) → N**を**{休|やす}みます.' },
        { q: '{天気|てんき}がいいとき、{公園|こうえん}＿{散歩|さんぽ}します。', options: ['に', 'を', 'が', 'へ'], correct: 1, why: 'Đi dạo khắp một nơi → **を** (giống ポイント 96 Bài 10).' },
        { q: '{国|くに}へ{帰|かえ}るとき、{友達|ともだち}＿{別|わか}れました。', options: ['を', 'に', 'と', 'が'], correct: 2, why: 'Chia tay ai → **と**{別|わか}れます.' },
        { q: '{高校|こうこう}＿{卒業|そつぎょう}しました。', options: ['を', 'に', 'で', 'が'], correct: 0, why: 'Tốt nghiệp trường → **を**{卒業|そつぎょう}します.' },
        { q: '{大学|だいがく}＿{入学|にゅうがく}しました。', options: ['を', 'に', 'で', 'と'], correct: 1, why: 'Vào trường → **に**{入学|にゅうがく}します.' },
        { q: '{暇|ひま}＿とき、ゲームをします。', options: ['の', 'な', 'に', '—'], correct: 1, why: 'ナA + **な** + とき.' },
        { q: '{小学生|しょうがくせい}＿とき、{水泳|すいえい}を{始|はじ}めました。', options: ['の', 'な', 'に', '—'], correct: 0, why: 'N + **の** + とき.' },
        { q: '{遠|とお}いところ＿まだ{行|い}っていません。 (đối chiếu với chỗ gần)', options: ['をは', 'へは', 'がは', 'に'], correct: 1, why: 'へ + は → **へは** (ポイント 100).' },
        { q: '{寝|ね}るとき、{電気|でんき}＿{消|け}します。', options: ['が', 'を', 'に', 'で'], correct: 1, why: 'Tắt cái gì → **を**{消|け}します.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b11-bt-tu-vung',
      title: 'Chọn từ đúng',
      items: [
        { q: '＿は{少|すこ}し{寂|さび}しかったですが、{今|いま}は{楽|たの}しいです。', options: ['{初|はじ}めて', '{初|はじ}め', 'だんだん', 'また'], correct: 1, why: 'Lúc đầu → **{初|はじ}め**は. {初|はじ}めて = lần đầu tiên.' },
        { q: '{大学生|だいがくせい}のとき、＿{外国|がいこく}へ{行|い}きました。', options: ['{初|はじ}め', '{初|はじ}めて', 'なかなか', 'たいてい'], correct: 1, why: 'Lần đầu tiên → **{初|はじ}めて**.' },
        { q: '{夜|よる}、＿{寝|ね}ることができません。', options: ['なかなか', 'たいてい', 'だんだん', 'よく'], correct: 0, why: '"Mãi không" → **なかなか** + phủ định.' },
        { q: '{初|はじ}めは{下手|へた}でしたが、＿{上手|じょうず}になりました。', options: ['なかなか', 'だんだん', 'また', 'ええ'], correct: 1, why: 'Dần dần → **だんだん** + なりました.' },
        { q: '{休|やす}みの{日|ひ}は、＿うちでゲームをしています。', options: ['たいてい', 'なかなか', '{初|はじ}めて', 'それで'], correct: 0, why: 'Thường thì → **たいてい**.' },
        { q: '{選手|せんしゅ}がかっこよかったです。＿、{水泳|すいえい}を{始|はじ}めました。', options: ['でも', 'それで', 'それから', 'じゃ'], correct: 1, why: 'Vì thế → **それで**.' },
        { q: '{授業|じゅぎょう}の{前|まえ}は、いつも＿です。コーヒーを{飲|の}みます。', options: ['{寂|さび}しい', '{眠|ねむ}い', '{痛|いた}い', '{忙|いそが}しい'], correct: 1, why: 'Uống cà phê cho tỉnh → **{眠|ねむ}い**.' },
        { q: '{暑|あつ}いですね。エアコンを＿てもいいですか。', options: ['{消|け}し', 'つけ', '{始|はじ}め', '{休|やす}ん'], correct: 1, why: 'Nóng → **bật** điều hoà: つけても.' },
        { q: 'よく{漢字|かんじ}を＿。', options: ['{忘|わす}れます', '{別|わか}れます', '{慣|な}れます', '{終|お}わります'], correct: 0, why: 'Hay **quên** chữ Hán.' },
        { q: '{週末|しゅうまつ}は＿ですから、{忙|いそが}しいです。', options: ['{引|ひ}っ{越|こ}し', '{一人|ひとり}{暮|ぐ}らし', '{平日|へいじつ}', '{店長|てんちょう}'], correct: 0, why: 'Cuối tuần **chuyển nhà** nên bận.' },
        { q: 'アルバイトを{休|やす}むとき、＿に{電話|でんわ}します。', options: ['{選手|せんしゅ}', '{店長|てんちょう}', '{祖父|そふ}', 'クラスメイト'], correct: 1, why: 'Nghỉ làm → báo **cửa hàng trưởng** ({店長|てんちょう}).' },
        { q: '(Với bạn) A：{週末|しゅうまつ}、{暇|ひま}？ B：＿、{暇|ひま}じゃない。', options: ['うん', 'ううん', 'ええ', 'はい'], correct: 1, why: 'Không rảnh → **ううん** (thân mật).' },
      ],
    },
    {
      t: 'mcq',
      id: 'b11-bt-hoi-dap',
      title: 'Chọn câu đáp đúng',
      items: [
        { q: 'A：{休|やす}みの{日|ひ}、よく{何|なに}をしていますか。', options: ['{音楽|おんがく}を{聞|き}いたりゲームをしたりしています。', '{音楽|おんがく}を{聞|き}きたりゲームをしたりです。', 'はい、しています。', '{休|やす}みの{日|ひ}です。'], correct: 0, why: 'Liệt kê việc làm → **～たり～たりしています** (ポイント 99).' },
        { q: 'A：{一人|ひとり}{暮|ぐ}らしはどうですか。', options: ['{初|はじ}めは{寂|さび}しかったですが、{今|いま}は{楽|たの}しいです。', 'はい、{一人|ひとり}{暮|ぐ}らしです。', '{一人|ひとり}{暮|ぐ}らしをします。', 'いいえ、どうしません。'], correct: 0, why: 'Hỏi cảm nhận → **初めは～が、今は～** (ポイント 100).' },
        { q: 'A：いつ{水泳|すいえい}を{始|はじ}めましたか。', options: ['{小学生|しょうがくせい}のとき、{始|はじ}めました。', '{水泳|すいえい}が{好|す}きですから。', 'はい、{始|はじ}めました。', '{毎週|まいしゅう}{泳|およ}いでいます。'], correct: 0, why: 'Hỏi **いつ** → mốc thời gian: ～のとき (ポイント 101).' },
        { q: 'A：{頭|あたま}が{痛|いた}いとき、どうしますか。', options: ['{頭|あたま}が{痛|いた}いです。', '{薬|くすり}を{飲|の}みます。', 'はい、{痛|いた}いです。', 'どうもしません。'], correct: 1, why: 'どうしますか → **việc mình làm** (ポイント 102).' },
        { q: 'A：その{時計|とけい}、すてきですね。', options: ['{入学|にゅうがく}したとき、{祖父|そふ}にもらいました。', '{入学|にゅうがく}するとき、{祖父|そふ}をもらいました。', 'はい、すてきです。', 'いいえ、{時計|とけい}じゃありません。'], correct: 0, why: 'Được khen → kể món đồ có từ khi nào: **～たとき、～にもらいました**.' },
        { q: '(Với bạn) A：よくカラオケ{行|い}く？ (B có đi)', options: ['はい、{行|い}きます。', 'うん、{行|い}く。', 'ううん、{行|い}く。', 'うん、{行|い}きます。'], correct: 1, why: 'Thân mật, cùng một thể: **うん、{行|い}く**.' },
        { q: '(Với bạn) A：{一緒|いっしょ}にご{飯|はん}{食|た}べない？ (B bận làm thêm)', options: ['いいね。', 'あ、ごめん、アルバイトだから。', 'すみません、アルバイトですから。', 'ううん、{食|た}べない。'], correct: 1, why: 'Từ chối bạn: **ごめん** + N**だ**から.' },
        { q: '(Với bạn) A：{写真|しゃしん}{見|み}てもいい？', options: ['うん、いいよ。', 'はい、どうぞ。', 'ううん、{見|み}る。', 'そっか。'], correct: 0, why: 'Cho phép bạn → **うん、いいよ**.' },
        { q: '(Với bạn) A：ごめん、{土曜日|どようび}は{用事|ようじ}があるから。', options: ['そっか。じゃ、また{今度|こんど}。', 'はい、どうぞ。', 'うん、いいよ。', 'いいね。'], correct: 0, why: 'Bạn từ chối → **そっか。じゃ、また{今度|こんど}**.' },
      ],
    },
    {
      t: 'build',
      id: 'b11-bt-ghep',
      title: 'Ghép câu — kể cuộc sống của mình',
      items: [
        { vi: 'Tôi đã quen với cuộc sống ở Nhật.', chips: ['{日本|にほん}の', '{生活|せいかつ}に', '{慣|な}れました', '{生活|せいかつ}を', '{慣|な}れています'], answer: ['{日本|にほん}の', '{生活|せいかつ}に', '{慣|な}れました'], ro: 'Nihon no seikatsu ni naremashita.' },
        { vi: 'Ngày thường tôi đi học ở trường.', chips: ['{平日|へいじつ}は', '{学校|がっこう}に', '{通|かよ}っています', '{学校|がっこう}を', '{通|かよ}いています'], answer: ['{平日|へいじつ}は', '{学校|がっこう}に', '{通|かよ}っています'], ro: 'Heijitsu wa gakkou ni kayotte imasu.' },
        { vi: 'Tối nào tôi cũng viết nhật ký.', chips: ['{毎晩|まいばん}、', '{日記|にっき}を', '{書|か}いています', '{書|か}きています', '{毎晩|まいばん}に'], answer: ['{毎晩|まいばん}、', '{日記|にっき}を', '{書|か}いています'], ro: 'Maiban, nikki o kaite imasu.' },
        { vi: 'Ngày nghỉ tôi đi dạo công viên, chụp ảnh…', chips: ['{休|やす}みの{日|ひ}、', '{公園|こうえん}を', '{散歩|さんぽ}したり', '{写真|しゃしん}を', '{撮|と}ったり', 'しています', '{撮|と}りたり'], answer: ['{休|やす}みの{日|ひ}、', '{公園|こうえん}を', '{散歩|さんぽ}したり', '{写真|しゃしん}を', '{撮|と}ったり', 'しています'], ro: 'Yasumi no hi, kouen o sanpo shitari shashin o tottari shite imasu.' },
        { vi: 'Khi bị cảm, tôi nghỉ học.', chips: ['{風邪|かぜ}を', 'ひいた', 'とき、', '{学校|がっこう}を', '{休|やす}みます', 'ひきます', '{学校|がっこう}に'], answer: ['{風邪|かぜ}を', 'ひいた', 'とき、', '{学校|がっこう}を', '{休|やす}みます'], ro: 'Kaze o hiita toki, gakkou o yasumimasu.' },
        { vi: 'Khi buồn, tôi gọi điện cho gia đình ở quê.', chips: ['{寂|さび}しい', 'とき、', '{国|くに}の', '{家族|かぞく}に', '{電話|でんわ}します', '{寂|さび}しいな', '{家族|かぞく}を'], answer: ['{寂|さび}しい', 'とき、', '{国|くに}の', '{家族|かぞく}に', '{電話|でんわ}します'], ro: 'Sabishii toki, kuni no kazoku ni denwa shimasu.' },
        { vi: 'Khi tốt nghiệp cấp ba, tôi được mẹ tặng đồng hồ.', chips: ['{高校|こうこう}を', '{卒業|そつぎょう}した', 'とき、', '{母|はは}に', '{時計|とけい}を', 'もらいました', 'くれました'], answer: ['{高校|こうこう}を', '{卒業|そつぎょう}した', 'とき、', '{母|はは}に', '{時計|とけい}を', 'もらいました'], ro: 'Koukou o sotsugyou shita toki, haha ni tokei o moraimashita.' },
        { vi: 'Vì thế tôi bắt đầu chơi tennis.', chips: ['それで、', 'テニスを', '{始|はじ}めました', 'でも、', '{始|はじ}まりました'], answer: ['それで、', 'テニスを', '{始|はじ}めました'], ro: 'Sorede, tenisu o hajimemashita.' },
        { vi: '(Với bạn) Cuối tuần cậu làm gì? — Mình đi Asakusa.', chips: ['{週末|しゅうまつ}、', '{何|なに}した？', '{浅草|あさくさ}', '{行|い}った', '{何|なに}しましたか', '{行|い}く'], answer: ['{週末|しゅうまつ}、', '{何|なに}した？', '{浅草|あさくさ}', '{行|い}った'], ro: 'Shuumatsu, nani shita? Asakusa itta.' },
        { vi: '(Với bạn) Công viên Midori thì sao? Hơi xa nhưng đẹp lắm.', chips: ['みどり{公園|こうえん}は', 'どう？', '{少|すこ}し{遠|とお}いけど、', 'きれいだよ', 'どうですか', 'きれいよ'], answer: ['みどり{公園|こうえん}は', 'どう？', '{少|すこ}し{遠|とお}いけど、', 'きれいだよ'], ro: 'Midori kouen wa dou? Sukoshi tooi kedo, kirei da yo.' },
      ],
    },
  ],
};

export const BAI_11: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, KANJI, NGHE, NOI, BAI_TAP];

/* ═══════════════════ 📖 THEO SÁCH — Bài 11 (p.185–204) ═══════════════════
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
    'Luôn trả lời **đủ câu**, có です／ます ở cuối, câu hỏi có/không thì mở đầu bằng **はい／いいえ** (thi JPD113 trừ điểm nếu quên). **Riêng chủ đề 3 (trang 196–201)** là luyện nói với BẠN — ở đó mới dùng thể thường (うん／ううん); với cô vẫn nói です／ます.',
    'Không nghe rõ câu cô hỏi: nói **もう{一度|いちど}お{願|ねが}いします** hoặc **ゆっくりお{願|ねが}いします**.',
    'Bài nghe やってみよう: ở đây KHÔNG ghi đáp án CD — chỉ ghi cần bắt từ nào. Nghe trên lớp rồi tự điền.',
    'Chỗ nào có tên ミン (Minh), ハノイ (Hà Nội), FPT{大学|だいがく}… là thông tin mẫu — thay bằng thông tin THẬT của bạn.',
    'Dòng dịch "VI" in trong sách ở p.186, 187, 192, 193, 196, 197 thực ra là **tiếng Hàn** (lỗi in / chung khuôn 4 thứ tiếng) — dùng phần tả bằng tiếng Việt ở đây.',
  ],
};

export const SACH_11: Lesson = {
  id: 'b11-sach',
  kind: 'review',
  title: 'Theo sách — Bài 11 (trang 185–204)',
  goal: 'Nhìn tranh quán nhậu, ảnh cũ, lớp học trong sách là nói được: cuộc sống bây giờ, thói quen, ngày nghỉ làm gì, khi … thì làm sao, món đồ / sở thích có từ khi nào, và nói chuyện với bạn bằng thể thường.',
  minutes: 60,
  blocks: [
    CACH_DUNG,

    ...trang(
      'Trang 185 · 話してみよう・聞いてみよう — Mở bài 私の生活',
      '**話してみよう** — 4 ảnh không lời: (1) ba cô gái ngồi ở quầy quán ăn nhanh, ăn hamburger, uống nước, cười nói; (2) ở bể bơi: một người mẹ bế em bé, bé gái đeo phao đứng cạnh, một người ngồi đọc sách gần đó — cảnh gia đình ngày nghỉ; (3) trong cửa hàng tiện lợi: nhân viên nữ đeo tạp dề xếp hàng lên kệ, nhân viên nam đội mũ cầm khay và bảng ghi chép, một khách đang lấy hàng — làm thêm; (4) một xấp ảnh cũ chụp ngoài trời: em bé trên bậc thềm, nhóm người ngồi trên cầu thang, một người đang đi — kỷ niệm ngày xưa. Mục đích: nói về sinh hoạt bây giờ và chuyện ngày trước. **聞いてみよう** (CD C01): nghe trước đoạn hội thoại dài của bài — chính là trang 204.',
      [
        C('（ảnh 1）この{人|ひと}たちは{何|なに}をしていますか。', '(shashin 1) Kono hitotachi wa nani o shite imasu ka.', '(ảnh 1) Những người này đang làm gì?'),
        S('ハンバーガーを{食|た}べたり、ジュースを{飲|の}んだりしています。', 'Hanbaagaa o tabetari, juusu o nondari shite imasu.', 'Họ đang ăn hamburger, uống nước…'),
        C('（ảnh 3）ここはどこですか。', '(shashin 3) Koko wa doko desu ka.', '(ảnh 3) Đây là đâu?'),
        S('コンビニです。{店|みせ}の{人|ひと}が{働|はたら}いています。', 'Konbini desu. Mise no hito ga hataraite imasu.', 'Là cửa hàng tiện lợi. Nhân viên đang làm việc.'),
        C('ミンさんは{休|やす}みの{日|ひ}、よく{何|なに}をしていますか。', 'Min-san wa yasumi no hi, yoku nani o shite imasu ka.', 'Minh, ngày nghỉ em hay làm gì?'),
        S('{友達|ともだち}とご{飯|はん}を{食|た}べたり、サッカーをしたりしています。', 'Tomodachi to gohan o tabetari, sakkaa o shitari shite imasu.', 'Em ăn cơm, đá bóng… với bạn.'),
      ],
      [
        'Ảnh có nhiều việc cùng lúc → dùng ngay mẫu mới **～たり～たりしています** (ポイント 99).',
        'Ảnh (4) là ảnh cũ — cô có thể hỏi **{子|こ}どものとき、{何|なに}が{好|す}きでしたか** → **～のとき、～が{好|す}きでした** (ポイント 101).',
        'Xem **Hội thoại · Bức tranh chung của bài** và **Ngữ pháp · Trước tiên — Thể た**.',
      ],
    ),

    ...trang(
      'Trang 186–187 · チャレンジ! {今|いま}の{生活|せいかつ}',
      'Trang 186: **nói chuyện với người quen ở buổi giao lưu và bạn bè trong quán nhậu** ({居酒屋|いざかや}). Tranh lớn: trên tường có bảng thực đơn viết tay; hai chị ngồi ở quầy, một người đưa cốc nước bằng hai tay cho người kia; trên quầy có đĩa nhỏ, đũa, bát cơm, đĩa đồ chiên. Ô (1): bong bóng suy nghĩ ghi "日本の生活" và "日本語" kèm dấu "?", hình người nói chuyện có trái tim và tờ giấy mặt buồn — hai anh hỏi nhau đã quen cuộc sống ở Nhật chưa, học tiếng Nhật thế nào. Ô (2): bong bóng "学校は？", "1時まで", "午後？", hình người dùng máy tính có tia sét, "火曜・木曜" cạnh hình người ngồi bàn — hỏi giờ học, buổi chiều thứ Ba, thứ Năm làm gì. Trang 187: tiếp cảnh quán — bảng "生ビール" và "本日のオススメ"; hai anh ngồi ở quầy, một người chống tay cười. Ô (3): bong bóng "休みの日" + "?", trong có người đeo tai nghe (♪) và người ngồi máy tính — hỏi ngày nghỉ làm gì. Ô (4): "休みの日" + "?", hình hai cậu bé đá bóng dưới mặt trời. Ô (5): "最近" + "?", hình cô gái ngủ ("Zzz") cạnh hộp sữa, và một chị cầm cốc với hộp sữa — dạo này không ngủ được thì uống sữa. **Mục tiêu できる:** nói được và hỏi được về cuộc sống hiện tại. ☞ ポイント 98, 99, 100, 101, 102.',
      [
        C('ミンさん、{大学|だいがく}の{生活|せいかつ}に{慣|な}れましたか。', 'Min-san, daigaku no seikatsu ni naremashita ka.', 'Minh, em đã quen với cuộc sống đại học chưa?'),
        S('はい、{慣|な}れました。{初|はじ}めは{大変|たいへん}でしたが、{今|いま}は{楽|たの}しいです。', 'Hai, naremashita. Hajime wa taihen deshita ga, ima wa tanoshii desu.', 'Dạ rồi. Lúc đầu vất vả nhưng giờ vui ạ.'),
        C('{授業|じゅぎょう}は{何時|なんじ}に{終|お}わりますか。', 'Jugyou wa nanji ni owarimasu ka.', 'Giờ học kết thúc lúc mấy giờ?'),
        S('{12時|じゅうにじ}に{終|お}わります。{火曜|かよう}と{木曜|もくよう}は{午後|ごご}も{授業|じゅぎょう}があります。', 'Juuniji ni owarimasu. Kayou to mokuyou wa gogo mo jugyou ga arimasu.', 'Kết thúc lúc 12 giờ. Thứ Ba, thứ Năm buổi chiều cũng có tiết ạ.'),
        C('{休|やす}みの{日|ひ}、よく{何|なに}をしていますか。', 'Yasumi no hi, yoku nani o shite imasu ka.', 'Ngày nghỉ em hay làm gì?'),
        S('{音楽|おんがく}を{聞|き}いたり、パソコンでゲームをしたりしています。', 'Ongaku o kiitari, pasokon de geemu o shitari shite imasu.', 'Em nghe nhạc, chơi game trên máy tính…'),
        C('{最近|さいきん}、よく{寝|ね}ることができますか。', 'Saikin, yoku neru koto ga dekimasu ka.', 'Dạo này em ngủ ngon không?'),
        S('いいえ、なかなか{寝|ね}ることができません。{寝|ね}ることができないとき、{牛乳|ぎゅうにゅう}を{飲|の}みます。', 'Iie, nakanaka neru koto ga dekimasen. Neru koto ga dekinai toki, gyuunyuu o nomimasu.', 'Không ạ, em mãi không ngủ được. Khi không ngủ được em uống sữa.'),
      ],
      [
        '**ポイント 98 ～ています** (thói quen) · **99 ～たり～たり** · **100 初めは～が、今は～** · **101 ～とき** · **102 ～とき、どうしますか**.',
        'Nhận xét của sách "日本の生活" — người học ở Việt Nam đổi thành **{大学|だいがく}の{生活|せいかつ}** hoặc **{一人|ひとり}{暮|ぐ}らし**.',
        'Mở đầu câu trả lời bằng **そうですねえ** (để nghĩ) là tự nhiên, nhưng phải nói tiếp cả câu.',
        'Xem **Hội thoại · ① 今の生活** và **Ngữ pháp · ポイント 98–102**.',
      ],
    ),

    ...trang(
      'Trang 188 · 言ってみよう (chủ đề 1) — Số 1: 初めは～が、今は～ · Số 2: いつも何をしていますか',
      '**Số 1:** A hỏi "đã quen cuộc sống ở Nhật chưa?" → "vâng" → A hỏi tiếp một câu trong hộp 1 → B trả lời bằng hai ý trong hộp 2: 例 sống một mình thế nào → lúc đầu hơi buồn・giờ đã vui; ① học tiếng Nhật thế nào → thích hội thoại・không thích viết văn; ② đi nhiều nơi chưa → chỗ gần đi rồi・chỗ xa chưa đi; ③ làm thêm vất vả không → lúc đầu vất vả・giờ thấy thú vị. Góc tranh: hai anh nói chuyện mặt đối mặt. **Số 2:** "giờ học kết thúc lúc mấy giờ?" → "1 giờ" → "sau đó bạn thường làm gì?" → tranh: 例 cô phục vụ bưng khay (làm thêm); ① cậu bé ngồi bàn thấp viết bài, sau lưng là giá sách; ② hai người ngồi dưới sàn tập thư pháp, một người mặc kimono cầm tay chỉ; ③ **たいてい** — anh ngồi gõ máy tính, mặt căng thẳng; ④ **たいてい** — người bơi sải trong bể.',
      [
        C('{日本語|にほんご}の{勉強|べんきょう}はどうですか。', 'Nihongo no benkyou wa dou desu ka.', 'Việc học tiếng Nhật thế nào?'),
        S('{会話|かいわ}は{好|す}きですが、{作文|さくぶん}は{好|す}きじゃありません。', 'Kaiwa wa suki desu ga, sakubun wa suki ja arimasen.', 'Hội thoại thì em thích, nhưng viết văn thì không ạ.'),
        C('{授業|じゅぎょう}は{何時|なんじ}に{終|お}わりますか。', 'Jugyou wa nanji ni owarimasu ka.', 'Giờ học kết thúc lúc mấy giờ?'),
        S('{1時|いちじ}に{終|お}わります。', 'Ichiji ni owarimasu.', 'Lúc 1 giờ ạ.'),
        C('それから、いつも{何|なに}をしていますか。', 'Sorekara, itsumo nani o shite imasu ka.', 'Sau đó em thường làm gì?'),
        S('{図書館|としょかん}で{勉強|べんきょう}しています。', 'Toshokan de benkyou shite imasu.', 'Em học ở thư viện ạ.'),
      ],
      [
        'Số 1: trả lời theo khuôn **N1は～が、N2は～** (ポイント 100). Ở ②: {近|ちか}いところ**へは**…、{遠|とお}いところ**へは**まだ{行|い}っていません — へ + は.',
        'Số 2: **いつも／たいてい + ～ています**. たいてい = thường thì (hầu hết các lần).',
        'Tranh ③, ④ không có chữ — câu mẫu dưới đây là một cách hiểu; nói khác đi mà đúng ngữ pháp vẫn được.',
        'Xem **Ngữ pháp · ポイント 98, 100 — bảng thay thế**.',
      ],
      [
        mau([
          E('{日本|にほん}の{生活|せいかつ}に{慣|な}れましたか。— ええ。— {一人|ひとり}{暮|ぐ}らしはどうですか。— そうですねえ。{初|はじ}めは{少|すこ}し{寂|さび}しかったですが、{今|いま}は{楽|たの}しくなりました。— そうですか。', 'Nihon no seikatsu ni naremashita ka. — Ee. — Hitorigurashi wa dou desu ka. — Sou desu nee. Hajime wa sukoshi sabishikatta desu ga, ima wa tanoshiku narimashita. — Sou desu ka.', 'Số 1 例.'),
          E('{日本語|にほんご}の{勉強|べんきょう}はどうですか。— {会話|かいわ}は{好|す}きですが、{作文|さくぶん}は{好|す}きじゃありません。', 'Nihongo no benkyou wa dou desu ka. — Kaiwa wa suki desu ga, sakubun wa suki ja arimasen.', 'Số 1 ①.'),
          E('もういろいろなところへ{行|い}きましたか。— {近|ちか}いところへは{行|い}きましたが、{遠|とお}いところへはまだ{行|い}っていません。', 'Mou iroiro na tokoro e ikimashita ka. — Chikai tokoro e wa ikimashita ga, tooi tokoro e wa mada itte imasen.', 'Số 1 ②.'),
          E('アルバイトは{大変|たいへん}ですか。— {初|はじ}めは{大変|たいへん}でしたが、{今|いま}はおもしろくなりました。', 'Arubaito wa taihen desu ka. — Hajime wa taihen deshita ga, ima wa omoshiroku narimashita.', 'Số 1 ③.'),
          E('{授業|じゅぎょう}は{何時|なんじ}に{終|お}わりますか。— {1時|いちじ}に{終|お}わります。— へえ。それから、いつも{何|なに}をしていますか。— アルバイトをしています。— そうですか。', 'Jugyou wa nanji ni owarimasu ka. — Ichiji ni owarimasu. — Hee. Sorekara, itsumo nani o shite imasu ka. — Arubaito o shite imasu. — Sou desu ka.', 'Số 2 例.'),
          E('うちで{宿題|しゅくだい}をしています。', 'Uchi de shukudai o shite imasu.', 'Số 2 ① — làm bài ở nhà.'),
          E('{書道|しょどう}を{習|なら}っています。', 'Shodou o naratte imasu.', 'Số 2 ② — học thư pháp.'),
          E('たいてい、パソコンでレポートを{書|か}いています。', 'Taitei, pasokon de repooto o kaite imasu.', 'Số 2 ③ — たいてい, viết báo cáo trên máy tính.'),
          E('たいてい、プールで{泳|およ}いでいます。', 'Taitei, puuru de oyoide imasu.', 'Số 2 ④ — たいてい, bơi ở bể.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 189 · 言ってみよう số 3 (chủ đề 1) — ～たり～たりしています',
      '**Số 3:** "ngày nghỉ bạn hay làm gì?" → hai kiểu trả lời: 例1 "nghe nhạc, chơi game…"; 例2 "ra công viên, rồi đọc sách, vẽ tranh…". Tranh: 例1 người ngồi sofa chơi game, cậu bé chạy bộ; 例2 chị đi tới đài phun nước trong công viên → (vạch chấm) ngồi ghế đọc sách, một chị khác vẽ tranh; ① người xem TV trên sofa + cậu bé đội mũ chạy bộ; ② chị đứng cạnh hoa ở vườn có đài phun nước + chị ngồi quán ngoài trời đọc sách uống cà phê; ③ người đi bộ → giá sách (thư viện) → (vạch chấm) một người đeo tai nghe tập viết "あいうえお", một người đeo tai nghe xem màn hình; ④ hai người gặp nhau trên phố → (vạch chấm) hai chị ăn ở nhà hàng + một đôi xem phim.',
      [
        C('ミンさん、{休|やす}みの{日|ひ}、よく{何|なに}をしていますか。', 'Min-san, yasumi no hi, yoku nani o shite imasu ka.', 'Minh, ngày nghỉ em hay làm gì?'),
        S('{公園|こうえん}へ{行|い}って、{散歩|さんぽ}したり{写真|しゃしん}を{撮|と}ったりしています。', 'Kouen e itte, sanpo shitari shashin o tottari shite imasu.', 'Em ra công viên, đi dạo, chụp ảnh…'),
        C('{雨|あめ}の{日|ひ}は？', 'Ame no hi wa?', 'Còn ngày mưa?'),
        S('うちで{映画|えいが}を{見|み}たり{本|ほん}を{読|よ}んだりしています。', 'Uchi de eiga o mitari hon o yondari shite imasu.', 'Em ở nhà xem phim, đọc sách…'),
      ],
      [
        'Hai kiểu: **V1たりV2たりしています** (例1) và **（nơi）へ{行|い}って、V1たりV2たりしています** (例2 — tranh có mũi tên đi tới một nơi).',
        'Chia thể た đúng: {聞|き}く→**{聞|き}いた**り, {読|よ}む→**{読|よ}んだ**り, {描|か}く→**{描|か}いた**り, {撮|と}る→**{撮|と}った**り.',
        'Xem **Ngữ pháp · ポイント 99 — bảng thay thế** (đủ ①–④).',
      ],
      [
        mau([
          E('{休|やす}みの{日|ひ}、よく{何|なに}をしていますか。— {音楽|おんがく}を{聞|き}いたりゲームをしたりしています。— そうですか。', 'Yasumi no hi, yoku nani o shite imasu ka. — Ongaku o kiitari geemu o shitari shite imasu. — Sou desu ka.', 'Số 3 例1.'),
          E('{公園|こうえん}へ{行|い}って、{本|ほん}を{読|よ}んだり{絵|え}を{描|か}いたりしています。', 'Kouen e itte, hon o yondari e o kaitari shite imasu.', 'Số 3 例2.'),
          E('テレビを{見|み}たりジョギングをしたりしています。', 'Terebi o mitari jogingu o shitari shite imasu.', 'Số 3 ①.'),
          E('{公園|こうえん}へ{行|い}って、{花|はな}を{見|み}たりカフェで{本|ほん}を{読|よ}んだりしています。', 'Kouen e itte, hana o mitari kafe de hon o yondari shite imasu.', 'Số 3 ②.'),
          E('{図書館|としょかん}へ{行|い}って、ひらがなを{練習|れんしゅう}したりDVDを{見|み}たりしています。', 'Toshokan e itte, hiragana o renshuu shitari DVD o mitari shite imasu.', 'Số 3 ③.'),
          E('{友達|ともだち}に{会|あ}って、ご{飯|はん}を{食|た}べたり{映画|えいが}を{見|み}たりしています。', 'Tomodachi ni atte, gohan o tabetari eiga o mitari shite imasu.', 'Số 3 ④.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 190 · 言ってみよう số 4 (chủ đề 1) — ～とき、～ます',
      '**Số 4:** "ngày nghỉ bạn hay làm gì?" → "để xem… **khi** …, tôi …" → "ồ". Gợi ý + tranh: 例 trời mưa — chị ngồi trong phòng đọc sách (có bàn nhỏ, giường); ① trời đẹp — nhóm cậu bé đá bóng giữa hàng cây; ② rảnh — anh ngồi sofa chơi game / xem TV, mặt chán; ③ có thời gian — hai người đi → rạp chiếu phim (màn hình lớn, khán giả); ④ không có ca làm thêm — hai anh đi → quán nhậu, cụng ly ở quầy, bảng "●ドリンク●".',
      [
        C('{休|やす}みの{日|ひ}、よく{何|なに}をしますか。', 'Yasumi no hi, yoku nani o shimasu ka.', 'Ngày nghỉ em hay làm gì?'),
        S('そうですねえ。{天気|てんき}がいいとき、{友達|ともだち}とサッカーをします。', 'Sou desu nee. Tenki ga ii toki, tomodachi to sakkaa o shimasu.', 'Để xem ạ. Khi trời đẹp, em đá bóng với bạn.'),
        C('{暇|ひま}なときは？', 'Hima na toki wa?', 'Còn khi rảnh?'),
        S('{暇|ひま}なとき、うちでゲームをします。', 'Hima na toki, uchi de geemu o shimasu.', 'Khi rảnh, em chơi game ở nhà.'),
      ],
      [
        'Đổi gợi ý sang dạng とき: {雨|あめ}です → {雨|あめ}**の**とき; {暇|ひま}です → {暇|ひま}**な**とき; いいです → いいとき; あります → **ある**とき; ありません → **ない**とき (ポイント 101).',
        'Cô hỏi ngắn 「{暇|ひま}なときは？」 → nhắc lại vế とき rồi trả lời đủ câu.',
        'Xem **Ngữ pháp · ポイント 101 — bảng thay thế theo 言ってみよう 4**.',
      ],
      [
        mau([
          E('{休|やす}みの{日|ひ}、よく{何|なに}をしますか。— そうですねえ。{雨|あめ}のとき、{部屋|へや}で{本|ほん}を{読|よ}みます。— へえ。', 'Yasumi no hi, yoku nani o shimasu ka. — Sou desu nee. Ame no toki, heya de hon o yomimasu. — Hee.', 'Số 4 例.'),
          E('{天気|てんき}がいいとき、サッカーをします。', 'Tenki ga ii toki, sakkaa o shimasu.', 'Số 4 ①.'),
          E('{暇|ひま}なとき、ゲームをします。', 'Hima na toki, geemu o shimasu.', 'Số 4 ②.'),
          E('{時間|じかん}があるとき、{映画|えいが}を{見|み}に{行|い}きます。', 'Jikan ga aru toki, eiga o mi ni ikimasu.', 'Số 4 ③.'),
          E('アルバイトがないとき、{友達|ともだち}と{飲|の}みに{行|い}きます。', 'Arubaito ga nai toki, tomodachi to nomi ni ikimasu.', 'Số 4 ④.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 191 · 言ってみよう số 5 · やってみよう (chủ đề 1) — ～とき、どうしますか',
      '**Số 5:** "khi …, bạn làm thế nào?" → trả lời bằng việc làm. Gợi ý + tranh: 例 đau đầu — vỉ thuốc và hộp thuốc; ① buồn ngủ — tách cà phê; ② nghỉ làm thêm — chị gọi điện, bong bóng có "店長"; ③ mệt — gói sô-cô-la; ④ bị cảm — mũi tên tới toà nhà chữ thập đỏ (bệnh viện); ⑤ không biết đường — người có dấu "?" hỏi người kia, người kia chỉ tay; ⑥ tối mãi không ngủ được — cốc bốc hơi cạnh hộp "MILK". **やってみよう** (CD C07): nghe hai cặp (Anna – Natapon, Nishikawa – Wang) nói ngày nghỉ, lúc rảnh làm gì; rồi tự hỏi bạn cùng lớp, người quen về sinh hoạt (lúc rảnh, ngày nghỉ, buổi tối…), hỏi thật nhiều.',
      [
        C('{疲|つか}れたとき、どうしますか。', 'Tsukareta toki, dou shimasu ka.', 'Khi mệt em làm thế nào?'),
        S('チョコレートを{食|た}べます。それから、{早|はや}く{寝|ね}ます。', 'Chokoreeto o tabemasu. Sorekara, hayaku nemasu.', 'Em ăn sô-cô-la. Rồi đi ngủ sớm ạ.'),
        C('{道|みち}がわからないとき、どうしますか。', 'Michi ga wakaranai toki, dou shimasu ka.', 'Khi không biết đường em làm thế nào?'),
        S('{近|ちか}くの{人|ひと}に{聞|き}きます。', 'Chikaku no hito ni kikimasu.', 'Em hỏi người ở gần ạ.'),
        C('ミンさんは{夜|よる}、{暇|ひま}なとき、{何|なに}をしていますか。', 'Min-san wa yoru, hima na toki, nani o shite imasu ka.', 'Minh, buổi tối lúc rảnh em làm gì?'),
        S('{日本語|にほんご}で{日記|にっき}を{書|か}いたり、ドラマを{見|み}たりしています。', 'Nihongo de nikki o kaitari, dorama o mitari shite imasu.', 'Em viết nhật ký bằng tiếng Nhật, xem phim truyền hình…'),
      ],
      [
        'Chọn dạng trước とき: tính từ giữ nguyên ({眠|ねむ}**い**とき, {痛|いた}**い**とき); việc đã xảy ra dùng **thể た** ({疲|つか}れ**た**とき, {風邪|かぜ}をひい**た**とき); phủ định dùng **thể ない** (わから**ない**とき); việc sắp làm dùng **thể từ điển** ({休|やす}**む**とき).',
        'やってみよう: bắt **～たり～たり** và **～とき** cho từng người; không có đáp án ở đây. Luyện: **Luyện nghe · Bài 1**.',
        'Xem **Ngữ pháp · ポイント 102 — bảng đủ 6 gợi ý**.',
      ],
      [
        mau([
          E('{頭|あたま}が{痛|いた}いとき、どうしますか。— {薬|くすり}を{飲|の}みます。', 'Atama ga itai toki, dou shimasu ka. — Kusuri o nomimasu.', 'Số 5 例.'),
          E('{眠|ねむ}いとき、どうしますか。— コーヒーを{飲|の}みます。', 'Nemui toki, dou shimasu ka. — Koohii o nomimasu.', 'Số 5 ①.'),
          E('アルバイトを{休|やす}むとき、どうしますか。— {店長|てんちょう}に{電話|でんわ}します。', 'Arubaito o yasumu toki, dou shimasu ka. — Tenchou ni denwa shimasu.', 'Số 5 ②.'),
          E('{疲|つか}れたとき、どうしますか。— チョコレートを{食|た}べます。', 'Tsukareta toki, dou shimasu ka. — Chokoreeto o tabemasu.', 'Số 5 ③.'),
          E('{風邪|かぜ}をひいたとき、どうしますか。— {病院|びょういん}へ{行|い}きます。', 'Kaze o hiita toki, dou shimasu ka. — Byouin e ikimasu.', 'Số 5 ④.'),
          E('{道|みち}がわからないとき、どうしますか。— {人|ひと}に{聞|き}きます。', 'Michi ga wakaranai toki, dou shimasu ka. — Hito ni kikimasu.', 'Số 5 ⑤.'),
          E('{夜|よる}、なかなか{寝|ね}ることができないとき、どうしますか。— {温|あたた}かい{牛乳|ぎゅうにゅう}を{飲|の}みます。', 'Yoru, nakanaka neru koto ga dekinai toki, dou shimasu ka. — Atatakai gyuunyuu o nomimasu.', 'Số 5 ⑥.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 192–193 · チャレンジ! {今|いま}の{私|わたし}・{前|まえ}の{私|わたし}',
      'Trang 192: vẫn ở quán nhậu — một anh và một chị ngồi ở quầy, anh chống tay cười, chị ăn bằng đũa. Ô (1-1): anh chỉ tay nói "いいですね"; bong bóng có áo phông, mũi tên ngược về máy bay (món đồ mang theo khi bay sang), bên dưới là hai người trao đồ cho nhau — được bạn tặng; ô bên cạnh: bong bóng của chị có "高校" với ảnh hai bạn chụp chung, và "今" với bảng clapper phim và một người đứng cạnh toà nhà "ABC FILM" — hồi cấp ba và bây giờ (làm ngành phim). Trang 193: chị (áo in trái tim) uống nước, anh cầm cốc bia; trên quầy có xiên nướng. Ô (1-2): bong bóng "趣味" + "?", hình hai cậu bé đá bóng — chị hỏi sở thích, anh nói bóng đá; ô tiếp: "いつ？" + "?", "小学生" trên hình cậu bé đọc sách, cạnh hình các cậu bé đá bóng — hỏi bắt đầu đá bóng từ khi nào. **Mục tiêu できる:** kể đơn giản về bản thân từ trước tới giờ và hỏi người khác. ☞ ポイント 101.',
      [
        C('ミンさん、そのTシャツ、いいですね。', 'Min-san, sono tii shatsu, ii desu ne.', 'Minh, cái áo phông đó đẹp nhỉ.'),
        S('ありがとうございます。{大学|だいがく}に{入学|にゅうがく}したとき、{友達|ともだち}がくれました。', 'Arigatou gozaimasu. Daigaku ni nyuugaku shita toki, tomodachi ga kuremashita.', 'Em cảm ơn ạ. Khi em vào đại học, bạn em tặng.'),
        C('ミンさんの{趣味|しゅみ}は{何|なん}ですか。', 'Min-san no shumi wa nan desu ka.', 'Sở thích của Minh là gì?'),
        S('サッカーです。', 'Sakkaa desu.', 'Bóng đá ạ.'),
        C('いつサッカーを{始|はじ}めましたか。', 'Itsu sakkaa o hajimemashita ka.', 'Em bắt đầu đá bóng khi nào?'),
        S('{小学生|しょうがくせい}のとき、{始|はじ}めました。テレビでワールドカップを{見|み}ました。{選手|せんしゅ}がかっこよかったですから、サッカーが{好|す}きになりました。', 'Shougakusei no toki, hajimemashita. Terebi de waarudo kappu o mimashita. Senshu ga kakkoyokatta desu kara, sakkaa ga suki ni narimashita.', 'Em bắt đầu hồi tiểu học. Em xem World Cup trên TV. Các cầu thủ ngầu quá nên em thích bóng đá.'),
      ],
      [
        '**ポイント 101**: món đồ có từ khi nào → **～とき、～がくれました／～にもらいました／～で{買|か}いました**; bắt đầu khi nào → **～のとき、{始|はじ}めました**.',
        'Kể lý do theo chuỗi 3 câu của sách: **（chuyện gì）ました。～かったですから、～が{好|す}きになりました。それで、{始|はじ}めました。**',
        'Xem **Hội thoại · ② 今の私・前の私**.',
      ],
    ),

    ...trang(
      'Trang 194 · 言ってみよう (chủ đề 2) — Số 1-1: món đồ có từ khi nào · Số 1-2: bắt đầu từ khi nào',
      '**Số 1-1:** "cái … đó đẹp nhỉ" → "cái này à? … khi …" → "ồ". Tranh: 例 từ điển điện tử ← máy bay + hộp quà, chữ 友達 (bạn tặng khi sang Nhật); ① túi xách ← máy bay → bản đồ nước Ý → chị ở quầy cửa hàng (mua khi đi Ý); ② áo phông "PEACE" ← người đi → đám đông ở "PEACE CONCERT" → người ở bàn đưa áo (nhận ở buổi hoà nhạc); ③ đồng hồ đeo tay, trường học chữ 入学 và ông cụ chữ 祖父 (ông tặng khi nhập học); ④ trường học chữ 卒業 và người phụ nữ chữ 母, có hình quà lấp lánh (mẹ tặng khi tốt nghiệp). **Số 1-2:** "B bắt đầu … từ khi nào?" → chuỗi 4 câu. Tranh: 例 người bơi, chữ 小学生; TV chiếu VĐV Olympic + trái tim; chữ かっこいい; ① cậu bé viết "あいうえお", chữ 高校生, cậu bé đọc sách + trái tim, chữ おもしろい; ② chị chơi guitar, chữ 15歳, cái radio phát nhạc + trái tim, chữ いい.',
      [
        C('その{時計|とけい}、いいですね。', 'Sono tokei, ii desu ne.', 'Chiếc đồng hồ đó đẹp nhỉ.'),
        S('これですか。{高校|こうこう}を{卒業|そつぎょう}したとき、{母|はは}がくれました。', 'Kore desu ka. Koukou o sotsugyou shita toki, haha ga kuremashita.', 'Cái này ạ? Khi em tốt nghiệp cấp ba, mẹ em tặng.'),
        C('ミンさん、いつ{日本語|にほんご}の{勉強|べんきょう}を{始|はじ}めましたか。', 'Min-san, itsu Nihongo no benkyou o hajimemashita ka.', 'Minh bắt đầu học tiếng Nhật khi nào?'),
        S('{高校生|こうこうせい}のとき、{始|はじ}めました。{高校生|こうこうせい}のとき、{日本|にほん}の{漫画|まんが}を{読|よ}みました。とてもおもしろかったですから、{日本語|にほんご}が{好|す}きになりました。それで、{始|はじ}めました。', 'Koukousei no toki, hajimemashita. Koukousei no toki, Nihon no manga o yomimashita. Totemo omoshirokatta desu kara, Nihongo ga suki ni narimashita. Sorede, hajimemashita.', 'Em bắt đầu hồi cấp ba. Hồi đó em đọc truyện tranh Nhật. Hay quá nên em thích tiếng Nhật. Vì thế em bắt đầu học.'),
      ],
      [
        'Số 1-1 chọn đúng dạng động từ: **{来|く}る**とき (trước khi tới Nhật — mua / nhận ở nước mình), **{行|い}った**とき (đã tới Ý mới mua), **{入学|にゅうがく}した**とき, **{卒業|そつぎょう}した**とき.',
        'Ai tặng mình: **N が くれました** (N là chủ ngữ) = **N に もらいました** (mình nhận). Đừng lẫn: ~~祖父をもらいました~~.',
        'Số 1-2: tính từ quá khứ trước から: かっこいい → **かっこよかった**ですから; いい → **よかった**ですから (ngoại lệ いい → よ).',
        'Xem **Ngữ pháp · ポイント 101 — V辞書形とき ↔ Vたとき**.',
      ],
      [
        mau([
          E('その{電子辞書|でんしじしょ}、いいですね。— これですか。{日本|にほん}へ{来|く}るとき、{友達|ともだち}がくれました。— へえ。', 'Sono denshi jisho, ii desu ne. — Kore desu ka. Nihon e kuru toki, tomodachi ga kuremashita. — Hee.', 'Số 1-1 例.'),
          E('そのかばん、いいですね。— これですか。イタリアへ{行|い}ったとき、{買|か}いました。', 'Sono kaban, ii desu ne. — Kore desu ka. Itaria e itta toki, kaimashita.', 'Số 1-1 ①.'),
          E('そのTシャツ、いいですね。— これですか。ピースコンサートへ{行|い}ったとき、もらいました。', 'Sono tii shatsu, ii desu ne. — Kore desu ka. Piisu konsaato e itta toki, moraimashita.', 'Số 1-1 ②.'),
          E('その{時計|とけい}、いいですね。— これですか。{入学|にゅうがく}したとき、{祖父|そふ}がくれました。', 'Sono tokei, ii desu ne. — Kore desu ka. Nyuugaku shita toki, sofu ga kuremashita.', 'Số 1-1 ③.'),
          E('それ、いいですね。— これですか。{卒業|そつぎょう}したとき、{母|はは}にもらいました。', 'Sore, ii desu ne. — Kore desu ka. Sotsugyou shita toki, haha ni moraimashita.', 'Số 1-1 ④ — món đồ trong tranh, gọi bằng それ／これ.'),
          E('Bさん、いつ{水泳|すいえい}を{始|はじ}めましたか。— {小学生|しょうがくせい}のとき、{始|はじ}めました。{小学生|しょうがくせい}のとき、テレビでオリンピックを{見|み}ました。{水泳|すいえい}{選手|せんしゅ}がかっこよかったですから、{水泳|すいえい}が{好|す}きになりました。それで、{水泳|すいえい}を{始|はじ}めました。— へえ。そうですか。', 'B-san, itsu suiei o hajimemashita ka. — Shougakusei no toki, hajimemashita. Shougakusei no toki, terebi de orinpikku o mimashita. Suiei senshu ga kakkoyokatta desu kara, suiei ga suki ni narimashita. Sorede, suiei o hajimemashita. — Hee. Sou desu ka.', 'Số 1-2 例.'),
          E('いつ{日本語|にほんご}の{勉強|べんきょう}を{始|はじ}めましたか。— {高校生|こうこうせい}のとき、{始|はじ}めました。{高校生|こうこうせい}のとき、{日本|にほん}の{本|ほん}を{読|よ}みました。とてもおもしろかったですから、{日本語|にほんご}が{好|す}きになりました。それで、{始|はじ}めました。', 'Itsu Nihongo no benkyou o hajimemashita ka. — Koukousei no toki, hajimemashita. Koukousei no toki, Nihon no hon o yomimashita. Totemo omoshirokatta desu kara, Nihongo ga suki ni narimashita. Sorede, hajimemashita.', 'Số 1-2 ①.'),
          E('いつギターを{始|はじ}めましたか。— {15歳|じゅうごさい}のとき、{始|はじ}めました。{15歳|じゅうごさい}のとき、ラジオでギターの{音楽|おんがく}を{聞|き}きました。とてもよかったですから、ギターが{好|す}きになりました。それで、{始|はじ}めました。', 'Itsu gitaa o hajimemashita ka. — Juugosai no toki, hajimemashita. Juugosai no toki, rajio de gitaa no ongaku o kikimashita. Totemo yokatta desu kara, gitaa ga suki ni narimashita. Sorede, hajimemashita.', 'Số 1-2 ②.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 195 · やってみよう (chủ đề 2) — Ảnh trên kệ của Mary · niên biểu "tôi đến bây giờ"',
      '**やってみよう** (CD C10): (1) trong phòng Mary, Mary và Yamaguchi nói chuyện — hai người đang nhìn **ảnh nào**? Bốn ảnh trên kệ: ⓐ người chơi đại dương cầm; ⓑ chùa có tháp năm tầng (kiểu Kyoto); ⓒ đội tennis mặc đồng phục cầm vợt; ⓓ một cặp vợ chồng lớn tuổi, bên cạnh có chuỗi vòng. Ba ô trống 1–3. (2) nghe lại rồi **điền niên biểu**: mốc **5 tuổi** (bắt đầu …; lúc đầu … nhưng dần dần …), **cấp hai** (bắt đầu tennis; xem … trên TV; vì … nên thích tennis), **đại học** (lần đầu …; cùng bạn …), **bây giờ** (đang làm việc ở Nhật, đang học tiếng Nhật). Cuối trang: **tự làm niên biểu "tôi đến bây giờ" rồi kể các kỷ niệm**.',
      [
        C('ミンさん、{年表|ねんぴょう}を{見|み}せてください。{6歳|ろくさい}のとき、{何|なに}をしましたか。', 'Min-san, nenpyou o misete kudasai. Rokusai no toki, nani o shimashita ka.', 'Minh, cho cô xem niên biểu. Năm 6 tuổi em đã làm gì?'),
        S('{小学校|しょうがっこう}に{入学|にゅうがく}しました。', 'Shougakkou ni nyuugaku shimashita.', 'Em vào tiểu học ạ.'),
        C('{中学生|ちゅうがくせい}のときは？', 'Chuugakusei no toki wa?', 'Còn hồi cấp hai?'),
        S('{中学生|ちゅうがくせい}のとき、ギターを{始|はじ}めました。{初|はじ}めは{難|むずか}しかったですが、だんだんおもしろくなりました。', 'Chuugakusei no toki, gitaa o hajimemashita. Hajime wa muzukashikatta desu ga, dandan omoshiroku narimashita.', 'Hồi cấp hai em bắt đầu chơi guitar. Lúc đầu khó nhưng dần dần thú vị hơn.'),
        C('{今|いま}は？', 'Ima wa?', 'Còn bây giờ?'),
        S('{今|いま}はFPT{大学|だいがく}で{勉強|べんきょう}しています。{毎週|まいしゅう}、{日本語|にほんご}の{授業|じゅぎょう}があります。', 'Ima wa FPT daigaku de benkyou shite imasu. Maishuu, Nihongo no jugyou ga arimasu.', 'Bây giờ em đang học ở ĐH FPT. Tuần nào cũng có giờ tiếng Nhật.'),
      ],
      [
        'Niên biểu dùng đủ các mẫu của bài: **～のとき、～ました** · **{初|はじ}めは～が、だんだん～なりました** · **～から、～が{好|す}きになりました** · **{初|はじ}めて～ました** · **{今|いま}は～ています**.',
        'Nghe CD: bắt **mốc** (5{歳|さい}, {中学生|ちゅうがくせい}, {大学生|だいがくせい}) và **từ chuyển** ({初|はじ}めは, だんだん, それで, {初|はじ}めて). Không có đáp án ở đây; luyện cùng dạng ở **Luyện nghe · Bài 2**.',
        '{小学校|しょうがっこう} (trường tiểu học) ≠ {小学生|しょうがくせい} (học sinh tiểu học) — là từ tự thêm cho bài của Minh.',
      ],
      [
        {
          t: 'table',
          caption: 'Niên biểu mẫu của ミン — tự làm bảng của bạn theo khuôn này',
          head: ['Mốc', 'Câu kể'],
          rows: [
            ['{6歳|ろくさい}', '{小学校|しょうがっこう}に{入学|にゅうがく}しました。'],
            ['{小学生|しょうがくせい}', '{小学生|しょうがくせい}のとき、テレビでワールドカップを{見|み}ました。それで、サッカーを{始|はじ}めました。'],
            ['{中学生|ちゅうがくせい}', '{中学生|ちゅうがくせい}のとき、ギターを{始|はじ}めました。{初|はじ}めは{難|むずか}しかったですが、だんだんおもしろくなりました。'],
            ['{高校生|こうこうせい}', '{高校生|こうこうせい}のとき、{日本|にほん}の{漫画|まんが}が{好|す}きになりました。'],
            ['{18歳|じゅうはっさい}', '{高校|こうこう}を{卒業|そつぎょう}して、FPT{大学|だいがく}に{入学|にゅうがく}しました。{初|はじ}めて{一人|ひとり}{暮|ぐ}らしをしました。'],
            ['{今|いま}', '{毎日|まいにち}、{日本語|にほんご}を{勉強|べんきょう}しています。'],
          ],
        },
      ],
    ),

    ...trang(
      'Trang 196–197 · チャレンジ! {友達|ともだち}と',
      'Trang 196: **nói chuyện với bạn trong lớp**. Tranh lớn: lớp học bàn ghế trống; một anh đứng giơ tay về phía cửa sổ nói chuyện, một chị đeo kính chống tay lên cằm nghe. Ô (1-1): bong bóng "よく" + "?", trong có màn hình với cặp đôi và hình hai người xem TV — hỏi "hay xem (phim truyền hình) không?", chị phản ứng ngạc nhiên. Ô (1-2): "どんな映画" + "?", hình hai người trong tư thế phim hành động + trái tim — hỏi thích phim gì. Ô (1-3): "週末" + "?", người đi → kiệu lễ hội ghi 浅草; bong bóng "どう" + "?" — cuối tuần làm gì, thế nào. Ô (1-4): anh cầm tạp chí "TOKYO", bong bóng hai người trao phong bì có tia lấp lánh — kể chuyện được tặng cuốn sách. Trang 197: đồng hồ treo tường, lịch, bảng đen có khung ngày tháng (□月□日 月曜日); một cậu ngồi đọc, một chị đứng nói chuyện, một cậu khác đặt tay lên ngực, một cô gái đứng ngạc nhiên. Ô (1-5): poster "スイーツ食べ放題" + "?", "土曜日" + "?", lịch nhỏ "SAT アルバイト / SUN" có gạch thứ Bảy, "日曜日" + "?" — rủ đi buffet đồ ngọt, thứ Bảy bận làm thêm, Chủ Nhật thì sao. Ô (1-6): hai người đi → hình ngôi nhà; một quán tên "オレンジ" + "?", nhãn giá "¥2,500", người chỉ vào miếng bánh — bàn chuyện đi quán Orange, giá. **Mục tiêu できる:** nói chuyện với bạn bằng "lời bạn bè" (友達言葉). ☞ ポイント 103.',
      [
        C('（cô đóng vai bạn）ミンさん、よくドラマ{見|み}る？', '(sensei ga tomodachi-yaku) Min-san, yoku dorama miru?', '(Cô đóng vai bạn) Minh, cậu hay xem phim truyền hình không?'),
        S('ううん、あんまり{見|み}ない。{映画|えいが}は{好|す}きだけど。', 'Uun, anmari minai. Eiga wa suki da kedo.', 'Không, mình không xem mấy. Phim điện ảnh thì thích.'),
        C('どんな{映画|えいが}が{好|す}き？', 'Donna eiga ga suki?', 'Thích phim kiểu gì?'),
        S('アクション{映画|えいが}。', 'Akushon eiga.', 'Phim hành động.'),
        C('{日曜日|にちようび}、{一緒|いっしょ}にスイーツ{食|た}べ{放題|ほうだい}{行|い}かない？', 'Nichiyoubi, issho ni suiitsu tabehoudai ikanai?', 'Chủ Nhật đi buffet đồ ngọt cùng không?'),
        S('いいね。どこ{行|い}く？', 'Ii ne. Doko iku?', 'Hay đấy. Đi đâu?'),
      ],
      [
        '**ポイント 103 友達言葉**: câu hỏi thể thường + lên giọng, không か; うん／ううん; bỏ を／へ; ～けど; ～ない？ (rủ).',
        'Chỉ nói thể thường khi **cô bảo đóng vai bạn bè**. Trả lời cô bình thường vẫn です／ます.',
        'Xem **Hội thoại · ③ 友達と** và **Ngữ pháp · bảng 丁寧形 ↔ 普通形, ポイント 103**.',
      ],
    ),

    ...trang(
      'Trang 198 · 言ってみよう (chủ đề 3) — Số 1-1: động từ · Số 1-2: tính từ, danh từ (thể thường)',
      '**Số 1-1:** A hỏi bạn thể thường → B trả lời "ừ, …" hoặc "không, … không". Gợi ý (ở dạng lịch sự, tự đổi): 例 hay xem phim truyền hình Nhật không; ① hay uống rượu không; ② hay đi karaoke không; ③ sáng nào cũng ăn cơm không; ④ ngày nào cũng xem thời sự không. **Số 1-2:** tương tự với tính từ / danh từ: 例 ngày nào cũng bận không; ① cuộc sống ở Nhật vui không; ② làm thêm vất vả không; ③ thích âm nhạc không; ④ cuối tuần rảnh không. Góc tranh: hai người nói chuyện trong bong bóng nhỏ.',
      [
        C('（vai bạn）お{酒|さけ}、よく{飲|の}む？', '(tomodachi-yaku) Osake, yoku nomu?', '(Vai bạn) Cậu hay uống rượu không?'),
        S('ううん、{飲|の}まない。', 'Uun, nomanai.', 'Không, mình không uống.'),
        C('アルバイト、{大変|たいへん}？', 'Arubaito, taihen?', 'Làm thêm vất vả không?'),
        S('うん、ちょっと{大変|たいへん}。', 'Un, chotto taihen.', 'Ừ, hơi vất vả.'),
      ],
      [
        'Đổi động từ: ～ますか → **thể từ điển？** / trả lời phủ định **thể ない**. Đổi tính từ い: bỏ ですか → **～い？** / phủ định **～くない**. Tính từ な, danh từ: bỏ ですか → **{暇|ひま}？** / phủ định **～じゃない**.',
        'Trả lời cùng một thể: うん、{見|み}る (không ~~うん、見ます~~).',
        'Xem **Ngữ pháp · ポイント 103 — bảng đổi câu lịch sự → 友達言葉** (đủ 10 gợi ý của trang này).',
      ],
      [
        mau([
          E('Bさんはよく{日本|にほん}のドラマ（を）{見|み}る？— うん、{見|み}る。／ううん、{見|み}ない。', 'B-san wa yoku Nihon no dorama (o) miru? — Un, miru. / Uun, minai.', 'Số 1-1 例.'),
          E('よくお{酒|さけ}（を）{飲|の}む？— うん、{飲|の}む。／ううん、{飲|の}まない。', 'Yoku osake (o) nomu? — Un, nomu. / Uun, nomanai.', 'Số 1-1 ①.'),
          E('よくカラオケ（に）{行|い}く？— うん、{行|い}く。／ううん、{行|い}かない。', 'Yoku karaoke (ni) iku? — Un, iku. / Uun, ikanai.', 'Số 1-1 ②.'),
          E('{毎朝|まいあさ}、ご{飯|はん}（を）{食|た}べる？— うん、{食|た}べる。／ううん、{食|た}べない。', 'Maiasa, gohan (o) taberu? — Un, taberu. / Uun, tabenai.', 'Số 1-1 ③.'),
          E('{毎日|まいにち}、ニュース（を）{見|み}る？— うん、{見|み}る。／ううん、{見|み}ない。', 'Mainichi, nyuusu (o) miru? — Un, miru. / Uun, minai.', 'Số 1-1 ④.'),
          E('{毎日|まいにち}、{忙|いそが}しい？— うん、{忙|いそが}しい。／ううん、{忙|いそが}しくない。', 'Mainichi, isogashii? — Un, isogashii. / Uun, isogashiku nai.', 'Số 1-2 例.'),
          E('{日本|にほん}の{生活|せいかつ}（は）{楽|たの}しい？— うん、{楽|たの}しい。／ううん、{楽|たの}しくない。', 'Nihon no seikatsu (wa) tanoshii? — Un, tanoshii. / Uun, tanoshiku nai.', 'Số 1-2 ①.'),
          E('アルバイト（は）{大変|たいへん}？— うん、{大変|たいへん}。／ううん、{大変|たいへん}じゃない。', 'Arubaito (wa) taihen? — Un, taihen. / Uun, taihen ja nai.', 'Số 1-2 ②.'),
          E('{音楽|おんがく}（が）{好|す}き？— うん、{好|す}き。／ううん、{好|す}きじゃない。', 'Ongaku (ga) suki? — Un, suki. / Uun, suki ja nai.', 'Số 1-2 ③.'),
          E('{週末|しゅうまつ}、{暇|ひま}？— うん、{暇|ひま}。／ううん、{暇|ひま}じゃない。', 'Shuumatsu, hima? — Un, hima. / Uun, hima ja nai.', 'Số 1-2 ④.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 199 · 言ってみよう (chủ đề 3) — Số 1-3: 何した？どうだった？ · Số 1-4: ～て／～てもいい？',
      '**Số 1-3:** "cuối tuần làm gì?" → "đi …" → "thế nào?" → "vui lắm": 例 đi Fujimaru Land; ① xem phim "Kingman"; ② đi trung tâm thương mại mới. **Số 1-4:** nhờ bạn / xin phép bạn trong lớp: 例1 "cho mượn cục tẩy" → "ừ, được"; 例2 "xem ảnh được không?" → "ừ, được". Tranh lớn: lớp học đông, hai máy điều hoà trên tường, các số ①–⑦ đánh dấu từng bạn: một chị cầm điều khiển điều hoà, bạn bên cạnh toát mồ hôi (④); chỗ cửa sổ trái, một chị đang nói, các bạn có cốc nước, một người cầm cốc với dấu "?" (①); cặp 例1 — cậu đang tẩy, cô bạn hỏi "?"; cửa sổ phải, cậu với tay lên kính (②); cặp 例2 — cô bạn muốn xem ảnh; một bạn cầm máy tính bỏ túi (③); các bạn ăn kẹo, bánh ở bàn (⑤, ⑥), một bạn đeo tai nghe có dấu "?" (⑦).',
      [
        C('（vai bạn）{週末|しゅうまつ}、{何|なに}した？', '(tomodachi-yaku) Shuumatsu, nani shita?', '(Vai bạn) Cuối tuần cậu làm gì?'),
        S('「キングマン」{見|み}た。', '"Kinguman" mita.', 'Mình xem "Kingman".'),
        C('どうだった？', 'Dou datta?', 'Thế nào?'),
        S('おもしろかった。', 'Omoshirokatta.', 'Hay lắm.'),
        C('{暑|あつ}いね。エアコン、つけてもいい？', 'Atsui ne. Eakon, tsukete mo ii?', 'Nóng nhỉ. Mình bật điều hoà được không?'),
        S('うん、いいよ。', 'Un, ii yo.', 'Ừ, được.'),
      ],
      [
        'Số 1-3: quá khứ thể thường — {行|い}きました → **{行|い}った**, {見|み}ました → **{見|み}た**; どうでしたか → **どうだった？**; {楽|たの}しかったです → **{楽|たの}しかった**.',
        'Số 1-4: **Vて。** (nhờ) và **Vてもいい？** (xin phép) → **うん、いいよ**. Các ô ①–⑦ không có chữ — câu dưới đây là gợi ý theo tranh, nghĩ thêm cách khác cũng được.',
        'Xem **Ngữ pháp · ポイント 103** (mẫu quá khứ, nhờ, xin phép).',
      ],
      [
        mau([
          E('{週末|しゅうまつ}、{何|なに}（を）した？— ふじまるランド（へ）{行|い}った。— どうだった？— {楽|たの}しかった。', 'Shuumatsu, nani (o) shita? — Fujimaru rando (e) itta. — Dou datta? — Tanoshikatta.', 'Số 1-3 例.'),
          E('{週末|しゅうまつ}、{何|なに}した？— 「キングマン」{見|み}た。— どうだった？— おもしろかった。', 'Shuumatsu, nani shita? — "Kinguman" mita. — Dou datta? — Omoshirokatta.', 'Số 1-3 ①.'),
          E('{週末|しゅうまつ}、{何|なに}した？— {新|あたら}しいデパート{行|い}った。— どうだった？— {人|ひと}が{多|おお}かった。', 'Shuumatsu, nani shita? — Atarashii depaato itta. — Dou datta? — Hito ga ookatta.', 'Số 1-3 ②.'),
          E('Bさん、{消|け}しゴム（を）{貸|か}して。— うん、いいよ。', 'B-san, keshigomu (o) kashite. — Un, ii yo.', 'Số 1-4 例1.'),
          E('Bさん、{写真|しゃしん}（を）{見|み}てもいい？— うん、いいよ。', 'B-san, shashin (o) mite mo ii? — Un, ii yo.', 'Số 1-4 例2.'),
          E('それ、{何|なに}？ちょっと{飲|の}んでもいい？— うん、いいよ。', 'Sore, nani? Chotto nonde mo ii? — Un, ii yo.', 'Số 1-4 ① — gợi ý: bạn cầm cốc nước.'),
          E('{窓|まど}（を）{開|あ}けてもいい？— うん、いいよ。', 'Mado (o) akete mo ii? — Un, ii yo.', 'Số 1-4 ② — gợi ý: cửa sổ.'),
          E('それ、ちょっと{貸|か}して。— うん、いいよ。', 'Sore, chotto kashite. — Un, ii yo.', 'Số 1-4 ③ — gợi ý: máy tính bỏ túi.'),
          E('エアコン（を）つけてもいい？— うん、いいよ。', 'Eakon (o) tsukete mo ii? — Un, ii yo.', 'Số 1-4 ④ — gợi ý: điều hoà.'),
          E('そのお{菓子|かし}、{1|ひと}つもらってもいい？— うん、いいよ。', 'Sono okashi, hitotsu moratte mo ii? — Un, ii yo.', 'Số 1-4 ⑤ — gợi ý: bánh kẹo.'),
          E('チョコレート、{食|た}べてもいい？— うん、いいよ。', 'Chokoreeto, tabete mo ii? — Un, ii yo.', 'Số 1-4 ⑥ — gợi ý: đồ ăn vặt.'),
          E('その{音楽|おんがく}、{聞|き}いてもいい？— うん、いいよ。', 'Sono ongaku, kiite mo ii? — Un, ii yo.', 'Số 1-4 ⑦ — gợi ý: bạn đeo tai nghe.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 200 · 言ってみよう (chủ đề 3) — Số 1-5: ～ない？ (rủ) · Số 1-6: どこ行く？～はどう？',
      '**Số 1-5:** "cuối tuần … cùng không?" → nhận lời "hay đấy" (○) hoặc từ chối "à, xin lỗi, vì …" → "thế à. Vậy để lần sau" (×): 例1 ăn cơm ○; 例2 ăn cơm × — làm thêm; ① trận bóng đá ○; ② mua sắm × — có việc bận; ③ đi biển × — cuối tuần chuyển nhà; ④ karaoke ○. **Số 1-6:** "đi … cùng không?" → "hay đấy. Đi đâu?" → "… thì sao? … nhưng … đấy" → "hay đấy": 例 đi ăn — quán Lala / đắt・ngon; ① đi chơi — công viên Midori / hơi xa・đẹp; ② đi biển — Enoshima / đông người・thú vị.',
      [
        C('（vai bạn）{週末|しゅうまつ}、{一緒|いっしょ}に{買|か}い{物|もの}{行|い}かない？', '(tomodachi-yaku) Shuumatsu, issho ni kaimono ikanai?', '(Vai bạn) Cuối tuần đi mua sắm cùng không?'),
        S('あ、ごめん、{用事|ようじ}があるから。', 'A, gomen, youji ga aru kara.', 'À, xin lỗi, vì mình có việc bận.'),
        C('そっか。じゃ、また{今度|こんど}。', 'Sokka. Ja, mata kondo.', 'Thế à. Vậy để lần sau.'),
        C('{一緒|いっしょ}に{遊|あそ}びに{行|い}かない？', 'Issho ni asobi ni ikanai?', 'Đi chơi cùng không?'),
        S('いいね。どこ{行|い}く？', 'Ii ne. Doko iku?', 'Hay đấy. Đi đâu?'),
        C('みどり{公園|こうえん}はどう？{少|すこ}し{遠|とお}いけど、きれいだよ。', 'Midori kouen wa dou? Sukoshi tooi kedo, kirei da yo.', 'Công viên Midori thì sao? Hơi xa nhưng đẹp lắm.'),
        S('いいね。', 'Ii ne.', 'Hay đấy.'),
      ],
      [
        'Rủ: **Vませんか → Vない？** Từ chối: **ごめん + lý do + から**. Lý do là danh từ thì thêm **だ**: アルバイト**だ**から, {引|ひ}っ{越|こ}し**だ**から; động từ giữ thể thường: {用事|ようじ}が**ある**から.',
        'Đề xuất nơi: **N はどう？** + **A けど、B よ** (tính từ な, danh từ: きれい**だ**よ).',
        'Xem **Hội thoại · ③ Rủ bạn** và **Ngữ pháp · ポイント 103 (rủ, けど／よ)**.',
      ],
      [
        mau([
          E('{週末|しゅうまつ}、{一緒|いっしょ}にご{飯|はん}（を）{食|た}べない？— いいね。', 'Shuumatsu, issho ni gohan (o) tabenai? — Ii ne.', 'Số 1-5 例1 ○.'),
          E('{週末|しゅうまつ}、{一緒|いっしょ}にご{飯|はん}{食|た}べない？— あ、ごめん、アルバイトだから。— そっか。じゃ、また{今度|こんど}。', 'Shuumatsu, issho ni gohan tabenai? — A, gomen, arubaito da kara. — Sokka. Ja, mata kondo.', 'Số 1-5 例2 ×.'),
          E('{週末|しゅうまつ}、{一緒|いっしょ}にサッカーの{試合|しあい}{見|み}ない？— いいね。', 'Shuumatsu, issho ni sakkaa no shiai minai? — Ii ne.', 'Số 1-5 ① ○.'),
          E('{週末|しゅうまつ}、{一緒|いっしょ}に{買|か}い{物|もの}{行|い}かない？— あ、ごめん、{用事|ようじ}があるから。— そっか。じゃ、また{今度|こんど}。', 'Shuumatsu, issho ni kaimono ikanai? — A, gomen, youji ga aru kara. — Sokka. Ja, mata kondo.', 'Số 1-5 ② ×.'),
          E('{週末|しゅうまつ}、{一緒|いっしょ}に{海|うみ}{行|い}かない？— あ、ごめん、{週末|しゅうまつ}は{引|ひ}っ{越|こ}しだから。— そっか。じゃ、また{今度|こんど}。', 'Shuumatsu, issho ni umi ikanai? — A, gomen, shuumatsu wa hikkoshi da kara. — Sokka. Ja, mata kondo.', 'Số 1-5 ③ ×.'),
          E('{週末|しゅうまつ}、{一緒|いっしょ}にカラオケ{行|い}かない？— いいね。', 'Shuumatsu, issho ni karaoke ikanai? — Ii ne.', 'Số 1-5 ④ ○.'),
          E('{一緒|いっしょ}にご{飯|はん}（を）{食|た}べに{行|い}かない？— いいね。どこ（へ）{行|い}く？— ララはどう？{高|たか}いけど、おいしいよ。— いいね。', 'Issho ni gohan (o) tabe ni ikanai? — Ii ne. Doko (e) iku? — Rara wa dou? Takai kedo, oishii yo. — Ii ne.', 'Số 1-6 例.'),
          E('{一緒|いっしょ}に{遊|あそ}びに{行|い}かない？— いいね。どこ{行|い}く？— みどり{公園|こうえん}はどう？{少|すこ}し{遠|とお}いけど、きれいだよ。— いいね。', 'Issho ni asobi ni ikanai? — Ii ne. Doko iku? — Midori kouen wa dou? Sukoshi tooi kedo, kirei da yo. — Ii ne.', 'Số 1-6 ①.'),
          E('{一緒|いっしょ}に{海|うみ}へ{行|い}かない？— いいね。どこ{行|い}く？— {江|え}ノ{島|しま}はどう？{人|ひと}が{多|おお}いけど、おもしろいよ。— いいね。', 'Issho ni umi e ikanai? — Ii ne. Doko iku? — Enoshima wa dou? Hito ga ooi kedo, omoshiroi yo. — Ii ne.', 'Số 1-6 ② — 江ノ島 (Enoshima): hòn đảo gần Tokyo.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 201 · やってみよう · ロールプレイ (chủ đề 3)',
      '**やってみよう** (CD C17): nghe bạn bè nói chuyện, xếp **thứ tự** 4 tranh: ⓐ tờ lịch, một ngón tay chỉ ngày 19, ngón khác chỉ gần ngày 26/27; ⓑ hai chị ngồi uống nước, một người hỏi "よく" + "?", có nốt nhạc; ⓒ hai người, một người chỉ tay hỏi "?", bong bóng người đi tới buổi "PEACE CONCERT"; ⓓ một chị bưng khay cốc mời chị kia, chị kia giơ tấm thẻ / tờ rơi "PEACE". **ロールプレイ:** [A] đến nhà bạn B chơi, nói chuyện về sở thích, ngày nghỉ, việc làm thêm, trường học…; [B] bạn A đến chơi nhà — hỏi A thật nhiều rồi **rủ** A đi đâu đó. Cả hai nói **thể thường**.',
      [
        C('（vai B）いらっしゃい。{最近|さいきん}、{忙|いそが}しい？', '(B-yaku) Irasshai. Saikin, isogashii?', '(Vai B) Vào đi. Dạo này bận không?'),
        S('うん、ちょっと。{平日|へいじつ}は{毎日|まいにち}{授業|じゅぎょう}があるから。', 'Un, chotto. Heijitsu wa mainichi jugyou ga aru kara.', 'Ừ, hơi bận. Vì ngày thường ngày nào cũng có tiết.'),
        C('{休|やす}みの{日|ひ}は{何|なに}してる？', 'Yasumi no hi wa nani shite ru?', 'Ngày nghỉ cậu làm gì?'),
        S('サッカーしたり、ゲームしたりしてる。', 'Sakkaa shitari, geemu shitari shite ru.', 'Đá bóng, chơi game này nọ.'),
        C('じゃ、{日曜日|にちようび}、{一緒|いっしょ}にサッカーの{試合|しあい}{見|み}に{行|い}かない？', 'Ja, nichiyoubi, issho ni sakkaa no shiai mi ni ikanai?', 'Vậy Chủ Nhật đi xem trận bóng cùng không?'),
        S('いいね。{行|い}く！', 'Ii ne. Iku!', 'Hay đấy. Đi!'),
      ],
      [
        'やってみよう: bắt **từ khoá theo thứ tự** (よく…？ / コンサート / チラシ・PEACE / {何日|なんにち}) — không có đáp án ở đây. Luyện cùng dạng: **Luyện nghe · Bài 3**.',
        '**～してる** = ～している (nói nhanh, bỏ い) — nghe rất nhiều trong hội thoại bạn bè.',
        'Xem **Luyện nói · Đóng vai — nói chuyện với bạn bằng thể thường**.',
      ],
    ),

    ...trang(
      'Trang 202 · できる! · 話読聞書 — {今|いま}の{生活|せいかつ}',
      '**できる!** — mời sinh viên đại học / học sinh cấp ba người Nhật đến lớp, nói chuyện về sinh hoạt hằng ngày: (1) chia nhóm, nghĩ câu hỏi muốn hỏi; (2) nói chuyện với người Nhật; (3) báo cáo trước lớp. **話読聞書** — bài đọc ngắn "今の生活": một du học sinh kể sang Nhật tháng 4, lúc đầu hơi vất vả nhưng giờ đã quen; ngày thường học ở trường; ngày nghỉ đi ăn với bạn, đi chơi những nơi nổi tiếng; một tuần làm thêm 2 lần ở nhà hàng; bận nhưng vui; từ giờ muốn làm nhiều việc hơn ở Nhật. Bên cạnh là 3 câu gợi ý: đã quen cuộc sống ở Nhật chưa / cuộc sống bây giờ có vui không / ngày nghỉ hay làm gì. Chân trang: これから.',
      [
        C('ミンさん、もう{大学|だいがく}の{生活|せいかつ}に{慣|な}れましたか。', 'Min-san, mou daigaku no seikatsu ni naremashita ka.', 'Minh, em đã quen với cuộc sống đại học chưa?'),
        S('はい、{慣|な}れました。{初|はじ}めは{少|すこ}し{大変|たいへん}でしたが、{今|いま}は{楽|たの}しいです。', 'Hai, naremashita. Hajime wa sukoshi taihen deshita ga, ima wa tanoshii desu.', 'Dạ rồi. Lúc đầu hơi vất vả nhưng giờ vui ạ.'),
        C('{今|いま}の{生活|せいかつ}は{楽|たの}しいですか。', 'Ima no seikatsu wa tanoshii desu ka.', 'Cuộc sống bây giờ có vui không?'),
        S('はい、{楽|たの}しいです。{平日|へいじつ}は{学校|がっこう}で{勉強|べんきょう}して、{1週間|いっしゅうかん}に{2回|にかい}、カフェでアルバイトをしています。', 'Hai, tanoshii desu. Heijitsu wa gakkou de benkyou shite, isshuukan ni nikai, kafe de arubaito o shite imasu.', 'Vui ạ. Ngày thường em học ở trường, một tuần 2 lần làm thêm ở quán cà phê.'),
        C('{休|やす}みの{日|ひ}に、よく{何|なに}をしますか。', 'Yasumi no hi ni, yoku nani o shimasu ka.', 'Ngày nghỉ em hay làm gì?'),
        S('{友達|ともだち}と{食事|しょくじ}をしたり、ホアンキエム{湖|こ}を{散歩|さんぽ}したりします。これから、{日本|にほん}へも{行|い}きたいです。', 'Tomodachi to shokuji o shitari, Hoankiemu-ko o sanpo shitari shimasu. Korekara, Nihon e mo ikitai desu.', 'Em đi ăn với bạn, đi dạo hồ Hoàn Kiếm… Sau này em cũng muốn đi Nhật.'),
      ],
      [
        '3 câu gợi ý = 3 mẫu: **Nに{慣|な}れました** + **{初|はじ}めは～が、{今|いま}は～** (ポイント 100) · **～ています** (ポイント 98) · **～たり～たりします** (ポイント 99).',
        'Kết bài bằng **これから、～たいです** (từ giờ trở đi, muốn …).',
        'できる!: bộ câu hỏi mẫu để hỏi người Nhật ở **Hội thoại · できる！**. Bài đọc mẫu mới + khung viết ở **Hội thoại · ④ 話読聞書**.',
        'ホアンキエム{湖|こ} (hồ Hoàn Kiếm) là ví dụ của Minh — thay bằng nơi của bạn.',
      ],
    ),

    { t: 'h', text: 'Trang 203 · ことば — Từ vựng của bài' },
    {
      t: 'p',
      text: 'Trang liệt kê 49 từ theo 3 chủ đề: (1) 今の生活 (26) — đầu, hội thoại, viết văn, bạn cùng lớp, tạp chí, chạy bộ, cuộc sống, cửa hàng trưởng, nhật ký, lúc đầu, sống một mình, hiragana, ngày thường, hằng tuần, kết thúc, đi (học) đều, bị (cảm), nghỉ (学校を休みます), quen, quên, đi dạo, buồn/cô đơn, buồn ngủ, thường thì (たいてい), mãi không (なかなか), ええ; (2) 今の私・前の私 (13) — Olympic, nước ngoài, học sinh tiểu học, học sinh cấp hai, vận động viên, ông (mình), bắt đầu, chia tay, tốt nghiệp, nhập học, dần dần, lần đầu tiên, vì thế (それで); (3) 友達と (10) — điều hoà, tin tức, tắt, bật, chuyển nhà, うん, ううん, ごめん, そっか, また. Không có tranh. Đủ nghĩa, romaji, ví dụ: xem mục **Từ vựng** của Bài 11.',
    },
    {
      t: 'note',
      title: 'Mẹo',
      items: [
        'Cô hay kiểm tra nhanh bằng cặp dễ lẫn: **初め／初めて · 始めます／始まります · つけます／消します · 慣れます／忘れます／別れます** — ôn ở **Từ vựng · Nhầm lẫn hay gặp**.',
        'Với mỗi động từ mới, thuộc luôn **thể た** (休んだ, 通った, 忘れた) — cô sẽ hỏi trong bài kiểm tra nhỏ. Bảng: **Ngữ pháp · Động từ của Bài 11 — ます → て → た → ない**.',
        'Năm từ cuối (うん, ううん, ごめん, そっか, また) chỉ dùng với bạn — bảng đối chiếu lịch sự ↔ thân mật ở **Từ vựng · nhóm H**.',
        'Xem **Từ vựng · Bài 11** và **Chữ Hán · Bài 11**.',
      ],
    },

    ...trang(
      'Trang 204 · もう{一度|いちど}{聞|き}こう — Nghe lại cả bài',
      'Nghe lại đoạn ở trang 185 (CD C01), ba cảnh ở **quán nhậu**. **Cảnh 1:** Park giới thiệu Natapon với anh Nishikawa (người mới quen — cả ba nói です／ます); Nishikawa hỏi cuộc sống ở Nhật → Natapon: **lúc đầu buồn, giờ vui**; hỏi việc học tiếng Nhật → **hơi khó nhưng thú vị**, cuối tuần học ở thư viện với bạn cùng lớp. **Cảnh 2:** Anna tới muộn: "お待たせ" — Park (bạn thân, **thể thường**): "muộn thế"; Anna: "xin lỗi, vì có ca làm thêm"; Anna đói, xin xem thực đơn, gọi hai món và bia; Park gọi nhân viên. **Cảnh 3:** cả nhóm cạn ly; Anna hỏi Nishikawa ngày nghỉ làm gì → **khi trời đẹp đi công viên đá bóng**; Natapon hỏi **bắt đầu đá bóng từ khi nào** → **hồi tiểu học**, xem **World Cup** trên TV, rất hay nên thích; Chủ Nhật tới có trận đấu → Park rủ cả nhóm đi xem. Từ ở chân trang: 乾杯, ワールドカップ, お待たせ(しました). Cô sẽ hỏi lại các chi tiết.',
      [
        C('ナタポンさんは{日本|にほん}の{生活|せいかつ}について、{何|なん}と{言|い}いましたか。', 'Natapon-san wa Nihon no seikatsu ni tsuite, nan to iimashita ka.', 'Natapon nói gì về cuộc sống ở Nhật?'),
        S('{初|はじ}めは{寂|さび}しかったですが、{今|いま}は{楽|たの}しいと{言|い}いました。', 'Hajime wa sabishikatta desu ga, ima wa tanoshii to iimashita.', 'Bạn ấy nói lúc đầu buồn, nhưng giờ vui ạ. (～と言いました — chỉ cần nói được ý)'),
        C('アンナさんはどうして{遅|おそ}かったですか。', 'Anna-san wa doushite osokatta desu ka.', 'Vì sao Anna đến muộn?'),
        S('アルバイトがありましたから。', 'Arubaito ga arimashita kara.', 'Vì có ca làm thêm ạ.'),
        C('{西川|にしかわ}さんは{休|やす}みの{日|ひ}、{何|なに}をしますか。', 'Nishikawa-san wa yasumi no hi, nani o shimasu ka.', 'Anh Nishikawa ngày nghỉ làm gì?'),
        S('{天気|てんき}がいいとき、{公園|こうえん}へサッカーをしに{行|い}きます。', 'Tenki ga ii toki, kouen e sakkaa o shi ni ikimasu.', 'Khi trời đẹp, anh ấy ra công viên đá bóng ạ.'),
        C('{西川|にしかわ}さんはいつサッカーを{始|はじ}めましたか。', 'Nishikawa-san wa itsu sakkaa o hajimemashita ka.', 'Anh Nishikawa bắt đầu đá bóng khi nào?'),
        S('{小学生|しょうがくせい}のとき、{始|はじ}めました。', 'Shougakusei no toki, hajimemashita.', 'Hồi tiểu học ạ.'),
        C('パクさんとアンナさんはどんな{言葉|ことば}で{話|はな}していましたか。', 'Paku-san to Anna-san wa donna kotoba de hanashite imashita ka.', 'Park và Anna nói chuyện với nhau bằng lối nói nào?'),
        S('{友達|ともだち}{言葉|ことば}で{話|はな}していました。', 'Tomodachi kotoba de hanashite imashita.', 'Họ nói bằng lời bạn bè (thể thường) ạ.'),
      ],
      [
        'Cùng một bàn nhậu mà **hai kiểu nói**: với người mới gặp (Nishikawa) → です／ます; giữa hai bạn thân (Park – Anna) → thể thường. Đây là điểm chính của cả bài.',
        '**お{待|ま}たせ** (bạn bè) / **お{待|ま}たせしました** (lịch sự) = xin lỗi đã để chờ. **{乾杯|かんぱい}！** = cạn ly!',
        'Câu hỏi quá khứ của cô (どうして{遅|おそ}かったですか) → trả lời **～から** ở thể lịch sự.',
        'Xem **Luyện nghe · Bài 4 — Hội thoại dài: ở quán nhậu** (kịch bản mới cùng tình huống).',
      ],
    ),

    { t: 'h', text: 'Cô hỏi — bạn trả lời: ghép nhanh câu trả lời' },
    {
      t: 'build',
      id: 'b11-sach-ghep',
      title: 'Nghe câu hỏi (tiếng Việt) → ghép câu trả lời tiếng Nhật',
      items: [
        { vi: 'Cô hỏi 一人暮らしはどうですか → "Lúc đầu hơi buồn, nhưng giờ vui rồi ạ."', chips: ['{初|はじ}めは', '{少|すこ}し{寂|さび}しかったですが、', '{今|いま}は', '{楽|たの}しくなりました。', '{初|はじ}めて', '{楽|たの}しいになりました。'], answer: ['{初|はじ}めは', '{少|すこ}し{寂|さび}しかったですが、', '{今|いま}は', '{楽|たの}しくなりました。'], ro: 'Hajime wa sukoshi sabishikatta desu ga, ima wa tanoshiku narimashita.' },
        { vi: 'Cô hỏi それから、いつも何をしていますか → "Em làm thêm ạ."', chips: ['アルバイトを', 'しています。', 'しました。', 'アルバイトが'], answer: ['アルバイトを', 'しています。'], ro: 'Arubaito o shite imasu.' },
        { vi: 'Cô hỏi 休みの日、よく何をしていますか → "Em nghe nhạc, chơi game…"', chips: ['{音楽|おんがく}を', '{聞|き}いたり', 'ゲームを', 'したり', 'しています。', '{聞|き}いて', 'します'], answer: ['{音楽|おんがく}を', '{聞|き}いたり', 'ゲームを', 'したり', 'しています。'], ro: 'Ongaku o kiitari geemu o shitari shite imasu.' },
        { vi: 'Cô hỏi 暇なとき、何をしますか → "Khi rảnh em chơi game."', chips: ['{暇|ひま}な', 'とき、', 'ゲームを', 'します。', '{暇|ひま}の', 'しています'], answer: ['{暇|ひま}な', 'とき、', 'ゲームを', 'します。'], ro: 'Hima na toki, geemu o shimasu.' },
        { vi: 'Cô hỏi 頭が痛いとき、どうしますか → "Em uống thuốc ạ."', chips: ['{薬|くすり}を', '{飲|の}みます。', '{頭|あたま}が', '{痛|いた}いです。'], answer: ['{薬|くすり}を', '{飲|の}みます。'], ro: 'Kusuri o nomimasu.' },
        { vi: 'Cô khen đồng hồ → "Khi em vào đại học, ông em tặng ạ."', chips: ['{大学|だいがく}に', '{入学|にゅうがく}した', 'とき、', '{祖父|そふ}が', 'くれました。', '{入学|にゅうがく}します', 'もらいました。'], answer: ['{大学|だいがく}に', '{入学|にゅうがく}した', 'とき、', '{祖父|そふ}が', 'くれました。'], ro: 'Daigaku ni nyuugaku shita toki, sofu ga kuremashita.' },
        { vi: 'Cô hỏi いつサッカーを始めましたか → "Em bắt đầu hồi tiểu học ạ."', chips: ['{小学生|しょうがくせい}の', 'とき、', '{始|はじ}めました。', '{小学生|しょうがくせい}な', '{始|はじ}まりました。'], answer: ['{小学生|しょうがくせい}の', 'とき、', '{始|はじ}めました。'], ro: 'Shougakusei no toki, hajimemashita.' },
        { vi: '(Vai bạn) Cô hỏi よくドラマ見る？ → "Không, mình không xem."', chips: ['ううん、', '{見|み}ない。', '{見|み}ません。', 'うん、', 'いいえ、'], answer: ['ううん、', '{見|み}ない。'], ro: 'Uun, minai.' },
        { vi: '(Vai bạn) Cô rủ 週末、海行かない？ → "À, xin lỗi, vì cuối tuần mình chuyển nhà."', chips: ['あ、ごめん、', '{週末|しゅうまつ}は', '{引|ひ}っ{越|こ}し', 'だから。', 'ですから。', 'すみません、'], answer: ['あ、ごめん、', '{週末|しゅうまつ}は', '{引|ひ}っ{越|こ}し', 'だから。'], ro: 'A, gomen, shuumatsu wa hikkoshi da kara.' },
        { vi: '(Vai bạn) Cô hỏi 写真見てもいい？ → "Ừ, được."', chips: ['うん、', 'いいよ。', 'はい、', 'どうぞ。', 'ううん、'], answer: ['うん、', 'いいよ。'], ro: 'Un, ii yo.' },
      ],
    },
  ],
};
