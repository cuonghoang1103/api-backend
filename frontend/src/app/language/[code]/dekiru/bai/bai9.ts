/**
 * Bài 9 — 好きなこと (Điều mình thích) · できる日本語 初級 第9課 (p.153–168) · JPD113/JPD123.
 *
 * Ngữ pháp: ポイント 81–87 (V辞書形こと · ｛N／V辞書形こと｝ができます · Vて、___ ·
 * [～日・～週間…]に[～回・～本…] · いつも／よく／ときどき／あまり／全然 · どうやって · でも)
 * + bảng đổi thể ます → THỂ TỪ ĐIỂN (辞書形) đủ 3 nhóm (表 p.282–283) + bảng đếm
 * ～本・～杯・～冊・～回・～日 (表 p.287).
 * Từ vựng: đủ 61 mục trang ことば p.167 (32 + 16 + 13). Cô chỉ phát danh sách đến Bài 7,
 * nên Bài 9 lấy trang ことば của sách làm chuẩn.
 * Hội thoại, câu ví dụ, bài đọc, kịch bản nghe: VIẾT MỚI theo đúng tình huống của sách
 * (xem ../SOAN-BAI.md). Tên quán, lớp học, sự kiện, phim trong bài là tự đặt.
 *
 * Vai (theo bai1.ts): nữ = パク, ワン, アンナ, メアリー, 木村, 山口 (role a / c, giọng ja-nu);
 * nam = カルロス, ダニエル, マルコ, ナタポン (role b, giọng ja-nam). Giám thị / cô — examiner.
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
  id: 'b9-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — 好きなこと: sở thích, việc làm được, cuối tuần của tôi',
  goal: 'Nói và hỏi về sở thích (thích gì, đặc biệt là gì, bao lâu một lần), nói việc mình làm được / không làm được khi xem bảng thông báo, kể cuối tuần đã làm gì theo thứ tự và giải thích cách làm một việc.',
  minutes: 40,
  blocks: [
    {
      t: 'note',
      title: 'Học xong bài 9 bạn làm được (できる)',
      items: [
        '**① いろいろな{趣味|しゅみ}** — **nói** sở thích của mình và **hỏi** sở thích của người khác: thích gì, **đặc biệt** ({特|とく}に) là gì, **bao lâu một lần** ({1週間|いっしゅうかん}に{2回|にかい}), dạo này còn làm không.',
        '**② できること・できないこと** — nhìn bảng thông báo (câu lạc bộ, lớp học, chuyến đi), nói việc mình **làm được / không làm được** và muốn tham gia cái gì, vì sao.',
        '**③ {楽|たの}しい{週末|しゅうまつ}** — **kể** ngày nghỉ đã làm gì theo **thứ tự** (Vて、Vて、Vました); **giải thích cách làm** một việc mình biết (mua vé, đi đến bảo tàng, làm thẻ thư viện) bằng **どうやって**.',
        '**できる！** — ở buổi giao lưu: viết sở thích lên thẻ, tìm người cùng sở thích, hỏi thật nhiều (loại nào, bao lâu một lần, làm thế nào cho giỏi) và kết bạn mới.',
      ],
    },
    {
      t: 'table',
      caption: 'Bức tranh chung của bài — 7 điểm ngữ pháp nằm ở đâu',
      head: ['Tình huống', 'Câu then chốt', 'Romaji', 'ポイント'],
      rows: [
        ['① Nói sở thích', '{趣味|しゅみ}は{映画|えいが}を{見|み}ることです。', 'Shumi wa eiga o miru koto desu.', '81'],
        ['① Bao lâu một lần', '{1週間|いっしゅうかん}に{2回|にかい}くらい{見|み}ます。', 'Isshuukan ni nikai kurai mimasu.', '84'],
        ['① Thường / không mấy', 'よく{見|み}ます。／あまり{見|み}ません。', 'Yoku mimasu. / Amari mimasen.', '85'],
        ['① Nhưng…', 'でも、{最近|さいきん}、{全然|ぜんぜん}しません。', 'Demo, saikin, zenzen shimasen.', '87'],
        ['② Làm được', 'スキーができます。／{漢字|かんじ}を{書|か}くことができます。', 'Sukii ga dekimasu. / Kanji o kaku koto ga dekimasu.', '82'],
        ['③ Kể theo thứ tự', '{映画|えいが}を{見|み}て、{買|か}い{物|もの}をして、{食事|しょくじ}しました。', 'Eiga o mite, kaimono o shite, shokuji shimashita.', '83'],
        ['③ Cách làm', 'どうやって{行|い}きますか。——バスに{乗|の}って、{駅|えき}で{降|お}ります。', 'Dou yatte ikimasu ka. — Basu ni notte, eki de orimasu.', '86'],
      ],
    },

    /* ── ① いろいろな趣味 ── */
    { t: 'h', text: '① いろいろな{趣味|しゅみ} — Sở thích của bạn là gì?' },
    {
      t: 'p',
      text: 'Tình huống: một **buổi giao lưu** ({交流会|こうりゅうかい}) của khu phố — người Nhật và người nước ngoài làm quen, hỏi nhau sở thích. Người Nhật hay hỏi tiếp: **"loại nào?"** (どんな～), **"đặc biệt thích gì?"** ({特|とく}に), **"có hay làm không?"** (よく～ますか), **"bao lâu một lần?"**.',
    },
    {
      t: 'dialogue',
      title: 'Ở buổi giao lưu — sở thích chụp ảnh',
      lines: [
        { who: '山口', role: 'a', text: 'カルロスさんの{趣味|しゅみ}は{何|なん}ですか。', ro: 'Karurosu-san no shumi wa nan desu ka.', vi: 'Sở thích của anh Carlos là gì?' },
        { who: 'カルロス', role: 'b', text: '{写真|しゃしん}を{撮|と}ることです。', ro: 'Shashin o toru koto desu.', vi: 'Là chụp ảnh.' },
        { who: '山口', role: 'a', text: 'へえ、どんな{写真|しゃしん}を{撮|と}りますか。', ro: 'Hee, donna shashin o torimasu ka.', vi: 'Ồ, anh chụp ảnh gì?' },
        { who: 'カルロス', role: 'b', text: '{景色|けしき}の{写真|しゃしん}を{撮|と}ります。{特|とく}に、{山|やま}の{写真|しゃしん}が{好|す}きです。', ro: 'Keshiki no shashin o torimasu. Toku ni, yama no shashin ga suki desu.', vi: 'Tôi chụp ảnh phong cảnh. Đặc biệt là tôi thích ảnh núi.' },
        { who: '山口', role: 'a', text: 'よく{山|やま}に{登|のぼ}りますか。', ro: 'Yoku yama ni noborimasu ka.', vi: 'Anh có hay leo núi không?' },
        { who: 'カルロス', role: 'b', text: 'はい、{1か月|いっかげつ}に{2回|にかい}くらい{登|のぼ}ります。', ro: 'Hai, ikkagetsu ni nikai kurai noborimasu.', vi: 'Có, khoảng 1 tháng 2 lần.' },
        { who: '山口', role: 'a', text: 'そうですか。すごいですね。', ro: 'Sou desu ka. Sugoi desu ne.', vi: 'Vậy à. Giỏi thật đấy.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Sở thích là bóng đá — nhưng dạo này không chơi',
      lines: [
        { who: 'アンナ', role: 'a', text: 'ナタポンさんの{趣味|しゅみ}は{何|なん}ですか。', ro: 'Natapon-san no shumi wa nan desu ka.', vi: 'Sở thích của Natapon là gì?' },
        { who: 'ナタポン', role: 'b', text: 'サッカーをすることです。', ro: 'Sakkaa o suru koto desu.', vi: 'Là chơi bóng đá.' },
        { who: 'アンナ', role: 'a', text: 'へえ。よくしますか。', ro: 'Hee. Yoku shimasu ka.', vi: 'Ồ. Bạn có hay chơi không?' },
        { who: 'ナタポン', role: 'b', text: '{国|くに}では{毎週|まいしゅう}しました。でも、{最近|さいきん}、{全然|ぜんぜん}しません。{時間|じかん}がありませんから。', ro: 'Kuni de wa maishuu shimashita. Demo, saikin, zenzen shimasen. Jikan ga arimasen kara.', vi: 'Ở nước mình thì tuần nào cũng chơi. Nhưng dạo này hoàn toàn không chơi. Vì không có thời gian.' },
        { who: 'アンナ', role: 'a', text: 'そうですか。{残念|ざんねん}ですね。', ro: 'Sou desu ka. Zannen desu ne.', vi: 'Vậy à. Tiếc nhỉ.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Bao lâu một lần? — đọc sách và chơi game',
      lines: [
        { who: 'マルコ', role: 'b', text: 'ワンさんの{趣味|しゅみ}は{何|なん}ですか。', ro: 'Wan-san no shumi wa nan desu ka.', vi: 'Sở thích của Wang là gì?' },
        { who: 'ワン', role: 'c', text: '{本|ほん}を{読|よ}むことです。{特|とく}に、{日本|にほん}の{小説|しょうせつ}が{好|す}きです。', ro: 'Hon o yomu koto desu. Toku ni, Nihon no shousetsu ga suki desu.', vi: 'Là đọc sách. Đặc biệt mình thích tiểu thuyết Nhật.' },
        { who: 'マルコ', role: 'b', text: 'よく{読|よ}みますか。', ro: 'Yoku yomimasu ka.', vi: 'Bạn có hay đọc không?' },
        { who: 'ワン', role: 'c', text: 'はい、{1週間|いっしゅうかん}に{2|に}、{3冊|さんさつ}{読|よ}みます。マルコさんは？', ro: 'Hai, isshuukan ni ni, sansatsu yomimasu. Maruko-san wa?', vi: 'Có, 1 tuần mình đọc 2, 3 quyển. Còn Marco?' },
        { who: 'マルコ', role: 'b', text: '{私|わたし}の{趣味|しゅみ}はゲームをすることです。{1日|いちにち}に{3時間|さんじかん}くらいします。', ro: 'Watashi no shumi wa geemu o suru koto desu. Ichinichi ni sanjikan kurai shimasu.', vi: 'Sở thích của mình là chơi game. Một ngày mình chơi khoảng 3 tiếng.' },
        { who: 'ワン', role: 'c', text: 'えっ、{毎日|まいにち}ですか。', ro: 'E, mainichi desu ka.', vi: 'Hả, ngày nào cũng thế à?' },
        { who: 'マルコ', role: 'b', text: 'はい、いつもします。{本|ほん}はあまり{読|よ}みません。', ro: 'Hai, itsumo shimasu. Hon wa amari yomimasen.', vi: 'Ừ, lúc nào mình cũng chơi. Sách thì mình không đọc mấy.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'Bさんの{趣味|しゅみ}は{何|なん}ですか。——{音楽|おんがく}を{聞|き}くことです。', ro: 'B-san no shumi wa nan desu ka. — Ongaku o kiku koto desu.', vi: 'Sở thích của B là gì? — Là nghe nhạc. — V thể từ điển + **こと** (ポイント 81).' },
        { en: 'どんな{音楽|おんがく}を{聞|き}きますか。——ポップスを{聞|き}きます。', ro: 'Donna ongaku o kikimasu ka. — Poppusu o kikimasu.', vi: 'Bạn nghe nhạc gì? — Tôi nghe nhạc pop.' },
        { en: '{特|とく}に、{花|はな}の{切手|きって}が{好|す}きです。', ro: 'Toku ni, hana no kitte ga suki desu.', vi: 'Đặc biệt tôi thích tem hình hoa.' },
        { en: '{1週間|いっしゅうかん}に{2回|にかい}くらい{映画|えいが}を{見|み}ます。', ro: 'Isshuukan ni nikai kurai eiga o mimasu.', vi: 'Tôi xem phim khoảng 1 tuần 2 lần. — ポイント 84.' },
        { en: 'よく{料理|りょうり}をしますか。——いいえ、あまりしません。', ro: 'Yoku ryouri o shimasu ka. — Iie, amari shimasen.', vi: 'Bạn có hay nấu ăn không? — Không, tôi không nấu mấy. — ポイント 85.' },
        { en: '{私|わたし}の{趣味|しゅみ}はスポーツです。でも、{最近|さいきん}、{全然|ぜんぜん}しません。', ro: 'Watashi no shumi wa supootsu desu. Demo, saikin, zenzen shimasen.', vi: 'Sở thích của tôi là thể thao. Nhưng dạo này tôi hoàn toàn không chơi. — ポイント 87.' },
      ],
    },

    /* ── ② できること・できないこと ── */
    { t: 'h', text: '② できること・できないこと — Làm được gì, không làm được gì' },
    {
      t: 'p',
      text: 'Tình huống: hai người bạn đứng trước **bảng thông báo** ({掲示板|けいじばん}) của trường / nhà văn hoá: poster câu lạc bộ nhảy, CLB piano jazz, lớp thư pháp, lớp nấu ăn, chuyến trượt tuyết… Người này muốn tham gia cái gì đó, người kia ngạc nhiên hỏi "bạn làm được à?". Hoặc: "tôi không làm giỏi được nên muốn đi học".',
    },
    {
      t: 'dialogue',
      title: 'Trước bảng thông báo — chuyến trượt tuyết',
      lines: [
        { who: 'ワン', role: 'a', text: 'いろいろなイベントがありますね。', ro: 'Iroiro na ibento ga arimasu ne.', vi: 'Có nhiều sự kiện nhỉ.' },
        { who: 'ダニエル', role: 'b', text: 'そうですね。あ、{私|わたし}はこのスキー{旅行|りょこう}に{参加|さんか}したいです。', ro: 'Sou desu ne. A, watashi wa kono sukii ryokou ni sanka shitai desu.', vi: 'Ừ nhỉ. A, mình muốn tham gia chuyến du lịch trượt tuyết này.' },
        { who: 'ワン', role: 'a', text: 'えっ？ダニエルさんはスキーができますか。', ro: 'E? Danieru-san wa sukii ga dekimasu ka.', vi: 'Hả? Daniel trượt tuyết được à?' },
        { who: 'ダニエル', role: 'b', text: 'はい。{国|くに}で{毎年|まいとし}しましたから。', ro: 'Hai. Kuni de maitoshi shimashita kara.', vi: 'Ừ. Vì ở nước mình năm nào mình cũng trượt.' },
        { who: 'ワン', role: 'a', text: 'へえ、すごいですね。{私|わたし}はスキーが{全然|ぜんぜん}できません。', ro: 'Hee, sugoi desu ne. Watashi wa sukii ga zenzen dekimasen.', vi: 'Ồ, giỏi thật. Mình hoàn toàn không trượt tuyết được.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Muốn đăng ký lớp — vì chưa làm giỏi được',
      lines: [
        { who: 'メアリー', role: 'a', text: 'あ、{私|わたし}はこれに{申|もう}し{込|こ}みたいです。', ro: 'A, watashi wa kore ni moushikomitai desu.', vi: 'A, mình muốn đăng ký cái này.' },
        { who: 'マルコ', role: 'b', text: 'えっ？{料理|りょうり}{教室|きょうしつ}ですか。', ro: 'E? Ryouri kyoushitsu desu ka.', vi: 'Hả? Lớp nấu ăn à?' },
        { who: 'メアリー', role: 'a', text: 'はい。{私|わたし}は{日本|にほん}の{料理|りょうり}を{作|つく}ることができませんから、{習|なら}いたいです。', ro: 'Hai. Watashi wa Nihon no ryouri o tsukuru koto ga dekimasen kara, naraitai desu.', vi: 'Ừ. Vì mình không nấu được món Nhật nên mình muốn đi học.' },
        { who: 'マルコ', role: 'b', text: 'そうですか。{毎週|まいしゅう}{水曜日|すいようび}ですね。{英語|えいご}もOKですよ。', ro: 'Sou desu ka. Maishuu suiyoubi desu ne. Eigo mo OK desu yo.', vi: 'Vậy à. Thứ Tư hằng tuần nhỉ. Tiếng Anh cũng được đấy.' },
        { who: 'メアリー', role: 'a', text: 'よかった。{電話|でんわ}で{申|もう}し{込|こ}みます。', ro: 'Yokatta. Denwa de moushikomimasu.', vi: 'Tốt quá. Mình sẽ đăng ký qua điện thoại.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'CLB nhảy và lớp thư pháp',
      lines: [
        { who: 'パク', role: 'a', text: 'カルロスさん、このダンスクラブに{入|はい}りませんか。', ro: 'Karurosu-san, kono dansu kurabu ni hairimasen ka.', vi: 'Carlos ơi, vào câu lạc bộ nhảy này không?' },
        { who: 'カルロス', role: 'b', text: 'ダンスですか。{私|わたし}はダンスがあまりできません。でも、{楽|たの}しいですね。{入|はい}りましょう。', ro: 'Dansu desu ka. Watashi wa dansu ga amari dekimasen. Demo, tanoshii desu ne. Hairimashou.', vi: 'Nhảy à? Mình nhảy không giỏi lắm. Nhưng vui nhỉ. Vào thôi.' },
        { who: 'パク', role: 'a', text: 'それから、{私|わたし}は{書道|しょどう}{教室|きょうしつ}にも{行|い}きたいです。{上手|じょうず}に{漢字|かんじ}を{書|か}くことができませんから。', ro: 'Sore kara, watashi wa shodou kyoushitsu ni mo ikitai desu. Jouzu ni kanji o kaku koto ga dekimasen kara.', vi: 'Còn nữa, mình cũng muốn đi lớp thư pháp. Vì mình không viết chữ Hán đẹp được.' },
        { who: 'カルロス', role: 'b', text: '{書道|しょどう}{教室|きょうしつ}は{毎週|まいしゅう}{土曜日|どようび}{6時|ろくじ}からですよ。', ro: 'Shodou kyoushitsu wa maishuu doyoubi rokuji kara desu yo.', vi: 'Lớp thư pháp từ 6 giờ thứ Bảy hằng tuần đấy.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'Bさんはスキーができますか。——はい、できます。／いいえ、できません。', ro: 'B-san wa sukii ga dekimasu ka. — Hai, dekimasu. / Iie, dekimasen.', vi: 'B trượt tuyết được không? — Được. / Không được. — N **が** できます (ポイント 82).' },
        { en: '{私|わたし}は{上手|じょうず}に{英語|えいご}を{話|はな}すことができません。', ro: 'Watashi wa jouzu ni eigo o hanasu koto ga dekimasen.', vi: 'Tôi không nói tiếng Anh giỏi được. — V thể từ điển + **ことができます**.' },
        { en: 'このスキー{旅行|りょこう}に{参加|さんか}したいです。', ro: 'Kono sukii ryokou ni sanka shitai desu.', vi: 'Tôi muốn tham gia chuyến trượt tuyết này. — N **に** {参加|さんか}します.' },
        { en: 'ダンスクラブに{入|はい}ります。／{料理|りょうり}{教室|きょうしつ}に{申|もう}し{込|こ}みます。', ro: 'Dansu kurabu ni hairimasu. / Ryouri kyoushitsu ni moushikomimasu.', vi: 'Vào CLB nhảy. / Đăng ký lớp nấu ăn. — đều dùng **に**.' },
        { en: 'えっ？すごいですね。', ro: 'E? Sugoi desu ne.', vi: 'Hả? Giỏi thật đấy! — khi nghe bạn làm được việc khó.' },
      ],
    },

    /* ── ③ 楽しい週末 ── */
    { t: 'h', text: '③ {楽|たの}しい{週末|しゅうまつ} — Cuối tuần vui vẻ' },
    {
      t: 'p',
      text: 'Tình huống: sáng thứ Hai, trong lớp, các bạn hỏi nhau cuối tuần làm gì. Kể **nhiều việc theo thứ tự** bằng **Vて、Vて、Vました**. Nghe bạn kể hay quá, mình cũng muốn làm → hỏi **どうやって** (làm thế nào: mua vé, đi đến đó, làm thẻ…) — bạn giải thích từng bước, cũng bằng Vて.',
    },
    {
      t: 'dialogue',
      title: 'Cuối tuần làm gì?',
      lines: [
        { who: 'マルコ', role: 'b', text: 'メアリーさん、{週末|しゅうまつ}、{何|なに}をしましたか。', ro: 'Mearii-san, shuumatsu, nani o shimashita ka.', vi: 'Mary, cuối tuần bạn làm gì?' },
        { who: 'メアリー', role: 'a', text: '{友達|ともだち}と{上野|うえの}へ{行|い}って、{美術館|びじゅつかん}で{絵|え}を{見|み}て、{中華|ちゅうか}{料理|りょうり}を{食|た}べました。', ro: 'Tomodachi to Ueno e itte, bijutsukan de e o mite, chuuka ryouri o tabemashita.', vi: 'Mình đi Ueno với bạn, xem tranh ở bảo tàng mỹ thuật, rồi ăn món Trung Hoa.' },
        { who: 'マルコ', role: 'b', text: 'へえ、いいですね。', ro: 'Hee, ii desu ne.', vi: 'Ồ, hay nhỉ.' },
        { who: 'メアリー', role: 'a', text: 'マルコさんは？', ro: 'Maruko-san wa?', vi: 'Còn Marco?' },
        { who: 'マルコ', role: 'b', text: '{土曜日|どようび}はスーパーで{買|か}い{物|もの}をして、うちで{料理|りょうり}を{作|つく}りました。{日曜日|にちようび}は{宿題|しゅくだい}をして、{寝|ね}ました。', ro: 'Doyoubi wa suupaa de kaimono o shite, uchi de ryouri o tsukurimashita. Nichiyoubi wa shukudai o shite, nemashita.', vi: 'Thứ Bảy mình mua đồ ở siêu thị rồi nấu ăn ở nhà. Chủ Nhật làm bài tập rồi đi ngủ.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Mua vé hoà nhạc thế nào?',
      lines: [
        { who: 'パク', role: 'a', text: 'アンナさん、{週末|しゅうまつ}、{何|なに}をしましたか。', ro: 'Anna-san, shuumatsu, nani o shimashita ka.', vi: 'Anna, cuối tuần bạn làm gì?' },
        { who: 'アンナ', role: 'c', text: 'SMILEのコンサートに{行|い}きました。とても{楽|たの}しかったです。', ro: 'SMILE no konsaato ni ikimashita. Totemo tanoshikatta desu.', vi: 'Mình đi buổi hoà nhạc của nhóm SMILE. Vui lắm.' },
        { who: 'パク', role: 'a', text: 'いいですね。{私|わたし}も{行|い}きたいです。でも、チケットの{買|か}い{方|かた}がわかりません。どうやってチケットを{買|か}いますか。', ro: 'Ii desu ne. Watashi mo ikitai desu. Demo, chiketto no kaikata ga wakarimasen. Dou yatte chiketto o kaimasu ka.', vi: 'Hay nhỉ. Mình cũng muốn đi. Nhưng mình không biết cách mua vé. Mua vé bằng cách nào?' },
        { who: 'アンナ', role: 'c', text: 'インターネットでチケットを{予約|よやく}して、コンビニでお{金|かね}を{払|はら}います。', ro: 'Intaanetto de chiketto o yoyaku shite, konbini de okane o haraimasu.', vi: 'Đặt vé trên mạng, rồi trả tiền ở cửa hàng tiện lợi.' },
        { who: 'パク', role: 'a', text: 'そうですか。ありがとうございます。', ro: 'Sou desu ka. Arigatou gozaimasu.', vi: 'Vậy à. Cảm ơn nhé.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Đi bảo tàng bằng cách nào? · Làm thẻ thư viện thế nào?',
      lines: [
        { who: 'ナタポン', role: 'b', text: '{木村|きむら}さん、どうやってみどり{美術館|びじゅつかん}へ{行|い}きますか。', ro: 'Kimura-san, dou yatte Midori bijutsukan e ikimasu ka.', vi: 'Chị Kimura, đi đến bảo tàng Midori bằng cách nào ạ?' },
        { who: '木村', role: 'a', text: '{駅|えき}の{前|まえ}で{5番|ごばん}のバスに{乗|の}って、「{美術館|びじゅつかん}{前|まえ}」で{降|お}ります。', ro: 'Eki no mae de goban no basu ni notte, "Bijutsukan mae" de orimasu.', vi: 'Lên xe buýt số 5 ở trước ga, rồi xuống ở trạm "Trước bảo tàng".' },
        { who: 'ナタポン', role: 'b', text: 'わかりました。それから、{図書館|としょかん}のカードはどうやって{作|つく}りますか。', ro: 'Wakarimashita. Sore kara, toshokan no kaado wa dou yatte tsukurimasu ka.', vi: 'Em hiểu rồi. Còn nữa, thẻ thư viện thì làm thế nào ạ?' },
        { who: '木村', role: 'a', text: '{受付|うけつけ}で{名前|なまえ}と{住所|じゅうしょ}と{電話番号|でんわばんごう}を{書|か}いて、{外国人登録証|がいこくじんとうろくしょう}を{見|み}せます。', ro: 'Uketsuke de namae to juusho to denwa bangou o kaite, gaikokujin tourokushou o misemasu.', vi: 'Ở quầy tiếp tân, viết tên, địa chỉ và số điện thoại, rồi cho xem thẻ đăng ký người nước ngoài.' },
        { who: 'ナタポン', role: 'b', text: 'そうですか。ありがとうございます。', ro: 'Sou desu ka. Arigatou gozaimasu.', vi: 'Vậy ạ. Em cảm ơn.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{週末|しゅうまつ}、{何|なに}をしましたか。', ro: 'Shuumatsu, nani o shimashita ka.', vi: 'Cuối tuần bạn đã làm gì?' },
        { en: '{友達|ともだち}と{映画|えいが}を{見|み}て、{買|か}い{物|もの}をして、{食事|しょくじ}しました。', ro: 'Tomodachi to eiga o mite, kaimono o shite, shokuji shimashita.', vi: 'Tôi xem phim với bạn, mua sắm, rồi đi ăn. — Vて、Vて、Vました (ポイント 83).' },
        { en: 'チケットの{買|か}い{方|かた}がわかりません。', ro: 'Chiketto no kaikata ga wakarimasen.', vi: 'Tôi không biết cách mua vé. — V(bỏ ます)+{方|かた} (Bài 7).' },
        { en: 'どうやってチケットを{買|か}いますか。', ro: 'Dou yatte chiketto o kaimasu ka.', vi: 'Mua vé bằng cách nào? — ポイント 86.' },
        { en: 'インターネットで{予約|よやく}して、コンビニでお{金|かね}を{払|はら}います。', ro: 'Intaanetto de yoyaku shite, konbini de okane o haraimasu.', vi: 'Đặt trên mạng rồi trả tiền ở cửa hàng tiện lợi.' },
        { en: '{3番|さんばん}のバスに{乗|の}って、{美術館|びじゅつかん}{前|まえ}で{降|お}ります。', ro: 'Sanban no basu ni notte, bijutsukan mae de orimasu.', vi: 'Lên xe buýt số 3, xuống ở trạm trước bảo tàng.' },
      ],
    },

    /* ── 話読聞書 ── */
    { t: 'h', text: '④ Nói–Đọc–Nghe–Viết (話読聞書) — {私|わたし}の{趣味|しゅみ}' },
    {
      t: 'p',
      text: 'Bài đọc mẫu (viết mới, cùng kiểu với sách): một bạn giới thiệu sở thích của mình — là gì, bao lâu một lần, đặc biệt thích gì, làm được / không làm được gì, muốn làm gì. Đọc to từng câu, rồi viết một đoạn y khung về sở thích THẬT của bạn.',
    },
    {
      t: 'passage',
      title: '{私|わたし}の{趣味|しゅみ}',
      paras: [
        { text: '{私|わたし}の{趣味|しゅみ}は{漫画|まんが}を{読|よ}むことです。{1か月|いっかげつ}に{5|ご}、{6冊|ろくさつ}{読|よ}みます。{特|とく}に、スポーツの{漫画|まんが}が{好|す}きです。{日本|にほん}の{漫画|まんが}は{絵|え}がきれいで、{話|はなし}もおもしろいです。{私|わたし}はときどき{漫画|まんが}の{絵|え}を{描|か}きます。でも、{上手|じょうず}に{描|か}くことができません。{今|いま}、{週|しゅう}に{1回|いっかい}、{絵|え}の{教室|きょうしつ}に{行|い}って、{描|か}き{方|かた}を{習|なら}っています。いつか{自分|じぶん}の{漫画|まんが}を{描|か}きたいです。' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{私|わたし}の{趣味|しゅみ}は{漫画|まんが}を{読|よ}むことです。', ro: 'Watashi no shumi wa manga o yomu koto desu.', vi: 'Sở thích của tôi là đọc truyện tranh. (81)' },
        { en: '{1か月|いっかげつ}に{5|ご}、{6冊|ろくさつ}{読|よ}みます。', ro: 'Ikkagetsu ni go, rokusatsu yomimasu.', vi: 'Một tháng tôi đọc 5, 6 quyển. (84)' },
        { en: '{特|とく}に、スポーツの{漫画|まんが}が{好|す}きです。', ro: 'Toku ni, supootsu no manga ga suki desu.', vi: 'Đặc biệt tôi thích truyện tranh thể thao.' },
        { en: '{日本|にほん}の{漫画|まんが}は{絵|え}がきれいで、{話|はなし}もおもしろいです。', ro: 'Nihon no manga wa e ga kirei de, hanashi mo omoshiroi desu.', vi: 'Truyện tranh Nhật tranh đẹp, chuyện cũng hay. (ナA で nối — Bài 8)' },
        { en: '{私|わたし}はときどき{漫画|まんが}の{絵|え}を{描|か}きます。でも、{上手|じょうず}に{描|か}くことができません。', ro: 'Watashi wa tokidoki manga no e o kakimasu. Demo, jouzu ni kaku koto ga dekimasen.', vi: 'Thỉnh thoảng tôi vẽ tranh truyện. Nhưng tôi không vẽ giỏi được. (85, 87, 82)' },
        { en: '{今|いま}、{週|しゅう}に{1回|いっかい}、{絵|え}の{教室|きょうしつ}に{行|い}って、{描|か}き{方|かた}を{習|なら}っています。', ro: 'Ima, shuu ni ikkai, e no kyoushitsu ni itte, kakikata o naratte imasu.', vi: 'Bây giờ tuần 1 lần tôi đến lớp vẽ học cách vẽ. (83 + ～ています Bài 8)' },
        { en: 'いつか{自分|じぶん}の{漫画|まんが}を{描|か}きたいです。', ro: 'Itsuka jibun no manga o kakitai desu.', vi: 'Một ngày nào đó tôi muốn vẽ truyện tranh của chính mình.' },
      ],
    },
    {
      t: 'note',
      title: 'Viết đoạn "Sở thích của tôi" theo khung',
      items: [
        '**Câu 1 — sở thích:** {私|わたし}の{趣味|しゅみ}は ___ (V thể từ điển) ことです。',
        '**Câu 2 — bao lâu một lần:** {1週間|いっしゅうかん}／{1か月|いっかげつ}に ___{回|かい}（くらい）___ます。',
        '**Câu 3 — đặc biệt:** {特|とく}に、___ が{好|す}きです。',
        '**Câu 4 — làm được / không:** ___ ことができます／できません。',
        '**Câu 5 — "nhưng" + mong muốn:** でも、___。／いつか ___ たいです。',
        'Từ thêm (không có trong ことば): {話|はなし} (câu chuyện), いつか (một ngày nào đó), {自分|じぶん} (bản thân) — chỉ cần hiểu.',
      ],
    },

    /* ── できる！ ── */
    { t: 'h', text: 'できる！— Thẻ sở thích ở buổi giao lưu' },
    {
      t: 'p',
      text: 'Nhiệm vụ như sách: ① viết sở thích của mình lên một tấm thẻ (カード) → ② xem thẻ của mọi người, chọn người mình muốn nghe chuyện và ghép cặp → ③ hỏi thật nhiều: **loại nào (どんな)**, **làm thế nào (どうやって)**, **làm sao cho giỏi**. Dưới đây là 4 tấm thẻ mẫu và câu hỏi nên dùng.',
    },
    {
      t: 'table',
      caption: 'Thẻ sở thích (tự đặt)',
      head: ['Tên', 'Sở thích (～ことです)', 'Đặc biệt', 'Bao lâu một lần'],
      rows: [
        ['メアリー', '{絵|え}を{見|み}ること', 'ピカソの{絵|え}', '{1か月|いっかげつ}に{1|いち}、{2回|にかい}'],
        ['カルロス', '{釣|つ}りをすること', '{海|うみ}の{釣|つ}り', '{1か月|いっかげつ}に{2回|にかい}くらい'],
        ['{山口|やまぐち}', 'お{菓子|かし}を{作|つく}ること', 'ケーキ', '{1週間|いっしゅうかん}に{1回|いっかい}'],
        ['ナタポン', 'プールで{泳|およ}ぐこと', '—', '{1週間|いっしゅうかん}に{3回|さんかい}'],
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'どんなお{菓子|かし}を{作|つく}りますか。', ro: 'Donna okashi o tsukurimasu ka.', vi: 'Bạn làm bánh kẹo gì?' },
        { en: 'どうやってケーキを{作|つく}りますか。', ro: 'Dou yatte keeki o tsukurimasu ka.', vi: 'Làm bánh kem thế nào?' },
        { en: 'どこで{泳|およ}ぎますか。——{駅|えき}の{近|ちか}くのプールで{泳|およ}ぎます。', ro: 'Doko de oyogimasu ka. — Eki no chikaku no puuru de oyogimasu.', vi: 'Bạn bơi ở đâu? — Tôi bơi ở bể bơi gần ga.' },
        { en: '{私|わたし}も{釣|つ}りが{好|す}きです。{今度|こんど}、{一緒|いっしょ}に{行|い}きませんか。', ro: 'Watashi mo tsuri ga suki desu. Kondo, issho ni ikimasen ka.', vi: 'Tôi cũng thích câu cá. Lần tới cùng đi không? — rủ người cùng sở thích (Bài 6).' },
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */
/* Đủ 61 mục trang ことば p.167, chia 8 nhóm:
 * 11 + 8 + 4 + 9 (= 32, chủ đề 1) + 7 + 9 (= 16, chủ đề 2) + 7 + 6 (= 13, chủ đề 3) = 61. */

const TU_VUNG: Lesson = {
  id: 'b9-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 61 từ trang ことば Bài 9',
  goal: 'Thuộc đủ 61 mục từ trang ことば của Bài 9 (sở thích, đơn vị đếm, tần suất, câu lạc bộ – lớp học, thủ tục); mỗi động từ biết luôn THỂ TỪ ĐIỂN.',
  minutes: 45,
  blocks: [
    {
      t: 'p',
      text: 'Cô chỉ phát danh sách từ đến Bài 7, nên Bài 9 lấy **trang ことば (p.167)** làm chuẩn: đủ **61 mục**, theo đúng ba chủ đề của sách (32 + 16 + 13). Động từ ghi cả **thể ます** và **thể từ điển** trong ngoặc vuông ［ ］ + số nhóm — Bài 9 bắt đầu dùng thể từ điển nên học từ mới là học luôn cả hai dạng. Câu ví dụ chỉ dùng từ Bài 1–9.',
    },
    {
      t: 'note',
      title: 'Cách đọc romaji và ký hiệu trong bài',
      items: [
        'Trường âm viết theo đúng chữ kana: {小説|しょうせつ} → **shousetsu**, {書道|しょどう} → shodou, {住所|じゅうしょ} → **juusho**, プール → **puuru**, カード → kaado.',
        'Âm ngắt っ viết đôi phụ âm: {切手|きって} → **kitte**, {1週間|いっしゅうかん} → **isshuukan**, {1か月|いっかげつ} → **ikkagetsu**, クラシック → kurashikku.',
        '**［{泳|およ}ぐ］1** = thể từ điển, nhóm 1. Nhóm 2 đuôi ～る, nhóm 3 là する／{来|く}る. Cách đổi xem ở **Ngữ pháp · Thể từ điển**.',
      ],
    },

    { t: 'h', text: 'A. Sở thích: thể loại, đồ sưu tầm, món (11 từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'アクション', pos: 'danh từ', ipa: 'akushon', vi: 'hành động (phim hành động = アクション{映画|えいが})', ex: 'アクション{映画|えいが}をよく{見|み}ます。', exRo: 'Akushon eiga o yoku mimasu.', exVi: 'Tôi hay xem phim hành động.' },
        { w: '（お）{菓子|かし}', pos: 'danh từ', ipa: '(o)kashi', vi: 'bánh kẹo (お菓子 lịch sự hơn; お菓子教室 = lớp làm bánh)', ex: '{私|わたし}の{趣味|しゅみ}はお{菓子|かし}を{作|つく}ることです。', exRo: 'Watashi no shumi wa okashi o tsukuru koto desu.', exVi: 'Sở thích của tôi là làm bánh kẹo.' },
        { w: '{切手|きって}', pos: 'danh từ', ipa: 'kitte', vi: 'tem thư', ex: '{花|はな}の{切手|きって}を{集|あつ}めています。', exRo: 'Hana no kitte o atsumete imasu.', exVi: 'Tôi đang sưu tầm tem hình hoa.' },
        { w: 'クラシック', pos: 'danh từ', ipa: 'kurashikku', vi: 'nhạc cổ điển', ex: 'ピアノでクラシックを{弾|ひ}きます。', exRo: 'Piano de kurashikku o hikimasu.', exVi: 'Tôi chơi nhạc cổ điển bằng piano.' },
        { w: 'ポップス', pos: 'danh từ', ipa: 'poppusu', vi: 'nhạc pop', ex: '{日本|にほん}のポップスをよく{聞|き}きます。', exRo: 'Nihon no poppusu o yoku kikimasu.', exVi: 'Tôi hay nghe nhạc pop Nhật.' },
        { w: '{小説|しょうせつ}', pos: 'danh từ', ipa: 'shousetsu', vi: 'tiểu thuyết', ex: '{1か月|いっかげつ}に{2冊|にさつ}{小説|しょうせつ}を{読|よ}みます。', exRo: 'Ikkagetsu ni nisatsu shousetsu o yomimasu.', exVi: 'Một tháng tôi đọc 2 cuốn tiểu thuyết.' },
        { w: '{漫画|まんが}', pos: 'danh từ', ipa: 'manga', vi: 'truyện tranh (manga)', ex: '{電車|でんしゃ}の{中|なか}で{漫画|まんが}を{読|よ}みます。', exRo: 'Densha no naka de manga o yomimasu.', exVi: 'Tôi đọc truyện tranh trên tàu điện.' },
        { w: '{釣|つ}り', pos: 'danh từ', ipa: 'tsuri', vi: 'câu cá (釣りをします = đi câu)', ex: '{週末|しゅうまつ}、{海|うみ}で{釣|つ}りをします。', exRo: 'Shuumatsu, umi de tsuri o shimasu.', exVi: 'Cuối tuần tôi câu cá ở biển.' },
        { w: 'ドラマ', pos: 'danh từ', ipa: 'dorama', vi: 'phim truyền hình (phim bộ)', ex: '{韓国|かんこく}のドラマをときどき{見|み}ます。', exRo: 'Kankoku no dorama o tokidoki mimasu.', exVi: 'Thỉnh thoảng tôi xem phim bộ Hàn.' },
        { w: 'プール', pos: 'danh từ', ipa: 'puuru', vi: 'bể bơi', ex: '{毎朝|まいあさ}、プールで{泳|およ}ぎます。', exRo: 'Maiasa, puuru de oyogimasu.', exVi: 'Sáng nào tôi cũng bơi ở bể bơi.' },
        { w: '～{料理|りょうり}', pos: 'hậu tố', ipa: '~ryouri', vi: 'món ~, ẩm thực ~ (イタリア料理 = món Ý, 日本料理 = món Nhật)', ex: 'イタリア{料理|りょうり}を{作|つく}ることができます。', exRo: 'Itaria ryouri o tsukuru koto ga dekimasu.', exVi: 'Tôi nấu được món Ý.' },
      ],
    },

    { t: 'h', text: 'B. Khoảng thời gian & đơn vị đếm (8 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '～{日|にち}', pos: 'hậu tố', ipa: '~nichi', vi: '~ ngày (khoảng thời gian: 1日 いちにち, 2日 ふつか, 3日 みっか…)', ex: '{1日|いちにち}に{2時間|にじかん}ピアノを{弾|ひ}きます。', exRo: 'Ichinichi ni nijikan piano o hikimasu.', exVi: 'Một ngày tôi chơi piano 2 tiếng.' },
        { w: '～{週間|しゅうかん}', pos: 'hậu tố', ipa: '~shuukan', vi: '~ tuần (khoảng thời gian: 1週間 いっしゅうかん)', ex: '{1週間|いっしゅうかん}に{3回|さんかい}{泳|およ}ぎます。', exRo: 'Isshuukan ni sankai oyogimasu.', exVi: 'Một tuần tôi bơi 3 lần.' },
        { w: '～か{月|げつ}', pos: 'hậu tố', ipa: '~kagetsu', vi: '~ tháng (khoảng thời gian: 1か月 いっかげつ; khác 1月 いちがつ = tháng Một)', ex: '{1か月|いっかげつ}に{1回|いっかい}{山|やま}に{登|のぼ}ります。', exRo: 'Ikkagetsu ni ikkai yama ni noborimasu.', exVi: 'Một tháng tôi leo núi 1 lần.' },
        { w: '～{年|ねん}', pos: 'hậu tố', ipa: '~nen', vi: '~ năm (1年 いちねん, 4年 よねん)', ex: '{1年|いちねん}に{2回|にかい}{国|くに}へ{帰|かえ}ります。', exRo: 'Ichinen ni nikai kuni e kaerimasu.', exVi: 'Một năm tôi về nước 2 lần.' },
        { w: '～{回|かい}', pos: 'hậu tố đếm', ipa: '~kai', vi: '~ lần (1回 いっかい, 6回 ろっかい, 8回 はっかい, 10回 じゅっかい; 何回 なんかい)', ex: '{1週間|いっしゅうかん}に{何回|なんかい}ジムへ{行|い}きますか。', exRo: 'Isshuukan ni nankai jimu e ikimasu ka.', exVi: 'Một tuần bạn đi phòng tập mấy lần?' },
        { w: '～{冊|さつ}', pos: 'hậu tố đếm', ipa: '~satsu', vi: '~ quyển, cuốn (sách, vở, tạp chí; 1冊 いっさつ)', ex: '{1週間|いっしゅうかん}に{2|に}、{3冊|さんさつ}{本|ほん}を{読|よ}みます。', exRo: 'Isshuukan ni ni, sansatsu hon o yomimasu.', exVi: 'Một tuần tôi đọc 2, 3 quyển sách.' },
        { w: '～{杯|はい}', pos: 'hậu tố đếm', ipa: '~hai', vi: '~ cốc, ly, bát (1杯 いっぱい, 3杯 さんばい, 6杯 ろっぱい)', ex: '{1日|いちにち}にコーヒーを{3杯|さんばい}{飲|の}みます。', exRo: 'Ichinichi ni koohii o sanbai nomimasu.', exVi: 'Một ngày tôi uống 3 cốc cà phê.' },
        { w: '～{本|ほん}', pos: 'hậu tố đếm', ipa: '~hon', vi: '~ chai, cây, cái (vật dài: chai, bút, ô; 1本 いっぽん, 3本 さんぼん)', ex: '{1日|いちにち}にジュースを{1本|いっぽん}{飲|の}みます。', exRo: 'Ichinichi ni juusu o ippon nomimasu.', exVi: 'Một ngày tôi uống 1 chai nước ép.' },
      ],
    },

    { t: 'h', text: 'C. Động từ — chủ đề 1 (4 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{泳|およ}ぎます［{泳|およ}ぐ］1', pos: 'động từ nhóm 1', ipa: 'oyogimasu [oyogu]', vi: 'bơi', ex: '{私|わたし}は{泳|およ}ぐことができません。', exRo: 'Watashi wa oyogu koto ga dekimasen.', exVi: 'Tôi không bơi được.' },
        { w: '{描|か}きます［{描|か}く］1', pos: 'động từ nhóm 1', ipa: 'kakimasu [kaku]', vi: 'vẽ (tranh) — cùng âm với {書|か}きます (viết chữ)', ex: '{趣味|しゅみ}は{絵|え}を{描|か}くことです。', exRo: 'Shumi wa e o kaku koto desu.', exVi: 'Sở thích của tôi là vẽ tranh.' },
        { w: '{集|あつ}めます［{集|あつ}める］2', pos: 'động từ nhóm 2', ipa: 'atsumemasu [atsumeru]', vi: 'sưu tầm, thu thập', ex: '{趣味|しゅみ}は{切手|きって}を{集|あつ}めることです。', exRo: 'Shumi wa kitte o atsumeru koto desu.', exVi: 'Sở thích của tôi là sưu tầm tem.' },
        { w: '{運転|うんてん}します［{運転|うんてん}する］3', pos: 'động từ nhóm 3', ipa: 'unten shimasu [unten suru]', vi: 'lái (xe) (車を運転します; 運転ができます = biết lái)', ex: '{私|わたし}は{車|くるま}の{運転|うんてん}ができます。', exRo: 'Watashi wa kuruma no unten ga dekimasu.', exVi: 'Tôi biết lái ô tô.' },
      ],
    },

    { t: 'h', text: 'D. Tần suất, "đặc biệt", "nhưng", "chỉ" (9 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{最近|さいきん}', pos: 'danh từ / phó từ', ipa: 'saikin', vi: 'gần đây, dạo này', ex: '{最近|さいきん}、{全然|ぜんぜん}{泳|およ}ぎません。', exRo: 'Saikin, zenzen oyogimasen.', exVi: 'Dạo này tôi hoàn toàn không bơi.' },
        { w: '{特|とく}に', pos: 'phó từ', ipa: 'toku ni', vi: 'đặc biệt là', ex: '{音楽|おんがく}が{好|す}きです。{特|とく}に、ジャズが{好|す}きです。', exRo: 'Ongaku ga suki desu. Toku ni, jazu ga suki desu.', exVi: 'Tôi thích âm nhạc. Đặc biệt là nhạc jazz.' },
        { w: 'いつも', pos: 'phó từ', ipa: 'itsumo', vi: 'luôn luôn, lúc nào cũng', ex: '{朝|あさ}ご{飯|はん}はいつもパンを{食|た}べます。', exRo: 'Asagohan wa itsumo pan o tabemasu.', exVi: 'Bữa sáng tôi luôn ăn bánh mì.' },
        { w: 'よく', pos: 'phó từ', ipa: 'yoku', vi: 'thường, hay', ex: '{私|わたし}はよく{映画|えいが}を{見|み}ます。', exRo: 'Watashi wa yoku eiga o mimasu.', exVi: 'Tôi hay xem phim.' },
        { w: 'ときどき', pos: 'phó từ', ipa: 'tokidoki', vi: 'thỉnh thoảng', ex: 'ときどき{友達|ともだち}とカラオケに{行|い}きます。', exRo: 'Tokidoki tomodachi to karaoke ni ikimasu.', exVi: 'Thỉnh thoảng tôi đi karaoke với bạn.' },
        { w: 'あまり', pos: 'phó từ', ipa: 'amari', vi: '(không) mấy, (không) lắm — đi với thể phủ định', ex: 'あまりテレビを{見|み}ません。', exRo: 'Amari terebi o mimasen.', exVi: 'Tôi không xem tivi mấy.' },
        { w: '{全然|ぜんぜん}', pos: 'phó từ', ipa: 'zenzen', vi: 'hoàn toàn (không) — đi với thể phủ định', ex: 'お{酒|さけ}は{全然|ぜんぜん}{飲|の}みません。', exRo: 'Osake wa zenzen nomimasen.', exVi: 'Rượu thì tôi hoàn toàn không uống.' },
        { w: 'でも', pos: 'liên từ', ipa: 'demo', vi: 'nhưng (đứng đầu câu sau)', ex: 'サッカーが{好|す}きです。でも、{上手|じょうず}じゃありません。', exRo: 'Sakkaa ga suki desu. Demo, jouzu ja arimasen.', exVi: 'Tôi thích bóng đá. Nhưng tôi không giỏi.' },
        { w: 'だけ', pos: 'trợ từ', ipa: 'dake', vi: 'chỉ (đứng sau từ được giới hạn)', ex: '{日曜日|にちようび}だけ{料理|りょうり}をします。', exRo: 'Nichiyoubi dake ryouri o shimasu.', exVi: 'Tôi chỉ nấu ăn vào Chủ Nhật.' },
      ],
    },

    { t: 'h', text: 'E. Bảng thông báo: sự kiện, CLB, lớp học (7 từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'イベント', pos: 'danh từ', ipa: 'ibento', vi: 'sự kiện', ex: 'いろいろなイベントがありますね。', exRo: 'Iroiro na ibento ga arimasu ne.', exVi: 'Có nhiều sự kiện nhỉ.' },
        { w: 'コンテスト', pos: 'danh từ', ipa: 'kontesuto', vi: 'cuộc thi', ex: 'ケーキコンテストに{参加|さんか}します。', exRo: 'Keeki kontesuto ni sanka shimasu.', exVi: 'Tôi tham gia cuộc thi làm bánh.' },
        { w: '{書道|しょどう}', pos: 'danh từ', ipa: 'shodou', vi: 'thư pháp (viết chữ bằng bút lông)', ex: '{書道|しょどう}を{習|なら}いたいです。', exRo: 'Shodou o naraitai desu.', exVi: 'Tôi muốn học thư pháp.' },
        { w: 'ダイビング', pos: 'danh từ', ipa: 'daibingu', vi: 'lặn biển', ex: '{沖縄|おきなわ}でダイビングをしました。', exRo: 'Okinawa de daibingu o shimashita.', exVi: 'Tôi đã lặn biển ở Okinawa.' },
        { w: 'ダンス', pos: 'danh từ', ipa: 'dansu', vi: 'nhảy, khiêu vũ', ex: '{私|わたし}はダンスが{全然|ぜんぜん}できません。', exRo: 'Watashi wa dansu ga zenzen dekimasen.', exVi: 'Tôi hoàn toàn không nhảy được.' },
        { w: '～クラブ', pos: 'hậu tố', ipa: '~kurabu', vi: 'câu lạc bộ ~ (ダンスクラブ, ジャズピアノクラブ)', ex: 'ダンスクラブに{入|はい}りませんか。', exRo: 'Dansu kurabu ni hairimasen ka.', exVi: 'Vào CLB nhảy không?' },
        { w: '～{教室|きょうしつ}', pos: 'hậu tố', ipa: '~kyoushitsu', vi: 'lớp học ~ (書道教室, 料理教室) — 教室 một mình = phòng học', ex: '{書道|しょどう}{教室|きょうしつ}は{毎週|まいしゅう}{水曜日|すいようび}です。', exRo: 'Shodou kyoushitsu wa maishuu suiyoubi desu.', exVi: 'Lớp thư pháp vào thứ Tư hằng tuần.' },
      ],
    },

    { t: 'h', text: 'F. Tham gia, làm được — động từ & tính từ chủ đề 2 (9 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{習|なら}います［{習|なら}う］1', pos: 'động từ nhóm 1', ipa: 'naraimasu [narau]', vi: 'học (từ thầy, có người dạy — học đàn, học nhảy)', ex: '{先生|せんせい}にピアノを{習|なら}います。', exRo: 'Sensei ni piano o naraimasu.', exVi: 'Tôi học piano với thầy.' },
        { w: '{乗|の}ります［{乗|の}る］1', pos: 'động từ nhóm 1', ipa: 'norimasu [noru]', vi: 'lên, đi (xe, tàu) — N **に** 乗ります', ex: '{駅|えき}でバスに{乗|の}ります。', exRo: 'Eki de basu ni norimasu.', exVi: 'Tôi lên xe buýt ở ga.' },
        { w: '{入|はい}ります［{入|はい}る］1', pos: 'động từ nhóm 1', ipa: 'hairimasu [hairu]', vi: 'vào (CLB, phòng) — N **に** 入ります', ex: 'ダンスクラブに{入|はい}ります。', exRo: 'Dansu kurabu ni hairimasu.', exVi: 'Tôi vào câu lạc bộ nhảy.' },
        { w: '{申|もう}し{込|こ}みます［{申|もう}し{込|こ}む］1', pos: 'động từ nhóm 1', ipa: 'moushikomimasu [moushikomu]', vi: 'đăng ký (tham gia) — N **に** 申し込みます', ex: '{料理|りょうり}{教室|きょうしつ}に{申|もう}し{込|こ}みます。', exRo: 'Ryouri kyoushitsu ni moushikomimasu.', exVi: 'Tôi đăng ký lớp nấu ăn.' },
        { w: 'できます［できる］2', pos: 'động từ nhóm 2', ipa: 'dekimasu [dekiru]', vi: 'có thể, làm được — N **が** できます', ex: 'スキーができます。', exRo: 'Sukii ga dekimasu.', exVi: 'Tôi trượt tuyết được.' },
        { w: '{参加|さんか}します［{参加|さんか}する］3', pos: 'động từ nhóm 3', ipa: 'sanka shimasu [sanka suru]', vi: 'tham gia (sự kiện, cuộc thi, chuyến đi) — N **に** 参加します', ex: 'スキー{旅行|りょこう}に{参加|さんか}したいです。', exRo: 'Sukii ryokou ni sanka shitai desu.', exVi: 'Tôi muốn tham gia chuyến trượt tuyết.' },
        { w: 'すごい', pos: 'tính từ đuôi い', ipa: 'sugoi', vi: 'giỏi quá, tuyệt quá, ghê (khen, ngạc nhiên)', ex: 'えっ、{3|みっ}つの{国|くに}の{言葉|ことば}ができますか。すごいですね。', exRo: 'E, mittsu no kuni no kotoba ga dekimasu ka. Sugoi desu ne.', exVi: 'Hả, bạn biết tiếng của 3 nước à? Giỏi quá.' },
        { w: 'いろいろ（な）', pos: 'tính từ đuôi な', ipa: 'iroiro (na)', vi: 'nhiều loại, đủ thứ', ex: 'いろいろな{国|くに}の{料理|りょうり}を{作|つく}ります。', exRo: 'Iroiro na kuni no ryouri o tsukurimasu.', exVi: 'Tôi nấu món của nhiều nước.' },
        { w: '{上手|じょうず}に', pos: 'phó từ', ipa: 'jouzu ni', vi: 'một cách giỏi, khéo (上手 + に đứng trước động từ)', ex: '{上手|じょうず}に{日本語|にほんご}を{話|はな}すことができません。', exRo: 'Jouzu ni nihongo o hanasu koto ga dekimasen.', exVi: 'Tôi không nói tiếng Nhật giỏi được.' },
      ],
    },

    { t: 'h', text: 'G. Thủ tục, giấy tờ (7 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{受付|うけつけ}', pos: 'danh từ', ipa: 'uketsuke', vi: 'quầy tiếp tân, quầy lễ tân', ex: '{受付|うけつけ}で{名前|なまえ}を{書|か}いてください。', exRo: 'Uketsuke de namae o kaite kudasai.', exVi: 'Hãy viết tên ở quầy tiếp tân.' },
        { w: 'カード', pos: 'danh từ', ipa: 'kaado', vi: 'thẻ (thẻ thư viện, thẻ ghi chú…)', ex: '{図書館|としょかん}のカードを{作|つく}ります。', exRo: 'Toshokan no kaado o tsukurimasu.', exVi: 'Tôi làm thẻ thư viện.' },
        { w: '{外国人登録証|がいこくじんとうろくしょう}', pos: 'danh từ', ipa: 'gaikokujin tourokushou', vi: 'thẻ đăng ký người nước ngoài (giấy tờ tuỳ thân của người nước ngoài ở Nhật)', ex: '{外国人登録証|がいこくじんとうろくしょう}を{見|み}せてください。', exRo: 'Gaikokujin tourokushou o misete kudasai.', exVi: 'Xin cho xem thẻ đăng ký người nước ngoài.' },
        { w: '{住所|じゅうしょ}', pos: 'danh từ', ipa: 'juusho', vi: 'địa chỉ', ex: 'ここに{住所|じゅうしょ}を{書|か}いてください。', exRo: 'Koko ni juusho o kaite kudasai.', exVi: 'Hãy viết địa chỉ vào đây.' },
        { w: '{宿題|しゅくだい}', pos: 'danh từ', ipa: 'shukudai', vi: 'bài tập về nhà (宿題をします)', ex: '{宿題|しゅくだい}をして、{寝|ね}ました。', exRo: 'Shukudai o shite, nemashita.', exVi: 'Tôi làm bài tập rồi đi ngủ.' },
        { w: '{電話番号|でんわばんごう}', pos: 'danh từ', ipa: 'denwa bangou', vi: 'số điện thoại', ex: 'この{電話番号|でんわばんごう}に{電話|でんわ}してください。', exRo: 'Kono denwa bangou ni denwa shite kudasai.', exVi: 'Hãy gọi vào số điện thoại này.' },
        { w: '～{番|ばん}', pos: 'hậu tố', ipa: '~ban', vi: 'số ~ (số thứ tự: 3番のバス = xe buýt số 3; 何番 = số mấy)', ex: '{何番|なんばん}のバスに{乗|の}りますか。——{3番|さんばん}です。', exRo: 'Nanban no basu ni norimasu ka. — Sanban desu.', exVi: 'Đi xe buýt số mấy? — Số 3.' },
      ],
    },

    { t: 'h', text: 'H. Làm thủ tục, đi lại — động từ & từ hỏi (6 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{言|い}います［{言|い}う］1', pos: 'động từ nhóm 1', ipa: 'iimasu [iu]', vi: 'nói (nói ra thông tin: tên, địa chỉ)', ex: '{名前|なまえ}と{住所|じゅうしょ}を{言|い}ってください。', exRo: 'Namae to juusho o itte kudasai.', exVi: 'Hãy nói tên và địa chỉ.' },
        { w: '{払|はら}います［{払|はら}う］1', pos: 'động từ nhóm 1', ipa: 'haraimasu [harau]', vi: 'trả (tiền)', ex: 'コンビニでお{金|かね}を{払|はら}います。', exRo: 'Konbini de okane o haraimasu.', exVi: 'Trả tiền ở cửa hàng tiện lợi.' },
        { w: '{降|お}ります［{降|お}りる］2', pos: 'động từ nhóm 2', ipa: 'orimasu [oriru]', vi: 'xuống (xe, tàu) — N **を** 降ります; nơi xuống: ～**で** 降ります', ex: '{美術館|びじゅつかん}{前|まえ}でバスを{降|お}ります。', exRo: 'Bijutsukan mae de basu o orimasu.', exVi: 'Xuống xe buýt ở trạm trước bảo tàng.' },
        { w: '{見|み}せます［{見|み}せる］2', pos: 'động từ nhóm 2', ipa: 'misemasu [miseru]', vi: 'cho xem, đưa ra xem', ex: '{受付|うけつけ}でカードを{見|み}せます。', exRo: 'Uketsuke de kaado o misemasu.', exVi: 'Đưa thẻ cho quầy tiếp tân xem.' },
        { w: '{予約|よやく}します［{予約|よやく}する］3', pos: 'động từ nhóm 3', ipa: 'yoyaku shimasu [yoyaku suru]', vi: 'đặt trước (vé, bàn, phòng)', ex: 'インターネットでチケットを{予約|よやく}します。', exRo: 'Intaanetto de chiketto o yoyaku shimasu.', exVi: 'Đặt vé trước trên mạng.' },
        { w: 'どうやって', pos: 'từ để hỏi', ipa: 'dou yatte', vi: 'làm thế nào, bằng cách nào (hỏi cách làm / đường đi)', ex: 'どうやって{駅|えき}へ{行|い}きますか。', exRo: 'Dou yatte eki e ikimasu ka.', exVi: 'Đi đến ga bằng cách nào?' },
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp trong từ bài 9',
      items: [
        '**{描|か}きます ↔ {書|か}きます**: cùng đọc かきます. Vẽ TRANH → 描きます; viết CHỮ → 書きます. {絵|え}を{描|か}きます · {漢字|かんじ}を{書|か}きます.',
        '**{入|はい}ります, {帰|かえ}ります, {切|き}ります** trông như nhóm 2 nhưng là **nhóm 1** → thể từ điển {入|はい}る, {帰|かえ}る (không phải ~~{入|はい}りる~~). Còn **{降|お}ります, {見|み}ます, {起|お}きます** là **nhóm 2** → {降|お}りる, {見|み}る.',
        'Trợ từ đi với động từ mới: バス**に**{乗|の}ります · バス**を**{降|お}ります · クラブ**に**{入|はい}ります · {教室|きょうしつ}**に**{申|もう}し{込|こ}みます · {旅行|りょこう}**に**{参加|さんか}します · スキー**が**できます.',
        '**あまり, {全然|ぜんぜん}** chỉ đi với **phủ định** (～ません). ~~あまり{見|み}ます~~, ~~{全然|ぜんぜん}{見|み}ます~~ là sai.',
        '**{1か月|いっかげつ}** (một tháng — khoảng thời gian) ≠ **{1月|いちがつ}** (tháng Một). **{1日|いちにち}** (một ngày) ≠ **{1日|ついたち}** (mùng 1).',
        '**{習|なら}います** = học có người dạy (đàn, nhảy, nấu ăn); **{勉強|べんきょう}します** = tự học một môn (tiếng Nhật, toán).',
      ],
    },

    { t: 'h', text: 'Từ thêm (xuất hiện trong bài, không có ở trang ことば — chỉ cần nghe hiểu)' },
    {
      t: 'table',
      head: ['Từ / câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['{趣味|しゅみ}', 'shumi', 'Sở thích (từ khoá của cả bài)'],
        ['{交流会|こうりゅうかい}', 'kouryuukai', 'Buổi giao lưu'],
        ['{掲示板|けいじばん}', 'keijiban', 'Bảng thông báo'],
        ['{美術館|びじゅつかん}', 'bijutsukan', 'Bảo tàng mỹ thuật'],
        ['{景色|けしき}', 'keshiki', 'Phong cảnh (Bài 6 đã gặp)'],
        ['ジム', 'jimu', 'Phòng tập thể hình'],
        ['ミュージカル', 'myuujikaru', 'Nhạc kịch (bài 話読聞書 của sách)'],
        ['{楽|たの}しみです', 'tanoshimi desu', 'Mong chờ lắm'],
        ['{買|か}い{方|かた}', 'kaikata', 'Cách mua (V bỏ ます + 方 — Bài 7)'],
        ['{毎週|まいしゅう}・{毎年|まいとし}', 'maishuu · maitoshi', 'Hằng tuần · hằng năm'],
        ['くらい', 'kurai', 'Khoảng (sau số lượng: 2回くらい)'],
        ['{言葉|ことば}', 'kotoba', 'Từ ngữ, tiếng (ngôn ngữ)'],
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b9-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp — ポイント 81–87 + thể từ điển (辞書形)',
  goal: 'Đổi được mọi động từ từ thể ます sang THỂ TỪ ĐIỂN (3 nhóm), nói sở thích bằng ～ことです, việc làm được bằng ～ができます／～ことができます, kể nhiều việc theo thứ tự bằng Vて、Vて, nói tần suất (1週間に2回 · よく／あまり), hỏi cách làm bằng どうやって và nối hai câu bằng でも.',
  minutes: 90,
  blocks: [
    {
      t: 'p',
      text: 'Bài 9 có **7 điểm ngữ pháp** (ポイント 81–87) và một **hình thái động từ mới: THỂ TỪ ĐIỂN (辞書形 jishokei)** — dạng động từ in trong từ điển, dạng "gốc" của động từ. Hai ポイント đầu (81, 82) cần thể này. Học thể từ điển TRƯỚC, rồi 81 → 87 theo đúng ba tình huống: **sở thích** (81, 84, 85, 87), **làm được** (82), **cuối tuần và cách làm** (83, 86).',
    },
    {
      t: 'table',
      caption: 'Bản đồ 7 điểm ngữ pháp Bài 9',
      head: ['ポイント', 'Mẫu', 'Nghĩa', 'Ví dụ ngắn'],
      rows: [
        ['81', 'V辞書形 こと', '"việc V" — biến động từ thành danh từ', '{趣味|しゅみ}は{映画|えいが}を{見|み}ることです。'],
        ['82', '｛N／V辞書形こと｝ が できます', 'Làm được, biết (làm) N / V', 'スキーができます。{料理|りょうり}を{作|つく}ることができません。'],
        ['83', 'Vて、___', 'Làm V1 rồi V2 rồi V3 (theo thứ tự)', '{ご飯|ごはん}を{食|た}べて、{映画|えいが}を{見|み}ます。'],
        ['84', '[～日・～週間…] に [～回・～本…]', 'Trong một khoảng thời gian, bao nhiêu lần / bao nhiêu cái', '{1週間|いっしゅうかん}に{2回|にかい}{電話|でんわ}します。'],
        ['85', 'いつも／よく／ときどき／あまり／{全然|ぜんぜん}', 'Mức độ thường xuyên', 'よくしますか。——いいえ、あまりしません。'],
        ['86', 'どうやって', 'Làm thế nào, bằng cách nào', 'どうやって{美術館|びじゅつかん}へ{行|い}きますか。'],
        ['87', 'でも', 'Nhưng (đầu câu thứ hai)', 'スポーツが{好|す}きです。でも、{最近|さいきん}{全然|ぜんぜん}しません。'],
      ],
    },

    /* ── Thể từ điển ── */
    { t: 'h', text: 'Chuẩn bị — THỂ TỪ ĐIỂN (辞書形): đổi ～ます → dạng từ điển, đủ 3 nhóm' },
    {
      t: 'p',
      text: 'Đến giờ bạn nói động từ ở **thể ます** (lịch sự). Mỗi động từ còn một **thể từ điển** — dạng ngắn, là dạng tra trong từ điển, và là dạng phải đứng trước **こと** (ポイント 81, 82), sau này trước **とき**, **{前|まえ}に** (Bài 11, 12). Cách đổi phụ thuộc **nhóm** của động từ. Nhóm đã học ở Bài 7 (thể て) — dùng lại y nguyên.',
    },
    {
      t: 'table',
      caption: 'Bước 1 — Nhận ra nhóm của động từ (nhìn âm ngay trước ます)',
      head: ['Nhóm', 'Nhận dạng', 'Ví dụ', 'Ngoại lệ phải thuộc'],
      rows: [
        ['**Nhóm 1** (グループ1)', 'Trước ます là âm hàng **い** (い・き・ぎ・し・ち・に・び・み・り)', '{聞|き}きます · {飲|の}みます · {帰|かえ}ります · {習|なら}います', '{入|はい}ります, {帰|かえ}ります, {切|き}ります, {走|はし}ります… trông giống nhóm 2 nhưng là **nhóm 1**'],
        ['**Nhóm 2** (グループ2)', 'Trước ます là âm hàng **え** (べ・め・せ・け・て…)', '{食|た}べます · {集|あつ}めます · {見|み}せます · {教|おし}えます', 'Một số động từ âm hàng **い** vẫn là nhóm 2: {見|み}ます, {起|お}きます, {借|か}ります, {降|お}ります, います, できます'],
        ['**Nhóm 3** (グループ3)', 'します và {来|き}ます (+ mọi động từ N＋します)', 'します · {来|き}ます · {運転|うんてん}します · {参加|さんか}します · {予約|よやく}します', '—'],
      ],
    },
    {
      t: 'table',
      caption: 'Bước 2 — Quy tắc đổi (表 p.282–283)',
      head: ['Nhóm', 'Quy tắc', 'Ví dụ'],
      rows: [
        ['1', 'Bỏ ます, đổi âm **hàng い → hàng う** cùng cột: き→**く**, ぎ→**ぐ**, し→**す**, ち→**つ**, に→**ぬ**, び→**ぶ**, み→**む**, り→**る**, い→**う**', '{聞|き}**き**ます → {聞|き}**く** · {泳|およ}**ぎ**ます → {泳|およ}**ぐ** · {使|つか}**い**ます → {使|つか}**う**'],
        ['2', 'Bỏ ます, thêm **る**', '{食|た}べます → {食|た}べ**る** · {見|み}ます → {見|み}**る**'],
        ['3', 'Thuộc lòng: します → **する** · {来|き}ます → **{来|く}る** (đọc **くる**, không phải きる)', '{勉強|べんきょう}します → {勉強|べんきょう}**する** · {予約|よやく}します → {予約|よやく}**する**'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng động từ của sách (表 p.282–283) — thể ます · thể て (Bài 7) · THỂ TỪ ĐIỂN (Bài 9)',
      head: ['Nhóm', 'Thể ます', 'Thể て【7課】', 'Thể từ điển【9課】', 'Romaji (từ điển)', 'Nghĩa'],
      rows: [
        ['1 (き→く)', '{聞|き}きます', '{聞|き}いて', '**{聞|き}く**', 'kiku', 'nghe, hỏi'],
        ['1 (ぎ→ぐ)', '{泳|およ}ぎます', '{泳|およ}いで', '**{泳|およ}ぐ**', 'oyogu', 'bơi'],
        ['1 (し→す)', '{話|はな}します', '{話|はな}して', '**{話|はな}す**', 'hanasu', 'nói chuyện'],
        ['1 (ち→つ)', '{持|も}ちます', '{持|も}って', '**{持|も}つ**', 'motsu', 'cầm, mang'],
        ['1 (に→ぬ)', '{死|し}にます', '{死|し}んで', '**{死|し}ぬ**', 'shinu', 'chết (động từ duy nhất đuôi ぬ)'],
        ['1 (び→ぶ)', '{遊|あそ}びます', '{遊|あそ}んで', '**{遊|あそ}ぶ**', 'asobu', 'chơi'],
        ['1 (み→む)', '{飲|の}みます', '{飲|の}んで', '**{飲|の}む**', 'nomu', 'uống'],
        ['1 (り→る)', '{帰|かえ}ります', '{帰|かえ}って', '**{帰|かえ}る**', 'kaeru', 'về'],
        ['1 (い→う)', '{使|つか}います', '{使|つか}って', '**{使|つか}う**', 'tsukau', 'dùng'],
        ['1 (き→く)', '{行|い}きます', '※{行|い}って', '**{行|い}く**', 'iku', 'đi (thể て bất quy tắc, thể từ điển thì đều)'],
        ['2', '{食|た}べます', '{食|た}べて', '**{食|た}べる**', 'taberu', 'ăn'],
        ['2', '{起|お}きます', '{起|お}きて', '**{起|お}きる**', 'okiru', 'thức dậy'],
        ['3', 'します', 'して', '**する**', 'suru', 'làm'],
        ['3', '{来|き}ます', '{来|き}て', '**{来|く}る**', 'kuru', 'đến'],
      ],
    },
    {
      t: 'table',
      caption: 'Thêm động từ đã học — nhóm 1 (theo cột bổ sung của 表 p.283)',
      head: ['Thể ます', 'Thể từ điển', 'Romaji', 'Nghĩa'],
      rows: [
        ['{書|か}きます · {働|はたら}きます', '{書|か}く · {働|はたら}く', 'kaku · hataraku', 'viết · làm việc'],
        ['{急|いそ}ぎます · {脱|ぬ}ぎます', '{急|いそ}ぐ · {脱|ぬ}ぐ', 'isogu · nugu', 'vội · cởi'],
        ['{出|だ}します · {貸|か}します', '{出|だ}す · {貸|か}す', 'dasu · kasu', 'lấy ra, gửi · cho mượn'],
        ['{立|た}ちます · {待|ま}ちます', '{立|た}つ · {待|ま}つ', 'tatsu · matsu', 'đứng · đợi'],
        ['{飛|と}びます', '{飛|と}ぶ', 'tobu', 'bay'],
        ['{休|やす}みます · {読|よ}みます', '{休|やす}む · {読|よ}む', 'yasumu · yomu', 'nghỉ · đọc'],
        ['{作|つく}ります · {切|き}ります', '{作|つく}る · {切|き}る', 'tsukuru · kiru', 'làm, nấu · cắt'],
        ['{会|あ}います · {買|か}います', '{会|あ}う · {買|か}う', 'au · kau', 'gặp · mua'],
      ],
    },
    {
      t: 'table',
      caption: 'Thêm động từ đã học — nhóm 2 và nhóm 3 (表 p.283)',
      head: ['Nhóm', 'Thể ます', 'Thể từ điển', 'Romaji', 'Nghĩa'],
      rows: [
        ['2', '{寝|ね}ます · {教|おし}えます', '{寝|ね}る · {教|おし}える', 'neru · oshieru', 'ngủ · dạy'],
        ['2', '{見|み}ます · {借|か}ります', '{見|み}る · {借|か}りる', 'miru · kariru', 'xem · mượn (âm い nhưng là nhóm 2)'],
        ['3', '{勉強|べんきょう}します · {掃除|そうじ}します', '{勉強|べんきょう}する · {掃除|そうじ}する', 'benkyou suru · souji suru', 'học · dọn dẹp'],
        ['3', '{持|も}って{来|き}ます', '{持|も}って{来|く}る', 'motte kuru', 'mang đến'],
      ],
    },
    {
      t: 'table',
      caption: 'Động từ mới của Bài 9 — thể ます → thể từ điển (học thuộc cả cột)',
      head: ['Thể ます', 'Nhóm', 'Thể từ điển', 'Romaji', 'Nghĩa'],
      rows: [
        ['{泳|およ}ぎます', '1', '{泳|およ}ぐ', 'oyogu', 'bơi'],
        ['{描|か}きます', '1', '{描|か}く', 'kaku', 'vẽ'],
        ['{習|なら}います', '1', '{習|なら}う', 'narau', 'học (có thầy)'],
        ['{乗|の}ります', '1', '{乗|の}る', 'noru', 'lên (xe)'],
        ['{入|はい}ります', '1 ※', '{入|はい}る', 'hairu', 'vào'],
        ['{申|もう}し{込|こ}みます', '1', '{申|もう}し{込|こ}む', 'moushikomu', 'đăng ký'],
        ['{言|い}います', '1', '{言|い}う', 'iu', 'nói'],
        ['{払|はら}います', '1', '{払|はら}う', 'harau', 'trả tiền'],
        ['{集|あつ}めます', '2', '{集|あつ}める', 'atsumeru', 'sưu tầm'],
        ['{見|み}せます', '2', '{見|み}せる', 'miseru', 'cho xem'],
        ['{降|お}ります', '2 ※', '{降|お}りる', 'oriru', 'xuống (xe)'],
        ['できます', '2', 'できる', 'dekiru', 'làm được'],
        ['{運転|うんてん}します', '3', '{運転|うんてん}する', 'unten suru', 'lái xe'],
        ['{参加|さんか}します', '3', '{参加|さんか}する', 'sanka suru', 'tham gia'],
        ['{予約|よやく}します', '3', '{予約|よやく}する', 'yoyaku suru', 'đặt trước'],
      ],
    },
    {
      t: 'table',
      caption: 'Động từ Bài 1–8 hay dùng trong câu sở thích',
      head: ['Thể ます', 'Thể từ điển', 'Câu sở thích (ポイント 81)'],
      rows: [
        ['{見|み}ます (2)', '{見|み}る', '{映画|えいが}を{見|み}ることです。'],
        ['{聞|き}きます (1)', '{聞|き}く', '{音楽|おんがく}を{聞|き}くことです。'],
        ['{読|よ}みます (1)', '{読|よ}む', '{本|ほん}を{読|よ}むことです。'],
        ['{作|つく}ります (1)', '{作|つく}る', '{料理|りょうり}を{作|つく}ることです。'],
        ['{撮|と}ります (1)', '{撮|と}る', '{写真|しゃしん}を{撮|と}ることです。'],
        ['{弾|ひ}きます (1)', '{弾|ひ}く', 'ピアノを{弾|ひ}くことです。'],
        ['{歌|うた}います (1)', '{歌|うた}う', '{歌|うた}を{歌|うた}うことです。'],
        ['{登|のぼ}ります (1)', '{登|のぼ}る', '{山|やま}に{登|のぼ}ることです。'],
        ['{旅行|りょこう}します (3)', '{旅行|りょこう}する', '{旅行|りょこう}することです。'],
        ['スポーツをします (3)', 'する', 'スポーツをすることです。'],
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp khi đổi sang thể từ điển',
      items: [
        '~~{見|み}ます → {見|み}む~~ / ~~{起|お}きます → {起|お}く~~: 見ます, 起きます, 借ります, 降ります, できます là **nhóm 2** → 見**る**, 起き**る**, 借り**る**, 降り**る**, でき**る**.',
        '~~{帰|かえ}ります → {帰|かえ}りる~~ / ~~{入|はい}ります → {入|はい}りる~~: hai động từ này **nhóm 1** → {帰|かえ}**る**, {入|はい}**る** (り → る).',
        '~~{来|き}ます → {来|き}る~~: là **{来|く}る (くる)**. Chữ Hán giữ nguyên, cách đọc đổi: き(ます) → く(る).',
        '~~{使|つか}います → {使|つか}いる~~: đuôi い → **う**: {使|つか}う, {会|あ}う, {習|なら}う, {言|い}う (đọc **iu**, viết いう).',
        'Động từ N＋します: chỉ đổi phần します → **する**, danh từ giữ nguyên: {運転|うんてん}**する**, {予約|よやく}**する**, サッカーを**する**.',
        'Thể từ điển là dạng **thân mật / trung tính** — KHÔNG dùng một mình để kết câu lịch sự với cô. Bài 9 chỉ dùng nó **trước こと**; câu vẫn kết bằng **です／できます**.',
      ],
    },
    {
      t: 'build',
      id: 'b9-np-tu-dien',
      title: 'Luyện nhanh — ghép thân động từ với đuôi thể từ điển đúng',
      items: [
        { vi: '{泳|およ}ぎます → thể từ điển', chips: ['{泳|およ}', 'ぐ', 'ぎる', 'く', 'む'], answer: ['{泳|およ}', 'ぐ'], ro: 'oyogu' },
        { vi: '{習|なら}います → thể từ điển', chips: ['{習|なら}', 'う', 'いる', 'る', 'く'], answer: ['{習|なら}', 'う'], ro: 'narau' },
        { vi: '{集|あつ}めます → thể từ điển', chips: ['{集|あつ}め', 'る', 'む', 'う', 'す'], answer: ['{集|あつ}め', 'る'], ro: 'atsumeru' },
        { vi: '{入|はい}ります → thể từ điển', chips: ['{入|はい}', 'る', 'りる', 'う', 'く'], answer: ['{入|はい}', 'る'], ro: 'hairu' },
        { vi: '{降|お}ります → thể từ điển', chips: ['{降|お}り', 'る', '{降|お}', 'う'], answer: ['{降|お}り', 'る'], ro: 'oriru' },
        { vi: '{申|もう}し{込|こ}みます → thể từ điển', chips: ['{申|もう}し{込|こ}', 'む', 'みる', 'ぬ', 'ぶ'], answer: ['{申|もう}し{込|こ}', 'む'], ro: 'moushikomu' },
        { vi: '{来|き}ます → thể từ điển', chips: ['{来|く}る', '{来|き}る', '{来|く}', '{来|こ}る'], answer: ['{来|く}る'], ro: 'kuru' },
        { vi: '{予約|よやく}します → thể từ điển', chips: ['{予約|よやく}', 'する', 'す', 'しる', 'くる'], answer: ['{予約|よやく}', 'する'], ro: 'yoyaku suru' },
        { vi: '{待|ま}ちます → thể từ điển', chips: ['{待|ま}', 'つ', 'ちる', 'す', 'む'], answer: ['{待|ま}', 'つ'], ro: 'matsu' },
        { vi: '{遊|あそ}びます → thể từ điển', chips: ['{遊|あそ}', 'ぶ', 'びる', 'む', 'ぬ'], answer: ['{遊|あそ}', 'ぶ'], ro: 'asobu' },
      ],
    },

    /* ── ポイント 81 ── */
    { t: 'h', text: 'ポイント 81 — V辞書形 こと ("việc V" — nói sở thích)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（{私|わたし}の）{趣味|しゅみ}は V辞書形 ことです。',
          vi: 'Thêm **こと** sau thể từ điển → cả cụm động từ thành **danh từ** ("việc đọc sách", "việc xem phim"), rồi dùng như danh từ trong câu N1 は N2 です (ポイント 1).',
          examples: [
            { en: '{私|わたし}の{趣味|しゅみ}は{映画|えいが}を{見|み}ることです。', ro: 'Watashi no shumi wa eiga o miru koto desu.', vi: 'Sở thích của tôi là xem phim.' },
            { en: '{趣味|しゅみ}は{切手|きって}を{集|あつ}めることです。', ro: 'Shumi wa kitte o atsumeru koto desu.', vi: 'Sở thích của tôi là sưu tầm tem.' },
            { en: '{趣味|しゅみ}はプールで{泳|およ}ぐことです。', ro: 'Shumi wa puuru de oyogu koto desu.', vi: 'Sở thích của tôi là bơi ở bể bơi.' },
            { en: '{趣味|しゅみ}はいろいろな{国|くに}の{料理|りょうり}を{作|つく}ることです。', ro: 'Shumi wa iroiro na kuni no ryouri o tsukuru koto desu.', vi: 'Sở thích của tôi là nấu món của nhiều nước.' },
          ],
        },
        {
          formula: '{趣味|しゅみ}は N です。 ↔ {趣味|しゅみ}は（N を）V辞書形 ことです。',
          vi: 'Sở thích là **danh từ** (スポーツ, {音楽|おんがく}, {釣|つ}り) thì nói thẳng N です. Muốn nói **cụ thể làm gì** thì dùng V ことです.',
          examples: [
            { en: '{趣味|しゅみ}は{音楽|おんがく}です。', ro: 'Shumi wa ongaku desu.', vi: 'Sở thích là âm nhạc. (chung chung)' },
            { en: '{趣味|しゅみ}はピアノを{弾|ひ}くことです。', ro: 'Shumi wa piano o hiku koto desu.', vi: 'Sở thích là chơi piano. (cụ thể)' },
            { en: '{趣味|しゅみ}は{釣|つ}りです。／{趣味|しゅみ}は{釣|つ}りをすることです。', ro: 'Shumi wa tsuri desu. / Shumi wa tsuri o suru koto desu.', vi: 'Sở thích là câu cá. (cả hai đều đúng)' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp (hỏi tiếp bằng どんな)',
      lines: [
        { who: 'A', role: 'a', text: 'Bさんの{趣味|しゅみ}は{何|なん}ですか。', ro: 'B-san no shumi wa nan desu ka.', vi: 'Sở thích của B là gì?' },
        { who: 'B', role: 'b', text: '{料理|りょうり}を{作|つく}ることです。', ro: 'Ryouri o tsukuru koto desu.', vi: 'Là nấu ăn.' },
        { who: 'A', role: 'a', text: 'へえ、どんな{料理|りょうり}を{作|つく}りますか。', ro: 'Hee, donna ryouri o tsukurimasu ka.', vi: 'Ồ, bạn nấu món gì?' },
        { who: 'B', role: 'b', text: 'イタリア{料理|りょうり}を{作|つく}ります。', ro: 'Itaria ryouri o tsukurimasu.', vi: 'Mình nấu món Ý.' },
        { who: 'A', role: 'a', text: 'そうですか。', ro: 'Sou desu ka.', vi: 'Vậy à.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — mẫu 言ってみよう 1-1 (～ことです → どんな～を～ますか)',
      head: ['{趣味|しゅみ}は ～ことです', 'どんな～を～ますか', 'Trả lời'],
      rows: [
        ['{映画|えいが}を{見|み}ることです', 'どんな{映画|えいが}を{見|み}ますか', 'アクション{映画|えいが}を{見|み}ます'],
        ['{料理|りょうり}を{作|つく}ることです', 'どんな{料理|りょうり}を{作|つく}りますか', 'イタリア{料理|りょうり}を{作|つく}ります'],
        ['{写真|しゃしん}を{撮|と}ることです', 'どんな{写真|しゃしん}を{撮|と}りますか', '{景色|けしき}の{写真|しゃしん}を{撮|と}ります'],
        ['{切手|きって}を{集|あつ}めることです', 'どんな{切手|きって}を{集|あつ}めますか', '{花|はな}の{切手|きって}を{集|あつ}めます'],
        ['{音楽|おんがく}を{聞|き}くことです', 'どんな{音楽|おんがく}を{聞|き}きますか', 'ポップスを{聞|き}きます'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — mẫu 1-2 (～ことです。特に、～が好きです)',
      head: ['{趣味|しゅみ}は ～ことです。', '{特|とく}に、', '～が{好|す}きです。'],
      rows: [
        ['{絵|え}を{見|み}ることです。', '{特|とく}に、', '{花|はな}の{絵|え}が{好|す}きです。'],
        ['スポーツをすることです。', '{特|とく}に、', 'サッカーが{好|す}きです。'],
        ['{本|ほん}を{読|よ}むことです。', '{特|とく}に、', '{日本|にほん}の{小説|しょうせつ}が{好|す}きです。'],
        ['ピアノを{弾|ひ}くことです。', '{特|とく}に、', 'クラシックが{好|す}きです。'],
        ['{音楽|おんがく}を{聞|き}くことです。', '{特|とく}に、', 'ジャズが{好|す}きです。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～こと',
      items: [
        'Dùng thể ます trước こと: ~~{見|み}ますことです~~ → {見|み}**る**ことです. Trước こと luôn là **thể từ điển**.',
        'Bỏ こと: ~~{趣味|しゅみ}は{映画|えいが}を{見|み}るです~~ → động từ không đứng thẳng trước です; phải có **こと** để thành danh từ.',
        'Trả lời 「{趣味|しゅみ}は{何|なん}ですか」 mà nói ~~{映画|えいが}を{見|み}ます~~ — nghe như "tôi (sẽ) xem phim", chưa trả lời đúng mẫu. Dùng **～ことです**.',
        'Câu hỏi thi 「しゅみは なんですか」 → **わたしの しゅみは ～ことです／～です** — mở rộng thêm 特に～が好きです hoặc tần suất (84) để ăn điểm.',
      ],
    },

    /* ── ポイント 82 ── */
    { t: 'h', text: 'ポイント 82 — ｛N／V辞書形こと｝ が できます (làm được, biết)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N が できます／できません。',
          vi: 'N là **danh từ chỉ kỹ năng, hoạt động**: スキー, テニス, ダンス, {日本語|にほんご}, {運転|うんてん}, {料理|りょうり}. Trợ từ là **が** (không phải を).',
          examples: [
            { en: '{私|わたし}はスキーができます。', ro: 'Watashi wa sukii ga dekimasu.', vi: 'Tôi trượt tuyết được.' },
            { en: 'ナタポンさんは{車|くるま}の{運転|うんてん}ができます。', ro: 'Natapon-san wa kuruma no unten ga dekimasu.', vi: 'Natapon biết lái ô tô.' },
            { en: '{私|わたし}はダンスが{全然|ぜんぜん}できません。', ro: 'Watashi wa dansu ga zenzen dekimasen.', vi: 'Tôi hoàn toàn không nhảy được.' },
          ],
        },
        {
          formula: 'V辞書形 こと が できます／できません。',
          vi: 'Hoạt động cụ thể (có tân ngữ, có cách thức) → biến thành danh từ bằng **V辞書形＋こと** rồi thêm **ができます**.',
          examples: [
            { en: '{私|わたし}は{料理|りょうり}を{作|つく}ることができません。', ro: 'Watashi wa ryouri o tsukuru koto ga dekimasen.', vi: 'Tôi không nấu ăn được.' },
            { en: 'パクさんは{上手|じょうず}にピアノを{弾|ひ}くことができます。', ro: 'Paku-san wa jouzu ni piano o hiku koto ga dekimasu.', vi: 'Park chơi piano giỏi.' },
            { en: '{私|わたし}は{上手|じょうず}に{漢字|かんじ}を{書|か}くことができません。', ro: 'Watashi wa jouzu ni kanji o kaku koto ga dekimasen.', vi: 'Tôi không viết chữ Hán đẹp được.' },
            { en: '{私|わたし}は{100メートル|ひゃくメートル}{泳|およ}ぐことができます。', ro: 'Watashi wa hyaku meetoru oyogu koto ga dekimasu.', vi: 'Tôi bơi được 100 mét.' },
          ],
        },
        {
          formula: '～が できますか。 → はい、できます。／いいえ、できません。',
          vi: 'Hỏi – đáp. Trả lời không cần lặp lại cả cụm; mức độ: **{少|すこ}し**できます · あまりできません · {全然|ぜんぜん}できません.',
          examples: [
            { en: 'Bさんはスキーができますか。——はい、できます。', ro: 'B-san wa sukii ga dekimasu ka. — Hai, dekimasu.', vi: 'B trượt tuyết được không? — Được.' },
            { en: '{日本|にほん}の{料理|りょうり}を{作|つく}ることができますか。——いいえ、できません。', ro: 'Nihon no ryouri o tsukuru koto ga dekimasu ka. — Iie, dekimasen.', vi: 'Bạn nấu được món Nhật không? — Không.' },
            { en: '{英語|えいご}ができますか。——はい、{少|すこ}しできます。', ro: 'Eigo ga dekimasu ka. — Hai, sukoshi dekimasu.', vi: 'Bạn biết tiếng Anh không? — Có, biết một chút.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp trước bảng thông báo (mẫu 言ってみよう 1-1)',
      lines: [
        { who: 'A', role: 'a', text: 'いろいろなイベントがありますね。', ro: 'Iroiro na ibento ga arimasu ne.', vi: 'Có nhiều sự kiện nhỉ.' },
        { who: 'B', role: 'b', text: 'そうですね。あ、{私|わたし}はこのダイビングツアーに{行|い}きたいです。', ro: 'Sou desu ne. A, watashi wa kono daibingu tsuaa ni ikitai desu.', vi: 'Ừ nhỉ. A, mình muốn đi tour lặn biển này.' },
        { who: 'A', role: 'a', text: 'えっ？Bさんはダイビングができますか。', ro: 'E? B-san wa daibingu ga dekimasu ka.', vi: 'Hả? B lặn biển được à?' },
        { who: 'B', role: 'b', text: 'あ、はい。', ro: 'A, hai.', vi: 'À, ừ.' },
        { who: 'A', role: 'a', text: 'へえ、すごいですね。', ro: 'Hee, sugoi desu ne.', vi: 'Ồ, giỏi thật.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế 1-1 — poster → muốn làm gì → "bạn làm được à?"',
      head: ['Poster', '{私|わたし}はこの～に V たいです', 'えっ？～ができますか'],
      rows: [
        ['スキー{旅行|りょこう}', 'このスキー{旅行|りょこう}に{参加|さんか}したいです', 'スキーができますか'],
        ['ダンスクラブ', 'このダンスクラブに{入|はい}りたいです', 'ダンスができますか'],
        ['ダイビングツアー', 'このダイビングツアーに{行|い}きたいです', 'ダイビングができますか'],
        ['ジャズピアノクラブ', 'このジャズピアノクラブに{入|はい}りたいです', 'ピアノ（を{弾|ひ}くこと）ができますか'],
        ['ケーキコンテスト', 'このケーキコンテストに{参加|さんか}したいです', 'ケーキを{作|つく}ることができますか'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế 1-2 — "vì tôi KHÔNG làm được… nên muốn học"',
      head: ['Lớp', 'Lý do (～ことができませんから)', '～を{習|なら}いたいです'],
      rows: [
        ['{書道|しょどう}{教室|きょうしつ}', '{上手|じょうず}に{漢字|かんじ}を{書|か}くことができませんから', '{書道|しょどう}を{習|なら}いたいです'],
        ['お{菓子|かし}{教室|きょうしつ}', 'ケーキを{作|つく}ることができませんから', 'お{菓子|かし}の{作|つく}り{方|かた}を{習|なら}いたいです'],
        ['{料理|りょうり}{教室|きょうしつ}', '{日本|にほん}{料理|りょうり}を{作|つく}ることができませんから', '{日本|にほん}{料理|りょうり}を{習|なら}いたいです'],
        ['{英語|えいご}{教室|きょうしつ}', '{上手|じょうず}に{英語|えいご}を{話|はな}すことができませんから', '{英語|えいご}を{習|なら}いたいです'],
        ['パソコン{教室|きょうしつ}', '{上手|じょうず}にパソコンを{使|つか}うことができませんから', 'パソコンを{習|なら}いたいです'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với できます',
      items: [
        'Trợ từ: ~~スキーをできます~~ → スキー**が**できます; ~~{作|つく}ることをできます~~ → {作|つく}ること**が**できます.',
        'Thể ます trước こと: ~~{作|つく}りますことができます~~ → {作|つく}**る**ことができます.',
        '"Biết tiếng Nhật" = **{日本語|にほんご}ができます** (không phải ~~{日本語|にほんご}をわかります~~ — わかります là "hiểu" và đi với が).',
        '**{上手|じょうず}に** đứng trước động từ (phó từ): **{上手|じょうず}に**{書|か}くことができます. Khác Bài 8: {漢字|かんじ}**が{上手|じょうず}です** (tính từ, đi với が).',
        'Ghép với lý do (ポイント 47): ～ことができません**から**、～を{習|なら}いたいです — mẫu chính của 言ってみよう 1-2.',
      ],
    },

    /* ── ポイント 83 ── */
    { t: 'h', text: 'ポイント 83 — Vて、Vて、V (làm lần lượt nhiều việc)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'V1て、V2て、V3ます／ました。',
          vi: 'Nối các hành động **theo đúng thứ tự xảy ra** bằng thể て (Bài 7). **Chỉ động từ cuối** mang thì: ～ます (sẽ / thường) hay ～ました (đã). Thường 2–3 việc.',
          examples: [
            { en: '{週末|しゅうまつ}、{友達|ともだち}とご{飯|はん}を{食|た}べて、{映画|えいが}を{見|み}ます。', ro: 'Shuumatsu, tomodachi to gohan o tabete, eiga o mimasu.', vi: 'Cuối tuần tôi ăn cơm với bạn rồi xem phim.' },
            { en: '{友達|ともだち}と{映画|えいが}を{見|み}て、{買|か}い{物|もの}をして、{食事|しょくじ}しました。', ro: 'Tomodachi to eiga o mite, kaimono o shite, shokuji shimashita.', vi: 'Tôi đã xem phim với bạn, mua sắm, rồi đi ăn.' },
            { en: 'スーパーへ{行|い}って、{料理|りょうり}を{作|つく}って、{友達|ともだち}と{食|た}べました。', ro: 'Suupaa e itte, ryouri o tsukutte, tomodachi to tabemashita.', vi: 'Tôi đi siêu thị, nấu ăn, rồi ăn cùng bạn.' },
            { en: '{毎朝|まいあさ}、{6時|ろくじ}に{起|お}きて、{泳|およ}いで、{学校|がっこう}へ{行|い}きます。', ro: 'Maiasa, rokuji ni okite, oyoide, gakkou e ikimasu.', vi: 'Sáng nào tôi cũng dậy 6 giờ, đi bơi, rồi đến trường.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Ôn thể て (Bài 7) — quy tắc theo đuôi ます',
      head: ['Đuôi (nhóm 1)', 'Thể て', 'Ví dụ'],
      rows: [
        ['い・ち・り ます', '→ **って**', '{買|か}います → {買|か}って · {待|ま}ちます → {待|ま}って · {乗|の}ります → {乗|の}って · {払|はら}います → {払|はら}って'],
        ['み・び・に ます', '→ **んで**', '{読|よ}みます → {読|よ}んで · {遊|あそ}びます → {遊|あそ}んで · {申|もう}し{込|こ}みます → {申|もう}し{込|こ}んで'],
        ['き ます', '→ **いて**', '{書|か}きます → {書|か}いて · {描|か}きます → {描|か}いて (※{行|い}きます → **{行|い}って**)'],
        ['ぎ ます', '→ **いで**', '{泳|およ}ぎます → {泳|およ}いで'],
        ['し ます', '→ **して**', '{話|はな}します → {話|はな}して'],
        ['Nhóm 2', 'bỏ ます + **て**', '{食|た}べて · {見|み}て · {降|お}りて · {見|み}せて · {集|あつ}めて'],
        ['Nhóm 3', 'して · {来|き}て', '{予約|よやく}して · {参加|さんか}して · {運転|うんてん}して'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: cuối tuần đã làm gì?',
      lines: [
        { who: 'A', role: 'a', text: '{週末|しゅうまつ}、{何|なに}をしましたか。', ro: 'Shuumatsu, nani o shimashita ka.', vi: 'Cuối tuần bạn đã làm gì?' },
        { who: 'B', role: 'b', text: '{友達|ともだち}とカラオケに{行|い}って、{歌|うた}を{歌|うた}って、{晩|ばん}ご{飯|はん}を{食|た}べました。', ro: 'Tomodachi to karaoke ni itte, uta o utatte, bangohan o tabemashita.', vi: 'Mình đi karaoke với bạn, hát, rồi ăn tối.' },
        { who: 'A', role: 'a', text: 'へえ、そうですか。{日曜日|にちようび}は？', ro: 'Hee, sou desu ka. Nichiyoubi wa?', vi: 'Ồ, vậy à. Còn Chủ Nhật?' },
        { who: 'B', role: 'b', text: '{日曜日|にちようび}は{宿題|しゅくだい}をして、うちで{休|やす}みました。', ro: 'Nichiyoubi wa shukudai o shite, uchi de yasumimashita.', vi: 'Chủ Nhật mình làm bài tập rồi nghỉ ở nhà.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — kể 3 việc (mẫu 言ってみよう chủ đề 3)',
      head: ['Việc 1 (Vて)', 'Việc 2 (Vて)', 'Việc 3 (Vました)'],
      rows: [
        ['{友達|ともだち}と{映画|えいが}を{見|み}て、', '{買|か}い{物|もの}をして、', '{食事|しょくじ}しました。'],
        ['{上野|うえの}へ{行|い}って、', '{美術館|びじゅつかん}で{絵|え}を{見|み}て、', '{中華|ちゅうか}{料理|りょうり}を{食|た}べました。'],
        ['{友達|ともだち}に{会|あ}って、', 'レストランで{話|はな}して、', 'カラオケで{歌|うた}いました。'],
        ['スーパーで{買|か}い{物|もの}をして、', '{料理|りょうり}を{作|つく}って、', '{友達|ともだち}と{食|た}べました。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với Vて、Vて',
      items: [
        'Chia quá khứ ở giữa: ~~{見|み}ました、{買|か}いました、{食|た}べました~~ đúng ngữ pháp nhưng rời rạc; mẫu Bài 9 là **{見|み}て、{買|か}って、{食|た}べました** — chỉ động từ CUỐI có ました.',
        'Sai thể て: ~~{行|い}いて~~ → **{行|い}って**; ~~{泳|およ}いて~~ → **{泳|およ}いで**; ~~{乗|の}んで~~ → **{乗|の}って**.',
        'Thứ tự trong câu = thứ tự thời gian. Đảo lại là đổi nghĩa: {食|た}べて、{見|み}ました (ăn trước) ≠ {見|み}て、{食|た}べました (xem trước).',
        'Vて、～ cũng nối một câu hỏi đường: バスに{乗|の}って、{駅|えき}で{降|お}ります (ポイント 86).',
      ],
    },

    /* ── ポイント 84 ── */
    { t: 'h', text: 'ポイント 84 — [～日・～週間…] に [～回・～本…] (bao lâu bao nhiêu)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '[khoảng thời gian] に [số lần / số lượng] V ます。',
          vi: '"Trong mỗi (khoảng thời gian) … (bao nhiêu)". Khoảng thời gian: {1日|いちにち}, {1週間|いっしゅうかん}, {1か月|いっかげつ}, {1年|いちねん}; theo sau là **に**; rồi số lần (～{回|かい}) hoặc số lượng (～{杯|はい}, ～{冊|さつ}, ～{本|ほん}, ～{時間|じかん}) — đứng **ngay trước động từ** (như ポイント 52).',
          examples: [
            { en: '{1週間|いっしゅうかん}に{2回|にかい}、{家族|かぞく}に{電話|でんわ}します。', ro: 'Isshuukan ni nikai, kazoku ni denwa shimasu.', vi: 'Một tuần tôi gọi điện cho gia đình 2 lần.' },
            { en: '{1日|いちにち}にコーヒーを{3杯|さんばい}{飲|の}みます。', ro: 'Ichinichi ni koohii o sanbai nomimasu.', vi: 'Một ngày tôi uống 3 cốc cà phê.' },
            { en: '{1か月|いっかげつ}に{本|ほん}を{4冊|よんさつ}{読|よ}みます。', ro: 'Ikkagetsu ni hon o yonsatsu yomimasu.', vi: 'Một tháng tôi đọc 4 quyển sách.' },
            { en: '{1年|いちねん}に{1回|いっかい}、{国|くに}へ{帰|かえ}ります。', ro: 'Ichinen ni ikkai, kuni e kaerimasu.', vi: 'Một năm tôi về nước 1 lần.' },
            { en: '{1日|いちにち}に{4時間|よじかん}くらいインターネットをします。', ro: 'Ichinichi ni yojikan kurai intaanetto o shimasu.', vi: 'Một ngày tôi lên mạng khoảng 4 tiếng.' },
          ],
        },
        {
          formula: '[khoảng thời gian] に {何回|なんかい}／{何杯|なんばい}… V ますか。／どのくらい V ますか。',
          vi: 'Hỏi số lần / số lượng. Thêm **くらい** sau con số = "khoảng" (số không chắc chắn).',
          examples: [
            { en: '{1週間|いっしゅうかん}に{何回|なんかい}{泳|およ}ぎますか。——{3回|さんかい}{泳|およ}ぎます。', ro: 'Isshuukan ni nankai oyogimasu ka. — Sankai oyogimasu.', vi: 'Một tuần bạn bơi mấy lần? — 3 lần.' },
            { en: 'よく{映画|えいが}を{見|み}ますか。——はい、{1週間|いっしゅうかん}に{2回|にかい}くらい{見|み}ます。', ro: 'Yoku eiga o mimasu ka. — Hai, isshuukan ni nikai kurai mimasu.', vi: 'Bạn hay xem phim không? — Có, khoảng 1 tuần 2 lần.' },
            { en: 'どのくらい{山|やま}に{登|のぼ}りますか。——{1か月|いっかげつ}に{3回|さんかい}くらい{登|のぼ}ります。', ro: 'Dono kurai yama ni noborimasu ka. — Ikkagetsu ni sankai kurai noborimasu.', vi: 'Bạn leo núi bao lâu một lần? — Khoảng 1 tháng 3 lần.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Đếm ～{本|ほん}・～{杯|はい}・～{冊|さつ}・～{回|かい}・～{日|にち} (表 p.287) — chú ý chữ in đậm',
      head: ['Số', '～{本|ほん} (vật dài, chai)', '～{杯|はい} (cốc, bát)', '～{冊|さつ} (sách, vở)', '～{回|かい} (lần)', '～{日|にち} (ngày)'],
      rows: [
        ['1', '**いっぽん**', '**いっぱい**', '**いっさつ**', '**いっかい**', 'いちにち'],
        ['2', 'にほん', 'にはい', 'にさつ', 'にかい', '**ふつか**'],
        ['3', '**さんぼん**', '**さんばい**', 'さんさつ', 'さんかい', '**みっか**'],
        ['4', 'よんほん', 'よんはい', 'よんさつ', 'よんかい', '**よっか**'],
        ['5', 'ごほん', 'ごはい', 'ごさつ', 'ごかい', '**いつか**'],
        ['6', '**ろっぽん**', '**ろっぱい**', 'ろくさつ', '**ろっかい**', '**むいか**'],
        ['7', 'ななほん', 'ななはい', 'ななさつ', 'ななかい', '**なのか**'],
        ['8', '**はっぽん**', '**はっぱい**', '**はっさつ**', '**はっかい**', '**ようか**'],
        ['9', 'きゅうほん', 'きゅうはい', 'きゅうさつ', 'きゅうかい', '**ここのか**'],
        ['10', '**じゅっぽん**', '**じゅっぱい**', '**じゅっさつ**', '**じゅっかい**', '**とおか**'],
        ['？', '**なんぼん**', '**なんばい**', 'なんさつ', 'なんかい', 'なんにち'],
      ],
    },
    {
      t: 'table',
      caption: 'Khoảng thời gian: ～{週間|しゅうかん}・～か{月|げつ}・～{年|ねん}',
      head: ['Số', '～{週間|しゅうかん}', '～か{月|げつ}', '～{年|ねん}'],
      rows: [
        ['1', '**いっしゅうかん**', '**いっかげつ**', 'いちねん'],
        ['2', 'にしゅうかん', 'にかげつ', 'にねん'],
        ['3', 'さんしゅうかん', 'さんかげつ', 'さんねん'],
        ['4', 'よんしゅうかん', 'よんかげつ', '**よねん**'],
        ['6', 'ろくしゅうかん', '**ろっかげつ**', 'ろくねん'],
        ['8', '**はっしゅうかん**', '**はっかげつ**', 'はちねん'],
        ['10', '**じゅっしゅうかん**', '**じゅっかげつ**', 'じゅうねん'],
        ['？', 'なんしゅうかん', 'なんかげつ', 'なんねん'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp (mẫu 言ってみよう 4)',
      lines: [
        { who: 'A', role: 'a', text: '{趣味|しゅみ}は{何|なん}ですか。', ro: 'Shumi wa nan desu ka.', vi: 'Sở thích của bạn là gì?' },
        { who: 'B', role: 'b', text: 'ゲームをすることです。', ro: 'Geemu o suru koto desu.', vi: 'Là chơi game.' },
        { who: 'A', role: 'a', text: 'よくゲームをしますか。', ro: 'Yoku geemu o shimasu ka.', vi: 'Bạn có hay chơi game không?' },
        { who: 'B', role: 'b', text: 'はい、{1週間|いっしゅうかん}に{4|よん}、{5回|ごかい}します。', ro: 'Hai, isshuukan ni yon, gokai shimasu.', vi: 'Có, 1 tuần mình chơi 4, 5 lần.' },
        { who: 'A', role: 'a', text: 'そうですか。', ro: 'Sou desu ka.', vi: 'Vậy à.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế',
      head: ['[khoảng thời gian] に', '[số lượng]', 'V ます'],
      rows: [
        ['{1週間|いっしゅうかん}に', '{2回|にかい}くらい', '{映画|えいが}を{見|み}ます'],
        ['{1週間|いっしゅうかん}に', '{4|よん}、{5回|ごかい}', 'ゲームをします'],
        ['{1か月|いっかげつ}に', '{3回|さんかい}くらい', '{山|やま}に{登|のぼ}ります'],
        ['{1週間|いっしゅうかん}に', '{2|に}、{3冊|さんさつ}', '{本|ほん}を{読|よ}みます'],
        ['{1日|いちにち}に', '{4時間|よじかん}くらい', 'インターネットをします'],
        ['{1日|いちにち}に', '{2杯|にはい}', 'お{茶|ちゃ}を{飲|の}みます'],
        ['{1日|いちにち}に', '{1本|いっぽん}', '{水|みず}を{飲|の}みます'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～に～回',
      items: [
        'Quên **に**: ~~{1週間|いっしゅうかん}{2回|にかい}{見|み}ます~~ → {1週間|いっしゅうかん}**に**{2回|にかい}{見|み}ます.',
        'Nhầm "một ngày" với "mùng 1": khoảng thời gian **{1日|いちにち}** (ichinichi); ngày trong tháng **{1日|ついたち}**. "2 ngày" (khoảng) cũng đọc ふつか — giống ngày mùng 2.',
        'Nhầm **{1か月|いっかげつ}** (một tháng) với **{1月|いちがつ}** (tháng Một); **{1週間|いっしゅうかん}** phải có {間|かん} — ~~{1週|いっしゅう}に~~ ít dùng trong bài.',
        'Biến âm hay sai: いっ**ぽ**ん, さん**ぼ**ん, ろっ**ぽ**ん; いっ**ぱ**い, さん**ば**い; いっさつ; **いっかい** (không ~~いちかい~~).',
        'Chọn từ đếm theo đồ vật: cà phê, trà → **{杯|はい}** (cốc); chai nước, bút → **{本|ほん}**; sách, tạp chí → **{冊|さつ}**; lần → **{回|かい}**.',
      ],
    },

    /* ── ポイント 85 ── */
    { t: 'h', text: 'ポイント 85 — いつも／よく／ときどき／あまり／{全然|ぜんぜん} (thường xuyên đến đâu)' },
    {
      t: 'table',
      caption: 'Thang tần suất — hai từ cuối CHỈ đi với phủ định',
      head: ['Mức', 'Từ', 'Romaji', 'Nghĩa', 'Động từ đi kèm', 'Ví dụ'],
      rows: [
        ['100%', 'いつも', 'itsumo', 'luôn luôn', 'khẳng định ～ます', 'いつもバスで{来|き}ます。'],
        ['~70%', 'よく', 'yoku', 'thường, hay', 'khẳng định ～ます', 'よく{映画|えいが}を{見|み}ます。'],
        ['~40%', 'ときどき', 'tokidoki', 'thỉnh thoảng', 'khẳng định ～ます', 'ときどき{料理|りょうり}をします。'],
        ['~15%', 'あまり', 'amari', 'không … mấy / lắm', '**phủ định ～ません**', 'あまりテレビを{見|み}ません。'],
        ['0%', '{全然|ぜんぜん}', 'zenzen', 'hoàn toàn không', '**phủ định ～ません**', 'お{酒|さけ}を{全然|ぜんぜん}{飲|の}みません。'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（N は）いつも／よく／ときどき V ます。　（N は）あまり／{全然|ぜんぜん} V ません。',
          vi: 'Phó từ tần suất thường đứng **sau chủ đề (は)**, trước cụm động từ; cũng có thể đứng ngay trước động từ: テレビを**あまり**{見|み}ません.',
          examples: [
            { en: 'ナタポンさんはよくサッカーをしますか。——いいえ、あまりしません。', ro: 'Natapon-san wa yoku sakkaa o shimasu ka. — Iie, amari shimasen.', vi: 'Natapon có hay chơi bóng đá không? — Không, không chơi mấy.' },
            { en: '{私|わたし}はいつも{7時|しちじ}に{起|お}きます。', ro: 'Watashi wa itsumo shichiji ni okimasu.', vi: 'Tôi luôn dậy lúc 7 giờ.' },
            { en: 'ときどき{友達|ともだち}と{釣|つ}りをします。', ro: 'Tokidoki tomodachi to tsuri o shimasu.', vi: 'Thỉnh thoảng tôi đi câu cá với bạn.' },
            { en: '{最近|さいきん}、{全然|ぜんぜん}{泳|およ}ぎません。', ro: 'Saikin, zenzen oyogimasen.', vi: 'Dạo này tôi hoàn toàn không bơi.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: đủ 5 mức',
      lines: [
        { who: 'A', role: 'a', text: 'よくドラマを{見|み}ますか。', ro: 'Yoku dorama o mimasu ka.', vi: 'Bạn có hay xem phim bộ không?' },
        { who: 'B', role: 'b', text: 'はい、いつも{見|み}ます。{毎晩|まいばん}{見|み}ます。', ro: 'Hai, itsumo mimasu. Maiban mimasu.', vi: 'Có, lúc nào mình cũng xem. Tối nào cũng xem.' },
        { who: 'A', role: 'a', text: 'よく{料理|りょうり}をしますか。', ro: 'Yoku ryouri o shimasu ka.', vi: 'Bạn có hay nấu ăn không?' },
        { who: 'B', role: 'b', text: 'ときどきします。{日曜日|にちようび}だけします。', ro: 'Tokidoki shimasu. Nichiyoubi dake shimasu.', vi: 'Thỉnh thoảng. Chỉ Chủ Nhật thôi.' },
        { who: 'A', role: 'a', text: 'よく{漫画|まんが}を{読|よ}みますか。', ro: 'Yoku manga o yomimasu ka.', vi: 'Bạn có hay đọc truyện tranh không?' },
        { who: 'B', role: 'b', text: 'いいえ、あまり{読|よ}みません。', ro: 'Iie, amari yomimasen.', vi: 'Không, mình không đọc mấy.' },
        { who: 'A', role: 'a', text: 'よくお{酒|さけ}を{飲|の}みますか。', ro: 'Yoku osake o nomimasu ka.', vi: 'Bạn có hay uống rượu không?' },
        { who: 'B', role: 'b', text: 'いいえ、{全然|ぜんぜん}{飲|の}みません。', ro: 'Iie, zenzen nomimasen.', vi: 'Không, mình hoàn toàn không uống.' },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với phó từ tần suất',
      items: [
        '~~あまり{見|み}ます~~ / ~~{全然|ぜんぜん}{飲|の}みます~~ → **あまり{見|み}ません** / **{全然|ぜんぜん}{飲|の}みません**. Thấy あまり, 全然 là phải chờ ～ません.',
        'Trả lời 「よく～ますか」: có → はい、よく／ときどき～ます; không → **いいえ、あまり／{全然|ぜんぜん}～ません**. Đừng đáp cụt ~~いいえ~~.',
        '**よく** ở đây là "thường" (tần suất). Trong 「よくわかります」 (hiểu rõ) nó là "rõ, tốt" — cùng chữ, khác nghĩa.',
        '**だけ** (chỉ) gắn sau từ được giới hạn: {日曜日|にちようび}**だけ**, コーヒー**だけ**{飲|の}みます. Khác あまり (tần suất).',
      ],
    },

    /* ── ポイント 86 ── */
    { t: 'h', text: 'ポイント 86 — どうやって (làm thế nào, bằng cách nào)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'どうやって V ますか。 → V1て、V2て、V3ます。',
          vi: 'Hỏi **cách làm / các bước** (đi đến đâu, mua vé, làm thẻ, nấu món…). Trả lời bằng **chuỗi Vて** (ポイント 83) theo thứ tự các bước.',
          examples: [
            { en: 'どうやって{美術館|びじゅつかん}へ{行|い}きますか。——{3番|さんばん}のバスに{乗|の}って、{美術館|びじゅつかん}{前|まえ}で{降|お}ります。', ro: 'Dou yatte bijutsukan e ikimasu ka. — Sanban no basu ni notte, bijutsukan mae de orimasu.', vi: 'Đi bảo tàng bằng cách nào? — Lên xe buýt số 3, xuống ở trạm trước bảo tàng.' },
            { en: 'どうやってチケットを{買|か}いますか。——インターネットで{予約|よやく}して、コンビニでお{金|かね}を{払|はら}います。', ro: 'Dou yatte chiketto o kaimasu ka. — Intaanetto de yoyaku shite, konbini de okane o haraimasu.', vi: 'Mua vé thế nào? — Đặt trên mạng, rồi trả tiền ở cửa hàng tiện lợi.' },
            { en: 'どうやって{図書館|としょかん}のカードを{作|つく}りますか。——{受付|うけつけ}で{住所|じゅうしょ}と{名前|なまえ}を{書|か}いて、{外国人登録証|がいこくじんとうろくしょう}を{見|み}せます。', ro: 'Dou yatte toshokan no kaado o tsukurimasu ka. — Uketsuke de juusho to namae o kaite, gaikokujin tourokushou o misemasu.', vi: 'Làm thẻ thư viện thế nào? — Ở quầy tiếp tân viết địa chỉ và tên, rồi đưa thẻ đăng ký người nước ngoài.' },
            { en: 'どうやって{申|もう}し{込|こ}みますか。——この{電話番号|でんわばんごう}に{電話|でんわ}して、{名前|なまえ}と{住所|じゅうしょ}を{言|い}います。', ro: 'Dou yatte moushikomimasu ka. — Kono denwa bangou ni denwa shite, namae to juusho o iimasu.', vi: 'Đăng ký thế nào? — Gọi vào số này rồi nói tên và địa chỉ.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Trợ từ khi nói đường đi (hay bị trừ điểm)',
      head: ['Hành động', 'Câu đúng', 'Romaji', 'Ghi nhớ'],
      rows: [
        ['Lên xe', '{3番|さんばん}のバス**に**{乗|の}ります。', 'Sanban no basu ni norimasu.', 'Lên VÀO xe → **に**'],
        ['Xuống ở đâu', '{美術館|びじゅつかん}{前|まえ}**で**{降|お}ります。', 'Bijutsukan mae de orimasu.', 'Nơi xuống → **で**'],
        ['Xuống khỏi xe', '{電車|でんしゃ}**を**{降|お}ります。', 'Densha o orimasu.', 'Rời khỏi xe → **を**'],
        ['Lên ở đâu', '{駅|えき}の{前|まえ}**で**バスに{乗|の}ります。', 'Eki no mae de basu ni norimasu.', 'Nơi lên → **で**'],
        ['Đến', '{美術館|びじゅつかん}**へ**{行|い}きます。', 'Bijutsukan e ikimasu.', 'Hướng → **へ**／に'],
      ],
    },
    {
      t: 'table',
      caption: 'どうやって ↔ {何|なん}で — khác nhau',
      head: ['Câu hỏi', 'Hỏi về', 'Trả lời'],
      rows: [
        ['{何|なん}で{学校|がっこう}へ{来|き}ますか。 (Bài 3)', 'Phương tiện — MỘT từ', 'バスで{来|き}ます。'],
        ['どうやって{学校|がっこう}へ{来|き}ますか。 (Bài 9)', 'Cách đi — CÁC BƯỚC', '{駅|えき}まで{歩|ある}いて、{電車|でんしゃ}に{乗|の}って、さくら{駅|えき}で{降|お}ります。'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp (mẫu 言ってみよう 2 chủ đề 3)',
      lines: [
        { who: 'A', role: 'a', text: 'Bさん、{週末|しゅうまつ}、{何|なに}をしましたか。', ro: 'B-san, shuumatsu, nani o shimashita ka.', vi: 'B, cuối tuần bạn làm gì?' },
        { who: 'B', role: 'b', text: '{美術館|びじゅつかん}へ{行|い}きました。', ro: 'Bijutsukan e ikimashita.', vi: 'Mình đi bảo tàng mỹ thuật.' },
        { who: 'A', role: 'a', text: 'いいですね。{私|わたし}も{行|い}きたいです。でも、{行|い}き{方|かた}がわかりません。どうやって{行|い}きますか。', ro: 'Ii desu ne. Watashi mo ikitai desu. Demo, ikikata ga wakarimasen. Dou yatte ikimasu ka.', vi: 'Hay nhỉ. Mình cũng muốn đi. Nhưng mình không biết đường đi. Đi thế nào?' },
        { who: 'B', role: 'b', text: '{駅|えき}の{前|まえ}で{3番|さんばん}のバスに{乗|の}って、ほしので{降|お}ります。', ro: 'Eki no mae de sanban no basu ni notte, Hoshino de orimasu.', vi: 'Lên xe buýt số 3 ở trước ga, xuống ở Hoshino.' },
        { who: 'A', role: 'a', text: 'そうですか。ありがとうございます。', ro: 'Sou desu ka. Arigatou gozaimasu.', vi: 'Vậy à. Cảm ơn nhé.' },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với どうやって',
      items: [
        '~~バスを{乗|の}ります~~ → バス**に**{乗|の}ります. Còn {降|お}ります: ~~バスに{降|お}ります~~ → バス**を**{降|お}ります／(nơi)**で**{降|お}ります.',
        'Trả lời どうやって bằng một từ (~~バスです~~) là thiếu — người hỏi muốn các bước. Nói đủ chuỗi **Vて、Vて、Vます**.',
        'Trả lời ở **thì hiện tại ～ます** (cách làm nói chung), không phải ~~～ました~~.',
      ],
    },

    /* ── ポイント 87 ── */
    { t: 'h', text: 'ポイント 87 — でも (nhưng — đầu câu sau)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'Câu 1。 でも、Câu 2。',
          vi: '**でも** đứng **đầu câu thứ hai**, nối hai câu có ý **trái ngược** (hoặc ngoài mong đợi). Có dấu phẩy sau でも.',
          examples: [
            { en: '{私|わたし}の{趣味|しゅみ}はスポーツです。でも、{最近|さいきん}、{全然|ぜんぜん}しません。', ro: 'Watashi no shumi wa supootsu desu. Demo, saikin, zenzen shimasen.', vi: 'Sở thích của tôi là thể thao. Nhưng dạo này tôi hoàn toàn không chơi.' },
            { en: '{私|わたし}もコンサートに{行|い}きたいです。でも、チケットの{買|か}い{方|かた}がわかりません。', ro: 'Watashi mo konsaato ni ikitai desu. Demo, chiketto no kaikata ga wakarimasen.', vi: 'Tôi cũng muốn đi hoà nhạc. Nhưng tôi không biết cách mua vé.' },
            { en: '{日本語|にほんご}の{勉強|べんきょう}は{少|すこ}し{難|むずか}しいです。でも、{楽|たの}しいです。', ro: 'Nihongo no benkyou wa sukoshi muzukashii desu. Demo, tanoshii desu.', vi: 'Học tiếng Nhật hơi khó. Nhưng vui.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'でも (Bài 9) ↔ ～が、～ (Bài 4)',
      head: ['Mẫu', 'Vị trí', 'Ví dụ'],
      rows: [
        ['Câu 1**が**、câu 2。', 'Nối **trong một câu** (が gắn cuối vế 1)', 'サッカーが{好|す}きです**が**、{上手|じょうず}じゃありません。'],
        ['Câu 1。**でも**、câu 2。', '**Hai câu** riêng; でも mở đầu câu 2', 'サッカーが{好|す}きです。**でも**、{上手|じょうず}じゃありません。'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp (mẫu 言ってみよう 2/3)',
      lines: [
        { who: 'A', role: 'a', text: '{趣味|しゅみ}は{何|なん}ですか。', ro: 'Shumi wa nan desu ka.', vi: 'Sở thích của bạn là gì?' },
        { who: 'B', role: 'b', text: 'ピアノを{弾|ひ}くことです。', ro: 'Piano o hiku koto desu.', vi: 'Là chơi piano.' },
        { who: 'A', role: 'a', text: 'へえ。', ro: 'Hee.', vi: 'Ồ.' },
        { who: 'B', role: 'b', text: 'でも、{最近|さいきん}、{全然|ぜんぜん}{弾|ひ}きません。うちにピアノがありませんから。', ro: 'Demo, saikin, zenzen hikimasen. Uchi ni piano ga arimasen kara.', vi: 'Nhưng dạo này mình hoàn toàn không chơi. Vì nhà không có đàn piano.' },
        { who: 'A', role: 'a', text: 'そうですか。', ro: 'Sou desu ka.', vi: 'Vậy à.' },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với でも',
      items: [
        'Đặt でも cuối câu 1 kiểu ~~{好|す}きですでも、～~~ → sai. でも luôn ở **đầu câu 2**; muốn nối trong một câu thì dùng **～が、～**.',
        'Hai câu không trái nghĩa thì không dùng でも: ~~{映画|えいが}が{好|す}きです。でも、よく{見|み}ます~~ (thích → hay xem: cùng chiều) → dùng それから／そして.',
        'でも trong câu 「{毎週|まいしゅう}しました。**でも**、{最近|さいきん}{全然|ぜんぜん}しません」 — rất hay đi với **{最近|さいきん}** để nói "bây giờ không còn như trước".',
      ],
    },

    /* ── Tổng kết ── */
    { t: 'h', text: 'Tổng kết — câu hỏi của Bài 9 và cách trả lời' },
    {
      t: 'table',
      head: ['Câu hỏi', 'Hỏi về', 'Trả lời mẫu', 'ポイント'],
      rows: [
        ['{趣味|しゅみ}は{何|なん}ですか。', 'Sở thích', '～(V辞書形)ことです。{特|とく}に、～が{好|す}きです。', '81'],
        ['どんな～を～ますか。', 'Loại nào', '～を～ます。', '81'],
        ['よく～ますか。', 'Tần suất', 'はい、よく／ときどき～ます。／いいえ、あまり／{全然|ぜんぜん}～ません。', '85'],
        ['{1週間|いっしゅうかん}に{何回|なんかい}～ますか。', 'Số lần', '{1週間|いっしゅうかん}に{2回|にかい}（くらい）～ます。', '84'],
        ['～ができますか。', 'Làm được không', 'はい、できます。／いいえ、できません。', '82'],
        ['{週末|しゅうまつ}、{何|なに}をしましたか。', 'Đã làm gì', 'V1て、V2て、V3ました。', '83'],
        ['どうやって～ますか。', 'Cách làm', 'V1て、V2て、V3ます。', '86'],
        ['— (kể thêm điều trái ngược)', 'Nhưng', '～。でも、～。', '87'],
      ],
    },
    {
      t: 'build',
      id: 'b9-np-ghep',
      title: 'Ghép câu — dùng đủ 7 điểm ngữ pháp',
      items: [
        { vi: 'Sở thích của tôi là xem phim.', chips: ['{私|わたし}の', '{趣味|しゅみ}は', '{映画|えいが}を', '{見|み}る', 'ことです', '{見|み}ます', 'が'], answer: ['{私|わたし}の', '{趣味|しゅみ}は', '{映画|えいが}を', '{見|み}る', 'ことです'], ro: 'Watashi no shumi wa eiga o miru koto desu.' },
        { vi: 'Sở thích là sưu tầm tem.', chips: ['{趣味|しゅみ}は', '{切手|きって}を', '{集|あつ}める', 'ことです', '{集|あつ}めます', 'が'], answer: ['{趣味|しゅみ}は', '{切手|きって}を', '{集|あつ}める', 'ことです'], ro: 'Shumi wa kitte o atsumeru koto desu.' },
        { vi: 'Tôi trượt tuyết được.', chips: ['{私|わたし}は', 'スキーが', 'できます', 'スキーを', 'します'], answer: ['{私|わたし}は', 'スキーが', 'できます'], ro: 'Watashi wa sukii ga dekimasu.' },
        { vi: 'Tôi không nấu được món Nhật.', chips: ['{日本|にほん}の', '{料理|りょうり}を', '{作|つく}る', 'ことが', 'できません', '{作|つく}ります', 'を'], answer: ['{日本|にほん}の', '{料理|りょうり}を', '{作|つく}る', 'ことが', 'できません'], ro: 'Nihon no ryouri o tsukuru koto ga dekimasen.' },
        { vi: 'Cuối tuần tôi xem phim, mua sắm rồi đi ăn.', chips: ['{週末|しゅうまつ}、', '{映画|えいが}を{見|み}て、', '{買|か}い{物|もの}をして、', '{食事|しょくじ}しました', '{見|み}ました、'], answer: ['{週末|しゅうまつ}、', '{映画|えいが}を{見|み}て、', '{買|か}い{物|もの}をして、', '{食事|しょくじ}しました'], ro: 'Shuumatsu, eiga o mite, kaimono o shite, shokuji shimashita.' },
        { vi: 'Một tuần tôi gọi điện cho gia đình 2 lần.', chips: ['{1週間|いっしゅうかん}に', '{2回|にかい}、', '{家族|かぞく}に', '{電話|でんわ}します', '{1週間|いっしゅうかん}で', 'を'], answer: ['{1週間|いっしゅうかん}に', '{2回|にかい}、', '{家族|かぞく}に', '{電話|でんわ}します'], ro: 'Isshuukan ni nikai, kazoku ni denwa shimasu.' },
        { vi: 'Một ngày tôi uống 3 cốc cà phê.', chips: ['{1日|いちにち}に', 'コーヒーを', '{3杯|さんばい}', '{飲|の}みます', '{3本|さんぼん}', '{3冊|さんさつ}'], answer: ['{1日|いちにち}に', 'コーヒーを', '{3杯|さんばい}', '{飲|の}みます'], ro: 'Ichinichi ni koohii o sanbai nomimasu.' },
        { vi: 'Bạn có hay chơi bóng đá không? — Không, không chơi mấy.', chips: ['よく', 'サッカーを', 'しますか。', 'いいえ、', 'あまり', 'しません', 'します'], answer: ['よく', 'サッカーを', 'しますか。', 'いいえ、', 'あまり', 'しません'], ro: 'Yoku sakkaa o shimasu ka. — Iie, amari shimasen.' },
        { vi: 'Tôi hoàn toàn không uống rượu.', chips: ['お{酒|さけ}を', '{全然|ぜんぜん}', '{飲|の}みません', '{飲|の}みます', 'よく'], answer: ['お{酒|さけ}を', '{全然|ぜんぜん}', '{飲|の}みません'], ro: 'Osake o zenzen nomimasen.' },
        { vi: 'Đi bảo tàng bằng cách nào?', chips: ['どうやって', '{美術館|びじゅつかん}へ', '{行|い}きますか', '{何|なん}で', 'どこ'], answer: ['どうやって', '{美術館|びじゅつかん}へ', '{行|い}きますか'], ro: 'Dou yatte bijutsukan e ikimasu ka.' },
        { vi: 'Lên xe buýt số 3 rồi xuống ở trạm trước bảo tàng.', chips: ['{3番|さんばん}の', 'バスに', '{乗|の}って、', '{美術館|びじゅつかん}{前|まえ}で', '{降|お}ります', 'バスを', '{乗|の}ります'], answer: ['{3番|さんばん}の', 'バスに', '{乗|の}って、', '{美術館|びじゅつかん}{前|まえ}で', '{降|お}ります'], ro: 'Sanban no basu ni notte, bijutsukan mae de orimasu.' },
        { vi: 'Sở thích là thể thao. Nhưng dạo này hoàn toàn không chơi.', chips: ['{趣味|しゅみ}は', 'スポーツです。', 'でも、', '{最近|さいきん}、', '{全然|ぜんぜん}しません', 'よくします'], answer: ['{趣味|しゅみ}は', 'スポーツです。', 'でも、', '{最近|さいきん}、', '{全然|ぜんぜん}しません'], ro: 'Shumi wa supootsu desu. Demo, saikin, zenzen shimasen.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b9-np-kiem',
      title: 'Kiểm tra nhanh ngữ pháp Bài 9',
      items: [
        { q: 'Thể từ điển của 「{読|よ}みます」:', options: ['{読|よ}みる', '{読|よ}む', '{読|よ}ぬ', '{読|よ}る'], correct: 1, why: 'Nhóm 1, み → **む**.' },
        { q: 'Thể từ điển của 「{見|み}ます」:', options: ['{見|み}む', '{見|み}る', '{見|み}く', '{見|み}う'], correct: 1, why: '見ます là **nhóm 2** (dù âm い) → bỏ ます + る.' },
        { q: 'Thể từ điển của 「{帰|かえ}ります」:', options: ['{帰|かえ}りる', '{帰|かえ}る', '{帰|かえ}う', '{帰|かえ}ります'], correct: 1, why: '帰ります là **nhóm 1** (ngoại lệ) → り → **る**: {帰|かえ}る.' },
        { q: 'Thể từ điển của 「{来|き}ます」:', options: ['{来|き}る', '{来|く}る', '{来|こ}る', '{来|き}く'], correct: 1, why: 'Nhóm 3 bất quy tắc: **{来|く}る (くる)**.' },
        { q: '「{趣味|しゅみ}は{写真|しゃしん}を＿ことです。」', options: ['{撮|と}ります', '{撮|と}る', '{撮|と}って', '{撮|と}り'], correct: 1, why: 'Trước こと là **thể từ điển** (ポイント 81).' },
        { q: '「{私|わたし}はダンス＿できません。」', options: ['を', 'が', 'に', 'で'], correct: 1, why: 'N **が** できます (ポイント 82).' },
        { q: '"Tôi không viết chữ Hán đẹp được":', options: ['{上手|じょうず}に{漢字|かんじ}を{書|か}くことができません。', '{上手|じょうず}に{漢字|かんじ}を{書|か}きますことができません。', '{上手|じょうず}な{漢字|かんじ}を{書|か}くができません。', '{上手|じょうず}に{漢字|かんじ}が{書|か}くことをできません。'], correct: 0, why: '**V辞書形 + ことが + できません**; 上手**に** + động từ.' },
        { q: '"Tôi đi Ueno, xem tranh rồi ăn cơm" (đã làm):', options: ['{上野|うえの}へ{行|い}きて、{絵|え}を{見|み}て、ご{飯|はん}を{食|た}べました。', '{上野|うえの}へ{行|い}って、{絵|え}を{見|み}て、ご{飯|はん}を{食|た}べました。', '{上野|うえの}へ{行|い}って、{絵|え}を{見|み}ました、ご{飯|はん}を{食|た}べます。', '{上野|うえの}へ{行|い}く、{絵|え}を{見|み}る、ご{飯|はん}を{食|た}べました。'], correct: 1, why: 'Vて、Vて、V**ました** (ポイント 83); {行|い}きます → **{行|い}って** (bất quy tắc).' },
        { q: '「{1週間|いっしゅうかん}＿{2回|にかい}{泳|およ}ぎます。」', options: ['で', 'に', 'を', 'と'], correct: 1, why: '[khoảng thời gian] **に** [số lần] (ポイント 84).' },
        { q: '"3 cốc cà phê":', options: ['コーヒー{3本|さんぼん}', 'コーヒー{3杯|さんばい}', 'コーヒー{3冊|さんさつ}', 'コーヒー{3回|さんかい}'], correct: 1, why: 'Cốc, ly → **～杯**; 3杯 đọc **さんばい**.' },
        { q: '「お{酒|さけ}を＿{飲|の}みません。」 (hoàn toàn không)', options: ['よく', 'いつも', '{全然|ぜんぜん}', 'ときどき'], correct: 2, why: '**{全然|ぜんぜん}** + phủ định (ポイント 85).' },
        { q: '「よく{料理|りょうり}をしますか。」 — bạn hiếm khi nấu:', options: ['いいえ、よくしません。', 'いいえ、あまりしません。', 'はい、あまりします。', 'いいえ、ときどきします。'], correct: 1, why: 'Hiếm khi → **あまり～ません**.' },
        { q: 'Hỏi CÁCH mua vé:', options: ['{何|なん}でチケットを{買|か}いますか。', 'どうやってチケットを{買|か}いますか。', 'どこでチケットを{買|か}いましたか。', 'いつチケットを{買|か}いますか。'], correct: 1, why: 'Cách làm / các bước → **どうやって** (ポイント 86).' },
        { q: '「{3番|さんばん}のバス＿{乗|の}ります。」', options: ['を', 'に', 'で', 'へ'], correct: 1, why: 'Lên xe: N **に** {乗|の}ります.' },
        { q: '「スポーツが{好|す}きです。＿、{最近|さいきん}{全然|ぜんぜん}しません。」', options: ['それから', 'でも', 'だけ', 'よく'], correct: 1, why: 'Hai câu trái ý → **でも** đầu câu 2 (ポイント 87).' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const KANJI: Lesson = {
  id: 'b9-kanji',
  kind: 'kanji',
  title: 'Chữ Hán — trong từ vựng Bài 9',
  goal: 'Nhận mặt và đọc đúng mọi từ chữ Hán của 61 từ Bài 9 (sở thích, đơn vị đếm, lớp học, thủ tục) — đọc được cả khi KHÔNG có furigana như trong đề đọc; viết tay được các chữ ít nét, hay gặp.',
  minutes: 35,
  blocks: [
    {
      t: 'p',
      text: 'Phần Reading của đề thi có **4 từ chữ Hán gạch chân, KHÔNG có furigana (12 điểm)**. Học chữ Hán theo **cả từ** ({趣味|しゅみ} = shumi, {小説|しょうせつ} = shousetsu) chứ đừng học chữ rời. **Âm On** (音, gốc Hán) thường dùng khi hai chữ Hán đứng cạnh nhau; **âm Kun** (訓, âm Nhật) khi chữ đứng một mình hoặc có đuôi kana ({泳|およ}ぐ, {集|あつ}める). Cột **Mức**: 👁 **nhận mặt** = đọc và hiểu được là đủ (phần lớn chữ — ưu tiên cho bài đọc); ✍ **nên viết** = chữ ít nét, gặp rất nhiều, nên tập viết tay.',
    },
    {
      t: 'table',
      caption: '1. Sở thích — thể loại, đồ sưu tầm',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['趣', '👁', 'シュ', 'おもむき', 'THÚ (thú vị)', '{趣味|しゅみ} (sở thích)'],
        ['味', '👁', 'ミ', 'あじ', 'VỊ (vị)', '{趣味|しゅみ} · {味|あじ} (vị)'],
        ['菓', '👁', 'カ', '—', 'QUẢ (bánh trái)', 'お{菓子|かし}'],
        ['子', '✍', 'シ・ス', 'こ', 'TỬ (con)', 'お{菓子|かし} (し) · {子|こ}ども (こ)'],
        ['切', '👁', 'セツ', 'き(る)', 'THIẾT (cắt)', '{切手|きって} (き → **きっ**) · {切|き}ります'],
        ['手', '✍', 'シュ', 'て', 'THỦ (tay)', '{切手|きって} (て) · {上手|じょうず} (**ず**!) · {歌手|かしゅ}'],
        ['小', '✍', 'ショウ', 'ちい(さい)・こ', 'TIỂU (nhỏ)', '{小説|しょうせつ} · {小|ちい}さい'],
        ['説', '👁', 'セツ', 'と(く)', 'THUYẾT (nói, giảng)', '{小説|しょうせつ}'],
        ['漫', '👁', 'マン', '—', 'MẠN (tràn lan)', '{漫画|まんが}'],
        ['画', '👁', 'ガ・カク', '—', 'HOẠ (tranh)', '{漫画|まんが} · {映画|えいが}'],
        ['釣', '👁', 'チョウ', 'つ(る)', 'ĐIẾU (câu)', '{釣|つ}り'],
      ],
    },
    {
      t: 'table',
      caption: '2. Thời gian & đơn vị đếm',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['最', '👁', 'サイ', 'もっと(も)', 'TỐI (nhất)', '{最近|さいきん}'],
        ['近', '👁', 'キン', 'ちか(い)', 'CẬN (gần)', '{最近|さいきん} · {近|ちか}い (Bài 6)'],
        ['日', '✍', 'ニチ・ジツ', 'ひ・か', 'NHẬT (ngày)', '{1日|いちにち} · {3日|みっか} · {毎日|まいにち}'],
        ['週', '👁', 'シュウ', '—', 'CHU (tuần)', '{1週間|いっしゅうかん} · {週末|しゅうまつ}'],
        ['間', '👁', 'カン・ケン', 'あいだ・ま', 'GIAN (khoảng)', '{1週間|いっしゅうかん} · {時間|じかん}'],
        ['月', '✍', 'ゲツ・ガツ', 'つき', 'NGUYỆT (tháng)', '{1か月|いっかげつ} (げつ) · {1月|いちがつ} (がつ)'],
        ['年', '✍', 'ネン', 'とし', 'NIÊN (năm)', '{1年|いちねん} · {毎年|まいとし} (とし)'],
        ['回', '✍', 'カイ', 'まわ(る)', 'HỒI (lần)', '{1回|いっかい} · {何回|なんかい}'],
        ['冊', '👁', 'サツ', '—', 'SÁCH (quyển)', '{1冊|いっさつ} · {2冊|にさつ}'],
        ['杯', '👁', 'ハイ', 'さかずき', 'BÔI (chén)', '{1杯|いっぱい} · {3杯|さんばい}'],
        ['本', '✍', 'ホン', 'もと', 'BẢN (gốc; quyển sách)', '{本|ほん} (sách) · {1本|いっぽん} · {日本|にほん}'],
      ],
    },
    {
      t: 'table',
      caption: '3. Món ăn, động từ, phó từ (chủ đề 1)',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['料', '👁', 'リョウ', '—', 'LIỆU (nguyên liệu)', '～{料理|りょうり}'],
        ['理', '👁', 'リ', '—', 'LÝ (lý lẽ)', '{料理|りょうり}'],
        ['泳', '👁', 'エイ', 'およ(ぐ)', 'VỊNH (bơi)', '{泳|およ}ぎます · {水泳|すいえい} (bơi lội)'],
        ['描', '👁', 'ビョウ', 'か(く)・えが(く)', 'MIÊU (vẽ)', '{描|か}きます'],
        ['集', '👁', 'シュウ', 'あつ(める)', 'TẬP (tập hợp)', '{集|あつ}めます'],
        ['運', '👁', 'ウン', 'はこ(ぶ)', 'VẬN (vận chuyển)', '{運転|うんてん}'],
        ['転', '👁', 'テン', 'ころ(ぶ)', 'CHUYỂN (xoay)', '{運転|うんてん}'],
        ['特', '👁', 'トク', '—', 'ĐẶC (đặc biệt)', '{特|とく}に'],
        ['全', '👁', 'ゼン', 'まった(く)', 'TOÀN', '{全然|ぜんぜん} · {全部|ぜんぶ} (Bài 6)'],
        ['然', '👁', 'ゼン・ネン', '—', 'NHIÊN', '{全然|ぜんぜん}'],
      ],
    },
    {
      t: 'table',
      caption: '4. Câu lạc bộ, lớp học (chủ đề 2)',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['書', '👁', 'ショ', 'か(く)', 'THƯ (viết, sách)', '{書道|しょどう} · {書|か}きます · {辞書|じしょ}'],
        ['道', '👁', 'ドウ', 'みち', 'ĐẠO (đường)', '{書道|しょどう} · {北海道|ほっかいどう} · {道|みち}'],
        ['教', '👁', 'キョウ', 'おし(える)', 'GIÁO (dạy)', '{教室|きょうしつ} · {教|おし}えます'],
        ['室', '👁', 'シツ', 'むろ', 'THẤT (phòng)', '{教室|きょうしつ}'],
        ['習', '👁', 'シュウ', 'なら(う)', 'TẬP (học tập)', '{習|なら}います'],
        ['乗', '👁', 'ジョウ', 'の(る)', 'THỪA (cưỡi, lên xe)', '{乗|の}ります'],
        ['入', '✍', 'ニュウ', 'はい(る)・い(れる)', 'NHẬP (vào)', '{入|はい}ります · {入|い}れます (Bài 7)'],
        ['申', '👁', 'シン', 'もう(す)', 'THÂN (trình bày)', '{申|もう}し{込|こ}みます'],
        ['込', '👁', '—', 'こ(む)', '(chữ Nhật tự tạo: "vào trong")', '{申|もう}し{込|こ}みます'],
        ['参', '👁', 'サン', 'まい(る)', 'THAM (tham dự)', '{参加|さんか}'],
        ['加', '👁', 'カ', 'くわ(える)', 'GIA (thêm vào)', '{参加|さんか}'],
        ['上', '✍', 'ジョウ', 'うえ', 'THƯỢNG (trên)', '{上手|じょうず}に · {上|うえ} (Bài 7)'],
      ],
    },
    {
      t: 'table',
      caption: '5. Thủ tục, giấy tờ, đi lại (chủ đề 3)',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['受', '👁', 'ジュ', 'う(ける)', 'THỤ (nhận)', '{受付|うけつけ}'],
        ['付', '👁', 'フ', 'つ(ける)', 'PHÓ (gắn)', '{受付|うけつけ}'],
        ['外', '✍', 'ガイ', 'そと', 'NGOẠI (ngoài)', '{外国人|がいこくじん} · {外|そと} (Bài 7)'],
        ['国', '✍', 'コク', 'くに', 'QUỐC (nước)', '{外国人|がいこくじん} (こく) · {国|くに}'],
        ['人', '✍', 'ジン・ニン', 'ひと', 'NHÂN (người)', '{外国人|がいこくじん} (じん) · {3人|さんにん}'],
        ['登', '👁', 'トウ・ト', 'のぼ(る)', 'ĐĂNG (lên)', '{登録|とうろく} · {山|やま}に{登|のぼ}ります'],
        ['録', '👁', 'ロク', '—', 'LỤC (ghi chép)', '{登録|とうろく}'],
        ['証', '👁', 'ショウ', '—', 'CHỨNG (chứng nhận)', '{登録証|とうろくしょう}'],
        ['住', '👁', 'ジュウ', 'す(む)', 'TRÚ (ở)', '{住所|じゅうしょ} · {住|す}んでいます (Bài 8)'],
        ['所', '👁', 'ショ', 'ところ', 'SỞ (nơi)', '{住所|じゅうしょ} · {台所|だいどころ} (Bài 7)'],
        ['宿', '👁', 'シュク', 'やど', 'TÚC (trọ)', '{宿題|しゅくだい}'],
        ['題', '👁', 'ダイ', '—', 'ĐỀ (đề bài)', '{宿題|しゅくだい}'],
        ['電', '👁', 'デン', '—', 'ĐIỆN', '{電話番号|でんわばんごう} · {電車|でんしゃ}'],
        ['話', '👁', 'ワ', 'はな(す)', 'THOẠI (nói)', '{電話|でんわ} · {話|はな}します'],
        ['番', '👁', 'バン', '—', 'PHIÊN (lượt, số)', '{番号|ばんごう} · {3番|さんばん}'],
        ['号', '👁', 'ゴウ', '—', 'HIỆU (số hiệu)', '{番号|ばんごう}'],
        ['言', '✍', 'ゲン・ゴン', 'い(う)', 'NGÔN (nói)', '{言|い}います'],
        ['払', '👁', 'フツ', 'はら(う)', 'PHẤT (trả, phủi)', '{払|はら}います'],
        ['降', '👁', 'コウ', 'お(りる)・ふ(る)', 'GIÁNG (xuống)', '{降|お}ります · {雨|あめ}が{降|ふ}ります'],
        ['見', '✍', 'ケン', 'み(る)・み(せる)', 'KIẾN (thấy)', '{見|み}せます · {見|み}ます'],
        ['予', '👁', 'ヨ', '—', 'DỰ (trước)', '{予約|よやく}'],
        ['約', '👁', 'ヤク', '—', 'ƯỚC (hẹn)', '{予約|よやく} · {約束|やくそく} (Bài 6)'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ',
      items: [
        '**Hán Việt đoán nghĩa**: 趣味 = THÚ VỊ (sở thích), 小説 = TIỂU THUYẾT, 漫画 = MẠN HOẠ (truyện tranh), 最近 = TỐI CẬN (gần nhất = dạo này), 特に = ĐẶC (đặc biệt), 全然 = TOÀN NHIÊN, 書道 = THƯ ĐẠO (đạo viết chữ), 参加 = THAM GIA, 教室 = GIÁO THẤT (phòng dạy), 住所 = TRÚ SỞ (nơi ở), 宿題 = TÚC ĐỀ (đề bài mang về chỗ trọ = bài tập về nhà), 予約 = DỰ ƯỚC (hẹn trước), 電話番号 = ĐIỆN THOẠI PHIÊN HIỆU, 外国人登録証 = NGOẠI QUỐC NHÂN ĐĂNG LỤC CHỨNG.',
        '**Cùng âm かく**: {書|か}く (viết chữ — bộ bút 聿) ↔ {描|か}く (vẽ tranh — bộ tay 扌). Trong đề đọc, nhìn tân ngữ: 漢字を → 書, 絵を → 描.',
        '**Biến âm cần nhớ**: 切手 **きっ**て, 上手 じょう**ず**, 1週間 **いっ**しゅうかん, 1か月 **いっ**かげつ, 3杯 さん**ば**い, 1本 **いっぽ**ん, 毎年 まい**とし**.',
        '**Hai âm Kun của 降**: お(りる) = xuống xe; ふ(る) = (mưa, tuyết) rơi. Bài 9 chỉ dùng お(りる).',
      ],
    },
    {
      t: 'mcq',
      id: 'b9-kj-doc',
      title: 'Đọc chữ Hán — chọn cách đọc đúng',
      items: [
        { q: '趣味', options: ['しゅうみ', 'しゅみ', 'しゅび', 'しゅあじ'], correct: 1, why: '**しゅみ** — しゅ ngắn, không có う.' },
        { q: '小説', options: ['しょうせつ', 'しょせつ', 'こせつ', 'ちいせつ'], correct: 0, why: '小 ショウ + 説 セツ = **しょうせつ**.' },
        { q: '漫画', options: ['まんか', 'まんが', 'まが', 'まんがく'], correct: 1, why: '**まんが** — truyện tranh.' },
        { q: '切手', options: ['きりて', 'きって', 'せって', 'せつしゅ'], correct: 1, why: 'き(る) → **きっ** + て: きって.' },
        { q: 'お菓子', options: ['おかこ', 'おかし', 'おがし', 'おかじ'], correct: 1, why: '菓 カ + 子 シ = **かし**.' },
        { q: '最近', options: ['さいちか', 'さいきん', 'もっきん', 'さいこん'], correct: 1, why: '**さいきん** — dạo này.' },
        { q: '1週間', options: ['いちしゅうかん', 'いっしゅうかん', 'いっしゅかん', 'いちしゅかん'], correct: 1, why: 'いち → **いっ** + しゅうかん.' },
        { q: '1か月', options: ['いちかげつ', 'いっかげつ', 'いっかがつ', 'いちかつき'], correct: 1, why: '**いっかげつ** — một tháng (khoảng thời gian).' },
        { q: '3杯', options: ['さんはい', 'さんばい', 'さんぱい', 'みはい'], correct: 1, why: '3 + 杯 → **さんばい**.' },
        { q: '1本', options: ['いちほん', 'いっぽん', 'いっほん', 'いちぼん'], correct: 1, why: '**いっぽん**.' },
        { q: '運転', options: ['うんてん', 'うんでん', 'うてん', 'はこてん'], correct: 0, why: '**うんてん** — lái xe.' },
        { q: '特に', options: ['とくに', 'とっに', 'どくに', 'とうに'], correct: 0, why: '**とくに** — đặc biệt là.' },
        { q: '全然', options: ['ぜんねん', 'ぜんぜん', 'せんぜん', 'ぜぜん'], correct: 1, why: '**ぜんぜん** — hoàn toàn (không).' },
        { q: '書道', options: ['しょどう', 'しょみち', 'かきどう', 'しょうどう'], correct: 0, why: '**しょどう** — thư pháp (しょ ngắn).' },
        { q: '教室', options: ['きょうしつ', 'きょしつ', 'おしえしつ', 'きょうむろ'], correct: 0, why: '**きょうしつ** — lớp học.' },
        { q: '参加', options: ['さんか', 'さんが', 'ざんか', 'まいか'], correct: 0, why: '**さんか** — tham gia.' },
        { q: '申し込みます', options: ['もうしこみます', 'しんしこみます', 'もしこみます', 'もうしごみます'], correct: 0, why: '**もうしこみます** — đăng ký.' },
        { q: '上手に', options: ['うえてに', 'じょうずに', 'じょうてに', 'じょずに'], correct: 1, why: 'Đọc đặc biệt **じょうず**.' },
        { q: '受付', options: ['うけつけ', 'じゅふ', 'うけづけ', 'じゅつけ'], correct: 0, why: '**うけつけ** — quầy tiếp tân.' },
        { q: '住所', options: ['すみしょ', 'じゅうしょ', 'じゅしょ', 'じゅうところ'], correct: 1, why: '**じゅうしょ** — trường âm じゅう.' },
        { q: '宿題', options: ['しゅくだい', 'しゅくだ', 'やどだい', 'しゅうだい'], correct: 0, why: '**しゅくだい** — bài tập về nhà.' },
        { q: '電話番号', options: ['でんわばんご', 'でんわばんごう', 'でんはばんごう', 'でんわはんごう'], correct: 1, why: '**でんわばんごう** — ごう có trường âm.' },
        { q: '外国人登録証', options: ['がいこくじんとうろくしょう', 'そとくにひととうろくしょう', 'がいこくにんとうろくしょう', 'がいこくじんとろくしょう'], correct: 0, why: '**がいこくじん とうろくしょう**.' },
        { q: '予約', options: ['よやく', 'ようやく', 'よっやく', 'よやっく'], correct: 0, why: '**よやく** — đặt trước.' },
        { q: '降ります (xuống xe)', options: ['ふります', 'おります', 'こうります', 'くだります'], correct: 1, why: 'Xuống xe → **お**ります. ふります là "mưa rơi".' },
      ],
    },

    /* ── Đứng riêng / đứng chung ── */
    { t: 'h', text: 'Đứng riêng hay đứng chung — một chữ, hai cách đọc' },
    {
      t: 'p',
      text: 'Quy tắc gần đúng: **chữ đứng một mình / có đuôi kana → âm Kun** (âm Nhật); **hai chữ Hán ghép với nhau → âm On** (âm Hán). Bảng dưới là các chữ Bài 9 có cả hai cách đọc — đọc hàng ngang để thấy cùng một chữ đổi âm thế nào.',
    },
    {
      t: 'table',
      caption: 'Chữ Bài 9 — đứng riêng (Kun) ↔ trong từ ghép (On)',
      head: ['Chữ', 'Đứng riêng (Kun) — từ, nghĩa', 'Trong từ ghép (On) — từ, nghĩa'],
      rows: [
        ['手', '{手|て} te — tay', '{歌手|かしゅ} kashu — ca sĩ · ({切手|きって} kitte — tem: ngoại lệ, て vẫn Kun) · {上手|じょうず} jouzu — giỏi (đọc đặc biệt)'],
        ['小', '{小|ちい}さい chiisai — nhỏ', '{小説|しょうせつ} shousetsu — tiểu thuyết · {小学生|しょうがくせい} shougakusei — học sinh tiểu học'],
        ['日', '{日|ひ} hi — ngày · {3日|みっか} mikka — 3 ngày', '{毎日|まいにち} mainichi — mỗi ngày · {日本|にほん} Nihon · {1日|いちにち} ichinichi — một ngày'],
        ['月', '{月|つき} tsuki — mặt trăng', '{1か月|いっかげつ} ikkagetsu — một tháng · {月曜日|げつようび} getsuyoubi · {1月|いちがつ} ichigatsu — tháng Một'],
        ['年', '{毎年|まいとし} maitoshi — hằng năm (とし: ngoại lệ)', '{1年|いちねん} ichinen — một năm · {去年|きょねん} kyonen — năm ngoái · {来年|らいねん} rainen'],
        ['回', '{回|まわ}ります mawarimasu — quay (chưa học)', '{1回|いっかい} ikkai — 1 lần · {何回|なんかい} nankai — mấy lần · {今回|こんかい} konkai — lần này'],
        ['近', '{近|ちか}い chikai — gần · {近|ちか}く chikaku — chỗ gần', '{最近|さいきん} saikin — dạo này'],
        ['間', '{間|あいだ} aida — ở giữa (Bài 7)', '{1週間|いっしゅうかん} isshuukan — một tuần · {時間|じかん} jikan — thời gian'],
        ['泳', '{泳|およ}ぐ oyogu — bơi', '{水泳|すいえい} suiei — môn bơi lội'],
        ['書', '{書|か}く kaku — viết', '{書道|しょどう} shodou — thư pháp · {辞書|じしょ} jisho — từ điển · {図書館|としょかん} toshokan'],
        ['道', '{道|みち} michi — con đường', '{書道|しょどう} shodou · {北海道|ほっかいどう} Hokkaidou'],
        ['教', '{教|おし}える oshieru — dạy', '{教室|きょうしつ} kyoushitsu — lớp học · {教師|きょうし} kyoushi — giáo viên (Bài 1)'],
        ['入', '{入|はい}る hairu — vào · {入|い}れる ireru — cho vào', '{入学|にゅうがく} nyuugaku — nhập học (sẽ gặp)'],
        ['上', '{上|うえ} ue — trên', '{上手|じょうず} jouzu — giỏi (đọc đặc biệt) · {上|じょう} (On: じょう)'],
        ['外', '{外|そと} soto — bên ngoài', '{外国|がいこく} gaikoku — nước ngoài · {外国人|がいこくじん} gaikokujin'],
        ['国', '{国|くに} kuni — đất nước', '{外国|がいこく} gaikoku · {中国|ちゅうごく} Chuugoku — Trung Quốc'],
        ['人', '{人|ひと} hito — người', '{外国人|がいこくじん} gaikokujin (じん — người nước…) · {3人|さんにん} sannin (にん — đếm người)'],
        ['登', '{登|のぼ}る noboru — leo', '{登録|とうろく} touroku — đăng ký (giấy tờ)'],
        ['住', '{住|す}む sumu — sống, ở', '{住所|じゅうしょ} juusho — địa chỉ'],
        ['所', '{所|ところ} tokoro — nơi, chỗ', '{住所|じゅうしょ} juusho · ({台所|だいどころ} daidokoro — bếp: ngoại lệ, đọc ところ→どころ)'],
        ['話', '{話|はな}す hanasu — nói · {話|はなし} hanashi — câu chuyện', '{電話|でんわ} denwa — điện thoại · {会話|かいわ} kaiwa — hội thoại'],
        ['言', '{言|い}う iu — nói', '{言語|げんご} gengo — ngôn ngữ (sẽ gặp)'],
        ['集', '{集|あつ}める atsumeru — sưu tầm', '{集合|しゅうごう} shuugou — tập trung (sẽ gặp)'],
        ['見', '{見|み}る miru — xem · {見|み}せる miseru — cho xem', '{見学|けんがく} kengaku — tham quan học tập (sẽ gặp)'],
      ],
    },
    {
      t: 'note',
      title: 'Cách đọc bất quy tắc hay gặp trong bài (thuộc lòng)',
      items: [
        '**{上手|じょうず}** jouzu (không đọc ~~じょうて~~) — 手 đọc ず chỉ trong từ này.',
        '**{切手|きって}** kitte — ghép nhưng dùng âm Kun (き(る) → きっ + て).',
        '**{1日|いちにち}** (một ngày, khoảng thời gian) ≠ **{1日|ついたち}** (mùng 1); **{2日|ふつか}** vừa là "2 ngày" vừa là "mùng 2".',
        '**{毎年|まいとし}** (cũng nói まいねん); **{今年|ことし}** kotoshi; **{今日|きょう}** kyou — cả từ có cách đọc riêng.',
        '**{1週間|いっしゅうかん}, {1か月|いっかげつ}, {1回|いっかい}, {1冊|いっさつ}, {1杯|いっぱい}, {1本|いっぽん}** — số 1 luôn thành **いっ** trước か／さ／は／ほ.',
        '**{外国人登録証|がいこくじんとうろくしょう}** — từ dài nhất bài, tách thành 3 khúc: がいこく・じん／とうろく／しょう.',
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
      id: 'b9-doc-kanji',
      title: 'Đọc to từng câu — từ chữ Hán Bài 9',
      note: 'Đọc hết cả câu một hơi. Chỗ vấp nhiều nhất: 趣味 (しゅみ, không しゅうみ), 上手 (じょうず), 1週間 (いっしゅうかん), 3杯 (さんばい).',
      items: [
        { text: '{私|わたし}の{趣味|しゅみ}は{映画|えいが}を{見|み}ることです。', ro: 'Watashi no shumi wa eiga o miru koto desu.', vi: 'Sở thích của tôi là xem phim.' },
        { text: '{特|とく}に、{日本|にほん}の{小説|しょうせつ}が{好|す}きです。', ro: 'Toku ni, Nihon no shousetsu ga suki desu.', vi: 'Đặc biệt tôi thích tiểu thuyết Nhật.' },
        { text: '{1週間|いっしゅうかん}に{2回|にかい}、プールで{泳|およ}ぎます。', ro: 'Isshuukan ni nikai, puuru de oyogimasu.', vi: 'Một tuần tôi bơi ở bể bơi 2 lần.' },
        { text: '{最近|さいきん}、{全然|ぜんぜん}{漫画|まんが}を{読|よ}みません。', ro: 'Saikin, zenzen manga o yomimasen.', vi: 'Dạo này tôi hoàn toàn không đọc truyện tranh.' },
        { text: '{花|はな}の{切手|きって}を{集|あつ}めています。', ro: 'Hana no kitte o atsumete imasu.', vi: 'Tôi đang sưu tầm tem hình hoa.' },
        { text: '{1日|いちにち}にコーヒーを{3杯|さんばい}{飲|の}みます。', ro: 'Ichinichi ni koohii o sanbai nomimasu.', vi: 'Một ngày tôi uống 3 cốc cà phê.' },
        { text: '{1か月|いっかげつ}に{本|ほん}を{2冊|にさつ}{読|よ}みます。', ro: 'Ikkagetsu ni hon o nisatsu yomimasu.', vi: 'Một tháng tôi đọc 2 quyển sách.' },
        { text: '{父|ちち}は{車|くるま}の{運転|うんてん}ができます。', ro: 'Chichi wa kuruma no unten ga dekimasu.', vi: 'Bố tôi biết lái ô tô.' },
        { text: '{上手|じょうず}に{絵|え}を{描|か}くことができません。', ro: 'Jouzu ni e o kaku koto ga dekimasen.', vi: 'Tôi không vẽ tranh giỏi được.' },
        { text: '{書道|しょどう}{教室|きょうしつ}で{漢字|かんじ}を{習|なら}います。', ro: 'Shodou kyoushitsu de kanji o naraimasu.', vi: 'Tôi học chữ Hán ở lớp thư pháp.' },
        { text: 'スキー{旅行|りょこう}に{参加|さんか}したいです。', ro: 'Sukii ryokou ni sanka shitai desu.', vi: 'Tôi muốn tham gia chuyến du lịch trượt tuyết.' },
        { text: '{料理|りょうり}{教室|きょうしつ}に{申|もう}し{込|こ}みました。', ro: 'Ryouri kyoushitsu ni moushikomimashita.', vi: 'Tôi đã đăng ký lớp nấu ăn.' },
        { text: '{受付|うけつけ}で{住所|じゅうしょ}と{電話番号|でんわばんごう}を{書|か}きます。', ro: 'Uketsuke de juusho to denwa bangou o kakimasu.', vi: 'Viết địa chỉ và số điện thoại ở quầy tiếp tân.' },
        { text: '{外国人登録証|がいこくじんとうろくしょう}を{見|み}せてください。', ro: 'Gaikokujin tourokushou o misete kudasai.', vi: 'Xin cho xem thẻ đăng ký người nước ngoài.' },
        { text: '{3番|さんばん}のバスに{乗|の}って、{駅|えき}で{降|お}ります。', ro: 'Sanban no basu ni notte, eki de orimasu.', vi: 'Lên xe buýt số 3, xuống ở ga.' },
        { text: 'インターネットで{予約|よやく}して、お{金|かね}を{払|はら}います。', ro: 'Intaanetto de yoyaku shite, okane o haraimasu.', vi: 'Đặt trước trên mạng rồi trả tiền.' },
        { text: '{名前|なまえ}と{住所|じゅうしょ}を{言|い}ってください。', ro: 'Namae to juusho o itte kudasai.', vi: 'Hãy nói tên và địa chỉ.' },
        { text: '{宿題|しゅくだい}をして、お{菓子|かし}を{作|つく}りました。', ro: 'Shukudai o shite, okashi o tsukurimashita.', vi: 'Tôi làm bài tập rồi làm bánh kẹo.' },
        { text: '{釣|つ}りは{楽|たの}しいです。でも、{少|すこ}し{難|むずか}しいです。', ro: 'Tsuri wa tanoshii desu. Demo, sukoshi muzukashii desu.', vi: 'Câu cá vui. Nhưng hơi khó.' },
        { text: '{友達|ともだち}とダンスクラブに{入|はい}りました。', ro: 'Tomodachi to dansu kurabu ni hairimashita.', vi: 'Tôi đã vào CLB nhảy cùng bạn.' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b9-doc-doan',
      title: 'Đọc to cả đoạn — khuôn đề Reading (~100 chữ)',
      note: 'Như đề thật: phần lớn là hiragana, vài từ katakana, 4–5 từ chữ Hán không furigana. 30 giây nhìn trước, rồi đọc một lượt không dừng.',
      items: [
        { text: 'わたしの{趣味|しゅみ}はえいがをみることです。とくに、アクションえいががすきです。{1週間|いっしゅうかん}に{2回|にかい}くらい、ともだちとみにいきます。でも、{最近|さいきん}はあまりいきません。しゅくだいがたくさんありますから。', ro: 'Watashi no shumi wa eiga o miru koto desu. Toku ni, akushon eiga ga suki desu. Isshuukan ni nikai kurai, tomodachi to mi ni ikimasu. Demo, saikin wa amari ikimasen. Shukudai ga takusan arimasu kara.', vi: 'Sở thích của tôi là xem phim. Đặc biệt tôi thích phim hành động. Khoảng 1 tuần 2 lần tôi đi xem với bạn. Nhưng dạo này tôi không đi mấy. Vì có nhiều bài tập.' },
        { text: 'きのう、としょかんへいきました。{受付|うけつけ}でカードをつくりました。なまえと{住所|じゅうしょ}と{電話番号|でんわばんごう}をかいて、{外国人登録証|がいこくじんとうろくしょう}をみせました。それから、ほんをさんさつかりました。', ro: 'Kinou, toshokan e ikimashita. Uketsuke de kaado o tsukurimashita. Namae to juusho to denwa bangou o kaite, gaikokujin tourokushou o misemashita. Sore kara, hon o sansatsu karimashita.', vi: 'Hôm qua tôi đến thư viện. Tôi làm thẻ ở quầy tiếp tân. Tôi viết tên, địa chỉ, số điện thoại rồi cho xem thẻ đăng ký người nước ngoài. Sau đó tôi mượn 3 quyển sách.' },
        { text: 'わたしはスキーができます。でも、ダンスはぜんぜんできません。らいげつ、がっこうでダンスの{教室|きょうしつ}があります。わたしはこのきょうしつに{申|もう}し{込|こ}みました。{上手|じょうず}なせんせいにダンスを{習|なら}いたいです。', ro: 'Watashi wa sukii ga dekimasu. Demo, dansu wa zenzen dekimasen. Raigetsu, gakkou de dansu no kyoushitsu ga arimasu. Watashi wa kono kyoushitsu ni moushikomimashita. Jouzu na sensei ni dansu o naraitai desu.', vi: 'Tôi trượt tuyết được. Nhưng nhảy thì hoàn toàn không. Tháng sau ở trường có lớp nhảy. Tôi đã đăng ký lớp này. Tôi muốn học nhảy với thầy/cô giỏi.' },
        { text: 'しゅうまつ、ともだちとうえのへいって、びじゅつかんでえをみて、ちゅうかりょうりをたべました。えきのまえで{3番|さんばん}のバスに{乗|の}って、びじゅつかんまえで{降|お}ります。{料理|りょうり}もおいしくて、とてもたのしかったです。', ro: 'Shuumatsu, tomodachi to Ueno e itte, bijutsukan de e o mite, chuuka ryouri o tabemashita. Eki no mae de sanban no basu ni notte, bijutsukan mae de orimasu. Ryouri mo oishikute, totemo tanoshikatta desu.', vi: 'Cuối tuần tôi đi Ueno với bạn, xem tranh ở bảo tàng rồi ăn món Trung Hoa. Lên xe buýt số 3 trước ga, xuống ở trạm trước bảo tàng. Đồ ăn cũng ngon, rất vui.' },
      ],
    },
    {
      t: 'write',
      id: 'b9-viet-kanji',
      title: 'Tập viết tay chữ Hán Bài 9 — ✍ chữ nên viết trước, rồi đến chữ nhận mặt',
      note: '15 chữ đầu là ✍ (ít nét, gặp rất nhiều) — ưu tiên viết thuộc. Các chữ sau là 👁: tập vài lượt cho nhớ mặt chữ là đủ. Mỗi nhóm 10 chữ (bấm dải chữ để chuyển nhóm). Bấm ▶ Thứ tự nét trước khi viết; viết xong nhờ ✨ AI xem chữ.',
      chars: [
        '日', '月', '年', '回', '本', '手', '小', '上', '入', '人', '子', '外', '国', '見', '言',
        '趣', '味', '菓', '切', '説', '漫', '画', '釣', '最', '近', '週', '間', '冊', '杯', '料', '理',
        '泳', '描', '集', '運', '転', '特', '全', '然', '書', '道', '教', '室', '習', '乗', '申', '込',
        '参', '加', '受', '付', '登', '録', '証', '住', '所', '宿', '題', '電', '話', '番', '号', '払', '降', '予', '約',
      ],
    },
  ],
};

/* ═══════════════════════════ 5. NGHE ═══════════════════════════ */

const NGHE: Lesson = {
  id: 'b9-nghe',
  kind: 'listening',
  title: 'Luyện nghe — sở thích & bao lâu một lần · đi lớp nào · thứ tự các bước',
  goal: 'Nghe ra sở thích, "đặc biệt" thích gì và tần suất của từng người; nghe lý do để biết người nói chọn lớp / sự kiện nào; nghe chuỗi Vて để xếp đúng thứ tự các bước.',
  minutes: 40,
  blocks: [
    {
      t: 'note',
      title: 'Cách nghe',
      items: [
        '**Sở thích**: bắt cụm ngay trước **ことです** — đó là sở thích. Sau **{特|とく}に** là thứ "đặc biệt" thích.',
        '**Tần suất**: bắt **[khoảng thời gian]に[số]** ({1週間|いっしゅうかん}に{2回|にかい}) hoặc phó từ **いつも／よく／ときどき／あまり／{全然|ぜんぜん}**. Nghe **でも、{最近|さいきん}** → tần suất HIỆN TẠI đã đổi, lấy thông tin sau でも.',
        '**Chọn lớp**: người nói hay nhắc **cả hai** lựa chọn rồi loại một cái bằng lý do: ～ができませんから／～がありますから. Lấy cái **còn lại cuối cùng**.',
        '**Thứ tự**: Vて、Vて、V — thứ tự nói = thứ tự làm. Chú ý それから (sau đó), {最初|さいしょ}に (đầu tiên — từ thêm).',
      ],
    },

    /* ── Bài 1 ── */
    { t: 'h', text: 'Bài 1 — Sở thích của 4 người: là gì · đặc biệt · bao lâu (やってみよう)' },
    {
      t: 'p',
      text: 'Ở buổi giao lưu, 4 người giới thiệu sở thích. Nghe từng người, điền vào bảng: **{趣味|しゅみ}** (sở thích) · **{特|とく}に** (đặc biệt) · **どのくらい** (bao lâu một lần). Ví dụ: メアリー — {絵|え}を{見|み}ること · ピカソの{絵|え} · {1か月|いっかげつ}に{1|いち}、{2回|にかい}.',
    },
    {
      t: 'listen',
      id: 'b9-ng-1a',
      title: '① {木村|きむら}',
      lines: [
        { who: '{木村|きむら}', voice: 'ja-nu', text: '{私|わたし}の{趣味|しゅみ}はお{菓子|かし}を{作|つく}ることです。{特|とく}に、チーズケーキをよく{作|つく}ります。{1週間|いっしゅうかん}に{1回|いっかい}くらい{作|つく}って、{家族|かぞく}と{食|た}べます。', ro: 'Watashi no shumi wa okashi o tsukuru koto desu. Toku ni, chiizu keeki o yoku tsukurimasu. Isshuukan ni ikkai kurai tsukutte, kazoku to tabemasu.', vi: 'Sở thích của tôi là làm bánh kẹo. Đặc biệt tôi hay làm bánh phô mai. Khoảng 1 tuần 1 lần tôi làm rồi ăn cùng gia đình.' },
      ],
    },
    {
      t: 'listen',
      id: 'b9-ng-1b',
      title: '② パク',
      lines: [
        { who: 'パク', voice: 'ja-nu', text: '{私|わたし}の{趣味|しゅみ}はドラマを{見|み}ることです。{日本|にほん}のドラマも{見|み}ますが、{特|とく}に、{韓国|かんこく}のドラマが{好|す}きです。いつも{晩|ばん}ご{飯|はん}を{食|た}べて、{見|み}ます。{毎晩|まいばん}{2時間|にじかん}くらい{見|み}ます。', ro: 'Watashi no shumi wa dorama o miru koto desu. Nihon no dorama mo mimasu ga, toku ni, Kankoku no dorama ga suki desu. Itsumo bangohan o tabete, mimasu. Maiban nijikan kurai mimasu.', vi: 'Sở thích của tôi là xem phim bộ. Tôi cũng xem phim Nhật nhưng đặc biệt thích phim Hàn. Lúc nào cũng ăn tối xong rồi xem. Tối nào cũng xem khoảng 2 tiếng.' },
      ],
    },
    {
      t: 'listen',
      id: 'b9-ng-1c',
      title: '③ カルロス',
      lines: [
        { who: 'カルロス', voice: 'ja-nam', text: '{僕|ぼく}の{趣味|しゅみ}は{釣|つ}りです。{川|かわ}の{釣|つ}りもしますが、{特|とく}に、{海|うみ}の{釣|つ}りが{好|す}きです。{1か月|いっかげつ}に{2回|にかい}くらい、{友達|ともだち}の{車|くるま}で{海|うみ}へ{行|い}きます。', ro: 'Boku no shumi wa tsuri desu. Kawa no tsuri mo shimasu ga, toku ni, umi no tsuri ga suki desu. Ikkagetsu ni nikai kurai, tomodachi no kuruma de umi e ikimasu.', vi: 'Sở thích của tôi là câu cá. Tôi cũng câu ở sông nhưng đặc biệt thích câu ở biển. Khoảng 1 tháng 2 lần tôi đi biển bằng xe của bạn.' },
      ],
    },
    {
      t: 'listen',
      id: 'b9-ng-1d',
      title: '④ {山口|やまぐち}',
      lines: [
        { who: '{山口|やまぐち}', voice: 'ja-nu', text: '{私|わたし}の{趣味|しゅみ}は{泳|およ}ぐことです。{前|まえ}は{毎日|まいにち}{泳|およ}ぎました。でも、{最近|さいきん}、{仕事|しごと}が{忙|いそが}しいですから、{全然|ぜんぜん}{泳|およ}ぎません。', ro: 'Watashi no shumi wa oyogu koto desu. Mae wa mainichi oyogimashita. Demo, saikin, shigoto ga isogashii desu kara, zenzen oyogimasen.', vi: 'Sở thích của tôi là bơi. Trước đây ngày nào tôi cũng bơi. Nhưng dạo này công việc bận nên tôi hoàn toàn không bơi.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b9-ng-1-q',
      title: 'Điền bảng bài 1',
      items: [
        { q: '① {木村|きむら}さんの{趣味|しゅみ}は{何|なん}ですか。', options: ['ケーキを{食|た}べること', 'お{菓子|かし}を{作|つく}ること', '{料理|りょうり}を{習|なら}うこと', '{家族|かぞく}と{食事|しょくじ}すること'], correct: 1, why: 'お{菓子|かし}を{作|つく}る**こと**です — cụm ngay trước ことです.' },
        { q: '① {特|とく}に？ / どのくらい？', options: ['チーズケーキ · {1週間|いっしゅうかん}に{1回|いっかい}くらい', 'チーズケーキ · {毎日|まいにち}', 'クッキー · {1か月|いっかげつ}に{1回|いっかい}', 'チーズケーキ · {1週間|いっしゅうかん}に{2回|にかい}'], correct: 0, why: '{特|とく}に、チーズケーキ… **{1週間|いっしゅうかん}に{1回|いっかい}くらい**.' },
        { q: '② パクさんは{特|とく}にどんなドラマが{好|す}きですか。', options: ['{日本|にほん}のドラマ', '{韓国|かんこく}のドラマ', 'アメリカのドラマ', 'アクションのドラマ'], correct: 1, why: 'Bẫy: nhắc 日本のドラマ trước, nhưng **{特|とく}に、{韓国|かんこく}のドラマ**.' },
        { q: '② どのくらい{見|み}ますか。', options: ['ときどき', '{1週間|いっしゅうかん}に{2回|にかい}', '{毎晩|まいばん}{2時間|にじかん}くらい', '{週末|しゅうまつ}だけ'], correct: 2, why: 'いつも… **{毎晩|まいばん}{2時間|にじかん}くらい**.' },
        { q: '③ カルロスさんの{趣味|しゅみ}と{特|とく}に{好|す}きなものは？', options: ['{釣|つ}り · {川|かわ}の{釣|つ}り', '{釣|つ}り · {海|うみ}の{釣|つ}り', 'ドライブ · {海|うみ}', '{運転|うんてん} · {友達|ともだち}の{車|くるま}'], correct: 1, why: '{川|かわ}の{釣|つ}りもしますが、**{特|とく}に、{海|うみ}の{釣|つ}り**.' },
        { q: '③ どのくらい{行|い}きますか。', options: ['{1週間|いっしゅうかん}に{2回|にかい}', '{1か月|いっかげつ}に{2回|にかい}くらい', '{1年|いちねん}に{2回|にかい}', '{毎日|まいにち}'], correct: 1, why: '**{1か月|いっかげつ}に{2回|にかい}くらい**.' },
        { q: '④ {山口|やまぐち}さんは{今|いま}、どのくらい{泳|およ}ぎますか。', options: ['{毎日|まいにち}', 'よく', 'ときどき', '{全然|ぜんぜん}{泳|およ}ぎません'], correct: 3, why: 'Bẫy: {毎日|まいにち}{泳|およ}ぎました là TRƯỚC ĐÂY. **でも、{最近|さいきん}…{全然|ぜんぜん}{泳|およ}ぎません** → bây giờ không bơi.' },
      ],
    },

    /* ── Bài 2 ── */
    { t: 'h', text: 'Bài 2 — Đi lớp / sự kiện nào? (やってみよう)' },
    {
      t: 'table',
      caption: 'Bốn poster trên bảng thông báo (tự đặt)',
      head: ['', 'Poster', 'Khi nào', 'Ghi chú'],
      rows: [
        ['ⓐ', '{料理|りょうり}{教室|きょうしつ}', '{毎週|まいしゅう}{月曜日|げつようび} {6時|ろくじ}〜', '{日本|にほん}{料理|りょうり}'],
        ['ⓑ', 'ギター{教室|きょうしつ}', '{毎週|まいしゅう}{日曜日|にちようび} {午後|ごご}{2時|にじ}〜', 'ギターがない{人|ひと}もOK'],
        ['ⓒ', 'ダンスクラブ', '{毎週|まいしゅう}{金曜日|きんようび} {7時|しちじ}〜', 'はじめての{人|ひと}もOK'],
        ['ⓓ', 'ダイビングツアー（{沖縄|おきなわ}）', '{8月|はちがつ}{2日|ふつか}〜{5日|いつか}', '{泳|およ}ぐことができる{人|ひと}'],
      ],
    },
    {
      t: 'listen',
      id: 'b9-ng-2a',
      title: '① ワンとダニエル',
      note: 'Wang sẽ đi cái nào?',
      lines: [
        { who: 'ダニエル', voice: 'ja-nam', text: 'ワンさん、どれに{申|もう}し{込|こ}みますか。', ro: 'Wan-san, dore ni moushikomimasu ka.', vi: 'Wang, bạn đăng ký cái nào?' },
        { who: 'ワン', voice: 'ja-nu', text: 'そうですね。{料理|りょうり}{教室|きょうしつ}もいいですね。でも、{月曜日|げつようび}はアルバイトがあります。', ro: 'Sou desu ne. Ryouri kyoushitsu mo ii desu ne. Demo, getsuyoubi wa arubaito ga arimasu.', vi: 'Để xem. Lớp nấu ăn cũng hay nhỉ. Nhưng thứ Hai mình có ca làm thêm.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'じゃ、ダンスは？', ro: 'Ja, dansu wa?', vi: 'Thế nhảy thì sao?' },
        { who: 'ワン', voice: 'ja-nu', text: 'ダンスはちょっと……。{私|わたし}はピアノを{弾|ひ}くことができます。でも、ギターは{全然|ぜんぜん}できませんから、{習|なら}いたいです。{日曜日|にちようび}は{時間|じかん}がありますから。', ro: 'Dansu wa chotto……. Watashi wa piano o hiku koto ga dekimasu. Demo, gitaa wa zenzen dekimasen kara, naraitai desu. Nichiyoubi wa jikan ga arimasu kara.', vi: 'Nhảy thì hơi… Mình chơi piano được. Nhưng guitar thì hoàn toàn không, nên muốn học. Vì Chủ Nhật mình rảnh.' },
      ],
    },
    {
      t: 'listen',
      id: 'b9-ng-2b',
      title: '② マルコとアンナ',
      note: 'Marco sẽ đi cái nào?',
      lines: [
        { who: 'アンナ', voice: 'ja-nu', text: 'マルコさん、{夏休|なつやす}みに{沖縄|おきなわ}のダイビングツアーに{行|い}きませんか。', ro: 'Maruko-san, natsuyasumi ni Okinawa no daibingu tsuaa ni ikimasen ka.', vi: 'Marco, nghỉ hè đi tour lặn biển Okinawa không?' },
        { who: 'マルコ', voice: 'ja-nam', text: 'ダイビングですか。すみません。{僕|ぼく}は{泳|およ}ぐことができません。', ro: 'Daibingu desu ka. Sumimasen. Boku wa oyogu koto ga dekimasen.', vi: 'Lặn biển à? Xin lỗi. Mình không bơi được.' },
        { who: 'アンナ', voice: 'ja-nu', text: 'そうですか。じゃ、どれがいいですか。', ro: 'Sou desu ka. Ja, dore ga ii desu ka.', vi: 'Vậy à. Thế bạn thích cái nào?' },
        { who: 'マルコ', voice: 'ja-nam', text: '{僕|ぼく}はダンスが{好|す}きです。あまり{上手|じょうず}じゃありませんが、はじめての{人|ひと}もOKですから、この{金曜日|きんようび}のクラブに{入|はい}ります。', ro: 'Boku wa dansu ga suki desu. Amari jouzu ja arimasen ga, hajimete no hito mo OK desu kara, kono kinyoubi no kurabu ni hairimasu.', vi: 'Mình thích nhảy. Không giỏi lắm nhưng người mới cũng được, nên mình sẽ vào câu lạc bộ thứ Sáu này.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b9-ng-2-q',
      title: 'Câu hỏi bài 2',
      items: [
        { q: '① ワンさんはどこへ{行|い}きますか。', options: ['ⓐ {料理|りょうり}{教室|きょうしつ}', 'ⓑ ギター{教室|きょうしつ}', 'ⓒ ダンスクラブ', 'ⓓ ダイビングツアー'], correct: 1, why: 'ⓐ loại (thứ Hai làm thêm), ⓒ loại (ちょっと……); ギターは{全然|ぜんぜん}できませんから、{習|なら}いたい + Chủ Nhật rảnh → **ⓑ**.' },
        { q: '① ワンさんができることは？', options: ['ギター', 'ピアノ', 'ダンス', '{料理|りょうり}'], correct: 1, why: 'ピアノを{弾|ひ}く**ことができます**.' },
        { q: '② マルコさんはどこへ{行|い}きますか。', options: ['ⓐ', 'ⓑ', 'ⓒ', 'ⓓ'], correct: 2, why: '{泳|およ}ぐことができません → không đi ⓓ; **{金曜日|きんようび}のクラブ** = ⓒ ダンスクラブ.' },
        { q: '② どうしてマルコさんはダイビングに{行|い}きませんか。', options: ['{時間|じかん}がありませんから', '{泳|およ}ぐことができませんから', 'お{金|かね}がありませんから', 'ダンスが{好|す}きですから'], correct: 1, why: '{僕|ぼく}は**{泳|およ}ぐことができません**.' },
      ],
    },

    /* ── Bài 3 ── */
    { t: 'h', text: 'Bài 3 — Thứ tự các bước (やってみよう)' },
    {
      t: 'p',
      text: 'Nghe 3 người giải thích. Mỗi bài có 4 việc (a–d) bị xáo trộn; chọn **thứ tự đúng**.',
    },
    {
      t: 'table',
      caption: 'Các việc bị xáo trộn',
      head: ['', 'a', 'b', 'c', 'd'],
      rows: [
        ['① Làm thẻ thư viện', '{本|ほん}を{借|か}ります', '{外国人登録証|がいこくじんとうろくしょう}を{見|み}せます', '{受付|うけつけ}で{名前|なまえ}と{住所|じゅうしょ}を{書|か}きます', 'カードをもらいます'],
        ['② Đi bảo tàng', 'バスに{乗|の}ります', 'やなぎ{駅|えき}で{降|お}ります', 'さくら{駅|えき}で{電車|でんしゃ}に{乗|の}ります', '{美術館|びじゅつかん}{前|まえ}で{降|お}ります'],
        ['③ Cuối tuần của Natapon', '{友達|ともだち}に{会|あ}います', '{食事|しょくじ}します', '{新宿|しんじゅく}まで{歩|ある}きます', '{映画|えいが}を{見|み}ます'],
      ],
    },
    {
      t: 'listen',
      id: 'b9-ng-3a',
      title: '① {図書館|としょかん}のカード',
      lines: [
        { who: 'パク', voice: 'ja-nu', text: 'すみません。どうやって{図書館|としょかん}のカードを{作|つく}りますか。', ro: 'Sumimasen. Dou yatte toshokan no kaado o tsukurimasu ka.', vi: 'Xin lỗi. Làm thẻ thư viện thế nào ạ?' },
        { who: '{木村|きむら}', voice: 'ja-nu', text: 'まず、{受付|うけつけ}で{名前|なまえ}と{住所|じゅうしょ}を{書|か}いて、{外国人登録証|がいこくじんとうろくしょう}を{見|み}せてください。それから、カードをもらって、{本|ほん}を{借|か}ります。', ro: 'Mazu, uketsuke de namae to juusho o kaite, gaikokujin tourokushou o misete kudasai. Sore kara, kaado o moratte, hon o karimasu.', vi: 'Trước hết, viết tên và địa chỉ ở quầy tiếp tân rồi cho xem thẻ đăng ký người nước ngoài. Sau đó nhận thẻ rồi mượn sách.' },
      ],
    },
    {
      t: 'listen',
      id: 'b9-ng-3b',
      title: '② {美術館|びじゅつかん}への{行|い}き{方|かた}',
      lines: [
        { who: 'ダニエル', voice: 'ja-nam', text: 'メアリーさん、どうやってみどり{美術館|びじゅつかん}へ{行|い}きますか。', ro: 'Mearii-san, dou yatte Midori bijutsukan e ikimasu ka.', vi: 'Mary, đi bảo tàng Midori thế nào?' },
        { who: 'メアリー', voice: 'ja-nu', text: 'さくら{駅|えき}で{電車|でんしゃ}に{乗|の}って、やなぎ{駅|えき}で{降|お}ります。それから、{駅|えき}の{前|まえ}でバスに{乗|の}って、「{美術館|びじゅつかん}{前|まえ}」で{降|お}ります。', ro: 'Sakura eki de densha ni notte, Yanagi eki de orimasu. Sore kara, eki no mae de basu ni notte, "Bijutsukan mae" de orimasu.', vi: 'Lên tàu ở ga Sakura, xuống ở ga Yanagi. Sau đó lên xe buýt trước ga, xuống ở trạm "Trước bảo tàng".' },
      ],
    },
    {
      t: 'listen',
      id: 'b9-ng-3c',
      title: '③ ナタポンの{週末|しゅうまつ}',
      lines: [
        { who: 'アンナ', voice: 'ja-nu', text: 'ナタポンさん、{週末|しゅうまつ}、{何|なに}をしましたか。', ro: 'Natapon-san, shuumatsu, nani o shimashita ka.', vi: 'Natapon, cuối tuần bạn làm gì?' },
        { who: 'ナタポン', voice: 'ja-nam', text: '{土曜日|どようび}に{駅|えき}で{友達|ともだち}に{会|あ}って、{新宿|しんじゅく}まで{歩|ある}きました。それから、{映画|えいが}を{見|み}て、{食事|しょくじ}しました。', ro: 'Doyoubi ni eki de tomodachi ni atte, Shinjuku made arukimashita. Sore kara, eiga o mite, shokuji shimashita.', vi: 'Thứ Bảy mình gặp bạn ở ga rồi đi bộ đến Shinjuku. Sau đó xem phim rồi đi ăn.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b9-ng-3-q',
      title: 'Chọn thứ tự đúng',
      items: [
        { q: '① Làm thẻ thư viện', options: ['a → b → c → d', 'c → b → d → a', 'c → d → b → a', 'b → c → d → a'], correct: 1, why: '{書|か}いて (c) → {見|み}せて (b) → カードをもらって (d) → {本|ほん}を{借|か}ります (a).' },
        { q: '② Đi bảo tàng', options: ['a → b → c → d', 'c → d → a → b', 'c → b → a → d', 'a → d → c → b'], correct: 2, why: '{電車|でんしゃ}に{乗|の}って (c) → やなぎ{駅|えき}で{降|お}ります (b) → バスに{乗|の}って (a) → {美術館|びじゅつかん}{前|まえ}で{降|お}ります (d).' },
        { q: '③ Cuối tuần của Natapon', options: ['a → c → d → b', 'c → a → d → b', 'a → d → c → b', 'd → b → a → c'], correct: 0, why: '{会|あ}って (a) → {歩|ある}きました (c) → {見|み}て (d) → {食事|しょくじ}しました (b).' },
      ],
    },

    /* ── Bài 4 ── */
    { t: 'h', text: 'Bài 4 — Hội thoại dài: ở buổi giao lưu (もう{一度|いちど}{聞|き}こう)' },
    {
      t: 'listen',
      id: 'b9-ng-4',
      title: 'Kimura và Marco ở buổi giao lưu',
      note: 'Nghe cả bài 2 lần rồi trả lời 6 câu.',
      lines: [
        { who: '{木村|きむら}', voice: 'ja-nu', text: 'はじめまして。{木村|きむら}です。', ro: 'Hajimemashite. Kimura desu.', vi: 'Rất vui được gặp. Tôi là Kimura.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'はじめまして。マルコです。よろしくお{願|ねが}いします。', ro: 'Hajimemashite. Maruko desu. Yoroshiku onegaishimasu.', vi: 'Rất vui được gặp. Tôi là Marco. Mong được giúp đỡ.' },
        { who: '{木村|きむら}', voice: 'ja-nu', text: 'マルコさんは{会社員|かいしゃいん}ですか。', ro: 'Maruko-san wa kaishain desu ka.', vi: 'Anh Marco là nhân viên công ty à?' },
        { who: 'マルコ', voice: 'ja-nam', text: 'いいえ、{学生|がくせい}です。{大学|だいがく}でコンピューターを{勉強|べんきょう}しています。', ro: 'Iie, gakusei desu. Daigaku de konpyuutaa o benkyou shite imasu.', vi: 'Không, tôi là sinh viên. Tôi đang học máy tính ở đại học.' },
        { who: '{木村|きむら}', voice: 'ja-nu', text: 'そうですか。マルコさんの{趣味|しゅみ}は{何|なん}ですか。', ro: 'Sou desu ka. Maruko-san no shumi wa nan desu ka.', vi: 'Vậy à. Sở thích của anh Marco là gì?' },
        { who: 'マルコ', voice: 'ja-nam', text: 'ギターを{弾|ひ}くことです。{特|とく}に、{日本|にほん}のポップスをよく{弾|ひ}きます。{1週間|いっしゅうかん}に{3回|さんかい}くらい、{友達|ともだち}と{弾|ひ}きます。', ro: 'Gitaa o hiku koto desu. Toku ni, Nihon no poppusu o yoku hikimasu. Isshuukan ni sankai kurai, tomodachi to hikimasu.', vi: 'Là chơi guitar. Đặc biệt tôi hay chơi nhạc pop Nhật. Khoảng 1 tuần 3 lần tôi chơi cùng bạn.' },
        { who: '{木村|きむら}', voice: 'ja-nu', text: 'へえ、すごいですね。', ro: 'Hee, sugoi desu ne.', vi: 'Ồ, giỏi quá.' },
        { who: 'マルコ', voice: 'ja-nam', text: '{木村|きむら}さんの{趣味|しゅみ}は？', ro: 'Kimura-san no shumi wa?', vi: 'Còn sở thích của chị Kimura?' },
        { who: '{木村|きむら}', voice: 'ja-nu', text: '{泳|およ}ぐことです。{毎朝|まいあさ}、{会社|かいしゃ}の{近|ちか}くのプールで{泳|およ}いで、{会社|かいしゃ}へ{行|い}きます。', ro: 'Oyogu koto desu. Maiasa, kaisha no chikaku no puuru de oyoide, kaisha e ikimasu.', vi: 'Là bơi. Sáng nào tôi cũng bơi ở bể bơi gần công ty rồi mới đi làm.' },
        { who: 'マルコ', voice: 'ja-nam', text: '{毎朝|まいあさ}ですか。いいですね。{僕|ぼく}は{泳|およ}ぐことができません。でも、{習|なら}いたいです。', ro: 'Maiasa desu ka. Ii desu ne. Boku wa oyogu koto ga dekimasen. Demo, naraitai desu.', vi: 'Sáng nào cũng bơi à. Hay nhỉ. Tôi không bơi được. Nhưng tôi muốn học.' },
        { who: '{木村|きむら}', voice: 'ja-nu', text: 'じゃ、そのプールで{水泳|すいえい}{教室|きょうしつ}がありますよ。{毎週|まいしゅう}{土曜日|どようび}の{10時|じゅうじ}からです。', ro: 'Ja, sono puuru de suiei kyoushitsu ga arimasu yo. Maishuu doyoubi no juuji kara desu.', vi: 'Vậy ở bể bơi đó có lớp dạy bơi đấy. Từ 10 giờ thứ Bảy hằng tuần.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'わあ、いいですね。どうやって{申|もう}し{込|こ}みますか。', ro: 'Waa, ii desu ne. Dou yatte moushikomimasu ka.', vi: 'Oa, hay quá. Đăng ký thế nào ạ?' },
        { who: '{木村|きむら}', voice: 'ja-nu', text: 'プールの{受付|うけつけ}で{名前|なまえ}と{電話番号|でんわばんごう}を{書|か}いて、お{金|かね}を{払|はら}います。{1か月|いっかげつ}{4,000円|よんせんえん}です。', ro: 'Puuru no uketsuke de namae to denwa bangou o kaite, okane o haraimasu. Ikkagetsu yonsen en desu.', vi: 'Ở quầy tiếp tân của bể bơi, viết tên và số điện thoại rồi trả tiền. 4.000 yên một tháng.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'わかりました。{今週|こんしゅう}、{申|もう}し{込|こ}みます。ありがとうございます。', ro: 'Wakarimashita. Konshuu, moushikomimasu. Arigatou gozaimasu.', vi: 'Tôi hiểu rồi. Tuần này tôi sẽ đăng ký. Cảm ơn chị.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b9-ng-4-q',
      title: 'Câu hỏi bài 4',
      items: [
        { q: 'マルコさんの{趣味|しゅみ}は{何|なん}ですか。', options: ['{泳|およ}ぐこと', 'ギターを{弾|ひ}くこと', 'ポップスを{聞|き}くこと', 'コンピューターを{勉強|べんきょう}すること'], correct: 1, why: '**ギターを{弾|ひ}くこと**です。' },
        { q: 'マルコさんはどのくらいギターを{弾|ひ}きますか。', options: ['{毎朝|まいあさ}', '{1週間|いっしゅうかん}に{3回|さんかい}くらい', '{1か月|いっかげつ}に{3回|さんかい}', '{土曜日|どようび}だけ'], correct: 1, why: '**{1週間|いっしゅうかん}に{3回|さんかい}くらい**、{友達|ともだち}と{弾|ひ}きます。' },
        { q: '{木村|きむら}さんは{毎朝|まいあさ}{何|なに}をしますか。', options: ['ギターを{弾|ひ}きます', 'プールで{泳|およ}いで、{会社|かいしゃ}へ{行|い}きます', '{会社|かいしゃ}へ{行|い}って、{泳|およ}ぎます', '{水泳|すいえい}を{教|おし}えます'], correct: 1, why: 'Thứ tự: **{泳|およ}いで → {会社|かいしゃ}へ{行|い}きます** (bơi trước).' },
        { q: 'マルコさんは{泳|およ}ぐことができますか。', options: ['はい、できます。', 'いいえ、できません。', 'はい、{少|すこ}しできます。', 'Không nói'], correct: 1, why: '{僕|ぼく}は**{泳|およ}ぐことができません**。' },
        { q: '{水泳|すいえい}{教室|きょうしつ}はいつですか。', options: ['{毎朝|まいあさ}', '{毎週|まいしゅう}{土曜日|どようび}{10時|じゅうじ}から', '{毎週|まいしゅう}{日曜日|にちようび}{10時|じゅうじ}から', '{今週|こんしゅう}だけ'], correct: 1, why: '**{毎週|まいしゅう}{土曜日|どようび}の{10時|じゅうじ}から**です。' },
        { q: 'どうやって{申|もう}し{込|こ}みますか。', options: ['{電話|でんわ}して、{名前|なまえ}を{言|い}います', '{受付|うけつけ}で{名前|なまえ}と{電話番号|でんわばんごう}を{書|か}いて、お{金|かね}を{払|はら}います', 'インターネットで{予約|よやく}します', '{木村|きむら}さんに{言|い}います'], correct: 1, why: '{受付|うけつけ}で…{書|か}いて、お{金|かね}を{払|はら}います。' },
      ],
    },

    /* ── Bài 5 ── */
    { t: 'h', text: 'Bài 5 — Nghe tần suất: bao nhiêu phần trăm?' },
    {
      t: 'listen',
      id: 'b9-ng-5',
      title: '5 câu ngắn',
      note: 'Mỗi câu: người nói làm việc đó thường xuyên đến mức nào?',
      lines: [
        { who: '①', voice: 'ja-nu', text: '{私|わたし}はいつも{7時|しちじ}に{起|お}きて、{新聞|しんぶん}を{読|よ}みます。', ro: 'Watashi wa itsumo shichiji ni okite, shinbun o yomimasu.', vi: 'Tôi luôn dậy lúc 7 giờ rồi đọc báo.' },
        { who: '②', voice: 'ja-nam', text: 'カラオケはあまり{行|い}きません。{歌|うた}が{上手|じょうず}じゃありませんから。', ro: 'Karaoke wa amari ikimasen. Uta ga jouzu ja arimasen kara.', vi: 'Karaoke thì tôi không đi mấy. Vì hát không hay.' },
        { who: '③', voice: 'ja-nu', text: 'ときどき{友達|ともだち}とテニスをします。', ro: 'Tokidoki tomodachi to tenisu o shimasu.', vi: 'Thỉnh thoảng tôi chơi tennis với bạn.' },
        { who: '④', voice: 'ja-nam', text: '{前|まえ}はよくお{酒|さけ}を{飲|の}みました。でも、{最近|さいきん}は{全然|ぜんぜん}{飲|の}みません。', ro: 'Mae wa yoku osake o nomimashita. Demo, saikin wa zenzen nomimasen.', vi: 'Trước đây tôi hay uống rượu. Nhưng dạo này hoàn toàn không uống.' },
        { who: '⑤', voice: 'ja-nu', text: '{映画|えいが}が{大好|だいす}きです。よく{見|み}ます。{1週間|いっしゅうかん}に{3回|さんかい}くらい{見|み}ます。', ro: 'Eiga ga daisuki desu. Yoku mimasu. Isshuukan ni sankai kurai mimasu.', vi: 'Tôi rất thích phim. Tôi hay xem. Khoảng 1 tuần 3 lần.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b9-ng-5-q',
      title: 'Câu hỏi bài 5',
      items: [
        { q: '① Dậy lúc 7 giờ:', options: ['100% — luôn', 'thỉnh thoảng', 'không mấy', 'không bao giờ'], correct: 0, why: '**いつも** = luôn luôn.' },
        { q: '② Đi karaoke:', options: ['thường', 'thỉnh thoảng', 'không mấy', 'hoàn toàn không'], correct: 2, why: '**あまり**{行|い}きません = không đi mấy.' },
        { q: '③ Chơi tennis:', options: ['luôn', 'thường', 'thỉnh thoảng', 'không bao giờ'], correct: 2, why: '**ときどき** = thỉnh thoảng.' },
        { q: '④ Bây giờ uống rượu:', options: ['thường', 'thỉnh thoảng', 'không mấy', 'hoàn toàn không'], correct: 3, why: 'Bẫy: よく{飲|の}みました là TRƯỚC ĐÂY. **でも、{最近|さいきん}は{全然|ぜんぜん}**{飲|の}みません.' },
        { q: '⑤ Xem phim:', options: ['1 tuần 3 lần', '1 tháng 3 lần', '1 ngày 3 lần', 'không mấy'], correct: 0, why: '**{1週間|いっしゅうかん}に{3回|さんかい}**くらい.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 6. NÓI (dạng thi) ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b9-noi',
  kind: 'speaking',
  title: 'Luyện nói — câu hỏi thi về sở thích, làm được, cuối tuần, cách đi',
  goal: 'Trả lời trọn câu, đúng trợ từ các câu hỏi thi liên quan Bài 9 (sở thích là gì, có hay làm không, bao lâu một lần, làm được không, ngày nghỉ làm gì, đi bằng cách nào), nhìn tranh lịch / poster / sơ đồ đường mà trả lời, đóng vai ở buổi giao lưu và đọc to trôi chảy.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Đề thi nói JPD (theo "Hướng dẫn ôn thi" của bộ môn) — Bài 9 nằm ở đâu',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 9 xuất hiện ở đâu'],
      rows: [
        ['Reading', '40', 'Chuẩn bị 30 giây, đọc to đoạn ~100–110 chữ (4 từ chữ Hán gạch chân, 4 từ katakana, 70–80 chữ hiragana).', 'Đoạn giới thiệu sở thích / kể cuối tuần: ～ことです · {1週間|いっしゅうかん}に～{回|かい} · Vて、Vて.'],
        ['Talking — có tranh', '3 × 15', 'Nhìn tranh (lịch tuần có ○, poster lớp học, sơ đồ xe buýt…) trả lời 3 câu.', '{1週間|いっしゅうかん}に{何回|なんかい}～ますか · ～ができますか · どうやって～ますか'],
        ['Talking — không tranh', '1 × 10', 'Trả lời 1 câu về bản thân.', '「しゅみは なんですか」 (câu có sẵn trong ngân hàng đề) · 「{休|やす}みの{日|ひ}、{何|なに}をしますか」 · よく～ますか'],
        ['Presenting', '5', 'Chào khi vào và khi ra.', 'しつれいします／ありがとうございました。'],
      ],
    },
    {
      t: 'note',
      title: 'Luật chấm cần nhớ (trừ điểm thật)',
      items: [
        '**Sai trợ từ: −2 điểm** mỗi lỗi. Bài 9 soát kỹ: スキー**が**できます · ～こと**が**できます · {1週間|いっしゅうかん}**に**{2回|にかい} · バス**に**{乗|の}ります · (nơi)**で**{降|お}ります · クラブ**に**{入|はい}ります.',
        '**Câu có/không quên はい／いいえ**: bị trừ. 「～ができますか」 → **はい、できます／いいえ、できません**. 「よく～ますか」 → **はい、よく～ます／いいえ、あまり～ません**.',
        '**Sai nội dung = mất trọn câu**: hỏi {趣味|しゅみ} mà trả lời ~~{映画|えいが}を{見|み}ます~~ (không phải "sở thích là…"); hỏi どうやって mà chỉ nói một từ; hỏi {何回|なんかい} mà không có số.',
        'Được xin nhắc lại câu hỏi **tối đa 2 lần, không bị trừ**: **もう{一度|いちど}お{願|ねが}いします** · **ゆっくりお{願|ねが}いします**.',
        'Trả lời **câu đầy đủ** rồi **thêm 1 câu** (特に～／1週間に～回／でも、最近～) — giám thị cho điểm cao câu có mở rộng.',
      ],
    },

    /* ── Không tranh ① ── */
    { t: 'h', text: 'Câu hỏi không tranh ① — Sở thích (しゅみは なんですか)' },
    {
      t: 'p',
      text: '「しゅみは なんですか」 nằm sẵn trong **ngân hàng câu hỏi về bản thân** của đề JPD113 (đáp án gốc: わたしの しゅみは ～です). Bài 9 cho bạn câu trả lời "xịn" hơn: **～ことです** + đặc biệt + tần suất. Câu trả lời dưới là **mẫu** — thay bằng sở thích thật nhưng **giữ khung câu**.',
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: sở thích',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'しゅみは{何|なん}ですか。', ro: 'Shumi wa nan desu ka.', vi: 'Sở thích của em là gì?' },
        { who: 'Bạn', role: 'candidate', text: '{私|わたし}の{趣味|しゅみ}は{音楽|おんがく}を{聞|き}くことです。{特|とく}に、{日本|にほん}のポップスが{好|す}きです。', ro: 'Watashi no shumi wa ongaku o kiku koto desu. Toku ni, Nihon no poppusu ga suki desu.', vi: 'Sở thích của em là nghe nhạc. Đặc biệt em thích nhạc pop Nhật.' },
        { who: 'Giám thị', role: 'examiner', text: 'どんな{本|ほん}を{読|よ}みますか。', ro: 'Donna hon o yomimasu ka.', vi: 'Em đọc sách gì?' },
        { who: 'Bạn', role: 'candidate', text: '{漫画|まんが}をよく{読|よ}みます。{小説|しょうせつ}はあまり{読|よ}みません。', ro: 'Manga o yoku yomimasu. Shousetsu wa amari yomimasen.', vi: 'Em hay đọc truyện tranh. Tiểu thuyết thì em không đọc mấy.' },
        { who: 'Giám thị', role: 'examiner', text: 'よく{映画|えいが}を{見|み}ますか。', ro: 'Yoku eiga o mimasu ka.', vi: 'Em có hay xem phim không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、よく{見|み}ます。{1週間|いっしゅうかん}に{2回|にかい}くらい{見|み}ます。', ro: 'Hai, yoku mimasu. Isshuukan ni nikai kurai mimasu.', vi: 'Có ạ, em hay xem. Khoảng 1 tuần 2 lần.' },
        { who: 'Giám thị', role: 'examiner', text: 'スポーツが{好|す}きですか。', ro: 'Supootsu ga suki desu ka.', vi: 'Em có thích thể thao không? (câu trong ngân hàng đề)' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{好|す}きです。でも、{最近|さいきん}、{全然|ぜんぜん}しません。{時間|じかん}がありませんから。', ro: 'Hai, suki desu. Demo, saikin, zenzen shimasen. Jikan ga arimasen kara.', vi: 'Có ạ. Nhưng dạo này em hoàn toàn không chơi. Vì không có thời gian.' },
        { who: 'Giám thị', role: 'examiner', text: '{1日|いちにち}に{何時間|なんじかん}インターネットをしますか。', ro: 'Ichinichi ni nanjikan intaanetto o shimasu ka.', vi: 'Một ngày em lên mạng mấy tiếng?' },
        { who: 'Bạn', role: 'candidate', text: '{1日|いちにち}に{3時間|さんじかん}くらいします。', ro: 'Ichinichi ni sanjikan kurai shimasu.', vi: 'Một ngày em lên mạng khoảng 3 tiếng.' },
        { who: 'Giám thị', role: 'examiner', text: '{1日|いちにち}にコーヒーを{何杯|なんばい}{飲|の}みますか。', ro: 'Ichinichi ni koohii o nanbai nomimasu ka.', vi: 'Một ngày em uống mấy cốc cà phê?' },
        { who: 'Bạn', role: 'candidate', text: '{1日|いちにち}に{2杯|にはい}{飲|の}みます。／コーヒーは{全然|ぜんぜん}{飲|の}みません。', ro: 'Ichinichi ni nihai nomimasu. / Koohii wa zenzen nomimasen.', vi: 'Một ngày em uống 2 cốc. / Cà phê thì em hoàn toàn không uống.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở câu sở thích',
      items: [
        '「しゅみは なんですか」 → **わたしの しゅみは ～ことです／～です**. Không đáp cụt ~~{音楽|おんがく}~~ và không đáp ~~{音楽|おんがく}を{聞|き}きます~~.',
        'Nghe **{何回|なんかい}／{何杯|なんばい}／{何時間|なんじかん}** → đáp phải có **số + từ đếm đúng**: {2回|にかい}, {2杯|にはい}, {3時間|さんじかん}.',
        '「よく～ますか」 mà mình ít làm: **いいえ、あまり～ません** (không ~~いいえ、よく～ません~~).',
      ],
    },

    /* ── Không tranh ② ── */
    { t: 'h', text: 'Câu hỏi không tranh ② — Làm được không? (～ができますか)' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: できます',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{英語|えいご}ができますか。', ro: 'Eigo ga dekimasu ka.', vi: 'Em biết tiếng Anh không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{少|すこ}しできます。', ro: 'Hai, sukoshi dekimasu.', vi: 'Có ạ, em biết một chút.' },
        { who: 'Giám thị', role: 'examiner', text: '{車|くるま}の{運転|うんてん}ができますか。', ro: 'Kuruma no unten ga dekimasu ka.', vi: 'Em lái ô tô được không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、できません。でも、バイクの{運転|うんてん}ができます。', ro: 'Iie, dekimasen. Demo, baiku no unten ga dekimasu.', vi: 'Không ạ. Nhưng em lái xe máy được.' },
        { who: 'Giám thị', role: 'examiner', text: '{泳|およ}ぐことができますか。', ro: 'Oyogu koto ga dekimasu ka.', vi: 'Em bơi được không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、できます。{1週間|いっしゅうかん}に{1回|いっかい}プールで{泳|およ}ぎます。', ro: 'Hai, dekimasu. Isshuukan ni ikkai puuru de oyogimasu.', vi: 'Có ạ. Một tuần em bơi ở bể bơi 1 lần.' },
        { who: 'Giám thị', role: 'examiner', text: '{日本|にほん}の{料理|りょうり}を{作|つく}ることができますか。', ro: 'Nihon no ryouri o tsukuru koto ga dekimasu ka.', vi: 'Em nấu được món Nhật không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、できません。でも、{作|つく}り{方|かた}を{習|なら}いたいです。', ro: 'Iie, dekimasen. Demo, tsukurikata o naraitai desu.', vi: 'Không ạ. Nhưng em muốn học cách nấu.' },
        { who: 'Giám thị', role: 'examiner', text: 'ピアノを{弾|ひ}くことができますか。', ro: 'Piano o hiku koto ga dekimasu ka.', vi: 'Em chơi piano được không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{全然|ぜんぜん}できません。', ro: 'Iie, zenzen dekimasen.', vi: 'Không ạ, em hoàn toàn không chơi được.' },
      ],
    },

    /* ── Không tranh ③ ── */
    { t: 'h', text: 'Câu hỏi không tranh ③ — Ngày nghỉ, cuối tuần, cách đi' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: Vて、Vて và どうやって',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{休|やす}みの{日|ひ}、{何|なに}をしますか。', ro: 'Yasumi no hi, nani o shimasu ka.', vi: 'Ngày nghỉ em làm gì? (câu trong ngân hàng đề)' },
        { who: 'Bạn', role: 'candidate', text: '{休|やす}みの{日|ひ}、{友達|ともだち}に{会|あ}って、カフェで{話|はな}して、{映画|えいが}を{見|み}ます。', ro: 'Yasumi no hi, tomodachi ni atte, kafe de hanashite, eiga o mimasu.', vi: 'Ngày nghỉ em gặp bạn, nói chuyện ở quán cà phê rồi xem phim.' },
        { who: 'Giám thị', role: 'examiner', text: '{週末|しゅうまつ}、{何|なに}をしましたか。', ro: 'Shuumatsu, nani o shimashita ka.', vi: 'Cuối tuần em đã làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{土曜日|どようび}に{買|か}い{物|もの}をして、うちで{料理|りょうり}を{作|つく}りました。{日曜日|にちようび}は{宿題|しゅくだい}をしました。', ro: 'Doyoubi ni kaimono o shite, uchi de ryouri o tsukurimashita. Nichiyoubi wa shukudai o shimashita.', vi: 'Thứ Bảy em mua sắm rồi nấu ăn ở nhà. Chủ Nhật em làm bài tập.' },
        { who: 'Giám thị', role: 'examiner', text: '{日曜日|にちようび}はどこに{行|い}きますか。', ro: 'Nichiyoubi wa doko ni ikimasu ka.', vi: 'Chủ Nhật em đi đâu? (câu trong ngân hàng đề)' },
        { who: 'Bạn', role: 'candidate', text: '{公園|こうえん}へ{行|い}きます。{公園|こうえん}で{友達|ともだち}とサッカーをします。', ro: 'Kouen e ikimasu. Kouen de tomodachi to sakkaa o shimasu.', vi: 'Em đi công viên. Em chơi bóng đá với bạn ở công viên.' },
        { who: 'Giám thị', role: 'examiner', text: 'どうやって{学校|がっこう}へ{来|き}ますか。', ro: 'Dou yatte gakkou e kimasu ka.', vi: 'Em đến trường bằng cách nào?' },
        { who: 'Bạn', role: 'candidate', text: 'うちから{駅|えき}まで{歩|ある}いて、{3番|さんばん}のバスに{乗|の}って、{大学|だいがく}の{前|まえ}で{降|お}ります。', ro: 'Uchi kara eki made aruite, sanban no basu ni notte, daigaku no mae de orimasu.', vi: 'Em đi bộ từ nhà đến ga, lên xe buýt số 3, xuống ở trước trường.' },
        { who: 'Giám thị', role: 'examiner', text: 'よく{家族|かぞく}に{電話|でんわ}しますか。', ro: 'Yoku kazoku ni denwa shimasu ka.', vi: 'Em có hay gọi điện cho gia đình không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、よくします。{1週間|いっしゅうかん}に{3回|さんかい}くらい{電話|でんわ}します。', ro: 'Hai, yoku shimasu. Isshuukan ni sankai kurai denwa shimasu.', vi: 'Có ạ. Khoảng 1 tuần em gọi 3 lần.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở nhóm này',
      items: [
        '「{休|やす}みの{日|ひ}、{何|なに}をしますか」 hỏi thói quen → **～ます**; 「{週末|しゅうまつ}、{何|なに}をしましたか」 hỏi việc đã qua → **～ました**. Chỉ động từ CUỐI chia thì.',
        '「どうやって～」 → trả lời **các bước**. Có thể dùng ～から～まで (Bài 3): うちから{駅|えき}まで{歩|ある}いて….',
        'Trợ từ đi xe: バス**に**{乗|の}って · (nơi)**で**{降|お}ります — lỗi hay bị trừ 2 điểm.',
      ],
    },

    /* ── Có tranh ── */
    { t: 'h', text: 'Câu hỏi có tranh — lịch tuần, poster lớp học, sơ đồ xe buýt' },
    {
      t: 'p',
      text: 'Tranh thi được viết lại thành bảng (không dùng ảnh). Với tranh Bài 9, giám thị hay hỏi: **{何|なに}をしていますか · {1週間|いっしゅうかん}に{何回|なんかい}～ますか · この{人|ひと}は～ができますか · どうやって～へ{行|い}きますか · {何番|なんばん}のバスに{乗|の}りますか**.',
    },
    {
      t: 'table',
      caption: 'Tranh 1 — lịch một tuần của Anna (○ = đi bơi)',
      head: ['{日|にち}', '{月|げつ}', '{火|か}', '{水|すい}', '{木|もく}', '{金|きん}', '{土|ど}'],
      rows: [['×', '○', '×', '○', '×', '×', '○']],
    },
    {
      t: 'dialogue',
      title: 'Tranh 1',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'アンナさんは{何|なに}をしますか。', ro: 'Anna-san wa nani o shimasu ka.', vi: 'Anna làm gì?' },
        { who: 'Bạn', role: 'candidate', text: 'プールで{泳|およ}ぎます。', ro: 'Puuru de oyogimasu.', vi: 'Bạn ấy bơi ở bể bơi.' },
        { who: 'Giám thị', role: 'examiner', text: '{1週間|いっしゅうかん}に{何回|なんかい}{泳|およ}ぎますか。', ro: 'Isshuukan ni nankai oyogimasu ka.', vi: 'Một tuần bạn ấy bơi mấy lần?' },
        { who: 'Bạn', role: 'candidate', text: '{1週間|いっしゅうかん}に{3回|さんかい}{泳|およ}ぎます。', ro: 'Isshuukan ni sankai oyogimasu.', vi: 'Một tuần bơi 3 lần.' },
        { who: 'Giám thị', role: 'examiner', text: '{何曜日|なんようび}に{泳|およ}ぎますか。', ro: 'Nan\'youbi ni oyogimasu ka.', vi: 'Bơi vào thứ mấy?' },
        { who: 'Bạn', role: 'candidate', text: '{月曜日|げつようび}と{水曜日|すいようび}と{土曜日|どようび}に{泳|およ}ぎます。', ro: 'Getsuyoubi to suiyoubi to doyoubi ni oyogimasu.', vi: 'Bơi vào thứ Hai, thứ Tư và thứ Bảy.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh 2 — poster: người đàn ông trượt tuyết · poster lớp thư pháp',
      head: ['Poster', 'Nội dung'],
      rows: [
        ['SKI {北海道|ほっかいどう}', 'スキー{旅行|りょこう} · {2月|にがつ}{10日|とおか}〜{12日|じゅうににち}'],
        ['{書道|しょどう}{教室|きょうしつ}', '{毎週|まいしゅう}{水曜日|すいようび} {6時|ろくじ}から · {公民館|こうみんかん}'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 2',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'これは{何|なん}のポスターですか。', ro: 'Kore wa nan no posutaa desu ka.', vi: 'Đây là poster gì?' },
        { who: 'Bạn', role: 'candidate', text: 'それはスキー{旅行|りょこう}のポスターです。', ro: 'Sore wa sukii ryokou no posutaa desu.', vi: 'Đó là poster chuyến du lịch trượt tuyết.' },
        { who: 'Giám thị', role: 'examiner', text: 'あなたはスキーができますか。', ro: 'Anata wa sukii ga dekimasu ka.', vi: 'Em trượt tuyết được không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、できません。でも、この{旅行|りょこう}に{参加|さんか}したいです。', ro: 'Iie, dekimasen. Demo, kono ryokou ni sanka shitai desu.', vi: 'Không ạ. Nhưng em muốn tham gia chuyến đi này.' },
        { who: 'Giám thị', role: 'examiner', text: '{書道|しょどう}{教室|きょうしつ}は{何曜日|なんようび}ですか。', ro: 'Shodou kyoushitsu wa nan\'youbi desu ka.', vi: 'Lớp thư pháp vào thứ mấy?' },
        { who: 'Bạn', role: 'candidate', text: '{毎週|まいしゅう}{水曜日|すいようび}です。{6時|ろくじ}からです。', ro: 'Maishuu suiyoubi desu. Rokuji kara desu.', vi: 'Thứ Tư hằng tuần. Từ 6 giờ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh 3 — sơ đồ: ga → xe buýt số 5 → trạm "としょかんまえ" → thư viện',
      head: ['Bước 1', 'Bước 2', 'Bước 3'],
      rows: [['{駅|えき}の{前|まえ}', '{5番|ごばん}のバス', '「{図書館|としょかん}{前|まえ}」で{降|お}ります']],
    },
    {
      t: 'dialogue',
      title: 'Tranh 3',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'どうやって{図書館|としょかん}へ{行|い}きますか。', ro: 'Dou yatte toshokan e ikimasu ka.', vi: 'Đi thư viện bằng cách nào?' },
        { who: 'Bạn', role: 'candidate', text: '{駅|えき}の{前|まえ}で{5番|ごばん}のバスに{乗|の}って、{図書館|としょかん}{前|まえ}で{降|お}ります。', ro: 'Eki no mae de goban no basu ni notte, toshokan mae de orimasu.', vi: 'Lên xe buýt số 5 ở trước ga, xuống ở trạm trước thư viện.' },
        { who: 'Giám thị', role: 'examiner', text: '{何番|なんばん}のバスに{乗|の}りますか。', ro: 'Nanban no basu ni norimasu ka.', vi: 'Đi xe buýt số mấy?' },
        { who: 'Bạn', role: 'candidate', text: '{5番|ごばん}のバスに{乗|の}ります。', ro: 'Goban no basu ni norimasu.', vi: 'Đi xe buýt số 5.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở câu có tranh',
      items: [
        'Giám thị cầm tranh nói **これ** → bạn đáp **それ** (Bài 2).',
        'Đếm ○ trên lịch → **{1週間|いっしゅうかん}に{3回|さんかい}** (không phải ~~{3日|みっか}~~ — hỏi 何回 thì đáp ～回).',
        '"あなたは～ができますか" hỏi về BẠN, không phải người trong tranh → trả lời thật, có はい／いいえ.',
        'Số xe buýt: **{5番|ごばん}** (ごばん), {3番|さんばん}, {1番|いちばん} — trùng âm với いちばん (nhất) nhưng khác nghĩa.',
      ],
    },

    /* ── Đóng vai ── */
    { t: 'h', text: 'Đóng vai — buổi giao lưu và bảng thông báo (luyện hai người)' },
    {
      t: 'dialogue',
      title: 'Vai 1 — Làm quen ở buổi giao lưu, hỏi sở thích đến cùng',
      lines: [
        { who: 'A', role: 'a', text: 'はじめまして。Aです。Bさんの{趣味|しゅみ}は{何|なん}ですか。', ro: 'Hajimemashite. A desu. B-san no shumi wa nan desu ka.', vi: 'Rất vui được gặp. Mình là A. Sở thích của B là gì?' },
        { who: 'B', role: 'b', text: '{写真|しゃしん}を{撮|と}ることです。{特|とく}に、{花|はな}の{写真|しゃしん}が{好|す}きです。', ro: 'Shashin o toru koto desu. Toku ni, hana no shashin ga suki desu.', vi: 'Là chụp ảnh. Đặc biệt mình thích ảnh hoa.' },
        { who: 'A', role: 'a', text: 'よく{撮|と}りますか。', ro: 'Yoku torimasu ka.', vi: 'Bạn có hay chụp không?' },
        { who: 'B', role: 'b', text: 'はい、{週末|しゅうまつ}はいつも{公園|こうえん}へ{行|い}って、{撮|と}ります。', ro: 'Hai, shuumatsu wa itsumo kouen e itte, torimasu.', vi: 'Có, cuối tuần mình luôn ra công viên chụp.' },
        { who: 'A', role: 'a', text: 'いいですね。{私|わたし}も{写真|しゃしん}が{好|す}きです。でも、{上手|じょうず}に{撮|と}ることができません。', ro: 'Ii desu ne. Watashi mo shashin ga suki desu. Demo, jouzu ni toru koto ga dekimasen.', vi: 'Hay nhỉ. Mình cũng thích ảnh. Nhưng mình không chụp đẹp được.' },
        { who: 'B', role: 'b', text: 'じゃ、{今度|こんど}の{日曜日|にちようび}、{一緒|いっしょ}に{撮|と}りに{行|い}きませんか。', ro: 'Ja, kondo no nichiyoubi, issho ni tori ni ikimasen ka.', vi: 'Vậy Chủ Nhật tới cùng đi chụp không?' },
        { who: 'A', role: 'a', text: 'わあ、いいですね。{行|い}きましょう。', ro: 'Waa, ii desu ne. Ikimashou.', vi: 'Oa, hay quá. Đi thôi.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Vai 2 — Trước bảng thông báo: muốn đăng ký, hỏi cách đăng ký',
      lines: [
        { who: 'A', role: 'a', text: 'あ、{料理|りょうり}{教室|きょうしつ}がありますね。{私|わたし}はこれに{申|もう}し{込|こ}みたいです。', ro: 'A, ryouri kyoushitsu ga arimasu ne. Watashi wa kore ni moushikomitai desu.', vi: 'A, có lớp nấu ăn nhỉ. Mình muốn đăng ký lớp này.' },
        { who: 'B', role: 'b', text: 'えっ？Aさんは{料理|りょうり}ができませんか。', ro: 'E? A-san wa ryouri ga dekimasen ka.', vi: 'Hả? A không nấu ăn được à?' },
        { who: 'A', role: 'a', text: 'はい、あまりできません。ですから、{習|なら}いたいです。どうやって{申|もう}し{込|こ}みますか。', ro: 'Hai, amari dekimasen. Desukara, naraitai desu. Dou yatte moushikomimasu ka.', vi: 'Ừ, mình không nấu giỏi lắm. Vì thế mình muốn học. Đăng ký thế nào nhỉ?' },
        { who: 'B', role: 'b', text: 'この{電話番号|でんわばんごう}に{電話|でんわ}して、{名前|なまえ}と{住所|じゅうしょ}を{言|い}います。', ro: 'Kono denwa bangou ni denwa shite, namae to juusho o iimasu.', vi: 'Gọi vào số này rồi nói tên và địa chỉ.' },
        { who: 'A', role: 'a', text: 'わかりました。ありがとうございます。', ro: 'Wakarimashita. Arigatou gozaimasu.', vi: 'Mình hiểu rồi. Cảm ơn nhé.' },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo luyện đóng vai',
      items: [
        'Vai 1 đủ khung: **{趣味|しゅみ}は？ → ～ことです → {特|とく}に → よく～ますか → Vて、～ます → でも、～ことができません → rủ (Bài 6)**.',
        'Vai 2 đủ khung: **muốn đăng ký (～たいです) → làm được không (～ができますか) → lý do (～から) → どうやって → Vて、Vます**.',
        '「ですから」 (vì thế) là từ thêm — nói 「～から、～たいです」 cũng đủ điểm.',
      ],
    },

    /* ── Reading ── */
    { t: 'h', text: 'Đọc to — Reading (40 điểm)' },
    {
      t: 'p',
      text: 'Đề đọc dài khoảng 100–110 ký tự: **4 từ chữ Hán** gạch chân (12đ), **4 từ katakana** (12đ), còn lại hiragana (16đ, sai một ký tự −0,2đ). 30 giây chuẩn bị. Bốn đoạn dưới đây viết đúng khuôn đó, chỉ dùng từ Bài 1–9 (các đoạn mẫu trong đề JPD113 cũng giới thiệu người và **しゅみ** — ôn luôn). Tắt furigana khi đã quen, và luyện thêm ở **Chữ Hán · Đọc to cả đoạn**.',
    },
    {
      t: 'examples',
      items: [
        {
          en: 'わたしの{趣味|しゅみ}はギターをひくことです。とくに、ポップスがすきです。{1週間|いっしゅうかん}に{3回|さんかい}くらい、ともだちとひきます。でも、{最近|さいきん}はしゅくだいがたくさんありますから、あまりひきません。',
          ro: 'Watashi no shumi wa gitaa o hiku koto desu. Toku ni, poppusu ga suki desu. Isshuukan ni sankai kurai, tomodachi to hikimasu. Demo, saikin wa shukudai ga takusan arimasu kara, amari hikimasen.',
          vi: 'Sở thích của tôi là chơi guitar. Đặc biệt tôi thích nhạc pop. Khoảng 1 tuần 3 lần tôi chơi cùng bạn. Nhưng dạo này nhiều bài tập nên tôi không chơi mấy.',
        },
        {
          en: 'みなさん、こんにちは。こちらはカルロスさんです。カルロスさんはブラジル{人|じん}です。しゅみはサッカーとダンスです。スキーもできます。いま、ABC{大学|だいがく}のがくせいです。{毎日|まいにち}、バスにのって、がっこうへきます。',
          ro: 'Minasan, konnichiwa. Kochira wa Karurosu-san desu. Karurosu-san wa Burajiru-jin desu. Shumi wa sakkaa to dansu desu. Sukii mo dekimasu. Ima, ABC daigaku no gakusei desu. Mainichi, basu ni notte, gakkou e kimasu.',
          vi: 'Chào mọi người. Đây là Carlos. Carlos là người Brazil. Sở thích là bóng đá và nhảy. Cậu ấy trượt tuyết cũng được. Bây giờ là sinh viên ĐH ABC. Hằng ngày cậu ấy đi xe buýt đến trường.',
        },
        {
          en: 'しゅうまつ、ともだちと{上野|うえの}へいって、びじゅつかんでえをみて、レストランでイタリアりょうりをたべました。それから、デパートでかいものをしました。とてもたのしかったです。',
          ro: 'Shuumatsu, tomodachi to Ueno e itte, bijutsukan de e o mite, resutoran de Itaria ryouri o tabemashita. Sore kara, depaato de kaimono o shimashita. Totemo tanoshikatta desu.',
          vi: 'Cuối tuần tôi đi Ueno với bạn, xem tranh ở bảo tàng, ăn món Ý ở nhà hàng. Sau đó mua sắm ở trung tâm thương mại. Rất vui.',
        },
        {
          en: 'わたしはりょうりをつくることができません。ですから、らいげつ、{料理|りょうり}{教室|きょうしつ}に{申|もう}し{込|こ}みます。インターネットでよやくして、コンビニでおかねをはらいます。{1か月|いっかげつ}に{4回|よんかい}です。',
          ro: 'Watashi wa ryouri o tsukuru koto ga dekimasen. Desukara, raigetsu, ryouri kyoushitsu ni moushikomimasu. Intaanetto de yoyaku shite, konbini de okane o haraimasu. Ikkagetsu ni yonkai desu.',
          vi: 'Tôi không nấu ăn được. Vì thế tháng sau tôi sẽ đăng ký lớp nấu ăn. Đặt trên mạng rồi trả tiền ở cửa hàng tiện lợi. Một tháng 4 buổi.',
        },
      ],
    },
    {
      t: 'note',
      title: 'Chỗ dễ đọc sai trong bốn đoạn trên',
      items: [
        '**趣味 しゅみ**, **1週間 いっしゅうかん**, **3回 さんかい**, **最近 さいきん**, **1か月 いっかげつ**, **4回 よんかい**, **料理教室 りょうりきょうしつ**, **申し込みます もうしこみます**.',
        'Katakana: ギター gitaa, ポップス poppusu, ブラジル, ダンス, スキー sukii, レストラン, イタリア, デパート depaato, インターネット intaanetto, コンビニ.',
        'は đọc **wa**, を đọc **o**, へ đọc **e**: しゅみ**は**, えい**が**を, うえの**へ**.',
      ],
    },

    /* ── Tự ghi âm ── */
    { t: 'h', text: 'Tự ghi âm — trả lời không nhìn đáp án' },
    {
      t: 'speak',
      id: 'b9-noi-ghi-am',
      part: '1',
      questions: [
        'しゅみは なんですか。',
        'どんな おんがくを ききますか。',
        'よく えいがを みますか。',
        'いっしゅうかんに なんかい スポーツを しますか。',
        'いちにちに コーヒーを なんばい のみますか。',
        'スポーツが すきですか。',
        'えいごが できますか。',
        'およぐことが できますか。',
        'やすみの ひ、なにを しますか。',
        'しゅうまつ、なにを しましたか。',
        'どうやって がっこうへ きますか。',
        'よく かぞくに でんわしますか。',
      ],
    },
  ],
};

/* ═══════════════════════════ 7. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b9-bai-tap',
  kind: 'homework',
  title: 'Bài tập về nhà — Bài 9 (có đáp án)',
  goal: 'Tự đổi động từ sang thể từ điển, dịch, nối câu bằng Vて, chọn trợ từ – phó từ – từ đếm và ghép câu Bài 9 không cần nhìn bài học.',
  minutes: 50,
  blocks: [
    {
      t: 'p',
      text: 'Gõ tiếng Nhật bằng bộ gõ (gõ romaji, máy đổi sang kana). Chữ Hán hay kana đều được chấp nhận; dấu câu và dấu cách không tính. Nếu máy chấm sai mà bạn tin mình đúng, bấm **Hỏi gia sư** ngay dưới câu đó.',
    },
    {
      t: 'quiz',
      id: 'b9-bt-tu-dien',
      title: 'Đổi sang THỂ TỪ ĐIỂN (gõ chữ Hán hoặc kana)',
      kind: 'fill',
      grammar: 'Nhóm 1: い-hàng → う-hàng (き→く, ぎ→ぐ, し→す, ち→つ, び→ぶ, み→む, り→る, い→う) · Nhóm 2: bỏ ます + る · Nhóm 3: します→する, 来ます→来る',
      items: [
        { q: '{書|か}きます', answers: V('{書|か}く'), hint: 'nhóm 1, き → く' },
        { q: '{泳|およ}ぎます', answers: V('{泳|およ}ぐ'), hint: 'nhóm 1, ぎ → ぐ' },
        { q: '{話|はな}します', answers: V('{話|はな}す'), hint: 'nhóm 1, し → す' },
        { q: '{待|ま}ちます', answers: V('{待|ま}つ'), hint: 'nhóm 1, ち → つ' },
        { q: '{遊|あそ}びます', answers: V('{遊|あそ}ぶ'), hint: 'nhóm 1, び → ぶ' },
        { q: '{読|よ}みます', answers: V('{読|よ}む'), hint: 'nhóm 1, み → む' },
        { q: '{申|もう}し{込|こ}みます', answers: V('{申|もう}し{込|こ}む'), hint: 'nhóm 1, み → む' },
        { q: '{作|つく}ります', answers: V('{作|つく}る'), hint: 'nhóm 1, り → る' },
        { q: '{帰|かえ}ります', answers: V('{帰|かえ}る'), hint: 'nhóm 1 (ngoại lệ trông như nhóm 2)' },
        { q: '{入|はい}ります', answers: V('{入|はい}る'), hint: 'nhóm 1 (ngoại lệ)' },
        { q: '{習|なら}います', answers: V('{習|なら}う'), hint: 'nhóm 1, い → う' },
        { q: '{言|い}います', answers: V('{言|い}う'), hint: 'nhóm 1, い → う' },
        { q: '{行|い}きます', answers: V('{行|い}く'), hint: 'nhóm 1' },
        { q: '{食|た}べます', answers: V('{食|た}べる'), hint: 'nhóm 2' },
        { q: '{集|あつ}めます', answers: V('{集|あつ}める'), hint: 'nhóm 2' },
        { q: '{見|み}せます', answers: V('{見|み}せる'), hint: 'nhóm 2' },
        { q: '{見|み}ます', answers: V('{見|み}る'), hint: 'nhóm 2 (âm い nhưng nhóm 2)' },
        { q: '{降|お}ります', answers: V('{降|お}りる'), hint: 'nhóm 2 (âm い nhưng nhóm 2)' },
        { q: '{起|お}きます', answers: V('{起|お}きる'), hint: 'nhóm 2' },
        { q: 'できます', answers: V('できる'), hint: 'nhóm 2' },
        { q: '{運転|うんてん}します', answers: V('{運転|うんてん}する'), hint: 'nhóm 3' },
        { q: '{来|き}ます', answers: V('{来|く}る'), hint: 'nhóm 3 — đọc くる' },
      ],
    },
    {
      t: 'quiz',
      id: 'b9-bt-dich',
      title: 'Dịch sang tiếng Nhật',
      kind: 'translate',
      grammar: 'V辞書形こと · ｛N／V辞書形こと｝ができます · Vて、Vて、V · [期間]に[回数] · いつも／よく／ときどき／あまり／全然 · どうやって · でも',
      items: [
        { q: 'Sở thích của tôi là xem phim.', answers: V('{私|わたし}の{趣味|しゅみ}は{映画|えいが}を{見|み}ることです。', '{趣味|しゅみ}は{映画|えいが}を{見|み}ることです。'), hint: '趣味, 映画, 見る, こと' },
        { q: 'Sở thích của tôi là sưu tầm tem.', answers: V('{私|わたし}の{趣味|しゅみ}は{切手|きって}を{集|あつ}めることです。', '{趣味|しゅみ}は{切手|きって}を{集|あつ}めることです。'), hint: '切手, 集める' },
        { q: 'Đặc biệt tôi thích nhạc cổ điển.', answers: V('{特|とく}に、クラシックが{好|す}きです。', '{特|とく}にクラシックが{好|す}きです。'), hint: '特に, クラシック' },
        { q: 'Tôi trượt tuyết được.', answers: V('{私|わたし}はスキーができます。', 'スキーができます。'), hint: 'スキー, できます' },
        { q: 'Tôi không bơi được.', answers: V('{私|わたし}は{泳|およ}ぐことができません。', '{泳|およ}ぐことができません。'), hint: '泳ぐ, こと' },
        { q: 'Tôi không viết chữ Hán đẹp được.', answers: V('{上手|じょうず}に{漢字|かんじ}を{書|か}くことができません。', '{私|わたし}は{上手|じょうず}に{漢字|かんじ}を{書|か}くことができません。'), hint: '上手に, 漢字, 書く' },
        { q: 'Bạn lái ô tô được không?', answers: V('{車|くるま}の{運転|うんてん}ができますか。', '{車|くるま}を{運転|うんてん}することができますか。'), hint: '車, 運転' },
        { q: 'Tôi muốn tham gia chuyến du lịch trượt tuyết này.', answers: V('このスキー{旅行|りょこう}に{参加|さんか}したいです。', '{私|わたし}はこのスキー{旅行|りょこう}に{参加|さんか}したいです。'), hint: 'スキー旅行, 参加します' },
        { q: 'Cuối tuần tôi xem phim với bạn, mua sắm rồi đi ăn.', answers: V('{週末|しゅうまつ}、{友達|ともだち}と{映画|えいが}を{見|み}て、{買|か}い{物|もの}をして、{食事|しょくじ}しました。', '{週末|しゅうまつ}、{友達|ともだち}と{映画|えいが}を{見|み}て、{買|か}い{物|もの}をして、{食事|しょくじ}をしました。'), hint: 'Vて、Vて、Vました' },
        { q: 'Tôi làm bài tập rồi đi ngủ.', answers: V('{宿題|しゅくだい}をして、{寝|ね}ました。', '{宿題|しゅくだい}をして、{寝|ね}ます。'), hint: '宿題, 寝ます' },
        { q: 'Một tuần tôi gọi điện cho gia đình 2 lần.', answers: V('{1週間|いっしゅうかん}に{2回|にかい}、{家族|かぞく}に{電話|でんわ}します。', '{1週間|いっしゅうかん}に{2回|にかい}{家族|かぞく}に{電話|でんわ}します。', '{家族|かぞく}に{1週間|いっしゅうかん}に{2回|にかい}{電話|でんわ}します。'), hint: '1週間, 2回, 家族, 電話' },
        { q: 'Một ngày tôi uống 3 cốc cà phê.', answers: V('{1日|いちにち}にコーヒーを{3杯|さんばい}{飲|の}みます。', '{1日|いちにち}に{3杯|さんばい}コーヒーを{飲|の}みます。'), hint: '1日, 杯' },
        { q: 'Một tháng tôi đọc khoảng 2 quyển tiểu thuyết.', answers: V('{1か月|いっかげつ}に{小説|しょうせつ}を{2冊|にさつ}くらい{読|よ}みます。', '{1か月|いっかげつ}に{2冊|にさつ}くらい{小説|しょうせつ}を{読|よ}みます。'), hint: '1か月, 冊, 小説' },
        { q: 'Bạn có hay xem phim bộ không? — Không, không xem mấy.', answers: V('よくドラマを{見|み}ますか。いいえ、あまり{見|み}ません。'), hint: 'よく, あまり' },
        { q: 'Tôi hoàn toàn không uống rượu.', answers: V('お{酒|さけ}を{全然|ぜんぜん}{飲|の}みません。', '{全然|ぜんぜん}お{酒|さけ}を{飲|の}みません。', '{私|わたし}はお{酒|さけ}を{全然|ぜんぜん}{飲|の}みません。'), hint: 'お酒, 全然' },
        { q: 'Thỉnh thoảng tôi đi câu cá.', answers: V('ときどき{釣|つ}りをします。', 'ときどき{釣|つ}りに{行|い}きます。'), hint: 'ときどき, 釣り' },
        { q: 'Đi bảo tàng bằng cách nào?', answers: V('どうやって{美術館|びじゅつかん}へ{行|い}きますか。', 'どうやって{美術館|びじゅつかん}に{行|い}きますか。'), hint: 'どうやって, 美術館' },
        { q: 'Lên xe buýt số 3 rồi xuống ở trạm trước bảo tàng.', answers: V('{3番|さんばん}のバスに{乗|の}って、{美術館|びじゅつかん}{前|まえ}で{降|お}ります。'), hint: '3番, 乗って, 降ります' },
        { q: 'Đặt vé trên mạng rồi trả tiền ở cửa hàng tiện lợi.', answers: V('インターネットでチケットを{予約|よやく}して、コンビニでお{金|かね}を{払|はら}います。', 'インターネットで{予約|よやく}して、コンビニでお{金|かね}を{払|はら}います。'), hint: '予約して, 払います' },
        { q: 'Sở thích là thể thao. Nhưng dạo này hoàn toàn không chơi.', answers: V('{趣味|しゅみ}はスポーツです。でも、{最近|さいきん}、{全然|ぜんぜん}しません。', '{私|わたし}の{趣味|しゅみ}はスポーツです。でも、{最近|さいきん}{全然|ぜんぜん}しません。'), hint: 'でも, 最近, 全然' },
      ],
    },
    {
      t: 'quiz',
      id: 'b9-bt-noi-cau',
      title: 'Nối hai câu thành một bằng Vて (gõ cả câu)',
      kind: 'fill',
      grammar: 'V1ます。V2ます。 → V1て、V2ます。 (thì theo động từ cuối)',
      items: [
        { q: '{映画|えいが}を{見|み}ます。ご{飯|はん}を{食|た}べます。', answers: V('{映画|えいが}を{見|み}て、ご{飯|はん}を{食|た}べます') },
        { q: 'バスに{乗|の}ります。{駅|えき}で{降|お}ります。', answers: V('バスに{乗|の}って、{駅|えき}で{降|お}ります') },
        { q: '{名前|なまえ}を{書|か}きます。カードを{見|み}せます。', answers: V('{名前|なまえ}を{書|か}いて、カードを{見|み}せます') },
        { q: 'プールで{泳|およ}ぎました。{会社|かいしゃ}へ{行|い}きました。', answers: V('プールで{泳|およ}いで、{会社|かいしゃ}へ{行|い}きました', 'プールで{泳|およ}いで、{会社|かいしゃ}に{行|い}きました') },
        { q: '{上野|うえの}へ{行|い}きました。{絵|え}を{見|み}ました。', answers: V('{上野|うえの}へ{行|い}って、{絵|え}を{見|み}ました', '{上野|うえの}に{行|い}って、{絵|え}を{見|み}ました') },
        { q: '{予約|よやく}します。お{金|かね}を{払|はら}います。', answers: V('{予約|よやく}して、お{金|かね}を{払|はら}います') },
        { q: '{電話|でんわ}します。{住所|じゅうしょ}を{言|い}います。', answers: V('{電話|でんわ}して、{住所|じゅうしょ}を{言|い}います') },
        { q: '{本|ほん}を{読|よ}みました。{寝|ね}ました。', answers: V('{本|ほん}を{読|よ}んで、{寝|ね}ました') },
      ],
    },
    {
      t: 'mcq',
      id: 'b9-bt-tro-tu',
      title: 'Chọn trợ từ đúng',
      items: [
        { q: '{私|わたし}はダンス＿できます。', options: ['を', 'が', 'に', 'で'], correct: 1, why: 'N **が** できます (ポイント 82).' },
        { q: '{料理|りょうり}を{作|つく}ること＿できません。', options: ['を', 'が', 'は', 'に'], correct: 1, why: '～こと**が**できます.' },
        { q: '{1週間|いっしゅうかん}＿{3回|さんかい}{泳|およ}ぎます。', options: ['で', 'に', 'と', 'から'], correct: 1, why: '[khoảng thời gian] **に** [số lần] (ポイント 84).' },
        { q: '{3番|さんばん}のバス＿{乗|の}ります。', options: ['を', 'に', 'で', 'へ'], correct: 1, why: 'Lên xe: **に** {乗|の}ります.' },
        { q: '{美術館|びじゅつかん}{前|まえ}＿{降|お}ります。', options: ['を', 'に', 'で', 'が'], correct: 2, why: 'Nơi xuống → **で**.' },
        { q: '{電車|でんしゃ}＿{降|お}ります。', options: ['を', 'に', 'で', 'が'], correct: 0, why: 'Xuống khỏi tàu → **を** {降|お}ります.' },
        { q: 'ダンスクラブ＿{入|はい}ります。', options: ['を', 'に', 'で', 'が'], correct: 1, why: 'Vào CLB → **に** {入|はい}ります.' },
        { q: '{料理|りょうり}{教室|きょうしつ}＿{申|もう}し{込|こ}みます。', options: ['を', 'に', 'で', 'が'], correct: 1, why: 'Đăng ký vào → **に** {申|もう}し{込|こ}みます.' },
        { q: 'スキー{旅行|りょこう}＿{参加|さんか}します。', options: ['を', 'に', 'で', 'と'], correct: 1, why: 'Tham gia → **に** {参加|さんか}します.' },
        { q: '{先生|せんせい}＿ピアノを{習|なら}います。', options: ['を', 'に', 'で', 'が'], correct: 1, why: 'Học VỚI (từ) thầy → **に** {習|なら}います (giống ～にもらいます, Bài 8).' },
        { q: '{受付|うけつけ}＿{名前|なまえ}を{書|か}きます。', options: ['に', 'で', 'を', 'へ'], correct: 1, why: 'Nơi làm hành động → **で**.' },
        { q: '{日曜日|にちようび}＿{料理|りょうり}をします。 (chỉ Chủ Nhật)', options: ['だけ', 'も', 'に', 'と'], correct: 0, why: '**だけ** = chỉ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b9-bt-pho-tu',
      title: 'Phó từ tần suất và từ đếm',
      items: [
        { q: '{私|わたし}は＿テレビを{見|み}ません。 (không xem mấy)', options: ['よく', 'あまり', 'いつも', 'ときどき'], correct: 1, why: '**あまり** + ～ません.' },
        { q: '{毎朝|まいあさ}、＿パンを{食|た}べます。 (lúc nào cũng)', options: ['いつも', '{全然|ぜんぜん}', 'あまり', 'だけ'], correct: 0, why: '**いつも** = luôn luôn.' },
        { q: 'お{酒|さけ}は＿{飲|の}みません。 (hoàn toàn không)', options: ['ときどき', 'よく', '{全然|ぜんぜん}', 'いつも'], correct: 2, why: '**{全然|ぜんぜん}** + ～ません.' },
        { q: 'Câu SAI:', options: ['よく{泳|およ}ぎます。', 'ときどき{泳|およ}ぎます。', 'あまり{泳|およ}ぎます。', '{全然|ぜんぜん}{泳|およ}ぎません。'], correct: 2, why: 'あまり phải đi với phủ định: あまり{泳|およ}ぎ**ません**.' },
        { q: 'ジュースを2＿{飲|の}みました。 (2 chai)', options: ['{本|ほん}', '{杯|はい}', '{冊|さつ}', '{枚|まい}'], correct: 0, why: 'Chai → **～{本|ほん}**: {2本|にほん}.' },
        { q: '{雑誌|ざっし}を3＿{買|か}いました。', options: ['{本|ほん}', '{杯|はい}', '{冊|さつ}', '{回|かい}'], correct: 2, why: 'Sách, tạp chí → **～{冊|さつ}**.' },
        { q: '「{1杯|いっぱい}」 đọc là:', options: ['いちはい', 'いっぱい', 'いっはい', 'いちばい'], correct: 1, why: '**いっぱい**.' },
        { q: '「{6本|ろっぽん}」 đọc là:', options: ['ろくほん', 'ろっぽん', 'ろくぼん', 'ろっほん'], correct: 1, why: '**ろっぽん**.' },
        { q: '「{3杯|さんばい}」 đọc là:', options: ['さんはい', 'さんばい', 'さんぱい', 'さっぱい'], correct: 1, why: '**さんばい**.' },
        { q: '"Một tháng" (khoảng thời gian):', options: ['{1月|いちがつ}', '{1か月|いっかげつ}', '{1日|ついたち}', '{1年|いちねん}'], correct: 1, why: '**{1か月|いっかげつ}**; {1月|いちがつ} là tháng Một.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b9-bt-tu-vung',
      title: 'Từ vựng',
      items: [
        { q: '「{小説|しょうせつ}」 là:', options: ['Truyện tranh', 'Tiểu thuyết', 'Tạp chí', 'Phim bộ'], correct: 1, why: 'しょうせつ = tiểu thuyết; {漫画|まんが} = truyện tranh.' },
        { q: '「{切手|きって}」 là:', options: ['Vé', 'Tem', 'Thẻ', 'Tranh'], correct: 1, why: 'きって = tem thư.' },
        { q: '「{釣|つ}り」 là:', options: ['Bơi', 'Câu cá', 'Leo núi', 'Lặn biển'], correct: 1, why: 'つり = câu cá.' },
        { q: '「{書道|しょどう}」 là:', options: ['Thư viện', 'Thư pháp', 'Hiệu sách', 'Bài tập'], correct: 1, why: 'しょどう = thư pháp.' },
        { q: '"Học (có thầy dạy) piano" dùng động từ:', options: ['{勉強|べんきょう}します', '{習|なら}います', '{教|おし}えます', '{集|あつ}めます'], correct: 1, why: '**{習|なら}います** = học từ người dạy.' },
        { q: '"Đăng ký" là:', options: ['{予約|よやく}します', '{申|もう}し{込|こ}みます', '{参加|さんか}します', '{払|はら}います'], correct: 1, why: '**{申|もう}し{込|こ}みます**; {予約|よやく} = đặt trước; {参加|さんか} = tham gia.' },
        { q: '「{受付|うけつけ}」 là:', options: ['Quầy tiếp tân', 'Nhà ga', 'Bảo tàng', 'Lớp học'], correct: 0, why: 'うけつけ = quầy tiếp tân.' },
        { q: '「{住所|じゅうしょ}」 là:', options: ['Số điện thoại', 'Địa chỉ', 'Tên', 'Nhà ở'], correct: 1, why: 'じゅうしょ = địa chỉ.' },
        { q: '「{宿題|しゅくだい}」 là:', options: ['Bài kiểm tra', 'Bài tập về nhà', 'Chủ đề', 'Nhà trọ'], correct: 1, why: 'しゅくだい = bài tập về nhà.' },
        { q: '「{最近|さいきん}」 là:', options: ['Gần đây, dạo này', 'Gần nhất (khoảng cách)', 'Lần đầu', 'Sau này'], correct: 0, why: 'さいきん = gần đây.' },
        { q: 'Vẽ tranh là:', options: ['{絵|え}を{書|か}きます', '{絵|え}を{描|か}きます', '{絵|え}を{見|み}せます', '{絵|え}を{集|あつ}めます'], correct: 1, why: 'Vẽ tranh → **{描|か}きます**; {書|か}きます = viết chữ.' },
        { q: 'Khen người bạn làm được việc khó:', options: ['すごいですね', '{残念|ざんねん}ですね', 'ちょっと……', 'わかりました'], correct: 0, why: '**すごいですね** = giỏi quá.' },
        { q: '「どうやって」 hỏi về:', options: ['Lý do', 'Cách làm', 'Thời gian', 'Số lượng'], correct: 1, why: 'どうやって = làm thế nào.' },
        { q: '"Lái xe" là:', options: ['{乗|の}ります', '{運転|うんてん}します', '{降|お}ります', 'ドライブ'], correct: 1, why: '**{運転|うんてん}します**; {乗|の}ります = lên (đi) xe.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b9-bt-hoi-dap',
      title: 'Chọn câu trả lời đúng cho câu hỏi',
      items: [
        { q: '{趣味|しゅみ}は{何|なん}ですか。', options: ['{写真|しゃしん}を{撮|と}ります。', '{写真|しゃしん}を{撮|と}ることです。', '{写真|しゃしん}を{撮|と}りますことです。', 'はい、{写真|しゃしん}です。'], correct: 1, why: '**V辞書形 + ことです**.' },
        { q: 'どんな{音楽|おんがく}を{聞|き}きますか。', options: ['ジャズを{聞|き}きます。', 'よく{聞|き}きます。', '{1日|いちにち}に{2時間|にじかん}です。', 'はい、{聞|き}きます。'], correct: 0, why: 'どんな → loại: ジャズ.' },
        { q: 'よくゲームをしますか。 (bạn ít chơi)', options: ['いいえ、よくしません。', 'いいえ、あまりしません。', 'はい、あまりします。', 'いいえ、ときどきします。'], correct: 1, why: 'Ít → **あまり～ません**.' },
        { q: '{1週間|いっしゅうかん}に{何回|なんかい}ジムへ{行|い}きますか。', options: ['{3日|みっか}{行|い}きます。', '{3回|さんかい}{行|い}きます。', 'よく{行|い}きます。', '{3時間|さんじかん}です。'], correct: 1, why: '何回 → **～回**.' },
        { q: 'スキーができますか。 (bạn không biết)', options: ['いいえ、しません。', 'いいえ、できません。', 'いいえ、スキーです。', 'いいえ、ありません。'], correct: 1, why: 'できますか → **できません**.' },
        { q: '{週末|しゅうまつ}、{何|なに}をしましたか。', options: ['{映画|えいが}を{見|み}て、{買|か}い{物|もの}をしました。', '{映画|えいが}を{見|み}ることです。', '{映画|えいが}を{見|み}ます、{買|か}い{物|もの}します。', '{映画|えいが}ができます。'], correct: 0, why: 'Việc đã làm, theo thứ tự → **Vて、Vました**.' },
        { q: 'どうやってチケットを{買|か}いますか。', options: ['インターネットで{予約|よやく}して、コンビニで{払|はら}います。', 'チケットは{2枚|にまい}です。', '{明日|あした}{買|か}います。', 'はい、{買|か}います。'], correct: 0, why: 'Cách làm → các bước Vて.' },
        { q: '{何番|なんばん}のバスに{乗|の}りますか。', options: ['{3番|さんばん}です。', '{3回|さんかい}です。', '{3時|さんじ}です。', '{3本|さんぼん}です。'], correct: 0, why: '何番 → **～番**.' },
      ],
    },
    {
      t: 'build',
      id: 'b9-bt-ghep',
      title: 'Ghép câu — một buổi giao lưu từ đầu đến cuối',
      items: [
        { vi: 'Sở thích của bạn là gì?', chips: ['{趣味|しゅみ}は', '{何|なん}', 'ですか', 'どう', 'が'], answer: ['{趣味|しゅみ}は', '{何|なん}', 'ですか'], ro: 'Shumi wa nan desu ka.' },
        { vi: 'Là làm bánh kẹo.', chips: ['お{菓子|かし}を', '{作|つく}る', 'ことです', '{作|つく}ります', 'が'], answer: ['お{菓子|かし}を', '{作|つく}る', 'ことです'], ro: 'Okashi o tsukuru koto desu.' },
        { vi: 'Đặc biệt tôi thích bánh kem.', chips: ['{特|とく}に、', 'ケーキが', '{好|す}きです', 'ケーキを', 'だけ'], answer: ['{特|とく}に、', 'ケーキが', '{好|す}きです'], ro: 'Toku ni, keeki ga suki desu.' },
        { vi: 'Một tuần tôi làm 1 lần.', chips: ['{1週間|いっしゅうかん}に', '{1回|いっかい}', '{作|つく}ります', '{1週間|いっしゅうかん}で', '{1本|いっぽん}'], answer: ['{1週間|いっしゅうかん}に', '{1回|いっかい}', '{作|つく}ります'], ro: 'Isshuukan ni ikkai tsukurimasu.' },
        { vi: 'Tôi không làm bánh giỏi được.', chips: ['{上手|じょうず}に', 'ケーキを', '{作|つく}る', 'ことが', 'できません', '{上手|じょうず}な', 'を'], answer: ['{上手|じょうず}に', 'ケーキを', '{作|つく}る', 'ことが', 'できません'], ro: 'Jouzu ni keeki o tsukuru koto ga dekimasen.' },
        { vi: 'Nhưng vui lắm.', chips: ['でも、', 'とても', '{楽|たの}しいです', 'が、', 'あまり'], answer: ['でも、', 'とても', '{楽|たの}しいです'], ro: 'Demo, totemo tanoshii desu.' },
        { vi: 'Dạo này tôi không đọc sách mấy.', chips: ['{最近|さいきん}、', '{本|ほん}を', 'あまり', '{読|よ}みません', '{読|よ}みます', 'よく'], answer: ['{最近|さいきん}、', '{本|ほん}を', 'あまり', '{読|よ}みません'], ro: 'Saikin, hon o amari yomimasen.' },
        { vi: 'Đăng ký thế nào?', chips: ['どうやって', '{申|もう}し{込|こ}みますか', '{何|なん}で', 'どこ'], answer: ['どうやって', '{申|もう}し{込|こ}みますか'], ro: 'Dou yatte moushikomimasu ka.' },
        { vi: 'Gọi vào số này rồi nói tên.', chips: ['この{電話番号|でんわばんごう}に', '{電話|でんわ}して、', '{名前|なまえ}を', '{言|い}います', '{電話|でんわ}します、', 'で'], answer: ['この{電話番号|でんわばんごう}に', '{電話|でんわ}して、', '{名前|なまえ}を', '{言|い}います'], ro: 'Kono denwa bangou ni denwa shite, namae o iimasu.' },
        { vi: 'Bạn trượt tuyết được à? Giỏi quá.', chips: ['スキーが', 'できますか。', 'すごいですね', 'スキーを', '{残念|ざんねん}ですね'], answer: ['スキーが', 'できますか。', 'すごいですね'], ro: 'Sukii ga dekimasu ka. Sugoi desu ne.' },
      ],
    },
  ],
};

export const BAI_9: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, KANJI, NGHE, NOI, BAI_TAP];

/* ═══════════════════════ 📖 THEO SÁCH — BÀI 9 (p.153–168) ═══════════════════════
 * Cùng khuôn với ./sach2.ts: mỗi trang = tiêu đề (số trang + mục) → tả tranh bằng lời
 * của mình + mục tiêu できる → cô hỏi–bạn đáp → mẹo trả lời → câu mẫu cho từng số của
 * 言ってみよう. KHÔNG chép sách: tranh được TẢ LẠI, hội thoại viết mới, bài 話読聞書
 * thay bằng bài của người học; KHÔNG ghi đáp án CD của やってみよう. Người học mẫu:
 * "ミン" (Minh), sinh viên Việt ở ĐH FPT — khi luyện thay bằng thông tin THẬT của bạn. */

type Line = Extract<Block, { t: 'dialogue' }>['lines'][number];
type ExS = { en: string; ro: string; vi: string };

/** Cô giáo hỏi. */
const C = (text: string, ro: string, vi: string): Line => ({ who: 'Cô giáo', role: 'examiner', text, ro, vi });
/** Bạn trả lời. */
const S = (text: string, ro: string, vi: string): Line => ({ who: 'Bạn', role: 'candidate', text, ro, vi });
const E = (en: string, ro: string, vi: string): ExS => ({ en, ro, vi });

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
const mau = (items: ExS[]): Block => ({ t: 'examples', items });

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

export const SACH_9: Lesson = {
  id: 'b9-sach',
  kind: 'review',
  title: 'Theo sách — Bài 9 (trang 153–168)',
  goal: 'Nhìn tranh sở thích, bảng thông báo, chuỗi tranh cuối tuần trong sách là hỏi–đáp được: sở thích là gì, đặc biệt thích gì, bao lâu một lần, làm được gì, cuối tuần làm gì theo thứ tự, và cách mua vé / đi đến / làm thẻ.',
  minutes: 60,
  blocks: [
    CACH_DUNG,

    ...trang(
      'Trang 153 · 話してみよう・聞いてみよう — Mở bài 好きなこと',
      '**話してみよう** — 4 tranh không lời: (1) một cây vợt tennis dựng cạnh quả bóng rổ, dưới đất có quả bóng bàn — các môn thể thao; (2) một cô gái ngồi bàn học, chống cằm, trước mặt là tờ giấy kẻ ô, bút lông, đèn bàn — như đang vẽ / thiết kế; (3) hai người đàn ông đeo ba lô đi trên đường mòn, xa xa là núi — đi leo núi; (4) một chàng trai ngồi xếp bằng trên sofa ôm đàn guitar điện, sau lưng là cửa sổ sáng. Mục đích: nói về **điều mình thích làm**. **聞いてみよう**: nghe trước đoạn hội thoại của bài (hai người mới quen ở một buổi giao lưu hỏi nhau sở thích) — chính là trang 168.',
      [
        C('（tranh 4）この{人|ひと}は{何|なに}をしていますか。', '(tranh 4) Kono hito wa nani o shite imasu ka.', '(tranh 4) Người này đang làm gì?'),
        S('ギターを{弾|ひ}いています。', 'Gitaa o hiite imasu.', 'Anh ấy đang chơi guitar.'),
        C('（tranh 3）ここで{何|なに}をしますか。', '(tranh 3) Koko de nani o shimasu ka.', '(tranh 3) Ở đây làm gì?'),
        S('{山|やま}に{登|のぼ}ります。', 'Yama ni noborimasu.', 'Leo núi ạ.'),
        C('ミンさんの{趣味|しゅみ}は{何|なん}ですか。', 'Min-san no shumi wa nan desu ka.', 'Sở thích của Minh là gì?'),
        S('{私|わたし}の{趣味|しゅみ}はサッカーをすることです。', 'Watashi no shumi wa sakkaa o suru koto desu.', 'Sở thích của em là chơi bóng đá.'),
      ],
      [
        'Cô hay hỏi ngay từ trang đầu: **{趣味|しゅみ}は{何|なん}ですか** ⇒ đáp **～ことです** (V thể từ điển + こと) hoặc **N です** (スポーツです).',
        'Tả tranh đang diễn ra dùng **～ています** (Bài 8): ギターを{弾|ひ}いています.',
        'Xem **Hội thoại · ① いろいろな趣味** và **Ngữ pháp · Thể từ điển + ポイント 81**.',
      ],
    ),

    ...trang(
      'Trang 154–155 · チャレンジ! いろいろな趣味',
      'Trang 154: **buổi giao lưu cộng đồng** — ba người đứng quanh bàn có cốc nước: một phụ nữ tóc dài quay lưng, một người đàn ông tóc ngắn đứng giữa (tay chạm cằm, đang nói), một phụ nữ tóc xoăn cầm cốc. Ô 1-1: bong bóng hỏi sở thích → hai bức tranh treo tường (một bức trừu tượng) → hỏi "của ai?" → **ピカソ** (Picasso). Ô 1-2: hỏi sở thích → người ngồi ghế đọc sách → chữ **{小説|しょうせつ}**. Trang 155 (hành lang cạnh máy bán nước, ba người phụ nữ nói chuyện): ô 2 — sở thích? → cậu bé đá bóng + tờ lịch tháng có vài vòng tròn (đá khá thường xuyên); ô 3 — cậu bé đá bóng, chữ **{今|いま}** bị gạch chéo (bây giờ không chơi nữa); ô 4 — hai người xem gì đó, hỏi "**よく？**", lịch tuần 日月火水木金土 đánh ×××○××○ (một tuần 2 lần). **Mục tiêu できる:** nói về sở thích của mình và hỏi sở thích của người khác. ☞ ポイント 81, 84, 85, 87.',
      [
        C('ミンさんの{趣味|しゅみ}は{何|なん}ですか。', 'Min-san no shumi wa nan desu ka.', 'Sở thích của Minh là gì?'),
        S('{絵|え}を{見|み}ることです。', 'E o miru koto desu.', 'Là xem tranh ạ.'),
        C('{誰|だれ}の{絵|え}が{好|す}きですか。', 'Dare no e ga suki desu ka.', 'Em thích tranh của ai?'),
        S('{特|とく}に、ピカソの{絵|え}が{好|す}きです。', 'Toku ni, Pikaso no e ga suki desu.', 'Đặc biệt em thích tranh của Picasso.'),
        C('（ô 3）この{人|ひと}は{今|いま}もサッカーをしますか。', '(ô 3) Kono hito wa ima mo sakkaa o shimasu ka.', '(ô 3) Người này bây giờ còn chơi bóng đá không?'),
        S('いいえ。{前|まえ}はよくしました。でも、{最近|さいきん}、{全然|ぜんぜん}しません。', 'Iie. Mae wa yoku shimashita. Demo, saikin, zenzen shimasen.', 'Không ạ. Trước đây hay chơi. Nhưng dạo này hoàn toàn không chơi.'),
        C('（ô 4）よくテレビを{見|み}ますか。', '(ô 4) Yoku terebi o mimasu ka.', '(ô 4) Có hay xem tivi không?'),
        S('はい、{1週間|いっしゅうかん}に{2回|にかい}{見|み}ます。', 'Hai, isshuukan ni nikai mimasu.', 'Có, một tuần xem 2 lần.'),
      ],
      [
        '**ポイント 81** {趣味|しゅみ}は～**こと**です · **84** {1週間|いっしゅうかん}**に**{2回|にかい} · **85** よく／ときどき／あまり／{全然|ぜんぜん} · **87** でも、{最近|さいきん}～.',
        'Đếm ○ trên lịch tuần ⇒ **{1週間|いっしゅうかん}に～{回|かい}**. Ô có chữ 今 gạch chéo ⇒ **でも、{最近|さいきん}、{全然|ぜんぜん}～ません**.',
        'Hỏi tiếp cho sâu: **どんな～を～ますか** (loại gì) · **{誰|だれ}の～** (của ai) · **よく～ますか**.',
        'Xem **Hội thoại · ①** và **Ngữ pháp · ポイント 81, 84, 85, 87**.',
      ],
    ),

    ...trang(
      'Trang 156 · 言ってみよう (chủ đề 1) — 1-1: どんな～ · 1-2: 特に · 2/3: よく／でも最近',
      '**1-1:** hỏi sở thích → "～ことです" → hỏi tiếp "loại nào?" → trả lời: 例 xem phim／phim hành động, ① nấu ăn／món Ý, ② chụp ảnh／ảnh phong cảnh, ③ sưu tầm tem／tem hình hoa, ④ nghe nhạc／nhạc pop. **1-2:** "～ことです。{特|とく}に、～が{好|す}きです": 例 xem tranh／tranh hoa, ① chơi thể thao／bóng đá, ② đọc sách／tiểu thuyết Nhật, ③ chơi piano／nhạc cổ điển, ④ nghe nhạc／jazz. **2/3:** khung chung "sở thích? → chơi bóng đá → へえ" rồi hai kiểu nói tiếp: 例1 "hay chơi bóng với bạn ở công viên"; 例2 "nhưng dạo này hoàn toàn không chơi".',
      [
        C('ミンさんの{趣味|しゅみ}は{何|なん}ですか。', 'Min-san no shumi wa nan desu ka.', 'Sở thích của Minh là gì?'),
        S('{写真|しゃしん}を{撮|と}ることです。', 'Shashin o toru koto desu.', 'Là chụp ảnh ạ.'),
        C('へえ、どんな{写真|しゃしん}を{撮|と}りますか。', 'Hee, donna shashin o torimasu ka.', 'Ồ, em chụp ảnh gì?'),
        S('{景色|けしき}の{写真|しゃしん}を{撮|と}ります。', 'Keshiki no shashin o torimasu.', 'Em chụp ảnh phong cảnh.'),
        C('{本|ほん}が{好|す}きですか。', 'Hon ga suki desu ka.', 'Em có thích sách không?'),
        S('はい。{趣味|しゅみ}は{本|ほん}を{読|よ}むことです。{特|とく}に、{日本|にほん}の{小説|しょうせつ}が{好|す}きです。', 'Hai. Shumi wa hon o yomu koto desu. Toku ni, Nihon no shousetsu ga suki desu.', 'Vâng. Sở thích của em là đọc sách. Đặc biệt em thích tiểu thuyết Nhật.'),
      ],
      [
        'Câu hỏi tiếp **どんな N を V ますか** ⇒ đáp **[loại] の N を V ます** hoặc **[loại] を V ます** — lặp lại đúng động từ của câu hỏi.',
        '**{特|とく}に** đứng đầu câu, sau đó là **～が{好|す}きです** (が — Bài 4).',
        'Mẫu 2/3: nói thêm một câu tần suất (よく～) hoặc một câu đảo chiều (**でも、{最近|さいきん}、{全然|ぜんぜん}～ません**) — đó chính là ポイント 85, 87.',
        'Xem **Ngữ pháp · ポイント 81 (bảng thay thế 1-1, 1-2)**.',
      ],
      [
        mau([
          E('Bさんの{趣味|しゅみ}は{何|なん}ですか。— {映画|えいが}を{見|み}ることです。— へえ、どんな{映画|えいが}を{見|み}ますか。— アクション{映画|えいが}を{見|み}ます。— そうですか。', 'B-san no shumi wa nan desu ka. — Eiga o miru koto desu. — Hee, donna eiga o mimasu ka. — Akushon eiga o mimasu. — Sou desu ka.', '1-1 例.'),
          E('{料理|りょうり}を{作|つく}ることです。— どんな{料理|りょうり}を{作|つく}りますか。— イタリア{料理|りょうり}を{作|つく}ります。', 'Ryouri o tsukuru koto desu. — Donna ryouri o tsukurimasu ka. — Itaria ryouri o tsukurimasu.', '1-1 ①.'),
          E('{写真|しゃしん}を{撮|と}ることです。— どんな{写真|しゃしん}を{撮|と}りますか。— {景色|けしき}の{写真|しゃしん}を{撮|と}ります。', 'Shashin o toru koto desu. — Donna shashin o torimasu ka. — Keshiki no shashin o torimasu.', '1-1 ②.'),
          E('{切手|きって}を{集|あつ}めることです。— どんな{切手|きって}を{集|あつ}めますか。— {花|はな}の{切手|きって}を{集|あつ}めます。', 'Kitte o atsumeru koto desu. — Donna kitte o atsumemasu ka. — Hana no kitte o atsumemasu.', '1-1 ③.'),
          E('{音楽|おんがく}を{聞|き}くことです。— どんな{音楽|おんがく}を{聞|き}きますか。— ポップスを{聞|き}きます。', 'Ongaku o kiku koto desu. — Donna ongaku o kikimasu ka. — Poppusu o kikimasu.', '1-1 ④.'),
          E('{絵|え}を{見|み}ることです。{特|とく}に、{花|はな}の{絵|え}が{好|す}きです。', 'E o miru koto desu. Toku ni, hana no e ga suki desu.', '1-2 例.'),
          E('スポーツをすることです。{特|とく}に、サッカーが{好|す}きです。', 'Supootsu o suru koto desu. Toku ni, sakkaa ga suki desu.', '1-2 ①.'),
          E('{本|ほん}を{読|よ}むことです。{特|とく}に、{日本|にほん}の{小説|しょうせつ}が{好|す}きです。', 'Hon o yomu koto desu. Toku ni, Nihon no shousetsu ga suki desu.', '1-2 ②.'),
          E('ピアノを{弾|ひ}くことです。{特|とく}に、クラシックが{好|す}きです。', 'Piano o hiku koto desu. Toku ni, kurashikku ga suki desu.', '1-2 ③.'),
          E('{音楽|おんがく}を{聞|き}くことです。{特|とく}に、ジャズが{好|す}きです。', 'Ongaku o kiku koto desu. Toku ni, jazu ga suki desu.', '1-2 ④.'),
          E('{趣味|しゅみ}は{何|なん}ですか。— サッカーをすることです。— へえ。— {公園|こうえん}で{友達|ともだち}とよくサッカーをします。— そうですか。', 'Shumi wa nan desu ka. — Sakkaa o suru koto desu. — Hee. — Kouen de tomodachi to yoku sakkaa o shimasu. — Sou desu ka.', '2/3 例1 — hay chơi.'),
          E('サッカーをすることです。— へえ。— でも、{最近|さいきん}、{全然|ぜんぜん}しません。— そうですか。', 'Sakkaa o suru koto desu. — Hee. — Demo, saikin, zenzen shimasen. — Sou desu ka.', '2/3 例2 — dạo này không chơi.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 157 · 言ってみよう (gợi ý 2/3 và số 4) · やってみよう · hỏi bạn cùng lớp',
      'Nửa trên: tranh gợi ý cho mẫu 2/3 — 例1 hai người đá bóng ở công viên (**よく**); 例2 hai người đá bóng (**{最近|さいきん}・{全然|ぜんぜん}**); ① người leo núi cắm cờ trên đỉnh, có ảnh chụp (**ときどき**); ② người trang trí bánh kem (**{上手|じょうず}じゃありません**); ③ người chơi piano trong nhà (**ときどき**); ④ người vẽ bên giá vẽ (**{最近|さいきん}・{全然|ぜんぜん}**). **Số 4:** "có hay … không?" → "có, (khoảng thời gian) (số lần)": 例 xem phim／1 tuần・khoảng 2 lần, ① chơi game／1 tuần・4, 5 lần, ② leo núi／1 tháng・khoảng 3 lần, ③ đọc sách／1 tuần・2, 3 quyển, ④ lên mạng／1 ngày・khoảng 4 tiếng. **やってみよう:** nghe 4 người (木村, パク, カルロス, 山口) rồi điền bảng: sở thích · đặc biệt · bao lâu một lần. Cuối trang: hỏi sở thích các bạn trong lớp, ghi lại, rồi **rủ** người cùng sở thích.',
      [
        C('よく{山|やま}に{登|のぼ}りますか。', 'Yoku yama ni noborimasu ka.', 'Em có hay leo núi không?'),
        S('はい、{1か月|いっかげつ}に{3回|さんかい}くらい{登|のぼ}ります。', 'Hai, ikkagetsu ni sankai kurai noborimasu.', 'Có ạ, khoảng 1 tháng 3 lần.'),
        C('{1週間|いっしゅうかん}に{何冊|なんさつ}{本|ほん}を{読|よ}みますか。', 'Isshuukan ni nansatsu hon o yomimasu ka.', 'Một tuần em đọc mấy quyển sách?'),
        S('{1週間|いっしゅうかん}に{2|に}、{3冊|さんさつ}{読|よ}みます。', 'Isshuukan ni ni, sansatsu yomimasu.', 'Một tuần em đọc 2, 3 quyển.'),
        C('{1日|いちにち}に{何時間|なんじかん}インターネットをしますか。', 'Ichinichi ni nanjikan intaanetto o shimasu ka.', 'Một ngày em lên mạng mấy tiếng?'),
        S('{4時間|よじかん}くらいします。', 'Yojikan kurai shimasu.', 'Khoảng 4 tiếng ạ.'),
        C('ミンさんとリンさんは{同|おな}じ{趣味|しゅみ}ですね。{誘|さそ}ってください。', 'Min-san to Rin-san wa onaji shumi desu ne. Sasotte kudasai.', 'Minh và Linh cùng sở thích nhỉ. Em rủ bạn đi.'),
        S('リンさん、{今度|こんど}、{一緒|いっしょ}に{山|やま}に{登|のぼ}りませんか。', 'Rin-san, kondo, issho ni yama ni noborimasen ka.', 'Linh ơi, lần tới cùng đi leo núi không?'),
      ],
      [
        '**[khoảng thời gian] に [số]** — nhớ **に**; số + từ đếm đứng ngay trước động từ. {1週間|いっしゅうかん} (いっしゅうかん), {1か月|いっかげつ} (いっかげつ), {4時間|よじかん} (よじかん, không phải よんじかん).',
        'Tranh ② "{上手|じょうず}じゃありません" ⇒ でも、{上手|じょうず}じゃありません (Bài 8 — {上手|じょうず} là tính từ な).',
        'Nghe やってみよう: bắt cụm trước **ことです**, từ sau **{特|とく}に**, và cụm **～に～{回|かい}**; câu có **でも、{最近|さいきん}** thì tần suất đã đổi. Không có đáp án ở đây.',
        'Rủ người cùng sở thích = ôn **Bài 6 ～ませんか**. Luyện: **Luyện nghe · Bài 1**.',
      ],
      [
        mau([
          E('{趣味|しゅみ}は{山|やま}に{登|のぼ}ることです。ときどき{友達|ともだち}と{登|のぼ}ります。', 'Shumi wa yama ni noboru koto desu. Tokidoki tomodachi to noborimasu.', '2/3 ① — ときどき.'),
          E('{趣味|しゅみ}はケーキを{作|つく}ることです。でも、{上手|じょうず}じゃありません。', 'Shumi wa keeki o tsukuru koto desu. Demo, jouzu ja arimasen.', '2/3 ② — 上手じゃありません.'),
          E('{趣味|しゅみ}はピアノを{弾|ひ}くことです。ときどきうちで{弾|ひ}きます。', 'Shumi wa piano o hiku koto desu. Tokidoki uchi de hikimasu.', '2/3 ③ — ときどき.'),
          E('{趣味|しゅみ}は{絵|え}を{描|か}くことです。でも、{最近|さいきん}、{全然|ぜんぜん}{描|か}きません。', 'Shumi wa e o kaku koto desu. Demo, saikin, zenzen kakimasen.', '2/3 ④ — 最近・全然.'),
          E('{趣味|しゅみ}は{何|なん}ですか。— {映画|えいが}を{見|み}ることです。— よく{映画|えいが}を{見|み}ますか。— はい、{1週間|いっしゅうかん}に{2回|にかい}くらい{見|み}ます。— そうですか。', 'Shumi wa nan desu ka. — Eiga o miru koto desu. — Yoku eiga o mimasu ka. — Hai, isshuukan ni nikai kurai mimasu. — Sou desu ka.', '4 例.'),
          E('ゲームをすることです。— よくゲームをしますか。— はい、{1週間|いっしゅうかん}に{4|よん}、{5回|ごかい}します。', 'Geemu o suru koto desu. — Yoku geemu o shimasu ka. — Hai, isshuukan ni yon, gokai shimasu.', '4 ①.'),
          E('{山|やま}に{登|のぼ}ることです。— よく{登|のぼ}りますか。— はい、{1か月|いっかげつ}に{3回|さんかい}くらい{登|のぼ}ります。', 'Yama ni noboru koto desu. — Yoku noborimasu ka. — Hai, ikkagetsu ni sankai kurai noborimasu.', '4 ②.'),
          E('{本|ほん}を{読|よ}むことです。— よく{読|よ}みますか。— はい、{1週間|いっしゅうかん}に{2|に}、{3冊|さんさつ}{読|よ}みます。', 'Hon o yomu koto desu. — Yoku yomimasu ka. — Hai, isshuukan ni ni, sansatsu yomimasu.', '4 ③.'),
          E('インターネットをすることです。— よくしますか。— はい、{1日|いちにち}に{4時間|よじかん}くらいします。', 'Intaanetto o suru koto desu. — Yoku shimasu ka. — Hai, ichinichi ni yojikan kurai shimasu.', '4 ④.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 158–159 · チャレンジ! できること・できないこと',
      'Trang 158: một cô gái tóc dài (nhìn từ sau lưng) đứng trước **bảng thông báo** dán nhiều poster: CLB nhảy (hình bóng người khiêu vũ), CLB piano jazz, **{料理|りょうり}{教室|きょうしつ}** (ảnh món ăn) và một poster lớn **SKI {北海道|ほっかいどう} スキー{旅行|りょこう}** (người trượt tuyết, bông tuyết, dòng ghi ngày và chỗ đăng ký). Ô 1-1: bong bóng có poster trượt tuyết và dấu "?" (bạn trượt tuyết được à?). Ô 1-2: bong bóng **{書道|しょどう}{教室|きょうしつ}** — cô gái viết chữ 山 bằng bút lông, dấu "+" (muốn học thêm). Trang 159: bảng **{1月|いちがつ}のイベント** — poster lớp thư pháp **{毎週|まいしゅう}{水曜日|すいようび}{6時|ろくじ}から, phòng họp tầng 2 nhà văn hoá**, bàn tay cầm bút lông; bên cạnh là poster có hình máy tính; hai phụ nữ đứng xem, một người chỉ vào lớp thư pháp. **Mục tiêu できる:** dựa vào thông tin (poster), nói việc mình làm được và không làm được. ☞ ポイント 82.',
      [
        C('ミンさんはスキーができますか。', 'Min-san wa sukii ga dekimasu ka.', 'Minh trượt tuyết được không?'),
        S('いいえ、できません。ベトナムには{雪|ゆき}がありませんから。', 'Iie, dekimasen. Betonamu ni wa yuki ga arimasen kara.', 'Không ạ. Vì ở Việt Nam không có tuyết.'),
        C('{書道|しょどう}{教室|きょうしつ}は{何曜日|なんようび}ですか。', 'Shodou kyoushitsu wa nan\'youbi desu ka.', 'Lớp thư pháp vào thứ mấy?'),
        S('{毎週|まいしゅう}{水曜日|すいようび}です。{6時|ろくじ}からです。', 'Maishuu suiyoubi desu. Rokuji kara desu.', 'Thứ Tư hằng tuần ạ. Từ 6 giờ.'),
        C('ミンさんは{上手|じょうず}に{漢字|かんじ}を{書|か}くことができますか。', 'Min-san wa jouzu ni kanji o kaku koto ga dekimasu ka.', 'Minh viết chữ Hán đẹp được không?'),
        S('いいえ、できません。ですから、{書道|しょどう}を{習|なら}いたいです。', 'Iie, dekimasen. Desukara, shodou o naraitai desu.', 'Không ạ. Vì thế em muốn học thư pháp.'),
      ],
      [
        '**ポイント 82**: **N が できます** (スキーができます) · **V辞書形 こと が できます** ({漢字|かんじ}を{書|か}くことができます). Trợ từ luôn **が**.',
        'Trả lời 「～ができますか」: **はい、できます／いいえ、できません** (+ {少|すこ}し／あまり／{全然|ぜんぜん} để nói mức độ).',
        'Có dấu "+" (muốn học thêm) ⇒ **～を{習|なら}いたいです**; lý do ⇒ **～ことができませんから**.',
        'Xem **Hội thoại · ② できること・できないこと** và **Ngữ pháp · ポイント 82**.',
      ],
    ),

    ...trang(
      'Trang 160 · 言ってみよう (chủ đề 2) — 1-1: bạn làm được à? · 1-2: vì không làm được nên muốn học',
      '**1-1:** hai người trước bảng thông báo: "nhiều sự kiện nhỉ" → "tôi muốn … cái này" → "hả? bạn … được à?" → "à, ừ" → "giỏi quá": 例 tham gia chuyến trượt tuyết Hokkaido, ① vào CLB nhảy (hình đôi nhảy), ② đi tour lặn biển (DIVING), ③ vào CLB piano jazz, ④ tham gia cuộc thi làm bánh (đầu bếp cầm bánh kem). **1-2:** "tôi muốn đăng ký cái này" → "hả? lớp …?" → "vì tôi không … được, nên muốn học": 例 lớp thư pháp／viết chữ Hán đẹp, ① lớp làm bánh／làm bánh kem, ② lớp nấu ăn／nấu món Nhật, ③ lớp tiếng Anh／nói tiếng Anh giỏi, ④ lớp máy tính／dùng máy tính thành thạo.',
      [
        C('いろいろなイベントがありますね。', 'Iroiro na ibento ga arimasu ne.', 'Có nhiều sự kiện nhỉ.'),
        S('そうですね。あ、{私|わたし}はこのダンスクラブに{入|はい}りたいです。', 'Sou desu ne. A, watashi wa kono dansu kurabu ni hairitai desu.', 'Vâng ạ. A, em muốn vào CLB nhảy này.'),
        C('えっ？ミンさんはダンスができますか。', 'E? Min-san wa dansu ga dekimasu ka.', 'Hả? Minh nhảy được à?'),
        S('あ、はい。', 'A, hai.', 'À, vâng.'),
        C('へえ、すごいですね。', 'Hee, sugoi desu ne.', 'Ồ, giỏi thật.'),
        S('あ、{私|わたし}はこれに{申|もう}し{込|こ}みたいです。', 'A, watashi wa kore ni moushikomitai desu.', 'A, em muốn đăng ký cái này.'),
        C('えっ？パソコン{教室|きょうしつ}ですか。', 'E? Pasokon kyoushitsu desu ka.', 'Hả? Lớp máy tính à?'),
        S('はい。{私|わたし}は{上手|じょうず}にパソコンを{使|つか}うことができませんから、{習|なら}いたいです。', 'Hai. Watashi wa jouzu ni pasokon o tsukau koto ga dekimasen kara, naraitai desu.', 'Vâng. Vì em không dùng máy tính thành thạo được nên em muốn học.'),
      ],
      [
        'Động từ đi với từng poster: dễ sai trợ từ — {旅行|りょこう}**に{参加|さんか}します** · クラブ**に{入|はい}ります** · ツアー**に{行|い}きます** · コンテスト**に{参加|さんか}します** · {教室|きょうしつ}**に{申|もう}し{込|こ}みます**. Tất cả đều **に**.',
        'Muốn làm ⇒ **V(bỏ ます)たいです** (Bài 5): {参加|さんか}したい, {入|はい}りたい, {申|もう}し{込|こ}みたい.',
        'Câu ngạc nhiên **えっ？～ができますか** + khen **すごいですね** — cô rất hay đóng vai người ngạc nhiên.',
        'Xem **Ngữ pháp · ポイント 82 (bảng thay thế 1-1, 1-2)**.',
      ],
      [
        mau([
          E('いろいろなイベントがありますね。— そうですね。あ、{私|わたし}はこのスキー{旅行|りょこう}に{参加|さんか}したいです。— えっ？Bさんはスキーができますか。— あ、はい。— へえ、すごいですね。', 'Iroiro na ibento ga arimasu ne. — Sou desu ne. A, watashi wa kono sukii ryokou ni sanka shitai desu. — E? B-san wa sukii ga dekimasu ka. — A, hai. — Hee, sugoi desu ne.', '1-1 例.'),
          E('{私|わたし}はこのダンスクラブに{入|はい}りたいです。— えっ？ダンスができますか。', 'Watashi wa kono dansu kurabu ni hairitai desu. — E? Dansu ga dekimasu ka.', '1-1 ①.'),
          E('{私|わたし}はこのダイビングツアーに{行|い}きたいです。— えっ？ダイビングができますか。', 'Watashi wa kono daibingu tsuaa ni ikitai desu. — E? Daibingu ga dekimasu ka.', '1-1 ②.'),
          E('{私|わたし}はこのジャズピアノクラブに{入|はい}りたいです。— えっ？ピアノを{弾|ひ}くことができますか。', 'Watashi wa kono jazu piano kurabu ni hairitai desu. — E? Piano o hiku koto ga dekimasu ka.', '1-1 ③.'),
          E('{私|わたし}はこのケーキコンテストに{参加|さんか}したいです。— えっ？ケーキを{作|つく}ることができますか。', 'Watashi wa kono keeki kontesuto ni sanka shitai desu. — E? Keeki o tsukuru koto ga dekimasu ka.', '1-1 ④.'),
          E('あ、{私|わたし}はこれに{申|もう}し{込|こ}みたいです。— えっ？{書道|しょどう}{教室|きょうしつ}ですか。— はい。{私|わたし}は{上手|じょうず}に{漢字|かんじ}を{書|か}くことができませんから、{書道|しょどう}を{習|なら}いたいです。— そうですか。', 'A, watashi wa kore ni moushikomitai desu. — E? Shodou kyoushitsu desu ka. — Hai. Watashi wa jouzu ni kanji o kaku koto ga dekimasen kara, shodou o naraitai desu. — Sou desu ka.', '1-2 例.'),
          E('えっ？お{菓子|かし}{教室|きょうしつ}ですか。— はい。ケーキを{作|つく}ることができませんから、{習|なら}いたいです。', 'E? Okashi kyoushitsu desu ka. — Hai. Keeki o tsukuru koto ga dekimasen kara, naraitai desu.', '1-2 ①.'),
          E('えっ？{料理|りょうり}{教室|きょうしつ}ですか。— はい。{日本|にほん}{料理|りょうり}を{作|つく}ることができませんから、{習|なら}いたいです。', 'E? Ryouri kyoushitsu desu ka. — Hai. Nihon ryouri o tsukuru koto ga dekimasen kara, naraitai desu.', '1-2 ②.'),
          E('えっ？{英語|えいご}ですか。— はい。{上手|じょうず}に{英語|えいご}を{話|はな}すことができませんから、{習|なら}いたいです。', 'E? Eigo desu ka. — Hai. Jouzu ni eigo o hanasu koto ga dekimasen kara, naraitai desu.', '1-2 ③.'),
          E('えっ？パソコンですか。— はい。{上手|じょうず}にパソコンを{使|つか}うことができませんから、{習|なら}いたいです。', 'E? Pasokon desu ka. — Hai. Jouzu ni pasokon o tsukau koto ga dekimasen kara, naraitai desu.', '1-2 ④.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 161 · やってみよう — Nghe: hai người sẽ đi đâu? · Nói về lớp học ở phố bạn',
      '**やってみよう:** 4 poster — ⓐ lớp nấu ăn thứ Hai từ 16:00 (ảnh 3 món ăn); ⓑ lớp guitar Chủ Nhật từ 3 giờ chiều (người ngồi ghế ôm guitar); ⓒ COOKING SCHOOL thứ Tư từ 18:00, ghi "tiếng Anh cũng được" (chữ 料理教室 trên hình cái nồi); ⓓ du lịch Okinawa 2–5/8 có lặn biển. Nghe 2 đoạn, mỗi đoạn một người chọn nơi sẽ đi. Cuối trang: ở phố bạn có sự kiện, lớp học gì? Muốn tham gia cái nào? Vì sao? — nói với bạn cùng lớp.',
      [
        C('ミンさんの{町|まち}にはどんな{教室|きょうしつ}がありますか。', 'Min-san no machi ni wa donna kyoushitsu ga arimasu ka.', 'Ở phố của Minh có những lớp học nào?'),
        S('{英語|えいご}{教室|きょうしつ}やギター{教室|きょうしつ}があります。', 'Eigo kyoushitsu ya gitaa kyoushitsu ga arimasu.', 'Có lớp tiếng Anh, lớp guitar…'),
        C('どれに{参加|さんか}したいですか。どうしてですか。', 'Dore ni sanka shitai desu ka. Doushite desu ka.', 'Em muốn tham gia lớp nào? Tại sao?'),
        S('ギター{教室|きょうしつ}に{参加|さんか}したいです。{私|わたし}はギターが{全然|ぜんぜん}できませんから。', 'Gitaa kyoushitsu ni sanka shitai desu. Watashi wa gitaa ga zenzen dekimasen kara.', 'Em muốn tham gia lớp guitar. Vì em hoàn toàn không chơi guitar được.'),
        C('ⓒの{教室|きょうしつ}は{何曜日|なんようび}ですか。', 'C no kyoushitsu wa nan\'youbi desu ka.', 'Lớp ⓒ vào thứ mấy?'),
        S('{水曜日|すいようび}です。{6時|ろくじ}からです。{英語|えいご}もOKです。', 'Suiyoubi desu. Rokuji kara desu. Eigo mo OK desu.', 'Thứ Tư ạ. Từ 6 giờ. Tiếng Anh cũng được.'),
      ],
      [
        'Nghe やってみよう: bắt **thứ trong tuần + giờ** (người nói hay loại một lựa chọn vì "hôm đó có việc") và câu **～ができます／できません** (không bơi được ⇒ không đi lặn). Không có đáp án ở đây.',
        '18:00 đọc **{6時|ろくじ}** (hoặc {午後|ごご}{6時|ろくじ}); 16:00 = **{4時|よじ}**. 2–5/8 = **{8月|はちがつ}{2日|ふつか}から{5日|いつか}まで**.',
        '"どうして" ⇒ **～から** (ポイント 47) — ghép với できません: ～が{全然|ぜんぜん}できませんから.',
        'Luyện: **Luyện nghe · Bài 2 — Đi lớp / sự kiện nào?**',
      ],
    ),

    ...trang(
      'Trang 162–163 · チャレンジ! 楽しい週末',
      'Trang 162: trong lớp, hai người nhìn ra cửa sổ (một đứng, một ngồi trên bàn). Khung trên: bong bóng "cuối tuần?" → chuỗi tranh: cầm túi **SALE** (mua sắm) → ăn ở bàn → đám đông reo hò **SMILE** (đi xem buổi diễn của nhóm SMILE). Khung dưới: "thích SMILE à?" → lịch cả năm chỉ tháng 11 có ○ (một năm diễn một lần) → đám đông SMILE. Ô 2: "SMILE?" → máy tính chữ **{予約|よやく}** → vé ¥1,000 đổi lấy vé SMILE, biểu tượng **24** (cửa hàng mở 24 giờ) — tức là đặt vé qua mạng rồi trả tiền ở cửa hàng tiện lợi. Trang 163: lớp học — một phụ nữ đeo túi lớn đi ngang, một nam sinh ngồi nhìn theo, một nữ sinh đứng phía sau; đồng hồ treo tường, bảng ghi ngày tháng thứ. **Mục tiêu できる:** kể về việc đã làm ngày nghỉ; giải thích các bước của một việc mình biết. ☞ ポイント 83, 86.',
      [
        C('ミンさん、{週末|しゅうまつ}、{何|なに}をしましたか。', 'Min-san, shuumatsu, nani o shimashita ka.', 'Minh, cuối tuần em làm gì?'),
        S('{友達|ともだち}と{買|か}い{物|もの}をして、ご{飯|はん}を{食|た}べて、コンサートに{行|い}きました。', 'Tomodachi to kaimono o shite, gohan o tabete, konsaato ni ikimashita.', 'Em mua sắm với bạn, ăn cơm, rồi đi xem hoà nhạc.'),
        C('SMILEのコンサートは{1年|いちねん}に{何回|なんかい}ありますか。', 'SMILE no konsaato wa ichinen ni nankai arimasu ka.', 'Buổi diễn của SMILE một năm có mấy lần?'),
        S('{1年|いちねん}に{1回|いっかい}あります。{11月|じゅういちがつ}です。', 'Ichinen ni ikkai arimasu. Juuichigatsu desu.', 'Một năm một lần ạ. Vào tháng 11.'),
        C('どうやってチケットを{買|か}いますか。', 'Dou yatte chiketto o kaimasu ka.', 'Mua vé bằng cách nào?'),
        S('インターネットで{予約|よやく}して、コンビニでお{金|かね}を{払|はら}います。', 'Intaanetto de yoyaku shite, konbini de okane o haraimasu.', 'Đặt trên mạng rồi trả tiền ở cửa hàng tiện lợi ạ.'),
      ],
      [
        '**ポイント 83** V1て、V2て、V3**ました** — kể theo đúng thứ tự tranh, chỉ động từ cuối có ました.',
        '**ポイント 86 どうやって** ⇒ trả lời các bước bằng Vて; thì **hiện tại** (cách làm nói chung).',
        'Lịch chỉ một ○ trong năm ⇒ **{1年|いちねん}に{1回|いっかい}** (ポイント 84).',
        'Xem **Hội thoại · ③ 楽しい週末** và **Ngữ pháp · ポイント 83, 86**.',
      ],
    ),

    ...trang(
      'Trang 164 · 言ってみよう (chủ đề 3) — 1: cuối tuần làm gì · 2: làm thế nào?',
      '**Số 1:** "cuối tuần làm gì?" → kể ba việc theo tranh: 例 rạp phim (hai người xem) → thử áo ở cửa hàng có biển SALE → ăn ở nhà hàng; ① đi cùng bạn đến **{上野|うえの}** → xem tranh treo tường trong bảo tàng → ăn ở bàn tròn nhiều món; ② một phụ nữ vẫy tay gặp bạn → hai người ăn và nói chuyện vui vẻ → một người hát karaoke; ③ đi **siêu thị** (cầm túi) → thái rau nấu ăn → hai người ăn cơm ở bàn. **Số 2:** A hỏi "cuối tuần làm gì?" → B "đi xem hoà nhạc" → A "tôi cũng muốn đi, nhưng không biết cách mua vé. Mua thế nào?" → B giải thích: đặt trên mạng rồi trả tiền ở cửa hàng tiện lợi → A cảm ơn.',
      [
        C('（①）{週末|しゅうまつ}、{何|なに}をしましたか。', '(1) Shuumatsu, nani o shimashita ka.', '(①) Cuối tuần em làm gì?'),
        S('{友達|ともだち}と{上野|うえの}へ{行|い}って、{美術館|びじゅつかん}で{絵|え}を{見|み}て、{食事|しょくじ}しました。', 'Tomodachi to Ueno e itte, bijutsukan de e o mite, shokuji shimashita.', 'Em đi Ueno với bạn, xem tranh ở bảo tàng rồi đi ăn.'),
        C('（③）{日曜日|にちようび}は？', '(3) Nichiyoubi wa?', '(③) Còn Chủ Nhật?'),
        S('スーパーで{買|か}い{物|もの}をして、{料理|りょうり}を{作|つく}って、{友達|ともだち}と{食|た}べました。', 'Suupaa de kaimono o shite, ryouri o tsukutte, tomodachi to tabemashita.', 'Em mua đồ ở siêu thị, nấu ăn rồi ăn cùng bạn.'),
        C('{私|わたし}もコンサートに{行|い}きたいです。でも、チケットの{買|か}い{方|かた}がわかりません。', 'Watashi mo konsaato ni ikitai desu. Demo, chiketto no kaikata ga wakarimasen.', 'Cô cũng muốn đi hoà nhạc. Nhưng cô không biết cách mua vé.'),
        S('インターネットでチケットを{予約|よやく}して、コンビニでお{金|かね}を{払|はら}います。', 'Intaanetto de chiketto o yoyaku shite, konbini de okane o haraimasu.', 'Cô đặt vé trên mạng rồi trả tiền ở cửa hàng tiện lợi ạ.'),
      ],
      [
        'Thể て cần chắc: {行|い}って (bất quy tắc), {見|み}て, {買|か}い{物|もの}をして, {作|つく}って, {会|あ}って, {話|はな}して, {歌|うた}って.',
        '**～の{買|か}い{方|かた}がわかりません** = không biết cách mua (V bỏ ます + {方|かた}, Bài 7) — câu mở đầu tự nhiên trước khi hỏi どうやって.',
        '**でも** ở câu của A: "muốn đi. NHƯNG không biết cách mua" — ポイント 87.',
        'Xem **Ngữ pháp · ポイント 83 (bảng thay thế kể 3 việc)**.',
      ],
      [
        mau([
          E('{週末|しゅうまつ}、{何|なに}をしましたか。— {友達|ともだち}と{映画|えいが}を{見|み}て、{買|か}い{物|もの}をして、{食事|しょくじ}しました。— へえ、そうですか。', 'Shuumatsu, nani o shimashita ka. — Tomodachi to eiga o mite, kaimono o shite, shokuji shimashita. — Hee, sou desu ka.', '1 例.'),
          E('{友達|ともだち}と{上野|うえの}へ{行|い}って、{美術館|びじゅつかん}で{絵|え}を{見|み}て、{中華|ちゅうか}{料理|りょうり}を{食|た}べました。', 'Tomodachi to Ueno e itte, bijutsukan de e o mite, chuuka ryouri o tabemashita.', '1 ①.'),
          E('{友達|ともだち}に{会|あ}って、レストランで{食事|しょくじ}して、カラオケで{歌|うた}いました。', 'Tomodachi ni atte, resutoran de shokuji shite, karaoke de utaimashita.', '1 ②.'),
          E('スーパーで{買|か}い{物|もの}をして、{料理|りょうり}を{作|つく}って、{友達|ともだち}と{食|た}べました。', 'Suupaa de kaimono o shite, ryouri o tsukutte, tomodachi to tabemashita.', '1 ③.'),
          E('Bさん、{週末|しゅうまつ}、{何|なに}をしましたか。— コンサートに{行|い}きました。— いいですね。{私|わたし}もコンサートに{行|い}きたいです。でも、チケットの{買|か}い{方|かた}がわかりません。どうやってチケットを{買|か}いますか。— インターネットでチケットを{予約|よやく}して、コンビニでお{金|かね}を{払|はら}います。— そうですか。ありがとうございます。', 'B-san, shuumatsu, nani o shimashita ka. — Konsaato ni ikimashita. — Ii desu ne. Watashi mo konsaato ni ikitai desu. Demo, chiketto no kaikata ga wakarimasen. Dou yatte chiketto o kaimasu ka. — Intaanetto de chiketto o yoyaku shite, konbini de okane o haraimasu. — Sou desu ka. Arigatou gozaimasu.', '2 例.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 165 · 言ってみよう số 2 ①②③ · やってみよう · kể điều mình thích',
      'Ba chuỗi tranh tiếp mẫu số 2 (vấn đề → cách làm → kết quả): ① người chỉ vào bức tranh trong **bảo tàng mỹ thuật** (dấu "?" — đi thế nào?) → xe buýt **số 3** và trạm dừng **ほしの**; ② trong **thư viện** (kệ sách, nhân viên ở quầy) → thẻ **としょかんカード** → quầy **{受付|うけつけ}** với tờ khai tên, địa chỉ, số điện thoại → người phụ nữ nói cần **がいこくじんとうろくしょう**; ③ tờ thông báo **{交流会|こうりゅうかい}** → dấu "?" + điện thoại → tờ ghi ngày và số điện thoại đăng ký → một người gọi điện nói tên và địa chỉ. **やってみよう:** nghe rồi đánh số 1–4 theo thứ tự cho 3 nhóm tranh: (1) hội trường, hai người bắt tay, đi bộ về hướng {新宿|しんじゅく}, ăn ở bàn; (2) giấy đăng ký ngoại kiều, quầy sách có ngày 15/6, tờ ghi tên/địa chỉ, nhận thẻ thư viện; (3) ga có biển 美術館, trong toa tàu "さくら", ga やなぎ, trong toa tàu "やなぎ". Cuối trang: viết về điều bạn thích (cách dùng, cách chơi, chuẩn bị, kế hoạch, kỷ niệm…) bằng tranh + câu theo thứ tự, rồi giải thích cho lớp.',
      [
        C('どうやって{美術館|びじゅつかん}へ{行|い}きますか。', 'Dou yatte bijutsukan e ikimasu ka.', 'Đi bảo tàng bằng cách nào?'),
        S('{3番|さんばん}のバスに{乗|の}って、ほしので{降|お}ります。', 'Sanban no basu ni notte, Hoshino de orimasu.', 'Lên xe buýt số 3, xuống ở Hoshino ạ.'),
        C('どうやって{図書館|としょかん}のカードを{作|つく}りますか。', 'Dou yatte toshokan no kaado o tsukurimasu ka.', 'Làm thẻ thư viện thế nào?'),
        S('{受付|うけつけ}で{名前|なまえ}と{住所|じゅうしょ}と{電話番号|でんわばんごう}を{書|か}いて、{外国人登録証|がいこくじんとうろくしょう}を{見|み}せます。', 'Uketsuke de namae to juusho to denwa bangou o kaite, gaikokujin tourokushou o misemasu.', 'Ở quầy tiếp tân viết tên, địa chỉ, số điện thoại rồi cho xem thẻ đăng ký người nước ngoài.'),
        C('どうやって{交流会|こうりゅうかい}に{申|もう}し{込|こ}みますか。', 'Dou yatte kouryuukai ni moushikomimasu ka.', 'Đăng ký buổi giao lưu thế nào?'),
        S('この{電話番号|でんわばんごう}に{電話|でんわ}して、{名前|なまえ}と{住所|じゅうしょ}を{言|い}います。', 'Kono denwa bangou ni denwa shite, namae to juusho o iimasu.', 'Gọi vào số điện thoại này rồi nói tên và địa chỉ.'),
        C('ミンさんの{好|す}きなことは{何|なん}ですか。{説明|せつめい}してください。', 'Min-san no suki na koto wa nan desu ka. Setsumei shite kudasai.', 'Điều Minh thích là gì? Em giải thích đi.'),
        S('フォーを{作|つく}ることです。まず、{牛肉|ぎゅうにく}と{野菜|やさい}を{切|き}って、スープを{作|つく}って、それから、{麺|めん}を{入|い}れます。', 'Foo o tsukuru koto desu. Mazu, gyuuniku to yasai o kitte, suupu o tsukutte, sore kara, men o iremasu.', 'Là nấu phở ạ. Trước hết thái thịt bò và rau, nấu nước dùng, rồi cho bánh phở vào.'),
      ],
      [
        'Trợ từ xe: バス**に**{乗|の}って · (trạm)**で**{降|お}ります. Tên trạm, ga là danh từ riêng — đọc đúng như viết (ほしの, やなぎ{駅|えき}).',
        'Thủ tục: {受付|うけつけ}**で** (nơi) … を{書|か}いて、… を{見|み}せます; {電話番号|でんわばんごう}**に**{電話|でんわ}して.',
        'Nghe やってみよう: thứ tự nói = thứ tự làm; bắt từ **まず** (trước hết), **それから** (sau đó). Không có đáp án ở đây — luyện ở **Luyện nghe · Bài 3**.',
        'Giải thích việc mình thích: **まず、Vて、Vて、それから、Vます** — {牛肉|ぎゅうにく}, {野菜|やさい}, {麺|めん} (sợi mì — từ thêm), {説明|せつめい} (giải thích — từ thêm).',
      ],
      [
        mau([
          E('どうやって{美術館|びじゅつかん}へ{行|い}きますか。— {3番|さんばん}のバスに{乗|の}って、ほしので{降|お}ります。', 'Dou yatte bijutsukan e ikimasu ka. — Sanban no basu ni notte, Hoshino de orimasu.', '2 ① — bảo tàng.'),
          E('どうやって{図書館|としょかん}のカードを{作|つく}りますか。— {受付|うけつけ}で{名前|なまえ}と{住所|じゅうしょ}と{電話番号|でんわばんごう}を{書|か}いて、{外国人登録証|がいこくじんとうろくしょう}を{見|み}せます。', 'Dou yatte toshokan no kaado o tsukurimasu ka. — Uketsuke de namae to juusho to denwa bangou o kaite, gaikokujin tourokushou o misemasu.', '2 ② — thẻ thư viện.'),
          E('どうやって{交流会|こうりゅうかい}に{申|もう}し{込|こ}みますか。— {電話|でんわ}して、{名前|なまえ}と{住所|じゅうしょ}を{言|い}います。', 'Dou yatte kouryuukai ni moushikomimasu ka. — Denwa shite, namae to juusho o iimasu.', '2 ③ — buổi giao lưu.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 166 · できる! — Kết bạn mới ở buổi giao lưu',
      'Nhiệm vụ tổng hợp: tham gia một sự kiện giao lưu và kết bạn mới. **Trong lớp:** (1) viết sở thích của mình lên một tấm thẻ; (2) xem thẻ của mọi người, chọn người mình muốn nghe chuyện, ghép cặp; (3) hỏi thật nhiều — **loại nào (どんな)**, **làm thế nào (どうやって)**, **cách làm cho giỏi**. Cô đi quanh lớp, đọc thẻ của bạn và hỏi tiếp.',
      [
        C('ミンさんのカードを{見|み}ました。{趣味|しゅみ}はサッカーですね。', 'Min-san no kaado o mimashita. Shumi wa sakkaa desu ne.', 'Cô xem thẻ của Minh rồi. Sở thích là bóng đá nhỉ.'),
        S('はい。{特|とく}に、サッカーの{試合|しあい}を{見|み}ることが{好|す}きです。', 'Hai. Toku ni, sakkaa no shiai o miru koto ga suki desu.', 'Vâng. Đặc biệt em thích xem trận bóng đá.'),
        C('どうやって{試合|しあい}を{見|み}ますか。', 'Dou yatte shiai o mimasu ka.', 'Em xem trận đấu bằng cách nào?'),
        S('インターネットでチケットを{買|か}って、{友達|ともだち}とスタジアムへ{行|い}きます。', 'Intaanetto de chiketto o katte, tomodachi to sutajiamu e ikimasu.', 'Em mua vé trên mạng rồi đi sân vận động với bạn.'),
        C('どうやってサッカーが{上手|じょうず}になりますか。', 'Dou yatte sakkaa ga jouzu ni narimasu ka.', 'Làm thế nào để đá bóng giỏi lên?'),
        S('{毎日|まいにち}{走|はし}って、{1週間|いっしゅうかん}に{3回|さんかい}{練習|れんしゅう}します。', 'Mainichi hashitte, isshuukan ni sankai renshuu shimasu.', 'Ngày nào cũng chạy, một tuần luyện tập 3 lần ạ.'),
      ],
      [
        'Câu **～ことが{好|す}きです** (thích việc…) cùng khuôn こと của ポイント 81 — dùng được khi nói chuyện; câu hỏi thi vẫn đáp **{趣味|しゅみ}は～ことです**.',
        '"Làm sao cho giỏi" — **{上手|じょうず}になります** là mẫu Bài 10 (なります); bây giờ chỉ cần nghe hiểu, trả lời bằng Vて、Vます là đủ.',
        'Từ thêm: スタジアム (sân vận động), {走|はし}ります (chạy), {練習|れんしゅう}します (luyện tập).',
        'Xem **Hội thoại · できる！— Thẻ sở thích ở buổi giao lưu** và **Luyện nói · Đóng vai**.',
      ],
    ),

    ...trang(
      'Trang 166 · 話読聞書「私の趣味」 — Viết về sở thích của bạn',
      'Ô 話読聞書 có đoạn ngắn khoảng 10 câu: người viết thích **xem nhạc kịch** (musical), khoảng một tháng đi xem một lần cùng bạn, đặc biệt thích một vở về **loài mèo** vì bài hát và điệu nhảy đều hay; người đó mua đĩa nhạc về nghe ở nhà, thỉnh thoảng hát theo — không hát giỏi được nhưng thấy dễ chịu; muốn đi xem nhiều vở ở Nhật. Bên lề có gợi ý câu hỏi: sở thích là gì, bao lâu một lần, với ai, đặc biệt thích gì. Nhiệm vụ: viết đoạn về sở thích **CỦA BẠN** theo cùng khung — **sở thích (こと) → bao lâu / với ai → đặc biệt → vì sao hay → làm được / không (でも) → mong muốn** — rồi đọc to.',
      [
        C('ミンさんの{趣味|しゅみ}の{話|はなし}を{読|よ}んでください。', 'Min-san no shumi no hanashi o yonde kudasai.', 'Minh đọc bài về sở thích của em đi.'),
        S('{私|わたし}の{趣味|しゅみ}は{音楽|おんがく}を{聞|き}くことです。{毎日|まいにち}、バスの{中|なか}で{1時間|いちじかん}くらい{聞|き}きます。{特|とく}に、{日本|にほん}のポップスが{好|す}きです。{歌|うた}がきれいで、{楽|たの}しいです。{私|わたし}はときどき{日本|にほん}の{歌|うた}を{歌|うた}います。でも、{上手|じょうず}に{歌|うた}うことができません。いつか{日本|にほん}でコンサートに{行|い}きたいです。', 'Watashi no shumi wa ongaku o kiku koto desu. Mainichi, basu no naka de ichijikan kurai kikimasu. Toku ni, Nihon no poppusu ga suki desu. Uta ga kirei de, tanoshii desu. Watashi wa tokidoki Nihon no uta o utaimasu. Demo, jouzu ni utau koto ga dekimasen. Itsuka Nihon de konsaato ni ikitai desu.', 'Sở thích của em là nghe nhạc. Hằng ngày em nghe khoảng 1 tiếng trên xe buýt. Đặc biệt em thích nhạc pop Nhật. Bài hát hay và vui. Thỉnh thoảng em hát bài hát Nhật. Nhưng em không hát hay được. Một ngày nào đó em muốn đi xem hoà nhạc ở Nhật.'),
        C('どのくらい{聞|き}きますか。', 'Dono kurai kikimasu ka.', 'Em nghe bao lâu?'),
        S('{毎日|まいにち}、{1時間|いちじかん}くらい{聞|き}きます。', 'Mainichi, ichijikan kurai kikimasu.', 'Hằng ngày khoảng 1 tiếng ạ.'),
      ],
      [
        'Đoạn này dùng gần đủ ポイント Bài 9: **こと (81) · ことができません (82) · tần suất (84, 85) · でも (87)** — đọc trôi là ôn được cả bài.',
        'Nối hai tính từ: {歌|うた}が**きれいで**、{楽|たの}しいです (ナA + で — Bài 8).',
        'Xem **Hội thoại · ④ Nói–Đọc–Nghe–Viết** và **Chữ Hán · Đọc to cả đoạn**.',
      ],
    ),

    { t: 'h', text: 'Trang 167 · ことば — Từ vựng của bài' },
    {
      t: 'p',
      text: 'Trang liệt kê từ mới theo 3 chủ đề: (1) いろいろな趣味 — phim hành động, bánh kẹo, tem, nhạc cổ điển, nhạc pop, tiểu thuyết, truyện tranh, câu cá, phim bộ, bể bơi, dạo này, các đơn vị ～日・～週間・～か月・～年・～回・～冊・～杯・～本, ～料理, bơi, vẽ, sưu tầm, lái xe, 特に, いつも, よく, ときどき, あまり, 全然, でも, だけ; (2) できること・できないこと — sự kiện, cuộc thi, thư pháp, lặn biển, nhảy, ～クラブ, ～教室, học (có thầy), lên xe, vào, đăng ký, làm được, tham gia, すごい, いろいろ(な), 上手に; (3) 楽しい週末 — quầy tiếp tân, thẻ, thẻ đăng ký người nước ngoài, địa chỉ, bài tập về nhà, số điện thoại, ～番, nói, trả tiền, xuống xe, cho xem, đặt trước, どうやって. Không có tranh. Đủ nghĩa, romaji, thể từ điển, ví dụ: xem mục **Từ vựng** của Bài 9.',
    },
    { t: 'note', title: 'Mẹo', items: ['Cô hay kiểm tra nhanh động từ mới bằng **thể từ điển**: cô đọc 泳ぎます → bạn nói 泳ぐ; 降ります → 降りる; 入ります → 入る — ôn ở **Ngữ pháp · Thể từ điển** và **Bài tập · Đổi sang thể từ điển**.', 'Xem **Từ vựng · Bài 9** và **Chữ Hán · Bài 9**.'] },

    ...trang(
      'Trang 168 · もう一度聞こう — Nghe lại cả bài',
      'Nghe lại đoạn ở trang 153: ở **buổi giao lưu**, 木村 và パク mới quen. パク là học sinh trường tiếng Nhật — học hơi khó nhưng vui vì nói chuyện với bạn nhiều nước. Sở thích của パク là **xem phim**, đặc biệt **phim hành động**, khoảng **1 tuần 2, 3 lần** mượn đĩa về xem; hai người nói về một bộ phim vừa xem. Sở thích của 木村 là **nấu món ăn của nhiều nước**, **1 tháng 2 lần** đi lớp nấu ăn. パク muốn đi cùng vì chưa nấu giỏi; 木村 rủ tháng sau đi (tháng sau nấu món Nhật) và chỉ cách đăng ký: **gọi vào số điện thoại rồi nói tên và địa chỉ**. Cụm mới: クラスメイト (bạn cùng lớp), {楽|たの}しみです (mong chờ quá). Cô sẽ hỏi lại các chi tiết.',
      [
        C('パクさんの{趣味|しゅみ}は{何|なん}ですか。', 'Paku-san no shumi wa nan desu ka.', 'Sở thích của Park là gì?'),
        S('{映画|えいが}を{見|み}ることです。{特|とく}に、アクション{映画|えいが}が{好|す}きです。', 'Eiga o miru koto desu. Toku ni, akushon eiga ga suki desu.', 'Là xem phim. Đặc biệt thích phim hành động.'),
        C('どのくらい{映画|えいが}を{見|み}ますか。', 'Dono kurai eiga o mimasu ka.', 'Park xem phim bao lâu một lần?'),
        S('{1週間|いっしゅうかん}に{2|に}、{3回|さんかい}{見|み}ます。', 'Isshuukan ni ni, sankai mimasu.', 'Một tuần 2, 3 lần.'),
        C('{木村|きむら}さんの{趣味|しゅみ}は{何|なん}ですか。', 'Kimura-san no shumi wa nan desu ka.', 'Sở thích của Kimura là gì?'),
        S('いろいろな{国|くに}の{料理|りょうり}を{作|つく}ることです。', 'Iroiro na kuni no ryouri o tsukuru koto desu.', 'Là nấu món ăn của nhiều nước.'),
        C('{木村|きむら}さんは{1か月|いっかげつ}に{何回|なんかい}{料理|りょうり}{教室|きょうしつ}に{行|い}きますか。', 'Kimura-san wa ikkagetsu ni nankai ryouri kyoushitsu ni ikimasu ka.', 'Một tháng Kimura đi lớp nấu ăn mấy lần?'),
        S('{2回|にかい}{行|い}きます。', 'Nikai ikimasu.', 'Đi 2 lần.'),
        C('どうやって{料理|りょうり}{教室|きょうしつ}に{申|もう}し{込|こ}みますか。', 'Dou yatte ryouri kyoushitsu ni moushikomimasu ka.', 'Đăng ký lớp nấu ăn thế nào?'),
        S('{電話|でんわ}して、{名前|なまえ}と{住所|じゅうしょ}を{言|い}います。', 'Denwa shite, namae to juusho o iimasu.', 'Gọi điện rồi nói tên và địa chỉ.'),
      ],
      [
        'Câu hỏi về người khác ⇒ trả lời ngôi thứ ba, vẫn đủ khung: **～ことです** · **～に～{回|かい}** · **Vて、Vます**.',
        '**{楽|たの}しみです** = mong chờ quá — câu kết sau khi nhận lời rủ (Bài 6 đã gặp).',
        'Xem **Luyện nghe · Bài 4 — Hội thoại dài: ở buổi giao lưu** (bài nghe viết mới, cùng tình huống).',
      ],
    ),

    { t: 'h', text: 'Cô hỏi — bạn trả lời: ghép nhanh câu trả lời' },
    {
      t: 'build',
      id: 'b9-sach-ghep',
      title: 'Nghe câu hỏi (tiếng Việt) → ghép câu trả lời tiếng Nhật',
      items: [
        { vi: 'Cô hỏi 趣味は何ですか → "Sở thích của em là đọc sách."', chips: ['{私|わたし}の', '{趣味|しゅみ}は', '{本|ほん}を', '{読|よ}む', 'ことです。', '{読|よ}みます', 'が'], answer: ['{私|わたし}の', '{趣味|しゅみ}は', '{本|ほん}を', '{読|よ}む', 'ことです。'], ro: 'Watashi no shumi wa hon o yomu koto desu.' },
        { vi: 'Cô hỏi どんな音楽を聞きますか → "Đặc biệt em thích jazz."', chips: ['{特|とく}に、', 'ジャズが', '{好|す}きです。', 'ジャズを', 'だけ'], answer: ['{特|とく}に、', 'ジャズが', '{好|す}きです。'], ro: 'Toku ni, jazu ga suki desu.' },
        { vi: 'Cô hỏi よく映画を見ますか → "Có ạ, khoảng 1 tuần 2 lần."', chips: ['はい、', '{1週間|いっしゅうかん}に', '{2回|にかい}くらい', '{見|み}ます。', '{1週間|いっしゅうかん}で', '{2本|にほん}'], answer: ['はい、', '{1週間|いっしゅうかん}に', '{2回|にかい}くらい', '{見|み}ます。'], ro: 'Hai, isshuukan ni nikai kurai mimasu.' },
        { vi: 'Cô hỏi よく料理をしますか → "Không ạ, em không nấu mấy."', chips: ['いいえ、', 'あまり', 'しません。', 'します。', 'よく'], answer: ['いいえ、', 'あまり', 'しません。'], ro: 'Iie, amari shimasen.' },
        { vi: 'Cô hỏi スキーができますか → "Không ạ, em không trượt được."', chips: ['いいえ、', 'できません。', 'しません。', 'ありません。'], answer: ['いいえ、', 'できません。'], ro: 'Iie, dekimasen.' },
        { vi: '"Vì em không nấu món Nhật được nên muốn học."', chips: ['{日本|にほん}{料理|りょうり}を', '{作|つく}る', 'ことが', 'できませんから、', '{習|なら}いたいです。', '{作|つく}ります'], answer: ['{日本|にほん}{料理|りょうり}を', '{作|つく}る', 'ことが', 'できませんから、', '{習|なら}いたいです。'], ro: 'Nihon ryouri o tsukuru koto ga dekimasen kara, naraitai desu.' },
        { vi: 'Cô hỏi 週末、何をしましたか → "Em xem phim rồi đi mua sắm."', chips: ['{映画|えいが}を', '{見|み}て、', '{買|か}い{物|もの}を', 'しました。', '{見|み}ました、', 'します。'], answer: ['{映画|えいが}を', '{見|み}て、', '{買|か}い{物|もの}を', 'しました。'], ro: 'Eiga o mite, kaimono o shimashita.' },
        { vi: 'Cô hỏi どうやって美術館へ行きますか → "Lên xe buýt số 3, xuống ở Hoshino."', chips: ['{3番|さんばん}の', 'バスに', '{乗|の}って、', 'ほしので', '{降|お}ります。', 'バスを'], answer: ['{3番|さんばん}の', 'バスに', '{乗|の}って、', 'ほしので', '{降|お}ります。'], ro: 'Sanban no basu ni notte, Hoshino de orimasu.' },
        { vi: '"Sở thích là thể thao. Nhưng dạo này em hoàn toàn không chơi."', chips: ['{趣味|しゅみ}は', 'スポーツです。', 'でも、', '{最近|さいきん}、', '{全然|ぜんぜん}しません。', 'よくします。'], answer: ['{趣味|しゅみ}は', 'スポーツです。', 'でも、', '{最近|さいきん}、', '{全然|ぜんぜん}しません。'], ro: 'Shumi wa supootsu desu. Demo, saikin, zenzen shimasen.' },
      ],
    },
  ],
};
