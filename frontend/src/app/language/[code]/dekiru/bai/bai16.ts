/**
 * Bài 16 — アルバイト (Làm thêm) · TIẾP SAU SÁCH, cấp N4 (xem ../SOAN-BAI.md mục 8).
 * Bài đầu tiên sau できる日本語 初級: người học vừa xong Bài 15 (ポイント 119–124).
 *
 * Ngữ pháp (N4): ① thể khả năng 可能形 (書ける・食べられる・できる・来られる) — năng lực và hoàn cảnh,
 * so với ～ことができます (ôn Bài 9 ポイント 82, Bài 10 ポイント 93) và 見えます／聞こえます (ôn Bài 10
 * ポイント 94) · ② thể ý chí 意向形 (行こう・食べよう・しよう・来よう) — rủ bạn kiểu thân mật, ～（よ）うか,
 * ～（よ）うと思います／思っています · ③ ～つもりです／～ないつもりです／～つもりはありません, kèm
 * ～予定です (cùng nhóm "dự định", cấp N4) và bảng phân biệt ba cách nói dự định.
 * Từ vựng: 50 từ N4 (tìm việc, phỏng vấn, ở chỗ làm, giỏi/kém, tương lai). Chữ Hán mới (15):
 * 代 意 考 答 問 質 正 工 堂 面 接 決 夢 将 守 — không trùng hanTu.ts lẫn bảng chữ Hán Bài 1–15.
 * Hội thoại, câu ví dụ, bài đọc, kịch bản nghe: VIẾT MỚI 100%, không chép giáo trình/đề thi nào.
 *
 * Nhân vật (giới tính quyết định giọng đọc, theo bai1.ts): nữ = アンナ, ワン, パク, メアリー ·
 * nam = ナタポン, マルコ, カルロス, ダニエル. Người MỚI của bài này:
 *  - {小林|こばやし}{店長|てんちょう} — nam, giọng ja-nam (role 'examiner' trong hội thoại) — chủ quán
 *    「ひまわり{食堂|しょくどう}」 nơi ナタポン xin làm thêm.
 *  - {鈴木|すずき}さん — nữ, giọng ja-nu (role 'c') — chị khoá trên làm ở cửa hàng tiện lợi, dạy ワン ngày đầu.
 * Hội thoại: role 'a'/'c' = giọng nữ, 'b'/'examiner' = giọng nam. Nghe: 'ja-nu' = nữ, 'ja-nam' = nam.
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
  id: 'b16-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — アルバイト: xin việc làm thêm, kể kế hoạch tương lai, ngày đầu đi làm',
  goal: 'Đi phỏng vấn làm thêm và trả lời được "bạn làm được gì, đến được ngày nào" bằng thể khả năng; kể cho bạn bè kế hoạch nghỉ hè và sau khi tốt nghiệp bằng ～（よ）うと思っています／～つもりです／～予定です; ngày đầu đi làm thì nói được mình làm được / chưa làm được việc gì và nói chuyện thân mật với đồng nghiệp bằng thể ý chí (やろう・休憩しよう).',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Bài 16 — từ đây là phần TIẾP SAU SÁCH (cấp N4)',
      items: [
        'Sách できる日本語 初級 dừng ở Bài 15 (ポイント 124). Từ Bài 16, khoá đi tiếp **cùng khuôn lớp** lên N4 → N3 → N2: mỗi bài có hội thoại, từ vựng, ngữ pháp, chữ Hán, nghe, đọc, nói, viết, bài tập, 3 buổi học trên lớp và bộ luyện thêm.',
        'Chủ đề Bài 16: **アルバイト** — đời sống du học sinh ở Nhật luôn gắn với làm thêm: đọc tờ tuyển người, đi **phỏng vấn (面接)**, ngày đầu đi làm, và kể **dự định tương lai**.',
        'Ba mẫu ngữ pháp N4: **thể khả năng** ({話|はな}せます, {来|こ}られます), **thể ý chí** ({行|い}こう, やろう) và **～つもりです**.',
        'Mọi câu có furigana và romaji; bấm 🔊 để nghe từng câu rồi đọc to theo.',
      ],
    },
    {
      t: 'note',
      title: 'Học xong bài 16 bạn làm được (できる)',
      items: [
        '**① アルバイトの{面接|めんせつ}** — đọc tờ tuyển người làm thêm, gọi điện/đến quán xin việc, trả lời câu hỏi phỏng vấn: **{日本語|にほんご}が{話|はな}せます**, **{漢字|かんじ}が{少|すこ}し{読|よ}めます**, **{土日|どにち}も{来|こ}られます**, **{夜|よる}{10時|じゅうじ}まで{働|はたら}けます**.',
        '**② {将来|しょうらい}の{計画|けいかく}** — kể với bạn kế hoạch nghỉ hè và sau khi tốt nghiệp: **{国|くに}へ{帰|かえ}ろうと{思|おも}っています**, **{日本|にほん}で{就職|しゅうしょく}するつもりです**, **{大学院|だいがくいん}に{進学|しんがく}する{予定|よてい}です**; nói được điều mình **không định làm** (～ないつもりです).',
        '**③ バイトの{初日|しょにち}** — ngày đầu làm ở cửa hàng tiện lợi: nói việc mình **làm được / chưa làm được** (まだ一人でレジが打てません), nghe chị khoá trên hướng dẫn và nói chuyện thân mật: **{一緒|いっしょ}にやろう**, **{休憩|きゅうけい}しようか**.',
        '**できる！** — tự giới thiệu 1 phút trong buổi phỏng vấn làm thêm: mình là ai, làm được gì, đến được lúc nào, vì sao muốn làm, và dự định sắp tới.',
      ],
    },
    {
      t: 'table',
      caption: 'Bức tranh chung của bài — từ tờ tuyển người đến ngày đầu đi làm',
      head: ['Lúc', 'Câu then chốt', 'Romaji', 'Mẫu'],
      rows: [
        ['Đọc tờ tuyển người', '{日本語|にほんご}が{話|はな}せる{方|かた}、{募集|ぼしゅう}しています。', 'Nihongo ga hanaseru kata, boshuu shite imasu.', 'thể khả năng + N'],
        ['Bị hỏi khi phỏng vấn', '{何曜日|なんようび}に{来|こ}られますか。', 'Nan\'youbi ni koraremasu ka.', 'thể khả năng'],
        ['Trả lời', '{月曜日|げつようび}と{木曜日|もくようび}と{土日|どにち}に{来|こ}られます。', 'Getsuyoubi to mokuyoubi to donichi ni koraremasu.', 'thể khả năng'],
        ['Nói điều chưa làm được', '{漢字|かんじ}はまだあまり{読|よ}めません。', 'Kanji wa mada amari yomemasen.', 'thể khả năng (phủ định)'],
        ['Kể dự định (mềm)', '{夏休|なつやす}みは{国|くに}へ{帰|かえ}ろうと{思|おも}っています。', 'Natsuyasumi wa kuni e kaerou to omotte imasu.', 'thể ý chí + と思っています'],
        ['Kể dự định (đã quyết)', '{卒業|そつぎょう}したら、{日本|にほん}で{就職|しゅうしょく}するつもりです。', 'Sotsugyou shitara, Nihon de shuushoku suru tsumori desu.', 'V辞書形 + つもり'],
        ['Kể lịch đã định', '{来月|らいげつ}、{日本語能力試験|にほんごのうりょくしけん}を{受|う}ける{予定|よてい}です。', 'Raigetsu, nihongo nouryoku shiken o ukeru yotei desu.', 'V辞書形 + 予定'],
        ['Rủ đồng nghiệp (thân)', 'そろそろ{休憩|きゅうけい}しよう。', 'Sorosoro kyuukei shiyou.', 'thể ý chí (= ましょう)'],
      ],
    },

    /* ── ① アルバイトの面接 ── */
    { t: 'h', text: '① アルバイトの{面接|めんせつ} — Đi phỏng vấn làm thêm' },
    {
      t: 'p',
      text: 'Tình huống 1: ở căng tin trường, **ナタポン** và **マルコ** xem tờ **tuyển người làm thêm (アルバイト{募集|ぼしゅう})** của quán ăn 「ひまわり{食堂|しょくどう}」. Trên tờ ghi điều kiện bằng **thể khả năng**: {日本語|にほんご}が{話|はな}せる{方|かた} (người nói được tiếng Nhật), {土日|どにち}に{働|はたら}ける{方|かた} (người làm được thứ Bảy, Chủ nhật). Tình huống 2: ナタポン đến quán **phỏng vấn** với {小林|こばやし}{店長|てんちょう}. Câu hỏi phỏng vấn gần như toàn là **～られますか／～えますか** (làm được … không?).',
    },
    DL('Ở căng tin — "Quán này đang tuyển người kìa!"', [
      ['マルコ', 'b', 'ナタポンさん、これ、{見|み}て。ひまわり{食堂|しょくどう}でアルバイトを{募集|ぼしゅう}していますよ。', 'Natapon-san, kore, mite. Himawari shokudou de arubaito o boshuu shite imasu yo.', 'Nattapong, xem này. Quán Himawari đang tuyển người làm thêm đấy.'],
      ['ナタポン', 'b', 'へえ、{時給|じきゅう}{1,100円|せんひゃくえん}ですか。いいですね。', 'Hee, jikyuu sen hyaku en desu ka. Ii desu ne.', 'Ồ, lương giờ 1.100 yên à. Được đấy.'],
      ['マルコ', 'b', '{条件|じょうけん}は「{日本語|にほんご}が{少|すこ}し{話|はな}せる{方|かた}」と「{土日|どにち}に{働|はたら}ける{方|かた}」です。', 'Jouken wa "Nihongo ga sukoshi hanaseru kata" to "Donichi ni hatarakeru kata" desu.', 'Điều kiện là "người nói được chút tiếng Nhật" và "người làm được thứ Bảy, Chủ nhật".'],
      ['ナタポン', 'b', '{土日|どにち}は{授業|じゅぎょう}がありませんから、{働|はたら}けます。{日本語|にほんご}も、まあ、{話|はな}せますね。', 'Donichi wa jugyou ga arimasen kara, hatarakemasu. Nihongo mo, maa, hanasemasu ne.', 'Thứ Bảy, Chủ nhật không có giờ học nên mình làm được. Tiếng Nhật thì… cũng nói được nhỉ.'],
      ['マルコ', 'b', '{交通費|こうつうひ}も{出|で}るそうですよ。{早|はや}く{電話|でんわ}したほうがいいですよ。', 'Koutsuuhi mo deru sou desu yo. Hayaku denwa shita hou ga ii desu yo.', 'Nghe nói còn được trả tiền đi lại nữa. Cậu nên gọi điện sớm đi.'],
      ['ナタポン', 'b', 'そうですね。{今日|きょう}{電話|でんわ}して、{面接|めんせつ}を{受|う}けようと{思|おも}います。', 'Sou desu ne. Kyou denwa shite, mensetsu o ukeyou to omoimasu.', 'Ừ nhỉ. Mình định hôm nay gọi điện rồi đi phỏng vấn.'],
      ['マルコ', 'b', '{頑張|がんば}って！ {履歴書|りれきしょ}を{忘|わす}れないでくださいね。', 'Ganbatte! Rirekisho o wasurenaide kudasai ne.', 'Cố lên! Đừng quên sơ yếu lý lịch nhé.'],
    ]),
    {
      t: 'note',
      title: 'Ghi chú đoạn ở căng tin',
      items: [
        '**～{方|かた}** = "người" (lịch sự hơn {人|ひと}) — tờ tuyển người luôn viết **thể khả năng + {方|かた}**: {話|はな}せる{方|かた}, {働|はたら}ける{方|かた}. Thể khả năng đứng trước danh từ y như thể từ điển (ôn ポイント 109: câu bổ nghĩa cho danh từ).',
        '**{交通費|こうつうひ}が{出|で}ます** = được trả tiền đi lại (出ます ở đây = "được chi"). **～たほうがいいです** (nên…) ôn Bài 12 ポイント 105.',
        '**{頑張|がんば}って！** = "Cố lên!" — câu cổ vũ thân mật, rút gọn của {頑張|がんば}ってください. Người được cổ vũ đáp **はい、{頑張|がんば}ります**.',
      ],
    },
    DL('Phỏng vấn ở ひまわり{食堂|しょくどう} — "Em làm được thứ mấy?"', [
      ['ナタポン', 'b', '{失礼|しつれい}します。{今日|きょう}{面接|めんせつ}をお{願|ねが}いしたナタポンです。よろしくお{願|ねが}いします。', 'Shitsurei shimasu. Kyou mensetsu o onegai shita Natapon desu. Yoroshiku onegai shimasu.', 'Xin phép ạ. Em là Nattapong, người hẹn phỏng vấn hôm nay. Rất mong được giúp đỡ.'],
      ['{小林|こばやし}{店長|てんちょう}', 'examiner', '{店長|てんちょう}の{小林|こばやし}です。どうぞ、{座|すわ}ってください。{日本語|にほんご}、{上手|じょうず}ですね。どのぐらい{勉強|べんきょう}しましたか。', 'Tenchou no Kobayashi desu. Douzo, suwatte kudasai. Nihongo, jouzu desu ne. Dono gurai benkyou shimashita ka.', 'Tôi là Kobayashi, quản lý. Mời ngồi. Tiếng Nhật của em giỏi nhỉ. Em học bao lâu rồi?'],
      ['ナタポン', 'b', '{1年半|いちねんはん}です。でも、{敬語|けいご}はまだあまり{上手|じょうず}に{話|はな}せません。', 'Ichinen han desu. Demo, keigo wa mada amari jouzu ni hanasemasen.', 'Một năm rưỡi ạ. Nhưng kính ngữ thì em chưa nói giỏi lắm.'],
      ['{小林|こばやし}{店長|てんちょう}', 'examiner', '{大丈夫|だいじょうぶ}ですよ。すぐ{覚|おぼ}えられます。{漢字|かんじ}は{読|よ}めますか。メニューは{全部|ぜんぶ}{漢字|かんじ}なんです。', 'Daijoubu desu yo. Sugu oboeraremasu. Kanji wa yomemasu ka. Menyuu wa zenbu kanji na n desu.', 'Không sao đâu. Em sẽ nhớ được nhanh thôi. Em đọc được chữ Hán không? Thực đơn toàn chữ Hán.'],
      ['ナタポン', 'b', '{簡単|かんたん}な{漢字|かんじ}は{読|よ}めます。でも、{難|むずか}しい{漢字|かんじ}はまだ{読|よ}めません。', 'Kantan na kanji wa yomemasu. Demo, muzukashii kanji wa mada yomemasen.', 'Chữ Hán đơn giản thì em đọc được. Nhưng chữ khó thì em chưa đọc được ạ.'],
      ['{小林|こばやし}{店長|てんちょう}', 'examiner', 'そうですか。{何曜日|なんようび}に{来|こ}られますか。', 'Sou desu ka. Nan\'youbi ni koraremasu ka.', 'Vậy à. Em đến được vào thứ mấy?'],
      ['ナタポン', 'b', '{火曜日|かようび}と{金曜日|きんようび}の{夕方|ゆうがた}と、{土日|どにち}に{来|こ}られます。', 'Kayoubi to kin\'youbi no yuugata to, donichi ni koraremasu.', 'Em đến được chiều tối thứ Ba, thứ Sáu và thứ Bảy, Chủ nhật ạ.'],
      ['{小林|こばやし}{店長|てんちょう}', 'examiner', '{夜|よる}は{何時|なんじ}まで{働|はたら}けますか。', 'Yoru wa nanji made hatarakemasu ka.', 'Buổi tối em làm được đến mấy giờ?'],
      ['ナタポン', 'b', '{10時|じゅうじ}まで{働|はたら}けます。{寮|りょう}が{近|ちか}いですから、{自転車|じてんしゃ}で{5分|ごふん}で{来|こ}られます。', 'Juuji made hatarakemasu. Ryou ga chikai desu kara, jitensha de gofun de koraremasu.', 'Em làm được đến 10 giờ. Ký túc xá gần nên đi xe đạp 5 phút là em đến được.'],
      ['{小林|こばやし}{店長|てんちょう}', 'examiner', 'いいですね。{料理|りょうり}は{得意|とくい}ですか。', 'Ii desu ne. Ryouri wa tokui desu ka.', 'Tốt đấy. Em nấu ăn có giỏi không?'],
      ['ナタポン', 'b', 'はい、タイ{料理|りょうり}が{作|つく}れます。お{皿|さら}を{洗|あら}うことも、{料理|りょうり}を{運|はこ}ぶこともできます。{一生懸命|いっしょうけんめい}{頑張|がんば}ります。', 'Hai, Tai ryouri ga tsukuremasu. Osara o arau koto mo, ryouri o hakobu koto mo dekimasu. Isshoukenmei ganbarimasu.', 'Vâng, em nấu được món Thái. Rửa bát hay bưng món em đều làm được. Em sẽ cố gắng hết sức.'],
      ['{小林|こばやし}{店長|てんちょう}', 'examiner', 'わかりました。じゃ、{来週|らいしゅう}の{火曜日|かようび}から{来|き}てください。', 'Wakarimashita. Ja, raishuu no kayoubi kara kite kudasai.', 'Được rồi. Vậy từ thứ Ba tuần sau em đến làm nhé.'],
      ['ナタポン', 'b', 'ありがとうございます！ よろしくお{願|ねが}いします。', 'Arigatou gozaimasu! Yoroshiku onegai shimasu.', 'Em cảm ơn ạ! Mong anh giúp đỡ.'],
    ]),
    {
      t: 'examples',
      items: [
        E('{日本語|にほんご}が{話|はな}せますか。——はい、{少|すこ}し{話|はな}せます。', 'Nihongo ga hanasemasu ka. — Hai, sukoshi hanasemasu.', 'Bạn nói được tiếng Nhật không? — Vâng, nói được một chút.'),
        E('{漢字|かんじ}が{読|よ}めますか。——{簡単|かんたん}な{漢字|かんじ}は{読|よ}めますが、{難|むずか}しい{漢字|かんじ}は{読|よ}めません。', 'Kanji ga yomemasu ka. — Kantan na kanji wa yomemasu ga, muzukashii kanji wa yomemasen.', 'Bạn đọc được chữ Hán không? — Chữ dễ thì đọc được, chữ khó thì không.'),
        E('{何曜日|なんようび}に{来|こ}られますか。——{火曜日|かようび}と{金曜日|きんようび}に{来|こ}られます。', 'Nan\'youbi ni koraremasu ka. — Kayoubi to kin\'youbi ni koraremasu.', 'Bạn đến được thứ mấy? — Tôi đến được thứ Ba và thứ Sáu.'),
        E('{夜|よる}{遅|おそ}くまで{働|はたら}けますか。——すみません、{9時|くじ}までしか……。', 'Yoru osoku made hatarakemasu ka. — Sumimasen, kuji made shika…….', 'Bạn làm được đến khuya không? — Xin lỗi, tôi chỉ đến 9 giờ thôi… (bỏ lửng cho lịch sự)'),
        E('{料理|りょうり}は{得意|とくい}ですか。——はい、{得意|とくい}です。ベトナム{料理|りょうり}が{作|つく}れます。', 'Ryouri wa tokui desu ka. — Hai, tokui desu. Betonamu ryouri ga tsukuremasu.', 'Bạn nấu ăn giỏi không? — Vâng, giỏi ạ. Tôi nấu được món Việt.'),
        E('{一生懸命|いっしょうけんめい}{頑張|がんば}ります。よろしくお{願|ねが}いします。', 'Isshoukenmei ganbarimasu. Yoroshiku onegai shimasu.', 'Em sẽ cố gắng hết sức. Rất mong được giúp đỡ. (câu chốt buổi phỏng vấn)'),
      ],
    },
    {
      t: 'note',
      title: 'Biểu hiện của buổi phỏng vấn — và lỗi người Việt hay mắc',
      items: [
        'Vào phòng: **{失礼|しつれい}します** (xin phép vào). Ra về: **ありがとうございました。{失礼|しつれい}します**. Đừng nói ~~こんにちは~~ khi bước vào phòng phỏng vấn.',
        'Được khen "{日本語|にほんご}、{上手|じょうず}ですね" → **khiêm tốn**: いいえ、まだまだです／{敬語|けいご}はまだ{上手|じょうず}に{話|はな}せません. Đừng đáp ~~はい、{上手|じょうず}です~~.',
        'Hỏi "làm được không" mà mình **không làm được** → đừng nói cụt ~~できません~~; nói kèm mức độ: **{少|すこ}し**／**まだあまり**／**{簡単|かんたん}な～は** + thể khả năng phủ định, rồi thêm **{頑張|がんば}って{覚|おぼ}えます**.',
        '**{来|こ}られます** (koraremasu) — thể khả năng của {来|き}ます đọc **こ**, không phải ~~きられます~~. Văn nói hay rút thành {来|こ}れます (ら抜き) — hiểu được, nhưng đi phỏng vấn và đi thi hãy nói **{来|こ}られます**.',
        '**～しか……** (chỉ … thôi) đi với **phủ định**: {9時|くじ}までしか{働|はたら}けません. Bỏ lửng "…までしか……" là cách từ chối mềm rất hay dùng khi phỏng vấn.',
      ],
    },

    /* ── ② 将来の計画 ── */
    { t: 'h', text: '② {将来|しょうらい}の{計画|けいかく} — Kể dự định nghỉ hè và sau khi tốt nghiệp' },
    {
      t: 'p',
      text: 'Tình huống: cuối học kỳ, **アンナ** và **マルコ** nói chuyện ở quán cà phê gần trường. Hai người kể kế hoạch **nghỉ hè** và **sau khi tốt nghiệp**. Chú ý ba cách nói dự định: **～（よ）うと{思|おも}っています** (đang tính, chưa chắc hẳn), **～つもりです** (đã quyết trong lòng), **～{予定|よてい}です** (đã lên lịch, gần như chắc chắn — vé đã mua, ngày thi đã định).',
    },
    DL('Ở quán cà phê — "Nghỉ hè cậu định làm gì?"', [
      ['アンナ', 'c', 'マルコさん、{夏休|なつやす}みはどうするんですか。', 'Maruko-san, natsuyasumi wa dou suru n desu ka.', 'Marco, nghỉ hè cậu định làm gì?'],
      ['マルコ', 'b', '{8月|はちがつ}に{国|くに}へ{帰|かえ}る{予定|よてい}です。もう{飛行機|ひこうき}のチケットを{買|か}いました。', 'Hachigatsu ni kuni e kaeru yotei desu. Mou hikouki no chiketto o kaimashita.', 'Mình về nước vào tháng 8. Mình mua vé máy bay rồi.'],
      ['アンナ', 'c', 'いいですね。{国|くに}で{何|なに}をしますか。', 'Ii desu ne. Kuni de nani o shimasu ka.', 'Thích nhỉ. Về nước cậu làm gì?'],
      ['マルコ', 'b', '{家族|かぞく}と{海|うみ}へ{行|い}こうと{思|おも}っています。アンナさんは？', 'Kazoku to umi e ikou to omotte imasu. Anna-san wa?', 'Mình đang tính đi biển với gia đình. Còn Anna?'],
      ['アンナ', 'c', '{私|わたし}は{帰|かえ}らないつもりです。{夏休|なつやす}みはアルバイトをたくさんして、お{金|かね}を{貯|た}めようと{思|おも}っています。', 'Watashi wa kaeranai tsumori desu. Natsuyasumi wa arubaito o takusan shite, okane o tameyou to omotte imasu.', 'Mình định không về. Nghỉ hè mình tính làm thêm thật nhiều để dành tiền.'],
      ['マルコ', 'b', 'お{金|かね}を{貯|た}めて、{何|なに}をするんですか。', 'Okane o tamete, nani o suru n desu ka.', 'Để dành tiền rồi cậu làm gì?'],
      ['アンナ', 'c', '{来年|らいねん}、{大学院|だいがくいん}に{進学|しんがく}するつもりなんです。{大学院|だいがくいん}は{学費|がくひ}が{高|たか}いですから。', 'Rainen, daigakuin ni shingaku suru tsumori na n desu. Daigakuin wa gakuhi ga takai desu kara.', 'Sang năm mình định học lên cao học. Vì học phí cao học đắt lắm.'],
      ['マルコ', 'b', 'すごいですね。{僕|ぼく}はまだ{決|き}めていません。{卒業|そつぎょう}したら、{日本|にほん}で{就職|しゅうしょく}しようか、{国|くに}へ{帰|かえ}ろうか、{考|かんが}えているんです。', 'Sugoi desu ne. Boku wa mada kimete imasen. Sotsugyou shitara, Nihon de shuushoku shiyou ka, kuni e kaerou ka, kangaete iru n desu.', 'Giỏi thật. Mình thì chưa quyết. Tốt nghiệp xong nên đi làm ở Nhật hay về nước, mình đang suy nghĩ.'],
      ['アンナ', 'c', 'マルコさんの{夢|ゆめ}は{何|なん}ですか。', 'Maruko-san no yume wa nan desu ka.', 'Ước mơ của Marco là gì?'],
      ['マルコ', 'b', '{日本|にほん}とイタリアの{会社|かいしゃ}をつなぐ{仕事|しごと}がしたいです。だから、{来月|らいげつ}の{日本語能力試験|にほんごのうりょくしけん}は{絶対|ぜったい}{合格|ごうかく}しようと{思|おも}います！', 'Nihon to Itaria no kaisha o tsunagu shigoto ga shitai desu. Dakara, raigetsu no nihongo nouryoku shiken wa zettai goukaku shiyou to omoimasu!', 'Mình muốn làm công việc kết nối công ty Nhật với công ty Ý. Nên kỳ thi năng lực tiếng Nhật tháng sau mình nhất định phải đỗ!'],
      ['アンナ', 'c', 'じゃ、{一緒|いっしょ}に{勉強|べんきょう}しよう！ {図書館|としょかん}、{今|いま}から{行|い}こうか。', 'Ja, issho ni benkyou shiyou! Toshokan, ima kara ikou ka.', 'Vậy cùng học nhé! Giờ đi thư viện luôn nhé?'],
      ['マルコ', 'b', 'うん、{行|い}こう。', 'Un, ikou.', 'Ừ, đi thôi.'],
    ]),
    {
      t: 'examples',
      items: [
        E('{夏休|なつやす}みは{何|なに}をしようと{思|おも}っていますか。——{北海道|ほっかいどう}へ{旅行|りょこう}しようと{思|おも}っています。', 'Natsuyasumi wa nani o shiyou to omotte imasu ka. — Hokkaidou e ryokou shiyou to omotte imasu.', 'Nghỉ hè bạn đang tính làm gì? — Tôi đang tính đi du lịch Hokkaido.'),
        E('{卒業|そつぎょう}したら、どうするつもりですか。——{国|くに}へ{帰|かえ}って、{日本|にほん}の{会社|かいしゃ}で{働|はたら}くつもりです。', 'Sotsugyou shitara, dou suru tsumori desu ka. — Kuni e kaette, Nihon no kaisha de hataraku tsumori desu.', 'Tốt nghiệp xong bạn định làm gì? — Tôi định về nước làm ở một công ty Nhật.'),
        E('{今年|ことし}の{夏|なつ}は{国|くに}へ{帰|かえ}らないつもりです。', 'Kotoshi no natsu wa kuni e kaeranai tsumori desu.', 'Hè năm nay tôi định không về nước.'),
        E('{8月|はちがつ}{3日|みっか}に{帰国|きこく}する{予定|よてい}です。', 'Hachigatsu mikka ni kikoku suru yotei desu.', 'Tôi sẽ về nước ngày 3 tháng 8 (đã định lịch).'),
        E('{将来|しょうらい}の{夢|ゆめ}は{通訳|つうやく}になることです。', 'Shourai no yume wa tsuuyaku ni naru koto desu.', 'Ước mơ tương lai của tôi là trở thành phiên dịch viên.'),
        E('{一緒|いっしょ}に{勉強|べんきょう}しよう。——うん、そうしよう。', 'Issho ni benkyou shiyou. — Un, sou shiyou.', 'Cùng học nhé. — Ừ, làm thế đi. (thân mật = ～ましょう)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ②',
      items: [
        '**どうするんですか** (ôn ～んです, Bài 12) — hỏi "định làm thế nào" một cách quan tâm. Trả lời bằng ～{予定|よてい}です／～つもりです／～（よ）うと{思|おも}っています, **không** trả lời bằng ~~～んです~~ cụt.',
        '**{帰|かえ}らないつもりです** = định KHÔNG về. Đừng nói ~~{帰|かえ}るつもりじゃないです~~ để nói "định không về" — nghe như "không phải là định về" (lạ). Ý định phủ định: **Vない + つもりです**.',
        '**{就職|しゅうしょく}しようか、{帰|かえ}ろうか、{考|かんが}えています** — thể ý chí + か, lặp hai lần = "nên A hay nên B" khi còn phân vân. Rất hay gặp khi kể chuyện chưa quyết.',
        '**{僕|ぼく}** — nam giới tự xưng thân mật (Marco nói với bạn). Khi phỏng vấn, nam nữ đều nói **{私|わたし}**.',
        '**つなぐ** (nối, kết nối) và **{絶対|ぜったい}** (nhất định, tuyệt đối) chỉ để nghe hiểu ở đây; {学費|がくひ} = học phí, {通訳|つうやく} = phiên dịch (nói).',
      ],
    },

    /* ── ③ バイトの初日 ── */
    { t: 'h', text: '③ バイトの{初日|しょにち} — Ngày đầu làm ở cửa hàng tiện lợi' },
    {
      t: 'p',
      text: 'Tình huống: **ワン** bắt đầu làm thêm ở một cửa hàng tiện lợi. **{鈴木|すずき}さん** — chị khoá trên làm ở đây đã một năm — hướng dẫn ngày đầu. Hai người nói **thể thường (友達言葉, ôn Bài 11 ポイント 103)**, nên lời rủ "～ましょう" thành **thể ý chí**: やろう, {休憩|きゅうけい}しよう. Câu hỏi "làm được không" cũng ở thể thường: レジ、{打|う}てる？',
    },
    DL('Ở cửa hàng tiện lợi — "Em tính tiền được chưa?"', [
      ['{鈴木|すずき}', 'c', 'ワンさん、おはよう。{今日|きょう}からよろしくね。', 'Wan-san, ohayou. Kyou kara yoroshiku ne.', 'Wang, chào em. Từ hôm nay mong em giúp đỡ nhé.'],
      ['ワン', 'a', 'おはようございます。よろしくお{願|ねが}いします。', 'Ohayou gozaimasu. Yoroshiku onegai shimasu.', 'Em chào chị ạ. Mong chị giúp đỡ.'],
      ['{鈴木|すずき}', 'c', 'コンビニのバイト、{初|はじ}めて？ レジ、{打|う}てる？', 'Konbini no baito, hajimete? Reji, uteru?', 'Lần đầu em làm ở cửa hàng tiện lợi à? Em tính tiền được không?'],
      ['ワン', 'a', '{国|くに}で{少|すこ}しやったことがありますが、{日本|にほん}のレジはまだ{一人|ひとり}で{打|う}てません。', 'Kuni de sukoshi yatta koto ga arimasu ga, Nihon no reji wa mada hitori de utemasen.', 'Ở bên nước em đã làm một chút, nhưng máy tính tiền ở Nhật thì em chưa tự làm một mình được ạ.'],
      ['{鈴木|すずき}', 'c', '{大丈夫|だいじょうぶ}。{最初|さいしょ}は{一緒|いっしょ}にやろう。{私|わたし}がやるから、よく{見|み}てて。', 'Daijoubu. Saisho wa issho ni yarou. Watashi ga yaru kara, yoku mitete.', 'Không sao. Lúc đầu mình cùng làm nhé. Chị làm, em nhìn kỹ nhé.'],
      ['ワン', 'a', 'はい。……あのう、お{弁当|べんとう}を{温|あたた}めるとき、{何|なん}と{言|い}いますか。', 'Hai. …… Anou, obentou o atatameru toki, nan to iimasu ka.', 'Vâng. … À, khi hâm nóng cơm hộp thì nói thế nào ạ?'],
      ['{鈴木|すずき}', 'c', '「お{弁当|べんとう}、{温|あたた}めますか」。{敬語|けいご}は{難|むずか}しいけど、{毎日|まいにち}{使|つか}ったら、すぐ{覚|おぼ}えられるよ。', '"Obentou, atatamemasu ka". Keigo wa muzukashii kedo, mainichi tsukattara, sugu oboerareru yo.', '"Quý khách có hâm cơm hộp không ạ?". Kính ngữ khó nhưng ngày nào cũng dùng thì nhớ được nhanh thôi.'],
      ['ワン', 'a', 'はい、{頑張|がんば}って{覚|おぼ}えます。でも、{棚|たな}にお{茶|ちゃ}を{並|なら}べることは{一人|ひとり}でできます。', 'Hai, ganbatte oboemasu. Demo, tana ni ocha o naraberu koto wa hitori de dekimasu.', 'Vâng, em sẽ cố nhớ ạ. Còn xếp trà lên kệ thì em làm một mình được.'],
      ['{鈴木|すずき}', 'c', 'ありがとう。じゃ、お{茶|ちゃ}をお{願|ねが}い。{終|お}わったら、{2時|にじ}から{一緒|いっしょ}に{休憩|きゅうけい}しよう。', 'Arigatou. Ja, ocha o onegai. Owattara, niji kara issho ni kyuukei shiyou.', 'Cảm ơn em. Vậy nhờ em xếp trà nhé. Xong thì từ 2 giờ hai chị em cùng nghỉ giải lao.'],
      ['ワン', 'a', 'はい。あのう、{鈴木|すずき}さんはずっとここで{働|はたら}くつもりですか。', 'Hai. Anou, Suzuki-san wa zutto koko de hataraku tsumori desu ka.', 'Vâng. À, chị Suzuki định làm ở đây mãi ạ?'],
      ['{鈴木|すずき}', 'c', 'ううん。{来年|らいねん}{就職|しゅうしょく}するから、{3月|さんがつ}で{辞|や}めるつもり。だから、ワンさん、{早|はや}く{覚|おぼ}えてね。', 'Uun. Rainen shuushoku suru kara, sangatsu de yameru tsumori. Dakara, Wan-san, hayaku oboete ne.', 'Không. Sang năm chị đi làm chính thức nên chị định nghỉ vào tháng 3. Nên Wang nhớ việc nhanh lên nhé.'],
      ['ワン', 'a', 'えっ、そうなんですか。{一生懸命|いっしょうけんめい}{頑張|がんば}ります！', 'E, sou na n desu ka. Isshoukenmei ganbarimasu!', 'Ơ, thế ạ. Em sẽ cố gắng hết sức!'],
    ]),
    {
      t: 'examples',
      items: [
        E('レジ、{打|う}てる？——ううん、まだ{打|う}てない。', 'Reji, uteru? — Uun, mada utenai.', 'Tính tiền được chưa? — Chưa, chưa làm được. (thể thường: 打てる／打てない)'),
        E('{一緒|いっしょ}にやろう。', 'Issho ni yarou.', 'Cùng làm nhé. (やる = する, thân mật → thể ý chí やろう)'),
        E('そろそろ{休憩|きゅうけい}しようか。——うん、そうしよう。', 'Sorosoro kyuukei shiyou ka. — Un, sou shiyou.', 'Sắp đến lúc nghỉ chưa nhỉ? — Ừ, nghỉ thôi. (～（よ）うか = ～ましょうか)'),
        E('{重|おも}いね。{手伝|てつだ}おうか。——ありがとう。', 'Omoi ne. Tetsudaou ka. — Arigatou.', 'Nặng nhỉ. Để mình giúp nhé? — Cảm ơn. (thân mật của ～ましょうか, ôn Bài 7 ポイント 65)'),
        E('{3月|さんがつ}でアルバイトを{辞|や}めるつもりです。', 'Sangatsu de arubaito o yameru tsumori desu.', 'Tôi định nghỉ làm thêm vào tháng 3.'),
        E('{時間|じかん}は{必|かなら}ず{守|まも}ってください。{遅刻|ちこく}するときは、{連絡|れんらく}してください。', 'Jikan wa kanarazu mamotte kudasai. Chikoku suru toki wa, renraku shite kudasai.', 'Nhất định phải đúng giờ. Khi đến muộn thì hãy liên lạc. (luật đầu tiên của mọi chỗ làm thêm)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ③ — nói chuyện với người trên ở chỗ làm',
      items: [
        '**Chị khoá trên nói thể thường, ワン vẫn nói です／ます** — người mới, ít tuổi hơn thì giữ lịch sự kể cả khi người kia nói thân mật. Chỉ chuyển sang thể thường khi được bảo "タメ{口|ぐち}でいいよ" (nói trống không cũng được).',
        '**やる** = する (làm) — văn nói thân mật. やります → **やろう** (thể ý chí). Với cấp trên vẫn dùng します／しましょう.',
        '**よく{見|み}てて** = よく{見|み}ていて (nhìn kỹ nhé) — văn nói nuốt い: ～ていて → ～てて.',
        '**お{弁当|べんとう}、{温|あたた}めますか** — câu kinh điển ở cửa hàng tiện lợi. Kính ngữ đầy đủ là "お{弁当|べんとう}は{温|あたた}めますか" hoặc "お{温|あたた}めしますか" — học kỹ ở **Bài 24**.',
        '**～で{辞|や}める** — mốc thời gian kết thúc dùng **で**: {3月|さんがつ}で{辞|や}める (nghỉ vào cuối tháng 3, làm đến hết tháng 3).',
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b16-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 50 từ N4: tìm việc, phỏng vấn, ở chỗ làm, giỏi/kém, kế hoạch tương lai',
  goal: 'Thuộc 50 từ N4 của chủ đề làm thêm và tương lai, đọc được tờ tuyển người làm thêm, trả lời phỏng vấn, nói được việc ở chỗ làm và kể dự định — mỗi động từ biết luôn thể khả năng và thể ý chí của nó.',
  minutes: 50,
  blocks: [
    {
      t: 'p',
      text: '**50 từ** chia 4 nhóm theo đúng 3 tình huống của bài: **A** tìm việc & phỏng vấn (15) · **B** ở chỗ làm (15) · **C** giỏi, kém, cố gắng (6) · **D** kế hoạch tương lai (14). Từ đã học ở Bài 1–15 ({時給|じきゅう}, {店長|てんちょう}, {制服|せいふく}, {経験|けいけん}, {慣|な}れます, {先輩|せんぱい}, {平日|へいじつ}, {卒業|そつぎょう}します…) KHÔNG lặp lại — gặp trong câu ví dụ thì coi như ôn. Số **1 / 2 / 3** sau động từ = nhóm động từ; dòng **"+"** dưới mỗi động từ cho luôn **thể khả năng** và **thể ý chí** — học ngay từ bây giờ để vào phần ngữ pháp không bị bỡ ngỡ.',
    },
    {
      t: 'note',
      title: 'Cách học 50 từ trong 3 ngày',
      items: [
        '**Ngày 1** — nhóm A + C (21 từ): đọc to theo 🔊, che nghĩa tự nói, rồi đọc to **3 câu phỏng vấn** ở mục ① Hội thoại có dùng các từ đó.',
        '**Ngày 2** — nhóm B (15 từ): mỗi động từ nói **3 dạng**: ます — khả năng — ý chí ({覚|おぼ}えます → {覚|おぼ}えられます → {覚|おぼ}えよう).',
        '**Ngày 3** — nhóm D (14 từ) + làm bài trắc nghiệm cuối mục + phần viết tay 10 từ hay vào đề.',
        'Romaji: trường âm viết theo kana ({給料|きゅうりょう} → **kyuuryou**, {将来|しょうらい} → **shourai**, {敬語|けいご} → **keigo**); âm ngắt っ viết đôi phụ âm ({一生懸命|いっしょうけんめい} → **isshoukenmei**).',
      ],
    },

    /* ── A ── */
    { t: 'h', text: 'A. Tìm việc làm thêm & phỏng vấn (15 từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'バイト', pos: 'danh từ (văn nói)', ipa: 'baito', vi: 'việc làm thêm — cách nói tắt của アルバイト', ex: '{週末|しゅうまつ}はコンビニでバイトをしています。', exRo: 'Shuumatsu wa konbini de baito o shite imasu.', exVi: 'Cuối tuần tôi làm thêm ở cửa hàng tiện lợi.', more: 'バイト{先|さき} (baito-saki) = chỗ làm thêm · バイト{代|だい} = tiền làm thêm. Viết trang trọng (email, hồ sơ) dùng アルバイト.' },
        { w: '{募集|ぼしゅう}します［{募集|ぼしゅう}する］3', pos: 'động từ nhóm 3', ipa: 'boshuu shimasu [boshuu suru]', vi: 'tuyển (người), chiêu mộ', ex: 'あの{店|みせ}はアルバイトを{募集|ぼしゅう}しています。', exRo: 'Ano mise wa arubaito o boshuu shite imasu.', exVi: 'Cửa hàng kia đang tuyển người làm thêm.', more: 'Trên tờ dán ở cửa: **アルバイト{募集|ぼしゅう}** = "Tuyển người làm thêm". {募集|ぼしゅう}{中|ちゅう} = đang tuyển.' },
        { w: '{応募|おうぼ}します［{応募|おうぼ}する］3', pos: 'động từ nhóm 3', ipa: 'oubo shimasu [oubo suru]', vi: 'ứng tuyển, nộp đơn (N に応募します)', ex: 'インターネットでこのアルバイトに{応募|おうぼ}しました。', exRo: 'Intaanetto de kono arubaito ni oubo shimashita.', exVi: 'Tôi đã ứng tuyển việc làm thêm này qua mạng.', more: 'Bên tuyển: {募集|ぼしゅう}する; bên xin việc: {応募|おうぼ}する — nhớ cặp này. Trợ từ là **に**.' },
        { w: '{面接|めんせつ}', pos: 'danh từ', ipa: 'mensetsu', vi: 'phỏng vấn (xin việc, xin học)', ex: '{明日|あした}{10時|じゅうじ}から{面接|めんせつ}があります。', exRo: 'Ashita juuji kara mensetsu ga arimasu.', exVi: 'Ngày mai từ 10 giờ tôi có buổi phỏng vấn.', more: '{面接|めんせつ}を{受|う}けます (đi phỏng vấn — người xin việc) · {面接|めんせつ}をします (phỏng vấn — người tuyển).' },
        { w: '{履歴書|りれきしょ}', pos: 'danh từ', ipa: 'rirekisho', vi: 'sơ yếu lý lịch (CV kiểu Nhật)', ex: '{面接|めんせつ}に{履歴書|りれきしょ}を{持|も}って{行|い}きます。', exRo: 'Mensetsu ni rirekisho o motte ikimasu.', exVi: 'Tôi mang sơ yếu lý lịch đến buổi phỏng vấn.', more: '{履歴書|りれきしょ}を{書|か}きます · {写真|しゃしん}を{貼|は}ります (dán ảnh). Ở Nhật nhiều nơi vẫn muốn {履歴書|りれきしょ} viết tay.' },
        { w: '{給料|きゅうりょう}', pos: 'danh từ', ipa: 'kyuuryou', vi: 'tiền lương', ex: '{給料|きゅうりょう}は{毎月|まいつき}{25日|にじゅうごにち}です。', exRo: 'Kyuuryou wa maitsuki nijuugo nichi desu.', exVi: 'Lương trả vào ngày 25 hằng tháng.', more: '{給料|きゅうりょう}が{高|たか}い／{安|やす}い · {給料|きゅうりょう}が{上|あ}がります (lương tăng). {時給|じきゅう} (Bài 14) = lương theo giờ.' },
        { w: '{交通費|こうつうひ}', pos: 'danh từ', ipa: 'koutsuuhi', vi: 'tiền đi lại (tàu, xe buýt)', ex: 'この{店|みせ}は{交通費|こうつうひ}が{出|で}ます。', exRo: 'Kono mise wa koutsuuhi ga demasu.', exVi: 'Cửa hàng này có trả tiền đi lại.', more: '交通 (giao thông) + 費 (phí). ～{費|ひ} = tiền cho ~: {生活費|せいかつひ} (sinh hoạt phí).' },
        { w: '{条件|じょうけん}', pos: 'danh từ', ipa: 'jouken', vi: 'điều kiện', ex: '{条件|じょうけん}は「{日本語|にほんご}が{話|はな}せる{方|かた}」です。', exRo: 'Jouken wa "Nihongo ga hanaseru kata" desu.', exVi: 'Điều kiện là "người nói được tiếng Nhật".', more: '{条件|じょうけん}がいい (điều kiện tốt) · {条件|じょうけん}に{合|あ}います (hợp điều kiện).' },
        { w: '{都合|つごう}', pos: 'danh từ', ipa: 'tsugou', vi: 'sự thuận tiện, lịch (của ai đó)', ex: '{明日|あした}はちょっと{都合|つごう}が{悪|わる}いです。', exRo: 'Ashita wa chotto tsugou ga warui desu.', exVi: 'Ngày mai tôi hơi không tiện (bận).', more: '{都合|つごう}がいい／{悪|わる}い (tiện / không tiện) · ご{都合|つごう}はいかがですか (anh/chị có tiện không — lịch sự).' },
        { w: '{土日|どにち}', pos: 'danh từ', ipa: 'donichi', vi: 'thứ Bảy và Chủ nhật', ex: '{土日|どにち}だけ{働|はたら}けます。', exRo: 'Donichi dake hatarakemasu.', exVi: 'Tôi chỉ làm được thứ Bảy và Chủ nhật.', more: '土 (土曜日) + 日 (日曜日). {平日|へいじつ} (Bài 11) = ngày thường (thứ Hai – thứ Sáu).' },
        { w: '{週|しゅう}～{日|か}／{週|しゅう}～{回|かい}', pos: 'cụm từ', ipa: 'shuu ~ ka / shuu ~ kai', vi: '1 tuần ~ ngày / ~ lần', ex: '{週|しゅう}{3日|みっか}ぐらい{働|はたら}きたいです。', exRo: 'Shuu mikka gurai hatarakitai desu.', exVi: 'Tôi muốn làm khoảng 3 ngày một tuần.', more: 'Đọc ngày theo kiểu đếm ngày: {週|しゅう}{2日|ふつか}, {週|しゅう}{3日|みっか}, {週|しゅう}{4日|よっか}, {週|しゅう}{5日|いつか}. "1 ngày/tuần" = {週|しゅう}{1日|いちにち}.' },
        { w: '{連絡|れんらく}します［{連絡|れんらく}する］3', pos: 'động từ nhóm 3', ipa: 'renraku shimasu [renraku suru]', vi: 'liên lạc, báo tin (N に連絡します)', ex: '{面接|めんせつ}の{結果|けっか}は{電話|でんわ}で{連絡|れんらく}します。', exRo: 'Mensetsu no kekka wa denwa de renraku shimasu.', exVi: 'Kết quả phỏng vấn chúng tôi sẽ báo qua điện thoại.', more: '+ khả năng: {連絡|れんらく}できます · ý chí: {連絡|れんらく}しよう. {連絡先|れんらくさき} = thông tin liên lạc.' },
        { w: '{受|う}けます［{受|う}ける］2', pos: 'động từ nhóm 2', ipa: 'ukemasu [ukeru]', vi: 'dự (phỏng vấn, kỳ thi); nhận', ex: '{来週|らいしゅう}、{面接|めんせつ}を{受|う}けます。', exRo: 'Raishuu, mensetsu o ukemasu.', exVi: 'Tuần sau tôi đi phỏng vấn.', more: '+ khả năng: {受|う}けられます · ý chí: {受|う}けよう. {試験|しけん}を{受|う}けます = dự thi (đừng nói ~~試験をします~~ khi mình là thí sinh).' },
        { w: '{質問|しつもん}します［{質問|しつもん}する］3', pos: 'động từ nhóm 3', ipa: 'shitsumon shimasu [shitsumon suru]', vi: 'hỏi, đặt câu hỏi', ex: '{何|なに}か{質問|しつもん}はありますか。', exRo: 'Nanika shitsumon wa arimasu ka.', exVi: 'Bạn có câu hỏi gì không? (câu cuối buổi phỏng vấn)', more: '{先生|せんせい}に{質問|しつもん}します (hỏi thầy cô — trợ từ に). Danh từ {質問|しつもん} = câu hỏi.' },
        { w: '{答|こた}えます［{答|こた}える］2', pos: 'động từ nhóm 2', ipa: 'kotaemasu [kotaeru]', vi: 'trả lời (N に答えます)', ex: '{店長|てんちょう}の{質問|しつもん}に{日本語|にほんご}で{答|こた}えました。', exRo: 'Tenchou no shitsumon ni nihongo de kotaemashita.', exVi: 'Tôi trả lời câu hỏi của quản lý bằng tiếng Nhật.', more: '+ khả năng: {答|こた}えられます · ý chí: {答|こた}えよう. Danh từ: {答|こた}え (câu trả lời, đáp án). **質問に答えます** — trợ từ に, không phải を.' },
      ],
    },

    /* ── B ── */
    { t: 'h', text: 'B. Ở chỗ làm — việc phải làm và luật của cửa hàng (15 từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'レジを{打|う}ちます［{打|う}つ］1', pos: 'cụm động từ nhóm 1', ipa: 'reji o uchimasu [utsu]', vi: 'tính tiền ở máy (bấm máy tính tiền)', ex: '{初|はじ}めは{一人|ひとり}でレジが{打|う}てませんでした。', exRo: 'Hajime wa hitori de reji ga utemasen deshita.', exVi: 'Lúc đầu tôi không tự tính tiền một mình được.', more: '+ khả năng: {打|う}てます · ý chí: {打|う}とう. {打|う}つ = đánh, gõ (キーボードを{打|う}つ = gõ phím). レジ (Bài 2) = quầy/máy tính tiền.' },
        { w: '{運|はこ}びます［{運|はこ}ぶ］1', pos: 'động từ nhóm 1', ipa: 'hakobimasu [hakobu]', vi: 'mang, bưng, chở', ex: 'お{客様|きゃくさま}に{料理|りょうり}を{運|はこ}びます。', exRo: 'Okyakusama ni ryouri o hakobimasu.', exVi: 'Tôi bưng món ăn cho khách.', more: '+ khả năng: {運|はこ}べます · ý chí: {運|はこ}ぼう. {荷物|にもつ}を{運|はこ}ぶ = khuân hành lý.' },
        { w: '{並|なら}べます［{並|なら}べる］2', pos: 'động từ nhóm 2 (tha động từ)', ipa: 'narabemasu [naraberu]', vi: 'xếp, bày (hàng hoá) thành hàng', ex: '{棚|たな}に{飲|の}み{物|もの}を{並|なら}べてください。', exRo: 'Tana ni nomimono o narabete kudasai.', exVi: 'Hãy xếp đồ uống lên kệ.', more: 'Cặp tự/tha (ôn bảng 自動詞・他動詞 Bài 15): {人|ひと}**が**{並|なら}びます (người xếp hàng — tự) ↔ {商品|しょうひん}**を**{並|なら}べます (xếp hàng hoá — tha). + khả năng: {並|なら}べられます · ý chí: {並|なら}べよう.' },
        { w: '{片付|かたづ}けます［{片付|かたづ}ける］2', pos: 'động từ nhóm 2', ipa: 'katazukemasu [katazukeru]', vi: 'dọn dẹp, cất gọn', ex: 'お{客様|きゃくさま}が{帰|かえ}ったら、テーブルを{片付|かたづ}けます。', exRo: 'Okyakusama ga kaettara, teeburu o katazukemasu.', exVi: 'Khách về rồi thì tôi dọn bàn.', more: '+ khả năng: {片付|かたづ}けられます · ý chí: {片付|かたづ}けよう. Khác {掃除|そうじ}します (lau chùi cho sạch): {片付|かたづ}ける = cất đồ về chỗ cho gọn.' },
        { w: '{数|かぞ}えます［{数|かぞ}える］2', pos: 'động từ nhóm 2', ipa: 'kazoemasu [kazoeru]', vi: 'đếm', ex: '{閉店|へいてん}のあとで、レジのお{金|かね}を{数|かぞ}えます。', exRo: 'Heiten no ato de, reji no okane o kazoemasu.', exVi: 'Sau khi đóng cửa, tôi đếm tiền trong máy tính tiền.', more: '+ khả năng: {数|かぞ}えられます · ý chí: {数|かぞ}えよう. {閉店|へいてん} = đóng cửa hàng (cuối ngày).' },
        { w: '{覚|おぼ}えます［{覚|おぼ}える］2', pos: 'động từ nhóm 2', ipa: 'oboemasu [oboeru]', vi: 'nhớ, học thuộc, ghi nhớ', ex: '{仕事|しごと}をなかなか{覚|おぼ}えられません。', exRo: 'Shigoto o nakanaka oboeraremasen.', exVi: 'Mãi mà tôi vẫn chưa nhớ được việc.', more: '+ khả năng: {覚|おぼ}えられます · ý chí: {覚|おぼ}えよう. **{覚|おぼ}えています** = (vẫn) còn nhớ; **{覚|おぼ}えました** = đã thuộc. Khác {思|おも}い{出|だ}します (nhớ ra).' },
        { w: '{守|まも}ります［{守|まも}る］1', pos: 'động từ nhóm 1', ipa: 'mamorimasu [mamoru]', vi: 'giữ, tuân thủ (giờ giấc, luật, lời hứa); bảo vệ', ex: 'バイトの{時間|じかん}を{守|まも}ってください。', exRo: 'Baito no jikan o mamotte kudasai.', exVi: 'Hãy đúng giờ làm thêm.', more: '{時間|じかん}を{守|まも}る (đúng giờ) · ルールを{守|まも}る (tuân thủ quy định) · {約束|やくそく}を{守|まも}る (giữ lời hứa). + khả năng: {守|まも}れます · ý chí: {守|まも}ろう.' },
        { w: '{遅刻|ちこく}します［{遅刻|ちこく}する］3', pos: 'động từ nhóm 3', ipa: 'chikoku shimasu [chikoku suru]', vi: 'đến muộn (giờ làm, giờ học)', ex: '{電車|でんしゃ}が{遅|おく}れて、バイトに{遅刻|ちこく}しました。', exRo: 'Densha ga okurete, baito ni chikoku shimashita.', exVi: 'Tàu chậm nên tôi đến chỗ làm thêm muộn.', more: 'N **に** {遅刻|ちこく}する. Khác {遅|おく}れます (Bài 10): {遅|おく}れる dùng cho cả tàu, xe; {遅刻|ちこく} chỉ dùng cho người đến muộn giờ quy định.' },
        { w: '{休憩|きゅうけい}します［{休憩|きゅうけい}する］3', pos: 'động từ nhóm 3', ipa: 'kyuukei shimasu [kyuukei suru]', vi: 'nghỉ giải lao (giữa giờ làm)', ex: '{2時|にじ}から{30分|さんじゅっぷん}{休憩|きゅうけい}します。', exRo: 'Niji kara sanjuppun kyuukei shimasu.', exVi: 'Từ 2 giờ nghỉ giải lao 30 phút.', more: '+ ý chí: {休憩|きゅうけい}しよう (nghỉ chút nhé). {休憩室|きゅうけいしつ} = phòng nghỉ nhân viên. Khác {休|やす}みます (nghỉ hẳn cả buổi/ngày).' },
        { w: '{交代|こうたい}します［{交代|こうたい}する］3', pos: 'động từ nhóm 3', ipa: 'koutai shimasu [koutai suru]', vi: 'thay ca, đổi người', ex: '{6時|ろくじ}に{鈴木|すずき}さんと{交代|こうたい}します。', exRo: 'Rokuji ni Suzuki-san to koutai shimasu.', exVi: '6 giờ tôi đổi ca với chị Suzuki.', more: 'N **と** {交代|こうたい}する. {交代|こうたい}で = luân phiên. Chữ 代 (thay) là chữ Hán mới của bài.' },
        { w: '{辞|や}めます［{辞|や}める］2', pos: 'động từ nhóm 2', ipa: 'yamemasu [yameru]', vi: 'nghỉ (việc), thôi (làm)', ex: '{勉強|べんきょう}が{忙|いそが}しいので、バイトを{辞|や}めました。', exRo: 'Benkyou ga isogashii node, baito o yamemashita.', exVi: 'Vì việc học bận nên tôi đã nghỉ làm thêm.', more: '{会社|かいしゃ}／バイトを{辞|や}める (nghỉ việc). Cùng âm với **やめる** (bỏ thói quen: たばこをやめる — thường viết kana hoặc 止める). + ý chí: {辞|や}めよう.' },
        { w: '{頑張|がんば}ります［{頑張|がんば}る］1', pos: 'động từ nhóm 1', ipa: 'ganbarimasu [ganbaru]', vi: 'cố gắng, nỗ lực', ex: '{新|あたら}しい{仕事|しごと}、{頑張|がんば}ります。', exRo: 'Atarashii shigoto, ganbarimasu.', exVi: 'Tôi sẽ cố gắng với công việc mới.', more: '{頑張|がんば}って！ (Cố lên!) · {頑張|がんば}ろう！ (Cùng cố lên nào! — thể ý chí, hô hào cả nhóm).' },
        { w: '{敬語|けいご}', pos: 'danh từ', ipa: 'keigo', vi: 'kính ngữ (cách nói tôn trọng)', ex: 'お{客様|きゃくさま}には{敬語|けいご}で{話|はな}します。', exRo: 'Okyakusama ni wa keigo de hanashimasu.', exVi: 'Với khách thì nói bằng kính ngữ.', more: '{敬語|けいご}が{使|つか}えます (dùng được kính ngữ). Học bài bản ở **Bài 24** (尊敬語・謙譲語).' },
        { w: 'お{客様|きゃくさま}', pos: 'danh từ (kính ngữ)', ipa: 'okyakusama', vi: 'quý khách', ex: 'お{客様|きゃくさま}、{袋|ふくろ}はご{利用|りよう}ですか。', exRo: 'Okyakusama, fukuro wa goriyou desu ka.', exVi: 'Thưa quý khách, quý khách có dùng túi không ạ?', more: 'Ôn: (お){客|きゃく}(さん) (Bài 10). Nhân viên nói về khách luôn dùng **お{客様|きゃくさま}**; nói với bạn bè thì お{客|きゃく}さん.' },
        { w: '{丁寧|ていねい}（な）', pos: 'tính từ đuôi な', ipa: 'teinei (na)', vi: 'lịch sự, nhã nhặn; cẩn thận, kỹ', ex: 'お{客様|きゃくさま}には{丁寧|ていねい}な{言葉|ことば}で{話|はな}してください。', exRo: 'Okyakusama ni wa teinei na kotoba de hanashite kudasai.', exVi: 'Với khách hãy nói bằng lời lẽ lịch sự.', more: '{丁寧|ていねい}な{言葉|ことば} (lời lẽ lịch sự) · {丁寧|ていねい}に{書|か}く (viết cẩn thận). Phó từ: {丁寧|ていねい}**に**.' },
      ],
    },

    /* ── C ── */
    { t: 'h', text: 'C. Giỏi, kém, làm được không — nói về năng lực (6 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{得意|とくい}（な）', pos: 'tính từ đuôi な', ipa: 'tokui (na)', vi: 'giỏi, sở trường (việc mình làm tốt và thích)', ex: '{私|わたし}は{料理|りょうり}が{得意|とくい}です。', exRo: 'Watashi wa ryouri ga tokui desu.', exVi: 'Tôi giỏi nấu ăn.', more: '**N が {得意|とくい}です** — nói về CHÍNH MÌNH được (khác {上手|じょうず}: khen người khác; tự nói "私は上手です" nghe tự cao). {得意|とくい}な{料理|りょうり} = món sở trường.' },
        { w: '{苦手|にがて}（な）', pos: 'tính từ đuôi な', ipa: 'nigate (na)', vi: 'kém, không giỏi; ngại, sợ (thứ gì)', ex: '{私|わたし}は{早起|はやお}きが{苦手|にがて}です。', exRo: 'Watashi wa hayaoki ga nigate desu.', exVi: 'Tôi rất ngại dậy sớm.', more: 'Đối của {得意|とくい}. Nhẹ nhàng hơn {下手|へた}. N が{苦手|にがて}: {漢字|かんじ}が{苦手|にがて}, {辛|から}い{物|もの}が{苦手|にがて} (không ăn được cay).' },
        { w: '{無理|むり}（な）', pos: 'tính từ đuôi な', ipa: 'muri (na)', vi: 'không thể, quá sức, vô lý', ex: '{毎日|まいにち}{深夜|しんや}までは{無理|むり}です。', exRo: 'Mainichi shin\'ya made wa muri desu.', exVi: 'Ngày nào cũng làm đến khuya thì không thể được.', more: '{無理|むり}をしないでください (đừng cố quá sức) · ちょっと{無理|むり}です (từ chối khéo: hơi khó ạ). {深夜|しんや} = đêm khuya.' },
        { w: '{自信|じしん}', pos: 'danh từ', ipa: 'jishin', vi: 'sự tự tin', ex: '{日本語|にほんご}の{電話|でんわ}は、まだ{自信|じしん}がありません。', exRo: 'Nihongo no denwa wa, mada jishin ga arimasen.', exVi: 'Nghe gọi điện bằng tiếng Nhật thì tôi chưa tự tin.', more: '{自信|じしん}があります／ありません (tự tin / không tự tin). Coi chừng nhầm với {地震|じしん} (động đất, Bài 15) — cùng đọc じしん.' },
        { w: '{一生懸命|いっしょうけんめい}', pos: 'phó từ / tính từ đuôi な', ipa: 'isshoukenmei', vi: 'hết sức, chăm chỉ hết mình', ex: '{一生懸命|いっしょうけんめい}{働|はたら}いて、お{金|かね}を{貯|た}めました。', exRo: 'Isshoukenmei hataraite, okane o tamemashita.', exVi: 'Tôi làm việc chăm chỉ hết mình và đã để dành được tiền.', more: '{一生懸命|いっしょうけんめい}{頑張|がんば}ります — câu kết buổi phỏng vấn ai cũng nói. Có thể nói {一生懸命|いっしょうけんめい}**に**{働|はたら}く.' },
        { w: '{必|かなら}ず', pos: 'phó từ', ipa: 'kanarazu', vi: 'nhất định, chắc chắn, luôn luôn', ex: '{休|やす}むときは、{必|かなら}ず{店長|てんちょう}に{連絡|れんらく}してください。', exRo: 'Yasumu toki wa, kanarazu tenchou ni renraku shite kudasai.', exVi: 'Khi nghỉ thì nhất định phải báo cho quản lý.', more: '{必|かなら}ず + khẳng định (quy tắc, lời hứa). Nói ý chí mạnh: {必|かなら}ず{合格|ごうかく}しようと{思|おも}います. Phủ định "tuyệt đối không" thì dùng {絶対|ぜったい}に～ない.' },
      ],
    },

    /* ── D ── */
    { t: 'h', text: 'D. Kế hoạch & tương lai (14 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{将来|しょうらい}', pos: 'danh từ', ipa: 'shourai', vi: 'tương lai (của bản thân, xã hội)', ex: '{将来|しょうらい}、{日本|にほん}の{会社|かいしゃ}で{働|はたら}きたいです。', exRo: 'Shourai, Nihon no kaisha de hatarakitai desu.', exVi: 'Sau này tôi muốn làm ở công ty Nhật.', more: '{将来|しょうらい}の{夢|ゆめ} (ước mơ tương lai) · {将来|しょうらい}の{計画|けいかく}. Đứng đầu câu không cần trợ từ: {将来|しょうらい}、～.' },
        { w: '{夢|ゆめ}', pos: 'danh từ', ipa: 'yume', vi: 'giấc mơ; ước mơ', ex: '{私|わたし}の{夢|ゆめ}は{自分|じぶん}の{店|みせ}を{持|も}つことです。', exRo: 'Watashi no yume wa jibun no mise o motsu koto desu.', exVi: 'Ước mơ của tôi là có một cửa hàng của riêng mình.', more: '**{夢|ゆめ}は V辞書形 ことです** (mẫu kể ước mơ — ôn ポイント 81). {夢|ゆめ}を{見|み}ます = nằm mơ.' },
        { w: '{予定|よてい}', pos: 'danh từ', ipa: 'yotei', vi: 'dự định, lịch (đã định)', ex: '{週末|しゅうまつ}の{予定|よてい}は{何|なん}ですか。', exRo: 'Shuumatsu no yotei wa nan desu ka.', exVi: 'Cuối tuần bạn có lịch gì?', more: '**V辞書形／Nの + {予定|よてい}です** (mẫu của bài): {来月|らいげつ}{帰国|きこく}する{予定|よてい}です. {予定|よてい}があります = có lịch bận.' },
        { w: '{計画|けいかく}', pos: 'danh từ', ipa: 'keikaku', vi: 'kế hoạch (cụ thể, có các bước)', ex: '{夏休|なつやす}みの{旅行|りょこう}の{計画|けいかく}を{立|た}てています。', exRo: 'Natsuyasumi no ryokou no keikaku o tatete imasu.', exVi: 'Tôi đang lên kế hoạch du lịch nghỉ hè.', more: '{計画|けいかく}を{立|た}てる = lập kế hoạch (động từ đi kèm là 立てる). Khác {予定|よてい}: {予定|よてい} là "lịch đã định", {計画|けいかく} là "bản kế hoạch".' },
        { w: '{決|き}めます［{決|き}める］2', pos: 'động từ nhóm 2 (tha động từ)', ipa: 'kimemasu [kimeru]', vi: 'quyết định, chọn', ex: '{卒業|そつぎょう}したらどうするか、まだ{決|き}めていません。', exRo: 'Sotsugyou shitara dou suru ka, mada kimete imasen.', exVi: 'Tốt nghiệp xong làm gì thì tôi chưa quyết.', more: 'Tự động từ: {決|き}まります (được quyết định): バイトが{決|き}まりました (đã có việc). + ý chí: {決|き}めよう. "Quyết định làm V" = ～ことにする (Bài 21).' },
        { w: '{考|かんが}えます［{考|かんが}える］2', pos: 'động từ nhóm 2', ipa: 'kangaemasu [kangaeru]', vi: 'suy nghĩ, cân nhắc', ex: '{将来|しょうらい}のことをよく{考|かんが}えてください。', exRo: 'Shourai no koto o yoku kangaete kudasai.', exVi: 'Hãy suy nghĩ kỹ về tương lai.', more: '{考|かんが}えています (đang cân nhắc) · Khác {思|おも}います: {思|おも}う = cảm nghĩ, ý kiến; {考|かんが}える = suy tính bằng đầu óc. Danh từ: {考|かんが}え (ý tưởng).' },
        { w: '{就職|しゅうしょく}します［{就職|しゅうしょく}する］3', pos: 'động từ nhóm 3', ipa: 'shuushoku shimasu [shuushoku suru]', vi: 'đi làm (vào một công ty), tìm được việc chính thức', ex: '{卒業|そつぎょう}したら、{日本|にほん}の{会社|かいしゃ}に{就職|しゅうしょく}するつもりです。', exRo: 'Sotsugyou shitara, Nihon no kaisha ni shuushoku suru tsumori desu.', exVi: 'Tốt nghiệp xong tôi định vào làm ở công ty Nhật.', more: 'N(công ty) **に** {就職|しゅうしょく}する. {就職活動|しゅうしょくかつどう} (就活) = hoạt động tìm việc — chủ đề Bài 41.' },
        { w: '{正社員|せいしゃいん}', pos: 'danh từ', ipa: 'seishain', vi: 'nhân viên chính thức (biên chế)', ex: 'アルバイトじゃなくて、{正社員|せいしゃいん}になりたいです。', exRo: 'Arubaito ja nakute, seishain ni naritai desu.', exVi: 'Tôi muốn trở thành nhân viên chính thức chứ không phải làm thêm.', more: '正 (chính) + 社員 (nhân viên công ty). Đối: アルバイト／パート (làm bán thời gian).' },
        { w: '{進学|しんがく}します［{進学|しんがく}する］3', pos: 'động từ nhóm 3', ipa: 'shingaku shimasu [shingaku suru]', vi: 'học lên (bậc cao hơn)', ex: '{大学|だいがく}を{卒業|そつぎょう}したら、{大学院|だいがくいん}に{進学|しんがく}したいです。', exRo: 'Daigaku o sotsugyou shitara, daigakuin ni shingaku shitai desu.', exVi: 'Tốt nghiệp đại học xong tôi muốn học lên cao học.', more: 'N **に** {進学|しんがく}する. Đối với {就職|しゅうしょく}: sau tốt nghiệp hoặc {進学|しんがく} (học tiếp) hoặc {就職|しゅうしょく} (đi làm).' },
        { w: '{大学院|だいがくいん}', pos: 'danh từ', ipa: 'daigakuin', vi: 'cao học, sau đại học', ex: '{大学院|だいがくいん}で{日本|にほん}の{経済|けいざい}を{研究|けんきゅう}するつもりです。', exRo: 'Daigakuin de Nihon no keizai o kenkyuu suru tsumori desu.', exVi: 'Tôi định nghiên cứu kinh tế Nhật ở cao học.', more: '{大学院生|だいがくいんせい} = học viên cao học. {研究|けんきゅう}します = nghiên cứu.' },
        { w: '{帰国|きこく}します［{帰国|きこく}する］3', pos: 'động từ nhóm 3', ipa: 'kikoku shimasu [kikoku suru]', vi: 'về nước', ex: '{来年|らいねん}の{3月|さんがつ}に{帰国|きこく}する{予定|よてい}です。', exRo: 'Rainen no sangatsu ni kikoku suru yotei desu.', exVi: 'Tôi sẽ về nước vào tháng 3 năm sau.', more: '= {国|くに}へ{帰|かえ}ります (cách nói thường). {帰国|きこく} trang trọng hơn, hay gặp trong văn viết, thông báo.' },
        { w: '{貯|た}めます［{貯|た}める］2', pos: 'động từ nhóm 2', ipa: 'tamemasu [tameru]', vi: 'để dành, tích (tiền)', ex: 'バイトでお{金|かね}を{貯|た}めて、{旅行|りょこう}しようと{思|おも}っています。', exRo: 'Baito de okane o tamete, ryokou shiyou to omotte imasu.', exVi: 'Tôi đang tính làm thêm để dành tiền rồi đi du lịch.', more: 'お{金|かね}を{貯|た}める · + ý chí: {貯|た}めよう · khả năng: {貯|た}められる. {貯金|ちょきん} = tiền tiết kiệm.' },
        { w: '{試験|しけん}', pos: 'danh từ', ipa: 'shiken', vi: 'kỳ thi, bài thi', ex: '{12月|じゅうにがつ}に{日本語能力試験|にほんごのうりょくしけん}を{受|う}けます。', exRo: 'Juunigatsu ni nihongo nouryoku shiken o ukemasu.', exVi: 'Tháng 12 tôi thi năng lực tiếng Nhật.', more: '{試験|しけん}を{受|う}ける (dự thi) · {試験|しけん}に{合格|ごうかく}する (đỗ). テスト = bài kiểm tra nhỏ; {試験|しけん} = kỳ thi chính thức. {日本語能力試験|にほんごのうりょくしけん} = JLPT.' },
        { w: '{合格|ごうかく}します［{合格|ごうかく}する］3', pos: 'động từ nhóm 3', ipa: 'goukaku shimasu [goukaku suru]', vi: 'đỗ, thi đậu', ex: 'N4に{合格|ごうかく}しました！', exRo: 'Enu yon ni goukaku shimashita!', exVi: 'Tôi đã đỗ N4!', more: 'N(kỳ thi) **に** {合格|ごうかく}する — không dùng を. + ý chí: {合格|ごうかく}しよう. Đối: {不合格|ふごうかく} (trượt) / {落|お}ちる (trượt — văn nói).' },
      ],
    },

    {
      t: 'table',
      caption: 'Động từ của bài — 3 dạng phải nói được ngay (ます · khả năng · ý chí)',
      head: ['Nhóm', 'Thể ます', 'Thể khả năng', 'Thể ý chí', 'Romaji (khả năng · ý chí)'],
      rows: [
        ['1', '{打|う}ちます', '{打|う}てます', '{打|う}とう', 'utemasu · utou'],
        ['1', '{運|はこ}びます', '{運|はこ}べます', '{運|はこ}ぼう', 'hakobemasu · hakobou'],
        ['1', '{守|まも}ります', '{守|まも}れます', '{守|まも}ろう', 'mamoremasu · mamorou'],
        ['1', '{頑張|がんば}ります', '{頑張|がんば}れます', '{頑張|がんば}ろう', 'ganbaremasu · ganbarou'],
        ['2', '{覚|おぼ}えます', '{覚|おぼ}えられます', '{覚|おぼ}えよう', 'oboeraremasu · oboeyou'],
        ['2', '{並|なら}べます', '{並|なら}べられます', '{並|なら}べよう', 'naraberaremasu · narabeyou'],
        ['2', '{決|き}めます', '{決|き}められます', '{決|き}めよう', 'kimeraremasu · kimeyou'],
        ['2', '{答|こた}えます', '{答|こた}えられます', '{答|こた}えよう', 'kotaeraremasu · kotaeyou'],
        ['3', '{連絡|れんらく}します', '{連絡|れんらく}できます', '{連絡|れんらく}しよう', 'renraku dekimasu · renraku shiyou'],
        ['3', '{休憩|きゅうけい}します', '{休憩|きゅうけい}できます', '{休憩|きゅうけい}しよう', 'kyuukei dekimasu · kyuukei shiyou'],
      ],
    },
    {
      t: 'note',
      title: 'Từ dễ nhầm trong bài',
      items: [
        '**{募集|ぼしゅう} ↔ {応募|おうぼ}** — bên tuyển {募集|ぼしゅう}する, người xin việc {応募|おうぼ}する. Hai từ dùng chung chữ 募 (chiêu mộ) nhưng đảo vị trí.',
        '**{得意|とくい} ↔ {上手|じょうず}** — tự nói về mình: {料理|りょうり}が**{得意|とくい}**です (tự nhiên); khen người khác: {料理|りょうり}が**{上手|じょうず}**ですね. Tự nói "私は料理が上手です" nghe khoe khoang.',
        '**{遅刻|ちこく}する ↔ {遅|おく}れる** — tàu {遅|おく}れる (✓), tàu ~~{遅刻|ちこく}する~~ (✗). Người thì dùng được cả hai: {授業|じゅぎょう}に{遅|おく}れる／{遅刻|ちこく}する.',
        '**{休憩|きゅうけい} ↔ {休|やす}み** — nghỉ giải lao giữa giờ ↔ nghỉ cả ngày, ngày nghỉ. "Hôm nay tôi nghỉ làm" = {今日|きょう}はバイトを**{休|やす}みます** (không phải ~~休憩します~~).',
        '**{自信|じしん} ↔ {地震|じしん}** — cùng đọc じしん: tự tin ↔ động đất. Nghe ngữ cảnh: {自信|じしん}が**あります**, {地震|じしん}が**ありました／{起|お}きました**.',
        '**{予定|よてい} ↔ {計画|けいかく}** — {予定|よてい}: lịch đã định ({明日|あした}は{予定|よてい}があります = mai tôi bận); {計画|けいかく}: bản kế hoạch có các bước ({計画|けいかく}を{立|た}てる).',
      ],
    },
    {
      t: 'note',
      title: 'Kết hợp từ (コロケーション) nên học thành cụm',
      items: [
        '{面接|めんせつ}**を{受|う}ける** · {試験|しけん}**を{受|う}ける** · {試験|しけん}**に{合格|ごうかく}する** · {質問|しつもん}**に{答|こた}える**',
        '{時間|じかん}**を{守|まも}る** · {約束|やくそく}**を{守|まも}る** · {計画|けいかく}**を{立|た}てる** · お{金|かね}**を{貯|た}める**',
        '{都合|つごう}**がいい／{悪|わる}い** · {自信|じしん}**がある／ない** · {交通費|こうつうひ}**が{出|で}る** · レジ**を{打|う}つ**',
        '{会社|かいしゃ}**に{就職|しゅうしょく}する** · {大学院|だいがくいん}**に{進学|しんがく}する** · バイト**に{応募|おうぼ}する** · {店長|てんちょう}**に{連絡|れんらく}する**',
      ],
    },
    {
      t: 'write',
      id: 'b16-viet-tu',
      title: 'Viết tay 10 từ hay vào đề',
      note: 'Dòng trên tô theo mẫu, dòng dưới tự viết. Bật "Che mẫu" để tự nhớ ra từ chỉ từ gợi ý nghĩa.',
      chars: ['面接', '質問', '答え', '考える', '決める', '将来', '夢', '予定', '守る', 'バイト'],
      goi: {
        '面接': 'めんせつ · phỏng vấn',
        '質問': 'しつもん · câu hỏi',
        '答え': 'こたえ · câu trả lời',
        '考える': 'かんがえる · suy nghĩ',
        '決める': 'きめる · quyết định',
        '将来': 'しょうらい · tương lai',
        '夢': 'ゆめ · ước mơ',
        '予定': 'よてい · dự định, lịch',
        '守る': 'まもる · tuân thủ, giữ',
        'バイト': 'ばいと · làm thêm',
      },
    },
    {
      t: 'mcq',
      id: 'b16-tv-trac-nghiem',
      title: 'Kiểm tra từ vựng — 14 câu (dạng 文脈規定・言い換え của đề N4)',
      items: [
        { q: 'あの{店|みせ}はアルバイトを（　）しています。', options: ['{応募|おうぼ}', '{募集|ぼしゅう}', '{面接|めんせつ}', '{連絡|れんらく}'], correct: 1, why: 'Cửa hàng (bên tuyển) → **{募集|ぼしゅう}している** = đang tuyển. 〔Ano mise wa arubaito o boshuu shite imasu.〕 {応募|おうぼ} là việc của người xin.' },
        { q: '{来週|らいしゅう}、{面接|めんせつ}を（　）。', options: ['します', 'うけます', 'こたえます', 'まもります'], correct: 1, why: 'Người xin việc: **{面接|めんせつ}を{受|う}けます**. 〔Raishuu, mensetsu o ukemasu.〕' },
        { q: '{店長|てんちょう}の{質問|しつもん}（　）{答|こた}えました。', options: ['を', 'が', 'に', 'で'], correct: 2, why: '**{質問|しつもん}に{答|こた}える** — trợ từ に. 〔Tenchou no shitsumon ni kotaemashita.〕' },
        { q: '{電車|でんしゃ}が{遅|おく}れて、バイトに（　）しました。', options: ['{遅刻|ちこく}', '{休憩|きゅうけい}', '{交代|こうたい}', '{連絡|れんらく}'], correct: 0, why: 'Đến muộn giờ làm = **{遅刻|ちこく}する**. 〔Densha ga okurete, baito ni chikoku shimashita.〕' },
        { q: '{2時|にじ}から{30分|さんじゅっぷん}（　）します。お{茶|ちゃ}を{飲|の}みましょう。', options: ['{休憩|きゅうけい}', '{遅刻|ちこく}', '{面接|めんせつ}', '{募集|ぼしゅう}'], correct: 0, why: 'Nghỉ giải lao giữa giờ = **{休憩|きゅうけい}**. 〔Niji kara sanjuppun kyuukei shimasu.〕' },
        { q: '{私|わたし}は{料理|りょうり}が（　）です。{毎日|まいにち}{作|つく}っています。', options: ['{苦手|にがて}', '{無理|むり}', '{得意|とくい}', '{丁寧|ていねい}'], correct: 2, why: 'Ngày nào cũng nấu → giỏi, sở trường: **{得意|とくい}**. 〔Watashi wa ryouri ga tokui desu.〕' },
        { q: 'バイトの{時間|じかん}は{必|かなら}ず（　）ください。', options: ['{守|まも}って', '{決|き}めて', '{数|かぞ}えて', '{貯|た}めて'], correct: 0, why: '**{時間|じかん}を{守|まも}る** = đúng giờ. 〔Baito no jikan wa kanarazu mamotte kudasai.〕' },
        { q: 'お{金|かね}を（　）、{旅行|りょこう}に{行|い}きたいです。', options: ['{片付|かたづ}けて', '{貯|た}めて', '{並|なら}べて', '{覚|おぼ}えて'], correct: 1, why: '**お{金|かね}を{貯|た}める** = để dành tiền. 〔Okane o tamete, ryokou ni ikitai desu.〕' },
        { q: '「{明日|あした}は{都合|つごう}が{悪|わる}いです。」と{同|おな}じ{意味|いみ}は？', options: ['{明日|あした}は{元気|げんき}じゃありません。', '{明日|あした}は{予定|よてい}があります。', '{明日|あした}は{天気|てんき}が{悪|わる}いです。', '{明日|あした}は{仕事|しごと}が{好|す}きじゃありません。'], correct: 1, why: '{都合|つごう}が{悪|わる}い = không tiện, đã có việc ≈ **{予定|よてい}があります**. 〔Ashita wa yotei ga arimasu.〕 (dạng 言い換え類義)' },
        { q: '「{日本|にほん}の{会社|かいしゃ}に{就職|しゅうしょく}します。」の{意味|いみ}は？', options: ['{日本|にほん}の{会社|かいしゃ}を{見学|けんがく}します。', '{日本|にほん}の{会社|かいしゃ}で{働|はたら}き{始|はじ}めます。', '{日本|にほん}の{会社|かいしゃ}を{辞|や}めます。', '{日本|にほん}の{会社|かいしゃ}に{電話|でんわ}します。'], correct: 1, why: '{就職|しゅうしょく}する = vào làm ở công ty ≈ **{働|はたら}き{始|はじ}める**. 〔Nihon no kaisha de hatarakihajimemasu.〕' },
        { q: 'テーブルの{上|うえ}のお{皿|さら}を（　）ください。', options: ['{片付|かたづ}けて', '{答|こた}えて', '{受|う}けて', '{応募|おうぼ}して'], correct: 0, why: 'Dọn bát đĩa trên bàn = **{片付|かたづ}ける**. 〔Teeburu no ue no osara o katazukete kudasai.〕' },
        { q: '{6時|ろくじ}に{鈴木|すずき}さんと（　）します。それから{私|わたし}は{帰|かえ}ります。', options: ['{交代|こうたい}', '{合格|ごうかく}', '{進学|しんがく}', '{質問|しつもん}'], correct: 0, why: 'Đổi ca với người khác = **N と{交代|こうたい}する**. 〔Rokuji ni Suzuki-san to koutai shimasu.〕' },
        { q: '{12月|じゅうにがつ}の{試験|しけん}に（　）、とてもうれしいです。', options: ['{合格|ごうかく}して', '{就職|しゅうしょく}して', '{遅刻|ちこく}して', '{募集|ぼしゅう}して'], correct: 0, why: '**{試験|しけん}に{合格|ごうかく}する** = thi đỗ. 〔Juunigatsu no shiken ni goukaku shite, totemo ureshii desu.〕' },
        { q: '{日本語|にほんご}の{電話|でんわ}は、まだ（　）がありません。', options: ['{自信|じしん}', '{地震|じしん}', '{条件|じょうけん}', '{夢|ゆめ}'], correct: 0, why: '**{自信|じしん}がない** = chưa tự tin. Bẫy đồng âm: {地震|じしん} là động đất. 〔Nihongo no denwa wa, mada jishin ga arimasen.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b16-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp N4 — thể khả năng, thể ý chí, ～（よ）うと思います, ～つもりです, ～予定です',
  goal: 'Chia đúng thể khả năng và thể ý chí của mọi động từ (nhóm 1/2/3, kể cả 来る・する), dùng thể khả năng để nói năng lực và hoàn cảnh (đổi を→が), dùng thể ý chí để rủ bạn thân mật và nói dự định (～（よ）うと思っています), nói ý định chắc chắn bằng ～つもりです／～ないつもりです và lịch đã định bằng ～予定です — phân biệt được ba cách nói dự định như đề N4 hỏi.',
  minutes: 100,
  blocks: [
    {
      t: 'p',
      text: 'Bài 16 có **3 mẫu chính** của N4 và **1 mẫu cùng nhóm** để nói dự định cho đủ: **(1) thể khả năng** — "làm được", **(2) thể ý chí** — "…nhé / mình định…", **(3) ～つもりです** — "định…", và **～{予定|よてい}です** — "theo lịch thì…". Cả ba đều **đổi đuôi động từ** nên trước hết phải chắc **nhóm động từ** (ôn Bài 7 thể て, Bài 9 thể từ điển). Mỗi mẫu: bảng chia → công thức → ≥5 ví dụ → hỏi–đáp → bảng thay thế → công thức 1 dòng → lỗi hay mắc. Cuối bài: ghép câu, điền, và trắc nghiệm dạng đề JLPT N4 (文法形式の判断 + 文の組み立て ★).',
    },
    {
      t: 'table',
      caption: 'Bản đồ ngữ pháp Bài 16',
      head: ['#', 'Mẫu', 'Nghĩa', 'Ví dụ ngắn', 'Cấp'],
      rows: [
        ['①', 'V{可能形|かのうけい} (書ける・食べられる・できる・来られる)', 'làm được, có thể (năng lực / hoàn cảnh)', '{日本語|にほんご}が{話|はな}せます。', 'N4'],
        ['②', 'V{意向形|いこうけい} (行こう・食べよう・しよう・来よう)', 'cùng … nhé (thân mật = ～ましょう)', '{一緒|いっしょ}に{帰|かえ}ろう。', 'N4'],
        ['③', 'V{意向形|いこうけい} ＋ と{思|おも}います／{思|おも}っています', 'tôi định / đang tính …', '{国|くに}へ{帰|かえ}ろうと{思|おも}っています。', 'N4'],
        ['④', 'V{辞書形|じしょけい}／Vない ＋ つもりです', 'định (không) … (ý định đã quyết)', '{日本|にほん}で{働|はたら}くつもりです。', 'N4'],
        ['⑤', 'V{辞書形|じしょけい}／Nの ＋ {予定|よてい}です', 'theo lịch thì sẽ … (đã định sẵn)', '{3時|さんじ}に{着|つ}く{予定|よてい}です。', 'N4'],
      ],
    },

    /* ── Ôn nhóm động từ ── */
    { t: 'h', text: 'Trước tiên — nhận nhóm động từ (ôn Bài 7, Bài 9)' },
    {
      t: 'table',
      caption: 'Ba nhóm động từ — nhìn thể ます là nhận được',
      head: ['Nhóm', 'Dấu hiệu (thể ます)', 'Ví dụ', 'Thể từ điển', 'Bẫy'],
      rows: [
        ['1 (五段)', 'âm trước ます thuộc hàng **い**: きます・します(話)・ちます・みます・びます・ぎます・ります・います', '{書|か}きます, {話|はな}します, {待|ま}ちます, {読|よ}みます, {帰|かえ}ります, {買|か}います', '{書|か}く, {話|はな}す, {待|ま}つ, {読|よ}む, {帰|かえ}る, {買|か}う', '**{帰|かえ}ります・{入|はい}ります・{走|はし}ります・{知|し}ります・{切|き}ります** trông như nhóm 2 nhưng là **nhóm 1**'],
        ['2 (一段)', 'âm trước ます thuộc hàng **え**, hoặc vài động từ hàng い', '{食|た}べます, {覚|おぼ}えます, {見|み}ます, {起|お}きます, {着|き}ます', '{食|た}べる, {覚|おぼ}える, {見|み}る, {起|お}きる, {着|き}る', '{見|み}ます・{起|お}きます・{着|き}ます・{借|か}ります・{浴|あ}びます・できます là **nhóm 2** dù hàng い'],
        ['3', 'します / {来|き}ます', 'します, {勉強|べんきょう}します, {来|き}ます', 'する, {勉強|べんきょう}する, {来|く}る', '{来|く}る đổi âm đầu: く／き／こ'],
      ],
    },

    /* ══════ ① THỂ KHẢ NĂNG ══════ */
    { t: 'h', text: '① Thể khả năng (可能形) — "V được", "có thể V"' },
    {
      t: 'p',
      text: 'Bài 9 (ポイント 82) và Bài 10 (ポイント 93) bạn đã nói "làm được" bằng **V{辞書形|じしょけい} ことができます**: {日本語|にほんご}を{話|はな}すことができます. Cách đó **dài**. Người Nhật nói hằng ngày dùng **một động từ duy nhất đã đổi đuôi**: **{話|はな}せます**. Đó là **thể khả năng**. Nghĩa giống hệt, chỉ ngắn hơn và tự nhiên hơn trong văn nói.',
    },
    {
      t: 'table',
      caption: 'Cách chia thể khả năng — từ thể từ điển (và từ thể ます)',
      head: ['Nhóm', 'Quy tắc', 'Thể từ điển → Khả năng', 'Thể ます → Khả năng ます', 'Romaji'],
      rows: [
        ['1', 'đuôi **う段 → え段 + る**', '{書|か}く → {書|か}**ける**', '{書|か}き**ます** → {書|か}け**ます**', 'kaku → kakeru · kakemasu'],
        ['1', '', '{話|はな}す → {話|はな}**せる**', '{話|はな}します → {話|はな}せます', 'hanasu → hanaseru · hanasemasu'],
        ['1', '', '{待|ま}つ → {待|ま}**てる**', '{待|ま}ちます → {待|ま}てます', 'matsu → materu · matemasu'],
        ['1', '', '{読|よ}む → {読|よ}**める**', '{読|よ}みます → {読|よ}めます', 'yomu → yomeru · yomemasu'],
        ['1', '', '{遊|あそ}ぶ → {遊|あそ}**べる**', '{遊|あそ}びます → {遊|あそ}べます', 'asobu → asoberu · asobemasu'],
        ['1', '', '{泳|およ}ぐ → {泳|およ}**げる**', '{泳|およ}ぎます → {泳|およ}げます', 'oyogu → oyogeru · oyogemasu'],
        ['1', '', '{帰|かえ}る → {帰|かえ}**れる**', '{帰|かえ}ります → {帰|かえ}れます', 'kaeru → kaereru · kaeremasu'],
        ['1', '', '{買|か}う → {買|か}**える**', '{買|か}います → {買|か}えます', 'kau → kaeru · kaemasu'],
        ['1', '', '{行|い}く → {行|い}**ける**', '{行|い}きます → {行|い}けます', 'iku → ikeru · ikemasu'],
        ['2', 'bỏ **る** + **られる**', '{食|た}べる → {食|た}べ**られる**', '{食|た}べます → {食|た}べられます', 'taberu → taberareru · taberaremasu'],
        ['2', '', '{見|み}る → {見|み}**られる**', '{見|み}ます → {見|み}られます', 'miru → mirareru · miraremasu'],
        ['2', '', '{起|お}きる → {起|お}き**られる**', '{起|お}きます → {起|お}きられます', 'okiru → okirareru · okiraremasu'],
        ['2', '', '{覚|おぼ}える → {覚|おぼ}え**られる**', '{覚|おぼ}えます → {覚|おぼ}えられます', 'oboeru → oboerareru · oboeraremasu'],
        ['3', '**する → できる**', 'する → **できる** · {運転|うんてん}する → {運転|うんてん}**できる**', 'します → できます · {運転|うんてん}します → {運転|うんてん}できます', 'suru → dekiru · unten dekimasu'],
        ['3', '**{来|く}る → {来|こ}られる**', '{来|く}る → **{来|こ}られる**', '{来|き}ます → **{来|こ}られます**', 'kuru → korareru · koraremasu'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo chia nhanh từ thể ます (cách cô hay dạy)',
      items: [
        '**Nhóm 1**: âm trước ます **い → え**: か**き**ます → か**け**ます, はな**し**ます → はな**せ**ます, よ**み**ます → よ**め**ます, かえ**り**ます → かえ**れ**ます. Chỉ đổi đúng **một âm**.',
        '**Nhóm 2**: chèn **られ** trước ます: たべ**ます** → たべ**られ**ます, おぼえ**ます** → おぼえ**られ**ます.',
        '**Nhóm 3**: học thuộc hai từ: します → **できます**, きます → **こられます**.',
        'Thể khả năng sinh ra **luôn là động từ nhóm 2** (đuôi ～える／～られる) ⇒ chia tiếp như {食|た}べる: {話|はな}せ**ない**, {話|はな}せ**た**, {話|はな}せ**て**, {話|はな}せ**なかった**.',
      ],
    },
    {
      t: 'table',
      caption: 'Thể khả năng chia tiếp như động từ nhóm 2 (ví dụ: 話せる)',
      head: ['Thể', 'Lịch sự', 'Thể thường', 'Romaji (thường)'],
      rows: [
        ['Hiện tại khẳng định', '{話|はな}せます', '{話|はな}せる', 'hanaseru'],
        ['Hiện tại phủ định', '{話|はな}せません', '{話|はな}せない', 'hanasenai'],
        ['Quá khứ khẳng định', '{話|はな}せました', '{話|はな}せた', 'hanaseta'],
        ['Quá khứ phủ định', '{話|はな}せませんでした', '{話|はな}せなかった', 'hanasenakatta'],
        ['Thể て', '—', '{話|はな}せて', 'hanasete'],
        ['Nhóm 2 gốc (食べられる)', '{食|た}べられません', '{食|た}べられない／{食|た}べられなかった', 'taberarenai / taberarenakatta'],
        ['Nhóm 3 (できる)', 'できませんでした', 'できない／できなかった', 'dekinai / dekinakatta'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N **が** V(khả năng)ます — NĂNG LỰC (biết làm, có khả năng)',
          vi: 'Nói khả năng của một người: biết bơi, nói được tiếng, đọc được chữ, nấu được món… Tân ngữ **を đổi thành が** (xem ghi chú ngay dưới). Hỏi "được không" → V(khả năng)ますか; mức độ thêm {少|すこ}し (một chút), あまり～ません (không… lắm), {全然|ぜんぜん}～ません (hoàn toàn không).',
          examples: [
            E('{私|わたし}は{日本語|にほんご}が{少|すこ}し{話|はな}せます。', 'Watashi wa nihongo ga sukoshi hanasemasu.', 'Tôi nói được một chút tiếng Nhật.'),
            E('ナタポンさんはタイ{料理|りょうり}が{作|つく}れます。', 'Natapon-san wa Tai ryouri ga tsukuremasu.', 'Nattapong nấu được món Thái.'),
            E('{私|わたし}は{泳|およ}げません。', 'Watashi wa oyogemasen.', 'Tôi không biết bơi.'),
            E('{漢字|かんじ}がまだあまり{読|よ}めません。', 'Kanji ga mada amari yomemasen.', 'Tôi vẫn chưa đọc được chữ Hán lắm.'),
            E('{子|こ}どものとき、{自転車|じてんしゃ}に{乗|の}れませんでした。', 'Kodomo no toki, jitensha ni noremasen deshita.', 'Hồi nhỏ tôi không đi được xe đạp. (に giữ nguyên — chỉ を mới đổi)'),
            E('アンナさんはピアノが{弾|ひ}けます。', 'Anna-san wa piano ga hikemasu.', 'Anna chơi được piano.'),
            E('{私|わたし}は{車|くるま}の{運転|うんてん}ができます。', 'Watashi wa kuruma no unten ga dekimasu.', 'Tôi lái được xe ô tô. (N + ができます)'),
          ],
        },
        {
          formula: '（Nơi / hoàn cảnh）で N **が** V(khả năng)ます — HOÀN CẢNH (ở đây / lúc này có thể)',
          vi: 'Không nói về tài năng mà nói **điều kiện cho phép**: ở chỗ này dùng được thẻ, giờ này mua được, hôm nay đến được… Rất hay gặp ở thông báo, cửa hàng, và khi trả lời lịch: {明日|あした}は{来|こ}られます.',
          examples: [
            E('この{店|みせ}ではカードが{使|つか}えます。', 'Kono mise de wa kaado ga tsukaemasu.', 'Ở cửa hàng này dùng được thẻ.'),
            E('コンビニで{切手|きって}が{買|か}えます。', 'Konbini de kitte ga kaemasu.', 'Ở cửa hàng tiện lợi mua được tem.'),
            E('この{部屋|へや}ではたばこが{吸|す}えません。', 'Kono heya de wa tabako ga suemasen.', 'Trong phòng này không được hút thuốc (không thể hút).'),
            E('{明日|あした}は{用事|ようじ}があって、バイトに{来|こ}られません。', 'Ashita wa youji ga atte, baito ni koraremasen.', 'Mai tôi có việc nên không đến chỗ làm thêm được.'),
            E('{駅|えき}から{歩|ある}いて{10分|じゅっぷん}で{行|い}けます。', 'Eki kara aruite juppun de ikemasu.', 'Từ ga đi bộ 10 phút là tới được.'),
            E('この{食堂|しょくどう}は{安|やす}くて、{500円|ごひゃくえん}で{昼|ひる}ご{飯|はん}が{食|た}べられます。', 'Kono shokudou wa yasukute, gohyaku en de hirugohan ga taberaremasu.', 'Nhà ăn này rẻ, 500 yên là ăn được bữa trưa.'),
          ],
        },
        {
          formula: 'V(khả năng) thể thường ＋ N — "N có thể V" (bổ nghĩa danh từ)',
          vi: 'Thể khả năng ở thể thường đặt **trước danh từ** như mọi câu bổ nghĩa (ôn ポイント 109). Đây là dạng **tờ tuyển người, thông báo** dùng nhiều nhất: {話|はな}せる{方|かた}, {働|はたら}ける{人|ひと}, {泳|およ}げる{場所|ばしょ}.',
          examples: [
            E('{土日|どにち}に{働|はたら}ける{方|かた}を{募集|ぼしゅう}しています。', 'Donichi ni hatarakeru kata o boshuu shite imasu.', 'Đang tuyển người làm được thứ Bảy, Chủ nhật.'),
            E('{英語|えいご}が{話|はな}せる{人|ひと}はいますか。', 'Eigo ga hanaseru hito wa imasu ka.', 'Có ai nói được tiếng Anh không?'),
            E('この{近|ちか}くに{安|やす}く{食|た}べられる{店|みせ}はありますか。', 'Kono chikaku ni yasuku taberareru mise wa arimasu ka.', 'Gần đây có quán nào ăn được giá rẻ không?'),
            E('{日本語|にほんご}で{答|こた}えられなかった{質問|しつもん}がありました。', 'Nihongo de kotaerarenakatta shitsumon ga arimashita.', 'Có một câu hỏi tôi không trả lời được bằng tiếng Nhật.'),
            E('{海|うみ}が{見|み}える{部屋|へや}がいいです。', 'Umi ga mieru heya ga ii desu.', 'Tôi muốn phòng nhìn thấy biển. (見える — xem bảng phân biệt bên dưới)'),
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Trợ từ với thể khả năng — を đổi thành が, các trợ từ khác GIỮ NGUYÊN',
      items: [
        '**を → が**: {日本語|にほんご}**を**{話|はな}します → {日本語|にほんご}**が**{話|はな}せます. Sách giáo khoa và đề N4 dùng **が**; trong hội thoại đôi khi vẫn nghe を (nhất là khi tân ngữ dài), nhưng làm bài hãy chọn **が**.',
        '**Trợ từ khác không đổi**: {自転車|じてんしゃ}**に**{乗|の}れます, {一人|ひとり}**で**{行|い}けます, {駅|えき}**まで**{歩|ある}けます, {友達|ともだち}**と**{会|あ}えます.',
        '**Chủ ngữ** (người có khả năng) thường đi với **は**: {私|わたし}**は**{日本語|にほんご}**が**{話|はな}せます (giống ポイント 74: N1 は N2 が …).',
        'Câu phủ định / so sánh hay đổi **が → は**: {漢字|かんじ}**は**{読|よ}めますが、{書|か}けません (đọc được nhưng KHÔNG viết được) — は đánh dấu sự đối lập (ôn ポイント 100).',
      ],
    },
    {
      t: 'table',
      caption: 'Thể khả năng ↔ ～ことができます (ôn Bài 9 ポイント 82, Bài 10 ポイント 93)',
      head: ['', 'V{可能形|かのうけい}', 'V{辞書形|じしょけい} ことができます', 'N ができます'],
      rows: [
        ['Ví dụ', '{日本語|にほんご}が{話|はな}せます。', '{日本語|にほんご}を{話|はな}すことができます。', '{日本語|にほんご}ができます。'],
        ['Romaji', 'Nihongo ga hanasemasu.', 'Nihongo o hanasu koto ga dekimasu.', 'Nihongo ga dekimasu.'],
        ['Trợ từ của tân ngữ', '**が** (を → が)', '**を** giữ nguyên trong vế こと', 'N **が**'],
        ['Sắc thái', 'tự nhiên, văn nói hằng ngày', 'trang trọng hơn, văn viết, thông báo', 'nói chung "giỏi / biết môn đó"'],
        ['Khi nào nên dùng', 'hội thoại, phỏng vấn, thi nói', 'bài viết, nội quy, giải thích', 'môn thể thao, ngoại ngữ, nhạc cụ'],
      ],
    },
    {
      t: 'table',
      caption: '見える／聞こえる (ôn Bài 10 ポイント 94) ↔ 見られる／聞ける — bẫy kinh điển của đề N4',
      head: ['Động từ', 'Nghĩa', 'Khi nào', 'Ví dụ', 'Romaji'],
      rows: [
        ['{見|み}えます', '(tự) nhìn thấy, hiện ra trong mắt', 'không cần cố ý, vật tự lọt vào mắt', '{窓|まど}から{富士山|ふじさん}が{見|み}えます。', 'Mado kara Fujisan ga miemasu.'],
        ['{見|み}られます', 'xem được (có cơ hội / điều kiện)', 'mình chủ động muốn xem và có điều kiện để xem', 'このアプリで{日本|にほん}のドラマが{見|み}られます。', 'Kono apuri de Nihon no dorama ga miraremasu.'],
        ['{聞|き}こえます', '(tự) nghe thấy', 'âm thanh tự đến tai', '{隣|となり}の{部屋|へや}から{音楽|おんがく}が{聞|き}こえます。', 'Tonari no heya kara ongaku ga kikoemasu.'],
        ['{聞|き}けます', 'nghe được (có điều kiện); hỏi được', 'mình chủ động nghe, có phương tiện để nghe', 'インターネットでラジオが{聞|き}けます。', 'Intaanetto de rajio ga kikemasu.'],
      ],
    },
    {
      t: 'note',
      title: 'Động từ KHÔNG có thể khả năng (hay bị chia sai)',
      items: [
        '**ある** — không có thể khả năng. "Có thể có" diễn đạt bằng mẫu khác (～かもしれない, Bài 20).',
        '**わかる, できる, {見|み}える, {聞|き}こえる** — bản thân đã mang nghĩa "được/có thể" ⇒ không chia thêm: ~~わかれる~~, ~~できられる~~, ~~{見|み}えられる~~.',
        '**{知|し}る** — nói "biết" dùng {知|し}っています (Bài 13); không nói ~~{知|し}れます~~ với nghĩa "biết được".',
        'Thể khả năng **không dùng cho đồ vật vô tri tự làm**: ~~ドアが{開|あ}けられます~~ khi muốn nói "cửa mở được" → dùng {開|あ}きます／{開|あ}けることができます tuỳ ý.',
      ],
    },
    DL('Hỏi – đáp với thể khả năng (phỏng vấn, đời sống)', [
      ['{店長|てんちょう}', 'examiner', '{日本語|にほんご}の{敬語|けいご}が{使|つか}えますか。', 'Nihongo no keigo ga tsukaemasu ka.', 'Em dùng được kính ngữ tiếng Nhật không?'],
      ['ナタポン', 'b', 'はい、{少|すこ}し{使|つか}えます。でも、まだ{上手|じょうず}じゃありません。', 'Hai, sukoshi tsukaemasu. Demo, mada jouzu ja arimasen.', 'Vâng, em dùng được một chút. Nhưng chưa giỏi ạ.'],
      ['{店長|てんちょう}', 'examiner', '{朝|あさ}{7時|しちじ}に{来|こ}られますか。', 'Asa shichiji ni koraremasu ka.', 'Em đến được lúc 7 giờ sáng không?'],
      ['ナタポン', 'b', 'すみません、{7時|しちじ}はちょっと……。{8時|はちじ}からは{来|こ}られます。', 'Sumimasen, shichiji wa chotto……. Hachiji kara wa koraremasu.', 'Xin lỗi, 7 giờ thì hơi khó… Từ 8 giờ thì em đến được ạ. (は: riêng mốc này thì được)'],
      ['ワン', 'a', '{鈴木|すずき}さん、{漢字|かんじ}がたくさん{書|か}けますね。', 'Suzuki-san, kanji ga takusan kakemasu ne.', 'Chị Suzuki viết được nhiều chữ Hán nhỉ.'],
      ['{鈴木|すずき}', 'c', '{読|よ}めるけど、{書|か}けない{漢字|かんじ}も{多|おお}いよ。', 'Yomeru kedo, kakenai kanji mo ooi yo.', 'Đọc được nhưng chữ không viết được cũng nhiều lắm.'],
      ['マルコ', 'b', 'この{近|ちか}くに、{夜|よる}{遅|おそ}くまで{勉強|べんきょう}できる{場所|ばしょ}はありますか。', 'Kono chikaku ni, yoru osoku made benkyou dekiru basho wa arimasu ka.', 'Gần đây có chỗ nào học được đến khuya không?'],
      ['アンナ', 'c', '{駅|えき}の{前|まえ}のカフェは{11時|じゅういちじ}まで{使|つか}えますよ。', 'Eki no mae no kafe wa juuichiji made tsukaemasu yo.', 'Quán cà phê trước ga dùng được đến 11 giờ đấy.'],
    ]),
    {
      t: 'table',
      caption: 'Bảng thay thế — tự nói câu mới: 「（私は）＿＿が V(khả năng)ます／ません」',
      head: ['Năng lực', 'Động từ gốc', 'Câu khẳng định', 'Câu phủ định', 'Romaji (khẳng định)'],
      rows: [
        ['tiếng Nhật', '{話|はな}す', '{日本語|にほんご}が{話|はな}せます。', '{日本語|にほんご}が{話|はな}せません。', 'Nihongo ga hanasemasu.'],
        ['chữ Hán', '{書|か}く', '{漢字|かんじ}が{書|か}けます。', '{漢字|かんじ}が{書|か}けません。', 'Kanji ga kakemasu.'],
        ['đồ ăn cay', '{食|た}べる', '{辛|から}い{物|もの}が{食|た}べられます。', '{辛|から}い{物|もの}が{食|た}べられません。', 'Karai mono ga taberaremasu.'],
        ['dậy sớm', '{起|お}きる', '{朝|あさ}{5時|ごじ}に{起|お}きられます。', '{朝|あさ}{5時|ごじ}に{起|お}きられません。', 'Asa goji ni okiraremasu.'],
        ['máy tính tiền', '{打|う}つ', 'レジが{打|う}てます。', 'レジが{打|う}てません。', 'Reji ga utemasu.'],
        ['lái xe', '{運転|うんてん}する', '{車|くるま}が{運転|うんてん}できます。', '{車|くるま}が{運転|うんてん}できません。', 'Kuruma ga unten dekimasu.'],
        ['đến thứ Bảy', '{来|く}る', '{土曜日|どようび}に{来|こ}られます。', '{土曜日|どようび}に{来|こ}られません。', 'Doyoubi ni koraremasu.'],
        ['đi một mình', '{行|い}く', '{一人|ひとり}で{行|い}けます。', '{一人|ひとり}で{行|い}けません。', 'Hitori de ikemasu.'],
      ],
    },
    { t: 'rule', formula: 'N が V(可能形)ます ／ V(可能形)thường ＋ N', vi: 'Nói "làm được / có thể" — năng lực của người hoặc điều kiện của nơi chốn; を đổi thành が; thể khả năng chia tiếp như động từ nhóm 2.' },
    {
      t: 'note',
      title: 'Lỗi hay mắc với thể khả năng',
      items: [
        '~~{書|か}けれます~~ / ~~{行|い}けれます~~ — nhóm 1 chỉ đổi い→え: **{書|か}けます**, **{行|い}けます**. Đừng thêm れ.',
        '~~{食|た}べれます~~ / ~~{見|み}れます~~ / ~~{来|こ}れます~~ — đây là **ら抜き言葉** (bỏ ら), người trẻ nói nhiều nhưng **sai chuẩn**. Thi, viết, phỏng vấn: **{食|た}べられます・{見|み}られます・{来|こ}られます**.',
        '~~しれます~~ / ~~すられます~~ — する → **できる**. ~~{勉強|べんきょう}られます~~ → **{勉強|べんきょう}できます**.',
        '~~{日本語|にほんご}をできます~~ — できる luôn đi với **が**: {日本語|にほんご}**が**できます.',
        '**{買|か}える (mua được) ↔ {帰|かえ}る (về)** — cùng âm かえる! {買|か}えます (kaemasu) ↔ {帰|かえ}ります (kaerimasu); thể khả năng của {帰|かえ}る là **{帰|かえ}れます** (kaeremasu). Nghe kỹ âm cuối.',
        'Lẫn **thể khả năng** với **thể bị động (Bài 22)**: nhóm 2 và {来|こ}られる có hình thức giống hệt bị động ({食|た}べられる = ăn được / bị ăn). Nhìn **trợ từ**: {私|わたし}は{刺身|さしみ}**が**{食|た}べられます (ăn được) ↔ ケーキを{弟|おとうと}**に**{食|た}べられました (bị em trai ăn mất).',
      ],
    },

    /* ══════ ② THỂ Ý CHÍ ══════ */
    { t: 'h', text: '② Thể ý chí (意向形) — cách chia và dùng thay ～ましょう khi nói thân mật' },
    {
      t: 'p',
      text: 'Thể ý chí là **dạng thường (thân mật) của ～ましょう**: {行|い}きましょう → **{行|い}こう**, {食|た}べましょう → **{食|た}べよう**. Bài 11 (ポイント 103) bạn đã học nói với bạn bè bằng thể thường, nhưng còn thiếu đúng chỗ này: rủ bạn "đi thôi!" thì không nói ~~{行|い}くね~~ mà nói **{行|い}こう！** Thể ý chí còn là "nguyên liệu" cho mẫu **～（よ）うと{思|おも}います** (định làm) ở mục ③.',
    },
    {
      t: 'table',
      caption: 'Cách chia thể ý chí',
      head: ['Nhóm', 'Quy tắc', 'Thể từ điển → Ý chí', 'Từ thể ます', 'Romaji'],
      rows: [
        ['1', 'đuôi **う段 → お段 + う**', '{行|い}く → {行|い}**こう**', '{行|い}き**ます** → {行|い}**こう**', 'iku → ikou'],
        ['1', '', '{話|はな}す → {話|はな}**そう**', '{話|はな}します → {話|はな}そう', 'hanasu → hanasou'],
        ['1', '', '{待|ま}つ → {待|ま}**とう**', '{待|ま}ちます → {待|ま}とう', 'matsu → matou'],
        ['1', '', '{読|よ}む → {読|よ}**もう**', '{読|よ}みます → {読|よ}もう', 'yomu → yomou'],
        ['1', '', '{遊|あそ}ぶ → {遊|あそ}**ぼう**', '{遊|あそ}びます → {遊|あそ}ぼう', 'asobu → asobou'],
        ['1', '', '{泳|およ}ぐ → {泳|およ}**ごう**', '{泳|およ}ぎます → {泳|およ}ごう', 'oyogu → oyogou'],
        ['1', '', '{帰|かえ}る → {帰|かえ}**ろう**', '{帰|かえ}ります → {帰|かえ}ろう', 'kaeru → kaerou'],
        ['1', '', '{買|か}う → {買|か}**おう**', '{買|か}います → {買|か}おう', 'kau → kaou'],
        ['1', '', '{頑張|がんば}る → {頑張|がんば}**ろう**', '{頑張|がんば}ります → {頑張|がんば}ろう', 'ganbaru → ganbarou'],
        ['2', 'bỏ **る** + **よう**', '{食|た}べる → {食|た}べ**よう**', '{食|た}べます → {食|た}べよう', 'taberu → tabeyou'],
        ['2', '', '{見|み}る → {見|み}**よう**', '{見|み}ます → {見|み}よう', 'miru → miyou'],
        ['2', '', '{始|はじ}める → {始|はじ}め**よう**', '{始|はじ}めます → {始|はじ}めよう', 'hajimeru → hajimeyou'],
        ['3', '**する → しよう**', 'する → **しよう** · {勉強|べんきょう}する → {勉強|べんきょう}**しよう**', 'します → しよう', 'suru → shiyou'],
        ['3', '**{来|く}る → {来|こ}よう**', '{来|く}る → **{来|こ}よう**', '{来|き}ます → **{来|こ}よう**', 'kuru → koyou'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo chia nhanh thể ý chí',
      items: [
        '**Nhóm 1**: âm trước ます **い → お**, rồi thêm **う** (kéo dài): い**き**ます → い**こ**う, よ**み**ます → よ**も**う, かえ**り**ます → かえ**ろ**う, か**い**ます → か**お**う.',
        '**Nhóm 2**: bỏ ます + **よう**: たべ**ます** → たべ**よう**.',
        '**Nhóm 3**: します → **しよう**, きます → **こよう**.',
        'So với thể khả năng: nhóm 1 khả năng **い→え** (行**け**ます), ý chí **い→お + う** (行**こう**). Hai bảng đặt cạnh nhau là nhớ: か**き** → か**け** / か**こう**.',
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'V(ý chí)。 — "… thôi! / cùng … nhé!" (thân mật = ～ましょう)',
          vi: 'Rủ hoặc hô hào người thân, bạn bè, đồng nghiệp ngang hàng cùng làm. Với người trên, khách, người mới quen → vẫn dùng **～ましょう**.',
          examples: [
            E('もう{遅|おそ}いから、{帰|かえ}ろう。', 'Mou osoi kara, kaerou.', 'Muộn rồi, về thôi.'),
            E('{一緒|いっしょ}に{昼|ひる}ご{飯|はん}を{食|た}べよう。', 'Issho ni hirugohan o tabeyou.', 'Cùng ăn trưa nhé.'),
            E('{試験|しけん}まであと{1週間|いっしゅうかん}だね。{頑張|がんば}ろう！', 'Shiken made ato isshuukan da ne. Ganbarou!', 'Còn một tuần nữa là thi nhỉ. Cùng cố lên!'),
            E('{雨|あめ}が{降|ふ}っているから、タクシーで{行|い}こう。', 'Ame ga futte iru kara, takushii de ikou.', 'Trời đang mưa nên đi taxi đi.'),
            E('じゃ、{駅|えき}の{前|まえ}で{会|あ}おう。', 'Ja, eki no mae de aou.', 'Vậy gặp nhau trước ga nhé.'),
            E('{土曜日|どようび}、うちに{来|こ}ようよ。{一緒|いっしょ}にゲームをしよう。', 'Doyoubi, uchi ni koyou yo. Issho ni geemu o shiyou.', 'Thứ Bảy đến nhà mình đi. Cùng chơi game nhé.'),
          ],
        },
        {
          formula: 'V(ý chí) か。 — "… nhé? / để mình … nhé?" (thân mật = ～ましょうか)',
          vi: 'Thêm **か** (lên giọng) để **hỏi ý** người kia: rủ nhẹ hơn (行こうか = đi nhé?), hoặc **đề nghị giúp** (手伝おうか = để mình giúp nhé?) — đúng hai nghĩa của ～ましょうか (ôn Bài 7 ポイント 65).',
          examples: [
            E('{疲|つか}れたね。ちょっと{休|やす}もうか。', 'Tsukareta ne. Chotto yasumou ka.', 'Mệt nhỉ. Nghỉ một chút nhé?'),
            E('{荷物|にもつ}、{持|も}とうか。——ありがとう。', 'Nimotsu, motou ka. — Arigatou.', 'Để mình xách đồ cho nhé? — Cảm ơn.'),
            E('{窓|まど}を{開|あ}けようか。——うん、お{願|ねが}い。', 'Mado o akeyou ka. — Un, onegai.', 'Mở cửa sổ nhé? — Ừ, nhờ cậu.'),
            E('{何|なに}を{食|た}べようか。——ラーメンはどう？', 'Nani o tabeyou ka. — Raamen wa dou?', 'Ăn gì nhỉ? — Mì ramen thì sao?'),
            E('{明日|あした}、{何時|なんじ}に{会|あ}おうか。', 'Ashita, nanji ni aou ka.', 'Mai mấy giờ gặp nhau nhỉ?'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Lịch sự ↔ thân mật — đổi một chỗ',
      head: ['Lịch sự (ます)', 'Thân mật (ý chí)', 'Romaji', 'Nghĩa'],
      rows: [
        ['{行|い}きましょう。', '{行|い}こう。', 'Ikou.', 'Đi thôi.'],
        ['{行|い}きましょうか。', '{行|い}こうか。', 'Ikou ka.', 'Đi nhé? / Mình đi nhé?'],
        ['{手伝|てつだ}いましょうか。', '{手伝|てつだ}おうか。', 'Tetsudaou ka.', 'Để mình giúp nhé?'],
        ['{休憩|きゅうけい}しましょう。', '{休憩|きゅうけい}しよう。', 'Kyuukei shiyou.', 'Nghỉ giải lao thôi.'],
        ['また{来|き}ましょう。', 'また{来|こ}よう。', 'Mata koyou.', 'Lần sau lại đến nhé.'],
        ['{行|い}きませんか。', '{行|い}かない？', 'Ikanai?', 'Đi không? (rủ thân mật bằng ない + lên giọng — ôn Bài 11)'],
      ],
    },
    {
      t: 'note',
      title: 'Chú ý khi dùng thể ý chí để rủ',
      items: [
        '**{行|い}かない？** (đi không?) hỏi ý người kia → người kia đáp **うん、{行|い}こう** (ừ, đi thôi) — giống cặp ませんか → ましょう ở Bài 6.',
        'Thể ý chí đứng một mình **không dùng với người trên**: ~~{先生|せんせい}、{一緒|いっしょ}に{行|い}こう~~ → {先生|せんせい}、{一緒|いっしょ}に{行|い}きませんか.',
        'Thêm **よ** để giục, rủ mạnh hơn: {行|い}こう**よ**！ (đi đi mà!). Thêm **か** để mềm và hỏi ý: {行|い}こう**か**.',
      ],
    },

    /* ══════ ③ V意向形と思います ══════ */
    { t: 'h', text: '③ V(ý chí) ＋ と思います／と思っています — "tôi định…, tôi đang tính…"' },
    {
      t: 'p',
      text: 'Bài 14–15 bạn đã có **{普通形|ふつうけい} ＋ と{思|おも}います** = "tôi nghĩ là…" (ý kiến, đoán). Đặt **thể ý chí** vào chỗ thể thường thì nghĩa đổi hẳn: **{行|い}こうと{思|おも}います = tôi định đi** (ý định của chính mình). So sánh: {行|い}**く**と{思|おも}います (tôi nghĩ là [ai đó] sẽ đi — đoán) ↔ {行|い}**こう**と{思|おも}います (tôi định đi — ý định).',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'V(ý chí) と{思|おも}います — ý định vừa nảy ra / quyết ngay lúc nói',
          vi: 'Nói ra ý định **ngay lúc này**, thường là quyết định vừa đưa ra: "thôi, mình sẽ…". Chỉ dùng cho **chính người nói** (ngôi thứ nhất).',
          examples: [
            E('{今日|きょう}は{疲|つか}れたから、{早|はや}く{寝|ね}ようと{思|おも}います。', 'Kyou wa tsukareta kara, hayaku neyou to omoimasu.', 'Hôm nay mệt rồi nên tôi định đi ngủ sớm.'),
            E('{面接|めんせつ}を{受|う}けようと{思|おも}います。', 'Mensetsu o ukeyou to omoimasu.', 'Tôi định đi phỏng vấn.'),
            E('この{辞書|じしょ}は{安|やす}くて{便利|べんり}だから、{買|か}おうと{思|おも}います。', 'Kono jisho wa yasukute benri da kara, kaou to omoimasu.', 'Cuốn từ điển này rẻ lại tiện nên tôi định mua.'),
            E('{来月|らいげつ}から{毎朝|まいあさ}ジョギングしようと{思|おも}います。', 'Raigetsu kara maiasa jogingu shiyou to omoimasu.', 'Từ tháng sau tôi định sáng nào cũng chạy bộ.'),
            E('{試験|しけん}に{必|かなら}ず{合格|ごうかく}しようと{思|おも}います。', 'Shiken ni kanarazu goukaku shiyou to omoimasu.', 'Tôi quyết sẽ thi đỗ bằng được.'),
          ],
        },
        {
          formula: 'V(ý chí) と{思|おも}っています — ý định đã có từ trước, đang giữ',
          vi: 'Ý định **đã nghĩ từ lâu và vẫn đang giữ**. Đây là cách **kể kế hoạch** tự nhiên nhất (nghỉ hè, sau tốt nghiệp). Nói về **người khác** (ngôi thứ ba) thì **bắt buộc** dùng と{思|おも}っています.',
          examples: [
            E('{夏休|なつやす}みに{国|くに}へ{帰|かえ}ろうと{思|おも}っています。', 'Natsuyasumi ni kuni e kaerou to omotte imasu.', 'Tôi đang tính nghỉ hè về nước.'),
            E('{将来|しょうらい}は{日本|にほん}で{働|はたら}こうと{思|おも}っています。', 'Shourai wa Nihon de hatarakou to omotte imasu.', 'Sau này tôi định làm việc ở Nhật.'),
            E('アンナさんは{大学院|だいがくいん}に{進学|しんがく}しようと{思|おも}っています。', 'Anna-san wa daigakuin ni shingaku shiyou to omotte imasu.', 'Anna đang định học lên cao học. (ngôi thứ ba → 思っています)'),
            E('バイトでお{金|かね}を{貯|た}めて、{車|くるま}を{買|か}おうと{思|おも}っています。', 'Baito de okane o tamete, kuruma o kaou to omotte imasu.', 'Tôi định làm thêm để dành tiền mua ô tô.'),
            E('{来年|らいねん}、N3を{受|う}けようと{思|おも}っています。', 'Rainen, enu san o ukeyou to omotte imasu.', 'Năm sau tôi định thi N3.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'と思います ↔ と思っています',
      head: ['', 'V(ý chí) と{思|おも}います', 'V(ý chí) と{思|おも}っています'],
      rows: [
        ['Ý định', 'vừa quyết, nói ra lúc này', 'đã có từ trước, đang ấp ủ'],
        ['Ai', 'chỉ **tôi**', '**tôi** hoặc **người khác** (彼／アンナさんは…)'],
        ['Ví dụ', '{今日|きょう}は{早|はや}く{帰|かえ}ろうと{思|おも}います。', '{来年|らいねん}{帰国|きこく}しようと{思|おも}っています。'],
        ['Romaji', 'Kyou wa hayaku kaerou to omoimasu.', 'Rainen kikoku shiyou to omotte imasu.'],
        ['Hỏi người khác', '(không dùng)', '{何|なに}をしようと{思|おも}っていますか。'],
      ],
    },
    {
      t: 'table',
      caption: 'Ba cách nói "muốn / định" — đừng lẫn',
      head: ['Mẫu', 'Nghĩa', 'Ví dụ', 'Romaji'],
      rows: [
        ['V(ます bỏ ます)たいです (Bài 5)', 'muốn (mong muốn, chưa chắc sẽ làm)', '{日本|にほん}で{働|はたら}きたいです。', 'Nihon de hatarakitai desu.'],
        ['{普通形|ふつうけい} と{思|おも}います (Bài 14)', 'tôi nghĩ là… (đoán, ý kiến)', 'マルコさんは{日本|にほん}で{働|はたら}くと{思|おも}います。', 'Maruko-san wa Nihon de hataraku to omoimasu.'],
        ['V(ý chí) と{思|おも}います (Bài 16)', 'tôi định… (ý định của mình)', '{日本|にほん}で{働|はたら}こうと{思|おも}います。', 'Nihon de hatarakou to omoimasu.'],
      ],
    },
    DL('Hỏi – đáp: kể dự định', [
      ['パク', 'a', '{冬休|ふゆやす}みは{何|なに}をしようと{思|おも}っていますか。', 'Fuyuyasumi wa nani o shiyou to omotte imasu ka.', 'Nghỉ đông bạn đang tính làm gì?'],
      ['カルロス', 'b', 'スキーに{行|い}こうと{思|おも}っています。パクさんは？', 'Sukii ni ikou to omotte imasu. Paku-san wa?', 'Mình đang tính đi trượt tuyết. Còn Park?'],
      ['パク', 'a', '{私|わたし}は{韓国|かんこく}へ{帰|かえ}ろうと{思|おも}っています。{家族|かぞく}に{会|あ}いたいですから。', 'Watashi wa Kankoku e kaerou to omotte imasu. Kazoku ni aitai desu kara.', 'Mình định về Hàn Quốc. Vì mình muốn gặp gia đình.'],
      ['カルロス', 'b', 'あ、もう{12時|じゅうにじ}だ。{食堂|しょくどう}へ{行|い}こうか。', 'A, mou juuniji da. Shokudou e ikou ka.', 'À, 12 giờ rồi. Đi nhà ăn nhé?'],
      ['パク', 'a', 'うん、{行|い}こう。{今日|きょう}はカレーを{食|た}べようと{思|おも}います。', 'Un, ikou. Kyou wa karee o tabeyou to omoimasu.', 'Ừ, đi thôi. Hôm nay mình định ăn cà ri.'],
    ]),
    {
      t: 'table',
      caption: 'Bảng thay thế — 「（時）は ＿＿ (よ)うと思っています」',
      head: ['Thời điểm', 'Việc', 'Câu', 'Romaji'],
      rows: [
        ['{夏休|なつやす}み', '{国|くに}へ{帰|かえ}る', '{夏休|なつやす}みは{国|くに}へ{帰|かえ}ろうと{思|おも}っています。', 'Natsuyasumi wa kuni e kaerou to omotte imasu.'],
        ['{週末|しゅうまつ}', '{部屋|へや}を{片付|かたづ}ける', '{週末|しゅうまつ}は{部屋|へや}を{片付|かたづ}けようと{思|おも}っています。', 'Shuumatsu wa heya o katazukeyou to omotte imasu.'],
        ['{来月|らいげつ}', 'バイトを{始|はじ}める', '{来月|らいげつ}はバイトを{始|はじ}めようと{思|おも}っています。', 'Raigetsu wa baito o hajimeyou to omotte imasu.'],
        ['{来年|らいねん}', 'N3を{受|う}ける', '{来年|らいねん}はN3を{受|う}けようと{思|おも}っています。', 'Rainen wa enu san o ukeyou to omotte imasu.'],
        ['{卒業|そつぎょう}したら', '{就職|しゅうしょく}する', '{卒業|そつぎょう}したら、{就職|しゅうしょく}しようと{思|おも}っています。', 'Sotsugyou shitara, shuushoku shiyou to omotte imasu.'],
        ['{今晩|こんばん}', '{友達|ともだち}に{連絡|れんらく}する', '{今晩|こんばん}は{友達|ともだち}に{連絡|れんらく}しようと{思|おも}っています。', 'Konban wa tomodachi ni renraku shiyou to omotte imasu.'],
      ],
    },
    { t: 'rule', formula: 'V(意向形) と思います ／ と思っています', vi: 'Nói ý định của mình (vừa quyết / đã ấp ủ); kể ý định của người khác thì chỉ dùng と思っています.' },
    {
      t: 'note',
      title: 'Lỗi hay mắc với thể ý chí',
      items: [
        '~~{行|い}きよう~~ / ~~{帰|かえ}りよう~~ — nhóm 1 không thêm よう: **{行|い}こう**, **{帰|かえ}ろう**. ~~{食|た}べろう~~ — nhóm 2 là **{食|た}べよう**.',
        '~~{来|き}よう~~ — {来|く}る → **{来|こ}よう** (koyou). ~~すろう~~ → **しよう**.',
        '**Ý định phủ định không dùng thể ý chí**: ~~{行|い}かないようと{思|おも}います~~ ✗. Nói "định không đi" → **{行|い}かないつもりです** (mục ④) hoặc **{行|い}くのはやめようと{思|おも}います** (thôi không đi nữa).',
        '**{行|い}くと{思|おも}います** ≠ **{行|い}こうと{思|おも}います**: cái trước là đoán (tôi nghĩ [anh ấy] sẽ đi), cái sau là ý định của tôi. Đề N4 rất hay gài chỗ này.',
        'Kể ý định người khác: ~~マルコさんは{帰|かえ}ろうと{思|おも}います~~ → **マルコさんは{帰|かえ}ろうと{思|おも}っています**.',
      ],
    },
    {
      t: 'note',
      title: 'Biết trước (gặp ở N3) — ～（よ）うとする',
      items: [
        'Thể ý chí còn đứng trước **とする／としたとき** = "định làm / vừa sắp làm thì…": {出|で}かけようとしたとき、{電話|でんわ}が{鳴|な}りました (vừa định ra ngoài thì điện thoại reo). Đây là mẫu cấp **N3** — Bài 16 chỉ cần **nhận ra** khi đọc, chưa phải dùng.',
      ],
    },

    /* ══════ ④ つもり ══════ */
    { t: 'h', text: '④ V辞書形／Vない ＋ つもりです — "định (không) làm…" (ý định đã quyết)' },
    {
      t: 'p',
      text: '**つもり** là danh từ "ý định". Đặt **động từ thể từ điển** hoặc **thể ない** trước nó: {帰|かえ}る**つもり**です (định về), {帰|かえ}らない**つもり**です (định không về). So với ～（よ）うと{思|おも}っています, **つもり chắc hơn** — kế hoạch đã quyết trong lòng, thường đã nghĩ kỹ.',
    },
    {
      t: 'table',
      caption: 'Các dạng của ～つもり',
      head: ['Dạng', 'Công thức', 'Ví dụ', 'Romaji', 'Nghĩa'],
      rows: [
        ['Định làm', 'V{辞書形|じしょけい} ＋ つもりです', '{来年|らいねん}{帰国|きこく}するつもりです。', 'Rainen kikoku suru tsumori desu.', 'Sang năm tôi định về nước.'],
        ['Định không làm', 'Vない ＋ つもりです', '{今年|ことし}は{帰国|きこく}しないつもりです。', 'Kotoshi wa kikoku shinai tsumori desu.', 'Năm nay tôi định không về.'],
        ['Hoàn toàn không có ý định', 'V{辞書形|じしょけい} ＋ つもりはありません', 'バイトを{辞|や}めるつもりはありません。', 'Baito o yameru tsumori wa arimasen.', 'Tôi không hề có ý định nghỉ làm thêm. (mạnh)'],
        ['Đã định (nhưng…)', 'V{辞書形|じしょけい} ＋ つもりでした', '{行|い}くつもりでしたが、{行|い}けませんでした。', 'Iku tsumori deshita ga, ikemasen deshita.', 'Tôi đã định đi nhưng không đi được.'],
        ['Thể thường', '～つもりだ／つもり', '{辞|や}めるつもり。', 'Yameru tsumori.', 'Định nghỉ. (nói với bạn — câu của 鈴木さん)'],
        ['Hỏi', '～つもりですか', '{夏休|なつやす}みはどうするつもりですか。', 'Natsuyasumi wa dou suru tsumori desu ka.', 'Nghỉ hè bạn định làm gì?'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'V{辞書形|じしょけい} つもりです／Vない つもりです',
          vi: 'Ý định **đã quyết** của người nói (hoặc người khác — {彼|かれ}は～つもりです cũng được, kể lại ý định người đó đã nói). Thời gian thường là tương lai gần hoặc xa; hay đi với {卒業|そつぎょう}したら, {将来|しょうらい}, {来年|らいねん}.',
          examples: [
            E('{卒業|そつぎょう}したら、{日本|にほん}の{会社|かいしゃ}に{就職|しゅうしょく}するつもりです。', 'Sotsugyou shitara, Nihon no kaisha ni shuushoku suru tsumori desu.', 'Tốt nghiệp xong tôi định vào làm công ty Nhật.'),
            E('{今日|きょう}から{毎日|まいにち}{漢字|かんじ}を{10個|じゅっこ}{覚|おぼ}えるつもりです。', 'Kyou kara mainichi kanji o jukko oboeru tsumori desu.', 'Từ hôm nay tôi định mỗi ngày thuộc 10 chữ Hán.'),
            E('もう{二度|にど}と{遅刻|ちこく}しないつもりです。', 'Mou nido to chikoku shinai tsumori desu.', 'Tôi quyết sẽ không bao giờ đến muộn nữa.'),
            E('{夏休|なつやす}みは{旅行|りょこう}しないで、バイトをするつもりです。', 'Natsuyasumi wa ryokou shinaide, baito o suru tsumori desu.', 'Nghỉ hè tôi định không đi du lịch mà đi làm thêm.'),
            E('{鈴木|すずき}さんは{3月|さんがつ}でバイトを{辞|や}めるつもりです。', 'Suzuki-san wa sangatsu de baito o yameru tsumori desu.', 'Chị Suzuki định nghỉ làm thêm vào tháng 3.'),
            E('{国|くに}へ{帰|かえ}っても、{日本語|にほんご}の{勉強|べんきょう}は{続|つづ}けるつもりです。', 'Kuni e kaette mo, nihongo no benkyou wa tsuzukeru tsumori desu.', 'Dù về nước tôi vẫn định tiếp tục học tiếng Nhật. (～ても ôn Bài 15)'),
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'つもり — chú ý cách hỏi và cách phủ định',
      items: [
        '**Hỏi người trên bằng ～つもりですか dễ nghe sỗ** (như tra hỏi "định làm gì đấy?"). Với thầy cô, cấp trên → hỏi **～{予定|よてい}ですか** hoặc dùng kính ngữ (Bài 24). Với bạn bè dùng thoải mái.',
        '**Vないつもりです** (định không làm) — bình thường, mềm. **V{辞書形|じしょけい}つもりはありません** — dứt khoát, phủ nhận mạnh ("không hề có ý định"), dùng khi bị hiểu lầm hoặc bị ép: {辞|や}めるつもりはありません！',
        '**~~{行|い}くつもりじゃありません~~** để nói "định không đi" — sai sắc thái. Dùng {行|い}かないつもりです hoặc {行|い}くつもりはありません.',
        '**Danh từ + のつもり** và **Vた + つもり** (tưởng là…, coi như đã…) là nghĩa khác, cấp **N3** — ví dụ: {買|か}ったつもりで{貯金|ちょきん}する (coi như đã mua rồi, đem tiền đi để dành). Bài 16 chưa cần dùng.',
      ],
    },
    DL('Hỏi – đáp với ～つもりです', [
      ['ダニエル', 'b', 'ワンさん、{卒業|そつぎょう}したら、どうするつもり？', 'Wan-san, sotsugyou shitara, dou suru tsumori?', 'Wang, tốt nghiệp xong định làm gì?'],
      ['ワン', 'a', '{国|くに}へ{帰|かえ}らないで、{日本|にほん}で{就職|しゅうしょく}するつもりです。ダニエルさんは？', 'Kuni e kaeranaide, Nihon de shuushoku suru tsumori desu. Danieru-san wa?', 'Mình định không về nước mà đi làm ở Nhật. Còn Daniel?'],
      ['ダニエル', 'b', '{僕|ぼく}は{大学院|だいがくいん}に{進学|しんがく}するつもり。でも、{試験|しけん}が{難|むずか}しいんだ。', 'Boku wa daigakuin ni shingaku suru tsumori. Demo, shiken ga muzukashii n da.', 'Mình định học lên cao học. Nhưng kỳ thi khó lắm.'],
      ['ワン', 'a', 'じゃ、バイトは{辞|や}めるんですか。', 'Ja, baito wa yameru n desu ka.', 'Vậy cậu nghỉ làm thêm à?'],
      ['ダニエル', 'b', 'ううん、{辞|や}めるつもりはないよ。{週|しゅう}{2日|ふつか}だけにするつもり。', 'Uun, yameru tsumori wa nai yo. Shuu futsuka dake ni suru tsumori.', 'Không, mình không có ý định nghỉ đâu. Mình định chỉ làm 2 ngày một tuần thôi.'],
    ]),
    { t: 'rule', formula: 'V辞書形／Vない ＋ つもりです', vi: 'Nói ý định đã quyết (định làm / định không làm); phủ nhận mạnh: V辞書形 つもりはありません.' },

    /* ══════ ⑤ 予定 ══════ */
    { t: 'h', text: '⑤ V辞書形／Nの ＋ 予定です — "theo lịch thì sẽ…" (cùng nhóm, cấp N4)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'V{辞書形|じしょけい}／Nの ＋ {予定|よてい}です',
          vi: '**{予定|よてい}** = lịch, kế hoạch **đã được định sẵn** — không chỉ do ý mình (có thể do công ty, trường, lịch tàu xe). Nghe khách quan, chắc chắn nhất trong ba cách; dùng được trong thông báo và với người trên.',
          examples: [
            E('{会議|かいぎ}は{3時|さんじ}から{始|はじ}まる{予定|よてい}です。', 'Kaigi wa sanji kara hajimaru yotei desu.', 'Cuộc họp dự kiến bắt đầu lúc 3 giờ.'),
            E('{飛行機|ひこうき}は{午後|ごご}{5時|ごじ}に{着|つ}く{予定|よてい}です。', 'Hikouki wa gogo goji ni tsuku yotei desu.', 'Máy bay dự kiến đến lúc 5 giờ chiều.'),
            E('{来週|らいしゅう}の{月曜日|げつようび}から{働|はたら}く{予定|よてい}です。', 'Raishuu no getsuyoubi kara hataraku yotei desu.', 'Tôi sẽ bắt đầu làm từ thứ Hai tuần sau (đã hẹn).'),
            E('{旅行|りょこう}は{3泊|さんぱく}{4日|よっか}の{予定|よてい}です。', 'Ryokou wa sanpaku yokka no yotei desu.', 'Chuyến du lịch dự kiến 4 ngày 3 đêm. (N の予定)'),
            E('{面接|めんせつ}は{明日|あした}の{予定|よてい}でしたが、{来週|らいしゅう}になりました。', 'Mensetsu wa ashita no yotei deshita ga, raishuu ni narimashita.', 'Buổi phỏng vấn dự kiến là ngày mai nhưng đã dời sang tuần sau.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Phân biệt ba cách nói dự định (đề N4 hay hỏi)',
      head: ['Mẫu', 'Độ chắc', 'Ý ai', 'Khi nào dùng', 'Ví dụ'],
      rows: [
        ['V(ý chí) と{思|おも}っています', '★☆☆ đang tính', 'của mình (hoặc người khác)', 'kể dự định còn có thể đổi; mềm, khiêm tốn', '{夏休|なつやす}みは{北海道|ほっかいどう}へ{行|い}こうと{思|おも}っています。'],
        ['V{辞書形|じしょけい} つもりです', '★★☆ đã quyết', 'của mình', 'ý định chắc trong lòng, có quyết tâm', '{卒業|そつぎょう}したら、{日本|にほん}で{働|はたら}くつもりです。'],
        ['V{辞書形|じしょけい}／Nの {予定|よてい}です', '★★★ đã lên lịch', 'kế hoạch chung / đã sắp xếp', 'vé đã mua, ngày đã định, lịch công ty', '{8月|はちがつ}{3日|みっか}に{帰国|きこく}する{予定|よてい}です。'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo chọn đúng trong đề',
      items: [
        'Câu có **mốc giờ cụ thể / lịch tàu xe / sự kiện của tổ chức** ({会議|かいぎ}, {飛行機|ひこうき}, {授業|じゅぎょう}…) → **{予定|よてい}**. Vật không có "ý định" nên không dùng ~~{飛行機|ひこうき}は{着|つ}くつもりです~~.',
        'Câu có **quyết tâm** ({絶対|ぜったい}, {必|かなら}ず, もう{二度|にど}と…ない) → **つもり** hoặc **（よ）うと{思|おも}います**.',
        'Câu kể **ý định của người khác** → **～つもりです** hoặc **～（よ）うと{思|おも}っています** (không phải ~~と{思|おも}います~~).',
        'Hỏi thầy cô / cấp trên → **～{予定|よてい}ですか**, tránh ～つもりですか.',
      ],
    },

    /* ══════ TỔNG KẾT ══════ */
    { t: 'h', text: 'Luyện tổng hợp — ghép câu, điền, trắc nghiệm kiểu đề N4' },
    {
      t: 'build',
      id: 'b16-np-ghep',
      title: 'Ghép câu — bấm mảnh theo đúng thứ tự (12 câu)',
      items: [
        { vi: 'Tôi nói được một chút tiếng Nhật.', chips: ['{私|わたし}は', '{日本語|にほんご}が', '{少|すこ}し', '{話|はな}せます', '{日本語|にほんご}を', '{話|はな}します'], answer: ['{私|わたし}は', '{日本語|にほんご}が', '{少|すこ}し', '{話|はな}せます'], ro: 'Watashi wa nihongo ga sukoshi hanasemasu.' },
        { vi: 'Thứ Bảy tôi không đến được.', chips: ['{土曜日|どようび}は', '{来|こ}られません', '{来|き}られません', 'に'], answer: ['{土曜日|どようび}は', '{来|こ}られません'], ro: 'Doyoubi wa koraremasen.' },
        { vi: 'Ở cửa hàng này dùng được thẻ.', chips: ['この{店|みせ}では', 'カードが', '{使|つか}えます', '{使|つか}います', 'カードに'], answer: ['この{店|みせ}では', 'カードが', '{使|つか}えます'], ro: 'Kono mise de wa kaado ga tsukaemasu.' },
        { vi: 'Đang tuyển người làm được thứ Bảy, Chủ nhật.', chips: ['{土日|どにち}に', '{働|はたら}ける', '{方|かた}を', '{募集|ぼしゅう}しています', '{働|はたら}けます'], answer: ['{土日|どにち}に', '{働|はたら}ける', '{方|かた}を', '{募集|ぼしゅう}しています'], ro: 'Donichi ni hatarakeru kata o boshuu shite imasu.' },
        { vi: 'Muộn rồi, về thôi. (thân mật)', chips: ['もう', '{遅|おそ}いから', '{帰|かえ}ろう', '{帰|かえ}りよう'], answer: ['もう', '{遅|おそ}いから', '{帰|かえ}ろう'], ro: 'Mou osoi kara, kaerou.' },
        { vi: 'Để mình xách đồ cho nhé? (thân mật)', chips: ['{荷物|にもつ}', '{持|も}とうか', '{持|も}ちようか', 'を'], answer: ['{荷物|にもつ}', '{持|も}とうか'], ro: 'Nimotsu, motou ka.' },
        { vi: 'Nghỉ hè tôi đang tính về nước.', chips: ['{夏休|なつやす}みは', '{国|くに}へ', '{帰|かえ}ろうと', '{思|おも}っています', '{帰|かえ}ると'], answer: ['{夏休|なつやす}みは', '{国|くに}へ', '{帰|かえ}ろうと', '{思|おも}っています'], ro: 'Natsuyasumi wa kuni e kaerou to omotte imasu.' },
        { vi: 'Hôm nay mệt nên tôi định ngủ sớm.', chips: ['{今日|きょう}は', '{疲|つか}れたから', '{早|はや}く', '{寝|ね}ようと', '{思|おも}います', '{寝|ね}ろうと'], answer: ['{今日|きょう}は', '{疲|つか}れたから', '{早|はや}く', '{寝|ね}ようと', '{思|おも}います'], ro: 'Kyou wa tsukareta kara, hayaku neyou to omoimasu.' },
        { vi: 'Tốt nghiệp xong tôi định đi làm ở Nhật.', chips: ['{卒業|そつぎょう}したら', '{日本|にほん}で', '{働|はたら}く', 'つもりです', '{働|はたら}こう'], answer: ['{卒業|そつぎょう}したら', '{日本|にほん}で', '{働|はたら}く', 'つもりです'], ro: 'Sotsugyou shitara, Nihon de hataraku tsumori desu.' },
        { vi: 'Năm nay tôi định không về nước.', chips: ['{今年|ことし}は', '{国|くに}へ', '{帰|かえ}らない', 'つもりです', '{帰|かえ}る', 'じゃありません'], answer: ['{今年|ことし}は', '{国|くに}へ', '{帰|かえ}らない', 'つもりです'], ro: 'Kotoshi wa kuni e kaeranai tsumori desu.' },
        { vi: 'Tôi không hề có ý định nghỉ làm thêm.', chips: ['バイトを', '{辞|や}める', 'つもりは', 'ありません', '{辞|や}めない', 'つもりが'], answer: ['バイトを', '{辞|や}める', 'つもりは', 'ありません'], ro: 'Baito o yameru tsumori wa arimasen.' },
        { vi: 'Máy bay dự kiến đến lúc 5 giờ chiều.', chips: ['{飛行機|ひこうき}は', '{午後|ごご}{5時|ごじ}に', '{着|つ}く', '{予定|よてい}です', 'つもりです'], answer: ['{飛行機|ひこうき}は', '{午後|ごご}{5時|ごじ}に', '{着|つ}く', '{予定|よてい}です'], ro: 'Hikouki wa gogo goji ni tsuku yotei desu.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b16-np-chia',
      title: 'Chia động từ — gõ thể được yêu cầu (12 câu)',
      kind: 'fill',
      grammar: 'Khả năng: nhóm 1 う→える, nhóm 2 る→られる, する→できる, 来る→来られる · Ý chí: nhóm 1 う→おう, nhóm 2 る→よう, する→しよう, 来る→来よう',
      items: [
        { q: '{書|か}く → thể khả năng (thể thường)', answers: V('{書|か}ける'), hint: 'く → け + る' },
        { q: '{泳|およ}ぐ → thể khả năng ます', answers: V('{泳|およ}げます'), hint: 'ぐ → げ' },
        { q: '{食|た}べる → thể khả năng ます', answers: V('{食|た}べられます'), hint: 'nhóm 2: られ + ます' },
        { q: '{来|く}る → thể khả năng ます', answers: V('{来|こ}られます'), hint: 'こ + られます' },
        { q: '{運転|うんてん}する → thể khả năng ます', answers: V('{運転|うんてん}できます'), hint: 'する → できる' },
        { q: '{話|はな}す → thể khả năng, phủ định thể thường', answers: V('{話|はな}せない'), hint: '話せる → ない' },
        { q: '{行|い}く → thể ý chí', answers: V('{行|い}こう'), hint: 'く → こ + う' },
        { q: '{待|ま}つ → thể ý chí', answers: V('{待|ま}とう'), hint: 'つ → と + う' },
        { q: '{遊|あそ}ぶ → thể ý chí', answers: V('{遊|あそ}ぼう'), hint: 'ぶ → ぼ + う' },
        { q: '{起|お}きる → thể ý chí', answers: V('{起|お}きよう'), hint: 'nhóm 2: よう' },
        { q: 'する → thể ý chí', answers: ['しよう'], hint: 'nhóm 3' },
        { q: '{来|く}る → thể ý chí', answers: V('{来|こ}よう'), hint: 'こ + よう' },
      ],
    },
    {
      t: 'quiz',
      id: 'b16-np-dien',
      title: 'Điền vào chỗ trống — dùng đúng mẫu của bài (10 câu)',
      kind: 'fill',
      grammar: 'thể khả năng · V(ý chí)と思っています · V辞書形／Vない つもりです · V辞書形 予定です',
      items: [
        { q: '{私|わたし}は{漢字|かんじ}が{少|すこ}し（{読|よ}む → được）ます。', answers: V('{読|よ}め', '{読|よ}めます'), hint: 'む → め' },
        { q: '{明日|あした}は{用事|ようじ}があって、（{来|く}る → không được）ません。', answers: V('{来|こ}られ', '{来|こ}られません'), hint: 'こられ' },
        { q: 'この{部屋|へや}から{海|うみ}が（　）ます。(tự nhìn thấy)', answers: V('{見|み}え', '{見|み}えます'), hint: 'không phải 見られます' },
        { q: '{一緒|いっしょ}に{昼|ひる}ご{飯|はん}を（{食|た}べる → rủ thân mật）。', answers: V('{食|た}べよう'), hint: 'ý chí' },
        { q: '{夏休|なつやす}みは{国|くに}へ（{帰|かえ}る）と{思|おも}っています。', answers: V('{帰|かえ}ろう'), hint: 'ý chí + と思っています' },
        { q: '{来年|らいねん}、N3を（{受|う}ける → ý chí）と{思|おも}っています。', answers: V('{受|う}けよう'), hint: 'nhóm 2: ～よう' },
        { q: '{卒業|そつぎょう}したら、{日本|にほん}で（{働|はたら}く）つもりです。', answers: V('{働|はたら}く'), hint: 'thể từ điển + つもり' },
        { q: '{今年|ことし}は{旅行|りょこう}（する → định KHÔNG làm）つもりです。', answers: ['しない'], hint: 'Vない + つもり' },
        { q: '{会議|かいぎ}は{3時|さんじ}から{始|はじ}まる（　）です。(lịch của công ty, đã định)', answers: V('{予定|よてい}'), hint: 'lịch của công ty → 予定' },
        { q: 'バイトを{辞|や}める（　）はありません。(không hề có ý định)', answers: ['つもり'], hint: 'つもりはありません' },
      ],
    },
    {
      t: 'mcq',
      id: 'b16-np-jlpt',
      title: 'Trắc nghiệm dạng đề JLPT N4 — 文法形式の判断 (10 câu) + 文の組み立て ★ (4 câu)',
      items: [
        { q: '{私|わたし}は{子|こ}どものとき、{泳|およ}ぐ（　）。', options: ['ことができませんでした', 'ことがありませんでした', 'つもりでした', 'ようでした'], correct: 0, why: 'Không bơi được (năng lực, quá khứ) → **ことができませんでした** (= {泳|およ}げませんでした). 〔Watashi wa kodomo no toki, oyogu koto ga dekimasen deshita.〕' },
        { q: '{雨|あめ}が{降|ふ}っているから、タクシーで（　）。', options: ['{行|い}けよう', '{行|い}こう', '{行|い}きよう', '{行|い}くよう'], correct: 1, why: 'Rủ thân mật = thể ý chí **{行|い}こう**. 〔Ame ga futte iru kara, takushii de ikou.〕' },
        { q: 'A「{日曜日|にちようび}、うちに（　）？」B「うん、{行|い}く{行|い}く。」', options: ['{来|こ}よう', '{来|こ}ない', '{来|き}ない', '{来|く}ない'], correct: 1, why: 'Rủ thân mật bằng ない + lên giọng: **{来|こ}ない？** (đến không?). {来|く}る → {来|こ}ない. 〔Nichiyoubi, uchi ni konai? — Un, iku iku.〕' },
        { q: 'この{店|みせ}では{夜|よる}{12時|じゅうにじ}まで{食事|しょくじ}が（　）。', options: ['できます', 'します', 'されます', 'できられます'], correct: 0, why: 'Hoàn cảnh cho phép: {食事|しょくじ}が**できます**. ~~できられます~~ không tồn tại. 〔Kono mise de wa yoru juuniji made shokuji ga dekimasu.〕' },
        { q: '{来年|らいねん}、{大学院|だいがくいん}に{進学|しんがく}（　）と{思|おも}っています。', options: ['する', 'しよう', 'して', 'した'], correct: 1, why: 'Ý định: V(ý chí) + と{思|おも}っています → **しよう**. 〔Rainen, daigakuin ni shingaku shiyou to omotte imasu.〕' },
        { q: '{電車|でんしゃ}は{10時|じゅうじ}に{東京|とうきょう}に{着|つ}く（　）です。', options: ['つもり', '{予定|よてい}', 'たい', 'ながら'], correct: 1, why: 'Tàu không có ý định → lịch đã định: **{予定|よてい}**. 〔Densha wa juuji ni Toukyou ni tsuku yotei desu.〕' },
        { q: '{私|わたし}はタバコを（　）つもりです。{体|からだ}によくないですから。', options: ['{吸|す}わない', '{吸|す}おう', '{吸|す}える', '{吸|す}いたい'], correct: 0, why: 'Định không làm: **Vない + つもり** → {吸|す}わない. 〔Watashi wa tabako o suwanai tsumori desu.〕' },
        { q: 'マルコさんは{卒業|そつぎょう}したら、{国|くに}へ{帰|かえ}ろうと（　）。', options: ['{思|おも}います', '{思|おも}っています', '{思|おも}いましょう', '{思|おも}えます'], correct: 1, why: 'Ý định của **người khác** → と**{思|おも}っています**. 〔Maruko-san wa sotsugyou shitara, kuni e kaerou to omotte imasu.〕' },
        { q: '{隣|となり}の{部屋|へや}から{歌|うた}が（　）。', options: ['{聞|き}けます', '{聞|き}こえます', '{聞|き}かれます', '{聞|き}こえられます'], correct: 1, why: 'Âm thanh tự lọt vào tai → **{聞|き}こえます**. 〔Tonari no heya kara uta ga kikoemasu.〕' },
        { q: '{会社|かいしゃ}を{辞|や}める（　）はありません。{今|いま}の{仕事|しごと}が{好|す}きですから。', options: ['よう', 'つもり', 'ため', 'の'], correct: 1, why: 'Phủ nhận mạnh ý định: **つもりはありません**. 〔Kaisha o yameru tsumori wa arimasen.〕' },
        { q: '★ わたしは ＿＿ ＿＿ ★ ＿＿。（{日本語|にほんご}の／{新聞|しんぶん}が／まだ／{読|よ}めません）', options: ['まだ', '{新聞|しんぶん}が', '{読|よ}めません', '{日本語|にほんご}の'], correct: 0, why: 'Câu đúng: わたしは **{日本語|にほんご}の {新聞|しんぶん}が まだ {読|よ}めません**. Ô ★ (thứ 3) = **まだ**. 〔Watashi wa nihongo no shinbun ga mada yomemasen.〕' },
        { q: '★ {夏休|なつやす}みは ＿＿ ＿＿ ★ ＿＿ います。（{思|おも}って／と／{国|くに}へ／{帰|かえ}ろう）', options: ['{思|おも}って', 'と', '{国|くに}へ', '{帰|かえ}ろう'], correct: 1, why: 'Câu đúng: {夏休|なつやす}みは **{国|くに}へ {帰|かえ}ろう と {思|おも}って** います. Ô ★ (thứ 3) = **と**. 〔Natsuyasumi wa kuni e kaerou to omotte imasu.〕' },
        { q: '★ {来年|らいねん} ＿＿ ＿＿ ★ ＿＿ です。（つもり／{進学|しんがく}する／{日本|にほん}の／{大学院|だいがくいん}に）', options: ['つもり', '{進学|しんがく}する', '{日本|にほん}の', '{大学院|だいがくいん}に'], correct: 1, why: 'Câu đúng: {来年|らいねん} **{日本|にほん}の {大学院|だいがくいん}に {進学|しんがく}する つもり** です. Ô ★ (thứ 3) = **{進学|しんがく}する**. 〔Rainen Nihon no daigakuin ni shingaku suru tsumori desu.〕' },
        { q: '★ {明日|あした}は ＿＿ ＿＿ ★ ＿＿ か。（{来|こ}られます／ごろ／ここへ／{何時|なんじ}）', options: ['{来|こ}られます', 'ごろ', 'ここへ', '{何時|なんじ}'], correct: 2, why: 'Câu đúng: {明日|あした}は **{何時|なんじ} ごろ ここへ {来|こ}られます** か. Ô ★ (thứ 3) = **ここへ**. 〔Ashita wa nanji goro koko e koraremasu ka.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const HAN_TU: Lesson = {
  id: 'b16-han-tu',
  kind: 'kanji',
  title: 'Chữ Hán mới — 15 chữ: 代 意 考 答 問 質 正 工 堂 面 接 決 夢 将 守',
  goal: 'Đọc đúng (không cần furigana) và hiểu nghĩa 15 chữ Hán mới của Bài 16 trong các từ hay gặp ở chủ đề làm thêm, phỏng vấn, tương lai (面接・質問・答え・将来・夢・決める・守る…), chọn đúng chữ khi đề cho hiragana, và viết tay được các chữ ✍.',
  minutes: 45,
  blocks: [
    {
      t: 'p',
      text: 'Bài 1–15 bạn đã gặp khoảng **500 chữ Hán** (bảng chữ của lớp + bảng chữ trong từ vựng). Bài 16 thêm **15 chữ mới** — 8 chữ thuộc danh sách N4 (代 意 考 答 問 質 正 工 堂 — chữ N4 còn lại hầu hết đã có ở sách) và 7 chữ N3 rất hay gặp trong đời sống làm thêm (面 接 決 夢 将 守). Học **theo từ**: {面接|めんせつ} (mensetsu), {質問|しつもん} (shitsumon), {将来|しょうらい} (shourai). Phần đọc của đề N4 (漢字読み) và phần chọn chữ (表記) đều hỏi **cả từ**, không hỏi chữ rời.',
    },
    {
      t: 'table',
      caption: '15 chữ Hán mới của Bài 16',
      head: ['Chữ', 'Hán Việt', 'Âm On', 'Âm Kun', 'Nghĩa', 'Từ ví dụ', 'Mức'],
      rows: [
        ['代', 'ĐẠI', 'ダイ・タイ', 'か(わる)・か(える)', 'thay thế; đời; tiền phí', '{交代|こうたい} (đổi ca) · アルバイト{代|だい} (tiền làm thêm) · {時代|じだい} (thời đại) · {代|か}わりに (thay cho)', '✍'],
        ['意', 'Ý', 'イ', '—', 'ý, ý nghĩ', '{意味|いみ} (ý nghĩa) · {注意|ちゅうい} (chú ý) · {用意|ようい} (chuẩn bị) · {意見|いけん} (ý kiến)', '👁'],
        ['考', 'KHẢO', 'コウ', 'かんが(える)', 'suy nghĩ, khảo', '{考|かんが}える (suy nghĩ) · {考|かんが}え (ý tưởng) · {参考|さんこう} (tham khảo)', '✍'],
        ['答', 'ĐÁP', 'トウ', 'こた(える)・こた(え)', 'trả lời, đáp', '{答|こた}える (trả lời) · {答|こた}え (đáp án) · {回答|かいとう} (câu trả lời — văn viết)', '👁'],
        ['問', 'VẤN', 'モン', 'と(う)・と(い)', 'hỏi', '{質問|しつもん} (câu hỏi) · {問題|もんだい} (vấn đề, bài tập)', '✍'],
        ['質', 'CHẤT', 'シツ', '—', 'chất; hỏi', '{質問|しつもん} (câu hỏi) · {品質|ひんしつ} (chất lượng hàng)', '👁'],
        ['正', 'CHÍNH', 'セイ・ショウ', 'ただ(しい)', 'đúng, chính', '{正社員|せいしゃいん} (nhân viên chính thức) · {正|ただ}しい (đúng) · お{正月|しょうがつ} (Tết)', '✍'],
        ['工', 'CÔNG', 'コウ・ク', '—', 'thợ, công (làm ra đồ)', '{工場|こうじょう} (nhà máy) · {工事|こうじ} (công trình) · {大工|だいく} (thợ mộc)', '✍'],
        ['堂', 'ĐƯỜNG', 'ドウ', '—', 'nhà lớn, gian phòng', '{食堂|しょくどう} (nhà ăn, quán cơm) · {講堂|こうどう} (giảng đường)', '👁'],
        ['面', 'DIỆN', 'メン', 'おもて・つら', 'mặt, bề mặt', '{面接|めんせつ} (phỏng vấn) · {画面|がめん} (màn hình) · {面白|おもしろ}い (thú vị — đọc đặc biệt)', '👁'],
        ['接', 'TIẾP', 'セツ', 'つ(ぐ)', 'tiếp, nối, gặp', '{面接|めんせつ} (phỏng vấn) · {接客|せっきゃく} (tiếp khách) · {直接|ちょくせつ} (trực tiếp)', '👁'],
        ['決', 'QUYẾT', 'ケツ', 'き(める)・き(まる)', 'quyết định', '{決|き}める (quyết định) · {決|き}まる (được quyết) · {決心|けっしん} (quyết tâm)', '✍'],
        ['夢', 'MỘNG', 'ム', 'ゆめ', 'giấc mơ', '{夢|ゆめ} (giấc mơ, ước mơ) · {夢中|むちゅう} (say mê)', '👁'],
        ['将', 'TƯƠNG', 'ショウ', '—', 'sắp, sẽ; tướng', '{将来|しょうらい} (tương lai) · {将棋|しょうぎ} (cờ tướng Nhật)', '👁'],
        ['守', 'THỦ', 'シュ・ス', 'まも(る)・も(り)', 'giữ, bảo vệ', '{守|まも}る (giữ, tuân thủ) · {留守|るす} (vắng nhà) · お{守|まも}り (bùa hộ mệnh)', '✍'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ bằng hình (học kèm khi tập viết)',
      items: [
        '**代** = 亻(người) + 弋 (cọc đánh dấu): người cắm cọc **thay** chỗ người khác → {交代|こうたい} (đổi ca), {代|か}わりに.',
        '**意** = 音 (âm thanh) + 心 (tim): tiếng nói từ trong tim → **ý** nghĩ → {意味|いみ}.',
        '**考** — ông già (耂) chống gậy ngồi **suy nghĩ**. Nét dưới ngoặt như cây gậy.',
        '**答** = ⺮ (tre) + 合 (hợp): thanh tre ghép **khớp** với nhau như câu **trả lời** khớp câu hỏi.',
        '**問** = 門 (cổng) + 口 (miệng): đứng ở cổng mở miệng **hỏi** đường. **質問** = hai chữ đều liên quan "hỏi".',
        '**正** = 一 (vạch đích) + 止 (dừng): dừng đúng vạch là **chính xác** → {正|ただ}しい.',
        '**工** — hình cái thước thợ: trên, dưới và trục nối → **thợ, làm ra đồ** → {工場|こうじょう}.',
        '**堂** = mái nhà to (⺍冖) + 口 + 土 (nền đất): **gian nhà lớn** → {食堂|しょくどう} (nhà ăn).',
        '**面** — khuôn **mặt** nhìn thẳng: khung ngoài là mặt, ở giữa là mắt mũi. **面接** = "gặp mặt trực tiếp".',
        '**接** = 扌(tay) + 立 + 女: đưa tay ra **tiếp** đón → {接客|せっきゃく}.',
        '**決** = 氵(nước) + 夬 (khoét): nước phá đê, một khi đã chảy là **quyết**, không quay lại.',
        '**夢** — trên là cỏ (艹) và con mắt nằm ngang (罒), dưới là 夕 (đêm): đêm nhắm mắt thấy **giấc mơ**.',
        '**将** — 丬 + 夕 + 寸 (tay): người cầm quân, "**sắp sửa**" ra trận → {将来|しょうらい} = cái "sắp đến".',
        '**守** = 宀 (mái nhà) + 寸 (bàn tay): bàn tay dưới mái nhà **giữ** nhà → {守|まも}る, {留守|るす}.',
      ],
    },
    {
      t: 'table',
      caption: 'Đứng riêng hay đứng chung — kun khi đứng một mình / có đuôi kana, on trong từ ghép',
      head: ['Chữ', 'Đứng riêng (kun)', 'Trong từ ghép (on)', 'Bẫy'],
      rows: [
        ['代', '{代|か}わりに (kawari ni), {代|か}える', '{交代|こうたい} (タイ), {時代|じだい}・アルバイト{代|だい} (ダイ)', 'hai âm On: タイ chỉ trong vài từ như 交代; còn lại ダイ'],
        ['意', '—', '{意味|いみ}, {注意|ちゅうい}, {用意|ようい}', 'luôn イ'],
        ['考', '{考|かんが}える', '{参考|さんこう} (コウ)', 'đuôi える, đừng đọc ~~かんがる~~'],
        ['答', '{答|こた}える, {答|こた}え', '{回答|かいとう} (トウ)', '{答|こた}え viết không có る'],
        ['問', '{問|と}い (câu hỏi — văn viết)', '{質問|しつもん}, {問題|もんだい} (モン)', 'đừng nhầm với 間 (gian) và 門 (môn)'],
        ['質', '—', '{質問|しつもん} (シツ), {品質|ひんしつ}', '質 đọc しつ, đừng đọc ~~しち~~ trong 質問'],
        ['正', '{正|ただ}しい', '{正社員|せいしゃいん} (セイ), お{正月|しょうがつ} (ショウ)', 'お正月 đọc ショウ, không phải ~~せいがつ~~'],
        ['工', '—', '{工場|こうじょう} (コウ), {大工|だいく} (ク)', '工場 thường đọc こうじょう (cũng có こうば — xưởng nhỏ)'],
        ['堂', '—', '{食堂|しょくどう} (ドウ)', 'しょく**どう** — trường âm, không phải ~~しょくど~~'],
        ['面', '{面|おもて} (mặt ngoài — ít dùng)', '{面接|めんせつ}, {画面|がめん} (メン)', '{面白|おもしろ}い là cách đọc đặc biệt'],
        ['接', '—', '{面接|めんせつ}, {直接|ちょくせつ} (セツ), {接客|せっきゃく} (セッ — âm ngắt)', '接客 = せっきゃく có っ'],
        ['決', '{決|き}める, {決|き}まる', '{決心|けっしん} (ケッ — âm ngắt)', 'tha 決める ↔ tự 決まる'],
        ['夢', '{夢|ゆめ}', '{夢中|むちゅう} (ム)', 'đứng riêng gần như luôn ゆめ'],
        ['将', '—', '{将来|しょうらい} (ショウ)', 'しょう**らい**, đừng đọc ~~しょらい~~'],
        ['守', '{守|まも}る, お{守|まも}り', '{留守|るす} (ス)', '留守 đọc るす (không phải ~~りゅうしゅ~~)'],
      ],
    },
    {
      t: 'readkanji',
      id: 'b16-doc-kanji',
      title: 'Đọc KHÔNG furigana — 20 câu (chữ mới + chữ đã học)',
      note: 'Che phần đáp án, đọc to cả câu rồi bấm hiện cách đọc. Câu nào vấp ở chữ mới thì quay lại bảng trên.',
      items: [
        { text: '{面接|めんせつ}で{店長|てんちょう}の{質問|しつもん}に{答|こた}えました。', ro: 'Mensetsu de tenchou no shitsumon ni kotaemashita.', vi: 'Ở buổi phỏng vấn tôi đã trả lời câu hỏi của quản lý.' },
        { text: '{将来|しょうらい}の{夢|ゆめ}は{何|なん}ですか。', ro: 'Shourai no yume wa nan desu ka.', vi: 'Ước mơ tương lai của bạn là gì?' },
        { text: '{卒業|そつぎょう}したらどうするか、よく{考|かんが}えて{決|き}めます。', ro: 'Sotsugyou shitara dou suru ka, yoku kangaete kimemasu.', vi: 'Tốt nghiệp xong làm gì, tôi sẽ suy nghĩ kỹ rồi quyết định.' },
        { text: 'バイトの{時間|じかん}を{守|まも}ってください。', ro: 'Baito no jikan o mamotte kudasai.', vi: 'Hãy đúng giờ làm thêm.' },
        { text: '{兄|あに}は{来年|らいねん}{正社員|せいしゃいん}になるつもりです。', ro: 'Ani wa rainen seishain ni naru tsumori desu.', vi: 'Anh trai tôi định sang năm trở thành nhân viên chính thức.' },
        { text: '{夏休|なつやす}みは{工場|こうじょう}でアルバイトをしようと{思|おも}っています。', ro: 'Natsuyasumi wa koujou de arubaito o shiyou to omotte imasu.', vi: 'Nghỉ hè tôi đang tính làm thêm ở nhà máy.' },
        { text: '{大学|だいがく}の{食堂|しょくどう}は{安|やす}くておいしいです。', ro: 'Daigaku no shokudou wa yasukute oishii desu.', vi: 'Nhà ăn của trường đại học rẻ mà ngon.' },
        { text: 'この{言葉|ことば}の{意味|いみ}がわかりません。', ro: 'Kono kotoba no imi ga wakarimasen.', vi: 'Tôi không hiểu nghĩa của từ này.' },
        { text: '{先生|せんせい}、{質問|しつもん}してもいいですか。', ro: 'Sensei, shitsumon shite mo ii desu ka.', vi: 'Thưa cô, em hỏi được không ạ?' },
        { text: '{問題|もんだい}の{答|こた}えを{教|おし}えてください。', ro: 'Mondai no kotae o oshiete kudasai.', vi: 'Hãy cho tôi biết đáp án của bài tập.' },
        { text: '{正|ただ}しい{答|こた}えはどれですか。', ro: 'Tadashii kotae wa dore desu ka.', vi: 'Đáp án đúng là cái nào?' },
        { text: '{今日|きょう}は{私|わたし}が{鈴木|すずき}さんの{代|か}わりに{働|はたら}きます。', ro: 'Kyou wa watashi ga Suzuki-san no kawari ni hatarakimasu.', vi: 'Hôm nay tôi làm thay chị Suzuki.' },
        { text: '{6時|ろくじ}に{西川|にしかわ}さんと{交代|こうたい}します。', ro: 'Rokuji ni Nishikawa-san to koutai shimasu.', vi: '6 giờ tôi đổi ca với anh Nishikawa.' },
        { text: 'アルバイト{代|だい}でパソコンを{買|か}おうと{思|おも}っています。', ro: 'Arubaito-dai de pasokon o kaou to omotte imasu.', vi: 'Tôi đang tính dùng tiền làm thêm mua máy tính.' },
        { text: '{昨日|きのう}、{面白|おもしろ}い{夢|ゆめ}を{見|み}ました。', ro: 'Kinou, omoshiroi yume o mimashita.', vi: 'Hôm qua tôi mơ một giấc mơ thú vị.' },
        { text: '{母|はは}が{留守|るす}のとき、{私|わたし}が{料理|りょうり}を{作|つく}ります。', ro: 'Haha ga rusu no toki, watashi ga ryouri o tsukurimasu.', vi: 'Khi mẹ vắng nhà, tôi nấu ăn.' },
        { text: '{友達|ともだち}との{約束|やくそく}は{守|まも}りましょう。', ro: 'Tomodachi to no yakusoku wa mamorimashou.', vi: 'Hãy giữ lời hứa với bạn bè.' },
        { text: '{用意|ようい}ができたら、{出|で}かけよう。', ro: 'Youi ga dekitara, dekakeyou.', vi: 'Chuẩn bị xong thì đi thôi.' },
        { text: '{雨|あめ}で{道|みち}が{危|あぶ}ないです。{注意|ちゅうい}してください。', ro: 'Ame de michi ga abunai desu. Chuui shite kudasai.', vi: 'Mưa nên đường nguy hiểm. Hãy cẩn thận.' },
        { text: '{面接|めんせつ}の{日|ひ}は{店長|てんちょう}が{決|き}めます。', ro: 'Mensetsu no hi wa tenchou ga kimemasu.', vi: 'Ngày phỏng vấn do quản lý quyết định.' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b16-doc-doan',
      title: 'Đọc đoạn ngắn kiểu đề — 3 đoạn không furigana',
      note: 'Đọc to cả đoạn trong 40 giây như phần Reading của thi nói, rồi mới mở đáp án.',
      items: [
        { text: '{私|わたし}は{来週|らいしゅう}、ひまわり{食堂|しょくどう}の{面接|めんせつ}を{受|う}けます。{店長|てんちょう}の{質問|しつもん}にちゃんと{答|こた}えたいですから、{今|いま}{毎日|まいにち}{練習|れんしゅう}しています。', ro: 'Watashi wa raishuu, Himawari shokudou no mensetsu o ukemasu. Tenchou no shitsumon ni chanto kotaetai desu kara, ima mainichi renshuu shite imasu.', vi: 'Tuần sau tôi đi phỏng vấn ở quán Himawari. Vì muốn trả lời câu hỏi của quản lý cho đàng hoàng nên giờ ngày nào tôi cũng luyện tập.' },
        { text: '{私|わたし}の{夢|ゆめ}は{日本|にほん}の{会社|かいしゃ}で{働|はたら}くことです。{将来|しょうらい}のことはまだ{決|き}めていませんが、{毎日|まいにち}よく{考|かんが}えています。', ro: 'Watashi no yume wa Nihon no kaisha de hataraku koto desu. Shourai no koto wa mada kimete imasen ga, mainichi yoku kangaete imasu.', vi: 'Ước mơ của tôi là làm việc ở công ty Nhật. Chuyện tương lai tôi chưa quyết, nhưng ngày nào tôi cũng suy nghĩ nhiều.' },
        { text: 'この{工場|こうじょう}のルールは{三|みっ}つです。{時間|じかん}を{守|まも}ること、{分|わ}からないときは{質問|しつもん}すること、{休|やす}むときは{店長|てんちょう}に{電話|でんわ}することです。', ro: 'Kono koujou no ruuru wa mittsu desu. Jikan o mamoru koto, wakaranai toki wa shitsumon suru koto, yasumu toki wa tenchou ni denwa suru koto desu.', vi: 'Nhà máy này có ba quy định: đúng giờ, khi không hiểu thì hỏi, và khi nghỉ thì gọi điện cho quản lý.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b16-han-doc',
      title: '漢字読み — chọn cách đọc của từ in đậm (12 câu)',
      items: [
        { q: '{明日|あした}、**面接**を{受|う}けます。', options: ['めんせつ', 'めんせい', 'めんしょく', 'がんせつ'], correct: 0, why: '**{面接|めんせつ}** (mensetsu) — 面 メン + 接 セツ.' },
        { q: '{先生|せんせい}に**質問**しました。', options: ['しつもん', 'しちもん', 'じつもん', 'しつぶん'], correct: 0, why: '**{質問|しつもん}** (shitsumon) — 質 シツ + 問 モン.' },
        { q: '**将来**、{通訳|つうやく}になりたいです。', options: ['しょらい', 'しょうらい', 'じょうらい', 'しょうれい'], correct: 1, why: '**{将来|しょうらい}** (shourai) — trường âm しょう.' },
        { q: 'よく**考**えてください。', options: ['かんが', 'こた', 'おぼ', 'かぞ'], correct: 0, why: '**{考|かんが}える** (kangaeru) — suy nghĩ.' },
        { q: '**答**えを{書|か}いてください。', options: ['こた', 'かんが', 'と', 'あ'], correct: 0, why: '**{答|こた}え** (kotae) — đáp án.' },
        { q: '{大学|だいがく}の**食堂**で{昼|ひる}ご{飯|はん}を{食|た}べます。', options: ['しょくど', 'しょくどう', 'しょくとう', 'たべどう'], correct: 1, why: '**{食堂|しょくどう}** (shokudou) — 堂 ドウ có trường âm.' },
        { q: '{兄|あに}は**工場**で{働|はたら}いています。', options: ['こうば', 'こうじょう', 'くじょう', 'こうしょう'], correct: 1, why: '**{工場|こうじょう}** (koujou) — cách đọc chuẩn của đề. こうば cũng có nhưng ít gặp trong đề N4.' },
        { q: 'この{言葉|ことば}の**意味**は{何|なん}ですか。', options: ['いみ', 'いし', 'えみ', 'いみん'], correct: 0, why: '**{意味|いみ}** (imi) — ý nghĩa.' },
        { q: '**正**しい{答|こた}えを{選|えら}んでください。', options: ['ただ', 'まさ', 'せい', 'ほん'], correct: 0, why: '**{正|ただ}しい** (tadashii) — đúng. (選ぶ = chọn)' },
        { q: '{次|つぎ}の{人|ひと}と**交代**します。', options: ['こうだい', 'こうたい', 'こたい', 'かわたい'], correct: 1, why: '**{交代|こうたい}** (koutai) — 代 đọc タイ trong từ này (không phải だい).' },
        { q: '{母|はは}は{今|いま}**留守**です。', options: ['りゅうしゅ', 'るす', 'りゅうす', 'るしゅ'], correct: 1, why: '**{留守|るす}** (rusu) — vắng nhà. 守 đọc ス.' },
        { q: '{旅行|りょこう}の{日|ひ}を**決**めました。', options: ['き', 'け', 'さだ', 'ま'], correct: 0, why: '**{決|き}める** (kimeru) — quyết định.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b16-han-chon',
      title: '表記 — chọn chữ Hán đúng cho từ viết bằng hiragana (8 câu)',
      items: [
        { q: '**めんせつ**の{日|ひ}は{金曜日|きんようび}です。', options: ['面接', '面節', '綿接', '面説'], correct: 0, why: '**面接** — 面 (mặt) + 接 (tiếp): gặp mặt.' },
        { q: '**しつもん**がありますか。', options: ['質門', '質問', '室問', '質聞'], correct: 1, why: '**質問** — 問 có 口 (miệng) trong 門; 門 trơn là cái cổng, 聞 là nghe.' },
        { q: '**しょうらい**の**ゆめ**は{何|なん}ですか。(chọn chữ của しょうらい)', options: ['将来', '招来', '将未', '状来'], correct: 0, why: '**将来** = tương lai. 来 (lai — đến).' },
        { q: '{毎日|まいにち}{漢字|かんじ}の**もんだい**をします。', options: ['問代', '問題', '門題', '間題'], correct: 1, why: '**問題** — 問 (hỏi) + 題 (đề).' },
        { q: '{約束|やくそく}を**まもり**ます。', options: ['待り', '守り', '持り', '付り'], correct: 1, why: '**守ります** — 宀 + 寸. 待 (đợi) và 持 (cầm) trông gần giống phần phải nhưng bộ khác.' },
        { q: 'ゆっくり**かんがえ**てください。', options: ['考え', '孝え', '老え', '者え'], correct: 0, why: '**考える** — nét cuối ngoặt (ㄎ). 孝 (hiếu) có 子, 老 (lão) có 匕.' },
        { q: '**こたえ**はAです。', options: ['合え', '答え', '筈え', '笑え'], correct: 1, why: '**答え** — ⺮ + 合. 笑 (cười) cũng có ⺮ nhưng dưới là 夭.' },
        { q: '{大学|だいがく}の**しょくどう**は{安|やす}いです。', options: ['食堂', '食道', '食党', '飲堂'], correct: 0, why: '**食堂** = nhà ăn. 食道 (しょくどう) cũng có thật nhưng nghĩa là **thực quản** — bẫy đồng âm!' },
      ],
    },
    {
      t: 'write',
      id: 'b16-viet-kanji',
      title: 'Tập viết — 7 chữ ✍ và 6 từ',
      note: 'Viết 7 chữ ✍ trước (đúng thứ tự nét theo hoạt hình), rồi viết cả từ. 👁 chỉ cần đọc được — viết thêm nếu còn thời gian.',
      chars: ['代', '考', '問', '正', '工', '決', '守', '面接', '質問', '答え', '将来', '夢', '食堂'],
      goi: {
        '面接': 'めんせつ · phỏng vấn',
        '質問': 'しつもん · câu hỏi',
        '答え': 'こたえ · câu trả lời',
        '将来': 'しょうらい · tương lai',
        '夢': 'ゆめ · ước mơ',
        '食堂': 'しょくどう · nhà ăn',
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
  id: 'b16-nghe',
  kind: 'listening',
  title: 'Nghe hiểu N4 — 6 bài theo đủ 4 dạng đề: 課題理解 · ポイント理解 · 発話表現 · 即時応答',
  goal: 'Nghe gọi điện xin việc, nghe chị khoá trên giao việc, nghe bạn kể kế hoạch nghỉ hè và nghe quản lý xếp lịch để bắt đúng thông tin đề hỏi; chọn câu nói đúng tình huống và đáp nhanh câu hỏi dùng thể khả năng / thể ý chí / ～つもり — đúng 4 dạng của phần 聴解 đề N4.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Phần nghe (聴解) đề JLPT N4 — 4 dạng, 35 phút',
      head: ['Mondai', 'Dạng', 'Làm gì', 'Mẹo của bài này'],
      rows: [
        ['問題1', '課題理解 (hiểu nhiệm vụ)', 'Nghe hội thoại, chọn việc người đó sẽ làm **tiếp theo / trước tiên**.', 'Bắt từ **まず／{先|さき}に／その{前|まえ}に／それから**. Việc bị bác bỏ ("…はいいです", "大丈夫") là bẫy.'],
        ['問題2', 'ポイント理解 (hiểu điểm chính)', 'Câu hỏi nghe **trước**, rồi nghe hội thoại tìm đúng điểm đó (lý do, ngày, món…).', 'Người nói hay **đổi ý**: {最初|さいしょ}は～と{思|おも}っていたけど… → lấy ý **sau cùng**.'],
        ['問題3', '発話表現 (nói gì trong tình huống)', 'Nghe mô tả tình huống (đề thật có tranh), chọn câu nên nói.', 'Xét **người nghe là ai** (người trên → ～ましょうか; bạn → ～（よ）うか) và **mình muốn làm gì** (xin, mời, đề nghị giúp).'],
        ['問題4', '即時応答 (đáp ngay)', 'Nghe một câu ngắn, chọn câu đáp tự nhiên nhất.', 'Câu hỏi khả năng (～れる？) → đáp bằng khả năng; câu rủ (～ない？) → đáp ～（よ）う; câu hỏi dự định → ～つもり.'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nghe trong bài này',
      items: [
        'Thể khả năng nghe ra ở đuôi **～えます／～られます**: {話|はな}せます, {来|こ}られます, {働|はたら}けます. Phủ định **～えません／～られません** → thường là chỗ đề hỏi ("không đến được ngày nào").',
        'Thể ý chí nghe ra ở đuôi **～おう／～よう** (kéo dài): {行|い}こう, {帰|かえ}ろう, {休憩|きゅうけい}しよう.',
        '**～つもり** / **～と{思|おも}っていたけど** — câu có "けど／でも" theo sau thường là ý định đã **bị đổi**.',
        'Bấm nghe 2 lần: lần 1 không nhìn lời, chỉ trả lời câu hỏi; lần 2 bật lời thoại + romaji để soát từng câu.',
      ],
    },

    /* ── 1 ── */
    { t: 'h', text: 'Bài 1 — 問題1 課題理解: gọi điện xin làm thêm' },
    NG('b16-ng-1', '{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか', 'Dạng 課題理解 — nghe câu hỏi, nghe hội thoại, chọn việc làm TRƯỚC TIÊN.', [
      ['ナレーター', 'ja-nu', 'レストランの{店長|てんちょう}と{男|おとこ}の{人|ひと}が{電話|でんわ}で{話|はな}しています。{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Resutoran no tenchou to otoko no hito ga denwa de hanashite imasu. Otoko no hito wa kono ato mazu nani o shimasu ka.', 'Quản lý nhà hàng và một người đàn ông đang nói chuyện điện thoại. Sau đây việc đầu tiên người đàn ông làm là gì?'],
      ['ダニエル', 'ja-nam', 'もしもし、アルバイトの{募集|ぼしゅう}を{見|み}て、お{電話|でんわ}しました。ダニエルです。', 'Moshimoshi, arubaito no boshuu o mite, odenwa shimashita. Danieru desu.', 'A lô, tôi thấy tin tuyển người làm thêm nên gọi điện. Tôi là Daniel.'],
      ['{店長|てんちょう}', 'ja-nu', 'お{電話|でんわ}ありがとうございます。{日本語|にほんご}は{話|はな}せますか。', 'Odenwa arigatou gozaimasu. Nihongo wa hanasemasu ka.', 'Cảm ơn anh đã gọi. Anh nói được tiếng Nhật không?'],
      ['ダニエル', 'ja-nam', 'はい、{話|はな}せます。', 'Hai, hanasemasu.', 'Vâng, tôi nói được.'],
      ['{店長|てんちょう}', 'ja-nu', 'じゃ、{一度|いちど}{面接|めんせつ}をしましょう。{明日|あした}の{3時|さんじ}に{来|こ}られますか。', 'Ja, ichido mensetsu o shimashou. Ashita no sanji ni koraremasu ka.', 'Vậy mình phỏng vấn một buổi nhé. Ngày mai 3 giờ anh đến được không?'],
      ['ダニエル', 'ja-nam', 'すみません、{明日|あした}は{授業|じゅぎょう}がありますから、{3時|さんじ}はちょっと……。{5時|ごじ}からは{行|い}けます。', 'Sumimasen, ashita wa jugyou ga arimasu kara, sanji wa chotto……. Goji kara wa ikemasu.', 'Xin lỗi, mai tôi có giờ học nên 3 giờ thì hơi khó… Từ 5 giờ thì tôi đi được.'],
      ['{店長|てんちょう}', 'ja-nu', 'じゃ、{5時|ごじ}にお{願|ねが}いします。{履歴書|りれきしょ}を{持|も}ってきてください。{写真|しゃしん}も{貼|は}ってくださいね。', 'Ja, goji ni onegai shimasu. Rirekisho o motte kite kudasai. Shashin mo hatte kudasai ne.', 'Vậy 5 giờ nhé. Anh mang sơ yếu lý lịch đến. Nhớ dán cả ảnh nhé.'],
      ['ダニエル', 'ja-nam', 'はい。あのう、{履歴書|りれきしょ}はお{店|みせ}でもらえますか。', 'Hai. Anou, rirekisho wa omise de moraemasu ka.', 'Vâng. À, sơ yếu lý lịch tôi nhận ở cửa hàng được không ạ?'],
      ['{店長|てんちょう}', 'ja-nu', 'すみません、{店|みせ}にはないんです。コンビニで{買|か}えますよ。', 'Sumimasen, mise ni wa nai n desu. Konbini de kaemasu yo.', 'Xin lỗi, ở quán không có. Ở cửa hàng tiện lợi mua được đấy.'],
      ['ダニエル', 'ja-nam', 'わかりました。じゃ、これからすぐ{買|か}いに{行|い}きます。{写真|しゃしん}は{家|うち}にありますから。', 'Wakarimashita. Ja, kore kara sugu kai ni ikimasu. Shashin wa uchi ni arimasu kara.', 'Tôi hiểu rồi. Vậy giờ tôi đi mua ngay. Ảnh thì tôi có sẵn ở nhà.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Otoko no hito wa kono ato mazu nani o shimasu ka.', 'Sau đây việc đầu tiên người đàn ông làm là gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b16-ng-1-q',
      title: 'Bài 1 — chọn đáp án',
      items: [
        { q: '{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか。', options: ['{写真|しゃしん}を{撮|と}りに{行|い}く', '{履歴書|りれきしょ}を{買|か}いに{行|い}く', '{店|みせ}へ{面接|めんせつ}に{行|い}く', 'もう{一度|いちど}{店|みせ}に{電話|でんわ}する'], correct: 1, why: 'Câu cuối: **これからすぐ{買|か}いに{行|い}きます** — đi mua sơ yếu lý lịch. Ảnh đã có ở nhà (bẫy ①), phỏng vấn là 5 giờ ngày mai (bẫy ③). 〔Kore kara sugu kai ni ikimasu.〕' },
        { q: '{面接|めんせつ}は{何時|なんじ}からですか。', options: ['{明日|あした}の{3時|さんじ}', '{明日|あした}の{5時|ごじ}', '{今日|きょう}の{5時|ごじ}', '{今日|きょう}の{3時|さんじ}'], correct: 1, why: '3 giờ ngày mai ダニエル bận học → **{5時|ごじ}からは{行|い}けます** → {5時|ごじ}にお{願|ねが}いします. 〔Goji kara wa ikemasu.〕' },
      ],
    },

    /* ── 2 ── */
    { t: 'h', text: 'Bài 2 — 問題1 課題理解: chị khoá trên giao việc ở cửa hàng tiện lợi' },
    NG('b16-ng-2', '{女|おんな}の{人|ひと}はまず{何|なに}をしますか', 'Dạng 課題理解 — để ý "その前に" (trước đó) đổi thứ tự việc.', [
      ['ナレーター', 'ja-nu', 'コンビニで{男|おとこ}の{人|ひと}と{新|あたら}しいアルバイトの{女|おんな}の{人|ひと}が{話|はな}しています。{女|おんな}の{人|ひと}はまず{何|なに}をしますか。', 'Konbini de otoko no hito to atarashii arubaito no onna no hito ga hanashite imasu. Onna no hito wa mazu nani o shimasu ka.', 'Ở cửa hàng tiện lợi, một người đàn ông và cô nhân viên làm thêm mới đang nói chuyện. Việc đầu tiên cô ấy làm là gì?'],
      ['{西川|にしかわ}', 'ja-nam', 'ワンさん、レジはもう{打|う}てる？', 'Wan-san, reji wa mou uteru?', 'Wang, em tính tiền được chưa?'],
      ['ワン', 'ja-nu', 'はい、もう{一人|ひとり}で{打|う}てます。', 'Hai, mou hitori de utemasu.', 'Vâng, em tự làm một mình được rồi ạ.'],
      ['{西川|にしかわ}', 'ja-nam', 'すごいね。じゃ、{今日|きょう}はレジじゃなくて、お{弁当|べんとう}を{棚|たな}に{並|なら}べてください。', 'Sugoi ne. Ja, kyou wa reji ja nakute, obentou o tana ni narabete kudasai.', 'Giỏi đấy. Vậy hôm nay em không đứng quầy mà xếp cơm hộp lên kệ nhé.'],
      ['ワン', 'ja-nu', 'はい。{飲|の}み{物|もの}はどうしますか。', 'Hai. Nomimono wa dou shimasu ka.', 'Vâng. Còn đồ uống thì sao ạ?'],
      ['{西川|にしかわ}', 'ja-nam', '{飲|の}み{物|もの}は{僕|ぼく}がやるから、{大丈夫|だいじょうぶ}。あ、でも、その{前|まえ}に、{店|みせ}の{前|まえ}のごみを{片付|かたづ}けてください。', 'Nomimono wa boku ga yaru kara, daijoubu. A, demo, sono mae ni, mise no mae no gomi o katazukete kudasai.', 'Đồ uống anh làm, không sao. À, nhưng trước đó em dọn rác trước cửa hàng nhé.'],
      ['ワン', 'ja-nu', 'わかりました。{先|さき}にごみですね。', 'Wakarimashita. Saki ni gomi desu ne.', 'Em hiểu rồi. Rác trước ạ.'],
      ['{西川|にしかわ}', 'ja-nam', 'うん。それが{終|お}わったら、お{弁当|べんとう}。{全部|ぜんぶ}{終|お}わったら、{一緒|いっしょ}に{休憩|きゅうけい}しよう。', 'Un. Sore ga owattara, obentou. Zenbu owattara, issho ni kyuukei shiyou.', 'Ừ. Xong cái đó thì đến cơm hộp. Xong hết thì cùng nghỉ giải lao nhé.'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}はまず{何|なに}をしますか。', 'Onna no hito wa mazu nani o shimasu ka.', 'Việc đầu tiên người phụ nữ làm là gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b16-ng-2-q',
      title: 'Bài 2 — chọn đáp án',
      items: [
        { q: '{女|おんな}の{人|ひと}はまず{何|なに}をしますか。', options: ['レジを{打|う}つ', 'お{弁当|べんとう}を{並|なら}べる', '{飲|の}み{物|もの}を{並|なら}べる', '{店|みせ}の{前|まえ}のごみを{片付|かたづ}ける'], correct: 3, why: '**その{前|まえ}に**、ごみを{片付|かたづ}けてください → **{先|さき}にごみ**. Cơm hộp làm sau; đồ uống anh 西川 làm; hôm nay không đứng quầy. 〔Sono mae ni, mise no mae no gomi o katazukete kudasai.〕' },
        { q: 'ワンさんはレジが{打|う}てますか。', options: ['まだ{打|う}てません', '{一人|ひとり}で{打|う}てます', '{西川|にしかわ}さんと{一緒|いっしょ}なら{打|う}てます', '{打|う}ちたくないです'], correct: 1, why: '**もう{一人|ひとり}で{打|う}てます** — đã tự làm được. 〔Mou hitori de utemasu.〕' },
      ],
    },

    /* ── 3 ── */
    { t: 'h', text: 'Bài 3 — 問題2 ポイント理解: kế hoạch nghỉ hè (có đổi ý)' },
    NG('b16-ng-3', '{女|おんな}の{学生|がくせい}は{夏休|なつやす}みに{何|なに}をするつもりですか', 'Dạng ポイント理解 — câu hỏi nghe TRƯỚC; bẫy: ý định đã đổi (～と思っていたけど…).', [
      ['ナレーター', 'ja-nu', '{大学|だいがく}で{男|おとこ}の{学生|がくせい}と{女|おんな}の{学生|がくせい}が{話|はな}しています。{女|おんな}の{学生|がくせい}は{夏休|なつやす}みに{何|なに}をするつもりですか。', 'Daigaku de otoko no gakusei to onna no gakusei ga hanashite imasu. Onna no gakusei wa natsuyasumi ni nani o suru tsumori desu ka.', 'Ở trường, một nam sinh và một nữ sinh đang nói chuyện. Nữ sinh định làm gì vào kỳ nghỉ hè?'],
      ['カルロス', 'ja-nam', 'パクさん、{夏休|なつやす}み、どうするの？ {国|くに}へ{帰|かえ}る？', 'Paku-san, natsuyasumi, dou suru no? Kuni e kaeru?', 'Park, nghỉ hè cậu làm gì? Về nước à?'],
      ['パク', 'ja-nu', 'うーん、{最初|さいしょ}は{帰|かえ}ろうと{思|おも}っていたんだけど、{飛行機|ひこうき}のチケットがすごく{高|たか}くて……。', 'Uun, saisho wa kaerou to omotte ita n da kedo, hikouki no chiketto ga sugoku takakute…….', 'Ừm, lúc đầu mình tính về, nhưng vé máy bay đắt quá…'],
      ['カルロス', 'ja-nam', 'そうか。じゃ、{日本|にほん}で{旅行|りょこう}する？ {北海道|ほっかいどう}とか。', 'Sou ka. Ja, Nihon de ryokou suru? Hokkaidou toka.', 'Ra vậy. Thế đi du lịch trong Nhật à? Hokkaido chẳng hạn.'],
      ['パク', 'ja-nu', '{旅行|りょこう}もしたいけど、お{金|かね}がないから、{夏休|なつやす}みはずっとアルバイトをするつもり。{冬休|ふゆやす}みに{国|くに}へ{帰|かえ}りたいから、{今|いま}お{金|かね}を{貯|た}めるの。', 'Ryokou mo shitai kedo, okane ga nai kara, natsuyasumi wa zutto arubaito o suru tsumori. Fuyuyasumi ni kuni e kaeritai kara, ima okane o tameru no.', 'Du lịch mình cũng muốn, nhưng không có tiền nên nghỉ hè mình định làm thêm suốt. Vì kỳ nghỉ đông mình muốn về nước nên giờ để dành tiền.'],
      ['カルロス', 'ja-nam', '{毎日|まいにち}アルバイト？ {大変|たいへん}だね。{無理|むり}しないでね。', 'Mainichi arubaito? Taihen da ne. Muri shinaide ne.', 'Ngày nào cũng làm thêm à? Vất vả nhỉ. Đừng cố quá sức nhé.'],
      ['パク', 'ja-nu', 'ありがとう。{週|しゅう}{5日|いつか}だけだから、{大丈夫|だいじょうぶ}。', 'Arigatou. Shuu itsuka dake da kara, daijoubu.', 'Cảm ơn. Chỉ 5 ngày một tuần thôi nên không sao.'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{学生|がくせい}は{夏休|なつやす}みに{何|なに}をするつもりですか。', 'Onna no gakusei wa natsuyasumi ni nani o suru tsumori desu ka.', 'Nữ sinh định làm gì vào kỳ nghỉ hè?'],
    ]),
    {
      t: 'mcq',
      id: 'b16-ng-3-q',
      title: 'Bài 3 — chọn đáp án',
      items: [
        { q: '{女|おんな}の{学生|がくせい}は{夏休|なつやす}みに{何|なに}をするつもりですか。', options: ['{国|くに}へ{帰|かえ}る', '{北海道|ほっかいどう}へ{旅行|りょこう}する', 'アルバイトをする', '{毎日|まいにち}{休|やす}む'], correct: 2, why: '**{夏休|なつやす}みはずっとアルバイトをするつもり**. "{帰|かえ}ろうと{思|おも}っていたんだけど" = ý định CŨ đã bỏ (bẫy). Du lịch là gợi ý của bạn nam. 〔Natsuyasumi wa zutto arubaito o suru tsumori.〕' },
        { q: 'どうして{国|くに}へ{帰|かえ}りませんか。', options: ['アルバイトが{好|す}きだから', '{飛行機|ひこうき}のチケットが{高|たか}いから', '{家族|かぞく}が{日本|にほん}に{来|く}るから', '{授業|じゅぎょう}があるから'], correct: 1, why: '**{飛行機|ひこうき}のチケットがすごく{高|たか}くて** — vé đắt. 〔Hikouki no chiketto ga sugoku takakute.〕' },
      ],
    },

    /* ── 4 ── */
    { t: 'h', text: 'Bài 4 — 問題2 ポイント理解: quản lý hỏi lịch làm tháng sau' },
    NG('b16-ng-4', '{女|おんな}の{人|ひと}は{来月|らいげつ}、{何曜日|なんようび}に{働|はたら}けますか', 'Dạng ポイント理解 — ghi nhanh các thứ, gạch thứ bị huỷ ở cuối.', [
      ['ナレーター', 'ja-nu', '{店|みせ}で{店長|てんちょう}と{女|おんな}の{人|ひと}が{話|はな}しています。{女|おんな}の{人|ひと}は{来月|らいげつ}、{何曜日|なんようび}に{働|はたら}けますか。', 'Mise de tenchou to onna no hito ga hanashite imasu. Onna no hito wa raigetsu, nan\'youbi ni hatarakemasu ka.', 'Ở cửa hàng, quản lý và một người phụ nữ đang nói chuyện. Tháng sau người phụ nữ làm được những thứ mấy?'],
      ['{小林|こばやし}{店長|てんちょう}', 'ja-nam', 'メアリーさん、{来月|らいげつ}は{何曜日|なんようび}に{来|こ}られますか。', 'Mearii-san, raigetsu wa nan\'youbi ni koraremasu ka.', 'Mary, tháng sau em đến được thứ mấy?'],
      ['メアリー', 'ja-nu', '{月曜日|げつようび}と{水曜日|すいようび}と{金曜日|きんようび}に{来|こ}られます。', 'Getsuyoubi to suiyoubi to kin\'youbi ni koraremasu.', 'Em đến được thứ Hai, thứ Tư và thứ Sáu ạ.'],
      ['{小林|こばやし}{店長|てんちょう}', 'ja-nam', '{土曜日|どようび}はどうですか。{土曜日|どようび}はとても{忙|いそが}しいんです。', 'Doyoubi wa dou desu ka. Doyoubi wa totemo isogashii n desu.', 'Thứ Bảy thì sao? Thứ Bảy quán rất đông.'],
      ['メアリー', 'ja-nu', '{土曜日|どようび}の{午前|ごぜん}は{日本語|にほんご}の{授業|じゅぎょう}がありますから、{来|こ}られません。でも、{午後|ごご}は{来|こ}られます。', 'Doyoubi no gozen wa nihongo no jugyou ga arimasu kara, koraremasen. Demo, gogo wa koraremasu.', 'Sáng thứ Bảy em có lớp tiếng Nhật nên không đến được. Nhưng buổi chiều thì đến được ạ.'],
      ['{小林|こばやし}{店長|てんちょう}', 'ja-nam', 'じゃ、{土曜日|どようび}の{午後|ごご}もお{願|ねが}いします。', 'Ja, doyoubi no gogo mo onegai shimasu.', 'Vậy nhờ em cả chiều thứ Bảy nhé.'],
      ['メアリー', 'ja-nu', 'はい。あ、すみません。{来月|らいげつ}から{水曜日|すいようび}はゼミがありますから、{水曜日|すいようび}はだめです。', 'Hai. A, sumimasen. Raigetsu kara suiyoubi wa zemi ga arimasu kara, suiyoubi wa dame desu.', 'Vâng. À, xin lỗi anh. Từ tháng sau thứ Tư em có lớp chuyên đề nên thứ Tư không được ạ.'],
      ['{小林|こばやし}{店長|てんちょう}', 'ja-nam', 'わかりました。じゃ、{月曜日|げつようび}と{金曜日|きんようび}と{土曜日|どようび}の{午後|ごご}ですね。', 'Wakarimashita. Ja, getsuyoubi to kin\'youbi to doyoubi no gogo desu ne.', 'Được rồi. Vậy là thứ Hai, thứ Sáu và chiều thứ Bảy nhé.'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}は{来月|らいげつ}、{何曜日|なんようび}に{働|はたら}けますか。', 'Onna no hito wa raigetsu, nan\'youbi ni hatarakemasu ka.', 'Tháng sau người phụ nữ làm được những thứ mấy?'],
    ]),
    {
      t: 'mcq',
      id: 'b16-ng-4-q',
      title: 'Bài 4 — chọn đáp án',
      items: [
        { q: '{女|おんな}の{人|ひと}は{来月|らいげつ}、{何曜日|なんようび}に{働|はたら}けますか。', options: ['{月|げつ}・{水|すい}・{金|きん}', '{月|げつ}・{金|きん}・{土|ど}（{午後|ごご}）', '{月|げつ}・{水|すい}・{土|ど}（{午前|ごぜん}）', '{水|すい}・{金|きん}・{土|ど}（{午後|ごご}）'], correct: 1, why: 'Ban đầu Hai–Tư–Sáu; thêm **chiều** thứ Bảy (sáng có lớp); cuối cùng **bỏ thứ Tư** (có ゼミ). Câu chốt của quản lý: **{月曜日|げつようび}と{金曜日|きんようび}と{土曜日|どようび}の{午後|ごご}**. 〔Getsuyoubi to kin\'youbi to doyoubi no gogo desu ne.〕' },
      ],
    },

    /* ── 5 ── */
    { t: 'h', text: 'Bài 5 — 問題3 発話表現: nói gì trong tình huống (3 câu)' },
    {
      t: 'p',
      text: 'Đề thật có tranh và mũi tên chỉ người nói. Ở đây tình huống được đọc thành lời. Nghe tình huống + 3 câu nói, chọn câu đúng nhất.',
    },
    NG('b16-ng-5', '{何|なん}と{言|い}いますか（3{問|もん}）', 'Dạng 発話表現 — xác định người nghe (trên / ngang hàng) và việc muốn làm.', [
      ['ナレーター', 'ja-nu', '{1番|いちばん}。アルバイトの{面接|めんせつ}です。{週末|しゅうまつ}も{働|はたら}けると{言|い}いたいです。{何|なん}と{言|い}いますか。', 'Ichiban. Arubaito no mensetsu desu. Shuumatsu mo hatarakeru to iitai desu. Nan to iimasu ka.', 'Câu 1. Đang phỏng vấn làm thêm. Bạn muốn nói cuối tuần cũng làm được. Bạn nói gì?'],
      ['ナタポン', 'ja-nam', '1、{土日|どにち}も{働|はたら}けます。 2、{土日|どにち}も{働|はたら}きましょう。 3、{土日|どにち}も{働|はたら}こうか。', 'Ichi, donichi mo hatarakemasu. Ni, donichi mo hatarakimashou. San, donichi mo hatarakou ka.', '1. Thứ Bảy, Chủ nhật tôi cũng làm được. 2. Cùng làm cả thứ Bảy, Chủ nhật nào. 3. Làm cả cuối tuần nhé?'],
      ['ナレーター', 'ja-nu', '{2番|にばん}。{友達|ともだち}と{図書館|としょかん}で{勉強|べんきょう}しています。もう{夜|よる}{9時|くじ}です。{友達|ともだち}に{何|なん}と{言|い}いますか。', 'Niban. Tomodachi to toshokan de benkyou shite imasu. Mou yoru kuji desu. Tomodachi ni nan to iimasu ka.', 'Câu 2. Bạn đang học ở thư viện với bạn. Đã 9 giờ tối rồi. Bạn nói gì với bạn mình?'],
      ['アンナ', 'ja-nu', '1、もう{帰|かえ}れる？ 2、そろそろ{帰|かえ}ろうか。 3、{帰|かえ}るつもりはないよ。', 'Ichi, mou kaereru? Ni, sorosoro kaerou ka. San, kaeru tsumori wa nai yo.', '1. Về được chưa? 2. Sắp về chưa nhỉ? / Về thôi nhé? 3. Mình không có ý định về đâu.'],
      ['ナレーター', 'ja-nu', '{3番|さんばん}。{先輩|せんぱい}が{重|おも}い{荷物|にもつ}を{持|も}っています。{手伝|てつだ}いたいです。{何|なん}と{言|い}いますか。', 'Sanban. Senpai ga omoi nimotsu o motte imasu. Tetsudaitai desu. Nan to iimasu ka.', 'Câu 3. Đàn anh đang xách đồ nặng. Bạn muốn giúp. Bạn nói gì?'],
      ['ワン', 'ja-nu', '1、{持|も}ちましょうか。 2、{持|も}てますか。 3、{持|も}つつもりです。', 'Ichi, mochimashou ka. Ni, motemasu ka. San, motsu tsumori desu.', '1. Để em xách giúp nhé? 2. Anh xách được không? 3. Em định xách.'],
    ]),
    {
      t: 'mcq',
      id: 'b16-ng-5-q',
      title: 'Bài 5 — chọn câu nói đúng',
      items: [
        { q: '{1番|いちばん} — {面接|めんせつ}で「{週末|しゅうまつ}も{働|はたら}ける」と{言|い}いたい。', options: ['1', '2', '3'], correct: 0, why: 'Nói khả năng của mình → **{働|はたら}けます**. 2 là rủ người khác cùng làm; 3 là rủ thân mật. 〔Donichi mo hatarakemasu.〕' },
        { q: '{2番|にばん} — {夜|よる}{9時|くじ}、{友達|ともだち}に{帰|かえ}ることを{提案|ていあん}したい。', options: ['1', '2', '3'], correct: 1, why: 'Rủ bạn thân mật: **そろそろ{帰|かえ}ろうか** (= 帰りましょうか). 1 hỏi khả năng; 3 ngược ý. 〔Sorosoro kaerou ka.〕' },
        { q: '{3番|さんばん} — {先輩|せんぱい}の{荷物|にもつ}を{持|も}ってあげたい。', options: ['1', '2', '3'], correct: 0, why: 'Đề nghị giúp **người trên** → **{持|も}ちましょうか** (lịch sự). 持とうか chỉ dùng với bạn; 持てますか hỏi khả năng là thất lễ. 〔Mochimashou ka.〕' },
      ],
    },

    /* ── 6 ── */
    { t: 'h', text: 'Bài 6 — 問題4 即時応答: đáp ngay (5 câu)' },
    NG('b16-ng-6', '{正|ただ}しい{返事|へんじ}を{選|えら}んでください（5{問|もん}）', 'Dạng 即時応答 — không có câu hỏi in sẵn: nghe 1 câu, chọn 1 trong 3 câu đáp.', [
      ['ナレーター', 'ja-nu', '{1番|いちばん}。', 'Ichiban.', 'Câu 1.'],
      ['パク', 'ja-nu', '{漢字|かんじ}、{読|よ}める？', 'Kanji, yomeru?', 'Cậu đọc được chữ Hán không?'],
      ['マルコ', 'ja-nam', '1、うん、{少|すこ}し{読|よ}めるよ。 2、うん、{読|よ}もう。 3、うん、{読|よ}むつもりはない。', 'Ichi, un, sukoshi yomeru yo. Ni, un, yomou. San, un, yomu tsumori wa nai.', '1. Ừ, đọc được chút. 2. Ừ, đọc thôi. 3. Ừ, không có ý định đọc.'],
      ['ナレーター', 'ja-nu', '{2番|にばん}。', 'Niban.', 'Câu 2.'],
      ['ダニエル', 'ja-nam', '{夏休|なつやす}みは{国|くに}へ{帰|かえ}るつもりですか。', 'Natsuyasumi wa kuni e kaeru tsumori desu ka.', 'Nghỉ hè bạn định về nước à?'],
      ['アンナ', 'ja-nu', '1、はい、{帰|かえ}れます。 2、いいえ、{今年|ことし}は{帰|かえ}らないつもりです。 3、いいえ、{帰|かえ}りましょう。', 'Ichi, hai, kaeremasu. Ni, iie, kotoshi wa kaeranai tsumori desu. San, iie, kaerimashou.', '1. Vâng, về được. 2. Không, năm nay tôi định không về. 3. Không, về thôi.'],
      ['ナレーター', 'ja-nu', '{3番|さんばん}。', 'Sanban.', 'Câu 3.'],
      ['ワン', 'ja-nu', '{明日|あした}、{一緒|いっしょ}に{図書館|としょかん}で{勉強|べんきょう}しない？', 'Ashita, issho ni toshokan de benkyou shinai?', 'Mai cùng học ở thư viện không?'],
      ['カルロス', 'ja-nam', '1、うん、{勉強|べんきょう}しよう。 2、うん、{勉強|べんきょう}できない。 3、うん、{勉強|べんきょう}したよ。', 'Ichi, un, benkyou shiyou. Ni, un, benkyou dekinai. San, un, benkyou shita yo.', '1. Ừ, học thôi. 2. Ừ, không học được. 3. Ừ, học rồi.'],
      ['ナレーター', 'ja-nu', '{4番|よんばん}。', 'Yonban.', 'Câu 4.'],
      ['{小林|こばやし}{店長|てんちょう}', 'ja-nam', '{来週|らいしゅう}の{土曜日|どようび}、{来|こ}られる？', 'Raishuu no doyoubi, korareru?', 'Thứ Bảy tuần sau em đến được không?'],
      ['ナタポン', 'ja-nam', '1、すみません、{土曜日|どようび}はちょっと……。 2、はい、{来|こ}ようと{思|おも}います。 3、はい、{来|き}てもいいです。', 'Ichi, sumimasen, doyoubi wa chotto……. Ni, hai, koyou to omoimasu. San, hai, kite mo ii desu.', '1. Xin lỗi, thứ Bảy thì hơi… 2. Vâng, tôi định đến (sai góc nhìn). 3. Vâng, anh đến cũng được.'],
      ['ナレーター', 'ja-nu', '{5番|ごばん}。', 'Goban.', 'Câu 5.'],
      ['メアリー', 'ja-nu', '{卒業|そつぎょう}したら、どうするの？', 'Sotsugyou shitara, dou suru no?', 'Tốt nghiệp xong cậu làm gì?'],
      ['ダニエル', 'ja-nam', '1、{日本|にほん}の{会社|かいしゃ}に{就職|しゅうしょく}するつもり。 2、{卒業|そつぎょう}できるよ。 3、{卒業|そつぎょう}しようか。', 'Ichi, Nihon no kaisha ni shuushoku suru tsumori. Ni, sotsugyou dekiru yo. San, sotsugyou shiyou ka.', '1. Mình định vào làm công ty Nhật. 2. Tốt nghiệp được mà. 3. Tốt nghiệp nhé?'],
    ]),
    {
      t: 'mcq',
      id: 'b16-ng-6-q',
      title: 'Bài 6 — chọn câu đáp đúng',
      items: [
        { q: '{1番|いちばん} — 「{漢字|かんじ}、{読|よ}める？」', options: ['1', '2', '3'], correct: 0, why: 'Hỏi khả năng → đáp khả năng: **うん、{少|すこ}し{読|よ}めるよ**. 〔Un, sukoshi yomeru yo.〕' },
        { q: '{2番|にばん} — 「{夏休|なつやす}みは{国|くに}へ{帰|かえ}るつもりですか。」', options: ['1', '2', '3'], correct: 1, why: 'Hỏi dự định → đáp dự định: **いいえ、{今年|ことし}は{帰|かえ}らないつもりです**. 〔Iie, kotoshi wa kaeranai tsumori desu.〕' },
        { q: '{3番|さんばん} — 「{明日|あした}、{一緒|いっしょ}に{勉強|べんきょう}しない？」', options: ['1', '2', '3'], correct: 0, why: 'Lời rủ thân mật (～ない？) → nhận lời bằng thể ý chí: **うん、{勉強|べんきょう}しよう**. 〔Un, benkyou shiyou.〕' },
        { q: '{4番|よんばん} — 「{来週|らいしゅう}の{土曜日|どようび}、{来|こ}られる？」', options: ['1', '2', '3'], correct: 0, why: 'Từ chối khéo: **すみません、{土曜日|どようび}はちょっと……**. Câu 2 sai góc nhìn (mình đến chỗ quản lý thì nói 行く, và không dùng ý chí để trả lời khả năng); câu 3 là cho phép người khác. 〔Sumimasen, doyoubi wa chotto…….〕' },
        { q: '{5番|ごばん} — 「{卒業|そつぎょう}したら、どうするの？」', options: ['1', '2', '3'], correct: 0, why: 'Hỏi định làm gì → **{日本|にほん}の{会社|かいしゃ}に{就職|しゅうしょく}するつもり**. 〔Nihon no kaisha ni shuushoku suru tsumori.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 6. ĐỌC HIỂU ═══════════════════════════ */

const DOC: Lesson = {
  id: 'b16-doc',
  kind: 'reading',
  title: 'Đọc hiểu N4 — email của quản lý, bài viết "Việc làm thêm của tôi", tờ tuyển người (情報検索)',
  goal: 'Đọc hiểu email công việc ngắn (phải mang gì, mấy giờ đến), bài văn kể trải nghiệm làm thêm ~400 chữ (vì sao vất vả, bây giờ thế nào, định làm gì), và tra 3 tờ tuyển người để chọn việc hợp điều kiện — đúng 3 dạng 内容理解（短文・中文）・情報検索 của đề N4.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Phần đọc (読解) đề JLPT N4',
      head: ['Mondai', 'Dạng', 'Độ dài', 'Bài này luyện'],
      rows: [
        ['問題4', '内容理解（短文）', '~100–200 chữ: email, thông báo, ghi chú', 'Bài 1 — email của quản lý'],
        ['問題5', '内容理解（中文）', '~350–450 chữ: bài viết, nhật ký', 'Bài 2 — 「{私|わたし}のアルバイト」'],
        ['問題6', '情報検索', '~400 chữ: bảng, tờ quảng cáo, lịch', 'Bài 3 — 3 tờ tuyển người làm thêm'],
      ],
    },
    {
      t: 'note',
      title: 'Chiến thuật đọc',
      items: [
        '**Đọc câu hỏi trước**, gạch chân từ khoá (持っていく・どうして・何曜日), rồi mới đọc bài để tìm.',
        'Email/thông báo: thông tin quan trọng nằm sau **～てください**, **～までに** (hạn chót), **～ませんが** (điều KHÔNG có).',
        'Bài văn: câu trả lời "vì sao" thường nằm ở **～て／～くて** (nối nguyên nhân) hoặc **～から**; "định làm gì" nằm ở **～つもりです／～（よ）うと{思|おも}っています** gần cuối bài.',
        '情報検索: lập **bảng điều kiện** của người trong câu hỏi (ngày, giờ, tiền đi lại…) rồi **loại** từng tờ — đừng đọc hết từng chữ.',
      ],
    },

    /* ── Bài 1 ── */
    { t: 'h', text: 'Bài 1 — 内容理解（短文）: email của quản lý quán' },
    {
      t: 'passage',
      title: '{件名|けんめい}：{来週|らいしゅう}からのアルバイトについて',
      intro: 'Sau buổi phỏng vấn, ナタポン nhận được email này của {小林|こばやし}{店長|てんちょう}. Đọc rồi trả lời câu hỏi.',
      paras: [
        { text: 'ナタポンさん' },
        { text: 'ひまわり{食堂|しょくどう}の{小林|こばやし}です。{昨日|きのう}は{面接|めんせつ}、ありがとうございました。{来週|らいしゅう}の{火曜日|かようび}から、よろしくお{願|ねが}いします。' },
        { text: '{火曜日|かようび}は{午後|ごご}{4時|よじ}{50分|ごじゅっぷん}までに{店|みせ}に{来|き}てください。{仕事|しごと}は{5時|ごじ}から{10時|じゅうじ}までです。{最初|さいしょ}の{日|ひ}は、{店|みせ}のルールと{料理|りょうり}の{運|はこ}び{方|かた}を{教|おし}えます。' },
        { text: '{制服|せいふく}は{店|みせ}で{貸|か}しますから、{黒|くろ}いズボンと{黒|くろ}い{靴|くつ}だけ{持|も}ってきてください。それから、{給料|きゅうりょう}は{毎月|まいつき}{25日|にじゅうごにち}に{銀行|ぎんこう}に{入|はい}りますから、{銀行|ぎんこう}の{口座|こうざ}の{番号|ばんごう}がわかるものも{持|も}ってきてください。' },
        { text: '{交通費|こうつうひ}は{出|で}ませんが、{自転車|じてんしゃ}は{店|みせ}の{前|まえ}に{置|お}けます。わからないことがあったら、いつでも{連絡|れんらく}してください。' },
        { text: '{小林|こばやし}' },
      ],
    },
    {
      t: 'mcq',
      id: 'b16-doc-1',
      title: 'Bài 1 — câu hỏi',
      items: [
        { q: 'ナタポンさんは{火曜日|かようび}に{何|なに}を{持|も}っていきますか。', options: ['{制服|せいふく}と{黒|くろ}い{靴|くつ}', '{黒|くろ}いズボンと{黒|くろ}い{靴|くつ}と、{口座|こうざ}の{番号|ばんごう}がわかるもの', '{履歴書|りれきしょ}と{写真|しゃしん}', '{黒|くろ}いズボンと{自転車|じてんしゃ}の{鍵|かぎ}'], correct: 1, why: '{制服|せいふく}は{店|みせ}で{貸|か}します (quán cho mượn — không cần mang) → mang **{黒|くろ}いズボンと{黒|くろ}い{靴|くつ}だけ** + **{口座|こうざ}の{番号|ばんごう}がわかるもの**. 〔Kuroi zubon to kuroi kutsu dake motte kite kudasai.〕' },
        { q: 'メールの{内容|ないよう}と{合|あ}っているのはどれですか。', options: ['{5時|ごじ}に{店|みせ}に{着|つ}けばいい。', '{交通費|こうつうひ}がもらえる。', '{自転車|じてんしゃ}で{店|みせ}に{行|い}ってもいい。', '{最初|さいしょ}の{日|ひ}は{料理|りょうり}を{作|つく}る。'], correct: 2, why: '**{自転車|じてんしゃ}は{店|みせ}の{前|まえ}に{置|お}けます** (để được xe đạp) → đi xe đạp được. Phải đến **trước 4:50** (までに); {交通費|こうつうひ}は{出|で}ません; ngày đầu học **bưng món** chứ không nấu. 〔Jitensha wa mise no mae ni okemasu.〕' },
        { q: '「{4時|よじ}{50分|ごじゅっぷん}までに」の{意味|いみ}は？', options: ['4:50 hoặc trước đó (hạn chót)', 'từ 4:50 trở đi', 'khoảng 4:50', 'suốt đến 4:50'], correct: 0, why: '**までに** = hạn chót (trước hoặc đúng lúc đó). Khác **まで** = suốt tới (働きます 10時まで — làm liên tục đến 10 giờ).' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('{昨日|きのう}は{面接|めんせつ}、ありがとうございました。', 'Kinou wa mensetsu, arigatou gozaimashita.', 'Cảm ơn em về buổi phỏng vấn hôm qua.'),
        E('ひまわり{食堂|しょくどう}の{小林|こばやし}です。{来週|らいしゅう}の{火曜日|かようび}から、よろしくお{願|ねが}いします。', 'Himawari shokudou no Kobayashi desu. Raishuu no kayoubi kara, yoroshiku onegai shimasu.', 'Tôi là Kobayashi của quán Himawari. Từ thứ Ba tuần sau, mong em giúp đỡ.'),
        E('{火曜日|かようび}は{午後|ごご}{4時|よじ}{50分|ごじゅっぷん}までに{店|みせ}に{来|き}てください。', 'Kayoubi wa gogo yoji gojuppun made ni mise ni kite kudasai.', 'Thứ Ba em đến quán trước 4 giờ 50 chiều nhé.'),
        E('{仕事|しごと}は{5時|ごじ}から{10時|じゅうじ}までです。', 'Shigoto wa goji kara juuji made desu.', 'Ca làm từ 5 giờ đến 10 giờ.'),
        E('{最初|さいしょ}の{日|ひ}は、{店|みせ}のルールと{料理|りょうり}の{運|はこ}び{方|かた}を{教|おし}えます。', 'Saisho no hi wa, mise no ruuru to ryouri no hakobikata o oshiemasu.', 'Ngày đầu tôi sẽ dạy quy định của quán và cách bưng món. (V bỏ ます + {方|かた} = cách làm V)'),
        E('{制服|せいふく}は{店|みせ}で{貸|か}しますから、{黒|くろ}いズボンと{黒|くろ}い{靴|くつ}だけ{持|も}ってきてください。', 'Seifuku wa mise de kashimasu kara, kuroi zubon to kuroi kutsu dake motte kite kudasai.', 'Đồng phục quán cho mượn, nên em chỉ cần mang quần đen và giày đen.'),
        E('{銀行|ぎんこう}の{口座|こうざ}の{番号|ばんごう}がわかるものも{持|も}ってきてください。', 'Ginkou no kouza no bangou ga wakaru mono mo motte kite kudasai.', 'Mang theo cả giấy tờ ghi số tài khoản ngân hàng.'),
        E('{交通費|こうつうひ}は{出|で}ませんが、{自転車|じてんしゃ}は{店|みせ}の{前|まえ}に{置|お}けます。', 'Koutsuuhi wa demasen ga, jitensha wa mise no mae ni okemasu.', 'Không có tiền đi lại, nhưng xe đạp để được trước quán.'),
        E('{給料|きゅうりょう}は{毎月|まいつき}{25日|にじゅうごにち}に{銀行|ぎんこう}に{入|はい}ります。', 'Kyuuryou wa maitsuki nijuugo nichi ni ginkou ni hairimasu.', 'Lương được chuyển vào ngân hàng ngày 25 hằng tháng.'),
        E('わからないことがあったら、いつでも{連絡|れんらく}してください。', 'Wakaranai koto ga attara, itsu demo renraku shite kudasai.', 'Có gì chưa rõ thì cứ liên lạc bất cứ lúc nào.'),
      ],
    },

    /* ── Bài 2 ── */
    { t: 'h', text: 'Bài 2 — 内容理解（中文）: 「私のアルバイト」 (khoảng 400 chữ)' },
    {
      t: 'passage',
      title: '{私|わたし}のアルバイト　—　ナタポン',
      intro: 'Bài viết của ナタポン cho tờ báo tường của lớp tiếng Nhật.',
      paras: [
        { label: '①', text: '{私|わたし}は{先月|せんげつ}から、{大学|だいがく}の{近|ちか}くの「ひまわり{食堂|しょくどう}」でアルバイトをしています。{週|しゅう}{4日|よっか}、{夕方|ゆうがた}{5時|ごじ}から{夜|よる}{10時|じゅうじ}まで{働|はたら}いています。{仕事|しごと}は、{料理|りょうり}を{運|はこ}んだり、テーブルを{片付|かたづ}けたりすることです。' },
        { label: '②', text: '{最初|さいしょ}の{1週間|いっしゅうかん}は、とても{大変|たいへん}でした。メニューの{漢字|かんじ}が{読|よ}めなくて、お{客様|きゃくさま}の{注文|ちゅうもん}がなかなか{覚|おぼ}えられませんでした。{敬語|けいご}も{上手|じょうず}に{話|はな}せなくて、{本当|ほんとう}に{困|こま}りました。{一度|いちど}、アルバイトを{辞|や}めようと{思|おも}いました。' },
        { label: '③', text: 'でも、{休憩|きゅうけい}の{時間|じかん}に、{先輩|せんぱい}の{木村|きむら}さんと{一緒|いっしょ}にメニューを{読|よ}む{練習|れんしゅう}をしました。{今|いま}は、メニューの{漢字|かんじ}がほとんど{読|よ}めます。お{客様|きゃくさま}との{会話|かいわ}も、だんだん{楽|たの}しくなりました。アルバイトで、{教科書|きょうかしょ}では{勉強|べんきょう}できない{日本語|にほんご}をたくさん{覚|おぼ}えました。' },
        { label: '④', text: 'このアルバイトは、{大学|だいがく}を{卒業|そつぎょう}するまで{続|つづ}けるつもりです。お{金|かね}を{貯|た}めて、{来年|らいねん}の{春休|はるやす}みに、タイから{家族|かぞく}を{呼|よ}ぼうと{思|おも}っています。{日本|にほん}の{桜|さくら}を{家族|かぞく}と{一緒|いっしょ}に{見|み}たいです。{将来|しょうらい}は、{日本|にほん}とタイをつなぐ{仕事|しごと}がしたいです。だから、{敬語|けいご}も{漢字|かんじ}も、もっと{頑張|がんば}ろうと{思|おも}います。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b16-doc-2',
      title: 'Bài 2 — câu hỏi',
      items: [
        { q: '{最初|さいしょ}の{1週間|いっしゅうかん}、ナタポンさんはどうして{大変|たいへん}でしたか。', options: ['{仕事|しごと}の{時間|じかん}が{長|なが}かったから', 'メニューの{漢字|かんじ}が{読|よ}めなくて、{注文|ちゅうもん}が{覚|おぼ}えられなかったから', '{先輩|せんぱい}が{何|なに}も{教|おし}えなかったから', '{料理|りょうり}が{作|つく}れなかったから'], correct: 1, why: 'Đoạn ②: **メニューの{漢字|かんじ}が{読|よ}めなくて、…{注文|ちゅうもん}がなかなか{覚|おぼ}えられませんでした** (～なくて nối nguyên nhân). 〔Menyuu no kanji ga yomenakute, …〕' },
        { q: '「{一度|いちど}、アルバイトを{辞|や}めようと{思|おも}いました」とありますが、{今|いま}はどうですか。', options: ['もう{辞|や}めました', '{来月|らいげつ}{辞|や}めるつもりです', '{卒業|そつぎょう}するまで{続|つづ}けるつもりです', 'まだ{決|き}めていません'], correct: 2, why: 'Đoạn ④: **{大学|だいがく}を{卒業|そつぎょう}するまで{続|つづ}けるつもりです**. Ý định "nghỉ" chỉ là chuyện tuần đầu (đã qua). 〔Daigaku o sotsugyou suru made tsuzukeru tsumori desu.〕' },
        { q: '{今|いま}のナタポンさんについて、{正|ただ}しいのはどれですか。', options: ['メニューの{漢字|かんじ}がほとんど{読|よ}めます。', '{敬語|けいご}が{全然|ぜんぜん}{話|はな}せません。', '{毎日|まいにち}アルバイトをしています。', 'お{客様|きゃくさま}と{話|はな}すのが{嫌|きら}いになりました。'], correct: 0, why: 'Đoạn ③: **{今|いま}は、メニューの{漢字|かんじ}がほとんど{読|よ}めます**. Làm {週|しゅう}{4日|よっか} (không phải mỗi ngày); hội thoại với khách **vui dần lên**. 〔Ima wa, menyuu no kanji ga hotondo yomemasu.〕' },
        { q: 'ナタポンさんは{来年|らいねん}の{春休|はるやす}みに{何|なに}をしようと{思|おも}っていますか。', options: ['タイへ{帰|かえ}る', '{家族|かぞく}を{日本|にほん}に{呼|よ}ぶ', '{新|あたら}しいアルバイトを{始|はじ}める', '{日本|にほん}とタイの{会社|かいしゃ}に{就職|しゅうしょく}する'], correct: 1, why: 'Đoạn ④: **タイから{家族|かぞく}を{呼|よ}ぼうと{思|おも}っています** (định mời gia đình sang) — cùng ngắm hoa anh đào. Làm việc nối Nhật–Thái là ước mơ **tương lai**, không phải xuân năm sau. 〔Tai kara kazoku o yobou to omotte imasu.〕' },
      ],
    },
    {
      t: 'note',
      title: 'Từ và mẫu đáng chú ý trong bài 2',
      items: [
        '**～たり～たりすること** (ôn ポイント 99) — {運|はこ}んだり、{片付|かたづ}けたりすること: liệt kê công việc.',
        '**{読|よ}めなくて／{話|はな}せなくて** — thể khả năng phủ định + て (なくて) = "vì không … được nên…". Mẫu nối nguyên nhân rất hay trong bài kể trải nghiệm.',
        '**なかなか + phủ định** (ôn Bài 11) — mãi mà không: なかなか{覚|おぼ}えられませんでした.',
        '**だんだん** = dần dần; **{楽|たの}しくなりました** (ôn ポイント 95: イA → くなります).',
        '**{教科書|きょうかしょ}では{勉強|べんきょう}できない{日本語|にほんご}** — câu bổ nghĩa bằng thể khả năng phủ định: "thứ tiếng Nhật không học được trong sách".',
        '**{呼|よ}ぼうと{思|おも}っています** — thể ý chí của {呼|よ}ぶ (gọi, mời đến) = {呼|よ}ぼう.',
      ],
    },
    {
      t: 'examples',
      items: [
        E('{私|わたし}は{先月|せんげつ}から、{大学|だいがく}の{近|ちか}くの「ひまわり{食堂|しょくどう}」でアルバイトをしています。', 'Watashi wa sengetsu kara, daigaku no chikaku no "Himawari shokudou" de arubaito o shite imasu.', 'Từ tháng trước tôi làm thêm ở quán "Himawari" gần trường.'),
        E('{仕事|しごと}は、{料理|りょうり}を{運|はこ}んだり、テーブルを{片付|かたづ}けたりすることです。', 'Shigoto wa, ryouri o hakondari, teeburu o katazuketari suru koto desu.', 'Công việc là bưng món, dọn bàn, v.v.'),
        E('{週|しゅう}{4日|よっか}、{夕方|ゆうがた}{5時|ごじ}から{夜|よる}{10時|じゅうじ}まで{働|はたら}いています。', 'Shuu yokka, yuugata goji kara yoru juuji made hataraite imasu.', 'Tôi làm 4 ngày một tuần, từ 5 giờ chiều đến 10 giờ tối.'),
        E('{最初|さいしょ}の{1週間|いっしゅうかん}は、とても{大変|たいへん}でした。', 'Saisho no isshuukan wa, totemo taihen deshita.', 'Tuần đầu tiên rất vất vả.'),
        E('メニューの{漢字|かんじ}が{読|よ}めなくて、お{客様|きゃくさま}の{注文|ちゅうもん}がなかなか{覚|おぼ}えられませんでした。', 'Menyuu no kanji ga yomenakute, okyakusama no chuumon ga nakanaka oboeraremasen deshita.', 'Không đọc được chữ Hán trên thực đơn nên mãi tôi không nhớ được món khách gọi.'),
        E('{敬語|けいご}も{上手|じょうず}に{話|はな}せなくて、{本当|ほんとう}に{困|こま}りました。', 'Keigo mo jouzu ni hanasenakute, hontou ni komarimashita.', 'Kính ngữ cũng không nói giỏi được nên tôi thật sự bối rối.'),
        E('{一度|いちど}、アルバイトを{辞|や}めようと{思|おも}いました。', 'Ichido, arubaito o yameyou to omoimashita.', 'Đã có lần tôi định nghỉ làm thêm.'),
        E('でも、{休憩|きゅうけい}の{時間|じかん}に、{先輩|せんぱい}の{木村|きむら}さんと{一緒|いっしょ}にメニューを{読|よ}む{練習|れんしゅう}をしました。', 'Demo, kyuukei no jikan ni, senpai no Kimura-san to issho ni menyuu o yomu renshuu o shimashita.', 'Nhưng giờ nghỉ, tôi cùng chị Kimura (khoá trên) luyện đọc thực đơn.'),
        E('{今|いま}は、メニューの{漢字|かんじ}がほとんど{読|よ}めます。', 'Ima wa, menyuu no kanji ga hotondo yomemasu.', 'Bây giờ tôi đọc được hầu hết chữ Hán trên thực đơn.'),
        E('お{客様|きゃくさま}との{会話|かいわ}も、だんだん{楽|たの}しくなりました。', 'Okyakusama to no kaiwa mo, dandan tanoshiku narimashita.', 'Nói chuyện với khách cũng dần dần vui hơn.'),
        E('アルバイトで、{教科書|きょうかしょ}では{勉強|べんきょう}できない{日本語|にほんご}をたくさん{覚|おぼ}えました。', 'Arubaito de, kyoukasho de wa benkyou dekinai nihongo o takusan oboemashita.', 'Nhờ làm thêm, tôi học được nhiều tiếng Nhật không học được trong sách.'),
        E('このアルバイトは、{大学|だいがく}を{卒業|そつぎょう}するまで{続|つづ}けるつもりです。', 'Kono arubaito wa, daigaku o sotsugyou suru made tsuzukeru tsumori desu.', 'Tôi định làm công việc này đến khi tốt nghiệp đại học.'),
        E('お{金|かね}を{貯|た}めて、{来年|らいねん}の{春休|はるやす}みに、タイから{家族|かぞく}を{呼|よ}ぼうと{思|おも}っています。', 'Okane o tamete, rainen no haruyasumi ni, Tai kara kazoku o yobou to omotte imasu.', 'Tôi định để dành tiền rồi mời gia đình từ Thái sang vào kỳ nghỉ xuân năm sau.'),
        E('{日本|にほん}の{桜|さくら}を{家族|かぞく}と{一緒|いっしょ}に{見|み}たいです。', 'Nihon no sakura o kazoku to issho ni mitai desu.', 'Tôi muốn cùng gia đình ngắm hoa anh đào Nhật Bản.'),
        E('{将来|しょうらい}は、{日本|にほん}とタイをつなぐ{仕事|しごと}がしたいです。', 'Shourai wa, Nihon to Tai o tsunagu shigoto ga shitai desu.', 'Sau này tôi muốn làm công việc kết nối Nhật Bản và Thái Lan.'),
        E('だから、{敬語|けいご}も{漢字|かんじ}も、もっと{頑張|がんば}ろうと{思|おも}います。', 'Dakara, keigo mo kanji mo, motto ganbarou to omoimasu.', 'Vì vậy tôi quyết sẽ cố gắng hơn nữa cả kính ngữ lẫn chữ Hán.'),
      ],
    },

    /* ── Bài 3 ── */
    { t: 'h', text: 'Bài 3 — 情報検索: ba tờ tuyển người làm thêm' },
    {
      t: 'passage',
      title: 'アルバイト{募集|ぼしゅう}　—　{大学|だいがく}の{掲示板|けいじばん}',
      intro: 'Ba tờ tuyển người dán ở bảng tin của trường. Đọc rồi chọn việc hợp với điều kiện của từng bạn.',
      paras: [
        { label: 'A', text: 'コンビニ「スマイル」{駅前店|えきまえてん}　{仕事|しごと}：レジ、{商品|しょうひん}を{並|なら}べる　{時給|じきゅう}{1,050円|せんごじゅうえん}　{週|しゅう}{2日|ふつか}から、1{日|にち}{4時間|よじかん}から{働|はたら}けます。{時間|じかん}：{朝|あさ}{6時|ろくじ}～{夜|よる}{10時|じゅうじ}（{深夜|しんや}の{仕事|しごと}はありません）。{土日|どにち}に{働|はたら}ける{方|かた}、{大歓迎|だいかんげい}！　{交通費|こうつうひ}：あり。' },
        { label: 'B', text: 'ひまわり{食堂|しょくどう}　{仕事|しごと}：{料理|りょうり}を{運|はこ}ぶ、テーブルを{片付|かたづ}ける　{時給|じきゅう}{1,100円|せんひゃくえん}　{週|しゅう}{3日|みっか}{以上|いじょう}。{土曜日|どようび}か{日曜日|にちようび}に{必|かなら}ず{来|こ}られる{方|かた}。{時間|じかん}：{夕方|ゆうがた}{5時|ごじ}～{夜|よる}{10時|じゅうじ}。{交通費|こうつうひ}：なし。{仕事|しごと}の{日|ひ}は{晩|ばん}ご{飯|はん}が{無料|むりょう}で{食|た}べられます。' },
        { label: 'C', text: 'さくら{工場|こうじょう}　{仕事|しごと}：お{弁当|べんとう}を{作|つく}る　{時給|じきゅう}{1,250円|せんにひゃくごじゅうえん}　{平日|へいじつ}だけ、{週|しゅう}{4日|よっか}{以上|いじょう}。{時間|じかん}：{夜|よる}{10時|じゅうじ}～{朝|あさ}{6時|ろくじ}（{深夜|しんや}）。{交通費|こうつうひ}：あり。{日本語|にほんご}が{少|すこ}し{話|はな}せる{方|かた}でも{大丈夫|だいじょうぶ}です。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b16-doc-3',
      title: 'Bài 3 — câu hỏi',
      items: [
        { q: 'パクさん：「{平日|へいじつ}は{授業|じゅぎょう}があるから、{土日|どにち}だけ{働|はたら}きたいです。{夜|よる}は{遅|おそ}くまで{働|はたら}けません。{交通費|こうつうひ}が{出|で}るところがいいです。」パクさんに{合|あ}うのはどれですか。', options: ['A', 'B', 'C', 'どれもない'], correct: 0, why: 'Chỉ làm 2 ngày cuối tuần → A (**{週|しゅう}{2日|ふつか}から**, **{土日|どにち}{大歓迎|だいかんげい}**, không có ca đêm, **{交通費|こうつうひ}あり**). B cần {週|しゅう}{3日|みっか}{以上|いじょう} và không có tiền đi lại; C chỉ ngày thường, ca đêm.' },
        { q: 'カルロスさん：「{平日|へいじつ}に{週|しゅう}{4日|よっか}{働|はたら}きたいです。{夜|よる}は{大丈夫|だいじょうぶ}です。{時給|じきゅう}が{一番|いちばん}{高|たか}いところがいいです。」カルロスさんに{合|あ}うのはどれですか。', options: ['A', 'B', 'C', 'どれもない'], correct: 2, why: 'C: {平日|へいじつ}だけ・{週|しゅう}{4日|よっか}{以上|いじょう}・ca đêm・**{時給|じきゅう}{1,250円|せんにひゃくごじゅうえん}** (cao nhất).' },
        { q: '{働|はたら}く{日|ひ}に{食事|しょくじ}が{無料|むりょう}なのはどこですか。', options: ['A', 'B', 'C', 'ぜんぶ'], correct: 1, why: 'B: **{仕事|しごと}の{日|ひ}は{晩|ばん}ご{飯|はん}が{無料|むりょう}で{食|た}べられます** (thể khả năng của {食|た}べる).' },
        { q: 'Bの「{土曜日|どようび}か{日曜日|にちようび}に{必|かなら}ず{来|こ}られる{方|かた}」の{意味|いみ}は？', options: ['Người đến được cả thứ Bảy lẫn Chủ nhật', 'Người nhất định đến được thứ Bảy hoặc Chủ nhật (ít nhất một ngày)', 'Người không đến vào cuối tuần', 'Người muốn đến vào cuối tuần'], correct: 1, why: '**AかB** = A hoặc B; **{必|かなら}ず{来|こ}られる** = chắc chắn đến được. ⇒ ít nhất một ngày cuối tuần.' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('{週|しゅう}{2日|ふつか}から、1{日|にち}{4時間|よじかん}から{働|はたら}けます。', 'Shuu futsuka kara, ichinichi yojikan kara hatarakemasu.', 'Làm được từ 2 ngày/tuần, từ 4 tiếng/ngày.'),
        E('{深夜|しんや}の{仕事|しごと}はありません。', 'Shin\'ya no shigoto wa arimasen.', 'Không có ca đêm.'),
        E('{土日|どにち}に{働|はたら}ける{方|かた}、{大歓迎|だいかんげい}！', 'Donichi ni hatarakeru kata, daikangei!', 'Rất hoan nghênh người làm được thứ Bảy, Chủ nhật!'),
        E('{土曜日|どようび}か{日曜日|にちようび}に{必|かなら}ず{来|こ}られる{方|かた}。', 'Doyoubi ka nichiyoubi ni kanarazu korareru kata.', 'Người nhất định đến được thứ Bảy hoặc Chủ nhật.'),
        E('{仕事|しごと}の{日|ひ}は{晩|ばん}ご{飯|はん}が{無料|むりょう}で{食|た}べられます。', 'Shigoto no hi wa bangohan ga muryou de taberaremasu.', 'Ngày đi làm được ăn tối miễn phí.'),
        E('{日本語|にほんご}が{少|すこ}し{話|はな}せる{方|かた}でも{大丈夫|だいじょうぶ}です。', 'Nihongo ga sukoshi hanaseru kata demo daijoubu desu.', 'Người chỉ nói được chút tiếng Nhật cũng được.'),
      ],
    },
  ],
};

/* ═══════════════════════════ 7. NÓI ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b16-noi',
  kind: 'speaking',
  title: 'Luyện nói — phỏng vấn làm thêm, "bạn làm được gì?", kể dự định, đọc to',
  goal: 'Trả lời trọn câu, đúng trợ từ các câu hỏi về năng lực (～が できますか／～れますか), lịch làm (何曜日に来られますか), dự định (～（よ）うと思っていますか／～つもりですか) và ước mơ; tự giới thiệu 1 phút trong buổi phỏng vấn làm thêm; đọc to trôi chảy đoạn văn có thể khả năng và thể ý chí.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Thi nói kiểu JPD (khung của bộ môn) — chủ đề Bài 16 rơi vào đâu',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 16 xuất hiện ở đâu'],
      rows: [
        ['Reading', '40', 'Chuẩn bị 30 giây, đọc to đoạn ~100 chữ.', 'Đoạn kể việc làm thêm / dự định: {面接|めんせつ}, {履歴書|りれきしょ}, {将来|しょうらい}, {夢|ゆめ}, {働|はたら}けます, {帰|かえ}ろうと{思|おも}っています…'],
        ['Talking — có tranh', '3 × 15', 'Nhìn tranh (tờ tuyển người, lịch làm, bảng giờ) trả lời.', 'この{店|みせ}では{何曜日|なんようび}に{働|はたら}けますか · {時給|じきゅう}はいくらですか · {何|なに}ができる{人|ひと}を{募集|ぼしゅう}していますか'],
        ['Talking — không tranh', '1 × 10', 'Trả lời 1 câu về bản thân.', '{何|なに}ができますか · {夏休|なつやす}みは{何|なに}をしようと{思|おも}っていますか · {卒業|そつぎょう}したら{何|なに}をするつもりですか · {将来|しょうらい}の{夢|ゆめ}は{何|なん}ですか'],
        ['Presenting', '5', 'Chào khi vào/ra, thái độ.', '{失礼|しつれい}します／よろしくお{願|ねが}いします／ありがとうございました'],
      ],
    },
    {
      t: 'note',
      title: 'Luật trả lời cho câu hỏi Bài 16',
      items: [
        '**Câu hỏi khả năng → trả lời bằng khả năng**, kèm mức độ: 「{泳|およ}げますか」→ **はい、{泳|およ}げます。{500|ごひゃく}メートルぐらい{泳|およ}げます。** / **いいえ、{泳|およ}げません。でも、{習|なら}いたいです。**',
        '**Sai trợ từ bị trừ điểm**: {日本語|にほんご}**が**{話|はな}せます (không phải を), {自転車|じてんしゃ}**に**{乗|の}れます, {試験|しけん}**に**{合格|ごうかく}します, {会社|かいしゃ}**に**{就職|しゅうしょく}します.',
        '**Câu hỏi dự định** — trả lời đúng mẫu được hỏi: hỏi ～つもりですか → **～つもりです**; hỏi ～と{思|おも}っていますか → **～（よ）うと{思|おも}っています**; hỏi {予定|よてい}は → **～{予定|よてい}です**.',
        'Thêm **1 câu lý do** (～から) hoặc **1 câu chi tiết** sau câu trả lời chính → câu dài, đúng mẫu = điểm cao.',
        'Không nghe rõ: **もう{一度|いちど}お{願|ねが}いします** (tối đa 2 lần, không bị trừ).',
      ],
    },
    {
      t: 'phatam',
      id: 'b16-noi-phat-am',
      title: 'Đọc to & chấm phát âm — 14 câu hay dùng của Bài 16',
      note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Chú ý: thể khả năng {来|こ}られます (ko-ra-re-ma-su, 5 nhịp); thể ý chí kéo dài âm cuối 2 nhịp: い・こ・う, し・よ・う; {将来|しょうらい} しょ・う・ら・い (4 nhịp).',
      items: [
        { text: '{日本語|にほんご}が{少|すこ}し{話|はな}せます。', ipa: 'nihongo ga sukoshi hanasemasu', vi: 'Tôi nói được một chút tiếng Nhật.' },
        { text: '{漢字|かんじ}はまだあまり{読|よ}めません。', ipa: 'kanji wa mada amari yomemasen', vi: 'Chữ Hán tôi chưa đọc được nhiều.' },
        { text: '{土日|どにち}も{働|はたら}けます。', ipa: 'donichi mo hatarakemasu', vi: 'Thứ Bảy, Chủ nhật tôi cũng làm được.' },
        { text: '{火曜日|かようび}と{金曜日|きんようび}に{来|こ}られます。', ipa: 'kayoubi to kin\'youbi ni koraremasu', vi: 'Tôi đến được thứ Ba và thứ Sáu.' },
        { text: '{夜|よる}{10時|じゅうじ}まで{働|はたら}けます。', ipa: 'yoru juuji made hatarakemasu', vi: 'Tôi làm được đến 10 giờ tối.' },
        { text: 'ベトナム{料理|りょうり}が{作|つく}れます。', ipa: 'Betonamu ryouri ga tsukuremasu', vi: 'Tôi nấu được món Việt.' },
        { text: '{一生懸命|いっしょうけんめい}{頑張|がんば}ります。', ipa: 'isshoukenmei ganbarimasu', vi: 'Tôi sẽ cố gắng hết sức.' },
        { text: '{一緒|いっしょ}に{帰|かえ}ろう。', ipa: 'issho ni kaerou', vi: 'Cùng về nhé.' },
        { text: 'そろそろ{休憩|きゅうけい}しようか。', ipa: 'sorosoro kyuukei shiyou ka', vi: 'Nghỉ giải lao chút nhé?' },
        { text: '{夏休|なつやす}みは{国|くに}へ{帰|かえ}ろうと{思|おも}っています。', ipa: 'natsuyasumi wa kuni e kaerou to omotte imasu', vi: 'Nghỉ hè tôi đang tính về nước.' },
        { text: '{卒業|そつぎょう}したら、{日本|にほん}で{就職|しゅうしょく}するつもりです。', ipa: 'sotsugyou shitara Nihon de shuushoku suru tsumori desu', vi: 'Tốt nghiệp xong tôi định đi làm ở Nhật.' },
        { text: '{今年|ことし}は{国|くに}へ{帰|かえ}らないつもりです。', ipa: 'kotoshi wa kuni e kaeranai tsumori desu', vi: 'Năm nay tôi định không về nước.' },
        { text: '{来月|らいげつ}、{日本語能力試験|にほんごのうりょくしけん}を{受|う}ける{予定|よてい}です。', ipa: 'raigetsu nihongo nouryoku shiken o ukeru yotei desu', vi: 'Tháng sau tôi sẽ thi năng lực tiếng Nhật.' },
        { text: '{将来|しょうらい}の{夢|ゆめ}は{通訳|つうやく}になることです。', ipa: 'shourai no yume wa tsuuyaku ni naru koto desu', vi: 'Ước mơ tương lai của tôi là trở thành phiên dịch.' },
      ],
    },

    /* ── Không tranh ① ── */
    { t: 'h', text: 'Câu hỏi không tranh ① — Bạn làm được gì?' },
    DL('Hỏi – đáp: năng lực', [
      ['Giám thị', 'examiner', '{何|なに}ができますか。', 'Nani ga dekimasu ka.', 'Em làm được gì? (giỏi gì?)'],
      ['Bạn', 'candidate', 'ギターが{弾|ひ}けます。それから、{料理|りょうり}も{少|すこ}しできます。', 'Gitaa ga hikemasu. Sorekara, ryouri mo sukoshi dekimasu.', 'Em chơi được ghi-ta ạ. Ngoài ra em cũng nấu ăn được một chút.'],
      ['Giám thị', 'examiner', '{泳|およ}げますか。', 'Oyogemasu ka.', 'Em bơi được không?'],
      ['Bạn', 'candidate', 'いいえ、{泳|およ}げません。でも、{夏休|なつやす}みに{泳|およ}ぎを{習|なら}おうと{思|おも}っています。', 'Iie, oyogemasen. Demo, natsuyasumi ni oyogi o naraou to omotte imasu.', 'Không ạ, em không biết bơi. Nhưng nghỉ hè em đang tính đi học bơi. (習う → 習おう)'],
      ['Giám thị', 'examiner', '{日本語|にほんご}で{何|なに}ができますか。', 'Nihongo de nani ga dekimasu ka.', 'Bằng tiếng Nhật em làm được những gì?'],
      ['Bạn', 'candidate', '{日本語|にほんご}で{買|か}い{物|もの}ができます。{簡単|かんたん}なメールも{書|か}けます。でも、{電話|でんわ}はまだ{難|むずか}しいです。', 'Nihongo de kaimono ga dekimasu. Kantan na meeru mo kakemasu. Demo, denwa wa mada muzukashii desu.', 'Em mua sắm được bằng tiếng Nhật. Email đơn giản em cũng viết được. Nhưng gọi điện thì vẫn còn khó ạ.'],
      ['Giám thị', 'examiner', '{漢字|かんじ}はいくつぐらい{読|よ}めますか。', 'Kanji wa ikutsu gurai yomemasu ka.', 'Em đọc được khoảng bao nhiêu chữ Hán?'],
      ['Bạn', 'candidate', '{300|さんびゃく}ぐらい{読|よ}めます。でも、{書|か}ける{漢字|かんじ}は{少|すく}ないです。', 'Sanbyaku gurai yomemasu. Demo, kakeru kanji wa sukunai desu.', 'Khoảng 300 chữ ạ. Nhưng chữ viết được thì ít.'],
      ['Giám thị', 'examiner', '{朝|あさ}{何時|なんじ}に{起|お}きられますか。', 'Asa nanji ni okiraremasu ka.', 'Buổi sáng em dậy được lúc mấy giờ?'],
      ['Bạn', 'candidate', '{6時|ろくじ}に{起|お}きられます。{毎朝|まいあさ}ジョギングをしていますから。', 'Rokuji ni okiraremasu. Maiasa jogingu o shite imasu kara.', 'Em dậy được lúc 6 giờ. Vì sáng nào em cũng chạy bộ.'],
    ]),
    {
      t: 'note',
      title: 'Bẫy ở nhóm câu hỏi năng lực',
      items: [
        '"**{何|なに}ができますか**" → trả lời bằng **N ができます** hoặc **N が V(khả năng)ます**. Đừng trả lời ~~ギターをします~~ (chỉ là "chơi").',
        '"**{泳|およ}げますか**" → **はい、{泳|およ}げます** / **いいえ、{泳|およ}げません** — nhắc lại đúng động từ khả năng. ~~はい、{泳|およ}ぎます~~ là trả lời lệch câu hỏi.',
        'Khiêm tốn: thêm **{少|すこ}し**, **まだ**, **{簡単|かんたん}な～は** — người Nhật đánh giá cao câu trả lời khiêm tốn.',
      ],
    },

    /* ── Không tranh ② ── */
    { t: 'h', text: 'Câu hỏi không tranh ② — Dự định & ước mơ' },
    DL('Hỏi – đáp: dự định', [
      ['Giám thị', 'examiner', '{夏休|なつやす}みは{何|なに}をしようと{思|おも}っていますか。', 'Natsuyasumi wa nani o shiyou to omotte imasu ka.', 'Nghỉ hè em đang tính làm gì?'],
      ['Bạn', 'candidate', '{国|くに}へ{帰|かえ}って、{家族|かぞく}と{旅行|りょこう}しようと{思|おも}っています。', 'Kuni e kaette, kazoku to ryokou shiyou to omotte imasu.', 'Em đang tính về nước rồi đi du lịch với gia đình ạ.'],
      ['Giám thị', 'examiner', '{卒業|そつぎょう}したら、{何|なに}をするつもりですか。', 'Sotsugyou shitara, nani o suru tsumori desu ka.', 'Tốt nghiệp xong em định làm gì?'],
      ['Bạn', 'candidate', '{日本|にほん}の{IT|アイティー}{会社|がいしゃ}に{就職|しゅうしょく}するつもりです。{日本|にほん}で{経験|けいけん}をしたいですから。', 'Nihon no aitii-gaisha ni shuushoku suru tsumori desu. Nihon de keiken o shitai desu kara.', 'Em định vào làm ở một công ty IT của Nhật. Vì em muốn có kinh nghiệm ở Nhật.'],
      ['Giám thị', 'examiner', '{将来|しょうらい}の{夢|ゆめ}は{何|なん}ですか。', 'Shourai no yume wa nan desu ka.', 'Ước mơ tương lai của em là gì?'],
      ['Bạn', 'candidate', '{私|わたし}の{夢|ゆめ}は{自分|じぶん}の{会社|かいしゃ}を{作|つく}ることです。', 'Watashi no yume wa jibun no kaisha o tsukuru koto desu.', 'Ước mơ của em là lập công ty của riêng mình.'],
      ['Giám thị', 'examiner', '{週末|しゅうまつ}の{予定|よてい}は{何|なん}ですか。', 'Shuumatsu no yotei wa nan desu ka.', 'Cuối tuần em có lịch gì?'],
      ['Bạn', 'candidate', '{土曜日|どようび}はアルバイトをする{予定|よてい}です。{日曜日|にちようび}は{友達|ともだち}と{映画|えいが}を{見|み}に{行|い}こうと{思|おも}っています。', 'Doyoubi wa arubaito o suru yotei desu. Nichiyoubi wa tomodachi to eiga o mi ni ikou to omotte imasu.', 'Thứ Bảy em có ca làm thêm. Chủ nhật em tính đi xem phim với bạn.'],
      ['Giám thị', 'examiner', '{今年|ことし}、{国|くに}へ{帰|かえ}りますか。', 'Kotoshi, kuni e kaerimasu ka.', 'Năm nay em có về nước không?'],
      ['Bạn', 'candidate', 'いいえ、{今年|ことし}は{帰|かえ}らないつもりです。{日本語能力試験|にほんごのうりょくしけん}の{勉強|べんきょう}をしますから。', 'Iie, kotoshi wa kaeranai tsumori desu. Nihongo nouryoku shiken no benkyou o shimasu kara.', 'Không ạ, năm nay em định không về. Vì em ôn thi năng lực tiếng Nhật.'],
    ]),
    {
      t: 'note',
      title: 'Bẫy ở nhóm câu hỏi dự định',
      items: [
        '"**{何|なに}をするつもりですか**" mà trả lời ~~{就職|しゅうしょく}したいです~~ — đúng ý nhưng **lệch mẫu**; giám khảo muốn nghe **{就職|しゅうしょく}するつもりです**.',
        '"**{夢|ゆめ}は{何|なん}ですか**" → **{夢|ゆめ}は V{辞書形|じしょけい} ことです** hoặc **{夢|ゆめ}は N です** ({夢|ゆめ}は{医者|いしゃ}です). Đừng nói ~~{夢|ゆめ}は{医者|いしゃ}になりたいです~~ (vế đầu và vế sau không khớp).',
        '**{IT|アイティー}{会社|がいしゃ}** — 会社 đứng sau danh từ khác đọc **がいしゃ** (連濁): ゲーム{会社|がいしゃ}, {旅行|りょこう}{会社|がいしゃ}.',
      ],
    },

    /* ── Có tranh ── */
    { t: 'h', text: 'Câu hỏi có tranh — nhìn tờ tuyển người trả lời' },
    {
      t: 'table',
      caption: 'Tranh (giả lập): tờ tuyển người dán trước quán ăn',
      head: ['Mục', 'Nội dung trên tờ'],
      rows: [
        ['{店|みせ}の{名前|なまえ}', 'ラーメン「たいよう」'],
        ['{仕事|しごと}', '{料理|りょうり}を{運|はこ}ぶ・お{皿|さら}を{洗|あら}う'],
        ['{時給|じきゅう}', '{1,000円|せんえん}（{土日|どにち}は{1,100円|せんひゃくえん}）'],
        ['{曜日|ようび}・{時間|じかん}', '{火曜日|かようび}～{日曜日|にちようび}（{月曜日|げつようび}は{休|やす}み）、{11時|じゅういちじ}～{21時|にじゅういちじ}'],
        ['{条件|じょうけん}', '{日本語|にほんご}が{少|すこ}し{話|はな}せる{方|かた}・{週|しゅう}{3日|みっか}{以上|いじょう}'],
      ],
    },
    DL('Hỏi – đáp theo tranh', [
      ['Giám thị', 'examiner', 'この{店|みせ}では{何曜日|なんようび}に{働|はたら}けますか。', 'Kono mise de wa nan\'youbi ni hatarakemasu ka.', 'Ở quán này làm được những thứ mấy?'],
      ['Bạn', 'candidate', '{火曜日|かようび}から{日曜日|にちようび}まで{働|はたら}けます。{月曜日|げつようび}は{休|やす}みです。', 'Kayoubi kara nichiyoubi made hatarakemasu. Getsuyoubi wa yasumi desu.', 'Làm được từ thứ Ba đến Chủ nhật. Thứ Hai nghỉ.'],
      ['Giám thị', 'examiner', '{土曜日|どようび}の{時給|じきゅう}はいくらですか。', 'Doyoubi no jikyuu wa ikura desu ka.', 'Lương giờ thứ Bảy là bao nhiêu?'],
      ['Bạn', 'candidate', '{1,100円|せんひゃくえん}です。{土日|どにち}は{100円|ひゃくえん}{高|たか}いです。', 'Sen hyaku en desu. Donichi wa hyaku en takai desu.', '1.100 yên ạ. Thứ Bảy, Chủ nhật cao hơn 100 yên.'],
      ['Giám thị', 'examiner', 'どんな{人|ひと}を{募集|ぼしゅう}していますか。', 'Donna hito o boshuu shite imasu ka.', 'Quán đang tuyển người như thế nào?'],
      ['Bạn', 'candidate', '{日本語|にほんご}が{少|すこ}し{話|はな}せる{人|ひと}を{募集|ぼしゅう}しています。{週|しゅう}{3日|みっか}{以上|いじょう}{働|はたら}ける{人|ひと}です。', 'Nihongo ga sukoshi hanaseru hito o boshuu shite imasu. Shuu mikka ijou hatarakeru hito desu.', 'Quán đang tuyển người nói được chút tiếng Nhật, làm được từ 3 ngày/tuần trở lên.'],
      ['Giám thị', 'examiner', 'あなたはこの{店|みせ}で{働|はたら}きたいですか。', 'Anata wa kono mise de hatarakitai desu ka.', 'Em có muốn làm ở quán này không?'],
      ['Bạn', 'candidate', 'はい、{働|はたら}きたいです。{土日|どにち}に{働|はたら}けますから。それに、ラーメンが{大好|だいす}きです。', 'Hai, hatarakitai desu. Donichi ni hatarakemasu kara. Sore ni, raamen ga daisuki desu.', 'Có ạ. Vì em làm được cuối tuần. Hơn nữa em rất thích mì ramen.'],
    ]),

    /* ── Phỏng vấn ── */
    { t: 'h', text: 'できる！ — Tự giới thiệu 1 phút trong buổi phỏng vấn làm thêm' },
    {
      t: 'table',
      caption: 'Khung 5 câu — thay phần in đậm bằng thông tin của bạn',
      head: ['Bước', 'Câu mẫu', 'Romaji'],
      rows: [
        ['① Chào + tên', '{失礼|しつれい}します。**ベトナム**から{来|き}た**グエン・ラン**です。よろしくお{願|ねが}いします。', 'Shitsurei shimasu. Betonamu kara kita Guen Ran desu. Yoroshiku onegai shimasu.'],
        ['② Làm được gì', '{日本語|にほんご}は**{1年|いちねん}**{勉強|べんきょう}しました。**{簡単|かんたん}な{敬語|けいご}**が{使|つか}えます。**ベトナム{語|ご}と{英語|えいご}**も{話|はな}せます。', 'Nihongo wa ichinen benkyou shimashita. Kantan na keigo ga tsukaemasu. Betonamugo to eigo mo hanasemasu.'],
        ['③ Lịch làm', '**{月曜日|げつようび}と{水曜日|すいようび}の{夕方|ゆうがた}**と、**{土日|どにち}**に{来|こ}られます。**{夜|よる}{10時|じゅうじ}**まで{働|はたら}けます。', 'Getsuyoubi to suiyoubi no yuugata to, donichi ni koraremasu. Yoru juuji made hatarakemasu.'],
        ['④ Vì sao muốn làm', '**お{客様|きゃくさま}と{話|はな}して、{日本語|にほんご}をもっと{上手|じょうず}にしたい**ですから、ここで{働|はたら}きたいです。', 'Okyakusama to hanashite, nihongo o motto jouzu ni shitai desu kara, koko de hatarakitai desu.'],
        ['⑤ Dự định + quyết tâm', '**{卒業|そつぎょう}するまで**{続|つづ}けるつもりです。{一生懸命|いっしょうけんめい}{頑張|がんば}ります。よろしくお{願|ねが}いします。', 'Sotsugyou suru made tsuzukeru tsumori desu. Isshoukenmei ganbarimasu. Yoroshiku onegai shimasu.'],
      ],
    },
    {
      t: 'note',
      title: 'Đoạn đọc to (Reading 40đ) — chuẩn bị 30 giây rồi đọc',
      items: [
        '{私|わたし}は{今|いま}、コンビニでアルバイトをしています。{週|しゅう}{3日|みっか}、{夕方|ゆうがた}から{夜|よる}{9時|くじ}まで{働|はたら}いています。{最初|さいしょ}はレジが{打|う}てませんでしたが、{今|いま}は{一人|ひとり}でできます。{夏休|なつやす}みはお{金|かね}を{貯|た}めて、{北海道|ほっかいどう}へ{旅行|りょこう}しようと{思|おも}っています。{卒業|そつぎょう}したら、{日本|にほん}の{会社|かいしゃ}で{働|はたら}くつもりです。',
        'Romaji: Watashi wa ima, konbini de arubaito o shite imasu. Shuu mikka, yuugata kara yoru kuji made hataraite imasu. Saisho wa reji ga utemasen deshita ga, ima wa hitori de dekimasu. Natsuyasumi wa okane o tamete, Hokkaidou e ryokou shiyou to omotte imasu. Sotsugyou shitara, Nihon no kaisha de hataraku tsumori desu.',
        'Nghĩa: Hiện tôi làm thêm ở cửa hàng tiện lợi, 3 ngày/tuần, từ chiều tối đến 9 giờ. Lúc đầu tôi không tính tiền được, giờ tự làm được rồi. Nghỉ hè tôi tính để dành tiền đi Hokkaido. Tốt nghiệp xong tôi định làm ở công ty Nhật.',
        'Chỗ dễ vấp: **{打|う}てませんでした** (u-te-ma-se-n-de-shi-ta), **{貯|た}めて**, **{旅行|りょこう}しよう**（ryo-ko-u-shi-yo-u — kéo đủ nhịp）.',
      ],
    },
    {
      t: 'speak',
      id: 'b16-noi-ghi-am',
      part: '1',
      questions: [
        'なにが できますか。',
        'にほんごで なにが できますか。',
        'なんようびに アルバイトに こられますか。',
        'なつやすみは なにを しようと おもって いますか。',
        'そつぎょうしたら、なにを する つもりですか。',
        'しょうらいの ゆめは なんですか。',
      ],
    },
  ],
};

/* ═══════════════════════════ 8. VIẾT ═══════════════════════════ */

const VIET: Lesson = {
  id: 'b16-viet',
  kind: 'writing',
  title: 'Viết — 「私の将来の計画」 (150–200 chữ) và email ứng tuyển làm thêm',
  goal: 'Viết một đoạn 150–200 chữ kể kế hoạch tương lai có đủ thể khả năng, ～（よ）うと思っています, ～つもりです và một câu lý do; viết email ngắn xin làm thêm đúng khuôn (tiêu đề, chào, nội dung, kết) — tự chấm theo 5 tiêu chí.',
  minutes: 40,
  blocks: [
    {
      t: 'p',
      text: 'Bài viết N4 không dài, nhưng phải **đúng khuôn** và **dùng được mẫu vừa học**. Đề chính: 「{私|わたし}の{将来|しょうらい}の{計画|けいかく}」 (Kế hoạch tương lai của tôi), **150–200 chữ**, thể です／ます. Đề phụ: email xin làm thêm. Viết vào vở hoặc gõ ra, rồi so với bài mẫu và tự chấm theo bảng cuối mục.',
    },
    {
      t: 'table',
      caption: 'Dàn ý 4 đoạn — mỗi đoạn 1–3 câu',
      head: ['Đoạn', 'Nội dung', 'Mẫu nên dùng', 'Câu gợi ý'],
      rows: [
        ['① Bây giờ', 'mình đang học/làm gì, làm được gì', 'V(khả năng)ます', '{今|いま}、{日本語|にほんご}を{勉強|べんきょう}しています。{簡単|かんたん}な{会話|かいわ}ができます。'],
        ['② Gần (năm nay)', 'việc sắp làm, đã lên lịch', '～{予定|よてい}です／～（よ）うと{思|おも}っています', '{12月|じゅうにがつ}にN4を{受|う}ける{予定|よてい}です。'],
        ['③ Sau tốt nghiệp', 'ý định đã quyết + lý do', '～つもりです + ～から', '{卒業|そつぎょう}したら、{日本|にほん}で{働|はたら}くつもりです。'],
        ['④ Ước mơ + quyết tâm', 'ước mơ xa, câu kết', '{夢|ゆめ}は～ことです · ～（よ）うと{思|おも}います', 'だから、{毎日|まいにち}{頑張|がんば}ろうと{思|おも}います。'],
      ],
    },
    {
      t: 'table',
      caption: 'Từ nối giúp bài liền mạch',
      head: ['Từ nối', 'Romaji', 'Nghĩa', 'Dùng ở'],
      rows: [
        ['{今|いま}は', 'ima wa', 'hiện giờ thì', 'đầu đoạn ①'],
        ['まず／それから', 'mazu / sorekara', 'trước hết / sau đó', 'liệt kê kế hoạch'],
        ['{卒業|そつぎょう}したら', 'sotsugyou shitara', 'sau khi tốt nghiệp (ôn ～たら)', 'đầu đoạn ③'],
        ['{将来|しょうらい}は', 'shourai wa', 'sau này, trong tương lai', 'đầu đoạn ④'],
        ['でも', 'demo', 'nhưng', 'nêu khó khăn'],
        ['だから', 'dakara', 'vì vậy', 'trước câu quyết tâm'],
      ],
    },
    {
      t: 'passage',
      title: 'Bài mẫu — {私|わたし}の{将来|しょうらい}の{計画|けいかく}（{約|やく}{200字|にひゃくじ}）',
      paras: [
        { text: '{私|わたし}は{今|いま}、{大学|だいがく}で{情報|じょうほう}{技術|ぎじゅつ}と{日本語|にほんご}を{勉強|べんきょう}しています。{日本語|にほんご}で{簡単|かんたん}な{会話|かいわ}ができますが、{敬語|けいご}はまだ{上手|じょうず}に{使|つか}えません。' },
        { text: '{今年|ことし}の{12月|じゅうにがつ}に、N4を{受|う}ける{予定|よてい}です。{夏休|なつやす}みは{毎日|まいにち}{2時間|にじかん}{勉強|べんきょう}しようと{思|おも}っています。' },
        { text: '{卒業|そつぎょう}したら、{日本|にほん}の{IT|アイティー}{会社|がいしゃ}で{働|はたら}くつもりです。{日本|にほん}の{会社|かいしゃ}で{働|はたら}き{方|かた}を{勉強|べんきょう}したいですから。' },
        { text: '{私|わたし}の{夢|ゆめ}は、ベトナムと{日本|にほん}をつなぐエンジニアになることです。{大変|たいへん}だと{思|おも}いますが、{諦|あきら}めないつもりです。だから、{毎日|まいにち}{少|すこ}しずつ{頑張|がんば}ろうと{思|おも}います。' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('{私|わたし}は{今|いま}、{大学|だいがく}で{情報|じょうほう}{技術|ぎじゅつ}と{日本語|にほんご}を{勉強|べんきょう}しています。', 'Watashi wa ima, daigaku de jouhou gijutsu to nihongo o benkyou shite imasu.', 'Hiện tôi đang học công nghệ thông tin và tiếng Nhật ở đại học.'),
        E('{日本語|にほんご}で{簡単|かんたん}な{会話|かいわ}ができますが、{敬語|けいご}はまだ{上手|じょうず}に{使|つか}えません。', 'Nihongo de kantan na kaiwa ga dekimasu ga, keigo wa mada jouzu ni tsukaemasen.', 'Tôi nói được hội thoại đơn giản bằng tiếng Nhật, nhưng kính ngữ thì chưa dùng giỏi.'),
        E('{今年|ことし}の{12月|じゅうにがつ}に、N4を{受|う}ける{予定|よてい}です。', 'Kotoshi no juunigatsu ni, enu yon o ukeru yotei desu.', 'Tháng 12 năm nay tôi sẽ thi N4.'),
        E('{夏休|なつやす}みは{毎日|まいにち}{2時間|にじかん}{勉強|べんきょう}しようと{思|おも}っています。', 'Natsuyasumi wa mainichi nijikan benkyou shiyou to omotte imasu.', 'Nghỉ hè tôi tính ngày nào cũng học 2 tiếng.'),
        E('{卒業|そつぎょう}したら、{日本|にほん}の{IT|アイティー}{会社|がいしゃ}で{働|はたら}くつもりです。', 'Sotsugyou shitara, Nihon no aitii-gaisha de hataraku tsumori desu.', 'Tốt nghiệp xong tôi định làm ở một công ty IT của Nhật.'),
        E('{日本|にほん}の{会社|かいしゃ}で{働|はたら}き{方|かた}を{勉強|べんきょう}したいですから。', 'Nihon no kaisha de hatarakikata o benkyou shitai desu kara.', 'Vì tôi muốn học cách làm việc ở công ty Nhật.'),
        E('{私|わたし}の{夢|ゆめ}は、ベトナムと{日本|にほん}をつなぐエンジニアになることです。', 'Watashi no yume wa, Betonamu to Nihon o tsunagu enjinia ni naru koto desu.', 'Ước mơ của tôi là trở thành kỹ sư kết nối Việt Nam và Nhật Bản.'),
        E('{大変|たいへん}だと{思|おも}いますが、{諦|あきら}めないつもりです。', 'Taihen da to omoimasu ga, akiramenai tsumori desu.', 'Tôi nghĩ sẽ vất vả nhưng tôi quyết không bỏ cuộc. ({諦|あきら}める = bỏ cuộc)'),
        E('だから、{毎日|まいにち}{少|すこ}しずつ{頑張|がんば}ろうと{思|おも}います。', 'Dakara, mainichi sukoshi zutsu ganbarou to omoimasu.', 'Vì vậy tôi quyết mỗi ngày cố gắng từng chút một.'),
      ],
    },
    {
      t: 'note',
      title: 'Vì sao bài mẫu được điểm cao',
      items: [
        'Đủ **4 đoạn theo thời gian**: bây giờ → năm nay → sau tốt nghiệp → ước mơ. Người đọc không bị lạc.',
        'Mỗi mẫu của bài xuất hiện **ít nhất 1 lần**: khả năng (できます, {使|つか}えません), {予定|よてい}, ～（よ）うと{思|おも}っています, つもり (khẳng định + phủ định), {夢|ゆめ}は～ことです.',
        'Có **lý do** (～から) và **sự đối lập** (～が、でも) → câu không đơn điệu.',
        '{情報|じょうほう}{技術|ぎじゅつ} (công nghệ thông tin), エンジニア (kỹ sư), {諦|あきら}める (bỏ cuộc) là từ ngoài bài — được dùng khi viết về bản thân, nhưng nên kèm furigana nếu viết tay cho người khác đọc.',
      ],
    },

    { t: 'h', text: 'Đề phụ — Email ứng tuyển làm thêm (応募のメール)' },
    {
      t: 'table',
      caption: 'Khuôn email xin làm thêm',
      head: ['Phần', 'Viết gì', 'Câu mẫu'],
      rows: [
        ['{件名|けんめい} (tiêu đề)', 'việc gì + tên', 'アルバイト{応募|おうぼ}の{件|けん}（グエン・ラン）'],
        ['Mở', 'tên cửa hàng + người nhận', 'ひまわり{食堂|しょくどう}　{小林|こばやし}{様|さま}'],
        ['Chào + giới thiệu', 'thấy tin ở đâu, mình là ai', '{初|はじ}めまして。さくら{大学|だいがく}{2年|にねん}のグエン・ランです。{大学|だいがく}の{掲示板|けいじばん}でアルバイト{募集|ぼしゅう}を{見|み}ました。'],
        ['Nội dung', 'làm được gì, đến được lúc nào', '{日本語|にほんご}は{日常会話|にちじょうかいわ}ができます。{火曜日|かようび}、{木曜日|もくようび}、{土曜日|どようび}に{働|はたら}けます。'],
        ['Xin phỏng vấn', 'lời đề nghị lịch sự', 'ぜひ{面接|めんせつ}を{受|う}けたいと{思|おも}います。よろしくお{願|ねが}いいたします。'],
        ['Ký tên', 'tên + số điện thoại', 'グエン・ラン　{電話|でんわ}：090-XXXX-XXXX'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{初|はじ}めまして。さくら{大学|だいがく}{2年|にねん}のグエン・ランです。', 'Hajimemashite. Sakura daigaku ninen no Guen Ran desu.', 'Xin chào. Tôi là Nguyễn Lan, sinh viên năm 2 đại học Sakura.'),
        E('{大学|だいがく}の{掲示板|けいじばん}でアルバイト{募集|ぼしゅう}を{見|み}て、メールしました。', 'Daigaku no keijiban de arubaito boshuu o mite, meeru shimashita.', 'Tôi thấy tin tuyển người trên bảng tin của trường nên gửi email.'),
        E('{日本語|にほんご}は{日常会話|にちじょうかいわ}ができます。{英語|えいご}も{話|はな}せます。', 'Nihongo wa nichijou kaiwa ga dekimasu. Eigo mo hanasemasu.', 'Tiếng Nhật tôi giao tiếp hằng ngày được. Tôi cũng nói được tiếng Anh.'),
        E('{火曜日|かようび}と{木曜日|もくようび}の{夕方|ゆうがた}、{土曜日|どようび}は{一日|いちにち}{働|はたら}けます。', 'Kayoubi to mokuyoubi no yuugata, doyoubi wa ichinichi hatarakemasu.', 'Tôi làm được chiều tối thứ Ba, thứ Năm và cả ngày thứ Bảy.'),
        E('ぜひ{面接|めんせつ}を{受|う}けたいと{思|おも}います。よろしくお{願|ねが}いいたします。', 'Zehi mensetsu o uketai to omoimasu. Yoroshiku onegai itashimasu.', 'Tôi rất mong được phỏng vấn. Kính mong được giúp đỡ. (いたします = khiêm nhường của します, Bài 24)'),
      ],
    },
    {
      t: 'quiz',
      id: 'b16-viet-cau',
      title: 'Viết từng câu cho bài của bạn — dịch Việt → Nhật (6 câu)',
      kind: 'translate',
      grammar: 'thể khả năng · ～予定です · ～（よ）うと思っています · ～つもりです · 夢は～ことです',
      items: [
        { q: 'Tôi viết được email đơn giản bằng tiếng Nhật.', answers: V('{日本語|にほんご}で{簡単|かんたん}なメールが{書|か}けます。', '{日本語|にほんご}で{簡単|かんたん}なメールを{書|か}くことができます。'), hint: 'かんたんな · メール · かけます' },
        { q: 'Tháng 12 tôi sẽ thi N4 (đã đăng ký).', answers: V('{12月|じゅうにがつ}にN4を{受|う}ける{予定|よてい}です。', '{12月|じゅうにがつ}、N4を{受|う}ける{予定|よてい}です。'), hint: 'うける · よてい' },
        { q: 'Nghỉ hè tôi đang tính làm thêm.', answers: V('{夏休|なつやす}みはアルバイトをしようと{思|おも}っています。', '{夏休|なつやす}みにアルバイトをしようと{思|おも}っています。', '{夏休|なつやす}みはバイトをしようと{思|おも}っています。'), hint: 'しようと おもっています' },
        { q: 'Tốt nghiệp xong tôi định về nước.', answers: V('{卒業|そつぎょう}したら、{国|くに}へ{帰|かえ}るつもりです。', '{卒業|そつぎょう}したら、{国|くに}に{帰|かえ}るつもりです。', '{卒業|そつぎょう}したら、{帰国|きこく}するつもりです。'), hint: 'そつぎょうしたら · かえる · つもり' },
        { q: 'Ước mơ của tôi là trở thành phiên dịch.', answers: V('{私|わたし}の{夢|ゆめ}は{通訳|つうやく}になることです。', '{夢|ゆめ}は{通訳|つうやく}になることです。'), hint: 'ゆめ · つうやく · なること' },
        { q: 'Vì vậy tôi quyết sẽ cố gắng hơn nữa.', answers: V('だから、もっと{頑張|がんば}ろうと{思|おも}います。', 'だから、もっと{頑張|がんば}ります。'), hint: 'だから · がんばろう' },
      ],
    },
    {
      t: 'note',
      title: 'Tự chấm — 5 tiêu chí (mỗi tiêu chí 2 điểm, tổng 10)',
      items: [
        '**① Độ dài & khuôn** — đề chính 150–200 chữ, có 3–4 đoạn theo dàn ý; email đủ tiêu đề – mở – nội dung – kết – ký tên.',
        '**② Mẫu của bài** — có ít nhất: 2 câu thể khả năng (1 khẳng định, 1 phủ định), 1 câu ～（よ）うと{思|おも}っています, 1 câu ～つもりです, 1 câu ～{予定|よてい}です.',
        '**③ Chia đúng** — soát từng động từ: nhóm 1 khả năng い→え (書けます), ý chí い→お＋う (書こう); {来|こ}られます／{来|こ}よう; する → できる／しよう.',
        '**④ Trợ từ** — {日本語|にほんご}**が**{話|はな}せます; {会社|かいしゃ}**に**{就職|しゅうしょく}; {試験|しけん}**を**{受|う}ける／**に**{合格|ごうかく}; {夢|ゆめ}**は**～ことです.',
        '**⑤ Mạch lạc & lý do** — có từ nối (まず・それから・でも・だから) và ít nhất 1 câu lý do ～から. Toàn bài một thể (です／ます), không lẫn thể thường.',
      ],
    },
  ],
};

/* ═══════════════════════════ 9. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b16-bai-tap',
  kind: 'homework',
  title: 'Bài tập Bài 16 — dịch, trắc nghiệm, ghép câu, đổi câu (có đáp án)',
  goal: 'Tự kiểm tra toàn bộ Bài 16: dịch Việt → Nhật có thể khả năng / thể ý chí / つもり / 予定, chọn trợ từ – từ vựng – mẫu đúng, ghép câu, và đổi qua lại giữa ～ことができます và thể khả năng.',
  minutes: 50,
  blocks: [
    {
      t: 'note',
      title: 'Cách làm',
      items: [
        'Làm sau khi xong 8 mục cốt lõi. Gõ đáp án bằng kana hoặc chữ Hán đều được; dấu câu và dấu cách không tính.',
        'Sai câu nào thì mở lại đúng mục: thể khả năng → Ngữ pháp ①; thể ý chí → ②③; つもり／予定 → ④⑤; từ vựng → mục Từ vựng.',
        'Mục tiêu: **≥ 85%** trước khi sang Bài 17.',
      ],
    },
    {
      t: 'quiz',
      id: 'b16-bt-dich',
      title: 'I. Dịch Việt → Nhật (14 câu)',
      kind: 'translate',
      grammar: 'V可能形 · V意向形 · V意向形と思っています · V辞書形／Vない つもりです · V辞書形 予定です',
      items: [
        { q: 'Tôi đọc được chữ Hán đơn giản.', answers: V('{簡単|かんたん}な{漢字|かんじ}が{読|よ}めます。', '{簡単|かんたん}な{漢字|かんじ}は{読|よ}めます。', '{私|わたし}は{簡単|かんたん}な{漢字|かんじ}が{読|よ}めます。'), hint: 'かんたんな · よめます' },
        { q: 'Anh Marco không ăn được đồ cay.', answers: V('マルコさんは{辛|から}い{物|もの}が{食|た}べられません。', 'マルコさんは{辛|から}いものが{食|た}べられません。'), hint: 'からいもの · たべられません' },
        { q: 'Ngày mai bạn đến được lúc 9 giờ không?', answers: V('{明日|あした}{9時|くじ}に{来|こ}られますか。', '{明日|あした}、{9時|くじ}に{来|こ}られますか。'), hint: 'こられますか' },
        { q: 'Ở cửa hàng tiện lợi này dùng được thẻ.', answers: V('このコンビニではカードが{使|つか}えます。', 'このコンビニでカードが{使|つか}えます。'), hint: 'カード · つかえます' },
        { q: 'Tôi lái được xe ô tô.', answers: V('{私|わたし}は{車|くるま}の{運転|うんてん}ができます。', '{私|わたし}は{車|くるま}が{運転|うんてん}できます。', '{車|くるま}の{運転|うんてん}ができます。', '{車|くるま}が{運転|うんてん}できます。'), hint: 'うんてん · できます' },
        { q: 'Đang tuyển người nói được tiếng Anh.', answers: V('{英語|えいご}が{話|はな}せる{人|ひと}を{募集|ぼしゅう}しています。', '{英語|えいご}が{話|はな}せる{方|かた}を{募集|ぼしゅう}しています。'), hint: 'はなせる ひと／かた · ぼしゅう' },
        { q: 'Muộn rồi, về thôi. (nói với bạn)', answers: V('もう{遅|おそ}いから、{帰|かえ}ろう。', 'もう{遅|おそ}いから{帰|かえ}ろう。', '{遅|おそ}いから、{帰|かえ}ろう。'), hint: 'おそい · かえろう' },
        { q: 'Để mình giúp nhé? (nói với bạn)', answers: V('{手伝|てつだ}おうか。'), hint: 'てつだう → ý chí + か' },
        { q: 'Nghỉ hè tôi đang tính về nước.', answers: V('{夏休|なつやす}みは{国|くに}へ{帰|かえ}ろうと{思|おも}っています。', '{夏休|なつやす}みに{国|くに}へ{帰|かえ}ろうと{思|おも}っています。', '{夏休|なつやす}みは{国|くに}に{帰|かえ}ろうと{思|おも}っています。', '{夏休|なつやす}みに{国|くに}に{帰|かえ}ろうと{思|おも}っています。'), hint: 'かえろうと おもっています' },
        { q: 'Hôm nay mệt nên tôi định ngủ sớm.', answers: V('{今日|きょう}は{疲|つか}れたから、{早|はや}く{寝|ね}ようと{思|おも}います。', '{今日|きょう}は{疲|つか}れましたから、{早|はや}く{寝|ね}ようと{思|おも}います。'), hint: 'つかれたから · ねよう' },
        { q: 'Tốt nghiệp xong tôi định vào làm công ty Nhật.', answers: V('{卒業|そつぎょう}したら、{日本|にほん}の{会社|かいしゃ}に{就職|しゅうしょく}するつもりです。', '{卒業|そつぎょう}したら、{日本|にほん}の{会社|かいしゃ}で{働|はたら}くつもりです。'), hint: 'しゅうしょくする つもり' },
        { q: 'Năm nay tôi định không đi du lịch.', answers: V('{今年|ことし}は{旅行|りょこう}しないつもりです。', '{今年|ことし}は{旅行|りょこう}に{行|い}かないつもりです。'), hint: 'Vない + つもり' },
        { q: 'Tôi không hề có ý định nghỉ việc.', answers: V('{仕事|しごと}を{辞|や}めるつもりはありません。', '{会社|かいしゃ}を{辞|や}めるつもりはありません。', 'バイトを{辞|や}めるつもりはありません。'), hint: 'やめる つもりは ありません' },
        { q: 'Tàu dự kiến đến lúc 3 giờ.', answers: V('{電車|でんしゃ}は{3時|さんじ}に{着|つ}く{予定|よてい}です。'), hint: 'つく よてい' },
      ],
    },
    {
      t: 'mcq',
      id: 'b16-bt-chon',
      title: 'II. Chọn đáp án đúng — trợ từ, từ vựng, ngữ pháp (14 câu)',
      items: [
        { q: '{私|わたし}は{日本語|にほんご}（　）{少|すこ}し{話|はな}せます。', options: ['を', 'が', 'に', 'で'], correct: 1, why: 'Thể khả năng: tân ngữ **が**. 〔Watashi wa nihongo ga sukoshi hanasemasu.〕' },
        { q: '{子|こ}どものとき、{自転車|じてんしゃ}（　）{乗|の}れませんでした。', options: ['を', 'が', 'に', 'で'], correct: 2, why: '{乗|の}る đi với **に** — thể khả năng không đổi に. 〔Kodomo no toki, jitensha ni noremasen deshita.〕' },
        { q: '{明日|あした}は（　）。{午前|ごぜん}に{授業|じゅぎょう}がありますから。', options: ['{来|く}られません', '{来|こ}られません', '{来|き}られません', '{来|こ}れられません'], correct: 1, why: '{来|く}る → **{来|こ}られる**. 〔Ashita wa koraremasen.〕' },
        { q: 'ここから{富士山|ふじさん}が（　）。', options: ['{見|み}えます', '{見|み}られます', '{見|み}ます', '{見|み}せます'], correct: 0, why: 'Cảnh tự lọt vào mắt → **{見|み}えます**. 〔Koko kara Fujisan ga miemasu.〕' },
        { q: 'このアプリで{日本|にほん}の{映画|えいが}が（　）。', options: ['{見|み}えます', '{見|み}られます', '{見|み}せます', '{見|み}つかります'], correct: 1, why: 'Có điều kiện (ứng dụng) để chủ động xem → **{見|み}られます**. 〔Kono apuri de Nihon no eiga ga miraremasu.〕' },
        { q: 'A「お{腹|なか}すいたね。」B「うん、{何|なに}か（　）。」', options: ['{食|た}べよう', '{食|た}べろう', '{食|た}べれる', '{食|た}べた'], correct: 0, why: 'Rủ thân mật: **{食|た}べよう**. ~~食べろう~~ sai cách chia. 〔Un, nanika tabeyou.〕' },
        { q: '{来年|らいねん}、{大学院|だいがくいん}に（　）と{思|おも}っています。', options: ['{進学|しんがく}する', '{進学|しんがく}しよう', '{進学|しんがく}できる', '{進学|しんがく}した'], correct: 1, why: 'Ý định: thể ý chí + と{思|おも}っています → **{進学|しんがく}しよう**. 〔Rainen, daigakuin ni shingaku shiyou to omotte imasu.〕' },
        { q: '{会議|かいぎ}は{2時|にじ}に{終|お}わる（　）です。', options: ['つもり', '{予定|よてい}', 'たい', 'ながら'], correct: 1, why: 'Lịch của cuộc họp (không phải ý định cá nhân) → **{予定|よてい}**. 〔Kaigi wa niji ni owaru yotei desu.〕' },
        { q: '{面接|めんせつ}で{店長|てんちょう}の{質問|しつもん}（　）{答|こた}えました。', options: ['を', 'に', 'が', 'と'], correct: 1, why: '**{質問|しつもん}に{答|こた}える**. 〔Mensetsu de tenchou no shitsumon ni kotaemashita.〕' },
        { q: '{来月|らいげつ}、N4（　）{受|う}けます。', options: ['に', 'を', 'が', 'で'], correct: 1, why: '**{試験|しけん}を{受|う}ける**; còn "đỗ" thì **に{合格|ごうかく}する**. 〔Raigetsu, enu yon o ukemasu.〕' },
        { q: 'バイトの{時間|じかん}を（　）ください。{遅刻|ちこく}はだめですよ。', options: ['{守|まも}って', '{決|き}めて', '{貯|た}めて', '{考|かんが}えて'], correct: 0, why: '**{時間|じかん}を{守|まも}る** = đúng giờ. 〔Baito no jikan o mamotte kudasai.〕' },
        { q: '{私|わたし}は{料理|りょうり}が（　）です。{毎日|まいにち}{作|つく}ります。', options: ['{得意|とくい}', '{苦手|にがて}', '{無理|むり}', '{上手|じょうず}な'], correct: 0, why: 'Tự nói về mình → **{得意|とくい}**. "上手な" sai hình thức (phải 上手です) và tự khen mình nghe kém tự nhiên. 〔Watashi wa ryouri ga tokui desu.〕' },
        { q: '{今年|ことし}は{国|くに}へ（　）つもりです。{試験|しけん}がありますから。', options: ['{帰|かえ}らない', '{帰|かえ}れない', '{帰|かえ}ろう', '{帰|かえ}りたい'], correct: 0, why: 'Định không làm: **Vない + つもり** → {帰|かえ}らない. 〔Kotoshi wa kuni e kaeranai tsumori desu.〕' },
        { q: 'アンナさんは{来年|らいねん}{帰国|きこく}しようと（　）。', options: ['{思|おも}います', '{思|おも}っています', '{思|おも}いましょう', '{思|おも}えます'], correct: 1, why: 'Ngôi thứ ba → **と{思|おも}っています**. 〔Anna-san wa rainen kikoku shiyou to omotte imasu.〕' },
      ],
    },
    {
      t: 'build',
      id: 'b16-bt-ghep',
      title: 'III. Ghép câu (8 câu)',
      items: [
        { vi: 'Hồi nhỏ tôi không bơi được.', chips: ['{子|こ}どものとき', '{泳|およ}げませんでした', '{泳|およ}ぎませんでした', 'に'], answer: ['{子|こ}どものとき', '{泳|およ}げませんでした'], ro: 'Kodomo no toki, oyogemasen deshita.' },
        { vi: 'Từ ga đi bộ 10 phút là tới được.', chips: ['{駅|えき}から', '{歩|ある}いて', '{10分|じゅっぷん}で', '{行|い}けます', '{行|い}きます', 'に'], answer: ['{駅|えき}から', '{歩|ある}いて', '{10分|じゅっぷん}で', '{行|い}けます'], ro: 'Eki kara aruite juppun de ikemasu.' },
        { vi: 'Có ai đọc được chữ Hán này không?', chips: ['この{漢字|かんじ}が', '{読|よ}める', '{人|ひと}は', 'いますか', '{読|よ}む', 'ありますか'], answer: ['この{漢字|かんじ}が', '{読|よ}める', '{人|ひと}は', 'いますか'], ro: 'Kono kanji ga yomeru hito wa imasu ka.' },
        { vi: 'Mệt nhỉ. Nghỉ một chút nhé? (thân mật)', chips: ['{疲|つか}れたね', 'ちょっと', '{休|やす}もうか', '{休|やす}めるか', '{休|やす}みようか'], answer: ['{疲|つか}れたね', 'ちょっと', '{休|やす}もうか'], ro: 'Tsukareta ne. Chotto yasumou ka.' },
        { vi: 'Sang năm tôi định thi N3.', chips: ['{来年|らいねん}', 'N3を', '{受|う}けようと', '{思|おも}っています', '{受|う}けると', '{受|う}けられると'], answer: ['{来年|らいねん}', 'N3を', '{受|う}けようと', '{思|おも}っています'], ro: 'Rainen, enu san o ukeyou to omotte imasu.' },
        { vi: 'Tôi định để dành tiền mua máy tính.', chips: ['お{金|かね}を', '{貯|た}めて', 'パソコンを', '{買|か}う', 'つもりです', '{買|か}おう'], answer: ['お{金|かね}を', '{貯|た}めて', 'パソコンを', '{買|か}う', 'つもりです'], ro: 'Okane o tamete, pasokon o kau tsumori desu.' },
        { vi: 'Ước mơ của tôi là có cửa hàng của riêng mình.', chips: ['{私|わたし}の', '{夢|ゆめ}は', '{自分|じぶん}の{店|みせ}を', '{持|も}つ', 'ことです', '{持|も}ちたいです'], answer: ['{私|わたし}の', '{夢|ゆめ}は', '{自分|じぶん}の{店|みせ}を', '{持|も}つ', 'ことです'], ro: 'Watashi no yume wa jibun no mise o motsu koto desu.' },
        { vi: 'Thứ Hai tuần sau tôi sẽ bắt đầu làm (đã hẹn).', chips: ['{来週|らいしゅう}の', '{月曜日|げつようび}から', '{働|はたら}く', '{予定|よてい}です', '{働|はたら}こう', 'つもりは'], answer: ['{来週|らいしゅう}の', '{月曜日|げつようび}から', '{働|はたら}く', '{予定|よてい}です'], ro: 'Raishuu no getsuyoubi kara hataraku yotei desu.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b16-bt-doi',
      title: 'IV. Đổi câu ～ことができます → thể khả năng (8 câu)',
      kind: 'fill',
      grammar: 'V辞書形 ことができます ＝ V可能形ます (を → が)',
      items: [
        { q: '{日本語|にほんご}を{話|はな}すことができます。 → {日本語|にほんご}が（　）。', answers: V('{話|はな}せます'), hint: 'す → せ' },
        { q: 'ギターを{弾|ひ}くことができます。 → ギターが（　）。', answers: V('{弾|ひ}けます'), hint: 'く → け' },
        { q: '{朝|あさ}{5時|ごじ}に{起|お}きることができます。 → {朝|あさ}{5時|ごじ}に（　）。', answers: V('{起|お}きられます'), hint: 'nhóm 2' },
        { q: 'ここで{写真|しゃしん}を{撮|と}ることができます。 → ここで{写真|しゃしん}が（　）。', answers: V('{撮|と}れます'), hint: 'る → れ (nhóm 1)' },
        { q: '{一人|ひとり}で{来|く}ることができます。 → {一人|ひとり}で（　）。', answers: V('{来|こ}られます'), hint: 'こられ' },
        { q: 'この{言葉|ことば}を{覚|おぼ}えることができません。 → この{言葉|ことば}が（　）。', answers: V('{覚|おぼ}えられません'), hint: 'nhóm 2, phủ định' },
        { q: '{駅|えき}まで{歩|ある}くことができました。 → {駅|えき}まで（　）。', answers: V('{歩|ある}けました'), hint: 'く → け, quá khứ' },
        { q: '{漢字|かんじ}を{書|か}くことができませんでした。 → {漢字|かんじ}が（　）。', answers: V('{書|か}けませんでした'), hint: 'quá khứ phủ định' },
      ],
    },
  ],
};

/* ═══════════════════════ ② THEO BUỔI TRÊN LỚP ═══════════════════════ */

const BUOI_1: Lesson = {
  id: 'b16-buoi-1-kha-nang',
  kind: 'review',
  title: 'Buổi 1 — Mở Bài 16: từ mới tìm việc · thể khả năng · hội thoại phỏng vấn',
  goal: 'Theo nhịp một buổi trên lớp: khởi động bằng ～ことができます, học 21 từ tìm việc & năng lực, chia và dùng thể khả năng, đóng vai phỏng vấn làm thêm, rồi trả lời được câu giáo viên hay gọi.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 1 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Khởi động (5′)** — ôn ～ことができます (Bài 9–10) và ba nhóm động từ.',
        '**Từ mới (10′)** — nhóm A (tìm việc, phỏng vấn) + nhóm C (giỏi, kém).',
        '**Ngữ pháp (15′)** — thể khả năng: cách chia, を→が, năng lực ↔ hoàn cảnh, 見える ↔ 見られる.',
        '**Hội thoại (10′)** — ① phỏng vấn ở ひまわり食堂.',
        '**チャレンジ (10′)** — luyện cặp: người phỏng vấn ↔ người xin việc. Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    { t: 'h', text: 'Slide 1 — Khởi động: "Bạn làm được gì?"' },
    {
      t: 'p',
      text: 'Giáo viên hỏi cả lớp bằng mẫu cũ: 「{何|なに}をすることができますか」. Sau 3–4 bạn trả lời, giáo viên viết lên bảng câu trả lời của một bạn — {日本語|にほんご}を{話|はな}すことができます — rồi gạch đi, viết bên cạnh: **{日本語|にほんご}が{話|はな}せます**. "Hôm nay mình học cách nói ngắn này."',
    },
    {
      t: 'mcq',
      id: 'b16-b1-khoi-dong',
      title: 'Khởi động — ôn Bài 9–10 (4 câu)',
      items: [
        { q: '{私|わたし}はピアノを{弾|ひ}く（　）ができます。', options: ['こと', 'の', 'もの', 'ところ'], correct: 0, why: 'V{辞書形|じしょけい} **こと** ができます (ポイント 82). 〔Watashi wa piano o hiku koto ga dekimasu.〕' },
        { q: 'この{図書館|としょかん}では{本|ほん}を{借|か}りること（　）できます。', options: ['を', 'が', 'に', 'で'], correct: 1, why: '～こと**が**できます. 〔Kono toshokan de wa hon o kariru koto ga dekimasu.〕' },
        { q: '「{帰|かえ}ります」は{何|なん}グループですか。', options: ['1グループ', '2グループ', '3グループ'], correct: 0, why: '{帰|かえ}る là **nhóm 1** dù đuôi える — ngoại lệ phải thuộc. Thể khả năng: {帰|かえ}れます.' },
        { q: '「{見|み}ます」は{何|なん}グループですか。', options: ['1グループ', '2グループ', '3グループ'], correct: 1, why: '{見|み}る là **nhóm 2** (một âm trước る). Thể khả năng: {見|み}られます.' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Từ mới: tờ tuyển người làm thêm' },
    {
      t: 'table',
      caption: 'Giáo viên dán một tờ tuyển người lên bảng và gạch chân từ mới',
      head: ['Trên tờ', 'Đọc', 'Nghĩa'],
      rows: [
        ['アルバイト**{募集|ぼしゅう}**', 'boshuu', 'tuyển người'],
        ['**{時給|じきゅう}**{1,100円|せんひゃくえん}', 'jikyuu (ôn Bài 14)', 'lương giờ'],
        ['**{交通費|こうつうひ}**あり', 'koutsuuhi', 'có tiền đi lại'],
        ['**{条件|じょうけん}**：{日本語|にほんご}が{話|はな}せる{方|かた}', 'jouken', 'điều kiện'],
        ['**{週|しゅう}{3日|みっか}**から・**{土日|どにち}**{働|はたら}ける{方|かた}', 'shuu mikka · donichi', 'từ 3 ngày/tuần · làm được T7, CN'],
        ['**{面接|めんせつ}**の{日|ひ}は{電話|でんわ}で**{連絡|れんらく}**します', 'mensetsu · renraku', 'phỏng vấn · liên lạc'],
        ['**{履歴書|りれきしょ}**を{持|も}ってきてください', 'rirekisho', 'sơ yếu lý lịch'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{料理|りょうり}が{得意|とくい}です。——いいですね。', 'Ryouri ga tokui desu. — Ii desu ne.', 'Tôi giỏi nấu ăn. — Tốt quá.'),
        E('{早起|はやお}きが{苦手|にがて}です。', 'Hayaoki ga nigate desu.', 'Tôi rất ngại dậy sớm.'),
        E('{毎日|まいにち}はちょっと{無理|むり}です。', 'Mainichi wa chotto muri desu.', 'Ngày nào cũng thì hơi quá sức ạ.'),
        E('{日本語|にほんご}の{電話|でんわ}は、まだ{自信|じしん}がありません。', 'Nihongo no denwa wa, mada jishin ga arimasen.', 'Nghe gọi điện tiếng Nhật thì tôi chưa tự tin.'),
      ],
    },
    { t: 'h', text: 'Slide 3 — Thể khả năng: bảng đổi đuôi' },
    {
      t: 'table',
      caption: 'Giáo viên viết hai cột trên bảng — lớp đọc to theo hàng',
      head: ['ます', '→ khả năng', 'Romaji'],
      rows: [
        ['か**き**ます', 'か**け**ます', 'kakemasu'],
        ['はな**し**ます', 'はな**せ**ます', 'hanasemasu'],
        ['よ**み**ます', 'よ**め**ます', 'yomemasu'],
        ['かえ**り**ます', 'かえ**れ**ます', 'kaeremasu'],
        ['か**い**ます', 'か**え**ます', 'kaemasu'],
        ['たべます', 'たべ**られ**ます', 'taberaremasu'],
        ['おきます', 'おき**られ**ます', 'okiraremasu'],
        ['します', '**できます**', 'dekimasu'],
        ['きます', '**こられます**', 'koraremasu'],
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**を → が**: {漢字|かんじ}**を**{読|よ}みます → {漢字|かんじ}**が**{読|よ}めます.',
        '**Hai nghĩa**: năng lực ({泳|およ}げます — biết bơi) và hoàn cảnh (ここでカードが{使|つか}えます — ở đây dùng được thẻ).',
        '**{見|み}えます／{聞|き}こえます** ≠ **{見|み}られます／{聞|き}けます**: tự thấy / tự nghe ↔ có điều kiện để xem / nghe.',
      ],
    },
    {
      t: 'quiz',
      id: 'b16-b1-chia',
      title: 'Luyện nhanh — chia thể khả năng ます (8 câu)',
      kind: 'fill',
      items: [
        { q: '{泳|およ}ぎます →', answers: V('{泳|およ}げます') },
        { q: '{待|ま}ちます →', answers: V('{待|ま}てます') },
        { q: '{遊|あそ}びます →', answers: V('{遊|あそ}べます') },
        { q: '{働|はたら}きます →', answers: V('{働|はたら}けます') },
        { q: '{覚|おぼ}えます →', answers: V('{覚|おぼ}えられます') },
        { q: '{着|き}ます →', answers: V('{着|き}られます') },
        { q: '{来|き}ます →', answers: V('{来|こ}られます') },
        { q: '{予約|よやく}します →', answers: V('{予約|よやく}できます') },
      ],
    },
    { t: 'h', text: 'Slide 4 — Hội thoại ① và チャレンジ luyện cặp' },
    DL('Mẫu luyện cặp (thay phần in đậm trong bảng dưới)', [
      ['{店長|てんちょう}', 'examiner', '{何曜日|なんようび}に{来|こ}られますか。', 'Nan\'youbi ni koraremasu ka.', 'Em đến được thứ mấy?'],
      ['{学生|がくせい}', 'b', '{月曜日|げつようび}と{土曜日|どようび}に{来|こ}られます。', 'Getsuyoubi to doyoubi ni koraremasu.', 'Em đến được thứ Hai và thứ Bảy.'],
      ['{店長|てんちょう}', 'examiner', '{漢字|かんじ}は{読|よ}めますか。', 'Kanji wa yomemasu ka.', 'Em đọc được chữ Hán không?'],
      ['{学生|がくせい}', 'b', '{簡単|かんたん}な{漢字|かんじ}は{読|よ}めます。', 'Kantan na kanji wa yomemasu.', 'Chữ đơn giản thì em đọc được.'],
      ['{店長|てんちょう}', 'examiner', '{夜|よる}は{何時|なんじ}まで{働|はたら}けますか。', 'Yoru wa nanji made hatarakemasu ka.', 'Buổi tối em làm được đến mấy giờ?'],
      ['{学生|がくせい}', 'b', '{10時|じゅうじ}まで{働|はたら}けます。', 'Juuji made hatarakemasu.', 'Em làm được đến 10 giờ.'],
    ]),
    {
      t: 'table',
      caption: 'チャレンジ — đổi vai, thay từ',
      head: ['Câu hỏi', 'Từ thay', 'Câu trả lời mẫu'],
      rows: [
        ['{何曜日|なんようび}に{来|こ}られますか', '{火曜日|かようび}／{金曜日|きんようび}／{土日|どにち}', '{火曜日|かようび}と{金曜日|きんようび}に{来|こ}られます。'],
        ['～は{話|はな}せますか', '{英語|えいご}／{中国語|ちゅうごくご}／{敬語|けいご}', '{英語|えいご}は{少|すこ}し{話|はな}せます。'],
        ['～は{作|つく}れますか', 'ベトナム{料理|りょうり}／ケーキ', 'ベトナム{料理|りょうり}が{作|つく}れます。'],
        ['{朝|あさ}～{時|じ}に{起|お}きられますか', '6／7', 'はい、{6時|ろくじ}に{起|お}きられます。'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 1)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '「{書|か}きます」の{可能形|かのうけい}は{何|なん}ですか。', ro: '"Kakimasu" no kanoukei wa nan desu ka.', vi: 'Thể khả năng của 書きます là gì?' },
        { who: 'Bạn', role: 'candidate', text: '「{書|か}けます」です。', ro: '"Kakemasu" desu.', vi: 'Là 書けます ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「{来|き}ます」は？', ro: '"Kimasu" wa?', vi: 'Còn 来ます?' },
        { who: 'Bạn', role: 'candidate', text: '「{来|こ}られます」です。', ro: '"Koraremasu" desu.', vi: 'Là 来られます ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{泳|およ}げますか。', ro: 'Oyogemasu ka.', vi: 'Em bơi được không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{少|すこ}し{泳|およ}げます。／いいえ、{泳|およ}げません。', ro: 'Hai, sukoshi oyogemasu. / Iie, oyogemasen.', vi: 'Vâng, em bơi được một chút. / Không, em không biết bơi.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{日本語|にほんご}で{何|なに}ができますか。', ro: 'Nihongo de nani ga dekimasu ka.', vi: 'Em làm được gì bằng tiếng Nhật?' },
        { who: 'Bạn', role: 'candidate', text: '{買|か}い{物|もの}ができます。{簡単|かんたん}なメールも{書|か}けます。', ro: 'Kaimono ga dekimasu. Kantan na meeru mo kakemasu.', vi: 'Em mua sắm được. Email đơn giản em cũng viết được.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「{窓|まど}から{山|やま}が___」— {見|み}えます？{見|み}られます？', ro: '"Mado kara yama ga ___" — miemasu? miraremasu?', vi: '"Từ cửa sổ ___ núi" — 見えます hay 見られます?' },
        { who: 'Bạn', role: 'candidate', text: '「{見|み}えます」です。{自然|しぜん}に{目|め}に{入|はい}りますから。', ro: '"Miemasu" desu. Shizen ni me ni hairimasu kara.', vi: 'Là 見えます ạ. Vì tự nhiên lọt vào mắt.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b16-b1-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: '{私|わたし}は{漢字|かんじ}（　）{少|すこ}し{書|か}けます。', options: ['を', 'が', 'に', 'へ'], correct: 1, why: 'Thể khả năng → **が**. 〔Watashi wa kanji ga sukoshi kakemasu.〕' },
        { q: '{明日|あした}、{6時|ろくじ}に（　）か。', options: ['{起|お}きれます', '{起|お}きられます', '{起|お}けます', '{起|お}きらります'], correct: 1, why: 'Nhóm 2: **{起|お}きられます**. 〔Ashita, rokuji ni okiraremasu ka.〕' },
        { q: 'アルバイトを（　）しています。({店|みせ} tuyển người)', options: ['{応募|おうぼ}', '{募集|ぼしゅう}', '{連絡|れんらく}', '{面接|めんせつ}'], correct: 1, why: 'Bên tuyển: **{募集|ぼしゅう}**. 〔Arubaito o boshuu shite imasu.〕' },
        { q: '{隣|となり}の{部屋|へや}から{音|おと}が（　）。', options: ['{聞|き}けます', '{聞|き}こえます', '{聞|き}きます', '{聞|き}かれます'], correct: 1, why: 'Âm thanh tự đến tai → **{聞|き}こえます**. 〔Tonari no heya kara oto ga kikoemasu.〕' },
        { q: '{英語|えいご}が（　）{人|ひと}を{探|さが}しています。', options: ['{話|はな}せる', '{話|はな}せます', '{話|はな}そう', '{話|はな}すつもり'], correct: 0, why: 'Trước danh từ dùng **thể thường**: {話|はな}せる{人|ひと}. 〔Eigo ga hanaseru hito o sagashite imasu.〕' },
      ],
    },
  ],
};

const BUOI_2: Lesson = {
  id: 'b16-buoi-2-y-chi',
  kind: 'review',
  title: 'Buổi 2 — Ở chỗ làm: từ mới công việc · thể ý chí · ～（よ）うと思っています',
  goal: 'Ôn nhanh thể khả năng, học 15 từ ở chỗ làm, chia thể ý chí và dùng nó để rủ bạn / đề nghị giúp kiểu thân mật, nói dự định bằng ～（よ）うと思います／思っています, đóng vai ngày đầu đi làm.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 2 học gì',
      items: [
        '**Ôn đầu giờ (5′)** — giáo viên đọc thể ます, lớp đổi sang thể khả năng.',
        '**Từ mới (10′)** — nhóm B: レジを打つ・運ぶ・並べる・片付ける・覚える・守る・遅刻・休憩・交代…',
        '**Ngữ pháp (15′)** — thể ý chí: 行こう／食べよう／しよう／来よう; ～（よ）うか; ～（よ）うと{思|おも}います／{思|おも}っています.',
        '**Hội thoại (10′)** — ③ ngày đầu ở cửa hàng tiện lợi.',
        '**チャレンジ (10′)** — "Kỳ nghỉ này bạn định làm gì?" hỏi 3 bạn, báo cáo lại bằng ～と{思|おも}っています.',
      ],
    },
    { t: 'h', text: 'Slide 1 — Ôn đầu giờ: thể khả năng' },
    {
      t: 'quiz',
      id: 'b16-b2-on',
      title: 'Giáo viên đọc — bạn đổi sang thể khả năng (6 câu)',
      kind: 'fill',
      items: [
        { q: '{運|はこ}びます →', answers: V('{運|はこ}べます') },
        { q: '{守|まも}ります →', answers: V('{守|まも}れます') },
        { q: '{並|なら}べます →', answers: V('{並|なら}べられます') },
        { q: '{打|う}ちます →', answers: V('{打|う}てます') },
        { q: '{休憩|きゅうけい}します →', answers: V('{休憩|きゅうけい}できます') },
        { q: '{数|かぞ}えます →', answers: V('{数|かぞ}えられます') },
      ],
    },
    { t: 'h', text: 'Slide 2 — Từ mới: việc ở cửa hàng' },
    {
      t: 'table',
      caption: 'Giáo viên vừa làm động tác vừa nói — lớp đoán từ',
      head: ['Động tác', 'Từ', 'Romaji', 'Câu'],
      rows: [
        ['bấm máy tính tiền', 'レジを{打|う}つ', 'reji o utsu', 'レジを{打|う}ちます。'],
        ['bưng khay', '{運|はこ}ぶ', 'hakobu', '{料理|りょうり}を{運|はこ}びます。'],
        ['xếp chai lên kệ', '{並|なら}べる', 'naraberu', '{棚|たな}に{飲|の}み{物|もの}を{並|なら}べます。'],
        ['dọn bàn', '{片付|かたづ}ける', 'katazukeru', 'テーブルを{片付|かたづ}けます。'],
        ['đếm tiền', '{数|かぞ}える', 'kazoeru', 'お{金|かね}を{数|かぞ}えます。'],
        ['chỉ đồng hồ, lắc đầu', '{遅刻|ちこく}する', 'chikoku suru', '{遅刻|ちこく}しないでください。'],
        ['uống trà, duỗi tay', '{休憩|きゅうけい}する', 'kyuukei suru', '{3時|さんじ}から{休憩|きゅうけい}します。'],
        ['đưa chìa khoá cho người khác', '{交代|こうたい}する', 'koutai suru', '{6時|ろくじ}に{交代|こうたい}します。'],
      ],
    },
    { t: 'h', text: 'Slide 3 — Thể ý chí: ～ましょう nói với bạn' },
    {
      t: 'table',
      caption: 'Lịch sự → thân mật (giáo viên che cột phải, lớp đoán)',
      head: ['～ましょう', '→ thể ý chí', 'Romaji'],
      rows: [
        ['{行|い}きましょう', '{行|い}こう', 'ikou'],
        ['{帰|かえ}りましょう', '{帰|かえ}ろう', 'kaerou'],
        ['{待|ま}ちましょう', '{待|ま}とう', 'matou'],
        ['{食|た}べましょう', '{食|た}べよう', 'tabeyou'],
        ['{休憩|きゅうけい}しましょう', '{休憩|きゅうけい}しよう', 'kyuukei shiyou'],
        ['また{来|き}ましょう', 'また{来|こ}よう', 'mata koyou'],
        ['{手伝|てつだ}いましょうか', '{手伝|てつだ}おうか', 'tetsudaou ka'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'V(ý chí) と{思|おも}っています',
          vi: 'Dự định đã ấp ủ. Giáo viên luôn hỏi: 「{週末|しゅうまつ}は{何|なに}をしようと{思|おも}っていますか」.',
          examples: [
            E('{週末|しゅうまつ}は{部屋|へや}を{片付|かたづ}けようと{思|おも}っています。', 'Shuumatsu wa heya o katazukeyou to omotte imasu.', 'Cuối tuần tôi đang tính dọn phòng.'),
            E('{来月|らいげつ}からコンビニでバイトを{始|はじ}めようと{思|おも}っています。', 'Raigetsu kara konbini de baito o hajimeyou to omotte imasu.', 'Từ tháng sau tôi tính bắt đầu làm thêm ở cửa hàng tiện lợi.'),
            E('{今日|きょう}は{早|はや}く{帰|かえ}ろうと{思|おも}います。', 'Kyou wa hayaku kaerou to omoimasu.', 'Hôm nay tôi định về sớm. (vừa quyết → 思います)'),
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên gài bẫy: 行くと思います ↔ 行こうと思います',
      items: [
        '{明日|あした}、マルコさんは{来|く}る**と{思|おも}います** — tôi ĐOÁN Marco sẽ đến.',
        '{明日|あした}、{私|わたし}は{行|い}こう**と{思|おも}います** — tôi ĐỊNH đi.',
        'Kể ý định của Marco: マルコさんは{来|こ}ようと**{思|おも}っています** (không dùng ~~思います~~).',
      ],
    },
    { t: 'h', text: 'Slide 4 — Hội thoại ③ và チャレンジ' },
    DL('Luyện cặp — đồng nghiệp thân (thay phần in đậm)', [
      ['A', 'a', 'もう{2時|にじ}だね。{休憩|きゅうけい}しようか。', 'Mou niji da ne. Kyuukei shiyou ka.', '2 giờ rồi nhỉ. Nghỉ giải lao nhé?'],
      ['B', 'c', 'うん、しよう。{何|なに}か{飲|の}もう。', 'Un, shiyou. Nanika nomou.', 'Ừ, nghỉ thôi. Uống gì đi.'],
      ['A', 'a', 'その{箱|はこ}、{重|おも}いね。{運|はこ}ぼうか。', 'Sono hako, omoi ne. Hakobou ka.', 'Cái thùng đó nặng nhỉ. Để mình bưng nhé?'],
      ['B', 'c', 'ありがとう。じゃ、{一緒|いっしょ}に{運|はこ}ぼう。', 'Arigatou. Ja, issho ni hakobou.', 'Cảm ơn. Vậy cùng bưng nhé.'],
    ]),
    {
      t: 'table',
      caption: 'チャレンジ — hỏi 3 bạn rồi báo cáo với cả lớp',
      head: ['Hỏi', 'Bạn trả lời', 'Bạn báo cáo lại'],
      rows: [
        ['{冬休|ふゆやす}みは{何|なに}をしようと{思|おも}っていますか。', 'スキーに{行|い}こうと{思|おも}っています。', 'カルロスさんは{冬休|ふゆやす}みにスキーに{行|い}こうと{思|おも}っています。'],
        ['{週末|しゅうまつ}は？', '{家|うち}で{休|やす}もうと{思|おも}っています。', 'パクさんは{週末|しゅうまつ}、{家|うち}で{休|やす}もうと{思|おも}っています。'],
        ['{来年|らいねん}は？', 'N3を{受|う}けようと{思|おも}っています。', 'ワンさんは{来年|らいねん}N3を{受|う}けようと{思|おも}っています。'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 2)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '「{帰|かえ}ります」の{意向形|いこうけい}は？', ro: '"Kaerimasu" no ikoukei wa?', vi: 'Thể ý chí của 帰ります?' },
        { who: 'Bạn', role: 'candidate', text: '「{帰|かえ}ろう」です。', ro: '"Kaerou" desu.', vi: 'Là 帰ろう ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「します」と「{来|き}ます」は？', ro: '"Shimasu" to "kimasu" wa?', vi: 'Còn します và 来ます?' },
        { who: 'Bạn', role: 'candidate', text: '「しよう」と「{来|こ}よう」です。', ro: '"Shiyou" to "koyou" desu.', vi: 'Là しよう và 来よう ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{週末|しゅうまつ}は{何|なに}をしようと{思|おも}っていますか。', ro: 'Shuumatsu wa nani o shiyou to omotte imasu ka.', vi: 'Cuối tuần em đang tính làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{友達|ともだち}と{買|か}い{物|もの}に{行|い}こうと{思|おも}っています。', ro: 'Tomodachi to kaimono ni ikou to omotte imasu.', vi: 'Em tính đi mua sắm với bạn ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{友達|ともだち}に「{一緒|いっしょ}に{帰|かえ}りましょう」を{友達言葉|ともだちことば}で{言|い}ってください。', ro: 'Tomodachi ni "issho ni kaerimashou" o tomodachi kotoba de itte kudasai.', vi: 'Hãy nói "cùng về nhé" với bạn bằng lời nói thân mật.' },
        { who: 'Bạn', role: 'candidate', text: '「{一緒|いっしょ}に{帰|かえ}ろう」。', ro: '"Issho ni kaerou."', vi: '"Cùng về nhé."' },
      ],
    },
    {
      t: 'mcq',
      id: 'b16-b2-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: '{遅|おそ}いから、タクシーで（　）。', options: ['{帰|かえ}ろう', '{帰|かえ}りよう', '{帰|かえ}れよう', '{帰|かえ}るよう'], correct: 0, why: 'Nhóm 1: り → **ろう**. 〔Osoi kara, takushii de kaerou.〕' },
        { q: '{明日|あした}も{一緒|いっしょ}に（　）か。(thân mật)', options: ['{勉強|べんきょう}しよう', '{勉強|べんきょう}すろう', '{勉強|べんきょう}できよう', '{勉強|べんきょう}しろう'], correct: 0, why: 'する → **しよう**. 〔Ashita mo issho ni benkyou shiyou ka.〕' },
        { q: '{来月|らいげつ}からジョギングを（　）と{思|おも}っています。', options: ['{始|はじ}める', '{始|はじ}めよう', '{始|はじ}められる', '{始|はじ}めた'], correct: 1, why: 'Ý định → **{始|はじ}めよう**と{思|おも}っています. 〔Raigetsu kara jogingu o hajimeyou to omotte imasu.〕' },
        { q: 'マルコさんは{夏休|なつやす}みに{国|くに}へ{帰|かえ}ろうと（　）。', options: ['{思|おも}います', '{思|おも}っています', '{思|おも}いましょう', '{思|おも}おう'], correct: 1, why: 'Ngôi thứ ba → **{思|おも}っています**.' },
        { q: 'お{客様|きゃくさま}が{帰|かえ}ったら、テーブルを（　）ください。', options: ['{片付|かたづ}けて', '{数|かぞ}えて', '{守|まも}って', '{交代|こうたい}して'], correct: 0, why: '**テーブルを{片付|かたづ}ける** = dọn bàn. 〔Okyakusama ga kaettara, teeburu o katazukete kudasai.〕' },
      ],
    },
  ],
};

const BUOI_3: Lesson = {
  id: 'b16-buoi-3-tsumori',
  kind: 'review',
  title: 'Buổi 3 — Tương lai: từ mới kế hoạch · ～つもりです · ～予定です · tự giới thiệu 1 phút',
  goal: 'Học 14 từ về tương lai, nói ý định bằng ～つもりです／～ないつもりです, lịch đã định bằng ～予定です, phân biệt ba cách nói dự định, đọc 15 chữ Hán mới và trình bày tự giới thiệu 1 phút khi phỏng vấn làm thêm.',
  minutes: 55,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 3 học gì',
      items: [
        '**Ôn đầu giờ (5′)** — giáo viên hỏi ～（よ）うと{思|おも}っていますか, 3 bạn trả lời.',
        '**Từ mới (10′)** — nhóm D: 将来・夢・予定・計画・決める・考える・就職・正社員・進学・大学院・帰国・貯める・試験・合格.',
        '**Ngữ pháp (15′)** — ～つもりです／ないつもりです／つもりはありません; ～予定です; bảng phân biệt.',
        '**Hội thoại (5′)** — ② kế hoạch nghỉ hè và sau tốt nghiệp.',
        '**Chữ Hán (10′)** — 15 chữ mới, đọc từ trên bảng không furigana.',
        '**できる！ (10′)** — mỗi bạn tự giới thiệu 1 phút như đi phỏng vấn làm thêm.',
      ],
    },
    { t: 'h', text: 'Slide 1 — Từ mới: con đường sau tốt nghiệp' },
    {
      t: 'table',
      caption: 'Giáo viên vẽ sơ đồ trên bảng: 卒業 → hai ngả',
      head: ['Ngả', 'Từ', 'Romaji', 'Câu'],
      rows: [
        ['Đi làm', '{就職|しゅうしょく}する · {正社員|せいしゃいん}', 'shuushoku suru · seishain', '{日本|にほん}の{会社|かいしゃ}に{就職|しゅうしょく}して、{正社員|せいしゃいん}になりたいです。'],
        ['Học tiếp', '{進学|しんがく}する · {大学院|だいがくいん}', 'shingaku suru · daigakuin', '{大学院|だいがくいん}に{進学|しんがく}するつもりです。'],
        ['Về nước', '{帰国|きこく}する', 'kikoku suru', '{来年|らいねん}{帰国|きこく}する{予定|よてい}です。'],
        ['Chuẩn bị', '{試験|しけん}・{合格|ごうかく}・お{金|かね}を{貯|た}める', 'shiken · goukaku · tameru', 'N3に{合格|ごうかく}しようと{思|おも}っています。'],
        ['Suy nghĩ', '{将来|しょうらい}・{夢|ゆめ}・{計画|けいかく}・{考|かんが}える・{決|き}める', 'shourai · yume · keikaku · kangaeru · kimeru', '{将来|しょうらい}のことをよく{考|かんが}えて{決|き}めます。'],
      ],
    },
    { t: 'h', text: 'Slide 2 — ～つもりです và ～予定です' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'V{辞書形|じしょけい}／Vない ＋ つもりです',
          vi: 'Ý định đã quyết. Phủ nhận mạnh: ～つもりはありません.',
          examples: [
            E('{卒業|そつぎょう}したら、{国|くに}へ{帰|かえ}るつもりです。', 'Sotsugyou shitara, kuni e kaeru tsumori desu.', 'Tốt nghiệp xong tôi định về nước.'),
            E('{今年|ことし}の{夏|なつ}は{帰|かえ}らないつもりです。', 'Kotoshi no natsu wa kaeranai tsumori desu.', 'Hè năm nay tôi định không về.'),
            E('{日本語|にほんご}の{勉強|べんきょう}をやめるつもりはありません。', 'Nihongo no benkyou o yameru tsumori wa arimasen.', 'Tôi không hề có ý định bỏ học tiếng Nhật.'),
          ],
        },
        {
          formula: 'V{辞書形|じしょけい}／Nの ＋ {予定|よてい}です',
          vi: 'Lịch đã định sẵn — dùng được cho sự việc, tổ chức, tàu xe.',
          examples: [
            E('{試験|しけん}は{12月|じゅうにがつ}{1日|ついたち}の{予定|よてい}です。', 'Shiken wa juunigatsu tsuitachi no yotei desu.', 'Kỳ thi dự kiến ngày 1 tháng 12.'),
            E('{来週|らいしゅう}、{面接|めんせつ}を{受|う}ける{予定|よてい}です。', 'Raishuu, mensetsu o ukeru yotei desu.', 'Tuần sau tôi có lịch phỏng vấn.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Giáo viên chốt bằng thang độ chắc chắn',
      head: ['', '(よ)うと{思|おも}っています', 'つもりです', '{予定|よてい}です'],
      rows: [
        ['Độ chắc', 'đang tính', 'đã quyết', 'đã lên lịch'],
        ['Chủ thể', 'người', 'người', 'người, sự việc, tàu xe…'],
        ['Hỏi thầy cô', '～と{思|おも}っていらっしゃいますか (Bài 24)', '✗ tránh', '✓ ～{予定|よてい}ですか'],
      ],
    },
    {
      t: 'mcq',
      id: 'b16-b3-chon',
      title: 'Luyện — chọn cách nói dự định đúng (5 câu)',
      items: [
        { q: 'バスは{9時|くじ}に{出|で}る（　）です。', options: ['つもり', '{予定|よてい}', 'たい'], correct: 1, why: 'Xe buýt không có ý định → **{予定|よてい}**.' },
        { q: '{絶対|ぜったい}にたばこは{吸|す}わない（　）です。', options: ['つもり', '{予定|よてい}', 'たい'], correct: 0, why: 'Quyết tâm của bản thân → **つもり**.' },
        { q: '{先生|せんせい}、{来週|らいしゅう}の{授業|じゅぎょう}は{何時|なんじ}からの（　）ですか。', options: ['つもり', '{予定|よてい}', 'よう'], correct: 1, why: 'Hỏi thầy cô về lịch → **{予定|よてい}**. 〔Sensei, raishuu no jugyou wa nanji kara no yotei desu ka.〕' },
        { q: '{会社|かいしゃ}を{辞|や}める（　）はありません。', options: ['つもり', 'ため', 'よう'], correct: 0, why: '**つもりはありません** — phủ nhận ý định mạnh.' },
        { q: '{冬休|ふゆやす}みはスキーに{行|い}こうと（　）。', options: ['{思|おも}っています', 'つもりです', '{予定|よてい}です'], correct: 0, why: 'Sau thể ý chí + と chỉ có **{思|おも}います／{思|おも}っています**.' },
      ],
    },
    { t: 'h', text: 'Slide 3 — Chữ Hán mới: đọc nhanh trên bảng' },
    {
      t: 'readkanji',
      id: 'b16-b3-doc-han',
      title: 'Giáo viên chỉ từ — bạn đọc (10 từ, không furigana)',
      items: [
        { text: '{面接|めんせつ}', ro: 'mensetsu', vi: 'phỏng vấn' },
        { text: '{質問|しつもん}', ro: 'shitsumon', vi: 'câu hỏi' },
        { text: '{答|こた}え', ro: 'kotae', vi: 'câu trả lời' },
        { text: '{将来|しょうらい}', ro: 'shourai', vi: 'tương lai' },
        { text: '{夢|ゆめ}', ro: 'yume', vi: 'ước mơ' },
        { text: '{考|かんが}える', ro: 'kangaeru', vi: 'suy nghĩ' },
        { text: '{決|き}める', ro: 'kimeru', vi: 'quyết định' },
        { text: '{守|まも}る', ro: 'mamoru', vi: 'tuân thủ' },
        { text: '{正社員|せいしゃいん}', ro: 'seishain', vi: 'nhân viên chính thức' },
        { text: '{食堂|しょくどう}', ro: 'shokudou', vi: 'nhà ăn' },
      ],
    },
    { t: 'h', text: 'Slide 4 — できる！ Tự giới thiệu 1 phút (phỏng vấn làm thêm)' },
    DL('Bài mẫu 1 phút — một bạn lên trình bày', [
      ['Bạn', 'b', '{失礼|しつれい}します。ベトナムから{来|き}たミンです。よろしくお{願|ねが}いします。', 'Shitsurei shimasu. Betonamu kara kita Min desu. Yoroshiku onegai shimasu.', 'Xin phép ạ. Em là Minh, đến từ Việt Nam. Mong được giúp đỡ.'],
      ['Bạn', 'b', '{日本語|にほんご}は{1年|いちねん}{勉強|べんきょう}しました。{簡単|かんたん}な{会話|かいわ}ができます。{英語|えいご}も{話|はな}せます。', 'Nihongo wa ichinen benkyou shimashita. Kantan na kaiwa ga dekimasu. Eigo mo hanasemasu.', 'Em học tiếng Nhật một năm. Em nói được hội thoại đơn giản. Tiếng Anh em cũng nói được.'],
      ['Bạn', 'b', '{火曜日|かようび}と{木曜日|もくようび}の{夕方|ゆうがた}と、{土日|どにち}に{来|こ}られます。{夜|よる}{10時|じゅうじ}まで{働|はたら}けます。', 'Kayoubi to mokuyoubi no yuugata to, donichi ni koraremasu. Yoru juuji made hatarakemasu.', 'Em đến được chiều tối thứ Ba, thứ Năm và thứ Bảy, Chủ nhật. Em làm được đến 10 giờ tối.'],
      ['Bạn', 'b', '{将来|しょうらい}、{日本|にほん}の{会社|かいしゃ}で{働|はたら}くつもりですから、ここで{敬語|けいご}を{勉強|べんきょう}したいです。', 'Shourai, Nihon no kaisha de hataraku tsumori desu kara, koko de keigo o benkyou shitai desu.', 'Sau này em định làm ở công ty Nhật nên em muốn học kính ngữ ở đây.'],
      ['Bạn', 'b', '{一生懸命|いっしょうけんめい}{頑張|がんば}ります。よろしくお{願|ねが}いします。', 'Isshoukenmei ganbarimasu. Yoroshiku onegai shimasu.', 'Em sẽ cố gắng hết sức. Mong được giúp đỡ.'],
    ]),
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 3)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{卒業|そつぎょう}したら、どうするつもりですか。', ro: 'Sotsugyou shitara, dou suru tsumori desu ka.', vi: 'Tốt nghiệp xong em định làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{日本|にほん}の{会社|かいしゃ}に{就職|しゅうしょく}するつもりです。', ro: 'Nihon no kaisha ni shuushoku suru tsumori desu.', vi: 'Em định vào làm công ty Nhật ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{今年|ことし}、{国|くに}へ{帰|かえ}りますか。', ro: 'Kotoshi, kuni e kaerimasu ka.', vi: 'Năm nay em có về nước không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{今年|ことし}は{帰|かえ}らないつもりです。', ro: 'Iie, kotoshi wa kaeranai tsumori desu.', vi: 'Không ạ, năm nay em định không về.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{将来|しょうらい}の{夢|ゆめ}は{何|なん}ですか。', ro: 'Shourai no yume wa nan desu ka.', vi: 'Ước mơ tương lai của em là gì?' },
        { who: 'Bạn', role: 'candidate', text: '{私|わたし}の{夢|ゆめ}は{日本語|にほんご}の{先生|せんせい}になることです。', ro: 'Watashi no yume wa nihongo no sensei ni naru koto desu.', vi: 'Ước mơ của em là trở thành giáo viên tiếng Nhật.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「つもり」と「{予定|よてい}」はどう{違|ちが}いますか。', ro: '"Tsumori" to "yotei" wa dou chigaimasu ka.', vi: '"Tsumori" và "yotei" khác nhau thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '「つもり」は{自分|じぶん}の{考|かんが}えです。「{予定|よてい}」はもう{決|き}まったスケジュールです。', ro: '"Tsumori" wa jibun no kangae desu. "Yotei" wa mou kimatta sukejuuru desu.', vi: '"Tsumori" là ý định của bản thân. "Yotei" là lịch trình đã được định sẵn.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b16-b3-cuoi-bai',
      title: 'Kiểm tra cuối Bài 16 (6 câu — tổng hợp 3 buổi)',
      items: [
        { q: '{私|わたし}はまだ{漢字|かんじ}があまり（　）。', options: ['{書|か}けません', '{書|か}きません', '{書|か}こう', '{書|か}けるつもりです'], correct: 0, why: 'Năng lực, phủ định: **{書|か}けません**. 〔Watashi wa mada kanji ga amari kakemasen.〕' },
        { q: '{雨|あめ}だから、{家|うち}で{映画|えいが}を（　）よ。', options: ['{見|み}よう', '{見|み}ろう', '{見|み}えよう', '{見|み}られよう'], correct: 0, why: 'Rủ thân mật: **{見|み}よう**. 〔Ame da kara, uchi de eiga o miyou yo.〕' },
        { q: '{来年|らいねん}、N3を（　）と{思|おも}っています。', options: ['{受|う}ける', '{受|う}けよう', '{受|う}けられる', '{受|う}けた'], correct: 1, why: '**{受|う}けよう**と{思|おも}っています. 〔Rainen, enu san o ukeyou to omotte imasu.〕' },
        { q: '{飛行機|ひこうき}は{6時|ろくじ}に{着|つ}く（　）です。', options: ['つもり', '{予定|よてい}', 'ため', 'たい'], correct: 1, why: '**{予定|よてい}** — lịch của máy bay.' },
        { q: '{面接|めんせつ}を（　）。', options: ['{受|う}けます', '{答|こた}えます', '{決|き}めます', '{守|まも}ります'], correct: 0, why: '**{面接|めんせつ}を{受|う}ける** = đi phỏng vấn.' },
        { q: '「{将来|しょうらい}」の{読|よ}み{方|かた}は？', options: ['しょらい', 'しょうらい', 'じょうらい', 'しょうれい'], correct: 1, why: '**しょうらい** (shourai).' },
      ],
    },
  ],
};

/* ═══════════════════════ ③ LUYỆN THÊM — DỄ → KHÓ ═══════════════════════ */

type Mcq = Extract<Block, { t: 'mcq' }>['items'][number];

/** Bộ từ cho trắc nghiệm Nhật → Việt / Việt → Nhật (lấy đúng 50 từ của mục Từ vựng). */
const TU_LT: [w: string, ro: string, vi: string][] = [
  ['バイト', 'baito', 'việc làm thêm (nói tắt)'],
  ['{募集|ぼしゅう}', 'boshuu', 'tuyển người'],
  ['{応募|おうぼ}', 'oubo', 'ứng tuyển'],
  ['{面接|めんせつ}', 'mensetsu', 'phỏng vấn'],
  ['{履歴書|りれきしょ}', 'rirekisho', 'sơ yếu lý lịch'],
  ['{給料|きゅうりょう}', 'kyuuryou', 'tiền lương'],
  ['{交通費|こうつうひ}', 'koutsuuhi', 'tiền đi lại'],
  ['{条件|じょうけん}', 'jouken', 'điều kiện'],
  ['{都合|つごう}', 'tsugou', 'sự thuận tiện, lịch riêng'],
  ['{土日|どにち}', 'donichi', 'thứ Bảy và Chủ nhật'],
  ['{連絡|れんらく}します', 'renraku shimasu', 'liên lạc'],
  ['{受|う}けます', 'ukemasu', 'dự (thi, phỏng vấn)'],
  ['{質問|しつもん}します', 'shitsumon shimasu', 'đặt câu hỏi'],
  ['{答|こた}えます', 'kotaemasu', 'trả lời'],
  ['レジを{打|う}ちます', 'reji o uchimasu', 'tính tiền ở máy'],
  ['{運|はこ}びます', 'hakobimasu', 'mang, bưng'],
  ['{並|なら}べます', 'narabemasu', 'xếp, bày (hàng hoá)'],
  ['{片付|かたづ}けます', 'katazukemasu', 'dọn dẹp, cất gọn'],
  ['{数|かぞ}えます', 'kazoemasu', 'đếm'],
  ['{覚|おぼ}えます', 'oboemasu', 'nhớ, học thuộc'],
  ['{守|まも}ります', 'mamorimasu', 'tuân thủ, giữ'],
  ['{遅刻|ちこく}します', 'chikoku shimasu', 'đến muộn'],
  ['{休憩|きゅうけい}します', 'kyuukei shimasu', 'nghỉ giải lao'],
  ['{交代|こうたい}します', 'koutai shimasu', 'đổi ca'],
  ['{辞|や}めます', 'yamemasu', 'nghỉ (việc), thôi'],
  ['{頑張|がんば}ります', 'ganbarimasu', 'cố gắng'],
  ['{敬語|けいご}', 'keigo', 'kính ngữ'],
  ['お{客様|きゃくさま}', 'okyakusama', 'quý khách'],
  ['{丁寧|ていねい}（な）', 'teinei (na)', 'lịch sự, cẩn thận'],
  ['{得意|とくい}（な）', 'tokui (na)', 'giỏi, sở trường'],
  ['{苦手|にがて}（な）', 'nigate (na)', 'kém, ngại'],
  ['{無理|むり}（な）', 'muri (na)', 'không thể, quá sức'],
  ['{自信|じしん}', 'jishin', 'sự tự tin'],
  ['{一生懸命|いっしょうけんめい}', 'isshoukenmei', 'hết sức, chăm chỉ'],
  ['{必|かなら}ず', 'kanarazu', 'nhất định'],
  ['{将来|しょうらい}', 'shourai', 'tương lai'],
  ['{夢|ゆめ}', 'yume', 'giấc mơ, ước mơ'],
  ['{予定|よてい}', 'yotei', 'lịch đã định, dự định'],
  ['{計画|けいかく}', 'keikaku', 'kế hoạch'],
  ['{決|き}めます', 'kimemasu', 'quyết định'],
  ['{考|かんが}えます', 'kangaemasu', 'suy nghĩ'],
  ['{就職|しゅうしょく}します', 'shuushoku shimasu', 'vào làm ở công ty'],
  ['{正社員|せいしゃいん}', 'seishain', 'nhân viên chính thức'],
  ['{進学|しんがく}します', 'shingaku shimasu', 'học lên'],
  ['{大学院|だいがくいん}', 'daigakuin', 'cao học'],
  ['{帰国|きこく}します', 'kikoku shimasu', 'về nước'],
  ['{貯|た}めます', 'tamemasu', 'để dành (tiền)'],
  ['{試験|しけん}', 'shiken', 'kỳ thi'],
  ['{合格|ごうかく}します', 'goukaku shimasu', 'thi đỗ'],
  ['{週|しゅう}{3日|みっか}', 'shuu mikka', '3 ngày một tuần'],
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

/** Động từ luyện chia: thể từ điển · khả năng ます · ý chí · nhóm · ghi chú. */
const DT_LT: [tu: string, kn: string, yc: string, nhom: string][] = [
  ['{会|あ}う', '{会|あ}えます', '{会|あ}おう', '1'],
  ['{聞|き}く', '{聞|き}けます', '{聞|き}こう', '1'],
  ['{急|いそ}ぐ', '{急|いそ}げます', '{急|いそ}ごう', '1'],
  ['{貸|か}す', '{貸|か}せます', '{貸|か}そう', '1'],
  ['{立|た}つ', '{立|た}てます', '{立|た}とう', '1'],
  ['{呼|よ}ぶ', '{呼|よ}べます', '{呼|よ}ぼう', '1'],
  ['{飲|の}む', '{飲|の}めます', '{飲|の}もう', '1'],
  ['{乗|の}る', '{乗|の}れます', '{乗|の}ろう', '1'],
  ['{入|はい}る', '{入|はい}れます', '{入|はい}ろう', '1 (ngoại lệ đuôi いる/える)'],
  ['{走|はし}る', '{走|はし}れます', '{走|はし}ろう', '1 (ngoại lệ đuôi いる/える)'],
  ['{使|つか}う', '{使|つか}えます', '{使|つか}おう', '1'],
  ['{作|つく}る', '{作|つく}れます', '{作|つく}ろう', '1'],
  ['{寝|ね}る', '{寝|ね}られます', '{寝|ね}よう', '2'],
  ['{借|か}りる', '{借|か}りられます', '{借|か}りよう', '2'],
  ['{教|おし}える', '{教|おし}えられます', '{教|おし}えよう', '2'],
  ['{出|で}かける', '{出|で}かけられます', '{出|で}かけよう', '2'],
  ['{浴|あ}びる', '{浴|あ}びられます', '{浴|あ}びよう', '2'],
  ['{持|も}って{来|く}る', '{持|も}って{来|こ}られます', '{持|も}って{来|こ}よう', '3'],
  ['{掃除|そうじ}する', '{掃除|そうじ}できます', '{掃除|そうじ}しよう', '3'],
  ['{選|えら}ぶ', '{選|えら}べます', '{選|えら}ぼう', '1'],
];

const LT_1: Lesson = {
  id: 'b16-lt-1-tu-vung',
  kind: 'homework',
  title: 'Luyện thêm 1 · Từ vựng — 🟢 nhận mặt → 🟡 điền câu (40 câu)',
  goal: 'Nhớ chắc 50 từ của Bài 16 theo hai chiều (Nhật → Việt, Việt → Nhật) rồi chọn đúng từ trong câu.',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟢 Mức Dễ** — 25 câu Nhật → Việt và Việt → Nhật. Sai câu nào: đọc to từ đó 3 lần (romaji có ngay trong câu hỏi).',
        '**🟡 Mức Vừa** — 15 câu điền từ vào câu, đúng dạng 文脈規定 của đề N4.',
        'Lỗi hay mắc: {募集|ぼしゅう}↔{応募|おうぼ}, {得意|とくい}↔{上手|じょうず}, {遅刻|ちこく}↔{遅|おく}れる, {休憩|きゅうけい}↔{休|やす}み, {自信|じしん}↔{地震|じしん}.',
      ],
    },
    { t: 'h', text: '🟢 Mức 1 — Dễ: nhìn từ → nghĩa; nghe nghĩa → từ' },
    { t: 'mcq', id: 'b16-lt1-nv', title: 'Nhật → Việt (15 câu)', items: MCQ_NV(0, 15) },
    { t: 'mcq', id: 'b16-lt1-vn', title: 'Việt → Nhật (10 câu)', items: MCQ_VN(30, 40) },
    { t: 'h', text: '🟡 Mức 2 — Vừa: chọn từ hợp với câu (文脈規定)' },
    {
      t: 'mcq',
      id: 'b16-lt1-dien',
      title: 'Điền từ (15 câu)',
      items: [
        { q: '{面接|めんせつ}に（　）を{持|も}っていきます。{写真|しゃしん}も{貼|は}りました。', options: ['{履歴書|りれきしょ}', '{給料|きゅうりょう}', '{交通費|こうつうひ}', '{条件|じょうけん}'], correct: 0, why: 'Giấy dán ảnh mang đi phỏng vấn = **{履歴書|りれきしょ}**. 〔Mensetsu ni rirekisho o motte ikimasu.〕' },
        { q: 'この{店|みせ}は{電車|でんしゃ}の（　）が{出|で}ません。', options: ['{給料|きゅうりょう}', '{交通費|こうつうひ}', '{時給|じきゅう}', '{予定|よてい}'], correct: 1, why: 'Tiền tàu = **{交通費|こうつうひ}**; ～が{出|で}る = được chi. 〔Kono mise wa densha no koutsuuhi ga demasen.〕' },
        { q: 'すみません、{金曜日|きんようび}は（　）が{悪|わる}いです。', options: ['{都合|つごう}', '{条件|じょうけん}', '{自信|じしん}', '{計画|けいかく}'], correct: 0, why: '**{都合|つごう}が{悪|わる}い** = không tiện. 〔Kin\'youbi wa tsugou ga warui desu.〕' },
        { q: '{面接|めんせつ}の{結果|けっか}は{電話|でんわ}で（　）します。', options: ['{連絡|れんらく}', '{応募|おうぼ}', '{質問|しつもん}', '{交代|こうたい}'], correct: 0, why: 'Báo kết quả = **{連絡|れんらく}する**. 〔Mensetsu no kekka wa denwa de renraku shimasu.〕' },
        { q: 'インターネットでアルバイトに（　）しました。', options: ['{募集|ぼしゅう}', '{応募|おうぼ}', '{合格|ごうかく}', '{就職|しゅうしょく}'], correct: 1, why: 'Người xin việc → **{応募|おうぼ}する** (N に). 〔Intaanetto de arubaito ni oubo shimashita.〕' },
        { q: '{閉店|へいてん}のあとで、お{金|かね}を（　）。', options: ['{数|かぞ}えます', '{並|なら}べます', '{守|まも}ります', '{考|かんが}えます'], correct: 0, why: 'Đếm tiền = **{数|かぞ}える**. 〔Heiten no ato de, okane o kazoemasu.〕' },
        { q: '{棚|たな}にお{菓子|かし}をきれいに（　）ください。', options: ['{片付|かたづ}けて', '{並|なら}べて', '{数|かぞ}えて', '{運|はこ}んで'], correct: 1, why: 'Bày hàng lên kệ cho đẹp = **{並|なら}べる**. 〔Tana ni okashi o kirei ni narabete kudasai.〕' },
        { q: '{新|あたら}しい{仕事|しごと}が{多|おお}くて、なかなか（　）。', options: ['{覚|おぼ}えられません', '{遅刻|ちこく}できません', '{休憩|きゅうけい}しません', '{合格|ごうかく}しません'], correct: 0, why: 'Việc nhiều → mãi **không nhớ được**. 〔Atarashii shigoto ga ookute, nakanaka oboeraremasen.〕' },
        { q: '{寝坊|ねぼう}して、{授業|じゅぎょう}に（　）しました。', options: ['{遅刻|ちこく}', '{休憩|きゅうけい}', '{交代|こうたい}', '{連絡|れんらく}'], correct: 0, why: 'Ngủ quên → **{遅刻|ちこく}** (đến muộn). {寝坊|ねぼう} = ngủ quên. 〔Nebou shite, jugyou ni chikoku shimashita.〕' },
        { q: '{私|わたし}は{人|ひと}の{前|まえ}で{話|はな}すことが（　）です。{緊張|きんちょう}します。', options: ['{得意|とくい}', '{苦手|にがて}', '{丁寧|ていねい}', '{大切|たいせつ}'], correct: 1, why: 'Hồi hộp khi nói trước đám đông → **{苦手|にがて}**. 〔Watashi wa hito no mae de hanasu koto ga nigate desu.〕' },
        { q: '{毎日|まいにち}{12時間|じゅうにじかん}{働|はたら}くのは（　）です。', options: ['{無理|むり}', '{得意|とくい}', '{丁寧|ていねい}', '{必|かなら}ず'], correct: 0, why: '12 tiếng mỗi ngày → **{無理|むり}** (quá sức). 〔Mainichi juuni jikan hataraku no wa muri desu.〕' },
        { q: '{来年|らいねん}、{大学院|だいがくいん}に（　）するつもりです。', options: ['{就職|しゅうしょく}', '{進学|しんがく}', '{帰国|きこく}', '{合格|ごうかく}'], correct: 1, why: 'Lên cao học = **{進学|しんがく}** (N に{進学|しんがく}する). 〔Rainen, daigakuin ni shingaku suru tsumori desu.〕' },
        { q: 'アルバイトでお{金|かね}を（　）、{車|くるま}を{買|か}いました。', options: ['{貯|た}めて', '{決|き}めて', '{辞|や}めて', '{受|う}けて'], correct: 0, why: '**お{金|かね}を{貯|た}める**. 〔Arubaito de okane o tamete, kuruma o kaimashita.〕' },
        { q: '{旅行|りょこう}の（　）を{立|た}てています。', options: ['{計画|けいかく}', '{夢|ゆめ}', '{試験|しけん}', '{自信|じしん}'], correct: 0, why: '**{計画|けいかく}を{立|た}てる** = lập kế hoạch. 〔Ryokou no keikaku o tatete imasu.〕' },
        { q: '{卒業|そつぎょう}したら、{正社員|せいしゃいん}として{会社|かいしゃ}に（　）したいです。', options: ['{就職|しゅうしょく}', '{進学|しんがく}', '{応募|おうぼ}', '{募集|ぼしゅう}'], correct: 0, why: 'Vào làm công ty = **{就職|しゅうしょく}**. 〔Sotsugyou shitara, seishain to shite kaisha ni shuushoku shitai desu.〕' },
      ],
    },
  ],
};

const LT_2: Lesson = {
  id: 'b16-lt-2-han-tu',
  kind: 'homework',
  title: 'Luyện thêm 2 · Chữ Hán — 🟢 đọc → 🟡 chọn chữ → 🔴 câu không furigana (22 câu)',
  goal: 'Đọc và viết đúng 15 chữ Hán mới trong từ: chọn cách đọc, chọn chữ đúng cho từ viết kana, phân biệt chữ trông giống.',
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
      id: 'b16-lt2-doc',
      title: '🟢 Đọc từ (10 câu)',
      items: [
        { q: '**{答|こた}え**はBです。', options: ['こたえ', 'かんがえ', 'おぼえ', 'こたい'], correct: 0, why: '答え = **こたえ** (kotae).' },
        { q: '**{問題|もんだい}**が{難|むずか}しいです。', options: ['もんだい', 'もんたい', 'ぶんだい', 'もうだい'], correct: 0, why: '問題 = **もんだい** (mondai).' },
        { q: '{兄|あに}は**{工場|こうじょう}**で{働|はたら}いています。', options: ['こうば', 'こうじょう', 'くじょう', 'こうちょう'], correct: 1, why: '工場 = **こうじょう** (koujou).' },
        { q: '**{意味|いみ}**がわかりません。', options: ['いみ', 'いし', 'あじ', 'いみい'], correct: 0, why: '意味 = **いみ** (imi).' },
        { q: '**{時代|じだい}**が{変|か}わりました。', options: ['じたい', 'じだい', 'じかん', 'ときだい'], correct: 1, why: '時代 = **じだい** (jidai) — 代 đọc ダイ.' },
        { q: '**{用意|ようい}**ができました。', options: ['ようい', 'ようじ', 'よい', 'ようき'], correct: 0, why: '用意 = **ようい** (youi) — chuẩn bị.' },
        { q: '**{正|ただ}**しいのはどれですか。', options: ['ただ', 'せい', 'ほん', 'まさ'], correct: 0, why: '正しい = **ただしい** (tadashii).' },
        { q: '**{夢中|むちゅう}**でゲームをしています。', options: ['ゆめなか', 'むちゅう', 'むじゅう', 'ぼうちゅう'], correct: 1, why: '夢中 = **むちゅう** (muchuu) — say mê; 夢 đọc ム trong từ ghép.' },
        { q: '{先生|せんせい}が「**{注意|ちゅうい}**してください」と{言|い}いました。', options: ['ちゅうい', 'ちゅい', 'じゅうい', 'ちゅうき'], correct: 0, why: '注意 = **ちゅうい** (chuui) — chú ý, cẩn thận.' },
        { q: '{兄|あに}は**{将棋|しょうぎ}**が{得意|とくい}です。', options: ['しょうぎ', 'しょぎ', 'じょうぎ', 'しょうき'], correct: 0, why: '将棋 = **しょうぎ** (shougi) — cờ tướng Nhật.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b16-lt2-chon',
      title: '🟡 Chọn chữ đúng (8 câu)',
      items: [
        { q: '{電車|でんしゃ}の**こうたい** — chữ đúng?', options: ['交代', '交待', '校代', '交台'], correct: 0, why: '**交代** — 代 (thay). 待 là "đợi", 台 là "đài".' },
        { q: '**めんせつ**を{受|う}けます。', options: ['面切', '面接', '面節', '綿接'], correct: 1, why: '**面接**.' },
        { q: '{時間|じかん}を**まもって**ください。', options: ['守って', '待って', '持って', '寺って'], correct: 0, why: '**守って** — 宀 + 寸. 寺 (chùa) có 土 trên 寸.' },
        { q: '**せいしゃいん**になりたいです。', options: ['生社員', '正社員', '成社員', '正者員'], correct: 1, why: '**正社員** — 正 (chính thức).' },
        { q: '{旅行|りょこう}の{日|ひ}を**きめ**ました。', options: ['決め', '快め', '次め', '結め'], correct: 0, why: '**決め** — 氵 bên trái.' },
        { q: 'よく**かんがえて**ください。', options: ['考えて', '孝えて', '老えて', '数えて'], correct: 0, why: '**考えて**.' },
        { q: '**しつもん**に{答|こた}えます。', options: ['質問', '質門', '湿問', '質間'], correct: 0, why: '**質問** — 問 có 口 trong 門; 間 có 日.' },
        { q: '{大学|だいがく}の**しょくどう**', options: ['食道', '食堂', '食当', '食党'], correct: 1, why: '**食堂** (nhà ăn). 食道 = thực quản.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b16-lt2-kho',
      title: '🔴 Chữ trông giống / đồng âm (4 câu)',
      items: [
        { q: 'Câu nào dùng chữ ĐÚNG?', options: ['{地震|じしん}があって、{自信|じしん}がなくなりました。(cả hai đều đúng chỗ)', '{自信|じしん}があって、{地震|じしん}が{起|お}きました。', '{地震|じしん}に{自信|じしん}があります。', '{自信|じしん}が{起|お}きました。'], correct: 0, why: '{地震|じしん} (động đất) **起きる／ある**; {自信|じしん} (tự tin) **ある／ない／なくなる**. Câu 1: "Có động đất nên tôi mất tự tin" — dùng đúng cả hai.' },
        { q: '「{問|と}い」と「{間|あいだ}」 — chữ nào có nghĩa "hỏi"?', options: ['問', '間', '門', '聞'], correct: 0, why: '**問** = 門 + 口 (hỏi). 間 = 門 + 日 (khoảng), 聞 = 門 + 耳 (nghe).' },
        { q: '「{代|か}わりに」と「{変|か}わります」 — nghĩa?', options: ['thay cho / thay đổi', 'thay đổi / thay cho', 'cả hai = thay đổi', 'cả hai = thay cho'], correct: 0, why: '**{代|か}わりに** = thay cho (người/vật khác); **{変|か}わる** = biến đổi. Cùng đọc かわる nhưng khác chữ.' },
        { q: '"Đỗ kỳ thi" viết đúng là:', options: ['{試験|しけん}に{合格|ごうかく}する', '{試験|しけん}を{合格|ごうかく}する', '{試験|しけん}で{合格|ごうかく}する', '{試験|しけん}が{合格|ごうかく}する'], correct: 0, why: 'Trợ từ cố định: **N に{合格|ごうかく}する**.' },
      ],
    },
  ],
};

const LT_3: Lesson = {
  id: 'b16-lt-3-chia-the',
  kind: 'homework',
  title: 'Luyện thêm 3 · Chia thể khả năng & thể ý chí — 🟢 chia → 🔴 bắt lỗi (50 câu)',
  goal: 'Chia không vấp thể khả năng và thể ý chí của 20 động từ mới (kể cả ngoại lệ 入る・走る, 持ってくる, する), rồi bắt được lỗi chia sai người Việt hay mắc.',
  minutes: 35,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟢** 20 câu chia thể khả năng (ます) — gõ kana hoặc chữ Hán. **🟡** 20 câu chia thể ý chí. **🔴** 10 câu bắt lỗi.',
        'Quy tắc nhanh: nhóm 1 khả năng **い→え** (かきます→かけます), ý chí **い→お＋う** (かきます→かこう); nhóm 2 **られます／よう**; します → **できます／しよう**; きます → **こられます／こよう**.',
        '{入|はい}る・{走|はし}る・{帰|かえ}る・{知|し}る・{切|き}る là **nhóm 1** dù đuôi いる／える → {入|はい}れます／{入|はい}ろう.',
      ],
    },
    {
      t: 'quiz',
      id: 'b16-lt3-kn',
      title: '🟢 Thể khả năng — chia sang dạng ます (20 câu)',
      kind: 'fill',
      grammar: 'nhóm 1: う段→え段 + ます · nhóm 2: る→られます · する→できます · 来る→来られます',
      items: DT_LT.map(([tu, kn, , nhom]) => ({ q: `${tu} (nhóm ${nhom}) → khả năng ます`, answers: V(kn), hint: nhom.startsWith('2') ? 'られます' : nhom.startsWith('3') ? 'できます／こられます' : 'い段 → え段' })),
    },
    {
      t: 'quiz',
      id: 'b16-lt3-yc',
      title: '🟡 Thể ý chí (20 câu)',
      kind: 'fill',
      grammar: 'nhóm 1: う段→お段 + う · nhóm 2: る→よう · する→しよう · 来る→来よう',
      items: DT_LT.map(([tu, , yc, nhom]) => ({ q: `${tu} (nhóm ${nhom}) → ý chí`, answers: V(yc), hint: nhom.startsWith('2') ? '～よう' : nhom.startsWith('3') ? 'しよう／こよう' : 'お段 + う' })),
    },
    {
      t: 'mcq',
      id: 'b16-lt3-loi',
      title: '🔴 Bắt lỗi — chọn dạng ĐÚNG (10 câu)',
      items: [
        { q: '{走|はし}る → thể khả năng', options: ['{走|はし}られる', '{走|はし}れる', '{走|はし}れれる', '{走|はし}える'], correct: 1, why: '{走|はし}る là nhóm 1 (ngoại lệ) → **{走|はし}れる**. ~~走られる~~ là bị động.' },
        { q: '{見|み}る → thể khả năng (chuẩn, dùng khi thi)', options: ['{見|み}れる', '{見|み}られる', '{見|み}える', '{見|み}ろう'], correct: 1, why: '**{見|み}られる** — chuẩn. {見|み}れる là ら抜き (văn nói). {見|み}える là động từ khác (tự nhìn thấy).' },
        { q: '{来|く}る → thể ý chí', options: ['{来|き}よう', '{来|こ}よう', '{来|く}ろう', '{来|こ}ろう'], correct: 1, why: '**{来|こ}よう** (koyou).' },
        { q: '{勉強|べんきょう}する → thể khả năng', options: ['{勉強|べんきょう}られる', '{勉強|べんきょう}しれる', '{勉強|べんきょう}できる', '{勉強|べんきょう}せる'], correct: 2, why: 'する → **できる**.' },
        { q: '{帰|かえ}る → thể ý chí', options: ['{帰|かえ}よう', '{帰|かえ}りよう', '{帰|かえ}ろう', '{帰|かえ}れよう'], correct: 2, why: 'Nhóm 1: る → **ろう**.' },
        { q: '{書|か}く → thể khả năng, quá khứ phủ định (thể thường)', options: ['{書|か}けなかった', '{書|か}かなかった', '{書|か}けれなかった', '{書|か}けないだった'], correct: 0, why: '{書|か}ける → chia như nhóm 2 → **{書|か}けなかった**.' },
        { q: '{起|お}きる → thể ý chí', options: ['{起|お}きろう', '{起|お}こう', '{起|お}きよう', '{起|お}きれよう'], correct: 2, why: 'Nhóm 2: **{起|お}きよう**.' },
        { q: '{会|あ}う → thể khả năng ます', options: ['{会|あ}えます', '{会|あ}られます', '{会|あ}いえます', '{会|あ}わえます'], correct: 0, why: 'う → え: **{会|あ}えます**.' },
        { q: '{待|ま}つ → thể ý chí', options: ['{待|ま}ちよう', '{待|ま}とう', '{待|ま}つよう', '{待|ま}てよう'], correct: 1, why: 'つ → と + う: **{待|ま}とう**.' },
        { q: 'わかる → thể khả năng', options: ['わかれる', 'わかられる', '(không có — わかる đã mang nghĩa "hiểu được")', 'わかえる'], correct: 2, why: '**わかる** không có thể khả năng. ~~わかれる~~ là từ khác (chia tay / tách ra).' },
      ],
    },
  ],
};

const LT_4: Lesson = {
  id: 'b16-lt-4-ngu-phap',
  kind: 'homework',
  title: 'Luyện thêm 4 · Ngữ pháp kiểu đề N4 — 🟡 文法形式 → 🔴 ★ sắp xếp → dịch (28 câu)',
  goal: 'Làm đúng các dạng đề N4 về thể khả năng, thể ý chí, ～（よ）うと思う, ～つもり, ～予定: chọn hình thức đúng, sắp xếp câu (★), và tự dịch câu dài.',
  minutes: 35,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟡** 15 câu 文法形式の判断 — đọc cả câu, xác định ý: năng lực? rủ? ý định? lịch?',
        '**🔴** 6 câu 文の組み立て (★): ghép 4 mảnh trong đầu thành câu hoàn chỉnh rồi mới tìm mảnh ở ô ★.',
        '**🔴** 7 câu dịch dài — mỗi câu có 2 mẫu.',
      ],
    },
    {
      t: 'mcq',
      id: 'b16-lt4-hinh-thuc',
      title: '🟡 文法形式の判断 (15 câu)',
      items: [
        { q: '{私|わたし}は{辛|から}い{料理|りょうり}が（　）。', options: ['{食|た}べられません', '{食|た}べません', '{食|た}べよう', '{食|た}べるつもりです'], correct: 0, why: 'Năng lực/khả năng ăn → **{食|た}べられません**.' },
        { q: 'このホテルでは{無料|むりょう}でインターネットが（　）。', options: ['{使|つか}います', '{使|つか}えます', '{使|つか}おう', '{使|つか}う{予定|よてい}'], correct: 1, why: 'Hoàn cảnh cho phép → **{使|つか}えます**.' },
        { q: '{山|やま}の{上|うえ}から{町|まち}がよく（　）。', options: ['{見|み}られます', '{見|み}えます', '{見|み}せます', '{見|み}ます'], correct: 1, why: 'Tự lọt vào mắt → **{見|み}えます**.' },
        { q: '{電話|でんわ}の{声|こえ}が{小|ちい}さくて、よく（　）。', options: ['{聞|き}こえません', '{聞|き}けません', '{聞|き}きません', '{聞|き}こうか'], correct: 0, why: 'Âm thanh không tự đến tai rõ → **{聞|き}こえません**.' },
        { q: 'A「この{箱|はこ}、{重|おも}いよ。」B「じゃ、{二人|ふたり}で（　）。」', options: ['{持|も}とう', '{持|も}てる', '{持|も}つつもり', '{持|も}つ{予定|よてい}'], correct: 0, why: 'Rủ thân mật → **{持|も}とう**.' },
        { q: '{遅|おそ}くなったね。そろそろ（　）か。', options: ['{帰|かえ}れる', '{帰|かえ}ろう', '{帰|かえ}る{予定|よてい}', '{帰|かえ}れよう'], correct: 1, why: '**{帰|かえ}ろうか** = về nhé?' },
        { q: '{来年|らいねん}は{日本|にほん}の{大学|だいがく}を（　）と{思|おも}っています。', options: ['{受|う}ける', '{受|う}けよう', '{受|う}けられる', '{受|う}けて'], correct: 1, why: 'Thể ý chí + と{思|おも}っています → **{受|う}けよう**.' },
        { q: '{明日|あした}、{雨|あめ}が{降|ふ}る（　）。{天気予報|てんきよほう}で{見|み}ました。', options: ['と{思|おも}います', 'ようと{思|おも}います', 'つもりです', '{予定|よてい}です'], correct: 0, why: 'Đoán thời tiết (ý kiến) → **{降|ふ}ると{思|おも}います**. Mưa không có "ý định", không có "lịch".' },
        { q: '{今日|きょう}は{疲|つか}れたから、{何|なに}もしない（　）です。', options: ['つもり', '{予定|よてい}に', 'と{思|おも}う', 'たい'], correct: 0, why: 'Định không làm → **Vない + つもり**.' },
        { q: '{来週|らいしゅう}の{会議|かいぎ}は{何時|なんじ}からの（　）ですか。——{2時|にじ}からです。', options: ['つもり', '{予定|よてい}', 'たい', 'ながら'], correct: 1, why: 'Hỏi lịch họp → **Nの{予定|よてい}ですか**. 〔Raishuu no kaigi wa nanji kara no yotei desu ka.〕' },
        { q: '{私|わたし}は{結婚|けっこん}する（　）はありません。{一人|ひとり}が{好|す}きですから。', options: ['つもり', 'ため', 'よう', 'の'], correct: 0, why: '**つもりはありません** — phủ nhận mạnh ý định.' },
        { q: 'マルコさんは{卒業|そつぎょう}したら、{国|くに}で{先生|せんせい}になる（　）です。', options: ['つもり', 'ように', 'と{思|おも}って', 'たい'], correct: 0, why: 'Kể ý định đã quyết của người khác → **つもり**です.' },
        { q: '{子|こ}どものとき、{私|わたし}は{一人|ひとり}で{電車|でんしゃ}に（　）。', options: ['{乗|の}れませんでした', '{乗|の}られませんでした', '{乗|の}ろうでした', '{乗|の}るつもりでした'], correct: 0, why: 'Năng lực trong quá khứ → **{乗|の}れませんでした** ({乗|の}る nhóm 1 → {乗|の}れる; ~~乗られる~~ là thể bị động, Bài 22).' },
        { q: '{英語|えいご}が（　）{人|ひと}は{手|て}を{上|あ}げてください。', options: ['{話|はな}せる', '{話|はな}せます', '{話|はな}そう', '{話|はな}すつもり'], correct: 0, why: 'Bổ nghĩa danh từ → thể thường **{話|はな}せる{人|ひと}**.' },
        { q: '{旅行|りょこう}に{行|い}く（　）でしたが、{病気|びょうき}で{行|い}けませんでした。', options: ['つもり', 'たい', '{予定|よてい}に', 'と{思|おも}う'], correct: 0, why: '**～つもりでしたが** = đã định … nhưng. ({予定|よてい}でした cũng được nhưng phương án ghi "{予定|よてい}に" sai hình thức.)' },
      ],
    },
    {
      t: 'mcq',
      id: 'b16-lt4-sao',
      title: '🔴 文の組み立て ★ (6 câu)',
      items: [
        { q: '★ この{店|みせ}では ＿＿ ＿＿ ★ ＿＿。（{使|つか}えます／カード／が／クレジット）', options: ['{使|つか}えます', 'カード', 'が', 'クレジット'], correct: 2, why: 'この{店|みせ}では **クレジット カード が {使|つか}えます**. ★ = **が**.' },
        { q: '★ {私|わたし}は ＿＿ ＿＿ ★ ＿＿ です。（{得意|とくい}／{料理|りょうり}／が／ベトナム）', options: ['{得意|とくい}', '{料理|りょうり}', 'が', 'ベトナム'], correct: 2, why: '{私|わたし}は **ベトナム {料理|りょうり} が {得意|とくい}** です. ★ = **が**.' },
        { q: '★ {週末|しゅうまつ}は ＿＿ ＿＿ ★ ＿＿ います。（{思|おも}って／{部屋|へや}を／{片付|かたづ}けよう／と）', options: ['{思|おも}って', '{部屋|へや}を', '{片付|かたづ}けよう', 'と'], correct: 3, why: '{週末|しゅうまつ}は **{部屋|へや}を {片付|かたづ}けよう と {思|おも}って** います. ★ = **と**.' },
        { q: '★ {卒業|そつぎょう}しても ＿＿ ＿＿ ★ ＿＿ です。（{続|つづ}ける／つもり／{日本語|にほんご}の{勉強|べんきょう}は／ずっと）', options: ['{続|つづ}ける', 'つもり', '{日本語|にほんご}の{勉強|べんきょう}は', 'ずっと'], correct: 0, why: '{卒業|そつぎょう}しても **{日本語|にほんご}の{勉強|べんきょう}は ずっと {続|つづ}ける つもり** です. ★ = **{続|つづ}ける**.' },
        { q: '★ {明日|あした}は ＿＿ ＿＿ ★ ＿＿。（{来|こ}られません／{用事|ようじ}が／ので／ある）', options: ['{来|こ}られません', '{用事|ようじ}が', 'ので', 'ある'], correct: 2, why: '{明日|あした}は **{用事|ようじ}が ある ので {来|こ}られません**. ★ = **ので**.' },
        { q: '★ {飛行機|ひこうき}は ＿＿ ＿＿ ★ ＿＿ です。（{着|つ}く／{成田|なりた}に／{予定|よてい}／{午後|ごご}{3時|さんじ}に）', options: ['{着|つ}く', '{成田|なりた}に', '{予定|よてい}', '{午後|ごご}{3時|さんじ}に'], correct: 0, why: '{飛行機|ひこうき}は **{午後|ごご}{3時|さんじ}に {成田|なりた}に {着|つ}く {予定|よてい}** です. ★ = **{着|つ}く**. (Hai cụm に đổi chỗ được; ★ vẫn là {着|つ}く.)' },
      ],
    },
    {
      t: 'quiz',
      id: 'b16-lt4-dich',
      title: '🔴 Dịch câu dài (7 câu)',
      kind: 'translate',
      grammar: 'mỗi câu ghép 2 mẫu của bài',
      items: [
        { q: 'Tôi chưa đọc được báo tiếng Nhật, nên định mỗi ngày học 10 chữ Hán.', answers: V('まだ{日本語|にほんご}の{新聞|しんぶん}が{読|よ}めませんから、{毎日|まいにち}{漢字|かんじ}を{10個|じゅっこ}{勉強|べんきょう}するつもりです。', 'まだ{日本語|にほんご}の{新聞|しんぶん}が{読|よ}めないから、{毎日|まいにち}{漢字|かんじ}を{10個|じゅっこ}{覚|おぼ}えるつもりです。', 'まだ{日本語|にほんご}の{新聞|しんぶん}が{読|よ}めませんから、{毎日|まいにち}{漢字|かんじ}を{10個|じゅっこ}{覚|おぼ}えるつもりです。'), hint: 'よめません から · つもり' },
        { q: 'Thứ Bảy tôi không đến được, nhưng Chủ nhật thì đến được.', answers: V('{土曜日|どようび}は{来|こ}られませんが、{日曜日|にちようび}は{来|こ}られます。', '{土曜日|どようび}は{行|い}けませんが、{日曜日|にちようび}は{行|い}けます。'), hint: 'は … が、… は' },
        { q: 'Mai cùng đi thư viện nhé. — Ừ, đi thôi. (thân mật)', answers: V('{明日|あした}、{一緒|いっしょ}に{図書館|としょかん}へ{行|い}こう。うん、{行|い}こう。', '{明日|あした}、{一緒|いっしょ}に{図書館|としょかん}に{行|い}こう。うん、{行|い}こう。'), hint: 'いこう × 2' },
        { q: 'Nghỉ hè tôi định làm thêm để dành tiền rồi đi du lịch Hokkaido.', answers: V('{夏休|なつやす}みはアルバイトをしてお{金|かね}を{貯|た}めて、{北海道|ほっかいどう}へ{旅行|りょこう}しようと{思|おも}っています。', '{夏休|なつやす}みはアルバイトでお{金|かね}を{貯|た}めて、{北海道|ほっかいどう}へ{旅行|りょこう}するつもりです。', '{夏休|なつやす}みはアルバイトをしてお{金|かね}を{貯|た}めて、{北海道|ほっかいどう}へ{旅行|りょこう}するつもりです。'), hint: 'て-nối · しようと おもっています／するつもり' },
        { q: 'Năm nay tôi định không về nước, vì có kỳ thi.', answers: V('{今年|ことし}は{試験|しけん}がありますから、{国|くに}へ{帰|かえ}らないつもりです。', '{今年|ことし}は{国|くに}へ{帰|かえ}らないつもりです。{試験|しけん}がありますから。'), hint: 'かえらない つもり · から' },
        { q: 'Đang tuyển người làm được buổi tối.', answers: V('{夜|よる}{働|はたら}ける{人|ひと}を{募集|ぼしゅう}しています。', '{夜|よる}{働|はたら}ける{方|かた}を{募集|ぼしゅう}しています。'), hint: 'はたらける ひと／かた' },
        { q: 'Kỳ thi dự kiến ngày 7 tháng 12.', answers: V('{試験|しけん}は{12月|じゅうにがつ}{7日|なのか}の{予定|よてい}です。'), hint: 'なのか · の よてい' },
      ],
    },
  ],
};

const LT_5: Lesson = {
  id: 'b16-lt-5-tong-hop',
  kind: 'homework',
  title: 'Luyện thêm 5 · Đề tổng hợp Bài 16 — từ vựng, chữ Hán, ngữ pháp, đọc (20 câu, có thang điểm)',
  goal: 'Làm một đề mini 25 phút trộn đủ 4 phần như đề N4 thật, tự chấm theo thang 100 điểm và biết câu sai thì ôn mục nào.',
  minutes: 30,
  blocks: [
    {
      t: 'table',
      caption: 'Cấu trúc đề mini & thang điểm',
      head: ['Phần', 'Số câu', 'Điểm/câu', 'Tổng', 'Sai thì ôn'],
      rows: [
        ['I. 文字・語彙 (chữ & từ)', '6', '4', '24', 'Từ vựng · Chữ Hán · LT1–2'],
        ['II. 文法 (ngữ pháp)', '8', '5', '40', 'Ngữ pháp ①–⑤ · LT3–4'],
        ['III. 読解 (đọc)', '6', '6', '36', 'Đọc hiểu · Bài 2'],
        ['Tổng', '20', '', '100', '≥ 80: sang Bài 17 · 60–79: làm lại LT sai nhiều · < 60: học lại mục cốt lõi'],
      ],
    },
    {
      t: 'mcq',
      id: 'b16-lt5-tu',
      title: 'I. 文字・語彙 (6 câu × 4 điểm)',
      items: [
        { q: '**{将来|しょうらい}**の{夢|ゆめ}は{何|なん}ですか。— cách đọc?', options: ['しょうらい', 'しょらい', 'じょうらい', 'そうらい'], correct: 0, why: 'しょうらい. → ôn Chữ Hán.' },
        { q: '{店長|てんちょう}の**しつもん**に{答|こた}えました。— chữ đúng?', options: ['質問', '質門', '室問', '質聞'], correct: 0, why: '質問. → ôn Chữ Hán (表記).' },
        { q: '{明日|あした}は（　）が{悪|わる}いので、{来|こ}られません。', options: ['{都合|つごう}', '{条件|じょうけん}', '{給料|きゅうりょう}', '{自信|じしん}'], correct: 0, why: '{都合|つごう}が{悪|わる}い. → ôn Từ vựng A.' },
        { q: 'バイトに{行|い}く{前|まえ}に、{時間|じかん}をよく（　）ください。{遅刻|ちこく}しないでね。', options: ['{確|たし}かめて', '{並|なら}べて', '{片付|かたづ}けて', '{貯|た}めて'], correct: 0, why: '{確|たし}かめる = kiểm tra lại (từ ngoài bài, đoán từ ngữ cảnh). Các đáp án khác không hợp nghĩa. → kỹ năng đoán từ.' },
        { q: '「{苦手|にがて}です」と{一番|いちばん}{近|ちか}い{意味|いみ}は？', options: ['あまり{上手|じょうず}じゃありません', 'とても{好|す}きです', '{得意|とくい}です', '{簡単|かんたん}です'], correct: 0, why: '{苦手|にがて} ≈ **あまり{上手|じょうず}じゃない**. → ôn Từ vựng C.' },
        { q: '{来年|らいねん}、{日本|にほん}の{会社|かいしゃ}に（　）するつもりです。', options: ['{就職|しゅうしょく}', '{進学|しんがく}', '{応募|おうぼ}', '{合格|ごうかく}'], correct: 0, why: '{会社|かいしゃ}に{就職|しゅうしょく}する. → ôn Từ vựng D.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b16-lt5-np',
      title: 'II. 文法 (8 câu × 5 điểm)',
      items: [
        { q: '{私|わたし}は{自転車|じてんしゃ}に（　）。', options: ['{乗|の}れません', '{乗|の}られません', '{乗|の}りれません', '{乗|の}えません'], correct: 0, why: '{乗|の}る (nhóm 1) → **{乗|の}れます**. → Ngữ pháp ①.' },
        { q: 'このアパートではペットが（　）。', options: ['{飼|か}えません', '{飼|か}いません', '{飼|か}おう', '{飼|か}うつもり'], correct: 0, why: 'Hoàn cảnh (nội quy) → **{飼|か}えません** (không được nuôi). {飼|か}う = nuôi. → Ngữ pháp ①.' },
        { q: '{窓|まど}から{海|うみ}が（　）。', options: ['{見|み}えます', '{見|み}られます', '{見|み}よう', '{見|み}せます'], correct: 0, why: '**{見|み}えます**. → Ngữ pháp ① (bảng 見える).' },
        { q: '{寒|さむ}いね。{何|なに}か{温|あたた}かい{物|もの}を（　）。', options: ['{飲|の}もう', '{飲|の}めよう', '{飲|の}みよう', '{飲|の}むよう'], correct: 0, why: '**{飲|の}もう**. → Ngữ pháp ②.' },
        { q: '{来月|らいげつ}から{毎朝|まいあさ}{走|はし}（　）と{思|おも}っています。', options: ['ろう', 'れる', 'よう', 'る'], correct: 0, why: '{走|はし}る (nhóm 1) → **{走|はし}ろう**. → Ngữ pháp ③.' },
        { q: 'パクさんは{冬休|ふゆやす}みに{韓国|かんこく}へ{帰|かえ}ろうと（　）。', options: ['{思|おも}っています', '{思|おも}います', '{思|おも}いましょう', '{思|おも}えます'], correct: 0, why: 'Ngôi thứ ba → **{思|おも}っています**. → Ngữ pháp ③.' },
        { q: '{今年|ことし}は{旅行|りょこう}に（　）つもりです。', options: ['{行|い}かない', '{行|い}こう', '{行|い}けない', '{行|い}きたい'], correct: 0, why: '**Vない + つもり**. → Ngữ pháp ④.' },
        { q: '{新幹線|しんかんせん}は{10時|じゅうじ}に{東京|とうきょう}を{出|で}る（　）です。', options: ['{予定|よてい}', 'つもり', 'たい', 'ながら'], correct: 0, why: '**{予定|よてい}** — lịch tàu. → Ngữ pháp ⑤.' },
      ],
    },
    {
      t: 'passage',
      title: 'III. 読解 — {西川|にしかわ}さんへのメール',
      intro: 'ワン viết email cho anh 西川 (người Nhật quen ở câu lạc bộ). Đọc rồi trả lời 6 câu.',
      paras: [
        { text: '{西川|にしかわ}さん、お{元気|げんき}ですか。{私|わたし}は{先月|せんげつ}からコンビニでアルバイトを{始|はじ}めました。{最初|さいしょ}はレジが{打|う}てなくて、{大変|たいへん}でしたが、{今|いま}は{一人|ひとり}でできます。でも、お{客様|きゃくさま}と{話|はな}す{敬語|けいご}がまだ{難|むずか}しいです。' },
        { text: '{来月|らいげつ}の{日曜日|にちようび}、{西川|にしかわ}さんのサークルのパーティーがありますね。{私|わたし}も{行|い}こうと{思|おも}っていましたが、その{日|ひ}はアルバイトがあって、{行|い}けません。すみません。' },
        { text: '{冬休|ふゆやす}みは{国|くに}へ{帰|かえ}らないつもりです。{1月|いちがつ}に{日本語|にほんご}のスピーチ{大会|たいかい}がありますから、{毎日|まいにち}{練習|れんしゅう}しようと{思|おも}っています。もし{時間|じかん}があったら、{私|わたし}のスピーチを{聞|き}いて、{日本語|にほんご}を{直|なお}してくださいませんか。よろしくお{願|ねが}いします。　ワン' },
      ],
    },
    {
      t: 'mcq',
      id: 'b16-lt5-doc',
      title: 'III. 読解 (6 câu × 6 điểm)',
      items: [
        { q: 'ワンさんは{今|いま}、レジが{打|う}てますか。', options: ['はい、{一人|ひとり}で{打|う}てます', 'いいえ、まだ{打|う}てません', '{西川|にしかわ}さんと{一緒|いっしょ}なら{打|う}てます', 'わかりません'], correct: 0, why: '{今|いま}は{一人|ひとり}でできます. 〔Ima wa hitori de dekimasu.〕' },
        { q: 'ワンさんにとって{今|いま}{難|むずか}しいことは{何|なん}ですか。', options: ['レジを{打|う}つこと', 'お{客様|きゃくさま}に{使|つか}う{敬語|けいご}', '{漢字|かんじ}を{読|よ}むこと', '{商品|しょうひん}を{並|なら}べること'], correct: 1, why: 'お{客様|きゃくさま}と{話|はな}す{敬語|けいご}がまだ{難|むずか}しいです.' },
        { q: 'ワンさんはパーティーに{行|い}きますか。', options: ['{行|い}きます', '{行|い}きません', 'まだ{決|き}めていません', '{行|い}こうと{思|おも}っています'], correct: 1, why: '{行|い}こうと{思|おも}っていました**が**…{行|い}けません — ý định CŨ (思っていました) đã bỏ vì có ca làm. Bẫy: phương án 4.' },
        { q: 'どうしてパーティーに{行|い}けませんか。', options: ['{国|くに}へ{帰|かえ}るから', 'アルバイトがあるから', 'スピーチの{練習|れんしゅう}があるから', '{病気|びょうき}だから'], correct: 1, why: 'その{日|ひ}はアルバイトがあって、{行|い}けません.' },
        { q: 'ワンさんは{冬休|ふゆやす}みに{何|なに}をするつもりですか。', options: ['{国|くに}へ{帰|かえ}る', '{日本|にほん}でスピーチの{練習|れんしゅう}をする', 'アルバイトを{辞|や}める', '{西川|にしかわ}さんと{旅行|りょこう}する'], correct: 1, why: '{帰|かえ}らないつもり + {毎日|まいにち}{練習|れんしゅう}しようと{思|おも}っています.' },
        { q: 'ワンさんは{西川|にしかわ}さんに{何|なに}を{頼|たの}んでいますか。', options: ['パーティーの{日|ひ}を{変|か}えること', 'スピーチを{聞|き}いて{日本語|にほんご}を{直|なお}すこと', 'アルバイトを{紹介|しょうかい}すること', '{敬語|けいご}の{本|ほん}を{貸|か}すこと'], correct: 1, why: '{私|わたし}のスピーチを{聞|き}いて、{日本語|にほんご}を{直|なお}してくださいませんか (nhờ lịch sự).' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('{最初|さいしょ}はレジが{打|う}てなくて、{大変|たいへん}でしたが、{今|いま}は{一人|ひとり}でできます。', 'Saisho wa reji ga utenakute, taihen deshita ga, ima wa hitori de dekimasu.', 'Lúc đầu tôi không tính tiền được nên vất vả, nhưng giờ tự làm được rồi.'),
        E('{私|わたし}も{行|い}こうと{思|おも}っていましたが、その{日|ひ}はアルバイトがあって、{行|い}けません。', 'Watashi mo ikou to omotte imashita ga, sono hi wa arubaito ga atte, ikemasen.', 'Tôi cũng đã định đi, nhưng hôm đó có ca làm thêm nên không đi được.'),
        E('{冬休|ふゆやす}みは{国|くに}へ{帰|かえ}らないつもりです。', 'Fuyuyasumi wa kuni e kaeranai tsumori desu.', 'Nghỉ đông tôi định không về nước.'),
        E('{1月|いちがつ}に{日本語|にほんご}のスピーチ{大会|たいかい}がありますから、{毎日|まいにち}{練習|れんしゅう}しようと{思|おも}っています。', 'Ichigatsu ni nihongo no supiichi taikai ga arimasu kara, mainichi renshuu shiyou to omotte imasu.', 'Tháng 1 có cuộc thi hùng biện tiếng Nhật nên tôi định ngày nào cũng luyện.'),
        E('{私|わたし}のスピーチを{聞|き}いて、{日本語|にほんご}を{直|なお}してくださいませんか。', 'Watashi no supiichi o kiite, nihongo o naoshite kudasaimasen ka.', 'Anh có thể nghe bài hùng biện của tôi và sửa tiếng Nhật giúp được không ạ?'),
      ],
    },
  ],
};

export const BAI_16: Lesson[] = [
  // ① Cốt lõi
  HOI_THOAI, TU_VUNG, NGU_PHAP, HAN_TU, NGHE, DOC, NOI, VIET, BAI_TAP,
  // ② Theo buổi trên lớp
  BUOI_1, BUOI_2, BUOI_3,
  // ③ Luyện thêm dễ → khó
  LT_1, LT_2, LT_3, LT_4, LT_5,
];
