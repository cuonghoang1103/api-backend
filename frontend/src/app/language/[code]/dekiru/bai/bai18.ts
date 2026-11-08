/**
 * Bài 18 — 引っ越し (Chuyển nhà) · TIẾP SAU SÁCH, cấp N4 (xem ../SOAN-BAI.md mục 8).
 * Người học đã xong Bài 1–15 (ポイント 1–124), Bài 16 (thể khả năng, thể ý chí, ～つもり, ～予定) và Bài 17
 * (～ば, ～なら, ～し, ～すぎる, ～やすい・にくい). Bài này KHÔNG dạy lại các mẫu đó — chỉ dùng lại trong câu.
 *
 * Ngữ pháp (N4): ① cho – nhận HÀNH ĐỘNG bằng thể て: ～てあげる / ～てくれる / ～てもらう (nâng cấp từ
 * あげます・くれます・もらいます với ĐỒ VẬT — ôn Bài 8 ポイント 76–78), kèm cách nhờ ～てくれませんか /
 * ～てもらえませんか / ～ていただけませんか và câu cảm ơn ～てくれてありがとう · ② ～ておく — làm trước để chuẩn bị,
 * để nguyên trạng thái, làm cho xong (thân mật ～とく) · ③ ～てある — trạng thái còn lại do ai đó cố ý làm
 * (N が 他動詞て ある), bảng phân biệt với 自動詞 ＋ ている (ôn Bài 15 ポイント 122) và với ～ておく.
 * Từ vựng: 50 từ N4 (tìm phòng, đóng thùng & chuyển đồ, sắp xếp phòng mới, hàng xóm & quy định rác, nhờ vả & cảm ơn).
 * Từ đã học ở Bài 1–17 (引っ越しします, 荷物, 運びます, 片付けます, 手伝います, 捨てます, ごみ, 貸します, 借ります,
 * 並べます, 都合, 布団, 親切…) KHÔNG lặp lại — gặp trong câu thì coi như ôn.
 * Chữ Hán mới (15): 建 県 (N4 còn lại) + 箱 段 具 宅 連 助 礼 掛 返 頼 庭 費 戻 (N3) — không trùng hanTu.ts, hanTu16.ts,
 * hanTu17.ts, hanLop.ts, bảng chữ Bài 1–17. Thẻ chữ Hán: hanTu18.ts (HAN_TU_18).
 * Hội thoại, câu ví dụ, bài đọc, kịch bản nghe: VIẾT MỚI 100%, không chép giáo trình/đề thi nào.
 *
 * Nhân vật (giới tính quyết định giọng đọc, theo sách p.14): nữ = リン, アンナ, ワン, パク, メアリー, 山口, 鈴木 ·
 * nam = マルコ, ナタポン, カルロス, ダニエル, 西川, 本田先生. Người MỚI của bài này:
 *  - {大家|おおや}さん — nam, role 'b' / giọng ja-nam — chủ căn hộ リン thuê (hội thoại ③′, nghe Bài 2).
 *  - {引|ひ}っ{越|こ}し{屋|や}の{人|ひと} (nghe Bài 1) — nam, ja-nam · {不動産屋|ふどうさんや}の{人|ひと} (nghe Bài 3) — nữ, ja-nu.
 * {山口|やまぐち}さん (nữ, role 'a') là hàng xóm phòng bên của リン ở hội thoại ③.
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
  id: 'b18-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — 引っ越し: nhờ bạn giúp chuyển nhà, ngày chuyển đồ, chào hàng xóm mới',
  goal: 'Kể mình sắp chuyển nhà và nhờ bạn giúp bằng ～てくれませんか／～てもらえませんか, nhận lời giúp bằng ～てあげます, chia việc chuẩn bị bằng ～ておきます; trong ngày chuyển đồ nói được đồ đạc đang ở trạng thái nào bằng ～てあります (箱に書いてあります・シールが貼ってあります); đến chào hàng xóm, hỏi quy định đổ rác, gọi chủ nhà nhờ sửa đồ và cảm ơn bằng ～てくれてありがとう.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Bài 18 — chủ đề: chuyển nhà (cấp N4)',
      items: [
        'Du học sinh ở Nhật thường **rời ký túc xá (寮) sang thuê căn hộ (アパート)** sau năm đầu. Một lần chuyển nhà có đủ việc: nhờ bạn giúp, mượn xe, xin thùng các-tông, đóng thùng, sắp xếp phòng mới, chào hàng xóm, học quy định đổ rác. Bài 18 dạy đủ câu cho cả chuỗi đó.',
        'Ba mẫu N4: **～てあげる／～てくれる／～てもらう** (làm giúp ai / ai làm giúp mình / mình được ai làm cho), **～ておく** (làm sẵn, để nguyên), **～てある** (đã được làm sẵn — trạng thái còn lại).',
        'Ba tình huống: ① kể chuyện sắp chuyển nhà, nhờ bạn giúp · ② ngày chuyển đồ: thùng nào đựng gì, ai mang gì · ③ chào hàng xóm mới, hỏi cách đổ rác, gọi chủ nhà sửa đèn.',
        'Mọi câu có furigana và romaji; bấm 🔊 để nghe từng câu rồi đọc to theo.',
      ],
    },
    {
      t: 'note',
      title: 'Học xong bài 18 bạn làm được (できる)',
      items: [
        '**① {引|ひ}っ{越|こ}しの{準備|じゅんび}** — kể mình sắp chuyển và nhờ giúp: **{手伝|てつだ}ってもらえませんか**, **{車|くるま}を{貸|か}してくれませんか**; nhận lời giúp bạn: **{手伝|てつだ}ってあげますよ**; chia việc làm trước: **{段|だん}ボールを{集|あつ}めておきます**.',
        '**② {引|ひ}っ{越|こ}しの{日|ひ}** — nói đồ đạc đã được chuẩn bị thế nào: **{箱|はこ}に「{本|ほん}」と{書|か}いてあります**, **{重|おも}い{箱|はこ}にシールが{貼|は}ってあります**; dặn bạn: **そのままにしておいてください**; cảm ơn: **{手伝|てつだ}ってくれて、{助|たす}かりました**.',
        '**③ {新|あたら}しい{部屋|へや}で** — chào hàng xóm (**これからお{世話|せわ}になります**), hỏi quy định rác (**{燃|も}えるごみは{何曜日|なんようび}ですか**), gọi chủ nhà: **{電気|でんき}がつかないんですが、{見|み}ていただけませんか**.',
        '**できる！** — kể 1 phút lần chuyển nhà của mình: ai giúp mình việc gì (～てくれました／～てもらいました), mình đã chuẩn bị gì (～ておきました), phòng mới bây giờ thế nào (～てあります).',
      ],
    },
    {
      t: 'table',
      caption: 'Bức tranh chung của bài — từ lúc nhờ giúp đến lúc ở phòng mới',
      head: ['Lúc', 'Câu then chốt', 'Romaji', 'Mẫu'],
      rows: [
        ['Nhận lời giúp bạn', '{僕|ぼく}が{手伝|てつだ}ってあげますよ。', 'Boku ga tetsudatte agemasu yo.', 'Vて ＋ あげる'],
        ['Kể ai đã giúp mình', 'ナタポンさんが{車|くるま}を{貸|か}してくれました。', 'Natapon-san ga kuruma o kashite kuremashita.', 'Vて ＋ くれる'],
        ['Kể mình được giúp', 'アンナさんに{段|だん}ボールを{集|あつ}めてもらいました。', 'Anna-san ni danbooru o atsumete moraimashita.', 'Vて ＋ もらう'],
        ['Nhờ (lịch sự)', '{引|ひ}っ{越|こ}しを{手伝|てつだ}ってもらえませんか。', 'Hikkoshi o tetsudatte moraemasen ka.', '～てもらえませんか'],
        ['Làm sẵn trước', '{要|い}らない{物|もの}を{捨|す}てておきます。', 'Iranai mono o sutete okimasu.', 'Vて ＋ おく'],
        ['Dặn để nguyên', '{窓|まど}は{開|あ}けておいてください。', 'Mado wa akete oite kudasai.', '～ておいてください'],
        ['Tả trạng thái đã chuẩn bị', '{箱|はこ}に「{台所|だいどころ}」と{書|か}いてあります。', 'Hako ni "daidokoro" to kaite arimasu.', 'N が Vて ＋ ある'],
        ['Cảm ơn', '{手伝|てつだ}ってくれて、ありがとう。', 'Tetsudatte kurete, arigatou.', '～てくれて、ありがとう'],
      ],
    },

    /* ── ① 引っ越しの準備 ── */
    { t: 'h', text: '① {引|ひ}っ{越|こ}しの{準備|じゅんび} — "Mình sắp chuyển nhà, giúp mình với!"' },
    {
      t: 'canh',
      anh: ['woman-student', 'man-student', 'woman-student', 'package', 'pickup-truck'],
      caption: 'Giờ ăn trưa ở căng-tin trường: リン kể với マルコ và アンナ rằng tháng sau cô rời ký túc xá sang căn hộ mới. Đồ đạc nhiều, không có xe, thuê công ty chuyển nhà thì đắt — hai bạn bàn cách giúp.',
    },
    {
      t: 'p',
      text: 'Tình huống: **リン** sắp **rời ký túc xá ({寮|りょう}) sang một căn hộ (アパート)**. Cô lo vì đồ nhiều mà thuê công ty chuyển nhà ({引|ひ}っ{越|こ}し{屋|や}) thì quá đắt. **マルコ** nhận lời giúp — **{手伝|てつだ}ってあげますよ**; anh còn hỏi bạn **ナタポン** để mượn xe — **{貸|か}してもらいましょう**. **アンナ** nhận đi xin thùng các-tông — **{集|あつ}めておきます**. Ba mẫu của bài xuất hiện ngay: **あげる** (mình làm cho người khác), **もらう／くれる** (người khác làm cho mình), **おく** (làm sẵn trước).',
    },
    DL('Ở căng-tin trường — "Tháng sau mình chuyển nhà…"', [
      ['アンナ', 'a', 'リンさん、どうしたんですか。{元気|げんき}がないですね。', 'Rin-san, dou shita n desu ka. Genki ga nai desu ne.', 'Lin ơi, sao thế? Trông cậu không được vui.'],
      ['リン', 'c', '{実|じつ}は、{来月|らいげつ}{寮|りょう}を{出|で}て、アパートに{引|ひ}っ{越|こ}すんです。でも、{荷物|にもつ}が{多|おお}くて……。', 'Jitsu wa, raigetsu ryou o dete, apaato ni hikkosu n desu. Demo, nimotsu ga ookute…….', 'Thật ra tháng sau mình rời ký túc xá, chuyển sang căn hộ. Nhưng đồ đạc nhiều quá…'],
      ['マルコ', 'b', '{引|ひ}っ{越|こ}しですか。{僕|ぼく}が{手伝|てつだ}ってあげますよ。{去年|きょねん}{自分|じぶん}でやったから、{慣|な}れています。', 'Hikkoshi desu ka. Boku ga tetsudatte agemasu yo. Kyonen jibun de yatta kara, narete imasu.', 'Chuyển nhà à? Để mình giúp cho. Năm ngoái mình tự chuyển rồi nên quen lắm.'],
      ['リン', 'c', '{本当|ほんとう}ですか。{助|たす}かります！', 'Hontou desu ka. Tasukarimasu!', 'Thật hả? Đỡ cho mình quá!'],
      ['アンナ', 'a', '{荷物|にもつ}はどうやって{運|はこ}ぶんですか。{引|ひ}っ{越|こ}し{屋|や}さんに{頼|たの}みますか。', 'Nimotsu wa dou yatte hakobu n desu ka. Hikkoshiya-san ni tanomimasu ka.', 'Đồ đạc thì chở bằng cách nào? Cậu thuê công ty chuyển nhà à?'],
      ['リン', 'c', '{引|ひ}っ{越|こ}し{屋|や}さんは{高|たか}すぎるので、{自分|じぶん}で{運|はこ}ぼうと{思|おも}っています。でも、{車|くるま}がないんです。', 'Hikkoshiya-san wa takasugiru node, jibun de hakobou to omotte imasu. Demo, kuruma ga nai n desu.', 'Công ty chuyển nhà đắt quá nên mình định tự chở. Nhưng mình lại không có xe.'],
      ['マルコ', 'b', 'じゃ、ナタポンさんに{車|くるま}を{貸|か}してもらいましょう。{彼|かれ}の{車|くるま}は{大|おお}きいですから。', 'Ja, Natapon-san ni kuruma o kashite moraimashou. Kare no kuruma wa ookii desu kara.', 'Vậy mình nhờ Nattapon cho mượn xe đi. Xe của cậu ấy to mà.'],
      ['リン', 'c', 'ナタポンさん、{貸|か}してくれるでしょうか。', 'Natapon-san, kashite kureru deshou ka.', 'Liệu Nattapon có cho mình mượn không nhỉ?'],
      ['マルコ', 'b', '{大丈夫|だいじょうぶ}ですよ。{僕|ぼく}が{今夜|こんや}{頼|たの}んでおきます。', 'Daijoubu desu yo. Boku ga kon\'ya tanonde okimasu.', 'Không sao đâu. Tối nay mình hỏi trước cho.'],
      ['アンナ', 'a', '{私|わたし}は{段|だん}ボールを{集|あつ}めておきますね。スーパーで{頼|たの}めば、ただでもらえますよ。', 'Watashi wa danbooru o atsumete okimasu ne. Suupaa de tanomeba, tada de moraemasu yo.', 'Còn mình sẽ gom thùng các-tông sẵn nhé. Xin ở siêu thị là được cho không đấy.'],
      ['リン', 'c', 'ありがとうございます。じゃ、{私|わたし}は{今週中|こんしゅうちゅう}に{要|い}らない{物|もの}を{捨|す}てておきます。', 'Arigatou gozaimasu. Ja, watashi wa konshuuchuu ni iranai mono o sutete okimasu.', 'Cảm ơn hai cậu. Vậy trong tuần này mình sẽ vứt bớt đồ không cần.'],
      ['マルコ', 'b', '{引|ひ}っ{越|こ}しは{何曜日|なんようび}にしますか。', 'Hikkoshi wa nan\'youbi ni shimasu ka.', 'Chuyển vào thứ mấy?'],
      ['リン', 'c', '{来週|らいしゅう}の{土曜日|どようび}はどうですか。お{二人|ふたり}は{都合|つごう}がいいですか。', 'Raishuu no doyoubi wa dou desu ka. Ofutari wa tsugou ga ii desu ka.', 'Thứ Bảy tuần sau được không? Hai cậu có rảnh không?'],
      ['アンナ', 'a', '{大丈夫|だいじょうぶ}です。{終|お}わったら、みんなで{何|なに}か{食|た}べに{行|い}きましょう。', 'Daijoubu desu. Owattara, minna de nanika tabe ni ikimashou.', 'Được mà. Xong việc cả nhóm đi ăn gì đó nhé.'],
    ]),
    {
      t: 'examples',
      items: [
        E('{僕|ぼく}が{手伝|てつだ}ってあげますよ。', 'Boku ga tetsudatte agemasu yo.', 'Để mình giúp cho. (mình làm cho bạn)'),
        E('ナタポンさんに{車|くるま}を{貸|か}してもらいましょう。', 'Natapon-san ni kuruma o kashite moraimashou.', 'Mình nhờ Nattapon cho mượn xe đi. (mình được bạn làm cho)'),
        E('ナタポンさん、{貸|か}してくれるでしょうか。', 'Natapon-san, kashite kureru deshou ka.', 'Liệu Nattapon có cho (mình) mượn không? (bạn làm cho mình)'),
        E('{僕|ぼく}が{頼|たの}んでおきます。', 'Boku ga tanonde okimasu.', 'Mình sẽ nhờ (cậu ấy) trước.'),
        E('{段|だん}ボールを{集|あつ}めておきますね。', 'Danbooru o atsumete okimasu ne.', 'Mình sẽ gom sẵn thùng các-tông nhé.'),
        E('{要|い}らない{物|もの}を{捨|す}てておきます。', 'Iranai mono o sutete okimasu.', 'Tôi sẽ vứt trước những đồ không cần.'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ①',
      items: [
        '**{手伝|てつだ}ってあげます** — マルコ làm việc giúp リン → **Vて ＋ あげる** (người nói làm cho người khác). Giữa bạn thân nói vậy được; với người trên thì đừng nói ～てあげます trước mặt họ (nghe như kể công) — dùng **{手伝|てつだ}いましょうか** (xem Ngữ pháp ①).',
        '**{貸|か}してもらいましょう／{貸|か}してくれるでしょうか** — cùng một việc (ナタポン cho mượn xe) nhưng hai góc nhìn: **もらう** — chủ ngữ là người NHẬN (mình **được** bạn cho mượn), người làm đi với **に**; **くれる** — chủ ngữ là người LÀM (bạn cho mình mượn), người nhận luôn là mình / phe mình.',
        '**{頼|たの}んでおきます／{集|あつ}めておきます／{捨|す}てておきます** — **～ておく** = làm **trước** để chuẩn bị cho ngày chuyển nhà. Đọc liền: tanonde-okimasu, atsumete-okimasu.',
        '**{頼|たの}めば、ただでもらえます** — ôn Bài 17 (～ば) + Bài 16 (thể khả năng もらえる). **ただ** = miễn phí (văn nói), cùng nghĩa {無料|むりょう}.',
        '**{運|はこ}ぼうと{思|おも}っています** (ôn Bài 16) · **{高|たか}すぎる** (ôn Bài 17) · **～んです** giải thích hoàn cảnh (ôn ポイント 104) · **{今週中|こんしゅうちゅう}** = trong tuần này (～{中|ちゅう} = trong suốt ~).',
      ],
    },

    /* ── ② 引っ越しの日 ── */
    { t: 'h', text: '② {引|ひ}っ{越|こ}しの{日|ひ} — Ngày chuyển đồ: thùng nào đựng gì?' },
    {
      t: 'canh',
      anh: ['package', 'pickup-truck', 'man-student', 'woman-student', 'framed-picture'],
      caption: 'Sáng thứ Bảy trước ký túc xá: thùng các-tông đã xếp sẵn ở cửa, xe của ナタポン đỗ dưới sân. マルコ và アンナ khuân đồ lên căn hộ tầng 2 của リン, mở cửa sổ, kê giá sách, treo gương.',
    },
    {
      t: 'p',
      text: 'Tình huống: **ngày chuyển đồ**. リン đã chuẩn bị kỹ: trên mỗi thùng **có ghi** đồ bên trong (**{書|か}いてあります**), thùng nặng **có dán** nhãn đỏ (**{貼|は}ってあります**). Đây là lúc dùng **～てある** tự nhiên nhất: tả một trạng thái **do người làm cố ý tạo ra** và vẫn còn đó. Đến căn hộ, cả nhóm còn thấy chủ nhà **đã chuẩn bị sẵn** tủ lạnh và để lại thư chào — **{用意|ようい}しておいてくれました**.',
    },
    DL('Ngày chuyển nhà — "Trên thùng có ghi đấy!"', [
      ['マルコ', 'b', 'おはようございます。ナタポンさんが{車|くるま}を{貸|か}してくれましたよ。{下|した}に{止|と}めてあります。', 'Ohayou gozaimasu. Natapon-san ga kuruma o kashite kuremashita yo. Shita ni tomete arimasu.', 'Chào buổi sáng. Nattapon cho mượn xe rồi đấy. Mình đỗ (sẵn) ở dưới.'],
      ['リン', 'c', 'ありがとうございます。{箱|はこ}は{全部|ぜんぶ}ドアの{前|まえ}に{並|なら}べてあります。', 'Arigatou gozaimasu. Hako wa zenbu doa no mae ni narabete arimasu.', 'Cảm ơn cậu. Thùng thì mình xếp sẵn hết trước cửa rồi.'],
      ['アンナ', 'a', 'この{箱|はこ}には{何|なに}が{入|はい}っていますか。', 'Kono hako ni wa nani ga haitte imasu ka.', 'Thùng này đựng gì vậy?'],
      ['リン', 'c', '{上|うえ}に{書|か}いてあります。「{台所|だいどころ}」「{本|ほん}」「{服|ふく}」……。{重|おも}い{箱|はこ}には{赤|あか}いシールが{貼|は}ってあります。', 'Ue ni kaite arimasu. "Daidokoro" "hon" "fuku"……. Omoi hako ni wa akai shiiru ga hatte arimasu.', 'Có ghi ở trên đấy. "Bếp", "sách", "quần áo"… Thùng nặng thì có dán nhãn đỏ.'],
      ['マルコ', 'b', 'なるほど。じゃ、{赤|あか}いシールの{箱|はこ}は{僕|ぼく}が{運|はこ}びます。', 'Naruhodo. Ja, akai shiiru no hako wa boku ga hakobimasu.', 'Ra vậy. Thế thùng nhãn đỏ để mình khuân.'],
      ['アンナ', 'a', '{私|わたし}は{軽|かる}い{箱|はこ}を{運|はこ}びますね。……リンさん、{冷蔵庫|れいぞうこ}は{運|はこ}ばなくてもいいんですか。', 'Watashi wa karui hako o hakobimasu ne. …… Rin-san, reizouko wa hakobanakute mo ii n desu ka.', 'Mình mang thùng nhẹ nhé. … Lin ơi, tủ lạnh không cần chở à?'],
      ['リン', 'c', 'ええ。{新|あたら}しい{部屋|へや}には{冷蔵庫|れいぞうこ}があるんです。{大家|おおや}さんが{用意|ようい}しておいてくれました。', 'Ee. Atarashii heya ni wa reizouko ga aru n desu. Ooya-san ga youi shite oite kuremashita.', 'Ừ. Phòng mới có tủ lạnh rồi. Chủ nhà đã chuẩn bị sẵn cho mình.'],
      ['マルコ', 'b', '（{新|あたら}しい{部屋|へや}で）ふう、{暑|あつ}いですね。', '(Atarashii heya de) Fuu, atsui desu ne.', '(Ở phòng mới) Phù, nóng quá.'],
      ['リン', 'c', 'すみません。{窓|まど}を{開|あ}けておきましょう。{冷房|れいぼう}もつけておきますね。', 'Sumimasen. Mado o akete okimashou. Reibou mo tsukete okimasu ne.', 'Xin lỗi nhé. Mở cửa sổ ra (để đó) đi. Mình bật cả điều hoà nữa.'],
      ['アンナ', 'a', 'あ、{棚|たな}の{上|うえ}に{何|なに}か{置|お}いてありますよ。……{手紙|てがみ}とお{菓子|かし}です。「ようこそ」と{書|か}いてあります。', 'A, tana no ue ni nanika oite arimasu yo. …… Tegami to okashi desu. "Youkoso" to kaite arimasu.', 'Ơ, trên giá có để cái gì kìa. … Thư với bánh kẹo. Có ghi "Chào mừng".'],
      ['リン', 'c', '{大家|おおや}さんからですね。うれしい！', 'Ooya-san kara desu ne. Ureshii!', 'Của chủ nhà đấy. Vui quá!'],
      ['マルコ', 'b', '{本棚|ほんだな}はどこに{置|お}きますか。', 'Hondana wa doko ni okimasu ka.', 'Giá sách để đâu?'],
      ['リン', 'c', '{窓|まど}の{横|よこ}にお{願|ねが}いします。{本|ほん}は{後|あと}で{私|わたし}が{並|なら}べますから、{箱|はこ}はそのままにしておいてください。', 'Mado no yoko ni onegai shimasu. Hon wa ato de watashi ga narabemasu kara, hako wa sono mama ni shite oite kudasai.', 'Để cạnh cửa sổ giúp mình. Sách thì lát nữa mình tự xếp, nên các cậu cứ để nguyên thùng đó.'],
      ['アンナ', 'a', 'この{鏡|かがみ}は{壁|かべ}に{掛|か}けましょうか。', 'Kono kagami wa kabe ni kakemashou ka.', 'Cái gương này mình treo lên tường nhé?'],
      ['リン', 'c', 'はい、お{願|ねが}いします。お{二人|ふたり}が{手伝|てつだ}ってくれて、{本当|ほんとう}に{助|たす}かりました。', 'Hai, onegai shimasu. Ofutari ga tetsudatte kurete, hontou ni tasukarimashita.', 'Vâng, nhờ cậu. Hai cậu giúp mình, thật sự đỡ quá.'],
    ]),
    {
      t: 'examples',
      items: [
        E('{車|くるま}は{下|した}に{止|と}めてあります。', 'Kuruma wa shita ni tomete arimasu.', 'Xe đã được đỗ sẵn ở dưới.'),
        E('{箱|はこ}の{上|うえ}に「{本|ほん}」と{書|か}いてあります。', 'Hako no ue ni "hon" to kaite arimasu.', 'Trên thùng có ghi chữ "sách".'),
        E('{重|おも}い{箱|はこ}には{赤|あか}いシールが{貼|は}ってあります。', 'Omoi hako ni wa akai shiiru ga hatte arimasu.', 'Thùng nặng có dán nhãn đỏ.'),
        E('{大家|おおや}さんが{冷蔵庫|れいぞうこ}を{用意|ようい}しておいてくれました。', 'Ooya-san ga reizouko o youi shite oite kuremashita.', 'Chủ nhà đã chuẩn bị sẵn tủ lạnh cho tôi.'),
        E('{箱|はこ}はそのままにしておいてください。', 'Hako wa sono mama ni shite oite kudasai.', 'Cứ để nguyên các thùng như vậy.'),
        E('{手伝|てつだ}ってくれて、{本当|ほんとう}に{助|たす}かりました。', 'Tetsudatte kurete, hontou ni tasukarimashita.', 'Các bạn giúp tôi, thật sự đỡ quá.'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ②',
      items: [
        '**{止|と}めてあります／{並|なら}べてあります／{書|か}いてあります／{貼|は}ってあります／{置|お}いてあります** — năm câu ～てある: ai đó (ở đây là マルコ, リン, chủ nhà) **đã cố ý làm**, và kết quả **vẫn còn** trước mắt. Vật đứng trước **が／は**, không phải を.',
        '**{用意|ようい}しておいてくれました** — hai mẫu chồng lên nhau: **～ておく** (chuẩn bị sẵn) + **～てくれる** (làm cho mình). Đọc: youi shite oite kuremashita. Cảm giác: "chủ nhà đã chuẩn bị sẵn — cho tôi, và tôi biết ơn".',
        '**{開|あ}けておきましょう／つけておきます** — ～ておく nghĩa "làm rồi để nguyên như thế" (để cửa sổ mở, để điều hoà chạy). **そのままにしておいてください** = "cứ để nguyên như vậy" — câu dặn rất hay dùng.',
        '**{運|はこ}ばなくてもいいんですか** — ôn ポイント 116 (không cần V) + んです. **{掛|か}けましょうか** — đề nghị làm giúp (ôn Bài 6), tự nhiên hơn ~~{掛|か}けてあげましょうか~~.',
        '**{手伝|てつだ}ってくれて、{助|たす}かりました** — **～てくれて** (thể て của くれる) nêu lý do mình biết ơn. Câu cảm ơn chuẩn sau khi được giúp: **～てくれて、ありがとう／{助|たす}かりました**.',
      ],
    },

    /* ── ③ 新しい部屋で ── */
    { t: 'h', text: '③ {新|あたら}しい{部屋|へや}で — Chào hàng xóm, hỏi cách đổ rác, gọi chủ nhà' },
    {
      t: 'canh',
      anh: ['house', 'woman-student', 'woman', 'wrapped-gift', 'wastebasket'],
      caption: 'Chiều hôm đó, リン mang một hộp bánh nhỏ sang chào cô 山口 ở phòng bên cạnh. Cô 山口 chỉ cho リン quy định đổ rác của khu nhà.',
    },
    {
      t: 'p',
      text: 'Tình huống: ở Nhật, chuyển đến chỗ mới thì nên **mang quà nhỏ sang chào hàng xóm (あいさつ)**. **リン** sang chào cô **{山口|やまぐち}** phòng bên. Cô 山口 giải thích **quy định đổ rác** — thứ rất quan trọng với người mới ở Nhật: rác **cháy được ({燃|も}えるごみ)** và **không cháy được ({燃|も}えないごみ)** đổ vào ngày khác nhau, ở **chỗ tập kết rác (ごみ{置|お}き{場|ば})**, nơi **có dán** bảng quy định (**{貼|は}ってあります**). Tối đó đèn phòng tắm không sáng, リン gọi điện **nhờ chủ nhà** (**{見|み}ていただけませんか**).',
    },
    DL('Chào hàng xóm — "Từ nay mong cô giúp đỡ"', [
      ['リン', 'c', 'ごめんください。{隣|となり}の{201号室|にひゃくいちごうしつ}に{引|ひ}っ{越|こ}してきたリンと{申|もう}します。', 'Gomen kudasai. Tonari no nihyaku ichi-goushitsu ni hikkoshite kita Rin to moushimasu.', 'Xin phép ạ. Cháu là Lin, mới chuyển đến phòng 201 bên cạnh.'],
      ['{山口|やまぐち}', 'a', 'はい。あら、こんにちは。', 'Hai. Ara, konnichiwa.', 'Vâng. Ồ, chào cháu.'],
      ['リン', 'c', 'これからお{世話|せわ}になります。よろしくお{願|ねが}いします。これ、ほんの{気持|きも}ちですが、どうぞ。', 'Korekara osewa ni narimasu. Yoroshiku onegai shimasu. Kore, honno kimochi desu ga, douzo.', 'Từ nay mong cô giúp đỡ. Rất mong được cô chỉ bảo. Đây là chút quà nhỏ, mời cô nhận cho.'],
      ['{山口|やまぐち}', 'a', 'まあ、ご{丁寧|ていねい}にありがとう。{山口|やまぐち}です。こちらこそよろしくね。', 'Maa, goteinei ni arigatou. Yamaguchi desu. Kochira koso yoroshiku ne.', 'Ôi, cháu chu đáo quá, cảm ơn nhé. Cô là Yamaguchi. Cô cũng mong được làm quen.'],
      ['{山口|やまぐち}', 'a', 'ごみの{出|だ}し{方|かた}は、もう{聞|き}きましたか。', 'Gomi no dashikata wa, mou kikimashita ka.', 'Cách đổ rác cháu đã được nghe chưa?'],
      ['リン', 'c', 'いいえ、まだです。よかったら、{教|おし}えていただけませんか。', 'Iie, mada desu. Yokattara, oshiete itadakemasen ka.', 'Dạ chưa ạ. Nếu được, cô chỉ giúp cháu được không ạ?'],
      ['{山口|やまぐち}', 'a', 'ええ。{燃|も}えるごみは{月曜日|げつようび}と{木曜日|もくようび}です。{朝|あさ}{8時|はちじ}までに、{下|した}のごみ{置|お}き{場|ば}に{出|だ}してください。', 'Ee. Moeru gomi wa getsuyoubi to mokuyoubi desu. Asa hachiji made ni, shita no gomi okiba ni dashite kudasai.', 'Ừ. Rác cháy được thì thứ Hai và thứ Năm. Trước 8 giờ sáng, cháu mang xuống chỗ tập kết rác ở dưới nhé.'],
      ['リン', 'c', '{前|まえ}の{晩|ばん}に{出|だ}しておいてもいいですか。{朝|あさ}は{早|はや}く{学校|がっこう}へ{行|い}くので。', 'Mae no ban ni dashite oite mo ii desu ka. Asa wa hayaku gakkou e iku node.', 'Cháu để rác ra từ tối hôm trước có được không ạ? Vì buổi sáng cháu đi học sớm.'],
      ['{山口|やまぐち}', 'a', 'うーん、{夜|よる}はカラスが{来|く}るから、{出|だ}さないでね。ごみ{置|お}き{場|ば}に{規則|きそく}の{紙|かみ}が{貼|は}ってありますよ。', 'Uun, yoru wa karasu ga kuru kara, dasanaide ne. Gomi okiba ni kisoku no kami ga hatte arimasu yo.', 'Ừm, buổi tối quạ hay đến bới nên đừng để ra nhé. Ở chỗ tập kết rác có dán tờ quy định đấy.'],
      ['リン', 'c', 'わかりました。{後|あと}でよく{読|よ}んでおきます。', 'Wakarimashita. Ato de yoku yonde okimasu.', 'Cháu hiểu rồi ạ. Lát nữa cháu sẽ đọc kỹ.'],
      ['{山口|やまぐち}', 'a', 'それから、{駅前|えきまえ}の{安|やす}いスーパー、{今度|こんど}{案内|あんない}しますね。{困|こま}ったことがあったら、いつでも{言|い}ってください。', 'Sorekara, ekimae no yasui suupaa, kondo annai shimasu ne. Komatta koto ga attara, itsu demo itte kudasai.', 'À, siêu thị rẻ trước ga, hôm nào cô dẫn cháu đi. Có gì khó khăn thì cứ nói với cô bất cứ lúc nào.'],
      ['リン', 'c', 'ご{親切|しんせつ}にありがとうございます。{本当|ほんとう}に{助|たす}かります。', 'Goshinsetsu ni arigatou gozaimasu. Hontou ni tasukarimasu.', 'Cô tốt quá, cháu cảm ơn cô. Thật sự đỡ cho cháu nhiều lắm.'],
    ]),
    DL('③′ Tối hôm đó — gọi điện cho chủ nhà', [
      ['リン', 'c', 'もしもし、{201号室|にひゃくいちごうしつ}のリンです。すみません、お{風呂|ふろ}の{電気|でんき}がつかないんですが……。', 'Moshimoshi, nihyaku ichi-goushitsu no Rin desu. Sumimasen, ofuro no denki ga tsukanai n desu ga…….', 'A lô, cháu là Lin phòng 201. Xin lỗi, đèn phòng tắm không sáng ạ…'],
      ['{大家|おおや}さん', 'b', 'ああ、たぶん{電球|でんきゅう}が{古|ふる}いんだと{思|おも}います。{明日|あした}の{朝|あさ}、{見|み}に{行|い}きましょうか。', 'Aa, tabun denkyuu ga furui n da to omoimasu. Ashita no asa, mi ni ikimashou ka.', 'À, chắc là bóng đèn cũ rồi. Sáng mai tôi qua xem nhé?'],
      ['リン', 'c', 'すみません。{明日|あした}は{9時|くじ}から{授業|じゅぎょう}なんですが……。', 'Sumimasen. Ashita wa kuji kara jugyou na n desu ga…….', 'Xin lỗi ạ, mai cháu có giờ học từ 9 giờ…'],
      ['{大家|おおや}さん', 'b', '{大丈夫|だいじょうぶ}ですよ。{留守|るす}でも、{鍵|かぎ}を{持|も}っていますから。{電球|でんきゅう}を{取|と}り{替|か}えておきます。', 'Daijoubu desu yo. Rusu demo, kagi o motte imasu kara. Denkyuu o torikaete okimasu.', 'Không sao. Cháu đi vắng cũng được, tôi có chìa khoá mà. Tôi sẽ thay bóng đèn giúp.'],
      ['リン', 'c', 'じゃ、お{願|ねが}いします。{本当|ほんとう}にすみません。', 'Ja, onegai shimasu. Hontou ni sumimasen.', 'Vậy nhờ chú ạ. Thật phiền chú quá.'],
      ['{大家|おおや}さん', 'b', 'いえいえ。{直|なお}したら、テーブルの{上|うえ}にメモを{置|お}いておきますね。', 'Ieie. Naoshitara, teeburu no ue ni memo o oite okimasu ne.', 'Không có gì. Sửa xong tôi sẽ để lại mẩu giấy trên bàn nhé.'],
    ]),
    {
      t: 'examples',
      items: [
        E('これからお{世話|せわ}になります。よろしくお{願|ねが}いします。', 'Korekara osewa ni narimasu. Yoroshiku onegai shimasu.', 'Từ nay mong được giúp đỡ. Rất mong được chỉ bảo.'),
        E('ごみの{出|だ}し{方|かた}を{教|おし}えていただけませんか。', 'Gomi no dashikata o oshiete itadakemasen ka.', 'Chỉ giúp tôi cách đổ rác được không ạ? (rất lịch sự)'),
        E('{前|まえ}の{晩|ばん}に{出|だ}しておいてもいいですか。', 'Mae no ban ni dashite oite mo ii desu ka.', 'Để rác ra từ tối hôm trước có được không?'),
        E('ごみ{置|お}き{場|ば}に{規則|きそく}の{紙|かみ}が{貼|は}ってあります。', 'Gomi okiba ni kisoku no kami ga hatte arimasu.', 'Ở chỗ tập kết rác có dán tờ quy định.'),
        E('お{風呂|ふろ}の{電気|でんき}がつかないんですが……。', 'Ofuro no denki ga tsukanai n desu ga…….', 'Đèn phòng tắm không sáng ạ… (bỏ lửng = nhờ khéo)'),
        E('{電球|でんきゅう}を{取|と}り{替|か}えておきます。', 'Denkyuu o torikaete okimasu.', 'Tôi sẽ thay bóng đèn (sẵn) cho.'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ③ — chào hàng xóm kiểu Nhật',
      items: [
        '**ごめんください** — câu gọi cửa khi đến nhà người khác. **～と{申|もう}します** = ～です ở dạng khiêm nhường (học kỹ ở Bài 24); khi tự giới thiệu với người lớn hơn, nói câu cố định này là đủ.',
        '**これからお{世話|せわ}になります** — câu chào CỐ ĐỊNH khi bắt đầu ở / làm việc ở chỗ mới (nghĩa đen: "từ nay tôi sẽ được anh chị chăm lo"). **ほんの{気持|きも}ちですが** — khi đưa quà nhỏ ("chỉ là chút lòng thành"); câu cũ hơn là つまらないものですが.',
        '**{教|おし}えていただけませんか** — dạng **lịch sự nhất** của câu nhờ (いただく = もらう khiêm nhường). Bậc thang: {教|おし}えてくれる？ (bạn thân) → {教|おし}えてくれませんか → {教|おし}えてもらえませんか → {教|おし}えていただけませんか (người lạ, người lớn tuổi).',
        '**{出|だ}しておいてもいいですか** — ～ておく + ～てもいいですか (xin phép, ôn ポイント 89): "để sẵn ra có được không". **{出|だ}さないでね** — ôn ポイント 88, thân mật bỏ ください.',
        '**{電気|でんき}がつかないんですが……** — câu báo sự cố rồi **bỏ lửng**: người nghe hiểu là đang nhờ. **{見|み}に{行|い}きましょうか** = để tôi qua xem nhé (đề nghị làm giúp). **{留守|るす}でも** = dù (cháu) đi vắng — ôn ～ても ポイント 121.',
        '**たぶん～んだと{思|おも}います** — đoán nguyên nhân (ôn ポイント 123 + ポイント 104). **ご{丁寧|ていねい}に／ご{親切|しんせつ}に** = "anh chị thật chu đáo / thật tốt" — đáp lại khi được tặng quà, được giúp.',
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b18-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 50 từ N4: tìm phòng, đóng thùng & chuyển đồ, phòng mới, hàng xóm & rác, nhờ vả & cảm ơn',
  goal: 'Thuộc 50 từ N4 của chủ đề chuyển nhà: tìm phòng và thủ tục (家賃・大家さん・鍵・留守・返事), đóng thùng và chuyển đồ (段ボール・箱・包む・届ける・届く・宅配便・家具), sắp xếp phòng mới (棚・壁・掛ける・飾る・貼る・しまう・取り替える・直す), hàng xóm và quy định rác (近所・あいさつ・お世話になります・燃えるごみ・規則) và nhờ vả, cảm ơn (頼む・助かる・連れていく・戻る・返す) — biết luôn cặp động từ tự / tha để dùng ～てある và ～ている cho đúng.',
  minutes: 50,
  blocks: [
    {
      t: 'p',
      text: '**50 từ** chia 5 nhóm theo đúng trình tự một lần chuyển nhà: **A** tìm phòng & chuẩn bị (11) · **B** đóng thùng & chuyển đồ (10) · **C** sắp xếp phòng mới (13) · **D** hàng xóm & quy định (8) · **E** nhờ vả & cảm ơn (8). Từ đã học ở Bài 1–17 ({引|ひ}っ{越|こ}しします, {荷物|にもつ}, {運|はこ}びます, {片付|かたづ}けます, {手伝|てつだ}います, {捨|す}てます, ごみ, {貸|か}します, {借|か}ります, {並|なら}べます, {都合|つごう}, {布団|ふとん}, {親切|しんせつ}…) KHÔNG lặp lại — gặp trong câu ví dụ thì coi như ôn. Số **1 / 2 / 3** sau động từ = nhóm động từ; dòng **"+"** cho luôn **thể て** (cần cho cả ba mẫu ngữ pháp của bài) và cặp **tự / tha động từ** nếu có.',
    },
    {
      t: 'note',
      title: 'Cách học 50 từ trong 3 ngày',
      items: [
        '**Ngày 1** — nhóm A + B (21 từ): đọc to theo 🔊, che nghĩa tự nói; đọc to hội thoại ① và ② — phần lớn từ nhóm B nằm trong đó.',
        '**Ngày 2** — nhóm C (13 từ): nhìn quanh phòng mình, chỉ vào đồ vật nói thành câu ～てあります: {壁|かべ}にカレンダーが{掛|か}けてあります.',
        '**Ngày 3** — nhóm D + E (16 từ) + thẻ hình + bảng tự / tha động từ + trắc nghiệm cuối mục + viết tay 10 từ hay vào đề.',
        'Romaji: trường âm viết theo kana ({大家|おおや} → **ooya**, {冷房|れいぼう} → **reibou**, {水道|すいどう} → **suidou**, {段|だん}ボール → **danbooru**); âm ngắt っ viết đôi phụ âm ({貼|は}って → **hatte**, トラック → **torakku**).',
      ],
    },

    /* ── A ── */
    { t: 'h', text: 'A. Tìm phòng & chuẩn bị chuyển (11 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{一人暮|ひとりぐ}らし', pos: 'danh từ', ipa: 'hitorigurashi', vi: 'sống một mình', ex: '{一人暮|ひとりぐ}らしは{初|はじ}めてなので、{少|すこ}し{不安|ふあん}です。', exRo: 'Hitorigurashi wa hajimete na node, sukoshi fuan desu.', exVi: 'Lần đầu sống một mình nên tôi hơi lo.', more: '{一人|ひとり} + {暮|く}らし (cuộc sống — く đổi thành ぐ). {一人暮|ひとりぐ}らしをする／{一人暮|ひとりぐ}らしを{始|はじ}める. Đối: {家族|かぞく}と{住|す}む, {寮|りょう}に{住|す}む.' },
        { w: '{不動産屋|ふどうさんや}', pos: 'danh từ', ipa: "fudousan'ya", vi: 'văn phòng môi giới nhà đất, chỗ tìm phòng thuê', ex: '{不動産屋|ふどうさんや}で{駅|えき}に{近|ちか}い{部屋|へや}を{探|さが}してもらいました。', exRo: "Fudousan'ya de eki ni chikai heya o sagashite moraimashita.", exVi: 'Tôi đã nhờ văn phòng nhà đất tìm giúp một phòng gần ga.', more: '{不動産|ふどうさん} = bất động sản; ～{屋|や} = cửa hàng, người làm nghề (Bài 2: {本屋|ほんや}). Nói lịch sự: {不動産屋|ふどうさんや}さん.' },
        { w: '{家賃|やちん}', pos: 'danh từ', ipa: 'yachin', vi: 'tiền thuê nhà (hằng tháng)', ex: 'この{部屋|へや}の{家賃|やちん}は{1か月|いっかげつ}{5万円|ごまんえん}です。', exRo: 'Kono heya no yachin wa ikkagetsu goman en desu.', exVi: 'Tiền thuê căn phòng này là 5 vạn yên một tháng.', more: '{家賃|やちん}を{払|はら}う (trả tiền nhà) · {家賃|やちん}が{高|たか}い／{安|やす}い. Khi thuê phòng ở Nhật hay gặp: {敷金|しききん} (tiền cọc), {礼金|れいきん} (tiền "cảm ơn" chủ nhà — không trả lại).' },
        { w: '{大家|おおや}さん', pos: 'danh từ', ipa: 'ooya-san', vi: 'chủ nhà (người cho thuê)', ex: '{大家|おおや}さんに{部屋|へや}の{鍵|かぎ}をもらいました。', exRo: 'Ooya-san ni heya no kagi o moraimashita.', exVi: 'Tôi đã nhận chìa khoá phòng từ chủ nhà.', more: '⚠ **{大家|おおや}** đọc **おおや** (romaji **ooya**). Cùng chữ nhưng đọc たいか là "bậc thầy" — nghĩa khác hẳn. Người thuê nhà = {住|す}んでいる{人|ひと}.' },
        { w: '{二階建|にかいだ}て', pos: 'danh từ', ipa: 'nikaidate', vi: 'nhà / toà nhà 2 tầng', ex: '{私|わたし}のアパートは{古|ふる}い{二階建|にかいだ}てです。', exRo: 'Watashi no apaato wa furui nikaidate desu.', exVi: 'Căn hộ của tôi là một dãy nhà 2 tầng cũ.', more: '～{階建|かいだ}て = nhà ~ tầng: {三階建|さんがいだ}て (sangaidate). **{一戸建|いっこだ}て** = nhà riêng (không phải căn hộ). {建|た}てる = xây (nhà). Chữ **建** là chữ Hán mới của bài.' },
        { w: '{鍵|かぎ}', pos: 'danh từ', ipa: 'kagi', vi: 'chìa khoá; ổ khoá', ex: '{出|で}かけるときは、{必|かなら}ず{鍵|かぎ}をかけてください。', exRo: 'Dekakeru toki wa, kanarazu kagi o kakete kudasai.', exVi: 'Khi ra ngoài nhất định phải khoá cửa.', more: '**{鍵|かぎ}をかける** (khoá cửa) · {鍵|かぎ}を{開|あ}ける (mở khoá) · {合|あ}い{鍵|かぎ} (chìa dự phòng). Chữ 鍵 nhiều nét, cấp cao — viết **かぎ** cũng được.' },
        { w: '{用意|ようい}します［{用意|ようい}する］3', pos: 'động từ nhóm 3', ipa: 'youi shimasu [youi suru]', vi: 'chuẩn bị sẵn (đồ vật, thứ cần dùng)', ex: '{引|ひ}っ{越|こ}しの{前|まえ}に、{段|だん}ボールを{用意|ようい}しました。', exRo: 'Hikkoshi no mae ni, danbooru o youi shimashita.', exVi: 'Trước khi chuyển nhà, tôi đã chuẩn bị sẵn thùng các-tông.', more: '+ て: {用意|ようい}して. {飲|の}み{物|もの}を{用意|ようい}する · ご{用意|ようい}ください (xin hãy chuẩn bị — biển thông báo). So với {準備|じゅんび} (Bài 12): xem bảng "Từ dễ nhầm".' },
        { w: '{支度|したく}します［{支度|したく}する］3', pos: 'động từ nhóm 3', ipa: 'shitaku shimasu [shitaku suru]', vi: 'sửa soạn, chuẩn bị (việc sắp làm ngay: ra ngoài, nấu cơm)', ex: '{早|はや}く{支度|したく}してください。もうすぐ{出|で}かけますよ。', exRo: 'Hayaku shitaku shite kudasai. Mousugu dekakemasu yo.', exVi: 'Sửa soạn nhanh lên. Sắp ra ngoài rồi đấy.', more: '+ て: {支度|したく}して. {出|で}かける{支度|したく} (sửa soạn đi ra ngoài) · {夕食|ゆうしょく}の{支度|したく} (chuẩn bị bữa tối). Văn nói hằng ngày, việc ngắn ngay trước mắt.' },
        { w: '{留守|るす}', pos: 'danh từ', ipa: 'rusu', vi: 'đi vắng, không có ở nhà', ex: '{昨日|きのう}{荷物|にもつ}が{来|き}ましたが、{留守|るす}でした。', exRo: 'Kinou nimotsu ga kimashita ga, rusu deshita.', exVi: 'Hôm qua hàng đến nhưng tôi đi vắng.', more: '{留守|るす}にする (đi vắng) · {留守番|るすばん} (trông nhà) · {留守番電話|るすばんでんわ} (hộp thư thoại). Hàng đến lúc {留守|るす} → người giao để lại {不在票|ふざいひょう} (phiếu báo vắng nhà).' },
        { w: '{返事|へんじ}', pos: 'danh từ / động từ nhóm 3 (返事する)', ipa: 'henji', vi: 'lời đáp, hồi âm', ex: '{大家|おおや}さんにメールを{送|おく}りましたが、まだ{返事|へんじ}が{来|き}ません。', exRo: 'Ooya-san ni meeru o okurimashita ga, mada henji ga kimasen.', exVi: 'Tôi đã gửi mail cho chủ nhà nhưng chưa có hồi âm.', more: '{返事|へんじ}をする · {返事|へんじ}を{書|か}く · 「はい」と{返事|へんじ}する (đáp "vâng" khi được gọi). Chữ **返** là chữ Hán mới.' },
        { w: '{利用|りよう}します［{利用|りよう}する］3', pos: 'động từ nhóm 3', ipa: 'riyou shimasu [riyou suru]', vi: 'sử dụng (dịch vụ, cơ sở, phương tiện)', ex: '{引|ひ}っ{越|こ}しのとき、{学生|がくせい}{割引|わりびき}を{利用|りよう}しました。', exRo: 'Hikkoshi no toki, gakusei waribiki o riyou shimashita.', exVi: 'Lúc chuyển nhà tôi đã dùng ưu đãi giảm giá cho sinh viên.', more: '+ て: {利用|りよう}して. Hay dùng cho dịch vụ / cơ sở: {図書館|としょかん}・バス・アプリを{利用|りよう}する. {使|つか}う rộng hơn (cả đồ vật nhỏ: ペンを{使|つか}う, không nói ~~ペンを{利用|りよう}する~~).' },
      ],
    },

    /* ── B ── */
    { t: 'h', text: 'B. Đóng thùng & chuyển đồ (10 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{段|だん}ボール', pos: 'danh từ', ipa: 'danbooru', vi: 'bìa các-tông; thùng các-tông', ex: '{段|だん}ボールに{本|ほん}を{入|い}れました。', exRo: 'Danbooru ni hon o iremashita.', exVi: 'Tôi cho sách vào thùng các-tông.', more: '{段|だん}ボール{箱|ばこ} (thùng các-tông — 箱 đọc **ばこ**). 段 (tầng, nấc — các lớp giấy gợn sóng) + ボール (board). Chữ **段** là chữ Hán mới.' },
        { w: '{箱|はこ}', pos: 'danh từ', ipa: 'hako', vi: 'hộp, thùng', ex: 'この{箱|はこ}は{重|おも}すぎて、{一人|ひとり}で{持|も}てません。', exRo: 'Kono hako wa omosugite, hitori de motemasen.', exVi: 'Cái thùng này nặng quá, một mình không xách nổi.', more: '{箱|はこ}に{入|い}れる · {箱|はこ}を{開|あ}ける. Sau danh từ khác đọc **ばこ**: ごみ{箱|ばこ} (thùng rác), {段|だん}ボール{箱|ばこ}, {筆箱|ふでばこ} (hộp bút). Chữ **箱** là chữ Hán mới ✍.' },
        { w: '{包|つつ}みます［{包|つつ}む］1', pos: 'động từ nhóm 1', ipa: 'tsutsumimasu [tsutsumu]', vi: 'gói, bọc', ex: 'お{皿|さら}は{新聞紙|しんぶんし}で{包|つつ}んでから、{箱|はこ}に{入|い}れます。', exRo: 'Osara wa shinbunshi de tsutsunde kara, hako ni iremasu.', exVi: 'Đĩa thì bọc bằng giấy báo rồi mới cho vào thùng.', more: '+ て: **{包|つつ}んで** (む → んで). プレゼントを{包|つつ}む (gói quà) · {紙|かみ}で{包|つつ}む. Romaji **tsutsumu** (つ・つ・む).' },
        { w: '{届|とど}けます［{届|とど}ける］2', pos: 'động từ nhóm 2 (tha động từ)', ipa: 'todokemasu [todokeru]', vi: 'mang đến, giao đến; nộp (giấy tờ)', ex: '{宅配便|たくはいびん}の{人|ひと}が{荷物|にもつ}を{届|とど}けてくれました。', exRo: 'Takuhaibin no hito ga nimotsu o todokete kuremashita.', exVi: 'Nhân viên chuyển phát đã mang hàng đến cho tôi.', more: '+ て: {届|とど}けて. Cặp: {荷物|にもつ}**を**{届|とど}ける (người giao — tha) ↔ {荷物|にもつ}**が**{届|とど}く (hàng tới — tự). {落|お}とし{物|もの}を{交番|こうばん}に{届|とど}ける (mang đồ nhặt được đến đồn cảnh sát).' },
        { w: '{届|とど}きます［{届|とど}く］1', pos: 'động từ nhóm 1 (tự động từ)', ipa: 'todokimasu [todoku]', vi: '(hàng, thư) đến nơi; với tới', ex: '{国|くに}の{母|はは}から{荷物|にもつ}が{届|とど}きました。', exRo: 'Kuni no haha kara nimotsu ga todokimashita.', exVi: 'Hàng của mẹ gửi từ quê nhà đã tới.', more: '+ て: {届|とど}いて (く → いて). {手|て}が{届|とど}かない = với không tới: {棚|たな}の{上|うえ}に{手|て}が{届|とど}きません.' },
        { w: '{宅配便|たくはいびん}', pos: 'danh từ', ipa: 'takuhaibin', vi: 'dịch vụ chuyển phát tận nhà', ex: '{重|おも}い{荷物|にもつ}は{宅配便|たくはいびん}で{新|あたら}しい{部屋|へや}に{送|おく}ります。', exRo: 'Omoi nimotsu wa takuhaibin de atarashii heya ni okurimasu.', exVi: 'Đồ nặng thì tôi gửi chuyển phát đến phòng mới.', more: '宅 (nhà) + 配 (phân phát) + 便 (chuyến). Gửi ở コンビニ cũng được. Hàng đến lúc vắng nhà → {再配達|さいはいたつ} (giao lại). Chữ **宅** là chữ Hán mới.' },
        { w: 'トラック', pos: 'danh từ', ipa: 'torakku', vi: 'xe tải', ex: '{引|ひ}っ{越|こ}し{屋|や}さんのトラックが{来|き}ました。', exRo: 'Hikkoshiya-san no torakku ga kimashita.', exVi: 'Xe tải của công ty chuyển nhà đã tới.', more: 'Romaji **torakku** (っ = đôi k). レンタカーでトラックを{借|か}りる. {引|ひ}っ{越|こ}し{屋|や} = công ty / người làm dịch vụ chuyển nhà.' },
        { w: '{家具|かぐ}', pos: 'danh từ', ipa: 'kagu', vi: 'đồ nội thất (bàn, ghế, tủ, giường…)', ex: '{新|あたら}しい{部屋|へや}に{合|あ}う{家具|かぐ}を{買|か}いたいです。', exRo: 'Atarashii heya ni au kagu o kaitai desu.', exVi: 'Tôi muốn mua đồ nội thất hợp với phòng mới.', more: '**{家具付|かぐつ}き** = có sẵn nội thất (hay thấy trên tin cho thuê). {家具|かぐ}を{置|お}く／{動|うご}かす. Chữ **具** là chữ Hán mới.' },
        { w: '{道具|どうぐ}', pos: 'danh từ', ipa: 'dougu', vi: 'dụng cụ, đồ dùng', ex: '{棚|たな}を{作|つく}る{道具|どうぐ}を{貸|か}してもらえませんか。', exRo: 'Tana o tsukuru dougu o kashite moraemasen ka.', exVi: 'Bạn cho tôi mượn dụng cụ làm giá kệ được không?', more: '{掃除|そうじ}{道具|どうぐ} (đồ quét dọn) · {料理|りょうり}の{道具|どうぐ} · {大工道具|だいくどうぐ} (đồ thợ mộc). 道 (đường) + 具 (đồ dùng).' },
        { w: '{壊|こわ}します［{壊|こわ}す］1', pos: 'động từ nhóm 1 (tha động từ)', ipa: 'kowashimasu [kowasu]', vi: 'làm hỏng, làm vỡ, phá', ex: '{運|はこ}ぶとき、{気|き}をつけないと、{家具|かぐ}を{壊|こわ}しますよ。', exRo: 'Hakobu toki, ki o tsukenai to, kagu o kowashimasu yo.', exVi: 'Lúc khiêng mà không cẩn thận thì làm hỏng đồ đấy.', more: '+ て: {壊|こわ}して. Cặp: {椅子|いす}**を**{壊|こわ}す (ai đó làm hỏng — tha) ↔ {椅子|いす}**が**{壊|こわ}れる (tự hỏng — Bài 15). Bụng: おなかを{壊|こわ}す (đau bụng, rối loạn tiêu hoá).' },
      ],
    },

    /* ── C ── */
    { t: 'h', text: 'C. Sắp xếp phòng mới — đồ đạc & việc làm (13 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{引|ひ}き{出|だ}し', pos: 'danh từ', ipa: 'hikidashi', vi: 'ngăn kéo', ex: '{鍵|かぎ}は{机|つくえ}の{引|ひ}き{出|だ}しに{入|い}れてあります。', exRo: 'Kagi wa tsukue no hikidashi ni irete arimasu.', exVi: 'Chìa khoá đã được cất trong ngăn kéo bàn.', more: '{引|ひ}く (kéo) + {出|だ}す (ra) = cái kéo ra được. {引|ひ}き{出|だ}しを{開|あ}ける／{閉|し}める · {一番上|いちばんうえ}の{引|ひ}き{出|だ}し (ngăn trên cùng).' },
        { w: '{押|お}し{入|い}れ', pos: 'danh từ', ipa: 'oshiire', vi: 'tủ âm tường kiểu Nhật (cất chăn đệm)', ex: '{布団|ふとん}は{押|お}し{入|い}れにしまってください。', exRo: 'Futon wa oshiire ni shimatte kudasai.', exVi: 'Hãy cất chăn đệm vào tủ âm tường.', more: '⚠ Romaji **oshiire** (お・し・い・れ — 4 âm). Phòng {和室|わしつ} gần như luôn có {押|お}し{入|い}れ; phòng kiểu Tây có クローゼット.' },
        { w: '{棚|たな}', pos: 'danh từ', ipa: 'tana', vi: 'giá, kệ', ex: '{棚|たな}の{上|うえ}に{家族|かぞく}の{写真|しゃしん}が{飾|かざ}ってあります。', exRo: 'Tana no ue ni kazoku no shashin ga kazatte arimasu.', exVi: 'Trên kệ có bày ảnh gia đình.', more: '**{本棚|ほんだな}** (giá sách — 棚 đọc **だな**) · {棚|たな}に{並|なら}べる (xếp lên kệ) · {食器棚|しょっきだな} (tủ chén bát).' },
        { w: '{壁|かべ}', pos: 'danh từ', ipa: 'kabe', vi: 'tường, vách', ex: '{壁|かべ}にカレンダーが{掛|か}けてあります。', exRo: 'Kabe ni karendaa ga kakete arimasu.', exVi: 'Trên tường có treo tờ lịch.', more: '{壁|かべ}が{薄|うす}い (tường mỏng — nghe rõ tiếng phòng bên: lý do người Nhật giữ yên lặng ban đêm). {壁|かべ}に{掛|か}ける／{貼|は}る.' },
        { w: '{鏡|かがみ}', pos: 'danh từ', ipa: 'kagami', vi: 'cái gương', ex: '{玄関|げんかん}に{大|おお}きい{鏡|かがみ}を{掛|か}けました。', exRo: 'Genkan ni ookii kagami o kakemashita.', exVi: 'Tôi đã treo một tấm gương lớn ở lối vào.', more: '{鏡|かがみ}を{見|み}る (soi gương). Khác **{眼鏡|めがね}** (kính đeo mắt — Bài 13): cùng chữ 鏡 nhưng ghép với 眼 đọc めがね.' },
        { w: '{掛|か}けます［{掛|か}ける］2', pos: 'động từ nhóm 2 (tha động từ)', ipa: 'kakemasu [kakeru]', vi: 'treo; (gọi điện, khoá cửa, gây phiền…)', ex: 'コートはここに{掛|か}けてください。', exRo: 'Kooto wa koko ni kakete kudasai.', exVi: 'Áo khoác xin treo ở đây.', more: '+ て: {掛|か}けて. Một động từ — nhiều cụm: {壁|かべ}に{掛|か}ける (treo) · {電話|でんわ}をかける · {鍵|かぎ}をかける · {迷惑|めいわく}をかける (gây phiền). Tự động từ: {掛|か}かる ({壁|かべ}に{絵|え}が{掛|か}かっている). Chữ **掛** là chữ Hán mới.' },
        { w: '{飾|かざ}ります［{飾|かざ}る］1', pos: 'động từ nhóm 1', ipa: 'kazarimasu [kazaru]', vi: 'trang trí, bày (cho đẹp)', ex: '{新|あたら}しい{部屋|へや}に{花|はな}を{飾|かざ}りました。', exRo: 'Atarashii heya ni hana o kazarimashita.', exVi: 'Tôi đã cắm hoa trang trí căn phòng mới.', more: '+ て: {飾|かざ}って. {写真|しゃしん}を{飾|かざ}る · {飾|かざ}り (đồ trang trí) · お{正月|しょうがつ}の{飾|かざ}り.' },
        { w: '{貼|は}ります［{貼|は}る］1', pos: 'động từ nhóm 1', ipa: 'harimasu [haru]', vi: 'dán', ex: '{冷蔵庫|れいぞうこ}にごみの{日|ひ}の{表|ひょう}を{貼|は}りました。', exRo: 'Reizouko ni gomi no hi no hyou o harimashita.', exVi: 'Tôi đã dán bảng lịch đổ rác lên tủ lạnh.', more: '+ て: **{貼|は}って** (hatte). ポスター／シール／{切手|きって}を{貼|は}る. Chữ 貼 ít gặp ở N4 — đọc được là đủ; nhiều nơi viết はる.' },
        { w: 'しまいます［しまう］1', pos: 'động từ nhóm 1', ipa: 'shimaimasu [shimau]', vi: 'cất (vào chỗ của nó)', ex: '{冬|ふゆ}の{服|ふく}は{押|お}し{入|い}れにしまいました。', exRo: 'Fuyu no fuku wa oshiire ni shimaimashita.', exVi: 'Quần áo mùa đông tôi đã cất vào tủ âm tường.', more: '+ て: しまって. N を N(chỗ) に しまう. ⚠ Bài 19 sẽ học **～てしまう** (lỡ làm, làm xong hết) — cùng gốc nhưng là mẫu ngữ pháp khác; ở đây しまう là động từ thường "cất".' },
        { w: '{取|と}り{替|か}えます［{取|と}り{替|か}える］2', pos: 'động từ nhóm 2', ipa: 'torikaemasu [torikaeru]', vi: 'thay (cái mới), đổi', ex: '{古|ふる}い{電球|でんきゅう}を{新|あたら}しいのに{取|と}り{替|か}えました。', exRo: 'Furui denkyuu o atarashii no ni torikaemashita.', exVi: 'Tôi đã thay bóng đèn cũ bằng cái mới.', more: '+ て: {取|と}り{替|か}えて. **AをBに{取|と}り{替|か}える** (thay A bằng B). Ở cửa hàng: サイズが{合|あ}わないので、{取|と}り{替|か}えてもらえませんか (đổi giúp được không?).' },
        { w: '{直|なお}します［{直|なお}す］1', pos: 'động từ nhóm 1 (tha động từ)', ipa: 'naoshimasu [naosu]', vi: 'sửa (đồ hỏng, lỗi sai)', ex: '{大家|おおや}さんが{壊|こわ}れたドアを{直|なお}してくれました。', exRo: 'Ooya-san ga kowareta doa o naoshite kuremashita.', exVi: 'Chủ nhà đã sửa cái cửa hỏng cho tôi.', more: '+ て: {直|なお}して. Cặp: {直|なお}す (tha) ↔ {直|なお}る (tự — ドアが{直|なお}った). Sửa bài: {作文|さくぶん}を{直|なお}す. ⚠ Khác **{治|なお}す** (chữa bệnh — Bài 12): cùng đọc なおす.' },
        { w: '{冷房|れいぼう}／{暖房|だんぼう}', pos: 'danh từ', ipa: 'reibou / danbou', vi: 'điều hoà làm mát / máy sưởi', ex: '{暑|あつ}いですから、{冷房|れいぼう}をつけておきましょう。', exRo: 'Atsui desu kara, reibou o tsukete okimashou.', exVi: 'Nóng quá nên bật sẵn điều hoà đi.', more: '{冷房|れいぼう}／{暖房|だんぼう}をつける・{消|け}す. Cái máy gọi là **エアコン** (vừa mát vừa sưởi). 冷 (lạnh) + 房 (phòng), 暖 (ấm) + 房.' },
        { w: '{水道|すいどう}・ガス', pos: 'danh từ', ipa: 'suidou / gasu', vi: 'nước máy / khí ga', ex: '{引|ひ}っ{越|こ}す{前|まえ}に、{電気|でんき}と{水道|すいどう}とガスの{会社|かいしゃ}に{連絡|れんらく}しておきます。', exRo: 'Hikkosu mae ni, denki to suidou to gasu no kaisha ni renraku shite okimasu.', exVi: 'Trước khi chuyển nhà, tôi báo trước cho công ty điện, nước và ga.', more: 'Ở Nhật người thuê nhà **tự báo** chuyển đi / chuyển đến cho từng công ty. {水道代|すいどうだい}・ガス{代|だい} = tiền nước, tiền ga. ガスが{出|で}ない (không có ga).' },
      ],
    },

    /* ── D ── */
    { t: 'h', text: 'D. Hàng xóm & quy định (8 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{近所|きんじょ}', pos: 'danh từ', ipa: 'kinjo', vi: 'hàng xóm, khu gần nhà', ex: '{近所|きんじょ}に{安|やす}いスーパーがあって、{便利|べんり}です。', exRo: 'Kinjo ni yasui suupaa ga atte, benri desu.', exVi: 'Gần nhà có siêu thị rẻ, tiện lắm.', more: '{近所|きんじょ}の{人|ひと} (hàng xóm) · ご{近所|きんじょ} (lịch sự). **{隣|となり}** (Bài 7) chỉ nhà / phòng **ngay sát bên**; {近所|きんじょ} là cả khu xung quanh.' },
        { w: 'あいさつします［あいさつする］3', pos: 'động từ nhóm 3', ipa: 'aisatsu shimasu [aisatsu suru]', vi: 'chào hỏi', ex: '{引|ひ}っ{越|こ}したら、{隣|となり}の{人|ひと}にあいさつしましょう。', exRo: 'Hikkoshitara, tonari no hito ni aisatsu shimashou.', exVi: 'Chuyển đến rồi thì sang chào nhà bên cạnh nhé.', more: '+ て: あいさつして. 人**に**あいさつする. Chữ Hán {挨拶|あいさつ} rất khó (cấp N1) — thường viết かな. {引|ひ}っ{越|こ}しのあいさつ = đi chào khi mới chuyển đến (thường kèm quà nhỏ).' },
        { w: 'お{宅|たく}', pos: 'danh từ (lịch sự)', ipa: 'otaku', vi: 'nhà (của người khác — nói lịch sự)', ex: '{先生|せんせい}のお{宅|たく}はどちらですか。', exRo: 'Sensei no otaku wa dochira desu ka.', exVi: 'Nhà của thầy ở đâu ạ?', more: 'Nhà MÌNH: うち／{家|いえ}; nhà NGƯỜI KHÁC (lịch sự): お{宅|たく}. {自宅|じたく} = nhà riêng của mình (trên giấy tờ). {宅配便|たくはいびん} cũng có chữ 宅.' },
        { w: 'お{世話|せわ}になります', pos: 'cụm chào cố định', ipa: 'osewa ni narimasu', vi: '(từ nay) mong được giúp đỡ; cảm ơn vì luôn giúp đỡ', ex: '{今日|きょう}から{隣|となり}に{住|す}みます。お{世話|せわ}になります。', exRo: 'Kyou kara tonari ni sumimasu. Osewa ni narimasu.', exVi: 'Từ hôm nay tôi ở bên cạnh. Mong được giúp đỡ.', more: 'Quá khứ **お{世話|せわ}になりました** — cảm ơn khi rời đi / kết thúc. {世話|せわ}をする = chăm sóc ({犬|いぬ}の{世話|せわ}). Câu chào email công việc: いつもお{世話|せわ}になっております (N3).' },
        { w: '{燃|も}えるごみ／{燃|も}えないごみ', pos: 'danh từ (cụm)', ipa: 'moeru gomi / moenai gomi', vi: 'rác cháy được / rác không cháy được', ex: '{燃|も}えないごみは{月|つき}に{2回|にかい}しか{出|だ}せません。', exRo: 'Moenai gomi wa tsuki ni nikai shika dasemasen.', exVi: 'Rác không cháy được mỗi tháng chỉ đổ được 2 lần.', more: '{燃|も}える = cháy. Ngoài ra: **{資源|しげん}ごみ** (rác tái chế: chai, lon, giấy) · **{粗大|そだい}ごみ** (đồ lớn: bàn ghế — phải đăng ký, trả phí). Mỗi khu có lịch riêng.' },
        { w: 'ごみ{置|お}き{場|ば}', pos: 'danh từ', ipa: 'gomi okiba', vi: 'chỗ tập kết rác (của khu nhà)', ex: 'ごみは{朝|あさ}、ごみ{置|お}き{場|ば}に{出|だ}してください。', exRo: 'Gomi wa asa, gomi okiba ni dashite kudasai.', exVi: 'Rác thì buổi sáng hãy mang ra chỗ tập kết.', more: '{置|お}く (đặt) + {場|ば} (chỗ). **ごみを{出|だ}す** = đổ rác (mang ra chỗ tập kết). {自転車置|じてんしゃお}き{場|ば} = chỗ để xe đạp.' },
        { w: '{規則|きそく}', pos: 'danh từ', ipa: 'kisoku', vi: 'quy định, nội quy', ex: 'この{寮|りょう}は{規則|きそく}が{厳|きび}しくて、{夜|よる}{10時|じゅうじ}までに{帰|かえ}らなければなりません。', exRo: 'Kono ryou wa kisoku ga kibishikute, yoru juuji made ni kaeranakereba narimasen.', exVi: 'Ký túc xá này nội quy nghiêm, phải về trước 10 giờ tối.', more: '**{規則|きそく}を{守|まも}る** (giữ quy định — 守 Bài 16) · {規則|きそく}{正|ただ}しい (đều đặn: {規則|きそく}{正|ただ}しい{生活|せいかつ}). Văn nói: ルール.' },
        { w: 'お{礼|れい}', pos: 'danh từ', ipa: 'orei', vi: 'lời cảm ơn; quà / việc làm để cảm ơn', ex: '{手伝|てつだ}ってくれた{友達|ともだち}に、お{礼|れい}を{言|い}いました。', exRo: 'Tetsudatte kureta tomodachi ni, orei o iimashita.', exVi: 'Tôi đã nói lời cảm ơn với những người bạn giúp mình.', more: 'お{礼|れい}を{言|い}う · **お{礼|れい}に～** (để cảm ơn thì ~): お{礼|れい}に{晩|ばん}ご{飯|はん}をごちそうしました. {失礼|しつれい} cũng có chữ 礼. Chữ **礼** là chữ Hán mới.' },
      ],
    },

    /* ── E ── */
    { t: 'h', text: 'E. Nhờ vả & cảm ơn — động từ đi với ～てあげる・くれる・もらう (8 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{頼|たの}みます［{頼|たの}む］1', pos: 'động từ nhóm 1', ipa: 'tanomimasu [tanomu]', vi: 'nhờ, nhờ vả; gọi (món, dịch vụ)', ex: '{友達|ともだち}に{引|ひ}っ{越|こ}しの{手伝|てつだ}いを{頼|たの}みました。', exRo: 'Tomodachi ni hikkoshi no tetsudai o tanomimashita.', exVi: 'Tôi đã nhờ bạn giúp chuyển nhà.', more: '+ て: **{頼|たの}んで**. **人に～を{頼|たの}む** · ピザを{頼|たの}む (gọi pizza) · {頼|たの}みがある (có việc muốn nhờ). Chữ **頼** là chữ Hán mới.' },
        { w: '{助|たす}かります［{助|たす}かる］1', pos: 'động từ nhóm 1 (tự động từ)', ipa: 'tasukarimasu [tasukaru]', vi: 'được cứu; "đỡ cho tôi quá" (nhờ được giúp)', ex: '{車|くるま}を{貸|か}してくれて、{助|たす}かりました。', exRo: 'Kuruma o kashite kurete, tasukarimashita.', exVi: 'Cậu cho mượn xe, đỡ cho mình quá.', more: 'Câu đáp khi được đề nghị giúp: **{助|たす}かります！**／それは{助|たす}かります. Cặp: {助|たす}ける (tha — giúp, cứu: {人|ひと}を{助|たす}ける). Chữ **助** là chữ Hán mới.' },
        { w: '{連|つ}れていきます［{連|つ}れていく］1', pos: 'động từ nhóm 1 (cụm)', ipa: 'tsurete ikimasu [tsurete iku]', vi: 'dẫn (ai) đi, đưa (ai) đi cùng', ex: '{日曜日|にちようび}、{山口|やまぐち}さんがスーパーに{連|つ}れていってくれました。', exRo: 'Nichiyoubi, Yamaguchi-san ga suupaa ni tsurete itte kuremashita.', exVi: 'Chủ nhật cô Yamaguchi đã dẫn tôi đi siêu thị.', more: 'Đối: **{連|つ}れてきます** (dẫn ai đến). ⚠ NGƯỜI, con vật → {連|つ}れていく／{連|つ}れてくる; ĐỒ VẬT → {持|も}っていく／{持|も}ってくる. Chữ **連** là chữ Hán mới.' },
        { w: '{寄|よ}ります［{寄|よ}る］1', pos: 'động từ nhóm 1', ipa: 'yorimasu [yoru]', vi: 'ghé qua, tạt vào', ex: '{帰|かえ}りにホームセンターに{寄|よ}って、{棚|たな}を{買|か}いました。', exRo: 'Kaeri ni hoomu sentaa ni yotte, tana o kaimashita.', exVi: 'Trên đường về tôi ghé cửa hàng đồ gia dụng mua cái kệ.', more: '+ て: {寄|よ}って. **N に{寄|よ}る**. ホームセンター = siêu thị đồ gia dụng, dụng cụ (nơi người mới chuyển nhà hay đến).' },
        { w: '{戻|もど}ります［{戻|もど}る］1', pos: 'động từ nhóm 1', ipa: 'modorimasu [modoru]', vi: 'quay lại, trở lại (chỗ cũ, trạng thái cũ)', ex: '{鍵|かぎ}を{忘|わす}れたので、{部屋|へや}に{戻|もど}りました。', exRo: 'Kagi o wasureta node, heya ni modorimashita.', exVi: 'Quên chìa khoá nên tôi quay lại phòng.', more: '+ て: {戻|もど}って. Khác **{帰|かえ}る**: {帰|かえ}る = về nơi mình thuộc về (nhà, nước); {戻|もど}る = quay lại chỗ vừa rời. Tha: **{戻|もど}す** = để lại chỗ cũ ({元|もと}の{場所|ばしょ}に{戻|もど}す). Chữ **戻** là chữ Hán mới.' },
        { w: '{返|かえ}します［{返|かえ}す］1', pos: 'động từ nhóm 1', ipa: 'kaeshimasu [kaesu]', vi: 'trả lại', ex: '{引|ひ}っ{越|こ}しが{終|お}わって、ナタポンさんに{車|くるま}を{返|かえ}しました。', exRo: 'Hikkoshi ga owatte, Natapon-san ni kuruma o kaeshimashita.', exVi: 'Chuyển nhà xong, tôi trả xe cho Nattapon.', more: '+ て: {返|かえ}して. **人に～を{返|かえ}す**. {借|か}りる ↔ {返|かえ}す. {本|ほん}を{図書館|としょかん}に{返|かえ}す. Chữ **返** là chữ Hán mới ✍.' },
        { w: '{役|やく}に{立|た}ちます［{役|やく}に{立|た}つ］1', pos: 'động từ nhóm 1 (cụm)', ipa: 'yaku ni tachimasu [yaku ni tatsu]', vi: 'có ích, giúp ích', ex: '{山口|やまぐち}さんが{教|おし}えてくれた{店|みせ}は、とても{役|やく}に{立|た}ちました。', exRo: 'Yamaguchi-san ga oshiete kureta mise wa, totemo yaku ni tachimashita.', exVi: 'Cửa hàng cô Yamaguchi chỉ cho tôi rất có ích.', more: '**N の{役|やく}に{立|た}つ** (có ích cho N) · {役|やく}に{立|た}つ{情報|じょうほう} (thông tin hữu ích). Phủ định: {役|やく}に{立|た}たない.' },
        { w: '{喜|よろこ}びます［{喜|よろこ}ぶ］1', pos: 'động từ nhóm 1', ipa: 'yorokobimasu [yorokobu]', vi: 'vui mừng, vui vẻ đón nhận', ex: 'お{土産|みやげ}を{渡|わた}したら、{山口|やまぐち}さんはとても{喜|よろこ}びました。', exRo: 'Omiyage o watashitara, Yamaguchi-san wa totemo yorokobimashita.', exVi: 'Khi tôi đưa quà, cô Yamaguchi rất vui.', more: '+ て: {喜|よろこ}んで. Cảm xúc của **mình**: うれしい; cảm xúc **người khác** (nhìn thấy): {喜|よろこ}ぶ／{喜|よろこ}んでいる. **{喜|よろこ}んで** (sẵn lòng): {喜|よろこ}んで{手伝|てつだ}います.' },
      ],
    },

    {
      t: 'hinh',
      title: '🖼️ Thẻ từ có hình — nhìn hình nói ra từ (chạm thẻ để nghe)',
      items: [
        { anh: 'package', w: '{段|だん}ボール{箱|ばこ}', ro: 'danbooru-bako', vi: 'thùng các-tông' },
        { anh: 'wrapped-gift', w: '{包|つつ}みます', ro: 'tsutsumimasu', vi: 'gói, bọc (hình: hộp quà đã gói)' },
        { anh: 'delivery-truck', w: '{宅配便|たくはいびん}', ro: 'takuhaibin', vi: 'chuyển phát tận nhà' },
        { anh: 'pickup-truck', w: 'トラック', ro: 'torakku', vi: 'xe tải (nhỏ)' },
        { anh: 'incoming-envelope', w: '{届|とど}きます', ro: 'todokimasu', vi: '(thư, hàng) đến nơi' },
        { anh: 'couch-and-lamp', w: '{家具|かぐ}', ro: 'kagu', vi: 'đồ nội thất' },
        { anh: 'toolbox', w: '{道具|どうぐ}', ro: 'dougu', vi: 'dụng cụ' },
        { anh: 'key', w: '{鍵|かぎ}', ro: 'kagi', vi: 'chìa khoá' },
        { anh: 'yen-banknote', w: '{家賃|やちん}', ro: 'yachin', vi: 'tiền thuê nhà' },
        { anh: 'house-with-garden', w: '{庭|にわ}のある{家|いえ}', ro: 'niwa no aru ie', vi: 'nhà có sân vườn (chữ 庭 mới)' },
        { anh: 'houses', w: '{近所|きんじょ}', ro: 'kinjo', vi: 'khu hàng xóm' },
        { anh: 'framed-picture', w: '{飾|かざ}ります', ro: 'kazarimasu', vi: 'trang trí, bày (hình: tranh treo)' },
        { anh: 'mirror', w: '{鏡|かがみ}', ro: 'kagami', vi: 'cái gương' },
        { anh: 'light-bulb', w: '{電球|でんきゅう}を{取|と}り{替|か}えます', ro: 'denkyuu o torikaemasu', vi: 'thay bóng đèn' },
        { anh: 'hammer-and-wrench', w: '{直|なお}します', ro: 'naoshimasu', vi: 'sửa (đồ hỏng)' },
        { anh: 'fire', w: '{燃|も}えるごみ', ro: 'moeru gomi', vi: 'rác cháy được (hình: ngọn lửa)' },
        { anh: 'wastebasket', w: 'ごみ{箱|ばこ}', ro: 'gomibako', vi: 'thùng rác (箱 đọc ばこ)' },
        { anh: 'woman-bowing', w: 'あいさつします', ro: 'aisatsu shimasu', vi: 'chào hỏi (cúi chào)' },
        { anh: 'folded-hands', w: '{頼|たの}みます', ro: 'tanomimasu', vi: 'nhờ (hình: chắp tay nhờ vả)' },
        { anh: 'relieved-face', w: '{助|たす}かります', ro: 'tasukarimasu', vi: 'đỡ quá, nhẹ cả người' },
        { anh: 'smiling-face-with-smiling-eyes', w: '{喜|よろこ}びます', ro: 'yorokobimasu', vi: 'vui mừng' },
      ],
    },
    {
      t: 'table',
      caption: 'Cặp động từ TỰ / THA của bài — chìa khoá để dùng ～てある (tha) và ～ている (tự) cho đúng (Ngữ pháp ③)',
      head: ['Tha động từ (ai đó LÀM — N を)', 'Tự động từ (tự XẢY RA — N が)', 'Romaji', 'Câu trạng thái'],
      rows: [
        ['{開|あ}ける (mở)', '{開|あ}く (mở ra)', 'akeru / aku', '{窓|まど}が{開|あ}けてある ／ {窓|まど}が{開|あ}いている'],
        ['{閉|し}める (đóng)', '{閉|し}まる (đóng lại)', 'shimeru / shimaru', 'ドアが{閉|し}めてある ／ ドアが{閉|し}まっている'],
        ['つける (bật)', 'つく (sáng, chạy)', 'tsukeru / tsuku', '{電気|でんき}がつけてある ／ {電気|でんき}がついている'],
        ['{入|い}れる (cho vào)', '{入|はい}る (vào)', 'ireru / hairu', '{箱|はこ}に{本|ほん}が{入|い}れてある ／ {本|ほん}が{入|はい}っている'],
        ['{止|と}める (đỗ, dừng)', '{止|と}まる (dừng)', 'tomeru / tomaru', '{車|くるま}が{止|と}めてある ／ {車|くるま}が{止|と}まっている'],
        ['{届|とど}ける (giao)', '{届|とど}く (tới)', 'todokeru / todoku', '— ／ {荷物|にもつ}が{届|とど}いている'],
        ['{壊|こわ}す (làm hỏng)', '{壊|こわ}れる (hỏng)', 'kowasu / kowareru', '— ／ {椅子|いす}が{壊|こわ}れている'],
        ['{直|なお}す (sửa)', '{直|なお}る (được sửa xong)', 'naosu / naoru', '— ／ ドアが{直|なお}っている'],
        ['{掛|か}ける (treo)', '{掛|か}かる (được treo)', 'kakeru / kakaru', '{鏡|かがみ}が{掛|か}けてある ／ {鏡|かがみ}が{掛|か}かっている'],
        ['{並|なら}べる (xếp)', '{並|なら}ぶ (xếp hàng)', 'naraberu / narabu', '{箱|はこ}が{並|なら}べてある ／ {人|ひと}が{並|なら}んでいる'],
        ['{戻|もど}す (để lại chỗ cũ)', '{戻|もど}る (quay lại)', 'modosu / modoru', '— ／ もう{戻|もど}っている'],
        ['{助|たす}ける (cứu, giúp)', '{助|たす}かる (được cứu)', 'tasukeru / tasukaru', '— (hay dùng: {助|たす}かりました)'],
      ],
    },
    {
      t: 'note',
      title: 'Từ dễ nhầm trong bài',
      items: [
        '**{準備|じゅんび} ↔ {用意|ようい} ↔ {支度|したく}** — cùng là "chuẩn bị". {準備|じゅんび} (Bài 12): rộng nhất, cả kế hoạch, việc lớn ({引|ひ}っ{越|こ}しの{準備|じゅんび}, {試験|しけん}の{準備|じゅんび}). {用意|ようい}: chuẩn bị **đồ vật** cụ thể ({段|だん}ボールを{用意|ようい}する). {支度|したく}: sửa soạn **ngay trước mắt**, nhất là bản thân hoặc bữa ăn ({出|で}かける{支度|したく}).',
        '**{帰|かえ}る ↔ {戻|もど}る** — {国|くに}に{帰|かえ}る (về nước) / {家|うち}に{帰|かえ}る (về nhà); {部屋|へや}に{戻|もど}る (quay lại phòng vừa rời), {席|せき}に{戻|もど}る (về chỗ ngồi). Đi làm về nhà dùng {帰|かえ}る; quên đồ quay lại dùng {戻|もど}る.',
        '**{持|も}っていく ↔ {連|つ}れていく** — đồ vật: {荷物|にもつ}を{持|も}っていく; người / con vật: {妹|いもうと}を{連|つ}れていく, {犬|いぬ}を{連|つ}れていく. Sai kinh điển: ~~{友達|ともだち}を{持|も}っていく~~.',
        '**{届|とど}ける ↔ {送|おく}る** — {送|おく}る (Bài 8): gửi đi (qua bưu điện, mail), người gửi không cần đến tận nơi; {届|とど}ける: **mang đến tận tay** người nhận ({忘|わす}れ{物|もの}を{届|とど}ける).',
        '**うれしい ↔ {喜|よろこ}ぶ** — tôi vui: ~~{私|わたし}は{喜|よろこ}びます~~ → **{私|わたし}はうれしいです**; người khác vui: {母|はは}は{喜|よろこ}びました.',
        '**{直|なお}す ↔ {治|なお}す** — cùng đọc なおす: {直|なお}す sửa ĐỒ / lỗi; {治|なお}す chữa BỆNH (Bài 12).',
        '**{使|つか}う ↔ {利用|りよう}する** — {利用|りよう}する cho dịch vụ, cơ sở, phương tiện; đồ vật nhỏ trong tay chỉ dùng {使|つか}う.',
        '**しまう ↔ {片付|かたづ}ける** — しまう: cất MỘT thứ vào đúng chỗ ({服|ふく}を{押|お}し{入|い}れにしまう); {片付|かたづ}ける (Bài 16): dọn dẹp cả khu cho gọn ({部屋|へや}を{片付|かたづ}ける).',
      ],
    },
    {
      t: 'note',
      title: 'Kết hợp từ (コロケーション) nên học thành cụm',
      items: [
        '{友達|ともだち}**に{手伝|てつだ}いを{頼|たの}む** · {大家|おおや}さん**に{連絡|れんらく}する** · {段|だん}ボール**を{用意|ようい}する** · {車|くるま}**を{返|かえ}す**',
        '{皿|さら}**を{新聞紙|しんぶんし}で{包|つつ}む** · {荷物|にもつ}**が{届|とど}く** · {荷物|にもつ}**を{届|とど}ける** · {宅配便|たくはいびん}**で{送|おく}る**',
        '{壁|かべ}**に{鏡|かがみ}を{掛|か}ける** · {花|はな}**を{飾|かざ}る** · ポスター**を{貼|は}る** · {布団|ふとん}**を{押|お}し{入|い}れにしまう** · {電球|でんきゅう}**を{取|と}り{替|か}える**',
        '{鍵|かぎ}**をかける** · {冷房|れいぼう}**をつける** · ごみ**を{出|だ}す** · {規則|きそく}**を{守|まも}る** · お{礼|れい}**を{言|い}う** · {近所|きんじょ}の{人|ひと}**にあいさつする**',
      ],
    },
    {
      t: 'write',
      id: 'b18-viet-tu',
      title: 'Viết tay 10 từ hay vào đề',
      note: 'Dòng trên tô theo mẫu, dòng dưới tự viết. Bật "Che mẫu" để tự nhớ ra từ chỉ từ gợi ý nghĩa.',
      chars: ['箱', '家具', '道具', '返事', '近所', '宅配便', '規則', 'お礼', '戻る', '助かる'],
      goi: {
        '箱': 'はこ · hộp, thùng',
        '家具': 'かぐ · đồ nội thất',
        '道具': 'どうぐ · dụng cụ',
        '返事': 'へんじ · hồi âm, lời đáp',
        '近所': 'きんじょ · hàng xóm, khu gần nhà',
        '宅配便': 'たくはいびん · chuyển phát tận nhà',
        '規則': 'きそく · quy định',
        'お礼': 'おれい · lời cảm ơn',
        '戻る': 'もどる · quay lại',
        '助かる': 'たすかる · đỡ quá, được cứu',
      },
    },
    {
      t: 'mcq',
      id: 'b18-tv-trac-nghiem',
      title: 'Kiểm tra từ vựng — 14 câu (dạng 文脈規定・言い換え của đề N4)',
      items: [
        { q: 'この{部屋|へや}は{駅|えき}から{近|ちか}いですが、（　）が{高|たか}いです。{1か月|いっかげつ}{8万円|はちまんえん}です。', options: ['{家賃|やちん}', '{返事|へんじ}', '{規則|きそく}', '{留守|るす}'], correct: 0, why: 'Tiền mỗi tháng của căn phòng = **{家賃|やちん}**. 〔Kono heya wa eki kara chikai desu ga, yachin ga takai desu.〕' },
        { q: '{皿|さら}は{割|わ}れやすいですから、{新聞紙|しんぶんし}で（　）ください。', options: ['{包|つつ}んで', '{貼|は}って', '{掛|か}けて', '{飾|かざ}って'], correct: 0, why: 'Bọc đĩa bằng giấy báo = **{包|つつ}む**. 〔Sara wa wareyasui desu kara, shinbunshi de tsutsunde kudasai.〕' },
        { q: '{昨日|きのう}{注文|ちゅうもん}した{本棚|ほんだな}が、{今日|きょう}（　）。', options: ['{届|とど}きました', '{届|とど}けました', '{戻|もど}しました', '{返|かえ}しました'], correct: 0, why: 'Hàng **tự đến** → tự động từ **{届|とど}く**: {本棚|ほんだな}**が**{届|とど}きました. {届|とど}ける cần người làm + を. 〔Kyou todokimashita.〕' },
        { q: '{来週|らいしゅう}{引|ひ}っ{越|こ}すので、{電気|でんき}と（　）とガスの{会社|かいしゃ}に{連絡|れんらく}しました。', options: ['{水道|すいどう}', '{冷房|れいぼう}', '{家具|かぐ}', '{近所|きんじょ}'], correct: 0, why: 'Điện – **nước máy** – ga: ba dịch vụ phải báo khi chuyển nhà. 〔Denki to suidou to gasu no kaisha ni renraku shimashita.〕' },
        { q: '{電気|でんき}がつきません。{電球|でんきゅう}を{新|あたら}しいのに（　）ください。', options: ['{取|と}り{替|か}えて', '{包|つつ}んで', 'しまって', '{寄|よ}って'], correct: 0, why: 'Thay bóng đèn mới = **{取|と}り{替|か}える** (AをBに). 〔Denkyuu o atarashii no ni torikaete kudasai.〕' },
        { q: '{冬|ふゆ}が{終|お}わったので、ストーブを{押|お}し{入|い}れに（　）。', options: ['しまいました', '{飾|かざ}りました', '{届|とど}けました', '{貼|は}りました'], correct: 0, why: 'Cất vào tủ = **しまう**. 〔Sutoobu o oshiire ni shimaimashita.〕' },
        { q: '{財布|さいふ}を{忘|わす}れたので、{家|いえ}に（　）。', options: ['{戻|もど}りました', '{返|かえ}しました', '{連|つ}れていきました', '{届|とど}きました'], correct: 0, why: 'Quay lại chỗ vừa đi = **{戻|もど}る**. {返|かえ}す là "trả lại đồ". 〔Ie ni modorimashita.〕' },
        { q: '{図書館|としょかん}で{借|か}りた{本|ほん}を{今日|きょう}までに（　）なければなりません。', options: ['{返|かえ}さ', '{戻|もど}ら', '{帰|かえ}ら', '{届|とど}か'], correct: 0, why: 'Trả sách = **{返|かえ}す** → {返|かえ}さなければなりません (ポイント 115). 〔Kyou made ni kaesanakereba narimasen.〕' },
        { q: '{子|こ}どもを{公園|こうえん}に（　）。', options: ['{連|つ}れていきました', '{持|も}っていきました', '{届|とど}けました', '{寄|よ}りました'], correct: 0, why: 'NGƯỜI → **{連|つ}れていく**. {持|も}っていく chỉ cho đồ vật. 〔Kodomo o kouen ni tsurete ikimashita.〕' },
        { q: '{会社|かいしゃ}の{帰|かえ}りに、{本屋|ほんや}に（　）。', options: ['{寄|よ}りました', '{戻|もど}りました', '{返|かえ}しました', '{助|たす}かりました'], correct: 0, why: 'Ghé qua trên đường về = **N に{寄|よ}る**. 〔Kaisha no kaeri ni, hon\'ya ni yorimashita.〕' },
        { q: '{引|ひ}っ{越|こ}してきたら、{近所|きんじょ}の{人|ひと}に（　）しましょう。', options: ['あいさつ', '{返事|へんじ}', '{利用|りよう}', '{支度|したく}'], correct: 0, why: 'Chào hàng xóm = **人にあいさつする**. 〔Kinjo no hito ni aisatsu shimashou.〕' },
        { q: '「{田中|たなか}さんが{手伝|てつだ}ってくれて、{助|たす}かりました。」と{同|おな}じ{意味|いみ}は？', options: ['{田中|たなか}さんに{手伝|てつだ}ってもらって、よかったです。', '{田中|たなか}さんを{手伝|てつだ}って、よかったです。', '{田中|たなか}さんは{手伝|てつだ}いませんでした。', '{田中|たなか}さんに{手伝|てつだ}いを{頼|たの}みませんでした。'], correct: 0, why: '{助|たす}かった = nhờ có người giúp nên đỡ ≈ **{手伝|てつだ}ってもらって、よかった**. 〔Tanaka-san ni tetsudatte moratte, yokatta desu.〕 (dạng 言い換え類義)' },
        { q: '「{明日|あした}は{留守|るす}にします。」の{意味|いみ}は？', options: ['{明日|あした}は{家|いえ}にいません。', '{明日|あした}は{家|いえ}で{休|やす}みます。', '{明日|あした}は{鍵|かぎ}をかけません。', '{明日|あした}は{誰|だれ}かが{来|き}ます。'], correct: 0, why: '{留守|るす} = vắng nhà ≈ **{家|いえ}にいない**. 〔Ashita wa ie ni imasen.〕' },
        { q: 'この{地図|ちず}は{新|あたら}しい{町|まち}を{歩|ある}くとき、とても（　）。', options: ['{役|やく}に{立|た}ちました', '{喜|よろこ}びました', '{戻|もど}りました', '{留守|るす}でした'], correct: 0, why: 'Có ích = **{役|やく}に{立|た}つ**. 〔Totemo yaku ni tachimashita.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b18-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp N4 — ～てあげる・～てくれる・～てもらう, nhờ vả lịch sự, ～ておく, ～てある',
  goal: 'Nói đúng hướng cho – nhận một VIỆC LÀM (tôi làm cho người khác / người khác làm cho tôi / tôi được người khác làm cho) với trợ từ đúng; nhờ vả theo 5 mức lịch sự (～てくれる？ → ～ていただけませんか); dùng ～ておく cho việc làm trước, để nguyên, làm cho xong (cả dạng nói ～とく); tả trạng thái do người cố ý tạo ra bằng ～てある và phân biệt nó với 自動詞 ＋ ている, ～ておく — đúng kiểu câu đề N4 hay hỏi.',
  minutes: 110,
  blocks: [
    {
      t: 'p',
      text: 'Bài 18 có **3 nhóm mẫu N4**, và cả ba đều đứng sau **thể て** — nên trước khi học, hãy chắc rằng bạn chia thể て trôi chảy (Bài 7). **(1) ～てあげる／～てくれる／～てもらう** — cho và nhận **việc làm** (Bài 8 bạn đã cho – nhận **đồ vật**: あげます・くれます・もらいます; hôm nay chỉ thêm thể て phía trước), kèm cách **nhờ** từ thân mật đến rất lịch sự. **(2) ～ておく** — làm trước / để nguyên / làm cho xong. **(3) ～てある** — "đã được (ai đó) làm sẵn": trạng thái còn lại. Cuối bài có **bảng phân biệt ～ている・～てある・～ておく** — câu hỏi kinh điển của đề N4.',
    },
    {
      t: 'table',
      caption: 'Bản đồ ngữ pháp Bài 18',
      head: ['#', 'Mẫu', 'Nghĩa', 'Ví dụ ngắn', 'Cấp'],
      rows: [
        ['①a', 'Vて ＋ あげる', '(tôi / ai đó) làm V cho người khác', '{荷物|にもつ}を{運|はこ}んであげます。', 'N4'],
        ['①b', 'Vて ＋ くれる', '(ai đó) làm V cho TÔI / phe tôi', '{友達|ともだち}が{手伝|てつだ}ってくれました。', 'N4'],
        ['①c', 'Vて ＋ もらう', 'TÔI được (ai đó) làm V cho; nhờ ai làm', '{友達|ともだち}に{手伝|てつだ}ってもらいました。', 'N4'],
        ['①d', '～てくれませんか／～てもらえませんか／～ていただけませんか', 'nhờ … được không (ba mức lịch sự)', '{教|おし}えていただけませんか。', 'N4'],
        ['②', 'Vて ＋ おく（～とく）', 'làm trước; để nguyên; làm cho xong', '{段|だん}ボールを{用意|ようい}しておきます。', 'N4'],
        ['③', 'N が ＋ 他動詞て ＋ ある', '(đã được ai đó làm sẵn) — trạng thái còn lại', '{壁|かべ}に{地図|ちず}が{貼|は}ってあります。', 'N4'],
      ],
    },
    {
      t: 'note',
      title: 'Ôn nhanh thể て (Bài 7) — cả ba mẫu đều cần',
      items: [
        '**Nhóm 1**: う・つ・る → **って** ({手伝|てつだ}う → {手伝|てつだ}って, {待|ま}つ → {待|ま}って, {貼|は}る → {貼|は}って) · む・ぶ・ぬ → **んで** ({包|つつ}む → {包|つつ}んで, {運|はこ}ぶ → {運|はこ}んで) · く → **いて** ({書|か}く → {書|か}いて, {置|お}く → {置|お}いて) · ぐ → **いで** ({急|いそ}ぐ → {急|いそ}いで) · す → **して** ({貸|か}す → {貸|か}して, {直|なお}す → {直|なお}して). Ngoại lệ: **{行|い}く → {行|い}って**.',
        '**Nhóm 2**: bỏ る + て ({教|おし}える → {教|おし}えて, {掛|か}ける → {掛|か}けて, {並|なら}べる → {並|なら}べて).',
        '**Nhóm 3**: する → して ({案内|あんない}して, {用意|ようい}して) · {来|く}る → {来|き}て.',
        'Bản thân **おく** là động từ nhóm 1 (gốc là {置|お}く — đặt): おきます · おいて · おかない · おこう. **ある** chỉ dùng thể ます: あります／ありました (phủ định: ～てありません — ít dùng).',
      ],
    },

    /* ══════ ① ～てあげる・くれる・もらう ══════ */
    { t: 'h', text: '① Cho – nhận VIỆC LÀM: ～てあげる・～てくれる・～てもらう (授受表現)' },
    {
      t: 'p',
      text: 'Bài 8 (ポイント 76–78) bạn đã học cho – nhận **đồ vật**: {友達|ともだち}に{本|ほん}を**あげます** · {友達|ともだち}に{本|ほん}を**もらいます** · {友達|ともだち}が（{私|わたし}に）{本|ほん}を**くれます**. Tiếng Nhật dùng **đúng ba động từ đó** cho việc **làm giúp ai một việc** (cho đi "một ân huệ"): chỉ cần đặt **thể て** của việc làm phía trước. Người Nhật dùng mẫu này **rất thường xuyên** — nói ~~{友達|ともだち}が{手伝|てつだ}いました~~ thì đúng ngữ pháp nhưng nghe lạnh lùng, như không biết ơn; nói **{友達|ともだち}が{手伝|てつだ}ってくれました** mới là tự nhiên.',
    },
    {
      t: 'table',
      caption: 'Từ ĐỒ VẬT (Bài 8) sang VIỆC LÀM (Bài 18) — chỉ thêm thể て',
      head: ['Động từ', 'Cho – nhận đồ vật (Bài 8)', 'Cho – nhận việc làm (Bài 18)', 'Romaji (Bài 18)'],
      rows: [
        ['あげる', '{友達|ともだち}に{辞書|じしょ}をあげました。', '{友達|ともだち}に{辞書|じしょ}を**{貸|か}してあげました**。', 'Tomodachi ni jisho o kashite agemashita.'],
        ['くれる', '{友達|ともだち}が{辞書|じしょ}をくれました。', '{友達|ともだち}が{辞書|じしょ}を**{貸|か}してくれました**。', 'Tomodachi ga jisho o kashite kuremashita.'],
        ['もらう', '{友達|ともだち}に{辞書|じしょ}をもらいました。', '{友達|ともだち}に{辞書|じしょ}を**{貸|か}してもらいました**。', 'Tomodachi ni jisho o kashite moraimashita.'],
      ],
    },
    {
      t: 'table',
      caption: 'Ba hướng — ai làm, ai được nhờ (mũi tên = việc làm đi từ đâu đến đâu)',
      head: ['Mẫu', 'Hướng', 'Công thức (trợ từ)', 'Ví dụ', 'Romaji'],
      rows: [
        ['Vて あげる', 'TÔI → người khác · người khác → người khác', '[người làm] **は／が** [người nhận] **に** (N を) Vて あげる', '{私|わたし}はリンさんに{町|まち}を{案内|あんない}してあげました。', 'Watashi wa Rin-san ni machi o annai shite agemashita.'],
        ['Vて くれる', 'người khác → TÔI (phe tôi)', '[người làm] **が** （{私|わたし}に） (N を) Vて くれる', '{山口|やまぐち}さんが{町|まち}を{案内|あんない}してくれました。', 'Yamaguchi-san ga machi o annai shite kuremashita.'],
        ['Vて もらう', 'TÔI ← người khác (tôi là người được)', '[TÔI] **は** [người làm] **に** (N を) Vて もらう', '{私|わたし}は{山口|やまぐち}さんに{町|まち}を{案内|あんない}してもらいました。', 'Watashi wa Yamaguchi-san ni machi o annai shite moraimashita.'],
      ],
    },
    {
      t: 'note',
      title: 'Hai luật vàng về trợ từ',
      items: [
        '**Luật 1 — giữ nguyên trợ từ của động từ gốc.** {手伝|てつだ}う nhận người bằng **を** ({友達|ともだち}を{手伝|てつだ}う) → {友達|ともだち}**を**{手伝|てつだ}ってあげる (KHÔNG đổi thành ~~{友達|ともだち}に{手伝|てつだ}ってあげる~~). {待|ま}つ cũng vậy: {友達|ともだち}**を**{待|ま}ってあげる. Còn {持|も}つ thì người không phải tân ngữ → dùng **の**: {先輩|せんぱい}**の**{荷物|にもつ}を{持|も}ってあげる.',
        '**Luật 2 — người làm trong câu もらう đi với に, trong câu くれる đi với が.** {友達|ともだち}**に**{手伝|てつだ}ってもらう ↔ {友達|ともだち}**が**{手伝|てつだ}ってくれる. Chủ ngữ của もらう luôn là người NHẬN (thường là {私|わたし}, hay lược bỏ); chủ ngữ của くれる là người LÀM.',
        'Trong cả ba câu, **{私|わたし}は／{私|わたし}に thường được lược bỏ** — tiếng Nhật hiểu ngầm. マルコさんが{運|はこ}んでくれた = Marco khuân cho (tôi).',
      ],
    },
    {
      t: 'table',
      caption: '"Phe tôi" (うち) — người nhận của くれる có thể là người nhà, bạn trong nhóm của tôi',
      head: ['Câu', 'Romaji', 'Vì sao dùng くれる／あげる'],
      rows: [
        ['{先生|せんせい}が{妹|いもうと}に{日本語|にほんご}を{教|おし}えてくれました。', 'Sensei ga imouto ni nihongo o oshiete kuremashita.', 'em gái = phe tôi → くれる (tôi cũng biết ơn)'],
        ['{友達|ともだち}が{母|はは}を{駅|えき}まで{送|おく}ってくれました。', 'Tomodachi ga haha o eki made okutte kuremashita.', 'mẹ = phe tôi → くれる'],
        ['{私|わたし}の{弟|おとうと}がアンナさんに{道|みち}を{教|おし}えてあげました。', 'Watashi no otouto ga Anna-san ni michi o oshiete agemashita.', 'phe tôi → người ngoài → あげる'],
        ['マルコさんがアンナさんを{手伝|てつだ}ってあげました。', 'Maruko-san ga Anna-san o tetsudatte agemashita.', 'hai người ngoài → あげる (người kể đứng ngoài)'],
      ],
    },

    /* ── ①a ── */
    { t: 'h', text: '①a Vて あげる — "làm (việc gì đó) cho người khác"' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '[người làm] は [người nhận] に (N を) Vて あげます',
          vi: 'Người làm (thường là tôi, hoặc người thứ ba) làm một việc **vì lợi ích của người khác**. Dùng khi **kể lại** việc mình / ai đó đã giúp người khác, hoặc nói với **bạn thân, người nhỏ tuổi hơn** rằng mình sẽ giúp.',
          examples: [
            E('{私|わたし}はリンさんの{荷物|にもつ}を{運|はこ}んであげました。', 'Watashi wa Rin-san no nimotsu o hakonde agemashita.', 'Tôi đã khuân đồ giúp Lin.'),
            E('{弟|おとうと}に{自転車|じてんしゃ}の{乗|の}り{方|かた}を{教|おし}えてあげました。', 'Otouto ni jitensha no norikata o oshiete agemashita.', 'Tôi đã dạy em trai cách đi xe đạp.'),
            E('{新|あたら}しく{来|き}た{留学生|りゅうがくせい}を{手伝|てつだ}ってあげたいです。', 'Atarashiku kita ryuugakusei o tetsudatte agetai desu.', 'Tôi muốn giúp những du học sinh mới sang.'),
            E('マルコさんはリンさんに{車|くるま}を{貸|か}してあげました。', 'Maruko-san wa Rin-san ni kuruma o kashite agemashita.', 'Marco đã cho Lin mượn xe. (người thứ ba → người thứ ba)'),
            E('{友達|ともだち}が{来|き}たら、{東京|とうきょう}を{案内|あんない}してあげるつもりです。', 'Tomodachi ga kitara, Toukyou o annai shite ageru tsumori desu.', 'Bạn tôi sang thì tôi định dẫn bạn ấy đi thăm Tokyo.'),
            E('{子|こ}どもに{絵本|えほん}を{読|よ}んであげました。', 'Kodomo ni ehon o yonde agemashita.', 'Tôi đã đọc truyện tranh cho con nghe.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: '⚠ Nói ～てあげる TRƯỚC MẶT người được giúp — lúc nào được, lúc nào thất lễ?',
      head: ['Nói với ai', 'Câu', 'Romaji', 'Được?', 'Vì sao'],
      rows: [
        ['bạn thân, em nhỏ', '{手伝|てつだ}ってあげるよ。', 'Tetsudatte ageru yo.', '✓', 'thân mật, ấm áp'],
        ['bạn cùng lớp', '{手伝|てつだ}いましょうか。', 'Tetsudaimashou ka.', '✓ (tốt nhất)', 'đề nghị khiêm tốn (ôn Bài 6)'],
        ['thầy cô, người trên', '~~{先生|せんせい}、{荷物|にもつ}を{持|も}ってあげます。~~', '—', '✗', 'nghe như "tôi ban ơn cho thầy" — kể công'],
        ['thầy cô, người trên', '{先生|せんせい}、{荷物|にもつ}を{持|も}ちましょうか。', 'Sensei, nimotsu o mochimashou ka.', '✓', 'đề nghị, không nhắc đến "ơn"'],
        ['kể với người khác', '{先生|せんせい}の{荷物|にもつ}を{持|も}ってあげました。', 'Sensei no nimotsu o motte agemashita.', '△', 'vẫn hơi kể công; nên nói {持|も}ちました'],
      ],
    },
    {
      t: 'note',
      title: 'Biết trước — hai "người anh em" của ～てあげる',
      items: [
        '**～てさしあげる** — dạng khiêm nhường của ～てあげる (Bài 24, kính ngữ): {先生|せんせい}に{資料|しりょう}を{送|おく}ってさしあげました. Dù lịch sự, vẫn KHÔNG nói trực tiếp với người được giúp.',
        '**～てやる** — cho người dưới, con vật, cây cối (văn nói, hơi thô với người): {犬|いぬ}を{散歩|さんぽ}に{連|つ}れていってやる · {花|はな}に{水|みず}をやる (やる = cho, tưới). Người học N4 chỉ cần NGHE hiểu; tự nói thì dùng あげる.',
      ],
    },

    /* ── ①b ── */
    { t: 'h', text: '①b Vて くれる — "(ai đó) làm cho TÔI"' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '[người làm] が （{私|わたし}に） (N を) Vて くれます',
          vi: 'Người khác làm một việc **cho tôi hoặc phe tôi** (gia đình, nhóm, công ty mình), và tôi **biết ơn**. Người nhận LUÔN là tôi / phe tôi nên thường bỏ {私|わたし}に. Đây là cách kể "ai đã giúp mình" tự nhiên nhất.',
          examples: [
            E('ナタポンさんが{車|くるま}を{貸|か}してくれました。', 'Natapon-san ga kuruma o kashite kuremashita.', 'Nattapon đã cho tôi mượn xe.'),
            E('{大家|おおや}さんがドアを{直|なお}してくれました。', 'Ooya-san ga doa o naoshite kuremashita.', 'Chủ nhà đã sửa cửa cho tôi.'),
            E('{母|はは}が{国|くに}から{荷物|にもつ}を{送|おく}ってくれました。', 'Haha ga kuni kara nimotsu o okutte kuremashita.', 'Mẹ đã gửi đồ từ quê sang cho tôi.'),
            E('{山口|やまぐち}さんがごみの{出|だ}し{方|かた}を{教|おし}えてくれました。', 'Yamaguchi-san ga gomi no dashikata o oshiete kuremashita.', 'Cô Yamaguchi đã chỉ cho tôi cách đổ rác.'),
            E('{友達|ともだち}が{妹|いもうと}を{駅|えき}まで{迎|むか}えに{行|い}ってくれました。', 'Tomodachi ga imouto o eki made mukae ni itte kuremashita.', 'Bạn tôi đã ra ga đón em gái tôi. (em gái = phe tôi)'),
            E('{先輩|せんぱい}が{引|ひ}っ{越|こ}しのことをいろいろ{調|しら}べてくれました。', 'Senpai ga hikkoshi no koto o iroiro shirabete kuremashita.', 'Anh khoá trên đã tìm hiểu đủ thứ về chuyện chuyển nhà giúp tôi.'),
          ],
        },
        {
          formula: 'Vて くれて、ありがとう／{助|たす}かりました — cảm ơn vì đã làm cho tôi',
          vi: 'Thể て của くれる (**くれて**) nêu lý do mình biết ơn. Câu cảm ơn **chuẩn** sau khi được giúp. Lịch sự: ～てくださって、ありがとうございます (くださる — kính ngữ của くれる, Bài 24).',
          examples: [
            E('{手伝|てつだ}ってくれて、ありがとう。', 'Tetsudatte kurete, arigatou.', 'Cảm ơn cậu đã giúp mình.'),
            E('{車|くるま}を{貸|か}してくれて、{本当|ほんとう}に{助|たす}かりました。', 'Kuruma o kashite kurete, hontou ni tasukarimashita.', 'Cậu cho mượn xe, đỡ cho mình thật sự.'),
            E('{来|き}てくれて、うれしいです。', 'Kite kurete, ureshii desu.', 'Bạn đến (với tôi), tôi vui lắm.'),
            E('{教|おし}えてくださって、ありがとうございました。', 'Oshiete kudasatte, arigatou gozaimashita.', 'Cảm ơn thầy cô đã chỉ bảo. (lịch sự với người trên)'),
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～てくれる',
      items: [
        '~~{私|わたし}はマルコさんに{手伝|てつだ}ってくれました~~ → người nhận là tôi thì **chủ ngữ là người làm**: **マルコさんが{手伝|てつだ}ってくれました** (hoặc đổi sang もらう: {私|わたし}はマルコさんに{手伝|てつだ}ってもらいました).',
        '~~{私|わたし}がマルコさんを{手伝|てつだ}ってくれました~~ → tôi làm cho người khác dùng **あげる**: {私|わたし}がマルコさんを{手伝|てつだ}ってあげました.',
        '~~マルコさんがアンナさんを{手伝|てつだ}ってくれました~~ khi アンナ không phải "phe tôi" → **あげました**. (Nếu アンナ là em gái tôi thì くれました được.)',
        'Kể chuyện mà bỏ くれる: ~~{山口|やまぐち}さんがごみの{出|だ}し{方|かた}を{教|おし}えました~~ — đúng ngữ pháp nhưng nghe thiếu biết ơn; người Nhật gần như luôn nói **{教|おし}えてくれました**.',
      ],
    },

    /* ── ①c ── */
    { t: 'h', text: '①c Vて もらう — "TÔI được (ai đó) làm cho", "nhờ ai làm"' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '[TÔI] は [người làm] に (N を) Vて もらいます',
          vi: 'Kể cùng sự việc với ～てくれる nhưng **từ phía người nhận**: chủ ngữ là TÔI, người làm đi với **に**. Thường hàm ý **tôi đã nhờ** và được người kia làm cho. Rất hay dùng với dịch vụ: {不動産屋|ふどうさんや}に{部屋|へや}を{探|さが}してもらう, {大家|おおや}さんに{直|なお}してもらう.',
          examples: [
            E('{私|わたし}はアンナさんに{段|だん}ボールを{集|あつ}めてもらいました。', 'Watashi wa Anna-san ni danbooru o atsumete moraimashita.', 'Tôi được Anna gom thùng các-tông cho.'),
            E('{不動産屋|ふどうさんや}さんに{安|やす}い{部屋|へや}を{探|さが}してもらいました。', "Fudousan'ya-san ni yasui heya o sagashite moraimashita.", 'Tôi đã nhờ văn phòng nhà đất tìm cho một phòng rẻ.'),
            E('{大家|おおや}さんに{電球|でんきゅう}を{取|と}り{替|か}えてもらいました。', 'Ooya-san ni denkyuu o torikaete moraimashita.', 'Tôi được chủ nhà thay bóng đèn cho.'),
            E('{日本人|にほんじん}の{友達|ともだち}にメールの{日本語|にほんご}を{直|なお}してもらいます。', 'Nihonjin no tomodachi ni meeru no nihongo o naoshite moraimasu.', 'Tôi nhờ bạn người Nhật sửa tiếng Nhật trong email.'),
            E('{子|こ}どものとき、よく{祖母|そぼ}に{昔話|むかしばなし}をしてもらいました。', 'Kodomo no toki, yoku sobo ni mukashibanashi o shite moraimashita.', 'Hồi nhỏ tôi hay được bà kể chuyện cổ tích.'),
            E('{引|ひ}っ{越|こ}しの{日|ひ}、{誰|だれ}に{手伝|てつだ}ってもらいますか。', 'Hikkoshi no hi, dare ni tetsudatte moraimasu ka.', 'Ngày chuyển nhà bạn nhờ ai giúp?'),
          ],
        },
        {
          formula: 'Vて もらいたいです — "tôi muốn (ai đó) làm cho tôi"',
          vi: 'Ghép もらう + ～たい: nói mong muốn người khác làm gì cho mình (người đó đi với **に**). Nói thẳng với người trên dễ thành ép — với họ nên dùng câu nhờ ①d.',
          examples: [
            E('{日本人|にほんじん}の{友達|ともだち}に、{作文|さくぶん}を{見|み}てもらいたいです。', 'Nihonjin no tomodachi ni, sakubun o mite moraitai desu.', 'Tôi muốn nhờ bạn người Nhật xem giúp bài văn.'),
            E('{大家|おおや}さんに{古|ふる}いエアコンを{取|と}り{替|か}えてもらいたいです。', 'Ooya-san ni furui eakon o torikaete moraitai desu.', 'Tôi muốn chủ nhà thay cái điều hoà cũ cho.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Cùng một sự việc — nói bằng くれる hay もらう? (cả hai đều đúng, khác góc nhìn)',
      head: ['Sự việc', '～てくれました (người làm là chủ ngữ)', '～てもらいました (tôi là chủ ngữ)', 'Sắc thái'],
      rows: [
        ['Marco khuân đồ', 'マルコさんが{運|はこ}んでくれました。', 'マルコさんに{運|はこ}んでもらいました。', 'くれる: Marco tự nguyện, tốt bụng · もらう: (có lẽ) tôi đã nhờ'],
        ['Mẹ gửi đồ', '{母|はは}が{送|おく}ってくれました。', '{母|はは}に{送|おく}ってもらいました。', 'くれる tự nhiên hơn khi người kia tự làm'],
        ['Nhân viên chỉ đường', '{駅員|えきいん}さんが{教|おし}えてくれました。', '{駅員|えきいん}さんに{教|おし}えてもらいました。', 'cả hai rất hay dùng'],
        ['Thợ sửa máy giặt', '— (ít nói)', '{修理|しゅうり}の{人|ひと}に{直|なお}してもらいました。', 'dịch vụ mình yêu cầu → もらう'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～てもらう',
      items: [
        '~~マルコさんが{手伝|てつだ}ってもらいました~~ (muốn nói Marco giúp tôi) → **マルコさんに**{手伝|てつだ}ってもらいました. Người làm trong câu もらう đi với **に**, không phải が.',
        '~~{私|わたし}はマルコさんを{手伝|てつだ}ってもらいました~~ → trợ từ を của {手伝|てつだ}う chỉ dùng cho người ĐƯỢC giúp; ở đây người làm là マルコ → **マルコさんに**.',
        'Nhầm hướng: "Tôi được bạn cho mượn" = {友達|ともだち}**に**{貸|か}して**もらった** ✓. "Tôi cho bạn mượn" = {友達|ともだち}**に**{貸|か}して**あげた** ✓. Hai câu cùng có に — phân biệt ở **もらう／あげる**, đừng nhìn trợ từ mà đoán.',
      ],
    },

    /* ── ①d ── */
    { t: 'h', text: '①d Nhờ vả — từ thân mật đến rất lịch sự: ～てくれる？ → ～ていただけませんか' },
    {
      t: 'p',
      text: 'Khi **nhờ** ai làm gì cho mình, tiếng Nhật dùng chính くれる／もらう ở dạng **câu hỏi**, thường là **câu hỏi phủ định** (～ませんか — mềm hơn ～ますか). Càng xa người nghe (người lạ, người trên, khách) càng leo lên bậc cao. Bạn đã có **～てください** (Bài 7) — nhưng ～てください nghe như **chỉ dẫn / yêu cầu**; khi nhờ một **ân huệ**, người Nhật thích ～てくれませんか／～てもらえませんか hơn.',
    },
    {
      t: 'table',
      caption: 'Bậc thang lời nhờ — cùng việc "giúp tôi chuyển nhà"',
      head: ['Bậc', 'Câu', 'Romaji', 'Nói với ai'],
      rows: [
        ['1 · thân mật', '{手伝|てつだ}って。', 'Tetsudatte.', 'người nhà, bạn rất thân (gần như ra lệnh nhẹ)'],
        ['2 · thân mật', '{手伝|てつだ}ってくれる？／{手伝|てつだ}ってくれない？', 'Tetsudatte kureru? / Tetsudatte kurenai?', 'bạn bè (くれない？ mềm hơn)'],
        ['3 · lịch sự', '{手伝|てつだ}ってくれませんか。', 'Tetsudatte kuremasen ka.', 'bạn cùng lớp, đồng nghiệp ngang hàng'],
        ['4 · lịch sự hơn', '{手伝|てつだ}ってもらえませんか。', 'Tetsudatte moraemasen ka.', 'người chưa thân, đàn anh, nhân viên cửa hàng'],
        ['5 · rất lịch sự', '{手伝|てつだ}っていただけませんか。', 'Tetsudatte itadakemasen ka.', 'thầy cô, người lớn tuổi, hàng xóm mới, khách'],
      ],
    },
    {
      t: 'note',
      title: 'Ba điều cần nhớ khi nhờ',
      items: [
        '**もらえませんか** = thể khả năng của もらう (Bài 16) + ませんか: "tôi có thể được anh làm cho không?". **いただけませんか** = khả năng của いただく (khiêm nhường của もらう) — lịch sự nhất ở N4.',
        '**Mở đầu bằng すみませんが／あのう、** và nêu lý do bằng **～んですが** cho mềm: すみません、{引|ひ}っ{越|こ}しするんですが、{車|くるま}を{貸|か}してもらえませんか.',
        '**Trả lời**: đồng ý — いいですよ／ええ、{喜|よろこ}んで; từ chối khéo — すみません、その{日|ひ}はちょっと…… (bỏ lửng, không nói thẳng "không").',
      ],
    },
    DL('Hỏi – đáp: nhờ bạn, nhờ thầy, kể ai đã giúp', [
      ['ダニエル', 'b', 'パクさん、{日曜日|にちようび}、{引|ひ}っ{越|こ}しを{手伝|てつだ}ってくれませんか。', 'Paku-san, nichiyoubi, hikkoshi o tetsudatte kuremasen ka.', 'Park ơi, Chủ nhật giúp mình chuyển nhà được không?'],
      ['パク', 'c', 'いいですよ。{何時|なんじ}に{行|い}けばいいですか。', 'Ii desu yo. Nanji ni ikeba ii desu ka.', 'Được chứ. Mình đến lúc mấy giờ thì được?'],
      ['ダニエル', 'b', '{10時|じゅうじ}にお{願|ねが}いします。{車|くるま}は{西川|にしかわ}さんに{貸|か}してもらいます。', 'Juuji ni onegai shimasu. Kuruma wa Nishikawa-san ni kashite moraimasu.', '10 giờ nhé. Xe thì mình nhờ anh Nishikawa cho mượn.'],
      ['パク', 'c', '{西川|にしかわ}さん、{優|やさ}しいですね。', 'Nishikawa-san, yasashii desu ne.', 'Anh Nishikawa tốt bụng nhỉ.'],
      ['ダニエル', 'b', 'ええ。{去年|きょねん}も{西川|にしかわ}さんが{手伝|てつだ}ってくれました。', 'Ee. Kyonen mo Nishikawa-san ga tetsudatte kuremashita.', 'Ừ. Năm ngoái anh ấy cũng giúp mình.'],
      ['ダニエル', 'b', '{本田先生|ほんだせんせい}、すみません。{住所|じゅうしょ}が{変|か}わったので、この{書類|しょるい}を{見|み}ていただけませんか。', 'Honda-sensei, sumimasen. Juusho ga kawatta node, kono shorui o mite itadakemasen ka.', 'Thầy Honda, em xin lỗi. Em đổi địa chỉ nên thầy xem giúp em tờ giấy này được không ạ?'],
      ['{本田先生|ほんだせんせい}', 'examiner', 'いいですよ。……ここに{新|あたら}しい{住所|じゅうしょ}を{書|か}いてくださいね。', 'Ii desu yo. …… Koko ni atarashii juusho o kaite kudasai ne.', 'Được thôi. … Em viết địa chỉ mới vào chỗ này nhé.'],
      ['ダニエル', 'b', 'わかりました。{教|おし}えてくださって、ありがとうございます。', 'Wakarimashita. Oshiete kudasatte, arigatou gozaimasu.', 'Em hiểu rồi ạ. Cảm ơn thầy đã chỉ cho em.'],
    ]),
    {
      t: 'table',
      caption: 'Bảng thay thế — một sự việc, hai cách kể: 「＿＿が＿＿てくれました」↔「＿＿に＿＿てもらいました」',
      head: ['Ai', 'Việc gì', '～てくれました', '～てもらいました', 'Romaji (もらう)'],
      rows: [
        ['マルコさん', '{荷物|にもつ}を{運|はこ}ぶ', 'マルコさんが{荷物|にもつ}を{運|はこ}んでくれました。', 'マルコさんに{荷物|にもつ}を{運|はこ}んでもらいました。', 'Maruko-san ni nimotsu o hakonde moraimashita.'],
        ['ナタポンさん', '{車|くるま}を{貸|か}す', 'ナタポンさんが{車|くるま}を{貸|か}してくれました。', 'ナタポンさんに{車|くるま}を{貸|か}してもらいました。', 'Natapon-san ni kuruma o kashite moraimashita.'],
        ['アンナさん', '{鏡|かがみ}を{掛|か}ける', 'アンナさんが{鏡|かがみ}を{掛|か}けてくれました。', 'アンナさんに{鏡|かがみ}を{掛|か}けてもらいました。', 'Anna-san ni kagami o kakete moraimashita.'],
        ['{山口|やまぐち}さん', 'スーパーに{連|つ}れていく', '{山口|やまぐち}さんがスーパーに{連|つ}れていってくれました。', '{山口|やまぐち}さんにスーパーに{連|つ}れていってもらいました。', 'Yamaguchi-san ni suupaa ni tsurete itte moraimashita.'],
        ['{大家|おおや}さん', 'ドアを{直|なお}す', '{大家|おおや}さんがドアを{直|なお}してくれました。', '{大家|おおや}さんにドアを{直|なお}してもらいました。', 'Ooya-san ni doa o naoshite moraimashita.'],
        ['{兄|あに}', '{駅|えき}まで{迎|むか}えに{来|く}る', '{兄|あに}が{駅|えき}まで{迎|むか}えに{来|き}てくれました。', '{兄|あに}に{駅|えき}まで{迎|むか}えに{来|き}てもらいました。', 'Ani ni eki made mukae ni kite moraimashita.'],
        ['{店|みせ}の{人|ひと}', 'プレゼントを{包|つつ}む', '{店|みせ}の{人|ひと}がプレゼントを{包|つつ}んでくれました。', '{店|みせ}の{人|ひと}にプレゼントを{包|つつ}んでもらいました。', 'Mise no hito ni purezento o tsutsunde moraimashita.'],
      ],
    },
    { t: 'rule', formula: 'Vて あげる（tôi → người khác）／ A が Vて くれる（A → tôi）／ A に Vて もらう（tôi ← A）', vi: 'Thêm thể て trước あげる・くれる・もらう để nói một VIỆC LÀM có lợi cho người nhận. Nhờ: ～てくれませんか → ～てもらえませんか → ～ていただけませんか (càng về sau càng lịch sự).' },
    {
      t: 'note',
      title: 'Lỗi hay mắc — tổng hợp ①',
      items: [
        'Quên thể て: ~~{手伝|てつだ}いあげます~~ → **{手伝|てつだ}ってあげます**. ~~{貸|か}しくれました~~ → **{貸|か}してくれました**.',
        'Chia sai thể て: ~~{運|はこ}びてくれました~~ → **{運|はこ}んでくれました** (ぶ → んで). ~~{書|か}きてもらいました~~ → **{書|か}いてもらいました**.',
        'Nói ～てあげます với người trên → đổi thành **～ましょうか**. Nhờ người trên bằng ~~～てくれ~~ (mệnh lệnh của くれる — rất thô) → **～ていただけませんか**.',
        '~~{私|わたし}にくれました~~ (thừa nhưng không sai) — bình thường bỏ {私|わたし}に; còn ~~{私|わたし}がくれました~~ là SAI hẳn (tôi không bao giờ là người "くれる").',
      ],
    },

    /* ══════ ② ～ておく ══════ */
    { t: 'h', text: '② Vて おく — làm trước (chuẩn bị) · để nguyên · làm cho xong' },
    {
      t: 'p',
      text: '**おく** gốc là {置|お}く (đặt, để). Gắn sau thể て, nó mang nghĩa **"làm rồi để đó"** — làm một việc **có mục đích cho sau này**. Ba cách dùng: **(1)** làm **trước** để chuẩn bị cho một việc sắp tới (trước ngày chuyển nhà, trước khi khách đến); **(2)** **để nguyên** một trạng thái (để cửa mở, để đồ đó); **(3)** làm **cho xong**, xử lý luôn để sau khỏi phải lo (rửa cốc, cất đồ). Chủ ngữ là **người làm**, tân ngữ đi với **を** như thường.',
    },
    {
      t: 'table',
      caption: 'Cách chia ～ておく — và dạng nói tắt ～とく／～どく (rất hay nghe trong phim, hội thoại bạn bè)',
      head: ['Thể て', '～ておきます', 'Romaji', 'Văn nói ～とく', 'Romaji'],
      rows: [
        ['{買|か}って', '{買|か}っておきます', 'katte okimasu', '{買|か}っとく', 'kattoku'],
        ['{調|しら}べて', '{調|しら}べておきます', 'shirabete okimasu', '{調|しら}べとく', 'shirabetoku'],
        ['{用意|ようい}して', '{用意|ようい}しておきます', 'youi shite okimasu', '{用意|ようい}しとく', 'youi shitoku'],
        ['{読|よ}んで', '{読|よ}んでおきます', 'yonde okimasu', '{読|よ}んどく (で → ど)', 'yondoku'],
        ['{頼|たの}んで', '{頼|たの}んでおきました', 'tanonde okimashita', '{頼|たの}んどいた', 'tanondoita'],
        ['{開|あ}けて', '{開|あ}けておいてください', 'akete oite kudasai', '{開|あ}けといて', 'aketoite'],
        ['{冷|ひ}やして', '{冷|ひ}やしておこう (ý chí)', 'hiyashite okou', '{冷|ひ}やしとこう', 'hiyashitokou'],
      ],
    },
    {
      t: 'note',
      title: 'Chia おく như động từ nhóm 1',
      items: [
        'おきます (sẽ làm sẵn) · おきました (đã làm sẵn) · **おいて**ください (hãy làm sẵn / cứ để vậy — く → いて) · おこう／おきましょう (làm sẵn đi) · おかなければなりません (phải làm sẵn) · ～ておいたほうがいいです (nên làm sẵn — ôn ポイント 105).',
        'Dạng nói: **～ておく → ～とく**, **～でおく → ～どく** ({読|よ}んでおく → {読|よ}んどく). ～ておいて → **～といて**, ～ておいた → **～といた**. Viết bài, nói với người trên thì dùng dạng đầy đủ.',
        'Viết **おく bằng hiragana** khi là mẫu ngữ pháp (～ておく); chỉ viết {置|お}く khi là động từ "đặt" thật: {机|つくえ}の{上|うえ}に{置|お}く.',
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'Vて おく ① — LÀM TRƯỚC để chuẩn bị (～{前|まえ}に、～ておく)',
          vi: 'Cách dùng phổ biến nhất. Hay đi với **～{前|まえ}に** (ポイント 106), **までに**, **もう**, **{先|さき}に**. Nghĩ: "để đến lúc đó khỏi lo / khỏi vội".',
          examples: [
            E('{引|ひ}っ{越|こ}しの{前|まえ}に、{段|だん}ボールを{集|あつ}めておきます。', 'Hikkoshi no mae ni, danbooru o atsumete okimasu.', 'Trước khi chuyển nhà, tôi gom sẵn thùng các-tông.'),
            E('{友達|ともだち}が{来|く}るので、ジュースを{冷|ひ}やしておきました。', 'Tomodachi ga kuru node, juusu o hiyashite okimashita.', 'Bạn sắp đến nên tôi đã ướp lạnh nước trái cây sẵn.'),
            E('{授業|じゅぎょう}の{前|まえ}に、{新|あたら}しい{言葉|ことば}を{調|しら}べておいてください。', 'Jugyou no mae ni, atarashii kotoba o shirabete oite kudasai.', 'Trước giờ học, các em hãy tra trước từ mới.'),
            E('{旅行|りょこう}に{行|い}く{前|まえ}に、ホテルを{予約|よやく}しておいたほうがいいですよ。', 'Ryokou ni iku mae ni, hoteru o yoyaku shite oita hou ga ii desu yo.', 'Trước khi đi du lịch thì nên đặt khách sạn trước.'),
            E('{大家|おおや}さんにはもう{連絡|れんらく}しておきました。', 'Ooya-san ni wa mou renraku shite okimashita.', 'Tôi đã liên lạc trước với chủ nhà rồi.'),
            E('{明日|あした}は{早|はや}いから、{今夜|こんや}{荷物|にもつ}を{用意|ようい}しておこう。', 'Ashita wa hayai kara, kon\'ya nimotsu o youi shite okou.', 'Mai phải đi sớm nên tối nay chuẩn bị sẵn đồ đi.'),
          ],
        },
        {
          formula: 'Vて おく ② — ĐỂ NGUYÊN trạng thái (cứ để vậy)',
          vi: 'Làm cho một trạng thái **tiếp tục** (hoặc **không thay đổi** nó) vì có lý do. Câu cố định: **そのままにしておいてください** (cứ để nguyên như thế).',
          examples: [
            E('{暑|あつ}いので、{窓|まど}を{開|あ}けておきましょう。', 'Atsui node, mado o akete okimashou.', 'Nóng nên cứ để cửa sổ mở đi.'),
            E('{箱|はこ}はそのままにしておいてください。{後|あと}で{私|わたし}が{片付|かたづ}けます。', 'Hako wa sono mama ni shite oite kudasai. Ato de watashi ga katazukemasu.', 'Các thùng cứ để nguyên đấy. Lát nữa tôi dọn.'),
            E('{夜|よる}{遅|おそ}く{帰|かえ}るので、{玄関|げんかん}の{電気|でんき}をつけておいてくれませんか。', 'Yoru osoku kaeru node, genkan no denki o tsukete oite kuremasen ka.', 'Tối tôi về muộn, bạn để đèn lối vào sáng giúp tôi được không?'),
            E('{残|のこ}ったケーキは{冷蔵庫|れいぞうこ}に{入|い}れておきます。', 'Nokotta keeki wa reizouko ni irete okimasu.', 'Bánh còn thừa tôi cho vào tủ lạnh để đó.'),
            E('{会議室|かいぎしつ}の{椅子|いす}は、{明日|あした}も{使|つか}うので{並|なら}べておいてください。', 'Kaigishitsu no isu wa, ashita mo tsukau node narabete oite kudasai.', 'Ghế phòng họp mai còn dùng nên cứ để xếp như vậy.'),
          ],
        },
        {
          formula: 'Vて おく ③ — LÀM CHO XONG, xử lý luôn (để sau khỏi lo)',
          vi: 'Làm xong một việc ngay bây giờ để mọi thứ gọn gàng, sau khỏi phải làm. Hay gặp khi **dặn việc**: {洗|あら}っておいて, {片付|かたづ}けておいて, {捨|す}てておいて.',
          examples: [
            E('{使|つか}ったコップは{洗|あら}っておいてね。', 'Tsukatta koppu wa aratte oite ne.', 'Cốc dùng rồi thì rửa luôn nhé.'),
            E('{要|い}らない{物|もの}は{今週中|こんしゅうちゅう}に{捨|す}てておきます。', 'Iranai mono wa konshuuchuu ni sutete okimasu.', 'Đồ không cần tôi sẽ vứt cho xong trong tuần này.'),
            E('{借|か}りた{車|くるま}は、ガソリンを{入|い}れてから{返|かえ}しておきました。', 'Karita kuruma wa, gasorin o irete kara kaeshite okimashita.', 'Xe mượn thì tôi đổ xăng rồi trả lại xong rồi.'),
            E('メールは{私|わたし}が{読|よ}んでおきますから、{心配|しんぱい}しないでください。', 'Meeru wa watashi ga yonde okimasu kara, shinpai shinaide kudasai.', 'Email để tôi đọc cho, đừng lo.'),
            E('{布団|ふとん}は{押|お}し{入|い}れにしまっておきました。', 'Futon wa oshiire ni shimatte okimashita.', 'Chăn đệm tôi đã cất vào tủ rồi.'),
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Kết hợp ～ておく với mẫu đã học — câu rất hay gặp',
      items: [
        '**～ておけばいいですか** (Bài 17 ～ば): {何|なに}を{用意|ようい}しておけばいいですか (nên chuẩn bị sẵn gì?).',
        '**～ておいてもいいですか** (ポイント 89): {窓|まど}を{開|あ}けておいてもいいですか (để cửa mở có được không?).',
        '**～ておいてくれる／もらう** (① của bài): {大家|おおや}さんが{冷蔵庫|れいぞうこ}を{用意|ようい}しておいてくれました · {友達|ともだち}に{席|せき}を{取|と}っておいてもらいました (nhờ bạn giữ chỗ trước).',
        '**Vないでおく** (biết trước, N3): cố ý **không** làm, để nguyên: {子|こ}どもが{寝|ね}ているので、{電気|でんき}をつけないでおきます.',
      ],
    },
    DL('Hỏi – đáp với ～ておく (chuẩn bị chuyển nhà)', [
      ['リン', 'c', '{引|ひ}っ{越|こ}しの{前|まえ}に、{何|なに}をしておけばいいですか。', 'Hikkoshi no mae ni, nani o shite okeba ii desu ka.', 'Trước khi chuyển nhà thì nên làm sẵn những gì?'],
      ['マルコ', 'b', 'まず、{大家|おおや}さんに{引|ひ}っ{越|こ}しの{日|ひ}を{連絡|れんらく}しておいたほうがいいですよ。', 'Mazu, ooya-san ni hikkoshi no hi o renraku shite oita hou ga ii desu yo.', 'Trước hết nên báo trước ngày chuyển cho chủ nhà.'],
      ['リン', 'c', '{電気|でんき}やガスは？', 'Denki ya gasu wa?', 'Còn điện với ga?'],
      ['マルコ', 'b', '{1週間前|いっしゅうかんまえ}までに{電話|でんわ}しておけば{大丈夫|だいじょうぶ}です。', 'Isshuukan mae made ni denwa shite okeba daijoubu desu.', 'Gọi trước chậm nhất 1 tuần là ổn.'],
      ['リン', 'c', '{荷物|にもつ}はいつ{箱|はこ}に{入|い}れておけばいいですか。', 'Nimotsu wa itsu hako ni irete okeba ii desu ka.', 'Đồ đạc thì nên cho vào thùng từ lúc nào?'],
      ['マルコ', 'b', '{使|つか}わない{物|もの}は、{今|いま}から{入|い}れておきましょう。{毎日|まいにち}{使|つか}う{物|もの}は{前|まえ}の{日|ひ}でいいですよ。', 'Tsukawanai mono wa, ima kara irete okimashou. Mainichi tsukau mono wa mae no hi de ii desu yo.', 'Đồ không dùng thì cho vào thùng từ bây giờ. Đồ dùng hằng ngày thì để hôm trước cũng được.'],
      ['アンナ', 'a', 'リン、{窓|まど}、{閉|し}めとこうか。', 'Rin, mado, shimetokou ka.', 'Lin ơi, mình đóng cửa sổ lại nhé?'],
      ['リン', 'c', 'ううん、{暑|あつ}いから{開|あ}けといて。', 'Uun, atsui kara aketoite.', 'Không, nóng mà, cứ để mở đi.'],
    ]),
    {
      t: 'table',
      caption: 'Bảng thay thế — 「＿＿の{前|まえ}に、＿＿ておきます」',
      head: ['Việc sắp tới', 'Chuẩn bị gì', 'Câu hoàn chỉnh', 'Romaji'],
      rows: [
        ['{引|ひ}っ{越|こ}し', '{段|だん}ボールを{集|あつ}める', '{引|ひ}っ{越|こ}しの{前|まえ}に、{段|だん}ボールを{集|あつ}めておきます。', 'Hikkoshi no mae ni, danbooru o atsumete okimasu.'],
        ['パーティー', '{飲|の}み{物|もの}を{冷|ひ}やす', 'パーティーの{前|まえ}に、{飲|の}み{物|もの}を{冷|ひ}やしておきます。', 'Paatii no mae ni, nomimono o hiyashite okimasu.'],
        ['{旅行|りょこう}', 'ホテルを{予約|よやく}する', '{旅行|りょこう}の{前|まえ}に、ホテルを{予約|よやく}しておきます。', 'Ryokou no mae ni, hoteru o yoyaku shite okimasu.'],
        ['{授業|じゅぎょう}', '{教科書|きょうかしょ}を{読|よ}む', '{授業|じゅぎょう}の{前|まえ}に、{教科書|きょうかしょ}を{読|よ}んでおきます。', 'Jugyou no mae ni, kyoukasho o yonde okimasu.'],
        ['{面接|めんせつ}', '{答|こた}えを{考|かんが}える', '{面接|めんせつ}の{前|まえ}に、{答|こた}えを{考|かんが}えておきます。', 'Mensetsu no mae ni, kotae o kangaete okimasu.'],
        ['お{客|きゃく}さんが{来|く}る', '{部屋|へや}を{掃除|そうじ}する', 'お{客|きゃく}さんが{来|く}る{前|まえ}に、{部屋|へや}を{掃除|そうじ}しておきます。', 'Okyaku-san ga kuru mae ni, heya o souji shite okimasu.'],
        ['{寝|ね}る', '{明日|あした}の{服|ふく}を{用意|ようい}する', '{寝|ね}る{前|まえ}に、{明日|あした}の{服|ふく}を{用意|ようい}しておきます。', 'Neru mae ni, ashita no fuku o youi shite okimasu.'],
        ['{出|で}かける', 'ごみを{出|だ}す', '{出|で}かける{前|まえ}に、ごみを{出|だ}しておきます。', 'Dekakeru mae ni, gomi o dashite okimasu.'],
      ],
    },
    { t: 'rule', formula: 'Vて おく（～とく）： làm trước ／ để nguyên ／ làm cho xong', vi: 'Người làm là chủ ngữ, tân ngữ đi với を. Dùng cho việc có MỤC ĐÍCH về sau; hay đi với ～前に・までに・もう.' },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～ておく',
      items: [
        '~~{開|あ}けておきてください~~ → **{開|あ}けておいてください** (おく nhóm 1: く → いて).',
        '~~{雨|あめ}が{降|ふ}っておきます~~ — ～ておく chỉ dùng cho việc **con người cố ý làm**; mưa, đồ vật tự thay đổi thì không.',
        '~~{窓|まど}が{開|あ}けておきます~~ → **{窓|まど}を{開|あ}けておきます** (～ておく là hành động — tân ngữ を). Muốn tả trạng thái của cửa sổ thì dùng **～てある** (Ngữ pháp ③): {窓|まど}が{開|あ}けてあります.',
        'Quên ～ておく làm câu mất ý chuẩn bị: {明日|あした}テストがあるので、{今日|きょう}{勉強|べんきょう}します (chỉ là học) ↔ {今日|きょう}{勉強|べんきょう}しておきます (học trước để mai thi).',
        'Nói ～とく với thầy cô, người lạ: ~~{先生|せんせい}、{読|よ}んどきます~~ → **{読|よ}んでおきます**.',
      ],
    },

    /* ══════ ③ ～てある ══════ */
    { t: 'h', text: '③ N が 他動詞て ある — "(đã được ai đó) làm sẵn": trạng thái còn lại' },
    {
      t: 'p',
      text: 'Khi bước vào phòng mới, リン thấy: trên tường **có treo** gương, trên giá **có để** thư, thùng **có ghi** chữ. Những trạng thái đó **do ai đó cố ý làm ra** và **vẫn còn** trước mắt — tiếng Nhật nói bằng **N が + tha động từ (他動詞) thể て + あります**. Người nói **không quan tâm ai làm** (thường không nói ra), chỉ nhấn vào **kết quả** và thường cả **mục đích** của việc đó (dán bảng để nhớ ngày rác, mở cửa để thoáng). Bạn đã học một mẫu "trạng thái" khác ở **Bài 15 ポイント 122: N が 自動詞 ています** ({窓|まど}が{開|あ}いています) — so sánh ở bảng bên dưới.',
    },
    {
      t: 'table',
      caption: 'Công thức ～てある — CHỈ đi với tha động từ (động từ có を: 書く・貼る・置く・開ける…)',
      head: ['Câu hành động (ai đó làm)', '→ Trạng thái còn lại (～てある)', 'Romaji', 'Nghĩa'],
      rows: [
        ['（{誰|だれ}かが）{壁|かべ}に{地図|ちず}**を**{貼|は}った', '{壁|かべ}に{地図|ちず}**が**{貼|は}ってあります。', 'Kabe ni chizu ga hatte arimasu.', 'Trên tường có dán bản đồ.'],
        ['（{誰|だれ}かが）{箱|はこ}に{名前|なまえ}**を**{書|か}いた', '{箱|はこ}に{名前|なまえ}**が**{書|か}いてあります。', 'Hako ni namae ga kaite arimasu.', 'Trên thùng có ghi tên.'],
        ['（{誰|だれ}かが）{棚|たな}に{手紙|てがみ}**を**{置|お}いた', '{棚|たな}に{手紙|てがみ}**が**{置|お}いてあります。', 'Tana ni tegami ga oite arimasu.', 'Trên giá có để một lá thư.'],
        ['（{誰|だれ}かが）{窓|まど}**を**{開|あ}けた', '{窓|まど}**が**{開|あ}けてあります。', 'Mado ga akete arimasu.', 'Cửa sổ được mở sẵn (có chủ ý).'],
        ['（{誰|だれ}かが）ビール**を**{冷|ひ}やした', 'ビール**が**{冷|ひ}やしてあります。', 'Biiru ga hiyashite arimasu.', 'Bia đã được ướp lạnh sẵn.'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '[nơi] に N が 他動詞て あります ／ N は [nơi] に 他動詞て あります',
          vi: 'Tả **cảnh trước mắt**: đồ vật đang ở trạng thái mà ai đó **đã cố ý tạo ra**. Hai trật tự giống mẫu あります ở Bài 7: nói nơi trước (～に～が) khi giới thiệu cảnh; nói vật trước (～は～に) khi trả lời "cái đó ở đâu / thế nào".',
          examples: [
            E('{壁|かべ}にカレンダーが{掛|か}けてあります。', 'Kabe ni karendaa ga kakete arimasu.', 'Trên tường có treo lịch.'),
            E('{机|つくえ}の{上|うえ}に{花|はな}が{飾|かざ}ってあります。', 'Tsukue no ue ni hana ga kazatte arimasu.', 'Trên bàn có cắm hoa trang trí.'),
            E('{鍵|かぎ}は{引|ひ}き{出|だ}しに{入|い}れてあります。', 'Kagi wa hikidashi ni irete arimasu.', 'Chìa khoá thì đã cất trong ngăn kéo.'),
            E('ドアの{前|まえ}に{自転車|じてんしゃ}が{止|と}めてあります。', 'Doa no mae ni jitensha ga tomete arimasu.', 'Trước cửa có (người) dựng xe đạp.'),
            E('この{紙|かみ}に、ごみの{出|だ}し{方|かた}が{書|か}いてあります。', 'Kono kami ni, gomi no dashikata ga kaite arimasu.', 'Tờ giấy này có ghi cách đổ rác.'),
            E('{玄関|げんかん}に{靴|くつ}がきれいに{並|なら}べてあります。', 'Genkan ni kutsu ga kirei ni narabete arimasu.', 'Ở lối vào giày dép được xếp ngay ngắn.'),
          ],
        },
        {
          formula: '(N は) もう Vて あります — việc chuẩn bị ĐÃ XONG (kết quả của ～ておいた)',
          vi: 'Khi trả lời "đã chuẩn bị chưa?", ～てあります nói **việc chuẩn bị đã xong và kết quả còn đó** — gần nghĩa ～ておきました nhưng nhìn từ **kết quả**. Ở cách dùng này đôi khi người Nhật giữ **を** (チケット**を**{買|か}ってあります) — gặp nhiều ở N3; ở N4 cứ dùng **は／が** là an toàn.',
          examples: [
            E('ホテルはもう{予約|よやく}してあります。', 'Hoteru wa mou yoyaku shite arimasu.', 'Khách sạn thì đã đặt sẵn rồi.'),
            E('{大家|おおや}さんには{引|ひ}っ{越|こ}しの{日|ひ}が{伝|つた}えてあります。', 'Ooya-san ni wa hikkoshi no hi ga tsutaete arimasu.', 'Ngày chuyển nhà thì đã báo cho chủ nhà rồi.'),
            E('{段|だん}ボールは{20枚|にじゅうまい}{用意|ようい}してあります。', 'Danbooru wa nijuu-mai youi shite arimasu.', 'Thùng các-tông đã chuẩn bị sẵn 20 tấm (chưa gấp — đếm bằng 枚).'),
            E('{明日|あした}の{会議|かいぎ}の{資料|しりょう}は、もうコピーしてあります。', 'Ashita no kaigi no shiryou wa, mou kopii shite arimasu.', 'Tài liệu họp ngày mai đã photo sẵn rồi.'),
            E('{飲|の}み{物|もの}は{冷蔵庫|れいぞうこ}に{冷|ひ}やしてありますから、どうぞ。', 'Nomimono wa reizouko ni hiyashite arimasu kara, douzo.', 'Đồ uống có ướp lạnh sẵn trong tủ, mời bạn.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: '⭐ Bảng phân biệt quan trọng nhất của bài — cùng một cửa sổ, năm câu',
      head: ['Câu', 'Romaji', 'Mẫu', 'Ý nghĩa', 'Ai làm?'],
      rows: [
        ['リンさんが{窓|まど}を{開|あ}けます。', 'Rin-san ga mado o akemasu.', '他動詞 ます', 'hành động: Lin (sẽ) mở cửa sổ', 'Lin — nói rõ'],
        ['リンさんが{窓|まど}を{開|あ}けています。', 'Rin-san ga mado o akete imasu.', '他動詞 ている', 'Lin ĐANG mở cửa sổ (hành động đang diễn ra)', 'Lin — nói rõ'],
        ['リンさんが{窓|まど}を{開|あ}けておきました。', 'Rin-san ga mado o akete okimashita.', '他動詞 ておく', 'Lin đã mở SẴN / cứ để mở (vì có mục đích)', 'Lin — nói rõ'],
        ['{窓|まど}が{開|あ}けてあります。', 'Mado ga akete arimasu.', '他動詞 てある', 'cửa sổ ĐƯỢC mở sẵn — có người cố ý mở, kết quả còn đó', 'có người, nhưng không nói'],
        ['{窓|まど}が{開|あ}いています。', 'Mado ga aite imasu.', '自動詞 ている (ポイント 122)', 'cửa sổ ĐANG MỞ — chỉ tả trạng thái (có thể gió mở, ai quên đóng)', 'không quan tâm'],
      ],
    },
    {
      t: 'note',
      title: 'Cảm giác khác nhau giữa ～ている (tự) và ～てある (tha)',
      items: [
        '**{電気|でんき}がついています** — đèn đang sáng (có thể ai quên tắt — trung tính, hay dùng khi phát hiện). **{電気|でんき}がつけてあります** — đèn được bật sẵn (có lý do: để khách đến không phải mò tối).',
        '**{車|くるま}が{止|と}まっています** — có cái xe đang đỗ / dừng (chỉ thấy vậy). **{車|くるま}が{止|と}めてあります** — xe đã được (ai đó) đỗ ở đây (cố ý — vd マルコ đỗ sẵn chờ chở đồ).',
        'Động từ **chỉ có dạng tha** ({書|か}く, {貼|は}る, {置|お}く, {飾|かざ}る, {冷|ひ}やす, {用意|ようい}する) thì tả trạng thái **chỉ dùng ～てある**: {名前|なまえ}が{書|か}いてあります ✓ — KHÔNG có ~~{書|か}いています~~ với nghĩa trạng thái (nó nghĩa là "đang viết").',
        'Động từ **chỉ có dạng tự** ({降|ふ}る, {咲|さ}く, {壊|こわ}れる) thì **không bao giờ** đi với ～てある: ~~{雨|あめ}が{降|ふ}ってあります~~, ~~{椅子|いす}が{壊|こわ}れてあります~~.',
      ],
    },
    {
      t: 'table',
      caption: '～ておく ↔ ～てある — một việc, hai thời điểm',
      head: ['', '～ておく', '～てある'],
      rows: [
        ['Nhìn vào', '**HÀNH ĐỘNG** chuẩn bị của người làm', '**KẾT QUẢ** còn lại sau hành động'],
        ['Chủ ngữ', 'người làm (が／は) + vật **を**', 'vật **が／は** (người làm thường không nói)'],
        ['Thời', 'trước, đang định, vừa làm: ～ておきます／ておきました', 'hiện tại — trạng thái đang thấy: ～てあります'],
        ['Ví dụ', '{私|わたし}が{冷蔵庫|れいぞうこ}にビールを{冷|ひ}やしておきました。', 'ビールが{冷|ひ}やしてあります。'],
        ['Romaji', 'Watashi ga reizouko ni biiru o hiyashite okimashita.', 'Biiru ga hiyashite arimasu.'],
        ['Nghĩa', 'Tôi đã ướp lạnh sẵn bia trong tủ.', 'Bia đã được ướp lạnh sẵn (đang lạnh, uống được ngay).'],
      ],
    },
    DL('Hỏi – đáp với ～てある (ở phòng mới của リン)', [
      ['マルコ', 'b', 'リンさん、{自転車|じてんしゃ}の{鍵|かぎ}はどこですか。', 'Rin-san, jitensha no kagi wa doko desu ka.', 'Lin ơi, chìa khoá xe đạp ở đâu?'],
      ['リン', 'c', '{玄関|げんかん}の{棚|たな}の{上|うえ}に{置|お}いてあります。', 'Genkan no tana no ue ni oite arimasu.', 'Để sẵn trên kệ ở lối vào đấy.'],
      ['マルコ', 'b', 'あ、ありました。……この{紙|かみ}は{何|なん}ですか。{壁|かべ}に{貼|は}ってありますね。', 'A, arimashita. …… Kono kami wa nan desu ka. Kabe ni hatte arimasu ne.', 'À, thấy rồi. … Tờ giấy này là gì thế? Dán trên tường kìa.'],
      ['リン', 'c', 'ごみの{日|ひ}の{表|ひょう}です。{毎朝|まいあさ}{見|み}るので、ここに{貼|は}っておきました。', 'Gomi no hi no hyou desu. Maiasa miru node, koko ni hatte okimashita.', 'Bảng lịch đổ rác. Sáng nào mình cũng xem nên dán sẵn ở đây.'],
      ['マルコ', 'b', '{窓|まど}が{開|あ}いていますね。{閉|し}めましょうか。', 'Mado ga aite imasu ne. Shimemashou ka.', 'Cửa sổ đang mở kìa. Để mình đóng nhé?'],
      ['リン', 'c', 'いいえ、{新|あたら}しい{家具|かぐ}のにおいがするので、{開|あ}けてあるんです。', 'Iie, atarashii kagu no nioi ga suru node, akete aru n desu.', 'Không, đồ mới còn mùi nên mình cố ý mở đấy.'],
      ['マルコ', 'b', 'なるほど。{冷蔵庫|れいぞうこ}に{飲|の}み{物|もの}はありますか。', 'Naruhodo. Reizouko ni nomimono wa arimasu ka.', 'Ra vậy. Trong tủ lạnh có đồ uống không?'],
      ['リン', 'c', 'はい、{冷|ひ}やしてあります。どうぞ{飲|の}んでください。', 'Hai, hiyashite arimasu. Douzo nonde kudasai.', 'Có, mình ướp lạnh sẵn rồi. Cậu uống đi.'],
    ]),
    {
      t: 'table',
      caption: 'Bảng thay thế — nhìn quanh phòng: 「＿＿に＿＿が＿＿てあります」',
      head: ['Ở đâu', 'Cái gì', 'Động từ (tha)', 'Câu hoàn chỉnh', 'Romaji'],
      rows: [
        ['{壁|かべ}', 'カレンダー', '{掛|か}ける', '{壁|かべ}にカレンダーが{掛|か}けてあります。', 'Kabe ni karendaa ga kakete arimasu.'],
        ['{棚|たな}の{上|うえ}', '{家族|かぞく}の{写真|しゃしん}', '{飾|かざ}る', '{棚|たな}の{上|うえ}に{家族|かぞく}の{写真|しゃしん}が{飾|かざ}ってあります。', 'Tana no ue ni kazoku no shashin ga kazatte arimasu.'],
        ['ドア', '{名前|なまえ}', '{書|か}く', 'ドアに{名前|なまえ}が{書|か}いてあります。', 'Doa ni namae ga kaite arimasu.'],
        ['{冷蔵庫|れいぞうこ}', 'メモ', '{貼|は}る', '{冷蔵庫|れいぞうこ}にメモが{貼|は}ってあります。', 'Reizouko ni memo ga hatte arimasu.'],
        ['{引|ひ}き{出|だ}し', '{鍵|かぎ}', '{入|い}れる', '{引|ひ}き{出|だ}しに{鍵|かぎ}が{入|い}れてあります。', 'Hikidashi ni kagi ga irete arimasu.'],
        ['{玄関|げんかん}', 'スリッパ', '{並|なら}べる', '{玄関|げんかん}にスリッパが{並|なら}べてあります。', 'Genkan ni surippa ga narabete arimasu.'],
        ['{駐車場|ちゅうしゃじょう}', 'トラック', '{止|と}める', '{駐車場|ちゅうしゃじょう}にトラックが{止|と}めてあります。', 'Chuushajou ni torakku ga tomete arimasu.'],
        ['{押|お}し{入|い}れ', '{布団|ふとん}', 'しまう', '{押|お}し{入|い}れに{布団|ふとん}がしまってあります。', 'Oshiire ni futon ga shimatte arimasu.'],
      ],
    },
    { t: 'rule', formula: '[nơi] に N が 他動詞て あります', vi: 'Tả trạng thái do NGƯỜI cố ý tạo ra, kết quả còn trước mắt (thường có mục đích). Chỉ dùng tha động từ; vật đi với が／は. Tự động từ tả trạng thái thì dùng ～ています.' },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～てある',
      items: [
        '~~{窓|まど}が{開|あ}いてあります~~ → {開|あ}く là **tự** động từ → **{窓|まど}が{開|あ}いています** hoặc đổi sang tha **{窓|まど}が{開|あ}けてあります**.',
        '~~{壁|かべ}に{地図|ちず}を{貼|は}ってあります~~ (khi tả cảnh) → **{地図|ちず}が** (vật là chủ ngữ của trạng thái).',
        '~~リンさんが{窓|まど}を{開|あ}けてあります~~ → ～てある không đặt người làm làm chủ ngữ. Muốn nói người làm → **リンさんが{窓|まど}を{開|あ}けておきました**.',
        '~~{地図|ちず}が{貼|は}ってあります~~ dùng cho việc **đang dán** → sai; đang dán = **{地図|ちず}を{貼|は}っています**.',
        '~~{名前|なまえ}が{書|か}いています~~ → tả trạng thái của chữ trên giấy phải là **{書|か}いてあります** ({書|か}く không có tự động từ đi cặp).',
      ],
    },

    /* ══════ TỔNG KẾT ══════ */
    { t: 'h', text: 'Luyện tổng hợp — ghép câu, chia, điền, trắc nghiệm kiểu đề N4' },
    {
      t: 'build',
      id: 'b18-np-ghep',
      title: 'Ghép câu — bấm mảnh theo đúng thứ tự (12 câu)',
      items: [
        { vi: 'Để mình giúp cho.', chips: ['{僕|ぼく}が', '{手伝|てつだ}って', 'あげます', 'くれます', 'もらいます'], answer: ['{僕|ぼく}が', '{手伝|てつだ}って', 'あげます'], ro: 'Boku ga tetsudatte agemasu.' },
        { vi: 'Nattapon đã cho tôi mượn xe.', chips: ['ナタポンさんが', '{車|くるま}を', '{貸|か}して', 'くれました', 'あげました', 'ナタポンさんに'], answer: ['ナタポンさんが', '{車|くるま}を', '{貸|か}して', 'くれました'], ro: 'Natapon-san ga kuruma o kashite kuremashita.' },
        { vi: 'Tôi được Anna gom thùng các-tông cho.', chips: ['{私|わたし}は', 'アンナさんに', '{段|だん}ボールを', '{集|あつ}めて', 'もらいました', 'アンナさんが', 'くれました'], answer: ['{私|わたし}は', 'アンナさんに', '{段|だん}ボールを', '{集|あつ}めて', 'もらいました'], alt: [['{私|わたし}は', '{段|だん}ボールを', 'アンナさんに', '{集|あつ}めて', 'もらいました']], ro: 'Watashi wa Anna-san ni danbooru o atsumete moraimashita.' },
        { vi: 'Giúp mình một chút được không?', chips: ['ちょっと', '{手伝|てつだ}って', 'くれませんか', 'あげませんか', 'おきませんか'], answer: ['ちょっと', '{手伝|てつだ}って', 'くれませんか'], ro: 'Chotto tetsudatte kuremasen ka.' },
        { vi: 'Thưa thầy, thầy xem giúp em bài văn được không ạ?', chips: ['{先生|せんせい}', '{作文|さくぶん}を', '{見|み}て', 'いただけませんか', 'あげませんか', '{見|み}せて'], answer: ['{先生|せんせい}', '{作文|さくぶん}を', '{見|み}て', 'いただけませんか'], ro: 'Sensei, sakubun o mite itadakemasen ka.' },
        { vi: 'Trước chuyến du lịch, tôi đặt sẵn khách sạn.', chips: ['{旅行|りょこう}の', '{前|まえ}に', 'ホテルを', '{予約|よやく}して', 'おきます', 'あります'], answer: ['{旅行|りょこう}の', '{前|まえ}に', 'ホテルを', '{予約|よやく}して', 'おきます'], ro: 'Ryokou no mae ni, hoteru o yoyaku shite okimasu.' },
        { vi: 'Cửa sổ thì cứ để mở nhé.', chips: ['{窓|まど}は', '{開|あ}けて', 'おいて', 'ください', 'あって', '{開|あ}いて'], answer: ['{窓|まど}は', '{開|あ}けて', 'おいて', 'ください'], ro: 'Mado wa akete oite kudasai.' },
        { vi: 'Cốc dùng rồi thì rửa luôn nhé.', chips: ['{使|つか}った', 'コップは', '{洗|あら}って', 'おいてね', 'あってね', '{使|つか}う'], answer: ['{使|つか}った', 'コップは', '{洗|あら}って', 'おいてね'], ro: 'Tsukatta koppu wa aratte oite ne.' },
        { vi: 'Trên tường có dán bản đồ.', chips: ['{壁|かべ}に', '{地図|ちず}が', '{貼|は}って', 'あります', 'おきます', '{地図|ちず}を'], answer: ['{壁|かべ}に', '{地図|ちず}が', '{貼|は}って', 'あります'], alt: [['{地図|ちず}が', '{壁|かべ}に', '{貼|は}って', 'あります']], ro: 'Kabe ni chizu ga hatte arimasu.' },
        { vi: 'Trên thùng có ghi chữ "sách".', chips: ['{箱|はこ}に', '「{本|ほん}」と', '{書|か}いて', 'あります', 'います', 'おきます'], answer: ['{箱|はこ}に', '「{本|ほん}」と', '{書|か}いて', 'あります'], ro: 'Hako ni "hon" to kaite arimasu.' },
        { vi: 'Bia thì đã ướp lạnh sẵn rồi.', chips: ['ビールは', 'もう', '{冷|ひ}やして', 'あります', 'います', '{冷|ひ}えて'], answer: ['ビールは', 'もう', '{冷|ひ}やして', 'あります'], ro: 'Biiru wa mou hiyashite arimasu.' },
        { vi: 'Cảm ơn cậu đã giúp mình.', chips: ['{手伝|てつだ}って', 'くれて', 'ありがとう', 'あげて', 'もらって'], answer: ['{手伝|てつだ}って', 'くれて', 'ありがとう'], ro: 'Tetsudatte kurete arigatou.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b18-np-chia',
      title: 'Chia — gõ dạng được yêu cầu (12 câu)',
      kind: 'fill',
      grammar: 'Thể て + あげる／くれる／もらう／いただけませんか · Vて + おく (おきます・おいてください・～とく) · Vて + あります (tha động từ)',
      items: [
        { q: '{手伝|てつだ}う → ～てあげます', answers: V('{手伝|てつだ}ってあげます'), hint: 'う → って' },
        { q: '{貸|か}す → ～てくれました', answers: V('{貸|か}してくれました'), hint: 'す → して' },
        { q: '{教|おし}える → ～てもらいました', answers: V('{教|おし}えてもらいました'), hint: 'nhóm 2: bỏ る + て' },
        { q: '{待|ま}つ → ～てくれませんか', answers: V('{待|ま}ってくれませんか'), hint: 'つ → って' },
        { q: '{見|み}る → ～ていただけませんか', answers: V('{見|み}ていただけませんか'), hint: 'nhóm 2' },
        { q: '{運|はこ}ぶ → ～てもらいました', answers: V('{運|はこ}んでもらいました'), hint: 'ぶ → んで' },
        { q: '{買|か}う → ～ておきます', answers: V('{買|か}っておきます'), hint: 'う → って' },
        { q: '{読|よ}む → ～ておいてください', answers: V('{読|よ}んでおいてください'), hint: 'む → んで; おく → おいて' },
        { q: '{予約|よやく}する → ～ておきました', answers: V('{予約|よやく}しておきました'), hint: 'する → して' },
        { q: '{開|あ}ける → ～ておく (văn nói, thể từ điển)', answers: V('{開|あ}けとく'), hint: '～ておく → ～とく' },
        { q: '{書|か}く → ～てあります', answers: V('{書|か}いてあります'), hint: 'く → いて' },
        { q: '{貼|は}る → ～てあります', answers: V('{貼|は}ってあります'), hint: 'る (nhóm 1) → って' },
      ],
    },
    {
      t: 'quiz',
      id: 'b18-np-dien',
      title: 'Điền vào chỗ trống — dùng đúng mẫu của bài (10 câu)',
      kind: 'fill',
      grammar: '～てあげる · ～てくれる · ～てもらう · ～ていただけませんか · ～ておく · ～てある · 自動詞ている',
      items: [
        { q: '{引|ひ}っ{越|こ}しの{日|ひ}、マルコさんが（{手伝|てつだ}う → làm cho tôi, quá khứ）。', answers: V('{手伝|てつだ}ってくれました'), hint: '～てくれました' },
        { q: '{私|わたし}はアンナさんに{段|だん}ボールを（{集|あつ}める → tôi được làm cho, quá khứ）。', answers: V('{集|あつ}めてもらいました'), hint: '～てもらいました' },
        { q: '{日曜日|にちようび}、{弟|おとうと}に{自転車|じてんしゃ}の{乗|の}り{方|かた}を（{教|おし}える → làm cho người khác, quá khứ）。', answers: V('{教|おし}えてあげました'), hint: '～てあげました' },
        { q: 'すみません、{駅|えき}までの{道|みち}を{教|おし}えて（　）か。(rất lịch sự)', answers: ['いただけません'], hint: 'いただく → いただけません' },
        { q: '{友達|ともだち}が{来|く}る{前|まえ}に、ケーキを（{買|か}う → làm sẵn）。', answers: V('{買|か}っておきます', '{買|か}っておきました'), hint: '～ておきます' },
        { q: '{暑|あつ}いので、{窓|まど}を{開|あ}けて（　）ください。(cứ để nguyên)', answers: ['おいて'], hint: 'おく → おいて' },
        { q: '{壁|かべ}に{家族|かぞく}の{写真|しゃしん}が（{飾|かざ}る → trạng thái do người làm）。', answers: V('{飾|かざ}ってあります'), hint: '～てあります' },
        { q: '{箱|はこ}に「{台所|だいどころ}」と（{書|か}く → trạng thái）。', answers: V('{書|か}いてあります'), hint: '～てあります' },
        { q: 'あれ？{電気|でんき}が（つく → trạng thái tự nhiên）います。{誰|だれ}かいるんですか。', answers: ['ついて'], hint: 'tự động từ + ている' },
        { q: '{明日|あした}の{会議|かいぎ}の{資料|しりょう}は、もうコピーして（　）よ。', answers: ['あります'], hint: 'việc chuẩn bị đã xong → ～てあります' },
      ],
    },
    {
      t: 'mcq',
      id: 'b18-np-jlpt',
      title: 'Trắc nghiệm dạng đề JLPT N4 — 文法形式の判断 (10 câu) + 文の組み立て ★ (4 câu)',
      items: [
        { q: '{引|ひ}っ{越|こ}しのとき、{友達|ともだち}がたくさん{手伝|てつだ}って（　）。', options: ['くれました', 'あげました', 'もらいました', 'おきました'], correct: 0, why: 'Bạn (người làm, が) giúp TÔI → **くれました**. もらいました cần 友達**に**. 〔Tomodachi ga takusan tetsudatte kuremashita.〕' },
        { q: '{私|わたし}は{山口|やまぐち}さんに{駅前|えきまえ}のスーパーを{案内|あんない}して（　）。', options: ['くれました', 'あげました', 'もらいました', 'ありました'], correct: 2, why: 'Tôi (は) + người làm **に** → **もらいました**. 〔Watashi wa Yamaguchi-san ni ekimae no suupaa o annai shite moraimashita.〕' },
        { q: '{妹|いもうと}の{宿題|しゅくだい}を{手伝|てつだ}って（　）。', options: ['くれました', 'あげました', 'もらいました', 'ありました'], correct: 1, why: 'Tôi giúp em gái → **あげました** (việc đi từ tôi sang em). 〔Imouto no shukudai o tetsudatte agemashita.〕' },
        { q: '{私|わたし}はナタポンさん（　）{車|くるま}を{貸|か}してもらいました。', options: ['に', 'が', 'を', 'で'], correct: 0, why: 'Câu もらう: người làm đi với **に**. 〔Watashi wa Natapon-san ni kuruma o kashite moraimashita.〕' },
        { q: 'すみませんが、ちょっと{写真|しゃしん}を{撮|と}って（　）。', options: ['いただけませんか', 'あげませんか', 'おきませんか', 'ありませんか'], correct: 0, why: 'Nhờ người lạ (lịch sự) → **～ていただけませんか**. 〔Chotto shashin o totte itadakemasen ka.〕' },
        { q: '{明日|あした}お{客|きゃく}さんが{来|く}るので、{部屋|へや}を{掃除|そうじ}して（　）。', options: ['おきます', 'あります', 'くれます', 'います'], correct: 0, why: 'Làm trước để chuẩn bị, tân ngữ を → **～ておきます**. 〔Heya o souji shite okimasu.〕' },
        { q: '{使|つか}ったお{皿|さら}は{洗|あら}って（　）ください。', options: ['おいて', 'おきて', 'あって', 'あげて'], correct: 0, why: 'おく nhóm 1 → **おいて**ください (làm cho xong). 〔Tsukatta osara wa aratte oite kudasai.〕' },
        { q: '{壁|かべ}に{大|おお}きい{地図|ちず}が{貼|は}って（　）。', options: ['あります', 'おきます', 'います', 'もらいます'], correct: 0, why: 'Vật + **が** + tha động từ → trạng thái **～てあります**. ～ています ở đây sẽ là "đang dán". 〔Kabe ni ookii chizu ga hatte arimasu.〕' },
        { q: '{窓|まど}が（　）います。{寒|さむ}いから{閉|し}めてもいいですか。', options: ['{開|あ}いて', '{開|あ}けて', '{開|あ}け', '{開|あ}き'], correct: 0, why: 'Tả trạng thái bằng ～ています → **tự** động từ {開|あ}く → **{開|あ}いて**います. 〔Mado ga aite imasu.〕' },
        { q: 'A「ホテルの{予約|よやく}は？」 B「もう{予約|よやく}して（　）よ。」', options: ['あります', 'おきます', 'あげます', 'もらいます'], correct: 0, why: '**もう** + việc chuẩn bị đã xong, kết quả còn đó → **～てあります**. (～ておきます là việc sẽ làm, không đi với もう.) 〔Mou yoyaku shite arimasu yo.〕' },
        { q: '★ {友達|ともだち}が ＿＿ ＿＿ ★ ＿＿。（くれました／{荷物|にもつ}を／{運|はこ}んで／{重|おも}い）', options: ['くれました', '{荷物|にもつ}を', '{運|はこ}んで', '{重|おも}い'], correct: 2, why: 'Câu đúng: {友達|ともだち}が **{重|おも}い {荷物|にもつ}を {運|はこ}んで くれました**. Ô ★ (thứ 3) = **{運|はこ}んで**. 〔Tomodachi ga omoi nimotsu o hakonde kuremashita.〕' },
        { q: '★ {旅行|りょこう}に ＿＿ ＿＿ ★ ＿＿ おきます。（{前|まえ}に／ホテルを／{予約|よやく}して／{行|い}く）', options: ['{前|まえ}に', 'ホテルを', '{予約|よやく}して', '{行|い}く'], correct: 1, why: 'Câu đúng: {旅行|りょこう}に **{行|い}く {前|まえ}に ホテルを {予約|よやく}して** おきます. Ô ★ (thứ 3) = **ホテルを**. 〔Ryokou ni iku mae ni hoteru o yoyaku shite okimasu.〕' },
        { q: '★ {壁|かべ}に ＿＿ ＿＿ ★ ＿＿。（{貼|は}って／ごみの{日|ひ}の／あります／{表|ひょう}が）', options: ['{貼|は}って', 'ごみの{日|ひ}の', 'あります', '{表|ひょう}が'], correct: 0, why: 'Câu đúng: {壁|かべ}に **ごみの{日|ひ}の {表|ひょう}が {貼|は}って あります**. Ô ★ (thứ 3) = **{貼|は}って**. 〔Kabe ni gomi no hi no hyou ga hatte arimasu.〕' },
        { q: '★ すみませんが、{駅|えき}までの{道|みち}を ＿＿ ＿＿ ★ ＿＿。（{地図|ちず}に／いただけませんか／{書|か}いて／この）', options: ['{地図|ちず}に', 'いただけませんか', '{書|か}いて', 'この'], correct: 2, why: 'Câu đúng: {駅|えき}までの{道|みち}を **この {地図|ちず}に {書|か}いて いただけませんか**. Ô ★ (thứ 3) = **{書|か}いて**. 〔Eki made no michi o kono chizu ni kaite itadakemasen ka.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const HAN_TU: Lesson = {
  id: 'b18-han-tu',
  kind: 'kanji',
  title: 'Chữ Hán mới — 15 chữ: 建 県 箱 段 具 宅 連 助 礼 掛 返 頼 庭 費 戻',
  goal: 'Đọc đúng (không cần furigana) và hiểu nghĩa 15 chữ Hán mới của Bài 18 trong các từ hay gặp khi thuê nhà, chuyển nhà (建物・二階建て・〜県・箱・段ボール・家具・道具・お宅・宅配便・連絡・助かる・お礼・掛ける・返す・頼む・庭・費用・戻る…), chọn đúng chữ khi đề cho hiragana, phân biệt chữ trông giống, và viết tay được các chữ ✍.',
  minutes: 45,
  blocks: [
    {
      t: 'p',
      text: 'Đến Bài 17 bạn đã gặp gần như **toàn bộ chữ N4**. Bài 18 dùng **2 chữ N4 còn lại hợp chủ đề** (建 県) và **13 chữ N3** đi theo các từ của chuyện thuê nhà – chuyển nhà mà bạn sẽ thấy trên hợp đồng, biển báo khu nhà, phiếu chuyển phát, tin cho thuê phòng (箱 段 具 宅 連 助 礼 掛 返 頼 庭 費 戻). Cột **Mức** ghi cả cấp: ✍ = nên viết được, 👁 = nhận mặt (đọc + hiểu). Học **theo từ**: {建物|たてもの} (tatemono), {宅配便|たくはいびん} (takuhaibin), {連絡|れんらく} (renraku) — đề 漢字読み và 表記 hỏi **cả từ**.',
    },
    {
      t: 'table',
      caption: '15 chữ Hán mới của Bài 18',
      head: ['Chữ', 'Hán Việt', 'Âm On', 'Âm Kun', 'Nghĩa', 'Từ ví dụ', 'Mức'],
      rows: [
        ['建', 'KIẾN', 'ケン・コン', 'た(てる)・た(つ)', 'xây, dựng', '{建物|たてもの} (toà nhà) · {建|た}てる (xây) · {二階建|にかいだ}て (nhà 2 tầng) · {一戸建|いっこだ}て (nhà riêng)', '✍ N4'],
        ['県', 'HUYỆN', 'ケン', '—', 'tỉnh (của Nhật)', '{県|けん} (tỉnh) · {千葉県|ちばけん} (tỉnh Chiba) · {県立|けんりつ} (của tỉnh, tỉnh lập) · {県庁|けんちょう} (uỷ ban tỉnh)', '✍ N4'],
        ['箱', 'TƯƠNG', '—', 'はこ', 'hộp, thùng', '{箱|はこ} (hộp) · {段|だん}ボール{箱|ばこ} (thùng các-tông) · ごみ{箱|ばこ} (thùng rác) · {本箱|ほんばこ} (tủ sách)', '✍ N3'],
        ['段', 'ĐOẠN', 'ダン', '—', 'bậc, nấc, tầng', '{階段|かいだん} (cầu thang) · {段|だん}ボール (bìa các-tông) · {値段|ねだん} (giá cả) · {一段|いちだん} (một bậc)', '👁 N3'],
        ['具', 'CỤ', 'グ', '—', 'đồ dùng, dụng cụ', '{家具|かぐ} (nội thất) · {道具|どうぐ} (dụng cụ) · {具合|ぐあい} (tình trạng) · {文房具|ぶんぼうぐ} (văn phòng phẩm)', '👁 N3'],
        ['宅', 'TRẠCH', 'タク', '—', 'nhà ở', 'お{宅|たく} (nhà — lịch sự) · {自宅|じたく} (nhà riêng) · {宅配便|たくはいびん} (chuyển phát) · {住宅|じゅうたく} (nhà ở)', '👁 N3'],
        ['連', 'LIÊN', 'レン', 'つ(れる)', 'liền, nối; dắt theo', '{連絡|れんらく} (liên lạc) · {連|つ}れていく (dẫn đi) · {連休|れんきゅう} (kỳ nghỉ dài)', '👁 N3'],
        ['助', 'TRỢ', 'ジョ', 'たす(ける)・たす(かる)', 'giúp, cứu', '{助|たす}かる (đỡ quá) · {助|たす}ける (giúp, cứu) · {助手|じょしゅ} (trợ lý)', '✍ N3'],
        ['礼', 'LỄ', 'レイ・ライ', '—', 'lễ, cảm ơn', 'お{礼|れい} (lời cảm ơn) · {失礼|しつれい} (thất lễ) · {礼金|れいきん} (tiền lễ khi thuê nhà)', '👁 N3'],
        ['掛', 'QUẢI', '—', 'か(ける)・か(かる)', 'treo', '{掛|か}ける (treo) · {出掛|でか}ける (ra ngoài) · {掛|か}け{時計|どけい} (đồng hồ treo tường)', '👁 N3'],
        ['返', 'PHẢN', 'ヘン', 'かえ(す)・かえ(る)', 'trả lại; đáp lại', '{返|かえ}す (trả lại) · {返事|へんじ} (hồi âm) · {返品|へんぴん} (trả hàng)', '✍ N3'],
        ['頼', 'LẠI', 'ライ', 'たの(む)・たよ(る)', 'nhờ, nương tựa', '{頼|たの}む (nhờ) · {頼|たよ}る (dựa vào) · {信頼|しんらい} (tin cậy — N2)', '👁 N3'],
        ['庭', 'ĐÌNH', 'テイ', 'にわ', 'sân, vườn', '{庭|にわ} (sân vườn) · {家庭|かてい} (gia đình, tổ ấm) · {校庭|こうてい} (sân trường)', '✍ N3'],
        ['費', 'PHÍ', 'ヒ', '—', 'chi phí, tiêu tốn', '{費用|ひよう} (chi phí) · {交通費|こうつうひ} (tiền đi lại) · {生活費|せいかつひ} (sinh hoạt phí) · {会費|かいひ} (hội phí)', '👁 N3'],
        ['戻', 'LỆ', 'レイ', 'もど(る)・もど(す)', 'quay lại; trả về chỗ cũ', '{戻|もど}る (quay lại) · {戻|もど}す (để lại chỗ cũ) · {払|はら}い{戻|もど}し (hoàn tiền)', '✍ N3'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ bằng cấu tạo chữ (học kèm khi tập viết)',
      items: [
        '**建** = 廴 (bước dài — nét kéo dài ôm phía dưới, viết SAU CÙNG) + 聿 (tay cầm bút): cầm bút vẽ rồi dựng lên = **XÂY** → {建物|たてもの}.',
        '**県** — chữ cũ là 縣. Mẹo nhìn (không phải gốc chữ): con mắt 目 nhìn xuống vùng đất 小 bên dưới. ⚠ Hán Việt là HUYỆN nhưng ở Nhật **{県|けん} = TỈNH** (đơn vị lớn nhất sau quốc gia: 47 {都道府県|とどうふけん}).',
        '**箱** = ⺮ (tre — gợi nghĩa) + 相 (gợi âm): hộp đan bằng tre = **HỘP**. Đứng riêng đọc **はこ**, sau danh từ đọc **ばこ**.',
        '**段** = phần trái (bậc đá) + 殳 (tay cầm dùi — đẽo): đẽo đá thành từng **BẬC** → {階段|かいだん}, {値段|ねだん} (từng nấc giá).',
        '**具** — phần trên gốc là vật quý (nay viết như 目), dưới là 一 + 八 (hai tay nâng): hai tay sắm sửa đồ dùng đầy đủ = **ĐỒ DÙNG** → {家具|かぐ}, {道具|どうぐ}.',
        '**宅** = 宀 (mái nhà — gợi nghĩa) + 乇 (gợi âm タク): chỗ dưới mái = **NHÀ Ở** → {宅配便|たくはいびん} (giao tận nhà).',
        '**連** = 辶 (bước đi) + 車 (xe): xe nối đuôi nhau đi = **LIỀN**, kéo theo → {連絡|れんらく}, {連|つ}れていく (dắt theo).',
        '**助** = 且 (gợi âm ジョ) + 力 (sức): góp thêm sức = **GIÚP** → {助|たす}かる.',
        '**礼** = 礻 (bộ thị — thần linh, nghi lễ) + 乚: phép tắc khi cúng = **LỄ** → お{礼|れい} (lễ cảm ơn), {失礼|しつれい}.',
        '**掛** = 扌 (tay) + 卦 (quẻ — gợi âm): dùng tay móc lên = **TREO** → {掛|か}ける. Nhiều nơi viết かける bằng かな.',
        '**返** = 辶 (đi) + 反 (ngược — gợi âm ヘン): đi ngược lại = **TRẢ LẠI**, đáp lại → {返事|へんじ}.',
        '**頼** — Mẹo nhìn: 束 (bó) + 頁 (cái đầu): bó đồ của mình rồi gửi lên đầu người khác = **NHỜ**, nương tựa → {頼|たの}む.',
        '**庭** = 广 (mái nhà rộng) + 廷 (sân chầu — gợi âm テイ): khoảng **SÂN** trước nhà lớn → {庭|にわ}, {家庭|かてい}.',
        '**費** = 弗 (gợi âm ヒ) + 貝 (vỏ sò = tiền): tiền tiêu đi = **CHI PHÍ** → {費用|ひよう}, {交通費|こうつうひ}.',
        '**戻** — chữ cũ 戾 = 戸 (cánh cửa) + 犬 (con chó, nay viết 大): chó chui ra cửa rồi **QUAY LẠI** → {戻|もど}る.',
      ],
    },
    {
      t: 'table',
      caption: 'Đứng riêng hay đứng chung — kun khi đứng một mình / có đuôi kana, on trong từ ghép',
      head: ['Chữ', 'Đứng riêng (kun)', 'Trong từ ghép (on)', 'Bẫy'],
      rows: [
        ['建', '{建|た}てる, {建物|たてもの}', '{建築|けんちく} (ケン — N2)', '{二階建|にかいだ}て đọc **だて** (âm đục)'],
        ['県', '—', '{県|けん}, {千葉県|ちばけん} (ケン)', 'chỉ một âm ケン; nghĩa là TỈNH, không phải "huyện"'],
        ['箱', '{箱|はこ}', '(không có âm On thường dụng)', 'sau danh từ đọc **ばこ**: ごみ{箱|ばこ}, {本箱|ほんばこ}'],
        ['段', '—', '{階段|かいだん}, {値段|ねだん} (ダン)', '{値段|ねだん} — **ね・だん**, đừng đọc ~~ちだん~~'],
        ['具', '—', '{家具|かぐ}, {道具|どうぐ} (グ)', 'どう**ぐ** — âm ngắn, không phải ~~ぐう~~'],
        ['宅', '—', 'お{宅|たく}, {自宅|じたく} (タク)', '{宅配便|たくはいびん} — たく・はい・びん (便 đọc びん)'],
        ['連', '{連|つ}れる', '{連絡|れんらく}, {連休|れんきゅう} (レン)', 'つ**れ**る (tsureru) — đừng nhầm {連|つ}れる với {疲|つか}れる'],
        ['助', '{助|たす}ける, {助|たす}かる', '{助手|じょしゅ} (ジョ)', 'たす**け**る (tha) ↔ たす**か**る (tự)'],
        ['礼', '—', 'お{礼|れい}, {失礼|しつれい} (レイ)', 'しつ**れい** — trường âm, romaji **shitsurei**'],
        ['掛', '{掛|か}ける, {掛|か}かる', '—', 'hầu như chỉ đọc kun; {出掛|でか}ける (dekakeru) — nhiều nơi viết {出|で}かける'],
        ['返', '{返|かえ}す', '{返事|へんじ}, {返品|へんぴん} (ヘン)', '{返|かえ}す (trả lại) ≠ {帰|かえ}す (cho về) — cùng đọc かえす'],
        ['頼', '{頼|たの}む, {頼|たよ}る', '{信頼|しんらい} (ライ — N2)', 'hai âm kun: たのむ (nhờ) / たよる (dựa vào)'],
        ['庭', '{庭|にわ}', '{家庭|かてい}, {校庭|こうてい} (テイ)', 'か**てい** — không đục'],
        ['費', '—', '{費用|ひよう}, {交通費|こうつうひ} (ヒ)', 'ひ**よう** — romaji **hiyou** (3 âm: ひ・よ・う)'],
        ['戻', '{戻|もど}る, {戻|もど}す', '(on レイ rất hiếm)', 'もど**る** (tự) ↔ もど**す** (tha)'],
      ],
    },
    {
      t: 'table',
      caption: 'Chữ trông giống — bẫy của đề 表記',
      head: ['Chữ của bài', 'Chữ dễ nhầm', 'Phân biệt'],
      rows: [
        ['建 (xây)', '健 (khoẻ — {健康|けんこう})', '健 có thêm 亻 (người) bên trái; 建 không có'],
        ['返 (trả lại)', '坂 (con dốc — Bài 17)', '返 có 辶 (bước đi); 坂 có 土 (đất)'],
        ['連 (liền)', '運 (vận chuyển — {運|はこ}ぶ)', '連 trong là 車; 運 trong là 軍 (có ⼍ trên 車)'],
        ['助 (giúp)', '動 (động — {動|うご}く)', 'cùng có 力; trái của 助 là 且, của 動 là 重'],
        ['具 (đồ dùng)', '真 (thật — {写真|しゃしん})', '真 có 十 ở trên; 具 thì không'],
        ['庭 (sân)', '底 (đáy — N3)', '庭 có 廷 bên trong; 底 có 氐'],
        ['頼 (nhờ)', '願 (mong — お{願|ねが}い)', 'cùng có 頁 bên phải; trái 頼 là 束, trái 願 là 原'],
        ['戻 (quay lại)', '涙 (nước mắt — N3)', '涙 có thêm 氵 (nước) bên trái'],
      ],
    },
    {
      t: 'readkanji',
      id: 'b18-doc-kanji',
      title: 'Đọc KHÔNG furigana — 20 câu (chữ mới + chữ đã học)',
      note: 'Che phần đáp án, đọc to cả câu rồi bấm hiện cách đọc. Câu nào vấp ở chữ mới thì quay lại bảng trên.',
      items: [
        { text: 'あの{白|しろ}い{建物|たてもの}が{私|わたし}のアパートです。', ro: 'Ano shiroi tatemono ga watashi no apaato desu.', vi: 'Toà nhà màu trắng kia là căn hộ của tôi.' },
        { text: '{来月|らいげつ}、{千葉県|ちばけん}に{引|ひ}っ{越|こ}します。', ro: 'Raigetsu, Chiba-ken ni hikkoshimasu.', vi: 'Tháng sau tôi chuyển đến tỉnh Chiba.' },
        { text: 'この{箱|はこ}は{重|おも}いので、{気|き}をつけてください。', ro: 'Kono hako wa omoi node, ki o tsukete kudasai.', vi: 'Thùng này nặng nên hãy cẩn thận.' },
        { text: '{階段|かいだん}で{三階|さんがい}まで{荷物|にもつ}を{運|はこ}びました。', ro: 'Kaidan de sangai made nimotsu o hakobimashita.', vi: 'Tôi khuân đồ lên tầng 3 bằng cầu thang bộ.' },
        { text: '{新|あたら}しい{部屋|へや}に{合|あ}う{家具|かぐ}を{買|か}いたいです。', ro: 'Atarashii heya ni au kagu o kaitai desu.', vi: 'Tôi muốn mua đồ nội thất hợp với phòng mới.' },
        { text: '{掃除|そうじ}の{道具|どうぐ}はどこにありますか。', ro: 'Souji no dougu wa doko ni arimasu ka.', vi: 'Đồ quét dọn ở đâu vậy?' },
        { text: '{先生|せんせい}のお{宅|たく}は{駅|えき}から{近|ちか}いです。', ro: 'Sensei no otaku wa eki kara chikai desu.', vi: 'Nhà thầy ở gần ga.' },
        { text: '{宅配便|たくはいびん}で{国|くに}から{荷物|にもつ}が{届|とど}きました。', ro: 'Takuhaibin de kuni kara nimotsu ga todokimashita.', vi: 'Hàng từ quê nhà đã đến bằng chuyển phát.' },
        { text: '{引|ひ}っ{越|こ}しの{日|ひ}を{大家|おおや}さんに{連絡|れんらく}しました。', ro: 'Hikkoshi no hi o ooya-san ni renraku shimashita.', vi: 'Tôi đã báo ngày chuyển nhà cho chủ nhà.' },
        { text: '{妹|いもうと}を{動物園|どうぶつえん}に{連|つ}れていきました。', ro: 'Imouto o doubutsuen ni tsurete ikimashita.', vi: 'Tôi đã dẫn em gái đi sở thú.' },
        { text: '{友達|ともだち}が{手伝|てつだ}ってくれて、{助|たす}かりました。', ro: 'Tomodachi ga tetsudatte kurete, tasukarimashita.', vi: 'Bạn giúp tôi nên đỡ quá.' },
        { text: '{手伝|てつだ}ってくれた{人|ひと}にお{礼|れい}を{言|い}いました。', ro: 'Tetsudatte kureta hito ni orei o iimashita.', vi: 'Tôi đã nói lời cảm ơn với những người giúp mình.' },
        { text: '{壁|かべ}に{時計|とけい}を{掛|か}けました。', ro: 'Kabe ni tokei o kakemashita.', vi: 'Tôi đã treo đồng hồ lên tường.' },
        { text: '{借|か}りた{本|ほん}を{図書館|としょかん}に{返|かえ}します。', ro: 'Karita hon o toshokan ni kaeshimasu.', vi: 'Tôi trả sách đã mượn cho thư viện.' },
        { text: '{大家|おおや}さんからまだ{返事|へんじ}が{来|き}ません。', ro: 'Ooya-san kara mada henji ga kimasen.', vi: 'Chủ nhà vẫn chưa trả lời.' },
        { text: '{友達|ともだち}に{引|ひ}っ{越|こ}しの{手伝|てつだ}いを{頼|たの}みました。', ro: 'Tomodachi ni hikkoshi no tetsudai o tanomimashita.', vi: 'Tôi đã nhờ bạn giúp chuyển nhà.' },
        { text: '{庭|にわ}のある{家|いえ}に{住|す}みたいです。', ro: 'Niwa no aru ie ni sumitai desu.', vi: 'Tôi muốn sống trong ngôi nhà có sân vườn.' },
        { text: '{引|ひ}っ{越|こ}しの{費用|ひよう}は{五万円|ごまんえん}ぐらいでした。', ro: 'Hikkoshi no hiyou wa goman en gurai deshita.', vi: 'Chi phí chuyển nhà khoảng 5 vạn yên.' },
        { text: '{会社|かいしゃ}が{交通費|こうつうひ}を{払|はら}ってくれます。', ro: 'Kaisha ga koutsuuhi o haratte kuremasu.', vi: 'Công ty trả tiền đi lại cho tôi.' },
        { text: '{鍵|かぎ}を{忘|わす}れたので、{部屋|へや}に{戻|もど}りました。', ro: 'Kagi o wasureta node, heya ni modorimashita.', vi: 'Quên chìa khoá nên tôi quay lại phòng.' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b18-doc-doan',
      title: 'Đọc đoạn ngắn kiểu đề — 3 đoạn không furigana',
      note: 'Đọc to cả đoạn trong 40 giây như phần Reading của thi nói, rồi mới mở đáp án.',
      items: [
        { text: '{先週|せんしゅう}、{寮|りょう}から{二階建|にかいだ}てのアパートに{引|ひ}っ{越|こ}しました。{友達|ともだち}が{手伝|てつだ}ってくれたので、とても{助|たす}かりました。{家具|かぐ}は{少|すく}ないですが、{庭|にわ}に{小|ちい}さい{花|はな}が{咲|さ}いています。', ro: 'Senshuu, ryou kara nikaidate no apaato ni hikkoshimashita. Tomodachi ga tetsudatte kureta node, totemo tasukarimashita. Kagu wa sukunai desu ga, niwa ni chiisai hana ga saite imasu.', vi: 'Tuần trước tôi chuyển từ ký túc xá sang một căn hộ trong dãy nhà 2 tầng. Bạn bè giúp nên đỡ lắm. Đồ đạc ít nhưng ngoài sân có hoa nhỏ đang nở.' },
        { text: '{引|ひ}っ{越|こ}しの{前|まえ}に、{大家|おおや}さんに{連絡|れんらく}しておきました。{箱|はこ}には{全部|ぜんぶ}{名前|なまえ}が{書|か}いてあります。{重|おも}い{物|もの}は{宅配便|たくはいびん}で{送|おく}りました。{費用|ひよう}は{思|おも}ったより{安|やす}かったです。', ro: 'Hikkoshi no mae ni, ooya-san ni renraku shite okimashita. Hako ni wa zenbu namae ga kaite arimasu. Omoi mono wa takuhaibin de okurimashita. Hiyou wa omotta yori yasukatta desu.', vi: 'Trước khi chuyển nhà tôi đã báo trước cho chủ nhà. Thùng nào cũng có ghi tên. Đồ nặng tôi gửi chuyển phát. Chi phí rẻ hơn tôi nghĩ.' },
        { text: '{借|か}りた{車|くるま}は、{次|つぎ}の{日|ひ}ナタポンさんに{返|かえ}しました。お{礼|れい}に{国|くに}のお{菓子|かし}をあげました。{困|こま}ったときは、{友達|ともだち}に{頼|たの}んでもいいと{思|おも}います。{一人|ひとり}で{全部|ぜんぶ}しなくてもいいんです。', ro: 'Karita kuruma wa, tsugi no hi Natapon-san ni kaeshimashita. Orei ni kuni no okashi o agemashita. Komatta toki wa, tomodachi ni tanonde mo ii to omoimasu. Hitori de zenbu shinakute mo ii n desu.', vi: 'Xe mượn thì hôm sau tôi trả cho Nattapon. Để cảm ơn, tôi tặng bánh kẹo quê nhà. Tôi nghĩ lúc khó khăn thì nhờ bạn bè cũng được. Không cần tự mình làm hết.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b18-han-doc',
      title: '漢字読み — chọn cách đọc của từ in đậm (12 câu)',
      items: [
        { q: '{駅前|えきまえ}に{新|あたら}しい**建物**ができました。', options: ['けんぶつ', 'たてもの', 'たてぶつ', 'けんもの'], correct: 1, why: '**{建物|たてもの}** (tatemono) — cả hai chữ đọc kun.' },
        { q: '{来年|らいねん}、**千葉県**に{住|す}みます。', options: ['ちばけん', 'せんばけん', 'ちばげん', 'ちはけん'], correct: 0, why: '**{千葉県|ちばけん}** (Chiba-ken) — 県 đọc ケン.' },
        { q: 'この**箱**に{本|ほん}を{入|い}れてください。', options: ['はこ', 'ばこ', 'そう', 'かご'], correct: 0, why: 'Đứng riêng đọc **はこ**; chỉ sau danh từ khác mới thành ばこ.' },
        { q: 'エレベーターがないので、**階段**を{使|つか}います。', options: ['かいたん', 'かいだん', 'がいだん', 'かいでん'], correct: 1, why: '**{階段|かいだん}** (kaidan) — 段 ダン.' },
        { q: '**家具**付きの{部屋|へや}を{探|さが}しています。', options: ['かぐ', 'いえぐ', 'かぐう', 'けぐ'], correct: 0, why: '**{家具|かぐ}** (kagu) — 家 カ + 具 グ.' },
        { q: '**宅配便**で{荷物|にもつ}を{送|おく}りました。', options: ['たくはいべん', 'たくはいびん', 'だくはいびん', 'たくばいびん'], correct: 1, why: '**{宅配便|たくはいびん}** (takuhaibin) — 便 đọc **びん** trong từ này.' },
        { q: '{家|うち}に{着|つ}いたら、**連絡**してください。', options: ['れんらく', 'れんかく', 'れいらく', 'れんらっく'], correct: 0, why: '**{連絡|れんらく}** (renraku).' },
        { q: '{車|くるま}を{貸|か}してくれて、**助**かりました。', options: ['たす', 'たよ', 'じょ', 'すけ'], correct: 0, why: '**{助|たす}かりました** (tasukarimashita).' },
        { q: '{手伝|てつだ}ってくれた{人|ひと}にお**礼**を{言|い}いました。', options: ['れい', 'らい', 'り', 'れ'], correct: 0, why: '**お{礼|れい}** (orei) — 礼 レイ.' },
        { q: '{本|ほん}を**返**しに{行|い}きます。', options: ['かえ', 'へん', 'もど', 'かい'], correct: 0, why: '**{返|かえ}しに** (kaeshi ni) — {返|かえ}す.' },
        { q: '{家|いえ}の**庭**で{野菜|やさい}を{作|つく}っています。', options: ['にわ', 'てい', 'には', 'ば'], correct: 0, why: '**{庭|にわ}** (niwa) — đứng riêng đọc kun. Trong từ ghép đọc テイ: {家庭|かてい}.' },
        { q: '{引|ひ}っ{越|こ}しの**費用**はいくらですか。', options: ['ひよう', 'ひよ', 'ひよお', 'ひいよう'], correct: 0, why: '**{費用|ひよう}** (hiyou) — ひ・よ・う.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b18-han-chon',
      title: '表記 — chọn chữ Hán đúng cho từ viết bằng hiragana (8 câu)',
      items: [
        { q: '{父|ちち}は{去年|きょねん}、{新|あたら}しい{家|いえ}を**たて**ました。', options: ['健て', '建て', '立て', '律て'], correct: 1, why: '**建てる** = xây (nhà). 健 có 亻 (khoẻ); 立てる là "dựng đứng (vật)" — không dùng cho xây nhà.' },
        { q: 'ごみは**はこ**に{入|い}れてください。', options: ['箱', '相', '籍', '筆'], correct: 0, why: '**箱** = ⺮ + 相. 相 thiếu bộ tre; 筆 là cây bút.' },
        { q: '{新|あたら}しい**かぐ**を{買|か}いました。', options: ['家真', '家具', '家貝', '家共'], correct: 1, why: '**家具** — 具 không có 十 ở trên (khác 真).' },
        { q: '{毎週|まいしゅう}、{母|はは}に**れんらく**します。', options: ['運絡', '連絡', '連落', '練絡'], correct: 1, why: '**連絡** — 連 (車 trong 辶), không phải 運.' },
        { q: '{借|か}りたお{金|かね}を**かえし**ました。', options: ['帰し', '返し', '坂し', '反し'], correct: 1, why: '**返す** = trả lại. 帰す (かえす) là "cho (ai) về" — đồng âm khác nghĩa.' },
        { q: '{先輩|せんぱい}に{仕事|しごと}を**たのみ**ました。', options: ['願み', '頼み', '頭み', '題み'], correct: 1, why: '**頼む** — trái là 束. 願・頭・題 cùng có 頁 nhưng khác nghĩa.' },
        { q: '{家|いえ}に**にわ**があります。', options: ['廷', '庭', '底', '店'], correct: 1, why: '**庭** = 广 + 廷. 底 (đáy), 店 (tiệm).' },
        { q: '{忘|わす}れ{物|もの}をしたので、{教室|きょうしつ}に**もどり**ました。', options: ['戻り', '涙り', '帰り', '返り'], correct: 0, why: '**戻る** = quay lại chỗ vừa rời. 涙 (nước mắt) có thêm 氵.' },
      ],
    },
    {
      t: 'write',
      id: 'b18-viet-kanji',
      title: 'Tập viết — 7 chữ ✍ và 7 từ',
      note: 'Viết 7 chữ ✍ trước (đúng thứ tự nét theo hoạt hình), rồi viết cả từ. 👁 chỉ cần đọc được — viết thêm nếu còn thời gian.',
      chars: ['建', '県', '箱', '助', '返', '庭', '戻', '建物', '家具', '連絡', '宅配便', '返事', '費用', 'お礼'],
      goi: {
        '建物': 'たてもの · toà nhà',
        '家具': 'かぐ · đồ nội thất',
        '連絡': 'れんらく · liên lạc',
        '宅配便': 'たくはいびん · chuyển phát',
        '返事': 'へんじ · hồi âm',
        '費用': 'ひよう · chi phí',
        'お礼': 'おれい · lời cảm ơn',
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
  id: 'b18-nghe',
  kind: 'listening',
  title: 'Nghe hiểu N4 — 6 bài theo đủ 4 dạng đề: 課題理解 · ポイント理解 · 発話表現 · 即時応答',
  goal: 'Nghe gọi điện cho công ty chuyển nhà và nghe chủ nhà bàn giao phòng để biết việc phải làm trước / thứ phải mua; nghe tư vấn chọn phòng và nghe giải thích quy định đổ rác để bắt đúng lý do, ngày giờ; chọn câu nhờ / cảm ơn / đề nghị đúng người, đúng mức lịch sự và đáp nhanh câu có ～てくれる, ～てもらう, ～ておく, ～てある — đúng 4 dạng của phần 聴解 đề N4.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Phần nghe (聴解) đề JLPT N4 — 4 dạng, 35 phút',
      head: ['Mondai', 'Dạng', 'Làm gì', 'Mẹo của bài này'],
      rows: [
        ['問題1', '課題理解 (hiểu nhiệm vụ)', 'Nghe hội thoại, chọn việc người đó phải làm **trước / tiếp theo** hoặc thứ sẽ mua.', 'Nghe **～ておいてください** = việc phải làm sẵn; **～てあります／もう～てある** = việc ĐÃ có sẵn → loại khỏi đáp án; **そのままで{大丈夫|だいじょうぶ}** = không cần làm.'],
        ['問題2', 'ポイント理解 (hiểu điểm chính)', 'Câu hỏi nghe **trước**, rồi tìm đúng điểm đó (lý do, ngày, cách làm).', 'Lý do thật thường đến SAU một lý do bị gạt đi (～んですが、でも…). Đề hỏi "どうして" → chờ **～から／～ので／それなら**.'],
        ['問題3', '発話表現 (nói gì trong tình huống)', 'Nghe mô tả tình huống, chọn câu nên nói.', 'Đề nghị giúp người trên → **～ましょうか** (không ～てあげます); nhờ bạn → **～てくれない？**; nhờ người lớn → **～ていただけませんか**; cảm ơn → **～てくれて、ありがとう**.'],
        ['問題4', '即時応答 (đáp ngay)', 'Nghe một câu ngắn, chọn câu đáp tự nhiên nhất.', '"どこに{置|お}けばいい？" → **～に{置|お}いといて**; "{何|なに}かある？" → **～が～てあるよ**; "{準備|じゅんび}できた？" → **もう～てある**.'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nghe trong bài này',
      items: [
        '**Ai làm cho ai?** — nghe đuôi: **～てあげる** (người nói làm cho người khác) · **～てくれる** (người khác làm cho người nói) · **～てもらう** (người nói được làm cho; người làm đi với に). Đề rất hay hỏi "**{誰|だれ}が**～しますか".',
        '**Dạng nói tắt**: {入|い}れとく = {入|い}れておく, {置|お}いといて = {置|お}いておいて, {読|よ}んどいた = {読|よ}んでおいた. Nghe "とく／といて／どく" → là ～ておく.',
        '**～てある** → đồ vật ĐÃ được chuẩn bị (không cần làm nữa); **～ておいてください** → người nghe PHẢI làm.',
        'Bấm nghe 2 lần: lần 1 không nhìn lời, chỉ trả lời câu hỏi; lần 2 bật lời thoại + romaji để soát từng câu.',
      ],
    },

    /* ── 1 ── */
    { t: 'h', text: 'Bài 1 — 問題1 課題理解: gọi điện cho công ty chuyển nhà' },
    NG('b18-ng-1', '{女|おんな}の{人|ひと}は{引|ひ}っ{越|こ}しの{前|まえ}の{日|ひ}までに{何|なに}をしておかなければなりませんか', 'Dạng 課題理解 — nhiều việc được nhắc tới; chỉ chọn việc NGƯỜI PHỤ NỮ phải làm sẵn, loại việc công ty làm và việc đã xong.', [
      ['ナレーター', 'ja-nu', '{引|ひ}っ{越|こ}し{屋|や}の{人|ひと}と{女|おんな}の{人|ひと}が{電話|でんわ}で{話|はな}しています。{女|おんな}の{人|ひと}は{引|ひ}っ{越|こ}しの{前|まえ}の{日|ひ}までに{何|なに}をしておかなければなりませんか。', 'Hikkoshiya no hito to onna no hito ga denwa de hanashite imasu. Onna no hito wa hikkoshi no mae no hi made ni nani o shite okanakereba narimasen ka.', 'Nhân viên công ty chuyển nhà và một người phụ nữ đang nói chuyện điện thoại. Người phụ nữ phải làm sẵn việc gì trước ngày chuyển nhà?'],
      ['{引|ひ}っ{越|こ}し{屋|や}の{人|ひと}', 'ja-nam', 'お{電話|でんわ}ありがとうございます。さくら{引|ひ}っ{越|こ}しセンターです。', 'Odenwa arigatou gozaimasu. Sakura hikkoshi sentaa desu.', 'Cảm ơn quý khách đã gọi. Trung tâm chuyển nhà Sakura xin nghe.'],
      ['アンナ', 'ja-nu', 'もしもし、{来週|らいしゅう}の{日曜日|にちようび}に{引|ひ}っ{越|こ}しをお{願|ねが}いしたアンナです。ちょっと{聞|き}きたいことがあるんですが。', 'Moshimoshi, raishuu no nichiyoubi ni hikkoshi o onegai shita Anna desu. Chotto kikitai koto ga aru n desu ga.', 'A lô, tôi là Anna, người đã đặt chuyển nhà Chủ nhật tuần sau. Tôi có chút việc muốn hỏi.'],
      ['{引|ひ}っ{越|こ}し{屋|や}の{人|ひと}', 'ja-nam', 'はい、どうぞ。', 'Hai, douzo.', 'Vâng, xin mời.'],
      ['アンナ', 'ja-nu', '{段|だん}ボールはいつ{届|とど}けてもらえますか。', 'Danbooru wa itsu todokete moraemasu ka.', 'Khi nào thì bên anh mang thùng các-tông đến cho tôi được?'],
      ['{引|ひ}っ{越|こ}し{屋|や}の{人|ひと}', 'ja-nam', '{明日|あした}お{届|とど}けします。{荷物|にもつ}は{前|まえ}の{日|ひ}までに{全部|ぜんぶ}{箱|はこ}に{入|い}れておいてください。', 'Ashita otodoke shimasu. Nimotsu wa mae no hi made ni zenbu hako ni irete oite kudasai.', 'Ngày mai chúng tôi mang tới. Đồ đạc xin chị cho hết vào thùng trước ngày chuyển.'],
      ['アンナ', 'ja-nu', '{冷蔵庫|れいぞうこ}はどうすればいいですか。', 'Reizouko wa dou sureba ii desu ka.', 'Còn tủ lạnh thì làm thế nào ạ?'],
      ['{引|ひ}っ{越|こ}し{屋|や}の{人|ひと}', 'ja-nam', '{冷蔵庫|れいぞうこ}は、{前|まえ}の{日|ひ}の{夜|よる}に{電気|でんき}を{切|き}っておいてください。{中|なか}の{物|もの}も{出|だ}しておいてくださいね。', 'Reizouko wa, mae no hi no yoru ni denki o kitte oite kudasai. Naka no mono mo dashite oite kudasai ne.', 'Tủ lạnh thì tối hôm trước chị rút điện sẵn. Đồ bên trong cũng lấy ra trước nhé.'],
      ['アンナ', 'ja-nu', 'わかりました。{洗濯機|せんたくき}は？', 'Wakarimashita. Sentakuki wa?', 'Tôi hiểu rồi. Còn máy giặt?'],
      ['{引|ひ}っ{越|こ}し{屋|や}の{人|ひと}', 'ja-nam', '{洗濯機|せんたくき}は{当日|とうじつ}、{私|わたし}たちが{外|はず}しますから、そのままにしておいて{大丈夫|だいじょうぶ}です。', 'Sentakuki wa toujitsu, watashitachi ga hazushimasu kara, sono mama ni shite oite daijoubu desu.', 'Máy giặt thì đúng ngày đó chúng tôi tháo, chị cứ để nguyên là được.'],
      ['アンナ', 'ja-nu', 'それから、{大家|おおや}さんへの{連絡|れんらく}は……。', 'Sorekara, ooya-san e no renraku wa…….', 'À, còn việc báo cho chủ nhà thì…'],
      ['{引|ひ}っ{越|こ}し{屋|や}の{人|ひと}', 'ja-nam', 'それはお{客様|きゃくさま}にお{願|ねが}いしています。もう{連絡|れんらく}してありますか。', 'Sore wa okyakusama ni onegai shite imasu. Mou renraku shite arimasu ka.', 'Việc đó thì chúng tôi nhờ quý khách tự làm. Chị đã báo rồi chứ ạ?'],
      ['アンナ', 'ja-nu', 'はい、{先週|せんしゅう}{連絡|れんらく}しておきました。', 'Hai, senshuu renraku shite okimashita.', 'Vâng, tôi đã báo từ tuần trước rồi.'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}は{引|ひ}っ{越|こ}しの{前|まえ}の{日|ひ}までに{何|なに}をしておかなければなりませんか。', 'Onna no hito wa hikkoshi no mae no hi made ni nani o shite okanakereba narimasen ka.', 'Người phụ nữ phải làm sẵn việc gì trước ngày chuyển nhà?'],
    ]),
    {
      t: 'mcq',
      id: 'b18-ng-1-q',
      title: 'Bài 1 — chọn đáp án',
      items: [
        { q: '{女|おんな}の{人|ひと}は{引|ひ}っ{越|こ}しの{前|まえ}の{日|ひ}までに{何|なに}をしておかなければなりませんか。', options: ['{荷物|にもつ}を{箱|はこ}に{入|い}れて、{冷蔵庫|れいぞうこ}の{電気|でんき}を{切|き}っておく', '{洗濯機|せんたくき}を{外|はず}しておく', '{大家|おおや}さんに{連絡|れんらく}しておく', '{段|だん}ボールを{買|か}っておく'], correct: 0, why: 'Hai câu **～ておいてください**: cho đồ vào thùng + rút điện, lấy đồ trong tủ lạnh ra. Máy giặt → công ty tháo (bẫy ②); chủ nhà → **đã báo rồi** (bẫy ③); thùng → công ty **mang đến** (bẫy ④). 〔Nimotsu wa mae no hi made ni zenbu hako ni irete oite kudasai.〕' },
        { q: '{洗濯機|せんたくき}は{誰|だれ}が{外|はず}しますか。', options: ['{女|おんな}の{人|ひと}', '{引|ひ}っ{越|こ}し{屋|や}の{人|ひと}', '{大家|おおや}さん', '{女|おんな}の{人|ひと}の{友達|ともだち}'], correct: 1, why: '**{私|わたし}たちが{外|はず}しますから、そのままにしておいて{大丈夫|だいじょうぶ}です** — người nói là nhân viên chuyển nhà. 〔Watashitachi ga hazushimasu.〕' },
      ],
    },

    /* ── 2 ── */
    { t: 'h', text: 'Bài 2 — 問題1 課題理解: chủ nhà bàn giao phòng' },
    NG('b18-ng-2', '{女|おんな}の{人|ひと}はこのあと{何|なに}を{買|か}いに{行|い}きますか', 'Dạng 課題理解 — đồ nào ĐÃ có sẵn (～てあります) thì không cần mua; chờ câu chốt ở cuối.', [
      ['ナレーター', 'ja-nu', 'アパートで{大家|おおや}さんと{女|おんな}の{人|ひと}が{話|はな}しています。{女|おんな}の{人|ひと}はこのあと{何|なに}を{買|か}いに{行|い}きますか。', 'Apaato de ooya-san to onna no hito ga hanashite imasu. Onna no hito wa kono ato nani o kai ni ikimasu ka.', 'Ở căn hộ, chủ nhà và một người phụ nữ đang nói chuyện. Sau đây người phụ nữ đi mua gì?'],
      ['{大家|おおや}さん', 'ja-nam', 'リンさん、これが{部屋|へや}の{鍵|かぎ}です。{二|ふた}つありますから、{一|ひと}つはどこかにしまっておいてください。', 'Rin-san, kore ga heya no kagi desu. Futatsu arimasu kara, hitotsu wa dokoka ni shimatte oite kudasai.', 'Lin này, đây là chìa khoá phòng. Có hai chiếc nên cháu cất một chiếc ở đâu đó nhé.'],
      ['リン', 'ja-nu', 'はい。あのう、カーテンは{自分|じぶん}で{買|か}わなければなりませんか。', 'Hai. Anou, kaaten wa jibun de kawanakereba narimasen ka.', 'Vâng. À, rèm cửa thì cháu phải tự mua ạ?'],
      ['{大家|おおや}さん', 'ja-nam', 'いいえ、カーテンはもう{掛|か}けてありますよ。{前|まえ}に{住|す}んでいた{人|ひと}が{置|お}いていったんです。', 'Iie, kaaten wa mou kakete arimasu yo. Mae ni sunde ita hito ga oite itta n desu.', 'Không, rèm treo sẵn rồi. Người ở trước để lại đấy.'],
      ['リン', 'ja-nu', 'よかった。{電気|でんき}は？', 'Yokatta. Denki wa?', 'May quá. Còn đèn?'],
      ['{大家|おおや}さん', 'ja-nam', '{電球|でんきゅう}も{新|あたら}しいのに{取|と}り{替|か}えてあります。', 'Denkyuu mo atarashii no ni torikaete arimasu.', 'Bóng đèn cũng đã thay mới rồi.'],
      ['リン', 'ja-nu', 'ありがとうございます。ごみはいつ{出|だ}せばいいですか。', 'Arigatou gozaimasu. Gomi wa itsu daseba ii desu ka.', 'Cháu cảm ơn. Rác thì đổ vào lúc nào ạ?'],
      ['{大家|おおや}さん', 'ja-nam', 'ごみの{日|ひ}の{表|ひょう}は{冷蔵庫|れいぞうこ}に{貼|は}ってあります。それから、この{町|まち}では{市|し}の{黄色|きいろ}いごみ{袋|ぶくろ}を{使|つか}わなければなりません。ふつうの{袋|ふくろ}で{出|だ}すと、{持|も}っていってくれないんです。', 'Gomi no hi no hyou wa reizouko ni hatte arimasu. Sorekara, kono machi de wa shi no kiiroi gomibukuro o tsukawanakereba narimasen. Futsuu no fukuro de dasu to, motte itte kurenai n desu.', 'Bảng lịch rác đã dán trên tủ lạnh. À, ở thị trấn này phải dùng túi rác màu vàng của thành phố. Đổ bằng túi thường thì họ không mang đi đâu.'],
      ['リン', 'ja-nu', 'そうですか。じゃ、{駅前|えきまえ}のスーパーで{買|か}ってきます。', 'Sou desu ka. Ja, ekimae no suupaa de katte kimasu.', 'Vậy ạ. Thế cháu đi mua ở siêu thị trước ga.'],
      ['{大家|おおや}さん', 'ja-nam', '{出|で}かけるとき、{鍵|かぎ}をかけるのを{忘|わす}れないでくださいね。', 'Dekakeru toki, kagi o kakeru no o wasurenaide kudasai ne.', 'Lúc đi ra nhớ đừng quên khoá cửa nhé.'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}はこのあと{何|なに}を{買|か}いに{行|い}きますか。', 'Onna no hito wa kono ato nani o kai ni ikimasu ka.', 'Sau đây người phụ nữ đi mua gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b18-ng-2-q',
      title: 'Bài 2 — chọn đáp án',
      items: [
        { q: '{女|おんな}の{人|ひと}はこのあと{何|なに}を{買|か}いに{行|い}きますか。', options: ['カーテン', '{電球|でんきゅう}', '{市|し}の{黄色|きいろ}いごみ{袋|ぶくろ}', 'もう{一|ひと}つの{鍵|かぎ}'], correct: 2, why: 'Rèm → **もう{掛|か}けてあります**, bóng đèn → **{取|と}り{替|か}えてあります** (đã có sẵn → bẫy). Câu chốt: **{市|し}の{黄色|きいろ}いごみ{袋|ぶくろ}を{使|つか}わなければなりません … じゃ、スーパーで{買|か}ってきます**. 〔Ja, ekimae no suupaa de katte kimasu.〕' },
        { q: 'ごみの{日|ひ}の{表|ひょう}はどこにありますか。', options: ['ごみ{置|お}き{場|ば}', '{冷蔵庫|れいぞうこ}', '{玄関|げんかん}のドア', 'スーパー'], correct: 1, why: '**ごみの{日|ひ}の{表|ひょう}は{冷蔵庫|れいぞうこ}に{貼|は}ってあります**. 〔Reizouko ni hatte arimasu.〕' },
      ],
    },

    /* ── 3 ── */
    { t: 'h', text: 'Bài 3 — 問題2 ポイント理解: chọn phòng ở văn phòng nhà đất' },
    NG('b18-ng-3', '{男|おとこ}の{人|ひと}はどうしてAの{部屋|へや}にしましたか', 'Dạng ポイント理解 — nghe câu hỏi trước. Người nói cân nhắc nhiều điểm; lý do QUYẾT ĐỊNH ở ngay trước câu "Aにします".', [
      ['ナレーター', 'ja-nu', '{不動産屋|ふどうさんや}で{女|おんな}の{人|ひと}と{男|おとこ}の{人|ひと}が{話|はな}しています。{男|おとこ}の{人|ひと}はどうしてAの{部屋|へや}にしましたか。', "Fudousan'ya de onna no hito to otoko no hito ga hanashite imasu. Otoko no hito wa doushite ee no heya ni shimashita ka.", 'Ở văn phòng nhà đất, một người phụ nữ và một người đàn ông đang nói chuyện. Vì sao người đàn ông chọn phòng A?'],
      ['{不動産屋|ふどうさんや}の{人|ひと}', 'ja-nu', 'こちらの{二|ふた}つの{部屋|へや}はいかがですか。Aは{駅|えき}から{歩|ある}いて{5分|ごふん}で、{家賃|やちん}は{7万円|ななまんえん}です。Bは{駅|えき}からバスで{15分|じゅうごふん}ですが、{家賃|やちん}は{5万円|ごまんえん}で、{部屋|へや}も{広|ひろ}いです。', 'Kochira no futatsu no heya wa ikaga desu ka. Ee wa eki kara aruite gofun de, yachin wa nanaman en desu. Bii wa eki kara basu de juugofun desu ga, yachin wa goman en de, heya mo hiroi desu.', 'Hai phòng này anh thấy thế nào? Phòng A đi bộ 5 phút từ ga, tiền nhà 7 vạn yên. Phòng B đi xe buýt 15 phút từ ga, nhưng tiền nhà 5 vạn yên, phòng cũng rộng.'],
      ['ダニエル', 'ja-nam', 'うーん、{安|やす}いほうがいいんですが、{毎日|まいにち}バスに{乗|の}るのは{大変|たいへん}ですね。', 'Uun, yasui hou ga ii n desu ga, mainichi basu ni noru no wa taihen desu ne.', 'Ừm, tôi thích chỗ rẻ hơn, nhưng ngày nào cũng đi xe buýt thì vất vả nhỉ.'],
      ['{不動産屋|ふどうさんや}の{人|ひと}', 'ja-nu', 'Aの{部屋|へや}には、ベッドと{机|つくえ}がもう{置|お}いてありますよ。{前|まえ}の{人|ひと}が{置|お}いていきました。', 'Ee no heya ni wa, beddo to tsukue ga mou oite arimasu yo. Mae no hito ga oite ikimashita.', 'Phòng A đã có sẵn giường và bàn đấy. Người trước để lại.'],
      ['ダニエル', 'ja-nam', 'え、{家具付|かぐつ}きですか。', 'E, kagutsuki desu ka.', 'Ơ, có sẵn nội thất à?'],
      ['{不動産屋|ふどうさんや}の{人|ひと}', 'ja-nu', 'はい。それに、{窓|まど}も{大|おお}きいし、{明|あか}るいですよ。', 'Hai. Sore ni, mado mo ookii shi, akarui desu yo.', 'Vâng. Hơn nữa cửa sổ to, phòng sáng sủa lắm.'],
      ['ダニエル', 'ja-nam', '{窓|まど}はどちらでもいいんですが……。{家具|かぐ}を{買|か}うと、{10万円|じゅうまんえん}ぐらいかかりますよね。それなら、Aのほうが{安|やす}いと{思|おも}います。Aにします。', 'Mado wa dochira demo ii n desu ga……. Kagu o kau to, juuman en gurai kakarimasu yo ne. Sore nara, ee no hou ga yasui to omoimasu. Ee ni shimasu.', 'Cửa sổ thì sao cũng được… Mua đồ nội thất thì tốn khoảng 10 vạn yên nhỉ. Vậy thì tôi nghĩ phòng A rẻ hơn. Tôi chọn A.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}はどうしてAの{部屋|へや}にしましたか。', 'Otoko no hito wa doushite ee no heya ni shimashita ka.', 'Vì sao người đàn ông chọn phòng A?'],
    ]),
    {
      t: 'mcq',
      id: 'b18-ng-3-q',
      title: 'Bài 3 — chọn đáp án',
      items: [
        { q: '{男|おとこ}の{人|ひと}はどうしてAの{部屋|へや}にしましたか。', options: ['{家賃|やちん}がBより{安|やす}いから', '{家具|かぐ}が{置|お}いてあって、{家具|かぐ}を{買|か}うお{金|かね}がかからないから', '{窓|まど}が{大|おお}きくて{明|あか}るいから', '{部屋|へや}がBより{広|ひろ}いから'], correct: 1, why: 'Câu quyết định: **{家具|かぐ}を{買|か}うと、{10万円|じゅうまんえん}ぐらいかかります … それなら、Aのほうが{安|やす}い**. Cửa sổ → "どちらでもいい" (bẫy ③); tiền nhà A **đắt hơn** B (bẫy ①); B mới rộng (bẫy ④). 〔Sore nara, ee no hou ga yasui to omoimasu.〕' },
        { q: 'Bの{部屋|へや}はどんな{部屋|へや}ですか。', options: ['{駅|えき}から{近|ちか}くて{家賃|やちん}が{高|たか}い', '{駅|えき}から{遠|とお}いが、{家賃|やちん}が{安|やす}くて{広|ひろ}い', '{家具|かぐ}が{置|お}いてある', '{窓|まど}が{大|おお}きい'], correct: 1, why: 'B: **バスで{15分|じゅうごふん}**, **{5万円|ごまんえん}**, **{広|ひろ}い**. 〔Bii wa eki kara basu de juugofun desu ga, yachin wa goman en de, heya mo hiroi desu.〕' },
      ],
    },

    /* ── 4 ── */
    { t: 'h', text: 'Bài 4 — 問題2 ポイント理解: quy định đổ rác của khu nhà' },
    NG('b18-ng-4', '{燃|も}えないごみはいつ{出|だ}しますか', 'Dạng ポイント理解 — nhiều ngày, nhiều loại rác; ghi nhanh bảng "loại → ngày" khi nghe.', [
      ['ナレーター', 'ja-nu', 'アパートの{前|まえ}で{女|おんな}の{人|ひと}と{男|おとこ}の{人|ひと}が{話|はな}しています。{燃|も}えないごみはいつ{出|だ}しますか。', 'Apaato no mae de onna no hito to otoko no hito ga hanashite imasu. Moenai gomi wa itsu dashimasu ka.', 'Trước căn hộ, một người phụ nữ và một người đàn ông đang nói chuyện. Rác không cháy được thì đổ khi nào?'],
      ['ナタポン', 'ja-nam', '{山口|やまぐち}さん、すみません。ごみの{出|だ}し{方|かた}を{教|おし}えていただけませんか。', 'Yamaguchi-san, sumimasen. Gomi no dashikata o oshiete itadakemasen ka.', 'Cô Yamaguchi, xin lỗi cô. Cô chỉ giúp cháu cách đổ rác được không ạ?'],
      ['{山口|やまぐち}', 'ja-nu', 'ええ、いいですよ。{燃|も}えるごみは{月曜日|げつようび}と{木曜日|もくようび}。{瓶|びん}と{缶|かん}は{火曜日|かようび}です。', 'Ee, ii desu yo. Moeru gomi wa getsuyoubi to mokuyoubi. Bin to kan wa kayoubi desu.', 'Ừ, được thôi. Rác cháy được thứ Hai và thứ Năm. Chai lọ và lon thì thứ Ba.'],
      ['ナタポン', 'ja-nam', '{燃|も}えないごみは？', 'Moenai gomi wa?', 'Còn rác không cháy được?'],
      ['{山口|やまぐち}', 'ja-nu', '{燃|も}えないごみは{毎週|まいしゅう}じゃなくて、{第一|だいいち}と{第三|だいさん}の{金曜日|きんようび}です。{間違|まちが}えやすいから、カレンダーに{書|か}いておいたほうがいいですよ。', 'Moenai gomi wa maishuu ja nakute, daiichi to daisan no kin\'youbi desu. Machigaeyasui kara, karendaa ni kaite oita hou ga ii desu yo.', 'Rác không cháy được không phải tuần nào cũng đổ, mà là thứ Sáu tuần thứ nhất và tuần thứ ba. Dễ nhầm lắm nên ghi sẵn vào lịch.'],
      ['ナタポン', 'ja-nam', '{第一|だいいち}と{第三|だいさん}の{金曜日|きんようび}ですね。{古|ふる}い{机|つくえ}はどうすればいいですか。{引|ひ}っ{越|こ}しのとき、{壊|こわ}れたんです。', 'Daiichi to daisan no kin\'youbi desu ne. Furui tsukue wa dou sureba ii desu ka. Hikkoshi no toki, kowareta n desu.', 'Thứ Sáu tuần một và tuần ba nhỉ. Còn cái bàn cũ thì làm sao ạ? Nó bị gãy lúc chuyển nhà.'],
      ['{山口|やまぐち}', 'ja-nu', '{大|おお}きいごみはごみ{置|お}き{場|ば}に{出|だ}してはいけません。{市|し}に{電話|でんわ}して、お{金|かね}を{払|はら}って、{取|と}りに{来|き}てもらうんです。', 'Ookii gomi wa gomi okiba ni dashite wa ikemasen. Shi ni denwa shite, okane o haratte, tori ni kite morau n desu.', 'Rác cỡ lớn thì không được để ở chỗ tập kết. Phải gọi điện cho thành phố, trả tiền, rồi nhờ họ đến lấy.'],
      ['ナタポン', 'ja-nam', 'わかりました。{電話|でんわ}すれば、{取|と}りに{来|き}てくれるんですね。ありがとうございました。', 'Wakarimashita. Denwa sureba, tori ni kite kureru n desu ne. Arigatou gozaimashita.', 'Cháu hiểu rồi. Gọi điện là họ đến lấy giúp nhỉ. Cháu cảm ơn cô.'],
      ['ナレーター', 'ja-nu', '{燃|も}えないごみはいつ{出|だ}しますか。', 'Moenai gomi wa itsu dashimasu ka.', 'Rác không cháy được thì đổ khi nào?'],
    ]),
    {
      t: 'mcq',
      id: 'b18-ng-4-q',
      title: 'Bài 4 — chọn đáp án',
      items: [
        { q: '{燃|も}えないごみはいつ{出|だ}しますか。', options: ['{毎週|まいしゅう}{月曜日|げつようび}と{木曜日|もくようび}', '{毎週|まいしゅう}{火曜日|かようび}', '{第一|だいいち}と{第三|だいさん}の{金曜日|きんようび}', '{毎週|まいしゅう}{金曜日|きんようび}'], correct: 2, why: '**{毎週|まいしゅう}じゃなくて、{第一|だいいち}と{第三|だいさん}の{金曜日|きんようび}**. Thứ Hai, Năm = rác cháy được; thứ Ba = chai, lon. 〔Daiichi to daisan no kin\'youbi desu.〕' },
        { q: '{古|ふる}い{机|つくえ}はどうしますか。', options: ['{燃|も}えないごみの{日|ひ}にごみ{置|お}き{場|ば}に{出|だ}す', '{市|し}に{電話|でんわ}して、お{金|かね}を{払|はら}って、{取|と}りに{来|き}てもらう', '{山口|やまぐち}さんにあげる', '{自分|じぶん}で{直|なお}して{使|つか}う'], correct: 1, why: '**{市|し}に{電話|でんわ}して、お{金|かね}を{払|はら}って、{取|と}りに{来|き}てもらうんです** (rác cỡ lớn — {粗大|そだい}ごみ). 〔Tori ni kite morau n desu.〕' },
      ],
    },

    /* ── 5 ── */
    { t: 'h', text: 'Bài 5 — 問題3 発話表現: nói gì trong tình huống (4 câu)' },
    {
      t: 'p',
      text: 'Đề thật có tranh và mũi tên chỉ người nói. Ở đây tình huống được đọc thành lời. Nghe tình huống + 3 câu nói, chọn câu đúng nhất — để ý **người nghe là ai** (bạn hay người trên) và **ai làm cho ai**.',
    },
    NG('b18-ng-5', '{何|なん}と{言|い}いますか（4{問|もん}）', 'Dạng 発話表現 — chọn đúng hướng cho – nhận và đúng mức lịch sự.', [
      ['ナレーター', 'ja-nu', '{1番|いちばん}。{先生|せんせい}が{重|おも}い{荷物|にもつ}をたくさん{持|も}っています。{手伝|てつだ}いたいです。{何|なん}と{言|い}いますか。', 'Ichiban. Sensei ga omoi nimotsu o takusan motte imasu. Tetsudaitai desu. Nan to iimasu ka.', 'Câu 1. Thầy giáo đang cầm nhiều đồ nặng. Bạn muốn giúp. Bạn nói gì?'],
      ['ワン', 'ja-nu', '1、{先生|せんせい}、{持|も}ってあげます。 2、{先生|せんせい}、{持|も}ちましょうか。 3、{先生|せんせい}、{持|も}ってもらいます。', 'Ichi, sensei, motte agemasu. Ni, sensei, mochimashou ka. San, sensei, motte moraimasu.', '1. Thầy ơi, em xách cho (kể công). 2. Thầy ơi, để em xách giúp ạ? 3. Thầy ơi, em được thầy xách cho.'],
      ['ナレーター', 'ja-nu', '{2番|にばん}。{友達|ともだち}に{引|ひ}っ{越|こ}しを{手伝|てつだ}ってもらいたいです。{何|なん}と{言|い}いますか。', 'Niban. Tomodachi ni hikkoshi o tetsudatte moraitai desu. Nan to iimasu ka.', 'Câu 2. Bạn muốn bạn mình giúp chuyển nhà. Bạn nói gì?'],
      ['リン', 'ja-nu', '1、{引|ひ}っ{越|こ}し、{手伝|てつだ}ってあげない？ 2、{引|ひ}っ{越|こ}し、{手伝|てつだ}ってくれない？ 3、{引|ひ}っ{越|こ}し、{手伝|てつだ}っておかない？', 'Ichi, hikkoshi, tetsudatte agenai? Ni, hikkoshi, tetsudatte kurenai? San, hikkoshi, tetsudatte okanai?', '1. (Cậu) không giúp (ai đó) chuyển nhà à? 2. Giúp mình chuyển nhà được không? 3. Không giúp sẵn chuyển nhà à?'],
      ['ナレーター', 'ja-nu', '{3番|さんばん}。{隣|となり}の{年上|としうえ}の{人|ひと}に、ごみの{出|だ}し{方|かた}を{聞|き}きたいです。{何|なん}と{言|い}いますか。', 'Sanban. Tonari no toshiue no hito ni, gomi no dashikata o kikitai desu. Nan to iimasu ka.', 'Câu 3. Bạn muốn hỏi người hàng xóm lớn tuổi bên cạnh cách đổ rác. Bạn nói gì?'],
      ['ナタポン', 'ja-nam', '1、ごみの{出|だ}し{方|かた}を{教|おし}えていただけませんか。 2、ごみの{出|だ}し{方|かた}を{教|おし}えてあげませんか。 3、ごみの{出|だ}し{方|かた}を{教|おし}えておきませんか。', 'Ichi, gomi no dashikata o oshiete itadakemasen ka. Ni, gomi no dashikata o oshiete agemasen ka. San, gomi no dashikata o oshiete okimasen ka.', '1. Bác chỉ giúp cháu cách đổ rác được không ạ? 2. Bác không dạy (ai đó) cách đổ rác à? 3. Bác không dạy sẵn cách đổ rác à?'],
      ['ナレーター', 'ja-nu', '{4番|よんばん}。{友達|ともだち}が{引|ひ}っ{越|こ}しを{手伝|てつだ}ってくれました。お{礼|れい}を{言|い}います。{何|なん}と{言|い}いますか。', 'Yonban. Tomodachi ga hikkoshi o tetsudatte kuremashita. Orei o iimasu. Nan to iimasu ka.', 'Câu 4. Bạn bạn đã giúp chuyển nhà. Bạn nói lời cảm ơn. Bạn nói gì?'],
      ['マルコ', 'ja-nam', '1、{手伝|てつだ}ってあげて、ありがとう。 2、{手伝|てつだ}ってくれて、ありがとう。 3、{手伝|てつだ}っておいて、ありがとう。', 'Ichi, tetsudatte agete, arigatou. Ni, tetsudatte kurete, arigatou. San, tetsudatte oite, arigatou.', '1. Cảm ơn vì (mình) đã giúp (cậu). 2. Cảm ơn cậu đã giúp mình. 3. Cảm ơn vì đã giúp sẵn.'],
    ]),
    {
      t: 'mcq',
      id: 'b18-ng-5-q',
      title: 'Bài 5 — chọn câu nói đúng',
      items: [
        { q: '{1番|いちばん} — {先生|せんせい}の{荷物|にもつ}を{持|も}ってあげたい。', options: ['1', '2', '3'], correct: 1, why: 'Đề nghị giúp **người trên** → **{持|も}ちましょうか**. ～てあげます trước mặt thầy là kể công; câu 3 sai hướng. 〔Sensei, mochimashou ka.〕' },
        { q: '{2番|にばん} — {友達|ともだち}に{引|ひ}っ{越|こ}しを{手伝|てつだ}ってもらいたい。', options: ['1', '2', '3'], correct: 1, why: 'Nhờ bạn làm cho MÌNH → **～てくれない？** 〔Hikkoshi, tetsudatte kurenai?〕' },
        { q: '{3番|さんばん} — {年上|としうえ}の{隣|となり}の{人|ひと}にごみの{出|だ}し{方|かた}を{聞|き}きたい。', options: ['1', '2', '3'], correct: 0, why: 'Nhờ người lớn tuổi → **～ていただけませんか** (lịch sự nhất). 〔Gomi no dashikata o oshiete itadakemasen ka.〕' },
        { q: '{4番|よんばん} — {手伝|てつだ}ってくれた{友達|ともだち}にお{礼|れい}を{言|い}う。', options: ['1', '2', '3'], correct: 1, why: 'Cảm ơn chuẩn: **～てくれて、ありがとう**. 〔Tetsudatte kurete, arigatou.〕' },
      ],
    },

    /* ── 6 ── */
    { t: 'h', text: 'Bài 6 — 問題4 即時応答: đáp ngay (5 câu)' },
    NG('b18-ng-6', '{正|ただ}しい{返事|へんじ}を{選|えら}んでください（5{問|もん}）', 'Dạng 即時応答 — không có câu hỏi in sẵn: nghe 1 câu, chọn 1 trong 3 câu đáp.', [
      ['ナレーター', 'ja-nu', '{1番|いちばん}。', 'Ichiban.', 'Câu 1.'],
      ['マルコ', 'ja-nam', 'リン、この{箱|はこ}、どこに{置|お}けばいい？', 'Rin, kono hako, doko ni okeba ii?', 'Lin ơi, thùng này để đâu thì được?'],
      ['リン', 'ja-nu', '1、{窓|まど}の{横|よこ}に{置|お}いといて。 2、うん、{置|お}いてあげるよ。 3、{箱|はこ}が{置|お}いてあったね。', 'Ichi, mado no yoko ni oitoite. Ni, un, oite ageru yo. San, hako ga oite atta ne.', '1. Để cạnh cửa sổ giúp mình. 2. Ừ, mình để cho cậu. 3. Đã có thùng để sẵn nhỉ.'],
      ['ナレーター', 'ja-nu', '{2番|にばん}。', 'Niban.', 'Câu 2.'],
      ['リン', 'ja-nu', 'ナタポンさん、{車|くるま}を{貸|か}してくれて、ありがとう。', 'Natapon-san, kuruma o kashite kurete, arigatou.', 'Nattapon ơi, cảm ơn cậu đã cho mượn xe.'],
      ['ナタポン', 'ja-nam', '1、いえいえ、{役|やく}に{立|た}ってよかった。 2、うん、{貸|か}してもらったよ。 3、じゃ、{貸|か}しておくね。', 'Ichi, ieie, yaku ni tatte yokatta. Ni, un, kashite moratta yo. San, ja, kashite oku ne.', '1. Không có gì, giúp được cậu là tốt rồi. 2. Ừ, mình được cho mượn rồi. 3. Vậy mình cho mượn sẵn nhé.'],
      ['ナレーター', 'ja-nu', '{3番|さんばん}。', 'Sanban.', 'Câu 3.'],
      ['アンナ', 'ja-nu', '{冷蔵庫|れいぞうこ}に{何|なに}か{飲|の}み{物|もの}ある？', 'Reizouko ni nanika nomimono aru?', 'Trong tủ lạnh có gì uống không?'],
      ['リン', 'ja-nu', '1、うん、ジュースが{冷|ひ}やしてあるよ。 2、うん、{冷蔵庫|れいぞうこ}が{開|あ}いているよ。 3、ジュースを{飲|の}んでもらったよ。', 'Ichi, un, juusu ga hiyashite aru yo. Ni, un, reizouko ga aite iru yo. San, juusu o nonde moratta yo.', '1. Có, nước trái cây ướp lạnh sẵn đấy. 2. Ừ, tủ lạnh đang mở đấy. 3. Mình được (ai đó) uống nước trái cây cho rồi.'],
      ['ナレーター', 'ja-nu', '{4番|よんばん}。', 'Yonban.', 'Câu 4.'],
      ['ダニエル', 'ja-nam', 'すみません、この{荷物|にもつ}、ちょっと{持|も}っていただけませんか。', 'Sumimasen, kono nimotsu, chotto motte itadakemasen ka.', 'Xin lỗi, chị cầm giúp tôi cái túi này một chút được không ạ?'],
      ['{山口|やまぐち}', 'ja-nu', '1、ええ、いいですよ。 2、いいえ、{持|も}っていただきます。 3、はい、{持|も}ってあります。', 'Ichi, ee, ii desu yo. Ni, iie, motte itadakimasu. San, hai, motte arimasu.', '1. Vâng, được thôi. 2. Không, tôi được (anh) cầm cho. 3. Vâng, đã cầm sẵn rồi.'],
      ['ナレーター', 'ja-nu', '{5番|ごばん}。', 'Goban.', 'Câu 5.'],
      ['カルロス', 'ja-nam', '{明日|あした}のパーティーの{準備|じゅんび}、もうできた？', 'Ashita no paatii no junbi, mou dekita?', 'Chuẩn bị cho bữa tiệc mai xong chưa?'],
      ['パク', 'ja-nu', '1、うん、{飲|の}み{物|もの}も{買|か}ってあるし、{部屋|へや}も{片付|かたづ}けてあるよ。 2、うん、{明日|あした}{準備|じゅんび}しておいた。 3、ううん、{準備|じゅんび}してあげるよ。', 'Ichi, un, nomimono mo katte aru shi, heya mo katazukete aru yo. Ni, un, ashita junbi shite oita. San, uun, junbi shite ageru yo.', '1. Rồi, đồ uống mua sẵn rồi, phòng cũng dọn sẵn rồi. 2. Ừ, ngày mai đã chuẩn bị sẵn rồi. 3. Chưa, để mình chuẩn bị cho.'],
    ]),
    {
      t: 'mcq',
      id: 'b18-ng-6-q',
      title: 'Bài 6 — chọn câu đáp đúng',
      items: [
        { q: '{1番|いちばん} — 「この{箱|はこ}、どこに{置|お}けばいい？」', options: ['1', '2', '3'], correct: 0, why: 'Hỏi để đâu → chỉ chỗ + nhờ: **{窓|まど}の{横|よこ}に{置|お}いといて** (= {置|お}いておいて). 〔Mado no yoko ni oitoite.〕' },
        { q: '{2番|にばん} — 「{車|くるま}を{貸|か}してくれて、ありがとう。」', options: ['1', '2', '3'], correct: 0, why: 'Đáp lời cảm ơn: **いえいえ、{役|やく}に{立|た}ってよかった**. 2 sai hướng (người cho mượn là ナタポン), 3 vô nghĩa. 〔Ieie, yaku ni tatte yokatta.〕' },
        { q: '{3番|さんばん} — 「{冷蔵庫|れいぞうこ}に{何|なに}か{飲|の}み{物|もの}ある？」', options: ['1', '2', '3'], correct: 0, why: 'Có đồ uống được chuẩn bị sẵn → **ジュースが{冷|ひ}やしてあるよ**. 〔Juusu ga hiyashite aru yo.〕' },
        { q: '{4番|よんばん} — 「この{荷物|にもつ}、ちょっと{持|も}っていただけませんか。」', options: ['1', '2', '3'], correct: 0, why: 'Đồng ý lời nhờ: **ええ、いいですよ**. 〔Ee, ii desu yo.〕' },
        { q: '{5番|ごばん} — 「{明日|あした}のパーティーの{準備|じゅんび}、もうできた？」', options: ['1', '2', '3'], correct: 0, why: '"もう～た？" → việc chuẩn bị đã xong, kết quả còn đó: **{買|か}ってあるし、{片付|かたづ}けてある**. Câu 2 sai thời (明日 + ～ておいた). 〔Nomimono mo katte aru shi, heya mo katazukete aru yo.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 6. ĐỌC HIỂU ═══════════════════════════ */

const DOC: Lesson = {
  id: 'b18-doc',
  kind: 'reading',
  title: 'Đọc hiểu N4 — thông báo cắt nước của khu nhà, bài viết "Lần đầu sống một mình", bảng giá công ty chuyển nhà (情報検索)',
  goal: 'Đọc thông báo của khu nhà để biết việc phải làm sẵn và việc không cần làm; đọc bài viết ~450 chữ kể lần đầu sống một mình để nắm lý do, chuyện khó nhất, chi tiết và ý chính người viết muốn nói; tra bảng giá 3 gói chuyển nhà để chọn đúng gói và tính đúng tiền theo điều kiện cho sẵn.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Phần đọc (読解) đề JLPT N4',
      head: ['Mondai', 'Dạng', 'Độ dài', 'Bài này luyện'],
      rows: [
        ['問題4', '内容理解（短文）', '~100–200 chữ: email, thông báo, ghi chú', 'Bài 1 — thông báo cắt nước của khu nhà'],
        ['問題5', '内容理解（中文）', '~350–450 chữ: bài viết, nhật ký', 'Bài 2 — 「はじめての{一人暮|ひとりぐ}らし」'],
        ['問題6', '情報検索', '~400 chữ: bảng, tờ quảng cáo, lịch', 'Bài 3 — bảng giá 3 gói của công ty chuyển nhà'],
      ],
    },
    {
      t: 'note',
      title: 'Chiến thuật đọc',
      items: [
        '**Đọc câu hỏi trước**, gạch chân từ khoá (まず・どうして・いくら・{何|なに}をしておかなければ), rồi mới đọc bài để tìm.',
        'Thông báo: việc phải làm sẵn nằm sau **～ておいてください**; việc KHÔNG cần làm nằm sau **～なくてもいいです／～なくても{大丈夫|だいじょうぶ}です**; thời gian ở **～から～まで**, hạn chót ở **～までに**.',
        'Bài viết: câu **いちばん～のは、～です** trả lời câu hỏi "chuyện gì nhất"; ý chính của người viết thường ở **đoạn cuối** (～と{思|おも}っています／～たいです).',
        '情報検索: lập **bảng điều kiện** của người trong câu hỏi (ngày nào, tự làm được gì, ngân sách, có giảm giá không) rồi **loại** từng gói. Đừng quên dòng **※** cuối bảng.',
      ],
    },

    /* ── Bài 1 ── */
    { t: 'h', text: 'Bài 1 — 内容理解（短文）: thông báo cắt nước của khu nhà' },
    {
      t: 'passage',
      title: '{水道工事|すいどうこうじ}のお{知|し}らせ',
      intro: 'リン thấy tờ thông báo này dán ở cửa thang bộ của khu nhà. Đọc rồi trả lời câu hỏi.',
      paras: [
        { text: 'さくらハイツにお{住|す}まいの{皆様|みなさま}へ' },
        { text: '{11月|じゅういちがつ}{20日|はつか}（{水|すい}）の{午前|ごぜん}{10時|じゅうじ}から{午後|ごご}{3時|さんじ}まで、{建物|たてもの}の{水道|すいどう}の{工事|こうじ}をします。この{間|あいだ}、{水|みず}が{出|で}ません。トイレも{使|つか}えません。' },
        { text: '{工事|こうじ}の{前|まえ}の{日|ひ}までに、{飲|の}む{水|みず}をペットボトルなどに{入|い}れておいてください。トイレに{使|つか}いますので、お{風呂|ふろ}にも{水|みず}を{入|い}れておくと{便利|べんり}です。' },
        { text: '{工事|こうじ}は{建物|たてもの}の{外|そと}でしますので、{工事|こうじ}の{人|ひと}がお{部屋|へや}に{入|はい}ることはありません。{留守|るす}でも{大丈夫|だいじょうぶ}です。ベランダに{置|お}いてある{物|もの}も、{動|うご}かさなくてもいいです。' },
        { text: 'わからないことがあれば、{管理人室|かんりにんしつ}（{1階|いっかい}）に{連絡|れんらく}してください。ご{協力|きょうりょく}をお{願|ねが}いします。' },
        { text: 'さくらハイツ　{管理人|かんりにん}' },
      ],
    },
    {
      t: 'mcq',
      id: 'b18-doc-1',
      title: 'Bài 1 — câu hỏi',
      items: [
        { q: '{住|す}んでいる{人|ひと}は{工事|こうじ}の{前|まえ}に{何|なに}をしておかなければなりませんか。', options: ['ベランダの{物|もの}を{部屋|へや}に{入|い}れておく', '{飲|の}む{水|みず}をペットボトルなどに{入|い}れておく', '{管理人室|かんりにんしつ}に{連絡|れんらく}しておく', '{部屋|へや}の{鍵|かぎ}を{開|あ}けておく'], correct: 1, why: '**{飲|の}む{水|みず}をペットボトルなどに{入|い}れておいてください** — câu ～ておいてください duy nhất là việc bắt buộc. Ban công → **{動|うご}かさなくてもいい** (bẫy ①); liên lạc chỉ khi không hiểu (bẫy ③). 〔Nomu mizu o pettobotoru nado ni irete oite kudasai.〕' },
        { q: 'お{知|し}らせの{内容|ないよう}と{合|あ}っているのはどれですか。', options: ['{工事|こうじ}の{人|ひと}が{部屋|へや}に{入|はい}るので、{家|いえ}にいなければならない。', '{午後|ごご}{3時|さんじ}までトイレが{使|つか}えない。', '{工事|こうじ}は{11月|じゅういちがつ}{20日|はつか}の{朝|あさ}から{夜|よる}までだ。', 'お{風呂|ふろ}は{工事|こうじ}の{日|ひ}も{使|つか}える。'], correct: 1, why: '**{10時|じゅうじ}から{午後|ごご}{3時|さんじ}まで … トイレも{使|つか}えません**. Thợ không vào phòng → {留守|るす}でも{大丈夫|だいじょうぶ}; công trình kết thúc 3 giờ chiều. 〔Toire mo tsukaemasen.〕' },
        { q: '「お{風呂|ふろ}にも{水|みず}を{入|い}れておくと{便利|べんり}です」のは、どうしてですか。', options: ['お{風呂|ふろ}に{入|はい}りたいから', 'その{水|みず}をトイレに{使|つか}えるから', '{飲|の}む{水|みず}が{足|た}りないから', '{工事|こうじ}の{人|ひと}が{使|つか}うから'], correct: 1, why: 'Câu ngay trước: **トイレに{使|つか}いますので** — nước trong bồn tắm dùng để dội toilet. 〔Toire ni tsukaimasu node.〕' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('{飲|の}む{水|みず}をペットボトルに{入|い}れておいてください。', 'Nomu mizu o pettobotoru ni irete oite kudasai.', 'Hãy cho sẵn nước uống vào chai nhựa. (việc phải làm sẵn)'),
        E('ベランダに{置|お}いてある{物|もの}も、{動|うご}かさなくてもいいです。', 'Beranda ni oite aru mono mo, ugokasanakute mo ii desu.', 'Đồ để ở ban công cũng không cần dời đi. (～てある + không cần làm)'),
        E('{留守|るす}でも{大丈夫|だいじょうぶ}です。', 'Rusu demo daijoubu desu.', 'Dù vắng nhà cũng không sao.'),
        E('わからないことがあれば、{管理人室|かんりにんしつ}に{連絡|れんらく}してください。', 'Wakaranai koto ga areba, kanrinin-shitsu ni renraku shite kudasai.', 'Nếu có gì không rõ, xin liên lạc phòng quản lý.'),
      ],
    },

    /* ── Bài 2 ── */
    { t: 'h', text: 'Bài 2 — 内容理解（中文）: 「はじめての一人暮らし」' },
    {
      t: 'passage',
      title: 'はじめての{一人暮|ひとりぐ}らし　　ワン',
      intro: 'Bài viết của ワン đăng trên bản tin của hội du học sinh trường. Đọc rồi trả lời câu hỏi.',
      paras: [
        { label: '①', text: '{日本|にほん}に{来|き}てから{一年間|いちねんかん}、{私|わたし}は{学校|がっこう}の{寮|りょう}に{住|す}んでいました。{寮|りょう}は{安|やす}いし、{友達|ともだち}もいるし、とても{便利|べんり}でした。でも、{自分|じぶん}だけの{部屋|へや}がほしくなって、{先月|せんげつ}、{駅|えき}の{近|ちか}くのアパートに{引|ひ}っ{越|こ}しました。' },
        { label: '②', text: '{引|ひ}っ{越|こ}しは{思|おも}ったより{大変|たいへん}でした。{荷物|にもつ}を{運|はこ}ぶのは、クラスの{友達|ともだち}が{五人|ごにん}も{手伝|てつだ}ってくれたので、{半日|はんにち}で{終|お}わりました。いちばん{困|こま}ったのは、{役所|やくしょ}の{手続|てつづ}きです。{新|あたら}しい{住所|じゅうしょ}を{届|とど}けなければなりませんでしたが、{書類|しょるい}の{日本語|にほんご}が{難|むずか}しくて、{全然|ぜんぜん}わかりませんでした。{最後|さいご}は、{役所|やくしょ}の{人|ひと}に{一|ひと}つずつ{教|おし}えてもらいました。' },
        { label: '③', text: '{一人暮|ひとりぐ}らしでは、ごみにも{困|こま}りました。{最初|さいしょ}の{週|しゅう}、{私|わたし}は{燃|も}えないごみを{燃|も}えるごみの{日|ひ}に{出|だ}しました。{次|つぎ}の{朝|あさ}ごみ{置|お}き{場|ば}に{行|い}ったら、{私|わたし}のごみ{袋|ぶくろ}に「この{日|ひ}は{出|だ}せません」という{紙|かみ}が{貼|は}ってありました。とても{恥|は}ずかしかったです。それからは、ごみの{日|ひ}の{表|ひょう}を{冷蔵庫|れいぞうこ}に{貼|は}っておいて、{毎朝|まいあさ}{見|み}ています。' },
        { label: '④', text: '{一人暮|ひとりぐ}らしは{大変|たいへん}なこともありますが、{楽|たの}しいです。{困|こま}ったときは、{友達|ともだち}や{隣|となり}の{山口|やまぐち}さんが{助|たす}けてくれたので、{日本|にほん}の{生活|せいかつ}に{少|すこ}しずつ{慣|な}れました。{来年|らいねん}{新|あたら}しい{留学生|りゅうがくせい}が{来|き}たら、{今度|こんど}は{私|わたし}が{手伝|てつだ}ってあげたいと{思|おも}っています。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b18-doc-2',
      title: 'Bài 2 — câu hỏi',
      items: [
        { q: 'ワンさんはどうして{寮|りょう}からアパートに{引|ひ}っ{越|こ}しましたか。', options: ['{寮|りょう}が{高|たか}かったから', '{寮|りょう}に{友達|ともだち}がいなかったから', '{自分|じぶん}だけの{部屋|へや}がほしくなったから', '{寮|りょう}が{駅|えき}から{遠|とお}かったから'], correct: 2, why: 'Đoạn ①: ký túc xá rẻ, có bạn, tiện (các lý do bị gạt đi) — **でも、{自分|じぶん}だけの{部屋|へや}がほしくなって** mới là lý do. 〔Demo, jibun dake no heya ga hoshiku natte…〕' },
        { q: '{引|ひ}っ{越|こ}しでいちばん{困|こま}ったことは{何|なん}ですか。', options: ['{荷物|にもつ}を{運|はこ}ぶこと', '{手伝|てつだ}ってくれる{友達|ともだち}を{探|さが}すこと', '{役所|やくしょ}の{書類|しょるい}を{書|か}くこと', 'ごみを{出|だ}すこと'], correct: 2, why: '**いちばん{困|こま}ったのは、{役所|やくしょ}の{手続|てつづ}きです** — giấy tờ khó, không biết viết gì. Chuyển đồ thì bạn giúp, nửa ngày là xong. 〔Ichiban komatta no wa, yakusho no tetsuzuki desu.〕' },
        { q: '「この{日|ひ}は{出|だ}せません」という{紙|かみ}について、{正|ただ}しいのはどれですか。', options: ['ワンさんが{自分|じぶん}で{貼|は}った。', 'ワンさんのごみ{袋|ぶくろ}に{貼|は}ってあった。', 'ワンさんの{冷蔵庫|れいぞうこ}に{貼|は}ってある。', '{山口|やまぐち}さんがワンさんに{渡|わた}した。'], correct: 1, why: '**{私|わたし}のごみ{袋|ぶくろ}に…という{紙|かみ}が{貼|は}ってありました** (～てある: ai đó — người quản lý / bên thu rác — đã dán). Cái dán trên tủ lạnh là bảng lịch rác. 〔Watashi no gomibukuro ni … kami ga hatte arimashita.〕' },
        { q: 'ワンさんがこの{文章|ぶんしょう}でいちばん{言|い}いたいことは{何|なん}ですか。', options: ['{寮|りょう}のほうがアパートより{便利|べんり}だ。', '{役所|やくしょ}の{書類|しょるい}はもっと{簡単|かんたん}にしたほうがいい。', '{一人暮|ひとりぐ}らしは{大変|たいへん}だが、{助|たす}けてもらって{慣|な}れた。{今度|こんど}は{自分|じぶん}が{手伝|てつだ}いたい。', 'ごみの{出|だ}し{方|かた}は{国|くに}によって{違|ちが}う。'], correct: 2, why: 'Ý chính ở đoạn ④: **{助|たす}けてくれました … {慣|な}れました … {今度|こんど}は{私|わたし}が{手伝|てつだ}ってあげたい**. Các phương án khác chỉ là chi tiết hoặc không có trong bài.' },
      ],
    },
    {
      t: 'note',
      title: 'Ngữ pháp trong bài đọc 2',
      items: [
        '**{友達|ともだち}が{五人|ごにん}も{手伝|てつだ}ってくれた** — số lượng + も = "những (5 người)"; くれた: bạn làm cho tôi. **{役所|やくしょ}の{人|ひと}に{教|おし}えてもらいました** — người làm + に + もらう.',
        '**{行|い}ったら、…{貼|は}ってありました** — ～たら + phát hiện (ポイント 120) + ～てある (đã có ai dán). **{貼|は}っておいて、{毎朝|まいあさ}{見|み}る** — ～ておく (dán sẵn để xem).',
        '**{助|たす}けてくれたので、…{慣|な}れました** — くれる + lý do (ので): cách kể "nhờ ai giúp mà mình được gì" rất hay gặp trong bài viết cảm nghĩ.',
      ],
    },

    /* ── Bài 3 ── */
    { t: 'h', text: 'Bài 3 — 情報検索: bảng giá công ty chuyển nhà' },
    {
      t: 'passage',
      title: 'ひまわり{引|ひ}っ{越|こ}しセンター　{学生|がくせい}の{皆|みな}さんへ',
      intro: 'リン đang tìm công ty chuyển nhà. Đây là tờ quảng cáo cô lấy ở trường. Đọc bảng giá bên dưới rồi trả lời câu hỏi.',
      paras: [
        { text: '{近|ちか}くの{引|ひ}っ{越|こ}し（{同|おな}じ{市|し}の{中|なか}）は、{三|みっ}つのプランから{選|えら}べます。' },
        { text: '①らくらくプラン：{荷物|にもつ}を{箱|はこ}に{入|い}れるのも、{運|はこ}ぶのも、{新|あたら}しい{部屋|へや}で{箱|はこ}から{出|だ}すのも、{全部|ぜんぶ}{私|わたし}たちがします。' },
        { text: '②まかせてプラン：{荷物|にもつ}はお{客様|きゃくさま}が{箱|はこ}に{入|い}れておいてください。{家具|かぐ}や{箱|はこ}を{運|はこ}ぶのは、{私|わたし}たちがします。' },
        { text: '③じぶんでプラン：トラックと{運転手|うんてんしゅ}を{2時間|にじかん}お{貸|か}しします。{荷物|にもつ}を{運|はこ}ぶのは、お{客様|きゃくさま}がしてください。' },
        { text: '※{学生証|がくせいしょう}を{見|み}せれば、どのプランも{10|じゅっ}パーセント{安|やす}くなります。' },
        { text: '※{段|だん}ボールは{20枚|にじゅうまい}まで{無料|むりょう}です。{21枚|にじゅういちまい}からは{1枚|いちまい}{100円|ひゃくえん}です。' },
      ],
    },
    {
      t: 'table',
      caption: 'ひまわり引っ越しセンター — 料金表（{近|ちか}くの{引|ひ}っ{越|こ}し）',
      head: ['プラン', '{平日|へいじつ}（{月|げつ}～{金|きん}）', '{土|ど}・{日|にち}・{祝日|しゅくじつ}', 'Ai đóng thùng / ai khuân'],
      rows: [
        ['①らくらくプラン', '{60,000円|ろくまんえん}', '{70,000円|ななまんえん}', 'công ty đóng thùng + khuân + mở thùng'],
        ['②まかせてプラン', '{35,000円|さんまんごせんえん}', '{45,000円|よんまんごせんえん}', 'khách đóng thùng · công ty khuân'],
        ['③じぶんでプラン', '{15,000円|いちまんごせんえん}', '{20,000円|にまんえん}', 'chỉ thuê xe + tài xế 2 tiếng · khách tự khuân'],
      ],
    },
    {
      t: 'mcq',
      id: 'b18-doc-3',
      title: 'Bài 3 — câu hỏi',
      items: [
        { q: 'リンさんは{大学生|だいがくせい}です。{土曜日|どようび}に{引|ひ}っ{越|こ}します。{荷物|にもつ}は{自分|じぶん}で{箱|はこ}に{入|い}れられますが、{重|おも}い{家具|かぐ}は{運|はこ}べません。{手伝|てつだ}ってくれる{友達|ともだち}もいません。{予算|よさん}は{45,000円|よんまんごせんえん}までです。どのプランで、いくら{払|はら}いますか。', options: ['①らくらくプランで{63,000円|ろくまんさんぜんえん}', '②まかせてプランで{40,500円|よんまんごひゃくえん}', '②まかせてプランで{45,000円|よんまんごせんえん}', '③じぶんでプランで{18,000円|いちまんはっせんえん}'], correct: 1, why: 'Tự đóng thùng được nhưng không tự khuân, không có bạn giúp → loại ③ (khách tự khuân). ① thứ Bảy 70.000 − 10% = 63.000 > ngân sách. ② thứ Bảy **45.000**, sinh viên giảm 10% → **40.500 yên**. Bẫy ③: quên giảm giá sinh viên.' },
        { q: '{段|だん}ボールを{25枚|にじゅうごまい}{使|つか}いました。{段|だん}ボールのお{金|かね}はいくらですか。', options: ['{0円|ぜろえん}', '{500円|ごひゃくえん}', '{2,500円|にせんごひゃくえん}', '{2,000円|にせんえん}'], correct: 1, why: '20 tấm đầu miễn phí; tấm 21–25 = **5 tấm × 100 yên = 500 yên**.' },
        { q: 'このお{知|し}らせの{内容|ないよう}と{合|あ}っているのはどれですか。', options: ['らくらくプランは、{荷物|にもつ}を{箱|はこ}に{入|い}れておかなければならない。', 'じぶんでプランは、トラックを{一日|いちにち}{借|か}りられる。', 'まかせてプランは、{家具|かぐ}を{運|はこ}んでもらえる。', '{学生証|がくせいしょう}がなくても、{学生|がくせい}は{安|やす}くなる。'], correct: 2, why: '② **{家具|かぐ}や{箱|はこ}を{運|はこ}ぶのは、{私|わたし}たちがします** → khách được công ty khuân giúp (～てもらえる). ① công ty đóng thùng hết; ③ chỉ 2 tiếng; giảm giá phải **{学生証|がくせいしょう}を{見|み}せれば**.' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('{荷物|にもつ}はお{客様|きゃくさま}が{箱|はこ}に{入|い}れておいてください。', 'Nimotsu wa okyakusama ga hako ni irete oite kudasai.', 'Đồ đạc xin quý khách tự cho sẵn vào thùng.'),
        E('{家具|かぐ}を{運|はこ}ぶのは、{私|わたし}たちがします。', 'Kagu o hakobu no wa, watashitachi ga shimasu.', 'Việc khuân đồ nội thất thì chúng tôi làm.'),
        E('{学生証|がくせいしょう}を{見|み}せれば、{10|じゅっ}パーセント{安|やす}くなります。', 'Gakuseishou o misereba, juppaasento yasuku narimasu.', 'Nếu xuất trình thẻ sinh viên thì rẻ đi 10%.'),
        E('{段|だん}ボールは{20枚|にじゅうまい}まで{無料|むりょう}です。', 'Danbooru wa nijuu-mai made muryou desu.', 'Thùng các-tông miễn phí tới 20 tấm.'),
      ],
    },
  ],
};

/* ═══════════════════════════ 7. NÓI ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b18-noi',
  kind: 'speaking',
  title: 'Luyện nói — nhờ vả đúng mức lịch sự, kể ai đã giúp mình, tả căn phòng, kể 1 phút lần chuyển nhà, đọc to',
  goal: 'Trả lời trôi chảy câu hỏi thi nói về chuyển nhà, giúp đỡ, nhờ vả (ai đã giúp bạn, bạn đã giúp ai, khi khó khăn nhờ ai) bằng ～てくれる／～てもらう／～てあげる; nhìn tranh căn phòng tả đồ vật bằng ～てあります; kể 1 phút lần chuyển nhà của mình có ～ておきました; đọc to đoạn văn 30 giây đúng nhịp.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Thi nói kiểu JPD (khung của bộ môn) — chủ đề Bài 18 rơi vào đâu',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 18 xuất hiện ở đâu'],
      rows: [
        ['Reading', '40', 'Chuẩn bị 30 giây, đọc to đoạn ~100 chữ.', 'Đoạn kể chuyển nhà: {引|ひ}っ{越|こ}し, {手伝|てつだ}ってくれました, {段|だん}ボール, {用意|ようい}しておきました, {貼|は}ってあります…'],
        ['Talking — có tranh', '3 × 15', 'Nhìn tranh (căn phòng, phiếu chuyển phát, bảng lịch rác) trả lời.', '{壁|かべ}に{何|なに}が{掛|か}けてありますか · {机|つくえ}の{上|うえ}に{何|なに}が{置|お}いてありますか · {燃|も}えるごみは{何曜日|なんようび}ですか'],
        ['Talking — không tranh', '1 × 10', 'Trả lời 1 câu về bản thân.', '{引|ひ}っ{越|こ}ししたことがありますか · {困|こま}ったとき、{誰|だれ}に{助|たす}けてもらいますか · {最近|さいきん}、{誰|だれ}かに{何|なに}かをしてあげましたか'],
        ['Presenting', '5', 'Chào khi vào/ra, thái độ.', '{失礼|しつれい}します／よろしくお{願|ねが}いします／ありがとうございました'],
      ],
    },
    {
      t: 'note',
      title: 'Luật trả lời cho câu hỏi Bài 18',
      items: [
        '**Câu hỏi "ai giúp bạn?"** → trả lời bằng **～が～てくれました** (tự nhiên, biết ơn) hoặc **～に～てもらいました**, rồi thêm cảm xúc: {本当|ほんとう}に{助|たす}かりました／うれしかったです.',
        '**Câu hỏi "bạn đã giúp ai?"** → **～を／に～てあげました** + kết quả: {友達|ともだち}は{喜|よろこ}んでくれました. Kể với giám khảo (người trên) thì vẫn được dùng ～てあげました khi nói về bạn bè, em nhỏ.',
        '**Tranh căn phòng** → mỗi câu một đồ vật, đúng khuôn **[chỗ]に[đồ]が[tha động từ]てあります**: {壁|かべ}に{時計|とけい}が{掛|か}けてあります.',
        'Câu dài 2–3 ý là đủ điểm: **câu chính + lý do (～ので／～から) + cảm nghĩ**. Không nghe rõ: **もう{一度|いちど}お{願|ねが}いします** (tối đa 2 lần, không bị trừ).',
      ],
    },
    {
      t: 'phatam',
      id: 'b18-noi-phat-am',
      title: 'Đọc to & chấm phát âm — 14 câu hay dùng của Bài 18',
      note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Chú ý: て・つ・だっ・て (âm ngắt っ giữ 1 nhịp), はっ・て・あ・り・ま・す, お・し・い・れ, お・お・や, {用意|ようい}して・おきます (đọc liền, không ngắt giữa て và おきます).',
      items: [
        { text: '{来月|らいげつ}、{寮|りょう}からアパートに{引|ひ}っ{越|こ}します。', ipa: 'raigetsu ryou kara apaato ni hikkoshimasu', vi: 'Tháng sau tôi chuyển từ ký túc xá sang căn hộ.' },
        { text: 'すみません、{引|ひ}っ{越|こ}しを{手伝|てつだ}ってもらえませんか。', ipa: 'sumimasen hikkoshi o tetsudatte moraemasen ka', vi: 'Xin lỗi, bạn giúp tôi chuyển nhà được không?' },
        { text: 'いいですよ。{僕|ぼく}が{手伝|てつだ}ってあげます。', ipa: 'ii desu yo boku ga tetsudatte agemasu', vi: 'Được thôi. Để mình giúp cho.' },
        { text: 'ナタポンさんが{車|くるま}を{貸|か}してくれました。', ipa: 'Natapon-san ga kuruma o kashite kuremashita', vi: 'Nattapon đã cho tôi mượn xe.' },
        { text: 'アンナさんに{段|だん}ボールを{集|あつ}めてもらいました。', ipa: 'Anna-san ni danbooru o atsumete moraimashita', vi: 'Tôi được Anna gom thùng các-tông cho.' },
        { text: '{手伝|てつだ}ってくれて、{本当|ほんとう}に{助|たす}かりました。', ipa: 'tetsudatte kurete hontou ni tasukarimashita', vi: 'Bạn giúp tôi, thật sự đỡ quá.' },
        { text: '{引|ひ}っ{越|こ}しの{前|まえ}に、{要|い}らない{物|もの}を{捨|す}てておきます。', ipa: 'hikkoshi no mae ni iranai mono o sutete okimasu', vi: 'Trước khi chuyển, tôi vứt sẵn đồ không cần.' },
        { text: '{窓|まど}は{開|あ}けておいてください。', ipa: 'mado wa akete oite kudasai', vi: 'Cửa sổ cứ để mở nhé.' },
        { text: '{箱|はこ}に「{台所|だいどころ}」と{書|か}いてあります。', ipa: 'hako ni daidokoro to kaite arimasu', vi: 'Trên thùng có ghi "bếp".' },
        { text: '{壁|かべ}にカレンダーが{掛|か}けてあります。', ipa: 'kabe ni karendaa ga kakete arimasu', vi: 'Trên tường có treo lịch.' },
        { text: 'これからお{世話|せわ}になります。よろしくお{願|ねが}いします。', ipa: 'korekara osewa ni narimasu yoroshiku onegai shimasu', vi: 'Từ nay mong được giúp đỡ. Rất mong được chỉ bảo.' },
        { text: 'ごみの{出|だ}し{方|かた}を{教|おし}えていただけませんか。', ipa: 'gomi no dashikata o oshiete itadakemasen ka', vi: 'Chỉ giúp tôi cách đổ rác được không ạ?' },
        { text: '{燃|も}えるごみは{月曜日|げつようび}と{木曜日|もくようび}です。', ipa: 'moeru gomi wa getsuyoubi to mokuyoubi desu', vi: 'Rác cháy được là thứ Hai và thứ Năm.' },
        { text: '{借|か}りた{車|くるま}は、{明日|あした}{返|かえ}しておきます。', ipa: 'karita kuruma wa ashita kaeshite okimasu', vi: 'Xe đã mượn, mai tôi trả cho xong.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Thi nói mẫu — giám khảo hỏi về chuyển nhà và giúp đỡ',
      lines: [
        { who: '{試験官|しけんかん}', role: 'examiner', text: '{引|ひ}っ{越|こ}ししたことがありますか。', ro: 'Hikkoshi shita koto ga arimasu ka.', vi: 'Em đã từng chuyển nhà chưa?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、あります。{先月|せんげつ}、{寮|りょう}からアパートに{引|ひ}っ{越|こ}しました。', ro: 'Hai, arimasu. Sengetsu, ryou kara apaato ni hikkoshimashita.', vi: 'Vâng, có ạ. Tháng trước em chuyển từ ký túc xá sang căn hộ.' },
        { who: '{試験官|しけんかん}', role: 'examiner', text: '{誰|だれ}が{手伝|てつだ}ってくれましたか。', ro: 'Dare ga tetsudatte kuremashita ka.', vi: 'Ai đã giúp em?' },
        { who: 'Bạn', role: 'candidate', text: 'クラスの{友達|ともだち}が{三人|さんにん}{手伝|てつだ}ってくれました。{重|おも}い{家具|かぐ}も{運|はこ}んでくれたので、{本当|ほんとう}に{助|たす}かりました。', ro: 'Kurasu no tomodachi ga sannin tetsudatte kuremashita. Omoi kagu mo hakonde kureta node, hontou ni tasukarimashita.', vi: 'Ba bạn cùng lớp đã giúp em. Các bạn khuân cả đồ nội thất nặng nên em đỡ lắm ạ.' },
        { who: '{試験官|しけんかん}', role: 'examiner', text: '{引|ひ}っ{越|こ}しの{前|まえ}に、{何|なに}をしておきましたか。', ro: 'Hikkoshi no mae ni, nani o shite okimashita ka.', vi: 'Trước khi chuyển, em đã chuẩn bị sẵn những gì?' },
        { who: 'Bạn', role: 'candidate', text: '{段|だん}ボールを{用意|ようい}しておきました。それから、{大家|おおや}さんに{連絡|れんらく}しておきました。', ro: 'Danbooru o youi shite okimashita. Sorekara, ooya-san ni renraku shite okimashita.', vi: 'Em đã chuẩn bị sẵn thùng các-tông. Rồi em báo trước cho chủ nhà ạ.' },
        { who: '{試験官|しけんかん}', role: 'examiner', text: '（{絵|え}を{見|み}せて）{壁|かべ}に{何|なに}が{掛|か}けてありますか。', ro: '(E o misete) Kabe ni nani ga kakete arimasu ka.', vi: '(Cho xem tranh) Trên tường có treo gì?' },
        { who: 'Bạn', role: 'candidate', text: '{時計|とけい}と{鏡|かがみ}が{掛|か}けてあります。{机|つくえ}の{上|うえ}には{花|はな}が{飾|かざ}ってあります。', ro: 'Tokei to kagami ga kakete arimasu. Tsukue no ue ni wa hana ga kazatte arimasu.', vi: 'Có treo đồng hồ và gương ạ. Trên bàn thì có cắm hoa.' },
        { who: '{試験官|しけんかん}', role: 'examiner', text: '{最近|さいきん}、{誰|だれ}かに{何|なに}かをしてあげましたか。', ro: 'Saikin, dareka ni nanika o shite agemashita ka.', vi: 'Gần đây em có làm gì giúp ai không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい。{新|あたら}しく{来|き}た{留学生|りゅうがくせい}に、{駅|えき}までの{道|みち}を{教|おし}えてあげました。とても{喜|よろこ}んでくれました。', ro: 'Hai. Atarashiku kita ryuugakusei ni, eki made no michi o oshiete agemashita. Totemo yorokonde kuremashita.', vi: 'Có ạ. Em đã chỉ đường ra ga cho một du học sinh mới sang. Bạn ấy rất vui.' },
      ],
    },
    { t: 'h', text: 'できる！ — Kể 1 phút: "Lần chuyển nhà của tôi"' },
    {
      t: 'table',
      caption: 'Khung bài nói 1 phút — 5 câu là đủ, mỗi câu một mẫu',
      head: ['Phần', 'Nói gì', 'Câu mẫu', 'Romaji'],
      rows: [
        ['Mở', 'khi nào, chuyển từ đâu đến đâu', '{去年|きょねん}の{春|はる}、{寮|りょう}からアパートに{引|ひ}っ{越|こ}しました。', 'Kyonen no haru, ryou kara apaato ni hikkoshimashita.'],
        ['Chuẩn bị', 'đã làm sẵn gì (～ておきました)', '{一週間前|いっしゅうかんまえ}から{荷物|にもつ}を{箱|はこ}に{入|い}れておきました。', 'Isshuukan mae kara nimotsu o hako ni irete okimashita.'],
        ['Được giúp', 'ai giúp việc gì (～てくれました／～てもらいました)', '{友達|ともだち}が{車|くるま}を{貸|か}してくれて、{重|おも}い{家具|かぐ}も{運|はこ}んでくれました。', 'Tomodachi ga kuruma o kashite kurete, omoi kagu mo hakonde kuremashita.'],
        ['Phòng mới', 'phòng bây giờ thế nào (～てあります)', '{今|いま}、{部屋|へや}の{壁|かべ}には{家族|かぞく}の{写真|しゃしん}が{飾|かざ}ってあります。', 'Ima, heya no kabe ni wa kazoku no shashin ga kazatte arimasu.'],
        ['Kết', 'cảm nghĩ + ý định', '{大変|たいへん}でしたが、{助|たす}けてもらって、うれしかったです。{今度|こんど}は{私|わたし}が{手伝|てつだ}ってあげたいです。', 'Taihen deshita ga, tasukete moratte, ureshikatta desu. Kondo wa watashi ga tetsudatte agetai desu.'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nói 1 phút cho đủ giờ và đủ điểm',
      items: [
        'Nói chậm, rõ: 5 câu trên đọc vừa khoảng **40–50 giây**; thêm 1–2 câu chi tiết (thùng có ghi gì, hàng xóm thế nào) là đủ 1 phút.',
        'Mỗi phần **một mẫu của bài**: giám khảo nghe thấy ～ておきました, ～てくれました, ～てあります là cộng điểm ngữ pháp.',
        'Chưa từng chuyển nhà? Kể lần **dọn phòng / chuyển chỗ ngồi / chuẩn bị đi du học**: {日本|にほん}に{来|く}る{前|まえ}に、{何|なに}を{用意|ようい}しておきましたか — vẫn dùng đủ ba mẫu.',
      ],
    },
    {
      t: 'note',
      title: 'Đọc to (Reading 40 điểm) — đoạn mẫu 30 giây',
      items: [
        '{先週|せんしゅう}の{土曜日|どようび}に{引|ひ}っ{越|こ}しをしました。{前|まえ}の{日|ひ}までに{荷物|にもつ}を{全部|ぜんぶ}{箱|はこ}に{入|い}れておいたので、{朝|あさ}から{運|はこ}ぶだけでした。{友達|ともだち}が{車|くるま}を{貸|か}してくれて、{重|おも}い{物|もの}も{運|はこ}んでくれました。{新|あたら}しい{部屋|へや}には、{大家|おおや}さんの{手紙|てがみ}が{置|お}いてありました。',
        'Romaji: Senshuu no doyoubi ni hikkoshi o shimashita. Mae no hi made ni nimotsu o zenbu hako ni irete oita node, asa kara hakobu dake deshita. Tomodachi ga kuruma o kashite kurete, omoi mono mo hakonde kuremashita. Atarashii heya ni wa, ooya-san no tegami ga oite arimashita.',
        'Nghĩa: Thứ Bảy tuần trước tôi chuyển nhà. Vì đã cho hết đồ vào thùng từ hôm trước nên sáng ra chỉ việc khuân. Bạn tôi cho mượn xe và khuân cả đồ nặng giúp tôi. Trong phòng mới có để sẵn lá thư của chủ nhà.',
        'Chỗ dễ vấp: **{入|い}れておいたので** (i-re-te-o-i-ta-no-de — liền một hơi), **{貸|か}してくれて** (ka-shi-te-ku-re-te), **{運|はこ}んでくれました** (ha-kon-de — ん giữ 1 nhịp), **{置|お}いてありました** (o-i-te-a-ri-ma-shi-ta).',
      ],
    },
    {
      t: 'speak',
      id: 'b18-noi-ghi-am',
      part: '1',
      questions: [
        'ひっこしした ことが ありますか。だれが てつだって くれましたか。',
        'こまった とき、だれに たすけて もらいますか。',
        'さいきん、だれかに なにかを して あげましたか。',
        'あなたの へやに なにが かざって ありますか。',
        'りょこうの まえに、いつも なにを して おきますか。',
        'あなたの ひっこしの はなしを 1ぷんで して ください。',
      ],
    },
  ],
};

/* ═══════════════════════════ 8. VIẾT ═══════════════════════════ */

const VIET: Lesson = {
  id: 'b18-viet',
  kind: 'writing',
  title: 'Viết — email cảm ơn bạn đã giúp chuyển nhà (150–200 chữ) và đoạn "Căn phòng mới của tôi"',
  goal: 'Viết email 150–200 chữ cảm ơn bạn đã giúp chuyển nhà, có đủ ～てくれて、ありがとう, ～てくれたので／～てもらって, ～ておきました, ～てあります và lời mời đáp lễ; viết đoạn ngắn tả căn phòng mới bằng ～てあります — tự chấm theo 5 tiêu chí.',
  minutes: 40,
  blocks: [
    {
      t: 'p',
      text: 'Đề chính: **{引|ひ}っ{越|こ}しを{手伝|てつだ}ってくれた{友達|ともだち}へのお{礼|れい}のメール**, **150–200 chữ**, thể です／ます. Đề phụ: 「わたしの{新|あたら}しい{部屋|へや}」 (~100 chữ). Bài viết N4 chấm **đúng khuôn + dùng được mẫu vừa học**: mỗi đoạn một mẫu là đủ điểm ngữ pháp. Viết vào vở hoặc gõ ra, rồi so với bài mẫu và tự chấm theo bảng cuối mục.',
    },
    {
      t: 'table',
      caption: 'Dàn ý email cảm ơn — 5 phần',
      head: ['Phần', 'Viết gì', 'Mẫu câu', 'Romaji'],
      rows: [
        ['件名 (tiêu đề)', 'ngắn, nói rõ việc', '{引|ひ}っ{越|こ}しのお{礼|れい}', 'Hikkoshi no orei'],
        ['① Mở đầu + cảm ơn', 'gọi tên, cảm ơn ngay câu đầu', '{昨日|きのう}は{引|ひ}っ{越|こ}しを{手伝|てつだ}ってくれて、ありがとう。', 'Kinou wa hikkoshi o tetsudatte kurete, arigatou.'],
        ['② Chuyện cụ thể', 'bạn đã làm gì giúp mình, mình đỡ thế nào', '{重|おも}い{家具|かぐ}を{運|はこ}んでくれたので、{本当|ほんとう}に{助|たす}かりました。', 'Omoi kagu o hakonde kureta node, hontou ni tasukarimashita.'],
        ['③ Phòng bây giờ', 'đã dọn xong gì, phòng thế nào (～ておきました／～てあります)', '{本|ほん}はもう{本棚|ほんだな}に{並|なら}べてあります。', 'Hon wa mou hondana ni narabete arimasu.'],
        ['④ Đáp lễ + mời', 'mời đến chơi, ăn cơm (お{礼|れい}に～)', 'お{礼|れい}に{晩|ばん}ご{飯|はん}を{作|つく}りたいので、{来週|らいしゅう}{遊|あそ}びに{来|き}てください。', 'Orei ni bangohan o tsukuritai node, raishuu asobi ni kite kudasai.'],
        ['⑤ Kết', 'câu chào cuối + tên', 'これからもよろしくね。／リン', 'Korekara mo yoroshiku ne. / Rin'],
      ],
    },
    { t: 'h', text: 'Bài mẫu (~200 chữ phần thân)' },
    {
      t: 'passage',
      title: '{件名|けんめい}：{引|ひ}っ{越|こ}しのお{礼|れい}',
      paras: [
        { text: 'マルコさん、アンナさん' },
        { text: '{土曜日|どようび}は{引|ひ}っ{越|こ}しを{手伝|てつだ}ってくれて、{本当|ほんとう}にありがとうございました。{二人|ふたり}が{重|おも}い{本棚|ほんだな}や{箱|はこ}を{運|はこ}んでくれたので、{昼|ひる}までに{全部|ぜんぶ}{終|お}わりました。' },
        { text: 'あのあと、{本|ほん}を{棚|たな}に{並|なら}べて、{服|ふく}も{押|お}し{入|い}れにしまっておきました。アンナさんが{掛|か}けてくれた{鏡|かがみ}は、{玄関|げんかん}の{壁|かべ}に{掛|か}けてあります。' },
        { text: 'お{礼|れい}に{国|くに}の{料理|りょうり}を{作|つく}りたいので、{来週|らいしゅう}の{土曜日|どようび}、{遊|あそ}びに{来|き}てくれませんか。{飲|の}み{物|もの}は{冷|ひ}やしておきますから、{何|なに}も{持|も}ってこなくてもいいですよ。' },
        { text: 'これからもよろしくお{願|ねが}いします。' },
        { text: 'リン' },
      ],
    },
    {
      t: 'note',
      title: 'Phân tích bài mẫu — mẫu nào ở đâu',
      items: [
        '**～てくれて、ありがとうございました** (câu cảm ơn mở đầu) · **{運|はこ}んでくれたので、…{終|お}わりました** (くれる + lý do) · **{掛|か}けてくれた{鏡|かがみ}** (くれる bổ nghĩa cho danh từ — ポイント 109).',
        '**しまっておきました** (～ておく — dọn cho xong) · **{冷|ひ}やしておきますから** (～ておく — chuẩn bị trước cho buổi mời).',
        '**{壁|かべ}に{掛|か}けてあります** (～てある — trạng thái hiện tại của tấm gương).',
        '**{来|き}てくれませんか** (lời mời / nhờ — bạn bè ngang hàng) · **{持|も}ってこなくてもいいです** (ôn ポイント 116).',
        'Email cho bạn thân có thể dùng thể thường (ありがとう、{来|き}てね); bài thi N4 thì giữ **です／ます** cho an toàn.',
      ],
    },
    { t: 'h', text: 'Đề phụ — 「わたしの{新|あたら}しい{部屋|へや}」 (~100 chữ)' },
    {
      t: 'p',
      text: 'Tả căn phòng của bạn (thật hoặc tưởng tượng) bằng **ít nhất 4 câu ～てあります**, thêm 1 câu ～ておきました và 1 câu cảm nghĩ. Câu mẫu bên dưới — thay đồ vật và chỗ của bạn.',
    },
    {
      t: 'examples',
      items: [
        E('{私|わたし}の{部屋|へや}は{二階|にかい}にあって、{窓|まど}から{庭|にわ}が{見|み}えます。', 'Watashi no heya wa nikai ni atte, mado kara niwa ga miemasu.', 'Phòng tôi ở tầng 2, từ cửa sổ nhìn thấy sân vườn.'),
        E('{窓|まど}の{横|よこ}に{本棚|ほんだな}が{置|お}いてあります。', 'Mado no yoko ni hondana ga oite arimasu.', 'Cạnh cửa sổ có kê giá sách.'),
        E('{壁|かべ}には{家族|かぞく}の{写真|しゃしん}が{貼|は}ってあります。', 'Kabe ni wa kazoku no shashin ga hatte arimasu.', 'Trên tường có dán ảnh gia đình.'),
        E('{机|つくえ}の{上|うえ}に{小|ちい}さい{花|はな}が{飾|かざ}ってあります。', 'Tsukue no ue ni chiisai hana ga kazatte arimasu.', 'Trên bàn có cắm một bông hoa nhỏ.'),
        E('{冷蔵庫|れいぞうこ}にはごみの{日|ひ}の{表|ひょう}が{貼|は}ってあります。', 'Reizouko ni wa gomi no hi no hyou ga hatte arimasu.', 'Trên tủ lạnh có dán bảng lịch đổ rác.'),
        E('{冬|ふゆ}の{服|ふく}はもう{押|お}し{入|い}れにしまっておきました。', 'Fuyu no fuku wa mou oshiire ni shimatte okimashita.', 'Quần áo mùa đông tôi đã cất vào tủ rồi.'),
        E('{狭|せま}いですが、{好|す}きな{物|もの}がたくさんあって、{落|お}ち{着|つ}く{部屋|へや}です。', 'Semai desu ga, suki na mono ga takusan atte, ochitsuku heya desu.', 'Phòng chật nhưng có nhiều thứ tôi thích, là căn phòng làm tôi thấy dễ chịu.'),
      ],
    },
    {
      t: 'quiz',
      id: 'b18-viet-cau',
      title: 'Viết từng câu cho bài của bạn — dịch Việt → Nhật (6 câu)',
      kind: 'translate',
      grammar: '～てくれて、ありがとう · ～てくれたので · ～てもらいました · ～ておきました · ～てあります',
      items: [
        { q: 'Cảm ơn cậu đã giúp mình chuyển nhà.', answers: V('{引|ひ}っ{越|こ}しを{手伝|てつだ}ってくれて、ありがとう。', '{引|ひ}っ{越|こ}しを{手伝|てつだ}ってくれて、ありがとうございました。'), hint: 'てつだって くれて' },
        { q: 'Cậu cho mượn xe nên mình đỡ quá.', answers: V('{車|くるま}を{貸|か}してくれたので、{助|たす}かりました。', '{車|くるま}を{貸|か}してくれて、{助|たす}かりました。'), hint: 'かして くれたので · たすかりました' },
        { q: 'Tôi đã nhờ chủ nhà sửa cửa.', answers: V('{大家|おおや}さんにドアを{直|なお}してもらいました。'), hint: 'おおやさんに · なおして もらいました' },
        { q: 'Tôi đã cất sẵn quần áo vào tủ âm tường.', answers: V('{服|ふく}を{押|お}し{入|い}れにしまっておきました。', '{服|ふく}は{押|お}し{入|い}れにしまっておきました。'), hint: 'おしいれに · しまって おきました' },
        { q: 'Trên tường có treo gương.', answers: V('{壁|かべ}に{鏡|かがみ}が{掛|か}けてあります。', '{鏡|かがみ}が{壁|かべ}に{掛|か}けてあります。'), hint: 'かべに · かけて あります' },
        { q: 'Tuần sau đến nhà mình chơi được không?', answers: V('{来週|らいしゅう}、{遊|あそ}びに{来|き}てくれませんか。', '{来週|らいしゅう}、{遊|あそ}びに{来|き}てくれない？', '{来週|らいしゅう}、うちに{遊|あそ}びに{来|き}てくれませんか。'), hint: 'あそびに きて くれませんか' },
      ],
    },
    {
      t: 'note',
      title: 'Tự chấm — 5 tiêu chí (mỗi tiêu chí 2 điểm, tổng 10)',
      items: [
        '**① Khuôn** — đủ 5 phần: tiêu đề → cảm ơn → chuyện cụ thể → phòng bây giờ → mời + kết.',
        '**② Mẫu của bài** — có ít nhất 4 trong 5: ～てくれる, ～てもらう, ～てあげる (nếu hợp), ～ておく, ～てある (mỗi mẫu dùng đúng = điểm).',
        '**③ Hướng & trợ từ** — người làm + が với くれる, + に với もらう; ～てある có vật + が; ～ておく có tân ngữ + を.',
        '**④ Nội dung cụ thể** — nói rõ ai làm việc gì (khuân giá sách, treo gương), ít nhất 1 chi tiết thời gian / con số.',
        '**⑤ Độ dài & văn phong** — 150–200 chữ, toàn thể です／ます, chữ Hán đã học viết bằng chữ Hán ({箱|はこ}, {家具|かぐ}, {連絡|れんらく}, {助|たす}かりました, お{礼|れい}…).',
      ],
    },
  ],
};

/* ═══════════════════════════ 9. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b18-bai-tap',
  kind: 'homework',
  title: 'Bài tập Bài 18 — dịch, trắc nghiệm, ghép câu, đổi câu (có đáp án)',
  goal: 'Tự kiểm tra toàn bộ Bài 18: dịch Việt → Nhật có ～てあげる／～てくれる／～てもらう／～ていただけませんか／～ておく／～てある, chọn đúng hướng cho – nhận và đúng trợ từ, phân biệt ～ている・～てある・～ておく, ghép câu đúng trật tự và đổi câu theo mẫu — mục tiêu ≥ 85%.',
  minutes: 50,
  blocks: [
    {
      t: 'note',
      title: 'Cách làm',
      items: [
        'Làm sau khi xong 8 mục cốt lõi. Gõ đáp án bằng kana hoặc chữ Hán đều được; dấu câu và dấu cách không tính.',
        'Sai câu nào thì mở lại đúng mục: hướng cho – nhận → Ngữ pháp ① (bảng "Ba hướng"); nhờ vả → ①d; ～ておく → ②; ～てある và bảng năm câu cửa sổ → ③; cặp tự / tha → bảng cuối mục Từ vựng.',
        'Mục tiêu: **≥ 85%** trước khi sang Bài 19.',
      ],
    },
    {
      t: 'quiz',
      id: 'b18-bt-dich',
      title: 'I. Dịch Việt → Nhật (14 câu)',
      kind: 'translate',
      grammar: '～てあげる · ～てくれる · ～てもらう · ～てくれませんか／～てもらえませんか／～ていただけませんか · ～ておく · ～てある',
      items: [
        { q: 'Tôi đã khuân đồ giúp Lin.', answers: V('{私|わたし}はリンさんの{荷物|にもつ}を{運|はこ}んであげました。', 'リンさんの{荷物|にもつ}を{運|はこ}んであげました。'), hint: 'リンさんの にもつ · はこんで あげました' },
        { q: 'Nattapon đã cho tôi mượn xe.', answers: V('ナタポンさんが{車|くるま}を{貸|か}してくれました。', 'ナタポンさんが{私|わたし}に{車|くるま}を{貸|か}してくれました。'), hint: 'ナタポンさんが · かして くれました' },
        { q: 'Tôi được cô Yamaguchi chỉ cách đổ rác.', answers: V('{山口|やまぐち}さんにごみの{出|だ}し{方|かた}を{教|おし}えてもらいました。', '{私|わたし}は{山口|やまぐち}さんにごみの{出|だ}し{方|かた}を{教|おし}えてもらいました。'), hint: 'やまぐちさんに · おしえて もらいました' },
        { q: 'Mẹ đã gửi đồ từ quê sang cho tôi.', answers: V('{母|はは}が{国|くに}から{荷物|にもつ}を{送|おく}ってくれました。'), hint: 'ははが · おくって くれました' },
        { q: 'Giúp mình một chút được không? (với bạn)', answers: V('ちょっと{手伝|てつだ}ってくれませんか。', 'ちょっと{手伝|てつだ}ってくれない？', 'ちょっと{手伝|てつだ}ってくれる？', 'ちょっと{手伝|てつだ}ってもらえませんか。'), hint: 'てつだって くれませんか' },
        { q: 'Thầy xem giúp em bài văn được không ạ? (rất lịch sự)', answers: V('{先生|せんせい}、{作文|さくぶん}を{見|み}ていただけませんか。', '{作文|さくぶん}を{見|み}ていただけませんか。'), hint: 'みて いただけませんか' },
        { q: 'Cảm ơn cậu đã đến.', answers: V('{来|き}てくれて、ありがとう。', '{来|き}てくれて、ありがとうございます。'), hint: 'きて くれて' },
        { q: 'Trước khi chuyển nhà, tôi gom sẵn thùng các-tông.', answers: V('{引|ひ}っ{越|こ}しの{前|まえ}に、{段|だん}ボールを{集|あつ}めておきます。', '{引|ひ}っ{越|こ}しの{前|まえ}に、{段|だん}ボールを{集|あつ}めておきました。'), hint: 'まえに · あつめて おきます' },
        { q: 'Nóng nên cứ để cửa sổ mở nhé.', answers: V('{暑|あつ}いので、{窓|まど}を{開|あ}けておいてください。', '{暑|あつ}いから、{窓|まど}を{開|あ}けておいてください。', '{暑|あつ}いので、{窓|まど}は{開|あ}けておいてください。'), hint: 'あけて おいて ください' },
        { q: 'Tôi sẽ báo trước cho chủ nhà.', answers: V('{大家|おおや}さんに{連絡|れんらく}しておきます。'), hint: 'れんらく して おきます' },
        { q: 'Trên tường có dán bản đồ.', answers: V('{壁|かべ}に{地図|ちず}が{貼|は}ってあります。', '{地図|ちず}が{壁|かべ}に{貼|は}ってあります。'), hint: 'かべに · はって あります' },
        { q: 'Chìa khoá đã được cất trong ngăn kéo.', answers: V('{鍵|かぎ}は{引|ひ}き{出|だ}しに{入|い}れてあります。', '{鍵|かぎ}は{引|ひ}き{出|だ}しの{中|なか}に{入|い}れてあります。'), hint: 'かぎは ひきだしに いれて あります' },
        { q: 'Khách sạn thì đã đặt sẵn rồi.', answers: V('ホテルはもう{予約|よやく}してあります。', 'ホテルはもう{予約|よやく}しておきました。'), hint: 'もう よやく して あります' },
        { q: 'Cửa sổ đang mở. (chỉ tả trạng thái)', answers: V('{窓|まど}が{開|あ}いています。'), hint: 'tự động từ 開く + ています' },
      ],
    },
    {
      t: 'mcq',
      id: 'b18-bt-chon',
      title: 'II. Chọn đáp án đúng (14 câu)',
      items: [
        { q: '{友達|ともだち}が{駅|えき}まで{送|おく}って（　）。', options: ['くれました', 'あげました', 'もらいました', 'ありました'], correct: 0, why: 'Bạn (が) làm cho tôi → **くれました**. 〔Tomodachi ga eki made okutte kuremashita.〕' },
        { q: '{私|わたし}は{兄|あに}（　）{自転車|じてんしゃ}を{直|なお}してもらいました。', options: ['に', 'が', 'を', 'で'], correct: 0, why: 'Câu もらう: người làm + **に**. 〔Watashi wa ani ni jitensha o naoshite moraimashita.〕' },
        { q: '{子|こ}どもに{絵本|えほん}を{読|よ}んで（　）。', options: ['くれました', 'あげました', 'もらいました', 'おきました'], correct: 1, why: 'Tôi đọc cho con → **あげました**. 〔Kodomo ni ehon o yonde agemashita.〕' },
        { q: '{先生|せんせい}、すみませんが、{推薦状|すいせんじょう}を{書|か}いて（　）。', options: ['くれ', 'あげませんか', 'いただけませんか', 'おきませんか'], correct: 2, why: 'Nhờ thầy (người trên) → **～ていただけませんか**. くれ là mệnh lệnh thô. 〔Suisenjou o kaite itadakemasen ka.〕' },
        { q: 'A「{荷物|にもつ}、{重|おも}いでしょう。」B「ありがとう。じゃ、{一|ひと}つ{持|も}って（　）？」', options: ['くれる', 'あげる', 'もらう', 'おく'], correct: 0, why: 'Nhờ bạn làm cho mình (thân mật) → **{持|も}ってくれる？** 〔Ja, hitotsu motte kureru?〕' },
        { q: '{来週|らいしゅう}{試験|しけん}があるので、{今|いま}から{勉強|べんきょう}して（　）。', options: ['あります', 'おきます', 'います', 'くれます'], correct: 1, why: 'Làm trước để chuẩn bị → **～ておきます**. 〔Ima kara benkyou shite okimasu.〕' },
        { q: '{会議|かいぎ}の{前|まえ}に、{椅子|いす}を{並|なら}べて（　）ください。', options: ['あって', 'おいて', 'いて', 'あげて'], correct: 1, why: 'Dặn làm sẵn → **～ておいてください**. 〔Isu o narabete oite kudasai.〕' },
        { q: 'ドアの{前|まえ}に{自転車|じてんしゃ}が{止|と}めて（　）。', options: ['あります', 'おきます', 'います', 'くれます'], correct: 0, why: 'Vật + が + tha động từ {止|と}める → **～てあります** (ai đó đã dựng). 〔Doa no mae ni jitensha ga tomete arimasu.〕' },
        { q: '{電気|でんき}が（　）います。{消|け}しましょうか。', options: ['つけて', 'ついて', 'つけ', 'つき'], correct: 1, why: 'Tả trạng thái bằng ～ています → tự động từ **つく → ついて**. 〔Denki ga tsuite imasu.〕' },
        { q: 'この{紙|かみ}にごみの{出|だ}し{方|かた}が（　）。', options: ['{書|か}いています', '{書|か}いてあります', '{書|か}いておきます', '{書|か}いてくれます'], correct: 1, why: 'Chữ trên giấy (trạng thái) → **{書|か}いてあります**. {書|か}いています = (ai đó) đang viết. 〔Kami ni gomi no dashikata ga kaite arimasu.〕' },
        { q: '{窓|まど}が（　）あります。{部屋|へや}の{空気|くうき}を{入|い}れ{替|か}えているんです。', options: ['{開|あ}いて', '{開|あ}けて', '{開|あ}けておいて', '{開|あ}いておいて'], correct: 1, why: '～てある chỉ đi với **tha** động từ: **{開|あ}けて**あります (cố ý mở để thay không khí). 〔Mado ga akete arimasu.〕' },
        { q: '{借|か}りた{本|ほん}は{明日|あした}までに（　）ください。', options: ['{戻|もど}って', '{返|かえ}して', '{帰|かえ}って', '{届|とど}いて'], correct: 1, why: 'Trả đồ đã mượn → **{返|かえ}す**. 〔Karita hon wa ashita made ni kaeshite kudasai.〕' },
        { q: '{山口|やまぐち}さんが{駅前|えきまえ}のスーパーに（　）くれました。', options: ['{持|も}っていって', '{連|つ}れていって', '{届|とど}けて', '{寄|よ}って'], correct: 1, why: 'Dẫn NGƯỜI (tôi) đi → **{連|つ}れていって**くれました. 〔Suupaa ni tsurete itte kuremashita.〕' },
        { q: '{引|ひ}っ{越|こ}してきたら、{隣|となり}の{人|ひと}に「これからお（　）になります」と{言|い}います。', options: ['{世話|せわ}', '{礼|れい}', '{宅|たく}', '{留守|るす}'], correct: 0, why: 'Câu chào cố định: **これからお{世話|せわ}になります**. 〔Korekara osewa ni narimasu.〕' },
      ],
    },
    {
      t: 'build',
      id: 'b18-bt-ghep',
      title: 'III. Ghép câu (8 câu)',
      items: [
        { vi: 'Chủ nhà đã sửa cửa cho tôi.', chips: ['{大家|おおや}さんが', 'ドアを', '{直|なお}して', 'くれました', 'あげました', '{大家|おおや}さんに'], answer: ['{大家|おおや}さんが', 'ドアを', '{直|なお}して', 'くれました'], ro: 'Ooya-san ga doa o naoshite kuremashita.' },
        { vi: 'Tôi nhờ bạn người Nhật sửa giúp email.', chips: ['{日本人|にほんじん}の', '{友達|ともだち}に', 'メールを', '{直|なお}して', 'もらいました', 'くれました', '{友達|ともだち}が'], answer: ['{日本人|にほんじん}の', '{友達|ともだち}に', 'メールを', '{直|なお}して', 'もらいました'], alt: [['メールを', '{日本人|にほんじん}の', '{友達|ともだち}に', '{直|なお}して', 'もらいました']], ro: 'Nihonjin no tomodachi ni meeru o naoshite moraimashita.' },
        { vi: 'Bạn chụp giúp tôi tấm ảnh được không ạ?', chips: ['すみません', '{写真|しゃしん}を', '{撮|と}って', 'もらえませんか', 'あげませんか', '{撮|と}りて'], answer: ['すみません', '{写真|しゃしん}を', '{撮|と}って', 'もらえませんか'], ro: 'Sumimasen, shashin o totte moraemasen ka.' },
        { vi: 'Tôi đã ướp lạnh sẵn bia trong tủ.', chips: ['{冷蔵庫|れいぞうこ}に', 'ビールを', '{冷|ひ}やして', 'おきました', 'ありました', 'ビールが'], answer: ['{冷蔵庫|れいぞうこ}に', 'ビールを', '{冷|ひ}やして', 'おきました'], alt: [['ビールを', '{冷蔵庫|れいぞうこ}に', '{冷|ひ}やして', 'おきました']], ro: 'Reizouko ni biiru o hiyashite okimashita.' },
        { vi: 'Thùng thì cứ để nguyên như vậy.', chips: ['{箱|はこ}は', 'そのままに', 'して', 'おいてください', 'あってください', 'しまって'], answer: ['{箱|はこ}は', 'そのままに', 'して', 'おいてください'], ro: 'Hako wa sono mama ni shite oite kudasai.' },
        { vi: 'Trên kệ có bày ảnh gia đình.', chips: ['{棚|たな}の{上|うえ}に', '{家族|かぞく}の', '{写真|しゃしん}が', '{飾|かざ}って', 'あります', '{写真|しゃしん}を', 'おきます'], answer: ['{棚|たな}の{上|うえ}に', '{家族|かぞく}の', '{写真|しゃしん}が', '{飾|かざ}って', 'あります'], ro: 'Tana no ue ni kazoku no shashin ga kazatte arimasu.' },
        { vi: 'Chủ nhà đã chuẩn bị sẵn tủ lạnh cho tôi.', chips: ['{大家|おおや}さんが', '{冷蔵庫|れいぞうこ}を', '{用意|ようい}して', 'おいて', 'くれました', 'あって', 'あげました'], answer: ['{大家|おおや}さんが', '{冷蔵庫|れいぞうこ}を', '{用意|ようい}して', 'おいて', 'くれました'], ro: 'Ooya-san ga reizouko o youi shite oite kuremashita.' },
        { vi: 'Lúc khó khăn, bạn bè đã giúp tôi.', chips: ['{困|こま}った', 'とき', '{友達|ともだち}が', '{助|たす}けて', 'くれました', '{助|たす}かって', 'もらいました'], answer: ['{困|こま}った', 'とき', '{友達|ともだち}が', '{助|たす}けて', 'くれました'], ro: 'Komatta toki, tomodachi ga tasukete kuremashita.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b18-bt-doi',
      title: 'IV. Đổi câu theo yêu cầu (8 câu)',
      kind: 'fill',
      grammar: 'くれる ↔ もらう · ～ておいた → ～てある · 自動詞ている ↔ 他動詞てある · nhờ → lịch sự hơn',
      items: [
        { q: 'マルコさんが{荷物|にもつ}を{運|はこ}んでくれました。→ もらう: {私|わたし}はマルコさん（　）{荷物|にもつ}を{運|はこ}んでもらいました。', answers: ['に'], hint: 'người làm + に' },
        { q: '{山口|やまぐち}さんに{町|まち}を{案内|あんない}してもらいました。→ くれる: {山口|やまぐち}さん（　）{町|まち}を{案内|あんない}してくれました。', answers: ['が'], hint: 'người làm + が' },
        { q: '{先輩|せんぱい}に{教|おし}えてもらいました。→ くれる (cả câu)', answers: V('{先輩|せんぱい}が{教|おし}えてくれました。', '{先輩|せんぱい}が{教|おし}えてくれました'), hint: 'せんぱいが おしえて くれました' },
        { q: '{手伝|てつだ}ってくれませんか。→ lịch sự nhất (với người trên)', answers: V('{手伝|てつだ}っていただけませんか。'), hint: 'いただけませんか' },
        { q: '{私|わたし}がホテルを{予約|よやく}しておきました。→ ～てある (vật làm chủ ngữ): ホテルは（　）。', answers: V('{予約|よやく}してあります', 'もう{予約|よやく}してあります'), hint: 'よやく して あります' },
        { q: '{誰|だれ}かが{壁|かべ}にポスターを{貼|は}りました。→ trạng thái bây giờ: {壁|かべ}にポスターが（　）。', answers: V('{貼|は}ってあります'), hint: 'はって あります' },
        { q: '{窓|まど}が{開|あ}いています。→ đổi sang "có người cố ý mở": {窓|まど}が（　）。', answers: V('{開|あ}けてあります'), hint: 'tha động từ 開ける + てあります' },
        { q: '{明日|あした}{飲|の}み{物|もの}を{買|か}っておきます。→ văn nói ～とく: {明日|あした}{飲|の}み{物|もの}を（　）。', answers: V('{買|か}っとく', '{買|か}っとくね', '{買|か}っとくよ'), hint: '～ておく → ～とく' },
      ],
    },
  ],
};

/* ═══════════════════════ ② THEO BUỔI TRÊN LỚP ═══════════════════════ */

const BUOI_1: Lesson = {
  id: 'b18-buoi-1-ageru-kureru-morau',
  kind: 'review',
  title: 'Buổi 1 — Mở Bài 18: từ mới tìm phòng & nhờ vả · ～てあげる・～てくれる・～てもらう · nhờ vả lịch sự · hội thoại ①',
  goal: 'Theo nhịp một buổi trên lớp: khởi động bằng あげる・くれる・もらう với đồ vật (Bài 8), học từ tìm phòng và nhờ vả, nói đúng hướng cho – nhận một việc làm bằng ～てあげる／～てくれる／～てもらう, nhờ bạn và người trên đúng mức lịch sự, đóng vai hội thoại ①, rồi trả lời được câu giáo viên hay gọi.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 1 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Khởi động (5′)** — ôn あげる・くれる・もらう với đồ vật (Bài 8 ポイント 76–78): hôm nay chỉ cần **thêm thể て** phía trước.',
        '**Từ mới (10′)** — nhóm A (tìm phòng: {家賃|やちん}, {大家|おおや}さん, {鍵|かぎ}…) + nhóm E (nhờ vả: {頼|たの}む, {助|たす}かる, {連|つ}れていく…).',
        '**Ngữ pháp (15′)** — ba hướng: ～てあげる (tôi → người khác), ～てくれる (người khác → tôi), ～てもらう (tôi được người khác làm cho); nhờ vả 5 bậc.',
        '**Hội thoại (10′)** — ① ở căng-tin: リン kể chuyện chuyển nhà, マルコ và アンナ nhận giúp.',
        '**チャレンジ (10′)** — luyện cặp: nhờ ↔ đồng ý / từ chối khéo, kể "ai đã giúp mình". Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b18-b1-slides',
      title: 'Bài 18 引っ越し — Buổi 1: ～てあげる・～てくれる・～てもらう',
      slides: [
        {
          tieuDe: '{第18課|だいじゅうはっか} {引|ひ}っ{越|こ}し',
          anh: ['package', 'pickup-truck', 'house'],
          nhan: ['{段|だん}ボール', 'トラック', '{新|あたら}しい{部屋|へや}'],
          dong: ['Hôm nay: **cho – nhận VIỆC LÀM · ～てあげる・～てくれる・～てもらう · nhờ vả**'],
          ro: ['~te ageru · ~te kureru · ~te morau'],
          ghi: 'Bài 18 là bài "chuyển nhà". Chuyển nhà là lúc mình nhờ người khác nhiều nhất — nhờ khuân đồ, nhờ mượn xe, nhờ chỉ cách đổ rác — nên đây là bài học cách nói "ai làm giúp ai".',
        },
        {
          tieuDe: 'できること — Học xong Bài 18 làm được gì?',
          anh: ['folded-hands', 'package', 'woman-bowing'],
          nhan: ['18-1 {頼|たの}む', '18-2 {引|ひ}っ{越|こ}しの{日|ひ}', '18-3 あいさつ'],
          dong: ['① Nhờ bạn giúp chuyển nhà, nhận lời giúp người khác (～てくれませんか・～てあげます).', '② Ngày chuyển đồ: chuẩn bị sẵn (～ておく), nói đồ đã sẵn sàng thế nào (～てある).', '③ Chào hàng xóm, hỏi cách đổ rác, nhờ chủ nhà sửa đồ (～ていただけませんか).'],
          ro: ['~te kuremasen ka · ~te agemasu', '~te oku · ~te aru', '~te itadakemasen ka'],
          ghi: 'Ba buổi đi đúng ba phần này. Cuối Bài 18 bạn kể được 1 phút lần chuyển nhà của mình: ai giúp gì, mình chuẩn bị gì, phòng mới thế nào.',
        },
        {
          tieuDe: 'Khởi động — cho / nhận ĐỒ VẬT (Bài 8)',
          anh: ['wrapped-gift', 'closed-book'],
          nhan: ['{花|はな}', '{本|ほん}'],
          dong: ['{私|わたし}はアンナさんに{花|はな}をあげました。', 'アンナさんは{私|わたし}に{本|ほん}をくれました。', '{私|わたし}はアンナさんに{本|ほん}をもらいました。'],
          ro: ['Watashi wa Anna-san ni hana o agemashita.', 'Anna-san wa watashi ni hon o kuremashita.', 'Watashi wa Anna-san ni hon o moraimashita.'],
          hoi: 'Câu 2 và câu 3 nói cùng một việc. Khác nhau ở đâu?',
          dap: 'Câu 2 chủ ngữ là người CHO (アンナ) + くれる; câu 3 chủ ngữ là người NHẬN (tôi) + もらう, người cho đi với に.',
          ghi: 'Ôn ba động từ cũ thật chắc. Hôm nay KHÔNG học động từ mới — chỉ đặt thể て của một việc làm vào trước chúng.',
        },
        {
          tieuDe: '{新|あたら}しいことば ① — Tìm phòng',
          anh: ['yen-banknote', 'key', 'house', 'incoming-envelope'],
          nhan: ['{家賃|やちん}', '{鍵|かぎ}', '{二階建|にかいだ}て', '{返事|へんじ}'],
          dong: ['{大家|おおや}さんに{鍵|かぎ}をもらいました。', '{家賃|やちん}は{1か月|いっかげつ}{5万円|ごまんえん}です。'],
          ro: ['Ooya-san ni kagi o moraimashita.', 'Yachin wa ikkagetsu goman en desu.'],
          ghi: '大家 đọc おおや (chủ nhà) — đừng đọc たいか. 留守 = đi vắng, 一人暮らし = sống một mình, 不動産屋 = văn phòng nhà đất. 用意する (chuẩn bị đồ vật) ≠ 支度する (sửa soạn ngay trước mắt).',
        },
        {
          tieuDe: '{新|あたら}しいことば ② — Nhờ vả & cảm ơn',
          anh: ['folded-hands', 'relieved-face', 'smiling-face-with-smiling-eyes'],
          nhan: ['{頼|たの}みます', '{助|たす}かります', '{喜|よろこ}びます'],
          dong: ['{友達|ともだち}に{手伝|てつだ}いを{頼|たの}みました。', '{車|くるま}を{貸|か}してくれて、{助|たす}かりました。'],
          ro: ['Tomodachi ni tetsudai o tanomimashita.', 'Kuruma o kashite kurete, tasukarimashita.'],
          hoi: '"Dẫn em gái đi sở thú" và "mang đồ đến trường" — dùng 連れていく hay 持っていく?',
          dap: 'Em gái (người) → {連|つ}れていく; đồ vật → {持|も}っていく.',
          ghi: 'Nhóm E: 頼む, 助かる, 連れていく, 寄る, 戻る, 返す, 役に立つ, 喜ぶ. Nhắc: 喜ぶ tả người khác; mình vui thì nói うれしい.',
        },
        {
          tieuDe: 'Từ ĐỒ VẬT sang VIỆC LÀM — chỉ thêm thể て',
          bang: {
            head: ['', 'Đồ vật (Bài 8)', 'Việc làm (Bài 18)'],
            rows: [
              ['あげる', '{本|ほん}をあげる', '{本|ほん}を{貸|か}して**あげる**'],
              ['くれる', '{本|ほん}をくれる', '{本|ほん}を{貸|か}して**くれる**'],
              ['もらう', '{本|ほん}をもらう', '{本|ほん}を{貸|か}して**もらう**'],
            ],
          },
          ghi: 'Giáo viên viết hai cột lên bảng, gạch chân thể て. Người Nhật dùng mẫu này để nói "làm một việc như một món quà". Không có くれる, câu kể chuyện được giúp nghe lạnh lùng.',
        },
        {
          tieuDe: '① Vて あげる — tôi làm cho người khác',
          anh: ['man-student', 'package', 'woman-student'],
          nhan: ['マルコ', '{荷物|にもつ}', 'リン'],
          dong: ['マルコさんはリンさんの{荷物|にもつ}を{運|はこ}んであげました。', '{私|わたし}は{弟|おとうと}に{日本語|にほんご}を{教|おし}えてあげました。'],
          ro: ['Maruko-san wa Rin-san no nimotsu o hakonde agemashita.', 'Watashi wa otouto ni nihongo o oshiete agemashita.'],
          hoi: 'Vì sao câu 1 là リンさん**の**{荷物|にもつ}, không phải リンさん**に**?',
          dap: 'Vì {運|はこ}ぶ (khuân) không nhận người làm tân ngữ gián tiếp — đồ là của Lin nên dùng の. Luật: giữ trợ từ của động từ gốc.',
          ghi: 'Luật vàng 1: giữ trợ từ của động từ gốc. 教える: 弟に日本語を教える → 弟に教えてあげる. 手伝う: 友達を手伝う → 友達を手伝ってあげる.',
        },
        {
          tieuDe: '② Vて くれる — người khác làm cho TÔI',
          anh: ['pickup-truck', 'man-student'],
          nhan: ['{車|くるま}', 'ナタポン'],
          dong: ['ナタポンさんが{車|くるま}を{貸|か}してくれました。', '{母|はは}が{国|くに}から{荷物|にもつ}を{送|おく}ってくれました。'],
          ro: ['Natapon-san ga kuruma o kashite kuremashita.', 'Haha ga kuni kara nimotsu o okutte kuremashita.'],
          hoi: '「{私|わたし}がマルコさんを{手伝|てつだ}ってくれました」— đúng hay sai? Sửa thế nào?',
          dap: 'Sai — tôi không bao giờ là người "くれる". Sửa: {私|わたし}がマルコさんを{手伝|てつだ}ってあげました (hoặc マルコさんが{私|わたし}を{手伝|てつだ}ってくれました).',
          ghi: 'Người nhận của くれる luôn là tôi hoặc "phe tôi" (gia đình, nhóm mình) → thường bỏ 私に. Người làm đi với が.',
        },
        {
          tieuDe: '③ Vて もらう — TÔI được người khác làm cho',
          anh: ['woman-student', 'pickup-truck'],
          nhan: ['{私|わたし}', '{車|くるま}'],
          dong: ['{私|わたし}はナタポンさんに{車|くるま}を{貸|か}してもらいました。', '{不動産屋|ふどうさんや}さんに{部屋|へや}を{探|さが}してもらいました。'],
          ro: ['Watashi wa Natapon-san ni kuruma o kashite moraimashita.', "Fudousan'ya-san ni heya o sagashite moraimashita."],
          hoi: 'Đổi sang もらう: {大家|おおや}さんがドアを{直|なお}してくれました。',
          dap: '{大家|おおや}さんにドアを{直|なお}してもらいました。',
          ghi: 'Luật vàng 2: もらう → người làm + に; くれる → người làm + が. もらう hay hàm ý "tôi đã nhờ" — với dịch vụ (thợ, văn phòng nhà đất) gần như luôn dùng もらう.',
        },
        {
          tieuDe: 'Bảng ba hướng — chép vào vở',
          bang: {
            head: ['Mẫu', 'Hướng', 'Công thức'],
            rows: [
              ['～てあげる', 'tôi → người khác', '[người làm]は [người nhận]に／を ～てあげる'],
              ['～てくれる', 'người khác → tôi', '[người làm]が （{私|わたし}に） ～てくれる'],
              ['～てもらう', 'tôi ← người khác', '[tôi]は [người làm]に ～てもらう'],
            ],
          },
          hoi: 'Nói một sự việc bằng hai cách: "Anna gom thùng các-tông cho tôi".',
          dap: 'アンナさんが{段|だん}ボールを{集|あつ}めてくれました。／アンナさんに{段|だん}ボールを{集|あつ}めてもらいました。',
          ghi: 'Bảng này là câu hỏi số một của đề N4 phần ngữ pháp Bài 18. Giáo viên cho cả lớp đọc thuộc công thức.',
        },
        {
          tieuDe: '⚠ Đừng nói ～てあげます với người trên',
          anh: ['man-teacher', 'package'],
          nhan: ['{先生|せんせい}', '{荷物|にもつ}'],
          dong: ['~~{先生|せんせい}、{荷物|にもつ}を{持|も}ってあげます。~~', '{先生|せんせい}、{荷物|にもつ}を{持|も}ちましょうか。'],
          ro: ['—', 'Sensei, nimotsu o mochimashou ka.'],
          ghi: '～てあげます nói thẳng với người được giúp nghe như kể công "tôi ban ơn cho anh". Với thầy cô, người lớn tuổi → đề nghị bằng ～ましょうか. Với bạn thân, em nhỏ thì 持ってあげるよ vẫn ấm áp.',
        },
        {
          tieuDe: 'Nhờ vả — 5 bậc',
          bang: {
            head: ['Bậc', 'Câu', 'Với ai'],
            rows: [
              ['1', '{手伝|てつだ}って。', 'người nhà'],
              ['2', '{手伝|てつだ}ってくれる？／くれない？', 'bạn bè'],
              ['3', '{手伝|てつだ}ってくれませんか。', 'bạn cùng lớp'],
              ['4', '{手伝|てつだ}ってもらえませんか。', 'người chưa thân, đàn anh'],
              ['5', '{手伝|てつだ}っていただけませんか。', 'thầy cô, người lớn tuổi, khách'],
            ],
          },
          hoi: 'Bạn muốn nhờ cô hàng xóm lớn tuổi chỉ cách đổ rác. Nói thế nào?',
          dap: 'すみません、ごみの{出|だ}し{方|かた}を{教|おし}えていただけませんか。',
          ghi: 'Câu hỏi phủ định (～ませんか) mềm hơn khẳng định (～ますか). Mở đầu bằng すみませんが／あのう và nêu lý do bằng ～んですが cho tự nhiên.',
        },
        {
          tieuDe: '会話① — "Tháng sau mình chuyển nhà…"',
          anh: ['woman-student', 'man-student', 'woman-student'],
          nhan: ['リン', 'マルコ', 'アンナ'],
          dong: ['マルコ：{僕|ぼく}が{手伝|てつだ}ってあげますよ。', 'マルコ：ナタポンさんに{車|くるま}を{貸|か}してもらいましょう。', 'リン：ナタポンさん、{貸|か}してくれるでしょうか。'],
          ro: ['Boku ga tetsudatte agemasu yo.', 'Natapon-san ni kuruma o kashite moraimashou.', 'Natapon-san, kashite kureru deshou ka.'],
          hoi: 'Ai sẽ cho Lin mượn xe? Ai sẽ gom thùng các-tông?',
          dap: 'ナタポンさん cho mượn xe (マルコ hỏi giúp); アンナさん gom thùng các-tông.',
          ghi: 'Đọc hội thoại ① theo vai (3 bạn). Chú ý ba câu trên: cùng một việc mượn xe nhưng ba góc nhìn khác nhau.',
        },
        {
          tieuDe: 'チャレンジ — luyện cặp: nhờ ↔ trả lời',
          anh: ['folded-hands', 'woman-gesturing-ok', 'woman-gesturing-no'],
          nhan: ['A: {頼|たの}む', 'B: OK', 'B: {断|ことわ}る'],
          dong: ['A：{日曜日|にちようび}、{引|ひ}っ{越|こ}しを{手伝|てつだ}ってくれませんか。', 'B：いいですよ。{何時|なんじ}に{行|い}けばいいですか。', 'B：すみません、{日曜日|にちようび}はちょっと……。'],
          ro: ['Nichiyoubi, hikkoshi o tetsudatte kuremasen ka.', 'Ii desu yo. Nanji ni ikeba ii desu ka.', 'Sumimasen, nichiyoubi wa chotto…….'],
          hoi: 'Đổi vai. A nhờ: (1) cho mượn từ điển (2) chụp ảnh (3) chỉ đường ra ga (4) dẫn đi siêu thị.',
          dap: '(1) {辞書|じしょ}を{貸|か}してくれませんか (2) {写真|しゃしん}を{撮|と}ってくれませんか (3) {駅|えき}までの{道|みち}を{教|おし}えてくれませんか (4) スーパーに{連|つ}れていってくれませんか',
          ghi: 'Từ chối khéo: すみません、～はちょっと…… (bỏ lửng). Không nói thẳng いやです.',
        },
        {
          tieuDe: 'Câu hỏi cuối buổi 1',
          hoi: '(1) Đổi sang もらう: {友達|ともだち}が{写真|しゃしん}を{撮|と}ってくれました。 (2) Nhờ thầy xem bài (rất lịch sự). (3) Cảm ơn bạn đã đến.',
          dap: '(1) {友達|ともだち}に{写真|しゃしん}を{撮|と}ってもらいました。 (2) {先生|せんせい}、{作文|さくぶん}を{見|み}ていただけませんか。 (3) {来|き}てくれて、ありがとう。',
          ghi: 'Về nhà: học thuộc 21 từ nhóm A + E, viết 5 câu "ai đã giúp tôi" bằng ～てくれました.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Khởi động: あげる・くれる・もらう với đồ vật' },
    {
      t: 'p',
      text: 'Giáo viên giơ một quyển sách, đưa cho một bạn: 「{私|わたし}は○○さんに{本|ほん}を＿＿」 (あげました). Rồi hỏi bạn đó: 「○○さん、{先生|せんせい}は？」 → 「{先生|せんせい}が{本|ほん}を＿＿」 (くれました) / 「{先生|せんせい}に{本|ほん}を＿＿」 (もらいました). Sau đó giáo viên **mở sách cho bạn đó xem**: "Hôm nay mình học khi thứ được cho là một **việc làm**: {本|ほん}を**{見|み}せてあげました**."',
    },
    {
      t: 'mcq',
      id: 'b18-b1-khoi-dong',
      title: 'Khởi động — ôn cho / nhận đồ vật và thể て (4 câu)',
      items: [
        { q: '{私|わたし}は{友達|ともだち}に{誕生日|たんじょうび}のプレゼントを（　）。', options: ['あげました', 'くれました', 'もらいました', 'ありました'], correct: 0, why: 'Tôi cho bạn → **あげました** (ポイント 76). 〔Tomodachi ni tanjoubi no purezento o agemashita.〕' },
        { q: '{母|はは}が{私|わたし}に{時計|とけい}を（　）。', options: ['あげました', 'くれました', 'もらいました', 'やりました'], correct: 1, why: 'Người khác (mẹ, が) cho TÔI → **くれました** (ポイント 78). 〔Haha ga watashi ni tokei o kuremashita.〕' },
        { q: '「{運|はこ}びます」の{て形|てけい}は？', options: ['{運|はこ}びて', '{運|はこ}んで', '{運|はこ}って', '{運|はこ}いて'], correct: 1, why: 'ぶ → **んで**: {運|はこ}んで. Hôm nay sẽ gắn ngay: {運|はこ}んであげる／くれる／もらう.' },
        { q: '「{貸|か}します」の{て形|てけい}は？', options: ['{貸|か}って', '{貸|か}いて', '{貸|か}して', '{貸|か}んで'], correct: 2, why: 'す → **して**: {貸|か}して → {貸|か}してくれる.' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Từ mới: tờ tin cho thuê phòng' },
    {
      t: 'table',
      caption: 'Giáo viên dán một tờ tin cho thuê phòng lên bảng và gạch chân từ mới',
      head: ['Trên tờ tin', 'Đọc', 'Nghĩa'],
      rows: [
        ['さくらハイツ　**{二階建|にかいだ}て**の{2階|にかい}', 'nikaidate', 'dãy nhà 2 tầng, phòng ở tầng 2'],
        ['**{家賃|やちん}**　{48,000円|よんまんはっせんえん}／{月|つき}', 'yachin', 'tiền thuê mỗi tháng'],
        ['**{家具付|かぐつ}き**（ベッド・{机|つくえ}）', 'kagutsuki', 'có sẵn nội thất'],
        ['{駅|えき}から{徒歩|とほ}{7分|ななふん}　{一人暮|ひとりぐ}らしに{最適|さいてき}！', 'hitorigurashi', 'hợp sống một mình'],
        ['**{大家|おおや}さん**が{近|ちか}くに{住|す}んでいます', 'ooya-san', 'chủ nhà ở gần'],
        ['お{問|と}い{合|あ}わせ：さくら**{不動産|ふどうさん}**', "fudousan('ya)", 'liên hệ: văn phòng nhà đất Sakura'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{不動産屋|ふどうさんや}で{部屋|へや}を{探|さが}しています。', "Fudousan'ya de heya o sagashite imasu.", 'Tôi đang tìm phòng ở văn phòng nhà đất.'),
        E('{大家|おおや}さんにメールを{送|おく}りましたが、まだ{返事|へんじ}がありません。', 'Ooya-san ni meeru o okurimashita ga, mada henji ga arimasen.', 'Tôi đã gửi mail cho chủ nhà nhưng chưa có hồi âm.'),
        E('{明日|あした}は{留守|るす}にします。', 'Ashita wa rusu ni shimasu.', 'Mai tôi đi vắng.'),
        E('{一人暮|ひとりぐ}らしは{初|はじ}めてです。', 'Hitorigurashi wa hajimete desu.', 'Đây là lần đầu tôi sống một mình.'),
      ],
    },
    { t: 'h', text: 'Slide 3 — Ba hướng: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b18-b1-chia',
      title: 'Luyện nhanh — chọn あげる／くれる／もらう và chia (8 câu)',
      kind: 'fill',
      items: [
        { q: 'マルコさんが{私|わたし}の{荷物|にもつ}を{運|はこ}んで（　）。(quá khứ)', answers: ['くれました'] },
        { q: '{私|わたし}はアンナさんに{段|だん}ボールを{集|あつ}めて（　）。(quá khứ)', answers: ['もらいました'] },
        { q: '{私|わたし}は{妹|いもうと}に{絵本|えほん}を{読|よ}んで（　）。(quá khứ)', answers: ['あげました'] },
        { q: '{父|ちち}が{駅|えき}まで{迎|むか}えに{来|き}て（　）。(quá khứ)', answers: ['くれました'] },
        { q: '{教|おし}える → ～てもらいました', answers: V('{教|おし}えてもらいました') },
        { q: '{待|ま}つ → ～てくれませんか', answers: V('{待|ま}ってくれませんか') },
        { q: '{案内|あんない}する → ～てあげました', answers: V('{案内|あんない}してあげました') },
        { q: '{見|み}る → ～ていただけませんか', answers: V('{見|み}ていただけませんか') },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**Người làm**: くれる → **が**; もらう → **に**. Đề N4 hay hỏi đúng chỗ trợ từ này.',
        '**Tôi** không bao giờ là người "くれる"; người nhận của くれる luôn là tôi / phe tôi.',
        '**Với người trên**: không nói ～てあげます; nhờ thì ～ていただけませんか, đề nghị giúp thì ～ましょうか.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 1)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{日本|にほん}に{来|き}て、{誰|だれ}に{何|なに}をしてもらいましたか。', ro: 'Nihon ni kite, dare ni nani o shite moraimashita ka.', vi: 'Sang Nhật, em đã được ai làm gì cho?' },
        { who: 'Bạn', role: 'candidate', text: '{先輩|せんぱい}に{区役所|くやくしょ}の{手続|てつづ}きを{手伝|てつだ}ってもらいました。', ro: 'Senpai ni kuyakusho no tetsuzuki o tetsudatte moraimashita.', vi: 'Em được anh khoá trên giúp làm thủ tục ở văn phòng quận.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'じゃ、それを「くれる」で{言|い}ってください。', ro: 'Ja, sore o "kureru" de itte kudasai.', vi: 'Vậy em nói lại câu đó bằng "くれる".' },
        { who: 'Bạn', role: 'candidate', text: '{先輩|せんぱい}が{区役所|くやくしょ}の{手続|てつづ}きを{手伝|てつだ}ってくれました。', ro: 'Senpai ga kuyakusho no tetsuzuki o tetsudatte kuremashita.', vi: 'Anh khoá trên đã giúp em làm thủ tục ở văn phòng quận.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{最近|さいきん}、{誰|だれ}かに{何|なに}かをしてあげましたか。', ro: 'Saikin, dareka ni nanika o shite agemashita ka.', vi: 'Gần đây em có làm gì giúp ai không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい。ルームメートにベトナム{料理|りょうり}を{作|つく}ってあげました。', ro: 'Hai. Ruumumeeto ni Betonamu ryouri o tsukutte agemashita.', vi: 'Có ạ. Em đã nấu món Việt cho bạn cùng phòng.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{私|わたし}にこのプリントを{見|み}せてもらいたいとき、{何|なん}と{言|い}いますか。', ro: 'Watashi ni kono purinto o misete moraitai toki, nan to iimasu ka.', vi: 'Khi em muốn cô cho xem tờ bài này, em nói thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{先生|せんせい}、そのプリントを{見|み}せていただけませんか。', ro: 'Sensei, sono purinto o misete itadakemasen ka.', vi: 'Thưa cô, cô cho em xem tờ bài đó được không ạ?' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「{先生|せんせい}、{荷物|にもつ}を{持|も}ってあげます」— いいですか。', ro: '"Sensei, nimotsu o motte agemasu" — ii desu ka.', vi: '"Thưa cô, em xách đồ cho cô" — có được không?' },
        { who: 'Bạn', role: 'candidate', text: 'よくないです。「{持|も}ちましょうか」のほうがいいです。', ro: 'Yoku nai desu. "Mochimashou ka" no hou ga ii desu.', vi: 'Không nên ạ. Nói "để em xách nhé?" thì tốt hơn.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b18-b1-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: '{友達|ともだち}が{辞書|じしょ}を{貸|か}して（　）。', options: ['くれました', 'あげました', 'もらいました', 'いただきました'], correct: 0, why: 'Bạn (が) làm cho tôi → **くれました**. 〔Tomodachi ga jisho o kashite kuremashita.〕' },
        { q: '{私|わたし}は{友達|ともだち}（　）{辞書|じしょ}を{貸|か}してもらいました。', options: ['に', 'が', 'を', 'と'], correct: 0, why: 'もらう: người làm + **に**. 〔Tomodachi ni jisho o kashite moraimashita.〕' },
        { q: '{弟|おとうと}に{自転車|じてんしゃ}の{乗|の}り{方|かた}を{教|おし}えて（　）。', options: ['くれました', 'あげました', 'もらいました', 'おきました'], correct: 1, why: 'Tôi dạy em trai → **あげました**. 〔Otouto ni jitensha no norikata o oshiete agemashita.〕' },
        { q: '（{隣|となり}の{年上|としうえ}の{人|ひと}に）すみません、ちょっと{手伝|てつだ}って（　）。', options: ['くれる？', 'いただけませんか', 'あげませんか', 'もらう？'], correct: 1, why: 'Người lớn tuổi, hàng xóm mới → **～ていただけませんか**. 〔Chotto tetsudatte itadakemasen ka.〕' },
        { q: '{車|くるま}を{貸|か}して（　）、ありがとう。', options: ['くれて', 'あげて', 'もらって', 'おいて'], correct: 0, why: 'Câu cảm ơn chuẩn: **～てくれて、ありがとう**. 〔Kuruma o kashite kurete, arigatou.〕' },
      ],
    },
  ],
};

const BUOI_2: Lesson = {
  id: 'b18-buoi-2-te-oku',
  kind: 'review',
  title: 'Buổi 2 — Chuẩn bị chuyển nhà: từ mới đóng thùng & chuyển đồ · ～ておく (làm trước, để nguyên, làm cho xong, ～とく) · hội thoại ①②',
  goal: 'Theo nhịp một buổi trên lớp: ôn ～てあげる／くれる／もらう, học từ đóng thùng và chuyển đồ (段ボール・包む・届ける／届く・宅配便・家具), dùng ～ておく cho ba nghĩa và dạng nói ～とく, lập "danh sách việc cần làm trước" cho ngày chuyển nhà, rồi trả lời được câu giáo viên hay gọi.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 2 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Ôn bài cũ (5′)** — ba hướng あげる・くれる・もらう: giáo viên gọi đổi câu くれる ↔ もらう.',
        '**Từ mới (10′)** — nhóm B: {段|だん}ボール, {箱|はこ}, {包|つつ}む, {届|とど}ける／{届|とど}く, {宅配便|たくはいびん}, トラック, {家具|かぐ}, {道具|どうぐ}, {壊|こわ}す.',
        '**Ngữ pháp (15′)** — ～ておく: ① làm trước để chuẩn bị · ② để nguyên · ③ làm cho xong; chia おく; dạng nói ～とく／～どく.',
        '**Hội thoại (10′)** — đoạn cuối hội thoại ① (chia việc chuẩn bị) + đầu hội thoại ② (mở cửa sổ, bật điều hoà sẵn).',
        '**チャレンジ (10′)** — lập "やることリスト" (danh sách việc) cho ngày chuyển nhà, hỏi nhau ～ておきましたか. Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b18-b2-slides',
      title: 'Bài 18 引っ越し — Buổi 2: ～ておく',
      slides: [
        {
          tieuDe: '{第18課|だいじゅうはっか} — {引|ひ}っ{越|こ}しの{準備|じゅんび}',
          anh: ['package', 'spiral-calendar', 'clipboard'],
          nhan: ['{箱|はこ}', '{引|ひ}っ{越|こ}しの{日|ひ}', 'やることリスト'],
          dong: ['Hôm nay: **làm SẴN trước ngày chuyển nhà — ～ておく**'],
          ro: ['~te oku'],
          ghi: 'Buổi 1 học cách nhờ người khác giúp. Buổi 2 là phần việc của chính mình: những gì phải làm sẵn trước ngày chuyển nhà để hôm đó không rối.',
        },
        {
          tieuDe: 'Ôn nhanh — あげる・くれる・もらう',
          anh: ['man-student', 'woman-student'],
          nhan: ['マルコ', 'リン'],
          hoi: 'Điền: (1) マルコさんがリンさんの{荷物|にもつ}を{運|はこ}んで＿＿。(Lin kể) (2) リンさんはマルコさん＿＿{運|はこ}んでもらいました。 (3) {私|わたし}は{妹|いもうと}の{宿題|しゅくだい}を{手伝|てつだ}って＿＿。 (4) Nhờ thầy: {見|み}て＿＿。',
          dap: '(1) くれました (2) に (3) あげました (4) いただけませんか',
          ghi: 'Gọi 4 bạn, mỗi bạn một câu. Bạn nào nhầm が／に thì giáo viên vẽ lại bảng ba hướng.',
        },
        {
          tieuDe: '{新|あたら}しいことば ① — Đóng thùng',
          anh: ['package', 'wrapped-gift', 'rolled-up-newspaper', 'toolbox'],
          nhan: ['{段|だん}ボール{箱|ばこ}', '{包|つつ}みます', '{新聞紙|しんぶんし}', '{道具|どうぐ}'],
          dong: ['お{皿|さら}は{新聞紙|しんぶんし}で{包|つつ}んでから、{箱|はこ}に{入|い}れます。'],
          ro: ['Osara wa shinbunshi de tsutsunde kara, hako ni iremasu.'],
          ghi: '箱 đứng riêng đọc はこ, sau danh từ đọc ばこ (段ボール箱, ごみ箱). 包む → 包んで (む → んで). 壊す (làm vỡ — tha) ↔ 壊れる (vỡ — tự, Bài 15).',
        },
        {
          tieuDe: '{新|あたら}しいことば ② — Chuyển đồ',
          anh: ['delivery-truck', 'incoming-envelope', 'pickup-truck', 'couch-and-lamp'],
          nhan: ['{宅配便|たくはいびん}', '{届|とど}きます', 'トラック', '{家具|かぐ}'],
          dong: ['{国|くに}から{荷物|にもつ}が{届|とど}きました。', '{宅配便|たくはいびん}の{人|ひと}が{荷物|にもつ}を{届|とど}けてくれました。'],
          ro: ['Kuni kara nimotsu ga todokimashita.', 'Takuhaibin no hito ga nimotsu o todokete kuremashita.'],
          hoi: '届く hay 届ける? (1) {注文|ちゅうもん}した{本|ほん}が＿＿ました。 (2) {忘|わす}れ{物|もの}を{友達|ともだち}の{家|いえ}に＿＿ました。',
          dap: '(1) {届|とど}き (tự — が) (2) {届|とど}け (tha — を, người mang đến)',
          ghi: 'Cặp tự / tha đầu tiên của bài. Buổi 3 sẽ cần cặp này để phân biệt ～てある và ～ている.',
        },
        {
          tieuDe: '① Vて おく — làm TRƯỚC để chuẩn bị',
          anh: ['spiral-calendar', 'package'],
          nhan: ['{来週|らいしゅう}の{土曜日|どようび}', '{段|だん}ボール'],
          dong: ['{引|ひ}っ{越|こ}しの{前|まえ}に、{段|だん}ボールを{集|あつ}めておきます。', '{大家|おおや}さんにはもう{連絡|れんらく}しておきました。'],
          ro: ['Hikkoshi no mae ni, danbooru o atsumete okimasu.', 'Ooya-san ni wa mou renraku shite okimashita.'],
          hoi: 'Không có ～ておく, câu 1 còn nghĩa "chuẩn bị" không? 「{引|ひ}っ{越|こ}しの{前|まえ}に、{段|だん}ボールを{集|あつ}めます」',
          dap: 'Vẫn đúng nhưng chỉ là kể việc; có ～ておく mới rõ ý "làm sẵn để ngày chuyển nhà khỏi lo".',
          ghi: 'おく gốc là 置く (đặt): "làm rồi để đó cho sau". Hay đi với ～前に (ポイント 106), までに, もう.',
        },
        {
          tieuDe: 'Chia おく — như động từ nhóm 1',
          bang: {
            head: ['Dạng', 'Câu', 'Romaji'],
            rows: [
              ['～ておきます', '{買|か}っておきます', 'katte okimasu'],
              ['～ておきました', '{買|か}っておきました', 'katte okimashita'],
              ['～ておいてください', '{買|か}っておいてください', 'katte oite kudasai'],
              ['～ておこう／～ておきましょう', '{買|か}っておこう', 'katte okou'],
              ['～ておいたほうがいい', '{買|か}っておいたほうがいい', 'katte oita hou ga ii'],
            ],
          },
          ghi: 'Lỗi số một: ~~おきてください~~ → おいてください (く → いて, như 書く → 書いて).',
        },
        {
          tieuDe: '② Vて おく — ĐỂ NGUYÊN (cứ để vậy)',
          anh: ['window', 'sun'],
          nhan: ['{窓|まど}', '{暑|あつ}い'],
          dong: ['{暑|あつ}いので、{窓|まど}を{開|あ}けておきましょう。', '{箱|はこ}はそのままにしておいてください。'],
          ro: ['Atsui node, mado o akete okimashou.', 'Hako wa sono mama ni shite oite kudasai.'],
          ghi: 'Làm cho một trạng thái tiếp tục vì có lý do. そのままにしておいてください = "cứ để nguyên" — câu dặn rất hay gặp ở nhà, ở văn phòng.',
        },
        {
          tieuDe: '③ Vて おく — LÀM CHO XONG',
          anh: ['teacup-without-handle', 'wastebasket'],
          nhan: ['コップ', 'ごみ'],
          dong: ['{使|つか}ったコップは{洗|あら}っておいてね。', '{要|い}らない{物|もの}は{今週中|こんしゅうちゅう}に{捨|す}てておきます。'],
          ro: ['Tsukatta koppu wa aratte oite ne.', 'Iranai mono wa konshuuchuu ni sutete okimasu.'],
          ghi: 'Xử lý luôn để sau khỏi phải lo. Câu dặn việc trong nhà, ở chỗ làm thêm (Bài 16) rất hay dùng nghĩa này.',
        },
        {
          tieuDe: 'Văn nói — ～とく／～どく',
          bang: {
            head: ['Viết', 'Nói', 'Romaji'],
            rows: [
              ['やっておく', 'やっとく', 'yattoku'],
              ['{買|か}っておく', '{買|か}っとく', 'kattoku'],
              ['{読|よ}んでおく', '{読|よ}んどく', 'yondoku'],
              ['{開|あ}けておいて', '{開|あ}けといて', 'aketoite'],
              ['{置|お}いておいて', '{置|お}いといて', 'oitoite'],
            ],
          },
          hoi: 'Bạn nghe: 「{明日|あした}までに{読|よ}んどいてね」. Nghĩa là gì? Viết lại dạng đầy đủ.',
          dap: '"Đọc trước cho xong đến mai nhé." → {明日|あした}までに{読|よ}んでおいてね。',
          ghi: 'Nghe được là quan trọng (phim, bạn bè, đề nghe). Nói với thầy cô, viết bài thì dùng dạng đầy đủ.',
        },
        {
          tieuDe: 'Ghép với mẫu đã học',
          dong: ['{何|なに}を{用意|ようい}しておけばいいですか。', '{窓|まど}を{開|あ}けておいてもいいですか。', '{大家|おおや}さんが{冷蔵庫|れいぞうこ}を{用意|ようい}しておいてくれました。'],
          ro: ['Nani o youi shite okeba ii desu ka.', 'Mado o akete oite mo ii desu ka.', 'Ooya-san ga reizouko o youi shite oite kuremashita.'],
          hoi: 'Ba câu trên ghép ～ておく với mẫu nào?',
          dap: '(1) ～ばいいですか (Bài 17) (2) ～てもいいですか (ポイント 89) (3) ～てくれる (Buổi 1).',
          ghi: 'Câu (3) là câu hay nhất của hội thoại ②: chủ nhà chuẩn bị sẵn — cho mình. Hai mẫu của bài chồng lên nhau.',
        },
        {
          tieuDe: '会話①② — chia việc chuẩn bị',
          anh: ['woman-student', 'man-student', 'woman-student'],
          nhan: ['リン', 'マルコ', 'アンナ'],
          dong: ['マルコ：{僕|ぼく}が{今夜|こんや}{頼|たの}んでおきます。', 'アンナ：{私|わたし}は{段|だん}ボールを{集|あつ}めておきますね。', 'リン：{窓|まど}を{開|あ}けておきましょう。{冷房|れいぼう}もつけておきますね。'],
          ro: ['Boku ga kon\'ya tanonde okimasu.', 'Watashi wa danbooru o atsumete okimasu ne.', 'Mado o akete okimashou. Reibou mo tsukete okimasu ne.'],
          hoi: 'Trong ba câu, câu nào là "làm trước", câu nào là "để nguyên"?',
          dap: 'Câu 1, 2 = làm trước (chuẩn bị); câu 3 = để nguyên (cửa sổ mở, điều hoà chạy) cho phòng mát.',
          ghi: 'Đọc theo vai đoạn cuối hội thoại ① và đầu hội thoại ②.',
        },
        {
          tieuDe: 'チャレンジ — やることリスト (danh sách việc)',
          anh: ['clipboard', 'pencil'],
          nhan: ['リスト', '✓'],
          bang: {
            head: ['Việc', 'Hỏi', 'Đáp'],
            rows: [
              ['{大家|おおや}さんに{連絡|れんらく}する', '{連絡|れんらく}しておきましたか。', 'はい、もうしておきました。'],
              ['{段|だん}ボールを{用意|ようい}する', '{用意|ようい}しておきましたか。', 'いいえ、まだです。{明日|あした}{用意|ようい}しておきます。'],
              ['ガスの{会社|かいしゃ}に{電話|でんわ}する', '{電話|でんわ}しておきましたか。', '……'],
              ['{要|い}らない{物|もの}を{捨|す}てる', '{捨|す}てておきましたか。', '……'],
            ],
          },
          hoi: 'Làm theo cặp: A hỏi từng dòng, B trả lời theo việc thật của mình (đã làm / chưa làm + khi nào sẽ làm).',
          dap: 'Mẫu: はい、もう～ておきました。／いいえ、まだです。～までに～ておきます。',
          ghi: 'Giáo viên đi vòng lớp, nghe xem bạn có chia おいて／おきます đúng không.',
        },
        {
          tieuDe: 'Câu hỏi cuối buổi 2',
          hoi: '(1) Trước khi khách đến, tôi dọn sẵn phòng. (2) Cửa sổ cứ để mở nhé. (3) Cốc dùng rồi thì rửa luôn nhé (thân mật). (4) 「{読|よ}んどく」 dạng đầy đủ?',
          dap: '(1) お{客|きゃく}さんが{来|く}る{前|まえ}に、{部屋|へや}を{掃除|そうじ}しておきます。 (2) {窓|まど}は{開|あ}けておいてください。 (3) {使|つか}ったコップは{洗|あら}っておいてね。 (4) {読|よ}んでおく.',
          ghi: 'Về nhà: học 10 từ nhóm B, viết "やることリスト" thật cho tuần tới bằng 5 câu ～ておきます.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Ôn buổi 1: đổi くれる ↔ もらう' },
    {
      t: 'mcq',
      id: 'b18-b2-on',
      title: 'Ôn buổi 1 (6 câu)',
      items: [
        { q: '{先輩|せんぱい}が{駅|えき}まで{連|つ}れていって（　）。', options: ['くれました', 'あげました', 'もらいました', 'おきました'], correct: 0, why: 'Đàn anh (が) làm cho tôi → **くれました**. 〔Senpai ga eki made tsurete itte kuremashita.〕' },
        { q: '{私|わたし}は{店|みせ}の{人|ひと}（　）プレゼントを{包|つつ}んでもらいました。', options: ['が', 'に', 'を', 'へ'], correct: 1, why: 'もらう: người làm + **に**. 〔Mise no hito ni purezento o tsutsunde moraimashita.〕' },
        { q: '{友達|ともだち}の{引|ひ}っ{越|こ}しを{手伝|てつだ}って（　）。', options: ['くれました', 'あげました', 'もらいました', 'いただきました'], correct: 1, why: 'Tôi giúp bạn → **あげました**. 〔Tomodachi no hikkoshi o tetsudatte agemashita.〕' },
        { q: '（{先生|せんせい}に）すみません、もう{一度|いちど}{説明|せつめい}して（　）。', options: ['くれ', 'あげませんか', 'いただけませんか', 'もらう？'], correct: 2, why: 'Nhờ thầy → **いただけませんか**. 〔Mou ichido setsumei shite itadakemasen ka.〕' },
        { q: '「{届|とど}ける」の{正|ただ}しい{使|つか}い{方|かた}は？', options: ['{荷物|にもつ}が{届|とど}けました。', '{荷物|にもつ}を{届|とど}けました。', '{荷物|にもつ}を{届|とど}きました。', '{荷物|にもつ}に{届|とど}けました。'], correct: 1, why: 'Tha động từ: N **を** {届|とど}ける. Tự: N が {届|とど}く.' },
        { q: '「{包|つつ}む」の{て形|てけい}は？', options: ['{包|つつ}みて', '{包|つつ}んで', '{包|つつ}って', '{包|つつ}いて'], correct: 1, why: 'む → **んで**: {包|つつ}んで.' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Lập danh sách việc cho ngày chuyển nhà' },
    {
      t: 'table',
      caption: 'やることリスト — giáo viên viết lên bảng, cả lớp đọc thành câu ～ておきます',
      head: ['Khi nào', 'Việc', 'Câu ～ておきます', 'Romaji'],
      rows: [
        ['2 tuần trước', 'báo chủ nhà cũ', '{大家|おおや}さんに{連絡|れんらく}しておきます。', 'Ooya-san ni renraku shite okimasu.'],
        ['1 tuần trước', 'báo điện, nước, ga', '{電気|でんき}と{水道|すいどう}とガスの{会社|かいしゃ}に{電話|でんわ}しておきます。', 'Denki to suidou to gasu no kaisha ni denwa shite okimasu.'],
        ['1 tuần trước', 'xin thùng các-tông', 'スーパーで{段|だん}ボールをもらっておきます。', 'Suupaa de danbooru o moratte okimasu.'],
        ['3 ngày trước', 'vứt đồ không cần', '{要|い}らない{物|もの}を{捨|す}てておきます。', 'Iranai mono o sutete okimasu.'],
        ['hôm trước', 'cho đồ vào thùng, ghi tên', '{荷物|にもつ}を{箱|はこ}に{入|い}れて、{名前|なまえ}を{書|か}いておきます。', 'Nimotsu o hako ni irete, namae o kaite okimasu.'],
        ['tối hôm trước', 'rút điện tủ lạnh', '{冷蔵庫|れいぞうこ}の{電気|でんき}を{切|き}っておきます。', 'Reizouko no denki o kitte okimasu.'],
        ['sáng hôm đó', 'mua đồ uống cho bạn', '{手伝|てつだ}ってくれる{友達|ともだち}の{飲|の}み{物|もの}を{買|か}っておきます。', 'Tetsudatte kureru tomodachi no nomimono o katte okimasu.'],
      ],
    },
    {
      t: 'quiz',
      id: 'b18-b2-chia',
      title: 'Luyện nhanh — chia ～ておく (8 câu)',
      kind: 'fill',
      items: [
        { q: '{集|あつ}める → ～ておきます', answers: V('{集|あつ}めておきます') },
        { q: '{包|つつ}む → ～ておきました', answers: V('{包|つつ}んでおきました') },
        { q: '{書|か}く → ～ておいてください', answers: V('{書|か}いておいてください') },
        { q: '{連絡|れんらく}する → ～ておいたほうがいいです', answers: V('{連絡|れんらく}しておいたほうがいいです') },
        { q: '{用意|ようい}する → ～ておけばいいですか', answers: V('{用意|ようい}しておけばいいですか') },
        { q: '{買|か}う → văn nói ～とく', answers: V('{買|か}っとく') },
        { q: '{読|よ}む → văn nói ～どく', answers: V('{読|よ}んどく') },
        { q: '{開|あ}けておいて → văn nói', answers: V('{開|あ}けといて') },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**～ておく là HÀNH ĐỘNG có mục đích về sau** — người làm là chủ ngữ, tân ngữ đi với を.',
        '**おく chia nhóm 1**: おきます・おいて・おこう; nói tắt ～とく／～どく／～といて.',
        '**Ba nghĩa** — làm trước, để nguyên, làm cho xong — cùng một dạng; nhìn ngữ cảnh mà hiểu (～前に → làm trước; そのまま → để nguyên; ～たら／使った～は → làm cho xong).',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 2)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{旅行|りょこう}の{前|まえ}に、いつも{何|なに}をしておきますか。', ro: 'Ryokou no mae ni, itsumo nani o shite okimasu ka.', vi: 'Trước chuyến du lịch em thường làm sẵn gì?' },
        { who: 'Bạn', role: 'candidate', text: 'ホテルを{予約|よやく}しておきます。それから、{天気予報|てんきよほう}を{調|しら}べておきます。', ro: 'Hoteru o yoyaku shite okimasu. Sorekara, tenki yohou o shirabete okimasu.', vi: 'Em đặt khách sạn trước ạ. Rồi em xem dự báo thời tiết trước.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{明日|あした}テストがあります。{今晩|こんばん}{何|なに}をしておきますか。', ro: 'Ashita tesuto ga arimasu. Konban nani o shite okimasu ka.', vi: 'Mai có bài kiểm tra. Tối nay em sẽ làm sẵn gì?' },
        { who: 'Bạn', role: 'candidate', text: '{漢字|かんじ}を{復習|ふくしゅう}しておきます。{早|はや}く{寝|ね}ておきたいです。', ro: 'Kanji o fukushuu shite okimasu. Hayaku nete okitai desu.', vi: 'Em sẽ ôn chữ Hán trước. Em muốn ngủ sớm (để mai tỉnh táo).' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「{窓|まど}を{開|あ}けておいてください」— どういう{意味|いみ}ですか。', ro: '"Mado o akete oite kudasai" — dou iu imi desu ka.', vi: '"窓を開けておいてください" nghĩa là gì?' },
        { who: 'Bạn', role: 'candidate', text: '{窓|まど}を{開|あ}けて、そのままにしてくださいという{意味|いみ}です。', ro: 'Mado o akete, sono mama ni shite kudasai to iu imi desu.', vi: 'Nghĩa là mở cửa sổ ra rồi cứ để nguyên như thế ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「{読|よ}んどいて」は？', ro: '"Yondoite" wa?', vi: 'Còn "読んどいて"?' },
        { who: 'Bạn', role: 'candidate', text: '「{読|よ}んでおいて」です。{友達|ともだち}と{話|はな}すときの{言|い}い{方|かた}です。', ro: '"Yonde oite" desu. Tomodachi to hanasu toki no iikata desu.', vi: 'Là "読んでおいて" ạ. Cách nói khi nói chuyện với bạn bè.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b18-b2-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: '{友達|ともだち}が{来|く}る{前|まえ}に、ジュースを{冷|ひ}やして（　）。', options: ['おきます', 'あります', 'います', 'くれます'], correct: 0, why: 'Làm trước để chuẩn bị → **～ておきます**. 〔Juusu o hiyashite okimasu.〕' },
        { q: '{窓|まど}は{閉|し}めないで、{開|あ}けて（　）ください。', options: ['おいて', 'おきて', 'あって', 'いて'], correct: 0, why: 'Để nguyên + おく nhóm 1 → **おいて**ください. 〔Akete oite kudasai.〕' },
        { q: '{引|ひ}っ{越|こ}しの{前|まえ}に、{何|なに}を{用意|ようい}して（　）いいですか。', options: ['おけば', 'あれば', 'くれれば', 'いれば'], correct: 0, why: '～ておく + ～ばいいですか → **{用意|ようい}しておけば**いいですか. 〔Nani o youi shite okeba ii desu ka.〕' },
        { q: '「{買|か}っとく」の{意味|いみ}は？', options: ['{買|か}っておく', '{買|か}ってある', '{買|か}っている', '{買|か}ってくる'], correct: 0, why: 'Văn nói **～とく = ～ておく**.' },
        { q: '{国|くに}から{荷物|にもつ}が（　）。', options: ['{届|とど}きました', '{届|とど}けました', '{届|とど}けておきました', '{送|おく}りました'], correct: 0, why: 'Hàng tự đến → tự động từ **{届|とど}く**. 〔Kuni kara nimotsu ga todokimashita.〕' },
      ],
    },
  ],
};

const BUOI_3: Lesson = {
  id: 'b18-buoi-3-te-aru',
  kind: 'review',
  title: 'Buổi 3 — Ở phòng mới: từ mới đồ đạc & hàng xóm · ～てある · phân biệt ～ている・～てある・～ておく · hội thoại ②③ · tổng kết Bài 18',
  goal: 'Theo nhịp một buổi trên lớp: ôn ～ておく, học từ đồ đạc trong phòng và hàng xóm, quy định rác, nắm cặp tự / tha động từ, tả trạng thái do người cố ý tạo ra bằng ～てある, phân biệt năm câu "cửa sổ" (～ます・～ている・～ておく・～てある・自動詞ている), đóng vai hội thoại ②③ và tổng kết cả Bài 18.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 3 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Ôn bài cũ (5′)** — ～ておく: "trước ngày chuyển nhà, bạn đã làm sẵn những gì?".',
        '**Từ mới (10′)** — nhóm C (đồ đạc, việc trong phòng: {棚|たな}, {壁|かべ}, {鏡|かがみ}, {掛|か}ける, {飾|かざ}る, {貼|は}る, しまう, {取|と}り{替|か}える, {直|なお}す…) + nhóm D (hàng xóm & rác).',
        '**Ngữ pháp (15′)** — cặp tự / tha; **N が 他動詞て ある**; bảng năm câu cửa sổ; ～ておく ↔ ～てある.',
        '**Hội thoại (10′)** — ② thùng nào đựng gì · ③ chào hàng xóm, hỏi cách đổ rác.',
        '**チャレンジ + tổng kết (10′)** — nhìn tranh căn phòng nói 4 câu ～てあります; bảng tổng kết ba mẫu; kiểm tra cuối bài 8 câu.',
      ],
    },
    {
      t: 'slides',
      id: 'b18-b3-slides',
      title: 'Bài 18 引っ越し — Buổi 3: ～てある',
      slides: [
        {
          tieuDe: '{第18課|だいじゅうはっか} — {新|あたら}しい{部屋|へや}で',
          anh: ['house', 'framed-picture', 'woman-bowing'],
          nhan: ['{新|あたら}しい{部屋|へや}', '{飾|かざ}る', 'あいさつ'],
          dong: ['Hôm nay: **tả căn phòng đã được chuẩn bị — ～てある**'],
          ro: ['~te aru'],
          ghi: 'Buổi 2 là việc làm sẵn (～ておく). Buổi 3 nhìn vào KẾT QUẢ còn lại: trên tường có treo gì, trên thùng có ghi gì — ～てある.',
        },
        {
          tieuDe: 'Ôn nhanh — ～ておく',
          anh: ['clipboard'],
          nhan: ['やることリスト'],
          hoi: 'Chia: (1) {連絡|れんらく}する → ～ておきました (2) {書|か}く → ～ておいてください (3) {開|あ}ける → ～とく (4) Nghĩa của 「そのままにしておいて」?',
          dap: '(1) {連絡|れんらく}しておきました (2) {書|か}いておいてください (3) {開|あ}けとく (4) cứ để nguyên như vậy',
          ghi: 'Gọi 4 bạn. Nhắc lại: ～ておく — người làm là chủ ngữ, vật đi với を.',
        },
        {
          tieuDe: '{新|あたら}しいことば ① — Trong phòng',
          anh: ['mirror', 'framed-picture', 'light-bulb', 'hammer-and-wrench'],
          nhan: ['{鏡|かがみ}', '{飾|かざ}ります', '{電球|でんきゅう}を{取|と}り{替|か}えます', '{直|なお}します'],
          dong: ['{壁|かべ}に{鏡|かがみ}を{掛|か}けます。', '{古|ふる}い{電球|でんきゅう}を{新|あたら}しいのに{取|と}り{替|か}えます。'],
          ro: ['Kabe ni kagami o kakemasu.', 'Furui denkyuu o atarashii no ni torikaemasu.'],
          ghi: 'Nhóm C toàn là đồ đạc + động từ đặt đồ (掛ける, 飾る, 貼る, しまう) — đúng những động từ cần cho ～てある. 押し入れ đọc o-shi-i-re. 本棚 đọc ほんだな.',
        },
        {
          tieuDe: '{新|あたら}しいことば ② — Hàng xóm & rác',
          anh: ['houses', 'woman-bowing', 'fire', 'wastebasket'],
          nhan: ['{近所|きんじょ}', 'あいさつ', '{燃|も}えるごみ', 'ごみ{置|お}き{場|ば}'],
          dong: ['これからお{世話|せわ}になります。', '{燃|も}えるごみは{月曜日|げつようび}と{木曜日|もくようび}です。'],
          ro: ['Korekara osewa ni narimasu.', 'Moeru gomi wa getsuyoubi to mokuyoubi desu.'],
          ghi: 'Ở Nhật chuyển đến chỗ mới nên mang quà nhỏ sang chào hàng xóm. Quy định rác (規則) khác nhau theo từng khu — bảng lịch rác thường dán ở chỗ tập kết.',
        },
        {
          tieuDe: 'Tự động từ ↔ tha động từ',
          bang: {
            head: ['Tha (ai đó làm — を)', 'Tự (tự xảy ra — が)'],
            rows: [
              ['{開|あ}ける', '{開|あ}く'],
              ['{閉|し}める', '{閉|し}まる'],
              ['つける', 'つく'],
              ['{止|と}める', '{止|と}まる'],
              ['{掛|か}ける', '{掛|か}かる'],
              ['{並|なら}べる', '{並|なら}ぶ'],
            ],
          },
          ghi: 'Bài 15 (ポイント 122) đã học: 自動詞 + ている tả trạng thái (窓が開いています). Hôm nay là cột bên trái: 他動詞 + てある.',
        },
        {
          tieuDe: '～てある — có người đã cố ý làm, kết quả còn đó',
          anh: ['framed-picture', 'calendar'],
          nhan: ['{絵|え}', 'カレンダー'],
          dong: ['{壁|かべ}に{絵|え}が{掛|か}けてあります。', '{壁|かべ}にカレンダーが{貼|は}ってあります。'],
          ro: ['Kabe ni e ga kakete arimasu.', 'Kabe ni karendaa ga hatte arimasu.'],
          hoi: 'Ai đã treo tranh? Câu có nói không?',
          dap: 'Câu không nói — chỉ biết là CÓ NGƯỜI đã treo (cố ý). ～てある không quan tâm người làm.',
          ghi: 'Công thức: [chỗ]に N が 他動詞て あります. Vật đi với が／は, không dùng を khi tả cảnh.',
        },
        {
          tieuDe: 'Làm câu ～てある từ câu hành động',
          bang: {
            head: ['Hành động', '→ Trạng thái'],
            rows: [
              ['{箱|はこ}に{名前|なまえ}を{書|か}いた', '{箱|はこ}に{名前|なまえ}が{書|か}いてあります'],
              ['{棚|たな}に{手紙|てがみ}を{置|お}いた', '{棚|たな}に{手紙|てがみ}が{置|お}いてあります'],
              ['ビールを{冷|ひ}やした', 'ビールが{冷|ひ}やしてあります'],
              ['{窓|まど}を{開|あ}けた', '{窓|まど}が{開|あ}けてあります'],
            ],
          },
          ghi: 'Hai bước: (1) を → が (2) Vた → Vてあります. Người làm biến mất khỏi câu.',
        },
        {
          tieuDe: '～てある ② — もう～てあります (đã chuẩn bị xong)',
          anh: ['ticket', 'hotel'],
          nhan: ['{切符|きっぷ}', 'ホテル'],
          dong: ['ホテルはもう{予約|よやく}してあります。', '{飲|の}み{物|もの}は{冷蔵庫|れいぞうこ}に{冷|ひ}やしてあります。'],
          ro: ['Hoteru wa mou yoyaku shite arimasu.', 'Nomimono wa reizouko ni hiyashite arimasu.'],
          hoi: 'A「{切符|きっぷ}は？」 — B trả lời bằng ～てあります.',
          dap: 'B「もう{買|か}ってありますよ。」',
          ghi: '～ておきました là chuyện ĐÃ LÀM (nhìn hành động); ～てあります là chuyện ĐÃ SẴN (nhìn kết quả). Trả lời "đã chuẩn bị chưa?" dùng được cả hai.',
        },
        {
          tieuDe: '⭐ Năm câu "cửa sổ"',
          bang: {
            head: ['Câu', 'Nghĩa'],
            rows: [
              ['リンさんが{窓|まど}を{開|あ}けます。', 'Lin (sẽ) mở cửa'],
              ['リンさんが{窓|まど}を{開|あ}けています。', 'Lin ĐANG mở cửa'],
              ['リンさんが{窓|まど}を{開|あ}けておきました。', 'Lin mở SẴN (có mục đích)'],
              ['{窓|まど}が{開|あ}けてあります。', 'cửa ĐƯỢC mở sẵn (có người cố ý)'],
              ['{窓|まど}が{開|あ}いています。', 'cửa ĐANG MỞ (chỉ tả)'],
            ],
          },
          hoi: 'Gió thổi bật cửa sổ ra. Câu nào đúng: {開|あ}けてあります hay {開|あ}いています?',
          dap: '{窓|まど}が{開|あ}いています — không có người cố ý làm thì không dùng ～てある.',
          ghi: 'Đây là bảng quan trọng nhất của Bài 18 — chép vào vở, đề N4 hay cho chọn giữa ～ている / ～てある / ～ておく.',
        },
        {
          tieuDe: 'Sáng hay được bật sẵn?',
          anh: ['light-bulb'],
          nhan: ['{電気|でんき}'],
          dong: ['あれ？{電気|でんき}がついています。', 'お{客|きゃく}さんが{来|く}るので、{電気|でんき}がつけてあります。'],
          ro: ['Are? Denki ga tsuite imasu.', 'Okyaku-san ga kuru node, denki ga tsukete arimasu.'],
          hoi: 'Câu nào là "phát hiện" (có thể ai quên tắt), câu nào là "có chủ ý"?',
          dap: 'Câu 1 (～ている, tự) = phát hiện, trung tính; câu 2 (～てある, tha) = có người cố ý bật sẵn cho khách.',
          ghi: 'Động từ chỉ có dạng tha (書く, 貼る, 置く, 飾る) thì trạng thái chỉ nói được bằng ～てある.',
        },
        {
          tieuDe: '会話② — "Trên thùng có ghi đấy!"',
          anh: ['package', 'label'],
          nhan: ['{箱|はこ}', 'シール'],
          dong: ['リン：{箱|はこ}は{全部|ぜんぶ}ドアの{前|まえ}に{並|なら}べてあります。', 'リン：{上|うえ}に{書|か}いてあります。{重|おも}い{箱|はこ}には{赤|あか}いシールが{貼|は}ってあります。', 'アンナ：{棚|たな}の{上|うえ}に{何|なに}か{置|お}いてありますよ。'],
          ro: ['Hako wa zenbu doa no mae ni narabete arimasu.', 'Ue ni kaite arimasu. Omoi hako ni wa akai shiiru ga hatte arimasu.', 'Tana no ue ni nanika oite arimasu yo.'],
          hoi: 'Thùng nặng có gì? Trên giá có gì?',
          dap: 'Thùng nặng có dán nhãn đỏ; trên giá có thư và bánh kẹo của chủ nhà.',
          ghi: 'Đọc theo vai hội thoại ②. Đếm xem có bao nhiêu câu ～てある (5 câu).',
        },
        {
          tieuDe: '会話③ — chào hàng xóm',
          anh: ['woman-student', 'woman', 'wrapped-gift'],
          nhan: ['リン', '{山口|やまぐち}さん', 'お{土産|みやげ}'],
          dong: ['リン：これからお{世話|せわ}になります。ほんの{気持|きも}ちですが、どうぞ。', '{山口|やまぐち}：ごみ{置|お}き{場|ば}に{規則|きそく}の{紙|かみ}が{貼|は}ってありますよ。'],
          ro: ['Korekara osewa ni narimasu. Honno kimochi desu ga, douzo.', 'Gomi okiba ni kisoku no kami ga hatte arimasu yo.'],
          hoi: 'Rác cháy được đổ ngày nào, trước mấy giờ? Có được để ra từ tối hôm trước không?',
          dap: 'Thứ Hai và thứ Năm, trước 8 giờ sáng. Không được để từ tối (vì quạ bới).',
          ghi: 'Đóng vai cặp: chào hàng xóm + hỏi cách đổ rác bằng ～ていただけませんか.',
        },
        {
          tieuDe: 'チャレンジ — tả căn phòng',
          anh: ['window', 'framed-picture', 'mirror', 'potted-plant'],
          nhan: ['{窓|まど}', '{絵|え}', '{鏡|かがみ}', '{花|はな}'],
          hoi: 'Nhìn bốn hình, nói 4 câu ～てあります về căn phòng (chỗ + đồ + động từ tha).',
          dap: 'Ví dụ: {窓|まど}が{開|あ}けてあります。{壁|かべ}に{絵|え}が{掛|か}けてあります。{鏡|かがみ}も{掛|か}けてあります。{窓|まど}の{横|よこ}に{花|はな}が{飾|かざ}ってあります。',
          ghi: 'Đúng dạng câu hỏi có tranh của thi nói. Mỗi câu một đồ vật, đừng gộp quá dài.',
        },
        {
          tieuDe: 'Tổng kết Bài 18 — ba mẫu',
          bang: {
            head: ['Mẫu', 'Nghĩa', 'Câu mẫu'],
            rows: [
              ['～てあげる・くれる・もらう', 'cho – nhận việc làm', '{友達|ともだち}が{手伝|てつだ}ってくれました。'],
              ['～てくれませんか → ～ていただけませんか', 'nhờ (lịch sự dần)', '{教|おし}えていただけませんか。'],
              ['～ておく', 'làm trước / để nguyên / làm cho xong', '{段|だん}ボールを{集|あつ}めておきます。'],
              ['～てある', 'trạng thái đã được làm sẵn', '{箱|はこ}に{名前|なまえ}が{書|か}いてあります。'],
            ],
          },
          ghi: 'Bài 19 sẽ thêm ba mẫu nữa cũng đứng sau thể て: ～てしまう, ～てみる, và ～ところ — nên ôn thể て thật chắc.',
        },
        {
          tieuDe: 'Câu hỏi cuối Bài 18',
          hoi: '(1) Trên tường có treo gương. (2) Cửa sổ đang mở (chỉ tả). (3) Chủ nhà đã chuẩn bị sẵn tủ lạnh cho tôi. (4) Từ nay mong được giúp đỡ (chào hàng xóm).',
          dap: '(1) {壁|かべ}に{鏡|かがみ}が{掛|か}けてあります。 (2) {窓|まど}が{開|あ}いています。 (3) {大家|おおや}さんが{冷蔵庫|れいぞうこ}を{用意|ようい}しておいてくれました。 (4) これからお{世話|せわ}になります。',
          ghi: 'Về nhà: làm mục Bài tập + Luyện thêm của Bài 18; chuẩn bị kể 1 phút lần chuyển nhà.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Ôn buổi 2' },
    {
      t: 'mcq',
      id: 'b18-b3-on',
      title: 'Ôn buổi 2 — ～ておく (4 câu)',
      items: [
        { q: '{会議|かいぎ}の{前|まえ}に、{資料|しりょう}をコピーして（　）。', options: ['おきます', 'あります', 'います', 'くれます'], correct: 0, why: 'Làm trước + tân ngữ を → **～ておきます**. 〔Shiryou o kopii shite okimasu.〕' },
        { q: '{寒|さむ}いから、{窓|まど}は{閉|し}めて（　）ね。', options: ['おいて', 'あって', 'いて', 'あげて'], correct: 0, why: 'Dặn để nguyên → **～ておいて**. 〔Mado wa shimete oite ne.〕' },
        { q: '「やっといて」は{何|なん}の{短|みじか}い{言|い}い{方|かた}ですか。', options: ['やっておいて', 'やってあって', 'やっていて', 'やってきて'], correct: 0, why: '**～といて = ～ておいて**.' },
        { q: '{使|つか}ったお{皿|さら}は{洗|あら}って（　）ください。', options: ['おいて', 'おきて', 'あって', 'くれて'], correct: 0, why: 'Làm cho xong → **{洗|あら}っておいて**ください.' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Nhìn tranh: căn phòng của リン' },
    {
      t: 'canh',
      anh: ['window', 'framed-picture', 'mirror', 'potted-plant', 'package'],
      caption: 'Căn phòng mới của リン sau ngày chuyển nhà: cửa sổ mở, tranh và gương treo trên tường, chậu cây bên cửa sổ, vài thùng các-tông còn xếp ở góc phòng.',
    },
    {
      t: 'table',
      caption: 'Giáo viên chỉ vào từng chỗ trong tranh — cả lớp nói thành câu',
      head: ['Chỉ vào', 'Câu', 'Romaji'],
      rows: [
        ['cửa sổ', '{窓|まど}が{開|あ}けてあります。', 'Mado ga akete arimasu.'],
        ['bức tranh', '{壁|かべ}に{絵|え}が{掛|か}けてあります。', 'Kabe ni e ga kakete arimasu.'],
        ['tấm gương', '{絵|え}の{隣|となり}に{鏡|かがみ}が{掛|か}けてあります。', 'E no tonari ni kagami ga kakete arimasu.'],
        ['chậu cây', '{窓|まど}のそばに{植木|うえき}が{置|お}いてあります。', 'Mado no soba ni ueki ga oite arimasu.'],
        ['các thùng', '{部屋|へや}の{隅|すみ}に{箱|はこ}が{並|なら}べてあります。', 'Heya no sumi ni hako ga narabete arimasu.'],
        ['chữ trên thùng', '{箱|はこ}に「{本|ほん}」と{書|か}いてあります。', 'Hako ni "hon" to kaite arimasu.'],
      ],
    },
    {
      t: 'quiz',
      id: 'b18-b3-chia',
      title: 'Luyện nhanh — đổi sang ～てある / chọn ～ている (8 câu)',
      kind: 'fill',
      items: [
        { q: '{誰|だれ}かが{壁|かべ}に{地図|ちず}を{貼|は}りました。→ {壁|かべ}に{地図|ちず}が（　）。', answers: V('{貼|は}ってあります') },
        { q: '{誰|だれ}かが{机|つくえ}の{上|うえ}に{花|はな}を{飾|かざ}りました。→ {机|つくえ}の{上|うえ}に{花|はな}が（　）。', answers: V('{飾|かざ}ってあります') },
        { q: '{誰|だれ}かがドアの{前|まえ}に{自転車|じてんしゃ}を{止|と}めました。→ ドアの{前|まえ}に{自転車|じてんしゃ}が（　）。', answers: V('{止|と}めてあります') },
        { q: '{誰|だれ}かが{箱|はこ}に{名前|なまえ}を{書|か}きました。→ {箱|はこ}に{名前|なまえ}が（　）。', answers: V('{書|か}いてあります') },
        { q: '{誰|だれ}かが{引|ひ}き{出|だ}しに{鍵|かぎ}を{入|い}れました。→ {引|ひ}き{出|だ}しに{鍵|かぎ}が（　）。', answers: V('{入|い}れてあります') },
        { q: '{風|かぜ}で{窓|まど}が{開|あ}きました。→ {窓|まど}が（　）。(trạng thái)', answers: V('{開|あ}いています') },
        { q: '{電気|でんき}が{消|き}えました。→ {電気|でんき}が（　）。(trạng thái)', answers: V('{消|き}えています') },
        { q: '（{私|わたし}が）{冷蔵庫|れいぞうこ}にビールを{冷|ひ}やしておきました。→ ビールが（　）。', answers: V('{冷|ひ}やしてあります') },
      ],
    },
    {
      t: 'mcq',
      id: 'b18-b3-han',
      title: 'Ôn chữ Hán của bài (6 câu)',
      items: [
        { q: '**建物**の{読|よ}み{方|かた}は？', options: ['たてもの', 'けんぶつ', 'たてぶつ', 'けんもの'], correct: 0, why: '**{建物|たてもの}** (tatemono).' },
        { q: '**宅配便**の{読|よ}み{方|かた}は？', options: ['たくはいびん', 'たくはいべん', 'だくはいびん', 'たっぱいびん'], correct: 0, why: '**{宅配便|たくはいびん}** — 便 đọc びん.' },
        { q: '**連絡**の{読|よ}み{方|かた}は？', options: ['れんらく', 'れいらく', 'れんかく', 'れらく'], correct: 0, why: '**{連絡|れんらく}** (renraku).' },
        { q: '**費用**の{読|よ}み{方|かた}は？', options: ['ひよう', 'ひよ', 'ふよう', 'ひいよう'], correct: 0, why: '**{費用|ひよう}** (hiyou).' },
        { q: '「たすかりました」を{漢字|かんじ}で{書|か}くと？', options: ['助かりました', '動かりました', '功かりました', '協かりました'], correct: 0, why: '**助かる** — 且 + 力.' },
        { q: '「もどりました」を{漢字|かんじ}で{書|か}くと？', options: ['戻りました', '涙りました', '帰りました', '返りました'], correct: 0, why: '**戻る** — quay lại chỗ vừa rời.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 3)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: 'あなたの{部屋|へや}の{壁|かべ}に、{何|なに}が{掛|か}けてありますか。', ro: 'Anata no heya no kabe ni, nani ga kakete arimasu ka.', vi: 'Trên tường phòng em có treo gì?' },
        { who: 'Bạn', role: 'candidate', text: '{時計|とけい}とカレンダーが{掛|か}けてあります。{家族|かぞく}の{写真|しゃしん}も{貼|は}ってあります。', ro: 'Tokei to karendaa ga kakete arimasu. Kazoku no shashin mo hatte arimasu.', vi: 'Có treo đồng hồ và lịch ạ. Ảnh gia đình cũng có dán.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「{窓|まど}が{開|あ}けてあります」と「{窓|まど}が{開|あ}いています」は、どう{違|ちが}いますか。', ro: '"Mado ga akete arimasu" to "mado ga aite imasu" wa, dou chigaimasu ka.', vi: '"窓が開けてあります" và "窓が開いています" khác nhau thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '「{開|あ}けてあります」は{誰|だれ}かが{開|あ}けて、そのままです。「{開|あ}いています」は{窓|まど}の{様子|ようす}だけです。', ro: '"Akete arimasu" wa dareka ga akete, sono mama desu. "Aite imasu" wa mado no yousu dake desu.', vi: '"開けてあります" là có ai đó mở rồi để nguyên. "開いています" chỉ tả trạng thái cửa sổ thôi ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{引|ひ}っ{越|こ}したら、{近所|きんじょ}の{人|ひと}に{何|なん}と{言|い}いますか。', ro: 'Hikkoshitara, kinjo no hito ni nan to iimasu ka.', vi: 'Chuyển đến rồi, em nói gì với hàng xóm?' },
        { who: 'Bạn', role: 'candidate', text: '「{隣|となり}に{引|ひ}っ{越|こ}してきたリンです。これからお{世話|せわ}になります。」と{言|い}います。', ro: '"Tonari ni hikkoshite kita Rin desu. Korekara osewa ni narimasu." to iimasu.', vi: 'Em nói: "Cháu là Lin mới chuyển đến bên cạnh. Từ nay mong cô chú giúp đỡ."' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{国|くに}のごみの{出|だ}し{方|かた}と、{日本|にほん}のごみの{出|だ}し{方|かた}は{同|おな}じですか。', ro: 'Kuni no gomi no dashikata to, Nihon no gomi no dashikata wa onaji desu ka.', vi: 'Cách đổ rác ở nước em và ở Nhật có giống nhau không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{違|ちが}います。{日本|にほん}は{規則|きそく}が{細|こま}かいので、{表|ひょう}を{冷蔵庫|れいぞうこ}に{貼|は}っておきました。', ro: 'Iie, chigaimasu. Nihon wa kisoku ga komakai node, hyou o reizouko ni hatte okimashita.', vi: 'Không ạ, khác nhau. Ở Nhật quy định chi tiết nên em đã dán sẵn bảng lịch lên tủ lạnh.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b18-b3-cuoi-bai',
      title: 'Kiểm tra cuối Bài 18 (8 câu — tổng hợp 3 buổi)',
      items: [
        { q: '{引|ひ}っ{越|こ}しのとき、{先輩|せんぱい}が{車|くるま}で{荷物|にもつ}を{運|はこ}んで（　）。', options: ['くれました', 'あげました', 'もらいました', 'おきました'], correct: 0, why: 'Đàn anh (が) làm cho tôi → **くれました**. 〔Senpai ga kuruma de nimotsu o hakonde kuremashita.〕' },
        { q: '{私|わたし}は{大家|おおや}さん（　）{電球|でんきゅう}を{取|と}り{替|か}えてもらいました。', options: ['に', 'が', 'を', 'で'], correct: 0, why: 'もらう: người làm + **に**. 〔Ooya-san ni denkyuu o torikaete moraimashita.〕' },
        { q: '（{先生|せんせい}に）この{書類|しょるい}を{見|み}て（　）。', options: ['いただけませんか', 'くれる？', 'あげませんか', 'おきませんか'], correct: 0, why: 'Nhờ người trên → **～ていただけませんか**. 〔Kono shorui o mite itadakemasen ka.〕' },
        { q: '{明日|あした}{友達|ともだち}が{来|く}るので、{部屋|へや}を{片付|かたづ}けて（　）。', options: ['おきます', 'あります', 'います', 'もらいます'], correct: 0, why: 'Làm trước để chuẩn bị → **～ておきます**. 〔Heya o katazukete okimasu.〕' },
        { q: '{冷蔵庫|れいぞうこ}にごみの{日|ひ}の{表|ひょう}が{貼|は}って（　）。', options: ['あります', 'おきます', 'います', 'くれます'], correct: 0, why: 'Vật + が + tha động từ, tả trạng thái → **～てあります**. 〔Gomi no hi no hyou ga hatte arimasu.〕' },
        { q: '{誰|だれ}もいないのに、{電気|でんき}が（　）います。', options: ['ついて', 'つけて', 'つけておいて', 'つけてあって'], correct: 0, why: 'Phát hiện trạng thái, không có người cố ý → tự động từ **ついて**います. 〔Denki ga tsuite imasu.〕' },
        { q: '「{手伝|てつだ}ってくれて、ありがとう。」と{同|おな}じ{意味|いみ}は？', options: ['{手伝|てつだ}ってもらって、うれしかったです。', '{手伝|てつだ}ってあげて、うれしかったです。', '{手伝|てつだ}っておいて、よかったです。', '{手伝|てつだ}ってあって、よかったです。'], correct: 0, why: 'Được giúp và biết ơn ≈ **{手伝|てつだ}ってもらって、うれしかった**. 〔Tetsudatte moratte, ureshikatta desu.〕' },
        { q: '「{近所|きんじょ}」の{意味|いみ}は？', options: ['khu gần nhà, hàng xóm', 'phòng ngay bên cạnh', 'chỗ tập kết rác', 'văn phòng nhà đất'], correct: 0, why: '**{近所|きんじょ}** (kinjo) = cả khu xung quanh nhà. Phòng ngay bên cạnh = {隣|となり}.' },
      ],
    },
  ],
};

/* ═══════════════════════ ③ LUYỆN THÊM — DỄ → KHÓ ═══════════════════════ */

type Mcq = Extract<Block, { t: 'mcq' }>['items'][number];

/** Bộ từ cho trắc nghiệm Nhật → Việt / Việt → Nhật (lấy đúng 50 từ của mục Từ vựng). */
const TU_LT: [w: string, ro: string, vi: string][] = [
  ['{一人暮|ひとりぐ}らし', 'hitorigurashi', 'sống một mình'],
  ['{不動産屋|ふどうさんや}', "fudousan'ya", 'văn phòng nhà đất'],
  ['{家賃|やちん}', 'yachin', 'tiền thuê nhà'],
  ['{大家|おおや}さん', 'ooya-san', 'chủ nhà (cho thuê)'],
  ['{二階建|にかいだ}て', 'nikaidate', 'nhà 2 tầng'],
  ['{鍵|かぎ}', 'kagi', 'chìa khoá'],
  ['{用意|ようい}します', 'youi shimasu', 'chuẩn bị sẵn (đồ vật)'],
  ['{支度|したく}します', 'shitaku shimasu', 'sửa soạn'],
  ['{留守|るす}', 'rusu', 'đi vắng'],
  ['{返事|へんじ}', 'henji', 'hồi âm, lời đáp'],
  ['{利用|りよう}します', 'riyou shimasu', 'sử dụng (dịch vụ)'],
  ['{段|だん}ボール', 'danbooru', 'thùng các-tông'],
  ['{箱|はこ}', 'hako', 'hộp, thùng'],
  ['{包|つつ}みます', 'tsutsumimasu', 'gói, bọc'],
  ['{届|とど}けます', 'todokemasu', 'mang đến, giao'],
  ['{届|とど}きます', 'todokimasu', '(hàng) đến nơi'],
  ['{宅配便|たくはいびん}', 'takuhaibin', 'chuyển phát tận nhà'],
  ['トラック', 'torakku', 'xe tải'],
  ['{家具|かぐ}', 'kagu', 'đồ nội thất'],
  ['{道具|どうぐ}', 'dougu', 'dụng cụ'],
  ['{壊|こわ}します', 'kowashimasu', 'làm hỏng, làm vỡ'],
  ['{引|ひ}き{出|だ}し', 'hikidashi', 'ngăn kéo'],
  ['{押|お}し{入|い}れ', 'oshiire', 'tủ âm tường kiểu Nhật'],
  ['{棚|たな}', 'tana', 'giá, kệ'],
  ['{壁|かべ}', 'kabe', 'tường'],
  ['{鏡|かがみ}', 'kagami', 'cái gương'],
  ['{掛|か}けます', 'kakemasu', 'treo'],
  ['{飾|かざ}ります', 'kazarimasu', 'trang trí, bày'],
  ['{貼|は}ります', 'harimasu', 'dán'],
  ['しまいます', 'shimaimasu', 'cất (vào chỗ)'],
  ['{取|と}り{替|か}えます', 'torikaemasu', 'thay (cái mới)'],
  ['{直|なお}します', 'naoshimasu', 'sửa'],
  ['{冷房|れいぼう}', 'reibou', 'điều hoà làm mát'],
  ['{水道|すいどう}', 'suidou', 'nước máy'],
  ['{近所|きんじょ}', 'kinjo', 'khu gần nhà, hàng xóm'],
  ['あいさつします', 'aisatsu shimasu', 'chào hỏi'],
  ['お{宅|たく}', 'otaku', 'nhà (người khác — lịch sự)'],
  ['お{世話|せわ}になります', 'osewa ni narimasu', 'mong được giúp đỡ'],
  ['{燃|も}えるごみ', 'moeru gomi', 'rác cháy được'],
  ['ごみ{置|お}き{場|ば}', 'gomi okiba', 'chỗ tập kết rác'],
  ['{規則|きそく}', 'kisoku', 'quy định'],
  ['お{礼|れい}', 'orei', 'lời cảm ơn, quà cảm ơn'],
  ['{頼|たの}みます', 'tanomimasu', 'nhờ'],
  ['{助|たす}かります', 'tasukarimasu', 'đỡ quá, được cứu'],
  ['{連|つ}れていきます', 'tsurete ikimasu', 'dẫn (ai) đi'],
  ['{寄|よ}ります', 'yorimasu', 'ghé qua'],
  ['{戻|もど}ります', 'modorimasu', 'quay lại'],
  ['{返|かえ}します', 'kaeshimasu', 'trả lại'],
  ['{役|やく}に{立|た}ちます', 'yaku ni tachimasu', 'có ích'],
  ['{喜|よろこ}びます', 'yorokobimasu', 'vui mừng'],
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
  id: 'b18-lt-1-tu-vung',
  kind: 'homework',
  title: 'Luyện thêm 1 · Từ vựng — 🟢 nhận mặt → 🟡 điền câu (40 câu)',
  goal: 'Nhớ chắc 50 từ của Bài 18 theo hai chiều (Nhật → Việt, Việt → Nhật) rồi chọn đúng từ trong câu, kể cả các cặp tự / tha (届ける・届く, 壊す・壊れる, 直す・直る).',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟢 Mức Dễ** — 25 câu Nhật → Việt và Việt → Nhật. Sai câu nào: đọc to từ đó 3 lần (romaji có ngay trong câu hỏi).',
        '**🟡 Mức Vừa** — 15 câu điền từ vào câu, đúng dạng 文脈規定 của đề N4.',
        'Lỗi hay mắc: {帰|かえ}る↔{戻|もど}る, {持|も}っていく↔{連|つ}れていく, {届|とど}ける↔{届|とど}く, {直|なお}す↔{治|なお}す, うれしい↔{喜|よろこ}ぶ, {近所|きんじょ}↔{隣|となり}, {用意|ようい}↔{支度|したく}.',
      ],
    },
    { t: 'h', text: '🟢 Mức 1 — Dễ: nhìn từ → nghĩa; nghe nghĩa → từ' },
    { t: 'mcq', id: 'b18-lt1-nv', title: 'Nhật → Việt (15 câu)', items: MCQ_NV(0, 15) },
    { t: 'mcq', id: 'b18-lt1-vn', title: 'Việt → Nhật (10 câu)', items: MCQ_VN(25, 35) },
    { t: 'h', text: '🟡 Mức 2 — Vừa: chọn từ hợp với câu (文脈規定)' },
    {
      t: 'mcq',
      id: 'b18-lt1-dien',
      title: 'Điền từ (15 câu)',
      items: [
        { q: '{来月|らいげつ}から（　）を{始|はじ}めます。{家族|かぞく}と{離|はな}れるのは{初|はじ}めてです。', options: ['{一人暮|ひとりぐ}らし', '{留守|るす}', '{二階建|にかいだ}て', 'お{宅|たく}'], correct: 0, why: 'Sống xa gia đình lần đầu = **{一人暮|ひとりぐ}らし**. 〔Raigetsu kara hitorigurashi o hajimemasu.〕' },
        { q: '{部屋|へや}の（　）は{毎月|まいつき}{25日|にじゅうごにち}までに{払|はら}ってください。', options: ['{家賃|やちん}', '{返事|へんじ}', '{規則|きそく}', 'お{礼|れい}'], correct: 0, why: 'Tiền trả hằng tháng cho phòng = **{家賃|やちん}**. 〔Heya no yachin wa maitsuki nijuugonichi made ni haratte kudasai.〕' },
        { q: 'ドアが{開|あ}きません。（　）を{部屋|へや}の{中|なか}に{忘|わす}れました。', options: ['{鍵|かぎ}', '{棚|たな}', '{箱|はこ}', '{鏡|かがみ}'], correct: 0, why: 'Cửa không mở được → quên **{鍵|かぎ}** (chìa khoá) trong phòng. 〔Kagi o heya no naka ni wasuremashita.〕' },
        { q: '{宅配便|たくはいびん}が{来|き}ましたが、（　）だったので、{受|う}け{取|と}れませんでした。', options: ['{留守|るす}', '{近所|きんじょ}', '{返事|へんじ}', '{支度|したく}'], correct: 0, why: 'Đi vắng nên không nhận được hàng = **{留守|るす}**. 〔Rusu datta node, uketoremasen deshita.〕' },
        { q: '{皿|さら}は{割|わ}れやすいので、{紙|かみ}で（　）から{箱|はこ}に{入|い}れます。', options: ['{包|つつ}んで', '{掛|か}けて', '{貼|は}って', '{飾|かざ}って'], correct: 0, why: 'Bọc bằng giấy = **{包|つつ}む** → {包|つつ}んで. 〔Kami de tsutsunde kara hako ni iremasu.〕' },
        { q: '{国|くに}の{家族|かぞく}から{手紙|てがみ}が（　）。', options: ['{届|とど}きました', '{届|とど}けました', '{返|かえ}しました', '{戻|もど}しました'], correct: 0, why: 'Thư tự đến → **{届|とど}く** (tự). 〔Kazoku kara tegami ga todokimashita.〕' },
        { q: '{新|あたら}しい{部屋|へや}は（　）{付|つ}きなので、ベッドを{買|か}わなくてもいいです。', options: ['{家具|かぐ}', '{道具|どうぐ}', '{水道|すいどう}', '{冷房|れいぼう}'], correct: 0, why: 'Có sẵn giường → **{家具付|かぐつ}き**. 〔Kagu tsuki na node, beddo o kawanakute mo ii desu.〕' },
        { q: '{弟|おとうと}が{私|わたし}のパソコンを（　）。もう{動|うご}きません。', options: ['{壊|こわ}しました', '{壊|こわ}れました', '{直|なお}りました', '{届|とど}きました'], correct: 0, why: 'Có người làm (弟が … を) → tha động từ **{壊|こわ}す**. 〔Otouto ga watashi no pasokon o kowashimashita.〕' },
        { q: '{家族|かぞく}の{写真|しゃしん}を{壁|かべ}に（　）。', options: ['{掛|か}けました', 'しまいました', '{包|つつ}みました', '{届|とど}けました'], correct: 0, why: 'Treo lên tường = **{壁|かべ}に{掛|か}ける**. 〔Kazoku no shashin o kabe ni kakemashita.〕' },
        { q: '{使|つか}わない{布団|ふとん}は{押|お}し{入|い}れに（　）ください。', options: ['しまって', '{飾|かざ}って', '{貼|は}って', '{寄|よ}って'], correct: 0, why: 'Cất vào tủ = **しまう**. 〔Oshiire ni shimatte kudasai.〕' },
        { q: '{壊|こわ}れた{自転車|じてんしゃ}を{自転車屋|じてんしゃや}さんで（　）もらいました。', options: ['{直|なお}して', '{治|なお}して', '{戻|もど}して', '{返|かえ}して'], correct: 0, why: 'Sửa đồ = **{直|なお}す** (治す là chữa bệnh). 〔Jitenshaya-san de naoshite moraimashita.〕' },
        { q: '{引|ひ}っ{越|こ}したら、{近所|きんじょ}の{人|ひと}に（　）に{行|い}きましょう。', options: ['あいさつ', 'お{宅|たく}', '{留守|るす}', '{返事|へんじ}'], correct: 0, why: 'Đi chào = **あいさつに{行|い}く**. 〔Kinjo no hito ni aisatsu ni ikimashou.〕' },
        { q: 'ごみは{夜|よる}に{出|だ}してはいけません。それがこのアパートの（　）です。', options: ['{規則|きそく}', 'お{礼|れい}', '{費用|ひよう}', '{返事|へんじ}'], correct: 0, why: 'Quy định của khu nhà = **{規則|きそく}**. 〔Sore ga kono apaato no kisoku desu.〕' },
        { q: '{傘|かさ}を{忘|わす}れたので、{教室|きょうしつ}に（　）。', options: ['{戻|もど}りました', '{帰|かえ}りました', '{返|かえ}しました', '{連|つ}れていきました'], correct: 0, why: 'Quay lại chỗ vừa rời = **{戻|もど}る**. 〔Kyoushitsu ni modorimashita.〕' },
        { q: '{友達|ともだち}にお{土産|みやげ}をあげたら、とても（　）。', options: ['{喜|よろこ}んでくれました', 'うれしかったです', '{役|やく}に{立|た}ちました', '{助|たす}かりました'], correct: 0, why: 'Tả cảm xúc NGƯỜI KHÁC (bạn) → **{喜|よろこ}ぶ**; くれる vì bạn vui là "cho mình". うれしかった là cảm xúc của chính mình. 〔Totemo yorokonde kuremashita.〕' },
      ],
    },
  ],
};

const LT_2: Lesson = {
  id: 'b18-lt-2-han-tu',
  kind: 'homework',
  title: 'Luyện thêm 2 · Chữ Hán — 🟢 đọc → 🟡 chọn chữ → 🔴 chữ giống, đồng âm (22 câu)',
  goal: 'Đọc và viết đúng 15 chữ Hán mới trong từ: chọn cách đọc, chọn chữ đúng cho từ viết kana, phân biệt chữ trông giống (建・健, 返・坂, 連・運, 庭・底) và từ đồng âm (返す・帰す, 直す・治す).',
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
      id: 'b18-lt2-doc',
      title: '🟢 漢字読み — cách đọc của từ in đậm (10 câu)',
      items: [
        { q: '{駅前|えきまえ}に**建**てたマンションです。', options: ['た', 'けん', 'こん', 'たて'], correct: 0, why: '**{建|た}てた** (tateta) — {建|た}てる.' },
        { q: '**県**の{図書館|としょかん}は{大|おお}きいです。', options: ['けん', 'げん', 'しま', 'まち'], correct: 0, why: '**{県|けん}** (ken) — tỉnh.' },
        { q: 'ごみ**箱**はどこですか。', options: ['ばこ', 'はこ', 'そう', 'ぱこ'], correct: 0, why: '**ごみ{箱|ばこ}** (gomibako) — sau danh từ đọc ばこ.' },
        { q: 'この**値段**は{高|たか}すぎます。', options: ['ねだん', 'ちだん', 'ねたん', 'ねいだん'], correct: 0, why: '**{値段|ねだん}** (nedan) — 段 ダン.' },
        { q: 'この**道具**を{借|か}りてもいいですか。', options: ['どうぐ', 'みちぐ', 'どうぐう', 'とうぐ'], correct: 0, why: '**{道具|どうぐ}** (dougu).' },
        { q: '**自宅**の{住所|じゅうしょ}を{書|か}いてください。', options: ['じたく', 'じだく', 'じいえ', 'しなく'], correct: 0, why: '**{自宅|じたく}** (jitaku) — nhà riêng.' },
        { q: '{子|こ}どもを{公園|こうえん}に**連**れていきます。', options: ['つ', 'れん', 'かれ', 'と'], correct: 0, why: '**{連|つ}れていきます** (tsurete ikimasu).' },
        { q: 'お**礼**の{手紙|てがみ}を{書|か}きました。', options: ['れい', 'らい', 'れ', 'しつ'], correct: 0, why: '**お{礼|れい}** (orei).' },
        { q: '{困|こま}ったときは、{先輩|せんぱい}に**頼**ります。', options: ['たよ', 'たの', 'らい', 'たず'], correct: 0, why: '**{頼|たよ}ります** (tayorimasu) — dựa vào. 頼む đọc たのむ; 頼る đọc たよる.' },
        { q: '**家庭**の{事情|じじょう}で{国|くに}に{帰|かえ}ります。', options: ['かてい', 'かにわ', 'いえにわ', 'けてい'], correct: 0, why: '**{家庭|かてい}** (katei) — gia đình. 庭 trong từ ghép đọc テイ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b18-lt2-chon',
      title: '🟡 表記 — chọn chữ đúng (8 câu)',
      items: [
        { q: 'あの**たてもの**は{何|なん}ですか。', options: ['建物', '健物', '律物', '立物'], correct: 0, why: '**建物** — 廴 + 聿.' },
        { q: '**だん**ボールを{三|みっ}つください。', options: ['段', '投', '設', '殿'], correct: 0, why: '**段**ボール. 投 (ném), 設 (thiết lập) cũng có 殳 nhưng khác.' },
        { q: '{新|あたら}しい**かぐ**がほしいです。', options: ['家具', '家真', '家見', '家目'], correct: 0, why: '**家具**.' },
        { q: '**たくはいびん**で{送|おく}ります。', options: ['宅配便', '宅配使', '宇配便', '宅記便'], correct: 0, why: '**宅配便** — 宅 (宀 + 乇) ≠ 宇 (vũ trụ).' },
        { q: '{困|こま}っている{人|ひと}を**たすけ**ました。', options: ['助け', '動け', '功け', '働け'], correct: 0, why: '**助ける** — 且 + 力.' },
        { q: 'コートをハンガーに**かけ**ました。', options: ['掛け', '書け', '欠け', '架け'], correct: 0, why: '**掛ける** (treo). 架ける dùng cho bắc cầu — không phải treo áo.' },
        { q: '{引|ひ}っ{越|こ}しの**ひよう**はいくらですか。', options: ['費用', '貴用', '費要', '火用'], correct: 0, why: '**費用** — 費 có 弗 trên 貝. 貴 (quý) có 中 + 一.' },
        { q: '{庭|にわ}に{木|き}を{植|う}えました。— 「にわ」は？', options: ['庭', '底', '店', '廷'], correct: 0, why: '**庭** — 广 + 廷.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b18-lt2-bay',
      title: '🔴 Bẫy — chữ trông giống, đồng âm (4 câu)',
      items: [
        { q: '{図書館|としょかん}に{本|ほん}を**かえし**ます。— chữ đúng là？', options: ['返し', '帰し', '反し', '坂し'], correct: 0, why: 'Trả sách = **返す**. 帰す (かえす) = cho (ai) về nhà — đồng âm khác nghĩa.' },
        { q: '{医者|いしゃ}に{病気|びょうき}を**なおして**もらいました。— chữ đúng là？', options: ['治して', '直して', '値して', '置して'], correct: 0, why: 'Chữa BỆNH = **治す**. Sửa ĐỒ = 直す (bài này).' },
        { q: '「{運|うん}」と「{連|れん}」— câu nào dùng đúng chữ？', options: ['{荷物|にもつ}を連ぶ', '{友達|ともだち}に連絡する', '{車|くるま}を連転する', '連動する'], correct: 1, why: '**連絡** ✓. 運ぶ・運転・運動 đều là 運 (có ⼍ trên 車).' },
        { q: '「けんこう（khoẻ mạnh）」の{漢字|かんじ}は？', options: ['建康', '健康', '件康', '県康'], correct: 1, why: '**健康** — có 亻. 建 (xây) không có 亻.' },
      ],
    },
  ],
};

const LT_3: Lesson = {
  id: 'b18-lt-3-chia-the',
  kind: 'homework',
  title: 'Luyện thêm 3 · Chia thể — ～てあげる・くれる・もらう, ～ておく, ～てある (26 câu gõ)',
  goal: 'Chia nhanh và đúng thể て của mọi nhóm động từ khi ghép với あげる／くれる／もらう／いただけませんか, おく (cả dạng nói ～とく) và ある — nền tảng để không sai ở phần ngữ pháp.',
  minutes: 25,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟢 Mức 1** — 10 câu ～てあげる／くれる／もらう. **🟡 Mức 2** — 8 câu ～ておく. **🔴 Mức 3** — 8 câu ～てある + chọn tự / tha.',
        'Thể て: う・つ・る → って · む・ぶ・ぬ → んで · く → いて (行く → 行って) · ぐ → いで · す → して · nhóm 2: bỏ る + て · する → して · 来る → 来て.',
      ],
    },
    {
      t: 'quiz',
      id: 'b18-lt3-jujyu',
      title: '🟢 ～てあげる・くれる・もらう (10 câu)',
      kind: 'fill',
      grammar: 'thể て + あげる／くれる／もらう／いただけませんか',
      items: [
        { q: '{運|はこ}ぶ → ～てあげました', answers: V('{運|はこ}んであげました'), hint: 'ぶ → んで' },
        { q: '{送|おく}る → ～てくれました', answers: V('{送|おく}ってくれました'), hint: 'る (nhóm 1) → って' },
        { q: '{迎|むか}えに{来|く}る → ～てもらいました', answers: V('{迎|むか}えに{来|き}てもらいました'), hint: '来る → 来て' },
        { q: '{直|なお}す → ～てくれませんか', answers: V('{直|なお}してくれませんか'), hint: 'す → して' },
        { q: '{包|つつ}む → ～てもらえませんか', answers: V('{包|つつ}んでもらえませんか'), hint: 'む → んで' },
        { q: '{書|か}く → ～ていただけませんか', answers: V('{書|か}いていただけませんか'), hint: 'く → いて' },
        { q: '{連|つ}れていく → ～てくれました', answers: V('{連|つ}れていってくれました'), hint: '行く → 行って' },
        { q: '{取|と}り{替|か}える → ～てもらいました', answers: V('{取|と}り{替|か}えてもらいました'), hint: 'nhóm 2' },
        { q: '{急|いそ}ぐ → ～てくれませんか (thể て của ぐ là いで)', answers: V('{急|いそ}いでくれませんか'), hint: 'ぐ → いで' },
        { q: '{手伝|てつだ}う → ～てくれて、ありがとう', answers: V('{手伝|てつだ}ってくれて、ありがとう', '{手伝|てつだ}ってくれてありがとう'), hint: 'う → って' },
      ],
    },
    {
      t: 'quiz',
      id: 'b18-lt3-oku',
      title: '🟡 ～ておく (8 câu)',
      kind: 'fill',
      grammar: 'thể て + おく (おきます・おきました・おいて・おこう) · nói tắt ～とく／～どく',
      items: [
        { q: '{調|しら}べる → ～ておきます', answers: V('{調|しら}べておきます') },
        { q: '{頼|たの}む → ～ておきました', answers: V('{頼|たの}んでおきました') },
        { q: '{置|お}く → ～ておいてください', answers: V('{置|お}いておいてください') },
        { q: '{冷|ひ}やす → ～ておこう', answers: V('{冷|ひ}やしておこう') },
        { q: '{予約|よやく}する → ～ておいたほうがいいです', answers: V('{予約|よやく}しておいたほうがいいです') },
        { q: 'する → văn nói ～とく', answers: ['しとく'] },
        { q: '{飲|の}む → văn nói ～どく', answers: V('{飲|の}んどく') },
        { q: '{書|か}いておいて → văn nói', answers: V('{書|か}いといて') },
      ],
    },
    {
      t: 'quiz',
      id: 'b18-lt3-aru',
      title: '🔴 ～てある và chọn tự / tha (8 câu)',
      kind: 'fill',
      grammar: 'N が 他動詞て あります · N が 自動詞て います',
      items: [
        { q: '{並|なら}べる → ～てあります', answers: V('{並|なら}べてあります') },
        { q: '{飾|かざ}る → ～てあります', answers: V('{飾|かざ}ってあります') },
        { q: 'しまう → ～てあります', answers: ['しまってあります'] },
        { q: '{用意|ようい}する → ～てあります', answers: V('{用意|ようい}してあります') },
        { q: '{窓|まど}が（{開|あ}く／{開|あ}ける）＿＿あります。', answers: V('{開|あ}けて'), hint: 'てある → tha động từ' },
        { q: '{窓|まど}が（{開|あ}く／{開|あ}ける）＿＿います。(chỉ tả)', answers: V('{開|あ}いて'), hint: 'ている (trạng thái) → tự động từ' },
        { q: '{車|くるま}が（{止|と}まる／{止|と}める）＿＿あります。', answers: V('{止|と}めて') },
        { q: '{電気|でんき}が（つく／つける）＿＿います。(chỉ tả)', answers: ['ついて'] },
      ],
    },
  ],
};

const LT_4: Lesson = {
  id: 'b18-lt-4-ngu-phap',
  kind: 'homework',
  title: 'Luyện thêm 4 · Ngữ pháp — 🟡 chọn hướng cho – nhận → 🔴 ～ている・～てある・～ておく (28 câu)',
  goal: 'Chọn đúng あげる／くれる／もらう và trợ từ đi kèm, chọn đúng mức lịch sự khi nhờ; phân biệt ～ている (tự)・～てある・～ておく trong câu có ngữ cảnh — đúng các bẫy đề N4.',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟡 Mức 2** — 10 câu chọn hướng + trợ từ + mức lịch sự.',
        '**🔴 Mức 3** — 10 câu chọn ～ている／～てある／～ておく + 8 câu điền hoàn chỉnh.',
        'Bí quyết: (1) tìm **người làm** và **người nhận**; (2) thấy **vật + が** và kết quả còn đó → ～てある; **người + を** và mục đích về sau → ～ておく; không có người cố ý → 自動詞 ～ている.',
      ],
    },
    {
      t: 'mcq',
      id: 'b18-lt4-huong',
      title: '🟡 Chọn hướng cho – nhận (10 câu)',
      items: [
        { q: '{困|こま}っていたとき、{知|し}らない{人|ひと}が{道|みち}を{教|おし}えて（　）。', options: ['くれました', 'あげました', 'もらいました', 'おきました'], correct: 0, why: 'Người lạ (が) làm cho tôi → **くれました**. 〔Shiranai hito ga michi o oshiete kuremashita.〕' },
        { q: '{私|わたし}は{駅員|えきいん}さんに{乗|の}り{換|か}えを{教|おし}えて（　）。', options: ['くれました', 'あげました', 'もらいました', 'ありました'], correct: 2, why: 'Tôi (は) + người làm **に** → **もらいました**. 〔Ekiin-san ni norikae o oshiete moraimashita.〕' },
        { q: 'マルコさんはお{年寄|としよ}りの{荷物|にもつ}を{持|も}って（　）。', options: ['くれました', 'あげました', 'もらいました', 'いただきました'], correct: 1, why: 'Người thứ ba (マルコ) làm cho người thứ ba → **あげました**. 〔Maruko-san wa otoshiyori no nimotsu o motte agemashita.〕' },
        { q: '{母|はは}（　）{国|くに}の{料理|りょうり}を{作|つく}ってくれました。', options: ['が', 'に', 'を', 'で'], correct: 0, why: 'くれる: người làm + **が**. 〔Haha ga kuni no ryouri o tsukutte kuremashita.〕' },
        { q: '{私|わたし}は{兄|あに}（　）{宿題|しゅくだい}を{手伝|てつだ}ってもらいました。', options: ['が', 'に', 'を', 'と'], correct: 1, why: 'もらう: người làm + **に**. 〔Ani ni shukudai o tetsudatte moraimashita.〕' },
        { q: '{友達|ともだち}（　）{手伝|てつだ}ってあげました。({手伝|てつだ}う giữ trợ từ của nó)', options: ['を', 'に', 'が', 'で'], correct: 0, why: '{手伝|てつだ}う nhận người bằng **を** → {友達|ともだち}を{手伝|てつだ}ってあげました. 〔Tomodachi o tetsudatte agemashita.〕' },
        { q: '（{部長|ぶちょう}に）この{資料|しりょう}を{見|み}て（　）。', options: ['いただけませんか', 'くれない？', 'あげませんか', 'もらう？'], correct: 0, why: 'Trưởng phòng (người trên) → **～ていただけませんか**. 〔Kono shiryou o mite itadakemasen ka.〕' },
        { q: '（{親|した}しい{友達|ともだち}に）ねえ、ちょっとこれ{持|も}って（　）？', options: ['くれない', 'いただけません', 'あげない', 'おかない'], correct: 0, why: 'Bạn thân → **～てくれない？** 〔Nee, chotto kore motte kurenai?〕' },
        { q: '（{先生|せんせい}の{荷物|にもつ}が{多|おお}い）{先生|せんせい}、{一|ひと}つ（　）。', options: ['{持|も}ちましょうか', '{持|も}ってあげます', '{持|も}ってくれます', '{持|も}ってもらいます'], correct: 0, why: 'Đề nghị giúp người trên → **～ましょうか**, không nói ～てあげます. 〔Sensei, hitotsu mochimashou ka.〕' },
        { q: '{山口|やまぐち}さんが{作|つく}って（　）ケーキは、とてもおいしかったです。', options: ['くれた', 'あげた', 'もらった', 'おいた'], correct: 0, why: 'Cô Yamaguchi làm cho tôi → **くれた** (bổ nghĩa cho ケーキ). 〔Yamaguchi-san ga tsukutte kureta keeki wa, totemo oishikatta desu.〕' },
      ],
    },
    {
      t: 'mcq',
      id: 'b18-lt4-aru-oku',
      title: '🔴 ～ている・～てある・～ておく (10 câu)',
      items: [
        { q: 'あ、{誰|だれ}かの{財布|さいふ}が{落|お}ちて（　）。', options: ['います', 'あります', 'おきます', 'くれます'], correct: 0, why: '{落|お}ちる là **tự** động từ, không ai cố ý → **～ています**. 〔Dareka no saifu ga ochite imasu.〕' },
        { q: 'テーブルの{上|うえ}に{手紙|てがみ}が{置|お}いて（　）。{大家|おおや}さんからです。', options: ['あります', 'います', 'おきます', 'あげます'], correct: 0, why: 'Vật + が + tha động từ, có người cố ý để → **～てあります**. 〔Tegami ga oite arimasu.〕' },
        { q: '{明日|あした}は{早|はや}いので、{今夜|こんや}{荷物|にもつ}を{用意|ようい}して（　）。', options: ['おきます', 'あります', 'います', 'もらいます'], correct: 0, why: 'Chuẩn bị trước + tân ngữ を → **～ておきます**. 〔Kon\'ya nimotsu o youi shite okimasu.〕' },
        { q: 'あれ？トイレの{電気|でんき}が（　）。{電球|でんきゅう}が{古|ふる}いからだと{思|おも}います。', options: ['{消|き}えています', '{消|け}してあります', '{消|け}しておきます', '{消|き}えてあります'], correct: 0, why: 'Bóng đèn cũ tự tắt, không ai cố ý → tự động từ **{消|き}えています**. ～てある cần người cố ý làm; ~~{消|き}えてあります~~ sai vì {消|き}える là tự động từ.' },
        { q: 'お{客|きゃく}さんが{来|く}るので、{玄関|げんかん}にスリッパが{並|なら}べて（　）。', options: ['あります', 'います', 'くれます', 'おきます'], correct: 0, why: 'Vật + が + có chủ ý (cho khách) → **～てあります**. 〔Surippa ga narabete arimasu.〕' },
        { q: '{学生|がくせい}が{教室|きょうしつ}の{机|つくえ}を{並|なら}べて（　）。（{今|いま}、{動|うご}かしている）', options: ['います', 'あります', 'おきます', 'あげます'], correct: 0, why: 'Đang làm (hành động diễn ra) → tha động từ + **～ています**. 〔Gakusei ga tsukue o narabete imasu.〕' },
        { q: 'A「{会議室|かいぎしつ}の{予約|よやく}は？」 B「{昨日|きのう}{予約|よやく}して（　）よ。」', options: ['おきました', 'ありました', 'いました', 'くれました'], correct: 0, why: '"Hôm qua tôi đã đặt sẵn" — kể hành động + người làm (tôi) → **～ておきました**. (もう予約してあります cũng được nhưng không đi với {昨日|きのう} + ～ました như đáp án này.)' },
        { q: '{箱|はこ}に「われもの（{割|わ}れ{物|もの}）」と{書|か}いて（　）から、{気|き}をつけて{運|はこ}んでください。', options: ['あります', 'います', 'おきます', 'あげます'], correct: 0, why: 'Chữ đã được viết sẵn trên thùng → **～てあります**. 〔"Waremono" to kaite arimasu kara…〕' },
        { q: '{窓|まど}が{開|あ}いて（　）から、{閉|し}めてください。', options: ['います', 'あります', 'おきます', 'くれます'], correct: 0, why: '{開|あ}く là **tự** động từ → chỉ đi với ～ています. ~~{開|あ}いてあります~~ sai.' },
        { q: '{帰|かえ}る{前|まえ}に、{電気|でんき}を{消|け}して（　）ね。', options: ['おいて', 'あって', 'いて', 'あげて'], correct: 0, why: 'Dặn làm cho xong → **～ておいて**. 〔Kaeru mae ni, denki o keshite oite ne.〕' },
      ],
    },
    {
      t: 'quiz',
      id: 'b18-lt4-dien',
      title: '🔴 Điền hoàn chỉnh (8 câu)',
      kind: 'fill',
      grammar: '～てあげる · ～てくれる · ～てもらう · ～ておく · ～てある · ～ている',
      items: [
        { q: '{引|ひ}っ{越|こ}しのとき、{友達|ともだち}が{三人|さんにん}も{手伝|てつだ}って（　）。', answers: ['くれました'], hint: 'người khác → tôi' },
        { q: '{私|わたし}は{店|みせ}の{人|ひと}に{家具|かぐ}を{部屋|へや}まで{運|はこ}んで（　）。', answers: ['もらいました'], hint: 'tôi ← người khác (に)' },
        { q: '{隣|となり}の{子|こ}どもに{折|お}り{紙|がみ}を{教|おし}えて（　）。', answers: ['あげました'], hint: 'tôi → người khác' },
        { q: '{旅行|りょこう}の{前|まえ}に、{両替|りょうがえ}して（　）ほうがいいですよ。', answers: ['おいた'], hint: '～ておいたほうがいい' },
        { q: 'パーティーの{料理|りょうり}はもう{作|つく}って（　）。{冷蔵庫|れいぞうこ}に{入|はい}っています。', answers: ['あります'], hint: 'đã sẵn, kết quả còn đó' },
        { q: '{壁|かべ}に{古|ふる}い{地図|ちず}が{貼|は}って（　）。{前|まえ}の{人|ひと}が{貼|は}ったんでしょう。', answers: ['あります'], hint: 'vật + が + tha động từ' },
        { q: '{誰|だれ}もいない{部屋|へや}で、テレビが（つく）（　）。', answers: V('ついています'), hint: 'tự động từ + ています' },
        { q: '（{先生|せんせい}に）すみません、ここの{意味|いみ}を{教|おし}えて（　）か。', answers: ['いただけません', 'もらえません'], hint: 'nhờ người trên' },
      ],
    },
  ],
};

const LT_5: Lesson = {
  id: 'b18-lt-5-tong-hop',
  kind: 'homework',
  title: 'Luyện thêm 5 · Đề tổng hợp kiểu N4 — 文字・語彙 · 文法 · 読解 (17 câu, có thang điểm)',
  goal: 'Làm một đề mini đúng ba phần của JLPT N4 (chữ – từ, ngữ pháp, đọc) trên nội dung Bài 18, tự chấm theo thang điểm và biết sai câu nào thì ôn mục nào.',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Cách làm & thang điểm',
      items: [
        'Bấm giờ **25 phút**, không mở bài. ① 文字・語彙 6 câu · ② 文法 8 câu (6 chọn + 2 sắp xếp ★) · ③ 読解 3 câu.',
        'Mỗi câu 1 điểm, tổng **17**. **15–17**: rất tốt, sang Bài 19 · **12–14**: đạt, ôn lại mục mình sai · **≤ 11**: học lại Ngữ pháp ① ② ③ và làm Luyện thêm 3–4.',
        'Sai ① → Từ vựng + Chữ Hán · sai ② câu あげる／くれる／もらう → Ngữ pháp ① · sai câu ～ておく／～てある → Ngữ pháp ②③ + bảng năm câu cửa sổ · sai ③ → Đọc hiểu.',
      ],
    },
    { t: 'h', text: '① 文字・語彙' },
    {
      t: 'mcq',
      id: 'b18-lt5-tu',
      title: '文字・語彙 (6 câu)',
      items: [
        { q: '**家賃**は{毎月|まいつき}{払|はら}います。— {読|よ}み{方|かた}', options: ['やちん', 'かちん', 'やじん', 'いえちん'], correct: 0, why: '**{家賃|やちん}** (yachin).' },
        { q: '**近所**の{人|ひと}にあいさつしました。— {読|よ}み{方|かた}', options: ['きんじょ', 'ちかじょ', 'きんしょ', 'きんどころ'], correct: 0, why: '**{近所|きんじょ}** (kinjo) — 所 đọc じょ (âm đục).' },
        { q: '{荷物|にもつ}を**はこ**に{入|い}れます。— {漢字|かんじ}', options: ['箱', '相', '筒', '籍'], correct: 0, why: '**箱**.' },
        { q: '{電球|でんきゅう}が{切|き}れたので、{新|あたら}しいのに（　）。', options: ['{取|と}り{替|か}えました', '{包|つつ}みました', '{飾|かざ}りました', '{届|とど}きました'], correct: 0, why: 'Thay cái mới = **{取|と}り{替|か}える**.' },
        { q: '{子|こ}どもを{病院|びょういん}に（　）。', options: ['{連|つ}れていきました', '{持|も}っていきました', '{届|とど}けました', 'しまいました'], correct: 0, why: 'Người → **{連|つ}れていく**.' },
        { q: '「{留守|るす}にします」に{意味|いみ}がいちばん{近|ちか}いのは？', options: ['{出|で}かけて、{家|いえ}にいません', '{家|いえ}で{寝|ね}ています', '{鍵|かぎ}をかけません', 'お{客|きゃく}さんが{来|き}ます'], correct: 0, why: '{留守|るす} = vắng nhà.' },
      ],
    },
    { t: 'h', text: '② 文法' },
    {
      t: 'mcq',
      id: 'b18-lt5-np',
      title: '文法 — 文法形式の判断 (6 câu) + 文の組み立て ★ (2 câu)',
      items: [
        { q: '{雨|あめ}が{降|ふ}ってきたとき、{友達|ともだち}が{傘|かさ}を{貸|か}して（　）。', options: ['くれました', 'あげました', 'もらいました', 'ありました'], correct: 0, why: '**くれました** — bạn (が) làm cho tôi.' },
        { q: '{私|わたし}は{先輩|せんぱい}（　）レポートを{見|み}てもらいました。', options: ['に', 'が', 'を', 'で'], correct: 0, why: 'もらう: người làm + **に**.' },
        { q: '{来週|らいしゅう}パーティーがあるので、{今日|きょう}{飲|の}み{物|もの}を{買|か}って（　）。', options: ['おきます', 'あります', 'います', 'くれます'], correct: 0, why: 'Làm trước để chuẩn bị → **～ておきます**.' },
        { q: '{玄関|げんかん}に{花|はな}が{飾|かざ}って（　）。', options: ['あります', 'おきます', 'います', 'くれます'], correct: 0, why: 'Vật + が + tha động từ → **～てあります**.' },
        { q: '{店|みせ}の{前|まえ}に{車|くるま}が（　）います。{誰|だれ}の{車|くるま}でしょうか。', options: ['{止|と}まって', '{止|と}めて', '{止|と}めておいて', '{止|と}まり'], correct: 0, why: 'Không biết ai đỗ, chỉ tả → tự động từ **{止|と}まって**います.' },
        { q: '（{初|はじ}めて{会|あ}った{人|ひと}に）すみません、シャッターを{押|お}して（　）。', options: ['いただけませんか', 'くれ', 'あげませんか', 'おきませんか'], correct: 0, why: 'Nhờ người lạ → **～ていただけませんか**.' },
        { q: '★ {山口|やまぐち}さんが ＿＿ ＿＿ ★ ＿＿。（くれました／ごみの／{教|おし}えて／{出|だ}し{方|かた}を）', options: ['くれました', 'ごみの', '{教|おし}えて', '{出|だ}し{方|かた}を'], correct: 2, why: 'Câu đúng: {山口|やまぐち}さんが **ごみの {出|だ}し{方|かた}を {教|おし}えて くれました**. Ô ★ (thứ 3) = **{教|おし}えて**.' },
        { q: '★ {冷蔵庫|れいぞうこ}に ＿＿ ＿＿ ★ ＿＿ から、{飲|の}んでください。（あります／ジュースが／{冷|ひ}やして／オレンジ）', options: ['あります', 'ジュースが', '{冷|ひ}やして', 'オレンジ'], correct: 2, why: 'Câu đúng: {冷蔵庫|れいぞうこ}に **オレンジ ジュースが {冷|ひ}やして あります** から. Ô ★ (thứ 3) = **{冷|ひ}やして**.' },
      ],
    },
    { t: 'h', text: '③ 読解' },
    {
      t: 'passage',
      title: 'ナタポンさんのメモ（{引|ひ}っ{越|こ}しの{日|ひ}）',
      intro: 'ナタポン viết mẩu ghi chú này để lại trên bàn cho bạn cùng phòng mới là カルロス. Đọc rồi trả lời câu hỏi.',
      paras: [
        { text: 'カルロスさんへ' },
        { text: '{今日|きょう}から{同|おな}じ{部屋|へや}ですね。よろしくお{願|ねが}いします。{僕|ぼく}は{夜|よる}{8時|はちじ}までアルバイトなので、{先|さき}にメモを{書|か}いておきます。' },
        { text: 'カルロスさんの{部屋|へや}の{鍵|かぎ}は、{机|つくえ}の{引|ひ}き{出|だ}しに{入|い}れてあります。{布団|ふとん}は{押|お}し{入|い}れにしまってあります。{冷蔵庫|れいぞうこ}の{右|みぎ}の{棚|たな}は{空|あ}けておきましたから、{自由|じゆう}に{使|つか}ってください。' },
        { text: 'ごみの{日|ひ}の{表|ひょう}は{台所|だいどころ}の{壁|かべ}に{貼|は}ってあります。{明日|あした}は{燃|も}えるごみの{日|ひ}なので、{今夜|こんや}は{玄関|げんかん}に{置|お}いておいてください。{朝|あさ}、{僕|ぼく}が{出|だ}しておきます。' },
        { text: 'わからないことがあったら、{電話|でんわ}してください。ナタポン' },
      ],
    },
    {
      t: 'mcq',
      id: 'b18-lt5-doc',
      title: '読解 (3 câu)',
      items: [
        { q: 'カルロスさんの{部屋|へや}の{鍵|かぎ}はどこにありますか。', options: ['{押|お}し{入|い}れの{中|なか}', '{机|つくえ}の{引|ひ}き{出|だ}しの{中|なか}', '{冷蔵庫|れいぞうこ}の{棚|たな}', '{玄関|げんかん}'], correct: 1, why: '**{鍵|かぎ}は、{机|つくえ}の{引|ひ}き{出|だ}しに{入|い}れてあります**. Tủ âm tường đựng chăn đệm. 〔Kagi wa, tsukue no hikidashi ni irete arimasu.〕' },
        { q: '{明日|あした}の{朝|あさ}、{燃|も}えるごみを{出|だ}すのは{誰|だれ}ですか。', options: ['カルロスさん', 'ナタポンさん', '{二人|ふたり}で{出|だ}す', '{大家|おおや}さん'], correct: 1, why: 'Tối nay カルロス để rác ở lối vào (**{置|お}いておいてください**), sáng mai **{僕|ぼく}が{出|だ}しておきます** — ナタポン đổ. 〔Asa, boku ga dashite okimasu.〕' },
        { q: 'メモの{内容|ないよう}と{合|あ}っているのはどれですか。', options: ['ナタポンさんは{夜|よる}{8時|はちじ}まで{家|いえ}にいる。', '{冷蔵庫|れいぞうこ}の{右|みぎ}の{棚|たな}はカルロスさんが{使|つか}ってもいい。', 'ごみの{日|ひ}の{表|ひょう}は{玄関|げんかん}に{貼|は}ってある。', 'カルロスさんは{今夜|こんや}ごみをごみ{置|お}き{場|ば}に{出|だ}す。'], correct: 1, why: '**{右|みぎ}の{棚|たな}は{空|あ}けておきましたから、{自由|じゆう}に{使|つか}ってください** (～ておく — dọn trống sẵn). ナタポン đi làm thêm đến 8 giờ; bảng rác ở tường bếp; tối nay chỉ để rác ở lối vào.' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('{先|さき}にメモを{書|か}いておきます。', 'Saki ni memo o kaite okimasu.', 'Tôi viết sẵn mẩu ghi chú trước.'),
        E('{鍵|かぎ}は{引|ひ}き{出|だ}しに{入|い}れてあります。', 'Kagi wa hikidashi ni irete arimasu.', 'Chìa khoá đã cất sẵn trong ngăn kéo.'),
        E('{右|みぎ}の{棚|たな}は{空|あ}けておきましたから、{自由|じゆう}に{使|つか}ってください。', 'Migi no tana wa akete okimashita kara, jiyuu ni tsukatte kudasai.', 'Ngăn bên phải tôi đã dọn trống sẵn, bạn cứ tự nhiên dùng. ({空|あ}ける = làm trống — cùng chữ 空)'),
        E('{今夜|こんや}は{玄関|げんかん}に{置|お}いておいてください。', 'Kon\'ya wa genkan ni oite oite kudasai.', 'Tối nay cứ để (rác) ở lối vào.'),
      ],
    },
  ],
};

export const BAI_18: Lesson[] = [
  // ① Cốt lõi
  HOI_THOAI, TU_VUNG, NGU_PHAP, HAN_TU, NGHE, DOC, NOI, VIET, BAI_TAP,
  // ② Theo buổi trên lớp
  BUOI_1, BUOI_2, BUOI_3,
  // ③ Luyện thêm dễ → khó
  LT_1, LT_2, LT_3, LT_4, LT_5,
];
