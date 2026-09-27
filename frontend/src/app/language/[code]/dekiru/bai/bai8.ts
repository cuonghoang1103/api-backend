/**
 * Bài 8 — 大切な人 (Người quan trọng) · できる日本語 初級 · JPD113/JPD123.
 *
 * Ngữ pháp: ポイント 72–80 (Vテ形います — nơi ở / trạng thái · Vテ形います — nghề,
 * việc làm thường xuyên · N1はN2がAです · イA-くて／ナA・Nで · N1にN2をあげます ·
 * N1にN2をもらいます · N1がN2をくれます · N(人)が(～人)います · [～人]で)
 * + bảng đếm ～人・～匹 (表 p.287) + bảng gọi người thân 親族名称 (表 p.289).
 * Từ vựng: Bài 8 KHÔNG có danh sách của cô (danh sách cô phát chỉ tới Bài 7) — chuẩn là
 * trang ことば p.151 của sách: đủ 81 từ (8-1: 30 · 8-2: 28 · 8-3: 23) + 3 từ ở cuối
 * trang もう一度聞こう p.152 (経済 · 結婚します · 素敵) = 84 mục.
 * Hội thoại, câu ví dụ, bài đọc, kịch bản nghe: VIẾT MỚI theo đúng tình huống của sách
 * (xem ../SOAN-BAI.md). Tên người thân, nghề nghiệp, nơi ở trong bài là tự đặt.
 *
 * Vai (theo bai1.ts): nữ = アンナ, パク, ワン, マリヤム, メアリー, 山口 (role a / c,
 * giọng ja-nu) · nam = ダニエル, ナタポン, マルコ, カルロス (role b, giọng ja-nam).
 * Giám thị / cô giáo — examiner, người học — candidate.
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
  id: 'b8-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — 大切な人: gia đình, bạn bè, người thế nào, quà tặng',
  goal: 'Kể được nhà có mấy người, ai sống ở đâu, làm nghề gì; tả được một người (cao, tóc dài, hiền, giỏi…); bàn nên tặng bạn quà gì và kể được ai đã tặng mình cái gì.',
  minutes: 40,
  blocks: [
    {
      t: 'note',
      title: 'Học xong bài 8 bạn làm được (できる)',
      items: [
        '**① {家族|かぞく}・{友達|ともだち}** — nói gia đình, bạn bè **có mấy người**, **sống ở đâu**, sống với ai, **làm nghề gì / đang làm gì**.',
        '**② こんな{人|ひと}** — tả người thân, bạn bè **là người thế nào**: ngoại hình (cao, tóc dài, mắt to), tính cách (hiền, vui tính, chăm chỉ), giỏi / kém cái gì.',
        '**③ プレゼント** — **bàn với bạn** nên tặng quà gì cho một người bạn; **kể quà mình đã nhận** (ai tặng, dịp gì).',
        '**できる！** — kể cho bạn cùng lớp về **một người quan trọng** với mình: người đó là ai, thế nào, và một kỷ niệm với họ.',
      ],
    },
    {
      t: 'table',
      caption: 'Bức tranh chung của bài — ba chủ đề, chín ポイント',
      head: ['Chủ đề', 'Câu then chốt', 'Romaji', 'ポイント'],
      rows: [
        ['① Nơi ở, nghề', '{横浜|よこはま}に{住|す}んでいます。{姉|あね}はデパートで{働|はたら}いています。', 'Yokohama ni sunde imasu. Ane wa depaato de hataraite imasu.', '72, 73'],
        ['① Mấy người', '{姉|あね}が{1人|ひとり}います。{兄|あに}と{2人|ふたり}で{住|す}んでいます。', 'Ane ga hitori imasu. Ani to futari de sunde imasu.', '79, 80'],
        ['② Người thế nào', '{父|ちち}は{背|せ}が{高|たか}いです。{背|せ}が{高|たか}くて、{髪|かみ}が{短|みじか}い{人|ひと}です。', 'Chichi wa se ga takai desu. Se ga takakute, kami ga mijikai hito desu.', '74, 75'],
        ['③ Quà', '{花|はな}をあげます。{姉|あね}にもらいました。{友達|ともだち}がCDをくれました。', 'Hana o agemasu. Ane ni moraimashita. Tomodachi ga shiidii o kuremashita.', '76, 77, 78'],
      ],
    },

    /* ── ① 家族・友達 ── */
    { t: 'h', text: '① {家族|かぞく}・{友達|ともだち} — Gia đình, bạn bè: sống ở đâu, mấy người, làm gì' },
    {
      t: 'p',
      text: 'Tình huống: trên đường đi học về và trên tàu điện, các bạn hỏi nhau **đang sống ở đâu**, **sống với ai**, **có anh chị em không**, rồi đưa ảnh gia đình ra kể **ai làm nghề gì**. Chú ý: nói về nhà MÌNH dùng {父|ちち}・{母|はは}・{姉|あね}…, hỏi về nhà BẠN dùng お{父|とう}さん・お{母|かあ}さん・お{姉|ねえ}さん….',
    },
    {
      t: 'dialogue',
      title: 'Đang sống ở đâu? — sống với ai?',
      lines: [
        { who: 'アンナ', role: 'a', text: 'ナタポンさんはどこに{住|す}んでいますか。', ro: 'Natapon-san wa doko ni sunde imasu ka.', vi: 'Natapon đang sống ở đâu?' },
        { who: 'ナタポン', role: 'b', text: '{上野|うえの}に{住|す}んでいます。{駅|えき}から{近|ちか}いですよ。', ro: 'Ueno ni sunde imasu. Eki kara chikai desu yo.', vi: 'Mình sống ở Ueno. Gần ga lắm đấy.' },
        { who: 'アンナ', role: 'a', text: 'いいですね。{1人|ひとり}で{住|す}んでいますか。', ro: 'Ii desu ne. Hitori de sunde imasu ka.', vi: 'Hay nhỉ. Bạn sống một mình à?' },
        { who: 'ナタポン', role: 'b', text: 'いいえ、{兄|あに}と{2人|ふたり}で{住|す}んでいます。アンナさんは？', ro: 'Iie, ani to futari de sunde imasu. Anna-san wa?', vi: 'Không, mình sống hai người với anh trai. Còn Anna?' },
        { who: 'アンナ', role: 'a', text: '{私|わたし}は{横浜|よこはま}に{住|す}んでいます。{友達|ともだち}と{3人|さんにん}で{住|す}んでいます。', ro: 'Watashi wa Yokohama ni sunde imasu. Tomodachi to sannin de sunde imasu.', vi: 'Mình sống ở Yokohama. Mình sống ba người với bạn.' },
        { who: 'ナタポン', role: 'b', text: 'そうですか。にぎやかですね。', ro: 'Sou desu ka. Nigiyaka desu ne.', vi: 'Vậy à. Vui (đông vui) nhỉ.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Có anh chị em không? — có thú cưng không?',
      lines: [
        { who: 'ダニエル', role: 'b', text: 'パクさん、{兄弟|きょうだい}がいますか。', ro: 'Paku-san, kyoudai ga imasu ka.', vi: 'Park có anh chị em không?' },
        { who: 'パク', role: 'c', text: 'はい、{姉|あね}が{1人|ひとり}と{弟|おとうと}が{1人|ひとり}います。ダニエルさんは？', ro: 'Hai, ane ga hitori to otouto ga hitori imasu. Danieru-san wa?', vi: 'Có, mình có một chị gái và một em trai. Còn Daniel?' },
        { who: 'ダニエル', role: 'b', text: '{私|わたし}は{兄弟|きょうだい}がいません。でも、{猫|ねこ}が{2匹|にひき}います。', ro: 'Watashi wa kyoudai ga imasen. Demo, neko ga nihiki imasu.', vi: 'Mình không có anh chị em. Nhưng có hai con mèo.' },
        { who: 'パク', role: 'c', text: 'へえ、ペットがいますか。いいですね。', ro: 'Hee, petto ga imasu ka. Ii desu ne.', vi: 'Ồ, bạn có thú cưng à. Thích nhỉ.' },
        { who: 'ダニエル', role: 'b', text: 'パクさんはペットがいますか。', ro: 'Paku-san wa petto ga imasu ka.', vi: 'Park có thú cưng không?' },
        { who: 'パク', role: 'c', text: 'いいえ、いません。', ro: 'Iie, imasen.', vi: 'Không, mình không có.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Xem ảnh gia đình — ai làm nghề gì?',
      lines: [
        { who: 'パク', role: 'c', text: 'これは{私|わたし}の{家族|かぞく}の{写真|しゃしん}です。{両親|りょうしん}と{姉|あね}と{弟|おとうと}です。', ro: 'Kore wa watashi no kazoku no shashin desu. Ryoushin to ane to otouto desu.', vi: 'Đây là ảnh gia đình mình. Bố mẹ, chị gái và em trai mình.' },
        { who: 'ダニエル', role: 'b', text: 'お{父|とう}さんは{何|なに}をしていますか。', ro: 'Otousan wa nani o shite imasu ka.', vi: 'Bố bạn làm nghề gì?' },
        { who: 'パク', role: 'c', text: '{父|ちち}は{医者|いしゃ}です。ソウルの{病院|びょういん}で{働|はたら}いています。', ro: 'Chichi wa isha desu. Souru no byouin de hataraite imasu.', vi: 'Bố mình là bác sĩ. Làm việc ở bệnh viện tại Seoul.' },
        { who: 'ダニエル', role: 'b', text: 'そうですか。お{母|かあ}さんは？', ro: 'Sou desu ka. Okaasan wa?', vi: 'Vậy à. Còn mẹ bạn?' },
        { who: 'パク', role: 'c', text: '{母|はは}は{高校|こうこう}の{先生|せんせい}です。{高校|こうこう}で{英語|えいご}を{教|おし}えています。', ro: 'Haha wa koukou no sensei desu. Koukou de eigo o oshiete imasu.', vi: 'Mẹ mình là giáo viên cấp 3. Dạy tiếng Anh ở trường cấp 3.' },
        { who: 'ダニエル', role: 'b', text: 'お{姉|ねえ}さんと{弟|おとうと}さんは？', ro: 'Oneesan to otoutosan wa?', vi: 'Còn chị gái và em trai bạn?' },
        { who: 'パク', role: 'c', text: '{姉|あね}は{会社員|かいしゃいん}です。デパートで{働|はたら}いています。{弟|おとうと}は{大学生|だいがくせい}です。{大学|だいがく}で{経済|けいざい}を{勉強|べんきょう}しています。', ro: 'Ane wa kaishain desu. Depaato de hataraite imasu. Otouto wa daigakusei desu. Daigaku de keizai o benkyou shite imasu.', vi: 'Chị mình là nhân viên công ty, làm ở trung tâm thương mại. Em trai mình là sinh viên, đang học kinh tế ở đại học.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Trên tàu điện — nhà có mấy người?',
      lines: [
        { who: 'マルコ', role: 'b', text: 'ワンさんの{家族|かぞく}は{何人|なんにん}ですか。', ro: 'Wan-san no kazoku wa nannin desu ka.', vi: 'Nhà Wang có mấy người?' },
        { who: 'ワン', role: 'a', text: '{4人|よにん}です。{父|ちち}と{母|はは}と{妹|いもうと}と{私|わたし}です。', ro: 'Yonin desu. Chichi to haha to imouto to watashi desu.', vi: 'Bốn người. Bố, mẹ, em gái và mình.' },
        { who: 'マルコ', role: 'b', text: 'ご{家族|かぞく}はどこに{住|す}んでいますか。', ro: 'Gokazoku wa doko ni sunde imasu ka.', vi: 'Gia đình bạn sống ở đâu?' },
        { who: 'ワン', role: 'a', text: '{上海|シャンハイ}に{住|す}んでいます。{妹|いもうと}は{高校生|こうこうせい}です。ピアノが{上手|じょうず}ですよ。', ro: 'Shanhai ni sunde imasu. Imouto wa koukousei desu. Piano ga jouzu desu yo.', vi: 'Sống ở Thượng Hải. Em gái mình là học sinh cấp 3. Chơi piano giỏi lắm đấy.' },
        { who: 'マルコ', role: 'b', text: 'へえ、すごいですね。', ro: 'Hee, sugoi desu ne.', vi: 'Ồ, giỏi quá nhỉ.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{私|わたし}は{横浜|よこはま}に{住|す}んでいます。', ro: 'Watashi wa Yokohama ni sunde imasu.', vi: 'Tôi đang sống ở Yokohama. — nơi ở: (nơi) **に {住|す}んでいます** (ポイント 72).' },
        { en: '{姉|あね}はデパートで{働|はたら}いています。', ro: 'Ane wa depaato de hataraite imasu.', vi: 'Chị tôi làm việc ở trung tâm thương mại. — nghề: (nơi) **で** V**ています** (ポイント 73).' },
        { en: 'お{父|とう}さんは{何|なに}をしていますか。', ro: 'Otousan wa nani o shite imasu ka.', vi: 'Bố bạn làm nghề gì? — hỏi nghề nghiệp một cách tự nhiên.' },
        { en: '{兄弟|きょうだい}がいますか。——はい、{姉|あね}が{1人|ひとり}います。', ro: 'Kyoudai ga imasu ka. — Hai, ane ga hitori imasu.', vi: 'Bạn có anh chị em không? — Có, tôi có một chị gái. (ポイント 79)' },
        { en: '{兄|あに}と{2人|ふたり}で{住|す}んでいます。', ro: 'Ani to futari de sunde imasu.', vi: 'Tôi sống hai người với anh trai. — số người + **で** (ポイント 80).' },
        { en: '{家族|かぞく}は{何人|なんにん}ですか。——{4人|よにん}です。', ro: 'Kazoku wa nannin desu ka. — Yonin desu.', vi: 'Nhà bạn có mấy người? — Bốn người (tính cả mình).' },
      ],
    },

    /* ── ② こんな人 ── */
    { t: 'h', text: '② こんな{人|ひと} — Người đó thế nào?' },
    {
      t: 'p',
      text: 'Tình huống: ở quán cà phê, hai bạn vừa xem ảnh trong máy ảnh vừa nói chuyện. Hỏi "người này là ai?", "người nào?", rồi **tả** người đó: cao / tóc ngắn / mắt to (ngoại hình) và vui tính / hiền / chăm chỉ (tính cách). Hai tính từ nối bằng **～くて** hoặc **～で**.',
    },
    {
      t: 'dialogue',
      title: 'Người bạn chơi tennis giỏi',
      lines: [
        { who: 'カルロス', role: 'b', text: 'この{人|ひと}は{山口|やまぐち}さんです。{私|わたし}の{友達|ともだち}です。', ro: 'Kono hito wa Yamaguchi-san desu. Watashi no tomodachi desu.', vi: 'Người này là chị Yamaguchi. Bạn mình.' },
        { who: 'メアリー', role: 'a', text: 'へえ。{山口|やまぐち}さんは{学生|がくせい}ですか。', ro: 'Hee. Yamaguchi-san wa gakusei desu ka.', vi: 'Ồ. Chị Yamaguchi là sinh viên à?' },
        { who: 'カルロス', role: 'b', text: 'はい、ふじみ{大学|だいがく}で{英語|えいご}を{勉強|べんきょう}しています。{山口|やまぐち}さんはテニスがとても{上手|じょうず}です。', ro: 'Hai, Fujimi daigaku de eigo o benkyou shite imasu. Yamaguchi-san wa tenisu ga totemo jouzu desu.', vi: 'Ừ, chị ấy học tiếng Anh ở đại học Fujimi. Chị Yamaguchi chơi tennis rất giỏi.' },
        { who: 'メアリー', role: 'a', text: 'そうですか。{私|わたし}はテニスが{下手|へた}です……。', ro: 'Sou desu ka. Watashi wa tenisu ga heta desu…….', vi: 'Vậy à. Mình chơi tennis dở lắm…' },
        { who: 'カルロス', role: 'b', text: 'じゃ、{今度|こんど}、{一緒|いっしょ}にしませんか。{山口|やまぐち}さんは{教|おし}え{方|かた}も{上手|じょうず}ですよ。', ro: 'Ja, kondo, issho ni shimasen ka. Yamaguchi-san wa oshiekata mo jouzu desu yo.', vi: 'Vậy lần tới chơi cùng không? Chị Yamaguchi dạy cũng giỏi lắm đấy.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Người này là ai? — người nào?',
      lines: [
        { who: 'メアリー', role: 'a', text: 'カルロスさん、この{人|ひと}は{誰|だれ}ですか。', ro: 'Karurosu-san, kono hito wa dare desu ka.', vi: 'Carlos, người này là ai?' },
        { who: 'カルロス', role: 'b', text: 'どの{人|ひと}ですか。', ro: 'Dono hito desu ka.', vi: 'Người nào?' },
        { who: 'メアリー', role: 'a', text: 'この{背|せ}が{高|たか}くて、{髪|かみ}が{短|みじか}い{人|ひと}です。', ro: 'Kono se ga takakute, kami ga mijikai hito desu.', vi: 'Người cao, tóc ngắn này này.' },
        { who: 'カルロス', role: 'b', text: 'ああ、それは{私|わたし}の{兄|あに}です。', ro: 'Aa, sore wa watashi no ani desu.', vi: 'À, đó là anh trai mình.' },
        { who: 'メアリー', role: 'a', text: 'へえ。お{兄|にい}さんはかっこいいですね。', ro: 'Hee. Oniisan wa kakkoii desu ne.', vi: 'Ồ. Anh trai bạn đẹp trai nhỉ.' },
        { who: 'カルロス', role: 'b', text: 'そうですか。{兄|あに}は{結婚|けっこん}しています。この{髪|かみ}が{長|なが}い{人|ひと}は{兄|あに}の{奥|おく}さん……いいえ、{妻|つま}です。', ro: 'Sou desu ka. Ani wa kekkon shite imasu. Kono kami ga nagai hito wa ani no okusan…… iie, tsuma desu.', vi: 'Thế à. Anh mình lập gia đình rồi. Người tóc dài này là vợ anh ấy.' },
      ],
    },
    {
      t: 'note',
      title: 'Chỗ tinh ý trong đoạn trên',
      items: [
        'Carlos lỡ nói ~~{兄|あに}の{奥|おく}さん~~ rồi sửa thành **{兄|あに}の{妻|つま}** — vợ của người nhà MÌNH thì dùng từ khiêm nhường {妻|つま}; **{奥|おく}さん** chỉ dùng cho vợ của NGƯỜI KHÁC.',
        '**{背|せ}が{高|たか}くて、{髪|かみ}が{短|みじか}い{人|ひと}** — cả cụm "cao, tóc ngắn" đứng TRƯỚC {人|ひと} để chỉ ra người nào (ポイント 74 + 75 dùng để bổ nghĩa danh từ).',
      ],
    },
    {
      t: 'dialogue',
      title: 'Là người thế nào?',
      lines: [
        { who: 'アンナ', role: 'a', text: 'この{人|ひと}はダニエルさんです。{私|わたし}の{友達|ともだち}です。', ro: 'Kono hito wa Danieru-san desu. Watashi no tomodachi desu.', vi: 'Người này là Daniel. Bạn mình.' },
        { who: 'ワン', role: 'c', text: 'へえ。ダニエルさんはどんな{人|ひと}ですか。', ro: 'Hee. Danieru-san wa donna hito desu ka.', vi: 'Ồ. Daniel là người thế nào?' },
        { who: 'アンナ', role: 'a', text: '{元気|げんき}で、おもしろい{人|ひと}です。サッカーが{上手|じょうず}です。', ro: 'Genki de, omoshiroi hito desu. Sakkaa ga jouzu desu.', vi: 'Là người năng động và vui tính. Đá bóng giỏi.' },
        { who: 'ワン', role: 'c', text: 'そうですか。この{人|ひと}は？', ro: 'Sou desu ka. Kono hito wa?', vi: 'Vậy à. Còn người này?' },
        { who: 'アンナ', role: 'a', text: 'キムさんです。{大学|だいがく}の{後輩|こうはい}です。まじめで、{頭|あたま}がいいです。', ro: 'Kimu-san desu. Daigaku no kouhai desu. Majime de, atama ga ii desu.', vi: 'Là Kim. Đàn em ở đại học. Chăm chỉ và thông minh.' },
        { who: 'ワン', role: 'c', text: 'いいですね。', ro: 'Ii desu ne.', vi: 'Hay nhỉ.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'アンナさんはテニスが{上手|じょうず}です。', ro: 'Anna-san wa tenisu ga jouzu desu.', vi: 'Anna chơi tennis giỏi. — N1 **は** N2 **が** A (ポイント 74).' },
        { en: '{父|ちち}は{背|せ}が{高|たか}いです。', ro: 'Chichi wa se ga takai desu.', vi: 'Bố tôi cao. (nghĩa đen: bố tôi — chiều cao thì cao)' },
        { en: 'メアリーさんは{目|め}が{大|おお}きくて、{髪|かみ}が{長|なが}いです。', ro: 'Mearii-san wa me ga ookikute, kami ga nagai desu.', vi: 'Mary mắt to, tóc dài. — イA: い → **くて** (ポイント 75).' },
        { en: 'ナタポンさんはまじめで、{親切|しんせつ}です。', ro: 'Natapon-san wa majime de, shinsetsu desu.', vi: 'Natapon chăm chỉ và tốt bụng. — ナA + **で**.' },
        { en: 'どんな{人|ひと}ですか。——おもしろくて、{優|やさ}しい{人|ひと}です。', ro: 'Donna hito desu ka. — Omoshirokute, yasashii hito desu.', vi: 'Là người thế nào? — Người vui tính và hiền.' },
        { en: 'この{人|ひと}は{誰|だれ}ですか。——どの{人|ひと}ですか。', ro: 'Kono hito wa dare desu ka. — Dono hito desu ka.', vi: 'Người này là ai? — Người nào cơ? (どの = nào, Bài 7)' },
      ],
    },

    /* ── ③ プレゼント ── */
    { t: 'h', text: '③ プレゼント — Tặng gì? Ai tặng?' },
    {
      t: 'p',
      text: 'Tình huống: trong lớp, sắp đến sinh nhật một bạn — cả nhóm **bàn** nên tặng gì. Rồi các bạn khen đồ của nhau ("cái máy ảnh đẹp nhỉ") và kể **ai đã tặng** mình, kể về quà Giáng sinh, Valentine. Ba động từ trao–nhận: **あげます** (mình/người khác CHO đi), **もらいます** (NHẬN), **くれます** (người khác cho MÌNH).',
    },
    {
      t: 'dialogue',
      title: 'Sắp sinh nhật Mariyam — tặng gì?',
      lines: [
        { who: 'ダニエル', role: 'b', text: 'もうすぐ、マリヤムさんの{誕生日|たんじょうび}ですね。アンナさん、マリヤムさんに{何|なに}かプレゼントをあげませんか。', ro: 'Mousugu, Mariyamu-san no tanjoubi desu ne. Anna-san, Mariyamu-san ni nanika purezento o agemasen ka.', vi: 'Sắp sinh nhật Mariyam rồi nhỉ. Anna, mình tặng Mariyam món quà gì đó không?' },
        { who: 'アンナ', role: 'a', text: 'いいですね。{何|なに}をあげますか。', ro: 'Ii desu ne. Nani o agemasu ka.', vi: 'Hay đấy. Tặng gì đây?' },
        { who: 'ダニエル', role: 'b', text: 'マリヤムさんは{猫|ねこ}が{好|す}きですよ。{猫|ねこ}のカードはどうですか。', ro: 'Mariyamu-san wa neko ga suki desu yo. Neko no kaado wa dou desu ka.', vi: 'Mariyam thích mèo đấy. Thiệp hình mèo thì sao?' },
        { who: 'アンナ', role: 'a', text: 'カードもいいですね。でも、{私|わたし}は{花|はな}もあげたいです。', ro: 'Kaado mo ii desu ne. Demo, watashi wa hana mo agetai desu.', vi: 'Thiệp cũng hay. Nhưng mình muốn tặng cả hoa nữa.' },
        { who: 'ダニエル', role: 'b', text: 'いいですね。じゃ、カードと{花|はな}をあげましょう。', ro: 'Ii desu ne. Ja, kaado to hana o agemashou.', vi: 'Được đấy. Vậy tặng thiệp và hoa nhé.' },
        { who: 'アンナ', role: 'a', text: 'どこで{買|か}いますか。', ro: 'Doko de kaimasu ka.', vi: 'Mua ở đâu?' },
        { who: 'ダニエル', role: 'b', text: '{駅|えき}の{前|まえ}に{花屋|はなや}がありますよ。{明日|あした}、{一緒|いっしょ}に{買|か}いに{行|い}きましょう。', ro: 'Eki no mae ni hanaya ga arimasu yo. Ashita, issho ni kai ni ikimashou.', vi: 'Trước ga có tiệm hoa đấy. Mai cùng đi mua nhé.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Khen đồ — ai tặng?',
      lines: [
        { who: 'ワン', role: 'a', text: 'パクさん、その{時計|とけい}、いいですね。', ro: 'Paku-san, sono tokei, ii desu ne.', vi: 'Park, cái đồng hồ đó đẹp nhỉ.' },
        { who: 'パク', role: 'c', text: 'あ、ありがとうございます。{父|ちち}にもらいました。', ro: 'A, arigatou gozaimasu. Chichi ni moraimashita.', vi: 'A, cảm ơn. Mình nhận của bố đấy.' },
        { who: 'ワン', role: 'a', text: 'お{父|とう}さんに？ {誕生日|たんじょうび}のプレゼントですか。', ro: 'Otousan ni? Tanjoubi no purezento desu ka.', vi: 'Của bố bạn à? Quà sinh nhật à?' },
        { who: 'パク', role: 'c', text: 'いいえ、クリスマスのプレゼントです。{父|ちち}が{韓国|かんこく}から{送|おく}りました。', ro: 'Iie, kurisumasu no purezento desu. Chichi ga Kankoku kara okurimashita.', vi: 'Không, quà Giáng sinh. Bố mình gửi từ Hàn Quốc sang.' },
        { who: 'ワン', role: 'a', text: 'そうですか。{素敵|すてき}ですね。', ro: 'Sou desu ka. Suteki desu ne.', vi: 'Vậy à. Đẹp thật đấy.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Tiệc sinh nhật thế nào?',
      lines: [
        { who: 'ナタポン', role: 'b', text: 'メアリーさん、{誕生日|たんじょうび}パーティーはどうでしたか。', ro: 'Mearii-san, tanjoubi paatii wa dou deshita ka.', vi: 'Mary, tiệc sinh nhật thế nào?' },
        { who: 'メアリー', role: 'a', text: 'とても{楽|たの}しかったです。みんなでケーキを{食|た}べました。それから、カラオケに{行|い}きました。', ro: 'Totemo tanoshikatta desu. Minna de keeki o tabemashita. Sorekara, karaoke ni ikimashita.', vi: 'Vui lắm. Mọi người cùng ăn bánh kem. Sau đó đi karaoke.' },
        { who: 'ナタポン', role: 'b', text: 'へえ。', ro: 'Hee.', vi: 'Ồ.' },
        { who: 'メアリー', role: 'a', text: '{友達|ともだち}がネックレスをくれました。{祖母|そぼ}もカードを{送|おく}りました。', ro: 'Tomodachi ga nekkuresu o kuremashita. Sobo mo kaado o okurimashita.', vi: 'Bạn mình tặng mình sợi dây chuyền. Bà mình cũng gửi thiệp.' },
        { who: 'ナタポン', role: 'b', text: 'そうですか。よかったですね。', ro: 'Sou desu ka. Yokatta desu ne.', vi: 'Vậy à. Tốt quá nhỉ (mừng cho bạn).' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Valentine — tặng gì cho người yêu?',
      lines: [
        { who: 'マルコ', role: 'b', text: 'パクさん、{日本|にほん}のバレンタインデーは{何|なに}をしますか。', ro: 'Paku-san, Nihon no barentaindee wa nani o shimasu ka.', vi: 'Park, ở Nhật ngày Valentine người ta làm gì?' },
        { who: 'パク', role: 'c', text: '{女|おんな}の{人|ひと}が{男|おとこ}の{人|ひと}にチョコレートをあげます。', ro: 'Onna no hito ga otoko no hito ni chokoreeto o agemasu.', vi: 'Con gái tặng sô-cô-la cho con trai.' },
        { who: 'マルコ', role: 'b', text: 'へえ。{私|わたし}の{国|くに}では{男|おとこ}の{人|ひと}も{花|はな}やカードをあげますよ。', ro: 'Hee. Watashi no kuni de wa otoko no hito mo hana ya kaado o agemasu yo.', vi: 'Ồ. Ở nước mình con trai cũng tặng hoa, thiệp đấy.' },
        { who: 'パク', role: 'c', text: 'マルコさんは{去年|きょねん}、{何|なに}かもらいましたか。', ro: 'Maruko-san wa kyonen, nanika moraimashita ka.', vi: 'Năm ngoái Marco có nhận được gì không?' },
        { who: 'マルコ', role: 'b', text: 'はい、{恋人|こいびと}がチョコレートをくれました。とてもおいしかったです。', ro: 'Hai, koibito ga chokoreeto o kuremashita. Totemo oishikatta desu.', vi: 'Có, người yêu tặng mình sô-cô-la. Ngon lắm.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'パクさんに{花|はな}をあげました。', ro: 'Paku-san ni hana o agemashita.', vi: 'Tôi đã tặng hoa cho Park. — (người nhận) **に** (vật) **を あげます** (ポイント 76).' },
        { en: '{姉|あね}にカメラをもらいました。', ro: 'Ane ni kamera o moraimashita.', vi: 'Tôi nhận máy ảnh của chị gái. — (người cho) **に** (vật) **を もらいます** (ポイント 77).' },
        { en: '{友達|ともだち}が{私|わたし}にCDをくれました。', ro: 'Tomodachi ga watashi ni shiidii o kuremashita.', vi: 'Bạn tôi tặng tôi đĩa CD. — người khác **が** (tôi) **に** ... **くれます** (ポイント 78).' },
        { en: '{何|なに}かプレゼントをあげませんか。', ro: 'Nanika purezento o agemasen ka.', vi: 'Mình tặng món quà gì đó không? — {何|なに}か = cái gì đó.' },
        { en: 'もうすぐクリスマスですね。', ro: 'Mousugu kurisumasu desu ne.', vi: 'Sắp Giáng sinh rồi nhỉ.' },
        { en: 'そうですか。よかったですね。', ro: 'Sou desu ka. Yokatta desu ne.', vi: 'Vậy à. Tốt quá nhỉ. — mừng cho chuyện tốt của NGƯỜI KHÁC.' },
      ],
    },

    /* ── 話読聞書 ── */
    { t: 'h', text: '④ Nói–Đọc–Nghe–Viết (話読聞書) — {大切|たいせつ}な{人|ひと}' },
    {
      t: 'p',
      text: 'Bài đọc mẫu (viết mới, cùng kiểu với sách): giới thiệu **một người quan trọng** với mình — người đó là ai, đang làm gì, mình với người đó hay làm gì, người đó thế nào. Sách đặt 3 câu hỏi dàn ý bên lề: **{大切|たいせつ}な{人|ひと}は{誰|だれ}ですか · どんな{人|ひと}ですか · {何|なに}をしていますか**. Đọc to từng câu rồi viết một đoạn y khung về người quan trọng của BẠN.',
    },
    {
      t: 'passage',
      title: '{私|わたし}の{姉|あね}',
      paras: [
        { text: 'この{人|ひと}は{私|わたし}の{姉|あね}です。{名前|なまえ}はランです。{姉|あね}はハノイに{住|す}んでいます。{病院|びょういん}で{働|はたら}いています。{医者|いしゃ}です。{姉|あね}は{背|せ}が{高|たか}くて、{髪|かみ}が{長|なが}いです。{優|やさ}しくて、{頭|あたま}がいい{人|ひと}です。{料理|りょうり}もとても{上手|じょうず}です。{毎週|まいしゅう}{日曜日|にちようび}、{姉|あね}と{電話|でんわ}で{話|はな}します。{去年|きょねん}の{誕生日|たんじょうび}に、{姉|あね}は{私|わたし}に{辞書|じしょ}をくれました。{私|わたし}は{毎日|まいにち}その{辞書|じしょ}を{使|つか}っています。' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'この{人|ひと}は{私|わたし}の{姉|あね}です。{名前|なまえ}はランです。', ro: 'Kono hito wa watashi no ane desu. Namae wa Ran desu.', vi: 'Người này là chị gái tôi. Tên là Lan.' },
        { en: '{姉|あね}はハノイに{住|す}んでいます。{病院|びょういん}で{働|はたら}いています。', ro: 'Ane wa Hanoi ni sunde imasu. Byouin de hataraite imasu.', vi: 'Chị tôi sống ở Hà Nội. Làm việc ở bệnh viện. — ポイント 72, 73' },
        { en: '{姉|あね}は{背|せ}が{高|たか}くて、{髪|かみ}が{長|なが}いです。', ro: 'Ane wa se ga takakute, kami ga nagai desu.', vi: 'Chị tôi cao, tóc dài. — ポイント 74 + 75' },
        { en: '{優|やさ}しくて、{頭|あたま}がいい{人|ひと}です。', ro: 'Yasashikute, atama ga ii hito desu.', vi: 'Là người hiền và thông minh.' },
        { en: '{毎週|まいしゅう}{日曜日|にちようび}、{姉|あね}と{電話|でんわ}で{話|はな}します。', ro: 'Maishuu nichiyoubi, ane to denwa de hanashimasu.', vi: 'Chủ Nhật hằng tuần tôi nói chuyện điện thoại với chị. — {電話|でんわ}で = bằng điện thoại (ポイント 71).' },
        { en: '{去年|きょねん}の{誕生日|たんじょうび}に、{姉|あね}は{私|わたし}に{辞書|じしょ}をくれました。', ro: 'Kyonen no tanjoubi ni, ane wa watashi ni jisho o kuremashita.', vi: 'Sinh nhật năm ngoái chị tặng tôi quyển từ điển. — ポイント 78' },
        { en: '{私|わたし}は{毎日|まいにち}その{辞書|じしょ}を{使|つか}っています。', ro: 'Watashi wa mainichi sono jisho o tsukatte imasu.', vi: 'Hằng ngày tôi dùng quyển từ điển đó. — V**ています** việc làm thường xuyên.' },
      ],
    },
    {
      t: 'note',
      title: 'Viết đoạn "Người quan trọng của tôi" theo khung',
      items: [
        '**Câu 1 — là ai (誰):** この{人|ひと}は{私|わたし}の ___ です。{名前|なまえ}は ___ です。',
        '**Câu 2 — đang làm gì (何をしていますか):** ___ に{住|す}んでいます。___ で ___ を{勉強|べんきょう}しています／___ で{働|はたら}いています。',
        '**Câu 3 — ngoại hình:** ___ は{背|せ}が ___ くて、{髪|かみ}が ___ です。',
        '**Câu 4 — tính cách (どんな人):** ___ くて／___ で、___ {人|ひと}です。___ が{上手|じょうず}です。',
        '**Câu 5 — kỷ niệm:** {毎週|まいしゅう} ___、{一緒|いっしょ}に ___ ます。／___ に、___ は{私|わたし}に ___ をくれました。',
        'Người nhà mình: dùng {姉|あね}・{兄|あに}・{母|はは}… (không có さん). Bạn bè: tên + さん. Từ {毎週|まいしゅう} (mỗi tuần) là từ thêm; {名前|なまえ} (Bài 1), {使|つか}います (Bài 7).',
      ],
    },

    /* ── できる！ ── */
    { t: 'h', text: 'できる！— Kể về gia đình, bạn bè và một kỷ niệm' },
    {
      t: 'p',
      text: 'Nhiệm vụ của sách: "Gia đình, bạn bè bạn là người thế nào? Bạn có kỷ niệm gì với họ? Hãy nói với bạn cùng lớp." Chuẩn bị bằng bảng dưới (thông tin mẫu — thay bằng người thật của bạn), mỗi dòng nói thành 3–4 câu.',
    },
    {
      t: 'table',
      caption: 'Bảng chuẩn bị (mẫu)',
      head: ['Ai', 'Sống ở / làm gì', 'Người thế nào', 'Kỷ niệm (câu nói)'],
      rows: [
        ['{母|はは}', 'ハノイ・{高校|こうこう}で{英語|えいご}を{教|おし}えています', '{優|やさ}しくて、{親切|しんせつ}です', '{誕生日|たんじょうび}に{母|はは}がケーキを{作|つく}りました。'],
        ['{弟|おとうと}', 'ハノイ・{高校生|こうこうせい}', '{元気|げんき}で、サッカーが{上手|じょうず}です', '{毎週|まいしゅう}{日曜日|にちようび}、{一緒|いっしょ}にサッカーをしました。'],
        ['{友達|ともだち}のマルコさん', '{東京|とうきょう}・{大学|だいがく}で{経済|けいざい}を{勉強|べんきょう}しています', 'おもしろくて、{背|せ}が{高|たか}いです', 'クリスマスにマルコさんが{私|わたし}に{本|ほん}をくれました。'],
        ['{先輩|せんぱい}の{山口|やまぐち}さん', '{横浜|よこはま}・デパートで{働|はたら}いています', 'まじめで、{頭|あたま}がいいです', '{山口|やまぐち}さんに{辞書|じしょ}をもらいました。'],
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */
/* Đủ 81 từ trang ことば p.151 (8-1: 13 + 7 + 10 = 30 · 8-2: 5 + 8 + 15 = 28 ·
 * 8-3: 11 + 4 + 8 = 23) + 3 từ cuối trang p.152 = 84 mục. */

const TU_VUNG: Lesson = {
  id: 'b8-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 84 từ của Bài 8 (trang ことば p.151 + p.152)',
  goal: 'Thuộc đủ 84 từ của Bài 8: gọi người thân (nhà mình / nhà người khác), bộ phận cơ thể, tính từ tả người, đồ làm quà và ba động từ cho–nhận.',
  minutes: 45,
  blocks: [
    {
      t: 'p',
      text: 'Danh sách từ mới cô phát chỉ có tới Bài 7, nên Bài 8 lấy **trang ことば p.151 của sách** làm chuẩn: **81 từ** chia ba chủ đề 8-1 · 8-2 · 8-3, cộng **3 từ** in cuối trang もう{一度|いちど}{聞|き}こう p.152 ({経済|けいざい}, {結婚|けっこん}します, {素敵|すてき}) = **84 mục**. Câu ví dụ chỉ dùng từ Bài 1–8. Cách học: bấm 🔊 → đọc to 3 lần → che nghĩa, tự nói.',
    },
    {
      t: 'note',
      title: 'Cách đọc romaji trong bài này',
      items: [
        'Trường âm viết theo kana: お{父|とう}さん → **otousan**, お{兄|にい}さん → **oniisan**, お{姉|ねえ}さん → **oneesan**, {弟|おとうと} → **otouto**, {兄弟|きょうだい} → **kyoudai**, {高校生|こうこうせい} → **koukousei**, チョコレート → **chokoreeto**.',
        'Âm ngắt っ viết đôi phụ âm: ペット → **petto**, ネックレス → **nekkuresu**, {結婚|けっこん} → **kekkon**, かっこいい → **kakkoii**.',
        'Hai chữ い liền nhau đọc đủ hai nhịp: かわ**いい** kawaii, {優|やさ}**しい** yasashii, かっこ**いい** kakkoii.',
      ],
    },

    /* ── 8-1 ── */
    { t: 'h', text: 'A. 8-1 · Gia đình MÌNH — cách gọi khiêm nhường (13 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{両親|りょうしん}', pos: 'danh từ', ipa: 'ryoushin', vi: 'bố mẹ (của mình)', ex: '{両親|りょうしん}はハノイに{住|す}んでいます。', exRo: 'Ryoushin wa Hanoi ni sunde imasu.', exVi: 'Bố mẹ tôi sống ở Hà Nội.' },
        { w: '{父|ちち}', pos: 'danh từ', ipa: 'chichi', vi: 'bố (của mình)', ex: '{父|ちち}は{医者|いしゃ}です。', exRo: 'Chichi wa isha desu.', exVi: 'Bố tôi là bác sĩ.' },
        { w: '{母|はは}', pos: 'danh từ', ipa: 'haha', vi: 'mẹ (của mình)', ex: '{母|はは}は{料理|りょうり}が{上手|じょうず}です。', exRo: 'Haha wa ryouri ga jouzu desu.', exVi: 'Mẹ tôi nấu ăn giỏi.' },
        { w: '{兄弟|きょうだい}', pos: 'danh từ', ipa: 'kyoudai', vi: 'anh chị em', ex: '{兄弟|きょうだい}がいますか。——はい、{3人|さんにん}います。', exRo: 'Kyoudai ga imasu ka. — Hai, sannin imasu.', exVi: 'Bạn có anh chị em không? — Có, 3 người.' },
        { w: '{兄|あに}', pos: 'danh từ', ipa: 'ani', vi: 'anh trai (của mình)', ex: '{兄|あに}は{会社員|かいしゃいん}です。', exRo: 'Ani wa kaishain desu.', exVi: 'Anh trai tôi là nhân viên công ty.' },
        { w: '{姉|あね}', pos: 'danh từ', ipa: 'ane', vi: 'chị gái (của mình)', ex: '{姉|あね}が{1人|ひとり}います。', exRo: 'Ane ga hitori imasu.', exVi: 'Tôi có một chị gái.' },
        { w: '{弟|おとうと}', pos: 'danh từ', ipa: 'otouto', vi: 'em trai (của mình)', ex: '{弟|おとうと}は{大学生|だいがくせい}です。', exRo: 'Otouto wa daigakusei desu.', exVi: 'Em trai tôi là sinh viên.' },
        { w: '{妹|いもうと}', pos: 'danh từ', ipa: 'imouto', vi: 'em gái (của mình)', ex: '{妹|いもうと}は{15歳|じゅうごさい}です。', exRo: 'Imouto wa juugosai desu.', exVi: 'Em gái tôi 15 tuổi.' },
        { w: '{夫|おっと}', pos: 'danh từ', ipa: 'otto', vi: 'chồng (của mình)', ex: '{夫|おっと}は{背|せ}が{高|たか}いです。', exRo: 'Otto wa se ga takai desu.', exVi: 'Chồng tôi cao.' },
        { w: '{妻|つま}', pos: 'danh từ', ipa: 'tsuma', vi: 'vợ (của mình)', ex: '{妻|つま}は{銀行|ぎんこう}で{働|はたら}いています。', exRo: 'Tsuma wa ginkou de hataraite imasu.', exVi: 'Vợ tôi làm ở ngân hàng.' },
        { w: '{子|こ}ども', pos: 'danh từ', ipa: 'kodomo', vi: 'con, con cái; trẻ con', ex: '{子|こ}どもが{2人|ふたり}います。', exRo: 'Kodomo ga futari imasu.', exVi: 'Tôi có hai con.' },
        { w: '{息子|むすこ}', pos: 'danh từ', ipa: 'musuko', vi: 'con trai (của mình)', ex: '{息子|むすこ}は{高校生|こうこうせい}です。', exRo: 'Musuko wa koukousei desu.', exVi: 'Con trai tôi là học sinh cấp 3.' },
        { w: '{娘|むすめ}', pos: 'danh từ', ipa: 'musume', vi: 'con gái (của mình)', ex: '{娘|むすめ}はピアノが{好|す}きです。', exRo: 'Musume wa piano ga suki desu.', exVi: 'Con gái tôi thích piano.' },
      ],
    },

    { t: 'h', text: 'B. 8-1 · Gia đình NGƯỜI KHÁC — cách gọi tôn kính (7 từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'お{父|とう}さん', pos: 'danh từ', ipa: 'otousan', vi: 'bố (của người khác); cũng là tiếng gọi "bố ơi" trong nhà', ex: 'お{父|とう}さんは{何|なに}をしていますか。', exRo: 'Otousan wa nani o shite imasu ka.', exVi: 'Bố bạn làm nghề gì?' },
        { w: 'お{母|かあ}さん', pos: 'danh từ', ipa: 'okaasan', vi: 'mẹ (của người khác); "mẹ ơi"', ex: 'お{母|かあ}さんはどこに{住|す}んでいますか。', exRo: 'Okaasan wa doko ni sunde imasu ka.', exVi: 'Mẹ bạn sống ở đâu?' },
        { w: 'お{兄|にい}さん', pos: 'danh từ', ipa: 'oniisan', vi: 'anh trai (của người khác); "anh ơi"', ex: 'Aさんのお{兄|にい}さんはかっこいいですね。', exRo: 'A-san no oniisan wa kakkoii desu ne.', exVi: 'Anh trai bạn A đẹp trai nhỉ.' },
        { w: 'お{姉|ねえ}さん', pos: 'danh từ', ipa: 'oneesan', vi: 'chị gái (của người khác); "chị ơi"', ex: 'お{姉|ねえ}さんは{何|なに}をしていますか。', exRo: 'Oneesan wa nani o shite imasu ka.', exVi: 'Chị gái bạn làm nghề gì?' },
        { w: '{弟|おとうと}さん', pos: 'danh từ', ipa: 'otoutosan', vi: 'em trai (của người khác)', ex: '{弟|おとうと}さんは{何歳|なんさい}ですか。', exRo: 'Otoutosan wa nansai desu ka.', exVi: 'Em trai bạn mấy tuổi?' },
        { w: '{妹|いもうと}さん', pos: 'danh từ', ipa: 'imoutosan', vi: 'em gái (của người khác)', ex: '{妹|いもうと}さんはかわいいですね。', exRo: 'Imoutosan wa kawaii desu ne.', exVi: 'Em gái bạn dễ thương nhỉ.' },
        { w: 'お{子|こ}さん', pos: 'danh từ', ipa: 'okosan', vi: 'con (của người khác)', ex: 'お{子|こ}さんがいますか。——はい、{娘|むすめ}が{1人|ひとり}います。', exRo: 'Okosan ga imasu ka. — Hai, musume ga hitori imasu.', exVi: 'Anh/chị có con chưa? — Có, tôi có một con gái.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng gọi người thân (表 p.289) — nhà MÌNH ↔ nhà NGƯỜI KHÁC',
      head: ['Nghĩa', 'Nhà mình (khiêm nhường)', 'Nhà người khác (tôn kính)'],
      rows: [
        ['ông / bà', '{祖父|そふ} sofu / **{祖母|そぼ} sobo**', 'おじいさん ojiisan / おばあさん obaasan'],
        ['bố mẹ', '**{両親|りょうしん}** ryoushin', 'ご{両親|りょうしん} goryoushin'],
        ['bố', '**{父|ちち}** chichi', '**お{父|とう}さん** otousan'],
        ['mẹ', '**{母|はは}** haha', '**お{母|かあ}さん** okaasan'],
        ['anh chị em', '**{兄弟|きょうだい}** kyoudai', 'ご{兄弟|きょうだい} gokyoudai'],
        ['anh trai', '**{兄|あに}** ani', '**お{兄|にい}さん** oniisan'],
        ['chị gái', '**{姉|あね}** ane', '**お{姉|ねえ}さん** oneesan'],
        ['em trai', '**{弟|おとうと}** otouto', '**{弟|おとうと}さん** otoutosan'],
        ['em gái', '**{妹|いもうと}** imouto', '**{妹|いもうと}さん** imoutosan'],
        ['chồng', '**{夫|おっと}** otto ({主人|しゅじん} shujin)', '**ご{主人|しゅじん}** goshujin'],
        ['vợ', '**{妻|つま}** tsuma', '**{奥|おく}さん** okusan'],
        ['con', '**{子|こ}ども** kodomo', '**お{子|こ}さん** okosan'],
        ['con trai', '**{息子|むすこ}** musuko', '{息子|むすこ}さん musukosan'],
        ['con gái', '**{娘|むすめ}** musume', '{娘|むすめ}さん musumesan'],
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp — nhà mình hay nhà người ta?',
      items: [
        'Kể về nhà MÌNH với người ngoài: ~~{私|わたし}のお{母|かあ}さんは{先生|せんせい}です~~ → **{母|はは}は{先生|せんせい}です**. Dùng お{母|かあ}さん cho mẹ mình nghe như khoe khoang / trẻ con.',
        'Hỏi về nhà NGƯỜI KHÁC: ~~Bさんの{母|はは}は～~~ → **Bさんのお{母|かあ}さんは～**.',
        'Trong câu trả lời, người hỏi dùng từ tôn kính, người đáp đổi sang từ khiêm nhường: お{姉|ねえ}さんは{何|なに}をしていますか → **{姉|あね}は**{会社員|かいしゃいん}です.',
        'Chữ in đậm trong bảng là từ nằm trong trang ことば Bài 8; chữ thường là từ thêm của bảng p.289 — chỉ cần nghe hiểu.',
      ],
    },

    { t: 'h', text: 'C. 8-1 · Thú cưng, nghề, số đếm, động từ (10 từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'ペット', pos: 'danh từ', ipa: 'petto', vi: 'thú cưng', ex: 'ペットがいますか。——はい、{猫|ねこ}がいます。', exRo: 'Petto ga imasu ka. — Hai, neko ga imasu.', exVi: 'Bạn có nuôi thú cưng không? — Có, tôi có mèo.' },
        { w: '{猫|ねこ}', pos: 'danh từ', ipa: 'neko', vi: 'con mèo', ex: '{猫|ねこ}が{2匹|にひき}います。', exRo: 'Neko ga nihiki imasu.', exVi: 'Tôi có hai con mèo.' },
        { w: 'ピアノ', pos: 'danh từ', ipa: 'piano', vi: 'đàn piano', ex: '{妹|いもうと}はピアノが{上手|じょうず}です。', exRo: 'Imouto wa piano ga jouzu desu.', exVi: 'Em gái tôi chơi piano giỏi.' },
        { w: '{医者|いしゃ}', pos: 'danh từ', ipa: 'isha', vi: 'bác sĩ', ex: '{父|ちち}は{医者|いしゃ}です。{病院|びょういん}で{働|はたら}いています。', exRo: 'Chichi wa isha desu. Byouin de hataraite imasu.', exVi: 'Bố tôi là bác sĩ. Làm ở bệnh viện.' },
        { w: '{高校生|こうこうせい}', pos: 'danh từ', ipa: 'koukousei', vi: 'học sinh cấp 3 (THPT)', ex: '{妹|いもうと}は{高校生|こうこうせい}です。', exRo: 'Imouto wa koukousei desu.', exVi: 'Em gái tôi là học sinh cấp 3.' },
        { w: '{大学生|だいがくせい}', pos: 'danh từ', ipa: 'daigakusei', vi: 'sinh viên đại học', ex: '{弟|おとうと}は{大学生|だいがくせい}です。{大学|だいがく}で{絵|え}を{勉強|べんきょう}しています。', exRo: 'Otouto wa daigakusei desu. Daigaku de e o benkyou shite imasu.', exVi: 'Em trai tôi là sinh viên. Đang học hội hoạ ở đại học.' },
        { w: '～{人|にん}', pos: 'hậu tố đếm', ipa: '~nin', vi: '~ người (1 人 ひとり, 2 人 ふたり là đặc biệt; từ 3: さんにん…)', ex: '{家族|かぞく}は{5人|ごにん}です。', exRo: 'Kazoku wa gonin desu.', exVi: 'Nhà tôi có 5 người.' },
        { w: '～{匹|ひき}', pos: 'hậu tố đếm', ipa: '~hiki', vi: '~ con (động vật nhỏ: chó, mèo, cá, thỏ). 1 いっぴき, 3 さんびき, 6 ろっぴき…', ex: 'うさぎが{3匹|さんびき}います。', exRo: 'Usagi ga sanbiki imasu.', exVi: 'Có 3 con thỏ.' },
        { w: '{住|す}みます［{住|す}む］', pos: 'động từ nhóm 1', ipa: 'sumimasu [sumu]', vi: 'sống, cư trú (dùng dạng {住|す}んでいます; nơi ở + に)', ex: 'どこに{住|す}んでいますか。——{三鷹|みたか}に{住|す}んでいます。', exRo: 'Doko ni sunde imasu ka. — Mitaka ni sunde imasu.', exVi: 'Bạn sống ở đâu? — Tôi sống ở Mitaka.' },
        { w: 'います［いる］', pos: 'động từ nhóm 2', ipa: 'imasu [iru]', vi: 'có (người, con vật) — Bài 8: có anh chị em, có con, có thú cưng', ex: '{私|わたし}は{弟|おとうと}がいます。', exRo: 'Watashi wa otouto ga imasu.', exVi: 'Tôi có em trai. (câu mẫu của sách)' },
      ],
    },
    {
      t: 'table',
      caption: 'Đếm người ～人 và con vật ～匹 (表 p.287)',
      head: ['Số', '～人 (người)', '～匹 (con vật)'],
      rows: [
        ['1', '**ひとり** hitori', '**いっぴき** ippiki'],
        ['2', '**ふたり** futari', 'にひき nihiki'],
        ['3', 'さんにん sannin', '**さんびき** sanbiki'],
        ['4', '**よにん** yonin', 'よんひき yonhiki'],
        ['5', 'ごにん gonin', 'ごひき gohiki'],
        ['6', 'ろくにん rokunin', '**ろっぴき** roppiki'],
        ['7', 'しちにん／ななにん shichinin / nananin', 'ななひき nanahiki'],
        ['8', 'はちにん hachinin', '**はっぴき** happiki'],
        ['9', 'きゅうにん kyuunin', 'きゅうひき kyuuhiki'],
        ['10', 'じゅうにん juunin', '**じゅっぴき** juppiki'],
        ['?', '**{何人|なんにん}** nannin', '**{何匹|なんびき}** nanbiki'],
      ],
    },
    {
      t: 'note',
      title: 'Bẫy đếm',
      items: [
        '**{1人|ひとり}・{2人|ふたり}** đọc kiểu Nhật, không phải ~~いちにん・ににん~~. **{4人|よにん}** không phải ~~よんにん~~ hay ~~しにん~~.',
        '**～{匹|ひき}** đổi âm: ひき → **ぴき** sau 1, 6, 8, 10 (いっぴき, ろっぴき, はっぴき, じゅっぴき) và → **びき** sau 3 và {何|なん} (さんびき, なんびき).',
        '{何人|なんにん} = "mấy người" (đếm). Khác {何人|なにじん} = "người nước nào" (Bài 1) — cùng chữ Hán, khác cách đọc.',
      ],
    },

    /* ── 8-2 ── */
    { t: 'h', text: 'D. 8-2 · Người quanh mình & con thỏ (5 từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'ご{主人|しゅじん}', pos: 'danh từ', ipa: 'goshujin', vi: 'chồng (của người khác)', ex: 'ご{主人|しゅじん}は{何|なに}をしていますか。', exRo: 'Goshujin wa nani o shite imasu ka.', exVi: 'Chồng chị làm nghề gì ạ?' },
        { w: '{奥|おく}さん', pos: 'danh từ', ipa: 'okusan', vi: 'vợ (của người khác)', ex: 'この{人|ひと}は{田中|たなか}さんの{奥|おく}さんです。', exRo: 'Kono hito wa Tanaka-san no okusan desu.', exVi: 'Người này là vợ anh Tanaka.' },
        { w: '{先輩|せんぱい}', pos: 'danh từ', ipa: 'senpai', vi: 'đàn anh, đàn chị (người vào trường / công ty trước mình)', ex: 'リンさんは{大学|だいがく}の{先輩|せんぱい}です。', exRo: 'Rin-san wa daigaku no senpai desu.', exVi: 'Linh là đàn chị ở đại học.' },
        { w: '{後輩|こうはい}', pos: 'danh từ', ipa: 'kouhai', vi: 'đàn em (người vào sau mình)', ex: 'キムさんは{私|わたし}の{後輩|こうはい}です。まじめです。', exRo: 'Kimu-san wa watashi no kouhai desu. Majime desu.', exVi: 'Kim là đàn em của tôi. Chăm chỉ lắm.' },
        { w: 'うさぎ', pos: 'danh từ', ipa: 'usagi', vi: 'con thỏ', ex: 'うさぎは{耳|みみ}が{長|なが}いです。', exRo: 'Usagi wa mimi ga nagai desu.', exVi: 'Thỏ tai dài.' },
      ],
    },

    { t: 'h', text: 'E. 8-2 · Cơ thể (8 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{体|からだ}', pos: 'danh từ', ipa: 'karada', vi: 'cơ thể, thân hình', ex: '{兄|あに}は{体|からだ}が{大|おお}きいです。', exRo: 'Ani wa karada ga ookii desu.', exVi: 'Anh tôi to con.' },
        { w: '{足|あし}', pos: 'danh từ', ipa: 'ashi', vi: 'chân, bàn chân', ex: 'ダニエルさんは{足|あし}が{長|なが}いです。', exRo: 'Danieru-san wa ashi ga nagai desu.', exVi: 'Daniel chân dài.' },
        { w: '{顔|かお}', pos: 'danh từ', ipa: 'kao', vi: 'mặt, khuôn mặt', ex: '{妹|いもうと}は{顔|かお}が{小|ちい}さいです。', exRo: 'Imouto wa kao ga chiisai desu.', exVi: 'Em gái tôi mặt nhỏ.' },
        { w: '{髪|かみ}', pos: 'danh từ', ipa: 'kami', vi: 'tóc', ex: 'アンナさんは{髪|かみ}が{長|なが}いです。', exRo: 'Anna-san wa kami ga nagai desu.', exVi: 'Anna tóc dài.' },
        { w: '{口|くち}', pos: 'danh từ', ipa: 'kuchi', vi: 'miệng', ex: 'この{猫|ねこ}は{口|くち}が{小|ちい}さくて、かわいいです。', exRo: 'Kono neko wa kuchi ga chiisakute, kawaii desu.', exVi: 'Con mèo này miệng nhỏ, dễ thương.' },
        { w: '{鼻|はな}', pos: 'danh từ', ipa: 'hana', vi: 'mũi (cùng âm với {花|はな} "hoa")', ex: 'マルコさんは{鼻|はな}が{高|たか}いです。', exRo: 'Maruko-san wa hana ga takai desu.', exVi: 'Marco mũi cao.' },
        { w: '{目|め}', pos: 'danh từ', ipa: 'me', vi: 'mắt', ex: 'メアリーさんは{目|め}が{大|おお}きいです。', exRo: 'Mearii-san wa me ga ookii desu.', exVi: 'Mary mắt to.' },
        { w: '{耳|みみ}', pos: 'danh từ', ipa: 'mimi', vi: 'tai', ex: 'うさぎは{耳|みみ}が{長|なが}くて、{白|しろ}いです。', exRo: 'Usagi wa mimi ga nagakute, shiroi desu.', exVi: 'Con thỏ tai dài và trắng.' },
      ],
    },

    { t: 'h', text: 'F. 8-2 · Tính từ tả người (15 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{頭|あたま}がいい', pos: 'cụm tính từ (い)', ipa: 'atama ga ii', vi: 'thông minh, sáng dạ (nghĩa đen: đầu tốt). Nối: {頭|あたま}が**よくて**', ex: 'キムさんはまじめで、{頭|あたま}がいいです。', exRo: 'Kimu-san wa majime de, atama ga ii desu.', exVi: 'Kim chăm chỉ và thông minh.' },
        { w: 'かっこいい', pos: 'tính từ đuôi い', ipa: 'kakkoii', vi: 'đẹp trai, ngầu, phong độ (người, đồ vật). Nối: かっこ**よくて**', ex: 'お{兄|にい}さんはかっこいいですね。', exRo: 'Oniisan wa kakkoii desu ne.', exVi: 'Anh trai bạn đẹp trai nhỉ.' },
        { w: 'かわいい', pos: 'tính từ đuôi い', ipa: 'kawaii', vi: 'dễ thương, đáng yêu', ex: 'この{猫|ねこ}はかわいいですね。', exRo: 'Kono neko wa kawaii desu ne.', exVi: 'Con mèo này dễ thương nhỉ.' },
        { w: '{背|せ}が{高|たか}い', pos: 'cụm tính từ (い)', ipa: 'se ga takai', vi: 'cao (người). Thấp = {背|せ}が{低|ひく}い (từ thêm)', ex: '{父|ちち}は{背|せ}が{高|たか}いです。', exRo: 'Chichi wa se ga takai desu.', exVi: 'Bố tôi cao. (câu mẫu của sách)' },
        { w: '{長|なが}い', pos: 'tính từ đuôi い', ipa: 'nagai', vi: 'dài', ex: '{姉|あね}は{髪|かみ}が{長|なが}いです。', exRo: 'Ane wa kami ga nagai desu.', exVi: 'Chị tôi tóc dài.' },
        { w: '{短|みじか}い', pos: 'tính từ đuôi い', ipa: 'mijikai', vi: 'ngắn', ex: '{夫|おっと}は{髪|かみ}が{短|みじか}いです。', exRo: 'Otto wa kami ga mijikai desu.', exVi: 'Chồng tôi tóc ngắn.' },
        { w: '{優|やさ}しい', pos: 'tính từ đuôi い', ipa: 'yasashii', vi: 'hiền, dịu dàng, tốt bụng', ex: '{母|はは}は{優|やさ}しい{人|ひと}です。', exRo: 'Haha wa yasashii hito desu.', exVi: 'Mẹ tôi là người hiền.' },
        { w: '{黒|くろ}い', pos: 'tính từ đuôi い', ipa: 'kuroi', vi: 'đen', ex: 'ワンさんは{髪|かみ}が{黒|くろ}くて、{長|なが}いです。', exRo: 'Wan-san wa kami ga kurokute, nagai desu.', exVi: 'Wang tóc đen, dài.' },
        { w: '{白|しろ}い', pos: 'tính từ đuôi い', ipa: 'shiroi', vi: 'trắng', ex: '{白|しろ}いうさぎが{2匹|にひき}います。', exRo: 'Shiroi usagi ga nihiki imasu.', exVi: 'Có hai con thỏ trắng.' },
        { w: '{茶色|ちゃいろ}い', pos: 'tính từ đuôi い', ipa: 'chairoi', vi: 'màu nâu', ex: 'うちの{猫|ねこ}は{茶色|ちゃいろ}いです。', exRo: 'Uchi no neko wa chairoi desu.', exVi: 'Con mèo nhà tôi màu nâu.' },
        { w: '{元気|げんき}（な）', pos: 'tính từ đuôi な', ipa: 'genki (na)', vi: 'khoẻ mạnh, năng động, hăng hái', ex: 'ダニエルさんは{元気|げんき}で、おもしろいです。', exRo: 'Danieru-san wa genki de, omoshiroi desu.', exVi: 'Daniel năng động và vui tính.' },
        { w: '{親切|しんせつ}（な）', pos: 'tính từ đuôi な', ipa: 'shinsetsu (na)', vi: 'tử tế, tốt bụng (hay giúp người khác)', ex: 'アンナさんは{親切|しんせつ}な{人|ひと}です。', exRo: 'Anna-san wa shinsetsu na hito desu.', exVi: 'Anna là người tốt bụng.' },
        { w: 'まじめ（な）', pos: 'tính từ đuôi な', ipa: 'majime (na)', vi: 'nghiêm túc, chăm chỉ, đứng đắn', ex: 'ナタポンさんはまじめで、{親切|しんせつ}です。', exRo: 'Natapon-san wa majime de, shinsetsu desu.', exVi: 'Natapon chăm chỉ và tốt bụng. (câu của ポイント 75)' },
        { w: '{上手|じょうず}（な）', pos: 'tính từ đuôi な', ipa: 'jouzu (na)', vi: 'giỏi (một kỹ năng) — thường khen NGƯỜI KHÁC', ex: 'マルコさんはサッカーが{上手|じょうず}です。', exRo: 'Maruko-san wa sakkaa ga jouzu desu.', exVi: 'Marco đá bóng giỏi.' },
        { w: '{下手|へた}（な）', pos: 'tính từ đuôi な', ipa: 'heta (na)', vi: 'kém, dở (một kỹ năng)', ex: '{私|わたし}は{歌|うた}が{下手|へた}です。', exRo: 'Watashi wa uta ga heta desu.', exVi: 'Tôi hát dở.' },
      ],
    },
    {
      t: 'note',
      title: 'Dùng đúng tính từ tả người',
      items: [
        '**{上手|じょうず}** là lời KHEN — nói về bản thân ~~{私|わたし}は{日本語|にほんご}が{上手|じょうず}です~~ nghe tự cao. Về mình nói **{下手|へた}です** hoặc **あまり{上手|じょうず}じゃありません** (không giỏi lắm). Được khen thì đáp **いいえ、まだまだです** / **ありがとうございます**.',
        '**{背|せ}が{高|たか}い** dùng cho NGƯỜI (cao). Toà nhà, núi cao chỉ nói **{高|たか}い**. {高|たか}い còn nghĩa "đắt" (Bài 2) — ngữ cảnh quyết định.',
        '**いい → よくて**: {頭|あたま}がいい → {頭|あたま}が**よくて**, かっこいい → かっこ**よくて** (không phải ~~いくて~~).',
        '**{元気|げんき}・{親切|しんせつ}・まじめ・{上手|じょうず}・{下手|へた}** là tính từ な: đứng trước danh từ cần な ({親切|しんせつ}**な**{人|ひと}); nối câu dùng で ({元気|げんき}**で**、…).',
        '**{茶色|ちゃいろ}い** là tính từ い (từ {茶色|ちゃいろ} "màu nâu" + い) — {茶色|ちゃいろ}いかばん. {黒|くろ}い, {白|しろ}い cũng thế.',
      ],
    },

    /* ── 8-3 ── */
    { t: 'h', text: 'G. 8-3 · Đồ làm quà & liên lạc (11 từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'カード', pos: 'danh từ', ipa: 'kaado', vi: 'thiệp (chúc mừng); thẻ', ex: '{友達|ともだち}の{誕生日|たんじょうび}にカードを{送|おく}ります。', exRo: 'Tomodachi no tanjoubi ni kaado o okurimasu.', exVi: 'Tôi gửi thiệp nhân sinh nhật bạn. (câu mẫu của sách)' },
        { w: '{傘|かさ}', pos: 'danh từ', ipa: 'kasa', vi: 'cái ô, cái dù', ex: 'この{傘|かさ}はパクさんにもらいました。', exRo: 'Kono kasa wa Paku-san ni moraimashita.', exVi: 'Cái ô này tôi nhận của Park.' },
        { w: '（お）{金|かね}', pos: 'danh từ', ipa: '(o)kane', vi: 'tiền', ex: '{誕生日|たんじょうび}に{祖母|そぼ}がお{金|かね}をくれました。', exRo: 'Tanjoubi ni sobo ga okane o kuremashita.', exVi: 'Sinh nhật, bà cho tôi tiền.' },
        { w: '{靴下|くつした}', pos: 'danh từ', ipa: 'kutsushita', vi: 'tất, vớ', ex: 'クリスマスに{父|ちち}に{靴下|くつした}をあげました。', exRo: 'Kurisumasu ni chichi ni kutsushita o agemashita.', exVi: 'Giáng sinh tôi tặng bố đôi tất.' },
        { w: '{辞書|じしょ}', pos: 'danh từ', ipa: 'jisho', vi: 'từ điển', ex: '{先輩|せんぱい}に{辞書|じしょ}をもらいました。', exRo: 'Senpai ni jisho o moraimashita.', exVi: 'Tôi nhận quyển từ điển của đàn anh.' },
        { w: 'チョコレート', pos: 'danh từ', ipa: 'chokoreeto', vi: 'sô-cô-la', ex: 'バレンタインデーにチョコレートをあげます。', exRo: 'Barentaindee ni chokoreeto o agemasu.', exVi: 'Ngày Valentine tặng sô-cô-la.' },
        { w: '{手紙|てがみ}', pos: 'danh từ', ipa: 'tegami', vi: 'lá thư, thư tay', ex: '{母|はは}に{手紙|てがみ}を{書|か}きました。', exRo: 'Haha ni tegami o kakimashita.', exVi: 'Tôi đã viết thư cho mẹ.' },
        { w: 'ネックレス', pos: 'danh từ', ipa: 'nekkuresu', vi: 'dây chuyền, vòng cổ', ex: '{恋人|こいびと}がネックレスをくれました。', exRo: 'Koibito ga nekkuresu o kuremashita.', exVi: 'Người yêu tặng tôi dây chuyền.' },
        { w: 'ノート', pos: 'danh từ', ipa: 'nooto', vi: 'quyển vở', ex: '{妹|いもうと}にかわいいノートをあげました。', exRo: 'Imouto ni kawaii nooto o agemashita.', exVi: 'Tôi tặng em gái quyển vở dễ thương.' },
        { w: 'プレゼント', pos: 'danh từ', ipa: 'purezento', vi: 'quà tặng', ex: '{誕生日|たんじょうび}のプレゼントは{何|なに}がいいですか。', exRo: 'Tanjoubi no purezento wa nani ga ii desu ka.', exVi: 'Quà sinh nhật thì cái gì được nhỉ?' },
        { w: 'メール', pos: 'danh từ', ipa: 'meeru', vi: 'email, tin nhắn (điện thoại)', ex: '{毎日|まいにち}、{母|はは}にメールを{送|おく}ります。', exRo: 'Mainichi, haha ni meeru o okurimasu.', exVi: 'Hằng ngày tôi gửi tin nhắn cho mẹ.' },
      ],
    },

    { t: 'h', text: 'H. 8-3 · Người & dịp tặng quà (4 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{祖母|そぼ}', pos: 'danh từ', ipa: 'sobo', vi: 'bà (của mình). Bà của người khác: おばあさん', ex: '{祖母|そぼ}はハノイに{住|す}んでいます。', exRo: 'Sobo wa Hanoi ni sunde imasu.', exVi: 'Bà tôi sống ở Hà Nội.' },
        { w: 'クリスマス', pos: 'danh từ', ipa: 'kurisumasu', vi: 'Giáng sinh, Noel', ex: 'クリスマスに{何|なに}をもらいましたか。', exRo: 'Kurisumasu ni nani o moraimashita ka.', exVi: 'Giáng sinh bạn nhận được gì?' },
        { w: '{結婚式|けっこんしき}', pos: 'danh từ', ipa: 'kekkonshiki', vi: 'lễ cưới, đám cưới', ex: '{来月|らいげつ}、{田中|たなか}さんの{結婚式|けっこんしき}があります。', exRo: 'Raigetsu, Tanaka-san no kekkonshiki ga arimasu.', exVi: 'Tháng sau có đám cưới anh Tanaka.' },
        { w: 'バレンタインデー', pos: 'danh từ', ipa: 'barentaindee', vi: 'ngày Valentine (14/2)', ex: 'バレンタインデーに{恋人|こいびと}にチョコレートをもらいました。', exRo: 'Barentaindee ni koibito ni chokoreeto o moraimashita.', exVi: 'Ngày Valentine tôi nhận sô-cô-la của người yêu.' },
      ],
    },

    { t: 'h', text: 'I. 8-3 · Động từ cho–nhận & câu nói (8 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{何|なに}か', pos: 'đại từ', ipa: 'nanika', vi: 'cái gì đó (không xác định)', ex: 'マリヤムさんに{何|なに}かあげませんか。', exRo: 'Mariyamu-san ni nanika agemasen ka.', exVi: 'Mình tặng Mariyam cái gì đó không?' },
        { w: '{送|おく}ります［{送|おく}る］', pos: 'động từ nhóm 1', ipa: 'okurimasu [okuru]', vi: 'gửi (thư, quà, email)', ex: '{国|くに}の{両親|りょうしん}に{写真|しゃしん}を{送|おく}ります。', exRo: 'Kuni no ryoushin ni shashin o okurimasu.', exVi: 'Tôi gửi ảnh cho bố mẹ ở quê.' },
        { w: 'もらいます［もらう］', pos: 'động từ nhóm 1', ipa: 'moraimasu [morau]', vi: 'nhận (người cho + に／から)', ex: '{姉|あね}にカメラをもらいました。', exRo: 'Ane ni kamera o moraimashita.', exVi: 'Tôi nhận máy ảnh của chị gái.' },
        { w: 'あげます［あげる］', pos: 'động từ nhóm 2', ipa: 'agemasu [ageru]', vi: 'cho, tặng (người nhận + に; KHÔNG dùng khi người nhận là tôi)', ex: 'カルロスさんはパクさんに{花|はな}をあげました。', exRo: 'Karurosu-san wa Paku-san ni hana o agemashita.', exVi: 'Carlos tặng hoa cho Park. (câu của ポイント 76)' },
        { w: 'くれます［くれる］', pos: 'động từ nhóm 2', ipa: 'kuremasu [kureru]', vi: 'cho, tặng (người khác → TÔI / người nhà tôi)', ex: 'メアリーさんが{私|わたし}にかばんをくれました。', exRo: 'Mearii-san ga watashi ni kaban o kuremashita.', exVi: 'Mary tặng tôi cái túi. (câu của ポイント 78)' },
        { w: '{電話|でんわ}します［{電話|でんわ}する］', pos: 'động từ nhóm 3', ipa: 'denwa shimasu [denwa suru]', vi: 'gọi điện (người được gọi + に)', ex: '{毎週|まいしゅう}、{母|はは}に{電話|でんわ}します。', exRo: 'Maishuu, haha ni denwa shimasu.', exVi: 'Hằng tuần tôi gọi điện cho mẹ.' },
        { w: 'もうすぐ', pos: 'phó từ', ipa: 'mousugu', vi: 'sắp, sắp sửa', ex: 'もうすぐ、パクさんの{誕生日|たんじょうび}ですね。', exRo: 'Mousugu, Paku-san no tanjoubi desu ne.', exVi: 'Sắp đến sinh nhật Park rồi nhỉ.' },
        { w: 'よかったですね', pos: 'câu nói', ipa: 'yokatta desu ne', vi: 'tốt quá nhỉ, mừng cho bạn (khi nghe chuyện vui của người khác)', ex: '{友達|ともだち}がCDをくれました。——そうですか。よかったですね。', exRo: 'Tomodachi ga shiidii o kuremashita. — Sou desu ka. Yokatta desu ne.', exVi: 'Bạn tặng mình CD. — Vậy à. Tốt quá nhỉ.' },
      ],
    },

    { t: 'h', text: 'J. Từ cuối trang もう{一度|いちど}{聞|き}こう p.152 (3 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{経済|けいざい}', pos: 'danh từ', ipa: 'keizai', vi: 'kinh tế', ex: '{弟|おとうと}は{大学|だいがく}で{経済|けいざい}を{勉強|べんきょう}しています。', exRo: 'Otouto wa daigaku de keizai o benkyou shite imasu.', exVi: 'Em trai tôi đang học kinh tế ở đại học.' },
        { w: '{結婚|けっこん}します［{結婚|けっこん}する］', pos: 'động từ nhóm 3', ipa: 'kekkon shimasu [kekkon suru]', vi: 'kết hôn, cưới. "Đã có gia đình" = {結婚|けっこん}しています', ex: '{姉|あね}は{結婚|けっこん}しています。{子|こ}どもが{1人|ひとり}います。', exRo: 'Ane wa kekkon shite imasu. Kodomo ga hitori imasu.', exVi: 'Chị tôi đã lập gia đình. Có một con.' },
        { w: '{素敵|すてき}（な）', pos: 'tính từ đuôi な', ipa: 'suteki (na)', vi: 'đẹp, tuyệt, dễ thương (khen đồ vật, người)', ex: 'そのかばん、{素敵|すてき}ですね。', exRo: 'Sono kaban, suteki desu ne.', exVi: 'Cái túi đó đẹp nhỉ.' },
      ],
    },
    {
      t: 'note',
      title: 'Nhầm lẫn hay gặp trong từ bài 8',
      items: [
        '**{鼻|はな}** (mũi) và **{花|はな}** (hoa, Bài 7) cùng đọc はな — nghe ngữ cảnh: {鼻|はな}が{高|たか}い (mũi cao) ↔ {花|はな}をあげます (tặng hoa).',
        '**{髪|かみ}** (tóc) và **{紙|かみ}** (giấy) cùng đọc かみ; {手紙|てがみ} (thư) có chữ {紙|かみ} giấy → がみ.',
        '**あげます / くれます** đều là "cho", khác nhau ở **người nhận**: người nhận là TÔI (hoặc người nhà tôi) → **くれます**; còn lại → **あげます**. Xem Ngữ pháp ポイント 76–78.',
        '**よかったですね** mừng cho NGƯỜI KHÁC; khi chính mình may mắn nói **よかった！** (Bài 6).',
        '**{子|こ}ども** là con của mình / trẻ con nói chung; hỏi con người khác dùng **お{子|こ}さん**.',
      ],
    },
    { t: 'h', text: 'Từ thêm (sách có trong bài / bảng p.289, không nằm trong trang ことば — chỉ cần nghe hiểu)' },
    {
      t: 'table',
      head: ['Từ / câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['{大切|たいせつ}（な）', 'taisetsu (na)', 'Quan trọng, quý giá (tên bài: {大切|たいせつ}な{人|ひと})'],
        ['{家族|かぞく}／ご{家族|かぞく}', 'kazoku / gokazoku', 'Gia đình (mình / người khác)'],
        ['{祖父|そふ}／おじいさん／おばあさん', 'sofu / ojiisan / obaasan', 'Ông (mình) / ông, bà (người khác)'],
        ['{主人|しゅじん}', 'shujin', 'Chồng (tôi) — cách nói khác của {夫|おっと}'],
        ['{中学生|ちゅうがくせい}', 'chuugakusei', 'Học sinh cấp 2 (có trong ví dụ ポイント 75)'],
        ['{思|おも}い{出|で}', 'omoide', 'Kỷ niệm (mục できる!)'],
        ['{紹介|しょうかい}します', 'shoukai shimasu', 'Giới thiệu'],
        ['{毎週|まいしゅう}', 'maishuu', 'Mỗi tuần, hằng tuần (bài đọc 話読聞書)'],
        ['{教|おし}え{方|かた}', 'oshiekata', 'Cách dạy (ポイント 66, Bài 7)'],
        ['すごいですね', 'sugoi desu ne', 'Giỏi quá / ghê thật'],
        ['{花屋|はなや}', 'hanaya', 'Tiệm hoa'],
        ['{恋人|こいびと}', 'koibito', 'Người yêu (Bài 5)'],
        ['{背|せ}が{低|ひく}い', 'se ga hikui', 'Thấp (người)'],
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b8-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp — ポイント 72–80: đang sống ở, làm nghề, tả người, cho – nhận',
  goal: 'Nói nơi ở và nghề bằng Vています, đếm người – con vật và nói "sống mấy người", tả người bằng N1はN2がA và nối hai tính từ bằng ～くて／～で, dùng đúng あげます・もらいます・くれます.',
  minutes: 80,
  blocks: [
    {
      t: 'p',
      text: 'Bài 8 có **9 điểm ngữ pháp** (ポイント 72–80), chia ba cụm theo ba tình huống của bài: **gia đình – bạn bè** (72, 73, 79, 80), **người thế nào** (74, 75), **quà tặng** (76, 77, 78). Hình thái mới duy nhất là **thể て của tính từ và danh từ** (～くて／～で); thể て của động từ bạn đã học ở Bài 7.',
    },
    {
      t: 'table',
      caption: 'Bản đồ 9 điểm ngữ pháp',
      head: ['ポイント', 'Mẫu', 'Nghĩa', 'Ví dụ ngắn'],
      rows: [
        ['72', 'V て います (trạng thái kéo dài)', 'Đang sống ở, đã kết hôn…', '{横浜|よこはま}に{住|す}んでいます。'],
        ['73', 'V て います (nghề, việc làm thường xuyên)', 'Làm việc ở, dạy ở, học ở…', '{高校|こうこう}で{英語|えいご}を{教|おし}えています。'],
        ['74', 'N1 は N2 が A です', 'N1 thì N2 (bộ phận / kỹ năng) A', 'ダニエルさんは{背|せ}が{高|たか}いです。'],
        ['75', 'イA‑くて、～ ／ ナA・N で、～', 'Nối hai ý: "… và …"', '{目|め}が{大|おお}きくて、{髪|かみ}が{長|なが}いです。'],
        ['76', 'N1(người) に N2(vật) を あげます', 'Cho, tặng (ai đó)', 'パクさんに{花|はな}をあげました。'],
        ['77', 'N1(người) に N2(vật) を もらいます', 'Nhận (từ ai đó)', 'カルロスさんに{花|はな}をもらいました。'],
        ['78', 'N1(người) が (私に) N2 を くれます', '(Người khác) cho TÔI', 'メアリーさんが{私|わたし}にかばんをくれました。'],
        ['79', 'N(người) が (～人) います', 'Có (mấy) anh chị em, con…', '{私|わたし}は{妹|いもうと}が{2人|ふたり}います。'],
        ['80', '[～人] で', 'Làm gì (sống…) với tổng cộng ~ người', 'ルームメイトと{3人|さんにん}で{住|す}んでいます。'],
      ],
    },
    {
      t: 'note',
      title: 'Ôn nhanh thể て của động từ (Bài 7) — cần cho ポイント 72, 73',
      items: [
        'Nhóm 1: ～み・～び・～に ます → **んで**: {住|す}みます → **{住|す}んで**, {飲|の}みます → {飲|の}んで, {遊|あそ}びます → {遊|あそ}んで.',
        'Nhóm 1: ～き ます → **いて**: {働|はたら}きます → **{働|はたら}いて**, {書|か}きます → {書|か}いて (ngoại lệ: {行|い}きます → **{行|い}って**).',
        'Nhóm 1: ～い・～ち・～り ます → **って**: {使|つか}います → {使|つか}って, {待|ま}ちます → {待|ま}って, {作|つく}ります → {作|つく}って. ～し ます → **して**: {話|はな}します → {話|はな}して.',
        'Nhóm 2: bỏ ます + **て**: {教|おし}えます → **{教|おし}えて**, {見|み}ます → {見|み}て. Nhóm 3: します → **して** ({勉強|べんきょう}して, {結婚|けっこん}して), {来|き}ます → {来|き}て.',
      ],
    },

    /* ── ポイント 72 ── */
    { t: 'h', text: 'ポイント 72 — V て います (trạng thái: đang sống ở…, đã kết hôn)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1（người）は N2（nơi）に {住|す}んでいます。',
          vi: 'Đang sống ở N2. {住|す}みます gần như luôn dùng ở dạng **～ています** — chỉ một **trạng thái đang kéo dài** (đã dọn đến và vẫn đang ở đó). Nơi ở đi với **に** (không phải で).',
          examples: [
            { en: '{私|わたし}は{横浜|よこはま}に{住|す}んでいます。', ro: 'Watashi wa Yokohama ni sunde imasu.', vi: 'Tôi đang sống ở Yokohama. (câu của sách)' },
            { en: '{両親|りょうしん}はハノイに{住|す}んでいます。', ro: 'Ryoushin wa Hanoi ni sunde imasu.', vi: 'Bố mẹ tôi sống ở Hà Nội.' },
            { en: '{兄|あに}は{大阪|おおさか}に{住|す}んでいます。', ro: 'Ani wa Oosaka ni sunde imasu.', vi: 'Anh trai tôi sống ở Osaka.' },
          ],
        },
        {
          formula: 'N は {結婚|けっこん}しています。',
          vi: 'Đã kết hôn (và đang trong tình trạng có gia đình). Cũng là trạng thái kéo dài → ～ています. Chưa kết hôn: {結婚|けっこん}していません.',
          examples: [
            { en: '{姉|あね}は{結婚|けっこん}しています。', ro: 'Ane wa kekkon shite imasu.', vi: 'Chị tôi đã lập gia đình.' },
            { en: 'この{人|ひと}は{結婚|けっこん}していますか。——はい、{子|こ}どもが{2人|ふたり}います。', ro: 'Kono hito wa kekkon shite imasu ka. — Hai, kodomo ga futari imasu.', vi: 'Người này đã có gia đình chưa? — Rồi, có hai con.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: sống ở đâu?',
      lines: [
        { who: 'A', role: 'a', text: 'Bさんはどこに{住|す}んでいますか。', ro: 'B-san wa doko ni sunde imasu ka.', vi: 'B đang sống ở đâu?' },
        { who: 'B', role: 'b', text: '{上野|うえの}に{住|す}んでいます。', ro: 'Ueno ni sunde imasu.', vi: 'Tôi sống ở Ueno.' },
        { who: 'A', role: 'a', text: 'ご{家族|かぞく}もいっしょですか。', ro: 'Gokazoku mo issho desu ka.', vi: 'Gia đình bạn cũng sống cùng à?' },
        { who: 'B', role: 'b', text: 'いいえ、{家族|かぞく}はベトナムに{住|す}んでいます。', ro: 'Iie, kazoku wa Betonamu ni sunde imasu.', vi: 'Không, gia đình tôi sống ở Việt Nam.' },
        { who: 'A', role: 'a', text: 'お{姉|ねえ}さんは{結婚|けっこん}していますか。', ro: 'Oneesan wa kekkon shite imasu ka.', vi: 'Chị gái bạn lập gia đình chưa?' },
        { who: 'B', role: 'b', text: 'はい、{結婚|けっこん}しています。／いいえ、{結婚|けっこん}していません。', ro: 'Hai, kekkon shite imasu. / Iie, kekkon shite imasen.', vi: 'Rồi. / Chưa.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — ai sống ở đâu',
      head: ['Ai は', 'nơi に', '{住|す}んでいます。'],
      rows: [
        ['{私|わたし}は', '{三鷹|みたか}に', '{住|す}んでいます。'],
        ['{父|ちち}と{母|はは}は', 'ハノイに', '{住|す}んでいます。'],
        ['{兄|あに}は', '{東京|とうきょう}に', '{住|す}んでいます。'],
        ['{祖母|そぼ}は', 'ダナンに', '{住|す}んでいます。'],
        ['ナタポンさんは', '{学校|がっこう}の{近|ちか}くに', '{住|す}んでいます。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với {住|す}んでいます',
      items: [
        'Sai trợ từ: ~~{横浜|よこはま}で{住|す}んでいます~~ → **{横浜|よこはま}に**{住|す}んでいます. {住|す}みます đi với **に** (nơi tồn tại), giống {横浜|よこはま}**に**います.',
        'Dùng thể ます trần: ~~{横浜|よこはま}に{住|す}みます~~ nghe như "(sắp) sẽ sống ở Yokohama". Nói nơi đang ở → **{住|す}んでいます**.',
        'Thể て: {住|す}みます → **{住|す}んで** (み → んで), không phải ~~{住|す}みて~~.',
        'Thi nói: câu 「いま どこに すんでいますか」 có trong bộ câu hỏi về bản thân — đáp **(thành phố) に すんでいます**.',
      ],
    },

    /* ── ポイント 73 ── */
    { t: 'h', text: 'ポイント 73 — V て います (nghề nghiệp, việc làm thường xuyên)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1（người）は N2（nơi）で V ています。',
          vi: 'Nói **nghề / việc đang làm lâu dài** (không phải đúng lúc này): làm việc ở đâu, dạy gì, học gì ở đâu. Nơi làm việc đi với **で** (nơi diễn ra hành động).',
          examples: [
            { en: '{友達|ともだち}は{高校|こうこう}で{英語|えいご}を{教|おし}えています。', ro: 'Tomodachi wa koukou de eigo o oshiete imasu.', vi: 'Bạn tôi dạy tiếng Anh ở trường cấp 3. (câu của sách)' },
            { en: '{姉|あね}はデパートで{働|はたら}いています。', ro: 'Ane wa depaato de hataraite imasu.', vi: 'Chị tôi làm việc ở trung tâm thương mại.' },
            { en: '{弟|おとうと}は{大学|だいがく}で{経済|けいざい}を{勉強|べんきょう}しています。', ro: 'Otouto wa daigaku de keizai o benkyou shite imasu.', vi: 'Em trai tôi học kinh tế ở đại học.' },
            { en: '{父|ちち}は{銀行|ぎんこう}で{働|はたら}いています。', ro: 'Chichi wa ginkou de hataraite imasu.', vi: 'Bố tôi làm ở ngân hàng.' },
          ],
        },
        {
          formula: 'N は {何|なに}を していますか。',
          vi: 'Hỏi nghề nghiệp: "(người đó) làm gì?" — tự nhiên hơn {仕事|しごと}は{何|なん}ですか khi hỏi về người nhà của người đối diện.',
          examples: [
            { en: 'お{父|とう}さんは{何|なに}をしていますか。——{父|ちち}は{医者|いしゃ}です。{病院|びょういん}で{働|はたら}いています。', ro: 'Otousan wa nani o shite imasu ka. — Chichi wa isha desu. Byouin de hataraite imasu.', vi: 'Bố bạn làm gì? — Bố tôi là bác sĩ. Làm ở bệnh viện.' },
            { en: 'お{兄|にい}さんは{何|なに}をしていますか。——{兄|あに}は{大学生|だいがくせい}です。', ro: 'Oniisan wa nani o shite imasu ka. — Ani wa daigakusei desu.', vi: 'Anh bạn làm gì? — Anh tôi là sinh viên.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Ba nghĩa của V ています — đã học đủ ba',
      head: ['Nghĩa', 'Ví dụ', 'Romaji', 'ポイント'],
      rows: [
        ['Đang làm (ngay lúc này)', 'パクさんは{今|いま}、{電話|でんわ}をかけています。', 'Paku-san wa ima, denwa o kakete imasu.', '64 (Bài 7)'],
        ['Trạng thái kéo dài (kết quả của một việc)', '{横浜|よこはま}に{住|す}んでいます。／{結婚|けっこん}しています。', 'Yokohama ni sunde imasu. / Kekkon shite imasu.', '72'],
        ['Nghề, việc làm lặp lại lâu dài', '{高校|こうこう}で{英語|えいご}を{教|おし}えています。', 'Koukou de eigo o oshiete imasu.', '73'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — ai làm gì ở đâu (dùng cho 言ってみよう số 4)',
      head: ['Ai', 'Nghề', 'nơi で V ています'],
      rows: [
        ['{父|ちち}', '{医者|いしゃ}です。', '{病院|びょういん}で{働|はたら}いています。'],
        ['{母|はは}', '{高校|こうこう}の{先生|せんせい}です。', '{高校|こうこう}で{英語|えいご}を{教|おし}えています。'],
        ['{姉|あね}', '{会社員|かいしゃいん}です。', 'デパートで{働|はたら}いています。'],
        ['{弟|おとうと}', '{大学生|だいがくせい}です。', '{大学|だいがく}で{絵|え}を{勉強|べんきょう}しています。'],
        ['{妹|いもうと}', '{高校生|こうこうせい}です。', '{高校|こうこう}で{日本語|にほんご}を{勉強|べんきょう}しています。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ポイント 73',
      items: [
        'Trợ từ nơi làm việc là **で**: ~~{病院|びょういん}に{働|はたら}いています~~ → **{病院|びょういん}で**{働|はたら}いています. (Còn {住|す}んでいます thì **に** — hai câu này hay bị lẫn.)',
        'Đừng dùng thể ます trần cho nghề nghiệp của một người cụ thể: 「{姉|あね}はデパートで{働|はたら}きます」 nghe như lịch hằng ngày; kể nghề → **{働|はたら}いています**.',
        'Trả lời 「{何|なに}をしていますか」 bằng nghề: ~~{父|ちち}は{病院|びょういん}をしています~~ → **{父|ちち}は{医者|いしゃ}です**。{病院|びょういん}で{働|はたら}いています。',
      ],
    },

    /* ── ポイント 79 ── */
    { t: 'h', text: 'ポイント 79 — N(người) が (～人) います (có mấy anh chị em, con…)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（{私|わたし}は）N（người, con vật）が（số lượng）います。',
          vi: 'Nói **mình có** anh chị em / con / thú cưng. Người, con vật → **います** (đồ vật → あります). Số đếm đứng ngay trước います, **không có trợ từ** sau số.',
          examples: [
            { en: '{私|わたし}は{妹|いもうと}が{2人|ふたり}います。', ro: 'Watashi wa imouto ga futari imasu.', vi: 'Tôi có hai em gái. (câu của sách)' },
            { en: '{私|わたし}は{弟|おとうと}がいます。', ro: 'Watashi wa otouto ga imasu.', vi: 'Tôi có em trai. (câu mẫu trang ことば)' },
            { en: '{兄|あに}が{1人|ひとり}と{姉|あね}が{1人|ひとり}います。', ro: 'Ani ga hitori to ane ga hitori imasu.', vi: 'Tôi có một anh trai và một chị gái.' },
            { en: '{猫|ねこ}が{3匹|さんびき}います。', ro: 'Neko ga sanbiki imasu.', vi: 'Tôi có ba con mèo.' },
          ],
        },
        {
          formula: 'N が いますか。——はい、います。／いいえ、いません。',
          vi: 'Câu hỏi có/không. Hỏi số lượng: **N が {何人|なんにん}いますか** / **{何匹|なんびき}いますか**.',
          examples: [
            { en: '{兄弟|きょうだい}がいますか。——はい、{姉|あね}が{1人|ひとり}います。／いいえ、いません。', ro: 'Kyoudai ga imasu ka. — Hai, ane ga hitori imasu. / Iie, imasen.', vi: 'Bạn có anh chị em không? — Có, một chị gái. / Không có.' },
            { en: '{兄弟|きょうだい}が{何人|なんにん}いますか。——{3人|さんにん}います。', ro: 'Kyoudai ga nannin imasu ka. — Sannin imasu.', vi: 'Bạn có mấy anh chị em? — Ba người.' },
            { en: 'ペットがいますか。——はい、うさぎが{1匹|いっぴき}います。', ro: 'Petto ga imasu ka. — Hai, usagi ga ippiki imasu.', vi: 'Bạn có thú cưng không? — Có, một con thỏ.' },
          ],
        },
        {
          formula: '{家族|かぞく}は {何人|なんにん}ですか。——～{人|にん}です。',
          vi: 'Hỏi cả nhà mấy người (tính cả mình) — trả lời bằng **～人です**, rồi kể ra từng người với と.',
          examples: [
            { en: '{家族|かぞく}は{何人|なんにん}ですか。——{5人|ごにん}です。{父|ちち}と{母|はは}と{兄|あに}と{妹|いもうと}と{私|わたし}です。', ro: 'Kazoku wa nannin desu ka. — Gonin desu. Chichi to haha to ani to imouto to watashi desu.', vi: 'Nhà bạn mấy người? — Năm người. Bố, mẹ, anh trai, em gái và tôi.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: anh chị em, con, thú cưng (言ってみよう số 3)',
      lines: [
        { who: 'A', role: 'a', text: 'Bさん、{兄弟|きょうだい}がいますか。', ro: 'B-san, kyoudai ga imasu ka.', vi: 'B có anh chị em không?' },
        { who: 'B', role: 'b', text: 'はい、{兄|あに}が{2人|ふたり}います。', ro: 'Hai, ani ga futari imasu.', vi: 'Có, tôi có hai anh trai.' },
        { who: 'A', role: 'a', text: 'ペットがいますか。', ro: 'Petto ga imasu ka.', vi: 'Bạn có thú cưng không?' },
        { who: 'B', role: 'b', text: 'いいえ、いません。', ro: 'Iie, imasen.', vi: 'Không có.' },
        { who: 'A', role: 'a', text: 'お{子|こ}さんがいますか。', ro: 'Okosan ga imasu ka.', vi: 'Anh/chị có con không?' },
        { who: 'B', role: 'b', text: 'はい、{息子|むすこ}が{1人|ひとり}と{娘|むすめ}が{1人|ひとり}います。', ro: 'Hai, musuko ga hitori to musume ga hitori imasu.', vi: 'Có, một con trai và một con gái.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế',
      head: ['{私|わたし}は', 'N が', 'số', 'います。'],
      rows: [
        ['{私|わたし}は', '{姉|あね}が', '{1人|ひとり}', 'います。'],
        ['{私|わたし}は', '{弟|おとうと}が', '{2人|ふたり}', 'います。'],
        ['{私|わたし}は', '{兄弟|きょうだい}が', '{4人|よにん}', 'います。'],
        ['{私|わたし}は', '{子|こ}どもが', '{3人|さんにん}', 'います。'],
        ['{私|わたし}は', '{猫|ねこ}が', '{6匹|ろっぴき}', 'います。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ポイント 79',
      items: [
        'Người / con vật dùng **います**: ~~{妹|いもうと}があります~~ → {妹|いもうと}が**います**.',
        'Không thêm trợ từ sau số: ~~{妹|いもうと}が{2人|ふたり}が／を います~~ → {妹|いもうと}が**{2人|ふたり}**います.',
        'Đọc số người: **ひとり・ふたり・さんにん・よにん** — sai ~~いちにん／ににん／よんにん~~ là lỗi phát âm bị trừ điểm.',
        'Không có anh chị em: **いいえ、いません** (hoặc {兄弟|きょうだい}はいません). Người Nhật hay nói 「{一人|ひとり}っ{子|こ}です」 (con một) — từ thêm, chỉ cần nghe hiểu.',
        '{兄弟|きょうだい} (anh chị em) KHÔNG tính bản thân; {家族|かぞく}は～{人|にん}です thì TÍNH cả bản thân.',
      ],
    },

    /* ── ポイント 80 ── */
    { t: 'h', text: 'ポイント 80 — [～人] で (sống… cùng tổng cộng ~ người)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（N と）～{人|にん} で V ます／V ています。',
          vi: 'Số người + **で** = "với tổng cộng ~ người" (TÍNH CẢ MÌNH). Thêm N と phía trước để nói là ai.',
          examples: [
            { en: '{私|わたし}はルームメイトと{3人|さんにん}で{住|す}んでいます。', ro: 'Watashi wa ruumumeito to sannin de sunde imasu.', vi: 'Tôi sống ba người cùng bạn cùng phòng. (câu của sách: tôi + 2 bạn cùng phòng)' },
            { en: '{兄|あに}と{2人|ふたり}で{住|す}んでいます。', ro: 'Ani to futari de sunde imasu.', vi: 'Tôi sống hai người với anh trai.' },
            { en: '{友達|ともだち}と{4人|よにん}で{旅行|りょこう}に{行|い}きました。', ro: 'Tomodachi to yonin de ryokou ni ikimashita.', vi: 'Tôi đi du lịch cùng bạn bè, tổng cộng bốn người.' },
          ],
        },
        {
          formula: '{1人|ひとり}で V ます。',
          vi: '**{1人|ひとり}で** = một mình. Hỏi: **{誰|だれ}と{住|す}んでいますか** (sống với ai?) → **{1人|ひとり}で{住|す}んでいます** hoặc **N と ～人で{住|す}んでいます**.',
          examples: [
            { en: '{1人|ひとり}で{住|す}んでいますか。——いいえ、{友達|ともだち}と{2人|ふたり}で{住|す}んでいます。', ro: 'Hitori de sunde imasu ka. — Iie, tomodachi to futari de sunde imasu.', vi: 'Bạn sống một mình à? — Không, tôi sống hai người với bạn.' },
            { en: 'Bさんは{誰|だれ}と{住|す}んでいますか。——{家族|かぞく}と{住|す}んでいます。', ro: 'B-san wa dare to sunde imasu ka. — Kazoku to sunde imasu.', vi: 'B sống với ai? — Tôi sống với gia đình.' },
            { en: '{週末|しゅうまつ}、{1人|ひとり}で{映画|えいが}を{見|み}ました。', ro: 'Shuumatsu, hitori de eiga o mimashita.', vi: 'Cuối tuần tôi xem phim một mình.' },
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Phân biệt ポイント 79 và 80',
      items: [
        '**{兄|あに}が{2人|ふたり}います** = tôi có HAI anh trai (đếm số anh). **{兄|あに}と{2人|ふたり}で{住|す}んでいます** = tôi sống với anh trai, tổng HAI người (anh + tôi).',
        'Số + **で** luôn tính cả người nói. "Sống với 2 bạn cùng phòng" = ルームメイトと**{3人|さんにん}**で (không phải ~~{2人|ふたり}で~~).',
        'Quên で: ~~{兄|あに}と{2人|ふたり}{住|す}んでいます~~ → {兄|あに}と{2人|ふたり}**で**{住|す}んでいます.',
      ],
    },

    /* ── ポイント 74 ── */
    { t: 'h', text: 'ポイント 74 — N1 は N2 が A です (tả người: ai thì cái gì thế nào)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1（người）は N2（bộ phận cơ thể）が イA／ナA です。',
          vi: 'N1 là **chủ đề** (người được nói tới, trợ từ は), N2 là **đặc điểm** của người đó (trợ từ が), A nói N2 thế nào. Tiếng Việt: "Daniel **cao**" — tiếng Nhật: "Daniel thì **chiều cao** cao".',
          examples: [
            { en: 'ダニエルさんは{背|せ}が{高|たか}いです。', ro: 'Danieru-san wa se ga takai desu.', vi: 'Daniel cao. (câu của sách)' },
            { en: 'アンナさんは{髪|かみ}が{長|なが}いです。', ro: 'Anna-san wa kami ga nagai desu.', vi: 'Anna tóc dài.' },
            { en: '{妹|いもうと}は{目|め}が{大|おお}きいです。', ro: 'Imouto wa me ga ookii desu.', vi: 'Em gái tôi mắt to.' },
            { en: 'キムさんは{頭|あたま}がいいです。', ro: 'Kimu-san wa atama ga ii desu.', vi: 'Kim thông minh.' },
          ],
        },
        {
          formula: 'N1（người）は N2（môn, việc）が {上手|じょうず}／{下手|へた}／{好|す}き です。',
          vi: 'Cùng khung dùng cho **kỹ năng**: giỏi / dở / thích cái gì.',
          examples: [
            { en: 'マルコさんはサッカーが{上手|じょうず}です。', ro: 'Maruko-san wa sakkaa ga jouzu desu.', vi: 'Marco đá bóng giỏi. (câu của sách)' },
            { en: 'ナタポンさんは{絵|え}が{上手|じょうず}です。', ro: 'Natapon-san wa e ga jouzu desu.', vi: 'Natapon vẽ giỏi.' },
            { en: '{私|わたし}は{歌|うた}が{下手|へた}です。', ro: 'Watashi wa uta ga heta desu.', vi: 'Tôi hát dở.' },
          ],
        },
        {
          formula: 'N1 は N2 が A くないです／じゃありません。',
          vi: 'Phủ định chia ở A như Bài 4: イA い→**くないです** (いい → **よくないです**), ナA → **じゃありません**.',
          examples: [
            { en: '{兄|あに}は{背|せ}が{高|たか}くないです。', ro: 'Ani wa se ga takakunai desu.', vi: 'Anh tôi không cao.' },
            { en: '{私|わたし}はテニスが{上手|じょうず}じゃありません。', ro: 'Watashi wa tenisu ga jouzu ja arimasen.', vi: 'Tôi chơi tennis không giỏi.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: người đó thế nào?',
      lines: [
        { who: 'A', role: 'a', text: '{私|わたし}の{父|ちち}です。', ro: 'Watashi no chichi desu.', vi: 'Đây là bố tôi.' },
        { who: 'B', role: 'b', text: 'Aさんのお{父|とう}さんは{背|せ}が{高|たか}いですね。', ro: 'A-san no otousan wa se ga takai desu ne.', vi: 'Bố bạn A cao nhỉ.' },
        { who: 'A', role: 'a', text: 'はい。{父|ちち}はスポーツが{上手|じょうず}です。', ro: 'Hai. Chichi wa supootsu ga jouzu desu.', vi: 'Vâng. Bố tôi chơi thể thao giỏi.' },
        { who: 'B', role: 'b', text: 'お{母|かあ}さんは{料理|りょうり}が{上手|じょうず}ですか。', ro: 'Okaasan wa ryouri ga jouzu desu ka.', vi: 'Mẹ bạn nấu ăn giỏi không?' },
        { who: 'A', role: 'a', text: 'はい、とても{上手|じょうず}です。でも、{私|わたし}は{下手|へた}です。', ro: 'Hai, totemo jouzu desu. Demo, watashi wa heta desu.', vi: 'Có, rất giỏi. Nhưng tôi thì dở.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — N1 は N2 が A です',
      head: ['N1 は', 'N2 が', 'A です'],
      rows: [
        ['{父|ちち}は', '{背|せ}が', '{高|たか}いです。'],
        ['{姉|あね}は', '{髪|かみ}が', '{長|なが}いです。'],
        ['{弟|おとうと}は', '{足|あし}が', '{長|なが}いです。'],
        ['うさぎは', '{耳|みみ}が', '{長|なが}いです。'],
        ['メアリーさんは', '{目|め}が', '{大|おお}きいです。'],
        ['{妹|いもうと}は', '{顔|かお}が', '{小|ちい}さいです。'],
        ['キムさんは', '{頭|あたま}が', 'いいです。'],
        ['アンナさんは', 'テニスが', '{上手|じょうず}です。'],
        ['{私|わたし}は', '{歌|うた}が', '{下手|へた}です。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với N1はN2がA',
      items: [
        'Nhầm trợ từ: ~~{父|ちち}は{背|せ}は{高|たか}いです~~ / ~~{父|ちち}が{背|せ}が～~~ → **{父|ちち}は{背|せ}が{高|たか}いです**. Người: は — đặc điểm: が.',
        'Dịch từng chữ từ tiếng Việt: ~~{父|ちち}は{高|たか}いです~~ nghe như "bố tôi đắt". Người cao → phải có **{背|せ}が**.',
        'Có thể nói bằng の: {父|ちち}**の**{背|せ}は{高|たか}いです — đúng ngữ pháp nhưng ít tự nhiên; khi tả người hãy dùng N1は N2が.',
        'Đặt cả cụm trước danh từ để chỉ người: **{背|せ}が{高|たか}い{人|ひと}** (người cao), **{髪|かみ}が{長|なが}い{人|ひと}** (người tóc dài), **サッカーが{上手|じょうず}な{人|ひと}** (người đá bóng giỏi — ナA thêm な).',
      ],
    },

    /* ── ポイント 75 ── */
    { t: 'h', text: 'ポイント 75 — イA‑くて、～ ／ ナA・N で、～ (nối hai ý)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'イA：～い → ～くて、～',
          vi: 'Bỏ い, thêm **くて**. Dùng để nối hai tính từ / hai câu tả: "… và …". ĐẶC BIỆT: いい → **よくて**.',
          examples: [
            { en: 'メアリーさんは{目|め}が{大|おお}きくて、{髪|かみ}が{長|なが}いです。', ro: 'Mearii-san wa me ga ookikute, kami ga nagai desu.', vi: 'Mary mắt to và tóc dài. (câu của sách)' },
            { en: 'おもしろくて、{優|やさ}しい{人|ひと}です。', ro: 'Omoshirokute, yasashii hito desu.', vi: 'Là người vui tính và hiền.' },
            { en: '{兄|あに}は{頭|あたま}がよくて、かっこいいです。', ro: 'Ani wa atama ga yokute, kakkoii desu.', vi: 'Anh tôi thông minh và đẹp trai.' },
          ],
        },
        {
          formula: 'ナA：～（な） → ～で、～',
          vi: 'Tính từ な: bỏ な, thêm **で**.',
          examples: [
            { en: 'ナタポンさんはまじめで、{親切|しんせつ}です。', ro: 'Natapon-san wa majime de, shinsetsu desu.', vi: 'Natapon chăm chỉ và tốt bụng. (câu của sách)' },
            { en: 'ダニエルさんは{元気|げんき}で、おもしろいです。', ro: 'Danieru-san wa genki de, omoshiroi desu.', vi: 'Daniel năng động và vui tính.' },
            { en: 'この{町|まち}はきれいで、{静|しず}かです。', ro: 'Kono machi wa kirei de, shizuka desu.', vi: 'Thị trấn này đẹp và yên tĩnh.' },
          ],
        },
        {
          formula: 'N：～です → ～で、～',
          vi: 'Danh từ: です → **で**. Nối "là N" với ý tiếp theo.',
          examples: [
            { en: '{妹|いもうと}は{15歳|じゅうごさい}で、{中学生|ちゅうがくせい}です。', ro: 'Imouto wa juugosai de, chuugakusei desu.', vi: 'Em gái tôi 15 tuổi, là học sinh cấp 2. (câu của sách)' },
            { en: '{姉|あね}は{医者|いしゃ}で、{横浜|よこはま}に{住|す}んでいます。', ro: 'Ane wa isha de, Yokohama ni sunde imasu.', vi: 'Chị tôi là bác sĩ, sống ở Yokohama.' },
            { en: 'キムさんは{後輩|こうはい}で、まじめな{人|ひと}です。', ro: 'Kimu-san wa kouhai de, majime na hito desu.', vi: 'Kim là đàn em, là người chăm chỉ.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng chia thể て của tính từ và danh từ (表 p.283)',
      head: ['Loại', 'Gốc', '→ て', 'Romaji'],
      rows: [
        ['イA', '{大|おお}きい', '{大|おお}き**くて**', 'ookikute'],
        ['イA', '{高|たか}い', '{高|たか}**くて**', 'takakute'],
        ['イA', '{長|なが}い／{短|みじか}い', '{長|なが}**くて**／{短|みじか}**くて**', 'nagakute / mijikakute'],
        ['イA', '{優|やさ}しい', '{優|やさ}し**くて**', 'yasashikute'],
        ['イA', 'かわいい', 'かわい**くて**', 'kawaikute'],
        ['イA (đặc biệt)', 'いい', '**よくて**', 'yokute'],
        ['イA (đặc biệt)', 'かっこいい／{頭|あたま}がいい', 'かっこ**よくて**／{頭|あたま}が**よくて**', 'kakkoyokute / atama ga yokute'],
        ['ナA', '{親切|しんせつ}（な）', '{親切|しんせつ}**で**', 'shinsetsu de'],
        ['ナA', '{元気|げんき}（な）／まじめ（な）', '{元気|げんき}**で**／まじめ**で**', 'genki de / majime de'],
        ['ナA (đừng nhầm)', 'きれい（な）', 'きれい**で**', 'kirei de'],
        ['N', '{学生|がくせい}です', '{学生|がくせい}**で**', 'gakusei de'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: どんな人ですか (言ってみよう 3-2)',
      lines: [
        { who: 'A', role: 'a', text: 'この{人|ひと}はアンナさんです。{私|わたし}の{友達|ともだち}です。', ro: 'Kono hito wa Anna-san desu. Watashi no tomodachi desu.', vi: 'Người này là Anna. Bạn tôi.' },
        { who: 'B', role: 'b', text: 'へえ。アンナさんはどんな{人|ひと}ですか。', ro: 'Hee. Anna-san wa donna hito desu ka.', vi: 'Ồ. Anna là người thế nào?' },
        { who: 'A', role: 'a', text: 'おもしろくて、{親切|しんせつ}な{人|ひと}です。', ro: 'Omoshirokute, shinsetsu na hito desu.', vi: 'Là người vui tính và tốt bụng.' },
        { who: 'B', role: 'b', text: 'そうですか。', ro: 'Sou desu ka.', vi: 'Vậy à.' },
        { who: 'A', role: 'a', text: 'この{人|ひと}はリンさんです。{先輩|せんぱい}です。{背|せ}が{高|たか}くて、サッカーが{上手|じょうず}です。', ro: 'Kono hito wa Rin-san desu. Senpai desu. Se ga takakute, sakkaa ga jouzu desu.', vi: 'Người này là Linh. Đàn anh. Cao và đá bóng giỏi.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — A1 て、A2 {人|ひと}です',
      head: ['A1 (thể て)', 'A2', '{人|ひと}です'],
      rows: [
        ['おもしろくて、', '{親切|しんせつ}な', '{人|ひと}です。'],
        ['{元気|げんき}で、', 'おもしろい', '{人|ひと}です。'],
        ['まじめで、', '{頭|あたま}がいい', '{人|ひと}です。'],
        ['{優|やさ}しくて、', 'きれいな', '{人|ひと}です。'],
        ['{背|せ}が{高|たか}くて、', '{髪|かみ}が{短|みじか}い', '{人|ひと}です。'],
        ['{頭|あたま}がよくて、', 'かっこいい', '{人|ひと}です。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～くて／～で',
      items: [
        'Dùng と để nối tính từ: ~~おもしろいと{親切|しんせつ}です~~ → **おもしろくて、{親切|しんせつ}です**. と chỉ nối DANH TỪ (Bài 1).',
        'いい → ~~いくて~~ → **よくて**; かっこいい → **かっこよくて**.',
        'きれい, {有名|ゆうめい} là tính từ **な** dù tận cùng bằng い: ~~きれくて~~ → **きれいで**.',
        'Tính từ ở GIỮA câu chia て, tính từ CUỐI chia theo thì của cả câu: {背|せ}が{高|たか}くて、かっこよ**かった**です (quá khứ chỉ ở cuối).',
        'Hai ý nên cùng chiều (cùng tốt hoặc cùng xấu). Một tốt một xấu thì dùng **が** (Bài 4): この{店|みせ}は{安|やす}いですが、{遠|とお}いです.',
      ],
    },

    /* ── ポイント 76, 77, 78 ── */
    { t: 'h', text: 'ポイント 76 — N1(người) に N2(vật) を あげます (cho, tặng)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（người cho）は N1（người nhận）に N2（vật）を あげます。',
          vi: 'Người cho là chủ ngữ; **に** đánh dấu người NHẬN. Dùng khi TÔI cho người khác, hoặc người khác cho người khác — **KHÔNG dùng khi người nhận là tôi**.',
          examples: [
            { en: 'カルロスさんはパクさんに{花|はな}をあげました。', ro: 'Karurosu-san wa Paku-san ni hana o agemashita.', vi: 'Carlos tặng hoa cho Park. (câu của sách)' },
            { en: '{私|わたし}は{母|はは}に{手紙|てがみ}をあげました。', ro: 'Watashi wa haha ni tegami o agemashita.', vi: 'Tôi tặng mẹ lá thư.' },
            { en: 'バレンタインデーに{恋人|こいびと}にチョコレートをあげます。', ro: 'Barentaindee ni koibito ni chokoreeto o agemasu.', vi: 'Ngày Valentine tôi tặng người yêu sô-cô-la.' },
          ],
        },
        {
          formula: '{何|なに}か あげませんか。／N を あげたいです。',
          vi: 'Kết hợp với lời rủ (ポイント 48, Bài 6) và ～たい (Bài 5) để **bàn chọn quà**.',
          examples: [
            { en: 'パクさんに{何|なに}かプレゼントをあげませんか。——いいですね。{何|なに}をあげますか。', ro: 'Paku-san ni nanika purezento o agemasen ka. — Ii desu ne. Nani o agemasu ka.', vi: 'Mình tặng Park món quà gì đó không? — Hay đấy. Tặng gì?' },
            { en: '{私|わたし}は{花|はな}をあげたいです。', ro: 'Watashi wa hana o agetai desu.', vi: 'Tôi muốn tặng hoa. (câu của sách)' },
          ],
        },
      ],
    },
    { t: 'h', text: 'ポイント 77 — N1(người) に N2(vật) を もらいます (nhận)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（người nhận）は N1（người cho）に N2（vật）を もらいます。',
          vi: 'Người NHẬN là chủ ngữ; **に** (hoặc **から**) đánh dấu người CHO. Người nhận có thể là tôi hoặc người khác. Người cho là tổ chức (công ty, trường) thì chỉ dùng **から**.',
          examples: [
            { en: 'パクさんはカルロスさんに{花|はな}をもらいました。', ro: 'Paku-san wa Karurosu-san ni hana o moraimashita.', vi: 'Park nhận hoa của Carlos. (câu của sách — cùng sự việc với ポイント 76)' },
            { en: '{私|わたし}は{姉|あね}にカメラをもらいました。', ro: 'Watashi wa ane ni kamera o moraimashita.', vi: 'Tôi nhận máy ảnh của chị gái.' },
            { en: '{学校|がっこう}から{辞書|じしょ}をもらいました。', ro: 'Gakkou kara jisho o moraimashita.', vi: 'Tôi nhận từ điển từ nhà trường.' },
          ],
        },
      ],
    },
    { t: 'h', text: 'ポイント 78 — N1(người) が (私に) N2(vật) を くれます (cho TÔI)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1（người cho）が {私|わたし}に N2（vật）を くれます。',
          vi: '"Người khác cho **tôi** (hoặc người nhà tôi)". Người cho đi với **が** (hoặc は), người nhận {私|わたし}に thường **lược đi** vì くれます đã hàm ý "cho tôi".',
          examples: [
            { en: 'メアリーさんが{私|わたし}にかばんをくれました。', ro: 'Mearii-san ga watashi ni kaban o kuremashita.', vi: 'Mary tặng tôi cái túi. (câu của sách)' },
            { en: '{友達|ともだち}がCDをくれました。', ro: 'Tomodachi ga shiidii o kuremashita.', vi: 'Bạn tặng tôi đĩa CD. ({私|わたし}に lược đi)' },
            { en: '{祖母|そぼ}が{妹|いもうと}にネックレスをくれました。', ro: 'Sobo ga imouto ni nekkuresu o kuremashita.', vi: 'Bà tặng em gái tôi sợi dây chuyền. (người nhận là người nhà tôi → くれます)' },
          ],
        },
        {
          formula: '{誰|だれ}が くれましたか。／{誰|だれ}に もらいましたか。',
          vi: 'Hỏi ai tặng — hai cách hỏi, nhớ đổi trợ từ theo động từ.',
          examples: [
            { en: 'その{時計|とけい}、{誰|だれ}がくれましたか。——{父|ちち}がくれました。', ro: 'Sono tokei, dare ga kuremashita ka. — Chichi ga kuremashita.', vi: 'Cái đồng hồ đó ai tặng bạn vậy? — Bố tôi tặng.' },
            { en: 'その{時計|とけい}、{誰|だれ}にもらいましたか。——{父|ちち}にもらいました。', ro: 'Sono tokei, dare ni moraimashita ka. — Chichi ni moraimashita.', vi: 'Cái đồng hồ đó bạn nhận của ai? — Tôi nhận của bố.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Một món quà — ba cách nói (người cho → người nhận)',
      head: ['Sự việc', 'あげます', 'もらいます', 'くれます'],
      rows: [
        ['Tôi → Park', '{私|わたし}はパクさんに{花|はな}を**あげました**。', 'パクさんは{私|わたし}に{花|はな}を**もらいました**。', '✗ (người nhận không phải tôi)'],
        ['Carlos → Park', 'カルロスさんはパクさんに{花|はな}を**あげました**。', 'パクさんはカルロスさんに{花|はな}を**もらいました**。', '✗'],
        ['Mary → tôi', '✗ (không nói ~~メアリーさんは{私|わたし}にあげました~~)', '{私|わたし}はメアリーさんにかばんを**もらいました**。', 'メアリーさんが（{私|わたし}に）かばんを**くれました**。'],
        ['Bà → em gái tôi', '(nghe xa cách, tránh)', '{妹|いもうと}は{祖母|そぼ}にネックレスを**もらいました**。', '{祖母|そぼ}が{妹|いもうと}にネックレスを**くれました**。'],
      ],
    },
    {
      t: 'note',
      title: 'Cách chọn động từ — ba câu hỏi',
      items: [
        '① Chủ ngữ là người **NHẬN**? → **もらいます** (người cho + に／から).',
        '② Chủ ngữ là người **CHO**, người nhận là **TÔI / người nhà tôi**? → **くれます**.',
        '③ Chủ ngữ là người **CHO**, người nhận là người khác? → **あげます**.',
        'Mẹo nhớ: あげます "đưa LÊN / đưa ra ngoài" (từ phía tôi đi ra), くれます "đến với tôi" (từ ngoài vào phía tôi).',
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: khen đồ — ai tặng? (言ってみよう 8-3 số 2, 3)',
      lines: [
        { who: 'A', role: 'a', text: 'Bさん、そのカメラ、いいですね。', ro: 'B-san, sono kamera, ii desu ne.', vi: 'B, cái máy ảnh đó đẹp nhỉ.' },
        { who: 'B', role: 'b', text: 'あ、ありがとうございます。{姉|あね}にもらいました。', ro: 'A, arigatou gozaimasu. Ane ni moraimashita.', vi: 'A, cảm ơn. Tôi nhận của chị gái.' },
        { who: 'A', role: 'a', text: '{誕生日|たんじょうび}パーティーはどうでしたか。', ro: 'Tanjoubi paatii wa dou deshita ka.', vi: 'Tiệc sinh nhật thế nào?' },
        { who: 'B', role: 'b', text: 'とても{楽|たの}しかったです。{友達|ともだち}がCDをくれました。', ro: 'Totemo tanoshikatta desu. Tomodachi ga shiidii o kuremashita.', vi: 'Rất vui. Bạn tặng tôi đĩa CD.' },
        { who: 'A', role: 'a', text: 'そうですか。よかったですね。', ro: 'Sou desu ka. Yokatta desu ne.', vi: 'Vậy à. Tốt quá nhỉ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — dịp, người, quà',
      head: ['Dịp に', 'người', 'vật を', 'động từ'],
      rows: [
        ['{誕生日|たんじょうび}に', '{友達|ともだち}が', 'CDを', 'くれました。'],
        ['クリスマスに', '{父|ちち}に', '{時計|とけい}を', 'もらいました。'],
        ['バレンタインデーに', '{恋人|こいびと}に', 'チョコレートを', 'あげました。'],
        ['{結婚式|けっこんしき}に', '{田中|たなか}さんに', '{花|はな}を', 'あげました。'],
        ['{誕生日|たんじょうび}に', '{祖母|そぼ}が', 'お{金|かね}を', 'くれました。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với あげます・もらいます・くれます',
      items: [
        '~~{友達|ともだち}は{私|わたし}にCDをあげました~~ → **{友達|ともだち}が（{私|わたし}に）CDをくれました**. Đây là lỗi SỐ MỘT của bài.',
        'もらいます thì người cho đi với **に**, không phải が: ~~{姉|あね}がカメラをもらいました~~ (= CHỊ nhận máy ảnh) ≠ **{姉|あね}に**カメラをもらいました (= tôi nhận của chị).',
        'Ngày lễ / dịp + **に**: {誕生日|たんじょうび}**に**、クリスマス**に** (Bài 3: thời điểm cụ thể + に).',
        '"Gửi" dùng **{送|おく}ります**: {祖母|そぼ}がカードを{送|おく}りました — {送|おく}ります không có chiều "cho tôi", nên dùng được với mọi người.',
      ],
    },

    /* ── Tổng kết ── */
    { t: 'h', text: 'Tổng kết — câu hỏi của Bài 8 và cách trả lời' },
    {
      t: 'table',
      head: ['Câu hỏi', 'Hỏi về', 'Trả lời mẫu', 'ポイント'],
      rows: [
        ['どこに{住|す}んでいますか。', 'Nơi ở', '～に{住|す}んでいます。', '72'],
        ['{誰|だれ}と{住|す}んでいますか。', 'Sống với ai', '{1人|ひとり}で／～と～{人|にん}で{住|す}んでいます。', '80'],
        ['{家族|かぞく}は{何人|なんにん}ですか。', 'Nhà mấy người', '～{人|にん}です。{父|ちち}と{母|はは}と…です。', '79'],
        ['{兄弟|きょうだい}がいますか。', 'Anh chị em', 'はい、～が～{人|にん}います。／いいえ、いません。', '79'],
        ['お{父|とう}さんは{何|なに}をしていますか。', 'Nghề', '{父|ちち}は～です。～で{働|はたら}いています。', '73'],
        ['～さんはどんな{人|ひと}ですか。', 'Người thế nào', '～くて／～で、～{人|にん}です。', '74, 75'],
        ['{何|なに}をあげますか。', 'Chọn quà', '～をあげたいです。～はどうですか。', '76'],
        ['{誰|だれ}にもらいましたか。／{誰|だれ}がくれましたか。', 'Ai tặng', '～にもらいました。／～がくれました。', '77, 78'],
      ],
    },
    {
      t: 'build',
      id: 'b8-np-ghep',
      title: 'Ghép câu — dùng đủ 9 điểm ngữ pháp',
      items: [
        { vi: 'Tôi đang sống ở Yokohama.', chips: ['{私|わたし}は', '{横浜|よこはま}に', '{住|す}んでいます', '{横浜|よこはま}で', '{住|す}みます'], answer: ['{私|わたし}は', '{横浜|よこはま}に', '{住|す}んでいます'], ro: 'Watashi wa Yokohama ni sunde imasu.' },
        { vi: 'Mẹ tôi dạy tiếng Anh ở trường cấp 3.', chips: ['{母|はは}は', '{高校|こうこう}で', '{英語|えいご}を', '{教|おし}えています', '{高校|こうこう}に', 'お{母|かあ}さんは'], answer: ['{母|はは}は', '{高校|こうこう}で', '{英語|えいご}を', '{教|おし}えています'], ro: 'Haha wa koukou de eigo o oshiete imasu.' },
        { vi: 'Tôi có hai em gái.', chips: ['{私|わたし}は', '{妹|いもうと}が', '{2人|ふたり}', 'います', 'あります', 'を'], answer: ['{私|わたし}は', '{妹|いもうと}が', '{2人|ふたり}', 'います'], ro: 'Watashi wa imouto ga futari imasu.' },
        { vi: 'Tôi sống ba người với bạn.', chips: ['{友達|ともだち}と', '{3人|さんにん}', 'で', '{住|す}んでいます', 'が', '{2人|ふたり}'], answer: ['{友達|ともだち}と', '{3人|さんにん}', 'で', '{住|す}んでいます'], ro: 'Tomodachi to sannin de sunde imasu.' },
        { vi: 'Daniel cao.', chips: ['ダニエルさんは', '{背|せ}が', '{高|たか}いです', '{背|せ}は', 'ダニエルさんが'], answer: ['ダニエルさんは', '{背|せ}が', '{高|たか}いです'], ro: 'Danieru-san wa se ga takai desu.' },
        { vi: 'Marco đá bóng giỏi.', chips: ['マルコさんは', 'サッカーが', '{上手|じょうず}です', 'サッカーを', '{下手|へた}です'], answer: ['マルコさんは', 'サッカーが', '{上手|じょうず}です'], ro: 'Maruko-san wa sakkaa ga jouzu desu.' },
        { vi: 'Mary mắt to và tóc dài.', chips: ['メアリーさんは', '{目|め}が', '{大|おお}きくて、', '{髪|かみ}が', '{長|なが}いです', '{大|おお}きいで、'], answer: ['メアリーさんは', '{目|め}が', '{大|おお}きくて、', '{髪|かみ}が', '{長|なが}いです'], ro: 'Mearii-san wa me ga ookikute, kami ga nagai desu.' },
        { vi: 'Natapon chăm chỉ và tốt bụng.', chips: ['ナタポンさんは', 'まじめで、', '{親切|しんせつ}です', 'まじめくて、', 'と'], answer: ['ナタポンさんは', 'まじめで、', '{親切|しんせつ}です'], ro: 'Natapon-san wa majime de, shinsetsu desu.' },
        { vi: 'Là người thông minh và đẹp trai.', chips: ['{頭|あたま}が', 'よくて、', 'かっこいい', '{人|ひと}です', 'いくて、'], answer: ['{頭|あたま}が', 'よくて、', 'かっこいい', '{人|ひと}です'], ro: 'Atama ga yokute, kakkoii hito desu.' },
        { vi: 'Carlos tặng hoa cho Park.', chips: ['カルロスさんは', 'パクさんに', '{花|はな}を', 'あげました', 'くれました', 'パクさんが'], answer: ['カルロスさんは', 'パクさんに', '{花|はな}を', 'あげました'], ro: 'Karurosu-san wa Paku-san ni hana o agemashita.' },
        { vi: 'Tôi nhận máy ảnh của chị gái.', chips: ['{姉|あね}に', 'カメラを', 'もらいました', '{姉|あね}が', 'くれました', 'あげました'], answer: ['{姉|あね}に', 'カメラを', 'もらいました'], ro: 'Ane ni kamera o moraimashita.' },
        { vi: 'Bạn tôi tặng tôi đĩa CD.', chips: ['{友達|ともだち}が', 'CDを', 'くれました', 'あげました', '{友達|ともだち}に'], answer: ['{友達|ともだち}が', 'CDを', 'くれました'], ro: 'Tomodachi ga shiidii o kuremashita.' },
        { vi: 'Bố bạn làm nghề gì?', chips: ['お{父|とう}さんは', '{何|なに}を', 'していますか', '{父|ちち}は', 'しますか'], answer: ['お{父|とう}さんは', '{何|なに}を', 'していますか'], ro: 'Otousan wa nani o shite imasu ka.' },
        { vi: 'Sắp sinh nhật Park rồi nhỉ.', chips: ['もうすぐ、', 'パクさんの', '{誕生日|たんじょうび}', 'ですね', 'ですよ', 'まだ'], answer: ['もうすぐ、', 'パクさんの', '{誕生日|たんじょうび}', 'ですね'], ro: 'Mousugu, Paku-san no tanjoubi desu ne.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b8-np-kiem',
      title: 'Kiểm tra nhanh ngữ pháp Bài 8',
      items: [
        { q: '「{私|わたし}は{横浜|よこはま}＿{住|す}んでいます。」', options: ['で', 'に', 'へ', 'を'], correct: 1, why: 'Nơi ở + **に** {住|す}んでいます (ポイント 72).' },
        { q: '「{姉|あね}はデパート＿{働|はたら}いています。」', options: ['に', 'で', 'を', 'へ'], correct: 1, why: 'Nơi làm việc + **で** (ポイント 73).' },
        { q: '"Tôi sống ở Hà Nội" (đang sống):', options: ['ハノイに{住|す}みます。', 'ハノイに{住|す}んでいます。', 'ハノイで{住|す}んでいます。', 'ハノイに{住|す}みました。'], correct: 1, why: 'Trạng thái đang kéo dài → **{住|す}んでいます**.' },
        { q: '"Tôi có một anh trai":', options: ['{兄|あに}が{1人|ひとり}あります。', '{兄|あに}が{1人|ひとり}います。', '{兄|あに}を{1人|ひとり}います。', 'お{兄|にい}さんが{1人|ひとり}います。'], correct: 1, why: 'Người → **います**; anh MÌNH → **{兄|あに}** (ポイント 79).' },
        { q: '「{兄弟|きょうだい}が{何人|なんにん}いますか。」 — Bạn có 4 anh chị em:', options: ['よんにんいます。', 'よにんいます。', 'しにんいます。', 'よっつあります。'], correct: 1, why: '4 người = **よにん**.' },
        { q: '「{猫|ねこ}が＿います。」 (3 con)', options: ['さんひき', 'さんびき', 'さんぴき', 'みっつ'], correct: 1, why: '3 + 匹 → **さんびき**.' },
        { q: 'Sống cùng 2 bạn cùng phòng (tổng 3 người):', options: ['ルームメイトと{2人|ふたり}で{住|す}んでいます。', 'ルームメイトと{3人|さんにん}で{住|す}んでいます。', 'ルームメイトが{3人|さんにん}{住|す}んでいます。', 'ルームメイトと{3人|さんにん}{住|す}んでいます。'], correct: 1, why: 'Số + **で** tính cả mình → {3人|さんにん}で (ポイント 80).' },
        { q: '「ダニエルさん＿{背|せ}＿{高|たか}いです。」', options: ['は／が', 'が／は', 'は／は', 'の／を'], correct: 0, why: 'N1 **は** N2 **が** A (ポイント 74).' },
        { q: 'Nối: {目|め}が{大|おお}きい + {髪|かみ}が{長|なが}い', options: ['{目|め}が{大|おお}きいで、{髪|かみ}が{長|なが}いです。', '{目|め}が{大|おお}きくて、{髪|かみ}が{長|なが}いです。', '{目|め}が{大|おお}きいと{髪|かみ}が{長|なが}いです。', '{目|め}が{大|おお}きくで、{髪|かみ}が{長|なが}いです。'], correct: 1, why: 'イA: い → **くて** (ポイント 75).' },
        { q: 'Nối: {親切|しんせつ} + おもしろい', options: ['{親切|しんせつ}くて、おもしろいです。', '{親切|しんせつ}で、おもしろいです。', '{親切|しんせつ}な、おもしろいです。', '{親切|しんせつ}と、おもしろいです。'], correct: 1, why: 'ナA → **で**.' },
        { q: '"Thông minh và vui tính": {頭|あたま}が＿、おもしろいです。', options: ['いくて', 'よくて', 'いいで', 'よいで'], correct: 1, why: 'いい → **よくて** (bất quy tắc).' },
        { q: 'Bạn TẶNG mẹ bó hoa:', options: ['{母|はは}に{花|はな}をくれました。', '{母|はは}に{花|はな}をあげました。', '{母|はは}に{花|はな}をもらいました。', '{母|はは}が{花|はな}をあげました。'], correct: 1, why: 'Tôi → người khác: **あげます** (ポイント 76).' },
        { q: 'Bạn NHẬN đồng hồ của bố:', options: ['{父|ちち}に{時計|とけい}をもらいました。', '{父|ちち}が{時計|とけい}をもらいました。', '{父|ちち}に{時計|とけい}をあげました。', '{父|ちち}に{時計|とけい}をくれました。'], correct: 0, why: 'Người cho + **に** もらいます (ポイント 77). {父|ちち}が～もらいました = BỐ nhận.' },
        { q: 'Bạn của bạn TẶNG BẠN đĩa CD:', options: ['{友達|ともだち}は{私|わたし}にCDをあげました。', '{友達|ともだち}が{私|わたし}にCDをくれました。', '{友達|ともだち}に{私|わたし}がCDをくれました。', '{友達|ともだち}がCDをもらいました。'], correct: 1, why: 'Người khác → TÔI: **くれます** (ポイント 78).' },
        { q: '「その{傘|かさ}、{誰|だれ}＿もらいましたか。」', options: ['が', 'に', 'を', 'で'], correct: 1, why: 'もらいます: người cho + **に**.' },
        { q: '「その{傘|かさ}、{誰|だれ}＿くれましたか。」', options: ['が', 'に', 'を', 'で'], correct: 0, why: 'くれます: người cho + **が**.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const KANJI: Lesson = {
  id: 'b8-kanji',
  kind: 'kanji',
  title: 'Chữ Hán — trong từ vựng Bài 8',
  goal: 'Nhận mặt và đọc đúng mọi chữ Hán trong 84 từ của Bài 8 (gia đình, cơ thể, tính từ tả người, quà tặng), biết chữ nào đọc kiểu Nhật khi đứng riêng và kiểu Hán khi ghép, và viết tay được những chữ ✍ hay dùng nhất.',
  minutes: 35,
  blocks: [
    {
      t: 'p',
      text: 'Phần Reading của đề thi có **4 từ chữ Hán gạch chân, KHÔNG có furigana (12 điểm)**. Vì thế học chữ Hán theo **cả từ**: {両親|りょうしん} = ryoushin, {大学生|だいがくせい} = daigakusei — chứ không học chữ rời. **Âm On** (音, gốc Hán) thường dùng khi hai chữ Hán đứng cạnh nhau ({兄弟|きょうだい}); **âm Kun** (訓, âm Nhật) khi chữ đứng một mình hoặc có đuôi kana ({兄|あに}, {長|なが}い). Cột **Mức**: 👁 = nhận mặt, đọc và hiểu là đủ (ưu tiên cho đề đọc); ✍ = ít nét, rất hay gặp — nên tập viết.',
    },
    {
      t: 'table',
      caption: '1. Gia đình',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['父', '✍', 'フ', 'ちち', 'PHỤ (cha)', '{父|ちち} · お{父|とう}さん · {祖父|そふ}'],
        ['母', '✍', 'ボ', 'はは', 'MẪU (mẹ)', '{母|はは} · お{母|かあ}さん · {祖母|そぼ}'],
        ['兄', '✍', 'キョウ・ケイ', 'あに', 'HUYNH (anh)', '{兄|あに} · お{兄|にい}さん · {兄弟|きょうだい}'],
        ['夫', '✍', 'フ', 'おっと', 'PHU (chồng)', '{夫|おっと}'],
        ['子', '✍', 'シ・ス', 'こ', 'TỬ (con)', '{子|こ}ども · お{子|こ}さん · {息子|むすこ}'],
        ['両', '👁', 'リョウ', '—', 'LƯỠNG (hai)', '{両親|りょうしん}'],
        ['親', '👁', 'シン', 'おや', 'THÂN (cha mẹ; thân)', '{両親|りょうしん} · {親切|しんせつ}'],
        ['弟', '👁', 'ダイ・テイ', 'おとうと', 'ĐỆ (em trai)', '{弟|おとうと} · {弟|おとうと}さん · {兄弟|きょうだい}'],
        ['姉', '👁', 'シ', 'あね', 'TỶ (chị)', '{姉|あね} · お{姉|ねえ}さん'],
        ['妹', '👁', 'マイ', 'いもうと', 'MUỘI (em gái)', '{妹|いもうと} · {妹|いもうと}さん'],
        ['妻', '👁', 'サイ', 'つま', 'THÊ (vợ)', '{妻|つま}'],
        ['息', '👁', 'ソク', 'いき', 'TỨC (hơi thở; con)', '{息子|むすこ} (đọc đặc biệt)'],
        ['娘', '👁', '—', 'むすめ', 'NƯƠNG (con gái)', '{娘|むすめ}'],
        ['祖', '👁', 'ソ', '—', 'TỔ (ông bà)', '{祖母|そぼ} · {祖父|そふ}'],
        ['主', '👁', 'シュ', 'ぬし・おも', 'CHỦ', 'ご{主人|しゅじん}'],
        ['奥', '👁', 'オウ', 'おく', 'ÁO (bên trong)', '{奥|おく}さん'],
      ],
    },
    {
      t: 'table',
      caption: '2. Người, nghề, số đếm, nơi ở',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['人', '✍', 'ジン・ニン', 'ひと', 'NHÂN (người)', '{人|ひと} · ～{人|にん} · {1人|ひとり} · ご{主人|しゅじん}'],
        ['大', '✍', 'ダイ・タイ', 'おお(きい)', 'ĐẠI (lớn)', '{大学生|だいがくせい} · {大|おお}きい · {大切|たいせつ}'],
        ['学', '✍', 'ガク', 'まな(ぶ)', 'HỌC', '{大学生|だいがくせい} · {学生|がくせい}'],
        ['生', '✍', 'セイ', 'い(きる)・う(まれる)', 'SINH', '{高校生|こうこうせい} · {大学生|だいがくせい} · {先生|せんせい}'],
        ['先', '✍', 'セン', 'さき', 'TIÊN (trước)', '{先輩|せんぱい} · {先生|せんせい}'],
        ['医', '👁', 'イ', '—', 'Y (chữa bệnh)', '{医者|いしゃ}'],
        ['者', '👁', 'シャ', 'もの', 'GIẢ (người)', '{医者|いしゃ}'],
        ['高', '👁', 'コウ', 'たか(い)', 'CAO', '{高校生|こうこうせい} · {背|せ}が{高|たか}い'],
        ['校', '👁', 'コウ', '—', 'HIỆU (trường)', '{高校|こうこう} · {学校|がっこう}'],
        ['匹', '👁', 'ヒツ', 'ひき', 'THẤT (con)', '～{匹|ひき} · {何匹|なんびき}'],
        ['猫', '👁', 'ビョウ', 'ねこ', 'MIÊU (mèo)', '{猫|ねこ}'],
        ['住', '👁', 'ジュウ', 'す(む)', 'TRÚ (ở)', '{住|す}みます'],
        ['輩', '👁', 'ハイ', '—', 'BỐI (lớp người)', '{先輩|せんぱい} · {後輩|こうはい}'],
        ['後', '👁', 'ゴ・コウ', 'うし(ろ)・あと', 'HẬU (sau)', '{後輩|こうはい} · {後|うし}ろ · {午後|ごご}'],
      ],
    },
    {
      t: 'table',
      caption: '3. Cơ thể',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['口', '✍', 'コウ', 'くち', 'KHẨU (miệng)', '{口|くち}'],
        ['目', '✍', 'モク', 'め', 'MỤC (mắt)', '{目|め}'],
        ['耳', '✍', 'ジ', 'みみ', 'NHĨ (tai)', '{耳|みみ}'],
        ['足', '✍', 'ソク', 'あし', 'TÚC (chân)', '{足|あし}'],
        ['体', '👁', 'タイ', 'からだ', 'THỂ (thân thể)', '{体|からだ}'],
        ['顔', '👁', 'ガン', 'かお', 'NHAN (mặt)', '{顔|かお}'],
        ['髪', '👁', 'ハツ', 'かみ', 'PHÁT (tóc)', '{髪|かみ}'],
        ['鼻', '👁', 'ビ', 'はな', 'TỴ (mũi)', '{鼻|はな}'],
        ['頭', '👁', 'トウ・ズ', 'あたま', 'ĐẦU', '{頭|あたま}がいい'],
        ['背', '👁', 'ハイ', 'せ', 'BỐI (lưng; chiều cao)', '{背|せ}が{高|たか}い'],
      ],
    },
    {
      t: 'table',
      caption: '4. Tính từ tả người',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['上', '✍', 'ジョウ', 'うえ', 'THƯỢNG (trên)', '{上手|じょうず} · {上|うえ}'],
        ['下', '✍', 'カ・ゲ', 'した', 'HẠ (dưới)', '{下手|へた} (đọc đặc biệt) · {下|した}'],
        ['手', '✍', 'シュ', 'て', 'THỦ (tay)', '{上手|じょうず} · {下手|へた} · {手紙|てがみ}'],
        ['白', '✍', 'ハク', 'しろ(い)', 'BẠCH (trắng)', '{白|しろ}い'],
        ['元', '✍', 'ゲン', 'もと', 'NGUYÊN (gốc)', '{元気|げんき}'],
        ['気', '✍', 'キ', '—', 'KHÍ', '{元気|げんき} · {天気|てんき}'],
        ['長', '👁', 'チョウ', 'なが(い)', 'TRƯỜNG (dài)', '{長|なが}い'],
        ['短', '👁', 'タン', 'みじか(い)', 'ĐOẢN (ngắn)', '{短|みじか}い'],
        ['優', '👁', 'ユウ', 'やさ(しい)', 'ƯU (hiền, ưu tú)', '{優|やさ}しい'],
        ['黒', '👁', 'コク', 'くろ(い)', 'HẮC (đen)', '{黒|くろ}い'],
        ['茶', '👁', 'チャ・サ', '—', 'TRÀ', '{茶色|ちゃいろ}い · お{茶|ちゃ}'],
        ['色', '👁', 'ショク・シキ', 'いろ', 'SẮC (màu)', '{茶色|ちゃいろ}い'],
        ['切', '👁', 'セツ', 'き(る)', 'THIẾT (cắt; thiết tha)', '{親切|しんせつ} · {切|き}ります'],
      ],
    },
    {
      t: 'table',
      caption: '5. Quà tặng, liên lạc, sự kiện',
      head: ['Chữ', 'Mức', 'Âm On', 'Âm Kun', 'Hán Việt', 'Từ trong bài'],
      rows: [
        ['金', '✍', 'キン', 'かね', 'KIM (vàng, tiền)', 'お{金|かね} · {金曜日|きんようび}'],
        ['何', '✍', 'カ', 'なに・なん', 'HÀ (gì)', '{何|なに}か · {何人|なんにん}'],
        ['傘', '👁', 'サン', 'かさ', 'TẢN (ô, dù)', '{傘|かさ}'],
        ['靴', '👁', 'カ', 'くつ', 'NGOA (giày)', '{靴下|くつした}'],
        ['辞', '👁', 'ジ', 'や(める)', 'TỪ', '{辞書|じしょ}'],
        ['書', '👁', 'ショ', 'か(く)', 'THƯ (viết, sách)', '{辞書|じしょ} · {書|か}きます'],
        ['紙', '👁', 'シ', 'かみ', 'CHỈ (giấy)', '{手紙|てがみ} (かみ → がみ)'],
        ['結', '👁', 'ケツ', 'むす(ぶ)', 'KẾT (buộc)', '{結婚式|けっこんしき} (けつ → けっ)'],
        ['婚', '👁', 'コン', '—', 'HÔN (cưới)', '{結婚|けっこん}'],
        ['式', '👁', 'シキ', '—', 'THỨC (nghi lễ)', '{結婚式|けっこんしき}'],
        ['送', '👁', 'ソウ', 'おく(る)', 'TỐNG (gửi)', '{送|おく}ります'],
        ['電', '👁', 'デン', '—', 'ĐIỆN', '{電話|でんわ} · {電車|でんしゃ}'],
        ['話', '👁', 'ワ', 'はな(す)', 'THOẠI (nói)', '{電話|でんわ} · {話|はな}します'],
        ['経', '👁', 'ケイ', '—', 'KINH', '{経済|けいざい}'],
        ['済', '👁', 'サイ', '—', 'TẾ', '{経済|けいざい}'],
        ['素', '👁', 'ソ・ス', '—', 'TỐ', '{素敵|すてき}'],
        ['敵', '👁', 'テキ', 'かたき', 'ĐỊCH', '{素敵|すてき}'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ',
      items: [
        '**Hán Việt đoán nghĩa**: 両親 = LƯỠNG THÂN (hai người thân = bố mẹ), 兄弟 = HUYNH ĐỆ, 医者 = Y GIẢ (người chữa bệnh), 先輩 = TIÊN BỐI (lớp người đi trước), 後輩 = HẬU BỐI, 結婚式 = KẾT HÔN THỨC, 親切 = THÂN THIẾT, 辞書 = TỪ THƯ (sách từ), 経済 = KINH TẾ, 元気 = NGUYÊN KHÍ.',
        '**Chữ bộ nữ 女** đứng bên trái: 姉 (chị), 妹 (em gái), 娘 (con gái), 婚 (cưới); 妻 (vợ) có 女 ở dưới. Thấy 女 là biết có liên quan tới phụ nữ / hôn nhân.',
        '**上手 / 下手**: "tay trên" = giỏi, "tay dưới" = kém — đọc đặc biệt **じょうず / へた**, không đọc theo từng chữ.',
        '**Cơ thể toàn chữ tượng hình**: 口 (cái miệng vuông), 目 (con mắt dựng đứng), 耳 (cái tai), 足 (bàn chân). Nhìn chữ là thấy hình — 4 chữ này nên tập viết.',
      ],
    },

    /* ── Đứng riêng hay đứng chung ── */
    { t: 'h', text: 'Đứng riêng hay đứng chung — một chữ, hai cách đọc' },
    {
      t: 'p',
      text: 'Chữ Hán **đứng riêng** (hoặc có đuôi kana) thường đọc **âm Kun** (âm Nhật); **ghép với chữ Hán khác** thường đọc **âm On** (âm Hán). Bảng dưới là các chữ của Bài 8 có cả hai kiểu. Từ ghép ghi thêm để nhận mặt — chỉ từ **in đậm** là từ đã học.',
    },
    {
      t: 'table',
      caption: 'Chữ Hán Bài 8 — đứng riêng (Kun) và trong từ ghép (On)',
      head: ['Chữ', 'Đứng riêng (Kun)', 'Trong từ ghép (On)'],
      rows: [
        ['父', '**{父|ちち}** chichi — bố (tôi)', '**{祖父|そふ}** sofu — ông · {父母|ふぼ} fubo — cha mẹ'],
        ['母', '**{母|はは}** haha — mẹ (tôi)', '**{祖母|そぼ}** sobo — bà · {母国|ぼこく} bokoku — tổ quốc'],
        ['兄', '**{兄|あに}** ani — anh trai', '**{兄弟|きょうだい}** kyoudai — anh chị em'],
        ['弟', '**{弟|おとうと}** otouto — em trai', '**{兄弟|きょうだい}** kyou**dai** — anh chị em'],
        ['姉', '**{姉|あね}** ane — chị gái', '{姉妹|しまい} shimai — chị em gái'],
        ['妹', '**{妹|いもうと}** imouto — em gái', '{姉妹|しまい} shi**mai** — chị em gái'],
        ['夫', '**{夫|おっと}** otto — chồng', '{夫婦|ふうふ} fuufu — vợ chồng'],
        ['妻', '**{妻|つま}** tsuma — vợ', '{夫妻|ふさい} fusai — ông bà (vợ chồng)'],
        ['子', '**{子|こ}ども** kodomo — con', '{女子|じょし} joshi — nữ · {男子|だんし} danshi — nam'],
        ['親', '{親|おや} oya — cha mẹ', '**{両親|りょうしん}** ryoushin · **{親切|しんせつ}** shinsetsu'],
        ['人', '**{人|ひと}** hito — người', '**{日本人|にほんじん}** nihonjin · **{3人|さんにん}** sannin · **ご{主人|しゅじん}**'],
        ['大', '**{大|おお}きい** ookii — to', '**{大学生|だいがくせい}** daigakusei · **{大切|たいせつ}** taisetsu'],
        ['生', '{生|い}きます ikimasu — sống', '**{学生|がくせい}** gakusei · **{先生|せんせい}** sensei · **{高校生|こうこうせい}**'],
        ['先', '{先|さき} saki — phía trước', '**{先輩|せんぱい}** senpai · **{先生|せんせい}** sensei'],
        ['後', '**{後|うし}ろ** ushiro — phía sau', '**{後輩|こうはい}** kouhai · **{午後|ごご}** gogo'],
        ['住', '**{住|す}みます** sumimasu — sống', '{住所|じゅうしょ} juusho — địa chỉ'],
        ['高', '**{高|たか}い** takai — cao, đắt', '**{高校|こうこう}** koukou — trường cấp 3'],
        ['体', '**{体|からだ}** karada — cơ thể', '**{体育館|たいいくかん}** taiikukan — nhà thể chất'],
        ['口', '**{口|くち}** kuchi — miệng', '{人口|じんこう} jinkou — dân số · **{入口|いりぐち}** (Kun, ぐち)'],
        ['目', '**{目|め}** me — mắt', '{目的|もくてき} mokuteki — mục đích'],
        ['耳', '**{耳|みみ}** mimi — tai', '{耳鼻科|じびか} jibika — khoa tai mũi'],
        ['頭', '**{頭|あたま}** atama — đầu', '{頭痛|ずつう} zutsuu — đau đầu'],
        ['長', '**{長|なが}い** nagai — dài', '{社長|しゃちょう} shachou — giám đốc'],
        ['短', '**{短|みじか}い** mijikai — ngắn', '{短期大学|たんきだいがく} tanki daigaku — cao đẳng'],
        ['黒', '**{黒|くろ}い** kuroi — đen', '{黒板|こくばん} kokuban — bảng đen'],
        ['白', '**{白|しろ}い** shiroi — trắng', '{白紙|はくし} hakushi — giấy trắng'],
        ['色', '{色|いろ} iro — màu', '**{茶色|ちゃいろ}** (Kun いろ) · {景色|けしき} keshiki — phong cảnh (đặc biệt)'],
        ['切', '**{切|き}ります** kirimasu — cắt', '**{親切|しんせつ}** shinsetsu · **{大切|たいせつ}** taisetsu'],
        ['上', '**{上|うえ}** ue — trên', '**{上手|じょうず}** jouzu — giỏi'],
        ['下', '**{下|した}** shita — dưới', '**{地下鉄|ちかてつ}** chikatetsu · **{下手|へた}** heta (đặc biệt)'],
        ['手', '**{手|て}** te — tay', '**{歌手|かしゅ}** kashu · **{上手|じょうず}** jouzu'],
        ['金', '**お{金|かね}** okane — tiền', '**{金曜日|きんようび}** kinyoubi'],
        ['書', '**{書|か}きます** kakimasu — viết', '**{辞書|じしょ}** jisho · **{図書館|としょかん}** toshokan'],
        ['紙', '{紙|かみ} kami — giấy', '**{手紙|てがみ}** tegami (Kun, かみ → がみ)'],
        ['話', '**{話|はな}します** hanashimasu — nói', '**{電話|でんわ}** denwa · {会話|かいわ} kaiwa — hội thoại'],
        ['送', '**{送|おく}ります** okurimasu — gửi', '{送料|そうりょう} souryou — phí gửi'],
      ],
    },
    {
      t: 'note',
      title: 'Cách đọc bất quy tắc cần thuộc lòng (hay ra đề)',
      items: [
        '**{上手|じょうず}** jouzu · **{下手|へた}** heta — không đọc ~~うえて~~, ~~したて~~, ~~かしゅ~~.',
        '**お{父|とう}さん · お{母|かあ}さん · お{兄|にい}さん · お{姉|ねえ}さん** — chữ đứng trong từ tôn kính đọc **とう・かあ・にい・ねえ**, khác {父|ちち}・{母|はは}・{兄|あに}・{姉|あね}.',
        '**{1人|ひとり} · {2人|ふたり}** — đọc kiểu Nhật; từ 3 trở đi mới là にん ({3人|さんにん}). **{4人|よにん}** yonin.',
        '**{息子|むすこ}** musuko — 息 thường đọc いき/ソク, ở đây đọc đặc biệt むす.',
        '**{兄弟|きょうだい}** — 兄 đọc きょう (không phải けい), 弟 đọc だい (không phải てい).',
        'Biến âm: **{手紙|てがみ}** (かみ → **がみ**), **{結婚|けっこん}** (けつ → **けっ**), **{何匹|なんびき}** / **{3匹|さんびき}** (ひき → **びき**), **{1匹|いっぴき}** (→ **ぴき**).',
      ],
    },
    {
      t: 'mcq',
      id: 'b8-kj-doc',
      title: 'Đọc chữ Hán — chọn cách đọc đúng',
      items: [
        { q: '両親', options: ['りょうおや', 'りょうしん', 'りょしん', 'りょうじん'], correct: 1, why: '両 リョウ + 親 シン = **りょうしん** — bố mẹ.' },
        { q: '兄弟', options: ['けいてい', 'きょうだい', 'あにおとうと', 'きょうてい'], correct: 1, why: '**きょうだい** — anh chị em (đọc đặc biệt).' },
        { q: 'お兄さん', options: ['おあにさん', 'おにいさん', 'おけいさん', 'おにさん'], correct: 1, why: '**おにいさん** — anh trai (người khác).' },
        { q: 'お姉さん', options: ['おあねさん', 'おねえさん', 'おねさん', 'おしさん'], correct: 1, why: '**おねえさん** — trường âm ねえ.' },
        { q: '妹', options: ['いもうと', 'おとうと', 'いもと', 'まい'], correct: 0, why: '**いもうと** — em gái. おとうと là {弟|おとうと} (em trai).' },
        { q: '息子', options: ['いきこ', 'むすこ', 'そくし', 'むすめ'], correct: 1, why: '**むすこ** — con trai. むすめ là {娘|むすめ}.' },
        { q: '医者', options: ['いしゃ', 'いしゃあ', 'いもの', 'いじゃ'], correct: 0, why: '**いしゃ** — bác sĩ.' },
        { q: '高校生', options: ['こうこうせい', 'こうこせい', 'たかこうせい', 'こうこうしょう'], correct: 0, why: '**こうこうせい** — hai trường âm こう.' },
        { q: '先輩', options: ['せんぱい', 'せんはい', 'さきはい', 'せんばい'], correct: 0, why: 'はい → **ぱい**: せんぱい.' },
        { q: '後輩', options: ['ごはい', 'こうはい', 'あとはい', 'うしろはい'], correct: 1, why: '**こうはい** — đàn em.' },
        { q: '背が高い', options: ['せがたかい', 'はいがたかい', 'せいがたかい', 'せがこうい'], correct: 0, why: '{背|せ} đọc **せ**.' },
        { q: '髪', options: ['かみ', 'かお', 'はつ', 'め'], correct: 0, why: '**かみ** — tóc.' },
        { q: '顔', options: ['かみ', 'かお', 'がん', 'くち'], correct: 1, why: '**かお** — mặt.' },
        { q: '優しい', options: ['やさしい', 'ゆうしい', 'やさい', 'やさしい（易しい）'], correct: 0, why: '**やさしい** — hiền.' },
        { q: '上手', options: ['うえて', 'じょうず', 'じょうて', 'かみて'], correct: 1, why: 'Đọc đặc biệt **じょうず**.' },
        { q: '下手', options: ['したて', 'かて', 'へた', 'げしゅ'], correct: 2, why: 'Đọc đặc biệt **へた**.' },
        { q: '親切', options: ['しんせつ', 'おやきり', 'しんきり', 'しんせち'], correct: 0, why: '**しんせつ** — tốt bụng.' },
        { q: '茶色い', options: ['ちゃいろい', 'ちゃしょくい', 'さいろい', 'ちゃいい'], correct: 0, why: '**ちゃいろい** — màu nâu.' },
        { q: '手紙', options: ['てかみ', 'てがみ', 'しゅし', 'てし'], correct: 1, why: 'かみ → **がみ**: てがみ.' },
        { q: '辞書', options: ['じしょ', 'じしょう', 'ししょ', 'じかき'], correct: 0, why: '**じしょ** — しょ ngắn.' },
        { q: '結婚式', options: ['けつこんしき', 'けっこんしき', 'けっこんしょく', 'けっこしき'], correct: 1, why: 'けつ → **けっ**: けっこんしき.' },
        { q: '靴下', options: ['くつした', 'かした', 'くつか', 'くつしも'], correct: 0, why: '**くつした** — tất.' },
        { q: '経済', options: ['けいざい', 'けいさい', 'きょうざい', 'けざい'], correct: 0, why: '**けいざい** — kinh tế (さい → ざい).' },
        { q: '素敵', options: ['すてき', 'そてき', 'すでき', 'すてぎ'], correct: 0, why: '**すてき** — đẹp, tuyệt.' },
      ],
    },

    /* ── Đọc không furigana ── */
    { t: 'h', text: 'Từ chữ Hán hay gặp trong đề đọc' },
    {
      t: 'p',
      text: 'Đề Reading không in furigana. Nhìn câu (đã ẩn furigana), **đọc to trước**, rồi mới bấm hiện cách đọc + nghe để tự chấm. Đọc sai chữ nào thì đánh dấu, quay lại bảng ở trên.',
    },
    {
      t: 'readkanji',
      id: 'b8-doc-kanji',
      title: 'Đọc to câu có chữ Hán Bài 8 (không furigana)',
      note: 'Mỗi câu 1–2 từ chữ Hán của bài. Chú ý những chữ đọc đặc biệt: 上手, 下手, お兄さん, 1人, 息子, 兄弟.',
      items: [
        { text: '{私|わたし}の{両親|りょうしん}はハノイに{住|す}んでいます。', ro: 'Watashi no ryoushin wa Hanoi ni sunde imasu.', vi: 'Bố mẹ tôi sống ở Hà Nội.' },
        { text: '{父|ちち}は{医者|いしゃ}です。', ro: 'Chichi wa isha desu.', vi: 'Bố tôi là bác sĩ.' },
        { text: '{母|はは}は{高校|こうこう}で{英語|えいご}を{教|おし}えています。', ro: 'Haha wa koukou de eigo o oshiete imasu.', vi: 'Mẹ tôi dạy tiếng Anh ở trường cấp 3.' },
        { text: '{兄弟|きょうだい}がいますか。', ro: 'Kyoudai ga imasu ka.', vi: 'Bạn có anh chị em không?' },
        { text: '{姉|あね}が{1人|ひとり}と{弟|おとうと}が{2人|ふたり}います。', ro: 'Ane ga hitori to otouto ga futari imasu.', vi: 'Tôi có một chị gái và hai em trai.' },
        { text: 'お{兄|にい}さんは{何|なに}をしていますか。', ro: 'Oniisan wa nani o shite imasu ka.', vi: 'Anh trai bạn làm gì?' },
        { text: '{妹|いもうと}は{高校生|こうこうせい}です。', ro: 'Imouto wa koukousei desu.', vi: 'Em gái tôi là học sinh cấp 3.' },
        { text: '{息子|むすこ}と{娘|むすめ}がいます。', ro: 'Musuko to musume ga imasu.', vi: 'Tôi có con trai và con gái.' },
        { text: '{猫|ねこ}が{3匹|さんびき}います。', ro: 'Neko ga sanbiki imasu.', vi: 'Có ba con mèo.' },
        { text: '{先輩|せんぱい}は{背|せ}が{高|たか}いです。', ro: 'Senpai wa se ga takai desu.', vi: 'Đàn anh cao.' },
        { text: 'アンナさんは{髪|かみ}が{長|なが}くて、{目|め}が{大|おお}きいです。', ro: 'Anna-san wa kami ga nagakute, me ga ookii desu.', vi: 'Anna tóc dài, mắt to.' },
        { text: '{後輩|こうはい}のキムさんは{頭|あたま}がいいです。', ro: 'Kouhai no Kimu-san wa atama ga ii desu.', vi: 'Kim, đàn em của tôi, thông minh.' },
        { text: '{祖母|そぼ}は{優|やさ}しくて、{元気|げんき}です。', ro: 'Sobo wa yasashikute, genki desu.', vi: 'Bà tôi hiền và khoẻ mạnh.' },
        { text: 'マルコさんはサッカーが{上手|じょうず}です。', ro: 'Maruko-san wa sakkaa ga jouzu desu.', vi: 'Marco đá bóng giỏi.' },
        { text: '{私|わたし}は{歌|うた}が{下手|へた}です。', ro: 'Watashi wa uta ga heta desu.', vi: 'Tôi hát dở.' },
        { text: 'ナタポンさんは{親切|しんせつ}な{人|ひと}です。', ro: 'Natapon-san wa shinsetsu na hito desu.', vi: 'Natapon là người tốt bụng.' },
        { text: '{友達|ともだち}に{手紙|てがみ}を{送|おく}りました。', ro: 'Tomodachi ni tegami o okurimashita.', vi: 'Tôi đã gửi thư cho bạn.' },
        { text: '{先輩|せんぱい}に{辞書|じしょ}をもらいました。', ro: 'Senpai ni jisho o moraimashita.', vi: 'Tôi nhận từ điển của đàn anh.' },
        { text: '{来月|らいげつ}、{姉|あね}の{結婚式|けっこんしき}があります。', ro: 'Raigetsu, ane no kekkonshiki ga arimasu.', vi: 'Tháng sau có đám cưới chị tôi.' },
        { text: '{弟|おとうと}は{大学|だいがく}で{経済|けいざい}を{勉強|べんきょう}しています。', ro: 'Otouto wa daigaku de keizai o benkyou shite imasu.', vi: 'Em trai tôi học kinh tế ở đại học.' },
        { text: 'そのかばん、{素敵|すてき}ですね。', ro: 'Sono kaban, suteki desu ne.', vi: 'Cái túi đó đẹp nhỉ.' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b8-doc-doan',
      title: 'Đọc to đoạn văn dạng đề thi (không furigana)',
      note: 'Mỗi đoạn ~100 ký tự như đề Reading: vài từ chữ Hán, vài từ katakana, còn lại hiragana. 30 giây chuẩn bị rồi đọc liền một mạch.',
      items: [
        { text: 'わたしのかぞくは{五人|ごにん}です。{父|ちち}と{母|はは}と{姉|あね}と{弟|おとうと}とわたしです。{父|ちち}は{医者|いしゃ}で、びょういんではたらいています。{姉|あね}はデパートではたらいています。{弟|おとうと}はこうこうせいで、サッカーがじょうずです。', ro: 'Watashi no kazoku wa gonin desu. Chichi to haha to ane to otouto to watashi desu. Chichi wa isha de, byouin de hataraite imasu. Ane wa depaato de hataraite imasu. Otouto wa koukousei de, sakkaa ga jouzu desu.', vi: 'Nhà tôi có năm người: bố, mẹ, chị gái, em trai và tôi. Bố tôi là bác sĩ, làm ở bệnh viện. Chị tôi làm ở trung tâm thương mại. Em trai tôi là học sinh cấp 3, đá bóng giỏi.' },
        { text: 'わたしはよこはまにすんでいます。ルームメイトと{三人|さんにん}ですんでいます。マリヤムさんは{背|せ}がたかくて、{髪|かみ}がながいです。とてもしんせつな{人|ひと}です。まいばん、いっしょにテレビをみます。', ro: 'Watashi wa Yokohama ni sunde imasu. Ruumumeito to sannin de sunde imasu. Mariyamu-san wa se ga takakute, kami ga nagai desu. Totemo shinsetsu na hito desu. Maiban, issho ni terebi o mimasu.', vi: 'Tôi sống ở Yokohama, cùng các bạn cùng phòng, tổng cộng ba người. Mariyam cao, tóc dài. Là người rất tốt bụng. Tối nào chúng tôi cũng cùng xem tivi.' },
        { text: 'せんしゅうはわたしのたんじょうびでした。ともだちがケーキをつくりました。パクさんはわたしにネックレスをくれました。{先輩|せんぱい}には{辞書|じしょ}をもらいました。{祖母|そぼ}もカードをおくりました。とてもうれしかったです。', ro: 'Senshuu wa watashi no tanjoubi deshita. Tomodachi ga keeki o tsukurimashita. Paku-san wa watashi ni nekkuresu o kuremashita. Senpai ni wa jisho o moraimashita. Sobo mo kaado o okurimashita. Totemo ureshikatta desu.', vi: 'Tuần trước là sinh nhật tôi. Bạn tôi làm bánh kem. Park tặng tôi sợi dây chuyền. Còn đàn anh thì tặng tôi từ điển. Bà tôi cũng gửi thiệp. Tôi rất vui.' },
        { text: 'もうすぐクリスマスです。わたしは{母|はは}にはなをあげたいです。{父|ちち}にはくつしたをあげます。{妹|いもうと}はチョコレートがすきですから、チョコレートをあげます。あした、デパートへかいにいきます。', ro: 'Mousugu kurisumasu desu. Watashi wa haha ni hana o agetai desu. Chichi ni wa kutsushita o agemasu. Imouto wa chokoreeto ga suki desu kara, chokoreeto o agemasu. Ashita, depaato e kai ni ikimasu.', vi: 'Sắp đến Giáng sinh. Tôi muốn tặng mẹ hoa. Bố thì tôi tặng đôi tất. Em gái thích sô-cô-la nên tôi tặng sô-cô-la. Ngày mai tôi đi mua ở trung tâm thương mại.' },
      ],
    },
    {
      t: 'write',
      id: 'b8-viet-kanji',
      title: 'Tập viết tay chữ Hán của Bài 8 (✍ trước, 👁 sau)',
      note: '22 chữ đầu là chữ ✍ nên viết (ít nét, gặp khắp nơi): 父 母 兄 夫 子 人 大 学 生 先 口 目 耳 足 上 下 手 白 元 気 金 何. Phần sau là chữ 👁 — chỉ cần nhận mặt, viết thử nếu còn sức. Bấm ▶ Thứ tự nét trước khi viết; viết xong nhờ ✨ AI xem chữ.',
      chars: ['父', '母', '兄', '夫', '子', '人', '大', '学', '生', '先', '口', '目', '耳', '足', '上', '下', '手', '白', '元', '気', '金', '何', '両', '親', '弟', '姉', '妹', '妻', '息', '娘', '祖', '主', '奥', '医', '者', '高', '校', '匹', '猫', '住', '輩', '後', '体', '顔', '髪', '鼻', '頭', '背', '長', '短', '優', '黒', '茶', '色', '切', '傘', '靴', '辞', '書', '紙', '結', '婚', '式', '送', '電', '話', '経', '済', '素', '敵'],
    },
  ],
};

/* ═══════════════════════════ 5. NGHE ═══════════════════════════ */

const NGHE: Lesson = {
  id: 'b8-nghe',
  kind: 'listening',
  title: 'Luyện nghe — sống ở đâu, người thế nào, ai tặng gì',
  goal: 'Nghe ra nơi ở, số người, nghề của người được nhắc tới; nghe tả người để chọn đúng người trong ảnh; nghe ra ai cho ai cái gì.',
  minutes: 45,
  blocks: [
    {
      t: 'note',
      title: 'Cách nghe',
      items: [
        'Nơi ở: bắt từ đứng trước **に{住|す}んでいます**. Nghề: bắt **～です** + **～で{働|はたら}いています／{教|おし}えています**.',
        'Số người: bắt **ひとり・ふたり・さんにん・よにん** và **～で** ({2人|ふたり}**で**{住|す}んでいます = tổng hai người, tính cả người nói).',
        'Tả người: bắt cặp **bộ phận + tính từ** ({背|せ}が{高|たか}い, {髪|かみ}が{短|みじか}い, {目|め}が{大|おお}きい). Hay có **bẫy**: người đầu tiên được hỏi "người này à?" thường KHÔNG phải — nghe tới câu xác nhận cuối.',
        'Cho – nhận: **くれました** = (người đó) cho NGƯỜI NÓI; **もらいました** = người nói NHẬN của ai (tên + に); **あげました** = người nói cho ai (tên + に). Nghe động từ ở CUỐI rồi mới quyết định hướng.',
      ],
    },

    /* ── Bài 1 ── */
    { t: 'h', text: 'Bài 1 — Sống ở đâu? Với ai? (やってみよう)' },
    {
      t: 'p',
      text: 'Nghe 4 đoạn ngắn. Mỗi đoạn một người kể mình sống ở đâu, với ai, chỗ đó thế nào.',
    },
    {
      t: 'listen',
      id: 'b8-ng-1a',
      title: '① ダニエル',
      lines: [
        { who: 'アンナ', voice: 'ja-nu', text: 'ダニエルさんはどこに{住|す}んでいますか。', ro: 'Danieru-san wa doko ni sunde imasu ka.', vi: 'Daniel sống ở đâu?' },
        { who: 'ダニエル', voice: 'ja-nam', text: '{新宿|しんじゅく}に{住|す}んでいます。にぎやかで、{便利|べんり}ですよ。', ro: 'Shinjuku ni sunde imasu. Nigiyaka de, benri desu yo.', vi: 'Mình sống ở Shinjuku. Nhộn nhịp và tiện lắm.' },
        { who: 'アンナ', voice: 'ja-nu', text: '{1人|ひとり}で{住|す}んでいますか。', ro: 'Hitori de sunde imasu ka.', vi: 'Bạn sống một mình à?' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'はい、{1人|ひとり}です。', ro: 'Hai, hitori desu.', vi: 'Ừ, một mình.' },
      ],
    },
    {
      t: 'listen',
      id: 'b8-ng-1b',
      title: '② ワン',
      lines: [
        { who: 'マルコ', voice: 'ja-nam', text: 'ワンさんは{学校|がっこう}の{近|ちか}くに{住|す}んでいますか。', ro: 'Wan-san wa gakkou no chikaku ni sunde imasu ka.', vi: 'Wang sống gần trường à?' },
        { who: 'ワン', voice: 'ja-nu', text: 'いいえ、{千葉|ちば}に{住|す}んでいます。{学校|がっこう}まで{電車|でんしゃ}で{1時間|いちじかん}です。', ro: 'Iie, Chiba ni sunde imasu. Gakkou made densha de ichijikan desu.', vi: 'Không, mình sống ở Chiba. Đến trường mất một tiếng bằng tàu điện.' },
        { who: 'マルコ', voice: 'ja-nam', text: '{遠|とお}いですね。{誰|だれ}と{住|す}んでいますか。', ro: 'Tooi desu ne. Dare to sunde imasu ka.', vi: 'Xa nhỉ. Bạn sống với ai?' },
        { who: 'ワン', voice: 'ja-nu', text: '{姉|あね}と{2人|ふたり}で{住|す}んでいます。{姉|あね}は{千葉|ちば}の{会社|かいしゃ}で{働|はたら}いています。', ro: 'Ane to futari de sunde imasu. Ane wa Chiba no kaisha de hataraite imasu.', vi: 'Mình sống hai người với chị gái. Chị mình làm ở một công ty ở Chiba.' },
      ],
    },
    {
      t: 'listen',
      id: 'b8-ng-1c',
      title: '③ パク',
      lines: [
        { who: 'ナタポン', voice: 'ja-nam', text: 'パクさんのうちはどこですか。', ro: 'Paku-san no uchi wa doko desu ka.', vi: 'Nhà Park ở đâu?' },
        { who: 'パク', voice: 'ja-nu', text: '{横浜|よこはま}です。{友達|ともだち}{2人|ふたり}と{3人|さんにん}で{住|す}んでいます。', ro: 'Yokohama desu. Tomodachi futari to sannin de sunde imasu.', vi: 'Ở Yokohama. Mình sống với hai người bạn, tổng ba người.' },
        { who: 'ナタポン', voice: 'ja-nam', text: '{横浜|よこはま}はどんなところですか。', ro: 'Yokohama wa donna tokoro desu ka.', vi: 'Yokohama là nơi thế nào?' },
        { who: 'パク', voice: 'ja-nu', text: '{海|うみ}が{近|ちか}くて、きれいなところです。', ro: 'Umi ga chikakute, kirei na tokoro desu.', vi: 'Gần biển, là nơi đẹp.' },
      ],
    },
    {
      t: 'listen',
      id: 'b8-ng-1d',
      title: '④ マルコ',
      lines: [
        { who: 'パク', voice: 'ja-nu', text: 'マルコさんのご{家族|かぞく}はどこに{住|す}んでいますか。', ro: 'Maruko-san no gokazoku wa doko ni sunde imasu ka.', vi: 'Gia đình Marco sống ở đâu?' },
        { who: 'マルコ', voice: 'ja-nam', text: '{両親|りょうしん}はイタリアに{住|す}んでいます。{兄|あに}は{結婚|けっこん}しています。{兄|あに}はアメリカに{住|す}んでいます。', ro: 'Ryoushin wa Itaria ni sunde imasu. Ani wa kekkon shite imasu. Ani wa Amerika ni sunde imasu.', vi: 'Bố mẹ mình sống ở Ý. Anh mình đã lập gia đình. Anh mình sống ở Mỹ.' },
        { who: 'パク', voice: 'ja-nu', text: 'そうですか。お{兄|にい}さんは{何|なに}をしていますか。', ro: 'Sou desu ka. Oniisan wa nani o shite imasu ka.', vi: 'Vậy à. Anh bạn làm gì?' },
        { who: 'マルコ', voice: 'ja-nam', text: '{大学|だいがく}の{先生|せんせい}です。{経済|けいざい}を{教|おし}えています。', ro: 'Daigaku no sensei desu. Keizai o oshiete imasu.', vi: 'Là giảng viên đại học. Dạy kinh tế.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b8-ng-1-q',
      title: 'Câu hỏi bài 1',
      items: [
        { q: '① ダニエルさんはどこに{住|す}んでいますか。', options: ['{新宿|しんじゅく}', '{横浜|よこはま}', '{千葉|ちば}', '{上野|うえの}'], correct: 0, why: '**{新宿|しんじゅく}に**{住|す}んでいます。' },
        { q: '① ダニエルさんは{誰|だれ}と{住|す}んでいますか。', options: ['{友達|ともだち}と', '{姉|あね}と', '{1人|ひとり}で', '{家族|かぞく}と'], correct: 2, why: '「{1人|ひとり}で{住|す}んでいますか」——「はい、**{1人|ひとり}**です」.' },
        { q: '② ワンさんは{学校|がっこう}まで{何|なに}で{何分|なんぷん}ぐらいですか。', options: ['バスで{30分|さんじゅっぷん}', '{電車|でんしゃ}で{1時間|いちじかん}', '{歩|ある}いて{10分|じゅっぷん}', '{電車|でんしゃ}で{30分|さんじゅっぷん}'], correct: 1, why: '**{電車|でんしゃ}で{1時間|いちじかん}**です。' },
        { q: '② ワンさんのお{姉|ねえ}さんは{何|なに}をしていますか。', options: ['{学生|がくせい}です', '{会社|かいしゃ}で{働|はたら}いています', '{先生|せんせい}です', '{医者|いしゃ}です'], correct: 1, why: '{姉|あね}は{千葉|ちば}の**{会社|かいしゃ}で{働|はたら}いています**。' },
        { q: '③ パクさんは{何人|なんにん}で{住|す}んでいますか。', options: ['{2人|ふたり}', '{3人|さんにん}', '{4人|よにん}', '{1人|ひとり}'], correct: 1, why: 'Bẫy: {友達|ともだち}**{2人|ふたり}**と **{3人|さんにん}で** — hai bạn + Park = ba người.' },
        { q: '③ {横浜|よこはま}はどんなところですか。', options: ['にぎやかで、{便利|べんり}なところ', '{海|うみ}が{近|ちか}くて、きれいなところ', '{静|しず}かで、{古|ふる}いところ', '{遠|とお}くて、{不便|ふべん}なところ'], correct: 1, why: '**{海|うみ}が{近|ちか}くて、きれいな**ところです。' },
        { q: '④ マルコさんのお{兄|にい}さんはどこに{住|す}んでいますか。', options: ['イタリア', 'アメリカ', '{日本|にほん}', 'Không nói'], correct: 1, why: 'Bẫy: {両親|りょうしん} ở イタリア; **{兄|あに}はアメリカに**{住|す}んでいます.' },
        { q: '④ お{兄|にい}さんの{仕事|しごと}は？', options: ['{医者|いしゃ}', '{会社員|かいしゃいん}', '{大学|だいがく}の{先生|せんせい}', '{大学生|だいがくせい}'], correct: 2, why: '**{大学|だいがく}の{先生|せんせい}**です。{経済|けいざい}を{教|おし}えています。' },
      ],
    },

    /* ── Bài 2 ── */
    { t: 'h', text: 'Bài 2 — Người nào? (nghe tả người, chọn đúng người trong ảnh)' },
    {
      t: 'table',
      caption: 'Ảnh đám cưới — 4 người đứng hàng đầu (tả lại bằng chữ)',
      head: ['Vị trí', 'Ngoại hình'],
      rows: [
        ['ⓐ', 'nam, cao, tóc ngắn, đeo kính'],
        ['ⓑ', 'nữ, thấp, tóc dài màu đen, mắt to'],
        ['ⓒ', 'nam, không cao lắm, tóc ngắn, đang cười'],
        ['ⓓ', 'nữ, cao, tóc ngắn màu nâu'],
      ],
    },
    {
      t: 'listen',
      id: 'b8-ng-2',
      title: 'Anna cho Daniel xem ảnh đám cưới chị gái',
      note: 'Nghe: mỗi người trong ảnh là ai và là người thế nào.',
      lines: [
        { who: 'アンナ', voice: 'ja-nu', text: 'これは{姉|あね}の{結婚式|けっこんしき}の{写真|しゃしん}です。', ro: 'Kore wa ane no kekkonshiki no shashin desu.', vi: 'Đây là ảnh đám cưới chị mình.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'へえ、{素敵|すてき}ですね。お{姉|ねえ}さんはどの{人|ひと}ですか。', ro: 'Hee, suteki desu ne. Oneesan wa dono hito desu ka.', vi: 'Ồ, đẹp quá. Chị bạn là người nào?' },
        { who: 'アンナ', voice: 'ja-nu', text: 'この{髪|かみ}が{長|なが}くて、{目|め}が{大|おお}きい{人|ひと}です。', ro: 'Kono kami ga nagakute, me ga ookii hito desu.', vi: 'Người tóc dài, mắt to này.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'きれいですね。じゃ、この{背|せ}が{高|たか}い{人|ひと}はご{主人|しゅじん}ですか。', ro: 'Kirei desu ne. Ja, kono se ga takai hito wa goshujin desu ka.', vi: 'Đẹp nhỉ. Vậy người cao này là chồng chị ấy à?' },
        { who: 'アンナ', voice: 'ja-nu', text: 'いいえ、それは{私|わたし}の{兄|あに}です。{姉|あね}の{夫|おっと}はこの{人|ひと}です。{背|せ}はあまり{高|たか}くないですが、おもしろくて、{優|やさ}しい{人|ひと}ですよ。', ro: 'Iie, sore wa watashi no ani desu. Ane no otto wa kono hito desu. Se wa amari takakunai desu ga, omoshirokute, yasashii hito desu yo.', vi: 'Không, đó là anh trai mình. Chồng chị mình là người này. Không cao lắm nhưng vui tính và hiền lắm.' },
        { who: 'ダニエル', voice: 'ja-nam', text: 'そうですか。この{髪|かみ}が{短|みじか}い{女|おんな}の{人|ひと}は？', ro: 'Sou desu ka. Kono kami ga mijikai onna no hito wa?', vi: 'Vậy à. Còn người phụ nữ tóc ngắn này?' },
        { who: 'アンナ', voice: 'ja-nu', text: '{姉|あね}の{友達|ともだち}です。テニスがとても{上手|じょうず}です。', ro: 'Ane no tomodachi desu. Tenisu ga totemo jouzu desu.', vi: 'Bạn của chị mình. Chơi tennis rất giỏi.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b8-ng-2-q',
      title: 'Câu hỏi bài 2',
      items: [
        { q: 'アンナさんのお{姉|ねえ}さんはどの{人|ひと}ですか。', options: ['ⓐ', 'ⓑ', 'ⓒ', 'ⓓ'], correct: 1, why: '**{髪|かみ}が{長|なが}くて、{目|め}が{大|おお}きい**{人|ひと} → ⓑ.' },
        { q: 'ⓐ (cao, tóc ngắn, nam) は{誰|だれ}ですか。', options: ['お{姉|ねえ}さんのご{主人|しゅじん}', 'アンナさんのお{兄|にい}さん', 'お{姉|ねえ}さんの{友達|ともだち}', 'アンナさんのお{父|とう}さん'], correct: 1, why: 'Bẫy: Daniel đoán là chồng, Anna sửa: **それは{私|わたし}の{兄|あに}です**.' },
        { q: 'お{姉|ねえ}さんのご{主人|しゅじん}はどの{人|ひと}ですか。', options: ['ⓐ', 'ⓒ', 'ⓓ', 'Không có trong ảnh'], correct: 1, why: '{背|せ}はあまり{高|たか}くない nam → **ⓒ**.' },
        { q: 'ご{主人|しゅじん}はどんな{人|ひと}ですか。', options: ['まじめで、{頭|あたま}がいい', 'おもしろくて、{優|やさ}しい', '{元気|げんき}で、かっこいい', 'テニスが{上手|じょうず}'], correct: 1, why: '**おもしろくて、{優|やさ}しい**{人|ひと}ですよ。' },
        { q: 'ⓓ の{人|ひと}は{何|なに}が{上手|じょうず}ですか。', options: ['サッカー', 'ピアノ', 'テニス', '{料理|りょうり}'], correct: 2, why: '{姉|あね}の{友達|ともだち}です。**テニス**がとても{上手|じょうず}です。' },
      ],
    },

    /* ── Bài 3 ── */
    { t: 'h', text: 'Bài 3 — Tặng gì? (やってみよう — bàn chọn quà)' },
    {
      t: 'listen',
      id: 'b8-ng-3a',
      title: '① Quà sinh nhật cho Wang',
      lines: [
        { who: 'パク', voice: 'ja-nu', text: 'ナタポンさん、{来週|らいしゅう}、ワンさんの{誕生日|たんじょうび}ですね。{一緒|いっしょ}に{何|なに}かあげませんか。', ro: 'Natapon-san, raishuu, Wan-san no tanjoubi desu ne. Issho ni nanika agemasen ka.', vi: 'Natapon, tuần sau sinh nhật Wang nhỉ. Cùng tặng cái gì đó không?' },
        { who: 'ナタポン', voice: 'ja-nam', text: 'いいですね。ワンさんは{本|ほん}が{好|す}きですから、{本|ほん}はどうですか。', ro: 'Ii desu ne. Wan-san wa hon ga suki desu kara, hon wa dou desu ka.', vi: 'Hay đấy. Wang thích sách nên tặng sách thì sao?' },
        { who: 'パク', voice: 'ja-nu', text: '{本|ほん}はたくさんありますよ。ワンさんは{猫|ねこ}が{好|す}きです。{猫|ねこ}の{傘|かさ}はどうですか。{駅|えき}の{前|まえ}の{店|みせ}にかわいい{傘|かさ}がありますよ。', ro: 'Hon wa takusan arimasu yo. Wan-san wa neko ga suki desu. Neko no kasa wa dou desu ka. Eki no mae no mise ni kawaii kasa ga arimasu yo.', vi: 'Sách thì cậu ấy có nhiều rồi. Wang thích mèo. Cái ô hình mèo thì sao? Tiệm trước ga có ô dễ thương lắm.' },
        { who: 'ナタポン', voice: 'ja-nam', text: 'いいですね。じゃ、{傘|かさ}をあげましょう。', ro: 'Ii desu ne. Ja, kasa o agemashou.', vi: 'Được đấy. Vậy tặng ô nhé.' },
      ],
    },
    {
      t: 'listen',
      id: 'b8-ng-3b',
      title: '② Quà chia tay John về nước',
      lines: [
        { who: 'マルコ', voice: 'ja-nam', text: 'ジョンさんは{来月|らいげつ}、{国|くに}へ{帰|かえ}りますね。クラスのみんなで{何|なに}かあげませんか。', ro: 'Jon-san wa raigetsu, kuni e kaerimasu ne. Kurasu no minna de nanika agemasen ka.', vi: 'Tháng sau John về nước nhỉ. Cả lớp cùng tặng cái gì đó không?' },
        { who: 'メアリー', voice: 'ja-nu', text: 'そうですね。{写真|しゃしん}とカードはどうですか。みんなでカードを{書|か}きましょう。', ro: 'Sou desu ne. Shashin to kaado wa dou desu ka. Minna de kaado o kakimashou.', vi: 'Ừ nhỉ. Ảnh và thiệp thì sao? Mọi người cùng viết thiệp.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'いいですね。ジョンさんはコーヒーが{好|す}きですから、コーヒーカップもあげたいです。', ro: 'Ii desu ne. Jon-san wa koohii ga suki desu kara, koohii kappu mo agetai desu.', vi: 'Hay đấy. John thích cà phê nên mình muốn tặng thêm cốc cà phê.' },
        { who: 'メアリー', voice: 'ja-nu', text: 'でも、ジョンさんの{国|くに}は{遠|とお}いですよ。カップはちょっと……。{写真|しゃしん}とカードをあげましょう。', ro: 'Demo, Jon-san no kuni wa tooi desu yo. Kappu wa chotto……. Shashin to kaado o agemashou.', vi: 'Nhưng nước John xa lắm đấy. Cốc thì hơi… Tặng ảnh và thiệp thôi.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'そうですね。わかりました。', ro: 'Sou desu ne. Wakarimashita.', vi: 'Ừ nhỉ. Được rồi.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b8-ng-3-q',
      title: 'Câu hỏi bài 3 — cuối cùng tặng gì?',
      items: [
        { q: '① ワンさんに{何|なに}をあげますか。', options: ['{本|ほん}', '{猫|ねこ}の{傘|かさ}', 'カード', '{花|はな}'], correct: 1, why: 'Bẫy: {本|ほん} bị gạt (có nhiều rồi) → **{傘|かさ}をあげましょう**.' },
        { q: '① どうしてそれにしましたか。', options: ['ワンさんは{本|ほん}が{好|す}きですから', 'ワンさんは{猫|ねこ}が{好|す}きですから', '{安|やす}いですから', '{雨|あめ}ですから'], correct: 1, why: 'ワンさんは**{猫|ねこ}が{好|す}き**です → {猫|ねこ}の{傘|かさ}.' },
        { q: '② ジョンさんに{何|なに}をあげますか。', options: ['コーヒーカップ', '{写真|しゃしん}とカード', '{写真|しゃしん}とカードとカップ', 'コーヒー'], correct: 1, why: 'Bẫy: Marco muốn thêm cốc nhưng Mary gạt (カップはちょっと……) → **{写真|しゃしん}とカード**.' },
      ],
    },

    /* ── Bài 4 ── */
    { t: 'h', text: 'Bài 4 — Ai tặng cái gì? (やってみよう — 誰が何をくれましたか)' },
    {
      t: 'listen',
      id: 'b8-ng-4',
      title: 'Ba người kể về món quà vui nhất',
      lines: [
        { who: '① ダニエル', voice: 'ja-nam', text: '{去年|きょねん}のクリスマスに、{祖母|そぼ}が{靴下|くつした}をくれました。{祖母|そぼ}が{作|つく}りました。とても{暖|あたた}かいです。', ro: 'Kyonen no kurisumasu ni, sobo ga kutsushita o kuremashita. Sobo ga tsukurimashita. Totemo atatakai desu.', vi: 'Giáng sinh năm ngoái bà tặng tôi đôi tất. Bà tự làm. Ấm lắm.' },
        { who: '② ワン', voice: 'ja-nu', text: '{去年|きょねん}の{誕生日|たんじょうび}に、{父|ちち}に{辞書|じしょ}をもらいました。{毎日|まいにち}{使|つか}っています。', ro: 'Kyonen no tanjoubi ni, chichi ni jisho o moraimashita. Mainichi tsukatte imasu.', vi: 'Sinh nhật năm ngoái tôi nhận quyển từ điển của bố. Ngày nào cũng dùng.' },
        { who: '③ メアリー', voice: 'ja-nu', text: '{私|わたし}は{妹|いもうと}にネックレスをあげました。でも、{私|わたし}のいちばんうれしかったプレゼントは{手紙|てがみ}です。{母|はは}がくれました。', ro: 'Watashi wa imouto ni nekkuresu o agemashita. Demo, watashi no ichiban ureshikatta purezento wa tegami desu. Haha ga kuremashita.', vi: 'Tôi đã tặng em gái sợi dây chuyền. Nhưng món quà tôi vui nhất là lá thư. Mẹ tôi tặng.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b8-ng-4-q',
      title: 'Điền: ai tặng (người nói) cái gì?',
      kind: 'fill',
      items: [
        { q: '① ダニエル: ___ が ___ をくれました。(viết: người + vật, tiếng Việt hoặc tiếng Nhật)', answers: ['祖母が靴下', 'そぼがくつした', 'bà tặng tất', 'bà - tất', 'bà, tất', 'bà tất', '祖母 靴下', 'bà cho tất'] },
        { q: '② ワン nhận gì, của ai?', answers: ['父に辞書', 'ちちにじしょ', 'bố - từ điển', 'bố, từ điển', 'từ điển của bố', 'bố tặng từ điển', 'bố từ điển', '父 辞書'] },
        { q: '③ メアリー: món quà vui nhất là gì?', answers: ['手紙', 'てがみ', 'lá thư', 'thư', 'bức thư'] },
        { q: '③ Ai tặng món quà đó cho Mary?', answers: ['母', 'はは', 'mẹ', 'mẹ cô ấy', 'mẹ của Mary', 'お母さん', 'おかあさん'], hint: 'Bẫy: ネックレス là Mary TẶNG em gái (あげました)' },
      ],
    },

    /* ── Bài 5 ── */
    { t: 'h', text: 'Bài 5 — Hội thoại dài: trên tàu điện (もう{一度|いちど}{聞|き}こう)' },
    {
      t: 'listen',
      id: 'b8-ng-5',
      title: 'Wang và Marco xem ảnh trên điện thoại',
      note: 'Nghe cả bài 2 lần rồi trả lời 7 câu.',
      lines: [
        { who: 'マルコ', voice: 'ja-nam', text: 'ワンさんは{今|いま}、どこに{住|す}んでいますか。', ro: 'Wan-san wa ima, doko ni sunde imasu ka.', vi: 'Wang bây giờ sống ở đâu?' },
        { who: 'ワン', voice: 'ja-nu', text: '{吉祥寺|きちじょうじ}に{住|す}んでいます。{公園|こうえん}が{大|おお}きくて、いいところですよ。', ro: 'Kichijouji ni sunde imasu. Kouen ga ookikute, ii tokoro desu yo.', vi: 'Mình sống ở Kichijoji. Công viên rộng lớn, là chỗ tốt lắm.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'へえ。{1人|ひとり}で{住|す}んでいますか。', ro: 'Hee. Hitori de sunde imasu ka.', vi: 'Ồ. Bạn sống một mình à?' },
        { who: 'ワン', voice: 'ja-nu', text: 'いいえ、{妹|いもうと}と{2人|ふたり}で{住|す}んでいます。あ、{写真|しゃしん}がありますよ。……この{人|ひと}です。', ro: 'Iie, imouto to futari de sunde imasu. A, shashin ga arimasu yo. …… Kono hito desu.', vi: 'Không, mình sống hai người với em gái. À, có ảnh đây. … Người này.' },
        { who: 'マルコ', voice: 'ja-nam', text: '{髪|かみ}が{短|みじか}くて、かわいいですね。{妹|いもうと}さんも{学生|がくせい}ですか。', ro: 'Kami ga mijikakute, kawaii desu ne. Imoutosan mo gakusei desu ka.', vi: 'Tóc ngắn, dễ thương nhỉ. Em gái bạn cũng là sinh viên à?' },
        { who: 'ワン', voice: 'ja-nu', text: 'はい、{大学|だいがく}で{経済|けいざい}を{勉強|べんきょう}しています。{頭|あたま}がよくて、まじめですよ。', ro: 'Hai, daigaku de keizai o benkyou shite imasu. Atama ga yokute, majime desu yo.', vi: 'Ừ, đang học kinh tế ở đại học. Thông minh và chăm chỉ lắm.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'そうですか。……あ、この{白|しろ}い{猫|ねこ}は？', ro: 'Sou desu ka. …… A, kono shiroi neko wa?', vi: 'Vậy à… À, con mèo trắng này?' },
        { who: 'ワン', voice: 'ja-nu', text: '{国|くに}の{両親|りょうしん}の{猫|ねこ}です。{3匹|さんびき}います。', ro: 'Kuni no ryoushin no neko desu. Sanbiki imasu.', vi: 'Mèo của bố mẹ mình ở quê. Có ba con.' },
        { who: 'マルコ', voice: 'ja-nam', text: '{3匹|さんびき}も！　いいですね。', ro: 'Sanbiki mo! Ii desu ne.', vi: 'Những ba con! Thích nhỉ.' },
        { who: 'ワン', voice: 'ja-nu', text: 'あ、マルコさん、その{時計|とけい}、{素敵|すてき}ですね。', ro: 'A, Maruko-san, sono tokei, suteki desu ne.', vi: 'À Marco, cái đồng hồ đó đẹp nhỉ.' },
        { who: 'マルコ', voice: 'ja-nam', text: 'これですか。{誕生日|たんじょうび}に{兄|あに}にもらいました。', ro: 'Kore desu ka. Tanjoubi ni ani ni moraimashita.', vi: 'Cái này à? Mình nhận của anh trai nhân sinh nhật.' },
        { who: 'ワン', voice: 'ja-nu', text: 'へえ、いいですね。', ro: 'Hee, ii desu ne.', vi: 'Ồ, thích nhỉ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b8-ng-5-q',
      title: 'Câu hỏi bài 5',
      items: [
        { q: 'ワンさんはどこに{住|す}んでいますか。', options: ['{三鷹|みたか}', '{吉祥寺|きちじょうじ}', '{横浜|よこはま}', '{上野|うえの}'], correct: 1, why: '**{吉祥寺|きちじょうじ}に**{住|す}んでいます。' },
        { q: 'そこはどんなところですか。', options: ['にぎやかで、{便利|べんり}', '{公園|こうえん}が{大|おお}きくて、いいところ', '{海|うみ}が{近|ちか}い', '{駅|えき}から{遠|とお}い'], correct: 1, why: '**{公園|こうえん}が{大|おお}きくて**、いいところです.' },
        { q: 'ワンさんは{誰|だれ}と{住|す}んでいますか。', options: ['{1人|ひとり}で', '{妹|いもうと}と{2人|ふたり}で', '{両親|りょうしん}と', '{友達|ともだち}と{3人|さんにん}で'], correct: 1, why: '**{妹|いもうと}と{2人|ふたり}で**{住|す}んでいます。' },
        { q: '{妹|いもうと}さんはどんな{人|ひと}ですか。', options: ['{髪|かみ}が{長|なが}くて、{元気|げんき}', '{髪|かみ}が{短|みじか}くて、{頭|あたま}がいい', '{背|せ}が{高|たか}くて、おもしろい', 'かっこよくて、{親切|しんせつ}'], correct: 1, why: '{髪|かみ}が**{短|みじか}くて**、かわいい; **{頭|あたま}がよくて**、まじめ.' },
        { q: '{妹|いもうと}さんは{何|なに}をしていますか。', options: ['{会社|かいしゃ}で{働|はたら}いています', '{大学|だいがく}で{経済|けいざい}を{勉強|べんきょう}しています', '{高校|こうこう}で{英語|えいご}を{教|おし}えています', '{高校生|こうこうせい}です'], correct: 1, why: '**{大学|だいがく}で{経済|けいざい}を{勉強|べんきょう}しています**。' },
        { q: '{猫|ねこ}は{何匹|なんびき}いますか。', options: ['{1匹|いっぴき}', '{2匹|にひき}', '{3匹|さんびき}', '{4匹|よんひき}'], correct: 2, why: '**{3匹|さんびき}**います — mèo của bố mẹ ở quê.' },
        { q: 'マルコさんは{時計|とけい}を{誰|だれ}にもらいましたか。', options: ['{父|ちち}', '{兄|あに}', '{恋人|こいびと}', '{友達|ともだち}'], correct: 1, why: '{誕生日|たんじょうび}に**{兄|あに}に**もらいました。' },
      ],
    },
  ],
};

/* ═══════════════════════════ 6. NÓI (dạng thi) ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b8-noi',
  kind: 'speaking',
  title: 'Luyện nói — câu hỏi thi về gia đình, người thân, quà tặng',
  goal: 'Trả lời trọn câu, đúng trợ từ các câu hỏi thi liên quan Bài 8 (sống ở đâu, với ai, nhà mấy người, bố mẹ làm gì, người đó thế nào, ai tặng gì), nhìn tranh gia đình / thẻ thông tin mà trả lời, đóng vai giới thiệu ảnh và bàn quà, và đọc to trôi chảy.',
  minutes: 50,
  blocks: [
    {
      t: 'table',
      caption: 'Đề thi nói JPD (theo "Hướng dẫn ôn thi" của bộ môn) — Bài 8 nằm ở đâu',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 8 xuất hiện ở đâu'],
      rows: [
        ['Reading', '40', 'Chuẩn bị 30 giây, đọc to đoạn ~100–110 chữ (4 từ chữ Hán gạch chân, 4 từ katakana, 70–80 chữ hiragana).', 'Đoạn kể về gia đình, bạn bè, quà: {両親|りょうしん} · {医者|いしゃ} · {高校生|こうこうせい} · ～に{住|す}んでいます · ～がくれました.'],
        ['Talking — có tranh', '3 × 15', 'Nhìn tranh (ảnh gia đình, thẻ thông tin người, tranh quà) trả lời 3 câu.', 'この{人|ひと}は{誰|だれ}ですか · {何|なに}をしていますか · どんな{人|ひと}ですか · {誰|だれ}にもらいましたか'],
        ['Talking — không tranh', '1 × 10', 'Trả lời 1 câu về bản thân.', 'いま どこに すんでいますか (có trong ngân hàng câu hỏi) · {家族|かぞく}は{何人|なんにん}ですか · {兄弟|きょうだい}がいますか'],
        ['Presenting', '5', 'Chào khi vào và khi ra.', 'しつれいします／ありがとうございました。'],
      ],
    },
    {
      t: 'note',
      title: 'Luật chấm cần nhớ (trừ điểm thật)',
      items: [
        '**Sai trợ từ: −2 điểm** mỗi lỗi. Bài 8 soát kỹ: (nơi)**に**{住|す}んでいます · (nơi)**で**{働|はたら}いています · N1**は**N2**が**A · ～{人|にん}**で** · (người)**に**あげます／もらいます · (người)**が**くれます.',
        '**Câu có/không quên はい／いいえ**: bị trừ (tối đa 5 điểm). 「{兄弟|きょうだい}がいますか」 → **はい、～がいます／いいえ、いません**.',
        '**Sai nội dung = mất trọn câu**: hỏi {誰|だれ}と mà đáp nơi chốn; hỏi {何人|なんにん} mà đáp tên người; nhầm くれました ↔ あげました làm đảo ngược người cho – người nhận.',
        '**Nhà mình — nhà người khác**: giám thị hỏi お{母|かあ}さんは… → bạn đáp **{母|はは}は…** (đừng lặp lại お{母|かあ}さん). Đây là chỗ giám thị hay để ý.',
        'Được xin nhắc lại câu hỏi **tối đa 2 lần, không bị trừ**: **もう{一度|いちど}お{願|ねが}いします** · **ゆっくりお{願|ねが}いします**.',
      ],
    },

    /* ── Không tranh ① ── */
    { t: 'h', text: 'Câu hỏi không tranh ① — Nơi ở và gia đình' },
    {
      t: 'p',
      text: 'Câu đầu tiên khớp ngân hàng câu hỏi thi (「いま どこに すんでいますか」 trong bộ câu hỏi về bản thân). Các câu còn lại là câu giám thị hay hỏi nối tiếp khi đã sang Bài 8. Câu trả lời là **mẫu** — thay bằng thông tin thật của bạn nhưng **giữ khung câu**.',
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: sống ở đâu, với ai, nhà mấy người',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'いま、どこに{住|す}んでいますか。', ro: 'Ima, doko ni sunde imasu ka.', vi: 'Bây giờ bạn sống ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: 'ハノイに{住|す}んでいます。', ro: 'Hanoi ni sunde imasu.', vi: 'Em sống ở Hà Nội.' },
        { who: 'Giám thị', role: 'examiner', text: '{誰|だれ}と{住|す}んでいますか。', ro: 'Dare to sunde imasu ka.', vi: 'Bạn sống với ai?' },
        { who: 'Bạn', role: 'candidate', text: '{友達|ともだち}と{2人|ふたり}で{住|す}んでいます。', ro: 'Tomodachi to futari de sunde imasu.', vi: 'Em sống hai người với bạn. (hoặc: {家族|かぞく}と{住|す}んでいます。／{1人|ひとり}で{住|す}んでいます。)' },
        { who: 'Giám thị', role: 'examiner', text: 'ご{家族|かぞく}は{何人|なんにん}ですか。', ro: 'Gokazoku wa nannin desu ka.', vi: 'Gia đình bạn có mấy người?' },
        { who: 'Bạn', role: 'candidate', text: '{4人|よにん}です。{父|ちち}と{母|はは}と{弟|おとうと}と{私|わたし}です。', ro: 'Yonin desu. Chichi to haha to otouto to watashi desu.', vi: 'Bốn người ạ. Bố, mẹ, em trai và em.' },
        { who: 'Giám thị', role: 'examiner', text: '{兄弟|きょうだい}がいますか。', ro: 'Kyoudai ga imasu ka.', vi: 'Bạn có anh chị em không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{弟|おとうと}が{1人|ひとり}います。', ro: 'Hai, otouto ga hitori imasu.', vi: 'Có ạ, em có một em trai.' },
        { who: 'Giám thị', role: 'examiner', text: 'ご{両親|りょうしん}はどこに{住|す}んでいますか。', ro: 'Goryoushin wa doko ni sunde imasu ka.', vi: 'Bố mẹ bạn sống ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: '{両親|りょうしん}はナムディンに{住|す}んでいます。', ro: 'Ryoushin wa Namudin ni sunde imasu.', vi: 'Bố mẹ em sống ở Nam Định.' },
        { who: 'Giám thị', role: 'examiner', text: 'お{父|とう}さんは{何|なに}をしていますか。', ro: 'Otousan wa nani o shite imasu ka.', vi: 'Bố bạn làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{父|ちち}は{会社員|かいしゃいん}です。{銀行|ぎんこう}で{働|はたら}いています。', ro: 'Chichi wa kaishain desu. Ginkou de hataraite imasu.', vi: 'Bố em là nhân viên công ty. Làm ở ngân hàng.' },
        { who: 'Giám thị', role: 'examiner', text: 'ペットがいますか。', ro: 'Petto ga imasu ka.', vi: 'Bạn có thú cưng không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{猫|ねこ}が{2匹|にひき}います。／いいえ、いません。', ro: 'Hai, neko ga nihiki imasu. / Iie, imasen.', vi: 'Có ạ, em có hai con mèo. / Không ạ.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở nhóm này',
      items: [
        '「どこに{住|す}んでいますか」 → **(nơi) に{住|す}んでいます**. Quên {住|す}んでいます thì nói **(nơi) です** vẫn được chấp nhận — nhưng đừng nói ~~(nơi) で{住|す}んでいます~~.',
        '「{何人|なんにん}ですか」 hỏi SỐ — đáp **～{人|にん}です** trước, rồi mới kể từng người.',
        'Giám thị nói ご{両親|りょうしん}／お{父|とう}さん (tôn kính) → bạn nói **{両親|りょうしん}／{父|ちち}** (khiêm nhường).',
        '"Bố em làm nông", "mẹ em nội trợ" chưa có từ trong bài — nói **{父|ちち}は{会社員|かいしゃいん}です** hoặc nghề đã học ({先生|せんせい}, {医者|いしゃ}, {会社員|かいしゃいん}, {銀行員|ぎんこういん}) để không bí.',
      ],
    },

    /* ── Không tranh ② ── */
    { t: 'h', text: 'Câu hỏi không tranh ② — Người đó thế nào?' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: どんな人ですか · 上手',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'お{母|かあ}さんはどんな{人|ひと}ですか。', ro: 'Okaasan wa donna hito desu ka.', vi: 'Mẹ bạn là người thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{母|はは}は{優|やさ}しくて、{親切|しんせつ}な{人|ひと}です。{料理|りょうり}が{上手|じょうず}です。', ro: 'Haha wa yasashikute, shinsetsu na hito desu. Ryouri ga jouzu desu.', vi: 'Mẹ em là người hiền và tốt bụng. Nấu ăn giỏi ạ.' },
        { who: 'Giám thị', role: 'examiner', text: '{友達|ともだち}はどんな{人|ひと}ですか。', ro: 'Tomodachi wa donna hito desu ka.', vi: 'Bạn của bạn là người thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{背|せ}が{高|たか}くて、おもしろい{人|ひと}です。サッカーが{上手|じょうず}です。', ro: 'Se ga takakute, omoshiroi hito desu. Sakkaa ga jouzu desu.', vi: 'Là người cao và vui tính. Đá bóng giỏi ạ.' },
        { who: 'Giám thị', role: 'examiner', text: 'あなたは{何|なに}が{上手|じょうず}ですか。', ro: 'Anata wa nani ga jouzu desu ka.', vi: 'Bạn giỏi cái gì?' },
        { who: 'Bạn', role: 'candidate', text: '{料理|りょうり}が{少|すこ}し{上手|じょうず}です。でも、{歌|うた}は{下手|へた}です。', ro: 'Ryouri ga sukoshi jouzu desu. Demo, uta wa heta desu.', vi: 'Em nấu ăn hơi được một chút. Nhưng hát thì dở ạ.' },
        { who: 'Giám thị', role: 'examiner', text: 'お{父|とう}さんは{背|せ}が{高|たか}いですか。', ro: 'Otousan wa se ga takai desu ka.', vi: 'Bố bạn có cao không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{父|ちち}は{背|せ}が{高|たか}くないです。', ro: 'Iie, chichi wa se ga takakunai desu.', vi: 'Không ạ, bố em không cao.' },
        { who: 'Giám thị', role: 'examiner', text: '{日本語|にほんご}の{先生|せんせい}はどんな{人|ひと}ですか。', ro: 'Nihongo no sensei wa donna hito desu ka.', vi: 'Cô giáo tiếng Nhật của bạn là người thế nào?' },
        { who: 'Bạn', role: 'candidate', text: 'きれいで、{優|やさ}しい{人|ひと}です。', ro: 'Kirei de, yasashii hito desu.', vi: 'Là người xinh đẹp và hiền ạ.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở câu どんな人',
      items: [
        'Đáp khung **A1 て、A2 {人|ひと}です**. Chỉ một tính từ cũng được: {優|やさ}しい{人|ひと}です — nhưng hai tính từ nối đúng ～くて／～で là chỗ ghi điểm ngữ pháp Bài 8.',
        'ナA trước {人|ひと} cần **な**: {親切|しんせつ}**な**{人|ひと}, きれい**な**{人|ひと}. イA thì không: {優|やさ}しい{人|ひと}.',
        'Câu có/không 「～は{背|せ}が{高|たか}いですか」 → phủ định phải chia: **{高|たか}くないです** (không phải ~~{高|たか}いじゃありません~~).',
        'Khen người trước mặt (giám thị) dùng きれい／{優|やさ}しい là an toàn; tránh nhận xét ngoại hình tiêu cực.',
      ],
    },

    /* ── Không tranh ③ ── */
    { t: 'h', text: 'Câu hỏi không tranh ③ — Quà tặng' },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: あげます・もらいます・くれます',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: '{誕生日|たんじょうび}に{何|なに}をもらいましたか。', ro: 'Tanjoubi ni nani o moraimashita ka.', vi: 'Sinh nhật bạn nhận được gì?' },
        { who: 'Bạn', role: 'candidate', text: '{母|はは}に{時計|とけい}をもらいました。', ro: 'Haha ni tokei o moraimashita.', vi: 'Em nhận đồng hồ của mẹ.' },
        { who: 'Giám thị', role: 'examiner', text: 'その{時計|とけい}は{誰|だれ}がくれましたか。', ro: 'Sono tokei wa dare ga kuremashita ka.', vi: 'Cái đồng hồ đó ai tặng bạn?' },
        { who: 'Bạn', role: 'candidate', text: '{母|はは}がくれました。', ro: 'Haha ga kuremashita.', vi: 'Mẹ em tặng ạ.' },
        { who: 'Giám thị', role: 'examiner', text: '{友達|ともだち}の{誕生日|たんじょうび}に{何|なに}をあげますか。', ro: 'Tomodachi no tanjoubi ni nani o agemasu ka.', vi: 'Sinh nhật bạn bè, bạn tặng gì?' },
        { who: 'Bạn', role: 'candidate', text: 'カードとケーキをあげます。', ro: 'Kaado to keeki o agemasu.', vi: 'Em tặng thiệp và bánh kem.' },
        { who: 'Giám thị', role: 'examiner', text: 'いちばんうれしかったプレゼントは{何|なん}ですか。', ro: 'Ichiban ureshikatta purezento wa nan desu ka.', vi: 'Món quà bạn vui nhất là gì?' },
        { who: 'Bạn', role: 'candidate', text: 'パソコンです。{去年|きょねん}、{両親|りょうしん}がくれました。', ro: 'Pasokon desu. Kyonen, ryoushin ga kuremashita.', vi: 'Là máy tính ạ. Năm ngoái bố mẹ tặng em.' },
        { who: 'Giám thị', role: 'examiner', text: 'クリスマスにプレゼントをあげますか。', ro: 'Kurisumasu ni purezento o agemasu ka.', vi: 'Giáng sinh bạn có tặng quà không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、あげます。{妹|いもうと}にチョコレートをあげます。', ro: 'Hai, agemasu. Imouto ni chokoreeto o agemasu.', vi: 'Có ạ. Em tặng em gái sô-cô-la.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở câu quà tặng',
      items: [
        'Hỏi bằng động từ nào, đáp bằng động từ đó: {何|なに}を**もらいましたか** → ～に～を**もらいました**; {誰|だれ}が**くれましたか** → ～が**くれました**.',
        'Người khác tặng MÌNH: tuyệt đối không nói ~~{母|はは}は{私|わたし}に{時計|とけい}をあげました~~ → **{母|はは}がくれました**.',
        'Câu 「いちばんうれしかったプレゼント」 trả lời NGẮN: **N です。(người) がくれました。** Đừng cố kể dài bằng mẫu chưa học ({大学生|だいがくせい}になりました… là mẫu Bài 10) — hai câu ngắn là đủ điểm.',
      ],
    },

    /* ── Có tranh ── */
    { t: 'h', text: 'Câu hỏi có tranh — ảnh gia đình, thẻ thông tin, tranh quà' },
    {
      t: 'p',
      text: 'Tranh thi được viết lại thành bảng (không dùng ảnh). Với tranh Bài 8, giám thị hay hỏi: **この{人|ひと}は{誰|だれ}ですか · {何|なに}をしていますか · どこに{住|す}んでいますか · どんな{人|ひと}ですか · {何人|なんにん}いますか · {誰|だれ}にもらいましたか**.',
    },
    {
      t: 'table',
      caption: 'Tranh 1 — ảnh gia đình ミン (người cầm ảnh là ミン)',
      head: ['Người', 'Nghề / nơi làm', 'Ngoại hình, tính cách'],
      rows: [
        ['{父|ちち}', '{医者|いしゃ} · {病院|びょういん}', '{背|せ}が{高|たか}い · まじめ'],
        ['{母|はは}', '{高校|こうこう}の{先生|せんせい} · {英語|えいご}', '{髪|かみ}が{短|みじか}い · {優|やさ}しい'],
        ['{姉|あね}', '{会社員|かいしゃいん} · デパート', '{髪|かみ}が{長|なが}い · きれい'],
        ['{弟|おとうと}', '{高校生|こうこうせい}', 'サッカーが{上手|じょうず}'],
        ['{猫|ねこ}', '—', '{白|しろ}い · {2匹|にひき}'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 1',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'ミンさんの{家族|かぞく}は{何人|なんにん}ですか。', ro: 'Min-san no kazoku wa nannin desu ka.', vi: 'Gia đình Minh có mấy người?' },
        { who: 'Bạn', role: 'candidate', text: '{5人|ごにん}です。', ro: 'Gonin desu.', vi: 'Năm người ạ. (bố, mẹ, chị, em trai + Minh)' },
        { who: 'Giám thị', role: 'examiner', text: 'ミンさんのお{父|とう}さんは{何|なに}をしていますか。', ro: 'Min-san no otousan wa nani o shite imasu ka.', vi: 'Bố của Minh làm gì?' },
        { who: 'Bạn', role: 'candidate', text: 'お{父|とう}さんは{医者|いしゃ}です。{病院|びょういん}で{働|はたら}いています。', ro: 'Otousan wa isha desu. Byouin de hataraite imasu.', vi: 'Bố Minh là bác sĩ. Làm ở bệnh viện.' },
        { who: 'Giám thị', role: 'examiner', text: 'お{母|かあ}さんはどんな{人|ひと}ですか。', ro: 'Okaasan wa donna hito desu ka.', vi: 'Mẹ Minh là người thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{髪|かみ}が{短|みじか}くて、{優|やさ}しい{人|ひと}です。{高校|こうこう}で{英語|えいご}を{教|おし}えています。', ro: 'Kami ga mijikakute, yasashii hito desu. Koukou de eigo o oshiete imasu.', vi: 'Là người tóc ngắn, hiền. Dạy tiếng Anh ở trường cấp 3.' },
        { who: 'Giám thị', role: 'examiner', text: '{猫|ねこ}が{何匹|なんびき}いますか。', ro: 'Neko ga nanbiki imasu ka.', vi: 'Có mấy con mèo?' },
        { who: 'Bạn', role: 'candidate', text: '{2匹|にひき}います。', ro: 'Nihiki imasu.', vi: 'Có hai con ạ.' },
      ],
    },
    {
      t: 'note',
      title: 'Tranh 1 — chú ý',
      items: [
        'Đây là gia đình NGƯỜI KHÁC (Minh) → bạn nói **お{父|とう}さん・お{母|かあ}さん・お{姉|ねえ}さん** như giám thị, KHÔNG đổi sang {父|ちち}／{母|はは} (vì không phải bố mẹ bạn).',
        'Đếm cả nhà thì cộng cả người cầm ảnh: 4 người thân + Minh = **{5人|ごにん}**.',
      ],
    },
    {
      t: 'table',
      caption: 'Tranh 2 — thẻ thông tin hai người bạn',
      head: ['', 'キムさん', '{川野|かわの}さん'],
      rows: [
        ['Nghề', '{学生|がくせい} (ふじみ{大学|だいがく})', '{会社員|かいしゃいん}'],
        ['Sống ở', '{上野|うえの}', '{横浜|よこはま}'],
        ['Người thế nào', 'まじめ · {頭|あたま}がいい', 'おもしろい · {親切|しんせつ}'],
        ['Giỏi', '{英語|えいご}', 'ピアノ'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 2',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'キムさんはどこに{住|す}んでいますか。', ro: 'Kimu-san wa doko ni sunde imasu ka.', vi: 'Kim sống ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: 'キムさんは{上野|うえの}に{住|す}んでいます。', ro: 'Kimu-san wa Ueno ni sunde imasu.', vi: 'Kim sống ở Ueno.' },
        { who: 'Giám thị', role: 'examiner', text: 'キムさんはどんな{人|ひと}ですか。', ro: 'Kimu-san wa donna hito desu ka.', vi: 'Kim là người thế nào?' },
        { who: 'Bạn', role: 'candidate', text: 'まじめで、{頭|あたま}がいい{人|ひと}です。', ro: 'Majime de, atama ga ii hito desu.', vi: 'Là người chăm chỉ và thông minh.' },
        { who: 'Giám thị', role: 'examiner', text: '{川野|かわの}さんは{何|なに}をしていますか。', ro: 'Kawano-san wa nani o shite imasu ka.', vi: 'Kawano làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{会社員|かいしゃいん}です。', ro: 'Kaishain desu.', vi: 'Là nhân viên công ty.' },
        { who: 'Giám thị', role: 'examiner', text: '{川野|かわの}さんは{何|なに}が{上手|じょうず}ですか。', ro: 'Kawano-san wa nani ga jouzu desu ka.', vi: 'Kawano giỏi cái gì?' },
        { who: 'Bạn', role: 'candidate', text: '{川野|かわの}さんはピアノが{上手|じょうず}です。', ro: 'Kawano-san wa piano ga jouzu desu.', vi: 'Kawano chơi piano giỏi.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh 3 — ba món quà của メアリー',
      head: ['Quà', 'Ai tặng', 'Dịp'],
      rows: [
        ['ネックレス', '{恋人|こいびと}', 'バレンタインデー'],
        ['{傘|かさ}', 'パクさん', '{誕生日|たんじょうび}'],
        ['{辞書|じしょ}', '{先輩|せんぱい}', '{入学|にゅうがく} (vào trường)'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh 3',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'メアリーさんはバレンタインデーに{何|なに}をもらいましたか。', ro: 'Mearii-san wa barentaindee ni nani o moraimashita ka.', vi: 'Ngày Valentine Mary nhận được gì?' },
        { who: 'Bạn', role: 'candidate', text: 'ネックレスをもらいました。', ro: 'Nekkuresu o moraimashita.', vi: 'Nhận được sợi dây chuyền.' },
        { who: 'Giám thị', role: 'examiner', text: '{誰|だれ}にもらいましたか。', ro: 'Dare ni moraimashita ka.', vi: 'Nhận của ai?' },
        { who: 'Bạn', role: 'candidate', text: '{恋人|こいびと}にもらいました。', ro: 'Koibito ni moraimashita.', vi: 'Nhận của người yêu.' },
        { who: 'Giám thị', role: 'examiner', text: 'パクさんはメアリーさんに{何|なに}をあげましたか。', ro: 'Paku-san wa Mearii-san ni nani o agemashita ka.', vi: 'Park tặng Mary cái gì?' },
        { who: 'Bạn', role: 'candidate', text: '{傘|かさ}をあげました。', ro: 'Kasa o agemashita.', vi: 'Tặng cái ô.' },
        { who: 'Giám thị', role: 'examiner', text: 'この{辞書|じしょ}は{誰|だれ}がメアリーさんにあげましたか。', ro: 'Kono jisho wa dare ga Mearii-san ni agemashita ka.', vi: 'Quyển từ điển này ai tặng Mary?' },
        { who: 'Bạn', role: 'candidate', text: '{先輩|せんぱい}があげました。', ro: 'Senpai ga agemashita.', vi: 'Đàn anh tặng.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy ở câu có tranh',
      items: [
        'Giám thị cầm tranh nói **この{人|ひと}** → bạn chỉ vào tranh cũng nói **この{人|ひと}** được (cùng nhìn một tranh), hoặc gọi tên luôn cho chắc.',
        'Tranh là người khác cho người khác (Park → Mary) → **あげました** / **もらいました**, KHÔNG dùng くれました (くれます chỉ khi người nhận là bạn).',
        'Đọc số: {2匹|にひき}, {5人|ごにん}, {4人|よにん}. Nghe {何匹|なんびき} → đáp bằng ～{匹|ひき}; nghe {何人|なんにん} → đáp ～{人|にん}.',
      ],
    },

    /* ── Đóng vai ── */
    { t: 'h', text: 'Đóng vai — giới thiệu ảnh bạn, bàn quà sinh nhật (luyện hai người)' },
    {
      t: 'dialogue',
      title: 'Vai 1 — A cho B xem ảnh bạn mình, B hỏi thật nhiều (ペアで話しましょう)',
      lines: [
        { who: 'A', role: 'a', text: 'これは{私|わたし}の{友達|ともだち}の{写真|しゃしん}です。この{人|ひと}は{川野|かわの}さんです。', ro: 'Kore wa watashi no tomodachi no shashin desu. Kono hito wa Kawano-san desu.', vi: 'Đây là ảnh bạn mình. Người này là Kawano.' },
        { who: 'B', role: 'b', text: 'へえ。{川野|かわの}さんは{学生|がくせい}ですか。', ro: 'Hee. Kawano-san wa gakusei desu ka.', vi: 'Ồ. Kawano là sinh viên à?' },
        { who: 'A', role: 'a', text: 'いいえ、{会社員|かいしゃいん}です。{横浜|よこはま}の{会社|かいしゃ}で{働|はたら}いています。', ro: 'Iie, kaishain desu. Yokohama no kaisha de hataraite imasu.', vi: 'Không, là nhân viên công ty. Làm ở một công ty ở Yokohama.' },
        { who: 'B', role: 'b', text: 'どこに{住|す}んでいますか。', ro: 'Doko ni sunde imasu ka.', vi: 'Sống ở đâu?' },
        { who: 'A', role: 'a', text: '{横浜|よこはま}に{住|す}んでいます。', ro: 'Yokohama ni sunde imasu.', vi: 'Sống ở Yokohama.' },
        { who: 'B', role: 'b', text: '{川野|かわの}さんはどんな{人|ひと}ですか。', ro: 'Kawano-san wa donna hito desu ka.', vi: 'Kawano là người thế nào?' },
        { who: 'A', role: 'a', text: 'おもしろくて、{親切|しんせつ}な{人|ひと}です。ピアノがとても{上手|じょうず}ですよ。', ro: 'Omoshirokute, shinsetsu na hito desu. Piano ga totemo jouzu desu yo.', vi: 'Là người vui tính và tốt bụng. Chơi piano rất giỏi đấy.' },
        { who: 'B', role: 'b', text: 'そうですか。{兄弟|きょうだい}がいますか。', ro: 'Sou desu ka. Kyoudai ga imasu ka.', vi: 'Vậy à. Có anh chị em không?' },
        { who: 'A', role: 'a', text: 'はい、お{姉|ねえ}さんが{1人|ひとり}います。', ro: 'Hai, oneesan ga hitori imasu.', vi: 'Có, có một chị gái.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Vai 2 — A và B bàn quà sinh nhật cho C (ロールプレイ)',
      lines: [
        { who: 'A', role: 'a', text: '{来週|らいしゅう}、Cさんの{誕生日|たんじょうび}ですね。{2人|ふたり}で{一緒|いっしょ}に{何|なに}かあげませんか。', ro: 'Raishuu, C-san no tanjoubi desu ne. Futari de issho ni nanika agemasen ka.', vi: 'Tuần sau sinh nhật C nhỉ. Hai đứa mình cùng tặng cái gì đó không?' },
        { who: 'B', role: 'b', text: 'いいですね。Cさんは{何|なに}が{好|す}きですか。', ro: 'Ii desu ne. C-san wa nani ga suki desu ka.', vi: 'Hay đấy. C thích gì nhỉ?' },
        { who: 'A', role: 'a', text: '{音楽|おんがく}が{好|す}きですよ。CDはどうですか。', ro: 'Ongaku ga suki desu yo. Shiidii wa dou desu ka.', vi: 'Thích âm nhạc đấy. Đĩa CD thì sao?' },
        { who: 'B', role: 'b', text: 'CDはたくさんありますよ。Cさんは{傘|かさ}がありません。{新|あたら}しい{傘|かさ}はどうですか。', ro: 'Shiidii wa takusan arimasu yo. C-san wa kasa ga arimasen. Atarashii kasa wa dou desu ka.', vi: 'CD thì bạn ấy có nhiều rồi. C không có ô. Một cái ô mới thì sao?' },
        { who: 'A', role: 'a', text: 'いいですね。そうしましょう。どこで{買|か}いますか。', ro: 'Ii desu ne. Sou shimashou. Doko de kaimasu ka.', vi: 'Hay đấy. Làm vậy đi. Mua ở đâu?' },
        { who: 'B', role: 'b', text: 'みどりデパートはどうですか。{駅|えき}から{近|ちか}いですよ。', ro: 'Midori depaato wa dou desu ka. Eki kara chikai desu yo.', vi: 'Trung tâm Midori thì sao? Gần ga lắm.' },
        { who: 'A', role: 'a', text: 'じゃ、{明日|あした}、{一緒|いっしょ}に{買|か}いに{行|い}きましょう。', ro: 'Ja, ashita, issho ni kai ni ikimashou.', vi: 'Vậy mai cùng đi mua nhé.' },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo luyện đóng vai',
      items: [
        'Vai 1: người hỏi (B) phải dùng từ tôn kính cho người trong ảnh: お{姉|ねえ}さん, ご{家族|かぞく}. Người kể (A) nói về bạn mình nên dùng お{姉|ねえ}さん (chị của BẠN mình — không phải chị mình).',
        'Vai 2 ôn lại cả Bài 5–6: **～はどうですか** (đề xuất), **～ませんか / ～ましょう** (rủ – chốt). Thêm lý do **～から** khi gạt một ý kiến.',
        'Đổi vai: lần sau A kể về một người trong gia đình mình (dùng {父|ちち}・{母|はは}…), B hỏi bằng お{父|とう}さん・お{母|かあ}さん….',
      ],
    },

    /* ── Reading ── */
    { t: 'h', text: 'Đọc to — Reading (40 điểm)' },
    {
      t: 'p',
      text: 'Đề đọc dài khoảng 100–110 ký tự: **4 từ chữ Hán** gạch chân (12đ), **4 từ katakana** (12đ), còn lại hiragana (16đ, sai một ký tự −0,2đ). 30 giây chuẩn bị. Bốn đoạn dưới đây viết đúng khuôn đó, chỉ dùng từ Bài 1–8. Tắt furigana khi đã quen (hoặc luyện ở mục **Chữ Hán · Đọc to đoạn văn dạng đề thi**).',
    },
    {
      t: 'examples',
      items: [
        {
          en: 'わたしのかぞくはよにんです。{父|ちち}は{医者|いしゃ}です。びょういんではたらいています。{母|はは}はこうこうでエイゴをおしえています。いもうとは{高校生|こうこうせい}で、ピアノがじょうずです。うちにはネコがいっぴきいます。まいばん、みんなでテレビをみます。',
          ro: 'Watashi no kazoku wa yonin desu. Chichi wa isha desu. Byouin de hataraite imasu. Haha wa koukou de eigo o oshiete imasu. Imouto wa koukousei de, piano ga jouzu desu. Uchi ni wa neko ga ippiki imasu. Maiban, minna de terebi o mimasu.',
          vi: 'Nhà tôi có bốn người. Bố tôi là bác sĩ, làm ở bệnh viện. Mẹ tôi dạy tiếng Anh ở trường cấp 3. Em gái tôi là học sinh cấp 3, chơi piano giỏi. Nhà có một con mèo. Tối nào cả nhà cũng cùng xem tivi.',
        },
        {
          en: 'わたしはトウキョウにすんでいます。ルームメイトとさんにんですんでいます。マリヤムさんはせがたかくて、{髪|かみ}がながいです。とても{親切|しんせつ}です。アンナさんはテニスがじょうずです。{週末|しゅうまつ}、いっしょにカラオケにいきます。',
          ro: 'Watashi wa Toukyou ni sunde imasu. Ruumumeito to sannin de sunde imasu. Mariyamu-san wa se ga takakute, kami ga nagai desu. Totemo shinsetsu desu. Anna-san wa tenisu ga jouzu desu. Shuumatsu, issho ni karaoke ni ikimasu.',
          vi: 'Tôi sống ở Tokyo, cùng các bạn cùng phòng, ba người. Mariyam cao, tóc dài. Rất tốt bụng. Anna chơi tennis giỏi. Cuối tuần chúng tôi cùng đi karaoke.',
        },
        {
          en: 'せんしゅう、わたしのたんじょうびでした。ともだちがケーキをつくりました。パクさんはわたしにネックレスをくれました。{先輩|せんぱい}に{辞書|じしょ}をもらいました。くにの{祖母|そぼ}もカードをおくりました。とてもうれしかったです。',
          ro: 'Senshuu, watashi no tanjoubi deshita. Tomodachi ga keeki o tsukurimashita. Paku-san wa watashi ni nekkuresu o kuremashita. Senpai ni jisho o moraimashita. Kuni no sobo mo kaado o okurimashita. Totemo ureshikatta desu.',
          vi: 'Tuần trước là sinh nhật tôi. Bạn tôi làm bánh kem. Park tặng tôi sợi dây chuyền. Tôi nhận từ điển của đàn anh. Bà ở quê cũng gửi thiệp. Tôi rất vui.',
        },
        {
          en: 'この{人|ひと}はわたしのあにです。おおさかにすんでいます。デパートではたらいています。あには{背|せ}がたかくて、かっこいいです。サッカーもじょうずです。らいげつ、あにの{結婚式|けっこんしき}があります。わたしはあにとつまにプレゼントをあげたいです。',
          ro: 'Kono hito wa watashi no ani desu. Oosaka ni sunde imasu. Depaato de hataraite imasu. Ani wa se ga takakute, kakkoii desu. Sakkaa mo jouzu desu. Raigetsu, ani no kekkonshiki ga arimasu. Watashi wa ani to tsuma ni purezento o agetai desu.',
          vi: 'Người này là anh trai tôi. Anh sống ở Osaka, làm ở trung tâm thương mại. Anh tôi cao và đẹp trai. Đá bóng cũng giỏi. Tháng sau có đám cưới anh tôi. Tôi muốn tặng quà cho anh và vợ anh ấy.',
        },
      ],
    },
    {
      t: 'note',
      title: 'Chỗ dễ đọc sai trong bốn đoạn trên',
      items: [
        '**{父|ちち} ちち**, **{母|はは} はは**, **{医者|いしゃ} いしゃ**, **{高校生|こうこうせい} こうこうせい**, **{先輩|せんぱい} せんぱい**, **{辞書|じしょ} じしょ**, **{祖母|そぼ} そぼ**, **{結婚式|けっこんしき} けっこんしき**, **{髪|かみ} かみ**, **{背|せ} せ** — từ chữ Hán dạng đề thi.',
        'Số người: よにん, さんにん — không đọc ~~よんにん~~. Con vật: いっぴき.',
        'Katakana kéo dài / âm ngắt: ネックレス nekkuresu, ケーキ keeki, ルームメイト ruumumeito, カード kaado, サッカー sakkaa, テレビ (ngắn).',
        'は đọc **wa**, を đọc **o**, へ đọc **e**: わたし**は**, うち**に**は (niwa), ネックレス**を**.',
      ],
    },

    /* ── Tự ghi âm ── */
    { t: 'h', text: 'Tự ghi âm — trả lời không nhìn đáp án' },
    {
      t: 'speak',
      id: 'b8-noi-ghi-am',
      part: '1',
      questions: [
        'いま どこに すんでいますか。',
        'だれと すんでいますか。',
        'ごかぞくは なんにんですか。',
        'きょうだいが いますか。',
        'おとうさんは なにを していますか。',
        'おかあさんは どんな ひとですか。',
        'ペットが いますか。',
        'あなたの ともだちは どんな ひとですか。',
        'あなたは なにが じょうずですか。',
        'たんじょうびに なにを もらいましたか。だれが くれましたか。',
        'ともだちの たんじょうびに なにを あげますか。',
        'いちばん うれしかった プレゼントは なんですか。',
      ],
    },
  ],
};

/* ═══════════════════════════ 7. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b8-bai-tap',
  kind: 'homework',
  title: 'Bài tập về nhà — Bài 8 (có đáp án)',
  goal: 'Tự dịch, đổi dạng câu, chọn trợ từ và động từ cho–nhận, ghép câu Bài 8 không cần nhìn bài học.',
  minutes: 50,
  blocks: [
    {
      t: 'p',
      text: 'Gõ tiếng Nhật bằng bộ gõ (gõ romaji, máy đổi sang kana). Chữ Hán hay kana đều được chấp nhận; dấu câu và dấu cách không tính. Nếu máy chấm sai mà bạn tin mình đúng, bấm **Hỏi gia sư** ngay dưới câu đó.',
    },
    {
      t: 'quiz',
      id: 'b8-bt-dich',
      title: 'Dịch sang tiếng Nhật',
      kind: 'translate',
      grammar: 'Vています (nơi ở, nghề) · N1はN2がAです · イA‑くて／ナA・Nで · N1にN2をあげます／もらいます · N1がN2をくれます · N(人)が～人います · ～人で',
      items: [
        { q: 'Tôi đang sống ở Yokohama.', answers: V('{横浜|よこはま}に{住|す}んでいます。', '{私|わたし}は{横浜|よこはま}に{住|す}んでいます。'), hint: '横浜, 住みます' },
        { q: 'Bạn đang sống ở đâu?', answers: V('どこに{住|す}んでいますか。', 'Bさんはどこに{住|す}んでいますか。'), hint: 'どこ, 住みます' },
        { q: 'Tôi sống hai người với anh trai.', answers: V('{兄|あに}と{2人|ふたり}で{住|す}んでいます。', '{兄|あに}と{二人|ふたり}で{住|す}んでいます。', '{私|わたし}は{兄|あに}と{2人|ふたり}で{住|す}んでいます。'), hint: '兄, 2人, で' },
        { q: 'Bạn sống một mình à?', answers: V('{1人|ひとり}で{住|す}んでいますか。', '{一人|ひとり}で{住|す}んでいますか。'), hint: '1人で' },
        { q: 'Bạn có anh chị em không?', answers: V('{兄弟|きょうだい}がいますか。'), hint: '兄弟, います' },
        { q: 'Có, tôi có một chị gái.', answers: V('はい、{姉|あね}が{1人|ひとり}います。', 'はい、{姉|あね}が{一人|ひとり}います。'), hint: '姉, 1人' },
        { q: 'Tôi có hai con mèo.', answers: V('{猫|ねこ}が{2匹|にひき}います。', '{猫|ねこ}が{二匹|にひき}います。', '{私|わたし}は{猫|ねこ}が{2匹|にひき}います。'), hint: '猫, ～匹' },
        { q: 'Nhà bạn có mấy người? — Năm người.', answers: V('{家族|かぞく}は{何人|なんにん}ですか。{5人|ごにん}です。', 'ご{家族|かぞく}は{何人|なんにん}ですか。{5人|ごにん}です。', '{家族|かぞく}は{何人|なんにん}ですか。{五人|ごにん}です。'), hint: '家族, 何人' },
        { q: 'Bố bạn làm nghề gì?', answers: V('お{父|とう}さんは{何|なに}をしていますか。', 'お{父|とう}さんの{仕事|しごと}は{何|なん}ですか。'), hint: 'お父さん, していますか' },
        { q: 'Bố tôi là bác sĩ. Làm việc ở bệnh viện.', answers: V('{父|ちち}は{医者|いしゃ}です。{病院|びょういん}で{働|はたら}いています。'), hint: '父, 医者, 病院, 働きます' },
        { q: 'Mẹ tôi dạy tiếng Anh ở trường cấp 3.', answers: V('{母|はは}は{高校|こうこう}で{英語|えいご}を{教|おし}えています。'), hint: '母, 高校, 英語, 教えます' },
        { q: 'Em trai tôi đang học kinh tế ở đại học.', answers: V('{弟|おとうと}は{大学|だいがく}で{経済|けいざい}を{勉強|べんきょう}しています。'), hint: '弟, 大学, 経済' },
        { q: 'Chị tôi đã lập gia đình.', answers: V('{姉|あね}は{結婚|けっこん}しています。'), hint: '姉, 結婚します' },
        { q: 'Daniel cao.', answers: V('ダニエルさんは{背|せ}が{高|たか}いです。'), hint: '背, 高い' },
        { q: 'Anna chơi tennis giỏi.', answers: V('アンナさんはテニスが{上手|じょうず}です。'), hint: 'テニス, 上手' },
        { q: 'Mary mắt to và tóc dài.', answers: V('メアリーさんは{目|め}が{大|おお}きくて、{髪|かみ}が{長|なが}いです。'), hint: '目, 大きい, 髪, 長い' },
        { q: 'Là người vui tính và tốt bụng.', answers: V('おもしろくて、{親切|しんせつ}な{人|ひと}です。'), hint: 'おもしろい, 親切' },
        { q: 'Kim chăm chỉ và thông minh.', answers: V('キムさんはまじめで、{頭|あたま}がいいです。'), hint: 'まじめ, 頭がいい' },
        { q: 'Tôi đã tặng hoa cho Park.', answers: V('パクさんに{花|はな}をあげました。', '{私|わたし}はパクさんに{花|はな}をあげました。'), hint: '花, あげます' },
        { q: 'Tôi đã nhận máy ảnh của chị gái.', answers: V('{姉|あね}にカメラをもらいました。', '{私|わたし}は{姉|あね}にカメラをもらいました。', '{姉|あね}からカメラをもらいました。'), hint: '姉, カメラ, もらいます' },
        { q: 'Bạn tôi tặng tôi đĩa CD.', answers: V('{友達|ともだち}がCDをくれました。', '{友達|ともだち}が{私|わたし}にCDをくれました。'), hint: '友達, くれます' },
        { q: 'Sắp đến sinh nhật Park rồi nhỉ.', answers: V('もうすぐパクさんの{誕生日|たんじょうび}ですね。'), hint: 'もうすぐ, 誕生日' },
        { q: 'Mình tặng Mariyam cái gì đó không?', answers: V('マリヤムさんに{何|なに}かあげませんか。', 'マリヤムさんに{何|なに}かプレゼントをあげませんか。'), hint: '何か, あげませんか' },
        { q: 'Vậy à. Tốt quá nhỉ.', answers: V('そうですか。よかったですね。'), hint: 'よかったですね' },
      ],
    },
    {
      t: 'quiz',
      id: 'b8-bt-doi-dang',
      title: 'Đổi dạng — viết lại theo yêu cầu (gõ chữ Hán hoặc kana)',
      kind: 'fill',
      grammar: 'イA い → くて (いい → よくて) · ナA・N → で · V ます → V ています',
      items: [
        { q: '{大|おお}きい → thể て (nối câu)', answers: V('{大|おお}きくて') },
        { q: '{長|なが}い → thể て', answers: V('{長|なが}くて') },
        { q: '{優|やさ}しい → thể て', answers: V('{優|やさ}しくて') },
        { q: 'いい → thể て', answers: ['よくて'] },
        { q: 'かっこいい → thể て', answers: ['かっこよくて'] },
        { q: '{親切|しんせつ}（な） → thể て', answers: V('{親切|しんせつ}で') },
        { q: '{元気|げんき}（な） → thể て', answers: V('{元気|げんき}で') },
        { q: 'きれい（な） → thể て', answers: ['きれいで'] },
        { q: '{学生|がくせい}です → thể て', answers: V('{学生|がくせい}で') },
        { q: '{住|す}みます → ～ています', answers: V('{住|す}んでいます') },
        { q: '{働|はたら}きます → ～ています', answers: V('{働|はたら}いています') },
        { q: '{教|おし}えます → ～ています', answers: V('{教|おし}えています') },
        { q: '{結婚|けっこん}します → ～ています', answers: V('{結婚|けっこん}しています') },
        { q: 'Nối thành một câu: {背|せ}が{高|たか}いです。＋ {髪|かみ}が{短|みじか}いです。', answers: V('{背|せ}が{高|たか}くて、{髪|かみ}が{短|みじか}いです。') },
        { q: 'Nối: {妹|いもうと}は{15歳|じゅうごさい}です。＋ {高校生|こうこうせい}です。(bỏ chủ ngữ lần 2)', answers: V('{妹|いもうと}は{15歳|じゅうごさい}で、{高校生|こうこうせい}です。') },
        { q: 'Đổi sang もらいます: {姉|あね}が{私|わたし}にカメラをくれました。→ {私|わたし}は…', answers: V('{私|わたし}は{姉|あね}にカメラをもらいました。', '{姉|あね}にカメラをもらいました。', '{私|わたし}は{姉|あね}からカメラをもらいました。') },
        { q: 'Đổi sang くれます: {私|わたし}は{友達|ともだち}にCDをもらいました。→ {友達|ともだち}が…', answers: V('{友達|ともだち}が{私|わたし}にCDをくれました。', '{友達|ともだち}がCDをくれました。') },
        { q: 'Đổi sang もらいます: カルロスさんはパクさんに{花|はな}をあげました。→ パクさんは…', answers: V('パクさんはカルロスさんに{花|はな}をもらいました。', 'パクさんはカルロスさんから{花|はな}をもらいました。') },
      ],
    },
    {
      t: 'mcq',
      id: 'b8-bt-tro-tu',
      title: 'Chọn trợ từ đúng',
      items: [
        { q: '{両親|りょうしん}はハノイ＿{住|す}んでいます。', options: ['で', 'に', 'へ', 'を'], correct: 1, why: 'Nơi ở + **に** (ポイント 72).' },
        { q: '{父|ちち}は{銀行|ぎんこう}＿{働|はたら}いています。', options: ['に', 'で', 'を', 'が'], correct: 1, why: 'Nơi làm việc + **で** (ポイント 73).' },
        { q: '{母|はは}は{高校|こうこう}で{英語|えいご}＿{教|おし}えています。', options: ['が', 'を', 'に', 'で'], correct: 1, why: 'Tân ngữ → **を**.' },
        { q: '{私|わたし}は{弟|おとうと}＿{2人|ふたり}います。', options: ['を', 'が', 'は', 'に'], correct: 1, why: 'N **が** (số) います (ポイント 79).' },
        { q: '{友達|ともだち}と{3人|さんにん}＿{住|す}んでいます。', options: ['に', 'で', 'が', 'と'], correct: 1, why: 'Số người + **で** (ポイント 80).' },
        { q: 'ダニエルさん＿{背|せ}が{高|たか}いです。', options: ['は', 'が', 'を', 'に'], correct: 0, why: 'Người là chủ đề → **は** (ポイント 74).' },
        { q: 'ダニエルさんは{背|せ}＿{高|たか}いです。', options: ['は', 'が', 'を', 'の'], correct: 1, why: 'Đặc điểm → **が** (ポイント 74).' },
        { q: 'マルコさんはサッカー＿{上手|じょうず}です。', options: ['を', 'が', 'で', 'に'], correct: 1, why: 'Kỹ năng + **が** {上手|じょうず}.' },
        { q: 'パクさん＿{花|はな}をあげました。', options: ['が', 'に', 'を', 'で'], correct: 1, why: 'Người nhận + **に** あげます (ポイント 76).' },
        { q: '{姉|あね}＿カメラをもらいました。(nhận của chị)', options: ['が', 'に', 'を', 'は'], correct: 1, why: 'Người cho + **に** もらいます (ポイント 77).' },
        { q: '{友達|ともだち}＿CDをくれました。', options: ['に', 'が', 'を', 'で'], correct: 1, why: 'Người cho + **が** くれます (ポイント 78).' },
        { q: '{誕生日|たんじょうび}＿{父|ちち}に{時計|とけい}をもらいました。', options: ['に', 'で', 'を', 'が'], correct: 0, why: 'Dịp / thời điểm + **に**.' },
        { q: '{母|はは}＿{電話|でんわ}します。', options: ['を', 'に', 'で', 'が'], correct: 1, why: 'Gọi điện CHO ai → **に** {電話|でんわ}します.' },
        { q: '{国|くに}の{両親|りょうしん}に{写真|しゃしん}＿{送|おく}ります。', options: ['に', 'が', 'を', 'で'], correct: 2, why: 'Vật được gửi → **を**.' },
        { q: '{誰|だれ}＿{住|す}んでいますか。(sống với ai)', options: ['に', 'と', 'で', 'が'], correct: 1, why: 'Cùng với ai → **と**.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b8-bt-cho-nhan',
      title: 'Chọn động từ: あげました／もらいました／くれました',
      items: [
        { q: '{私|わたし}は{妹|いもうと}にノートを＿。', options: ['あげました', 'もらいました', 'くれました'], correct: 0, why: 'Tôi → em gái: **あげました**.' },
        { q: '{恋人|こいびと}が{私|わたし}にネックレスを＿。', options: ['あげました', 'もらいました', 'くれました'], correct: 2, why: 'Người khác → tôi, người cho làm chủ ngữ: **くれました**.' },
        { q: '{私|わたし}は{先輩|せんぱい}に{辞書|じしょ}を＿。(tôi NHẬN của đàn anh)', options: ['あげました', 'もらいました', 'くれました'], correct: 1, why: 'Chủ ngữ {私|わたし} là người nhận → **もらいました**. (Nếu tôi tặng đàn anh thì あげました — cùng khung câu, chỉ động từ quyết định hướng.)' },
        { q: 'パクさんはワンさんに{傘|かさ}を＿。(Park tặng Wang)', options: ['あげました', 'もらいました', 'くれました'], correct: 0, why: 'Người khác → người khác: **あげました**.' },
        { q: 'ワンさんはパクさんに{傘|かさ}を＿。(Wang nhận của Park)', options: ['あげました', 'もらいました', 'くれました'], correct: 1, why: 'Chủ ngữ là người nhận: **もらいました**.' },
        { q: '{祖母|そぼ}が{弟|おとうと}にお{金|かね}を＿。(em trai TÔI)', options: ['あげました', 'もらいました', 'くれました'], correct: 2, why: 'Người nhận là người nhà tôi → **くれました**.' },
        { q: 'クリスマスに{父|ちち}が{時計|とけい}を＿。', options: ['あげました', 'もらいました', 'くれました'], correct: 2, why: '{父|ちち}**が** … (cho tôi) → **くれました**.' },
        { q: 'バレンタインデーに{私|わたし}は{恋人|こいびと}にチョコレートを＿。', options: ['あげました', 'もらいました', 'くれました'], correct: 0, why: 'Tôi → người yêu: **あげました**.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b8-bt-tu-vung',
      title: 'Từ vựng',
      items: [
        { q: '「{両親|りょうしん}」 là:', options: ['Anh chị em', 'Bố mẹ', 'Ông bà', 'Vợ chồng'], correct: 1, why: 'りょうしん = bố mẹ.' },
        { q: 'Mẹ của BẠN (người đối diện) gọi là:', options: ['{母|はは}', 'お{母|かあ}さん', '{祖母|そぼ}', '{妻|つま}'], correct: 1, why: 'Người khác → **お{母|かあ}さん**; {母|はは} là mẹ mình.' },
        { q: 'Vợ của MÌNH:', options: ['{奥|おく}さん', '{妻|つま}', 'ご{主人|しゅじん}', '{夫|おっと}'], correct: 1, why: '**{妻|つま}**; {奥|おく}さん là vợ người khác.' },
        { q: 'Chồng của người khác:', options: ['{夫|おっと}', 'ご{主人|しゅじん}', '{兄|あに}', '{息子|むすこ}'], correct: 1, why: '**ご{主人|しゅじん}**.' },
        { q: '「{娘|むすめ}」 là:', options: ['Con trai', 'Con gái', 'Em gái', 'Chị gái'], correct: 1, why: 'むすめ = con gái; むすこ = con trai.' },
        { q: '「{先輩|せんぱい}」 là:', options: ['Đàn em', 'Đàn anh / đàn chị', 'Thầy giáo', 'Bạn cùng phòng'], correct: 1, why: 'せんぱい = người đi trước; こうはい = đàn em.' },
        { q: '「{髪|かみ}」 là:', options: ['Mặt', 'Tóc', 'Tai', 'Giấy'], correct: 1, why: 'かみ = tóc (cùng âm với 紙 giấy).' },
        { q: '「{鼻|はな}」 là:', options: ['Hoa', 'Mũi', 'Miệng', 'Mắt'], correct: 1, why: 'はな = mũi (cùng âm với 花 hoa).' },
        { q: '"Thông minh":', options: ['{頭|あたま}がいい', '{背|せ}が{高|たか}い', 'かっこいい', 'まじめ'], correct: 0, why: '**{頭|あたま}がいい**.' },
        { q: '「{下手|へた}」 trái nghĩa:', options: ['{上手|じょうず}', '{元気|げんき}', '{親切|しんせつ}', '{優|やさ}しい'], correct: 0, why: '{下手|へた} (dở) ↔ **{上手|じょうず}** (giỏi).' },
        { q: '「{靴下|くつした}」 là:', options: ['Giày', 'Tất, vớ', 'Ô', 'Dây chuyền'], correct: 1, why: 'くつした = tất.' },
        { q: '「{手紙|てがみ}」 là:', options: ['Giấy', 'Thư tay', 'Thiệp', 'Email'], correct: 1, why: 'てがみ = lá thư; カード = thiệp; メール = email.' },
        { q: '"Sắp, sắp sửa":', options: ['もう', 'まだ', 'もうすぐ', '{何|なに}か'], correct: 2, why: '**もうすぐ**.' },
        { q: 'Đếm con mèo dùng:', options: ['～{人|にん}', '～{枚|まい}', '～{匹|ひき}', '～つ'], correct: 2, why: 'Động vật nhỏ → **～{匹|ひき}**.' },
        { q: 'Bạn kể chuyện vui (được tặng quà), bạn kia đáp:', options: ['{残念|ざんねん}ですね', 'よかったですね', 'いただきます', 'すみません'], correct: 1, why: '**よかったですね** — mừng cho người khác.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b8-bt-hoi-dap',
      title: 'Chọn câu trả lời đúng cho câu hỏi',
      items: [
        { q: 'どこに{住|す}んでいますか。', options: ['{横浜|よこはま}で{住|す}んでいます。', '{横浜|よこはま}に{住|す}んでいます。', '{横浜|よこはま}へ{行|い}きます。', 'はい、{住|す}んでいます。'], correct: 1, why: '(nơi) **に** {住|す}んでいます.' },
        { q: '{誰|だれ}と{住|す}んでいますか。', options: ['{上野|うえの}に{住|す}んでいます。', '{姉|あね}と{2人|ふたり}で{住|す}んでいます。', '{姉|あね}が{2人|ふたり}います。', 'はい、{姉|あね}です。'], correct: 1, why: 'Hỏi với ai → **(người) と ～人で**.' },
        { q: '{兄弟|きょうだい}がいますか。 (bạn không có)', options: ['いいえ、ありません。', 'いいえ、いません。', 'いいえ、{兄弟|きょうだい}じゃありません。', 'いいえ、まだです。'], correct: 1, why: 'Người → **いません**.' },
        { q: 'ご{家族|かぞく}は{何人|なんにん}ですか。', options: ['{4人|よにん}です。', '{4人|よにん}います。', '{父|ちち}と{母|はは}です。', 'はい、{4人|よにん}です。'], correct: 0, why: '{何人|なんにん}**ですか** → ～{人|にん}**です**. (～います dùng cho {兄弟|きょうだい}が{何人|なんにん}いますか.)' },
        { q: 'お{母|かあ}さんは{何|なに}をしていますか。', options: ['お{母|かあ}さんは{先生|せんせい}です。', '{母|はは}は{先生|せんせい}です。', '{母|はは}は{先生|せんせい}をしますか。', '{母|はは}は{料理|りょうり}を{食|た}べています。'], correct: 1, why: 'Mẹ MÌNH → **{母|はは}**.' },
        { q: 'アンナさんはどんな{人|ひと}ですか。', options: ['アンナさんは{学生|がくせい}です。', 'おもしろくて、{親切|しんせつ}な{人|ひと}です。', 'おもしろいと{親切|しんせつ}です。', 'アンナさんは{横浜|よこはま}に{住|す}んでいます。'], correct: 1, why: 'どんな{人|ひと} → tính cách/ngoại hình, nối **くて**.' },
        { q: 'その{時計|とけい}、いいですね。', options: ['はい、いいです。', 'ありがとうございます。{父|ちち}にもらいました。', '{父|ちち}にあげました。', 'いいえ、{時計|とけい}じゃありません。'], correct: 1, why: 'Được khen → cảm ơn + kể ai tặng.' },
        { q: '{誰|だれ}がくれましたか。', options: ['{姉|あね}にくれました。', '{姉|あね}がくれました。', '{姉|あね}にあげました。', '{姉|あね}をくれました。'], correct: 1, why: 'Người cho + **が** くれました.' },
        { q: '{友達|ともだち}がネックレスをくれました。', options: ['{残念|ざんねん}ですね。', 'そうですか。よかったですね。', 'すみません。', 'いいえ、どういたしまして。'], correct: 1, why: 'Mừng cho bạn → **よかったですね**.' },
        { q: 'パクさんに{何|なに}かあげませんか。', options: ['いいですね。{何|なに}をあげますか。', 'はい、もらいます。', 'いいえ、くれません。', 'パクさんがくれました。'], correct: 0, why: 'Nhận lời rủ + hỏi tiếp tặng gì.' },
      ],
    },
    {
      t: 'build',
      id: 'b8-bt-ghep',
      title: 'Ghép câu — giới thiệu một người và một món quà',
      items: [
        { vi: 'Người này là chị gái tôi.', chips: ['この{人|ひと}は', '{私|わたし}の', '{姉|あね}です', 'お{姉|ねえ}さんです', 'が'], answer: ['この{人|ひと}は', '{私|わたし}の', '{姉|あね}です'], ro: 'Kono hito wa watashi no ane desu.' },
        { vi: 'Chị tôi sống ở Hà Nội.', chips: ['{姉|あね}は', 'ハノイに', '{住|す}んでいます', 'ハノイで', '{住|す}みます'], answer: ['{姉|あね}は', 'ハノイに', '{住|す}んでいます'], ro: 'Ane wa Hanoi ni sunde imasu.' },
        { vi: 'Làm việc ở trung tâm thương mại.', chips: ['デパートで', '{働|はたら}いています', 'デパートに', '{働|はたら}きます'], answer: ['デパートで', '{働|はたら}いています'], ro: 'Depaato de hataraite imasu.' },
        { vi: 'Chị tôi cao và tóc dài.', chips: ['{姉|あね}は', '{背|せ}が', '{高|たか}くて、', '{髪|かみ}が', '{長|なが}いです', '{高|たか}いで、'], answer: ['{姉|あね}は', '{背|せ}が', '{高|たか}くて、', '{髪|かみ}が', '{長|なが}いです'], ro: 'Ane wa se ga takakute, kami ga nagai desu.' },
        { vi: 'Là người hiền và tốt bụng.', chips: ['{優|やさ}しくて、', '{親切|しんせつ}な', '{人|ひと}です', '{親切|しんせつ}', '{優|やさ}しいで、'], answer: ['{優|やさ}しくて、', '{親切|しんせつ}な', '{人|ひと}です'], ro: 'Yasashikute, shinsetsu na hito desu.' },
        { vi: 'Nấu ăn cũng giỏi.', chips: ['{料理|りょうり}も', '{上手|じょうず}です', '{料理|りょうり}を', '{下手|へた}です'], answer: ['{料理|りょうり}も', '{上手|じょうず}です'], ro: 'Ryouri mo jouzu desu.' },
        { vi: 'Sinh nhật năm ngoái chị tặng tôi quyển từ điển.', chips: ['{去年|きょねん}の', '{誕生日|たんじょうび}に', '{姉|あね}が', '{辞書|じしょ}を', 'くれました', 'あげました'], answer: ['{去年|きょねん}の', '{誕生日|たんじょうび}に', '{姉|あね}が', '{辞書|じしょ}を', 'くれました'], ro: 'Kyonen no tanjoubi ni ane ga jisho o kuremashita.' },
        { vi: 'Tôi có một em trai và một em gái.', chips: ['{弟|おとうと}が', '{1人|ひとり}と', '{妹|いもうと}が', '{1人|ひとり}', 'います', 'あります'], answer: ['{弟|おとうと}が', '{1人|ひとり}と', '{妹|いもうと}が', '{1人|ひとり}', 'います'], ro: 'Otouto ga hitori to imouto ga hitori imasu.' },
        { vi: 'Tôi gửi thiệp cho bà.', chips: ['{祖母|そぼ}に', 'カードを', '{送|おく}ります', '{祖母|そぼ}が', 'くれます'], answer: ['{祖母|そぼ}に', 'カードを', '{送|おく}ります'], ro: 'Sobo ni kaado o okurimasu.' },
        { vi: 'Hằng tuần tôi gọi điện cho mẹ.', chips: ['{毎週|まいしゅう}、', '{母|はは}に', '{電話|でんわ}します', '{母|はは}を', 'お{母|かあ}さんに'], answer: ['{毎週|まいしゅう}、', '{母|はは}に', '{電話|でんわ}します'], ro: 'Maishuu, haha ni denwa shimasu.' },
      ],
    },
  ],
};

export const BAI_8: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, KANJI, NGHE, NOI, BAI_TAP];

/* ══════════════════════ 📖 THEO SÁCH — BÀI 8 (trang 137–152) ══════════════════════
 * Cùng khuôn với ./sach2.ts: mỗi trang = tiêu đề (số trang + mục) → tả tranh bằng lời
 * của mình + mục tiêu できる → cô hỏi–bạn đáp → mẹo trả lời (chỉ tới ポイント và mục
 * trên web) → câu mẫu cho từng số của 言ってみよう. KHÔNG chép sách; KHÔNG đưa đáp án
 * bài nghe CD (やってみよう) — chỉ nói cần bắt từ nào. Người học mẫu: "ミン" (Minh),
 * sinh viên Việt ở ĐH FPT, quê Hà Nội — khi luyện thì thay bằng thông tin THẬT của bạn.
 */

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
    'Chỗ nào có tên ミン (Minh), ハノイ (Hà Nội), gia đình của ミン… là thông tin mẫu — thay bằng thông tin THẬT của bạn. Bài 8 cô sẽ hỏi rất nhiều về gia đình bạn: chuẩn bị sẵn nhà mấy người, ai làm gì, ai thế nào.',
  ],
};

export const SACH_8: Lesson = {
  id: 'b8-sach',
  kind: 'review',
  title: 'Theo sách — Bài 8 (trang 137–152)',
  goal: 'Nhìn ảnh gia đình, thẻ thông tin bạn bè, tranh quà tặng trong sách là hỏi–đáp được: sống ở đâu, với ai, nhà mấy người, ai làm nghề gì, người đó thế nào, tặng gì, ai tặng.',
  minutes: 60,
  blocks: [
    CACH_DUNG,

    ...trang(
      'Trang 137 · 話してみよう・聞いてみよう — Mở bài 大切な人',
      '**話してみよう** — 4 tranh không lời: (1) một gia đình ba thế hệ quây quần bên bàn, giữa bàn là bánh sinh nhật cắm nến và hộp quà; (2) ba tấm ảnh cũ của hai cậu bé — ngồi chơi ngoài trời, đứng cạnh nhau, rồi ngồi học chung bàn: một tình bạn từ nhỏ; (3) một bó hoa đặt trong hộp quà thắt nơ; (4) cô dâu chú rể bước ra từ nhà thờ, bạn bè hai bên tung hoa chúc mừng. Mục đích: nói về **gia đình, bạn thân, quà tặng, đám cưới** — những "người quan trọng". **聞いてみよう**: nghe trước đoạn hội thoại của bài (hai người bạn trên tàu điện nói chuyện nơi ở, xem ảnh bạn bè, khen đồ của nhau) — chính là trang 152.',
      [
        C('（tranh 1）{何|なん}のパーティーですか。', '(tranh 1) Nan no paatii desu ka.', '(tranh 1) Tiệc gì vậy?'),
        S('{誕生日|たんじょうび}のパーティーです。', 'Tanjoubi no paatii desu.', 'Là tiệc sinh nhật ạ.'),
        C('ミンさんの{家族|かぞく}は{何人|なんにん}ですか。', 'Min-san no kazoku wa nannin desu ka.', 'Gia đình Minh có mấy người?'),
        S('{4人|よにん}です。{父|ちち}と{母|はは}と{妹|いもうと}と{私|わたし}です。', 'Yonin desu. Chichi to haha to imouto to watashi desu.', 'Bốn người ạ. Bố, mẹ, em gái và em.'),
        C('（tranh 4）これは{何|なん}ですか。', '(tranh 4) Kore wa nan desu ka.', '(tranh 4) Đây là gì?'),
        S('{結婚式|けっこんしき}です。', 'Kekkonshiki desu.', 'Là đám cưới ạ.'),
        C('ミンさんの{大切|たいせつ}な{人|ひと}は{誰|だれ}ですか。', 'Min-san no taisetsu na hito wa dare desu ka.', 'Người quan trọng của Minh là ai?'),
        S('{母|はは}です。', 'Haha desu.', 'Là mẹ em ạ.'),
      ],
      [
        'Ngay trang đầu cô hay hỏi **{家族|かぞく}は{何人|なんにん}ですか** — đáp **～{人|にん}です** rồi kể từng người bằng と. Đọc đúng **よにん** (4 người), **ふたり** (2 người).',
        'Nói về nhà mình dùng **{父|ちち}・{母|はは}・{妹|いもうと}**, không dùng お{父|とう}さん.',
        'Xem **Từ vựng · A, B** (bảng gọi người thân) và **Ngữ pháp · ポイント 79**.',
      ],
    ),

    ...trang(
      'Trang 138–139 · チャレンジ! 家族・友達',
      'Trang 138: hai bạn (nữ tóc đuôi ngựa, nam đeo ba lô) đi bộ trò chuyện trên đường từ trường về, sau lưng là dãy cửa hàng. Ô (1): bản đồ các vùng Nhật Bản và ảnh một người — một bạn hỏi "上野?", bạn kia gật "上野" (đoán người đó sống ở đâu); ô (2): một bong bóng hai người đàn ông có dấu "?", bong bóng khác một cặp nam nữ ghi 妻 (đoán quan hệ trong ảnh). Trang 139: trên tàu điện, hai bạn nữ ngồi, một bạn nam đứng cạnh nói chuyện. Ô (3): sơ đồ gia đình 父—母 với hai ô con để "?" (hỏi có anh chị em không), rồi cùng sơ đồ ghi 弟 (có em trai); ô (4): bong bóng một người đàn ông đứng trước toà nhà và đoàn tàu shinkansen (đoán người đó làm việc ở đâu). **Mục tiêu できる:** nói được gia đình, bạn bè có mấy người, sống ở đâu (☞ ポイント 72, 73, 79, 80).',
      [
        C('ミンさんはどこに{住|す}んでいますか。', 'Min-san wa doko ni sunde imasu ka.', 'Minh sống ở đâu?'),
        S('ハノイに{住|す}んでいます。', 'Hanoi ni sunde imasu.', 'Em sống ở Hà Nội.'),
        C('{誰|だれ}と{住|す}んでいますか。', 'Dare to sunde imasu ka.', 'Em sống với ai?'),
        S('{友達|ともだち}と{2人|ふたり}で{住|す}んでいます。', 'Tomodachi to futari de sunde imasu.', 'Em sống hai người với bạn.'),
        C('{兄弟|きょうだい}がいますか。', 'Kyoudai ga imasu ka.', 'Em có anh chị em không?'),
        S('はい、{妹|いもうと}が{1人|ひとり}います。', 'Hai, imouto ga hitori imasu.', 'Có ạ, em có một em gái.'),
        C('（ô 4）この{人|ひと}はどこで{働|はたら}いていますか。', '(ô 4) Kono hito wa doko de hataraite imasu ka.', '(ô 4) Người này làm việc ở đâu?'),
        S('{駅|えき}で{働|はたら}いています。', 'Eki de hataraite imasu.', 'Làm việc ở nhà ga ạ. (đoán theo tranh)'),
      ],
      [
        '**ポイント 72** (nơi)**に**{住|す}んでいます · **ポイント 73** (nơi)**で**{働|はたら}いています — hai trợ từ khác nhau, hay bị lẫn.',
        '**ポイント 79** N**が**～{人|にん}**います** (có mấy anh chị em) · **ポイント 80** ～と～{人|にん}**で** (sống tổng mấy người, tính cả mình).',
        'Xem **Hội thoại · ① 家族・友達** và **Ngữ pháp · ポイント 72, 73, 79, 80**.',
      ],
    ),

    ...trang(
      'Trang 140 · 言ってみよう (chủ đề 1) — Số 1: sống ở đâu · Số 2: sống với ai · Số 3: có … không',
      '**Số 1:** A hỏi B sống ở đâu, B trả lời tên nơi (tranh nhỏ bên trái giống ô "上野?" trang 138). **Số 2:** A hỏi B sống với ai; B trả lời "sống hai người với anh trai"; A: "vậy à". **Số 3:** A hỏi "có … không?", hai nhánh trả lời (có — kèm số lượng / không có): 例 anh chị em, ① thú cưng, ② con (hỏi người khác → お子さん).',
      [
        C('Bさんはどこに{住|す}んでいますか。', 'B-san wa doko ni sunde imasu ka.', 'B sống ở đâu?'),
        S('{私|わたし}はハノイに{住|す}んでいます。', 'Watashi wa Hanoi ni sunde imasu.', 'Em sống ở Hà Nội.'),
        C('{誰|だれ}と{住|す}んでいますか。', 'Dare to sunde imasu ka.', 'Em sống với ai?'),
        S('{家族|かぞく}と{住|す}んでいます。', 'Kazoku to sunde imasu.', 'Em sống với gia đình.'),
        C('ペットがいますか。', 'Petto ga imasu ka.', 'Em có thú cưng không?'),
        S('はい、{猫|ねこ}が{1匹|いっぴき}います。', 'Hai, neko ga ippiki imasu.', 'Có ạ, em có một con mèo.'),
        C('お{子|こ}さんがいますか。', 'Okosan ga imasu ka.', 'Em có con chưa?'),
        S('いいえ、いません。', 'Iie, imasen.', 'Không ạ, em chưa có.'),
      ],
      [
        'Số 3 ② cô hỏi **お{子|こ}さん** (con của em — tôn kính); em trả lời về con MÌNH dùng **{子|こ}ども**／{息子|むすこ}／{娘|むすめ}. Sinh viên chưa có con: **いいえ、いません**.',
        'Người, con vật → **います／いません** (không phải あります). Đếm: {1匹|いっぴき}, {2匹|にひき}, {3匹|さんびき}.',
        'Xem **Ngữ pháp · ポイント 72, 79, 80** và **Luyện nói · Câu hỏi không tranh ①**.',
      ],
      [
        mau([
          E('Bさんはどこに{住|す}んでいますか。— {私|わたし}は{横浜|よこはま}に{住|す}んでいます。', 'B-san wa doko ni sunde imasu ka. — Watashi wa Yokohama ni sunde imasu.', 'Số 1 — nơi ở (thay bằng nơi THẬT của bạn).'),
          E('Bさんは{誰|だれ}と{住|す}んでいますか。— {兄|あに}と{2人|ふたり}で{住|す}んでいます。— そうですか。', 'B-san wa dare to sunde imasu ka. — Ani to futari de sunde imasu. — Sou desu ka.', 'Số 2 — sống với ai.'),
          E('Bさんは{誰|だれ}と{住|す}んでいますか。— {1人|ひとり}で{住|す}んでいます。／{友達|ともだち}と{3人|さんにん}で{住|す}んでいます。', 'B-san wa dare to sunde imasu ka. — Hitori de sunde imasu. / Tomodachi to sannin de sunde imasu.', 'Số 2 — các cách trả lời khác.'),
          E('Bさん、{兄弟|きょうだい}がいますか。— はい、{姉|あね}が{1人|ひとり}います。／いいえ、いません。', 'B-san, kyoudai ga imasu ka. — Hai, ane ga hitori imasu. / Iie, imasen.', 'Số 3 例 — anh chị em.'),
          E('Bさん、ペットがいますか。— はい、{犬|いぬ}が{2匹|にひき}います。／いいえ、いません。', 'B-san, petto ga imasu ka. — Hai, inu ga nihiki imasu. / Iie, imasen.', 'Số 3 ① — thú cưng.'),
          E('Bさん、お{子|こ}さんがいますか。— はい、{息子|むすこ}が{1人|ひとり}います。／いいえ、いません。', 'B-san, okosan ga imasu ka. — Hai, musuko ga hitori imasu. / Iie, imasen.', 'Số 3 ② — con.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 141 · 言ってみよう số 4 · やってみよう (chủ đề 1) — Ai làm nghề gì',
      '**Số 4:** ở giữa là ảnh một gia đình năm người, xung quanh bốn bong bóng nói nghề từng người: 例 chị gái — ngồi với máy tính trước toà nhà "デパート" (nhân viên công ty, làm ở trung tâm thương mại); ① bố — áo blouse trắng, sau lưng là bệnh viện chữ thập đỏ (bác sĩ); ② mẹ — đứng trước bảng chữ tiếng Anh, sau lưng toà nhà "高校" (giáo viên cấp 3 dạy tiếng Anh); ③ em trai — giá vẽ, toà nhà "大学" (sinh viên, học vẽ); ④ em gái — toà nhà "高校" (học sinh cấp 3). Mẫu: A giới thiệu "đây là chị tôi" → B hỏi "chị bạn làm gì?" → A trả lời nghề + nơi làm. **やってみよう:** nghe CD — Natapon sống ở đâu, nơi đó thế nào; nghe hai người (山口さん, メアリーさん) kể về nơi ở / gia đình rồi ghi lại. Dòng ■: kể với bạn cùng lớp anh chị em, gia đình, bạn bè mình sống ở đâu, làm gì.',
      [
        C('ミンさんのお{父|とう}さんは{何|なに}をしていますか。', 'Min-san no otousan wa nani o shite imasu ka.', 'Bố Minh làm gì?'),
        S('{父|ちち}は{会社員|かいしゃいん}です。ハノイの{会社|かいしゃ}で{働|はたら}いています。', 'Chichi wa kaishain desu. Hanoi no kaisha de hataraite imasu.', 'Bố em là nhân viên công ty. Làm ở một công ty ở Hà Nội.'),
        C('お{母|かあ}さんは？', 'Okaasan wa?', 'Còn mẹ em?'),
        S('{母|はは}は{先生|せんせい}です。{小学校|しょうがっこう}で{教|おし}えています。', 'Haha wa sensei desu. Shougakkou de oshiete imasu.', 'Mẹ em là giáo viên. Dạy ở trường tiểu học.'),
        C('{妹|いもうと}さんは{何歳|なんさい}ですか。', 'Imoutosan wa nansai desu ka.', 'Em gái em mấy tuổi?'),
        S('{16歳|じゅうろくさい}で、{高校生|こうこうせい}です。', 'Juurokusai de, koukousei desu.', '16 tuổi, là học sinh cấp 3 ạ.'),
      ],
      [
        'Cô hỏi bằng **お{父|とう}さん／お{母|かあ}さん** → em đáp bằng **{父|ちち}は／{母|はは}は**. Nghề: **～です**; nơi làm: (nơi)**で{働|はたら}いています／{教|おし}えています**.',
        '"Tiểu học" = {小学校|しょうがっこう} (từ thêm), "cấp 2" = {中学校|ちゅうがっこう}, "cấp 3" = **{高校|こうこう}**. Nghề nông, nội trợ chưa học — nói nghề gần nhất đã học để trả lời trôi.',
        '**～で、～です** (ポイント 75 với danh từ): {16歳|じゅうろくさい}**で**、{高校生|こうこうせい}です.',
        'やってみよう: bắt **～に{住|す}んでいます** và câu tả nơi đó (Bài 4: にぎやか, {静|しず}か, {便利|べんり}…). Luyện ở **Luyện nghe · Bài 1**.',
      ],
      [
        mau([
          E('{私|わたし}の{姉|あね}です。— へえ。お{姉|ねえ}さんは{何|なに}をしていますか。— {姉|あね}は{会社員|かいしゃいん}です。デパートで{働|はたら}いています。', 'Watashi no ane desu. — Hee. Oneesan wa nani o shite imasu ka. — Ane wa kaishain desu. Depaato de hataraite imasu.', 'Số 4 例 — chị gái.'),
          E('{私|わたし}の{父|ちち}です。— お{父|とう}さんは{何|なに}をしていますか。— {父|ちち}は{医者|いしゃ}です。{病院|びょういん}で{働|はたら}いています。', 'Watashi no chichi desu. — Otousan wa nani o shite imasu ka. — Chichi wa isha desu. Byouin de hataraite imasu.', 'Số 4 ① — bố, bác sĩ.'),
          E('{私|わたし}の{母|はは}です。— お{母|かあ}さんは{何|なに}をしていますか。— {母|はは}は{高校|こうこう}の{先生|せんせい}です。{高校|こうこう}で{英語|えいご}を{教|おし}えています。', 'Watashi no haha desu. — Okaasan wa nani o shite imasu ka. — Haha wa koukou no sensei desu. Koukou de eigo o oshiete imasu.', 'Số 4 ② — mẹ, giáo viên cấp 3.'),
          E('{私|わたし}の{弟|おとうと}です。— {弟|おとうと}さんは{何|なに}をしていますか。— {弟|おとうと}は{大学生|だいがくせい}です。{大学|だいがく}で{絵|え}を{勉強|べんきょう}しています。', 'Watashi no otouto desu. — Otoutosan wa nani o shite imasu ka. — Otouto wa daigakusei desu. Daigaku de e o benkyou shite imasu.', 'Số 4 ③ — em trai, sinh viên học vẽ.'),
          E('{私|わたし}の{妹|いもうと}です。— {妹|いもうと}さんは{何|なに}をしていますか。— {妹|いもうと}は{高校生|こうこうせい}です。', 'Watashi no imouto desu. — Imoutosan wa nani o shite imasu ka. — Imouto wa koukousei desu.', 'Số 4 ④ — em gái, học sinh cấp 3.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 142–143 · チャレンジ! こんな人',
      'Trang 142: trong quán cà phê, một bạn nam cho bạn nữ xem ảnh trên máy ảnh; phía trên phóng to ba tấm: (a) một cô gái giơ tay chữ V, (b) ảnh cả nhà trong lễ cưới, (c) hai người phụ nữ ngồi đan len nói chuyện. Ô (1): thẻ "山口さん / ふじみ大学 / 英語" cạnh ảnh cô gái vẫy tay, bong bóng "?" có hình cô ấy chơi tennis (hỏi người này là ai, giỏi gì). Trang 143 — ô (2): trên ảnh đám cưới có bong bóng "お兄さん?", người kia đáp 兄, một người khác là 父; bên cạnh là hình một người đàn ông rất cao có mũi tên đo chiều cao (tả người: cao); ô (3-1): "この人?" trên ảnh nhóm → người kia nói 妹 (đó là em gái tôi); ô (3-2): "この人?" trên ảnh hai phụ nữ, thẻ "イさん / 友達" → hỏi イさん là người thế nào. **Mục tiêu できる:** nói được gia đình, bạn bè là người thế nào (☞ ポイント 74, 75).',
      [
        C('この{人|ひと}は{誰|だれ}ですか。', 'Kono hito wa dare desu ka.', 'Người này là ai?'),
        S('{山口|やまぐち}さんです。ふじみ{大学|だいがく}で{英語|えいご}を{勉強|べんきょう}しています。', 'Yamaguchi-san desu. Fujimi daigaku de eigo o benkyou shite imasu.', 'Là chị Yamaguchi. Đang học tiếng Anh ở đại học Fujimi.'),
        C('{山口|やまぐち}さんは{何|なに}が{上手|じょうず}ですか。', 'Yamaguchi-san wa nani ga jouzu desu ka.', 'Yamaguchi giỏi cái gì?'),
        S('テニスが{上手|じょうず}です。', 'Tenisu ga jouzu desu.', 'Chơi tennis giỏi ạ.'),
        C('（ô 2）この{人|ひと}はどんな{人|ひと}ですか。', '(ô 2) Kono hito wa donna hito desu ka.', '(ô 2) Người này là người thế nào?'),
        S('{背|せ}が{高|たか}いです。', 'Se ga takai desu.', 'Người đó cao ạ.'),
        C('ミンさんのお{母|かあ}さんはどんな{人|ひと}ですか。', 'Min-san no okaasan wa donna hito desu ka.', 'Mẹ Minh là người thế nào?'),
        S('{母|はは}は{優|やさ}しくて、{料理|りょうり}が{上手|じょうず}です。', 'Haha wa yasashikute, ryouri ga jouzu desu.', 'Mẹ em hiền và nấu ăn giỏi.'),
      ],
      [
        '**ポイント 74** N1**は**N2**が**A (ai thì bộ phận / kỹ năng thế nào): {背|せ}**が**{高|たか}い, テニス**が**{上手|じょうず}.',
        '**ポイント 75** nối hai ý: イA **～くて**, ナA / N **～で** ({優|やさ}しくて、まじめで). いい → **よくて**.',
        'Xem **Hội thoại · ② こんな人** và **Ngữ pháp · ポイント 74, 75**.',
      ],
    ),

    ...trang(
      'Trang 144 · 言ってみよう (chủ đề 2) — Số 1: ai giỏi gì · Số 2: người nhà thế nào · Số 3-1: người nào?',
      '**Số 1:** giới thiệu "người này là …, … giỏi …": 例 Anna đang chơi tennis; ① Daniel đá bóng; ② Natapon vẽ tranh bên giá vẽ; ③ Wang cầm bát (món ăn); ④ Marco cầm micro hát. **Số 2:** ảnh gia đình năm người đánh số — A: "đây là bố tôi" → B khen/nhận xét bằng お父さん… + tính từ ngoại hình: 例 bố — cao; ① chị gái, ② anh trai, ③ em trai, ④ vợ (tả theo hình trong sách: tóc dài/ngắn, cao, mắt to…). **Số 3-1:** A chỉ vào ảnh hỏi "người này là ai?" → B "người nào?" → A tả bằng hai đặc điểm nối くて → B "à, đó là … của tôi": 例 chồng (cao, tóc ngắn); ① em gái, ② mẹ, ③ bố.',
      [
        C('（số 1 ④）この{人|ひと}はマルコさんです。マルコさんは{何|なに}が{上手|じょうず}ですか。', '(số 1, 4) Kono hito wa Maruko-san desu. Maruko-san wa nani ga jouzu desu ka.', '(số 1 ④) Người này là Marco. Marco giỏi gì?'),
        S('マルコさんは{歌|うた}が{上手|じょうず}です。', 'Maruko-san wa uta ga jouzu desu.', 'Marco hát giỏi.'),
        C('（số 2）{私|わたし}の{父|ちち}です。', '(số 2) Watashi no chichi desu.', '(số 2) Đây là bố cô.'),
        S('{先生|せんせい}のお{父|とう}さんは{背|せ}が{高|たか}いですね。', 'Sensei no otousan wa se ga takai desu ne.', 'Bố cô cao nhỉ.'),
        C('（số 3-1）この{人|ひと}は{誰|だれ}ですか。', '(số 3-1) Kono hito wa dare desu ka.', '(số 3-1) Người này là ai?'),
        S('どの{人|ひと}ですか。', 'Dono hito desu ka.', 'Người nào ạ?'),
        C('この{髪|かみ}が{長|なが}くて、{目|め}が{大|おお}きい{人|ひと}です。', 'Kono kami ga nagakute, me ga ookii hito desu.', 'Người tóc dài, mắt to này.'),
        S('あ、それは{私|わたし}の{妹|いもうと}です。', 'A, sore wa watashi no imouto desu.', 'À, đó là em gái em.'),
      ],
      [
        'Số 2: nói về người nhà CỦA NGƯỜI KHÁC → **お{父|とう}さん／お{姉|ねえ}さん／お{兄|にい}さん／{弟|おとうと}さん／{奥|おく}さん**. Cuối câu thêm **ね** (nhận xét, tìm đồng tình — Bài 4).',
        'Số 3-1: cụm tả người đứng TRƯỚC {人|ひと}: **{背|せ}が{高|たか}くて、{髪|かみ}が{短|みじか}い{人|ひと}**. Người trả lời dùng **それは{私|わたし}の～です** (chỉ vào ảnh người kia đang cầm).',
        '{上手|じょうず} dùng khen người khác — nói về mình dùng {下手|へた}／あまり{上手|じょうず}じゃありません.',
        'Xem **Ngữ pháp · ポイント 74, 75** và **Luyện nghe · Bài 2 — Người nào?**',
      ],
      [
        mau([
          E('この{人|ひと}はアンナさんです。アンナさんはテニスが{上手|じょうず}です。', 'Kono hito wa Anna-san desu. Anna-san wa tenisu ga jouzu desu.', 'Số 1 例 — tennis.'),
          E('この{人|ひと}はダニエルさんです。ダニエルさんはサッカーが{上手|じょうず}です。', 'Kono hito wa Danieru-san desu. Danieru-san wa sakkaa ga jouzu desu.', 'Số 1 ① — bóng đá.'),
          E('この{人|ひと}はナタポンさんです。ナタポンさんは{絵|え}が{上手|じょうず}です。', 'Kono hito wa Natapon-san desu. Natapon-san wa e ga jouzu desu.', 'Số 1 ② — vẽ tranh.'),
          E('この{人|ひと}はワンさんです。ワンさんは{料理|りょうり}が{上手|じょうず}です。', 'Kono hito wa Wan-san desu. Wan-san wa ryouri ga jouzu desu.', 'Số 1 ③ — món ăn (tranh cầm bát: nói 料理 là an toàn).'),
          E('この{人|ひと}はマルコさんです。マルコさんは{歌|うた}が{上手|じょうず}です。', 'Kono hito wa Maruko-san desu. Maruko-san wa uta ga jouzu desu.', 'Số 1 ④ — hát.'),
          E('{私|わたし}の{父|ちち}です。— Aさんのお{父|とう}さんは{背|せ}が{高|たか}いですね。', 'Watashi no chichi desu. — A-san no otousan wa se ga takai desu ne.', 'Số 2 例 — bố, cao.'),
          E('{私|わたし}の{姉|あね}です。— Aさんのお{姉|ねえ}さんは{髪|かみ}が{長|なが}いですね。', 'Watashi no ane desu. — A-san no oneesan wa kami ga nagai desu ne.', 'Số 2 ① — chị gái (tả theo tranh sách).'),
          E('{私|わたし}の{兄|あに}です。— Aさんのお{兄|にい}さんはかっこいいですね。', 'Watashi no ani desu. — A-san no oniisan wa kakkoii desu ne.', 'Số 2 ② — anh trai.'),
          E('{私|わたし}の{弟|おとうと}です。— Aさんの{弟|おとうと}さんは{目|め}が{大|おお}きいですね。', 'Watashi no otouto desu. — A-san no otoutosan wa me ga ookii desu ne.', 'Số 2 ③ — em trai.'),
          E('{私|わたし}の{妻|つま}です。— Aさんの{奥|おく}さんはきれいですね。', 'Watashi no tsuma desu. — A-san no okusan wa kirei desu ne.', 'Số 2 ④ — vợ: 妻 (của mình) ↔ 奥さん (của người khác).'),
          E('この{人|ひと}は{誰|だれ}ですか。— どの{人|ひと}ですか。— この{背|せ}が{高|たか}くて、{髪|かみ}が{短|みじか}い{人|ひと}です。— あ、それは{私|わたし}の{夫|おっと}です。— へえ。', 'Kono hito wa dare desu ka. — Dono hito desu ka. — Kono se ga takakute, kami ga mijikai hito desu. — A, sore wa watashi no otto desu. — Hee.', 'Số 3-1 例 — chồng.'),
          E('この{髪|かみ}が{長|なが}くて、かわいい{人|ひと}です。— あ、それは{私|わたし}の{妹|いもうと}です。', 'Kono kami ga nagakute, kawaii hito desu. — A, sore wa watashi no imouto desu.', 'Số 3-1 ① — em gái (tả theo tranh sách).'),
          E('この{髪|かみ}が{短|みじか}くて、{優|やさ}しい{人|ひと}です。— あ、それは{私|わたし}の{母|はは}です。', 'Kono kami ga mijikakute, yasashii hito desu. — A, sore wa watashi no haha desu.', 'Số 3-1 ② — mẹ.'),
          E('この{背|せ}が{高|たか}くて、{目|め}が{大|おお}きい{人|ひと}です。— あ、それは{私|わたし}の{父|ちち}です。', 'Kono se ga takakute, me ga ookii hito desu. — A, sore wa watashi no chichi desu.', 'Số 3-1 ③ — bố.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 145 · 言ってみよう số 3-2 · やってみよう · ペアで話しましょう (chủ đề 2)',
      '**Số 3-2:** A giới thiệu "người này là …, bạn / đàn em / đàn chị của tôi" → B hỏi "… là người thế nào?" → A trả lời bằng hai đặc điểm nối くて／で. Bốn thẻ: 例 Anna — bạn — vui tính / tốt bụng; ① Daniel — bạn — năng động / vui tính; ② Kim — đàn em — chăm chỉ / thông minh; ③ Linh — đàn anh — cao / đá bóng giỏi. **やってみよう:** Daniel cho xem nhiều ảnh (chó, mèo, ba chàng trai, ảnh gia đình có phụ nữ và trẻ em) — nghe xem đang nói về ảnh nào, rồi nghe lại: bạn của Daniel và chị gái Daniel là người thế nào. **ペアで話しましょう:** A có ảnh hai người bạn (キムさん: sinh viên, sống ở 上野, chăm chỉ, thông minh; 川野さん: nhân viên công ty, sống ở 横浜, vui tính, tốt bụng) — tự thêm một đặc điểm vào ô trống rồi giới thiệu; B nhìn ảnh và hỏi thật nhiều.',
      [
        C('この{人|ひと}はキムさんです。{私|わたし}の{後輩|こうはい}です。', 'Kono hito wa Kimu-san desu. Watashi no kouhai desu.', 'Người này là Kim. Đàn em của cô.'),
        S('へえ。キムさんはどんな{人|ひと}ですか。', 'Hee. Kimu-san wa donna hito desu ka.', 'Ồ. Kim là người thế nào ạ?'),
        C('まじめで、{頭|あたま}がいい{人|ひと}です。', 'Majime de, atama ga ii hito desu.', 'Là người chăm chỉ và thông minh.'),
        S('そうですか。キムさんはどこに{住|す}んでいますか。', 'Sou desu ka. Kimu-san wa doko ni sunde imasu ka.', 'Vậy ạ. Kim sống ở đâu ạ?'),
        C('{上野|うえの}に{住|す}んでいます。ミンさんの{友達|ともだち}はどんな{人|ひと}ですか。', 'Ueno ni sunde imasu. Min-san no tomodachi wa donna hito desu ka.', 'Sống ở Ueno. Bạn của Minh là người thế nào?'),
        S('おもしろくて、{元気|げんき}な{人|ひと}です。サッカーが{上手|じょうず}です。', 'Omoshirokute, genki na hito desu. Sakkaa ga jouzu desu.', 'Là người vui tính và năng động. Đá bóng giỏi ạ.'),
      ],
      [
        '**どんな{人|ひと}ですか** → **A1 て、A2 {人|ひと}です**. ナA đứng trước {人|ひと} cần **な** ({親切|しんせつ}**な**{人|ひと}, {元気|げんき}**な**{人|ひと}).',
        'Hai đặc điểm "頭がいい" + "かっこいい" nối: {頭|あたま}が**よくて**、かっこいい.',
        'Pair work: người hỏi (B) nên hỏi đủ **{何|なに}をしていますか · どこに{住|す}んでいますか · どんな{人|ひと}ですか · {何|なに}が{上手|じょうず}ですか** — đúng 4 câu cô hay dùng khi chấm.',
        'やってみよう: bắt từ **{犬|いぬ}／{猫|ねこ}／{友達|ともだち}／{姉|あね}** để biết đang nói ảnh nào, và các tính từ sau が. Luyện ở **Luyện nghe · Bài 2** và **Luyện nói · Đóng vai — Vai 1**.',
      ],
      [
        mau([
          E('この{人|ひと}はアンナさんです。{私|わたし}の{友達|ともだち}です。— へえ。アンナさんはどんな{人|ひと}ですか。— おもしろくて、{親切|しんせつ}な{人|ひと}です。— そうですか。', 'Kono hito wa Anna-san desu. Watashi no tomodachi desu. — Hee. Anna-san wa donna hito desu ka. — Omoshirokute, shinsetsu na hito desu. — Sou desu ka.', 'Số 3-2 例 — Anna.'),
          E('この{人|ひと}はダニエルさんです。{私|わたし}の{友達|ともだち}です。— ダニエルさんはどんな{人|ひと}ですか。— {元気|げんき}で、おもしろい{人|ひと}です。', 'Kono hito wa Danieru-san desu. Watashi no tomodachi desu. — Danieru-san wa donna hito desu ka. — Genki de, omoshiroi hito desu.', 'Số 3-2 ① — Daniel.'),
          E('この{人|ひと}はキムさんです。{私|わたし}の{後輩|こうはい}です。— キムさんはどんな{人|ひと}ですか。— まじめで、{頭|あたま}がいい{人|ひと}です。', 'Kono hito wa Kimu-san desu. Watashi no kouhai desu. — Kimu-san wa donna hito desu ka. — Majime de, atama ga ii hito desu.', 'Số 3-2 ② — Kim (đàn em).'),
          E('この{人|ひと}はリンさんです。{私|わたし}の{先輩|せんぱい}です。— リンさんはどんな{人|ひと}ですか。— {背|せ}が{高|たか}くて、サッカーが{上手|じょうず}な{人|ひと}です。', 'Kono hito wa Rin-san desu. Watashi no senpai desu. — Rin-san wa donna hito desu ka. — Se ga takakute, sakkaa ga jouzu na hito desu.', 'Số 3-2 ③ — Linh (đàn anh).'),
          E('この{人|ひと}は{川野|かわの}さんです。{会社員|かいしゃいん}です。{横浜|よこはま}に{住|す}んでいます。おもしろくて、{親切|しんせつ}です。そして、ピアノが{上手|じょうず}です。', 'Kono hito wa Kawano-san desu. Kaishain desu. Yokohama ni sunde imasu. Omoshirokute, shinsetsu desu. Soshite, piano ga jouzu desu.', 'ペアで話しましょう A — giới thiệu 川野さん (ô trống: tự thêm "ピアノが上手").'),
        ]),
      ],
    ),

    ...trang(
      'Trang 146–147 · チャレンジ! プレゼント',
      'Trang 146: trong lớp, trên tường có lịch ghi ngày tháng và thứ; một bạn nam cầm tờ giấy nói chuyện với một bạn nữ. Ô (1): bong bóng "マリヤムさん / 誕生日" có mũi tên tới hộp quà rồi tới hình Mariyam mặc trang phục truyền thống — sắp sinh nhật Mariyam; ô bên phải: nhóm bạn cầm hộp quà tặng một cô gái, dấu "?" cạnh chữ 何 (tặng gì?), gợi ý trong bong bóng: cô gái ôm mèo, đĩa CD/DVD. Trang 147: lớp học có bản đồ thế giới; một bạn nam xem đồng hồ đeo tay của mình khi nói chuyện với bạn nữ. Ô (2): "誕生日" và "母" — mẹ trao hộp quà cho con gái (quà sinh nhật từ mẹ); ô (3): thẻ ngày "2/14" và chữ "バレンタインデー?", bong bóng lớn vẽ các cặp đôi ăn tối, chữ 妻, và các món quà nhỏ (đồng hồ, máy ảnh). **Mục tiêu できる:** bàn với bạn nên tặng quà gì cho một người bạn; kể về món quà mình đã nhận (☞ ポイント 76, 77, 78).',
      [
        C('もうすぐマリヤムさんの{誕生日|たんじょうび}ですね。{何|なに}かあげませんか。', 'Mousugu Mariyamu-san no tanjoubi desu ne. Nanika agemasen ka.', 'Sắp sinh nhật Mariyam nhỉ. Mình tặng gì đó không?'),
        S('いいですね。{何|なに}をあげますか。', 'Ii desu ne. Nani o agemasu ka.', 'Hay ạ. Tặng gì ạ?'),
        C('マリヤムさんは{猫|ねこ}が{好|す}きですよ。', 'Mariyamu-san wa neko ga suki desu yo.', 'Mariyam thích mèo đấy.'),
        S('じゃ、{猫|ねこ}のカードはどうですか。', 'Ja, neko no kaado wa dou desu ka.', 'Vậy thiệp hình mèo thì sao ạ?'),
        C('（ô 2）ミンさんは{誕生日|たんじょうび}にお{母|かあ}さんに{何|なに}をもらいましたか。', '(ô 2) Min-san wa tanjoubi ni okaasan ni nani o moraimashita ka.', '(ô 2) Sinh nhật, Minh nhận được gì từ mẹ?'),
        S('{母|はは}にかばんをもらいました。', 'Haha ni kaban o moraimashita.', 'Em nhận của mẹ cái túi ạ.'),
        C('（ô 3）ベトナムでもバレンタインデーにプレゼントをあげますか。', '(ô 3) Betonamu de mo barentaindee ni purezento o agemasu ka.', '(ô 3) Ở Việt Nam ngày Valentine cũng tặng quà à?'),
        S('はい、{男|おとこ}の{人|ひと}が{女|おんな}の{人|ひと}に{花|はな}やチョコレートをあげます。', 'Hai, otoko no hito ga onna no hito ni hana ya chokoreeto o agemasu.', 'Vâng, con trai tặng con gái hoa, sô-cô-la ạ.'),
      ],
      [
        '**ポイント 76** (người nhận)**に** (vật)**を あげます** · **ポイント 77** (người cho)**に** (vật)**を もらいます** · **ポイント 78** (người cho)**が** (tôi に) (vật)**を くれます**.',
        'Cô hỏi 「{誰|だれ}に～をもらいましたか」 → giữ **もらいました**; cô hỏi 「{誰|だれ}が～をくれましたか」 → giữ **くれました**. Đổi động từ giữa chừng là dễ sai trợ từ.',
        'Ở Nhật, Valentine là con gái tặng con trai sô-cô-la — kể về Việt Nam thì nói ngược lại cho đúng thực tế.',
        'Xem **Hội thoại · ③ プレゼント** và **Ngữ pháp · ポイント 76–78**.',
      ],
    ),

    ...trang(
      'Trang 148 · 言ってみよう (chủ đề 3) — Số 1: bàn tặng gì · Số 2: khen đồ → ai tặng',
      '**Số 1:** "Sắp … rồi nhỉ. Mình tặng … cái gì đó không?" → "Hay đấy, tặng gì?" → "Tôi muốn tặng …" → "Hay đấy, vậy làm thế nhé": 例 sinh nhật パク — bó hoa; ① sinh nhật アンナ — bánh kem cắm nến; ② đám cưới 田中さん — một hộp quà tròn (bộ đồ dùng / bánh kẹo, sách không ghi chữ); ③ ジョン về nước — nhiều người viết lời nhắn lên thiệp "ジョンさんへ". **Số 2:** A khen đồ của B "cái … đó đẹp nhỉ" → B cảm ơn và nói nhận của ai: 例 máy ảnh — chị gái; ① cái ô — パクさん; ② dây chuyền — người yêu; ③ từ điển — đàn anh.',
      [
        C('もうすぐアンナさんの{誕生日|たんじょうび}ですね。ミンさん、アンナさんに{何|なに}かプレゼントをあげませんか。', 'Mousugu Anna-san no tanjoubi desu ne. Min-san, Anna-san ni nanika purezento o agemasen ka.', 'Sắp sinh nhật Anna nhỉ. Minh, mình tặng Anna món quà gì đó không?'),
        S('いいですね。{何|なに}をあげますか。', 'Ii desu ne. Nani o agemasu ka.', 'Hay ạ. Tặng gì ạ?'),
        C('{私|わたし}はケーキをあげたいです。', 'Watashi wa keeki o agetai desu.', 'Cô muốn tặng bánh kem.'),
        S('いいですね。じゃ、そうしましょう。', 'Ii desu ne. Ja, sou shimashou.', 'Hay ạ. Vậy làm thế nhé.'),
        C('ミンさん、その{傘|かさ}、いいですね。', 'Min-san, sono kasa, ii desu ne.', 'Minh, cái ô đó đẹp nhỉ.'),
        S('あ、ありがとうございます。パクさんにもらいました。', 'A, arigatou gozaimasu. Paku-san ni moraimashita.', 'A, cảm ơn cô. Em nhận của Park ạ.'),
      ],
      [
        '**{何|なに}か** = cái gì đó (không có を phía sau cũng được: {何|なに}か**あげませんか**). **～たいです** (Bài 5) nói ý muốn tặng; **そうしましょう** (Bài 6) chốt.',
        'Được khen đồ: **ありがとうございます** + **(người)にもらいました**. Không đáp ~~はい、いいです~~ (nghe tự khen).',
        'Đồ của người đối diện → **その** (Bài 2): **その**カメラ, **その**{傘|かさ}.',
        'Xem **Ngữ pháp · ポイント 76, 77** và **Luyện nói · Đóng vai — Vai 2**.',
      ],
      [
        mau([
          E('もうすぐ、パクさんの{誕生日|たんじょうび}ですね。Bさん、パクさんに{何|なに}かプレゼントをあげませんか。— いいですね。{何|なに}をあげますか。— {私|わたし}は{花|はな}をあげたいです。— いいですね。じゃ、そうしましょう。', 'Mousugu, Paku-san no tanjoubi desu ne. B-san, Paku-san ni nanika purezento o agemasen ka. — Ii desu ne. Nani o agemasu ka. — Watashi wa hana o agetai desu. — Ii desu ne. Ja, sou shimashou.', 'Số 1 例 — hoa.'),
          E('もうすぐ、アンナさんの{誕生日|たんじょうび}ですね。アンナさんに{何|なに}かあげませんか。— {私|わたし}はケーキをあげたいです。', 'Mousugu, Anna-san no tanjoubi desu ne. Anna-san ni nanika agemasen ka. — Watashi wa keeki o agetai desu.', 'Số 1 ① — bánh kem.'),
          E('もうすぐ、{田中|たなか}さんの{結婚式|けっこんしき}ですね。{田中|たなか}さんに{何|なに}かあげませんか。— {私|わたし}はお{皿|さら}をあげたいです。', 'Mousugu, Tanaka-san no kekkonshiki desu ne. Tanaka-san ni nanika agemasen ka. — Watashi wa osara o agetai desu.', 'Số 1 ② — đám cưới (hộp quà tròn: nói theo món bạn đoán — お皿, チョコレート…).'),
          E('もうすぐ、ジョンさんが{国|くに}へ{帰|かえ}りますね。ジョンさんに{何|なに}かあげませんか。— {私|わたし}はカードをあげたいです。みんなで{書|か}きましょう。', 'Mousugu, Jon-san ga kuni e kaerimasu ne. Jon-san ni nanika agemasen ka. — Watashi wa kaado o agetai desu. Minna de kakimashou.', 'Số 1 ③ — John về nước: thiệp cả lớp cùng viết.'),
          E('Bさん、そのカメラ、いいですね。— あ、ありがとうございます。{姉|あね}にもらいました。', 'B-san, sono kamera, ii desu ne. — A, arigatou gozaimasu. Ane ni moraimashita.', 'Số 2 例 — máy ảnh, chị gái.'),
          E('Bさん、その{傘|かさ}、いいですね。— あ、ありがとうございます。パクさんにもらいました。', 'B-san, sono kasa, ii desu ne. — A, arigatou gozaimasu. Paku-san ni moraimashita.', 'Số 2 ① — ô, Park.'),
          E('Bさん、そのネックレス、いいですね。— あ、ありがとうございます。{恋人|こいびと}にもらいました。', 'B-san, sono nekkuresu, ii desu ne. — A, arigatou gozaimasu. Koibito ni moraimashita.', 'Số 2 ② — dây chuyền, người yêu.'),
          E('Bさん、その{辞書|じしょ}、いいですね。— あ、ありがとうございます。{先輩|せんぱい}にもらいました。', 'B-san, sono jisho, ii desu ne. — A, arigatou gozaimasu. Senpai ni moraimashita.', 'Số 2 ③ — từ điển, đàn anh.'),
        ]),
      ],
    ),

    ...trang(
      'Trang 149 · 言ってみよう số 3 · やってみよう · ロールプレイ (chủ đề 3)',
      '**Số 3:** A hỏi "… thế nào?" → B kể đã làm gì (hai hành động, nối それから) → "… đã tặng tôi …" → A: "vậy à, tốt quá nhỉ". Mỗi mục có hai tranh: sự kiện rồi món quà: 例 tiệc sinh nhật (ăn bánh, đi karaoke) — bạn tặng đĩa CD; ① Giáng sinh (cả nhà bên cây thông) — bố tặng đồng hồ; ② Valentine (ngồi với người yêu) — người yêu tặng hộp sô-cô-la. **やってみよう:** nghe CD — hai người bàn nên tặng gì (ghi món quà); rồi nghe hai người kể "ai đã tặng mình cái gì" (ghi ___が___をくれました). **ロールプレイ:** A và B cùng chọn quà sinh nhật cho C — nghĩ xem C thích gì, muốn gì, rồi bàn mua ở đâu. Dòng ■ cuối: món quà nào làm bạn vui? Ai tặng?',
      [
        C('{誕生日|たんじょうび}パーティーはどうでしたか。', 'Tanjoubi paatii wa dou deshita ka.', 'Tiệc sinh nhật thế nào?'),
        S('とても{楽|たの}しかったです。ケーキを{食|た}べました。それから、カラオケに{行|い}きました。', 'Totemo tanoshikatta desu. Keeki o tabemashita. Sorekara, karaoke ni ikimashita.', 'Rất vui ạ. Em ăn bánh kem. Sau đó đi karaoke.'),
        C('へえ。', 'Hee.', 'Ồ.'),
        S('{友達|ともだち}がCDをくれました。', 'Tomodachi ga shiidii o kuremashita.', 'Bạn em tặng em đĩa CD.'),
        C('そうですか。よかったですね。', 'Sou desu ka. Yokatta desu ne.', 'Vậy à. Tốt quá nhỉ.'),
        C('ミンさんがいちばんうれしかったプレゼントは{何|なん}ですか。', 'Min-san ga ichiban ureshikatta purezento wa nan desu ka.', 'Món quà Minh vui nhất là gì?'),
        S('{時計|とけい}です。{父|ちち}がくれました。', 'Tokei desu. Chichi ga kuremashita.', 'Là cái đồng hồ ạ. Bố em tặng.'),
      ],
      [
        '**どうでしたか** (Bài 5) hỏi cảm nhận về việc đã qua → **{楽|たの}しかったです** (quá khứ tính từ い). Kể hai việc: **～ました。それから、～ました。**',
        'Người khác tặng MÌNH → **(người)がくれました**. Đây là mục cô kiểm tra kỹ nhất của Bài 8.',
        'Nghe chuyện vui của người khác → **よかったですね**.',
        'やってみよう: bắt động từ cuối (**あげます／くれました**) trước khi ghi. Luyện ở **Luyện nghe · Bài 3, Bài 4**.',
      ],
      [
        mau([
          E('{誕生日|たんじょうび}パーティーはどうでしたか。— とても{楽|たの}しかったです。ケーキを{食|た}べました。それから、カラオケに{行|い}きました。— へえ。— {友達|ともだち}がCDをくれました。— そうですか。よかったですね。', 'Tanjoubi paatii wa dou deshita ka. — Totemo tanoshikatta desu. Keeki o tabemashita. Sorekara, karaoke ni ikimashita. — Hee. — Tomodachi ga shiidii o kuremashita. — Sou desu ka. Yokatta desu ne.', 'Số 3 例 — tiệc sinh nhật.'),
          E('クリスマスはどうでしたか。— とても{楽|たの}しかったです。{家族|かぞく}とご{飯|はん}を{食|た}べました。それから、{歌|うた}を{歌|うた}いました。— へえ。— {父|ちち}が{時計|とけい}をくれました。— そうですか。よかったですね。', 'Kurisumasu wa dou deshita ka. — Totemo tanoshikatta desu. Kazoku to gohan o tabemashita. Sorekara, uta o utaimashita. — Hee. — Chichi ga tokei o kuremashita. — Sou desu ka. Yokatta desu ne.', 'Số 3 ① — Giáng sinh, bố tặng đồng hồ.'),
          E('バレンタインデーはどうでしたか。— とても{楽|たの}しかったです。{恋人|こいびと}とレストランへ{行|い}きました。— へえ。— {恋人|こいびと}がチョコレートをくれました。— そうですか。よかったですね。', 'Barentaindee wa dou deshita ka. — Totemo tanoshikatta desu. Koibito to resutoran e ikimashita. — Hee. — Koibito ga chokoreeto o kuremashita. — Sou desu ka. Yokatta desu ne.', 'Số 3 ② — Valentine, người yêu tặng sô-cô-la.'),
          E('{来週|らいしゅう}、Cさんの{誕生日|たんじょうび}ですね。{一緒|いっしょ}に{何|なに}かあげませんか。— いいですね。Cさんは{何|なに}が{好|す}きですか。— {猫|ねこ}が{好|す}きですよ。— じゃ、{猫|ねこ}のノートはどうですか。— いいですね。どこで{買|か}いますか。— {駅|えき}の{前|まえ}のデパートで{買|か}いましょう。', 'Raishuu, C-san no tanjoubi desu ne. Issho ni nanika agemasen ka. — Ii desu ne. C-san wa nani ga suki desu ka. — Neko ga suki desu yo. — Ja, neko no nooto wa dou desu ka. — Ii desu ne. Doko de kaimasu ka. — Eki no mae no depaato de kaimashou.', 'ロールプレイ — mẫu A/B chọn quà cho C.'),
          E('いちばんうれしかったプレゼントは{手紙|てがみ}です。{母|はは}がくれました。', 'Ichiban ureshikatta purezento wa tegami desu. Haha ga kuremashita.', 'Dòng ■ — món quà vui nhất (thay bằng quà THẬT của bạn).'),
        ]),
      ],
    ),

    ...trang(
      'Trang 150 · できる! — Gia đình, bạn bè và kỷ niệm',
      'Nhiệm vụ tổng hợp: "Gia đình, bạn bè bạn là người thế nào? Bạn có kỷ niệm gì với họ? Hãy nói với bạn cùng lớp." Phần còn lại của trang để trống để ghi chú. Trên lớp: mỗi bạn mang một tấm ảnh (điện thoại cũng được), giới thiệu người trong ảnh 4–5 câu; cô và các bạn hỏi thêm.',
      [
        S('この{人|ひと}は{私|わたし}の{友達|ともだち}のホアです。', 'Kono hito wa watashi no tomodachi no Hoa desu.', 'Người này là Hoa, bạn em.'),
        C('ホアさんはどんな{人|ひと}ですか。', 'Hoa-san wa donna hito desu ka.', 'Hoa là người thế nào?'),
        S('{明|あか}るくて……おもしろくて、{親切|しんせつ}な{人|ひと}です。{歌|うた}が{上手|じょうず}です。', 'Akarukute…… omoshirokute, shinsetsu na hito desu. Uta ga jouzu desu.', 'Là người … vui tính và tốt bụng. Hát hay ạ.'),
        C('ホアさんは{何|なに}をしていますか。', 'Hoa-san wa nani o shite imasu ka.', 'Hoa làm gì?'),
        S('ダナンの{大学|だいがく}で{経済|けいざい}を{勉強|べんきょう}しています。', 'Danan no daigaku de keizai o benkyou shite imasu.', 'Đang học kinh tế ở một trường đại học ở Đà Nẵng.'),
        C('どんな{思|おも}い{出|で}がありますか。', 'Donna omoide ga arimasu ka.', 'Em có kỷ niệm gì với bạn ấy?'),
        S('{高校|こうこう}で{毎日|まいにち}{一緒|いっしょ}に{勉強|べんきょう}しました。{誕生日|たんじょうび}に、ホアは{私|わたし}に{手紙|てがみ}をくれました。', 'Koukou de mainichi issho ni benkyou shimashita. Tanjoubi ni, Hoa wa watashi ni tegami o kuremashita.', 'Hồi cấp 3 ngày nào chúng em cũng học cùng nhau. Sinh nhật, Hoa viết thư tặng em.'),
      ],
      [
        '**{思|おも}い{出|で}** = kỷ niệm (từ thêm). Kỷ niệm kể bằng **thể quá khứ ～ました** (Bài 5) + **くれました**.',
        'Khung 4 câu: **ai (この{人|ひと}は～です) → làm gì (～ています) → thế nào (～くて、～{人|にん}です) → kỷ niệm (～ました／～がくれました)**.',
        'Nói vấp thì dừng, bỏ từ chưa chắc (như {明|あか}るい — chưa học) và chuyển sang từ đã chắc. Câu mẫu trên cố ý cho thấy cách sửa giữa chừng.',
        'Xem **Hội thoại · できる！** (bảng chuẩn bị 4 người mẫu).',
      ],
    ),

    ...trang(
      'Trang 150 · 話読聞書「大切な人」 — Người quan trọng của tôi',
      'Ô 話読聞書 có đoạn ngắn khoảng 9 câu: người viết giới thiệu một người bạn là sinh viên đại học học ngoại ngữ, hai người chơi tennis cùng nhau mỗi tuần, bạn ấy chơi giỏi và dạy cũng giỏi, là người vui tính, hiền và có rất nhiều bạn. Bên lề có 3 câu hỏi dàn ý: **大切な人は誰ですか · どんな人ですか · 何をしていますか**. Nhiệm vụ: viết đoạn về người quan trọng của BẠN theo đúng 3 câu hỏi đó rồi đọc to.',
      [
        C('ミンさんの{大切|たいせつ}な{人|ひと}は{誰|だれ}ですか。', 'Min-san no taisetsu na hito wa dare desu ka.', 'Người quan trọng của Minh là ai?'),
        S('{母|はは}です。', 'Haha desu.', 'Là mẹ em ạ.'),
        C('{読|よ}んでください。', 'Yonde kudasai.', 'Em đọc đi.'),
        S('{私|わたし}の{大切|たいせつ}な{人|ひと}は{母|はは}です。{母|はは}はハノイに{住|す}んでいます。{小学校|しょうがっこう}で{英語|えいご}を{教|おし}えています。{母|はは}は{髪|かみ}が{長|なが}くて、{優|やさ}しい{人|ひと}です。{料理|りょうり}がとても{上手|じょうず}です。{毎週|まいしゅう}{日曜日|にちようび}、{母|はは}に{電話|でんわ}します。{去年|きょねん}の{誕生日|たんじょうび}に、{母|はは}は{私|わたし}にパソコンをくれました。', 'Watashi no taisetsu na hito wa haha desu. Haha wa Hanoi ni sunde imasu. Shougakkou de eigo o oshiete imasu. Haha wa kami ga nagakute, yasashii hito desu. Ryouri ga totemo jouzu desu. Maishuu nichiyoubi, haha ni denwa shimasu. Kyonen no tanjoubi ni, haha wa watashi ni pasokon o kuremashita.', 'Người quan trọng của tôi là mẹ. Mẹ sống ở Hà Nội. Mẹ dạy tiếng Anh ở trường tiểu học. Mẹ tóc dài, là người hiền. Nấu ăn rất giỏi. Chủ Nhật hằng tuần tôi gọi điện cho mẹ. Sinh nhật năm ngoái mẹ tặng tôi máy tính.'),
      ],
      [
        'Bài này dùng gần đủ ポイント của Bài 8: **{住|す}んでいます (72) · {教|おし}えています (73) · {髪|かみ}が{長|なが}くて (74, 75) · くれました (78)** — đọc trôi là ôn được cả bài.',
        'Viết về người nhà mình: {母|はは}, {父|ちち}… KHÔNG thêm さん; về bạn: tên + さん.',
        'Xem **Hội thoại · ④ Nói–Đọc–Nghe–Viết** (bài mẫu "私の姉" + khung 5 câu) và **Luyện nói · Đọc to — Reading**.',
      ],
    ),

    { t: 'h', text: 'Trang 151 · ことば — Từ vựng của bài' },
    {
      t: 'p',
      text: 'Trang liệt kê từ mới theo 3 chủ đề: (1) 8-1 家族・友達 — bố mẹ, bố, mẹ, anh chị em, anh, chị, em trai, em gái, chồng, vợ, con, con trai, con gái, và các cách gọi tôn kính お父さん, お母さん, お兄さん, お姉さん, 弟さん, 妹さん, お子さん; thú cưng, mèo, piano, bác sĩ, học sinh cấp 3, sinh viên, ～人, ～匹, 住みます, います — ví dụ 「私は弟がいます」; (2) 8-2 こんな人 — ご主人, 奥さん, 先輩, 後輩, thỏ, bộ phận cơ thể (体, 足, 顔, 髪, 口, 鼻, 目, 耳) và tính từ tả người (頭がいい, かっこいい, かわいい, 背が高い, 長い, 短い, 優しい, 黒い, 白い, 茶色い, 元気, 親切, まじめ, 上手, 下手); (3) 8-3 プレゼント — thiệp, ô, tiền, tất, từ điển, sô-cô-la, thư, dây chuyền, vở, quà, email, bà, Giáng sinh, đám cưới, Valentine, 何か, 送ります, もらいます, あげます, くれます, 電話します, もうすぐ, よかったですね — ví dụ 「友達の誕生日にカードを送ります」. Không có tranh. Tổng 81 từ; cuối trang 152 thêm 経済, 結婚します, 素敵. Đủ nghĩa, romaji, ví dụ: xem mục **Từ vựng** của Bài 8.',
    },
    { t: 'note', title: 'Mẹo', items: ['Cô hay kiểm tra nhanh cặp **nhà mình ↔ nhà người khác**: cô đọc "mẹ em" → bạn nói {母|はは}; "mẹ bạn" → お{母|かあ}さん; "vợ tôi" → {妻|つま}; "vợ anh ấy" → {奥|おく}さん — ôn ở **Từ vựng · bảng gọi người thân**.', 'Xem **Từ vựng · Bài 8** và **Chữ Hán · Bài 8** (có phần đọc không furigana).'] },

    ...trang(
      'Trang 152 · もう一度聞こう「電車の中で」 — Nghe lại cả bài',
      'Nghe lại đoạn ở trang 137: trên tàu điện, パク hỏi ナタポン sống ở đâu — ナタポン sống ở **三鷹** và khen đó là nơi tốt; anh không sống một mình mà **sống hai người với một người bạn**. ナタポン cho xem ảnh người bạn đó: cao, đẹp trai, đang **học kinh tế** ở đại học. パク chỉ một người khác trong ảnh (tóc ngắn, mắt to) — đó là bạn ở quê của ナタポン; người bên cạnh là **vợ** anh ấy, hai người đã có **hai con** (パク ngạc nhiên). Sau một đoạn ngắt, ナタポン khen cái túi của パク — パク nói đó là quà **mẹ tặng nhân sinh nhật**. Từ mới cuối trang: 経済 (kinh tế), 結婚します (kết hôn), 素敵 (đẹp, tuyệt). Cô sẽ hỏi lại các chi tiết.',
      [
        C('ナタポンさんはどこに{住|す}んでいますか。', 'Natapon-san wa doko ni sunde imasu ka.', 'Natapon sống ở đâu?'),
        S('{三鷹|みたか}に{住|す}んでいます。', 'Mitaka ni sunde imasu.', 'Sống ở Mitaka ạ.'),
        C('{誰|だれ}と{住|す}んでいますか。', 'Dare to sunde imasu ka.', 'Sống với ai?'),
        S('{友達|ともだち}と{2人|ふたり}で{住|す}んでいます。', 'Tomodachi to futari de sunde imasu.', 'Sống hai người với bạn ạ.'),
        C('その{友達|ともだち}はどんな{人|ひと}ですか。', 'Sono tomodachi wa donna hito desu ka.', 'Người bạn đó là người thế nào?'),
        S('{背|せ}が{高|たか}くて、かっこいい{人|ひと}です。{大学|だいがく}で{経済|けいざい}を{勉強|べんきょう}しています。', 'Se ga takakute, kakkoii hito desu. Daigaku de keizai o benkyou shite imasu.', 'Là người cao, đẹp trai. Đang học kinh tế ở đại học.'),
        C('{国|くに}の{友達|ともだち}は{結婚|けっこん}していますか。', 'Kuni no tomodachi wa kekkon shite imasu ka.', 'Người bạn ở quê đã lập gia đình chưa?'),
        S('はい、{結婚|けっこん}しています。{子|こ}どもが{2人|ふたり}います。', 'Hai, kekkon shite imasu. Kodomo ga futari imasu.', 'Rồi ạ. Có hai con.'),
        C('パクさんのかばんは{誰|だれ}にもらいましたか。', 'Paku-san no kaban wa dare ni moraimashita ka.', 'Cái túi của Park nhận của ai?'),
        S('お{母|かあ}さんにもらいました。{誕生日|たんじょうび}のプレゼントです。', 'Okaasan ni moraimashita. Tanjoubi no purezento desu.', 'Nhận của mẹ bạn ấy ạ. Quà sinh nhật.'),
      ],
      [
        'Kể lại chuyện của NGƯỜI KHÁC → dùng **お{母|かあ}さん** (mẹ của Park), không phải {母|はは}. Trong CD, パク nói {母|はは}にもらいました vì đó là mẹ của chính cô ấy.',
        '**{結婚|けっこん}しています** = đã có gia đình (ポイント 72: trạng thái kéo dài). Hỏi "đã lập gia đình chưa" → **{結婚|けっこん}していますか**.',
        '**{素敵|すてき}ですね** — khen đồ của người khác, giống いいですね.',
        'Xem **Luyện nghe · Bài 5 — Hội thoại dài: trên tàu điện** (bài nghe viết mới cùng tình huống).',
      ],
    ),

    { t: 'h', text: 'Cô hỏi — bạn trả lời: ghép nhanh câu trả lời' },
    {
      t: 'build',
      id: 'b8-sach-ghep',
      title: 'Nghe câu hỏi (tiếng Việt) → ghép câu trả lời tiếng Nhật',
      items: [
        { vi: 'Cô hỏi どこに住んでいますか → "Em sống ở Hà Nội."', chips: ['ハノイに', '{住|す}んでいます。', 'ハノイで', '{住|す}みます。'], answer: ['ハノイに', '{住|す}んでいます。'], ro: 'Hanoi ni sunde imasu.' },
        { vi: 'Cô hỏi 誰と住んでいますか → "Em sống hai người với bạn."', chips: ['{友達|ともだち}と', '{2人|ふたり}で', '{住|す}んでいます。', '{友達|ともだち}が', '{2人|ふたり}います。'], answer: ['{友達|ともだち}と', '{2人|ふたり}で', '{住|す}んでいます。'], ro: 'Tomodachi to futari de sunde imasu.' },
        { vi: 'Cô hỏi 兄弟がいますか → "Có ạ, em có một em gái."', chips: ['はい、', '{妹|いもうと}が', '{1人|ひとり}', 'います。', 'あります。', '{妹|いもうと}さんが'], answer: ['はい、', '{妹|いもうと}が', '{1人|ひとり}', 'います。'], ro: 'Hai, imouto ga hitori imasu.' },
        { vi: 'Cô hỏi お父さんは何をしていますか → "Bố em là bác sĩ. Làm ở bệnh viện."', chips: ['{父|ちち}は', '{医者|いしゃ}です。', '{病院|びょういん}で', '{働|はたら}いています。', 'お{父|とう}さんは', '{病院|びょういん}に'], answer: ['{父|ちち}は', '{医者|いしゃ}です。', '{病院|びょういん}で', '{働|はたら}いています。'], ro: 'Chichi wa isha desu. Byouin de hataraite imasu.' },
        { vi: 'Cô hỏi お母さんはどんな人ですか → "Mẹ em hiền và tốt bụng."', chips: ['{母|はは}は', '{優|やさ}しくて、', '{親切|しんせつ}です。', '{優|やさ}しいで、', 'お{母|かあ}さんは'], answer: ['{母|はは}は', '{優|やさ}しくて、', '{親切|しんせつ}です。'], ro: 'Haha wa yasashikute, shinsetsu desu.' },
        { vi: 'Cô hỏi 何が上手ですか (về bạn của em) → "Bạn ấy đá bóng giỏi."', chips: ['サッカーが', '{上手|じょうず}です。', 'サッカーを', '{下手|へた}です。'], answer: ['サッカーが', '{上手|じょうず}です。'], ro: 'Sakkaa ga jouzu desu.' },
        { vi: 'Cô khen その傘、いいですね → "Cảm ơn cô. Em nhận của Park."', chips: ['ありがとうございます。', 'パクさんに', 'もらいました。', 'パクさんが', 'あげました。'], answer: ['ありがとうございます。', 'パクさんに', 'もらいました。'], ro: 'Arigatou gozaimasu. Paku-san ni moraimashita.' },
        { vi: 'Cô hỏi 誰がくれましたか → "Bố em tặng ạ."', chips: ['{父|ちち}が', 'くれました。', '{父|ちち}に', 'あげました。'], answer: ['{父|ちち}が', 'くれました。'], ro: 'Chichi ga kuremashita.' },
        { vi: 'Cô nói 友達がCDをくれました → "Vậy ạ. Tốt quá ạ."', chips: ['そうですか。', 'よかったですね。', '{残念|ざんねん}ですね。', 'すみません。'], answer: ['そうですか。', 'よかったですね。'], ro: 'Sou desu ka. Yokatta desu ne.' },
      ],
    },
  ],
};

