/**
 * Bài 10 — バスツアー (Tour xe buýt) · できる日本語 初級 第10課, p.169–184 · JPD113/JPD123.
 *
 * Ngữ pháp: ポイント 88–97 (p.277–278): Vナイ形でください · Vテ形もいいですか ·
 * NがVテ形います · まだVテ形いません · Vテ形きます · {N／V辞書形こと}ができます ·
 * Nが見えます／聞こえます · イA‑いくなります／［ナA／N］になります · N(場所)をVます ·
 * Nは (đưa tân ngữ lên làm chủ đề) + bảng ナイ形 (表 p.283) và cột Vなります (表 p.282–283).
 * Từ vựng: đủ 70 mục của trang ことば p.183 (21 + 21 + 28) — từ Bài 8 trở đi cô không
 * phát danh sách riêng nên trang ことば của sách là chuẩn. Từ ở chân trang đọc/nghe
 * (イルミネーション, 浴衣, 芝生, 待ち合わせ…) nằm ở mục "Từ thêm".
 * Hội thoại, câu ví dụ, bài đọc, kịch bản nghe: VIẾT MỚI theo đúng tình huống của sách
 * (xem ../SOAN-BAI.md). Chỉ dùng lại tên nhân vật; tên quán, bảo tàng, sở thú là tự đặt.
 *
 * Nhân vật (giới tính quyết định giọng đọc, theo bai1.ts): nữ = パク, アンナ, ワン ·
 * nam = ダニエル, マルコ. Hội thoại: role 'a'/'c' = giọng nữ, 'b'/'examiner' = giọng nam.
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
  id: 'b10-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — バスツアー Tập hợp, xin phép, đi sở thú',
  goal: 'Gọi điện hỏi và chỉ đường tới điểm tập hợp, nói "chưa … / đi … rồi quay lại ngay", xin phép và nghe hiểu lời nhắc nơi công cộng, tả con vật đang làm gì, hỏi chỗ này làm được gì và rủ bạn theo tình hình.',
  minutes: 40,
  blocks: [
    {
      t: 'note',
      title: 'Học xong bài 10 bạn làm được (できる)',
      items: [
        '**① {集合|しゅうごう}** — lạc đường tới điểm tập hợp thì **gọi điện hỏi đường** ("từ đó bạn nhìn thấy gì?" → "qua cầu rồi rẽ trái"); nói được những câu ngắn trước giờ xuất phát: "chưa mua vé", "mình đi mua nước rồi quay lại ngay".',
        '**② いろいろな{注意|ちゅうい}** — **nghe hiểu lời nhắc** ở nơi công cộng (đừng đến muộn, đừng chụp ảnh, đừng đẩy người phía trước) và **xin phép** (tôi ngồi đây được không? để hành lý ở đây được không?).',
        '**③ {動物園|どうぶつえん}で** — **chỉ cho bạn thấy** con vật đang làm gì, **hỏi chỗ này có dịch vụ gì** (mua vé đu quay được không?), và **đề xuất việc làm tiếp** theo tình hình (trời lạnh rồi → vào quán uống cà phê nhé).',
        '**できる！** — cả nhóm lập kế hoạch một chuyến đi, viết kịch bản một ngày du lịch, luyện nói không nhìn giấy rồi diễn trước lớp.',
      ],
    },
    {
      t: 'table',
      caption: 'Bức tranh chung của bài — một ngày đi tour xe buýt',
      head: ['Lúc', 'Câu then chốt', 'Romaji', 'ポイント'],
      rows: [
        ['Trước giờ xe chạy', 'アンナさんはまだ{来|き}ていません。', 'Anna-san wa mada kite imasen.', '91'],
        ['Chạy đi mua đồ', 'ちょっとジュースを{買|か}ってきます。', 'Chotto juusu o katte kimasu.', '92'],
        ['Gọi điện chỉ đường', 'そこから{何|なに}が{見|み}えますか。——{橋|はし}を{渡|わた}って、{左|ひだり}に{曲|ま}がってください。', 'Soko kara nani ga miemasu ka. — Hashi o watatte, hidari ni magatte kudasai.', '94, 96'],
        ['Trên xe / ở bảo tàng', '{隣|となり}に{座|すわ}ってもいいですか。——{写真|しゃしん}を{撮|と}らないでください。', 'Tonari ni suwatte mo ii desu ka. — Shashin o toranaide kudasai.', '88, 89'],
        ['Xin phép bị từ chối', '{荷物|にもつ}はあそこに{置|お}いてください。', 'Nimotsu wa asoko ni oite kudasai.', '97'],
        ['Ở sở thú', 'あっ、サルがバナナを{食|た}べています。', 'A, saru ga banana o tabete imasu.', '90'],
        ['Hỏi dịch vụ', 'ここでボールを{借|か}りることができますか。', 'Koko de booru o kariru koto ga dekimasu ka.', '93'],
        ['Rủ theo tình hình', '{寒|さむ}くなりましたね。そろそろ{帰|かえ}りませんか。', 'Samuku narimashita ne. Sorosoro kaerimasen ka.', '95'],
      ],
    },

    /* ── ① 集合 ── */
    { t: 'h', text: '① {集合|しゅうごう} — Ở điểm tập hợp' },
    {
      t: 'p',
      text: 'Tình huống: sáng ngày đi tour xe buýt. Trưởng nhóm **điểm danh** trước xe. Có bạn **chưa đến**, có bạn chạy **đi mua đồ rồi quay lại**. Bạn đến muộn gọi điện vì **không biết đường** — người trên xe hỏi "từ chỗ bạn nhìn thấy gì?" rồi chỉ đường.',
    },
    {
      t: 'dialogue',
      title: 'Điểm danh trước xe buýt',
      lines: [
        { who: 'ダニエル', role: 'b', text: 'おはようございます。{皆|みな}さん、{集合|しゅうごう}しましたか。パクさん。', ro: 'Ohayou gozaimasu. Minasan, shuugou shimashita ka. Paku-san.', vi: 'Chào buổi sáng. Mọi người tập hợp đủ chưa? Park.' },
        { who: 'パク', role: 'a', text: 'はい。', ro: 'Hai.', vi: 'Có.' },
        { who: 'ダニエル', role: 'b', text: 'ワンさん。……ワンさん？', ro: 'Wan-san. …… Wan-san?', vi: 'Wang. …… Wang đâu?' },
        { who: 'パク', role: 'a', text: 'ワンさんはまだ{来|き}ていません。', ro: 'Wan-san wa mada kite imasen.', vi: 'Wang vẫn chưa đến.' },
        { who: 'ダニエル', role: 'b', text: 'そうですか。もうすぐ{9時|くじ}ですね。', ro: 'Sou desu ka. Mou sugu kuji desu ne.', vi: 'Vậy à. Sắp 9 giờ rồi nhỉ.' },
        { who: 'パク', role: 'a', text: 'じゃ、{私|わたし}、ワンさんに{電話|でんわ}をかけます。', ro: 'Ja, watashi, Wan-san ni denwa o kakemasu.', vi: 'Vậy để mình gọi điện cho Wang.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Chạy đi mua đồ rồi quay lại',
      lines: [
        { who: 'アンナ', role: 'c', text: 'パクさん、もうお{弁当|べんとう}を{買|か}いましたか。', ro: 'Paku-san, mou obentou o kaimashita ka.', vi: 'Park, cậu mua cơm hộp chưa?' },
        { who: 'パク', role: 'a', text: 'いいえ、まだ{買|か}っていません。', ro: 'Iie, mada katte imasen.', vi: 'Chưa, mình chưa mua.' },
        { who: 'アンナ', role: 'c', text: 'あそこのコンビニで{売|う}っていますよ。', ro: 'Asoko no konbini de utte imasu yo.', vi: 'Cửa hàng tiện lợi đằng kia có bán đấy.' },
        { who: 'パク', role: 'a', text: 'じゃ、ちょっと{買|か}ってきます。{荷物|にもつ}をお{願|ねが}いします。', ro: 'Ja, chotto katte kimasu. Nimotsu o onegai shimasu.', vi: 'Vậy mình đi mua một chút rồi quay lại. Nhờ cậu trông hành lý.' },
        { who: 'アンナ', role: 'c', text: 'はい。{薬|くすり}はもう{飲|の}みましたか。バスは{長|なが}いですよ。', ro: 'Hai. Kusuri wa mou nomimashita ka. Basu wa nagai desu yo.', vi: 'Ừ. Cậu uống thuốc (say xe) chưa? Đi xe buýt lâu lắm đấy.' },
        { who: 'パク', role: 'a', text: 'あ、まだ{飲|の}んでいません。{水|みず}も{買|か}ってきます。', ro: 'A, mada nonde imasen. Mizu mo katte kimasu.', vi: 'A, mình chưa uống. Mình mua cả nước rồi quay lại.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Gọi điện chỉ đường — "từ đó bạn thấy gì?"',
      lines: [
        { who: 'パク', role: 'a', text: 'もしもし、ワンさん？{今|いま}、どこにいますか。', ro: 'Moshi moshi, Wan-san? Ima, doko ni imasu ka.', vi: 'Alô, Wang à? Giờ cậu đang ở đâu?' },
        { who: 'ワン', role: 'c', text: 'え？{車|くるま}の{音|おと}が{大|おお}きいです。よく{聞|き}こえません。', ro: 'E? Kuruma no oto ga ookii desu. Yoku kikoemasen.', vi: 'Hả? Tiếng xe to quá. Mình nghe không rõ.' },
        { who: 'パク', role: 'a', text: '{今|いま}、どこにいますか。', ro: 'Ima, doko ni imasu ka.', vi: 'Giờ — cậu — đang — ở — đâu?' },
        { who: 'ワン', role: 'c', text: 'ああ、よくわかりません。{駅|えき}を{出|で}ました。でも、バスがありません。', ro: 'Aa, yoku wakarimasen. Eki o demashita. Demo, basu ga arimasen.', vi: 'Ờ, mình không rõ lắm. Mình ra khỏi ga rồi. Nhưng không thấy xe buýt.' },
        { who: 'パク', role: 'a', text: 'そこから{何|なに}が{見|み}えますか。', ro: 'Soko kara nani ga miemasu ka.', vi: 'Từ chỗ cậu nhìn thấy cái gì?' },
        { who: 'ワン', role: 'c', text: 'ええと……{大|おお}きい{橋|はし}が{見|み}えます。', ro: 'Eeto…… ookii hashi ga miemasu.', vi: 'Ờ… mình thấy một cây cầu lớn.' },
        { who: 'パク', role: 'a', text: 'じゃ、その{橋|はし}を{渡|わた}ってください。{渡|わた}って、{2|ふた}つ{目|め}の{信号|しんごう}を{右|みぎ}に{曲|ま}がってください。', ro: 'Ja, sono hashi o watatte kudasai. Watatte, futatsume no shingou o migi ni magatte kudasai.', vi: 'Vậy cậu qua cây cầu đó đi. Qua cầu rồi đến đèn giao thông thứ hai thì rẽ phải.' },
        { who: 'ワン', role: 'c', text: '{2|ふた}つ{目|め}の{信号|しんごう}を{右|みぎ}ですね。', ro: 'Futatsume no shingou o migi desu ne.', vi: 'Đèn thứ hai rẽ phải nhỉ.' },
        { who: 'パク', role: 'a', text: 'はい。それから、{道|みち}をまっすぐ{行|い}ってください。{銀行|ぎんこう}の{角|かど}にバスがありますよ。', ro: 'Hai. Sorekara, michi o massugu itte kudasai. Ginkou no kado ni basu ga arimasu yo.', vi: 'Ừ. Sau đó cứ đi thẳng đường. Xe buýt ở góc ngân hàng đấy.' },
        { who: 'ワン', role: 'c', text: 'わかりました。すみません、すぐ{行|い}きます。', ro: 'Wakarimashita. Sumimasen, sugu ikimasu.', vi: 'Mình hiểu rồi. Xin lỗi nhé, mình tới ngay.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'もうチケットを{買|か}いましたか。——いいえ、まだ{買|か}っていません。', ro: 'Mou chiketto o kaimashita ka. — Iie, mada katte imasen.', vi: 'Bạn mua vé chưa? — Chưa, tôi chưa mua. — ポイント 91' },
        { en: 'ちょっとトイレに{行|い}ってきます。', ro: 'Chotto toire ni itte kimasu.', vi: 'Tôi đi vệ sinh một chút rồi quay lại. — ポイント 92' },
        { en: 'そこから{何|なに}が{見|み}えますか。——{高|たか}いビルが{見|み}えます。', ro: 'Soko kara nani ga miemasu ka. — Takai biru ga miemasu.', vi: 'Từ đó bạn nhìn thấy gì? — Tôi thấy toà nhà cao. — ポイント 94' },
        { en: 'よく{聞|き}こえません。', ro: 'Yoku kikoemasen.', vi: 'Tôi nghe không rõ. (điện thoại rè, chỗ ồn) — ポイント 94' },
        { en: 'その{橋|はし}を{渡|わた}って、{左|ひだり}に{曲|ま}がってください。', ro: 'Sono hashi o watatte, hidari ni magatte kudasai.', vi: 'Qua cây cầu đó rồi rẽ trái. — ポイント 96' },
        { en: '{2|ふた}つ{目|め}の{交差点|こうさてん}を{右|みぎ}に{曲|ま}がってください。', ro: 'Futatsume no kousaten o migi ni magatte kudasai.', vi: 'Đến ngã tư thứ hai thì rẽ phải.' },
        { en: 'ええと……。／よくわかりません。', ro: 'Eeto……. / Yoku wakarimasen.', vi: 'Ờ… (đang nghĩ) / Tôi không rõ lắm.' },
      ],
    },

    /* ── ② いろいろな注意 ── */
    { t: 'h', text: '② いろいろな{注意|ちゅうい} — Lời nhắc và xin phép' },
    {
      t: 'p',
      text: 'Tình huống: trên xe buýt đi **bảo tàng mỹ thuật** ({美術館|びじゅつかん}). Hướng dẫn viên nhắc cả đoàn những điều **không được làm** (～ないでください). Hành khách **xin phép** (～てもいいですか): ngồi cạnh, mở cửa sổ, để hành lý, chụp ảnh. Khi bị từ chối, người ta hay chỉ chỗ khác: "hành lý **thì** để đằng kia" (Nは).',
    },
    {
      t: 'dialogue',
      title: 'Trên xe buýt — xin ngồi, xin mở cửa sổ',
      lines: [
        { who: 'アンナ', role: 'c', text: 'すみません。{隣|となり}に{座|すわ}ってもいいですか。', ro: 'Sumimasen. Tonari ni suwatte mo ii desu ka.', vi: 'Xin lỗi. Tôi ngồi bên cạnh được không?' },
        { who: 'マルコ', role: 'b', text: 'はい、どうぞ。', ro: 'Hai, douzo.', vi: 'Vâng, mời bạn.' },
        { who: 'アンナ', role: 'c', text: 'ちょっと{暑|あつ}いですね。{窓|まど}を{開|あ}けてもいいですか。', ro: 'Chotto atsui desu ne. Mado o akete mo ii desu ka.', vi: 'Hơi nóng nhỉ. Tôi mở cửa sổ được không?' },
        { who: 'マルコ', role: 'b', text: 'すみません。{私|わたし}は{少|すこ}し{寒|さむ}いですから……。', ro: 'Sumimasen. Watashi wa sukoshi samui desu kara…….', vi: 'Xin lỗi. Vì tôi thấy hơi lạnh…' },
        { who: 'アンナ', role: 'c', text: 'あ、そうですか。じゃ、カーテンを{開|あ}けてもいいですか。', ro: 'A, sou desu ka. Ja, kaaten o akete mo ii desu ka.', vi: 'À, vậy à. Thế tôi kéo rèm ra được không?' },
        { who: 'マルコ', role: 'b', text: 'ええ、いいですよ。', ro: 'Ee, ii desu yo.', vi: 'Ừ, được chứ.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hướng dẫn viên nhắc cả đoàn',
      lines: [
        { who: 'ダニエル', role: 'b', text: '{皆|みな}さん、{今|いま}から{美術館|びじゅつかん}へ{行|い}きます。{集合|しゅうごう}は{12時|じゅうにじ}です。{集合時間|しゅうごうじかん}に{遅|おく}れないでください。', ro: 'Minasan, ima kara bijutsukan e ikimasu. Shuugou wa juuniji desu. Shuugou jikan ni okurenaide kudasai.', vi: 'Mọi người ơi, bây giờ chúng ta đến bảo tàng mỹ thuật. Tập hợp lúc 12 giờ. Đừng đến trễ giờ tập hợp nhé.' },
        { who: 'パク', role: 'a', text: 'はい、わかりました。', ro: 'Hai, wakarimashita.', vi: 'Vâng, chúng tôi hiểu rồi.' },
        { who: 'ダニエル', role: 'b', text: 'このチケットは{大切|たいせつ}です。なくさないでください。それから、{美術館|びじゅつかん}の{中|なか}で{大|おお}きい{声|こえ}で{話|はな}さないでください。{他|ほか}のお{客|きゃく}さんに{迷惑|めいわく}ですから。', ro: 'Kono chiketto wa taisetsu desu. Nakusanaide kudasai. Sorekara, bijutsukan no naka de ookii koe de hanasanaide kudasai. Hoka no okyakusan ni meiwaku desu kara.', vi: 'Vé này quan trọng. Đừng làm mất. Ngoài ra, trong bảo tàng đừng nói chuyện to. Vì làm phiền những khách khác.' },
        { who: 'アンナ', role: 'c', text: 'パンフレットはどこでもらいますか。', ro: 'Panfuretto wa doko de moraimasu ka.', vi: 'Tờ giới thiệu thì nhận ở đâu ạ?' },
        { who: 'ダニエル', role: 'b', text: '{入|い}り{口|ぐち}にありますよ。じゃ、{降|お}りましょう。{危|あぶ}ないですから、{前|まえ}の{人|ひと}を{押|お}さないでくださいね。', ro: 'Iriguchi ni arimasu yo. Ja, orimashou. Abunai desu kara, mae no hito o osanaide kudasai ne.', vi: 'Ở lối vào có đấy. Nào, xuống xe thôi. Nguy hiểm nên đừng đẩy người phía trước nhé.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Ở bảo tàng — xin phép và được chỉ chỗ khác',
      lines: [
        { who: 'パク', role: 'a', text: 'すみません。ここに{荷物|にもつ}を{置|お}いてもいいですか。', ro: 'Sumimasen. Koko ni nimotsu o oite mo ii desu ka.', vi: 'Xin lỗi. Tôi để hành lý ở đây được không?' },
        { who: '{美術館|びじゅつかん}の{人|ひと}', role: 'b', text: 'すみません。{荷物|にもつ}はあそこのロッカーに{入|い}れてください。', ro: 'Sumimasen. Nimotsu wa asoko no rokkaa ni irete kudasai.', vi: 'Xin lỗi. Hành lý thì chị cho vào tủ khoá đằng kia.' },
        { who: 'パク', role: 'a', text: 'わかりました。あのう、{中|なか}で{写真|しゃしん}を{撮|と}ってもいいですか。', ro: 'Wakarimashita. Anou, naka de shashin o totte mo ii desu ka.', vi: 'Tôi hiểu rồi. À, bên trong chụp ảnh được không?' },
        { who: '{美術館|びじゅつかん}の{人|ひと}', role: 'b', text: 'すみません、{写真|しゃしん}はちょっと……。{外|そと}で{撮|と}ってください。', ro: 'Sumimasen, shashin wa chotto……. Soto de totte kudasai.', vi: 'Xin lỗi, chụp ảnh thì không được… Chị chụp ở bên ngoài nhé.' },
        { who: 'マルコ', role: 'b', text: '（{外|そと}で）あ、ここでたばこを{吸|す}ってもいいですか。', ro: '(Soto de) A, koko de tabako o sutte mo ii desu ka.', vi: '(Ở ngoài) À, ở đây hút thuốc được không?' },
        { who: 'パク', role: 'a', text: 'マルコさん、ここで{吸|す}わないでください。たばこはあそこの{喫煙所|きつえんじょ}で{吸|す}ってください。', ro: 'Maruko-san, koko de suwanaide kudasai. Tabako wa asoko no kitsuenjo de sutte kudasai.', vi: 'Marco, đừng hút ở đây. Thuốc lá thì hút ở khu hút thuốc đằng kia.' },
        { who: 'マルコ', role: 'b', text: 'あ、すみません。', ro: 'A, sumimasen.', vi: 'Ôi, xin lỗi.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{隣|となり}に{座|すわ}ってもいいですか。——はい、どうぞ。', ro: 'Tonari ni suwatte mo ii desu ka. — Hai, douzo.', vi: 'Tôi ngồi cạnh được không? — Vâng, mời. — ポイント 89' },
        { en: '{窓|まど}を{開|あ}けてもいいですか。——すみません。ちょっと……。', ro: 'Mado o akete mo ii desu ka. — Sumimasen. Chotto…….', vi: 'Mở cửa sổ được không? — Xin lỗi, hơi… (từ chối khéo) — ポイント 89' },
        { en: '{集合時間|しゅうごうじかん}に{遅|おく}れないでください。', ro: 'Shuugou jikan ni okurenaide kudasai.', vi: 'Đừng đến trễ giờ tập hợp. — ポイント 88' },
        { en: '{危|あぶ}ないですから、{押|お}さないでください。', ro: 'Abunai desu kara, osanaide kudasai.', vi: 'Nguy hiểm nên đừng đẩy. — lý do ～から + ～ないでください.' },
        { en: '{荷物|にもつ}はあそこに{置|お}いてください。', ro: 'Nimotsu wa asoko ni oite kudasai.', vi: 'Hành lý thì để đằng kia. — ポイント 97 (を → は)' },
        { en: 'あ、すみません。／はい、わかりました。', ro: 'A, sumimasen. / Hai, wakarimashita.', vi: 'Ôi, xin lỗi. (bị nhắc) / Vâng, tôi hiểu rồi. (nghe dặn)' },
      ],
    },

    /* ── ③ 動物園で ── */
    { t: 'h', text: '③ {動物園|どうぶつえん}で — Ở sở thú' },
    {
      t: 'p',
      text: 'Tình huống: buổi chiều cả nhóm vào **sở thú**. Thấy con vật đang làm gì thì **chỉ cho bạn xem** (NがVています). Hỏi nhân viên **ở đây làm được gì** (～ことができますか). Khi trời tối, lạnh, đói, mệt — **đề xuất** việc làm tiếp (～くなりました → ～ませんか).',
    },
    {
      t: 'dialogue',
      title: 'Nhìn kìa!',
      lines: [
        { who: 'アンナ', role: 'c', text: 'あっ、{見|み}てください。サルがバナナを{食|た}べています。', ro: 'A, mite kudasai. Saru ga banana o tabete imasu.', vi: 'A, nhìn kìa. Con khỉ đang ăn chuối.' },
        { who: 'パク', role: 'a', text: '{本当|ほんとう}だ。かわいいですね。あ、{子|こ}どものサルもいますよ。', ro: 'Hontou da. Kawaii desu ne. A, kodomo no saru mo imasu yo.', vi: 'Thật này. Dễ thương nhỉ. A, có cả khỉ con nữa kìa.' },
        { who: 'アンナ', role: 'c', text: 'あそこでゾウが{水|みず}を{飲|の}んでいます。{大|おお}きいですね。', ro: 'Asoko de zou ga mizu o nonde imasu. Ookii desu ne.', vi: 'Đằng kia con voi đang uống nước. To ghê.' },
        { who: 'パク', role: 'a', text: '{鳥|とり}の{声|こえ}が{聞|き}こえますね。……あ、{上|うえ}を{飛|と}んでいます。', ro: 'Tori no koe ga kikoemasu ne. …… A, ue o tonde imasu.', vi: 'Nghe thấy tiếng chim nhỉ. … A, nó đang bay ở trên kìa.' },
        { who: 'アンナ', role: 'c', text: 'ペンギンはどこですか。', ro: 'Pengin wa doko desu ka.', vi: 'Chim cánh cụt ở đâu nhỉ?' },
        { who: 'パク', role: 'a', text: '{出口|でぐち}の{近|ちか}くですよ。{地図|ちず}にあります。', ro: 'Deguchi no chikaku desu yo. Chizu ni arimasu.', vi: 'Gần lối ra đấy. Trên bản đồ có.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Ở đây làm được gì? — hỏi nhân viên',
      lines: [
        { who: 'パク', role: 'a', text: 'あのう、ここで{観覧車|かんらんしゃ}のチケットを{買|か}うことができますか。', ro: 'Anou, koko de kanransha no chiketto o kau koto ga dekimasu ka.', vi: 'Dạ, ở đây mua được vé đu quay không ạ?' },
        { who: '{動物園|どうぶつえん}の{人|ひと}', role: 'b', text: 'はい、できますよ。', ro: 'Hai, dekimasu yo.', vi: 'Vâng, được ạ.' },
        { who: 'パク', role: 'a', text: 'じゃ、{2枚|にまい}ください。それから、ボールを{借|か}りることができますか。', ro: 'Ja, nimai kudasai. Sorekara, booru o kariru koto ga dekimasu ka.', vi: 'Vậy cho tôi 2 vé. Còn nữa, ở đây mượn được bóng không ạ?' },
        { who: '{動物園|どうぶつえん}の{人|ひと}', role: 'b', text: 'すみません、ボールはあちらの{受付|うけつけ}で{借|か}りてください。', ro: 'Sumimasen, booru wa achira no uketsuke de karite kudasai.', vi: 'Xin lỗi, bóng thì chị mượn ở quầy lễ tân đằng kia ạ.' },
        { who: 'アンナ', role: 'c', text: 'お{土産|みやげ}を{買|か}いたいです。', ro: 'Omiyage o kaitai desu.', vi: 'Mình muốn mua quà lưu niệm.' },
        { who: 'パク', role: 'a', text: 'あ、{入|い}り{口|ぐち}の{店|みせ}で{買|か}うことができますよ。', ro: 'A, iriguchi no mise de kau koto ga dekimasu yo.', vi: 'À, mua được ở cửa hàng chỗ lối vào đấy.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Trời tối rồi — đề xuất việc tiếp theo',
      lines: [
        { who: 'ダニエル', role: 'b', text: 'たくさん{歩|ある}きましたね。{疲|つか}れました。', ro: 'Takusan arukimashita ne. Tsukaremashita.', vi: 'Đi bộ nhiều ghê. Mệt quá.' },
        { who: 'アンナ', role: 'c', text: '{私|わたし}も{足|あし}が{痛|いた}いです。あそこのベンチで{休|やす}みましょう。', ro: 'Watashi mo ashi ga itai desu. Asoko no benchi de yasumimashou.', vi: 'Mình cũng đau chân. Nghỉ ở cái ghế dài đằng kia đi.' },
        { who: 'ダニエル', role: 'b', text: 'ああ、{寒|さむ}くなりましたね。', ro: 'Aa, samuku narimashita ne.', vi: 'Ồ, trời lạnh rồi nhỉ.' },
        { who: 'アンナ', role: 'c', text: 'そうですね。{暗|くら}くなりましたね。もうすぐ{5時|ごじ}になります。', ro: 'Sou desu ne. Kuraku narimashita ne. Mou sugu goji ni narimasu.', vi: 'Ừ nhỉ. Trời tối rồi. Sắp 5 giờ rồi.' },
        { who: 'ダニエル', role: 'b', text: 'おなかもすきました。そろそろバスへ{帰|かえ}りませんか。', ro: 'Onaka mo sukimashita. Sorosoro basu e kaerimasen ka.', vi: 'Bụng cũng đói rồi. Mình về xe buýt thôi chứ?' },
        { who: 'アンナ', role: 'c', text: 'そうしましょう。', ro: 'Sou shimashou.', vi: 'Làm vậy đi.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'あっ、コアラがえさを{食|た}べています。——{本当|ほんとう}だ。', ro: 'A, koara ga esa o tabete imasu. — Hontou da.', vi: 'A, con koala đang ăn mồi. — Thật này! — ポイント 90' },
        { en: 'ここで{切手|きって}を{買|か}うことができますか。——はい、できます。', ro: 'Koko de kitte o kau koto ga dekimasu ka. — Hai, dekimasu.', vi: 'Ở đây mua tem được không? — Vâng, được. — ポイント 93' },
        { en: 'あそこで{食事|しょくじ}ができますよ。', ro: 'Asoko de shokuji ga dekimasu yo.', vi: 'Ở đằng kia có thể ăn uống đấy. — N ができます (ポイント 93)' },
        { en: '{寒|さむ}くなりましたね。——そうですね。', ro: 'Samuku narimashita ne. — Sou desu ne.', vi: 'Lạnh rồi nhỉ. — Ừ nhỉ. — ポイント 95' },
        { en: 'もうすぐ{12時|じゅうにじ}になります。', ro: 'Mou sugu juuniji ni narimasu.', vi: 'Sắp 12 giờ rồi. — N になります (ポイント 95)' },
        { en: 'そろそろ{帰|かえ}りませんか。／そろそろ{昼|ひる}ご{飯|はん}を{食|た}べましょう。', ro: 'Sorosoro kaerimasen ka. / Sorosoro hirugohan o tabemashou.', vi: 'Sắp đến lúc về rồi, về thôi chứ? / Đến giờ ăn trưa thôi.' },
      ],
    },

    /* ── 話読聞書 ── */
    { t: 'h', text: '④ Nói–Đọc–Nghe–Viết (話読聞書) — {好|す}きなところ (Nơi tôi thích)' },
    {
      t: 'p',
      text: 'Bài đọc mẫu (viết mới, cùng kiểu với sách): パク giới thiệu một nơi cô thích — ở đó **có gì**, **làm được gì** (～ことができます), **nhìn thấy gì** (～が{見|み}えます) — rồi khuyên người đọc đi thử. Đọc to, rồi viết đoạn của bạn theo khung bên dưới.',
    },
    {
      t: 'passage',
      title: '{横浜|よこはま}のみなとみらい',
      paras: [
        { text: '{私|わたし}は{横浜|よこはま}のみなとみらいが{好|す}きです。みなとみらいに{観覧車|かんらんしゃ}やショッピングモールや{美術館|びじゅつかん}などがあります。{観覧車|かんらんしゃ}は{1人|ひとり}{900円|きゅうひゃくえん}です。{観覧車|かんらんしゃ}から{海|うみ}や{橋|はし}が{見|み}えます。{天気|てんき}がいい{日|ひ}は{富士山|ふじさん}も{見|み}えます。ショッピングモールで{買|か}い{物|もの}や{食事|しょくじ}ができます。{夜|よる}、{暗|くら}くなりますから、イルミネーションがとてもきれいです。{横浜駅|よこはまえき}から{電車|でんしゃ}で{5分|ごふん}です。{皆|みな}さんもぜひ{行|い}ってください。' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{私|わたし}は{横浜|よこはま}のみなとみらいが{好|す}きです。', ro: 'Watashi wa Yokohama no Minatomirai ga suki desu.', vi: 'Tôi thích khu Minato Mirai ở Yokohama.' },
        { en: 'みなとみらいに{観覧車|かんらんしゃ}やショッピングモールや{美術館|びじゅつかん}などがあります。', ro: 'Minatomirai ni kanransha ya shoppingu mooru ya bijutsukan nado ga arimasu.', vi: 'Ở Minato Mirai có đu quay, trung tâm mua sắm, bảo tàng mỹ thuật v.v. — N1 や N2 など (Bài 4).' },
        { en: '{観覧車|かんらんしゃ}から{海|うみ}や{橋|はし}が{見|み}えます。', ro: 'Kanransha kara umi ya hashi ga miemasu.', vi: 'Từ đu quay nhìn thấy biển và cây cầu. — ポイント 94' },
        { en: 'ショッピングモールで{買|か}い{物|もの}や{食事|しょくじ}ができます。', ro: 'Shoppingu mooru de kaimono ya shokuji ga dekimasu.', vi: 'Ở trung tâm mua sắm có thể mua sắm và ăn uống. — ポイント 93' },
        { en: '{夜|よる}、{暗|くら}くなりますから、イルミネーションがとてもきれいです。', ro: 'Yoru, kuraku narimasu kara, irumineeshon ga totemo kirei desu.', vi: 'Buổi tối trời tối nên đèn trang trí rất đẹp. — ポイント 95' },
        { en: '{皆|みな}さんもぜひ{行|い}ってください。', ro: 'Minasan mo zehi itte kudasai.', vi: 'Mọi người cũng nhất định hãy đi nhé.' },
      ],
    },
    {
      t: 'note',
      title: 'Viết đoạn "Nơi tôi thích" theo khung (trả lời 4 câu gợi ý của sách)',
      items: [
        '**{好|す}きなところを{教|おし}えてください** → {私|わたし}は ___ が{好|す}きです。',
        '**そこに{何|なに}がありますか** → ___ に ___ や ___ などがあります。',
        '**そこで{何|なに}ができますか** → ___ で ___ ができます。／___ を ___ ことができます。 Thêm: ___ から ___ が{見|み}えます。',
        '**どうやって{行|い}きますか** (Bài 9) → ___ から ___ で ___ {分|ふん}です。／___ に{乗|の}って、___ で{降|お}ります。',
        '**Câu kết:** {皆|みな}さんも{今度|こんど}の{休|やす}みにぜひ{行|い}ってください。',
        'Từ thêm ở chân bài đọc của sách: イルミネーション (đèn trang trí), ショッピングモール (trung tâm mua sắm), {浴衣|ゆかた} (áo yukata), {着|き}ます［{着|き}る］2 (mặc). {海|うみ} = biển.',
      ],
    },

    /* ── できる！ ── */
    { t: 'h', text: 'できる！— Lập kế hoạch rồi diễn một ngày du lịch' },
    {
      t: 'p',
      text: 'Nhiệm vụ 5 bước như sách: ① chia nhóm, lập kế hoạch chuyến đi → ② nghĩ nhân vật (trưởng đoàn, bạn đến muộn, nhân viên…) → ③ viết kịch bản một ngày → ④ luyện nói **không nhìn kịch bản**, có nét mặt, cử chỉ → ⑤ diễn trước lớp. Dưới đây là một kịch bản mẫu 5 cảnh dùng đủ 10 ポイント của bài.',
    },
    {
      t: 'table',
      caption: 'Kịch bản mẫu — "Một ngày ở Kamakura" (tự đặt)',
      head: ['Cảnh', 'Chuyện gì xảy ra', 'Câu then chốt'],
      rows: [
        ['1. {駅|えき}の{前|まえ}', 'Điểm danh, một bạn chưa đến; một bạn đi mua nước.', 'ワンさんはまだ{来|き}ていません。／ちょっと{水|みず}を{買|か}ってきます。'],
        ['2. {電話|でんわ}', 'Bạn đến muộn gọi điện hỏi đường.', 'そこから{何|なに}が{見|み}えますか。——{交差点|こうさてん}を{右|みぎ}に{曲|ま}がってください。'],
        ['3. バスの{中|なか}', 'Xin ngồi, xin mở rèm; trưởng đoàn dặn dò.', 'カーテンを{開|あ}けてもいいですか。／{遅|おく}れないでください。'],
        ['4. お{寺|てら}', 'Xin chụp ảnh — bị từ chối, được chỉ chỗ khác.', '{写真|しゃしん}はあそこで{撮|と}ってください。'],
        ['5. {公園|こうえん}', 'Thấy chim bay; trời tối; đề xuất về.', '{鳥|とり}が{飛|と}んでいます。／{暗|くら}くなりましたね。そろそろ{帰|かえ}りませんか。'],
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */
/* Đủ 70 mục của trang ことば p.183: chủ đề 1 (21) = A 12 + B 9 · chủ đề 2 (21) = C 9 + D 12 ·
 * chủ đề 3 (28) = E 15 + F 6 + G 7. */

const TU_VUNG: Lesson = {
  id: 'b10-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 70 từ của trang ことば Bài 10',
  goal: 'Thuộc đủ 70 từ của Bài 10 (chỉ đường, nơi công cộng, sở thú) và dùng được mỗi từ trong một câu chỉ đường, xin phép, nhắc nhở hoặc tả con vật.',
  minutes: 45,
  blocks: [
    {
      t: 'p',
      text: 'Đủ **70 từ** trên trang ことば (p.183), giữ đúng 3 chủ đề của sách: **{集合|しゅうごう}** (21 từ — nhóm A, B), **いろいろな{注意|ちゅうい}** (21 từ — nhóm C, D), **{動物園|どうぶつえん}で** (28 từ — nhóm E, F, G). Từ Bài 8 cô không phát danh sách riêng nên đây là chuẩn. Số **1 / 2 / 3** sau động từ = nhóm động từ. Câu ví dụ chỉ dùng từ Bài 1–10. Cách học: bấm 🔊 → đọc to 3 lần → che nghĩa, tự nói.',
    },
    {
      t: 'note',
      title: 'Cách đọc romaji trong khoá',
      items: [
        'Trường âm viết theo đúng chữ kana: {交差点|こうさてん} → **kousaten**, {信号|しんごう} → shingou, {動物園|どうぶつえん} → **doubutsuen**, {本当|ほんとう} → hontou, カーテン → **kaaten**, ボール → booru.',
        'Âm ngắt っ viết đôi phụ âm: まっすぐ → **massugu**, パンフレット → panfuretto, {持|も}って{帰|かえ}ります → motte kaerimasu.',
        'Thể ない mới của bài: {押|お}さない → **osanai**, {入|はい}らない → hairanai, {遅|おく}れない → okurenai.',
      ],
    },

    { t: 'h', text: 'A. Chỉ đường (12 từ — chủ đề 1)' },
    {
      t: 'vocab',
      items: [
        { w: '{右|みぎ}', pos: 'danh từ', ipa: 'migi', vi: 'bên phải (右に曲がります = rẽ phải)', ex: 'あの{信号|しんごう}を{右|みぎ}に{曲|ま}がってください。', exRo: 'Ano shingou o migi ni magatte kudasai.', exVi: 'Đến đèn giao thông kia thì rẽ phải.' },
        { w: '{左|ひだり}', pos: 'danh từ', ipa: 'hidari', vi: 'bên trái', ex: '{橋|はし}を{渡|わた}って、{左|ひだり}に{曲|ま}がってください。', exRo: 'Hashi o watatte, hidari ni magatte kudasai.', exVi: 'Qua cầu rồi rẽ trái.' },
        { w: '{角|かど}', pos: 'danh từ', ipa: 'kado', vi: 'góc (phố), góc đường', ex: 'コンビニの{角|かど}を{右|みぎ}に{曲|ま}がります。', exRo: 'Konbini no kado o migi ni magarimasu.', exVi: 'Rẽ phải ở góc cửa hàng tiện lợi.' },
        { w: '{交差点|こうさてん}', pos: 'danh từ', ipa: 'kousaten', vi: 'ngã tư, giao lộ', ex: '{次|つぎ}の{交差点|こうさてん}を{左|ひだり}に{曲|ま}がってください。', exRo: 'Tsugi no kousaten o hidari ni magatte kudasai.', exVi: 'Đến ngã tư tiếp theo thì rẽ trái.' },
        { w: '{信号|しんごう}', pos: 'danh từ', ipa: 'shingou', vi: 'đèn giao thông, đèn tín hiệu', ex: '{2|ふた}つ{目|め}の{信号|しんごう}を{右|みぎ}に{曲|ま}がります。', exRo: 'Futatsume no shingou o migi ni magarimasu.', exVi: 'Rẽ phải ở đèn giao thông thứ hai.' },
        { w: '{橋|はし}', pos: 'danh từ', ipa: 'hashi', vi: 'cây cầu (khác はし = đũa, Bài 7 — cùng âm)', ex: 'ここから{大|おお}きい{橋|はし}が{見|み}えます。', exRo: 'Koko kara ookii hashi ga miemasu.', exVi: 'Từ đây nhìn thấy cây cầu lớn.' },
        { w: '{道|みち}', pos: 'danh từ', ipa: 'michi', vi: 'đường, con đường; đường đi (道がわかりません = không biết đường)', ex: 'この{道|みち}をまっすぐ{行|い}ってください。', exRo: 'Kono michi o massugu itte kudasai.', exVi: 'Hãy đi thẳng con đường này.' },
        { w: '～つ{目|め}', pos: 'hậu tố', ipa: '~tsume', vi: 'thứ ~ (một つ目 = thứ nhất, 二つ目 = thứ hai, 三つ目 = thứ ba)', ex: '{3|みっ}つ{目|め}の{角|かど}を{左|ひだり}に{曲|ま}がってください。', exRo: 'Mittsume no kado o hidari ni magatte kudasai.', exVi: 'Rẽ trái ở góc phố thứ ba.' },
        { w: 'まっすぐ', pos: 'phó từ', ipa: 'massugu', vi: 'thẳng (đi thẳng)', ex: '{駅|えき}を{出|で}て、まっすぐ{行|い}ってください。', exRo: 'Eki o dete, massugu itte kudasai.', exVi: 'Ra khỏi ga rồi đi thẳng.' },
        { w: '{曲|ま}がります［{曲|ま}がる］1', pos: 'động từ nhóm 1', ipa: 'magarimasu [magaru]', vi: 'rẽ, quẹo (chỗ rẽ + を, hướng + に)', ex: '{交差点|こうさてん}を{右|みぎ}に{曲|ま}がります。', exRo: 'Kousaten o migi ni magarimasu.', exVi: 'Rẽ phải ở ngã tư.' },
        { w: '{渡|わた}ります［{渡|わた}る］1', pos: 'động từ nhóm 1', ipa: 'watarimasu [wataru]', vi: 'băng qua, sang (cầu, đường) — 橋を渡ります', ex: 'あの{橋|はし}を{渡|わた}ってください。', exRo: 'Ano hashi o watatte kudasai.', exVi: 'Hãy qua cây cầu kia.' },
        { w: '{探|さが}します［{探|さが}す］1', pos: 'động từ nhóm 1', ipa: 'sagashimasu [sagasu]', vi: 'tìm, tìm kiếm', ex: 'ちょっとワンさんを{探|さが}してきます。', exRo: 'Chotto Wan-san o sagashite kimasu.', exVi: 'Tôi đi tìm Wang một chút rồi quay lại.' },
      ],
    },
    {
      t: 'table',
      caption: 'Đếm "thứ mấy" — ～つ目 (ghép với số đếm ～つ của Bài 2)',
      head: ['Số', 'Chữ', 'Đọc', 'Ví dụ'],
      rows: [
        ['thứ 1', '{1|ひと}つ{目|め}', 'hitotsume', '{1|ひと}つ{目|め}の{信号|しんごう} — đèn đầu tiên'],
        ['thứ 2', '{2|ふた}つ{目|め}', 'futatsume', '{2|ふた}つ{目|め}の{角|かど} — góc thứ hai'],
        ['thứ 3', '{3|みっ}つ{目|め}', 'mittsume', '{3|みっ}つ{目|め}の{交差点|こうさてん} — ngã tư thứ ba'],
        ['thứ 4', '{4|よっ}つ{目|め}', 'yottsume', '{4|よっ}つ{目|め}の{橋|はし} — cây cầu thứ tư'],
        ['thứ 5', '{5|いつ}つ{目|め}', 'itsutsume', '{5|いつ}つ{目|め}の{駅|えき} — ga thứ năm'],
      ],
    },

    { t: 'h', text: 'B. Nghe, nhìn & câu nói ngắn (9 từ — chủ đề 1)' },
    {
      t: 'vocab',
      items: [
        { w: '{音|おと}', pos: 'danh từ', ipa: 'oto', vi: 'âm thanh, tiếng động (của đồ vật: xe, mưa, nhạc)', ex: '{車|くるま}の{音|おと}が{聞|き}こえます。', exRo: 'Kuruma no oto ga kikoemasu.', exVi: 'Nghe thấy tiếng xe.' },
        { w: '{声|こえ}', pos: 'danh từ', ipa: 'koe', vi: 'giọng, tiếng (của người, con vật)', ex: '{鳥|とり}の{声|こえ}が{聞|き}こえます。', exRo: 'Tori no koe ga kikoemasu.', exVi: 'Nghe thấy tiếng chim.' },
        { w: '{見|み}えます［{見|み}える］2', pos: 'động từ nhóm 2', ipa: 'miemasu [mieru]', vi: 'nhìn thấy được, trông thấy (tự hiện ra trong tầm mắt) — Nが見えます', ex: 'ここから{東京|とうきょう}タワーが{見|み}えます。', exRo: 'Koko kara Toukyou tawaa ga miemasu.', exVi: 'Từ đây nhìn thấy tháp Tokyo.' },
        { w: '{聞|き}こえます［{聞|き}こえる］2', pos: 'động từ nhóm 2', ipa: 'kikoemasu [kikoeru]', vi: 'nghe thấy được (tự lọt vào tai) — Nが聞こえます', ex: 'すみません、よく{聞|き}こえません。', exRo: 'Sumimasen, yoku kikoemasen.', exVi: 'Xin lỗi, tôi nghe không rõ.' },
        { w: '{薬|くすり}', pos: 'danh từ', ipa: 'kusuri', vi: 'thuốc (uống thuốc = 薬を飲みます)', ex: 'バスに{乗|の}ります。{薬|くすり}を{飲|の}んでください。', exRo: 'Basu ni norimasu. Kusuri o nonde kudasai.', exVi: 'Mình sắp lên xe buýt. Uống thuốc đi.' },
        { w: '{飲|の}みます［{飲|の}む］1', pos: 'động từ nhóm 1', ipa: 'nomimasu [nomu]', vi: 'uống (Bài 10: uống THUỐC cũng dùng 飲みます — tiếng Việt cũng "uống thuốc")', ex: 'もう{薬|くすり}を{飲|の}みましたか。——いいえ、まだ{飲|の}んでいません。', exRo: 'Mou kusuri o nomimashita ka. — Iie, mada nonde imasen.', exVi: 'Bạn uống thuốc chưa? — Chưa, tôi chưa uống. (câu mẫu của sách: 薬を飲みます)' },
        { w: 'よく', pos: 'phó từ', ipa: 'yoku', vi: 'rõ, kỹ (よくわかりません = không rõ lắm; よく聞こえません = nghe không rõ) — khác よく "thường xuyên" (Bài 9)', ex: 'ここはどこですか。よくわかりません。', exRo: 'Koko wa doko desu ka. Yoku wakarimasen.', exVi: 'Đây là đâu nhỉ? Tôi không rõ lắm. (câu mẫu của sách: よくわかりません)' },
        { w: 'ちょっと', pos: 'phó từ', ipa: 'chotto', vi: 'một chút, một lát (ちょっと～てきます = đi … một lát rồi về)', ex: 'ちょっとトイレに{行|い}ってきます。', exRo: 'Chotto toire ni itte kimasu.', exVi: 'Tôi đi vệ sinh một lát.' },
        { w: 'ええと', pos: 'thán từ', ipa: 'eeto', vi: 'ờ…, để xem… (đang nghĩ)', ex: 'ええと……{高|たか}いビルが{見|み}えます。', exRo: 'Eeto…… takai biru ga miemasu.', exVi: 'Ờ… tôi thấy toà nhà cao.' },
      ],
    },

    { t: 'h', text: 'C. Trên xe, ở bảo tàng — danh từ (9 từ — chủ đề 2)' },
    {
      t: 'vocab',
      items: [
        { w: 'カーテン', pos: 'danh từ', ipa: 'kaaten', vi: 'rèm cửa', ex: 'カーテンを{閉|し}めてもいいですか。', exRo: 'Kaaten o shimete mo ii desu ka.', exVi: 'Tôi kéo rèm lại được không?' },
        { w: '（お）{客|きゃく}（さん）', pos: 'danh từ', ipa: '(o)kyaku(san)', vi: 'khách, khách hàng (お客さん = cách gọi lịch sự)', ex: '{他|ほか}のお{客|きゃく}さんに{迷惑|めいわく}です。', exRo: 'Hoka no okyakusan ni meiwaku desu.', exVi: 'Làm phiền những khách khác.' },
        { w: 'ごみ', pos: 'danh từ', ipa: 'gomi', vi: 'rác', ex: 'ここにごみを{捨|す}てないでください。', exRo: 'Koko ni gomi o sutenaide kudasai.', exVi: 'Đừng vứt rác ở đây.' },
        { w: '{手|て}', pos: 'danh từ', ipa: 'te', vi: 'tay', ex: '{窓|まど}から{手|て}を{出|だ}さないでください。', exRo: 'Mado kara te o dasanaide kudasai.', exVi: 'Đừng thò tay ra ngoài cửa sổ.' },
        { w: '{荷物|にもつ}', pos: 'danh từ', ipa: 'nimotsu', vi: 'hành lý, đồ đạc mang theo; bưu kiện', ex: '{荷物|にもつ}はあそこに{置|お}いてください。', exRo: 'Nimotsu wa asoko ni oite kudasai.', exVi: 'Hành lý thì để đằng kia.' },
        { w: 'パンフレット', pos: 'danh từ', ipa: 'panfuretto', vi: 'tờ giới thiệu, sách mỏng quảng cáo (pamphlet)', ex: 'パンフレットをもらってもいいですか。', exRo: 'Panfuretto o moratte mo ii desu ka.', exVi: 'Tôi lấy một tờ giới thiệu được không?' },
        { w: '{他|ほか}', pos: 'danh từ', ipa: 'hoka', vi: 'khác, cái khác, người khác (他のN = N khác)', ex: '{他|ほか}の{店|みせ}でも{買|か}うことができます。', exRo: 'Hoka no mise demo kau koto ga dekimasu.', exVi: 'Ở cửa hàng khác cũng mua được.' },
        { w: '{皆|みな}さん', pos: 'danh từ', ipa: 'minasan', vi: 'các bạn, mọi người, quý vị (gọi cả nhóm)', ex: '{皆|みな}さん、{10時|じゅうじ}に{集合|しゅうごう}してください。', exRo: 'Minasan, juuji ni shuugou shite kudasai.', exVi: 'Mọi người tập hợp lúc 10 giờ nhé.' },
        { w: '（お）{土産|みやげ}', pos: 'danh từ', ipa: '(o)miyage', vi: 'quà (mua khi đi xa về tặng), đồ lưu niệm', ex: '{家族|かぞく}にお{土産|みやげ}を{買|か}いたいです。', exRo: 'Kazoku ni omiyage o kaitai desu.', exVi: 'Tôi muốn mua quà cho gia đình.' },
      ],
    },

    { t: 'h', text: 'D. Động từ & tính từ nơi công cộng (12 từ — chủ đề 2)' },
    {
      t: 'vocab',
      items: [
        { w: '{押|お}します［{押|お}す］1', pos: 'động từ nhóm 1', ipa: 'oshimasu [osu]', vi: 'đẩy; ấn, bấm (nút)', ex: '{危|あぶ}ないですから、{前|まえ}の{人|ひと}を{押|お}さないでください。', exRo: 'Abunai desu kara, mae no hito o osanaide kudasai.', exVi: 'Nguy hiểm nên đừng đẩy người phía trước.' },
        { w: '{座|すわ}ります［{座|すわ}る］1', pos: 'động từ nhóm 1', ipa: 'suwarimasu [suwaru]', vi: 'ngồi (chỗ ngồi + に)', ex: 'ここに{座|すわ}ってもいいですか。', exRo: 'Koko ni suwatte mo ii desu ka.', exVi: 'Tôi ngồi đây được không?' },
        { w: '{立|た}ちます［{立|た}つ］1', pos: 'động từ nhóm 1', ipa: 'tachimasu [tatsu]', vi: 'đứng, đứng lên', ex: 'バスの{中|なか}で{立|た}たないでください。', exRo: 'Basu no naka de tatanaide kudasai.', exVi: 'Trong xe buýt đừng đứng lên.' },
        { w: 'なくします［なくす］1', pos: 'động từ nhóm 1', ipa: 'nakushimasu [nakusu]', vi: 'làm mất, đánh mất', ex: 'このチケットは{大切|たいせつ}です。なくさないでください。', exRo: 'Kono chiketto wa taisetsu desu. Nakusanaide kudasai.', exVi: 'Vé này quan trọng. Đừng làm mất.' },
        { w: '{入|はい}ります［{入|はい}る］1', pos: 'động từ nhóm 1', ipa: 'hairimasu [hairu]', vi: 'vào, đi vào (nơi + に) — nhóm 1 dù đuôi る: 入らない, 入って', ex: '{教室|きょうしつ}に{入|はい}ります。', exRo: 'Kyoushitsu ni hairimasu.', exVi: 'Tôi vào lớp học. (câu mẫu của sách)' },
        { w: '{持|も}って{帰|かえ}ります［{持|も}って{帰|かえ}る］1', pos: 'động từ nhóm 1', ipa: 'motte kaerimasu [motte kaeru]', vi: 'mang về (nhà)', ex: 'ごみはうちへ{持|も}って{帰|かえ}ってください。', exRo: 'Gomi wa uchi e motte kaette kudasai.', exVi: 'Rác thì mang về nhà nhé.' },
        { w: '{遅|おく}れます［{遅|おく}れる］2', pos: 'động từ nhóm 2', ipa: 'okuremasu [okureru]', vi: 'muộn, trễ (giờ + に遅れます)', ex: '{集合時間|しゅうごうじかん}に{遅|おく}れないでください。', exRo: 'Shuugou jikan ni okurenaide kudasai.', exVi: 'Đừng trễ giờ tập hợp.' },
        { w: '{捨|す}てます［{捨|す}てる］2', pos: 'động từ nhóm 2', ipa: 'sutemasu [suteru]', vi: 'vứt, bỏ (rác)', ex: 'ここにごみを{捨|す}ててもいいですか。', exRo: 'Koko ni gomi o sutete mo ii desu ka.', exVi: 'Tôi vứt rác ở đây được không?' },
        { w: '{集合|しゅうごう}します［{集合|しゅうごう}する］3', pos: 'động từ nhóm 3', ipa: 'shuugou shimasu [shuugou suru]', vi: 'tập hợp (集合 = sự tập hợp; 集合時間 = giờ tập hợp; 集合場所 = điểm tập hợp)', ex: '{明日|あした}{8時|はちじ}に{駅|えき}の{前|まえ}に{集合|しゅうごう}します。', exRo: 'Ashita hachiji ni eki no mae ni shuugou shimasu.', exVi: 'Mai 8 giờ tập hợp trước ga.' },
        { w: '{危|あぶ}ない', pos: 'tính từ đuôi い', ipa: 'abunai', vi: 'nguy hiểm', ex: '{危|あぶ}ないですから、{道|みち}で{遊|あそ}ばないでください。', exRo: 'Abunai desu kara, michi de asobanaide kudasai.', exVi: 'Nguy hiểm nên đừng chơi ngoài đường.' },
        { w: '{大切|たいせつ}（な）', pos: 'tính từ đuôi な', ipa: 'taisetsu (na)', vi: 'quan trọng, quý giá (大切な人 = người quan trọng)', ex: 'これは{大切|たいせつ}な{写真|しゃしん}です。', exRo: 'Kore wa taisetsu na shashin desu.', exVi: 'Đây là tấm ảnh quý giá.' },
        { w: '{迷惑|めいわく}（な）', pos: 'tính từ đuôi な', ipa: 'meiwaku (na)', vi: 'phiền hà, gây phiền (Nに迷惑です = làm phiền N)', ex: '{大|おお}きい{声|こえ}で{話|はな}さないでください。{迷惑|めいわく}ですから。', exRo: 'Ookii koe de hanasanaide kudasai. Meiwaku desu kara.', exVi: 'Đừng nói to. Vì gây phiền.' },
      ],
    },

    { t: 'h', text: 'E. Sở thú — con vật & chỗ chơi (15 từ — chủ đề 3)' },
    {
      t: 'vocab',
      items: [
        { w: '{動物園|どうぶつえん}', pos: 'danh từ', ipa: 'doubutsuen', vi: 'sở thú, vườn bách thú', ex: '{日曜日|にちようび}、{友達|ともだち}と{動物園|どうぶつえん}へ{行|い}きました。', exRo: 'Nichiyoubi, tomodachi to doubutsuen e ikimashita.', exVi: 'Chủ Nhật tôi đi sở thú với bạn.' },
        { w: 'クマ', pos: 'danh từ', ipa: 'kuma', vi: 'con gấu', ex: 'クマが{泳|およ}いでいます。', exRo: 'Kuma ga oyoide imasu.', exVi: 'Con gấu đang bơi.' },
        { w: 'コアラ', pos: 'danh từ', ipa: 'koara', vi: 'gấu koala', ex: 'コアラが{木|き}の{上|うえ}で{寝|ね}ています。', exRo: 'Koara ga ki no ue de nete imasu.', exVi: 'Con koala đang ngủ trên cây.' },
        { w: 'サル', pos: 'danh từ', ipa: 'saru', vi: 'con khỉ', ex: 'あっ、サルがバナナを{食|た}べています。', exRo: 'A, saru ga banana o tabete imasu.', exVi: 'A, con khỉ đang ăn chuối. (câu mẫu của sách, ポイント 90)' },
        { w: 'ゾウ', pos: 'danh từ', ipa: 'zou', vi: 'con voi', ex: 'ゾウが{水|みず}を{飲|の}んでいます。', exRo: 'Zou ga mizu o nonde imasu.', exVi: 'Con voi đang uống nước.' },
        { w: '{鳥|とり}', pos: 'danh từ', ipa: 'tori', vi: 'con chim', ex: '{鳥|とり}が{飛|と}んでいます。', exRo: 'Tori ga tonde imasu.', exVi: 'Con chim đang bay.' },
        { w: 'パンダ', pos: 'danh từ', ipa: 'panda', vi: 'gấu trúc', ex: 'パンダを{見|み}たいです。', exRo: 'Panda o mitai desu.', exVi: 'Tôi muốn xem gấu trúc.' },
        { w: 'ペンギン', pos: 'danh từ', ipa: 'pengin', vi: 'chim cánh cụt', ex: 'ペンギンが{歩|ある}いています。かわいいですね。', exRo: 'Pengin ga aruite imasu. Kawaii desu ne.', exVi: 'Chim cánh cụt đang đi. Dễ thương nhỉ.' },
        { w: '{入|い}り{口|ぐち}', pos: 'danh từ', ipa: 'iriguchi', vi: 'lối vào, cửa vào (入り + くち → ぐち)', ex: '{入|い}り{口|ぐち}で{地図|ちず}をもらいました。', exRo: 'Iriguchi de chizu o moraimashita.', exVi: 'Tôi nhận bản đồ ở lối vào.' },
        { w: '{出口|でぐち}', pos: 'danh từ', ipa: 'deguchi', vi: 'lối ra, cửa ra', ex: '{出口|でぐち}はどこですか。', exRo: 'Deguchi wa doko desu ka.', exVi: 'Lối ra ở đâu?' },
        { w: 'えさ', pos: 'danh từ', ipa: 'esa', vi: 'thức ăn cho động vật, mồi', ex: '{動物|どうぶつ}にえさをやらないでください。', exRo: 'Doubutsu ni esa o yaranaide kudasai.', exVi: 'Đừng cho thú ăn.' },
        { w: '{観覧車|かんらんしゃ}', pos: 'danh từ', ipa: 'kanransha', vi: 'vòng đu quay (khổng lồ)', ex: '{観覧車|かんらんしゃ}から{海|うみ}が{見|み}えます。', exRo: 'Kanransha kara umi ga miemasu.', exVi: 'Từ đu quay nhìn thấy biển.' },
        { w: 'バナナ', pos: 'danh từ', ipa: 'banana', vi: 'quả chuối', ex: 'サルはバナナが{好|す}きです。', exRo: 'Saru wa banana ga suki desu.', exVi: 'Khỉ thích chuối.' },
        { w: 'ボール', pos: 'danh từ', ipa: 'booru', vi: 'quả bóng', ex: 'ここでボールを{借|か}りることができますか。', exRo: 'Koko de booru o kariru koto ga dekimasu ka.', exVi: 'Ở đây mượn bóng được không?' },
        { w: '～たち', pos: 'hậu tố', ipa: '~tachi', vi: 'các, những (số nhiều của người / con vật: 私たち = chúng tôi, 子どもたち = bọn trẻ)', ex: '{子|こ}どもたちがパンダを{見|み}ています。', exRo: 'Kodomotachi ga panda o mite imasu.', exVi: 'Bọn trẻ đang xem gấu trúc.' },
      ],
    },

    { t: 'h', text: 'F. Cơ thể & cảm giác (6 từ — chủ đề 3)' },
    {
      t: 'vocab',
      items: [
        { w: 'おなか', pos: 'danh từ', ipa: 'onaka', vi: 'bụng', ex: 'おなかが{痛|いた}いです。', exRo: 'Onaka ga itai desu.', exVi: 'Tôi đau bụng.' },
        { w: 'おなかがすきます［すく］1', pos: 'cụm động từ nhóm 1', ipa: 'onaka ga sukimasu [suku]', vi: 'đói bụng (thường nói quá khứ: おなかがすきました = đói rồi)', ex: 'おなかがすきました。{何|なに}か{食|た}べませんか。', exRo: 'Onaka ga sukimashita. Nanika tabemasen ka.', exVi: 'Đói rồi. Ăn gì đó không?' },
        { w: 'のどがかわきます［かわく］1', pos: 'cụm động từ nhóm 1', ipa: 'nodo ga kawakimasu [kawaku]', vi: 'khát nước (のど = cổ họng; のどがかわきました = khát rồi)', ex: 'のどがかわきました。ジュースを{買|か}ってきます。', exRo: 'Nodo ga kawakimashita. Juusu o katte kimasu.', exVi: 'Khát rồi. Tôi đi mua nước quả rồi quay lại.' },
        { w: '{疲|つか}れます［{疲|つか}れる］2', pos: 'động từ nhóm 2', ipa: 'tsukaremasu [tsukareru]', vi: 'mệt (疲れました = mệt rồi)', ex: 'たくさん{歩|ある}きました。{疲|つか}れました。', exRo: 'Takusan arukimashita. Tsukaremashita.', exVi: 'Đi bộ nhiều. Mệt rồi.' },
        { w: '{痛|いた}い', pos: 'tính từ đuôi い', ipa: 'itai', vi: 'đau (bộ phận + が痛いです)', ex: '{足|あし}が{痛|いた}いです。', exRo: 'Ashi ga itai desu.', exVi: 'Tôi đau chân.' },
        { w: '{暗|くら}い', pos: 'tính từ đuôi い', ipa: 'kurai', vi: 'tối (↔ 明るい sáng)', ex: '{暗|くら}くなりましたね。そろそろ{帰|かえ}りましょう。', exRo: 'Kuraku narimashita ne. Sorosoro kaerimashou.', exVi: 'Tối rồi nhỉ. Về thôi.' },
      ],
    },

    { t: 'h', text: 'G. Động từ & câu nói (7 từ — chủ đề 3)' },
    {
      t: 'vocab',
      items: [
        { w: '{歩|ある}きます［{歩|ある}く］1', pos: 'động từ nhóm 1', ipa: 'arukimasu [aruku]', vi: 'đi bộ (歩いて5分 = đi bộ 5 phút)', ex: '{公園|こうえん}を{歩|ある}きましょう。', exRo: 'Kouen o arukimashou.', exVi: 'Đi dạo trong công viên đi. (を = đi qua khắp nơi đó, ポイント 96)' },
        { w: '{飛|と}びます［{飛|と}ぶ］1', pos: 'động từ nhóm 1', ipa: 'tobimasu [tobu]', vi: 'bay', ex: '{鳥|とり}が{空|そら}を{飛|と}んでいます。', exRo: 'Tori ga sora o tonde imasu.', exVi: 'Con chim đang bay trên trời.' },
        { w: 'なります［なる］1', pos: 'động từ nhóm 1', ipa: 'narimasu [naru]', vi: 'trở nên, trở thành (寒くなります, 12時になります)', ex: 'もうすぐ{12時|じゅうにじ}になります。', exRo: 'Mou sugu juuniji ni narimasu.', exVi: 'Sắp 12 giờ rồi.' },
        { w: '{休|やす}みます［{休|やす}む］1', pos: 'động từ nhóm 1', ipa: 'yasumimasu [yasumu]', vi: 'nghỉ, nghỉ ngơi (Bài 10: nghỉ chân) — Bài 3: nghỉ (học, làm)', ex: 'あそこのベンチで{休|やす}みましょう。', exRo: 'Asoko no benchi de yasumimashou.', exVi: 'Nghỉ ở ghế dài đằng kia đi. (câu mẫu của sách)' },
        { w: 'やります［やる］1', pos: 'động từ nhóm 1', ipa: 'yarimasu [yaru]', vi: 'cho (con vật, cây) ăn/uống: えさをやります; (khẩu ngữ) làm = します', ex: 'ここでサルにえさをやることができます。', exRo: 'Koko de saru ni esa o yaru koto ga dekimasu.', exVi: 'Ở đây có thể cho khỉ ăn.' },
        { w: 'そろそろ', pos: 'phó từ', ipa: 'sorosoro', vi: 'sắp đến lúc, đã đến lúc (… thôi)', ex: 'そろそろ{昼|ひる}ご{飯|はん}を{食|た}べませんか。', exRo: 'Sorosoro hirugohan o tabemasen ka.', exVi: 'Đến giờ ăn trưa rồi, ăn thôi chứ?' },
        { w: '{本当|ほんとう}だ', pos: 'câu nói', ipa: 'hontou da', vi: 'thật này!, đúng thật! (thể thường, nói với bạn khi thấy điều người kia chỉ)', ex: 'あっ、パンダが{寝|ね}ています。——{本当|ほんとう}だ。', exRo: 'A, panda ga nete imasu. — Hontou da.', exVi: 'A, gấu trúc đang ngủ. — Thật này!' },
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp trong từ bài 10',
      items: [
        '**{見|み}えます ↔ {見|み}ます**: 見ます = chủ động NHÌN, XEM (を); 見えます = cái đó TỰ HIỆN RA trong mắt (が). ~~東京タワーを見えます~~ → 東京タワー**が**見えます.',
        '**{聞|き}こえます ↔ {聞|き}きます**: 聞きます = chủ động nghe, hỏi (を); 聞こえます = tiếng tự lọt vào tai (が). Điện thoại rè: **よく聞こえません** (không phải ~~よく聞きません~~).',
        '**{音|おと} ↔ {声|こえ}**: 声 = tiếng của người và con vật (có miệng); 音 = tiếng của đồ vật (xe, mưa, chuông). {鳥|とり}の**声**, {車|くるま}の**音**.',
        '**{入|はい}ります, {帰|かえ}ります** trông như nhóm 2 (đuôi ～ります đứng sau i/e) nhưng là **nhóm 1**: 入**らない**, 入**って**; 帰**らない**, 帰**って**. Đừng viết ~~入ない~~, ~~帰ない~~.',
        '**{橋|はし} (cầu) ↔ はし (đũa, Bài 7)**: cùng âm, khác chữ. Nghe ngữ cảnh: 橋を**渡ります** / はしで**食べます**.',
        '**よく**: Bài 9 = "thường xuyên" (よく映画を見ます); Bài 10 = "rõ" (よくわかりません, よく聞こえません). Cùng chữ, nghĩa theo động từ đi sau.',
        '**{休|やす}みます**: Bài 3 "nghỉ (không đi học/làm)", Bài 10 "nghỉ chân, nghỉ ngơi": ベンチで休みます.',
      ],
    },

    { t: 'h', text: 'Từ thêm (sách có ở bài đọc, bài nghe, 言ってみよう — chỉ cần nghe hiểu)' },
    {
      t: 'table',
      head: ['Từ / câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['バスツアー', 'basu tsuaa', 'Tour du lịch bằng xe buýt (tên bài)'],
        ['{集合場所|しゅうごうばしょ}', 'shuugou basho', 'Điểm tập hợp'],
        ['{集合時間|しゅうごうじかん}', 'shuugou jikan', 'Giờ tập hợp'],
        ['{場所|ばしょ}', 'basho', 'Nơi, địa điểm (chân bài nghe)'],
        ['{待|ま}ち{合|あ}わせ', 'machiawase', 'Việc hẹn gặp nhau, điểm hẹn (chân bài nghe)'],
        ['ゆっくり', 'yukkuri', 'Chậm rãi, thong thả (ゆっくり行ってください)'],
        ['{芝生|しばふ}', 'shibafu', 'Bãi cỏ (芝生に入らないでください)'],
        ['{喫煙所|きつえんじょ}', 'kitsuenjo', 'Khu vực hút thuốc'],
        ['{喫茶店|きっさてん}', 'kissaten', 'Quán cà phê kiểu Nhật'],
        ['{美術館|びじゅつかん}', 'bijutsukan', 'Bảo tàng mỹ thuật'],
        ['ロッカー', 'rokkaa', 'Tủ khoá gửi đồ'],
        ['ベンチ', 'benchi', 'Ghế dài (ở công viên)'],
        ['{自転車|じてんしゃ}', 'jitensha', 'Xe đạp'],
        ['ビル', 'biru', 'Toà nhà (building)'],
        ['イルミネーション', 'irumineeshon', 'Đèn trang trí (chân bài đọc)'],
        ['ショッピングモール', 'shoppingu mooru', 'Trung tâm mua sắm (chân bài đọc)'],
        ['{浴衣|ゆかた}', 'yukata', 'Áo yukata (kimono mùa hè) (chân bài đọc)'],
        ['{着|き}ます［{着|き}る］2', 'kimasu [kiru]', 'Mặc (áo) (chân bài đọc)'],
        ['{温泉|おんせん}', 'onsen', 'Suối nước nóng'],
        ['{海|うみ}', 'umi', 'Biển'],
        ['{空|そら}', 'sora', 'Bầu trời'],
        ['{明|あか}るい', 'akarui', 'Sáng (↔ 暗い)'],
        ['だめです', 'dame desu', 'Không được (từ chối thẳng — dùng với bạn bè, biển cấm)'],
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b10-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp — ポイント 88–97: ないでください, てもいいですか, ています, てきます, ことができます, 見えます, なります',
  goal: 'Chia được thể ない của mọi động từ đã học, nhắc "đừng …", xin phép và trả lời xin phép, tả việc đang diễn ra trước mắt, nói "chưa …", "đi … rồi về", "ở đây làm được …", "nhìn thấy / nghe thấy", "trở nên …", chỉ đường với を, và đưa tân ngữ lên làm chủ đề với は.',
  minutes: 90,
  blocks: [
    {
      t: 'p',
      text: 'Bài 10 có **10 điểm ngữ pháp** (ポイント 88–97) và **một hình thái động từ mới: thể ない** (ナイ形, 表 p.283). Ba chủ đề của sách dùng chúng như sau: **{集合|しゅうごう}** 91, 92, 94, 96 · **いろいろな{注意|ちゅうい}** 88, 89, 97 · **{動物園|どうぶつえん}で** 90, 93, 95. Ở đây học theo thứ tự số ポイント, mỗi điểm có công thức → ví dụ → cặp hỏi–đáp → bảng thay thế → lỗi hay mắc.',
    },
    {
      t: 'table',
      caption: 'Bản đồ 10 điểm ngữ pháp',
      head: ['ポイント', 'Mẫu', 'Nghĩa', 'Ví dụ ngắn'],
      rows: [
        ['88', 'Vナイ形 でください', 'Xin đừng V', 'そこに{入|はい}らないでください。'],
        ['89', 'Vテ形 もいいですか', 'Tôi V có được không? (xin phép)', '{隣|となり}に{座|すわ}ってもいいですか。'],
        ['90', 'N が Vテ形 います', '(nhìn kìa) N đang V', 'サルがバナナを{食|た}べています。'],
        ['91', 'まだ Vテ形 いません', 'Chưa V', 'まだ{昼|ひる}ご{飯|はん}を{食|た}べていません。'],
        ['92', 'Vテ形 きます', 'Đi V rồi quay lại', 'ジュースを{買|か}ってきます。'],
        ['93', '［N／V{辞書形|じしょけい}こと］ ができます', '(ở chỗ này) có thể V', 'ここで{写真|しゃしん}を{撮|と}ることができます。'],
        ['94', 'N が {見|み}えます／{聞|き}こえます', 'Nhìn thấy / nghe thấy N', '{東京|とうきょう}タワーが{見|み}えます。'],
        ['95', 'イA‑い→くなります／［ナA／N］ になります', 'Trở nên …, thành …', '{寒|さむ}くなりました。{12時|じゅうにじ}になります。'],
        ['96', 'N（nơi）を Vます', 'Đi qua / rẽ ở / băng qua N', '{橋|はし}を{渡|わた}って、{交差点|こうさてん}を{右|みぎ}に{曲|ま}がってください。'],
        ['97', 'N は（đưa tân ngữ lên đầu)', 'N thì … (đối chiếu)', '{荷物|にもつ}はあそこに{置|お}いてください。'],
      ],
    },

    /* ── Thể ない ── */
    { t: 'h', text: 'Trước tiên — Thể ない (ナイ形): cách chia' },
    {
      t: 'p',
      text: 'Thể ない là **dạng phủ định thể thường** của động từ ({食|た}べない = không ăn). Bài 10 chỉ dùng nó trong **～ないでください**, nhưng từ Bài 11 trở đi nó xuất hiện liên tục (～とき, ～ほうがいい, ～なければなりません) — học chắc ngay bây giờ. Cách chia đi từ **thể ます** (bạn đã thuộc) theo 3 nhóm:',
    },
    {
      t: 'table',
      caption: 'Quy tắc chia thể ない theo nhóm (từ thể ます)',
      head: ['Nhóm', 'Quy tắc', 'Ví dụ'],
      rows: [
        ['1', 'Âm ngay trước ます ở hàng **い** → đổi sang hàng **あ** + ない. **Riêng い → わ** (không phải ~~あ~~).', '{書|か}**き**ます → {書|か}**か**ない · {飲|の}**み**ます → {飲|の}**ま**ない · {吸|す}**い**ます → {吸|す}**わ**ない'],
        ['2', 'Bỏ ます + ない.', '{食|た}べます → {食|た}べない · {見|み}ます → {見|み}ない · {遅|おく}れます → {遅|おく}れない'],
        ['3', 'Học thuộc: します → **しない** · {来|き}ます → **{来|こ}ない** (chữ 来 đọc **こ**).', '{集合|しゅうごう}します → {集合|しゅうごう}しない · {持|も}って{来|き}ます → {持|も}って{来|こ}ない'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng ナイ形 (表 p.283) — động từ mẫu của sách',
      head: ['Nhóm', 'Thể ます', 'Thể ない', 'Romaji'],
      rows: [
        ['1', '{聞|き}きます', '{聞|き}かない', 'kikanai'],
        ['1', '{泳|およ}ぎます', '{泳|およ}がない', 'oyoganai'],
        ['1', '{話|はな}します', '{話|はな}さない', 'hanasanai'],
        ['1', '{持|も}ちます', '{持|も}たない', 'motanai'],
        ['1', '{死|し}にます', '{死|し}なない', 'shinanai'],
        ['1', '{遊|あそ}びます', '{遊|あそ}ばない', 'asobanai'],
        ['1', '{飲|の}みます', '{飲|の}まない', 'nomanai'],
        ['1', '{帰|かえ}ります', '{帰|かえ}らない', 'kaeranai'],
        ['1', '{使|つか}います', '{使|つか}わない', 'tsukawanai'],
        ['1', '{行|い}きます', '{行|い}かない', 'ikanai'],
        ['2', '{食|た}べます', '{食|た}べない', 'tabenai'],
        ['2', '{起|お}きます', '{起|お}きない', 'okinai'],
        ['3', 'します', 'しない', 'shinai'],
        ['3', '{来|き}ます', '{来|こ}ない', 'konai'],
      ],
    },
    {
      t: 'table',
      caption: 'Động từ của Bài 10 — thể ます → て → ない (học một lượt cả ba)',
      head: ['Thể ます', 'Nhóm', 'Thể て', 'Thể ない', 'Nghĩa'],
      rows: [
        ['{探|さが}します', '1', '{探|さが}して', '{探|さが}さない', 'tìm'],
        ['{飲|の}みます', '1', '{飲|の}んで', '{飲|の}まない', 'uống'],
        ['{曲|ま}がります', '1', '{曲|ま}がって', '{曲|ま}がらない', 'rẽ'],
        ['{渡|わた}ります', '1', '{渡|わた}って', '{渡|わた}らない', 'băng qua'],
        ['{押|お}します', '1', '{押|お}して', '{押|お}さない', 'đẩy'],
        ['{座|すわ}ります', '1', '{座|すわ}って', '{座|すわ}らない', 'ngồi'],
        ['{立|た}ちます', '1', '{立|た}って', '{立|た}たない', 'đứng'],
        ['なくします', '1', 'なくして', 'なくさない', 'làm mất'],
        ['{入|はい}ります', '1 ⚠', '{入|はい}って', '{入|はい}らない', 'vào'],
        ['{持|も}って{帰|かえ}ります', '1 ⚠', '{持|も}って{帰|かえ}って', '{持|も}って{帰|かえ}らない', 'mang về'],
        ['{歩|ある}きます', '1', '{歩|ある}いて', '{歩|ある}かない', 'đi bộ'],
        ['{飛|と}びます', '1', '{飛|と}んで', '{飛|と}ばない', 'bay'],
        ['なります', '1', 'なって', 'ならない', 'trở nên'],
        ['{休|やす}みます', '1', '{休|やす}んで', '{休|やす}まない', 'nghỉ'],
        ['やります', '1', 'やって', 'やらない', 'cho ăn / làm'],
        ['{吸|す}います (B7)', '1', '{吸|す}って', '{吸|す}**わ**ない', 'hút'],
        ['{撮|と}ります (B5)', '1', '{撮|と}って', '{撮|と}らない', 'chụp'],
        ['{置|お}きます (B7)', '1', '{置|お}いて', '{置|お}かない', 'đặt'],
        ['{見|み}えます', '2', '{見|み}えて', '{見|み}えない', 'thấy được'],
        ['{聞|き}こえます', '2', '{聞|き}こえて', '{聞|き}こえない', 'nghe được'],
        ['{遅|おく}れます', '2', '{遅|おく}れて', '{遅|おく}れない', 'trễ'],
        ['{捨|す}てます', '2', '{捨|す}てて', '{捨|す}てない', 'vứt'],
        ['{疲|つか}れます', '2', '{疲|つか}れて', '{疲|つか}れない', 'mệt'],
        ['{開|あ}けます (B7)', '2', '{開|あ}けて', '{開|あ}けない', 'mở'],
        ['{集合|しゅうごう}します', '3', '{集合|しゅうごう}して', '{集合|しゅうごう}しない', 'tập hợp'],
        ['{来|き}ます', '3', '{来|き}て', '{来|こ}ない', 'đến'],
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp khi chia thể ない',
      items: [
        '**い → わ**, không phải あ: {吸|す}います → ~~すあない~~ → **すわない**; {買|か}います → **かわない**; {使|つか}います → **つかわない**; {会|あ}います → **あわない**.',
        '**{来|き}ます → {来|こ}ない**: chữ 来 đổi cách đọc (き → こ). Viết kana: こない.',
        '**Nhóm 1 đội lốt nhóm 2**: {入|はい}ります, {帰|かえ}ります, {走|はし}ります, {切|き}ります… → 入**ら**ない, 帰**ら**ない. Cách nhận: thuộc nhóm của từ (số 1/2/3 trong từ điển của sách).',
        'Nhóm 2 có {見|み}ます, {起|お}きます, {借|か}ります (âm trước ます ở hàng い nhưng là nhóm 2) → {見|み}ない, {起|お}きない, {借|か}りない (không phải ~~借らない~~).',
        'あります → **ない** (đặc biệt, 表 p.284) — không có ~~あらない~~.',
      ],
    },

    /* ── ポイント 88 ── */
    { t: 'h', text: 'ポイント 88 — Vナイ形 でください (Xin đừng V)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（N を）Vない でください。',
          vi: 'Nhờ / nhắc người khác **đừng** làm V. Ghép thể ない + **でください** (không phải ~~てください~~). Hay kèm lý do phía trước: ～ですから、～ないでください.',
          examples: [
            { en: 'そこに{入|はい}らないでください。', ro: 'Soko ni hairanaide kudasai.', vi: 'Xin đừng vào đó. (câu mẫu của sách)' },
            { en: '{集合時間|しゅうごうじかん}に{遅|おく}れないでください。', ro: 'Shuugou jikan ni okurenaide kudasai.', vi: 'Đừng trễ giờ tập hợp.' },
            { en: '{美術館|びじゅつかん}で{写真|しゃしん}を{撮|と}らないでください。', ro: 'Bijutsukan de shashin o toranaide kudasai.', vi: 'Đừng chụp ảnh trong bảo tàng.' },
            { en: '{危|あぶ}ないですから、{前|まえ}の{人|ひと}を{押|お}さないでください。', ro: 'Abunai desu kara, mae no hito o osanaide kudasai.', vi: 'Nguy hiểm nên đừng đẩy người phía trước.' },
            { en: 'このチケットは{大切|たいせつ}です。なくさないでください。', ro: 'Kono chiketto wa taisetsu desu. Nakusanaide kudasai.', vi: 'Vé này quan trọng. Đừng làm mất.' },
          ],
        },
        {
          formula: 'Người bị nhắc đáp: あ、すみません。／はい、わかりました。',
          vi: 'Đang làm mà bị nhắc → **あ、すみません** (xin lỗi, dừng ngay). Nghe dặn trước → **はい、わかりました**.',
          examples: [
            { en: 'A：{窓|まど}を{開|あ}けないでください。B：あ、すみません。', ro: 'A: Mado o akenaide kudasai. B: A, sumimasen.', vi: 'A: Đừng mở cửa sổ. B: Ôi, xin lỗi.' },
            { en: 'A：{大|おお}きい{声|こえ}で{話|はな}さないでください。B：はい、わかりました。', ro: 'A: Ookii koe de hanasanaide kudasai. B: Hai, wakarimashita.', vi: 'A: Đừng nói to. B: Vâng, tôi hiểu rồi.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — (lý do)ですから、___ないでください',
      head: ['Lý do (tuỳ chọn)', 'Việc không được làm', 'Câu hoàn chỉnh'],
      rows: [
        ['—', '{集合時間|しゅうごうじかん}に{遅|おく}れます', '{集合時間|しゅうごうじかん}に{遅|おく}れないでください。'],
        ['{危|あぶ}ないです', '{前|まえ}の{人|ひと}を{押|お}します', '{危|あぶ}ないですから、{前|まえ}の{人|ひと}を{押|お}さないでください。'],
        ['このチケットは{大切|たいせつ}です', 'なくします', 'このチケットは{大切|たいせつ}ですから、なくさないでください。'],
        ['{他|ほか}のお{客|きゃく}さんに{迷惑|めいわく}です', '{大|おお}きい{声|こえ}で{話|はな}します', '{迷惑|めいわく}ですから、{大|おお}きい{声|こえ}で{話|はな}さないでください。'],
        ['{危|あぶ}ないです', 'バスの{中|なか}で{立|た}ちます', '{危|あぶ}ないですから、バスの{中|なか}で{立|た}たないでください。'],
        ['—', 'ここでたばこを{吸|す}います', 'ここでたばこを{吸|す}わないでください。'],
        ['—', 'ここにごみを{捨|す}てます', 'ここにごみを{捨|す}てないでください。'],
        ['—', '{動物|どうぶつ}にえさをやります', '{動物|どうぶつ}にえさをやらないでください。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — ないでください',
      items: [
        '~~{入|はい}らなくてください~~, ~~{入|はい}らないてください~~ → **{入|はい}らないでください** (luôn là **で**).',
        '~~{入|はい}りませんでください~~ — không ghép thể ます. Phải đổi sang thể ない trước.',
        'Đây là lời nhờ lịch sự, **không phải biển cấm tuyệt đối**. Biển cấm thật sẽ học ở Bài 14 (～てはいけません).',
        'Phân biệt: {窓|まど}を{開|あ}け**て**ください (hãy mở) ↔ {窓|まど}を{開|あ}け**ないで**ください (đừng mở).',
      ],
    },

    /* ── ポイント 89 ── */
    { t: 'h', text: 'ポイント 89 — Vテ形 もいいですか (Tôi V được không? — xin phép)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（nơi に／で）N を Vて もいいですか。',
          vi: 'Xin phép làm V. Ghép thể て (Bài 7) + **もいいですか**. Có thể bỏ も: Vていいですか (thân mật hơn).',
          examples: [
            { en: '{隣|となり}に{座|すわ}ってもいいですか。', ro: 'Tonari ni suwatte mo ii desu ka.', vi: 'Tôi ngồi bên cạnh được không? (câu mẫu của sách)' },
            { en: 'ここに{荷物|にもつ}を{置|お}いてもいいですか。', ro: 'Koko ni nimotsu o oite mo ii desu ka.', vi: 'Tôi để hành lý ở đây được không?' },
            { en: 'ここで{写真|しゃしん}を{撮|と}ってもいいですか。', ro: 'Koko de shashin o totte mo ii desu ka.', vi: 'Ở đây chụp ảnh được không?' },
            { en: 'このパンフレットをもらってもいいですか。', ro: 'Kono panfuretto o moratte mo ii desu ka.', vi: 'Tôi lấy tờ giới thiệu này được không?' },
          ],
        },
        {
          formula: 'Đồng ý: はい、どうぞ。／ええ、いいですよ。',
          vi: '**はい、どうぞ** (vâng, mời) — lịch sự, hay dùng nhất. **ええ、いいですよ** (được chứ) — thân mật hơn.',
          examples: [
            { en: 'A：{窓|まど}を{開|あ}けてもいいですか。B：はい、どうぞ。', ro: 'A: Mado o akete mo ii desu ka. B: Hai, douzo.', vi: 'A: Mở cửa sổ được không? B: Vâng, mời.' },
            { en: 'A：この{辞書|じしょ}を{使|つか}ってもいいですか。B：ええ、いいですよ。', ro: 'A: Kono jisho o tsukatte mo ii desu ka. B: Ee, ii desu yo.', vi: 'A: Tôi dùng từ điển này được không? B: Được chứ.' },
          ],
        },
        {
          formula: 'Từ chối khéo: すみません、ちょっと……。／すみません。（lý do）から……。',
          vi: 'Như từ chối lời rủ ở Bài 6: **すみません** + **ちょっと……** hoặc nói lý do + から rồi bỏ lửng. Không nói thẳng ~~いいえ、だめです~~ với người lạ / người trên.',
          examples: [
            { en: 'A：{窓|まど}を{開|あ}けてもいいですか。B：すみません。{少|すこ}し{寒|さむ}いですから……。', ro: 'A: Mado o akete mo ii desu ka. B: Sumimasen. Sukoshi samui desu kara…….', vi: 'A: Mở cửa sổ được không? B: Xin lỗi. Vì hơi lạnh… (câu mẫu của sách)' },
            { en: 'A：{隣|となり}に{座|すわ}ってもいいですか。B：すみません、ちょっと……。{友達|ともだち}が{来|き}ますから。', ro: 'A: Tonari ni suwatte mo ii desu ka. B: Sumimasen, chotto……. Tomodachi ga kimasu kara.', vi: 'A: Ngồi cạnh được không? B: Xin lỗi, hơi… Vì bạn tôi sắp đến.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — xin phép → đồng ý / từ chối',
      head: ['Xin phép (～てもいいですか)', 'Đồng ý', 'Từ chối'],
      rows: [
        ['{隣|となり}に{座|すわ}ってもいいですか', 'はい、どうぞ。', 'すみません、ちょっと……。'],
        ['カーテンを{閉|し}めてもいいですか', 'ええ、いいですよ。', 'すみません。{外|そと}を{見|み}たいですから……。'],
        ['ここでお{弁当|べんとう}を{食|た}べてもいいですか', 'はい、どうぞ。', 'すみません、お{弁当|べんとう}はあそこで{食|た}べてください。'],
        ['{中|なか}に{入|はい}ってもいいですか', 'はい、どうぞ。', 'すみません、ちょっと……。'],
        ['トイレに{行|い}ってもいいですか', 'ええ、いいですよ。', '—'],
        ['この{写真|しゃしん}をもらってもいいですか', 'ええ、どうぞ。', 'すみません。{大切|たいせつ}な{写真|しゃしん}ですから……。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — てもいいですか',
      items: [
        'Quên も hoặc đặt sai chỗ: ~~{座|すわ}っていいもですか~~ → **{座|すわ}ってもいいですか**.',
        'Chia sai thể て: {撮|と}ります → **{撮|と}って** (không ~~撮りて~~), {置|お}きます → **{置|お}いて**, {吸|す}います → **{吸|す}って**.',
        'Trả lời **はい、{座|すわ}ってもいいです** đúng ngữ pháp nhưng nghe như "cho phép từ trên xuống" — người lạ hỏi thì đáp **はい、どうぞ**.',
        'Bảng mẫu 表 p.284: 食べてもいいです (lịch sự) = 食べてもいい (thể thường). Bài 10 chỉ cần thể lịch sự.',
      ],
    },

    /* ── ポイント 90 ── */
    { t: 'h', text: 'ポイント 90 — N が Vテ形 います ((Nhìn kìa) N đang V)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'あっ、N が（N2 を）Vて います。',
          vi: 'Tả một việc **đang diễn ra ngay trước mắt**, người nói vừa phát hiện và chỉ cho người nghe. Chủ thể là thông tin MỚI nên dùng **が** (không phải は).',
          examples: [
            { en: 'あっ、サルがバナナを{食|た}べています。', ro: 'A, saru ga banana o tabete imasu.', vi: 'A, con khỉ đang ăn chuối. (câu mẫu của sách)' },
            { en: 'コアラがえさを{食|た}べています。', ro: 'Koara ga esa o tabete imasu.', vi: 'Con koala đang ăn mồi.' },
            { en: '{鳥|とり}が{飛|と}んでいます。', ro: 'Tori ga tonde imasu.', vi: 'Con chim đang bay.' },
            { en: 'ゾウが{水|みず}を{飲|の}んでいます。', ro: 'Zou ga mizu o nonde imasu.', vi: 'Con voi đang uống nước.' },
            { en: 'あそこでパクさんが{写真|しゃしん}を{撮|と}っています。', ro: 'Asoko de Paku-san ga shashin o totte imasu.', vi: 'Đằng kia Park đang chụp ảnh.' },
          ],
        },
        {
          formula: '{何|なに}が／{何|なに}を Vて いますか。',
          vi: 'Câu hỏi: "Con gì đang …?" dùng **{何|なに}が**; "(Nó) đang làm gì?" dùng **{何|なに}をしていますか**.',
          examples: [
            { en: '{何|なに}が{泳|およ}いでいますか。——クマが{泳|およ}いでいます。', ro: 'Nani ga oyoide imasu ka. — Kuma ga oyoide imasu.', vi: 'Con gì đang bơi? — Con gấu đang bơi.' },
            { en: 'パンダは{何|なに}をしていますか。——{寝|ね}ています。', ro: 'Panda wa nani o shite imasu ka. — Nete imasu.', vi: 'Gấu trúc đang làm gì? — Đang ngủ.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — あっ、___が___ています。——本当だ。',
      head: ['Con vật (が)', 'Đang làm gì', 'Câu hoàn chỉnh'],
      rows: [
        ['コアラ', 'えさを{食|た}べます', 'あっ、コアラがえさを{食|た}べています。'],
        ['サル', '{水|みず}の{中|なか}で{休|やす}みます', 'あっ、サルが{水|みず}の{中|なか}で{休|やす}んでいます。'],
        ['パンダ', '{木|き}に{登|のぼ}ります', 'あっ、パンダが{木|き}に{登|のぼ}っています。'],
        ['クマ', '{泳|およ}ぎます', 'あっ、クマが{泳|およ}いでいます。'],
        ['ゾウ', '{水|みず}を{飲|の}みます', 'あっ、ゾウが{水|みず}を{飲|の}んでいます。'],
        ['ペンギン', '{歩|ある}きます', 'あっ、ペンギンが{歩|ある}いています。'],
        ['{鳥|とり}', '{飛|と}びます', 'あっ、{鳥|とり}が{飛|と}んでいます。'],
      ],
    },
    {
      t: 'note',
      title: 'が hay は? — ポイント 90 so với ポイント 64 (Bài 7)',
      items: [
        '**ポイント 64** (Bài 7): パクさん**は**あそこで{電話|でんわ}をかけています — trả lời câu hỏi về một người ĐÃ được nhắc đến (chủ đề は).',
        '**ポイント 90** (Bài 10): あっ、サル**が**バナナを{食|た}べています — người nói vừa THẤY, báo cho người kia (が). Tín hiệu: **あっ／見てください** ở đầu câu.',
        'Người nghe đáp: **{本当|ほんとう}だ** (thật này!) + cảm nhận: かわいいですね／{大|おお}きいですね.',
      ],
    },

    /* ── ポイント 91 ── */
    { t: 'h', text: 'ポイント 91 — まだ Vテ形 いません (Chưa V)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'もう Vましたか。 → はい、もう Vました。／いいえ、まだ Vて いません。',
          vi: 'Bài 6 đã học "chưa" ngắn gọn: **いいえ、まだです**. Bài 10 nói đầy đủ: **まだ + thể て + いません** = việc lẽ ra phải xảy ra nhưng đến giờ **vẫn chưa** xảy ra.',
          examples: [
            { en: 'まだ{昼|ひる}ご{飯|はん}を{食|た}べていません。', ro: 'Mada hirugohan o tabete imasen.', vi: 'Tôi vẫn chưa ăn trưa. (câu mẫu của sách)' },
            { en: 'もうバスのチケットを{買|か}いましたか。——いいえ、まだ{買|か}っていません。', ro: 'Mou basu no chiketto o kaimashita ka. — Iie, mada katte imasen.', vi: 'Bạn mua vé xe buýt chưa? — Chưa, tôi chưa mua.' },
            { en: 'もう{薬|くすり}を{飲|の}みましたか。——はい、もう{飲|の}みました。', ro: 'Mou kusuri o nomimashita ka. — Hai, mou nomimashita.', vi: 'Bạn uống thuốc chưa? — Rồi, tôi uống rồi.' },
            { en: 'パクさんはもう{来|き}ましたか。——いいえ、まだ{来|き}ていません。', ro: 'Paku-san wa mou kimashita ka. — Iie, mada kite imasen.', vi: 'Park đến chưa? — Chưa, vẫn chưa đến.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — もう～ましたか → いいえ、まだ～ていません',
      head: ['Việc', 'Câu hỏi', 'Trả lời "chưa"'],
      rows: [
        ['バスのチケット・{買|か}います', 'もうバスのチケットを{買|か}いましたか。', 'いいえ、まだ{買|か}っていません。'],
        ['お{弁当|べんとう}・{買|か}います', 'もうお{弁当|べんとう}を{買|か}いましたか。', 'いいえ、まだ{買|か}っていません。'],
        ['{薬|くすり}・{飲|の}みます', 'もう{薬|くすり}を{飲|の}みましたか。', 'いいえ、まだ{飲|の}んでいません。'],
        ['パクさん・{来|き}ます', 'パクさんはもう{来|き}ましたか。', 'いいえ、まだ{来|き}ていません。'],
        ['{宿題|しゅくだい}・します', 'もう{宿題|しゅくだい}をしましたか。', 'いいえ、まだしていません。'],
        ['{荷物|にもつ}・{送|おく}ります', 'もう{荷物|にもつ}を{送|おく}りましたか。', 'いいえ、まだ{送|おく}っていません。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — "chưa" KHÔNG phải quá khứ phủ định',
      items: [
        '~~いいえ、まだ{食|た}べませんでした~~ — sai. ませんでした = "(lúc đó) đã không ăn", việc đã khép lại. "Chưa" (còn có thể làm) = **まだ{食|た}べていません**.',
        '**Trả lời ngắn vẫn đúng**: いいえ、まだです (Bài 6). Trả lời dài: いいえ、まだ + Vていません (Bài 10). Thi nói: nói câu dài được điểm cao hơn.',
        'Ba nghĩa của まだ: まだ**です** (chưa — Bài 6) · まだ**あります** (vẫn còn — Bài 7, ポイント 67) · まだ**Vていません** (vẫn chưa — Bài 10).',
      ],
    },

    /* ── ポイント 92 ── */
    { t: 'h', text: 'ポイント 92 — Vテ形 きます (Đi V rồi quay lại)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（ちょっと）（nơi で）N を Vて きます。',
          vi: 'Đi làm V ở chỗ khác **rồi quay lại chỗ này**. Hay dùng khi rời nhóm một lát. Có ちょっと = "một lát thôi". Người ở lại đáp: **はい** / **いってらっしゃい**.',
          examples: [
            { en: 'コンビニでジュースを{買|か}ってきます。', ro: 'Konbini de juusu o katte kimasu.', vi: 'Tôi ra cửa hàng tiện lợi mua nước quả rồi quay lại. (câu mẫu của sách)' },
            { en: 'ちょっとトイレに{行|い}ってきます。', ro: 'Chotto toire ni itte kimasu.', vi: 'Tôi đi vệ sinh một lát.' },
            { en: 'ちょっとたばこを{吸|す}ってきます。', ro: 'Chotto tabako o sutte kimasu.', vi: 'Tôi đi hút điếu thuốc rồi về.' },
            { en: 'ワンさんを{探|さが}してきます。', ro: 'Wan-san o sagashite kimasu.', vi: 'Tôi đi tìm Wang rồi quay lại.' },
            { en: 'アンナさんを{迎|むか}えに{行|い}ってきます。', ro: 'Anna-san o mukae ni itte kimasu.', vi: 'Tôi đi đón Anna rồi về. (迎えに行きます — Bài 7)' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — Bさん、ちょっと___てきます。——はい。',
      head: ['Việc', 'Thể て', 'Câu hoàn chỉnh'],
      rows: [
        ['ジュース・{買|か}います', '{買|か}って', 'ちょっとジュースを{買|か}ってきます。'],
        ['トイレ・{行|い}きます', '{行|い}って', 'ちょっとトイレに{行|い}ってきます。'],
        ['たばこ・{吸|す}います', '{吸|す}って', 'ちょっとたばこを{吸|す}ってきます。'],
        ['ワンさん・{探|さが}します', '{探|さが}して', 'ちょっとワンさんを{探|さが}してきます。'],
        ['アンナさん・{迎|むか}えに{行|い}きます', '{迎|むか}えに{行|い}って', 'ちょっとアンナさんを{迎|むか}えに{行|い}ってきます。'],
        ['お{土産|みやげ}・{見|み}ます', '{見|み}て', 'ちょっとお{土産|みやげ}を{見|み}てきます。'],
      ],
    },
    {
      t: 'note',
      title: 'Hiểu đúng ～てきます',
      items: [
        '{買|か}いに{行|い}きます (Bài 5) = đi (để) mua — không nói có quay lại hay không. {買|か}ってきます = mua xong **quay về đây**.',
        'Câu chào hằng ngày cũng là mẫu này: **{行|い}ってきます** (con đi đây — sẽ về) → **いってらっしゃい** (đi nhé).',
        'Chia thể て đúng trước きます: ~~{買|か}いてきます~~ → **{買|か}ってきます**; ~~{行|い}いてきます~~ → **{行|い}ってきます**.',
      ],
    },

    /* ── ポイント 93 ── */
    { t: 'h', text: 'ポイント 93 — ［N／V{辞書形|じしょけい}こと］ ができます (Ở đây có thể V)' },
    {
      t: 'p',
      text: 'Bài 9 (ポイント 82) dùng mẫu này cho **khả năng của người** (私はスキーができます). Bài 10 dùng cho **khả năng của một nơi**: ở chỗ này có dịch vụ gì, làm được gì. Nhắc lại thể từ điển (辞書形, Bài 9): nhóm 1 đổi âm cuối hàng い → う ({買|か}います → {買|か}う), nhóm 2 bỏ ます + る ({借|か}ります → {借|か}りる), nhóm 3 する／くる.',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（nơi）で N が できます。',
          vi: 'N là danh từ chỉ hoạt động: {食事|しょくじ}, {買|か}い{物|もの}, テニス, サッカー…',
          examples: [
            { en: 'ここで{食事|しょくじ}ができます。', ro: 'Koko de shokuji ga dekimasu.', vi: 'Ở đây có thể ăn uống. (câu mẫu của sách)' },
            { en: 'この{公園|こうえん}でテニスができます。', ro: 'Kono kouen de tenisu ga dekimasu.', vi: 'Ở công viên này chơi tennis được.' },
          ],
        },
        {
          formula: '（nơi）で N を V{辞書形|じしょけい} ことが できます。',
          vi: 'Hoạt động có tân ngữ → dùng thể từ điển + こと.',
          examples: [
            { en: 'あそこできれいな{写真|しゃしん}を{撮|と}ることができます。', ro: 'Asoko de kirei na shashin o toru koto ga dekimasu.', vi: 'Ở đằng kia có thể chụp được ảnh đẹp. (câu mẫu của sách)' },
            { en: 'ここで{観覧車|かんらんしゃ}のチケットを{買|か}うことができます。', ro: 'Koko de kanransha no chiketto o kau koto ga dekimasu.', vi: 'Ở đây có thể mua vé đu quay.' },
            { en: '{受付|うけつけ}でボールを{借|か}りることができます。', ro: 'Uketsuke de booru o kariru koto ga dekimasu.', vi: 'Ở quầy lễ tân có thể mượn bóng.' },
          ],
        },
        {
          formula: 'ここで ～ことが できますか。 → はい、できます。／いいえ、できません。',
          vi: 'Hỏi dịch vụ. Trả lời ngắn chỉ cần **できます／できません**. Muốn chỉ chỗ khác: **あそこで～ことができますよ**.',
          examples: [
            { en: 'ここで{切手|きって}を{買|か}うことができますか。——はい、できます。', ro: 'Koko de kitte o kau koto ga dekimasu ka. — Hai, dekimasu.', vi: 'Ở đây mua tem được không? — Vâng, được.' },
            { en: 'ここで{荷物|にもつ}を{送|おく}ることができますか。——いいえ、できません。', ro: 'Koko de nimotsu o okuru koto ga dekimasu ka. — Iie, dekimasen.', vi: 'Ở đây gửi hàng được không? — Không, không được.' },
            { en: 'お{土産|みやげ}を{買|か}いたいです。——あ、あそこで{買|か}うことができますよ。', ro: 'Omiyage o kaitai desu. — A, asoko de kau koto ga dekimasu yo.', vi: 'Tôi muốn mua quà. — À, mua được ở đằng kia đấy.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — muốn gì / cảm thấy gì → chỉ chỗ làm được',
      head: ['A nói', 'B chỉ chỗ (～ことができますよ)'],
      rows: [
        ['お{土産|みやげ}を{買|か}いたいです。', 'あそこで{買|か}うことができますよ。'],
        ['{自転車|じてんしゃ}に{乗|の}りたいです。', 'あそこで{自転車|じてんしゃ}を{借|か}りることができますよ。'],
        ['{疲|つか}れました。', 'あそこで{休|やす}むことができますよ。'],
        ['おなかがすきました。', 'あそこで{食事|しょくじ}ができますよ。'],
        ['のどがかわきました。', 'あそこで{飲|の}み{物|もの}を{買|か}うことができますよ。'],
        ['{写真|しゃしん}を{撮|と}りたいです。', '{観覧車|かんらんしゃ}からきれいな{写真|しゃしん}を{撮|と}ることができますよ。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — ことができます',
      items: [
        'Dùng thể ます trước こと: ~~{買|か}いますことができます~~ → **{買|か}うことができます** (thể từ điển).',
        'Quên こと: ~~{買|か}うができます~~ → {買|か}う**こと**ができます. Danh từ thì không cần こと: {食事|しょくじ}ができます.',
        'Trợ từ: **が**できます (không ~~をできます~~). Nơi chốn: **で**.',
        'Hỏi "tôi có được phép…?" (xin phép) dùng **～てもいいですか** (89); hỏi "chỗ này có dịch vụ … không?" dùng **～ことができますか** (93).',
      ],
    },

    /* ── ポイント 94 ── */
    { t: 'h', text: 'ポイント 94 — N が {見|み}えます／{聞|き}こえます (Nhìn thấy / nghe thấy)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（nơi）から N が {見|み}えます。',
          vi: 'Cái gì đó **tự lọt vào tầm mắt** (không cần cố nhìn). Đứng ở đâu: **から**. Vật thấy được: **が**.',
          examples: [
            { en: 'ここから{東京|とうきょう}タワーが{見|み}えます。', ro: 'Koko kara Toukyou tawaa ga miemasu.', vi: 'Từ đây nhìn thấy tháp Tokyo. (câu mẫu của sách)' },
            { en: '{教室|きょうしつ}の{窓|まど}から{山|やま}が{見|み}えます。', ro: 'Kyoushitsu no mado kara yama ga miemasu.', vi: 'Từ cửa sổ lớp học nhìn thấy núi.' },
            { en: 'そこから{何|なに}が{見|み}えますか。——{大|おお}きい{橋|はし}が{見|み}えます。', ro: 'Soko kara nani ga miemasu ka. — Ookii hashi ga miemasu.', vi: 'Từ đó bạn thấy gì? — Tôi thấy cây cầu lớn.' },
          ],
        },
        {
          formula: 'N が {聞|き}こえます。',
          vi: 'Âm thanh **tự lọt vào tai**. Tiếng người/con vật: **{声|こえ}**; tiếng đồ vật: **{音|おと}**.',
          examples: [
            { en: '{鳥|とり}の{声|こえ}が{聞|き}こえます。', ro: 'Tori no koe ga kikoemasu.', vi: 'Nghe thấy tiếng chim. (câu mẫu của sách)' },
            { en: '{電車|でんしゃ}の{音|おと}が{聞|き}こえます。', ro: 'Densha no oto ga kikoemasu.', vi: 'Nghe thấy tiếng tàu điện.' },
            { en: 'もしもし、よく{聞|き}こえません。', ro: 'Moshi moshi, yoku kikoemasen.', vi: 'Alô, tôi nghe không rõ.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: '見ます/見えます · 聞きます/聞こえます — so sánh',
      head: ['', 'Chủ động (を)', 'Tự nhiên thấy / nghe (が)'],
      rows: [
        ['Nhìn', 'テレビ**を**{見|み}ます (xem TV — cố ý)', '{富士山|ふじさん}**が**{見|み}えます (núi hiện ra trong tầm mắt)'],
        ['Nghe', '{音楽|おんがく}**を**{聞|き}きます (nghe nhạc — cố ý)', '{音楽|おんがく}**が**{聞|き}こえます (nhạc vọng tới tai)'],
        ['Phủ định', '{見|み}ません (không xem)', '{見|み}えません (không nhìn thấy được — bị che, xa quá)'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — そこから何が見えますか。',
      head: ['Cảnh (sách p.172)', 'Trả lời'],
      rows: [
        ['toà nhà cao', '{高|たか}いビルが{見|み}えます。'],
        ['cây cầu', '{大|おお}きい{橋|はし}が{見|み}えます。'],
        ['con sông', '{川|かわ}が{見|み}えます。'],
        ['tháp', '{東京|とうきょう}タワーが{見|み}えます。'],
        ['núi', '{富士山|ふじさん}が{見|み}えます。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — 見えます／聞こえます',
      items: [
        '~~{富士山|ふじさん}を{見|み}えます~~ → {富士山|ふじさん}**が**{見|み}えます. Hai động từ này KHÔNG đi với を.',
        '~~ここで{見|み}えます~~ → ここ**から**{見|み}えます (đứng ở đâu mà nhìn = から).',
        'Trên điện thoại: よく**{聞|き}こえません** (không nghe rõ), không phải ~~よく{聞|き}きません~~ (không hay nghe).',
      ],
    },

    /* ── ポイント 95 ── */
    { t: 'h', text: 'ポイント 95 — イA‑い→くなります／［ナA／N］ になります (Trở nên …)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'イA（bỏ い）＋ く なります。',
          vi: 'Tính từ đuôi い: đổi **い → く** + なります. Đặc biệt: **いい → よくなります**.',
          examples: [
            { en: '{寒|さむ}くなりました。', ro: 'Samuku narimashita.', vi: 'Trời đã trở lạnh. (câu mẫu của sách)' },
            { en: '{暗|くら}くなりましたね。', ro: 'Kuraku narimashita ne.', vi: 'Trời tối rồi nhỉ.' },
            { en: '{天気|てんき}がよくなりました。', ro: 'Tenki ga yoku narimashita.', vi: 'Thời tiết đã đẹp lên.' },
          ],
        },
        {
          formula: 'ナA ／ N ＋ に なります。',
          vi: 'Tính từ đuôi な và danh từ: + **に** なります.',
          examples: [
            { en: 'もうすぐ{12時|じゅうにじ}になります。', ro: 'Mou sugu juuniji ni narimasu.', vi: 'Sắp 12 giờ rồi. (câu mẫu của sách)' },
            { en: '{町|まち}が{静|しず}かになりました。', ro: 'Machi ga shizuka ni narimashita.', vi: 'Thị trấn đã trở nên yên tĩnh.' },
            { en: '{明日|あした}は{雨|あめ}になります。', ro: 'Ashita wa ame ni narimasu.', vi: 'Ngày mai sẽ mưa (trời chuyển mưa).' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Cột Vなります của bảng 表 p.282–283',
      head: ['Loại', 'Gốc', '→ なります', 'Nghĩa'],
      rows: [
        ['イA', '{大|おお}きい', '{大|おお}きくなります', 'trở nên to'],
        ['イA', 'いい', '※よくなります', 'trở nên tốt'],
        ['イA', '{寒|さむ}い', '{寒|さむ}くなります', 'trở lạnh'],
        ['イA', '{暗|くら}い', '{暗|くら}くなります', 'trở tối'],
        ['ナA', '{静|しず}か', '{静|しず}かになります', 'trở nên yên tĩnh'],
        ['ナA', '{元気|げんき}', '{元気|げんき}になります', 'khoẻ lại'],
        ['N', '{雨|あめ}', '{雨|あめ}になります', 'chuyển mưa'],
        ['N', '{12時|じゅうにじ}', '{12時|じゅうにじ}になります', 'đến 12 giờ'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — nhận xét tình hình → đề xuất (ポイント 95 + ませんか Bài 6)',
      head: ['A: ～なりましたね', 'B: đề xuất', 'A'],
      rows: [
        ['{寒|さむ}くなりましたね。', 'あそこの{喫茶店|きっさてん}でコーヒーを{飲|の}みませんか。', 'そうしましょう。'],
        ['{天気|てんき}がよくなりましたね。', '{外|そと}で{写真|しゃしん}を{撮|と}りませんか。', 'そうしましょう。'],
        ['{暗|くら}くなりましたね。', 'そろそろ{家|いえ}へ{帰|かえ}りませんか。', 'そうしましょう。'],
        ['{12時|じゅうにじ}になりましたね。', 'そろそろ{昼|ひる}ご{飯|はん}を{食|た}べませんか。', 'そうしましょう。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — なります',
      items: [
        '~~{寒|さむ}いになりました~~ → **{寒|さむ}くなりました** (tính từ い không đi với に).',
        '~~{静|しず}かくなりました~~ → **{静|しず}かになりました** (tính từ な không đổi く).',
        '~~いくなりました~~ → **よくなりました** (いい chia từ よい).',
        'Quá khứ **なりました** = đã thay đổi (bây giờ đang ở trạng thái mới): 寒くなりました = trời lạnh rồi. Tương lai / sắp: **なります**: もうすぐ12時になります.',
      ],
    },

    /* ── ポイント 96 ── */
    { t: 'h', text: 'ポイント 96 — N（nơi）を Vます (Đi qua / rẽ ở / băng qua …)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N（nơi）を {渡|わた}ります／{曲|ま}がります／{歩|ある}きます／{通|とお}ります…',
          vi: '**を** chỉ **nơi mà mình di chuyển đi qua** (cầu, đường, góc phố, công viên) — không phải tân ngữ bị tác động. Hướng rẽ: **に** ({右|みぎ}に, {左|ひだり}に).',
          examples: [
            { en: 'あの{橋|はし}を{渡|わた}って、{交差点|こうさてん}を{右|みぎ}に{曲|ま}がってください。', ro: 'Ano hashi o watatte, kousaten o migi ni magatte kudasai.', vi: 'Qua cây cầu kia rồi rẽ phải ở ngã tư. (câu mẫu của sách)' },
            { en: 'この{道|みち}をまっすぐ{行|い}ってください。', ro: 'Kono michi o massugu itte kudasai.', vi: 'Đi thẳng con đường này.' },
            { en: '{2|ふた}つ{目|め}の{角|かど}を{左|ひだり}に{曲|ま}がってください。', ro: 'Futatsume no kado o hidari ni magatte kudasai.', vi: 'Rẽ trái ở góc phố thứ hai.' },
            { en: '{公園|こうえん}を{歩|ある}きました。', ro: 'Kouen o arukimashita.', vi: 'Tôi đã đi dạo (khắp) công viên.' },
          ],
        },
        {
          formula: 'Vて、Vて、～てください。 (chỉ đường nhiều bước)',
          vi: 'Nối các bước bằng thể て (ポイント 83, Bài 9), bước cuối **～てください**.',
          examples: [
            { en: '{駅|えき}を{出|で}て、まっすぐ{行|い}って、{信号|しんごう}を{渡|わた}ってください。', ro: 'Eki o dete, massugu itte, shingou o watatte kudasai.', vi: 'Ra khỏi ga, đi thẳng, rồi qua chỗ đèn giao thông.' },
            { en: '{橋|はし}を{渡|わた}って、{左|ひだり}に{曲|ま}がって、{銀行|ぎんこう}の{前|まえ}で{待|ま}ってください。', ro: 'Hashi o watatte, hidari ni magatte, ginkou no mae de matte kudasai.', vi: 'Qua cầu, rẽ trái, rồi đợi trước ngân hàng.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bộ câu chỉ đường — ghép như lắp gạch',
      head: ['Bước', 'Câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['Hỏi', '{行|い}き{方|かた}がわかりません。{教|おし}えてください。', 'Ikikata ga wakarimasen. Oshiete kudasai.', 'Tôi không biết đường. Chỉ giúp tôi.'],
        ['Hỏi lại vị trí', 'そこから{何|なに}が{見|み}えますか。', 'Soko kara nani ga miemasu ka.', 'Từ đó bạn thấy gì?'],
        ['Đi thẳng', '（この{道|みち}を）まっすぐ{行|い}ってください。', '(Kono michi o) massugu itte kudasai.', 'Đi thẳng (con đường này).'],
        ['Qua', '{橋|はし}／{信号|しんごう}／{道|みち}を{渡|わた}ってください。', 'Hashi / shingou / michi o watatte kudasai.', 'Qua cầu / chỗ đèn / đường.'],
        ['Rẽ', '{交差点|こうさてん}／{角|かど}を{右|みぎ}／{左|ひだり}に{曲|ま}がってください。', 'Kousaten / kado o migi / hidari ni magatte kudasai.', 'Rẽ phải / trái ở ngã tư / góc phố.'],
        ['Thứ mấy', '{2|ふた}つ{目|め}の{信号|しんごう}を{右|みぎ}に{曲|ま}がってください。', 'Futatsume no shingou o migi ni magatte kudasai.', 'Rẽ phải ở đèn thứ hai.'],
        ['Tới nơi', '{銀行|ぎんこう}の{前|まえ}にバスがあります。', 'Ginkou no mae ni basu ga arimasu.', 'Xe buýt ở trước ngân hàng.'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — を chỉ nơi đi qua',
      items: [
        '~~{橋|はし}に{渡|わた}ります~~ → **{橋|はし}を{渡|わた}ります**. ~~{交差点|こうさてん}で{曲|ま}がります~~ → **{交差点|こうさてん}を**{曲|ま}がります.',
        'Hai trợ từ trong một câu rẽ: **{角|かど}を** (rẽ ở đâu) **{右|みぎ}に** (rẽ về hướng nào) {曲|ま}がります.',
        'Phân biệt với nơi đến (**へ／に**): {駅|えき}**へ**{行|い}きます (đi tới ga) ↔ {駅|えき}**を**{出|で}ます (rời ga) ↔ {道|みち}**を**{歩|ある}きます (đi trên đường).',
      ],
    },

    /* ── ポイント 97 ── */
    { t: 'h', text: 'ポイント 97 — N は (đưa tân ngữ lên làm chủ đề — "N thì …")' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N を V → N は（nơi khác で／に）Vてください。',
          vi: 'Khi **từ chối** một lời xin phép rồi chỉ cách khác, người Nhật đưa vật được nói tới lên đầu câu với **は** thay cho を: "hành lý **thì** để đằng kia" — ngầm đối chiếu "ở đây thì không, ở kia thì được".',
          examples: [
            { en: 'ここに{荷物|にもつ}を{置|お}いてもいいですか。——あ、{荷物|にもつ}はあそこに{置|お}いてください。', ro: 'Koko ni nimotsu o oite mo ii desu ka. — A, nimotsu wa asoko ni oite kudasai.', vi: 'Tôi để hành lý ở đây được không? — À, hành lý thì để đằng kia. (câu mẫu của sách)' },
            { en: 'ここでたばこを{吸|す}ってもいいですか。——すみません。たばこは{喫煙所|きつえんじょ}で{吸|す}ってください。', ro: 'Koko de tabako o sutte mo ii desu ka. — Sumimasen. Tabako wa kitsuenjo de sutte kudasai.', vi: 'Hút thuốc ở đây được không? — Xin lỗi. Thuốc lá thì hút ở khu hút thuốc.' },
            { en: 'ここでお{弁当|べんとう}を{食|た}べてもいいですか。——お{弁当|べんとう}はあそこのテーブルで{食|た}べてください。', ro: 'Koko de obentou o tabete mo ii desu ka. — Obentou wa asoko no teeburu de tabete kudasai.', vi: 'Ăn cơm hộp ở đây được không? — Cơm hộp thì ăn ở bàn đằng kia.' },
            { en: 'ここにごみを{捨|す}ててもいいですか。——ごみはうちへ{持|も}って{帰|かえ}ってください。', ro: 'Koko ni gomi o sutete mo ii desu ka. — Gomi wa uchi e motte kaette kudasai.', vi: 'Vứt rác ở đây được không? — Rác thì mang về nhà.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — A xin phép (を) → B chỉ chỗ khác (は)',
      head: ['A: ここで／に～てもいいですか', 'B: N は ～てください'],
      rows: [
        ['ここに{荷物|にもつ}を{置|お}いてもいいですか。', '{荷物|にもつ}はあそこに{置|お}いてください。'],
        ['ここでたばこを{吸|す}ってもいいですか。', 'たばこは{喫煙所|きつえんじょ}で{吸|す}ってください。'],
        ['ここでお{弁当|べんとう}を{食|た}べてもいいですか。', 'お{弁当|べんとう}はあそこのテーブルで{食|た}べてください。'],
        ['ここにごみを{捨|す}ててもいいですか。', 'ごみはうちへ{持|も}って{帰|かえ}ってください。'],
        ['ここで{写真|しゃしん}を{撮|と}ってもいいですか。', '{写真|しゃしん}は{外|そと}で{撮|と}ってください。'],
        ['ここでボールを{借|か}りることができますか。', 'ボールは{受付|うけつけ}で{借|か}りてください。'],
      ],
    },
    {
      t: 'note',
      title: 'Hiểu đúng ポイント 97',
      items: [
        'Không đổi nghĩa cơ bản — chỉ đổi **điểm nhấn**: {荷物|にもつ}**を**あそこに{置|お}いてください (trung tính) ↔ {荷物|にもつ}**は**あそこに{置|お}いてください ("còn hành lý THÌ …", ngầm so sánh với chỗ vừa hỏi).',
        'Khi は thay を thì **bỏ を** hẳn: ~~{荷物|にもつ}をはあそこに…~~ → {荷物|にもつ}**は**あそこに….',
        'Cùng cách đó với phủ định từ chối khéo: {写真|しゃしん}**は**ちょっと…… (ảnh thì không được…) — giống {土曜日|どようび}**は**ちょっと…… của Bài 6.',
      ],
    },

    /* ── Tổng kết ── */
    { t: 'h', text: 'Tổng kết — câu hỏi của Bài 10 và cách trả lời' },
    {
      t: 'table',
      head: ['Câu hỏi / câu nói', 'Tình huống', 'Trả lời mẫu', 'ポイント'],
      rows: [
        ['～ないでください。', 'Bị nhắc / nghe dặn', 'あ、すみません。／はい、わかりました。', '88'],
        ['～てもいいですか。', 'Người khác xin phép', 'はい、どうぞ。／すみません、ちょっと……。', '89'],
        ['{何|なに}が～ていますか。', 'Tả việc đang diễn ra', 'サルがバナナを{食|た}べています。', '90'],
        ['もう～ましたか。', 'Đã … chưa', 'はい、もう～ました。／いいえ、まだ～ていません。', '91'],
        ['ちょっと～てきます。', 'Bạn rời nhóm một lát', 'はい。／いってらっしゃい。', '92'],
        ['ここで～ことができますか。', 'Hỏi dịch vụ', 'はい、できます。／いいえ、できません。', '93'],
        ['そこから{何|なに}が{見|み}えますか。', 'Hỏi vị trí khi lạc', '{大|おお}きい{橋|はし}が{見|み}えます。', '94'],
        ['{寒|さむ}くなりましたね。', 'Nhận xét thay đổi', 'そうですね。～ませんか。', '95'],
        ['どうやって{行|い}きますか。', 'Hỏi đường', '～を{渡|わた}って、～を{右|みぎ}に{曲|ま}がってください。', '96'],
        ['ここに～を～てもいいですか。', 'Từ chối, chỉ chỗ khác', 'N はあそこで～てください。', '97'],
      ],
    },
    {
      t: 'build',
      id: 'b10-np-ghep',
      title: 'Ghép câu — dùng đủ 10 điểm ngữ pháp',
      items: [
        { vi: 'Xin đừng vào đó.', chips: ['そこに', '{入|はい}らないで', 'ください', '{入|はい}って', 'を'], answer: ['そこに', '{入|はい}らないで', 'ください'], ro: 'Soko ni hairanaide kudasai.' },
        { vi: 'Đừng trễ giờ tập hợp.', chips: ['{集合時間|しゅうごうじかん}に', '{遅|おく}れないで', 'ください', '{遅|おく}れて', 'を'], answer: ['{集合時間|しゅうごうじかん}に', '{遅|おく}れないで', 'ください'], ro: 'Shuugou jikan ni okurenaide kudasai.' },
        { vi: 'Tôi ngồi bên cạnh được không?', chips: ['{隣|となり}に', '{座|すわ}っても', 'いいですか', '{座|すわ}りても', 'を'], answer: ['{隣|となり}に', '{座|すわ}っても', 'いいですか'], ro: 'Tonari ni suwatte mo ii desu ka.' },
        { vi: 'A, con khỉ đang ăn chuối.', chips: ['あっ、', 'サルが', 'バナナを', '{食|た}べています', 'サルは', '{食|た}べます'], answer: ['あっ、', 'サルが', 'バナナを', '{食|た}べています'], ro: 'A, saru ga banana o tabete imasu.' },
        { vi: 'Tôi vẫn chưa mua vé xe buýt.', chips: ['まだ', 'バスの', 'チケットを', '{買|か}っていません', '{買|か}いませんでした', 'もう'], answer: ['まだ', 'バスの', 'チケットを', '{買|か}っていません'], ro: 'Mada basu no chiketto o katte imasen.' },
        { vi: 'Tôi đi mua nước quả rồi quay lại.', chips: ['ちょっと', 'ジュースを', '{買|か}って', 'きます', '{買|か}いに', 'いきます'], answer: ['ちょっと', 'ジュースを', '{買|か}って', 'きます'], ro: 'Chotto juusu o katte kimasu.' },
        { vi: 'Ở đây có thể mua vé đu quay không?', chips: ['ここで', '{観覧車|かんらんしゃ}の', 'チケットを', '{買|か}う', 'ことが', 'できますか', '{買|か}います', 'を'], answer: ['ここで', '{観覧車|かんらんしゃ}の', 'チケットを', '{買|か}う', 'ことが', 'できますか'], ro: 'Koko de kanransha no chiketto o kau koto ga dekimasu ka.' },
        { vi: 'Từ đây nhìn thấy tháp Tokyo.', chips: ['ここから', '{東京|とうきょう}タワーが', '{見|み}えます', '{東京|とうきょう}タワーを', 'ここで'], answer: ['ここから', '{東京|とうきょう}タワーが', '{見|み}えます'], ro: 'Koko kara Toukyou tawaa ga miemasu.' },
        { vi: 'Nghe thấy tiếng chim.', chips: ['{鳥|とり}の', '{声|こえ}が', '{聞|き}こえます', '{音|おと}が', '{聞|き}きます'], answer: ['{鳥|とり}の', '{声|こえ}が', '{聞|き}こえます'], ro: 'Tori no koe ga kikoemasu.' },
        { vi: 'Trời trở lạnh rồi nhỉ.', chips: ['{寒|さむ}く', 'なりました', 'ね', '{寒|さむ}いに', 'よ'], answer: ['{寒|さむ}く', 'なりました', 'ね'], ro: 'Samuku narimashita ne.' },
        { vi: 'Sắp 12 giờ rồi.', chips: ['もうすぐ', '{12時|じゅうにじ}に', 'なります', '{12時|じゅうにじ}く', 'まだ'], answer: ['もうすぐ', '{12時|じゅうにじ}に', 'なります'], ro: 'Mou sugu juuniji ni narimasu.' },
        { vi: 'Qua cầu rồi rẽ trái.', chips: ['{橋|はし}を', '{渡|わた}って、', '{左|ひだり}に', '{曲|ま}がってください', '{橋|はし}に', '{左|ひだり}を'], answer: ['{橋|はし}を', '{渡|わた}って、', '{左|ひだり}に', '{曲|ま}がってください'], ro: 'Hashi o watatte, hidari ni magatte kudasai.' },
        { vi: 'Rẽ phải ở ngã tư thứ hai.', chips: ['{2|ふた}つ{目|め}の', '{交差点|こうさてん}を', '{右|みぎ}に', '{曲|ま}がってください', '{交差点|こうさてん}で'], answer: ['{2|ふた}つ{目|め}の', '{交差点|こうさてん}を', '{右|みぎ}に', '{曲|ま}がってください'], ro: 'Futatsume no kousaten o migi ni magatte kudasai.' },
        { vi: 'Hành lý thì để đằng kia.', chips: ['{荷物|にもつ}は', 'あそこに', '{置|お}いてください', '{荷物|にもつ}を', '{置|お}かないで'], answer: ['{荷物|にもつ}は', 'あそこに', '{置|お}いてください'], ro: 'Nimotsu wa asoko ni oite kudasai.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b10-np-kiem',
      title: 'Kiểm tra nhanh ngữ pháp Bài 10',
      items: [
        { q: 'Thể ない của {吸|す}います là:', options: ['すあない', 'すわない', 'すいない', 'すまない'], correct: 1, why: 'Nhóm 1, âm い → **わ**: すわない.' },
        { q: 'Thể ない của {来|き}ます là:', options: ['きない', 'くない', 'こない', 'きらない'], correct: 2, why: 'Nhóm 3 đặc biệt: {来|こ}ない.' },
        { q: '"Xin đừng chụp ảnh":', options: ['{写真|しゃしん}を{撮|と}らないでください。', '{写真|しゃしん}を{撮|と}らなくてください。', '{写真|しゃしん}を{撮|と}りませんでください。', '{写真|しゃしん}を{撮|と}ってください。'], correct: 0, why: 'Vない + **で**ください (ポイント 88).' },
        { q: '「{窓|まど}を{開|あ}けてもいいですか。」 — đồng ý lịch sự:', options: ['はい、どうぞ。', 'はい、{開|あ}けます。', 'いいえ、まだです。', 'あ、すみません。'], correct: 0, why: 'Cho phép: **はい、どうぞ** (ポイント 89).' },
        { q: 'Thấy con voi đang uống nước, bạn nói:', options: ['あっ、ゾウは{水|みず}を{飲|の}みます。', 'あっ、ゾウが{水|みず}を{飲|の}んでいます。', 'あっ、ゾウを{水|みず}が{飲|の}んでいます。', 'あっ、ゾウが{水|みず}を{飲|の}みました。'], correct: 1, why: 'Việc đang diễn ra trước mắt: N **が** Vています (ポイント 90).' },
        { q: '「もうお{弁当|べんとう}を{買|か}いましたか。」 — bạn CHƯA mua:', options: ['いいえ、{買|か}いませんでした。', 'いいえ、まだ{買|か}っていません。', 'はい、まだ{買|か}いました。', 'いいえ、もう{買|か}いません。'], correct: 1, why: 'Chưa = **まだVていません** (ポイント 91).' },
        { q: '"Tôi đi vệ sinh một lát (rồi quay lại)":', options: ['ちょっとトイレに{行|い}きます。', 'ちょっとトイレに{行|い}ってきます。', 'ちょっとトイレに{行|い}きにきます。', 'ちょっとトイレに{行|い}かないでください。'], correct: 1, why: 'Đi rồi quay lại: **Vてきます** (ポイント 92).' },
        { q: '「ここで{切手|きって}を＿ことができますか。」', options: ['{買|か}います', '{買|か}う', '{買|か}って', '{買|か}わない'], correct: 1, why: 'Thể từ điển + こと (ポイント 93).' },
        { q: '「ここから{富士山|ふじさん}＿{見|み}えます。」', options: ['を', 'が', 'に', 'で'], correct: 1, why: '見えます／聞こえます đi với **が** (ポイント 94).' },
        { q: '"Trời trở nên yên tĩnh":', options: ['{静|しず}かくなりました。', '{静|しず}かになりました。', '{静|しず}かいになりました。', '{静|しず}かでなりました。'], correct: 1, why: 'Tính từ な + **に**なります (ポイント 95).' },
        { q: '"Thời tiết đẹp lên rồi":', options: ['{天気|てんき}がいいになりました。', '{天気|てんき}がいくなりました。', '{天気|てんき}がよくなりました。', '{天気|てんき}がよいになりました。'], correct: 2, why: 'いい → **よく**なります (ngoại lệ).' },
        { q: '「あの{橋|はし}＿{渡|わた}ってください。」', options: ['に', 'を', 'で', 'へ'], correct: 1, why: 'Nơi đi qua → **を** (ポイント 96).' },
        { q: '「{角|かど}を{右|みぎ}＿{曲|ま}がってください。」', options: ['を', 'で', 'に', 'が'], correct: 2, why: 'Hướng rẽ → **に**; chỗ rẽ → を.' },
        { q: 'Bị hỏi 「ここにごみを{捨|す}ててもいいですか」, bạn chỉ cách khác:', options: ['ごみをうちへ{持|も}って{帰|かえ}ってください。', 'ごみはうちへ{持|も}って{帰|かえ}ってください。', 'ごみがうちへ{持|も}って{帰|かえ}ってください。', 'ごみはうちへ{持|も}って{帰|かえ}らないでください。'], correct: 1, why: 'Đưa tân ngữ lên làm chủ đề đối chiếu: **N は** ～てください (ポイント 97).' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const KANJI: Lesson = {
  id: 'b10-kanji',
  kind: 'kanji',
  title: 'Chữ Hán — trong từ vựng Bài 10',
  goal: 'Nhận mặt và đọc đúng mọi chữ Hán trong 70 từ của Bài 10 (chỉ đường, nơi công cộng, sở thú), đọc được câu không furigana như đề thi, và viết tay được các chữ ✍ hay gặp.',
  minutes: 35,
  blocks: [
    {
      t: 'p',
      text: 'Phần Reading của đề thi có **4 từ chữ Hán gạch chân, KHÔNG furigana (12 điểm)** — đó là chỗ nhiều bạn mất điểm. Học theo **cả từ** ({交差点|こうさてん}, {動物園|どうぶつえん}) chứ đừng học chữ rời. **Âm On** (音, gốc Hán) thường dùng khi hai chữ Hán đứng cạnh nhau; **âm Kun** (訓, âm Nhật) khi chữ đứng một mình hoặc có đuôi kana ({橋|はし}, {曲|ま}がります). Cột **Mức**: 👁 **nhận mặt** = đọc và hiểu là đủ (ưu tiên cho phần đọc); ✍ **nên viết** = ít nét, gặp rất nhiều, nên tập viết tay.',
    },
    {
      t: 'table',
      caption: '1. Chỉ đường & giác quan',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài', 'Mức'],
      rows: [
        ['右', 'ウ・ユウ', 'みぎ', 'HỮU (phải)', '{右|みぎ}', '✍'],
        ['左', 'サ', 'ひだり', 'TẢ (trái)', '{左|ひだり}', '✍'],
        ['目', 'モク', 'め', 'MỤC (mắt; thứ)', '～つ{目|め}', '✍'],
        ['見', 'ケン', 'み(る)・み(える)', 'KIẾN (thấy)', '{見|み}えます', '✍'],
        ['角', 'カク', 'かど・つの', 'GIÁC (góc; sừng)', '{角|かど}', '👁'],
        ['交', 'コウ', 'まじ(わる)', 'GIAO (giao nhau)', '{交差点|こうさてん}', '👁'],
        ['差', 'サ', 'さ(す)', 'SAI (chênh)', '{交差点|こうさてん}', '👁'],
        ['点', 'テン', '—', 'ĐIỂM', '{交差点|こうさてん}', '👁'],
        ['信', 'シン', '—', 'TÍN (tin)', '{信号|しんごう}', '👁'],
        ['号', 'ゴウ', '—', 'HIỆU (số hiệu)', '{信号|しんごう}', '👁'],
        ['橋', 'キョウ', 'はし', 'KIỀU (cầu)', '{橋|はし}', '👁'],
        ['道', 'ドウ', 'みち', 'ĐẠO (đường)', '{道|みち}', '👁'],
        ['曲', 'キョク', 'ま(がる)', 'KHÚC (cong)', '{曲|ま}がります', '👁'],
        ['渡', 'ト', 'わた(る)', 'ĐỘ (qua sông)', '{渡|わた}ります', '👁'],
        ['聞', 'ブン', 'き(く)・き(こえる)', 'VĂN (nghe)', '{聞|き}こえます', '👁'],
        ['音', 'オン', 'おと', 'ÂM (tiếng)', '{音|おと}', '👁'],
        ['声', 'セイ', 'こえ', 'THANH (giọng)', '{声|こえ}', '👁'],
      ],
    },
    {
      t: 'table',
      caption: '2. Hành động nơi công cộng',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài', 'Mức'],
      rows: [
        ['立', 'リツ', 'た(つ)', 'LẬP (đứng)', '{立|た}ちます', '✍'],
        ['入', 'ニュウ', 'はい(る)・い(れる)', 'NHẬP (vào)', '{入|はい}ります · {入|い}り{口|ぐち}', '✍'],
        ['休', 'キュウ', 'やす(む)', 'HƯU (nghỉ)', '{休|やす}みます', '✍'],
        ['探', 'タン', 'さが(す)', 'THÁM (tìm)', '{探|さが}します', '👁'],
        ['飲', 'イン', 'の(む)', 'ẨM (uống)', '{飲|の}みます', '👁'],
        ['薬', 'ヤク', 'くすり', 'DƯỢC (thuốc)', '{薬|くすり}', '👁'],
        ['押', 'オウ', 'お(す)', 'ÁP (đẩy)', '{押|お}します', '👁'],
        ['座', 'ザ', 'すわ(る)', 'TOẠ (ngồi)', '{座|すわ}ります', '👁'],
        ['持', 'ジ', 'も(つ)', 'TRÌ (cầm)', '{持|も}って{帰|かえ}ります', '👁'],
        ['帰', 'キ', 'かえ(る)', 'QUY (về)', '{持|も}って{帰|かえ}ります', '👁'],
        ['遅', 'チ', 'おく(れる)・おそ(い)', 'TRÌ (muộn)', '{遅|おく}れます', '👁'],
        ['捨', 'シャ', 'す(てる)', 'XẢ (vứt)', '{捨|す}てます', '👁'],
        ['集', 'シュウ', 'あつ(まる)', 'TẬP (tụ lại)', '{集合|しゅうごう}します', '👁'],
        ['合', 'ゴウ・ガッ', 'あ(う)', 'HỢP', '{集合|しゅうごう} (ごう)', '👁'],
      ],
    },
    {
      t: 'table',
      caption: '3. Người, đồ vật, tính chất',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài', 'Mức'],
      rows: [
        ['手', 'シュ', 'て', 'THỦ (tay)', '{手|て}', '✍'],
        ['大', 'ダイ・タイ', 'おお(きい)', 'ĐẠI (to)', '{大切|たいせつ} (**たい**)', '✍'],
        ['土', 'ド・ト', 'つち', 'THỔ (đất)', 'お{土産|みやげ}', '✍'],
        ['客', 'キャク', '—', 'KHÁCH', 'お{客|きゃく}さん', '👁'],
        ['荷', 'カ', 'に', 'HÀ (hàng)', '{荷物|にもつ}', '👁'],
        ['物', 'ブツ・モツ', 'もの', 'VẬT (đồ)', '{荷物|にもつ} (モツ) · {動物|どうぶつ} (ブツ)', '👁'],
        ['他', 'タ', 'ほか', 'THA (khác)', '{他|ほか}', '👁'],
        ['皆', 'カイ', 'みな', 'GIAI (tất cả)', '{皆|みな}さん', '👁'],
        ['産', 'サン', 'う(む)', 'SẢN', 'お{土産|みやげ}', '👁'],
        ['危', 'キ', 'あぶ(ない)', 'NGUY', '{危|あぶ}ない', '👁'],
        ['切', 'セツ', 'き(る)', 'THIẾT (cắt; tha thiết)', '{大切|たいせつ}', '👁'],
        ['迷', 'メイ', 'まよ(う)', 'MÊ (lạc)', '{迷惑|めいわく}', '👁'],
        ['惑', 'ワク', 'まど(う)', 'HOẶC (bối rối)', '{迷惑|めいわく}', '👁'],
      ],
    },
    {
      t: 'table',
      caption: '4. Sở thú',
      head: ['Chữ', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài', 'Mức'],
      rows: [
        ['口', 'コウ', 'くち', 'KHẨU (miệng; cửa)', '{入|い}り{口|ぐち} (ぐち)', '✍'],
        ['出', 'シュツ', 'で(る)・だ(す)', 'XUẤT (ra)', '{出口|でぐち}', '✍'],
        ['車', 'シャ', 'くるま', 'XA (xe)', '{観覧車|かんらんしゃ}', '✍'],
        ['本', 'ホン', 'もと', 'BẢN (gốc; sách)', '{本当|ほんとう}', '✍'],
        ['動', 'ドウ', 'うご(く)', 'ĐỘNG', '{動物園|どうぶつえん}', '👁'],
        ['園', 'エン', 'その', 'VIÊN (vườn)', '{動物園|どうぶつえん}', '👁'],
        ['鳥', 'チョウ', 'とり', 'ĐIỂU (chim)', '{鳥|とり}', '👁'],
        ['観', 'カン', '—', 'QUAN (xem)', '{観覧車|かんらんしゃ}', '👁'],
        ['覧', 'ラン', '—', 'LÃM (ngắm)', '{観覧車|かんらんしゃ}', '👁'],
        ['歩', 'ホ', 'ある(く)', 'BỘ (đi bộ)', '{歩|ある}きます', '👁'],
        ['飛', 'ヒ', 'と(ぶ)', 'PHI (bay)', '{飛|と}びます', '👁'],
        ['疲', 'ヒ', 'つか(れる)', 'BÌ (mệt)', '{疲|つか}れます', '👁'],
        ['痛', 'ツウ', 'いた(い)', 'THỐNG (đau)', '{痛|いた}い', '👁'],
        ['暗', 'アン', 'くら(い)', 'ÁM (tối)', '{暗|くら}い', '👁'],
        ['当', 'トウ', 'あ(たる)', 'ĐƯƠNG', '{本当|ほんとう}', '👁'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ',
      items: [
        '**Hán Việt đoán nghĩa**: 交差点 = GIAO SAI ĐIỂM (điểm giao nhau = ngã tư), 信号 = TÍN HIỆU, 集合 = TẬP HỢP, 迷惑 = MÊ HOẶC (làm người ta rối = phiền), 動物園 = ĐỘNG VẬT VIÊN, 観覧車 = QUAN LÃM XA (xe để ngắm cảnh = đu quay), 本当 = BẢN ĐƯƠNG (đúng là thế).',
        '**右 và 左** gần giống nhau: 右 có **口** (miệng — tay phải cầm đũa đưa vào miệng), 左 có **工**.',
        '**入 ↔ 人**: 入 (vào) nét trái ngắn, nét phải dài và cao hơn; 人 (người) nét trái dài.',
        '**Đọc đặc biệt**: お土産 **みやげ** (đọc cả cụm, không đọc từng chữ) · 入り口 いり**ぐち** (くち → ぐち) · 大切 **たい**せつ (không phải ~~だい~~) · 集合 しゅう**ごう** · 本当 ほん**とう**.',
      ],
    },

    /* ── Đứng riêng hay đứng chung ── */
    { t: 'h', text: 'Đứng riêng hay đứng chung — một chữ, hai cách đọc' },
    {
      t: 'p',
      text: 'Cùng một chữ Hán, **đứng riêng** (thường có đuôi kana) thì đọc âm **Kun**; **ghép với chữ Hán khác** thì thường đọc âm **On**. Bảng dưới đây lấy chữ của Bài 10, cột phải là những từ ghép bạn sẽ gặp rất sớm (nhiều từ đã học ở bài trước) — đọc qua để khi gặp chữ quen trong từ lạ vẫn đoán được âm.',
    },
    {
      t: 'table',
      caption: 'Kun khi đứng riêng ↔ On trong từ ghép',
      head: ['Chữ', 'Đứng riêng (Kun)', 'Trong từ ghép (On)'],
      rows: [
        ['右', '{右|みぎ} — bên phải', '{左右|さゆう} — trái phải'],
        ['角', '{角|かど} — góc phố', '{三角|さんかく} — hình tam giác · {四角|しかく} — hình vuông'],
        ['橋', '{橋|はし} — cây cầu', '{歩道橋|ほどうきょう} — cầu vượt cho người đi bộ'],
        ['道', '{道|みち} — con đường', '{北海道|ほっかいどう} — Hokkaido · {書道|しょどう} — thư pháp (B9) · {歩道|ほどう} — vỉa hè'],
        ['目', '{目|め} — mắt · ～つ{目|め} — thứ ~', '{科目|かもく} — môn học'],
        ['見', '{見|み}ます・{見|み}えます — xem, thấy', '{見学|けんがく} — tham quan học tập · {意見|いけん} — ý kiến'],
        ['聞', '{聞|き}きます・{聞|き}こえます — nghe', '{新聞|しんぶん} — tờ báo'],
        ['音', '{音|おと} — tiếng động', '{音楽|おんがく} — âm nhạc · {発音|はつおん} — phát âm'],
        ['声', '{声|こえ} — giọng, tiếng', '{音声|おんせい} — âm thanh (giọng nói)'],
        ['曲', '{曲|ま}がります — rẽ', '{曲|きょく} — bản nhạc · {作曲|さっきょく} — sáng tác nhạc'],
        ['飲', '{飲|の}みます — uống', '{飲食|いんしょく} — ăn uống'],
        ['薬', '{薬|くすり} — thuốc', '{薬局|やっきょく} — hiệu thuốc (やく → **やっ**)'],
        ['座', '{座|すわ}ります — ngồi', '{座席|ざせき} — chỗ ngồi'],
        ['立', '{立|た}ちます — đứng', '{国立|こくりつ} — quốc lập · {私立|しりつ} — tư thục'],
        ['入', '{入|はい}ります — vào · {入|い}り{口|ぐち} — lối vào', '{入学|にゅうがく} — nhập học'],
        ['帰', '{帰|かえ}ります — về', '{帰国|きこく} — về nước'],
        ['遅', '{遅|おく}れます — muộn', '{遅刻|ちこく} — đi học/làm muộn'],
        ['集', '{集|あつ}まります — tụ tập', '{集合|しゅうごう} — tập hợp'],
        ['手', '{手|て} — tay', '{歌手|かしゅ} — ca sĩ (B6) · {上手|じょうず} — giỏi (đặc biệt)'],
        ['物', '{物|もの} — đồ vật · {食|た}べ{物|もの}', '{動物|どうぶつ} — động vật (ブツ) · {荷物|にもつ} — hành lý (モツ)'],
        ['危', '{危|あぶ}ない — nguy hiểm', '{危険|きけん} — nguy hiểm (biển báo)'],
        ['大', '{大|おお}きい — to', '{大学|だいがく} — đại học (ダイ) · {大切|たいせつ} — quan trọng (タイ)'],
        ['切', '{切|き}ります — cắt', '{大切|たいせつ} — quan trọng · {親切|しんせつ} — tử tế (B8)'],
        ['動', '{動|うご}きます — chuyển động', '{動物|どうぶつ} — động vật · {運動|うんどう} — vận động'],
        ['口', '{口|くち} — miệng', '{人口|じんこう} — dân số'],
        ['出', '{出|で}ます — ra', '{出発|しゅっぱつ} — xuất phát (シュツ → **シュッ**)'],
        ['車', '{車|くるま} — ô tô', '{電車|でんしゃ} — tàu điện · {自転車|じてんしゃ} — xe đạp · {観覧車|かんらんしゃ}'],
        ['歩', '{歩|ある}きます — đi bộ', '{歩道|ほどう} — vỉa hè · {散歩|さんぽ} — đi dạo (ホ → **ぽ**)'],
        ['飛', '{飛|と}びます — bay', '{飛行機|ひこうき} — máy bay'],
        ['休', '{休|やす}みます — nghỉ', '{休日|きゅうじつ} — ngày nghỉ'],
        ['痛', '{痛|いた}い — đau', '{頭痛|ずつう} — đau đầu'],
        ['暗', '{暗|くら}い — tối', '{暗記|あんき} — học thuộc lòng'],
        ['土', '{土|つち} — đất', '{土曜日|どようび} — thứ Bảy · お{土産|みやげ} (đọc cả cụm)'],
      ],
    },
    {
      t: 'note',
      title: 'Cách đọc bất quy tắc hay gặp',
      items: [
        '**Đọc cả cụm (熟字訓)** — không ghép từ âm từng chữ: お{土産|みやげ} (~~どさん~~), {上手|じょうず}, {下手|へた}, {今日|きょう}, {明日|あした}, {大人|おとな}.',
        '**Biến âm đục** khi ghép: {入|い}り + {口|くち} → いり**ぐち**; {飲|の}み + {物|もの} → のみもの (không đục); {本|ほん} + {屋|や} → ほんや. Không có quy tắc chắc chắn — học theo từ.',
        '**Âm ngắt っ** khi On gặp phụ âm k/t/p: {薬|やく} + {局|きょく} → **やっ**きょく; {出|しゅつ} + {発|はつ} → **しゅっ**ぱつ; {一|いち} + {緒|しょ} → **いっ**しょ (B6).',
        '**Một chữ nhiều âm On**: 大 = ダイ ({大学|だいがく}) / タイ ({大切|たいせつ}); 物 = ブツ ({動物|どうぶつ}) / モツ ({荷物|にもつ}); 合 = ゴウ ({集合|しゅうごう}) / あい ({試合|しあい}, Kun).',
      ],
    },

    {
      t: 'mcq',
      id: 'b10-kj-doc',
      title: 'Đọc chữ Hán — chọn cách đọc đúng',
      items: [
        { q: '交差点', options: ['こうさてん', 'こうさでん', 'こさてん', 'まじさてん'], correct: 0, why: '交 コウ + 差 サ + 点 テン = **こうさてん**.' },
        { q: '信号', options: ['しんご', 'しんごう', 'しんこう', 'しんがう'], correct: 1, why: '**しんごう** (trường âm ごう).' },
        { q: '右', options: ['ひだり', 'みぎ', 'うえ', 'まえ'], correct: 1, why: '右 **みぎ** — phải; 左 ひだり — trái.' },
        { q: '角', options: ['かく', 'かど', 'つの', 'すみ'], correct: 1, why: 'Góc phố (đứng riêng) = **かど**.' },
        { q: '橋', options: ['はし', 'ばし', 'きょう', 'わたし'], correct: 0, why: 'Đứng riêng = **はし**.' },
        { q: '聞こえます', options: ['ききこえます', 'きこえます', 'もんこえます', 'きくえます'], correct: 1, why: '聞 き + こえます = **きこえます**.' },
        { q: '荷物', options: ['にもの', 'かぶつ', 'にもつ', 'にぶつ'], correct: 2, why: '物 đọc **モツ** ở đây: にもつ.' },
        { q: 'お土産', options: ['おどさん', 'おみやげ', 'おつちさん', 'おどみやげ'], correct: 1, why: 'Đọc cả cụm: **おみやげ**.' },
        { q: '大切', options: ['だいせつ', 'たいせつ', 'おおきり', 'たいぎり'], correct: 1, why: '大 đọc **タイ** ở đây: たいせつ.' },
        { q: '迷惑', options: ['めいわく', 'まよわく', 'めわく', 'めいわ'], correct: 0, why: '**めいわく** — phiền.' },
        { q: '集合', options: ['しゅうあい', 'しゅうごう', 'しゅごう', 'あつごう'], correct: 1, why: '**しゅうごう** — tập hợp.' },
        { q: '遅れます', options: ['おそれます', 'おくれます', 'ちれます', 'おくります'], correct: 1, why: 'Muộn (giờ) = **おくれます**. おそい (遅い) là "chậm, muộn" tính từ.' },
        { q: '動物園', options: ['どうぶつえん', 'どうもつえん', 'どぶつえん', 'うごぶつえん'], correct: 0, why: '**どうぶつえん**.' },
        { q: '入り口', options: ['いりくち', 'はいりぐち', 'いりぐち', 'にゅうぐち'], correct: 2, why: 'くち → **ぐち**: いりぐち.' },
        { q: '出口', options: ['でくち', 'でぐち', 'しゅっこう', 'だしぐち'], correct: 1, why: '**でぐち** — lối ra.' },
        { q: '観覧車', options: ['かんらんしゃ', 'かんらんくるま', 'けんらんしゃ', 'かんらしゃ'], correct: 0, why: '**かんらんしゃ** — đu quay.' },
        { q: '疲れます', options: ['ひれます', 'つかれます', 'つかります', 'いたれます'], correct: 1, why: '**つかれます** — mệt.' },
        { q: '本当', options: ['ほんと', 'ほんとう', 'もとあたり', 'ほんどう'], correct: 1, why: '**ほんとう** — thật (khẩu ngữ hay rút gọn ほんと).' },
        { q: '危ない', options: ['あぶない', 'きない', 'あやない', 'あぶらない'], correct: 0, why: '**あぶない** — nguy hiểm.' },
        { q: '座ります', options: ['ざります', 'すわります', 'すいります', 'たちます'], correct: 1, why: '**すわります** — ngồi. (立ちます = đứng)' },
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
      id: 'b10-doc-kanji',
      title: 'Đọc to từng câu — chữ Hán Bài 10',
      note: 'Mỗi câu có ít nhất một từ chữ Hán của Bài 10. Chỗ hay sai: 交差点 こうさてん, 信号 しんごう, 荷物 にもつ, お土産 おみやげ, 大切 たいせつ, 入り口 いりぐち.',
      items: [
        { text: 'つぎの{交差点|こうさてん}を{右|みぎ}にまがってください。', ro: 'Tsugi no kousaten o migi ni magatte kudasai.', vi: 'Đến ngã tư tiếp theo thì rẽ phải.' },
        { text: 'ふたつ{目|め}の{信号|しんごう}を{左|ひだり}にまがります。', ro: 'Futatsume no shingou o hidari ni magarimasu.', vi: 'Rẽ trái ở đèn giao thông thứ hai.' },
        { text: 'あの{橋|はし}を{渡|わた}って、まっすぐいってください。', ro: 'Ano hashi o watatte, massugu itte kudasai.', vi: 'Qua cây cầu kia rồi đi thẳng.' },
        { text: 'この{道|みち}をまっすぐ{歩|ある}きます。', ro: 'Kono michi o massugu arukimasu.', vi: 'Đi bộ thẳng con đường này.' },
        { text: 'ぎんこうの{角|かど}にバスがあります。', ro: 'Ginkou no kado ni basu ga arimasu.', vi: 'Xe buýt ở góc ngân hàng.' },
        { text: 'ここからふじさんが{見|み}えます。', ro: 'Koko kara Fujisan ga miemasu.', vi: 'Từ đây nhìn thấy núi Phú Sĩ.' },
        { text: 'とりの{声|こえ}が{聞|き}こえます。', ro: 'Tori no koe ga kikoemasu.', vi: 'Nghe thấy tiếng chim.' },
        { text: 'くるまの{音|おと}が大きいです。', ro: 'Kuruma no oto ga ookii desu.', vi: 'Tiếng xe to.' },
        { text: 'もう{薬|くすり}を{飲|の}みましたか。', ro: 'Mou kusuri o nomimashita ka.', vi: 'Bạn uống thuốc chưa?' },
        { text: 'ここに{荷物|にもつ}をおいてもいいですか。', ro: 'Koko ni nimotsu o oite mo ii desu ka.', vi: 'Tôi để hành lý ở đây được không?' },
        { text: 'となりに{座|すわ}ってもいいですか。', ro: 'Tonari ni suwatte mo ii desu ka.', vi: 'Tôi ngồi bên cạnh được không?' },
        { text: 'バスの中で{立|た}たないでください。', ro: 'Basu no naka de tatanaide kudasai.', vi: 'Trong xe buýt đừng đứng lên.' },
        { text: 'しゅうごうじかんに{遅|おく}れないでください。', ro: 'Shuugou jikan ni okurenaide kudasai.', vi: 'Đừng trễ giờ tập hợp.' },
        { text: '{危|あぶ}ないですから、まえの人を{押|お}さないでください。', ro: 'Abunai desu kara, mae no hito o osanaide kudasai.', vi: 'Nguy hiểm nên đừng đẩy người phía trước.' },
        { text: 'このチケットは{大切|たいせつ}です。', ro: 'Kono chiketto wa taisetsu desu.', vi: 'Vé này quan trọng.' },
        { text: 'ほかのお{客|きゃく}さんに{迷惑|めいわく}です。', ro: 'Hoka no okyakusan ni meiwaku desu.', vi: 'Làm phiền những khách khác.' },
        { text: 'ごみはうちへ{持|も}って{帰|かえ}ってください。', ro: 'Gomi wa uchi e motte kaette kudasai.', vi: 'Rác thì mang về nhà.' },
        { text: '{皆|みな}さん、はちじに{集合|しゅうごう}してください。', ro: 'Minasan, hachiji ni shuugou shite kudasai.', vi: 'Mọi người tập hợp lúc 8 giờ nhé.' },
        { text: 'かぞくにお{土産|みやげ}をかいたいです。', ro: 'Kazoku ni omiyage o kaitai desu.', vi: 'Tôi muốn mua quà cho gia đình.' },
        { text: 'にちようび、{動物園|どうぶつえん}へいきました。', ro: 'Nichiyoubi, doubutsuen e ikimashita.', vi: 'Chủ Nhật tôi đi sở thú.' },
        { text: '{入|い}り{口|ぐち}でちずをもらいました。', ro: 'Iriguchi de chizu o moraimashita.', vi: 'Tôi nhận bản đồ ở lối vào.' },
        { text: '{出口|でぐち}はどこですか。', ro: 'Deguchi wa doko desu ka.', vi: 'Lối ra ở đâu?' },
        { text: '{観覧車|かんらんしゃ}からうみが{見|み}えます。', ro: 'Kanransha kara umi ga miemasu.', vi: 'Từ đu quay nhìn thấy biển.' },
        { text: 'たくさん{歩|ある}きました。{疲|つか}れました。', ro: 'Takusan arukimashita. Tsukaremashita.', vi: 'Đi bộ nhiều. Mệt rồi.' },
        { text: 'あしが{痛|いた}いです。ベンチで{休|やす}みましょう。', ro: 'Ashi ga itai desu. Benchi de yasumimashou.', vi: 'Đau chân. Nghỉ ở ghế dài đi.' },
        { text: '{暗|くら}くなりましたね。', ro: 'Kuraku narimashita ne.', vi: 'Trời tối rồi nhỉ.' },
        { text: 'あっ、{鳥|とり}が{飛|と}んでいます。——{本当|ほんとう}だ。', ro: 'A, tori ga tonde imasu. — Hontou da.', vi: 'A, con chim đang bay. — Thật này!' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b10-doc-doan',
      title: 'Đọc to đoạn văn kiểu đề thi (30 giây chuẩn bị)',
      note: 'Mỗi đoạn ~100 chữ, 4 từ chữ Hán + 4 từ katakana như đề thật. Đọc liền mạch, không dừng giữa từ.',
      items: [
        {
          text: 'きょうはバスツアーです。わたしたちはあさはちじにえきのまえに{集合|しゅうごう}しました。でも、ワンさんがいませんでした。ワンさんに{電話|でんわ}をかけました。「そこからなにが{見|み}えますか。」「おおきい{橋|はし}が見えます。」わたしはみちをおしえました。',
          ro: 'Kyou wa basu tsuaa desu. Watashitachi wa asa hachiji ni eki no mae ni shuugou shimashita. Demo, Wan-san ga imasen deshita. Wan-san ni denwa o kakemashita. "Soko kara nani ga miemasu ka." "Ookii hashi ga miemasu." Watashi wa michi o oshiemashita.',
          vi: 'Hôm nay là tour xe buýt. Chúng tôi tập hợp trước ga lúc 8 giờ sáng. Nhưng không thấy Wang đâu. Tôi gọi điện cho Wang. "Từ đó bạn thấy gì?" "Mình thấy cây cầu lớn." Tôi đã chỉ đường.',
        },
        {
          text: 'バスのなかでガイドさんがいいました。「{皆|みな}さん、このチケットは{大切|たいせつ}です。なくさないでください。びじゅつかんのなかでしゃしんをとらないでください。{荷物|にもつ}はロッカーにいれてください。」わたしたちはパンフレットをもらいました。',
          ro: 'Basu no naka de gaido-san ga iimashita. "Minasan, kono chiketto wa taisetsu desu. Nakusanaide kudasai. Bijutsukan no naka de shashin o toranaide kudasai. Nimotsu wa rokkaa ni irete kudasai." Watashitachi wa panfuretto o moraimashita.',
          vi: 'Trên xe, hướng dẫn viên nói: "Mọi người ơi, vé này quan trọng. Đừng làm mất. Trong bảo tàng đừng chụp ảnh. Hành lý thì cho vào tủ khoá." Chúng tôi nhận tờ giới thiệu.',
        },
        {
          text: 'ごごは{動物園|どうぶつえん}へいきました。サルがバナナをたべていました。パンダもいました。{入|い}り{口|ぐち}のみせでお{土産|みやげ}をかいました。たくさんあるきましたから、とても{疲|つか}れました。ゆうがた、さむくなりました。',
          ro: 'Gogo wa doubutsuen e ikimashita. Saru ga banana o tabete imashita. Panda mo imashita. Iriguchi no mise de omiyage o kaimashita. Takusan arukimashita kara, totemo tsukaremashita. Yuugata, samuku narimashita.',
          vi: 'Buổi chiều chúng tôi đi sở thú. Con khỉ đang ăn chuối. Cũng có gấu trúc. Tôi mua quà ở cửa hàng chỗ lối vào. Vì đi bộ nhiều nên rất mệt. Chiều tối thì trời trở lạnh.',
        },
        {
          text: 'わたしのへやのまどからかわと{橋|はし}が{見|み}えます。よるは{暗|くら}いですが、橋のイルミネーションがとてもきれいです。ちかくにスーパーやコンビニがあります。こうえんでテニスやサッカーができます。{皆|みな}さん、ぜひあそびにきてください。',
          ro: 'Watashi no heya no mado kara kawa to hashi ga miemasu. Yoru wa kurai desu ga, hashi no irumineeshon ga totemo kirei desu. Chikaku ni suupaa ya konbini ga arimasu. Kouen de tenisu ya sakkaa ga dekimasu. Minasan, zehi asobi ni kite kudasai.',
          vi: 'Từ cửa sổ phòng tôi nhìn thấy sông và cầu. Buổi tối trời tối nhưng đèn trang trí trên cầu rất đẹp. Gần đó có siêu thị và cửa hàng tiện lợi. Ở công viên có thể chơi tennis và bóng đá. Mọi người nhất định đến chơi nhé.',
        },
      ],
    },

    {
      t: 'write',
      id: 'b10-viet-kanji',
      title: 'Tập viết tay chữ Hán Bài 10 — ✍ trước, 👁 sau',
      note: '14 chữ đầu là nhóm ✍ nên viết (ít nét, gặp rất nhiều) — viết cho thạo. Phần còn lại là 👁 nhận mặt: viết thử một lượt để nhớ mặt chữ là đủ. Bấm ▶ Thứ tự nét trước khi viết; viết xong nhờ ✨ AI xem chữ.',
      chars: ['右', '左', '目', '見', '立', '入', '休', '手', '大', '土', '口', '出', '車', '本', '角', '交', '差', '点', '信', '号', '橋', '道', '曲', '渡', '聞', '音', '声', '探', '飲', '薬', '押', '座', '持', '帰', '遅', '捨', '集', '合', '客', '荷', '物', '他', '皆', '産', '危', '切', '迷', '惑', '動', '園', '鳥', '観', '覧', '歩', '飛', '疲', '痛', '暗', '当'],
    },
  ],
};

/* ═══════════════════════════ 5. NGHE ═══════════════════════════ */

const NGHE: Lesson = {
  id: 'b10-nghe',
  kind: 'listening',
  title: 'Luyện nghe — xe buýt ở đâu? được phép không? ai đang nói?',
  goal: 'Nghe chỉ đường qua điện thoại và tìm đúng chỗ trên bản đồ, nghe lời xin phép – đồng ý – từ chối để đoán người nói sẽ làm gì, và nghe hội thoại ở sở thú để biết ai đang nói ở đâu.',
  minutes: 40,
  blocks: [
    {
      t: 'note',
      title: 'Cách nghe',
      items: [
        '**Chỉ đường**: bắt các cặp **nơi + を** (橋を, 交差点を, 道を) và **hướng + に** (右に, 左に), cùng số thứ tự **～つ目**. Vẽ nháp đường đi trong lúc nghe.',
        '**Xin phép**: nghe câu đáp. **はい、どうぞ／いいですよ** = được. **すみません、ちょっと……／～から……** = không được. Sau "không được" thường có **Nは～てください** — đó mới là việc người hỏi sẽ làm.',
        '**～ないでください** = cấm/nhắc. Nghe đuôi **ないで** — rất dễ lẫn với **～てください** (hãy làm).',
        '**Ai đang nói ở đâu**: bắt tên con vật, đồ vật, dịch vụ (自転車, 飲み物, 写真…) — chúng chỉ ra vị trí.',
        'Bẫy: đề xuất đầu tiên hay bị đổi. Luôn lấy thông tin **cuối cùng**.',
      ],
    },

    /* ── Bài 1 ── */
    { t: 'h', text: 'Bài 1 — Xe buýt ở đâu? (やってみよう)' },
    {
      t: 'p',
      text: 'Anna vừa ra khỏi **ga** nhưng không biết xe buýt của đoàn đậu ở đâu. Cô gọi cho Park đang ở trên xe. Xem bảng mô tả bản đồ, nghe, rồi chọn chỗ xe buýt đậu.',
    },
    {
      t: 'table',
      caption: 'Bản đồ (tả bằng lời) — đi từ ga lên phía trên',
      head: ['Kí hiệu', 'Vị trí'],
      rows: [
        ['ⓐ', 'Trước **toà nhà cao**, ngay trước ga, bên trái'],
        ['ⓑ', 'Cạnh **bưu điện**, trước khi tới cầu'],
        ['ⓒ', 'Ngay **bên kia cây cầu**, đi thẳng'],
        ['ⓓ', 'Qua cầu, ở **đèn giao thông thứ nhất**, rẽ phải'],
        ['ⓔ', 'Qua cầu, đèn giao thông thứ nhất **rẽ trái**, trước **ngân hàng**'],
        ['ⓕ', 'Qua cầu, đèn giao thông **thứ hai** rẽ trái, góc **cửa hàng quần áo**'],
      ],
    },
    {
      t: 'listen',
      id: 'b10-ng-1',
      title: 'Anna gọi điện cho Park',
      note: 'Bắt: đi qua cái gì (を), rẽ ở đâu, hướng nào (に), đèn thứ mấy (～つ目).',
      lines: [
        { who: 'アンナ', voice: 'ja-nu', text: 'もしもし、パクさん？アンナです。{今|いま}、{駅|えき}を{出|で}ました。でも、バスがわかりません。', ro: 'Moshi moshi, Paku-san? Anna desu. Ima, eki o demashita. Demo, basu ga wakarimasen.', vi: 'Alô, Park à? Anna đây. Mình vừa ra khỏi ga. Nhưng không biết xe buýt ở đâu.' },
        { who: 'パク', voice: 'ja-nu', text: 'アンナさん、そこから{何|なに}が{見|み}えますか。', ro: 'Anna-san, soko kara nani ga miemasu ka.', vi: 'Anna, từ chỗ cậu thấy gì?' },
        { who: 'アンナ', voice: 'ja-nu', text: 'ええと、{高|たか}いビルが{見|み}えます。バスはビルの{前|まえ}ですか。', ro: 'Eeto, takai biru ga miemasu. Basu wa biru no mae desu ka.', vi: 'Ờ, mình thấy toà nhà cao. Xe buýt ở trước toà nhà à?' },
        { who: 'パク', voice: 'ja-nu', text: 'いいえ、ビルの{前|まえ}じゃありません。まっすぐ{行|い}ってください。{橋|はし}が{見|み}えますか。', ro: 'Iie, biru no mae ja arimasen. Massugu itte kudasai. Hashi ga miemasu ka.', vi: 'Không, không phải trước toà nhà. Cậu đi thẳng đi. Có thấy cây cầu không?' },
        { who: 'アンナ', voice: 'ja-nu', text: 'はい、{見|み}えます。', ro: 'Hai, miemasu.', vi: 'Có, mình thấy rồi.' },
        { who: 'パク', voice: 'ja-nu', text: 'その{橋|はし}を{渡|わた}ってください。{渡|わた}って、{1|ひと}つ{目|め}の{信号|しんごう}を{左|ひだり}に{曲|ま}がってください。', ro: 'Sono hashi o watatte kudasai. Watatte, hitotsume no shingou o hidari ni magatte kudasai.', vi: 'Cậu qua cây cầu đó đi. Qua rồi thì rẽ trái ở đèn giao thông thứ nhất.' },
        { who: 'アンナ', voice: 'ja-nu', text: '{1|ひと}つ{目|め}の{信号|しんごう}を{右|みぎ}ですね。', ro: 'Hitotsume no shingou o migi desu ne.', vi: 'Đèn thứ nhất rẽ phải nhỉ.' },
        { who: 'パク', voice: 'ja-nu', text: 'いいえ、{左|ひだり}です。{左|ひだり}に{曲|ま}がって、{銀行|ぎんこう}の{前|まえ}です。{私|わたし}はバスの{前|まえ}で{待|ま}っていますよ。', ro: 'Iie, hidari desu. Hidari ni magatte, ginkou no mae desu. Watashi wa basu no mae de matte imasu yo.', vi: 'Không, trái. Rẽ trái, trước ngân hàng. Mình đang đợi trước xe buýt đấy.' },
        { who: 'アンナ', voice: 'ja-nu', text: 'わかりました。すぐ{行|い}きます。', ro: 'Wakarimashita. Sugu ikimasu.', vi: 'Hiểu rồi. Mình tới ngay.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b10-ng-1-q',
      title: 'Câu hỏi bài 1',
      items: [
        { q: 'バスはどこですか。', options: ['ⓐ', 'ⓑ', 'ⓒ', 'ⓓ', 'ⓔ', 'ⓕ'], correct: 4, why: '{橋|はし}を{渡|わた}って → **{1|ひと}つ{目|め}**の{信号|しんごう}を**{左|ひだり}**に{曲|ま}がって → **{銀行|ぎんこう}の{前|まえ}** = ⓔ. Bẫy: Anna nhắc lại sai "右" — Park sửa lại "左".' },
        { q: 'アンナさんは{最初|さいしょ}に{何|なに}が{見|み}えましたか。', options: ['{橋|はし}', '{高|たか}いビル', '{銀行|ぎんこう}', 'バス'], correct: 1, why: 'ええと、**{高|たか}いビル**が{見|み}えます。' },
        { q: 'パクさんは{今|いま}どこにいますか。', options: ['{駅|えき}', '{橋|はし}の{上|うえ}', 'バスの{前|まえ}', 'ビルの{前|まえ}'], correct: 2, why: '{私|わたし}は**バスの{前|まえ}**で{待|ま}っていますよ。' },
      ],
    },

    /* ── Bài 2 ── */
    { t: 'h', text: 'Bài 2 — Người phụ nữ sẽ làm gì tiếp theo? (やってみよう)' },
    {
      t: 'table',
      caption: 'Các lựa chọn (tả thay cho tranh)',
      head: ['Kí hiệu', 'Việc'],
      rows: [
        ['ⓐ', 'Kéo rèm cửa sổ xe ra'],
        ['ⓑ', 'Ngồi trên bãi cỏ ăn cơm hộp'],
        ['ⓒ', 'Lấy tờ giới thiệu (パンフレット)'],
        ['ⓓ', 'Đi vệ sinh'],
        ['ⓔ', 'Ăn cơm hộp ở bàn'],
        ['ⓕ', 'Mở cửa sổ xe'],
        ['ⓖ', 'Chụp ảnh trong bảo tàng'],
      ],
    },
    {
      t: 'listen',
      id: 'b10-ng-2a',
      title: '①',
      lines: [
        { who: '{女|おんな}の{人|ひと}', voice: 'ja-nu', text: 'すみません。ここでお{弁当|べんとう}を{食|た}べてもいいですか。', ro: 'Sumimasen. Koko de obentou o tabete mo ii desu ka.', vi: 'Xin lỗi. Tôi ăn cơm hộp ở đây được không?' },
        { who: '{美術館|びじゅつかん}の{人|ひと}', voice: 'ja-nam', text: 'すみません。お{弁当|べんとう}はあちらのテーブルで{食|た}べてください。', ro: 'Sumimasen. Obentou wa achira no teeburu de tabete kudasai.', vi: 'Xin lỗi. Cơm hộp thì chị ăn ở bàn đằng kia.' },
        { who: '{女|おんな}の{人|ひと}', voice: 'ja-nu', text: 'はい、わかりました。', ro: 'Hai, wakarimashita.', vi: 'Vâng, tôi hiểu rồi.' },
      ],
    },
    {
      t: 'listen',
      id: 'b10-ng-2b',
      title: '②',
      lines: [
        { who: '{女|おんな}の{人|ひと}', voice: 'ja-nu', text: 'あのう、{写真|しゃしん}を{撮|と}ってもいいですか。', ro: 'Anou, shashin o totte mo ii desu ka.', vi: 'À, tôi chụp ảnh được không?' },
        { who: '{美術館|びじゅつかん}の{人|ひと}', voice: 'ja-nam', text: 'すみません、{写真|しゃしん}はちょっと……。', ro: 'Sumimasen, shashin wa chotto…….', vi: 'Xin lỗi, chụp ảnh thì không được…' },
        { who: '{女|おんな}の{人|ひと}', voice: 'ja-nu', text: 'そうですか。じゃ、このパンフレットをもらってもいいですか。', ro: 'Sou desu ka. Ja, kono panfuretto o moratte mo ii desu ka.', vi: 'Vậy à. Thế tôi lấy tờ giới thiệu này được không?' },
        { who: '{美術館|びじゅつかん}の{人|ひと}', voice: 'ja-nam', text: 'はい、どうぞ。', ro: 'Hai, douzo.', vi: 'Vâng, mời chị.' },
      ],
    },
    {
      t: 'listen',
      id: 'b10-ng-2c',
      title: '③',
      lines: [
        { who: '{女|おんな}の{人|ひと}', voice: 'ja-nu', text: 'すみません。この{芝生|しばふ}に{座|すわ}ってもいいですか。', ro: 'Sumimasen. Kono shibafu ni suwatte mo ii desu ka.', vi: 'Xin lỗi. Tôi ngồi trên bãi cỏ này được không?' },
        { who: '{公園|こうえん}の{人|ひと}', voice: 'ja-nam', text: 'ええ、いいですよ。ここでお{弁当|べんとう}を{食|た}べることもできますよ。', ro: 'Ee, ii desu yo. Koko de obentou o taberu koto mo dekimasu yo.', vi: 'Được chứ. Ở đây ăn cơm hộp cũng được đấy.' },
        { who: '{女|おんな}の{人|ひと}', voice: 'ja-nu', text: 'よかった。じゃ、ここで{食|た}べます。', ro: 'Yokatta. Ja, koko de tabemasu.', vi: 'May quá. Vậy tôi ăn ở đây.' },
      ],
    },
    {
      t: 'listen',
      id: 'b10-ng-2d',
      title: '④',
      lines: [
        { who: '{女|おんな}の{人|ひと}', voice: 'ja-nu', text: 'ちょっと{暑|あつ}いですね。{窓|まど}を{開|あ}けてもいいですか。', ro: 'Chotto atsui desu ne. Mado o akete mo ii desu ka.', vi: 'Hơi nóng nhỉ. Tôi mở cửa sổ được không?' },
        { who: '{男|おとこ}の{人|ひと}', voice: 'ja-nam', text: 'すみません、{窓|まど}は{開|あ}けないでください。{少|すこ}し{寒|さむ}いですから。', ro: 'Sumimasen, mado wa akenaide kudasai. Sukoshi samui desu kara.', vi: 'Xin lỗi, cửa sổ thì đừng mở. Vì hơi lạnh.' },
        { who: '{女|おんな}の{人|ひと}', voice: 'ja-nu', text: 'そうですか。じゃ、カーテンを{開|あ}けてもいいですか。{外|そと}を{見|み}たいです。', ro: 'Sou desu ka. Ja, kaaten o akete mo ii desu ka. Soto o mitai desu.', vi: 'Vậy à. Thế tôi kéo rèm ra được không? Tôi muốn nhìn ra ngoài.' },
        { who: '{男|おとこ}の{人|ひと}', voice: 'ja-nam', text: 'ええ、どうぞ。', ro: 'Ee, douzo.', vi: 'Vâng, mời.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b10-ng-2-q',
      title: 'Câu hỏi bài 2 — 女の人はこれから何をしますか',
      items: [
        { q: '①', options: ['ⓑ', 'ⓔ', 'ⓒ', 'ⓓ'], correct: 1, why: 'お{弁当|べんとう}**は**あちらの**テーブルで**{食|た}べてください → ⓔ ăn ở bàn (ポイント 97).' },
        { q: '②', options: ['ⓖ', 'ⓒ', 'ⓐ', 'ⓔ'], correct: 1, why: 'Chụp ảnh bị từ chối (ちょっと……); パンフレットをもらってもいいですか → はい、どうぞ → ⓒ.' },
        { q: '③', options: ['ⓔ', 'ⓑ', 'ⓓ', 'ⓕ'], correct: 1, why: '{芝生|しばふ}に{座|すわ}ってもいいですか → いいですよ + {食|た}べることもできます → ⓑ.' },
        { q: '④', options: ['ⓕ', 'ⓐ', 'ⓓ', 'ⓒ'], correct: 1, why: 'Bẫy: {窓|まど}は{開|あ}け**ないで**ください (không mở cửa sổ) → xin kéo **rèm** → ええ、どうぞ → ⓐ.' },
      ],
    },

    /* ── Bài 3 ── */
    { t: 'h', text: 'Bài 3 — Ở sở thú: hai người nào đang nói? (やってみよう)' },
    {
      t: 'table',
      caption: 'Bản đồ sở thú (tả bằng lời)',
      head: ['Kí hiệu', 'Người đang ở đâu'],
      rows: [
        ['ⓐ', 'Quầy thông tin cạnh vòng đu quay'],
        ['ⓑ', 'Chỗ cho thuê xe đạp (1 giờ 500 yên)'],
        ['ⓒ', 'Chuồng khỉ'],
        ['ⓓ', 'Trước nhà hàng'],
        ['ⓔ', 'Chuồng gấu, đang cầm máy ảnh'],
        ['ⓕ', 'Ghế dài cạnh máy bán nước'],
      ],
    },
    {
      t: 'listen',
      id: 'b10-ng-3a',
      title: '①',
      lines: [
        { who: '{男|おとこ}の{人|ひと}', voice: 'ja-nam', text: '{動物園|どうぶつえん}は{広|ひろ}いですね。{自転車|じてんしゃ}に{乗|の}りたいです。', ro: 'Doubutsuen wa hiroi desu ne. Jitensha ni noritai desu.', vi: 'Sở thú rộng quá nhỉ. Mình muốn đi xe đạp.' },
        { who: '{女|おんな}の{人|ひと}', voice: 'ja-nu', text: 'ここで{借|か}りることができますよ。{1時間|いちじかん}{500円|ごひゃくえん}です。', ro: 'Koko de kariru koto ga dekimasu yo. Ichijikan gohyaku en desu.', vi: 'Ở đây thuê được đấy. 1 giờ 500 yên.' },
        { who: '{男|おとこ}の{人|ひと}', voice: 'ja-nam', text: '{安|やす}いですね。じゃ、{借|か}りましょう。', ro: 'Yasui desu ne. Ja, karimashou.', vi: 'Rẻ nhỉ. Vậy thuê đi.' },
      ],
    },
    {
      t: 'listen',
      id: 'b10-ng-3b',
      title: '②',
      lines: [
        { who: '{女|おんな}の{人|ひと}', voice: 'ja-nu', text: 'たくさん{歩|ある}きましたね。{疲|つか}れました。', ro: 'Takusan arukimashita ne. Tsukaremashita.', vi: 'Đi bộ nhiều quá. Mệt rồi.' },
        { who: '{男|おとこ}の{人|ひと}', voice: 'ja-nam', text: 'ここに{座|すわ}って{休|やす}みましょう。のどもかわきましたね。', ro: 'Koko ni suwatte yasumimashou. Nodo mo kawakimashita ne.', vi: 'Ngồi đây nghỉ đi. Cũng khát rồi nhỉ.' },
        { who: '{女|おんな}の{人|ひと}', voice: 'ja-nu', text: 'ええ。{隣|となり}で{飲|の}み{物|もの}を{買|か}うことができますよ。{私|わたし}、{買|か}ってきます。', ro: 'Ee. Tonari de nomimono o kau koto ga dekimasu yo. Watashi, katte kimasu.', vi: 'Ừ. Ngay bên cạnh mua được đồ uống đấy. Mình đi mua rồi quay lại.' },
      ],
    },
    {
      t: 'listen',
      id: 'b10-ng-3c',
      title: '③',
      lines: [
        { who: '{男|おとこ}の{人|ひと}', voice: 'ja-nam', text: 'あっ、クマが{寝|ね}ています。かわいいですね。', ro: 'A, kuma ga nete imasu. Kawaii desu ne.', vi: 'A, con gấu đang ngủ. Dễ thương nhỉ.' },
        { who: '{女|おんな}の{人|ひと}', voice: 'ja-nu', text: '{本当|ほんとう}だ。{写真|しゃしん}を{撮|と}りましょう。', ro: 'Hontou da. Shashin o torimashou.', vi: 'Thật này. Chụp ảnh đi.' },
        { who: '{男|おとこ}の{人|ひと}', voice: 'ja-nam', text: 'あ、{大|おお}きい{声|こえ}で{話|はな}さないでください。クマが{起|お}きますよ。', ro: 'A, ookii koe de hanasanaide kudasai. Kuma ga okimasu yo.', vi: 'Ấy, đừng nói to. Gấu dậy mất đấy.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b10-ng-3-q',
      title: 'Câu hỏi bài 3 — ⓐ〜ⓕのどの2人が話していますか',
      items: [
        { q: '①', options: ['ⓐ', 'ⓑ', 'ⓓ', 'ⓕ'], correct: 1, why: '{自転車|じてんしゃ}に{乗|の}りたい + ここで{借|か}りることができます + {1時間|いちじかん}{500円|ごひゃくえん} → chỗ thuê xe đạp ⓑ.' },
        { q: '②', options: ['ⓓ', 'ⓒ', 'ⓕ', 'ⓐ'], correct: 2, why: 'Ngồi nghỉ (ここに{座|すわ}って{休|やす}みましょう) + mua đồ uống **ngay bên cạnh** → ghế dài cạnh máy bán nước ⓕ.' },
        { q: '③', options: ['ⓒ', 'ⓔ', 'ⓑ', 'ⓐ'], correct: 1, why: '**クマ**が{寝|ね}ています + {写真|しゃしん}を{撮|と}りましょう → chuồng gấu ⓔ.' },
      ],
    },

    /* ── Bài 4 ── */
    { t: 'h', text: 'Bài 4 — Hội thoại dài: một ngày đi tour (もう{一度|いちど}{聞|き}こう)' },
    {
      t: 'listen',
      id: 'b10-ng-4',
      title: 'Marco đến muộn, rồi cả đoàn vào sở thú',
      note: 'Nghe cả đoạn một lần, rồi trả lời câu hỏi. Nghe lại lần hai để kiểm tra.',
      lines: [
        { who: 'ダニエル', voice: 'ja-nam', text: '{皆|みな}さん、おはようございます。マルコさんはいますか。', ro: 'Minasan, ohayou gozaimasu. Maruko-san wa imasu ka.', vi: 'Chào mọi người. Marco có đây không?' },
        { who: 'ワン', voice: 'ja-nu', text: 'マルコさんはまだ{来|き}ていません。{私|わたし}が{電話|でんわ}します。……もしもし、マルコさん？{今|いま}、どこですか。', ro: 'Maruko-san wa mada kite imasen. Watashi ga denwa shimasu. …… Moshi moshi, Maruko-san? Ima, doko desu ka.', vi: 'Marco vẫn chưa đến. Để mình gọi. … Alô, Marco à? Giờ cậu ở đâu?' },
        { who: 'マルコ', voice: 'ja-nam', text: 'すみません。{駅|えき}の{前|まえ}の{交差点|こうさてん}にいます。バスはどこですか。', ro: 'Sumimasen. Eki no mae no kousaten ni imasu. Basu wa doko desu ka.', vi: 'Xin lỗi. Mình đang ở ngã tư trước ga. Xe buýt ở đâu?' },
        { who: 'ワン', voice: 'ja-nu', text: 'その{交差点|こうさてん}を{右|みぎ}に{曲|ま}がって、まっすぐ{来|き}てください。コンビニの{角|かど}にバスがありますよ。', ro: 'Sono kousaten o migi ni magatte, massugu kite kudasai. Konbini no kado ni basu ga arimasu yo.', vi: 'Cậu rẽ phải ở ngã tư đó rồi đi thẳng tới đây. Xe buýt ở góc cửa hàng tiện lợi đấy.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'わかりました。{5分|ごふん}で{行|い}きます。', ro: 'Wakarimashita. Gofun de ikimasu.', vi: 'Hiểu rồi. 5 phút nữa mình tới.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'じゃ、{私|わたし}はちょっとコーヒーを{買|か}ってきます。', ro: 'Ja, watashi wa chotto koohii o katte kimasu.', vi: 'Vậy tôi đi mua cà phê một chút rồi quay lại.' },
        { who: 'ワン', voice: 'ja-nu', text: '（{動物園|どうぶつえん}で）あっ、{見|み}てください。ペンギンが{歩|ある}いていますよ。', ro: '(Doubutsuen de) A, mite kudasai. Pengin ga aruite imasu yo.', vi: '(Ở sở thú) A, nhìn kìa. Chim cánh cụt đang đi kìa.' },
        { who: 'マルコ', voice: 'ja-nam', text: '{本当|ほんとう}だ。かわいいですね。あのう、すみません。ここで{写真|しゃしん}を{撮|と}ってもいいですか。', ro: 'Hontou da. Kawaii desu ne. Anou, sumimasen. Koko de shashin o totte mo ii desu ka.', vi: 'Thật này. Dễ thương nhỉ. À, xin lỗi. Ở đây chụp ảnh được không ạ?' },
        { who: '{動物園|どうぶつえん}の{人|ひと}', voice: 'ja-nam', text: 'ええ、いいですよ。でも、ペンギンにえさをやらないでくださいね。', ro: 'Ee, ii desu yo. Demo, pengin ni esa o yaranaide kudasai ne.', vi: 'Vâng, được ạ. Nhưng đừng cho chim cánh cụt ăn nhé.' },
        { who: 'ワン', voice: 'ja-nu', text: 'あ、もうすぐ{1時|いちじ}になります。おなかがすきましたね。', ro: 'A, mou sugu ichiji ni narimasu. Onaka ga sukimashita ne.', vi: 'A, sắp 1 giờ rồi. Đói bụng rồi nhỉ.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'ええ。{出口|でぐち}の{近|ちか}くのレストランで{食事|しょくじ}ができますよ。そろそろ{行|い}きませんか。', ro: 'Ee. Deguchi no chikaku no resutoran de shokuji ga dekimasu yo. Sorosoro ikimasen ka.', vi: 'Ừ. Ở nhà hàng gần lối ra ăn được đấy. Mình đi thôi chứ?' },
        { who: 'ワン', voice: 'ja-nu', text: 'そうしましょう。', ro: 'Sou shimashou.', vi: 'Làm vậy đi.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b10-ng-4-q',
      title: 'Câu hỏi bài 4',
      items: [
        { q: 'マルコさんは{電話|でんわ}のとき、どこにいましたか。', options: ['バスの{中|なか}', '{駅|えき}の{前|まえ}の{交差点|こうさてん}', 'コンビニ', '{動物園|どうぶつえん}'], correct: 1, why: '**{駅|えき}の{前|まえ}の{交差点|こうさてん}**にいます。' },
        { q: 'バスはどこにありますか。', options: ['{駅|えき}の{前|まえ}', '{交差点|こうさてん}', 'コンビニの{角|かど}', '{銀行|ぎんこう}の{前|まえ}'], correct: 2, why: '**コンビニの{角|かど}**にバスがありますよ。' },
        { q: 'マルコさんはどうやってバスへ{行|い}きますか。', options: ['{交差点|こうさてん}を{左|ひだり}に{曲|ま}がります', '{交差点|こうさてん}を{右|みぎ}に{曲|ま}がって、まっすぐ{行|い}きます', '{橋|はし}を{渡|わた}ります', 'まっすぐ{行|い}って、{右|みぎ}に{曲|ま}がります'], correct: 1, why: 'その{交差点|こうさてん}を**{右|みぎ}に{曲|ま}がって、まっすぐ**{来|き}てください。' },
        { q: 'ダニエルさんは{何|なに}をしますか。', options: ['マルコさんを{迎|むか}えに{行|い}きます', 'コーヒーを{買|か}ってきます', '{写真|しゃしん}を{撮|と}ります', '{電話|でんわ}をかけます'], correct: 1, why: 'ちょっとコーヒーを**{買|か}ってきます** (ポイント 92).' },
        { q: '{動物園|どうぶつえん}の{人|ひと}は{何|なに}と{言|い}いましたか。', options: ['{写真|しゃしん}を{撮|と}らないでください', 'ペンギンにえさをやらないでください', '{大|おお}きい{声|こえ}で{話|はな}さないでください', '{前|まえ}の{人|ひと}を{押|お}さないでください'], correct: 1, why: 'Chụp ảnh thì いいですよ; nhưng ペンギンに**えさをやらないで**ください.' },
        { q: '2{人|ふたり}はこれからどこへ{行|い}きますか。', options: ['バス', '{出口|でぐち}の{近|ちか}くのレストラン', 'ペンギンのところ', 'コンビニ'], correct: 1, why: '{出口|でぐち}の{近|ちか}くの**レストラン**で{食事|しょくじ}ができますよ。そろそろ{行|い}きませんか → そうしましょう.' },
      ],
    },

    /* ── Bài 5 ── */
    { t: 'h', text: 'Bài 5 — Được hay không được? (○ / ×)' },
    {
      t: 'p',
      text: 'Nghe 6 lời xin phép ngắn. Người hỏi có được làm việc đó không? Được → ○, không được → ×.',
    },
    {
      t: 'listen',
      id: 'b10-ng-5',
      title: '6 lời xin phép',
      lines: [
        { who: '①', voice: 'ja-nu', text: 'ここに{座|すわ}ってもいいですか。——はい、どうぞ。', ro: 'Koko ni suwatte mo ii desu ka. — Hai, douzo.', vi: 'Tôi ngồi đây được không? — Vâng, mời.' },
        { who: '②', voice: 'ja-nam', text: 'ここでたばこを{吸|す}ってもいいですか。——すみません、たばこは{外|そと}でお{願|ねが}いします。', ro: 'Koko de tabako o sutte mo ii desu ka. — Sumimasen, tabako wa soto de onegai shimasu.', vi: 'Hút thuốc ở đây được không? — Xin lỗi, thuốc lá thì xin ra ngoài.' },
        { who: '③', voice: 'ja-nu', text: 'この{辞書|じしょ}を{使|つか}ってもいいですか。——ええ、いいですよ。', ro: 'Kono jisho o tsukatte mo ii desu ka. — Ee, ii desu yo.', vi: 'Tôi dùng từ điển này được không? — Được chứ.' },
        { who: '④', voice: 'ja-nam', text: '{窓|まど}を{閉|し}めてもいいですか。——すみません。ちょっと{暑|あつ}いですから……。', ro: 'Mado o shimete mo ii desu ka. — Sumimasen. Chotto atsui desu kara…….', vi: 'Tôi đóng cửa sổ được không? — Xin lỗi. Vì hơi nóng…' },
        { who: '⑤', voice: 'ja-nu', text: '{中|なか}に{入|はい}ってもいいですか。——どうぞ、{入|はい}ってください。', ro: 'Naka ni haitte mo ii desu ka. — Douzo, haitte kudasai.', vi: 'Tôi vào trong được không? — Mời, vào đi.' },
        { who: '⑥', voice: 'ja-nam', text: 'ここにごみを{捨|す}ててもいいですか。——あ、{捨|す}てないでください。', ro: 'Koko ni gomi o sutete mo ii desu ka. — A, sutenaide kudasai.', vi: 'Vứt rác ở đây được không? — Ấy, đừng vứt.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b10-ng-5-q',
      title: 'Câu hỏi bài 5 — ○ hay ×',
      items: [
        { q: '① {座|すわ}ります', options: ['○', '×'], correct: 0, why: '**はい、どうぞ** → được.' },
        { q: '② たばこを{吸|す}います（ここで）', options: ['○', '×'], correct: 1, why: 'たばこ**は{外|そと}で** → ở đây không được.' },
        { q: '③ {辞書|じしょ}を{使|つか}います', options: ['○', '×'], correct: 0, why: '**ええ、いいですよ** → được.' },
        { q: '④ {窓|まど}を{閉|し}めます', options: ['○', '×'], correct: 1, why: '**すみません。…から……** (bỏ lửng) → từ chối.' },
        { q: '⑤ {中|なか}に{入|はい}ります', options: ['○', '×'], correct: 0, why: '{入|はい}**って**ください (hãy vào) → được. Đừng nhầm với 入らないで.' },
        { q: '⑥ ごみを{捨|す}てます', options: ['○', '×'], correct: 1, why: '{捨|す}て**ないで**ください → không được.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 6. NÓI (dạng thi) ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b10-noi',
  kind: 'speaking',
  title: 'Luyện nói — câu hỏi thi về đã/chưa, làm được gì, nhìn thấy gì, xin phép, chỉ đường',
  goal: 'Trả lời trọn câu, đúng trợ từ các câu hỏi thi liên quan Bài 10 (もう～ましたか, ～ことができますか, ～が見えますか, ～てもいいですか), nhìn tranh sở thú / biển báo / bản đồ mà trả lời, đóng vai chỉ đường và xin phép, và đọc to trôi chảy.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Đề thi nói JPD (theo "Hướng dẫn ôn thi" của bộ môn) — Bài 10 nằm ở đâu',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 10 xuất hiện ở đâu'],
      rows: [
        ['Reading', '40', 'Chuẩn bị 30 giây, đọc to đoạn ~100–110 chữ (4 từ chữ Hán gạch chân, 4 từ katakana, 70–80 chữ hiragana).', 'Đoạn kể một ngày đi tour: {集合|しゅうごう}, {荷物|にもつ}, {動物園|どうぶつえん}, バス, パンフレット…'],
        ['Talking — có tranh', '3 × 15', 'Nhìn tranh (sở thú, biển báo, bản đồ…) trả lời 3 câu.', '{何|なに}が～ていますか · ここで～てもいいですか · どうやって{行|い}きますか'],
        ['Talking — không tranh', '1 × 10', 'Trả lời 1 câu về bản thân.', 'もう～ましたか · ～で{何|なに}ができますか · ～から{何|なに}が{見|み}えますか'],
        ['Presenting', '5', 'Chào khi vào và khi ra.', 'しつれいします／ありがとうございました。 (vào phòng: {入|はい}ってもいいですか)'],
      ],
    },
    {
      t: 'note',
      title: 'Luật chấm cần nhớ (trừ điểm thật)',
      items: [
        '**Sai trợ từ: −2 điểm** mỗi lỗi. Bài 10 soát kỹ: {見|み}えます／{聞|き}こえます đi với **が**; chỉ đường {橋|はし}**を**{渡|わた}ります, {角|かど}**を**{右|みぎ}**に**; ～こと**が**できます; nơi làm được việc **で**.',
        '**Câu có/không quên はい／いいえ**: bị trừ. 「もう～ましたか」 → **はい、もう～ました／いいえ、まだ～ていません**.',
        '**Sai nội dung = mất trọn câu**: hỏi "làm được gì" mà trả lời "có gì" (～があります); hỏi "nhìn thấy gì" mà đáp "tôi xem …" (見ます).',
        'Được xin nhắc lại câu hỏi **tối đa 2 lần, không bị trừ**: **もう{一度|いちど}お{願|ねが}いします** · **ゆっくりお{願|ねが}いします** (ゆっくり — từ của bài này).',
        'Luôn trả lời **câu đầy đủ**, lặp lại động từ của câu hỏi.',
      ],
    },

    /* ── Không tranh ① ── */
    { t: 'h', text: 'Câu hỏi không tranh ① — Đã … chưa? (もう／まだ)' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: もう～ましたか',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'もう{昼|ひる}ご{飯|はん}を{食|た}べましたか。', ro: 'Mou hirugohan o tabemashita ka.', vi: 'Em ăn trưa chưa?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、まだ{食|た}べていません。', ro: 'Iie, mada tabete imasen.', vi: 'Chưa ạ, em chưa ăn.' },
        { who: 'Giám thị', role: 'examiner', text: 'もう{宿題|しゅくだい}をしましたか。', ro: 'Mou shukudai o shimashita ka.', vi: 'Em làm bài tập về nhà chưa?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、もうしました。', ro: 'Hai, mou shimashita.', vi: 'Rồi ạ, em làm rồi.' },
        { who: 'Giám thị', role: 'examiner', text: 'もう{日本|にほん}へ{行|い}きましたか。', ro: 'Mou Nihon e ikimashita ka.', vi: 'Em đi Nhật chưa?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、まだ{行|い}っていません。でも、ぜひ{行|い}きたいです。', ro: 'Iie, mada itte imasen. Demo, zehi ikitai desu.', vi: 'Chưa ạ, em chưa đi. Nhưng em rất muốn đi.' },
        { who: 'Giám thị', role: 'examiner', text: 'もう{日本|にほん}の{映画|えいが}を{見|み}ましたか。', ro: 'Mou Nihon no eiga o mimashita ka.', vi: 'Em đã xem phim Nhật chưa?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、もう{見|み}ました。アニメの{映画|えいが}を{見|み}ました。', ro: 'Hai, mou mimashita. Anime no eiga o mimashita.', vi: 'Rồi ạ. Em xem phim hoạt hình rồi.' },
        { who: 'Giám thị', role: 'examiner', text: 'もう{動物園|どうぶつえん}へ{行|い}きましたか。', ro: 'Mou doubutsuen e ikimashita ka.', vi: 'Em đi sở thú chưa?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、もう{行|い}きました。ハノイの{動物園|どうぶつえん}へ{行|い}きました。', ro: 'Hai, mou ikimashita. Hanoi no doubutsuen e ikimashita.', vi: 'Rồi ạ. Em đi sở thú Hà Nội rồi.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở câu もう～ましたか',
      items: [
        '"Chưa" = **いいえ、まだ～ていません** (câu dài) hoặc いいえ、まだです (câu ngắn). ~~いいえ、{食|た}べませんでした~~ = sai nghĩa.',
        '"Rồi" = **はい、もう～ました** — nhớ giữ もう, nghe tự nhiên hơn.',
        'Thêm một câu sau (ぜひ{行|い}きたいです, アニメの{映画|えいが}を{見|み}ました) để câu trả lời dài và ghi điểm.',
      ],
    },

    /* ── Không tranh ② ── */
    { t: 'h', text: 'Câu hỏi không tranh ② — Ở đó làm được gì? Nhìn thấy gì?' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: ～ができますか／～が見えますか',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'ハノイで{何|なに}ができますか。', ro: 'Hanoi de nani ga dekimasu ka.', vi: 'Ở Hà Nội có thể làm gì?' },
        { who: 'Bạn', role: 'candidate', text: 'ハノイでおいしいフォーを{食|た}べることができます。きれいな{公園|こうえん}を{歩|ある}くこともできます。', ro: 'Hanoi de oishii foo o taberu koto ga dekimasu. Kirei na kouen o aruku koto mo dekimasu.', vi: 'Ở Hà Nội có thể ăn phở ngon. Cũng có thể đi dạo trong những công viên đẹp.' },
        { who: 'Giám thị', role: 'examiner', text: '{学校|がっこう}で{何|なに}ができますか。', ro: 'Gakkou de nani ga dekimasu ka.', vi: 'Ở trường có thể làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{学校|がっこう}で{本|ほん}を{借|か}りることができます。サッカーもできます。', ro: 'Gakkou de hon o kariru koto ga dekimasu. Sakkaa mo dekimasu.', vi: 'Ở trường có thể mượn sách. Cũng có thể chơi bóng đá.' },
        { who: 'Giám thị', role: 'examiner', text: 'この{近|ちか}くで{何|なに}を{買|か}うことができますか。', ro: 'Kono chikaku de nani o kau koto ga dekimasu ka.', vi: 'Gần đây có thể mua được gì?' },
        { who: 'Bạn', role: 'candidate', text: 'コンビニで{飲|の}み{物|もの}やお{弁当|べんとう}を{買|か}うことができます。', ro: 'Konbini de nomimono ya obentou o kau koto ga dekimasu.', vi: 'Ở cửa hàng tiện lợi có thể mua đồ uống, cơm hộp.' },
        { who: 'Giám thị', role: 'examiner', text: 'あなたの{部屋|へや}から{何|なに}が{見|み}えますか。', ro: 'Anata no heya kara nani ga miemasu ka.', vi: 'Từ phòng em nhìn thấy gì?' },
        { who: 'Bạn', role: 'candidate', text: '{私|わたし}の{部屋|へや}から{高|たか}いビルが{見|み}えます。', ro: 'Watashi no heya kara takai biru ga miemasu.', vi: 'Từ phòng em nhìn thấy toà nhà cao.' },
        { who: 'Giám thị', role: 'examiner', text: 'この{教室|きょうしつ}の{窓|まど}から{何|なに}が{見|み}えますか。', ro: 'Kono kyoushitsu no mado kara nani ga miemasu ka.', vi: 'Từ cửa sổ phòng này nhìn thấy gì?' },
        { who: 'Bạn', role: 'candidate', text: '{木|き}と{道|みち}が{見|み}えます。', ro: 'Ki to michi ga miemasu.', vi: 'Nhìn thấy cây và con đường ạ.' },
        { who: 'Giám thị', role: 'examiner', text: '{今|いま}、{何|なに}が{聞|き}こえますか。', ro: 'Ima, nani ga kikoemasu ka.', vi: 'Bây giờ em nghe thấy gì?' },
        { who: 'Bạn', role: 'candidate', text: '{車|くるま}の{音|おと}が{聞|き}こえます。', ro: 'Kuruma no oto ga kikoemasu.', vi: 'Em nghe thấy tiếng xe ạ.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở nhóm này',
      items: [
        'Hỏi **{何|なに}ができますか** → trả lời bằng **～ことができます／N ができます**, không phải ~~N があります~~ (đó là câu "có gì").',
        'Hỏi **{何|なに}が{見|み}えますか** → **N が{見|み}えます**. Không đáp ~~N を{見|み}ます~~.',
        '**から** (từ chỗ nào nhìn) đi với 見えます; **で** (ở đâu làm) đi với できます. Đừng tráo: ~~ハノイからフォーを{食|た}べることができます~~.',
      ],
    },

    /* ── Không tranh ③ ── */
    { t: 'h', text: 'Câu hỏi không tranh ③ — Con vật, sự thay đổi, xin phép' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: động vật, なります, てもいいですか',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{動物|どうぶつ}で{何|なに}がいちばん{好|す}きですか。', ro: 'Doubutsu de nani ga ichiban suki desu ka.', vi: 'Trong các con vật, em thích con gì nhất? (mẫu いちばん Bài 6)' },
        { who: 'Bạn', role: 'candidate', text: 'パンダがいちばん{好|す}きです。とてもかわいいですから。', ro: 'Panda ga ichiban suki desu. Totemo kawaii desu kara.', vi: 'Em thích gấu trúc nhất. Vì rất dễ thương.' },
        { who: 'Giám thị', role: 'examiner', text: '{最近|さいきん}、{寒|さむ}くなりましたか。', ro: 'Saikin, samuku narimashita ka.', vi: 'Gần đây trời có lạnh hơn không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{少|すこ}し{寒|さむ}くなりました。', ro: 'Hai, sukoshi samuku narimashita.', vi: 'Có ạ, trời lạnh hơn một chút rồi.' },
        { who: 'Giám thị', role: 'examiner', text: '{日本語|にほんご}が{上手|じょうず}になりましたか。', ro: 'Nihongo ga jouzu ni narimashita ka.', vi: 'Tiếng Nhật của em giỏi lên chưa?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{少|すこ}し{上手|じょうず}になりました。でも、{漢字|かんじ}は{難|むずか}しいです。', ro: 'Hai, sukoshi jouzu ni narimashita. Demo, kanji wa muzukashii desu.', vi: 'Có ạ, giỏi lên một chút rồi. Nhưng chữ Hán khó ạ.' },
        { who: 'Giám thị', role: 'examiner', text: 'おなかがすきましたか。', ro: 'Onaka ga sukimashita ka.', vi: 'Em có đói không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、すきました。まだ{昼|ひる}ご{飯|はん}を{食|た}べていませんから。', ro: 'Hai, sukimashita. Mada hirugohan o tabete imasen kara.', vi: 'Có ạ, em đói rồi. Vì em chưa ăn trưa.' },
        { who: 'Giám thị', role: 'examiner', text: 'この{本|ほん}を{借|か}りてもいいですか。', ro: 'Kono hon o karite mo ii desu ka.', vi: 'Cô mượn quyển sách này được không? (giám thị đóng vai xin phép)' },
        { who: 'Bạn', role: 'candidate', text: 'はい、どうぞ。', ro: 'Hai, douzo.', vi: 'Vâng, mời cô.' },
        { who: 'Giám thị', role: 'examiner', text: '{図書館|としょかん}で{大|おお}きい{声|こえ}で{話|はな}してもいいですか。', ro: 'Toshokan de ookii koe de hanashite mo ii desu ka.', vi: 'Ở thư viện nói to được không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{話|はな}さないでください。{他|ほか}の{人|ひと}に{迷惑|めいわく}ですから。', ro: 'Iie, hanasanaide kudasai. Hoka no hito ni meiwaku desu kara.', vi: 'Không ạ, xin đừng nói to. Vì làm phiền người khác.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở nhóm này',
      items: [
        '「～なりましたか」 → lặp lại đúng hình thái: {寒|さむ}**く**なりました; {上手|じょうず}**に**なりました.',
        'Giám thị xin phép bạn → đáp như chủ nhà: **はい、どうぞ**. Đừng đáp ~~はい、{借|か}りてもいいです~~ với giám thị (nghe như ra lệnh cho phép).',
        'Câu hỏi "ở đâu đó làm X được không" (quy định chung) → không được thì **いいえ、～ないでください** + lý do から.',
      ],
    },

    /* ── Có tranh ── */
    { t: 'h', text: 'Câu hỏi có tranh — sở thú, biển báo, bản đồ' },
    {
      t: 'p',
      text: 'Tranh thi được viết lại thành bảng (không dùng ảnh). Với tranh Bài 10, giám thị hay hỏi: **{何|なに}がいますか · N は{何|なに}をしていますか · {何|なに}が～ていますか · ここで～てもいいですか · ここで{何|なに}ができますか · A から B までどうやって{行|い}きますか**.',
    },
    {
      t: 'table',
      caption: 'Tranh 1 — sở thú',
      head: ['Con vật', 'Đang làm gì'],
      rows: [
        ['サル（{2匹|にひき}）', 'バナナを{食|た}べています'],
        ['ゾウ', '{水|みず}を{飲|の}んでいます'],
        ['{鳥|とり}', '{飛|と}んでいます'],
        ['パンダ', '{寝|ね}ています'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 1 — hỏi – đáp',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'ここはどこですか。', ro: 'Koko wa doko desu ka.', vi: 'Đây là đâu?' },
        { who: 'Bạn', role: 'candidate', text: '{動物園|どうぶつえん}です。', ro: 'Doubutsuen desu.', vi: 'Là sở thú ạ.' },
        { who: 'Giám thị', role: 'examiner', text: 'サルは{何|なに}をしていますか。', ro: 'Saru wa nani o shite imasu ka.', vi: 'Con khỉ đang làm gì?' },
        { who: 'Bạn', role: 'candidate', text: 'サルはバナナを{食|た}べています。', ro: 'Saru wa banana o tabete imasu.', vi: 'Con khỉ đang ăn chuối.' },
        { who: 'Giám thị', role: 'examiner', text: '{何|なに}が{水|みず}を{飲|の}んでいますか。', ro: 'Nani ga mizu o nonde imasu ka.', vi: 'Con gì đang uống nước?' },
        { who: 'Bạn', role: 'candidate', text: 'ゾウが{水|みず}を{飲|の}んでいます。', ro: 'Zou ga mizu o nonde imasu.', vi: 'Con voi đang uống nước.' },
        { who: 'Giám thị', role: 'examiner', text: 'サルは{何匹|なんびき}いますか。', ro: 'Saru wa nanbiki imasu ka.', vi: 'Có mấy con khỉ? (～匹 Bài 8)' },
        { who: 'Bạn', role: 'candidate', text: '{2匹|にひき}います。', ro: 'Nihiki imasu.', vi: 'Có 2 con.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh 2 — biển báo ở cửa bảo tàng',
      head: ['Biển', 'Ý nghĩa'],
      rows: [
        ['📷 gạch chéo', 'Không chụp ảnh'],
        ['🚬 gạch chéo', 'Không hút thuốc (có khu hút thuốc bên ngoài)'],
        ['🍱 gạch chéo', 'Không ăn uống trong phòng triển lãm (có bàn ở sảnh)'],
        ['🔑 tủ khoá', 'Để hành lý vào tủ khoá'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 2 — hỏi – đáp',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'ここで{写真|しゃしん}を{撮|と}ってもいいですか。', ro: 'Koko de shashin o totte mo ii desu ka.', vi: 'Ở đây chụp ảnh được không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{写真|しゃしん}を{撮|と}らないでください。', ro: 'Iie, shashin o toranaide kudasai.', vi: 'Không ạ, xin đừng chụp ảnh.' },
        { who: 'Giám thị', role: 'examiner', text: 'ここでたばこを{吸|す}ってもいいですか。', ro: 'Koko de tabako o sutte mo ii desu ka.', vi: 'Ở đây hút thuốc được không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、たばこは{外|そと}の{喫煙所|きつえんじょ}で{吸|す}ってください。', ro: 'Iie, tabako wa soto no kitsuenjo de sutte kudasai.', vi: 'Không ạ, thuốc lá thì hút ở khu hút thuốc bên ngoài.' },
        { who: 'Giám thị', role: 'examiner', text: '{荷物|にもつ}はどこに{置|お}きますか。', ro: 'Nimotsu wa doko ni okimasu ka.', vi: 'Hành lý để ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: '{荷物|にもつ}はロッカーに{入|い}れてください。', ro: 'Nimotsu wa rokkaa ni irete kudasai.', vi: 'Hành lý thì cho vào tủ khoá.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh 3 — bản đồ',
      head: ['Bước', 'Trên bản đồ'],
      rows: [
        ['1', 'Từ **ga** đi thẳng, gặp **cây cầu**'],
        ['2', 'Qua cầu, tới **ngã tư thứ nhất**'],
        ['3', 'Rẽ **phải**, đi thẳng — **ngân hàng** ở bên trái'],
        ['4', 'Từ ga cũng nhìn thấy **toà nhà cao** bên phải ngân hàng'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 3 — hỏi – đáp',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{駅|えき}から{銀行|ぎんこう}までどうやって{行|い}きますか。', ro: 'Eki kara ginkou made douyatte ikimasu ka.', vi: 'Từ ga đến ngân hàng đi thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{駅|えき}からまっすぐ{行|い}って、{橋|はし}を{渡|わた}ります。{1|ひと}つ{目|め}の{交差点|こうさてん}を{右|みぎ}に{曲|ま}がります。{銀行|ぎんこう}は{左|ひだり}にあります。', ro: 'Eki kara massugu itte, hashi o watarimasu. Hitotsume no kousaten o migi ni magarimasu. Ginkou wa hidari ni arimasu.', vi: 'Từ ga đi thẳng, qua cầu. Rẽ phải ở ngã tư thứ nhất. Ngân hàng ở bên trái.' },
        { who: 'Giám thị', role: 'examiner', text: '{駅|えき}から{何|なに}が{見|み}えますか。', ro: 'Eki kara nani ga miemasu ka.', vi: 'Từ ga nhìn thấy gì?' },
        { who: 'Bạn', role: 'candidate', text: '{橋|はし}と{高|たか}いビルが{見|み}えます。', ro: 'Hashi to takai biru ga miemasu.', vi: 'Nhìn thấy cây cầu và toà nhà cao.' },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo cho câu có tranh',
      items: [
        '"N は{何|なに}をしていますか" (hỏi về N đã biết) → **N は** ～ています. "{何|なに}が～ていますか" (hỏi con nào) → **N が** ～ています. Lặp lại đúng trợ từ của câu hỏi.',
        'Tranh biển cấm + "～てもいいですか" → **いいえ、～ないでください**; nếu tranh có chỗ khác được phép → thêm **N は（nơi）で～てください**.',
        'Chỉ đường: nói **từng bước một câu**, mỗi câu một động từ (まっすぐ{行|い}きます → {橋|はし}を{渡|わた}ります → {交差点|こうさてん}を{右|みぎ}に{曲|ま}がります). Sai một trợ từ mất 2 điểm, nhưng thiếu cả bước mất trọn câu.',
      ],
    },

    /* ── Đóng vai ── */
    { t: 'h', text: 'Đóng vai — chỉ đường qua điện thoại, xin phép (luyện hai người)' },
    {
      t: 'dialogue',
      title: 'Vai 1 — A ở trên xe buýt, B ở ga và lạc đường (ロールプレイ p.173)',
      lines: [
        { who: 'B', role: 'b', text: 'もしもし、Aさん？{今|いま}、{駅|えき}にいます。バスまでの{道|みち}がわかりません。{教|おし}えてください。', ro: 'Moshi moshi, A-san? Ima, eki ni imasu. Basu made no michi ga wakarimasen. Oshiete kudasai.', vi: 'Alô, A à? Mình đang ở ga. Không biết đường đến xe buýt. Chỉ mình với.' },
        { who: 'A', role: 'a', text: 'はい。そこから{何|なに}が{見|み}えますか。', ro: 'Hai. Soko kara nani ga miemasu ka.', vi: 'Ừ. Từ đó cậu thấy gì?' },
        { who: 'B', role: 'b', text: 'ええと、{郵便局|ゆうびんきょく}が{見|み}えます。', ro: 'Eeto, yuubinkyoku ga miemasu.', vi: 'Ờ, mình thấy bưu điện.' },
        { who: 'A', role: 'a', text: 'じゃ、{郵便局|ゆうびんきょく}の{前|まえ}の{道|みち}をまっすぐ{行|い}ってください。{2|ふた}つ{目|め}の{信号|しんごう}を{右|みぎ}に{曲|ま}がってください。', ro: 'Ja, yuubinkyoku no mae no michi o massugu itte kudasai. Futatsume no shingou o migi ni magatte kudasai.', vi: 'Vậy cậu đi thẳng con đường trước bưu điện. Rẽ phải ở đèn thứ hai.' },
        { who: 'B', role: 'b', text: '{2|ふた}つ{目|め}の{信号|しんごう}を{右|みぎ}ですね。', ro: 'Futatsume no shingou o migi desu ne.', vi: 'Đèn thứ hai rẽ phải nhỉ.' },
        { who: 'A', role: 'a', text: 'はい。{右|みぎ}に{曲|ま}がって、{橋|はし}を{渡|わた}ってください。バスは{橋|はし}の{近|ちか}くにありますよ。', ro: 'Hai. Migi ni magatte, hashi o watatte kudasai. Basu wa hashi no chikaku ni arimasu yo.', vi: 'Ừ. Rẽ phải rồi qua cầu. Xe buýt ở gần cầu đấy.' },
        { who: 'B', role: 'b', text: 'わかりました。ありがとうございます。', ro: 'Wakarimashita. Arigatou gozaimasu.', vi: 'Hiểu rồi. Cảm ơn nhé.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Vai 2 — A là khách, B là nhân viên sở thú (ペアで話しましょう p.177, p.181)',
      lines: [
        { who: 'A', role: 'a', text: 'すみません。ここで{観覧車|かんらんしゃ}のチケットを{買|か}うことができますか。', ro: 'Sumimasen. Koko de kanransha no chiketto o kau koto ga dekimasu ka.', vi: 'Xin lỗi. Ở đây mua được vé đu quay không?' },
        { who: 'B', role: 'b', text: 'はい、できます。{1人|ひとり}{500円|ごひゃくえん}です。', ro: 'Hai, dekimasu. Hitori gohyaku en desu.', vi: 'Vâng, được. 500 yên một người.' },
        { who: 'A', role: 'a', text: 'じゃ、{2枚|にまい}ください。それから、ここに{荷物|にもつ}を{置|お}いてもいいですか。', ro: 'Ja, nimai kudasai. Sorekara, koko ni nimotsu o oite mo ii desu ka.', vi: 'Vậy cho tôi 2 vé. Còn nữa, tôi để hành lý ở đây được không?' },
        { who: 'B', role: 'b', text: 'すみません。{荷物|にもつ}は{入|い}り{口|ぐち}のロッカーに{入|い}れてください。', ro: 'Sumimasen. Nimotsu wa iriguchi no rokkaa ni irete kudasai.', vi: 'Xin lỗi. Hành lý thì cho vào tủ khoá ở lối vào.' },
        { who: 'A', role: 'a', text: 'わかりました。{観覧車|かんらんしゃ}から{何|なに}が{見|み}えますか。', ro: 'Wakarimashita. Kanransha kara nani ga miemasu ka.', vi: 'Tôi hiểu rồi. Từ đu quay nhìn thấy gì?' },
        { who: 'B', role: 'b', text: '{天気|てんき}がいい{日|ひ}は{富士山|ふじさん}が{見|み}えますよ。', ro: 'Tenki ga ii hi wa Fujisan ga miemasu yo.', vi: 'Ngày đẹp trời thì nhìn thấy núi Phú Sĩ đấy.' },
      ],
    },

    /* ── Reading ── */
    { t: 'h', text: 'Đọc to — Reading (40 điểm)' },
    {
      t: 'p',
      text: 'Đề đọc dài khoảng 100–110 ký tự: **4 từ chữ Hán** gạch chân (12đ), **4 từ katakana** (12đ), còn lại hiragana (16đ, sai một ký tự −0,2đ). 30 giây chuẩn bị. Bốn đoạn dưới đây viết đúng khuôn đó, chỉ dùng từ Bài 1–10. Tắt furigana khi đã quen (hoặc luyện ở **Chữ Hán · Đọc không furigana**).',
    },
    {
      t: 'examples',
      items: [
        {
          en: 'きょうはバスツアーのひです。あさはちじにえきのまえに{集合|しゅうごう}しました。ワンさんはまだきていません。わたしはコンビニでジュースをかってきました。バスのなかでガイドさんがはなしました。「チケットはたいせつです。なくさないでください。」{荷物|にもつ}はうえにおきました。',
          ro: 'Kyou wa basu tsuaa no hi desu. Asa hachiji ni eki no mae ni shuugou shimashita. Wan-san wa mada kite imasen. Watashi wa konbini de juusu o katte kimashita. Basu no naka de gaido-san ga hanashimashita. "Chiketto wa taisetsu desu. Nakusanaide kudasai." Nimotsu wa ue ni okimashita.',
          vi: 'Hôm nay là ngày đi tour xe buýt. 8 giờ sáng tập hợp trước ga. Wang vẫn chưa đến. Tôi ra cửa hàng tiện lợi mua nước quả rồi quay lại. Trên xe, hướng dẫn viên nói: "Vé quan trọng. Đừng làm mất." Hành lý thì để phía trên.',
        },
        {
          en: 'にちようび、ともだちと{動物園|どうぶつえん}へいきました。サルがバナナをたべていました。パンダもいました。{入|い}り{口|ぐち}でボールをかりることができます。{観覧車|かんらんしゃ}からとおくのやまがみえました。ゆうがた、さむくなりましたから、{喫茶店|きっさてん}でコーヒーをのみました。',
          ro: 'Nichiyoubi, tomodachi to doubutsuen e ikimashita. Saru ga banana o tabete imashita. Panda mo imashita. Iriguchi de booru o kariru koto ga dekimasu. Kanransha kara tooku no yama ga miemashita. Yuugata, samuku narimashita kara, kissaten de koohii o nomimashita.',
          vi: 'Chủ Nhật tôi đi sở thú với bạn. Con khỉ đang ăn chuối. Có cả gấu trúc. Ở lối vào có thể mượn bóng. Từ đu quay nhìn thấy núi ở xa. Chiều tối trời trở lạnh nên chúng tôi uống cà phê ở quán.',
        },
        {
          en: 'えきをでて、みちをまっすぐいってください。ふたつめの{交差点|こうさてん}をみぎにまがってください。{橋|はし}をわたって、コンビニのかどをひだりにまがります。わたしのアパートはぎんこうのとなりです。まどから{東京|とうきょう}タワーがみえますよ。',
          ro: 'Eki o dete, michi o massugu itte kudasai. Futatsume no kousaten o migi ni magatte kudasai. Hashi o watatte, konbini no kado o hidari ni magarimasu. Watashi no apaato wa ginkou no tonari desu. Mado kara Toukyou tawaa ga miemasu yo.',
          vi: 'Ra khỏi ga, đi thẳng đường. Rẽ phải ở ngã tư thứ hai. Qua cầu, rẽ trái ở góc cửa hàng tiện lợi. Căn hộ của tôi ở cạnh ngân hàng. Từ cửa sổ nhìn thấy tháp Tokyo đấy.',
        },
        {
          en: 'びじゅつかんのなかで、しゃしんをとらないでください。{大|おお}きいこえではなさないでください。ほかのおきゃくさんに{迷惑|めいわく}ですから。たばこはそとの{喫煙所|きつえんじょ}ですってください。パンフレットはいりぐちでもらうことができます。',
          ro: 'Bijutsukan no naka de, shashin o toranaide kudasai. Ookii koe de hanasanaide kudasai. Hoka no okyakusan ni meiwaku desu kara. Tabako wa soto no kitsuenjo de sutte kudasai. Panfuretto wa iriguchi de morau koto ga dekimasu.',
          vi: 'Trong bảo tàng xin đừng chụp ảnh. Xin đừng nói to. Vì làm phiền các khách khác. Thuốc lá thì hút ở khu hút thuốc bên ngoài. Tờ giới thiệu có thể nhận ở lối vào.',
        },
      ],
    },
    {
      t: 'note',
      title: 'Chỗ dễ đọc sai trong bốn đoạn trên',
      items: [
        '**集合 しゅうごう**, **荷物 にもつ**, **動物園 どうぶつえん**, **入り口 いりぐち**, **観覧車 かんらんしゃ**, **喫茶店 きっさてん**, **交差点 こうさてん**, **迷惑 めいわく**, **喫煙所 きつえんじょ** — từ chữ Hán dạng đề thi.',
        'Katakana kéo dài / âm ngắt: バスツアー basu tsuaa, コンビニ, ジュース juusu, チケット chiketto, ボール booru, コーヒー koohii, アパート apaato, パンフレット panfuretto.',
        'Thể ない đọc liền: なくさないで (nakusanaide), とらないで (toranaide), はなさないで (hanasanaide).',
        'は đọc **wa**, を đọc **o**, へ đọc **e**: {荷物|にもつ}**は**, {動物園|どうぶつえん}**へ**, みち**を**.',
      ],
    },

    /* ── Tự ghi âm ── */
    { t: 'h', text: 'Tự ghi âm — trả lời không nhìn đáp án' },
    {
      t: 'speak',
      id: 'b10-noi-ghi-am',
      part: '1',
      questions: [
        'もう ひるごはんを たべましたか。',
        'もう しゅくだいを しましたか。',
        'もう にほんへ いきましたか。',
        'ハノイで なにが できますか。',
        'がっこうで なにが できますか。',
        'あなたの へやから なにが みえますか。',
        'いま、なにが きこえますか。',
        'どうぶつで なにが いちばん すきですか。',
        'さいきん、さむく なりましたか。',
        'にほんごが じょうずに なりましたか。',
        'この ほんを かりても いいですか。',
        'えきから がっこうまで どうやって いきますか。',
      ],
    },
  ],
};

/* ═══════════════════════════ 7. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b10-bai-tap',
  kind: 'homework',
  title: 'Bài tập về nhà — Bài 10 (có đáp án)',
  goal: 'Tự chia thể ない, dịch, đổi dạng câu, chọn trợ từ – từ vựng – câu đáp và ghép câu Bài 10 không cần nhìn bài học.',
  minutes: 50,
  blocks: [
    {
      t: 'p',
      text: 'Gõ tiếng Nhật bằng bộ gõ (gõ romaji, máy đổi sang kana). Chữ Hán hay kana đều được chấp nhận; dấu câu và dấu cách không tính. Nếu máy chấm sai mà bạn tin mình đúng, bấm **Hỏi gia sư** ngay dưới câu đó.',
    },
    {
      t: 'quiz',
      id: 'b10-bt-dich',
      title: 'Dịch sang tiếng Nhật',
      kind: 'translate',
      grammar: 'Vないでください · Vてもいいですか · NがVています · まだVていません · Vてきます · ～ことができます · Nが見えます／聞こえます · ～くなります／～になります · N(nơi)をVます · Nは～てください',
      items: [
        { q: 'Xin đừng vào đó.', answers: V('そこに{入|はい}らないでください。', 'そこへ{入|はい}らないでください。'), hint: 'そこ, 入ります → 入らない' },
        { q: 'Đừng trễ giờ tập hợp.', answers: V('{集合時間|しゅうごうじかん}に{遅|おく}れないでください。', '{集合|しゅうごう}の{時間|じかん}に{遅|おく}れないでください。'), hint: '集合時間, 遅れます' },
        { q: 'Vì nguy hiểm nên đừng đẩy (người khác).', answers: V('{危|あぶ}ないですから、{押|お}さないでください。', '{危|あぶ}ないですから、{人|ひと}を{押|お}さないでください。', '{危|あぶ}ないですから、{前|まえ}の{人|ひと}を{押|お}さないでください。'), hint: '危ない, 押します' },
        { q: 'Tôi ngồi bên cạnh được không?', answers: V('{隣|となり}に{座|すわ}ってもいいですか。', '{隣|となり}に{座|すわ}っていいですか。'), hint: '隣, 座ります' },
        { q: 'Tôi mở cửa sổ được không?', answers: V('{窓|まど}を{開|あ}けてもいいですか。', '{窓|まど}を{開|あ}けていいですか。'), hint: '窓, 開けます' },
        { q: 'A, con khỉ đang ăn chuối.', answers: V('あっ、サルがバナナを{食|た}べています。', 'あ、サルがバナナを{食|た}べています。', 'サルがバナナを{食|た}べています。'), hint: 'サル, バナナ — N が Vています' },
        { q: 'Tôi vẫn chưa mua vé.', answers: V('まだチケットを{買|か}っていません。', 'チケットはまだ{買|か}っていません。', '{私|わたし}はまだチケットを{買|か}っていません。'), hint: 'まだ, チケット, 買います' },
        { q: 'Tôi đi mua nước quả một chút rồi quay lại.', answers: V('ちょっとジュースを{買|か}ってきます。', 'ジュースを{買|か}ってきます。'), hint: 'ちょっと, ジュース — Vてきます' },
        { q: 'Ở đây mua tem được không?', answers: V('ここで{切手|きって}を{買|か}うことができますか。', 'ここで{切手|きって}が{買|か}えますか。'), hint: '切手, 買う (thể từ điển) + ことができます' },
        { q: 'Ở đằng kia có thể ăn uống.', answers: V('あそこで{食事|しょくじ}ができます。', 'あそこで{食事|しょくじ}をすることができます。'), hint: 'あそこ, 食事' },
        { q: 'Từ đây nhìn thấy núi Phú Sĩ.', answers: V('ここから{富士山|ふじさん}が{見|み}えます。'), hint: 'ここから, 富士山, 見えます' },
        { q: '(Trên điện thoại) Tôi nghe không rõ.', answers: V('よく{聞|き}こえません。', 'すみません、よく{聞|き}こえません。'), hint: 'よく, 聞こえます' },
        { q: 'Trời lạnh rồi nhỉ.', answers: V('{寒|さむ}くなりましたね。'), hint: '寒い → 寒く + なりました' },
        { q: 'Sắp 12 giờ rồi.', answers: V('もうすぐ{12時|じゅうにじ}になります。', 'もうすぐ{十二時|じゅうにじ}になります。'), hint: 'もうすぐ, 12時 + になります' },
        { q: 'Qua cây cầu rồi rẽ phải.', answers: V('{橋|はし}を{渡|わた}って、{右|みぎ}に{曲|ま}がってください。', '{橋|はし}を{渡|わた}って、{右|みぎ}へ{曲|ま}がってください。'), hint: '橋を渡ります, 右に曲がります' },
        { q: 'Rẽ trái ở ngã tư thứ hai.', answers: V('{2|ふた}つ{目|め}の{交差点|こうさてん}を{左|ひだり}に{曲|ま}がってください。', '{二|ふた}つ{目|め}の{交差点|こうさてん}を{左|ひだり}に{曲|ま}がってください。', '{2|ふた}つ{目|め}の{交差点|こうさてん}を{左|ひだり}に{曲|ま}がります。'), hint: '二つ目, 交差点を, 左に曲がります' },
        { q: '(Từ chối rồi chỉ chỗ khác) Hành lý thì để đằng kia.', answers: V('{荷物|にもつ}はあそこに{置|お}いてください。'), hint: '荷物は — ポイント 97' },
        { q: 'Mệt rồi. Nghỉ ở ghế dài đằng kia đi.', answers: V('{疲|つか}れました。あそこのベンチで{休|やす}みましょう。', '{疲|つか}れました。あのベンチで{休|やす}みましょう。'), hint: '疲れます, ベンチ, 休みます' },
      ],
    },
    {
      t: 'quiz',
      id: 'b10-bt-doi-dang',
      title: 'Đổi dạng — viết lại theo yêu cầu (gõ chữ Hán hoặc kana)',
      kind: 'fill',
      grammar: 'ます → ない (nhóm 1: い段→あ段, い→わ · nhóm 2: bỏ ます · します→しない, 来ます→来ない) · ないでください · てもいいですか · てきます · 辞書形ことができます · くなります／になります · まだ～ていません',
      items: [
        { q: '{飲|の}みます → thể ない', answers: V('{飲|の}まない') },
        { q: '{吸|す}います → thể ない', answers: V('{吸|す}わない') },
        { q: '{入|はい}ります → thể ない', answers: V('{入|はい}らない') },
        { q: '{来|き}ます → thể ない', answers: V('{来|こ}ない') },
        { q: '{捨|す}てます → thể ない', answers: V('{捨|す}てない') },
        { q: '{集合|しゅうごう}します → thể ない', answers: V('{集合|しゅうごう}しない') },
        { q: '{押|お}します → nhờ đừng (～ないでください)', answers: V('{押|お}さないでください') },
        { q: '{写真|しゃしん}を{撮|と}ります → xin phép (～てもいいですか)', answers: V('{写真|しゃしん}を{撮|と}ってもいいですか', '{写真|しゃしん}を{撮|と}っていいですか') },
        { q: 'トイレに{行|い}きます → đi rồi quay lại (～てきます)', answers: V('トイレに{行|い}ってきます') },
        { q: 'ボールを{借|か}ります → hỏi "ở đây được không" (ここで～ことができますか)', answers: V('ここでボールを{借|か}りることができますか') },
        { q: '{薬|くすり}を{飲|の}みます → "chưa" (まだ～ていません)', answers: V('まだ{薬|くすり}を{飲|の}んでいません') },
        { q: '{暗|くら}い → đã trở nên (～なりました)', answers: V('{暗|くら}くなりました') },
        { q: '{元気|げんき} → đã trở nên (～なりました)', answers: V('{元気|げんき}になりました') },
        { q: 'いい → đã trở nên (～なりました)', answers: V('よくなりました') },
      ],
    },
    {
      t: 'mcq',
      id: 'b10-bt-tro-tu',
      title: 'Chọn trợ từ đúng',
      items: [
        { q: 'あの{橋|はし}＿{渡|わた}ってください。', options: ['に', 'を', 'で', 'が'], correct: 1, why: 'Nơi đi qua → **を** (ポイント 96).' },
        { q: '{交差点|こうさてん}を{右|みぎ}＿{曲|ま}がってください。', options: ['を', 'に', 'で', 'が'], correct: 1, why: 'Hướng rẽ → **に**.' },
        { q: 'ここ＿{東京|とうきょう}タワーが{見|み}えます。', options: ['で', 'に', 'から', 'を'], correct: 2, why: 'Đứng ở đâu mà nhìn → **から**.' },
        { q: '{鳥|とり}の{声|こえ}＿{聞|き}こえます。', options: ['を', 'が', 'に', 'で'], correct: 1, why: '聞こえます đi với **が** (ポイント 94).' },
        { q: 'あっ、パンダ＿{寝|ね}ています。', options: ['は', 'が', 'を', 'に'], correct: 1, why: 'Vừa phát hiện, chỉ cho người khác → **が** (ポイント 90).' },
        { q: 'ここで{切手|きって}を{買|か}うこと＿できますか。', options: ['を', 'が', 'に', 'は'], correct: 1, why: '～こと**が**できます (ポイント 93).' },
        { q: '{集合時間|しゅうごうじかん}＿{遅|おく}れないでください。', options: ['を', 'で', 'に', 'が'], correct: 2, why: 'Trễ (giờ nào) → **に**遅れます.' },
        { q: '{荷物|にもつ}＿あそこに{置|お}いてください。 (vừa từ chối "để ở đây")', options: ['を', 'は', 'が', 'に'], correct: 1, why: 'Đưa tân ngữ lên làm chủ đề đối chiếu → **は** (ポイント 97).' },
        { q: '{寒|さむ}い → {寒|さむ}＿なりました。', options: ['いに', 'く', 'に', 'くに'], correct: 1, why: 'イA: い → **く** + なります (ポイント 95).' },
        { q: '{上手|じょうず}＿なりました。', options: ['く', 'に', 'が', 'で'], correct: 1, why: 'ナA + **に**なります.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b10-bt-tu-vung',
      title: 'Chọn từ đúng',
      items: [
        { q: '{車|くるま}の＿が{聞|き}こえます。', options: ['{声|こえ}', '{音|おと}', '{道|みち}', '{手|て}'], correct: 1, why: 'Tiếng của đồ vật → **{音|おと}**; {声|こえ} cho người, con vật.' },
        { q: '{次|つぎ}の＿を{左|ひだり}に{曲|ま}がってください。 (ngã tư)', options: ['{交差点|こうさてん}', '{観覧車|かんらんしゃ}', '{荷物|にもつ}', '{出口|でぐち}'], correct: 0, why: 'Ngã tư = **{交差点|こうさてん}**.' },
        { q: 'このチケットは＿です。なくさないでください。', options: ['{迷惑|めいわく}', '{危|あぶ}ない', '{大切|たいせつ}', '{暗|くら}い'], correct: 2, why: 'Vé **quan trọng** → {大切|たいせつ}.' },
        { q: '{大|おお}きい{声|こえ}で{話|はな}さないでください。{他|ほか}のお{客|きゃく}さんに＿ですから。', options: ['{大切|たいせつ}', '{迷惑|めいわく}', '{痛|いた}い', '{本当|ほんとう}'], correct: 1, why: 'Gây phiền → **{迷惑|めいわく}**.' },
        { q: 'たくさん{歩|ある}きました。＿。', options: ['{疲|つか}れました', 'おなかがすきます', '{渡|わた}りました', '{探|さが}しました'], correct: 0, why: 'Đi bộ nhiều → **{疲|つか}れました** (mệt).' },
        { q: '＿。{何|なに}か{飲|の}みたいです。', options: ['おなかがすきました', 'のどがかわきました', '{暗|くら}くなりました', '{足|あし}が{痛|いた}いです'], correct: 1, why: 'Muốn uống → **のどがかわきました** (khát).' },
        { q: 'もう{5時|ごじ}ですね。＿{帰|かえ}りましょう。', options: ['まっすぐ', 'ちょっと', 'そろそろ', 'よく'], correct: 2, why: 'Đến lúc về → **そろそろ**.' },
        { q: 'A：あっ、ゾウが{水|みず}を{飲|の}んでいます。B：＿。', options: ['{本当|ほんとう}だ', 'ええと', 'そろそろ', 'いってらっしゃい'], correct: 0, why: '"Thật này!" → **{本当|ほんとう}だ**.' },
        { q: 'ごみはうちへ＿ください。', options: ['{捨|す}てて', '{持|も}って{帰|かえ}って', '{入|はい}って', '{押|お}して'], correct: 1, why: 'Rác thì **mang về** nhà → {持|も}って{帰|かえ}って.' },
        { q: 'ワンさんがいません。ちょっと＿きます。', options: ['{探|さが}して', '{座|すわ}って', '{立|た}って', '{飛|と}んで'], correct: 0, why: 'Đi **tìm** rồi quay lại → {探|さが}してきます.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b10-bt-hoi-dap',
      title: 'Chọn câu đáp đúng',
      items: [
        { q: 'A：{隣|となり}に{座|すわ}ってもいいですか。 (B đồng ý)', options: ['はい、どうぞ。', 'はい、{座|すわ}ります。', 'あ、すみません。', 'いいえ、まだです。'], correct: 0, why: 'Cho phép lịch sự → **はい、どうぞ**.' },
        { q: 'A：{窓|まど}を{開|あ}けないでください。 (B đang mở)', options: ['はい、どうぞ。', 'あ、すみません。', 'いいですよ。', '{本当|ほんとう}だ。'], correct: 1, why: 'Bị nhắc khi đang làm → **あ、すみません**.' },
        { q: 'A：もう{薬|くすり}を{飲|の}みましたか。 (B chưa uống)', options: ['いいえ、{飲|の}みませんでした。', 'いいえ、まだ{飲|の}んでいません。', 'はい、まだです。', 'いいえ、{飲|の}まないでください。'], correct: 1, why: 'Chưa → **まだ{飲|の}んでいません** (ポイント 91).' },
        { q: 'A：そこから{何|なに}が{見|み}えますか。', options: ['{大|おお}きい{橋|はし}を{見|み}ます。', '{大|おお}きい{橋|はし}が{見|み}えます。', '{大|おお}きい{橋|はし}があります。', '{大|おお}きい{橋|はし}を{渡|わた}ります。'], correct: 1, why: 'N **が{見|み}えます**.' },
        { q: 'A：ここでボールを{借|か}りることができますか。 (không được, mượn ở quầy)', options: ['いいえ、できません。ボールは{受付|うけつけ}で{借|か}りてください。', 'いいえ、{借|か}りません。', 'はい、どうぞ。', 'ボールを{借|か}りないでください。'], correct: 0, why: 'できません + chỉ chỗ khác bằng **N は～てください** (ポイント 93 + 97).' },
        { q: 'A：{寒|さむ}くなりましたね。', options: ['そうですね。{喫茶店|きっさてん}でコーヒーを{飲|の}みませんか。', 'はい、{寒|さむ}いになりました。', 'いいえ、まだです。', 'はい、どうぞ。'], correct: 0, why: 'Đồng tình + đề xuất theo tình hình (ポイント 95 + ませんか).' },
        { q: 'A：ちょっとトイレに{行|い}ってきます。', options: ['はい、どうぞ。', 'はい。', 'すみません、ちょっと……。', '{本当|ほんとう}だ。'], correct: 1, why: 'Người ở lại chỉ cần **はい** (hoặc いってらっしゃい).' },
      ],
    },
    {
      t: 'build',
      id: 'b10-bt-ghep',
      title: 'Ghép câu — một ngày đi tour từ đầu đến cuối',
      items: [
        { vi: 'Park vẫn chưa đến.', chips: ['パクさんは', 'まだ', '{来|き}ていません', '{来|き}ませんでした', 'もう'], answer: ['パクさんは', 'まだ', '{来|き}ていません'], ro: 'Paku-san wa mada kite imasen.' },
        { vi: 'Tôi đi tìm Park rồi quay lại.', chips: ['パクさんを', '{探|さが}して', 'きます', '{探|さが}しに', 'いきます'], answer: ['パクさんを', '{探|さが}して', 'きます'], ro: 'Paku-san o sagashite kimasu.' },
        { vi: 'Từ đó bạn nhìn thấy gì?', chips: ['そこから', '{何|なに}が', '{見|み}えますか', '{何|なに}を', 'そこで'], answer: ['そこから', '{何|なに}が', '{見|み}えますか'], ro: 'Soko kara nani ga miemasu ka.' },
        { vi: 'Đi thẳng con đường đó rồi rẽ phải ở góc phố.', chips: ['その{道|みち}を', 'まっすぐ{行|い}って、', '{角|かど}を', '{右|みぎ}に', '{曲|ま}がってください', '{道|みち}に', '{角|かど}で'], answer: ['その{道|みち}を', 'まっすぐ{行|い}って、', '{角|かど}を', '{右|みぎ}に', '{曲|ま}がってください'], ro: 'Sono michi o massugu itte, kado o migi ni magatte kudasai.' },
        { vi: 'Mọi người, đừng làm mất vé.', chips: ['{皆|みな}さん、', 'チケットを', 'なくさないで', 'ください', 'なくして', 'が'], answer: ['{皆|みな}さん、', 'チケットを', 'なくさないで', 'ください'], ro: 'Minasan, chiketto o nakusanaide kudasai.' },
        { vi: 'Tôi lấy tờ giới thiệu này được không?', chips: ['この', 'パンフレットを', 'もらっても', 'いいですか', 'もらいても', 'が'], answer: ['この', 'パンフレットを', 'もらっても', 'いいですか'], ro: 'Kono panfuretto o moratte mo ii desu ka.' },
        { vi: 'Thuốc lá thì hút ở khu hút thuốc.', chips: ['たばこは', '{喫煙所|きつえんじょ}で', '{吸|す}ってください', 'たばこを', '{吸|す}わないで'], answer: ['たばこは', '{喫煙所|きつえんじょ}で', '{吸|す}ってください'], ro: 'Tabako wa kitsuenjo de sutte kudasai.' },
        { vi: 'Ở cửa hàng đằng kia có thể mua quà.', chips: ['あそこの', '{店|みせ}で', 'お{土産|みやげ}を', '{買|か}う', 'ことができます', '{買|か}います', 'に'], answer: ['あそこの', '{店|みせ}で', 'お{土産|みやげ}を', '{買|か}う', 'ことができます'], ro: 'Asoko no mise de omiyage o kau koto ga dekimasu.' },
        { vi: 'Nhìn kìa, con chim đang bay.', chips: ['{見|み}てください。', '{鳥|とり}が', '{飛|と}んでいます', '{鳥|とり}を', '{飛|と}びます'], answer: ['{見|み}てください。', '{鳥|とり}が', '{飛|と}んでいます'], ro: 'Mite kudasai. Tori ga tonde imasu.' },
        { vi: 'Trời tối rồi. Về thôi chứ?', chips: ['{暗|くら}く', 'なりました。', 'そろそろ', '{帰|かえ}りませんか', '{暗|くら}いに', 'まっすぐ'], answer: ['{暗|くら}く', 'なりました。', 'そろそろ', '{帰|かえ}りませんか'], ro: 'Kuraku narimashita. Sorosoro kaerimasen ka.' },
      ],
    },
  ],
};

export const BAI_10: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, KANJI, NGHE, NOI, BAI_TAP];

/* ═══════════════════ 📖 THEO SÁCH — Bài 10 (p.169–184) ═══════════════════
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
    'Dòng dịch "VI" in trong sách ở p.171, 174, 175, 178, 179 thực ra là **tiếng Hàn** (lỗi in / chung khuôn 4 thứ tiếng) — dùng phần tả bằng tiếng Việt ở đây.',
  ],
};

export const SACH_10: Lesson = {
  id: 'b10-sach',
  kind: 'review',
  title: 'Theo sách — Bài 10 (trang 169–184)',
  goal: 'Nhìn tranh tour xe buýt, bảo tàng, sở thú trong sách là nói được: chưa …, đi … rồi về, chỉ đường qua điện thoại, xin phép, nhắc "đừng …", tả con vật đang làm gì, hỏi chỗ này làm được gì và đề xuất theo tình hình.',
  minutes: 60,
  blocks: [
    CACH_DUNG,

    ...trang(
      'Trang 169 · 話してみよう・聞いてみよう — Mở bài バスツアー',
      '**話してみよう** — 4 ảnh không lời: (1) một nhóm bạn trẻ đeo ba lô đứng cạnh xe buýt du lịch, một cô giơ tay vươn vai, một người chỉ tay — háo hức sắp lên xe; (2) cận cảnh một hộp cơm (cơm nắm, đồ chiên) và cái cốc bên cạnh — cơm hộp của chuyến đi; (3) ba người bạn (hai nữ một nam) ngồi dưới gốc cây ăn cơm hộp bằng đũa; (4) trong xe buýt chật khách, mọi người ngồi nói chuyện, một người ăn vặt. Mục đích: nói về đi tour, ăn trưa ngoài trời. **聞いてみよう** (CD B62): nghe trước đoạn hội thoại dài của bài — chính là trang 184.',
      [
        C('（ảnh 1）この{人|ひと}たちはどこにいますか。', '(shashin 1) Kono hitotachi wa doko ni imasu ka.', '(ảnh 1) Những người này đang ở đâu?'),
        S('バスの{前|まえ}にいます。', 'Basu no mae ni imasu.', 'Họ đang ở trước xe buýt.'),
        C('（ảnh 3）{何|なに}をしていますか。', '(shashin 3) Nani o shite imasu ka.', '(ảnh 3) Họ đang làm gì?'),
        S('{木|き}の{下|した}でお{弁当|べんとう}を{食|た}べています。', 'Ki no shita de obentou o tabete imasu.', 'Họ đang ăn cơm hộp dưới gốc cây.'),
        C('ミンさんはバスツアーに{行|い}きましたか。', 'Min-san wa basu tsuaa ni ikimashita ka.', 'Minh đã đi tour xe buýt chưa?'),
        S('いいえ、まだ{行|い}っていません。でも、{行|い}きたいです。', 'Iie, mada itte imasen. Demo, ikitai desu.', 'Chưa ạ, em chưa đi. Nhưng em muốn đi.'),
      ],
      [
        'Cô hỏi "đang làm gì" với ảnh → **～ています** (Bài 7). Cô hỏi "đã đi chưa" → trả lời bằng mẫu mới **まだ～ていません** (ポイント 91).',
        'Xem **Hội thoại · Bức tranh chung của bài** và **Ngữ pháp · ポイント 91**.',
      ],
    ),

    ...trang(
      'Trang 170–171 · チャレンジ! {集合|しゅうごう}',
      'Trang 170: **ngày đi tour, ở điểm tập hợp, trưởng đoàn đang điểm danh**. Tranh lớn: một người cầm bảng kẹp giấy đứng trước xe buýt (khách đang lên xe) gọi tên; phía trước một cô gái quay lại nhìn, một người đi ngang qua toà nhà ngân hàng "ABC BANK", cột có biển số nhà "24". Ô (1): trưởng đoàn gọi "アンナさん", mũi tên chỉ một bạn nam đứng cạnh, hai bạn nữ quay đầu thắc mắc — Anna chưa đến. Ô (2): một người khoa tay làm động tác gọi điện rồi quay đi — "tìm không thấy Anna, để tôi gọi". Trang 171: một cô gái áp điện thoại vào tai, đứng cạnh xe buýt "Fuji Express". Ô (3): bong bóng khuôn mặt bạn kèm dấu "?" và vạch rung chuông — gọi mãi; ô (4): bong bóng người đứng cạnh toà nhà "KSビル", đường đi ngoằn ngoèo, hình xe buýt — hỏi / chỉ đường; ô nhỏ: người đứng cạnh **ngân hàng số 24**; ô cuối: bản đồ trong bong bóng có ô "24", biểu tượng ngân hàng ¥ và mũi tên rẽ phải. **Mục tiêu できる:** không biết đường tới điểm tập hợp thì gọi điện hỏi bạn và tìm tới được; nói được những câu ngắn trước giờ xuất phát. ☞ ポイント 91, 92, 94, 96.',
      [
        C('アンナさんはもう{来|き}ましたか。', 'Anna-san wa mou kimashita ka.', 'Anna đã đến chưa?'),
        S('いいえ、まだ{来|き}ていません。', 'Iie, mada kite imasen.', 'Chưa ạ, bạn ấy vẫn chưa đến.'),
        C('じゃ、どうしますか。', 'Ja, dou shimasu ka.', 'Vậy em làm gì?'),
        S('アンナさんに{電話|でんわ}をかけます。', 'Anna-san ni denwa o kakemasu.', 'Em gọi điện cho Anna.'),
        C('（{電話|でんわ}で）ミンさん、そこから{何|なに}が{見|み}えますか。', '(Denwa de) Min-san, soko kara nani ga miemasu ka.', '(Qua điện thoại) Minh, từ chỗ em nhìn thấy gì?'),
        S('{銀行|ぎんこう}が{見|み}えます。{24|にじゅうよん}の{銀行|ぎんこう}です。', 'Ginkou ga miemasu. Nijuuyon no ginkou desu.', 'Em thấy ngân hàng ạ. Ngân hàng số 24.'),
        C('じゃ、その{銀行|ぎんこう}の{角|かど}を{右|みぎ}に{曲|ま}がってください。', 'Ja, sono ginkou no kado o migi ni magatte kudasai.', 'Vậy em rẽ phải ở góc ngân hàng đó.'),
        S('{銀行|ぎんこう}の{角|かど}を{右|みぎ}ですね。わかりました。', 'Ginkou no kado o migi desu ne. Wakarimashita.', 'Góc ngân hàng rẽ phải nhỉ. Em hiểu rồi.'),
      ],
      [
        '**ポイント 91 まだ～ていません** (chưa) · **ポイント 92 ～てきます** (đi … rồi quay lại) · **ポイント 94 Nが見えます** (từ chỗ đó thấy gì) · **ポイント 96 Nを曲がります／渡ります** (を = nơi đi qua).',
        'Khi chỉ đường qua điện thoại, câu mở đầu chuẩn là **そこから何が見えますか** — người lạc chỉ cần tả cái mình thấy: **～が見えます**.',
        'Nhắc lại để xác nhận bằng **～ですね** (Bài 6) rồi **わかりました** — cô chấm câu này.',
        'Xem **Hội thoại · ① 集合** và **Ngữ pháp · ポイント 91, 92, 94, 96**.',
      ],
    ),

    ...trang(
      'Trang 172 · 言ってみよう (chủ đề 1) — Số 1: まだ～ていません · Số 2: ～てきます · Số 3: ～が見えます',
      '**Số 1:** "đã … chưa?" → "chưa": 例 vé xe buýt・mua; ① cơm hộp・mua; ② thuốc・uống; ③ Park・đến. **Số 2:** "B ơi, tôi đi … một chút (rồi về)" → "vâng": 例 nước quả・mua; ① nhà vệ sinh・đi; ② thuốc lá・hút; ③ Wang・tìm; ④ Anna・đi đón. **Số 3:** gọi điện hỏi "bạn đang ở đâu?" → "không rõ lắm" → "từ đó thấy gì?" → tranh phố xá có cầu, sông uốn khúc, tháp và núi, đánh số: 例 toà nhà cao, ① cây cầu, ② con sông, ③ tháp (giống tháp Tokyo), ④ ngọn núi (giống núi Phú Sĩ).',
      [
        C('ミンさん、もう{薬|くすり}を{飲|の}みましたか。', 'Min-san, mou kusuri o nomimashita ka.', 'Minh uống thuốc chưa?'),
        S('いいえ、まだ{飲|の}んでいません。', 'Iie, mada nonde imasen.', 'Chưa ạ, em chưa uống.'),
        C('バスは{9時|くじ}に{出|で}ますよ。', 'Basu wa kuji ni demasu yo.', 'Xe chạy lúc 9 giờ đấy.'),
        S('じゃ、ちょっと{水|みず}を{買|か}ってきます。', 'Ja, chotto mizu o katte kimasu.', 'Vậy em đi mua nước một chút rồi quay lại.'),
        C('もしもし、ミンさん、{今|いま}、どこにいますか。', 'Moshi moshi, Min-san, ima, doko ni imasu ka.', 'Alô, Minh, giờ em đang ở đâu?'),
        S('ああ、よくわかりません。', 'Aa, yoku wakarimasen.', 'Dạ, em không rõ lắm.'),
        C('そこから{何|なに}が{見|み}えますか。', 'Soko kara nani ga miemasu ka.', 'Từ đó em thấy gì?'),
        S('{川|かわ}と{大|おお}きい{橋|はし}が{見|み}えます。', 'Kawa to ookii hashi ga miemasu.', 'Em thấy con sông và cây cầu lớn.'),
      ],
      [
        'Số 1: nhớ đổi động từ sang **thể て + いません**: 買います → **買って**いません, 飲みます → **飲んで**いません, 来ます → **来て**いません.',
        'Số 2: **ちょっと + Vて + きます**; đi đón = 迎えに行きます → **迎えに行ってきます**.',
        'Số 3: **よくわかりません** = không rõ lắm (よく = rõ). Vật nhìn thấy + **が**見えます, không phải を.',
        'Xem **Ngữ pháp · ポイント 91, 92, 94** và **Luyện nói · Câu hỏi không tranh ①**.',
      ],
      [
        mau([
          E('もうバスのチケットを{買|か}いましたか。— いいえ、まだ{買|か}っていません。', 'Mou basu no chiketto o kaimashita ka. — Iie, mada katte imasen.', 'Số 1 例.'),
          E('もうお{弁当|べんとう}を{買|か}いましたか。— いいえ、まだ{買|か}っていません。', 'Mou obentou o kaimashita ka. — Iie, mada katte imasen.', 'Số 1 ① — cơm hộp.'),
          E('もう{薬|くすり}を{飲|の}みましたか。— いいえ、まだ{飲|の}んでいません。', 'Mou kusuri o nomimashita ka. — Iie, mada nonde imasen.', 'Số 1 ② — thuốc.'),
          E('パクさんはもう{来|き}ましたか。— いいえ、まだ{来|き}ていません。', 'Paku-san wa mou kimashita ka. — Iie, mada kite imasen.', 'Số 1 ③ — Park.'),
          E('Bさん、ちょっとジュースを{買|か}ってきます。— はい。', 'B-san, chotto juusu o katte kimasu. — Hai.', 'Số 2 例.'),
          E('Bさん、ちょっとトイレに{行|い}ってきます。— はい。', 'B-san, chotto toire ni itte kimasu. — Hai.', 'Số 2 ① — nhà vệ sinh.'),
          E('Bさん、ちょっとたばこを{吸|す}ってきます。— はい。', 'B-san, chotto tabako o sutte kimasu. — Hai.', 'Số 2 ② — thuốc lá.'),
          E('Bさん、ちょっとワンさんを{探|さが}してきます。— はい。', 'B-san, chotto Wan-san o sagashite kimasu. — Hai.', 'Số 2 ③ — tìm Wang.'),
          E('Bさん、ちょっとアンナさんを{迎|むか}えに{行|い}ってきます。— はい。', 'B-san, chotto Anna-san o mukae ni itte kimasu. — Hai.', 'Số 2 ④ — đón Anna.'),
          E('もしもし、Bさん、{今|いま}、どこにいますか。— ああ、よくわかりません。— そこから{何|なに}が{見|み}えますか。— {高|たか}いビルが{見|み}えます。', 'Moshi moshi, B-san, ima, doko ni imasu ka. — Aa, yoku wakarimasen. — Soko kara nani ga miemasu ka. — Takai biru ga miemasu.', 'Số 3 例 — toà nhà cao.'),
          E('{大|おお}きい{橋|はし}が{見|み}えます。', 'Ookii hashi ga miemasu.', 'Số 3 ① — cây cầu.'),
          E('{川|かわ}が{見|み}えます。', 'Kawa ga miemasu.', 'Số 3 ② — con sông.'),
          E('{東京|とうきょう}タワーが{見|み}えます。', 'Toukyou tawaa ga miemasu.', 'Số 3 ③ — tháp.'),
          E('{富士山|ふじさん}が{見|み}えます。', 'Fujisan ga miemasu.', 'Số 3 ④ — núi.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 173 · 言ってみよう số 4 · やってみよう · ロールプレイ (chủ đề 1)',
      '**Số 4:** "tôi không biết đường, chỉ giúp" → "từ đó thấy gì?" → "thấy …" → "vậy …": hai người cầm điện thoại hai bên một bản đồ phố; các ô gợi ý: 例 cây cầu (qua cầu rồi rẽ trái), ① đèn giao thông, ② vạch sang đường / con đường, ③ toà nhà cao; bản đồ có sông, cầu, các điểm rẽ ①②③ và mũi tên đường đi. **やってみよう** (CD B67): nghe rồi tìm **xe buýt ở đâu** trên bản đồ có các vị trí ⓐ–ⓕ (toà nhà cao, cửa hàng số 24 cạnh vạch sang đường, bưu điện, cầu qua sông, đèn giao thông, ngân hàng, hai cửa hàng quần áo hai đầu cầu; đường tàu chạy phía dưới). **ロールプレイ:** A tự chọn chỗ đậu xe buýt trên bản đồ, đang ngồi trên xe, B chưa tới — A chỉ đường qua điện thoại; B đang ở ga, không biết đường, gọi hỏi A.',
      [
        S('{先生|せんせい}、{行|い}き{方|かた}がわかりません。{教|おし}えてください。', 'Sensei, ikikata ga wakarimasen. Oshiete kudasai.', 'Cô ơi, em không biết đường. Cô chỉ em với.'),
        C('はい。そこから{何|なに}が{見|み}えますか。', 'Hai. Soko kara nani ga miemasu ka.', 'Ừ. Từ đó em thấy gì?'),
        S('ええと、{信号|しんごう}が{見|み}えます。', 'Eeto, shingou ga miemasu.', 'Ờ, em thấy đèn giao thông.'),
        C('じゃ、その{信号|しんごう}を{渡|わた}って、まっすぐ{行|い}ってください。{2|ふた}つ{目|め}の{角|かど}を{左|ひだり}に{曲|ま}がってください。', 'Ja, sono shingou o watatte, massugu itte kudasai. Futatsume no kado o hidari ni magatte kudasai.', 'Vậy em qua chỗ đèn đó, đi thẳng. Rẽ trái ở góc phố thứ hai.'),
        S('{2|ふた}つ{目|め}の{角|かど}を{左|ひだり}ですね。わかりました。', 'Futatsume no kado o hidari desu ne. Wakarimashita.', 'Góc thứ hai rẽ trái nhỉ. Em hiểu rồi.'),
      ],
      [
        'Hỏi đường: **行き方がわかりません。教えてください** (行き方 = cách đi — mẫu ～方 Bài 7).',
        'Chỉ đường: **Nを渡って** (qua), **まっすぐ行って** (đi thẳng), **Nを右／左に曲がってください** (rẽ). Thứ mấy: **～つ目の**.',
        'Hướng rẽ ở các ô ①–③ phụ thuộc mũi tên trong sách — câu mẫu dưới đây theo một hướng giả định; khi nói trên lớp, nhìn mũi tên mà đổi 右／左.',
        'やってみよう: bắt **Nを渡って／Nを曲がって** và **右／左**; không có đáp án ở đây. Luyện: **Luyện nghe · Bài 1 — Xe buýt ở đâu?**',
        'Xem **Ngữ pháp · ポイント 96 — Bộ câu chỉ đường** và **Luyện nói · Đóng vai — Vai 1**.',
      ],
      [
        mau([
          E('Bさん、{行|い}き{方|かた}がわかりません。{教|おし}えてください。— はい。そこから{何|なに}が{見|み}えますか。— ええと、{大|おお}きい{橋|はし}が{見|み}えます。— じゃ、その{橋|はし}を{渡|わた}って、{左|ひだり}に{曲|ま}がってください。', 'B-san, ikikata ga wakarimasen. Oshiete kudasai. — Hai. Soko kara nani ga miemasu ka. — Eeto, ookii hashi ga miemasu. — Ja, sono hashi o watatte, hidari ni magatte kudasai.', 'Số 4 例 — cây cầu.'),
          E('ええと、{信号|しんごう}が{見|み}えます。— じゃ、その{信号|しんごう}を{右|みぎ}に{曲|ま}がってください。', 'Eeto, shingou ga miemasu. — Ja, sono shingou o migi ni magatte kudasai.', 'Số 4 ① — đèn giao thông.'),
          E('ええと、{広|ひろ}い{道|みち}が{見|み}えます。— じゃ、その{道|みち}を{渡|わた}って、まっすぐ{行|い}ってください。', 'Eeto, hiroi michi ga miemasu. — Ja, sono michi o watatte, massugu itte kudasai.', 'Số 4 ② — con đường.'),
          E('ええと、{高|たか}いビルが{見|み}えます。— じゃ、そのビルの{角|かど}を{左|ひだり}に{曲|ま}がってください。', 'Eeto, takai biru ga miemasu. — Ja, sono biru no kado o hidari ni magatte kudasai.', 'Số 4 ③ — toà nhà cao.'),
          E('（ロールプレイ・A）もしもし、Bさん、{今|いま}、どこにいますか。— {駅|えき}にいます。— {駅|えき}を{出|で}て、まっすぐ{行|い}ってください。{橋|はし}を{渡|わた}って、{1|ひと}つ{目|め}の{信号|しんごう}を{右|みぎ}に{曲|ま}がってください。バスは{銀行|ぎんこう}の{前|まえ}にありますよ。', 'Moshi moshi, B-san, ima, doko ni imasu ka. — Eki ni imasu. — Eki o dete, massugu itte kudasai. Hashi o watatte, hitotsume no shingou o migi ni magatte kudasai. Basu wa ginkou no mae ni arimasu yo.', 'ロールプレイ — một mẫu, tự đổi vị trí xe buýt.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 174–175 · チャレンジ! いろいろな{注意|ちゅうい}',
      'Trang 174: **trên xe buýt đang chạy tới bảo tàng mỹ thuật**. Tranh lớn: một người đàn ông đứng giơ hai tấm vé lên cao, một người với tay lên giá hành lý, mấy hành khách ngồi (một người đeo kính) nhìn theo, một người áo kẻ ô đứng giữa lối đi mỉm cười. Ô (1): một người chỉ vào chỗ ngồi, bong bóng có ông cụ đang ngồi, một chị đứng cạnh ra hiệu — hỏi xin ngồi. Ô (2-1): một người lúng túng toát mồ hôi, có biểu tượng "không được", người bên cạnh giơ tấm vé — chuyện vé (dặn đừng làm mất). Trang 175: **ở bảo tàng mỹ thuật** — tranh lớn: trước cửa bảo tàng có cột, một người đàn ông đứng hút thuốc gần lối vào, hai chị đi tới (một chị cũng cầm thuốc), góc phải có biển **cấm hút thuốc**, phía sau là cây và ghế dài. Ô (2-2): một người chỉ vào biển cấm hút thuốc (vẽ trong bong bóng) và nhắc người kia, người kia giơ tay giật mình. Ô (3): một chị hỏi nhân viên mặc đồng phục đứng cạnh dãy tủ gửi đồ, hai bong bóng hình túi xách — hỏi chỗ để hành lý. **Mục tiêu できる:** nghe hiểu lời nhắc ở nơi công cộng và xin phép được. ☞ ポイント 88, 89, 97.',
      [
        C('（ô 1）{隣|となり}に{座|すわ}ってもいいですか。', '(koma 1) Tonari ni suwatte mo ii desu ka.', '(ô 1) Cô ngồi cạnh em được không?'),
        S('はい、どうぞ。', 'Hai, douzo.', 'Vâng, mời cô.'),
        C('ミンさん、このチケットは{大切|たいせつ}です。なくさないでください。', 'Min-san, kono chiketto wa taisetsu desu. Nakusanaide kudasai.', 'Minh, vé này quan trọng. Đừng làm mất nhé.'),
        S('はい、わかりました。', 'Hai, wakarimashita.', 'Vâng, em hiểu rồi.'),
        C('（ô 2-2）あの{人|ひと}は{何|なに}をしていますか。', '(koma 2-2) Ano hito wa nani o shite imasu ka.', '(ô 2-2) Người kia đang làm gì?'),
        S('たばこを{吸|す}っています。でも、ここで{吸|す}わないでください。', 'Tabako o sutte imasu. Demo, koko de suwanaide kudasai.', 'Đang hút thuốc ạ. Nhưng ở đây xin đừng hút.'),
        C('（ô 3）ここに{荷物|にもつ}を{置|お}いてもいいですか。', '(koma 3) Koko ni nimotsu o oite mo ii desu ka.', '(ô 3) Để hành lý ở đây được không?'),
        S('すみません。{荷物|にもつ}はロッカーに{入|い}れてください。', 'Sumimasen. Nimotsu wa rokkaa ni irete kudasai.', 'Xin lỗi ạ. Hành lý thì cho vào tủ khoá.'),
      ],
      [
        '**ポイント 88 Vないでください** (đừng …) · **ポイント 89 Vてもいいですか** (xin phép) · **ポイント 97 Nは** (từ chối rồi chỉ chỗ khác: 荷物**は**あそこに…).',
        'Chia thể ない trước khi nói: 吸います → **吸わない** (い → わ), なくします → **なくさない**, 入ります → **入らない**.',
        'Được cô xin phép → **はい、どうぞ**. Bị cô nhắc → **あ、すみません** hoặc **はい、わかりました**.',
        'Xem **Hội thoại · ② いろいろな注意** và **Ngữ pháp · Trước tiên — Thể ない, ポイント 88, 89, 97**.',
      ],
    ),

    ...trang(
      'Trang 176 · 言ってみよう (chủ đề 2) — Số 1: てもいいですか · Số 2-1, 2-2: ないでください',
      '**Số 1:** tranh trong xe buýt, hành khách ngồi các hàng; 例1 xin ngồi cạnh → "vâng, mời"; 例2 xin mở cửa sổ → "xin lỗi, vì hơi lạnh…"; ①, ② là hai hành khách khác, ③ một người đứng gần cửa xe có mũi tên (lên / xuống xe) — tự nghĩ lời xin phép hợp với tranh. **Số 2-1:** hướng dẫn viên: "bây giờ chúng ta đến bảo tàng. Mọi người đừng …" → "vâng, hiểu rồi": 例 trễ giờ tập hợp; ① chụp ảnh trong bảo tàng; ② nguy hiểm・đẩy người phía trước; ③ vé này quan trọng・làm mất; ④ làm phiền khách khác・nói to. **Số 2-2:** nhắc người đang làm → "ôi, xin lỗi": 例 mở cửa sổ xe; ① ăn trên xe; ② chụp ảnh trong bảo tàng; ③ đi vào toà nhà (có nhân viên chặn); ④ giẫm lên hoa, cây; ⑤ hút thuốc cạnh biển cấm.',
      [
        C('{窓|まど}を{開|あ}けてもいいですか。', 'Mado o akete mo ii desu ka.', 'Cô mở cửa sổ được không?'),
        S('すみません。{少|すこ}し{寒|さむ}いですから……。', 'Sumimasen. Sukoshi samui desu kara…….', 'Xin lỗi cô. Vì em hơi lạnh…'),
        C('{皆|みな}さん、{美術館|びじゅつかん}で{写真|しゃしん}を{撮|と}らないでください。', 'Minasan, bijutsukan de shashin o toranaide kudasai.', 'Mọi người, đừng chụp ảnh trong bảo tàng nhé.'),
        S('はい、わかりました。', 'Hai, wakarimashita.', 'Vâng, em hiểu rồi.'),
        C('（ô ⑤ — cô đóng vai người hút thuốc）……。', '(⑤) …….', '(ô ⑤) (cô đang hút thuốc)'),
        S('すみません、ここでたばこを{吸|す}わないでください。', 'Sumimasen, koko de tabako o suwanaide kudasai.', 'Xin lỗi, ở đây xin đừng hút thuốc.'),
        C('あ、すみません。', 'A, sumimasen.', 'Ôi, xin lỗi.'),
      ],
      [
        'Số 1 từ chối: **すみません + lý do + から……** (bỏ lửng) — y như mẫu từ chối lời rủ của Bài 6.',
        'Số 2-1 có lý do: **（lý do）ですから、～ないでください**. 他のお客さんに**迷惑**ですから — 迷惑 là tính từ な: 迷惑です.',
        'Số 2-2 là tranh — nói điều người trong tranh ĐANG làm sai, đổi sang ～ないでください.',
        'Xem **Ngữ pháp · ポイント 88 — bảng thay thế**, **ポイント 89** và **Luyện nghe · Bài 5 — Được hay không được?**',
      ],
      [
        mau([
          E('{隣|となり}に{座|すわ}ってもいいですか。— はい、どうぞ。', 'Tonari ni suwatte mo ii desu ka. — Hai, douzo.', 'Số 1 例1.'),
          E('{窓|まど}を{開|あ}けてもいいですか。— すみません。{少|すこ}し{寒|さむ}いですから……。', 'Mado o akete mo ii desu ka. — Sumimasen. Sukoshi samui desu kara…….', 'Số 1 例2.'),
          E('カーテンを{閉|し}めてもいいですか。— ええ、いいですよ。', 'Kaaten o shimete mo ii desu ka. — Ee, ii desu yo.', 'Số 1 ① — gợi ý theo tranh: kéo rèm.'),
          E('ここに{荷物|にもつ}を{置|お}いてもいいですか。— はい、どうぞ。', 'Koko ni nimotsu o oite mo ii desu ka. — Hai, douzo.', 'Số 1 ② — gợi ý: để hành lý.'),
          E('ちょっとバスを{降|お}りてもいいですか。— すみません、もうすぐ{出|で}ますから……。', 'Chotto basu o orite mo ii desu ka. — Sumimasen, mou sugu demasu kara…….', 'Số 1 ③ — gợi ý: xin xuống xe một lát.'),
          E('{皆|みな}さん、{集合時間|しゅうごうじかん}に{遅|おく}れないでください。— はい、わかりました。', 'Minasan, shuugou jikan ni okurenaide kudasai. — Hai, wakarimashita.', 'Số 2-1 例.'),
          E('{美術館|びじゅつかん}で{写真|しゃしん}を{撮|と}らないでください。', 'Bijutsukan de shashin o toranaide kudasai.', 'Số 2-1 ①.'),
          E('{危|あぶ}ないですから、{前|まえ}の{人|ひと}を{押|お}さないでください。', 'Abunai desu kara, mae no hito o osanaide kudasai.', 'Số 2-1 ②.'),
          E('このチケットは{大切|たいせつ}ですから、なくさないでください。', 'Kono chiketto wa taisetsu desu kara, nakusanaide kudasai.', 'Số 2-1 ③.'),
          E('{他|ほか}のお{客|きゃく}さんに{迷惑|めいわく}ですから、{大|おお}きい{声|こえ}で{話|はな}さないでください。', 'Hoka no okyakusan ni meiwaku desu kara, ookii koe de hanasanaide kudasai.', 'Số 2-1 ④.'),
          E('{窓|まど}を{開|あ}けないでください。— あ、すみません。', 'Mado o akenaide kudasai. — A, sumimasen.', 'Số 2-2 例.'),
          E('バスの{中|なか}で{食|た}べないでください。— あ、すみません。', 'Basu no naka de tabenaide kudasai. — A, sumimasen.', 'Số 2-2 ① — ăn trên xe.'),
          E('ここで{写真|しゃしん}を{撮|と}らないでください。— あ、すみません。', 'Koko de shashin o toranaide kudasai. — A, sumimasen.', 'Số 2-2 ② — chụp ảnh.'),
          E('そこに{入|はい}らないでください。— あ、すみません。', 'Soko ni hairanaide kudasai. — A, sumimasen.', 'Số 2-2 ③ — đi vào chỗ cấm.'),
          E('{花|はな}の{中|なか}に{入|はい}らないでください。— あ、すみません。', 'Hana no naka ni hairanaide kudasai. — A, sumimasen.', 'Số 2-2 ④ — giẫm lên hoa.'),
          E('ここでたばこを{吸|す}わないでください。— あ、すみません。', 'Koko de tabako o suwanaide kudasai. — A, sumimasen.', 'Số 2-2 ⑤ — hút thuốc.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 177 · 言ってみよう số 3 · やってみよう · ペアで話しましょう (chủ đề 2)',
      '**Số 3:** A xin phép làm ở ĐÂY → B từ chối và chỉ chỗ khác bằng **Nは**: 例 để hành lý ở đây／để ở đằng kia; ① hút thuốc ở đây／hút ở khu hút thuốc; ② ăn cơm hộp ở đây／ăn ở bàn đằng kia; ③ vứt rác ở đây／mang về nhà. **やってみよう** (CD B72): nghe 4 đoạn, người phụ nữ **sắp làm gì**? 7 tranh ⓐ–ⓖ: kéo rèm cửa sổ, ngồi dưới sàn ăn cơm hộp bằng đũa, sắp xếp tờ giới thiệu trên giá, đi về phía biển nhà vệ sinh, ăn ở bàn tròn có cốc, đứng cạnh cửa sổ xe đã đóng rèm, hướng dẫn viên chỉ trỏ nói với hai khách. **ペアで話しましょう:** tranh lớn bên trong bảo tàng (biển lối ra, tranh trên tường, nhân viên, một đoàn khách cầm cờ, tờ giới thiệu) — đóng vai người trong tranh: xin ngồi, xin chụp ảnh, xin để hành lý…',
      [
        C('ここでお{弁当|べんとう}を{食|た}べてもいいですか。', 'Koko de obentou o tabete mo ii desu ka.', 'Ăn cơm hộp ở đây được không?'),
        S('すみません。お{弁当|べんとう}はあそこのテーブルで{食|た}べてください。', 'Sumimasen. Obentou wa asoko no teeburu de tabete kudasai.', 'Xin lỗi cô. Cơm hộp thì ăn ở bàn đằng kia ạ.'),
        C('ここにごみを{捨|す}ててもいいですか。', 'Koko ni gomi o sutete mo ii desu ka.', 'Vứt rác ở đây được không?'),
        S('すみません。ごみはうちへ{持|も}って{帰|かえ}ってください。', 'Sumimasen. Gomi wa uchi e motte kaette kudasai.', 'Xin lỗi cô. Rác thì mang về nhà ạ.'),
        C('（ペア）ここで{写真|しゃしん}を{撮|と}ってもいいですか。', '(Pea) Koko de shashin o totte mo ii desu ka.', '(Cặp) Ở đây chụp ảnh được không?'),
        S('すみません、{写真|しゃしん}はちょっと……。', 'Sumimasen, shashin wa chotto…….', 'Xin lỗi, chụp ảnh thì không được ạ.'),
      ],
      [
        'Câu B luôn có dạng **N は + chỗ khác + で／に／へ + Vてください** — vật được nói tới đổi **を → は** (ポイント 97).',
        'Chỗ khác: nơi làm việc **で** (喫煙所**で**吸って), nơi đặt vật **に** (あそこ**に**置いて), nơi mang về **へ** (うち**へ**持って帰って).',
        'やってみよう: sau "không được" hãy nghe câu **Nは～てください** — đó là việc người phụ nữ sẽ làm. Không có đáp án ở đây. Luyện: **Luyện nghe · Bài 2**.',
        'Xem **Ngữ pháp · ポイント 97** và **Luyện nói · Tranh 2 — biển báo**.',
      ],
      [
        mau([
          E('ここに{荷物|にもつ}を{置|お}いてもいいですか。— すみません。{荷物|にもつ}はあそこに{置|お}いてください。', 'Koko ni nimotsu o oite mo ii desu ka. — Sumimasen. Nimotsu wa asoko ni oite kudasai.', 'Số 3 例.'),
          E('ここでたばこを{吸|す}ってもいいですか。— すみません。たばこは{喫煙所|きつえんじょ}で{吸|す}ってください。', 'Koko de tabako o sutte mo ii desu ka. — Sumimasen. Tabako wa kitsuenjo de sutte kudasai.', 'Số 3 ①.'),
          E('ここでお{弁当|べんとう}を{食|た}べてもいいですか。— すみません。お{弁当|べんとう}はあそこのテーブルで{食|た}べてください。', 'Koko de obentou o tabete mo ii desu ka. — Sumimasen. Obentou wa asoko no teeburu de tabete kudasai.', 'Số 3 ②.'),
          E('ここにごみを{捨|す}ててもいいですか。— すみません。ごみはうちへ{持|も}って{帰|かえ}ってください。', 'Koko ni gomi o sutete mo ii desu ka. — Sumimasen. Gomi wa uchi e motte kaette kudasai.', 'Số 3 ③.'),
          E('（ペア）ここに{座|すわ}ってもいいですか。— はい、どうぞ。／パンフレットをもらってもいいですか。— ええ、どうぞ。', '(Pea) Koko ni suwatte mo ii desu ka. — Hai, douzo. / Panfuretto o moratte mo ii desu ka. — Ee, douzo.', 'ペアで話しましょう — hai mẫu.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 178–179 · チャレンジ! {動物園|どうぶつえん}で',
      'Trang 178: **đi sở thú với bạn**. Tranh lớn: con hươu cao cổ bên trái; quầy kem "ICE CREAM" đang bán cho khách; một gia đình khỉ (khỉ mẹ bế con, đang ăn chuối) ngồi trên tảng đá, một khỉ con đi phía dưới; hai bạn (một nam đang chỉ tay, một nữ) đứng cạnh lan can; phía sau là cửa hàng "ZOO SHOP おみやげ" và biển lối vào/lối ra. Ô (1): bong bóng khỉ con ăn chuối, bạn nam chỉ cho bạn nữ xem. Ô (2-1): một chị đứng ở cửa bán vé dưới biển "**観覧車**", cầm tiền, hỏi "?", bong bóng "2枚". Trang 179: lối đi trong sở thú, phía xa có **vòng đu quay** và chuồng **gấu trúc** (gấu trúc nằm trên bục có lốp xe); một nhân viên dắt chú voi con đi ngang qua khách; một đôi (anh đeo kính, chị) đi phía trước; bàn ghế picnic bên trái. Ô (2-2): hai người nhìn về cửa hàng "おみやげ", bong bóng hộp quà, ô bên cạnh là quầy bày nhiều hộp quà. Ô (3): hai người nói chuyện, bong bóng hai nhiệt kế (từ ấm xuống lạnh — trời lạnh đi), chỉ về máy bán "COFFEE". **Mục tiêu できる:** tuỳ tình hình xung quanh mà đề xuất việc làm; hỏi nơi đó có dịch vụ gì. ☞ ポイント 90, 93, 95.',
      [
        C('（ô 1）あっ、{見|み}てください。', '(koma 1) A, mite kudasai.', '(ô 1) A, nhìn kìa.'),
        S('あっ、サルがバナナを{食|た}べています。かわいいですね。', 'A, saru ga banana o tabete imasu. Kawaii desu ne.', 'A, con khỉ đang ăn chuối. Dễ thương nhỉ.'),
        C('（ô 2-1）ここで{観覧車|かんらんしゃ}のチケットを{買|か}うことができますか。', '(koma 2-1) Koko de kanransha no chiketto o kau koto ga dekimasu ka.', '(ô 2-1) Ở đây mua được vé đu quay không?'),
        S('はい、できます。', 'Hai, dekimasu.', 'Vâng, được ạ.'),
        C('じゃ、{2枚|にまい}ください。', 'Ja, nimai kudasai.', 'Vậy cho tôi 2 vé.'),
        C('（ô 3）{寒|さむ}くなりましたね。', '(koma 3) Samuku narimashita ne.', '(ô 3) Trời lạnh rồi nhỉ.'),
        S('そうですね。あそこでコーヒーを{飲|の}みませんか。', 'Sou desu ne. Asoko de koohii o nomimasen ka.', 'Vâng ạ. Mình uống cà phê ở đằng kia không cô?'),
      ],
      [
        '**ポイント 90 NがVています** (chỉ cho bạn thấy — dùng **が**, mở đầu あっ／見てください) · **ポイント 93 ～ことができます** (chỗ này làm được gì) · **ポイント 95 ～くなりました／～になりました** (tình hình thay đổi).',
        'Người nghe đáp **本当だ** (thật này!) + cảm nhận かわいいですね／大きいですね.',
        'Ô (3): nhận xét thay đổi (寒くなりましたね) rồi **rủ** (～ませんか, Bài 6) — đó là cái "đề xuất theo tình hình" của mục tiêu.',
        'Xem **Hội thoại · ③ 動物園で** và **Ngữ pháp · ポイント 90, 93, 95**.',
      ],
    ),

    ...trang(
      'Trang 180 · 言ってみよう (chủ đề 3) — Số 1: NがVています · Số 2-1, 2-2: ～ことができます',
      '**Số 1:** "a, con … đang …" → "thật này, dễ thương nhỉ": 例 koala trên cây đang ăn lá; ① khỉ mẹ và khỉ con ngâm mình thư giãn trong chậu nước tròn; ② gấu trúc đang leo / đu trên cành cây; ③ con gấu đang bơi, nước bắn tung; ④ con voi dùng vòi uống nước trong xô. **Số 2-1:** hỏi nhân viên sở thú "ở đây … được không?" → "vâng" → "vậy cho tôi …": 例 mua vé đu quay; ① mượn bóng; ② mua tem; ③ gửi hành lý (bưu kiện). **Số 2-2:** A nói muốn gì / cảm thấy gì → B chỉ "ở đằng kia … được đấy": 例 muốn mua quà → cửa hàng おみやげ; ① muốn đi xe đạp → chỗ cho thuê xe đạp, bảng "1時間500円"; ② mệt → bàn ghế nghỉ; ③ đói → nhà hàng (biển dao nĩa); ④ khát → máy bán nước.',
      [
        C('（②）あっ、パンダが{木|き}に{登|のぼ}っています。', '(2) A, panda ga ki ni nobotte imasu.', '(②) A, gấu trúc đang leo cây kìa.'),
        S('{本当|ほんとう}だ。かわいいですね。', 'Hontou da. Kawaii desu ne.', 'Thật này. Dễ thương quá.'),
        C('（④）{何|なに}が{水|みず}を{飲|の}んでいますか。', '(4) Nani ga mizu o nonde imasu ka.', '(④) Con gì đang uống nước?'),
        S('ゾウが{水|みず}を{飲|の}んでいます。', 'Zou ga mizu o nonde imasu.', 'Con voi đang uống nước ạ.'),
        C('（số 2-2 ②）{疲|つか}れました。', '(2-2, 2) Tsukaremashita.', '(số 2-2 ②) Cô mệt rồi.'),
        S('あ、あそこで{休|やす}むことができますよ。', 'A, asoko de yasumu koto ga dekimasu yo.', 'À, đằng kia nghỉ được đấy ạ.'),
      ],
      [
        'Số 1: động từ đổi sang **て + います**: 食べて, 休んで, 登って, 泳いで, 飲んで. Con vật + **が**.',
        'Số 2-1: **Vる（辞書形）ことができますか** — 買う, 借りる, 送る (Bài 9 đã học cách đổi).',
        'Số 2-2: ① muốn đi xe đạp → chỗ đó **thuê** xe: 自転車**を借りる**ことができます; ③ đói → **食事ができます** (danh từ + ができます cũng được).',
        'Xem **Ngữ pháp · ポイント 90, 93 — bảng thay thế** và **Luyện nói · Tranh 1 — sở thú**.',
      ],
      [
        mau([
          E('あっ、コアラがえさを{食|た}べています。— {本当|ほんとう}だ。かわいいですね。', 'A, koara ga esa o tabete imasu. — Hontou da. Kawaii desu ne.', 'Số 1 例.'),
          E('あっ、サルが{水|みず}の{中|なか}で{休|やす}んでいます。— {本当|ほんとう}だ。', 'A, saru ga mizu no naka de yasunde imasu. — Hontou da.', 'Số 1 ① — khỉ ngâm nước nghỉ ngơi.'),
          E('あっ、パンダが{木|き}に{登|のぼ}っています。— {本当|ほんとう}だ。かわいいですね。', 'A, panda ga ki ni nobotte imasu. — Hontou da. Kawaii desu ne.', 'Số 1 ② — gấu trúc leo cây.'),
          E('あっ、クマが{泳|およ}いでいます。— {本当|ほんとう}だ。', 'A, kuma ga oyoide imasu. — Hontou da.', 'Số 1 ③ — gấu bơi.'),
          E('あっ、ゾウが{水|みず}を{飲|の}んでいます。— {本当|ほんとう}だ。{大|おお}きいですね。', 'A, zou ga mizu o nonde imasu. — Hontou da. Ookii desu ne.', 'Số 1 ④ — voi uống nước.'),
          E('あのう、ここで{観覧車|かんらんしゃ}のチケットを{買|か}うことができますか。— はい。— じゃ、{2枚|にまい}ください。', 'Anou, koko de kanransha no chiketto o kau koto ga dekimasu ka. — Hai. — Ja, nimai kudasai.', 'Số 2-1 例.'),
          E('あのう、ここでボールを{借|か}りることができますか。— はい。— じゃ、{1|ひと}つお{願|ねが}いします。', 'Anou, koko de booru o kariru koto ga dekimasu ka. — Hai. — Ja, hitotsu onegai shimasu.', 'Số 2-1 ① — mượn bóng.'),
          E('あのう、ここで{切手|きって}を{買|か}うことができますか。— はい。— じゃ、{3枚|さんまい}ください。', 'Anou, koko de kitte o kau koto ga dekimasu ka. — Hai. — Ja, sanmai kudasai.', 'Số 2-1 ② — mua tem.'),
          E('あのう、ここで{荷物|にもつ}を{送|おく}ることができますか。— はい。— じゃ、お{願|ねが}いします。', 'Anou, koko de nimotsu o okuru koto ga dekimasu ka. — Hai. — Ja, onegai shimasu.', 'Số 2-1 ③ — gửi hàng.'),
          E('お{土産|みやげ}を{買|か}いたいです。— あ、あそこで{買|か}うことができますよ。', 'Omiyage o kaitai desu. — A, asoko de kau koto ga dekimasu yo.', 'Số 2-2 例.'),
          E('{自転車|じてんしゃ}に{乗|の}りたいです。— あ、あそこで{自転車|じてんしゃ}を{借|か}りることができますよ。{1時間|いちじかん}{500円|ごひゃくえん}です。', 'Jitensha ni noritai desu. — A, asoko de jitensha o kariru koto ga dekimasu yo. Ichijikan gohyaku en desu.', 'Số 2-2 ① — thuê xe đạp.'),
          E('{疲|つか}れました。— あ、あそこで{休|やす}むことができますよ。', 'Tsukaremashita. — A, asoko de yasumu koto ga dekimasu yo.', 'Số 2-2 ② — nghỉ.'),
          E('おなかがすきました。— あ、あそこで{食事|しょくじ}ができますよ。', 'Onaka ga sukimashita. — A, asoko de shokuji ga dekimasu yo.', 'Số 2-2 ③ — ăn.'),
          E('のどがかわきました。— あ、あそこで{飲|の}み{物|もの}を{買|か}うことができますよ。', 'Nodo ga kawakimashita. — A, asoko de nomimono o kau koto ga dekimasu yo.', 'Số 2-2 ④ — đồ uống.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 181 · 言ってみよう số 3 · やってみよう · ペアで話しましょう (chủ đề 3)',
      '**Số 3:** A nhận xét tình hình đã đổi (～くなりましたね／～になりましたね) → B rủ làm việc hợp lúc đó (～ませんか) → A "làm vậy đi": 例 lạnh／uống cà phê ở quán đằng kia; ① trời đẹp／chụp ảnh ngoài trời; ② trời tối／sắp về nhà thôi; ③ 12 giờ／sắp ăn trưa thôi. **やってみよう** (CD B77): nghe 2 đoạn, **hai người nào ⓐ–ⓕ** đang nói trên bản đồ sở thú (quầy thông tin "i" cạnh đu quay, biển cấm xe đạp, chỗ thuê xe đạp レンタルサイクル, nhà hàng, chuồng khỉ, chuồng gấu, ghế dài cạnh máy tự động). **ペアで話しましょう:** đóng vai những người trong bản đồ.',
      [
        C('{暗|くら}くなりましたね。', 'Kuraku narimashita ne.', 'Trời tối rồi nhỉ.'),
        S('そうですね。そろそろ{家|いえ}へ{帰|かえ}りませんか。', 'Sou desu ne. Sorosoro ie e kaerimasen ka.', 'Vâng ạ. Mình về nhà thôi chứ ạ?'),
        C('そうしましょう。', 'Sou shimashou.', 'Làm vậy đi.'),
        C('{12時|じゅうにじ}になりましたね。', 'Juuniji ni narimashita ne.', '12 giờ rồi nhỉ.'),
        S('そうですね。そろそろ{昼|ひる}ご{飯|はん}を{食|た}べませんか。', 'Sou desu ne. Sorosoro hirugohan o tabemasen ka.', 'Vâng ạ. Mình ăn trưa thôi chứ ạ?'),
      ],
      [
        '**イA: い → く**なりました (寒く, 暗く, **よく**), **N: に**なりました (12時に). Đừng nói ~~寒いになりました~~ / ~~いくなりました~~.',
        '**そろそろ** = "đến lúc rồi" — thêm trước lời rủ về nhà / ăn trưa cho tự nhiên.',
        'やってみよう: bắt tên con vật / dịch vụ (自転車, 飲み物, 写真…) để đoán vị trí; không có đáp án ở đây. Luyện: **Luyện nghe · Bài 3**.',
        'Xem **Ngữ pháp · ポイント 95 — bảng thay thế** và **Luyện nói · Câu hỏi không tranh ③**.',
      ],
      [
        mau([
          E('{寒|さむ}くなりましたね。— そうですね。あそこの{喫茶店|きっさてん}でコーヒーを{飲|の}みませんか。— そうしましょう。', 'Samuku narimashita ne. — Sou desu ne. Asoko no kissaten de koohii o nomimasen ka. — Sou shimashou.', 'Số 3 例.'),
          E('{天気|てんき}がよくなりましたね。— そうですね。{外|そと}で{写真|しゃしん}を{撮|と}りませんか。— そうしましょう。', 'Tenki ga yoku narimashita ne. — Sou desu ne. Soto de shashin o torimasen ka. — Sou shimashou.', 'Số 3 ① — いい → よく.'),
          E('{暗|くら}くなりましたね。— そうですね。そろそろ{家|いえ}へ{帰|かえ}りませんか。— そうしましょう。', 'Kuraku narimashita ne. — Sou desu ne. Sorosoro ie e kaerimasen ka. — Sou shimashou.', 'Số 3 ②.'),
          E('{12時|じゅうにじ}になりましたね。— そうですね。そろそろ{昼|ひる}ご{飯|はん}を{食|た}べませんか。— そうしましょう。', 'Juuniji ni narimashita ne. — Sou desu ne. Sorosoro hirugohan o tabemasen ka. — Sou shimashou.', 'Số 3 ③ — N になります.'),
          E('（ペア）あっ、クマが{寝|ね}ていますよ。— {本当|ほんとう}だ。ここで{写真|しゃしん}を{撮|と}ってもいいですか。— ええ、いいですよ。', '(Pea) A, kuma ga nete imasu yo. — Hontou da. Koko de shashin o totte mo ii desu ka. — Ee, ii desu yo.', 'ペアで話しましょう — một mẫu.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 182 · できる! — Lập kế hoạch và diễn một ngày du lịch',
      'Nhiệm vụ tổng hợp theo nhóm: (1) lập kế hoạch một chuyến đi; (2) nghĩ nhân vật; (3) viết kịch bản một ngày của chuyến đi; (4) luyện nói **không nhìn kịch bản**, có cả nét mặt và cử chỉ; (5) diễn trước lớp. Trên lớp: mỗi nhóm một kịch bản, cô thường đóng thêm vai nhân viên / người qua đường và hỏi bất ngờ.',
      [
        C('{皆|みな}さんはどこへ{行|い}きますか。', 'Minasan wa doko e ikimasu ka.', 'Các em đi đâu?'),
        S('{鎌倉|かまくら}へ{行|い}きます。バスツアーです。', 'Kamakura e ikimasu. Basu tsuaa desu.', 'Chúng em đi Kamakura. Tour xe buýt ạ.'),
        C('{何時|なんじ}にどこに{集合|しゅうごう}しますか。', 'Nanji ni doko ni shuugou shimasu ka.', 'Mấy giờ tập hợp ở đâu?'),
        S('{8時|はちじ}に{駅|えき}の{前|まえ}に{集合|しゅうごう}します。', 'Hachiji ni eki no mae ni shuugou shimasu.', '8 giờ tập hợp trước ga ạ.'),
        C('（{美術館|びじゅつかん}の{人|ひと}として）あ、ここで{写真|しゃしん}を{撮|と}らないでください。', '(Bijutsukan no hito to shite) A, koko de shashin o toranaide kudasai.', '(Cô đóng vai nhân viên bảo tàng) Ấy, ở đây đừng chụp ảnh.'),
        S('あ、すみません。じゃ、{外|そと}で{撮|と}ってもいいですか。', 'A, sumimasen. Ja, soto de totte mo ii desu ka.', 'Ôi, xin lỗi. Vậy chụp ở ngoài được không ạ?'),
      ],
      [
        'Kịch bản nên có đủ 3 chủ đề của bài: **tập hợp + chỉ đường** (91, 92, 94, 96) → **nhắc nhở + xin phép** (88, 89, 97) → **sở thú / chỗ chơi** (90, 93, 95).',
        'Bị cô bất ngờ nhắc "đừng …" → **あ、すみません** rồi xin phép cách khác bằng **～てもいいですか** — ghi điểm phản xạ.',
        'Xem **Hội thoại · できる！— Kịch bản mẫu "Một ngày ở Kamakura"**.',
      ],
    ),

    ...trang(
      'Trang 182 · 話読聞書「{好|す}きなところ」 — Nơi tôi thích',
      'Ô 話読聞書 có một đoạn ngắn khoảng 10 câu: người viết giới thiệu một khu vui chơi ven biển ở Tokyo mà mình thích — ở đó có suối nước nóng, vòng đu quay, trung tâm mua sắm; ở suối nước nóng được mặc yukata tuỳ thích, cả chó cũng được vào tắm; giá vé đu quay một người; từ đu quay nhìn thấy một cây cầu nổi tiếng và tháp Tokyo; buổi tối đèn trang trí rất đẹp — và kết bằng lời khuyên người đọc kỳ nghỉ tới hãy đến. Từ ở chân bài: イルミネーション, ショッピングモール, 浴衣, 着ます[着る]2. Bốn câu gợi ý bên cạnh (cô sẽ hỏi đúng 4 câu này): **好きなところを教えてください · そこに何がありますか · そこで何ができますか · どうやって行きますか**. Nhiệm vụ: viết và đọc đoạn về nơi BẠN thích theo đúng 4 câu đó.',
      [
        C('{好|す}きなところを{教|おし}えてください。', 'Suki na tokoro o oshiete kudasai.', 'Em hãy kể về nơi em thích.'),
        S('{私|わたし}はハノイの{旧市街|きゅうしがい}が{好|す}きです。', 'Watashi wa Hanoi no kyuushigai ga suki desu.', 'Em thích khu phố cổ Hà Nội.'),
        C('そこに{何|なに}がありますか。', 'Soko ni nani ga arimasu ka.', 'Ở đó có gì?'),
        S('{古|ふる}い{店|みせ}やレストランや{湖|みずうみ}などがあります。', 'Furui mise ya resutoran ya mizuumi nado ga arimasu.', 'Có những cửa hàng cổ, nhà hàng, hồ nước…'),
        C('そこで{何|なに}ができますか。', 'Soko de nani ga dekimasu ka.', 'Ở đó có thể làm gì?'),
        S('おいしいフォーを{食|た}べることができます。お{土産|みやげ}も{買|か}うことができます。{夜|よる}、{町|まち}を{歩|ある}くこともできます。', 'Oishii foo o taberu koto ga dekimasu. Omiyage mo kau koto ga dekimasu. Yoru, machi o aruku koto mo dekimasu.', 'Có thể ăn phở ngon. Cũng có thể mua quà. Buổi tối cũng có thể đi dạo phố.'),
        C('どうやって{行|い}きますか。', 'Douyatte ikimasu ka.', 'Đi đến đó bằng cách nào?'),
        S('{学校|がっこう}からバスで{40分|よんじゅっぷん}です。{皆|みな}さんも{今度|こんど}の{休|やす}みにぜひ{行|い}ってください。', 'Gakkou kara basu de yonjuppun desu. Minasan mo kondo no yasumi ni zehi itte kudasai.', 'Từ trường đi xe buýt 40 phút. Mọi người kỳ nghỉ tới nhất định hãy đi nhé.'),
      ],
      [
        '4 câu hỏi = 4 mẫu: **Nが好きです** (Bài 5) · **Nに N1やN2などがあります** (Bài 4) · **～ことができます** (ポイント 93) · **～で～分です／～に乗って～で降ります** (Bài 9, どうやって).',
        'Thêm một câu **～から～が見えます** (ポイント 94) là bài của bạn đủ ý như bài mẫu.',
        '旧市街 (phố cổ), 湖 (hồ), 古い (cũ) là từ tự thêm cho bài của Minh — thay bằng nơi thật của bạn.',
        'Xem **Hội thoại · ④ Nói–Đọc–Nghe–Viết — 好きなところ** (bài mẫu mới + khung viết).',
      ],
    ),

    { t: 'h', text: 'Trang 183 · ことば — Từ vựng của bài' },
    {
      t: 'p',
      text: 'Trang liệt kê 70 từ theo 3 chủ đề: (1) 集合 — âm thanh, giọng, thuốc, phải, trái, góc phố, ngã tư, đèn giao thông, cầu, đường, ～つ目, tìm, uống (thuốc), rẽ, băng qua, nghe thấy, nhìn thấy, まっすぐ, よく (よくわかりません), ちょっと, ええと; (2) いろいろな注意 — rèm, khách, rác, tay, hành lý, tờ giới thiệu, khác, mọi người, quà, đẩy, ngồi, đứng, làm mất, vào (教室に入ります), mang về, trễ, vứt, tập hợp, nguy hiểm, quan trọng, phiền; (3) 動物園で — sở thú, gấu, koala, khỉ, voi, chim, gấu trúc, chim cánh cụt, lối vào, lối ra, mồi, bụng, đu quay, chuối, bóng, ～たち, đi bộ, bay, trở nên, nghỉ (ベンチで休みましょう), cho ăn / làm (やります), đói, khát, mệt, đau, tối, そろそろ, 本当だ. Không có tranh. Đủ nghĩa, romaji, ví dụ: xem mục **Từ vựng** của Bài 10.',
    },
    {
      t: 'note',
      title: 'Mẹo',
      items: [
        'Cô hay kiểm tra nhanh bằng cặp dễ lẫn: **見ます/見えます · 聞きます/聞こえます · 音/声 · 橋/はし (đũa)** — ôn ở **Từ vựng · Nhầm lẫn hay gặp**.',
        'Với mỗi động từ mới, thuộc luôn **thể ない** (入らない, 押さない, 遅れない) — cô sẽ hỏi trong bài kiểm tra nhỏ. Bảng: **Ngữ pháp · Động từ của Bài 10 — thể ます → て → ない**.',
        'Xem **Từ vựng · Bài 10** và **Chữ Hán · Bài 10**.',
      ],
    },

    ...trang(
      'Trang 184 · もう{一度|いちど}{聞|き}こう — Nghe lại cả bài',
      'Nghe lại đoạn ở trang 169 (CD B62), hai cảnh. **Trước xe buýt:** trưởng đoàn hỏi Anna có đây không — Park nói Anna chưa đến và gọi điện; điện thoại rè nên Anna nghe không rõ; Anna đang ở **gần ga**, không biết đường tới điểm hẹn và nhờ chỉ; Park hỏi Anna có thấy **toà nhà cao** phía trước không, rồi bảo **đi thẳng con đường trước toà nhà và rẽ trái**; cuối cùng Park nhìn thấy Anna và gọi. **Ở sở thú:** nhân viên nhắc mọi người đi chầm chậm, **đừng đẩy**; Anna thấy **gấu trúc đang ăn**, Park thấy **voi đang uống nước**; Anna xin **chụp ảnh** và được phép; sắp **12 giờ** nên hai người định ăn trưa, Park đi **mua đồ uống rồi quay lại**; Anna xin **ăn cơm hộp** ở chỗ đó — nhân viên công viên bảo ăn ở **đằng kia có bàn**, và **đừng vào bãi cỏ**. Từ ở chân trang: 芝生, 場所, 待ち合わせ, ゆっくり. Cô sẽ hỏi lại các chi tiết.',
      [
        C('アンナさんはどこにいましたか。', 'Anna-san wa doko ni imashita ka.', 'Anna đã ở đâu?'),
        S('{駅|えき}の{近|ちか}くにいました。', 'Eki no chikaku ni imashita.', 'Bạn ấy ở gần ga ạ.'),
        C('アンナさんには{何|なに}が{見|み}えましたか。', 'Anna-san ni wa nani ga miemashita ka.', 'Anna đã nhìn thấy gì?'),
        S('{高|たか}いビルが{見|み}えました。', 'Takai biru ga miemashita.', 'Nhìn thấy toà nhà cao ạ.'),
        C('パクさんはどうやって{行|い}き{方|かた}を{教|おし}えましたか。', 'Paku-san wa douyatte ikikata o oshiemashita ka.', 'Park chỉ đường thế nào?'),
        S('ビルの{前|まえ}の{道|みち}をまっすぐ{行|い}って、{左|ひだり}に{曲|ま}がります。', 'Biru no mae no michi o massugu itte, hidari ni magarimasu.', 'Đi thẳng con đường trước toà nhà rồi rẽ trái ạ.'),
        C('{動物園|どうぶつえん}で、ゾウは{何|なに}をしていましたか。', 'Doubutsuen de, zou wa nani o shite imashita ka.', 'Ở sở thú, con voi đang làm gì?'),
        S('{水|みず}を{飲|の}んでいました。', 'Mizu o nonde imashita.', 'Đang uống nước ạ.'),
        C('アンナさんはどこでお{弁当|べんとう}を{食|た}べますか。', 'Anna-san wa doko de obentou o tabemasu ka.', 'Anna sẽ ăn cơm hộp ở đâu?'),
        S('あちらのテーブルで{食|た}べます。テーブルがありますから。', 'Achira no teeburu de tabemasu. Teeburu ga arimasu kara.', 'Ăn ở bàn đằng kia ạ. Vì ở đó có bàn.'),
      ],
      [
        '**ゆっくり** (chậm rãi) — dùng luôn khi thi: **ゆっくりお願いします** (xin nói chậm lại).',
        '**待ち合わせの場所** = điểm hẹn gặp; **芝生に入らないでください** = đừng vào bãi cỏ (biển thường gặp ở công viên Nhật).',
        'Câu hỏi quá khứ của cô (何をしていましたか) → trả lời **～ていました**.',
        'Xem **Luyện nghe · Bài 4 — Hội thoại dài: một ngày đi tour** (kịch bản mới cùng tình huống).',
      ],
    ),

    { t: 'h', text: 'Cô hỏi — bạn trả lời: ghép nhanh câu trả lời' },
    {
      t: 'build',
      id: 'b10-sach-ghep',
      title: 'Nghe câu hỏi (tiếng Việt) → ghép câu trả lời tiếng Nhật',
      items: [
        { vi: 'Cô hỏi もう薬を飲みましたか → "Chưa ạ, em chưa uống."', chips: ['いいえ、', 'まだ', '{飲|の}んでいません。', '{飲|の}みませんでした。', 'もう'], answer: ['いいえ、', 'まだ', '{飲|の}んでいません。'], ro: 'Iie, mada nonde imasen.' },
        { vi: 'Nói với bạn: "Mình đi mua nước quả một chút rồi quay lại."', chips: ['ちょっと', 'ジュースを', '{買|か}って', 'きます。', '{買|か}いに', 'いきます。'], answer: ['ちょっと', 'ジュースを', '{買|か}って', 'きます。'], ro: 'Chotto juusu o katte kimasu.' },
        { vi: 'Cô hỏi そこから何が見えますか → "Em thấy cây cầu lớn."', chips: ['{大|おお}きい', '{橋|はし}が', '{見|み}えます。', '{橋|はし}を', '{見|み}ます。'], answer: ['{大|おお}きい', '{橋|はし}が', '{見|み}えます。'], ro: 'Ookii hashi ga miemasu.' },
        { vi: 'Chỉ đường: "Qua cây cầu đó rồi rẽ trái."', chips: ['その{橋|はし}を', '{渡|わた}って、', '{左|ひだり}に', '{曲|ま}がってください。', 'その{橋|はし}に', '{左|ひだり}を'], answer: ['その{橋|はし}を', '{渡|わた}って、', '{左|ひだり}に', '{曲|ま}がってください。'], ro: 'Sono hashi o watatte, hidari ni magatte kudasai.' },
        { vi: 'Cô hỏi 隣に座ってもいいですか → "Vâng, mời cô."', chips: ['はい、', 'どうぞ。', '{座|すわ}ります。', 'すみません。'], answer: ['はい、', 'どうぞ。'], ro: 'Hai, douzo.' },
        { vi: 'Nhắc: "Ở đây xin đừng hút thuốc."', chips: ['ここで', 'たばこを', '{吸|す}わないで', 'ください。', '{吸|す}って', '{吸|す}あないで'], answer: ['ここで', 'たばこを', '{吸|す}わないで', 'ください。'], ro: 'Koko de tabako o suwanaide kudasai.' },
        { vi: 'Cô hỏi ここに荷物を置いてもいいですか → "Xin lỗi, hành lý thì để đằng kia ạ."', chips: ['すみません。', '{荷物|にもつ}は', 'あそこに', '{置|お}いてください。', '{荷物|にもつ}を', '{置|お}かないで'], answer: ['すみません。', '{荷物|にもつ}は', 'あそこに', '{置|お}いてください。'], ro: 'Sumimasen. Nimotsu wa asoko ni oite kudasai.' },
        { vi: 'Chỉ cho cô: "A, con voi đang uống nước."', chips: ['あっ、', 'ゾウが', '{水|みず}を', '{飲|の}んでいます。', 'ゾウは', '{飲|の}みます。'], answer: ['あっ、', 'ゾウが', '{水|みず}を', '{飲|の}んでいます。'], ro: 'A, zou ga mizu o nonde imasu.' },
        { vi: 'Cô nói 疲れました → "À, đằng kia nghỉ được đấy ạ."', chips: ['あ、', 'あそこで', '{休|やす}む', 'ことができますよ。', '{休|やす}みます', 'ことがありますよ。'], answer: ['あ、', 'あそこで', '{休|やす}む', 'ことができますよ。'], ro: 'A, asoko de yasumu koto ga dekimasu yo.' },
        { vi: 'Cô nói 寒くなりましたね → "Vâng. Mình uống cà phê không ạ?"', chips: ['そうですね。', 'コーヒーを', '{飲|の}みませんか。', '{飲|の}みましたか。', '{寒|さむ}いになりました。'], answer: ['そうですね。', 'コーヒーを', '{飲|の}みませんか。'], ro: 'Sou desu ne. Koohii o nomimasen ka.' },
      ],
    },
  ],
};
