/**
 * Bài 5 — 休みの日 (Ngày nghỉ) · できる日本語 初級 第5課, p.83–100 · JPD113/JPD123.
 *
 * Ngữ pháp: ポイント 37–47 (p.273–274): Vました/ませんでした · quá khứ của tính từ
 * và danh từ (かったです/くなかったです · でした/じゃありませんでした) · Nが好きです/
 * 嫌いです · Nがほしいです · Vたいです · N1へ{Vます/N2}に行きます · どこかへ行きますか ·
 * どうして · それから · N(人)とVます · ___から、___ + bảng 日・週・月・年 (表 p.288).
 * Từ vựng: đủ 61 mục trong danh sách từ mới Bài 5 của cô (sổ tra JPD123, mục 1–61).
 * Hội thoại, câu ví dụ, bài đọc, kịch bản nghe: VIẾT MỚI theo đúng tình huống của sách
 * (xem ../SOAN-BAI.md). Chỉ dùng lại tên nhân vật và tên địa danh.
 *
 * Nhân vật (giới tính quyết định giọng đọc, theo bai1.ts): nữ = パク, ワン, アンナ ·
 * nam = マルコ, ダニエル, ナタポン, カルロス. Hội thoại: role 'a'/'c' = giọng nữ,
 * 'b'/'examiner' = giọng nam.
 */
import type { Lesson } from '@/components/sach-hoc/types';

/* ── Đáp án gõ tay (giống bai1.ts) ─────────────────────────────────────────
 * ans() nhận mẫu có furigana {漢字|かな} và sinh: mỗi chữ Hán gõ bằng Hán hoặc
 * bằng kana · có/không 。 cuối (hoặc ？) · có/không 、 · có/không dấu cách ·
 * じゃ/では · số thường/số toàn góc. Phần tử ĐẦU là bản chữ Hán đầy đủ.
 */
const RUBY = /\{([^|}]+)\|([^}]+)\}/g;
function ans(...forms: string[]): string[] {
  const out = new Set<string>();
  for (const f of forms) {
    const n = [...f.matchAll(RUBY)].length;
    const bases: string[] = [];
    if (n <= 5) {
      for (let mask = 0; mask < 1 << n; mask++) {
        let i = 0;
        bases.push(f.replace(RUBY, (_m, k: string, r: string) => ((mask >> i++) & 1 ? r : k)));
      }
    } else {
      bases.push(f.replace(RUBY, '$1'), f.replace(RUBY, '$2'));
    }
    for (const b of bases)
      for (const x of [b, b.replace(/じゃありません/g, 'ではありません')])
        for (const y of [x, x.replace(/、/g, '')])
          for (const z of [y, y.replace(/\s+/g, '')])
            for (const w of [z, z.replace(/。$/, ''), z.replace(/。$/, '？')])
              for (const d of [w, w.replace(/[0-9]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0xfee0))]) out.add(d);
  }
  return [...out];
}

/* ═══════════════════════════ 1. HỘI THOẠI ═══════════════════════════ */

