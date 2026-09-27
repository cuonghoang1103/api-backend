/**
 * Bài 7 — 友達の家で (Ở nhà bạn) · できる日本語 初級 · JPD113/JPD123.
 *
 * Ngữ pháp: ポイント 61–71 (N1はN2にいます／あります · N1にN2がいます／あります ·
 * Vてください · Vています · Vましょうか · (Nの)V方 · まだ／もう · 誰が · どのN · どれ ·
 * N(dụng cụ)でVます) + trọn bộ cách chia **thể て** (表 p.282–283: nhóm 1 いて／いで／
 * って／んで／して, ngoại lệ 行きます→行って, nhóm 2, nhóm 3).
 * Từ vựng: đủ 71 từ + 5 câu mẫu trong danh sách từ mới Bài 7 của cô (sổ tra JPD123,
 * mục 1–76). Danh sách của cô ghi 洗います = "giặt, rửa, tắm" — 洗う là RỬA (rửa bát,
 * rửa tay, gội/rửa); "tắm" là 浴びます／お風呂に入ります, bài dùng nghĩa rửa.
 * Hội thoại, câu ví dụ, bài đọc, kịch bản nghe: VIẾT MỚI theo đúng tình huống của sách
 * (xem ../SOAN-BAI.md). Tên ngân hàng, toà nhà, quán trong bài là tự đặt.
 *
 * Vai (theo bai1.ts): パク, アンナ, ワン, メアリー — nữ (a / c); ナタポン, マルコ,
 * カルロス, ダニエル — nam (b). Giám thị — examiner.
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
  id: 'b7-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — 友達の家で Hỏi đường, chuẩn bị tiệc, vui tiệc ở nhà bạn',
  goal: 'Hỏi được chỗ mình cần đến ở đâu và nói mình đang ở đâu khi lạc; nhờ bạn làm việc khi chuẩn bị tiệc; ở bữa tiệc thì chủ động đề nghị giúp, mời đồ ăn, hỏi ai đang làm gì, ai làm món này.',
  minutes: 40,
  blocks: [
    {
      t: 'note',
      title: 'Học xong bài 7 bạn làm được (できる)',
      items: [
        '**① {道|みち}がわかりません** — khi **lạc đường** trên đường đến nhà bạn: hỏi người đi đường "~ ở đâu?", gọi điện nói "mình đang ở trước ~, gần đây có ~".',
        '**② パーティーの{準備|じゅんび}** — khi chuẩn bị tiệc: **nhờ / bảo** người khác làm việc (rửa, cắt, lấy, đặt, mang đi…) bằng **～てください**, hỏi lại "cái nào?" (どれ／どの～), hỏi **cách làm** (～{方|かた}).',
        '**③ みんなで{楽|たの}しいパーティー** — trong bữa tiệc: nói **ai đang làm gì** (～ています), **đề nghị giúp** (～ましょうか), hỏi **ai làm** món này ({誰|だれ}が), hỏi món đó **còn không** (まだあります／もうありません).',
        '**できる！** — cùng các bạn lên kế hoạch một bữa tiệc thật: ở đâu, khi nào, viết thư mời, rồi diễn lại các cảnh (hẹn gặp – chuẩn bị – tiệc).',
      ],
    },
    {
      t: 'table',
      caption: 'Bức tranh chung của bài — một buổi tiệc ở nhà bạn, từ lúc lạc đường đến lúc ăn bánh',
      head: ['Cảnh', 'Câu then chốt', 'Romaji', 'ポイント'],
      rows: [
        ['1. Hỏi đường', '{銀行|ぎんこう}はどこにありますか。——あのビルの{後|うし}ろにありますよ。', 'Ginkou wa doko ni arimasu ka. — Ano biru no ushiro ni arimasu yo.', '61'],
        ['2. Gọi điện khi lạc', '{今|いま}、どこにいますか。——{駅|えき}の{前|まえ}にいます。{近|ちか}くに{大|おお}きいスーパーがあります。', 'Ima, doko ni imasu ka. — Eki no mae ni imasu. Chikaku ni ookii suupaa ga arimasu.', '61, 62'],
        ['3. Nhờ làm việc', '{果物|くだもの}を{洗|あら}ってください。／ナイフでパンを{切|き}ってください。', 'Kudamono o aratte kudasai. / Naifu de pan o kitte kudasai.', '63, 71'],
        ['4. Hỏi lại cái nào', 'どのお{皿|さら}ですか。——そのお{皿|さら}です。／{塩|しお}はどれですか。——それです。', 'Dono osara desu ka. — Sono osara desu. / Shio wa dore desu ka. — Sore desu.', '69, 70'],
        ['5. Hỏi cách làm', 'カレーの{作|つく}り{方|かた}を{教|おし}えてください。', 'Karee no tsukurikata o oshiete kudasai.', '66, 63'],
        ['6. Ai đang làm gì', 'パクさんは{台所|だいどころ}でお{皿|さら}を{洗|あら}っています。', 'Paku-san wa daidokoro de osara o aratte imasu.', '64'],
        ['7. Đề nghị giúp', '{手伝|てつだ}いましょうか。——ありがとうございます。', 'Tetsudaimashou ka. — Arigatou gozaimasu.', '65'],
        ['8. Ai làm / còn không', '{誰|だれ}が{作|つく}りましたか。——ワンさんが{作|つく}りました。／ビールはまだありますか。——もうありません。', 'Dare ga tsukurimashita ka. — Wan-san ga tsukurimashita. / Biiru wa mada arimasu ka. — Mou arimasen.', '68, 67'],
      ],
    },

    /* ── ① 道がわかりません ── */
    { t: 'h', text: '① {道|みち}がわかりません — Không biết đường' },
    {
      t: 'p',
      text: 'Tình huống: thứ Bảy, Anna được Wang mời đến căn hộ mới để dự tiệc. Anna xuống ga, đi bộ, rồi… lạc. Cô hỏi một người đi đường, sau đó gọi điện cho Wang. Wang hỏi "bạn đang ở đâu?", "gần đó có gì?" rồi ra đón.',
    },
    {
      t: 'dialogue',
      title: 'Hỏi người đi đường — ngân hàng ở đâu?',
      lines: [
        { who: 'アンナ', role: 'a', text: 'あのう、すみません。みどり{銀行|ぎんこう}はどこにありますか。', ro: 'Anou, sumimasen. Midori ginkou wa doko ni arimasu ka.', vi: 'Dạ, xin lỗi. Ngân hàng Midori ở đâu ạ?' },
        { who: '{男|おとこ}の{人|ひと}', role: 'b', text: 'ああ、みどり{銀行|ぎんこう}ですか。あの{本屋|ほんや}の{隣|となり}にありますよ。', ro: 'Aa, Midori ginkou desu ka. Ano hon-ya no tonari ni arimasu yo.', vi: 'À, ngân hàng Midori à. Nó ở ngay cạnh hiệu sách kia kìa.' },
        { who: 'アンナ', role: 'a', text: 'あの{本屋|ほんや}の{隣|となり}ですね。ありがとうございます。', ro: 'Ano hon-ya no tonari desu ne. Arigatou gozaimasu.', vi: 'Cạnh hiệu sách kia nhỉ. Cảm ơn anh.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Gọi điện cho bạn — "Bạn đang ở đâu?"',
      lines: [
        { who: 'ワン', role: 'c', text: 'もしもし、アンナさん。{今|いま}、どこにいますか。', ro: 'Moshimoshi, Anna-san. Ima, doko ni imasu ka.', vi: 'A lô, Anna à. Bây giờ bạn đang ở đâu?' },
        { who: 'アンナ', role: 'a', text: 'ええと、みどり{銀行|ぎんこう}の{前|まえ}にいます。', ro: 'Eeto, Midori ginkou no mae ni imasu.', vi: 'Ờ… mình đang ở trước ngân hàng Midori.' },
        { who: 'ワン', role: 'c', text: 'えっ？ みどり{銀行|ぎんこう}ですか。{近|ちか}くに{何|なに}がありますか。', ro: 'E? Midori ginkou desu ka. Chikaku ni nani ga arimasu ka.', vi: 'Hả? Ngân hàng Midori à? Gần đó có gì?' },
        { who: 'アンナ', role: 'a', text: '{大|おお}きい{本屋|ほんや}があります。それから、{交番|こうばん}もあります。', ro: 'Ookii hon-ya ga arimasu. Sorekara, kouban mo arimasu.', vi: 'Có một hiệu sách lớn. Với cả có đồn công an nữa.' },
        { who: 'ワン', role: 'c', text: 'わかりました。{交番|こうばん}の{前|まえ}にいてください。{今|いま}、{迎|むか}えに{行|い}きます。', ro: 'Wakarimashita. Kouban no mae ni ite kudasai. Ima, mukae ni ikimasu.', vi: 'Hiểu rồi. Bạn cứ đứng trước đồn công an nhé. Mình đi đón bạn ngay đây.' },
        { who: 'アンナ', role: 'a', text: 'すみません。お{願|ねが}いします。', ro: 'Sumimasen. Onegaishimasu.', vi: 'Xin lỗi nhé. Nhờ bạn.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Gọi điện — bạn đang ở trong cửa hàng',
      lines: [
        { who: 'パク', role: 'c', text: 'もしもし、ナタポンさん。{今|いま}、どこにいますか。', ro: 'Moshimoshi, Natapon-san. Ima, doko ni imasu ka.', vi: 'A lô, Natapon à. Anh đang ở đâu?' },
        { who: 'ナタポン', role: 'b', text: '{駅|えき}の{近|ちか}くのコンビニの{中|なか}にいます。', ro: 'Eki no chikaku no konbini no naka ni imasu.', vi: 'Tôi đang ở trong cửa hàng tiện lợi gần ga.' },
        { who: 'パク', role: 'c', text: 'コンビニの{外|そと}に{何|なに}がありますか。', ro: 'Konbini no soto ni nani ga arimasu ka.', vi: 'Bên ngoài cửa hàng có gì?' },
        { who: 'ナタポン', role: 'b', text: '{自動販売機|じどうはんばいき}とポストがあります。ポストの{横|よこ}に{大|おお}きい{木|き}があります。', ro: 'Jidou hanbaiki to posuto ga arimasu. Posuto no yoko ni ookii ki ga arimasu.', vi: 'Có máy bán hàng tự động và hòm thư. Cạnh hòm thư có một cái cây to.' },
        { who: 'パク', role: 'c', text: 'ああ、わかりました。そこへ{行|い}きます。', ro: 'Aa, wakarimashita. Soko e ikimasu.', vi: 'À, biết rồi. Tôi đến đó ngay.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{交番|こうばん}はどこにありますか。——あのビルの{後|うし}ろにありますよ。', ro: 'Kouban wa doko ni arimasu ka. — Ano biru no ushiro ni arimasu yo.', vi: 'Đồn công an ở đâu? — Ở phía sau toà nhà kia đấy. — vật / nơi chốn: **は…に あります** (ポイント 61).' },
        { en: '{今|いま}、どこにいますか。——{改札|かいさつ}の{前|まえ}にいます。', ro: 'Ima, doko ni imasu ka. — Kaisatsu no mae ni imasu.', vi: 'Giờ bạn ở đâu? — Mình ở trước cổng soát vé. — người: **います** (ポイント 61).' },
        { en: '{近|ちか}くに{何|なに}がありますか。——コンビニがあります。', ro: 'Chikaku ni nani ga arimasu ka. — Konbini ga arimasu.', vi: 'Gần đó có gì? — Có cửa hàng tiện lợi. — **(nơi)に N が あります** (ポイント 62).' },
        { en: 'バス{停|てい}の{横|よこ}に{犬|いぬ}がいます。', ro: 'Basutei no yoko ni inu ga imasu.', vi: 'Cạnh trạm xe buýt có một con chó. — con vật dùng **います**.' },
        { en: '{今|いま}、{迎|むか}えに{行|い}きます。', ro: 'Ima, mukae ni ikimasu.', vi: 'Mình đi đón (bạn) ngay đây.' },
        { en: 'あのう、すみません。{駅|えき}はどこにありますか。', ro: 'Anou, sumimasen. Eki wa doko ni arimasu ka.', vi: 'Dạ, xin lỗi, ga ở đâu ạ? — câu mở lời hỏi đường với người lạ.' },
      ],
    },

    /* ── ② パーティーの準備 ── */
    { t: 'h', text: '② パーティーの{準備|じゅんび} — Chuẩn bị tiệc' },
    {
      t: 'p',
      text: 'Tình huống: ở căn hộ của Wang, mọi người cùng chuẩn bị tiệc. Wang là chủ nhà nên **nhờ / phân việc** cho từng người: rửa hoa quả, cắt bánh mì, đặt đĩa lên bàn, lấy đồ trong tủ lạnh. Có người không biết cách nấu một món nên hỏi "cách làm". Khi được bảo "lấy cái đĩa", người kia hỏi lại "cái nào?".',
    },
    {
      t: 'dialogue',
      title: 'Wang phân việc',
      lines: [
        { who: 'ワン', role: 'c', text: 'マルコさん、{果物|くだもの}を{洗|あら}ってください。', ro: 'Maruko-san, kudamono o aratte kudasai.', vi: 'Marco ơi, rửa hoa quả giúp mình nhé.' },
        { who: 'マルコ', role: 'b', text: 'はい。', ro: 'Hai.', vi: 'Ừ.' },
        { who: 'ワン', role: 'c', text: 'アンナさん、そのナイフでパンを{切|き}ってください。', ro: 'Anna-san, sono naifu de pan o kitte kudasai.', vi: 'Anna ơi, cắt bánh mì bằng con dao đó nhé.' },
        { who: 'アンナ', role: 'a', text: 'はい、わかりました。', ro: 'Hai, wakarimashita.', vi: 'Được, mình hiểu rồi.' },
        { who: 'ワン', role: 'c', text: 'それから、ペンで{名前|なまえ}を{書|か}いてください。{皆|みな}さんのコップに{置|お}きますから。', ro: 'Sorekara, pen de namae o kaite kudasai. Minasan no koppu ni okimasu kara.', vi: 'Rồi viết tên bằng bút nhé. Vì mình sẽ đặt (tên) lên cốc của mọi người.' },
        { who: 'アンナ', role: 'a', text: 'ひらがなで{書|か}きますか、{漢字|かんじ}で{書|か}きますか。', ro: 'Hiragana de kakimasu ka, kanji de kakimasu ka.', vi: 'Viết bằng hiragana hay bằng chữ Hán?' },
        { who: 'ワン', role: 'c', text: 'カタカナで{書|か}いてください。', ro: 'Katakana de kaite kudasai.', vi: 'Viết bằng katakana nhé.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi cách làm — không biết nấu cà ri',
      lines: [
        { who: 'マルコ', role: 'b', text: 'パクさん、カレーの{作|つく}り{方|かた}がわかりません。すみませんが、{作|つく}り{方|かた}を{教|おし}えてください。', ro: 'Paku-san, karee no tsukurikata ga wakarimasen. Sumimasen ga, tsukurikata o oshiete kudasai.', vi: 'Park ơi, mình không biết cách nấu cà ri. Xin lỗi nhưng chỉ mình cách nấu với.' },
        { who: 'パク', role: 'a', text: 'すみません。{私|わたし}もわかりませんから、ワンさんに{聞|き}いてください。', ro: 'Sumimasen. Watashi mo wakarimasen kara, Wan-san ni kiite kudasai.', vi: 'Xin lỗi. Mình cũng không biết, nên bạn hỏi Wang nhé.' },
        { who: 'マルコ', role: 'b', text: 'ワンさん、カレーの{作|つく}り{方|かた}を{教|おし}えてください。', ro: 'Wan-san, karee no tsukurikata o oshiete kudasai.', vi: 'Wang ơi, chỉ mình cách nấu cà ri với.' },
        { who: 'ワン', role: 'c', text: 'いいですよ。まず、{野菜|やさい}を{切|き}ってください。', ro: 'Ii desu yo. Mazu, yasai o kitte kudasai.', vi: 'Được thôi. Trước tiên, cắt rau củ đi.' },
        { who: 'マルコ', role: 'b', text: 'この{電子|でんし}レンジの{使|つか}い{方|かた}も{教|おし}えてください。', ro: 'Kono denshi renji no tsukaikata mo oshiete kudasai.', vi: 'Chỉ mình cả cách dùng cái lò vi sóng này nữa.' },
        { who: 'ワン', role: 'c', text: 'はい。ここにお{皿|さら}を{入|い}れてください。それから、このボタンを{押|お}してください。', ro: 'Hai. Koko ni osara o irete kudasai. Sorekara, kono botan o oshite kudasai.', vi: 'Ừ. Cho đĩa vào đây. Rồi bấm nút này. ({押|お}します — "bấm, ấn", từ thêm)' },
      ],
    },
    {
      t: 'dialogue',
      title: '"Cái nào?" — どの／どれ',
      lines: [
        { who: 'ワン', role: 'c', text: 'ナタポンさん、お{皿|さら}を{取|と}ってください。', ro: 'Natapon-san, osara o totte kudasai.', vi: 'Natapon ơi, lấy giúp mình cái đĩa.' },
        { who: 'ナタポン', role: 'b', text: 'どのお{皿|さら}ですか。', ro: 'Dono osara desu ka.', vi: 'Đĩa nào?' },
        { who: 'ワン', role: 'c', text: 'その{白|しろ}いお{皿|さら}です。', ro: 'Sono shiroi osara desu.', vi: 'Cái đĩa trắng đó.' },
        { who: 'ナタポン', role: 'b', text: 'ああ、これですか。はい、どうぞ。', ro: 'Aa, kore desu ka. Hai, douzo.', vi: 'À, cái này à. Đây.' },
        { who: 'ワン', role: 'c', text: 'それから、{塩|しお}も{取|と}ってください。', ro: 'Sorekara, shio mo totte kudasai.', vi: 'Rồi lấy giúp cả muối nữa.' },
        { who: 'ナタポン', role: 'b', text: '{塩|しお}はどれですか。', ro: 'Shio wa dore desu ka.', vi: 'Muối là lọ nào?' },
        { who: 'ワン', role: 'c', text: 'それです。{砂糖|さとう}の{隣|となり}の。', ro: 'Sore desu. Satou no tonari no.', vi: 'Lọ đó. Lọ cạnh đường ấy.' },
        { who: 'ナタポン', role: 'b', text: 'ああ、これですね。はい、どうぞ。', ro: 'Aa, kore desu ne. Hai, douzo.', vi: 'À, lọ này nhỉ. Đây.' },
        { who: 'ワン', role: 'c', text: 'どうも。', ro: 'Doumo.', vi: 'Cảm ơn.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Bày bàn — đặt, mang đi, lấy ra',
      lines: [
        { who: 'ワン', role: 'c', text: 'カルロスさん、このいすを{向|む}こうの{部屋|へや}へ{持|も}って{行|い}ってください。', ro: 'Karurosu-san, kono isu o mukou no heya e motte itte kudasai.', vi: 'Carlos ơi, mang cái ghế này sang phòng bên kia giúp mình. (向こう — "phía bên kia", từ thêm)' },
        { who: 'カルロス', role: 'b', text: 'はい。コップはどこに{置|お}きますか。', ro: 'Hai. Koppu wa doko ni okimasu ka.', vi: 'Ừ. Cốc thì đặt ở đâu?' },
        { who: 'ワン', role: 'c', text: 'テーブルの{上|うえ}に{置|お}いてください。', ro: 'Teeburu no ue ni oite kudasai.', vi: 'Đặt lên bàn giúp mình.' },
        { who: 'カルロス', role: 'b', text: 'ジュースは？', ro: 'Juusu wa?', vi: 'Còn nước hoa quả?' },
        { who: 'ワン', role: 'c', text: '{冷蔵庫|れいぞうこ}の{中|なか}にあります。{冷蔵庫|れいぞうこ}から{出|だ}してください。', ro: 'Reizouko no naka ni arimasu. Reizouko kara dashite kudasai.', vi: 'Có trong tủ lạnh. Lấy ra từ tủ lạnh giúp mình nhé.' },
        { who: 'カルロス', role: 'b', text: 'しょうゆも{持|も}って{行|い}きましょうか。', ro: 'Shouyu mo motte ikimashou ka.', vi: 'Mang cả xì dầu ra nhé?' },
        { who: 'ワン', role: 'c', text: 'ええ、お{願|ねが}いします。', ro: 'Ee, onegaishimasu.', vi: 'Ừ, nhờ bạn.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{果物|くだもの}を{洗|あら}ってください。', ro: 'Kudamono o aratte kudasai.', vi: 'Hãy rửa hoa quả. — **V て ください** = nhờ / bảo làm (ポイント 63).' },
        { en: 'ペンで{名前|なまえ}を{書|か}いてください。', ro: 'Pen de namae o kaite kudasai.', vi: 'Hãy viết tên bằng bút. — **N(dụng cụ) で** (ポイント 71).' },
        { en: 'カレーの{作|つく}り{方|かた}を{教|おし}えてください。', ro: 'Karee no tsukurikata o oshiete kudasai.', vi: 'Hãy chỉ tôi cách nấu cà ri. — **V(bỏ ます)方** = cách V (ポイント 66).' },
        { en: 'すみません。{私|わたし}もわかりませんから、Cさんに{聞|き}いてください。', ro: 'Sumimasen. Watashi mo wakarimasen kara, C-san ni kiite kudasai.', vi: 'Xin lỗi. Tôi cũng không biết nên bạn hỏi C nhé.' },
        { en: 'どのお{皿|さら}ですか。——そのお{皿|さら}です。', ro: 'Dono osara desu ka. — Sono osara desu.', vi: 'Đĩa nào? — Cái đĩa đó. — **どの + N** (ポイント 69).' },
        { en: '{塩|しお}はどれですか。——それです。', ro: 'Shio wa dore desu ka. — Sore desu.', vi: 'Muối là cái nào? — Cái đó. — **どれ** đứng một mình (ポイント 70).' },
        { en: 'ああ、これですか。はい、どうぞ。', ro: 'Aa, kore desu ka. Hai, douzo.', vi: 'À, cái này à. Đây, của bạn.' },
      ],
    },

    /* ── ③ みんなで楽しいパーティー ── */
    { t: 'h', text: '③ みんなで{楽|たの}しいパーティー — Mọi người cùng vui tiệc' },
    {
      t: 'p',
      text: 'Tình huống: tiệc đã bắt đầu. Mary vừa đến muộn, hỏi mọi người đang ở đâu, đang làm gì. Có người đang hút thuốc ngoài ban công, có người đang gọi điện, có người đang chơi guitar. Mọi người **đề nghị giúp** nhau (chụp ảnh, lấy đồ ăn), khen món ăn và hỏi **ai làm**, hỏi món đó **còn không**.',
    },
    {
      t: 'dialogue',
      title: 'Mọi người đang ở đâu, làm gì?',
      lines: [
        { who: 'メアリー', role: 'a', text: 'ワンさん、パクさんはどこにいますか。', ro: 'Wan-san, Paku-san wa doko ni imasu ka.', vi: 'Wang ơi, Park đang ở đâu?' },
        { who: 'ワン', role: 'c', text: 'パクさんは{台所|だいどころ}でお{皿|さら}を{洗|あら}っていますよ。', ro: 'Paku-san wa daidokoro de osara o aratte imasu yo.', vi: 'Park đang rửa bát trong bếp đấy.' },
        { who: 'メアリー', role: 'a', text: 'マルコさんは？', ro: 'Maruko-san wa?', vi: 'Còn Marco?' },
        { who: 'ワン', role: 'c', text: 'マルコさんは{外|そと}でたばこを{吸|す}っています。', ro: 'Maruko-san wa soto de tabako o sutte imasu.', vi: 'Marco đang hút thuốc ở ngoài.' },
        { who: 'メアリー', role: 'a', text: 'そうですか。あ、カルロスさんがギターを{弾|ひ}いていますね。', ro: 'Sou desu ka. A, Karurosu-san ga gitaa o hiite imasu ne.', vi: 'Vậy à. A, Carlos đang chơi guitar kìa.' },
        { who: 'ワン', role: 'c', text: 'ええ。アンナさんは{窓|まど}の{近|ちか}くで{電話|でんわ}をかけていますよ。', ro: 'Ee. Anna-san wa mado no chikaku de denwa o kakete imasu yo.', vi: 'Ừ. Còn Anna đang gọi điện ở gần cửa sổ.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Đề nghị giúp — ～ましょうか',
      lines: [
        { who: 'ナタポン', role: 'b', text: 'ワンさん、{手伝|てつだ}いましょうか。', ro: 'Wan-san, tetsudaimashou ka.', vi: 'Wang ơi, để mình giúp nhé?' },
        { who: 'ワン', role: 'c', text: 'あ、ありがとうございます。じゃ、このピザを{切|き}ってください。', ro: 'A, arigatou gozaimasu. Ja, kono piza o kitte kudasai.', vi: 'A, cảm ơn nhé. Vậy cắt cái pizza này giúp mình.' },
        { who: 'ナタポン', role: 'b', text: 'メアリーさん、{料理|りょうり}を{取|と}りましょうか。', ro: 'Mearii-san, ryouri o torimashou ka.', vi: 'Mary, để tôi lấy đồ ăn cho nhé?' },
        { who: 'メアリー', role: 'a', text: 'あ、すみません。ありがとうございます。', ro: 'A, sumimasen. Arigatou gozaimasu.', vi: 'A, phiền anh quá. Cảm ơn anh.' },
        { who: 'ナタポン', role: 'b', text: '{皆|みな}さん、{写真|しゃしん}を{撮|と}りましょうか。', ro: 'Minasan, shashin o torimashou ka.', vi: 'Mọi người ơi, để mình chụp ảnh cho nhé?' },
        { who: 'ワン', role: 'c', text: 'いいですね。お{願|ねが}いします。', ro: 'Ii desu ne. Onegaishimasu.', vi: 'Hay đấy. Nhờ bạn nhé.' },
        { who: 'メアリー', role: 'a', text: 'ちょっと{暑|あつ}いですね。{窓|まど}を{開|あ}けましょうか。', ro: 'Chotto atsui desu ne. Mado o akemashou ka.', vi: 'Hơi nóng nhỉ. Để mình mở cửa sổ nhé?' },
        { who: 'ワン', role: 'c', text: 'ええ、お{願|ねが}いします。', ro: 'Ee, onegaishimasu.', vi: 'Ừ, nhờ bạn.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Ai làm món này? Còn không?',
      lines: [
        { who: 'メアリー', role: 'a', text: 'わあ、このケーキ、おいしいですね。{誰|だれ}が{作|つく}りましたか。', ro: 'Waa, kono keeki, oishii desu ne. Dare ga tsukurimashita ka.', vi: 'Oa, bánh này ngon quá. Ai làm vậy?' },
        { who: 'ワン', role: 'c', text: 'パクさんが{作|つく}りました。', ro: 'Paku-san ga tsukurimashita.', vi: 'Park làm đấy.' },
        { who: 'メアリー', role: 'a', text: 'へえ。すごいですね。', ro: 'Hee. Sugoi desu ne.', vi: 'Ồ. Giỏi thật đấy.' },
        { who: 'マルコ', role: 'b', text: 'サラダはまだありますか。', ro: 'Sarada wa mada arimasu ka.', vi: 'Salad còn không?' },
        { who: 'ワン', role: 'c', text: 'はい、まだありますよ。どうぞ。', ro: 'Hai, mada arimasu yo. Douzo.', vi: 'Có, vẫn còn đấy. Mời bạn.' },
        { who: 'マルコ', role: 'b', text: 'ビールもまだありますか。', ro: 'Biiru mo mada arimasu ka.', vi: 'Bia cũng còn chứ?' },
        { who: 'ワン', role: 'c', text: 'すみません。ビールはもうありません。ワインはどうですか。', ro: 'Sumimasen. Biiru wa mou arimasen. Wain wa dou desu ka.', vi: 'Xin lỗi. Bia hết rồi. Rượu vang thì sao?' },
        { who: 'マルコ', role: 'b', text: 'いいですね。ありがとうございます。', ro: 'Ii desu ne. Arigatou gozaimasu.', vi: 'Được đấy. Cảm ơn nhé.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'パクさんは{台所|だいどころ}でお{皿|さら}を{洗|あら}っています。', ro: 'Paku-san wa daidokoro de osara o aratte imasu.', vi: 'Park đang rửa bát trong bếp. — **V て います** = đang V (ポイント 64).' },
        { en: '{手伝|てつだ}いましょうか。——ありがとうございます。お{願|ねが}いします。', ro: 'Tetsudaimashou ka. — Arigatou gozaimasu. Onegaishimasu.', vi: 'Để tôi giúp nhé? — Cảm ơn. Nhờ bạn. — **V ましょうか** = đề nghị làm giúp (ポイント 65).' },
        { en: '{誰|だれ}がこのケーキを{作|つく}りましたか。——ワンさんが{作|つく}りました。', ro: 'Dare ga kono keeki o tsukurimashita ka. — Wan-san ga tsukurimashita.', vi: 'Ai làm cái bánh này? — Wang làm. — **誰が** … trả lời **N が** (ポイント 68).' },
        { en: 'サラダはまだありますか。——はい、まだあります。／いいえ、もうありません。', ro: 'Sarada wa mada arimasu ka. — Hai, mada arimasu. / Iie, mou arimasen.', vi: 'Salad còn không? — Vâng, vẫn còn. / Không, hết rồi. — **まだ／もう** (ポイント 67).' },
        { en: 'ワインはどうですか。', ro: 'Wain wa dou desu ka.', vi: 'Rượu vang thì sao? — mời món khác thay thế (Bài 6).' },
        { en: 'へえ。', ro: 'Hee.', vi: 'Ồ, thế à. — ngạc nhiên, thích thú.' },
      ],
    },

    /* ── 話読聞書 ── */
    { t: 'h', text: '④ Nói–Đọc–Nghe–Viết (話読聞書) — Thư mời tiệc (招待状)' },
    {
      t: 'p',
      text: 'Bài đọc mẫu (viết mới, cùng kiểu với sách): một bạn mời mọi người đến nhà dự tiệc, rủ cùng nấu món ăn của nước mình và chỉ đường đến nhà. Đọc to từng câu, trả lời 2 câu hỏi, rồi viết thư mời của bạn theo khung.',
    },
    {
      t: 'passage',
      title: 'パーティーをしませんか',
      paras: [
        { text: '{皆|みな}さん、{今度|こんど}の{土曜日|どようび}、{私|わたし}のアパートでパーティーをします。{私|わたし}はベトナムの{料理|りょうり}を{作|つく}ります。{一緒|いっしょ}に{作|つく}りませんか。{皆|みな}さんの{国|くに}の{料理|りょうり}の{作|つく}り{方|かた}も{教|おし}えてください。{料理|りょうり}はたくさんあります。{皆|みな}さん、{好|す}きな{飲|の}み{物|もの}を{持|も}って{来|き}てください。{私|わたし}のアパートはさくら{駅|えき}の{近|ちか}くにあります。{郵便局|ゆうびんきょく}の{隣|となり}の{白|しろ}いアパートです。{道|みち}がわかりませんから、{駅|えき}から{電話|でんわ}をかけてください。{私|わたし}が{迎|むか}えに{行|い}きます。ぜひ{来|き}てください。' },
      ],
    },
    {
      t: 'note',
      title: 'Chú ý khi đọc',
      items: [
        '「{道|みち}がわかりませんから、{駅|えき}から{電話|でんわ}をかけてください」 — người viết đoán khách sẽ không biết đường (chỗ này khó tìm), NÊN dặn gọi điện từ ga. ～から (vì) là Bài 5.',
        '「{私|わたし}**が**{迎|むか}えに{行|い}きます」: が nhấn mạnh "chính TÔI sẽ đi đón" — cùng kiểu với {誰|だれ}が／Nが của ポイント 68.',
        '「{好|す}きな{飲|の}み{物|もの}」 = đồ uống (mà bạn) thích — {好|す}き là tính từ đuôi な nên đứng trước danh từ có な (Bài 4).',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'どこでパーティーをしますか。——{私|わたし}のアパートでします。', ro: 'Doko de paatii o shimasu ka. — Watashi no apaato de shimasu.', vi: 'Tổ chức tiệc ở đâu? — Ở căn hộ của tôi.' },
        { en: 'どんなパーティーをしますか。——{皆|みな}さんと{一緒|いっしょ}に{国|くに}の{料理|りょうり}を{作|つく}って、{食|た}べます。', ro: 'Donna paatii o shimasu ka. — Minasan to issho ni kuni no ryouri o tsukutte, tabemasu.', vi: 'Tiệc như thế nào? — Cùng mọi người nấu món ăn của nước mình rồi ăn.' },
        { en: '{皆|みな}さんの{国|くに}の{料理|りょうり}の{作|つく}り{方|かた}も{教|おし}えてください。', ro: 'Minasan no kuni no ryouri no tsukurikata mo oshiete kudasai.', vi: 'Hãy chỉ tôi cả cách nấu món ăn của nước các bạn nữa.' },
        { en: '{私|わたし}のアパートはさくら{駅|えき}の{近|ちか}くにあります。', ro: 'Watashi no apaato wa Sakura eki no chikaku ni arimasu.', vi: 'Căn hộ của tôi ở gần ga Sakura. — ポイント 61.' },
        { en: '{郵便局|ゆうびんきょく}の{隣|となり}の{白|しろ}いアパートです。', ro: 'Yuubinkyoku no tonari no shiroi apaato desu.', vi: 'Là căn hộ màu trắng cạnh bưu điện.' },
        { en: 'ぜひ{来|き}てください。', ro: 'Zehi kite kudasai.', vi: 'Nhất định hãy đến nhé. — ぜひ + ～てください = lời mời nhiệt tình.' },
      ],
    },
    {
      t: 'note',
      title: 'Viết thư mời của bạn theo khung',
      items: [
        '**Câu 1 — khi nào, ở đâu:** {皆|みな}さん、___ （ngày）、___ （nơi）でパーティーをします。',
        '**Câu 2 — làm gì:** {私|わたし}は ___ を{作|つく}ります。{一緒|いっしょ}に ___ ませんか。',
        '**Câu 3 — nhờ khách:** ___ を{持|も}って{来|き}てください。／___ の{作|つく}り{方|かた}を{教|おし}えてください。',
        '**Câu 4 — chỉ đường:** {私|わたし}のうちは ___ の{近|ちか}くにあります。___ の{隣|となり}／{前|まえ}の ___ です。',
        '**Câu 5 — kết:** ぜひ{来|き}てください。',
        'Từ mới: アパート (căn hộ — sách có ở trang đọc), {皆|みな}さん (mọi người, Bài 6). Dùng ポイント 61, 63, 66 và ～ませんか (Bài 6).',
      ],
    },

    /* ── できる！ ── */
    { t: 'h', text: 'できる！— Cùng lớp tổ chức một bữa tiệc' },
    {
      t: 'p',
      text: 'Nhiệm vụ như sách: ① lên kế hoạch (ở đâu, khi nào) → ② viết thư mời → ③ tổ chức (hoặc trên lớp: viết kịch bản 3 cảnh — hẹn gặp, chuẩn bị, bữa tiệc — rồi diễn trước lớp). Bảng dưới là một kế hoạch mẫu; mỗi dòng là câu bạn sẽ nói ở cảnh đó.',
    },
    {
      t: 'table',
      caption: 'Kế hoạch mẫu: tiệc sinh nhật アンナさん (tự đặt)',
      head: ['Cảnh', 'Việc', 'Câu mẫu'],
      rows: [
        ['Kế hoạch', 'Ở đâu, khi nào', '{来週|らいしゅう}の{土曜日|どようび}、ワンさんのアパートでアンナさんの{誕生日|たんじょうび}パーティーをしませんか。'],
        ['Hẹn gặp', 'Gọi điện khi lạc', 'もしもし、{今|いま}、どこにいますか。——{駅|えき}の{改札|かいさつ}の{前|まえ}にいます。'],
        ['Hẹn gặp', 'Tả chỗ mình đứng', '{近|ちか}くに{交番|こうばん}とバス{停|てい}があります。'],
        ['Chuẩn bị', 'Phân việc', 'パクさん、ケーキを{切|き}ってください。ダニエルさん、コップをテーブルに{置|お}いてください。'],
        ['Chuẩn bị', 'Hỏi cái nào', 'どのナイフですか。——そのナイフです。'],
        ['Bữa tiệc', 'Đề nghị giúp', '{飲|の}み{物|もの}を{持|も}って{来|き}ましょうか。'],
        ['Bữa tiệc', 'Khen, hỏi ai làm', 'このピザ、おいしいですね。{誰|だれ}が{作|つく}りましたか。'],
        ['Bữa tiệc', 'Hỏi còn không', 'ジュースはまだありますか。——すみません、もうありません。お{茶|ちゃ}はどうですか。'],
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */
/* Đủ 71 từ + 5 câu mẫu của "Từ mới bài 7" (sổ tra JPD123 mục 1–76), chia 8 nhóm:
 * 10 + 8 + 3 + 13 + 7 + 14 + 7 + 9 = 71. */

const TU_VUNG: Lesson = {
  id: 'b7-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 71 từ của danh sách Bài 7',
  goal: 'Thuộc đủ 71 từ (và 5 câu mẫu) trong danh sách từ mới Bài 7 của cô; nói được vật / người ở đâu, gọi tên đồ trong bếp, và chia được thể て của 25 động từ mới.',
  minutes: 45,
  blocks: [
    {
      t: 'p',
      text: 'Đủ **71 từ** trong danh sách "Từ mới bài 7" cô phát (sổ tra JPD123 có 76 dòng: 71 từ + **5 câu mẫu**, câu mẫu nằm ở cuối bài này). Chia 8 nhóm theo ba chủ đề của sách: **7-1 {道|みち}がわかりません** (nhóm A–C), **7-2 パーティーの{準備|じゅんび}** (D–F), **7-3 みんなで{楽|たの}しいパーティー** (G–H). Mỗi động từ có ghi **thể て** — thể quan trọng nhất của bài (xem Ngữ pháp · Thể て). Câu ví dụ chỉ dùng từ Bài 1–7.',
    },
    {
      t: 'note',
      title: 'Cách đọc danh sách của cô',
      items: [
        '**洗います［洗う］1**: ngoặc vuông là **thể từ điển** (辞書形, học kỹ ở Bài 9) — dạng động từ tra trong từ điển. Số **1 / 2 / 3** là **nhóm động từ** — quyết định cách chia thể て.',
        'Trường âm viết theo kana: {冷蔵庫|れいぞうこ} → **reizouko**, テーブル → **teeburu**, スプーン → **supuun**, フォーク → **fooku**, ギター → **gitaa**.',
        'Âm ngắt っ viết đôi phụ âm: コップ → **koppu**, {洗|あら}って → **aratte**, {持|も}って{行|い}きます → **motte ikimasu**.',
      ],
    },

    { t: 'h', text: 'A. Vị trí — trên, dưới, trong, ngoài… (10 từ)' },
    {
      t: 'p',
      text: 'Cả 10 từ đều là **danh từ**, luôn đi sau **N の**: {机|つくえ}の{上|うえ} (trên bàn), {駅|えき}の{前|まえ} (trước ga). Riêng {間|あいだ} cần hai mốc: **N1 と N2 の{間|あいだ}**.',
    },
    {
      t: 'vocab',
      items: [
        { w: '{上|うえ}', pos: 'danh từ (vị trí)', ipa: 'ue', vi: 'trên, bên trên', ex: 'テーブルの{上|うえ}にお{皿|さら}があります。', exRo: 'Teeburu no ue ni osara ga arimasu.', exVi: 'Trên bàn có cái đĩa.' },
        { w: '{下|した}', pos: 'danh từ (vị trí)', ipa: 'shita', vi: 'dưới, phía dưới', ex: 'いすの{下|した}に{犬|いぬ}がいます。', exRo: 'Isu no shita ni inu ga imasu.', exVi: 'Dưới ghế có con chó.' },
        { w: '{中|なか}', pos: 'danh từ (vị trí)', ipa: 'naka', vi: 'trong, bên trong', ex: 'ジュースは{冷蔵庫|れいぞうこ}の{中|なか}にあります。', exRo: 'Juusu wa reizouko no naka ni arimasu.', exVi: 'Nước hoa quả ở trong tủ lạnh.' },
        { w: '{外|そと}', pos: 'danh từ (vị trí)', ipa: 'soto', vi: 'ngoài, bên ngoài', ex: 'マルコさんは{外|そと}にいます。', exRo: 'Maruko-san wa soto ni imasu.', exVi: 'Marco ở bên ngoài.' },
        { w: '{前|まえ}', pos: 'danh từ (vị trí)', ipa: 'mae', vi: 'trước, phía trước', ex: '{駅|えき}の{前|まえ}にバス{停|てい}があります。', exRo: 'Eki no mae ni basutei ga arimasu.', exVi: 'Trước ga có trạm xe buýt.' },
        { w: '{後|うし}ろ', pos: 'danh từ (vị trí)', ipa: 'ushiro', vi: 'sau, phía sau, đằng sau', ex: '{交番|こうばん}はあのビルの{後|うし}ろにあります。', exRo: 'Kouban wa ano biru no ushiro ni arimasu.', exVi: 'Đồn công an ở phía sau toà nhà kia.' },
        { w: '{横|よこ}', pos: 'danh từ (vị trí)', ipa: 'yoko', vi: 'bên cạnh; chiều ngang (cạnh bên, không nhất thiết sát, không cần cùng loại)', ex: 'ポストの{横|よこ}に{自動販売機|じどうはんばいき}があります。', exRo: 'Posuto no yoko ni jidou hanbaiki ga arimasu.', exVi: 'Cạnh hòm thư có máy bán hàng tự động.' },
        { w: '{隣|となり}', pos: 'danh từ (vị trí)', ipa: 'tonari', vi: 'bên cạnh, sát bên (hai thứ CÙNG LOẠI xếp hàng: nhà – nhà, người – người, lọ – lọ)', ex: '{銀行|ぎんこう}の{隣|となり}は{本屋|ほんや}です。', exRo: 'Ginkou no tonari wa hon-ya desu.', exVi: 'Bên cạnh ngân hàng là hiệu sách.' },
        { w: '{近|ちか}く', pos: 'danh từ (vị trí)', ipa: 'chikaku', vi: 'gần, chỗ gần (ở vị trí gần) — danh từ, khác tính từ {近|ちか}い (Bài 6)', ex: '{私|わたし}のアパートは{駅|えき}の{近|ちか}くにあります。', exRo: 'Watashi no apaato wa eki no chikaku ni arimasu.', exVi: 'Căn hộ của tôi ở gần ga.' },
        { w: '{間|あいだ}', pos: 'danh từ (vị trí)', ipa: 'aida', vi: 'giữa, ở giữa (N1 と N2 の{間|あいだ})', ex: '{銀行|ぎんこう}と{本屋|ほんや}の{間|あいだ}にコンビニがあります。', exRo: 'Ginkou to hon-ya no aida ni konbini ga arimasu.', exVi: 'Giữa ngân hàng và hiệu sách có cửa hàng tiện lợi.' },
      ],
    },
    {
      t: 'table',
      caption: 'Hình dung 10 từ vị trí quanh một cái hộp (箱)',
      head: ['Từ', 'Romaji', 'Nghĩa', 'Trái nghĩa / cặp'],
      rows: [
        ['{上|うえ}', 'ue', 'trên', '↔ {下|した} shita (dưới)'],
        ['{中|なか}', 'naka', 'trong', '↔ {外|そと} soto (ngoài)'],
        ['{前|まえ}', 'mae', 'trước', '↔ {後|うし}ろ ushiro (sau)'],
        ['{横|よこ}', 'yoko', 'bên cạnh (bất kỳ)', '≈ {隣|となり} tonari (sát bên, cùng loại)'],
        ['{近|ちか}く', 'chikaku', 'gần (quanh đây)', '— (xa: {遠|とお}く, chưa học)'],
        ['{間|あいだ}', 'aida', 'giữa hai thứ', 'N1 と N2 の{間|あいだ}'],
      ],
    },

    { t: 'h', text: 'B. Trên đường phố — nơi chốn, đồ vật, con vật (8 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{改札|かいさつ}', pos: 'danh từ', ipa: 'kaisatsu', vi: 'cổng soát vé (ở ga tàu) — chỗ hẹn gặp phổ biến nhất ở Nhật', ex: '{改札|かいさつ}の{前|まえ}で{会|あ}いましょう。', exRo: 'Kaisatsu no mae de aimashou.', exVi: 'Gặp nhau trước cổng soát vé nhé.' },
        { w: '{木|き}', pos: 'danh từ', ipa: 'ki', vi: 'cây; gỗ', ex: '{公園|こうえん}に{大|おお}きい{木|き}があります。', exRo: 'Kouen ni ookii ki ga arimasu.', exVi: 'Ở công viên có cây to.' },
        { w: '{交番|こうばん}', pos: 'danh từ', ipa: 'kouban', vi: 'đồn công an khu vực, chốt cảnh sát (nhỏ, ở góc phố, gần ga — nơi hỏi đường)', ex: 'すみません、{交番|こうばん}はどこにありますか。', exRo: 'Sumimasen, kouban wa doko ni arimasu ka.', exVi: 'Xin lỗi, đồn công an ở đâu ạ?' },
        { w: '{自動販売機|じどうはんばいき}', pos: 'danh từ', ipa: 'jidou hanbaiki', vi: 'máy bán hàng tự động', ex: '{駅|えき}の{中|なか}に{自動販売機|じどうはんばいき}があります。', exRo: 'Eki no naka ni jidou hanbaiki ga arimasu.', exVi: 'Trong ga có máy bán hàng tự động.' },
        { w: 'バス{停|てい}', pos: 'danh từ', ipa: 'basutei', vi: 'trạm xe buýt, bến xe buýt', ex: 'バス{停|てい}はコンビニの{前|まえ}にあります。', exRo: 'Basutei wa konbini no mae ni arimasu.', exVi: 'Trạm xe buýt ở trước cửa hàng tiện lợi.' },
        { w: 'ポスト', pos: 'danh từ', ipa: 'posuto', vi: 'thùng thư, hòm thư (màu đỏ, bỏ thư ở ngoài đường)', ex: '{郵便局|ゆうびんきょく}の{前|まえ}に{赤|あか}いポストがあります。', exRo: 'Yuubinkyoku no mae ni akai posuto ga arimasu.', exVi: 'Trước bưu điện có hòm thư màu đỏ.' },
        { w: '{花|はな}', pos: 'danh từ', ipa: 'hana', vi: 'hoa', ex: 'テーブルの{上|うえ}に{花|はな}があります。きれいですね。', exRo: 'Teeburu no ue ni hana ga arimasu. Kirei desu ne.', exVi: 'Trên bàn có hoa. Đẹp nhỉ.' },
        { w: '{犬|いぬ}', pos: 'danh từ', ipa: 'inu', vi: 'con chó (con vật → dùng **います**)', ex: '{木|き}の{下|した}に{犬|いぬ}がいます。', exRo: 'Ki no shita ni inu ga imasu.', exVi: 'Dưới gốc cây có con chó.' },
      ],
    },

    { t: 'h', text: 'C. Gọi điện, đi đón (3 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{迎|むか}えに{行|い}きます［{迎|むか}えに{行|い}く］', pos: 'động từ nhóm 1', ipa: 'mukae ni ikimasu [mukae ni iku]', vi: 'đi đón (người) — thể て: {迎|むか}えに{行|い}って (ngoại lệ của {行|い}きます)', ex: '{今|いま}、{駅|えき}へ{迎|むか}えに{行|い}きます。', exRo: 'Ima, eki e mukae ni ikimasu.', exVi: 'Tôi đi ra ga đón bạn ngay đây.' },
        { w: 'います［いる］', pos: 'động từ nhóm 2', ipa: 'imasu [iru]', vi: 'có mặt ở, ở (sự tồn tại của NGƯỜI, ĐỘNG VẬT) — thể て: いて', ex: '{私|わたし}は{本屋|ほんや}の{中|なか}にいます。', exRo: 'Watashi wa hon-ya no naka ni imasu.', exVi: 'Tôi ở trong hiệu sách. (câu mẫu của cô)' },
        { w: 'もしもし', pos: 'câu nói', ipa: 'moshimoshi', vi: 'a lô (khi gọi / nhận điện thoại)', ex: 'もしもし、{今|いま}、どこにいますか。', exRo: 'Moshimoshi, ima, doko ni imasu ka.', exVi: 'A lô, bây giờ bạn đang ở đâu?' },
      ],
    },
    {
      t: 'note',
      title: 'あります hay います?',
      items: [
        '**あります** (Bài 4, 6): vật, cây, toà nhà, sự kiện — {木|き}があります, {花|はな}があります, バス{停|てい}があります.',
        '**います** (Bài 7): người và con vật (thứ tự cử động được) — {犬|いぬ}がいます, {友達|ともだち}がいます, {私|わたし}は{駅|えき}にいます.',
        'Cây và hoa là vật sống nhưng KHÔNG cử động → vẫn dùng **あります**. Người trong ô tô, cá trong bể → **います**.',
      ],
    },

    { t: 'h', text: 'D. Bếp & bàn ăn — đồ vật (13 từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'いす', pos: 'danh từ', ipa: 'isu', vi: 'ghế, cái ghế', ex: 'いすを{向|む}こうの{部屋|へや}へ{持|も}って{行|い}ってください。', exRo: 'Isu o mukou no heya e motte itte kudasai.', exVi: 'Hãy mang ghế sang phòng bên kia.' },
        { w: 'テーブル', pos: 'danh từ', ipa: 'teeburu', vi: 'bàn, cái bàn (bàn ăn)', ex: 'コップをテーブルの{上|うえ}に{置|お}いてください。', exRo: 'Koppu o teeburu no ue ni oite kudasai.', exVi: 'Hãy đặt cốc lên bàn.' },
        { w: '{電子|でんし}レンジ', pos: 'danh từ', ipa: 'denshi renji', vi: 'lò vi sóng', ex: '{電子|でんし}レンジの{使|つか}い{方|かた}を{教|おし}えてください。', exRo: 'Denshi renji no tsukaikata o oshiete kudasai.', exVi: 'Hãy chỉ tôi cách dùng lò vi sóng.' },
        { w: '{冷蔵庫|れいぞうこ}', pos: 'danh từ', ipa: 'reizouko', vi: 'tủ lạnh', ex: 'ビールは{冷蔵庫|れいぞうこ}の{中|なか}にあります。', exRo: 'Biiru wa reizouko no naka ni arimasu.', exVi: 'Bia ở trong tủ lạnh.' },
        { w: '{砂糖|さとう}', pos: 'danh từ', ipa: 'satou', vi: 'đường (ăn)', ex: 'コーヒーに{砂糖|さとう}を{入|い}れますか。', exRo: 'Koohii ni satou o iremasu ka.', exVi: 'Bạn có cho đường vào cà phê không?' },
        { w: '{塩|しお}', pos: 'danh từ', ipa: 'shio', vi: 'muối', ex: '{塩|しお}を{取|と}ってください。', exRo: 'Shio o totte kudasai.', exVi: 'Lấy giúp tôi lọ muối.' },
        { w: 'しょうゆ', pos: 'danh từ', ipa: 'shouyu', vi: 'xì dầu, nước tương', ex: 'すしはしょうゆで{食|た}べます。', exRo: 'Sushi wa shouyu de tabemasu.', exVi: 'Sushi thì ăn với (chấm) xì dầu.' },
        { w: 'コップ', pos: 'danh từ', ipa: 'koppu', vi: 'cốc, cái cốc (cốc nước, cốc thuỷ tinh)', ex: 'コップが{五|いつ}つあります。', exRo: 'Koppu ga itsutsu arimasu.', exVi: 'Có 5 cái cốc.' },
        { w: '（お）{皿|さら}', pos: 'danh từ', ipa: '(o)sara', vi: 'đĩa, cái đĩa (お{皿|さら} = cách nói lịch sự, hay dùng hơn)', ex: 'お{皿|さら}を{洗|あら}ってください。', exRo: 'Osara o aratte kudasai.', exVi: 'Rửa đĩa giúp tôi.' },
        { w: 'スプーン', pos: 'danh từ', ipa: 'supuun', vi: 'cái thìa, cái muỗng', ex: 'カレーはスプーンで{食|た}べます。', exRo: 'Karee wa supuun de tabemasu.', exVi: 'Cà ri thì ăn bằng thìa.' },
        { w: 'ナイフ', pos: 'danh từ', ipa: 'naifu', vi: 'dao, con dao', ex: 'ナイフでパンを{切|き}ります。', exRo: 'Naifu de pan o kirimasu.', exVi: 'Cắt bánh mì bằng dao.' },
        { w: 'フォーク', pos: 'danh từ', ipa: 'fooku', vi: 'cái dĩa, cái nĩa', ex: 'フォークを{取|と}りましょうか。', exRo: 'Fooku o torimashou ka.', exVi: 'Để tôi lấy nĩa cho nhé?' },
        { w: 'はし', pos: 'danh từ', ipa: 'hashi', vi: 'đũa (thường nói おはし)', ex: '{日本|にほん}の{人|ひと}ははしでご{飯|はん}を{食|た}べます。', exRo: 'Nihon no hito wa hashi de gohan o tabemasu.', exVi: 'Người Nhật ăn cơm bằng đũa.' },
      ],
    },

    { t: 'h', text: 'E. Chữ, từ để hỏi, câu giao tiếp (7 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{漢字|かんじ}', pos: 'danh từ', ipa: 'kanji', vi: 'chữ Hán', ex: '{名前|なまえ}を{漢字|かんじ}で{書|か}いてください。', exRo: 'Namae o kanji de kaite kudasai.', exVi: 'Hãy viết tên bằng chữ Hán.' },
        { w: 'どれ', pos: 'từ để hỏi', ipa: 'dore', vi: 'cái nào (trong 3 thứ trở lên; đứng MỘT MÌNH, không kèm danh từ)', ex: '{砂糖|さとう}はどれですか。——それです。', exRo: 'Satou wa dore desu ka. — Sore desu.', exVi: 'Đường là cái nào? — Cái đó.' },
        { w: 'どの～', pos: 'từ để hỏi (định từ)', ipa: 'dono ~', vi: '… nào (luôn có danh từ theo sau: どのお{皿|さら}, どのナイフ)', ex: 'どのナイフですか。——そのナイフです。', exRo: 'Dono naifu desu ka. — Sono naifu desu.', exVi: 'Con dao nào? — Con dao đó.' },
        { w: 'たくさん', pos: 'phó từ', ipa: 'takusan', vi: 'nhiều', ex: '{冷蔵庫|れいぞうこ}にビールがたくさんあります。', exRo: 'Reizouko ni biiru ga takusan arimasu.', exVi: 'Trong tủ lạnh có nhiều bia.' },
        { w: 'すみませんが', pos: 'câu nói', ipa: 'sumimasen ga', vi: 'xin lỗi (cho tôi nhờ / hỏi…) — mở đầu trước lời nhờ ～てください', ex: 'すみませんが、{塩|しお}を{取|と}ってください。', exRo: 'Sumimasen ga, shio o totte kudasai.', exVi: 'Xin lỗi, lấy giúp tôi lọ muối.' },
        { w: 'ああ', pos: 'thán từ', ipa: 'aa', vi: 'a, à (khi nhận ra điều gì)', ex: 'ああ、これですね。', exRo: 'Aa, kore desu ne.', exVi: 'A, là cái này nhỉ! (câu mẫu của cô)' },
        { w: 'いいですよ', pos: 'câu nói', ipa: 'ii desu yo', vi: 'được đấy!, được thôi (nhận lời khi được nhờ)', ex: 'A：{作|つく}り{方|かた}を{教|おし}えてください。B：いいですよ。', exRo: 'A: Tsukurikata o oshiete kudasai. B: Ii desu yo.', exVi: 'A: Chỉ mình cách làm đi. B: Được thôi.' },
      ],
    },

    { t: 'h', text: 'F. Động từ khi chuẩn bị tiệc (14 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{洗|あら}います［{洗|あら}う］', pos: 'động từ nhóm 1', ipa: 'araimasu [arau]', vi: 'rửa (bát, rau, tay…) — thể て: **{洗|あら}って**', ex: '{台所|だいどころ}でお{皿|さら}を{洗|あら}います。', exRo: 'Daidokoro de osara o araimasu.', exVi: 'Rửa đĩa ở trong bếp.' },
        { w: '{置|お}きます［{置|お}く］', pos: 'động từ nhóm 1', ipa: 'okimasu [oku]', vi: 'đặt, để — thể て: **{置|お}いて**', ex: '{花|はな}をテーブルの{上|うえ}に{置|お}いてください。', exRo: 'Hana o teeburu no ue ni oite kudasai.', exVi: 'Hãy đặt hoa lên bàn.' },
        { w: '{書|か}きます［{書|か}く］', pos: 'động từ nhóm 1', ipa: 'kakimasu [kaku]', vi: 'viết — thể て: **{書|か}いて**', ex: 'ここに{名前|なまえ}を{書|か}いてください。', exRo: 'Koko ni namae o kaite kudasai.', exVi: 'Hãy viết tên vào đây.' },
        { w: '{貸|か}します［{貸|か}す］', pos: 'động từ nhóm 1', ipa: 'kashimasu [kasu]', vi: 'cho mượn — thể て: **{貸|か}して** (≠ {借|か}ります: mượn)', ex: 'すみませんが、ペンを{貸|か}してください。', exRo: 'Sumimasen ga, pen o kashite kudasai.', exVi: 'Xin lỗi, cho tôi mượn cái bút.' },
        { w: '{聞|き}きます［{聞|き}く］', pos: 'động từ nhóm 1', ipa: 'kikimasu [kiku]', vi: 'nghe; hỏi (người **に** 聞きます) — thể て: **{聞|き}いて**', ex: 'パクさんに{電話|でんわ}{番号|ばんごう}を{聞|き}きます。', exRo: 'Paku-san ni denwa bangou o kikimasu.', exVi: 'Tôi hỏi chị Park số điện thoại. (câu mẫu của cô)' },
        { w: '{切|き}ります［{切|き}る］', pos: 'động từ nhóm 1', ipa: 'kirimasu [kiru]', vi: 'cắt, gọt — thể て: **{切|き}って** (nhóm 1, dù trông giống nhóm 2!)', ex: '{野菜|やさい}を{切|き}ってください。', exRo: 'Yasai o kitte kudasai.', exVi: 'Hãy cắt rau.' },
        { w: '{使|つか}います［{使|つか}う］', pos: 'động từ nhóm 1', ipa: 'tsukaimasu [tsukau]', vi: 'dùng, sử dụng — thể て: **{使|つか}って**', ex: 'この{電子|でんし}レンジを{使|つか}ってください。', exRo: 'Kono denshi renji o tsukatte kudasai.', exVi: 'Hãy dùng cái lò vi sóng này.' },
        { w: '{手伝|てつだ}います［{手伝|てつだ}う］', pos: 'động từ nhóm 1', ipa: 'tetsudaimasu [tetsudau]', vi: 'giúp, giúp đỡ (việc tay chân) — thể て: **{手伝|てつだ}って**', ex: '{手伝|てつだ}いましょうか。', exRo: 'Tetsudaimashou ka.', exVi: 'Để tôi giúp nhé?' },
        { w: '{取|と}ります［{取|と}る］', pos: 'động từ nhóm 1', ipa: 'torimasu [toru]', vi: 'cầm, lấy (lấy giúp, chuyền cho) — thể て: **{取|と}って**', ex: 'そのお{皿|さら}を{取|と}ってください。', exRo: 'Sono osara o totte kudasai.', exVi: 'Lấy giúp tôi cái đĩa đó.' },
        { w: '{持|も}って{行|い}きます［{持|も}って{行|い}く］', pos: 'động từ nhóm 1', ipa: 'motte ikimasu [motte iku]', vi: 'mang đi (mang từ đây đến chỗ khác) — thể て: **{持|も}って{行|い}って**', ex: 'パーティーにワインを{持|も}って{行|い}きます。', exRo: 'Paatii ni wain o motte ikimasu.', exVi: 'Tôi mang rượu vang đến bữa tiệc.' },
        { w: 'わかります［わかる］', pos: 'động từ nhóm 1', ipa: 'wakarimasu [wakaru]', vi: 'hiểu, biết (N **が** わかります) — thể て: **わかって**', ex: 'カレーの{作|つく}り{方|かた}がわかりません。', exRo: 'Karee no tsukurikata ga wakarimasen.', exVi: 'Tôi không biết cách nấu cà ri.' },
        { w: '{出|だ}します［{出|だ}す］', pos: 'động từ nhóm 1', ipa: 'dashimasu [dasu]', vi: 'lấy ra, đưa ra; nộp (bài) — thể て: **{出|だ}して**', ex: '{冷蔵庫|れいぞうこ}からジュースを{出|だ}します。', exRo: 'Reizouko kara juusu o dashimasu.', exVi: 'Tôi lấy nước hoa quả từ tủ lạnh ra. (câu mẫu của cô)' },
        { w: '{入|い}れます［{入|い}れる］', pos: 'động từ nhóm 2', ipa: 'iremasu [ireru]', vi: 'cho vào, bỏ vào — thể て: **{入|い}れて** (≠ {入|はい}ります: đi vào, nhóm 1)', ex: 'ジュースを{冷蔵庫|れいぞうこ}に{入|い}れてください。', exRo: 'Juusu o reizouko ni irete kudasai.', exVi: 'Hãy cho nước hoa quả vào tủ lạnh.' },
        { w: '{教|おし}えます［{教|おし}える］', pos: 'động từ nhóm 2', ipa: 'oshiemasu [oshieru]', vi: 'dạy; chỉ bảo, cho biết — thể て: **{教|おし}えて**', ex: '{電話|でんわ}{番号|ばんごう}を{教|おし}えてください。', exRo: 'Denwa bangou o oshiete kudasai.', exVi: 'Cho tôi biết số điện thoại.' },
      ],
    },

    { t: 'h', text: 'G. Ở bữa tiệc — danh từ (7 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{歌|うた}', pos: 'danh từ', ipa: 'uta', vi: 'bài hát', ex: '{日本|にほん}の{歌|うた}が{好|す}きです。', exRo: 'Nihon no uta ga suki desu.', exVi: 'Tôi thích bài hát Nhật.' },
        { w: 'ギター', pos: 'danh từ', ipa: 'gitaa', vi: 'đàn ghi ta', ex: 'カルロスさんはギターを{弾|ひ}いています。', exRo: 'Karurosu-san wa gitaa o hiite imasu.', exVi: 'Carlos đang chơi guitar.' },
        { w: '{台所|だいどころ}', pos: 'danh từ', ipa: 'daidokoro', vi: 'nhà bếp', ex: 'パクさんは{台所|だいどころ}にいます。', exRo: 'Paku-san wa daidokoro ni imasu.', exVi: 'Park ở trong bếp.' },
        { w: 'たばこ', pos: 'danh từ', ipa: 'tabako', vi: 'thuốc lá', ex: 'たばこを{吸|す}いますか。——いいえ、{吸|す}いません。', exRo: 'Tabako o suimasu ka. — Iie, suimasen.', exVi: 'Bạn có hút thuốc không? — Không, tôi không hút.' },
        { w: '{電話|でんわ}', pos: 'danh từ', ipa: 'denwa', vi: 'điện thoại; cuộc gọi', ex: 'アンナさんは{電話|でんわ}をかけています。', exRo: 'Anna-san wa denwa o kakete imasu.', exVi: 'Anna đang gọi điện.' },
        { w: 'ピザ', pos: 'danh từ', ipa: 'piza', vi: 'bánh pizza', ex: '{誰|だれ}がピザを{持|も}って{来|き}ましたか。', exRo: 'Dare ga piza o motte kimashita ka.', exVi: 'Ai đã mang pizza đến?' },
        { w: '{窓|まど}', pos: 'danh từ', ipa: 'mado', vi: 'cửa sổ', ex: '{窓|まど}を{開|あ}けましょうか。', exRo: 'Mado o akemashou ka.', exVi: 'Để tôi mở cửa sổ nhé?' },
      ],
    },

    { t: 'h', text: 'H. Ở bữa tiệc — động từ (9 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{歌|うた}います［{歌|うた}う］', pos: 'động từ nhóm 1', ipa: 'utaimasu [utau]', vi: 'hát — thể て: **{歌|うた}って**', ex: 'メアリーさんは{歌|うた}を{歌|うた}っています。', exRo: 'Mearii-san wa uta o utatte imasu.', exVi: 'Mary đang hát.' },
        { w: '{吸|す}います［{吸|す}う］', pos: 'động từ nhóm 1', ipa: 'suimasu [suu]', vi: 'hút (thuốc) — thể て: **{吸|す}って**', ex: 'マルコさんは{外|そと}でたばこを{吸|す}っています。', exRo: 'Maruko-san wa soto de tabako o sutte imasu.', exVi: 'Marco đang hút thuốc ở ngoài.' },
        { w: '{話|はな}します［{話|はな}す］', pos: 'động từ nhóm 1', ipa: 'hanashimasu [hanasu]', vi: 'nói chuyện (người **と** 話します) — thể て: **{話|はな}して**', ex: 'ワンさんはダニエルさんと{話|はな}しています。', exRo: 'Wan-san wa Danieru-san to hanashite imasu.', exVi: 'Wang đang nói chuyện với Daniel.' },
        { w: '{弾|ひ}きます［{弾|ひ}く］', pos: 'động từ nhóm 1', ipa: 'hikimasu [hiku]', vi: 'chơi (nhạc cụ có dây / phím: guitar, piano) — thể て: **{弾|ひ}いて**', ex: 'ギターを{弾|ひ}いてください。', exRo: 'Gitaa o hiite kudasai.', exVi: 'Hãy chơi guitar đi.' },
        { w: '{持|も}ちます［{持|も}つ］', pos: 'động từ nhóm 1', ipa: 'mochimasu [motsu]', vi: 'cầm, mang, xách — thể て: **{持|も}って**', ex: 'この{荷物|にもつ}を{持|も}ちましょうか。', exRo: 'Kono nimotsu o mochimashou ka.', exVi: 'Để tôi xách hành lý này cho nhé? ({荷物|にもつ} — hành lý, từ thêm)' },
        { w: '{開|あ}けます［{開|あ}ける］', pos: 'động từ nhóm 2', ipa: 'akemasu [akeru]', vi: 'mở (cửa, hộp…) — thể て: **{開|あ}けて**', ex: '{暑|あつ}いですね。{窓|まど}を{開|あ}けてください。', exRo: 'Atsui desu ne. Mado o akete kudasai.', exVi: 'Nóng nhỉ. Hãy mở cửa sổ ra.' },
        { w: '{閉|し}めます［{閉|し}める］', pos: 'động từ nhóm 2', ipa: 'shimemasu [shimeru]', vi: 'đóng — thể て: **{閉|し}めて**', ex: '{寒|さむ}いですから、{窓|まど}を{閉|し}めましょうか。', exRo: 'Samui desu kara, mado o shimemashou ka.', exVi: 'Lạnh quá, để tôi đóng cửa sổ nhé?' },
        { w: 'かけます［かける］', pos: 'động từ nhóm 2', ipa: 'kakemasu [kakeru]', vi: 'gọi (điện thoại): người **に** {電話|でんわ}**を** かけます — thể て: **かけて**', ex: '{友達|ともだち}に{電話|でんわ}をかけます。', exRo: 'Tomodachi ni denwa o kakemasu.', exVi: 'Tôi gọi điện cho bạn tôi. (câu mẫu của cô)' },
        { w: '{持|も}って{来|き}ます［{持|も}って{来|く}る］', pos: 'động từ nhóm 3', ipa: 'motte kimasu [motte kuru]', vi: 'mang đến (mang về phía chỗ người nói) — thể て: **{持|も}って{来|き}て**', ex: 'ビールを{持|も}って{来|き}ましょうか。', exRo: 'Biiru o motte kimashou ka.', exVi: 'Để tôi mang bia đến nhé?' },
      ],
    },
    {
      t: 'table',
      caption: 'Ôn nhanh: 25 động từ mới của Bài 7 và thể て',
      head: ['Nhóm', 'Thể ます', 'Thể て', 'Romaji', 'Nghĩa'],
      rows: [
        ['1', '{洗|あら}います', '{洗|あら}って', 'aratte', 'rửa'],
        ['1', '{使|つか}います', '{使|つか}って', 'tsukatte', 'dùng'],
        ['1', '{手伝|てつだ}います', '{手伝|てつだ}って', 'tetsudatte', 'giúp'],
        ['1', '{歌|うた}います', '{歌|うた}って', 'utatte', 'hát'],
        ['1', '{吸|す}います', '{吸|す}って', 'sutte', 'hút'],
        ['1', '{持|も}ちます', '{持|も}って', 'motte', 'cầm'],
        ['1', '{取|と}ります', '{取|と}って', 'totte', 'lấy'],
        ['1', '{切|き}ります', '{切|き}って', 'kitte', 'cắt'],
        ['1', 'わかります', 'わかって', 'wakatte', 'hiểu'],
        ['1', '{置|お}きます', '{置|お}いて', 'oite', 'đặt'],
        ['1', '{書|か}きます', '{書|か}いて', 'kaite', 'viết'],
        ['1', '{聞|き}きます', '{聞|き}いて', 'kiite', 'nghe, hỏi'],
        ['1', '{弾|ひ}きます', '{弾|ひ}いて', 'hiite', 'chơi (đàn)'],
        ['1', '{貸|か}します', '{貸|か}して', 'kashite', 'cho mượn'],
        ['1', '{出|だ}します', '{出|だ}して', 'dashite', 'lấy ra'],
        ['1', '{話|はな}します', '{話|はな}して', 'hanashite', 'nói chuyện'],
        ['1 ※', '{迎|むか}えに{行|い}きます', '{迎|むか}えに{行|い}って', 'mukae ni itte', 'đi đón (ngoại lệ 行く)'],
        ['1 ※', '{持|も}って{行|い}きます', '{持|も}って{行|い}って', 'motte itte', 'mang đi (ngoại lệ 行く)'],
        ['2', '{入|い}れます', '{入|い}れて', 'irete', 'cho vào'],
        ['2', '{教|おし}えます', '{教|おし}えて', 'oshiete', 'dạy, chỉ'],
        ['2', '{開|あ}けます', '{開|あ}けて', 'akete', 'mở'],
        ['2', '{閉|し}めます', '{閉|し}めて', 'shimete', 'đóng'],
        ['2', 'かけます', 'かけて', 'kakete', 'gọi (điện)'],
        ['2', 'います', 'いて', 'ite', 'ở, có (người)'],
        ['3', '{持|も}って{来|き}ます', '{持|も}って{来|き}て', 'motte kite', 'mang đến'],
      ],
    },

    { t: 'h', text: '5 câu mẫu trong danh sách của cô (mục 21, 44, 52, 58, 75)' },
    {
      t: 'examples',
      items: [
        { en: '{私|わたし}は{本屋|ほんや}の{中|なか}にいます。', ro: 'Watashi wa hon-ya no naka ni imasu.', vi: 'Tôi ở (trong) hiệu sách. — ポイント 61 (người + います).' },
        { en: 'パクさんに{電話|でんわ}{番号|ばんごう}を{聞|き}きます。', ro: 'Paku-san ni denwa bangou o kikimasu.', vi: 'Tôi hỏi chị Park số điện thoại. — 聞きます = HỎI: người **に**, điều hỏi **を**.' },
        { en: '{冷蔵庫|れいぞうこ}からジュースを{出|だ}します。', ro: 'Reizouko kara juusu o dashimasu.', vi: 'Tôi lấy nước hoa quả từ tủ lạnh ra. — chỗ lấy ra **から**.' },
        { en: 'ああ、これですね。', ro: 'Aa, kore desu ne.', vi: 'A, là cái này nhỉ! — khi nhận ra đồ vật người kia nói (ポイント 69, 70).' },
        { en: '{友達|ともだち}に{電話|でんわ}をかけます。', ro: 'Tomodachi ni denwa o kakemasu.', vi: 'Tôi gọi điện cho bạn tôi. — người **に** {電話|でんわ} **を** かけます.' },
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp trong từ bài 7',
      items: [
        '**{隣|となり} ↔ {横|よこ}**: cả hai là "bên cạnh". {隣|となり} = sát bên, hai thứ **cùng loại** (nhà cạnh nhà, người ngồi cạnh). {横|よこ} = bên cạnh nói chung, khác loại cũng được (cái cây cạnh hòm thư). Không chắc thì dùng {横|よこ}.',
        '**{近|ちか}く (danh từ) ↔ {近|ちか}い (tính từ, Bài 6)**: {駅|えき}の{近|ちか}く**に**あります (ở gần ga) — {駅|えき}は{近|ちか}い**です** (ga gần). Không nói ~~{駅|えき}の{近|ちか}いにあります~~.',
        '**{貸|か}します ↔ {借|か}ります**: {貸|か}します = cho (người khác) mượn; {借|か}ります = (mình) mượn. Nhờ bạn cho mượn bút: ペンを**{貸|か}して**ください (không phải ~~{借|か}りてください~~).',
        '**{入|い}れます ↔ {入|はい}ります**: {入|い}れます (nhóm 2) = CHO cái gì vào — có を; {入|はい}ります (nhóm 1, Bài 5) = (mình) ĐI vào — {部屋|へや}に{入|はい}ります.',
        '**{持|も}って{行|い}きます ↔ {持|も}って{来|き}ます**: đi XA chỗ người nói → {行|い}きます; về PHÍA người nói → {来|き}ます. Chủ nhà nói với khách: ワインを{持|も}って{来|き}てください.',
        '**{聞|き}きます** có hai nghĩa: nghe ({音楽|おんがく}を{聞|き}きます) và hỏi (**người に** 聞きます). **{切|き}ります** là nhóm 1 → {切|き}って (không phải ~~{切|き}て~~).',
        '**{弾|ひ}きます** chỉ dùng cho đàn (guitar, piano). Hát: {歌|うた}を{歌|うた}います. Chơi thể thao: します.',
      ],
    },

    { t: 'h', text: 'Từ thêm (sách có, danh sách của cô không có — chỉ cần nghe hiểu)' },
    {
      t: 'table',
      head: ['Từ / câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['アパート', 'apaato', 'Căn hộ, chung cư nhỏ (trang đọc 話読聞書)'],
        ['お{願|ねが}いします', 'onegaishimasu', 'Nhờ bạn / làm ơn (đáp lại lời đề nghị giúp ～ましょうか)'],
        ['{道|みち}', 'michi', 'Đường (tên chủ đề 7-1: {道|みち}がわかりません)'],
        ['{準備|じゅんび}', 'junbi', 'Sự chuẩn bị (tên chủ đề 7-2)'],
        ['{楽|たの}しい', 'tanoshii', 'Vui (tên chủ đề 7-3)'],
        ['{作|つく}り{方|かた}／{使|つか}い{方|かた}', 'tsukurikata / tsukaikata', 'Cách làm / cách dùng (ポイント 66)'],
        ['{迷|まよ}います', 'mayoimasu', 'Lạc ({道|みち}に{迷|まよ}いました = bị lạc đường)'],
        ['{招待状|しょうたいじょう}', 'shoutaijou', 'Thư mời (できる!)'],
        ['{飲|の}み{会|かい}', 'nomikai', 'Buổi nhậu, liên hoan'],
        ['{誕生日|たんじょうび}パーティー', 'tanjoubi paatii', 'Tiệc sinh nhật'],
        ['{寮|りょう}', 'ryou', 'Ký túc xá (Bài 5)'],
        ['ええと', 'eeto', 'Ờ…, để xem (ngập ngừng)'],
        ['えっ？', 'e?', 'Hả? (ngạc nhiên, nghe không rõ)'],
        ['どうも', 'doumo', 'Cảm ơn (ngắn, thân mật)'],
        ['すごいですね', 'sugoi desu ne', 'Giỏi quá / tuyệt quá'],
        ['{押|お}します', 'oshimasu', 'Bấm, ấn (nút)'],
        ['{向|む}こう', 'mukou', 'Phía bên kia'],
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b7-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp — ポイント 61–71 + thể て: ở đâu, nhờ làm, đang làm, đề nghị giúp',
  goal: 'Nói người / vật ở đâu và ở đâu có gì, chia thành thạo thể て của cả 3 nhóm động từ, dùng thể て để nhờ (～てください) và tả việc đang làm (～ています), đề nghị giúp (～ましょうか), hỏi cách làm (～方), còn / hết (まだ／もう), ai làm (誰が), cái nào (どの／どれ), làm bằng gì (Nで).',
  minutes: 90,
  blocks: [
    {
      t: 'p',
      text: 'Bài 7 có **11 điểm ngữ pháp** (ポイント 61–71) và một thứ quan trọng hơn cả: **thể て** (テ形) của động từ. Thể て là "chìa khoá vạn năng" — từ nay đến cuối sách nó mở ra ～てください (Bài 7), ～ています (Bài 7, 8, 10, 11…), ～てもいいです (Bài 10), ～てから (Bài 12)… Học thật chắc bảng chia ở mục "Thể て" dưới đây trước khi học ポイント 63, 64.',
    },
    {
      t: 'table',
      caption: 'Bản đồ 11 điểm ngữ pháp — theo 3 chủ đề của bài',
      head: ['ポイント', 'Mẫu', 'Nghĩa', 'Ví dụ ngắn'],
      rows: [
        ['61', 'N1（người）は N2（nơi）に います／N1（vật）は N2（nơi）に あります', 'N1 ở N2', '{私|わたし}は{本屋|ほんや}にいます。'],
        ['62', 'N1（nơi）に N2（người, con vật）が います／N1（nơi）に N2（vật）が あります', 'Ở N1 có N2', 'あそこにパクさんがいます。'],
        ['63', 'V て ください', 'Hãy V (nhờ, bảo, mời)', '{塩|しお}を{取|と}ってください。'],
        ['64', 'V て います', 'Đang V', '{電話|でんわ}をかけています。'],
        ['65', 'V ましょうか', 'Để tôi V nhé? (đề nghị giúp)', '{手伝|てつだ}いましょうか。'],
        ['66', '（N の）V(bỏ ます) {方|かた}', 'Cách V', '{料理|りょうり}の{作|つく}り{方|かた}'],
        ['67', 'まだ／もう', 'Vẫn còn / không còn nữa', 'まだあります。／もうありません。'],
        ['68', '{誰|だれ}が', 'AI (làm)?', '{誰|だれ}が{作|つく}りましたか。'],
        ['69', 'どの N', 'N nào?', 'どのお{皿|さら}ですか。'],
        ['70', 'どれ', 'Cái nào?', '{塩|しお}はどれですか。'],
        ['71', 'N（dụng cụ）で V ます', 'Làm V bằng N', 'はしでご{飯|はん}を{食|た}べます。'],
      ],
    },

    /* ── ポイント 61 ── */
    { t: 'h', text: 'ポイント 61 — N1 は N2 に います／あります (N1 ở đâu)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1（người, con vật）は N2（nơi）に います。',
          vi: 'N1 **ở** N2. Chủ đề (は) là **người / con vật** đã biết, câu nói nó đang ở đâu. **に** đánh dấu nơi tồn tại.',
          examples: [
            { en: '{私|わたし}は{本屋|ほんや}にいます。', ro: 'Watashi wa hon-ya ni imasu.', vi: 'Tôi ở hiệu sách.' },
            { en: 'パクさんは{台所|だいどころ}にいます。', ro: 'Paku-san wa daidokoro ni imasu.', vi: 'Park ở trong bếp.' },
            { en: '{犬|いぬ}は{外|そと}にいます。', ro: 'Inu wa soto ni imasu.', vi: 'Con chó ở bên ngoài.' },
          ],
        },
        {
          formula: 'N1（vật, nơi chốn）は N2（nơi）に あります。',
          vi: 'N1 (đồ vật, toà nhà, cây…) **ở** N2 — dùng **あります**.',
          examples: [
            { en: 'バス{停|てい}はコンビニの{前|まえ}にあります。', ro: 'Basutei wa konbini no mae ni arimasu.', vi: 'Trạm xe buýt ở trước cửa hàng tiện lợi.' },
            { en: '{交番|こうばん}はあのビルの{後|うし}ろにあります。', ro: 'Kouban wa ano biru no ushiro ni arimasu.', vi: 'Đồn công an ở phía sau toà nhà kia.' },
            { en: 'ジュースは{冷蔵庫|れいぞうこ}の{中|なか}にあります。', ro: 'Juusu wa reizouko no naka ni arimasu.', vi: 'Nước hoa quả ở trong tủ lạnh.' },
          ],
        },
        {
          formula: 'N1 は どこに いますか／ありますか。 → N2 に います／あります。',
          vi: 'Hỏi ở đâu: thay N2 bằng **どこ**. Trả lời có thể bỏ N1 (đã biết).',
          examples: [
            { en: '{今|いま}、どこにいますか。——{改札|かいさつ}の{前|まえ}にいます。', ro: 'Ima, doko ni imasu ka. — Kaisatsu no mae ni imasu.', vi: 'Giờ bạn ở đâu? — Tôi ở trước cổng soát vé.' },
            { en: '{銀行|ぎんこう}はどこにありますか。——{本屋|ほんや}の{隣|となり}にあります。', ro: 'Ginkou wa doko ni arimasu ka. — Hon-ya no tonari ni arimasu.', vi: 'Ngân hàng ở đâu? — Ở cạnh hiệu sách.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Công thức vị trí: N の + từ vị trí + に',
      head: ['Mẫu', 'Ví dụ', 'Romaji', 'Nghĩa'],
      rows: [
        ['N の{上|うえ}に', 'テーブルの{上|うえ}に', 'teeburu no ue ni', 'trên bàn'],
        ['N の{下|した}に', 'いすの{下|した}に', 'isu no shita ni', 'dưới ghế'],
        ['N の{中|なか}に', '{冷蔵庫|れいぞうこ}の{中|なか}に', 'reizouko no naka ni', 'trong tủ lạnh'],
        ['N の{外|そと}に', '{駅|えき}の{外|そと}に', 'eki no soto ni', 'ngoài ga'],
        ['N の{前|まえ}に', '{交番|こうばん}の{前|まえ}に', 'kouban no mae ni', 'trước đồn công an'],
        ['N の{後|うし}ろに', 'ビルの{後|うし}ろに', 'biru no ushiro ni', 'sau toà nhà'],
        ['N の{横|よこ}に', 'ポストの{横|よこ}に', 'posuto no yoko ni', 'cạnh hòm thư'],
        ['N の{隣|となり}に', '{銀行|ぎんこう}の{隣|となり}に', 'ginkou no tonari ni', 'sát cạnh ngân hàng'],
        ['N の{近|ちか}くに', '{駅|えき}の{近|ちか}くに', 'eki no chikaku ni', 'gần ga'],
        ['N1 と N2 の{間|あいだ}に', '{銀行|ぎんこう}と{本屋|ほんや}の{間|あいだ}に', 'ginkou to hon-ya no aida ni', 'giữa ngân hàng và hiệu sách'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp (ポイント 61)',
      lines: [
        { who: 'A', role: 'a', text: 'すみません。{郵便局|ゆうびんきょく}はどこにありますか。', ro: 'Sumimasen. Yuubinkyoku wa doko ni arimasu ka.', vi: 'Xin lỗi, bưu điện ở đâu ạ?' },
        { who: 'B', role: 'b', text: '{郵便局|ゆうびんきょく}ですか。{銀行|ぎんこう}と{本屋|ほんや}の{間|あいだ}にありますよ。', ro: 'Yuubinkyoku desu ka. Ginkou to hon-ya no aida ni arimasu yo.', vi: 'Bưu điện à? Ở giữa ngân hàng và hiệu sách đấy.' },
        { who: 'A', role: 'a', text: 'ありがとうございます。あのう、ワンさんはどこにいますか。', ro: 'Arigatou gozaimasu. Anou, Wan-san wa doko ni imasu ka.', vi: 'Cảm ơn. À, Wang đang ở đâu?' },
        { who: 'B', role: 'b', text: 'ワンさんは{郵便局|ゆうびんきょく}の{中|なか}にいます。', ro: 'Wan-san wa yuubinkyoku no naka ni imasu.', vi: 'Wang đang ở trong bưu điện.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — ポイント 61',
      head: ['N1 は', 'N (mốc) の', 'vị trí に', 'います／あります'],
      rows: [
        ['{私|わたし}は · アンナさんは', '{駅|えき}の · {交番|こうばん}の', '{前|まえ}に · {中|なか}に', 'います。'],
        ['{犬|いぬ}は', '{木|き}の · いすの', '{下|した}に · {横|よこ}に', 'います。'],
        ['バス{停|てい}は · ポストは', 'コンビニの · {郵便局|ゆうびんきょく}の', '{前|まえ}に · {隣|となり}に', 'あります。'],
        ['お{皿|さら}は · {塩|しお}は', 'テーブルの · {冷蔵庫|れいぞうこ}の', '{上|うえ}に · {中|なか}に', 'あります。'],
      ],
    },

    /* ── ポイント 62 ── */
    { t: 'h', text: 'ポイント 62 — N1 に N2 が います／あります (ở N1 có N2)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1（nơi）に N2（người, con vật）が います。',
          vi: '**Ở N1 có N2** — câu giới thiệu cái MỚI xuất hiện, người nghe chưa biết. Nơi chốn đứng đầu với **に**, thứ tồn tại đi với **が**.',
          examples: [
            { en: 'あそこにパクさんがいます。', ro: 'Asoko ni Paku-san ga imasu.', vi: 'Ở đằng kia có Park kìa.' },
            { en: '{木|き}の{下|した}に{犬|いぬ}がいます。', ro: 'Ki no shita ni inu ga imasu.', vi: 'Dưới gốc cây có con chó.' },
          ],
        },
        {
          formula: 'N1（nơi）に N2（vật）が あります。',
          vi: 'Ở N1 có (vật) N2.',
          examples: [
            { en: '{銀行|ぎんこう}の{前|まえ}に{本屋|ほんや}があります。', ro: 'Ginkou no mae ni hon-ya ga arimasu.', vi: 'Trước ngân hàng có hiệu sách.' },
            { en: '{近|ちか}くに{大|おお}きいスーパーがあります。', ro: 'Chikaku ni ookii suupaa ga arimasu.', vi: 'Gần đây có siêu thị lớn.' },
          ],
        },
        {
          formula: 'N1 に {何|なに}が ありますか。／N1 に {誰|だれ}が いますか。',
          vi: 'Hỏi "ở đó có gì / có ai": từ để hỏi + **が**. Trả lời: N2 が あります／います. Không có gì / không có ai: **{何|なに}もありません／{誰|だれ}もいません**.',
          examples: [
            { en: '{近|ちか}くに{何|なに}がありますか。——コンビニがあります。', ro: 'Chikaku ni nani ga arimasu ka. — Konbini ga arimasu.', vi: 'Gần đó có gì? — Có cửa hàng tiện lợi.' },
            { en: '{台所|だいどころ}に{誰|だれ}がいますか。——ワンさんがいます。', ro: 'Daidokoro ni dare ga imasu ka. — Wan-san ga imasu.', vi: 'Trong bếp có ai? — Có Wang.' },
            { en: '{部屋|へや}に{誰|だれ}がいますか。——{誰|だれ}もいません。', ro: 'Heya ni dare ga imasu ka. — Dare mo imasen.', vi: 'Trong phòng có ai? — Không có ai cả.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'So sánh 61 ↔ 62 — cùng một cảnh, hai cách nói',
      head: ['', 'ポイント 61', 'ポイント 62'],
      rows: [
        ['Khung', 'N1 **は** nơi **に** います／あります', 'nơi **に** N1 **が** います／あります'],
        ['Hỏi cái gì?', 'N1 ở ĐÂU? (đã biết N1)', 'Ở đó có CÁI GÌ / AI? (chưa biết)'],
        ['Câu hỏi', '{犬|いぬ}はどこにいますか。', '{木|き}の{下|した}に{何|なに}がいますか。'],
        ['Trả lời', '{木|き}の{下|した}にいます。', '{犬|いぬ}がいます。'],
        ['Câu hỏi', 'コンビニはどこにありますか。', '{駅|えき}の{前|まえ}に{何|なに}がありますか。'],
        ['Trả lời', '{駅|えき}の{前|まえ}にあります。', 'コンビニがあります。'],
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp — は／が và に／で',
      items: [
        '~~{木|き}の{下|した}**で**{犬|いぬ}がいます~~ → nơi TỒN TẠI dùng **に**. **で** chỉ dùng cho nơi xảy ra hành động (ここで{食|た}べます) hoặc sự kiện (Bài 6: {横浜|よこはま}で{試合|しあい}があります).',
        'Từ để hỏi không bao giờ đi với は: ~~{何|なに}はありますか~~ → **{何|なに}が**ありますか; ~~{誰|だれ}はいますか~~ → **{誰|だれ}が**いますか.',
        '~~パクさん**が**あります~~ → người luôn **います**. ~~{本屋|ほんや}がいます~~ → toà nhà luôn **あります**.',
        'Người Việt hay quên の: ~~{駅|えき}{前|まえ}にあります~~ → {駅|えき}**の**{前|まえ}にあります (駅前 là một từ ghép riêng, chưa học).',
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp khi lạc đường (61 + 62)',
      lines: [
        { who: 'A', role: 'a', text: 'もしもし、Bさん、{今|いま}、どこにいますか。', ro: 'Moshimoshi, B-san, ima, doko ni imasu ka.', vi: 'A lô, B à, giờ bạn đang ở đâu?' },
        { who: 'B', role: 'b', text: '{駅|えき}の{前|まえ}にいます。', ro: 'Eki no mae ni imasu.', vi: 'Mình ở trước ga.' },
        { who: 'A', role: 'a', text: 'えっ？ {近|ちか}くに{何|なに}がありますか。', ro: 'E? Chikaku ni nani ga arimasu ka.', vi: 'Hả? Gần đó có gì?' },
        { who: 'B', role: 'b', text: '{大|おお}きいスーパーがあります。スーパーの{隣|となり}に{交番|こうばん}があります。', ro: 'Ookii suupaa ga arimasu. Suupaa no tonari ni kouban ga arimasu.', vi: 'Có một siêu thị lớn. Cạnh siêu thị có đồn công an.' },
        { who: 'A', role: 'a', text: 'わかりました。{今|いま}、{迎|むか}えに{行|い}きます。', ro: 'Wakarimashita. Ima, mukae ni ikimasu.', vi: 'Hiểu rồi. Mình đi đón bạn ngay.' },
      ],
    },

    /* ── Thể て ── */
    { t: 'h', text: 'Thể て (テ形) — cách chia cho cả 3 nhóm động từ' },
    {
      t: 'p',
      text: 'Lấy **thể ます**, bỏ **ます**, rồi đổi theo nhóm. Nhóm 2 và nhóm 3 rất dễ. Nhóm 1 phải nhìn **âm đứng ngay trước ます** (hàng い: い・ち・り・み・び・に・き・ぎ・し) và đổi theo 5 quy tắc âm. Mẹo nhận nhóm: danh sách của cô ghi số 1/2/3 sau mỗi động từ — học thuộc số đó cùng với từ.',
    },
    {
      t: 'table',
      caption: 'Nhóm 1 (1グループ) — 5 quy tắc đổi âm',
      head: ['Âm trước ます', '→ thể て', 'Ví dụ (ます → て)', 'Romaji'],
      rows: [
        ['い・ち・り', '→ **って**', '{使|つか}います → {使|つか}って · {持|も}ちます → {持|も}って · {帰|かえ}ります → {帰|かえ}って', 'tsukatte · motte · kaette'],
        ['み・び・に', '→ **んで**', '{飲|の}みます → {飲|の}んで · {遊|あそ}びます → {遊|あそ}んで · {死|し}にます → {死|し}んで', 'nonde · asonde · shinde'],
        ['き', '→ **いて**', '{聞|き}きます → {聞|き}いて · {書|か}きます → {書|か}いて', 'kiite · kaite'],
        ['ぎ', '→ **いで**', '{泳|およ}ぎます → {泳|およ}いで · {急|いそ}ぎます → {急|いそ}いで', 'oyoide · isoide'],
        ['し', '→ **して**', '{話|はな}します → {話|はな}して · {出|だ}します → {出|だ}して', 'hanashite · dashite'],
        ['※ ngoại lệ', '{行|い}きます → **{行|い}って**', 'KHÔNG phải ~~{行|い}いて~~. Cả {持|も}って{行|い}きます → {持|も}って{行|い}って, {迎|むか}えに{行|い}きます → {迎|むか}えに{行|い}って', 'itte'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm 2 và nhóm 3',
      head: ['Nhóm', 'Quy tắc', 'Ví dụ', 'Romaji'],
      rows: [
        ['2グループ', 'bỏ ます → thêm **て**', '{食|た}べます → {食|た}べて · {起|お}きます → {起|お}きて · {見|み}ます → {見|み}て · {入|い}れます → {入|い}れて · {教|おし}えます → {教|おし}えて · います → いて', 'tabete · okite · mite · irete · oshiete · ite'],
        ['3グループ', 'します → **して** · {来|き}ます → **{来|き}て**', '{勉強|べんきょう}します → {勉強|べんきょう}して · {掃除|そうじ}します → {掃除|そうじ}して · {持|も}って{来|き}ます → {持|も}って{来|き}て', 'benkyou shite · souji shite · motte kite'],
      ],
    },
    {
      t: 'table',
      caption: '表 — bảng chia động từ của sách (p.282–283): ます形 → テ形 (→ 辞書形, Bài 9)',
      head: ['Nhóm', 'Thể ます', 'Thể て【7課】', 'Romaji', 'Thể từ điển【9課】'],
      rows: [
        ['1', '{聞|き}きます', '{聞|き}いて', 'kiite', '{聞|き}く'],
        ['1', '{泳|およ}ぎます', '{泳|およ}いで', 'oyoide', '{泳|およ}ぐ'],
        ['1', '{話|はな}します', '{話|はな}して', 'hanashite', '{話|はな}す'],
        ['1', '{持|も}ちます', '{持|も}って', 'motte', '{持|も}つ'],
        ['1', '{死|し}にます', '{死|し}んで', 'shinde', '{死|し}ぬ'],
        ['1', '{遊|あそ}びます', '{遊|あそ}んで', 'asonde', '{遊|あそ}ぶ'],
        ['1', '{飲|の}みます', '{飲|の}んで', 'nonde', '{飲|の}む'],
        ['1', '{帰|かえ}ります', '{帰|かえ}って', 'kaette', '{帰|かえ}る'],
        ['1', '{使|つか}います', '{使|つか}って', 'tsukatte', '{使|つか}う'],
        ['1 ※', '{行|い}きます', '※{行|い}って', 'itte', '{行|い}く'],
        ['2', '{食|た}べます', '{食|た}べて', 'tabete', '{食|た}べる'],
        ['2', '{起|お}きます', '{起|お}きて', 'okite', '{起|お}きる'],
        ['3', 'します', 'して', 'shite', 'する'],
        ['3', '{来|き}ます', '{来|き}て', 'kite', '{来|く}る'],
      ],
    },
    {
      t: 'table',
      caption: 'Động từ thêm trong bảng 表 (cùng quy tắc) — nhóm theo âm',
      head: ['Quy tắc', 'Động từ', 'Thể て'],
      rows: [
        ['き → いて', '{書|か}きます · {働|はたら}きます', '{書|か}いて · {働|はたら}いて'],
        ['ぎ → いで', '{急|いそ}ぎます · {脱|ぬ}ぎます', '{急|いそ}いで · {脱|ぬ}いで'],
        ['し → して', '{出|だ}します · {貸|か}します', '{出|だ}して · {貸|か}して'],
        ['ち → って', '{立|た}ちます · {待|ま}ちます', '{立|た}って · {待|ま}って'],
        ['び → んで', '{飛|と}びます', '{飛|と}んで'],
        ['み → んで', '{休|やす}みます · {読|よ}みます', '{休|やす}んで · {読|よ}んで'],
        ['り → って', '{作|つく}ります · {切|き}ります', '{作|つく}って · {切|き}って'],
        ['い → って', '{会|あ}います · {買|か}います', '{会|あ}って · {買|か}って'],
        ['nhóm 2', '{寝|ね}ます · {教|おし}えます · {見|み}ます · {借|か}ります', '{寝|ね}て · {教|おし}えて · {見|み}て · {借|か}りて'],
        ['nhóm 3', '{勉強|べんきょう}します · {掃除|そうじ}します · {持|も}って{来|き}ます', '{勉強|べんきょう}して · {掃除|そうじ}して · {持|も}って{来|き}て'],
      ],
    },
    {
      t: 'note',
      title: 'Nhận nhóm động từ — và các bẫy',
      items: [
        '**Nhóm 3** chỉ có します (và N＋します: {勉強|べんきょう}します, {掃除|そうじ}します…) và {来|き}ます (và {持|も}って{来|き}ます).',
        '**Nhóm 2**: đa số có âm **hàng え** trước ます ({食|た}べます, {入|い}れます, {開|あ}けます, {閉|し}めます, {教|おし}えます, かけます, {寝|ね}ます) + một số âm **hàng い** phải học thuộc: {見|み}ます, {起|お}きます, います, {借|か}ります.',
        '**Nhóm 1**: còn lại — âm hàng い trước ます. Bẫy: **{切|き}ります, {帰|かえ}ります, {入|はい}ります, わかります** trông như nhóm 2 nhưng là **nhóm 1** → {切|き}って, {帰|かえ}って, {入|はい}って, わかって.',
        'Cặp dễ nhầm: {切|き}ります (cắt, nhóm 1 → **{切|き}って**) ↔ {着|き}ます (mặc, nhóm 2 → {着|き}て); {入|はい}ります (vào, nhóm 1 → {入|はい}って) ↔ {入|い}れます (cho vào, nhóm 2 → {入|い}れて).',
        'Bài hát ghi nhớ nhóm 1: "**い・ち・り って, み・び・に んで, き いて, ぎ いで, し して — {行|い}く {行|い}って**".',
        'Ghi romaji: âm ngắt っ viết đôi phụ âm sau: {待|ま}って **matte**, {持|も}って **motte**, {行|い}って **itte**.',
      ],
    },
    {
      t: 'mcq',
      id: 'b7-np-te',
      title: 'Luyện chia thể て',
      items: [
        { q: '{書|か}きます → ?', options: ['{書|か}って', '{書|か}いて', '{書|か}きて', '{書|か}んで'], correct: 1, why: 'き → **いて**: {書|か}いて.' },
        { q: '{行|い}きます → ?', options: ['{行|い}いて', '{行|い}って', '{行|い}きて', '{行|い}んで'], correct: 1, why: 'Ngoại lệ duy nhất: **{行|い}って**.' },
        { q: '{飲|の}みます → ?', options: ['{飲|の}って', '{飲|の}いて', '{飲|の}んで', '{飲|の}みて'], correct: 2, why: 'み → **んで**.' },
        { q: '{洗|あら}います → ?', options: ['{洗|あら}いて', '{洗|あら}って', '{洗|あら}んで', '{洗|あら}て'], correct: 1, why: 'い → **って**.' },
        { q: '{貸|か}します → ?', options: ['{貸|か}して', '{貸|か}って', '{貸|か}いて', '{貸|か}しって'], correct: 0, why: 'し → **して**.' },
        { q: '{泳|およ}ぎます → ?', options: ['{泳|およ}いて', '{泳|およ}いで', '{泳|およ}って', '{泳|およ}んで'], correct: 1, why: 'ぎ → **いで** (có dấu ゛).' },
        { q: '{切|き}ります → ?', options: ['{切|き}て', '{切|き}って', '{切|き}りて', '{切|き}んで'], correct: 1, why: '{切|き}ります là **nhóm 1**: り → って.' },
        { q: '{教|おし}えます → ?', options: ['{教|おし}えって', '{教|おし}えて', '{教|おし}んで', '{教|おし}いて'], correct: 1, why: 'Nhóm 2: bỏ ます + て.' },
        { q: '{持|も}って{来|き}ます → ?', options: ['{持|も}って{来|き}って', '{持|も}って{来|き}て', '{持|も}って{来|く}て', '{持|も}って{来|き}いて'], correct: 1, why: 'Nhóm 3: {来|き}ます → **{来|き}て**.' },
        { q: '{遊|あそ}びます → ?', options: ['{遊|あそ}びて', '{遊|あそ}って', '{遊|あそ}んで', '{遊|あそ}いで'], correct: 2, why: 'び → **んで**.' },
        { q: '{待|ま}ちます → ?', options: ['{待|ま}ちて', '{待|ま}って', '{待|ま}んで', '{待|ま}いて'], correct: 1, why: 'ち → **って**.' },
        { q: '{弾|ひ}きます → ?', options: ['{弾|ひ}いて', '{弾|ひ}って', '{弾|ひ}きて', '{弾|ひ}いで'], correct: 0, why: 'き → **いて**.' },
      ],
    },

    /* ── ポイント 63 ── */
    { t: 'h', text: 'ポイント 63 — V て ください (Hãy V — nhờ, bảo, mời)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（N を）V て ください。',
          vi: '**Hãy V / làm ơn V** — nhờ ai làm gì, chỉ dẫn, hoặc mời. Chia thể て rồi thêm ください. Thêm **すみませんが、** ở đầu cho lịch sự hơn khi nhờ.',
          examples: [
            { en: '{私|わたし}のかばんを{取|と}ってください。', ro: 'Watashi no kaban o totte kudasai.', vi: 'Lấy giúp tôi cái cặp.' },
            { en: '{果物|くだもの}を{洗|あら}ってください。', ro: 'Kudamono o aratte kudasai.', vi: 'Hãy rửa hoa quả.' },
            { en: 'すみませんが、ペンを{貸|か}してください。', ro: 'Sumimasen ga, pen o kashite kudasai.', vi: 'Xin lỗi, cho tôi mượn cái bút.' },
          ],
        },
        {
          formula: 'N（nơi）に N を V て ください。',
          vi: 'Chỉ dẫn đặt / cho vào đâu: nơi **に**.',
          examples: [
            { en: 'お{皿|さら}をテーブルの{上|うえ}に{置|お}いてください。', ro: 'Osara o teeburu no ue ni oite kudasai.', vi: 'Hãy đặt đĩa lên bàn.' },
            { en: 'ビールを{冷蔵庫|れいぞうこ}に{入|い}れてください。', ro: 'Biiru o reizouko ni irete kudasai.', vi: 'Hãy cho bia vào tủ lạnh.' },
          ],
        },
        {
          formula: 'どうぞ、V て ください。／ぜひ V て ください。',
          vi: 'Dùng để **mời** (không phải nhờ): どうぞ、{食|た}べてください (mời ăn), ぜひ{来|き}てください (nhất định đến nhé).',
          examples: [
            { en: 'どうぞ、たくさん{食|た}べてください。', ro: 'Douzo, takusan tabete kudasai.', vi: 'Xin mời ăn nhiều vào.' },
            { en: 'ぜひ{来|き}てください。', ro: 'Zehi kite kudasai.', vi: 'Nhất định đến nhé.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Nhờ ↔ đáp (nhận lời / không làm được)',
      lines: [
        { who: 'A', role: 'a', text: 'Bさん、カレーの{作|つく}り{方|かた}を{教|おし}えてください。', ro: 'B-san, karee no tsukurikata o oshiete kudasai.', vi: 'B ơi, chỉ mình cách nấu cà ri đi.' },
        { who: 'B', role: 'b', text: 'いいですよ。', ro: 'Ii desu yo.', vi: 'Được thôi.' },
        { who: 'A', role: 'a', text: 'Cさん、この{電子|でんし}レンジの{使|つか}い{方|かた}を{教|おし}えてください。', ro: 'C-san, kono denshi renji no tsukaikata o oshiete kudasai.', vi: 'C ơi, chỉ mình cách dùng lò vi sóng này.' },
        { who: 'C', role: 'c', text: 'すみません。{私|わたし}もわかりませんから、Bさんに{聞|き}いてください。', ro: 'Sumimasen. Watashi mo wakarimasen kara, B-san ni kiite kudasai.', vi: 'Xin lỗi. Mình cũng không biết, bạn hỏi B nhé.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — ポイント 63',
      head: ['(Dụng cụ で)', 'N を', 'V て ください'],
      rows: [
        ['—', '{果物|くだもの} · {野菜|やさい} · コップ', '{洗|あら}ってください'],
        ['ナイフで', 'パン · ピザ · ケーキ', '{切|き}ってください'],
        ['ペンで', '{名前|なまえ} · {電話|でんわ}{番号|ばんごう}', '{書|か}いてください'],
        ['—', 'お{皿|さら} · {塩|しお} · はし', '{取|と}ってください'],
        ['—', '{窓|まど} · {冷蔵庫|れいぞうこ}', '{開|あ}けてください／{閉|し}めてください'],
        ['—', 'いす · テーブル', '{持|も}って{行|い}ってください'],
        ['—', 'ワイン · {飲|の}み{物|もの}', '{持|も}って{来|き}てください'],
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp — ～てください',
      items: [
        '~~{取|と}りますください~~, ~~{取|と}りください~~ → phải là thể て: **{取|と}って**ください.',
        '～てください là lời nhờ / chỉ dẫn **thẳng** — hợp với bạn bè, khách, người dưới. Xin thầy cô / giám thị nhắc lại câu hỏi, câu an toàn nhất là **もう{一度|いちど}お{願|ねが}いします** (đúng câu trong "Hướng dẫn ôn thi").',
        'Bạn đã học **N を ください** (Bài 2: コーヒーをください = cho tôi cà phê). **V て ください** là nhờ LÀM một việc — khác nhau.',
        'Không làm được thì từ chối nhẹ: すみません。{私|わたし}もわかりませんから、～さんに{聞|き}いてください.',
      ],
    },

    /* ── ポイント 64 ── */
    { t: 'h', text: 'ポイント 64 — V て います (đang V)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N は（nơi で）N を V て います。',
          vi: '**Đang V** — hành động đang diễn ra ngay lúc nói. Chia thể て + います. Nơi làm hành động dùng **で**.',
          examples: [
            { en: 'パクさんはあそこで{電話|でんわ}をかけています。', ro: 'Paku-san wa asoko de denwa o kakete imasu.', vi: 'Park đang gọi điện ở đằng kia.' },
            { en: 'ワンさんは{台所|だいどころ}で{料理|りょうり}を{作|つく}っています。', ro: 'Wan-san wa daidokoro de ryouri o tsukutte imasu.', vi: 'Wang đang nấu ăn trong bếp.' },
            { en: 'カルロスさんはギターを{弾|ひ}いています。', ro: 'Karurosu-san wa gitaa o hiite imasu.', vi: 'Carlos đang chơi guitar.' },
          ],
        },
        {
          formula: '{何|なに}を して いますか。 → V て います。',
          vi: 'Hỏi "đang làm gì": {何|なに}をしていますか. Phủ định: V て いません (không đang làm).',
          examples: [
            { en: 'マルコさんは{何|なに}をしていますか。——{外|そと}でたばこを{吸|す}っています。', ro: 'Maruko-san wa nani o shite imasu ka. — Soto de tabako o sutte imasu.', vi: 'Marco đang làm gì? — Đang hút thuốc ở ngoài.' },
            { en: '{今|いま}、テレビを{見|み}ていますか。——いいえ、{見|み}ていません。', ro: 'Ima, terebi o mite imasu ka. — Iie, mite imasen.', vi: 'Bạn đang xem TV à? — Không, không xem.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — ai đang làm gì ở bữa tiệc',
      head: ['Ai は', 'ở đâu で', 'làm gì', 'います'],
      rows: [
        ['パクさんは', '{台所|だいどころ}で', 'お{皿|さら}を{洗|あら}って', 'います。'],
        ['マルコさんは', '{外|そと}で', 'たばこを{吸|す}って', 'います。'],
        ['アンナさんは', '{窓|まど}の{近|ちか}くで', '{電話|でんわ}をかけて', 'います。'],
        ['メアリーさんは', 'テーブルの{前|まえ}で', '{歌|うた}を{歌|うた}って', 'います。'],
        ['ワンさんは', 'ソファで', 'ダニエルさんと{話|はな}して', 'います。'],
        ['ナタポンさんは', '{部屋|へや}で', '{写真|しゃしん}を{撮|と}って', 'います。'],
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp — ～ています',
      items: [
        'Nơi đang làm hành động → **で**: {台所|だいどころ}**で**{洗|あら}っています (không phải ~~{台所|だいどころ}に{洗|あら}っています~~). Nơi CÓ MẶT → に: {台所|だいどころ}**に**います.',
        '~~{洗|あら}いています~~ → {洗|あら}って います (thể て của {洗|あら}います là {洗|あら}って).',
        'Bài 7 chỉ học nghĩa "**đang**". ～ています còn nghĩa khác (trạng thái: {住|す}んでいます — đang sống ở; thói quen, nghề nghiệp) — sẽ học ở Bài 8, 10, 11. Câu thi 「いま どこに すんでいますか」 = "Bạn đang sống ở đâu?" — đáp ～に{住|す}んでいます.',
      ],
    },

    /* ── ポイント 65 ── */
    { t: 'h', text: 'ポイント 65 — V ましょうか (Để tôi V nhé? — đề nghị giúp)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（N を）V ましょうか。',
          vi: '**Để tôi V giúp nhé?** — chủ động đề nghị làm việc gì cho người khác. Đổi ます → **ましょうか**. (Bài 6 ～ましょう = "cùng … nhé"; thêm か thành lời đề nghị giúp.)',
          examples: [
            { en: '{手伝|てつだ}いましょうか。', ro: 'Tetsudaimashou ka.', vi: 'Để tôi giúp nhé?' },
            { en: '{料理|りょうり}を{取|と}りましょうか。', ro: 'Ryouri o torimashou ka.', vi: 'Để tôi lấy đồ ăn cho nhé?' },
            { en: '{窓|まど}を{閉|し}めましょうか。', ro: 'Mado o shimemashou ka.', vi: 'Để tôi đóng cửa sổ nhé?' },
          ],
        },
        {
          formula: 'Đáp: ありがとうございます（。お{願|ねが}いします）。／いいえ、{結構|けっこう}です。',
          vi: 'Nhận: **ありがとうございます／お{願|ねが}いします**. Từ chối lịch sự: いいえ、{結構|けっこう}です (không cần đâu — từ thêm) hoặc いいえ、{大丈夫|だいじょうぶ}です.',
          examples: [
            { en: '{写真|しゃしん}を{撮|と}りましょうか。——あ、ありがとうございます。お{願|ねが}いします。', ro: 'Shashin o torimashou ka. — A, arigatou gozaimasu. Onegaishimasu.', vi: 'Để tôi chụp ảnh cho nhé? — A, cảm ơn. Nhờ bạn.' },
            { en: 'ビールを{持|も}って{来|き}ましょうか。——いいえ、{結構|けっこう}です。', ro: 'Biiru o motte kimashou ka. — Iie, kekkou desu.', vi: 'Để tôi mang bia đến nhé? — Không, không cần đâu ạ.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Ba đuôi rủ / đề nghị — đừng lẫn',
      head: ['Mẫu', 'Ai làm?', 'Nghĩa', 'Ví dụ'],
      rows: [
        ['V ませんか (Bài 6)', 'Cả hai (hỏi ý bạn)', 'Cùng V không?', '{一緒|いっしょ}に{食|た}べませんか。'],
        ['V ましょう (Bài 6)', 'Cả hai (chốt)', 'Cùng V nhé / V thôi', '{食|た}べましょう。'],
        ['V ましょうか (Bài 7)', '**Tôi** (làm cho bạn)', 'Để tôi V nhé?', '{料理|りょうり}を{取|と}りましょうか。'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — đề nghị giúp ở bữa tiệc',
      head: ['Thấy gì', 'Bạn nói (～ましょうか)', 'Romaji'],
      rows: [
        ['Bạn đang bận nấu', '{手伝|てつだ}いましょうか。', 'Tetsudaimashou ka.'],
        ['Khách chưa có đồ ăn', '{料理|りょうり}を{取|と}りましょうか。', 'Ryouri o torimashou ka.'],
        ['Mọi người đứng tạo dáng', '{写真|しゃしん}を{撮|と}りましょうか。', 'Shashin o torimashou ka.'],
        ['Phòng nóng', '{窓|まど}を{開|あ}けましょうか。', 'Mado o akemashou ka.'],
        ['Khách thiếu nĩa', 'フォークを{持|も}って{来|き}ましょうか。', 'Fooku o motte kimashou ka.'],
        ['Bạn xách đồ nặng', '{持|も}ちましょうか。', 'Mochimashou ka.'],
      ],
    },

    /* ── ポイント 66 ── */
    { t: 'h', text: 'ポイント 66 — （N の）V(bỏ ます) {方|かた} (cách V)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（N の）V(bỏ ます) {方|かた}',
          vi: '**Cách V** — biến động từ thành danh từ: bỏ ます + **{方|かた}**. Tân ngữ đổi từ **を** thành **の**: カレー**を**{作|つく}ります → カレー**の**{作|つく}り{方|かた}.',
          examples: [
            { en: '{料理|りょうり}の{作|つく}り{方|かた}を{教|おし}えてください。', ro: 'Ryouri no tsukurikata o oshiete kudasai.', vi: 'Hãy chỉ tôi cách nấu món ăn.' },
            { en: 'この{電子|でんし}レンジの{使|つか}い{方|かた}がわかりません。', ro: 'Kono denshi renji no tsukaikata ga wakarimasen.', vi: 'Tôi không biết cách dùng lò vi sóng này.' },
            { en: 'この{漢字|かんじ}の{読|よ}み{方|かた}を{教|おし}えてください。', ro: 'Kono kanji no yomikata o oshiete kudasai.', vi: 'Hãy chỉ tôi cách đọc chữ Hán này.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'V(bỏ ます) + 方',
      head: ['Thể ます', '→ 方', 'Romaji', 'Nghĩa'],
      rows: [
        ['{作|つく}ります', '{作|つく}り{方|かた}', 'tsukurikata', 'cách làm, cách nấu'],
        ['{使|つか}います', '{使|つか}い{方|かた}', 'tsukaikata', 'cách dùng'],
        ['{書|か}きます', '{書|か}き{方|かた}', 'kakikata', 'cách viết'],
        ['{読|よ}みます', '{読|よ}み{方|かた}', 'yomikata', 'cách đọc'],
        ['{切|き}ります', '{切|き}り{方|かた}', 'kirikata', 'cách cắt'],
        ['{食|た}べます', '{食|た}べ{方|かた}', 'tabekata', 'cách ăn'],
        ['{行|い}きます', '{行|い}き{方|かた}', 'ikikata', 'cách đi (đường đi)'],
        ['します', 'し{方|かた}', 'shikata', 'cách làm'],
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp — ～方',
      items: [
        '~~カレー**を**{作|つく}り{方|かた}~~ → カレー**の**{作|つく}り{方|かた}: 方 biến cả cụm thành danh từ nên trợ từ trước nó là **の**.',
        '~~{作|つく}る{方|かた}~~, ~~{作|つく}って{方|かた}~~ → luôn dùng **gốc ます** (bỏ ます): {作|つく}り{方|かた}.',
        '「～の{作|つく}り{方|かた}**が**わかりません」 (không biết cách…) — わかります đi với **が**. 「～の{作|つく}り{方|かた}**を**{教|おし}えてください」 — {教|おし}えます đi với **を**.',
      ],
    },

    /* ── ポイント 67 ── */
    { t: 'h', text: 'ポイント 67 — まだ／もう (vẫn còn / không còn nữa)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N は まだ ありますか。 → はい、まだ あります。／いいえ、もう ありません。',
          vi: '**まだ** + khẳng định = **vẫn còn**. **もう** + phủ định = **không còn nữa, hết rồi**. Dùng khi hỏi đồ ăn uống còn không ở bữa tiệc.',
          examples: [
            { en: 'サラダはまだありますか。——はい、まだあります。', ro: 'Sarada wa mada arimasu ka. — Hai, mada arimasu.', vi: 'Salad còn không? — Vâng, vẫn còn.' },
            { en: 'サラダはまだありますか。——いいえ、もうありません。', ro: 'Sarada wa mada arimasu ka. — Iie, mou arimasen.', vi: 'Salad còn không? — Không, hết rồi.' },
            { en: 'ビールはもうありません。ワインはどうですか。', ro: 'Biiru wa mou arimasen. Wain wa dou desu ka.', vi: 'Bia hết rồi. Rượu vang thì sao?' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'まだ／もう ở Bài 6 và Bài 7 — cùng từ, khác câu',
      head: ['Bài', 'Câu', 'Nghĩa'],
      rows: [
        ['6 (ポイント 57)', 'もう{食|た}べましたか。——いいえ、**まだ**です。', 'Ăn chưa? — **Chưa**.'],
        ['6 (ポイント 57)', 'もう{食|た}べましたか。——はい、**もう**{食|た}べました。', 'Ăn chưa? — **Rồi**.'],
        ['7 (ポイント 67)', 'まだありますか。——はい、**まだ**あります。', 'Còn không? — Vẫn **còn**.'],
        ['7 (ポイント 67)', 'まだありますか。——いいえ、**もう**ありません。', 'Còn không? — **Hết rồi**.'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp — mời món khác khi hết',
      lines: [
        { who: 'A', role: 'a', text: 'ピザはまだありますか。', ro: 'Piza wa mada arimasu ka.', vi: 'Pizza còn không?' },
        { who: 'B', role: 'b', text: 'はい、まだありますよ。どうぞ。', ro: 'Hai, mada arimasu yo. Douzo.', vi: 'Có, vẫn còn đấy. Mời bạn.' },
        { who: 'A', role: 'a', text: 'お{茶|ちゃ}もまだありますか。', ro: 'Ocha mo mada arimasu ka.', vi: 'Trà cũng còn chứ?' },
        { who: 'B', role: 'b', text: 'すみません。お{茶|ちゃ}はもうありません。ジュースはどうですか。', ro: 'Sumimasen. Ocha wa mou arimasen. Juusu wa dou desu ka.', vi: 'Xin lỗi. Trà hết rồi. Nước hoa quả thì sao?' },
        { who: 'A', role: 'a', text: 'いいですね。お{願|ねが}いします。', ro: 'Ii desu ne. Onegaishimasu.', vi: 'Được đấy. Cho mình nhé.' },
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp — まだ／もう',
      items: [
        '~~いいえ、まだありません~~ khi đồ đã HẾT → nói **もうありません** (hết rồi). まだありません nghĩa là "vẫn chưa có" (chưa mang ra) — nghĩa khác.',
        '~~はい、もうあります~~ → còn thì nói **まだあります**.',
        'Mẹo: まだ = "vẫn" (trạng thái cũ tiếp tục), もう = "đã… rồi" (trạng thái đã đổi).',
      ],
    },

    /* ── ポイント 68 ── */
    { t: 'h', text: 'ポイント 68 — {誰|だれ}が (AI làm?)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '{誰|だれ}が（N を）V ましたか。 → N（người）が V ました。',
          vi: 'Hỏi **ai** là người làm hành động: **{誰|だれ}が**. Trả lời phải dùng **が** (không dùng は): ワンさん**が**{作|つく}りました.',
          examples: [
            { en: '{誰|だれ}がこのケーキを{作|つく}りましたか。——ワンさんが{作|つく}りました。', ro: 'Dare ga kono keeki o tsukurimashita ka. — Wan-san ga tsukurimashita.', vi: 'Ai làm cái bánh này? — Wang làm.' },
            { en: '{誰|だれ}がピザを{持|も}って{来|き}ましたか。——ナタポンさんが{持|も}って{来|き}ました。', ro: 'Dare ga piza o motte kimashita ka. — Natapon-san ga motte kimashita.', vi: 'Ai mang pizza đến? — Natapon mang đến.' },
            { en: '{誰|だれ}がギターを{弾|ひ}いていますか。——カルロスさんが{弾|ひ}いています。', ro: 'Dare ga gitaa o hiite imasu ka. — Karurosu-san ga hiite imasu.', vi: 'Ai đang chơi guitar? — Carlos đang chơi.' },
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp — {誰|だれ}が',
      items: [
        'Từ để hỏi làm chủ ngữ luôn đi với **が**: ~~{誰|だれ}は{作|つく}りましたか~~ → **{誰|だれ}が**{作|つく}りましたか. Câu trả lời cũng **が**: ~~ワンさんは{作|つく}りました~~ → ワンさん**が**{作|つく}りました.',
        'Khác với **{誰|だれ}の** (của ai, Bài 2) và **{誰|だれ}と** (với ai, Bài 5). Lịch sự hơn: どなたが.',
        'Trả lời ngắn cũng được: ワンさんです — nhưng trong thi nói câu đầy đủ ～が～ました để ăn điểm ngữ pháp.',
      ],
    },

    /* ── ポイント 69 ── */
    { t: 'h', text: 'ポイント 69 — どの N (N nào?)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'どの N ですか。 → この／その／あの N です。',
          vi: '**どの** luôn đứng TRƯỚC danh từ (giống この／その／あの, Bài 2). Hỏi chọn 1 trong **nhiều** (3 trở lên) thứ cùng loại.',
          examples: [
            { en: 'A：お{皿|さら}を{洗|あら}ってください。B：どのお{皿|さら}ですか。A：そのお{皿|さら}です。', ro: 'A: Osara o aratte kudasai. B: Dono osara desu ka. A: Sono osara desu.', vi: 'A: Rửa đĩa giúp mình. B: Đĩa nào? A: Cái đĩa đó.' },
            { en: 'どのナイフを{使|つか}いますか。——このナイフを{使|つか}ってください。', ro: 'Dono naifu o tsukaimasu ka. — Kono naifu o tsukatte kudasai.', vi: 'Dùng dao nào? — Dùng con dao này nhé.' },
            { en: 'どの{人|ひと}がワンさんですか。——あの{人|ひと}です。', ro: 'Dono hito ga Wan-san desu ka. — Ano hito desu.', vi: 'Người nào là Wang? — Người kia.' },
          ],
        },
      ],
    },

    /* ── ポイント 70 ── */
    { t: 'h', text: 'ポイント 70 — どれ (cái nào?)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N は どれですか。 → これ／それ／あれ です。',
          vi: '**どれ** đứng MỘT MÌNH (như これ／それ／あれ), không kèm danh từ. Hỏi chọn 1 trong nhiều thứ.',
          examples: [
            { en: '{塩|しお}はどれですか。——それです。', ro: 'Shio wa dore desu ka. — Sore desu.', vi: 'Muối là lọ nào? — Lọ đó.' },
            { en: 'ワンさんのコップはどれですか。——あれです。', ro: 'Wan-san no koppu wa dore desu ka. — Are desu.', vi: 'Cốc của Wang là cái nào? — Cái kia.' },
            { en: 'どれがいいですか。——これがいいです。', ro: 'Dore ga ii desu ka. — Kore ga ii desu.', vi: 'Cái nào được? — Cái này được. (từ để hỏi làm chủ ngữ → が)' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bộ こ・そ・あ・ど đầy đủ đến Bài 7',
      head: ['', 'こ (gần tôi)', 'そ (gần bạn)', 'あ (xa cả hai)', 'ど (hỏi)'],
      rows: [
        ['Vật (đứng một mình)', 'これ', 'それ', 'あれ', '**どれ** (70)'],
        ['+ danh từ', 'この N', 'その N', 'あの N', '**どの N** (69)'],
        ['Nơi chốn', 'ここ', 'そこ', 'あそこ', 'どこ'],
        ['Chọn 1 trong 2', '—', '—', '—', 'どちら (Bài 6)'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp — どれ và どの',
      lines: [
        { who: 'A', role: 'a', text: 'Bさん、{砂糖|さとう}を{取|と}ってください。', ro: 'B-san, satou o totte kudasai.', vi: 'B ơi, lấy giúp mình lọ đường.' },
        { who: 'B', role: 'b', text: '{砂糖|さとう}はどれですか。', ro: 'Satou wa dore desu ka.', vi: 'Đường là lọ nào?' },
        { who: 'A', role: 'a', text: 'それです。', ro: 'Sore desu.', vi: 'Lọ đó.' },
        { who: 'B', role: 'b', text: 'ああ、これですか。はい、どうぞ。', ro: 'Aa, kore desu ka. Hai, douzo.', vi: 'À, lọ này à. Đây.' },
        { who: 'A', role: 'a', text: 'どうも。それから、スプーンも{取|と}ってください。', ro: 'Doumo. Sorekara, supuun mo totte kudasai.', vi: 'Cảm ơn. Rồi lấy giúp cả cái thìa nữa.' },
        { who: 'B', role: 'b', text: 'どのスプーンですか。', ro: 'Dono supuun desu ka.', vi: 'Thìa nào?' },
        { who: 'A', role: 'a', text: 'その{小|ちい}さいスプーンです。', ro: 'Sono chiisai supuun desu.', vi: 'Cái thìa nhỏ đó.' },
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp — どれ／どの／どちら',
      items: [
        '~~どれお{皿|さら}ですか~~ → **どの**お{皿|さら}ですか (có danh từ thì dùng どの). ~~{塩|しお}はどのですか~~ → {塩|しお}は**どれ**ですか (không có danh từ thì dùng どれ).',
        'Người hỏi dùng これ khi chỉ vật gần mình; người trả lời thấy vật đó gần NGƯỜI HỎI → nói **それ**. Người hỏi cầm lên xác nhận: ああ、**これ**ですか.',
        'Chỉ có **2** lựa chọn → dùng **どちら** (Bài 6: AとBとどちらが～). **3 trở lên** → どれ／どの.',
        'Từ để hỏi làm chủ ngữ → **が**: ~~どれはいいですか~~ → **どれが**いいですか.',
      ],
    },

    /* ── ポイント 71 ── */
    { t: 'h', text: 'ポイント 71 — N（dụng cụ）で V ます (làm bằng N)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N（dụng cụ, phương tiện）で N を V ます。',
          vi: '**Bằng N** — dụng cụ / cách thức để làm hành động. Cùng **で** như "bằng phương tiện" ở Bài 5 (バスで{行|い}きます).',
          examples: [
            { en: 'はしでご{飯|はん}を{食|た}べます。', ro: 'Hashi de gohan o tabemasu.', vi: 'Ăn cơm bằng đũa.' },
            { en: 'ナイフでパンを{切|き}ってください。', ro: 'Naifu de pan o kitte kudasai.', vi: 'Hãy cắt bánh mì bằng dao.' },
            { en: 'ペンで{名前|なまえ}を{書|か}いてください。', ro: 'Pen de namae o kaite kudasai.', vi: 'Hãy viết tên bằng bút.' },
          ],
        },
        {
          formula: '{何|なに}で V ますか。 → N で V ます。',
          vi: 'Hỏi "bằng gì": **{何|なに}で** (đọc なにで; なんで cũng nghe thấy nhưng dễ lẫn với "tại sao").',
          examples: [
            { en: 'すしは{何|なに}で{食|た}べますか。——はしで{食|た}べます。', ro: 'Sushi wa nani de tabemasu ka. — Hashi de tabemasu.', vi: 'Sushi ăn bằng gì? — Ăn bằng đũa.' },
            { en: '{名前|なまえ}はカタカナで{書|か}きますか。——いいえ、{漢字|かんじ}で{書|か}いてください。', ro: 'Namae wa katakana de kakimasu ka. — Iie, kanji de kaite kudasai.', vi: 'Tên viết bằng katakana à? — Không, viết bằng chữ Hán nhé.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — ポイント 71',
      head: ['Dụng cụ で', 'N を', 'V'],
      rows: [
        ['はしで', 'ご{飯|はん}／すし', '{食|た}べます'],
        ['スプーンで', 'カレー／スープ', '{食|た}べます／{飲|の}みます'],
        ['ナイフとフォークで', 'ステーキ／ピザ', '{食|た}べます'],
        ['ナイフで', 'パン／{果物|くだもの}', '{切|き}ります'],
        ['ペンで／{日本語|にほんご}で', '{名前|なまえ}／メール', '{書|か}きます'],
        ['{電子|でんし}レンジで', 'ピザ／お{弁当|べんとう}', '{温|あたた}めます (hâm nóng — từ thêm)'],
        ['{電話|でんわ}で', '{友達|ともだち}と', '{話|はな}します'],
      ],
    },
    {
      t: 'note',
      title: 'Bốn nghĩa của で đến Bài 7',
      items: [
        '① **Nơi làm hành động** (Bài 3): {台所|だいどころ}**で**{料理|りょうり}を{作|つく}ります.',
        '② **Phương tiện** (Bài 5): バス**で**{行|い}きます.',
        '③ **Nơi diễn ra sự kiện / phạm vi** (Bài 6): {横浜|よこはま}**で**{試合|しあい}があります · スポーツ**で**{何|なに}がいちばん{好|す}きですか.',
        '④ **Dụng cụ, ngôn ngữ** (Bài 7): はし**で**{食|た}べます · {日本語|にほんご}**で**{話|はな}します.',
        'Nhưng nơi TỒN TẠI là **に**: {台所|だいどころ}**に**います — không phải で.',
      ],
    },

    /* ── Tổng kết ── */
    { t: 'h', text: 'Tổng kết — câu hỏi của Bài 7 và cách trả lời' },
    {
      t: 'table',
      head: ['Câu hỏi', 'Hỏi về', 'Trả lời mẫu', 'ポイント'],
      rows: [
        ['N はどこにいますか／ありますか。', 'Ở đâu', 'N の{前|まえ}にいます／あります。', '61'],
        ['{近|ちか}くに{何|なに}がありますか。／あそこに{誰|だれ}がいますか。', 'Ở đó có gì / ai', 'コンビニがあります。／パクさんがいます。', '62'],
        ['～てください。', 'Lời nhờ', 'はい。／いいですよ。／すみません、{私|わたし}もわかりません。', '63'],
        ['{何|なに}をしていますか。', 'Đang làm gì', '{電話|でんわ}をかけています。', '64'],
        ['～ましょうか。', 'Đề nghị giúp', 'ありがとうございます。お{願|ねが}いします。', '65'],
        ['～の{作|つく}り{方|かた}がわかりますか。', 'Cách làm', 'はい、わかります。／いいえ、わかりません。', '66'],
        ['N はまだありますか。', 'Còn không', 'はい、まだあります。／いいえ、もうありません。', '67'],
        ['{誰|だれ}が～ましたか。', 'Ai làm', 'N が～ました。', '68'],
        ['どの N ですか。／N はどれですか。', 'Cái nào', 'その N です。／それです。', '69, 70'],
        ['{何|なに}で～ますか。', 'Bằng gì', 'はしで～ます。', '71'],
      ],
    },
    {
      t: 'build',
      id: 'b7-np-ghep',
      title: 'Ghép câu — dùng đủ 11 điểm ngữ pháp',
      items: [
        { vi: 'Tôi đang ở trước ga.', chips: ['{駅|えき}の', '{前|まえ}に', 'います', 'あります', '{前|まえ}で', 'が'], answer: ['{駅|えき}の', '{前|まえ}に', 'います'], ro: 'Eki no mae ni imasu.' },
        { vi: 'Đồn công an ở phía sau toà nhà kia.', chips: ['{交番|こうばん}は', 'あのビルの', '{後|うし}ろに', 'あります', 'います', '{交番|こうばん}が'], answer: ['{交番|こうばん}は', 'あのビルの', '{後|うし}ろに', 'あります'], ro: 'Kouban wa ano biru no ushiro ni arimasu.' },
        { vi: 'Gần đây có siêu thị lớn.', chips: ['{近|ちか}くに', '{大|おお}きい', 'スーパーが', 'あります', 'スーパーは', 'います'], answer: ['{近|ちか}くに', '{大|おお}きい', 'スーパーが', 'あります'], ro: 'Chikaku ni ookii suupaa ga arimasu.' },
        { vi: 'Dưới gốc cây có con chó.', chips: ['{木|き}の', '{下|した}に', '{犬|いぬ}が', 'います', 'あります', '{下|した}で'], answer: ['{木|き}の', '{下|した}に', '{犬|いぬ}が', 'います'], ro: 'Ki no shita ni inu ga imasu.' },
        { vi: 'Hãy cắt bánh mì bằng dao.', chips: ['ナイフで', 'パンを', '{切|き}って', 'ください', '{切|き}り', 'ナイフを'], answer: ['ナイフで', 'パンを', '{切|き}って', 'ください'], ro: 'Naifu de pan o kitte kudasai.' },
        { vi: 'Hãy đặt cốc lên bàn.', chips: ['コップを', 'テーブルの', '{上|うえ}に', '{置|お}いて', 'ください', '{置|お}きて'], answer: ['コップを', 'テーブルの', '{上|うえ}に', '{置|お}いて', 'ください'], ro: 'Koppu o teeburu no ue ni oite kudasai.' },
        { vi: 'Park đang rửa bát trong bếp.', chips: ['パクさんは', '{台所|だいどころ}で', 'お{皿|さら}を', '{洗|あら}って', 'います', '{台所|だいどころ}に'], answer: ['パクさんは', '{台所|だいどころ}で', 'お{皿|さら}を', '{洗|あら}って', 'います'], ro: 'Paku-san wa daidokoro de osara o aratte imasu.' },
        { vi: 'Để tôi giúp nhé?', chips: ['{手伝|てつだ}い', 'ましょうか', 'ませんか', 'ましょう'], answer: ['{手伝|てつだ}い', 'ましょうか'], ro: 'Tetsudaimashou ka.' },
        { vi: 'Hãy chỉ tôi cách nấu cà ri.', chips: ['カレーの', '{作|つく}り{方|かた}を', '{教|おし}えて', 'ください', 'カレーを', '{作|つく}る{方|かた}を'], answer: ['カレーの', '{作|つく}り{方|かた}を', '{教|おし}えて', 'ください'], ro: 'Karee no tsukurikata o oshiete kudasai.' },
        { vi: 'Salad còn không? — Không, hết rồi.', chips: ['サラダは', 'まだ', 'ありますか。', 'いいえ、', 'もう', 'ありません'], answer: ['サラダは', 'まだ', 'ありますか。', 'いいえ、', 'もう', 'ありません'], ro: 'Sarada wa mada arimasu ka. Iie, mou arimasen.' },
        { vi: 'Ai làm cái bánh này?', chips: ['{誰|だれ}が', 'この', 'ケーキを', '{作|つく}りましたか', '{誰|だれ}は', 'どの'], answer: ['{誰|だれ}が', 'この', 'ケーキを', '{作|つく}りましたか'], ro: 'Dare ga kono keeki o tsukurimashita ka.' },
        { vi: 'Wang làm.', chips: ['ワンさん', 'が', '{作|つく}りました', 'は', '{作|つく}ります'], answer: ['ワンさん', 'が', '{作|つく}りました'], ro: 'Wan-san ga tsukurimashita.' },
        { vi: 'Đĩa nào? — Cái đĩa đó.', chips: ['どの', 'お{皿|さら}ですか。', 'その', 'お{皿|さら}です', 'どれ', 'それ'], answer: ['どの', 'お{皿|さら}ですか。', 'その', 'お{皿|さら}です'], ro: 'Dono osara desu ka. Sono osara desu.' },
        { vi: 'Muối là lọ nào? — Lọ đó.', chips: ['{塩|しお}は', 'どれ', 'ですか。', 'それです', 'どの', 'そのです'], answer: ['{塩|しお}は', 'どれ', 'ですか。', 'それです'], ro: 'Shio wa dore desu ka. Sore desu.' },
        { vi: 'Người Nhật ăn cơm bằng đũa.', chips: ['{日本|にほん}の{人|ひと}は', 'はしで', 'ご{飯|はん}を', '{食|た}べます', 'はしを', 'はしに'], answer: ['{日本|にほん}の{人|ひと}は', 'はしで', 'ご{飯|はん}を', '{食|た}べます'], ro: 'Nihon no hito wa hashi de gohan o tabemasu.' },
        { vi: 'Mang bia đến giúp mình nhé.', chips: ['ビールを', '{持|も}って', '{来|き}て', 'ください', '{来|き}って', '{行|い}って'], answer: ['ビールを', '{持|も}って', '{来|き}て', 'ください'], ro: 'Biiru o motte kite kudasai.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b7-np-kiem',
      title: 'Kiểm tra nhanh ngữ pháp Bài 7',
      items: [
        { q: '「{私|わたし}は{本屋|ほんや}の{中|なか}＿います。」', options: ['で', 'に', 'を', 'が'], correct: 1, why: 'Nơi tồn tại → **に** (ポイント 61).' },
        { q: '「バス{停|てい}はコンビニの{前|まえ}に＿。」', options: ['います', 'あります', 'です', 'ありますか'], correct: 1, why: 'Trạm xe buýt là vật → **あります**.' },
        { q: '「あそこにパクさん＿います。」', options: ['は', 'が', 'を', 'で'], correct: 1, why: 'Nơi に N **が** います (ポイント 62).' },
        { q: '「{近|ちか}くに＿がありますか。」 (hỏi "gần đó có gì")', options: ['どこ', '{何|なに}', '{誰|だれ}', 'どれ'], correct: 1, why: 'Hỏi vật → **{何|なに}が**ありますか.' },
        { q: 'Nhờ bạn lấy muối:', options: ['{塩|しお}を{取|と}りますください。', '{塩|しお}を{取|と}ってください。', '{塩|しお}を{取|と}りてください。', '{塩|しお}をください{取|と}って。'], correct: 1, why: 'V て ください: {取|と}ります → **{取|と}って** (ポイント 63).' },
        { q: '"Anna đang gọi điện." ', options: ['アンナさんは{電話|でんわ}をかけます。', 'アンナさんは{電話|でんわ}をかけています。', 'アンナさんは{電話|でんわ}をかけてください。', 'アンナさんは{電話|でんわ}をかけましょう。'], correct: 1, why: 'Đang V → **V て います** (ポイント 64).' },
        { q: 'Thấy bạn xách đồ nặng, bạn nói:', options: ['{持|も}ちませんか。', '{持|も}ちましょうか。', '{持|も}ってください。', '{持|も}ちます。'], correct: 1, why: 'Đề nghị giúp → **V ましょうか** (ポイント 65).' },
        { q: '「カレー＿{作|つく}り{方|かた}を{教|おし}えてください。」', options: ['を', 'の', 'が', 'で'], correct: 1, why: 'N **の** V方 (ポイント 66).' },
        { q: 'Bia đã hết. Trả lời 「ビールはまだありますか」:', options: ['いいえ、まだありません。', 'いいえ、もうありません。', 'はい、もうあります。', 'いいえ、まだです。'], correct: 1, why: 'Hết rồi → **もうありません** (ポイント 67).' },
        { q: '「＿がこのピザを{持|も}って{来|き}ましたか。」 (Ai?)', options: ['{誰|だれ}は', '{誰|だれ}が', '{誰|だれ}の', '{何|なに}が'], correct: 1, why: '**{誰|だれ}が** (ポイント 68).' },
        { q: '「＿ナイフですか。」 (Con dao nào?)', options: ['どれ', 'どの', 'どちら', 'どこ'], correct: 1, why: 'Trước danh từ → **どの** (ポイント 69).' },
        { q: '「{砂糖|さとう}は＿ですか。」 (Đường là lọ nào?)', options: ['どの', 'どれ', 'だれ', '{何|なに}'], correct: 1, why: 'Đứng một mình → **どれ** (ポイント 70).' },
        { q: '「はし＿ご{飯|はん}を{食|た}べます。」', options: ['に', 'で', 'を', 'と'], correct: 1, why: 'Dụng cụ → **で** (ポイント 71).' },
        { q: 'Thể て của {行|い}きます:', options: ['{行|い}いて', '{行|い}って', '{行|い}きて', '{行|い}んで'], correct: 1, why: 'Ngoại lệ: **{行|い}って**.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */
/* Mức: ✍ nên viết (ít nét, rất hay gặp) · 👁 nhận mặt (đọc + hiểu — ưu tiên cho phần đọc thi). */

const KANJI: Lesson = {
  id: 'b7-kanji',
  kind: 'kanji',
  title: 'Chữ Hán — trong từ vựng Bài 7',
  goal: 'Nhận mặt và đọc đúng mọi chữ Hán trong 71 từ của Bài 7 (vị trí, đường phố, bếp, động từ), đọc được câu KHÔNG có furigana như đề thi, và viết tay được các chữ ✍.',
  minutes: 35,
  blocks: [
    {
      t: 'p',
      text: 'Phần Reading của đề thi có **4 từ chữ Hán gạch chân, không furigana (12 điểm)**. Học theo **cả từ** ({台所|だいどころ} = daidokoro, {冷蔵庫|れいぞうこ} = reizouko) chứ đừng học chữ rời. Cột **Mức**: **✍ nên viết** — ít nét, gặp liên tục ({上|うえ}・{下|した}・{中|なか}・{木|き}・{花|はな}…); **👁 nhận mặt** — chỉ cần nhìn là đọc và hiểu nghĩa (phần lớn chữ, ưu tiên cho bài đọc). **Âm On** (音, gốc Hán) thường dùng khi hai chữ Hán ghép nhau; **âm Kun** (訓, âm Nhật) khi chữ đứng một mình hoặc có đuôi kana ({洗|あら}います).',
    },
    {
      t: 'table',
      caption: '1. Vị trí',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['上', '✍', 'ジョウ', 'うえ・あ(がる)', 'THƯỢNG (trên)', '{上|うえ} ue'],
        ['下', '✍', 'カ・ゲ', 'した・さ(がる)', 'HẠ (dưới)', '{下|した} shita · {地下鉄|ちかてつ} (Bài 6)'],
        ['中', '✍', 'チュウ', 'なか', 'TRUNG (giữa, trong)', '{中|なか} naka'],
        ['外', '✍', 'ガイ・ゲ', 'そと', 'NGOẠI (ngoài)', '{外|そと} soto · {外国|がいこく}'],
        ['前', '✍', 'ゼン', 'まえ', 'TIỀN (trước)', '{前|まえ} mae · {午前|ごぜん}'],
        ['後', '👁', 'ゴ・コウ', 'うし(ろ)・あと', 'HẬU (sau)', '{後|うし}ろ ushiro · {午後|ごご}'],
        ['横', '👁', 'オウ', 'よこ', 'HOÀNH (ngang)', '{横|よこ} yoko'],
        ['隣', '👁', 'リン', 'となり', 'LÂN (láng giềng)', '{隣|となり} tonari'],
        ['近', '✍', 'キン', 'ちか(い)', 'CẬN (gần)', '{近|ちか}く chikaku · {近|ちか}い'],
        ['間', '👁', 'カン・ケン', 'あいだ・ま', 'GIAN (khoảng giữa)', '{間|あいだ} aida · {時間|じかん}'],
      ],
    },
    {
      t: 'table',
      caption: '2. Trên đường phố',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['改', '👁', 'カイ', 'あらた(める)', 'CẢI (đổi)', '{改札|かいさつ} kaisatsu'],
        ['札', '👁', 'サツ', 'ふだ', 'TRÁT (thẻ, vé)', '{改札|かいさつ} · お{札|さつ} (tiền giấy)'],
        ['木', '✍', 'モク・ボク', 'き', 'MỘC (cây)', '{木|き} ki · {木曜日|もくようび}'],
        ['交', '👁', 'コウ', 'まじ(わる)', 'GIAO (giao nhau)', '{交番|こうばん} kouban'],
        ['番', '👁', 'バン', '—', 'PHIÊN (lượt, số)', '{交番|こうばん} · {番号|ばんごう} · {一番|いちばん}'],
        ['自', '👁', 'ジ・シ', 'みずか(ら)', 'TỰ (tự mình)', '{自動販売機|じどうはんばいき} jidou hanbaiki'],
        ['動', '👁', 'ドウ', 'うご(く)', 'ĐỘNG (chuyển động)', '{自動|じどう}'],
        ['販', '👁', 'ハン', '—', 'PHÁN (buôn bán)', '{販売|はんばい}'],
        ['売', '👁', 'バイ', 'う(る)', 'MẠI (bán)', '{販売|はんばい} · {売|う}り{場|ば}'],
        ['機', '👁', 'キ', 'はた', 'CƠ (máy)', '{販売機|はんばいき} · {飛行機|ひこうき}'],
        ['停', '👁', 'テイ', '—', 'ĐÌNH (dừng)', 'バス{停|てい} basutei'],
        ['花', '✍', 'カ', 'はな', 'HOA', '{花|はな} hana · {花火|はなび} (Bài 6)'],
        ['犬', '✍', 'ケン', 'いぬ', 'KHUYỂN (chó)', '{犬|いぬ} inu'],
        ['迎', '👁', 'ゲイ', 'むか(える)', 'NGHÊNH (đón)', '{迎|むか}えに{行|い}きます'],
        ['行', '✍', 'コウ・ギョウ', 'い(く)', 'HÀNH (đi)', '{迎|むか}えに{行|い}きます · {銀行|ぎんこう} · {旅行|りょこう}'],
      ],
    },
    {
      t: 'table',
      caption: '3. Bếp & bàn ăn, chữ viết',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['電', '👁', 'デン', '—', 'ĐIỆN', '{電子|でんし}レンジ · {電話|でんわ} · {電車|でんしゃ}'],
        ['子', '✍', 'シ・ス', 'こ', 'TỬ (con; hạt nhỏ)', '{電子|でんし} denshi · {子|こ}ども'],
        ['冷', '👁', 'レイ', 'つめ(たい)・ひ(える)', 'LÃNH (lạnh)', '{冷蔵庫|れいぞうこ} reizouko'],
        ['蔵', '👁', 'ゾウ', 'くら', 'TÀNG (cất giữ)', '{冷蔵庫|れいぞうこ}'],
        ['庫', '👁', 'コ・ク', '—', 'KHỐ (kho)', '{冷蔵庫|れいぞうこ} · {車庫|しゃこ}'],
        ['砂', '👁', 'サ・シャ', 'すな', 'SA (cát)', '{砂糖|さとう} satou'],
        ['糖', '👁', 'トウ', '—', 'ĐƯỜNG (đường ăn)', '{砂糖|さとう}'],
        ['塩', '👁', 'エン', 'しお', 'DIÊM (muối)', '{塩|しお} shio'],
        ['皿', '✍', '—', 'さら', 'MÃNH (đĩa)', 'お{皿|さら} osara · {灰皿|はいざら}'],
        ['漢', '👁', 'カン', '—', 'HÁN', '{漢字|かんじ} kanji'],
        ['字', '👁', 'ジ', '—', 'TỰ (chữ)', '{漢字|かんじ} · {字|じ}'],
        ['台', '👁', 'ダイ・タイ', '—', 'ĐÀI (bệ, bục)', '{台所|だいどころ} daidokoro · {台風|たいふう}'],
        ['所', '👁', 'ショ', 'ところ', 'SỞ (nơi)', '{台所|だいどころ} (ところ → **どころ**) · {住所|じゅうしょ}'],
        ['窓', '👁', 'ソウ', 'まど', 'SONG (cửa sổ)', '{窓|まど} mado'],
        ['話', '👁', 'ワ', 'はな(す)・はなし', 'THOẠI (nói)', '{電話|でんわ} denwa · {話|はな}します'],
        ['歌', '👁', 'カ', 'うた・うた(う)', 'CA (hát)', '{歌|うた} uta · {歌|うた}います · {歌手|かしゅ} (Bài 6)'],
      ],
    },
    {
      t: 'table',
      caption: '4. Động từ',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['洗', '👁', 'セン', 'あら(う)', 'TẨY (rửa)', '{洗|あら}います araimasu'],
        ['置', '👁', 'チ', 'お(く)', 'TRÍ (đặt)', '{置|お}きます okimasu'],
        ['書', '✍', 'ショ', 'か(く)', 'THƯ (viết)', '{書|か}きます kakimasu · {辞書|じしょ} · {図書館|としょかん}'],
        ['貸', '👁', 'タイ', 'か(す)', 'THẢI (cho mượn)', '{貸|か}します kashimasu'],
        ['聞', '✍', 'ブン・モン', 'き(く)', 'VĂN (nghe)', '{聞|き}きます kikimasu · {新聞|しんぶん}'],
        ['切', '✍', 'セツ', 'き(る)', 'THIẾT (cắt)', '{切|き}ります kirimasu · {大切|たいせつ}'],
        ['使', '👁', 'シ', 'つか(う)', 'SỬ (dùng)', '{使|つか}います tsukaimasu'],
        ['手', '✍', 'シュ', 'て', 'THỦ (tay)', '{手伝|てつだ}います · {歌手|かしゅ}'],
        ['伝', '👁', 'デン', 'つた(える)', 'TRUYỀN', '{手伝|てつだ}います (て + つだ)'],
        ['取', '👁', 'シュ', 'と(る)', 'THỦ (lấy)', '{取|と}ります torimasu'],
        ['持', '👁', 'ジ', 'も(つ)', 'TRÌ (cầm)', '{持|も}ちます · {持|も}って{行|い}きます · {持|も}って{来|き}ます'],
        ['出', '✍', 'シュツ', 'で(る)・だ(す)', 'XUẤT (ra)', '{出|だ}します dashimasu · {出口|でぐち}'],
        ['入', '✍', 'ニュウ', 'い(れる)・はい(る)', 'NHẬP (vào)', '{入|い}れます iremasu · {入|はい}ります (Bài 5) · {入口|いりぐち}'],
        ['教', '👁', 'キョウ', 'おし(える)', 'GIÁO (dạy)', '{教|おし}えます oshiemasu · {教室|きょうしつ}'],
        ['吸', '👁', 'キュウ', 'す(う)', 'HẤP (hút)', '{吸|す}います suimasu'],
        ['弾', '👁', 'ダン', 'ひ(く)', 'ĐÀN (gảy đàn)', '{弾|ひ}きます hikimasu'],
        ['開', '👁', 'カイ', 'あ(ける)・あ(く)', 'KHAI (mở)', '{開|あ}けます akemasu'],
        ['閉', '👁', 'ヘイ', 'し(める)・し(まる)', 'BẾ (đóng)', '{閉|し}めます shimemasu'],
        ['来', '✍', 'ライ', 'く(る)・き(ます)', 'LAI (đến)', '{持|も}って{来|き}ます · {来週|らいしゅう} (Bài 6)'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ',
      items: [
        '**Hán Việt đoán nghĩa**: 交番 = GIAO PHIÊN (chốt canh gác), 自動販売機 = TỰ ĐỘNG PHÁN MẠI CƠ (máy tự động bán hàng), 冷蔵庫 = LÃNH TÀNG KHỐ (kho cất lạnh), 砂糖 = SA ĐƯỜNG (đường cát), 漢字 = HÁN TỰ, 改札 = CẢI TRÁT (soát vé).',
        '**Cặp trái nghĩa đi đôi**: 上↔下, 中↔外, 前↔後, 開↔閉 (mở ↔ đóng), 出↔入 (ra ↔ vào). Hai chữ 開・閉 cùng bộ 門 (cổng) — cổng có "ngang" bên trong là mở (開), có "tài 才" chắn là đóng (閉).',
        '**Hình chữ**: 木 = cái cây; 犬 = 大 (người to) + chấm — con chó; 皿 = cái đĩa nhìn ngang; 上・下 = vạch chỉ lên / xuống.',
        '**Đọc biến âm cần nhớ**: 台所 だい**ど**ころ (ところ → どころ), 手伝います **て**つだいます (手 đọc て), お皿 お**さら**, 灰皿 はい**ざら**.',
        '**Một chữ, hai động từ**: 入 → {入|い}れます (cho vào) / {入|はい}ります (vào); 出 → {出|だ}します (lấy ra) / {出|で}ます (ra, Bài sau); 開 → {開|あ}けます (mở — ai đó mở) / {開|あ}きます (mở ra — tự, 表 p.288); 閉 → {閉|し}めます / {閉|し}まります.',
      ],
    },
    {
      t: 'mcq',
      id: 'b7-kj-doc',
      title: 'Đọc chữ Hán — chọn cách đọc đúng',
      items: [
        { q: '改札', options: ['かいさつ', 'かいふだ', 'がいさつ', 'かいざつ'], correct: 0, why: '**かいさつ** — cổng soát vé.' },
        { q: '交番', options: ['こうばん', 'こばん', 'こうはん', 'まじばん'], correct: 0, why: '**こうばん** (trường âm こう).' },
        { q: '自動販売機', options: ['じどうはんばいき', 'じどはんばいき', 'しどうはんばいき', 'じどうばんはいき'], correct: 0, why: '**じどう・はんばい・き**.' },
        { q: 'バス停', options: ['バスてい', 'バスでい', 'バスとめ', 'バスてん'], correct: 0, why: '停 テイ: **バスてい**.' },
        { q: '後ろ', options: ['あとろ', 'うしろ', 'ごろ', 'のちろ'], correct: 1, why: '**うしろ** — phía sau.' },
        { q: '隣', options: ['よこ', 'となり', 'ちかく', 'あいだ'], correct: 1, why: '**となり** — sát bên.' },
        { q: '間', options: ['なか', 'あいだ', 'ま', 'かん'], correct: 1, why: 'Từ vị trí "giữa" đọc **あいだ**.' },
        { q: '近く', options: ['ちかく', 'きんく', 'ちかい', 'ちっく'], correct: 0, why: '**ちかく** — chỗ gần.' },
        { q: '冷蔵庫', options: ['れいぞうこ', 'れいぞこ', 'れいそうこ', 'れぞうこ'], correct: 0, why: '**れいぞうこ** — hai trường âm れい, ぞう.' },
        { q: '砂糖', options: ['さとう', 'さと', 'すなとう', 'しゃとう'], correct: 0, why: '**さとう** — đường.' },
        { q: '塩', options: ['さら', 'しお', 'えん', 'しょう'], correct: 1, why: '**しお** — muối.' },
        { q: 'お皿', options: ['おさら', 'おざら', 'おしお', 'おはし'], correct: 0, why: '**おさら** — cái đĩa.' },
        { q: '台所', options: ['だいところ', 'だいどころ', 'たいしょ', 'だいしょ'], correct: 1, why: 'ところ → **どころ**: だいどころ.' },
        { q: '電子レンジ', options: ['でんしレンジ', 'でんこレンジ', 'てんしレンジ', 'でんじレンジ'], correct: 0, why: '**でんし**レンジ.' },
        { q: '手伝います', options: ['しゅでんいます', 'てつだいます', 'てでんいます', 'てつたいます'], correct: 1, why: '**てつだいます** — giúp.' },
        { q: '貸します', options: ['かします', 'たいします', 'がします', 'かりします'], correct: 0, why: '**かします** — cho mượn.' },
        { q: '弾きます', options: ['だんきます', 'ひきます', 'はじきます', 'ききます'], correct: 1, why: '**ひきます** — chơi đàn.' },
        { q: '閉めます', options: ['しめます', 'とめます', 'へいめます', 'あけます'], correct: 0, why: '**しめます** — đóng.' },
        { q: '開けます', options: ['ひらけます', 'あけます', 'かいけます', 'しめます'], correct: 1, why: '**あけます** — mở.' },
        { q: '迎えに行きます', options: ['むかえにいきます', 'げいえにいきます', 'むかえにゆきます', 'むかいにいきます'], correct: 0, why: '**むかえに いきます** — đi đón.' },
        { q: '吸います', options: ['すいます', 'きゅういます', 'のみます', 'すうます'], correct: 0, why: '**すいます** — hút.' },
        { q: '漢字', options: ['かんじ', 'かんし', 'はんじ', 'かじ'], correct: 0, why: '**かんじ** — chữ Hán.' },
      ],
    },

    /* ── Đứng riêng hay đứng chung ── */
    { t: 'h', text: 'Đứng riêng hay đứng chung — một chữ, hai cách đọc' },
    {
      t: 'p',
      text: 'Cùng một chữ, **đứng riêng** (một mình hoặc có đuôi kana) thường đọc **Kun** (âm Nhật); **đứng chung** với chữ Hán khác thành từ ghép thường đọc **On** (âm Hán). Bảng dưới là các chữ của Bài 7 bạn sẽ gặp theo CẢ HAI cách — đề đọc hay "gài" đúng những chữ này.',
    },
    {
      t: 'table',
      caption: 'Chữ Bài 7 có cả hai cách đọc',
      head: ['Chữ', 'Đứng riêng (Kun) — từ + nghĩa', 'Trong từ ghép (On) — 2–3 từ hay gặp'],
      rows: [
        ['上', '{上|うえ} ue — trên', '{上手|じょうず} jouzu (giỏi) · {以上|いじょう} ijou (trở lên)'],
        ['下', '{下|した} shita — dưới', '{地下鉄|ちかてつ} chikatetsu (tàu điện ngầm) · {地下|ちか} chika (tầng hầm)'],
        ['中', '{中|なか} naka — trong', '{中国|ちゅうごく} Chuugoku (Trung Quốc) · {中学生|ちゅうがくせい} (học sinh cấp 2)'],
        ['外', '{外|そと} soto — ngoài', '{外国|がいこく} gaikoku (nước ngoài) · {外国人|がいこくじん} (người nước ngoài)'],
        ['前', '{前|まえ} mae — trước', '{午前|ごぜん} gozen (buổi sáng, AM)'],
        ['後', '{後|うし}ろ ushiro — phía sau', '{午後|ごご} gogo (buổi chiều, PM)'],
        ['近', '{近|ちか}く chikaku — chỗ gần · {近|ちか}い — gần', '{近所|きんじょ} kinjo (hàng xóm, khu gần nhà)'],
        ['間', '{間|あいだ} aida — ở giữa', '{時間|じかん} jikan (thời gian) · {一週間|いっしゅうかん} (một tuần)'],
        ['木', '{木|き} ki — cây', '{木曜日|もくようび} mokuyoubi (thứ Năm)'],
        ['花', '{花|はな} hana — hoa', '{花火|はなび} hanabi (pháo hoa — ghép nhưng vẫn Kun!) · {花瓶|かびん} (bình hoa)'],
        ['犬', '{犬|いぬ} inu — chó', '{子犬|こいぬ} koinu (chó con — vẫn Kun) · {番犬|ばんけん} (chó giữ nhà)'],
        ['子', '{子|こ}ども kodomo — trẻ con', '{電子|でんし} denshi (điện tử) · {女子|じょし} (nữ sinh)'],
        ['手', '{手|て} te — tay', '{歌手|かしゅ} kashu (ca sĩ) · {手伝|てつだ}います (ngoại lệ: đọc て)'],
        ['塩', '{塩|しお} shio — muối', '{食塩|しょくえん} shokuen (muối ăn — ghi trên nhãn)'],
        ['書', '{書|か}きます kakimasu — viết', '{辞書|じしょ} jisho (từ điển) · {図書館|としょかん} (thư viện)'],
        ['聞', '{聞|き}きます kikimasu — nghe, hỏi', '{新聞|しんぶん} shinbun (báo)'],
        ['切', '{切|き}ります kirimasu — cắt', '{大切|たいせつ} taisetsu (quan trọng) · {切手|きって} (tem — Kun)'],
        ['出', '{出|だ}します dashimasu — lấy ra', '{出口|でぐち} deguchi (lối ra — Kun) · {出発|しゅっぱつ} (xuất phát)'],
        ['入', '{入|い}れます iremasu — cho vào', '{入口|いりぐち} iriguchi (lối vào — Kun) · {入学|にゅうがく} (nhập học)'],
        ['行', '{行|い}きます ikimasu — đi', '{銀行|ぎんこう} ginkou (ngân hàng) · {旅行|りょこう} ryokou (du lịch)'],
        ['来', '{来|き}ます kimasu — đến', '{来週|らいしゅう} raishuu (tuần sau) · {来年|らいねん} (năm sau)'],
        ['話', '{話|はな}します hanashimasu — nói', '{電話|でんわ} denwa (điện thoại) · {会話|かいわ} (hội thoại)'],
        ['歌', '{歌|うた} uta — bài hát', '{歌手|かしゅ} kashu (ca sĩ)'],
        ['教', '{教|おし}えます oshiemasu — dạy', '{教室|きょうしつ} kyoushitsu (phòng học) · {教科書|きょうかしょ} (sách giáo khoa)'],
        ['売', '{売|う}ります urimasu — bán', '{販売機|はんばいき} hanbaiki (máy bán hàng)'],
        ['冷', '{冷|つめ}たい tsumetai — lạnh (đồ uống)', '{冷蔵庫|れいぞうこ} reizouko (tủ lạnh)'],
        ['開', '{開|あ}けます akemasu — mở', '{開始|かいし} kaishi (bắt đầu — thấy trên thông báo)'],
      ],
    },
    {
      t: 'note',
      title: 'Cách đọc bất quy tắc hay gặp',
      items: [
        '**{台所|だいどころ}**: ところ → **どころ** (âm đục khi ghép). Tương tự {灰皿|はいざら} (さら → **ざら**), {本棚|ほんだな}.',
        '**{手伝|てつだ}います**: 手 đọc **て** (Kun) dù ghép với 伝 — không đọc ~~しゅでん~~.',
        '**{花火|はなび}, {子犬|こいぬ}, {出口|でぐち}, {入口|いりぐち}, {切手|きって}**: từ ghép nhưng đọc **toàn Kun** — học thuộc cả từ.',
        '**{一番|いちばん}** (nhất) và **{交番|こうばん}** cùng chữ 番 バン. **{時間|じかん}** và **{間|あいだ}** cùng chữ 間.',
        '**上・下** có âm On ít gặp ở trình độ này: {上手|じょうず} (giỏi — đọc cả cụm), {下手|へた} (kém — cách đọc đặc biệt!).',
      ],
    },

    /* ── Đọc như đề thi ── */
    { t: 'h', text: 'Từ chữ Hán hay gặp trong đề đọc' },
    {
      t: 'p',
      text: 'Đề đọc thi JPD có **4 từ chữ Hán gạch chân, KHÔNG có furigana**. Dưới đây là câu ngắn kiểu đề thi: câu hiện **không furigana** — đọc to trước, rồi bấm hiện cách đọc + nghe, tự chấm. Làm lại tới khi đọc trôi không vấp.',
    },
    {
      t: 'readkanji',
      id: 'b7-doc-kanji',
      title: 'Đọc câu không furigana — từ chữ Hán Bài 7',
      note: 'Đọc to cả câu (không chỉ từ chữ Hán). Chú ý: は đọc wa, を đọc o, へ đọc e.',
      items: [
        { text: '{今|いま}、{改札|かいさつ}の{前|まえ}にいます。', ro: 'Ima, kaisatsu no mae ni imasu.', vi: 'Bây giờ tôi đang ở trước cổng soát vé.' },
        { text: '{交番|こうばん}は{駅|えき}の{近|ちか}くにあります。', ro: 'Kouban wa eki no chikaku ni arimasu.', vi: 'Đồn công an ở gần ga.' },
        { text: 'バス{停|てい}の{横|よこ}に{自動販売機|じどうはんばいき}があります。', ro: 'Basutei no yoko ni jidou hanbaiki ga arimasu.', vi: 'Cạnh trạm xe buýt có máy bán hàng tự động.' },
        { text: '{木|き}の{下|した}に{犬|いぬ}がいます。', ro: 'Ki no shita ni inu ga imasu.', vi: 'Dưới gốc cây có con chó.' },
        { text: '{銀行|ぎんこう}と{本屋|ほんや}の{間|あいだ}に{花屋|はなや}があります。', ro: 'Ginkou to hon-ya no aida ni hanaya ga arimasu.', vi: 'Giữa ngân hàng và hiệu sách có tiệm hoa.' },
        { text: 'ビルの{後|うし}ろに{公園|こうえん}があります。', ro: 'Biru no ushiro ni kouen ga arimasu.', vi: 'Phía sau toà nhà có công viên.' },
        { text: '{郵便局|ゆうびんきょく}の{隣|となり}は{交番|こうばん}です。', ro: 'Yuubinkyoku no tonari wa kouban desu.', vi: 'Cạnh bưu điện là đồn công an.' },
        { text: 'ジュースは{冷蔵庫|れいぞうこ}の{中|なか}にあります。', ro: 'Juusu wa reizouko no naka ni arimasu.', vi: 'Nước hoa quả ở trong tủ lạnh.' },
        { text: '{電子|でんし}レンジの{使|つか}い{方|かた}を{教|おし}えてください。', ro: 'Denshi renji no tsukaikata o oshiete kudasai.', vi: 'Hãy chỉ tôi cách dùng lò vi sóng.' },
        { text: '{砂糖|さとう}と{塩|しお}を{取|と}ってください。', ro: 'Satou to shio o totte kudasai.', vi: 'Lấy giúp tôi đường và muối.' },
        { text: '{台所|だいどころ}でお{皿|さら}を{洗|あら}っています。', ro: 'Daidokoro de osara o aratte imasu.', vi: 'Đang rửa đĩa trong bếp.' },
        { text: 'ペンで{名前|なまえ}を{書|か}いてください。', ro: 'Pen de namae o kaite kudasai.', vi: 'Hãy viết tên bằng bút.' },
        { text: '{漢字|かんじ}の{読|よ}み{方|かた}がわかりません。', ro: 'Kanji no yomikata ga wakarimasen.', vi: 'Tôi không biết cách đọc chữ Hán.' },
        { text: '{友達|ともだち}に{電話|でんわ}をかけています。', ro: 'Tomodachi ni denwa o kakete imasu.', vi: 'Tôi đang gọi điện cho bạn.' },
        { text: '{窓|まど}を{開|あ}けましょうか。', ro: 'Mado o akemashou ka.', vi: 'Để tôi mở cửa sổ nhé?' },
        { text: '{寒|さむ}いですから、{窓|まど}を{閉|し}めてください。', ro: 'Samui desu kara, mado o shimete kudasai.', vi: 'Vì lạnh nên hãy đóng cửa sổ.' },
        { text: '{外|そと}でたばこを{吸|す}っています。', ro: 'Soto de tabako o sutte imasu.', vi: 'Đang hút thuốc ở ngoài.' },
        { text: 'カルロスさんはギターを{弾|ひ}いています。', ro: 'Karurosu-san wa gitaa o hiite imasu.', vi: 'Carlos đang chơi guitar.' },
        { text: 'ワンさんがケーキを{持|も}って{来|き}ました。', ro: 'Wan-san ga keeki o motte kimashita.', vi: 'Wang đã mang bánh đến.' },
        { text: '{駅|えき}まで{迎|むか}えに{行|い}きます。', ro: 'Eki made mukae ni ikimasu.', vi: 'Tôi đi đón bạn ở ga.' },
        { text: 'すみませんが、ペンを{貸|か}してください。', ro: 'Sumimasen ga, pen o kashite kudasai.', vi: 'Xin lỗi, cho tôi mượn cái bút.' },
        { text: '{冷蔵庫|れいぞうこ}からビールを{出|だ}してください。', ro: 'Reizouko kara biiru o dashite kudasai.', vi: 'Hãy lấy bia từ tủ lạnh ra.' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b7-doc-doan',
      title: 'Đọc đoạn không furigana — kiểu đề Reading',
      note: 'Mỗi đoạn ~100 chữ như đề thi: đọc to một mạch trong khoảng 1 phút, rồi mới hiện cách đọc để tự chấm.',
      items: [
        {
          text: 'わたしのアパートは{駅|えき}の{近|ちか}くにあります。{駅|えき}の{改札|かいさつ}の{前|まえ}に{交番|こうばん}があります。{交番|こうばん}の{隣|となり}はコンビニです。コンビニの{後|うし}ろにしろいアパートがあります。そこがわたしのうちです。',
          ro: 'Watashi no apaato wa eki no chikaku ni arimasu. Eki no kaisatsu no mae ni kouban ga arimasu. Kouban no tonari wa konbini desu. Konbini no ushiro ni shiroi apaato ga arimasu. Soko ga watashi no uchi desu.',
          vi: 'Căn hộ của tôi ở gần ga. Trước cổng soát vé của ga có đồn công an. Cạnh đồn là cửa hàng tiện lợi. Phía sau cửa hàng có một căn hộ màu trắng. Đó là nhà tôi.',
        },
        {
          text: 'きょうはワンさんのうちでパーティーがあります。わたしは{台所|だいどころ}でやさいを{切|き}っています。パクさんはお{皿|さら}を{洗|あら}っています。ワインは{冷蔵庫|れいぞうこ}の{中|なか}にあります。ナタポンさんはいすを{持|も}って{行|い}きます。',
          ro: 'Kyou wa Wan-san no uchi de paatii ga arimasu. Watashi wa daidokoro de yasai o kitte imasu. Paku-san wa osara o aratte imasu. Wain wa reizouko no naka ni arimasu. Natapon-san wa isu o motte ikimasu.',
          vi: 'Hôm nay có tiệc ở nhà Wang. Tôi đang cắt rau trong bếp. Park đang rửa đĩa. Rượu vang ở trong tủ lạnh. Natapon mang ghế đi.',
        },
        {
          text: 'パーティーはとてもたのしいです。カルロスさんはギターを{弾|ひ}いています。メアリーさんは{歌|うた}を{歌|うた}っています。マルコさんは{外|そと}でたばこを{吸|す}っています。アンナさんは{窓|まど}の{近|ちか}くで{電話|でんわ}をかけています。',
          ro: 'Paatii wa totemo tanoshii desu. Karurosu-san wa gitaa o hiite imasu. Mearii-san wa uta o utatte imasu. Maruko-san wa soto de tabako o sutte imasu. Anna-san wa mado no chikaku de denwa o kakete imasu.',
          vi: 'Bữa tiệc rất vui. Carlos đang chơi guitar. Mary đang hát. Marco đang hút thuốc ở ngoài. Anna đang gọi điện gần cửa sổ.',
        },
        {
          text: 'すみませんが、カレーの{作|つく}り{方|かた}を{教|おし}えてください。{電子|でんし}レンジの{使|つか}い{方|かた}もわかりません。{砂糖|さとう}と{塩|しお}はどれですか。ナイフとスプーンはテーブルの{上|うえ}に{置|お}いてください。',
          ro: 'Sumimasen ga, karee no tsukurikata o oshiete kudasai. Denshi renji no tsukaikata mo wakarimasen. Satou to shio wa dore desu ka. Naifu to supuun wa teeburu no ue ni oite kudasai.',
          vi: 'Xin lỗi, hãy chỉ tôi cách nấu cà ri. Tôi cũng không biết cách dùng lò vi sóng. Đường và muối là lọ nào? Dao và thìa thì đặt lên bàn giúp tôi.',
        },
      ],
    },
    {
      t: 'write',
      id: 'b7-viet-kanji',
      title: 'Tập viết tay 60 chữ Hán của Bài 7 (✍ trước, 👁 sau)',
      note: '19 chữ đầu là ✍ nên viết (上 下 中 外 前 近 木 花 犬 行 子 皿 書 聞 切 手 出 入 来 — ít nét, gặp liên tục); phần còn lại là 👁 nhận mặt — viết thử để nhớ hình, không cần thuộc. Bấm ▶ Thứ tự nét trước khi viết; viết xong nhờ ✨ AI xem chữ.',
      chars: ['上', '下', '中', '外', '前', '近', '木', '花', '犬', '行', '子', '皿', '書', '聞', '切', '手', '出', '入', '来', '後', '横', '隣', '間', '改', '札', '交', '番', '自', '動', '販', '売', '機', '停', '迎', '電', '冷', '蔵', '庫', '砂', '糖', '塩', '漢', '字', '台', '所', '窓', '話', '歌', '洗', '置', '貸', '使', '伝', '取', '持', '教', '吸', '弾', '開', '閉'],
    },
  ],
};

/* ═══════════════════════════ 5. NGHE ═══════════════════════════ */

const NGHE: Lesson = {
  id: 'b7-nghe',
  kind: 'listening',
  title: 'Luyện nghe — gặp nhau ở đâu? lấy cái nào? ai đang làm gì? còn hay hết?',
  goal: 'Nghe ra nơi hẹn gặp qua cuộc gọi khi lạc đường, nghe lời nhờ để biết lấy / đặt cái gì ở đâu, nghe ai đang làm gì ở bữa tiệc, và nghe món ăn còn hay hết.',
  minutes: 40,
  blocks: [
    {
      t: 'note',
      title: 'Cách nghe',
      items: [
        'Nghe vị trí: bắt cụm **N の + (上・下・中・外・前・後ろ・横・隣・近く・間) + に**. Mốc (N) nghe trước, từ vị trí nghe sau — ghi cả hai.',
        'Nghe cuộc gọi khi lạc: câu **{近|ちか}くに～があります** là manh mối; người gọi hay nói sai chỗ trước rồi sửa (えっ？ — "hả?") → lấy thông tin **cuối cùng**.',
        'Nghe lời nhờ: động từ ở **～てください** là VIỆC; **どの～／どれ** là người nghe đang hỏi lại → câu trả lời sau đó (その～／それ) là vật đúng.',
        'Nghe ～ています: chú ý **ai (は)** + **ở đâu (で)** + **làm gì**. Bẫy: hai người cùng tên ở hai câu, hoặc "~ không đang làm…" (～ていません).',
        'Nghe còn / hết: **まだあります** = còn; **もうありません** = hết. Nghe tiếp món được mời thay (～はどうですか).',
      ],
    },

    /* ── Bài 1: gặp nhau ở đâu ── */
    { t: 'h', text: 'Bài 1 — Hai người gặp nhau ở đâu? (やってみよう chủ đề 1)' },
    {
      t: 'table',
      caption: 'Bản đồ quanh ga さくら (tự đặt) — ô ⓐ–ⓔ là các chỗ có thể đứng đợi',
      head: ['Ô', 'Chỗ', 'Gần đó có'],
      rows: [
        ['ⓐ', 'Trước cổng soát vé phía Tây ({改札|かいさつ})', '{交番|こうばん}, {自動販売機|じどうはんばいき}'],
        ['ⓑ', 'Trước siêu thị lớn (スーパー)', 'バス{停|てい}, {大|おお}きい{木|き}'],
        ['ⓒ', 'Trong hiệu sách ({本屋|ほんや})', '{銀行|ぎんこう} ở bên cạnh'],
        ['ⓓ', 'Trước cửa hàng tiện lợi (コンビニ)', 'ポスト, {花屋|はなや}'],
        ['ⓔ', 'Trong công viên ({公園|こうえん})', '{犬|いぬ} và {木|き}, ghế đá'],
      ],
    },
    {
      t: 'listen',
      id: 'b7-ng-1a',
      title: '① Anna gọi Park',
      note: 'Nghe: Anna đang ở ô nào?',
      lines: [
        { who: 'パク', voice: 'ja-nu', text: 'もしもし、アンナさん。{今|いま}、どこにいますか。', ro: 'Moshimoshi, Anna-san. Ima, doko ni imasu ka.', vi: 'A lô, Anna. Bây giờ bạn ở đâu?' },
        { who: 'アンナ', voice: 'ja-nu', text: 'スーパーの{前|まえ}にいます。', ro: 'Suupaa no mae ni imasu.', vi: 'Mình ở trước siêu thị.' },
        { who: 'パク', voice: 'ja-nu', text: 'えっ？ スーパーですか。{近|ちか}くに{何|なに}がありますか。', ro: 'E? Suupaa desu ka. Chikaku ni nani ga arimasu ka.', vi: 'Hả? Siêu thị à? Gần đó có gì?' },
        { who: 'アンナ', voice: 'ja-nu', text: 'バス{停|てい}があります。バス{停|てい}の{横|よこ}に{大|おお}きい{木|き}があります。', ro: 'Basutei ga arimasu. Basutei no yoko ni ookii ki ga arimasu.', vi: 'Có trạm xe buýt. Cạnh trạm có một cái cây to.' },
        { who: 'パク', voice: 'ja-nu', text: 'わかりました。{今|いま}、{迎|むか}えに{行|い}きます。', ro: 'Wakarimashita. Ima, mukae ni ikimasu.', vi: 'Hiểu rồi. Mình đi đón ngay.' },
      ],
    },
    {
      t: 'listen',
      id: 'b7-ng-1b',
      title: '② Wang gọi Natapon',
      note: 'Bẫy: Natapon nói sai chỗ rồi sửa. Anh ấy đang ở ô nào?',
      lines: [
        { who: 'ワン', voice: 'ja-nu', text: 'もしもし、ナタポンさん。{今|いま}、どこですか。', ro: 'Moshimoshi, Natapon-san. Ima, doko desu ka.', vi: 'A lô, Natapon. Giờ anh ở đâu?' },
        { who: 'ナタポン', voice: 'ja-nam', text: 'ええと、{銀行|ぎんこう}の{前|まえ}に……あ、すみません。{銀行|ぎんこう}の{隣|となり}の{本屋|ほんや}の{中|なか}にいます。', ro: 'Eeto, ginkou no mae ni… a, sumimasen. Ginkou no tonari no hon-ya no naka ni imasu.', vi: 'Ờ, trước ngân hàng… à, xin lỗi. Tôi đang ở trong hiệu sách cạnh ngân hàng.' },
        { who: 'ワン', voice: 'ja-nu', text: '{本屋|ほんや}の{中|なか}ですね。じゃ、そこにいてください。', ro: 'Hon-ya no naka desu ne. Ja, soko ni ite kudasai.', vi: 'Trong hiệu sách nhỉ. Vậy anh cứ ở đó nhé.' },
        { who: 'ナタポン', voice: 'ja-nam', text: 'はい。{雑誌|ざっし}を{読|よ}んでいます。', ro: 'Hai. Zasshi o yonde imasu.', vi: 'Được. Tôi đang đọc tạp chí. ({雑誌|ざっし} — tạp chí, từ thêm)' },
      ],
    },
    {
      t: 'listen',
      id: 'b7-ng-1c',
      title: '③ Marco gọi Mary',
      note: 'Mary đang ở ô nào?',
      lines: [
        { who: 'マルコ', voice: 'ja-nam', text: 'もしもし、メアリーさん。{今|いま}、どこにいますか。', ro: 'Moshimoshi, Mearii-san. Ima, doko ni imasu ka.', vi: 'A lô, Mary. Chị đang ở đâu?' },
        { who: 'メアリー', voice: 'ja-nu', text: '{駅|えき}の{改札|かいさつ}の{前|まえ}にいます。', ro: 'Eki no kaisatsu no mae ni imasu.', vi: 'Tôi đang ở trước cổng soát vé của ga.' },
        { who: 'マルコ', voice: 'ja-nam', text: '{改札|かいさつ}は{二|ふた}つありますよ。{近|ちか}くに{何|なに}がありますか。', ro: 'Kaisatsu wa futatsu arimasu yo. Chikaku ni nani ga arimasu ka.', vi: 'Có hai cổng soát vé đấy. Gần chỗ chị có gì?' },
        { who: 'メアリー', voice: 'ja-nu', text: '{交番|こうばん}があります。{交番|こうばん}の{隣|となり}に{自動販売機|じどうはんばいき}があります。', ro: 'Kouban ga arimasu. Kouban no tonari ni jidou hanbaiki ga arimasu.', vi: 'Có đồn công an. Cạnh đồn có máy bán hàng tự động.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'ああ、{西口|にしぐち}ですね。わかりました。', ro: 'Aa, nishiguchi desu ne. Wakarimashita.', vi: 'À, cửa Tây nhỉ. Hiểu rồi. ({西口|にしぐち} — cửa Tây, từ thêm)' },
      ],
    },
    {
      t: 'mcq',
      id: 'b7-ng-1-q',
      title: 'Câu hỏi bài 1 — mỗi người đang ở ô nào?',
      items: [
        { q: '① アンナさんはどこにいますか。', options: ['ⓐ', 'ⓑ', 'ⓒ', 'ⓓ'], correct: 1, why: 'スーパーの{前|まえ} + バス{停|てい} + {大|おお}きい{木|き} → **ⓑ**.' },
        { q: '② ナタポンさんはどこにいますか。', options: ['Trước ngân hàng', 'ⓒ Trong hiệu sách', 'ⓓ Trước cửa hàng tiện lợi', 'ⓔ Công viên'], correct: 1, why: 'Bẫy: nói {銀行|ぎんこう}の{前|まえ} rồi sửa: **{本屋|ほんや}の{中|なか}にいます** → ⓒ.' },
        { q: '② ナタポンさんは{何|なに}をしていますか。', options: ['{本|ほん}を{買|か}っています', '{雑誌|ざっし}を{読|よ}んでいます', '{電話|でんわ}をかけています', 'コーヒーを{飲|の}んでいます'], correct: 1, why: '{雑誌|ざっし}を**{読|よ}んでいます**.' },
        { q: '③ メアリーさんはどこにいますか。', options: ['ⓐ', 'ⓑ', 'ⓒ', 'ⓔ'], correct: 0, why: '{改札|かいさつ}の{前|まえ} + {交番|こうばん} + {自動販売機|じどうはんばいき} → **ⓐ**.' },
      ],
    },

    /* ── Bài 2: chuẩn bị tiệc ── */
    { t: 'h', text: 'Bài 2 — Chuẩn bị tiệc: làm gì, lấy cái nào? (やってみよう chủ đề 2)' },
    {
      t: 'listen',
      id: 'b7-ng-2',
      title: 'Wang phân việc cho Daniel và Anna',
      note: 'Nghe: Daniel phải làm những việc gì? Anna lấy cái nào?',
      lines: [
        { who: 'ワン', voice: 'ja-nu', text: 'ダニエルさん、すみませんが、テーブルをあの{窓|まど}の{前|まえ}へ{持|も}って{行|い}ってください。', ro: 'Danieru-san, sumimasen ga, teeburu o ano mado no mae e motte itte kudasai.', vi: 'Daniel, xin lỗi nhé, mang cái bàn ra trước cửa sổ kia giúp mình.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'はい。いすは？', ro: 'Hai. Isu wa?', vi: 'Ừ. Còn ghế?' },
        { who: 'ワン', voice: 'ja-nu', text: 'いすはテーブルの{横|よこ}に{置|お}いてください。{四|よっ}つです。', ro: 'Isu wa teeburu no yoko ni oite kudasai. Yottsu desu.', vi: 'Ghế thì đặt cạnh bàn nhé. Bốn cái.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'わかりました。', ro: 'Wakarimashita.', vi: 'Hiểu rồi.' },
        { who: 'ワン', voice: 'ja-nu', text: 'アンナさん、コップを{取|と}ってください。', ro: 'Anna-san, koppu o totte kudasai.', vi: 'Anna, lấy giúp mình cốc.' },
        { who: 'アンナ', voice: 'ja-nu', text: 'どのコップですか。{大|おお}きいコップですか。', ro: 'Dono koppu desu ka. Ookii koppu desu ka.', vi: 'Cốc nào? Cốc to à?' },
        { who: 'ワン', voice: 'ja-nu', text: 'いいえ、その{小|ちい}さいコップです。{白|しろ}いのです。', ro: 'Iie, sono chiisai koppu desu. Shiroi no desu.', vi: 'Không, cái cốc nhỏ đó. Cái màu trắng.' },
        { who: 'アンナ', voice: 'ja-nu', text: 'ああ、これですね。はい。', ro: 'Aa, kore desu ne. Hai.', vi: 'À, cái này nhỉ. Đây.' },
        { who: 'ワン', voice: 'ja-nu', text: 'それから、ジュースを{冷蔵庫|れいぞうこ}から{出|だ}してください。ビールはまだ{出|だ}しません。', ro: 'Sorekara, juusu o reizouko kara dashite kudasai. Biiru wa mada dashimasen.', vi: 'Rồi lấy nước hoa quả từ tủ lạnh ra. Bia thì chưa lấy ra.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b7-ng-2-q',
      title: 'Câu hỏi bài 2',
      items: [
        { q: 'ダニエルさんはテーブルをどこへ{持|も}って{行|い}きますか。', options: ['{台所|だいどころ}', '{窓|まど}の{前|まえ}', 'ドアの{横|よこ}', '{冷蔵庫|れいぞうこ}の{隣|となり}'], correct: 1, why: 'テーブルを**あの{窓|まど}の{前|まえ}へ**{持|も}って{行|い}ってください.' },
        { q: 'いすはどこに{置|お}きますか。いくつですか。', options: ['テーブルの{上|うえ}・{3|みっ}つ', 'テーブルの{横|よこ}・{4|よっ}つ', '{窓|まど}の{前|まえ}・{4|よっ}つ', 'テーブルの{下|した}・{2|ふた}つ'], correct: 1, why: 'いすは**テーブルの{横|よこ}**に{置|お}いてください。**{四|よっ}つ**です.' },
        { q: 'アンナさんはどのコップを{取|と}りますか。', options: ['{大|おお}きいコップ', '{小|ちい}さい{白|しろ}いコップ', '{赤|あか}いコップ', 'Tất cả'], correct: 1, why: 'Bẫy: Anna hỏi {大|おお}きい? → Wang: いいえ、**その{小|ちい}さいコップ。{白|しろ}いの**.' },
        { q: '{冷蔵庫|れいぞうこ}から{何|なに}を{出|だ}しますか。', options: ['ビール', 'ジュース', 'ビールとジュース', 'ワイン'], correct: 1, why: 'ジュースを{出|だ}してください; ビールは**まだ{出|だ}しません** (chưa lấy).' },
      ],
    },
    {
      t: 'listen',
      id: 'b7-ng-2b',
      title: 'Hỏi cách làm — ai chỉ cho Carlos?',
      lines: [
        { who: 'カルロス', voice: 'ja-nam', text: 'パクさん、この{電子|でんし}レンジの{使|つか}い{方|かた}がわかりません。{教|おし}えてください。', ro: 'Paku-san, kono denshi renji no tsukaikata ga wakarimasen. Oshiete kudasai.', vi: 'Park, tôi không biết cách dùng lò vi sóng này. Chỉ tôi với.' },
        { who: 'パク', voice: 'ja-nu', text: 'すみません。{私|わたし}もわかりません。メアリーさんに{聞|き}いてください。', ro: 'Sumimasen. Watashi mo wakarimasen. Mearii-san ni kiite kudasai.', vi: 'Xin lỗi. Tôi cũng không biết. Hỏi Mary nhé.' },
        { who: 'カルロス', voice: 'ja-nam', text: 'メアリーさん、{電子|でんし}レンジの{使|つか}い{方|かた}を{教|おし}えてください。', ro: 'Mearii-san, denshi renji no tsukaikata o oshiete kudasai.', vi: 'Mary, chỉ tôi cách dùng lò vi sóng với.' },
        { who: 'メアリー', voice: 'ja-nu', text: 'いいですよ。ピザをここに{入|い}れてください。それから、この{白|しろ}いボタンを{押|お}してください。', ro: 'Ii desu yo. Piza o koko ni irete kudasai. Sorekara, kono shiroi botan o oshite kudasai.', vi: 'Được thôi. Cho pizza vào đây. Rồi bấm cái nút trắng này.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b7-ng-2b-q',
      title: 'Câu hỏi — cách dùng lò vi sóng',
      items: [
        { q: 'カルロスさんは{何|なに}がわかりませんか。', options: ['カレーの{作|つく}り{方|かた}', '{電子|でんし}レンジの{使|つか}い{方|かた}', 'ピザの{切|き}り{方|かた}', '{冷蔵庫|れいぞうこ}の{場所|ばしょ}'], correct: 1, why: '**{電子|でんし}レンジの{使|つか}い{方|かた}**がわかりません.' },
        { q: '{誰|だれ}が{使|つか}い{方|かた}を{教|おし}えましたか。', options: ['パクさん', 'メアリーさん', 'ワンさん', '{誰|だれ}も{教|おし}えませんでした'], correct: 1, why: 'Park cũng không biết → hỏi Mary; **メアリーさん**が{教|おし}えました.' },
      ],
    },

    /* ── Bài 3: ai đang làm gì ── */
    { t: 'h', text: 'Bài 3 — Ai đang làm gì? (やってみよう chủ đề 3)' },
    {
      t: 'table',
      caption: 'Các hành động (chọn a–f cho mỗi người)',
      head: ['', 'Hành động'],
      rows: [
        ['a', 'Hát ({歌|うた}を{歌|うた}っています)'],
        ['b', 'Chơi guitar (ギターを{弾|ひ}いています)'],
        ['c', 'Rửa bát trong bếp (お{皿|さら}を{洗|あら}っています)'],
        ['d', 'Gọi điện ({電話|でんわ}をかけています)'],
        ['e', 'Hút thuốc ngoài ban công (たばこを{吸|す}っています)'],
        ['f', 'Chụp ảnh ({写真|しゃしん}を{撮|と}っています)'],
      ],
    },
    {
      t: 'listen',
      id: 'b7-ng-3',
      title: 'Mary đến muộn, hỏi Wang',
      note: 'Nghe: パク, カルロス, マルコ, アンナ mỗi người đang làm gì?',
      lines: [
        { who: 'メアリー', voice: 'ja-nu', text: 'こんばんは。{遅|おそ}くなりました。すみません。', ro: 'Konbanwa. Osoku narimashita. Sumimasen.', vi: 'Chào buổi tối. Mình đến muộn. Xin lỗi nhé. ({遅|おそ}くなりました — tôi đến muộn, cụm thêm)' },
        { who: 'ワン', voice: 'ja-nu', text: 'いいえ。どうぞ、{入|はい}ってください。', ro: 'Iie. Douzo, haitte kudasai.', vi: 'Không sao. Mời vào.' },
        { who: 'メアリー', voice: 'ja-nu', text: 'パクさんは？', ro: 'Paku-san wa?', vi: 'Park đâu rồi?' },
        { who: 'ワン', voice: 'ja-nu', text: 'パクさんは{台所|だいどころ}にいます。お{皿|さら}を{洗|あら}っています。', ro: 'Paku-san wa daidokoro ni imasu. Osara o aratte imasu.', vi: 'Park ở trong bếp. Đang rửa bát.' },
        { who: 'メアリー', voice: 'ja-nu', text: 'あ、{歌|うた}が{聞|き}こえますね。{誰|だれ}が{歌|うた}っていますか。', ro: 'A, uta ga kikoemasu ne. Dare ga utatte imasu ka.', vi: 'A, nghe thấy tiếng hát nhỉ. Ai đang hát vậy? ({聞|き}こえます — nghe thấy, từ thêm)' },
        { who: 'ワン', voice: 'ja-nu', text: 'アンナさんです。カルロスさんがギターを{弾|ひ}いています。', ro: 'Anna-san desu. Karurosu-san ga gitaa o hiite imasu.', vi: 'Là Anna. Carlos đang chơi guitar.' },
        { who: 'メアリー', voice: 'ja-nu', text: 'マルコさんは{電話|でんわ}をかけていますか。', ro: 'Maruko-san wa denwa o kakete imasu ka.', vi: 'Marco đang gọi điện à?' },
        { who: 'ワン', voice: 'ja-nu', text: 'いいえ、{電話|でんわ}はかけていません。{外|そと}でたばこを{吸|す}っています。', ro: 'Iie, denwa wa kakete imasen. Soto de tabako o sutte imasu.', vi: 'Không, không gọi điện. Đang hút thuốc ở ngoài.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b7-ng-3-q',
      title: 'Câu hỏi bài 3 — ai đang làm gì (a–f)',
      items: [
        { q: 'パクさん', options: ['a', 'c', 'd', 'f'], correct: 1, why: '{台所|だいどころ}で**お{皿|さら}を{洗|あら}っています** → c.' },
        { q: 'アンナさん', options: ['a', 'b', 'd', 'e'], correct: 0, why: '{誰|だれ}が{歌|うた}っていますか。——**アンナさんです** → a.' },
        { q: 'カルロスさん', options: ['a', 'b', 'c', 'f'], correct: 1, why: 'ギターを**{弾|ひ}いています** → b.' },
        { q: 'マルコさん', options: ['d', 'e', 'f', 'c'], correct: 1, why: 'Bẫy: {電話|でんわ}は**かけていません** → {外|そと}でたばこを**{吸|す}っています** → e.' },
      ],
    },

    /* ── Bài 4: hội thoại dài ── */
    { t: 'h', text: 'Bài 4 — Hội thoại dài: tiệc ở ký túc xá (もう{一度|いちど}{聞|き}こう)' },
    {
      t: 'listen',
      id: 'b7-ng-4',
      title: 'Một buổi tối ở ký túc xá của Park — 3 cảnh',
      note: 'Cảnh 1: chuẩn bị · Cảnh 2: gọi điện · Cảnh 3: bữa tiệc. Nghe hết rồi trả lời.',
      lines: [
        { who: 'ダニエル', voice: 'ja-nam', text: 'パクさん、{何|なに}を{作|つく}っていますか。', ro: 'Paku-san, nani o tsukutte imasu ka.', vi: 'Park, bạn đang nấu gì vậy?' },
        { who: 'パク', voice: 'ja-nu', text: 'スープを{作|つく}っています。', ro: 'Suupu o tsukutte imasu.', vi: 'Mình đang nấu súp.' },
        { who: 'ダニエル', voice: 'ja-nam', text: '{手伝|てつだ}いましょうか。', ro: 'Tetsudaimashou ka.', vi: 'Để mình giúp nhé?' },
        { who: 'パク', voice: 'ja-nu', text: 'ありがとうございます。じゃ、このナイフで{肉|にく}を{切|き}ってください。', ro: 'Arigatou gozaimasu. Ja, kono naifu de niku o kitte kudasai.', vi: 'Cảm ơn nhé. Vậy cắt thịt bằng con dao này giúp mình.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'はい。{肉|にく}はどれですか。', ro: 'Hai. Niku wa dore desu ka.', vi: 'Ừ. Thịt là cái nào?' },
        { who: 'パク', voice: 'ja-nu', text: '{冷蔵庫|れいぞうこ}の{中|なか}にあります。{上|うえ}のです。', ro: 'Reizouko no naka ni arimasu. Ue no desu.', vi: 'Ở trong tủ lạnh. Cái ở ngăn trên.' },
        { who: 'パク', voice: 'ja-nu', text: 'あ、{電話|でんわ}です。……もしもし、ワンさん。{今|いま}、どこにいますか。', ro: 'A, denwa desu. … Moshimoshi, Wan-san. Ima, doko ni imasu ka.', vi: 'A, điện thoại. … A lô, Wang. Bạn đang ở đâu?' },
        { who: 'ワン', voice: 'ja-nu', text: '{寮|りょう}の{近|ちか}くの{公園|こうえん}にいます。{公園|こうえん}の{前|まえ}にポストがあります。', ro: 'Ryou no chikaku no kouen ni imasu. Kouen no mae ni posuto ga arimasu.', vi: 'Mình ở công viên gần ký túc xá. Trước công viên có hòm thư.' },
        { who: 'パク', voice: 'ja-nu', text: 'わかりました。ダニエルさんが{迎|むか}えに{行|い}きます。', ro: 'Wakarimashita. Danieru-san ga mukae ni ikimasu.', vi: 'Hiểu rồi. Daniel sẽ đi đón bạn.' },
        { who: 'ワン', voice: 'ja-nu', text: 'このスープ、おいしいですね。{誰|だれ}が{作|つく}りましたか。', ro: 'Kono suupu, oishii desu ne. Dare ga tsukurimashita ka.', vi: 'Súp này ngon nhỉ. Ai nấu vậy?' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'パクさんが{作|つく}りました。{私|わたし}は{肉|にく}を{切|き}りました。', ro: 'Paku-san ga tsukurimashita. Watashi wa niku o kirimashita.', vi: 'Park nấu. Mình thì cắt thịt.' },
        { who: 'ワン', voice: 'ja-nu', text: 'へえ。スープはまだありますか。', ro: 'Hee. Suupu wa mada arimasu ka.', vi: 'Ồ. Súp còn không?' },
        { who: 'パク', voice: 'ja-nu', text: 'はい、まだありますよ。{取|と}りましょうか。', ro: 'Hai, mada arimasu yo. Torimashou ka.', vi: 'Có, vẫn còn đấy. Để mình lấy cho nhé?' },
        { who: 'ワン', voice: 'ja-nu', text: 'お{願|ねが}いします。', ro: 'Onegaishimasu.', vi: 'Nhờ bạn nhé.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b7-ng-4-q',
      title: 'Câu hỏi bài 4',
      items: [
        { q: 'パクさんは{何|なに}を{作|つく}っていますか。', options: ['サラダ', 'スープ', 'カレー', 'ケーキ'], correct: 1, why: '**スープ**を{作|つく}っています.' },
        { q: 'ダニエルさんは{何|なに}を{手伝|てつだ}いましたか。', options: ['{野菜|やさい}を{洗|あら}いました', '{肉|にく}を{切|き}りました', 'お{皿|さら}を{洗|あら}いました', '{料理|りょうり}を{取|と}りました'], correct: 1, why: 'このナイフで**{肉|にく}を{切|き}って**ください → {私|わたし}は{肉|にく}を{切|き}りました.' },
        { q: '{肉|にく}はどこにありますか。', options: ['テーブルの{上|うえ}', '{冷蔵庫|れいぞうこ}の{中|なか}', '{台所|だいどころ}の{外|そと}', 'いすの{下|した}'], correct: 1, why: '**{冷蔵庫|れいぞうこ}の{中|なか}**にあります.' },
        { q: 'ワンさんはどこにいましたか。', options: ['{駅|えき}の{前|まえ}', '{寮|りょう}の{近|ちか}くの{公園|こうえん}', 'コンビニの{中|なか}', 'ポストの{後|うし}ろ'], correct: 1, why: '**{寮|りょう}の{近|ちか}くの{公園|こうえん}**にいます (trước công viên có hòm thư).' },
        { q: '{誰|だれ}がワンさんを{迎|むか}えに{行|い}きますか。', options: ['パクさん', 'ダニエルさん', 'メアリーさん', '{誰|だれ}も{行|い}きません'], correct: 1, why: '**ダニエルさんが**{迎|むか}えに{行|い}きます.' },
        { q: 'スープはまだありますか。', options: ['はい、まだあります', 'いいえ、もうありません', 'Không nói', 'Còn bia'], correct: 0, why: 'はい、**まだあります**よ。{取|と}りましょうか.' },
      ],
    },

    /* ── Bài 5: còn / hết ── */
    { t: 'h', text: 'Bài 5 — Còn hay hết? (まだ／もう)' },
    {
      t: 'listen',
      id: 'b7-ng-5',
      title: 'Cuối bữa tiệc — hỏi 4 món',
      note: 'Mỗi món: ○ còn / × hết. Nếu hết, chủ nhà mời món gì thay?',
      lines: [
        { who: 'マルコ', voice: 'ja-nam', text: 'ワンさん、ピザはまだありますか。', ro: 'Wan-san, piza wa mada arimasu ka.', vi: 'Wang, pizza còn không?' },
        { who: 'ワン', voice: 'ja-nu', text: 'すみません。ピザはもうありません。すしはどうですか。', ro: 'Sumimasen. Piza wa mou arimasen. Sushi wa dou desu ka.', vi: 'Xin lỗi. Pizza hết rồi. Sushi thì sao?' },
        { who: 'マルコ', voice: 'ja-nam', text: 'いいですね。お{茶|ちゃ}もまだありますか。', ro: 'Ii desu ne. Ocha mo mada arimasu ka.', vi: 'Được đấy. Trà cũng còn chứ?' },
        { who: 'ワン', voice: 'ja-nu', text: 'はい、お{茶|ちゃ}はまだたくさんありますよ。', ro: 'Hai, ocha wa mada takusan arimasu yo.', vi: 'Có, trà vẫn còn nhiều đấy.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'ケーキは？', ro: 'Keeki wa?', vi: 'Còn bánh ngọt?' },
        { who: 'ワン', voice: 'ja-nu', text: 'ケーキもまだありますよ。{取|と}りましょうか。', ro: 'Keeki mo mada arimasu yo. Torimashou ka.', vi: 'Bánh cũng vẫn còn. Để mình lấy cho nhé?' },
        { who: 'マルコ', voice: 'ja-nam', text: 'お{願|ねが}いします。あのう、ワインは……。', ro: 'Onegaishimasu. Anou, wain wa…', vi: 'Nhờ bạn. À, còn rượu vang thì…' },
        { who: 'ワン', voice: 'ja-nu', text: 'ワインはもうありません。ビールはどうですか。{冷蔵庫|れいぞうこ}にありますよ。', ro: 'Wain wa mou arimasen. Biiru wa dou desu ka. Reizouko ni arimasu yo.', vi: 'Vang hết rồi. Bia thì sao? Có trong tủ lạnh đấy.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b7-ng-5-q',
      title: 'Câu hỏi bài 5 — ○ còn / × hết',
      items: [
        { q: 'ピザ', options: ['○ còn', '× hết'], correct: 1, why: 'ピザは**もうありません** → mời すし thay.' },
        { q: 'お{茶|ちゃ}', options: ['○ còn', '× hết'], correct: 0, why: '**まだたくさんあります**.' },
        { q: 'ケーキ', options: ['○ còn', '× hết'], correct: 0, why: 'ケーキも**まだあります**.' },
        { q: 'ワイン', options: ['○ còn', '× hết'], correct: 1, why: 'ワインは**もうありません** → mời ビール (trong tủ lạnh).' },
        { q: 'ワインのかわりに、ワンさんは{何|なに}をすすめましたか。 (Thay rượu vang, Wang mời gì?)', options: ['すし', 'ビール', 'お{茶|ちゃ}', 'ジュース'], correct: 1, why: '**ビールはどうですか**。{冷蔵庫|れいぞうこ}にありますよ.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 6. NÓI (dạng thi) ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b7-noi',
  kind: 'speaking',
  title: 'Luyện nói — câu hỏi thi về vị trí, việc đang làm, nhờ vả, bữa tiệc',
  goal: 'Trả lời trọn câu, đúng trợ từ các câu hỏi thi liên quan Bài 7 (sống ở đâu, gần nhà có gì, đang làm gì, ăn bằng gì, có hút thuốc không), nhìn tranh căn phòng / bữa tiệc / bản đồ mà nói vị trí và việc đang làm, đóng vai lạc đường – chuẩn bị tiệc, và đọc to trôi chảy.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Đề thi nói JPD (theo "Hướng dẫn ôn thi" của bộ môn) — Bài 7 nằm ở đâu',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 7 xuất hiện ở đâu'],
      rows: [
        ['Reading', '40', 'Chuẩn bị 30 giây, đọc to đoạn ~100–110 chữ (4 từ chữ Hán gạch chân, 4 từ katakana, 70–80 chữ hiragana).', 'Đoạn tả nhà / phòng / bữa tiệc: ～の{前|まえ}にあります · ～ています · ～てください.'],
        ['Talking — có tranh', '3 × 15', 'Nhìn tranh (căn phòng, bữa tiệc, bản đồ phố…) trả lời 3 câu.', '～はどこにありますか · ～に{何|なに}がありますか · ～さんは{何|なに}をしていますか · {誰|だれ}が～ていますか'],
        ['Talking — không tranh', '1 × 10', 'Trả lời 1 câu về bản thân.', 'どこに{住|す}んでいますか · うちの{近|ちか}くに{何|なに}がありますか · たばこを{吸|す}いますか · {何|なに}で{食|た}べますか'],
        ['Presenting', '5', 'Chào khi vào và khi ra.', 'しつれいします／ありがとうございました。'],
      ],
    },
    {
      t: 'note',
      title: 'Luật chấm cần nhớ (trừ điểm thật)',
      items: [
        '**Sai trợ từ: −2 điểm** mỗi lỗi. Bài 7 soát kỹ: nơi **に** います／あります · nơi **で** V ています · **N の {前|まえ}** · **{何|なに}が／{誰|だれ}が** · dụng cụ **で** · **N の** V{方|かた}.',
        '**あります ↔ います nhầm = sai ngữ pháp**: người, con vật → います; đồ vật, toà nhà, cây → あります.',
        '**Câu có/không quên はい／いいえ**: bị trừ (tối đa 5 điểm). 「たばこを{吸|す}いますか」 → **いいえ、{吸|す}いません**.',
        '**Sai nội dung = mất trọn câu**: hỏi ĐÂU mà đáp CÁI GÌ, hỏi "đang làm gì" mà đáp một danh từ.',
        'Được xin nhắc lại câu hỏi **tối đa 2 lần, không bị trừ**: **もう{一度|いちど}お{願|ねが}いします** · **ゆっくりお{願|ねが}いします**.',
      ],
    },

    /* ── Không tranh ① nơi ở ── */
    { t: 'h', text: 'Câu hỏi không tranh ① — Nhà bạn, trường bạn ở đâu, gần đó có gì' },
    {
      t: 'p',
      text: 'Các câu dưới khớp ngân hàng câu hỏi thi về bản thân (「いま どこに すんでいますか」「がっこうは どこですか」 trong bộ câu hỏi của bộ môn) và mở rộng bằng mẫu vị trí của Bài 7. Câu trả lời là **mẫu** — thay bằng thông tin thật của bạn nhưng **giữ khung câu**.',
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: nơi ở, vị trí',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{今|いま}、どこに{住|す}んでいますか。', ro: 'Ima, doko ni sunde imasu ka.', vi: 'Bây giờ bạn đang sống ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: 'ハノイに{住|す}んでいます。', ro: 'Hanoi ni sunde imasu.', vi: 'Tôi đang sống ở Hà Nội. ({住|す}んでいます — "đang sống", dạng ～ています chỉ trạng thái; học kỹ ở Bài 8)' },
        { who: 'Giám thị', role: 'examiner', text: 'うちの{近|ちか}くに{何|なに}がありますか。', ro: 'Uchi no chikaku ni nani ga arimasu ka.', vi: 'Gần nhà bạn có gì?' },
        { who: 'Bạn', role: 'candidate', text: 'うちの{近|ちか}くに{大|おお}きいスーパーと{公園|こうえん}があります。', ro: 'Uchi no chikaku ni ookii suupaa to kouen ga arimasu.', vi: 'Gần nhà tôi có một siêu thị lớn và công viên.' },
        { who: 'Giám thị', role: 'examiner', text: 'FPT{大学|だいがく}はどこにありますか。', ro: 'FPT daigaku wa doko ni arimasu ka.', vi: 'Trường ĐH FPT ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: 'FPT{大学|だいがく}はホアラックにあります。', ro: 'FPT daigaku wa Hoarakku ni arimasu.', vi: 'Trường ĐH FPT ở Hoà Lạc. (thay bằng cơ sở của bạn)' },
        { who: 'Giám thị', role: 'examiner', text: '{学校|がっこう}の{近|ちか}くにコンビニがありますか。', ro: 'Gakkou no chikaku ni konbini ga arimasu ka.', vi: 'Gần trường có cửa hàng tiện lợi không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、あります。{学校|がっこう}の{前|まえ}にあります。', ro: 'Hai, arimasu. Gakkou no mae ni arimasu.', vi: 'Có ạ. Ở trước trường.' },
        { who: 'Giám thị', role: 'examiner', text: '{図書館|としょかん}は{何階|なんがい}にありますか。', ro: 'Toshokan wa nangai ni arimasu ka.', vi: 'Thư viện ở tầng mấy?' },
        { who: 'Bạn', role: 'candidate', text: '{図書館|としょかん}は{三階|さんがい}にあります。', ro: 'Toshokan wa sangai ni arimasu.', vi: 'Thư viện ở tầng 3. (さん**が**い)' },
        { who: 'Giám thị', role: 'examiner', text: '{部屋|へや}に{何|なに}がありますか。', ro: 'Heya ni nani ga arimasu ka.', vi: 'Trong phòng bạn có gì?' },
        { who: 'Bạn', role: 'candidate', text: 'ベッドと{机|つくえ}とパソコンがあります。', ro: 'Beddo to tsukue to pasokon ga arimasu.', vi: 'Có giường, bàn học và máy tính. (ベッド, {机|つくえ} — từ thêm)' },
        { who: 'Giám thị', role: 'examiner', text: '{家族|かぞく}は{今|いま}どこにいますか。', ro: 'Kazoku wa ima doko ni imasu ka.', vi: 'Gia đình bạn bây giờ ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: '{家族|かぞく}はハイフォンにいます。', ro: 'Kazoku wa Haifon ni imasu.', vi: 'Gia đình tôi ở Hải Phòng. (người → **います**)' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở nhóm câu này',
      items: [
        '「どこに{住|す}んでいますか」 → **～に{住|す}んでいます** (に, không phải ~~で~~). Đây là ～ています chỉ trạng thái — cứ đáp nguyên khối.',
        '「{近|ちか}くに{何|なに}がありますか」 → **N が あります** (が!). Không đáp cụt ~~スーパー~~.',
        '「{家族|かぞく}はどこにいますか」 — người → **います**. Nói ~~あります~~ là lỗi ngữ pháp bị trừ ngay.',
        'Tầng: {一階|いっかい}, {三階|さんがい}, {何階|なんがい} (Bài 2) — ghép với にあります: {三階|さんがい}にあります.',
      ],
    },

    /* ── Không tranh ② đang làm, thói quen ── */
    { t: 'h', text: 'Câu hỏi không tranh ② — Đang làm gì, ăn bằng gì, hút thuốc không' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: ～ています, で, thói quen',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{今|いま}、{何|なに}をしていますか。', ro: 'Ima, nani o shite imasu ka.', vi: 'Bây giờ bạn đang làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{日本語|にほんご}のテストを{受|う}けています。', ro: 'Nihongo no tesuto o ukete imasu.', vi: 'Em đang làm bài thi tiếng Nhật ạ. ({受|う}けます — dự thi, từ thêm) / đơn giản hơn: {日本語|にほんご}を{話|はな}しています。' },
        { who: 'Giám thị', role: 'examiner', text: 'たばこを{吸|す}いますか。', ro: 'Tabako o suimasu ka.', vi: 'Bạn có hút thuốc không? (câu có trong bộ câu hỏi thi)' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{吸|す}いません。', ro: 'Iie, suimasen.', vi: 'Không, tôi không hút.' },
        { who: 'Giám thị', role: 'examiner', text: 'ベトナム{人|じん}は{何|なに}でご{飯|はん}を{食|た}べますか。', ro: 'Betonamujin wa nani de gohan o tabemasu ka.', vi: 'Người Việt ăn cơm bằng gì?' },
        { who: 'Bạn', role: 'candidate', text: 'はしで{食|た}べます。', ro: 'Hashi de tabemasu.', vi: 'Ăn bằng đũa.' },
        { who: 'Giám thị', role: 'examiner', text: 'フォーは{何|なに}で{食|た}べますか。', ro: 'Foo wa nani de tabemasu ka.', vi: 'Phở ăn bằng gì?' },
        { who: 'Bạn', role: 'candidate', text: 'はしとスプーンで{食|た}べます。', ro: 'Hashi to supuun de tabemasu.', vi: 'Ăn bằng đũa và thìa.' },
        { who: 'Giám thị', role: 'examiner', text: 'ベトナム{料理|りょうり}の{作|つく}り{方|かた}がわかりますか。', ro: 'Betonamu ryouri no tsukurikata ga wakarimasu ka.', vi: 'Bạn có biết cách nấu món Việt không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、わかります。{春巻|はるま}きの{作|つく}り{方|かた}がわかります。', ro: 'Hai, wakarimasu. Harumaki no tsukurikata ga wakarimasu.', vi: 'Có ạ. Tôi biết cách làm nem rán. ({春巻|はるま}き — nem cuốn/nem rán, từ thêm)' },
        { who: 'Giám thị', role: 'examiner', text: 'ギターを{弾|ひ}きますか。', ro: 'Gitaa o hikimasu ka.', vi: 'Bạn có chơi guitar không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{弾|ひ}きません。でも、{歌|うた}が{好|す}きです。', ro: 'Iie, hikimasen. Demo, uta ga suki desu.', vi: 'Không ạ. Nhưng tôi thích hát.' },
        { who: 'Giám thị', role: 'examiner', text: '{日本|にほん}の{歌|うた}を{歌|うた}いますか。', ro: 'Nihon no uta o utaimasu ka.', vi: 'Bạn có hát bài hát Nhật không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、ときどき{歌|うた}います。', ro: 'Hai, tokidoki utaimasu.', vi: 'Có, thỉnh thoảng tôi hát.' },
        { who: 'Giám thị', role: 'examiner', text: '{名前|なまえ}をカタカナで{書|か}いてください。', ro: 'Namae o katakana de kaite kudasai.', vi: 'Hãy viết tên bạn bằng katakana. (giám thị có thể yêu cầu ～てください)' },
        { who: 'Bạn', role: 'candidate', text: 'はい。（viết）……これでいいですか。', ro: 'Hai. (viết) … Kore de ii desu ka.', vi: 'Vâng. (viết) … Thế này được chưa ạ?' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở nhóm này',
      items: [
        'Phân biệt hai câu: 「たばこを**{吸|す}いますか**」 (thói quen — có hút không?) → いいえ、{吸|す}いません; 「{今|いま}、{何|なに}を**していますか**」 (ngay lúc này) → ～ています.',
        '「{何|なに}で～ますか」 hỏi **dụng cụ** → **N で** V ます. Đừng đáp ~~はしです~~ cụt.',
        'Giám thị nói **～てください** là đang YÊU CẦU bạn làm → làm ngay và nói **はい**. Không cần trả lời bằng câu dài.',
      ],
    },

    /* ── Có tranh ── */
    { t: 'h', text: 'Câu hỏi có tranh — căn phòng, bữa tiệc, bản đồ phố' },
    {
      t: 'p',
      text: 'Tranh thi được viết lại thành bảng (không dùng ảnh). Với tranh Bài 7, giám thị hay hỏi: **～はどこにありますか／いますか · ～の{上|うえ}に{何|なに}がありますか · {誰|だれ}がいますか · ～さんは{何|なに}をしていますか · {誰|だれ}が～ていますか**.',
    },
    {
      t: 'table',
      caption: 'Tranh 1 — một căn phòng',
      head: ['Vật / con vật', 'Ở đâu'],
      rows: [
        ['テーブル', 'giữa phòng'],
        ['{花|はな}', 'trên bàn'],
        ['{犬|いぬ}', 'dưới bàn'],
        ['いす（2つ）', 'cạnh bàn'],
        ['{冷蔵庫|れいぞうこ}', 'giữa cửa sổ và cửa ra vào'],
        ['ビール', 'trong tủ lạnh'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 1',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'テーブルの{上|うえ}に{何|なに}がありますか。', ro: 'Teeburu no ue ni nani ga arimasu ka.', vi: 'Trên bàn có gì?' },
        { who: 'Bạn', role: 'candidate', text: 'テーブルの{上|うえ}に{花|はな}があります。', ro: 'Teeburu no ue ni hana ga arimasu.', vi: 'Trên bàn có hoa.' },
        { who: 'Giám thị', role: 'examiner', text: '{犬|いぬ}はどこにいますか。', ro: 'Inu wa doko ni imasu ka.', vi: 'Con chó ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: '{犬|いぬ}はテーブルの{下|した}にいます。', ro: 'Inu wa teeburu no shita ni imasu.', vi: 'Con chó ở dưới bàn.' },
        { who: 'Giám thị', role: 'examiner', text: '{冷蔵庫|れいぞうこ}はどこにありますか。', ro: 'Reizouko wa doko ni arimasu ka.', vi: 'Tủ lạnh ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: '{窓|まど}とドアの{間|あいだ}にあります。', ro: 'Mado to doa no aida ni arimasu.', vi: 'Ở giữa cửa sổ và cửa ra vào. (ドア — cửa, từ thêm)' },
        { who: 'Giám thị', role: 'examiner', text: 'いすはいくつありますか。', ro: 'Isu wa ikutsu arimasu ka.', vi: 'Có mấy cái ghế?' },
        { who: 'Bạn', role: 'candidate', text: '{二|ふた}つあります。テーブルの{横|よこ}にあります。', ro: 'Futatsu arimasu. Teeburu no yoko ni arimasu.', vi: 'Có 2 cái. Ở cạnh bàn.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh 2 — bữa tiệc',
      head: ['Người', 'Ở đâu', 'Đang làm gì'],
      rows: [
        ['パク', '{台所|だいどころ}', 'rửa đĩa'],
        ['カルロス', 'ソファ', 'chơi guitar'],
        ['メアリー', 'cạnh カルロス', 'hát'],
        ['マルコ', 'ngoài ban công', 'hút thuốc'],
        ['アンナ', 'gần cửa sổ', 'gọi điện'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 2',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'パクさんはどこにいますか。', ro: 'Paku-san wa doko ni imasu ka.', vi: 'Park ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: 'パクさんは{台所|だいどころ}にいます。', ro: 'Paku-san wa daidokoro ni imasu.', vi: 'Park ở trong bếp.' },
        { who: 'Giám thị', role: 'examiner', text: 'パクさんは{何|なに}をしていますか。', ro: 'Paku-san wa nani o shite imasu ka.', vi: 'Park đang làm gì?' },
        { who: 'Bạn', role: 'candidate', text: 'パクさんは{台所|だいどころ}でお{皿|さら}を{洗|あら}っています。', ro: 'Paku-san wa daidokoro de osara o aratte imasu.', vi: 'Park đang rửa đĩa trong bếp.' },
        { who: 'Giám thị', role: 'examiner', text: '{誰|だれ}がギターを{弾|ひ}いていますか。', ro: 'Dare ga gitaa o hiite imasu ka.', vi: 'Ai đang chơi guitar?' },
        { who: 'Bạn', role: 'candidate', text: 'カルロスさんがギターを{弾|ひ}いています。', ro: 'Karurosu-san ga gitaa o hiite imasu.', vi: 'Carlos đang chơi guitar.' },
        { who: 'Giám thị', role: 'examiner', text: 'マルコさんは{電話|でんわ}をかけていますか。', ro: 'Maruko-san wa denwa o kakete imasu ka.', vi: 'Marco đang gọi điện à?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、かけていません。マルコさんは{外|そと}でたばこを{吸|す}っています。', ro: 'Iie, kakete imasen. Maruko-san wa soto de tabako o sutte imasu.', vi: 'Không ạ. Marco đang hút thuốc ở ngoài.' },
        { who: 'Giám thị', role: 'examiner', text: '{誰|だれ}が{電話|でんわ}をかけていますか。', ro: 'Dare ga denwa o kakete imasu ka.', vi: 'Ai đang gọi điện?' },
        { who: 'Bạn', role: 'candidate', text: 'アンナさんが{電話|でんわ}をかけています。', ro: 'Anna-san ga denwa o kakete imasu.', vi: 'Anna đang gọi điện.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh 3 — bản đồ phố',
      head: ['Toà nhà', 'Vị trí'],
      rows: [
        ['{銀行|ぎんこう}', 'trước ga'],
        ['{本屋|ほんや}', 'cạnh (sát) ngân hàng'],
        ['{郵便局|ゆうびんきょく}', 'giữa hiệu sách và công viên'],
        ['{交番|こうばん}', 'phía sau ngân hàng'],
        ['バス{停|てい}', 'trước bưu điện'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 3',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{銀行|ぎんこう}はどこにありますか。', ro: 'Ginkou wa doko ni arimasu ka.', vi: 'Ngân hàng ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: '{銀行|ぎんこう}は{駅|えき}の{前|まえ}にあります。', ro: 'Ginkou wa eki no mae ni arimasu.', vi: 'Ngân hàng ở trước ga.' },
        { who: 'Giám thị', role: 'examiner', text: '{本屋|ほんや}と{公園|こうえん}の{間|あいだ}に{何|なに}がありますか。', ro: 'Hon-ya to kouen no aida ni nani ga arimasu ka.', vi: 'Giữa hiệu sách và công viên có gì?' },
        { who: 'Bạn', role: 'candidate', text: '{郵便局|ゆうびんきょく}があります。', ro: 'Yuubinkyoku ga arimasu.', vi: 'Có bưu điện.' },
        { who: 'Giám thị', role: 'examiner', text: '{交番|こうばん}はどこにありますか。', ro: 'Kouban wa doko ni arimasu ka.', vi: 'Đồn công an ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: '{交番|こうばん}は{銀行|ぎんこう}の{後|うし}ろにあります。', ro: 'Kouban wa ginkou no ushiro ni arimasu.', vi: 'Đồn công an ở phía sau ngân hàng.' },
        { who: 'Giám thị', role: 'examiner', text: 'バス{停|てい}はどこですか。', ro: 'Basutei wa doko desu ka.', vi: 'Trạm xe buýt ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: 'バス{停|てい}は{郵便局|ゆうびんきょく}の{前|まえ}です。', ro: 'Basutei wa yuubinkyoku no mae desu.', vi: 'Trạm xe buýt ở trước bưu điện. (～はどこですか → ～です cũng đúng, Bài 2)' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở câu có tranh',
      items: [
        'Nghe **どこに** → đáp **vị trí + にあります／います**. Nghe **{何|なに}が／{誰|だれ}が** → đáp **N が あります／います**. Nhầm hai kiểu là mất trọn câu.',
        'Nghe **{誰|だれ}が～ていますか** → đáp **(tên) が ～ています** — giữ nguyên động từ của câu hỏi.',
        'Câu hỏi dạng có/không (「～ていますか」) → mở đầu **はい／いいえ**, rồi nói lại cả câu, thêm câu đúng nếu là いいえ.',
        'Vị trí luôn có **の**: {駅|えき}**の**{前|まえ}, テーブル**の**{下|した}.',
      ],
    },

    /* ── Đóng vai ── */
    { t: 'h', text: 'Đóng vai — lạc đường, chuẩn bị tiệc, bữa tiệc (luyện hai người)' },
    {
      t: 'dialogue',
      title: 'Vai 1 — B lạc đường, gọi A',
      lines: [
        { who: 'A', role: 'a', text: 'もしもし、Bさん。{今|いま}、どこにいますか。', ro: 'Moshimoshi, B-san. Ima, doko ni imasu ka.', vi: 'A lô, B. Giờ bạn đang ở đâu?' },
        { who: 'B', role: 'b', text: 'ええと、{郵便局|ゆうびんきょく}の{前|まえ}にいます。', ro: 'Eeto, yuubinkyoku no mae ni imasu.', vi: 'Ờ, mình ở trước bưu điện.' },
        { who: 'A', role: 'a', text: '{郵便局|ゆうびんきょく}ですか。{近|ちか}くに{何|なに}がありますか。', ro: 'Yuubinkyoku desu ka. Chikaku ni nani ga arimasu ka.', vi: 'Bưu điện à? Gần đó có gì?' },
        { who: 'B', role: 'b', text: 'バス{停|てい}があります。{隣|となり}に{花屋|はなや}もあります。', ro: 'Basutei ga arimasu. Tonari ni hanaya mo arimasu.', vi: 'Có trạm xe buýt. Bên cạnh còn có tiệm hoa.' },
        { who: 'A', role: 'a', text: 'わかりました。そこにいてください。{今|いま}、{迎|むか}えに{行|い}きます。', ro: 'Wakarimashita. Soko ni ite kudasai. Ima, mukae ni ikimasu.', vi: 'Hiểu rồi. Bạn cứ ở đó. Mình đi đón ngay.' },
        { who: 'B', role: 'b', text: 'すみません。お{願|ねが}いします。', ro: 'Sumimasen. Onegaishimasu.', vi: 'Xin lỗi nhé. Nhờ bạn.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Vai 2 — Chuẩn bị tiệc: nhờ, hỏi cái nào, hỏi cách làm',
      lines: [
        { who: 'A', role: 'a', text: 'Bさん、すみませんが、お{皿|さら}を{取|と}ってください。', ro: 'B-san, sumimasen ga, osara o totte kudasai.', vi: 'B ơi, phiền bạn lấy giúp cái đĩa.' },
        { who: 'B', role: 'b', text: 'どのお{皿|さら}ですか。', ro: 'Dono osara desu ka.', vi: 'Đĩa nào?' },
        { who: 'A', role: 'a', text: 'その{大|おお}きいお{皿|さら}です。', ro: 'Sono ookii osara desu.', vi: 'Cái đĩa to đó.' },
        { who: 'B', role: 'b', text: 'ああ、これですね。はい、どうぞ。', ro: 'Aa, kore desu ne. Hai, douzo.', vi: 'À, cái này nhỉ. Đây.' },
        { who: 'A', role: 'a', text: 'どうも。それから、{野菜|やさい}を{切|き}ってください。', ro: 'Doumo. Sorekara, yasai o kitte kudasai.', vi: 'Cảm ơn. Rồi cắt rau giúp mình.' },
        { who: 'B', role: 'b', text: 'はい。ナイフはどれですか。', ro: 'Hai. Naifu wa dore desu ka.', vi: 'Ừ. Dao là con nào?' },
        { who: 'A', role: 'a', text: 'それです。{冷蔵庫|れいぞうこ}の{横|よこ}の。', ro: 'Sore desu. Reizouko no yoko no.', vi: 'Con đó. Con ở cạnh tủ lạnh ấy.' },
        { who: 'B', role: 'b', text: 'あのう、サラダの{作|つく}り{方|かた}がわかりません。{教|おし}えてください。', ro: 'Anou, sarada no tsukurikata ga wakarimasen. Oshiete kudasai.', vi: 'À, mình không biết cách làm salad. Chỉ mình với.' },
        { who: 'A', role: 'a', text: 'いいですよ。', ro: 'Ii desu yo.', vi: 'Được thôi.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Vai 3 — Ở bữa tiệc: đề nghị giúp, hỏi ai làm, hỏi còn không',
      lines: [
        { who: 'A', role: 'a', text: '{料理|りょうり}を{取|と}りましょうか。', ro: 'Ryouri o torimashou ka.', vi: 'Để mình lấy đồ ăn cho nhé?' },
        { who: 'B', role: 'b', text: 'あ、ありがとうございます。', ro: 'A, arigatou gozaimasu.', vi: 'A, cảm ơn nhé.' },
        { who: 'B', role: 'b', text: 'このピザ、おいしいですね。{誰|だれ}が{作|つく}りましたか。', ro: 'Kono piza, oishii desu ne. Dare ga tsukurimashita ka.', vi: 'Pizza này ngon nhỉ. Ai làm vậy?' },
        { who: 'A', role: 'a', text: 'カルロスさんが{作|つく}りました。', ro: 'Karurosu-san ga tsukurimashita.', vi: 'Carlos làm đấy.' },
        { who: 'B', role: 'b', text: 'へえ。ジュースはまだありますか。', ro: 'Hee. Juusu wa mada arimasu ka.', vi: 'Ồ. Nước hoa quả còn không?' },
        { who: 'A', role: 'a', text: 'すみません。もうありません。お{茶|ちゃ}はどうですか。', ro: 'Sumimasen. Mou arimasen. Ocha wa dou desu ka.', vi: 'Xin lỗi. Hết rồi. Trà thì sao?' },
        { who: 'B', role: 'b', text: 'いいですね。お{願|ねが}いします。', ro: 'Ii desu ne. Onegaishimasu.', vi: 'Được đấy. Nhờ bạn nhé.' },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo luyện đóng vai',
      items: [
        'Tự đổi vai với bạn học: người gọi điện chọn một ô trên bản đồ (Luyện nghe · Bài 1), người kia hỏi どこにいますか → {近|ちか}くに{何|なに}がありますか cho tới khi đoán đúng.',
        'Vai 2: người A phải dùng ít nhất 4 động từ khác nhau ở ～てください ({洗|あら}って, {切|き}って, {置|お}いて, {持|も}って{行|い}って…). Người B hỏi lại どの／どれ ít nhất 2 lần.',
        'Vai 3: dùng đủ ましょうか → {誰|だれ}が → まだ／もう → ～はどうですか.',
      ],
    },

    /* ── Reading ── */
    { t: 'h', text: 'Đọc to — Reading (40 điểm)' },
    {
      t: 'p',
      text: 'Đề đọc dài khoảng 100–110 ký tự: **4 từ chữ Hán** gạch chân (12đ), **4 từ katakana** (12đ), còn lại hiragana (16đ, sai một ký tự −0,2đ). 30 giây chuẩn bị. Bốn đoạn dưới đây viết đúng khuôn đó, chỉ dùng từ Bài 1–7. Tắt furigana khi đã quen (hoặc luyện ở mục **Chữ Hán · Đọc đoạn không furigana**).',
    },
    {
      t: 'examples',
      items: [
        {
          en: 'わたしのアパートはえきのちかくにあります。えきの{前|まえ}にスーパーがあります。スーパーの{隣|となり}は{交番|こうばん}です。アパートのまえに{大|おお}きい{木|き}があります。きのしたにいつもいぬがいます。',
          ro: 'Watashi no apaato wa eki no chikaku ni arimasu. Eki no mae ni suupaa ga arimasu. Suupaa no tonari wa kouban desu. Apaato no mae ni ookii ki ga arimasu. Ki no shita ni itsumo inu ga imasu.',
          vi: 'Căn hộ của tôi ở gần ga. Trước ga có siêu thị. Cạnh siêu thị là đồn công an. Trước căn hộ có một cái cây to. Dưới gốc cây lúc nào cũng có con chó.',
        },
        {
          en: 'きょうはワンさんのうちでパーティーがあります。わたしは{台所|だいどころ}でサラダをつくっています。パクさんはナイフでパンをきっています。ナタポンさんはテーブルにおさらをおいています。ビールは{冷蔵庫|れいぞうこ}のなかです。',
          ro: 'Kyou wa Wan-san no uchi de paatii ga arimasu. Watashi wa daidokoro de sarada o tsukutte imasu. Paku-san wa naifu de pan o kitte imasu. Natapon-san wa teeburu ni osara o oite imasu. Biiru wa reizouko no naka desu.',
          vi: 'Hôm nay có tiệc ở nhà Wang. Tôi đang làm salad trong bếp. Park đang cắt bánh mì bằng dao. Natapon đang đặt đĩa lên bàn. Bia ở trong tủ lạnh.',
        },
        {
          en: 'パーティーはとてもたのしいです。カルロスさんはギターをひいています。メアリーさんは{歌|うた}をうたっています。マルコさんは{外|そと}でたばこをすっています。アンナさんはまどのちかくで{電話|でんわ}をかけています。',
          ro: 'Paatii wa totemo tanoshii desu. Karurosu-san wa gitaa o hiite imasu. Mearii-san wa uta o utatte imasu. Maruko-san wa soto de tabako o sutte imasu. Anna-san wa mado no chikaku de denwa o kakete imasu.',
          vi: 'Bữa tiệc rất vui. Carlos đang chơi guitar. Mary đang hát. Marco đang hút thuốc ở ngoài. Anna đang gọi điện gần cửa sổ.',
        },
        {
          en: 'すみませんが、カレーのつくりかたをおしえてください。{電子|でんし}レンジのつかいかたもわかりません。{砂糖|さとう}はどれですか。スプーンとフォークはテーブルのうえにおいてください。{手伝|てつだ}いましょうか。',
          ro: 'Sumimasen ga, karee no tsukurikata o oshiete kudasai. Denshi renji no tsukaikata mo wakarimasen. Satou wa dore desu ka. Supuun to fooku wa teeburu no ue ni oite kudasai. Tetsudaimashou ka.',
          vi: 'Xin lỗi, hãy chỉ tôi cách nấu cà ri. Tôi cũng không biết cách dùng lò vi sóng. Đường là lọ nào? Thìa và nĩa thì hãy đặt lên bàn. Để tôi giúp nhé?',
        },
      ],
    },
    {
      t: 'note',
      title: 'Chỗ dễ đọc sai trong bốn đoạn trên',
      items: [
        '**台所 だいどころ** (không ~~だいところ~~), **冷蔵庫 れいぞうこ**, **交番 こうばん**, **隣 となり**, **電子 でんし**, **砂糖 さとう**, **手伝 てつだ**いましょうか — từ chữ Hán dạng đề thi.',
        'Thể て có âm ngắt: き**っ**ています, す**っ**ています, うた**っ**ています, つく**っ**ています — ngắt một nhịp ở っ. おいて, ひいて **không** có っ.',
        'Katakana kéo dài: スーパー suupaa, パーティー paatii, テーブル teeburu, スプーン supuun, フォーク fooku, ギター gitaa, メアリー mearii.',
        'は đọc **wa**, を đọc **o**, へ đọc **e**: パーティー**は**, ギター**を**.',
      ],
    },

    /* ── Tự ghi âm ── */
    { t: 'h', text: 'Tự ghi âm — trả lời không nhìn đáp án' },
    {
      t: 'speak',
      id: 'b7-noi-ghi-am',
      part: '1',
      questions: [
        'いま、どこに すんでいますか。',
        'うちの ちかくに なにが ありますか。',
        'がっこうの ちかくに コンビニが ありますか。',
        'へやに なにが ありますか。',
        'かぞくは いま どこに いますか。',
        'いま、なにを していますか。',
        'たばこを すいますか。',
        'ベトナムじんは なんで ごはんを たべますか。',
        'ベトナムりょうりの つくりかたが わかりますか。',
        'ギターを ひきますか。',
        'テーブルの うえに なにが ありますか。（tranh 1）',
        'だれが ギターを ひいていますか。（tranh 2）',
      ],
    },
  ],
};

/* ═══════════════════════════ 7. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b7-bai-tap',
  kind: 'homework',
  title: 'Bài tập về nhà — Bài 7 (có đáp án)',
  goal: 'Tự dịch, chia thể て, chọn trợ từ và ghép câu Bài 7 không cần nhìn bài học.',
  minutes: 50,
  blocks: [
    {
      t: 'p',
      text: 'Gõ tiếng Nhật bằng bộ gõ (gõ romaji, máy đổi sang kana). Chữ Hán hay kana đều được chấp nhận; dấu câu và dấu cách không tính. Nếu máy chấm sai mà bạn tin mình đúng, bấm **Hỏi gia sư** ngay dưới câu đó.',
    },
    {
      t: 'quiz',
      id: 'b7-bt-dich',
      title: 'Dịch sang tiếng Nhật',
      kind: 'translate',
      grammar: 'N1はN2にいます／あります · N1にN2がいます／あります · Vてください · Vています · Vましょうか · (Nの)V方 · まだ／もう · 誰が · どのN · どれ · N(dụng cụ)でVます',
      items: [
        { q: 'Tôi đang ở trước ga.', answers: V('{駅|えき}の{前|まえ}にいます。', '{私|わたし}は{駅|えき}の{前|まえ}にいます。', '{今|いま}、{駅|えき}の{前|まえ}にいます。'), hint: '駅, 前, います' },
        { q: 'Ngân hàng ở đâu?', answers: V('{銀行|ぎんこう}はどこにありますか。', '{銀行|ぎんこう}はどこですか。'), hint: '銀行, どこ' },
        { q: 'Đồn công an ở phía sau toà nhà kia.', answers: V('{交番|こうばん}はあのビルの{後|うし}ろにあります。'), hint: '交番, ビル, 後ろ' },
        { q: 'Gần đó có gì?', answers: V('{近|ちか}くに{何|なに}がありますか。'), hint: '近く, 何' },
        { q: 'Có cửa hàng tiện lợi lớn.', answers: V('{大|おお}きいコンビニがあります。'), hint: '大きい, コンビニ' },
        { q: 'Dưới gốc cây có con chó.', answers: V('{木|き}の{下|した}に{犬|いぬ}がいます。'), hint: '木, 下, 犬' },
        { q: 'Giữa ngân hàng và hiệu sách có bưu điện.', answers: V('{銀行|ぎんこう}と{本屋|ほんや}の{間|あいだ}に{郵便局|ゆうびんきょく}があります。'), hint: '銀行, 本屋, 間, 郵便局' },
        { q: 'Mình đi đón bạn ngay đây.', answers: V('{今|いま}、{迎|むか}えに{行|い}きます。', '{迎|むか}えに{行|い}きます。'), hint: '今, 迎えに行きます' },
        { q: 'Hãy rửa hoa quả.', answers: V('{果物|くだもの}を{洗|あら}ってください。'), hint: '果物, 洗います' },
        { q: 'Hãy cắt bánh mì bằng dao.', answers: V('ナイフでパンを{切|き}ってください。', 'パンをナイフで{切|き}ってください。'), hint: 'ナイフ, パン, 切ります' },
        { q: 'Hãy đặt đĩa lên bàn.', answers: V('お{皿|さら}をテーブルの{上|うえ}に{置|お}いてください。', '{皿|さら}をテーブルの{上|うえ}に{置|お}いてください。', 'テーブルの{上|うえ}にお{皿|さら}を{置|お}いてください。'), hint: '皿, テーブル, 上, 置きます' },
        { q: 'Xin lỗi, cho tôi mượn cái bút.', answers: V('すみませんが、ペンを{貸|か}してください。', 'すみません、ペンを{貸|か}してください。'), hint: 'すみませんが, ペン, 貸します' },
        { q: 'Hãy chỉ tôi cách nấu cà ri.', answers: V('カレーの{作|つく}り{方|かた}を{教|おし}えてください。'), hint: 'カレー, 作り方, 教えます' },
        { q: 'Tôi không biết cách dùng lò vi sóng.', answers: V('{電子|でんし}レンジの{使|つか}い{方|かた}がわかりません。'), hint: '電子レンジ, 使い方, わかります' },
        { q: 'Park đang rửa bát trong bếp.', answers: V('パクさんは{台所|だいどころ}でお{皿|さら}を{洗|あら}っています。', 'パクさんは{台所|だいどころ}で{皿|さら}を{洗|あら}っています。'), hint: '台所, 皿, 洗っています' },
        { q: 'Marco đang hút thuốc ở ngoài.', answers: V('マルコさんは{外|そと}でたばこを{吸|す}っています。'), hint: '外, たばこ, 吸います' },
        { q: 'Để tôi giúp nhé?', answers: V('{手伝|てつだ}いましょうか。'), hint: '手伝います' },
        { q: 'Để tôi mở cửa sổ nhé?', answers: V('{窓|まど}を{開|あ}けましょうか。'), hint: '窓, 開けます' },
        { q: 'Ai làm cái bánh này?', answers: V('{誰|だれ}がこのケーキを{作|つく}りましたか。', 'このケーキは{誰|だれ}が{作|つく}りましたか。'), hint: '誰, ケーキ, 作ります' },
        { q: 'Wang làm.', answers: V('ワンさんが{作|つく}りました。'), hint: 'が' },
        { q: 'Salad còn không? — Không, hết rồi.', answers: V('サラダはまだありますか。いいえ、もうありません。'), hint: 'まだ, もう' },
        { q: 'Đĩa nào? — Cái đĩa đó.', answers: V('どのお{皿|さら}ですか。そのお{皿|さら}です。', 'どの{皿|さら}ですか。その{皿|さら}です。'), hint: 'どの, その' },
        { q: 'Muối là lọ nào?', answers: V('{塩|しお}はどれですか。'), hint: '塩, どれ' },
        { q: 'Người Nhật ăn cơm bằng đũa.', answers: V('{日本|にほん}{人|じん}ははしでご{飯|はん}を{食|た}べます。', '{日本|にほん}の{人|ひと}ははしでご{飯|はん}を{食|た}べます。'), hint: 'はし, で, ご飯' },
        { q: 'Tôi gọi điện cho bạn.', answers: V('{友達|ともだち}に{電話|でんわ}をかけます。'), hint: '友達, 電話, かけます' },
      ],
    },
    {
      t: 'quiz',
      id: 'b7-bt-the-te',
      title: 'Chia thể て (gõ chữ Hán hoặc kana)',
      kind: 'fill',
      grammar: 'Nhóm 1: い・ち・り→って · み・び・に→んで · き→いて · ぎ→いで · し→して · ※{行|い}きます→{行|い}って · Nhóm 2: ます→て · Nhóm 3: します→して, {来|き}ます→{来|き}て',
      items: [
        { q: '{洗|あら}います → ?', answers: V('{洗|あら}って') },
        { q: '{置|お}きます → ?', answers: V('{置|お}いて') },
        { q: '{書|か}きます → ?', answers: V('{書|か}いて') },
        { q: '{貸|か}します → ?', answers: V('{貸|か}して') },
        { q: '{聞|き}きます → ?', answers: V('{聞|き}いて') },
        { q: '{切|き}ります → ?', answers: V('{切|き}って') },
        { q: '{使|つか}います → ?', answers: V('{使|つか}って') },
        { q: '{手伝|てつだ}います → ?', answers: V('{手伝|てつだ}って') },
        { q: '{取|と}ります → ?', answers: V('{取|と}って') },
        { q: '{持|も}って{行|い}きます → ?', answers: V('{持|も}って{行|い}って') },
        { q: '{出|だ}します → ?', answers: V('{出|だ}して') },
        { q: '{入|い}れます → ?', answers: V('{入|い}れて') },
        { q: '{教|おし}えます → ?', answers: V('{教|おし}えて') },
        { q: '{歌|うた}います → ?', answers: V('{歌|うた}って') },
        { q: '{吸|す}います → ?', answers: V('{吸|す}って') },
        { q: '{話|はな}します → ?', answers: V('{話|はな}して') },
        { q: '{弾|ひ}きます → ?', answers: V('{弾|ひ}いて') },
        { q: '{持|も}ちます → ?', answers: V('{持|も}って') },
        { q: '{開|あ}けます → ?', answers: V('{開|あ}けて') },
        { q: '{閉|し}めます → ?', answers: V('{閉|し}めて') },
        { q: 'かけます → ?', answers: V('かけて') },
        { q: '{持|も}って{来|き}ます → ?', answers: V('{持|も}って{来|き}て') },
        { q: '{飲|の}みます → ?', answers: V('{飲|の}んで') },
        { q: '{遊|あそ}びます → ?', answers: V('{遊|あそ}んで') },
        { q: '{行|い}きます → ?', answers: V('{行|い}って') },
        { q: '{食|た}べます → ?', answers: V('{食|た}べて') },
        { q: '{見|み}ます → ?', answers: V('{見|み}て') },
        { q: '{勉強|べんきょう}します → ?', answers: V('{勉強|べんきょう}して') },
        { q: '{帰|かえ}ります → ?', answers: V('{帰|かえ}って') },
        { q: '{作|つく}ります → ?', answers: V('{作|つく}って') },
      ],
    },
    {
      t: 'quiz',
      id: 'b7-bt-doi-dang',
      title: 'Đổi dạng — viết lại theo yêu cầu',
      kind: 'fill',
      grammar: 'ます → てください (nhờ) · ます → ています (đang) · ます → ましょうか (đề nghị giúp) · Nを Vます → Nの V方',
      items: [
        { q: 'お{皿|さら}を{洗|あら}います → nhờ (～てください)', answers: V('お{皿|さら}を{洗|あら}ってください') },
        { q: '{名前|なまえ}を{書|か}きます → nhờ', answers: V('{名前|なまえ}を{書|か}いてください') },
        { q: '{塩|しお}を{取|と}ります → nhờ', answers: V('{塩|しお}を{取|と}ってください') },
        { q: 'ワインを{持|も}って{来|き}ます → nhờ', answers: V('ワインを{持|も}って{来|き}てください') },
        { q: '{電話|でんわ}をかけます → đang (～ています)', answers: V('{電話|でんわ}をかけています') },
        { q: 'ギターを{弾|ひ}きます → đang', answers: V('ギターを{弾|ひ}いています') },
        { q: '{歌|うた}を{歌|うた}います → đang', answers: V('{歌|うた}を{歌|うた}っています') },
        { q: '{友達|ともだち}と{話|はな}します → đang', answers: V('{友達|ともだち}と{話|はな}しています') },
        { q: '{手伝|てつだ}います → đề nghị giúp (～ましょうか)', answers: V('{手伝|てつだ}いましょうか') },
        { q: '{窓|まど}を{閉|し}めます → đề nghị giúp', answers: V('{窓|まど}を{閉|し}めましょうか') },
        { q: '{写真|しゃしん}を{撮|と}ります → đề nghị giúp', answers: V('{写真|しゃしん}を{撮|と}りましょうか') },
        { q: 'カレーを{作|つく}ります → cách … (～の～{方|かた})', answers: V('カレーの{作|つく}り{方|かた}') },
        { q: '{電子|でんし}レンジを{使|つか}います → cách …', answers: V('{電子|でんし}レンジの{使|つか}い{方|かた}') },
        { q: '{漢字|かんじ}を{読|よ}みます → cách …', answers: V('{漢字|かんじ}の{読|よ}み{方|かた}') },
      ],
    },
    {
      t: 'mcq',
      id: 'b7-bt-tro-tu',
      title: 'Chọn trợ từ đúng',
      items: [
        { q: 'パクさんは{台所|だいどころ}＿います。', options: ['で', 'に', 'を', 'へ'], correct: 1, why: 'Nơi tồn tại → **に** (ポイント 61).' },
        { q: 'パクさんは{台所|だいどころ}＿お{皿|さら}を{洗|あら}っています。', options: ['に', 'で', 'を', 'が'], correct: 1, why: 'Nơi làm hành động → **で** (ポイント 64).' },
        { q: '{駅|えき}の{前|まえ}に{交番|こうばん}＿あります。', options: ['は', 'が', 'を', 'で'], correct: 1, why: 'Nơi に N **が** あります (ポイント 62).' },
        { q: '{交番|こうばん}＿{駅|えき}の{前|まえ}にあります。', options: ['は', 'が', 'を', 'に'], correct: 0, why: 'N1 **は** nơi に あります (ポイント 61) — hỏi / nói N1 ở đâu.' },
        { q: '{銀行|ぎんこう}＿{本屋|ほんや}の{間|あいだ}にあります。', options: ['や', 'と', 'の', 'に'], correct: 1, why: 'N1 **と** N2 の{間|あいだ}.' },
        { q: '{冷蔵庫|れいぞうこ}＿ジュースを{出|だ}してください。', options: ['に', 'から', 'で', 'を'], correct: 1, why: 'Lấy ra TỪ → **から**.' },
        { q: 'ジュースを{冷蔵庫|れいぞうこ}＿{入|い}れてください。', options: ['に', 'から', 'で', 'を'], correct: 0, why: 'Cho VÀO đâu → **に**.' },
        { q: 'ナイフ＿パンを{切|き}ります。', options: ['に', 'を', 'で', 'と'], correct: 2, why: 'Dụng cụ → **で** (ポイント 71).' },
        { q: 'カレー＿{作|つく}り{方|かた}を{教|おし}えてください。', options: ['を', 'の', 'が', 'に'], correct: 1, why: 'N **の** V方 (ポイント 66).' },
        { q: 'カレーの{作|つく}り{方|かた}＿わかりません。', options: ['を', 'が', 'に', 'で'], correct: 1, why: 'わかります đi với **が**.' },
        { q: '{誰|だれ}＿このケーキを{作|つく}りましたか。', options: ['は', 'が', 'を', 'の'], correct: 1, why: '**{誰|だれ}が** (ポイント 68).' },
        { q: 'パクさん＿{電話|でんわ}{番号|ばんごう}を{聞|き}きます。', options: ['を', 'に', 'で', 'が'], correct: 1, why: 'Hỏi AI → người **に** {聞|き}きます (câu mẫu của cô).' },
        { q: '{友達|ともだち}＿{電話|でんわ}をかけます。', options: ['を', 'に', 'と', 'で'], correct: 1, why: 'Gọi CHO ai → người **に** (câu mẫu của cô).' },
        { q: 'ワンさんはダニエルさん＿{話|はな}しています。', options: ['に', 'と', 'を', 'で'], correct: 1, why: 'Nói chuyện VỚI ai → **と**.' },
        { q: '{近|ちか}くに{何|なに}＿ありますか。', options: ['は', 'が', 'を', 'も'], correct: 1, why: 'Từ để hỏi + **が**.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b7-bt-tu-vung',
      title: 'Từ vựng',
      items: [
        { q: '「{改札|かいさつ}」 là:', options: ['Cổng soát vé', 'Đồn công an', 'Trạm xe buýt', 'Hòm thư'], correct: 0, why: 'かいさつ = cổng soát vé.' },
        { q: '「{交番|こうばん}」 là:', options: ['Bưu điện', 'Đồn công an khu vực', 'Ngân hàng', 'Máy bán hàng'], correct: 1, why: 'こうばん = đồn công an khu vực.' },
        { q: 'Máy bán hàng tự động là:', options: ['{電子|でんし}レンジ', '{冷蔵庫|れいぞうこ}', '{自動販売機|じどうはんばいき}', 'ポスト'], correct: 2, why: '**{自動販売機|じどうはんばいき}**.' },
        { q: '「{隣|となり}」 và 「{横|よこ}」 đều là:', options: ['trước', 'sau', 'bên cạnh', 'ở giữa'], correct: 2, why: 'Cả hai = bên cạnh; {隣|となり} = sát bên, cùng loại.' },
        { q: '「{後|うし}ろ」 là:', options: ['trước', 'sau', 'trên', 'ngoài'], correct: 1, why: 'うしろ = phía sau.' },
        { q: '「{間|あいだ}」 là:', options: ['giữa', 'trong', 'gần', 'dưới'], correct: 0, why: 'あいだ = ở giữa (hai thứ).' },
        { q: 'Tủ lạnh là:', options: ['{電子|でんし}レンジ', '{冷蔵庫|れいぞうこ}', 'テーブル', '{台所|だいどころ}'], correct: 1, why: '**{冷蔵庫|れいぞうこ}** れいぞうこ.' },
        { q: '「しょうゆ」 là:', options: ['Muối', 'Đường', 'Xì dầu', 'Nước sốt'], correct: 2, why: 'しょうゆ = xì dầu.' },
        { q: 'Cái nĩa là:', options: ['スプーン', 'ナイフ', 'フォーク', 'はし'], correct: 2, why: '**フォーク**.' },
        { q: '「{貸|か}します」 là:', options: ['Mượn', 'Cho mượn', 'Trả lại', 'Mua'], correct: 1, why: 'かします = CHO mượn; mượn = {借|か}ります.' },
        { q: '「{手伝|てつだ}います」 là:', options: ['Giúp đỡ', 'Dạy', 'Cầm', 'Dùng'], correct: 0, why: 'てつだいます = giúp.' },
        { q: '「{弾|ひ}きます」 dùng với:', options: ['{歌|うた}', 'ギター', 'たばこ', '{電話|でんわ}'], correct: 1, why: 'ギターを**{弾|ひ}きます**; {歌|うた}を{歌|うた}います; たばこを{吸|す}います; {電話|でんわ}をかけます.' },
        { q: '「{電話|でんわ}を＿」', options: ['{弾|ひ}きます', 'かけます', '{吸|す}います', '{置|お}きます'], correct: 1, why: '{電話|でんわ}を**かけます** = gọi điện.' },
        { q: 'Trái nghĩa với {開|あ}けます:', options: ['{入|い}れます', '{出|だ}します', '{閉|し}めます', '{置|お}きます'], correct: 2, why: 'あけます (mở) ↔ **しめます** (đóng).' },
        { q: 'Chủ nhà nói với khách "Hãy mang bia đến":', options: ['ビールを{持|も}って{行|い}ってください', 'ビールを{持|も}って{来|き}てください', 'ビールを{持|も}ってください', 'ビールを{取|と}りましょうか'], correct: 1, why: 'Mang về phía người nói → **{持|も}って{来|き}ます**.' },
        { q: 'Khi nhận điện thoại, bạn nói:', options: ['すみませんが', 'もしもし', 'いいですよ', 'ああ'], correct: 1, why: '**もしもし** = a lô.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b7-bt-hoi-dap',
      title: 'Chọn câu trả lời đúng cho câu hỏi',
      items: [
        { q: '{今|いま}、どこにいますか。', options: ['{駅|えき}の{前|まえ}にあります。', '{駅|えき}の{前|まえ}にいます。', '{駅|えき}の{前|まえ}ですか。', '{駅|えき}がいます。'], correct: 1, why: 'Người → **います**.' },
        { q: '{近|ちか}くに{何|なに}がありますか。', options: ['コンビニにあります。', 'コンビニがあります。', 'コンビニはいます。', 'はい、あります。'], correct: 1, why: '{何|なに}が → **N が あります**.' },
        { q: 'Bさん、{塩|しお}を{取|と}ってください。', options: ['{塩|しお}はどれですか。', '{塩|しお}はどのですか。', 'どれ{塩|しお}ですか。', '{塩|しお}はだれですか。'], correct: 0, why: 'Hỏi lại cái nào → **どれ** (ポイント 70).' },
        { q: 'お{皿|さら}を{洗|あら}ってください。', options: ['どれお{皿|さら}ですか。', 'どのお{皿|さら}ですか。', 'お{皿|さら}はどのですか。', 'どこお{皿|さら}ですか。'], correct: 1, why: '**どの** + danh từ (ポイント 69).' },
        { q: '{手伝|てつだ}いましょうか。', options: ['はい、{手伝|てつだ}いましょう。', 'ありがとうございます。お{願|ねが}いします。', 'いいえ、{手伝|てつだ}いません。', 'どういたしまして。'], correct: 1, why: 'Nhận lời đề nghị giúp → **ありがとうございます／お{願|ねが}いします**.' },
        { q: 'マルコさんは{何|なに}をしていますか。', options: ['たばこです。', '{外|そと}でたばこを{吸|す}っています。', '{外|そと}にたばこを{吸|す}います。', 'はい、{吸|す}っています。'], correct: 1, why: 'Đang làm → **～ています**, nơi làm → **で**.' },
        { q: '{誰|だれ}がこのケーキを{作|つく}りましたか。', options: ['ワンさんは{作|つく}りました。', 'ワンさんが{作|つく}りました。', 'ワンさんを{作|つく}りました。', 'はい、{作|つく}りました。'], correct: 1, why: '{誰|だれ}が → **N が** (ポイント 68).' },
        { q: 'ビールはまだありますか。 (đã hết)', options: ['いいえ、まだありません。', 'いいえ、もうありません。', 'はい、もうあります。', 'いいえ、まだです。'], correct: 1, why: 'Hết → **もうありません** (ポイント 67).' },
        { q: 'カレーの{作|つく}り{方|かた}を{教|おし}えてください。 (bạn không biết)', options: ['いいですよ。', 'すみません。{私|わたし}もわかりませんから、ワンさんに{聞|き}いてください。', 'はい、{作|つく}ります。', 'どうぞ。'], correct: 1, why: 'Không biết → xin lỗi + chỉ người khác (mẫu 言ってみよう 3).' },
        { q: 'すしは{何|なに}で{食|た}べますか。', options: ['はしで{食|た}べます。', 'はしを{食|た}べます。', 'はしに{食|た}べます。', 'はしです。'], correct: 0, why: 'Dụng cụ → **で** (ポイント 71).' },
      ],
    },
    {
      t: 'build',
      id: 'b7-bt-ghep',
      title: 'Ghép câu — một buổi tiệc từ đầu đến cuối',
      items: [
        { vi: 'A lô, bây giờ bạn đang ở đâu?', chips: ['もしもし、', '{今|いま}、', 'どこに', 'いますか', 'ありますか', 'どこで'], answer: ['もしもし、', '{今|いま}、', 'どこに', 'いますか'], ro: 'Moshimoshi, ima, doko ni imasu ka.' },
        { vi: 'Mình ở trước cổng soát vé.', chips: ['{改札|かいさつ}の', '{前|まえ}に', 'います', 'あります', '{前|まえ}で'], answer: ['{改札|かいさつ}の', '{前|まえ}に', 'います'], ro: 'Kaisatsu no mae ni imasu.' },
        { vi: 'Gần đó có đồn công an và máy bán hàng tự động.', chips: ['{近|ちか}くに', '{交番|こうばん}と', '{自動販売機|じどうはんばいき}が', 'あります', 'います', 'は'], answer: ['{近|ちか}くに', '{交番|こうばん}と', '{自動販売機|じどうはんばいき}が', 'あります'], ro: 'Chikaku ni kouban to jidou hanbaiki ga arimasu.' },
        { vi: 'Hãy cho bia vào tủ lạnh.', chips: ['ビールを', '{冷蔵庫|れいぞうこ}に', '{入|い}れて', 'ください', '{入|はい}って', 'から'], answer: ['ビールを', '{冷蔵庫|れいぞうこ}に', '{入|い}れて', 'ください'], ro: 'Biiru o reizouko ni irete kudasai.' },
        { vi: 'Hãy mang ghế sang phòng bên kia.', chips: ['いすを', '{向|む}こうの{部屋|へや}へ', '{持|も}って', '{行|い}って', 'ください', '{来|き}て'], answer: ['いすを', '{向|む}こうの{部屋|へや}へ', '{持|も}って', '{行|い}って', 'ください'], ro: 'Isu o mukou no heya e motte itte kudasai.' },
        { vi: 'Carlos đang chơi guitar.', chips: ['カルロスさんは', 'ギターを', '{弾|ひ}いて', 'います', '{弾|ひ}きて', '{歌|うた}って'], answer: ['カルロスさんは', 'ギターを', '{弾|ひ}いて', 'います'], ro: 'Karurosu-san wa gitaa o hiite imasu.' },
        { vi: 'Để tôi lấy đồ ăn cho nhé?', chips: ['{料理|りょうり}を', '{取|と}り', 'ましょうか', 'ませんか', '{取|と}って'], answer: ['{料理|りょうり}を', '{取|と}り', 'ましょうか'], ro: 'Ryouri o torimashou ka.' },
        { vi: 'Pizza này ai làm vậy?', chips: ['このピザは', '{誰|だれ}が', '{作|つく}りましたか', '{誰|だれ}は', 'どれが'], answer: ['このピザは', '{誰|だれ}が', '{作|つく}りましたか'], ro: 'Kono piza wa dare ga tsukurimashita ka.' },
        { vi: 'Rượu vang hết rồi. Bia thì sao?', chips: ['ワインは', 'もう', 'ありません。', 'ビールは', 'どうですか', 'まだ'], answer: ['ワインは', 'もう', 'ありません。', 'ビールは', 'どうですか'], ro: 'Wain wa mou arimasen. Biiru wa dou desu ka.' },
        { vi: 'Người Việt ăn phở bằng đũa và thìa.', chips: ['ベトナム{人|じん}は', 'はしと', 'スプーンで', 'フォーを', '{食|た}べます', 'スプーンを'], answer: ['ベトナム{人|じん}は', 'はしと', 'スプーンで', 'フォーを', '{食|た}べます'], alt: [['ベトナム{人|じん}は', 'フォーを', 'はしと', 'スプーンで', '{食|た}べます']], ro: 'Betonamujin wa hashi to supuun de foo o tabemasu.' },
      ],
    },
  ],
};

export const BAI_7: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, KANJI, NGHE, NOI, BAI_TAP];

/* ══════════════════════ 📖 THEO SÁCH — BÀI 7 (trang 117–136) ══════════════════════
 * Cùng khuôn với ./sach2.ts: mỗi trang = tiêu đề (số trang + mục) → tả tranh bằng lời
 * của mình + mục tiêu できる → cô hỏi–bạn đáp → mẹo trả lời → câu mẫu cho từng số của
 * 言ってみよう. KHÔNG chép sách; KHÔNG ghi đáp án CD (やってみよう). Người học mẫu: ミン.
 * Chỗ tranh khó đoán (vd. p.125 ③④, p.131 ①③) ghi rõ "theo tranh" — nói theo cái cô chỉ. */

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
    'Không nghe rõ câu cô hỏi: nói **もう{一度|いちど}お{願|ねが}いします** (mou ichido onegaishimasu — xin cô nói lại một lần nữa).',
    'Bài nghe やってみよう: ở đây KHÔNG ghi đáp án CD — chỉ ghi cần bắt từ nào. Nghe trên lớp rồi tự điền.',
    'Chỗ nào có tên ミン (Minh), ハノイ (Hà Nội), FPT{大学|だいがく}… là thông tin mẫu — thay bằng thông tin THẬT của bạn.',
  ],
};

export const SACH_7: Lesson = {
  id: 'b7-sach',
  kind: 'review',
  title: 'Theo sách — Bài 7 (trang 117–136)',
  goal: 'Nhìn tranh phố, tranh căn bếp và tranh bữa tiệc trong sách là nói được ai / cái gì ở đâu, nhờ bạn làm việc, hỏi "cái nào?", nói ai đang làm gì, đề nghị giúp, hỏi ai làm món này và món đó còn không.',
  minutes: 70,
  blocks: [
    CACH_DUNG,

    ...trang(
      'Trang 117 · 話してみよう・聞いてみよう — Mở bài 友達の家で',
      '**話してみよう** — 4 tranh không lời: (1) ở ga, một cô gái vẫy tay gọi đôi bạn nam nữ vừa đi qua **cổng soát vé**; (2) ba bạn trẻ chơi trò rút gỗ xếp tháp, cười vui; (3) một nhóm bạn ngồi quanh nồi lẩu/đồ nướng trên bàn, vừa ăn vừa nói chuyện; (4) hình trang trí hai khuôn mặt đeo kính, đội mũ tiệc chóp nhọn. Mục đích: nói về việc **đến nhà bạn chơi, dự tiệc**. **聞いてみよう**: nghe trước đoạn hội thoại của bài (một buổi tối ở ký túc xá của Park: có người giúp nấu ăn, có người gọi điện vì lạc đường, có người hỏi ai làm bánh) — chính là trang 136.',
      [
        C('（tranh 1）ここはどこですか。', '(tranh 1) Koko wa doko desu ka.', '(tranh 1) Đây là đâu?'),
        S('{駅|えき}です。{改札|かいさつ}の{前|まえ}です。', 'Eki desu. Kaisatsu no mae desu.', 'Là nhà ga. Trước cổng soát vé.'),
        C('（tranh 3）{何|なに}をしていますか。', '(tranh 3) Nani o shite imasu ka.', '(tranh 3) Họ đang làm gì?'),
        S('{友達|ともだち}のうちでパーティーをしています。', 'Tomodachi no uchi de paatii o shite imasu.', 'Họ đang tổ chức tiệc ở nhà bạn.'),
        C('ミンさんは{友達|ともだち}のうちでパーティーをしますか。', 'Min-san wa tomodachi no uchi de paatii o shimasu ka.', 'Minh có hay tiệc tùng ở nhà bạn không?'),
        S('はい、ときどきします。', 'Hai, tokidoki shimasu.', 'Có ạ, thỉnh thoảng.'),
      ],
      [
        'Câu hỏi 「{何|なに}をしていますか」 = đang làm gì → trả lời bằng **～ています** (ポイント 64). Mẫu: ～でパーティーをしています.',
        'Xem **Hội thoại · Bức tranh chung của bài** và **Ngữ pháp · ポイント 64**.',
      ],
    ),

    ...trang(
      'Trang 118–119 · チャレンジ! 道がわかりません',
      'Trang 118: một phố có hiệu sách "本 BOOKS" và một ngân hàng; một người đàn ông đeo kính dắt chó đang chỉ tay cho một phụ nữ đeo túi — cô ấy **lạc đường** trên đường đến nhà bạn. Ô (1): cô hỏi tên ngân hàng kèm dấu "?", ô bên cạnh người đàn ông chỉ về phía biển hiệu. Trang 119: một cô gái đứng cạnh cửa hàng tiện lợi, cầm điện thoại, mặt bối rối; bong bóng phía trên là người bạn đang ở trong bếp, cũng cầm điện thoại và đang trộn đồ trong bát. Ô (2): người bạn không biết cô đang ở đâu → hỏi; cô đứng trước cửa hàng tiện lợi. Ô (3): hỏi gần đó có gì → một ngôi chùa/đền nhỏ và toà thị chính. **Mục tiêu できる:** khi lạc đường, hỏi được chỗ mình muốn đến ở đâu, và nói được mình đang ở đâu.',
      [
        C('すみません。{銀行|ぎんこう}はどこにありますか。', 'Sumimasen. Ginkou wa doko ni arimasu ka.', 'Xin lỗi, ngân hàng ở đâu ạ? (cô đóng vai người lạc)'),
        S('あの{本屋|ほんや}の{隣|となり}にありますよ。', 'Ano hon-ya no tonari ni arimasu yo.', 'Ở cạnh hiệu sách kia đấy ạ.'),
        C('もしもし、ミンさん、{今|いま}、どこにいますか。', 'Moshimoshi, Min-san, ima, doko ni imasu ka.', 'A lô, Minh, bây giờ em đang ở đâu?'),
        S('コンビニの{前|まえ}にいます。', 'Konbini no mae ni imasu.', 'Em đang ở trước cửa hàng tiện lợi.'),
        C('{近|ちか}くに{何|なに}がありますか。', 'Chikaku ni nani ga arimasu ka.', 'Gần đó có gì?'),
        S('お{寺|てら}と{市役所|しやくしょ}があります。', 'Otera to shiyakusho ga arimasu.', 'Có ngôi chùa và toà thị chính. (お{寺|てら}, {市役所|しやくしょ} — từ thêm)'),
      ],
      [
        '**ポイント 61** N1 **は** nơi **に** います／あります (N1 ở đâu) · **ポイント 62** nơi **に** N **が** います／あります (ở đó có gì).',
        'Người → **います** ({私|わたし}はコンビニの{前|まえ}にいます); đồ vật / toà nhà → **あります**.',
        'Hỏi đường người lạ: mở đầu **あのう、すみません**; nghe xong nhắc lại + **ですね** rồi **ありがとうございます**.',
        'Xem **Hội thoại · ① 道がわかりません** và **Ngữ pháp · ポイント 61, 62**.',
      ],
    ),

    ...trang(
      'Trang 120 · 言ってみよう (chủ đề 1) — Số 1: ~ ở đâu? · Số 2: bạn đang ở đâu?',
      '**Số 1:** hỏi người đi đường "~ ở đâu?" rồi cảm ơn, trên một bản đồ phố: 例 đồn công an (ở sau một toà nhà), ① trạm xe buýt, ② bưu điện, ③ ngân hàng (tầng dưới một toà nhà văn phòng), ④ nhà hàng (trong một toà nhà), ⑤ hiệu sách (trong một toà nhà khác). **Số 2:** qua điện thoại hỏi "giờ bạn ở đâu?" → trả lời vị trí → "vậy mình đến đó": cảnh cổng Tây một nhà ga — 例 **trước** đồn công an, ① **trong** hiệu sách, ② **dưới** đồng hồ của ga, ③ **ngoài** ga, ④ **cạnh** một hòm thư/máy tự động. (Vị trí chính xác từng số: nhìn tranh — câu mẫu dưới dùng mốc hợp lý.)',
      [
        C('（số 1 ②）すみません。{郵便局|ゆうびんきょく}はどこにありますか。', '(số 1, 2) Sumimasen. Yuubinkyoku wa doko ni arimasu ka.', '(số 1 ②) Xin lỗi, bưu điện ở đâu ạ?'),
        S('{郵便局|ゆうびんきょく}ですか。あのビルの{前|まえ}にありますよ。', 'Yuubinkyoku desu ka. Ano biru no mae ni arimasu yo.', 'Bưu điện ạ? Ở trước toà nhà kia ạ.'),
        C('ありがとうございます。', 'Arigatou gozaimasu.', 'Cảm ơn em.'),
        C('（số 2 ①）もしもし、ミンさん、{今|いま}、どこにいますか。', '(số 2, 1) Moshimoshi, Min-san, ima, doko ni imasu ka.', '(số 2 ①) A lô, Minh, em đang ở đâu?'),
        S('{本屋|ほんや}の{中|なか}にいます。', 'Hon-ya no naka ni imasu.', 'Em ở trong hiệu sách.'),
        C('じゃ、そこへ{行|い}きます。', 'Ja, soko e ikimasu.', 'Vậy cô đến đó.'),
      ],
      [
        'Hỏi vị trí: **N は どこに ありますか** → trả lời bỏ N: **(mốc) の (vị trí) に あります**. Thêm **よ** khi chỉ đường cho người lạ — tự nhiên hơn.',
        'Số 2 là **người** → **います**. Công thức: **(mốc) の {前|まえ}／{中|なか}／{下|した}／{外|そと}／{横|よこ} に います**.',
        '{外|そと} đứng một mình cũng được: **{駅|えき}の{外|そと}にいます** hoặc **{外|そと}にいます**.',
        'Xem **Ngữ pháp · ポイント 61 — Công thức vị trí** và **Luyện nói · Tranh 3 — bản đồ phố**.',
      ],
      [
        mau([
          E('あのう、すみません。{交番|こうばん}はどこにありますか。— あ、{交番|こうばん}ですか。あのビルの{後|うし}ろにありますよ。— ありがとうございます。', 'Anou, sumimasen. Kouban wa doko ni arimasu ka. — A, kouban desu ka. Ano biru no ushiro ni arimasu yo. — Arigatou gozaimasu.', 'Số 1 例 — đồn công an.'),
          E('バス{停|てい}はどこにありますか。— {交番|こうばん}の{前|まえ}にありますよ。', 'Basutei wa doko ni arimasu ka. — Kouban no mae ni arimasu yo.', 'Số 1 ① — trạm xe buýt (theo tranh: gần đồn).'),
          E('{郵便局|ゆうびんきょく}はどこにありますか。— あのビルの{前|まえ}にありますよ。', 'Yuubinkyoku wa doko ni arimasu ka. — Ano biru no mae ni arimasu yo.', 'Số 1 ② — bưu điện.'),
          E('{銀行|ぎんこう}はどこにありますか。— あのビルの{中|なか}にありますよ。', 'Ginkou wa doko ni arimasu ka. — Ano biru no naka ni arimasu yo.', 'Số 1 ③ — ngân hàng (tầng dưới toà nhà).'),
          E('レストランはどこにありますか。— あのビルの{中|なか}にありますよ。', 'Resutoran wa doko ni arimasu ka. — Ano biru no naka ni arimasu yo.', 'Số 1 ④ — nhà hàng.'),
          E('{本屋|ほんや}はどこにありますか。— あの{白|しろ}いビルの{中|なか}にありますよ。', 'Hon-ya wa doko ni arimasu ka. — Ano shiroi biru no naka ni arimasu yo.', 'Số 1 ⑤ — hiệu sách (toà nhà khác).'),
          E('もしもし、Bさん、{今|いま}、どこにいますか。— {交番|こうばん}の{前|まえ}にいます。— じゃ、そこへ{行|い}きます。', 'Moshimoshi, B-san, ima, doko ni imasu ka. — Kouban no mae ni imasu. — Ja, soko e ikimasu.', 'Số 2 例 — trước.'),
          E('{本屋|ほんや}の{中|なか}にいます。', 'Hon-ya no naka ni imasu.', 'Số 2 ① — trong.'),
          E('{駅|えき}の{時計|とけい}の{下|した}にいます。', 'Eki no tokei no shita ni imasu.', 'Số 2 ② — dưới (đồng hồ).'),
          E('{駅|えき}の{外|そと}にいます。', 'Eki no soto ni imasu.', 'Số 2 ③ — ngoài.'),
          E('ポストの{横|よこ}にいます。', 'Posuto no yoko ni imasu.', 'Số 2 ④ — cạnh.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 121 · 言ってみよう số 3 · やってみよう · ロールプレイ (chủ đề 1)',
      '**Số 3:** cuộc gọi đầy đủ: "Bạn ở đâu?" → "Mình ở trước ~" → "Hả? Gần đó có gì?" → "Có ~" → "Hiểu rồi, mình đi đón ngay". 5 tranh quanh ga さくら: 例 trước ga, gần đó có siêu thị lớn; ① trước đồn cảnh sát cạnh cổng Tây; ② trước một cửa hàng đồng giá cạnh quán cà phê; ③ trước một ngân hàng, bên cạnh có hiệu sách; ④ cạnh một biển báo có mái che, gần cây xanh. **やってみよう:** bản đồ nhiều ô phố (quán cà phê, công viên, cửa hàng tiện lợi, ATM, cửa hàng quần áo, hiệu sách, ga さくら) — nghe CD, tìm chỗ hai người gặp nhau. **ロールプレイ:** B chọn một chỗ trên bản đồ và đứng đợi; A gọi điện hỏi tới khi tìm ra B.',
      [
        C('もしもし、ミンさん、{今|いま}、どこにいますか。', 'Moshimoshi, Min-san, ima, doko ni imasu ka.', 'A lô, Minh, em đang ở đâu?'),
        S('{駅|えき}の{前|まえ}にいます。', 'Eki no mae ni imasu.', 'Em ở trước ga.'),
        C('えっ？ {近|ちか}くに{何|なに}がありますか。', 'E? Chikaku ni nani ga arimasu ka.', 'Hả? Gần đó có gì?'),
        S('{大|おお}きいスーパーがあります。', 'Ookii suupaa ga arimasu.', 'Có một siêu thị lớn.'),
        C('わかりました。{今|いま}、{迎|むか}えに{行|い}きます。', 'Wakarimashita. Ima, mukae ni ikimasu.', 'Cô hiểu rồi. Cô đi đón em ngay.'),
        S('ありがとうございます。お{願|ねが}いします。', 'Arigatou gozaimasu. Onegaishimasu.', 'Em cảm ơn cô. Nhờ cô ạ.'),
      ],
      [
        '「{近|ちか}くに{何|なに}がありますか」 → **N が あります** (ポイント 62). Nói thêm một mốc thứ hai cho chắc: **N の{隣|となり}に N2 があります**.',
        '**{迎|むか}えに{行|い}きます** = đi đón — câu chốt của người ở nhà.',
        'やってみよう: bắt cụm **～の{前|まえ}／{隣|となり}／{近|ちか}く** + tên cửa hàng; người nói hay sửa lại vị trí sau えっ？ — lấy thông tin cuối. Không có đáp án CD ở đây.',
        'Luyện: **Luyện nghe · Bài 1 — Hai người gặp nhau ở đâu?** và **Luyện nói · Vai 1 — B lạc đường**.',
      ],
      [
        mau([
          E('もしもし、Bさん、{今|いま}、どこにいますか。— {駅|えき}の{前|まえ}にいます。— えっ？ {近|ちか}くに{何|なに}がありますか。— {大|おお}きいスーパーがあります。— わかりました。{今|いま}、{迎|むか}えに{行|い}きます。', 'Moshimoshi, B-san, ima, doko ni imasu ka. — Eki no mae ni imasu. — E? Chikaku ni nani ga arimasu ka. — Ookii suupaa ga arimasu. — Wakarimashita. Ima, mukae ni ikimasu.', 'Số 3 例.'),
          E('{交番|こうばん}の{前|まえ}にいます。— {近|ちか}くに{何|なに}がありますか。— {駅|えき}の{西口|にしぐち}があります。', 'Kouban no mae ni imasu. — Chikaku ni nani ga arimasu ka. — Eki no nishiguchi ga arimasu.', 'Số 3 ① — trước đồn, gần cửa Tây ga ({西口|にしぐち} — từ thêm).'),
          E('{店|みせ}の{前|まえ}にいます。— {近|ちか}くに{何|なに}がありますか。— {喫茶店|きっさてん}があります。', 'Mise no mae ni imasu. — Chikaku ni nani ga arimasu ka. — Kissaten ga arimasu.', 'Số 3 ② — trước cửa hàng, gần quán cà phê.'),
          E('{銀行|ぎんこう}の{前|まえ}にいます。— {近|ちか}くに{何|なに}がありますか。— {銀行|ぎんこう}の{隣|となり}に{本屋|ほんや}があります。', 'Ginkou no mae ni imasu. — Chikaku ni nani ga arimasu ka. — Ginkou no tonari ni hon-ya ga arimasu.', 'Số 3 ③ — trước ngân hàng, cạnh có hiệu sách.'),
          E('バス{停|てい}の{横|よこ}にいます。— {近|ちか}くに{何|なに}がありますか。— {大|おお}きい{木|き}があります。', 'Basutei no yoko ni imasu. — Chikaku ni nani ga arimasu ka. — Ookii ki ga arimasu.', 'Số 3 ④ — cạnh biển báo (theo tranh), gần cây to.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 122–123 · チャレンジ! パーティーの準備',
      'Trang 122: trong một căn bếp, mọi người đang **chuẩn bị tiệc** — một đôi nam nữ chuyền bát salad cho nhau, một cô gái tóc buộc hai bên cầm khối bánh mì/phô mai, một phụ nữ tóc xoăn trộn salad trong bát lớn; phía sau là hai thùng bia chồng lên nhau. Ô (1): một phụ nữ đang nấu, khuấy bát, cạnh chai gia vị; ô (2): tay cắt bánh mì trên thớt bằng dao. Trang 123: một phụ nữ đưa lọ gia vị cho một người đàn ông, người khác cầm tờ thực đơn, một người giơ tay, một người chỉ lên kệ đĩa. Ô (3): hình cà ri + rau đã cắt → "?" → đĩa cà ri — không biết **cách nấu**; ô (4): người đàn ông chỉ lên kệ đĩa, bong bóng cái đĩa với dấu "?" — **đĩa nào?**; ô (5): một phụ nữ cầm bát hỏi về **muối** giữa ba lọ gia vị — **lọ nào?** **Mục tiêu できる:** khi chuẩn bị tiệc, nhờ vả hoặc chỉ dẫn người khác làm việc.',
      [
        C('ミンさん、{野菜|やさい}を{洗|あら}ってください。', 'Min-san, yasai o aratte kudasai.', 'Minh, rửa rau giúp cô.'),
        S('はい。', 'Hai.', 'Vâng ạ.'),
        C('（ô 3）カレーの{作|つく}り{方|かた}がわかりますか。', '(ô 3) Karee no tsukurikata ga wakarimasu ka.', '(ô 3) Em có biết cách nấu cà ri không?'),
        S('いいえ、わかりません。{作|つく}り{方|かた}を{教|おし}えてください。', 'Iie, wakarimasen. Tsukurikata o oshiete kudasai.', 'Không ạ. Cô chỉ em cách nấu với ạ.'),
        C('（ô 4）お{皿|さら}を{取|と}ってください。', '(ô 4) Osara o totte kudasai.', '(ô 4) Lấy giúp cô cái đĩa.'),
        S('どのお{皿|さら}ですか。', 'Dono osara desu ka.', 'Đĩa nào ạ?'),
        C('（ô 5）{塩|しお}を{取|と}ってください。', '(ô 5) Shio o totte kudasai.', '(ô 5) Lấy giúp cô lọ muối.'),
        S('{塩|しお}はどれですか。', 'Shio wa dore desu ka.', 'Muối là lọ nào ạ?'),
      ],
      [
        '**ポイント 63** Vて + ください (nhờ) — trước hết phải chia được **thể て** (xem **Ngữ pháp · Thể て**). **ポイント 66** Nの V(bỏ ます)方 (cách làm). **ポイント 69** どのN · **ポイント 70** どれ. **ポイント 71** N(dụng cụ)で.',
        'Được nhờ: đáp **はい** là đủ. Không biết cách làm: **すみません。{私|わたし}もわかりませんから、～さんに{聞|き}いてください**.',
        'どの **luôn có danh từ theo sau** (どのお{皿|さら}); どれ **đứng một mình** ({塩|しお}はどれですか).',
        'Xem **Hội thoại · ② パーティーの準備**.',
      ],
    ),

    ...trang(
      'Trang 124 · 言ってみよう (chủ đề 2) — Số 1, 2: nhờ làm việc (～てください, Nで)',
      '**Số 1** — "B ơi, hãy V" → "Vâng": 例1 rửa hoa quả (bồn rửa, bát trái cây). **Số 2** — nhờ làm việc **bằng dụng cụ**: 例2 viết tên lên thẻ bằng bút. Tranh lớn là căn bếp đang chuẩn bị tiệc, các ô đánh số: ① hai đứa trẻ đứng cạnh nhau; ② một người chuyển đĩa sang bàn/ghế (mũi tên); ③ một người bưng khay đồ uống sang bàn khác; ④ tay cắt bánh mì bằng dao. Còn có một bé trai cầm điều khiển đồ chơi, một bé gái xếp hộp, người lớn bưng gà quay, trái cây, tủ lạnh lớn giữa bếp. (Động từ cho ①–③ đoán theo tranh — nói theo việc cô chỉ.)',
      [
        C('ミンさん、{果物|くだもの}を{洗|あら}ってください。', 'Min-san, kudamono o aratte kudasai.', 'Minh, rửa hoa quả giúp cô.'),
        S('はい。', 'Hai.', 'Vâng ạ.'),
        C('ペンで{名前|なまえ}を{書|か}いてください。', 'Pen de namae o kaite kudasai.', 'Viết tên bằng bút nhé.'),
        S('はい。カタカナで{書|か}きますか。', 'Hai. Katakana de kakimasu ka.', 'Vâng. Viết bằng katakana ạ?'),
        C('ええ、カタカナで{書|か}いてください。', 'Ee, katakana de kaite kudasai.', 'Ừ, viết bằng katakana.'),
        C('（④）じゃ、ミンさん、{何|なに}を{頼|たの}みますか。', '(4) Ja, Min-san, nani o tanomimasu ka.', '(④) Vậy Minh, em nhờ bạn làm gì? ({頼|たの}みます — nhờ, từ thêm)'),
        S('Aさん、ナイフでパンを{切|き}ってください。', 'A-san, naifu de pan o kitte kudasai.', 'A ơi, cắt bánh mì bằng dao giúp mình.'),
      ],
      [
        'Chia thể て đúng là 80% điểm câu này: {洗|あら}います → **{洗|あら}って**, {書|か}きます → **{書|か}いて**, {切|き}ります → **{切|き}って**, {置|お}きます → **{置|お}いて**, {持|も}って{行|い}きます → **{持|も}って{行|い}って**.',
        'Dụng cụ đứng đầu với **で**: **ナイフで**パンを{切|き}ってください, **ペンで**{名前|なまえ}を{書|か}いてください.',
        'Xem **Ngữ pháp · ポイント 63, 71** và **Bài tập · Chia thể て**.',
      ],
      [
        mau([
          E('Bさん、{果物|くだもの}を{洗|あら}ってください。— はい。', 'B-san, kudamono o aratte kudasai. — Hai.', '例1 — rửa hoa quả.'),
          E('Bさん、ペンで{名前|なまえ}を{書|か}いてください。— はい。', 'B-san, pen de namae o kaite kudasai. — Hai.', '例2 — viết tên bằng bút.'),
          E('Bさん、{子|こ}どもと{遊|あそ}んでください。— はい。', 'B-san, kodomo to asonde kudasai. — Hai.', '① (theo tranh) — chơi với bọn trẻ ({子|こ}ども — trẻ con).'),
          E('Bさん、お{皿|さら}をテーブルに{置|お}いてください。— はい。', 'B-san, osara o teeburu ni oite kudasai. — Hai.', '② (theo tranh) — đặt đĩa lên bàn.'),
          E('Bさん、{飲|の}み{物|もの}を{向|む}こうのテーブルへ{持|も}って{行|い}ってください。— はい。', 'B-san, nomimono o mukou no teeburu e motte itte kudasai. — Hai.', '③ (theo tranh) — mang đồ uống sang bàn bên kia.'),
          E('Bさん、ナイフでパンを{切|き}ってください。— はい。', 'B-san, naifu de pan o kitte kudasai. — Hai.', '④ — cắt bánh mì bằng dao.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 125 · 言ってみよう số 3, 4 — Hỏi cách làm · "Cái nào?"',
      '**Số 3:** "Tôi không biết cách V N. Xin lỗi, chỉ tôi cách V với" → hai nhánh: B cũng không biết, bảo hỏi C / B nhận lời "được thôi". Gợi ý: 例 cà ri・nấu, ① rau・cắt, ② lò vi sóng・dùng, ③ súp・nấu (ô nhỏ: lò vi sóng "?" → bát cơm). **Số 4:** "B ơi, lấy giúp cái đĩa" → "Đĩa nào?" → "Cái đĩa đó" → "À, cái này à. Đây". Tranh bếp và bàn tiệc: ① người đứng trước kệ, bong bóng cái **thìa**; ② người chỉ lên ghế, bong bóng **đũa**; ③ vòi nước, chậu rửa có **cốc**; ④ tay chỉ xuống mặt bàn. (Đồ vật ③④ đoán theo tranh.)',
      [
        C('（①）{野菜|やさい}の{切|き}り{方|かた}がわかりません。すみませんが、{切|き}り{方|かた}を{教|おし}えてください。', '(1) Yasai no kirikata ga wakarimasen. Sumimasen ga, kirikata o oshiete kudasai.', '(①) Cô không biết cách cắt rau. Xin lỗi, chỉ cô cách cắt với.'),
        S('すみません。{私|わたし}もわかりませんから、Cさんに{聞|き}いてください。', 'Sumimasen. Watashi mo wakarimasen kara, C-san ni kiite kudasai.', 'Xin lỗi cô. Em cũng không biết, cô hỏi C nhé.'),
        C('（②）{電子|でんし}レンジの{使|つか}い{方|かた}を{教|おし}えてください。', '(2) Denshi renji no tsukaikata o oshiete kudasai.', '(②) Chỉ cô cách dùng lò vi sóng.'),
        S('いいですよ。', 'Ii desu yo.', 'Được ạ.'),
        C('ミンさん、スプーンを{取|と}ってください。', 'Min-san, supuun o totte kudasai.', 'Minh, lấy giúp cô cái thìa.'),
        S('どのスプーンですか。', 'Dono supuun desu ka.', 'Thìa nào ạ?'),
        C('そのスプーンです。', 'Sono supuun desu.', 'Cái thìa đó.'),
        S('ああ、これですか。はい、どうぞ。', 'Aa, kore desu ka. Hai, douzo.', 'À, cái này ạ. Đây ạ.'),
      ],
      [
        'Khung số 3: **N の V(bỏ ます){方|かた} が わかりません** (không biết) → **を {教|おし}えてください** (xin chỉ). Trợ từ đổi が → を theo động từ.',
        'Số 4: người nhờ nói **その**～ (gần người được nhờ) → người được nhờ cầm lên nói **これ**ですか. Đừng lặp lại ~~そのですか~~.',
        'Xem **Ngữ pháp · ポイント 66, 69** và **Hội thoại · "Cái nào?"**.',
      ],
      [
        mau([
          E('カレーの{作|つく}り{方|かた}がわかりません。すみませんが、{作|つく}り{方|かた}を{教|おし}えてください。— すみません。{私|わたし}もわかりませんから、Cさんに{聞|き}いてください。／いいですよ。', 'Karee no tsukurikata ga wakarimasen. Sumimasen ga, tsukurikata o oshiete kudasai. — Sumimasen. Watashi mo wakarimasen kara, C-san ni kiite kudasai. / Ii desu yo.', 'Số 3 例 — hai nhánh.'),
          E('{野菜|やさい}の{切|き}り{方|かた}がわかりません。{切|き}り{方|かた}を{教|おし}えてください。', 'Yasai no kirikata ga wakarimasen. Kirikata o oshiete kudasai.', 'Số 3 ① — cách cắt rau.'),
          E('{電子|でんし}レンジの{使|つか}い{方|かた}がわかりません。{使|つか}い{方|かた}を{教|おし}えてください。', 'Denshi renji no tsukaikata ga wakarimasen. Tsukaikata o oshiete kudasai.', 'Số 3 ② — cách dùng lò vi sóng.'),
          E('スープの{作|つく}り{方|かた}がわかりません。{作|つく}り{方|かた}を{教|おし}えてください。', 'Suupu no tsukurikata ga wakarimasen. Tsukurikata o oshiete kudasai.', 'Số 3 ③ — cách nấu súp.'),
          E('Bさん、お{皿|さら}を{取|と}ってください。— どのお{皿|さら}ですか。— そのお{皿|さら}です。— ああ、これですか。はい。', 'B-san, osara o totte kudasai. — Dono osara desu ka. — Sono osara desu. — Aa, kore desu ka. Hai.', 'Số 4 例 — đĩa.'),
          E('スプーンを{取|と}ってください。— どのスプーンですか。— そのスプーンです。', 'Supuun o totte kudasai. — Dono supuun desu ka. — Sono supuun desu.', 'Số 4 ① — thìa.'),
          E('はしを{取|と}ってください。— どのはしですか。— そのはしです。', 'Hashi o totte kudasai. — Dono hashi desu ka. — Sono hashi desu.', 'Số 4 ② — đũa.'),
          E('コップを{洗|あら}ってください。— どのコップですか。— そのコップです。', 'Koppu o aratte kudasai. — Dono koppu desu ka. — Sono koppu desu.', 'Số 4 ③ (theo tranh) — rửa cốc.'),
          E('テーブルを{持|も}って{来|き}てください。— どのテーブルですか。— そのテーブルです。', 'Teeburu o motte kite kudasai. — Dono teeburu desu ka. — Sono teeburu desu.', 'Số 4 ④ (theo tranh) — cái bàn.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 126 · 言ってみよう số 5 — "~ là cái nào?" (どれ)',
      '**Số 5:** "B ơi, lấy giúp muối" → "Muối là cái nào?" → "Cái đó" → "À, cái này à. Đây" → "Cảm ơn". Tranh bếp, tủ lạnh mở, một phụ nữ đứng giữa bối rối với dấu hỏi lớn: 例 lọ **muối** trên kệ; ① bát **đường**; ② một người đang đi, bong bóng **chiếc điện thoại gập** có tên **キム**; ③ chai **trà** trên kệ tủ lạnh; ④ **cái cốc** có tên **ワン**.',
      [
        C('ミンさん、{砂糖|さとう}を{取|と}ってください。', 'Min-san, satou o totte kudasai.', 'Minh, lấy giúp cô đường.'),
        S('{砂糖|さとう}はどれですか。', 'Satou wa dore desu ka.', 'Đường là cái nào ạ?'),
        C('それです。', 'Sore desu.', 'Cái đó.'),
        S('ああ、これですか。はい、どうぞ。', 'Aa, kore desu ka. Hai, douzo.', 'À, cái này ạ. Đây ạ.'),
        C('どうも。キムさんの{電話|でんわ}も{取|と}ってください。', 'Doumo. Kimu-san no denwa mo totte kudasai.', 'Cảm ơn. Lấy giúp cả điện thoại của Kim nữa.'),
        S('キムさんの{電話|でんわ}はどれですか。', 'Kimu-san no denwa wa dore desu ka.', 'Điện thoại của Kim là cái nào ạ?'),
      ],
      [
        '**N は どれですか** — どれ đứng MỘT MÌNH ở cuối (ポイント 70). Có "của ai" thì giữ nguyên: **キムさんの{電話|でんわ}は**どれですか.',
        'Đáp lại lời cảm ơn ngắn **どうも** — không cần nói gì thêm.',
        'Xem **Ngữ pháp · ポイント 70 — Bộ こ・そ・あ・ど**.',
      ],
      [
        mau([
          E('Bさん、{塩|しお}を{取|と}ってください。— {塩|しお}はどれですか。— それです。— ああ、これですか。はい、どうぞ。— どうも。', 'B-san, shio o totte kudasai. — Shio wa dore desu ka. — Sore desu. — Aa, kore desu ka. Hai, douzo. — Doumo.', 'Số 5 例 — muối.'),
          E('{砂糖|さとう}を{取|と}ってください。— {砂糖|さとう}はどれですか。— それです。', 'Satou o totte kudasai. — Satou wa dore desu ka. — Sore desu.', 'Số 5 ① — đường.'),
          E('キムさんの{電話|でんわ}を{取|と}ってください。— キムさんの{電話|でんわ}はどれですか。— それです。', 'Kimu-san no denwa o totte kudasai. — Kimu-san no denwa wa dore desu ka. — Sore desu.', 'Số 5 ② — điện thoại của Kim.'),
          E('お{茶|ちゃ}を{取|と}ってください。— お{茶|ちゃ}はどれですか。— それです。', 'Ocha o totte kudasai. — Ocha wa dore desu ka. — Sore desu.', 'Số 5 ③ — chai trà.'),
          E('ワンさんのコップを{取|と}ってください。— ワンさんのコップはどれですか。— それです。', 'Wan-san no koppu o totte kudasai. — Wan-san no koppu wa dore desu ka. — Sore desu.', 'Số 5 ④ — cốc của Wang.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 127 · やってみよう・グループで話しましょう (chủ đề 2)',
      '**やってみよう:** ba hình bàn tròn a, b, c bày khác nhau (a: bình hoa + ly; b: đĩa thức ăn ở giữa + ly; c: đĩa thức ăn + nhiều ly nhỏ xung quanh) — nghe CD, chọn phòng tiệc đúng. **■ グループで話しましょう:** tranh "phòng hiện tại" (bếp trống với tủ lạnh, kệ bát đĩa, bàn có ít đồ; phòng lớn với hai bàn thấp) và tranh mẫu nhỏ đã dọn gọn, bàn đã bày bát đĩa, đồ ăn. Nhóm phân việc cho nhau bằng **～てください** cho tới khi phòng giống tranh mẫu.',
      [
        C('ミンさん、テーブルの{上|うえ}に{何|なに}を{置|お}きますか。', 'Min-san, teeburu no ue ni nani o okimasu ka.', 'Minh, đặt gì lên bàn?'),
        S('お{皿|さら}とコップを{置|お}きます。', 'Osara to koppu o okimasu.', 'Đặt đĩa và cốc ạ.'),
        C('じゃ、Aさんに{頼|たの}んでください。', 'Ja, A-san ni tanonde kudasai.', 'Vậy em nhờ A đi.'),
        S('Aさん、お{皿|さら}とコップをテーブルの{上|うえ}に{置|お}いてください。', 'A-san, osara to koppu o teeburu no ue ni oite kudasai.', 'A ơi, đặt đĩa và cốc lên bàn giúp mình.'),
        C('{花|はな}はどこに{置|お}きますか。', 'Hana wa doko ni okimasu ka.', 'Hoa đặt ở đâu?'),
        S('テーブルの{真|ま}ん{中|なか}に{置|お}いてください。', 'Teeburu no mannaka ni oite kudasai.', 'Đặt ở giữa bàn ạ. ({真|ま}ん{中|なか} — chính giữa, từ thêm)'),
      ],
      [
        'Chỉ chỗ đặt: **N を (nơi) に {置|お}いてください** — nơi dùng **に**. Mang đi: **(nơi) へ {持|も}って{行|い}ってください**; mang đến: **{持|も}って{来|き}てください**.',
        'Nghe やってみよう: bắt các từ **{花|はな}, コップ, お{皿|さら}, テーブルの{上|うえ}／{真|ま}ん{中|なか}** — không có đáp án CD ở đây.',
        'Luyện: **Luyện nghe · Bài 2 — Chuẩn bị tiệc** và **Luyện nói · Vai 2**.',
      ],
    ),

    ...trang(
      'Trang 128–129 · チャレンジ! みんなで楽しいパーティー',
      'Trang 128: một thanh niên đứng cạnh cửa kính ban công **hút thuốc**, khói bay lên; phía trước, một thanh niên tóc xoăn ngồi ghế dài, tay chống cằm, vẻ khó chịu. Ô (1): một người thắc mắc (dấu "?") về người đang hút thuốc — **anh ấy đang ở đâu, đang làm gì?**; bên dưới, hai người chụp ảnh tự sướng, một người đứng cạnh nhìn. Ô (2): ba người đứng cạnh nhau, một người giơ máy ảnh — **để tôi chụp cho nhé?** Trang 129: năm người bạn quanh bàn tròn, cầm ly, ăn bánh, nói cười. Ô (3): hai người ăn bánh kem, bong bóng cái bánh "?" và hình một phụ nữ — **ai làm bánh?**; ô (4): hai phụ nữ, bong bóng thùng bia "?" và thùng bia rỗng + bình rượu Nhật — **còn bia không? hết rồi thì sao?** **Mục tiêu できる:** trong bữa tiệc, tự đề nghị giúp đỡ và mời đồ ăn.',
      [
        C('（ô 1）マルコさんはどこにいますか。', '(ô 1) Maruko-san wa doko ni imasu ka.', '(ô 1) Marco ở đâu?'),
        S('{外|そと}にいます。{外|そと}でたばこを{吸|す}っています。', 'Soto ni imasu. Soto de tabako o sutte imasu.', 'Ở ngoài ạ. Đang hút thuốc ở ngoài.'),
        C('（ô 2）{皆|みな}さん、{写真|しゃしん}を{撮|と}っていますね。ミンさんは{何|なに}と{言|い}いますか。', '(ô 2) Minasan, shashin o totte imasu ne. Min-san wa nan to iimasu ka.', '(ô 2) Mọi người đang chụp ảnh nhỉ. Minh sẽ nói gì?'),
        S('{写真|しゃしん}を{撮|と}りましょうか。', 'Shashin o torimashou ka.', 'Để em chụp cho nhé?'),
        C('（ô 3）このケーキ、おいしいですね。{誰|だれ}が{作|つく}りましたか。', '(ô 3) Kono keeki, oishii desu ne. Dare ga tsukurimashita ka.', '(ô 3) Bánh này ngon nhỉ. Ai làm vậy?'),
        S('アンナさんが{作|つく}りました。', 'Anna-san ga tsukurimashita.', 'Anna làm ạ.'),
        C('（ô 4）ビールはまだありますか。', '(ô 4) Biiru wa mada arimasu ka.', '(ô 4) Bia còn không?'),
        S('すみません。もうありません。お{酒|さけ}はどうですか。', 'Sumimasen. Mou arimasen. Osake wa dou desu ka.', 'Xin lỗi cô. Hết rồi ạ. Rượu sake thì sao ạ?'),
      ],
      [
        '**ポイント 64** Vています (đang) · **ポイント 65** Vましょうか (để tôi…) · **ポイント 67** まだ／もう · **ポイント 68** {誰|だれ}が.',
        'Hai câu dễ lẫn: 「どこにいますか」 → **～にいます** (nơi); 「{何|なに}をしていますか」 → **～で～ています** (việc). Cô có thể hỏi cả hai liền nhau — trả lời cả hai như mẫu ô 1.',
        'Được đề nghị giúp: **ありがとうございます／お{願|ねが}いします**. Hết đồ: **もうありません** + mời món khác **～はどうですか** (Bài 6).',
        'Xem **Hội thoại · ③ みんなで楽しいパーティー**.',
      ],
    ),

    ...trang(
      'Trang 130 · 言ってみよう (chủ đề 3) — Số 1: ~ ở đâu, đang làm gì · Số 2: để tôi … nhé?',
      '**Số 1:** "~ ở đâu?" → "~ đang V ở ~ đấy": phòng khách liền bếp — 例 **パク** rửa bát ở bồn bếp; ① **カルロス** đứng ở cửa kính ban công hút thuốc; ② **アンナ** gọi điện; ③ **ワン** và ④ **ナタポン** ngồi sofa nói chuyện với nhau. **Số 2:** "Để tôi V nhé?" → "A, cảm ơn": 例 lấy đồ ăn (tay gắp từ đĩa); ① một phụ nữ cầm máy ảnh — chụp ảnh; ② đưa đồ cho một đứa trẻ ngồi dưới sàn; ③ một người đứng cạnh cửa kính, tay chạm cửa — mở/đóng cửa sổ; ④ hình cái **nĩa**.',
      [
        C('パクさんはどこにいますか。', 'Paku-san wa doko ni imasu ka.', 'Park ở đâu?'),
        S('パクさんは{台所|だいどころ}でお{皿|さら}を{洗|あら}っていますよ。', 'Paku-san wa daidokoro de osara o aratte imasu yo.', 'Park đang rửa bát trong bếp đấy ạ.'),
        C('（①）カルロスさんは？', '(1) Karurosu-san wa?', '(①) Còn Carlos?'),
        S('カルロスさんは{外|そと}でたばこを{吸|す}っていますよ。', 'Karurosu-san wa soto de tabako o sutte imasu yo.', 'Carlos đang hút thuốc ở ngoài ạ.'),
        C('（số 2 ③）ちょっと{寒|さむ}いですね。', '(số 2, 3) Chotto samui desu ne.', '(số 2 ③) Hơi lạnh nhỉ.'),
        S('{窓|まど}を{閉|し}めましょうか。', 'Mado o shimemashou ka.', 'Để em đóng cửa sổ nhé?'),
        C('あ、ありがとうございます。', 'A, arigatou gozaimasu.', 'A, cảm ơn em.'),
      ],
      [
        'Số 1 là cách hỏi của sách: hỏi 「どこにいますか」 mà trả lời luôn **việc đang làm + nơi (で)** — tự nhiên và ăn điểm cả hai ポイント (61 + 64).',
        'Số 2: nhìn tình huống rồi chọn động từ: nóng → {窓|まど}を**{開|あ}け**ましょうか, lạnh → **{閉|し}め**ましょうか; thiếu nĩa → フォークを**{持|も}って{来|き}**ましょうか.',
        'Xem **Ngữ pháp · ポイント 64, 65** và **Luyện nói · Tranh 2 — bữa tiệc**.',
      ],
      [
        mau([
          E('パクさんはどこにいますか。— パクさんは{台所|だいどころ}でお{皿|さら}を{洗|あら}っていますよ。', 'Paku-san wa doko ni imasu ka. — Paku-san wa daidokoro de osara o aratte imasu yo.', 'Số 1 例.'),
          E('カルロスさんはどこにいますか。— {外|そと}でたばこを{吸|す}っていますよ。', 'Karurosu-san wa doko ni imasu ka. — Soto de tabako o sutte imasu yo.', 'Số 1 ① — hút thuốc ngoài ban công.'),
          E('アンナさんはどこにいますか。— {窓|まど}の{近|ちか}くで{電話|でんわ}をかけていますよ。', 'Anna-san wa doko ni imasu ka. — Mado no chikaku de denwa o kakete imasu yo.', 'Số 1 ② — gọi điện.'),
          E('ワンさんはどこにいますか。— ソファでナタポンさんと{話|はな}していますよ。', 'Wan-san wa doko ni imasu ka. — Sofa de Natapon-san to hanashite imasu yo.', 'Số 1 ③ — nói chuyện trên sofa (ソファ — từ thêm).'),
          E('ナタポンさんはどこにいますか。— ソファでワンさんと{話|はな}していますよ。', 'Natapon-san wa doko ni imasu ka. — Sofa de Wan-san to hanashite imasu yo.', 'Số 1 ④.'),
          E('{料理|りょうり}を{取|と}りましょうか。— あ、ありがとうございます。', 'Ryouri o torimashou ka. — A, arigatou gozaimasu.', 'Số 2 例 — lấy đồ ăn.'),
          E('{写真|しゃしん}を{撮|と}りましょうか。— あ、ありがとうございます。', 'Shashin o torimashou ka. — A, arigatou gozaimasu.', 'Số 2 ① — chụp ảnh.'),
          E('ジュースを{持|も}って{来|き}ましょうか。— あ、ありがとうございます。', 'Juusu o motte kimashou ka. — A, arigatou gozaimasu.', 'Số 2 ② (theo tranh) — mang đồ uống cho em bé.'),
          E('{窓|まど}を{開|あ}けましょうか。／{窓|まど}を{閉|し}めましょうか。— あ、ありがとうございます。', 'Mado o akemashou ka. / Mado o shimemashou ka. — A, arigatou gozaimasu.', 'Số 2 ③ — mở / đóng cửa sổ.'),
          E('フォークを{持|も}って{来|き}ましょうか。— あ、ありがとうございます。', 'Fooku o motte kimashou ka. — A, arigatou gozaimasu.', 'Số 2 ④ — nĩa.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 131 · 言ってみよう số 3 — "Ai làm vậy?" ({誰|だれ}が)',
      '**Số 3:** "Oa, ai V vậy?" → "~ V" → "Ồ". Quanh bàn tiệc có bánh kem, một nhóm đang hát và chơi guitar, nhiều người cụng ly. Các ô ghi tên + dấu hỏi: 例 bong bóng người đang làm/trang trí **bánh kem** → **ワン**; ① bong bóng người đang **bước đi** (mũi tên) → **アンナ**; ② bức tranh **núi Phú Sĩ** treo tường, có người chỉ vào → **パク**; ③ khuôn mặt có dấu hỏi → **カルロス**; ④ người **chơi guitar** → **メアリー**. (Động từ ① và ③ khó đoán từ tranh — câu mẫu dưới là một cách nói hợp lý; nói theo việc cô gợi ý.)',
      [
        C('わあ、{誰|だれ}がこのケーキを{作|つく}りましたか。', 'Waa, dare ga kono keeki o tsukurimashita ka.', 'Oa, ai làm cái bánh này vậy?'),
        S('ワンさんが{作|つく}りました。', 'Wan-san ga tsukurimashita.', 'Wang làm ạ.'),
        C('へえ。（②）この{絵|え}、きれいですね。{誰|だれ}がかきましたか。', 'Hee. (2) Kono e, kirei desu ne. Dare ga kakimashita ka.', 'Ồ. (②) Bức tranh này đẹp nhỉ. Ai vẽ vậy?'),
        S('パクさんがかきました。', 'Paku-san ga kakimashita.', 'Park vẽ ạ.'),
        C('（④）{誰|だれ}がギターを{弾|ひ}いていますか。', '(4) Dare ga gitaa o hiite imasu ka.', '(④) Ai đang chơi guitar?'),
        S('メアリーさんが{弾|ひ}いています。', 'Mearii-san ga hiite imasu.', 'Mary đang chơi ạ.'),
      ],
      [
        '**{誰|だれ}が** hỏi → **(tên) が** đáp (ポイント 68). Không nói ~~ワンさんは{作|つく}りました~~.',
        'Việc đã xong → **～ましたか／～ました**; việc đang diễn ra → **～ていますか／～ています**.',
        '"Vẽ tranh" nói {絵|え}を**かきます** (viết bằng かな là được; chữ Hán 描きます chưa học).',
        'Xem **Ngữ pháp · ポイント 68**.',
      ],
      [
        mau([
          E('わあ、{誰|だれ}が{作|つく}りましたか。— ワンさんが{作|つく}りました。— へえ。', 'Waa, dare ga tsukurimashita ka. — Wan-san ga tsukurimashita. — Hee.', 'Số 3 例 — bánh kem.'),
          E('{誰|だれ}が{持|も}って{来|き}ましたか。— アンナさんが{持|も}って{来|き}ました。— へえ。', 'Dare ga motte kimashita ka. — Anna-san ga motte kimashita. — Hee.', 'Số 3 ① (theo tranh) — ai mang đến.'),
          E('{誰|だれ}がこの{絵|え}をかきましたか。— パクさんがかきました。— へえ。', 'Dare ga kono e o kakimashita ka. — Paku-san ga kakimashita. — Hee.', 'Số 3 ② — tranh núi Phú Sĩ.'),
          E('{誰|だれ}が{作|つく}りましたか。— カルロスさんが{作|つく}りました。— へえ。', 'Dare ga tsukurimashita ka. — Karurosu-san ga tsukurimashita. — Hee.', 'Số 3 ③ (theo tranh) — ngạc nhiên vì người làm là Carlos.'),
          E('{誰|だれ}がギターを{弾|ひ}いていますか。— メアリーさんが{弾|ひ}いています。— へえ。', 'Dare ga gitaa o hiite imasu ka. — Mearii-san ga hiite imasu. — Hee.', 'Số 3 ④ — chơi guitar.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 132 · 言ってみよう số 4 — Còn không? (まだ／もう)',
      '**Số 4:** 例1 "Salad còn không?" → "Vâng, vẫn còn. Mời" → "Cảm ơn"; 例2 "Bia còn không?" → "Xin lỗi, hết rồi. Rượu vang thì sao?" → "Được đấy". Quầy bar và bàn tiệc dài, các ô: 例1 bát **salad**; 例2 chai **bia** rót vào ly, cạnh đó chai bia rỗng + ly **rượu vang** (món thay thế); ① chai **trà** và chai **nước**; ② ấm và tách **trà (hồng trà)**; ③ đĩa **cơm rang / mì xào**; ④ đĩa **sushi cuộn**, cạnh đó một món hình tam giác (có lẽ bánh/pizza, không đánh số).',
      [
        C('サラダはまだありますか。', 'Sarada wa mada arimasu ka.', 'Salad còn không?'),
        S('はい、まだあります。どうぞ。', 'Hai, mada arimasu. Douzo.', 'Vâng, vẫn còn ạ. Mời cô.'),
        C('ビールはまだありますか。', 'Biiru wa mada arimasu ka.', 'Bia còn không?'),
        S('すみません。もうありません。ワインはどうですか。', 'Sumimasen. Mou arimasen. Wain wa dou desu ka.', 'Xin lỗi cô. Hết rồi ạ. Rượu vang thì sao ạ?'),
        C('いいですね。', 'Ii desu ne.', 'Được đấy.'),
      ],
      [
        '**まだ + あります** = vẫn còn; **もう + ありません** = hết rồi (ポイント 67). Không nói ~~もうあります~~ / ~~まだありません~~ (khi đã hết).',
        'Hết → xin lỗi + mời món thay bằng **～はどうですか** (Bài 6, ポイント 58).',
        'Xem **Ngữ pháp · ポイント 67** và **Luyện nghe · Bài 5 — Còn hay hết?**.',
      ],
      [
        mau([
          E('サラダはまだありますか。— はい、まだあります。どうぞ。— ありがとうございます。', 'Sarada wa mada arimasu ka. — Hai, mada arimasu. Douzo. — Arigatou gozaimasu.', '例1 — còn.'),
          E('ビールはまだありますか。— すみません。もうありません。ワインはどうですか。— いいですね。', 'Biiru wa mada arimasu ka. — Sumimasen. Mou arimasen. Wain wa dou desu ka. — Ii desu ne.', '例2 — hết, mời vang.'),
          E('お{茶|ちゃ}はまだありますか。— すみません。もうありません。お{水|みず}はどうですか。', 'Ocha wa mada arimasu ka. — Sumimasen. Mou arimasen. Omizu wa dou desu ka.', '① — trà hết, mời nước.'),
          E('{紅茶|こうちゃ}はまだありますか。— はい、まだあります。どうぞ。', 'Koucha wa mada arimasu ka. — Hai, mada arimasu. Douzo.', '② — hồng trà còn.'),
          E('チャーハンはまだありますか。— はい、まだあります。どうぞ。', 'Chaahan wa mada arimasu ka. — Hai, mada arimasu. Douzo.', '③ — cơm rang (チャーハン — từ thêm).'),
          E('すしはまだありますか。— すみません。もうありません。ピザはどうですか。', 'Sushi wa mada arimasu ka. — Sumimasen. Mou arimasen. Piza wa dou desu ka.', '④ — sushi hết, mời pizza.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 133 · やってみよう・ペアで話しましょう (chủ đề 3)',
      '**やってみよう:** nghe CD — ai đang làm gì: 1 ワン, 2 ダニエル, 3 メアリーとアンナ; chọn trong 5 hình: (a) phụ nữ hát vào micro, (b) thanh niên chơi guitar, (c) người đàn ông rắc gia vị lên đĩa đồ ăn, (d) phụ nữ gọi điện, (e) một nam một nữ cùng ăn ở bàn nhiều món. **■ ペアで話しましょう:** tranh tổng hợp bữa tiệc (người gọi điện cạnh cửa kính, người bưng chồng đĩa, người cụng ly, cặp hát + guitar, người ngồi ăn bên bàn có bánh kem và salad) — mỗi bạn nhập vai một người trong tranh và nói chuyện.',
      [
        C('ミンさんはこの{人|ひと}です。{今|いま}、{何|なに}をしていますか。', 'Min-san wa kono hito desu. Ima, nani o shite imasu ka.', 'Minh là người này. Bây giờ em đang làm gì?'),
        S('{今|いま}、お{皿|さら}を{持|も}っています。テーブルへ{持|も}って{行|い}きます。', 'Ima, osara o motte imasu. Teeburu e motte ikimasu.', 'Bây giờ em đang cầm đĩa. Em mang ra bàn ạ.'),
        C('たくさんありますね。{手伝|てつだ}いましょうか。', 'Takusan arimasu ne. Tetsudaimashou ka.', 'Nhiều quá nhỉ. Để cô giúp nhé?'),
        S('あ、ありがとうございます。お{願|ねが}いします。', 'A, arigatou gozaimasu. Onegaishimasu.', 'A, em cảm ơn cô. Nhờ cô ạ.'),
        C('{誰|だれ}が{歌|うた}を{歌|うた}っていますか。', 'Dare ga uta o utatte imasu ka.', 'Ai đang hát vậy?'),
        S('あの{女|おんな}の{人|ひと}が{歌|うた}っています。', 'Ano onna no hito ga utatte imasu.', 'Người phụ nữ kia đang hát ạ.'),
      ],
      [
        'Nghe やってみよう: bắt **tên người + động từ ～ています** ({歌|うた}って, {弾|ひ}いて, {電話|でんわ}をかけて, {食|た}べて…). Không có đáp án CD ở đây.',
        'Đóng vai: mỗi lượt dùng một mẫu — ～ています → ～ましょうか → {誰|だれ}が → まだ／もう.',
        'Luyện: **Luyện nghe · Bài 3 — Ai đang làm gì?** và **Luyện nói · Vai 3**.',
      ],
    ),

    ...trang(
      'Trang 134 · できる! — Cùng lớp tổ chức một sự kiện',
      'Nhiệm vụ tổng hợp: cùng bạn cùng lớp tổ chức một sự kiện (ví dụ tiệc sinh nhật một bạn, buổi liên hoan của lớp): (1) lên kế hoạch — ở đâu, khi nào; (2) viết thư mời; (3) tổ chức. **Trên lớp:** (1) lập kế hoạch tiệc, (2) viết thư mời, (3) viết kịch bản 3 cảnh — hẹn gặp, chuẩn bị, bữa tiệc — (4) diễn trước lớp.',
      [
        C('どこでパーティーをしますか。', 'Doko de paatii o shimasu ka.', 'Tổ chức tiệc ở đâu?'),
        S('ワンさんのアパートでします。', 'Wan-san no apaato de shimasu.', 'Ở căn hộ của Wang ạ.'),
        C('いつしますか。', 'Itsu shimasu ka.', 'Khi nào?'),
        S('{来週|らいしゅう}の{土曜日|どようび}の{6時|ろくじ}からです。', 'Raishuu no doyoubi no rokuji kara desu.', 'Từ 6 giờ thứ Bảy tuần sau ạ.'),
        C('（cảnh chuẩn bị）ミンさん、{何|なに}を{頼|たの}みますか。', '(cảnh chuẩn bị) Min-san, nani o tanomimasu ka.', '(cảnh chuẩn bị) Minh nhờ bạn làm gì?'),
        S('パクさん、ケーキを{切|き}ってください。ナタポンさん、いすを{持|も}って{来|き}てください。', 'Paku-san, keeki o kitte kudasai. Natapon-san, isu o motte kite kudasai.', 'Park ơi, cắt bánh giúp mình. Natapon ơi, mang ghế đến giúp mình.'),
      ],
      [
        'Kịch bản đủ 3 cảnh = ôn đủ 11 ポイント: cảnh hẹn gặp (61, 62), cảnh chuẩn bị (63, 66, 69, 70, 71), cảnh tiệc (64, 65, 67, 68).',
        'Xem bảng kế hoạch mẫu ở **Hội thoại · できる！— Cùng lớp tổ chức một bữa tiệc**.',
      ],
    ),

    ...trang(
      'Trang 134 · 話読聞書「パーティー」 — Thư mời dự tiệc',
      'Ô 話読聞書 có một đoạn thư mời ngắn: người viết mời mọi người đến nhà dự tiệc vào Chủ Nhật tuần sau, sẽ nấu món ăn của nước mình và rủ mọi người cùng nấu, nhờ mọi người chỉ cách nấu món của nước họ, cùng ăn uống; cuối thư chỉ đường — căn hộ gần ga, cạnh cửa hàng tiện lợi — và mời nhất định đến. Từ mới cuối trang: **アパート** (căn hộ). Hai câu gợi ý bên lề: tiệc ở đâu? tiệc như thế nào? Nhiệm vụ: viết thư mời của BẠN theo cùng khung — **khi nào, ở đâu → làm gì, rủ cùng làm → nhờ khách → chỉ đường → ぜひ{来|き}てください** — rồi đọc to.',
      [
        C('どこでパーティーをしますか。', 'Doko de paatii o shimasu ka.', 'Tổ chức tiệc ở đâu?'),
        S('{私|わたし}のアパートでします。', 'Watashi no apaato de shimasu.', 'Ở căn hộ của em ạ.'),
        C('ミンさんの{招待状|しょうたいじょう}を{読|よ}んでください。', 'Min-san no shoutaijou o yonde kudasai.', 'Em đọc thư mời của em đi.'),
        S('{皆|みな}さん、{今度|こんど}の{土曜日|どようび}、{私|わたし}のアパートでパーティーをします。{私|わたし}はベトナムの{春巻|はるま}きを{作|つく}ります。{一緒|いっしょ}に{作|つく}りませんか。{皆|みな}さんの{国|くに}の{料理|りょうり}の{作|つく}り{方|かた}も{教|おし}えてください。{私|わたし}のアパートは{駅|えき}の{近|ちか}くにあります。{銀行|ぎんこう}の{後|うし}ろの{白|しろ}いアパートです。ぜひ{来|き}てください。', 'Minasan, kondo no doyoubi, watashi no apaato de paatii o shimasu. Watashi wa Betonamu no harumaki o tsukurimasu. Issho ni tsukurimasen ka. Minasan no kuni no ryouri no tsukurikata mo oshiete kudasai. Watashi no apaato wa eki no chikaku ni arimasu. Ginkou no ushiro no shiroi apaato desu. Zehi kite kudasai.', 'Mọi người ơi, thứ Bảy tới tôi tổ chức tiệc ở căn hộ của tôi. Tôi sẽ làm nem rán Việt Nam. Cùng làm không? Hãy chỉ tôi cả cách nấu món ăn nước các bạn nữa. Căn hộ của tôi ở gần ga. Là căn hộ màu trắng phía sau ngân hàng. Nhất định hãy đến nhé.'),
      ],
      [
        'Bài này dùng gần đủ ポイント Bài 7: **～てください (63) · ～{方|かた} (66) · ～にあります (61)** + ～ませんか (Bài 6).',
        'Chỉ đường bằng **mốc + vị trí**: {駅|えき}の{近|ちか}く, {銀行|ぎんこう}の{後|うし}ろ, コンビニの{隣|となり}.',
        'Xem **Hội thoại · ④ Nói–Đọc–Nghe–Viết** và **Luyện nói · Đọc to — Reading**.',
      ],
    ),

    { t: 'h', text: 'Trang 135 · ことば — Từ vựng của bài' },
    {
      t: 'p',
      text: 'Trang liệt kê từ mới theo 3 chủ đề: (1) 道がわかりません — cổng soát vé, cây, đồn công an, máy bán hàng tự động, trạm xe buýt, hòm thư, hoa, chó, 10 từ vị trí (giữa, trên, dưới, gần, cạnh sát, trong, ngoài, trước, sau, bên cạnh), đi đón, います (người/vật sống ở đâu), もしもし; (2) パーティーの準備 — ghế, bàn, lò vi sóng, tủ lạnh, đường, muối, xì dầu, cốc, đĩa, thìa, dao, nĩa, đũa, chữ Hán, どれ, どの, 14 động từ (rửa, đặt, viết, cho mượn, hỏi/nghe, cắt, dùng, giúp, lấy, mang đi, hiểu, lấy ra, cho vào, dạy), たくさん, すみませんが, ああ, いいですよ; (3) みんなで楽しいパーティー — bài hát, guitar, bếp, thuốc lá, điện thoại, pizza, cửa sổ, hát, hút, nói chuyện, chơi đàn, cầm, mở, đóng, gọi (điện), mang đến. Số 1/2/3 sau động từ là nhóm động từ. Không có tranh. Đủ nghĩa, romaji, ví dụ và thể て: xem mục **Từ vựng** của Bài 7.',
    },
    { t: 'note', title: 'Mẹo', items: ['Cô hay kiểm tra nhanh **thể て** của động từ trong trang này: cô đọc {洗|あら}います → bạn nói {洗|あら}って; {書|か}きます → {書|か}いて; {行|い}きます → {行|い}って. Ôn ở **Từ vựng · Ôn nhanh: 25 động từ mới** và **Bài tập · Chia thể て**.', 'Xem **Từ vựng · Bài 7** và **Chữ Hán · Bài 7**.'] },

    ...trang(
      'Trang 136 · もう一度聞こう — Nghe lại cả bài',
      'Nghe lại đoạn ở trang 117, ba cảnh ở ký túc xá của **パク**: (1) パク đang làm salad; ナタポン đề nghị giúp, パク nhờ anh cắt rau bằng con dao gần anh — anh hỏi lại **con dao nào**; (2) パク nhận điện thoại của アンナ đang lạc — アンナ ở **trước ga, gần đó có cửa hàng tiện lợi**, パク nói sẽ đến đó; (3) メアリー hỏi ワン マルコ đâu — マルコ **đang hút thuốc ở ngoài**; メアリー rủ マルコ vào ăn bánh, khen ngon, hỏi **ai làm** — アンナ làm; ワン hỏi bánh **còn không** — còn, メアリー đề nghị lấy cho. Cụm mới: **お{願|ねが}いします** (nhờ bạn / làm ơn). Cô sẽ hỏi lại các chi tiết.',
      [
        C('パクさんは{何|なに}を{作|つく}っていますか。', 'Paku-san wa nani o tsukutte imasu ka.', 'Park đang làm món gì?'),
        S('サラダを{作|つく}っています。', 'Sarada o tsukutte imasu.', 'Đang làm salad ạ.'),
        C('ナタポンさんは{何|なに}を{手伝|てつだ}いましたか。', 'Natapon-san wa nani o tetsudaimashita ka.', 'Natapon giúp việc gì?'),
        S('ナイフで{野菜|やさい}を{切|き}りました。', 'Naifu de yasai o kirimashita.', 'Cắt rau bằng dao ạ.'),
        C('アンナさんはどこにいましたか。', 'Anna-san wa doko ni imashita ka.', 'Anna đã ở đâu?'),
        S('{駅|えき}の{前|まえ}にいました。{近|ちか}くにコンビニがありました。', 'Eki no mae ni imashita. Chikaku ni konbini ga arimashita.', 'Ở trước ga ạ. Gần đó có cửa hàng tiện lợi.'),
        C('マルコさんは{何|なに}をしていましたか。', 'Maruko-san wa nani o shite imashita ka.', 'Marco lúc đó đang làm gì?'),
        S('{外|そと}でたばこを{吸|す}っていました。', 'Soto de tabako o sutte imashita.', 'Đang hút thuốc ở ngoài ạ.'),
        C('{誰|だれ}がケーキを{作|つく}りましたか。', 'Dare ga keeki o tsukurimashita ka.', 'Ai làm bánh?'),
        S('アンナさんが{作|つく}りました。', 'Anna-san ga tsukurimashita.', 'Anna làm ạ.'),
        C('ケーキはまだありますか。', 'Keeki wa mada arimasu ka.', 'Bánh còn không?'),
        S('はい、まだあります。', 'Hai, mada arimasu.', 'Vâng, vẫn còn ạ.'),
      ],
      [
        'Cô hỏi về chuyện VỪA nghe nên dùng quá khứ: **いました／ありました／～ていました** (đang … lúc đó). Đổi ます → ました như Bài 5.',
        '**お{願|ねが}いします** là câu đáp chuẩn cho **～ましょうか**.',
        'Xem **Luyện nghe · Bài 4 — Hội thoại dài: tiệc ở ký túc xá**.',
      ],
    ),

    { t: 'h', text: 'Cô hỏi — bạn trả lời: ghép nhanh câu trả lời' },
    {
      t: 'build',
      id: 'b7-sach-ghep',
      title: 'Nghe câu hỏi (tiếng Việt) → ghép câu trả lời tiếng Nhật',
      items: [
        { vi: 'Cô hỏi 今、どこにいますか → "Em ở trước ga ạ."', chips: ['{駅|えき}の', '{前|まえ}に', 'います。', 'あります。', '{前|まえ}で'], answer: ['{駅|えき}の', '{前|まえ}に', 'います。'], ro: 'Eki no mae ni imasu.' },
        { vi: 'Cô hỏi 近くに何がありますか → "Có siêu thị lớn ạ."', chips: ['{大|おお}きい', 'スーパーが', 'あります。', 'スーパーは', 'います。'], answer: ['{大|おお}きい', 'スーパーが', 'あります。'], ro: 'Ookii suupaa ga arimasu.' },
        { vi: 'Cô nói お皿を取ってください → hỏi lại: "Đĩa nào ạ?"', chips: ['どの', 'お{皿|さら}ですか。', 'どれ', 'お{皿|さら}は'], answer: ['どの', 'お{皿|さら}ですか。'], ro: 'Dono osara desu ka.' },
        { vi: 'Cô nói 塩を取ってください → hỏi lại: "Muối là lọ nào ạ?"', chips: ['{塩|しお}は', 'どれ', 'ですか。', 'どの', '{塩|しお}が'], answer: ['{塩|しお}は', 'どれ', 'ですか。'], ro: 'Shio wa dore desu ka.' },
        { vi: 'Nhờ bạn: "Cắt bánh mì bằng dao giúp mình."', chips: ['ナイフで', 'パンを', '{切|き}って', 'ください。', '{切|き}りて', 'ナイフを'], answer: ['ナイフで', 'パンを', '{切|き}って', 'ください。'], ro: 'Naifu de pan o kitte kudasai.' },
        { vi: 'Cô hỏi パクさんはどこにいますか → "Park đang rửa bát trong bếp ạ."', chips: ['パクさんは', '{台所|だいどころ}で', 'お{皿|さら}を', '{洗|あら}って', 'います。', '{台所|だいどころ}に'], answer: ['パクさんは', '{台所|だいどころ}で', 'お{皿|さら}を', '{洗|あら}って', 'います。'], ro: 'Paku-san wa daidokoro de osara o aratte imasu.' },
        { vi: 'Đề nghị: "Để em chụp ảnh cho nhé?"', chips: ['{写真|しゃしん}を', '{撮|と}り', 'ましょうか。', 'ませんか。', '{撮|と}って'], answer: ['{写真|しゃしん}を', '{撮|と}り', 'ましょうか。'], ro: 'Shashin o torimashou ka.' },
        { vi: 'Cô hỏi 誰が作りましたか → "Wang làm ạ."', chips: ['ワンさん', 'が', '{作|つく}りました。', 'は', '{作|つく}ります。'], answer: ['ワンさん', 'が', '{作|つく}りました。'], ro: 'Wan-san ga tsukurimashita.' },
        { vi: 'Cô hỏi ビールはまだありますか → "Xin lỗi, hết rồi ạ. Rượu vang thì sao ạ?"', chips: ['すみません。', 'もう', 'ありません。', 'ワインは', 'どうですか。', 'まだ'], answer: ['すみません。', 'もう', 'ありません。', 'ワインは', 'どうですか。'], ro: 'Sumimasen. Mou arimasen. Wain wa dou desu ka.' },
        { vi: 'Cô hỏi カレーの作り方がわかりますか → "Không ạ. Cô chỉ em cách nấu với ạ."', chips: ['いいえ、', 'わかりません。', '{作|つく}り{方|かた}を', '{教|おし}えて', 'ください。', '{作|つく}る{方|かた}を'], answer: ['いいえ、', 'わかりません。', '{作|つく}り{方|かた}を', '{教|おし}えて', 'ください。'], ro: 'Iie, wakarimasen. Tsukurikata o oshiete kudasai.' },
      ],
    },
  ],
};
