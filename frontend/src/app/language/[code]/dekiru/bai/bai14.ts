/**
 * Bài 14 — 国の習慣 (Phong tục của đất nước) · できる日本語 初級 第14課, p.237–252 · JPD113/JPD123.
 *
 * Ngữ pháp: ポイント 113–118 (p.280): V辞書形と、___ · Vテ形はいけません ·
 * Vナイ形‑ないければなりません · Vナイ形‑ないくてもいいです · 普通形と思います ·
 * 「___」と言います + ôn bảng 丁寧形／普通形 (表 p.284).
 * Từ vựng: đủ 65 mục của trang ことば p.251 (26 + 16 + 23) — từ Bài 8 trở đi cô không
 * phát danh sách riêng nên trang ことば của sách là chuẩn — cộng 9 từ gạch chân của bài
 * đọc 話読聞書 p.250 (習慣, バスタブ, 話, ホストファミリー, みんな, なくなります, 笑います,
 * 同じ, びっくり). Từ ở chân bài nghe (駐輪場) và từ trong tranh nằm ở mục "Từ thêm".
 * Hội thoại, câu ví dụ, bài đọc, kịch bản nghe: VIẾT MỚI theo đúng tình huống của sách
 * (xem ../SOAN-BAI.md). Chỉ dùng lại tên nhân vật; tên cửa hàng, quán là tự đặt.
 *
 * Nhân vật (giới tính quyết định giọng đọc, theo bai1.ts): nữ = パク, アンナ, メアリー, 木村,
 * マリヤム · nam = ナタポン, マルコ, カルロス, ダニエル. Hội thoại: role 'a'/'c' = giọng nữ,
 * 'b'/'examiner' = giọng nam. Nghe: voice 'ja-nu' = nữ, 'ja-nam' = nam.
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
  id: 'b14-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — 国の習慣 Đồ lạ, luật lệ, ý kiến của tôi',
  goal: 'Giải thích ngắn cách dùng một cái máy / đồ vật lạ, hỏi "cái này tiếng … nói thế nào", nhắc bạn luật lệ – phép lịch sự (không được / phải / không cần), và nói ý kiến của mình về chuyện quanh mình rồi hỏi ý kiến người khác.',
  minutes: 40,
  blocks: [
    {
      t: 'note',
      title: 'Học xong bài 14 bạn làm được (できる)',
      items: [
        '**① {初|はじ}めて{見|み}た！{初|はじ}めて{聞|き}いた！** — người chưa biết dùng một cái máy / đồ vật thì **giải thích ngắn cách dùng** ("bấm nút này thì tiền thừa ra"), giới thiệu đồ vật lạ ("こたつ là đồ dùng mùa đông; cho chân vào thì ấm"), và **hỏi / trả lời "cái này tiếng … nói thế nào"**.',
        '**② ルール・マナー** — để **tránh rắc rối trước**, nói cho bạn biết luật lệ, phép lịch sự: ở đây **không được** … (～てはいけません), **phải** … (～なければなりません), **không cần** … (～なくてもいいです).',
        '**③ {私|わたし}の{意見|いけん}** — nói **ý kiến của mình** về chuyện quen thuộc (～と{思|おも}います), **hỏi ý kiến** người khác (～についてどう{思|おも}いますか), so sánh hai thứ và nói cái nào hơn kèm lý do.',
        '**できる！** — chọn một đề tài (nội quy trường, phép ăn uống, điện thoại…), làm poster giới thiệu phong tục – luật lệ của nước mình, trình bày trước lớp rồi hỏi về Nhật Bản.',
      ],
    },
    {
      t: 'table',
      caption: 'Bức tranh chung của bài — một người nước ngoài mới sống ở Nhật',
      head: ['Lúc', 'Câu then chốt', 'Romaji', 'ポイント'],
      rows: [
        ['Trước máy bán phiếu ăn', 'このボタンを{押|お}すと、お{釣|つ}りが{出|で}ますよ。', 'Kono botan o osu to, otsuri ga demasu yo.', '113'],
        ['Thấy đồ vật lạ', 'こたつは{冬|ふゆ}、{使|つか}うものです。{足|あし}を{入|い}れると、{暖|あたた}かくなります。', 'Kotatsu wa fuyu, tsukau mono desu. Ashi o ireru to, atatakaku narimasu.', '113'],
        ['Hỏi cách nói', '「おいしい」はベトナム{語|ご}で{何|なん}と{言|い}いますか。——「ngon」と{言|い}います。', '"Oishii" wa Betonamugo de nan to iimasu ka. — "Ngon" to iimasu.', '118'],
        ['Trên tàu điện', 'ここで{携帯電話|けいたいでんわ}を{使|つか}ってはいけませんよ。', 'Koko de keitai denwa o tsukatte wa ikemasen yo.', '114'],
        ['Trong ô tô', 'シートベルトをしなければなりませんよ。', 'Shiito beruto o shinakereba narimasen yo.', '115'],
        ['Ở cửa nhà', 'ここで{靴|くつ}を{脱|ぬ}がなくてもいいですよ。', 'Koko de kutsu o nuganakute mo ii desu yo.', '116'],
        ['Nói ý kiến', '{東京|とうきょう}の{地下鉄|ちかてつ}は{便利|べんり}ですが、{少|すこ}し{複雑|ふくざつ}だと{思|おも}います。', 'Toukyou no chikatetsu wa benri desu ga, sukoshi fukuzatsu da to omoimasu.', '117'],
        ['Hỏi ý kiến', '{日本|にほん}のテレビ{番組|ばんぐみ}についてどう{思|おも}いますか。', 'Nihon no terebi bangumi ni tsuite dou omoimasu ka.', '117'],
      ],
    },

    /* ── ① 初めて見た！初めて聞いた！ ── */
    { t: 'h', text: '① {初|はじ}めて{見|み}た！{初|はじ}めて{聞|き}いた！ — Lần đầu thấy, lần đầu nghe' },
    {
      t: 'p',
      text: 'Tình huống: đi với bạn ở một **toà nhà mua sắm**. Quán mì có **máy bán phiếu ăn** ({食券|しょっけん}) — bạn chưa biết dùng. Quầy hàng bày **カイロ** (túi sưởi) — bạn chưa thấy bao giờ. Ăn bánh ở quán cà phê, hai người hỏi nhau "ngon" nói bằng tiếng nước mình thế nào. Mẫu chính: **V{辞書形|じしょけい}と、～** (làm V thì tự nhiên có kết quả) và **「～」と{言|い}います**.',
    },
    {
      t: 'dialogue',
      title: 'Trước máy bán phiếu ăn ở quán mì',
      lines: [
        { who: 'パク', role: 'a', text: 'ナタポンさん、ここはうどんとそばの{店|みせ}ですよ。{入|はい}りませんか。', ro: 'Natapon-san, koko wa udon to soba no mise desu yo. Hairimasen ka.', vi: 'Natapon, đây là quán udon và soba đấy. Vào không?' },
        { who: 'ナタポン', role: 'b', text: 'いいですね。……あれ？これは{何|なん}ですか。', ro: 'Ii desu ne. …… Are? Kore wa nan desu ka.', vi: 'Hay đấy. …… Ơ? Cái này là gì vậy?' },
        { who: 'パク', role: 'a', text: '{食券|しょっけん}の{機械|きかい}です。ここにお{金|かね}を{入|い}れて、{食|た}べたいもののボタンを{押|お}してください。', ro: 'Shokken no kikai desu. Koko ni okane o irete, tabetai mono no botan o oshite kudasai.', vi: 'Máy bán phiếu ăn đấy. Cho tiền vào đây rồi bấm nút món bạn muốn ăn.' },
        { who: 'ナタポン', role: 'b', text: 'はい。……{1,000円|せんえん}{入|い}れました。{天|てん}ぷらうどんのボタンを{押|お}しました。', ro: 'Hai. …… Sen en iremashita. Tenpura udon no botan o oshimashita.', vi: 'Ừ. …… Mình cho 1.000 yên rồi. Bấm nút udon tempura rồi.' },
        { who: 'パク', role: 'a', text: 'ほら、{食券|しょっけん}が{出|で}ましたよ。', ro: 'Hora, shokken ga demashita yo.', vi: 'Kìa, phiếu ăn ra rồi đấy.' },
        { who: 'ナタポン', role: 'b', text: 'あれ？お{釣|つ}りが{出|で}ません。', ro: 'Are? Otsuri ga demasen.', vi: 'Ơ? Tiền thừa không ra.' },
        { who: 'パク', role: 'a', text: 'あっ、そのレバーを{回|まわ}すと、お{釣|つ}りが{出|で}ますよ。', ro: 'A, sono rebaa o mawasu to, otsuri ga demasu yo.', vi: 'À, xoay cái cần gạt đó thì tiền thừa ra đấy.' },
        { who: 'ナタポン', role: 'b', text: 'あ、{出|で}ました。どうもありがとうございます。', ro: 'A, demashita. Doumo arigatou gozaimasu.', vi: 'A, ra rồi. Cảm ơn cậu nhiều.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Cái này là gì? — カイロ và こたつ',
      lines: [
        { who: 'ナタポン', role: 'b', text: 'パクさん、あれは{何|なん}ですか。{小|ちい}さい{袋|ふくろ}がたくさんありますね。', ro: 'Paku-san, are wa nan desu ka. Chiisai fukuro ga takusan arimasu ne.', vi: 'Park, kia là cái gì vậy? Nhiều túi nhỏ ghê.' },
        { who: 'パク', role: 'a', text: 'カイロです。', ro: 'Kairo desu.', vi: 'Là カイロ (túi sưởi) đấy.' },
        { who: 'ナタポン', role: 'b', text: 'カイロ？', ro: 'Kairo?', vi: 'カイロ?' },
        { who: 'パク', role: 'a', text: 'はい。カイロは{冬|ふゆ}、{使|つか}うものです。ポケットにカイロを{入|い}れると、{手|て}が{暖|あたた}かくなります。', ro: 'Hai. Kairo wa fuyu, tsukau mono desu. Poketto ni kairo o ireru to, te ga atatakaku narimasu.', vi: 'Ừ. カイロ là đồ dùng vào mùa đông. Bỏ カイロ vào túi áo thì tay ấm lên.' },
        { who: 'ナタポン', role: 'b', text: 'へえ、{便利|べんり}ですね。{私|わたし}の{国|くに}は{暑|あつ}いですから、ありません。', ro: 'Hee, benri desu ne. Watashi no kuni wa atsui desu kara, arimasen.', vi: 'Ồ, tiện nhỉ. Nước mình nóng nên không có.' },
        { who: 'パク', role: 'a', text: '{日本|にほん}の{家|いえ}にはこたつもありますよ。こたつに{足|あし}を{入|い}れると、{体|からだ}が{暖|あたた}かくなります。', ro: 'Nihon no ie ni wa kotatsu mo arimasu yo. Kotatsu ni ashi o ireru to, karada ga atatakaku narimasu.', vi: 'Nhà ở Nhật còn có こたつ nữa. Cho chân vào こたつ thì người ấm lên.' },
        { who: 'ナタポン', role: 'b', text: 'へえ。{一度|いちど}、{入|はい}りたいです。', ro: 'Hee. Ichido, hairitai desu.', vi: 'Ồ. Mình muốn chui vào thử một lần.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Ở quán cà phê — "ngon" nói thế nào?',
      lines: [
        { who: 'パク', role: 'a', text: 'このケーキ、おいしいですね。', ro: 'Kono keeki, oishii desu ne.', vi: 'Bánh này ngon nhỉ.' },
        { who: 'ナタポン', role: 'b', text: 'ええ。パクさん、「おいしい」は{韓国語|かんこくご}で{何|なん}と{言|い}いますか。', ro: 'Ee. Paku-san, "oishii" wa Kankokugo de nan to iimasu ka.', vi: 'Ừ. Park ơi, "oishii" tiếng Hàn nói thế nào?' },
        { who: 'パク', role: 'a', text: '「マシッソヨ」と{言|い}います。タイ{語|ご}では？', ro: '"Mashissoyo" to iimasu. Taigo de wa?', vi: 'Nói là "mashissoyo". Còn tiếng Thái?' },
        { who: 'ナタポン', role: 'b', text: '「アロイ」と{言|い}います。', ro: '"Aroi" to iimasu.', vi: 'Nói là "aroi".' },
        { who: 'パク', role: 'a', text: 'アロイ。おもしろいですね。……ああ、おなかがいっぱいです。', ro: 'Aroi. Omoshiroi desu ne. …… Aa, onaka ga ippai desu.', vi: 'Aroi. Thú vị nhỉ. …… Ôi, no bụng quá.' },
        { who: 'ナタポン', role: 'b', text: '{私|わたし}もです。ごちそうさまでした。', ro: 'Watashi mo desu. Gochisousama deshita.', vi: 'Mình cũng vậy. Cảm ơn vì bữa ăn.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'このボタンを{押|お}すと、{水|みず}が{出|で}ます。', ro: 'Kono botan o osu to, mizu ga demasu.', vi: 'Bấm nút này thì nước chảy ra. — ポイント 113' },
        { en: 'あれ？ドアが{開|あ}きません。——そのボタンを{押|お}すと、{開|あ}きますよ。', ro: 'Are? Doa ga akimasen. — Sono botan o osu to, akimasu yo.', vi: 'Ơ? Cửa không mở. — Bấm cái nút đó thì mở đấy. — ポイント 113' },
        { en: 'こたつは{冬|ふゆ}、{使|つか}うものです。', ro: 'Kotatsu wa fuyu, tsukau mono desu.', vi: 'こたつ là đồ dùng vào mùa đông. — V{辞書形|じしょけい} + もの (B13, 普通形+N)' },
        { en: '「おいしい」は{英語|えいご}で{何|なん}と{言|い}いますか。——「delicious」と{言|い}います。', ro: '"Oishii" wa eigo de nan to iimasu ka. — "Delicious" to iimasu.', vi: '"Oishii" tiếng Anh nói thế nào? — Nói là "delicious". — ポイント 118' },
        { en: 'いただきます。／ごちそうさまでした。', ro: 'Itadakimasu. / Gochisousama deshita.', vi: 'Mời cả nhà / xin phép ăn (trước bữa). / Cảm ơn vì bữa ăn (sau bữa).' },
        { en: 'おなかがいっぱいです。', ro: 'Onaka ga ippai desu.', vi: 'No bụng rồi. (≠ おなかがすきました = đói rồi, Bài 10)' },
        { en: 'あれ？', ro: 'Are?', vi: 'Ơ? / Hả? — thấy điều lạ, không như mình nghĩ.' },
      ],
    },

    /* ── ② ルール・マナー ── */
    { t: 'h', text: '② ルール・マナー — Luật lệ và phép lịch sự' },
    {
      t: 'p',
      text: 'Tình huống: đi chơi với bạn. Bạn nhắc trước để **tránh rắc rối**: trên tàu **không được** nói điện thoại, ở ghế sau ô tô **phải** thắt dây an toàn, ở chỗ này **không cần** cởi giày. Người được nhắc đáp **あっ、そうなんですか** (ồ, vậy à) và **{知|し}りませんでした** (tôi không biết). Người nhắc chỉ vào biển: **ほら、あれ** (kìa, cái kia) → **あっ、{本当|ほんとう}だ** (a, thật).',
    },
    {
      t: 'dialogue',
      title: 'Trên tàu điện — điện thoại',
      lines: [
        { who: 'アンナ', role: 'c', text: '（{電話|でんわ}が{鳴|な}ります）あ、{母|はは}からです。もしもし……。', ro: '(Denwa ga narimasu) A, haha kara desu. Moshi moshi…….', vi: '(Điện thoại reo) A, mẹ mình gọi. Alô…' },
        { who: 'マルコ', role: 'b', text: 'あ、アンナさん、{電車|でんしゃ}の{中|なか}で{電話|でんわ}で{話|はな}してはいけませんよ。', ro: 'A, Anna-san, densha no naka de denwa de hanashite wa ikemasen yo.', vi: 'Ấy, Anna, trên tàu không được nói chuyện điện thoại đâu.' },
        { who: 'アンナ', role: 'c', text: 'あっ、そうなんですか。', ro: 'A, sou nan desu ka.', vi: 'Ồ, vậy à?' },
        { who: 'マルコ', role: 'b', text: 'ほら、あれ。', ro: 'Hora, are.', vi: 'Kìa, cái kia.' },
        { who: 'アンナ', role: 'c', text: 'あっ、{本当|ほんとう}だ。じゃ、{次|つぎ}の{駅|えき}で{降|お}りて、{電話|でんわ}をかけます。', ro: 'A, hontou da. Ja, tsugi no eki de orite, denwa o kakemasu.', vi: 'A, thật. Vậy xuống ga sau mình gọi lại.' },
        { who: 'マルコ', role: 'b', text: 'メールはしてもいいですよ。でも、{大|おお}きい{声|こえ}で{話|はな}してはいけません。', ro: 'Meeru wa shite mo ii desu yo. Demo, ookii koe de hanashite wa ikemasen.', vi: 'Nhắn tin thì được. Nhưng không được nói to.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Trong ô tô — dây an toàn',
      lines: [
        { who: 'マルコ', role: 'b', text: 'じゃ、{出|で}かけましょう。あ、アンナさん、シートベルトをしなければなりませんよ。', ro: 'Ja, dekakemashou. A, Anna-san, shiito beruto o shinakereba narimasen yo.', vi: 'Nào, đi thôi. À, Anna, phải thắt dây an toàn đấy.' },
        { who: 'アンナ', role: 'c', text: 'えっ、{後|うし}ろの{席|せき}もですか。', ro: 'E, ushiro no seki mo desu ka.', vi: 'Hả, ghế sau cũng phải à?' },
        { who: 'マルコ', role: 'b', text: 'はい。{日本|にほん}では{後|うし}ろの{席|せき}の{人|ひと}もしなければなりません。', ro: 'Hai. Nihon de wa ushiro no seki no hito mo shinakereba narimasen.', vi: 'Ừ. Ở Nhật người ngồi ghế sau cũng phải thắt.' },
        { who: 'アンナ', role: 'c', text: 'そうなんですか。{知|し}りませんでした。……はい、しました。', ro: 'Sou nan desu ka. Shirimasen deshita. …… Hai, shimashita.', vi: 'Vậy à. Mình không biết. …… Rồi, thắt rồi.' },
        { who: 'マルコ', role: 'b', text: 'それから、バイクに{乗|の}るときは、ヘルメットをかぶらなければなりません。', ro: 'Sorekara, baiku ni noru toki wa, herumetto o kaburanakereba narimasen.', vi: 'Còn nữa, khi đi xe máy thì phải đội mũ bảo hiểm.' },
        { who: 'アンナ', role: 'c', text: 'それは{私|わたし}の{国|くに}も{同|おな}じです。', ro: 'Sore wa watashi no kuni mo onaji desu.', vi: 'Cái đó thì nước mình cũng giống vậy.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Ở bảo tàng — không cần cởi giày, không cần trả tiền',
      lines: [
        { who: 'アンナ', role: 'c', text: 'あ、{玄関|げんかん}ですね。ここで{靴|くつ}を{脱|ぬ}ぎますか。', ro: 'A, genkan desu ne. Koko de kutsu o nugimasu ka.', vi: 'A, có lối vào (genkan) nhỉ. Ở đây cởi giày à?' },
        { who: 'マルコ', role: 'b', text: 'いいえ、ここは{美術館|びじゅつかん}ですから、{靴|くつ}を{脱|ぬ}がなくてもいいですよ。', ro: 'Iie, koko wa bijutsukan desu kara, kutsu o nuganakute mo ii desu yo.', vi: 'Không, đây là bảo tàng nên không cần cởi giày đâu.' },
        { who: 'アンナ', role: 'c', text: 'へえ、そうなんですか。{入場料|にゅうじょうりょう}はいくらですか。', ro: 'Hee, sou nan desu ka. Nyuujouryou wa ikura desu ka.', vi: 'Ồ, vậy à. Vé vào cửa bao nhiêu?' },
        { who: 'マルコ', role: 'b', text: '{大人|おとな}は{800円|はっぴゃくえん}です。でも、{学生|がくせい}は{料金|りょうきん}を{払|はら}わなくてもいいです。', ro: 'Otona wa happyaku en desu. Demo, gakusei wa ryoukin o harawanakute mo ii desu.', vi: 'Người lớn 800 yên. Nhưng sinh viên thì không cần trả tiền.' },
        { who: 'アンナ', role: 'c', text: 'よかった。{学生証|がくせいしょう}を{見|み}せなければなりませんか。', ro: 'Yokatta. Gakuseishou o misenakereba narimasen ka.', vi: 'May quá. Có phải xuất trình thẻ sinh viên không?' },
        { who: 'マルコ', role: 'b', text: 'はい。{身分証|みぶんしょう}を{見|み}せなければなりません。パスポートでもいいですよ。', ro: 'Hai. Mibunshou o misenakereba narimasen. Pasupooto demo ii desu yo.', vi: 'Có. Phải xuất trình giấy tờ tuỳ thân. Hộ chiếu cũng được.' },
        { who: 'アンナ', role: 'c', text: 'あ、それから、ここで{写真|しゃしん}を{撮|と}ってもいいですか。', ro: 'A, sorekara, koko de shashin o totte mo ii desu ka.', vi: 'À, còn nữa, ở đây chụp ảnh được không?' },
        { who: 'マルコ', role: 'b', text: 'いいえ、{中|なか}で{写真|しゃしん}を{撮|と}ってはいけません。{作品|さくひん}に{触|さわ}ってもいけませんよ。', ro: 'Iie, naka de shashin o totte wa ikemasen. Sakuhin ni sawatte mo ikemasen yo.', vi: 'Không, bên trong không được chụp ảnh. Cũng không được sờ vào tác phẩm đâu.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Trước bảo tàng — thùng rác và xe đạp',
      lines: [
        { who: 'アンナ', role: 'c', text: 'このペットボトル、どこに{捨|す}てますか。', ro: 'Kono petto botoru, doko ni sutemasu ka.', vi: 'Chai nhựa này vứt ở đâu nhỉ?' },
        { who: 'マルコ', role: 'b', text: 'あそこです。{日本|にほん}ではごみを{分|わ}けなければなりません。「もえるごみ」と「もえないごみ」ですよ。', ro: 'Asoko desu. Nihon de wa gomi o wakenakereba narimasen. "Moeru gomi" to "moenai gomi" desu yo.', vi: 'Đằng kia. Ở Nhật phải phân loại rác. "Rác cháy được" và "rác không cháy được" đấy.' },
        { who: 'アンナ', role: 'c', text: '{大変|たいへん}ですね。でも、きちんと{分|わ}けます。', ro: 'Taihen desu ne. Demo, kichinto wakemasu.', vi: 'Vất vả nhỉ. Nhưng mình sẽ phân loại cẩn thận.' },
        { who: 'マルコ', role: 'b', text: 'それから、ここに{自転車|じてんしゃ}を{止|と}めてはいけません。{自転車|じてんしゃ}は{駐輪場|ちゅうりんじょう}に{止|と}めてください。', ro: 'Sorekara, koko ni jitensha o tomete wa ikemasen. Jitensha wa chuurinjou ni tomete kudasai.', vi: 'Còn nữa, không được để xe đạp ở đây. Xe đạp thì để ở bãi xe đạp.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'ここで{携帯電話|けいたいでんわ}を{使|つか}ってはいけませんよ。——あっ、そうなんですか。', ro: 'Koko de keitai denwa o tsukatte wa ikemasen yo. — A, sou nan desu ka.', vi: 'Ở đây không được dùng điện thoại đâu. — Ồ, vậy à? — ポイント 114' },
        { en: 'ほら、あれ。——あっ、{本当|ほんとう}だ。', ro: 'Hora, are. — A, hontou da.', vi: 'Kìa, cái kia. — A, thật. (chỉ biển báo)' },
        { en: 'シートベルトをしなければなりませんよ。——そうなんですか。{知|し}りませんでした。', ro: 'Shiito beruto o shinakereba narimasen yo. — Sou nan desu ka. Shirimasen deshita.', vi: 'Phải thắt dây an toàn đấy. — Vậy à. Tôi không biết. — ポイント 115' },
        { en: 'ここで{靴|くつ}を{脱|ぬ}がなくてもいいですよ。——へえ、そうなんですか。', ro: 'Koko de kutsu o nuganakute mo ii desu yo. — Hee, sou nan desu ka.', vi: 'Ở đây không cần cởi giày đâu. — Ồ, vậy à. — ポイント 116' },
        { en: '{学生|がくせい}は{料金|りょうきん}を{払|はら}わなくてもいいです。', ro: 'Gakusei wa ryoukin o harawanakute mo ii desu.', vi: 'Sinh viên không cần trả tiền. — ポイント 116 (câu mẫu của sách)' },
        { en: 'ごみはきちんと{分|わ}けなければなりません。', ro: 'Gomi wa kichinto wakenakereba narimasen.', vi: 'Rác thì phải phân loại cẩn thận.' },
      ],
    },

    /* ── ③ 私の意見 ── */
    { t: 'h', text: '③ {私|わたし}の{意見|いけん} — Ý kiến của tôi' },
    {
      t: 'p',
      text: 'Tình huống: đi dạo phố với bạn. Thấy **tờ tuyển nhân viên làm thêm** (lương giờ 1.000 yên), thấy **máy bán hàng tự động** ở khắp nơi, thấy **văn phòng cho thuê nhà** — ai cũng có ý kiến. Mẫu chính: **{普通形|ふつうけい} + と{思|おも}います** (tôi nghĩ là …), **～についてどう{思|おも}いますか** (bạn nghĩ sao về …), **{私|わたし}もそう{思|おも}います** (tôi cũng nghĩ vậy).',
    },
    {
      t: 'dialogue',
      title: 'Trước tờ tuyển làm thêm',
      lines: [
        { who: 'カルロス', role: 'b', text: 'メアリーさん、{見|み}てください。アルバイト{募集|ぼしゅう}。{時給|じきゅう}{1,000円|せんえん}ですよ。', ro: 'Mearii-san, mite kudasai. Arubaito boshuu. Jikyuu sen en desu yo.', vi: 'Mary, nhìn này. Tuyển làm thêm. Lương giờ 1.000 yên đấy.' },
        { who: 'メアリー', role: 'a', text: '{高|たか}いですね。{高校生|こうこうせい}もできますか。', ro: 'Takai desu ne. Koukousei mo dekimasu ka.', vi: 'Cao nhỉ. Học sinh cấp 3 cũng làm được à?' },
        { who: 'カルロス', role: 'b', text: 'はい。{日本|にほん}ではアルバイトをしている{高校生|こうこうせい}が{多|おお}いですよ。', ro: 'Hai. Nihon de wa arubaito o shite iru koukousei ga ooi desu yo.', vi: 'Ừ. Ở Nhật nhiều học sinh cấp 3 đi làm thêm lắm.' },
        { who: 'メアリー', role: 'a', text: 'そうですか。でも、{高校生|こうこうせい}は{勉強|べんきょう}が{大切|たいせつ}ですから、アルバイトをしないほうがいいと{思|おも}います。', ro: 'Sou desu ka. Demo, koukousei wa benkyou ga taisetsu desu kara, arubaito o shinai hou ga ii to omoimasu.', vi: 'Vậy à. Nhưng học sinh cấp 3 thì việc học quan trọng, nên mình nghĩ không đi làm thêm thì hơn.' },
        { who: 'カルロス', role: 'b', text: 'うーん。でも、いい{経験|けいけん}になると{思|おも}いますよ。', ro: 'Uun. Demo, ii keiken ni naru to omoimasu yo.', vi: 'Ừm. Nhưng mình nghĩ đó sẽ là trải nghiệm tốt đấy.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Máy bán hàng tự động — tiện hay không?',
      lines: [
        { who: 'メアリー', role: 'a', text: '{日本|にほん}は{自動販売機|じどうはんばいき}が{多|おお}いですね。{便利|べんり}だと{思|おも}います。', ro: 'Nihon wa jidou hanbaiki ga ooi desu ne. Benri da to omoimasu.', vi: 'Ở Nhật nhiều máy bán hàng tự động nhỉ. Mình nghĩ là tiện.' },
        { who: 'カルロス', role: 'b', text: '{私|わたし}もそう{思|おも}います。いつでも{飲|の}み{物|もの}を{買|か}うことができますから。', ro: 'Watashi mo sou omoimasu. Itsudemo nomimono o kau koto ga dekimasu kara.', vi: 'Mình cũng nghĩ vậy. Vì lúc nào cũng mua được đồ uống.' },
        { who: 'メアリー', role: 'a', text: 'カルロスさんはコンビニとスーパーとどちらがいいと{思|おも}いますか。', ro: 'Karurosu-san wa konbini to suupaa to dochira ga ii to omoimasu ka.', vi: 'Carlos thấy cửa hàng tiện lợi với siêu thị, cái nào tốt hơn?' },
        { who: 'カルロス', role: 'b', text: '{夜|よる}、{遅|おそ}くまで{開|あ}いていますから、コンビニのほうがいいと{思|おも}います。', ro: 'Yoru, osoku made aite imasu kara, konbini no hou ga ii to omoimasu.', vi: 'Vì mở cửa đến khuya, mình nghĩ cửa hàng tiện lợi tốt hơn.' },
        { who: 'メアリー', role: 'a', text: 'そうですか。{私|わたし}は{夜|よる}、お{弁当|べんとう}が{安|やす}くなりますから、スーパーのほうがいいと{思|おも}います。', ro: 'Sou desu ka. Watashi wa yoru, obentou ga yasuku narimasu kara, suupaa no hou ga ii to omoimasu.', vi: 'Vậy à. Mình thì nghĩ siêu thị tốt hơn, vì buổi tối cơm hộp rẻ đi.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Nông thôn hay thành phố?',
      lines: [
        { who: '{木村|きむら}', role: 'c', text: 'カルロスさん、{日本|にほん}の{交通|こうつう}についてどう{思|おも}いますか。', ro: 'Karurosu-san, Nihon no koutsuu ni tsuite dou omoimasu ka.', vi: 'Carlos, anh nghĩ sao về giao thông ở Nhật?' },
        { who: 'カルロス', role: 'b', text: '{電車|でんしゃ}が{多|おお}いですから、{便利|べんり}だと{思|おも}います。でも、{駅|えき}が{大|おお}きくて、{少|すこ}し{複雑|ふくざつ}だと{思|おも}います。', ro: 'Densha ga ooi desu kara, benri da to omoimasu. Demo, eki ga ookikute, sukoshi fukuzatsu da to omoimasu.', vi: 'Nhiều tàu nên tôi nghĩ là tiện. Nhưng ga to, tôi thấy hơi phức tạp.' },
        { who: '{木村|きむら}', role: 'c', text: '{田舎|いなか}の{生活|せいかつ}と{都会|とかい}の{生活|せいかつ}とどちらがいいと{思|おも}いますか。', ro: 'Inaka no seikatsu to tokai no seikatsu to dochira ga ii to omoimasu ka.', vi: 'Anh thấy sống ở nông thôn với sống ở thành phố, bên nào tốt hơn?' },
        { who: 'カルロス', role: 'b', text: '{空気|くうき}がきれいで、{静|しず}かですから、{田舎|いなか}のほうがいいと{思|おも}います。', ro: 'Kuuki ga kirei de, shizuka desu kara, inaka no hou ga ii to omoimasu.', vi: 'Không khí trong lành, yên tĩnh nên tôi nghĩ nông thôn tốt hơn.' },
        { who: '{木村|きむら}', role: 'c', text: 'そうですか。{私|わたし}は{都会|とかい}のほうがいいと{思|おも}います。{田舎|いなか}は{交通|こうつう}が{不便|ふべん}ですから。', ro: 'Sou desu ka. Watashi wa tokai no hou ga ii to omoimasu. Inaka wa koutsuu ga fuben desu kara.', vi: 'Vậy à. Tôi thì nghĩ thành phố tốt hơn. Vì nông thôn đi lại bất tiện.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{東京|とうきょう}の{地下鉄|ちかてつ}は{便利|べんり}ですね。——そうですね。でも、{少|すこ}し{複雑|ふくざつ}だと{思|おも}います。', ro: 'Toukyou no chikatetsu wa benri desu ne. — Sou desu ne. Demo, sukoshi fukuzatsu da to omoimasu.', vi: 'Tàu điện ngầm Tokyo tiện nhỉ. — Ừ nhỉ. Nhưng tôi nghĩ hơi phức tạp. — ポイント 117 (ナA + だ)' },
        { en: '{日本|にほん}のテレビ{番組|ばんぐみ}についてどう{思|おも}いますか。——おもしろいと{思|おも}います。', ro: 'Nihon no terebi bangumi ni tsuite dou omoimasu ka. — Omoshiroi to omoimasu.', vi: 'Bạn nghĩ sao về chương trình TV Nhật? — Tôi nghĩ là thú vị. — ポイント 117' },
        { en: '{私|わたし}もそう{思|おも}います。', ro: 'Watashi mo sou omoimasu.', vi: 'Tôi cũng nghĩ vậy.' },
        { en: '{空気|くうき}がきれいですから、{田舎|いなか}のほうがいいと{思|おも}います。', ro: 'Kuuki ga kirei desu kara, inaka no hou ga ii to omoimasu.', vi: 'Vì không khí trong lành, tôi nghĩ nông thôn tốt hơn.' },
        { en: 'うーん。{便利|べんり}ですが、{高|たか}いと{思|おも}います。', ro: 'Uun. Benri desu ga, takai to omoimasu.', vi: 'Ừm. Tiện nhưng tôi nghĩ là đắt. (うーん = đang cân nhắc)' },
      ],
    },

    /* ── 話読聞書 ── */
    { t: 'h', text: '④ Nói–Đọc–Nghe–Viết (話読聞書) — {日本|にほん}でびっくりしたこと (Điều làm tôi ngạc nhiên ở Nhật)' },
    {
      t: 'p',
      text: 'Bài đọc mẫu (viết mới, cùng kiểu với sách): một du học sinh kể **phong tục** ({習慣|しゅうかん}) ở Nhật khác nước mình — phải làm gì, không được làm gì, không cần làm gì — chuyện buồn cười đã xảy ra, và ý kiến của mình (～と{思|おも}います). Đọc to, rồi viết đoạn của bạn theo khung bên dưới.',
    },
    {
      t: 'passage',
      title: '{日本|にほん}でびっくりしたこと',
      paras: [
        { text: '{私|わたし}は{去年|きょねん}の{夏|なつ}、{大阪|おおさか}でホームステイをしました。そのとき、{日本|にほん}のごみの{習慣|しゅうかん}にびっくりしました。{私|わたし}の{国|くに}では、ごみを{分|わ}けなくてもいいです。{全部|ぜんぶ}{同|おな}じ{袋|ふくろ}に{入|い}れます。でも、{日本|にほん}ではごみをきちんと{分|わ}けなければなりません。' },
        { text: '{最初|さいしょ}の{週|しゅう}、{私|わたし}はペットボトルと{紙|かみ}を{同|おな}じ{袋|ふくろ}に{入|い}れて、{捨|す}てました。{次|つぎ}の{日|ひ}、ほかの{袋|ふくろ}はなくなりましたが、{私|わたし}の{袋|ふくろ}はなくなりませんでした。ホストファミリーのお{父|とう}さんは「あれ？」と{言|い}って、{袋|ふくろ}を{見|み}ました。{私|わたし}の{話|はなし}を{聞|き}いて、お{父|とう}さんもお{母|かあ}さんもみんな{笑|わら}いました。' },
        { text: 'それから、お{風呂|ふろ}にもびっくりしました。{家族|かぞく}みんなが{同|おな}じバスタブのお{湯|ゆ}を{使|つか}います。ですから、お{湯|ゆ}に{入|はい}る{前|まえ}に、{体|からだ}を{洗|あら}わなければなりません。{日本|にほん}の{習慣|しゅうかん}は{少|すこ}し{大変|たいへん}ですが、おもしろいと{思|おも}います。' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'そのとき、{日本|にほん}のごみの{習慣|しゅうかん}にびっくりしました。', ro: 'Sono toki, Nihon no gomi no shuukan ni bikkuri shimashita.', vi: 'Lúc đó tôi ngạc nhiên vì phong tục đổ rác của Nhật. — Nにびっくりします' },
        { en: '{私|わたし}の{国|くに}では、ごみを{分|わ}けなくてもいいです。', ro: 'Watashi no kuni de wa, gomi o wakenakute mo ii desu.', vi: 'Ở nước tôi không cần phân loại rác. — ポイント 116' },
        { en: '{日本|にほん}ではごみをきちんと{分|わ}けなければなりません。', ro: 'Nihon de wa gomi o kichinto wakenakereba narimasen.', vi: 'Ở Nhật phải phân loại rác cẩn thận. — ポイント 115' },
        { en: '{次|つぎ}の{日|ひ}、ほかの{袋|ふくろ}はなくなりましたが、{私|わたし}の{袋|ふくろ}はなくなりませんでした。', ro: 'Tsugi no hi, hoka no fukuro wa nakunarimashita ga, watashi no fukuro wa nakunarimasen deshita.', vi: 'Hôm sau, các túi khác đã được dọn đi (biến mất), nhưng túi của tôi thì không. — なくなります = mất đi, hết, không còn' },
        { en: '{私|わたし}の{話|はなし}を{聞|き}いて、みんな{笑|わら}いました。', ro: 'Watashi no hanashi o kiite, minna waraimashita.', vi: 'Nghe chuyện của tôi, mọi người đều cười.' },
        { en: '{家族|かぞく}みんなが{同|おな}じバスタブのお{湯|ゆ}を{使|つか}います。', ro: 'Kazoku minna ga onaji basutabu no oyu o tsukaimasu.', vi: 'Cả nhà dùng chung nước nóng của cùng một bồn tắm.' },
        { en: '{日本|にほん}の{習慣|しゅうかん}は{少|すこ}し{大変|たいへん}ですが、おもしろいと{思|おも}います。', ro: 'Nihon no shuukan wa sukoshi taihen desu ga, omoshiroi to omoimasu.', vi: 'Phong tục Nhật hơi vất vả nhưng tôi nghĩ là thú vị. — ポイント 117' },
      ],
    },
    {
      t: 'note',
      title: 'Viết đoạn "Điều làm tôi ngạc nhiên" theo khung (trả lời 2 câu gợi ý của sách)',
      items: [
        '**{日本|にほん}へ{来|き}て／{外国|がいこく}でびっくりしたことがありますか。それは{何|なん}ですか** → {私|わたし}は ___ でびっくりしました。／___ の{習慣|しゅうかん}にびっくりしました。',
        '**So sánh với nước mình** → {私|わたし}の{国|くに}では、___ なくてもいいです／___ てはいけません。でも、{日本|にほん}では ___ なければなりません。',
        '**Chuyện đã xảy ra** (quá khứ, ～て、～) → {最初|さいしょ}、{私|わたし}は ___ ました。___ は「あれ？」と{言|い}いました。みんな{笑|わら}いました。',
        '**どう{思|おも}いますか** → ___ は{少|すこ}し{大変|たいへん}ですが、___ と{思|おも}います。',
        'Chưa đi Nhật? Viết về một điều bạn thấy lạ khi xem phim / gặp người Nhật, hoặc về một phong tục Việt Nam làm bạn nước ngoài ngạc nhiên (cởi giày khi vào nhà, mời trà…).',
      ],
    },

    /* ── できる！ ── */
    { t: 'h', text: 'できる！— Giới thiệu phong tục, luật lệ của nước mình (poster)' },
    {
      t: 'p',
      text: 'Nhiệm vụ 4 bước như sách: ① chọn đề tài ({校則|こうそく} = nội quy trường, phép ăn uống, điện thoại…) → ② làm **poster** → ③ trình bày cho bạn cùng lớp hoặc người Nhật xung quanh → ④ nghe xong, nói **ý kiến – cảm nghĩ** cho nhau. Dưới đây là một bài trình bày mẫu dùng đủ 6 ポイント của bài.',
    },
    {
      t: 'table',
      caption: 'Poster mẫu — "Nội quy trường cấp 3 ở Việt Nam" (tự đặt)',
      head: ['Phần', 'Nói gì', 'Câu then chốt'],
      rows: [
        ['1. Mở đầu', 'Đề tài', '{今日|きょう}はベトナムの{高校|こうこう}の{校則|こうそく}について{話|はな}します。'],
        ['2. Phải', 'Mặc đồng phục, đội mũ bảo hiểm', '{毎週|まいしゅう}{月曜日|げつようび}は{制服|せいふく}を{着|き}なければなりません。バイクに{乗|の}るとき、ヘルメットをかぶらなければなりません。'],
        ['3. Không được', 'Dùng điện thoại, trang điểm trong giờ học', '{授業中|じゅぎょうちゅう}、{携帯電話|けいたいでんわ}を{使|つか}ってはいけません。{化粧|けしょう}をしてはいけません。'],
        ['4. Không cần', 'Thứ Bảy không cần mặc đồng phục', '{土曜日|どようび}は{制服|せいふく}を{着|き}なくてもいいです。'],
        ['5. Máy móc', 'Cổng điểm danh', 'このカードをタッチすると、{名前|なまえ}が{出|で}ます。'],
        ['6. Ý kiến', 'Mình nghĩ gì', '{校則|こうそく}は{少|すこ}し{厳|きび}しいですが、{大切|たいせつ}だと{思|おも}います。'],
        ['7. Hỏi lại', 'Hỏi về Nhật', '{日本|にほん}の{高校|こうこう}はどうですか。「{校則|こうそく}」は{英語|えいご}で{何|なん}と{言|い}いますか。'],
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */
/* Đủ 65 mục của trang ことば p.251: chủ đề 1 (26) = A 10 + B 12 + C 4 · chủ đề 2 (16) =
 * D 10 + E 6 · chủ đề 3 (23) = F 11 + G 8 + H 4. Thêm I = 9 từ gạch chân của bài đọc p.250. */

const TU_VUNG: Lesson = {
  id: 'b14-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 65 từ của trang ことば Bài 14 (+ 9 từ bài đọc)',
  goal: 'Thuộc đủ 65 từ của Bài 14 (đồ vật Nhật, máy móc, luật lệ, ý kiến) cùng 9 từ của bài đọc, và dùng được mỗi từ trong một câu giải thích cách dùng, nhắc luật lệ hoặc nói ý kiến.',
  minutes: 45,
  blocks: [
    {
      t: 'p',
      text: 'Đủ **65 từ** trên trang ことば (p.251), giữ đúng 3 chủ đề của sách: **{初|はじ}めて{見|み}た！{初|はじ}めて{聞|き}いた！** (26 từ — nhóm A, B, C), **ルール・マナー** (16 từ — nhóm D, E), **{私|わたし}の{意見|いけん}** (23 từ — nhóm F, G, H). Nhóm **I** là 9 từ gạch chân của bài đọc 話読聞書 (p.250). Từ Bài 8 cô không phát danh sách riêng nên đây là chuẩn. Số **1 / 2 / 3** sau động từ = nhóm động từ. Câu ví dụ chỉ dùng từ Bài 1–14. Cách học: bấm 🔊 → đọc to 3 lần → che nghĩa, tự nói.',
    },
    {
      t: 'note',
      title: 'Cách đọc romaji trong khoá',
      items: [
        'Trường âm viết theo đúng chữ kana: {交通|こうつう} → **koutsuu**, {空気|くうき} → kuuki, {料金|りょうきん} → ryoukin, {入場料|にゅうじょうりょう} → **nyuujouryou**, {風鈴|ふうりん} → fuurin, レバー → **rebaa**, パスポート → pasupooto, フリープラン → furii puran.',
        'Âm ngắt っ viết đôi phụ âm: {食券|しょっけん} → **shokken**, ポケット → poketto, ヘルメット → herumetto, びっくり → bikkuri, ファッション → **fasshon**.',
        'Thể mới của bài: {使|つか}って**は**いけません → tsukatte **wa** ikemasen (は đọc wa); し**なければ**なりません → shinakereba narimasen; {脱|ぬ}が**なくても**いいです → nuganakute mo ii desu.',
      ],
    },

    { t: 'h', text: 'A. Đồ vật & món ăn Nhật Bản (10 từ — chủ đề 1)' },
    {
      t: 'vocab',
      items: [
        { w: 'うどん', pos: 'danh từ', ipa: 'udon', vi: 'mì udon (sợi to, trắng, làm từ bột mì)', ex: 'この{店|みせ}のうどんはおいしいと{思|おも}います。', exRo: 'Kono mise no udon wa oishii to omoimasu.', exVi: 'Tôi nghĩ udon quán này ngon.' },
        { w: 'そば', pos: 'danh từ', ipa: 'soba', vi: 'mì soba (sợi nhỏ, màu nâu, làm từ kiều mạch)', ex: 'そばを{食|た}べるとき、{唐辛子|とうがらし}を{入|い}れると、おいしくなります。', exRo: 'Soba o taberu toki, tougarashi o ireru to, oishiku narimasu.', exVi: 'Khi ăn soba, cho ớt vào thì ngon hơn.' },
        { w: 'カイロ', pos: 'danh từ', ipa: 'kairo', vi: 'túi sưởi (gói nhỏ tự nóng lên, bỏ túi áo mùa đông)', ex: 'ポケットにカイロを{入|い}れると、{暖|あたた}かくなります。', exRo: 'Poketto ni kairo o ireru to, atatakaku narimasu.', exVi: 'Bỏ túi sưởi vào túi áo thì ấm lên.' },
        { w: 'こたつ', pos: 'danh từ', ipa: 'kotatsu', vi: 'bàn sưởi kotatsu (bàn thấp có lò sưởi bên dưới, phủ chăn)', ex: 'こたつは{冬|ふゆ}、{使|つか}うものです。', exRo: 'Kotatsu wa fuyu, tsukau mono desu.', exVi: 'Kotatsu là đồ dùng vào mùa đông.' },
        { w: '{風鈴|ふうりん}', pos: 'danh từ', ipa: 'fuurin', vi: 'chuông gió (treo mùa hè, nghe tiếng thấy mát)', ex: '{風鈴|ふうりん}の{音|おと}を{聞|き}くと、{涼|すず}しくなります。', exRo: 'Fuurin no oto o kiku to, suzushiku narimasu.', exVi: 'Nghe tiếng chuông gió thì thấy mát.' },
        { w: '{布団|ふとん}', pos: 'danh từ', ipa: 'futon', vi: 'chăn đệm kiểu Nhật (trải xuống sàn để ngủ)', ex: '{日本|にほん}の{家|いえ}では、{布団|ふとん}で{寝|ね}ます。', exRo: 'Nihon no ie de wa, futon de nemasu.', exVi: 'Ở nhà kiểu Nhật người ta ngủ trên futon.' },
        { w: '{湯|ゆ}たんぽ', pos: 'danh từ', ipa: 'yutanpo', vi: 'túi / bình chườm nước nóng (để trong chăn cho ấm)', ex: '{湯|ゆ}たんぽを{布団|ふとん}の{中|なか}に{入|い}れると、{暖|あたた}かいです。', exRo: 'Yutanpo o futon no naka ni ireru to, atatakai desu.', exVi: 'Để bình nước nóng trong chăn thì ấm.' },
        { w: '（お）{湯|ゆ}', pos: 'danh từ', ipa: '(o)yu', vi: 'nước nóng (≠ {水|みず} nước lạnh / nước thường)', ex: 'この{蛇口|じゃぐち}をこちらに{回|まわ}すと、お{湯|ゆ}が{出|で}ます。', exRo: 'Kono jaguchi o kochira ni mawasu to, oyu ga demasu.', exVi: 'Xoay vòi này sang bên này thì nước nóng chảy ra.' },
        { w: '{唐辛子|とうがらし}', pos: 'danh từ', ipa: 'tougarashi', vi: 'ớt (七味唐辛子 = bột ớt bảy vị rắc lên mì)', ex: '{唐辛子|とうがらし}を{入|い}れると、{辛|から}くなります。', exRo: 'Tougarashi o ireru to, karaku narimasu.', exVi: 'Cho ớt vào thì cay lên.' },
        { w: '{食券|しょっけん}', pos: 'danh từ', ipa: 'shokken', vi: 'phiếu ăn (mua ở máy trước khi gọi món)', ex: 'この{店|みせ}では{先|さき}に{食券|しょっけん}を{買|か}わなければなりません。', exRo: 'Kono mise de wa saki ni shokken o kawanakereba narimasen.', exVi: 'Quán này phải mua phiếu ăn trước.' },
      ],
    },

    { t: 'h', text: 'B. Máy móc & thao tác (12 từ — chủ đề 1)' },
    {
      t: 'vocab',
      items: [
        { w: '{字|じ}', pos: 'danh từ', ipa: 'ji', vi: 'chữ (chữ viết; 字が大きい = chữ to)', ex: 'このボタンを{押|お}すと、{字|じ}が{大|おお}きくなります。', exRo: 'Kono botan o osu to, ji ga ookiku narimasu.', exVi: 'Bấm nút này thì chữ to lên.' },
        { w: '（お）{釣|つ}り', pos: 'danh từ', ipa: '(o)tsuri', vi: 'tiền thừa, tiền trả lại', ex: 'レバーを{回|まわ}すと、お{釣|つ}りが{出|で}ます。', exRo: 'Rebaa o mawasu to, otsuri ga demasu.', exVi: 'Xoay cần gạt thì tiền thừa ra.' },
        { w: '{電気|でんき}', pos: 'danh từ', ipa: 'denki', vi: 'đèn điện; điện (電気がつきます = đèn bật sáng)', ex: 'ドアを{開|あ}けると、{電気|でんき}がつきます。', exRo: 'Doa o akeru to, denki ga tsukimasu.', exVi: 'Mở cửa thì đèn sáng.' },
        { w: 'ドア', pos: 'danh từ', ipa: 'doa', vi: 'cửa (cửa ra vào, cửa tàu, cửa xe)', ex: 'あれ？ドアが{開|あ}きません。', exRo: 'Are? Doa ga akimasen.', exVi: 'Ơ? Cửa không mở.' },
        { w: 'ポケット', pos: 'danh từ', ipa: 'poketto', vi: 'túi (quần, áo)', ex: 'ポケットに{携帯電話|けいたいでんわ}があります。', exRo: 'Poketto ni keitai denwa ga arimasu.', exVi: 'Điện thoại ở trong túi.' },
        { w: 'ボタン', pos: 'danh từ', ipa: 'botan', vi: 'nút bấm; cúc áo', ex: 'この{赤|あか}いボタンを{押|お}すと、コーヒーが{出|で}ます。', exRo: 'Kono akai botan o osu to, koohii ga demasu.', exVi: 'Bấm nút đỏ này thì cà phê ra.' },
        { w: 'レバー', pos: 'danh từ', ipa: 'rebaa', vi: 'cần gạt, tay gạt (lever)', ex: 'このレバーを{回|まわ}すと、{水|みず}が{出|で}ます。', exRo: 'Kono rebaa o mawasu to, mizu ga demasu.', exVi: 'Xoay cần gạt này thì nước chảy ra.' },
        { w: '{開|あ}きます［{開|あ}く］1', pos: 'động từ nhóm 1', ipa: 'akimasu [aku]', vi: '(cửa) mở ra — tự động từ: Nが開きます (≠ 開けます: tôi mở N, Bài 7). Sách (ことば p.251) in đúng **あきます**. Chữ 開 còn cách đọc ひらく (mở ra — hoa nở, mở sách), sẽ gặp sau.', ex: 'このボタンを{押|お}すと、ドアが{開|あ}きます。', exRo: 'Kono botan o osu to, doa ga akimasu.', exVi: 'Bấm nút này thì cửa mở.' },
        { w: '{触|さわ}ります［{触|さわ}る］1', pos: 'động từ nhóm 1', ipa: 'sawarimasu [sawaru]', vi: 'sờ, chạm vào (vật + に)', ex: '{美術館|びじゅつかん}の{作品|さくひん}に{触|さわ}ってはいけません。', exRo: 'Bijutsukan no sakuhin ni sawatte wa ikemasen.', exVi: 'Không được sờ vào tác phẩm ở bảo tàng.' },
        { w: 'つきます［つく］1', pos: 'động từ nhóm 1', ipa: 'tsukimasu [tsuku]', vi: '(đèn, điện) bật sáng, bật lên — Nがつきます', ex: 'ここに{触|さわ}ると、{電気|でんき}がつきます。', exRo: 'Koko ni sawaru to, denki ga tsukimasu.', exVi: 'Chạm vào chỗ này thì đèn sáng.' },
        { w: '{回|まわ}します［{回|まわ}す］1', pos: 'động từ nhóm 1', ipa: 'mawashimasu [mawasu]', vi: 'xoay, vặn (Nを回します)', ex: 'レバーを{右|みぎ}に{回|まわ}してください。', exRo: 'Rebaa o migi ni mawashite kudasai.', exVi: 'Hãy xoay cần gạt sang phải.' },
        { w: '{出|で}ます［{出|で}る］2', pos: 'động từ nhóm 2', ipa: 'demasu [deru]', vi: '(tiền, nước, vé…) ra, chảy ra — お釣りが出ます (Bài 14); Bài 5: ra khỏi (家を出ます)', ex: 'お{金|かね}を{入|い}れると、{切符|きっぷ}が{出|で}ます。', exRo: 'Okane o ireru to, kippu ga demasu.', exVi: 'Cho tiền vào thì vé ra. (câu mẫu của sách: お釣りが出ます)' },
      ],
    },

    { t: 'h', text: 'C. Câu nói quanh bữa ăn & khi thấy lạ (4 từ — chủ đề 1)' },
    {
      t: 'vocab',
      items: [
        { w: 'あれ？', pos: 'thán từ', ipa: 'are?', vi: 'ơ?, hả? (thấy điều lạ, khác mình nghĩ) — khác あれ "cái kia"', ex: 'あれ？お{釣|つ}りが{出|で}ません。', exRo: 'Are? Otsuri ga demasen.', exVi: 'Ơ? Tiền thừa không ra.' },
        { w: 'いただきます', pos: 'câu nói', ipa: 'itadakimasu', vi: 'xin phép ăn / mời mọi người (nói trước khi ăn)', ex: 'わあ、おいしいですね。いただきます。', exRo: 'Waa, oishii desu ne. Itadakimasu.', exVi: 'Oa, ngon nhỉ. Xin phép ăn ạ.' },
        { w: 'おなかがいっぱいです', pos: 'câu nói', ipa: 'onaka ga ippai desu', vi: 'no bụng rồi (↔ おなかがすきました, Bài 10)', ex: 'たくさん{食|た}べました。おなかがいっぱいです。', exRo: 'Takusan tabemashita. Onaka ga ippai desu.', exVi: 'Ăn nhiều rồi. No bụng quá.' },
        { w: 'ごちそうさまでした', pos: 'câu nói', ipa: 'gochisousama deshita', vi: 'cảm ơn vì bữa ăn (nói sau khi ăn xong)', ex: 'おいしかったです。ごちそうさまでした。', exRo: 'Oishikatta desu. Gochisousama deshita.', exVi: 'Ngon lắm ạ. Cảm ơn vì bữa ăn.' },
      ],
    },

    { t: 'h', text: 'D. Luật lệ — danh từ (10 từ — chủ đề 2)' },
    {
      t: 'vocab',
      items: [
        { w: '{以下|いか}', pos: 'danh từ', ipa: 'ika', vi: 'trở xuống, dưới (tính cả mốc đó: 6歳以下 = từ 6 tuổi trở xuống)', ex: '{小学生|しょうがくせい}{以下|いか}は{入場料|にゅうじょうりょう}を{払|はら}わなくてもいいです。', exRo: 'Shougakusei ika wa nyuujouryou o harawanakute mo ii desu.', exVi: 'Từ học sinh tiểu học trở xuống không cần trả vé vào cửa.' },
        { w: '{玄関|げんかん}', pos: 'danh từ', ipa: 'genkan', vi: 'lối vào nhà, sảnh cửa (chỗ cởi giày ở nhà Nhật)', ex: '{玄関|げんかん}で{靴|くつ}を{脱|ぬ}がなければなりません。', exRo: 'Genkan de kutsu o nuganakereba narimasen.', exVi: 'Phải cởi giày ở lối vào.' },
        { w: 'シートベルト', pos: 'danh từ', ipa: 'shiito beruto', vi: 'dây an toàn (シートベルトをします = thắt dây an toàn)', ex: '{車|くるま}に{乗|の}るとき、シートベルトをしなければなりません。', exRo: 'Kuruma ni noru toki, shiito beruto o shinakereba narimasen.', exVi: 'Khi đi ô tô phải thắt dây an toàn.' },
        { w: '{制服|せいふく}', pos: 'danh từ', ipa: 'seifuku', vi: 'đồng phục (制服を着ます = mặc đồng phục)', ex: '{高校生|こうこうせい}のとき、{制服|せいふく}を{着|き}なければなりませんでした。', exRo: 'Koukousei no toki, seifuku o kinakereba narimasen deshita.', exVi: 'Hồi cấp 3 tôi phải mặc đồng phục.' },
        { w: 'バイク', pos: 'danh từ', ipa: 'baiku', vi: 'xe máy (≠ {自転車|じてんしゃ} xe đạp)', ex: 'ベトナムではバイクに{乗|の}る{人|ひと}が{多|おお}いです。', exRo: 'Betonamu de wa baiku ni noru hito ga ooi desu.', exVi: 'Ở Việt Nam nhiều người đi xe máy.' },
        { w: 'ヘルメット', pos: 'danh từ', ipa: 'herumetto', vi: 'mũ bảo hiểm (ヘルメットをかぶります = đội mũ)', ex: 'バイクに{乗|の}るとき、ヘルメットをかぶらなければなりません。', exRo: 'Baiku ni noru toki, herumetto o kaburanakereba narimasen.', exVi: 'Khi đi xe máy phải đội mũ bảo hiểm.' },
        { w: 'パスポート', pos: 'danh từ', ipa: 'pasupooto', vi: 'hộ chiếu', ex: 'ホテルでパスポートを{見|み}せなければなりません。', exRo: 'Hoteru de pasupooto o misenakereba narimasen.', exVi: 'Ở khách sạn phải xuất trình hộ chiếu.' },
        { w: '{身分証|みぶんしょう}', pos: 'danh từ', ipa: 'mibunshou', vi: 'giấy tờ tuỳ thân (thẻ căn cước, thẻ sinh viên…)', ex: '{試験|しけん}の{日|ひ}は{身分証|みぶんしょう}を{持|も}ってこなければなりません。', exRo: 'Shiken no hi wa mibunshou o motte konakereba narimasen.', exVi: 'Ngày thi phải mang giấy tờ tuỳ thân đến.' },
        { w: '{料金|りょうきん}', pos: 'danh từ', ipa: 'ryoukin', vi: 'phí, tiền (trả cho dịch vụ: điện, xe, vào cửa…)', ex: '{学生|がくせい}は{料金|りょうきん}を{払|はら}わなくてもいいです。', exRo: 'Gakusei wa ryoukin o harawanakute mo ii desu.', exVi: 'Sinh viên không cần trả phí. (câu mẫu của sách, ポイント 116)' },
        { w: '{入場料|にゅうじょうりょう}', pos: 'danh từ', ipa: 'nyuujouryou', vi: 'phí vào cửa, vé vào cổng', ex: 'この{公園|こうえん}は{入場料|にゅうじょうりょう}がいりません。', exRo: 'Kono kouen wa nyuujouryou ga irimasen.', exVi: 'Công viên này không mất phí vào cửa.' },
      ],
    },

    { t: 'h', text: 'E. Luật lệ — động từ & câu nói (6 từ — chủ đề 2)' },
    {
      t: 'vocab',
      items: [
        { w: '{並|なら}びます［{並|なら}ぶ］1', pos: 'động từ nhóm 1', ipa: 'narabimasu [narabu]', vi: 'xếp hàng (nơi + に並びます)', ex: '{電車|でんしゃ}に{乗|の}るとき、{並|なら}ばなければなりません。', exRo: 'Densha ni noru toki, narabanakereba narimasen.', exVi: 'Khi lên tàu phải xếp hàng.' },
        { w: '{止|と}めます［{止|と}める］2', pos: 'động từ nhóm 2', ipa: 'tomemasu [tomeru]', vi: 'đỗ (xe), dừng (cái gì đó lại) — 自転車を止めます', ex: 'ここに{自転車|じてんしゃ}を{止|と}めてはいけません。', exRo: 'Koko ni jitensha o tomete wa ikemasen.', exVi: 'Không được đỗ xe đạp ở đây. (câu mẫu của sách, ポイント 114)' },
        { w: '{分|わ}けます［{分|わ}ける］2', pos: 'động từ nhóm 2', ipa: 'wakemasu [wakeru]', vi: 'chia, phân loại (ごみを分けます = phân loại rác)', ex: 'ごみを{分|わ}けなければなりません。', exRo: 'Gomi o wakenakereba narimasen.', exVi: 'Phải phân loại rác.' },
        { w: 'きちんと', pos: 'phó từ', ipa: 'kichinto', vi: 'đàng hoàng, cẩn thận, ngay ngắn (làm đúng quy định)', ex: 'ごみはきちんと{分|わ}けてください。', exRo: 'Gomi wa kichinto wakete kudasai.', exVi: 'Rác thì hãy phân loại cẩn thận.' },
        { w: 'そうなんですか', pos: 'câu nói', ipa: 'sou nan desu ka', vi: 'vậy à?, thế à? (nghe điều mình chưa biết — ngạc nhiên hơn そうですか)', ex: 'ここで{靴|くつ}を{脱|ぬ}がなくてもいいですよ。——へえ、そうなんですか。', exRo: 'Koko de kutsu o nuganakute mo ii desu yo. — Hee, sou nan desu ka.', exVi: 'Ở đây không cần cởi giày đâu. — Ồ, vậy à?' },
        { w: 'ほら', pos: 'thán từ', ipa: 'hora', vi: 'kìa, nhìn này (chỉ cho người khác thấy)', ex: 'ほら、あれ。「{禁煙|きんえん}」ですよ。', exRo: 'Hora, are. "Kin\'en" desu yo.', exVi: 'Kìa, cái kia. "Cấm hút thuốc" đấy.' },
      ],
    },

    { t: 'h', text: 'F. Ý kiến — danh từ (11 từ — chủ đề 3)' },
    {
      t: 'vocab',
      items: [
        { w: '{田舎|いなか}', pos: 'danh từ', ipa: 'inaka', vi: 'nông thôn, quê', ex: '{田舎|いなか}は{空気|くうき}がきれいです。', exRo: 'Inaka wa kuuki ga kirei desu.', exVi: 'Nông thôn không khí trong lành.' },
        { w: '{都会|とかい}', pos: 'danh từ', ipa: 'tokai', vi: 'thành phố lớn, đô thị', ex: '{都会|とかい}の{生活|せいかつ}は{便利|べんり}ですが、{忙|いそが}しいです。', exRo: 'Tokai no seikatsu wa benri desu ga, isogashii desu.', exVi: 'Cuộc sống đô thị tiện nhưng bận rộn.' },
        { w: '{空気|くうき}', pos: 'danh từ', ipa: 'kuuki', vi: 'không khí', ex: '{空気|くうき}がきれいですから、{田舎|いなか}のほうがいいと{思|おも}います。', exRo: 'Kuuki ga kirei desu kara, inaka no hou ga ii to omoimasu.', exVi: 'Vì không khí trong lành, tôi nghĩ nông thôn tốt hơn.' },
        { w: '{交通|こうつう}', pos: 'danh từ', ipa: 'koutsuu', vi: 'giao thông, việc đi lại', ex: '{田舎|いなか}は{交通|こうつう}が{不便|ふべん}です。', exRo: 'Inaka wa koutsuu ga fuben desu.', exVi: 'Nông thôn đi lại bất tiện.' },
        { w: '{時給|じきゅう}', pos: 'danh từ', ipa: 'jikyuu', vi: 'lương theo giờ', ex: 'このアルバイトは{時給|じきゅう}{1,000円|せんえん}です。', exRo: 'Kono arubaito wa jikyuu sen en desu.', exVi: 'Việc làm thêm này lương giờ 1.000 yên.' },
        { w: '{自由|じゆう}', pos: 'danh từ / tính từ な', ipa: 'jiyuu', vi: 'sự tự do; tự do (自由があります = có tự do)', ex: '{一人|ひとり}{暮|ぐ}らしは{自由|じゆう}がありますから、いいです。', exRo: 'Hitorigurashi wa jiyuu ga arimasu kara, ii desu.', exVi: 'Sống một mình có tự do nên tốt.' },
        { w: 'デザイン', pos: 'danh từ', ipa: 'dezain', vi: 'thiết kế, kiểu dáng', ex: '{日本|にほん}の{携帯電話|けいたいでんわ}はデザインがいいです。', exRo: 'Nihon no keitai denwa wa dezain ga ii desu.', exVi: 'Điện thoại Nhật thiết kế đẹp.' },
        { w: '{番組|ばんぐみ}', pos: 'danh từ', ipa: 'bangumi', vi: 'chương trình (TV, radio) — テレビ番組', ex: '{日本|にほん}のテレビ{番組|ばんぐみ}はおもしろいと{思|おも}います。', exRo: 'Nihon no terebi bangumi wa omoshiroi to omoimasu.', exVi: 'Tôi nghĩ chương trình TV Nhật thú vị.' },
        { w: 'ファストフード', pos: 'danh từ', ipa: 'fasuto fuudo', vi: 'đồ ăn nhanh', ex: 'ファストフードは{安|やす}いですが、{体|からだ}によくないと{思|おも}います。', exRo: 'Fasuto fuudo wa yasui desu ga, karada ni yokunai to omoimasu.', exVi: 'Đồ ăn nhanh rẻ nhưng tôi nghĩ không tốt cho cơ thể.' },
        { w: 'ファッション', pos: 'danh từ', ipa: 'fasshon', vi: 'thời trang', ex: '{若|わか}い{人|ひと}のファッションについてどう{思|おも}いますか。', exRo: 'Wakai hito no fasshon ni tsuite dou omoimasu ka.', exVi: 'Bạn nghĩ sao về thời trang của giới trẻ?' },
        { w: 'フリープラン', pos: 'danh từ', ipa: 'furii puran', vi: 'gói du lịch tự do (chỉ có vé + khách sạn, tự đi chơi)', ex: 'フリープランは{自由|じゆう}がありますから、いいと{思|おも}います。', exRo: 'Furii puran wa jiyuu ga arimasu kara, ii to omoimasu.', exVi: 'Gói tự do có tự do nên tôi nghĩ là hay.' },
      ],
    },

    { t: 'h', text: 'G. Ý kiến — động từ & tính từ (8 từ — chủ đề 3)' },
    {
      t: 'vocab',
      items: [
        { w: '{思|おも}います［{思|おも}う］1', pos: 'động từ nhóm 1', ipa: 'omoimasu [omou]', vi: 'nghĩ, cho rằng (普通形 + と思います)', ex: '{明日|あした}は{雨|あめ}だと{思|おも}います。', exRo: 'Ashita wa ame da to omoimasu.', exVi: 'Tôi nghĩ mai trời mưa.' },
        { w: '{化粧|けしょう}します［{化粧|けしょう}する］3', pos: 'động từ nhóm 3', ipa: 'keshou shimasu [keshou suru]', vi: 'trang điểm (化粧 = đồ / việc trang điểm)', ex: '{電車|でんしゃ}で{化粧|けしょう}する{人|ひと}がいます。', exRo: 'Densha de keshou suru hito ga imasu.', exVi: 'Có người trang điểm trên tàu.' },
        { w: '{経験|けいけん}します［{経験|けいけん}する］3', pos: 'động từ nhóm 3', ipa: 'keiken shimasu [keiken suru]', vi: 'trải nghiệm, trải qua (経験 = kinh nghiệm; いい経験になります = thành trải nghiệm tốt)', ex: '{外国|がいこく}の{生活|せいかつ}はいい{経験|けいけん}になると{思|おも}います。', exRo: 'Gaikoku no seikatsu wa ii keiken ni naru to omoimasu.', exVi: 'Tôi nghĩ sống ở nước ngoài sẽ là trải nghiệm tốt.' },
        { w: 'うるさい', pos: 'tính từ đuôi い', ipa: 'urusai', vi: 'ồn ào, ầm ĩ (↔ {静|しず}か)', ex: 'この{番組|ばんぐみ}はおもしろいですが、{少|すこ}しうるさいと{思|おも}います。', exRo: 'Kono bangumi wa omoshiroi desu ga, sukoshi urusai to omoimasu.', exVi: 'Chương trình này thú vị nhưng tôi thấy hơi ồn ào.' },
        { w: 'おしゃれ（な）', pos: 'tính từ đuôi な', ipa: 'oshare (na)', vi: 'sành điệu, thời trang, đẹp (người, quần áo, quán)', ex: '{高校生|こうこうせい}の{制服|せいふく}はおしゃれだと{思|おも}います。', exRo: 'Koukousei no seifuku wa oshare da to omoimasu.', exVi: 'Tôi nghĩ đồng phục học sinh cấp 3 rất đẹp.' },
        { w: '{複雑|ふくざつ}（な）', pos: 'tính từ đuôi な', ipa: 'fukuzatsu (na)', vi: 'phức tạp, rắc rối', ex: '{東京|とうきょう}の{地下鉄|ちかてつ}は{複雑|ふくざつ}だと{思|おも}います。', exRo: 'Toukyou no chikatetsu wa fukuzatsu da to omoimasu.', exVi: 'Tôi nghĩ tàu điện ngầm Tokyo phức tạp. (câu mẫu của sách, ポイント 117)' },
        { w: '{便利|べんり}（な）', pos: 'tính từ đuôi な', ipa: 'benri (na)', vi: 'tiện lợi', ex: 'コンビニはいつでも{開|あ}いていますから、{便利|べんり}です。', exRo: 'Konbini wa itsudemo aite imasu kara, benri desu.', exVi: 'Cửa hàng tiện lợi lúc nào cũng mở nên tiện.' },
        { w: '{不便|ふべん}（な）', pos: 'tính từ đuôi な', ipa: 'fuben (na)', vi: 'bất tiện', ex: '{駅|えき}から{遠|とお}いですから、{不便|ふべん}です。', exRo: 'Eki kara tooi desu kara, fuben desu.', exVi: 'Xa ga nên bất tiện.' },
      ],
    },

    { t: 'h', text: 'H. Câu nói khi bàn ý kiến (4 từ — chủ đề 3)' },
    {
      t: 'vocab',
      items: [
        { w: 'いつでも', pos: 'phó từ', ipa: 'itsudemo', vi: 'bất cứ lúc nào, lúc nào cũng', ex: 'メールはいつでも{送|おく}ることができます。', exRo: 'Meeru wa itsudemo okuru koto ga dekimasu.', exVi: 'Thư điện tử thì lúc nào cũng gửi được.' },
        { w: 'うーん', pos: 'thán từ', ipa: 'uun', vi: 'ừm… (đang suy nghĩ, cân nhắc trước khi nói ý kiến)', ex: 'うーん。{便利|べんり}ですが、{少|すこ}し{高|たか}いと{思|おも}います。', exRo: 'Uun. Benri desu ga, sukoshi takai to omoimasu.', exVi: 'Ừm. Tiện nhưng tôi nghĩ hơi đắt.' },
        { w: '～について', pos: 'cụm trợ từ', ipa: '~ni tsuite', vi: 'về ~ (chủ đề của câu hỏi, bài nói)', ex: '{日本|にほん}の{交通|こうつう}についてどう{思|おも}いますか。', exRo: 'Nihon no koutsuu ni tsuite dou omoimasu ka.', exVi: 'Bạn nghĩ sao về giao thông Nhật Bản?' },
        { w: '{私|わたし}もそう{思|おも}います', pos: 'câu nói', ipa: 'watashi mo sou omoimasu', vi: 'tôi cũng nghĩ vậy (đồng ý với ý kiến người khác)', ex: 'ファストフードは{便利|べんり}ですね。——{私|わたし}もそう{思|おも}います。', exRo: 'Fasuto fuudo wa benri desu ne. — Watashi mo sou omoimasu.', exVi: 'Đồ ăn nhanh tiện nhỉ. — Tôi cũng nghĩ vậy.' },
      ],
    },

    { t: 'h', text: 'I. Từ của bài đọc 話読聞書 (9 từ gạch chân, p.250)' },
    {
      t: 'vocab',
      items: [
        { w: '{習慣|しゅうかん}', pos: 'danh từ', ipa: 'shuukan', vi: 'phong tục, tập quán; thói quen (tên bài: 国の習慣)', ex: '{日本|にほん}の{習慣|しゅうかん}にびっくりしました。', exRo: 'Nihon no shuukan ni bikkuri shimashita.', exVi: 'Tôi ngạc nhiên vì phong tục của Nhật.' },
        { w: 'バスタブ', pos: 'danh từ', ipa: 'basutabu', vi: 'bồn tắm', ex: '{日本|にほん}では{家族|かぞく}が{同|おな}じバスタブのお{湯|ゆ}を{使|つか}います。', exRo: 'Nihon de wa kazoku ga onaji basutabu no oyu o tsukaimasu.', exVi: 'Ở Nhật cả nhà dùng chung nước của một bồn tắm.' },
        { w: '{話|はなし}', pos: 'danh từ', ipa: 'hanashi', vi: 'câu chuyện, lời kể (話します → 話 là danh từ)', ex: '{私|わたし}の{話|はなし}を{聞|き}いて、みんな{笑|わら}いました。', exRo: 'Watashi no hanashi o kiite, minna waraimashita.', exVi: 'Nghe chuyện của tôi, mọi người đều cười.' },
        { w: 'ホストファミリー', pos: 'danh từ', ipa: 'hosuto famirii', vi: 'gia đình bản xứ (nhận du học sinh ở cùng — homestay)', ex: 'ホストファミリーのお{母|かあ}さんはとても{親切|しんせつ}です。', exRo: 'Hosuto famirii no okaasan wa totemo shinsetsu desu.', exVi: 'Mẹ trong gia đình homestay rất tốt bụng.' },
        { w: 'みんな', pos: 'danh từ', ipa: 'minna', vi: 'mọi người, tất cả (thân mật hơn 皆さん)', ex: '{家族|かぞく}みんなで{晩|ばん}ご{飯|はん}を{食|た}べます。', exRo: 'Kazoku minna de bangohan o tabemasu.', exVi: 'Cả nhà cùng ăn tối.' },
        { w: 'なくなります［なくなる］1', pos: 'động từ nhóm 1', ipa: 'nakunarimasu [nakunaru]', vi: 'mất đi, hết, không còn (Nがなくなります; ≠ なくします làm mất, Bài 10)', ex: 'お{湯|ゆ}がなくなりました。', exRo: 'Oyu ga nakunarimashita.', exVi: 'Hết nước nóng rồi.' },
        { w: '{笑|わら}います［{笑|わら}う］1', pos: 'động từ nhóm 1', ipa: 'waraimasu [warau]', vi: 'cười', ex: '{友達|ともだち}と{一緒|いっしょ}に{笑|わら}いました。', exRo: 'Tomodachi to issho ni waraimashita.', exVi: 'Tôi đã cười cùng bạn.' },
        { w: '{同|おな}じ', pos: 'tính từ (đứng trước N không cần な)', ipa: 'onaji', vi: 'giống nhau, cùng một (同じN — KHÔNG nói ~~同じなN~~)', ex: 'パクさんと{私|わたし}は{同|おな}じクラスです。', exRo: 'Paku-san to watashi wa onaji kurasu desu.', exVi: 'Park và tôi cùng lớp.' },
        { w: 'びっくり（します）', pos: 'phó từ / động từ nhóm 3', ipa: 'bikkuri (shimasu)', vi: 'giật mình, ngạc nhiên (Nにびっくりします)', ex: '{電車|でんしゃ}が{静|しず}かですから、びっくりしました。', exRo: 'Densha ga shizuka desu kara, bikkuri shimashita.', exVi: 'Tàu yên tĩnh quá nên tôi ngạc nhiên.' },
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp trong từ bài 14',
      items: [
        '**{開|あ}きます ↔ {開|あ}けます**: 開きます = (cửa) TỰ mở — **が**: ドア**が**開きます. 開けます = TÔI mở cửa — **を**: ドア**を**開けます (Bài 7). Sau ～と của ポイント 113 thường là tự động từ: ボタンを押すと、ドアが**開きます**.',
        '**つきます ↔ つけます**: 電気**が**つきます (đèn tự sáng) ↔ 電気**を**つけます (tôi bật đèn). Tương tự {出|で}ます (ra) ↔ {出|だ}します (lấy ra).',
        '**お{湯|ゆ} ↔ {水|みず}**: tiếng Nhật tách hai từ — お湯 = nước NÓNG, 水 = nước lạnh / nước thường. ~~熱い水~~ → **お湯**.',
        '**なくなります ↔ なくします** (Bài 10): なくなります = (tự) mất, hết — お湯**が**なくなりました; なくします = (tôi) làm mất — 財布**を**なくしました.',
        '**{同|おな}じ + N** không có な: ~~同じなクラス~~ → **同じクラス**.',
        '**そうなんですか ↔ そうですか**: cả hai "vậy à", nhưng そうなんですか dùng khi nghe **điều mình chưa hề biết**, hơi ngạc nhiên — đúng tình huống bị nhắc luật lệ.',
        '**{料金|りょうきん} ↔ {入場料|にゅうじょうりょう}**: 料金 = mọi loại phí (điện, xe, dịch vụ); 入場料 = riêng phí vào cửa. **{以下|いか}** tính CẢ mốc: 6{歳|さい}以下 = 6 tuổi trở xuống (có 6).',
        '**バイク** = xe MÁY (tiếng Anh "bike" lại hay hiểu là xe đạp). Xe đạp = {自転車|じてんしゃ}.',
      ],
    },

    { t: 'h', text: 'Từ thêm (sách có ở tranh, bài nghe, 言ってみよう — chỉ cần nghe hiểu)' },
    {
      t: 'table',
      head: ['Từ / câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['{駐輪場|ちゅうりんじょう}', 'chuurinjou', 'Bãi đỗ xe đạp (chân trang 252)'],
        ['{国|くに}の{習慣|しゅうかん}', 'kuni no shuukan', 'Phong tục của đất nước (tên bài)'],
        ['ルール・マナー', 'ruuru・manaa', 'Luật lệ, phép lịch sự (tên chủ đề 2)'],
        ['{意見|いけん}', 'iken', 'Ý kiến (私の意見 — tên chủ đề 3)'],
        ['{七味唐辛子|しちみとうがらし}', 'shichimi tougarashi', 'Bột ớt bảy vị (rắc lên udon, soba)'],
        ['{耳|みみ}かき', 'mimikaki', 'Que ngoáy tai (tranh やってみよう p.241)'],
        ['{肩|かた}たたき', 'katatataki', 'Dụng cụ đấm vai (tranh やってみよう p.241)'],
        ['{涼|すず}しい', 'suzushii', 'Mát mẻ (風鈴の音を聞くと涼しいです)'],
        ['{暖|あたた}かい', 'atatakai', 'Ấm áp'],
        ['{体|からだ}', 'karada', 'Cơ thể'],
        ['{靴|くつ}を{脱|ぬ}ぎます', 'kutsu o nugimasu', 'Cởi giày'],
        ['ヘルメットをかぶります', 'herumetto o kaburimasu', 'Đội mũ bảo hiểm'],
        ['{払|はら}います', 'haraimasu', 'Trả (tiền) — 料金を払います'],
        ['{見|み}せます', 'misemasu', 'Cho xem, xuất trình'],
        ['もえるごみ／もえないごみ', 'moeru gomi / moenai gomi', 'Rác cháy được / rác không cháy được'],
        ['ペットボトル', 'petto botoru', 'Chai nhựa'],
        ['{禁煙|きんえん}／{喫煙所|きつえんじょ}', 'kin\'en / kitsuenjo', 'Cấm hút thuốc / khu hút thuốc'],
        ['{自動販売機|じどうはんばいき}', 'jidou hanbaiki', 'Máy bán hàng tự động'],
        ['{機械|きかい}', 'kikai', 'Máy móc'],
        ['{作品|さくひん}', 'sakuhin', 'Tác phẩm (ở bảo tàng)'],
        ['{募集|ぼしゅう}', 'boshuu', 'Tuyển (アルバイト募集中 = đang tuyển làm thêm)'],
        ['{一人暮|ひとりぐ}らし', 'hitorigurashi', 'Sống một mình'],
        ['{生活|せいかつ}', 'seikatsu', 'Cuộc sống, sinh hoạt'],
        ['{地下鉄|ちかてつ}', 'chikatetsu', 'Tàu điện ngầm'],
        ['{迷惑|めいわく}', 'meiwaku', 'Phiền (Bài 10)'],
        ['ツアー', 'tsuaa', 'Tour du lịch trọn gói (↔ フリープラン)'],
        ['{校則|こうそく}', 'kousoku', 'Nội quy trường (できる！)'],
        ['{発表|はっぴょう}', 'happyou', 'Thuyết trình, phát biểu (できる！)'],
        ['{感想|かんそう}', 'kansou', 'Cảm tưởng, cảm nghĩ (できる！)'],
        ['ポスター', 'posutaa', 'Áp phích, poster (できる！)'],
        ['{違|ちが}います', 'chigaimasu', 'Khác (日本とあなたの国と何が違いますか)'],
        ['{切符|きっぷ}／パスモ', 'kippu / pasumo', 'Vé tàu / thẻ đi tàu PASMO (bài nghe)'],
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b14-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp — ポイント 113–118: と (hễ … thì), てはいけません, なければなりません, なくてもいいです, と思います, と言います',
  goal: 'Giải thích "làm V thì (tự nhiên) có kết quả", nói "không được / phải / không cần" làm gì và trả lời các câu hỏi đó, đổi câu sang thể thường để nói "tôi nghĩ là …", hỏi ý kiến, và hỏi – trả lời "… tiếng … nói thế nào".',
  minutes: 90,
  blocks: [
    {
      t: 'p',
      text: 'Bài 14 có **6 điểm ngữ pháp** (ポイント 113–118). Ba chủ đề của sách dùng chúng như sau: **{初|はじ}めて{見|み}た！{初|はじ}めて{聞|き}いた！** 113, 118 · **ルール・マナー** 114, 115, 116 · **{私|わたし}の{意見|いけん}** 117. Không có hình thái động từ hoàn toàn mới — bài này **dùng lại** thể từ điển (Bài 9), thể て (Bài 7), thể ない (Bài 10) và thể thường (Bài 13). Học theo thứ tự số ポイント: công thức → ví dụ → cặp hỏi–đáp → bảng thay thế → lỗi hay mắc.',
    },
    {
      t: 'table',
      caption: 'Bản đồ 6 điểm ngữ pháp',
      head: ['ポイント', 'Mẫu', 'Nghĩa', 'Ví dụ ngắn'],
      rows: [
        ['113', 'V{辞書形|じしょけい} と、___', 'Hễ (cứ) V thì … (kết quả tự nhiên)', 'このボタンを{押|お}すと、{水|みず}が{出|で}ます。'],
        ['114', 'Vテ形 は いけません', 'Không được V (cấm)', 'ここに{自転車|じてんしゃ}を{止|と}めてはいけません。'],
        ['115', 'Vナイ形 ‑ない → なければなりません', 'Phải V (bắt buộc)', 'シートベルトをしなければなりません。'],
        ['116', 'Vナイ形 ‑ない → なくてもいいです', 'Không cần V cũng được', '{学生|がくせい}は{料金|りょうきん}を{払|はら}わなくてもいいです。'],
        ['117', '{普通形|ふつうけい} と{思|おも}います', 'Tôi nghĩ là …', '{東京|とうきょう}の{地下鉄|ちかてつ}は{複雑|ふくざつ}だと{思|おも}います。'],
        ['118', '「___」と{言|い}います', 'Nói là "…", gọi là "…"', '「おいしい」は{英語|えいご}で「delicious」と{言|い}います。'],
      ],
    },
    {
      t: 'table',
      caption: 'Ôn nhanh — bài này ghép vào những thể nào của động từ',
      head: ['Thể', 'Học ở', 'Ví dụ ({押|お}します・{脱|ぬ}ぎます・します)', 'Dùng cho ポイント'],
      rows: [
        ['Thể từ điển (辞書形)', 'Bài 9', '{押|お}す・{脱|ぬ}ぐ・する', '113 (～と)'],
        ['Thể て (テ形)', 'Bài 7', '{押|お}して・{脱|ぬ}いで・して', '114 (～てはいけません)'],
        ['Thể ない (ナイ形)', 'Bài 10', '{押|お}さない・{脱|ぬ}がない・しない', '115 (～なければ), 116 (～なくても)'],
        ['Thể thường (普通形)', 'Bài 13', '{押|お}す・{押|お}さない・{押|お}した・{押|お}さなかった', '117 (～と思います)'],
      ],
    },

    /* ── ポイント 113 ── */
    { t: 'h', text: 'ポイント 113 — V{辞書形|じしょけい} と、___ (Hễ V thì … — kết quả tự nhiên)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N を V{辞書形|じしょけい} と、N が V（tự nhiên xảy ra）。',
          vi: 'Vế trước là **một động tác** (thể từ điển + と), vế sau là **kết quả luôn luôn / tự động xảy ra** — cách máy chạy, quy luật tự nhiên, thói quen chắc chắn. Rất hợp để **giải thích cách dùng máy móc, đồ vật**.',
          examples: [
            { en: 'このボタンを{押|お}すと、{水|みず}が{出|で}ます。', ro: 'Kono botan o osu to, mizu ga demasu.', vi: 'Bấm nút này thì nước chảy ra. (câu mẫu của sách)' },
            { en: 'そのボタンを{押|お}すと、ドアが{開|あ}きますよ。', ro: 'Sono botan o osu to, doa ga akimasu yo.', vi: 'Bấm cái nút đó thì cửa mở đấy.' },
            { en: 'このレバーを{回|まわ}すと、お{釣|つ}りが{出|で}ます。', ro: 'Kono rebaa o mawasu to, otsuri ga demasu.', vi: 'Xoay cần gạt này thì tiền thừa ra.' },
            { en: 'ここに{触|さわ}ると、{電気|でんき}がつきます。', ro: 'Koko ni sawaru to, denki ga tsukimasu.', vi: 'Chạm vào đây thì đèn sáng.' },
            { en: '{手|て}を{出|だ}すと、{水|みず}が{出|で}ます。', ro: 'Te o dasu to, mizu ga demasu.', vi: 'Đưa tay ra thì nước chảy (vòi tự động).' },
          ],
        },
        {
          formula: 'V{辞書形|じしょけい} と、イA‑く／ナA‑に なります。',
          vi: 'Ghép với **～くなります／～になります** (Bài 10) để giới thiệu đồ vật: "dùng cái này thì trở nên …".',
          examples: [
            { en: 'こたつに{足|あし}を{入|い}れると、{暖|あたた}かくなります。', ro: 'Kotatsu ni ashi o ireru to, atatakaku narimasu.', vi: 'Cho chân vào kotatsu thì ấm lên.' },
            { en: '{風鈴|ふうりん}の{音|おと}を{聞|き}くと、{涼|すず}しくなります。', ro: 'Fuurin no oto o kiku to, suzushiku narimasu.', vi: 'Nghe tiếng chuông gió thì thấy mát.' },
            { en: 'うどんに{唐辛子|とうがらし}を{入|い}れると、おいしくなります。', ro: 'Udon ni tougarashi o ireru to, oishiku narimasu.', vi: 'Cho ớt vào udon thì ngon hơn.' },
            { en: 'このボタンを{押|お}すと、{字|じ}が{大|おお}きくなります。', ro: 'Kono botan o osu to, ji ga ookiku narimasu.', vi: 'Bấm nút này thì chữ to ra.' },
          ],
        },
        {
          formula: 'Giới thiệu đồ vật: N は（mùa／lúc）V{辞書形|じしょけい} もの です。',
          vi: 'Câu mở đầu hay đi cùng ポイント 113: **N は ～とき、使うものです** (N là đồ dùng khi …) — V thể thường đứng trước danh từ もの (Bài 13).',
          examples: [
            { en: 'こたつは{冬|ふゆ}、{使|つか}うものです。', ro: 'Kotatsu wa fuyu, tsukau mono desu.', vi: 'Kotatsu là đồ dùng vào mùa đông.' },
            { en: '{湯|ゆ}たんぽは{寝|ね}るとき、{使|つか}うものです。', ro: 'Yutanpo wa neru toki, tsukau mono desu.', vi: 'Bình nước nóng là đồ dùng khi đi ngủ.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: không biết dùng máy',
      lines: [
        { who: 'アンナ', role: 'c', text: 'あれ？コーヒーが{出|で}ません。', ro: 'Are? Koohii ga demasen.', vi: 'Ơ? Cà phê không ra.' },
        { who: 'マルコ', role: 'b', text: 'あっ、その{緑|みどり}のボタンを{押|お}すと、{出|で}ますよ。', ro: 'A, sono midori no botan o osu to, demasu yo.', vi: 'À, bấm cái nút xanh đó thì ra đấy.' },
        { who: 'アンナ', role: 'c', text: 'あ、{出|で}ました。どうもありがとうございます。', ro: 'A, demashita. Doumo arigatou gozaimasu.', vi: 'A, ra rồi. Cảm ơn nhiều.' },
        { who: 'アンナ', role: 'c', text: 'あれは{何|なん}ですか。', ro: 'Are wa nan desu ka.', vi: 'Kia là cái gì?' },
        { who: 'マルコ', role: 'b', text: '{湯|ゆ}たんぽです。{冬|ふゆ}、{使|つか}うものです。お{湯|ゆ}を{入|い}れて、{布団|ふとん}の{中|なか}に{入|い}れると、{布団|ふとん}の{中|なか}が{暖|あたた}かくなります。', ro: 'Yutanpo desu. Fuyu, tsukau mono desu. Oyu o irete, futon no naka ni ireru to, futon no naka ga atatakaku narimasu.', vi: 'Là bình nước nóng. Đồ dùng mùa đông. Đổ nước nóng vào rồi đặt trong chăn thì trong chăn ấm lên.' },
        { who: 'アンナ', role: 'c', text: 'へえ。', ro: 'Hee.', vi: 'Ồ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — ___を V{辞書形|じしょけい}と、___が V ます',
      head: ['Động tác (ます → từ điển)', 'Kết quả', 'Câu hoàn chỉnh'],
      rows: [
        ['ボタンを{押|お}します → {押|お}す', 'ドアが{開|あ}きます', 'ボタンを{押|お}すと、ドアが{開|あ}きます。'],
        ['レバーを{回|まわ}します → {回|まわ}す', 'お{釣|つ}りが{出|で}ます', 'レバーを{回|まわ}すと、お{釣|つ}りが{出|で}ます。'],
        ['お{金|かね}を{入|い}れます → {入|い}れる', '{食券|しょっけん}が{出|で}ます', 'お{金|かね}を{入|い}れると、{食券|しょっけん}が{出|で}ます。'],
        ['ドアを{開|あ}けます → {開|あ}ける', '{電気|でんき}がつきます', 'ドアを{開|あ}けると、{電気|でんき}がつきます。'],
        ['ここに{触|さわ}ります → {触|さわ}る', '{音|おと}が{出|で}ます', 'ここに{触|さわ}ると、{音|おと}が{出|で}ます。'],
        ['{手|て}を{出|だ}します → {出|だ}す', '{水|みず}が{出|で}ます', '{手|て}を{出|だ}すと、{水|みず}が{出|で}ます。'],
        ['ポケットにカイロを{入|い}れます → {入|い}れる', '{暖|あたた}かくなります', 'ポケットにカイロを{入|い}れると、{暖|あたた}かくなります。'],
        ['{右|みぎ}に{曲|ま}がります → {曲|ま}がる', '{銀行|ぎんこう}があります', '{右|みぎ}に{曲|ま}がると、{銀行|ぎんこう}があります。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — ～と',
      items: [
        'Trước と là **thể từ điển**, không phải thể ます: ~~{押|お}しますと~~ → **{押|お}すと**; ~~{入|い}れますと~~ → **{入|い}れると**.',
        'Vế sau là việc **tự xảy ra**, KHÔNG đặt lời nhờ / rủ / ý muốn: ~~{駅|えき}に{着|つ}くと、{電話|でんわ}してください~~, ~~{暑|あつ}いと、{泳|およ}ぎましょう~~. (Mấy câu đó học ở Bài 15 với ～たら.)',
        'Vế sau thường dùng **tự động từ + が**: ドア**が**{開|あ}きます, {電気|でんき}**が**つきます, お{釣|つ}り**が**{出|で}ます. Đừng viết ~~ドアを開きます~~.',
        '**と** ở đây khác **と** "và" (N と N, Bài 2) và **と** "cùng với" (友達と, Bài 3) — nhận ra vì nó đứng **sau động từ** và có dấu phẩy.',
        'Cũng dùng để chỉ đường (kết quả chắc chắn thấy): {右|みぎ}に{曲|ま}がると、{銀行|ぎんこう}があります = rẽ phải thì (sẽ thấy) có ngân hàng.',
      ],
    },

    /* ── ポイント 114 ── */
    { t: 'h', text: 'ポイント 114 — Vテ形 は いけません (Không được V — cấm)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（nơi で／に）N を Vて は いけません。',
          vi: 'Nói **luật lệ, điều cấm**: ở đây không được làm V. Ghép thể て + **は** (đọc **wa**) + いけません. Hay thêm **よ** khi nhắc bạn: ～てはいけませんよ.',
          examples: [
            { en: 'ここに{自転車|じてんしゃ}を{止|と}めてはいけません。', ro: 'Koko ni jitensha o tomete wa ikemasen.', vi: 'Không được đỗ xe đạp ở đây. (câu mẫu của sách)' },
            { en: '{電車|でんしゃ}の{中|なか}で{携帯電話|けいたいでんわ}を{使|つか}ってはいけません。', ro: 'Densha no naka de keitai denwa o tsukatte wa ikemasen.', vi: 'Trên tàu không được dùng điện thoại (để nói chuyện).' },
            { en: 'ここでたばこを{吸|す}ってはいけません。', ro: 'Koko de tabako o sutte wa ikemasen.', vi: 'Ở đây không được hút thuốc.' },
            { en: '{美術館|びじゅつかん}で{写真|しゃしん}を{撮|と}ってはいけません。', ro: 'Bijutsukan de shashin o totte wa ikemasen.', vi: 'Không được chụp ảnh trong bảo tàng.' },
            { en: '{猫|ねこ}にえさをやってはいけません。', ro: 'Neko ni esa o yatte wa ikemasen.', vi: 'Không được cho mèo ăn.' },
            { en: 'ここに{入|はい}ってはいけません。', ro: 'Koko ni haitte wa ikemasen.', vi: 'Không được vào đây. (STAFF ONLY)' },
          ],
        },
        {
          formula: 'Hỏi xin phép (Bài 10) → không được: ～てもいいですか。——いいえ、～てはいけません。',
          vi: '**～てはいけません** là câu trả lời "không" của **～てもいいですか**. Trả lời "được" vẫn là はい、いいですよ／はい、どうぞ.',
          examples: [
            { en: 'ここで{写真|しゃしん}を{撮|と}ってもいいですか。——いいえ、{撮|と}ってはいけません。', ro: 'Koko de shashin o totte mo ii desu ka. — Iie, totte wa ikemasen.', vi: 'Ở đây chụp ảnh được không? — Không, không được chụp.' },
            { en: 'この{作品|さくひん}に{触|さわ}ってもいいですか。——いいえ、{触|さわ}ってはいけません。', ro: 'Kono sakuhin ni sawatte mo ii desu ka. — Iie, sawatte wa ikemasen.', vi: 'Sờ vào tác phẩm này được không? — Không, không được sờ.' },
            { en: 'ここに{車|くるま}を{止|と}めてもいいですか。——はい、いいですよ。', ro: 'Koko ni kuruma o tomete mo ii desu ka. — Hai, ii desu yo.', vi: 'Đỗ ô tô ở đây được không? — Được chứ.' },
          ],
        },
        {
          formula: 'Người được nhắc: あっ、そうなんですか。／あっ、すみません。',
          vi: 'Chưa biết luật → **あっ、そうなんですか** (ồ, vậy à). Đang làm mà bị nhắc → **あっ、すみません**. Người nhắc chỉ biển: **ほら、あれ** → **あっ、{本当|ほんとう}だ**.',
          examples: [
            { en: 'A：あ、Bさん、ここでたばこを{吸|す}ってはいけませんよ。B：あっ、そうなんですか。A：ほら、あれ。B：あっ、{本当|ほんとう}だ。', ro: 'A: A, B-san, koko de tabako o sutte wa ikemasen yo. B: A, sou nan desu ka. A: Hora, are. B: A, hontou da.', vi: 'A: Ấy B, ở đây không được hút thuốc đâu. B: Ồ, vậy à? A: Kìa, cái kia. B: A, thật.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — ここで／ここに ___てはいけません (biển báo → câu)',
      head: ['Biển', 'Thể ます', 'Thể て', 'Câu cấm'],
      rows: [
        ['🚭', 'たばこを{吸|す}います', '{吸|す}って', 'ここでたばこを{吸|す}ってはいけません。'],
        ['📵', '{携帯電話|けいたいでんわ}を{使|つか}います', '{使|つか}って', 'ここで{携帯電話|けいたいでんわ}を{使|つか}ってはいけません。'],
        ['📷 gạch chéo', '{写真|しゃしん}を{撮|と}ります', '{撮|と}って', 'ここで{写真|しゃしん}を{撮|と}ってはいけません。'],
        ['🚲 gạch chéo', '{自転車|じてんしゃ}を{止|と}めます', '{止|と}めて', 'ここに{自転車|じてんしゃ}を{止|と}めてはいけません。'],
        ['STAFF ONLY', '{入|はい}ります', '{入|はい}って', 'ここに{入|はい}ってはいけません。'],
        ['🐈 gạch chéo', '{猫|ねこ}にえさをやります', 'やって', 'ここで{猫|ねこ}にえさをやってはいけません。'],
        ['✋ gạch chéo', '{作品|さくひん}に{触|さわ}ります', '{触|さわ}って', '{作品|さくひん}に{触|さわ}ってはいけません。'],
        ['🗑 gạch chéo', 'ごみを{捨|す}てます', '{捨|す}てて', 'ここにごみを{捨|す}ててはいけません。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — てはいけません',
      items: [
        '**は** ở đây đọc **wa**: {撮|と}って**は** = totte **wa**. Đừng viết ~~撮ってわいけません~~.',
        'Đừng dùng thể ます / thể ない: ~~{撮|と}りてはいけません~~, ~~{撮|と}らないはいけません~~ → **{撮|と}ってはいけません**.',
        '**～てはいけません ↔ ～ないでください** (Bài 10): cả hai là "đừng", nhưng てはいけません = **luật, cấm** (mạnh, nói chung); ないでください = **lời nhờ** lịch sự với một người cụ thể. Nhắc bạn về luật ở nơi công cộng → てはいけません.',
        'Không dùng với người trên để nói việc họ đang làm (nghe như ra lệnh). Với thầy cô, khách: **すみません、ここは～ちょっと……** hoặc ～ないでください.',
        'Người nhắc thường thêm **よ** (～てはいけません**よ**) để báo cho người kia điều họ chưa biết.',
      ],
    },

    /* ── ポイント 115 ── */
    { t: 'h', text: 'ポイント 115 — Vナイ形 ‑ない → なければなりません (Phải V)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'Vない → Vなければ なりません。',
          vi: 'Nói **việc bắt buộc** (luật, quy định, việc không tránh được). Cách ghép: thể ない, **bỏ い** của ない, thêm **ければなりません**: {脱|ぬ}が**ない** → {脱|ぬ}が**なければなりません**.',
          examples: [
            { en: 'シートベルトをしなければなりません。', ro: 'Shiito beruto o shinakereba narimasen.', vi: 'Phải thắt dây an toàn. (câu mẫu của sách)' },
            { en: '{玄関|げんかん}で{靴|くつ}を{脱|ぬ}がなければなりません。', ro: 'Genkan de kutsu o nuganakereba narimasen.', vi: 'Phải cởi giày ở lối vào.' },
            { en: 'ごみを{分|わ}けなければなりません。', ro: 'Gomi o wakenakereba narimasen.', vi: 'Phải phân loại rác.' },
            { en: 'バイクに{乗|の}るとき、ヘルメットをかぶらなければなりません。', ro: 'Baiku ni noru toki, herumetto o kaburanakereba narimasen.', vi: 'Khi đi xe máy phải đội mũ bảo hiểm.' },
            { en: '{自転車|じてんしゃ}は{駐輪場|ちゅうりんじょう}に{止|と}めなければなりません。', ro: 'Jitensha wa chuurinjou ni tomenakereba narimasen.', vi: 'Xe đạp phải đỗ ở bãi xe đạp.' },
            { en: '{明日|あした}は{試験|しけん}ですから、{勉強|べんきょう}しなければなりません。', ro: 'Ashita wa shiken desu kara, benkyou shinakereba narimasen.', vi: 'Mai thi nên tôi phải học.' },
            { en: '{毎朝|まいあさ}{6時|ろくじ}に{起|お}きなければなりません。', ro: 'Maiasa rokuji ni okinakereba narimasen.', vi: 'Sáng nào tôi cũng phải dậy lúc 6 giờ.' },
          ],
        },
        {
          formula: 'Hỏi: ～なければなりませんか。——はい、～なければなりません。／いいえ、～なくてもいいです。',
          vi: '"Có phải V không?" — **có**: lặp lại なければなりません; **không cần**: dùng ポイント 116 **なくてもいいです** (KHÔNG trả lời ~~いいえ、～なければなりません~~ hay ~~いいえ、～てはいけません~~).',
          examples: [
            { en: '{身分証|みぶんしょう}を{見|み}せなければなりませんか。——はい、{見|み}せなければなりません。', ro: 'Mibunshou o misenakereba narimasen ka. — Hai, misenakereba narimasen.', vi: 'Có phải xuất trình giấy tờ không? — Có, phải xuất trình.' },
            { en: '{明日|あした}、{来|こ}なければなりませんか。——いいえ、{来|こ}なくてもいいです。', ro: 'Ashita, konakereba narimasen ka. — Iie, konakute mo ii desu.', vi: 'Mai có phải đến không? — Không, không đến cũng được.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Chia ～なければなりません theo nhóm (thể ます → ない → なければ)',
      head: ['Nhóm', 'Thể ます', 'Thể ない', '～なければなりません'],
      rows: [
        ['1', '{脱|ぬ}ぎます', '{脱|ぬ}がない', '{脱|ぬ}がなければなりません'],
        ['1', '{並|なら}びます', '{並|なら}ばない', '{並|なら}ばなければなりません'],
        ['1', '{払|はら}います', '{払|はら}わない', '{払|はら}わなければなりません'],
        ['1', 'かぶります', 'かぶらない', 'かぶらなければなりません'],
        ['1', '{待|ま}ちます', '{待|ま}たない', '{待|ま}たなければなりません'],
        ['1', '{帰|かえ}ります ⚠', '{帰|かえ}らない', '{帰|かえ}らなければなりません'],
        ['2', '{分|わ}けます', '{分|わ}けない', '{分|わ}けなければなりません'],
        ['2', '{止|と}めます', '{止|と}めない', '{止|と}めなければなりません'],
        ['2', '{見|み}せます', '{見|み}せない', '{見|み}せなければなりません'],
        ['2', '{着|き}ます', '{着|き}ない', '{着|き}なければなりません'],
        ['2', '{起|お}きます', '{起|お}きない', '{起|お}きなければなりません'],
        ['3', 'します', 'しない', 'しなければなりません'],
        ['3', '{来|き}ます', '{来|こ}ない', '{来|こ}なければなりません'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — (nơi / lúc) ___なければなりません',
      head: ['Nơi / lúc', 'Việc', 'Câu hoàn chỉnh'],
      rows: [
        ['{車|くるま}の{中|なか}', 'シートベルトをします', '{車|くるま}の{中|なか}ではシートベルトをしなければなりません。'],
        ['{信号|しんごう}が{赤|あか}のとき', '{止|と}まります', '{信号|しんごう}が{赤|あか}のとき、{止|と}まらなければなりません。'],
        ['{駅|えき}で', '{並|なら}びます', '{駅|えき}で{並|なら}ばなければなりません。'],
        ['ごみを{捨|す}てるとき', 'ごみを{分|わ}けます', 'ごみを{捨|す}てるとき、ごみを{分|わ}けなければなりません。'],
        ['たばこを{吸|す}うとき', '{喫煙所|きつえんじょ}で{吸|す}います', 'たばこは{喫煙所|きつえんじょ}で{吸|す}わなければなりません。'],
        ['{日本|にほん}の{家|いえ}', '{玄関|げんかん}で{靴|くつ}を{脱|ぬ}ぎます', '{日本|にほん}の{家|いえ}では、{玄関|げんかん}で{靴|くつ}を{脱|ぬ}がなければなりません。'],
        ['ホテル', 'パスポートを{見|み}せます', 'ホテルでパスポートを{見|み}せなければなりません。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — なければなりません',
      items: [
        'Bỏ **い** của ない rồi mới thêm ければ: {脱|ぬ}がな**い** → {脱|ぬ}がな**ければ**. Đừng viết ~~{脱|ぬ}がないければなりません~~ (sách ghi "‑ない**け**ればなりません" = gạch い đi).',
        'Là **"phải"** chứ không phải "không": câu có hai chữ phủ định (なければ + なりません) nhưng nghĩa khẳng định — "không làm thì không được" = **phải làm**.',
        'Quá khứ: ～なければなりません**でした** (đã phải): {高校生|こうこうせい}のとき、{制服|せいふく}を{着|き}なければなりませんでした.',
        'Nhóm 1 đuôい → **わ**: {払|はら}い → {払|はら}**わ**なければ; nhóm 3 {来|き}ます → **{来|こ}**なければ.',
        'Đọc liền, nhấn rõ **ke**: shinake**re**ba narimasen — trong bài nghe, nghe được なければ là biết "phải".',
      ],
    },

    /* ── ポイント 116 ── */
    { t: 'h', text: 'ポイント 116 — Vナイ形 ‑ない → なくてもいいです (Không cần V)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'Vない → Vなくても いいです。',
          vi: '**Không cần** làm V (không làm cũng được). Cách ghép: thể ない, bỏ **い**, thêm **くてもいいです**: {払|はら}わ**ない** → {払|はら}わ**なくてもいいです**. Đây là phủ định của ～なければなりません.',
          examples: [
            { en: '{学生|がくせい}は{料金|りょうきん}を{払|はら}わなくてもいいです。', ro: 'Gakusei wa ryoukin o harawanakute mo ii desu.', vi: 'Sinh viên không cần trả phí. (câu mẫu của sách)' },
            { en: 'ここで{靴|くつ}を{脱|ぬ}がなくてもいいですよ。', ro: 'Koko de kutsu o nuganakute mo ii desu yo.', vi: 'Ở đây không cần cởi giày đâu.' },
            { en: '{小学生|しょうがくせい}{以下|いか}は{入場料|にゅうじょうりょう}を{払|はら}わなくてもいいです。', ro: 'Shougakusei ika wa nyuujouryou o harawanakute mo ii desu.', vi: 'Từ học sinh tiểu học trở xuống không cần trả vé vào cửa.' },
            { en: '{名前|なまえ}を{書|か}かなくてもいいです。', ro: 'Namae o kakanakute mo ii desu.', vi: 'Không cần viết tên.' },
            { en: 'ツアーは{自分|じぶん}で{予約|よやく}しなくてもいいですから、{楽|らく}です。', ro: 'Tsuaa wa jibun de yoyaku shinakute mo ii desu kara, raku desu.', vi: 'Tour trọn gói không cần tự đặt chỗ nên nhàn.' },
            { en: 'パスモがありますから、{切符|きっぷ}を{買|か}わなくてもいいです。', ro: 'Pasumo ga arimasu kara, kippu o kawanakute mo ii desu.', vi: 'Vì có thẻ PASMO nên không cần mua vé.' },
          ],
        },
        {
          formula: 'Hỏi: ～なくてもいいですか。——はい、～なくてもいいです。／いいえ、～なければなりません。',
          vi: 'Hỏi "không làm có được không?" — **được**: はい、～なくてもいいです; **không, phải làm**: いいえ、～なければなりません.',
          examples: [
            { en: '{靴|くつ}を{脱|ぬ}がなくてもいいですか。——はい、{脱|ぬ}がなくてもいいです。', ro: 'Kutsu o nuganakute mo ii desu ka. — Hai, nuganakute mo ii desu.', vi: 'Không cởi giày có được không? — Được, không cần cởi.' },
            { en: '{名前|なまえ}を{書|か}かなくてもいいですか。——いいえ、{書|か}かなければなりません。', ro: 'Namae o kakanakute mo ii desu ka. — Iie, kakanakereba narimasen.', vi: 'Không viết tên có được không? — Không, phải viết.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Ba mẫu "luật lệ" đặt cạnh nhau — cùng một động từ',
      head: ['Động từ', 'Được làm (B10)', 'Không được (114)', 'Phải (115)', 'Không cần (116)'],
      rows: [
        ['{脱|ぬ}ぎます', '{脱|ぬ}いでもいいです', '{脱|ぬ}いではいけません', '{脱|ぬ}がなければなりません', '{脱|ぬ}がなくてもいいです'],
        ['{払|はら}います', '{払|はら}ってもいいです', '{払|はら}ってはいけません', '{払|はら}わなければなりません', '{払|はら}わなくてもいいです'],
        ['{並|なら}びます', '{並|なら}んでもいいです', '{並|なら}んではいけません', '{並|なら}ばなければなりません', '{並|なら}ばなくてもいいです'],
        ['{書|か}きます', '{書|か}いてもいいです', '{書|か}いてはいけません', '{書|か}かなければなりません', '{書|か}かなくてもいいです'],
        ['{止|と}めます', '{止|と}めてもいいです', '{止|と}めてはいけません', '{止|と}めなければなりません', '{止|と}めなくてもいいです'],
        ['します', 'してもいいです', 'してはいけません', 'しなければなりません', 'しなくてもいいです'],
        ['{来|き}ます', '{来|き}てもいいです', '{来|き}てはいけません', '{来|こ}なければなりません', '{来|こ}なくてもいいです'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng hỏi – đáp — bốn câu hỏi, hai cách trả lời',
      head: ['Câu hỏi', 'Trả lời CÓ', 'Trả lời KHÔNG'],
      rows: [
        ['～てもいいですか (được làm không?)', 'はい、いいですよ／はい、どうぞ', 'いいえ、～てはいけません'],
        ['～てはいけませんか (không được làm à?)', 'はい、～てはいけません', 'いいえ、～てもいいです'],
        ['～なければなりませんか (phải làm không?)', 'はい、～なければなりません', 'いいえ、～なくてもいいです'],
        ['～なくてもいいですか (không làm được không?)', 'はい、～なくてもいいです', 'いいえ、～なければなりません'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — なくてもいいです',
      items: [
        '~~{払|はら}わないてもいいです~~, ~~{払|はら}わなくていいです~~ (thân mật, không phải dạng của sách) → **{払|はら}わなくてもいいです**.',
        'Nghĩa là "**không cần**", KHÔNG phải "không được": {靴|くつ}を{脱|ぬ}がなくてもいいです = không cần cởi (cởi cũng chẳng sao). "Không được cởi" = {脱|ぬ}いではいけません.',
        'Trả lời "phải làm không?" mà muốn nói "không" → **いいえ、～なくてもいいです**, đừng nói ~~いいえ、～なければなりません~~ (ngược nghĩa).',
        'Quá khứ: ～なくてもよかったです (đã không cần) — sách chưa dạy, chỉ cần nhận ra khi nghe.',
      ],
    },

    /* ── ポイント 117 ── */
    { t: 'h', text: 'ポイント 117 — {普通形|ふつうけい} と{思|おも}います (Tôi nghĩ là …)' },
    {
      t: 'p',
      text: 'Nói **ý kiến, suy đoán** của mình: đặt câu ở **thể thường** (普通形, Bài 13 — 表 p.284) rồi thêm **と{思|おも}います**. Chỗ hay sai nhất: **tính từ な và danh từ phải thêm だ** ({複雑|ふくざつ}**だ**と, {学生|がくせい}**だ**と); tính từ い và động từ thì KHÔNG thêm gì.',
    },
    {
      t: 'table',
      caption: '丁寧形 → 普通形 (表 p.284) — trước と思います',
      head: ['Loại', 'Lịch sự (です／ます)', 'Thể thường + と思います', 'Romaji'],
      rows: [
        ['V khẳng định', '{行|い}きます', '{行|い}くと{思|おも}います', 'iku to omoimasu'],
        ['V phủ định', '{行|い}きません', '{行|い}かないと{思|おも}います', 'ikanai to omoimasu'],
        ['V quá khứ', '{行|い}きました', '{行|い}ったと{思|おも}います', 'itta to omoimasu'],
        ['V quá khứ phủ định', '{行|い}きませんでした', '{行|い}かなかったと{思|おも}います', 'ikanakatta to omoimasu'],
        ['あります', 'あります／ありません', 'あると／**ない**と{思|おも}います', 'aru / nai to omoimasu'],
        ['イA', 'おいしいです', 'おいしいと{思|おも}います', 'oishii to omoimasu'],
        ['イA phủ định', 'おいしくないです', 'おいしくないと{思|おも}います', 'oishikunai to omoimasu'],
        ['イA quá khứ', 'おいしかったです', 'おいしかったと{思|おも}います', 'oishikatta to omoimasu'],
        ['いい', 'いいです／よくないです', 'いいと／よくないと{思|おも}います', 'ii / yokunai to omoimasu'],
        ['ナA', '{便利|べんり}です', '{便利|べんり}**だ**と{思|おも}います', 'benri da to omoimasu'],
        ['ナA phủ định', '{便利|べんり}じゃありません', '{便利|べんり}じゃないと{思|おも}います', 'benri ja nai to omoimasu'],
        ['ナA quá khứ', '{便利|べんり}でした', '{便利|べんり}だったと{思|おも}います', 'benri datta to omoimasu'],
        ['N', '{雨|あめ}です', '{雨|あめ}**だ**と{思|おも}います', 'ame da to omoimasu'],
        ['N phủ định', '{雨|あめ}じゃありません', '{雨|あめ}じゃないと{思|おも}います', 'ame ja nai to omoimasu'],
        ['Mẫu khác', '{行|い}ったほうがいいです', '{行|い}ったほうがいいと{思|おも}います', 'itta hou ga ii to omoimasu'],
        ['Mẫu khác', '～なければなりません', '～なければならないと{思|おも}います', '~nakereba naranai to omoimasu'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（N は）{普通形|ふつうけい} と{思|おも}います。',
          vi: 'Nói ý kiến. Muốn nói nhẹ nhàng thì thêm **{少|すこ}し**, hoặc khen trước rồi chê sau bằng **～ですが、～と思います**.',
          examples: [
            { en: '{東京|とうきょう}の{地下鉄|ちかてつ}は{複雑|ふくざつ}だと{思|おも}います。', ro: 'Toukyou no chikatetsu wa fukuzatsu da to omoimasu.', vi: 'Tôi nghĩ tàu điện ngầm Tokyo phức tạp. (câu mẫu của sách)' },
            { en: '{日本|にほん}の{携帯電話|けいたいでんわ}はデザインがいいと{思|おも}います。', ro: 'Nihon no keitai denwa wa dezain ga ii to omoimasu.', vi: 'Tôi nghĩ điện thoại Nhật thiết kế đẹp.' },
            { en: '{一人|ひとり}{暮|ぐ}らしは{大変|たいへん}だと{思|おも}います。', ro: 'Hitorigurashi wa taihen da to omoimasu.', vi: 'Tôi nghĩ sống một mình vất vả.' },
            { en: 'おもしろいですが、{少|すこ}しうるさいと{思|おも}います。', ro: 'Omoshiroi desu ga, sukoshi urusai to omoimasu.', vi: 'Thú vị nhưng tôi nghĩ hơi ồn ào.' },
            { en: '{外国|がいこく}の{生活|せいかつ}はいい{経験|けいけん}になると{思|おも}います。', ro: 'Gaikoku no seikatsu wa ii keiken ni naru to omoimasu.', vi: 'Tôi nghĩ sống ở nước ngoài sẽ thành trải nghiệm tốt.' },
            { en: 'パクさんは{明日|あした}{来|こ}ないと{思|おも}います。', ro: 'Paku-san wa ashita konai to omoimasu.', vi: 'Tôi nghĩ mai Park không đến. (suy đoán)' },
          ],
        },
        {
          formula: 'Hỏi ý kiến: N について どう{思|おも}いますか。——～と{思|おも}います。',
          vi: '**～について** = về ~. **どう{思|おも}いますか** = bạn nghĩ thế nào. Trả lời bằng ～と思います; nghĩ mãi → mở đầu **うーん**.',
          examples: [
            { en: '{日本|にほん}のテレビ{番組|ばんぐみ}についてどう{思|おも}いますか。——おもしろいと{思|おも}います。', ro: 'Nihon no terebi bangumi ni tsuite dou omoimasu ka. — Omoshiroi to omoimasu.', vi: 'Bạn nghĩ sao về chương trình TV Nhật? — Tôi nghĩ thú vị. (câu mẫu của sách)' },
            { en: 'ファストフードについてどう{思|おも}いますか。——うーん。{便利|べんり}ですが、{体|からだ}によくないと{思|おも}います。', ro: 'Fasuto fuudo ni tsuite dou omoimasu ka. — Uun. Benri desu ga, karada ni yokunai to omoimasu.', vi: 'Bạn nghĩ sao về đồ ăn nhanh? — Ừm. Tiện nhưng tôi nghĩ không tốt cho cơ thể.' },
            { en: '{電車|でんしゃ}で{化粧|けしょう}することについてどう{思|おも}いますか。——{迷惑|めいわく}だと{思|おも}います。', ro: 'Densha de keshou suru koto ni tsuite dou omoimasu ka. — Meiwaku da to omoimasu.', vi: 'Bạn nghĩ sao về việc trang điểm trên tàu? — Tôi nghĩ là gây phiền.' },
          ],
        },
        {
          formula: 'So sánh: N1 と N2 と どちらが いいと{思|おも}いますか。——（lý do）から、N のほうが いいと{思|おも}います。',
          vi: 'Ghép mẫu so sánh どちら／～のほうが (bài trước) với と思います; lý do đặt trước bằng **～から**.',
          examples: [
            { en: '{田舎|いなか}の{生活|せいかつ}と{都会|とかい}の{生活|せいかつ}とどちらがいいと{思|おも}いますか。——{空気|くうき}がきれいですから、{田舎|いなか}のほうがいいと{思|おも}います。', ro: 'Inaka no seikatsu to tokai no seikatsu to dochira ga ii to omoimasu ka. — Kuuki ga kirei desu kara, inaka no hou ga ii to omoimasu.', vi: 'Sống ở nông thôn với ở thành phố, bạn nghĩ bên nào tốt hơn? — Vì không khí trong lành, tôi nghĩ nông thôn tốt hơn.' },
            { en: '{電話|でんわ}とメールとどちらが{便利|べんり}だと{思|おも}いますか。——いつでも{送|おく}ることができますから、メールのほうが{便利|べんり}だと{思|おも}います。', ro: 'Denwa to meeru to dochira ga benri da to omoimasu ka. — Itsudemo okuru koto ga dekimasu kara, meeru no hou ga benri da to omoimasu.', vi: 'Điện thoại với email, cái nào tiện hơn? — Vì lúc nào cũng gửi được, tôi nghĩ email tiện hơn.' },
          ],
        },
        {
          formula: 'Đồng ý / không đồng ý: {私|わたし}もそう{思|おも}います。／そうですね。でも、～と{思|おも}います。',
          vi: 'Đồng ý → **私もそう思います**. Không hoàn toàn đồng ý → **そうですね。でも、～と思います** (mềm, người Nhật hay dùng).',
          examples: [
            { en: '{若|わか}い{人|ひと}のファッションはおしゃれですね。——{私|わたし}もそう{思|おも}います。', ro: 'Wakai hito no fasshon wa oshare desu ne. — Watashi mo sou omoimasu.', vi: 'Thời trang giới trẻ sành điệu nhỉ. — Tôi cũng nghĩ vậy.' },
            { en: '{高校生|こうこうせい}の{制服|せいふく}はおしゃれですね。——そうですね。でも、スカートが{短|みじか}いと{思|おも}います。', ro: 'Koukousei no seifuku wa oshare desu ne. — Sou desu ne. Demo, sukaato ga mijikai to omoimasu.', vi: 'Đồng phục học sinh cấp 3 đẹp nhỉ. — Ừ nhỉ. Nhưng tôi nghĩ váy ngắn quá.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — N は ___ と思います (đổi です → thể thường)',
      head: ['Chủ đề', 'Nhận xét (lịch sự)', 'Câu ý kiến'],
      rows: [
        ['{東京|とうきょう}の{地下鉄|ちかてつ}', '{便利|べんり}です', '{東京|とうきょう}の{地下鉄|ちかてつ}は{便利|べんり}だと{思|おも}います。'],
        ['{日本|にほん}の{交通|こうつう}', '{複雑|ふくざつ}です', '{日本|にほん}の{交通|こうつう}は{複雑|ふくざつ}だと{思|おも}います。'],
        ['{高校生|こうこうせい}の{制服|せいふく}', 'おしゃれです', '{高校生|こうこうせい}の{制服|せいふく}はおしゃれだと{思|おも}います。'],
        ['{日本|にほん}の{携帯電話|けいたいでんわ}', '{高|たか}いです', '{日本|にほん}の{携帯電話|けいたいでんわ}は{高|たか}いと{思|おも}います。'],
        ['{田舎|いなか}', '{交通|こうつう}が{不便|ふべん}です', '{田舎|いなか}は{交通|こうつう}が{不便|ふべん}だと{思|おも}います。'],
        ['テレビ{番組|ばんぐみ}', 'うるさくないです', 'テレビ{番組|ばんぐみ}はうるさくないと{思|おも}います。'],
        ['{外国|がいこく}の{生活|せいかつ}', 'いい{経験|けいけん}になります', '{外国|がいこく}の{生活|せいかつ}はいい{経験|けいけん}になると{思|おも}います。'],
        ['アルバイト', '{高校生|こうこうせい}はしないほうがいいです', '{高校生|こうこうせい}はアルバイトをしないほうがいいと{思|おも}います。'],
        ['{明日|あした}', '{雨|あめ}です', '{明日|あした}は{雨|あめ}だと{思|おも}います。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — と思います',
      items: [
        'Quên **だ**: ~~{便利|べんり}と{思|おも}います~~, ~~{雨|あめ}と{思|おも}います~~ → **{便利|べんり}だと**, **{雨|あめ}だと**.',
        'Thêm だ thừa sau tính từ い: ~~{高|たか}いだと{思|おも}います~~ → **{高|たか}いと{思|おも}います**.',
        'Để thể lịch sự trước と: ~~{便利|べんり}ですと{思|おも}います~~, ~~{行|い}きますと{思|おも}います~~ → **{便利|べんり}だと**, **{行|い}くと**.',
        '"Tôi nghĩ là không …" → phủ định đặt TRƯỚC と: **{来|こ}ないと{思|おも}います** (tự nhiên). ~~{来|く}ると{思|おも}いません~~ nghe gắt, ít dùng.',
        'と{思|おも}います nói ý kiến của **chính mình**. Ý kiến người khác → **～と{言|い}っていました** (Bài 15 sẽ gặp ～そうです) — đừng nói ~~パクさんは～と思います~~ khi muốn thuật lại lời Park.',
        'Câu hỏi どう{思|おも}いますか → đừng trả lời ~~はい、～と思います~~ (không phải câu có/không). Đi thẳng vào ý kiến.',
      ],
    },

    /* ── ポイント 118 ── */
    { t: 'h', text: 'ポイント 118 — 「___」と{言|い}います (Nói là "…", gọi là "…")' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '「N1」は ～{語|ご} で {何|なん} と{言|い}いますか。——「N2」と{言|い}います。',
          vi: 'Hỏi / trả lời **một từ nói bằng tiếng khác thế nào**. **で** = bằng (ngôn ngữ), **と** = trích dẫn (đặt sau lời nói trong 「 」). {何|なん} đọc **nan** (trước と).',
          examples: [
            { en: '「おいしい」は{英語|えいご}で「delicious」と{言|い}います。', ro: '"Oishii" wa eigo de "delicious" to iimasu.', vi: '"Oishii" tiếng Anh nói là "delicious". (câu mẫu của sách)' },
            { en: '「ありがとう」はベトナム{語|ご}で{何|なん}と{言|い}いますか。——「cảm ơn」と{言|い}います。', ro: '"Arigatou" wa Betonamugo de nan to iimasu ka. — "Cảm ơn" to iimasu.', vi: '"Arigatou" tiếng Việt nói thế nào? — Nói là "cảm ơn".' },
            { en: '「おなかがすきました」はベトナム{語|ご}で{何|なん}と{言|い}いますか。——「đói bụng rồi」と{言|い}います。', ro: '"Onaka ga sukimashita" wa Betonamugo de nan to iimasu ka. — "Đói bụng rồi" to iimasu.', vi: '"Đói rồi" tiếng Việt nói thế nào? — "đói bụng rồi".' },
            { en: '「いただきます」は{英語|えいご}で{何|なん}と{言|い}いますか。——{英語|えいご}にはありません。', ro: '"Itadakimasu" wa eigo de nan to iimasu ka. — Eigo ni wa arimasen.', vi: '"Itadakimasu" tiếng Anh nói thế nào? — Tiếng Anh không có (từ tương đương).' },
          ],
        },
        {
          formula: 'Hỏi tên đồ vật: これは{日本語|にほんご}で{何|なん}と{言|い}いますか。——「N」と{言|い}います。',
          vi: 'Thấy một vật không biết tên → chỉ vào nó và hỏi. Rất hữu ích khi thi nói quên từ: **すみません、「…」は{日本語|にほんご}で{何|なん}と{言|い}いますか**.',
          examples: [
            { en: 'これは{日本語|にほんご}で{何|なん}と{言|い}いますか。——「{湯|ゆ}たんぽ」と{言|い}います。', ro: 'Kore wa Nihongo de nan to iimasu ka. — "Yutanpo" to iimasu.', vi: 'Cái này tiếng Nhật gọi là gì? — Gọi là "yutanpo".' },
            { en: '{食事|しょくじ}の{前|まえ}に「いただきます」と{言|い}います。', ro: 'Shokuji no mae ni "itadakimasu" to iimasu.', vi: 'Trước bữa ăn người ta nói "itadakimasu".' },
            { en: '{日本|にほん}では{食事|しょくじ}のあとで「ごちそうさまでした」と{言|い}います。', ro: 'Nihon de wa shokuji no ato de "gochisousama deshita" to iimasu.', vi: 'Ở Nhật sau bữa ăn người ta nói "gochisousama deshita".' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — 「___」は ___語で何と言いますか (言ってみよう 2)',
      head: ['Câu tiếng Nhật', 'Tiếng Việt', 'Tiếng Anh'],
      rows: [
        ['「おいしい」', '「ngon」と{言|い}います', '「delicious」と{言|い}います'],
        ['「おなかがすきました」', '「đói bụng rồi」と{言|い}います', '「I\'m hungry」と{言|い}います'],
        ['「おなかがいっぱいです」', '「no rồi」と{言|い}います', '「I\'m full」と{言|い}います'],
        ['「いただきます」', '「mời cả nhà ăn cơm」と{言|い}います', '(không có — "Let\'s eat")'],
        ['「ごちそうさまでした」', '「cảm ơn vì bữa ăn」と{言|い}います', '(không có — "Thank you for the meal")'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — と言います',
      items: [
        'Ngôn ngữ đi với **で**: ~~{英語|えいご}に{何|なん}と~~, ~~{英語|えいご}は{何|なん}と~~ → **{英語|えいご}で{何|なん}と{言|い}いますか**.',
        '{何|なん}と — đọc **nan**, không phải ~~なにと~~.',
        '**と{言|い}います (118) ↔ という N (ポイント 112, Bài 13)**: 「さくら」**という**{歌|うた} = bài hát TÊN LÀ "Sakura" (đứng trước danh từ); 「さくら」**と{言|い}います** = nói / gọi là "Sakura" (cuối câu).',
        'Lời được trích đặt trong 「 」, sau đó **と**. Không có と thì sai: ~~「delicious」{言|い}います~~.',
      ],
    },

    /* ── Tổng kết ── */
    { t: 'h', text: 'Tổng kết — câu hỏi của Bài 14 và cách trả lời' },
    {
      t: 'table',
      head: ['Câu hỏi / câu nói', 'Tình huống', 'Trả lời mẫu', 'ポイント'],
      rows: [
        ['あれ？～が{出|で}ません。', 'Máy không chạy', 'この～を V{辞書形|じしょけい}と、{出|で}ますよ。', '113'],
        ['あれは{何|なん}ですか。', 'Thấy đồ lạ', 'N です。～とき、{使|つか}うものです。～と、～なります。', '113'],
        ['～てもいいですか。', 'Hỏi được làm không', 'いいえ、～てはいけません。', '114'],
        ['（bạn đang làm sai）', 'Nhắc luật', 'Bさん、ここで～てはいけませんよ。— あっ、そうなんですか。', '114'],
        ['～なければなりませんか。', 'Hỏi có bắt buộc không', 'はい、～なければなりません。／いいえ、～なくてもいいです。', '115, 116'],
        ['～なくてもいいですか。', 'Hỏi không làm được không', 'はい、～なくてもいいです。／いいえ、～なければなりません。', '116, 115'],
        ['N についてどう{思|おも}いますか。', 'Hỏi ý kiến', '～と{思|おも}います。', '117'],
        ['N1 と N2 とどちらがいいと{思|おも}いますか。', 'So sánh', '～から、N のほうがいいと{思|おも}います。', '117'],
        ['「N」は～{語|ご}で{何|なん}と{言|い}いますか。', 'Hỏi cách nói', '「…」と{言|い}います。', '118'],
      ],
    },
    {
      t: 'build',
      id: 'b14-np-ghep',
      title: 'Ghép câu — dùng đủ 6 điểm ngữ pháp',
      items: [
        { vi: 'Bấm nút này thì nước chảy ra.', chips: ['このボタンを', '{押|お}すと、', '{水|みず}が', '{出|で}ます', '{押|お}しますと、', '{水|みず}を'], answer: ['このボタンを', '{押|お}すと、', '{水|みず}が', '{出|で}ます'], ro: 'Kono botan o osu to, mizu ga demasu.' },
        { vi: 'Xoay cần gạt thì tiền thừa ra đấy.', chips: ['レバーを', '{回|まわ}すと、', 'お{釣|つ}りが', '{出|で}ますよ', '{回|まわ}して', 'お{釣|つ}りを'], answer: ['レバーを', '{回|まわ}すと、', 'お{釣|つ}りが', '{出|で}ますよ'], ro: 'Rebaa o mawasu to, otsuri ga demasu yo.' },
        { vi: 'Cho chân vào kotatsu thì ấm lên.', chips: ['こたつに', '{足|あし}を', '{入|い}れると、', '{暖|あたた}かく', 'なります', '{暖|あたた}かいに'], answer: ['こたつに', '{足|あし}を', '{入|い}れると、', '{暖|あたた}かく', 'なります'], ro: 'Kotatsu ni ashi o ireru to, atatakaku narimasu.' },
        { vi: 'Không được đỗ xe đạp ở đây.', chips: ['ここに', '{自転車|じてんしゃ}を', '{止|と}めては', 'いけません', '{止|と}めないで', 'なりません'], answer: ['ここに', '{自転車|じてんしゃ}を', '{止|と}めては', 'いけません'], ro: 'Koko ni jitensha o tomete wa ikemasen.' },
        { vi: 'Trên tàu không được dùng điện thoại đâu.', chips: ['{電車|でんしゃ}の{中|なか}で', '{携帯電話|けいたいでんわ}を', '{使|つか}っては', 'いけませんよ', '{使|つか}わなければ', 'に'], answer: ['{電車|でんしゃ}の{中|なか}で', '{携帯電話|けいたいでんわ}を', '{使|つか}っては', 'いけませんよ'], ro: 'Densha no naka de keitai denwa o tsukatte wa ikemasen yo.' },
        { vi: 'Phải thắt dây an toàn.', chips: ['シートベルトを', 'しなければ', 'なりません', 'しなくても', 'いいです'], answer: ['シートベルトを', 'しなければ', 'なりません'], ro: 'Shiito beruto o shinakereba narimasen.' },
        { vi: 'Phải cởi giày ở lối vào.', chips: ['{玄関|げんかん}で', '{靴|くつ}を', '{脱|ぬ}がなければ', 'なりません', '{脱|ぬ}ぎなければ', 'いけません'], answer: ['{玄関|げんかん}で', '{靴|くつ}を', '{脱|ぬ}がなければ', 'なりません'], ro: 'Genkan de kutsu o nuganakereba narimasen.' },
        { vi: 'Sinh viên không cần trả phí.', chips: ['{学生|がくせい}は', '{料金|りょうきん}を', '{払|はら}わなくても', 'いいです', '{払|はら}っては', 'いけません'], answer: ['{学生|がくせい}は', '{料金|りょうきん}を', '{払|はら}わなくても', 'いいです'], ro: 'Gakusei wa ryoukin o harawanakute mo ii desu.' },
        { vi: 'Tôi nghĩ tàu điện ngầm Tokyo phức tạp.', chips: ['{東京|とうきょう}の', '{地下鉄|ちかてつ}は', '{複雑|ふくざつ}だと', '{思|おも}います', '{複雑|ふくざつ}と', '{複雑|ふくざつ}ですと'], answer: ['{東京|とうきょう}の', '{地下鉄|ちかてつ}は', '{複雑|ふくざつ}だと', '{思|おも}います'], ro: 'Toukyou no chikatetsu wa fukuzatsu da to omoimasu.' },
        { vi: 'Bạn nghĩ sao về chương trình TV Nhật?', chips: ['{日本|にほん}の', 'テレビ{番組|ばんぐみ}', 'について', 'どう', '{思|おも}いますか', '{何|なに}', 'で'], answer: ['{日本|にほん}の', 'テレビ{番組|ばんぐみ}', 'について', 'どう', '{思|おも}いますか'], ro: 'Nihon no terebi bangumi ni tsuite dou omoimasu ka.' },
        { vi: 'Vì không khí trong lành, tôi nghĩ nông thôn tốt hơn.', chips: ['{空気|くうき}が', 'きれいですから、', '{田舎|いなか}の', 'ほうが', 'いいと', '{思|おも}います', 'いいだと'], answer: ['{空気|くうき}が', 'きれいですから、', '{田舎|いなか}の', 'ほうが', 'いいと', '{思|おも}います'], ro: 'Kuuki ga kirei desu kara, inaka no hou ga ii to omoimasu.' },
        { vi: '"Oishii" tiếng Anh nói thế nào?', chips: ['「おいしい」は', '{英語|えいご}で', '{何|なん}と', '{言|い}いますか', '{英語|えいご}に', '{何|なに}を'], answer: ['「おいしい」は', '{英語|えいご}で', '{何|なん}と', '{言|い}いますか'], ro: '"Oishii" wa eigo de nan to iimasu ka.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b14-np-kiem',
      title: 'Kiểm tra nhanh ngữ pháp Bài 14',
      items: [
        { q: '「このボタンを＿、ドアが{開|あ}きます。」', options: ['{押|お}しますと', '{押|お}すと', '{押|お}してと', '{押|お}さと'], correct: 1, why: 'Thể từ điển + と (ポイント 113).' },
        { q: 'Câu nào SAI (vế sau không dùng được với ～と)?', options: ['ボタンを{押|お}すと、{水|みず}が{出|で}ます。', '{春|はる}になると、{暖|あたた}かくなります。', '{駅|えき}に{着|つ}くと、{電話|でんわ}してください。', 'ここに{触|さわ}ると、{電気|でんき}がつきます。'], correct: 2, why: 'Vế sau của ～と không phải lời nhờ (～てください).' },
        { q: '"Không được hút thuốc ở đây":', options: ['ここでたばこを{吸|す}わなくてもいいです。', 'ここでたばこを{吸|す}ってはいけません。', 'ここでたばこを{吸|す}わなければなりません。', 'ここでたばこを{吸|す}ってもいいです。'], correct: 1, why: 'Cấm = **Vてはいけません** (ポイント 114).' },
        { q: '「{写真|しゃしん}を{撮|と}ってもいいですか。」 — không được:', options: ['いいえ、{撮|と}らなくてもいいです。', 'いいえ、{撮|と}ってはいけません。', 'いいえ、{撮|と}らなければなりません。', 'はい、{撮|と}ってはいけません。'], correct: 1, why: 'Phủ định của ～てもいいですか là **～てはいけません**.' },
        { q: 'Thể "phải" của {脱|ぬ}ぎます:', options: ['{脱|ぬ}ぎなければなりません', '{脱|ぬ}がないければなりません', '{脱|ぬ}がなければなりません', '{脱|ぬ}いでなければなりません'], correct: 2, why: '{脱|ぬ}がない → bỏ い → **{脱|ぬ}がなければなりません** (ポイント 115).' },
        { q: 'Thể "phải" của {来|き}ます:', options: ['{来|き}なければなりません', '{来|こ}なければなりません', '{来|く}なければなりません', '{来|き}ないければなりません'], correct: 1, why: '{来|こ}ない → **{来|こ}なければなりません**.' },
        { q: '「{明日|あした}、{学校|がっこう}へ{来|こ}なければなりませんか。」 — không cần:', options: ['いいえ、{来|き}てはいけません。', 'いいえ、{来|こ}なくてもいいです。', 'いいえ、{来|こ}なければなりません。', 'はい、{来|こ}なくてもいいです。'], correct: 1, why: 'Không cần = **いいえ、～なくてもいいです** (ポイント 116).' },
        { q: '"Không cần viết tên":', options: ['{名前|なまえ}を{書|か}かなくてもいいです。', '{名前|なまえ}を{書|か}いてはいけません。', '{名前|なまえ}を{書|か}かないでください。', '{名前|なまえ}を{書|か}かなければなりません。'], correct: 0, why: '**Vなくてもいいです** = không cần (khác "không được").' },
        { q: '「{東京|とうきょう}の{地下鉄|ちかてつ}は{便利|べんり}＿{思|おも}います。」', options: ['と', 'だと', 'ですと', 'なと'], correct: 1, why: 'ナA + **だ** + と思います (ポイント 117).' },
        { q: '「この{番組|ばんぐみ}はおもしろい＿{思|おも}います。」', options: ['だと', 'と', 'です と', 'なと'], correct: 1, why: 'イA đứng thẳng trước と, **không thêm だ**.' },
        { q: '"Tôi nghĩ ngày mai Park không đến":', options: ['パクさんは{明日|あした}{来|き}ませんと{思|おも}います。', 'パクさんは{明日|あした}{来|こ}ないと{思|おも}います。', 'パクさんは{明日|あした}{来|く}ると{思|おも}いません。', 'パクさんは{明日|あした}{来|こ}ないだと{思|おも}います。'], correct: 1, why: 'Thể thường phủ định **{来|こ}ない** + と思います.' },
        { q: '「{日本|にほん}の{交通|こうつう}＿どう{思|おも}いますか。」', options: ['で', 'について', 'と', 'が'], correct: 1, why: 'Về ~ = **～について**.' },
        { q: '「「おいしい」は{英語|えいご}＿{何|なん}と{言|い}いますか。」', options: ['に', 'を', 'で', 'が'], correct: 2, why: 'Bằng (ngôn ngữ) → **で** (ポイント 118).' },
        { q: '「「delicious」＿{言|い}います。」', options: ['を', 'に', 'と', 'で'], correct: 2, why: 'Trích lời → **と**言います.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const KANJI: Lesson = {
  id: 'b14-kanji',
  kind: 'kanji',
  title: 'Chữ Hán — trong từ vựng Bài 14',
  goal: 'Nhận mặt và đọc đúng mọi từ chữ Hán trong 65 từ của Bài 14 và 9 từ của bài đọc (đồ vật Nhật, máy móc, luật lệ, ý kiến), đọc được câu không furigana như đề thi, và viết tay được các chữ ✍ hay gặp.',
  minutes: 35,
  blocks: [
    {
      t: 'p',
      text: 'Phần Reading của đề thi có **4 từ chữ Hán gạch chân, KHÔNG furigana (12 điểm)** — đó là chỗ nhiều bạn mất điểm. Học theo **cả từ** ({料金|りょうきん}, {交通|こうつう}, {経験|けいけん}) chứ đừng học chữ rời. **Âm On** (音, gốc Hán) thường dùng khi hai chữ Hán đứng cạnh nhau; **âm Kun** (訓, âm Nhật) khi chữ đứng một mình hoặc có đuôi kana ({湯|ゆ}, {並|なら}びます). Cột **Mức**: 👁 **nhận mặt** = đọc và hiểu là đủ (ưu tiên cho phần đọc); ✍ **nên viết** = ít nét, gặp rất nhiều, nên tập viết tay.',
    },
    {
      t: 'table',
      caption: '1. Máy móc & thao tác',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài', 'Mức'],
      rows: [
        ['字', 'ジ', 'あざ', 'TỰ (chữ)', '{字|じ}', '✍'],
        ['出', 'シュツ', 'で(る)・だ(す)', 'XUẤT (ra)', '{出|で}ます', '✍'],
        ['回', 'カイ', 'まわ(す)', 'HỒI (xoay; lần)', '{回|まわ}します', '✍'],
        ['気', 'キ', '—', 'KHÍ', '{電気|でんき} · {空気|くうき}', '✍'],
        ['食', 'ショク', 'た(べる)', 'THỰC (ăn)', '{食券|しょっけん} (ショッ)', '✍'],
        ['券', 'ケン', '—', 'KHOÁN (vé, phiếu)', '{食券|しょっけん}', '👁'],
        ['釣', 'チョウ', 'つ(る)', 'ĐIẾU (câu cá)', 'お{釣|つ}り', '👁'],
        ['電', 'デン', '—', 'ĐIỆN', '{電気|でんき}', '👁'],
        ['開', 'カイ', 'あ(く)・あ(ける)・ひら(く)', 'KHAI (mở)', '{開|あ}きます', '👁'],
        ['触', 'ショク', 'さわ(る)', 'XÚC (chạm)', '{触|さわ}ります', '👁'],
      ],
    },
    {
      t: 'table',
      caption: '2. Đồ vật & món ăn Nhật',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài', 'Mức'],
      rows: [
        ['子', 'シ', 'こ', 'TỬ (con)', '{唐辛子|とうがらし} (**し**)', '✍'],
        ['唐', 'トウ', 'から', 'ĐƯỜNG (nhà Đường)', '{唐辛子|とうがらし}', '👁'],
        ['辛', 'シン', 'から(い)', 'TÂN (cay)', '{唐辛子|とうがらし} (がら)', '👁'],
        ['風', 'フウ', 'かぜ', 'PHONG (gió)', '{風鈴|ふうりん}', '👁'],
        ['鈴', 'レイ・リン', 'すず', 'LINH (chuông)', '{風鈴|ふうりん}', '👁'],
        ['布', 'フ', 'ぬの', 'BỐ (vải)', '{布団|ふとん}', '👁'],
        ['団', 'ダン・トン', '—', 'ĐOÀN', '{布団|ふとん} (**トン**)', '👁'],
        ['湯', 'トウ', 'ゆ', 'THANG (nước nóng)', 'お{湯|ゆ} · {湯|ゆ}たんぽ', '👁'],
      ],
    },
    {
      t: 'table',
      caption: '3. Luật lệ, giấy tờ, phí',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài', 'Mức'],
      rows: [
        ['下', 'カ・ゲ', 'した', 'HẠ (dưới)', '{以下|いか}', '✍'],
        ['分', 'ブン・フン', 'わ(ける)', 'PHÂN (chia)', '{分|わ}けます · {身分証|みぶんしょう}', '✍'],
        ['金', 'キン', 'かね', 'KIM (tiền, vàng)', '{料金|りょうきん}', '✍'],
        ['入', 'ニュウ', 'い(れる)・はい(る)', 'NHẬP (vào)', '{入場料|にゅうじょうりょう}', '✍'],
        ['止', 'シ', 'と(める)・と(まる)', 'CHỈ (dừng)', '{止|と}めます', '✍'],
        ['以', 'イ', '—', 'DĨ', '{以下|いか}', '👁'],
        ['玄', 'ゲン', '—', 'HUYỀN', '{玄関|げんかん}', '👁'],
        ['関', 'カン', 'せき', 'QUAN (cửa ải)', '{玄関|げんかん}', '👁'],
        ['制', 'セイ', '—', 'CHẾ (chế độ)', '{制服|せいふく}', '👁'],
        ['服', 'フク', '—', 'PHỤC (quần áo)', '{制服|せいふく}', '👁'],
        ['身', 'シン', 'み', 'THÂN (thân mình)', '{身分証|みぶんしょう} (**み**)', '👁'],
        ['証', 'ショウ', '—', 'CHỨNG (giấy chứng nhận)', '{身分証|みぶんしょう}', '👁'],
        ['料', 'リョウ', '—', 'LIỆU (phí)', '{料金|りょうきん} · {入場料|にゅうじょうりょう}', '👁'],
        ['場', 'ジョウ', 'ば', 'TRƯỜNG (nơi)', '{入場料|にゅうじょうりょう}', '👁'],
        ['並', 'ヘイ', 'なら(ぶ)', 'TỊNH (xếp hàng)', '{並|なら}びます', '👁'],
      ],
    },
    {
      t: 'table',
      caption: '4. Ý kiến — cuộc sống, giao thông, tính chất',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài', 'Mức'],
      rows: [
        ['田', 'デン', 'た', 'ĐIỀN (ruộng)', '{田舎|いなか} (đọc cả cụm)', '✍'],
        ['会', 'カイ', 'あ(う)', 'HỘI (gặp)', '{都会|とかい}', '✍'],
        ['空', 'クウ', 'そら', 'KHÔNG (trời, rỗng)', '{空気|くうき}', '✍'],
        ['時', 'ジ', 'とき', 'THỜI (giờ)', '{時給|じきゅう}', '✍'],
        ['自', 'ジ', 'みずか(ら)', 'TỰ (tự mình)', '{自由|じゆう}', '✍'],
        ['思', 'シ', 'おも(う)', 'TƯ (nghĩ)', '{思|おも}います', '✍'],
        ['舎', 'シャ', '—', 'XÁ (nhà)', '{田舎|いなか}', '👁'],
        ['都', 'ト・ツ', 'みやこ', 'ĐÔ (thủ đô)', '{都会|とかい} (**ト**)', '👁'],
        ['交', 'コウ', 'まじ(わる)', 'GIAO', '{交通|こうつう}', '👁'],
        ['通', 'ツウ', 'とお(る)・かよ(う)', 'THÔNG (đi qua)', '{交通|こうつう}', '👁'],
        ['給', 'キュウ', '—', 'CẤP (lương)', '{時給|じきゅう}', '👁'],
        ['由', 'ユウ・ユ', '—', 'DO (lý do)', '{自由|じゆう} (**ユウ**)', '👁'],
        ['番', 'バン', '—', 'PHIÊN (số, lượt)', '{番組|ばんぐみ}', '👁'],
        ['組', 'ソ', 'くみ', 'TỔ (nhóm)', '{番組|ばんぐみ} (**ぐみ**)', '👁'],
        ['化', 'カ・ケ', '—', 'HOÁ', '{化粧|けしょう} (**ケ**)', '👁'],
        ['粧', 'ショウ', '—', 'TRANG (trang điểm)', '{化粧|けしょう}', '👁'],
        ['経', 'ケイ', 'へ(る)', 'KINH (trải qua)', '{経験|けいけん}', '👁'],
        ['験', 'ケン', '—', 'NGHIỆM (thử)', '{経験|けいけん}', '👁'],
        ['複', 'フク', '—', 'PHỨC (nhiều lớp)', '{複雑|ふくざつ}', '👁'],
        ['雑', 'ザツ', '—', 'TẠP (lẫn lộn)', '{複雑|ふくざつ}', '👁'],
        ['便', 'ベン・ビン', 'たよ(り)', 'TIỆN', '{便利|べんり} · {不便|ふべん}', '👁'],
        ['利', 'リ', '—', 'LỢI', '{便利|べんり}', '👁'],
        ['不', 'フ', '—', 'BẤT (không)', '{不便|ふべん}', '👁'],
      ],
    },
    {
      t: 'table',
      caption: '5. Bài đọc 話読聞書',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài', 'Mức'],
      rows: [
        ['同', 'ドウ', 'おな(じ)', 'ĐỒNG (giống)', '{同|おな}じ', '✍'],
        ['私', 'シ', 'わたし', 'TƯ (tôi)', '{私|わたし}の{意見|いけん}', '✍'],
        ['習', 'シュウ', 'なら(う)', 'TẬP (học)', '{習慣|しゅうかん}', '👁'],
        ['慣', 'カン', 'な(れる)', 'QUÁN (quen)', '{習慣|しゅうかん}', '👁'],
        ['話', 'ワ', 'はな(す)・はなし', 'THOẠI (nói)', '{話|はなし}', '👁'],
        ['笑', 'ショウ', 'わら(う)', 'TIẾU (cười)', '{笑|わら}います', '👁'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ',
      items: [
        '**Hán Việt đoán nghĩa**: 交通 = GIAO THÔNG, 自由 = TỰ DO, 経験 = KINH NGHIỆM, 複雑 = PHỨC TẠP, 便利 = TIỆN LỢI, 不便 = BẤT TIỆN, 習慣 = TẬP QUÁN, 制服 = CHẾ PHỤC (quần áo theo quy chế), 料金 = LIỆU KIM (tiền phí), 入場料 = NHẬP TRƯỜNG LIỆU (phí vào nơi), 身分証 = THÂN PHẬN CHỨNG, 都会 = ĐÔ HỘI, 番組 = PHIÊN TỔ (chương trình phát theo lượt), 化粧 = HOÁ TRANG, 時給 = THỜI CẤP (lương theo giờ).',
        '**Đọc đặc biệt**: {田舎|いなか} (đọc cả cụm, ~~でんしゃ~~) · {布団|ふとん} (団 = **とん**) · {唐辛子|とうがらし} (辛子 = がらし) · {化粧|けしょう} (化 = **け**) · {食券|しょっけん} (ショク → **ショッ**) · {身分証|みぶんしょう} (身 = **み**, Kun, dù ghép).',
        '**便** có hai âm: ベン ({便利|べんり}, {不便|ふべん}) / ビン ({郵便局|ゆうびんきょく}, Bài 3).',
        '**分** có ba cách: わ(けます) — chia; ブン — {自分|じぶん}, {身分証|みぶんしょう}; フン／プン — {5分|ごふん}, {10分|じゅっぷん}.',
        '**思 = 田 + 心**: ruộng trên, tim dưới — "trong lòng suy nghĩ".',
      ],
    },

    /* ── Đứng riêng hay đứng chung ── */
    { t: 'h', text: 'Đứng riêng hay đứng chung — một chữ, hai cách đọc' },
    {
      t: 'p',
      text: 'Cùng một chữ Hán, **đứng riêng** (thường có đuôi kana) thì đọc âm **Kun**; **ghép với chữ Hán khác** thì thường đọc âm **On**. Bảng dưới đây lấy chữ của Bài 14, cột phải là những từ ghép bạn sẽ gặp rất sớm (nhiều từ đã học ở bài trước) — đọc qua để khi gặp chữ quen trong từ lạ vẫn đoán được âm.',
    },
    {
      t: 'table',
      caption: 'Kun khi đứng riêng ↔ On trong từ ghép',
      head: ['Chữ', 'Đứng riêng (Kun)', 'Trong từ ghép (On)'],
      rows: [
        ['字', '— (đứng riêng vẫn đọc On: {字|じ})', '{漢字|かんじ} — chữ Hán · {文字|もじ} — chữ viết (đặc biệt)'],
        ['食', '{食|た}べます — ăn', '{食券|しょっけん} — phiếu ăn · {食事|しょくじ} — bữa ăn · {食堂|しょくどう} — nhà ăn'],
        ['出', '{出|で}ます — ra · {出|だ}します — lấy ra', '{出発|しゅっぱつ} — xuất phát · {出身|しゅっしん} — quê quán (Bài 1)'],
        ['回', '{回|まわ}します — xoay', '{一回|いっかい} — một lần · {今回|こんかい} — lần này'],
        ['開', '{開|あ}きます・{開|あ}けます — mở', '{開店|かいてん} — mở cửa hàng'],
        ['風', '{風|かぜ} — gió', '{風鈴|ふうりん} — chuông gió · {台風|たいふう} — bão'],
        ['湯', 'お{湯|ゆ} — nước nóng', '{銭湯|せんとう} — nhà tắm công cộng'],
        ['子', '{子|こ}ども — trẻ con', '{女子|じょし} — nữ · {唐辛子|とうがらし} — ớt (đặc biệt)'],
        ['下', '{下|した} — dưới', '{以下|いか} — trở xuống · {地下鉄|ちかてつ} — tàu điện ngầm (カ → **か**)'],
        ['身', '{身|み} — thân mình', '{出身|しゅっしん} — quê quán · {身分証|みぶんしょう} (ngoại lệ: み)'],
        ['分', '{分|わ}けます — chia', '{自分|じぶん} — bản thân · {身分証|みぶんしょう}'],
        ['金', 'お{金|かね} — tiền', '{料金|りょうきん} — phí · {金曜日|きんようび} — thứ Sáu'],
        ['入', '{入|はい}ります・{入|い}れます', '{入場料|にゅうじょうりょう} — phí vào cửa · {入学|にゅうがく} — nhập học'],
        ['場', '{場所|ばしょ} — nơi chốn', '{入場料|にゅうじょうりょう} · {駐輪場|ちゅうりんじょう} — bãi xe đạp · {会場|かいじょう} — hội trường'],
        ['止', '{止|と}めます — đỗ, dừng', '{中止|ちゅうし} — huỷ bỏ (Bài 15)'],
        ['服', '— (ít đứng riêng)', '{制服|せいふく} — đồng phục · {洋服|ようふく} — quần áo Âu'],
        ['料', '—', '{料金|りょうきん} · {料理|りょうり} — món ăn, nấu ăn'],
        ['空', '{空|そら} — bầu trời', '{空気|くうき} — không khí · {空港|くうこう} — sân bay'],
        ['会', '{会|あ}います — gặp', '{都会|とかい} — đô thị · {会社|かいしゃ} — công ty'],
        ['通', '{通|かよ}います — đi (học, làm) đều đặn', '{交通|こうつう} — giao thông'],
        ['時', '{時|とき} — khi, lúc (～とき)', '{時給|じきゅう} — lương giờ · {時間|じかん} — thời gian'],
        ['自', '— (ít đứng riêng)', '{自由|じゆう} — tự do · {自分|じぶん} — bản thân · {自転車|じてんしゃ} — xe đạp'],
        ['思', '{思|おも}います — nghĩ', '— (từ ghép học sau)'],
        ['組', '{組|くみ} — tổ, lớp', '{番組|ばんぐみ} — chương trình (くみ → **ぐみ**)'],
        ['番', '—', '{番組|ばんぐみ} · {一番|いちばん} — nhất (Bài 6) · {番号|ばんごう} — số'],
        ['化', '—', '{化粧|けしょう} (ケ) · {文化|ぶんか} — văn hoá (カ)'],
        ['便', '—', '{便利|べんり} · {不便|ふべん} · {郵便局|ゆうびんきょく} (ビン)'],
        ['話', '{話|はな}します — nói · {話|はなし} — câu chuyện', '{電話|でんわ} — điện thoại · {会話|かいわ} — hội thoại'],
        ['習', '{習|なら}います — học (có người dạy)', '{習慣|しゅうかん} — phong tục · {練習|れんしゅう} — luyện tập'],
        ['同', '{同|おな}じ — giống nhau', '— (từ ghép học sau)'],
        ['笑', '{笑|わら}います — cười', '— (từ ghép học sau)'],
      ],
    },
    {
      t: 'note',
      title: 'Cách đọc bất quy tắc hay gặp',
      items: [
        '**Đọc cả cụm (熟字訓)** — không ghép từ âm từng chữ: {田舎|いなか} (~~でんしゃ~~), {唐辛子|とうがらし} (辛子 → がらし), お{土産|みやげ} (Bài 10), {今日|きょう}. {布団|ふとん} thì ghép âm bình thường nhưng 団 đọc âm hiếm **トン**.',
        '**Biến âm đục** khi ghép: {番|ばん} + {組|くみ} → ばん**ぐみ**; {唐|とう} + {辛子|からし} → とう**がらし**; {一人|ひとり} + {暮|く}らし → ひとり**ぐ**らし.',
        '**Âm ngắt っ** khi On gặp phụ âm k/t/p/s: {食|しょく} + {券|けん} → **しょっ**けん; {出|しゅつ} + {発|はつ} → **しゅっ**ぱつ; {一|いち} + {回|かい} → **いっ**かい.',
        '**Một chữ nhiều âm On**: 化 = ケ ({化粧|けしょう}) / カ ({文化|ぶんか}); 便 = ベン ({便利|べんり}) / ビン ({郵便|ゆうびん}); 団 = トン ({布団|ふとん}) / ダン ({団体|だんたい}).',
      ],
    },

    {
      t: 'mcq',
      id: 'b14-kj-doc',
      title: 'Đọc chữ Hán — chọn cách đọc đúng',
      items: [
        { q: '食券', options: ['しょくけん', 'しょっけん', 'たべけん', 'しょけん'], correct: 1, why: 'ショク + ケン → **しょっけん** (âm ngắt).' },
        { q: 'お釣り', options: ['おつり', 'おちょうり', 'おとり', 'おづり'], correct: 0, why: '**おつり** — tiền thừa.' },
        { q: '電気', options: ['でんき', 'てんき', 'でんけ', 'でんぎ'], correct: 0, why: '**でんき** (天気 てんき = thời tiết).' },
        { q: '開きます (cửa mở)', options: ['ひらきます', 'あきます', 'かいきます', 'あけます'], correct: 1, why: 'ドアが**あきます** (sách: ドアが開きません). ひらきます cũng là cách đọc của 開く nhưng câu này dùng あきます.' },
        { q: '唐辛子', options: ['とうしんし', 'からからし', 'とうがらし', 'とうからこ'], correct: 2, why: 'Đọc cả cụm: **とうがらし**.' },
        { q: '風鈴', options: ['かぜりん', 'ふうれい', 'ふうりん', 'ふりん'], correct: 2, why: '**ふうりん** — chuông gió.' },
        { q: '布団', options: ['ふだん', 'ぬのだん', 'ふとん', 'ふどん'], correct: 2, why: '団 đọc **トン** ở đây: ふとん.' },
        { q: 'お湯', options: ['おみず', 'おゆ', 'おとう', 'おあつ'], correct: 1, why: '**おゆ** — nước nóng.' },
        { q: '以下', options: ['いか', 'いした', 'いげ', 'いしも'], correct: 0, why: '**いか** — trở xuống.' },
        { q: '玄関', options: ['げんせき', 'げんかん', 'けんかん', 'げんがん'], correct: 1, why: '**げんかん** — lối vào nhà.' },
        { q: '制服', options: ['せいふく', 'せふく', 'せいぶく', 'しいふく'], correct: 0, why: '**せいふく** — đồng phục.' },
        { q: '身分証', options: ['しんぶんしょう', 'みぶんしょう', 'みわけしょう', 'しんぷんしょう'], correct: 1, why: '身 đọc **み** ở đây: みぶんしょう.' },
        { q: '料金', options: ['りょうきん', 'りょきん', 'りょうかね', 'りょうぎん'], correct: 0, why: '**りょうきん** — phí.' },
        { q: '入場料', options: ['はいばりょう', 'にゅうじょうりょう', 'にゅうばりょう', 'いりじょうりょう'], correct: 1, why: '**にゅうじょうりょう** — phí vào cửa.' },
        { q: '並びます', options: ['なみびます', 'ならびます', 'へいびます', 'ならべます'], correct: 1, why: '**ならびます** — xếp hàng.' },
        { q: '田舎', options: ['でんしゃ', 'たいえ', 'いなか', 'いなが'], correct: 2, why: 'Đọc cả cụm: **いなか**.' },
        { q: '都会', options: ['とかい', 'つかい', 'みやこかい', 'とあい'], correct: 0, why: '**とかい** — đô thị.' },
        { q: '交通', options: ['こうつう', 'こつう', 'こうどう', 'こうとお'], correct: 0, why: '**こうつう** (hai trường âm).' },
        { q: '時給', options: ['じきゅう', 'ときゅう', 'じきゅ', 'じくゅう'], correct: 0, why: '**じきゅう** — lương giờ.' },
        { q: '自由', options: ['じゆ', 'じゆう', 'じゅう', 'しゆう'], correct: 1, why: '**じゆう** (じ + ゆう). じゅう = 10.' },
        { q: '番組', options: ['ばんくみ', 'ばんそ', 'ばんぐみ', 'ばぐみ'], correct: 2, why: 'くみ → **ぐみ**: ばんぐみ.' },
        { q: '化粧', options: ['かしょう', 'けしょう', 'けそう', 'かそう'], correct: 1, why: '化 đọc **ケ** ở đây: けしょう.' },
        { q: '経験', options: ['けいけん', 'けけん', 'きょうけん', 'けいげん'], correct: 0, why: '**けいけん** — kinh nghiệm.' },
        { q: '複雑', options: ['ふくざつ', 'ふくさつ', 'ふくぞう', 'ふざつ'], correct: 0, why: '**ふくざつ** — phức tạp.' },
        { q: '不便', options: ['ふびん', 'ふべん', 'ぶべん', 'ふへん'], correct: 1, why: '**ふべん** — bất tiện.' },
        { q: '習慣', options: ['しゅうかん', 'しゅかん', 'ならかん', 'しゅうがん'], correct: 0, why: '**しゅうかん** — phong tục.' },
        { q: '笑います', options: ['しょういます', 'わらいます', 'えみます', 'わらります'], correct: 1, why: '**わらいます** — cười.' },
        { q: '同じ', options: ['どうじ', 'おなじ', 'おんじ', 'おなし'], correct: 1, why: '**おなじ** — giống nhau.' },
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
      id: 'b14-doc-kanji',
      title: 'Đọc to từng câu — chữ Hán Bài 14',
      note: 'Mỗi câu có ít nhất một từ chữ Hán của Bài 14. Chỗ hay sai: 食券 しょっけん, 布団 ふとん, 身分証 みぶんしょう, 田舎 いなか, 番組 ばんぐみ, 化粧 けしょう, 自由 じゆう.',
      items: [
        { text: 'このボタンをおすと、{食券|しょっけん}が{出|で}ます。', ro: 'Kono botan o osu to, shokken ga demasu.', vi: 'Bấm nút này thì phiếu ăn ra.' },
        { text: 'レバーを{回|まわ}すと、お{釣|つ}りが{出|で}ます。', ro: 'Rebaa o mawasu to, otsuri ga demasu.', vi: 'Xoay cần gạt thì tiền thừa ra.' },
        { text: 'ドアをあけると、{電気|でんき}がつきます。', ro: 'Doa o akeru to, denki ga tsukimasu.', vi: 'Mở cửa thì đèn sáng.' },
        { text: 'このボタンをおすと、{字|じ}が大きくなります。', ro: 'Kono botan o osu to, ji ga ookiku narimasu.', vi: 'Bấm nút này thì chữ to lên.' },
        { text: 'あれ？ドアが{開|あ}きません。', ro: 'Are? Doa ga akimasen.', vi: 'Ơ? Cửa không mở.' },
        { text: 'さくひんに{触|さわ}ってはいけません。', ro: 'Sakuhin ni sawatte wa ikemasen.', vi: 'Không được sờ vào tác phẩm.' },
        { text: '{風鈴|ふうりん}の音をきくと、すずしくなります。', ro: 'Fuurin no oto o kiku to, suzushiku narimasu.', vi: 'Nghe tiếng chuông gió thì thấy mát.' },
        { text: '{湯|ゆ}たんぽを{布団|ふとん}の中にいれます。', ro: 'Yutanpo o futon no naka ni iremasu.', vi: 'Đặt bình nước nóng vào trong chăn.' },
        { text: 'そばに{唐辛子|とうがらし}をいれると、おいしくなります。', ro: 'Soba ni tougarashi o ireru to, oishiku narimasu.', vi: 'Cho ớt vào soba thì ngon hơn.' },
        { text: 'お{湯|ゆ}がなくなりました。', ro: 'Oyu ga nakunarimashita.', vi: 'Hết nước nóng rồi.' },
        { text: '{玄関|げんかん}でくつをぬがなければなりません。', ro: 'Genkan de kutsu o nuganakereba narimasen.', vi: 'Phải cởi giày ở lối vào.' },
        { text: 'こうこうせいのとき、{制服|せいふく}をきなければなりませんでした。', ro: 'Koukousei no toki, seifuku o kinakereba narimasen deshita.', vi: 'Hồi cấp 3 tôi phải mặc đồng phục.' },
        { text: 'ホテルで{身分証|みぶんしょう}を見せなければなりません。', ro: 'Hoteru de mibunshou o misenakereba narimasen.', vi: 'Ở khách sạn phải xuất trình giấy tờ tuỳ thân.' },
        { text: 'がくせいは{料金|りょうきん}をはらわなくてもいいです。', ro: 'Gakusei wa ryoukin o harawanakute mo ii desu.', vi: 'Sinh viên không cần trả phí.' },
        { text: 'しょうがくせい{以下|いか}は{入場料|にゅうじょうりょう}がいりません。', ro: 'Shougakusei ika wa nyuujouryou ga irimasen.', vi: 'Từ học sinh tiểu học trở xuống không mất phí vào cửa.' },
        { text: 'ここに{並|なら}んでください。', ro: 'Koko ni narande kudasai.', vi: 'Hãy xếp hàng ở đây.' },
        { text: 'ここにじてんしゃを{止|と}めてはいけません。', ro: 'Koko ni jitensha o tomete wa ikemasen.', vi: 'Không được đỗ xe đạp ở đây.' },
        { text: 'ごみをきちんと{分|わ}けなければなりません。', ro: 'Gomi o kichinto wakenakereba narimasen.', vi: 'Phải phân loại rác cẩn thận.' },
        { text: '{田舎|いなか}は{空気|くうき}がきれいです。', ro: 'Inaka wa kuuki ga kirei desu.', vi: 'Nông thôn không khí trong lành.' },
        { text: '{都会|とかい}のせいかつは{便利|べんり}だと{思|おも}います。', ro: 'Tokai no seikatsu wa benri da to omoimasu.', vi: 'Tôi nghĩ cuộc sống đô thị tiện lợi.' },
        { text: 'いなかは{交通|こうつう}が{不便|ふべん}です。', ro: 'Inaka wa koutsuu ga fuben desu.', vi: 'Nông thôn đi lại bất tiện.' },
        { text: 'このアルバイトは{時給|じきゅう}千円です。', ro: 'Kono arubaito wa jikyuu sen en desu.', vi: 'Việc làm thêm này lương giờ 1.000 yên.' },
        { text: 'ひとりぐらしは{自由|じゆう}がありますから、いいです。', ro: 'Hitorigurashi wa jiyuu ga arimasu kara, ii desu.', vi: 'Sống một mình có tự do nên tốt.' },
        { text: 'にほんのテレビ{番組|ばんぐみ}についてどう{思|おも}いますか。', ro: 'Nihon no terebi bangumi ni tsuite dou omoimasu ka.', vi: 'Bạn nghĩ sao về chương trình TV Nhật?' },
        { text: 'でんしゃで{化粧|けしょう}する人がいます。', ro: 'Densha de keshou suru hito ga imasu.', vi: 'Có người trang điểm trên tàu.' },
        { text: 'がいこくのせいかつはいい{経験|けいけん}になります。', ro: 'Gaikoku no seikatsu wa ii keiken ni narimasu.', vi: 'Sống ở nước ngoài sẽ thành trải nghiệm tốt.' },
        { text: 'ちかてつは{複雑|ふくざつ}だと{思|おも}います。', ro: 'Chikatetsu wa fukuzatsu da to omoimasu.', vi: 'Tôi nghĩ tàu điện ngầm phức tạp.' },
        { text: 'にほんの{習慣|しゅうかん}にびっくりしました。', ro: 'Nihon no shuukan ni bikkuri shimashita.', vi: 'Tôi ngạc nhiên vì phong tục Nhật.' },
        { text: 'わたしの{話|はなし}をきいて、みんな{笑|わら}いました。', ro: 'Watashi no hanashi o kiite, minna waraimashita.', vi: 'Nghe chuyện của tôi, mọi người đều cười.' },
        { text: 'かぞくみんなが{同|おな}じおゆをつかいます。', ro: 'Kazoku minna ga onaji oyu o tsukaimasu.', vi: 'Cả nhà dùng chung một (bồn) nước nóng.' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b14-doc-doan',
      title: 'Đọc to đoạn văn kiểu đề thi (30 giây chuẩn bị)',
      note: 'Mỗi đoạn ~100 chữ, 4 từ chữ Hán + vài từ katakana như đề thật. Đọc liền mạch, không dừng giữa từ.',
      items: [
        {
          text: 'えきのちかくのうどんやには{食券|しょっけん}のきかいがあります。おかねをいれて、ボタンをおすと、しょっけんがでます。レバーをまわすと、お{釣|つ}りがでます。はじめはわかりませんでしたが、ともだちにききました。いまはかんたんだと{思|おも}います。',
          ro: 'Eki no chikaku no udon-ya ni wa shokken no kikai ga arimasu. Okane o irete, botan o osu to, shokken ga demasu. Rebaa o mawasu to, otsuri ga demasu. Hajime wa wakarimasen deshita ga, tomodachi ni kikimashita. Ima wa kantan da to omoimasu.',
          vi: 'Quán udon gần ga có máy bán phiếu ăn. Cho tiền vào, bấm nút thì phiếu ăn ra. Xoay cần gạt thì tiền thừa ra. Lúc đầu tôi không hiểu, nhưng tôi đã hỏi bạn. Giờ tôi nghĩ là dễ.',
        },
        {
          text: 'にほんのいえでは、{玄関|げんかん}でくつをぬがなければなりません。ごみはきちんとわけなければなりません。でんしゃのなかで、でんわではなしてはいけません。でも、びじゅつかんは、がくせいは{料金|りょうきん}をはらわなくてもいいです。{身分証|みぶんしょう}を見せてください。',
          ro: 'Nihon no ie de wa, genkan de kutsu o nuganakereba narimasen. Gomi wa kichinto wakenakereba narimasen. Densha no naka de, denwa de hanashite wa ikemasen. Demo, bijutsukan wa, gakusei wa ryoukin o harawanakute mo ii desu. Mibunshou o misete kudasai.',
          vi: 'Ở nhà người Nhật phải cởi giày ở lối vào. Rác phải phân loại cẩn thận. Trên tàu không được nói điện thoại. Nhưng ở bảo tàng, sinh viên không cần trả phí. Hãy xuất trình giấy tờ tuỳ thân.',
        },
        {
          text: 'わたしは{田舎|いなか}のせいかつがすきです。{空気|くうき}がきれいで、しずかですから。でも、ともだちのパクさんは{都会|とかい}のほうがいいといっています。いなかは{交通|こうつう}がふべんですから。スーパーやコンビニもすくないです。みなさんはどうおもいますか。',
          ro: 'Watashi wa inaka no seikatsu ga suki desu. Kuuki ga kirei de, shizuka desu kara. Demo, tomodachi no Paku-san wa tokai no hou ga ii to itte imasu. Inaka wa koutsuu ga fuben desu kara. Suupaa ya konbini mo sukunai desu. Minasan wa dou omoimasu ka.',
          vi: 'Tôi thích cuộc sống nông thôn. Vì không khí trong lành, yên tĩnh. Nhưng bạn tôi là Park thì nói rằng thành phố tốt hơn. Vì nông thôn đi lại bất tiện. Siêu thị và cửa hàng tiện lợi cũng ít. Mọi người nghĩ sao?',
        },
        {
          text: 'ホームステイのとき、にほんのおふろの{習慣|しゅうかん}にびっくりしました。かぞくみんなが{同|おな}じバスタブのおゆをつかいます。わたしはおゆをすてました。ホストファミリーのおかあさんは「あれ？」といいました。わたしのはなしをきいて、みんな{笑|わら}いました。',
          ro: 'Hoomusutei no toki, Nihon no ofuro no shuukan ni bikkuri shimashita. Kazoku minna ga onaji basutabu no oyu o tsukaimasu. Watashi wa oyu o sutemashita. Hosuto famirii no okaasan wa "Are?" to iimashita. Watashi no hanashi o kiite, minna waraimashita.',
          vi: 'Khi ở homestay, tôi ngạc nhiên vì phong tục tắm bồn của Nhật. Cả nhà dùng chung nước trong một bồn tắm. Tôi đã xả hết nước nóng đi. Mẹ trong gia đình homestay nói "Ơ?". Nghe tôi kể, mọi người đều cười.',
        },
      ],
    },

    {
      t: 'write',
      id: 'b14-viet-kanji',
      title: 'Tập viết tay chữ Hán Bài 14 — ✍ trước, 👁 sau',
      note: '19 chữ đầu là nhóm ✍ nên viết (ít nét, gặp rất nhiều) — viết cho thạo. Phần còn lại là 👁 nhận mặt: viết thử một lượt để nhớ mặt chữ là đủ. Bấm ▶ Thứ tự nét trước khi viết; viết xong nhờ ✨ AI xem chữ.',
      chars: ['字', '出', '回', '気', '食', '子', '下', '分', '金', '入', '止', '田', '会', '空', '時', '自', '思', '同', '私', '券', '釣', '電', '開', '触', '唐', '辛', '風', '鈴', '布', '団', '湯', '以', '玄', '関', '制', '服', '身', '証', '料', '場', '並', '舎', '都', '交', '通', '給', '由', '番', '組', '化', '粧', '経', '験', '複', '雑', '便', '利', '不', '習', '慣', '話', '笑'],
    },
  ],
};

/* ═══════════════════════════ 5. NGHE ═══════════════════════════ */

const NGHE: Lesson = {
  id: 'b14-nghe',
  kind: 'listening',
  title: 'Luyện nghe — đồ vật gì? làm hay không? ý kiến ra sao?',
  goal: 'Nghe người khác giới thiệu đồ vật để đoán đó là gì và dùng khi nào, nghe chuyện luật lệ để biết người nói làm hay không làm, nghe người khác nói ý kiến và ghi lại đúng lời, và nghe hiểu một đoạn hội thoại dài ở ga – trên tàu.',
  minutes: 40,
  blocks: [
    {
      t: 'note',
      title: 'Cách nghe',
      items: [
        '**Giới thiệu đồ vật**: bắt **～とき、{使|つか}うものです** (dùng khi nào) và vế sau của **～と、～** (dùng thì chuyện gì xảy ra: {暖|あたた}かくなります, {涼|すず}しくなります…).',
        '**Luật lệ**: nghe đuôi câu. **～てはいけません** = không được · **～なければなりません** = phải · **～なくてもいいです** = không cần · **～てもいいです** = được. Hai mẫu đầu nghe gần giống nhau ở chỗ "ikemasen / narimasen" — bắt chữ **te wa** hay **nakereba** phía trước.',
        '**Ý kiến**: sau **でも** thường là ý kiến ngược lại. Câu then chốt kết thúc bằng **～と{思|おも}います**; lý do đứng trước **～から**.',
        'Bẫy: người nói lúc đầu định làm, sau khi nghe luật thì đổi ý. Luôn lấy thông tin **cuối cùng**.',
      ],
    },

    /* ── Bài 1 ── */
    { t: 'h', text: 'Bài 1 — Đây là đồ vật gì? Dùng khi nào? (やってみよう)' },
    {
      t: 'table',
      caption: 'Các đồ vật (tả thay cho tranh)',
      head: ['Kí hiệu', 'Đồ vật'],
      rows: [
        ['ⓐ', '{風鈴|ふうりん} — chuông gió'],
        ['ⓑ', 'カイロ — túi sưởi'],
        ['ⓒ', '{湯|ゆ}たんぽ — bình nước nóng'],
        ['ⓓ', '{唐辛子|とうがらし} — lọ ớt bột'],
        ['ⓔ', 'こたつ — bàn sưởi'],
      ],
    },
    {
      t: 'listen',
      id: 'b14-ng-1a',
      title: 'Đồ vật số 1',
      note: 'Bắt: mùa nào, làm gì với nó, kết quả ra sao.',
      lines: [
        { who: 'マルコ', voice: 'ja-nam', text: '{木村|きむら}さん、これは{何|なん}ですか。', ro: 'Kimura-san, kore wa nan desu ka.', vi: 'Kimura, cái này là gì vậy?' },
        { who: '{木村|きむら}', voice: 'ja-nu', text: 'これは{夏|なつ}、{使|つか}うものです。{窓|まど}のところにこれがあると、{風|かぜ}が{来|く}るとき、きれいな{音|おと}が{出|で}ます。その{音|おと}を{聞|き}くと、{涼|すず}しくなりますよ。', ro: 'Kore wa natsu, tsukau mono desu. Mado no tokoro ni kore ga aru to, kaze ga kuru toki, kirei na oto ga demasu. Sono oto o kiku to, suzushiku narimasu yo.', vi: 'Đây là đồ dùng vào mùa hè. Có nó ở chỗ cửa sổ thì khi gió thổi tới, nó phát ra tiếng hay. Nghe tiếng đó thì thấy mát đấy.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'へえ、おもしろいですね。', ro: 'Hee, omoshiroi desu ne.', vi: 'Ồ, thú vị nhỉ.' },
      ],
    },
    {
      t: 'listen',
      id: 'b14-ng-1b',
      title: 'Đồ vật số 2',
      lines: [
        { who: 'アンナ', voice: 'ja-nu', text: 'ダニエルさん、これ、{何|なん}ですか。{重|おも}いですね。', ro: 'Danieru-san, kore, nan desu ka. Omoi desu ne.', vi: 'Daniel, cái này là gì vậy? Nặng nhỉ.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'それは{冬|ふゆ}、{寝|ね}るとき{使|つか}うものです。{中|なか}にお{湯|ゆ}を{入|い}れて、{布団|ふとん}の{中|なか}に{入|い}れます。そうすると、{朝|あさ}まで{布団|ふとん}の{中|なか}が{暖|あたた}かいですよ。', ro: 'Sore wa fuyu, neru toki tsukau mono desu. Naka ni oyu o irete, futon no naka ni iremasu. Sou suru to, asa made futon no naka ga atatakai desu yo.', vi: 'Đó là đồ dùng khi đi ngủ vào mùa đông. Đổ nước nóng vào trong, rồi đặt vào trong chăn. Làm vậy thì trong chăn ấm tới sáng đấy.' },
        { who: 'アンナ', voice: 'ja-nu', text: '{電気|でんき}を{使|つか}わなくてもいいですね。{便利|べんり}です。', ro: 'Denki o tsukawanakute mo ii desu ne. Benri desu.', vi: 'Không cần dùng điện nhỉ. Tiện thật.' },
      ],
    },
    {
      t: 'listen',
      id: 'b14-ng-1c',
      title: 'Đồ vật số 3',
      lines: [
        { who: 'ナタポン', voice: 'ja-nam', text: 'パクさん、この{小|ちい}さい{赤|あか}いのは{何|なん}ですか。', ro: 'Paku-san, kono chiisai akai no wa nan desu ka.', vi: 'Park, cái lọ nhỏ màu đỏ này là gì?' },
        { who: 'パク', voice: 'ja-nu', text: 'それはうどんやそばを{食|た}べるとき、{使|つか}うものです。{少|すこ}し{入|い}れると、{辛|から}くなって、おいしくなりますよ。', ro: 'Sore wa udon ya soba o taberu toki, tsukau mono desu. Sukoshi ireru to, karaku natte, oishiku narimasu yo.', vi: 'Đó là đồ dùng khi ăn udon hay soba. Cho một chút vào thì cay lên và ngon hơn đấy.' },
        { who: 'ナタポン', voice: 'ja-nam', text: '{私|わたし}は{辛|から}いものが{好|す}きです。たくさん{入|い}れます。', ro: 'Watashi wa karai mono ga suki desu. Takusan iremasu.', vi: 'Mình thích đồ cay. Mình cho nhiều.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b14-ng-1-q',
      title: 'Câu hỏi bài 1',
      items: [
        { q: 'Đồ vật số 1 là gì?', options: ['ⓐ {風鈴|ふうりん}', 'ⓑ カイロ', 'ⓒ {湯|ゆ}たんぽ', 'ⓔ こたつ'], correct: 0, why: '{夏|なつ}、{使|つか}うもの · {音|おと}を{聞|き}くと、{涼|すず}しくなります → chuông gió.' },
        { q: 'Đồ vật số 2 dùng khi nào?', options: ['{夏|なつ}、{出|で}かけるとき', '{冬|ふゆ}、{寝|ね}るとき', 'うどんを{食|た}べるとき', '{雨|あめ}のとき'], correct: 1, why: '**{冬|ふゆ}、{寝|ね}るとき**{使|つか}うものです (bình nước nóng ⓒ).' },
        { q: 'Đồ vật số 2 có cần điện không?', options: ['はい、{使|つか}わなければなりません。', 'いいえ、{使|つか}わなくてもいいです。', 'はい、{電気|でんき}がつきます。', 'わかりません。'], correct: 1, why: 'アンナ: {電気|でんき}を{使|つか}わなくてもいいですね。' },
        { q: 'Đồ vật số 3 cho vào thì thế nào?', options: ['{甘|あま}くなります', '{暖|あたた}かくなります', '{辛|から}くなります', '{涼|すず}しくなります'], correct: 2, why: '{少|すこ}し{入|い}れると、**{辛|から}く**なって… → ớt ⓓ.' },
      ],
    },

    /* ── Bài 2 ── */
    { t: 'h', text: 'Bài 2 — Làm hay không làm? (やってみよう)' },
    {
      t: 'p',
      text: 'Nghe 4 đoạn hội thoại ngắn. Mỗi đoạn có một luật lệ / phong tục. Chọn việc người được nhắc tới **cuối cùng làm hay không làm**.',
    },
    {
      t: 'listen',
      id: 'b14-ng-2a',
      title: 'Đoạn 1 — Natapon ở nhà bạn người Nhật',
      lines: [
        { who: 'ナタポン', voice: 'ja-nam', text: 'こんにちは。お{邪魔|じゃま}します。', ro: 'Konnichiwa. Ojama shimasu.', vi: 'Chào cậu. Mình xin phép vào nhà.' },
        { who: '{木村|きむら}', voice: 'ja-nu', text: 'どうぞ。あ、ナタポンさん、{日本|にほん}の{家|いえ}では、{玄関|げんかん}で{靴|くつ}を{脱|ぬ}がなければなりませんよ。', ro: 'Douzo. A, Natapon-san, Nihon no ie de wa, genkan de kutsu o nuganakereba narimasen yo.', vi: 'Mời vào. À, Natapon, ở nhà người Nhật phải cởi giày ở lối vào đấy.' },
        { who: 'ナタポン', voice: 'ja-nam', text: 'はい、{知|し}っています。タイも{同|おな}じですから。', ro: 'Hai, shitte imasu. Tai mo onaji desu kara.', vi: 'Ừ, mình biết. Vì Thái Lan cũng giống vậy.' },
      ],
    },
    {
      t: 'listen',
      id: 'b14-ng-2b',
      title: 'Đoạn 2 — Mariyam và rác',
      lines: [
        { who: 'マリヤム', voice: 'ja-nu', text: '{管理人|かんりにん}さん、このごみ、ここに{捨|す}ててもいいですか。', ro: 'Kanrinin-san, kono gomi, koko ni sutete mo ii desu ka.', vi: 'Bác quản lý ơi, rác này vứt ở đây được không ạ?' },
        { who: '{管理人|かんりにん}', voice: 'ja-nam', text: 'あ、ちょっと{待|ま}ってください。ペットボトルと{紙|かみ}は{分|わ}けなければなりません。{今日|きょう}は{燃|も}えるごみの{日|ひ}ですから、ペットボトルは{捨|す}ててはいけませんよ。', ro: 'A, chotto matte kudasai. Petto botoru to kami wa wakenakereba narimasen. Kyou wa moeru gomi no hi desu kara, petto botoru wa sutete wa ikemasen yo.', vi: 'À, chờ chút. Chai nhựa và giấy phải để riêng. Hôm nay là ngày rác cháy được, nên chai nhựa không được vứt đâu.' },
        { who: 'マリヤム', voice: 'ja-nu', text: 'そうなんですか。じゃ、ペットボトルは{来週|らいしゅう}{捨|す}てます。', ro: 'Sou nan desu ka. Ja, petto botoru wa raishuu sutemasu.', vi: 'Vậy ạ. Vậy chai nhựa thì tuần sau cháu vứt.' },
      ],
    },
    {
      t: 'listen',
      id: 'b14-ng-2c',
      title: 'Đoạn 3 — Mary ở bảo tàng',
      lines: [
        { who: 'メアリー', voice: 'ja-nu', text: 'すみません、{大人|おとな}{1枚|いちまい}お{願|ねが}いします。', ro: 'Sumimasen, otona ichimai onegai shimasu.', vi: 'Xin lỗi, cho tôi một vé người lớn.' },
        { who: '{受付|うけつけ}', voice: 'ja-nam', text: '{先生|せんせい}ですか。{今日|きょう}は{先生|せんせい}と{学生|がくせい}の{日|ひ}ですから、{入場料|にゅうじょうりょう}を{払|はら}わなくてもいいですよ。', ro: 'Sensei desu ka. Kyou wa sensei to gakusei no hi desu kara, nyuujouryou o harawanakute mo ii desu yo.', vi: 'Chị là giáo viên à? Hôm nay là ngày của giáo viên và học sinh, nên không cần trả phí vào cửa đâu.' },
        { who: 'メアリー', voice: 'ja-nu', text: 'え、{本当|ほんとう}ですか。{身分証|みぶんしょう}を{見|み}せなければなりませんか。', ro: 'E, hontou desu ka. Mibunshou o misenakereba narimasen ka.', vi: 'Ơ, thật ạ? Có phải xuất trình giấy tờ không?' },
        { who: '{受付|うけつけ}', voice: 'ja-nam', text: 'はい、お{願|ねが}いします。……はい、どうぞ。', ro: 'Hai, onegai shimasu. …… Hai, douzo.', vi: 'Vâng, phiền chị. …… Vâng, mời chị vào.' },
      ],
    },
    {
      t: 'listen',
      id: 'b14-ng-2d',
      title: 'Đoạn 4 — Kimura hồi cấp 3',
      lines: [
        { who: 'カルロス', voice: 'ja-nam', text: '{木村|きむら}さんの{高校|こうこう}は{制服|せいふく}がありましたか。', ro: 'Kimura-san no koukou wa seifuku ga arimashita ka.', vi: 'Trường cấp 3 của chị Kimura có đồng phục không?' },
        { who: '{木村|きむら}', voice: 'ja-nu', text: 'いいえ、ありませんでした。{自由|じゆう}でしたから、{毎日|まいにち}{好|す}きな{服|ふく}を{着|き}ました。でも、アルバイトはしてはいけませんでした。', ro: 'Iie, arimasen deshita. Jiyuu deshita kara, mainichi suki na fuku o kimashita. Demo, arubaito wa shite wa ikemasen deshita.', vi: 'Không, không có. Tự do nên ngày nào tôi cũng mặc quần áo mình thích. Nhưng làm thêm thì không được.' },
        { who: 'カルロス', voice: 'ja-nam', text: 'そうなんですか。{私|わたし}の{国|くに}と{反対|はんたい}ですね。', ro: 'Sou nan desu ka. Watashi no kuni to hantai desu ne.', vi: 'Vậy à. Ngược với nước tôi nhỉ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b14-ng-2-q',
      title: 'Câu hỏi bài 2 — chọn đáp án đúng',
      items: [
        { q: '1. ナタポンさんは{玄関|げんかん}で{靴|くつ}を……', options: ['{脱|ぬ}ぎます', '{脱|ぬ}ぎません'], correct: 0, why: 'Phải cởi (なければなりません); Natapon biết vì Thái cũng vậy → **{脱|ぬ}ぎます**.' },
        { q: '2. マリヤムさんは{今日|きょう}、ペットボトルを……', options: ['{捨|す}てます', '{捨|す}てません'], correct: 1, why: 'ペットボトルは{捨|す}ててはいけません → {来週|らいしゅう}{捨|す}てます. Hôm nay **{捨|す}てません**.' },
        { q: '3. メアリーさんは{入場料|にゅうじょうりょう}を……', options: ['{払|はら}います', '{払|はら}いません'], correct: 1, why: '{払|はら}わなくてもいいです → **{払|はら}いません**.' },
        { q: '4. メアリーさんは{身分証|みぶんしょう}を……', options: ['{見|み}せました', '{見|み}せませんでした'], correct: 0, why: '{見|み}せなければなりませんか — はい、お{願|ねが}いします → **{見|み}せました**.' },
        { q: '5. {木村|きむら}さんは{高校生|こうこうせい}のとき、{制服|せいふく}を……', options: ['{着|き}ました', '{着|き}ませんでした'], correct: 1, why: '{制服|せいふく}はありませんでした → **{着|き}ませんでした**.' },
        { q: '6. {木村|きむら}さんは{高校生|こうこうせい}のとき、アルバイトを……', options: ['しました', 'しませんでした'], correct: 1, why: 'アルバイトは**してはいけませんでした** → しませんでした.' },
      ],
    },

    /* ── Bài 3 ── */
    { t: 'h', text: 'Bài 3 — Họ nói ý kiến gì? (やってみよう — điền lời)' },
    {
      t: 'p',
      text: 'Nghe ba cuộc trò chuyện về ba đề tài. Sau đó gõ lại đúng phần còn thiếu trong câu ý kiến của từng người (gõ chữ Hán hoặc kana đều được).',
    },
    {
      t: 'listen',
      id: 'b14-ng-3a',
      title: 'Đề tài 1 — Tàu điện ở Nhật',
      lines: [
        { who: 'メアリー', voice: 'ja-nu', text: 'カルロスさん、{日本|にほん}の{電車|でんしゃ}についてどう{思|おも}いますか。', ro: 'Karurosu-san, Nihon no densha ni tsuite dou omoimasu ka.', vi: 'Carlos, anh nghĩ sao về tàu điện ở Nhật?' },
        { who: 'カルロス', voice: 'ja-nam', text: '{時間|じかん}に{遅|おく}れませんから、{便利|べんり}だと{思|おも}います。', ro: 'Jikan ni okuremasen kara, benri da to omoimasu.', vi: 'Vì không bao giờ trễ giờ nên tôi nghĩ là tiện.' },
        { who: 'メアリー', voice: 'ja-nu', text: 'そうですね。でも、{朝|あさ}は{人|ひと}が{多|おお}くて、{大変|たいへん}だと{思|おも}います。', ro: 'Sou desu ne. Demo, asa wa hito ga ookute, taihen da to omoimasu.', vi: 'Ừ nhỉ. Nhưng buổi sáng đông người, tôi nghĩ là vất vả.' },
      ],
    },
    {
      t: 'listen',
      id: 'b14-ng-3b',
      title: 'Đề tài 2 — Đồ ăn nhanh',
      lines: [
        { who: 'パク', voice: 'ja-nu', text: 'マルコさん、ファストフードは{好|す}きですか。', ro: 'Maruko-san, fasuto fuudo wa suki desu ka.', vi: 'Marco, cậu thích đồ ăn nhanh không?' },
        { who: 'マルコ', voice: 'ja-nam', text: 'うーん。{安|やす}くて{便利|べんり}ですが、{体|からだ}によくないと{思|おも}います。', ro: 'Uun. Yasukute benri desu ga, karada ni yokunai to omoimasu.', vi: 'Ừm. Rẻ và tiện, nhưng mình nghĩ không tốt cho cơ thể.' },
        { who: 'パク', voice: 'ja-nu', text: '{私|わたし}もそう{思|おも}います。', ro: 'Watashi mo sou omoimasu.', vi: 'Mình cũng nghĩ vậy.' },
      ],
    },
    {
      t: 'listen',
      id: 'b14-ng-3c',
      title: 'Đề tài 3 — Tour trọn gói hay gói tự do',
      lines: [
        { who: 'ダニエル', voice: 'ja-nam', text: '{私|わたし}はフリープランのほうがいいと{思|おも}います。{自分|じぶん}で{行|い}きたいところへ{行|い}くことができますから。', ro: 'Watashi wa furii puran no hou ga ii to omoimasu. Jibun de ikitai tokoro e iku koto ga dekimasu kara.', vi: 'Tôi nghĩ gói tự do tốt hơn. Vì mình có thể tự đi đến chỗ mình muốn.' },
        { who: '{木村|きむら}', voice: 'ja-nu', text: '{私|わたし}はツアーのほうがいいと{思|おも}います。ツアーは{自分|じぶん}でホテルを{予約|よやく}しなくてもいいですから、{楽|らく}です。', ro: 'Watashi wa tsuaa no hou ga ii to omoimasu. Tsuaa wa jibun de hoteru o yoyaku shinakute mo ii desu kara, raku desu.', vi: 'Tôi thì nghĩ tour trọn gói tốt hơn. Vì đi tour không cần tự đặt khách sạn nên nhàn.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b14-ng-3-q',
      title: 'Điền phần còn thiếu (theo bài nghe)',
      kind: 'fill',
      grammar: '普通形と思います · ～から (lý do) · ～のほうがいいと思います',
      items: [
        { q: 'カルロス：{時間|じかん}に{遅|おく}れませんから、＿＿と{思|おも}います。', answers: V('{便利|べんり}だ'), hint: 'tiện — ナA + だ' },
        { q: 'メアリー：{朝|あさ}は{人|ひと}が{多|おお}くて、＿＿と{思|おも}います。', answers: V('{大変|たいへん}だ'), hint: 'vất vả — ナA + だ' },
        { q: 'マルコ：{安|やす}くて{便利|べんり}ですが、{体|からだ}に＿＿と{思|おも}います。', answers: V('よくない'), hint: 'không tốt — いい → よくない' },
        { q: 'パク：{私|わたし}も＿＿{思|おも}います。', answers: V('そう'), hint: 'tôi cũng nghĩ VẬY' },
        { q: 'ダニエル：{私|わたし}は＿＿のほうがいいと{思|おも}います。', answers: V('フリープラン'), hint: 'gói tự do' },
        { q: '{木村|きむら}：ツアーは{自分|じぶん}でホテルを＿＿から、{楽|らく}です。', answers: V('{予約|よやく}しなくてもいいです'), hint: 'không cần đặt — ～なくてもいいです' },
      ],
    },

    /* ── Bài 4 ── */
    { t: 'h', text: 'Bài 4 — Hội thoại dài: ở ga và trên tàu (もう{一度|いちど}{聞|き}こう)' },
    {
      t: 'p',
      text: 'Natapon và Park đi chơi cùng nhau. Ba cảnh: **trước ga** (xe đạp), **chỗ bán vé** (thẻ đi tàu), **trên tàu** (điện thoại và ý kiến). Nghe cả bài, rồi trả lời câu hỏi.',
    },
    {
      t: 'listen',
      id: 'b14-ng-4',
      title: 'Natapon và Park — một buổi đi tàu',
      note: 'Bắt: không được làm gì, phải làm gì, không cần làm gì; bấm cái gì thì cái gì ra; hai người nghĩ gì về điện thoại.',
      lines: [
        { who: 'パク', voice: 'ja-nu', text: 'ナタポンさん、あ、そこに{自転車|じてんしゃ}を{止|と}めてはいけませんよ。', ro: 'Natapon-san, a, soko ni jitensha o tomete wa ikemasen yo.', vi: 'Natapon, ấy, không được để xe đạp ở đó đâu.' },
        { who: 'ナタポン', voice: 'ja-nam', text: 'えっ、そうなんですか。', ro: 'E, sou nan desu ka.', vi: 'Ơ, vậy à?' },
        { who: 'パク', voice: 'ja-nu', text: 'ほら、あれ。{自転車|じてんしゃ}はあそこの{駐輪場|ちゅうりんじょう}に{止|と}めなければなりません。{一日|いちにち}{100円|ひゃくえん}です。', ro: 'Hora, are. Jitensha wa asoko no chuurinjou ni tomenakereba narimasen. Ichinichi hyaku en desu.', vi: 'Kìa, cái kia. Xe đạp phải để ở bãi xe đạp đằng kia. Một ngày 100 yên.' },
        { who: 'ナタポン', voice: 'ja-nam', text: 'あ、{本当|ほんとう}だ。{止|と}めてきます。', ro: 'A, hontou da. Tomete kimasu.', vi: 'A, thật. Mình đi để xe rồi quay lại.' },
        { who: 'ナタポン', voice: 'ja-nam', text: '（{切符売|きっぷう}り{場|ば}で）パクさんは{切符|きっぷ}を{買|か}いませんか。', ro: '(Kippu uriba de) Paku-san wa kippu o kaimasen ka.', vi: '(Ở chỗ bán vé) Park không mua vé à?' },
        { who: 'パク', voice: 'ja-nu', text: 'はい。このカードがありますから、{切符|きっぷ}を{買|か}わなくてもいいです。カードを{機械|きかい}にタッチすると、ドアが{開|あ}きます。', ro: 'Hai. Kono kaado ga arimasu kara, kippu o kawanakute mo ii desu. Kaado o kikai ni tatchi suru to, doa ga akimasu.', vi: 'Ừ. Mình có thẻ này nên không cần mua vé. Chạm thẻ vào máy thì cửa mở.' },
        { who: 'ナタポン', voice: 'ja-nam', text: '{便利|べんり}ですね。どこで{買|か}うことができますか。', ro: 'Benri desu ne. Doko de kau koto ga dekimasu ka.', vi: 'Tiện nhỉ. Mua được ở đâu?' },
        { who: 'パク', voice: 'ja-nu', text: 'この{機械|きかい}です。{緑|みどり}のボタンを{押|お}して、お{金|かね}を{入|い}れると、カードが{出|で}ますよ。', ro: 'Kono kikai desu. Midori no botan o oshite, okane o ireru to, kaado ga demasu yo.', vi: 'Máy này. Bấm nút xanh lá rồi cho tiền vào thì thẻ ra đấy.' },
        { who: 'ナタポン', voice: 'ja-nam', text: '（{電車|でんしゃ}の{中|なか}で・{電話|でんわ}が{鳴|な}ります）はい、もしもし。', ro: '(Densha no naka de, denwa ga narimasu) Hai, moshi moshi.', vi: '(Trên tàu, điện thoại reo) Vâng, alô.' },
        { who: 'パク', voice: 'ja-nu', text: 'ナタポンさん、{電車|でんしゃ}の{中|なか}で{電話|でんわ}で{話|はな}してはいけませんよ。', ro: 'Natapon-san, densha no naka de denwa de hanashite wa ikemasen yo.', vi: 'Natapon, trên tàu không được nói điện thoại đâu.' },
        { who: 'ナタポン', voice: 'ja-nam', text: 'あ、すみません。……{日本|にほん}の{電車|でんしゃ}は{静|しず}かですね。{私|わたし}の{国|くに}の{電車|でんしゃ}はにぎやかですから、びっくりしました。', ro: 'A, sumimasen. …… Nihon no densha wa shizuka desu ne. Watashi no kuni no densha wa nigiyaka desu kara, bikkuri shimashita.', vi: 'À, xin lỗi. …… Tàu ở Nhật yên tĩnh nhỉ. Tàu ở nước mình náo nhiệt nên mình ngạc nhiên quá.' },
        { who: 'パク', voice: 'ja-nu', text: 'そうですか。{私|わたし}は{静|しず}かなほうがいいと{思|おも}います。{本|ほん}を{読|よ}むことができますから。', ro: 'Sou desu ka. Watashi wa shizuka na hou ga ii to omoimasu. Hon o yomu koto ga dekimasu kara.', vi: 'Vậy à. Mình thì nghĩ yên tĩnh thì tốt hơn. Vì có thể đọc sách.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b14-ng-4-q',
      title: 'Câu hỏi bài 4',
      items: [
        { q: 'ナタポンさんは{自転車|じてんしゃ}をどこに{止|と}めましたか。', options: ['{駅|えき}の{前|まえ}', '{駐輪場|ちゅうりんじょう}', 'コンビニの{前|まえ}', '{止|と}めませんでした'], correct: 1, why: '{駐輪場|ちゅうりんじょう}に{止|と}めなければなりません → {止|と}めてきます.' },
        { q: 'パクさんはどうして{切符|きっぷ}を{買|か}いませんか。', options: ['お{金|かね}がありませんから', 'カードがありますから', '{電車|でんしゃ}に{乗|の}りませんから', '{切符|きっぷ}は{高|たか}いですから'], correct: 1, why: 'このカードがありますから、{切符|きっぷ}を{買|か}わなくてもいいです.' },
        { q: 'カードはどうやって{買|か}いますか。', options: ['お{金|かね}を{入|い}れて、レバーを{回|まわ}します', '{緑|みどり}のボタンを{押|お}して、お{金|かね}を{入|い}れます', '{赤|あか}いボタンを{押|お}します', '{駅|えき}の{人|ひと}に{言|い}います'], correct: 1, why: '{緑|みどり}のボタンを{押|お}して、お{金|かね}を{入|い}れると、カードが{出|で}ます.' },
        { q: 'パクさんは{日本|にほん}の{電車|でんしゃ}についてどう{思|おも}っていますか。', options: ['うるさいと{思|おも}っています', 'にぎやかなほうがいいと{思|おも}っています', '{静|しず}かなほうがいいと{思|おも}っています', '{不便|ふべん}だと{思|おも}っています'], correct: 2, why: '{私|わたし}は{静|しず}かなほうがいいと{思|おも}います — lý do: {本|ほん}を{読|よ}むことができますから. (Natapon chỉ nói mình ngạc nhiên vì tàu ở nước mình náo nhiệt.)' },
      ],
    },

    /* ── Bài 5 ── */
    { t: 'h', text: 'Bài 5 — Được, không được, phải hay không cần? (thông báo)' },
    {
      t: 'p',
      text: 'Nghe thông báo của nhân viên ở cửa một **suối nước nóng** ({温泉|おんせん}). Với mỗi việc, chọn: **ⓐ được làm** · **ⓑ không được làm** · **ⓒ phải làm** · **ⓓ không cần làm**.',
    },
    {
      t: 'listen',
      id: 'b14-ng-5',
      title: 'Thông báo ở suối nước nóng',
      lines: [
        { who: '{係|かかり}の{人|ひと}', voice: 'ja-nam', text: '{皆|みな}さん、ようこそ。{中|なか}に{入|はい}る{前|まえ}に、{説明|せつめい}をよく{聞|き}いてください。', ro: 'Minasan, youkoso. Naka ni hairu mae ni, setsumei o yoku kiite kudasai.', vi: 'Chào mừng quý khách. Trước khi vào, xin nghe kỹ phần giải thích.' },
        { who: '{係|かかり}の{人|ひと}', voice: 'ja-nam', text: 'まず、{玄関|げんかん}で{靴|くつ}を{脱|ぬ}がなければなりません。タオルは{中|なか}にありますから、{持|も}ってこなくてもいいです。', ro: 'Mazu, genkan de kutsu o nuganakereba narimasen. Taoru wa naka ni arimasu kara, motte konakute mo ii desu.', vi: 'Trước hết, phải cởi giày ở lối vào. Khăn có sẵn bên trong nên không cần mang theo.' },
        { who: '{係|かかり}の{人|ひと}', voice: 'ja-nam', text: 'お{湯|ゆ}に{入|はい}る{前|まえ}に、{体|からだ}を{洗|あら}わなければなりません。お{湯|ゆ}の{中|なか}でタオルを{使|つか}ってはいけません。', ro: 'Oyu ni hairu mae ni, karada o arawanakereba narimasen. Oyu no naka de taoru o tsukatte wa ikemasen.', vi: 'Trước khi vào bồn, phải tắm rửa cơ thể. Trong bồn nước nóng không được dùng khăn.' },
        { who: '{係|かかり}の{人|ひと}', voice: 'ja-nam', text: '{中|なか}で{写真|しゃしん}を{撮|と}ってはいけません。{外|そと}の{庭|にわ}では{撮|と}ってもいいですよ。', ro: 'Naka de shashin o totte wa ikemasen. Soto no niwa de wa totte mo ii desu yo.', vi: 'Bên trong không được chụp ảnh. Ở vườn bên ngoài thì chụp được.' },
        { who: '{係|かかり}の{人|ひと}', voice: 'ja-nam', text: '{小学生|しょうがくせい}{以下|いか}のお{子|こ}さんは{料金|りょうきん}を{払|はら}わなくてもいいです。では、ごゆっくりどうぞ。', ro: 'Shougakusei ika no okosan wa ryoukin o harawanakute mo ii desu. Dewa, goyukkuri douzo.', vi: 'Trẻ em từ tiểu học trở xuống không cần trả phí. Xin mời quý khách thư giãn.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b14-ng-5-q',
      title: 'Câu hỏi bài 5',
      items: [
        { q: '{玄関|げんかん}で{靴|くつ}を{脱|ぬ}ぎます。', options: ['ⓐ được', 'ⓑ không được', 'ⓒ phải', 'ⓓ không cần'], correct: 2, why: '{脱|ぬ}が**なければなりません** → phải.' },
        { q: 'タオルを{持|も}ってきます。', options: ['ⓐ được', 'ⓑ không được', 'ⓒ phải', 'ⓓ không cần'], correct: 3, why: '{持|も}ってこ**なくてもいいです** → không cần.' },
        { q: 'お{湯|ゆ}に{入|はい}る{前|まえ}に、{体|からだ}を{洗|あら}います。', options: ['ⓐ được', 'ⓑ không được', 'ⓒ phải', 'ⓓ không cần'], correct: 2, why: '{洗|あら}わ**なければなりません** → phải.' },
        { q: 'お{湯|ゆ}の{中|なか}でタオルを{使|つか}います。', options: ['ⓐ được', 'ⓑ không được', 'ⓒ phải', 'ⓓ không cần'], correct: 1, why: '{使|つか}って**はいけません** → không được.' },
        { q: '{外|そと}の{庭|にわ}で{写真|しゃしん}を{撮|と}ります。', options: ['ⓐ được', 'ⓑ không được', 'ⓒ phải', 'ⓓ không cần'], correct: 0, why: '{外|そと}の{庭|にわ}では{撮|と}って**もいいです** → được. (Bên trong mới cấm.)' },
        { q: '{小学生|しょうがくせい}は{料金|りょうきん}を{払|はら}います。', options: ['ⓐ được', 'ⓑ không được', 'ⓒ phải', 'ⓓ không cần'], correct: 3, why: '{小学生|しょうがくせい}{以下|いか}は{払|はら}わ**なくてもいいです** → không cần.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 6. NÓI ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b14-noi',
  kind: 'speaking',
  title: 'Luyện nói — câu hỏi thi về luật lệ, phong tục, ý kiến, cách nói',
  goal: 'Trả lời trọn câu, đúng trợ từ các câu hỏi thi liên quan Bài 14 (～なければなりませんか, ～てもいいですか, ～についてどう思いますか, どちらがいいと思いますか, ～語で何と言いますか), nhìn tranh biển báo / máy móc mà trả lời, đóng vai nhắc luật và giải thích cách dùng, và đọc to trôi chảy.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Đề thi nói JPD (theo "Hướng dẫn ôn thi" của bộ môn) — Bài 14 nằm ở đâu',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 14 xuất hiện ở đâu'],
      rows: [
        ['Reading', '40', 'Chuẩn bị 30 giây, đọc to đoạn ~100–110 chữ (4 từ chữ Hán gạch chân, 4 từ katakana, 70–80 chữ hiragana).', 'Đoạn kể phong tục, luật lệ, ý kiến: {習慣|しゅうかん}, {玄関|げんかん}, {料金|りょうきん}, {田舎|いなか}, シートベルト, ヘルメット…'],
        ['Talking — có tranh', '3 × 15', 'Nhìn tranh (biển báo, máy móc, đồ vật…) trả lời 3 câu.', 'ここで～てもいいですか · ～なければなりませんか · どうすると～が{出|で}ますか · これは{何|なん}ですか'],
        ['Talking — không tranh', '1 × 10', 'Trả lời 1 câu về bản thân / ý kiến.', '～についてどう{思|おも}いますか · どちらがいいと{思|おも}いますか · ～{語|ご}で{何|なん}と{言|い}いますか'],
        ['Presenting', '5', 'Chào khi vào và khi ra.', 'しつれいします／ありがとうございました。'],
      ],
    },
    {
      t: 'note',
      title: 'Luật chấm cần nhớ (trừ điểm thật)',
      items: [
        '**Sai trợ từ: −2 điểm** mỗi lỗi. Bài 14 soát kỹ: {料金|りょうきん}**を**{払|はら}います, {作品|さくひん}**に**{触|さわ}ります, {駐輪場|ちゅうりんじょう}**に**{止|と}めます, **{英語|えいご}で**{何|なん}と; ～について.',
        '**Câu có/không quên はい／いいえ**: bị trừ. 「～なければなりませんか」 → **はい、～なければなりません／いいえ、～なくてもいいです**.',
        '**Sai nội dung = mất trọn câu**: hỏi "phải không" mà đáp "không được" (いいえ、～てはいけません) là SAI nghĩa; hỏi どう{思|おも}いますか mà chỉ đáp はい.',
        'Ý kiến: **だ** trước と{思|おも}います với tính từ な và danh từ ({便利|べんり}**だ**と, {大変|たいへん}**だ**と). Thiếu だ bị tính lỗi ngữ pháp.',
        'Quên từ khi thi → hỏi lại ngay bằng mẫu của bài: **すみません、「…」は{日本語|にほんご}で{何|なん}と{言|い}いますか** (vẫn được tính là giao tiếp).',
      ],
    },

    /* ── Không tranh ① ── */
    { t: 'h', text: 'Câu hỏi không tranh ① — Phải / không cần / không được (luật lệ của bạn)' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: なければなりませんか／てもいいですか',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{毎朝|まいあさ}{何時|なんじ}に{起|お}きなければなりませんか。', ro: 'Maiasa nanji ni okinakereba narimasen ka.', vi: 'Sáng nào em phải dậy lúc mấy giờ?' },
        { who: 'Bạn', role: 'candidate', text: '{6時|ろくじ}に{起|お}きなければなりません。{授業|じゅぎょう}は{7時|しちじ}{半|はん}からですから。', ro: 'Rokuji ni okinakereba narimasen. Jugyou wa shichiji han kara desu kara.', vi: 'Em phải dậy lúc 6 giờ. Vì học bắt đầu từ 7 giờ rưỡi.' },
        { who: 'Giám thị', role: 'examiner', text: 'あなたの{学校|がっこう}では{制服|せいふく}を{着|き}なければなりませんか。', ro: 'Anata no gakkou de wa seifuku o kinakereba narimasen ka.', vi: 'Ở trường em có phải mặc đồng phục không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{着|き}なくてもいいです。でも、{月曜日|げつようび}は{着|き}なければなりません。', ro: 'Iie, kinakute mo ii desu. Demo, getsuyoubi wa kinakereba narimasen.', vi: 'Không ạ, không cần mặc. Nhưng thứ Hai thì phải mặc.' },
        { who: 'Giám thị', role: 'examiner', text: '{明日|あした}、{学校|がっこう}へ{来|こ}なければなりませんか。', ro: 'Ashita, gakkou e konakereba narimasen ka.', vi: 'Mai em có phải đến trường không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{来|こ}なければなりません。{授業|じゅぎょう}がありますから。', ro: 'Hai, konakereba narimasen. Jugyou ga arimasu kara.', vi: 'Có ạ, em phải đến. Vì có tiết học.' },
        { who: 'Giám thị', role: 'examiner', text: '{教室|きょうしつ}で{食|た}べ{物|もの}を{食|た}べてもいいですか。', ro: 'Kyoushitsu de tabemono o tabete mo ii desu ka.', vi: 'Trong lớp học có được ăn không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{食|た}べてはいけません。でも、{水|みず}は{飲|の}んでもいいです。', ro: 'Iie, tabete wa ikemasen. Demo, mizu wa nonde mo ii desu.', vi: 'Không ạ, không được ăn. Nhưng uống nước thì được.' },
        { who: 'Giám thị', role: 'examiner', text: 'ベトナムでは、バイクに{乗|の}るとき、ヘルメットをかぶらなければなりませんか。', ro: 'Betonamu de wa, baiku ni noru toki, herumetto o kaburanakereba narimasen ka.', vi: 'Ở Việt Nam, khi đi xe máy có phải đội mũ bảo hiểm không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、かぶらなければなりません。', ro: 'Hai, kaburanakereba narimasen.', vi: 'Có ạ, phải đội.' },
        { who: 'Giám thị', role: 'examiner', text: 'ベトナムの{家|いえ}では、{靴|くつ}を{脱|ぬ}がなければなりませんか。', ro: 'Betonamu no ie de wa, kutsu o nuganakereba narimasen ka.', vi: 'Ở nhà người Việt có phải cởi giày không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、たいてい{脱|ぬ}がなければなりません。{日本|にほん}と{同|おな}じです。', ro: 'Hai, taitei nuganakereba narimasen. Nihon to onaji desu.', vi: 'Có ạ, thường là phải cởi. Giống Nhật ạ.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở câu なければなりませんか',
      items: [
        '"Không cần" = **いいえ、～なくてもいいです**. ~~いいえ、～なければなりません~~ = ngược nghĩa; ~~いいえ、～てはいけません~~ = "không được", sai nghĩa.',
        'Thêm một câu lý do (～から) hoặc ngoại lệ (でも、～は…) để câu trả lời dài và ghi điểm.',
        'Chia đúng thể ない trước khi ghép: {着|き}ます → {着|き}**な**ければ (nhóm 2), {来|き}ます → **{来|こ}**なければ, かぶります → かぶ**ら**なければ.',
      ],
    },

    /* ── Không tranh ② ── */
    { t: 'h', text: 'Câu hỏi không tranh ② — Ý kiến (～と思います)' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: ～についてどう思いますか／どちらがいいと思いますか',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{日本語|にほんご}の{勉強|べんきょう}についてどう{思|おも}いますか。', ro: 'Nihongo no benkyou ni tsuite dou omoimasu ka.', vi: 'Em nghĩ sao về việc học tiếng Nhật?' },
        { who: 'Bạn', role: 'candidate', text: 'おもしろいですが、{漢字|かんじ}は{難|むずか}しいと{思|おも}います。', ro: 'Omoshiroi desu ga, kanji wa muzukashii to omoimasu.', vi: 'Thú vị nhưng em nghĩ chữ Hán khó ạ.' },
        { who: 'Giám thị', role: 'examiner', text: 'ハノイの{交通|こうつう}についてどう{思|おも}いますか。', ro: 'Hanoi no koutsuu ni tsuite dou omoimasu ka.', vi: 'Em nghĩ sao về giao thông Hà Nội?' },
        { who: 'Bạn', role: 'candidate', text: 'バイクが{多|おお}くて、{少|すこ}し{危|あぶ}ないと{思|おも}います。', ro: 'Baiku ga ookute, sukoshi abunai to omoimasu.', vi: 'Nhiều xe máy, em nghĩ hơi nguy hiểm.' },
        { who: 'Giám thị', role: 'examiner', text: '{田舎|いなか}と{都会|とかい}とどちらがいいと{思|おも}いますか。', ro: 'Inaka to tokai to dochira ga ii to omoimasu ka.', vi: 'Nông thôn và thành phố, em nghĩ bên nào tốt hơn?' },
        { who: 'Bạn', role: 'candidate', text: '{仕事|しごと}がたくさんありますから、{都会|とかい}のほうがいいと{思|おも}います。', ro: 'Shigoto ga takusan arimasu kara, tokai no hou ga ii to omoimasu.', vi: 'Vì có nhiều việc làm, em nghĩ thành phố tốt hơn.' },
        { who: 'Giám thị', role: 'examiner', text: '{電話|でんわ}とメールとどちらが{便利|べんり}だと{思|おも}いますか。', ro: 'Denwa to meeru to dochira ga benri da to omoimasu ka.', vi: 'Gọi điện và nhắn tin, cái nào tiện hơn?' },
        { who: 'Bạn', role: 'candidate', text: 'いつでも{送|おく}ることができますから、メールのほうが{便利|べんり}だと{思|おも}います。', ro: 'Itsudemo okuru koto ga dekimasu kara, meeru no hou ga benri da to omoimasu.', vi: 'Vì lúc nào cũng gửi được, em nghĩ nhắn tin tiện hơn.' },
        { who: 'Giám thị', role: 'examiner', text: '{高校生|こうこうせい}がアルバイトをすることについてどう{思|おも}いますか。', ro: 'Koukousei ga arubaito o suru koto ni tsuite dou omoimasu ka.', vi: 'Em nghĩ sao về việc học sinh cấp 3 đi làm thêm?' },
        { who: 'Bạn', role: 'candidate', text: 'いい{経験|けいけん}になりますが、{勉強|べんきょう}が{大切|たいせつ}ですから、しないほうがいいと{思|おも}います。', ro: 'Ii keiken ni narimasu ga, benkyou ga taisetsu desu kara, shinai hou ga ii to omoimasu.', vi: 'Là trải nghiệm tốt nhưng việc học quan trọng, nên em nghĩ không làm thì hơn.' },
        { who: 'Giám thị', role: 'examiner', text: 'ファストフードについてどう{思|おも}いますか。', ro: 'Fasuto fuudo ni tsuite dou omoimasu ka.', vi: 'Em nghĩ sao về đồ ăn nhanh?' },
        { who: 'Bạn', role: 'candidate', text: '{便利|べんり}ですが、{体|からだ}によくないと{思|おも}います。', ro: 'Benri desu ga, karada ni yokunai to omoimasu.', vi: 'Tiện nhưng em nghĩ không tốt cho cơ thể.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở nhóm này',
      items: [
        'Hỏi **どう{思|おも}いますか** → không mở đầu bằng はい／いいえ; đi thẳng vào ý kiến. Được mở bằng **うーん** hay **そうですね** để có thời gian nghĩ.',
        'Hỏi **どちらが** → trả lời bằng **N のほうが** + lý do **～から**. Đừng đáp cả hai (~~どちらもいいです~~ chỉ khi thật sự cần).',
        'Đồng ý với giám thị (khi giám thị nói ý kiến trước) → **{私|わたし}もそう{思|おも}います**.',
      ],
    },

    /* ── Không tranh ③ ── */
    { t: 'h', text: 'Câu hỏi không tranh ③ — Cách nói, đồ vật, bữa ăn' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: と言います, ものです, いただきます',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '「ありがとう」はベトナム{語|ご}で{何|なん}と{言|い}いますか。', ro: '"Arigatou" wa Betonamugo de nan to iimasu ka.', vi: '"Arigatou" tiếng Việt nói thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '「cảm ơn」と{言|い}います。', ro: '"Cảm ơn" to iimasu.', vi: 'Nói là "cảm ơn" ạ.' },
        { who: 'Giám thị', role: 'examiner', text: '「おいしい」はベトナム{語|ご}で{何|なん}と{言|い}いますか。', ro: '"Oishii" wa Betonamugo de nan to iimasu ka.', vi: '"Oishii" tiếng Việt nói thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '「ngon」と{言|い}います。', ro: '"Ngon" to iimasu.', vi: 'Nói là "ngon" ạ.' },
        { who: 'Giám thị', role: 'examiner', text: 'ご{飯|はん}を{食|た}べる{前|まえ}に、{何|なん}と{言|い}いますか。', ro: 'Gohan o taberu mae ni, nan to iimasu ka.', vi: 'Trước khi ăn cơm em nói gì?' },
        { who: 'Bạn', role: 'candidate', text: '「いただきます」と{言|い}います。{食|た}べたあとで、「ごちそうさまでした」と{言|い}います。', ro: '"Itadakimasu" to iimasu. Tabeta ato de, "gochisousama deshita" to iimasu.', vi: 'Nói "itadakimasu" ạ. Ăn xong thì nói "gochisousama deshita".' },
        { who: 'Giám thị', role: 'examiner', text: 'ベトナムの{便利|べんり}なものを{紹介|しょうかい}してください。', ro: 'Betonamu no benri na mono o shoukai shite kudasai.', vi: 'Hãy giới thiệu một đồ vật tiện lợi của Việt Nam.' },
        { who: 'Bạn', role: 'candidate', text: '「ノンラー」です。ベトナムの{帽子|ぼうし}です。{暑|あつ}いとき、{使|つか}うものです。かぶると、{涼|すず}しいです。{雨|あめ}のときも{使|つか}うことができます。', ro: '"Nonlaa" desu. Betonamu no boushi desu. Atsui toki, tsukau mono desu. Kaburu to, suzushii desu. Ame no toki mo tsukau koto ga dekimasu.', vi: 'Là "nón lá" ạ. Mũ của Việt Nam. Là đồ dùng khi trời nóng. Đội vào thì mát. Lúc mưa cũng dùng được.' },
        { who: 'Giám thị', role: 'examiner', text: '{日本|にほん}の{習慣|しゅうかん}で、{何|なに}がおもしろいと{思|おも}いますか。', ro: 'Nihon no shuukan de, nani ga omoshiroi to omoimasu ka.', vi: 'Trong phong tục Nhật, em thấy cái gì thú vị?' },
        { who: 'Bạn', role: 'candidate', text: 'ごみを{分|わ}ける{習慣|しゅうかん}がおもしろいと{思|おも}います。{少|すこ}し{大変|たいへん}ですが、いい{習慣|しゅうかん}だと{思|おも}います。', ro: 'Gomi o wakeru shuukan ga omoshiroi to omoimasu. Sukoshi taihen desu ga, ii shuukan da to omoimasu.', vi: 'Em thấy phong tục phân loại rác thú vị. Hơi vất vả nhưng em nghĩ là thói quen tốt.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở nhóm này',
      items: [
        '**～{語|ご}で{何|なん}と{言|い}いますか** → **「…」と{言|い}います**: nhớ chữ **と**. Từ tiếng Việt đọc to rõ trong 「 」.',
        'Giới thiệu đồ vật: 3 câu là đủ — **N です** → **～とき、{使|つか}うものです** → **～と、～** (ポイント 113).',
        'Câu hỏi dài, không nghe kịp → xin **もう{一度|いちど}お{願|ねが}いします** (tối đa 2 lần, không bị trừ điểm).',
      ],
    },

    /* ── Có tranh ── */
    { t: 'h', text: 'Câu hỏi có tranh — biển báo, máy móc, đồ vật' },
    {
      t: 'p',
      text: 'Tranh thi được viết lại thành bảng (không dùng ảnh). Với tranh Bài 14, giám thị hay hỏi: **ここで～てもいいですか · ここで何をしてはいけませんか · ～なければなりませんか · どうすると～が{出|で}ますか · これは{何|なん}ですか／いつ{使|つか}いますか**.',
    },
    {
      t: 'table',
      caption: 'Tranh 1 — cửa bảo tàng mỹ thuật',
      head: ['Biển', 'Ý nghĩa'],
      rows: [
        ['📷 gạch chéo', 'Không chụp ảnh'],
        ['✋ gạch chéo', 'Không sờ vào tác phẩm'],
        ['🚲 gạch chéo + mũi tên 駐輪場', 'Không để xe đạp ở đây — để ở bãi xe đạp'],
        ['入場料 大人 500円 · 高校生以下 無料', 'Người lớn 500 yên, từ học sinh cấp 3 trở xuống miễn phí'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 1 — hỏi – đáp',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'ここで{写真|しゃしん}を{撮|と}ってもいいですか。', ro: 'Koko de shashin o totte mo ii desu ka.', vi: 'Ở đây chụp ảnh được không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{撮|と}ってはいけません。', ro: 'Iie, totte wa ikemasen.', vi: 'Không ạ, không được chụp.' },
        { who: 'Giám thị', role: 'examiner', text: '{自転車|じてんしゃ}はどこに{止|と}めなければなりませんか。', ro: 'Jitensha wa doko ni tomenakereba narimasen ka.', vi: 'Xe đạp phải để ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: '{駐輪場|ちゅうりんじょう}に{止|と}めなければなりません。', ro: 'Chuurinjou ni tomenakereba narimasen.', vi: 'Phải để ở bãi xe đạp ạ.' },
        { who: 'Giám thị', role: 'examiner', text: '{高校生|こうこうせい}は{入場料|にゅうじょうりょう}を{払|はら}わなければなりませんか。', ro: 'Koukousei wa nyuujouryou o harawanakereba narimasen ka.', vi: 'Học sinh cấp 3 có phải trả phí vào cửa không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{払|はら}わなくてもいいです。', ro: 'Iie, harawanakute mo ii desu.', vi: 'Không ạ, không cần trả.' },
        { who: 'Giám thị', role: 'examiner', text: '{大人|おとな}の{入場料|にゅうじょうりょう}はいくらですか。', ro: 'Otona no nyuujouryou wa ikura desu ka.', vi: 'Phí vào cửa người lớn bao nhiêu?' },
        { who: 'Bạn', role: 'candidate', text: '{500円|ごひゃくえん}です。', ro: 'Gohyaku en desu.', vi: '500 yên ạ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh 2 — máy bán phiếu ăn',
      head: ['Phần của máy', 'Chuyện gì xảy ra'],
      rows: [
        ['Khe tiền (お金)', 'Cho tiền vào → nút sáng đèn'],
        ['Nút món ăn (ボタン)', 'Bấm → phiếu ăn (食券) ra'],
        ['Cần gạt (レバー)', 'Xoay → tiền thừa (お釣り) ra'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 2 — hỏi – đáp',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'これは{何|なん}ですか。', ro: 'Kore wa nan desu ka.', vi: 'Đây là cái gì?' },
        { who: 'Bạn', role: 'candidate', text: '{食券|しょっけん}の{機械|きかい}です。', ro: 'Shokken no kikai desu.', vi: 'Là máy bán phiếu ăn ạ.' },
        { who: 'Giám thị', role: 'examiner', text: 'どうすると、{食券|しょっけん}が{出|で}ますか。', ro: 'Dou suru to, shokken ga demasu ka.', vi: 'Làm thế nào thì phiếu ăn ra?' },
        { who: 'Bạn', role: 'candidate', text: 'お{金|かね}を{入|い}れて、ボタンを{押|お}すと、{食券|しょっけん}が{出|で}ます。', ro: 'Okane o irete, botan o osu to, shokken ga demasu.', vi: 'Cho tiền vào rồi bấm nút thì phiếu ăn ra ạ.' },
        { who: 'Giám thị', role: 'examiner', text: 'お{釣|つ}りはどうすると{出|で}ますか。', ro: 'Otsuri wa dou suru to demasu ka.', vi: 'Tiền thừa thì làm sao để ra?' },
        { who: 'Bạn', role: 'candidate', text: 'レバーを{回|まわ}すと、{出|で}ます。', ro: 'Rebaa o mawasu to, demasu.', vi: 'Xoay cần gạt thì ra ạ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh 3 — trong nhà người Nhật mùa đông',
      head: ['Đồ vật', 'Chi tiết'],
      rows: [
        ['こたつ', 'Bàn thấp phủ chăn, một gia đình ngồi cho chân vào'],
        ['{玄関|げんかん}', 'Nhiều đôi giày xếp ở lối vào'],
        ['{窓|まど}', 'Bên ngoài tuyết rơi'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 3 — hỏi – đáp',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'これは{何|なん}ですか。', ro: 'Kore wa nan desu ka.', vi: 'Đây là cái gì?' },
        { who: 'Bạn', role: 'candidate', text: 'こたつです。{冬|ふゆ}、{使|つか}うものです。', ro: 'Kotatsu desu. Fuyu, tsukau mono desu.', vi: 'Là bàn sưởi kotatsu. Đồ dùng vào mùa đông ạ.' },
        { who: 'Giám thị', role: 'examiner', text: 'こたつに{足|あし}を{入|い}れると、どうなりますか。', ro: 'Kotatsu ni ashi o ireru to, dou narimasu ka.', vi: 'Cho chân vào kotatsu thì sẽ thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{暖|あたた}かくなります。', ro: 'Atatakaku narimasu.', vi: 'Ấm lên ạ.' },
        { who: 'Giám thị', role: 'examiner', text: 'この{家|いえ}に{入|はい}るとき、{何|なに}をしなければなりませんか。', ro: 'Kono ie ni hairu toki, nani o shinakereba narimasen ka.', vi: 'Khi vào ngôi nhà này phải làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{玄関|げんかん}で{靴|くつ}を{脱|ぬ}がなければなりません。', ro: 'Genkan de kutsu o nuganakereba narimasen.', vi: 'Phải cởi giày ở lối vào ạ.' },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo cho câu có tranh',
      items: [
        'Biển cấm + "～てもいいですか" → **いいえ、～てはいけません**. Nếu tranh có chỗ khác được phép → thêm **N は（nơi）で～てください／～なければなりません**.',
        '"どうすると～が{出|で}ますか" → **～て、～と、～が{出|で}ます**: nói theo đúng thứ tự thao tác, động từ cuối ở thể từ điển + と.',
        '"どうなりますか" → trả lời bằng **～くなります／～になります** (Bài 10).',
        'Lặp lại đúng trợ từ của câu hỏi: {駐輪場|ちゅうりんじょう}**に**{止|と}めます, {入場料|にゅうじょうりょう}**を**{払|はら}います.',
      ],
    },

    /* ── Đóng vai ── */
    { t: 'h', text: 'Đóng vai — nhắc luật trước khi có rắc rối, giải thích cách dùng (luyện hai người)' },
    {
      t: 'dialogue',
      title: 'Vai 1 — A dẫn B (mới đến Nhật) đi chơi (ペアで話しましょう p.245)',
      lines: [
        { who: 'A', role: 'a', text: 'あ、Bさん、ここでたばこを{吸|す}ってはいけませんよ。', ro: 'A, B-san, koko de tabako o sutte wa ikemasen yo.', vi: 'Ấy B, ở đây không được hút thuốc đâu.' },
        { who: 'B', role: 'b', text: 'あっ、そうなんですか。', ro: 'A, sou nan desu ka.', vi: 'Ồ, vậy à?' },
        { who: 'A', role: 'a', text: 'ほら、あれ。たばこは{喫煙所|きつえんじょ}で{吸|す}わなければなりません。', ro: 'Hora, are. Tabako wa kitsuenjo de suwanakereba narimasen.', vi: 'Kìa, cái kia. Thuốc lá phải hút ở khu hút thuốc.' },
        { who: 'B', role: 'b', text: 'あっ、{本当|ほんとう}だ。{知|し}りませんでした。', ro: 'A, hontou da. Shirimasen deshita.', vi: 'A, thật. Tôi không biết.' },
        { who: 'A', role: 'a', text: 'それから、このごみは{分|わ}けなければなりません。これは「もえないごみ」ですよ。', ro: 'Sorekara, kono gomi wa wakenakereba narimasen. Kore wa "moenai gomi" desu yo.', vi: 'Còn nữa, rác này phải phân loại. Cái này là "rác không cháy được" đấy.' },
        { who: 'B', role: 'b', text: 'わかりました。きちんと{分|わ}けます。', ro: 'Wakarimashita. Kichinto wakemasu.', vi: 'Tôi hiểu rồi. Tôi sẽ phân loại cẩn thận.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Vai 2 — B không biết dùng máy, A giải thích (言ってみよう 1-1 p.240)',
      lines: [
        { who: 'B', role: 'b', text: 'あれ？{水|みず}が{出|で}ません。', ro: 'Are? Mizu ga demasen.', vi: 'Ơ? Nước không chảy.' },
        { who: 'A', role: 'a', text: 'あっ、ここに{手|て}を{出|だ}すと、{出|で}ますよ。', ro: 'A, koko ni te o dasu to, demasu yo.', vi: 'À, đưa tay ra chỗ này thì chảy đấy.' },
        { who: 'B', role: 'b', text: 'あ、{出|で}ました。どうもありがとうございます。……{電気|でんき}もつきませんね。', ro: 'A, demashita. Doumo arigatou gozaimasu. …… Denki mo tsukimasen ne.', vi: 'A, chảy rồi. Cảm ơn nhiều. …… Đèn cũng không sáng nhỉ.' },
        { who: 'A', role: 'a', text: 'そのボタンを{押|お}すと、つきますよ。', ro: 'Sono botan o osu to, tsukimasu yo.', vi: 'Bấm cái nút đó thì sáng đấy.' },
      ],
    },

    /* ── Reading ── */
    { t: 'h', text: 'Đọc to — Reading (40 điểm)' },
    {
      t: 'p',
      text: 'Đề đọc dài khoảng 100–110 ký tự: **4 từ chữ Hán** gạch chân (12đ), **4 từ katakana** (12đ), còn lại hiragana (16đ, sai một ký tự −0,2đ). 30 giây chuẩn bị. Bốn đoạn dưới đây viết đúng khuôn đó, chỉ dùng từ Bài 1–14. Tắt furigana khi đã quen (hoặc luyện ở **Chữ Hán · Đọc không furigana**).',
    },
    {
      t: 'examples',
      items: [
        {
          en: 'にほんのいえでは、{玄関|げんかん}でくつをぬがなければなりません。ごみはきちんとわけなければなりません。でんしゃのなかで、でんわではなしてはいけません。バスやタクシーでは、シートベルトをしなければなりません。わたしのくにとちがいますから、{最初|さいしょ}はびっくりしました。',
          ro: 'Nihon no ie de wa, genkan de kutsu o nuganakereba narimasen. Gomi wa kichinto wakenakereba narimasen. Densha no naka de, denwa de hanashite wa ikemasen. Basu ya takushii de wa, shiito beruto o shinakereba narimasen. Watashi no kuni to chigaimasu kara, saisho wa bikkuri shimashita.',
          vi: 'Ở nhà người Nhật phải cởi giày ở lối vào. Rác phải phân loại cẩn thận. Trên tàu không được nói điện thoại. Đi xe buýt, taxi phải thắt dây an toàn. Vì khác nước tôi nên lúc đầu tôi ngạc nhiên.',
        },
        {
          en: 'えきのちかくのうどんやには{食券|しょっけん}のきかいがあります。おかねをいれて、ボタンをおすと、しょっけんがでます。レバーをまわすと、おつりがでます。ふゆは、そばに{唐辛子|とうがらし}をいれると、からだがあたたかくなります。わたしはこのみせのそばがいちばんおいしいと{思|おも}います。',
          ro: 'Eki no chikaku no udon-ya ni wa shokken no kikai ga arimasu. Okane o irete, botan o osu to, shokken ga demasu. Rebaa o mawasu to, otsuri ga demasu. Fuyu wa, soba ni tougarashi o ireru to, karada ga atatakaku narimasu. Watashi wa kono mise no soba ga ichiban oishii to omoimasu.',
          vi: 'Quán udon gần ga có máy bán phiếu ăn. Cho tiền vào, bấm nút thì phiếu ra. Xoay cần gạt thì tiền thừa ra. Mùa đông, cho ớt vào soba thì người ấm lên. Tôi nghĩ soba quán này ngon nhất.',
        },
        {
          en: 'わたしは{田舎|いなか}のせいかつがすきです。{空気|くうき}がきれいで、しずかですから。でも、いなかは{交通|こうつう}がふべんです。バスもすくないです。ともだちはとかいのほうがいいといいます。コンビニやファストフードのみせがたくさんありますから。みなさんはどちらがいいと{思|おも}いますか。',
          ro: 'Watashi wa inaka no seikatsu ga suki desu. Kuuki ga kirei de, shizuka desu kara. Demo, inaka wa koutsuu ga fuben desu. Basu mo sukunai desu. Tomodachi wa tokai no hou ga ii to iimasu. Konbini ya fasuto fuudo no mise ga takusan arimasu kara. Minasan wa dochira ga ii to omoimasu ka.',
          vi: 'Tôi thích cuộc sống nông thôn. Vì không khí trong lành, yên tĩnh. Nhưng nông thôn đi lại bất tiện. Xe buýt cũng ít. Bạn tôi nói thành phố tốt hơn. Vì có nhiều cửa hàng tiện lợi và quán đồ ăn nhanh. Mọi người nghĩ bên nào tốt hơn?',
        },
        {
          en: 'この{美術館|びじゅつかん}は{高校生|こうこうせい}いかは{入場料|にゅうじょうりょう}をはらわなくてもいいです。でも、{身分証|みぶんしょう}をみせなければなりません。なかでしゃしんをとってはいけません。じてんしゃは{駐輪場|ちゅうりんじょう}にとめてください。パンフレットはいりぐちでもらうことができます。',
          ro: 'Kono bijutsukan wa koukousei ika wa nyuujouryou o harawanakute mo ii desu. Demo, mibunshou o misenakereba narimasen. Naka de shashin o totte wa ikemasen. Jitensha wa chuurinjou ni tomete kudasai. Panfuretto wa iriguchi de morau koto ga dekimasu.',
          vi: 'Bảo tàng này, từ học sinh cấp 3 trở xuống không cần trả phí vào cửa. Nhưng phải xuất trình giấy tờ tuỳ thân. Bên trong không được chụp ảnh. Xe đạp thì để ở bãi xe đạp. Tờ giới thiệu có thể nhận ở lối vào.',
        },
      ],
    },
    {
      t: 'note',
      title: 'Chỗ dễ đọc sai trong bốn đoạn trên',
      items: [
        '**玄関 げんかん**, **最初 さいしょ**, **食券 しょっけん**, **唐辛子 とうがらし**, **田舎 いなか**, **空気 くうき**, **交通 こうつう**, **美術館 びじゅつかん**, **入場料 にゅうじょうりょう**, **身分証 みぶんしょう**, **駐輪場 ちゅうりんじょう** — từ chữ Hán dạng đề thi.',
        'Katakana kéo dài / âm ngắt: シートベルト shiito beruto, タクシー takushii, レバー rebaa, ボタン, ファストフード fasuto fuudo, コンビニ, パンフレット panfuretto.',
        'Đọc liền các đuôi dài: ぬがなければなりません (nuganakereba narimasen), はなしてはいけません (hanashite wa ikemasen), はらわなくてもいいです (harawanakute mo ii desu).',
        'は đọc **wa**, を đọc **o**, へ đọc **e**: いえで**は**, はなして**は** (wa!), くつ**を**.',
      ],
    },

    /* ── Tự ghi âm ── */
    { t: 'h', text: 'Tự ghi âm — trả lời không nhìn đáp án' },
    {
      t: 'speak',
      id: 'b14-noi-ghi-am',
      part: '1',
      questions: [
        'まいあさ なんじに おきなければ なりませんか。',
        'あなたの がっこうでは せいふくを きなければ なりませんか。',
        'あした がっこうへ こなければ なりませんか。',
        'きょうしつで たべものを たべても いいですか。',
        'ベトナムの いえでは くつを ぬがなければ なりませんか。',
        'にほんごの べんきょうについて どう おもいますか。',
        'ハノイの こうつうについて どう おもいますか。',
        'いなかと とかいと どちらが いいと おもいますか。',
        'でんわと メールと どちらが べんりだと おもいますか。',
        '「ありがとう」は ベトナムごで なんと いいますか。',
        'ごはんを たべる まえに なんと いいますか。',
        'ベトナムの べんりな ものを しょうかいして ください。',
      ],
    },
  ],
};

/* ═══════════════════════════ 7. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b14-bai-tap',
  kind: 'homework',
  title: 'Bài tập về nhà — Bài 14 (có đáp án)',
  goal: 'Tự dịch, đổi dạng câu (と／てはいけません／なければなりません／なくてもいいです／と思います), chọn trợ từ – từ vựng – câu đáp và ghép câu Bài 14 không cần nhìn bài học.',
  minutes: 50,
  blocks: [
    {
      t: 'p',
      text: 'Gõ tiếng Nhật bằng bộ gõ (gõ romaji, máy đổi sang kana). Chữ Hán hay kana đều được chấp nhận; dấu câu và dấu cách không tính. Nếu máy chấm sai mà bạn tin mình đúng, bấm **Hỏi gia sư** ngay dưới câu đó.',
    },
    {
      t: 'quiz',
      id: 'b14-bt-dich',
      title: 'Dịch sang tiếng Nhật',
      kind: 'translate',
      grammar: 'V辞書形と、～ · Vてはいけません · Vなければなりません · Vなくてもいいです · 普通形と思います · ～についてどう思いますか · 「～」は～語で何と言いますか',
      items: [
        { q: 'Bấm nút này thì nước chảy ra.', answers: V('このボタンを{押|お}すと、{水|みず}が{出|で}ます。'), hint: 'ボタン, 押す + と, 水が出ます' },
        { q: 'Xoay cần gạt thì tiền thừa ra.', answers: V('レバーを{回|まわ}すと、お{釣|つ}りが{出|で}ます。', 'レバーを{回|まわ}すと、{釣|つ}りが{出|で}ます。'), hint: 'レバー, 回す, お釣り' },
        { q: 'Mở cửa thì đèn sáng.', answers: V('ドアを{開|あ}けると、{電気|でんき}がつきます。'), hint: 'ドアを開ける + と, 電気がつきます' },
        { q: 'Cho chân vào kotatsu thì ấm lên.', answers: V('こたつに{足|あし}を{入|い}れると、{暖|あたた}かくなります。'), hint: 'こたつ, 足, 入れる, 暖かくなります' },
        { q: 'Kotatsu là đồ dùng vào mùa đông.', answers: V('こたつは{冬|ふゆ}、{使|つか}うものです。', 'こたつは{冬|ふゆ}に{使|つか}うものです。'), hint: '冬, 使うもの' },
        { q: 'Không được đỗ xe đạp ở đây.', answers: V('ここに{自転車|じてんしゃ}を{止|と}めてはいけません。'), hint: '自転車, 止めます → 止めて + はいけません' },
        { q: 'Trên tàu không được nói chuyện điện thoại.', answers: V('{電車|でんしゃ}の{中|なか}で{電話|でんわ}で{話|はな}してはいけません。', '{電車|でんしゃ}の{中|なか}で{携帯電話|けいたいでんわ}を{使|つか}ってはいけません。', '{電車|でんしゃ}で{電話|でんわ}で{話|はな}してはいけません。'), hint: '電車の中で, 電話で話します' },
        { q: 'Không được sờ vào tác phẩm.', answers: V('{作品|さくひん}に{触|さわ}ってはいけません。'), hint: '作品に, 触ります' },
        { q: 'Phải thắt dây an toàn.', answers: V('シートベルトをしなければなりません。'), hint: 'シートベルトをします → しなければ' },
        { q: 'Phải cởi giày ở lối vào.', answers: V('{玄関|げんかん}で{靴|くつ}を{脱|ぬ}がなければなりません。'), hint: '玄関, 靴, 脱ぎます → 脱がない' },
        { q: 'Rác phải phân loại cẩn thận.', answers: V('ごみはきちんと{分|わ}けなければなりません。', 'ごみをきちんと{分|わ}けなければなりません。'), hint: 'ごみ, きちんと, 分けます' },
        { q: 'Khi đi xe máy phải đội mũ bảo hiểm.', answers: V('バイクに{乗|の}るとき、ヘルメットをかぶらなければなりません。'), hint: 'バイクに乗るとき, ヘルメットをかぶります' },
        { q: 'Sinh viên không cần trả phí.', answers: V('{学生|がくせい}は{料金|りょうきん}を{払|はら}わなくてもいいです。'), hint: '学生, 料金, 払います → 払わない' },
        { q: 'Ở đây không cần cởi giày đâu.', answers: V('ここで{靴|くつ}を{脱|ぬ}がなくてもいいですよ。', 'ここで{靴|くつ}を{脱|ぬ}がなくてもいいです。'), hint: '脱がなくてもいいです' },
        { q: 'Tôi nghĩ tàu điện ngầm Tokyo phức tạp.', answers: V('{東京|とうきょう}の{地下鉄|ちかてつ}は{複雑|ふくざつ}だと{思|おも}います。'), hint: '地下鉄, 複雑 + だ + と思います' },
        { q: 'Tôi nghĩ điện thoại Nhật thiết kế đẹp.', answers: V('{日本|にほん}の{携帯電話|けいたいでんわ}はデザインがいいと{思|おも}います。'), hint: '携帯電話, デザインがいい' },
        { q: 'Bạn nghĩ sao về giao thông Nhật Bản?', answers: V('{日本|にほん}の{交通|こうつう}についてどう{思|おも}いますか。'), hint: '交通, について, どう思いますか' },
        { q: 'Vì không khí trong lành, tôi nghĩ nông thôn tốt hơn.', answers: V('{空気|くうき}がきれいですから、{田舎|いなか}のほうがいいと{思|おも}います。'), hint: '空気, 田舎のほうが' },
        { q: 'Tôi cũng nghĩ vậy.', answers: V('{私|わたし}もそう{思|おも}います。'), hint: 'そう思います' },
        { q: '"Oishii" tiếng Anh nói thế nào?', answers: V('「おいしい」は{英語|えいご}で{何|なん}と{言|い}いますか。', 'おいしいは{英語|えいご}で{何|なん}と{言|い}いますか。'), hint: '英語で, 何と言いますか' },
      ],
    },
    {
      t: 'quiz',
      id: 'b14-bt-doi-dang',
      title: 'Đổi dạng — viết lại theo yêu cầu (gõ chữ Hán hoặc kana)',
      kind: 'fill',
      grammar: 'ます → 辞書形と · て形はいけません · ない → なければなりません · ない → なくてもいいです · 普通形と思います (ナA／N + だ)',
      items: [
        { q: 'ボタンを{押|お}します → "hễ … thì" (～と、)', answers: V('ボタンを{押|お}すと') },
        { q: 'お{金|かね}を{入|い}れます → "hễ … thì" (～と、)', answers: V('お{金|かね}を{入|い}れると') },
        { q: 'たばこを{吸|す}います → không được (～てはいけません)', answers: V('たばこを{吸|す}ってはいけません') },
        { q: '{自転車|じてんしゃ}を{止|と}めます → không được', answers: V('{自転車|じてんしゃ}を{止|と}めてはいけません') },
        { q: '{並|なら}びます → phải (～なければなりません)', answers: V('{並|なら}ばなければなりません') },
        { q: '{払|はら}います → phải', answers: V('{払|はら}わなければなりません') },
        { q: '{来|き}ます → phải', answers: V('{来|こ}なければなりません') },
        { q: '{分|わ}けます → phải', answers: V('{分|わ}けなければなりません') },
        { q: '{脱|ぬ}ぎます → không cần (～なくてもいいです)', answers: V('{脱|ぬ}がなくてもいいです') },
        { q: '{予約|よやく}します → không cần', answers: V('{予約|よやく}しなくてもいいです') },
        { q: '{複雑|ふくざつ}です → ～と思います', answers: V('{複雑|ふくざつ}だと{思|おも}います') },
        { q: 'うるさいです → ～と思います', answers: V('うるさいと{思|おも}います') },
        { q: '{雨|あめ}です → ～と思います', answers: V('{雨|あめ}だと{思|おも}います') },
        { q: 'パクさんは{来|き}ません → ～と思います', answers: V('パクさんは{来|こ}ないと{思|おも}います') },
        { q: '{便利|べんり}じゃありません → ～と思います', answers: V('{便利|べんり}じゃないと{思|おも}います', '{便利|べんり}ではないと{思|おも}います') },
      ],
    },
    {
      t: 'mcq',
      id: 'b14-bt-tro-tu',
      title: 'Chọn trợ từ đúng',
      items: [
        { q: 'ボタンを{押|お}す＿、ドアが{開|あ}きます。', options: ['から', 'と', 'が', 'で'], correct: 1, why: 'Hễ … thì: V{辞書形|じしょけい} + **と** (ポイント 113).' },
        { q: 'ボタンを{押|お}すと、ドア＿{開|あ}きます。', options: ['を', 'が', 'に', 'で'], correct: 1, why: 'Tự động từ 開きます đi với **が**.' },
        { q: '{写真|しゃしん}を{撮|と}って＿いけません。', options: ['も', 'は', 'が', 'を'], correct: 1, why: '～て**は**いけません (ポイント 114).' },
        { q: '{作品|さくひん}＿{触|さわ}ってはいけません。', options: ['を', 'に', 'で', 'が'], correct: 1, why: 'Sờ vào cái gì → **に**触ります.' },
        { q: '{自転車|じてんしゃ}は{駐輪場|ちゅうりんじょう}＿{止|と}めなければなりません。', options: ['で', 'に', 'を', 'へ'], correct: 1, why: 'Đỗ ở đâu (điểm đặt) → **に**止めます.' },
        { q: '{靴|くつ}を{脱|ぬ}がなくて＿いいです。', options: ['は', 'も', 'が', 'を'], correct: 1, why: '～なくて**も**いいです (ポイント 116).' },
        { q: '{地下鉄|ちかてつ}は{便利|べんり}だ＿{思|おも}います。', options: ['が', 'と', 'を', 'に'], correct: 1, why: '普通形 + **と**思います (ポイント 117).' },
        { q: '{日本|にほん}の{交通|こうつう}に＿どう{思|おも}いますか。', options: ['ついて', 'よって', 'とって', 'して'], correct: 0, why: 'Về ~ = **について**.' },
        { q: '「おいしい」は{英語|えいご}＿{何|なん}と{言|い}いますか。', options: ['に', 'で', 'を', 'が'], correct: 1, why: 'Bằng ngôn ngữ nào → **で** (ポイント 118).' },
        { q: '「delicious」＿{言|い}います。', options: ['を', 'に', 'と', 'が'], correct: 2, why: 'Trích lời → **と**言います.' },
        { q: '{田舎|いなか}＿ほうがいいと{思|おも}います。', options: ['が', 'の', 'に', 'は'], correct: 1, why: 'N **の**ほうが.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b14-bt-tu-vung',
      title: 'Chọn từ đúng',
      items: [
        { q: 'レバーを{回|まわ}すと、お＿が{出|で}ます。 (tiền thừa)', options: ['{湯|ゆ}', '{釣|つ}り', '{金|かね}', '{字|じ}'], correct: 1, why: 'Tiền thừa = **お{釣|つ}り**.' },
        { q: 'ドアを{開|あ}けると、{電気|でんき}が＿。', options: ['{出|で}ます', 'つきます', '{回|まわ}します', '{開|あ}きます'], correct: 1, why: 'Đèn sáng = **{電気|でんき}がつきます**.' },
        { q: '{夏|なつ}、＿の{音|おと}を{聞|き}くと、{涼|すず}しくなります。', options: ['こたつ', 'カイロ', '{風鈴|ふうりん}', '{湯|ゆ}たんぽ'], correct: 2, why: 'Mùa hè, nghe tiếng → **{風鈴|ふうりん}** (chuông gió).' },
        { q: '{車|くるま}に{乗|の}るとき、＿をしなければなりません。', options: ['ヘルメット', 'シートベルト', 'パスポート', 'ポケット'], correct: 1, why: 'Đi ô tô → thắt **シートベルト**.' },
        { q: 'バイクに{乗|の}るとき、＿をかぶらなければなりません。', options: ['ヘルメット', 'シートベルト', '{制服|せいふく}', 'ボタン'], correct: 0, why: 'Đội mũ bảo hiểm = **ヘルメット**をかぶります.' },
        { q: 'ホテルで＿を{見|み}せなければなりません。', options: ['{身分証|みぶんしょう}', '{時給|じきゅう}', '{番組|ばんぐみ}', '{空気|くうき}'], correct: 0, why: 'Xuất trình **{身分証|みぶんしょう}** (giấy tờ tuỳ thân) hoặc パスポート.' },
        { q: '{小学生|しょうがくせい}＿は{入場料|にゅうじょうりょう}を{払|はら}わなくてもいいです。', options: ['{以下|いか}', '{玄関|げんかん}', '{料金|りょうきん}', '{自由|じゆう}'], correct: 0, why: 'Từ … trở xuống = **{以下|いか}**.' },
        { q: '{田舎|いなか}は{空気|くうき}がきれいですが、{交通|こうつう}が＿です。', options: ['{便利|べんり}', '{不便|ふべん}', 'おしゃれ', '{自由|じゆう}'], correct: 1, why: 'Nhưng đi lại **bất tiện** → {不便|ふべん}.' },
        { q: 'この{番組|ばんぐみ}はおもしろいですが、{少|すこ}し＿と{思|おも}います。', options: ['うるさい', 'きちんと', 'いつでも', 'ほら'], correct: 0, why: 'Hơi **ồn ào** → うるさい.' },
        { q: 'メールは＿{送|おく}ることができます。', options: ['いつでも', 'きちんと', 'ほら', 'うーん'], correct: 0, why: 'Lúc nào cũng gửi được → **いつでも**.' },
        { q: 'たくさん{食|た}べました。おなかが＿です。', options: ['すき', 'いっぱい', 'いたい', 'きちんと'], correct: 1, why: 'No bụng = **おなかがいっぱいです**.' },
        { q: '{食事|しょくじ}のあとで「＿」と{言|い}います。', options: ['いただきます', 'ごちそうさまでした', 'いってきます', 'おやすみなさい'], correct: 1, why: 'Sau bữa ăn → **ごちそうさまでした**.' },
        { q: '{家族|かぞく}みんなが＿お{湯|ゆ}を{使|つか}います。', options: ['{同|おな}じ', '{同|おな}じな', '{同|おな}じの', '{同|おな}じに'], correct: 0, why: '**{同|おな}じ** + N (không có な, の).' },
      ],
    },
    {
      t: 'mcq',
      id: 'b14-bt-hoi-dap',
      title: 'Chọn câu đáp đúng',
      items: [
        { q: 'A：あれ？ドアが{開|あ}きません。', options: ['そのボタンを{押|お}すと、{開|あ}きますよ。', 'そのボタンを{押|お}してはいけません。', 'はい、どうぞ。', '{私|わたし}もそう{思|おも}います。'], correct: 0, why: 'Giải thích cách dùng: **～と、{開|あ}きますよ** (ポイント 113).' },
        { q: 'A：あ、Bさん、ここでたばこを{吸|す}ってはいけませんよ。', options: ['はい、どうぞ。', 'あっ、そうなんですか。', 'いいえ、{吸|す}わなくてもいいです。', 'ごちそうさまでした。'], correct: 1, why: 'Chưa biết luật → **あっ、そうなんですか**.' },
        { q: 'A：{名前|なまえ}を{書|か}かなければなりませんか。 (không cần)', options: ['いいえ、{書|か}いてはいけません。', 'いいえ、{書|か}かなくてもいいです。', 'はい、{書|か}かなくてもいいです。', 'いいえ、{書|か}かなければなりません。'], correct: 1, why: 'Không cần → **いいえ、～なくてもいいです**.' },
        { q: 'A：ここで{写真|しゃしん}を{撮|と}ってもいいですか。 (không được)', options: ['いいえ、{撮|と}らなくてもいいです。', 'いいえ、{撮|と}ってはいけません。', 'はい、{撮|と}ってはいけません。', 'いいえ、{撮|と}らなければなりません。'], correct: 1, why: 'Không được → **いいえ、～てはいけません**.' },
        { q: 'A：{日本|にほん}のテレビ{番組|ばんぐみ}についてどう{思|おも}いますか。', options: ['はい、{思|おも}います。', 'おもしろいと{思|おも}います。', 'テレビ{番組|ばんぐみ}です。', 'いいえ、{見|み}ません。'], correct: 1, why: 'どう思いますか → nói ý kiến **～と{思|おも}います** (không はい／いいえ).' },
        { q: 'A：コンビニとスーパーとどちらがいいと{思|おも}いますか。', options: ['{夜|よる}、{安|やす}くなりますから、スーパーのほうがいいと{思|おも}います。', 'はい、いいと{思|おも}います。', 'スーパーはいいです。コンビニもいいです。', 'スーパーだと{言|い}います。'], correct: 0, why: 'Lý do + **N のほうがいいと{思|おも}います**.' },
        { q: 'A：{東京|とうきょう}の{地下鉄|ちかてつ}は{便利|べんり}ですね。 (B đồng ý)', options: ['{私|わたし}もそう{思|おも}います。', 'そうなんですか。', 'ほら、あれ。', 'いただきます。'], correct: 0, why: 'Đồng ý với ý kiến → **{私|わたし}もそう{思|おも}います**.' },
        { q: 'A：「ありがとう」はベトナム{語|ご}で{何|なん}と{言|い}いますか。', options: ['ベトナム{語|ご}です。', '「cảm ơn」と{言|い}います。', '「cảm ơn」です と{思|おも}います。', 'はい、{言|い}います。'], correct: 1, why: '**「…」と{言|い}います** (ポイント 118).' },
      ],
    },
    {
      t: 'build',
      id: 'b14-bt-ghep',
      title: 'Ghép câu — một ngày của người mới đến Nhật',
      items: [
        { vi: 'Ơ? Tiền thừa không ra.', chips: ['あれ？', 'お{釣|つ}りが', '{出|で}ません', 'お{釣|つ}りを', '{出|だ}しません'], answer: ['あれ？', 'お{釣|つ}りが', '{出|で}ません'], ro: 'Are? Otsuri ga demasen.' },
        { vi: 'Bấm nút đỏ thì cà phê ra đấy.', chips: ['{赤|あか}い', 'ボタンを', '{押|お}すと、', 'コーヒーが', '{出|で}ますよ', '{押|お}して、', 'コーヒーを'], answer: ['{赤|あか}い', 'ボタンを', '{押|お}すと、', 'コーヒーが', '{出|で}ますよ'], ro: 'Akai botan o osu to, koohii ga demasu yo.' },
        { vi: 'Ở đây không được cho mèo ăn.', chips: ['ここで', '{猫|ねこ}に', 'えさを', 'やっては', 'いけません', '{猫|ねこ}を', 'やらなければ'], answer: ['ここで', '{猫|ねこ}に', 'えさを', 'やっては', 'いけません'], ro: 'Koko de neko ni esa o yatte wa ikemasen.' },
        { vi: 'Ồ, vậy à? Tôi không biết.', chips: ['あっ、', 'そうなんですか。', '{知|し}りませんでした', '{知|し}っていません', 'そうですね。'], answer: ['あっ、', 'そうなんですか。', '{知|し}りませんでした'], ro: 'A, sou nan desu ka. Shirimasen deshita.' },
        { vi: 'Khi lên tàu phải xếp hàng.', chips: ['{電車|でんしゃ}に', '{乗|の}るとき、', '{並|なら}ばなければ', 'なりません', '{並|なら}びなければ', 'いけません'], answer: ['{電車|でんしゃ}に', '{乗|の}るとき、', '{並|なら}ばなければ', 'なりません'], ro: 'Densha ni noru toki, narabanakereba narimasen.' },
        { vi: 'Có thẻ nên không cần mua vé.', chips: ['カードが', 'ありますから、', '{切符|きっぷ}を', '{買|か}わなくても', 'いいです', '{買|か}っては', 'いけません'], answer: ['カードが', 'ありますから、', '{切符|きっぷ}を', '{買|か}わなくても', 'いいです'], ro: 'Kaado ga arimasu kara, kippu o kawanakute mo ii desu.' },
        { vi: 'Sống một mình vất vả nhưng tôi nghĩ là có tự do.', chips: ['{一人|ひとり}{暮|ぐ}らしは', '{大変|たいへん}ですが、', '{自由|じゆう}が', 'あると', '{思|おも}います', 'ありますと'], answer: ['{一人|ひとり}{暮|ぐ}らしは', '{大変|たいへん}ですが、', '{自由|じゆう}が', 'あると', '{思|おも}います'], ro: 'Hitorigurashi wa taihen desu ga, jiyuu ga aru to omoimasu.' },
        { vi: 'Bạn nghĩ sao về thời trang của giới trẻ?', chips: ['{若|わか}い{人|ひと}の', 'ファッション', 'について', 'どう', '{思|おも}いますか', '{何|なに}を', 'で'], answer: ['{若|わか}い{人|ひと}の', 'ファッション', 'について', 'どう', '{思|おも}いますか'], ro: 'Wakai hito no fasshon ni tsuite dou omoimasu ka.' },
        { vi: 'Tôi nghĩ là sành điệu.', chips: ['おしゃれだと', '{思|おも}います', 'おしゃれと', 'おしゃれですと'], answer: ['おしゃれだと', '{思|おも}います'], ro: 'Oshare da to omoimasu.' },
        { vi: '"Ngon" tiếng Nhật nói là "oishii".', chips: ['「ngon」は', '{日本語|にほんご}で', '「おいしい」と', '{言|い}います', '{日本語|にほんご}に', '「おいしい」を'], answer: ['「ngon」は', '{日本語|にほんご}で', '「おいしい」と', '{言|い}います'], ro: '"Ngon" wa Nihongo de "oishii" to iimasu.' },
      ],
    },
  ],
};

export const BAI_14: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, KANJI, NGHE, NOI, BAI_TAP];

/* ═══════════════════ 📖 THEO SÁCH — Bài 14 (p.237–252) ═══════════════════
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
    'Không nghe rõ câu cô hỏi: nói **もう{一度|いちど}お{願|ねが}いします** hoặc **ゆっくりお{願|ねが}いします**. Quên một từ: **「…」は{日本語|にほんご}で{何|なん}と{言|い}いますか** (mẫu của chính bài này).',
    'Bài nghe やってみよう: ở đây KHÔNG ghi đáp án CD — chỉ ghi cần bắt từ nào. Nghe trên lớp rồi tự điền.',
    'Chỗ nào có tên ミン (Minh), ハノイ (Hà Nội), FPT{大学|だいがく}… là thông tin mẫu — thay bằng thông tin THẬT của bạn.',
    'Một số số trong 言ってみよう chỉ có **tranh, không có chữ** (Bài 14: chủ đề 2 số 2 và số 3). Câu mẫu ở đây theo cách hiểu tranh phổ biến nhất — nếu cô hiểu tranh khác, giữ nguyên mẫu ngữ pháp, chỉ đổi động từ.',
    'Dòng dịch thứ tư in trong sách (sau tiếng Anh, tiếng Trung) là **tiếng Hàn**, không phải tiếng Việt — dùng phần tả bằng tiếng Việt ở đây.',
  ],
};

export const SACH_14: Lesson = {
  id: 'b14-sach',
  kind: 'review',
  title: 'Theo sách — Bài 14 (trang 237–252)',
  goal: 'Nhìn tranh máy bán phiếu ăn, đồ vật mùa đông – mùa hè, biển báo, tờ tuyển làm thêm trong sách là nói được: bấm … thì …, đây là đồ dùng khi …, "…" tiếng … nói thế nào, không được / phải / không cần …, và ý kiến của mình (～と思います).',
  minutes: 60,
  blocks: [
    CACH_DUNG,

    ...trang(
      'Trang 237 · 話してみよう・聞いてみよう — Mở bài {国|くに}の{習慣|しゅうかん}',
      '**話してみよう** — 4 ảnh vẽ nét, không lời: (1) ba người (hai nữ, một nam) ngồi quanh bàn thấp, chắp tay trước đĩa thức ăn — cảnh trước bữa ăn (có lẽ đang nói いただきます); (2) hai máy bán hàng tự động đứng cạnh nhau, xếp đầy lon, chai; (3) trong toa tàu điện, bốn hành khách ngồi ghế dài: một chị ôm túi, một người đọc sách, một nữ sinh mặc đồng phục khoanh tay, một ông đeo cà vạt — ai cũng im lặng; (4) một người đàn ông cúi xuống đặt túi rác ở điểm tập kết rác cạnh toà nhà, trên tường có bảng thông báo. Mục đích: nói về **phong tục** của Nhật và nước mình. **聞いてみよう** (CD C42): nghe trước đoạn hội thoại dài của bài — chính là trang 252.',
      [
        C('（ảnh 1）この{人|ひと}たちは{何|なに}をしていますか。', '(shashin 1) Kono hitotachi wa nani o shite imasu ka.', '(ảnh 1) Những người này đang làm gì?'),
        S('ご{飯|はん}を{食|た}べる{前|まえ}に、「いただきます」と{言|い}っています。', 'Gohan o taberu mae ni, "itadakimasu" to itte imasu.', 'Trước khi ăn, họ đang nói "itadakimasu" ạ.'),
        C('（ảnh 2）ベトナムにも{自動販売機|じどうはんばいき}がたくさんありますか。', '(shashin 2) Betonamu ni mo jidou hanbaiki ga takusan arimasu ka.', '(ảnh 2) Ở Việt Nam cũng có nhiều máy bán hàng tự động không?'),
        S('いいえ、あまりありません。{日本|にほん}は{多|おお}くて、{便利|べんり}だと{思|おも}います。', 'Iie, amari arimasen. Nihon wa ookute, benri da to omoimasu.', 'Không, không nhiều lắm ạ. Ở Nhật nhiều, em nghĩ là tiện.'),
        C('（ảnh 3）{電車|でんしゃ}の{中|なか}で{電話|でんわ}で{話|はな}してもいいですか。', '(shashin 3) Densha no naka de denwa de hanashite mo ii desu ka.', '(ảnh 3) Trên tàu có được nói điện thoại không?'),
        S('いいえ、{話|はな}してはいけません。', 'Iie, hanashite wa ikemasen.', 'Không ạ, không được nói.'),
        C('（ảnh 4）{日本|にほん}ではごみをどうしなければなりませんか。', '(shashin 4) Nihon de wa gomi o dou shinakereba narimasen ka.', '(ảnh 4) Ở Nhật phải làm gì với rác?'),
        S('ごみを{分|わ}けなければなりません。', 'Gomi o wakenakereba narimasen.', 'Phải phân loại rác ạ.'),
      ],
      [
        'Trang mở bài chưa đòi mẫu mới, nhưng cô hay "bắt" luôn ba mẫu của bài: **～てはいけません** (ảnh 3), **～なければなりません** (ảnh 4), **～と{思|おも}います** (ảnh 2).',
        '"Họ đang nói gì" → **「…」と{言|い}っています** (ポイント 118 + ています).',
        'Xem **Hội thoại · Bức tranh chung của bài**.',
      ],
    ),

    ...trang(
      'Trang 238–239 · チャレンジ! {初|はじ}めて{見|み}た！{初|はじ}めて{聞|き}いた！',
      'Trang 238: **đi với bạn ở một toà nhà mua sắm** (tranh lớn: một chị chỉ tay về phía cửa kính của trung tâm mua sắm tên "ニコニコショッピング…", cạnh một anh). Ô 1-1: một nhân viên đội mũ đeo tạp dề và hai khách; một khách nói "{食券|しょっけん}?" với dấu hỏi, khách kia nghĩ tới tờ 500 yên, cái máy và mũi tên chỉ vào khe máy — **không biết dùng máy bán phiếu ăn**. Ô 1-2: một anh đeo kính cầm gói "カイロ" hỏi "?", người kia đáp "カイロ"; bên cạnh là hình "lạnh ▶ ấm" với cái áo len — **giới thiệu đồ vật lạ**. Ô 2: hai người cầm que xiên đồ ăn; anh hỏi "おいしい = ? (tiếng Hàn)", chị đáp bằng tiếng Hàn — **hỏi một từ nói bằng tiếng khác**. Trang 239: ba tranh lớn tương ứng — trước máy bán phiếu ăn gắn tường trong quán (chị cầm tiền, anh hướng dẫn); trước kệ "あったけ～い カイロ", anh giơ hai gói カイロ giải thích; hai người ngồi ở quầy cà phê với hai ly nước và hai đĩa bánh. **Mục tiêu できる:** giải thích ngắn cách dùng cho người không biết dùng. ☞ ポイント 113, 118.',
      [
        C('（ô 1-1）あれ？お{釣|つ}りが{出|で}ません。', '(koma 1-1) Are? Otsuri ga demasen.', '(ô 1-1) Ơ? Tiền thừa không ra.'),
        S('そのボタンを{押|お}すと、{出|で}ますよ。', 'Sono botan o osu to, demasu yo.', 'Bấm cái nút đó thì ra đấy ạ.'),
        C('（ô 1-2）これは{何|なん}ですか。', '(koma 1-2) Kore wa nan desu ka.', '(ô 1-2) Cái này là gì?'),
        S('カイロです。{冬|ふゆ}、{使|つか}うものです。ポケットに{入|い}れると、{暖|あたた}かくなります。', 'Kairo desu. Fuyu, tsukau mono desu. Poketto ni ireru to, atatakaku narimasu.', 'Là túi sưởi ạ. Đồ dùng mùa đông. Bỏ vào túi áo thì ấm lên.'),
        C('（ô 2）「おいしい」はベトナム{語|ご}で{何|なん}と{言|い}いますか。', '(koma 2) "Oishii" wa Betonamugo de nan to iimasu ka.', '(ô 2) "Oishii" tiếng Việt nói thế nào?'),
        S('「ngon」と{言|い}います。', '"Ngon" to iimasu.', 'Nói là "ngon" ạ.'),
      ],
      [
        '**ポイント 113 V{辞書形|じしょけい}と、～**: động tác (thể từ điển) + と + kết quả tự xảy ra. Vế sau dùng **が + tự động từ**: お釣り**が**出ます, ドア**が**開きます, 電気**が**つきます.',
        '**ポイント 118 「～」は～{語|ご}で{何|なん}と{言|い}いますか** — ngôn ngữ + **で**, câu trả lời **「…」と{言|い}います**.',
        'Giới thiệu đồ vật = 3 câu: **N です → ～とき（mùa）、{使|つか}うものです → ～と、～なります**.',
        'Xem **Hội thoại · ① 初めて見た！初めて聞いた！** và **Ngữ pháp · ポイント 113, 118**.',
      ],
    ),

    ...trang(
      'Trang 240 · 言ってみよう (chủ đề 1) — Số 1-1: bấm … thì … · Số 1-2: giới thiệu đồ vật',
      '**Số 1-1:** "Ơ? … không …" → "bấm cái nút đó thì … đấy" → "cảm ơn". Các ô tranh: 例 cửa・mở (một người chỉ vào cửa, cạnh nút có kí hiệu âm thanh); ① tiền thừa・ra (khách trước máy bán phiếu ăn nhiều nút, nhân viên chỉ tay); ② cà phê・ra (một chị bấm máy pha cà phê tự động, anh nhân viên đứng cạnh); ③ đèn・sáng (trong nhà vệ sinh có biển cấm hút thuốc, một chị đứng cạnh công tắc, người kia chỉ lên đèn); ④ nước・chảy (một chị đưa tay dưới vòi rửa tay tự động). **Số 1-2:** "kia là gì?" → "là …" → "…?" → "vâng. … là đồ dùng vào (mùa) …; làm … thì …" → "ồ": 例 こたつ／mùa đông／cho chân vào・ấm; ① 風鈴／mùa hè／nghe tiếng chuông・mát; ② カイロ／mùa đông／bỏ vào túi áo・người ấm; ③ 湯たんぽ／mùa đông／đổ nước nóng rồi đặt vào trong chăn・trong chăn ấm. Dưới bảng có hình bàn kotatsu, chuông gió hình cầu, hai gói カイロ ghi "ホカホカ", bình sứ bầu dục có vân.',
      [
        C('あれ？コーヒーが{出|で}ません。', 'Are? Koohii ga demasen.', 'Ơ? Cà phê không ra.'),
        S('あっ、そのボタンを{押|お}すと、{出|で}ますよ。', 'A, sono botan o osu to, demasu yo.', 'À, bấm cái nút đó thì ra đấy ạ.'),
        C('どうもありがとうございます。', 'Doumo arigatou gozaimasu.', 'Cảm ơn nhiều.'),
        C('あれは{何|なん}ですか。', 'Are wa nan desu ka.', 'Kia là cái gì?'),
        S('{風鈴|ふうりん}です。', 'Fuurin desu.', 'Là chuông gió ạ.'),
        C('ふうりん？', 'Fuurin?', 'Fuurin?'),
        S('はい。{風鈴|ふうりん}は{夏|なつ}、{使|つか}うものです。{風鈴|ふうりん}の{音|おと}を{聞|き}くと、{涼|すず}しくなります。', 'Hai. Fuurin wa natsu, tsukau mono desu. Fuurin no oto o kiku to, suzushiku narimasu.', 'Vâng. Chuông gió là đồ dùng vào mùa hè. Nghe tiếng chuông gió thì thấy mát.'),
        C('へえ。', 'Hee.', 'Ồ.'),
      ],
      [
        'Số 1-1: đổi **động từ ます → thể từ điển** trước と: {押|お}します → **{押|お}す**と. Câu kết quả giữ nguyên thể ます: {開|あ}きます, {出|で}ます, つきます.',
        'Số 1-2: nhắc lại từ lạ bằng giọng hỏi (**こたつ？**) là cách tự nhiên để người kia giải thích — bạn cũng dùng được khi thi.',
        'Tính từ trong bảng ở dạng です (暖かいです, 涼しいです) → nói trôi chảy hơn khi đổi sang **～くなります** (暖かくなります). Cả hai đều đúng.',
        'Xem **Ngữ pháp · ポイント 113 — bảng thay thế**.',
      ],
      [
        mau([
          E('あれ？ドアが{開|あ}きません。— あっ、そのボタンを{押|お}すと、{開|あ}きますよ。— どうもありがとうございます。', 'Are? Doa ga akimasen. — A, sono botan o osu to, akimasu yo. — Doumo arigatou gozaimasu.', 'Số 1-1 例 — cửa.'),
          E('あれ？お{釣|つ}りが{出|で}ません。— あっ、そのボタンを{押|お}すと、{出|で}ますよ。', 'Are? Otsuri ga demasen. — A, sono botan o osu to, demasu yo.', 'Số 1-1 ① — tiền thừa (máy có cần gạt thì: そのレバーを回すと).'),
          E('あれ？コーヒーが{出|で}ません。— あっ、そのボタンを{押|お}すと、{出|で}ますよ。', 'Are? Koohii ga demasen. — A, sono botan o osu to, demasu yo.', 'Số 1-1 ② — cà phê.'),
          E('あれ？{電気|でんき}がつきません。— あっ、そのボタンを{押|お}すと、つきますよ。', 'Are? Denki ga tsukimasen. — A, sono botan o osu to, tsukimasu yo.', 'Số 1-1 ③ — đèn.'),
          E('あれ？{水|みず}が{出|で}ません。— あっ、ここに{手|て}を{出|だ}すと、{出|で}ますよ。', 'Are? Mizu ga demasen. — A, koko ni te o dasu to, demasu yo.', 'Số 1-1 ④ — vòi nước tự động (hoặc: そのボタンを押すと).'),
          E('あれは{何|なん}ですか。— こたつです。— こたつ？— はい。こたつは{冬|ふゆ}、{使|つか}うものです。こたつに{足|あし}を{入|い}れると、{暖|あたた}かくなります。— へえ。', 'Are wa nan desu ka. — Kotatsu desu. — Kotatsu? — Hai. Kotatsu wa fuyu, tsukau mono desu. Kotatsu ni ashi o ireru to, atatakaku narimasu. — Hee.', 'Số 1-2 例 — こたつ.'),
          E('{風鈴|ふうりん}は{夏|なつ}、{使|つか}うものです。{風鈴|ふうりん}の{音|おと}を{聞|き}くと、{涼|すず}しいです。', 'Fuurin wa natsu, tsukau mono desu. Fuurin no oto o kiku to, suzushii desu.', 'Số 1-2 ① — chuông gió.'),
          E('カイロは{冬|ふゆ}、{使|つか}うものです。ポケットにカイロを{入|い}れると、{体|からだ}が{暖|あたた}かいです。', 'Kairo wa fuyu, tsukau mono desu. Poketto ni kairo o ireru to, karada ga atatakai desu.', 'Số 1-2 ② — túi sưởi.'),
          E('{湯|ゆ}たんぽは{冬|ふゆ}、{使|つか}うものです。{湯|ゆ}たんぽにお{湯|ゆ}を{入|い}れて、{布団|ふとん}の{中|なか}に{湯|ゆ}たんぽを{入|い}れると、{布団|ふとん}の{中|なか}が{暖|あたた}かいです。', 'Yutanpo wa fuyu, tsukau mono desu. Yutanpo ni oyu o irete, futon no naka ni yutanpo o ireru to, futon no naka ga atatakai desu.', 'Số 1-2 ③ — bình nước nóng.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 241 · 言ってみよう số 2 · やってみよう · Giới thiệu đồ tiện lợi (chủ đề 1)',
      '**Số 2:** "「…」 tiếng … nói thế nào?" → "nói là …": 例 「おいしい」・tiếng Anh → "Delicious"; ① 「おなかがすきました」; ② 「おなかがいっぱいです」; ③ 「いただきます」; ④ 「ごちそうさまでした」 — ở ①–④ sách để hình bong bóng lời thay cho tên ngôn ngữ: bạn dùng **tiếng của mình**. **やってみよう** (CD C46): nghe rồi nói đồ vật dùng khi nào — tranh 1 một que dài đầu tròn (que ngoáy tai), tranh 2 một dụng cụ có tay cầm và hai quả bóng nhỏ hai bên (đấm lưng, vai), tranh 3 lọ ớt bột bảy vị (câu gợi ý: khi ăn udon, soba, ___ thì ngon hơn). **■** Giới thiệu cho bạn cùng lớp một đồ vật tiện lợi của nước bạn hoặc của Nhật.',
      [
        C('「おなかがすきました」はベトナム{語|ご}で{何|なん}と{言|い}いますか。', '"Onaka ga sukimashita" wa Betonamugo de nan to iimasu ka.', '"Onaka ga sukimashita" tiếng Việt nói thế nào?'),
        S('「đói bụng rồi」と{言|い}います。', '"Đói bụng rồi" to iimasu.', 'Nói là "đói bụng rồi" ạ.'),
        C('「いただきます」は？', '"Itadakimasu" wa?', 'Còn "itadakimasu"?'),
        S('ベトナム{語|ご}には{同|おな}じ{言葉|ことば}がありません。「mời cả nhà ăn cơm」と{言|い}います。', 'Betonamugo ni wa onaji kotoba ga arimasen. "Mời cả nhà ăn cơm" to iimasu.', 'Tiếng Việt không có từ giống hệt ạ. Người ta nói "mời cả nhà ăn cơm".'),
        C('ミンさんの{国|くに}の{便利|べんり}なものを{紹介|しょうかい}してください。', 'Min-san no kuni no benri na mono o shoukai shite kudasai.', 'Minh giới thiệu một đồ tiện lợi của nước em đi.'),
        S('「ノンラー」です。ベトナムの{帽子|ぼうし}です。{暑|あつ}いとき、{使|つか}うものです。かぶると、{涼|すず}しいです。{雨|あめ}のときも{使|つか}うことができます。', '"Nonlaa" desu. Betonamu no boushi desu. Atsui toki, tsukau mono desu. Kaburu to, suzushii desu. Ame no toki mo tsukau koto ga dekimasu.', 'Là "nón lá" ạ. Mũ của Việt Nam. Đồ dùng khi trời nóng. Đội vào thì mát. Lúc mưa cũng dùng được.'),
      ],
      [
        'Số 2: câu hỏi và trả lời đều cần **と**: {何|なん}**と**{言|い}いますか → 「…」**と**{言|い}います. Ngôn ngữ + **で**.',
        'Không có từ tương đương → **～{語|ご}には{同|おな}じ{言葉|ことば}がありません** rồi giải thích — cô đánh giá cao.',
        'やってみよう: bắt **～とき** (dùng khi nào) và vế sau của **～と** (dùng thì thế nào); không có đáp án ở đây. Luyện: **Luyện nghe · Bài 1**.',
        'Giới thiệu đồ tiện lợi = **N です → Nの～です → ～とき、{使|つか}うものです → ～と、～です／なります → ～ことができます**.',
      ],
      [
        mau([
          E('「おいしい」は{英語|えいご}で{何|なん}と{言|い}いますか。— 「Delicious」と{言|い}います。', '"Oishii" wa eigo de nan to iimasu ka. — "Delicious" to iimasu.', 'Số 2 例.'),
          E('「おなかがすきました」はベトナム{語|ご}で{何|なん}と{言|い}いますか。— 「đói bụng rồi」と{言|い}います。', '"Onaka ga sukimashita" wa Betonamugo de nan to iimasu ka. — "Đói bụng rồi" to iimasu.', 'Số 2 ①.'),
          E('「おなかがいっぱいです」はベトナム{語|ご}で{何|なん}と{言|い}いますか。— 「no rồi」と{言|い}います。', '"Onaka ga ippai desu" wa Betonamugo de nan to iimasu ka. — "No rồi" to iimasu.', 'Số 2 ②.'),
          E('「いただきます」はベトナム{語|ご}で{何|なん}と{言|い}いますか。— 「mời cả nhà ăn cơm」と{言|い}います。', '"Itadakimasu" wa Betonamugo de nan to iimasu ka. — "Mời cả nhà ăn cơm" to iimasu.', 'Số 2 ③.'),
          E('「ごちそうさまでした」はベトナム{語|ご}で{何|なん}と{言|い}いますか。— 「cảm ơn vì bữa ăn」と{言|い}います。', '"Gochisousama deshita" wa Betonamugo de nan to iimasu ka. — "Cảm ơn vì bữa ăn" to iimasu.', 'Số 2 ④ (người Việt hay nói "con ăn xong rồi ạ").'),
        ]),
      ],
    ),

    ...trang(
      'Trang 242–243 · チャレンジ! ルール・マナー',
      'Trang 242: **đi chơi với bạn**. Tranh lớn: một con phố có taxi đỗ bên đường, cửa hàng burger mở 24 giờ có biển "tầng 2 khu không hút thuốc", một quán ăn có biển dọc chữ cách điệu; trước cửa hàng một nhóm người đang **xếp hàng** cạnh biển lối xuống tàu điện ngầm; một anh vẫy tay, một chị đứng cạnh cửa taxi. Ô 1: trong toa tàu, một cô gái áp điện thoại lên tai (bong bóng: toa tàu + điện thoại gạch chéo), anh bên cạnh giơ tay ngăn; góc có biển cấm điện thoại. Ô 2: trong xe, cô gái đang thắt dây an toàn, anh bên cạnh nghĩ tới hình một gia đình ngồi trong xe — **ghế sau cũng phải thắt**. Trang 243: trước **Bảo tàng Mỹ thuật Hoshino** có biển cấm dắt chó, hai thùng rác "rác cháy được" / "rác không cháy được"; một anh một chị đứng nói chuyện. Ô 3: hai anh đi trên lối đi, một người giơ tay ra hiệu, hình phóng to bàn chân đang bước lên bậc — chuyện **cởi giày / không cần cởi giày**. **Mục tiêu できる:** để tránh rắc rối trước, nói cho bạn biết luật lệ, phép lịch sự. ☞ ポイント 114, 115, 116.',
      [
        C('（ô 1）あ、ミンさん、ここで{携帯電話|けいたいでんわ}を{使|つか}ってはいけませんよ。', '(koma 1) A, Min-san, koko de keitai denwa o tsukatte wa ikemasen yo.', '(ô 1) Ấy Minh, ở đây không được dùng điện thoại đâu.'),
        S('あっ、そうなんですか。', 'A, sou nan desu ka.', 'Ồ, vậy ạ?'),
        C('ほら、あれ。', 'Hora, are.', 'Kìa, cái kia.'),
        S('あっ、{本当|ほんとう}だ。', 'A, hontou da.', 'A, thật ạ.'),
        C('（ô 2）シートベルトをしなければなりませんよ。', '(koma 2) Shiito beruto o shinakereba narimasen yo.', '(ô 2) Phải thắt dây an toàn đấy.'),
        S('そうなんですか。{知|し}りませんでした。', 'Sou nan desu ka. Shirimasen deshita.', 'Vậy ạ. Em không biết.'),
        C('（ô 3）ここで{靴|くつ}を{脱|ぬ}がなくてもいいですよ。', '(koma 3) Koko de kutsu o nuganakute mo ii desu yo.', '(ô 3) Ở đây không cần cởi giày đâu.'),
        S('へえ、そうなんですか。', 'Hee, sou nan desu ka.', 'Ồ, vậy ạ.'),
      ],
      [
        '**ポイント 114 Vてはいけません** (không được) · **ポイント 115 Vなければなりません** (phải) · **ポイント 116 Vなくてもいいです** (không cần).',
        'Người nhắc thêm **よ** ở cuối (báo điều người kia chưa biết); người được nhắc đáp **そうなんですか** / **{知|し}りませんでした**; chỉ biển: **ほら、あれ** → **{本当|ほんとう}だ**.',
        'Chia đúng trước khi nói: {使|つか}います → {使|つか}**って**はいけません; します → **しなければ**; {脱|ぬ}ぎます → {脱|ぬ}**がなくても**.',
        'Xem **Hội thoại · ② ルール・マナー** và **Ngữ pháp · ポイント 114, 115, 116 — bảng "ba mẫu luật lệ"**.',
      ],
    ),

    ...trang(
      'Trang 244 · 言ってみよう (chủ đề 2) — Số 1: てはいけません · Số 2: なければなりません',
      '**Số 1:** "Ấy B, ở đây không được … đâu" → "ồ, vậy à?" → "kìa, cái kia" → "a, thật". Các ô là **biển báo**: 例 cấm hút thuốc (một anh hút thuốc, chị giơ tay ngăn); ① máy ảnh gạch chéo (chị đang chụp một chiếc bình gốm trưng bày); ② xe đạp gạch chéo (chị dắt xe đạp, anh chỉ biển); ③ "STAFF ONLY" trên cửa (chị định mở cửa); ④ đầu mèo gạch chéo (chị ngồi cho mèo ăn). **Số 2:** "Ấy B, phải … đâu nhé" → "ồ, vậy à? Tôi không biết": 例 thắt dây an toàn; các ô ①–④ **chỉ có tranh**: ① một chị ngăn một anh đang bước qua đường có vạch kẻ và đèn; ② nhóm bốn người, một cô gái đứng lệch khỏi hàng; ③ hai chị đứng cạnh thùng "rác cháy được" / "rác không cháy được", một người cầm vỏ chai; ④ một anh hút thuốc, bong bóng có biển "khu hút thuốc".',
      [
        C('あ、ミンさん、ここで{写真|しゃしん}を{撮|と}ってはいけませんよ。', 'A, Min-san, koko de shashin o totte wa ikemasen yo.', 'Ấy Minh, ở đây không được chụp ảnh đâu.'),
        S('あっ、そうなんですか。', 'A, sou nan desu ka.', 'Ồ, vậy ạ?'),
        C('（ô 2-③）このペットボトル、ここに{捨|す}ててもいいですか。', '(2-③) Kono petto botoru, koko ni sutete mo ii desu ka.', '(ô 2-③) Chai nhựa này vứt ở đây được không?'),
        S('いいえ、ごみを{分|わ}けなければなりません。ペットボトルはあちらです。', 'Iie, gomi o wakenakereba narimasen. Petto botoru wa achira desu.', 'Không ạ, phải phân loại rác. Chai nhựa thì ở đằng kia.'),
        C('（ô 2-④）ここでたばこを{吸|す}ってもいいですか。', '(2-④) Koko de tabako o sutte mo ii desu ka.', '(ô 2-④) Ở đây hút thuốc được không?'),
        S('いいえ、たばこは{喫煙所|きつえんじょ}で{吸|す}わなければなりません。', 'Iie, tabako wa kitsuenjo de suwanakereba narimasen.', 'Không ạ, thuốc lá phải hút ở khu hút thuốc.'),
      ],
      [
        'Số 1 đọc biển → động từ: 🚭 {吸|す}って · 📷 {撮|と}って · 🚲 ({乗|の}って／{止|と}めて) · STAFF ONLY {入|はい}って · 🐈 えさをやって → **+ はいけません**.',
        'Số 2 là tranh không chữ: nói điều **bắt buộc** mà người trong tranh đang quên — **～なければなりません**. Câu mẫu dưới theo cách hiểu tranh phổ biến nhất.',
        'Đừng lẫn: てはいけません (cấm) ↔ なければなりません (phải). Cùng một việc có thể nói cả hai kiểu: ここでたばこを吸ってはいけません ＝ たばこは喫煙所で吸わなければなりません.',
        'Xem **Ngữ pháp · ポイント 114 — bảng biển báo, ポイント 115** và **Luyện nói · Đóng vai — Vai 1**.',
      ],
      [
        mau([
          E('あ、Bさん、ここでたばこを{吸|す}ってはいけませんよ。— あっ、そうなんですか。— ほら、あれ。— あっ、{本当|ほんとう}だ。', 'A, B-san, koko de tabako o sutte wa ikemasen yo. — A, sou nan desu ka. — Hora, are. — A, hontou da.', 'Số 1 例 — cấm hút thuốc.'),
          E('あ、Bさん、ここで{写真|しゃしん}を{撮|と}ってはいけませんよ。', 'A, B-san, koko de shashin o totte wa ikemasen yo.', 'Số 1 ① — cấm chụp ảnh.'),
          E('あ、Bさん、ここで{自転車|じてんしゃ}に{乗|の}ってはいけませんよ。', 'A, B-san, koko de jitensha ni notte wa ikemasen yo.', 'Số 1 ② — cấm xe đạp (hoặc: ここに自転車を止めてはいけませんよ).'),
          E('あ、Bさん、ここに{入|はい}ってはいけませんよ。', 'A, B-san, koko ni haitte wa ikemasen yo.', 'Số 1 ③ — STAFF ONLY.'),
          E('あ、Bさん、ここで{猫|ねこ}にえさをやってはいけませんよ。', 'A, B-san, koko de neko ni esa o yatte wa ikemasen yo.', 'Số 1 ④ — cấm cho mèo ăn.'),
          E('あ、Bさん、シートベルトをしなければなりませんよ。— あっ、そうなんですか。{知|し}りませんでした。', 'A, B-san, shiito beruto o shinakereba narimasen yo. — A, sou nan desu ka. Shirimasen deshita.', 'Số 2 例 — dây an toàn.'),
          E('あ、Bさん、{信号|しんごう}が{赤|あか}ですから、{止|と}まらなければなりませんよ。', 'A, B-san, shingou ga aka desu kara, tomaranakereba narimasen yo.', 'Số 2 ① — qua đường (theo tranh: đèn đỏ thì phải dừng).'),
          E('あ、Bさん、ここに{並|なら}ばなければなりませんよ。', 'A, B-san, koko ni narabanakereba narimasen yo.', 'Số 2 ② — phải xếp hàng.'),
          E('あ、Bさん、ごみを{分|わ}けなければなりませんよ。', 'A, B-san, gomi o wakenakereba narimasen yo.', 'Số 2 ③ — phân loại rác.'),
          E('あ、Bさん、たばこは{喫煙所|きつえんじょ}で{吸|す}わなければなりませんよ。', 'A, B-san, tabako wa kitsuenjo de suwanakereba narimasen yo.', 'Số 2 ④ — khu hút thuốc.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 245 · 言ってみよう số 3 · やってみよう · ペアで話しましょう (chủ đề 2)',
      '**Số 3:** "Ấy B, ở đây không cần … đâu" → "ồ, vậy à": 例 cởi giày (một chị ra hiệu, một cậu học sinh bước lên bậc, hình phóng to đôi giày); các ô **chỉ có tranh**: ① một chị chỉ lên bảng thông báo có con số ở quầy, nhân viên đứng sau quầy — bảng giá / quy định; ② một anh cầm tờ giấy có chữ "{名前|なまえ}" hỏi một chị; ③ một anh chắp tay đứng trước cửa nhà vệ sinh, một chị đứng đối diện. **やってみよう** (CD C50): nghe rồi chọn trong ngoặc — 例 Anna để xe đạp trước ga [để / không để]; 1 Mariyam cho mèo ăn [có / không]; 2 Mary tắm rửa trước khi vào bồn nước nóng [có / không]; 3 Kimura hồi cấp 3 mặc đồng phục [có / không]. **ペアで話しましょう:** đặt 4 thẻ tranh (người hút thuốc, hai thùng rác, cô gái đứng lệch hàng, chuyện giày dép) lên tranh チャレンジ trang 242–243, rồi nhập vai người trong tranh mà nói.',
      [
        C('ここで{靴|くつ}を{脱|ぬ}がなければなりませんか。', 'Koko de kutsu o nuganakereba narimasen ka.', 'Ở đây có phải cởi giày không?'),
        S('いいえ、{脱|ぬ}がなくてもいいですよ。', 'Iie, nuganakute mo ii desu yo.', 'Không ạ, không cần cởi đâu.'),
        C('（ô ②）ここに{名前|なまえ}を{書|か}かなければなりませんか。', '(②) Koko ni namae o kakanakereba narimasen ka.', '(ô ②) Có phải viết tên vào đây không?'),
        S('いいえ、{書|か}かなくてもいいです。', 'Iie, kakanakute mo ii desu.', 'Không ạ, không cần viết.'),
        C('（ペア・thẻ 1）……（cô đang hút thuốc）', '(Pea, kaado 1) …… ', '(cặp đôi, thẻ 1) (cô đang hút thuốc)'),
        S('あ、{先生|せんせい}、ここでたばこを{吸|す}ってはいけません。{喫煙所|きつえんじょ}はあちらです。', 'A, sensei, koko de tabako o sutte wa ikemasen. Kitsuenjo wa achira desu.', 'Ấy cô, ở đây không được hút thuốc ạ. Khu hút thuốc ở đằng kia.'),
      ],
      [
        '**Vなくてもいいです = không cần** (làm cũng được, không làm cũng được) — khác hẳn "không được" (てはいけません).',
        'Số 3 ①–③ là tranh không chữ — câu mẫu dưới theo cách hiểu phổ biến; nếu cô hiểu tranh khác, giữ mẫu **～なくてもいいですよ**, chỉ đổi động từ.',
        'Với cô (người trên) đừng nói trống không ~~吸ってはいけませんよ~~ quá gắt: thêm **あ、{先生|せんせい}、** và chỉ chỗ đúng.',
        'やってみよう: nghe đuôi câu — てはいけません / なければなりません / なくてもいいです; không có đáp án ở đây. Luyện: **Luyện nghe · Bài 2, Bài 5**.',
      ],
      [
        mau([
          E('あ、Bさん、ここで{靴|くつ}を{脱|ぬ}がなくてもいいですよ。— へえ、そうなんですか。', 'A, B-san, koko de kutsu o nuganakute mo ii desu yo. — Hee, sou nan desu ka.', 'Số 3 例 — không cần cởi giày.'),
          E('あ、Bさん、{学生|がくせい}は{料金|りょうきん}を{払|はら}わなくてもいいですよ。— へえ、そうなんですか。', 'A, B-san, gakusei wa ryoukin o harawanakute mo ii desu yo. — Hee, sou nan desu ka.', 'Số 3 ① — bảng giá (hoặc: 小学生以下は入場料を払わなくてもいいですよ).'),
          E('あ、Bさん、ここに{名前|なまえ}を{書|か}かなくてもいいですよ。— へえ、そうなんですか。', 'A, B-san, koko ni namae o kakanakute mo ii desu yo. — Hee, sou nan desu ka.', 'Số 3 ② — không cần viết tên.'),
          E('あ、Bさん、このトイレはお{金|かね}を{払|はら}わなくてもいいですよ。— へえ、そうなんですか。', 'A, B-san, kono toire wa okane o harawanakute mo ii desu yo. — Hee, sou nan desu ka.', 'Số 3 ③ — nhà vệ sinh (theo tranh; cách hiểu khác: 並ばなくてもいいですよ).'),
          E('（ペア）あ、Bさん、ここに{並|なら}ばなければなりませんよ。— あっ、すみません。{知|し}りませんでした。', '(Pea) A, B-san, koko ni narabanakereba narimasen yo. — A, sumimasen. Shirimasen deshita.', 'ペアで話しましょう — thẻ cô gái đứng lệch hàng.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 246–247 · チャレンジ! {私|わたし}の{意見|いけん}',
      'Trang 246: **đi dạo phố với bạn**. Tranh lớn: nhà hàng gia đình "Berry\'s" dán tờ **"Đang tuyển nhân viên làm thêm!!"** có hình cô phục vụ bưng khay, ghi **lương giờ 1.000 yên**; một anh một chị đứng chỉ vào tờ đó; một cặp khác xách túi bước ra khỏi quán. Ô 1-1: anh nói "{高|たか}い?" (cao nhỉ?), bên cạnh là biểu đồ tròn "học sinh cấp 3": phần **đang làm thêm** lớn hơn phần không làm (khoảng 2/3). Ô 1-2: hai cậu học sinh, bong bóng của mỗi người đều là hình nữ phục vụ sau quầy ghi "高校生" — hai ý kiến về học sinh cấp 3 đi làm thêm. Trang 247: trước văn phòng **cho thuê nhà "さくら不動産"** (bảng thông tin căn hộ), một cửa hàng mở 24 giờ và **máy bán nước tự động**; ba người đứng nói chuyện. Ô 1-2: hai người nhìn máy bán hàng, bong bóng "便利" và "rượu = siêu thị / cửa hàng tiện lợi" — so sánh chỗ mua. Ô 1-3: bong bóng "よく / ときどき / {忙|いそが}しいとき" với hình cửa hàng 24 giờ, và "便利 — スーパー | コンビニ ?" với hình mặt trời / mặt trăng. **Mục tiêu できる:** nói ngắn ý kiến của mình về chuyện quen thuộc và hỏi ý kiến người khác. ☞ ポイント 117.',
      [
        C('（ô 1-1）{時給|じきゅう}{1,000円|せんえん}ですね。{高|たか}いと{思|おも}いますか。', '(1-1) Jikyuu sen en desu ne. Takai to omoimasu ka.', '(ô 1-1) Lương giờ 1.000 yên nhỉ. Em thấy cao không?'),
        S('はい、{高|たか}いと{思|おも}います。', 'Hai, takai to omoimasu.', 'Có ạ, em nghĩ là cao.'),
        C('{高校生|こうこうせい}がアルバイトをすることについてどう{思|おも}いますか。', 'Koukousei ga arubaito o suru koto ni tsuite dou omoimasu ka.', 'Em nghĩ sao về việc học sinh cấp 3 làm thêm?'),
        S('いい{経験|けいけん}になると{思|おも}います。でも、{勉強|べんきょう}も{大切|たいせつ}だと{思|おも}います。', 'Ii keiken ni naru to omoimasu. Demo, benkyou mo taisetsu da to omoimasu.', 'Em nghĩ là trải nghiệm tốt. Nhưng em nghĩ việc học cũng quan trọng.'),
        C('（ô 1-3）コンビニとスーパーとどちらがいいと{思|おも}いますか。', '(1-3) Konbini to suupaa to dochira ga ii to omoimasu ka.', '(ô 1-3) Cửa hàng tiện lợi và siêu thị, em nghĩ bên nào tốt hơn?'),
        S('いつでも{買|か}うことができますから、コンビニのほうがいいと{思|おも}います。', 'Itsudemo kau koto ga dekimasu kara, konbini no hou ga ii to omoimasu.', 'Vì lúc nào cũng mua được, em nghĩ cửa hàng tiện lợi tốt hơn.'),
      ],
      [
        '**ポイント 117 {普通形|ふつうけい}と{思|おも}います** — ナA / N thêm **だ** ({大切|たいせつ}**だ**と), イA và động từ không thêm gì ({高|たか}いと, なると).',
        'Hỏi ý kiến: **～についてどう{思|おも}いますか** · so sánh: **N1とN2とどちらがいいと{思|おも}いますか** → **～から、Nのほうがいいと{思|おも}います**.',
        'Khen trước chê sau cho mềm: **～ですが、～と{思|おも}います** / **そうですね。でも、～と{思|おも}います**.',
        'Xem **Hội thoại · ③ 私の意見** và **Ngữ pháp · ポイント 117 — bảng 丁寧形 → 普通形**.',
      ],
    ),

    ...trang(
      'Trang 248 · 言ってみよう (chủ đề 3) — Số 1-1: そうですね。でも、～と思います · Số 1-2: ～についてどう思いますか',
      '**Số 1-1:** A nói một nhận xét → B: "ừ nhỉ. Nhưng tôi nghĩ …": 例 tàu điện ngầm Tokyo tiện / hơi phức tạp; ① đồng phục học sinh cấp 3 sành điệu / váy ngắn; ② điện thoại Nhật thiết kế đẹp / đắt; ③ sống một mình vất vả / có tự do nên tốt; ④ nhiều người nghe nhạc trên tàu / đôi khi nghe thấy tiếng nên phiền; ⑤ cuộc sống ở nước ngoài bận rộn / mỗi ngày học được nhiều điều nên thành trải nghiệm tốt; ⑥ nhiều học sinh cấp 3 làm thêm / học sinh cấp 3 thì việc học quan trọng nên không làm thêm thì hơn. **Số 1-2:** "Bạn nghĩ sao về …?" → "ừm. … nhưng tôi nghĩ …": 例 chương trình TV Nhật; ① thời trang giới trẻ; ② giao thông Nhật; ③ đồ ăn nhanh; ④ trang điểm trên tàu; ⑤ học sinh cấp 3 đi làm thêm.',
      [
        C('{日本|にほん}の{携帯電話|けいたいでんわ}はデザインがいいですね。', 'Nihon no keitai denwa wa dezain ga ii desu ne.', 'Điện thoại Nhật thiết kế đẹp nhỉ.'),
        S('そうですね。でも、{高|たか}いと{思|おも}います。', 'Sou desu ne. Demo, takai to omoimasu.', 'Vâng ạ. Nhưng em nghĩ là đắt.'),
        C('{電車|でんしゃ}で{化粧|けしょう}することについてどう{思|おも}いますか。', 'Densha de keshou suru koto ni tsuite dou omoimasu ka.', 'Em nghĩ sao về việc trang điểm trên tàu?'),
        S('うーん。{便利|べんり}ですが、{少|すこ}し{迷惑|めいわく}だと{思|おも}います。', 'Uun. Benri desu ga, sukoshi meiwaku da to omoimasu.', 'Ừm. Tiện nhưng em nghĩ hơi phiền người khác ạ.'),
      ],
      [
        'Số 1-1: vế của B trong sách ở thể lịch sự (少し複雑です, 迷惑です…) — khi nói phải **đổi sang thể thường** trước と: 複雑**だ**と, 迷惑**だ**と, 短**い**と, いい経験に**なる**と, しない**ほうがいい**と.',
        'Câu có lý do (③–⑥): **（lý do）から、～と{思|おも}います** — lý do vẫn giữ です／ます được.',
        'Số 1-2: mở bằng **うーん** (đang nghĩ), rồi **～ですが、～と{思|おも}います**.',
        'Xem **Ngữ pháp · ポイント 117 — bảng thay thế** và **Luyện nói · Câu hỏi không tranh ②**.',
      ],
      [
        mau([
          E('{東京|とうきょう}の{地下鉄|ちかてつ}は{便利|べんり}ですね。— そうですね。でも、{少|すこ}し{複雑|ふくざつ}だと{思|おも}います。', 'Toukyou no chikatetsu wa benri desu ne. — Sou desu ne. Demo, sukoshi fukuzatsu da to omoimasu.', 'Số 1-1 例.'),
          E('{高校生|こうこうせい}の{制服|せいふく}はおしゃれですね。— そうですね。でも、スカートが{短|みじか}いと{思|おも}います。', 'Koukousei no seifuku wa oshare desu ne. — Sou desu ne. Demo, sukaato ga mijikai to omoimasu.', 'Số 1-1 ①.'),
          E('{日本|にほん}の{携帯電話|けいたいでんわ}はデザインがいいですね。— そうですね。でも、{高|たか}いと{思|おも}います。', 'Nihon no keitai denwa wa dezain ga ii desu ne. — Sou desu ne. Demo, takai to omoimasu.', 'Số 1-1 ②.'),
          E('{一人|ひとり}{暮|ぐ}らしは{大変|たいへん}ですね。— そうですね。でも、{自由|じゆう}がありますから、いいと{思|おも}います。', 'Hitorigurashi wa taihen desu ne. — Sou desu ne. Demo, jiyuu ga arimasu kara, ii to omoimasu.', 'Số 1-1 ③.'),
          E('{電車|でんしゃ}で{音楽|おんがく}を{聞|き}いている{人|ひと}が{多|おお}いですね。— そうですね。でも、ときどき{音|おと}が{聞|き}こえますから、{迷惑|めいわく}だと{思|おも}います。', 'Densha de ongaku o kiite iru hito ga ooi desu ne. — Sou desu ne. Demo, tokidoki oto ga kikoemasu kara, meiwaku da to omoimasu.', 'Số 1-1 ④.'),
          E('{外国|がいこく}の{生活|せいかつ}は{忙|いそが}しいですね。— そうですね。でも、{毎日|まいにち}いろいろなことを{勉強|べんきょう}することができますから、いい{経験|けいけん}になると{思|おも}います。', 'Gaikoku no seikatsu wa isogashii desu ne. — Sou desu ne. Demo, mainichi iroiro na koto o benkyou suru koto ga dekimasu kara, ii keiken ni naru to omoimasu.', 'Số 1-1 ⑤.'),
          E('アルバイトをしている{高校生|こうこうせい}が{多|おお}いですね。— そうですね。でも、{高校生|こうこうせい}は{勉強|べんきょう}が{大切|たいせつ}ですから、アルバイトをしないほうがいいと{思|おも}います。', 'Arubaito o shite iru koukousei ga ooi desu ne. — Sou desu ne. Demo, koukousei wa benkyou ga taisetsu desu kara, arubaito o shinai hou ga ii to omoimasu.', 'Số 1-1 ⑥.'),
          E('{日本|にほん}のテレビ{番組|ばんぐみ}についてどう{思|おも}いますか。— うーん。おもしろいですが、{少|すこ}しうるさいと{思|おも}います。', 'Nihon no terebi bangumi ni tsuite dou omoimasu ka. — Uun. Omoshiroi desu ga, sukoshi urusai to omoimasu.', 'Số 1-2 例.'),
          E('{若|わか}い{人|ひと}のファッションについてどう{思|おも}いますか。— うーん。おしゃれですが、{少|すこ}し{高|たか}いと{思|おも}います。', 'Wakai hito no fasshon ni tsuite dou omoimasu ka. — Uun. Oshare desu ga, sukoshi takai to omoimasu.', 'Số 1-2 ①.'),
          E('{日本|にほん}の{交通|こうつう}についてどう{思|おも}いますか。— うーん。{便利|べんり}ですが、{少|すこ}し{複雑|ふくざつ}だと{思|おも}います。', 'Nihon no koutsuu ni tsuite dou omoimasu ka. — Uun. Benri desu ga, sukoshi fukuzatsu da to omoimasu.', 'Số 1-2 ②.'),
          E('ファストフードについてどう{思|おも}いますか。— うーん。{安|やす}いですが、{体|からだ}によくないと{思|おも}います。', 'Fasuto fuudo ni tsuite dou omoimasu ka. — Uun. Yasui desu ga, karada ni yokunai to omoimasu.', 'Số 1-2 ③.'),
          E('{電車|でんしゃ}で{化粧|けしょう}することについてどう{思|おも}いますか。— うーん。{迷惑|めいわく}だと{思|おも}います。', 'Densha de keshou suru koto ni tsuite dou omoimasu ka. — Uun. Meiwaku da to omoimasu.', 'Số 1-2 ④.'),
          E('{高校生|こうこうせい}がアルバイトをすることについてどう{思|おも}いますか。— うーん。いい{経験|けいけん}になりますが、{勉強|べんきょう}が{大変|たいへん}になると{思|おも}います。', 'Koukousei ga arubaito o suru koto ni tsuite dou omoimasu ka. — Uun. Ii keiken ni narimasu ga, benkyou ga taihen ni naru to omoimasu.', 'Số 1-2 ⑤.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 249 · 言ってみよう số 1-3 · やってみよう · Thảo luận (chủ đề 3)',
      '**Số 1-3:** "N1 và N2, bạn nghĩ cái nào tốt hơn?" → "vì …, tôi nghĩ N tốt hơn": 例 sống ở nông thôn / thành phố — không khí trong lành → nông thôn; ① gói tự do / tour — không cần tự đặt chỗ → tour; ② cửa hàng tiện lợi / siêu thị — buổi tối cơm hộp rẻ đi → siêu thị; ③ nông thôn / thành phố — nông thôn đi lại bất tiện → thành phố; ④ điện thoại / email · tiện hơn — lúc nào cũng gửi được → email. **やってみよう** (CD C54): nghe rồi điền lời — 1 chương trình TV Nhật (Carlos, Mary), 2 thời trang giới trẻ (Park, Marco: "tôi cũng nghĩ vậy"), 3 nông thôn và thành phố (Daniel, Kimura — mỗi người một lý do). **■** Nhật và nước bạn khác nhau ở điểm nào? Bạn nghĩ sao? (thời trang, đồ ăn, chương trình TV…).',
      [
        C('フリープランとツアーとどちらがいいと{思|おも}いますか。', 'Furii puran to tsuaa to dochira ga ii to omoimasu ka.', 'Gói tự do và tour trọn gói, em nghĩ cái nào tốt hơn?'),
        S('{自分|じぶん}で{予約|よやく}しなくてもいいですから、ツアーのほうがいいと{思|おも}います。', 'Jibun de yoyaku shinakute mo ii desu kara, tsuaa no hou ga ii to omoimasu.', 'Vì không cần tự đặt chỗ, em nghĩ tour tốt hơn ạ.'),
        C('{日本|にほん}とベトナムと{何|なに}が{違|ちが}いますか。', 'Nihon to Betonamu to nani ga chigaimasu ka.', 'Nhật và Việt Nam khác nhau ở điểm nào?'),
        S('{食|た}べ{物|もの}が{違|ちが}います。{日本|にほん}の{食|た}べ{物|もの}は{少|すこ}し{甘|あま}いと{思|おも}います。', 'Tabemono ga chigaimasu. Nihon no tabemono wa sukoshi amai to omoimasu.', 'Đồ ăn khác ạ. Em nghĩ đồ ăn Nhật hơi ngọt.'),
        C('ベトナムの{交通|こうつう}はどうですか。', 'Betonamu no koutsuu wa dou desu ka.', 'Giao thông Việt Nam thì sao?'),
        S('バイクが{多|おお}くて、{少|すこ}し{危|あぶ}ないと{思|おも}います。でも、{便利|べんり}です。', 'Baiku ga ookute, sukoshi abunai to omoimasu. Demo, benri desu.', 'Nhiều xe máy, em nghĩ hơi nguy hiểm. Nhưng tiện ạ.'),
      ],
      [
        'Lý do có thể dùng mẫu vừa học: **～なくてもいいですから** (①), **～ことができますから** (④), **～くなりますから** (②).',
        'Câu hỏi **どちらが{便利|べんり}だと{思|おも}いますか** (④) → trả lời cũng dùng **{便利|べんり}だと** chứ không phải いいと.',
        'やってみよう: bắt **～と{思|おも}います** và lý do **～から**; không có đáp án ở đây. Luyện: **Luyện nghe · Bài 3**.',
        'Xem **Luyện nói · Câu hỏi không tranh ②**.',
      ],
      [
        mau([
          E('{田舎|いなか}の{生活|せいかつ}と{都会|とかい}の{生活|せいかつ}とどちらがいいと{思|おも}いますか。— {空気|くうき}がきれいですから、{田舎|いなか}のほうがいいと{思|おも}います。', 'Inaka no seikatsu to tokai no seikatsu to dochira ga ii to omoimasu ka. — Kuuki ga kirei desu kara, inaka no hou ga ii to omoimasu.', 'Số 1-3 例.'),
          E('フリープランとツアーとどちらがいいと{思|おも}いますか。— {自分|じぶん}で{予約|よやく}しなくてもいいですから、ツアーのほうがいいと{思|おも}います。', 'Furii puran to tsuaa to dochira ga ii to omoimasu ka. — Jibun de yoyaku shinakute mo ii desu kara, tsuaa no hou ga ii to omoimasu.', 'Số 1-3 ①.'),
          E('コンビニとスーパーとどちらがいいと{思|おも}いますか。— {夜|よる}、お{弁当|べんとう}が{安|やす}くなりますから、スーパーのほうがいいと{思|おも}います。', 'Konbini to suupaa to dochira ga ii to omoimasu ka. — Yoru, obentou ga yasuku narimasu kara, suupaa no hou ga ii to omoimasu.', 'Số 1-3 ②.'),
          E('{田舎|いなか}の{生活|せいかつ}と{都会|とかい}の{生活|せいかつ}とどちらがいいと{思|おも}いますか。— {田舎|いなか}は{交通|こうつう}が{不便|ふべん}ですから、{都会|とかい}のほうがいいと{思|おも}います。', 'Inaka no seikatsu to tokai no seikatsu to dochira ga ii to omoimasu ka. — Inaka wa koutsuu ga fuben desu kara, tokai no hou ga ii to omoimasu.', 'Số 1-3 ③.'),
          E('{電話|でんわ}とメールとどちらが{便利|べんり}だと{思|おも}いますか。— いつでも{送|おく}ることができますから、メールのほうが{便利|べんり}だと{思|おも}います。', 'Denwa to meeru to dochira ga benri da to omoimasu ka. — Itsudemo okuru koto ga dekimasu kara, meeru no hou ga benri da to omoimasu.', 'Số 1-3 ④.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 250 · できる! — Giới thiệu phong tục, luật lệ của nước mình',
      'Nhiệm vụ tổng hợp: giới thiệu phong tục, phép lịch sự, luật lệ của nước mình, đồng thời hỏi về Nhật. Bốn bước: (1) chọn đề tài — ví dụ **nội quy trường** ({校則|こうそく}), **phép ăn uống**, **điện thoại**; (2) làm **poster**; (3) trình bày cho bạn cùng lớp hoặc người Nhật xung quanh; (4) nghe xong thì nói ý kiến, cảm nghĩ cho nhau. Trên lớp: cô thường hỏi lại sau bài trình bày bằng ～についてどう思いますか và ～なければなりませんか.',
      [
        C('ミンさんのテーマは{何|なん}ですか。', 'Min-san no teema wa nan desu ka.', 'Đề tài của Minh là gì?'),
        S('ベトナムの{高校|こうこう}の{校則|こうそく}です。', 'Betonamu no koukou no kousoku desu.', 'Nội quy trường cấp 3 ở Việt Nam ạ.'),
        C('{制服|せいふく}を{着|き}なければなりませんか。', 'Seifuku o kinakereba narimasen ka.', 'Có phải mặc đồng phục không?'),
        S('はい、{着|き}なければなりません。でも、{土曜日|どようび}は{着|き}なくてもいいです。', 'Hai, kinakereba narimasen. Demo, doyoubi wa kinakute mo ii desu.', 'Có ạ, phải mặc. Nhưng thứ Bảy thì không cần.'),
        C('{授業中|じゅぎょうちゅう}、{携帯電話|けいたいでんわ}を{使|つか}ってもいいですか。', 'Jugyouchuu, keitai denwa o tsukatte mo ii desu ka.', 'Trong giờ học được dùng điện thoại không?'),
        S('いいえ、{使|つか}ってはいけません。', 'Iie, tsukatte wa ikemasen.', 'Không ạ, không được dùng.'),
        C('その{校則|こうそく}についてどう{思|おも}いますか。', 'Sono kousoku ni tsuite dou omoimasu ka.', 'Em nghĩ sao về nội quy đó?'),
        S('{少|すこ}し{厳|きび}しいですが、{大切|たいせつ}だと{思|おも}います。', 'Sukoshi kibishii desu ga, taisetsu da to omoimasu.', 'Hơi nghiêm nhưng em nghĩ là quan trọng ạ.'),
      ],
      [
        'Poster nên có đủ 3 phần của bài: **phải / không được / không cần** (114–116) → **ý kiến** (117) → câu hỏi về Nhật (～は{日本|にほん}でもそうですか／「～」は{日本語|にほんご}で{何|なん}と{言|い}いますか — 118).',
        '校則 (nội quy trường), 授業中 (trong giờ học), 厳しい (nghiêm khắc) là từ tự thêm — cần cho đề tài này.',
        'Xem **Hội thoại · できる！— Poster mẫu**.',
      ],
    ),

    ...trang(
      'Trang 250 · 話読聞書「{日本|にほん}でびっくりしたこと」 — Điều làm tôi ngạc nhiên ở Nhật',
      'Ô 話読聞書 là một đoạn ngắn khoảng 10 câu: người viết kể kỳ nghỉ hè ở homestay nhà người Nhật và chuyện **ngạc nhiên về phong tục tắm bồn**. Ở nước người viết, tắm xong thì phải xả bỏ nước mình đã dùng, nên người viết cũng xả hết nước bồn; nhưng ở Nhật cả nhà dùng chung một bồn nước nên không được xả. Thấy bồn tắm trống trơn, mẹ trong gia đình homestay kêu to "Ơ!"; nghe người viết giải thích, hai người cùng cười. Câu kết: sống ở nước ngoài hơi vất vả nhưng có nhiều trải nghiệm nên thú vị. Từ gạch chân: 習慣, バスタブ, 話, ホストファミリー, みんな, なくなります, 笑います, 同じ, びっくり. Hai câu gợi ý bên cạnh (cô sẽ hỏi đúng hai câu này): **日本へ来てびっくりしたことがありますか。それは何ですか · どう思いますか**.',
      [
        C('この{人|ひと}は{日本|にほん}で{何|なに}にびっくりしましたか。', 'Kono hito wa Nihon de nani ni bikkuri shimashita ka.', 'Người viết ngạc nhiên vì điều gì ở Nhật?'),
        S('お{風呂|ふろ}の{習慣|しゅうかん}にびっくりしました。', 'Ofuro no shuukan ni bikkuri shimashita.', 'Ngạc nhiên vì phong tục tắm bồn ạ.'),
        C('{日本|にほん}ではバスタブのお{湯|ゆ}を{捨|す}ててもいいですか。', 'Nihon de wa basutabu no oyu o sutete mo ii desu ka.', 'Ở Nhật có được xả nước trong bồn tắm không?'),
        S('いいえ、{捨|す}ててはいけません。{家族|かぞく}みんなが{同|おな}じお{湯|ゆ}を{使|つか}いますから。', 'Iie, sutete wa ikemasen. Kazoku minna ga onaji oyu o tsukaimasu kara.', 'Không ạ, không được xả. Vì cả nhà dùng chung nước.'),
        C('ミンさんは{外国|がいこく}でびっくりしたことがありますか。', 'Min-san wa gaikoku de bikkuri shita koto ga arimasu ka.', 'Minh đã từng ngạc nhiên điều gì ở nước ngoài chưa?'),
        S('はい。{日本|にほん}の{映画|えいが}で、{電車|でんしゃ}がとても{静|しず}かでしたから、びっくりしました。ベトナムのバスはにぎやかです。', 'Hai. Nihon no eiga de, densha ga totemo shizuka deshita kara, bikkuri shimashita. Betonamu no basu wa nigiyaka desu.', 'Có ạ. Trong phim Nhật, tàu điện rất yên tĩnh nên em ngạc nhiên. Xe buýt ở Việt Nam thì ồn ào.'),
        C('どう{思|おも}いますか。', 'Dou omoimasu ka.', 'Em nghĩ sao?'),
        S('{静|しず}かな{電車|でんしゃ}はいいと{思|おも}います。{本|ほん}を{読|よ}むことができますから。', 'Shizuka na densha wa ii to omoimasu. Hon o yomu koto ga dekimasu kara.', 'Em nghĩ tàu yên tĩnh thì tốt ạ. Vì có thể đọc sách.'),
      ],
      [
        'Câu hỏi của cô dùng lại **～たことがありますか** (Bài 13) → trả lời **はい／いいえ** trước.',
        'Kể chuyện = **phong tục nước mình (～なければなりません／～なくてもいいです)** → **ở Nhật (～てはいけません)** → **chuyện xảy ra (quá khứ)** → **ý kiến (～と{思|おも}います)**.',
        'Chưa đi Nhật: kể điều ngạc nhiên khi xem phim, gặp người nước ngoài — cô chấp nhận.',
        'Xem **Hội thoại · ④ Nói–Đọc–Nghe–Viết — 日本でびっくりしたこと** (bài mẫu mới + khung viết).',
      ],
    ),

    { t: 'h', text: 'Trang 251 · ことば — Từ vựng của bài' },
    {
      t: 'p',
      text: 'Trang liệt kê 65 từ theo 3 chủ đề: (1) 初めて見た！初めて聞いた！ — udon, soba, túi sưởi, bàn sưởi kotatsu, chữ, phiếu ăn, tiền thừa, đèn/điện, cửa, ớt, chuông gió, chăn đệm futon, túi áo, nút bấm, nước nóng, bình nước nóng, cần gạt, mở (cửa mở), sờ, (đèn) sáng, xoay, ra (お釣りが出ます), ơ?, いただきます, no bụng, ごちそうさまでした; (2) ルール・マナー — trở xuống, lối vào nhà, dây an toàn, đồng phục, xe máy, mũ bảo hiểm, hộ chiếu, giấy tờ tuỳ thân, phí, phí vào cửa, xếp hàng, đỗ (xe), phân loại, cẩn thận, vậy à?, kìa; (3) 私の意見 — nông thôn, đô thị, không khí, giao thông, lương giờ, tự do, thiết kế, chương trình, đồ ăn nhanh, thời trang, gói tự do, nghĩ, trang điểm, trải nghiệm, ồn ào, sành điệu, phức tạp, tiện lợi, bất tiện, lúc nào cũng, ừm, về ~, tôi cũng nghĩ vậy. Không có tranh. Đủ nghĩa, romaji, ví dụ: xem mục **Từ vựng** của Bài 14.',
    },
    {
      t: 'note',
      title: 'Mẹo',
      items: [
        'Cô hay kiểm tra nhanh bằng cặp dễ lẫn: **開きます/開けます · つきます/つけます · お湯/水 · なくなります/なくします · バイク/自転車** — ôn ở **Từ vựng · Nhầm lẫn hay gặp**.',
        'Với mỗi động từ mới, thuộc luôn ba dạng của bài: **{並|なら}んではいけません · {並|なら}ばなければなりません · {並|なら}ばなくてもいいです**. Bảng: **Ngữ pháp · Ba mẫu "luật lệ" đặt cạnh nhau**.',
        'Tính từ な của bài (おしゃれ, 複雑, 便利, 不便) → luôn nhớ **だ** trước と思います.',
        'Xem **Từ vựng · Bài 14** và **Chữ Hán · Bài 14**.',
      ],
    },

    ...trang(
      'Trang 252 · もう{一度|いちど}{聞|き}こう — Nghe lại cả bài',
      'Nghe lại đoạn ở trang 237 (CD C42), ba cảnh giữa Natapon và Park. **Trước ga:** Natapon nhắc Park không được để xe đạp chỗ đó — Park ngạc nhiên; Natapon chỉ biển và nói xe đạp **phải để ở bãi xe đạp** ({駐輪場|ちゅうりんじょう}). **Chỗ bán vé:** Natapon hỏi Park đã mua vé chưa; Park có **thẻ PASMO** nên **không cần mua vé** mỗi lần lên tàu; Natapon muốn có một cái; Park chỉ: ở máy này, **bấm nút rồi cho tiền vào thì thẻ ra**. **Trên tàu:** Natapon nghe điện thoại — Park nhắc **trên tàu không được dùng điện thoại**, chỉ biển; Park khen điện thoại mới của Natapon; Natapon nói điện thoại Nhật **thiết kế đẹp**, Park đồng ý nhưng nghĩ **hơi đắt**. Từ ở chân trang: 駐輪場. Cô sẽ hỏi lại các chi tiết.',
      [
        C('パクさんは{自転車|じてんしゃ}をどこに{止|と}めなければなりませんか。', 'Paku-san wa jitensha o doko ni tomenakereba narimasen ka.', 'Park phải để xe đạp ở đâu?'),
        S('{駐輪場|ちゅうりんじょう}に{止|と}めなければなりません。', 'Chuurinjou ni tomenakereba narimasen.', 'Phải để ở bãi xe đạp ạ.'),
        C('パクさんはどうして{切符|きっぷ}を{買|か}いませんでしたか。', 'Paku-san wa doushite kippu o kaimasen deshita ka.', 'Tại sao Park không mua vé?'),
        S('カードがありますから、{切符|きっぷ}を{買|か}わなくてもいいです。', 'Kaado ga arimasu kara, kippu o kawanakute mo ii desu.', 'Vì có thẻ nên không cần mua vé ạ.'),
        C('カードはどうすると{出|で}ますか。', 'Kaado wa dou suru to demasu ka.', 'Làm thế nào thì thẻ ra?'),
        S('ボタンを{押|お}して、お{金|かね}を{入|い}れると、{出|で}ます。', 'Botan o oshite, okane o ireru to, demasu.', 'Bấm nút rồi cho tiền vào thì ra ạ.'),
        C('パクさんは{日本|にほん}の{携帯電話|けいたいでんわ}についてどう{思|おも}っていますか。', 'Paku-san wa Nihon no keitai denwa ni tsuite dou omotte imasu ka.', 'Park nghĩ gì về điện thoại Nhật?'),
        S('ちょっと{高|たか}いと{思|おも}っています。', 'Chotto takai to omotte imasu.', 'Bạn ấy nghĩ hơi đắt ạ.'),
      ],
      [
        'Cả ba cảnh dùng đủ mẫu của bài: **てはいけません** (xe đạp, điện thoại) · **なければなりません** (bãi xe) · **なくてもいいです** (không cần mua vé) · **～と、～が出ます** (máy bán thẻ) · **と思います** (điện thoại đắt).',
        'Cô hỏi ý kiến của NGƯỜI KHÁC bằng **どう{思|おも}っていますか** → trả lời **～と{思|おも}っています** (chỉ cần nghe hiểu).',
        'Xem **Luyện nghe · Bài 4 — Hội thoại dài: ở ga và trên tàu** (kịch bản mới cùng tình huống).',
      ],
    ),

    { t: 'h', text: 'Cô hỏi — bạn trả lời: ghép nhanh câu trả lời' },
    {
      t: 'build',
      id: 'b14-sach-ghep',
      title: 'Nghe câu hỏi (tiếng Việt) → ghép câu trả lời tiếng Nhật',
      items: [
        { vi: 'Cô nói あれ？お釣りが出ません → "Bấm cái nút đó thì ra đấy ạ."', chips: ['その', 'ボタンを', '{押|お}すと、', '{出|で}ますよ。', '{押|お}しますと、', '{出|だ}しますよ。'], answer: ['その', 'ボタンを', '{押|お}すと、', '{出|で}ますよ。'], ro: 'Sono botan o osu to, demasu yo.' },
        { vi: 'Cô hỏi これは何ですか → "Là kotatsu. Đồ dùng vào mùa đông ạ."', chips: ['こたつです。', '{冬|ふゆ}、', '{使|つか}う', 'ものです。', '{使|つか}います', 'ことです。'], answer: ['こたつです。', '{冬|ふゆ}、', '{使|つか}う', 'ものです。'], ro: 'Kotatsu desu. Fuyu, tsukau mono desu.' },
        { vi: 'Cô hỏi 「おいしい」はベトナム語で何と言いますか → "Nói là "ngon" ạ."', chips: ['「ngon」', 'と', '{言|い}います。', 'を', '{言|い}いません。'], answer: ['「ngon」', 'と', '{言|い}います。'], ro: '"Ngon" to iimasu.' },
        { vi: 'Nhắc cô: "Ở đây không được hút thuốc ạ."', chips: ['ここで', 'たばこを', '{吸|す}っては', 'いけません。', '{吸|す}わなければ', 'なりません。'], answer: ['ここで', 'たばこを', '{吸|す}っては', 'いけません。'], ro: 'Koko de tabako o sutte wa ikemasen.' },
        { vi: 'Cô nói シートベルトをしなければなりませんよ → "Vậy ạ. Em không biết."', chips: ['そうなんですか。', '{知|し}りません', 'でした。', '{知|し}っていません', 'ほら、あれ。'], answer: ['そうなんですか。', '{知|し}りません', 'でした。'], ro: 'Sou nan desu ka. Shirimasen deshita.' },
        { vi: 'Cô hỏi 靴を脱がなければなりませんか → "Không ạ, không cần cởi."', chips: ['いいえ、', '{脱|ぬ}がなくても', 'いいです。', '{脱|ぬ}いでは', 'いけません。'], answer: ['いいえ、', '{脱|ぬ}がなくても', 'いいです。'], ro: 'Iie, nuganakute mo ii desu.' },
        { vi: 'Cô hỏi ごみはどうしますか → "Phải phân loại rác ạ."', chips: ['ごみを', '{分|わ}けなければ', 'なりません。', '{分|わ}けては', 'いけません。'], answer: ['ごみを', '{分|わ}けなければ', 'なりません。'], ro: 'Gomi o wakenakereba narimasen.' },
        { vi: 'Cô nói 東京の地下鉄は便利ですね → "Vâng. Nhưng em nghĩ hơi phức tạp."', chips: ['そうですね。', 'でも、', '{少|すこ}し', '{複雑|ふくざつ}だと', '{思|おも}います。', '{複雑|ふくざつ}と'], answer: ['そうですね。', 'でも、', '{少|すこ}し', '{複雑|ふくざつ}だと', '{思|おも}います。'], ro: 'Sou desu ne. Demo, sukoshi fukuzatsu da to omoimasu.' },
        { vi: 'Cô hỏi 田舎と都会とどちらがいいと思いますか → "Vì không khí trong lành, em nghĩ nông thôn tốt hơn."', chips: ['{空気|くうき}が', 'きれいですから、', '{田舎|いなか}の', 'ほうが', 'いいと', '{思|おも}います。', 'いいだと'], answer: ['{空気|くうき}が', 'きれいですから、', '{田舎|いなか}の', 'ほうが', 'いいと', '{思|おも}います。'], ro: 'Kuuki ga kirei desu kara, inaka no hou ga ii to omoimasu.' },
        { vi: 'Cô nói 若い人のファッションはおしゃれですね → "Em cũng nghĩ vậy."', chips: ['{私|わたし}も', 'そう', '{思|おも}います。', 'そうなんですか。', 'と'], answer: ['{私|わたし}も', 'そう', '{思|おも}います。'], ro: 'Watashi mo sou omoimasu.' },
      ],
    },
  ],
};