const HOI_THOAI: Lesson = {
  id: 'b5-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — Cuối tuần đã làm gì, thấy thế nào, kỳ nghỉ tới định làm gì',
  goal: 'Kể và hỏi được ngày nghỉ đã làm gì, đi đâu, với ai, thấy thế nào; nói được kỳ nghỉ tới muốn làm gì, muốn có gì.',
  minutes: 35,
  blocks: [
    { t: 'h', text: 'Học xong Bài 5 bạn làm được gì? (できる)' },
    {
      t: 'table',
      head: ['Chủ đề nhỏ', 'Bạn làm được', 'Câu then chốt', 'ポイント'],
      rows: [
        ['5-1 {週末|しゅうまつ} — Cuối tuần', 'Kể **ngày nghỉ đã làm gì**, đi đâu, với ai; hỏi người khác điều đó.', '{日曜日|にちようび}、{何|なに}をしましたか。・どこかへ{行|い}きましたか。', '37, 43, 45, 46'],
        ['5-2 {休|やす}みの{後|あと}で — Sau kỳ nghỉ', 'Nói **cảm tưởng** về ngày nghỉ (vui, mệt, đắt…) và hỏi "thế nào?", "tại sao?".', '～はどうでしたか。・{楽|たの}しかったです。・どうして～か。～から。', '38, 44, 47'],
        ['5-3 {今度|こんど}の{休|やす}みに — Kỳ nghỉ tới', 'Nói **kỳ nghỉ tới định làm gì**, muốn có gì, muốn làm gì, thích/ghét gì.', '～がほしいです。・～たいです。・～へ～に{行|い}きます。・～が{好|す}きです。', '39, 40, 41, 42'],
        ['できる！', 'Giới thiệu cho bạn cùng lớp **nơi mình đã đi, việc mình đã làm** — nói rồi viết thành đoạn ngắn.', 'Tất cả ở trên', '37–47'],
      ],
    },
    {
      t: 'p',
      text: 'Cách học: đọc **tình huống** → bấm nghe cả đoạn → bấm từng câu, đọc to theo 3 lần → tắt furigana và romaji, tự đọc lại. Toàn bộ động từ của Bài 3 (行きます, 食べます, 見ます…) giờ được chuyển sang **quá khứ**: chỉ cần đổi **ます → ました**. Đó là chìa khoá của cả bài.',
    },
    {
      t: 'table',
      caption: 'Nhân vật trong bài (như Bài 1)',
      head: ['Nhân vật', 'Đọc', 'Giới tính'],
      rows: [
        ['マルコ', 'Maruko', 'nam'],
        ['パク', 'Paku', 'nữ'],
        ['ワン', 'Wan', 'nữ'],
        ['アンナ', 'Anna', 'nữ'],
        ['ダニエル', 'Danieru', 'nam'],
        ['ナタポン', 'Natapon', 'nam'],
      ],
    },

    /* ── 5-1 ── */
    { t: 'h', text: '5-1 週末 — Cuối tuần đã làm gì?' },
    {
      t: 'p',
      text: '**Sáng thứ Hai**, trong lớp học. Mọi người hỏi nhau Chủ Nhật, cuối tuần vừa rồi đã làm gì. Anna hỏi Marco trước.',
    },
    {
      t: 'dialogue',
      title: '① Chủ Nhật bạn làm gì?',
      lines: [
        { who: 'アンナ', role: 'a', text: 'マルコさん、おはようございます。{日曜日|にちようび}、{何|なに}をしましたか。', ro: 'Maruko-san, ohayou gozaimasu. Nichiyoubi, nani o shimashita ka.', vi: 'Chào buổi sáng, Marco. Chủ Nhật bạn đã làm gì?' },
        { who: 'マルコ', role: 'b', text: '{友達|ともだち}の{家|いえ}へ{行|い}きました。{友達|ともだち}の{誕生日|たんじょうび}でしたから。', ro: 'Tomodachi no ie e ikimashita. Tomodachi no tanjoubi deshita kara.', vi: 'Tôi đã đến nhà bạn. Vì hôm đó là sinh nhật bạn tôi.' },
        { who: 'アンナ', role: 'a', text: 'へえ、そうですか。', ro: 'Hee, sou desu ka.', vi: 'Ồ, thế à.' },
        { who: 'マルコ', role: 'b', text: '{友達|ともだち}とケーキを{食|た}べました。それから、ゲームをしました。', ro: 'Tomodachi to keeki o tabemashita. Sorekara, geemu o shimashita.', vi: 'Tôi ăn bánh với bạn. Sau đó chơi trò chơi.' },
        { who: 'アンナ', role: 'a', text: 'どのくらいしましたか。', ro: 'Dono kurai shimashita ka.', vi: 'Chơi bao lâu?' },
        { who: 'マルコ', role: 'b', text: '{3時間|さんじかん}くらいしました。', ro: 'San-jikan kurai shimashita.', vi: 'Chơi khoảng 3 tiếng.' },
        { who: 'アンナ', role: 'a', text: 'へえ。', ro: 'Hee.', vi: 'Chà.' },
      ],
    },
    {
      t: 'p',
      text: 'Marco hỏi lại Park: cuối tuần có đi đâu không? Park không đi đâu cả.',
    },
    {
      t: 'dialogue',
      title: '② Cuối tuần có đi đâu không?',
      lines: [
        { who: 'マルコ', role: 'b', text: 'パクさんは{週末|しゅうまつ}、どこかへ{行|い}きましたか。', ro: 'Paku-san wa shuumatsu, dokoka e ikimashita ka.', vi: 'Park, cuối tuần bạn có đi đâu không?' },
        { who: 'パク', role: 'a', text: 'いいえ、どこへも{行|い}きませんでした。', ro: 'Iie, doko e mo ikimasen deshita.', vi: 'Không, tôi chẳng đi đâu cả.' },
        { who: 'マルコ', role: 'b', text: 'そうですか。{何|なに}をしましたか。', ro: 'Sou desu ka. Nani o shimashita ka.', vi: 'Thế à. Bạn đã làm gì?' },
        { who: 'パク', role: 'a', text: '{土曜日|どようび}は{洗濯|せんたく}しました。それから、{部屋|へや}を{掃除|そうじ}しました。', ro: 'Doyoubi wa sentaku shimashita. Sorekara, heya o souji shimashita.', vi: 'Thứ Bảy tôi giặt đồ. Sau đó dọn phòng.' },
        { who: 'マルコ', role: 'b', text: '{日曜日|にちようび}は？', ro: 'Nichiyoubi wa?', vi: 'Còn Chủ Nhật?' },
        { who: 'パク', role: 'a', text: 'うちで{一人|ひとり}でテレビを{見|み}ました。', ro: 'Uchi de hitori de terebi o mimashita.', vi: 'Tôi ở nhà xem ti vi một mình.' },
      ],
    },
    {
      t: 'p',
      text: 'Wang và Daniel. Daniel đi Shibuya với người yêu; Wang đi mua sắm ở Shinjuku với bạn cùng phòng.',
    },
    {
      t: 'dialogue',
      title: '③ Đi đâu, với ai, làm gì?',
      lines: [
        { who: 'ワン', role: 'a', text: 'ダニエルさん、{週末|しゅうまつ}、どこかへ{行|い}きましたか。', ro: 'Danieru-san, shuumatsu, dokoka e ikimashita ka.', vi: 'Daniel, cuối tuần anh có đi đâu không?' },
        { who: 'ダニエル', role: 'b', text: 'はい、{渋谷|しぶや}へ{行|い}きました。', ro: 'Hai, Shibuya e ikimashita.', vi: 'Có, tôi đã đi Shibuya.' },
        { who: 'ワン', role: 'a', text: '{誰|だれ}と{行|い}きましたか。', ro: 'Dare to ikimashita ka.', vi: 'Anh đi với ai?' },
        { who: 'ダニエル', role: 'b', text: '{恋人|こいびと}と{行|い}きました。{渋谷|しぶや}で{映画|えいが}を{見|み}ました。それから、{食事|しょくじ}しました。', ro: 'Koibito to ikimashita. Shibuya de eiga o mimashita. Sorekara, shokuji shimashita.', vi: 'Tôi đi với người yêu. Ở Shibuya chúng tôi xem phim. Sau đó đi ăn.' },
        { who: 'ワン', role: 'a', text: 'いいですね。', ro: 'Ii desu ne.', vi: 'Hay quá nhỉ.' },
        { who: 'ダニエル', role: 'b', text: 'ワンさんは？', ro: 'Wan-san wa?', vi: 'Còn Wang?' },
        { who: 'ワン', role: 'a', text: '{私|わたし}はルームメイトと{新宿|しんじゅく}のデパートへ{行|い}きました。デパートで{買|か}い{物|もの}しました。', ro: 'Watashi wa ruumumeito to Shinjuku no depaato e ikimashita. Depaato de kaimono shimashita.', vi: 'Tôi đi trung tâm thương mại ở Shinjuku với bạn cùng phòng. Chúng tôi mua sắm ở đó.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{日曜日|にちようび}（に）、{何|なに}をしましたか。', ro: 'Nichiyoubi (ni), nani o shimashita ka.', vi: 'Chủ Nhật đã làm gì? (に có hay không đều được)' },
        { en: '～へ{行|い}きました。／～を{見|み}ました。', ro: '~ e ikimashita. / ~ o mimashita.', vi: 'Đã đi ～. / Đã xem ～. (ポイント 37)' },
        { en: '{週末|しゅうまつ}、どこかへ{行|い}きましたか。', ro: 'Shuumatsu, dokoka e ikimashita ka.', vi: 'Cuối tuần có đi đâu không? (ポイント 43)' },
        { en: 'いいえ、どこへも{行|い}きませんでした。', ro: 'Iie, doko e mo ikimasen deshita.', vi: 'Không, chẳng đi đâu cả.' },
        { en: '{誰|だれ}と{行|い}きましたか。— {友達|ともだち}と{行|い}きました。', ro: 'Dare to ikimashita ka. — Tomodachi to ikimashita.', vi: 'Đi với ai? — Đi với bạn. (ポイント 46)' },
        { en: '～ました。それから、～ました。', ro: '~ mashita. Sorekara, ~ mashita.', vi: 'Đã ～. Sau đó, đã ～. (ポイント 45)' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý',
      items: [
        '**へえ** (hee) — "Chà / Ồ", thể hiện mình đang chú ý nghe. **いいですね** — "Hay quá nhỉ". Hai câu phản hồi này làm hội thoại tự nhiên (đã học Bài 3).',
        '**どのくらい** (dono kurai) — "bao lâu"; đáp **～{時間|じかん}くらい** (khoảng ～ tiếng) — Bài 4.',
        '**{家|いえ}** và **うち** đều là "nhà". Nói "nhà tôi / ở nhà" người Nhật hay dùng **うち**; nói nhà của người khác (bạn) dùng **{友達|ともだち}の{家|いえ}** hoặc {友達|ともだち}のうち.',
      ],
    },

    /* ── 5-2 ── */
    { t: 'h', text: '5-2 休みの後で — Ngày nghỉ thế nào?' },
    {
      t: 'p',
      text: 'Giờ ra chơi, trong lớp. Nataphon vừa đi du lịch Nagoya về. Park hỏi chuyến đi có vui không, thấy lâu đài thế nào.',
    },
    {
      t: 'dialogue',
      title: '④ Du lịch vui không?',
      lines: [
        { who: 'パク', role: 'a', text: 'ナタポンさん、{週末|しゅうまつ}、{何|なに}をしましたか。', ro: 'Natapon-san, shuumatsu, nani o shimashita ka.', vi: 'Nataphon, cuối tuần anh đã làm gì?' },
        { who: 'ナタポン', role: 'b', text: '{名古屋|なごや}へ{旅行|りょこう}に{行|い}きました。', ro: 'Nagoya e ryokou ni ikimashita.', vi: 'Tôi đi du lịch Nagoya.' },
        { who: 'パク', role: 'a', text: 'へえ。{旅行|りょこう}は{楽|たの}しかったですか。', ro: 'Hee. Ryokou wa tanoshikatta desu ka.', vi: 'Ồ. Chuyến du lịch có vui không?' },
        { who: 'ナタポン', role: 'b', text: 'はい、とても{楽|たの}しかったです。お{城|しろ}を{見|み}ました。', ro: 'Hai, totemo tanoshikatta desu. Oshiro o mimashita.', vi: 'Có, rất vui. Tôi đã ngắm lâu đài.' },
        { who: 'パク', role: 'a', text: 'お{城|しろ}はどうでしたか。', ro: 'Oshiro wa dou deshita ka.', vi: 'Lâu đài thế nào?' },
        { who: 'ナタポン', role: 'b', text: '{大|おお}きかったです。そして、とてもきれいでした。{写真|しゃしん}をたくさん{撮|と}りました。', ro: 'Ookikatta desu. Soshite, totemo kirei deshita. Shashin o takusan torimashita.', vi: 'To lắm. Và rất đẹp. Tôi chụp nhiều ảnh lắm.' },
        { who: 'パク', role: 'a', text: 'いいですね。', ro: 'Ii desu ne.', vi: 'Hay quá nhỉ.' },
      ],
    },
    {
      t: 'p',
      text: 'Anna hỏi Marco. Chủ Nhật Marco làm việc trên máy tính đến tận khuya — vất vả, chẳng vui gì.',
    },
    {
      t: 'dialogue',
      title: '⑤ Không vui lắm',
      lines: [
        { who: 'アンナ', role: 'a', text: 'マルコさん、{日曜日|にちようび}、どうでしたか。', ro: 'Maruko-san, nichiyoubi, dou deshita ka.', vi: 'Marco, Chủ Nhật thế nào?' },
        { who: 'マルコ', role: 'b', text: 'あまり{楽|たの}しくなかったです。', ro: 'Amari tanoshiku nakatta desu.', vi: 'Không vui lắm.' },
        { who: 'アンナ', role: 'a', text: 'えっ、どうしてですか。', ro: 'E, doushite desu ka.', vi: 'Ơ, sao vậy?' },
        { who: 'マルコ', role: 'b', text: '{忙|いそが}しかったですから。{朝|あさ}から{夜|よる}までうちでパソコンの{仕事|しごと}をしました。', ro: 'Isogashikatta desu kara. Asa kara yoru made uchi de pasokon no shigoto o shimashita.', vi: 'Vì tôi bận. Từ sáng đến tối tôi làm việc trên máy tính ở nhà.' },
        { who: 'アンナ', role: 'a', text: 'それは{大変|たいへん}でしたね。', ro: 'Sore wa taihen deshita ne.', vi: 'Vậy thì vất vả quá nhỉ.' },
      ],
    },
    {
      t: 'p',
      text: 'Wang kể với Anna về chuyến đi Shibuya và Yokohama. Anna hỏi từng chỗ thế nào.',
    },
    {
      t: 'dialogue',
      title: '⑥ Ở đó thế nào?',
      lines: [
        { who: 'アンナ', role: 'a', text: 'ワンさん、{日曜日|にちようび}、どこかへ{行|い}きましたか。', ro: 'Wan-san, nichiyoubi, dokoka e ikimashita ka.', vi: 'Wang, Chủ Nhật bạn có đi đâu không?' },
        { who: 'ワン', role: 'c', text: 'はい、{渋谷|しぶや}へ{行|い}きました。{渋谷|しぶや}で{服|ふく}を{買|か}いました。{安|やす}かったです。', ro: 'Hai, Shibuya e ikimashita. Shibuya de fuku o kaimashita. Yasukatta desu.', vi: 'Có, tôi đi Shibuya. Tôi mua quần áo ở Shibuya. Rẻ lắm.' },
        { who: 'アンナ', role: 'a', text: 'いいですね。{土曜日|どようび}は？', ro: 'Ii desu ne. Doyoubi wa?', vi: 'Hay nhỉ. Còn thứ Bảy?' },
        { who: 'ワン', role: 'c', text: '{土曜日|どようび}は{横浜|よこはま}へ{行|い}きました。{海|うみ}を{見|み}ました。とてもきれいでした。', ro: 'Doyoubi wa Yokohama e ikimashita. Umi o mimashita. Totemo kirei deshita.', vi: 'Thứ Bảy tôi đi Yokohama. Tôi ngắm biển. Đẹp lắm.' },
        { who: 'アンナ', role: 'a', text: '{天気|てんき}はどうでしたか。', ro: 'Tenki wa dou deshita ka.', vi: 'Thời tiết thế nào?' },
        { who: 'ワン', role: 'c', text: 'いい{天気|てんき}でしたが、{少|すこ}し{寒|さむ}かったです。', ro: 'Ii tenki deshita ga, sukoshi samukatta desu.', vi: 'Trời đẹp nhưng hơi lạnh.' },
      ],
    },
    {
      t: 'p',
      text: '**Thứ Sáu**, Daniel nói cuối tuần sẽ mua máy tính. **Thứ Hai**, Park hỏi đã mua chưa.',
    },
    {
      t: 'dialogue',
      title: '⑦ Thứ Sáu → thứ Hai: tại sao không mua?',
      lines: [
        { who: 'パク', role: 'a', text: '（{金曜日|きんようび}）ダニエルさん、{週末|しゅうまつ}、{何|なに}をしますか。', ro: '(Kinyoubi) Danieru-san, shuumatsu, nani o shimasu ka.', vi: '(Thứ Sáu) Daniel, cuối tuần anh làm gì?' },
        { who: 'ダニエル', role: 'b', text: 'パソコンを{買|か}います。', ro: 'Pasokon o kaimasu.', vi: 'Tôi sẽ mua máy tính.' },
        { who: 'パク', role: 'a', text: 'そうですか。いいですね。', ro: 'Sou desu ka. Ii desu ne.', vi: 'Thế à. Hay quá.' },
        { who: 'パク', role: 'a', text: '（{月曜日|げつようび}）ダニエルさん、パソコンを{買|か}いましたか。', ro: '(Getsuyoubi) Danieru-san, pasokon o kaimashita ka.', vi: '(Thứ Hai) Daniel, anh đã mua máy tính chưa?' },
        { who: 'ダニエル', role: 'b', text: 'いいえ、{買|か}いませんでした。', ro: 'Iie, kaimasen deshita.', vi: 'Không, tôi không mua.' },
        { who: 'パク', role: 'a', text: 'どうして{買|か}いませんでしたか。', ro: 'Doushite kaimasen deshita ka.', vi: 'Sao anh không mua?' },
        { who: 'ダニエル', role: 'b', text: '{高|たか}かったですから。{20万円|にじゅうまんえん}でした。', ro: 'Takakatta desu kara. Nijuuman en deshita.', vi: 'Vì đắt quá. 200.000 yên.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '～は{楽|たの}しかったですか。', ro: '~ wa tanoshikatta desu ka.', vi: '～ có vui không? (ポイント 38)' },
        { en: 'はい、{楽|たの}しかったです。／いいえ、{楽|たの}しくなかったです。', ro: 'Hai, tanoshikatta desu. / Iie, tanoshiku nakatta desu.', vi: 'Có, vui. / Không, không vui.' },
        { en: '～はどうでしたか。', ro: '~ wa dou deshita ka.', vi: '～ thế nào? (hỏi cảm tưởng — quá khứ của どうですか)' },
        { en: 'とてもきれいでした。／いい{天気|てんき}でした。', ro: 'Totemo kirei deshita. / Ii tenki deshita.', vi: 'Rất đẹp. / Trời đẹp. (な-adj, danh từ + でした)' },
        { en: 'どうして～ませんでしたか。— ～から。', ro: 'Doushite ~ masen deshita ka. — ~ kara.', vi: 'Tại sao đã không ～? — Vì ～. (ポイント 44, 47)' },
      ],
    },
    {
      t: 'note',
      title: 'Câu phản hồi hay dùng',
      items: [
        '**それはよかったですね** (sore wa yokatta desu ne) — "Vậy thì tốt quá nhỉ" (người kia kể chuyện vui).',
        '**それは{大変|たいへん}でしたね** (sore wa taihen deshita ne) — "Vậy thì vất vả quá nhỉ" (người kia kể chuyện mệt, xui).',
        '**～でしたが、～かったです** — "đã ～ nhưng ～": が của Bài 4 (ポイント 35) nối được cả hai vế quá khứ.',
      ],
    },

    /* ── 5-3 ── */
    { t: 'h', text: '5-3 今度の休みに — Kỳ nghỉ tới làm gì?' },
    {
      t: 'p',
      text: 'Trên tàu điện, trên đường đi học về. Park và Marco nhìn các tấm quảng cáo trên tàu và nói chuyện về kỳ nghỉ sắp tới.',
    },
    {
      t: 'dialogue',
      title: '⑧ Muốn có gì, nên đi đâu',
      lines: [
        { who: 'マルコ', role: 'b', text: 'パクさん、{今度|こんど}の{休|やす}みに{何|なに}をしますか。', ro: 'Paku-san, kondo no yasumi ni nani o shimasu ka.', vi: 'Park, kỳ nghỉ tới bạn làm gì?' },
        { who: 'パク', role: 'a', text: '{自転車|じてんしゃ}がほしいですから、{新宿|しんじゅく}のデパートへ{行|い}きます。', ro: 'Jitensha ga hoshii desu kara, Shinjuku no depaato e ikimasu.', vi: 'Vì tôi muốn có xe đạp nên tôi sẽ đi trung tâm thương mại ở Shinjuku.' },
        { who: 'マルコ', role: 'b', text: 'そうですか。{私|わたし}は{新|あたら}しいカメラがほしいですから、{秋葉原|あきはばら}へカメラを{買|か}いに{行|い}きます。', ro: 'Sou desu ka. Watashi wa atarashii kamera ga hoshii desu kara, Akihabara e kamera o kai ni ikimasu.', vi: 'Thế à. Tôi thì muốn có máy ảnh mới nên sẽ đi Akihabara để mua máy ảnh.' },
        { who: 'パク', role: 'a', text: 'いいですね。{私|わたし}も{秋葉原|あきはばら}へ{行|い}きたいです。', ro: 'Ii desu ne. Watashi mo Akihabara e ikitai desu.', vi: 'Hay đấy. Tôi cũng muốn đi Akihabara.' },
      ],
    },
    {
      t: 'dialogue',
      title: '⑨ Thích gì, muốn làm gì',
      lines: [
        { who: 'パク', role: 'a', text: 'マルコさんは{映画|えいが}が{好|す}きですか。', ro: 'Maruko-san wa eiga ga suki desu ka.', vi: 'Marco có thích phim không?' },
        { who: 'マルコ', role: 'b', text: 'はい、{好|す}きです。アニメも{好|す}きです。', ro: 'Hai, suki desu. Anime mo suki desu.', vi: 'Có, tôi thích. Tôi cũng thích phim hoạt hình.' },
        { who: 'パク', role: 'a', text: 'あのアニメを{見|み}ましたか。', ro: 'Ano anime o mimashita ka.', vi: '(chỉ tấm áp phích trên tàu) Bạn xem bộ hoạt hình kia chưa?' },
        { who: 'マルコ', role: 'b', text: 'いいえ、{見|み}ませんでした。{今晩|こんばん}、{見|み}たいです。', ro: 'Iie, mimasen deshita. Konban, mitai desu.', vi: 'Chưa (không xem). Tối nay tôi muốn xem.' },
        { who: 'パク', role: 'a', text: '{私|わたし}も{見|み}たいです。{私|わたし}はゲームは{嫌|きら}いですが、アニメは{好|す}きです。', ro: 'Watashi mo mitai desu. Watashi wa geemu wa kirai desu ga, anime wa suki desu.', vi: 'Tôi cũng muốn xem. Tôi ghét trò chơi điện tử, nhưng thích phim hoạt hình.' },
      ],
    },
    {
      t: 'dialogue',
      title: '⑩ Đi đâu để làm gì?',
      lines: [
        { who: 'パク', role: 'a', text: 'マルコさん、{今度|こんど}の{休|やす}みに、どこかへ{行|い}きますか。', ro: 'Maruko-san, kondo no yasumi ni, dokoka e ikimasu ka.', vi: 'Marco, kỳ nghỉ tới bạn có đi đâu không?' },
        { who: 'マルコ', role: 'b', text: 'はい、{箱根|はこね}へ{行|い}きます。{山|やま}へ{写真|しゃしん}を{撮|と}りに{行|い}きます。', ro: 'Hai, Hakone e ikimasu. Yama e shashin o tori ni ikimasu.', vi: 'Có, tôi đi Hakone. Tôi lên núi để chụp ảnh.' },
        { who: 'パク', role: 'a', text: 'へえ。{箱根|はこね}の{景色|けしき}はきれいですね。', ro: 'Hee. Hakone no keshiki wa kirei desu ne.', vi: 'Ồ. Phong cảnh Hakone đẹp nhỉ.' },
        { who: 'マルコ', role: 'b', text: 'はい。それから、{温泉|おんせん}に{入|はい}りたいです。', ro: 'Hai. Sorekara, onsen ni hairitai desu.', vi: 'Vâng. Sau đó tôi muốn tắm suối nước nóng.' },
        { who: 'パク', role: 'a', text: 'いいですね。{私|わたし}は{今晩|こんばん}、{友達|ともだち}と{渋谷|しぶや}へ{食事|しょくじ}に{行|い}きます。', ro: 'Ii desu ne. Watashi wa konban, tomodachi to Shibuya e shokuji ni ikimasu.', vi: 'Hay nhỉ. Tối nay tôi đi Shibuya ăn tối với bạn.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{今度|こんど}の{休|やす}みに{何|なに}をしますか。', ro: 'Kondo no yasumi ni nani o shimasu ka.', vi: 'Kỳ nghỉ tới bạn làm gì?' },
        { en: '～がほしいです。', ro: '~ ga hoshii desu.', vi: 'Tôi muốn có ～. (ポイント 40)' },
        { en: '～を～たいです。', ro: '~ o ~ tai desu.', vi: 'Tôi muốn (làm) ～. (ポイント 41)' },
        { en: '～が{好|す}きです。／{嫌|きら}いです。', ro: '~ ga suki desu. / kirai desu.', vi: 'Tôi thích / ghét ～. (ポイント 39)' },
        { en: '～へ～を～に{行|い}きます。', ro: '~ e ~ o ~ ni ikimasu.', vi: 'Đi đến (nơi) ～ để làm ～. (ポイント 42)' },
        { en: '～がほしいですから、～へ{行|い}きます。', ro: '~ ga hoshii desu kara, ~ e ikimasu.', vi: 'Vì muốn có ～ nên đi ～. (ポイント 47)' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý',
      items: [
        '**{今度|こんど}** ở bài này nghĩa là "lần **tới**, sắp tới" ({今度|こんど}の{休|やす}み = kỳ nghỉ sắp tới).',
        'Câu hỏi về tương lai **vẫn dùng ～ます** (thể hiện tại–tương lai, Bài 3): {今晩|こんばん}、{何|なに}をします**か**. Chỉ việc đã xong mới dùng ～ました.',
        '**たくさん** (takusan) = "nhiều" (đứng trước động từ: {写真|しゃしん}をたくさん{撮|と}りました). Sách dùng ở bài nghe; chỉ cần nghe hiểu.',
      ],
    },

    /* ── できる ── */
    { t: 'h', text: 'できる！— Giới thiệu nơi mình đã đi, việc mình đã làm' },
    {
      t: 'p',
      text: 'Sách yêu cầu: nói với bạn cùng lớp về **nơi đã đi, việc đã làm** (từ khi đến Nhật). Với bạn: kể về **một chuyến đi/một ngày nghỉ đáng nhớ** ở Việt Nam. Bước 1 nói theo cặp (A kể, B hỏi どこ／{誰|だれ}と／どうでしたか／それから？), bước 2 viết thành đoạn ngắn, bước 3 đọc đoạn của bạn khác.',
    },
    {
      t: 'dialogue',
      title: '⑪ Hỏi – kể theo cặp',
      lines: [
        { who: 'アンナ', role: 'a', text: 'パクさん、{去年|きょねん}の{夏休|なつやす}み、どこかへ{行|い}きましたか。', ro: 'Paku-san, kyonen no natsuyasumi, dokoka e ikimashita ka.', vi: 'Park, kỳ nghỉ hè năm ngoái bạn có đi đâu không?' },
        { who: 'パク', role: 'c', text: 'はい、ベトナムのダナンへ{行|い}きました。', ro: 'Hai, Betonamu no Danan e ikimashita.', vi: 'Có, tôi đi Đà Nẵng ở Việt Nam.' },
        { who: 'アンナ', role: 'a', text: '{誰|だれ}と{行|い}きましたか。', ro: 'Dare to ikimashita ka.', vi: 'Bạn đi với ai?' },
        { who: 'パク', role: 'c', text: '{家族|かぞく}と{行|い}きました。', ro: 'Kazoku to ikimashita.', vi: 'Tôi đi với gia đình.' },
        { who: 'アンナ', role: 'a', text: 'どうでしたか。', ro: 'Dou deshita ka.', vi: 'Thế nào?' },
        { who: 'パク', role: 'c', text: 'とても{楽|たの}しかったです。{海|うみ}がきれいでした。', ro: 'Totemo tanoshikatta desu. Umi ga kirei deshita.', vi: 'Rất vui. Biển đẹp lắm.' },
        { who: 'アンナ', role: 'a', text: 'へえ。それから？', ro: 'Hee. Sorekara?', vi: 'Ồ. Rồi sao nữa?' },
        { who: 'パク', role: 'c', text: 'ホイアンへ{行|い}きました。{古|ふる}い{町|まち}を{見|み}ました。また{行|い}きたいです。', ro: 'Hoian e ikimashita. Furui machi o mimashita. Mata ikitai desu.', vi: 'Tôi đến Hội An. Tôi ngắm phố cổ. Tôi muốn đi lần nữa.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{私|わたし}は{去年|きょねん}の{夏休|なつやす}み、{家族|かぞく}とダナンへ{行|い}きました。', ro: 'Watashi wa kyonen no natsuyasumi, kazoku to Danan e ikimashita.', vi: 'Kỳ nghỉ hè năm ngoái tôi đi Đà Nẵng với gia đình.' },
        { en: '{海|うみ}がとてもきれいでした。{海|うみ}の{近|ちか}くで{魚|さかな}の{料理|りょうり}を{食|た}べました。おいしかったです。', ro: 'Umi ga totemo kirei deshita. Umi no chikaku de sakana no ryouri o tabemashita. Oishikatta desu.', vi: 'Biển rất đẹp. Tôi ăn món cá ở gần biển. Ngon lắm.' },
        { en: 'それから、ホイアンで{写真|しゃしん}をたくさん{撮|と}りました。', ro: 'Sorekara, Hoian de shashin o takusan torimashita.', vi: 'Sau đó tôi chụp rất nhiều ảnh ở Hội An.' },
        { en: 'とても{楽|たの}しい{旅行|りょこう}でした。また{行|い}きたいです。', ro: 'Totemo tanoshii ryokou deshita. Mata ikitai desu.', vi: 'Đó là một chuyến du lịch rất vui. Tôi muốn đi lần nữa.' },
      ],
    },

    /* ── Đọc ── */
    { t: 'h', text: 'Đọc hiểu: 楽しい1日 (Một ngày vui) — bài viết mới' },
    {
      t: 'p',
      text: 'Sách có bài đọc "{楽|たの}しい{1日|いちにち}" kể một ngày nghỉ. Dưới đây là một bài **viết mới** cùng dạng (cùng khung: đã đi đâu → thấy thế nào vì sao → làm gì → sau đó → cảm tưởng chung → muốn làm lại). Đọc to, rồi trả lời 4 câu hỏi của sách: {何|なに}をしましたか／{誰|だれ}と{行|い}きましたか／どうでしたか／それから？',
    },
    {
      t: 'passage',
      title: '楽しい1日',
      paras: [
        { text: '{土曜日|どようび}、ルームメイトと{海|うみ}へ{行|い}きました。{天気|てんき}がよかったですから、とても{気持|きも}ちがよかったです。' },
        { text: '{海|うみ}の{近|ちか}くのレストランで{魚|さかな}の{料理|りょうり}を{食|た}べました。{少|すこ}し{高|たか}かったですが、とてもおいしかったです。' },
        { text: 'それから、{古|ふる}い{神社|じんじゃ}を{見|み}に{行|い}きました。{静|しず}かでした。{写真|しゃしん}をたくさん{撮|と}りました。' },
        { text: 'とても{楽|たの}しい{1日|いちにち}でした。また{行|い}きたいです。' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{土曜日|どようび}、ルームメイトと{海|うみ}へ{行|い}きました。{天気|てんき}がよかったですから、とても{気持|きも}ちがよかったです。', ro: 'Doyoubi, ruumumeito to umi e ikimashita. Tenki ga yokatta desu kara, totemo kimochi ga yokatta desu.', vi: 'Thứ Bảy tôi đi biển với bạn cùng phòng. Vì trời đẹp nên rất dễ chịu.' },
        { en: '{海|うみ}の{近|ちか}くのレストランで{魚|さかな}の{料理|りょうり}を{食|た}べました。{少|すこ}し{高|たか}かったですが、とてもおいしかったです。', ro: 'Umi no chikaku no resutoran de sakana no ryouri o tabemashita. Sukoshi takakatta desu ga, totemo oishikatta desu.', vi: 'Chúng tôi ăn món cá ở nhà hàng gần biển. Hơi đắt nhưng rất ngon.' },
        { en: 'それから、{古|ふる}い{神社|じんじゃ}を{見|み}に{行|い}きました。{静|しず}かでした。{写真|しゃしん}をたくさん{撮|と}りました。', ro: 'Sorekara, furui jinja o mi ni ikimashita. Shizuka deshita. Shashin o takusan torimashita.', vi: 'Sau đó chúng tôi đi xem một ngôi đền cổ. Yên tĩnh lắm. Tôi chụp rất nhiều ảnh.' },
        { en: 'とても{楽|たの}しい{1日|いちにち}でした。また{行|い}きたいです。', ro: 'Totemo tanoshii ichinichi deshita. Mata ikitai desu.', vi: 'Đó là một ngày rất vui. Tôi muốn đi lần nữa.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-ht-doc',
      title: 'Câu hỏi về bài đọc',
      items: [
        { q: '{誰|だれ}と{海|うみ}へ{行|い}きましたか。', options: ['{家族|かぞく}と', 'ルームメイトと', '{恋人|こいびと}と', '{一人|ひとり}で'], correct: 1, why: 'ルームメイト**と**{海|うみ}へ{行|い}きました。' },
        { q: 'どうして{気持|きも}ちがよかったですか。', options: ['{料理|りょうり}が{安|やす}かったですから', '{天気|てんき}がよかったですから', '{神社|じんじゃ}が{静|しず}かでしたから', '{友達|ともだち}が{多|おお}かったですから'], correct: 1, why: '**{天気|てんき}がよかったですから**、{気持|きも}ちがよかったです。' },
        { q: '{料理|りょうり}はどうでしたか。', options: ['{安|やす}かったです。おいしかったです。', '{少|すこ}し{高|たか}かったですが、おいしかったです。', 'おいしくなかったです。', '{高|たか}くなかったです。'], correct: 1, why: '{少|すこ}し{高|たか}かったですが、とてもおいしかったです。' },
        { q: '{神社|じんじゃ}で{何|なに}をしましたか。', options: ['{食事|しょくじ}しました', '{写真|しゃしん}を{撮|と}りました', '{買|か}い{物|もの}しました', '{温泉|おんせん}に{入|はい}りました'], correct: 1, why: '{写真|しゃしん}をたくさん{撮|と}りました。' },
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b5-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 61 mục của danh sách Bài 5',
  goal: 'Thuộc đủ 61 mục trong danh sách từ mới Bài 5 của cô, mỗi từ nói được trong một câu kể về ngày nghỉ (đã làm gì, thấy thế nào, muốn làm gì).',
  minutes: 45,
  blocks: [
    {
      t: 'p',
      text: 'Đủ **61 mục** theo đúng danh sách cô phát (sổ tra JPD123, Bài 5 mục 1–61 — gồm 59 từ và 2 câu mẫu), chia thành 6 nhóm để dễ nhớ. Câu ví dụ phần lớn ở **quá khứ** (～ました, ～かったです) vì đó là trọng tâm của bài, và chỉ dùng từ của Bài 1–5. Cách học: bấm 🔊 → đọc to 3 lần → che nghĩa và tự nói.',
    },
    {
      t: 'note',
      title: 'Nhắc lại cách đọc romaji',
      items: [
        'Trường âm viết theo kana: きょう → **kyou**, しゅうまつ → **shuumatsu**, ゲーム → **geemu**, ルームメイト → **ruumumeito**.',
        'Âm ngắt っ viết đôi phụ âm: あさって → **asatte**. Trợ từ は → **wa**, を → **o**, へ → **e**.',
        'Động từ ghi kèm **thể từ điển** và **nhóm** như danh sách của cô: {会|あ}います［{会|あ}う］1 = nhóm 1. Bài 5 chưa dùng thể từ điển — chỉ cần thuộc thể ます.',
      ],
    },

    { t: 'h', text: '1. Thời gian: hôm qua, tuần trước, năm tới… (mục 1–7, 26–28, 48–51)' },
    {
      t: 'vocab',
      items: [
        { w: '{今日|きょう}', pos: 'danh từ (thời gian)', ipa: 'kyou', vi: 'Hôm nay', ex: '{今日|きょう}は{忙|いそが}しいです。', exRo: 'Kyou wa isogashii desu.', exVi: 'Hôm nay tôi bận.' },
        { w: '{明日|あした}', pos: 'danh từ (thời gian)', ipa: 'ashita', vi: 'Ngày mai', ex: '{明日|あした}、{友達|ともだち}に{会|あ}います。', exRo: 'Ashita, tomodachi ni aimasu.', exVi: 'Ngày mai tôi gặp bạn.' },
        { w: 'あさって', pos: 'danh từ (thời gian)', ipa: 'asatte', vi: 'Ngày kia', ex: 'あさって、デパートへ{行|い}きます。', exRo: 'Asatte, depaato e ikimasu.', exVi: 'Ngày kia tôi đi trung tâm thương mại.' },
        { w: '{昨日|きのう}', pos: 'danh từ (thời gian)', ipa: 'kinou', vi: 'Hôm qua', ex: '{昨日|きのう}、{何|なに}をしましたか。', exRo: 'Kinou, nani o shimashita ka.', exVi: 'Hôm qua bạn đã làm gì?' },
        { w: 'おととい', pos: 'danh từ (thời gian)', ipa: 'ototoi', vi: 'Hôm kia', ex: 'おととい、{部屋|へや}を{掃除|そうじ}しました。', exRo: 'Ototoi, heya o souji shimashita.', exVi: 'Hôm kia tôi đã dọn phòng.' },
        { w: '{先週|せんしゅう}', pos: 'danh từ (thời gian)', ipa: 'senshuu', vi: 'Tuần trước', ex: '{先週|せんしゅう}の{土曜日|どようび}、{美術館|びじゅつかん}へ{行|い}きました。', exRo: 'Senshuu no doyoubi, bijutsukan e ikimashita.', exVi: 'Thứ Bảy tuần trước tôi đã đi bảo tàng mỹ thuật.' },
        { w: '{週末|しゅうまつ}', pos: 'danh từ (thời gian)', ipa: 'shuumatsu', vi: 'Cuối tuần', ex: '{週末|しゅうまつ}、どこかへ{行|い}きましたか。', exRo: 'Shuumatsu, dokoka e ikimashita ka.', exVi: 'Cuối tuần bạn có đi đâu không?' },
        { w: '{今朝|けさ}', pos: 'danh từ (thời gian)', ipa: 'kesa', vi: 'Sáng nay', ex: '{今朝|けさ}、{何|なに}も{食|た}べませんでした。', exRo: 'Kesa, nani mo tabemasen deshita.', exVi: 'Sáng nay tôi không ăn gì cả.' },
        { w: '{先月|せんげつ}', pos: 'danh từ (thời gian)', ipa: 'sengetsu', vi: 'Tháng trước', ex: '{先月|せんげつ}、{新|あたら}しい{服|ふく}を{買|か}いました。', exRo: 'Sengetsu, atarashii fuku o kaimashita.', exVi: 'Tháng trước tôi đã mua quần áo mới.' },
        { w: '{去年|きょねん}', pos: 'danh từ (thời gian)', ipa: 'kyonen', vi: 'Năm ngoái', ex: '{去年|きょねん}、{家族|かぞく}と{旅行|りょこう}しました。', exRo: 'Kyonen, kazoku to ryokou shimashita.', exVi: 'Năm ngoái tôi đi du lịch với gia đình.' },
        { w: '{今度|こんど}', pos: 'danh từ (thời gian)', ipa: 'kondo', vi: 'Lần này, lần tới (sắp tới)', ex: '{今度|こんど}の{休|やす}みに{何|なに}をしますか。', exRo: 'Kondo no yasumi ni nani o shimasu ka.', exVi: 'Kỳ nghỉ tới bạn làm gì?' },
        { w: '{今晩|こんばん}', pos: 'danh từ (thời gian)', ipa: 'konban', vi: 'Tối nay', ex: '{今晩|こんばん}、アニメを{見|み}たいです。', exRo: 'Konban, anime o mitai desu.', exVi: 'Tối nay tôi muốn xem phim hoạt hình.' },
        { w: '{今年|ことし}', pos: 'danh từ (thời gian)', ipa: 'kotoshi', vi: 'Năm nay', ex: '{今年|ことし}の{夏休|なつやす}み、{山|やま}に{登|のぼ}りたいです。', exRo: 'Kotoshi no natsuyasumi, yama ni noboritai desu.', exVi: 'Kỳ nghỉ hè năm nay tôi muốn leo núi.' },
        { w: '{来年|らいねん}', pos: 'danh từ (thời gian)', ipa: 'rainen', vi: 'Sang năm, năm sau', ex: '{来年|らいねん}、{日本|にほん}へ{行|い}きたいです。', exRo: 'Rainen, Nihon e ikitai desu.', exVi: 'Sang năm tôi muốn đi Nhật.' },
      ],
    },
    {
      t: 'note',
      title: 'Từ chỉ thời gian KHÔNG có に',
      items: [
        '{今日|きょう}・{明日|あした}・{昨日|きのう}・{週末|しゅうまつ}・{先週|せんしゅう}・{去年|きょねん}・{今晩|こんばん}… **không** thêm に: ~~{昨日|きのう}に~~ → **{昨日|きのう}**、{映画|えいが}を{見|み}ました.',
        'Thứ trong tuần thêm に **cũng được, bỏ cũng được**: {日曜日|にちようび}（に）. Giờ, ngày tháng **phải** có に: {9時|くじ}**に**{起|お}きました (Bài 3, ポイント 19).',
        '{今度|こんど}の{休|やす}み**に** — có に vì 休み là một "dịp" cụ thể (sách viết như vậy).',
      ],
    },

    { t: 'h', text: '2. Nơi chốn & người đi cùng (mục 8–11, 13–17, 25)' },
    {
      t: 'vocab',
      items: [
        { w: '{家|いえ}', pos: 'danh từ', ipa: 'ie', vi: 'Nhà (ngôi nhà)', ex: '{友達|ともだち}の{家|いえ}へ{行|い}きました。', exRo: 'Tomodachi no ie e ikimashita.', exVi: 'Tôi đã đến nhà bạn.' },
        { w: '{部屋|へや}', pos: 'danh từ', ipa: 'heya', vi: 'Căn phòng', ex: '{日曜日|にちようび}、{部屋|へや}を{掃除|そうじ}しました。', exRo: 'Nichiyoubi, heya o souji shimashita.', exVi: 'Chủ Nhật tôi đã dọn phòng.' },
        { w: 'デパート', pos: 'danh từ', ipa: 'depaato', vi: 'Trung tâm thương mại, cửa hàng bách hoá', ex: 'デパートで{服|ふく}を{買|か}いました。', exRo: 'Depaato de fuku o kaimashita.', exVi: 'Tôi đã mua quần áo ở trung tâm thương mại.' },
        { w: '{美術館|びじゅつかん}', pos: 'danh từ', ipa: 'bijutsukan', vi: 'Bảo tàng mỹ thuật', ex: '{美術館|びじゅつかん}で{絵|え}を{見|み}ました。', exRo: 'Bijutsukan de e o mimashita.', exVi: 'Tôi đã xem tranh ở bảo tàng mỹ thuật.' },
        { w: '{家族|かぞく}', pos: 'danh từ', ipa: 'kazoku', vi: 'Gia đình', ex: '{週末|しゅうまつ}、{家族|かぞく}と{食事|しょくじ}しました。', exRo: 'Shuumatsu, kazoku to shokuji shimashita.', exVi: 'Cuối tuần tôi đi ăn với gia đình.' },
        { w: '{恋人|こいびと}', pos: 'danh từ', ipa: 'koibito', vi: 'Người yêu', ex: '{恋人|こいびと}と{映画|えいが}を{見|み}ました。', exRo: 'Koibito to eiga o mimashita.', exVi: 'Tôi đã xem phim với người yêu.' },
        { w: '{友達|ともだち}', pos: 'danh từ', ipa: 'tomodachi', vi: 'Bạn bè', ex: '{昨日|きのう}、{友達|ともだち}とサッカーをしました。', exRo: 'Kinou, tomodachi to sakkaa o shimashita.', exVi: 'Hôm qua tôi đá bóng với bạn.' },
        { w: 'ルームメイト', pos: 'danh từ', ipa: 'ruumumeito', vi: 'Bạn cùng phòng', ex: 'ルームメイトと{晩|ばん}ご{飯|はん}を{作|つく}りました。', exRo: 'Ruumumeito to bangohan o tsukurimashita.', exVi: 'Tôi đã nấu cơm tối với bạn cùng phòng.' },
        { w: 'どこか（へ）', pos: 'từ chỉ nơi (không xác định)', ipa: 'dokoka (e)', vi: 'Nơi nào đó, đâu đó', ex: '{昨日|きのう}、どこかへ{行|い}きましたか。', exRo: 'Kinou, dokoka e ikimashita ka.', exVi: 'Hôm qua bạn có đi đâu không?' },
        { w: '{一人|ひとり}で', pos: 'cụm từ', ipa: 'hitori de', vi: 'Một mình', ex: '{一人|ひとり}で{美術館|びじゅつかん}へ{行|い}きました。', exRo: 'Hitori de bijutsukan e ikimashita.', exVi: 'Tôi đi bảo tàng mỹ thuật một mình.' },
      ],
    },

    { t: 'h', text: '3. Việc làm ngày nghỉ — động từ (mục 18–23, 33–35, 57–58)' },
    {
      t: 'vocab',
      items: [
        { w: '{会|あ}います［{会|あ}う］1', pos: 'động từ nhóm 1', ipa: 'aimasu [au]', vi: 'Gặp, gặp gỡ (N **に** {会|あ}います)', ex: '{日曜日|にちようび}、{渋谷|しぶや}で{友達|ともだち}に{会|あ}いました。', exRo: 'Nichiyoubi, Shibuya de tomodachi ni aimashita.', exVi: 'Chủ Nhật tôi gặp bạn ở Shibuya.' },
        { w: '{作|つく}ります［{作|つく}る］1', pos: 'động từ nhóm 1', ipa: 'tsukurimasu [tsukuru]', vi: 'Làm, chế tạo; nấu (món ăn)', ex: 'うちで{晩|ばん}ご{飯|はん}を{作|つく}りました。', exRo: 'Uchi de bangohan o tsukurimashita.', exVi: 'Tôi đã nấu cơm tối ở nhà.' },
        { w: '{買|か}い{物|もの}します［{買|か}い{物|もの}する］3', pos: 'động từ nhóm 3', ipa: 'kaimono shimasu [kaimono suru]', vi: 'Mua sắm (cũng nói {買|か}い{物|もの}をします)', ex: '{新宿|しんじゅく}で{買|か}い{物|もの}しました。', exRo: 'Shinjuku de kaimono shimashita.', exVi: 'Tôi đã mua sắm ở Shinjuku.' },
        { w: '{食事|しょくじ}します［{食事|しょくじ}する］3', pos: 'động từ nhóm 3', ipa: 'shokuji shimasu [shokuji suru]', vi: 'Dùng bữa, ăn uống (đi ăn)', ex: '{恋人|こいびと}とレストランで{食事|しょくじ}しました。', exRo: 'Koibito to resutoran de shokuji shimashita.', exVi: 'Tôi đi ăn ở nhà hàng với người yêu.' },
        { w: '{洗濯|せんたく}します［{洗濯|せんたく}する］3', pos: 'động từ nhóm 3', ipa: 'sentaku shimasu [sentaku suru]', vi: 'Giặt giũ', ex: '{土曜日|どようび}の{朝|あさ}、{洗濯|せんたく}しました。', exRo: 'Doyoubi no asa, sentaku shimashita.', exVi: 'Sáng thứ Bảy tôi đã giặt đồ.' },
        { w: '{掃除|そうじ}します［{掃除|そうじ}する］3', pos: 'động từ nhóm 3', ipa: 'souji shimasu [souji suru]', vi: 'Dọn dẹp, lau dọn, hút bụi nhà cửa', ex: '{昨日|きのう}、{部屋|へや}を{掃除|そうじ}しませんでした。', exRo: 'Kinou, heya o souji shimasen deshita.', exVi: 'Hôm qua tôi không dọn phòng.' },
        { w: '{登|のぼ}ります［{登|のぼ}る］1', pos: 'động từ nhóm 1', ipa: 'noborimasu [noboru]', vi: 'Leo, trèo (N **に** {登|のぼ}ります)', ex: '{友達|ともだち}と{山|やま}に{登|のぼ}りました。', exRo: 'Tomodachi to yama ni noborimashita.', exVi: 'Tôi đã leo núi với bạn.' },
        { w: '{入|はい}ります［{入|はい}る］1', pos: 'động từ nhóm 1', ipa: 'hairimasu [hairu]', vi: 'Vào, bước vào (N **に** {入|はい}ります)', ex: '{部屋|へや}に{入|はい}りました。', exRo: 'Heya ni hairimashita.', exVi: 'Tôi đã vào phòng.' },
        { w: '{温泉|おんせん}に{入|はい}ります。', pos: 'câu mẫu', ipa: 'Onsen ni hairimasu.', vi: 'Tắm suối nước nóng (nghĩa đen: vào suối nước nóng)', ex: '{箱根|はこね}で{温泉|おんせん}に{入|はい}りました。{気持|きも}ちがよかったです。', exRo: 'Hakone de onsen ni hairimashita. Kimochi ga yokatta desu.', exVi: 'Tôi đã tắm suối nước nóng ở Hakone. Sảng khoái lắm.' },
        { w: '{撮|と}ります［{撮|と}る］1', pos: 'động từ nhóm 1', ipa: 'torimasu [toru]', vi: 'Chụp (ảnh), quay (video)', ex: '{山|やま}で{写真|しゃしん}を{撮|と}りました。', exRo: 'Yama de shashin o torimashita.', exVi: 'Tôi đã chụp ảnh trên núi.' },
        { w: '{借|か}ります［{借|か}りる］2', pos: 'động từ nhóm 2', ipa: 'karimasu [kariru]', vi: 'Vay, mượn', ex: '{図書館|としょかん}で{本|ほん}を{借|か}りました。', exRo: 'Toshokan de hon o karimashita.', exVi: 'Tôi đã mượn sách ở thư viện.' },
      ],
    },
    {
      t: 'note',
      title: 'Ba động từ đi với に (không phải を) — rất hay sai',
      items: [
        '{友達|ともだち}**に**{会|あ}います (gặp bạn) · {山|やま}**に**{登|のぼ}ります (leo núi) · {温泉|おんせん}**に**{入|はい}ります (vào/tắm suối nước nóng).',
        'Nói ~~{友達|ともだち}を{会|あ}います~~, ~~{温泉|おんせん}を{入|はい}ります~~ là sai trợ từ — bị trừ 2 điểm khi thi.',
        'Động từ nhóm 3 dạng **Nします** (買い物します, 食事します, 洗濯します, 掃除します) cũng nói được **Nを**します: {買|か}い{物|もの}**を**しました, {掃除|そうじ}**を**しました. Nhưng đã có đồ vật thì dùng を cho đồ vật: {部屋|へや}**を**{掃除|そうじ}しました.',
      ],
    },

    { t: 'h', text: '4. Đồ vật, sự vật (mục 12, 29–32, 52–56)' },
    {
      t: 'vocab',
      items: [
        { w: 'ゲーム', pos: 'danh từ', ipa: 'geemu', vi: 'Trò chơi, game', ex: '{友達|ともだち}の{家|いえ}でゲームをしました。', exRo: 'Tomodachi no ie de geemu o shimashita.', exVi: 'Tôi chơi game ở nhà bạn.' },
        { w: '{風邪|かぜ}', pos: 'danh từ', ipa: 'kaze', vi: 'Cảm cúm, cảm lạnh', ex: '{風邪|かぜ}でしたから、どこへも{行|い}きませんでした。', exRo: 'Kaze deshita kara, doko e mo ikimasen deshita.', exVi: 'Vì bị cảm nên tôi không đi đâu cả.' },
        { w: '{天気|てんき}', pos: 'danh từ', ipa: 'tenki', vi: 'Thời tiết', ex: '{昨日|きのう}は{天気|てんき}がよかったです。', exRo: 'Kinou wa tenki ga yokatta desu.', exVi: 'Hôm qua thời tiết đẹp.' },
        { w: '{晩|ばん}ご{飯|はん}', pos: 'danh từ', ipa: 'bangohan', vi: 'Cơm tối, bữa tối', ex: '{晩|ばん}ご{飯|はん}に{何|なに}を{食|た}べましたか。', exRo: 'Bangohan ni nani o tabemashita ka.', exVi: 'Bữa tối bạn đã ăn gì?' },
        { w: '{服|ふく}', pos: 'danh từ', ipa: 'fuku', vi: 'Quần áo', ex: 'この{服|ふく}は{安|やす}かったです。', exRo: 'Kono fuku wa yasukatta desu.', exVi: 'Bộ quần áo này rẻ lắm.' },
        { w: 'アニメ', pos: 'danh từ', ipa: 'anime', vi: 'Phim hoạt hình (anime)', ex: '{私|わたし}は{日本|にほん}のアニメが{好|す}きです。', exRo: 'Watashi wa Nihon no anime ga suki desu.', exVi: 'Tôi thích phim hoạt hình Nhật.' },
        { w: '{絵|え}', pos: 'danh từ', ipa: 'e', vi: 'Tranh, bức tranh', ex: '{美術館|びじゅつかん}の{絵|え}はとてもきれいでした。', exRo: 'Bijutsukan no e wa totemo kirei deshita.', exVi: 'Tranh ở bảo tàng mỹ thuật rất đẹp.' },
        { w: '{景色|けしき}', pos: 'danh từ', ipa: 'keshiki', vi: 'Phong cảnh, cảnh vật', ex: '{山|やま}の{景色|けしき}はきれいでした。', exRo: 'Yama no keshiki wa kirei deshita.', exVi: 'Phong cảnh trên núi đẹp lắm.' },
        { w: '{自転車|じてんしゃ}', pos: 'danh từ', ipa: 'jitensha', vi: 'Xe đạp', ex: '{新|あたら}しい{自転車|じてんしゃ}がほしいです。', exRo: 'Atarashii jitensha ga hoshii desu.', exVi: 'Tôi muốn có xe đạp mới.' },
        { w: '{写真|しゃしん}', pos: 'danh từ', ipa: 'shashin', vi: 'Ảnh, bức ảnh', ex: '{海|うみ}の{写真|しゃしん}を{撮|と}りたいです。', exRo: 'Umi no shashin o toritai desu.', exVi: 'Tôi muốn chụp ảnh biển.' },
      ],
    },

    { t: 'h', text: '5. Tính từ nói cảm tưởng (mục 36–46)' },
    {
      t: 'vocab',
      items: [
        { w: '{忙|いそが}しい', pos: 'tính từ đuôi い', ipa: 'isogashii', vi: 'Bận rộn', ex: '{先週|せんしゅう}はとても{忙|いそが}しかったです。', exRo: 'Senshuu wa totemo isogashikatta desu.', exVi: 'Tuần trước tôi rất bận.' },
        { w: 'おもしろい', pos: 'tính từ đuôi い', ipa: 'omoshiroi', vi: 'Thú vị, hay, hấp dẫn', ex: 'その{映画|えいが}はおもしろかったです。', exRo: 'Sono eiga wa omoshirokatta desu.', exVi: 'Bộ phim đó hay lắm.' },
        { w: '{気持|きも}ちがいい', pos: 'cụm tính từ (đuôi い)', ipa: 'kimochi ga ii', vi: 'Cảm thấy dễ chịu, sảng khoái', ex: '{温泉|おんせん}は{気持|きも}ちがよかったです。', exRo: 'Onsen wa kimochi ga yokatta desu.', exVi: 'Suối nước nóng dễ chịu lắm.' },
        { w: '{高|たか}い', pos: 'tính từ đuôi い', ipa: 'takai', vi: 'Cao, đắt (đã gặp ở Bài 4)', ex: 'このカメラは{高|たか}いです。', exRo: 'Kono kamera wa takai desu.', exVi: 'Cái máy ảnh này đắt.' },
        { w: 'パソコンは{高|たか}かったです。', pos: 'câu mẫu', ipa: 'Pasokon wa takakatta desu.', vi: 'Máy tính (đã) đắt. — quá khứ của {高|たか}い', ex: 'パソコンは{高|たか}かったですから、{買|か}いませんでした。', exRo: 'Pasokon wa takakatta desu kara, kaimasen deshita.', exVi: 'Vì máy tính đắt nên tôi đã không mua.' },
        { w: '{安|やす}い', pos: 'tính từ đuôi い', ipa: 'yasui', vi: 'Rẻ', ex: '{渋谷|しぶや}の{服|ふく}は{安|やす}かったです。', exRo: 'Shibuya no fuku wa yasukatta desu.', exVi: 'Quần áo ở Shibuya rẻ.' },
        { w: '{楽|たの}しい', pos: 'tính từ đuôi い', ipa: 'tanoshii', vi: 'Vui vẻ, vui', ex: '{旅行|りょこう}は{楽|たの}しかったです。', exRo: 'Ryokou wa tanoshikatta desu.', exVi: 'Chuyến du lịch vui lắm.' },
        { w: '{難|むずか}しい', pos: 'tính từ đuôi い', ipa: 'muzukashii', vi: 'Khó', ex: '{昨日|きのう}のテストは{難|むずか}しかったです。', exRo: 'Kinou no tesuto wa muzukashikatta desu.', exVi: 'Bài kiểm tra hôm qua khó.' },
        { w: '{簡単|かんたん}（な）', pos: 'tính từ đuôi な', ipa: 'kantan (na)', vi: 'Dễ, đơn giản', ex: 'テストは{簡単|かんたん}じゃありませんでした。', exRo: 'Tesuto wa kantan ja arimasen deshita.', exVi: 'Bài kiểm tra không dễ.' },
        { w: '{大変|たいへん}（な）', pos: 'tính từ đuôi な', ipa: 'taihen (na)', vi: 'Vất vả, khổ sở, gay go', ex: 'アルバイトは{大変|たいへん}でした。', exRo: 'Arubaito wa taihen deshita.', exVi: 'Việc làm thêm vất vả lắm.' },
        { w: '{暇|ひま}（な）', pos: 'tính từ đuôi な', ipa: 'hima (na)', vi: 'Rảnh rỗi', ex: '{日曜日|にちようび}は{暇|ひま}でした。', exRo: 'Nichiyoubi wa hima deshita.', exVi: 'Chủ Nhật tôi rảnh.' },
      ],
    },

    { t: 'h', text: '6. Thích, muốn, từ nối, từ để hỏi (mục 24, 47, 59–61)' },
    {
      t: 'vocab',
      items: [
        { w: 'ほしい', pos: 'tính từ đuôi い', ipa: 'hoshii', vi: 'Muốn có (N **が** ほしいです)', ex: '{私|わたし}はカメラがほしいです。', exRo: 'Watashi wa kamera ga hoshii desu.', exVi: 'Tôi muốn có máy ảnh.' },
        { w: '{好|す}き（な）', pos: 'tính từ đuôi な', ipa: 'suki (na)', vi: 'Thích (N **が** {好|す}きです)', ex: 'マルコさんは{温泉|おんせん}が{好|す}きです。', exRo: 'Maruko-san wa onsen ga suki desu.', exVi: 'Marco thích suối nước nóng.' },
        { w: '{嫌|きら}い（な）', pos: 'tính từ đuôi な', ipa: 'kirai (na)', vi: 'Ghét, không thích (N **が** {嫌|きら}いです)', ex: '{私|わたし}は{掃除|そうじ}が{嫌|きら}いです。', exRo: 'Watashi wa souji ga kirai desu.', exVi: 'Tôi ghét dọn dẹp.' },
        { w: 'それから', pos: 'từ nối', ipa: 'sorekara', vi: 'Sau đó, rồi thì (nối hai việc theo thứ tự)', ex: '{映画|えいが}を{見|み}ました。それから、{食事|しょくじ}しました。', exRo: 'Eiga o mimashita. Sorekara, shokuji shimashita.', exVi: 'Tôi xem phim. Sau đó đi ăn.' },
        { w: 'どうして', pos: 'từ để hỏi', ipa: 'doushite', vi: 'Tại sao, vì sao', ex: 'どうして{行|い}きませんでしたか。', exRo: 'Doushite ikimasen deshita ka.', exVi: 'Tại sao bạn đã không đi?' },
      ],
    },

    { t: 'h', text: 'Từ thêm (sách có, danh sách của cô không có — chỉ cần nghe hiểu)' },
    {
      t: 'table',
      head: ['Từ / câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['{今週|こんしゅう}・{来週|らいしゅう}・{今月|こんげつ}・{来月|らいげつ}・おととし', 'konshuu · raishuu · kongetsu · raigetsu · ototoshi', 'Tuần này · tuần sau · tháng này · tháng sau · năm kia (bảng 表 p.288 — xem phần Ngữ pháp)'],
        ['{寮|りょう}', 'ryou', 'Ký túc xá'],
        ['いろいろ（な）', 'iroiro (na)', 'Nhiều loại, đủ thứ: いろいろな{国|くに}の{料理|りょうり}'],
        ['また', 'mata', 'Lại, lần nữa: また{行|い}きたいです'],
        ['それはよかったですね', 'sore wa yokatta desu ne', 'Vậy thì tốt quá nhỉ'],
        ['それは{大変|たいへん}でしたね', 'sore wa taihen deshita ne', 'Vậy thì vất vả quá nhỉ'],
        ['{近|ちか}く', 'chikaku', 'Gần, chỗ gần: {近|ちか}くの{山|やま} (núi gần đây)'],
        ['{1日|いちにち}', 'ichinichi', 'Một ngày (cả ngày): {楽|たの}しい{1日|いちにち}'],
        ['たくさん', 'takusan', 'Nhiều: {写真|しゃしん}をたくさん{撮|と}りました'],
        ['{夏休|なつやす}み・{春休|はるやす}み', 'natsuyasumi · haruyasumi', 'Nghỉ hè · nghỉ xuân (夏/春 + 休み, Bài 3)'],
        ['{新宿|しんじゅく}・{渋谷|しぶや}・{箱根|はこね}・{横浜|よこはま}・{名古屋|なごや}・{秋葉原|あきはばら}', 'Shinjuku · Shibuya · Hakone · Yokohama · Nagoya · Akihabara', 'Địa danh trong sách (Tokyo và vùng lân cận)'],
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b5-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp — ポイント 37–47: quá khứ, thích/muốn, đi để làm gì, vì sao',
  goal: 'Chia đúng quá khứ khẳng định/phủ định của động từ, tính từ い/な và danh từ; nói được thích gì, muốn có gì, muốn làm gì, đi đâu để làm gì, với ai, vì sao.',
  minutes: 75,
  blocks: [
    {
      t: 'p',
      text: 'Bài 5 có **11 điểm ngữ pháp** (ポイント 37–47). Nhóm lớn nhất là **thì quá khứ** — của động từ (37) và của tính từ, danh từ (38). Tin vui: quá khứ tiếng Nhật **không chia theo người**, không có bất quy tắc kiểu tiếng Anh; chỉ có đúng **4 khuôn** trong bảng dưới. Học thuộc bảng này là nói được một nửa bài.',
    },
    {
      t: 'table',
      caption: 'Bản đồ Bài 5',
      head: ['ポイント', 'Mẫu', 'Nghĩa', 'Dùng ở'],
      rows: [
        ['37', 'Vました／Vませんでした', 'đã làm / đã không làm', '5-1'],
        ['38', 'イA‑かったです／くなかったです · ナA・N でした／じゃありませんでした', 'quá khứ của tính từ, danh từ', '5-2'],
        ['39', 'N が {好|す}きです／{嫌|きら}いです', 'thích / ghét N', '5-3'],
        ['40', 'N が ほしいです', 'muốn có N', '5-3'],
        ['41', 'V(ます)たいです', 'muốn làm V', '5-3'],
        ['42', 'N1(nơi) へ ［V(ます)／N2］ に {行|い}きます', 'đi đến N1 để làm V / N2', '5-3'],
        ['43', 'どこか（へ）{行|い}きますか', 'có đi đâu (đó) không?', '5-1'],
        ['44', 'どうして', 'tại sao', '5-2'],
        ['45', 'それから', 'sau đó', '5-1'],
        ['46', 'N(người) と V', 'làm V cùng với N', '5-1'],
        ['47', '___から、___', 'vì ___ nên ___', '5-2'],
      ],
    },

    /* ── Nền: từ chỉ thời gian ── */
    { t: 'h', text: 'Nền — Từ chỉ thời gian: ngày, tuần, tháng, năm (表 p.288)' },
    {
      t: 'p',
      text: 'Câu quá khứ gần như luôn mở đầu bằng một từ chỉ thời gian: **{昨日|きのう}**、**{先週|せんしゅう}の{土曜日|どようび}**、**{去年|きょねん}**… Bảng dưới xếp theo trục thời gian: cột giữa là "bây giờ". Ô tô đậm có trong danh sách từ của Bài 5; các ô còn lại có trong bảng 表 cuối sách — nên biết để nghe hiểu.',
    },
    {
      t: 'table',
      head: ['', 'trước nữa', 'trước', 'BÂY GIỜ', 'sau', 'sau nữa'],
      rows: [
        ['Ngày {日|ひ}', '**おととい** (ototoi) hôm kia', '**{昨日|きのう}** (kinou) hôm qua', '**{今日|きょう}** (kyou) hôm nay', '**{明日|あした}** (ashita) ngày mai', '**あさって** (asatte) ngày kia'],
        ['Tuần {週|しゅう}', '{先々週|せんせんしゅう} (sensenshuu)', '**{先週|せんしゅう}** (senshuu) tuần trước', '{今週|こんしゅう} (konshuu) tuần này', '{来週|らいしゅう} (raishuu) tuần sau', '{再来週|さらいしゅう} (saraishuu)'],
        ['Tháng {月|げつ}', '{先々月|せんせんげつ} (sensengetsu)', '**{先月|せんげつ}** (sengetsu) tháng trước', '{今月|こんげつ} (kongetsu) tháng này', '{来月|らいげつ} (raigetsu) tháng sau', '{再来月|さらいげつ} (saraigetsu)'],
        ['Năm {年|ねん}', 'おととし (ototoshi) năm kia', '**{去年|きょねん}** (kyonen) năm ngoái', '**{今年|ことし}** (kotoshi) năm nay', '**{来年|らいねん}** (rainen) năm sau', '{再来年|さらいねん} (sarainen)'],
      ],
    },
    {
      t: 'table',
      caption: 'Buổi trong ngày',
      head: ['Từ', 'Romaji', 'Nghĩa', 'Ghép với'],
      rows: [
        ['**{今朝|けさ}**', 'kesa', 'sáng nay', 'quá khứ: {今朝|けさ}、パンを{食|た}べました'],
        ['**{今晩|こんばん}**', 'konban', 'tối nay', 'tương lai: {今晩|こんばん}、{映画|えいが}を{見|み}ます'],
        ['**{週末|しゅうまつ}**', 'shuumatsu', 'cuối tuần', 'cả hai: {週末|しゅうまつ}、{何|なに}をしましたか／しますか'],
        ['**{今度|こんど}**の{休|やす}み', 'kondo no yasumi', 'kỳ nghỉ sắp tới', 'tương lai: {今度|こんど}の{休|やす}みに{旅行|りょこう}します'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — thêm に sai chỗ',
      items: [
        '~~{昨日|きのう}に~~、~~{来年|らいねん}に~~、~~{今晩|こんばん}に~~ → bỏ に. Từ thời gian **tính theo "bây giờ"** (hôm qua, năm sau…) không có に.',
        'Mốc thời gian **cố định** (giờ, ngày tháng) phải có に: {7時|しちじ}**に**, {5月|ごがつ}{3日|みっか}**に**. Thứ trong tuần: {日曜日|にちようび}（**に**）— tuỳ.',
        'Nghe {昨日|きのう}／{先週|せんしゅう}／{去年|きょねん} trong câu hỏi → **chắc chắn** trả lời bằng quá khứ (～ました／～かったです／～でした).',
      ],
    },

    /* ── Bảng tổng ── */
    { t: 'h', text: 'Bảng tổng: hiện tại ↔ quá khứ của cả 4 loại từ (表 p.282–283)' },
    {
      t: 'table',
      caption: 'Học thuộc bảng này — đây là xương sống của Bài 5',
      head: ['Loại', 'Hiện tại (+)', 'Hiện tại (−)', 'Quá khứ (+)', 'Quá khứ (−)'],
      rows: [
        ['Động từ V', '{行|い}きます', '{行|い}きません', '{行|い}き**ました**', '{行|い}き**ませんでした**'],
        ['Tính từ い', '{楽|たの}しいです', '{楽|たの}しくないです', '{楽|たの}し**かったです**', '{楽|たの}し**くなかったです**'],
        ['いい (đặc biệt)', 'いいです', 'よくないです', '**よかったです**', '**よくなかったです**'],
        ['Tính từ な', '{暇|ひま}です', '{暇|ひま}じゃありません', '{暇|ひま}**でした**', '{暇|ひま}**じゃありませんでした**'],
        ['Danh từ N', '{雨|あめ}です', '{雨|あめ}じゃありません', '{雨|あめ}**でした**', '{雨|あめ}**じゃありませんでした**'],
      ],
    },
    {
      t: 'table',
      caption: 'Cùng bảng — viết bằng romaji để đọc to',
      head: ['Loại', 'Hiện tại (+)', 'Hiện tại (−)', 'Quá khứ (+)', 'Quá khứ (−)'],
      rows: [
        ['V', 'ikimasu', 'ikimasen', 'ikimashita', 'ikimasen deshita'],
        ['イA', 'tanoshii desu', 'tanoshiku nai desu', 'tanoshikatta desu', 'tanoshiku nakatta desu'],
        ['いい', 'ii desu', 'yoku nai desu', 'yokatta desu', 'yoku nakatta desu'],
        ['ナA', 'hima desu', 'hima ja arimasen', 'hima deshita', 'hima ja arimasen deshita'],
        ['N', 'ame desu', 'ame ja arimasen', 'ame deshita', 'ame ja arimasen deshita'],
      ],
    },
    {
      t: 'note',
      title: 'Hai quy tắc nhớ nhanh',
      items: [
        '**Động từ, tính từ な, danh từ**: phủ định quá khứ = phủ định hiện tại + **でした** (ません**でした**, じゃありません**でした**).',
        '**Tính từ い** tự chia: bỏ い → **かった**; phủ định くない → **くなかった**; rồi thêm です. **KHÔNG** bao giờ có ~~い**でした**~~.',
        'じゃありません／じゃありませんでした nói trang trọng hơn là では ありません／ではありませんでした — cả hai đều đúng khi thi.',
      ],
    },

    /* ── ポイント 37 ── */
    { t: 'h', text: 'ポイント 37 — Vました／Vませんでした (đã làm / đã không làm)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'V ます → V ました',
          vi: 'Đã làm V (việc đã xong trong quá khứ).',
          examples: [
            { en: 'おととい、{新宿|しんじゅく}へ{行|い}きました。', ro: 'Ototoi, Shinjuku e ikimashita.', vi: 'Hôm kia tôi đã đi Shinjuku.' },
            { en: '{昨日|きのう}、{部屋|へや}を{掃除|そうじ}しました。', ro: 'Kinou, heya o souji shimashita.', vi: 'Hôm qua tôi đã dọn phòng.' },
          ],
        },
        {
          formula: 'V ます → V ませんでした',
          vi: 'Đã không làm V.',
          examples: [
            { en: '{昨日|きのう}、{勉強|べんきょう}しませんでした。', ro: 'Kinou, benkyou shimasen deshita.', vi: 'Hôm qua tôi không học bài.' },
            { en: '{今朝|けさ}、{朝|あさ}ご{飯|はん}を{食|た}べませんでした。', ro: 'Kesa, asagohan o tabemasen deshita.', vi: 'Sáng nay tôi không ăn sáng.' },
          ],
        },
        {
          formula: '（thời gian）、{何|なに}を しましたか。',
          vi: '(Khi đó) đã làm gì? — câu hỏi số 1 của Bài 5.',
          examples: [
            { en: '{週末|しゅうまつ}、{何|なに}をしましたか。', ro: 'Shuumatsu, nani o shimashita ka.', vi: 'Cuối tuần bạn đã làm gì?' },
            { en: '{家族|かぞく}と{食事|しょくじ}しました。', ro: 'Kazoku to shokuji shimashita.', vi: 'Tôi đi ăn với gia đình.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Chia quá khứ các động từ đã học (Bài 3 + Bài 5)',
      head: ['Nhóm', 'Thể ます', 'Quá khứ (+)', 'Quá khứ (−)', 'Nghĩa'],
      rows: [
        ['1', '{行|い}きます', '{行|い}きました', '{行|い}きませんでした', 'đi'],
        ['1', '{帰|かえ}ります', '{帰|かえ}りました', '{帰|かえ}りませんでした', 'về'],
        ['1', '{飲|の}みます', '{飲|の}みました', '{飲|の}みませんでした', 'uống'],
        ['1', '{買|か}います', '{買|か}いました', '{買|か}いませんでした', 'mua'],
        ['1', '{会|あ}います', '{会|あ}いました', '{会|あ}いませんでした', 'gặp'],
        ['1', '{作|つく}ります', '{作|つく}りました', '{作|つく}りませんでした', 'làm, nấu'],
        ['1', '{登|のぼ}ります', '{登|のぼ}りました', '{登|のぼ}りませんでした', 'leo'],
        ['1', '{入|はい}ります', '{入|はい}りました', '{入|はい}りませんでした', 'vào'],
        ['1', '{撮|と}ります', '{撮|と}りました', '{撮|と}りませんでした', 'chụp'],
        ['1', '{読|よ}みます · {聞|き}きます · {働|はたら}きます', '{読|よ}みました · {聞|き}きました · {働|はたら}きました', '{読|よ}みませんでした …', 'đọc · nghe · làm việc'],
        ['2', '{食|た}べます', '{食|た}べました', '{食|た}べませんでした', 'ăn'],
        ['2', '{見|み}ます', '{見|み}ました', '{見|み}ませんでした', 'xem'],
        ['2', '{借|か}ります', '{借|か}りました', '{借|か}りませんでした', 'mượn'],
        ['2', '{起|お}きます · {寝|ね}ます', '{起|お}きました · {寝|ね}ました', '{起|お}きませんでした …', 'dậy · ngủ'],
        ['3', 'します', 'しました', 'しませんでした', 'làm'],
        ['3', '{来|き}ます', '{来|き}ました', '{来|き}ませんでした', 'đến'],
        ['3', '{買|か}い{物|もの}します · {食事|しょくじ}します · {洗濯|せんたく}します · {掃除|そうじ}します · {勉強|べんきょう}します', '～しました', '～しませんでした', 'mua sắm · ăn · giặt · dọn · học'],
      ],
    },
    {
      t: 'p',
      text: 'Ở thể lịch sự (～ます), **mọi nhóm chia giống nhau**: chỉ thay đuôi. Nhóm 1/2/3 chỉ quan trọng từ Bài 7 (thể て). Bây giờ bạn chỉ cần nhớ: **ます → ました → ませんでした**.',
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: khẳng định và phủ định',
      lines: [
        { who: 'A', role: 'a', text: '{昨日|きのう}、{何|なに}をしましたか。', ro: 'Kinou, nani o shimashita ka.', vi: 'Hôm qua bạn đã làm gì?' },
        { who: 'B', role: 'b', text: '{図書館|としょかん}で{勉強|べんきょう}しました。', ro: 'Toshokan de benkyou shimashita.', vi: 'Tôi đã học ở thư viện.' },
        { who: 'A', role: 'a', text: 'アルバイトもしましたか。', ro: 'Arubaito mo shimashita ka.', vi: 'Bạn có làm thêm nữa không?' },
        { who: 'B', role: 'b', text: 'いいえ、アルバイトはしませんでした。', ro: 'Iie, arubaito wa shimasen deshita.', vi: 'Không, tôi không làm thêm.' },
        { who: 'A', role: 'a', text: '{晩|ばん}ご{飯|はん}に{何|なに}を{食|た}べましたか。', ro: 'Bangohan ni nani o tabemashita ka.', vi: 'Bữa tối bạn đã ăn gì?' },
        { who: 'B', role: 'b', text: 'カレーを{作|つく}りました。ルームメイトと{食|た}べました。', ro: 'Karee o tsukurimashita. Ruumumeito to tabemashita.', vi: 'Tôi nấu cà ri. Ăn cùng bạn cùng phòng.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — nói được câu mới',
      head: ['Khi nào', 'Ở đâu / với ai', 'Việc', 'Đuôi'],
      rows: [
        ['{昨日|きのう}、', '{友達|ともだち}の{家|いえ}で', 'ゲームを', 'しました。／しませんでした。'],
        ['おととい、', '{美術館|びじゅつかん}で', '{絵|え}を{見|み}', 'ました。／ませんでした。'],
        ['{先週|せんしゅう}の{日曜日|にちようび}、', '{恋人|こいびと}と', '{食事|しょくじ}', 'しました。／しませんでした。'],
        ['{今朝|けさ}、', 'うちで', '{洗濯|せんたく}', 'しました。／しませんでした。'],
        ['{先月|せんげつ}、', '{図書館|としょかん}で', '{本|ほん}を{借|か}り', 'ました。／ませんでした。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc',
      items: [
        '~~{行|い}きませんでしたか~~ không sai, nhưng câu hỏi bình thường là **{行|い}きましたか** ("có đi không?"). Đáp **いいえ、{行|い}きませんでした**.',
        'Việc **chưa xảy ra** (tối nay, cuối tuần tới) **không** dùng ました: ~~{今晩|こんばん}、{映画|えいが}を{見|み}ました~~ → {今晩|こんばん}、{映画|えいが}を{見|み}**ます**.',
        'Đọc đúng: ませんでした = **ma-sen-de-shi-ta** (5 âm), đừng nuốt thành "masendeshta" quá nhanh khi thi — giám thị chấm cả phát âm.',
      ],
    },

    /* ── ポイント 38 ── */
    { t: 'h', text: 'ポイント 38 — Quá khứ của tính từ và danh từ; ～はどうでしたか' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'イA：～い → ～かったです／～くなかったです',
          vi: 'Tính từ đuôi い: đã ～ / đã không ～.',
          examples: [
            { en: '{昨日|きのう}のパーティーは{楽|たの}しかったです。', ro: 'Kinou no paatii wa tanoshikatta desu.', vi: 'Bữa tiệc hôm qua vui lắm.' },
            { en: '{映画|えいが}はあまりおもしろくなかったです。', ro: 'Eiga wa amari omoshiroku nakatta desu.', vi: 'Bộ phim không hay lắm.' },
          ],
        },
        {
          formula: 'いい → よかったです／よくなかったです',
          vi: 'いい (tốt) chia từ gốc よい. Cả 気持ちがいい cũng vậy.',
          examples: [
            { en: '{天気|てんき}がよかったです。', ro: 'Tenki ga yokatta desu.', vi: 'Thời tiết đã đẹp.' },
            { en: '{温泉|おんせん}は{気持|きも}ちがよかったです。', ro: 'Onsen wa kimochi ga yokatta desu.', vi: 'Suối nước nóng dễ chịu lắm.' },
          ],
        },
        {
          formula: 'ナA／N：～でした／～じゃありませんでした',
          vi: 'Tính từ đuôi な và danh từ: như です của Bài 1, chỉ đổi đuôi.',
          examples: [
            { en: '{昨日|きのう}は{雨|あめ}でした。', ro: 'Kinou wa ame deshita.', vi: 'Hôm qua trời mưa.' },
            { en: 'テストは{簡単|かんたん}じゃありませんでした。', ro: 'Tesuto wa kantan ja arimasen deshita.', vi: 'Bài kiểm tra không dễ.' },
          ],
        },
        {
          formula: 'N は どうでしたか。',
          vi: 'N (đã) thế nào? — hỏi cảm tưởng. Quá khứ của "N はどうですか" (Bài 4, ポイント 33).',
          examples: [
            { en: '{旅行|りょこう}はどうでしたか。', ro: 'Ryokou wa dou deshita ka.', vi: 'Chuyến du lịch thế nào?' },
            { en: 'とても{楽|たの}しかったです。', ro: 'Totemo tanoshikatta desu.', vi: 'Rất vui.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Chia tính từ của Bài 4–5 — che hai cột phải rồi tự chia',
      head: ['Loại', 'Hiện tại', 'Quá khứ (+)', 'Quá khứ (−)', 'Nghĩa'],
      rows: [
        ['い', '{楽|たの}しい', '{楽|たの}しかった', '{楽|たの}しくなかった', 'vui'],
        ['い', 'おもしろい', 'おもしろかった', 'おもしろくなかった', 'hay, thú vị'],
        ['い', '{忙|いそが}しい', '{忙|いそが}しかった', '{忙|いそが}しくなかった', 'bận'],
        ['い', '{難|むずか}しい', '{難|むずか}しかった', '{難|むずか}しくなかった', 'khó'],
        ['い', '{高|たか}い', '{高|たか}かった', '{高|たか}くなかった', 'đắt, cao'],
        ['い', '{安|やす}い', '{安|やす}かった', '{安|やす}くなかった', 'rẻ'],
        ['い', 'おいしい', 'おいしかった', 'おいしくなかった', 'ngon'],
        ['い', '{暑|あつ}い · {寒|さむ}い', '{暑|あつ}かった · {寒|さむ}かった', '{暑|あつ}くなかった · {寒|さむ}くなかった', 'nóng · lạnh'],
        ['い (đặc biệt)', 'いい', '**よかった**', '**よくなかった**', 'tốt'],
        ['い (đặc biệt)', '{気持|きも}ちがいい', '{気持|きも}ちが**よかった**', '{気持|きも}ちが**よくなかった**', 'dễ chịu'],
        ['い', 'ほしい', 'ほしかった', 'ほしくなかった', 'muốn có'],
        ['な', '{簡単|かんたん}', '{簡単|かんたん}でした', '{簡単|かんたん}じゃありませんでした', 'dễ'],
        ['な', '{大変|たいへん}', '{大変|たいへん}でした', '{大変|たいへん}じゃありませんでした', 'vất vả'],
        ['な', '{暇|ひま}', '{暇|ひま}でした', '{暇|ひま}じゃありませんでした', 'rảnh'],
        ['な', 'きれい', 'きれいでした', 'きれいじゃありませんでした', 'đẹp'],
        ['な', 'にぎやか · {静|しず}か', 'にぎやかでした · {静|しず}かでした', '～じゃありませんでした', 'náo nhiệt · yên tĩnh'],
        ['N', '{雨|あめ} · {休|やす}み · {風邪|かぜ}', '{雨|あめ}でした …', '{雨|あめ}じゃありませんでした …', 'mưa · nghỉ · cảm'],
      ],
    },
    {
      t: 'p',
      text: '(Bảng trên viết gọn không có です; khi nói luôn thêm **です**: {楽|たの}しかった**です**, {暇|ひま}**でした** — riêng でした đã là lịch sự, không thêm gì.)',
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: có/không và "thế nào?"',
      lines: [
        { who: 'A', role: 'a', text: '{週末|しゅうまつ}、{何|なに}をしましたか。', ro: 'Shuumatsu, nani o shimashita ka.', vi: 'Cuối tuần bạn đã làm gì?' },
        { who: 'B', role: 'b', text: '{友達|ともだち}と{山|やま}に{登|のぼ}りました。', ro: 'Tomodachi to yama ni noborimashita.', vi: 'Tôi đã leo núi với bạn.' },
        { who: 'A', role: 'a', text: '{楽|たの}しかったですか。', ro: 'Tanoshikatta desu ka.', vi: 'Có vui không?' },
        { who: 'B', role: 'b', text: 'はい、{楽|たの}しかったですが、{大変|たいへん}でした。', ro: 'Hai, tanoshikatta desu ga, taihen deshita.', vi: 'Có, vui nhưng vất vả lắm.' },
        { who: 'A', role: 'a', text: '{天気|てんき}はどうでしたか。', ro: 'Tenki wa dou deshita ka.', vi: 'Thời tiết thế nào?' },
        { who: 'B', role: 'b', text: 'あまりよくなかったです。{雨|あめ}でした。', ro: 'Amari yoku nakatta desu. Ame deshita.', vi: 'Không đẹp lắm. Trời mưa.' },
        { who: 'A', role: 'a', text: '{景色|けしき}はきれいでしたか。', ro: 'Keshiki wa kirei deshita ka.', vi: 'Phong cảnh có đẹp không?' },
        { who: 'B', role: 'b', text: 'いいえ、あまりきれいじゃありませんでした。', ro: 'Iie, amari kirei ja arimasen deshita.', vi: 'Không, không đẹp lắm.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế: N は どうでしたか → trả lời',
      head: ['N は どうでしたか。', 'とても／{少|すこ}し …（+）', 'あまり …（−）'],
      rows: [
        ['{旅行|りょこう}は', 'とても{楽|たの}しかったです。', 'あまり{楽|たの}しくなかったです。'],
        ['{映画|えいが}は', 'とてもおもしろかったです。', 'あまりおもしろくなかったです。'],
        ['{服|ふく}は', '{少|すこ}し{高|たか}かったです。', 'あまり{高|たか}くなかったです。'],
        ['テストは', 'とても{難|むずか}しかったです。', 'あまり{難|むずか}しくなかったです。'],
        ['{温泉|おんせん}は', 'とても{気持|きも}ちがよかったです。', 'あまり{気持|きも}ちがよくなかったです。'],
        ['{町|まち}は', 'とてもにぎやかでした。', 'あまりにぎやかじゃありませんでした。'],
        ['アルバイトは', 'とても{大変|たいへん}でした。', 'あまり{大変|たいへん}じゃありませんでした。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — ba lỗi người Việt gặp nhiều nhất',
      items: [
        '~~{楽|たの}しいでした~~ → **{楽|たの}しかったです**. Tính từ い KHÔNG dùng でした.',
        '~~きれかったです~~ → **きれいでした**. きれい, {有名|ゆうめい}, {嫌|きら}い trông giống đuôi い nhưng là **tính từ な**. Tương tự ~~{嫌|きら}かった~~ → {嫌|きら}いでした.',
        '~~{楽|たの}しかったでした~~ (quá khứ hai lần) → **{楽|たの}しかったです**. ~~いかったです~~ → **よかったです**.',
        'あまり luôn đi với **phủ định**: あまり{楽|たの}しくなかったです. ~~あまり{楽|たの}しかったです~~ là sai.',
      ],
    },

    /* ── ポイント 39 ── */
    { t: 'h', text: 'ポイント 39 — N が 好きです／嫌いです' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（{私|わたし}は）N が {好|す}きです／{嫌|きら}いです。',
          vi: '(Tôi) thích / ghét N. Đối tượng được thích đánh dấu bằng **が**, không phải を.',
          examples: [
            { en: '{私|わたし}は{日本|にほん}のアニメが{好|す}きです。', ro: 'Watashi wa Nihon no anime ga suki desu.', vi: 'Tôi thích phim hoạt hình Nhật.' },
            { en: '{私|わたし}は{掃除|そうじ}が{嫌|きら}いです。', ro: 'Watashi wa souji ga kirai desu.', vi: 'Tôi ghét dọn dẹp.' },
          ],
        },
        {
          formula: 'N が {好|す}きですか。 → はい、{好|す}きです。／いいえ、あまり{好|す}きじゃありません。',
          vi: 'Có thích N không? — Phủ định nhẹ nhàng dùng あまり (người Nhật ít nói thẳng {嫌|きら}いです).',
          examples: [
            { en: 'スポーツが{好|す}きですか。', ro: 'Supootsu ga suki desu ka.', vi: 'Bạn có thích thể thao không?' },
            { en: 'いいえ、あまり{好|す}きじゃありません。', ro: 'Iie, amari suki ja arimasen.', vi: 'Không, tôi không thích lắm.' },
          ],
        },
        {
          formula: '{何|なに}が {好|す}きですか。／どんな N が {好|す}きですか。',
          vi: 'Thích cái gì? / Thích N kiểu gì? (どんな — Bài 4)',
          examples: [
            { en: 'どんな{映画|えいが}が{好|す}きですか。', ro: 'Donna eiga ga suki desu ka.', vi: 'Bạn thích phim kiểu gì?' },
            { en: 'おもしろい{映画|えいが}が{好|す}きです。', ro: 'Omoshiroi eiga ga suki desu.', vi: 'Tôi thích phim hay (vui).' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '{好|す}き và {嫌|きら}い là **tính từ な**, nên chia như きれい: {好|す}きです → {好|す}きじゃありません → {好|す}きでした → {好|す}きじゃありませんでした. Đi trước danh từ: **{好|す}きな** N ({好|す}きな{料理|りょうり} = món ăn yêu thích).',
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp',
      lines: [
        { who: 'A', role: 'a', text: 'Bさんは{買|か}い{物|もの}が{好|す}きですか。', ro: 'B-san wa kaimono ga suki desu ka.', vi: 'B có thích mua sắm không?' },
        { who: 'B', role: 'b', text: 'はい、{好|す}きです。{日曜日|にちようび}、{新宿|しんじゅく}で{買|か}い{物|もの}します。', ro: 'Hai, suki desu. Nichiyoubi, Shinjuku de kaimono shimasu.', vi: 'Có, tôi thích. Chủ Nhật tôi sẽ mua sắm ở Shinjuku.' },
        { who: 'A', role: 'a', text: 'へえ、いいですね。{料理|りょうり}も{好|す}きですか。', ro: 'Hee, ii desu ne. Ryouri mo suki desu ka.', vi: 'Ồ, hay nhỉ. Bạn cũng thích nấu ăn chứ?' },
        { who: 'B', role: 'b', text: 'いいえ、{料理|りょうり}は{嫌|きら}いです。', ro: 'Iie, ryouri wa kirai desu.', vi: 'Không, nấu ăn thì tôi ghét.' },
        { who: 'A', role: 'a', text: 'どんな{料理|りょうり}が{好|す}きですか。', ro: 'Donna ryouri ga suki desu ka.', vi: 'Bạn thích món ăn kiểu gì? (để ăn)' },
        { who: 'B', role: 'b', text: '{辛|から}い{料理|りょうり}が{好|す}きです。', ro: 'Karai ryouri ga suki desu.', vi: 'Tôi thích món cay.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế',
      head: ['{私|わたし}は', 'N', 'が', '{好|す}きです／{嫌|きら}いです。'],
      rows: [
        ['{私|わたし}は', 'アニメ · {映画|えいが} · ゲーム · サッカー', 'が', '{好|す}きです。'],
        ['{私|わたし}は', '{写真|しゃしん} · {絵|え} · {旅行|りょこう} · {温泉|おんせん}', 'が', '{好|す}きです。'],
        ['{私|わたし}は', '{掃除|そうじ} · {洗濯|せんたく} · テスト · {雨|あめ}', 'が', '{嫌|きら}いです。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc',
      items: [
        '~~アニメを{好|す}きです~~ → **アニメが{好|す}きです**. Với {好|す}き／{嫌|きら}い／ほしい luôn là **が**.',
        'Trong câu có cả chủ ngữ: **{私|わたし}は** アニメ**が** {好|す}きです — は cho người, が cho thứ được thích. Câu phủ định hay đổi が → は để nhấn mạnh: {料理|りょうり}**は**{嫌|きら}いです.',
        'Hỏi người lớn/giám thị không nên hỏi thẳng "～が{嫌|きら}いですか"; nhưng **trả lời** giám thị thì dùng thoải mái.',
      ],
    },

    /* ── ポイント 40 ── */
    { t: 'h', text: 'ポイント 40 — N が ほしいです (muốn có N)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（{私|わたし}は）N が ほしいです。',
          vi: 'Tôi muốn có N (một đồ vật, thứ cụ thể).',
          examples: [
            { en: '{私|わたし}はパソコンがほしいです。', ro: 'Watashi wa pasokon ga hoshii desu.', vi: 'Tôi muốn có máy tính.' },
            { en: '{新|あたら}しい{自転車|じてんしゃ}がほしいです。', ro: 'Atarashii jitensha ga hoshii desu.', vi: 'Tôi muốn có xe đạp mới.' },
          ],
        },
        {
          formula: '{何|なに}が ほしいですか。',
          vi: 'Bạn muốn có gì?',
          examples: [
            { en: '{今|いま}、{何|なに}がほしいですか。', ro: 'Ima, nani ga hoshii desu ka.', vi: 'Bây giờ bạn muốn có gì?' },
            { en: '{大|おお}きいかばんがほしいです。', ro: 'Ookii kaban ga hoshii desu.', vi: 'Tôi muốn có cái túi to.' },
          ],
        },
        {
          formula: 'N は ほしくないです。',
          vi: 'Không muốn có N. (ほしい là tính từ い → phủ định くない)',
          examples: [
            { en: '{車|くるま}はほしくないです。{自転車|じてんしゃ}がほしいです。', ro: 'Kuruma wa hoshiku nai desu. Jitensha ga hoshii desu.', vi: 'Tôi không muốn ô tô. Tôi muốn xe đạp.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp',
      lines: [
        { who: 'A', role: 'a', text: 'Bさんは{今|いま}、{何|なに}がほしいですか。', ro: 'B-san wa ima, nani ga hoshii desu ka.', vi: 'B, bây giờ bạn muốn có gì?' },
        { who: 'B', role: 'b', text: 'カメラがほしいです。', ro: 'Kamera ga hoshii desu.', vi: 'Tôi muốn có máy ảnh.' },
        { who: 'A', role: 'a', text: 'どんなカメラがほしいですか。', ro: 'Donna kamera ga hoshii desu ka.', vi: 'Bạn muốn máy ảnh kiểu gì?' },
        { who: 'B', role: 'b', text: '{小|ちい}さいカメラがほしいです。{写真|しゃしん}が{好|す}きですから。', ro: 'Chiisai kamera ga hoshii desu. Shashin ga suki desu kara.', vi: 'Tôi muốn máy ảnh nhỏ. Vì tôi thích chụp ảnh.' },
        { who: 'A', role: 'a', text: '{携帯電話|けいたいでんわ}もほしいですか。', ro: 'Keitai denwa mo hoshii desu ka.', vi: 'Bạn cũng muốn điện thoại chứ?' },
        { who: 'B', role: 'b', text: 'いいえ、{携帯電話|けいたいでんわ}はほしくないです。', ro: 'Iie, keitai denwa wa hoshiku nai desu.', vi: 'Không, điện thoại thì tôi không muốn.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế',
      head: ['{私|わたし}は', '(tính từ +) N', 'が ほしいです。'],
      rows: [
        ['{私|わたし}は', '{新|あたら}しい{財布|さいふ} · {新|あたら}しい{服|ふく}', 'が ほしいです。'],
        ['{私|わたし}は', '{大|おお}きいかばん · {小|ちい}さいカメラ', 'が ほしいです。'],
        ['{私|わたし}は', '{自転車|じてんしゃ} · パソコン · {時計|とけい}', 'が ほしいです。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc',
      items: [
        '~~パソコンをほしいです~~ → **パソコンがほしいです**.',
        'ほしい chỉ dùng cho **đồ vật / thứ muốn có**. Muốn **làm** gì thì dùng ～たいです (ポイント 41): ~~{旅行|りょこう}がほしいです~~ → **{旅行|りょこう}したいです**.',
        'ほしいです／～たいです chỉ nói về **mình** (hoặc hỏi người nghe). Không nói ~~マルコさんはカメラがほしいです~~ khi thi — nói về người thứ ba cần mẫu khác (học sau).',
      ],
    },

    /* ── ポイント 41 ── */
    { t: 'h', text: 'ポイント 41 — V(ます)たいです (muốn làm V)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'V ます → V たいです',
          vi: 'Muốn làm V. Bỏ ます, thêm たいです: {飲|の}みます → {飲|の}みたいです.',
          examples: [
            { en: '{私|わたし}はコーヒーを{飲|の}みたいです。', ro: 'Watashi wa koohii o nomitai desu.', vi: 'Tôi muốn uống cà phê.' },
            { en: '{北海道|ほっかいどう}へ{行|い}きたいです。', ro: 'Hokkaidou e ikitai desu.', vi: 'Tôi muốn đi Hokkaido.' },
            { en: '{友達|ともだち}に{会|あ}いたいです。', ro: 'Tomodachi ni aitai desu.', vi: 'Tôi muốn gặp bạn.' },
          ],
        },
        {
          formula: 'V たくないです',
          vi: 'Không muốn làm V. (たい chia như tính từ い)',
          examples: [
            { en: '{今日|きょう}は{勉強|べんきょう}したくないです。', ro: 'Kyou wa benkyou shitaku nai desu.', vi: 'Hôm nay tôi không muốn học.' },
          ],
        },
        {
          formula: '{何|なに}を V たいですか。／どこへ {行|い}きたいですか。',
          vi: 'Muốn làm gì? / Muốn đi đâu?',
          examples: [
            { en: '{今度|こんど}の{休|やす}みに{何|なに}をしたいですか。', ro: 'Kondo no yasumi ni nani o shitai desu ka.', vi: 'Kỳ nghỉ tới bạn muốn làm gì?' },
            { en: '{山|やま}に{登|のぼ}りたいです。', ro: 'Yama ni noboritai desu.', vi: 'Tôi muốn leo núi.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Trợ từ GIỮ NGUYÊN như câu gốc (sách p.273 đóng khung)',
      head: ['Câu gốc', '→ ～たいです', 'Ghi chú'],
      rows: [
        ['コーヒー**を**{飲|の}みます', 'コーヒー**を**{飲|の}みたいです', 'を giữ nguyên (đổi thành **が** cũng được: コーヒーが{飲|の}みたいです)'],
        ['{北海道|ほっかいどう}**へ**{行|い}きます', '{北海道|ほっかいどう}**へ**{行|い}きたいです', 'へ giữ nguyên — KHÔNG đổi thành が'],
        ['{友達|ともだち}**に**{会|あ}います', '{友達|ともだち}**に**{会|あ}いたいです', 'に giữ nguyên — KHÔNG đổi thành が'],
        ['{温泉|おんせん}**に**{入|はい}ります', '{温泉|おんせん}**に**{入|はい}りたいです', 'に giữ nguyên'],
      ],
    },
    {
      t: 'table',
      caption: 'Chia ～たい',
      head: ['Thể ます', '～たいです', '～たくないです', '～たかったです (đã muốn)'],
      rows: [
        ['{行|い}きます', '{行|い}きたいです', '{行|い}きたくないです', '{行|い}きたかったです'],
        ['{見|み}ます', '{見|み}たいです', '{見|み}たくないです', '{見|み}たかったです'],
        ['{食|た}べます', '{食|た}べたいです', '{食|た}べたくないです', '{食|た}べたかったです'],
        ['{撮|と}ります', '{撮|と}りたいです', '{撮|と}りたくないです', '{撮|と}りたかったです'],
        ['します', 'したいです', 'したくないです', 'したかったです'],
        ['{買|か}い{物|もの}します', '{買|か}い{物|もの}したいです', '{買|か}い{物|もの}したくないです', '{買|か}い{物|もの}したかったです'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp',
      lines: [
        { who: 'A', role: 'a', text: '{今度|こんど}の{休|やす}みに{何|なに}をしたいですか。', ro: 'Kondo no yasumi ni nani o shitai desu ka.', vi: 'Kỳ nghỉ tới bạn muốn làm gì?' },
        { who: 'B', role: 'b', text: '{温泉|おんせん}に{入|はい}りたいです。', ro: 'Onsen ni hairitai desu.', vi: 'Tôi muốn tắm suối nước nóng.' },
        { who: 'A', role: 'a', text: 'どこへ{行|い}きたいですか。', ro: 'Doko e ikitai desu ka.', vi: 'Bạn muốn đi đâu?' },
        { who: 'B', role: 'b', text: '{箱根|はこね}へ{行|い}きたいです。', ro: 'Hakone e ikitai desu.', vi: 'Tôi muốn đi Hakone.' },
        { who: 'A', role: 'a', text: '{誰|だれ}と{行|い}きたいですか。', ro: 'Dare to ikitai desu ka.', vi: 'Bạn muốn đi với ai?' },
        { who: 'B', role: 'b', text: '{家族|かぞく}と{行|い}きたいです。', ro: 'Kazoku to ikitai desu.', vi: 'Tôi muốn đi với gia đình.' },
        { who: 'A', role: 'a', text: '{明日|あした}も{勉強|べんきょう}したいですか。', ro: 'Ashita mo benkyou shitai desu ka.', vi: 'Ngày mai bạn cũng muốn học chứ?' },
        { who: 'B', role: 'b', text: 'いいえ、{明日|あした}は{勉強|べんきょう}したくないです。', ro: 'Iie, ashita wa benkyou shitaku nai desu.', vi: 'Không, ngày mai tôi không muốn học.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế',
      head: ['Đối tượng + trợ từ', 'V(ます)', 'たいです。'],
      rows: [
        ['{日本|にほん}の{映画|えいが}を', '{見|み}', 'たいです。'],
        ['{新|あたら}しい{服|ふく}を', '{買|か}い', 'たいです。'],
        ['{山|やま}の{写真|しゃしん}を', '{撮|と}り', 'たいです。'],
        ['{図書館|としょかん}で{本|ほん}を', '{借|か}り', 'たいです。'],
        ['{恋人|こいびと}に', '{会|あ}い', 'たいです。'],
        ['{来年|らいねん}、{日本|にほん}へ', '{行|い}き', 'たいです。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc',
      items: [
        '~~{行|い}きますたいです~~ / ~~{行|い}くたいです~~ → **{行|い}きたいです**: bỏ hẳn ます.',
        '~~{行|い}きたいでした~~ → **{行|い}きたかったです** (たい chia như tính từ い).',
        '~~{日本|にほん}が{行|い}きたいです~~ → **{日本|にほん}へ{行|い}きたいです**. Chỉ を mới được đổi thành が.',
        'Không dùng ～たいですか để **mời** người trên ("thầy có muốn uống cà phê không?") — nghe thiếu lễ độ. Mời dùng ～ませんか (Bài 6).',
      ],
    },

    /* ── ポイント 42 ── */
    { t: 'h', text: 'ポイント 42 — N1(nơi) へ ［V(ます)／N2］ に 行きます (đi đâu để làm gì)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1(nơi) へ V(ます) に {行|い}きます。',
          vi: 'Đi đến N1 để làm V. V bỏ ます rồi thêm に: {買|か}います → {買|か}い**に**.',
          examples: [
            { en: '{週末|しゅうまつ}、{友達|ともだち}と{渋谷|しぶや}へお{酒|さけ}を{飲|の}みに{行|い}きます。', ro: 'Shuumatsu, tomodachi to Shibuya e osake o nomi ni ikimasu.', vi: 'Cuối tuần tôi đi Shibuya uống rượu với bạn.' },
            { en: '{山|やま}へ{写真|しゃしん}を{撮|と}りに{行|い}きます。', ro: 'Yama e shashin o tori ni ikimasu.', vi: 'Tôi lên núi để chụp ảnh.' },
          ],
        },
        {
          formula: 'N1(nơi) へ N2 に {行|い}きます。',
          vi: 'Đi đến N1 để N2. N2 là **danh từ chỉ hoạt động**: {買|か}い{物|もの}, {食事|しょくじ}, {旅行|りょこう}, お{花見|はなみ}, スキー…',
          examples: [
            { en: '{私|わたし}は{新宿|しんじゅく}へ{買|か}い{物|もの}に{行|い}きます。', ro: 'Watashi wa Shinjuku e kaimono ni ikimasu.', vi: 'Tôi đi Shinjuku để mua sắm.' },
            { en: '{昨日|きのう}、{恋人|こいびと}とレストランへ{食事|しょくじ}に{行|い}きました。', ro: 'Kinou, koibito to resutoran e shokuji ni ikimashita.', vi: 'Hôm qua tôi đi nhà hàng ăn với người yêu.' },
          ],
        },
        {
          formula: '～に {来|き}ます／{帰|かえ}ります',
          vi: 'Cũng dùng với {来|き}ます (đến để…) và {帰|かえ}ります (về để…).',
          examples: [
            { en: '{日本|にほん}へ{日本語|にほんご}を{勉強|べんきょう}しに{来|き}ました。', ro: 'Nihon e Nihongo o benkyou shi ni kimashita.', vi: 'Tôi đến Nhật để học tiếng Nhật.' },
            { en: 'うちへ{晩|ばん}ご{飯|はん}を{食|た}べに{帰|かえ}ります。', ro: 'Uchi e bangohan o tabe ni kaerimasu.', vi: 'Tôi về nhà để ăn cơm tối.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Đổi V → mục đích: bỏ ます, thêm に',
      head: ['Thể ます', 'Mục đích', 'Ví dụ'],
      rows: [
        ['{買|か}います', '{買|か}い**に**', 'デパートへ{服|ふく}を{買|か}いに{行|い}きます。'],
        ['{見|み}ます', '{見|み}**に**', '{美術館|びじゅつかん}へ{絵|え}を{見|み}に{行|い}きます。'],
        ['{食|た}べます', '{食|た}べ**に**', '{新宿|しんじゅく}へおすしを{食|た}べに{行|い}きます。'],
        ['{撮|と}ります', '{撮|と}り**に**', '{海|うみ}へ{写真|しゃしん}を{撮|と}りに{行|い}きます。'],
        ['{借|か}ります', '{借|か}り**に**', '{図書館|としょかん}へ{本|ほん}を{借|か}りに{行|い}きます。'],
        ['{会|あ}います', '{会|あ}い**に**', '{大阪|おおさか}へ{友達|ともだち}に{会|あ}いに{行|い}きます。'],
        ['{勉強|べんきょう}します', '{勉強|べんきょう}し**に** (hoặc {勉強|べんきょう}**に**)', '{図書館|としょかん}へ{勉強|べんきょう}しに{行|い}きます。'],
        ['{買|か}い{物|もの}します', '{買|か}い{物|もの}**に**', '{渋谷|しぶや}へ{買|か}い{物|もの}に{行|い}きます。'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp',
      lines: [
        { who: 'A', role: 'a', text: 'Bさん、{今度|こんど}の{休|やす}みに、どこかへ{行|い}きますか。', ro: 'B-san, kondo no yasumi ni, dokoka e ikimasu ka.', vi: 'B, kỳ nghỉ tới bạn có đi đâu không?' },
        { who: 'B', role: 'b', text: 'はい、{上野|うえの}へ{行|い}きます。', ro: 'Hai, Ueno e ikimasu.', vi: 'Có, tôi đi Ueno.' },
        { who: 'A', role: 'a', text: '{上野|うえの}へ{何|なに}をしに{行|い}きますか。', ro: 'Ueno e nani o shi ni ikimasu ka.', vi: 'Bạn đi Ueno để làm gì?' },
        { who: 'B', role: 'b', text: '{美術館|びじゅつかん}へ{絵|え}を{見|み}に{行|い}きます。', ro: 'Bijutsukan e e o mi ni ikimasu.', vi: 'Tôi đến bảo tàng để xem tranh.' },
        { who: 'A', role: 'a', text: 'そうですか。{私|わたし}は{秋葉原|あきはばら}へ{自転車|じてんしゃ}を{買|か}いに{行|い}きます。', ro: 'Sou desu ka. Watashi wa Akihabara e jitensha o kai ni ikimasu.', vi: 'Thế à. Tôi thì đi Akihabara để mua xe đạp.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế',
      head: ['Nơi へ', '(đối tượng) V(ます)に／N に', '{行|い}きます。'],
      rows: [
        ['{渋谷|しぶや}へ', '{映画|えいが}を{見|み}に', '{行|い}きます。'],
        ['{箱根|はこね}へ', '{温泉|おんせん}に{入|はい}りに', '{行|い}きます。'],
        ['レストランへ', '{食事|しょくじ}に', '{行|い}きます。'],
        ['{公園|こうえん}へ', 'お{花見|はなみ}に', '{行|い}きます。'],
        ['{北海道|ほっかいどう}へ', 'スキーに', '{行|い}きます。'],
        ['{友達|ともだち}の{家|いえ}へ', 'ゲームをしに', '{行|い}きます。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc',
      items: [
        '~~{買|か}いますに{行|い}きます~~ / ~~{買|か}うに~~ → **{買|か}いに{行|い}きます**.',
        'Hai trợ từ khác việc: **へ** (hoặc に) chỉ **nơi đến**, **に** sau động từ chỉ **mục đích**. Thứ tự tự nhiên: Nơi**へ** + việc**に** + {行|い}きます.',
        'Hỏi mục đích: **{何|なに}をしに**{行|い}きますか (đi để làm gì?). Đừng nhầm với どこへ{行|い}きますか (đi đâu?).',
      ],
    },

    /* ── ポイント 43 ── */
    { t: 'h', text: 'ポイント 43 — どこかへ行きますか (có đi đâu không?)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'どこか（へ） {行|い}きましたか。 → はい、～へ{行|い}きました。',
          vi: 'Có đi đâu (đó) không? → Có, đã đi ～. (はい + nói luôn nơi đó)',
          examples: [
            { en: '{昨日|きのう}、どこか（へ）{行|い}きましたか。', ro: 'Kinou, dokoka (e) ikimashita ka.', vi: 'Hôm qua bạn có đi đâu không?' },
            { en: 'はい、{新宿|しんじゅく}へ{行|い}きました。', ro: 'Hai, Shinjuku e ikimashita.', vi: 'Có, tôi đã đi Shinjuku.' },
          ],
        },
        {
          formula: '→ いいえ、どこ（へ）も {行|い}きませんでした。',
          vi: 'Không, chẳng đi đâu cả. (どこ + も + phủ định — Bài 3, ポイント 23)',
          examples: [
            { en: 'いいえ、どこ（へ）も{行|い}きませんでした。', ro: 'Iie, doko (e) mo ikimasen deshita.', vi: 'Không, tôi chẳng đi đâu cả.' },
            { en: 'うちでテレビを{見|み}ました。', ro: 'Uchi de terebi o mimashita.', vi: 'Tôi xem ti vi ở nhà.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'どこか ≠ どこ — khác nhau ở câu trả lời',
      head: ['Câu hỏi', 'Nghĩa', 'Trả lời', 'Cần はい／いいえ?'],
      rows: [
        ['**どこへ**{行|い}きましたか。', 'Đã đi **đâu**? (biết chắc là có đi)', '{新宿|しんじゅく}へ{行|い}きました。', 'KHÔNG'],
        ['**どこかへ**{行|い}きましたか。', 'Có đi **đâu đó** không?', 'はい、{新宿|しんじゅく}へ{行|い}きました。／いいえ、どこへも{行|い}きませんでした。', '**CÓ**'],
        ['{何|なに}を{食|た}べましたか。', 'Đã ăn **gì**?', 'パンを{食|た}べました。', 'KHÔNG'],
        ['（Bài 3）{何|なに}も{食|た}べませんでした。', 'Chẳng ăn gì cả.', '—', '—'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: hai trường hợp',
      lines: [
        { who: 'A', role: 'a', text: '{週末|しゅうまつ}、どこかへ{行|い}きましたか。', ro: 'Shuumatsu, dokoka e ikimashita ka.', vi: 'Cuối tuần bạn có đi đâu không?' },
        { who: 'B', role: 'b', text: 'はい、{横浜|よこはま}へ{行|い}きました。{海|うみ}を{見|み}ました。', ro: 'Hai, Yokohama e ikimashita. Umi o mimashita.', vi: 'Có, tôi đi Yokohama. Tôi ngắm biển.' },
        { who: 'B', role: 'b', text: 'Aさんは？', ro: 'A-san wa?', vi: 'Còn A?' },
        { who: 'A', role: 'a', text: '{私|わたし}はどこへも{行|い}きませんでした。{風邪|かぜ}でしたから。', ro: 'Watashi wa doko e mo ikimasen deshita. Kaze deshita kara.', vi: 'Tôi chẳng đi đâu cả. Vì bị cảm.' },
        { who: 'B', role: 'b', text: 'そうですか。それは{大変|たいへん}でしたね。', ro: 'Sou desu ka. Sore wa taihen deshita ne.', vi: 'Thế à. Vậy thì vất vả quá.' },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc',
      items: [
        'Nghe **どこか** mà trả lời thẳng "{新宿|しんじゅく}へ{行|い}きました" không sai nghĩa, nhưng thiếu はい → bị trừ tới 5 điểm. Luôn mở đầu bằng **はい／いいえ**.',
        '~~いいえ、どこかへ{行|い}きませんでした~~ → **いいえ、どこへも{行|い}きませんでした**. Phủ định dùng **どこも**, không dùng どこか.',
        'Trong câu hỏi, へ sau どこか có thể bỏ: どこか{行|い}きましたか. Khi trả lời phủ định: どこ**へ**も／どこ**も** đều được.',
      ],
    },

    /* ── ポイント 44 ── */
    { t: 'h', text: 'ポイント 44 — どうして (tại sao)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'どうして ～か。 → ～から（です）。',
          vi: 'Tại sao ～? → Vì ～. Câu trả lời kết thúc bằng から (ポイント 47).',
          examples: [
            { en: 'どうして{朝|あさ}、{何|なに}も{食|た}べませんでしたか。', ro: 'Doushite asa, nani mo tabemasen deshita ka.', vi: 'Sao sáng nay bạn không ăn gì cả?' },
            { en: '{朝|あさ}、{忙|いそが}しかったですから。', ro: 'Asa, isogashikatta desu kara.', vi: 'Vì buổi sáng tôi bận.' },
          ],
        },
        {
          formula: 'どうしてですか。',
          vi: 'Sao vậy? (hỏi lại lý do của câu người kia vừa nói)',
          examples: [
            { en: '{昨日|きのう}、{学校|がっこう}へ{行|い}きませんでした。— どうしてですか。', ro: 'Kinou, gakkou e ikimasen deshita. — Doushite desu ka.', vi: 'Hôm qua tôi không đi học. — Sao vậy?' },
            { en: '{風邪|かぜ}でしたから。', ro: 'Kaze deshita kara.', vi: 'Vì tôi bị cảm.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp',
      lines: [
        { who: 'A', role: 'a', text: 'Bさん、{自転車|じてんしゃ}を{買|か}いましたか。', ro: 'B-san, jitensha o kaimashita ka.', vi: 'B, bạn đã mua xe đạp chưa?' },
        { who: 'B', role: 'b', text: 'いいえ、{買|か}いませんでした。', ro: 'Iie, kaimasen deshita.', vi: 'Không, tôi không mua.' },
        { who: 'A', role: 'a', text: 'どうして{買|か}いませんでしたか。', ro: 'Doushite kaimasen deshita ka.', vi: 'Tại sao bạn không mua?' },
        { who: 'B', role: 'b', text: '{高|たか}かったですから。', ro: 'Takakatta desu kara.', vi: 'Vì đắt quá.' },
        { who: 'A', role: 'a', text: 'どうして{日本語|にほんご}を{勉強|べんきょう}しますか。', ro: 'Doushite Nihongo o benkyou shimasu ka.', vi: 'Tại sao bạn học tiếng Nhật?' },
        { who: 'B', role: 'b', text: '{日本|にほん}のアニメが{好|す}きですから。', ro: 'Nihon no anime ga suki desu kara.', vi: 'Vì tôi thích phim hoạt hình Nhật.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế: どうして ～ませんでしたか → lý do',
      head: ['Câu hỏi', 'Lý do ～から。'],
      rows: [
        ['どうして{山|やま}に{登|のぼ}りませんでしたか。', '{雨|あめ}でしたから。'],
        ['どうしてパーティーへ{行|い}きませんでしたか。', '{忙|いそが}しかったですから。'],
        ['どうして{晩|ばん}ご{飯|はん}を{食|た}べませんでしたか。', '{風邪|かぜ}でしたから。'],
        ['どうしてその{服|ふく}を{買|か}いましたか。', '{安|やす}かったですから。'],
        ['どうして{温泉|おんせん}へ{行|い}きたいですか。', '{温泉|おんせん}が{好|す}きですから。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc',
      items: [
        'Trả lời どうして mà không có **から** thì chỉ là một câu kể, không phải lý do: ~~{高|たか}かったです~~ → **{高|たか}かったですから**.',
        'どうして đứng **đầu câu hỏi** (hoặc ngay sau chủ đề). Không đặt cuối: ~~{買|か}いませんでしたどうして~~.',
      ],
    },

    /* ── ポイント 45 ── */
    { t: 'h', text: 'ポイント 45 — それから (sau đó)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'Câu 1。それから、Câu 2。',
          vi: 'Làm việc 1. Sau đó làm việc 2. — kể các việc theo **đúng thứ tự thời gian**.',
          examples: [
            { en: '{昨日|きのう}、{恋人|こいびと}と{映画|えいが}を{見|み}ました。それから、{食事|しょくじ}をしました。', ro: 'Kinou, koibito to eiga o mimashita. Sorekara, shokuji o shimashita.', vi: 'Hôm qua tôi xem phim với người yêu. Sau đó đi ăn.' },
            { en: '{朝|あさ}、{洗濯|せんたく}しました。それから、{部屋|へや}を{掃除|そうじ}しました。', ro: 'Asa, sentaku shimashita. Sorekara, heya o souji shimashita.', vi: 'Buổi sáng tôi giặt đồ. Sau đó dọn phòng.' },
          ],
        },
        {
          formula: 'それから？',
          vi: 'Rồi sao nữa? — người nghe dùng để giục kể tiếp.',
          examples: [
            { en: 'へえ。それから？', ro: 'Hee. Sorekara?', vi: 'Ồ. Rồi sao nữa?' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'それから (Bài 5) và そして (Bài 4) — khác nhau',
      head: ['Từ', 'Nối', 'Ví dụ'],
      rows: [
        ['**それから**', 'hai **việc** nối tiếp nhau (trước → sau)', '{映画|えいが}を{見|み}ました。**それから**、{食事|しょくじ}しました。'],
        ['**そして**', 'hai **tính chất** / thông tin cộng thêm', 'この{町|まち}はにぎやかです。**そして**、きれいです。'],
        ['それから (Bài 2)', 'thêm món khi gọi đồ: "thêm nữa là…"', 'コーヒーをください。**それから**、ケーキも。'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo thi nói',
      items: [
        'Khi giám thị hỏi {週末|しゅうまつ}、{何|なに}をしましたか, trả lời **hai câu nối bằng それから** là cách dễ nhất để "ghi điểm ngữ pháp": {友達|ともだち}と{買|か}い{物|もの}しました。それから、{食事|しょくじ}しました。',
      ],
    },

    /* ── ポイント 46 ── */
    { t: 'h', text: 'ポイント 46 — N(người) と V (làm cùng với ai)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N(người) と V ます。',
          vi: 'Làm V cùng với N.',
          examples: [
            { en: '{週末|しゅうまつ}、{友達|ともだち}とサッカーをしました。', ro: 'Shuumatsu, tomodachi to sakkaa o shimashita.', vi: 'Cuối tuần tôi đá bóng với bạn.' },
            { en: '{家族|かぞく}と{箱根|はこね}へ{行|い}きました。', ro: 'Kazoku to Hakone e ikimashita.', vi: 'Tôi đi Hakone với gia đình.' },
          ],
        },
        {
          formula: '{誰|だれ}と V ましたか。 → N と V ました。／{一人|ひとり}で V ました。',
          vi: 'Đã làm với ai? → Với N. / Một mình (**{一人|ひとり}で** — không dùng と).',
          examples: [
            { en: '{誰|だれ}と{行|い}きましたか。', ro: 'Dare to ikimashita ka.', vi: 'Bạn đi với ai?' },
            { en: '{一人|ひとり}で{行|い}きました。', ro: 'Hitori de ikimashita.', vi: 'Tôi đi một mình.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'と của Bài 1 và と của Bài 5',
      head: ['', 'Mẫu', 'Ví dụ', 'Nghĩa'],
      rows: [
        ['Bài 1 (ポイント 5)', 'N1 と N2', '{趣味|しゅみ}は{映画|えいが}と{音楽|おんがく}です。', '"và" — liệt kê danh từ'],
        ['Bài 5 (ポイント 46)', 'N(người) と V', '{友達|ともだち}と{映画|えいが}を{見|み}ました。', '"cùng với" — ai làm cùng'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp',
      lines: [
        { who: 'A', role: 'a', text: '{日曜日|にちようび}、{何|なに}をしましたか。', ro: 'Nichiyoubi, nani o shimashita ka.', vi: 'Chủ Nhật bạn đã làm gì?' },
        { who: 'B', role: 'b', text: '{美術館|びじゅつかん}へ{行|い}きました。', ro: 'Bijutsukan e ikimashita.', vi: 'Tôi đi bảo tàng mỹ thuật.' },
        { who: 'A', role: 'a', text: '{誰|だれ}と{行|い}きましたか。', ro: 'Dare to ikimashita ka.', vi: 'Bạn đi với ai?' },
        { who: 'B', role: 'b', text: 'ルームメイトと{行|い}きました。', ro: 'Ruumumeito to ikimashita.', vi: 'Tôi đi với bạn cùng phòng.' },
        { who: 'A', role: 'a', text: '{晩|ばん}ご{飯|はん}もルームメイトと{食|た}べましたか。', ro: 'Bangohan mo ruumumeito to tabemashita ka.', vi: 'Bữa tối bạn cũng ăn với bạn cùng phòng à?' },
        { who: 'B', role: 'b', text: 'いいえ、{晩|ばん}ご{飯|はん}は{一人|ひとり}で{食|た}べました。', ro: 'Iie, bangohan wa hitori de tabemashita.', vi: 'Không, bữa tối tôi ăn một mình.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế',
      head: ['Ai と', 'Việc', 'Đuôi'],
      rows: [
        ['{家族|かぞく}と', '{旅行|りょこう}', 'しました。'],
        ['{恋人|こいびと}と', '{映画|えいが}を{見|み}', 'ました。'],
        ['ルームメイトと', '{晩|ばん}ご{飯|はん}を{作|つく}り', 'ました。'],
        ['{友達|ともだち}と', '{山|やま}に{登|のぼ}り', 'ました。'],
        ['{一人|ひとり}で', '{美術館|びじゅつかん}へ{行|い}き', 'ました。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc',
      items: [
        '~~{一人|ひとり}と{行|い}きました~~ → **{一人|ひとり}で**{行|い}きました. "Một mình" luôn là {一人|ひとり}**で**.',
        '~~{友達|ともだち}で{行|い}きました~~ → **{友達|ともだち}と**. で chỉ nơi làm việc (Bài 3) hoặc phương tiện (Bài 4); と mới là "với ai".',
      ],
    },

    /* ── ポイント 47 ── */
    { t: 'h', text: 'ポイント 47 — ___から、___ (vì … nên …)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'Lý do から、Kết quả。',
          vi: 'Vì (lý do) nên (kết quả). **Lý do đứng trước** — ngược tiếng Việt hay nói "…vì…".',
          examples: [
            { en: '{昨日|きのう}、{雨|あめ}でしたから、どこへも{行|い}きませんでした。', ro: 'Kinou, ame deshita kara, doko e mo ikimasen deshita.', vi: 'Hôm qua vì trời mưa nên tôi không đi đâu cả.' },
            { en: '{天気|てんき}がよかったですから、{気持|きも}ちがよかったです。', ro: 'Tenki ga yokatta desu kara, kimochi ga yokatta desu.', vi: 'Vì trời đẹp nên rất dễ chịu.' },
            { en: 'パソコンがほしいですから、サカイ{電器|でんき}へ{行|い}きます。', ro: 'Pasokon ga hoshii desu kara, Sakai denki e ikimasu.', vi: 'Vì muốn có máy tính nên tôi đi cửa hàng điện máy Sakai.' },
          ],
        },
        {
          formula: 'Kết quả。Lý do から（です）。',
          vi: 'Tách thành hai câu: nói kết quả trước, lý do sau (thường gặp khi trả lời どうして).',
          examples: [
            { en: '{買|か}いませんでした。{高|たか}かったですから。', ro: 'Kaimasen deshita. Takakatta desu kara.', vi: 'Tôi không mua. Vì đắt.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'から gắn sau đuôi lịch sự (です／ます) của mọi loại từ',
      head: ['Loại', 'Hiện tại', 'Quá khứ'],
      rows: [
        ['V', '{行|い}きます**から**', '{行|い}きました**から**'],
        ['イA', '{忙|いそが}しいです**から**', '{忙|いそが}しかったです**から**'],
        ['ナA', '{暇|ひま}です**から**', '{暇|ひま}でした**から**'],
        ['N', '{休|やす}みです**から**', '{雨|あめ}でした**から**'],
        ['ほしい／～たい', 'ほしいです**から** · {見|み}たいです**から**', '—'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp',
      lines: [
        { who: 'A', role: 'a', text: '{週末|しゅうまつ}、どこかへ{行|い}きましたか。', ro: 'Shuumatsu, dokoka e ikimashita ka.', vi: 'Cuối tuần bạn có đi đâu không?' },
        { who: 'B', role: 'b', text: 'いいえ、{忙|いそが}しかったですから、どこへも{行|い}きませんでした。', ro: 'Iie, isogashikatta desu kara, doko e mo ikimasen deshita.', vi: 'Không, vì bận nên tôi không đi đâu cả.' },
        { who: 'A', role: 'a', text: '{今度|こんど}の{休|やす}みは？', ro: 'Kondo no yasumi wa?', vi: 'Còn kỳ nghỉ tới?' },
        { who: 'B', role: 'b', text: '{暇|ひま}ですから、{友達|ともだち}と{海|うみ}へ{行|い}きたいです。', ro: 'Hima desu kara, tomodachi to umi e ikitai desu.', vi: 'Vì rảnh nên tôi muốn đi biển với bạn.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế: Lý do から、Kết quả',
      head: ['Lý do から、', 'Kết quả'],
      rows: [
        ['{風邪|かぜ}でしたから、', '{学校|がっこう}へ{行|い}きませんでした。'],
        ['{天気|てんき}がよかったですから、', '{山|やま}に{登|のぼ}りました。'],
        ['{服|ふく}が{安|やす}かったですから、', 'たくさん{買|か}いました。'],
        ['テストは{簡単|かんたん}でしたから、', '{気持|きも}ちがよかったです。'],
        ['{新|あたら}しいカメラがほしいですから、', '{秋葉原|あきはばら}へ{行|い}きます。'],
        ['{日本|にほん}のアニメが{好|す}きですから、', '{日本語|にほんご}を{勉強|べんきょう}します。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc',
      items: [
        'Dịch từng chữ tiếng Việt "Tôi không đi **vì** trời mưa" thành ~~{行|い}きませんでしたから、{雨|あめ}でした~~ là **ngược nghĩa**. Nhớ: から đứng **ngay sau lý do**.',
        '~~{雨|あめ}から~~ → **{雨|あめ}でしたから** (danh từ phải có です／でした trước から ở thể lịch sự).',
        'Có から thì thường **bỏ** そして／それから ở vế sau; mỗi câu chỉ một từ nối.',
      ],
    },

    /* ── So sánh trợ từ ── */
    { t: 'h', text: 'Tổng hợp trợ từ — で・と・へ・に・を・が trong câu kể ngày nghỉ' },
    {
      t: 'p',
      text: 'Một câu kể ngày nghỉ đầy đủ chứa gần như mọi trợ từ đã học. Nhìn câu mẫu, rồi đọc bảng: mỗi trợ từ trả lời một câu hỏi khác nhau.',
    },
    {
      t: 'examples',
      items: [
        { en: '{日曜日|にちようび}、{友達|ともだち}と{渋谷|しぶや}へ{行|い}きました。{渋谷|しぶや}で{映画|えいが}を{見|み}ました。', ro: 'Nichiyoubi, tomodachi to Shibuya e ikimashita. Shibuya de eiga o mimashita.', vi: 'Chủ Nhật tôi đi Shibuya với bạn. Ở Shibuya tôi xem phim.' },
        { en: '{来週|らいしゅう}、{一人|ひとり}で{箱根|はこね}へ{温泉|おんせん}に{入|はい}りに{行|い}きたいです。{温泉|おんせん}が{好|す}きですから。', ro: 'Raishuu, hitori de Hakone e onsen ni hairi ni ikitai desu. Onsen ga suki desu kara.', vi: 'Tuần sau tôi muốn một mình đi Hakone tắm suối nước nóng. Vì tôi thích suối nước nóng.' },
      ],
    },
    {
      t: 'table',
      head: ['Trợ từ', 'Trả lời câu hỏi', 'Ví dụ', 'Bài'],
      rows: [
        ['**と**', '{誰|だれ}と？ — với ai', '{友達|ともだち}**と**{行|い}きました', '5 (46)'],
        ['**で** (nơi)', 'どこで？ — làm việc ở đâu', '{渋谷|しぶや}**で**{映画|えいが}を{見|み}ました', '3 (20)'],
        ['**で** (cách)', 'một mình / bằng gì', '{一人|ひとり}**で** · {電車|でんしゃ}**で**', '4 (31), 5'],
        ['**へ**', 'どこへ？ — đi/về/đến đâu', '{渋谷|しぶや}**へ**{行|い}きました', '3 (17)'],
        ['**に** (mục đích)', '{何|なに}をしに？ — đi để làm gì', '{映画|えいが}を{見|み}**に**{行|い}きます', '5 (42)'],
        ['**に** (đối tượng)', 'gặp ai, leo gì, vào đâu', '{友達|ともだち}**に**{会|あ}います · {山|やま}**に**{登|のぼ}ります · {温泉|おんせん}**に**{入|はい}ります', '5'],
        ['**に** (thời điểm)', '{何時|なんじ}に？', '{9時|くじ}**に**{起|お}きました', '3 (19)'],
        ['**を**', '{何|なに}を？ — làm cái gì', '{映画|えいが}**を**{見|み}ました', '3 (18)'],
        ['**が**', 'thích / ghét / muốn có cái gì', 'アニメ**が**{好|す}きです · カメラ**が**ほしいです', '5 (39, 40)'],
      ],
    },
    {
      t: 'note',
      title: 'Hai cặp dễ nhầm nhất',
      items: [
        '**{渋谷|しぶや}へ** {行|い}きました (đi TỚI Shibuya) ≠ **{渋谷|しぶや}で** {映画|えいが}を{見|み}ました (xem phim Ở Shibuya). Động từ di chuyển → へ; hành động tại chỗ → で.',
        '**{友達|ともだち}と** {会|あ}いました vs **{友達|ともだち}に** {会|あ}いました: Bài 5 học **{友達|ともだち}に{会|あ}います** (gặp bạn). {友達|ともだち}と{会|あ}います cũng đúng (hai người hẹn gặp nhau), nhưng mẫu của sách là **に** — khi thi dùng に cho chắc.',
      ],
    },

    /* ── Tổng kết ── */
    { t: 'h', text: 'Tổng kết — các câu hỏi của Bài 5 và cách trả lời' },
    {
      t: 'table',
      head: ['Câu hỏi', 'Hỏi về', 'Trả lời mẫu', 'ポイント'],
      rows: [
        ['{週末|しゅうまつ}、{何|なに}をしましたか。', 'Việc đã làm', '{友達|ともだち}と{買|か}い{物|もの}しました。', '37, 46'],
        ['{昨日|きのう}、{勉強|べんきょう}しましたか。', 'Có/không', 'いいえ、{勉強|べんきょう}しませんでした。', '37'],
        ['どこかへ{行|い}きましたか。', 'Có đi đâu không', 'はい、{新宿|しんじゅく}へ{行|い}きました。／いいえ、どこへも{行|い}きませんでした。', '43'],
        ['{誰|だれ}と{行|い}きましたか。', 'Với ai', '{家族|かぞく}と{行|い}きました。／{一人|ひとり}で{行|い}きました。', '46'],
        ['～はどうでしたか。', 'Cảm tưởng', 'とても{楽|たの}しかったです。', '38'],
        ['～は{楽|たの}しかったですか。', 'Có/không (tính từ)', 'はい、{楽|たの}しかったです。／いいえ、{楽|たの}しくなかったです。', '38'],
        ['どうして～ませんでしたか。', 'Lý do', '{忙|いそが}しかったですから。', '44, 47'],
        ['それから？', 'Việc tiếp theo', 'それから、{食事|しょくじ}しました。', '45'],
        ['{何|なに}が{好|す}きですか。', 'Sở thích', 'アニメが{好|す}きです。', '39'],
        ['{今|いま}、{何|なに}がほしいですか。', 'Muốn có', '{自転車|じてんしゃ}がほしいです。', '40'],
        ['{今度|こんど}の{休|やす}みに{何|なに}をしたいですか。', 'Muốn làm', '{山|やま}に{登|のぼ}りたいです。', '41'],
        ['どこへ{何|なに}をしに{行|い}きますか。', 'Đi đâu để làm gì', '{秋葉原|あきはばら}へカメラを{買|か}いに{行|い}きます。', '42'],
      ],
    },

    {
      t: 'build',
      id: 'b5-np-ghep',
      title: 'Ghép câu — dùng đủ 11 điểm ngữ pháp',
      items: [
        { vi: 'Hôm qua tôi đã đi Shinjuku.', chips: ['{昨日|きのう}、', '{新宿|しんじゅく}', 'へ', '{行|い}きました', 'で', '{行|い}きます'], answer: ['{昨日|きのう}、', '{新宿|しんじゅく}', 'へ', '{行|い}きました'], ro: 'Kinou, Shinjuku e ikimashita.' },
        { vi: 'Sáng nay tôi không ăn sáng.', chips: ['{今朝|けさ}、', '{朝|あさ}ご{飯|はん}', 'を', '{食|た}べませんでした', '{食|た}べました', 'に'], answer: ['{今朝|けさ}、', '{朝|あさ}ご{飯|はん}', 'を', '{食|た}べませんでした'], ro: 'Kesa, asagohan o tabemasen deshita.' },
        { vi: 'Chuyến du lịch rất vui.', chips: ['{旅行|りょこう}', 'は', 'とても', '{楽|たの}しかったです', '{楽|たの}しいでした', 'を'], answer: ['{旅行|りょこう}', 'は', 'とても', '{楽|たの}しかったです'], ro: 'Ryokou wa totemo tanoshikatta desu.' },
        { vi: 'Bài kiểm tra không dễ.', chips: ['テスト', 'は', '{簡単|かんたん}', 'じゃありませんでした', 'くなかったです', 'が'], answer: ['テスト', 'は', '{簡単|かんたん}', 'じゃありませんでした'], ro: 'Tesuto wa kantan ja arimasen deshita.' },
        { vi: 'Tôi thích phim hoạt hình Nhật.', chips: ['{私|わたし}', 'は', '{日本|にほん}', 'の', 'アニメ', 'が', '{好|す}きです', 'を'], answer: ['{私|わたし}', 'は', '{日本|にほん}', 'の', 'アニメ', 'が', '{好|す}きです'], ro: 'Watashi wa Nihon no anime ga suki desu.' },
        { vi: 'Tôi muốn có xe đạp mới.', chips: ['{新|あたら}しい', '{自転車|じてんしゃ}', 'が', 'ほしいです', 'を', 'たいです'], answer: ['{新|あたら}しい', '{自転車|じてんしゃ}', 'が', 'ほしいです'], ro: 'Atarashii jitensha ga hoshii desu.' },
        { vi: 'Tôi muốn tắm suối nước nóng.', chips: ['{温泉|おんせん}', 'に', '{入|はい}りたいです', 'を', '{入|はい}りますたいです'], answer: ['{温泉|おんせん}', 'に', '{入|はい}りたいです'], ro: 'Onsen ni hairitai desu.' },
        { vi: 'Tôi đi thư viện để mượn sách.', chips: ['{図書館|としょかん}', 'へ', '{本|ほん}', 'を', '{借|か}り', 'に', '{行|い}きます', 'で'], answer: ['{図書館|としょかん}', 'へ', '{本|ほん}', 'を', '{借|か}り', 'に', '{行|い}きます'], ro: 'Toshokan e hon o kari ni ikimasu.' },
        { vi: 'Không, tôi chẳng đi đâu cả.', chips: ['いいえ、', 'どこ', 'へ', 'も', '{行|い}きませんでした', 'か', '{行|い}きました'], answer: ['いいえ、', 'どこ', 'へ', 'も', '{行|い}きませんでした'], alt: [['いいえ、', 'どこ', 'も', '{行|い}きませんでした']], ro: 'Iie, doko e mo ikimasen deshita.' },
        { vi: 'Tại sao bạn không mua?', chips: ['どうして', '{買|か}いませんでした', 'か', 'から', 'どこ'], answer: ['どうして', '{買|か}いませんでした', 'か'], ro: 'Doushite kaimasen deshita ka.' },
        { vi: 'Tôi xem phim. Sau đó đi ăn.', chips: ['{映画|えいが}を{見|み}ました。', 'それから、', '{食事|しょくじ}しました。', 'そして、', 'から、'], answer: ['{映画|えいが}を{見|み}ました。', 'それから、', '{食事|しょくじ}しました。'], ro: 'Eiga o mimashita. Sorekara, shokuji shimashita.' },
        { vi: 'Tôi đá bóng với bạn.', chips: ['{友達|ともだち}', 'と', 'サッカー', 'を', 'しました', 'で', 'に'], answer: ['{友達|ともだち}', 'と', 'サッカー', 'を', 'しました'], ro: 'Tomodachi to sakkaa o shimashita.' },
        { vi: 'Vì trời mưa nên tôi không đi đâu cả.', chips: ['{雨|あめ}でしたから、', 'どこ', 'へ', 'も', '{行|い}きませんでした', '{雨|あめ}から、'], answer: ['{雨|あめ}でしたから、', 'どこ', 'へ', 'も', '{行|い}きませんでした'], alt: [['{雨|あめ}でしたから、', 'どこ', 'も', '{行|い}きませんでした']], ro: 'Ame deshita kara, doko e mo ikimasen deshita.' },
        { vi: 'Tôi gặp bạn ở Shibuya.', chips: ['{渋谷|しぶや}', 'で', '{友達|ともだち}', 'に', '{会|あ}いました', 'を', 'へ'], answer: ['{渋谷|しぶや}', 'で', '{友達|ともだち}', 'に', '{会|あ}いました'], ro: 'Shibuya de tomodachi ni aimashita.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-np-kiem',
      title: 'Kiểm tra nhanh ngữ pháp Bài 5',
      items: [
        { q: '{昨日|きのう}、{映画|えいが}を＿＿。 (đã xem)', options: ['{見|み}ます', '{見|み}ました', '{見|み}ませんでした', '{見|み}たいです'], correct: 1, why: 'Hôm qua + đã làm → **{見|み}ました** (ポイント 37).' },
        { q: '「{楽|たの}しい」 quá khứ khẳng định:', options: ['{楽|たの}しいでした', '{楽|たの}しかったです', '{楽|たの}しかったでした', '{楽|たの}しくでした'], correct: 1, why: 'Tính từ い: い → **かったです** (ポイント 38).' },
        { q: '「きれい」 quá khứ khẳng định:', options: ['きれかったです', 'きれいかったです', 'きれいでした', 'きれいくなかったです'], correct: 2, why: 'きれい là **tính từ な** → きれい**でした**.' },
        { q: '「いい」 quá khứ phủ định:', options: ['いくなかったです', 'よくなかったです', 'いいじゃありませんでした', 'よかったです'], correct: 1, why: 'いい chia từ よい: **よくなかったです**.' },
        { q: '{私|わたし}はアニメ＿{好|す}きです。', options: ['を', 'が', 'に', 'で'], correct: 1, why: '{好|す}き／{嫌|きら}い／ほしい đi với **が** (ポイント 39, 40).' },
        { q: '"Tôi muốn uống cà phê."', options: ['コーヒーを{飲|の}みますたいです。', 'コーヒーを{飲|の}むたいです。', 'コーヒーを{飲|の}みたいです。', 'コーヒーがほしいに{飲|の}みます。'], correct: 2, why: 'Bỏ ます + たいです: **{飲|の}みたいです** (ポイント 41).' },
        { q: 'デパートへ{服|ふく}を＿＿{行|い}きます。', options: ['{買|か}いに', '{買|か}いますに', '{買|か}いで', '{買|か}いを'], correct: 0, why: 'V(ます) + に + {行|い}きます: **{買|か}いに** (ポイント 42).' },
        { q: '「{週末|しゅうまつ}、どこかへ{行|い}きましたか。」 Không đi đâu thì đáp:', options: ['いいえ、どこかへ{行|い}きませんでした。', 'いいえ、どこへも{行|い}きませんでした。', 'どこへも{行|い}きました。', 'はい、どこも{行|い}きません。'], correct: 1, why: 'Phủ định: **どこへも** + ませんでした (ポイント 43).' },
        { q: '「どうして{来|き}ませんでしたか。」 Trả lời đúng:', options: ['{風邪|かぜ}でした。', '{風邪|かぜ}でしたから。', '{風邪|かぜ}から。', 'はい、{風邪|かぜ}です。'], correct: 1, why: 'Lý do kết thúc bằng **から**, danh từ cần でした trước から (ポイント 44, 47).' },
        { q: '"Tôi đi một mình."', options: ['{一人|ひとり}と{行|い}きました。', '{一人|ひとり}で{行|い}きました。', '{一人|ひとり}に{行|い}きました。', '{一人|ひとり}を{行|い}きました。'], correct: 1, why: 'Một mình = **{一人|ひとり}で** (không dùng と).' },
        { q: '{雨|あめ}でした＿、どこへも{行|い}きませんでした。', options: ['が', 'から', 'それから', 'と'], correct: 1, why: 'Lý do + **から**, kết quả (ポイント 47).' },
        { q: '{映画|えいが}を{見|み}ました。＿＿、{食事|しょくじ}しました。 (việc tiếp theo)', options: ['そして', 'それから', 'から', 'どうして'], correct: 1, why: 'Việc nối tiếp việc → **それから** (ポイント 45).' },
        { q: '{友達|ともだち}＿{会|あ}いました。', options: ['を', 'に', 'で', 'へ'], correct: 1, why: '{会|あ}います đi với **に**.' },
        { q: '{渋谷|しぶや}＿{買|か}い{物|もの}しました。 (mua sắm Ở Shibuya)', options: ['へ', 'に', 'で', 'と'], correct: 2, why: 'Nơi diễn ra hành động → **で**.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const KANJI: Lesson = {
  id: 'b5-kanji',
  kind: 'kanji',
  title: 'Chữ Hán — trong từ vựng Bài 5 (thời gian, việc ngày nghỉ, cảm tưởng)',
  goal: 'Đọc được mọi từ chữ Hán trong từ vựng Bài 5, đặc biệt các từ đọc đặc biệt như 今日, 昨日, 今朝, 今年, 部屋, 風邪, 景色, 一人.',
  minutes: 30,
  blocks: [
    {
      t: 'p',
      text: 'Phần Reading của bài thi có **4 từ chữ Hán gạch chân không có furigana** (12 điểm). Bài 5 có rất nhiều từ chỉ thời gian ({昨日|きのう}, {先週|せんしゅう}, {去年|きょねん}…) — chúng gần như chắc chắn xuất hiện trong bài đọc kể chuyện quá khứ. Học theo **cả từ**, vì nhiều từ đọc hoàn toàn khác từng chữ ghép lại.',
    },
    {
      t: 'table',
      caption: 'Nhóm 0 — Từ ĐỌC ĐẶC BIỆT (không ghép từ âm từng chữ được) — thuộc lòng',
      head: ['Từ', 'Đọc', 'Nghĩa', 'Nếu ghép từng chữ sẽ SAI thành'],
      rows: [
        ['今日', '**きょう**', 'hôm nay', '~~こんにち~~ (こんにちは thì đúng là chữ này)'],
        ['明日', '**あした**', 'ngày mai', '~~めいにち~~'],
        ['昨日', '**きのう**', 'hôm qua', '~~さくじつ~~ (cách đọc trang trọng)'],
        ['今朝', '**けさ**', 'sáng nay', '~~いまあさ~~, ~~こんちょう~~'],
        ['今年', '**ことし**', 'năm nay', '~~こんねん~~, ~~いまとし~~'],
        ['部屋', '**へや**', 'căn phòng', '~~ぶや~~, ~~ぶおく~~'],
        ['風邪', '**かぜ**', 'cảm cúm', '~~ふうじゃ~~'],
        ['景色', '**けしき**', 'phong cảnh', '~~けいしょく~~'],
        ['一人', '**ひとり**', 'một người', '~~いちにん~~'],
        ['友達', '**ともだち**', 'bạn bè', '~~ゆうたつ~~'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm 1 — Thời gian',
      head: ['Chữ', 'Hán Việt', 'Âm On (音)', 'Âm Kun (訓)', 'Từ trong bài'],
      rows: [
        ['今', 'KIM', 'こん', 'いま', '{今晩|こんばん} · {今度|こんど} · {今|いま} · (đặc biệt) {今日|きょう} {今朝|けさ} {今年|ことし}'],
        ['明', 'MINH', 'めい', 'あか(るい)', '{明日|あした} (đặc biệt)'],
        ['昨', 'TẠC', 'さく', '—', '{昨日|きのう} (đặc biệt)'],
        ['先', 'TIÊN', 'せん', 'さき', '{先週|せんしゅう} · {先月|せんげつ} · {先生|せんせい}'],
        ['週', 'CHU', 'しゅう', '—', '{週末|しゅうまつ} · {先週|せんしゅう}'],
        ['末', 'MẠT', 'まつ', 'すえ', '{週末|しゅうまつ}'],
        ['朝', 'TRIÊU', 'ちょう', 'あさ', '{朝|あさ} · {今朝|けさ} (đặc biệt)'],
        ['月', 'NGUYỆT', 'げつ・がつ', 'つき', '{先月|せんげつ} · {月曜日|げつようび} · {5月|ごがつ}'],
        ['去', 'KHỨ', 'きょ', 'さ(る)', '{去年|きょねん}'],
        ['年', 'NIÊN', 'ねん', 'とし', '{去年|きょねん} · {来年|らいねん} · {今年|ことし}'],
        ['来', 'LAI', 'らい', 'く(る)・き(ます)', '{来年|らいねん} · {来|き}ます'],
        ['度', 'ĐỘ', 'ど', '—', '{今度|こんど}'],
        ['晩', 'VÃN', 'ばん', '—', '{今晩|こんばん} · {晩|ばん}ご{飯|はん} · {毎晩|まいばん}'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm 2 — Nơi chốn, người',
      head: ['Chữ', 'Hán Việt', 'Âm On (音)', 'Âm Kun (訓)', 'Từ trong bài'],
      rows: [
        ['家', 'GIA', 'か', 'いえ・うち', '{家|いえ} · {家族|かぞく}'],
        ['族', 'TỘC', 'ぞく', '—', '{家族|かぞく}'],
        ['部', 'BỘ', 'ぶ', '—', '{部屋|へや} (đặc biệt)'],
        ['屋', 'ỐC', 'おく', 'や', '{部屋|へや} · {本屋|ほんや}'],
        ['美', 'MỸ', 'び', 'うつく(しい)', '{美術館|びじゅつかん}'],
        ['術', 'THUẬT', 'じゅつ', '—', '{美術館|びじゅつかん}'],
        ['館', 'QUÁN', 'かん', '—', '{美術館|びじゅつかん} · {図書館|としょかん} · {体育館|たいいくかん}'],
        ['恋', 'LUYẾN', 'れん', 'こい', '{恋人|こいびと}'],
        ['人', 'NHÂN', 'じん・にん', 'ひと', '{恋人|こいびと} (ひと → びと) · {一人|ひとり} · ベトナム{人|じん}'],
        ['友', 'HỮU', 'ゆう', 'とも', '{友達|ともだち}'],
        ['達', 'ĐẠT', 'たつ', '—', '{友達|ともだち} (đọc だち)'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm 3 — Việc làm ngày nghỉ (động từ)',
      head: ['Chữ', 'Hán Việt', 'Âm On (音)', 'Âm Kun (訓)', 'Từ trong bài'],
      rows: [
        ['会', 'HỘI', 'かい', 'あ(う)', '{会|あ}います · {会社|かいしゃ}'],
        ['作', 'TÁC', 'さく', 'つく(る)', '{作|つく}ります'],
        ['買', 'MÃI', 'ばい', 'か(う)', '{買|か}います · {買|か}い{物|もの}'],
        ['物', 'VẬT', 'ぶつ', 'もの', '{買|か}い{物|もの} · {果物|くだもの}'],
        ['食', 'THỰC', 'しょく', 'た(べる)', '{食事|しょくじ} · {食|た}べます'],
        ['事', 'SỰ', 'じ', 'こと', '{食事|しょくじ} · {仕事|しごと}'],
        ['洗', 'TẨY', 'せん', 'あら(う)', '{洗濯|せんたく}'],
        ['濯', 'TRẠC', 'たく', '—', '{洗濯|せんたく}'],
        ['掃', 'TẢO', 'そう', 'は(く)', '{掃除|そうじ}'],
        ['除', 'TRỪ', 'じ・じょ', 'のぞ(く)', '{掃除|そうじ} (đọc じ)'],
        ['登', 'ĐĂNG', 'と・とう', 'のぼ(る)', '{登|のぼ}ります'],
        ['入', 'NHẬP', 'にゅう', 'はい(る)', '{入|はい}ります'],
        ['撮', 'TOÁT', 'さつ', 'と(る)', '{撮|と}ります'],
        ['借', 'TÁ', 'しゃく', 'か(りる)', '{借|か}ります'],
        ['写', 'TẢ', 'しゃ', 'うつ(す)', '{写真|しゃしん}'],
        ['真', 'CHÂN', 'しん', 'ま', '{写真|しゃしん}'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm 4 — Tính từ cảm tưởng, thích/ghét',
      head: ['Chữ', 'Hán Việt', 'Âm On (音)', 'Âm Kun (訓)', 'Từ trong bài'],
      rows: [
        ['忙', 'MANG', 'ぼう', 'いそが(しい)', '{忙|いそが}しい'],
        ['高', 'CAO', 'こう', 'たか(い)', '{高|たか}い · {高校|こうこう}'],
        ['安', 'AN', 'あん', 'やす(い)', '{安|やす}い'],
        ['楽', 'LẠC', 'らく・がく', 'たの(しい)', '{楽|たの}しい · {音楽|おんがく}'],
        ['難', 'NAN', 'なん', 'むずか(しい)', '{難|むずか}しい'],
        ['簡', 'GIẢN', 'かん', '—', '{簡単|かんたん}'],
        ['単', 'ĐƠN', 'たん', '—', '{簡単|かんたん}'],
        ['大', 'ĐẠI', 'たい・だい', 'おお(きい)', '{大変|たいへん} · {大学|だいがく} · {大|おお}きい'],
        ['変', 'BIẾN', 'へん', 'か(わる)', '{大変|たいへん}'],
        ['暇', 'HẠ', 'か', 'ひま', '{暇|ひま}'],
        ['好', 'HẢO', 'こう', 'す(き)', '{好|す}き'],
        ['嫌', 'HIỀM', 'けん', 'きら(い)', '{嫌|きら}い'],
        ['気', 'KHÍ', 'き', '—', '{天気|てんき} · {気持|きも}ち'],
        ['持', 'TRÌ', 'じ', 'も(つ)', '{気持|きも}ち'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm 5 — Sự vật: thời tiết, quần áo, phong cảnh, xe',
      head: ['Chữ', 'Hán Việt', 'Âm On (音)', 'Âm Kun (訓)', 'Từ trong bài'],
      rows: [
        ['天', 'THIÊN', 'てん', 'あめ', '{天気|てんき}'],
        ['風', 'PHONG', 'ふう', 'かぜ', '{風邪|かぜ} (đặc biệt)'],
        ['邪', 'TÀ', 'じゃ', '—', '{風邪|かぜ}'],
        ['飯', 'PHẠN', 'はん', 'めし', '{晩|ばん}ご{飯|はん}'],
        ['服', 'PHỤC', 'ふく', '—', '{服|ふく}'],
        ['温', 'ÔN', 'おん', 'あたた(かい)', '{温泉|おんせん}'],
        ['泉', 'TUYỀN', 'せん', 'いずみ', '{温泉|おんせん}'],
        ['絵', 'HỘI', 'かい・え', '—', '{絵|え}'],
        ['景', 'CẢNH', 'けい', '—', '{景色|けしき} (đặc biệt)'],
        ['色', 'SẮC', 'しょく・しき', 'いろ', '{景色|けしき}'],
        ['自', 'TỰ', 'じ', 'みずか(ら)', '{自転車|じてんしゃ}'],
        ['転', 'CHUYỂN', 'てん', 'ころ(ぶ)', '{自転車|じてんしゃ}'],
        ['車', 'XA', 'しゃ', 'くるま', '{自転車|じてんしゃ} · {電車|でんしゃ} · {車|くるま}'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ',
      items: [
        '**Hán Việt giúp đoán nghĩa**: {美術館|びじゅつかん} = MỸ THUẬT QUÁN, {家族|かぞく} = GIA TỘC, {洗濯|せんたく} = TẨY TRẠC (giặt), {掃除|そうじ} = TẢO TRỪ (quét dọn), {自転車|じてんしゃ} = TỰ CHUYỂN XA (xe tự lăn), {温泉|おんせん} = ÔN TUYỀN (suối ấm), {写真|しゃしん} = TẢ CHÂN (chụp cái thật), {簡単|かんたん} = GIẢN ĐƠN.',
        '**Cặp tương tự**: {先週|せんしゅう}／{先月|せんげつ} (tuần trước / tháng trước) — {今週|こんしゅう}／{今月|こんげつ} — {来週|らいしゅう}／{来月|らいげつ}／{来年|らいねん}. Nhưng năm trước là **{去年|きょねん}**, không phải ~~せんねん~~.',
        '**館 = toà nhà công cộng**: {図書館|としょかん} (thư viện), {体育館|たいいくかん} (nhà thi đấu), {美術館|びじゅつかん} (bảo tàng mỹ thuật).',
        '**買 và 貝**: 買 (mua) có bộ "lưới" 罒 ở trên. Người xưa dùng vỏ sò (貝) làm tiền nên chữ "mua" có hình sò.',
      ],
    },
    {
      t: 'mcq',
      id: 'b5-kj-doc',
      title: 'Đọc chữ Hán — chọn cách đọc đúng',
      items: [
        { q: '昨日', options: ['さくじつ', 'きのう', 'きょう', 'あした'], correct: 1, why: 'Đọc đặc biệt: **きのう** (hôm qua).' },
        { q: '今日', options: ['こんにち', 'きょう', 'いまひ', 'けさ'], correct: 1, why: '**きょう** (hôm nay).' },
        { q: '明日', options: ['めいにち', 'あさって', 'あした', 'みょうにち'], correct: 2, why: '**あした** (ngày mai).' },
        { q: '今朝', options: ['けさ', 'こんあさ', 'いまあさ', 'こんちょう'], correct: 0, why: '**けさ** (sáng nay).' },
        { q: '今年', options: ['こんねん', 'ことし', 'いまとし', 'らいねん'], correct: 1, why: '**ことし** (năm nay).' },
        { q: '去年', options: ['きょねん', 'きょうねん', 'こねん', 'さるねん'], correct: 0, why: '**きょねん** — き ngắn, không có trường âm.' },
        { q: '来年', options: ['くるねん', 'らいねん', 'きねん', 'らいとし'], correct: 1, why: '**らいねん**.' },
        { q: '先週', options: ['せんしゅう', 'さきしゅう', 'せんしゅ', 'せんげつ'], correct: 0, why: '**せんしゅう** (trường âm しゅう).' },
        { q: '週末', options: ['しゅまつ', 'しゅうまつ', 'しゅうすえ', 'じゅうまつ'], correct: 1, why: '**しゅうまつ** (cuối tuần).' },
        { q: '部屋', options: ['ぶや', 'へや', 'ぶおく', 'べや'], correct: 1, why: 'Đọc đặc biệt: **へや**.' },
        { q: '美術館', options: ['びじゅつかん', 'びじゅかん', 'みじゅつかん', 'びじゅっかん'], correct: 0, why: '**びじゅつかん**.' },
        { q: '家族', options: ['いえぞく', 'かぞく', 'かそく', 'けぞく'], correct: 1, why: '**かぞく** (gia đình).' },
        { q: '恋人', options: ['こいびと', 'れんじん', 'こいひと', 'こいにん'], correct: 0, why: '**こいびと** (ひと → びと khi ghép).' },
        { q: '友達', options: ['ゆうたつ', 'ともたち', 'ともだち', 'ゆうだち'], correct: 2, why: '**ともだち**.' },
        { q: '一人で', options: ['いちにんで', 'ひとりで', 'いちじんで', 'ひとつで'], correct: 1, why: '**ひとりで** (một mình).' },
        { q: '洗濯', options: ['せんたく', 'せんだく', 'あらたく', 'せんとく'], correct: 0, why: '**せんたく** (giặt giũ).' },
        { q: '掃除', options: ['そうじょ', 'そうじ', 'そじ', 'はくじ'], correct: 1, why: '**そうじ** — 除 ở đây đọc じ.' },
        { q: '食事', options: ['しょくじ', 'たべこと', 'しょくごと', 'しょっじ'], correct: 0, why: '**しょくじ**.' },
        { q: '風邪', options: ['ふうじゃ', 'かぜ', 'かぜじゃ', 'ふうせ'], correct: 1, why: 'Đọc đặc biệt: **かぜ**.' },
        { q: '天気', options: ['てんき', 'でんき', 'てんけ', 'あまき'], correct: 0, why: '**てんき** (thời tiết). でんき = điện.' },
        { q: '晩ご飯', options: ['ばんごはん', 'よるごはん', 'ばんごめし', 'まんごはん'], correct: 0, why: '**ばんごはん** (cơm tối).' },
        { q: '温泉', options: ['おんせん', 'おんいずみ', 'あたせん', 'おうせん'], correct: 0, why: '**おんせん**.' },
        { q: '景色', options: ['けいしょく', 'けしき', 'けいしき', 'けいいろ'], correct: 1, why: 'Đọc đặc biệt: **けしき** (không có trường âm).' },
        { q: '自転車', options: ['じてんしゃ', 'じでんしゃ', 'じてんくるま', 'じどうしゃ'], correct: 0, why: '**じてんしゃ** (xe đạp). じどうしゃ = ô tô (自動車).' },
        { q: '写真', options: ['しゃしん', 'しゃじん', 'うつしん', 'しゃま'], correct: 0, why: '**しゃしん** (ảnh).' },
        { q: '忙しい', options: ['いそがしい', 'いそかしい', 'ぼうしい', 'いそしい'], correct: 0, why: '**いそがしい** (bận).' },
        { q: '楽しい', options: ['らくしい', 'たのしい', 'がくしい', 'たのい'], correct: 1, why: '**たのしい** (vui).' },
        { q: '難しい', options: ['なんしい', 'むずかしい', 'むつかしい', 'むすかしい'], correct: 1, why: '**むずかしい** (khó).' },
        { q: '簡単', options: ['かんたん', 'かんだん', 'けんたん', 'かんたんな'], correct: 0, why: '**かんたん** (dễ).' },
        { q: '大変', options: ['だいへん', 'たいへん', 'おおへん', 'たいべん'], correct: 1, why: '**たいへん** (vất vả).' },
        { q: '気持ち', options: ['きもち', 'けもち', 'きじち', 'きもつ'], correct: 0, why: '**きもち** — {気持|きも}ちがいい = dễ chịu.' },
        { q: '好き', options: ['こうき', 'すき', 'このき', 'よき'], correct: 1, why: '**すき** (thích).' },
        { q: '嫌い', options: ['けんい', 'きらい', 'いやい', 'きれい'], correct: 1, why: '**きらい** (ghét) — đừng nhầm với きれい (đẹp)!' },
      ],
    },
  ],
};

/* ═══════════════════════════ 5. NGHE ═══════════════════════════ */

const NGHE: Lesson = {
  id: 'b5-nghe',
  kind: 'listening',
  title: 'Luyện nghe — đã đi đâu, làm gì, với ai, thấy thế nào, sắp làm gì',
  goal: 'Nghe và bắt đúng nơi đã đi, việc đã làm, người đi cùng, cảm tưởng (vui/mệt/đắt…) và kế hoạch kỳ nghỉ tới trong hội thoại về ngày nghỉ.',
  minutes: 40,
  blocks: [
    {
      t: 'note',
      title: 'Cách nghe Bài 5',
      items: [
        'Đọc **câu hỏi trước**: cần bắt NƠI (～へ), VIỆC (～を～ました), NGƯỜI (～と) hay CẢM TƯỞNG (～かったです／～でした)?',
        'Nghe **đuôi câu** để biết đã làm hay không: ～ま**した** (có) ↔ ～ません**でした** (không); ～**かった** (có) ↔ ～**くなかった** (không).',
        'Bẫy hay gặp: người nói **định làm A nhưng rồi không làm** (～たいです… ～から、～ませんでした), hoặc bị hỏi "～も？" rồi đáp いいえ.',
        'Nghe 1–2 lần, trả lời, **rồi mới** mở lời thoại. Lần sau tắt romaji, nghe lại.',
      ],
    },

    /* ── Bài 1: やってみよう 5-1 ── */
    { t: 'h', text: 'Bài 1 — Chủ Nhật đi đâu, làm gì? (dạng やってみよう 5-1)' },
    {
      t: 'table',
      caption: 'Chọn đáp án từ hai danh sách này',
      head: ['Nơi (どこ?)', 'Việc (何?)'],
      rows: [
        ['ⓐ {友達|ともだち}の{家|いえ} · ⓑ {新宿|しんじゅく} · ⓒ {渋谷|しぶや} · ⓓ {公園|こうえん} · ⓔ không đi đâu', 'あ chơi game · い ăn uống · う dọn nhà · え mua sắm · お dùng máy tính · か nấu ăn · き xem phim/ti vi · く giặt đồ'],
      ],
    },
    {
      t: 'listen',
      id: 'b5-ng-1a',
      title: '1. Park và Marco',
      note: 'Marco đi đâu, làm gì? Park đi đâu, làm gì?',
      lines: [
        { who: 'パク', voice: 'ja-nu', text: 'マルコさん、{日曜日|にちようび}、{何|なに}をしましたか。', ro: 'Maruko-san, nichiyoubi, nani o shimashita ka.', vi: 'Marco, Chủ Nhật bạn đã làm gì?' },
        { who: 'マルコ', voice: 'ja-nam', text: '{公園|こうえん}へ{行|い}きました。{友達|ともだち}とサッカーをしました。', ro: 'Kouen e ikimashita. Tomodachi to sakkaa o shimashita.', vi: 'Tôi đi công viên. Tôi đá bóng với bạn.' },
        { who: 'パク', voice: 'ja-nu', text: 'へえ。それから？', ro: 'Hee. Sorekara?', vi: 'Ồ. Rồi sao nữa?' },
        { who: 'マルコ', voice: 'ja-nam', text: 'それから、{友達|ともだち}とレストランで{食事|しょくじ}しました。パクさんは？', ro: 'Sorekara, tomodachi to resutoran de shokuji shimashita. Paku-san wa?', vi: 'Sau đó tôi ăn ở nhà hàng với bạn. Còn Park?' },
        { who: 'パク', voice: 'ja-nu', text: '{私|わたし}はどこへも{行|い}きませんでした。うちで{洗濯|せんたく}しました。それから、{部屋|へや}を{掃除|そうじ}しました。', ro: 'Watashi wa doko e mo ikimasen deshita. Uchi de sentaku shimashita. Sorekara, heya o souji shimashita.', vi: 'Tôi chẳng đi đâu cả. Tôi giặt đồ ở nhà. Sau đó dọn phòng.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'そうですか。', ro: 'Sou desu ka.', vi: 'Thế à.' },
      ],
    },
    {
      t: 'listen',
      id: 'b5-ng-1b',
      title: '2. Daniel và Wang',
      note: 'Daniel đi đâu, làm gì? Wang đi đâu, làm gì, trong bao lâu?',
      lines: [
        { who: 'ワン', voice: 'ja-nu', text: 'ダニエルさん、{週末|しゅうまつ}、どこかへ{行|い}きましたか。', ro: 'Danieru-san, shuumatsu, dokoka e ikimashita ka.', vi: 'Daniel, cuối tuần anh có đi đâu không?' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'はい、{渋谷|しぶや}へ{行|い}きました。{渋谷|しぶや}のデパートで{服|ふく}を{買|か}いました。', ro: 'Hai, Shibuya e ikimashita. Shibuya no depaato de fuku o kaimashita.', vi: 'Có, tôi đi Shibuya. Tôi mua quần áo ở trung tâm thương mại Shibuya.' },
        { who: 'ワン', voice: 'ja-nu', text: '{映画|えいが}も{見|み}ましたか。', ro: 'Eiga mo mimashita ka.', vi: 'Anh có xem phim nữa không?' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'いいえ、{見|み}ませんでした。ワンさんは？', ro: 'Iie, mimasen deshita. Wan-san wa?', vi: 'Không, tôi không xem. Còn Wang?' },
        { who: 'ワン', voice: 'ja-nu', text: '{私|わたし}は{友達|ともだち}の{家|いえ}へ{行|い}きました。{友達|ともだち}とゲームをしました。', ro: 'Watashi wa tomodachi no ie e ikimashita. Tomodachi to geemu o shimashita.', vi: 'Tôi đến nhà bạn. Tôi chơi game với bạn.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'どのくらいしましたか。', ro: 'Dono kurai shimashita ka.', vi: 'Chơi bao lâu?' },
        { who: 'ワン', voice: 'ja-nu', text: '{5時間|ごじかん}くらいしました。', ro: 'Go-jikan kurai shimashita.', vi: 'Khoảng 5 tiếng.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'へえ、{5時間|ごじかん}！', ro: 'Hee, go-jikan!', vi: 'Chà, 5 tiếng!' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-ng-1-q',
      title: 'Câu hỏi bài 1',
      items: [
        { q: 'マルコさんは{日曜日|にちようび}、どこへ{行|い}きましたか。', options: ['ⓐ {友達|ともだち}の{家|いえ}', 'ⓑ {新宿|しんじゅく}', 'ⓓ {公園|こうえん}', 'ⓔ không đi đâu'], correct: 2, why: 'マルコ：**{公園|こうえん}**へ{行|い}きました。' },
        { q: 'マルコさんは{何|なに}をしましたか。(chọn đủ)', options: ['Đá bóng, sau đó ăn ở nhà hàng', 'Chơi game, sau đó xem phim', 'Đá bóng, sau đó dọn nhà', 'Mua sắm, sau đó ăn'], correct: 0, why: 'サッカーをしました。**それから**、レストランで{食事|しょくじ}しました。' },
        { q: 'パクさんはどこへ{行|い}きましたか。', options: ['{公園|こうえん}', '{渋谷|しぶや}', 'Không đi đâu cả', '{友達|ともだち}の{家|いえ}'], correct: 2, why: '**どこへも{行|い}きませんでした**。' },
        { q: 'パクさんは{何|なに}をしましたか。', options: ['く giặt đồ + う dọn phòng', 'か nấu ăn + き xem ti vi', 'お dùng máy tính', 'あ chơi game'], correct: 0, why: '{洗濯|せんたく}しました。それから、{部屋|へや}を{掃除|そうじ}しました。' },
        { q: 'ダニエルさんは{何|なに}をしましたか。', options: ['Mua quần áo và xem phim', 'Chỉ mua quần áo, không xem phim', 'Chỉ xem phim', 'Chơi game'], correct: 1, why: 'Bẫy: Wang hỏi "{映画|えいが}**も**？" → いいえ、{見|み}ませんでした.' },
        { q: 'ワンさんは{誰|だれ}と、どのくらいゲームをしましたか。', options: ['Một mình, 5 tiếng', 'Với bạn, 5 tiếng', 'Với bạn, 3 tiếng', 'Với Daniel, 5 tiếng'], correct: 1, why: '{友達|ともだち}**と**ゲームをしました。**{5時間|ごじかん}**くらい。' },
      ],
    },

    /* ── Bài 2: やってみよう 5-2 ── */
    { t: 'h', text: 'Bài 2 — Làm gì và thấy thế nào? (dạng やってみよう 5-2)' },
    {
      t: 'listen',
      id: 'b5-ng-2',
      title: 'Ba người kể ngày nghỉ',
      note: 'Mỗi người đã làm gì, thấy thế nào? Chú ý đuôi かった／くなかった／でした.',
      lines: [
        { who: 'アンナ', voice: 'ja-nu', text: 'マルコさん、{週末|しゅうまつ}、{何|なに}をしましたか。', ro: 'Maruko-san, shuumatsu, nani o shimashita ka.', vi: 'Marco, cuối tuần bạn làm gì?' },
        { who: 'マルコ', voice: 'ja-nam', text: '{友達|ともだち}と{山|やま}に{登|のぼ}りました。', ro: 'Tomodachi to yama ni noborimashita.', vi: 'Tôi leo núi với bạn.' },
        { who: 'アンナ', voice: 'ja-nu', text: 'どうでしたか。', ro: 'Dou deshita ka.', vi: 'Thế nào?' },
        { who: 'マルコ', voice: 'ja-nam', text: 'とても{大変|たいへん}でしたが、{景色|けしき}はきれいでした。', ro: 'Totemo taihen deshita ga, keshiki wa kirei deshita.', vi: 'Vất vả lắm, nhưng phong cảnh đẹp.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'パクさんは？', ro: 'Paku-san wa?', vi: 'Còn Park?' },
        { who: 'パク', voice: 'ja-nu', text: '{寮|りょう}で{友達|ともだち}の{誕生日|たんじょうび}のパーティーをしました。{人|ひと}が{多|おお}かったですから、にぎやかでした。とても{楽|たの}しかったです。', ro: 'Ryou de tomodachi no tanjoubi no paatii o shimashita. Hito ga ookatta desu kara, nigiyaka deshita. Totemo tanoshikatta desu.', vi: 'Tôi làm tiệc sinh nhật bạn ở ký túc xá. Vì đông người nên náo nhiệt lắm. Rất vui.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'それはよかったですね。アンナさんは？', ro: 'Sore wa yokatta desu ne. Anna-san wa?', vi: 'Vậy thì tốt quá. Còn Anna?' },
        { who: 'アンナ', voice: 'ja-nu', text: '{私|わたし}は{箱根|はこね}へ{行|い}きました。{温泉|おんせん}に{入|はい}りました。{気持|きも}ちがよかったです。', ro: 'Watashi wa Hakone e ikimashita. Onsen ni hairimashita. Kimochi ga yokatta desu.', vi: 'Tôi đi Hakone. Tôi tắm suối nước nóng. Dễ chịu lắm.' },
        { who: 'パク', voice: 'ja-nu', text: '{温泉|おんせん}は{高|たか}かったですか。', ro: 'Onsen wa takakatta desu ka.', vi: 'Suối nước nóng có đắt không?' },
        { who: 'アンナ', voice: 'ja-nu', text: 'いいえ、あまり{高|たか}くなかったです。', ro: 'Iie, amari takaku nakatta desu.', vi: 'Không, không đắt lắm.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-ng-2-q',
      title: 'Câu hỏi bài 2',
      items: [
        { q: 'マルコさんは{何|なに}をしましたか。', options: ['{温泉|おんせん}に{入|はい}りました', '{山|やま}に{登|のぼ}りました', 'パーティーをしました', '{服|ふく}を{見|み}ました'], correct: 1, why: '{友達|ともだち}と**{山|やま}に{登|のぼ}りました**。' },
        { q: 'マルコさんは どうでしたか。', options: ['{楽|たの}しかったです', '{大変|たいへん}でしたが、{景色|けしき}はきれいでした', 'おもしろくなかったです', '{暑|あつ}かったです'], correct: 1, why: 'とても**{大変|たいへん}でした**が、{景色|けしき}は**きれいでした**。' },
        { q: 'パクさんのパーティーは どうでしたか。', options: ['{静|しず}かでした', 'にぎやかで、{楽|たの}しかったです', '{人|ひと}が{少|すく}なかったです', 'あまり{楽|たの}しくなかったです'], correct: 1, why: '{人|ひと}が{多|おお}かったですから、**にぎやか**でした。とても**{楽|たの}しかった**です。' },
        { q: 'どうして にぎやかでしたか。', options: ['{誕生日|たんじょうび}でしたから', '{人|ひと}が{多|おお}かったですから', '{寮|りょう}でしたから', '{料理|りょうり}がおいしかったですから'], correct: 1, why: '**{人|ひと}が{多|おお}かったですから**、にぎやかでした (ポイント 47).' },
        { q: 'アンナさんは{箱根|はこね}で{何|なに}をしましたか。', options: ['{写真|しゃしん}を{撮|と}りました', '{温泉|おんせん}に{入|はい}りました', '{山|やま}に{登|のぼ}りました', '{買|か}い{物|もの}しました'], correct: 1, why: '**{温泉|おんせん}に{入|はい}りました**。{気持|きも}ちがよかったです。' },
        { q: '{温泉|おんせん}は{高|たか}かったですか。', options: ['はい、とても{高|たか}かったです', 'いいえ、あまり{高|たか}くなかったです', 'はい、{少|すこ}し{高|たか}かったです', 'Không nói'], correct: 1, why: 'いいえ、あまり**{高|たか}くなかった**です。' },
      ],
    },

    /* ── Bài 3: やってみよう 5-3 ── */
    { t: 'h', text: 'Bài 3 — Kỳ nghỉ tới làm gì? (dạng やってみよう 5-3)' },
    {
      t: 'listen',
      id: 'b5-ng-3',
      title: 'Anna và Marco trên tàu điện',
      note: 'Mỗi người kỳ nghỉ tới sẽ đi đâu, để làm gì? Vì sao?',
      lines: [
        { who: 'マルコ', voice: 'ja-nam', text: 'アンナさん、{今度|こんど}の{休|やす}みに{何|なに}をしますか。', ro: 'Anna-san, kondo no yasumi ni nani o shimasu ka.', vi: 'Anna, kỳ nghỉ tới bạn làm gì?' },
        { who: 'アンナ', voice: 'ja-nu', text: '{自転車|じてんしゃ}がほしいですから、デパートへ{自転車|じてんしゃ}を{買|か}いに{行|い}きます。', ro: 'Jitensha ga hoshii desu kara, depaato e jitensha o kai ni ikimasu.', vi: 'Vì tôi muốn có xe đạp nên tôi sẽ đến trung tâm thương mại để mua xe đạp.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'いいですね。{自転車|じてんしゃ}で{学校|がっこう}へ{来|き}ますか。', ro: 'Ii desu ne. Jitensha de gakkou e kimasu ka.', vi: 'Hay nhỉ. Bạn sẽ đi học bằng xe đạp à?' },
        { who: 'アンナ', voice: 'ja-nu', text: 'はい。それから、{日曜日|にちようび}は{友達|ともだち}とカレーを{作|つく}ります。マルコさんは？', ro: 'Hai. Sorekara, nichiyoubi wa tomodachi to karee o tsukurimasu. Maruko-san wa?', vi: 'Vâng. Còn Chủ Nhật tôi nấu cà ri với bạn. Còn Marco?' },
        { who: 'マルコ', voice: 'ja-nam', text: '{私|わたし}は{大阪|おおさか}へ{行|い}きます。{大阪|おおさか}の{友達|ともだち}に{会|あ}いに{行|い}きます。', ro: 'Watashi wa Oosaka e ikimasu. Oosaka no tomodachi ni ai ni ikimasu.', vi: 'Tôi đi Osaka. Tôi đi gặp người bạn ở Osaka.' },
        { who: 'アンナ', voice: 'ja-nu', text: '{大阪|おおさか}で{何|なに}をしたいですか。', ro: 'Oosaka de nani o shitai desu ka.', vi: 'Bạn muốn làm gì ở Osaka?' },
        { who: 'マルコ', voice: 'ja-nam', text: 'おいしい{料理|りょうり}を{食|た}べたいです。お{城|しろ}の{写真|しゃしん}も{撮|と}りたいです。', ro: 'Oishii ryouri o tabetai desu. Oshiro no shashin mo toritai desu.', vi: 'Tôi muốn ăn món ngon. Tôi cũng muốn chụp ảnh lâu đài.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-ng-3-q',
      title: 'Câu hỏi bài 3',
      items: [
        { q: 'アンナさんは{今度|こんど}の{休|やす}みに、どこへ{何|なに}をしに{行|い}きますか。', options: ['デパートへ{服|ふく}を{買|か}いに', 'デパートへ{自転車|じてんしゃ}を{買|か}いに', '{大阪|おおさか}へ{友達|ともだち}に{会|あ}いに', '{山|やま}へ{写真|しゃしん}を{撮|と}りに'], correct: 1, why: 'デパートへ**{自転車|じてんしゃ}を{買|か}いに**{行|い}きます。' },
        { q: 'どうしてですか。', options: ['{自転車|じてんしゃ}が{好|す}きですから', '{自転車|じてんしゃ}がほしいですから', '{学校|がっこう}が{大|おお}きいですから', '{暇|ひま}ですから'], correct: 1, why: '**{自転車|じてんしゃ}がほしいですから**。' },
        { q: 'アンナさんは{日曜日|にちようび}、{何|なに}をしますか。', options: ['{一人|ひとり}で{料理|りょうり}を{作|つく}ります', '{友達|ともだち}とカレーを{作|つく}ります', '{友達|ともだち}と{食事|しょくじ}に{行|い}きます', '{自転車|じてんしゃ}で{学校|がっこう}へ{行|い}きます'], correct: 1, why: '{友達|ともだち}**と**カレーを**{作|つく}ります**。' },
        { q: 'マルコさんは{大阪|おおさか}へ{何|なに}をしに{行|い}きますか。', options: ['{写真|しゃしん}を{撮|と}りに', '{友達|ともだち}に{会|あ}いに', '{買|か}い{物|もの}に', '{旅行|りょこう}に'], correct: 1, why: '**{友達|ともだち}に{会|あ}いに**{行|い}きます。' },
        { q: 'マルコさんは{大阪|おおさか}で{何|なに}をしたいですか。(chọn đủ)', options: ['Ăn món ngon + chụp ảnh lâu đài', 'Chỉ ăn món ngon', 'Tắm suối nước nóng', 'Mua máy ảnh'], correct: 0, why: 'おいしい{料理|りょうり}を{食|た}べたいです。お{城|しろ}の{写真|しゃしん}**も**{撮|と}りたいです。' },
      ],
    },

    /* ── Bài 4: もう一度聞こう ── */
    { t: 'h', text: 'Bài 4 — Hội thoại dài: Chủ Nhật của Park và Marco (dạng もう一度聞こう)' },
    {
      t: 'listen',
      id: 'b5-ng-4',
      title: 'Chủ Nhật của hai người',
      note: 'Hội thoại dài nhất bài. Nghe một lần lấy ý chính, rồi trả lời 6 câu hỏi.',
      lines: [
        { who: 'マルコ', voice: 'ja-nam', text: 'パクさん、{日曜日|にちようび}、{何|なに}をしましたか。', ro: 'Paku-san, nichiyoubi, nani o shimashita ka.', vi: 'Park, Chủ Nhật bạn đã làm gì?' },
        { who: 'パク', voice: 'ja-nu', text: 'ルームメイトと{横浜|よこはま}へ{行|い}きました。', ro: 'Ruumumeito to Yokohama e ikimashita.', vi: 'Tôi đi Yokohama với bạn cùng phòng.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'へえ。どうでしたか。', ro: 'Hee. Dou deshita ka.', vi: 'Ồ. Thế nào?' },
        { who: 'パク', voice: 'ja-nu', text: 'とても{楽|たの}しかったです。{海|うみ}の{近|ちか}くで、いろいろな{料理|りょうり}を{食|た}べました。', ro: 'Totemo tanoshikatta desu. Umi no chikaku de, iroiro na ryouri o tabemashita.', vi: 'Rất vui. Chúng tôi ăn nhiều món khác nhau ở gần biển.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'それはよかったですね。', ro: 'Sore wa yokatta desu ne.', vi: 'Vậy thì tốt quá nhỉ.' },
        { who: 'パク', voice: 'ja-nu', text: '{日曜日|にちようび}でしたから、{人|ひと}が{多|おお}かったです。マルコさんは{日曜日|にちようび}、どこかへ{行|い}きましたか。', ro: 'Nichiyoubi deshita kara, hito ga ookatta desu. Maruko-san wa nichiyoubi, dokoka e ikimashita ka.', vi: 'Vì là Chủ Nhật nên đông người lắm. Marco, Chủ Nhật bạn có đi đâu không?' },
        { who: 'マルコ', voice: 'ja-nam', text: 'はい。{美術館|びじゅつかん}へ{行|い}きました。', ro: 'Hai. Bijutsukan e ikimashita.', vi: 'Có. Tôi đi bảo tàng mỹ thuật.' },
        { who: 'パク', voice: 'ja-nu', text: 'へえ。{友達|ともだち}と{行|い}きましたか。', ro: 'Hee. Tomodachi to ikimashita ka.', vi: 'Ồ. Bạn đi với bạn bè à?' },
        { who: 'マルコ', voice: 'ja-nam', text: 'いいえ、{一人|ひとり}で{行|い}きました。{友達|ともだち}はアルバイトでしたから。', ro: 'Iie, hitori de ikimashita. Tomodachi wa arubaito deshita kara.', vi: 'Không, tôi đi một mình. Vì bạn tôi đi làm thêm.' },
        { who: 'パク', voice: 'ja-nu', text: 'そうですか。{美術館|びじゅつかん}はどうでしたか。', ro: 'Sou desu ka. Bijutsukan wa dou deshita ka.', vi: 'Thế à. Bảo tàng thế nào?' },
        { who: 'マルコ', voice: 'ja-nam', text: '{静|しず}かでした。{古|ふる}い{日本|にほん}の{絵|え}を{見|み}ました。とてもおもしろかったです。', ro: 'Shizuka deshita. Furui Nihon no e o mimashita. Totemo omoshirokatta desu.', vi: 'Yên tĩnh lắm. Tôi xem tranh cổ của Nhật. Rất thú vị.' },
        { who: 'パク', voice: 'ja-nu', text: 'マルコさんは{絵|え}が{好|す}きですか。', ro: 'Maruko-san wa e ga suki desu ka.', vi: 'Marco thích tranh à?' },
        { who: 'マルコ', voice: 'ja-nam', text: 'はい、{好|す}きです。また{行|い}きたいです。', ro: 'Hai, suki desu. Mata ikitai desu.', vi: 'Vâng, tôi thích. Tôi muốn đi lần nữa.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-ng-4-q',
      title: 'Câu hỏi bài 4',
      items: [
        { q: 'パクさんは{誰|だれ}と{横浜|よこはま}へ{行|い}きましたか。', options: ['{一人|ひとり}で', 'マルコさんと', 'ルームメイトと', '{家族|かぞく}と'], correct: 2, why: '**ルームメイトと**{横浜|よこはま}へ{行|い}きました。' },
        { q: '{横浜|よこはま}で{何|なに}をしましたか。', options: ['{海|うみ}で{写真|しゃしん}を{撮|と}りました', '{海|うみ}の{近|ちか}くでいろいろな{料理|りょうり}を{食|た}べました', '{美術館|びじゅつかん}へ{行|い}きました', '{買|か}い{物|もの}しました'], correct: 1, why: '{海|うみ}の{近|ちか}くで、**いろいろな{料理|りょうり}を{食|た}べました**。' },
        { q: 'どうして{人|ひと}が{多|おお}かったですか。', options: ['{天気|てんき}がよかったですから', '{日曜日|にちようび}でしたから', '{料理|りょうり}が{安|やす}かったですから', 'Không nói'], correct: 1, why: '**{日曜日|にちようび}でしたから**、{人|ひと}が{多|おお}かったです。' },
        { q: 'マルコさんは{誰|だれ}と{美術館|びじゅつかん}へ{行|い}きましたか。', options: ['{友達|ともだち}と', '{一人|ひとり}で', 'パクさんと', '{恋人|こいびと}と'], correct: 1, why: 'Bẫy: Park đoán "{友達|ともだち}と？" → いいえ、**{一人|ひとり}で**{行|い}きました。' },
        { q: 'どうしてですか。', options: ['{友達|ともだち}はアルバイトでしたから', '{友達|ともだち}は{風邪|かぜ}でしたから', '{一人|ひとり}が{好|す}きですから', '{友達|ともだち}は{忙|いそが}しくなかったですから'], correct: 0, why: '**{友達|ともだち}はアルバイトでしたから**。' },
        { q: '{美術館|びじゅつかん}はどうでしたか。', options: ['にぎやかでした。おもしろかったです。', '{静|しず}かでした。とてもおもしろかったです。', '{静|しず}かでした。おもしろくなかったです。', '{高|たか}かったです。'], correct: 1, why: '**{静|しず}かでした**。…とても**おもしろかった**です。' },
      ],
    },

    /* ── Bài 5: nghe từ chỉ thời gian ── */
    { t: 'h', text: 'Bài 5 — Nghe từ chỉ thời gian: khi nào? đã làm hay sẽ làm?' },
    {
      t: 'listen',
      id: 'b5-ng-5',
      title: 'Lịch của Nataphon',
      note: 'Mỗi câu: KHI NÀO, và việc đó ĐÃ làm (～ました) hay SẼ làm (～ます／～たいです)?',
      lines: [
        { who: 'ナタポン', voice: 'ja-nam', text: 'おととい、{友達|ともだち}と{新宿|しんじゅく}で{食事|しょくじ}しました。', ro: 'Ototoi, tomodachi to Shinjuku de shokuji shimashita.', vi: 'Hôm kia tôi ăn ở Shinjuku với bạn.' },
        { who: 'ナタポン', voice: 'ja-nam', text: '{昨日|きのう}は{風邪|かぜ}でしたから、{学校|がっこう}へ{行|い}きませんでした。', ro: 'Kinou wa kaze deshita kara, gakkou e ikimasen deshita.', vi: 'Hôm qua vì bị cảm nên tôi không đi học.' },
        { who: 'ナタポン', voice: 'ja-nam', text: '{今朝|けさ}、{7時|しちじ}に{起|お}きました。', ro: 'Kesa, shichi-ji ni okimashita.', vi: 'Sáng nay tôi dậy lúc 7 giờ.' },
        { who: 'ナタポン', voice: 'ja-nam', text: '{今晩|こんばん}、{図書館|としょかん}で{勉強|べんきょう}します。', ro: 'Konban, toshokan de benkyou shimasu.', vi: 'Tối nay tôi học ở thư viện.' },
        { who: 'ナタポン', voice: 'ja-nam', text: 'あさって、{美術館|びじゅつかん}へ{絵|え}を{見|み}に{行|い}きます。', ro: 'Asatte, bijutsukan e e o mi ni ikimasu.', vi: 'Ngày kia tôi đi bảo tàng xem tranh.' },
        { who: 'ナタポン', voice: 'ja-nam', text: '{来年|らいねん}、{北海道|ほっかいどう}へ{旅行|りょこう}に{行|い}きたいです。', ro: 'Rainen, Hokkaidou e ryokou ni ikitai desu.', vi: 'Sang năm tôi muốn đi du lịch Hokkaido.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-ng-5-q',
      title: 'Câu hỏi bài 5',
      items: [
        { q: 'Nataphon ăn ở Shinjuku khi nào?', options: ['{昨日|きのう}', 'おととい', 'あさって', '{今晩|こんばん}'], correct: 1, why: '**おととい** (hôm kia) — {食事|しょくじ}**しました** (đã làm).' },
        { q: 'Hôm qua Nataphon có đi học không? Vì sao?', options: ['Có, vì khoẻ', 'Không, vì bị cảm', 'Không, vì bận', 'Có, nhưng bị cảm'], correct: 1, why: '{風邪|かぜ}でしたから、{行|い}き**ませんでした**。' },
        { q: '{今朝|けさ}、{何時|なんじ}に{起|お}きましたか。', options: ['{6時|ろくじ}', '{7時|しちじ}', '{8時|はちじ}', '{9時|くじ}'], correct: 1, why: '**{7時|しちじ}**に{起|お}きました。' },
        { q: 'Việc nào là việc SẼ làm (chưa làm)?', options: ['Ăn ở Shinjuku', 'Dậy lúc 7 giờ', 'Đi bảo tàng xem tranh', 'Nghỉ học'], correct: 2, why: 'あさって、{見|み}に{行|い}き**ます** — đuôi ます + từ tương lai あさって.' },
        { q: '{来年|らいねん}、{何|なに}をしたいですか。', options: ['{北海道|ほっかいどう}へ{旅行|りょこう}に{行|い}きたい', '{美術館|びじゅつかん}へ{行|い}きたい', '{日本語|にほんご}を{勉強|べんきょう}したい', '{新宿|しんじゅく}で{食事|しょくじ}したい'], correct: 0, why: '{北海道|ほっかいどう}へ**{旅行|りょこう}に{行|い}きたい**です。' },
      ],
    },
  ],
};

/* ═══════════════════════════ 6. NÓI (dạng thi) ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b5-noi',
  kind: 'speaking',
  title: 'Luyện nói — câu hỏi thi về ngày nghỉ, cuối tuần, sở thích, mong muốn',
  goal: 'Trả lời trọn câu, đúng thì (quá khứ/hiện tại), đúng trợ từ mọi câu hỏi kiểu Bài 5 trong đề thi nói, kể được "cuối tuần vừa rồi của tôi" và đọc to trôi chảy đoạn văn kể chuyện quá khứ.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Nhắc lại cách chấm phần Talking (hướng dẫn ôn thi JPD113)',
      head: ['Lỗi', 'Bị trừ'],
      rows: [
        ['Sai làm đổi nghĩa cả câu (vd. hỏi どこ mà đáp việc làm; hỏi quá khứ mà đáp tương lai)', '**mất hết** điểm câu đó'],
        ['Sai không đổi nghĩa (vd. quên はい／いいえ)', 'tối đa 5 điểm'],
        ['Đúng ngữ pháp nhưng dùng sai từ vựng', 'chỉ được tối đa 3 điểm'],
        ['Sai **trợ từ** (が/を với 好き, に với 会う, と/で…)', '2 điểm'],
        ['Lưu loát, phát âm', '2 điểm mỗi câu'],
      ],
    },
    {
      t: 'note',
      title: 'Ba quy tắc vàng của Bài 5',
      items: [
        '**Nghe đuôi câu hỏi để chọn thì**: hỏi ～**ました**か／～**でした**か → đáp quá khứ; hỏi ～**ます**か → đáp hiện tại/tương lai. Nghe {昨日|きのう}／{週末|しゅうまつ}／{先週|せんしゅう} ở đầu câu cũng là tín hiệu quá khứ.',
        'Câu có/không (～ましたか, どこか～ましたか, ～かったですか) → **はい／いいえ trước**, rồi nói cả câu.',
        '**Nói thêm một câu** có それから hoặc から: giám thị thấy bạn dùng ngữ pháp Bài 5 → điểm lưu loát cao. Nhưng đừng nói quá dài để khỏi sai.',
      ],
    },
    {
      t: 'note',
      title: 'Nguồn câu hỏi',
      items: [
        'Ngân hàng thi JPD113 (personalQA của web — nhóm "Ngày nghỉ", "Sở thích"): やすみの{日|ひ} なにを しますか · やすみの{日|ひ} どこへ いきますか · しゅうまつ どこへ いきますか · にちようび なにを しますか · なにが すきですか · スポーツが すきですか · にほんの りょうりは どうですか · {日本語|にほんご}の べんきょうは どうですか.',
        'Ngân hàng JPD113 hiện có **chưa có câu nào ở quá khứ** (môn đó dừng ở Bài 3). Các câu quá khứ, cảm tưởng, mong muốn dưới đây soạn theo ポイント 37–47 và các mẫu 言ってみよう của sách — đúng dạng giám thị JPD123 sẽ hỏi khi thi tới Bài 5.',
      ],
    },

    /* ── Không tranh: quá khứ ── */
    { t: 'h', text: 'Câu hỏi KHÔNG có tranh (10 điểm) — ① Đã làm gì?' },
    {
      t: 'dialogue',
      title: 'Cuối tuần, hôm qua',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{週末|しゅうまつ}、{何|なに}をしましたか。', ro: 'Shuumatsu, nani o shimashita ka.', vi: 'Cuối tuần em đã làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{友達|ともだち}ときっさてんで{勉強|べんきょう}しました。それから、{映画|えいが}を{見|み}ました。', ro: 'Tomodachi to kissaten de benkyou shimashita. Sorekara, eiga o mimashita.', vi: 'Em học ở quán cà phê với bạn. Sau đó xem phim. (thay bằng việc thật của bạn)' },
        { who: 'Giám thị', role: 'examiner', text: '{昨日|きのう}、どこかへ{行|い}きましたか。', ro: 'Kinou, dokoka e ikimashita ka.', vi: 'Hôm qua em có đi đâu không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{学校|がっこう}へ{行|い}きました。', ro: 'Hai, gakkou e ikimashita.', vi: 'Có, em đi học.' },
        { who: 'Bạn', role: 'candidate', text: '（または）いいえ、どこへも{行|い}きませんでした。うちでテレビを{見|み}ました。', ro: '(Mata wa) Iie, doko e mo ikimasen deshita. Uchi de terebi o mimashita.', vi: '(Hoặc) Không, em không đi đâu cả. Em xem ti vi ở nhà.' },
        { who: 'Giám thị', role: 'examiner', text: '{日曜日|にちようび}、{誰|だれ}と{何|なに}をしましたか。', ro: 'Nichiyoubi, dare to nani o shimashita ka.', vi: 'Chủ Nhật em đã làm gì với ai?' },
        { who: 'Bạn', role: 'candidate', text: '{家族|かぞく}と{食事|しょくじ}しました。', ro: 'Kazoku to shokuji shimashita.', vi: 'Em đi ăn với gia đình.' },
        { who: 'Giám thị', role: 'examiner', text: '{昨日|きのう}、{勉強|べんきょう}しましたか。', ro: 'Kinou, benkyou shimashita ka.', vi: 'Hôm qua em có học bài không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{勉強|べんきょう}しました。{図書館|としょかん}で{日本語|にほんご}を{勉強|べんきょう}しました。', ro: 'Hai, benkyou shimashita. Toshokan de Nihongo o benkyou shimashita.', vi: 'Có, em có học. Em học tiếng Nhật ở thư viện.' },
        { who: 'Giám thị', role: 'examiner', text: '{今朝|けさ}、{何|なに}を{食|た}べましたか。', ro: 'Kesa, nani o tabemashita ka.', vi: 'Sáng nay em đã ăn gì?' },
        { who: 'Bạn', role: 'candidate', text: 'パンを{食|た}べました。それから、コーヒーを{飲|の}みました。', ro: 'Pan o tabemashita. Sorekara, koohii o nomimashita.', vi: 'Em ăn bánh mì. Sau đó uống cà phê.' },
        { who: 'Giám thị', role: 'examiner', text: '{昨日|きのう}の{晩|ばん}、{何時|なんじ}に{寝|ね}ましたか。', ro: 'Kinou no ban, nan-ji ni nemashita ka.', vi: 'Tối qua em ngủ lúc mấy giờ?' },
        { who: 'Bạn', role: 'candidate', text: '{11時|じゅういちじ}に{寝|ね}ました。', ro: 'Juuichi-ji ni nemashita.', vi: 'Em ngủ lúc 11 giờ.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy "cùng câu, khác thì" — ngân hàng JPD113 hỏi hiện tại, JPD123 hỏi quá khứ',
      items: [
        'やすみの{日|ひ}、{何|なに}を**します**か (thói quen) → {友達|ともだち}とサッカーを**します**。',
        '{週末|しゅうまつ}、{何|なに}を**しました**か (đã xong) → {友達|ともだち}とサッカーを**しました**。',
        'Đáp nhầm thì (hỏi しましたか mà đáp します) là lỗi "đổi nghĩa" — có thể mất trọn câu. **Nhắc lại đúng đuôi của giám thị** là cách an toàn nhất.',
      ],
    },

    /* ── Không tranh: cảm tưởng ── */
    { t: 'h', text: '② Thế nào? — hỏi cảm tưởng' },
    {
      t: 'dialogue',
      title: 'どうでしたか／どうですか',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{週末|しゅうまつ}はどうでしたか。', ro: 'Shuumatsu wa dou deshita ka.', vi: 'Cuối tuần của em thế nào?' },
        { who: 'Bạn', role: 'candidate', text: 'とても{楽|たの}しかったです。', ro: 'Totemo tanoshikatta desu.', vi: 'Rất vui ạ.' },
        { who: 'Giám thị', role: 'examiner', text: '{昨日|きのう}の{天気|てんき}はどうでしたか。', ro: 'Kinou no tenki wa dou deshita ka.', vi: 'Thời tiết hôm qua thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{天気|てんき}はよかったですが、{暑|あつ}かったです。', ro: 'Tenki wa yokatta desu ga, atsukatta desu.', vi: 'Trời đẹp nhưng nóng ạ.' },
        { who: 'Giám thị', role: 'examiner', text: '{日本語|にほんご}のテストはどうでしたか。', ro: 'Nihongo no tesuto wa dou deshita ka.', vi: 'Bài kiểm tra tiếng Nhật thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{少|すこ}し{難|むずか}しかったです。', ro: 'Sukoshi muzukashikatta desu.', vi: 'Hơi khó ạ.' },
        { who: 'Giám thị', role: 'examiner', text: '{日本語|にほんご}の{勉強|べんきょう}はどうですか。', ro: 'Nihongo no benkyou wa dou desu ka.', vi: 'Việc học tiếng Nhật thế nào? (ngân hàng JPD113 — hiện tại)' },
        { who: 'Bạn', role: 'candidate', text: '{難|むずか}しいですが、とても{楽|たの}しいです。', ro: 'Muzukashii desu ga, totemo tanoshii desu.', vi: 'Khó nhưng rất vui ạ.' },
        { who: 'Giám thị', role: 'examiner', text: '{日本|にほん}の{料理|りょうり}はどうですか。', ro: 'Nihon no ryouri wa dou desu ka.', vi: 'Món ăn Nhật thế nào? (ngân hàng JPD113)' },
        { who: 'Bạn', role: 'candidate', text: 'とてもおいしいです。', ro: 'Totemo oishii desu.', vi: 'Rất ngon ạ.' },
        { who: 'Giám thị', role: 'examiner', text: '{昨日|きのう}は{忙|いそが}しかったですか。', ro: 'Kinou wa isogashikatta desu ka.', vi: 'Hôm qua em có bận không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、あまり{忙|いそが}しくなかったです。{暇|ひま}でした。', ro: 'Iie, amari isogashiku nakatta desu. Hima deshita.', vi: 'Không, không bận lắm ạ. Em rảnh.' },
      ],
    },
    {
      t: 'note',
      title: 'Đáp "thế nào?" — đừng quên đuôi',
      items: [
        'どう**でした**か → tính từ **quá khứ**: {楽|たの}し**かった**です, {大変|たいへん}**でした**. どう**です**か → hiện tại: おいしい**です**.',
        'Câu nhỏ an toàn thuộc lòng: **とても{楽|たの}しかったです** · **{少|すこ}し{難|むずか}しかったです** · **{気持|きも}ちがよかったです** · **あまり{忙|いそが}しくなかったです**.',
      ],
    },

    /* ── Không tranh: thích, muốn ── */
    { t: 'h', text: '③ Thích gì, muốn gì, vì sao?' },
    {
      t: 'dialogue',
      title: '好き・ほしい・たい・どうして',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{何|なに}が{好|す}きですか。', ro: 'Nani ga suki desu ka.', vi: 'Em thích gì? (ngân hàng JPD113)' },
        { who: 'Bạn', role: 'candidate', text: '{音楽|おんがく}が{好|す}きです。', ro: 'Ongaku ga suki desu.', vi: 'Em thích âm nhạc.' },
        { who: 'Giám thị', role: 'examiner', text: 'スポーツが{好|す}きですか。', ro: 'Supootsu ga suki desu ka.', vi: 'Em có thích thể thao không? (ngân hàng JPD113)' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{好|す}きです。サッカーが{好|す}きです。', ro: 'Hai, suki desu. Sakkaa ga suki desu.', vi: 'Có, em thích. Em thích bóng đá.' },
        { who: 'Bạn', role: 'candidate', text: '（または）いいえ、あまり{好|す}きじゃありません。', ro: '(Mata wa) Iie, amari suki ja arimasen.', vi: '(Hoặc) Không, em không thích lắm.' },
        { who: 'Giám thị', role: 'examiner', text: '{今|いま}、{何|なに}がほしいですか。', ro: 'Ima, nani ga hoshii desu ka.', vi: 'Bây giờ em muốn có gì?' },
        { who: 'Bạn', role: 'candidate', text: '{新|あたら}しいパソコンがほしいです。', ro: 'Atarashii pasokon ga hoshii desu.', vi: 'Em muốn có máy tính mới.' },
        { who: 'Giám thị', role: 'examiner', text: '{今度|こんど}の{休|やす}みに{何|なに}をしたいですか。', ro: 'Kondo no yasumi ni nani o shitai desu ka.', vi: 'Kỳ nghỉ tới em muốn làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{家族|かぞく}とダナンへ{旅行|りょこう}に{行|い}きたいです。', ro: 'Kazoku to Danan e ryokou ni ikitai desu.', vi: 'Em muốn đi du lịch Đà Nẵng với gia đình.' },
        { who: 'Giám thị', role: 'examiner', text: 'どこへ{行|い}きたいですか。', ro: 'Doko e ikitai desu ka.', vi: 'Em muốn đi đâu?' },
        { who: 'Bạn', role: 'candidate', text: '{日本|にほん}へ{行|い}きたいです。', ro: 'Nihon e ikitai desu.', vi: 'Em muốn đi Nhật.' },
        { who: 'Giám thị', role: 'examiner', text: 'どうして{日本語|にほんご}を{勉強|べんきょう}しますか。', ro: 'Doushite Nihongo o benkyou shimasu ka.', vi: 'Tại sao em học tiếng Nhật?' },
        { who: 'Bạn', role: 'candidate', text: '{日本|にほん}の{会社|かいしゃ}で{働|はたら}きたいですから。', ro: 'Nihon no kaisha de hatarakitai desu kara.', vi: 'Vì em muốn làm việc ở công ty Nhật.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Ngân hàng JPD113 — nhóm "Ngày nghỉ" (hiện tại)',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'やすみの{日|ひ}、{何|なに}をしますか。', ro: 'Yasumi no hi, nani o shimasu ka.', vi: 'Ngày nghỉ em làm gì?' },
        { who: 'Bạn', role: 'candidate', text: 'うちで{洗濯|せんたく}します。それから、{友達|ともだち}に{会|あ}います。', ro: 'Uchi de sentaku shimasu. Sorekara, tomodachi ni aimasu.', vi: 'Em giặt đồ ở nhà. Sau đó gặp bạn.' },
        { who: 'Giám thị', role: 'examiner', text: 'やすみの{日|ひ}、どこへ{行|い}きますか。', ro: 'Yasumi no hi, doko e ikimasu ka.', vi: 'Ngày nghỉ em đi đâu?' },
        { who: 'Bạn', role: 'candidate', text: 'デパートへ{買|か}い{物|もの}に{行|い}きます。', ro: 'Depaato e kaimono ni ikimasu.', vi: 'Em đi trung tâm thương mại mua sắm.' },
        { who: 'Giám thị', role: 'examiner', text: 'しゅうまつ、どこへ{行|い}きますか。', ro: 'Shuumatsu, doko e ikimasu ka.', vi: 'Cuối tuần em đi đâu?' },
        { who: 'Bạn', role: 'candidate', text: '{図書館|としょかん}へ{本|ほん}を{借|か}りに{行|い}きます。', ro: 'Toshokan e hon o kari ni ikimasu.', vi: 'Em đi thư viện mượn sách.' },
        { who: 'Giám thị', role: 'examiner', text: 'にちようび、{何|なに}をしますか。', ro: 'Nichiyoubi, nani o shimasu ka.', vi: 'Chủ Nhật em làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{友達|ともだち}とサッカーをします。', ro: 'Tomodachi to sakkaa o shimasu.', vi: 'Em đá bóng với bạn.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy lớn nhất: 何を vs どこへ',
      items: [
        '{何|なに}を～ますか → đáp **VIỆC** (động từ). どこへ～ますか → đáp **NƠI**. Hai câu nghe rất giống nhau, đi liền nhau trong đề (personalQA câu 36/37).',
        'Muốn "ăn chắc" cả hai: nói **nơi + mục đích** bằng ポイント 42: デパートへ{買|か}い{物|もの}に{行|い}きます — trả lời đúng cho cả どこ lẫn {何|なに}.',
      ],
    },

    /* ── Có tranh ── */
    { t: 'h', text: 'Câu hỏi CÓ tranh (15 điểm/câu)' },
    {
      t: 'p',
      text: 'Đề thật cho một tranh; giám thị hỏi một câu về tranh. Dưới đây là 3 kiểu tranh của Bài 5 (dữ liệu tranh viết thành bảng) và mọi câu giám thị có thể hỏi. Chú ý: tranh kể chuyện **đã xảy ra** thì trả lời bằng **quá khứ**.',
    },
    {
      t: 'table',
      caption: 'Tranh A — Cuối tuần của マリヤムさん (tuần trước)',
      head: ['Ngày', 'Ở đâu', 'Với ai', 'Làm gì', 'Cảm tưởng'],
      rows: [
        ['{土曜日|どようび}', '{新宿|しんじゅく}のデパート', '{友達|ともだち}', 'mua quần áo ({服|ふく}) — {3,000円|さんぜんえん}', '{安|やす}かった'],
        ['{日曜日|にちようび}', 'うち (không đi đâu)', 'một mình', 'giặt đồ → dọn phòng', '{忙|いそが}しかった'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh A — câu hỏi & trả lời mẫu',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'マリヤムさんは{土曜日|どようび}、どこへ{行|い}きましたか。', ro: 'Mariyamu-san wa doyoubi, doko e ikimashita ka.', vi: 'Thứ Bảy Mariyam đã đi đâu?' },
        { who: 'Bạn', role: 'candidate', text: 'マリヤムさんは{土曜日|どようび}、{新宿|しんじゅく}のデパートへ{行|い}きました。', ro: 'Mariyamu-san wa doyoubi, Shinjuku no depaato e ikimashita.', vi: 'Thứ Bảy Mariyam đã đi trung tâm thương mại ở Shinjuku.' },
        { who: 'Giám thị', role: 'examiner', text: '{誰|だれ}と{行|い}きましたか。', ro: 'Dare to ikimashita ka.', vi: 'Cô ấy đi với ai?' },
        { who: 'Bạn', role: 'candidate', text: '{友達|ともだち}と{行|い}きました。', ro: 'Tomodachi to ikimashita.', vi: 'Cô ấy đi với bạn.' },
        { who: 'Giám thị', role: 'examiner', text: 'デパートで{何|なに}をしましたか。', ro: 'Depaato de nani o shimashita ka.', vi: 'Ở trung tâm thương mại cô ấy đã làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{服|ふく}を{買|か}いました。', ro: 'Fuku o kaimashita.', vi: 'Cô ấy mua quần áo.' },
        { who: 'Giám thị', role: 'examiner', text: 'その{服|ふく}はいくらでしたか。', ro: 'Sono fuku wa ikura deshita ka.', vi: 'Bộ quần áo đó bao nhiêu tiền? (いくら + でした)' },
        { who: 'Bạn', role: 'candidate', text: '{3,000円|さんぜんえん}でした。{安|やす}かったです。', ro: 'Sanzen en deshita. Yasukatta desu.', vi: '3.000 yên. Rẻ ạ.' },
        { who: 'Giám thị', role: 'examiner', text: '{服|ふく}は{高|たか}かったですか。', ro: 'Fuku wa takakatta desu ka.', vi: 'Quần áo có đắt không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{高|たか}くなかったです。{安|やす}かったです。', ro: 'Iie, takaku nakatta desu. Yasukatta desu.', vi: 'Không, không đắt. Rẻ ạ.' },
        { who: 'Giám thị', role: 'examiner', text: 'マリヤムさんは{日曜日|にちようび}、どこかへ{行|い}きましたか。', ro: 'Mariyamu-san wa nichiyoubi, dokoka e ikimashita ka.', vi: 'Chủ Nhật Mariyam có đi đâu không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、どこへも{行|い}きませんでした。', ro: 'Iie, doko e mo ikimasen deshita.', vi: 'Không, cô ấy không đi đâu cả.' },
        { who: 'Giám thị', role: 'examiner', text: '{日曜日|にちようび}、{何|なに}をしましたか。', ro: 'Nichiyoubi, nani o shimashita ka.', vi: 'Chủ Nhật cô ấy đã làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{洗濯|せんたく}しました。それから、{部屋|へや}を{掃除|そうじ}しました。', ro: 'Sentaku shimashita. Sorekara, heya o souji shimashita.', vi: 'Cô ấy giặt đồ. Sau đó dọn phòng.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh B — Một ngày Chủ Nhật của ナタポンさん (4 khung theo giờ)',
      head: ['Giờ', 'Việc', 'Ghi chú'],
      rows: [
        ['{9時|くじ}', 'dậy ({起|お}きます)', '—'],
        ['{10時|じゅうじ}', 'giặt đồ ({洗濯|せんたく}します)', '—'],
        ['{12時|じゅうにじ}', 'ăn trưa ở nhà hàng với người yêu', 'món cá — ngon'],
        ['{午後|ごご}', 'đi bảo tàng mỹ thuật xem tranh', 'yên tĩnh, thú vị'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh B — câu hỏi & trả lời mẫu',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'ナタポンさんは{日曜日|にちようび}、{何時|なんじ}に{起|お}きましたか。', ro: 'Natapon-san wa nichiyoubi, nan-ji ni okimashita ka.', vi: 'Chủ Nhật Nataphon dậy lúc mấy giờ?' },
        { who: 'Bạn', role: 'candidate', text: '{9時|くじ}に{起|お}きました。', ro: 'Ku-ji ni okimashita.', vi: 'Anh ấy dậy lúc 9 giờ.' },
        { who: 'Giám thị', role: 'examiner', text: 'それから、{何|なに}をしましたか。', ro: 'Sorekara, nani o shimashita ka.', vi: 'Sau đó anh ấy làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{10時|じゅうじ}に{洗濯|せんたく}しました。', ro: 'Juu-ji ni sentaku shimashita.', vi: 'Lúc 10 giờ anh ấy giặt đồ.' },
        { who: 'Giám thị', role: 'examiner', text: '{誰|だれ}と{昼|ひる}ご{飯|はん}を{食|た}べましたか。', ro: 'Dare to hirugohan o tabemashita ka.', vi: 'Anh ấy ăn trưa với ai?' },
        { who: 'Bạn', role: 'candidate', text: '{恋人|こいびと}と{食|た}べました。', ro: 'Koibito to tabemashita.', vi: 'Anh ấy ăn với người yêu.' },
        { who: 'Giám thị', role: 'examiner', text: '{何|なに}を{食|た}べましたか。どうでしたか。', ro: 'Nani o tabemashita ka. Dou deshita ka.', vi: 'Anh ấy ăn gì? Thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{魚|さかな}の{料理|りょうり}を{食|た}べました。おいしかったです。', ro: 'Sakana no ryouri o tabemashita. Oishikatta desu.', vi: 'Anh ấy ăn món cá. Ngon lắm.' },
        { who: 'Giám thị', role: 'examiner', text: '{午後|ごご}、どこへ{何|なに}をしに{行|い}きましたか。', ro: 'Gogo, doko e nani o shi ni ikimashita ka.', vi: 'Buổi chiều anh ấy đi đâu để làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{美術館|びじゅつかん}へ{絵|え}を{見|み}に{行|い}きました。', ro: 'Bijutsukan e e o mi ni ikimashita.', vi: 'Anh ấy đi bảo tàng mỹ thuật để xem tranh.' },
        { who: 'Giám thị', role: 'examiner', text: '{美術館|びじゅつかん}はにぎやかでしたか。', ro: 'Bijutsukan wa nigiyaka deshita ka.', vi: 'Bảo tàng có náo nhiệt không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、にぎやかじゃありませんでした。{静|しず}かでした。', ro: 'Iie, nigiyaka ja arimasen deshita. Shizuka deshita.', vi: 'Không, không náo nhiệt. Yên tĩnh ạ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh C — Kế hoạch kỳ nghỉ tới của アンナさん (bong bóng suy nghĩ)',
      head: ['Muốn có', 'Đi đâu', 'Để làm gì', 'Với ai', 'Thích'],
      rows: [['{自転車|じてんしゃ}', '{秋葉原|あきはばら}', 'mua xe đạp', '{一人|ひとり}で', 'アニメ'], ['—', '{箱根|はこね}', 'tắm suối nước nóng', '{家族|かぞく}', '{温泉|おんせん}']],
    },
    {
      t: 'dialogue',
      title: 'Tranh C — câu hỏi & trả lời mẫu',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'アンナさんは{何|なに}がほしいですか。', ro: 'Anna-san wa nani ga hoshii desu ka.', vi: 'Anna muốn có gì?' },
        { who: 'Bạn', role: 'candidate', text: '{自転車|じてんしゃ}がほしいです。', ro: 'Jitensha ga hoshii desu.', vi: 'Cô ấy muốn có xe đạp. (trả lời theo tranh — chấp nhận ほしいです)' },
        { who: 'Giám thị', role: 'examiner', text: 'アンナさんは{秋葉原|あきはばら}へ{何|なに}をしに{行|い}きますか。', ro: 'Anna-san wa Akihabara e nani o shi ni ikimasu ka.', vi: 'Anna đi Akihabara để làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{自転車|じてんしゃ}を{買|か}いに{行|い}きます。', ro: 'Jitensha o kai ni ikimasu.', vi: 'Cô ấy đi mua xe đạp.' },
        { who: 'Giám thị', role: 'examiner', text: '{箱根|はこね}へ{誰|だれ}と{行|い}きますか。', ro: 'Hakone e dare to ikimasu ka.', vi: 'Cô ấy đi Hakone với ai?' },
        { who: 'Bạn', role: 'candidate', text: '{家族|かぞく}と{行|い}きます。', ro: 'Kazoku to ikimasu.', vi: 'Cô ấy đi với gia đình.' },
        { who: 'Giám thị', role: 'examiner', text: '{箱根|はこね}で{何|なに}をしたいですか。', ro: 'Hakone de nani o shitai desu ka.', vi: 'Ở Hakone cô ấy muốn làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{温泉|おんせん}に{入|はい}りたいです。', ro: 'Onsen ni hairitai desu.', vi: 'Cô ấy muốn tắm suối nước nóng.' },
        { who: 'Giám thị', role: 'examiner', text: 'アンナさんは{何|なに}が{好|す}きですか。', ro: 'Anna-san wa nani ga suki desu ka.', vi: 'Anna thích gì?' },
        { who: 'Bạn', role: 'candidate', text: 'アニメと{温泉|おんせん}が{好|す}きです。', ro: 'Anime to onsen ga suki desu.', vi: 'Cô ấy thích phim hoạt hình và suối nước nóng.' },
      ],
    },
    {
      t: 'note',
      title: 'Trả lời về người trong tranh',
      items: [
        'Giám thị hỏi "アンナさんは～たいですか／ほしいですか" theo tranh → cứ trả lời **～たいです／～がほしいです** như giám thị hỏi. (Tiếng Nhật chuẩn có cách nói riêng cho người thứ ba — học sau; khi thi, lặp lại mẫu của giám thị là an toàn.)',
        'Câu kể **việc đã xong** trong tranh (Tranh A, B) → ～ました. Câu về **kế hoạch** (Tranh C) → ～ます／～たいです.',
      ],
    },

    /* ── Bài nói mẫu ── */
    { t: 'h', text: 'Bài nói mẫu: 私の週末 — Cuối tuần vừa rồi của tôi' },
    {
      t: 'p',
      text: 'Thuộc một đoạn ~6 câu như dưới đây: nó trả lời được cùng lúc {何|なに}をしましたか／どこへ／{誰|だれ}と／どうでしたか／それから？. Thay phần in đậm bằng chuyện thật của bạn.',
    },
    {
      t: 'examples',
      items: [
        { en: '{先週|せんしゅう}の{土曜日|どようび}、{友達|ともだち}とハノイの{美術館|びじゅつかん}へ{行|い}きました。', ro: 'Senshuu no doyoubi, tomodachi to Hanoi no bijutsukan e ikimashita.', vi: 'Thứ Bảy tuần trước tôi đi bảo tàng mỹ thuật Hà Nội với bạn.' },
        { en: '{古|ふる}い{絵|え}を{見|み}ました。とてもおもしろかったです。', ro: 'Furui e o mimashita. Totemo omoshirokatta desu.', vi: 'Tôi xem tranh cổ. Rất thú vị.' },
        { en: 'それから、レストランでフォーを{食|た}べました。おいしかったです。', ro: 'Sorekara, resutoran de foo o tabemashita. Oishikatta desu.', vi: 'Sau đó tôi ăn phở ở nhà hàng. Ngon lắm.' },
        { en: '{日曜日|にちようび}はどこへも{行|い}きませんでした。{雨|あめ}でしたから。', ro: 'Nichiyoubi wa doko e mo ikimasen deshita. Ame deshita kara.', vi: 'Chủ Nhật tôi không đi đâu cả. Vì trời mưa.' },
        { en: 'うちで{洗濯|せんたく}しました。それから、{日本語|にほんご}を{勉強|べんきょう}しました。', ro: 'Uchi de sentaku shimashita. Sorekara, Nihongo o benkyou shimashita.', vi: 'Tôi giặt đồ ở nhà. Sau đó học tiếng Nhật.' },
        { en: '{楽|たの}しい{週末|しゅうまつ}でした。{今度|こんど}の{休|やす}みは{海|うみ}へ{行|い}きたいです。', ro: 'Tanoshii shuumatsu deshita. Kondo no yasumi wa umi e ikitai desu.', vi: 'Đó là một cuối tuần vui. Kỳ nghỉ tới tôi muốn đi biển.' },
      ],
    },

    /* ── Đọc to ── */
    { t: 'h', text: 'Đọc to — Reading (40 điểm)' },
    {
      t: 'p',
      text: 'Đề đọc dài khoảng 100–110 ký tự: **4 từ chữ Hán** gạch chân (12đ), **4 từ katakana** (12đ), còn lại hiragana (16đ, đọc sai một ký tự trừ 0,2đ). Có 30 giây chuẩn bị. Bốn đoạn dưới đây viết mới theo đúng khuôn đó, kể chuyện **quá khứ**, chỉ dùng từ Bài 1–5. Tắt furigana khi đã quen.',
    },
    {
      t: 'examples',
      items: [
        {
          en: '{先週|せんしゅう}の{日曜日|にちようび}、ルームメイトと{新宿|しんじゅく}へ{行|い}きました。デパートでかばんを{買|か}いました。それから、レストランでカレーをたべました。とてもおいしかったです。よるはうちでテレビをみました。たのしかったです。',
          ro: 'Senshuu no nichiyoubi, ruumumeito to Shinjuku e ikimashita. Depaato de kaban o kaimashita. Sorekara, resutoran de karee o tabemashita. Totemo oishikatta desu. Yoru wa uchi de terebi o mimashita. Tanoshikatta desu.',
          vi: 'Chủ Nhật tuần trước tôi đi Shinjuku với bạn cùng phòng. Tôi mua túi ở trung tâm thương mại. Sau đó ăn cà ri ở nhà hàng. Rất ngon. Buổi tối tôi xem ti vi ở nhà. Vui lắm.',
        },
        {
          en: '{昨日|きのう}は{天気|てんき}がよかったですから、ルームメイトとやまにのぼりました。やまのけしきはきれいでした。カメラで{写真|しゃしん}をたくさんとりました。それから、{温泉|おんせん}にはいりました。きもちがよかったです。レストランのパンとコーヒーもおいしかったです。',
          ro: 'Kinou wa tenki ga yokatta desu kara, ruumumeito to yama ni noborimashita. Yama no keshiki wa kirei deshita. Kamera de shashin o takusan torimashita. Sorekara, onsen ni hairimashita. Kimochi ga yokatta desu. Resutoran no pan to koohii mo oishikatta desu.',
          vi: 'Hôm qua trời đẹp nên tôi leo núi với bạn cùng phòng. Phong cảnh trên núi đẹp. Tôi chụp nhiều ảnh bằng máy ảnh. Sau đó tắm suối nước nóng. Dễ chịu lắm. Bánh mì và cà phê của nhà hàng cũng ngon.',
        },
        {
          en: 'わたしはパソコンがほしいです。{今度|こんど}のやすみに、あきはばらへパソコンをかいにいきます。{来年|らいねん}、{日本|にほん}へいきたいです。{日本|にほん}でアニメのしごとをしたいです。ゲームもすきですから、ゲームのかいしゃもいいです。',
          ro: 'Watashi wa pasokon ga hoshii desu. Kondo no yasumi ni, Akihabara e pasokon o kai ni ikimasu. Rainen, Nihon e ikitai desu. Nihon de anime no shigoto o shitai desu. Geemu mo suki desu kara, geemu no kaisha mo ii desu.',
          vi: 'Tôi muốn có máy tính. Kỳ nghỉ tới tôi sẽ đi Akihabara mua máy tính. Sang năm tôi muốn đi Nhật. Tôi muốn làm công việc về hoạt hình ở Nhật. Vì tôi cũng thích game nên công ty game cũng được.',
        },
        {
          en: 'おとといは{風邪|かぜ}でしたから、どこへもいきませんでした。{部屋|へや}でねました。{昨日|きのう}はひまでした。{友達|ともだち}とスーパーへいきました。やさいとたまごとパンをかいました。それから、ルームメイトとスープをつくりました。',
          ro: 'Ototoi wa kaze deshita kara, doko e mo ikimasen deshita. Heya de nemashita. Kinou wa hima deshita. Tomodachi to suupaa e ikimashita. Yasai to tamago to pan o kaimashita. Sorekara, ruumumeito to suupu o tsukurimashita.',
          vi: 'Hôm kia tôi bị cảm nên không đi đâu cả. Tôi ngủ trong phòng. Hôm qua tôi rảnh. Tôi đi siêu thị với bạn. Tôi mua rau, trứng và bánh mì. Sau đó nấu súp với bạn cùng phòng.',
        },
      ],
    },
    {
      t: 'note',
      title: 'Chỗ dễ đọc sai trong bốn đoạn trên',
      items: [
        '**{先週|せんしゅう}** (sen-shuu, trường âm) · **{昨日|きのう}** (ki-no-u) · **{今度|こんど}** · **{来年|らいねん}** · **{風邪|かぜ}** · **{部屋|へや}** — các từ thời gian và từ đọc đặc biệt, rất hay nằm ở vị trí gạch chân.',
        'Đuôi quá khứ đọc rõ từng âm: おいし**かった**です (oi-shi-kat-ta-de-su — có âm ngắt っ), いき**ませんでした** (i-ki-ma-sen-de-shi-ta).',
        'Katakana có trường âm ー: ルームメイト (ruu-mu-mei-to), デパート (de-paa-to), カレー (ka-ree), コーヒー (koo-hii), スーパー (suu-paa), スープ (suu-pu), ゲーム (gee-mu).',
        'きもちがよかったです — đừng đọc ~~きもちがいかったです~~.',
      ],
    },

    { t: 'h', text: 'Tự ghi âm — trả lời không nhìn đáp án' },
    {
      t: 'speak',
      id: 'b5-noi-ghi-am',
      part: '1',
      questions: [
        'しゅうまつ、なにをしましたか。',
        'きのう、どこかへいきましたか。',
        'にちようび、だれとなにをしましたか。',
        'しゅうまつはどうでしたか。',
        'きのうのてんきはどうでしたか。',
        'にほんごのテストはどうでしたか。',
        'なにがすきですか。',
        'いま、なにがほしいですか。',
        'こんどのやすみに、なにをしたいですか。',
        'やすみのひ、どこへいきますか。',
        'どうしてにほんごをべんきょうしますか。',
        'せんしゅうのしゅうまつ、なにをしましたか。どうでしたか。',
      ],
    },
  ],
};

/* ═══════════════════════════ 7. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b5-bai-tap',
  kind: 'homework',
  title: 'Bài tập về nhà — Bài 5 (có đáp án)',
  goal: 'Tự dịch, chia quá khứ, chọn trợ từ và ghép câu Bài 5 không cần nhìn bài học.',
  minutes: 45,
  blocks: [
    {
      t: 'p',
      text: 'Gõ tiếng Nhật bằng bộ gõ (gõ romaji, máy đổi sang kana). Chữ Hán hay kana đều được chấp nhận; có/không dấu 、。 đều được. Nếu máy chấm sai mà bạn tin mình đúng, bấm **Hỏi gia sư** ngay dưới câu đó.',
    },
    {
      t: 'quiz',
      id: 'b5-bt-dich',
      title: 'Dịch sang tiếng Nhật',
      kind: 'translate',
      grammar: 'Vました／ませんでした · イA‑かったです／くなかったです · ナA・N でした／じゃありませんでした · Nが好きです · Nがほしいです · Vたいです · へ Vに行きます · どこかへ · どうして～から · それから · Nと',
      items: [
        { q: 'Hôm qua tôi đã đi thư viện.', answers: ans('{昨日|きのう}、{図書館|としょかん}へ{行|い}きました。', '{昨日|きのう}、{図書館|としょかん}に{行|い}きました。'), hint: '昨日(きのう) · 図書館 へ · 行きました — ポイント 37' },
        { q: 'Sáng nay tôi không ăn sáng.', answers: ans('{今朝|けさ}、{朝|あさ}ご{飯|はん}を{食|た}べませんでした。'), hint: '今朝(けさ) · 朝ご飯 を · 食べませんでした' },
        { q: 'Cuối tuần bạn đã làm gì?', answers: ans('{週末|しゅうまつ}、{何|なに}をしましたか。', '{週末|しゅうまつ}は{何|なに}をしましたか。', '{週末|しゅうまつ}に{何|なに}をしましたか。'), hint: '週末(しゅうまつ) · 何を · しましたか' },
        { q: 'Tôi đã dọn phòng. Sau đó giặt đồ.', answers: ans('{部屋|へや}を{掃除|そうじ}しました。それから、{洗濯|せんたく}しました。', '{部屋|へや}を{掃除|そうじ}しました。それから、{洗濯|せんたく}をしました。'), hint: '部屋(へや) を 掃除(そうじ)しました · それから · 洗濯(せんたく) — ポイント 45' },
        { q: 'Chuyến du lịch rất vui.', answers: ans('{旅行|りょこう}はとても{楽|たの}しかったです。'), hint: '旅行 は とても 楽しかったです — ポイント 38' },
        { q: 'Bộ phim không hay lắm.', answers: ans('{映画|えいが}はあまりおもしろくなかったです。', 'その{映画|えいが}はあまりおもしろくなかったです。'), hint: 'あまり + くなかったです' },
        { q: 'Hôm qua trời mưa.', answers: ans('{昨日|きのう}は{雨|あめ}でした。', '{昨日|きのう}、{雨|あめ}でした。'), hint: 'N + でした' },
        { q: 'Bài kiểm tra không dễ.', answers: ans('テストは{簡単|かんたん}じゃありませんでした。'), hint: 'ナA + じゃありませんでした' },
        { q: 'Suối nước nóng dễ chịu lắm.', answers: ans('{温泉|おんせん}は{気持|きも}ちがよかったです。', '{温泉|おんせん}はとても{気持|きも}ちがよかったです。'), hint: '気持ちがいい → よかったです' },
        { q: 'Tôi thích phim hoạt hình Nhật.', answers: ans('{私|わたし}は{日本|にほん}のアニメが{好|す}きです。', '{日本|にほん}のアニメが{好|す}きです。'), hint: 'N が 好き(すき)です — ポイント 39' },
        { q: 'Tôi ghét dọn dẹp.', answers: ans('{私|わたし}は{掃除|そうじ}が{嫌|きら}いです。', '{掃除|そうじ}が{嫌|きら}いです。'), hint: '掃除(そうじ) が 嫌い(きらい)です' },
        { q: 'Tôi muốn có xe đạp mới.', answers: ans('{新|あたら}しい{自転車|じてんしゃ}がほしいです。', '{私|わたし}は{新|あたら}しい{自転車|じてんしゃ}がほしいです。'), hint: '新しい 自転車(じてんしゃ) が ほしいです — ポイント 40' },
        { q: 'Kỳ nghỉ tới tôi muốn leo núi.', answers: ans('{今度|こんど}の{休|やす}みに{山|やま}に{登|のぼ}りたいです。', '{今度|こんど}の{休|やす}みは{山|やま}に{登|のぼ}りたいです。'), hint: '今度の休みに · 山 に 登りたいです — ポイント 41' },
        { q: 'Tôi muốn gặp bạn.', answers: ans('{友達|ともだち}に{会|あ}いたいです。', '{私|わたし}は{友達|ともだち}に{会|あ}いたいです。'), hint: '友達 に 会いたいです (に, không phải を)' },
        { q: 'Tôi đi thư viện để mượn sách.', answers: ans('{図書館|としょかん}へ{本|ほん}を{借|か}りに{行|い}きます。', '{図書館|としょかん}に{本|ほん}を{借|か}りに{行|い}きます。'), hint: 'Nơi へ + 本を借り に + 行きます — ポイント 42' },
        { q: 'Cuối tuần tôi đi Shinjuku mua sắm.', answers: ans('{週末|しゅうまつ}、{新宿|しんじゅく}へ{買|か}い{物|もの}に{行|い}きます。', '{週末|しゅうまつ}、{新宿|しんじゅく}に{買|か}い{物|もの}に{行|い}きます。', '{週末|しゅうまつ}、しんじゅくへかいものにいきます。'), hint: '新宿 へ 買い物 に 行きます' },
        { q: 'Hôm qua bạn có đi đâu không?', answers: ans('{昨日|きのう}、どこかへ{行|い}きましたか。', '{昨日|きのう}、どこか{行|い}きましたか。', '{昨日|きのう}、どこかに{行|い}きましたか。'), hint: 'どこか（へ） — ポイント 43' },
        { q: 'Không, tôi chẳng đi đâu cả.', answers: ans('いいえ、どこへも{行|い}きませんでした。', 'いいえ、どこも{行|い}きませんでした。', 'いいえ、どこにも{行|い}きませんでした。'), hint: 'どこへも + ませんでした' },
        { q: 'Tại sao bạn không mua?', answers: ans('どうして{買|か}いませんでしたか。'), hint: 'どうして — ポイント 44' },
        { q: 'Vì đắt.', answers: ans('{高|たか}かったですから。', '{高|たか}いですから。'), hint: '高かったです + から — ポイント 47' },
        { q: 'Vì bị cảm nên tôi không đi học.', answers: ans('{風邪|かぜ}でしたから、{学校|がっこう}へ{行|い}きませんでした。', '{風邪|かぜ}でしたから、{学校|がっこう}に{行|い}きませんでした。'), hint: '風邪(かぜ)でしたから、学校へ 行きませんでした' },
        { q: 'Tôi đã đi Hakone với gia đình.', answers: ans('{家族|かぞく}と{箱根|はこね}へ{行|い}きました。', '{家族|かぞく}と{箱根|はこね}に{行|い}きました。', '{家族|かぞく}とはこねへ{行|い}きました。'), hint: '家族(かぞく) と — ポイント 46' },
        { q: 'Tôi xem tranh ở bảo tàng mỹ thuật một mình.', answers: ans('{一人|ひとり}で{美術館|びじゅつかん}で{絵|え}を{見|み}ました。', '{美術館|びじゅつかん}で{一人|ひとり}で{絵|え}を{見|み}ました。'), hint: '一人で · 美術館 で · 絵(え) を 見ました' },
        { q: 'Tôi gặp bạn ở Shibuya.', answers: ans('{渋谷|しぶや}で{友達|ともだち}に{会|あ}いました。', 'しぶやで{友達|ともだち}に{会|あ}いました。'), hint: 'Nơi で · 友達 に 会いました' },
      ],
    },
    {
      t: 'quiz',
      id: 'b5-bt-chia',
      title: 'Chia quá khứ — viết đúng dạng được yêu cầu',
      kind: 'fill',
      grammar: 'V: ます → ました／ませんでした · イA: い → かったです／くなかったです (いい → よかった) · ナA/N: でした／じゃありませんでした',
      items: [
        { q: '{行|い}きます → quá khứ (+)', answers: ans('{行|い}きました') },
        { q: '{食|た}べます → quá khứ (−)', answers: ans('{食|た}べませんでした') },
        { q: '{会|あ}います → quá khứ (+)', answers: ans('{会|あ}いました') },
        { q: '{掃除|そうじ}します → quá khứ (−)', answers: ans('{掃除|そうじ}しませんでした') },
        { q: '{来|き}ます → quá khứ (+)', answers: ans('{来|き}ました') },
        { q: '{撮|と}ります → muốn làm (～たいです)', answers: ans('{撮|と}りたいです') },
        { q: '{借|か}ります → đi để làm (～に{行|い}きます)', answers: ans('{借|か}りに{行|い}きます') },
        { q: '{楽|たの}しい → quá khứ (+)', answers: ans('{楽|たの}しかったです'), hint: 'い → かったです' },
        { q: '{高|たか}い → quá khứ (−)', answers: ans('{高|たか}くなかったです') },
        { q: 'いい → quá khứ (+)', answers: ans('よかったです'), hint: 'いい chia từ よい' },
        { q: '{気持|きも}ちがいい → quá khứ (−)', answers: ans('{気持|きも}ちがよくなかったです') },
        { q: '{忙|いそが}しい → quá khứ (+)', answers: ans('{忙|いそが}しかったです') },
        { q: '{暇|ひま} (な) → quá khứ (+)', answers: ans('{暇|ひま}でした') },
        { q: '{簡単|かんたん} (な) → quá khứ (−)', answers: ans('{簡単|かんたん}じゃありませんでした') },
        { q: 'きれい (な) → quá khứ (+)', answers: ans('きれいでした'), hint: 'きれい là tính từ な!' },
        { q: '{雨|あめ} (N) → quá khứ (+)', answers: ans('{雨|あめ}でした') },
        { q: '{休|やす}み (N) → quá khứ (−)', answers: ans('{休|やす}みじゃありませんでした') },
        { q: '{行|い}きます → không muốn (～たくないです)', answers: ans('{行|い}きたくないです') },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-bt-tro-tu',
      title: 'Chọn trợ từ đúng',
      items: [
        { q: '{友達|ともだち}＿{映画|えいが}を{見|み}ました。 (cùng với bạn)', options: ['と', 'で', 'に', 'を'], correct: 0, why: 'Làm cùng ai → **と** (ポイント 46).' },
        { q: '{一人|ひとり}＿{行|い}きました。', options: ['と', 'で', 'に', 'が'], correct: 1, why: 'Một mình = {一人|ひとり}**で**.' },
        { q: '{新宿|しんじゅく}＿{行|い}きました。', options: ['で', 'を', 'へ', 'と'], correct: 2, why: 'Đi đến đâu → **へ** (hoặc に).' },
        { q: '{新宿|しんじゅく}＿{服|ふく}を{買|か}いました。', options: ['へ', 'で', 'に', 'を'], correct: 1, why: 'Nơi diễn ra hành động mua → **で**.' },
        { q: 'デパートへ{服|ふく}を{買|か}い＿{行|い}きます。', options: ['へ', 'で', 'に', 'を'], correct: 2, why: 'Mục đích: V(ます) + **に** + {行|い}きます (ポイント 42).' },
        { q: '{私|わたし}はカメラ＿ほしいです。', options: ['を', 'が', 'に', 'で'], correct: 1, why: 'ほしい đi với **が** (ポイント 40).' },
        { q: '{私|わたし}は{温泉|おんせん}＿{好|す}きです。', options: ['を', 'に', 'が', 'と'], correct: 2, why: '{好|す}き đi với **が** (ポイント 39).' },
        { q: '{友達|ともだち}＿{会|あ}いました。', options: ['を', 'に', 'で', 'へ'], correct: 1, why: '{会|あ}います đi với **に**.' },
        { q: '{山|やま}＿{登|のぼ}りました。', options: ['を', 'に', 'で', 'と'], correct: 1, why: '{登|のぼ}ります đi với **に** (sách: {山|やま}に{登|のぼ}ります).' },
        { q: '{温泉|おんせん}＿{入|はい}りたいです。', options: ['を', 'が', 'に', 'で'], correct: 2, why: '{入|はい}ります đi với **に**; sang ～たい vẫn giữ に.' },
        { q: 'コーヒー＿{飲|の}みたいです。', options: ['を／が', 'に', 'で', 'へ'], correct: 0, why: 'を giữ nguyên, hoặc đổi thành が (sách p.273).' },
        { q: '{昨日|きのう}、どこか＿{行|い}きましたか。', options: ['へ', 'を', 'が', 'で'], correct: 0, why: 'どこか**へ**{行|い}きましたか (へ có thể bỏ).' },
        { q: 'いいえ、どこへ＿{行|い}きませんでした。', options: ['は', 'も', 'か', 'が'], correct: 1, why: 'どこへ**も** + phủ định = chẳng đi đâu cả.' },
        { q: '{雨|あめ}でした＿、どこへも{行|い}きませんでした。', options: ['が', 'から', 'と', 'で'], correct: 1, why: 'Lý do + **から** (ポイント 47).' },
        { q: '{昨日|きのう}＿、{映画|えいが}を{見|み}ました。', options: ['に', 'で', '(không có gì)', 'へ'], correct: 2, why: '{昨日|きのう} là từ thời gian tương đối → **không** thêm に.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-bt-chon-dang',
      title: 'Chọn dạng đúng',
      items: [
        { q: '{先週|せんしゅう}のパーティーは＿＿。', options: ['{楽|たの}しいでした', '{楽|たの}しかったです', '{楽|たの}しかったでした', '{楽|たの}しくでした'], correct: 1, why: 'い → **かったです**.' },
        { q: '{町|まち}は＿＿。 (đã náo nhiệt)', options: ['にぎやかでした', 'にぎやかったです', 'にぎやかかったです', 'にぎやかいでした'], correct: 0, why: 'にぎやか là tính từ な → **でした**.' },
        { q: '{昨日|きのう}は{天気|てんき}が＿＿。 (đẹp)', options: ['いかったです', 'よかったです', 'いいでした', 'よいでした'], correct: 1, why: 'いい → **よかったです**.' },
        { q: '{今晩|こんばん}、{映画|えいが}を＿＿。', options: ['{見|み}ました', '{見|み}ます', '{見|み}ませんでした', '{見|み}たかったです'], correct: 1, why: '{今晩|こんばん} = tối nay (chưa xảy ra) → **{見|み}ます**.' },
        { q: '{日本|にほん}へ＿＿です。 (muốn đi)', options: ['{行|い}きます', '{行|い}きたい', '{行|い}くたい', '{行|い}きますたい'], correct: 1, why: 'ます → **たい**です.' },
        { q: '{今日|きょう}は{勉強|べんきょう}＿＿です。 (không muốn học)', options: ['したくない', 'しないたい', 'したいない', 'しませんたい'], correct: 0, why: 'たい → **たくない**です.' },
        { q: 'テストは あまり＿＿。', options: ['{難|むずか}しかったです', '{難|むずか}しくなかったです', '{難|むずか}しいでした', '{難|むずか}しいです'], correct: 1, why: 'あまり đi với **phủ định**.' },
        { q: '{嫌|きら}い → quá khứ khẳng định:', options: ['{嫌|きら}かったです', '{嫌|きら}いでした', '{嫌|きら}いかったです', '{嫌|きら}くなかったです'], correct: 1, why: '{嫌|きら}い là **tính từ な** (dù kết thúc bằng い) → {嫌|きら}い**でした**.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-bt-tu-vung',
      title: 'Từ vựng',
      items: [
        { q: '「おととい」 là:', options: ['Ngày kia', 'Hôm kia', 'Hôm qua', 'Tuần trước'], correct: 1, why: 'おととい = hôm kia; あさって = ngày kia.' },
        { q: '「{去年|きょねん}」 là:', options: ['Năm nay', 'Năm sau', 'Năm ngoái', 'Tháng trước'], correct: 2, why: '{去年|きょねん} = năm ngoái; {今年|ことし} = năm nay; {来年|らいねん} = năm sau.' },
        { q: 'Tối nay:', options: ['{今朝|けさ}', '{今晩|こんばん}', '{今度|こんど}', '{今年|ことし}'], correct: 1, why: '**{今晩|こんばん}**.' },
        { q: '「{恋人|こいびと}」 là:', options: ['Bạn cùng phòng', 'Gia đình', 'Người yêu', 'Bạn bè'], correct: 2, why: 'こいびと = người yêu.' },
        { q: 'Bạn cùng phòng:', options: ['{友達|ともだち}', 'ルームメイト', '{家族|かぞく}', 'クラスメイト'], correct: 1, why: '**ルームメイト**.' },
        { q: '「{洗濯|せんたく}します」 là:', options: ['Dọn dẹp', 'Giặt giũ', 'Nấu ăn', 'Mua sắm'], correct: 1, why: 'せんたく = giặt; そうじ = dọn dẹp.' },
        { q: '「{借|か}ります」 là:', options: ['Mua', 'Cho mượn', 'Vay, mượn', 'Trả'], correct: 2, why: 'かります = mượn (vào). Mua = かいます.' },
        { q: '「{撮|と}ります」 dùng với:', options: ['{写真|しゃしん}', '{服|ふく}', '{天気|てんき}', '{家族|かぞく}'], correct: 0, why: '{写真|しゃしん}を**{撮|と}ります** = chụp ảnh.' },
        { q: '「{景色|けしき}」 là:', options: ['Bức tranh', 'Phong cảnh', 'Thời tiết', 'Màu sắc'], correct: 1, why: 'けしき = phong cảnh; {絵|え} = tranh.' },
        { q: '「{暇|ひま}」 là:', options: ['Bận', 'Rảnh', 'Vất vả', 'Dễ'], correct: 1, why: 'ひま = rảnh; いそがしい = bận.' },
        { q: '「{大変|たいへん}でした」 là:', options: ['Đã rất vui', 'Đã rất vất vả', 'Đã rất dễ', 'Đã rất rẻ'], correct: 1, why: 'たいへん = vất vả, khổ sở.' },
        { q: 'Muốn hỏi "tại sao":', options: ['どうして', 'どこか', 'どのくらい', 'どう'], correct: 0, why: '**どうして** = tại sao; どう = thế nào.' },
        { q: '「{自転車|じてんしゃ}」 là:', options: ['Ô tô', 'Xe đạp', 'Tàu điện', 'Xe buýt'], correct: 1, why: 'じてんしゃ = xe đạp; くるま = ô tô.' },
        { q: '「{美術館|びじゅつかん}」 là:', options: ['Thư viện', 'Bảo tàng mỹ thuật', 'Nhà thi đấu', 'Trung tâm thương mại'], correct: 1, why: 'びじゅつかん = bảo tàng mỹ thuật.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-bt-hoi-dap',
      title: 'Chọn câu trả lời đúng cho câu hỏi',
      items: [
        { q: '{週末|しゅうまつ}、{何|なに}をしましたか。', options: ['{新宿|しんじゅく}です。', '{友達|ともだち}と{買|か}い{物|もの}しました。', '{楽|たの}しかったです。', 'はい、しました。'], correct: 1, why: 'Hỏi {何|なに}を → đáp **việc** đã làm.' },
        { q: '{昨日|きのう}、どこかへ{行|い}きましたか。', options: ['{渋谷|しぶや}へ{行|い}きます。', 'はい、{渋谷|しぶや}へ{行|い}きました。', 'いいえ、どこかへ{行|い}きませんでした。', 'はい、どこかへ{行|い}きました。'], correct: 1, why: 'はい + nơi cụ thể + ました.' },
        { q: '{誰|だれ}と{行|い}きましたか。', options: ['{一人|ひとり}で{行|い}きました。', '{一人|ひとり}と{行|い}きました。', 'バスで{行|い}きました。', '{箱根|はこね}へ{行|い}きました。'], correct: 0, why: 'Một mình = {一人|ひとり}**で**.' },
        { q: '{旅行|りょこう}はどうでしたか。', options: ['{箱根|はこね}へ{行|い}きました。', 'とても{楽|たの}しかったです。', '{家族|かぞく}と{行|い}きました。', 'はい、{旅行|りょこう}でした。'], correct: 1, why: 'どうでしたか → **cảm tưởng** ở quá khứ.' },
        { q: 'どうして{来|き}ませんでしたか。', options: ['{忙|いそが}しかったですから。', '{忙|いそが}しいでした。', 'はい、{忙|いそが}しかったです。', '{来|き}ませんでした。'], correct: 0, why: 'Lý do + **から**.' },
        { q: '{今|いま}、{何|なに}がほしいですか。', options: ['{旅行|りょこう}したいです。', 'カメラがほしいです。', 'カメラをほしいです。', 'カメラを{買|か}いました。'], correct: 1, why: 'N **が** ほしいです.' },
        { q: '{今度|こんど}の{休|やす}みに{何|なに}をしたいですか。', options: ['{温泉|おんせん}に{入|はい}りたいです。', '{温泉|おんせん}に{入|はい}りました。', '{温泉|おんせん}がほしいです。', '{温泉|おんせん}です。'], correct: 0, why: 'Hỏi ～たいですか → đáp **～たいです**.' },
        { q: '{映画|えいが}は{楽|たの}しかったですか。 (không vui)', options: ['いいえ、{楽|たの}しかったです。', 'いいえ、{楽|たの}しくなかったです。', 'いいえ、{楽|たの}しいじゃありませんでした。', 'はい、{楽|たの}しくなかったです。'], correct: 1, why: 'いいえ + **くなかったです**.' },
        { q: '{上野|うえの}へ{何|なに}をしに{行|い}きますか。', options: ['{上野|うえの}へ{行|い}きます。', '{美術館|びじゅつかん}へ{絵|え}を{見|み}に{行|い}きます。', '{絵|え}を{見|み}ました。', '{友達|ともだち}と{行|い}きます。'], correct: 1, why: '{何|なに}をしに → đáp **V(ます)に{行|い}きます**.' },
      ],
    },
    {
      t: 'build',
      id: 'b5-bt-ghep',
      title: 'Ghép câu — kể ngày nghỉ',
      items: [
        { vi: 'Thứ Bảy tuần trước tôi đi bảo tàng mỹ thuật với người yêu.', chips: ['{先週|せんしゅう}の{土曜日|どようび}、', '{恋人|こいびと}', 'と', '{美術館|びじゅつかん}', 'へ', '{行|い}きました', 'で', 'に'], answer: ['{先週|せんしゅう}の{土曜日|どようび}、', '{恋人|こいびと}', 'と', '{美術館|びじゅつかん}', 'へ', '{行|い}きました'], ro: 'Senshuu no doyoubi, koibito to bijutsukan e ikimashita.' },
        { vi: 'Phong cảnh trên núi rất đẹp.', chips: ['{山|やま}', 'の', '{景色|けしき}', 'は', 'とても', 'きれいでした', 'きれかったです'], answer: ['{山|やま}', 'の', '{景色|けしき}', 'は', 'とても', 'きれいでした'], ro: 'Yama no keshiki wa totemo kirei deshita.' },
        { vi: 'Vì trời đẹp nên rất dễ chịu.', chips: ['{天気|てんき}', 'が', 'よかったですから、', '{気持|きも}ち', 'が', 'よかったです', 'いかったです'], answer: ['{天気|てんき}', 'が', 'よかったですから、', '{気持|きも}ち', 'が', 'よかったです'], ro: 'Tenki ga yokatta desu kara, kimochi ga yokatta desu.' },
        { vi: 'Tôi muốn đi Hakone để tắm suối nước nóng.', chips: ['{箱根|はこね}', 'へ', '{温泉|おんせん}', 'に', '{入|はい}り', 'に', '{行|い}きたいです', 'を'], answer: ['{箱根|はこね}', 'へ', '{温泉|おんせん}', 'に', '{入|はい}り', 'に', '{行|い}きたいです'], ro: 'Hakone e onsen ni hairi ni ikitai desu.' },
        { vi: 'Bây giờ bạn muốn có gì?', chips: ['{今|いま}、', '{何|なに}', 'が', 'ほしいですか', 'を', 'たいですか'], answer: ['{今|いま}、', '{何|なに}', 'が', 'ほしいですか'], ro: 'Ima, nani ga hoshii desu ka.' },
        { vi: 'Hôm qua tôi ăn cơm tối một mình.', chips: ['{昨日|きのう}、', '{一人|ひとり}', 'で', '{晩|ばん}ご{飯|はん}', 'を', '{食|た}べました', 'と'], answer: ['{昨日|きのう}、', '{一人|ひとり}', 'で', '{晩|ばん}ご{飯|はん}', 'を', '{食|た}べました'], ro: 'Kinou, hitori de bangohan o tabemashita.' },
        { vi: 'Tôi đã không mua vì máy tính đắt.', chips: ['パソコン', 'は', '{高|たか}かったですから、', '{買|か}いませんでした', '{高|たか}いでしたから、', '{買|か}いました'], answer: ['パソコン', 'は', '{高|たか}かったですから、', '{買|か}いませんでした'], ro: 'Pasokon wa takakatta desu kara, kaimasen deshita.' },
        { vi: 'Tôi đã gặp bạn. Sau đó xem phim.', chips: ['{友達|ともだち}に{会|あ}いました。', 'それから、', '{映画|えいが}を{見|み}ました。', 'どうして、', '{友達|ともだち}を{会|あ}いました。'], answer: ['{友達|ともだち}に{会|あ}いました。', 'それから、', '{映画|えいが}を{見|み}ました。'], ro: 'Tomodachi ni aimashita. Sorekara, eiga o mimashita.' },
        { vi: 'Bạn thích phim kiểu gì?', chips: ['どんな', '{映画|えいが}', 'が', '{好|す}きですか', 'を', 'どう'], answer: ['どんな', '{映画|えいが}', 'が', '{好|す}きですか'], ro: 'Donna eiga ga suki desu ka.' },
        { vi: 'Hôm kia tôi không học bài.', chips: ['おととい、', '{勉強|べんきょう}', 'しませんでした', 'しました', 'に'], answer: ['おととい、', '{勉強|べんきょう}', 'しませんでした'], ro: 'Ototoi, benkyou shimasen deshita.' },
      ],
    },
  ],
};

export const BAI_5: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, KANJI, NGHE, NOI, BAI_TAP];
