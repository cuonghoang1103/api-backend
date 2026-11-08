/**
 * Bài 19 — 失敗 (Sự cố) · TIẾP SAU SÁCH, cấp N4 (xem ../SOAN-BAI.md mục 8).
 * Người học đã xong Bài 1–15 (ポイント 1–124), Bài 16 (thể khả năng, thể ý chí, ～つもり, ～予定), Bài 17
 * (～ば, ～なら, ～し, ～すぎる, ～やすい・にくい) và Bài 18 (～てあげる・くれる・もらう, ～ておく, ～てある).
 * Bài này KHÔNG dạy lại các mẫu đó — chỉ dùng lại trong câu (ghi "ôn: Bài X").
 *
 * Ngữ pháp (N4): ① ～てしまう — làm xong hết / lỡ làm, đáng tiếc (văn nói ～ちゃう・～じゃう) · ② ～てみる — làm
 * thử (～てみたい, ～てみてください, ～てみよう, ～てみたら？) · ③ ～ところ — Vるところ (sắp) / Vているところ (đang)
 * / Vたところ (vừa mới), kèm ～ところでした · ④ ～のに — "vậy mà, thế mà" (trái kỳ vọng + cảm xúc), ～のに cuối
 * câu, ～ばよかったのに (ôn ～ば Bài 17), せっかく～のに; bảng phân biệt với ～ても (ポイント 121) và ～けど／が;
 * thêm "④′ のに thứ hai" (V る + のに — dùng để) để khỏi nhầm khi làm đề.
 * Từ vựng: 50 từ N4 (một số N3 có ghi cấp): lỡ làm hỏng / làm sai, mất đồ & tìm đồ, thử nấu ăn, cảm xúc & xin
 * lỗi, lý do & thời gian. Từ đã học ở Bài 1–18 (割れる, 落ちる, 汚れる, 壊す, 壊れる, 遅刻, 忘れ物, なくす, けが,
 * 交番, 財布, 届ける, 探す, びっくり, 安心, 心配…) KHÔNG lặp lại — gặp trong câu thì coi như ôn.
 * Chữ Hán mới (15): 失 敗 次 違 困 覚 破 折 刻 悲 怒 謝 直 警 察 (N3 theo các bảng tham khảo phổ biến — JLPT không
 * công bố danh sách chữ chính thức) — không trùng hanTu.ts, hanTu16–18.ts, hanLop.ts, bảng chữ Bài 1–18.
 * Thẻ chữ Hán: hanTu19.ts (HAN_TU_19).
 * Hội thoại, câu ví dụ, bài đọc, kịch bản nghe: VIẾT MỚI 100%, không chép giáo trình/đề thi nào.
 *
 * Nhân vật (giới tính quyết định giọng đọc, theo sách p.14): nữ = パク, ワン, アンナ, メアリー, マリヤム, 山口,
 * 木村, リン, 鈴木 · nam = マルコ, ダニエル, ナタポン, カルロス, 西川, 本田先生, 小林店長.
 * {小林|こばやし}{店長|てんちょう} (nam, role 'examiner' / ja-nam) là chủ quán ひまわり{食堂|しょくどう} nơi ナタポン làm thêm (Bài 16).
 * Người MỚI của bài này (không tên riêng):
 *  - お{客|きゃく}さん (hội thoại ①) — nữ, role 'a' / giọng ja-nu.
 *  - {駅員|えきいん} (hội thoại ③) — nam, role 'b' / giọng ja-nam · お{巡|まわ}りさん (hội thoại ③′) — nam, role 'b' / ja-nam.
 *  - {忘|わす}れ{物|もの}センターの{人|ひと} (nghe Bài 2) — nữ, ja-nu.
 * Hội thoại: role 'a'/'c' = giọng nữ, 'b'/'examiner' = giọng nam. Nghe: 'ja-nu' = nữ, 'ja-nam' = nam.
 * Hình: tên trong scripts/hinh/fluent-catalog.json (Fluent Emoji).
 */
import type { Block, Ex, Lesson } from '@/components/sach-hoc/types';

const E = (en: string, ro: string, vi: string): Ex => ({ en, ro, vi });

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

type Line = [who: string, role: 'a' | 'b' | 'c' | 'examiner' | 'candidate', text: string, ro: string, vi: string];
const DL = (title: string, lines: Line[]): Block => ({
  t: 'dialogue',
  title,
  lines: lines.map(([who, role, text, ro, vi]) => ({ who, role, text, ro, vi })),
});

/* ═══════════════════════════ 1. HỘI THOẠI ═══════════════════════════ */

const HOI_THOAI: Lesson = {
  id: 'b19-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — 失敗: lỡ làm sai ở chỗ làm thêm, lần đầu nấu thử, để quên ví trên tàu',
  goal: 'Báo lỗi và xin lỗi đúng mức ở chỗ làm thêm (～てしまいました・申し訳ありません・次から気をつけます), nhận lời giao thử việc mới (～てみます); khi nấu ăn nói được mình đang / sắp / vừa làm gì (～ているところ・～るところ・～たところ), rủ và khuyên làm thử (～てみよう・～てみて), than khi kết quả trái ý (～たのに); đến quầy nhà ga báo mất đồ, tả đồ vật, kể sự việc, nói lời tiếc (～ばよかったのに) và nghe tin đồ đã được tìm thấy.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Bài 19 — chủ đề: sự cố, thất bại (cấp N4)',
      items: [
        'Sống ở Nhật, ai cũng có lúc **lỡ làm sai**: nhầm món cho khách ở chỗ làm thêm, làm vỡ đĩa, để quên ví trên tàu, lần đầu nấu ăn thì cháy khét. Người Nhật rất coi trọng cách **báo lỗi – xin lỗi – sửa sai**; nói đúng câu thì một lần thất bại lại thành cơ hội được tin tưởng.',
        'Bốn mẫu N4: **～てしまう** (làm xong hết / lỡ làm mất rồi), **～てみる** (làm thử), **～ところ** (sắp – đang – vừa mới làm), **～のに** (vậy mà, thế mà — kết quả trái ý).',
        'Ba tình huống: ① ở quán ăn nơi ナタポン làm thêm — nhầm món, làm vỡ đĩa, được giao làm thử món mới · ② パク lần đầu làm お{好|この}み{焼|や}き · ③ メアリー để quên ví trên tàu, đến quầy nhà ga rồi nhận điện thoại của đồn cảnh sát.',
        'Mọi câu có furigana và romaji; bấm 🔊 để nghe từng câu rồi đọc to theo.',
      ],
    },
    {
      t: 'note',
      title: 'Học xong bài 19 bạn làm được (できる)',
      items: [
        '**① アルバイトで{失敗|しっぱい}** — báo lỗi với quản lý: **{注文|ちゅうもん}を{間違|まちが}えてしまいました**, **お{皿|さら}を{割|わ}ってしまいました**; xin lỗi khách: **{申|もう}し{訳|わけ}ありません**; hứa sửa: **{次|つぎ}から{気|き}をつけます**; nhận việc mới: **やってみます**.',
        '**② {初|はじ}めての{料理|りょうり}** — nói mình đang làm gì: **{今|いま}キャベツを{切|き}っているところ**; rủ thử: **{足|た}してみよう**; khuyên: **{弱|よわ}い{火|ひ}で{焼|や}いてみて**; than: **レシピのとおりに{作|つく}ったのに……**.',
        '**③ {忘|わす}れ{物|もの}をした** — báo ở quầy: **{財布|さいふ}を{忘|わす}れてしまったんですが……**; tả đồ: **{赤|あか}くて{小|ちい}さい{財布|さいふ}です**; tiếc: **かばんに{入|い}れておけばよかったのに**; nghe điện thoại: **{届|とど}きましたよ** → **ちょうど{今|いま}、{家|いえ}に{着|つ}いたところです**.',
        '**できる！** — kể 1 phút về một lần thất bại của mình: chuyện gì đã xảy ra (～てしまいました), tiếc vì điều gì (～のに), sau đó đã thử làm gì (～てみました), bây giờ thế nào.',
      ],
    },
    {
      t: 'table',
      caption: 'Bức tranh chung của bài — từ lúc lỡ làm sai đến lúc làm lại',
      head: ['Lúc', 'Câu then chốt', 'Romaji', 'Mẫu'],
      rows: [
        ['Báo lỗi, xin lỗi', 'すみません、お{皿|さら}を{割|わ}ってしまいました。', 'Sumimasen, osara o watte shimaimashita.', 'Vて ＋ しまう (lỡ)'],
        ['Làm cho xong hết', '{宿題|しゅくだい}はもう{全部|ぜんぶ}やってしまいました。', 'Shukudai wa mou zenbu yatte shimaimashita.', 'Vて ＋ しまう (xong)'],
        ['Nói thân mật', 'あっ、{焦|こ}げちゃった！', 'A, kogechatta!', '～ちゃう (= ～てしまう)'],
        ['Làm thử', 'もう{一度|いちど}やってみます。', 'Mou ichido yatte mimasu.', 'Vて ＋ みる'],
        ['Sắp làm', '{今|いま}から{出|で}かけるところです。', 'Ima kara dekakeru tokoro desu.', 'Vる ＋ ところ'],
        ['Đang làm', '{今|いま}、{探|さが}しているところです。', 'Ima, sagashite iru tokoro desu.', 'Vている ＋ ところ'],
        ['Vừa mới làm', 'ちょうど{今|いま}、{着|つ}いたところです。', 'Choudo ima, tsuita tokoro desu.', 'Vた ＋ ところ'],
        ['Trái ý, tiếc', 'ちゃんと{見|み}たのに、{間違|まちが}えてしまいました。', 'Chanto mita noni, machigaete shimaimashita.', '普通形 ＋ のに'],
      ],
    },

    /* ── ① アルバイトで失敗 ── */
    { t: 'h', text: '① アルバイトで{失敗|しっぱい} — "Em lỡ nhầm món của khách rồi!"' },
    {
      t: 'canh',
      anh: ['man-cook', 'man-student', 'woman', 'fork-and-knife-with-plate', 'collision'],
      caption: 'Giờ cơm trưa đông khách ở quán ひまわり食堂. ナタポン mang nhầm món cho một chị khách, rồi vội quá làm rơi vỡ một chiếc đĩa. Anh 小林 — quản lý quán — vẫn bình tĩnh.',
    },
    {
      t: 'p',
      text: 'Tình huống: **ナタポン** làm thêm ở quán ăn **ひまわり{食堂|しょくどう}** (Bài 16). Trưa nay đông khách, anh **mang nhầm món** — **{注文|ちゅうもん}を{間違|まちが}えてしまいました** — rồi **làm rơi vỡ đĩa** — **{割|わ}ってしまいました**. Đây là lúc dùng **～てしまう** tự nhiên nhất: việc đã lỡ xảy ra, người nói tiếc và nhận lỗi. Quản lý **{小林|こばやし}** không mắng mà còn giao cho anh **làm thử** món cà ri mới — **{作|つく}ってみる？** — mẫu **～てみる**. Chú ý cả câu **ちゃんと{見|み}たのに** ("đã xem kỹ rồi mà…") — mẫu **～のに**.',
    },
    DL('Ở quán ひまわり食堂 — "Thành thật xin lỗi quý khách!"', [
      ['お{客|きゃく}さん', 'a', 'すみません。{私|わたし}が{頼|たの}んだのはカレーじゃなくて、ハンバーグなんですが……。', 'Sumimasen. Watashi ga tanonda no wa karee ja nakute, hanbaagu na n desu ga…….', 'Xin lỗi em. Món chị gọi không phải cà ri mà là hamburger…'],
      ['ナタポン', 'b', 'あっ、{申|もう}し{訳|わけ}ありません！{注文|ちゅうもん}を{間違|まちが}えてしまいました。すぐにお{持|も}ちします。', 'A, moushiwake arimasen! Chuumon o machigaete shimaimashita. Sugu ni omochi shimasu.', 'Ôi, thành thật xin lỗi chị! Em nhầm món mất rồi. Em mang món đúng ra ngay ạ.'],
      ['ナタポン', 'b', '{店長|てんちょう}、すみません。{三番|さんばん}のテーブルのお{客様|きゃくさま}の{注文|ちゅうもん}を{間違|まちが}えてしまいました。', 'Tenchou, sumimasen. Sanban no teeburu no okyakusama no chuumon o machigaete shimaimashita.', 'Anh quản lý ơi, em xin lỗi. Em nhầm món của khách bàn số 3.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'そうか。ハンバーグはすぐ{焼|や}くから、お{客様|きゃくさま}にもう{一度|いちど}{謝|あやま}っておいて。', 'Sou ka. Hanbaagu wa sugu yaku kara, okyakusama ni mou ichido ayamatte oite.', 'Vậy à. Hamburger anh nướng ngay, em xin lỗi khách thêm lần nữa nhé.'],
      ['ナタポン', 'b', 'はい。……ちゃんとメモを{見|み}たのに、どうして{間違|まちが}えたんだろう。……あっ！', 'Hai. …… Chanto memo o mita noni, doushite machigaeta n darou. …… A!', 'Vâng. … Mình đã xem giấy ghi món cẩn thận rồi mà, sao lại nhầm nhỉ. … Ối!'],
      ['{小林店長|こばやしてんちょう}', 'examiner', '{今|いま}の{音|おと}は{何|なに}？', 'Ima no oto wa nani?', 'Tiếng gì vừa rồi thế?'],
      ['ナタポン', 'b', 'すみません……。お{皿|さら}を{落|お}として、{割|わ}ってしまいました。', 'Sumimasen……. Osara o otoshite, watte shimaimashita.', 'Em xin lỗi… Em làm rơi đĩa, vỡ mất rồi.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'けがはない？{手|て}を{切|き}らなかった？', 'Kega wa nai? Te o kiranakatta?', 'Có bị thương không? Không đứt tay chứ?'],
      ['ナタポン', 'b', 'はい、{大丈夫|だいじょうぶ}です。{本当|ほんとう}に{申|もう}し{訳|わけ}ありません。', 'Hai, daijoubu desu. Hontou ni moushiwake arimasen.', 'Dạ, em không sao. Em thật sự xin lỗi anh.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', '{気|き}にしなくていいよ。{忙|いそが}しいときは、{誰|だれ}でも{失敗|しっぱい}するから。でも、{割|わ}れたお{皿|さら}は{危|あぶ}ないから、{先|さき}に{片付|かたづ}けてしまおう。', 'Ki ni shinakute ii yo. Isogashii toki wa, dare demo shippai suru kara. Demo, wareta osara wa abunai kara, saki ni katazukete shimaou.', 'Đừng bận tâm. Lúc bận ai cũng có lúc hỏng việc mà. Nhưng đĩa vỡ nguy hiểm, mình dọn cho xong trước đã.'],
      ['ナタポン', 'b', 'はい。{次|つぎ}からは{気|き}をつけます。', 'Hai. Tsugi kara wa ki o tsukemasu.', 'Vâng. Từ lần sau em sẽ cẩn thận.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', '（{閉店後|へいてんご}）ナタポンくん、{来月|らいげつ}から{新|あたら}しいカレーを{出|だ}すんだけど、{作|つく}ってみる？', '(Heitengo) Natapon-kun, raigetsu kara atarashii karee o dasu n da kedo, tsukutte miru?', '(Sau giờ đóng cửa) Nattapon này, từ tháng sau quán ra món cà ri mới, em làm thử không?'],
      ['ナタポン', 'b', 'えっ、{僕|ぼく}がですか。{今日|きょう}はたくさん{失敗|しっぱい}してしまったのに、いいんですか。', 'E, boku ga desu ka. Kyou wa takusan shippai shite shimatta noni, ii n desu ka.', 'Ơ, em ạ? Hôm nay em hỏng việc bao nhiêu lần vậy mà anh vẫn cho em làm ạ?'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'もちろん。{失敗|しっぱい}してもいいから、{一度|いちど}やってみて。', 'Mochiron. Shippai shite mo ii kara, ichido yatte mite.', 'Tất nhiên. Hỏng cũng không sao, cứ làm thử một lần đi.'],
      ['ナタポン', 'b', 'ありがとうございます！じゃ、{明日|あした}{家|いえ}で{練習|れんしゅう}してみます。', 'Arigatou gozaimasu! Ja, ashita ie de renshuu shite mimasu.', 'Em cảm ơn anh! Vậy mai em sẽ thử tập ở nhà.'],
    ]),
    {
      t: 'examples',
      items: [
        E('{注文|ちゅうもん}を{間違|まちが}えてしまいました。', 'Chuumon o machigaete shimaimashita.', 'Tôi lỡ nhầm món (khách gọi) mất rồi.'),
        E('お{皿|さら}を{落|お}として、{割|わ}ってしまいました。', 'Osara o otoshite, watte shimaimashita.', 'Tôi làm rơi đĩa, vỡ mất rồi.'),
        E('{本当|ほんとう}に{申|もう}し{訳|わけ}ありません。{次|つぎ}からは{気|き}をつけます。', 'Hontou ni moushiwake arimasen. Tsugi kara wa ki o tsukemasu.', 'Thành thật xin lỗi. Từ lần sau tôi sẽ cẩn thận.'),
        E('ちゃんとメモを{見|み}たのに、{間違|まちが}えました。', 'Chanto memo o mita noni, machigaemashita.', 'Đã xem giấy ghi cẩn thận rồi mà vẫn nhầm.'),
        E('{先|さき}に{片付|かたづ}けてしまおう。', 'Saki ni katazukete shimaou.', 'Dọn cho xong trước đã nào.'),
        E('{失敗|しっぱい}してもいいから、{一度|いちど}やってみて。', 'Shippai shite mo ii kara, ichido yatte mite.', 'Hỏng cũng được, cứ làm thử một lần đi.'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ①',
      items: [
        '**{間違|まちが}えてしまいました／{割|わ}ってしまいました** — **Vて ＋ しまう** ở nghĩa "lỡ làm, đáng tiếc": việc đã xảy ra ngoài ý muốn và người nói **tiếc / nhận lỗi**. Khi xin lỗi, nói ～てしまいました **mềm và thành khẩn hơn** ～ました: {割|わ}りました nghe như chỉ thông báo; {割|わ}ってしまいました = "em lỡ làm vỡ, em rất tiếc".',
        '**{申|もう}し{訳|わけ}ありません** — câu xin lỗi **lịch sự nhất** ở N4, dùng với khách và người trên trong công việc. Bậc thang: ごめん (bạn thân) → すみません → {申|もう}し{訳|わけ}ありません (→ {申|もう}し{訳|わけ}ございません — cấp cao hơn nữa, Bài 24). **お{持|も}ちします** = "tôi xin mang tới" — câu cố định của nhân viên (dạng khiêm nhường, học kỹ ở Bài 24).',
        '**{謝|あやま}っておいて** — ～ておく (ôn Bài 18) + bỏ ください khi nói với cấp dưới: "xin lỗi khách trước đi nhé". **{片付|かたづ}けてしまおう** — ～てしまう ở nghĩa "làm cho XONG hẳn" + thể ý chí (ôn Bài 16): "dọn cho xong luôn nào".',
        '**ちゃんと{見|み}たのに** — **～のに** = "đã … vậy mà": điều đã làm (xem kỹ) trái với kết quả (vẫn nhầm), kèm cảm giác bực, tiếc. **{失敗|しっぱい}してしまったのに、いいんですか** — "em đã hỏng việc vậy mà anh vẫn…?" (ngạc nhiên).',
        '**{作|つく}ってみる？／やってみて／{練習|れんしゅう}してみます** — **Vて ＋ みる** = làm thử (để xem kết quả ra sao). **{気|き}にしなくていいよ** = đừng bận tâm (～なくてもいい, ôn ポイント 116). **{次|つぎ}からは{気|き}をつけます** — câu hứa CỐ ĐỊNH sau khi xin lỗi. **～だろう** = dạng thường của でしょう (tự hỏi mình).',
      ],
    },

    /* ── ② 初めての料理 ── */
    { t: 'h', text: '② {初|はじ}めてのお{好|この}み{焼|や}き — "Đang thái bắp cải… ôi, cháy mất rồi!"' },
    {
      t: 'canh',
      anh: ['woman-student', 'woman-student', 'cooking', 'bowl-with-spoon', 'fire'],
      caption: 'Chiều thứ Bảy trong phòng パク: cô định thử làm món お好み焼き cho bữa tiệc tối nay. ワン sang phụ, đọc công thức giúp. Lát sau ダニエル đến, vừa đúng lúc chiếc bánh đầu tiên bị cháy.',
    },
    {
      t: 'p',
      text: 'Tình huống: **パク** lần đầu **thử làm** món お{好|この}み{焼|や}き (bánh xèo kiểu Nhật) — **{作|つく}ってみよう** — cho bữa tiệc tối. Khi **ワン** hỏi đang làm gì, パク đáp **{切|き}っているところ** (đang đúng lúc thái). Cô lỡ cho quá nhiều bột — **{入|い}れちゃった** (= {入|い}れてしまった, văn nói) — rồi bánh cháy — **{焦|こ}げちゃった**. **ダニエル** đến nơi: **ちょうど{今|いま}{着|つ}いたところです** (vừa mới tới). Câu than **レシピのとおりに{作|つく}ったのに** và câu khen **{初|はじ}めてなのに、{上手|じょうず}ですね** đều dùng **～のに**.',
    },
    DL('Trong phòng パク — "Đang làm gì đấy?"', [
      ['ワン', 'a', 'パクさん、{今|いま}{何|なに}をしているところ？', 'Paku-san, ima nani o shite iru tokoro?', 'Park ơi, cậu đang làm gì đấy?'],
      ['パク', 'c', '{今|いま}、キャベツを{切|き}っているところ。{今夜|こんや}のパーティーで、お{好|この}み{焼|や}きを{作|つく}ってみようと{思|おも}って。', "Ima, kyabetsu o kitte iru tokoro. Kon'ya no paatii de, okonomiyaki o tsukutte miyou to omotte.", 'Mình đang thái bắp cải. Mình định thử làm okonomiyaki cho bữa tiệc tối nay.'],
      ['ワン', 'a', 'すごい！{初|はじ}めて{作|つく}るの？', 'Sugoi! Hajimete tsukuru no?', 'Giỏi thế! Lần đầu cậu làm à?'],
      ['パク', 'c', 'うん。でも、レシピを{見|み}ながら{作|つく}るから、{大丈夫|だいじょうぶ}だと{思|おも}う。', 'Un. Demo, reshipi o minagara tsukuru kara, daijoubu da to omou.', 'Ừ. Nhưng mình vừa làm vừa xem công thức nên chắc ổn thôi.'],
      ['ワン', 'a', 'ちょっと{見|み}てみてもいい？……あれ？{小麦粉|こむぎこ}は200グラムって{書|か}いてあるよ。', 'Chotto mite mite mo ii? …… Are? Komugiko wa nihyaku guramu tte kaite aru yo.', 'Cho mình xem thử chút được không? … Ơ? Ở đây ghi bột mì 200 gram mà.'],
      ['パク', 'c', 'えっ！300グラム{入|い}れちゃった……。', 'E! Sanbyaku guramu irechatta…….', 'Hả! Mình lỡ cho 300 gram mất rồi…'],
      ['ワン', 'a', '{大丈夫|だいじょうぶ}、{大丈夫|だいじょうぶ}。{水|みず}と{卵|たまご}を{少|すこ}し{足|た}してみよう。よく{混|ま}ぜれば、きっとおいしくなるよ。', 'Daijoubu, daijoubu. Mizu to tamago o sukoshi tashite miyou. Yoku mazereba, kitto oishiku naru yo.', 'Không sao, không sao. Thử thêm chút nước với trứng xem. Trộn kỹ thì chắc chắn sẽ ngon.'],
      ['パク', 'c', '（{焼|や}きながら）いいにおい！もうひっくり{返|かえ}してもいいかな。……あっ、{焦|こ}げちゃった！', '(Yakinagara) Ii nioi! Mou hikkurikaeshite mo ii ka na. …… A, kogechatta!', '(Vừa áp chảo) Thơm quá! Lật được chưa nhỉ. … Ôi, cháy mất rồi!'],
      ['ワン', 'a', '{火|ひ}が{強|つよ}すぎたね。{次|つぎ}は{弱|よわ}い{火|ひ}で{焼|や}いてみて。', 'Hi ga tsuyosugita ne. Tsugi wa yowai hi de yaite mite.', 'Lửa to quá rồi. Cái sau thử để lửa nhỏ xem.'],
      ['パク', 'c', 'レシピのとおりに{作|つく}ったのに……。せっかくの{材料|ざいりょう}が、もったいない。', 'Reshipi no toori ni tsukutta noni……. Sekkaku no zairyou ga, mottainai.', 'Mình làm đúng theo công thức rồi mà… Phí cả nguyên liệu mất công mua.'],
      ['ダニエル', 'b', 'こんにちは！ちょうど{今|いま}、{着|つ}いたところです。……いいにおいですね。', 'Konnichiwa! Choudo ima, tsuita tokoro desu. …… Ii nioi desu ne.', 'Chào các bạn! Mình vừa mới tới. … Thơm quá nhỉ.'],
      ['パク', 'c', 'ダニエルさん、{早|はや}いですね。{今|いま}、{二枚目|にまいめ}を{焼|や}いているところです。{一枚目|いちまいめ}は{焦|こ}げてしまって……。', 'Danieru-san, hayai desu ne. Ima, nimaime o yaite iru tokoro desu. Ichimaime wa kogete shimatte…….', 'Daniel đến sớm thế. Mình đang làm cái thứ hai. Cái thứ nhất bị cháy mất rồi…'],
      ['ダニエル', 'b', '{焦|こ}げたところは{取|と}ればいいですよ。ちょっと{食|た}べてみてもいいですか。', 'Kogeta tokoro wa toreba ii desu yo. Chotto tabete mite mo ii desu ka.', 'Chỗ cháy thì bỏ đi là được mà. Mình ăn thử một chút được không?'],
      ['ダニエル', 'b', '……おいしい！{初|はじ}めてなのに、{上手|じょうず}ですね。', '…… Oishii! Hajimete na noni, jouzu desu ne.', '… Ngon! Lần đầu làm mà khéo thế.'],
      ['パク', 'c', '{本当|ほんとう}？よかった。じゃ、{次|つぎ}はダニエルさんも{焼|や}いてみてください。', 'Hontou? Yokatta. Ja, tsugi wa Danieru-san mo yaite mite kudasai.', 'Thật à? May quá. Vậy cái tiếp theo Daniel cũng thử làm đi.'],
    ]),
    {
      t: 'examples',
      items: [
        E('{今|いま}、キャベツを{切|き}っているところです。', 'Ima, kyabetsu o kitte iru tokoro desu.', 'Tôi đang (đúng lúc) thái bắp cải.'),
        E('お{好|この}み{焼|や}きを{作|つく}ってみようと{思|おも}います。', 'Okonomiyaki o tsukutte miyou to omoimasu.', 'Tôi định thử làm okonomiyaki.'),
        E('300グラム{入|い}れちゃった。', 'Sanbyaku guramu irechatta.', 'Lỡ cho 300 gram mất rồi. (= {入|い}れてしまった)'),
        E('{次|つぎ}は{弱|よわ}い{火|ひ}で{焼|や}いてみて。', 'Tsugi wa yowai hi de yaite mite.', 'Cái sau thử để lửa nhỏ xem.'),
        E('ちょうど{今|いま}、{着|つ}いたところです。', 'Choudo ima, tsuita tokoro desu.', 'Tôi vừa mới tới.'),
        E('{初|はじ}めてなのに、{上手|じょうず}ですね。', 'Hajimete na noni, jouzu desu ne.', 'Lần đầu mà khéo thế.'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ②',
      items: [
        '**{切|き}っているところ／{焼|や}いているところ** — **Vている ＋ ところ** = "đang đúng lúc làm": nhấn mạnh mình đang ở **giữa** việc đó (nên chưa rảnh). **{着|つ}いたところ** — **Vた ＋ ところ** = "vừa mới xong" (chỉ vài phút trước). Thường đi với **{今|いま}・ちょうど{今|いま}・さっき**.',
        '**{入|い}れちゃった／{焦|こ}げちゃった** — văn nói của ～てしまった: **～てしまう → ～ちゃう**, **～てしまった → ～ちゃった**. Nói với bạn bè rất tự nhiên; nói với thầy cô, khách thì dùng ～てしまいました.',
        '**{作|つく}ってみよう／{足|た}してみよう／{焼|や}いてみて／{食|た}べてみてもいいですか** — **～てみる** chia đủ kiểu: ý chí (rủ: ～てみよう), て (nhờ, khuyên thân mật: ～てみて), ～てもいいですか (xin phép làm thử — ôn ポイント 89). **{見|み}てみる** = "xem thử" — hai chữ み liền nhau là bình thường.',
        '**レシピのとおりに{作|つく}ったのに** — làm đúng công thức (điều kỳ vọng sẽ thành công) **vậy mà** vẫn cháy: ～のに mang cảm giác tiếc, bực. **{初|はじ}めてなのに、{上手|じょうず}ですね** — danh từ + **な** + のに; ở đây là ngạc nhiên **tích cực** (lời khen rất hay dùng).',
        '**{焦|こ}げたところは{取|と}ればいい** — ⚠ ở đây ところ là danh từ **"chỗ"** (chỗ bị cháy), KHÔNG phải mẫu ngữ pháp "sắp/đang/vừa". **せっかくの{材料|ざいりょう}** = nguyên liệu đã mất công chuẩn bị; **もったいない** = phí, tiếc của. **～のとおりに** = theo đúng ~. **よく{混|ま}ぜれば** (ôn ～ば Bài 17) · **{強|つよ}すぎた** (ôn Bài 17) · **{書|か}いてある** (ôn Bài 18).',
      ],
    },

    /* ── ③ 忘れ物 ── */
    { t: 'h', text: '③ {電車|でんしゃ}に{財布|さいふ}を{忘|わす}れた — Báo mất đồ ở quầy nhà ga, nhận điện thoại của đồn cảnh sát' },
    {
      t: 'canh',
      anh: ['woman-student', 'train', 'station', 'purse', 'police-officer'],
      caption: 'Sáng chủ nhật ở nhà ga: メアリー vừa xuống tàu thì phát hiện chiếc ví đỏ không còn trong tay. Cô chạy đến quầy nhân viên nhà ga. Chiều hôm đó, điện thoại của cô reo — là đồn cảnh sát trước ga.',
    },
    {
      t: 'p',
      text: 'Tình huống: **メアリー** để quên ví trên tàu — **{忘|わす}れてしまったんですが……** (báo sự cố rồi bỏ lửng = đang nhờ giúp). Nhân viên nhà ga **thử gọi** cho ga cuối — **{聞|き}いてみます** — và cho biết bên đó **đang tìm** — **{探|さが}しているところです**. メアリー tiếc: **かばんに{入|い}れておけばよかったのに** ("phải chi mình cất vào túi…" — ～ば + よかった + のに). Chiều đó **お{巡|まわ}りさん** gọi điện: có người **nhặt được và mang đến** đồn. メアリー vừa **về tới nhà** — **{着|つ}いたところ** — nhưng đi ngay.',
    },
    DL('Ở quầy nhà ga — "Tôi để quên ví trên tàu…"', [
      ['メアリー', 'c', 'すみません。さっき{電車|でんしゃ}の{中|なか}に{財布|さいふ}を{忘|わす}れてしまったんですが……。', 'Sumimasen. Sakki densha no naka ni saifu o wasurete shimatta n desu ga…….', 'Xin lỗi anh. Lúc nãy tôi lỡ để quên ví trên tàu…'],
      ['{駅員|えきいん}', 'b', 'どの{電車|でんしゃ}ですか。', 'Dono densha desu ka.', 'Chuyến tàu nào ạ?'],
      ['メアリー', 'c', '{10時15分|じゅうじじゅうごふん}にこの{駅|えき}に{着|つ}いた{東京行|とうきょうゆ}きです。{降|お}りてすぐ、{気|き}がつきました。', 'Juuji juugofun ni kono eki ni tsuita Toukyou-yuki desu. Orite sugu, ki ga tsukimashita.', 'Chuyến đi Tokyo đến ga này lúc 10 giờ 15. Vừa xuống tàu là tôi nhận ra.'],
      ['{駅員|えきいん}', 'b', 'どのあたりに{座|すわ}っていましたか。', 'Dono atari ni suwatte imashita ka.', 'Chị ngồi ở khoảng nào ạ?'],
      ['メアリー', 'c', '{前|まえ}から{二両目|にりょうめ}です。スマホを{使|つか}うとき、{財布|さいふ}を{席|せき}の{横|よこ}に{置|お}いて、そのまま{降|お}りてしまいました。', 'Mae kara niryoume desu. Sumaho o tsukau toki, saifu o seki no yoko ni oite, sono mama orite shimaimashita.', 'Toa thứ hai tính từ đầu tàu. Lúc dùng điện thoại, tôi đặt ví bên cạnh ghế rồi cứ thế xuống luôn.'],
      ['{駅員|えきいん}', 'b', 'どんな{財布|さいふ}ですか。', 'Donna saifu desu ka.', 'Ví như thế nào ạ?'],
      ['メアリー', 'c', '{赤|あか}くて{小|ちい}さい{財布|さいふ}です。{中|なか}に{学生証|がくせいしょう}とカードと、{五千円|ごせんえん}ぐらい{入|はい}っています。', 'Akakute chiisai saifu desu. Naka ni gakuseishou to kaado to, gosen en gurai haitte imasu.', 'Ví nhỏ màu đỏ. Bên trong có thẻ sinh viên, thẻ ngân hàng và khoảng 5 nghìn yên.'],
      ['{駅員|えきいん}', 'b', 'わかりました。{今|いま}、{終点|しゅうてん}の{駅|えき}に{電話|でんわ}して、{聞|き}いてみます。', 'Wakarimashita. Ima, shuuten no eki ni denwa shite, kiite mimasu.', 'Tôi hiểu rồi. Tôi thử gọi điện hỏi ga cuối ngay đây.'],
      ['{駅員|えきいん}', 'b', '（{電話|でんわ}のあと）{今|いま}、{向|む}こうの{駅員|えきいん}が{電車|でんしゃ}の{中|なか}を{探|さが}しているところです。{見|み}つかったら、{連絡|れんらく}しますね。', '(Denwa no ato) Ima, mukou no ekiin ga densha no naka o sagashite iru tokoro desu. Mitsukattara, renraku shimasu ne.', '(Sau cuộc gọi) Nhân viên ga bên kia đang tìm trên tàu. Tìm thấy thì tôi sẽ báo chị nhé.'],
      ['メアリー', 'c', 'お{願|ねが}いします。……かばんに{入|い}れておけばよかったのに。', 'Onegai shimasu. …… Kaban ni irete okeba yokatta noni.', 'Nhờ anh ạ. … Phải chi mình cất sẵn vào túi thì đã không sao.'],
      ['{駅員|えきいん}', 'b', '{念|ねん}のため、{駅前|えきまえ}の{交番|こうばん}にも{届|とど}けを{出|だ}しておいたほうがいいですよ。', 'Nen no tame, ekimae no kouban ni mo todoke o dashite oita hou ga ii desu yo.', 'Để chắc chắn, chị nên báo luôn ở đồn cảnh sát trước ga.'],
      ['メアリー', 'c', 'わかりました。{今|いま}から{行|い}ってみます。', 'Wakarimashita. Ima kara itte mimasu.', 'Tôi hiểu rồi. Tôi đến đó (thử) ngay bây giờ.'],
    ]),
    DL('③′ Chiều hôm đó — điện thoại của đồn cảnh sát', [
      ['お{巡|まわ}りさん', 'b', 'もしもし、{駅前交番|えきまえこうばん}です。メアリーさんですか。{赤|あか}い{財布|さいふ}が{届|とど}きましたよ。', 'Moshimoshi, ekimae kouban desu. Mearii-san desu ka. Akai saifu ga todokimashita yo.', 'A lô, đồn cảnh sát trước ga đây. Chị Mary phải không? Có người mang ví đỏ đến rồi đấy.'],
      ['メアリー', 'c', '{本当|ほんとう}ですか！よかった……。', 'Hontou desu ka! Yokatta…….', 'Thật ạ! May quá…'],
      ['お{巡|まわ}りさん', 'b', 'さっき{高校生|こうこうせい}が{電車|でんしゃ}の{中|なか}で{拾|ひろ}って、{届|とど}けてくれたんです。', 'Sakki koukousei ga densha no naka de hirotte, todokete kureta n desu.', 'Lúc nãy một em học sinh cấp ba nhặt được trên tàu và mang đến.'],
      ['メアリー', 'c', 'そうですか。お{礼|れい}を{言|い}いたいんですが、その{人|ひと}の{名前|なまえ}はわかりますか。', 'Sou desu ka. Orei o iitai n desu ga, sono hito no namae wa wakarimasu ka.', 'Vậy ạ. Tôi muốn cảm ơn, anh có biết tên người đó không?'],
      ['お{巡|まわ}りさん', 'b', '{名前|なまえ}は{言|い}わないで、{帰|かえ}ってしまいました。{中|なか}の{物|もの}を{確|たし}かめたいので、{交番|こうばん}まで{来|き}てもらえますか。', 'Namae wa iwanaide, kaette shimaimashita. Naka no mono o tashikametai node, kouban made kite moraemasu ka.', 'Em ấy không nói tên mà về mất rồi. Tôi cần chị kiểm tra đồ bên trong, chị đến đồn được không?'],
      ['メアリー', 'c', 'はい。ちょうど{今|いま}、{家|いえ}に{着|つ}いたところですけど、すぐ{行|い}きます。', 'Hai. Choudo ima, ie ni tsuita tokoro desu kedo, sugu ikimasu.', 'Vâng. Tôi vừa mới về đến nhà, nhưng tôi đi ngay ạ.'],
      ['お{巡|まわ}りさん', 'b', '{急|いそ}がなくてもいいですよ。{気|き}をつけて{来|き}てください。', 'Isoganakute mo ii desu yo. Ki o tsukete kite kudasai.', 'Không cần vội đâu. Chị đi cẩn thận nhé.'],
      ['メアリー', 'c', 'ありがとうございます。せっかく{届|とど}けてくれたのに、お{礼|れい}が{言|い}えなくて{残念|ざんねん}です。', 'Arigatou gozaimasu. Sekkaku todokete kureta noni, orei ga ienakute zannen desu.', 'Cảm ơn anh. Người ta đã mất công mang đến mà tôi không cảm ơn được, tiếc quá.'],
    ]),
    {
      t: 'examples',
      items: [
        E('{電車|でんしゃ}の{中|なか}に{財布|さいふ}を{忘|わす}れてしまったんですが……。', 'Densha no naka ni saifu o wasurete shimatta n desu ga…….', 'Tôi lỡ để quên ví trên tàu… (báo sự cố, bỏ lửng = nhờ giúp)'),
        E('{今|いま}、{終点|しゅうてん}の{駅|えき}に{電話|でんわ}して、{聞|き}いてみます。', 'Ima, shuuten no eki ni denwa shite, kiite mimasu.', 'Tôi thử gọi điện hỏi ga cuối ngay đây.'),
        E('{今|いま}、{電車|でんしゃ}の{中|なか}を{探|さが}しているところです。', 'Ima, densha no naka o sagashite iru tokoro desu.', 'Bây giờ (họ) đang tìm trên tàu.'),
        E('かばんに{入|い}れておけばよかったのに。', 'Kaban ni irete okeba yokatta noni.', 'Phải chi đã cất sẵn vào túi. (tiếc nuối)'),
        E('ちょうど{今|いま}、{家|いえ}に{着|つ}いたところです。', 'Choudo ima, ie ni tsuita tokoro desu.', 'Tôi vừa mới về đến nhà.'),
        E('せっかく{届|とど}けてくれたのに、お{礼|れい}が{言|い}えなくて{残念|ざんねん}です。', 'Sekkaku todokete kureta noni, orei ga ienakute zannen desu.', 'Người ta đã mất công mang đến mà tôi không cảm ơn được, tiếc quá.'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ③ — báo mất đồ ở Nhật',
      items: [
        '**{忘|わす}れてしまったんですが……** — báo sự cố bằng **～てしまったんですが** rồi bỏ lửng: người nghe hiểu ngay bạn đang cần giúp (ôn ～んです ポイント 104). Ở Nhật, đồ để quên trên tàu thường được **nhân viên nhà ga (駅員)** tìm lại; đồ đánh rơi ngoài đường thì mang đến **{交番|こうばん}** (đồn nhỏ — Bài 7).',
        '**{聞|き}いてみます／{行|い}ってみます** — ～てみる: "thử hỏi xem", "thử đến xem" (chưa biết kết quả). **{探|さが}しているところです** — đang trong lúc tìm. **{着|つ}いたところです** — vừa mới về tới.',
        '**{入|い}れておけばよかったのに** — ghép ba thứ đã học: ～ておく (Bài 18) + ～ば (Bài 17) + よかった + **のに**: "giá mà đã ~ thì tốt rồi" — tiếc một việc **đã không làm**. Nói một mình hoặc với bạn thân; nói thẳng với người khác ("{言|い}えばよかったのに") nghe như trách.',
        '**せっかく{届|とど}けてくれたのに** — **せっかく～のに** = "đã mất công ~ vậy mà": tiếc vì công sức / cơ hội không được đáp lại. **お{礼|れい}が{言|い}えなくて** — thể khả năng (ôn Bài 16) + ～なくて (lý do).',
        '**{二両目|にりょうめ}** = toa thứ 2 (～{両|りょう} đếm toa tàu, ～{目|め} = thứ ~). **{念|ねん}のため** = để cho chắc. **{届|とど}けを{出|だ}す** = nộp giấy báo (mất đồ). **{降|お}りてすぐ** = vừa xuống là ngay. **{確|たし}かめる** = kiểm tra cho chắc. **{急|いそ}がなくてもいい** (ôn ポイント 116).',
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b19-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 50 từ N4: lỡ làm hỏng & làm sai, mất đồ & tìm đồ, thử nấu ăn, cảm xúc & xin lỗi, lý do & thời gian',
  goal: 'Thuộc 50 từ của chủ đề sự cố: lỡ làm hỏng, làm sai (失敗・ミス・間違える・割る・落とす・汚す・こぼす・破れる・折れる・うっかり・わざと), mất đồ và tìm đồ (落とし物・拾う・見つかる・見つける・気がつく・警察・お巡りさん・泥棒・さっき・やっと), thử nấu ăn (試す・レシピ・混ぜる・焦げる・味見する・温める・冷める), cảm xúc và xin lỗi (謝る・申し訳ありません・許す・気にする・怒る・しかる・泣く・悲しい・がっかり・ほっと), lý do và thời gian (理由・寝坊・乗り遅れる・急に・途中・すっかり・ちゃんと・せっかく) — biết luôn cặp tự / tha để nói ～てしまいました cho đúng trách nhiệm.',
  minutes: 50,
  blocks: [
    {
      t: 'p',
      text: '**50 từ** chia 5 nhóm theo đúng các tình huống của bài: **A** lỡ làm hỏng, làm sai (12) · **B** mất đồ & tìm đồ (11) · **C** thử nấu ăn (8) · **D** cảm xúc & xin lỗi (11) · **E** lý do, thời gian & làm lại (8). Từ đã học ở Bài 1–18 ({割|わ}れる, {落|お}ちる, {汚|よご}れる, {壊|こわ}す, {壊|こわ}れる, {遅刻|ちこく}, {忘|わす}れ{物|もの}, なくす, けが, {交番|こうばん}, {財布|さいふ}, {届|とど}ける, {探|さが}す, びっくり, {安心|あんしん}, {心配|しんぱい}…) KHÔNG lặp lại — gặp trong câu ví dụ thì coi như ôn. Số **1 / 2 / 3** sau động từ = nhóm động từ; dòng **"+"** cho luôn **thể て** (cả bốn mẫu ngữ pháp của bài đều cần) và cặp **tự / tha động từ**. Từ ghi **N3** là từ hơi vượt cấp nhưng rất hay gặp trong chủ đề này.',
    },
    {
      t: 'note',
      title: 'Cách học 50 từ trong 3 ngày',
      items: [
        '**Ngày 1** — nhóm A + B (23 từ): đọc to theo 🔊, che nghĩa tự nói; đọc to hội thoại ① và ③ — phần lớn từ hai nhóm này nằm trong đó. Nhớ theo **cặp tự / tha** ({割|わ}る・{割|わ}れる, {落|お}とす・{落|お}ちる, {見|み}つける・{見|み}つかる).',
        '**Ngày 2** — nhóm C (8 từ): đọc lại hội thoại ②, rồi kể món mình hay nấu bằng các động từ {混|ま}ぜる, {焦|こ}げる, {温|あたた}める, {味見|あじみ}する.',
        '**Ngày 3** — nhóm D + E (19 từ) + thẻ hình + bảng tự / tha + trắc nghiệm cuối mục + viết tay 10 từ hay vào đề.',
        'Romaji: trường âm viết theo kana ({寝坊|ねぼう} → **nebou**, {理由|りゆう} → **riyuu**, {急|きゅう}に → **kyuu ni**, {警察|けいさつ} → **keisatsu**); âm ngắt っ viết đôi phụ âm ({失敗|しっぱい} → **shippai**, うっかり → **ukkari**, ほっと → **hotto**, がっかり → **gakkari**).',
      ],
    },

    /* ── A ── */
    { t: 'h', text: 'A. Lỡ làm hỏng, làm sai (12 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{失敗|しっぱい}します［{失敗|しっぱい}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'shippai shimasu [shippai suru]', vi: 'thất bại, làm hỏng (việc)', ex: '{初|はじ}めてのアルバイトで、たくさん{失敗|しっぱい}しました。', exRo: 'Hajimete no arubaito de, takusan shippai shimashita.', exVi: 'Lần đầu đi làm thêm, tôi hỏng việc rất nhiều lần.', more: '+ て: {失敗|しっぱい}して. **N に{失敗|しっぱい}する** ({試験|しけん}に{失敗|しっぱい}する — thi hỏng). Danh từ: {失敗|しっぱい}が{多|おお}い. Đối: {成功|せいこう}する (thành công — N3). Đọc **しっぱい** (shippai — 失 シツ → しっ, 敗 ハイ → ぱい). Chữ **失・敗** là chữ Hán mới.' },
        { w: 'ミス', pos: 'danh từ / động từ nhóm 3 (ミスする)', ipa: 'misu', vi: 'lỗi, sơ suất (nhỏ)', ex: '{計算|けいさん}のミスに{気|き}がつきませんでした。', exRo: 'Keisan no misu ni ki ga tsukimasen deshita.', exVi: 'Tôi đã không nhận ra lỗi tính toán.', more: 'ミスをする／ミスする. Từ tiếng Anh "miss" — chỉ lỗi nhỏ do sơ ý; {失敗|しっぱい} rộng hơn (cả việc lớn không thành). Xem bảng "Từ dễ nhầm".' },
        { w: '{間違|まちが}えます［{間違|まちが}える］2', pos: 'động từ nhóm 2 (tha động từ)', ipa: 'machigaemasu [machigaeru]', vi: 'nhầm, làm sai', ex: '{電車|でんしゃ}を{間違|まちが}えて、{授業|じゅぎょう}に{遅|おく}れてしまいました。', exRo: 'Densha o machigaete, jugyou ni okurete shimaimashita.', exVi: 'Tôi lên nhầm tàu nên bị muộn giờ học.', more: '+ て: {間違|まちが}えて. **N を{間違|まちが}える** ({道|みち}を{間違|まちが}える — đi nhầm đường, {答|こた}えを{間違|まちが}える). Tự động từ: **{間違|まちが}う** ({答|こた}えが{間違|まちが}っている — đáp án đang sai). Chữ **違** là chữ Hán mới.' },
        { w: '{間違|まちが}い', pos: 'danh từ', ipa: 'machigai', vi: 'chỗ sai, lỗi sai', ex: '{作文|さくぶん}の{間違|まちが}いを{先生|せんせい}に{直|なお}してもらいました。', exRo: 'Sakubun no machigai o sensei ni naoshite moraimashita.', exVi: 'Tôi được thầy sửa cho các lỗi sai trong bài văn.', more: '{間違|まちが}いがある · {間違|まちが}いを{直|なお}す (sửa lỗi). {間違|まちが}い{電話|でんわ} = gọi nhầm số. {間違|まちが}いない = chắc chắn (N3).' },
        { w: '{割|わ}ります［{割|わ}る］1', pos: 'động từ nhóm 1 (tha động từ)', ipa: 'warimasu [waru]', vi: 'làm vỡ (đĩa, kính…); chia', ex: '{皿|さら}を{洗|あら}っているとき、{一枚|いちまい}{割|わ}ってしまいました。', exRo: 'Sara o aratte iru toki, ichimai watte shimaimashita.', exVi: 'Lúc đang rửa bát, tôi lỡ làm vỡ một cái đĩa.', more: '+ て: **{割|わ}って** (watte). Cặp: {皿|さら}**を**{割|わ}る (ai đó làm vỡ — tha) ↔ {皿|さら}**が**{割|わ}れる (vỡ — tự, Bài 15). Nghĩa "chia": {割|わ}り{勘|かん} (chia đều tiền).' },
        { w: '{落|お}とします［{落|お}とす］1', pos: 'động từ nhóm 1 (tha động từ)', ipa: 'otoshimasu [otosu]', vi: 'đánh rơi, làm rơi', ex: '{駅|えき}の{階段|かいだん}でスマホを{落|お}としてしまいました。', exRo: 'Eki no kaidan de sumaho o otoshite shimaimashita.', exVi: 'Tôi lỡ đánh rơi điện thoại ở cầu thang nhà ga.', more: '+ て: {落|お}として. Cặp: N **を**{落|お}とす (tha) ↔ N **が**{落|お}ちる (tự, Bài 15). {落|お}とし{物|もの} = đồ đánh rơi (nhóm B).' },
        { w: '{汚|よご}します［{汚|よご}す］1', pos: 'động từ nhóm 1 (tha động từ)', ipa: 'yogoshimasu [yogosu]', vi: 'làm bẩn', ex: '{借|か}りた{本|ほん}をコーヒーで{汚|よご}してしまいました。', exRo: 'Karita hon o koohii de yogoshite shimaimashita.', exVi: 'Tôi lỡ làm bẩn quyển sách đi mượn vì cà phê.', more: '+ て: {汚|よご}して. Cặp: N **を**{汚|よご}す (tha) ↔ N **が**{汚|よご}れる (tự, Bài 15). Tính từ: {汚|きたな}い (bẩn — đọc きたない).' },
        { w: 'こぼします［こぼす］1', pos: 'động từ nhóm 1 (tha động từ)', ipa: 'koboshimasu [kobosu]', vi: 'làm đổ, làm tràn (nước, cà phê…)', ex: '{机|つくえ}の{上|うえ}にジュースをこぼしてしまいました。', exRo: 'Tsukue no ue ni juusu o koboshite shimaimashita.', exVi: 'Tôi lỡ làm đổ nước trái cây lên bàn.', more: '+ て: こぼして. Cặp: こぼす (tha) ↔ **こぼれる** (tự — tràn ra: {水|みず}がこぼれた). Dùng cho chất lỏng, hạt nhỏ (cơm, đường). N3.' },
        { w: '{破|やぶ}れます［{破|やぶ}れる］2', pos: 'động từ nhóm 2 (tự động từ)', ipa: 'yaburemasu [yabureru]', vi: '(vải, giấy) rách', ex: '{転|ころ}んで、ズボンが{破|やぶ}れてしまいました。', exRo: 'Koronde, zubon ga yaburete shimaimashita.', exVi: 'Tôi bị ngã, quần rách mất rồi.', more: '+ て: {破|やぶ}れて. Tha: **{破|やぶ}る** (xé: {紙|かみ}を{破|やぶ}る). **{約束|やくそく}を{破|やぶ}る** = thất hứa (rất hay gặp). Chữ **破** là chữ Hán mới.' },
        { w: '{折|お}れます［{折|お}れる］2', pos: 'động từ nhóm 2 (tự động từ)', ipa: 'oremasu [oreru]', vi: 'gãy', ex: '{強|つよ}い{風|かぜ}で、{傘|かさ}が{折|お}れてしまいました。', exRo: 'Tsuyoi kaze de, kasa ga orete shimaimashita.', exVi: 'Gió mạnh làm cái ô gãy mất.', more: '+ て: {折|お}れて. Tha: **{折|お}る** (bẻ, gập: {枝|えだ}を{折|お}る, {紙|かみ}を{折|お}る). {骨|ほね}が{折|お}れる／{骨|ほね}を{折|お}る = gãy xương. {折|お}り{紙|がみ} = gấp giấy. Chữ **折** là chữ Hán mới ✍.' },
        { w: 'うっかり', pos: 'phó từ', ipa: 'ukkari', vi: 'lơ đễnh, sơ ý (mà lỡ làm)', ex: 'うっかり{宿題|しゅくだい}を{家|いえ}に{忘|わす}れてしまいました。', exRo: 'Ukkari shukudai o ie ni wasurete shimaimashita.', exVi: 'Tôi sơ ý để quên bài tập ở nhà mất rồi.', more: 'Gần như luôn đi với **～てしまう**: うっかり{寝|ね}てしまった, うっかり{言|い}ってしまった. うっかりする (lơ đễnh). Đối nghĩa: **わざと**. N3.' },
        { w: 'わざと', pos: 'phó từ', ipa: 'wazato', vi: 'cố ý, cố tình', ex: 'わざとじゃないんです。{手|て}が{滑|すべ}ってしまったんです。', exRo: 'Wazato ja nai n desu. Te ga subette shimatta n desu.', exVi: 'Tôi không cố ý đâu. Tại tay tôi bị trơn thôi.', more: 'Câu thanh minh rất hay dùng: **わざとじゃない**／わざとしたんじゃない. Đối nghĩa: うっかり. {手|て}が{滑|すべ}る = trượt tay. N3.' },
      ],
    },

    /* ── B ── */
    { t: 'h', text: 'B. Mất đồ & tìm đồ (11 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{落|お}とし{物|もの}', pos: 'danh từ', ipa: 'otoshimono', vi: 'đồ đánh rơi', ex: '{落|お}とし{物|もの}を{拾|ひろ}ったら、{交番|こうばん}に{届|とど}けてください。', exRo: 'Otoshimono o hirottara, kouban ni todokete kudasai.', exVi: 'Nếu nhặt được đồ đánh rơi, hãy mang đến đồn cảnh sát.', more: '{落|お}とし{物|もの}をする = đánh rơi đồ. Khác **{忘|わす}れ{物|もの}** (Bài 17 — đồ để quên ở một chỗ). Ở nhà ga có {忘|わす}れ{物|もの}センター cho cả hai.' },
        { w: '{拾|ひろ}います［{拾|ひろ}う］1', pos: 'động từ nhóm 1', ipa: 'hiroimasu [hirou]', vi: 'nhặt', ex: '{道|みち}で{財布|さいふ}を{拾|ひろ}って、{交番|こうばん}に{届|とど}けました。', exRo: 'Michi de saifu o hirotte, kouban ni todokemashita.', exVi: 'Tôi nhặt được chiếc ví ngoài đường và mang đến đồn cảnh sát.', more: '+ て: **{拾|ひろ}って** (hirotte). Đối nghĩa: {捨|す}てる (vứt). タクシーを{拾|ひろ}う = vẫy taxi (văn nói).' },
        { w: '{見|み}つかります［{見|み}つかる］1', pos: 'động từ nhóm 1 (tự động từ)', ipa: 'mitsukarimasu [mitsukaru]', vi: '(đồ) được tìm thấy, tìm ra', ex: 'なくした{鍵|かぎ}が{見|み}つかりました。', exRo: 'Nakushita kagi ga mitsukarimashita.', exVi: 'Chiếc chìa khoá bị mất đã tìm thấy rồi.', more: '+ て: {見|み}つかって. N **が**{見|み}つかる. Cũng dùng cho việc làm, phòng: アルバイトが{見|み}つかった (tìm được việc làm thêm).' },
        { w: '{見|み}つけます［{見|み}つける］2', pos: 'động từ nhóm 2 (tha động từ)', ipa: 'mitsukemasu [mitsukeru]', vi: 'tìm thấy, tìm ra', ex: '{駅員|えきいん}さんが{私|わたし}の{傘|かさ}を{見|み}つけてくれました。', exRo: 'Ekiin-san ga watashi no kasa o mitsukete kuremashita.', exVi: 'Nhân viên nhà ga đã tìm thấy cái ô cho tôi.', more: '+ て: {見|み}つけて. N **を**{見|み}つける. **{探|さが}す** (Bài 10) = tìm (quá trình) → **{見|み}つける／{見|み}つかる** = tìm thấy (kết quả). ~~{探|さが}したけど、{探|さが}せなかった~~ → {見|み}つからなかった.' },
        { w: '{気|き}がつきます［{気|き}がつく］1', pos: 'động từ nhóm 1 (cụm)', ipa: 'ki ga tsukimasu [ki ga tsuku]', vi: 'nhận ra, để ý thấy', ex: '{家|いえ}に{帰|かえ}ってから、{財布|さいふ}がないことに{気|き}がつきました。', exRo: 'Ie ni kaette kara, saifu ga nai koto ni ki ga tsukimashita.', exVi: 'Về đến nhà tôi mới nhận ra là không có ví.', more: '+ て: {気|き}がついて. **N に{気|き}がつく** / **～ことに{気|き}がつく**. Cũng viết {気|き}が{付|つ}く. Khác {気|き}をつける (cẩn thận).' },
        { w: '{警察|けいさつ}', pos: 'danh từ', ipa: 'keisatsu', vi: 'cảnh sát (cơ quan)', ex: '{自転車|じてんしゃ}がなくなったので、{警察|けいさつ}に{連絡|れんらく}しました。', exRo: 'Jitensha ga nakunatta node, keisatsu ni renraku shimashita.', exVi: 'Xe đạp bị mất nên tôi đã báo cảnh sát.', more: '{警察官|けいさつかん} (nhân viên cảnh sát) · {警察署|けいさつしょ} (sở cảnh sát). Số khẩn cấp ở Nhật: **110** (cảnh sát), 119 (cứu hoả, cấp cứu). Chữ **警・察** là chữ Hán mới.' },
        { w: 'お{巡|まわ}りさん', pos: 'danh từ', ipa: 'omawari-san', vi: 'chú / anh cảnh sát (cách gọi thân)', ex: '{交番|こうばん}のお{巡|まわ}りさんに{道|みち}を{教|おし}えてもらいました。', exRo: 'Kouban no omawari-san ni michi o oshiete moraimashita.', exVi: 'Tôi được chú cảnh sát ở đồn chỉ đường cho.', more: 'Thường viết **おまわりさん** (chữ 巡 cấp cao). {巡|まわ}る = đi tuần, đi vòng quanh. Trẻ em, người dân gọi cảnh sát như vậy.' },
        { w: '{盗|ぬす}みます［{盗|ぬす}む］1', pos: 'động từ nhóm 1', ipa: 'nusumimasu [nusumu]', vi: 'ăn trộm, lấy cắp', ex: '{泥棒|どろぼう}が{店|みせ}のお{金|かね}を{盗|ぬす}みました。', exRo: 'Dorobou ga mise no okane o nusumimashita.', exVi: 'Tên trộm đã lấy cắp tiền của cửa hàng.', more: '+ て: **{盗|ぬす}んで**. "Bị lấy cắp" = thể bị động {盗|ぬす}まれる — sẽ học ở **Bài 22**; bài này chỉ dùng thể chủ động.' },
        { w: '{泥棒|どろぼう}', pos: 'danh từ', ipa: 'dorobou', vi: 'kẻ trộm', ex: '{夜|よる}、{隣|となり}の{家|いえ}に{泥棒|どろぼう}が{入|はい}りました。', exRo: 'Yoru, tonari no ie ni dorobou ga hairimashita.', exVi: 'Đêm qua có trộm vào nhà bên cạnh.', more: '**{泥棒|どろぼう}が{入|はい}る** = có trộm (đột nhập). {泥棒|どろぼう}に{入|はい}られる (bị trộm vào — Bài 22). Văn báo chí: {窃盗|せっとう} (N1).' },
        { w: 'さっき', pos: 'phó từ / danh từ', ipa: 'sakki', vi: 'lúc nãy, vừa nãy', ex: 'さっき{駅|えき}に{着|つ}いたところです。', exRo: 'Sakki eki ni tsuita tokoro desu.', exVi: 'Tôi vừa mới tới ga lúc nãy.', more: 'Văn nói; lịch sự: **{先|さき}ほど** (さきほど). Hay đi với **Vたところ** (vừa mới). Khác もうすぐ (sắp — tương lai).' },
        { w: 'やっと', pos: 'phó từ', ipa: 'yatto', vi: 'cuối cùng thì (sau bao vất vả)', ex: '{一時間|いちじかん}{探|さが}して、やっと{見|み}つかりました。', exRo: 'Ichijikan sagashite, yatto mitsukarimashita.', exVi: 'Tìm một tiếng đồng hồ, cuối cùng cũng thấy.', more: 'Kèm cảm giác **nhẹ nhõm** vì đã chờ, đã cố: やっと{終|お}わった！. Không dùng cho kết quả xấu (~~やっと{落|お}ちた~~).' },
      ],
    },

    /* ── C ── */
    { t: 'h', text: 'C. Thử nấu ăn (8 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{試|ため}します［{試|ため}す］1', pos: 'động từ nhóm 1', ipa: 'tameshimasu [tamesu]', vi: 'thử (một cách làm, một món đồ)', ex: '{新|あたら}しい{作|つく}り{方|かた}を{試|ため}してみました。', exRo: 'Atarashii tsukurikata o tameshite mimashita.', exVi: 'Tôi đã thử một cách làm mới.', more: '+ て: {試|ため}して. **N を{試|ため}す** — tân ngữ là CÁCH LÀM / ĐỒ VẬT; còn **～てみる** đứng sau một động từ ({食|た}べてみる). Ghép được: {試|ため}してみる. Chữ 試 đã học (Bài 6: {試験|しけん}). N3.' },
        { w: 'レシピ', pos: 'danh từ', ipa: 'reshipi', vi: 'công thức nấu ăn', ex: 'レシピのとおりに{作|つく}ったのに、おいしくなりませんでした。', exRo: 'Reshipi no toori ni tsukutta noni, oishiku narimasen deshita.', exVi: 'Đã làm đúng theo công thức vậy mà không ngon.', more: '**N のとおりに** = theo đúng N ({説明|せつめい}のとおりに, {地図|ちず}のとおりに). Từ tiếng Anh "recipe". Sách nấu ăn: {料理|りょうり}の{本|ほん}.' },
        { w: '{混|ま}ぜます［{混|ま}ぜる］2', pos: 'động từ nhóm 2 (tha động từ)', ipa: 'mazemasu [mazeru]', vi: 'trộn, khuấy', ex: '{卵|たまご}と{牛乳|ぎゅうにゅう}をよく{混|ま}ぜてください。', exRo: 'Tamago to gyuunyuu o yoku mazete kudasai.', exVi: 'Hãy trộn đều trứng với sữa.', more: '+ て: {混|ま}ぜて. Tự động từ: {混|ま}ざる (được trộn lẫn). A と B を{混|ま}ぜる / A に B を{混|ま}ぜる. Chữ 混 (Bài 15: {混|こ}む — đông).' },
        { w: '{焦|こ}げます［{焦|こ}げる］2', pos: 'động từ nhóm 2 (tự động từ)', ipa: 'kogemasu [kogeru]', vi: '(đồ ăn) cháy, khét', ex: '{火|ひ}が{強|つよ}すぎて、{魚|さかな}が{焦|こ}げてしまいました。', exRo: 'Hi ga tsuyosugite, sakana ga kogete shimaimashita.', exVi: 'Lửa to quá nên cá bị cháy mất.', more: '+ て: {焦|こ}げて. Tha: **{焦|こ}がす** (làm cháy: パンを{焦|こ}がした). ⚠ Nhà cháy, rác cháy là {燃|も}える (Bài 18); đồ ăn cháy khét là {焦|こ}げる. Chữ 焦 cấp cao — đọc được là đủ. N3.' },
        { w: '{味見|あじみ}します［{味見|あじみ}する］3', pos: 'động từ nhóm 3', ipa: 'ajimi shimasu [ajimi suru]', vi: 'nếm thử (khi đang nấu)', ex: '{塩|しお}を{入|い}れる{前|まえ}に、ちょっと{味見|あじみ}してみて。', exRo: 'Shio o ireru mae ni, chotto ajimi shite mite.', exVi: 'Trước khi cho muối, cậu nếm thử một chút xem.', more: '+ て: {味見|あじみ}して. {味|あじ} (vị) + {見|み}る (xem) — "xem vị". Ăn thử món đã nấu xong thì nói **{食|た}べてみる**. N3.' },
        { w: '{温|あたた}めます［{温|あたた}める］2', pos: 'động từ nhóm 2 (tha động từ)', ipa: 'atatamemasu [atatameru]', vi: 'hâm nóng, làm ấm (đồ ăn, nước…)', ex: 'お{弁当|べんとう}を{電子|でんし}レンジで{温|あたた}めました。', exRo: 'Obentou o denshi renji de atatamemashita.', exVi: 'Tôi hâm nóng cơm hộp bằng lò vi sóng.', more: '+ て: {温|あたた}めて. Tự: {温|あたた}まる. Ở コンビニ: 「お{弁当|べんとう}、{温|あたた}めますか。」 Làm ấm PHÒNG viết **{暖|あたた}める** (cùng đọc).' },
        { w: '{冷|さ}めます［{冷|さ}める］2', pos: 'động từ nhóm 2 (tự động từ)', ipa: 'samemasu [sameru]', vi: '(đồ nóng) nguội đi', ex: '{早|はや}く{食|た}べないと、{料理|りょうり}が{冷|さ}めてしまいますよ。', exRo: 'Hayaku tabenai to, ryouri ga samete shimaimasu yo.', exVi: 'Không ăn nhanh thì đồ ăn nguội mất đấy.', more: '+ て: {冷|さ}めて. Tha: {冷|さ}ます (để nguội). ⚠ **{冷|さ}める** = nóng → nguội; **{冷|ひ}える** = trở nên lạnh ({冷|ひ}えたビール). Cùng chữ 冷, hai cách đọc.' },
        { w: '{生|なま}', pos: 'danh từ / tính từ な', ipa: 'nama', vi: 'sống (chưa nấu chín); tươi', ex: 'この{肉|にく}はまだ{生|なま}ですから、もう{少|すこ}し{焼|や}いてください。', exRo: 'Kono niku wa mada nama desu kara, mou sukoshi yaite kudasai.', exVi: 'Miếng thịt này còn sống, nướng thêm chút nữa nhé.', more: '{生|なま}{卵|たまご} (trứng sống) · {生|なま}ビール (bia tươi) · {生|なま}{放送|ほうそう} (truyền hình trực tiếp). 生 đọc **なま** khi nghĩa "sống, tươi" (khác {学生|がくせい}, {生|う}まれる).' },
      ],
    },

    /* ── D ── */
    { t: 'h', text: 'D. Cảm xúc & xin lỗi (11 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{謝|あやま}ります［{謝|あやま}る］1', pos: 'động từ nhóm 1', ipa: 'ayamarimasu [ayamaru]', vi: 'xin lỗi, tạ lỗi', ex: '{約束|やくそく}の{時間|じかん}に{遅|おく}れたので、{友達|ともだち}に{謝|あやま}りました。', exRo: 'Yakusoku no jikan ni okureta node, tomodachi ni ayamarimashita.', exVi: 'Tôi đến muộn giờ hẹn nên đã xin lỗi bạn.', more: '+ て: {謝|あやま}って. **人に{謝|あやま}る**. ⚠ Khi trực tiếp xin lỗi, nói **すみません／{申|もう}し{訳|わけ}ありません**, không nói ~~{謝|あやま}ります~~; {謝|あやま}る dùng để KỂ việc xin lỗi. Chữ **謝** là chữ Hán mới.' },
        { w: '{申|もう}し{訳|わけ}ありません', pos: 'cụm cố định', ipa: 'moushiwake arimasen', vi: 'thành thật xin lỗi (rất lịch sự)', ex: 'お{待|ま}たせして、{申|もう}し{訳|わけ}ありません。', exRo: 'Omatase shite, moushiwake arimasen.', exVi: 'Thành thật xin lỗi vì đã để quý khách phải chờ.', more: 'Dùng với khách, người trên, trong công việc. Bậc: ごめん → ごめんなさい → すみません → **{申|もう}し{訳|わけ}ありません** → {申|もう}し{訳|わけ}ございません. Câu tiếp theo thường là {次|つぎ}から{気|き}をつけます.' },
        { w: '{許|ゆる}します［{許|ゆる}す］1', pos: 'động từ nhóm 1', ipa: 'yurushimasu [yurusu]', vi: 'tha thứ; cho phép', ex: '{正直|しょうじき}に{謝|あやま}ったら、{友達|ともだち}は{許|ゆる}してくれました。', exRo: 'Shoujiki ni ayamattara, tomodachi wa yurushite kuremashita.', exVi: 'Tôi thật lòng xin lỗi, và bạn đã tha thứ cho tôi.', more: '+ て: {許|ゆる}して. 「{許|ゆる}してください」 (xin hãy tha thứ). {正直|しょうじき}に = thành thật (chữ 直 mới). N3.' },
        { w: '{気|き}にします［{気|き}にする］3', pos: 'động từ nhóm 3 (cụm)', ipa: 'ki ni shimasu [ki ni suru]', vi: 'bận tâm, để bụng, lo lắng', ex: '{小|ちい}さい{失敗|しっぱい}は{気|き}にしないでください。', exRo: 'Chiisai shippai wa ki ni shinaide kudasai.', exVi: 'Đừng bận tâm những thất bại nhỏ.', more: 'Câu an ủi CỐ ĐỊNH: **{気|き}にしないで(ください)** · **{気|き}にしなくていいよ**. N を{気|き}にする ({人|ひと}の{目|め}を{気|き}にする — để ý ánh mắt người khác).' },
        { w: '{怒|おこ}ります［{怒|おこ}る］1', pos: 'động từ nhóm 1', ipa: 'okorimasu [okoru]', vi: 'giận, nổi giận', ex: '{弟|おとうと}が{私|わたし}のケーキを{食|た}べてしまったので、{怒|おこ}りました。', exRo: 'Otouto ga watashi no keeki o tabete shimatta node, okorimashita.', exVi: 'Em trai ăn mất cái bánh của tôi nên tôi nổi giận.', more: '+ て: **{怒|おこ}って**. Tả người đang giận: {怒|おこ}っている. 人に{怒|おこ}る (giận ai). "Bị mắng" = {怒|おこ}られる (Bài 22). Chữ **怒** là chữ Hán mới.' },
        { w: 'しかります［しかる］1', pos: 'động từ nhóm 1', ipa: 'shikarimasu [shikaru]', vi: 'mắng, la (người dưới — để dạy)', ex: '{子|こ}どもが{道|みち}で{走|はし}ったので、{母親|ははおや}がしかりました。', exRo: 'Kodomo ga michi de hashitta node, hahaoya ga shikarimashita.', exVi: 'Đứa trẻ chạy ngoài đường nên người mẹ mắng.', more: '+ て: しかって. Chữ Hán {叱|しか}る cấp cao — thường viết かな. Khác {怒|おこ}る: {怒|おこ}る là **cảm xúc** giận; しかる là **mắng để dạy** (cha mẹ → con, thầy → trò).' },
        { w: '{泣|な}きます［{泣|な}く］1', pos: 'động từ nhóm 1', ipa: 'nakimasu [naku]', vi: 'khóc', ex: '{試験|しけん}に{落|お}ちて、{泣|な}いてしまいました。', exRo: 'Shiken ni ochite, naite shimaimashita.', exVi: 'Thi trượt, tôi đã bật khóc.', more: '+ て: **{泣|な}いて** (く → いて). Đồng âm: {鳴|な}く (chim, mèo kêu). {泣|な}きそう (sắp khóc — Bài 20).' },
        { w: '{悲|かな}しい', pos: 'tính từ い', ipa: 'kanashii', vi: 'buồn', ex: '{大切|たいせつ}な{写真|しゃしん}をなくして、とても{悲|かな}しいです。', exRo: 'Taisetsu na shashin o nakushite, totemo kanashii desu.', exVi: 'Làm mất tấm ảnh quan trọng, tôi buồn lắm.', more: 'Người khác buồn: {悲|かな}しんでいる (悲しむ). Khác **{寂|さび}しい** (cô đơn, nhớ — Bài 11) và **{残念|ざんねん}** (tiếc). Chữ **悲** là chữ Hán mới ✍.' },
        { w: 'がっかりします［がっかりする］3', pos: 'động từ nhóm 3', ipa: 'gakkari shimasu [gakkari suru]', vi: 'thất vọng, cụt hứng', ex: '{楽|たの}しみにしていたのに、{旅行|りょこう}が{中止|ちゅうし}になって、がっかりしました。', exRo: 'Tanoshimi ni shite ita noni, ryokou ga chuushi ni natte, gakkari shimashita.', exVi: 'Đã mong chờ vậy mà chuyến đi bị huỷ, tôi thất vọng quá.', more: 'Rất hay đi với **～のに**. Kết quả kém kỳ vọng: {結果|けっか}を{見|み}て、がっかりした. N3.' },
        { w: 'ほっとします［ほっとする］3', pos: 'động từ nhóm 3', ipa: 'hotto shimasu [hotto suru]', vi: 'thở phào, nhẹ nhõm', ex: '{財布|さいふ}が{見|み}つかって、ほっとしました。', exRo: 'Saifu ga mitsukatte, hotto shimashita.', exVi: 'Tìm thấy ví, tôi thở phào nhẹ nhõm.', more: 'Sau khi lo lắng mà kết quả tốt. Gần nghĩa: {安心|あんしん}する (Bài 17). N3.' },
        { w: '{恥|は}ずかしい', pos: 'tính từ い', ipa: 'hazukashii', vi: 'xấu hổ, ngượng', ex: 'みんなの{前|まえ}で{間違|まちが}えて、{恥|は}ずかしかったです。', exRo: 'Minna no mae de machigaete, hazukashikatta desu.', exVi: 'Nói sai trước mặt mọi người, tôi xấu hổ lắm.', more: 'Cảm giác khi thất bại trước người khác, hoặc ngượng ngùng. Chữ 恥 cấp cao — đọc được là đủ.' },
      ],
    },

    /* ── E ── */
    { t: 'h', text: 'E. Lý do, thời gian & làm lại (8 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{理由|りゆう}', pos: 'danh từ', ipa: 'riyuu', vi: 'lý do', ex: '{遅|おく}れた{理由|りゆう}を{店長|てんちょう}に{説明|せつめい}しました。', exRo: 'Okureta riyuu o tenchou ni setsumei shimashita.', exVi: 'Tôi đã giải thích lý do đến muộn với quản lý.', more: '{理由|りゆう}を{聞|き}く／{言|い}う. Câu hỏi: どうしてですか ≈ {理由|りゆう}は{何|なん}ですか. {原因|げんいん} (nguyên nhân — N3) dùng cho sự cố, tai nạn.' },
        { w: '{寝坊|ねぼう}します［{寝坊|ねぼう}する］3', pos: 'động từ nhóm 3', ipa: 'nebou shimasu [nebou suru]', vi: 'ngủ quên, dậy muộn', ex: '{今朝|けさ}{寝坊|ねぼう}して、{一時間目|いちじかんめ}の{授業|じゅぎょう}に{遅|おく}れてしまいました。', exRo: 'Kesa nebou shite, ichijikanme no jugyou ni okurete shimaimashita.', exVi: 'Sáng nay tôi ngủ quên nên muộn tiết học đầu.', more: '+ て: {寝坊|ねぼう}して. Lý do đi muộn phổ biến nhất — khi báo với người trên nói thành thật: {寝坊|ねぼう}してしまいました。{申|もう}し{訳|わけ}ありません.' },
        { w: '{乗|の}り{遅|おく}れます［{乗|の}り{遅|おく}れる］2', pos: 'động từ nhóm 2', ipa: 'noriokuremasu [noriokureru]', vi: 'lỡ (tàu, xe, máy bay)', ex: '{急|いそ}いだのに、{最終電車|さいしゅうでんしゃ}に{乗|の}り{遅|おく}れてしまいました。', exRo: 'Isoida noni, saishuu densha ni noriokurete shimaimashita.', exVi: 'Đã vội vậy mà vẫn lỡ chuyến tàu cuối.', more: '+ て: {乗|の}り{遅|おく}れて. **N に{乗|の}り{遅|おく}れる**. {乗|の}る (lên xe) + {遅|おく}れる (muộn). Đối: {間|ま}に{合|あ}う (Bài 15 — kịp).' },
        { w: '{急|きゅう}に', pos: 'phó từ', ipa: 'kyuu ni', vi: 'đột nhiên, bất ngờ', ex: '{急|きゅう}にパソコンが{動|うご}かなくなりました。', exRo: 'Kyuu ni pasokon ga ugokanaku narimashita.', exVi: 'Tự nhiên máy tính không chạy nữa.', more: '{急|きゅう}に{雨|あめ}が{降|ふ}ってきた · {急|きゅう}に{用事|ようじ}ができた (đột nhiên có việc — lý do huỷ hẹn rất hay dùng). {急|きゅう}な (tính từ): {急|きゅう}な{用事|ようじ}.' },
        { w: '{途中|とちゅう}', pos: 'danh từ', ipa: 'tochuu', vi: 'giữa chừng, dọc đường', ex: '{学校|がっこう}へ{行|い}く{途中|とちゅう}で、{忘|わす}れ{物|もの}に{気|き}がつきました。', exRo: 'Gakkou e iku tochuu de, wasuremono ni ki ga tsukimashita.', exVi: 'Trên đường đến trường tôi mới nhận ra để quên đồ.', more: '**V る／N の + {途中|とちゅう}で** (đang giữa lúc ~ thì). {途中|とちゅう}まで (đến giữa chừng): {途中|とちゅう}まで{書|か}いた. {途中|とちゅう}でやめる (bỏ dở).' },
        { w: 'すっかり', pos: 'phó từ', ipa: 'sukkari', vi: 'hoàn toàn, sạch trơn', ex: '{友達|ともだち}との{約束|やくそく}をすっかり{忘|わす}れてしまいました。', exRo: 'Tomodachi to no yakusoku o sukkari wasurete shimaimashita.', exVi: 'Tôi quên sạch cuộc hẹn với bạn mất rồi.', more: 'Hay đi với ～てしまう: すっかり{忘|わす}れてしまった, すっかり{暗|くら}くなった (trời tối hẳn). すっかり{元気|げんき}になった (khoẻ hẳn rồi). N3.' },
        { w: 'ちゃんと', pos: 'phó từ', ipa: 'chanto', vi: 'đàng hoàng, cẩn thận, đúng như phải làm', ex: 'ちゃんと{確認|かくにん}したのに、{名前|なまえ}を{間違|まちが}えてしまいました。', exRo: 'Chanto kakunin shita noni, namae o machigaete shimaimashita.', exVi: 'Đã kiểm tra cẩn thận rồi mà vẫn viết nhầm tên.', more: 'Văn nói; văn viết, lịch sự: **きちんと**. ちゃんと{食|た}べる (ăn uống đầy đủ) · ちゃんと{謝|あやま}る (xin lỗi đàng hoàng).' },
        { w: 'せっかく', pos: 'phó từ', ipa: 'sekkaku', vi: 'đã mất công; hiếm khi có dịp', ex: 'せっかく{作|つく}ったのに、{誰|だれ}も{食|た}べてくれませんでした。', exRo: 'Sekkaku tsukutta noni, daremo tabete kuremasen deshita.', exVi: 'Đã mất công nấu vậy mà chẳng ai ăn cho.', more: 'Hai cách dùng: **せっかく～のに** (tiếc công — Ngữ pháp ④) · **せっかく～から／せっかくの N** (nhân dịp hiếm có: せっかく{日本|にほん}に{来|き}たから、{富士山|ふじさん}に{登|のぼ}りたい). N3.' },
      ],
    },

    {
      t: 'hinh',
      title: '🖼️ Thẻ từ có hình — nhìn hình nói ra từ (chạm thẻ để nghe)',
      items: [
        { anh: 'cross-mark', w: '{失敗|しっぱい}します', ro: 'shippai shimasu', vi: 'thất bại (hình: dấu ✗)' },
        { anh: 'face-with-hand-over-mouth', w: 'うっかり', ro: 'ukkari', vi: 'sơ ý, lỡ ("ối!")' },
        { anh: 'collision', w: '{割|わ}ります', ro: 'warimasu', vi: 'làm vỡ (hình: "choang")' },
        { anh: 'droplet', w: 'こぼします', ro: 'koboshimasu', vi: 'làm đổ (nước…)' },
        { anh: 'jeans', w: 'ズボンが{破|やぶ}れます', ro: 'zubon ga yaburemasu', vi: 'quần bị rách' },
        { anh: 'bone', w: '{骨|ほね}が{折|お}れます', ro: 'hone ga oremasu', vi: 'gãy xương' },
        { anh: 'purse', w: '{財布|さいふ}を{落|お}とします', ro: 'saifu o otoshimasu', vi: 'đánh rơi ví' },
        { anh: 'magnifying-glass-tilted-left', w: '{見|み}つけます', ro: 'mitsukemasu', vi: 'tìm thấy (hình: kính lúp)' },
        { anh: 'light-bulb', w: '{気|き}がつきます', ro: 'ki ga tsukimasu', vi: 'nhận ra (hình: bóng đèn "à!")' },
        { anh: 'police-car', w: '{警察|けいさつ}', ro: 'keisatsu', vi: 'cảnh sát (hình: xe cảnh sát)' },
        { anh: 'police-officer', w: 'お{巡|まわ}りさん', ro: 'omawari-san', vi: 'chú cảnh sát' },
        { anh: 'test-tube', w: '{試|ため}します', ro: 'tameshimasu', vi: 'thử (hình: ống nghiệm)' },
        { anh: 'memo', w: 'レシピ', ro: 'reshipi', vi: 'công thức nấu ăn (hình: tờ ghi)' },
        { anh: 'bowl-with-spoon', w: '{混|ま}ぜます', ro: 'mazemasu', vi: 'trộn, khuấy' },
        { anh: 'fire', w: '{焦|こ}げます', ro: 'kogemasu', vi: 'cháy khét (hình: ngọn lửa)' },
        { anh: 'spoon', w: '{味見|あじみ}します', ro: 'ajimi shimasu', vi: 'nếm thử (hình: cái thìa)' },
        { anh: 'steaming-bowl', w: '{温|あたた}めます', ro: 'atatamemasu', vi: 'hâm nóng (hình: bát bốc hơi)' },
        { anh: 'egg', w: '{生|なま}{卵|たまご}', ro: 'nama tamago', vi: 'trứng sống' },
        { anh: 'person-bowing', w: '{謝|あやま}ります', ro: 'ayamarimasu', vi: 'xin lỗi (hình: cúi đầu)' },
        { anh: 'angry-face', w: '{怒|おこ}ります', ro: 'okorimasu', vi: 'nổi giận' },
        { anh: 'loudly-crying-face', w: '{泣|な}きます', ro: 'nakimasu', vi: 'khóc' },
        { anh: 'disappointed-face', w: 'がっかりします', ro: 'gakkari shimasu', vi: 'thất vọng' },
        { anh: 'relieved-face', w: 'ほっとします', ro: 'hotto shimasu', vi: 'thở phào nhẹ nhõm' },
        { anh: 'sleeping-face', w: '{寝坊|ねぼう}します', ro: 'nebou shimasu', vi: 'ngủ quên' },
      ],
    },
    {
      t: 'table',
      caption: 'Cặp động từ TỰ / THA của bài — và ～てしまいました với mỗi loại (chìa khoá để xin lỗi đúng)',
      head: ['Tha động từ (ai đó LÀM — N を)', 'Tự động từ (tự XẢY RA — N が)', 'Romaji', '～てしまいました'],
      rows: [
        ['{割|わ}る (làm vỡ)', '{割|わ}れる (vỡ)', 'waru / wareru', '{皿|さら}を{割|わ}ってしまいました ／ {皿|さら}が{割|わ}れてしまいました'],
        ['{落|お}とす (đánh rơi)', '{落|お}ちる (rơi)', 'otosu / ochiru', 'スマホを{落|お}としてしまいました ／ スマホが{落|お}ちてしまいました'],
        ['{汚|よご}す (làm bẩn)', '{汚|よご}れる (bẩn)', 'yogosu / yogoreru', '{本|ほん}を{汚|よご}してしまいました ／ {本|ほん}が{汚|よご}れてしまいました'],
        ['こぼす (làm đổ)', 'こぼれる (tràn ra)', 'kobosu / koboreru', 'コーヒーをこぼしてしまいました ／ コーヒーがこぼれてしまいました'],
        ['{破|やぶ}る (xé)', '{破|やぶ}れる (rách)', 'yaburu / yabureru', '{紙|かみ}を{破|やぶ}ってしまいました ／ ズボンが{破|やぶ}れてしまいました'],
        ['{折|お}る (bẻ gãy)', '{折|お}れる (gãy)', 'oru / oreru', '{枝|えだ}を{折|お}ってしまいました ／ {傘|かさ}が{折|お}れてしまいました'],
        ['{壊|こわ}す (làm hỏng — Bài 18)', '{壊|こわ}れる (hỏng — Bài 15)', 'kowasu / kowareru', 'パソコンを{壊|こわ}してしまいました ／ パソコンが{壊|こわ}れてしまいました'],
        ['{見|み}つける (tìm thấy)', '{見|み}つかる (được tìm thấy)', 'mitsukeru / mitsukaru', '— ({見|み}つかってよかった)'],
        ['{焦|こ}がす (làm cháy)', '{焦|こ}げる (cháy khét)', 'kogasu / kogeru', 'パンを{焦|こ}がしてしまいました ／ パンが{焦|こ}げてしまいました'],
        ['{冷|さ}ます (để nguội)', '{冷|さ}める (nguội)', 'samasu / sameru', '— ／ {料理|りょうり}が{冷|さ}めてしまいました'],
        ['{温|あたた}める (hâm nóng)', '{温|あたた}まる (ấm lên)', 'atatameru / atatamaru', '— (thường không dùng với しまう)'],
        ['{混|ま}ぜる (trộn)', '{混|ま}ざる (lẫn vào)', 'mazeru / mazaru', '— ／ ごみが{混|ま}ざってしまいました'],
      ],
    },
    {
      t: 'note',
      title: '⚠ Xin lỗi bằng TỰ hay THA động từ? — chỗ người Việt hay sai',
      items: [
        '**Tha động từ + てしまいました** = "TÔI lỡ làm…" → **nhận trách nhiệm**: すみません、お{皿|さら}を{割|わ}ってしまいました. Đây là câu nên nói khi chính mình làm hỏng.',
        '**Tự động từ + てしまいました** = "(nó) bị … mất rồi" → chỉ tả sự việc: お{皿|さら}が{割|わ}れてしまいました. Nếu chính bạn làm vỡ mà nói câu này với quản lý, nghe như **đổ lỗi cho cái đĩa** — người Nhật rất để ý chỗ này.',
        'Dùng tự động từ khi **thật sự không ai làm**: {風|かぜ}で{傘|かさ}が{折|お}れてしまいました · {急|きゅう}にパソコンが{壊|こわ}れてしまいました.',
      ],
    },
    {
      t: 'note',
      title: 'Từ dễ nhầm trong bài',
      items: [
        '**{失敗|しっぱい} ↔ ミス ↔ {間違|まちが}い** — {失敗|しっぱい}: việc **không thành** (thi hỏng, nấu hỏng, kế hoạch đổ bể). ミス: **lỗi nhỏ do sơ ý** (gõ sai, tính sai). {間違|まちが}い: **chỗ sai** so với cái đúng (đáp án sai, nhầm tên). Một bài văn có nhiều {間違|まちが}い; một lần thi bị {失敗|しっぱい}.',
        '**{探|さが}す ↔ {見|み}つける ↔ {見|み}つかる** — {探|さが}す = đang tìm (quá trình); {見|み}つける = (người) tìm ra — tha, N を; {見|み}つかる = (đồ) được tìm thấy — tự, N が. ~~{財布|さいふ}を{探|さが}しました。でも{探|さが}せませんでした~~ → {見|み}つかりませんでした.',
        '**{落|お}とし{物|もの} ↔ {忘|わす}れ{物|もの}** — {落|お}とし{物|もの}: đánh rơi (không biết rơi ở đâu); {忘|わす}れ{物|もの} (Bài 17): để quên ở một chỗ (trên tàu, trong lớp).',
        '**{怒|おこ}る ↔ しかる** — {怒|おこ}る: cảm xúc giận (ai cũng có thể giận ai); しかる: người trên mắng người dưới **để dạy**. Bạn bè giận nhau → {怒|おこ}る, không dùng しかる.',
        '**{謝|あやま}る ↔ すみません** — {謝|あやま}る là động từ để KỂ ({友達|ともだち}に{謝|あやま}りました); lúc xin lỗi trực tiếp thì nói すみません／ごめんなさい／{申|もう}し{訳|わけ}ありません.',
        '**{冷|さ}める ↔ {冷|ひ}える** — {料理|りょうり}が{冷|さ}める (đồ nóng nguội đi — tiếc); ビールが{冷|ひ}える (lạnh đi — tốt). **{温|あたた}める ↔ {暖|あたた}める**: đồ ăn, nước → {温|あたた}める; phòng, không khí → {暖|あたた}める.',
        '**{悲|かな}しい ↔ {寂|さび}しい ↔ {残念|ざんねん}** — {悲|かな}しい: buồn đau (mất đồ quý, chia tay); {寂|さび}しい: cô đơn, nhớ người; {残念|ざんねん}: tiếc (kết quả không như mong).',
        '**うっかり ↔ わざと** — うっかり: sơ ý (không cố); わざと: cố tình. Thanh minh: わざとじゃないんです、うっかりしていました.',
        '**{試|ため}す ↔ ～てみる** — {新|あたら}しい{方法|ほうほう}を{試|ため}す (tân ngữ là danh từ); {作|つく}ってみる (sau động từ). ~~{食|た}べを{試|ため}す~~ → {食|た}べてみる.',
      ],
    },
    {
      t: 'note',
      title: 'Kết hợp từ (コロケーション) nên học thành cụm',
      items: [
        '{注文|ちゅうもん}**を{間違|まちが}える** · {道|みち}**を{間違|まちが}える** · {試験|しけん}**に{失敗|しっぱい}する** · ミス**をする** · {間違|まちが}い**を{直|なお}す**',
        '{皿|さら}**を{割|わ}る** · {財布|さいふ}**を{落|お}とす** · {服|ふく}**を{汚|よご}す** · コーヒー**をこぼす** · ズボン**が{破|やぶ}れる** · {約束|やくそく}**を{破|やぶ}る** · {骨|ほね}**が{折|お}れる**',
        '{落|お}とし{物|もの}**を{拾|ひろ}う** · {交番|こうばん}**に{届|とど}ける** · {警察|けいさつ}**に{連絡|れんらく}する** · {泥棒|どろぼう}**が{入|はい}る** · ～こと**に{気|き}がつく** · {鍵|かぎ}**が{見|み}つかる**',
        '{材料|ざいりょう}**を{混|ま}ぜる** · {魚|さかな}**が{焦|こ}げる** · お{弁当|べんとう}**を{温|あたた}める** · {料理|りょうり}**が{冷|さ}める** · {新|あたら}しい{方法|ほうほう}**を{試|ため}す**',
        '{友達|ともだち}**に{謝|あやま}る** · {心|こころ}から{謝|あやま}る · {失敗|しっぱい}**を{気|き}にする** · {子|こ}ども**をしかる** · {大声|おおごえ}**で{泣|な}く** · {電車|でんしゃ}**に{乗|の}り{遅|おく}れる** · {理由|りゆう}**を{説明|せつめい}する**',
      ],
    },
    {
      t: 'write',
      id: 'b19-viet-tu',
      title: 'Viết tay 10 từ hay vào đề',
      note: 'Dòng trên tô theo mẫu, dòng dưới tự viết. Bật "Che mẫu" để tự nhớ ra từ chỉ từ gợi ý nghĩa.',
      chars: ['失敗', '間違い', '理由', '警察', '落とし物', '気がつく', '拾う', '謝る', '悲しい', '途中'],
      goi: {
        '失敗': 'しっぱい · thất bại',
        '間違い': 'まちがい · chỗ sai',
        '理由': 'りゆう · lý do',
        '警察': 'けいさつ · cảnh sát',
        '落とし物': 'おとしもの · đồ đánh rơi',
        '気がつく': 'きがつく · nhận ra',
        '拾う': 'ひろう · nhặt',
        '謝る': 'あやまる · xin lỗi',
        '悲しい': 'かなしい · buồn',
        '途中': 'とちゅう · giữa chừng',
      },
    },
    {
      t: 'mcq',
      id: 'b19-tv-trac-nghiem',
      title: 'Kiểm tra từ vựng — 14 câu (dạng 文脈規定・言い換え của đề N4)',
      items: [
        { q: '{急|いそ}いでいたので、{駅|えき}で{切符|きっぷ}を（　）しまいました。', options: ['{落|お}として', '{落|お}ちて', '{拾|ひろ}って', '{見|み}つかって'], correct: 0, why: 'Tôi (người làm) đánh rơi vé → tha động từ **{落|お}とす** + を. {落|お}ちる là tự động từ, không đi với を. 〔Eki de kippu o otoshite shimaimashita.〕' },
        { q: '{道|みち}で{財布|さいふ}を（　）ので、{交番|こうばん}に{届|とど}けました。', options: ['{盗|ぬす}んだ', '{拾|ひろ}った', '{割|わ}った', '{試|ため}した'], correct: 1, why: 'Nhặt được rồi mang đến đồn = **{拾|ひろ}う**. 〔Michi de saifu o hirotta node, kouban ni todokemashita.〕' },
        { q: 'なくした{鍵|かぎ}がかばんの{中|なか}から（　）。', options: ['{見|み}つけました', '{探|さが}しました', '{見|み}つかりました', '{気|き}がつきました'], correct: 2, why: 'Đồ (鍵が) được tìm thấy → tự động từ **{見|み}つかる**. 〔Kagi ga kaban no naka kara mitsukarimashita.〕' },
        { q: '{強|つよ}い{風|かぜ}で、{傘|かさ}が（　）しまいました。', options: ['{破|やぶ}って', '{折|お}って', '{割|わ}って', '{折|お}れて'], correct: 3, why: 'Không ai làm, gió làm gãy → tự động từ **{折|お}れる** (傘が). 〔Kasa ga orete shimaimashita.〕' },
        { q: '{電子|でんし}レンジでお{弁当|べんとう}を（　）。', options: ['{温|あたた}めました', '{冷|さ}めました', '{焦|こ}げました', '{混|ま}ざりました'], correct: 0, why: 'Hâm nóng đồ ăn = **{温|あたた}める** (tha, を). 〔Obentou o atatamemashita.〕' },
        { q: '{火|ひ}が{強|つよ}すぎて、パンが（　）しまいました。', options: ['{冷|さ}めて', '{焦|こ}げて', '{温|あたた}めて', '{燃|も}やして'], correct: 1, why: 'Đồ ăn cháy khét = **{焦|こ}げる**. 〔Pan ga kogete shimaimashita.〕' },
        { q: '{遅|おく}れて{行|い}ったので、{友達|ともだち}に（　）。', options: ['{謝|あやま}りました', 'しかりました', '{許|ゆる}しました', 'ほっとしました'], correct: 0, why: 'Mình đến muộn → mình xin lỗi bạn = **{友達|ともだち}に{謝|あやま}る**. 〔Tomodachi ni ayamarimashita.〕' },
        { q: '{子|こ}どもが{危|あぶ}ないことをしたので、{先生|せんせい}が（　）。', options: ['{泣|な}きました', '{謝|あやま}りました', 'しかりました', 'がっかりしました'], correct: 2, why: 'Người trên mắng để dạy = **しかる**. 〔Sensei ga shikarimashita.〕' },
        { q: '{財布|さいふ}が{見|み}つかって、（　）しました。', options: ['がっかり', 'うっかり', 'ほっと', 'すっかり'], correct: 2, why: 'Lo lắng rồi tìm thấy → **ほっとする** (nhẹ nhõm). 〔Saifu ga mitsukatte, hotto shimashita.〕' },
        { q: '{楽|たの}しみにしていたコンサートが{中止|ちゅうし}になって、（　）しました。', options: ['がっかり', 'ほっと', 'ちゃんと', 'やっと'], correct: 0, why: 'Mong chờ mà bị huỷ → **がっかりする** (thất vọng). 〔Gakkari shimashita.〕' },
        { q: '{今朝|けさ}（　）して、{電車|でんしゃ}に{乗|の}り{遅|おく}れてしまいました。', options: ['{味見|あじみ}', '{寝坊|ねぼう}', '{失敗|しっぱい}', '{返事|へんじ}'], correct: 1, why: 'Lý do lỡ tàu buổi sáng = **{寝坊|ねぼう}する** (ngủ quên). 〔Kesa nebou shite, densha ni noriokurete shimaimashita.〕' },
        { q: '「{山田|やまだ}さんとの{約束|やくそく}をうっかり{忘|わす}れてしまいました。」と{意味|いみ}が{近|ちか}いのは？', options: ['{忘|わす}れるつもりはなかったが、{忘|わす}れた。', 'わざと{忘|わす}れた。', '{約束|やくそく}を{覚|おぼ}えていた。', '{約束|やくそく}をしなかった。'], correct: 0, why: 'うっかり = sơ ý, **không cố ý** ≈ {忘|わす}れるつもりはなかった. 〔Wasureru tsumori wa nakatta ga, wasureta.〕 (dạng 言い換え類義)' },
        { q: '「{会社|かいしゃ}へ{行|い}く{途中|とちゅう}で、{雨|あめ}が{降|ふ}ってきました。」の{意味|いみ}は？', options: ['{会社|かいしゃ}に{着|つ}いてから{雨|あめ}が{降|ふ}った。', '{会社|かいしゃ}へ{行|い}っているときに{雨|あめ}が{降|ふ}った。', '{会社|かいしゃ}を{出|で}たあとで{雨|あめ}が{降|ふ}った。', '{雨|あめ}が{降|ふ}ったので、{会社|かいしゃ}へ{行|い}かなかった。'], correct: 1, why: '{途中|とちゅう}で = đang trên đường → **{行|い}っているときに**. 〔Kaisha e itte iru toki ni ame ga futta.〕' },
        { q: 'せっかく（　）のに、{店|みせ}が{休|やす}みでした。', options: ['{来|く}る', '{来|き}た', '{来|こ}よう', '{来|き}て'], correct: 1, why: '**せっかく + V た + のに** — đã mất công đến (việc đã xảy ra) vậy mà… 〔Sekkaku kita noni, mise ga yasumi deshita.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b19-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp N4 — ～てしまう (～ちゃう), ～てみる, ～ところ (sắp・đang・vừa), ～のに',
  goal: 'Dùng ～てしまう cho việc làm xong hết và việc lỡ xảy ra (kể cả dạng nói ～ちゃう・～じゃう), xin lỗi đúng bằng tha động từ + てしまいました; nói làm thử bằng ～てみる ở mọi dạng (～てみたい・～てみてください・～てみよう・～てみたら？); chọn đúng Vるところ／Vているところ／Vたところ theo thời điểm; nối hai vế trái kỳ vọng bằng ～のに đúng cách chia (なのに) và biết vế sau không được là ý chí, mệnh lệnh — phân biệt với ～ても, ～けど và với のに "dùng để" như đề N4 hay hỏi.',
  minutes: 120,
  blocks: [
    {
      t: 'p',
      text: 'Bài 19 có **4 nhóm mẫu N4**. Ba mẫu đầu đứng sau **thể て hoặc thể thường của động từ** — nên trước khi học, hãy chắc rằng bạn chia thể て (Bài 7) và thể thường 普通形 (Bài 11) trôi chảy. **(1) ～てしまう** — làm xong hết / lỡ làm mất rồi. **(2) ～てみる** — làm thử. **(3) ～ところ** — ba thời điểm của một hành động: sắp làm, đang làm, vừa làm xong. **(4) ～のに** — "vậy mà": kết quả trái với điều mình chờ đợi. Cuối bài có **bảng phân biệt ～のに・～ても・～けど** và **hai loại のに** — hai câu hỏi kinh điển của đề N4.',
    },
    {
      t: 'table',
      caption: 'Bản đồ ngữ pháp Bài 19',
      head: ['#', 'Mẫu', 'Nghĩa', 'Ví dụ ngắn', 'Cấp'],
      rows: [
        ['①a', 'Vて ＋ しまう', 'làm xong hết, làm cho xong', '{宿題|しゅくだい}を{全部|ぜんぶ}やってしまいました。', 'N4'],
        ['①b', 'Vて ＋ しまう', 'lỡ làm, (việc) xảy ra mất rồi — tiếc', '{財布|さいふ}を{落|お}としてしまいました。', 'N4'],
        ['①c', '～ちゃう／～じゃう', 'dạng nói của ～てしまう／～でしまう', '{財布|さいふ}を{落|お}としちゃった。', 'N4'],
        ['②', 'Vて ＋ みる', 'làm thử (để biết thế nào)', 'もう{一度|いちど}やってみます。', 'N4'],
        ['③a', 'Vる ＋ ところ', 'sắp sửa (ngay bây giờ)', '{今|いま}から{出|で}かけるところです。', 'N4'],
        ['③b', 'Vている ＋ ところ', 'đang đúng lúc làm', '{今|いま}、{探|さが}しているところです。', 'N4'],
        ['③c', 'Vた ＋ ところ', 'vừa mới làm xong', '{今|いま}、{着|つ}いたところです。', 'N4'],
        ['④', '普通形 ＋ のに（ナA／N ＋ な）', 'vậy mà, thế mà (trái kỳ vọng, có cảm xúc)', '{勉強|べんきょう}したのに、{落|お}ちました。', 'N4'],
        ['④′', 'Vる ＋ のに ＋ {使|つか}う／{便利|べんり}だ／かかる', 'dùng để, để mà (biết thêm — khác ④)', '{駅|えき}まで{行|い}くのに{30分|さんじゅっぷん}かかります。', 'N4'],
      ],
    },
    {
      t: 'note',
      title: 'Ôn nhanh — thể て (Bài 7) và thể thường 普通形 (Bài 11)',
      items: [
        '**Thể て, nhóm 1**: う・つ・る → **って** ({割|わ}る → {割|わ}って, {拾|ひろ}う → {拾|ひろ}って) · む・ぶ・ぬ → **んで** ({盗|ぬす}む → {盗|ぬす}んで, {飲|の}む → {飲|の}んで) · く → **いて** ({泣|な}く → {泣|な}いて; ngoại lệ **{行|い}く → {行|い}って**) · ぐ → **いで** ({急|いそ}ぐ → {急|いそ}いで) · す → **して** ({落|お}とす → {落|お}として, {汚|よご}す → {汚|よご}して). **Nhóm 2**: bỏ る + て ({間違|まちが}える → {間違|まちが}えて). **Nhóm 3**: する → して · {来|く}る → {来|き}て.',
        'Thể て đuôi **で** (んで・いで) thì ở dạng nói đổi thành **じゃう** (không phải ちゃう): {飲|の}んでしまう → {飲|の}んじゃう. Nhớ ngay từ bây giờ — mục ①c.',
        '**普通形** (thể thường) cho ～のに: V {行|い}く・{行|い}かない・{行|い}った・{行|い}かなかった · イA {高|たか}い・{高|たか}かった · ナA {静|しず}か**な**・{静|しず}かだった · N {雨|あめ}**な**・{雨|あめ}だった. ⚠ Hiện tại khẳng định của ナA và N dùng **な**, không dùng だ.',
        'Bản thân **しまう** và **みる** là động từ thường: しまう nhóm 1 (しまいます・しまった・しまって・しまおう), みる nhóm 2 (みます・みた・みて・みよう・みたい). Khi là mẫu ngữ pháp, viết **bằng hiragana**.',
      ],
    },

    /* ══════ ① ～てしまう ══════ */
    { t: 'h', text: '① Vて しまう — làm xong hết · lỡ làm mất rồi (đáng tiếc)' },
    {
      t: 'p',
      text: 'Bài 18 bạn đã gặp động từ **しまう = cất (vào chỗ của nó)**. Gắn sau thể て, しまう mang nghĩa **"làm cho xong, gói lại, không quay lại được nữa"**. Từ đó có **hai cách dùng**: **(a)** làm **trọn vẹn, xong hết** một việc (thường đi với {全部|ぜんぶ}・もう・～までに・{早|はや}く); **(b)** một việc **đã lỡ xảy ra** ngoài ý muốn, không sửa lại được — người nói **tiếc, ân hận, ngại** (đây là nghĩa gặp nhiều nhất trong đời sống và trong đề). Nhiều câu mang **cả hai** sắc thái: もう{全部|ぜんぶ}{食|た}べてしまった = ăn hết rồi (và hơi tiếc/hơi ngại).',
    },
    {
      t: 'table',
      caption: 'Chia ～てしまう — しまう là động từ nhóm 1',
      head: ['Dạng', 'Ví dụ', 'Romaji', 'Nghĩa'],
      rows: [
        ['～てしまいます', '{明日|あした}までに{読|よ}んでしまいます。', 'Ashita made ni yonde shimaimasu.', 'Tôi sẽ đọc xong trước ngày mai.'],
        ['～てしまいました', '{電車|でんしゃ}に{乗|の}り{遅|おく}れてしまいました。', 'Densha ni noriokurete shimaimashita.', 'Tôi lỡ chuyến tàu mất rồi.'],
        ['～てしまった (thường)', 'また{寝坊|ねぼう}してしまった。', 'Mata nebou shite shimatta.', 'Lại ngủ quên mất rồi.'],
        ['～てしまって (thể て)', '{財布|さいふ}をなくしてしまって、{困|こま}っています。', 'Saifu o nakushite shimatte, komatte imasu.', 'Tôi lỡ làm mất ví, đang rất khổ.'],
        ['～てしまおう (ý chí)', '{今日|きょう}{中|じゅう}に{片付|かたづ}けてしまおう。', 'Kyoujuu ni katazukete shimaou.', 'Dọn cho xong trong hôm nay nào.'],
        ['～てしまいたい', '{嫌|いや}な{仕事|しごと}は{早|はや}くやってしまいたいです。', 'Iya na shigoto wa hayaku yatte shimaitai desu.', 'Việc khó chịu thì tôi muốn làm cho xong sớm.'],
        ['～てしまってください', 'その{書類|しょるい}は{今|いま}{書|か}いてしまってください。', 'Sono shorui wa ima kaite shimatte kudasai.', 'Tờ giấy đó hãy viết cho xong luôn bây giờ.'],
      ],
    },

    /* ── ①a ── */
    { t: 'h', text: '①a Vて しまう — "làm xong hết, làm cho xong"' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '(N を) Vて しまいます／しまいました',
          vi: 'Làm **trọn vẹn** một việc, không còn gì sót lại — thường có **{全部|ぜんぶ}・もう・～までに・{早|はや}く・{先|さき}に**. Dạng ～てしまおう／～てしまいたい／～てしまってください hầu như luôn mang nghĩa này (làm cho xong để khỏi vướng).',
          examples: [
            E('{宿題|しゅくだい}はもう{全部|ぜんぶ}やってしまいました。', 'Shukudai wa mou zenbu yatte shimaimashita.', 'Bài tập tôi làm hết sạch rồi.'),
            E('この{本|ほん}は{一日|いちにち}で{読|よ}んでしまいました。', 'Kono hon wa ichinichi de yonde shimaimashita.', 'Quyển sách này tôi đọc hết trong một ngày.'),
            E('{出|で}かける{前|まえ}に、{洗濯|せんたく}をしてしまいます。', 'Dekakeru mae ni, sentaku o shite shimaimasu.', 'Trước khi ra ngoài, tôi giặt đồ cho xong.'),
            E('{冷|さ}める{前|まえ}に、{食|た}べてしまいましょう。', 'Sameru mae ni, tabete shimaimashou.', 'Ăn cho hết trước khi nguội đi nào.'),
            E('レポートは{金曜日|きんようび}までに{書|か}いてしまいたいです。', 'Repooto wa kin\'youbi made ni kaite shimaitai desu.', 'Tôi muốn viết xong báo cáo trước thứ Sáu.'),
            E('{給料|きゅうりょう}をもらったのに、もう{全部|ぜんぶ}{使|つか}ってしまいました。', 'Kyuuryou o moratta noni, mou zenbu tsukatte shimaimashita.', 'Mới lĩnh lương vậy mà đã tiêu sạch rồi. (xong hết + tiếc)'),
          ],
        },
      ],
    },
    {
      t: 'note',
      title: '～てしまう (xong hết) khác gì ～ておく (Bài 18)?',
      items: [
        '**～ておく** = làm **trước để chuẩn bị** cho một việc sau: {旅行|りょこう}の{前|まえ}にホテルを{予約|よやく}しておく (nhìn về TƯƠNG LAI).',
        '**～てしまう** = làm **cho xong hẳn**, hết sạch: {宿題|しゅくだい}を{全部|ぜんぶ}やってしまう (nhìn vào việc HOÀN THÀNH).',
        'Câu gần nhau, nghĩa khác: お{客|きゃく}さんが{来|く}る{前|まえ}に{片付|かたづ}けておく (dọn SẴN cho khách) · {今日|きょう}の{仕事|しごと}を{先|さき}に{片付|かたづ}けてしまう (giải quyết cho XONG, khỏi vướng).',
      ],
    },

    /* ── ①b ── */
    { t: 'h', text: '①b Vて しまう — "lỡ … mất rồi": việc đáng tiếc, ngoài ý muốn' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '(N を) Vて しまいました — tôi lỡ làm (tha động từ: nhận lỗi)',
          vi: 'Việc **đã xảy ra** mà người nói **không muốn**, tiếc, ân hận hoặc thấy ngại. Câu kể lỗi của mình gần như luôn dùng dạng này — vì thế đây là câu **xin lỗi chuẩn** ở Nhật: báo lỗi bằng ～てしまいました rồi nói すみません／{申|もう}し{訳|わけ}ありません.',
          examples: [
            E('{駅|えき}で{財布|さいふ}を{落|お}としてしまいました。', 'Eki de saifu o otoshite shimaimashita.', 'Tôi lỡ đánh rơi ví ở nhà ga.'),
            E('{先生|せんせい}に{借|か}りた{本|ほん}を{汚|よご}してしまいました。', 'Sensei ni karita hon o yogoshite shimaimashita.', 'Em lỡ làm bẩn quyển sách mượn của thầy.'),
            E('{友達|ともだち}の{名前|なまえ}を{間違|まちが}えてしまいました。', 'Tomodachi no namae o machigaete shimaimashita.', 'Tôi lỡ gọi nhầm tên bạn mất rồi.'),
            E('{授業|じゅぎょう}{中|ちゅう}に{寝|ね}てしまいました。', 'Jugyouchuu ni nete shimaimashita.', 'Tôi lỡ ngủ gật trong giờ học. (không cố ý)'),
            E('{面白|おもしろ}くて、{大|おお}きい{声|こえ}で{笑|わら}ってしまいました。', 'Omoshirokute, ookii koe de waratte shimaimashita.', 'Buồn cười quá, tôi lỡ cười thành tiếng to.'),
            E('{約束|やくそく}をすっかり{忘|わす}れてしまって、すみません。', 'Yakusoku o sukkari wasurete shimatte, sumimasen.', 'Xin lỗi vì tôi đã quên mất cuộc hẹn.'),
          ],
        },
        {
          formula: 'N が 自動詞て しまいました — (nó) bị … mất rồi (không ai cố ý)',
          vi: 'Với **tự động từ**, ～てしまった chỉ tả một sự việc **đáng tiếc đã xảy ra** (đồ hỏng, mưa, lỡ tàu…). Dùng khi thật sự không ai làm; nếu chính bạn làm thì xin lỗi bằng **tha** động từ (bảng cuối mục Từ vựng).',
          examples: [
            E('{急|きゅう}にパソコンが{壊|こわ}れてしまいました。', 'Kyuu ni pasokon ga kowarete shimaimashita.', 'Tự nhiên máy tính hỏng mất rồi.'),
            E('{強|つよ}い{風|かぜ}で、{傘|かさ}が{折|お}れてしまいました。', 'Tsuyoi kaze de, kasa ga orete shimaimashita.', 'Gió to làm cái ô gãy mất.'),
            E('{話|はな}している{間|あいだ}に、コーヒーが{冷|さ}めてしまいました。', 'Hanashite iru aida ni, koohii ga samete shimaimashita.', 'Trong lúc nói chuyện, cà phê nguội mất rồi.'),
            E('{急|いそ}いだのに、バスが{行|い}ってしまいました。', 'Isoida noni, basu ga itte shimaimashita.', 'Đã vội vậy mà xe buýt vẫn đi mất.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Cùng một sự việc — ～ました hay ～てしまいました?',
      head: ['Câu', 'Romaji', 'Cảm giác người nghe'],
      rows: [
        ['お{皿|さら}を{割|わ}りました。', 'Osara o warimashita.', 'chỉ thông báo sự việc — nghe hơi trơ, như không thấy có lỗi'],
        ['お{皿|さら}を{割|わ}ってしまいました。', 'Osara o watte shimaimashita.', '"tôi lỡ làm vỡ, tôi rất tiếc" — thành khẩn ✓'],
        ['お{皿|さら}が{割|わ}れてしまいました。', 'Osara ga warete shimaimashita.', '"cái đĩa bị vỡ mất" — nếu chính bạn làm vỡ thì nghe như đổ lỗi cho cái đĩa'],
        ['{宿題|しゅくだい}をしました。', 'Shukudai o shimashita.', 'đã làm bài tập (bình thường)'],
        ['{宿題|しゅくだい}をしてしまいました。', 'Shukudai o shite shimaimashita.', 'đã làm XONG HẾT bài tập (nhấn mạnh hoàn thành)'],
      ],
    },

    /* ── ①c ── */
    { t: 'h', text: '①c Văn nói — ～ちゃう・～じゃう (rất hay nghe trong phim, giữa bạn bè)' },
    {
      t: 'table',
      caption: 'Đổi ～てしまう → ～ちゃう, ～でしまう → ～じゃう',
      head: ['Dạng đầy đủ', 'Dạng nói', 'Romaji', 'Ghi chú'],
      rows: [
        ['{食|た}べてしまう', '{食|た}べちゃう', 'tabechau', 'てしま → ちゃ'],
        ['{食|た}べてしまった', '{食|た}べちゃった', 'tabechatta', 'quá khứ — dạng hay nghe nhất'],
        ['{忘|わす}れてしまいました', '{忘|わす}れちゃいました', 'wasurechaimashita', 'lịch sự nhưng thân mật (nói với người quen)'],
        ['{遅|おく}れてしまって', '{遅|おく}れちゃって', 'okurechatte', 'thể て'],
        ['{飲|の}んでしまう', '{飲|の}んじゃう', 'nonjau', 'でしま → **じゃ** (thể て đuôi で)'],
        ['{死|し}んでしまった', '{死|し}んじゃった', 'shinjatta', 'でしま → じゃ'],
        ['{泳|およ}いでしまった', '{泳|およ}いじゃった', 'oyoijatta', 'ぐ → いで → いじゃった'],
        ['{行|い}ってしまった', '{行|い}っちゃった', 'itchatta', 'đi mất rồi'],
        ['{来|き}てしまった', '{来|き}ちゃった', 'kichatta', 'lỡ đến rồi (vd. đến sớm quá)'],
        ['してしまった', 'しちゃった', 'shichatta', 'する'],
      ],
    },
    {
      t: 'note',
      title: 'Dùng ～ちゃう thế nào cho đúng',
      items: [
        '**Nói với bạn bè, người nhà**: {焦|こ}げちゃった！ · また{寝坊|ねぼう}しちゃった · ケーキ、{全部|ぜんぶ}{食|た}べちゃった. **Nói với thầy cô, quản lý, khách**: dùng ～てしまいました.',
        'Viết bài, viết email, làm bài thi viết → luôn dùng **～てしまう** đầy đủ. Bài nghe N4 thì rất hay dùng ～ちゃう／～ちゃった — phải nghe ra.',
        '⚠ Đừng nhầm với **～ちゃ／～じゃ = ～ては／～では**: {食|た}べちゃだめ = {食|た}べてはだめ (không được ăn — ôn ～てはいけません). Nhận biết: ～ちゃ**う**／～ちゃ**った** là しまう; ～ちゃ**だめ**／～ちゃ**いけない** là ては.',
      ],
    },
    { t: 'rule', formula: 'Vて しまう（～ちゃう）： ① làm xong hết ／ ② lỡ làm, việc đáng tiếc đã xảy ra', vi: 'Chia như động từ nhóm 1 (しまいました・しまった・しまって・しまおう). Báo lỗi của mình: tha động từ + てしまいました + すみません. Dạng nói: ～てしまう → ～ちゃう, ～でしまう → ～じゃう.' },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～てしまう',
      items: [
        'Quên thể て: ~~{落|お}としましまいました~~, ~~{忘|わす}れしまった~~ → **{落|お}としてしまいました**, **{忘|わす}れてしまった**.',
        'Chia sai thể て: ~~{盗|ぬす}みてしまった~~ → **{盗|ぬす}んでしまった** (む → んで); ~~{泣|な}きてしまいました~~ → **{泣|な}いてしまいました**.',
        'Dạng nói sai: ~~{飲|の}んちゃった~~ → **{飲|の}んじゃった** (で → じゃ); ~~{読|よ}んちゃう~~ → **{読|よ}んじゃう**.',
        'Dùng cho việc vui, chủ động muốn làm: ~~{試験|しけん}に{合格|ごうかく}してしまいました~~ (nghe như tiếc vì đỗ!) → {合格|ごうかく}しました. Trừ khi bạn thật sự muốn đùa / tỏ ra ngại.',
        'Xin lỗi bằng tự động từ khi chính mình làm: ~~（{私|わたし}が{割|わ}ったのに）お{皿|さら}が{割|わ}れてしまいました~~ → **お{皿|さら}を{割|わ}ってしまいました**.',
      ],
    },
    DL('Hỏi – đáp: báo lỗi ở chỗ làm, kể chuyện xui với bạn', [
      ['ナタポン', 'b', '{店長|てんちょう}、すみません。{寝坊|ねぼう}して、{遅|おく}れてしまいました。', 'Tenchou, sumimasen. Nebou shite, okurete shimaimashita.', 'Anh quản lý, em xin lỗi. Em ngủ quên nên đến muộn ạ.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', '{次|つぎ}からは{気|き}をつけてね。じゃ、{早|はや}く{着替|きが}えてしまって。', 'Tsugi kara wa ki o tsukete ne. Ja, hayaku kigaete shimatte.', 'Lần sau chú ý nhé. Thôi, thay đồ cho nhanh đi.'],
      ['ナタポン', 'b', 'はい。それから、{昨日|きのう}のテーブルの{予約|よやく}のメモですが、{間違|まちが}えて{捨|す}ててしまいました。', 'Hai. Sorekara, kinou no teeburu no yoyaku no memo desu ga, machigaete sutete shimaimashita.', 'Vâng. À còn tờ ghi đặt bàn hôm qua, em lỡ vứt nhầm mất rồi.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'え？……じゃ、{予約|よやく}のお{客様|きゃくさま}に{電話|でんわ}して、もう{一度|いちど}{聞|き}いてみよう。', 'E? …… Ja, yoyaku no okyakusama ni denwa shite, mou ichido kiite miyou.', 'Hả? … Vậy gọi điện cho khách đặt bàn, hỏi lại thử xem.'],
      ['アンナ', 'a', 'マルコさん、{元気|げんき}がないね。どうしたの？', 'Maruko-san, genki ga nai ne. Dou shita no?', 'Marco, trông cậu chán thế. Sao vậy?'],
      ['マルコ', 'b', '{昨日|きのう}、{新|あたら}しいスマホを{落|お}としちゃって、{画面|がめん}が{割|わ}れちゃったんだ。', 'Kinou, atarashii sumaho o otoshichatte, gamen ga warechatta n da.', 'Hôm qua tớ lỡ đánh rơi cái điện thoại mới, vỡ màn hình mất rồi.'],
      ['アンナ', 'a', 'えー、{先週|せんしゅう}{買|か}ったのに……。{修理|しゅうり}は？', 'Ee, senshuu katta noni……. Shuuri wa?', 'Ơ, tuần trước mới mua vậy mà… Còn sửa thì sao?'],
      ['マルコ', 'b', '{三万円|さんまんえん}かかるって。{今月|こんげつ}のお{金|かね}、{全部|ぜんぶ}{使|つか}っちゃうよ。', 'Sanman en kakaru tte. Kongetsu no okane, zenbu tsukacchau yo.', 'Nghe nói mất 3 vạn yên. Tiêu sạch tiền tháng này mất.'],
    ]),
    {
      t: 'table',
      caption: 'Bảng thay thế — báo lỗi: 「すみません、＿＿を＿＿てしまいました。」',
      head: ['Đồ / việc', 'Động từ', 'Câu xin lỗi', 'Romaji', 'Dạng nói (với bạn)'],
      rows: [
        ['お{皿|さら}', '{割|わ}る', 'すみません、お{皿|さら}を{割|わ}ってしまいました。', 'Sumimasen, osara o watte shimaimashita.', '{割|わ}っちゃった'],
        ['{借|か}りた{傘|かさ}', '{壊|こわ}す', 'すみません、{借|か}りた{傘|かさ}を{壊|こわ}してしまいました。', 'Sumimasen, karita kasa o kowashite shimaimashita.', '{壊|こわ}しちゃった'],
        ['{注文|ちゅうもん}', '{間違|まちが}える', 'すみません、{注文|ちゅうもん}を{間違|まちが}えてしまいました。', 'Sumimasen, chuumon o machigaete shimaimashita.', '{間違|まちが}えちゃった'],
        ['コーヒー', 'こぼす', 'すみません、コーヒーをこぼしてしまいました。', 'Sumimasen, koohii o koboshite shimaimashita.', 'こぼしちゃった'],
        ['{宿題|しゅくだい}', '{忘|わす}れる', 'すみません、{宿題|しゅくだい}を{忘|わす}れてしまいました。', 'Sumimasen, shukudai o wasurete shimaimashita.', '{忘|わす}れちゃった'],
        ['{会議|かいぎ}の{資料|しりょう}', 'なくす', 'すみません、{会議|かいぎ}の{資料|しりょう}をなくしてしまいました。', 'Sumimasen, kaigi no shiryou o nakushite shimaimashita.', 'なくしちゃった'],
        ['{友達|ともだち}のジュース', '{飲|の}む', 'ごめん、{友達|ともだち}のジュースを{飲|の}んでしまった。', 'Gomen, tomodachi no juusu o nonde shimatta.', '{飲|の}んじゃった'],
      ],
    },

    /* ══════ ② ～てみる ══════ */
    { t: 'h', text: '② Vて みる — làm thử (để biết kết quả ra sao)' },
    {
      t: 'p',
      text: '**みる** gốc là {見|み}る (xem). Gắn sau thể て, nó mang nghĩa **"làm thử rồi xem kết quả thế nào"**: {食|た}べてみる (ăn thử xem có ngon không), {着|き}てみる (mặc thử xem có vừa không), {聞|き}いてみる (hỏi thử xem). Người nói **chưa biết kết quả** khi làm. Đây là mẫu rất "mềm" — dùng để rủ, khuyên, xin phép, nói ước muốn trải nghiệm.',
    },
    {
      t: 'table',
      caption: 'Chia ～てみる — みる là động từ nhóm 2',
      head: ['Dạng', 'Ví dụ', 'Romaji', 'Dùng khi'],
      rows: [
        ['～てみます', 'もう{一度|いちど}{電話|でんわ}してみます。', 'Mou ichido denwa shite mimasu.', 'nói việc mình sẽ thử làm'],
        ['～てみました', '{納豆|なっとう}を{食|た}べてみました。', 'Nattou o tabete mimashita.', 'kể việc đã thử'],
        ['～てみたいです', '{一度|いちど}{富士山|ふじさん}に{登|のぼ}ってみたいです。', 'Ichido Fujisan ni nobotte mitai desu.', 'mong muốn trải nghiệm'],
        ['～てみてください', 'この{服|ふく}、{着|き}てみてください。', 'Kono fuku, kite mite kudasai.', 'mời, khuyên người khác thử'],
        ['～てみてもいいですか', 'ちょっと{使|つか}ってみてもいいですか。', 'Chotto tsukatte mite mo ii desu ka.', 'xin phép làm thử (ôn ポイント 89)'],
        ['～てみよう／～てみましょう', 'あの{店|みせ}に{入|はい}ってみよう。', 'Ano mise ni haitte miyou.', 'rủ thử (ôn thể ý chí Bài 16)'],
        ['～てみませんか', '{一緒|いっしょ}に{作|つく}ってみませんか。', 'Issho ni tsukutte mimasen ka.', 'mời lịch sự (ôn ポイント 48)'],
        ['～てみたら？／～てみたらどうですか', '{先生|せんせい}に{聞|き}いてみたら？', 'Sensei ni kiite mitara?', 'khuyên (ôn ～たら ポイント 120)'],
        ['～てみようと{思|おも}います', '{来年|らいねん}、N3を{受|う}けてみようと{思|おも}います。', 'Rainen, enu-san o ukete miyou to omoimasu.', 'dự định thử (ôn Bài 16)'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '(N を) Vて みます — làm thử',
          vi: 'Làm một việc **lần đầu / theo cách mới** để biết kết quả. Hay đi với **{一度|いちど}・ちょっと・{初|はじ}めて・もう{一度|いちど}**. Kể chuyện đã thử: ～てみました + kết quả (～が、～／～たら、～).',
          examples: [
            E('{初|はじ}めて{日本|にほん}のお{好|この}み{焼|や}きを{作|つく}ってみました。', 'Hajimete Nihon no okonomiyaki o tsukutte mimashita.', 'Lần đầu tôi làm thử món okonomiyaki Nhật.'),
            E('この{靴|くつ}、はいてみてもいいですか。', 'Kono kutsu, haite mite mo ii desu ka.', 'Tôi đi thử đôi giày này được không?'),
            E('わからない{言葉|ことば}は、{辞書|じしょ}で{調|しら}べてみてください。', 'Wakaranai kotoba wa, jisho de shirabete mite kudasai.', 'Từ nào không hiểu thì thử tra từ điển xem.'),
            E('{一度|いちど}、{着物|きもの}を{着|き}てみたいです。', 'Ichido, kimono o kite mitai desu.', 'Tôi muốn mặc thử kimono một lần.'),
            E('{電話|でんわ}しても{出|で}ないから、メールを{送|おく}ってみます。', 'Denwa shite mo denai kara, meeru o okutte mimasu.', 'Gọi mà không ai nghe nên tôi thử gửi mail xem.'),
            E('{新|あたら}しいカレーを{作|つく}ってみたら、{店長|てんちょう}がほめてくれました。', 'Atarashii karee o tsukutte mitara, tenchou ga homete kuremashita.', 'Tôi thử làm món cà ri mới, thì quản lý khen. (～たら + phát hiện, ポイント 120)'),
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Ba điều cần nhớ về ～てみる',
      items: [
        '**Viết みる bằng hiragana** khi là mẫu ngữ pháp. **{見|み}てみる** (xem thử) là đúng — hai chữ み đứng liền nhau không sao: ちょっと{見|み}てみて.',
        '**Chỉ dùng cho việc người làm CHỦ Ý làm được**: ~~{雨|あめ}が{降|ふ}ってみる~~, ~~{病気|びょうき}になってみる~~ ✗. Việc tự nhiên, ngoài ý muốn → không dùng ～てみる.',
        '**～てみる ≠ {試|ため}す**: {試|ため}す cần danh từ tân ngữ ({新|あたら}しい{方法|ほうほう}を{試|ため}す); ～てみる đứng sau động từ ({食|た}べてみる). Ghép được: {試|ため}してみる (thử áp dụng xem).',
        'Đề N4 hay cho cặp **～てみる ↔ ～ておく**: thử để BIẾT kết quả (～てみる) / làm SẴN để chuẩn bị (～ておく). {旅行|りょこう}の{前|まえ}にホテルを{予約|よやく}しておく = đặt sẵn để chuẩn bị ✓; ホテルに{電話|でんわ}して{予約|よやく}してみる = thử gọi đặt xem còn phòng không (nghĩa khác hẳn).',
      ],
    },
    DL('Hỏi – đáp: rủ thử, khuyên thử, kể đã thử', [
      ['リン', 'a', 'カルロスさん、{駅前|えきまえ}に{新|あたら}しいラーメン{屋|や}ができたの、{知|し}っていますか。', 'Karurosu-san, ekimae ni atarashii raamen\'ya ga dekita no, shitte imasu ka.', 'Carlos ơi, cậu biết trước ga mới mở một quán ramen không?'],
      ['カルロス', 'b', 'いいえ。もう{食|た}べてみましたか。', 'Iie. Mou tabete mimashita ka.', 'Không. Cậu ăn thử chưa?'],
      ['リン', 'a', 'はい、{昨日|きのう}{食|た}べてみました。スープがとてもおいしかったです。{今度|こんど}{一緒|いっしょ}に{行|い}ってみませんか。', 'Hai, kinou tabete mimashita. Suupu ga totemo oishikatta desu. Kondo issho ni itte mimasen ka.', 'Rồi, hôm qua tớ ăn thử. Nước dùng ngon lắm. Lần tới cùng đi thử không?'],
      ['カルロス', 'b', 'ぜひ！{辛|から}いラーメンもありますか。{一度|いちど}{食|た}べてみたいんです。', 'Zehi! Karai raamen mo arimasu ka. Ichido tabete mitai n desu.', 'Nhất định rồi! Có ramen cay không? Tớ muốn ăn thử một lần.'],
      ['ワン', 'a', '{先生|せんせい}、N4の{聴解|ちょうかい}がなかなか{上手|じょうず}にならないんです。', 'Sensei, enu-yon no choukai ga nakanaka jouzu ni naranai n desu.', 'Thưa thầy, phần nghe N4 của em mãi không tiến bộ ạ.'],
      ['{本田先生|ほんだせんせい}', 'examiner', 'じゃ、{毎日|まいにち}{10分|じゅっぷん}、{日本|にほん}のニュースを{聞|き}いてみたらどうですか。', 'Ja, mainichi juppun, Nihon no nyuusu o kiite mitara dou desu ka.', 'Vậy em thử mỗi ngày nghe tin tức Nhật 10 phút xem sao?'],
      ['ワン', 'a', 'わかりました。{今日|きょう}から{聞|き}いてみます。', 'Wakarimashita. Kyou kara kiite mimasu.', 'Em hiểu rồi ạ. Từ hôm nay em sẽ thử nghe.'],
    ]),
    {
      t: 'table',
      caption: 'Bảng thay thế — 「＿＿を＿＿てみたいです」「＿＿てみてください」',
      head: ['Việc', '～てみたいです', '～てみてください', 'Romaji (～てみたい)'],
      rows: [
        ['{着物|きもの}を{着|き}る', '{着物|きもの}を{着|き}てみたいです。', '{着物|きもの}を{着|き}てみてください。', 'Kimono o kite mitai desu.'],
        ['{納豆|なっとう}を{食|た}べる', '{納豆|なっとう}を{食|た}べてみたいです。', '{納豆|なっとう}を{食|た}べてみてください。', 'Nattou o tabete mitai desu.'],
        ['{富士山|ふじさん}に{登|のぼ}る', '{富士山|ふじさん}に{登|のぼ}ってみたいです。', '{富士山|ふじさん}に{登|のぼ}ってみてください。', 'Fujisan ni nobotte mitai desu.'],
        ['お{好|この}み{焼|や}きを{作|つく}る', 'お{好|この}み{焼|や}きを{作|つく}ってみたいです。', 'お{好|この}み{焼|や}きを{作|つく}ってみてください。', 'Okonomiyaki o tsukutte mitai desu.'],
        ['{日本人|にほんじん}と{話|はな}す', '{日本人|にほんじん}と{話|はな}してみたいです。', '{日本人|にほんじん}と{話|はな}してみてください。', 'Nihonjin to hanashite mitai desu.'],
        ['{温泉|おんせん}に{入|はい}る', '{温泉|おんせん}に{入|はい}ってみたいです。', '{温泉|おんせん}に{入|はい}ってみてください。', 'Onsen ni haitte mitai desu.'],
      ],
    },
    { t: 'rule', formula: 'Vて みる： làm thử (chưa biết kết quả)', vi: 'Chia như động từ nhóm 2: みます・みた・みたい・みてください・みよう・みたら. Viết bằng hiragana. Chỉ dùng cho việc chủ ý làm được.' },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～てみる',
      items: [
        'Bỏ thể て: ~~{食|た}べみます~~, ~~{食|た}べるみます~~ → **{食|た}べてみます**. ~~{行|い}きてみたい~~ → **{行|い}ってみたい**.',
        'Viết chữ Hán: ~~{食|た}べて{見|み}ます~~ (không sai hẳn nhưng sách, đề viết **みます** bằng かな) — hãy viết かな cho quen mắt.',
        'Dùng cho việc không chủ ý: ~~{風邪|かぜ}をひいてみました~~ ✗.',
        'Nhầm với ～てみせる (N3 — làm cho người khác xem) — N4 chưa cần; gặp みせる thì đừng hiểu là "thử".',
      ],
    },

    /* ══════ ③ ～ところ ══════ */
    { t: 'h', text: '③ V ＋ ところ — ba thời điểm: sắp làm · đang làm · vừa làm xong' },
    {
      t: 'p',
      text: '**ところ** nghĩa gốc là "chỗ". Đặt sau động từ, nó chỉ **"điểm thời gian"** của hành động — giống như chỉ vào một chỗ trên đường thời gian: ngay **trước khi bắt đầu** (Vる), ngay **giữa lúc** (Vている), ngay **sau khi xong** (Vた). Luôn nói về thời điểm **rất gần hiện tại** (vài giây đến vài chục phút), và rất hay đi với **{今|いま}・ちょうど・これから・さっき**. Mẫu này thường dùng để **giải thích vì sao mình chưa / không tiện làm việc khác**: {今|いま}{食|た}べているところだから、あとで{電話|でんわ}するね.',
    },
    {
      t: 'table',
      caption: 'Ba ところ trên đường thời gian — cùng việc "ăn cơm tối"',
      head: ['Thời điểm', 'Công thức', 'Câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['① ngay TRƯỚC khi làm', 'Vる ＋ ところです', '{今|いま}から{晩|ばん}ご{飯|はん}を{食|た}べるところです。', 'Ima kara bangohan o taberu tokoro desu.', 'Tôi sắp ăn tối (ngay bây giờ).'],
        ['② ĐANG giữa lúc làm', 'Vている ＋ ところです', '{今|いま}、{晩|ばん}ご{飯|はん}を{食|た}べているところです。', 'Ima, bangohan o tabete iru tokoro desu.', 'Tôi đang (đúng lúc) ăn tối.'],
        ['③ VỪA làm xong', 'Vた ＋ ところです', '{今|いま}、{晩|ばん}ご{飯|はん}を{食|た}べたところです。', 'Ima, bangohan o tabeta tokoro desu.', 'Tôi vừa ăn tối xong.'],
      ],
    },

    /* ── ③a ── */
    { t: 'h', text: '③a Vる ところ — "sắp sửa, chuẩn bị (ngay bây giờ)"' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（{今|いま}から／これから／ちょうど{今|いま}） V{辞書形|じしょけい} ＋ ところです',
          vi: 'Hành động **chưa bắt đầu nhưng sắp bắt đầu ngay**. Khác **～つもりです／～予定です** (Bài 16 — kế hoạch, có thể còn lâu): ～ところ là **ngay sát giờ**.',
          examples: [
            E('{今|いま}から{出|で}かけるところです。', 'Ima kara dekakeru tokoro desu.', 'Tôi sắp ra ngoài ngay bây giờ.'),
            E('これから{会議|かいぎ}が{始|はじ}まるところです。', 'Korekara kaigi ga hajimaru tokoro desu.', 'Cuộc họp sắp bắt đầu.'),
            E('ちょうど{今|いま}、{電話|でんわ}しようと{思|おも}っていたところです。', 'Choudo ima, denwa shiyou to omotte ita tokoro desu.', 'Tôi cũng đang định gọi điện cho bạn đây. (câu rất hay nghe khi người kia gọi trước)'),
            E('A「もう{寝|ね}た？」 B「ううん、{今|いま}から{寝|ね}るところ。」', 'A "Mou neta?" B "Uun, ima kara neru tokoro."', 'A: Ngủ chưa? — B: Chưa, mình sắp ngủ đây.'),
            E('{電車|でんしゃ}が{出|で}るところだったので、{走|はし}りました。', 'Densha ga deru tokoro datta node, hashirimashita.', 'Tàu sắp chạy nên tôi đã chạy (cho kịp).'),
          ],
        },
      ],
    },

    /* ── ③b ── */
    { t: 'h', text: '③b Vている ところ — "đang đúng lúc làm"' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（{今|いま}） Vて ＋ いる ＋ ところです',
          vi: 'Đang **ở giữa** hành động — nhấn mạnh hơn ～ています và thường hàm ý "**vì vậy bây giờ chưa rảnh / chưa có kết quả**". ～ています có nhiều nghĩa (thói quen, trạng thái…); ～ているところ CHỈ có nghĩa "đang trong lúc".',
          examples: [
            E('{今|いま}、レポートを{書|か}いているところです。', 'Ima, repooto o kaite iru tokoro desu.', 'Tôi đang viết báo cáo (dở tay).'),
            E('{駅員|えきいん}さんが{電車|でんしゃ}の{中|なか}を{探|さが}しているところです。', 'Ekiin-san ga densha no naka o sagashite iru tokoro desu.', 'Nhân viên nhà ga đang tìm trên tàu.'),
            E('{今|いま}{料理|りょうり}を{作|つく}っているところだから、あとで{電話|でんわ}するね。', 'Ima ryouri o tsukutte iru tokoro dakara, ato de denwa suru ne.', 'Mình đang nấu ăn, lát gọi lại nhé.'),
            E('A「{何|なに}をしているところ？」 B「{財布|さいふ}を{探|さが}しているところ。」', 'A "Nani o shite iru tokoro?" B "Saifu o sagashite iru tokoro."', 'A: Đang làm gì đấy? — B: Đang tìm cái ví.'),
            E('{友達|ともだち}から{電話|でんわ}が{来|き}たとき、シャワーを{浴|あ}びているところでした。', 'Tomodachi kara denwa ga kita toki, shawaa o abite iru tokoro deshita.', 'Lúc bạn gọi điện tới, tôi đang tắm.'),
          ],
        },
      ],
    },

    /* ── ③c ── */
    { t: 'h', text: '③c Vた ところ — "vừa mới (làm xong)"' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（{今|いま}／ちょうど{今|いま}／さっき） Vた ＋ ところです',
          vi: 'Hành động **vừa kết thúc** — chỉ vài phút trước. Hay dùng khi **đến nơi, về nhà, vừa làm xong việc** và người nghe hỏi "xong chưa / tới chưa".',
          examples: [
            E('ちょうど{今|いま}、{駅|えき}に{着|つ}いたところです。', 'Choudo ima, eki ni tsuita tokoro desu.', 'Tôi vừa mới tới ga.'),
            E('さっき{家|いえ}に{帰|かえ}ってきたところです。', 'Sakki ie ni kaette kita tokoro desu.', 'Tôi vừa về đến nhà lúc nãy.'),
            E('{今|いま}、{仕事|しごと}が{終|お}わったところです。', 'Ima, shigoto ga owatta tokoro desu.', 'Tôi vừa xong việc.'),
            E('{会議|かいぎ}は{今|いま}{始|はじ}まったところですから、{急|いそ}げば{間|ま}に{合|あ}いますよ。', 'Kaigi wa ima hajimatta tokoro desu kara, isogeba ma ni aimasu yo.', 'Cuộc họp vừa mới bắt đầu, nhanh lên là kịp đấy.'),
            E('A「ご{飯|はん}、{食|た}べに{行|い}かない？」 B「ごめん、{今|いま}{食|た}べたところなんだ。」', 'A "Gohan, tabe ni ikanai?" B "Gomen, ima tabeta tokoro na n da."', 'A: Đi ăn không? — B: Xin lỗi, mình vừa ăn xong.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Phân biệt — ～ところ với các mẫu gần nghĩa',
      head: ['Câu', 'Romaji', 'Khác nhau ở đâu'],
      rows: [
        ['{今|いま}、{食|た}べています。', 'Ima, tabete imasu.', 'đang ăn — nói bình thường (～ています còn có nghĩa thói quen: {毎朝|まいあさ}パンを{食|た}べています)'],
        ['{今|いま}、{食|た}べているところです。', 'Ima, tabete iru tokoro desu.', 'đang đúng lúc ăn, dở tay — thường để giải thích "chưa rảnh"'],
        ['{食|た}べました。', 'Tabemashita.', 'đã ăn — không nói là bao lâu trước'],
        ['{食|た}べたところです。', 'Tabeta tokoro desu.', 'VỪA ăn xong, mới vài phút'],
        ['{食|た}べるつもりです。', 'Taberu tsumori desu.', 'định ăn (kế hoạch — Bài 16), có thể còn lâu'],
        ['{食|た}べるところです。', 'Taberu tokoro desu.', 'sắp ăn NGAY bây giờ'],
        ['{焦|こ}げたところを{取|と}ります。', 'Kogeta tokoro o torimasu.', '⚠ ところ = "CHỖ" (danh từ: chỗ bị cháy), không phải mẫu thời điểm — có trợ từ を／に／が đi sau, không có です'],
      ],
    },
    {
      t: 'note',
      title: 'Ba điều cần nhớ về ～ところ',
      items: [
        '**Chỉ dùng cho thời điểm rất gần**: ~~{去年|きょねん}{日本|にほん}に{来|き}たところです~~ ✗ (một năm trước — không phải "vừa mới"). Nói "mới sang Nhật được ít lâu" sẽ dùng **～たばかり** — học ở **Bài 22**.',
        '**Quá khứ ～ところでした** = "lúc đó đang / lúc đó sắp": {電話|でんわ}が{来|き}たとき、ちょうど{出|で}かけるところでした (lúc điện thoại gọi tới, tôi vừa định ra ngoài).',
        '**Thể thường**: ～ところだ／～ところ (bạn bè): {今|いま}{着|つ}いたところ. Hỏi: {今|いま}、{何|なに}をしているところですか.',
      ],
    },
    DL('Hỏi – đáp: gọi điện hỏi bạn đang ở đâu, đang làm gì', [
      ['ダニエル', 'b', 'もしもし、パクさん？もう{家|いえ}を{出|で}ましたか。', 'Moshimoshi, Paku-san? Mou ie o demashita ka.', 'A lô, Park à? Cậu ra khỏi nhà chưa?'],
      ['パク', 'c', 'ごめんなさい、{今|いま}から{出|で}るところです。', 'Gomen nasai, ima kara deru tokoro desu.', 'Xin lỗi, mình đang sắp ra đây.'],
      ['ダニエル', 'b', 'そうですか。{僕|ぼく}はちょうど{今|いま}、{駅|えき}に{着|つ}いたところです。', 'Sou desu ka. Boku wa choudo ima, eki ni tsuita tokoro desu.', 'Vậy à. Mình vừa mới tới ga.'],
      ['パク', 'c', 'あ、でも{鍵|かぎ}が{見|み}つからなくて、{今|いま}{探|さが}しているところなんです。', 'A, demo kagi ga mitsukaranakute, ima sagashite iru tokoro na n desu.', 'À, nhưng mình không tìm thấy chìa khoá, đang tìm đây.'],
      ['ダニエル', 'b', '{大丈夫|だいじょうぶ}ですよ。{駅前|えきまえ}の{本屋|ほんや}で{待|ま}っていますから、ゆっくり{来|き}てください。', 'Daijoubu desu yo. Ekimae no hon\'ya de matte imasu kara, yukkuri kite kudasai.', 'Không sao đâu. Mình đợi ở hiệu sách trước ga, cậu cứ từ từ.'],
      ['パク', 'c', '……あった！かばんのポケットに{入|い}れておいたのを{忘|わす}れていました。{今|いま}、{家|いえ}を{出|で}たところです！', '…… Atta! Kaban no poketto ni irete oita no o wasurete imashita. Ima, ie o deta tokoro desu!', '… Thấy rồi! Mình cất sẵn trong túi áo của cặp mà quên mất. Mình vừa ra khỏi nhà đây!'],
    ]),
    {
      t: 'table',
      caption: 'Bảng thay thế — trả lời 「もう＿＿た？」 bằng ba ところ',
      head: ['Câu hỏi', 'Sắp (Vる)', 'Đang (Vている)', 'Vừa xong (Vた)'],
      rows: [
        ['もう{宿題|しゅくだい}した？', '{今|いま}からするところ。', '{今|いま}しているところ。', '{今|いま}{終|お}わったところ。'],
        ['もう{家|いえ}を{出|で}た？', '{今|いま}から{出|で}るところ。', '{今|いま}{靴|くつ}をはいているところ。', '{今|いま}{出|で}たところ。'],
        ['もうご{飯|はん}{食|た}べた？', 'これから{食|た}べるところ。', '{今|いま}{食|た}べているところ。', 'さっき{食|た}べたところ。'],
        ['もうメール{読|よ}んだ？', '{今|いま}から{読|よ}むところ。', '{今|いま}{読|よ}んでいるところ。', 'ちょうど{今|いま}{読|よ}んだところ。'],
        ['もう{駅|えき}に{着|つ}いた？', '— (sắp tới: もうすぐ{着|つ}く)', '{今|いま}、{電車|でんしゃ}に{乗|の}っているところ。', '{今|いま}{着|つ}いたところ。'],
      ],
    },
    { t: 'rule', formula: 'Vる ところ（sắp）／ Vている ところ（đang）／ Vた ところ（vừa xong）＋ です', vi: 'Chỉ thời điểm rất gần hiện tại của một hành động; hay đi với 今・ちょうど・これから・さっき. Quá khứ: ～ところでした (lúc đó đang / sắp). Không dùng cho việc đã lâu (→ ～たばかり, Bài 22).' },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～ところ',
      items: [
        'Nhầm thời điểm: bạn hỏi "{着|つ}いた？" mà mình còn trên tàu → ~~{今|いま}{着|つ}いたところ~~ → **{今|いま}{電車|でんしゃ}に{乗|の}っているところ**. Sắp tới thì nói **もうすぐ{着|つ}く**.',
        '~~{今|いま}から{出|で}かけたところです~~ — {今|いま}から (sắp) đi với **Vる**: {今|いま}から{出|で}かけるところです.',
        '~~{先週|せんしゅう}{引|ひ}っ{越|こ}したところです~~ — tuần trước là quá lâu cho ところ.',
        'Thêm の／に thừa: ~~{食|た}べるのところ~~, ~~{食|た}べているのところ~~ → **{食|た}べるところ**, **{食|た}べているところ** (động từ nối thẳng với ところ).',
      ],
    },

    /* ══════ ④ ～のに ══════ */
    { t: 'h', text: '④ 普通形 ＋ のに — "vậy mà, thế mà": kết quả trái với kỳ vọng' },
    {
      t: 'p',
      text: '**A のに B** = "A (là sự thật) **vậy mà** B" — từ A, người ta **chờ đợi** một kết quả, nhưng B lại **ngược lại**, và người nói thấy **bất mãn, tiếc, ngạc nhiên** (đôi khi ngạc nhiên vui: {初|はじ}めてなのに{上手|じょうず}). Khác **～が／～けど** (chỉ nối hai ý trái nhau, trung tính), **のに mang cảm xúc**. Cả A và B đều là **sự thật** (đã / đang xảy ra) — nên vế B **không thể** là ý định, mệnh lệnh, lời nhờ, lời rủ.',
    },
    {
      t: 'table',
      caption: 'Cách nối ～のに — thể thường; ナA và N hiện tại khẳng định dùng な',
      head: ['Loại từ', 'Hiện tại', 'Quá khứ', 'Phủ định', 'Ví dụ'],
      rows: [
        ['Động từ', '{行|い}く**のに**', '{行|い}った**のに**', '{行|い}かない**のに**', '{薬|くすり}を{飲|の}んだのに、{熱|ねつ}が{下|さ}がりません。'],
        ['Tính từ い', '{安|やす}い**のに**', '{安|やす}かった**のに**', '{安|やす}くない**のに**', 'この{店|みせ}は{安|やす}いのに、おいしいです。'],
        ['Tính từ な', '{静|しず}か**な**のに', '{静|しず}かだった**のに**', '{静|しず}かじゃない**のに**', '{便利|べんり}なのに、{誰|だれ}も{使|つか}いません。'],
        ['Danh từ', '{日曜日|にちようび}**な**のに', '{日曜日|にちようび}だった**のに**', '{日曜日|にちようび}じゃない**のに**', '{日曜日|にちようび}なのに、{仕事|しごと}があります。'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'A（普通形）のに、B — A vậy mà B (B trái với điều A khiến ta chờ đợi)',
          vi: 'Hay gặp nhất: **đã cố gắng / đã chuẩn bị** (A) **vậy mà** kết quả xấu (B). Đi kèm các từ nhấn: **せっかく・ちゃんと・あんなに・{毎日|まいにち}・{一生懸命|いっしょうけんめい}**.',
          examples: [
            E('{毎日|まいにち}{勉強|べんきょう}したのに、{試験|しけん}に{落|お}ちてしまいました。', 'Mainichi benkyou shita noni, shiken ni ochite shimaimashita.', 'Ngày nào cũng học vậy mà vẫn thi trượt.'),
            E('{急|いそ}いだのに、{電車|でんしゃ}に{乗|の}り{遅|おく}れました。', 'Isoida noni, densha ni noriokuremashita.', 'Đã vội vậy mà vẫn lỡ tàu.'),
            E('{約束|やくそく}したのに、{友達|ともだち}は{来|き}ませんでした。', 'Yakusoku shita noni, tomodachi wa kimasen deshita.', 'Đã hẹn rồi vậy mà bạn không đến.'),
            E('もう{4月|しがつ}なのに、まだ{寒|さむ}いですね。', 'Mou shigatsu na noni, mada samui desu ne.', 'Đã tháng 4 rồi mà vẫn lạnh nhỉ.'),
            E('この{部屋|へや}は{駅|えき}から{近|ちか}いのに、{家賃|やちん}が{安|やす}いです。', 'Kono heya wa eki kara chikai noni, yachin ga yasui desu.', 'Phòng này gần ga vậy mà tiền nhà rẻ. (ngạc nhiên vui)'),
            E('{弟|おとうと}は{子|こ}どもなのに、{漢字|かんじ}をたくさん{知|し}っています。', 'Otouto wa kodomo na noni, kanji o takusan shitte imasu.', 'Em trai tôi còn nhỏ vậy mà biết rất nhiều chữ Hán.'),
          ],
        },
        {
          formula: '～のに。 (cuối câu) · ～ばよかったのに · せっかく～のに',
          vi: '**Đặt cuối câu** (bỏ lửng vế B): than, tiếc, trách nhẹ. **～ばよかったのに** (ôn ～ば Bài 17) = "giá mà đã ~ thì tốt" — tiếc việc mình (hoặc người khác) đã không làm. **せっかく～のに** = "đã mất công ~ vậy mà".',
          examples: [
            E('もっと{早|はや}く{言|い}ってくれればよかったのに。', 'Motto hayaku itte kurereba yokatta noni.', 'Phải chi cậu nói với mình sớm hơn. (trách nhẹ)'),
            E('かばんに{入|い}れておけばよかったのに……。', 'Kaban ni irete okeba yokatta noni…….', 'Giá mà đã cất sẵn vào túi… (tự tiếc)'),
            E('せっかく{作|つく}ったのに、{誰|だれ}も{食|た}べてくれませんでした。', 'Sekkaku tsukutta noni, daremo tabete kuremasen deshita.', 'Đã mất công nấu vậy mà chẳng ai ăn cho.'),
            E('せっかく{来|き}たのに、{店|みせ}が{休|やす}みだった。', 'Sekkaku kita noni, mise ga yasumi datta.', 'Mất công đến vậy mà quán lại nghỉ.'),
            E('ちゃんと{準備|じゅんび}したのに……。', 'Chanto junbi shita noni…….', 'Đã chuẩn bị đàng hoàng rồi vậy mà… (bỏ lửng)'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Phân biệt ～のに · ～ても · ～けど／～が · ～ので (đề N4 hay hỏi)',
      head: ['Mẫu', 'Nghĩa', 'Vế trước', 'Vế sau được là ý chí / mệnh lệnh?', 'Ví dụ'],
      rows: [
        ['～のに', 'vậy mà (trái kỳ vọng + cảm xúc)', 'sự thật', '✗ KHÔNG', '{雨|あめ}なのに、{彼|かれ}は{傘|かさ}を{持|も}たないで{出|で}かけた。'],
        ['～ても (ポイント 121)', 'dù có… thì vẫn (giả định hoặc sự thật)', 'giả định được', '✓ được', '{雨|あめ}が{降|ふ}っても、{行|い}きます。'],
        ['～けど／～が', 'nhưng (trung tính, chỉ nối ý)', 'sự thật', '✓ được', '{雨|あめ}だけど、{行|い}こう。'],
        ['～ので', 'vì (nguyên nhân — ngược hướng)', 'sự thật', '✓ (lịch sự)', '{雨|あめ}なので、{行|い}きません。'],
      ],
    },
    {
      t: 'note',
      title: '⚠ Luật quan trọng nhất của ～のに — vế sau không phải ý muốn của người nói',
      items: [
        '~~{雨|あめ}なのに、{出|で}かけましょう~~ (rủ) · ~~{高|たか}いのに、{買|か}いたいです~~ (muốn) · ~~{忙|いそが}しいのに、{手伝|てつだ}ってください~~ (nhờ) → đều SAI. Đổi sang **～けど／～が／～ても**: {雨|あめ}だけど、{出|で}かけましょう · {高|たか}くても、{買|か}いたいです.',
        'のに nói về **kết quả đã thấy** (hoặc chắc chắn): {勉強|べんきょう}したのに{落|お}ちた ✓. Không nói về tương lai mình chọn: ~~{勉強|べんきょう}するのに、{遊|あそ}びます~~ ✗.',
        '**のに có cảm xúc** → dùng khi nói chuyện thân hoặc kể; trong câu trình bày lịch sự trung tính (giới thiệu sản phẩm, báo cáo) thì dùng ～が／～けれども.',
      ],
    },

    /* ── ④′ ── */
    { t: 'h', text: '④′ Biết thêm — のに thứ hai: Vる ＋ のに "dùng để, để mà" (đừng nhầm với ④)' },
    {
      t: 'p',
      text: 'Đề N4 có một **のに khác hẳn**: **V{辞書形|じしょけい} ＋ のに** + {使|つか}う／{便利|べんり}だ／いい／{必要|ひつよう}だ／（{時間|じかん}・お{金|かね}が）かかる = "**để** (làm V) thì…". Ở đây のに = の (biến động từ thành danh từ) + に (mục đích). Cách nhận ra: sau のに là **{使|つか}う, {便利|べんり}, {必要|ひつよう}, かかる, いい** — không phải một kết quả trái ý. (Mẫu mục đích đầy đủ ～ために học ở **Bài 21**.)',
    },
    {
      t: 'table',
      caption: 'Hai loại のに — nhìn vế sau để phân biệt',
      head: ['Câu', 'Romaji', 'Loại', 'Nghĩa'],
      rows: [
        ['{駅|えき}まで{行|い}くのに、{30分|さんじゅっぷん}かかります。', 'Eki made iku noni, sanjuppun kakarimasu.', '④′ dùng để', 'Đi ra ga thì mất 30 phút.'],
        ['この{箱|はこ}は{引|ひ}っ{越|こ}しに{使|つか}います。／この{箱|はこ}は{本|ほん}を{入|い}れるのに{使|つか}います。', 'Kono hako wa hikkoshi ni tsukaimasu. / Kono hako wa hon o ireru noni tsukaimasu.', '④′ dùng để', 'Thùng này dùng để đựng sách. (danh từ thì chỉ cần に)'],
        ['このナイフは{野菜|やさい}を{切|き}るのに{便利|べんり}です。', 'Kono naifu wa yasai o kiru noni benri desu.', '④′ dùng để', 'Con dao này tiện để thái rau.'],
        ['{駅|えき}まで{走|はし}ったのに、{電車|でんしゃ}が{行|い}ってしまった。', 'Eki made hashitta noni, densha ga itte shimatta.', '④ vậy mà', 'Đã chạy ra ga vậy mà tàu vẫn chạy mất.'],
        ['{新|あたら}しいナイフを{買|か}ったのに、{全然|ぜんぜん}{使|つか}っていない。', 'Atarashii naifu o katta noni, zenzen tsukatte inai.', '④ vậy mà', 'Mua dao mới rồi vậy mà chẳng dùng tới.'],
      ],
    },
    { t: 'rule', formula: 'A（普通形；ナA・N ＋ な）のに、B ／ ～のに。／ ～ばよかったのに', vi: 'A là sự thật, B trái với điều A khiến ta chờ đợi; người nói bất mãn, tiếc hoặc ngạc nhiên. Vế B không được là ý chí, mệnh lệnh, nhờ, rủ (khi đó dùng ～けど／～ても). Khác のに "dùng để" (Vる のに 使う／便利だ／かかる).' },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～のに',
      items: [
        'Nối sai với ナA / N: ~~{静|しず}かだのに~~, ~~{学生|がくせい}だのに~~ → **{静|しず}かなのに**, **{学生|がくせい}なのに**. Quá khứ thì giữ だった: {静|しず}かだったのに.',
        'Vế sau là ý chí: ~~{疲|つか}れているのに、もう{少|すこ}し{頑張|がんば}ります~~ → **{疲|つか}れているけど**、もう{少|すこ}し{頑張|がんば}ります.',
        'Dùng thể lịch sự trước のに: ~~{勉強|べんきょう}しましたのに~~ (rất trang trọng, hiếm gặp) → **{勉強|べんきょう}したのに**. Lịch sự đặt ở cuối câu: ～のに、～ませんでした.',
        'Nhầm với ので (ngược nghĩa): ~~{雨|あめ}なのに、{行|い}きませんでした~~ (= trời mưa vậy mà không đi?? vô lý) → **{雨|あめ}なので**、{行|い}きませんでした.',
      ],
    },
    DL('Hỏi – đáp: than với bạn, an ủi bạn', [
      ['パク', 'c', 'ダニエルさん、{試験|しけん}どうでしたか。', 'Danieru-san, shiken dou deshita ka.', 'Daniel, bài thi thế nào?'],
      ['ダニエル', 'b', 'だめでした。{毎晩|まいばん}{遅|おそ}くまで{勉強|べんきょう}したのに……。', 'Dame deshita. Maiban osoku made benkyou shita noni…….', 'Hỏng rồi. Tối nào mình cũng học đến khuya vậy mà…'],
      ['パク', 'c', 'そうですか。でも、{気|き}にしないでください。{次|つぎ}はきっと{大丈夫|だいじょうぶ}ですよ。', 'Sou desu ka. Demo, ki ni shinaide kudasai. Tsugi wa kitto daijoubu desu yo.', 'Vậy à. Nhưng đừng bận tâm. Lần sau chắc chắn sẽ ổn thôi.'],
      ['ダニエル', 'b', 'ありがとう。……パクさんは？', 'Arigatou. …… Paku-san wa?', 'Cảm ơn. … Còn Park?'],
      ['パク', 'c', '{私|わたし}は{試験|しけん}の{日|ひ}を{間違|まちが}えて、{受|う}けられなかったんです。ちゃんとカレンダーに{書|か}いておいたのに。', 'Watashi wa shiken no hi o machigaete, ukerarenakatta n desu. Chanto karendaa ni kaite oita noni.', 'Mình nhầm ngày thi nên không thi được. Đã ghi sẵn vào lịch cẩn thận rồi vậy mà.'],
      ['ダニエル', 'b', 'えっ、{僕|ぼく}に{聞|き}いてくれればよかったのに。', 'E, boku ni kiite kurereba yokatta noni.', 'Hả, phải chi cậu hỏi mình.'],
    ]),
    {
      t: 'table',
      caption: 'Bảng thay thế — 「＿＿のに、＿＿」 (đã làm A vậy mà B)',
      head: ['A (đã làm / sự thật)', 'B (kết quả trái ý)', 'Câu', 'Romaji'],
      rows: [
        ['{薬|くすり}を{飲|の}んだ', '{熱|ねつ}が{下|さ}がらない', '{薬|くすり}を{飲|の}んだのに、{熱|ねつ}が{下|さ}がりません。', 'Kusuri o nonda noni, netsu ga sagarimasen.'],
        ['ちゃんと{確認|かくにん}した', '{名前|なまえ}を{間違|まちが}えた', 'ちゃんと{確認|かくにん}したのに、{名前|なまえ}を{間違|まちが}えました。', 'Chanto kakunin shita noni, namae o machigaemashita.'],
        ['{日曜日|にちようび}だ', '{店|みせ}が{休|やす}み', '{日曜日|にちようび}なのに、{店|みせ}が{休|やす}みでした。', 'Nichiyoubi na noni, mise ga yasumi deshita.'],
        ['{高|たか}かった', 'すぐ{壊|こわ}れた', '{高|たか}かったのに、すぐ{壊|こわ}れてしまいました。', 'Takakatta noni, sugu kowarete shimaimashita.'],
        ['{有名|ゆうめい}な{店|みせ}だ', 'おいしくない', '{有名|ゆうめい}な{店|みせ}なのに、あまりおいしくなかったです。', 'Yuumei na mise na noni, amari oishiku nakatta desu.'],
        ['{目覚|めざ}まし{時計|どけい}をかけた', '{寝坊|ねぼう}した', '{目覚|めざ}まし{時計|どけい}をかけたのに、{寝坊|ねぼう}してしまいました。', 'Mezamashi-dokei o kaketa noni, nebou shite shimaimashita.'],
      ],
    },

    /* ══════ TỔNG KẾT ══════ */
    { t: 'h', text: 'Luyện tổng hợp — ghép câu, chia, điền, trắc nghiệm kiểu đề N4' },
    {
      t: 'build',
      id: 'b19-np-ghep',
      title: 'Ghép câu — bấm mảnh theo đúng thứ tự (12 câu)',
      items: [
        { vi: 'Tôi lỡ làm vỡ đĩa mất rồi.', chips: ['お{皿|さら}を', '{割|わ}って', 'しまいました', 'みました', 'お{皿|さら}が'], answer: ['お{皿|さら}を', '{割|わ}って', 'しまいました'], ro: 'Osara o watte shimaimashita.' },
        { vi: 'Bài tập tôi đã làm xong hết rồi.', chips: ['{宿題|しゅくだい}は', 'もう', '{全部|ぜんぶ}', 'やって', 'しまいました', 'みました'], answer: ['{宿題|しゅくだい}は', 'もう', '{全部|ぜんぶ}', 'やって', 'しまいました'], ro: 'Shukudai wa mou zenbu yatte shimaimashita.' },
        { vi: 'Lỡ cho 300 gram mất rồi. (văn nói)', chips: ['300グラム', '{入|い}れ', 'ちゃった', 'じゃった', '{入|い}れて'], answer: ['300グラム', '{入|い}れ', 'ちゃった'], ro: 'Sanbyaku guramu irechatta.' },
        { vi: 'Tôi muốn mặc thử kimono một lần.', chips: ['{一度|いちど}', '{着物|きもの}を', '{着|き}て', 'みたいです', 'しまいたいです', '{着|き}る'], answer: ['{一度|いちど}', '{着物|きもの}を', '{着|き}て', 'みたいです'], alt: [['{着物|きもの}を', '{一度|いちど}', '{着|き}て', 'みたいです']], ro: 'Ichido kimono o kite mitai desu.' },
        { vi: 'Cậu thử hỏi thầy xem?', chips: ['{先生|せんせい}に', '{聞|き}いて', 'みたら', 'しまったら', '{聞|き}く'], answer: ['{先生|せんせい}に', '{聞|き}いて', 'みたら'], ro: 'Sensei ni kiite mitara?' },
        { vi: 'Tôi sắp ra ngoài ngay bây giờ.', chips: ['{今|いま}から', '{出|で}かける', 'ところです', '{出|で}かけた', '{出|で}かけて'], answer: ['{今|いま}から', '{出|で}かける', 'ところです'], ro: 'Ima kara dekakeru tokoro desu.' },
        { vi: 'Tôi đang tìm chìa khoá.', chips: ['{今|いま}', '{鍵|かぎ}を', '{探|さが}して', 'いる', 'ところです', '{探|さが}した'], answer: ['{今|いま}', '{鍵|かぎ}を', '{探|さが}して', 'いる', 'ところです'], ro: 'Ima kagi o sagashite iru tokoro desu.' },
        { vi: 'Tôi vừa mới tới ga.', chips: ['ちょうど{今|いま}', '{駅|えき}に', '{着|つ}いた', 'ところです', '{着|つ}く', 'ばかり'], answer: ['ちょうど{今|いま}', '{駅|えき}に', '{着|つ}いた', 'ところです'], ro: 'Choudo ima eki ni tsuita tokoro desu.' },
        { vi: 'Ngày nào cũng học vậy mà vẫn thi trượt.', chips: ['{毎日|まいにち}', '{勉強|べんきょう}した', 'のに', '{試験|しけん}に', '{落|お}ちました', 'ので'], answer: ['{毎日|まいにち}', '{勉強|べんきょう}した', 'のに', '{試験|しけん}に', '{落|お}ちました'], ro: 'Mainichi benkyou shita noni, shiken ni ochimashita.' },
        { vi: 'Chủ nhật vậy mà vẫn phải đi làm.', chips: ['{日曜日|にちようび}', 'な', 'のに', '{仕事|しごと}が', 'あります', 'だ'], answer: ['{日曜日|にちようび}', 'な', 'のに', '{仕事|しごと}が', 'あります'], ro: 'Nichiyoubi na noni, shigoto ga arimasu.' },
        { vi: 'Phải chi cậu nói sớm hơn.', chips: ['もっと', '{早|はや}く', '{言|い}えば', 'よかった', 'のに', 'ので'], answer: ['もっと', '{早|はや}く', '{言|い}えば', 'よかった', 'のに'], ro: 'Motto hayaku ieba yokatta noni.' },
        { vi: 'Đi ra ga thì mất 20 phút.', chips: ['{駅|えき}まで', '{行|い}く', 'のに', '{20分|にじゅっぷん}', 'かかります', '{行|い}った'], answer: ['{駅|えき}まで', '{行|い}く', 'のに', '{20分|にじゅっぷん}', 'かかります'], ro: 'Eki made iku noni nijuppun kakarimasu.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b19-np-chia',
      title: 'Chia — gõ dạng được yêu cầu (12 câu)',
      kind: 'fill',
      grammar: 'Thể て + しまう／みる · ～ちゃう／～じゃう · Vる／Vている／Vた + ところ · 普通形 + のに (ナA・N + な)',
      items: [
        { q: '{落|お}とす → ～てしまいました', answers: V('{落|お}としてしまいました'), hint: 'す → して' },
        { q: '{割|わ}る → ～てしまいました', answers: V('{割|わ}ってしまいました'), hint: 'る (nhóm 1) → って' },
        { q: '{盗|ぬす}む → ～てしまった', answers: V('{盗|ぬす}んでしまった'), hint: 'む → んで' },
        { q: '{忘|わす}れる → ～ちゃった (văn nói)', answers: V('{忘|わす}れちゃった'), hint: 'てしまった → ちゃった' },
        { q: '{飲|の}む → ～じゃった (văn nói)', answers: V('{飲|の}んじゃった'), hint: 'でしまった → じゃった' },
        { q: '{着|き}る → ～てみたいです', answers: V('{着|き}てみたいです'), hint: 'nhóm 2: bỏ る + て' },
        { q: '{行|い}く → ～てみませんか', answers: V('{行|い}ってみませんか'), hint: '行く → 行って' },
        { q: '{聞|き}く → ～てみたら？', answers: V('{聞|き}いてみたら'), hint: 'く → いて' },
        { q: '{出|で}かける → sắp (～ところです)', answers: V('{出|で}かけるところです'), hint: 'Vる + ところ' },
        { q: '{探|さが}す → đang (～ところです)', answers: V('{探|さが}しているところです'), hint: 'Vている + ところ' },
        { q: '{着|つ}く → vừa xong (～ところです)', answers: V('{着|つ}いたところです'), hint: 'Vた + ところ' },
        { q: '{便利|べんり} → ～のに (hiện tại)', answers: V('{便利|べんり}なのに'), hint: 'ナA + な + のに' },
      ],
    },
    {
      t: 'quiz',
      id: 'b19-np-dien',
      title: 'Điền vào chỗ trống — dùng đúng mẫu của bài (10 câu)',
      kind: 'fill',
      grammar: '～てしまう · ～てみる · ～ところ · ～のに',
      items: [
        { q: 'すみません、{借|か}りた{本|ほん}を（{汚|よご}す → lỡ, lịch sự, quá khứ）。', answers: V('{汚|よご}してしまいました'), hint: '～てしまいました' },
        { q: 'このケーキ、おいしいですよ。{一度|いちど}（{食|た}べる → mời thử）ください。', answers: V('{食|た}べてみて'), hint: '～てみてください' },
        { q: 'A「もう{家|いえ}を{出|で}た？」 B「ううん、{今|いま}から（{出|で}る → sắp）ところ。」', answers: V('{出|で}る'), hint: 'Vる + ところ' },
        { q: '{今|いま}、{料理|りょうり}を（{作|つく}る → đang）ところだから、あとで{電話|でんわ}するね。', answers: V('{作|つく}っている'), hint: 'Vている + ところ' },
        { q: 'さっき{家|いえ}に（{帰|かえ}る → vừa xong）ところです。', answers: V('{帰|かえ}った', '{帰|かえ}ってきた'), hint: 'Vた + ところ' },
        { q: '{毎日|まいにち}{練習|れんしゅう}した（　）、{試合|しあい}に{負|ま}けてしまいました。', answers: ['のに'], hint: 'vậy mà' },
        { q: 'もう{春|はる}（　）のに、まだ{寒|さむ}いです。', answers: ['な'], hint: 'N + な + のに' },
        { q: '{財布|さいふ}をかばんに{入|い}れて（{置|お}く → ば）よかったのに。', answers: V('おけば'), hint: '～ておけば' },
        { q: '{面白|おもしろ}そうな{本|ほん}ですね。{私|わたし}も（{読|よ}む → muốn thử）たいです。', answers: V('{読|よ}んでみ'), hint: '～てみたい' },
        { q: '{嫌|いや}な{仕事|しごと}は{早|はや}く（やる → làm cho xong, ý chí）。', answers: V('やってしまおう', 'やってしまいましょう'), hint: '～てしまおう' },
      ],
    },
    {
      t: 'mcq',
      id: 'b19-np-jlpt',
      title: 'Trắc nghiệm dạng đề JLPT N4 — 文法形式の判断 (10 câu) + 文の組み立て ★ (4 câu)',
      items: [
        { q: '{電車|でんしゃ}の{中|なか}に{傘|かさ}を{忘|わす}れて（　）。', options: ['みました', 'しまいました', 'おきました', 'ありました'], correct: 1, why: 'Lỡ để quên — việc đáng tiếc → **～てしまいました**. 〔Densha no naka ni kasa o wasurete shimaimashita.〕' },
        { q: 'この{服|ふく}、{着|き}て（　）もいいですか。', options: ['しまって', 'おいて', 'みて', 'あって'], correct: 2, why: 'Xin mặc thử → **～てみてもいいですか**. 〔Kono fuku, kite mite mo ii desu ka.〕' },
        { q: 'A「もしもし、{今|いま}どこ？」 B「ちょうど{今|いま}、{駅|えき}に{着|つ}いた（　）だよ。」', options: ['ところ', 'のに', 'つもり', 'はず'], correct: 0, why: 'ちょうど{今|いま} + Vた → vừa mới tới → **ところ**. つもり là dự định; はず (Bài 20) là suy đoán — đều không hợp khi chính mình vừa tới. 〔Choudo ima, eki ni tsuita tokoro da yo.〕' },
        { q: '{今|いま}、{晩|ばん}ご{飯|はん}を{作|つく}って（　）ところです。', options: ['いる', 'しまう', 'みる', 'ある'], correct: 0, why: 'Đang đúng lúc làm → **Vている + ところ**. 〔Ima, bangohan o tsukutte iru tokoro desu.〕' },
        { q: 'これから{会議|かいぎ}が（　）ところです。{急|いそ}いでください。', options: ['{始|はじ}まった', '{始|はじ}まる', '{始|はじ}まって', '{始|はじ}まっている'], correct: 1, why: 'これから (sắp) → **Vる + ところ**: {始|はじ}まるところ. 〔Korekara kaigi ga hajimaru tokoro desu.〕' },
        { q: '{一生懸命|いっしょうけんめい}{練習|れんしゅう}した（　）、{優勝|ゆうしょう}できませんでした。', options: ['ので', 'のに', 'から', 'ても'], correct: 1, why: 'Đã cố vậy mà kết quả trái ý → **のに**. ので／から là lý do (ngược nghĩa). 〔Isshoukenmei renshuu shita noni, yuushou dekimasen deshita.〕' },
        { q: 'あの{公園|こうえん}は（　）のに、{誰|だれ}もいません。', options: ['きれいだ', 'きれいな', 'きれい', 'きれいで'], correct: 1, why: 'ナA + **な** + のに: きれいなのに. 〔Ano kouen wa kirei na noni, daremo imasen.〕' },
        { q: '（　）、{出|で}かけましょう。', options: ['{雨|あめ}なのに', '{雨|あめ}だけど', '{雨|あめ}なので', '{雨|あめ}だから'], correct: 1, why: 'Vế sau là lời RỦ → không dùng のに; nối ý trái nhau trung tính → **{雨|あめ}だけど**. ので／から (vì mưa nên đi) vô lý. 〔Ame da kedo, dekakemashou.〕' },
        { q: 'A「{宿題|しゅくだい}、もう{終|お}わった？」 B「うん、{一時間|いちじかん}で{全部|ぜんぶ}やって（　）。」', options: ['みた', 'しまった', 'あった', 'いた'], correct: 1, why: 'Làm xong hết (hoàn thành) → **～てしまった**. 〔Ichijikan de zenbu yatte shimatta.〕' },
        { q: 'このかばんは{軽|かる}くて、{旅行|りょこう}に{行|い}く（　）{便利|べんり}です。', options: ['のに', 'ので', 'けど', 'ところ'], correct: 0, why: '**Vる + のに + {便利|べんり}** = tiện để (đi du lịch) — のに "dùng để" (④′). 〔Ryokou ni iku noni benri desu.〕' },
        { q: '★ {昨日|きのう} ＿＿ ＿＿ ★ ＿＿ しまいました。（{駅|えき}で／{落|お}として／{財布|さいふ}を／{新|あたら}しい）', options: ['{駅|えき}で', '{落|お}として', '{財布|さいふ}を', '{新|あたら}しい'], correct: 2, why: 'Câu đúng: {昨日|きのう} **{駅|えき}で {新|あたら}しい {財布|さいふ}を {落|お}として** しまいました. Ô ★ (thứ 3) = **{財布|さいふ}を**. 〔Kinou eki de atarashii saifu o otoshite shimaimashita.〕' },
        { q: '★ {一度|いちど} ＿＿ ＿＿ ★ ＿＿ です。（{日本|にほん}の／{着|き}て／{着物|きもの}を／みたい）', options: ['{日本|にほん}の', '{着|き}て', '{着物|きもの}を', 'みたい'], correct: 1, why: 'Câu đúng: {一度|いちど} **{日本|にほん}の {着物|きもの}を {着|き}て みたい** です. Ô ★ (thứ 3) = **{着|き}て**. 〔Ichido Nihon no kimono o kite mitai desu.〕' },
        { q: '★ {今|いま} ＿＿ ＿＿ ★ ＿＿、あとで{電話|でんわ}します。（ところ／{会議|かいぎ}を／なので／している）', options: ['ところ', '{会議|かいぎ}を', 'なので', 'している'], correct: 0, why: 'Câu đúng: {今|いま} **{会議|かいぎ}を している ところ なので**、あとで{電話|でんわ}します. Ô ★ (thứ 3) = **ところ**. 〔Ima kaigi o shite iru tokoro na node, ato de denwa shimasu.〕' },
        { q: '★ せっかく ＿＿ ＿＿ ★ ＿＿ 、{誰|だれ}も{来|き}ませんでした。（のに／{料理|りょうり}を／たくさん／{作|つく}った）', options: ['のに', '{料理|りょうり}を', 'たくさん', '{作|つく}った'], correct: 3, why: 'Câu đúng: せっかく **{料理|りょうり}を たくさん {作|つく}った のに**、{誰|だれ}も{来|き}ませんでした. Ô ★ (thứ 3) = **{作|つく}った**. 〔Sekkaku ryouri o takusan tsukutta noni, daremo kimasen deshita.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const HAN_TU: Lesson = {
  id: 'b19-han-tu',
  kind: 'kanji',
  title: 'Chữ Hán mới — 15 chữ: 失 敗 次 違 困 覚 破 折 刻 悲 怒 謝 直 警 察',
  goal: 'Đọc đúng (không cần furigana) và hiểu nghĩa 15 chữ Hán mới của Bài 19 trong các từ hay gặp khi nói về sự cố, thất bại, xin lỗi (失敗・失礼・次・目次・違う・間違い・困る・覚える・目が覚める・破れる・約束を破る・折れる・骨折・遅刻・時刻・悲しい・怒る・謝る・感謝・直す・正直・直接・警察・診察…), chọn đúng chữ khi đề cho hiragana, phân biệt chữ trông giống (失・夫, 困・因, 怒・努, 警・驚, 察・祭…) và viết tay được các chữ ✍.',
  minutes: 45,
  blocks: [
    {
      t: 'p',
      text: 'Đến Bài 18 bạn đã gặp gần như **toàn bộ chữ N4**, nên chữ mới của Bài 19 là **15 chữ N3** đi theo các từ của chủ đề sự cố mà bạn sẽ gặp trên biển báo, thông báo nhà ga, tin nhắn xin lỗi, bài đọc N4–N3 (失 敗 次 違 困 覚 破 折 刻 悲 怒 謝 直 警 察). Cấp ghi theo các bảng tham khảo phổ biến — JLPT không công bố danh sách chữ chính thức, nên vài chữ ({次|つぎ}, {違|ちが}う, {悲|かな}しい) có bảng xếp vào N4. Cột **Mức**: ✍ = nên viết được, 👁 = nhận mặt (đọc + hiểu). Học **theo từ**: {失敗|しっぱい} (shippai), {遅刻|ちこく} (chikoku), {警察|けいさつ} (keisatsu) — đề 漢字読み và 表記 hỏi **cả từ**.',
    },
    {
      t: 'table',
      caption: '15 chữ Hán mới của Bài 19',
      head: ['Chữ', 'Hán Việt', 'Âm On', 'Âm Kun', 'Nghĩa', 'Từ ví dụ', 'Mức'],
      rows: [
        ['失', 'THẤT', 'シツ', 'うしな(う)', 'mất, sai sót', '{失敗|しっぱい} (thất bại) · {失礼|しつれい} (thất lễ; xin phép) · {失|うしな}う (đánh mất) · {失恋|しつれん} (thất tình)', '✍ N3'],
        ['敗', 'BẠI', 'ハイ', 'やぶ(れる)', 'thua, hỏng', '{失敗|しっぱい} (thất bại) · {勝敗|しょうはい} (thắng thua) · {敗|やぶ}れる (thua — N2)', '👁 N3'],
        ['次', 'THỨ', 'ジ・シ', 'つ(ぐ)・つぎ', 'tiếp theo, kế', '{次|つぎ} (lần sau, cái tiếp) · {次|つぎ}の{日|ひ} (hôm sau) · {目次|もくじ} (mục lục) · {次回|じかい} (lần tới)', '✍ N3'],
        ['違', 'VI', 'イ', 'ちが(う)・ちが(える)', 'khác, sai', '{違|ちが}う (khác, sai) · {間違|まちが}える (nhầm) · {間違|まちが}い (chỗ sai) · {違反|いはん} (vi phạm — N2)', '👁 N3'],
        ['困', 'KHỐN', 'コン', 'こま(る)', 'khó khăn, khốn đốn', '{困|こま}る (khó xử, gặp rắc rối) · {困|こま}ったこと (chuyện phiền) · {困難|こんなん} (khó khăn — N2)', '✍ N3'],
        ['覚', 'GIÁC', 'カク', 'おぼ(える)・さ(める)・さ(ます)', 'nhớ; tỉnh dậy; cảm giác', '{覚|おぼ}える (nhớ) · {目|め}が{覚|さ}める (tỉnh giấc) · {目覚|めざ}まし{時計|どけい} (đồng hồ báo thức) · {感覚|かんかく} (cảm giác)', '👁 N3'],
        ['破', 'PHÁ', 'ハ', 'やぶ(る)・やぶ(れる)', 'phá, xé, rách', '{破|やぶ}れる (rách) · {破|やぶ}る (xé) · {約束|やくそく}を{破|やぶ}る (thất hứa)', '👁 N3'],
        ['折', 'CHIẾT', 'セツ', 'お(る)・お(れる)・おり', 'bẻ, gập, gãy', '{折|お}る (bẻ, gập) · {折|お}れる (gãy) · {骨折|こっせつ} (gãy xương) · {折|お}り{紙|がみ} (gấp giấy)', '✍ N3'],
        ['刻', 'KHẮC', 'コク', 'きざ(む)', 'khắc; thời khắc', '{遅刻|ちこく} (đến muộn) · {時刻|じこく} (giờ, thời khắc) · {時刻表|じこくひょう} (bảng giờ tàu) · {深刻|しんこく} (nghiêm trọng — N2)', '👁 N3'],
        ['悲', 'BI', 'ヒ', 'かな(しい)・かな(しむ)', 'buồn, bi', '{悲|かな}しい (buồn) · {悲|かな}しむ (đau buồn) · {悲劇|ひげき} (bi kịch — N2)', '✍ N3'],
        ['怒', 'NỘ', 'ド', 'おこ(る)・いか(る)', 'giận', '{怒|おこ}る (nổi giận) · {怒|いか}り (cơn giận — N2)', '👁 N3'],
        ['謝', 'TẠ', 'シャ', 'あやま(る)', 'tạ lỗi; cảm tạ', '{謝|あやま}る (xin lỗi) · {感謝|かんしゃ} (cảm tạ, biết ơn) · {感謝|かんしゃ}する', '👁 N3'],
        ['直', 'TRỰC', 'チョク・ジキ', 'なお(す)・なお(る)・ただ(ちに)', 'thẳng, ngay; sửa', '{直|なお}す (sửa) · {直|なお}る (được sửa) · {正直|しょうじき} (thật thà) · {直接|ちょくせつ} (trực tiếp) · {素直|すなお} (ngoan, thẳng thắn)', '✍ N3'],
        ['警', 'CẢNH', 'ケイ', '—', 'cảnh báo, canh giữ', '{警察|けいさつ} (cảnh sát) · {警官|けいかん} (viên cảnh sát) · {警察官|けいさつかん} · {警告|けいこく} (cảnh cáo — N2)', '👁 N3'],
        ['察', 'SÁT', 'サツ', '—', 'xem xét kỹ', '{警察|けいさつ} (cảnh sát) · {診察|しんさつ} (khám bệnh) · {観察|かんさつ} (quan sát — N2)', '👁 N3'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ bằng cấu tạo chữ (học kèm khi tập viết)',
      items: [
        '**失** — sách cổ giải thích là 手 (bàn tay) + 乙 (gợi âm). Mẹo nhìn: một bàn tay mà có vật **tuột ra** qua kẽ ngón (nét phẩy nhô lên đầu) = để **MẤT** → {失敗|しっぱい}, {失礼|しつれい}. Khác **夫** (chồng) ở chính nét phẩy đó.',
        '**敗** = 貝 (vỏ sò — vật quý, tiền) + 攵 (bàn tay cầm gậy đánh): đập vỡ đồ quý = **HỎNG, THUA** → {失敗|しっぱい} (mất + hỏng).',
        '**次** = 冫 (gốc là 二 — "hai", gợi âm) + 欠 (người há miệng): người **thứ hai** há miệng chờ tới lượt = **KẾ TIẾP** → {次|つぎ}, {目次|もくじ}.',
        '**違** = 辶 (bước đi) + 韋 (gợi âm イ; vốn vẽ hai bàn chân đi ngược chiều nhau): đi trái hướng nhau = **KHÁC, SAI** → {違|ちが}う, {間違|まちが}い. 韋 cũng nằm trong 韓 ({韓国|かんこく} — Bài 1).',
        '**困** = 囗 (khung bao quanh) + 木 (cây): cây bị nhốt trong khung, không lớn lên được = **KHỐN ĐỐN, khó khăn** → {困|こま}る. Khác 因 ({原因|げんいん} — trong khung là 大).',
        '**覚** — chữ cũ 覺 = phần trên của 學 (học — gợi âm) + 見 (thấy): học rồi thấy ra = **HIỂU, NHỚ**; thấy rõ lại = **TỈNH** → {覚|おぼ}える, {目|め}が{覚|さ}める. Nhìn: trên giống 学, dưới là 見.',
        '**破** = 石 (đá) + 皮 (da — gợi âm ハ): đá đập làm toạc ra = **PHÁ, RÁCH** → {破|やぶ}れる, {約束|やくそく}を{破|やぶ}る.',
        '**折** = 扌 (tay) + 斤 (cái rìu): tay cầm rìu chặt cành = **BẺ GÃY** → {折|お}れる, {骨折|こっせつ}.',
        '**刻** = 亥 (gợi âm) + 刂 (con dao): dùng dao **KHẮC** vạch; đồng hồ nước xưa khắc vạch chia giờ → {時刻|じこく} (giờ), {遅刻|ちこく} (trễ giờ).',
        '**悲** = 非 (trái, không — gợi âm ヒ) + 心 (lòng): lòng trái ý = **BUỒN** → {悲|かな}しい.',
        '**怒** = 奴 (nô lệ — gợi âm ド) + 心 (lòng): lòng người nô lệ sôi lên = **GIẬN** → {怒|おこ}る. Khác 努 ({努力|どりょく} — dưới là 力).',
        '**謝** = 言 (lời nói) + 射 (bắn — gợi âm シャ): lời nói ra để **TẠ** lỗi, tạ ơn → {謝|あやま}る, {感謝|かんしゃ}.',
        '**直** = 十 (mười) + 目 (mắt) + nét gấp ㇄ bên dưới: mười con mắt cùng nhìn thì chẳng gì cong vẹo che được = **THẲNG, NGAY** → {正直|しょうじき}; làm cho ngay lại = **SỬA** → {直|なお}す.',
        '**警** = 敬 (kính — gợi âm ケイ) + 言 (lời): lời nhắc để người ta giữ ý = **CẢNH BÁO**, canh giữ → {警察|けいさつ}. Khác 驚 (おどろく — dưới là 馬 con ngựa).',
        '**察** = 宀 (mái nhà) + 祭 (lễ — gợi âm): dưới mái đền khi làm lễ phải **XEM XÉT** kỹ → {警察|けいさつ} (canh giữ + xem xét), {診察|しんさつ} (khám bệnh).',
      ],
    },
    {
      t: 'table',
      caption: 'Đứng riêng hay đứng chung — kun khi đứng một mình / có đuôi kana, on trong từ ghép',
      head: ['Chữ', 'Đứng riêng (kun)', 'Trong từ ghép (on)', 'Bẫy'],
      rows: [
        ['失', '{失|うしな}う', '{失敗|しっぱい}, {失礼|しつれい} (シツ)', 'シツ + ハイ → **しっぱい** (âm ngắt + ぱ) — đừng đọc ~~しつはい~~'],
        ['敗', '{敗|やぶ}れる (ít gặp)', '{失敗|しっぱい} (パイ), {勝敗|しょうはい} (ハイ)', 'trong 失敗 đọc **ぱい**'],
        ['次', '{次|つぎ}, {次|つ}ぐ', '{目次|もくじ}, {次回|じかい} (ジ)', 'もく**じ** — đừng đọc ~~もくつぎ~~'],
        ['違', '{違|ちが}う, {間違|まちが}える', '{違反|いはん} (イ)', 'ちが**う** (khác/sai) ↔ まちが**える** (làm nhầm) ↔ まちが**い** (chỗ sai)'],
        ['困', '{困|こま}る', '{困難|こんなん} (コン)', 'ở N4 gần như chỉ gặp **こまる**'],
        ['覚', '{覚|おぼ}える, {覚|さ}める', '{感覚|かんかく} (カク)', 'hai kun: **おぼえる** (nhớ) / **さめる** (tỉnh giấc: {目|め}が{覚|さ}める)'],
        ['破', '{破|やぶ}る, {破|やぶ}れる', '(ハ — {破産|はさん}, N1)', 'やぶ**れ**る (tự — rách) ↔ やぶ**る** (tha — xé)'],
        ['折', '{折|お}る, {折|お}れる', '{骨折|こっせつ} (セツ → せっ)', '{折|お}り**がみ** — 紙 đục thành がみ'],
        ['刻', '{刻|きざ}む (N2)', '{遅刻|ちこく}, {時刻|じこく} (コク)', 'ち**こく** — không đục: ~~ちごく~~'],
        ['悲', '{悲|かな}しい, {悲|かな}しむ', '{悲劇|ひげき} (ヒ)', 'đuôi kana **しい**: {悲|かな}しい (không viết ~~悲い~~)'],
        ['怒', '{怒|おこ}る, {怒|いか}る', '(ド — hiếm ở N4)', 'văn nói dùng **おこる**; いかる là văn viết'],
        ['謝', '{謝|あやま}る', '{感謝|かんしゃ} (シャ)', 'あや**ま**る — 3 âm sau あ: a-ya-ma-ru'],
        ['直', '{直|なお}す, {直|なお}る', '{直接|ちょくせつ} (チョク), {正直|しょうじき} (ジキ)', 'ba cách đọc: **なお／ちょく／じき**'],
        ['警', '—', '{警察|けいさつ}, {警官|けいかん} (ケイ)', 'trường âm: **keisatsu**, **keikan**'],
        ['察', '—', '{警察|けいさつ}, {診察|しんさつ} (サツ)', 'đọc **さつ** — dù phần dưới là 祭 (さい), không đọc ~~けいさい~~'],
      ],
    },
    {
      t: 'table',
      caption: 'Chữ trông giống — bẫy của đề 表記',
      head: ['Chữ của bài', 'Chữ dễ nhầm', 'Phân biệt'],
      rows: [
        ['失 (mất)', '夫 (chồng — {夫|おっと})', '失 có nét phẩy nhô lên trên đầu; 夫 thì không'],
        ['敗 (hỏng)', '販 (bán — {自動販売機|じどうはんばいき})', 'cùng 貝 bên trái; phải 敗 là 攵, phải 販 là 反'],
        ['次 (tiếp)', '欠 (thiếu — {欠席|けっせき})', '次 có thêm 冫 (hai chấm) bên trái'],
        ['違 (khác)', '韓 ({韓国|かんこく} — Bài 1)', 'cùng có 韋; 違 có 辶 bao dưới'],
        ['困 (khốn)', '因 (nhân — {原因|げんいん})', 'trong khung: 困 là 木 (cây), 因 là 大'],
        ['覚 (nhớ)', '学 (học — {学生|がくせい})', 'trên giống nhau; dưới 覚 là 見, dưới 学 là 子'],
        ['破 (rách)', '波 (sóng — {波|なみ})', 'trái 破 là 石 (đá), trái 波 là 氵 (nước)'],
        ['刻 (khắc)', '割 (vỡ — {割|わ}れる, Bài 15)', 'cùng 刂; trái 刻 là 亥, trái 割 là 害'],
        ['悲 (buồn)', '悪 (xấu — {悪|わる}い)', 'cùng 心 ở dưới; trên 悲 là 非, trên 悪 là 亜'],
        ['怒 (giận)', '努 (cố — {努力|どりょく})', 'cùng 奴 ở trên; dưới 怒 là 心, dưới 努 là 力'],
        ['直 (thẳng)', '真 (thật — {写真|しゃしん})', '真 có 八 (hai chân) ở dưới; 直 có nét gấp ㇄'],
        ['警 (cảnh)', '驚 (kinh — {驚|おどろ}く)', 'cùng 敬 ở trên; dưới 警 là 言, dưới 驚 là 馬'],
        ['察 (xét)', '祭 (lễ — お{祭|まつ}り)', '察 có 宀 (mái nhà) ở trên'],
      ],
    },
    {
      t: 'readkanji',
      id: 'b19-doc-kanji',
      title: 'Đọc KHÔNG furigana — 20 câu (chữ mới + chữ đã học)',
      note: 'Che phần đáp án, đọc to cả câu rồi bấm hiện cách đọc. Câu nào vấp ở chữ mới thì quay lại bảng trên.',
      items: [
        { text: '{初|はじ}めてのアルバイトで、たくさん{失敗|しっぱい}しました。', ro: 'Hajimete no arubaito de, takusan shippai shimashita.', vi: 'Lần đầu đi làm thêm, tôi hỏng việc rất nhiều.' },
        { text: '{先生|せんせい}、{失礼|しつれい}します。', ro: 'Sensei, shitsurei shimasu.', vi: 'Thưa thầy, em xin phép ạ.' },
        { text: '{次|つぎ}からは{気|き}をつけます。', ro: 'Tsugi kara wa ki o tsukemasu.', vi: 'Từ lần sau tôi sẽ cẩn thận.' },
        { text: 'この{本|ほん}の{目次|もくじ}を{見|み}てください。', ro: 'Kono hon no mokuji o mite kudasai.', vi: 'Hãy xem mục lục của quyển sách này.' },
        { text: '{答|こた}えが{違|ちが}いますよ。', ro: 'Kotae ga chigaimasu yo.', vi: 'Đáp án sai rồi đấy.' },
        { text: '{電車|でんしゃ}を{間違|まちが}えて、{遅刻|ちこく}してしまいました。', ro: 'Densha o machigaete, chikoku shite shimaimashita.', vi: 'Tôi lên nhầm tàu nên đã đến muộn.' },
        { text: 'お{金|かね}がなくて、{困|こま}っています。', ro: 'Okane ga nakute, komatte imasu.', vi: 'Không có tiền, tôi đang rất khổ.' },
        { text: '{新|あたら}しい{言葉|ことば}をなかなか{覚|おぼ}えられません。', ro: 'Atarashii kotoba o nakanaka oboeraremasen.', vi: 'Từ mới tôi mãi không nhớ được.' },
        { text: '{朝|あさ}{六時|ろくじ}に{目|め}が{覚|さ}めました。', ro: 'Asa rokuji ni me ga samemashita.', vi: 'Tôi tỉnh giấc lúc 6 giờ sáng.' },
        { text: '{転|ころ}んで、ズボンが{破|やぶ}れてしまいました。', ro: 'Koronde, zubon ga yaburete shimaimashita.', vi: 'Tôi bị ngã, quần rách mất rồi.' },
        { text: '{友達|ともだち}との{約束|やくそく}を{破|やぶ}ってはいけません。', ro: 'Tomodachi to no yakusoku o yabutte wa ikemasen.', vi: 'Không được thất hứa với bạn bè.' },
        { text: '{風|かぜ}で{木|き}の{枝|えだ}が{折|お}れました。', ro: 'Kaze de ki no eda ga oremashita.', vi: 'Cành cây bị gió làm gãy.' },
        { text: 'サッカーの{試合|しあい}で{足|あし}を{骨折|こっせつ}しました。', ro: 'Sakkaa no shiai de ashi o kossetsu shimashita.', vi: 'Tôi bị gãy chân trong trận bóng đá.' },
        { text: '{電車|でんしゃ}の{時刻|じこく}を{調|しら}べておきます。', ro: 'Densha no jikoku o shirabete okimasu.', vi: 'Tôi tra sẵn giờ tàu chạy.' },
        { text: '{大切|たいせつ}な{写真|しゃしん}をなくして、{悲|かな}しいです。', ro: 'Taisetsu na shashin o nakushite, kanashii desu.', vi: 'Làm mất tấm ảnh quan trọng, tôi buồn lắm.' },
        { text: '{約束|やくそく}を{忘|わす}れて、{友達|ともだち}が{怒|おこ}っています。', ro: 'Yakusoku o wasurete, tomodachi ga okotte imasu.', vi: 'Tôi quên hẹn nên bạn đang giận.' },
        { text: '{遅|おく}れたことを{店長|てんちょう}に{謝|あやま}りました。', ro: 'Okureta koto o tenchou ni ayamarimashita.', vi: 'Tôi đã xin lỗi quản lý về việc đến muộn.' },
        { text: '{手伝|てつだ}ってくれた{人|ひと}に{感謝|かんしゃ}しています。', ro: 'Tetsudatte kureta hito ni kansha shite imasu.', vi: 'Tôi biết ơn những người đã giúp mình.' },
        { text: '{壊|こわ}れた{自転車|じてんしゃ}を{直|なお}してもらいました。', ro: 'Kowareta jitensha o naoshite moraimashita.', vi: 'Tôi đã nhờ sửa chiếc xe đạp bị hỏng.' },
        { text: '{財布|さいふ}を{落|お}としたので、{警察|けいさつ}に{行|い}きました。', ro: 'Saifu o otoshita node, keisatsu ni ikimashita.', vi: 'Đánh rơi ví nên tôi đã đến chỗ cảnh sát.' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b19-doc-doan',
      title: 'Đọc đoạn ngắn kiểu đề — 3 đoạn không furigana',
      note: 'Đọc to cả đoạn trong 40 giây như phần Reading của thi nói, rồi mới mở đáp án.',
      items: [
        { text: '{今朝|けさ}、{目|め}が{覚|さ}めたら、もう{八時|はちじ}でした。{急|いそ}いで{家|いえ}を{出|で}ましたが、{電車|でんしゃ}を{間違|まちが}えてしまいました。{授業|じゅぎょう}に{三十分|さんじゅっぷん}{遅刻|ちこく}して、{先生|せんせい}に{謝|あやま}りました。{次|つぎ}からは{目覚|めざ}まし{時計|どけい}を{二|ふた}つかけようと{思|おも}います。', ro: 'Kesa, me ga sametara, mou hachiji deshita. Isoide ie o demashita ga, densha o machigaete shimaimashita. Jugyou ni sanjuppun chikoku shite, sensei ni ayamarimashita. Tsugi kara wa mezamashi-dokei o futatsu kakeyou to omoimasu.', vi: 'Sáng nay tỉnh dậy thì đã 8 giờ. Tôi vội ra khỏi nhà nhưng lại lên nhầm tàu. Tôi đến lớp muộn 30 phút và đã xin lỗi thầy. Từ lần sau tôi định đặt hai cái đồng hồ báo thức.' },
        { text: '{昨日|きのう}、{駅|えき}で{財布|さいふ}を{落|お}として、とても{困|こま}りました。{警察|けいさつ}に{行|い}って、{財布|さいふ}の{色|いろ}や{中|なか}の{物|もの}を{説明|せつめい}しました。{夜|よる}、{財布|さいふ}が{見|み}つかったと{電話|でんわ}がありました。{拾|ひろ}ってくれた{人|ひと}に{感謝|かんしゃ}しています。', ro: 'Kinou, eki de saifu o otoshite, totemo komarimashita. Keisatsu ni itte, saifu no iro ya naka no mono o setsumei shimashita. Yoru, saifu ga mitsukatta to denwa ga arimashita. Hirotte kureta hito ni kansha shite imasu.', vi: 'Hôm qua tôi đánh rơi ví ở nhà ga, khổ sở vô cùng. Tôi đến chỗ cảnh sát, mô tả màu ví và đồ bên trong. Buổi tối có điện thoại báo đã tìm thấy ví. Tôi rất biết ơn người đã nhặt giúp.' },
        { text: '{弟|おとうと}は{私|わたし}のゲームを{借|か}りて、{壊|こわ}してしまいました。{私|わたし}はとても{怒|おこ}りましたが、{弟|おとうと}が{泣|な}きながら{正直|しょうじき}に{謝|あやま}ったので、{許|ゆる}しました。{今|いま}は{二人|ふたり}で{直|なお}し{方|かた}を{調|しら}べているところです。', ro: 'Otouto wa watashi no geemu o karite, kowashite shimaimashita. Watashi wa totemo okorimashita ga, otouto ga nakinagara shoujiki ni ayamatta node, yurushimashita. Ima wa futari de naoshikata o shirabete iru tokoro desu.', vi: 'Em trai mượn máy chơi game của tôi rồi làm hỏng mất. Tôi rất giận, nhưng em vừa khóc vừa thành thật xin lỗi nên tôi đã tha thứ. Bây giờ hai anh em đang cùng tra cách sửa.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b19-han-doc',
      title: '漢字読み — chọn cách đọc của từ in đậm (12 câu)',
      items: [
        { q: '{料理|りょうり}に**失敗**して、{全部|ぜんぶ}{焦|こ}げてしまいました。', options: ['しつはい', 'しっぱい', 'しつぱい', 'しっはい'], correct: 1, why: '**{失敗|しっぱい}** (shippai) — シツ + ハイ → しっぱい.' },
        { q: '{会議|かいぎ}の{前|まえ}に、**目次**を{読|よ}んでおきます。', options: ['もくつぎ', 'めつぎ', 'もくじ', 'めじ'], correct: 2, why: '**{目次|もくじ}** (mokuji) — 次 trong từ ghép đọc ジ.' },
        { q: 'この{漢字|かんじ}は**違**います。', options: ['ちが', 'まちが', 'い', 'ちか'], correct: 0, why: '**{違|ちが}います** (chigaimasu).' },
        { q: '{道|みち}がわからなくて、**困**りました。', options: ['こん', 'こま', 'くる', 'こわ'], correct: 1, why: '**{困|こま}りました** (komarimashita).' },
        { q: '{漢字|かんじ}を{毎日|まいにち}{十|じゅう}ずつ**覚**えています。', options: ['おぼ', 'さ', 'かく', 'おも'], correct: 0, why: '**{覚|おぼ}えています** (oboete imasu). {目|め}が{覚|さ}める thì đọc さ.' },
        { q: '{夜中|よなか}に{目|め}が**覚**めてしまいました。', options: ['おぼ', 'さ', 'かく', 'あ'], correct: 1, why: '**{目|め}が{覚|さ}める** (me ga sameru) — tỉnh giấc.' },
        { q: '{紙|かみ}が**破**れています。', options: ['わ', 'やぶ', 'は', 'こわ'], correct: 1, why: '**{破|やぶ}れて** (yaburete).' },
        { q: 'スキーで{足|あし}を**骨折**しました。', options: ['こつせつ', 'ほねおり', 'こっせつ', 'こっせっ'], correct: 2, why: '**{骨折|こっせつ}** (kossetsu) — コツ + セツ → こっせつ.' },
        { q: 'バスの**時刻**を{調|しら}べました。', options: ['じこく', 'じかん', 'ときこく', 'じごく'], correct: 0, why: '**{時刻|じこく}** (jikoku). ~~じごく~~ (地獄) là "địa ngục" — đừng đọc đục!' },
        { q: '{約束|やくそく}を{忘|わす}れたので、{彼女|かのじょ}が**怒**っています。', options: ['いか', 'おこ', 'ど', 'おそ'], correct: 1, why: '**{怒|おこ}っています** (okotte imasu). Văn nói đọc おこる; いかる là văn viết.' },
        { q: '{手伝|てつだ}ってくれた{皆|みな}さんに**感謝**しています。', options: ['かんしゃ', 'かんじゃ', 'かんさ', 'かんしゃく'], correct: 0, why: '**{感謝|かんしゃ}** (kansha) — 謝 đọc シャ.' },
        { q: '**正直**に{話|はな}してください。', options: ['せいちょく', 'しょうじき', 'しょうちょく', 'せいじき'], correct: 1, why: '**{正直|しょうじき}** (shoujiki) — 直 đọc ジキ trong từ này.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b19-han-chon',
      title: '表記 — chọn chữ Hán đúng cho từ viết bằng hiragana (8 câu)',
      items: [
        { q: '**しつれい**します。', options: ['夫礼', '失礼', '矢礼', '失例'], correct: 1, why: '**失礼** — 失 có nét phẩy nhô lên (khác 夫, 矢); 礼 (Bài 18).' },
        { q: '**つぎ**の{駅|えき}で{降|お}ります。', options: ['欠', '次', '吹', '冷'], correct: 1, why: '**次** = 冫 + 欠. 欠 thiếu 冫; 吹 (thổi) có 口.' },
        { q: '{電話|でんわ}{番号|ばんごう}を**まちがえ**ました。', options: ['間違え', '間偉え', '間韓え', '問違え'], correct: 0, why: '**間違え** — 違 có 辶. 問 (hỏi) khác 間.' },
        { q: '{雨|あめ}で、とても**こまり**ました。', options: ['因り', '困り', '固り', '囲り'], correct: 1, why: '**困る** — trong khung là 木. 因 (大), 固 (古), 囲 (井).' },
        { q: '{弟|おとうと}が**おこって**います。— 「おこ」は？', options: ['努', '怒', '恕', '奴'], correct: 1, why: '**怒** — dưới là 心. 努 (力 ở dưới) = cố gắng.' },
        { q: '{先生|せんせい}に**あやまり**ました。', options: ['射り', '謝り', '誤り', '話り'], correct: 1, why: '**謝る** = 言 + 射. 誤り (あやまり) là "sai lầm" — đồng âm, khác chữ.' },
        { q: '{時計|とけい}を**なおして**もらいました。', options: ['真して', '値して', '直して', '植して'], correct: 2, why: '**直す** (sửa đồ). 真 có 八 ở dưới; 値 (giá), 植 (trồng) có thêm bộ bên trái.' },
        { q: '**けいさつ**に{電話|でんわ}しました。', options: ['驚察', '警祭', '警察', '敬察'], correct: 2, why: '**警察** — 警 dưới là 言 (驚 là 馬); 察 có 宀 (祭 không có).' },
      ],
    },
    {
      t: 'write',
      id: 'b19-viet-kanji',
      title: 'Tập viết — 6 chữ ✍ và 8 từ',
      note: 'Viết 6 chữ ✍ trước (đúng thứ tự nét theo hoạt hình), rồi viết cả từ. 👁 chỉ cần đọc được — viết thêm nếu còn thời gian.',
      chars: ['失', '次', '困', '折', '悲', '直', '失敗', '間違い', '困る', '覚える', '遅刻', '謝る', '正直', '警察'],
      goi: {
        '失敗': 'しっぱい · thất bại',
        '間違い': 'まちがい · chỗ sai',
        '困る': 'こまる · khó xử, gặp rắc rối',
        '覚える': 'おぼえる · nhớ',
        '遅刻': 'ちこく · đến muộn',
        '謝る': 'あやまる · xin lỗi',
        '正直': 'しょうじき · thật thà',
        '警察': 'けいさつ · cảnh sát',
      },
    },
  ],
};

/* ═══════════════════════════ 5. NGHE ═══════════════════════════ */

type LL = [who: string, voice: 'ja-nu' | 'ja-nam', text: string, ro: string, vi: string];
const NG = (id: string, title: string, note: string, lines: LL[]): Block => ({
  t: 'listen',
  id,
  title,
  note,
  lines: lines.map(([who, voice, text, ro, vi]) => ({ who, voice, text, ro, vi })),
});

const NGHE: Lesson = {
  id: 'b19-nghe',
  kind: 'listening',
  title: 'Nghe hiểu N4 — 6 bài theo đủ 4 dạng đề: 課題理解 · ポイント理解 · 発話表現 · 即時応答',
  goal: 'Nghe sự cố ở cửa hàng tiện lợi và cuộc gọi tới trung tâm đồ thất lạc để biết việc phải làm TRƯỚC; nghe chuyện thi hùng biện thất bại và một cuộc gọi lúc đang tìm chìa khoá để bắt đúng lý do và đúng thời điểm (～ところ); chọn câu xin lỗi / xin thử / an ủi đúng tình huống và đáp nhanh câu có ～てしまう, ～てみる, ～ところ, ～のに — đúng 4 dạng của phần 聴解 đề N4.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Phần nghe (聴解) đề JLPT N4 — 4 dạng, 35 phút',
      head: ['Mondai', 'Dạng', 'Làm gì', 'Mẹo của bài này'],
      rows: [
        ['問題1', '課題理解 (hiểu nhiệm vụ)', 'Nghe hội thoại, chọn việc người đó phải làm **trước / tiếp theo**.', 'Việc người KHÁC nhận làm (**{私|わたし}が～ておいたから**, **{私|わたし}が～するね**) → loại; câu chốt thường sau **それより／まず** hoặc là câu cuối **じゃ、～てみます**.'],
        ['問題2', 'ポイント理解 (hiểu điểm chính)', 'Câu hỏi nghe **trước**, rồi tìm đúng điểm đó (lý do, thời điểm).', 'Lý do bị phủ định (**～はしませんでした**, **～のに**) là bẫy. Hỏi "lúc đó đang làm gì" → nghe **～ているところ／～るところだった／～たところ**.'],
        ['問題3', '発話表現 (nói gì trong tình huống)', 'Nghe mô tả tình huống, chọn câu nên nói.', 'Báo lỗi → **～てしまって、すみません／{申|もう}し{訳|わけ}ありません**; xin thử → **～てみてもいいですか**; an ủi → **{気|き}にしないで**.'],
        ['問題4', '即時応答 (đáp ngay)', 'Nghe một câu ngắn, chọn câu đáp tự nhiên nhất.', '"もう～た？" → **ううん、{今|いま}から～るところ** / **うん、{今|いま}～たところ**; "せっかく～のに" → đồng cảm **{残念|ざんねん}だね**. Cẩn thận câu tự mâu thuẫn (うん + {今|いま}から).'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nghe trong bài này',
      items: [
        '**Dạng nói tắt** rất hay xuất hiện: {落|お}としちゃった = {落|お}としてしまった, {飲|の}んじゃった = {飲|の}んでしまった, {忘|わす}れちゃって = {忘|わす}れてしまって. Nghe "ちゃう／ちゃった／じゃった" → là ～てしまう.',
        '**Ba ところ** — nghe đuôi động từ ngay trước ところ: **る**ところ (sắp), **ている**ところ (đang), **た**ところ (vừa xong). Dạng quá khứ **～ところだった** = "lúc đó vừa định / lúc đó đang".',
        '**～のに** báo hiệu một kết quả **trái ý** sắp tới: nghe "～たのに……" thì chờ điều xấu phía sau (hoặc chính câu bỏ lửng đó là lý do buồn).',
        'Bấm nghe 2 lần: lần 1 không nhìn lời, chỉ trả lời câu hỏi; lần 2 bật lời thoại + romaji để soát từng câu.',
      ],
    },

    /* ── 1 ── */
    { t: 'h', text: 'Bài 1 — 問題1 課題理解: làm đổ cà phê ở cửa hàng tiện lợi' },
    NG('b19-ng-1', '{新|あたら}しいアルバイトの{人|ひと}はこのあとまず{何|なに}をしますか', 'Dạng 課題理解 — chị khoá trên nhận làm nhiều việc; chỉ chọn việc NGƯỜI MỚI phải làm trước tiên.', [
      ['ナレーター', 'ja-nu', 'コンビニで{女|おんな}の{人|ひと}{二人|ふたり}が{話|はな}しています。{新|あたら}しいアルバイトの{人|ひと}はこのあとまず{何|なに}をしますか。', 'Konbini de onna no hito futari ga hanashite imasu. Atarashii arubaito no hito wa kono ato mazu nani o shimasu ka.', 'Ở cửa hàng tiện lợi, hai người phụ nữ đang nói chuyện. Người làm thêm mới sau đây trước tiên sẽ làm gì?'],
      ['ワン', 'ja-nu', '{鈴木|すずき}さん、すみません。コーヒーマシンの{前|まえ}で、お{客|きゃく}さんのコーヒーをこぼしてしまいました。', 'Suzuki-san, sumimasen. Koohii mashin no mae de, okyaku-san no koohii o koboshite shimaimashita.', 'Chị Suzuki, em xin lỗi. Ở trước máy pha cà phê, em lỡ làm đổ cà phê của khách.'],
      ['{鈴木|すずき}', 'ja-nu', 'えっ、お{客|きゃく}さんは{大丈夫|だいじょうぶ}？やけどしなかった？', 'E, okyaku-san wa daijoubu? Yakedo shinakatta?', 'Hả, khách có sao không? Không bị bỏng chứ?'],
      ['ワン', 'ja-nu', 'はい、お{客|きゃく}さんにはかかりませんでした。でも、{床|ゆか}が{汚|よご}れてしまって……。', 'Hai, okyaku-san ni wa kakarimasen deshita. Demo, yuka ga yogorete shimatte…….', 'Dạ, không đổ vào khách ạ. Nhưng sàn bẩn hết rồi…'],
      ['{鈴木|すずき}', 'ja-nu', 'そう、よかった。お{客|きゃく}さんには、{私|わたし}がもう{謝|あやま}っておいたから{大丈夫|だいじょうぶ}。{新|あたら}しいコーヒーも{私|わたし}が{作|つく}るね。', 'Sou, yokatta. Okyaku-san ni wa, watashi ga mou ayamatte oita kara daijoubu. Atarashii koohii mo watashi ga tsukuru ne.', 'Vậy à, may quá. Khách thì chị đã xin lỗi rồi nên không sao. Cốc cà phê mới chị cũng làm cho.'],
      ['ワン', 'ja-nu', 'すみません。じゃ、{私|わたし}は{店長|てんちょう}に{連絡|れんらく}しましょうか。', 'Sumimasen. Ja, watashi wa tenchou ni renraku shimashou ka.', 'Em xin lỗi. Vậy em báo cho quản lý nhé?'],
      ['{鈴木|すずき}', 'ja-nu', '{店長|てんちょう}には{後|あと}で{私|わたし}から{話|はな}しておくから、いいよ。それより、{床|ゆか}が{濡|ぬ}れていると{滑|すべ}って{危|あぶ}ないから、まず{床|ゆか}を{拭|ふ}いてくれる？', 'Tenchou ni wa ato de watashi kara hanashite oku kara, ii yo. Sore yori, yuka ga nurete iru to subette abunai kara, mazu yuka o fuite kureru?', 'Quản lý thì lát nữa chị nói cho, không cần đâu. Quan trọng hơn là sàn ướt thì trơn nguy hiểm, em lau sàn trước đi nhé?'],
      ['ワン', 'ja-nu', 'はい、すぐ{拭|ふ}きます。モップはどこですか。', 'Hai, sugu fukimasu. Moppu wa doko desu ka.', 'Vâng, em lau ngay. Cây lau nhà ở đâu ạ?'],
      ['{鈴木|すずき}', 'ja-nu', '{倉庫|そうこ}に{入|はい}っているよ。{終|お}わったら、レジに{戻|もど}ってね。', 'Souko ni haitte iru yo. Owattara, reji ni modotte ne.', 'Trong kho ấy. Lau xong thì quay lại quầy thu ngân nhé.'],
      ['ナレーター', 'ja-nu', '{新|あたら}しいアルバイトの{人|ひと}はこのあとまず{何|なに}をしますか。', 'Atarashii arubaito no hito wa kono ato mazu nani o shimasu ka.', 'Người làm thêm mới sau đây trước tiên sẽ làm gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b19-ng-1-q',
      title: 'Bài 1 — chọn đáp án',
      items: [
        { q: '{新|あたら}しいアルバイトの{人|ひと}はこのあとまず{何|なに}をしますか。', options: ['お{客|きゃく}さんに{謝|あやま}る', '{新|あたら}しいコーヒーを{作|つく}る', '{店長|てんちょう}に{連絡|れんらく}する', '{床|ゆか}を{拭|ふ}く'], correct: 3, why: 'Xin lỗi khách → chị Suzuki **もう{謝|あやま}っておいた** (bẫy ①); cà phê mới → **{私|わたし}が{作|つく}るね** (bẫy ②); quản lý → **{私|わたし}から{話|はな}しておく** (bẫy ③). Câu chốt: **それより、…まず{床|ゆか}を{拭|ふ}いてくれる？** 〔Mazu yuka o fuite kureru?〕' },
        { q: '{店長|てんちょう}には{誰|だれ}が{話|はな}しますか。', options: ['{新|あたら}しいアルバイトの{人|ひと}', '{鈴木|すずき}さん', 'お{客|きゃく}さん', '{誰|だれ}も{話|はな}さない'], correct: 1, why: '**{店長|てんちょう}には{後|あと}で{私|わたし}から{話|はな}しておく** — người nói là 鈴木. 〔Tenchou ni wa ato de watashi kara hanashite oku.〕' },
      ],
    },

    /* ── 2 ── */
    { t: 'h', text: 'Bài 2 — 問題1 課題理解: gọi điện tới trung tâm đồ thất lạc' },
    NG('b19-ng-2', '{男|おとこ}の{人|ひと}はこのあとまずどうしますか', 'Dạng 課題理解 — có hai nơi nhận đồ, hai ngày khác nhau; nghe điều kiện của người đàn ông rồi chờ câu "じゃ、～てみます".', [
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}が{駅|えき}の{忘|わす}れ{物|もの}センターに{電話|でんわ}しています。{男|おとこ}の{人|ひと}はこのあとまずどうしますか。', 'Otoko no hito ga eki no wasuremono sentaa ni denwa shite imasu. Otoko no hito wa kono ato mazu dou shimasu ka.', 'Một người đàn ông đang gọi điện tới trung tâm đồ thất lạc của nhà ga. Sau đây người đàn ông trước tiên sẽ làm gì?'],
      ['センターの{人|ひと}', 'ja-nu', 'はい、さくら{線|せん}{忘|わす}れ{物|もの}センターです。', 'Hai, Sakura-sen wasuremono sentaa desu.', 'Vâng, trung tâm đồ thất lạc tuyến Sakura xin nghe.'],
      ['カルロス', 'ja-nam', 'もしもし、{今朝|けさ}、{電車|でんしゃ}の{中|なか}に{黒|くろ}いかばんを{忘|わす}れてしまったんですが……。', 'Moshimoshi, kesa, densha no naka ni kuroi kaban o wasurete shimatta n desu ga…….', 'A lô, sáng nay tôi lỡ để quên một chiếc cặp đen trên tàu…'],
      ['センターの{人|ひと}', 'ja-nu', '{何時|なんじ}ごろの{電車|でんしゃ}ですか。', 'Nanji goro no densha desu ka.', 'Chuyến tàu khoảng mấy giờ ạ?'],
      ['カルロス', 'ja-nam', '{8時半|はちじはん}ごろ、みどり{駅|えき}から{乗|の}りました。{中|なか}にパソコンが{入|はい}っています。', 'Hachiji han goro, Midori-eki kara norimashita. Naka ni pasokon ga haitte imasu.', 'Tôi lên tàu ở ga Midori khoảng 8 rưỡi. Bên trong có máy tính.'],
      ['センターの{人|ひと}', 'ja-nu', '{少々|しょうしょう}お{待|ま}ちください。{今|いま}、{調|しら}べてみます。……ありました。{黒|くろ}いかばんで、{中|なか}にパソコンと{辞書|じしょ}が{入|はい}っていますね。', 'Shoushou omachi kudasai. Ima, shirabete mimasu. …… Arimashita. Kuroi kaban de, naka ni pasokon to jisho ga haitte imasu ne.', 'Xin chờ một chút. Tôi tra thử ngay. … Có rồi. Cặp đen, trong có máy tính và từ điển nhỉ.'],
      ['カルロス', 'ja-nam', 'それです！よかった……。{今日|きょう}、そちらに{取|と}りに{行|い}ってもいいですか。', 'Sore desu! Yokatta……. Kyou, sochira ni tori ni itte mo ii desu ka.', 'Đúng nó rồi! May quá… Hôm nay tôi đến chỗ chị lấy được không?'],
      ['センターの{人|ひと}', 'ja-nu', '{今|いま}はまだ{終点|しゅうてん}のひかり{駅|えき}にあります。{明日|あした}の{朝|あさ}こちらに{送|おく}りますので、{明日|あした}の{午後|ごご}なら、ここで{受|う}け{取|と}れます。', 'Ima wa mada shuuten no Hikari-eki ni arimasu. Ashita no asa kochira ni okurimasu node, ashita no gogo nara, koko de uketoremasu.', 'Hiện nó vẫn ở ga cuối Hikari. Sáng mai họ gửi về đây, nên chiều mai thì anh nhận ở đây được.'],
      ['カルロス', 'ja-nam', '{明日|あした}は{一日中|いちにちじゅう}{授業|じゅぎょう}があって、{来|こ}られないんです。{今日|きょう}は{無理|むり}ですか。', 'Ashita wa ichinichijuu jugyou ga atte, korarenai n desu. Kyou wa muri desu ka.', 'Mai tôi học cả ngày, không đến được. Hôm nay không được sao ạ?'],
      ['センターの{人|ひと}', 'ja-nu', 'ひかり{駅|えき}まで{行|い}けば、{今日|きょう}{受|う}け{取|と}れますよ。{夜|よる}{8時|はちじ}までです。', 'Hikari-eki made ikeba, kyou uketoremasu yo. Yoru hachiji made desu.', 'Nếu anh đi đến ga Hikari thì hôm nay nhận được. Đến 8 giờ tối.'],
      ['カルロス', 'ja-nam', 'じゃ、{今|いま}からひかり{駅|えき}へ{行|い}ってみます。', 'Ja, ima kara Hikari-eki e itte mimasu.', 'Vậy tôi đi đến ga Hikari ngay bây giờ.'],
      ['センターの{人|ひと}', 'ja-nu', '{受|う}け{取|と}るときは、{学生証|がくせいしょう}など、{名前|なまえ}がわかる{物|もの}を{持|も}っていってくださいね。', 'Uketoru toki wa, gakuseishou nado, namae ga wakaru mono o motte itte kudasai ne.', 'Khi nhận, nhớ mang theo thứ gì có tên anh, như thẻ sinh viên nhé.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}はこのあとまずどうしますか。', 'Otoko no hito wa kono ato mazu dou shimasu ka.', 'Sau đây người đàn ông trước tiên sẽ làm gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b19-ng-2-q',
      title: 'Bài 2 — chọn đáp án',
      items: [
        { q: '{男|おとこ}の{人|ひと}はこのあとまずどうしますか。', options: ['{明日|あした}の{午後|ごご}、{忘|わす}れ{物|もの}センターへ{行|い}く', 'ひかり{駅|えき}へ{行|い}く', 'みどり{駅|えき}へ{行|い}く', '{交番|こうばん}に{届|とど}けを{出|だ}す'], correct: 1, why: 'Chiều mai nhận ở trung tâm được, nhưng anh **{明日|あした}は…{来|こ}られない** (bẫy ①). Câu chốt: **じゃ、{今|いま}からひかり{駅|えき}へ{行|い}ってみます**. みどり{駅|えき} là ga anh lên tàu (bẫy ③). 〔Ima kara Hikari-eki e itte mimasu.〕' },
        { q: 'かばんを{受|う}け{取|と}るとき、{何|なに}を{持|も}っていかなければなりませんか。', options: ['パソコン', '{辞書|じしょ}', '{学生証|がくせいしょう}など{名前|なまえ}がわかる{物|もの}', '{電車|でんしゃ}の{切符|きっぷ}'], correct: 2, why: '**{学生証|がくせいしょう}など、{名前|なまえ}がわかる{物|もの}を{持|も}っていってください**. Máy tính, từ điển là đồ ở trong cặp. 〔Gakuseishou nado, namae ga wakaru mono o motte itte kudasai.〕' },
      ],
    },

    /* ── 3 ── */
    { t: 'h', text: 'Bài 3 — 問題2 ポイント理解: cuộc thi hùng biện không như ý' },
    NG('b19-ng-3', '{女|おんな}の{人|ひと}はどうして{元気|げんき}がないのですか', 'Dạng ポイント理解 — nghe câu hỏi trước. Người nói phủ định vài lý do (không phải không thuộc bài, không phải run); lý do thật nằm ở câu "～てしまったんです".', [
      ['ナレーター', 'ja-nu', '{大学|だいがく}で{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}が{話|はな}しています。{女|おんな}の{人|ひと}はどうして{元気|げんき}がないのですか。', 'Daigaku de otoko no hito to onna no hito ga hanashite imasu. Onna no hito wa doushite genki ga nai no desu ka.', 'Ở trường đại học, một người đàn ông và một người phụ nữ đang nói chuyện. Vì sao người phụ nữ trông không vui?'],
      ['{西川|にしかわ}', 'ja-nam', 'マリヤムさん、{元気|げんき}がないね。{昨日|きのう}のスピーチ{大会|たいかい}、どうだった？', 'Mariyamu-san, genki ga nai ne. Kinou no supiichi taikai, dou datta?', 'Mariyam, trông em buồn thế. Cuộc thi hùng biện hôm qua sao rồi?'],
      ['マリヤム', 'ja-nu', 'それが……。{原稿|げんこう}はちゃんと{覚|おぼ}えておいたのに、{途中|とちゅう}で{忘|わす}れてしまったんです。', 'Sore ga……. Genkou wa chanto oboete oita noni, tochuu de wasurete shimatta n desu.', 'Chuyện là… Em đã thuộc bài nói kỹ rồi vậy mà giữa chừng lại quên mất.'],
      ['{西川|にしかわ}', 'ja-nam', '{緊張|きんちょう}したの？', 'Kinchou shita no?', 'Em run à?'],
      ['マリヤム', 'ja-nu', 'いいえ、{緊張|きんちょう}はしませんでした。{前|まえ}の{人|ひと}の{話|はなし}がとても{面白|おもしろ}くて、{私|わたし}も{笑|わら}ってしまって……。そのあと、{次|つぎ}の{言葉|ことば}が{出|で}てこなくなってしまったんです。', 'Iie, kinchou wa shimasen deshita. Mae no hito no hanashi ga totemo omoshirokute, watashi mo waratte shimatte……. Sono ato, tsugi no kotoba ga dete konaku natte shimatta n desu.', 'Không, em không run. Bài của người trước buồn cười quá, em cũng lỡ cười… Sau đó thì câu tiếp theo không nghĩ ra được nữa.'],
      ['{西川|にしかわ}', 'ja-nam', 'そうか。でも、{最後|さいご}まで{話|はな}したんでしょう？', 'Sou ka. Demo, saigo made hanashita n deshou?', 'Ra vậy. Nhưng em vẫn nói đến cuối chứ?'],
      ['マリヤム', 'ja-nu', 'はい。でも、{賞|しょう}はもらえませんでした。せっかく{毎日|まいにち}{練習|れんしゅう}したのに……。', 'Hai. Demo, shou wa moraemasen deshita. Sekkaku mainichi renshuu shita noni…….', 'Vâng. Nhưng em không được giải. Mất công ngày nào cũng luyện vậy mà…'],
      ['{西川|にしかわ}', 'ja-nam', '{気|き}にしないで。{来年|らいねん}もう{一度|いちど}{出|で}てみたら？', 'Ki ni shinaide. Rainen mou ichido dete mitara?', 'Đừng bận tâm. Năm sau em thử tham gia lần nữa xem?'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}はどうして{元気|げんき}がないのですか。', 'Onna no hito wa doushite genki ga nai no desu ka.', 'Vì sao người phụ nữ trông không vui?'],
    ]),
    {
      t: 'mcq',
      id: 'b19-ng-3-q',
      title: 'Bài 3 — chọn đáp án',
      items: [
        { q: '{女|おんな}の{人|ひと}はどうして{元気|げんき}がないのですか。', options: ['{原稿|げんこう}を{覚|おぼ}えられなかったから', 'スピーチの{途中|とちゅう}で、{話|はな}すことを{忘|わす}れてしまったから', 'とても{緊張|きんちょう}してしまったから', '{毎日|まいにち}{練習|れんしゅう}しなかったから'], correct: 1, why: '**{原稿|げんこう}はちゃんと{覚|おぼ}えておいたのに、{途中|とちゅう}で{忘|わす}れてしまったんです** — đã thuộc (bẫy ①), **{緊張|きんちょう}はしませんでした** (bẫy ③), có luyện mỗi ngày (bẫy ④). 〔Tochuu de wasurete shimatta n desu.〕' },
        { q: '{女|おんな}の{人|ひと}が{途中|とちゅう}で{言葉|ことば}を{忘|わす}れたのは、どうしてですか。', options: ['{前|まえ}の{人|ひと}の{話|はなし}で{笑|わら}ってしまったから', '{会場|かいじょう}がうるさかったから', '{寝坊|ねぼう}して{急|いそ}いだから', '{原稿|げんこう}を{家|いえ}に{忘|わす}れたから'], correct: 0, why: '**{前|まえ}の{人|ひと}の{話|はなし}がとても{面白|おもしろ}くて、{私|わたし}も{笑|わら}ってしまって……そのあと** — lỡ cười rồi quên câu. 〔Watashi mo waratte shimatte…〕' },
      ],
    },

    /* ── 4 ── */
    { t: 'h', text: 'Bài 4 — 問題2 ポイント理解: gọi điện lúc bạn đang tìm chìa khoá' },
    NG('b19-ng-4', '{電話|でんわ}がかかってきたとき、{男|おとこ}の{人|ひと}は{何|なに}をしていましたか', 'Dạng ポイント理解 — có ba ところ trong bài (sắp ra / đang tìm / vừa tới). Câu hỏi về LÚC ĐIỆN THOẠI GỌI ĐẾN.', [
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}と{男|おとこ}の{人|ひと}が{電話|でんわ}で{話|はな}しています。{電話|でんわ}がかかってきたとき、{男|おとこ}の{人|ひと}は{何|なに}をしていましたか。', 'Onna no hito to otoko no hito ga denwa de hanashite imasu. Denwa ga kakatte kita toki, otoko no hito wa nani o shite imashita ka.', 'Một người phụ nữ và một người đàn ông đang nói chuyện điện thoại. Lúc điện thoại gọi đến, người đàn ông đang làm gì?'],
      ['ワン', 'ja-nu', 'もしもし、マルコさん？もう{家|いえ}を{出|で}た？{映画|えいが}、{10時|じゅうじ}からだよ。', 'Moshimoshi, Maruko-san? Mou ie o deta? Eiga, juuji kara da yo.', 'A lô, Marco à? Ra khỏi nhà chưa? Phim chiếu lúc 10 giờ đấy.'],
      ['マルコ', 'ja-nam', 'あ、ワンさん。ううん、まだなんだ。{本当|ほんとう}は{今|いま}{出|で}るところだったんだけど……。', 'A, Wan-san. Uun, mada na n da. Hontou wa ima deru tokoro datta n da kedo…….', 'À, Wan. Chưa, tớ chưa đi. Thật ra tớ vừa định ra thì…'],
      ['ワン', 'ja-nu', 'どうしたの？', 'Dou shita no?', 'Sao thế?'],
      ['マルコ', 'ja-nam', '{出|で}かけようと{思|おも}ったら、{鍵|かぎ}がなくて。{今|いま}、{部屋|へや}の{中|なか}を{探|さが}しているところ。', 'Dekakeyou to omottara, kagi ga nakute. Ima, heya no naka o sagashite iru tokoro.', 'Định đi thì không thấy chìa khoá. Tớ đang tìm khắp phòng đây.'],
      ['ワン', 'ja-nu', 'えー、またなくしたの？かばんの{中|なか}は？', 'Ee, mata nakushita no? Kaban no naka wa?', 'Hả, lại mất nữa à? Trong cặp thì sao?'],
      ['マルコ', 'ja-nam', 'さっき{見|み}てみたんだけど、なかった。……あ、ちょっと{待|ま}って。……あった！ズボンのポケットに{入|はい}ってた。', 'Sakki mite mita n da kedo, nakatta. …… A, chotto matte. …… Atta! Zubon no poketto ni haitteta.', 'Lúc nãy tớ xem thử rồi, không có. … À, chờ chút. … Thấy rồi! Nằm trong túi quần.'],
      ['ワン', 'ja-nu', 'よかった。じゃ、{急|いそ}いでね。{私|わたし}はちょうど{今|いま}、{駅|えき}に{着|つ}いたところだから、{駅|えき}で{待|ま}ってるね。', 'Yokatta. Ja, isoide ne. Watashi wa choudo ima, eki ni tsuita tokoro dakara, eki de matteru ne.', 'May quá. Vậy nhanh lên nhé. Tớ vừa tới ga, tớ đợi ở ga nhé.'],
      ['マルコ', 'ja-nam', 'ごめん！{15分|じゅうごふん}で{行|い}くよ。', 'Gomen! Juugofun de iku yo.', 'Xin lỗi! 15 phút nữa tớ tới.'],
      ['ナレーター', 'ja-nu', '{電話|でんわ}がかかってきたとき、{男|おとこ}の{人|ひと}は{何|なに}をしていましたか。', 'Denwa ga kakatte kita toki, otoko no hito wa nani o shite imashita ka.', 'Lúc điện thoại gọi đến, người đàn ông đang làm gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b19-ng-4-q',
      title: 'Bài 4 — chọn đáp án',
      items: [
        { q: '{電話|でんわ}がかかってきたとき、{男|おとこ}の{人|ひと}は{何|なに}をしていましたか。', options: ['{家|いえ}を{出|で}たところだった', '{部屋|へや}で{鍵|かぎ}を{探|さが}していた', '{駅|えき}に{着|つ}いたところだった', '{映画|えいが}を{見|み}ていた'], correct: 1, why: '**{今|いま}、{部屋|へや}の{中|なか}を{探|さが}しているところ** = đang tìm. "{出|で}るところだった" chỉ là định ra (chưa ra — bẫy ①); "{駅|えき}に{着|つ}いたところ" là của người phụ nữ (bẫy ③). 〔Ima, heya no naka o sagashite iru tokoro.〕' },
        { q: '{鍵|かぎ}はどこにありましたか。', options: ['かばんの{中|なか}', 'ズボンのポケット', '{駅|えき}', '{机|つくえ}の{上|うえ}'], correct: 1, why: '**ズボンのポケットに{入|はい}ってた** (= {入|はい}っていた). Cặp thì **{見|み}てみたんだけど、なかった**. 〔Zubon no poketto ni haitteta.〕' },
      ],
    },

    /* ── 5 ── */
    { t: 'h', text: 'Bài 5 — 問題3 発話表現: nói gì trong tình huống (4 câu)' },
    {
      t: 'p',
      text: 'Đề thật có tranh và mũi tên chỉ người nói. Ở đây tình huống được đọc thành lời. Nghe tình huống + 3 câu nói, chọn câu đúng nhất — để ý **mẫu nào hợp tình huống** (lỡ làm → ～てしまう, xin thử → ～てみる) và **người nghe là ai**.',
    },
    NG('b19-ng-5', '{何|なん}と{言|い}いますか（4{問|もん}）', 'Dạng 発話表現 — chọn đúng mẫu và đúng mức lịch sự.', [
      ['ナレーター', 'ja-nu', '{1番|いちばん}。アルバイトに{遅|おく}れて{着|つ}きました。{店長|てんちょう}に{何|なん}と{言|い}いますか。', 'Ichiban. Arubaito ni okurete tsukimashita. Tenchou ni nan to iimasu ka.', 'Câu 1. Bạn đến chỗ làm thêm muộn. Bạn nói gì với quản lý?'],
      ['ナタポン', 'ja-nam', '1、{遅|おく}れてしまって、{申|もう}し{訳|わけ}ありません。 2、{遅|おく}れてみて、すみません。 3、{今|いま}、{遅|おく}れたところです。', 'Ichi, okurete shimatte, moushiwake arimasen. Ni, okurete mite, sumimasen. San, ima, okureta tokoro desu.', '1. Em xin lỗi vì đã đến muộn. 2. Xin lỗi vì đã thử đến muộn. 3. Em vừa mới đến muộn.'],
      ['ナレーター', 'ja-nu', '{2番|にばん}。{店|みせ}で{気|き}に{入|い}ったシャツがあります。{着|き}たいです。{店|みせ}の{人|ひと}に{何|なん}と{言|い}いますか。', 'Niban. Mise de ki ni itta shatsu ga arimasu. Kitai desu. Mise no hito ni nan to iimasu ka.', 'Câu 2. Ở cửa hàng có chiếc áo bạn thích. Bạn muốn mặc thử. Bạn nói gì với nhân viên?'],
      ['アンナ', 'ja-nu', '1、これ、{着|き}てしまってもいいですか。 2、これ、{着|き}てみてもいいですか。 3、これ、{着|き}ているところです。', 'Ichi, kore, kite shimatte mo ii desu ka. Ni, kore, kite mite mo ii desu ka. San, kore, kite iru tokoro desu.', '1. Tôi mặc luôn cái này được không? 2. Tôi mặc thử cái này được không? 3. Tôi đang mặc cái này.'],
      ['ナレーター', 'ja-nu', '{3番|さんばん}。{友達|ともだち}に{借|か}りた{本|ほん}を{汚|よご}してしまいました。{何|なん}と{言|い}いますか。', 'Sanban. Tomodachi ni karita hon o yogoshite shimaimashita. Nan to iimasu ka.', 'Câu 3. Bạn lỡ làm bẩn quyển sách mượn của bạn. Bạn nói gì?'],
      ['リン', 'ja-nu', '1、{本|ほん}を{汚|よご}してみて、ごめんね。 2、{本|ほん}を{汚|よご}したのに、ごめんね。 3、{本|ほん}を{汚|よご}しちゃって、ごめんね。', 'Ichi, hon o yogoshite mite, gomen ne. Ni, hon o yogoshita noni, gomen ne. San, hon o yogoshichatte, gomen ne.', '1. Xin lỗi vì đã thử làm bẩn sách. 2. Đã làm bẩn sách vậy mà xin lỗi nhé. 3. Xin lỗi, mình lỡ làm bẩn sách của cậu.'],
      ['ナレーター', 'ja-nu', '{4番|よんばん}。{友達|ともだち}が{試験|しけん}に{落|お}ちて、{元気|げんき}がありません。{何|なん}と{言|い}いますか。', 'Yonban. Tomodachi ga shiken ni ochite, genki ga arimasen. Nan to iimasu ka.', 'Câu 4. Bạn của bạn thi trượt, đang buồn. Bạn nói gì?'],
      ['ダニエル', 'ja-nam', '1、{気|き}にしないで。{次|つぎ}、がんばろう。 2、{気|き}にしちゃった？ 3、{気|き}にしてみたら？', 'Ichi, ki ni shinaide. Tsugi, ganbarou. Ni, ki ni shichatta? San, ki ni shite mitara?', '1. Đừng bận tâm. Lần sau cố lên nhé. 2. Lỡ bận tâm rồi à? 3. Thử bận tâm xem?'],
    ]),
    {
      t: 'mcq',
      id: 'b19-ng-5-q',
      title: 'Bài 5 — chọn câu nói đúng',
      items: [
        { q: '{1番|いちばん} — アルバイトに{遅|おく}れて、{店長|てんちょう}に{謝|あやま}る。', options: ['1', '2', '3'], correct: 0, why: 'Việc lỡ xảy ra + xin lỗi người trên → **{遅|おく}れてしまって、{申|もう}し{訳|わけ}ありません**. 〔Okurete shimatte, moushiwake arimasen.〕' },
        { q: '{2番|にばん} — {店|みせ}でシャツを{着|き}てみたい。', options: ['1', '2', '3'], correct: 1, why: 'Xin mặc THỬ → **{着|き}てみてもいいですか**. {着|き}てしまってもいい = "mặc luôn cho xong" — không hợp. 〔Kite mite mo ii desu ka.〕' },
        { q: '{3番|さんばん} — {借|か}りた{本|ほん}を{汚|よご}して、{友達|ともだち}に{謝|あやま}る。', options: ['1', '2', '3'], correct: 2, why: 'Với bạn: **{汚|よご}しちゃって、ごめんね** (= {汚|よご}してしまって). のに + ごめん vô nghĩa. 〔Yogoshichatte, gomen ne.〕' },
        { q: '{4番|よんばん} — {試験|しけん}に{落|お}ちた{友達|ともだち}をなぐさめる。', options: ['1', '2', '3'], correct: 0, why: 'An ủi: **{気|き}にしないで。{次|つぎ}、がんばろう**. 〔Ki ni shinaide. Tsugi, ganbarou.〕' },
      ],
    },

    /* ── 6 ── */
    { t: 'h', text: 'Bài 6 — 問題4 即時応答: đáp ngay (5 câu)' },
    NG('b19-ng-6', '{正|ただ}しい{返事|へんじ}を{選|えら}んでください（5{問|もん}）', 'Dạng 即時応答 — không có câu hỏi in sẵn: nghe 1 câu, chọn 1 trong 3 câu đáp. Cẩn thận câu đáp tự mâu thuẫn.', [
      ['ナレーター', 'ja-nu', '{1番|いちばん}。', 'Ichiban.', 'Câu 1.'],
      ['{本田先生|ほんだせんせい}', 'ja-nam', 'あれ、パクさん、{宿題|しゅくだい}は？', 'Are, Paku-san, shukudai wa?', 'Ơ, Park, bài tập đâu?'],
      ['パク', 'ja-nu', '1、すみません、うっかり{家|いえ}に{忘|わす}れてしまいました。 2、はい、{宿題|しゅくだい}を{忘|わす}れてみました。 3、いいえ、{宿題|しゅくだい}がありました。', 'Ichi, sumimasen, ukkari ie ni wasurete shimaimashita. Ni, hai, shukudai o wasurete mimashita. San, iie, shukudai ga arimashita.', '1. Em xin lỗi, em sơ ý để quên ở nhà mất rồi. 2. Vâng, em đã thử quên bài tập. 3. Không, đã có bài tập.'],
      ['ナレーター', 'ja-nu', '{2番|にばん}。', 'Niban.', 'Câu 2.'],
      ['ダニエル', 'ja-nam', 'もう{晩|ばん}ご{飯|はん}、{食|た}べた？', 'Mou bangohan, tabeta?', 'Ăn tối chưa?'],
      ['パク', 'ja-nu', '1、うん、{今|いま}から{食|た}べるところ。 2、ううん、これから{食|た}べるところ。 3、ううん、{食|た}べてしまった。', 'Ichi, un, ima kara taberu tokoro. Ni, uun, korekara taberu tokoro. San, uun, tabete shimatta.', '1. Ừ, mình sắp ăn đây. 2. Chưa, mình sắp ăn đây. 3. Chưa, mình ăn hết rồi.'],
      ['ナレーター', 'ja-nu', '{3番|さんばん}。', 'Sanban.', 'Câu 3.'],
      ['ワン', 'ja-nu', 'このケーキ、{私|わたし}が{作|つく}ったの。ちょっと{食|た}べてみて。', 'Kono keeki, watashi ga tsukutta no. Chotto tabete mite.', 'Cái bánh này mình làm đấy. Ăn thử chút đi.'],
      ['マルコ', 'ja-nam', '1、じゃ、{作|つく}ってみるね。 2、わあ、いただきます。 3、もう{食|た}べてしまうところ。', 'Ichi, ja, tsukutte miru ne. Ni, waa, itadakimasu. San, mou tabete shimau tokoro.', '1. Vậy mình làm thử nhé. 2. Oa, mình xin nhé. 3. Sắp ăn hết rồi.'],
      ['ナレーター', 'ja-nu', '{4番|よんばん}。', 'Yonban.', 'Câu 4.'],
      ['アンナ', 'ja-nu', 'せっかく{来|き}たのに、お{店|みせ}、{休|やす}みだね。', 'Sekkaku kita noni, omise, yasumi da ne.', 'Mất công đến vậy mà quán lại nghỉ nhỉ.'],
      ['ナタポン', 'ja-nam', '1、{本当|ほんとう}だ。{残念|ざんねん}だね。 2、よかったね、{休|やす}みで。 3、じゃ、{来|き}てみよう。', 'Ichi, hontou da. Zannen da ne. Ni, yokatta ne, yasumi de. San, ja, kite miyou.', '1. Đúng thật. Tiếc nhỉ. 2. May quá nhỉ, nghỉ rồi. 3. Vậy thử đến xem.'],
      ['ナレーター', 'ja-nu', '{5番|ごばん}。', 'Goban.', 'Câu 5.'],
      ['メアリー', 'ja-nu', '{財布|さいふ}、{見|み}つかった？', 'Saifu, mitsukatta?', 'Ví tìm thấy chưa?'],
      ['カルロス', 'ja-nam', '1、うん、{交番|こうばん}に{届|とど}いていたよ。ほっとした。 2、うん、{今|いま}から{落|お}とすところ。 3、ううん、{見|み}つけてしまった。', 'Ichi, un, kouban ni todoite ita yo. Hotto shita. Ni, un, ima kara otosu tokoro. San, uun, mitsukete shimatta.', '1. Rồi, có người mang đến đồn. Nhẹ cả người. 2. Ừ, mình sắp đánh rơi đây. 3. Chưa, lỡ tìm thấy mất rồi.'],
    ]),
    {
      t: 'mcq',
      id: 'b19-ng-6-q',
      title: 'Bài 6 — chọn câu đáp đúng',
      items: [
        { q: '{1番|いちばん} — 「あれ、{宿題|しゅくだい}は？」', options: ['1', '2', '3'], correct: 0, why: 'Thầy hỏi bài tập đâu → nhận lỗi: **うっかり{家|いえ}に{忘|わす}れてしまいました**. "Thử quên" vô lý. 〔Ukkari ie ni wasurete shimaimashita.〕' },
        { q: '{2番|にばん} — 「もう{晩|ばん}ご{飯|はん}、{食|た}べた？」', options: ['1', '2', '3'], correct: 1, why: 'Chưa ăn → **ううん、これから{食|た}べるところ**. Câu 1 tự mâu thuẫn (うん = rồi + {今|いま}から = chưa); câu 3 (ううん + ăn hết rồi) cũng mâu thuẫn. 〔Uun, korekara taberu tokoro.〕' },
        { q: '{3番|さんばん} — 「ちょっと{食|た}べてみて。」', options: ['1', '2', '3'], correct: 1, why: 'Được mời ăn thử → **わあ、いただきます**. 〔Waa, itadakimasu.〕' },
        { q: '{4番|よんばん} — 「せっかく{来|き}たのに、お{店|みせ}、{休|やす}みだね。」', options: ['1', '2', '3'], correct: 0, why: 'Người nói tiếc (せっかく～のに) → đồng cảm: **{本当|ほんとう}だ。{残念|ざんねん}だね**. 〔Hontou da. Zannen da ne.〕' },
        { q: '{5番|ごばん} — 「{財布|さいふ}、{見|み}つかった？」', options: ['1', '2', '3'], correct: 0, why: '**うん、{交番|こうばん}に{届|とど}いていたよ。ほっとした** — tìm thấy + nhẹ nhõm. 〔Un, kouban ni todoite ita yo. Hotto shita.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 6. ĐỌC HIỂU ═══════════════════════════ */

const DOC: Lesson = {
  id: 'b19-doc',
  kind: 'reading',
  title: 'Đọc hiểu N4 — tin nhắn xin lỗi của bạn, bài viết "Thất bại tiếng Nhật của tôi", lớp học nấu ăn thử (情報検索)',
  goal: 'Đọc tin nhắn ~200 chữ để biết người viết xin lỗi vì việc gì và sẽ làm gì tiếp; đọc bài viết ~450 chữ kể hai lần nói sai tiếng Nhật để nắm chi tiết, điểm chung và ý chính; tra bảng lớp học nấu ăn thử để chọn đúng lớp và tính đúng tiền theo điều kiện cho sẵn (kể cả dòng ※).',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Phần đọc (読解) đề JLPT N4',
      head: ['Mondai', 'Dạng', 'Độ dài', 'Bài này luyện'],
      rows: [
        ['問題4', '内容理解（短文）', '~100–200 chữ: email, tin nhắn, thông báo', 'Bài 1 — tin nhắn xin lỗi của パク'],
        ['問題5', '内容理解（中文）', '~350–450 chữ: bài viết, nhật ký', 'Bài 2 — 「{日本語|にほんご}の{失敗|しっぱい}」 của ダニエル'],
        ['問題6', '情報検索', '~400 chữ: bảng, tờ quảng cáo, lịch', 'Bài 3 — bảng lớp học nấu ăn thử ({体験|たいけん}レッスン)'],
      ],
    },
    {
      t: 'note',
      title: 'Chiến thuật đọc',
      items: [
        '**Đọc câu hỏi trước**, gạch chân từ khoá (どうして・{何|なに}を{謝|あやま}って・いくら・どのコース), rồi mới đọc bài để tìm.',
        'Tin nhắn xin lỗi: việc gây lỗi nằm sau **～てしまって／～てしまいました**; việc người viết **sẽ làm** nằm ở **～ます／～ところです／～てみる** gần cuối; lời mời ở **よかったら～てください**.',
        'Bài viết kể chuyện: **～たかったのに／～つもりだったのに、～てしまいました** = điều muốn làm ↔ điều đã lỡ làm (chỗ đề hay hỏi). Ý chính của người viết thường ở **đoạn cuối** (～とわかりました, ～と{思|おも}っています).',
        '情報検索: lập **bảng điều kiện** của người trong câu hỏi (ngày giờ rảnh, muốn làm gì, có giảm giá không) rồi **loại** từng lựa chọn. Luôn đọc dòng **※** cuối bảng.',
      ],
    },

    /* ── Bài 1 ── */
    { t: 'h', text: 'Bài 1 — 内容理解（短文）: tin nhắn xin lỗi của パク' },
    {
      t: 'passage',
      title: 'ワンさんへ（パクさんのメッセージ）',
      intro: 'Sáng hôm sau bữa tiệc ở hội thoại ②, ワン nhận được tin nhắn này. Đọc rồi trả lời câu hỏi.',
      paras: [
        { text: 'ワンさんへ' },
        { text: '{昨日|きのう}はパーティーに{来|き}てくれて、ありがとう。せっかく{手伝|てつだ}ってくれたのに、{一枚目|いちまいめ}のお{好|この}み{焼|や}きを{焦|こ}がしてしまって、ごめんね。' },
        { text: 'それから、ワンさんに{借|か}りた{料理|りょうり}の{本|ほん}ですが、うっかりソースをこぼして、{汚|よご}してしまいました。{本当|ほんとう}にごめんなさい。{同|おな}じ{本|ほん}を{駅前|えきまえ}の{本屋|ほんや}で{探|さが}してみたけど、{売|う}っていませんでした。さっきインターネットで{注文|ちゅうもん}したところです。{届|とど}いたら、すぐ{新|あたら}しいのを{返|かえ}しますね。' },
        { text: '{来週|らいしゅう}の{土曜日|どようび}、もう{一度|いちど}お{好|この}み{焼|や}きを{作|つく}ってみます。{今度|こんど}は{弱|よわ}い{火|ひ}で{焼|や}いてみるつもり。よかったら、また{来|き}てください。' },
        { text: 'パク' },
      ],
    },
    {
      t: 'mcq',
      id: 'b19-doc-1',
      title: 'Bài 1 — câu hỏi',
      items: [
        { q: 'パクさんはワンさんに{何|なに}を{謝|あやま}っていますか。', options: ['パーティーに{呼|よ}ばなかったこと', 'お{好|この}み{焼|や}きを{焦|こ}がしたことと、{借|か}りた{本|ほん}を{汚|よご}したこと', '{本|ほん}をなくしてしまったこと', '{来週|らいしゅう}のパーティーに{行|い}けないこと'], correct: 1, why: 'Hai câu **～てしまって、ごめんね** / **～てしまいました。{本当|ほんとう}にごめんなさい**: {焦|こ}がしてしまって + {汚|よご}してしまいました. Sách bị bẩn chứ không mất (bẫy ③). 〔Kogashite shimatte, gomen ne. / Yogoshite shimaimashita.〕' },
        { q: '{本|ほん}について、{正|ただ}しいのはどれですか。', options: ['{駅前|えきまえ}の{本屋|ほんや}で{新|あたら}しい{本|ほん}を{買|か}った。', '{新|あたら}しい{本|ほん}はもう{届|とど}いた。', 'インターネットで{新|あたら}しい{本|ほん}を{注文|ちゅうもん}した。', '{汚|よご}れた{本|ほん}をきれいにして{返|かえ}す。'], correct: 2, why: 'Hiệu sách **{売|う}っていませんでした** (bẫy ①); **さっき…{注文|ちゅうもん}したところです** — vừa đặt, chưa đến (bẫy ②). 〔Sakki intaanetto de chuumon shita tokoro desu.〕' },
        { q: 'パクさんは{来週|らいしゅう}{何|なに}をしますか。', options: ['ワンさんの{家|いえ}でお{好|この}み{焼|や}きを{作|つく}る', 'もう{一度|いちど}お{好|この}み{焼|や}きを{作|つく}ってみる', '{料理|りょうり}の{本|ほん}を{買|か}いに{行|い}く', 'ワンさんにお{好|この}み{焼|や}きの{作|つく}り{方|かた}を{教|おし}えてもらう'], correct: 1, why: '**{来週|らいしゅう}の{土曜日|どようび}、もう{一度|いちど}お{好|この}み{焼|や}きを{作|つく}ってみます** — và mời ワン đến. 〔Mou ichido okonomiyaki o tsukutte mimasu.〕' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('せっかく{手伝|てつだ}ってくれたのに、{焦|こ}がしてしまって、ごめんね。', 'Sekkaku tetsudatte kureta noni, kogashite shimatte, gomen ne.', 'Cậu đã mất công phụ mình vậy mà mình lại làm cháy, xin lỗi nhé.'),
        E('{本屋|ほんや}で{探|さが}してみたけど、{売|う}っていませんでした。', "Hon'ya de sagashite mita kedo, utte imasen deshita.", 'Mình thử tìm ở hiệu sách nhưng không có bán.'),
        E('さっきインターネットで{注文|ちゅうもん}したところです。', 'Sakki intaanetto de chuumon shita tokoro desu.', 'Mình vừa đặt trên mạng lúc nãy.'),
        E('{今度|こんど}は{弱|よわ}い{火|ひ}で{焼|や}いてみるつもり。', 'Kondo wa yowai hi de yaite miru tsumori.', 'Lần này mình định thử rán lửa nhỏ. (～てみる + つもり, ôn Bài 16)'),
      ],
    },

    /* ── Bài 2 ── */
    { t: 'h', text: 'Bài 2 — 内容理解（中文）: 「日本語の失敗」' },
    {
      t: 'passage',
      title: '{日本語|にほんご}の{失敗|しっぱい}　　ダニエル',
      intro: 'Bài viết của ダニエル đăng trên bản tin của lớp tiếng Nhật. Đọc rồi trả lời câu hỏi.',
      paras: [
        { label: '①', text: '{日本|にほん}に{来|き}て、もうすぐ{一年|いちねん}になります。この{一年|いちねん}で、{私|わたし}は{日本語|にほんご}の{失敗|しっぱい}をたくさんしてしまいました。{今日|きょう}は、その{中|なか}から{二|ふた}つ{紹介|しょうかい}します。' },
        { label: '②', text: '{一|ひと}つ{目|め}は、アルバイトを{始|はじ}めて{一週間目|いっしゅうかんめ}のことです。お{客|きゃく}さんに「ビールを{二|ふた}つですね」と{言|い}うつもりだったのに、「ビルを{二|ふた}つですね」と{言|い}ってしまいました。ビールは「ビー」と{長|なが}く{言|い}わなければなりません。お{客|きゃく}さんは{笑|わら}って、「ビルは{高|たか}くて{買|か}えませんよ」と{言|い}いました。とても{恥|は}ずかしかったです。' },
        { label: '③', text: '{二|ふた}つ{目|め}は、{郵便局|ゆうびんきょく}でのことです。「{切手|きって}をください」と{言|い}いたかったのに、「きてをください」と{言|い}ってしまいました。{小|ちい}さい「っ」を{忘|わす}れてしまったのです。{局員|きょくいん}の{人|ひと}は{困|こま}った{顔|かお}をしましたが、{私|わたし}が{手紙|てがみ}を{見|み}せたら、すぐにわかってくれました。' },
        { label: '④', text: 'この{二|ふた}つの{失敗|しっぱい}で、{日本語|にほんご}は{長|なが}い{音|おと}や{小|ちい}さい「っ」がとても{大切|たいせつ}だとわかりました。それからは、{新|あたら}しい{言葉|ことば}を{覚|おぼ}えるとき、{必|かなら}ず{声|こえ}に{出|だ}して、{何回|なんかい}も{言|い}ってみます。{失敗|しっぱい}は{恥|は}ずかしいですが、{失敗|しっぱい}して{覚|おぼ}えた{言葉|ことば}は、もう{忘|わす}れません。これからも、{間違|まちが}えることを{気|き}にしないで、どんどん{話|はな}してみようと{思|おも}っています。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b19-doc-2',
      title: 'Bài 2 — câu hỏi',
      items: [
        { q: 'ダニエルさんが「ビルを{二|ふた}つですね」と{言|い}ったとき、お{客|きゃく}さんはどうしましたか。', options: ['{怒|おこ}って、{店|みせ}を{出|で}てしまった。', '{笑|わら}って、{冗談|じょうだん}を{言|い}った。', 'ビールを{二|ふた}つ{注文|ちゅうもん}し{直|なお}した。', '{店長|てんちょう}を{呼|よ}んだ。'], correct: 1, why: '**お{客|きゃく}さんは{笑|わら}って、「ビルは{高|たか}くて{買|か}えませんよ」と{言|い}いました** — cười và nói đùa. 〔Okyaku-san wa waratte…〕' },
        { q: '{郵便局|ゆうびんきょく}で、ダニエルさんはどうして{間違|まちが}えてしまいましたか。', options: ['「{切手|きって}」という{言葉|ことば}を{知|し}らなかったから', '{長|なが}い{音|おと}を{短|みじか}く{言|い}ってしまったから', '{小|ちい}さい「っ」を{言|い}わなかったから', '{手紙|てがみ}を{家|いえ}に{忘|わす}れたから'], correct: 2, why: '**{小|ちい}さい「っ」を{忘|わす}れてしまったのです** — きって → きて. Lỗi trường âm là chuyện ở quán (đoạn ②). 〔Chiisai "tsu" o wasurete shimatta no desu.〕' },
        { q: '{二|ふた}つの{失敗|しっぱい}のあと、ダニエルさんは{新|あたら}しい{言葉|ことば}を{覚|おぼ}えるとき、どうしていますか。', options: ['{声|こえ}に{出|だ}して、{何回|なんかい}も{言|い}ってみる。', 'ノートに{何回|なんかい}も{書|か}いてみる。', '{日本人|にほんじん}の{友達|ともだち}に{聞|き}いてもらう。', '{辞書|じしょ}で{意味|いみ}だけ{調|しら}べる。'], correct: 0, why: 'Đoạn ④: **{新|あたら}しい{言葉|ことば}を{覚|おぼ}えるとき、{必|かなら}ず{声|こえ}に{出|だ}して、{何回|なんかい}も{言|い}ってみます**. 〔Kanarazu koe ni dashite, nankai mo itte mimasu.〕' },
        { q: 'ダニエルさんがこの{文章|ぶんしょう}でいちばん{言|い}いたいことは{何|なん}ですか。', options: ['{日本|にほん}のお{客|きゃく}さんは{優|やさ}しい。', '{郵便局|ゆうびんきょく}の{人|ひと}は{外国人|がいこくじん}の{日本語|にほんご}がわからない。', '{失敗|しっぱい}から{大切|たいせつ}なことがわかったので、{間違|まちが}いを{気|き}にしないで{話|はな}してみたい。', '{日本語|にほんご}は{難|むずか}しいので、{話|はな}すより{書|か}くほうがいい。'], correct: 2, why: 'Ý chính ở đoạn ④: **{大切|たいせつ}だとわかりました … {間違|まちが}えることを{気|き}にしないで、どんどん{話|はな}してみようと{思|おも}っています**. Các phương án khác chỉ là chi tiết hoặc không có trong bài.' },
      ],
    },
    {
      t: 'note',
      title: 'Ngữ pháp trong bài đọc 2',
      items: [
        '**{言|い}うつもりだったのに、…{言|い}ってしまいました** — つもり (Bài 16) + **のに** + **～てしまう**: định nói A vậy mà lỡ nói B. Khuôn "định làm / muốn làm … vậy mà lỡ …" rất hay gặp trong bài viết kể thất bại. Câu ③ cùng khuôn: **{言|い}いたかったのに、…{言|い}ってしまいました**.',
        '**{忘|わす}れてしまったのです** — ～のです = ～んです ở văn viết (giải thích, ôn ポイント 104). **{見|み}せたら、すぐにわかってくれました** — ～たら + kết quả (ポイント 120) + くれる (Bài 18).',
        '**{何回|なんかい}も{言|い}ってみます** — ～てみる cho thói quen hiện tại. **どんどん{話|はな}してみようと{思|おも}っています** — ～てみる + thể ý chí + と{思|おも}っています (ôn Bài 16).',
        'Chuyện thật của người học: ビール (biiru — bia) ↔ ビル (biru — toà nhà); {切手|きって} (kitte — tem) ↔ {来|き}て (kite — hãy đến). Trường âm và âm ngắt っ **đổi cả nghĩa** — đây là lý do bài nào cũng nhắc romaji viết đôi.',
      ],
    },

    /* ── Bài 3 ── */
    { t: 'h', text: 'Bài 3 — 情報検索: lớp học nấu ăn thử (体験レッスン)' },
    {
      t: 'passage',
      title: 'ひまわり{料理教室|りょうりきょうしつ}　{初|はじ}めての{人|ひと}も{作|つく}ってみませんか！',
      intro: 'ワン thấy tờ quảng cáo này ở siêu thị. Sau lần お好み焼き bị cháy, cô muốn đi học nấu ăn thử một buổi. Đọc rồi trả lời câu hỏi.',
      paras: [
        { text: '「{料理|りょうり}は{失敗|しっぱい}してしまうから、ちょっと……」という{人|ひと}も{大丈夫|だいじょうぶ}です。{先生|せんせい}が{一人|ひとり}ずつ{教|おし}えますから、{安心|あんしん}して{参加|さんか}してください。{体験|たいけん}レッスンは{一回|いっかい}だけ{参加|さんか}できます。' },
        { text: 'Ａ {和食|わしょく}コース：{火曜日|かようび} {18:00|じゅうはちじ}～{20:00|にじゅうじ}　{2,500円|にせんごひゃくえん}　{天|てん}ぷらとみそ{汁|しる}を{作|つく}ります。エプロンを{持|も}ってきてください。' },
        { text: 'Ｂ パンコース：{土曜日|どようび} {10:00|じゅうじ}～{12:00|じゅうにじ}　{2,000円|にせんえん}　メロンパンを{作|つく}ります。{小学生|しょうがくせい}も{参加|さんか}できます。' },
        { text: 'Ｃ お{菓子|かし}コース：{土曜日|どようび} {14:00|じゅうよじ}～{16:00|じゅうろくじ}　{3,000円|さんぜんえん}　ケーキを{作|つく}ります。{作|つく}ったケーキは{持|も}って{帰|かえ}れます。' },
        { text: 'Ｄ {世界|せかい}の{料理|りょうり}コース：{日曜日|にちようび} {13:00|じゅうさんじ}～{15:00|じゅうごじ}　{2,800円|にせんはっぴゃくえん}　{今月|こんげつ}は{韓国|かんこく}のチヂミを{作|つく}ります。' },
        { text: '※ {学生|がくせい}の{方|かた}は{500円|ごひゃくえん}{安|やす}くなります。{当日|とうじつ}、{学生証|がくせいしょう}を{見|み}せてください。' },
        { text: '※ {材料|ざいりょう}のお{金|かね}は{料金|りょうきん}に{入|はい}っています。' },
        { text: '※ {予約|よやく}はレッスンの{前|まえ}の{日|ひ}までにお{願|ねが}いします。{当日|とうじつ}の{予約|よやく}はできません。' },
      ],
    },
    {
      t: 'table',
      caption: 'ひまわり料理教室 — 体験レッスン（1回）',
      head: ['コース', '{曜日|ようび}・{時間|じかん}', '{料金|りょうきん}', '{作|つく}る{料理|りょうり}', 'Ghi chú'],
      rows: [
        ['Ａ {和食|わしょく}', '{火|か} {18:00|じゅうはちじ}～{20:00|にじゅうじ}', '{2,500円|にせんごひゃくえん}', '{天|てん}ぷら・みそ{汁|しる}', 'tự mang tạp dề'],
        ['Ｂ パン', '{土|ど} {10:00|じゅうじ}～{12:00|じゅうにじ}', '{2,000円|にせんえん}', 'メロンパン', 'học sinh tiểu học tham gia được'],
        ['Ｃ お{菓子|かし}', '{土|ど} {14:00|じゅうよじ}～{16:00|じゅうろくじ}', '{3,000円|さんぜんえん}', 'ケーキ', 'mang bánh về được'],
        ['Ｄ {世界|せかい}の{料理|りょうり}', '{日|にち} {13:00|じゅうさんじ}～{15:00|じゅうごじ}', '{2,800円|にせんはっぴゃくえん}', 'チヂミ ({韓国|かんこく})', '—'],
      ],
    },
    {
      t: 'mcq',
      id: 'b19-doc-3',
      title: 'Bài 3 — câu hỏi',
      items: [
        { q: 'ワンさんは{大学生|だいがくせい}です。{週末|しゅうまつ}の{午後|ごご}だけ{時間|じかん}があります。{甘|あま}い{物|もの}を{作|つく}ってみたいです。どのコースで、いくら{払|はら}いますか。', options: ['Ｂで{1,500円|せんごひゃくえん}', 'Ｃで{3,000円|さんぜんえん}', 'Ｃで{2,500円|にせんごひゃくえん}', 'Ｄで{2,300円|にせんさんびゃくえん}'], correct: 2, why: 'Chiều cuối tuần: C (thứ Bảy 14:00) hoặc D (Chủ nhật 13:00); đồ ngọt → **C (ケーキ)**. Sinh viên giảm 500 → **3.000 − 500 = 2.500 yên**. B là buổi sáng (loại); bẫy ②: quên dòng ※ giảm giá.' },
        { q: 'このお{知|し}らせの{内容|ないよう}と{合|あ}っているのはどれですか。', options: ['{当日|とうじつ}でも{予約|よやく}できる。', '{材料|ざいりょう}のお{金|かね}は{別|べつ}に{払|はら}わなければならない。', 'Ｂコースは{子|こ}どもも{参加|さんか}できる。', 'Ａコースはエプロンを{貸|か}してくれる。'], correct: 2, why: 'B: **{小学生|しょうがくせい}も{参加|さんか}できます**. Đặt chỗ phải trước một ngày (①✗); tiền nguyên liệu **{料金|りょうきん}に{入|はい}っています** (②✗); A phải **{持|も}ってきてください** (④✗).' },
        { q: 'カルロスさんは{金曜日|きんようび}に{電話|でんわ}して、{次|つぎ}の{日|ひ}のＢコースを{予約|よやく}したいです。できますか。', options: ['できる。{前|まえ}の{日|ひ}までに{予約|よやく}すればいいから。', 'できない。{一週間前|いっしゅうかんまえ}までに{予約|よやく}しなければならないから。', 'できない。{当日|とうじつ}だから。', 'できない。Ｂコースは{小学生|しょうがくせい}だけだから。'], correct: 0, why: '**{予約|よやく}はレッスンの{前|まえ}の{日|ひ}までに** — thứ Sáu là ngày trước buổi thứ Bảy → được. B không chỉ dành cho học sinh tiểu học (**{小学生|しょうがくせい}も**).' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('{初|はじ}めての{人|ひと}も{作|つく}ってみませんか。', 'Hajimete no hito mo tsukutte mimasen ka.', 'Người mới cũng thử làm xem nhé? (～てみませんか — lời mời trên quảng cáo)'),
        E('{料理|りょうり}は{失敗|しっぱい}してしまうから、ちょっと……。', 'Ryouri wa shippai shite shimau kara, chotto…….', 'Nấu ăn thì tôi hay làm hỏng nên hơi ngại…'),
        E('{作|つく}ったケーキは{持|も}って{帰|かえ}れます。', 'Tsukutta keeki wa motte kaeremasu.', 'Bánh làm xong mang về được. (thể khả năng — Bài 16)'),
        E('{予約|よやく}はレッスンの{前|まえ}の{日|ひ}までにお{願|ねが}いします。', 'Yoyaku wa ressun no mae no hi made ni onegai shimasu.', 'Xin đặt chỗ chậm nhất trước buổi học một ngày.'),
      ],
    },
  ],
};

/* ═══════════════════════════ 7. NÓI ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b19-noi',
  kind: 'speaking',
  title: 'Luyện nói — báo lỗi & xin lỗi, nói việc muốn thử, đang/vừa làm gì, kể 1 phút một lần thất bại, đọc to',
  goal: 'Trả lời trôi chảy câu hỏi thi nói về thất bại, xin lỗi, trải nghiệm (đã từng thất bại thế nào, muốn thử làm gì, khi lỡ làm sai thì nói gì) bằng ～てしまいました／～てみたい／～のに; trả lời "bây giờ đang làm gì" bằng ～ところ; kể 1 phút về một lần thất bại có đủ bốn mẫu của bài; đọc to đoạn văn 30 giây đúng nhịp âm ngắt っ và trường âm.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Thi nói kiểu JPD (khung của bộ môn) — chủ đề Bài 19 rơi vào đâu',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 19 xuất hiện ở đâu'],
      rows: [
        ['Reading', '40', 'Chuẩn bị 30 giây, đọc to đoạn ~100 chữ.', 'Đoạn kể thất bại: {寝坊|ねぼう}してしまいました, {間違|まちが}えてしまいました, {急|いそ}いだのに, {謝|あやま}りました, もう{一度|いちど}やってみます…'],
        ['Talking — có tranh', '3 × 15', 'Nhìn tranh (người làm vỡ đĩa, người đang nấu ăn, người vừa tới ga) trả lời.', 'この{人|ひと}はどうしましたか（→ お{皿|さら}を{割|わ}ってしまいました）· {今|いま}{何|なに}をしているところですか · この{人|ひと}は{何|なに}と{言|い}いますか'],
        ['Talking — không tranh', '1 × 10', 'Trả lời 1 câu về bản thân.', '{失敗|しっぱい}したことがありますか · {日本|にほん}で{何|なに}をしてみたいですか · {約束|やくそく}に{遅|おく}れたとき、{何|なん}と{言|い}いますか'],
        ['Presenting', '5', 'Chào khi vào/ra, thái độ.', '{失礼|しつれい}します／よろしくお{願|ねが}いします／ありがとうございました (chữ 失 vừa học!)'],
      ],
    },
    {
      t: 'note',
      title: 'Luật trả lời cho câu hỏi Bài 19',
      items: [
        '**Câu hỏi "đã từng thất bại chưa?"** → **～てしまったことがあります** + chuyện gì + cảm xúc: {財布|さいふ}を{落|お}としてしまったことがあります。とても{困|こま}りました. Thêm **～のに** để câu có "chiều sâu": ちゃんとかばんに{入|い}れたのに…',
        '**Câu hỏi "muốn thử gì?"** → **～てみたいです** + lý do (～から): {一度|いちど}{富士山|ふじさん}に{登|のぼ}ってみたいです。{写真|しゃしん}で{見|み}て、きれいだと{思|おも}ったからです.',
        '**Tranh có người đang / vừa làm** → **～ているところです／～たところです**; tranh có đồ vỡ, đồ đổ → **～てしまいました** (tha động từ nếu người trong tranh làm).',
        'Câu dài 2–3 ý là đủ điểm: **câu chính + lý do (～ので／～から) + cảm nghĩ / việc làm sau đó**. Không nghe rõ: **もう{一度|いちど}お{願|ねが}いします** (tối đa 2 lần, không bị trừ).',
      ],
    },
    {
      t: 'phatam',
      id: 'b19-noi-phat-am',
      title: 'Đọc to & chấm phát âm — 14 câu hay dùng của Bài 19',
      note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Chú ý: し・っ・ぱ・い (âm ngắt っ giữ 1 nhịp), {割|わ}・っ・て, {落|お}とし・て・しまい・ました (đọc liền, không ngắt giữa て và しまう), ちゃ・っ・た, {警察|けいさつ} = け・い・さ・つ (けい kéo dài).',
      items: [
        { text: 'すみません、お{皿|さら}を{割|わ}ってしまいました。', ipa: 'sumimasen osara o watte shimaimashita', vi: 'Xin lỗi, tôi lỡ làm vỡ đĩa mất rồi.' },
        { text: '{本当|ほんとう}に{申|もう}し{訳|わけ}ありません。', ipa: 'hontou ni moushiwake arimasen', vi: 'Thành thật xin lỗi.' },
        { text: '{次|つぎ}からは{気|き}をつけます。', ipa: 'tsugi kara wa ki o tsukemasu', vi: 'Từ lần sau tôi sẽ cẩn thận.' },
        { text: '{寝坊|ねぼう}して、{遅|おく}れてしまいました。', ipa: 'nebou shite okurete shimaimashita', vi: 'Tôi ngủ quên nên đã đến muộn.' },
        { text: 'あっ、{焦|こ}げちゃった！', ipa: 'a kogechatta', vi: 'Ối, cháy mất rồi!' },
        { text: '{一度|いちど}、{着物|きもの}を{着|き}てみたいです。', ipa: 'ichido kimono o kite mitai desu', vi: 'Tôi muốn mặc thử kimono một lần.' },
        { text: 'これ、{着|き}てみてもいいですか。', ipa: 'kore kite mite mo ii desu ka', vi: 'Tôi mặc thử cái này được không?' },
        { text: '{先生|せんせい}に{聞|き}いてみたらどうですか。', ipa: 'sensei ni kiite mitara dou desu ka', vi: 'Thử hỏi thầy xem sao?' },
        { text: '{今|いま}から{出|で}かけるところです。', ipa: 'ima kara dekakeru tokoro desu', vi: 'Tôi sắp ra ngoài ngay bây giờ.' },
        { text: '{今|いま}、{鍵|かぎ}を{探|さが}しているところです。', ipa: 'ima kagi o sagashite iru tokoro desu', vi: 'Tôi đang tìm chìa khoá.' },
        { text: 'ちょうど{今|いま}、{駅|えき}に{着|つ}いたところです。', ipa: 'choudo ima eki ni tsuita tokoro desu', vi: 'Tôi vừa mới tới ga.' },
        { text: '{毎日|まいにち}{勉強|べんきょう}したのに、{試験|しけん}に{落|お}ちてしまいました。', ipa: 'mainichi benkyou shita noni shiken ni ochite shimaimashita', vi: 'Ngày nào cũng học vậy mà vẫn thi trượt.' },
        { text: '{電車|でんしゃ}に{財布|さいふ}を{忘|わす}れてしまったんですが……。', ipa: 'densha ni saifu o wasurete shimatta n desu ga', vi: 'Tôi lỡ để quên ví trên tàu…' },
        { text: '{気|き}にしないでください。', ipa: 'ki ni shinaide kudasai', vi: 'Đừng bận tâm nhé.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Thi nói mẫu — giám khảo hỏi về thất bại và trải nghiệm',
      lines: [
        { who: '{試験官|しけんかん}', role: 'examiner', text: '{日本語|にほんご}で{失敗|しっぱい}したことがありますか。', ro: 'Nihongo de shippai shita koto ga arimasu ka.', vi: 'Em đã từng mắc lỗi khi nói tiếng Nhật chưa?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、あります。レストランで「ビール」と{言|い}いたかったのに、「ビル」と{言|い}ってしまいました。', ro: 'Hai, arimasu. Resutoran de "biiru" to iitakatta noni, "biru" to itte shimaimashita.', vi: 'Có ạ. Ở nhà hàng em muốn nói "bia" vậy mà lỡ nói thành "toà nhà".' },
        { who: '{試験官|しけんかん}', role: 'examiner', text: 'そのとき、どうしましたか。', ro: 'Sono toki, dou shimashita ka.', vi: 'Lúc đó em đã làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{店|みせ}の{人|ひと}が{笑|わら}って、{正|ただ}しい{言|い}い{方|かた}を{教|おし}えてくれました。{恥|は}ずかしかったですが、もう{忘|わす}れません。', ro: 'Mise no hito ga waratte, tadashii iikata o oshiete kuremashita. Hazukashikatta desu ga, mou wasuremasen.', vi: 'Nhân viên cười rồi chỉ cho em cách nói đúng. Em xấu hổ nhưng giờ thì không bao giờ quên nữa ạ.' },
        { who: '{試験官|しけんかん}', role: 'examiner', text: '（{絵|え}を{見|み}せて）この{人|ひと}はどうしましたか。', ro: '(E o misete) Kono hito wa dou shimashita ka.', vi: '(Cho xem tranh) Người này bị làm sao?' },
        { who: 'Bạn', role: 'candidate', text: 'お{皿|さら}を{落|お}として、{割|わ}ってしまいました。{今|いま}、{店長|てんちょう}に{謝|あやま}っているところです。', ro: 'Osara o otoshite, watte shimaimashita. Ima, tenchou ni ayamatte iru tokoro desu.', vi: 'Người này làm rơi đĩa, vỡ mất rồi ạ. Bây giờ đang xin lỗi quản lý.' },
        { who: '{試験官|しけんかん}', role: 'examiner', text: '{日本|にほん}で{何|なに}をしてみたいですか。', ro: 'Nihon de nani o shite mitai desu ka.', vi: 'Ở Nhật em muốn thử làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{温泉|おんせん}に{入|はい}ってみたいです。{日本人|にほんじん}の{友達|ともだち}から、とても{気持|きも}ちがいいと{聞|き}いたからです。', ro: 'Onsen ni haitte mitai desu. Nihonjin no tomodachi kara, totemo kimochi ga ii to kiita kara desu.', vi: 'Em muốn thử tắm suối nước nóng ạ. Vì em nghe bạn người Nhật nói là rất dễ chịu.' },
        { who: '{試験官|しけんかん}', role: 'examiner', text: '{約束|やくそく}の{時間|じかん}に{遅|おく}れたとき、{何|なん}と{言|い}いますか。', ro: 'Yakusoku no jikan ni okureta toki, nan to iimasu ka.', vi: 'Khi đến muộn giờ hẹn, em sẽ nói gì?' },
        { who: 'Bạn', role: 'candidate', text: '「{遅|おく}れてしまって、すみません。」と{言|い}います。それから、{遅|おく}れた{理由|りゆう}を{正直|しょうじき}に{話|はな}します。', ro: '"Okurete shimatte, sumimasen." to iimasu. Sorekara, okureta riyuu o shoujiki ni hanashimasu.', vi: 'Em nói "Xin lỗi vì đã đến muộn". Rồi em thành thật nói lý do đến muộn ạ.' },
      ],
    },
    { t: 'h', text: 'できる！ — Kể 1 phút: "Một lần thất bại của tôi"' },
    {
      t: 'table',
      caption: 'Khung bài nói 1 phút — 5 câu là đủ, mỗi câu một mẫu',
      head: ['Phần', 'Nói gì', 'Câu mẫu', 'Romaji'],
      rows: [
        ['Mở', 'khi nào, ở đâu', '{先月|せんげつ}、アルバイトで{大|おお}きい{失敗|しっぱい}をしてしまいました。', 'Sengetsu, arubaito de ookii shippai o shite shimaimashita.'],
        ['Chuyện gì', 'đã lỡ làm gì (～てしまいました)', 'お{客|きゃく}さんの{注文|ちゅうもん}を{間違|まちが}えてしまったんです。', 'Okyaku-san no chuumon o machigaete shimatta n desu.'],
        ['Tiếc', 'đã cố / đã chuẩn bị vậy mà (～のに)', 'ちゃんとメモを{書|か}いたのに、{読|よ}み{間違|まちが}えてしまいました。', 'Chanto memo o kaita noni, yomimachigaete shimaimashita.'],
        ['Sau đó', 'xin lỗi, thử làm gì (～てみました)', 'すぐお{客|きゃく}さんに{謝|あやま}って、それから{注文|ちゅうもん}を{声|こえ}に{出|だ}して{確認|かくにん}してみました。', 'Sugu okyaku-san ni ayamatte, sorekara chuumon o koe ni dashite kakunin shite mimashita.'],
        ['Kết', 'bây giờ thế nào + cảm nghĩ', '{今|いま}は{間違|まちが}えなくなりました。{失敗|しっぱい}してよかったと{思|おも}っています。', 'Ima wa machigaenaku narimashita. Shippai shite yokatta to omotte imasu.'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nói 1 phút cho đủ giờ và đủ điểm',
      items: [
        'Nói chậm, rõ: 5 câu trên đọc vừa khoảng **40–50 giây**; thêm 1–2 câu chi tiết (quản lý nói gì, mình cảm thấy thế nào: {恥|は}ずかしかった／{悲|かな}しかった／ほっとした) là đủ 1 phút.',
        'Mỗi phần **một mẫu của bài**: giám khảo nghe thấy ～てしまいました, ～のに, ～てみました là cộng điểm ngữ pháp. Có thể thêm **～ているところ** nếu kể "lúc đó đang…": {電話|でんわ}が{来|き}たとき、ちょうど{料理|りょうり}を{作|つく}っているところでした.',
        'Chưa có chuyện thất bại ở chỗ làm? Kể chuyện **ngủ quên, lỡ tàu, mất đồ, nấu ăn hỏng, nói nhầm tiếng Nhật** — vẫn dùng đủ bốn mẫu.',
      ],
    },
    {
      t: 'note',
      title: 'Đọc to (Reading 40 điểm) — đoạn mẫu 30 giây',
      items: [
        '{昨日|きのう}の{朝|あさ}、{寝坊|ねぼう}してしまいました。{急|いそ}いで{駅|えき}まで{走|はし}ったのに、{電車|でんしゃ}はもう{出|で}たところでした。{学校|がっこう}に{着|つ}いたとき、{授業|じゅぎょう}はもう{始|はじ}まっていました。{先生|せんせい}に{謝|あやま}ると、「{次|つぎ}は{気|き}をつけてね」と{言|い}ってくれました。{今夜|こんや}から{目覚|めざ}まし{時計|どけい}を{二|ふた}つかけてみます。',
        'Romaji: Kinou no asa, nebou shite shimaimashita. Isoide eki made hashitta noni, densha wa mou deta tokoro deshita. Gakkou ni tsuita toki, jugyou wa mou hajimatte imashita. Sensei ni ayamaru to, "Tsugi wa ki o tsukete ne" to itte kuremashita. Kon\'ya kara mezamashi-dokei o futatsu kakete mimasu.',
        'Nghĩa: Sáng hôm qua tôi ngủ quên. Đã vội chạy ra ga vậy mà tàu vừa chạy mất. Lúc tôi tới trường, giờ học đã bắt đầu rồi. Tôi xin lỗi thầy, thầy bảo "Lần sau chú ý nhé". Từ tối nay tôi sẽ thử đặt hai cái đồng hồ báo thức.',
        'Chỗ dễ vấp: **{寝坊|ねぼう}してしまいました** (ne-bo-u-shi-te-shi-ma-i-ma-shi-ta — liền một hơi), **{走|はし}ったのに** (ha-shi-t-ta — っ giữ 1 nhịp), **{出|で}たところでした**, **{謝|あやま}ると** (a-ya-ma-ru-to), **{目覚|めざ}まし{時計|どけい}** (me-za-ma-shi-do-ke-i).',
      ],
    },
    {
      t: 'speak',
      id: 'b19-noi-ghi-am',
      part: '1',
      questions: [
        'しっぱいした ことが ありますか。どんな しっぱいでしたか。',
        'やくそくの じかんに おくれた とき、なんと いいますか。',
        'にほんで なにを して みたいですか。どうしてですか。',
        'いま、なにを して いる ところですか。',
        'がんばったのに、うまく いかなかった ことが ありますか。',
        'あなたの しっぱいの はなしを 1ぷんで して ください。',
      ],
    },
  ],
};

/* ═══════════════════════════ 8. VIẾT ═══════════════════════════ */

const VIET: Lesson = {
  id: 'b19-viet',
  kind: 'writing',
  title: 'Viết — bài văn "Thất bại của tôi" (150–200 chữ) và email xin lỗi quản lý chỗ làm thêm',
  goal: 'Viết bài văn 150–200 chữ kể một lần thất bại có đủ ～てしまいました, ～のに, ～てみました và cảm nghĩ cuối bài; viết email ngắn xin lỗi quản lý vì đến muộn / làm hỏng việc có lời xin lỗi lịch sự, lý do và lời hứa — tự chấm theo 5 tiêu chí.',
  minutes: 40,
  blocks: [
    {
      t: 'p',
      text: 'Đề chính: **作文「わたしの{失敗|しっぱい}」**, **150–200 chữ**, thể です／ます. Đề phụ: **email xin lỗi quản lý** (~100 chữ). Bài viết N4 chấm **đúng khuôn + dùng được mẫu vừa học**: kể theo trình tự thời gian, mỗi đoạn một mẫu là đủ điểm ngữ pháp. Viết vào vở hoặc gõ ra, rồi so với bài mẫu và tự chấm theo bảng cuối mục.',
    },
    {
      t: 'table',
      caption: 'Dàn ý bài văn "Thất bại của tôi" — 4 đoạn',
      head: ['Đoạn', 'Viết gì', 'Mẫu câu', 'Romaji'],
      rows: [
        ['① Mở', 'khi nào, ở đâu, đang làm gì', '{去年|きょねん}の{冬|ふゆ}、{初|はじ}めて{一人|ひとり}で{料理|りょうり}を{作|つく}ってみました。', 'Kyonen no fuyu, hajimete hitori de ryouri o tsukutte mimashita.'],
        ['② Thất bại', 'đã lỡ làm gì, tiếc vì sao (～てしまいました, ～のに)', 'レシピのとおりに{作|つく}ったのに、{塩|しお}を{入|い}れすぎてしまいました。', 'Reshipi no toori ni tsukutta noni, shio o iresugite shimaimashita.'],
        ['③ Sau đó', 'đã làm gì để sửa, thử lại thế nào (～てみました)', '{次|つぎ}の{日|ひ}、{母|はは}に{電話|でんわ}して、{作|つく}り{方|かた}を{聞|き}いてみました。', 'Tsugi no hi, haha ni denwa shite, tsukurikata o kiite mimashita.'],
        ['④ Kết', 'học được gì, cảm nghĩ, dự định', '{失敗|しっぱい}は{恥|は}ずかしいですが、{大切|たいせつ}なことを{教|おし}えてくれると{思|おも}います。', 'Shippai wa hazukashii desu ga, taisetsu na koto o oshiete kureru to omoimasu.'],
      ],
    },
    { t: 'h', text: 'Bài mẫu (~200 chữ)' },
    {
      t: 'passage',
      title: 'わたしの{失敗|しっぱい}　　ナタポン',
      paras: [
        { text: '{先月|せんげつ}、アルバイト{先|さき}の{食堂|しょくどう}で、{大|おお}きい{失敗|しっぱい}をしてしまいました。' },
        { text: 'その{日|ひ}はお{客|きゃく}さんがとても{多|おお}くて、{僕|ぼく}は{急|いそ}いでいました。ちゃんとメモを{見|み}たのに、カレーとハンバーグを{間違|まちが}えてしまいました。それから、お{皿|さら}を{落|お}として、{割|わ}ってしまいました。{本当|ほんとう}に{恥|は}ずかしかったです。' },
        { text: 'でも、{店長|てんちょう}は{怒|おこ}らないで、「{気|き}にしなくていいよ」と{言|い}ってくれました。そして、{新|あたら}しいカレーを{作|つく}ってみないかと{言|い}ってくれました。{次|つぎ}の{日|ひ}から、{僕|ぼく}は{家|いえ}で{何回|なんかい}も{作|つく}ってみました。' },
        { text: '{今|いま}、そのカレーは{店|みせ}のメニューに{入|はい}っています。{失敗|しっぱい}したとき、{逃|に}げないで{謝|あやま}ってよかったと{思|おも}っています。' },
      ],
    },
    {
      t: 'note',
      title: 'Phân tích bài mẫu — mẫu nào ở đâu',
      items: [
        '**{失敗|しっぱい}をしてしまいました／{間違|まちが}えてしまいました／{割|わ}ってしまいました** (～てしまう — việc đáng tiếc, nhận lỗi bằng tha động từ).',
        '**ちゃんとメモを{見|み}たのに、…{間違|まちが}えてしまいました** (～のに — đã cẩn thận vậy mà vẫn sai: câu "có cảm xúc" của bài).',
        '**{作|つく}ってみないか** (～てみる — lời rủ được thuật lại; ～ないか = ～ませんか dạng thường) · **{何回|なんかい}も{作|つく}ってみました** (～てみる — kể việc đã thử).',
        '**{怒|おこ}らないで** (không… mà — ôn ～ないで) · **{言|い}ってくれました** (Bài 18) · **{逃|に}げないで{謝|あやま}ってよかった** = không trốn tránh mà xin lỗi là đúng ({逃|に}げる = bỏ chạy).',
        'Bài văn (作文) dùng **です／ます** toàn bài; không dùng ～ちゃった. Câu kết nêu **bài học** — giám khảo thích bài có "ý" chứ không chỉ kể.',
      ],
    },
    { t: 'h', text: 'Đề phụ — email xin lỗi quản lý (~100 chữ)' },
    {
      t: 'p',
      text: 'Tình huống: hôm qua bạn **đến chỗ làm thêm muộn 30 phút** vì lỡ tàu. Viết email cho quản lý: **xin lỗi lịch sự** (～てしまい、{申|もう}し{訳|わけ}ありませんでした), **lý do thật** (～のに nếu hợp), **lời hứa** ({次|つぎ}から～). Câu mẫu bên dưới — thay chi tiết của bạn.',
    },
    {
      t: 'examples',
      items: [
        E('{件名|けんめい}：{昨日|きのう}の{遅刻|ちこく}について', 'Kenmei: Kinou no chikoku ni tsuite', 'Tiêu đề: Về việc đến muộn hôm qua'),
        E('{小林店長|こばやしてんちょう}、お{疲|つか}れさまです。ナタポンです。', 'Kobayashi tenchou, otsukaresama desu. Natapon desu.', 'Anh Kobayashi, em chào anh. Em là Nattapon.'),
        E('{昨日|きのう}は{30分|さんじゅっぷん}も{遅|おく}れてしまって、{本当|ほんとう}に{申|もう}し{訳|わけ}ありませんでした。', 'Kinou wa sanjuppun mo okurete shimatte, hontou ni moushiwake arimasen deshita.', 'Hôm qua em đến muộn tới 30 phút, em thật lòng xin lỗi anh.'),
        E('{早|はや}く{家|いえ}を{出|で}たのに、{電車|でんしゃ}を{間違|まちが}えてしまいました。', 'Hayaku ie o deta noni, densha o machigaete shimaimashita.', 'Em đã ra khỏi nhà sớm vậy mà lại lên nhầm tàu.'),
        E('{忙|いそが}しい{時間|じかん}だったのに、ご{迷惑|めいわく}をおかけしました。', 'Isogashii jikan datta noni, gomeiwaku o okake shimashita.', 'Đúng giờ đông khách vậy mà em đã gây phiền cho mọi người. (câu xin lỗi cố định)'),
        E('{次|つぎ}からは、{乗|の}る{電車|でんしゃ}をちゃんと{確認|かくにん}します。', 'Tsugi kara wa, noru densha o chanto kakunin shimasu.', 'Từ lần sau em sẽ kiểm tra kỹ chuyến tàu mình đi.'),
        E('これからもよろしくお{願|ねが}いします。', 'Korekara mo yoroshiku onegai shimasu.', 'Mong anh tiếp tục chỉ bảo em.'),
      ],
    },
    {
      t: 'quiz',
      id: 'b19-viet-cau',
      title: 'Viết từng câu cho bài của bạn — dịch Việt → Nhật (6 câu)',
      kind: 'translate',
      grammar: '～てしまいました · ～のに · ～てみました · ～ところでした · {申|もう}し{訳|わけ}ありません',
      items: [
        { q: 'Tôi đã lỡ đánh rơi điện thoại mất rồi.', answers: V('スマホを{落|お}としてしまいました。', '{携帯|けいたい}を{落|お}としてしまいました。', '{携帯電話|けいたいでんわ}を{落|お}としてしまいました。'), hint: 'おとして しまいました' },
        { q: 'Đã ghi chú cẩn thận vậy mà vẫn quên.', answers: V('ちゃんとメモを{書|か}いたのに、{忘|わす}れてしまいました。', 'ちゃんとメモしたのに、{忘|わす}れてしまいました。', 'ちゃんとメモを{書|か}いたのに、{忘|わす}れました。'), hint: 'かいたのに · わすれて しまいました' },
        { q: 'Hôm sau tôi đã thử làm lại một lần nữa.', answers: V('{次|つぎ}の{日|ひ}、もう{一度|いちど}やってみました。', '{次|つぎ}の{日|ひ}、もう{一度|いちど}{作|つく}ってみました。', '{次|つぎ}の{日|ひ}にもう{一度|いちど}やってみました。'), hint: 'もう いちど やって みました' },
        { q: 'Lúc đó tôi đang (đúng lúc) nấu ăn.', answers: V('そのとき、{料理|りょうり}を{作|つく}っているところでした。', 'そのとき、{料理|りょうり}をしているところでした。'), hint: 'つくって いる ところでした' },
        { q: 'Đến muộn, tôi thành thật xin lỗi. (rất lịch sự)', answers: V('{遅|おく}れてしまって、{申|もう}し{訳|わけ}ありません。', '{遅|おく}れて、{申|もう}し{訳|わけ}ありません。', '{遅|おく}れてしまって、{申|もう}し{訳|わけ}ありませんでした。'), hint: 'おくれて しまって · もうしわけ ありません' },
        { q: 'Thất bại tuy xấu hổ nhưng đã dạy tôi nhiều điều.', answers: V('{失敗|しっぱい}は{恥|は}ずかしいですが、いろいろなことを{教|おし}えてくれました。', '{失敗|しっぱい}は{恥|は}ずかしいけど、いろいろなことを{教|おし}えてくれました。', '{失敗|しっぱい}は{恥|は}ずかしいですが、たくさんのことを{教|おし}えてくれました。'), hint: 'はずかしいですが · おしえて くれました' },
      ],
    },
    {
      t: 'note',
      title: 'Tự chấm — 5 tiêu chí (mỗi tiêu chí 2 điểm, tổng 10)',
      items: [
        '**① Khuôn** — đủ 4 đoạn: mở (khi nào, ở đâu) → thất bại → sau đó làm gì → bài học / cảm nghĩ.',
        '**② Mẫu của bài** — có ít nhất 3 trong 4: ～てしまう, ～てみる, ～ところ, ～のに (mỗi mẫu dùng đúng = điểm).',
        '**③ Chia & nối đúng** — thể て đúng nhóm ({落|お}として, {割|わ}って, {盗|ぬす}んで); のに sau ナA／N có な; vế sau のに không phải ý chí, lời rủ.',
        '**④ Nội dung cụ thể** — nói rõ chuyện gì, ai nói gì, ít nhất 1 chi tiết thời gian / con số; có câu cảm xúc ({恥|は}ずかしかった, ほっとした…).',
        '**⑤ Độ dài & văn phong** — 150–200 chữ, toàn thể です／ます (không ～ちゃった), chữ Hán đã học viết bằng chữ Hán ({失敗|しっぱい}, {間違|まちが}い, {困|こま}る, {次|つぎ}, {謝|あやま}る…).',
      ],
    },
  ],
};

/* ═══════════════════════════ 9. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b19-bai-tap',
  kind: 'homework',
  title: 'Bài tập Bài 19 — dịch, trắc nghiệm, ghép câu, đổi câu (có đáp án)',
  goal: 'Tự kiểm tra toàn bộ Bài 19: dịch Việt → Nhật có ～てしまう／～ちゃう, ～てみる, ～ところ, ～のに; chọn đúng mẫu theo nghĩa và thời điểm, chọn đúng tự / tha động từ khi báo lỗi, phân biệt ～のに／～ても／～けど và hai loại のに; ghép câu đúng trật tự và đổi câu theo mẫu — mục tiêu ≥ 85%.',
  minutes: 50,
  blocks: [
    {
      t: 'note',
      title: 'Cách làm',
      items: [
        'Làm sau khi xong 8 mục cốt lõi. Gõ đáp án bằng kana hoặc chữ Hán đều được; dấu câu và dấu cách không tính.',
        'Sai câu nào thì mở lại đúng mục: ～てしまう → Ngữ pháp ① (bảng "～ました hay ～てしまいました"); ～ちゃう → ①c; ～てみる → ②; ～ところ → ③ (bảng đường thời gian); ～のに → ④ (bảng phân biệt) và ④′; tự / tha → bảng cuối mục Từ vựng.',
        'Mục tiêu: **≥ 85%** trước khi sang Bài 20.',
      ],
    },
    {
      t: 'quiz',
      id: 'b19-bt-dich',
      title: 'I. Dịch Việt → Nhật (14 câu)',
      kind: 'translate',
      grammar: '～てしまう · ～ちゃう · ～てみる · ～るところ · ～ているところ · ～たところ · ～のに · ～ばよかったのに',
      items: [
        { q: 'Tôi lỡ làm vỡ cốc mất rồi.', answers: V('コップを{割|わ}ってしまいました。', 'コップを{割|わ}ってしまった。', 'コップを{割|わ}っちゃった。'), hint: 'わって しまいました' },
        { q: 'Tôi đã đọc hết quyển sách này rồi.', answers: V('この{本|ほん}はもう{全部|ぜんぶ}{読|よ}んでしまいました。', 'この{本|ほん}を{全部|ぜんぶ}{読|よ}んでしまいました。', 'この{本|ほん}はもう{読|よ}んでしまいました。'), hint: 'よんで しまいました' },
        { q: 'Lỡ ngủ quên mất rồi! (văn nói)', answers: V('{寝坊|ねぼう}しちゃった！', '{寝坊|ねぼう}しちゃった。', '{寝坊|ねぼう}してしまった。'), hint: 'ねぼう しちゃった' },
        { q: 'Tôi muốn ăn thử natto.', answers: V('{納豆|なっとう}を{食|た}べてみたいです。', 'なっとうを{食|た}べてみたい。'), hint: 'たべて みたいです' },
        { q: 'Tôi mặc thử cái này được không?', answers: V('これを{着|き}てみてもいいですか。', 'これ、{着|き}てみてもいいですか。'), hint: 'きて みても いいですか' },
        { q: 'Cậu thử hỏi thầy xem?', answers: V('{先生|せんせい}に{聞|き}いてみたら？', '{先生|せんせい}に{聞|き}いてみたらどうですか。', '{先生|せんせい}に{聞|き}いてみたらどう？'), hint: 'きいて みたら' },
        { q: 'Tôi sắp ra khỏi nhà ngay bây giờ.', answers: V('{今|いま}から{家|いえ}を{出|で}るところです。', '{今|いま}から{出|で}かけるところです。', '{今|いま}から{家|いえ}を{出|で}るところ。'), hint: 'でる ところです' },
        { q: 'Bây giờ tôi đang làm bài tập (dở tay).', answers: V('{今|いま}、{宿題|しゅくだい}をしているところです。', '{今|いま}、{宿題|しゅくだい}をやっているところです。'), hint: 'して いる ところです' },
        { q: 'Tôi vừa mới về đến nhà.', answers: V('{今|いま}、{家|いえ}に{帰|かえ}ったところです。', 'ちょうど{今|いま}、{家|いえ}に{着|つ}いたところです。', '{今|いま}、{帰|かえ}ってきたところです。', 'さっき{家|いえ}に{帰|かえ}ったところです。'), hint: 'かえった ところです' },
        { q: 'Đã uống thuốc vậy mà vẫn không hạ sốt.', answers: V('{薬|くすり}を{飲|の}んだのに、{熱|ねつ}が{下|さ}がりません。', '{薬|くすり}を{飲|の}んだのに、{熱|ねつ}が{下|さ}がらない。'), hint: 'のんだのに · さがりません' },
        { q: 'Chủ nhật vậy mà phải đi làm.', answers: V('{日曜日|にちようび}なのに、{仕事|しごと}があります。', '{日曜日|にちようび}なのに、{仕事|しごと}に{行|い}かなければなりません。', '{日曜日|にちようび}なのに、{働|はたら}かなければなりません。'), hint: 'にちようび なのに' },
        { q: 'Phải chi đã mang theo ô thì tốt rồi.', answers: V('{傘|かさ}を{持|も}ってくればよかったのに。', '{傘|かさ}を{持|も}ってくればよかった。', '{傘|かさ}を{持|も}っていけばよかったのに。'), hint: 'もって くれば よかったのに' },
        { q: 'Đã mất công đến vậy mà quán lại nghỉ.', answers: V('せっかく{来|き}たのに、{店|みせ}が{休|やす}みでした。', 'せっかく{来|き}たのに、お{店|みせ}が{休|やす}みでした。', 'せっかく{来|き}たのに、{店|みせ}は{休|やす}みでした。'), hint: 'せっかく きたのに' },
        { q: 'Đi ra ga thì mất 15 phút.', answers: V('{駅|えき}まで{行|い}くのに{15分|じゅうごふん}かかります。', '{駅|えき}まで{行|い}くのに、{15分|じゅうごふん}かかります。'), hint: 'いくのに · かかります' },
      ],
    },
    {
      t: 'mcq',
      id: 'b19-bt-chon',
      title: 'II. Chọn đáp án đúng (14 câu)',
      items: [
        { q: 'すみません。{会議|かいぎ}の{資料|しりょう}を{家|いえ}に{忘|わす}れて（　）。', options: ['みました', 'しまいました', 'おきました', 'いるところです'], correct: 1, why: 'Việc lỡ xảy ra + xin lỗi → **～てしまいました**. 〔Shiryou o ie ni wasurete shimaimashita.〕' },
        { q: '（{自分|じぶん}が{落|お}とした）{店長|てんちょう}、すみません。お{皿|さら}（　）{割|わ}ってしまいました。', options: ['が', 'を', 'に', 'で'], correct: 1, why: 'Chính mình làm vỡ → tha động từ {割|わ}る + **を** (nhận trách nhiệm). が{割|わ}れて mới đi với が. 〔Osara o watte shimaimashita.〕' },
        { q: 'A「ケーキ、まだある？」 B「ごめん、{全部|ぜんぶ}{食|た}べ（　）。」', options: ['ちゃった', 'じゃった', 'てみた', 'ところ'], correct: 0, why: '{食|た}べてしまった → **{食|た}べちゃった** (て → ちゃ). じゃった chỉ cho thể て đuôi で. 〔Zenbu tabechatta.〕' },
        { q: 'ジュースを{全部|ぜんぶ}{飲|の}ん（　）。', options: ['ちゃった', 'じゃった', 'てしまった', 'でみた'], correct: 1, why: '{飲|の}んでしまった → **{飲|の}んじゃった** (で → じゃ). 〔Juusu o zenbu nonjatta.〕' },
        { q: 'この{靴|くつ}、ちょっとはいて（　）もいいですか。', options: ['しまって', 'みて', 'おいて', 'いる'], correct: 1, why: 'Xin đi thử → **～てみてもいいですか**. 〔Kono kutsu, chotto haite mite mo ii desu ka.〕' },
        { q: '{日本|にほん}にいる{間|あいだ}に、{一度|いちど}{富士山|ふじさん}に{登|のぼ}って（　）。', options: ['みたいです', 'しまいたいです', 'あります', 'いるところです'], correct: 0, why: 'Mong muốn trải nghiệm → **～てみたいです**. 〔Ichido Fujisan ni nobotte mitai desu.〕' },
        { q: 'A「もう{出|で}かけた？」 B「ううん、{今|いま}から（　）ところ。」', options: ['{出|で}かけた', '{出|で}かける', '{出|で}かけて', '{出|で}かけている'], correct: 1, why: '{今|いま}から (sắp) → **Vる + ところ**. 〔Ima kara dekakeru tokoro.〕' },
        { q: '{今|いま}、{電話|でんわ}で{話|はな}して（　）ところなので、ちょっと{待|ま}ってください。', options: ['しまう', 'いる', 'みる', 'おく'], correct: 1, why: 'Đang dở việc → **Vている + ところ**. 〔Ima, denwa de hanashite iru tokoro na node…〕' },
        { q: 'A「{会議|かいぎ}、もう{始|はじ}まった？」 B「うん、{今|いま}{始|はじ}まった（　）だよ。」', options: ['ところ', 'のに', 'つもり', 'まま'], correct: 0, why: '{今|いま} + Vた → vừa mới → **ところ**. 〔Un, ima hajimatta tokoro da yo.〕' },
        { q: '{一生懸命|いっしょうけんめい}{練習|れんしゅう}した（　）、{試合|しあい}に{負|ま}けてしまいました。', options: ['ので', 'から', 'のに', 'ても'], correct: 2, why: 'Đã cố vậy mà thua → **のに**. 〔Isshoukenmei renshuu shita noni…〕' },
        { q: 'この{部屋|へや}は{駅|えき}から{遠|とお}い（　）、{家賃|やちん}が{高|たか}いです。', options: ['ので', 'のに', 'ても', 'し'], correct: 1, why: 'Xa ga (kỳ vọng rẻ) vậy mà đắt → **のに**. 〔Eki kara tooi noni, yachin ga takai desu.〕' },
        { q: '{雨|あめ}が{降|ふ}って（　）、{明日|あした}のサッカーの{練習|れんしゅう}はします。', options: ['いるのに', 'も', 'しまって', 'みて'], correct: 1, why: 'Giả định tương lai + ý định → **～ても** (ポイント 121). のに không dùng cho vế sau là kế hoạch, ý chí. 〔Ame ga futte mo, renshuu wa shimasu.〕' },
        { q: '{彼|かれ}はまだ{学生|がくせい}（　）のに、{自分|じぶん}の{会社|かいしゃ}があります。', options: ['だ', 'な', 'の', 'で'], correct: 1, why: 'N + **な** + のに: {学生|がくせい}なのに. 〔Kare wa mada gakusei na noni, jibun no kaisha ga arimasu.〕' },
        { q: 'このはさみは{紙|かみ}を{切|き}る（　）{便利|べんり}です。', options: ['ので', 'のに', 'ところ', 'けど'], correct: 1, why: '**Vる + のに + {便利|べんり}** = tiện để cắt giấy (のに "dùng để" — ④′). 〔Kami o kiru noni benri desu.〕' },
      ],
    },
    {
      t: 'build',
      id: 'b19-bt-ghep',
      title: 'III. Ghép câu (8 câu)',
      items: [
        { vi: 'Tôi lỡ quên sạch cuộc hẹn với bạn.', chips: ['{友達|ともだち}との', '{約束|やくそく}を', 'すっかり', '{忘|わす}れて', 'しまいました', 'みました'], answer: ['{友達|ともだち}との', '{約束|やくそく}を', 'すっかり', '{忘|わす}れて', 'しまいました'], alt: [['すっかり', '{友達|ともだち}との', '{約束|やくそく}を', '{忘|わす}れて', 'しまいました']], ro: 'Tomodachi to no yakusoku o sukkari wasurete shimaimashita.' },
        { vi: 'Gió mạnh làm cái ô gãy mất.', chips: ['{強|つよ}い{風|かぜ}で', '{傘|かさ}が', '{折|お}れて', 'しまいました', '{傘|かさ}を', '{折|お}って'], answer: ['{強|つよ}い{風|かぜ}で', '{傘|かさ}が', '{折|お}れて', 'しまいました'], ro: 'Tsuyoi kaze de kasa ga orete shimaimashita.' },
        { vi: 'Lần sau thử để lửa nhỏ xem.', chips: ['{次|つぎ}は', '{弱|よわ}い{火|ひ}で', '{焼|や}いて', 'みて', 'しまって', '{焼|や}けて'], answer: ['{次|つぎ}は', '{弱|よわ}い{火|ひ}で', '{焼|や}いて', 'みて'], ro: 'Tsugi wa yowai hi de yaite mite.' },
        { vi: 'Cùng làm thử món Nhật không?', chips: ['{一緒|いっしょ}に', '{日本|にほん}の{料理|りょうり}を', '{作|つく}って', 'みませんか', 'しまいませんか'], answer: ['{一緒|いっしょ}に', '{日本|にほん}の{料理|りょうり}を', '{作|つく}って', 'みませんか'], alt: [['{日本|にほん}の{料理|りょうり}を', '{一緒|いっしょ}に', '{作|つく}って', 'みませんか']], ro: 'Issho ni Nihon no ryouri o tsukutte mimasen ka.' },
        { vi: 'Lúc bạn gọi điện, tôi đang tắm.', chips: ['{電話|でんわ}が', '{来|き}たとき', 'シャワーを', '{浴|あ}びている', 'ところでした', '{浴|あ}びた'], answer: ['{電話|でんわ}が', '{来|き}たとき', 'シャワーを', '{浴|あ}びている', 'ところでした'], ro: 'Denwa ga kita toki, shawaa o abite iru tokoro deshita.' },
        { vi: 'Tàu vừa mới chạy mất.', chips: ['{電車|でんしゃ}は', 'ちょうど{今|いま}', '{出|で}た', 'ところです', '{出|で}る', 'のに'], answer: ['{電車|でんしゃ}は', 'ちょうど{今|いま}', '{出|で}た', 'ところです'], alt: [['ちょうど{今|いま}', '{電車|でんしゃ}は', '{出|で}た', 'ところです']], ro: 'Densha wa choudo ima deta tokoro desu.' },
        { vi: 'Đã hẹn rồi vậy mà bạn không đến.', chips: ['{約束|やくそく}した', 'のに', '{友達|ともだち}は', '{来|き}ませんでした', 'ので', '{来|き}てみました'], answer: ['{約束|やくそく}した', 'のに', '{友達|ともだち}は', '{来|き}ませんでした'], ro: 'Yakusoku shita noni, tomodachi wa kimasen deshita.' },
        { vi: 'Đã mất công nấu vậy mà chẳng ai ăn cho.', chips: ['せっかく', '{作|つく}った', 'のに', '{誰|だれ}も', '{食|た}べて', 'くれませんでした', 'あげませんでした'], answer: ['せっかく', '{作|つく}った', 'のに', '{誰|だれ}も', '{食|た}べて', 'くれませんでした'], ro: 'Sekkaku tsukutta noni, daremo tabete kuremasen deshita.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b19-bt-doi',
      title: 'IV. Đổi câu theo yêu cầu (8 câu)',
      kind: 'fill',
      grammar: '～ました → ～てしまいました · ～てしまった ↔ ～ちゃった · tự ↔ tha khi xin lỗi · ～ている → ～ているところ · ～が → ～のに',
      items: [
        { q: '{財布|さいふ}を{落|お}としました。→ (lỡ, tiếc): {財布|さいふ}を（　）。', answers: V('{落|お}としてしまいました'), hint: 'おとして しまいました' },
        { q: '{宿題|しゅくだい}を{忘|わす}れてしまった。→ văn nói: {宿題|しゅくだい}を（　）。', answers: V('{忘|わす}れちゃった'), hint: 'てしまった → ちゃった' },
        { q: '{全部|ぜんぶ}{飲|の}んじゃった。→ dạng đầy đủ: {全部|ぜんぶ}（　）。', answers: V('{飲|の}んでしまった', '{飲|の}んでしまいました'), hint: 'じゃった → でしまった' },
        { q: '（{自分|じぶん}が{汚|よご}した）{本|ほん}が{汚|よご}れてしまいました。→ nhận lỗi: {本|ほん}を（　）。', answers: V('{汚|よご}してしまいました'), hint: 'tha động từ 汚す' },
        { q: '{今|いま}、ご{飯|はん}を{食|た}べています。→ (đang dở tay, nên chưa rảnh): {今|いま}、ご{飯|はん}を（　）。', answers: V('{食|た}べているところです', '{食|た}べているところ'), hint: 'ている + ところ' },
        { q: '{駅|えき}に{着|つ}きました。(vài giây trước) → {今|いま}、{駅|えき}に（　）。', answers: V('{着|つ}いたところです', '{着|つ}いたところ'), hint: 'た + ところ' },
        { q: '{勉強|べんきょう}しましたが、わかりませんでした。→ (bực, tiếc): （　）、わかりませんでした。', answers: V('{勉強|べんきょう}したのに'), hint: '普通形 + のに' },
        { q: '{静|しず}かです。でも、{眠|ねむ}れません。→ ghép bằng のに: （　）、{眠|ねむ}れません。', answers: V('{静|しず}かなのに'), hint: 'ナA + な + のに' },
      ],
    },
  ],
};

/* ═══════════════════════ ② THEO BUỔI TRÊN LỚP ═══════════════════════ */

const BUOI_1: Lesson = {
  id: 'b19-buoi-1-te-shimau',
  kind: 'review',
  title: 'Buổi 1 — Mở Bài 19: từ mới lỡ làm hỏng & xin lỗi · ～てしまう (xong hết / lỡ làm) · ～ちゃう・～じゃう · hội thoại ①',
  goal: 'Theo nhịp một buổi trên lớp: khởi động bằng cặp tự / tha động từ (Bài 15, 18), học từ lỡ làm hỏng và từ cảm xúc – xin lỗi, dùng ～てしまう cho hai nghĩa (xong hết / lỡ làm), xin lỗi đúng bằng tha động từ + てしまいました, nghe và nói được ～ちゃう・～じゃう, đóng vai hội thoại ①, rồi trả lời được câu giáo viên hay gọi.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 1 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Khởi động (5′)** — ôn cặp tự / tha: {割|わ}れる↔{割|わ}る, {落|お}ちる↔{落|お}とす, {汚|よご}れる↔{汚|よご}す. Câu hỏi mở đầu: "Ai làm vỡ cái đĩa?"',
        '**Từ mới (10′)** — nhóm A (lỡ làm hỏng: {失敗|しっぱい}, {間違|まちが}える, {割|わ}る, こぼす, うっかり…) + nhóm D (xin lỗi, cảm xúc: {謝|あやま}る, {申|もう}し{訳|わけ}ありません, {怒|おこ}る, {泣|な}く, がっかり…).',
        '**Ngữ pháp (15′)** — ～てしまう: ① làm xong hết · ② lỡ làm, tiếc; ～ました hay ～てしまいました; tự hay tha khi xin lỗi; dạng nói ～ちゃう・～じゃう.',
        '**Hội thoại (10′)** — ① ở quán ひまわり食堂: ナタポン nhầm món, làm vỡ đĩa, được giao làm thử món mới.',
        '**チャレンジ (10′)** — luyện cặp: báo lỗi ↔ người nghe đáp ({気|き}にしないで／{次|つぎ}から{気|き}をつけてね). Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b19-b1-slides',
      title: 'Bài 19 失敗 — Buổi 1: ～てしまう・～ちゃう',
      slides: [
        {
          tieuDe: '{第19課|だいじゅうきゅうか} {失敗|しっぱい}',
          anh: ['cross-mark', 'fork-and-knife-with-plate', 'person-bowing'],
          nhan: ['{失敗|しっぱい}', 'お{皿|さら}', '{謝|あやま}る'],
          dong: ['Hôm nay: **～てしまう · ～ちゃう · xin lỗi khi lỡ làm sai**'],
          ro: ['~te shimau · ~chau'],
          ghi: 'Bài 19 là bài "sự cố". Ai sống ở Nhật cũng có lúc lỡ làm sai — nhầm món ở chỗ làm thêm, làm vỡ đồ, quên ví. Hôm nay học câu QUAN TRỌNG NHẤT khi đó: báo lỗi bằng ～てしまいました và xin lỗi cho đúng.',
        },
        {
          tieuDe: 'できること — Học xong Bài 19 làm được gì?',
          anh: ['person-bowing', 'cooking', 'police-officer'],
          nhan: ['19-1 {謝|あやま}る', '19-2 やってみる', '19-3 {忘|わす}れ{物|もの}'],
          dong: ['① Báo lỗi, xin lỗi ở chỗ làm thêm (～てしまいました・{申|もう}し{訳|わけ}ありません).', '② Nói đang / sắp / vừa làm gì, rủ làm thử (～ところ・～てみる).', '③ Báo mất đồ, nói lời tiếc khi kết quả trái ý (～のに・～ばよかったのに).'],
          ro: ['~te shimaimashita · moushiwake arimasen', '~tokoro · ~te miru', '~noni · ~ba yokatta noni'],
          ghi: 'Ba buổi đi đúng ba phần này. Cuối Bài 19 bạn kể được 1 phút về một lần thất bại của mình: chuyện gì xảy ra, tiếc vì sao, sau đó đã thử làm gì.',
        },
        {
          tieuDe: 'Khởi động — ai làm vỡ? (tự / tha — Bài 15, 18)',
          anh: ['fork-and-knife-with-plate', 'collision'],
          nhan: ['お{皿|さら}', 'ガシャン！'],
          dong: ['お{皿|さら}が{割|わ}れました。', 'ナタポンさんがお{皿|さら}を{割|わ}りました。'],
          ro: ['Osara ga waremashita.', 'Natapon-san ga osara o warimashita.'],
          hoi: 'Hai câu khác nhau ở đâu? Câu nào cho biết AI làm vỡ?',
          dap: 'Câu 1 dùng tự động từ {割|わ}れる (đĩa vỡ — không nói ai làm). Câu 2 dùng tha động từ {割|わ}る + を — ナタポン là người làm vỡ.',
          ghi: 'Ôn kỹ cặp tự / tha vì hôm nay xin lỗi phải chọn đúng: chính mình làm thì dùng THA động từ.',
        },
        {
          tieuDe: '{新|あたら}しいことば ① — Lỡ làm hỏng',
          anh: ['collision', 'purse', 'droplet', 'jeans'],
          nhan: ['{割|わ}る', '{落|お}とす', 'こぼす', '{破|やぶ}れる'],
          dong: ['お{皿|さら}を{割|わ}る · {財布|さいふ}を{落|お}とす', 'コーヒーをこぼす · ズボンが{破|やぶ}れる'],
          ro: ['osara o waru · saifu o otosu', 'koohii o kobosu · zubon ga yabureru'],
          ghi: 'Thêm: {失敗|しっぱい}する (thất bại), ミス (lỗi nhỏ), {間違|まちが}える (nhầm), {汚|よご}す (làm bẩn), {折|お}れる (gãy), うっかり (sơ ý) ↔ わざと (cố ý). Thể て: {割|わ}って, {落|お}として, こぼして, {間違|まちが}えて.',
        },
        {
          tieuDe: '{新|あたら}しいことば ② — Xin lỗi & cảm xúc',
          anh: ['person-bowing', 'angry-face', 'loudly-crying-face', 'relieved-face'],
          nhan: ['{謝|あやま}る', '{怒|おこ}る', '{泣|な}く', 'ほっとする'],
          dong: ['{店長|てんちょう}に{謝|あやま}りました。', '{申|もう}し{訳|わけ}ありません。'],
          ro: ['Tenchou ni ayamarimashita.', 'Moushiwake arimasen.'],
          hoi: 'Lúc trực tiếp xin lỗi quản lý, có nói 「{謝|あやま}ります」 không?',
          dap: 'Không. Nói thẳng: すみません／{申|もう}し{訳|わけ}ありません. {謝|あやま}る dùng để KỂ: {店長|てんちょう}に{謝|あやま}りました.',
          ghi: 'Nhóm D: {謝|あやま}る, {申|もう}し{訳|わけ}ありません, {許|ゆる}す, {気|き}にする, {怒|おこ}る, しかる, {泣|な}く, {悲|かな}しい, がっかり, ほっと, {恥|は}ずかしい. Nhắc: {怒|おこ}る = giận (cảm xúc), しかる = mắng để dạy.',
        },
        {
          tieuDe: 'しまう — từ "cất đi" đến "xong hẳn"',
          bang: {
            head: ['', 'Câu', 'Nghĩa'],
            rows: [
              ['しまう (Bài 18)', '{服|ふく}を{押|お}し{入|い}れに**しまう**', 'cất (vào chỗ)'],
              ['～てしまう ①', '{宿題|しゅくだい}を{全部|ぜんぶ}やって**しまう**', 'làm XONG HẾT'],
              ['～てしまう ②', '{財布|さいふ}を{落|お}として**しまう**', 'LỠ làm (tiếc)'],
            ],
          },
          ghi: 'Giáo viên vẽ một cái hộp: "cất vào rồi đóng nắp lại" — việc đã xong, không quay lại được. Từ hình ảnh đó có hai nghĩa: xong hẳn, và lỡ mất rồi.',
        },
        {
          tieuDe: '① Vて しまう — làm xong hết',
          anh: ['books', 'check-mark-button'],
          nhan: ['{宿題|しゅくだい}', '{全部|ぜんぶ}！'],
          dong: ['{宿題|しゅくだい}はもう{全部|ぜんぶ}やってしまいました。', '{冷|さ}める{前|まえ}に、{食|た}べてしまいましょう。'],
          ro: ['Shukudai wa mou zenbu yatte shimaimashita.', 'Sameru mae ni, tabete shimaimashou.'],
          hoi: 'Từ nào trong câu 1 cho thấy nghĩa "xong hết"?',
          dap: '{全部|ぜんぶ} và もう — nghĩa ① thường đi với {全部|ぜんぶ}・もう・～までに・{早|はや}く.',
          ghi: '～てしまおう／～てしまいたい／～てしまってください gần như luôn là nghĩa ①: làm cho xong để khỏi vướng.',
        },
        {
          tieuDe: '② Vて しまう — lỡ … mất rồi',
          anh: ['purse', 'train', 'sleeping-face'],
          nhan: ['{財布|さいふ}', '{電車|でんしゃ}', '{寝坊|ねぼう}'],
          dong: ['{駅|えき}で{財布|さいふ}を{落|お}としてしまいました。', '{電車|でんしゃ}に{乗|の}り{遅|おく}れてしまいました。', '{授業|じゅぎょう}{中|ちゅう}に{寝|ね}てしまいました。'],
          ro: ['Eki de saifu o otoshite shimaimashita.', 'Densha ni noriokurete shimaimashita.', 'Jugyouchuu ni nete shimaimashita.'],
          hoi: 'Ba câu có điểm gì chung về cảm xúc của người nói?',
          dap: 'Đều là việc ngoài ý muốn, đã xảy ra, người nói thấy tiếc / ngại.',
          ghi: 'Nghĩa ② là nghĩa gặp nhiều nhất — trong đời sống và trong đề N4.',
        },
        {
          tieuDe: '～ました hay ～てしまいました?',
          bang: {
            head: ['Câu', 'Người nghe thấy'],
            rows: [
              ['お{皿|さら}を{割|わ}りました。', 'chỉ thông báo — hơi trơ'],
              ['お{皿|さら}を{割|わ}ってしまいました。', '"tôi lỡ làm vỡ, tôi rất tiếc" ✓'],
              ['お{皿|さら}が{割|わ}れてしまいました。', 'nếu chính bạn làm → như đổ lỗi cho cái đĩa'],
            ],
          },
          hoi: 'Bạn lỡ làm đổ cà phê lên bàn của khách. Báo với quản lý thế nào?',
          dap: '{店長|てんちょう}、すみません。お{客|きゃく}さんのテーブルにコーヒーをこぼしてしまいました。',
          ghi: 'Luật xin lỗi: THA động từ + てしまいました + すみません／{申|もう}し{訳|わけ}ありません + {次|つぎ}から{気|き}をつけます.',
        },
        {
          tieuDe: 'Khi không ai làm — tự động từ + てしまう',
          anh: ['umbrella-with-rain-drops', 'laptop'],
          nhan: ['{傘|かさ}', 'パソコン'],
          dong: ['{風|かぜ}で{傘|かさ}が{折|お}れてしまいました。', '{急|きゅう}にパソコンが{壊|こわ}れてしまいました。'],
          ro: ['Kaze de kasa ga orete shimaimashita.', 'Kyuu ni pasokon ga kowarete shimaimashita.'],
          ghi: 'Tự động từ dùng khi THẬT SỰ không ai làm (gió, tự hỏng). Bảng cặp tự / tha cuối mục Từ vựng là chỗ tra nhanh.',
        },
        {
          tieuDe: 'Văn nói — ～ちゃう・～じゃう',
          bang: {
            head: ['Đầy đủ', 'Văn nói'],
            rows: [
              ['{食|た}べてしまった', '{食|た}べ**ちゃった**'],
              ['{忘|わす}れてしまった', '{忘|わす}れ**ちゃった**'],
              ['{飲|の}んでしまった', '{飲|の}ん**じゃった**'],
              ['{行|い}ってしまった', '{行|い}っ**ちゃった**'],
              ['してしまった', 'し**ちゃった**'],
            ],
          },
          hoi: 'Đổi sang văn nói: {読|よ}んでしまった · {焦|こ}げてしまった',
          dap: '{読|よ}んじゃった (で → じゃ) · {焦|こ}げちゃった (て → ちゃ).',
          ghi: 'Thể て đuôi で (んで・いで) → じゃう. Nói với bạn bè thì dùng; với thầy cô, quản lý, khách và khi viết bài thì dùng ～てしまいました.',
        },
        {
          tieuDe: '⚠ ～ちゃった ≠ ～ちゃだめ',
          dong: ['{全部|ぜんぶ}{食|た}べちゃった。', 'まだ{食|た}べちゃだめ！'],
          ro: ['Zenbu tabechatta.', 'Mada tabecha dame!'],
          hoi: 'Câu 2 nghĩa là gì? ちゃ ở đây là gì?',
          dap: '"Chưa được ăn!" — ちゃ = ては ({食|た}べてはだめ), KHÔNG phải しまう.',
          ghi: 'Mẹo: ～ちゃう／～ちゃった／～ちゃいました = しまう; ～ちゃだめ／～ちゃいけない = ては.',
        },
        {
          tieuDe: '会話① — "Thành thật xin lỗi quý khách!"',
          anh: ['man-cook', 'man-student', 'woman'],
          nhan: ['{小林店長|こばやしてんちょう}', 'ナタポン', 'お{客|きゃく}さん'],
          dong: ['ナタポン：{注文|ちゅうもん}を{間違|まちが}えてしまいました。', 'ナタポン：お{皿|さら}を{落|お}として、{割|わ}ってしまいました。', '{店長|てんちょう}：{気|き}にしなくていいよ。{先|さき}に{片付|かたづ}けてしまおう。'],
          ro: ['Chuumon o machigaete shimaimashita.', 'Osara o otoshite, watte shimaimashita.', 'Ki ni shinakute ii yo. Saki ni katazukete shimaou.'],
          hoi: 'Trong ba câu, câu nào là ～てしまう nghĩa ① (xong hết)?',
          dap: '{片付|かたづ}けてしまおう — dọn cho xong. Hai câu của ナタポン là nghĩa ② (lỡ làm).',
          ghi: 'Đọc hội thoại ① theo vai (3 người). Cuối hội thoại quản lý nói 「{作|つく}ってみる？」 — buổi 2 sẽ học ～てみる.',
        },
        {
          tieuDe: 'チャレンジ — luyện cặp: báo lỗi ↔ đáp',
          anh: ['person-bowing', 'man-gesturing-ok'],
          nhan: ['A: {謝|あやま}る', 'B: {答|こた}える'],
          dong: ['A：すみません、{借|か}りた{傘|かさ}を{壊|こわ}してしまいました。', 'B：{気|き}にしないで。{古|ふる}い{傘|かさ}だから。', 'B：{次|つぎ}から{気|き}をつけてね。'],
          ro: ['Sumimasen, karita kasa o kowashite shimaimashita.', 'Ki ni shinaide. Furui kasa dakara.', 'Tsugi kara ki o tsukete ne.'],
          hoi: 'Đổi vai. A báo lỗi: (1) làm bẩn sách mượn (2) quên mang bài tập (3) nhầm tên bạn (4) lỡ ăn mất bánh của bạn (văn nói).',
          dap: '(1) {本|ほん}を{汚|よご}してしまいました (2) {宿題|しゅくだい}を{忘|わす}れてしまいました (3) {名前|なまえ}を{間違|まちが}えてしまいました (4) ケーキ、{食|た}べちゃった。ごめん！',
          ghi: 'Người nghe đáp: {気|き}にしないで／{大丈夫|だいじょうぶ}だよ／{次|つぎ}から{気|き}をつけてね. Người báo lỗi kết bằng: {次|つぎ}から{気|き}をつけます.',
        },
        {
          tieuDe: 'Câu hỏi cuối buổi 1',
          hoi: '(1) Báo với quản lý: lỡ làm vỡ cốc. (2) Văn nói của {飲|の}んでしまった. (3) "Tôi đã đọc hết quyển sách rồi."',
          dap: '(1) すみません、コップを{割|わ}ってしまいました。 (2) {飲|の}んじゃった (3) {本|ほん}を{全部|ぜんぶ}{読|よ}んでしまいました。',
          ghi: 'Về nhà: học thuộc 23 từ nhóm A + D, viết 5 câu báo lỗi bằng ～てしまいました (mỗi câu một động từ khác nhau).',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Khởi động: ai làm vỡ?' },
    {
      t: 'p',
      text: 'Giáo viên cầm một chiếc bút, cố ý làm rơi xuống bàn: 「ペンが＿＿」 ({落|お}ちました). Rồi hỏi cả lớp: 「{誰|だれ}が{落|お}としましたか」 → 「{先生|せんせい}がペンを＿＿」 ({落|お}としました). Sau đó giáo viên làm bộ mặt tiếc: "Khi làm rơi đồ của người khác, mình sẽ nói **{落|お}としてしまいました** — hôm nay học mẫu này."',
    },
    {
      t: 'mcq',
      id: 'b19-b1-khoi-dong',
      title: 'Khởi động — ôn tự / tha và thể て (4 câu)',
      items: [
        { q: '{風|かぜ}で{窓|まど}のガラスが（　）。', options: ['{割|わ}りました', '{割|わ}れました', '{割|わ}ってみました', '{割|わ}っておきました'], correct: 1, why: 'Không ai làm, gió làm → tự động từ **{割|わ}れる** (Bài 15). 〔Mado no garasu ga waremashita.〕' },
        { q: '{弟|おとうと}が{私|わたし}のカップを（　）。', options: ['{割|わ}れました', '{落|お}ちました', '{割|わ}りました', '{壊|こわ}れました'], correct: 2, why: 'Có người làm (弟が) + tân ngữ を → tha động từ **{割|わ}る**. 〔Otouto ga watashi no kappu o warimashita.〕' },
        { q: '「{落|お}とします」の{て形|てけい}は？', options: ['{落|お}といて', '{落|お}として', '{落|お}とって', '{落|お}とんで'], correct: 1, why: 'す → **して**: {落|お}として → {落|お}としてしまう.' },
        { q: '「{盗|ぬす}みます」の{て形|てけい}は？', options: ['{盗|ぬす}んで', '{盗|ぬす}って', '{盗|ぬす}いて', '{盗|ぬす}みて'], correct: 0, why: 'む → **んで**: {盗|ぬす}んで → {盗|ぬす}んでしまう → (văn nói) {盗|ぬす}んじゃう.' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Từ mới: phiếu báo sự cố của quán' },
    {
      t: 'table',
      caption: 'Quản lý dán "phiếu báo sự cố" (トラブル報告) lên bảng — mỗi dòng là một từ mới',
      head: ['Trên phiếu', 'Đọc', 'Nghĩa'],
      rows: [
        ['{注文|ちゅうもん}を**{間違|まちが}えた**', 'machigaeta', 'nhầm món khách gọi'],
        ['お{皿|さら}を**{割|わ}った**（{一枚|いちまい}）', 'watta', 'làm vỡ (1 cái) đĩa'],
        ['{床|ゆか}にスープを**こぼした**', 'koboshita', 'làm đổ súp xuống sàn'],
        ['お{客|きゃく}さんの{服|ふく}を**{汚|よご}した**', 'yogoshita', 'làm bẩn quần áo khách'],
        ['**うっかり**レシートを{渡|わた}さなかった', 'ukkari', 'sơ ý không đưa hoá đơn'],
        ['すぐに**{謝|あやま}った** → お{客|きゃく}さんは**{許|ゆる}して**くれた', 'ayamatta · yurushite', 'xin lỗi ngay → khách tha thứ'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{初|はじ}めてのアルバイトで、たくさん{失敗|しっぱい}しました。', 'Hajimete no arubaito de, takusan shippai shimashita.', 'Lần đầu làm thêm, tôi hỏng việc rất nhiều.'),
        E('わざとじゃないんです。うっかりしていました。', 'Wazato ja nai n desu. Ukkari shite imashita.', 'Tôi không cố ý đâu. Tại tôi sơ ý.'),
        E('{遅|おく}れて、{申|もう}し{訳|わけ}ありません。', 'Okurete, moushiwake arimasen.', 'Thành thật xin lỗi vì đến muộn.'),
        E('{店長|てんちょう}は{怒|おこ}らないで、{許|ゆる}してくれました。', 'Tenchou wa okoranaide, yurushite kuremashita.', 'Quản lý không giận mà đã tha thứ cho tôi.'),
      ],
    },
    { t: 'h', text: 'Slide 3 — ～てしまう: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b19-b1-chia',
      title: 'Luyện nhanh — chia ～てしまいました／～ちゃった (8 câu)',
      kind: 'fill',
      items: [
        { q: '{間違|まちが}える → ～てしまいました', answers: V('{間違|まちが}えてしまいました') },
        { q: '{割|わ}る → ～てしまいました', answers: V('{割|わ}ってしまいました') },
        { q: 'こぼす → ～てしまいました', answers: ['こぼしてしまいました'] },
        { q: '{泣|な}く → ～てしまいました', answers: V('{泣|な}いてしまいました') },
        { q: '{忘|わす}れる → ～ちゃった', answers: V('{忘|わす}れちゃった') },
        { q: '{読|よ}む → ～じゃった', answers: V('{読|よ}んじゃった') },
        { q: '{行|い}く → ～ちゃった', answers: V('{行|い}っちゃった') },
        { q: 'する → ～ちゃった', answers: ['しちゃった'] },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**Xin lỗi = THA động từ + てしまいました**: お{皿|さら}**を**{割|わ}ってしまいました. Dùng tự động từ khi thật sự không ai làm.',
        '**～てしまう có hai nghĩa** — xong hết ({全部|ぜんぶ}・もう) / lỡ làm (tiếc). Nhìn ngữ cảnh để hiểu.',
        '**ちゃう／じゃう** chỉ dùng khi nói thân mật; thể て đuôi で → じゃう ({飲|の}んじゃう, {読|よ}んじゃう).',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 1)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{日本|にほん}に{来|き}て、どんな{失敗|しっぱい}をしてしまいましたか。', ro: 'Nihon ni kite, donna shippai o shite shimaimashita ka.', vi: 'Sang Nhật, em đã lỡ gặp thất bại gì?' },
        { who: 'Bạn', role: 'candidate', text: '{電車|でんしゃ}を{間違|まちが}えて、{反対|はんたい}の{方|ほう}へ{行|い}ってしまいました。', ro: 'Densha o machigaete, hantai no hou e itte shimaimashita.', vi: 'Em lên nhầm tàu, lỡ đi về hướng ngược lại ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'それを{友達|ともだち}に{話|はな}すとき、どう{言|い}いますか。', ro: 'Sore o tomodachi ni hanasu toki, dou iimasu ka.', vi: 'Khi kể chuyện đó với bạn thì em nói thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{電車|でんしゃ}、{間違|まちが}えちゃった。{反対|はんたい}の{方|ほう}に{行|い}っちゃったんだ。', ro: 'Densha, machigaechatta. Hantai no hou ni itchatta n da.', vi: 'Tớ lên nhầm tàu. Đi ngược hướng mất rồi.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'アルバイトでコップを{割|わ}ってしまいました。{店長|てんちょう}に{何|なん}と{言|い}いますか。', ro: 'Arubaito de koppu o watte shimaimashita. Tenchou ni nan to iimasu ka.', vi: 'Ở chỗ làm thêm em lỡ làm vỡ cốc. Em nói gì với quản lý?' },
        { who: 'Bạn', role: 'candidate', text: '{店長|てんちょう}、すみません。コップを{割|わ}ってしまいました。{次|つぎ}から{気|き}をつけます。', ro: 'Tenchou, sumimasen. Koppu o watte shimaimashita. Tsugi kara ki o tsukemasu.', vi: 'Anh quản lý, em xin lỗi. Em lỡ làm vỡ cốc. Lần sau em sẽ cẩn thận.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「コップが{割|わ}れてしまいました」— これでもいいですか。', ro: '"Koppu ga warete shimaimashita" — kore demo ii desu ka.', vi: '"Cái cốc bị vỡ mất rồi" — nói vậy có được không?' },
        { who: 'Bạn', role: 'candidate', text: '{自分|じぶん}が{割|わ}ったときは、「コップを{割|わ}ってしまいました」のほうがいいです。', ro: 'Jibun ga watta toki wa, "koppu o watte shimaimashita" no hou ga ii desu.', vi: 'Khi chính mình làm vỡ thì nói "em lỡ làm vỡ cốc" tốt hơn ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{今日|きょう}{中|じゅう}にしてしまいたいことは{何|なん}ですか。', ro: 'Kyoujuu ni shite shimaitai koto wa nan desu ka.', vi: 'Việc em muốn làm cho xong trong hôm nay là gì?' },
        { who: 'Bạn', role: 'candidate', text: 'レポートを{書|か}いてしまいたいです。{明日|あした}はアルバイトがありますから。', ro: 'Repooto o kaite shimaitai desu. Ashita wa arubaito ga arimasu kara.', vi: 'Em muốn viết xong báo cáo ạ. Vì mai em có ca làm thêm.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b19-b1-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: 'すみません、{借|か}りた{本|ほん}を{汚|よご}して（　）。', options: ['みました', 'おきました', 'しまいました', 'ありました'], correct: 2, why: 'Lỡ làm bẩn + xin lỗi → **～てしまいました**. 〔Karita hon o yogoshite shimaimashita.〕' },
        { q: '{宿題|しゅくだい}は{一時間|いちじかん}で{全部|ぜんぶ}やって（　）。', options: ['しまいました', 'みました', 'いました', 'ありました'], correct: 0, why: 'Làm xong hết ({全部|ぜんぶ}) → **～てしまいました** (nghĩa ①). 〔Zenbu yatte shimaimashita.〕' },
        { q: '（{自分|じぶん}が{割|わ}った）{店長|てんちょう}、すみません。グラス（　）{割|わ}ってしまいました。', options: ['が', 'を', 'に', 'は'], correct: 1, why: 'Nhận lỗi → tha động từ {割|わ}る + **を**. 〔Gurasu o watte shimaimashita.〕' },
        { q: 'あ、{電車|でんしゃ}が{行|い}っ（　）。', options: ['ちゃった', 'じゃった', 'てみた', 'ておいた'], correct: 0, why: '{行|い}ってしまった → **{行|い}っちゃった** (て → ちゃ). 〔A, densha ga itchatta.〕' },
        { q: 'ジュースを{全部|ぜんぶ}{飲|の}ん（　）。ごめんね。', options: ['ちゃった', 'じゃった', 'でおいた', 'でみた'], correct: 1, why: '{飲|の}んでしまった → **{飲|の}んじゃった** (で → じゃ). 〔Juusu o zenbu nonjatta.〕' },
      ],
    },
  ],
};

const BUOI_2: Lesson = {
  id: 'b19-buoi-2-te-miru-tokoro',
  kind: 'review',
  title: 'Buổi 2 — Lần đầu nấu thử: từ mới nấu ăn · ～てみる (thử làm) · ～ところ (sắp・đang・vừa) · hội thoại ②',
  goal: 'Theo nhịp một buổi trên lớp: ôn ～てしまう, học từ nấu ăn (試す・混ぜる・焦げる・味見する・温める・冷める), nói làm thử bằng ～てみる ở mọi dạng (～てみたい・～てみてください・～てみよう・～てみたら？), chọn đúng ba ところ theo đường thời gian, đóng vai hội thoại ②, rồi trả lời được câu giáo viên hay gọi.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 2 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Ôn buổi 1 (5′)** — báo lỗi bằng tha động từ + てしまいました; đổi ～てしまった ↔ ～ちゃった.',
        '**Từ mới (10′)** — nhóm C (nấu ăn: {試|ため}す, レシピ, {混|ま}ぜる, {焦|こ}げる, {味見|あじみ}する, {温|あたた}める, {冷|さ}める, {生|なま}).',
        '**Ngữ pháp ① (10′)** — ～てみる: làm thử; ～てみたい／～てみてください／～てみよう／～てみたら？; ～てみる khác {試|ため}す.',
        '**Ngữ pháp ② (10′)** — ～ところ trên đường thời gian: Vる (sắp) · Vている (đang) · Vた (vừa xong); ～ところでした.',
        '**Hội thoại + チャレンジ (15′)** — ② パク lần đầu làm お好み焼き; luyện cặp gọi điện "đang làm gì?". Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b19-b2-slides',
      title: 'Bài 19 失敗 — Buổi 2: ～てみる・～ところ',
      slides: [
        {
          tieuDe: '{第19課|だいじゅうきゅうか} — {今日|きょう}は「やってみる」',
          anh: ['cooking', 'test-tube', 'hourglass-not-done'],
          nhan: ['{料理|りょうり}', '{試|ため}す', '{時間|じかん}'],
          dong: ['Hôm nay: **～てみる (làm thử) · ～ところ (sắp・đang・vừa)**'],
          ro: ['~te miru · ~tokoro'],
          ghi: 'Buổi 1 là "lỡ làm sai". Buổi 2 là bước tiếp theo: dám THỬ lại (～てみる), và nói cho người khác biết mình đang ở đâu trong việc đó (～ところ).',
        },
        {
          tieuDe: 'Ôn buổi 1 — báo lỗi',
          anh: ['droplet', 'person-bowing'],
          nhan: ['こぼす', '{謝|あやま}る'],
          dong: ['{店長|てんちょう}、すみません。スープをこぼしてしまいました。'],
          ro: ['Tenchou, sumimasen. Suupu o koboshite shimaimashita.'],
          hoi: 'Nói lại câu này với bạn thân (văn nói).',
          dap: 'ごめん、スープ、こぼしちゃった。',
          ghi: 'Gọi 3–4 bạn đổi động từ: {割|わ}る → {割|わ}っちゃった, {忘|わす}れる → {忘|わす}れちゃった, {飲|の}む → {飲|の}んじゃった.',
        },
        {
          tieuDe: '{新|あたら}しいことば — Nấu ăn',
          anh: ['bowl-with-spoon', 'fire', 'spoon', 'steaming-bowl'],
          nhan: ['{混|ま}ぜる', '{焦|こ}げる', '{味見|あじみ}する', '{温|あたた}める'],
          dong: ['{卵|たまご}と{牛乳|ぎゅうにゅう}を{混|ま}ぜます。', '{火|ひ}が{強|つよ}すぎて、{焦|こ}げてしまいました。'],
          ro: ['Tamago to gyuunyuu o mazemasu.', 'Hi ga tsuyosugite, kogete shimaimashita.'],
          hoi: 'Cà phê nóng để lâu thì nó thế nào? Bia để tủ lạnh thì thế nào?',
          dap: 'コーヒーが{冷|さ}めます (nóng → nguội). ビールが{冷|ひ}えます (thành lạnh).',
          ghi: 'Thêm: {試|ため}す (thử một cách làm), レシピ (công thức — レシピのとおりに), {生|なま} (sống, chưa chín). ⚠ Đồ ăn cháy khét = {焦|こ}げる; nhà cháy = {燃|も}える.',
        },
        {
          tieuDe: '② Vて みる — làm thử (để biết thế nào)',
          anh: ['bento-box', 't-shirt', 'telephone-receiver'],
          nhan: ['{食|た}べてみる', '{着|き}てみる', '{聞|き}いてみる'],
          dong: ['{初|はじ}めて{納豆|なっとう}を{食|た}べてみました。', 'このシャツ、{着|き}てみてもいいですか。'],
          ro: ['Hajimete nattou o tabete mimashita.', 'Kono shatsu, kite mite mo ii desu ka.'],
          hoi: 'Trước khi "ăn thử", bạn đã biết natto ngon hay không chưa?',
          dap: 'Chưa — ～てみる dùng khi CHƯA biết kết quả, làm để biết.',
          ghi: 'みる gốc là {見|み}る (xem): làm rồi "xem" kết quả ra sao. Viết みる bằng hiragana.',
        },
        {
          tieuDe: '～てみる chia đủ kiểu — chép vào vở',
          bang: {
            head: ['Dạng', 'Câu', 'Dùng khi'],
            rows: [
              ['～てみたい', '{一度|いちど}{着物|きもの}を{着|き}てみたい。', 'mong trải nghiệm'],
              ['～てみてください', 'これ、{食|た}べてみてください。', 'mời / khuyên thử'],
              ['～てみてもいいですか', '{使|つか}ってみてもいいですか。', 'xin phép thử'],
              ['～てみよう／～てみませんか', '{一緒|いっしょ}に{作|つく}ってみよう。', 'rủ thử'],
              ['～てみたら？', '{先生|せんせい}に{聞|き}いてみたら？', 'khuyên bạn'],
            ],
          },
          ghi: 'Mọi dạng đều là chia động từ みる (nhóm 2) — không có gì mới, chỉ ghép những thứ đã học: たい, てください, てもいい, thể ý chí, ませんか, たら.',
        },
        {
          tieuDe: '⚠ ～てみる và {試|ため}す',
          dong: ['{新|あたら}しい{方法|ほうほう}を{試|ため}します。', '{新|あたら}しい{方法|ほうほう}でやってみます。'],
          ro: ['Atarashii houhou o tameshimasu.', 'Atarashii houhou de yatte mimasu.'],
          hoi: 'Câu nào sai? ① {食|た}べを{試|ため}す ② {食|た}べてみる ③ {雨|あめ}が{降|ふ}ってみる',
          dap: '① sai ({試|ため}す cần danh từ: {新|あたら}しい{味|あじ}を{試|ため}す) · ② đúng · ③ sai (～てみる chỉ cho việc người làm chủ ý làm được).',
          ghi: 'Ghép được: {試|ため}してみる = thử áp dụng xem.',
        },
        {
          tieuDe: '③ ～ところ — ba thời điểm',
          bang: {
            head: ['', 'Công thức', 'Câu'],
            rows: [
              ['TRƯỚC', 'Vる ＋ ところ', '{今|いま}から{食|た}べる**ところ**です。'],
              ['ĐANG', 'Vている ＋ ところ', '{今|いま}{食|た}べている**ところ**です。'],
              ['SAU', 'Vた ＋ ところ', '{今|いま}{食|た}べた**ところ**です。'],
            ],
          },
          ghi: 'Giáo viên vẽ một mũi tên thời gian trên bảng và ba chấm: ngay trước — ở giữa — ngay sau một hành động. ところ = "chỗ" trên đường thời gian. Chỉ dùng cho thời điểm RẤT GẦN bây giờ.',
        },
        {
          tieuDe: '③a Vる ところ — sắp sửa',
          anh: ['door', 'person-running'],
          nhan: ['{出|で}かける', '{急|いそ}ぐ'],
          dong: ['{今|いま}から{出|で}かけるところです。', 'ちょうど{今|いま}、{電話|でんわ}しようと{思|おも}っていたところです。'],
          ro: ['Ima kara dekakeru tokoro desu.', 'Choudo ima, denwa shiyou to omotte ita tokoro desu.'],
          hoi: '{今|いま}から{出|で}かけるところです khác {出|で}かけるつもりです (Bài 16) thế nào?',
          dap: 'ところ = ngay bây giờ, sát giờ; つもり = kế hoạch, có thể còn lâu.',
          ghi: 'Câu thứ hai rất hay nghe khi người kia gọi trước: "Mình cũng đang định gọi cho cậu đây!"',
        },
        {
          tieuDe: '③b Vている ところ — đang đúng lúc',
          anh: ['cooking', 'magnifying-glass-tilted-left'],
          nhan: ['{作|つく}っている', '{探|さが}している'],
          dong: ['{今|いま}、{料理|りょうり}を{作|つく}っているところだから、あとで{電話|でんわ}するね。', '{電話|でんわ}が{来|き}たとき、シャワーを{浴|あ}びているところでした。'],
          ro: ['Ima, ryouri o tsukutte iru tokoro dakara, ato de denwa suru ne.', 'Denwa ga kita toki, shawaa o abite iru tokoro deshita.'],
          hoi: 'Vì sao câu 1 dùng ～ているところ mà không chỉ ～ている?',
          dap: 'Để nhấn mạnh "đang dở tay ĐÚNG LÚC này" → giải thích vì sao chưa nói chuyện được.',
          ghi: 'Quá khứ ～ところでした = "lúc đó đang…" — rất hay dùng với ～とき.',
        },
        {
          tieuDe: '③c Vた ところ — vừa mới xong',
          anh: ['station', 'house'],
          nhan: ['{着|つ}いた', '{帰|かえ}った'],
          dong: ['ちょうど{今|いま}、{駅|えき}に{着|つ}いたところです。', 'さっき{家|いえ}に{帰|かえ}ってきたところです。'],
          ro: ['Choudo ima, eki ni tsuita tokoro desu.', 'Sakki ie ni kaette kita tokoro desu.'],
          hoi: '「{去年|きょねん}{日本|にほん}に{来|き}たところです」 — được không?',
          dap: 'Không. ところ chỉ cho vài phút trước. "Mới sang Nhật ít lâu" dùng ～たばかり (Bài 22).',
          ghi: 'Hay đi với ちょうど{今|いま}・{今|いま}・さっき.',
        },
        {
          tieuDe: '⚠ ところ không phải lúc nào cũng là "thời điểm"',
          dong: ['{焦|こ}げたところを{取|と}ります。', '{今|いま}、{焦|こ}げたところです。'],
          ro: ['Kogeta tokoro o torimasu.', 'Ima, kogeta tokoro desu.'],
          hoi: 'Hai câu nghĩa khác nhau thế nào?',
          dap: 'Câu 1: "bỏ CHỖ bị cháy đi" (ところ = chỗ, có を đi sau). Câu 2: "vừa mới bị cháy" (ところ + です = thời điểm).',
          ghi: 'Mẹo: ところ + です／だ → thời điểm; ところ + を／に／が → "chỗ".',
        },
        {
          tieuDe: '会話② — "Đang làm gì đấy?"',
          anh: ['woman-student', 'woman-student', 'man-student'],
          nhan: ['ワン', 'パク', 'ダニエル'],
          dong: ['ワン：{今|いま}{何|なに}をしているところ？', 'パク：キャベツを{切|き}っているところ。お{好|この}み{焼|や}きを{作|つく}ってみようと{思|おも}って。', 'ダニエル：ちょうど{今|いま}、{着|つ}いたところです。'],
          ro: ['Ima nani o shite iru tokoro?', 'Kyabetsu o kitte iru tokoro. Okonomiyaki o tsukutte miyou to omotte.', 'Choudo ima, tsuita tokoro desu.'],
          hoi: 'Tìm trong hội thoại ② một câu ～てしまう dạng nói và một câu ～てみる dạng khuyên.',
          dap: '{入|い}れちゃった／{焦|こ}げちゃった · {弱|よわ}い{火|ひ}で{焼|や}いてみて.',
          ghi: 'Đọc hội thoại ② theo vai (3 người). Chú ý câu {焦|こ}げたところは{取|と}ればいい — ところ = "chỗ".',
        },
        {
          tieuDe: 'チャレンジ — gọi điện: "Đang làm gì đấy?"',
          anh: ['mobile-phone', 'mobile-phone'],
          nhan: ['A', 'B'],
          dong: ['A：もしもし、{今|いま}{何|なに}をしているところ？', 'B：{今|いま}、{晩|ばん}ご{飯|はん}を{作|つく}っているところ。', 'A：じゃ、{終|お}わったら{電話|でんわ}して。'],
          ro: ['Moshimoshi, ima nani o shite iru tokoro?', 'Ima, bangohan o tsukutte iru tokoro.', 'Ja, owattara denwa shite.'],
          hoi: 'Đổi vai, B trả lời theo thẻ: (1) sắp ra khỏi nhà (2) đang làm bài tập (3) vừa về đến nhà (4) vừa ăn xong.',
          dap: '(1) {今|いま}から{家|いえ}を{出|で}るところ (2) {今|いま}{宿題|しゅくだい}をしているところ (3) {今|いま}{帰|かえ}ってきたところ (4) {今|いま}{食|た}べたところ',
          ghi: 'Sau đó A rủ thử: {今度|こんど}、{一緒|いっしょ}に～てみない？ — B đáp: いいね、やってみよう！',
        },
        {
          tieuDe: 'Câu hỏi cuối buổi 2',
          hoi: '(1) Xin mặc thử áo. (2) Khuyên bạn thử hỏi thầy. (3) "Tôi vừa mới tới ga." (4) "Lúc đó tôi đang ngủ."',
          dap: '(1) これ、{着|き}てみてもいいですか。 (2) {先生|せんせい}に{聞|き}いてみたら？ (3) {今|いま}、{駅|えき}に{着|つ}いたところです。 (4) そのとき、{寝|ね}ているところでした。',
          ghi: 'Về nhà: học thuộc 8 từ nhóm C, viết 3 câu ～てみたい và 3 câu với ba ところ về một ngày của mình.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Ôn buổi 1' },
    {
      t: 'mcq',
      id: 'b19-b2-on',
      title: 'Ôn buổi 1 — ～てしまう (4 câu)',
      items: [
        { q: '{急|いそ}いでいたので、{財布|さいふ}を{家|いえ}に{忘|わす}れて（　）。', options: ['みました', 'しまいました', 'いるところです', 'おきました'], correct: 1, why: 'Lỡ quên → **～てしまいました**. 〔Saifu o ie ni wasurete shimaimashita.〕' },
        { q: '{嫌|いや}な{仕事|しごと}は{早|はや}くやって（　）。', options: ['しまおう', 'みよう', 'あろう', 'いよう'], correct: 0, why: 'Làm cho xong → **～てしまおう** (nghĩa ①). 〔Hayaku yatte shimaou.〕' },
        { q: '{弟|おとうと}が{私|わたし}のお{菓子|かし}を{食|た}べ（　）。', options: ['じゃった', 'ちゃった', 'てみた', 'たところ'], correct: 1, why: '{食|た}べてしまった → **{食|た}べちゃった**. 〔Otouto ga watashi no okashi o tabechatta.〕' },
        { q: '（{自分|じぶん}が{落|お}とした）すみません、スマホ（　）{落|お}としてしまいました。', options: ['が', 'を', 'に', 'で'], correct: 1, why: 'Tha động từ {落|お}とす + **を** (nhận lỗi). 〔Sumaho o otoshite shimaimashita.〕' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Một chiều thứ Bảy của パク (đường thời gian)' },
    {
      t: 'canh',
      anh: ['woman-student', 'cooking', 'fire', 'man-student'],
      caption: 'Giáo viên dán lên bảng "lịch" chiều thứ Bảy của パク theo từng phút và hỏi: lúc X giờ, パク sắp / đang / vừa làm gì?',
    },
    {
      t: 'table',
      caption: 'Lịch của パク — mỗi mốc giờ là một câu ～ところ',
      head: ['Giờ', 'Việc', 'Câu ～ところ', 'Romaji'],
      rows: [
        ['3:00', 'chuẩn bị thái bắp cải', '{今|いま}からキャベツを{切|き}るところです。', 'Ima kara kyabetsu o kiru tokoro desu.'],
        ['3:05', 'đang thái', '{今|いま}、キャベツを{切|き}っているところです。', 'Ima, kyabetsu o kitte iru tokoro desu.'],
        ['3:15', 'thái xong', '{今|いま}、キャベツを{切|き}ったところです。', 'Ima, kyabetsu o kitta tokoro desu.'],
        ['3:30', 'đang rán cái thứ nhất', '{今|いま}、{一枚目|いちまいめ}を{焼|や}いているところです。', 'Ima, ichimaime o yaite iru tokoro desu.'],
        ['3:40', 'vừa cháy mất', 'あっ、{焦|こ}げちゃった！', 'A, kogechatta!'],
        ['4:00', 'ダニエル vừa tới', 'ダニエルさんが{今|いま}{着|つ}いたところです。', 'Danieru-san ga ima tsuita tokoro desu.'],
      ],
    },
    { t: 'h', text: 'Slide 3 — ～てみる・～ところ: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b19-b2-chia',
      title: 'Luyện nhanh — ～てみる và ba ところ (8 câu)',
      kind: 'fill',
      items: [
        { q: '{食|た}べる → ～てみたいです', answers: V('{食|た}べてみたいです') },
        { q: '{使|つか}う → ～てみてもいいですか', answers: V('{使|つか}ってみてもいいですか') },
        { q: '{作|つく}る → ～てみよう', answers: V('{作|つく}ってみよう') },
        { q: '{調|しら}べる → ～てみたら？', answers: V('{調|しら}べてみたら') },
        { q: '{寝|ね}る → sắp (～ところです)', answers: V('{寝|ね}るところです') },
        { q: '{書|か}く → đang (～ところです)', answers: V('{書|か}いているところです') },
        { q: '{終|お}わる → vừa xong (～ところです)', answers: V('{終|お}わったところです') },
        { q: '{浴|あ}びる → lúc đó đang (～ところでした)', answers: V('{浴|あ}びているところでした') },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**～てみる** = thử để biết kết quả; chỉ dùng cho việc chủ ý làm được; みる viết hiragana.',
        '**Ba ところ**: Vる (sắp) — Vている (đang) — Vた (vừa xong); chỉ cho thời điểm sát bây giờ. Nghe kỹ đuôi động từ trước ところ.',
        '**ところ + を／に／が** thường là "chỗ" (danh từ); **ところ + です／だ／でした** mới là mẫu thời điểm.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 2)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{日本|にほん}で{何|なに}を{食|た}べてみたいですか。', ro: 'Nihon de nani o tabete mitai desu ka.', vi: 'Ở Nhật em muốn ăn thử món gì?' },
        { who: 'Bạn', role: 'candidate', text: 'お{好|この}み{焼|や}きを{食|た}べてみたいです。{自分|じぶん}でも{作|つく}ってみたいです。', ro: 'Okonomiyaki o tabete mitai desu. Jibun demo tsukutte mitai desu.', vi: 'Em muốn ăn thử okonomiyaki. Em cũng muốn tự làm thử ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{友達|ともだち}が「{日本語|にほんご}が{上手|じょうず}にならない」と{言|い}っています。アドバイスしてください。', ro: 'Tomodachi ga "nihongo ga jouzu ni naranai" to itte imasu. Adobaisu shite kudasai.', vi: 'Bạn em than "tiếng Nhật mãi không giỏi lên". Em khuyên bạn đi.' },
        { who: 'Bạn', role: 'candidate', text: '{日本|にほん}のドラマを{毎日|まいにち}{見|み}てみたら？{楽|たの}しいし、{聞|き}く{練習|れんしゅう}になるよ。', ro: 'Nihon no dorama o mainichi mite mitara? Tanoshii shi, kiku renshuu ni naru yo.', vi: 'Cậu thử mỗi ngày xem phim truyền hình Nhật xem? Vừa vui vừa luyện nghe được.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '（{電話|でんわ}で）もしもし、{今|いま}{何|なに}をしているところですか。', ro: '(Denwa de) Moshimoshi, ima nani o shite iru tokoro desu ka.', vi: '(Qua điện thoại) A lô, em đang làm gì đấy?' },
        { who: 'Bạn', role: 'candidate', text: '{今|いま}、{駅|えき}で{電車|でんしゃ}を{待|ま}っているところです。', ro: 'Ima, eki de densha o matte iru tokoro desu.', vi: 'Em đang đợi tàu ở ga ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'じゃ、もう{授業|じゅぎょう}は{終|お}わりましたか。', ro: 'Ja, mou jugyou wa owarimashita ka.', vi: 'Vậy giờ học xong chưa?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、さっき{終|お}わったところです。', ro: 'Hai, sakki owatta tokoro desu.', vi: 'Dạ, vừa xong lúc nãy ạ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b19-b2-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: 'このパン、おいしいですよ。ちょっと{食|た}べて（　）ください。', options: ['しまって', 'みて', 'おいて', 'いて'], correct: 1, why: 'Mời ăn thử → **～てみてください**. 〔Chotto tabete mite kudasai.〕' },
        { q: 'わからないことは、{先生|せんせい}に{聞|き}いて（　）？', options: ['みたら', 'しまったら', 'いたら', 'あったら'], correct: 0, why: 'Khuyên → **～てみたら？** 〔Sensei ni kiite mitara?〕' },
        { q: 'A「もう{寝|ね}た？」 B「ううん、これから（　）ところ。」', options: ['{寝|ね}た', '{寝|ね}る', '{寝|ね}ている', '{寝|ね}て'], correct: 1, why: 'これから (sắp) → **Vる + ところ**. 〔Korekara neru tokoro.〕' },
        { q: '{今|いま}、レポートを{書|か}いて（　）ところなので、あとで{話|はな}しましょう。', options: ['しまう', 'みる', 'いる', 'おく'], correct: 2, why: 'Đang dở tay → **Vている + ところ**. 〔Repooto o kaite iru tokoro na node…〕' },
        { q: 'A「{会議|かいぎ}、{始|はじ}まった？」 B「うん、{今|いま}{始|はじ}まった（　）。」', options: ['ところ', 'みた', 'しまう', 'のに'], correct: 0, why: '{今|いま} + Vた → vừa mới → **ところ**. 〔Un, ima hajimatta tokoro.〕' },
      ],
    },
  ],
};

const BUOI_3: Lesson = {
  id: 'b19-buoi-3-noni',
  kind: 'review',
  title: 'Buổi 3 — Để quên ví trên tàu: từ mới mất đồ & lý do · ～のに · ～ばよかったのに · せっかく～のに · hội thoại ③ · kể 1 phút',
  goal: 'Theo nhịp một buổi trên lớp: ôn ～てみる và ba ところ, học từ mất đồ – tìm đồ và từ lý do – thời gian, nối hai vế trái kỳ vọng bằng ～のに (đúng cách chia なのに), nói lời tiếc bằng ～ばよかったのに và せっかく～のに, biết khi nào KHÔNG được dùng のに (vế sau là ý chí), phân biệt với ～ても・～けど và のに "dùng để", đóng vai hội thoại ③ rồi kể 1 phút một lần thất bại.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 3 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Ôn buổi 2 (5′)** — ～てみる (thử) và ba ところ (sắp / đang / vừa).',
        '**Từ mới (10′)** — nhóm B (mất đồ: {落|お}とし{物|もの}, {拾|ひろ}う, {見|み}つかる／{見|み}つける, {気|き}がつく, {警察|けいさつ}, お{巡|まわ}りさん…) + nhóm E ({理由|りゆう}, {寝坊|ねぼう}, {乗|の}り{遅|おく}れる, {途中|とちゅう}, ちゃんと, せっかく…).',
        '**Ngữ pháp (15′)** — ～のに: vậy mà (trái kỳ vọng); cách nối (なのに); ～のに cuối câu, ～ばよかったのに, せっかく～のに; luật vế sau; のに vs ても vs けど; のに "dùng để".',
        '**Hội thoại (10′)** — ③ メアリー báo mất ví ở quầy nhà ga, rồi nhận điện thoại của đồn cảnh sát.',
        '**Tổng kết + できる！ (10′)** — bảng bốn mẫu của bài, kể 1 phút "Một lần thất bại của tôi". Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b19-b3-slides',
      title: 'Bài 19 失敗 — Buổi 3: ～のに',
      slides: [
        {
          tieuDe: '{第19課|だいじゅうきゅうか} — {今日|きょう}は「～のに」',
          anh: ['purse', 'train', 'disappointed-face'],
          nhan: ['{財布|さいふ}', '{電車|でんしゃ}', 'がっかり'],
          dong: ['Hôm nay: **～のに (vậy mà) · ～ばよかったのに · せっかく～のに**'],
          ro: ['~noni · ~ba yokatta noni · sekkaku ~noni'],
          ghi: 'Buổi cuối của Bài 19: mẫu ～のに — câu "than" của tiếng Nhật. Đã cố gắng vậy mà kết quả trái ý. Rất hay nghe trong đời sống, phim, và rất hay vào đề N4 (kèm bẫy).',
        },
        {
          tieuDe: 'Ôn buổi 2 — thử & ba ところ',
          anh: ['cooking', 'hourglass-not-done'],
          nhan: ['やってみる', 'ところ'],
          dong: ['A：もう{家|いえ}を{出|で}た？', 'B：ううん、{今|いま}から{出|で}るところ。'],
          ro: ['Mou ie o deta?', 'Uun, ima kara deru tokoro.'],
          hoi: 'B vừa ra khỏi nhà. B trả lời thế nào? Và nếu B đang đi giày?',
          dap: 'うん、{今|いま}{出|で}たところ。／{今|いま}、{靴|くつ}をはいているところ。',
          ghi: 'Gọi 2–3 bạn: "Cuối tuần này em muốn thử làm gì?" → ～てみたいです.',
        },
        {
          tieuDe: '{新|あたら}しいことば ① — Mất đồ & tìm đồ',
          anh: ['purse', 'magnifying-glass-tilted-left', 'police-officer', 'light-bulb'],
          nhan: ['{落|お}とし{物|もの}', '{見|み}つける', 'お{巡|まわ}りさん', '{気|き}がつく'],
          dong: ['{道|みち}で{財布|さいふ}を{拾|ひろ}って、{交番|こうばん}に{届|とど}けました。', '{家|いえ}に{帰|かえ}ってから、{鍵|かぎ}がないことに{気|き}がつきました。'],
          ro: ['Michi de saifu o hirotte, kouban ni todokemashita.', 'Ie ni kaette kara, kagi ga nai koto ni ki ga tsukimashita.'],
          hoi: 'Điền: {鍵|かぎ}を{探|さが}しました。でも、{鍵|かぎ}が（　）。',
          dap: '{見|み}つかりませんでした (tự động từ — chìa khoá không được tìm thấy). ~~{探|さが}せませんでした~~ sai.',
          ghi: 'Thêm: {警察|けいさつ} (cảnh sát — 110), {泥棒|どろぼう} (kẻ trộm), {盗|ぬす}む (lấy cắp), さっき (lúc nãy), やっと (cuối cùng thì).',
        },
        {
          tieuDe: '{新|あたら}しいことば ② — Lý do & thời gian',
          anh: ['sleeping-face', 'train', 'alarm-clock'],
          nhan: ['{寝坊|ねぼう}する', '{乗|の}り{遅|おく}れる', '{急|きゅう}に'],
          dong: ['{寝坊|ねぼう}して、{電車|でんしゃ}に{乗|の}り{遅|おく}れてしまいました。', '{学校|がっこう}へ{行|い}く{途中|とちゅう}で、{忘|わす}れ{物|もの}に{気|き}がつきました。'],
          ro: ['Nebou shite, densha ni noriokurete shimaimashita.', 'Gakkou e iku tochuu de, wasuremono ni ki ga tsukimashita.'],
          ghi: 'Thêm: {理由|りゆう} (lý do), すっかり (sạch trơn — すっかり{忘|わす}れてしまった), ちゃんと (cẩn thận, đàng hoàng), せっかく (đã mất công) — せっかく gần như luôn đi với ～のに hôm nay.',
        },
        {
          tieuDe: '④ ～のに — "vậy mà"',
          anh: ['books', 'cross-mark'],
          nhan: ['{勉強|べんきょう}した', '{落|お}ちた'],
          dong: ['{毎日|まいにち}{勉強|べんきょう}したのに、{試験|しけん}に{落|お}ちてしまいました。', '{急|いそ}いだのに、{電車|でんしゃ}に{乗|の}り{遅|おく}れました。'],
          ro: ['Mainichi benkyou shita noni, shiken ni ochite shimaimashita.', 'Isoida noni, densha ni noriokuremashita.'],
          hoi: 'Từ vế A ("ngày nào cũng học"), người ta CHỜ ĐỢI kết quả gì? Kết quả thật thế nào?',
          dap: 'Chờ đợi: thi đỗ. Thật: thi trượt → trái kỳ vọng → のに (+ cảm giác tiếc, bực).',
          ghi: 'のに = が／けど + CẢM XÚC. Người nói không chỉ nối hai ý, mà còn "than".',
        },
        {
          tieuDe: 'Cách nối ～のに — chép vào vở',
          bang: {
            head: ['Loại từ', 'Hiện tại', 'Quá khứ'],
            rows: [
              ['Động từ', '{行|い}く**のに**', '{行|い}った**のに**'],
              ['Tính từ い', '{高|たか}い**のに**', '{高|たか}かった**のに**'],
              ['Tính từ な', '{便利|べんり}**な**のに', '{便利|べんり}だった**のに**'],
              ['Danh từ', '{日曜日|にちようび}**な**のに', '{日曜日|にちようび}だった**のに**'],
            ],
          },
          hoi: 'Nối: {静|しず}かだ ＋ のに · {学生|がくせい}だ ＋ のに',
          dap: '{静|しず}か**な**のに · {学生|がくせい}**な**のに — không nói ~~{静|しず}かだのに~~.',
          ghi: 'Cùng luật với ～ので ({雨|あめ}なので, {静|しず}かなので): ナA và N hiện tại khẳng định dùng な.',
        },
        {
          tieuDe: '～ばよかったのに — "giá mà…"',
          anh: ['umbrella-with-rain-drops', 'pensive-face'],
          nhan: ['{雨|あめ}', '{後悔|こうかい}'],
          dong: ['{傘|かさ}を{持|も}ってくればよかったのに。', 'もっと{早|はや}く{言|い}ってくれればよかったのに。'],
          ro: ['Kasa o motte kureba yokatta noni.', 'Motto hayaku itte kurereba yokatta noni.'],
          hoi: 'Câu 2 nói với bạn — bạn ấy sẽ cảm thấy thế nào?',
          dap: 'Bị trách nhẹ ("sao không nói sớm"). Nói với người trên thì tránh.',
          ghi: 'Ghép ～ば (Bài 17) + よかった + のに. Tự tiếc: かばんに{入|い}れておけばよかったのに (hội thoại ③).',
        },
        {
          tieuDe: 'せっかく～のに — "đã mất công … vậy mà"',
          anh: ['cooking', 'disappointed-face'],
          nhan: ['{作|つく}った', 'がっかり'],
          dong: ['せっかく{作|つく}ったのに、{誰|だれ}も{食|た}べてくれませんでした。', 'せっかく{来|き}たのに、{店|みせ}が{休|やす}みでした。'],
          ro: ['Sekkaku tsukutta noni, daremo tabete kuremasen deshita.', 'Sekkaku kita noni, mise ga yasumi deshita.'],
          ghi: 'せっかく nhấn mạnh công sức / cơ hội. Bạn nghe câu này → đáp đồng cảm: {残念|ざんねん}だったね／それはがっかりだね.',
        },
        {
          tieuDe: '⚠ Vế sau のに KHÔNG phải ý muốn, lời rủ, lời nhờ',
          dong: ['~~{雨|あめ}なのに、{出|で}かけましょう。~~', '{雨|あめ}だけど、{出|で}かけましょう。', '{雨|あめ}が{降|ふ}っても、{出|で}かけます。'],
          ro: ['—', 'Ame da kedo, dekakemashou.', 'Ame ga futte mo, dekakemasu.'],
          hoi: 'Sửa câu sai: {高|たか}いのに、{買|か}いたいです。',
          dap: '{高|たか}いけど、{買|か}いたいです。／{高|たか}くても、{買|か}いたいです。',
          ghi: 'のに nói về kết quả ĐÃ THẤY. Ý định, mong muốn, lời rủ, lời nhờ → dùng けど／が／ても.',
        },
        {
          tieuDe: 'のに · ても · けど — bảng phân biệt',
          bang: {
            head: ['Mẫu', 'Nghĩa', 'Vế sau ý chí?'],
            rows: [
              ['～のに', 'vậy mà (+ than)', '✗'],
              ['～ても (ポイント 121)', 'dù có… vẫn', '✓'],
              ['～けど／～が', 'nhưng (trung tính)', '✓'],
              ['～ので', 'vì (ngược hướng)', '✓'],
            ],
          },
          hoi: 'Chọn: {一生懸命|いっしょうけんめい}{練習|れんしゅう}した（のに／ので）、{負|ま}けてしまった。',
          dap: 'のに — đã cố vậy mà thua. ので (vì cố nên thua) vô lý.',
          ghi: 'Đề N4 hay đặt のに cạnh ので để bẫy — đọc vế sau rồi mới chọn.',
        },
        {
          tieuDe: 'Biết thêm — のに "dùng để"',
          dong: ['{駅|えき}まで{行|い}くのに{20分|にじゅっぷん}かかります。', 'このナイフは{野菜|やさい}を{切|き}るのに{便利|べんり}です。'],
          ro: ['Eki made iku noni nijuppun kakarimasu.', 'Kono naifu wa yasai o kiru noni benri desu.'],
          hoi: 'Hai câu này có nghĩa "vậy mà" không?',
          dap: 'Không. Sau のに là かかる／{便利|べんり} → のに = "để (làm V) thì…".',
          ghi: 'Nhận ra bằng vế sau: {使|つか}う・{便利|べんり}だ・いい・{必要|ひつよう}だ・かかる. Mẫu mục đích đầy đủ ～ために — Bài 21.',
        },
        {
          tieuDe: '会話③ — "Tôi để quên ví trên tàu…"',
          anh: ['woman-student', 'man-office-worker', 'police-officer'],
          nhan: ['メアリー', '{駅員|えきいん}', 'お{巡|まわ}りさん'],
          dong: ['メアリー：{財布|さいふ}を{忘|わす}れてしまったんですが……。', '{駅員|えきいん}：{今|いま}、{電車|でんしゃ}の{中|なか}を{探|さが}しているところです。', 'メアリー：かばんに{入|い}れておけばよかったのに。'],
          ro: ['Saifu o wasurete shimatta n desu ga…….', 'Ima, densha no naka o sagashite iru tokoro desu.', 'Kaban ni irete okeba yokatta noni.'],
          hoi: 'Trong ③′, tìm câu せっかく～のに và câu ～たところ.',
          dap: 'せっかく{届|とど}けてくれたのに、お{礼|れい}が{言|い}えなくて{残念|ざんねん}です · ちょうど{今|いま}、{家|いえ}に{着|つ}いたところです.',
          ghi: 'Đọc hội thoại ③ + ③′ theo vai. Hội thoại này có ĐỦ bốn mẫu của bài — chỉ ra từng câu.',
        },
        {
          tieuDe: 'Tổng kết Bài 19 — bốn mẫu',
          bang: {
            head: ['Mẫu', 'Nghĩa', 'Câu mẫu'],
            rows: [
              ['～てしまう／～ちゃう', 'xong hết / lỡ làm', '{財布|さいふ}を{落|お}としてしまいました。'],
              ['～てみる', 'làm thử', 'もう{一度|いちど}やってみます。'],
              ['～る／～ている／～たところ', 'sắp / đang / vừa', '{今|いま}、{着|つ}いたところです。'],
              ['～のに', 'vậy mà', 'ちゃんと{見|み}たのに、{間違|まちが}えました。'],
            ],
          },
          ghi: 'Cả lớp đọc to bốn câu mẫu. Đây cũng là khung của bài nói 1 phút: lỡ làm gì → tiếc vì sao → đã thử làm gì → bây giờ thế nào.',
        },
        {
          tieuDe: 'できる！ — Kể 1 phút: "Một lần thất bại của tôi"',
          anh: ['speaking-head', 'stopwatch'],
          nhan: ['{話|はな}す', '1{分|ぷん}'],
          dong: ['{先月|せんげつ}、アルバイトで{失敗|しっぱい}してしまいました。', 'ちゃんとメモを{書|か}いたのに、{注文|ちゅうもん}を{間違|まちが}えてしまったんです。', 'それから、{注文|ちゅうもん}を{声|こえ}に{出|だ}して{確認|かくにん}してみました。'],
          ro: ['Sengetsu, arubaito de shippai shite shimaimashita.', 'Chanto memo o kaita noni, chuumon o machigaete shimatta n desu.', 'Sorekara, chuumon o koe ni dashite kakunin shite mimashita.'],
          hoi: 'Từng bạn kể 1 phút (bấm giờ). Các bạn khác ghi lại: bạn đó dùng mẫu nào?',
          dap: 'Bài đủ điểm có ít nhất: 1 câu ～てしまいました + 1 câu ～のに + 1 câu ～てみました + 1 câu cảm nghĩ.',
          ghi: 'Khung đầy đủ ở mục Luyện nói (できる！). Chưa có chuyện ở chỗ làm thì kể chuyện ngủ quên, lỡ tàu, mất đồ, nấu ăn hỏng.',
        },
        {
          tieuDe: 'Câu hỏi cuối buổi 3',
          hoi: '(1) "Đã uống thuốc vậy mà vẫn sốt." (2) Nối: {日曜日|にちようび}だ + のに. (3) "Giá mà đã mang ô." (4) Chọn: {雨|あめ}（なのに／だけど）、{行|い}きましょう。',
          dap: '(1) {薬|くすり}を{飲|の}んだのに、{熱|ねつ}があります。 (2) {日曜日|にちようび}なのに (3) {傘|かさ}を{持|も}ってくればよかったのに。 (4) だけど (vế sau là lời rủ).',
          ghi: 'Về nhà: làm mục Bài tập + Luyện thêm 1–5 của Bài 19, chuẩn bị bài nói 1 phút.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Ôn buổi 2' },
    {
      t: 'mcq',
      id: 'b19-b3-on',
      title: 'Ôn buổi 2 — ～てみる và ～ところ (4 câu)',
      items: [
        { q: '{一度|いちど}、{北海道|ほっかいどう}に{行|い}って（　）です。', options: ['しまいたい', 'みたい', 'いるところ', 'おきたい'], correct: 1, why: 'Mong trải nghiệm → **～てみたい**. 〔Ichido, Hokkaidou ni itte mitai desu.〕' },
        { q: 'A「もうご{飯|はん}{食|た}べた？」 B「うん、さっき{食|た}べた（　）。」', options: ['ところ', 'のに', 'つもり', 'みた'], correct: 0, why: 'さっき + Vた → vừa xong → **ところ**. 〔Un, sakki tabeta tokoro.〕' },
        { q: '{電話|でんわ}が{鳴|な}ったとき、お{風呂|ふろ}に{入|はい}って（　）ところでした。', options: ['しまう', 'いる', 'みる', 'おく'], correct: 1, why: 'Lúc đó đang → **Vている + ところでした**. 〔Ofuro ni haitte iru tokoro deshita.〕' },
        { q: 'この{服|ふく}、{着|き}て（　）もいいですか。', options: ['みて', 'しまって', 'いて', 'あって'], correct: 0, why: 'Xin mặc thử → **～てみてもいいですか**.' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Tả đồ bị mất ở quầy nhà ga' },
    {
      t: 'canh',
      anh: ['station', 'man-office-worker', 'woman-student', 'purse'],
      caption: 'Quầy nhân viên nhà ga: giáo viên đóng vai 駅員, gọi từng bạn lên báo mất một món đồ (ví, ô, cặp, điện thoại) và tả nó.',
    },
    {
      t: 'table',
      caption: 'Câu hỏi của nhân viên nhà ga — và cách trả lời',
      head: ['駅員 hỏi', 'Trả lời mẫu', 'Romaji'],
      rows: [
        ['どうしましたか。', '{電車|でんしゃ}に{財布|さいふ}を{忘|わす}れてしまったんですが……。', 'Densha ni saifu o wasurete shimatta n desu ga…….'],
        ['どの{電車|でんしゃ}ですか。', '{10時|じゅうじ}ごろの{東京行|とうきょうゆ}きです。', 'Juuji goro no Toukyou-yuki desu.'],
        ['いつ{気|き}がつきましたか。', '{降|お}りてすぐ{気|き}がつきました。', 'Orite sugu ki ga tsukimashita.'],
        ['どんな{財布|さいふ}ですか。', '{赤|あか}くて{小|ちい}さい{財布|さいふ}です。', 'Akakute chiisai saifu desu.'],
        ['{中|なか}に{何|なに}が{入|はい}っていますか。', '{学生証|がくせいしょう}と{五千円|ごせんえん}ぐらい{入|はい}っています。', 'Gakuseishou to gosen en gurai haitte imasu.'],
        ['（{探|さが}したあと）', '{見|み}つかりましたか。……ああ、よかった。ほっとしました。', 'Mitsukarimashita ka. …… Aa, yokatta. Hotto shimashita.'],
      ],
    },
    { t: 'h', text: 'Slide 3 — ～のに: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b19-b3-chia',
      title: 'Luyện nhanh — nối bằng ～のに (8 câu)',
      kind: 'fill',
      items: [
        { q: '{勉強|べんきょう}した ＋ のに', answers: V('{勉強|べんきょう}したのに') },
        { q: '{安|やす}い ＋ のに', answers: V('{安|やす}いのに') },
        { q: '{便利|べんり}だ ＋ のに (hiện tại)', answers: V('{便利|べんり}なのに') },
        { q: '{子|こ}どもだ ＋ のに (hiện tại)', answers: V('{子|こ}どもなのに') },
        { q: '{静|しず}かだった ＋ のに', answers: V('{静|しず}かだったのに') },
        { q: '{来|こ}ない ＋ のに', answers: V('{来|こ}ないのに') },
        { q: '{言|い}う → ～ばよかったのに', answers: V('{言|い}えばよかったのに') },
        { q: '{持|も}ってくる → ～ばよかったのに', answers: V('{持|も}ってくればよかったのに') },
      ],
    },
    {
      t: 'mcq',
      id: 'b19-b3-phan-biet',
      title: 'Phân biệt — のに・ので・ても・けど (6 câu)',
      items: [
        { q: '{雨|あめ}（　）、{試合|しあい}は{中止|ちゅうし}になりました。', options: ['なのに', 'なので', 'でも', 'だけど'], correct: 1, why: 'Vì mưa nên huỷ → nguyên nhân → **なので**. 〔Ame na node, shiai wa chuushi ni narimashita.〕' },
        { q: '{雨|あめ}（　）、{彼|かれ}はサッカーの{練習|れんしゅう}に{行|い}きました。', options: ['なので', 'なのに', 'だから', 'で'], correct: 1, why: 'Trời mưa vậy mà anh ấy vẫn đi (người nói ngạc nhiên) → **なのに**. 〔Ame na noni, kare wa renshuu ni ikimashita.〕' },
        { q: '{雨|あめ}が{降|ふ}って（　）、{明日|あした}は{出|で}かけます。', options: ['いるのに', 'も', 'いるので', 'いるから'], correct: 1, why: 'Giả định + ý định → **～ても**. 〔Ame ga futte mo, ashita wa dekakemasu.〕' },
        { q: 'ちょっと{高|たか}い（　）、この{靴|くつ}を{買|か}いたいです。', options: ['のに', 'けど', 'ので', 'から'], correct: 1, why: 'Vế sau là mong muốn → không dùng のに → **けど**. 〔Chotto takai kedo, kono kutsu o kaitai desu.〕' },
        { q: 'せっかく{早|はや}く{起|お}きた（　）、バスが{来|き}ませんでした。', options: ['ので', 'のに', 'から', 'し'], correct: 1, why: '**せっかく～のに** — đã mất công dậy sớm vậy mà… 〔Sekkaku hayaku okita noni…〕' },
        { q: 'この{辞書|じしょ}は{漢字|かんじ}を{調|しら}べる（　）とても{便利|べんり}です。', options: ['のに', 'ので', 'ても', 'ところ'], correct: 0, why: '**Vる + のに + {便利|べんり}** — のに "dùng để". 〔Kanji o shiraberu noni totemo benri desu.〕' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**～のに = vậy mà + cảm xúc** (tiếc, bực, ngạc nhiên). ナA／N hiện tại: **なのに**.',
        '**Vế sau のに không là ý chí / lời rủ / lời nhờ** → khi đó dùng ～けど／～ても.',
        '**のに "dùng để"**: Vる のに + {使|つか}う／{便利|べんり}／かかる — nhìn vế sau để phân biệt.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 3)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{頑張|がんば}ったのに、うまくいかなかったことがありますか。', ro: 'Ganbatta noni, umaku ikanakatta koto ga arimasu ka.', vi: 'Em có chuyện đã cố gắng vậy mà không suôn sẻ không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい。{毎日|まいにち}{練習|れんしゅう}したのに、スピーチ{大会|たいかい}で{賞|しょう}がもらえませんでした。', ro: 'Hai. Mainichi renshuu shita noni, supiichi taikai de shou ga moraemasen deshita.', vi: 'Có ạ. Ngày nào em cũng luyện vậy mà không được giải ở cuộc thi hùng biện.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'そのあと、どうしましたか。', ro: 'Sono ato, dou shimashita ka.', vi: 'Sau đó em làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{先生|せんせい}にアドバイスをもらって、{来年|らいねん}もう{一度|いちど}{出|で}てみようと{思|おも}っています。', ro: 'Sensei ni adobaisu o moratte, rainen mou ichido dete miyou to omotte imasu.', vi: 'Em đã xin lời khuyên của thầy và định năm sau thử tham gia lần nữa ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{友達|ともだち}が「せっかく{来|き}たのに、{店|みせ}が{休|やす}みだった」と{言|い}いました。{何|なん}と{答|こた}えますか。', ro: 'Tomodachi ga "sekkaku kita noni, mise ga yasumi datta" to iimashita. Nan to kotaemasu ka.', vi: 'Bạn em nói "Mất công đến vậy mà quán lại nghỉ". Em đáp thế nào?' },
        { who: 'Bạn', role: 'candidate', text: 'それは{残念|ざんねん}だったね。じゃ、{今度|こんど}{一緒|いっしょ}に{行|い}ってみない？', ro: 'Sore wa zannen datta ne. Ja, kondo issho ni itte minai?', vi: 'Tiếc thật nhỉ. Vậy lần tới cùng đi thử không?' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「{高|たか}いのに、{買|か}いましょう」— {正|ただ}しいですか。', ro: '"Takai noni, kaimashou" — tadashii desu ka.', vi: '"Đắt vậy mà, mua đi" — có đúng không?' },
        { who: 'Bạn', role: 'candidate', text: '{正|ただ}しくないです。「{高|たか}いけど、{買|か}いましょう」がいいです。', ro: 'Tadashiku nai desu. "Takai kedo, kaimashou" ga ii desu.', vi: 'Không đúng ạ. Nói "Đắt nhưng mua đi" thì đúng.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b19-b3-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: 'ちゃんと{目覚|めざ}まし{時計|どけい}をかけた（　）、{寝坊|ねぼう}してしまいました。', options: ['ので', 'のに', 'から', 'ても'], correct: 1, why: 'Đã đặt báo thức vậy mà vẫn ngủ quên → **のに**. 〔Mezamashi-dokei o kaketa noni, nebou shite shimaimashita.〕' },
        { q: 'あの{店|みせ}は{有名|ゆうめい}（　）のに、あまりおいしくなかった。', options: ['だ', 'な', 'で', 'の'], correct: 1, why: 'ナA + **な** + のに. 〔Yuumei na noni…〕' },
        { q: '{財布|さいふ}をかばんに{入|い}れて（　）よかったのに。', options: ['おけば', 'おいたら', 'みれば', 'しまえば'], correct: 0, why: '**～ておけばよかったのに** — giá mà đã cất sẵn. 〔Kaban ni irete okeba yokatta noni.〕' },
        { q: '{疲|つか}れている（　）、もう{少|すこ}し{頑張|がんば}ります。', options: ['のに', 'けど', 'ので', 'のは'], correct: 1, why: 'Vế sau là ý chí (sẽ cố) → không dùng のに → **けど**. 〔Tsukarete iru kedo, mou sukoshi ganbarimasu.〕' },
        { q: 'せっかく{作|つく}った（　）、{誰|だれ}も{来|き}ませんでした。', options: ['のに', 'ので', 'から', 'ても'], correct: 0, why: '**せっかく～のに** — mất công nấu vậy mà không ai đến. 〔Sekkaku tsukutta noni, daremo kimasen deshita.〕' },
      ],
    },
  ],
};

/* ═══════════════════════ ③ LUYỆN THÊM — DỄ → KHÓ ═══════════════════════ */

type Mcq = Extract<Block, { t: 'mcq' }>['items'][number];

/** Bộ từ cho trắc nghiệm Nhật → Việt / Việt → Nhật (lấy đúng 50 từ của mục Từ vựng). */
const TU_LT: [w: string, ro: string, vi: string][] = [
  ['{失敗|しっぱい}します', 'shippai shimasu', 'thất bại, làm hỏng việc'],
  ['ミス', 'misu', 'lỗi nhỏ, sơ suất'],
  ['{間違|まちが}えます', 'machigaemasu', 'nhầm, làm sai'],
  ['{間違|まちが}い', 'machigai', 'chỗ sai, lỗi sai'],
  ['{割|わ}ります', 'warimasu', 'làm vỡ'],
  ['{落|お}とします', 'otoshimasu', 'đánh rơi'],
  ['{汚|よご}します', 'yogoshimasu', 'làm bẩn'],
  ['こぼします', 'koboshimasu', 'làm đổ, làm tràn'],
  ['{破|やぶ}れます', 'yaburemasu', '(vải, giấy) rách'],
  ['{折|お}れます', 'oremasu', 'gãy'],
  ['うっかり', 'ukkari', 'sơ ý, lơ đễnh'],
  ['わざと', 'wazato', 'cố ý, cố tình'],
  ['{落|お}とし{物|もの}', 'otoshimono', 'đồ đánh rơi'],
  ['{拾|ひろ}います', 'hiroimasu', 'nhặt'],
  ['{見|み}つかります', 'mitsukarimasu', '(đồ) được tìm thấy'],
  ['{見|み}つけます', 'mitsukemasu', 'tìm thấy, tìm ra'],
  ['{気|き}がつきます', 'ki ga tsukimasu', 'nhận ra'],
  ['{警察|けいさつ}', 'keisatsu', 'cảnh sát'],
  ['お{巡|まわ}りさん', 'omawari-san', 'chú cảnh sát'],
  ['{盗|ぬす}みます', 'nusumimasu', 'ăn trộm, lấy cắp'],
  ['{泥棒|どろぼう}', 'dorobou', 'kẻ trộm'],
  ['さっき', 'sakki', 'lúc nãy'],
  ['やっと', 'yatto', 'cuối cùng thì (sau bao vất vả)'],
  ['{試|ため}します', 'tameshimasu', 'thử (một cách làm)'],
  ['レシピ', 'reshipi', 'công thức nấu ăn'],
  ['{混|ま}ぜます', 'mazemasu', 'trộn, khuấy'],
  ['{焦|こ}げます', 'kogemasu', '(đồ ăn) cháy khét'],
  ['{味見|あじみ}します', 'ajimi shimasu', 'nếm thử'],
  ['{温|あたた}めます', 'atatamemasu', 'hâm nóng'],
  ['{冷|さ}めます', 'samemasu', '(đồ nóng) nguội đi'],
  ['{生|なま}', 'nama', 'sống, chưa chín'],
  ['{謝|あやま}ります', 'ayamarimasu', 'xin lỗi'],
  ['{申|もう}し{訳|わけ}ありません', 'moushiwake arimasen', 'thành thật xin lỗi (rất lịch sự)'],
  ['{許|ゆる}します', 'yurushimasu', 'tha thứ'],
  ['{気|き}にします', 'ki ni shimasu', 'bận tâm, để bụng'],
  ['{怒|おこ}ります', 'okorimasu', 'nổi giận'],
  ['しかります', 'shikarimasu', 'mắng (để dạy)'],
  ['{泣|な}きます', 'nakimasu', 'khóc'],
  ['{悲|かな}しい', 'kanashii', 'buồn'],
  ['がっかりします', 'gakkari shimasu', 'thất vọng'],
  ['ほっとします', 'hotto shimasu', 'thở phào nhẹ nhõm'],
  ['{恥|は}ずかしい', 'hazukashii', 'xấu hổ'],
  ['{理由|りゆう}', 'riyuu', 'lý do'],
  ['{寝坊|ねぼう}します', 'nebou shimasu', 'ngủ quên'],
  ['{乗|の}り{遅|おく}れます', 'noriokuremasu', 'lỡ (tàu, xe)'],
  ['{急|きゅう}に', 'kyuu ni', 'đột nhiên'],
  ['{途中|とちゅう}', 'tochuu', 'giữa chừng, dọc đường'],
  ['すっかり', 'sukkari', 'hoàn toàn, sạch trơn'],
  ['ちゃんと', 'chanto', 'đàng hoàng, cẩn thận'],
  ['せっかく', 'sekkaku', 'đã mất công'],
];

/** Xếp đáp án đúng vào vị trí (i % 4) — cố định, không ngẫu nhiên, để tiến độ lưu theo câu không đổi. */
const xep = (dung: string, sai: string[], i: number): { options: string[]; correct: number } => {
  const k = i % 4;
  const options = [...sai.slice(0, k), dung, ...sai.slice(k, 3)];
  return { options, correct: k };
};
const MCQ_NV = (from: number, to: number): Mcq[] =>
  TU_LT.slice(from, to).map(([w, ro, vi], j) => {
    const i = from + j;
    const n = TU_LT.length;
    const sai = [7, 19, 31].map((d) => TU_LT[(i + d) % n][2]);
    return { q: `「${w}」〔${ro}〕 nghĩa là gì?`, ...xep(vi, sai, i), why: `**${w}** (${ro}) = ${vi}.` };
  });
const MCQ_VN = (from: number, to: number): Mcq[] =>
  TU_LT.slice(from, to).map(([w, ro, vi], j) => {
    const i = from + j;
    const n = TU_LT.length;
    const sai = [5, 17, 29].map((d) => TU_LT[(i + d) % n][0]);
    return { q: `"${vi}" tiếng Nhật là gì?`, ...xep(w, sai, i + 1), why: `**${w}** (${ro}) = ${vi}.` };
  });

const LT_1: Lesson = {
  id: 'b19-lt-1-tu-vung',
  kind: 'homework',
  title: 'Luyện thêm 1 · Từ vựng — 🟢 nhận mặt → 🟡 điền câu (40 câu)',
  goal: 'Nhớ chắc 50 từ của Bài 19 theo hai chiều (Nhật → Việt, Việt → Nhật) rồi chọn đúng từ trong câu, kể cả các cặp dễ nhầm (落とす・落ちる, 見つける・見つかる, 怒る・しかる, 冷める・冷える, うっかり・わざと).',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟢 Mức Dễ** — 25 câu Nhật → Việt và Việt → Nhật. Sai câu nào: đọc to từ đó 3 lần (romaji có ngay trong câu hỏi).',
        '**🟡 Mức Vừa** — 15 câu điền từ vào câu, đúng dạng 文脈規定 của đề N4.',
        'Lỗi hay mắc: {探|さが}す↔{見|み}つける↔{見|み}つかる, {落|お}とし{物|もの}↔{忘|わす}れ{物|もの}, {怒|おこ}る↔しかる, {冷|さ}める↔{冷|ひ}える, {焦|こ}げる↔{燃|も}える, {悲|かな}しい↔{残念|ざんねん}, うっかり↔わざと.',
      ],
    },
    { t: 'h', text: '🟢 Mức 1 — Dễ: nhìn từ → nghĩa; nghe nghĩa → từ' },
    { t: 'mcq', id: 'b19-lt1-nv', title: 'Nhật → Việt (15 câu)', items: MCQ_NV(0, 15) },
    { t: 'mcq', id: 'b19-lt1-vn', title: 'Việt → Nhật (10 câu)', items: MCQ_VN(30, 40) },
    { t: 'h', text: '🟡 Mức 2 — Vừa: chọn từ hợp với câu (文脈規定)' },
    {
      t: 'mcq',
      id: 'b19-lt1-dien',
      title: 'Điền từ (15 câu)',
      items: [
        { q: '{電話番号|でんわばんごう}を（　）、{知|し}らない{人|ひと}に{電話|でんわ}してしまいました。', options: ['{間違|まちが}えて', '{割|わ}って', '{破|やぶ}れて', '{拾|ひろ}って'], correct: 0, why: 'Nhầm số = **{間違|まちが}える**. 〔Denwa bangou o machigaete…〕' },
        { q: '{駅|えき}の{前|まえ}で{財布|さいふ}を（　）ので、{交番|こうばん}に{届|とど}けました。', options: ['{落|お}とした', '{拾|ひろ}った', '{盗|ぬす}んだ', '{見|み}つかった'], correct: 1, why: 'Nhặt được rồi mang đến đồn = **{拾|ひろ}う**. 〔Saifu o hirotta node…〕' },
        { q: 'テーブルの{上|うえ}に{牛乳|ぎゅうにゅう}を（　）しまいました。', options: ['{焦|こ}げて', 'こぼして', '{冷|さ}めて', '{折|お}れて'], correct: 1, why: 'Làm đổ chất lỏng = **こぼす**. 〔Gyuunyuu o koboshite shimaimashita.〕' },
        { q: 'このシャツは{古|ふる}いので、すぐ（　）しまいました。', options: ['{破|やぶ}れて', '{割|わ}れて', '{折|お}って', '{混|ま}ぜて'], correct: 0, why: 'Vải rách = **{破|やぶ}れる** (tự). 〔Sugu yaburete shimaimashita.〕' },
        { q: '{雪|ゆき}が{重|おも}くて、{木|き}の{枝|えだ}が（　）。', options: ['{破|やぶ}れました', '{折|お}れました', '{割|わ}りました', '{落|お}としました'], correct: 1, why: 'Cành cây gãy = **{折|お}れる** (tự). 〔Eda ga oremashita.〕' },
        { q: '（　）{言|い}ったんじゃありません。うっかり{言|い}ってしまったんです。', options: ['やっと', 'わざと', 'すっかり', 'ちゃんと'], correct: 1, why: 'Đối với うっかり (sơ ý) là **わざと** (cố ý). 〔Wazato itta n ja arimasen.〕' },
        { q: '{家|いえ}に{着|つ}いてから、{傘|かさ}がないことに（　）。', options: ['{気|き}がつきました', '{気|き}にしました', '{見|み}つけました', '{探|さが}しました'], correct: 0, why: '～ことに**{気|き}がつく** = nhận ra. {気|き}にする là bận tâm. 〔Kasa ga nai koto ni ki ga tsukimashita.〕' },
        { q: '{夜中|よなか}に{隣|となり}の{家|いえ}に（　）が{入|はい}りました。', options: ['{警察|けいさつ}', '{泥棒|どろぼう}', 'お{巡|まわ}りさん', '{落|お}とし{物|もの}'], correct: 1, why: '**{泥棒|どろぼう}が{入|はい}る** = có trộm đột nhập. 〔Dorobou ga hairimashita.〕' },
        { q: '{二時間|にじかん}{探|さが}して、（　）{鍵|かぎ}が{見|み}つかりました。', options: ['うっかり', 'やっと', 'わざと', '{急|きゅう}に'], correct: 1, why: 'Sau bao vất vả → **やっと**. 〔Yatto kagi ga mitsukarimashita.〕' },
        { q: 'スープが（　）しまったので、もう{一度|いちど}{温|あたた}めます。', options: ['{冷|さ}めて', '{冷|ひ}えて', '{焦|こ}げて', '{混|ま}ざって'], correct: 0, why: 'Đồ nóng nguội đi = **{冷|さ}める**; rồi hâm lại. 〔Suupu ga samete shimatta node…〕' },
        { q: '{塩|しお}を{入|い}れたら、ちょっと（　）してみてください。', options: ['{味見|あじみ}', '{失敗|しっぱい}', '{寝坊|ねぼう}', '{返事|へんじ}'], correct: 0, why: 'Nếm thử khi đang nấu = **{味見|あじみ}する**. 〔Chotto ajimi shite mite kudasai.〕' },
        { q: '{子|こ}どもが{道|みち}で{遊|あそ}んでいたので、お{父|とう}さんが（　）。', options: ['しかりました', '{謝|あやま}りました', '{泣|な}きました', 'ほっとしました'], correct: 0, why: 'Cha mắng con để dạy = **しかる**. 〔Otousan ga shikarimashita.〕' },
        { q: '{会議|かいぎ}の{途中|とちゅう}で、{急|きゅう}に{電気|でんき}が（　）。', options: ['{消|き}えました', '{消|け}しました', '{冷|さ}めました', '{割|わ}れました'], correct: 0, why: 'Đèn tự tắt (không ai làm) → **{消|き}える** (tự, Bài 15). 〔Kyuu ni denki ga kiemashita.〕' },
        { q: '{遅|おく}れた（　）を{先生|せんせい}に{説明|せつめい}しました。', options: ['{理由|りゆう}', '{途中|とちゅう}', 'ミス', 'レシピ'], correct: 0, why: 'Lý do đến muộn = **{理由|りゆう}**. 〔Okureta riyuu o setsumei shimashita.〕' },
        { q: '{楽|たの}しみにしていたのに、{雨|あめ}で{旅行|りょこう}が{中止|ちゅうし}になって、（　）しました。', options: ['ほっと', 'がっかり', 'うっかり', 'すっかり'], correct: 1, why: 'Mong chờ mà bị huỷ → **がっかりする**. 〔Gakkari shimashita.〕' },
      ],
    },
  ],
};

const LT_2: Lesson = {
  id: 'b19-lt-2-han-tu',
  kind: 'homework',
  title: 'Luyện thêm 2 · Chữ Hán — 🟢 đọc → 🟡 chọn chữ → 🔴 chữ giống, đồng âm (22 câu)',
  goal: 'Đọc và viết đúng 15 chữ Hán mới trong từ: chọn cách đọc, chọn chữ đúng cho từ viết kana, phân biệt chữ trông giống (失・夫, 困・因, 怒・努, 警・驚, 察・祭, 直・真) và từ đồng âm (謝る・誤る, 覚める・冷める).',
  minutes: 25,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟢** 10 câu đọc từ (漢字読み). **🟡** 8 câu chọn chữ (表記). **🔴** 4 câu chữ trông giống / đồng âm.',
        'Sai câu nào → mở thẻ chữ đó (chạm vào chữ) xem hoạt hình nét và từ đi chung.',
      ],
    },
    {
      t: 'mcq',
      id: 'b19-lt2-doc',
      title: '🟢 漢字読み — cách đọc của từ in đậm (10 câu)',
      items: [
        { q: '{会議|かいぎ}に**遅刻**してしまいました。', options: ['ちこく', 'ちごく', 'じこく', 'おそこく'], correct: 0, why: '**{遅刻|ちこく}** (chikoku).' },
        { q: '**次**の{駅|えき}で{降|お}ります。', options: ['じ', 'つぎ', 'し', 'つい'], correct: 1, why: '**{次|つぎ}** (tsugi) — đứng riêng đọc kun.' },
        { q: '**次回**の{授業|じゅぎょう}は{休|やす}みです。', options: ['つぎかい', 'じかい', 'しかい', 'じがい'], correct: 1, why: '**{次回|じかい}** (jikai) — trong từ ghép đọc ジ.' },
        { q: '{名前|なまえ}を**間違**えないでください。', options: ['まちが', 'あいだちが', 'まちか', 'かんい'], correct: 0, why: '**{間違|まちが}えないで** (machigaenaide).' },
        { q: '{妹|いもうと}が{泣|な}いて、とても**困**りました。', options: ['こま', 'こん', 'くる', 'こわ'], correct: 0, why: '**{困|こま}りました** (komarimashita).' },
        { q: '{駅|えき}で{電車|でんしゃ}の**時刻表**を{見|み}ました。', options: ['じこくひょう', 'じかんひょう', 'じこくおもて', 'ときこくひょう'], correct: 0, why: '**{時刻表|じこくひょう}** (jikokuhyou) — bảng giờ tàu.' },
        { q: '**悲**しい{映画|えいが}を{見|み}て、{泣|な}いてしまいました。', options: ['かな', 'さび', 'ひ', 'くる'], correct: 0, why: '**{悲|かな}しい** (kanashii).' },
        { q: '{友達|ともだち}に**謝**りました。', options: ['しゃ', 'あやま', 'あやまち', 'ことわ'], correct: 1, why: '**{謝|あやま}りました** (ayamarimashita).' },
        { q: '{先生|せんせい}に**直接**{聞|き}いてみます。', options: ['じきせつ', 'ちょくせつ', 'なおせつ', 'ちょっくせつ'], correct: 1, why: '**{直接|ちょくせつ}** (chokusetsu) — 直 đọc チョク.' },
        { q: '**警察**に{連絡|れんらく}しました。', options: ['けいさい', 'けいさつ', 'けんさつ', 'きょうさつ'], correct: 1, why: '**{警察|けいさつ}** (keisatsu).' },
      ],
    },
    {
      t: 'mcq',
      id: 'b19-lt2-chon',
      title: '🟡 表記 — chọn chữ đúng (8 câu)',
      items: [
        { q: '{料理|りょうり}に**しっぱい**しました。', options: ['夫敗', '失販', '失敗', '矢敗'], correct: 2, why: '**失敗** — 失 (có nét phẩy đầu) + 敗 (貝 + 攵). 販 là "bán".' },
        { q: '{答|こた}えが**ちがい**ます。', options: ['違い', '偉い', '韋い', '遅い'], correct: 0, why: '**違う** — 辶 + 韋. 偉い (vĩ đại), 遅い (muộn).' },
        { q: '{新|あたら}しい{単語|たんご}を**おぼえ**ました。', options: ['学え', '覚え', '見え', '党え'], correct: 1, why: '**覚える** — trên giống 学, dưới là 見.' },
        { q: '{紙|かみ}が**やぶれて**いますよ。', options: ['波れて', '皮れて', '破れて', '彼れて'], correct: 2, why: '**破れる** — 石 + 皮. 波 (sóng) có 氵.' },
        { q: '{傘|かさ}が**おれて**しまいました。', options: ['祈れて', '析れて', '折れて', '所れて'], correct: 2, why: '**折れる** — 扌 + 斤.' },
        { q: '{弟|おとうと}が**おこって**います。', options: ['努って', '怒って', '奴って', '怨って'], correct: 1, why: '**怒る** — 奴 + 心. 努 (cố gắng) có 力.' },
        { q: '{時計|とけい}を**なおして**もらいました。', options: ['直して', '真して', '置して', '植して'], correct: 0, why: '**直す** — 十 + 目 + nét gấp. 真 có 八 ở dưới.' },
        { q: '{病院|びょういん}で**しんさつ**を{受|う}けました。— 「さつ」は？', options: ['祭', '察', '際', '擦'], correct: 1, why: '**察** ({診察|しんさつ} — khám bệnh) — có 宀 ở trên; 祭 (lễ) không có.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b19-lt2-bay',
      title: '🔴 Bẫy — chữ trông giống, đồng âm (4 câu)',
      items: [
        { q: '{遅|おく}れたことを**あやまり**ました。— chữ đúng là？', options: ['謝り', '誤り', '射り', '話り'], correct: 0, why: 'Xin lỗi = **謝る**. **誤り** (あやまり) = sai lầm (N2) — đồng âm khác nghĩa.' },
        { q: '「{目|め}が**さめる**」— chữ đúng là？', options: ['冷める', '覚める', '寒める', '冷やす'], correct: 1, why: 'Tỉnh giấc = **{目|め}が覚める**. **冷める** (さめる) = (đồ nóng) nguội — đồng âm!' },
        { q: '「げんいん（nguyên nhân）」の{漢字|かんじ}は？', options: ['原困', '原因', '源因', '原囚'], correct: 1, why: '**原因** — 因 trong khung là 大. 困 (khốn) trong khung là 木.' },
        { q: '「おどろく（ngạc nhiên）」の{漢字|かんじ}は？', options: ['警く', '驚く', '敬く', '馬く'], correct: 1, why: '**驚く** — dưới là 馬 (ngựa). **警** (警察) dưới là 言.' },
      ],
    },
  ],
};

const LT_3: Lesson = {
  id: 'b19-lt-3-chia-the',
  kind: 'homework',
  title: 'Luyện thêm 3 · Chia thể — ～てしまう／～ちゃう, ～てみる, ～ところ, ～のに (28 câu gõ)',
  goal: 'Chia nhanh và đúng thể て của mọi nhóm động từ khi ghép với しまう (và dạng nói ～ちゃう・～じゃう), みる, ～ている／～た + ところ, và nối đúng thể thường + のに (ナA・N + な) — nền tảng để không sai ở phần ngữ pháp.',
  minutes: 25,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟢 Mức 1** — 10 câu ～てしまう／～ちゃう. **🟡 Mức 2** — 6 câu ～てみる + 6 câu ～ところ. **🔴 Mức 3** — 6 câu ～のに.',
        'Thể て: う・つ・る → って · む・ぶ・ぬ → んで · く → いて (行く → 行って) · ぐ → いで · す → して · nhóm 2: bỏ る + て · する → して · 来る → 来て. Đuôi **で** → dạng nói **じゃう**.',
      ],
    },
    {
      t: 'quiz',
      id: 'b19-lt3-shimau',
      title: '🟢 ～てしまう／～ちゃう (10 câu)',
      kind: 'fill',
      grammar: 'thể て + しまう (しまいました・しまった・しまおう) · ～ちゃう／～じゃう',
      items: [
        { q: '{汚|よご}す → ～てしまいました', answers: V('{汚|よご}してしまいました'), hint: 'す → して' },
        { q: '{拾|ひろ}う → ～てしまった', answers: V('{拾|ひろ}ってしまった'), hint: 'う → って' },
        { q: '{転|ころ}ぶ → ～てしまいました', answers: V('{転|ころ}んでしまいました'), hint: 'ぶ → んで' },
        { q: '{乗|の}り{遅|おく}れる → ～てしまいました', answers: V('{乗|の}り{遅|おく}れてしまいました'), hint: 'nhóm 2' },
        { q: '{寝坊|ねぼう}する → ～てしまいました', answers: V('{寝坊|ねぼう}してしまいました'), hint: 'する → して' },
        { q: '{片付|かたづ}ける → ～てしまおう', answers: V('{片付|かたづ}けてしまおう'), hint: 'ý chí của しまう: しまおう' },
        { q: '{割|わ}る → ～ちゃった', answers: V('{割|わ}っちゃった'), hint: '割って → 割っちゃった' },
        { q: '{死|し}ぬ → ～じゃった', answers: V('{死|し}んじゃった'), hint: 'ぬ → んで → じゃった' },
        { q: '{急|いそ}ぐ → ～じゃった', answers: V('{急|いそ}いじゃった'), hint: 'ぐ → いで → いじゃった' },
        { q: '{来|く}る → ～ちゃった', answers: V('{来|き}ちゃった'), hint: '来て → 来ちゃった (kichatta)' },
      ],
    },
    {
      t: 'quiz',
      id: 'b19-lt3-miru-tokoro',
      title: '🟡 ～てみる (6 câu) + ～ところ (6 câu)',
      kind: 'fill',
      grammar: 'thể て + みる (みたい・みてください・みよう・みたら) · Vる／Vている／Vた + ところ',
      items: [
        { q: '{登|のぼ}る → ～てみたいです', answers: V('{登|のぼ}ってみたいです'), hint: 'る (nhóm 1) → って' },
        { q: '{飲|の}む → ～てみてください', answers: V('{飲|の}んでみてください'), hint: 'む → んで' },
        { q: '{試|ため}す → ～てみよう', answers: V('{試|ため}してみよう'), hint: 'す → して' },
        { q: '{来|く}る → ～てみませんか', answers: V('{来|き}てみませんか'), hint: '来て' },
        { q: '{入|はい}る → ～てみたら？', answers: V('{入|はい}ってみたら'), hint: '入る (nhóm 1) → 入って' },
        { q: '{見|み}る → ～てみてもいいですか', answers: V('{見|み}てみてもいいですか'), hint: '見て + みて' },
        { q: '{始|はじ}まる → sắp (～ところです)', answers: V('{始|はじ}まるところです'), hint: 'Vる + ところ' },
        { q: '{待|ま}つ → đang (～ところです)', answers: V('{待|ま}っているところです'), hint: 'Vている + ところ' },
        { q: '{起|お}きる → vừa xong (～ところです)', answers: V('{起|お}きたところです'), hint: 'Vた + ところ' },
        { q: '{帰|かえ}ってくる → vừa xong (～ところです)', answers: V('{帰|かえ}ってきたところです'), hint: 'Vた + ところ' },
        { q: '{出|で}る → lúc đó sắp (～ところでした)', answers: V('{出|で}るところでした'), hint: 'Vる + ところでした' },
        { q: '{話|はな}す → lúc đó đang (～ところでした)', answers: V('{話|はな}しているところでした'), hint: 'Vている + ところでした' },
      ],
    },
    {
      t: 'quiz',
      id: 'b19-lt3-noni',
      title: '🔴 ～のに — nối đúng (6 câu)',
      kind: 'fill',
      grammar: '普通形 + のに · ナA／N + な + のに · ～ばよかったのに',
      items: [
        { q: '{約束|やくそく}する (quá khứ) ＋ のに', answers: V('{約束|やくそく}したのに') },
        { q: '{寒|さむ}い ＋ のに', answers: V('{寒|さむ}いのに') },
        { q: '{元気|げんき}だ ＋ のに (hiện tại)', answers: V('{元気|げんき}なのに') },
        { q: '{休|やす}みだ ＋ のに (hiện tại)', answers: V('{休|やす}みなのに') },
        { q: '{上手|じょうず}じゃない ＋ のに', answers: V('{上手|じょうず}じゃないのに', '{上手|じょうず}ではないのに') },
        { q: '{聞|き}く → ～ばよかったのに', answers: V('{聞|き}けばよかったのに') },
      ],
    },
  ],
};

const LT_4: Lesson = {
  id: 'b19-lt-4-ngu-phap',
  kind: 'homework',
  title: 'Luyện thêm 4 · Ngữ pháp — 🟡 chọn mẫu theo nghĩa → 🔴 bẫy ところ・のに・tự/tha (28 câu)',
  goal: 'Chọn đúng ～てしまう／～てみる／～ておく／～ところ theo nghĩa và thời điểm; nhận ra câu xin lỗi đúng (tha động từ); phân biệt ～のに với ～ので・～ても・～けど và với のに "dùng để"; nhận ra ところ "chỗ" và ところ "thời điểm" — đúng các bẫy đề N4.',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟡 Mức 2** — 10 câu chọn mẫu theo nghĩa (thử / lỡ / làm sẵn / thời điểm).',
        '**🔴 Mức 3** — 10 câu bẫy (のに vs ので／ても／けど, ところ "chỗ", tự / tha khi xin lỗi) + 8 câu điền hoàn chỉnh.',
        'Bí quyết: (1) việc **đáng tiếc / xong hết** → ～てしまう; **để biết kết quả** → ～てみる; **chuẩn bị** → ～ておく; (2) nhìn **{今|いま}から／{今|いま}／さっき** để chọn る／ている／た + ところ; (3) vế sau là **ý chí / rủ / nhờ** → không dùng のに.',
      ],
    },
    {
      t: 'mcq',
      id: 'b19-lt4-mau',
      title: '🟡 Chọn mẫu theo nghĩa (10 câu)',
      items: [
        { q: '{旅行|りょこう}の{前|まえ}に、ホテルを{予約|よやく}して（　）。', options: ['しまいました', 'みました', 'おきました', 'いるところです'], correct: 2, why: 'Làm sẵn để chuẩn bị → **～ておきました** (Bài 18). 〔Hoteru o yoyaku shite okimashita.〕' },
        { q: 'おいしいかどうかわからないから、{少|すこ}し{食|た}べて（　）。', options: ['おきます', 'みます', 'しまいます', 'あります'], correct: 1, why: 'Ăn để BIẾT ngon không → **～てみます**. 〔Sukoshi tabete mimasu.〕' },
        { q: '{電車|でんしゃ}の{中|なか}で{寝|ね}て（　）、{駅|えき}を{乗|の}り{過|す}ごしました。', options: ['みて', 'おいて', 'しまって', 'あって'], correct: 2, why: 'Lỡ ngủ quên (không cố ý) → **～てしまって**. {乗|の}り{過|す}ごす = đi quá ga. 〔Nete shimatte, eki o norisugoshimashita.〕' },
        { q: '{来週|らいしゅう}テストがあるので、{今週|こんしゅう}{中|じゅう}にこの{本|ほん}を{全部|ぜんぶ}{読|よ}んで（　）たいです。', options: ['しまい', 'み', 'あり', 'い'], correct: 0, why: 'Đọc cho xong hết → **～てしまいたい** (nghĩa ①). 〔Zenbu yonde shimaitai desu.〕' },
        { q: '{新|あたら}しいアプリを{使|つか}って（　）ら、とても{便利|べんり}でした。', options: ['しまった', 'みた', 'おいた', 'あった'], correct: 1, why: 'Dùng thử rồi thấy kết quả → **～てみたら** (ポイント 120). 〔Tsukatte mitara, totemo benri deshita.〕' },
        { q: 'A「もうレポート{出|だ}した？」 B「ううん、{今|いま}{書|か}いている（　）。」', options: ['ところ', 'のに', 'みた', 'しまう'], correct: 0, why: 'Đang viết → **Vている + ところ**. 〔Ima kaite iru tokoro.〕' },
        { q: '{今|いま}から{寝|ね}る（　）なので、{電話|でんわ}は{明日|あした}にしてください。', options: ['ところ', 'のに', 'みた', 'しまう'], correct: 0, why: '{今|いま}から + Vる → sắp → **ところ**. 〔Ima kara neru tokoro na node…〕' },
        { q: 'さっき{空港|くうこう}に（　）ところです。', options: ['{着|つ}く', '{着|つ}いている', '{着|つ}いた', '{着|つ}いて'], correct: 2, why: 'さっき (lúc nãy) → vừa xong → **Vた + ところ**. 〔Sakki kuukou ni tsuita tokoro desu.〕' },
        { q: '{電話|でんわ}がかかってきたとき、ちょうどシャワーを{浴|あ}びて（　）。', options: ['いるところでした', 'しまうところでした', 'みるところでした', 'おくところでした'], correct: 0, why: 'Lúc đó đang → **～ているところでした**. 〔Shawaa o abite iru tokoro deshita.〕' },
        { q: '{父|ちち}に{借|か}りたカメラを（　）しまいました。どうしよう……。', options: ['{壊|こわ}れて', '{壊|こわ}して', '{壊|こわ}れた', '{壊|こわ}した'], correct: 1, why: 'Tôi làm hỏng (tha, を) + てしまう → **{壊|こわ}して**しまいました. 〔Kamera o kowashite shimaimashita.〕' },
      ],
    },
    {
      t: 'mcq',
      id: 'b19-lt4-bay',
      title: '🔴 Bẫy — のに・ところ・tự / tha (10 câu)',
      items: [
        { q: '{高|たか}い{薬|くすり}を{飲|の}んだ（　）、{全然|ぜんぜん}よくなりません。', options: ['ので', 'のに', 'から', 'ても'], correct: 1, why: 'Uống thuốc đắt vậy mà không khỏi → **のに**. 〔Takai kusuri o nonda noni…〕' },
        { q: '{熱|ねつ}がある（　）、{今日|きょう}は{休|やす}みます。', options: ['のに', 'ので', 'けど', 'ても'], correct: 1, why: 'Vì sốt nên nghỉ → **ので** (nguyên nhân). のに vô lý. 〔Netsu ga aru node, kyou wa yasumimasu.〕' },
        { q: '{忙|いそが}しい（　）、{手伝|てつだ}ってくれませんか。', options: ['のに', 'けど', 'のを', 'のは'], correct: 1, why: 'Vế sau là lời NHỜ → không dùng のに → **けど** ("bận thì bận, nhưng giúp mình được không?"). 〔Isogashii kedo, tetsudatte kuremasen ka.〕' },
        { q: 'この{町|まち}は{静|しず}か（　）、{便利|べんり}です。', options: ['なのに', 'だのに', 'のに', 'でのに'], correct: 0, why: 'ナA + **な** + のに (yên tĩnh vậy mà tiện — ngạc nhiên vui). 〔Shizuka na noni, benri desu.〕' },
        { q: '{家|いえ}から{駅|えき}まで{行|い}く（　）、{自転車|じてんしゃ}で{10分|じゅっぷん}かかります。', options: ['のに', 'ので', 'けど', 'ところ'], correct: 0, why: '**Vる + のに + かかる** — "để đi ra ga thì mất…" (のに dùng để). 〔Eki made iku noni, jitensha de juppun kakarimasu.〕' },
        { q: '{焦|こ}げた（　）は{食|た}べないでください。', options: ['ところ', 'のに', 'みて', 'しまう'], correct: 0, why: 'ところ = **chỗ** (danh từ, có は đi sau): chỗ bị cháy đừng ăn. 〔Kogeta tokoro wa tabenaide kudasai.〕' },
        { q: '{先月|せんげつ}{日本|にほん}に（　）。まだ{日本語|にほんご}がよくわかりません。', options: ['{来|き}たところです', '{来|き}ました', '{来|く}るところです', '{来|き}てみました'], correct: 1, why: 'Một tháng trước — quá lâu cho ところ → **{来|き}ました**. ("mới sang ít lâu" = ～たばかり, Bài 22.) 〔Sengetsu Nihon ni kimashita.〕' },
        { q: '（{自分|じぶん}がぶつかった）すみません、お{皿|さら}（　）{割|わ}ってしまいました。', options: ['が', 'を', 'で', 'に'], correct: 1, why: 'Nhận lỗi → tha {割|わ}る + **を**. 〔Osara o watte shimaimashita.〕' },
        { q: '{地震|じしん}で、{棚|たな}の{上|うえ}のコップが{落|お}ちて（　）しまいました。', options: ['{割|わ}って', '{割|わ}れて', '{割|わ}られて', '{割|わ}らせて'], correct: 1, why: 'Không ai làm (động đất) → tự động từ **{割|わ}れる** → {割|わ}れてしまいました. 〔Koppu ga ochite warete shimaimashita.〕' },
        { q: '{雨|あめ}が{降|ふ}って（　）、{試合|しあい}は{予定|よてい}どおりにします。', options: ['いるのに', 'も', 'しまって', 'いるところ'], correct: 1, why: 'Dù có mưa (giả định) + kế hoạch → **～ても**. のに không dùng khi vế sau là ý định. 〔Ame ga futte mo, shiai wa yotei doori ni shimasu.〕' },
      ],
    },
    {
      t: 'quiz',
      id: 'b19-lt4-dien',
      title: '🔴 Điền hoàn chỉnh (8 câu)',
      kind: 'fill',
      grammar: '～てしまう · ～てみる · ～ところ · ～のに · ～ばよかったのに',
      items: [
        { q: 'すみません。{会議|かいぎ}の{時間|じかん}をすっかり{忘|わす}れて（　）。', answers: ['しまいました', 'しまって', 'いました'], hint: 'lỡ quên → しまいました' },
        { q: 'この{服|ふく}、{着|き}て（　）もいいですか。', answers: ['みて'], hint: 'xin thử' },
        { q: 'A「もう{出|で}かけた？」 B「ううん、{今|いま}から{出|で}かける（　）。」', answers: ['ところ', 'ところです', 'ところだよ'], hint: 'Vる + ところ' },
        { q: 'A「{駅|えき}に{着|つ}いた？」 B「うん、ちょうど{今|いま}{着|つ}いた（　）。」', answers: ['ところ', 'ところです', 'ところだよ'], hint: 'Vた + ところ' },
        { q: '{一生懸命|いっしょうけんめい}{作|つく}った（　）、{誰|だれ}も{食|た}べてくれませんでした。', answers: ['のに'], hint: 'vậy mà' },
        { q: 'もう{10時|じゅうじ}（　）のに、{彼|かれ}はまだ{来|き}ません。', answers: ['な'], hint: 'N + な + のに' },
        { q: '{試験|しけん}の{前|まえ}に、もっと{勉強|べんきょう}すれ（　）よかったのに。', answers: ['ば'], hint: '～ば + よかったのに' },
        { q: 'わからなかったら、{辞書|じしょ}で{調|しら}べて（　）たら？', answers: ['み'], hint: '～てみたら' },
      ],
    },
  ],
};

const LT_5: Lesson = {
  id: 'b19-lt-5-tong-hop',
  kind: 'homework',
  title: 'Luyện thêm 5 · Đề tổng hợp kiểu N4 — 文字・語彙 · 文法 · 読解 (17 câu, có thang điểm)',
  goal: 'Làm một đề mini đúng ba phần của JLPT N4 (chữ – từ, ngữ pháp, đọc) trên nội dung Bài 19, tự chấm theo thang điểm và biết sai câu nào thì ôn mục nào.',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Cách làm & thang điểm',
      items: [
        'Bấm giờ **25 phút**, không mở bài. ① 文字・語彙 6 câu · ② 文法 8 câu (6 chọn + 2 sắp xếp ★) · ③ 読解 3 câu.',
        'Mỗi câu 1 điểm, tổng **17**. **15–17**: rất tốt, sang Bài 20 · **12–14**: đạt, ôn lại mục mình sai · **≤ 11**: học lại Ngữ pháp ① ② ③ ④ và làm Luyện thêm 3–4.',
        'Sai ① → Từ vựng + Chữ Hán · sai ② câu ～てしまう／～てみる → Ngữ pháp ① ② · sai câu ～ところ → ③ (bảng đường thời gian) · sai câu ～のに → ④ (bảng phân biệt) · sai ③ → Đọc hiểu.',
      ],
    },
    { t: 'h', text: '① 文字・語彙' },
    {
      t: 'mcq',
      id: 'b19-lt5-tu',
      title: '文字・語彙 (6 câu)',
      items: [
        { q: '**失礼**します。— {読|よ}み{方|かた}', options: ['しつれい', 'しっれい', 'しつらい', 'しれい'], correct: 0, why: '**{失礼|しつれい}** (shitsurei).' },
        { q: '{朝|あさ}、**目**が**覚**めました。— 「覚」の{読|よ}み{方|かた}', options: ['おぼ', 'さ', 'かく', 'さま'], correct: 1, why: '**{目|め}が{覚|さ}める** (me ga sameru).' },
        { q: '{電車|でんしゃ}を**まちがえ**ました。— {漢字|かんじ}', options: ['間違え', '問違え', '間遅え', '間偉え'], correct: 0, why: '**間違える**.' },
        { q: '{財布|さいふ}がなかなか（　）。', options: ['{見|み}つけません', '{見|み}つかりません', '{探|さが}しません', '{拾|ひろ}いません'], correct: 1, why: 'Đồ (財布が) không được tìm thấy → tự động từ **{見|み}つかる**.' },
        { q: '{電子|でんし}レンジでスープを（　）。', options: ['{冷|さ}めました', '{温|あたた}めました', '{焦|こ}げました', 'こぼれました'], correct: 1, why: 'Hâm nóng = **{温|あたた}める** (tha, を).' },
        { q: '「うっかり{忘|わす}れてしまいました」に{意味|いみ}がいちばん{近|ちか}いのは？', options: ['{忘|わす}れるつもりはなかった', 'わざと{忘|わす}れた', 'まだ{覚|おぼ}えている', '{忘|わす}れてもいい'], correct: 0, why: 'うっかり = sơ ý, không cố ý ≈ **{忘|わす}れるつもりはなかった**.' },
      ],
    },
    { t: 'h', text: '② 文法' },
    {
      t: 'mcq',
      id: 'b19-lt5-np',
      title: '文法 — 文法形式の判断 (6 câu) + 文の組み立て ★ (2 câu)',
      items: [
        { q: '{急|いそ}いで{走|はし}った（　）、バスに{乗|の}り{遅|おく}れてしまった。', options: ['ので', 'のに', 'から', 'ても'], correct: 1, why: '**のに** — đã chạy vội vậy mà vẫn lỡ xe.' },
        { q: 'このラーメン、{一度|いちど}{食|た}べて（　）かったんです。', options: ['しまいた', 'みた', 'おいた', 'あった'], correct: 1, why: '**～てみたかった** — đã muốn ăn thử.' },
        { q: '{今|いま}、{料理|りょうり}を{作|つく}って（　）ところです。', options: ['いる', 'みる', 'しまう', 'おく'], correct: 0, why: 'Đang → **Vている + ところ**.' },
        { q: 'A「もう{宿題|しゅくだい}{終|お}わった？」 B「うん、さっき{全部|ぜんぶ}やっ（　）。」', options: ['ちゃった', 'じゃった', 'てみた', 'ところ'], correct: 0, why: 'やってしまった → **やっちゃった** — làm xong hết rồi.' },
        { q: 'あの{人|ひと}はもう{大人|おとな}（　）のに、{漢字|かんじ}が{全然|ぜんぜん}{書|か}けません。', options: ['だ', 'な', 'の', 'で'], correct: 1, why: 'N + **な** + のに.' },
        { q: '（　）、{傘|かさ}を{持|も}っていきましょう。', options: ['{晴|は}れているのに', '{晴|は}れているけど', '{晴|は}れているので', '{晴|は}れているところ'], correct: 1, why: 'Vế sau là lời rủ → **けど**. Nắng nhưng (đề phòng) mang ô đi.' },
        { q: '★ {昨日|きのう}は ＿＿ ＿＿ ★ ＿＿ しまいました。（{遅刻|ちこく}して／{寝坊|ねぼう}して／{授業|じゅぎょう}に／{朝|あさ}）', options: ['{遅刻|ちこく}して', '{寝坊|ねぼう}して', '{授業|じゅぎょう}に', '{朝|あさ}'], correct: 2, why: 'Câu đúng: {昨日|きのう}は **{朝|あさ} {寝坊|ねぼう}して {授業|じゅぎょう}に {遅刻|ちこく}して** しまいました. Ô ★ (thứ 3) = **{授業|じゅぎょう}に**.' },
        { q: '★ {今|いま} ＿＿ ＿＿ ★ ＿＿ です。（ところ／{駅|えき}に／ちょうど／{着|つ}いた）', options: ['ところ', '{駅|えき}に', 'ちょうど', '{着|つ}いた'], correct: 3, why: 'Câu đúng: {今|いま} **ちょうど {駅|えき}に {着|つ}いた ところ** です. Ô ★ (thứ 3) = **{着|つ}いた**.' },
      ],
    },
    { t: 'h', text: '③ 読解' },
    {
      t: 'passage',
      title: '{小林店長|こばやしてんちょう}からのメモ',
      intro: 'Sáng thứ Hai, ナタポン thấy mẩu ghi chú này dán trên tủ ở phòng nhân viên của quán ひまわり食堂. Đọc rồi trả lời câu hỏi.',
      paras: [
        { text: 'アルバイトのみなさんへ' },
        { text: '{先週|せんしゅう}、{注文|ちゅうもん}の{間違|まちが}いが{三回|さんかい}ありました。{忙|いそが}しいときは、{誰|だれ}でも{間違|まちが}えてしまいます。{気|き}にしなくていいですが、{同|おな}じ{失敗|しっぱい}をしないで、{次|つぎ}のことをしてみてください。' },
        { text: '①{注文|ちゅうもん}を{聞|き}いたら、お{客様|きゃくさま}の{前|まえ}で{声|こえ}に{出|だ}して{読|よ}んでください。②{料理|りょうり}を{運|はこ}ぶ{前|まえ}に、テーブルの{番号|ばんごう}をもう{一度|いちど}{見|み}てください。' },
        { text: 'それから、お{皿|さら}やコップを{割|わ}ってしまったときは、{自分|じぶん}で{片付|かたづ}けないで、すぐ{私|わたし}を{呼|よ}んでください。けがをしたら{大変|たいへん}ですから。' },
        { text: '{来月|らいげつ}から、ナタポンくんが{作|つく}ってみたカレーを{新|あたら}しいメニューに{入|い}れます。みなさんも{食|た}べてみてくださいね。　{小林|こばやし}' },
      ],
    },
    {
      t: 'mcq',
      id: 'b19-lt5-doc',
      title: '読解 (3 câu)',
      items: [
        { q: '{注文|ちゅうもん}を{聞|き}いたら、どうしてくださいと{書|か}いてありますか。', options: ['メモを{二回|にかい}{書|か}く', '{注文|ちゅうもん}をお{客様|きゃくさま}の{前|まえ}で{声|こえ}に{出|だ}して{読|よ}む', '{忙|いそが}しいときは{注文|ちゅうもん}を{聞|き}かない', '{店長|てんちょう}に{注文|ちゅうもん}を{聞|き}いてもらう'], correct: 1, why: '**①{注文|ちゅうもん}を{聞|き}いたら、お{客様|きゃくさま}の{前|まえ}で{声|こえ}に{出|だ}して{読|よ}んでください** (cùng ② xem lại số bàn).' },
        { q: 'お{皿|さら}を{割|わ}ってしまったとき、どうしなければなりませんか。', options: ['{自分|じぶん}ですぐ{片付|かたづ}ける', 'お{客様|きゃくさま}に{謝|あやま}ってから{片付|かたづ}ける', '{片付|かたづ}けないで、すぐ{店長|てんちょう}を{呼|よ}ぶ', '{新|あたら}しいお{皿|さら}を{買|か}ってくる'], correct: 2, why: '**{自分|じぶん}で{片付|かたづ}けないで、すぐ{私|わたし}を{呼|よ}んでください** — vì sợ bị thương.' },
        { q: 'メモの{内容|ないよう}と{合|あ}っているのはどれですか。', options: ['{先週|せんしゅう}は{注文|ちゅうもん}の{間違|まちが}いが{一回|いっかい}もなかった。', '{店長|てんちょう}は{間違|まちが}えた{人|ひと}をとても{怒|おこ}っている。', 'ナタポンさんが{作|つく}ったカレーが{来月|らいげつ}からメニューに{入|はい}る。', '{新|あたら}しいカレーは{店長|てんちょう}が{作|つく}った。'], correct: 2, why: '**ナタポンくんが{作|つく}ってみたカレーを{新|あたら}しいメニューに{入|い}れます**. Có 3 lần nhầm; quản lý nói **{気|き}にしなくていい** (không giận).' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('{忙|いそが}しいときは、{誰|だれ}でも{間違|まちが}えてしまいます。', 'Isogashii toki wa, dare demo machigaete shimaimasu.', 'Lúc bận thì ai cũng có thể lỡ nhầm.'),
        E('{次|つぎ}のことをしてみてください。', 'Tsugi no koto o shite mite kudasai.', 'Các bạn hãy thử làm những việc sau.'),
        E('{割|わ}ってしまったときは、すぐ{私|わたし}を{呼|よ}んでください。', 'Watte shimatta toki wa, sugu watashi o yonde kudasai.', 'Khi lỡ làm vỡ thì hãy gọi tôi ngay.'),
        E('ナタポンくんが{作|つく}ってみたカレーをメニューに{入|い}れます。', 'Natapon-kun ga tsukutte mita karee o menyuu ni iremasu.', 'Tôi sẽ đưa món cà ri Nattapon làm thử vào thực đơn.'),
      ],
    },
  ],
};

export const BAI_19: Lesson[] = [
  // ① Cốt lõi
  HOI_THOAI, TU_VUNG, NGU_PHAP, HAN_TU, NGHE, DOC, NOI, VIET, BAI_TAP,
  // ② Theo buổi trên lớp
  BUOI_1, BUOI_2, BUOI_3,
  // ③ Luyện thêm dễ → khó
  LT_1, LT_2, LT_3, LT_4, LT_5,
];
