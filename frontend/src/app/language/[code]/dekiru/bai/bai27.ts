/**
 * Bài 27 — ニュース (Tin tức) · TIẾP SAU SÁCH, cấp N3 (xem ../SOAN-BAI.md mục 8). Bài thứ hai của chặng 26–30
 * (Bài 30 = kiểm tra chặng).
 * Người học đã xong Bài 1–15 (ポイント 1–124 — trong đó ～から "vì" (ポイント 47), N で "vì N" (ポイント 124)), Bài 16–24
 * (thể khả năng / ý chí, ば・なら・たら, cho–nhận, ～てしまう・～てみる, そう・ようだ・らしい — ～によると (nguồn tin, Bài 20),
 * ために・ように (mục đích, Bài 21), bị động + (người tạo ra) によって (Bài 22 ⑤), sai khiến, kính ngữ), Bài 25 (ôn N4) và
 * Bài 26 (～うちに, ～間・間に, ～最中に, ～たとたん). KHÔNG dạy lại — chỉ dùng lại trong câu (ghi "ôn: Bài X").
 *
 * Ngữ pháp (N3) — nhóm "NGUYÊN NHÂN – KẾT QUẢ – CÁCH THỨC": ① ～せいで／～せいだ "tại vì (kết quả xấu, đổ lỗi)" ·
 * ② ～せいか "có lẽ vì…" (+ 気のせい) · ③ ～おかげで／～おかげだ "nhờ (kết quả tốt, biết ơn)" (+ dùng mỉa mai) ·
 * ④ ～ため（に）／～ためだ chỉ NGUYÊN NHÂN (văn viết, thông báo, tin tức) — phân biệt với ために MỤC ĐÍCH (Bài 21 ①) ·
 * ⑤ ～によって／～により／～による N — nguyên nhân (tin tức) · ⑥ ～によって — phương tiện, cách thức · ⑦ ～によって・
 * ～によっては — tuỳ theo · ⑧ ～によって／～による N — tác nhân của bị động (ôn + mở rộng Bài 22 ⑤) ↔ ～によると (Bài 20) ·
 * ⑨ BẢNG PHÂN BIỆT せいで ↔ おかげで ↔ ため ↔ によって ↔ から／ので ↔ で (ポイント 124) + chỉ cần NHẬN RA: ～ばかりに (N2),
 * ～につき (N2, thông báo), ～ことから (N2).
 * Từ vựng: 65 từ (N3 là chính, một số N2/N1 có ghi cấp): tin tức & truyền thông, thời tiết & thiên tai, giao thông, xã hội
 * & kinh tế, nguyên nhân – cách thức – tuỳ theo — kèm bảng TỪ DỄ NHẦM (類義語) và KẾT HỢP TỪ (コロケーション). Từ đã học ở
 * Bài 1–26 (ニュース, 天気予報, 台風, 地震, 事故, 中止, 被害, 犯人, 理由, 結果, 方法, 情報, 発表する, 予想する, 雷, 番組,
 * 交通, 停電, 突然, 急に, 増える・減る, 輸出・輸入…) KHÔNG lặp lại.
 * Chữ Hán mới (20): 原 因 影 響 政 民 件 状 候 速 路 価 値 法 種 類 告 和 戦 争 (N3 theo các bảng tham khảo phổ biến; 影・響・価
 * có bảng xếp N2 — JLPT không công bố danh sách chữ chính thức) — không trùng hanTu.ts, hanTu16–26.ts, hanLop.ts và bảng
 * chữ Hán Bài 1–26. Thẻ chữ Hán: hanTu27.ts (HAN_TU_27).
 * Hội thoại, câu ví dụ, bài đọc, kịch bản nghe: VIẾT MỚI 100%, không chép giáo trình/đề thi nào.
 *
 * Nhân vật (giới tính quyết định giọng đọc, theo sách p.14): nữ = パク, ワン, アンナ, メアリー, マリヤム, 山口, 木村, リン, 鈴木,
 * {佐藤先生|さとうせんせい} (Bài 26) · nam = マルコ, ダニエル, ナタポン, カルロス, 西川, 本田先生, 小林店長.
 * Nối tiếp Bài 26: リン (năm nhất khoa Kinh tế trường {みなと大学|みなとだいがく}, ở {国際寮|こくさいりょう}), ダニエル (cùng giờ giảng),
 * カルロス (cùng lớp "Truyền thông và xã hội" của cô 佐藤), ナタポン (cao học, vẫn làm thêm ở ひまわり食堂 của anh 小林).
 * Hội thoại: role 'a'/'c' = giọng nữ, 'b'/'examiner' = giọng nam. Nghe: 'ja-nu' = nữ, 'ja-nam' = nam.
 * Người MỚI của bài này (chỉ ở phần nghe): アナウンサー (nữ — ja-nu; nam — ja-nam ở bài nghe 4), {駅員|えきいん} (nam — ja-nam),
 * {大学|だいがく}の{事務|じむ}の{人|ひと} (nữ — ja-nu).
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
  id: 'b27-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — ニュース: bản tin bão buổi sáng ở ký túc xá, sau giờ giảng "Truyền thông và xã hội", giá rau tăng ở ひまわり食堂',
  goal: 'Kể nguyên nhân của chuyện xấu bằng ～せいで (寝不足のせいで頭が痛い), đoán nguyên nhân không chắc bằng ～せいか (台風のせいか寒い), cảm ơn nguyên nhân tốt bằng ～おかげで (リンさんのおかげで助かった) và hiểu khi nó bị dùng mỉa mai; đọc – nghe bản tin, thông báo có ～ため (大雨のため運休), ～による (台風による被害); nói "bằng cách…" (SNSによって広がる), "tuỳ theo…" (国によって報道が違う, テーマによっては) và "do ai làm ra" (記者によって書かれた記事) — trong ký túc xá, ở giảng đường và ở chỗ làm thêm.',
  minutes: 55,
  blocks: [
    {
      t: 'recap',
      title: 'Bài 27 — chủ đề: tin tức, thời tiết, giao thông, xã hội (cấp N3)',
      items: [
        'Bài 26 học **khi nào** (thời điểm). Bài 27 học **vì sao** và **bằng cách nào**: "**tại** mưa nên trận đấu bị huỷ", "**có lẽ do** thời tiết mà thấy mệt", "**nhờ** bạn mà kịp giờ", "**do** bão, tàu ngừng chạy" (giọng bản tin), "**bằng** SNS", "**tuỳ** nước mà khác nhau", "**do** phóng viên viết".',
        'Mẫu N3 của bài: **～せいで／～せいだ** · **～せいか** · **～おかげで／～おかげだ** · **～ため（に）** (nguyên nhân) · **～によって／～による** (4 nghĩa: nguyên nhân · cách thức · tuỳ theo · tác nhân bị động) — và **bảng phân biệt** đề N3 rất hay hỏi: せいで ↔ おかげで ↔ ため ↔ から／ので.',
        'Ba tình huống: ① phòng sinh hoạt chung {国際寮|こくさいりょう} lúc 7 giờ sáng — リン và ダニエル xem bản tin bão · ② sau giờ giảng của cô {佐藤|さとう} — so sánh tin tức giữa các nước · ③ quán ひまわり{食堂|しょくどう} — giá rau tăng, quán phải tăng giá.',
        'Mọi câu có furigana và romaji; bấm 🔊 để nghe từng câu rồi đọc to theo. Ở cấp N3, hãy thử **nghe trước một lần không nhìn chữ** — phần nghe của bài này là **bản tin thật sự**: câu dài, nhiều từ Hán.',
      ],
    },
    {
      t: 'note',
      title: 'Học xong bài 27 bạn làm được (できる)',
      items: [
        '**① {寮|りょう}で{朝|あさ}のニュース** — kể lại bản tin: **{大雨|おおあめ}のため、{電車|でんしゃ}が{運休|うんきゅう}するそうです** · **{台風|たいふう}による{被害|ひがい}** ; than chuyện xấu và đổ lỗi: **{寝不足|ねぶそく}のせいで、{頭|あたま}が{痛|いた}い** ; đoán nguyên nhân: **{台風|たいふう}のせいか、{寒|さむ}いですね** ; cảm ơn: **リンさんのおかげで{助|たす}かったよ**.',
        '**② {講義|こうぎ}のあとで** — nói về truyền thông: **{国|くに}によって{報道|ほうどう}の{仕方|しかた}が{違|ちが}う** · **SNSによって{情報|じょうほう}が{広|ひろ}がる** · **{記者|きしゃ}によって{書|か}かれた{記事|きじ}** · **テーマによっては{資料|しりょう}が{少|すく}ない**.',
        '**③ アルバイト** — giải thích nguyên nhân của tình hình buôn bán: **{天候|てんこう}が{悪|わる}かったため、{野菜|やさい}が{値上|ねあ}がりしている** · **お{客|きゃく}さんが{少|すく}ないのは{雨|あめ}のせいだ** · **{雑誌|ざっし}に{紹介|しょうかい}されたおかげだ** · **{曜日|ようび}によって{違|ちが}う** — và nhận ra câu nói đùa **ナタポンくんのおかげで**（＝ せいで）.',
        '**できる！** — trình bày 1 phút "Một tin tức gần đây khiến tôi chú ý": tin gì, **nguyên nhân** là gì (～ため・～によって・～せいで), **ảnh hưởng** ra sao, tin đó **tuỳ nước / tuỳ người** được nhìn khác nhau thế nào, và mình nghĩ gì.',
      ],
    },
    {
      t: 'table',
      caption: 'Bức tranh chung của bài — muốn nói gì, dùng mẫu nào',
      head: ['Bạn muốn nói…', 'Câu then chốt', 'Romaji', 'Mẫu'],
      rows: [
        ['TẠI … nên (chuyện xấu)', '{寝不足|ねぶそく}のせいで、{頭|あたま}が{痛|いた}いです。', 'Nebusoku no sei de, atama ga itai desu.', '① ～せいで'],
        ['CÓ LẼ VÌ … (không chắc)', '{台風|たいふう}のせいか、{今日|きょう}は{寒|さむ}いです。', 'Taifuu no sei ka, kyou wa samui desu.', '② ～せいか'],
        ['NHỜ … nên (chuyện tốt)', '{友達|ともだち}のおかげで、{間|ま}に{合|あ}いました。', 'Tomodachi no okage de, ma ni aimashita.', '③ ～おかげで'],
        ['DO … (giọng bản tin, thông báo)', '{大雨|おおあめ}のため、{電車|でんしゃ}が{止|と}まっています。', 'Ooame no tame, densha ga tomatte imasu.', '④ ～ため（に）'],
        ['DO … gây ra (tin tức, văn viết)', '{台風|たいふう}による{被害|ひがい}が{出|で}ています。', 'Taifuu ni yoru higai ga dete imasu.', '⑤ ～によって／～による'],
        ['BẰNG (cách / phương tiện)', 'SNSによって、{情報|じょうほう}が{広|ひろ}がります。', 'SNS ni yotte, jouhou ga hirogarimasu.', '⑥ ～によって'],
        ['TUỲ THEO … mà khác', '{国|くに}によって、{習慣|しゅうかん}が{違|ちが}います。', 'Kuni ni yotte, shuukan ga chigaimasu.', '⑦ ～によって'],
        ['DO AI làm ra (bị động)', 'この{記事|きじ}は{記者|きしゃ}によって{書|か}かれました。', 'Kono kiji wa kisha ni yotte kakaremashita.', '⑧ ～によって（受身）'],
      ],
    },

    /* ── ① 寮のラウンジ ── */
    { t: 'h', text: '① {寮|りょう}のラウンジで — "Tại tối qua gió to nên mình không ngủ được"' },
    {
      t: 'canh',
      anh: ['television', 'cyclone', 'cloud-with-rain', 'yawning-face', 'woman-student'],
      caption: '7 giờ sáng ở phòng sinh hoạt chung của ký túc xá quốc tế. Ti vi đang phát bản tin: một cơn bão đang tiến gần vùng Kanto. ダニエル vừa xuống, mắt thâm quầng. リン đã ngồi xem tin từ sớm.',
    },
    {
      t: 'p',
      text: 'Tình huống: **リン** kể lại bản tin bằng giọng thông báo — **{大雨|おおあめ}のため** tàu ngừng chạy (mẫu ④), giờ học buổi sáng được nghỉ. **ダニエル** than tối qua gió to **のせいで** (tại — mẫu ①) không ngủ được, đau đầu vì **{寝不足|ねぶそく}のせいで**. Trời bỗng lạnh — **{台風|たいふう}のせいか** (có lẽ tại bão — mẫu ②). リン đã mua đồ ăn sẵn từ hôm qua, **nhờ** マリヤム nhắc (**おかげです** — mẫu ③). Cuối cùng ti vi báo tin nhanh: **この{台風|たいふう}による{被害|ひがい}** (thiệt hại do cơn bão — mẫu ⑤) chưa được báo cáo.',
    },
    DL('Ở phòng sinh hoạt chung — "Tàu nghỉ chạy cả buổi sáng!"', [
      ['ダニエル', 'b', 'おはよう、リンさん。{朝|あさ}から{何|なん}のニュース？', 'Ohayou, Rin-san. Asa kara nan no nyuusu?', 'Chào Linh. Sáng ra đã xem tin gì thế?'],
      ['リン', 'c', 'おはようございます。{台風|たいふう}のニュースです。{台風|たいふう}が{近|ちか}づいているため、{関東|かんとう}に{大雨警報|おおあめけいほう}が{出|で}たそうです。', 'Ohayou gozaimasu. Taifuu no nyuusu desu. Taifuu ga chikazuite iru tame, Kantou ni ooame keihou ga deta sou desu.', 'Chào anh. Tin bão ạ. Nghe nói do bão đang đến gần nên vùng Kanto đã có cảnh báo mưa lớn.'],
      ['ダニエル', 'b', 'えっ、{本当|ほんとう}？じゃ、{電車|でんしゃ}は{動|うご}いてるの？', 'E, hontou? Ja, densha wa ugoiteru no?', 'Hả, thật à? Thế tàu có chạy không?'],
      ['リン', 'c', '{大雨|おおあめ}のため、{午前中|ごぜんちゅう}は{運休|うんきゅう}するって{言|い}っていました。{大学|だいがく}からもメールが{来|き}て、1{限|げん}と2{限|げん}は{休講|きゅうこう}だそうです。', 'Ooame no tame, gozenchuu wa unkyuu suru tte itte imashita. Daigaku kara mo meeru ga kite, ichigen to nigen wa kyuukou da sou desu.', 'Họ nói do mưa lớn nên cả buổi sáng tàu nghỉ chạy. Trường cũng gửi email, tiết 1 và tiết 2 được nghỉ ạ.'],
      ['ダニエル', 'b', 'やった！……あ、ごめん。{喜|よろこ}んじゃいけないね。', 'Yatta! …… A, gomen. Yorokonja ikenai ne.', 'Tuyệt! … À, xin lỗi. Không nên mừng mới phải.'],
      ['リン', 'c', 'ダニエルさん、なんだか{眠|ねむ}そうですね。', 'Danieru-san, nandaka nemusou desu ne.', 'Anh Daniel, trông anh có vẻ buồn ngủ nhỉ.'],
      ['ダニエル', 'b', 'うん。ゆうべ{風|かぜ}の{音|おと}がうるさかったせいで、{全然|ぜんぜん}{眠|ねむ}れなかったんだ。{寝不足|ねぶそく}のせいで、{頭|あたま}も{痛|いた}いし……。', 'Un. Yuube kaze no oto ga urusakatta sei de, zenzen nemurenakatta n da. Nebusoku no sei de, atama mo itai shi…….', 'Ừ. Tối qua tại tiếng gió ồn quá nên anh chẳng ngủ được tí nào. Thiếu ngủ nên đầu cũng đau…'],
      ['リン', 'c', '{大丈夫|だいじょうぶ}ですか。……それに、{今日|きょう}は{寒|さむ}いですね。{台風|たいふう}のせいか、{気温|きおん}が{急|きゅう}に{下|さ}がったみたいです。', 'Daijoubu desu ka. …… Sore ni, kyou wa samui desu ne. Taifuu no sei ka, kion ga kyuu ni sagatta mitai desu.', 'Anh có sao không? … Mà hôm nay lạnh anh nhỉ. Chắc tại bão hay sao mà nhiệt độ có vẻ tụt hẳn.'],
      ['ダニエル', 'b', '{本当|ほんとう}だ。{窓|まど}もずっと{揺|ゆ}れてる……。リンさん、{食|た}べ{物|もの}は{大丈夫|だいじょうぶ}？{台風|たいふう}の{日|ひ}は、コンビニも{閉|し}まるかもしれないよ。', 'Hontou da. Mado mo zutto yureteru……. Rin-san, tabemono wa daijoubu? Taifuu no hi wa, konbini mo shimaru kamo shirenai yo.', 'Thật này. Cửa sổ cũng rung suốt… Linh, đồ ăn có đủ không? Hôm bão có khi cửa hàng tiện lợi cũng đóng đấy.'],
      ['リン', 'c', '{昨日|きのう}のうちに{買|か}っておきました。マリヤムさんが「{天気予報|てんきよほう}をよく{見|み}てね」って{教|おし}えてくれたおかげです。', 'Kinou no uchi ni katte okimashita. Mariyamu-san ga "Tenki yohou o yoku mite ne" tte oshiete kureta okage desu.', 'Em mua sẵn từ hôm qua rồi ạ. Là nhờ chị Mariam đã dặn "Nhớ xem kỹ dự báo thời tiết nhé".'],
      ['ダニエル', 'b', 'さすが。{僕|ぼく}は{何|なに}も{買|か}ってない……。', 'Sasuga. Boku wa nani mo katte nai…….', 'Đúng là em. Anh thì chẳng mua gì cả…'],
      ['リン', 'c', 'じゃ、お{昼|ひる}は{一緒|いっしょ}に{食|た}べましょう。{多|おお}めに{作|つく}りますから。', 'Ja, ohiru wa issho ni tabemashou. Oome ni tsukurimasu kara.', 'Vậy trưa nay mình ăn cùng nhé. Em sẽ nấu nhiều một chút.'],
      ['ダニエル', 'b', 'ありがとう！リンさんのおかげで、{助|たす}かったよ。', 'Arigatou! Rin-san no okage de, tasukatta yo.', 'Cảm ơn em! Nhờ có em mà anh thoát nạn rồi.'],
      ['リン', 'c', 'あ、{速報|そくほう}です。「この{台風|たいふう}による{被害|ひがい}は、まだ{報告|ほうこく}されていません」……よかった。', 'A, sokuhou desu. "Kono taifuu ni yoru higai wa, mada houkoku sarete imasen" …… Yokatta.', 'A, tin nhanh kìa. "Hiện chưa có báo cáo nào về thiệt hại do cơn bão này"… May quá.'],
      ['ダニエル', 'b', 'このまま{被害|ひがい}が{出|で}ないといいね。', 'Kono mama higai ga denai to ii ne.', 'Mong là cứ thế này, không có thiệt hại gì.'],
    ]),
    {
      t: 'examples',
      items: [
        E('{台風|たいふう}が{近|ちか}づいているため、{大雨警報|おおあめけいほう}が{出|で}ました。', 'Taifuu ga chikazuite iru tame, ooame keihou ga demashita.', 'Do bão đang đến gần nên đã có cảnh báo mưa lớn. (④ — giọng bản tin)'),
        E('{大雨|おおあめ}のため、{午前中|ごぜんちゅう}は{電車|でんしゃ}が{運休|うんきゅう}します。', 'Ooame no tame, gozenchuu wa densha ga unkyuu shimasu.', 'Do mưa lớn, buổi sáng tàu ngừng chạy. (④ N の ため)'),
        E('{風|かぜ}の{音|おと}がうるさかったせいで、{眠|ねむ}れませんでした。', 'Kaze no oto ga urusakatta sei de, nemuremasen deshita.', 'Tại tiếng gió ồn quá nên tôi không ngủ được. (① イA ＋ せいで)'),
        E('{寝不足|ねぶそく}のせいで、{頭|あたま}が{痛|いた}いです。', 'Nebusoku no sei de, atama ga itai desu.', 'Tại thiếu ngủ nên tôi đau đầu. (① N の せいで)'),
        E('{台風|たいふう}のせいか、{気温|きおん}が{急|きゅう}に{下|さ}がりました。', 'Taifuu no sei ka, kion ga kyuu ni sagarimashita.', 'Có lẽ tại bão mà nhiệt độ tụt hẳn. (② せいか)'),
        E('マリヤムさんが{教|おし}えてくれたおかげです。', 'Mariyamu-san ga oshiete kureta okage desu.', 'Là nhờ chị Mariam đã chỉ cho. (③ ～おかげだ)'),
        E('リンさんのおかげで、{助|たす}かりました。', 'Rin-san no okage de, tasukarimashita.', 'Nhờ có Linh mà tôi thoát nạn. (③ N の おかげで)'),
        E('この{台風|たいふう}による{被害|ひがい}は、まだ{報告|ほうこく}されていません。', 'Kono taifuu ni yoru higai wa, mada houkoku sarete imasen.', 'Chưa có báo cáo về thiệt hại do cơn bão này. (⑤ による ＋ N)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ①',
      items: [
        '**{近|ちか}づいているため／{大雨|おおあめ}のため** — **～ため** ở đây là **nguyên nhân** ("do…, vì…"), không phải mục đích "để…" của Bài 21. Đây là giọng **bản tin, thông báo** — リン đang **thuật lại lời ti vi**, nên dùng ため. Nói chuyện bình thường với bạn thì dùng から／ので: {雨|あめ}だから、{電車|でんしゃ}が{止|と}まってるよ.',
        '**{風|かぜ}の{音|おと}がうるさかったせいで／{寝不足|ねぶそく}のせいで** — **～せいで** = "**tại** …" — vế sau là **chuyện xấu** (không ngủ được, đau đầu), người nói **đổ lỗi** cho nguyên nhân. Nối: **イA**（うるさかった）／**Nの**（{寝不足|ねぶそく}の）＋ せいで.',
        '**{台風|たいふう}のせいか、{気温|きおん}が{下|さ}がったみたい** — **～せいか** = "**có lẽ tại** … mà" — người nói **không chắc** đó là nguyên nhân thật. Hay đi với **～みたい／～ようだ／～気がする** ở cuối câu (ôn Bài 20).',
        '**{教|おし}えてくれたおかげです／リンさんのおかげで{助|たす}かった** — **～おかげ** = "**nhờ** …" — vế sau là **chuyện tốt**, người nói **biết ơn**. Rất hay đi với **～てくれた**（ôn Bài 18）: **～てくれたおかげで**. Câu kết **～のは～おかげです** / **～おかげです** để giải thích lý do của điều tốt.',
        '**この{台風|たいふう}による{被害|ひがい}** — **N1 による N2** = "N2 do N1 gây ra" — dạng bổ nghĩa danh từ của **によって** (nguyên nhân, mẫu ⑤). Gần như chỉ gặp trong **tin tức, văn viết**: {地震|じしん}による{被害|ひがい}, {事故|じこ}による{渋滞|じゅうたい}.',
        '**{近|ちか}づく** (đến gần — N3) · **{大雨警報|おおあめけいほう}が{出|で}る** (có cảnh báo mưa lớn) · **{運休|うんきゅう}する** (tàu xe ngừng chạy) · **1{限|げん}・2{限|げん}** (tiết 1, tiết 2 ở đại học — {限|げん} đếm tiết học) · **{休講|きゅうこう}** (Bài 26) · **{喜|よろこ}んじゃいけない** = {喜|よろこ}んではいけない (văn nói) · **{揺|ゆ}れてる** = {揺|ゆ}れている · **{速報|そくほう}** (tin nhanh) · **{報告|ほうこく}される** (được báo cáo — bị động, ôn Bài 22) · **{昨日|きのう}のうちに** (ngay trong hôm qua — ôn Bài 26) · **{多|おお}めに** (nhiều hơn một chút).',
      ],
    },

    /* ── ② 講義のあとで ── */
    { t: 'h', text: '② {講義|こうぎ}のあとで — "Cùng một vụ việc, mỗi nước đưa tin một kiểu"' },
    {
      t: 'canh',
      anh: ['woman-teacher', 'rolled-up-newspaper', 'mobile-phone', 'man-student', 'woman-student'],
      caption: 'Cuối giờ giảng "Truyền thông và xã hội" ({メディアと社会|メディアとしゃかい}) của cô 佐藤. Trên bàn cô là mấy tờ báo về một trận động đất. Cô hỏi ý kiến カルロス và リン về cách mỗi nước đưa tin.',
    },
    {
      t: 'p',
      text: 'Tình huống: cô **{佐藤|さとう}** tóm tắt bài giảng: cùng một vụ việc, **{国|くに}によって** (tuỳ nước — mẫu ⑦) cách đưa tin khác nhau. **カルロス** kể ở nước anh tin tức lan **SNSによって** (bằng SNS — mẫu ⑥); **リン** nói thông tin trên SNS **{人|ひと}によって** khác nhau. Cô đưa ra một bài báo **{記者|きしゃ}によって{書|か}かれた** (do phóng viên viết — mẫu ⑧) có ảnh về **{地震|じしん}による{被害|ひがい}** (mẫu ⑤), rồi giao bài báo cáo — **テーマによっては** (tuỳ đề tài thì) tài liệu ít.',
    },
    DL('Sau giờ giảng — "Tin trên SNS thì tuỳ người viết"', [
      ['{佐藤先生|さとうせんせい}', 'a', '{今日|きょう}の{講義|こうぎ}では、{同|おな}じ{事件|じけん}でも、{国|くに}によって{報道|ほうどう}の{仕方|しかた}が{違|ちが}うという{話|はなし}をしました。カルロスさん、どう{思|おも}いましたか。', 'Kyou no kougi de wa, onaji jiken demo, kuni ni yotte houdou no shikata ga chigau to iu hanashi o shimashita. Karurosu-san, dou omoimashita ka.', 'Giờ giảng hôm nay tôi đã nói rằng cùng một vụ việc nhưng tuỳ nước mà cách đưa tin khác nhau. Carlos, em nghĩ thế nào?'],
      ['カルロス', 'b', 'はい。{僕|ぼく}の{国|くに}では、{大|おお}きな{事件|じけん}のニュースは、テレビよりSNSによって{広|ひろ}がることが{多|おお}いです。', 'Hai. Boku no kuni de wa, ookina jiken no nyuusu wa, terebi yori SNS ni yotte hirogaru koto ga ooi desu.', 'Dạ. Ở nước em, tin về các vụ việc lớn thường lan đi bằng SNS nhiều hơn là bằng ti vi.'],
      ['{佐藤先生|さとうせんせい}', 'a', 'なるほど。リンさんの{国|くに}はどうですか。', 'Naruhodo. Rin-san no kuni wa dou desu ka.', 'Ra vậy. Còn nước của Linh thì sao?'],
      ['リン', 'c', 'ベトナムでも{同|おな}じです。でも、SNSの{情報|じょうほう}は{書|か}く{人|ひと}によって{内容|ないよう}が{違|ちが}うので、どれが{本当|ほんとう}か{分|わ}からないことがあります。', 'Betonamu demo onaji desu. Demo, SNS no jouhou wa kaku hito ni yotte naiyou ga chigau node, dore ga hontou ka wakaranai koto ga arimasu.', 'Ở Việt Nam cũng vậy ạ. Nhưng thông tin trên SNS tuỳ người viết mà nội dung khác nhau, nên có lúc không biết cái nào là thật.'],
      ['{佐藤先生|さとうせんせい}', 'a', 'そうですね。だから、{記者|きしゃ}の{仕事|しごと}が{大切|たいせつ}なんです。この{記事|きじ}を{見|み}てください。{被害|ひがい}を{受|う}けた{町|まち}に{実際|じっさい}に{行|い}った{記者|きしゃ}によって{書|か}かれたものです。', 'Sou desu ne. Dakara, kisha no shigoto ga taisetsu na n desu. Kono kiji o mite kudasai. Higai o uketa machi ni jissai ni itta kisha ni yotte kakareta mono desu.', 'Đúng vậy. Chính vì thế công việc của phóng viên mới quan trọng. Các em xem bài báo này. Nó được viết bởi một phóng viên đã đến tận thị trấn bị thiệt hại.'],
      ['カルロス', 'b', '{写真|しゃしん}もたくさんありますね。{地震|じしん}による{被害|ひがい}が、よく{分|わ}かります。', 'Shashin mo takusan arimasu ne. Jishin ni yoru higai ga, yoku wakarimasu.', 'Có nhiều ảnh nữa ạ. Nhìn là thấy rõ thiệt hại do động đất.'],
      ['{佐藤先生|さとうせんせい}', 'a', 'ええ。{同|おな}じ{情報|じょうほう}でも、どんな{手段|しゅだん}で{伝|つた}えるかによって、{受|う}け{取|と}る{人|ひと}の{気持|きも}ちも{変|か}わります。', 'Ee. Onaji jouhou demo, donna shudan de tsutaeru ka ni yotte, uketoru hito no kimochi mo kawarimasu.', 'Phải. Cùng một thông tin, nhưng tuỳ việc truyền đi bằng phương tiện nào mà cảm nhận của người nhận cũng thay đổi.'],
      ['{佐藤先生|さとうせんせい}', 'a', 'では、{来週|らいしゅう}までに、{二|ふた}つの{国|くに}のニュースを{比|くら}べて、レポートを{書|か}いてきてください。', 'Dewa, raishuu made ni, futatsu no kuni no nyuusu o kurabete, repooto o kaite kite kudasai.', 'Vậy trước tuần sau, các em hãy so sánh tin tức của hai nước rồi viết báo cáo nộp nhé.'],
      ['リン', 'c', '{先生|せんせい}、ニュースの{種類|しゅるい}は{何|なん}でもいいですか。', 'Sensei, nyuusu no shurui wa nan demo ii desu ka.', 'Thưa cô, loại tin tức nào cũng được ạ?'],
      ['{佐藤先生|さとうせんせい}', 'a', '{政治|せいじ}、{経済|けいざい}、{環境|かんきょう}……{何|なん}でもいいですよ。ただ、テーマによっては{資料|しりょう}が{少|すく}ないので、{早|はや}めに{決|き}めてくださいね。', 'Seiji, keizai, kankyou…… nan demo ii desu yo. Tada, teema ni yotte wa shiryou ga sukunai node, hayame ni kimete kudasai ne.', 'Chính trị, kinh tế, môi trường… gì cũng được. Có điều tuỳ đề tài thì tài liệu sẽ ít, nên các em quyết định sớm nhé.'],
      ['カルロス', 'b', '{分|わ}かりました。……リンさん、{一緒|いっしょ}に{図書館|としょかん}で{新聞|しんぶん}を{探|さが}そうか。', 'Wakarimashita. …… Rin-san, issho ni toshokan de shinbun o sagasou ka.', 'Em hiểu rồi ạ. … Linh, mình cùng ra thư viện tìm báo nhé?'],
      ['リン', 'c', 'いいですね。{図書館|としょかん}は{曜日|ようび}によって{閉|し}まる{時間|じかん}が{違|ちが}うので、{今日|きょう}{行|い}きましょう。', 'Ii desu ne. Toshokan wa youbi ni yotte shimaru jikan ga chigau node, kyou ikimashou.', 'Hay đấy. Thư viện tuỳ thứ mà giờ đóng cửa khác nhau, nên mình đi ngay hôm nay đi.'],
      ['カルロス', 'b', 'オーケー。{佐藤先生|さとうせんせい}のおかげで、ニュースの{見方|みかた}がちょっと{変|か}わったよ。', 'Ookee. Satou-sensei no okage de, nyuusu no mikata ga chotto kawatta yo.', 'OK. Nhờ cô Sato mà cách mình xem tin tức thay đổi một chút đấy.'],
    ]),
    {
      t: 'examples',
      items: [
        E('{国|くに}によって、{報道|ほうどう}の{仕方|しかた}が{違|ちが}います。', 'Kuni ni yotte, houdou no shikata ga chigaimasu.', 'Tuỳ nước mà cách đưa tin khác nhau. (⑦)'),
        E('ニュースは、SNSによって{広|ひろ}がることが{多|おお}いです。', 'Nyuusu wa, SNS ni yotte hirogaru koto ga ooi desu.', 'Tin tức thường lan đi bằng SNS. (⑥)'),
        E('SNSの{情報|じょうほう}は、{書|か}く{人|ひと}によって{内容|ないよう}が{違|ちが}います。', 'SNS no jouhou wa, kaku hito ni yotte naiyou ga chigaimasu.', 'Thông tin trên SNS tuỳ người viết mà nội dung khác nhau. (⑦)'),
        E('これは、{記者|きしゃ}によって{書|か}かれた{記事|きじ}です。', 'Kore wa, kisha ni yotte kakareta kiji desu.', 'Đây là bài báo do phóng viên viết. (⑧)'),
        E('{地震|じしん}による{被害|ひがい}が、よく{分|わ}かります。', 'Jishin ni yoru higai ga, yoku wakarimasu.', 'Thấy rõ thiệt hại do động đất. (⑤)'),
        E('どんな{手段|しゅだん}で{伝|つた}えるかによって、{気持|きも}ちが{変|か}わります。', 'Donna shudan de tsutaeru ka ni yotte, kimochi ga kawarimasu.', 'Tuỳ truyền đi bằng phương tiện nào mà cảm nhận thay đổi. (⑦ + câu hỏi lồng)'),
        E('テーマによっては、{資料|しりょう}が{少|すく}ないです。', 'Teema ni yotte wa, shiryou ga sukunai desu.', 'Tuỳ đề tài thì có cái ít tài liệu. (⑦ によっては)'),
        E('{先生|せんせい}のおかげで、ニュースの{見方|みかた}が{変|か}わりました。', 'Sensei no okage de, nyuusu no mikata ga kawarimashita.', 'Nhờ cô mà cách xem tin tức của tôi thay đổi. (③)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ②',
      items: [
        '**{国|くに}によって{報道|ほうどう}の{仕方|しかた}が{違|ちが}う／{書|か}く{人|ひと}によって{内容|ないよう}が{違|ちが}う** — **N ＋ によって ＋ {違|ちが}う／{異|こと}なる／さまざまだ／{変|か}わる** = "**tuỳ** N mà **khác nhau**" (mẫu ⑦). Vế sau **luôn là sự khác biệt / thay đổi** — đây là dấu hiệu nhận ra nghĩa "tuỳ theo".',
        '**SNSによって{広|ひろ}がる** — **N ＋ によって** = "**bằng**, **thông qua** N" (mẫu ⑥) — văn viết, trang trọng hơn **で** (ポイント 124 và で chỉ phương tiện). Nói bình thường: SNSで{広|ひろ}がる.',
        '**{記者|きしゃ}によって{書|か}かれた** — **(người) によって ＋ V bị động** = "**do** (ai) làm ra" (mẫu ⑧ — ôn Bài 22 ⑤: {電話|でんわ}はベルによって{発明|はつめい}された). Dùng khi nói **ai tạo ra / viết / xây / phát hiện** một thứ.',
        '**{地震|じしん}による{被害|ひがい}** — **N1 による N2** (mẫu ⑤): "N2 do N1 gây ra". ⚠ Đừng nhầm với **～によると** (Bài 20) = "**theo** (nguồn tin)": ニュースによると、{明日|あした}は{雪|ゆき}だそうです.',
        '**どんな{手段|しゅだん}で{伝|つた}えるかによって** — **câu hỏi lồng（～か）＋ によって** = "tuỳ vào việc …" (ôn câu hỏi lồng — Bài 24). Rất hay gặp trong văn viết N3: {何|なに}を{選|えら}ぶかによって, いつ{行|い}くかによって.',
        '**テーマによっては** — **～によっては** = "**tuỳ** … **thì cũng có** (trường hợp)…" — chỉ ra **một số** trường hợp đặc biệt, không phải tất cả. **ただ** = "có điều là" (N3) · **{早|はや}めに** = sớm hơn một chút · **{見方|みかた}** = cách nhìn · **{受|う}け{取|と}る** = tiếp nhận · **{内容|ないよう}** = nội dung (N3) · **{資料|しりょう}** = tài liệu (Bài 26).',
      ],
    },

    /* ── ③ ひまわり食堂 ── */
    { t: 'h', text: '③ ひまわり{食堂|しょくどう} — "Rau tăng giá là do thời tiết xấu"' },
    {
      t: 'canh',
      anh: ['man-cook', 'leafy-green', 'chart-increasing', 'umbrella-with-rain-drops', 'broken-heart'],
      caption: 'Giờ nghỉ chiều ở quán ひまわり食堂. Ngoài trời mưa dầm — đang mùa mưa. Anh 小林 cầm tờ hoá đơn mua rau, nhăn mặt. ナタポン và リン đang lau bát đĩa.',
    },
    {
      t: 'p',
      text: 'Tình huống: anh **小林** báo sẽ tăng giá bữa trưa — vì **{天候|てんこう}が{悪|わる}かったため** (do thời tiết xấu — mẫu ④) rau tăng giá. **ナタポン** nghĩ khách giảm **{物価|ぶっか}が{上|あ}がっているせいで** (mẫu ①); anh chủ cho rằng **{雨|あめ}のせいだ**. Cuối tuần vẫn đông khách là **{雑誌|ざっし}に{紹介|しょうかい}されたおかげ** (mẫu ③). Khách **{曜日|ようび}によって** đông vắng khác nhau (mẫu ⑦). Rồi ナタポン làm vỡ đĩa — anh chủ nói đùa **ナタポンくんのおかげで** (おかげ dùng **mỉa mai**).',
    },
    DL('Ở quán ひまわり食堂 — "Lại phải tăng giá rồi…"', [
      ['{小林店長|こばやしてんちょう}', 'examiner', '{二人|ふたり}とも、ちょっと{聞|き}いて。{来月|らいげつ}から、ランチの{値段|ねだん}を{少|すこ}し{上|あ}げることにしたんだ。', 'Futari tomo, chotto kiite. Raigetsu kara, ranchi no nedan o sukoshi ageru koto ni shita n da.', 'Hai đứa nghe anh nói chút. Anh quyết định từ tháng sau sẽ tăng giá bữa trưa một chút.'],
      ['リン', 'c', 'えっ、どうしてですか。', 'E, doushite desu ka.', 'Hả, sao vậy ạ?'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'ニュースでも{言|い}っているけど、{今年|ことし}は{天候|てんこう}が{悪|わる}かったため、{野菜|やさい}がすごく{値上|ねあ}がりしているんだよ。キャベツなんて、{去年|きょねん}の{倍|ばい}だ。', 'Nyuusu demo itte iru kedo, kotoshi wa tenkou ga warukatta tame, yasai ga sugoku neagari shite iru n da yo. Kyabetsu nante, kyonen no bai da.', 'Tin tức cũng nói rồi đấy, năm nay do thời tiết xấu nên rau tăng giá ghê lắm. Bắp cải thì đắt gấp đôi năm ngoái.'],
      ['ナタポン', 'b', '{物価|ぶっか}が{上|あ}がっているせいで、うちのお{客|きゃく}さんも{少|すこ}し{減|へ}りましたよね。', 'Bukka ga agatte iru sei de, uchi no okyaku-san mo sukoshi herimashita yo ne.', 'Tại vật giá tăng nên khách quán mình cũng giảm đi một chút anh nhỉ.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'いや、お{客|きゃく}さんが{少|すく}ないのは、{毎日|まいにち}{雨|あめ}が{降|ふ}っているせいだと{思|おも}うよ。{梅雨|つゆ}の{間|あいだ}は、いつもこうなんだ。', 'Iya, okyaku-san ga sukunai no wa, mainichi ame ga futte iru sei da to omou yo. Tsuyu no aida wa, itsumo kou na n da.', 'Không, anh nghĩ khách ít là tại ngày nào cũng mưa. Suốt mùa mưa lúc nào cũng thế này.'],
      ['リン', 'c', 'でも、{週末|しゅうまつ}はいつも{満席|まんせき}ですよ。', 'Demo, shuumatsu wa itsumo manseki desu yo.', 'Nhưng cuối tuần lúc nào cũng kín chỗ mà anh.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'それは、{去年|きょねん}{雑誌|ざっし}に{紹介|しょうかい}されたおかげだね。{遠|とお}くから{来|き}てくれる{人|ひと}もいるし。', 'Sore wa, kyonen zasshi ni shoukai sareta okage da ne. Tooku kara kite kureru hito mo iru shi.', 'Đó là nhờ năm ngoái quán được lên tạp chí đấy. Có cả người từ xa đến nữa.'],
      ['ナタポン', 'b', 'お{客|きゃく}さんの{数|かず}は、{曜日|ようび}によってずいぶん{違|ちが}いますね。{月曜日|げつようび}は{少|すく}ないし、{土曜日|どようび}は{行列|ぎょうれつ}ができるし。', 'Okyaku-san no kazu wa, youbi ni yotte zuibun chigaimasu ne. Getsuyoubi wa sukunai shi, doyoubi wa gyouretsu ga dekiru shi.', 'Số khách tuỳ thứ mà khác nhau ghê anh nhỉ. Thứ Hai thì vắng, thứ Bảy thì khách xếp hàng.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'そうなんだ。だから、{曜日|ようび}によってアルバイトの{人数|にんずう}を{変|か}えているんだよ。', 'Sou na n da. Dakara, youbi ni yotte arubaito no ninzuu o kaete iru n da yo.', 'Đúng thế. Nên anh mới thay đổi số người làm thêm tuỳ theo thứ trong tuần.'],
      ['リン', 'c', '{店長|てんちょう}、{値段|ねだん}を{上|あ}げると、お{客|きゃく}さんが{来|こ}なくなりませんか。', 'Tenchou, nedan o ageru to, okyaku-san ga konaku narimasen ka.', 'Anh ơi, tăng giá thì khách có thôi không đến nữa không ạ?'],
      ['{小林店長|こばやしてんちょう}', 'examiner', '{心配|しんぱい}だけど、{材料|ざいりょう}の{質|しつ}は{下|さ}げたくないからね。……あっ、ナタポンくん、そのお{皿|さら}、{気|き}をつけて！', 'Shinpai da kedo, zairyou no shitsu wa sagetaku nai kara ne. …… A, Natapon-kun, sono osara, ki o tsukete!', 'Lo thì có lo, nhưng anh không muốn hạ chất lượng nguyên liệu. … Á, Nattapon, cái đĩa kia, cẩn thận!'],
      ['ナタポン', 'b', 'あっ！……すみません、{割|わ}っちゃいました。', 'A! …… Sumimasen, wacchaimashita.', 'Á! … Em xin lỗi, em làm vỡ mất rồi.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', '……ナタポンくんのおかげで、{今月|こんげつ}はお{皿|さら}{代|だい}も{高|たか}くなりそうだよ。', '…… Natapon-kun no okage de, kongetsu wa osara dai mo takaku narisou da yo.', '… "Nhờ" cậu Nattapon mà tháng này chắc tiền đĩa cũng tăng luôn đấy.'],
      ['リン', 'c', 'ふふ。{店長|てんちょう}、それは「おかげ」じゃなくて「せい」ですよ。', 'Fufu. Tenchou, sore wa "okage" ja nakute "sei" desu yo.', 'Hihi. Anh ơi, cái đó phải là "tại" chứ không phải "nhờ" ạ.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', '{分|わ}かってる、{分|わ}かってる。わざとそう{言|い}ったんだよ。', 'Wakatteru, wakatteru. Waza to sou itta n da yo.', 'Biết rồi, biết rồi. Anh cố tình nói thế đấy.'],
    ]),
    {
      t: 'examples',
      items: [
        E('{天候|てんこう}が{悪|わる}かったため、{野菜|やさい}が{値上|ねあ}がりしています。', 'Tenkou ga warukatta tame, yasai ga neagari shite imasu.', 'Do thời tiết xấu nên rau đang tăng giá. (④ イAかった ＋ ため)'),
        E('{物価|ぶっか}が{上|あ}がっているせいで、お{客|きゃく}さんが{減|へ}りました。', 'Bukka ga agatte iru sei de, okyaku-san ga herimashita.', 'Tại vật giá tăng nên khách giảm. (① Vている ＋ せいで)'),
        E('お{客|きゃく}さんが{少|すく}ないのは、{雨|あめ}のせいです。', 'Okyaku-san ga sukunai no wa, ame no sei desu.', 'Khách ít là tại mưa. (① ～のは～せいだ)'),
        E('{雑誌|ざっし}に{紹介|しょうかい}されたおかげで、{遠|とお}くからもお{客|きゃく}さんが{来|き}ます。', 'Zasshi ni shoukai sareta okage de, tooku kara mo okyaku-san ga kimasu.', 'Nhờ được giới thiệu trên tạp chí mà khách đến cả từ xa. (③)'),
        E('お{客|きゃく}さんの{数|かず}は、{曜日|ようび}によって{違|ちが}います。', 'Okyaku-san no kazu wa, youbi ni yotte chigaimasu.', 'Số khách tuỳ thứ mà khác nhau. (⑦)'),
        E('{曜日|ようび}によって、アルバイトの{人数|にんずう}を{変|か}えています。', 'Youbi ni yotte, arubaito no ninzuu o kaete imasu.', 'Tuỳ thứ mà thay đổi số người làm thêm. (⑦ + vế sau là hành động thay đổi)'),
        E('ナタポンくんのおかげで、お{皿|さら}{代|だい}が{高|たか}くなりそうだ。', 'Natapon-kun no okage de, osara dai ga takaku narisou da.', '"Nhờ" Nattapon mà tiền đĩa sắp tăng. (③ — mỉa mai)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ③',
      items: [
        '**{天候|てんこう}が{悪|わる}かったため** — **イAかった ＋ ため** (nguyên nhân, mẫu ④): ở đây anh chủ đang **nhắc lại nội dung bản tin** ("ニュースでも{言|い}っているけど") nên dùng ため — giọng khách quan, giải thích. **{天候|てんこう}** = thời tiết trong **một khoảng thời gian** (cả mùa, cả năm) — khác {天気|てんき} (thời tiết hôm nay).',
        '**{上|あ}がっているせいで** ↔ **{雨|あめ}が{降|ふ}っているせいだ** — せいで ở giữa câu, **せいだ** ở cuối câu (dạng **AのはBのせいだ** = "A là tại B"). Cả hai đều có ý **đổ lỗi** cho nguyên nhân của chuyện xấu (khách giảm).',
        '**{紹介|しょうかい}されたおかげだ** — chuyện TỐT (khách đông) → **おかげ**. Bị động {紹介|しょうかい}された (được giới thiệu — ôn Bài 22). Câu **それは～おかげだ** = "đó là nhờ…".',
        '**{曜日|ようび}によって{違|ちが}う** ↔ **{曜日|ようび}によって{人数|にんずう}を{変|か}える** — mẫu ⑦: vế sau là **khác nhau** hoặc **thay đổi theo** (変える, {決|き}める, {選|えら}ぶ). Câu thứ hai cho thấy vế sau có thể là **hành động của người nói** — miễn là hành động đó **thay đổi theo** N.',
        '**ナタポンくんのおかげで、お{皿|さら}{代|だい}も{高|たか}くなりそうだ** — おかげで + **chuyện XẤU** = **mỉa mai**, trêu chọc ("nhờ ơn cậu mà…"). Đề N3 có khi hỏi đúng câu này: hiểu là **trách nhẹ**, nghĩa thật = せいで. ⚠ Khi viết / nói nghiêm túc, đừng tự dùng kiểu này với người trên.',
        '**{値上|ねあ}がりする** (giá tăng — tự động) ↔ **{値段|ねだん}を{上|あ}げる／{値上|ねあ}げする** (tăng giá — người bán làm) · **{倍|ばい}** (gấp đôi) · **～なんて** (như là… — nhấn mạnh, văn nói) · **{満席|まんせき}** (kín chỗ — N3) · **{行列|ぎょうれつ}ができる** (có hàng người xếp — N3) · **{人数|にんずう}** (số người) · **{質|しつ}** (chất lượng — Bài 16 chữ 質) · **{割|わ}っちゃった** = {割|わ}ってしまった (Bài 19) · **わざと** (cố ý — Bài 19) · **～ことにした** (quyết định — Bài 21).',
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b27-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 65 từ N3: tin tức & truyền thông, thời tiết & thiên tai, giao thông, xã hội & kinh tế, nguyên nhân – cách thức – tuỳ theo',
  goal: 'Thuộc 65 từ của bản tin: tin tức & truyền thông (報道・速報・記者・放送・アナウンサー・事件・発生・状況・原因・影響・調査・記録・全国・各地), thời tiết & thiên tai (大雨・大雪・気温・天候・気候・梅雨・警報・津波・避難・災害・揺れる・激しい), giao thông (渋滞・列車・乗客・道路・線路・通行止め・運休・遅延・再開・交通機関・混乱・見合わせる), xã hội & kinh tế (社会・政治・政府・国民・住民・物価・値上がり・景気・税金・少子化・高齢化・環境・平和・戦争), nguyên nhân – cách thức – tuỳ theo (起こる・防ぐ・種類・手段・地域・異なる・さまざま・責任・支える・感謝・寝不足・延期・気のせい) — phân biệt được các cặp dễ nhầm (原因・理由, 事件・事故, 天気・天候・気候, 延期・中止・運休, 遅延・渋滞, 混乱・混雑, 国民・市民・住民, 値上がり・値上げ, 手段・方法, 異なる・違う…) và nói thành cụm (影響を受ける, 警報が出る, 運転を再開する, 物価が上がる, 責任を取る, 事故を防ぐ, 人のせいにする).',
  minutes: 60,
  blocks: [
    {
      t: 'p',
      text: '**65 từ** chia 5 nhóm theo đúng các loại tin của bài: **A** tin tức & truyền thông (14) · **B** thời tiết & thiên tai (12) · **C** giao thông (12) · **D** xã hội & kinh tế (14) · **E** nguyên nhân – cách thức – tuỳ theo (13). Từ cấp **N3** chiếm phần lớn; từ N2/N1 hay gặp trên bản tin, bảng thông báo ở ga có ghi cấp ở dòng "more" — chỉ cần **nhận ra** khi đọc / nghe. Từ đã học ở Bài 1–26 (ニュース, {天気予報|てんきよほう}, {台風|たいふう}, {地震|じしん}, {事故|じこ}, {中止|ちゅうし}, {被害|ひがい}, {犯人|はんにん}, {理由|りゆう}, {結果|けっか}, {方法|ほうほう}, {情報|じょうほう}, {発表|はっぴょう}する, {予想|よそう}する, {雷|かみなり}, {番組|ばんぐみ}, {交通|こうつう}, {停電|ていでん}, {突然|とつぜん}, {増|ふ}える・{減|へ}る, {輸出|ゆしゅつ}・{輸入|ゆにゅう}…) KHÔNG lặp lại — gặp trong câu là ôn.',
    },
    {
      t: 'note',
      title: 'Cách học 65 từ N3 trong 4 ngày',
      items: [
        '**Ngày 1** — nhóm A (14 từ): đọc to theo 🔊, che nghĩa tự nói. Rồi mở một bản tin NHK ngắn (NHK NEWS WEB EASY) và **gạch dưới** mọi từ của nhóm A gặp được — bạn sẽ thấy {原因|げんいん}, {影響|えいきょう}, {発生|はっせい}する xuất hiện gần như mỗi tin.',
        '**Ngày 2** — nhóm B + C (24 từ): đây là từ của **bản tin thời tiết** và **thông báo ở ga**. Học thành cụm của bảng コロケーション cuối mục: {警報|けいほう}が{出|で}る, {運転|うんてん}を{再開|さいかい}する, {通行止|つうこうど}めになる. Chú ý các cách đọc đặc biệt: {梅雨|つゆ}, {大雨|おおあめ}, {大雪|おおゆき}.',
        '**Ngày 3** — nhóm D + E (27 từ): nhóm E là từ **đi với mẫu ngữ pháp** của bài — học kèm luôn: {地域|ちいき}**によって**{異|こと}なる, {人|ひと}**のせいにする**, {家族|かぞく}が{支|ささ}えてくれた**おかげで**, {寝不足|ねぶそく}**のせいか**. Đặt 1 câu cho mỗi từ về tin tức nước bạn.',
        '**Ngày 4** — thẻ hình + bảng **Từ dễ nhầm (類義語)** + bảng **Kết hợp từ (コロケーション)** + trắc nghiệm cuối mục (dạng 文脈規定・言い換え類義・用法 của đề N3) + viết tay 10 từ.',
        'Romaji: trường âm viết đôi ({報道|ほうどう} → **houdou**, {状況|じょうきょう} → **joukyou**, {渋滞|じゅうたい} → **juutai**, {乗客|じょうきゃく} → **joukyaku**); âm ngắt ({物価|ぶっか} → bu**kk**a, {列車|れっしゃ} → re**ss**ha, {発生|はっせい} → ha**ss**ei); ん trước nguyên âm thêm dấu nháy ({原因|げんいん} → **gen\'in**).',
      ],
    },

    /* ── A ── */
    { t: 'h', text: 'A. Tin tức & truyền thông (14 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{報道|ほうどう}します［{報道|ほうどう}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'houdou shimasu [houdou suru]', vi: 'đưa tin (báo chí, truyền hình)', ex: 'その{事件|じけん}は、{世界中|せかいじゅう}で{報道|ほうどう}されました。', exRo: 'Sono jiken wa, sekaijuu de houdou saremashita.', exVi: 'Vụ việc đó đã được đưa tin khắp thế giới.', more: '**ニュースで{報道|ほうどう}される** (thường ở bị động — ôn Bài 22) · {報道番組|ほうどうばんぐみ} (chương trình thời sự) · ≈ {伝|つた}える (Bài 20 — truyền đạt, nghĩa rộng hơn). N3–N2.' },
        { w: '{速報|そくほう}', pos: 'danh từ', ipa: 'sokuhou', vi: 'tin nhanh, tin khẩn', ex: '{地震|じしん}の{速報|そくほう}が{流|なが}れたとたん、みんながスマホを{見|み}ました。', exRo: 'Jishin no sokuhou ga nagareta totan, minna ga sumaho o mimashita.', exVi: 'Tin nhanh về động đất vừa phát ra là mọi người cùng nhìn điện thoại.', more: '**ニュース{速報|そくほう}** (dòng chữ chạy trên TV) · **{速報|そくほう}が{入|はい}る／{流|なが}れる** · {速|そく} (nhanh) + {報|ほう} (báo). Ví dụ ôn ～たとたん (Bài 26). N2.' },
        { w: '{記者|きしゃ}', pos: 'danh từ', ipa: 'kisha', vi: 'phóng viên, nhà báo', ex: 'この{記事|きじ}は、{若|わか}い{記者|きしゃ}によって{書|か}かれました。', exRo: 'Kono kiji wa, wakai kisha ni yotte kakaremashita.', exVi: 'Bài báo này do một phóng viên trẻ viết.', more: '{新聞記者|しんぶんきしゃ} · {記者会見|きしゃかいけん} (họp báo — N2) · {記事|きじ} (bài báo) — cùng chữ 記 (ghi). Ví dụ là mẫu ⑧ (tác nhân bị động). N3.' },
        { w: '{放送|ほうそう}します［{放送|ほうそう}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'housou shimasu [housou suru]', vi: 'phát sóng (TV, radio, loa)', ex: '{台風|たいふう}のため、その{番組|ばんぐみ}の{放送|ほうそう}は{中止|ちゅうし}になりました。', exRo: 'Taifuu no tame, sono bangumi no housou wa chuushi ni narimashita.', exVi: 'Do bão, chương trình đó bị huỷ phát sóng.', more: '**テレビで{放送|ほうそう}する** · **{生放送|なまほうそう}** (truyền hình trực tiếp) · {館内放送|かんないほうそう} (loa thông báo trong toà nhà) · ⚠ ほうそう — trùng âm với {包装|ほうそう} (gói hàng). N3.' },
        { w: 'アナウンサー', pos: 'danh từ', ipa: 'anaunsaa', vi: 'phát thanh viên, người dẫn bản tin', ex: 'アナウンサーは、{落|お}ち{着|つ}いた{声|こえ}で{地震|じしん}のニュースを{伝|つた}えました。', exRo: 'Anaunsaa wa, ochitsuita koe de jishin no nyuusu o tsutaemashita.', exVi: 'Phát thanh viên đưa tin động đất bằng giọng bình tĩnh.', more: '**ニュースを{読|よ}む／{伝|つた}える** · アナウンス (lời thông báo ở ga, sân bay). {落|お}ち{着|つ}く (Bài 26). N3.' },
        { w: '{事件|じけん}', pos: 'danh từ', ipa: 'jiken', vi: 'vụ án, vụ việc (có người gây ra)', ex: '{駅|えき}の{近|ちか}くで{事件|じけん}があったせいで、{道|みち}が{通|とお}れませんでした。', exRo: 'Eki no chikaku de jiken ga atta sei de, michi ga tooremasen deshita.', exVi: 'Tại có vụ án gần nhà ga nên không đi qua đường đó được.', more: '**{事件|じけん}が{起|お}こる／{起|お}きる** · {殺人事件|さつじんじけん}, {盗難事件|とうなんじけん} · ⚠ {事件|じけん} (có người CỐ Ý: trộm, lừa đảo…) ≠ {事故|じこ} (Bài 15 — tai nạn, không cố ý). Ví dụ: mẫu ①. N3.' },
        { w: '{発生|はっせい}します［{発生|はっせい}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'hassei shimasu [hassei suru]', vi: 'phát sinh, xảy ra (văn tin tức)', ex: '{今朝|けさ}6{時|じ}ごろ、{関東|かんとう}で{地震|じしん}が{発生|はっせい}しました。', exRo: 'Kesa rokuji goro, Kantou de jishin ga hassei shimashita.', exVi: 'Khoảng 6 giờ sáng nay, một trận động đất đã xảy ra ở vùng Kanto.', more: '**{地震|じしん}／{事故|じこ}／{火事|かじ}が{発生|はっせい}する** — câu mở đầu của gần như mọi bản tin. Văn nói: {起|お}こる／ある. ⚠ はっせい (có っ). N3–N2.' },
        { w: '{状況|じょうきょう}', pos: 'danh từ', ipa: 'joukyou', vi: 'tình hình, tình trạng', ex: 'これから、{道路|どうろ}の{状況|じょうきょう}をお{伝|つた}えします。', exRo: 'Korekara, douro no joukyou o otsutae shimasu.', exVi: 'Sau đây xin thông tin về tình hình đường sá.', more: '**{状況|じょうきょう}が{悪|わる}くなる／よくなる** · {交通状況|こうつうじょうきょう} · ≈ {様子|ようす} (Bài 20 — dáng vẻ quan sát được bằng mắt). お{伝|つた}えします = khiêm nhường ngữ (ôn Bài 24). N3–N2.' },
        { w: '{原因|げんいん}', pos: 'danh từ', ipa: "gen'in", vi: 'nguyên nhân', ex: '{事故|じこ}の{原因|げんいん}は、まだ{分|わ}かっていません。', exRo: "Jiko no gen'in wa, mada wakatte imasen.", exVi: 'Nguyên nhân vụ tai nạn vẫn chưa rõ.', more: '**～の{原因|げんいん}を{調|しら}べる** · **{原因|げんいん}は～だ** · ↔ {結果|けっか} (Bài 21) · ⚠ {原因|げんいん} (nguyên nhân gây ra SỰ VIỆC) ≠ {理由|りゆう} (Bài 19 — lý do của HÀNH ĐỘNG con người) — xem bảng từ dễ nhầm. Romaji ~~genin~~ → **gen\'in**. N3.' },
        { w: '{影響|えいきょう}', pos: 'danh từ', ipa: 'eikyou', vi: 'ảnh hưởng', ex: '{大雪|おおゆき}の{影響|えいきょう}で、{飛行機|ひこうき}が{遅|おく}れています。', exRo: 'Ooyuki no eikyou de, hikouki ga okurete imasu.', exVi: 'Do ảnh hưởng của tuyết lớn, máy bay đang bị chậm.', more: '**～の{影響|えいきょう}で** (do ảnh hưởng của — cụm bản tin hay dùng nhất) · **{影響|えいきょう}を{受|う}ける** (chịu ảnh hưởng) · **{影響|えいきょう}を{与|あた}える** (gây ảnh hưởng) · {影響|えいきょう}が{出|で}る. N3.' },
        { w: '{調査|ちょうさ}します［{調査|ちょうさ}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'chousa shimasu [chousa suru]', vi: 'điều tra, khảo sát', ex: '{警察|けいさつ}が、{事故|じこ}の{原因|げんいん}を{調査|ちょうさ}しています。', exRo: "Keisatsu ga, jiko no gen'in o chousa shite imasu.", exVi: 'Cảnh sát đang điều tra nguyên nhân vụ tai nạn.', more: '**アンケート{調査|ちょうさ}** · **{調査|ちょうさ}によると** (theo khảo sát — ôn ～によると Bài 20) · **{調査|ちょうさ}によって{分|わ}かった** (nhờ điều tra mà biết — mẫu ⑥) · ≈ {調|しら}べる (văn nói). N3–N2.' },
        { w: '{記録|きろく}', pos: 'danh từ / động từ nhóm 3 (記録する)', ipa: 'kiroku', vi: 'kỷ lục; sự ghi chép', ex: '{今年|ことし}の{夏|なつ}は、{記録的|きろくてき}な{暑|あつ}さになりました。', exRo: 'Kotoshi no natsu wa, kirokuteki na atsusa ni narimashita.', exVi: 'Mùa hè năm nay nóng kỷ lục.', more: '**{記録|きろく}を{破|やぶ}る** (phá kỷ lục — 破 Bài 19) · **{記録的|きろくてき}な{大雨|おおあめ}** (cụm bản tin) · {記録|きろく}する (ghi lại) · {世界記録|せかいきろく}. N3.' },
        { w: '{全国|ぜんこく}', pos: 'danh từ', ipa: 'zenkoku', vi: 'toàn quốc, cả nước', ex: '{明日|あした}は、{全国|ぜんこく}で{晴|は}れるでしょう。', exRo: 'Ashita wa, zenkoku de hareru deshou.', exVi: 'Ngày mai trời sẽ nắng trên cả nước.', more: '{全国的|ぜんこくてき}に (trên toàn quốc) · {全国|ぜんこく}{各地|かくち} · **～でしょう** = giọng dự báo thời tiết (dự đoán lịch sự). N3.' },
        { w: '{各地|かくち}', pos: 'danh từ', ipa: 'kakuchi', vi: 'các nơi, khắp nơi', ex: '{大雨|おおあめ}のため、{各地|かくち}で{電車|でんしゃ}が{止|と}まっています。', exRo: 'Ooame no tame, kakuchi de densha ga tomatte imasu.', exVi: 'Do mưa lớn, tàu đang dừng ở nhiều nơi.', more: '**{各地|かくち}で～が{起|お}きる** · {各|かく}～ = mỗi: {各国|かっこく} (các nước), {各駅|かくえき}{停車|ていしゃ} (tàu dừng mọi ga). N3–N2.' },
      ],
    },

    /* ── B ── */
    { t: 'h', text: 'B. Thời tiết & thiên tai (12 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{大雨|おおあめ}', pos: 'danh từ', ipa: 'ooame', vi: 'mưa lớn', ex: '{大雨|おおあめ}のせいで、{川|かわ}の{水|みず}が{増|ふ}えています。', exRo: 'Ooame no sei de, kawa no mizu ga fuete imasu.', exVi: 'Tại mưa lớn nên nước sông đang dâng.', more: '**{大雨|おおあめ}が{降|ふ}る** · {大雨警報|おおあめけいほう} · ⚠ đọc **おおあめ** (không phải ~~だいう~~). Ví dụ: mẫu ①. N3.' },
        { w: '{大雪|おおゆき}', pos: 'danh từ', ipa: 'ooyuki', vi: 'tuyết lớn', ex: '{大雪|おおゆき}によって、{高速道路|こうそくどうろ}が{通行止|つうこうど}めになりました。', exRo: 'Ooyuki ni yotte, kousoku douro ga tsuukoudome ni narimashita.', exVi: 'Do tuyết lớn, đường cao tốc bị cấm lưu thông.', more: '**{大雪|おおゆき}が{降|ふ}る** · ⚠ đọc **おおゆき**. Ví dụ: mẫu ⑤ (によって — nguyên nhân, giọng tin tức). N3.' },
        { w: '{気温|きおん}', pos: 'danh từ', ipa: 'kion', vi: 'nhiệt độ (không khí)', ex: '{今日|きょう}の{最高気温|さいこうきおん}は35{度|ど}です。', exRo: 'Kyou no saikou kion wa sanjuugo-do desu.', exVi: 'Nhiệt độ cao nhất hôm nay là 35 độ.', more: '**{気温|きおん}が{上|あ}がる／{下|さ}がる** · {最高気温|さいこうきおん}／{最低気温|さいていきおん} · ≠ {体温|たいおん} (nhiệt độ cơ thể) · {温度|おんど} (nhiệt độ nói chung: nước, phòng). N3.' },
        { w: '{天候|てんこう}', pos: 'danh từ', ipa: 'tenkou', vi: 'thời tiết (trong một khoảng thời gian)', ex: '{天候|てんこう}が{悪|わる}いため、{試合|しあい}は{延期|えんき}になりました。', exRo: 'Tenkou ga warui tame, shiai wa enki ni narimashita.', exVi: 'Do thời tiết xấu, trận đấu bị hoãn.', more: '{天候|てんこう}が{悪|わる}い／{回復|かいふく}する (hồi phục — N2) · {天候不順|てんこうふじゅん} (thời tiết thất thường — N1) · văn viết của {天気|てんき}. Ví dụ: mẫu ④. N3–N2.' },
        { w: '{気候|きこう}', pos: 'danh từ', ipa: 'kikou', vi: 'khí hậu', ex: 'ベトナムの{南部|なんぶ}は、{一年中|いちねんじゅう}{暖|あたた}かい{気候|きこう}です。', exRo: 'Betonamu no nanbu wa, ichinenjuu atatakai kikou desu.', exVi: 'Miền Nam Việt Nam có khí hậu ấm quanh năm.', more: '**{気候|きこう}がいい／{穏|おだ}やかだ** · {気候変動|きこうへんどう} (biến đổi khí hậu — N1). Phân biệt {天気|てんき}・{天候|てんこう}・{気候|きこう} ở bảng từ dễ nhầm. N3.' },
        { w: '{梅雨|つゆ}', pos: 'danh từ', ipa: 'tsuyu', vi: 'mùa mưa (tháng 6–7 ở Nhật)', ex: '{梅雨|つゆ}のせいか、{洗濯物|せんたくもの}がなかなか{乾|かわ}きません。', exRo: 'Tsuyu no sei ka, sentakumono ga nakanaka kawakimasen.', exVi: 'Chắc tại mùa mưa mà quần áo mãi không khô.', more: '**{梅雨|つゆ}に{入|はい}る／{梅雨|つゆ}が{明|あ}ける** (vào / hết mùa mưa) · ⚠ cách đọc đặc biệt **つゆ** (cả từ, không đọc từng chữ); bản tin cũng đọc **ばいう** ({梅雨前線|ばいうぜんせん}). Ví dụ: mẫu ②. N3.' },
        { w: '{警報|けいほう}', pos: 'danh từ', ipa: 'keihou', vi: 'cảnh báo (thời tiết, thiên tai)', ex: '{大雨警報|おおあめけいほう}が{出|で}たため、{学校|がっこう}は{休|やす}みになりました。', exRo: 'Ooame keihou ga deta tame, gakkou wa yasumi ni narimashita.', exVi: 'Do có cảnh báo mưa lớn nên trường cho nghỉ.', more: '**{警報|けいほう}が{出|で}る／{解除|かいじょ}される** (được dỡ bỏ — N1) · mức: {注意報|ちゅういほう} (lưu ý) ＜ **{警報|けいほう}** ＜ {特別警報|とくべつけいほう}. Ở Nhật, có {警報|けいほう} thì nhiều trường **tự cho nghỉ**. N2.' },
        { w: '{津波|つなみ}', pos: 'danh từ', ipa: 'tsunami', vi: 'sóng thần', ex: '{地震|じしん}のあとは、{津波|つなみ}に{気|き}をつけてください。', exRo: 'Jishin no ato wa, tsunami ni ki o tsukete kudasai.', exVi: 'Sau động đất, hãy đề phòng sóng thần.', more: '{津波警報|つなみけいほう} · {津波|つなみ}が{来|く}る／{来|く}るおそれがある (có nguy cơ — N2) · Từ tiếng Nhật đã thành từ quốc tế "tsunami". N3.' },
        { w: '{避難|ひなん}します［{避難|ひなん}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'hinan shimasu [hinan suru]', vi: 'sơ tán, lánh nạn', ex: '{川|かわ}の{近|ちか}くの{住民|じゅうみん}は、{学校|がっこう}に{避難|ひなん}しました。', exRo: 'Kawa no chikaku no juumin wa, gakkou ni hinan shimashita.', exVi: 'Cư dân gần sông đã sơ tán đến trường học.', more: '**～に{避難|ひなん}する** · **{避難所|ひなんじょ}** (nơi lánh nạn — thường là trường học, nhà thể thao) · {避難訓練|ひなんくんれん} (diễn tập sơ tán). N2–N3.' },
        { w: '{災害|さいがい}', pos: 'danh từ', ipa: 'saigai', vi: 'thiên tai, thảm hoạ', ex: '{日本|にほん}は、{地震|じしん}や{台風|たいふう}などの{災害|さいがい}が{多|おお}い{国|くに}です。', exRo: 'Nihon wa, jishin ya taifuu nado no saigai ga ooi kuni desu.', exVi: 'Nhật Bản là nước có nhiều thiên tai như động đất, bão.', more: '**{災害|さいがい}に{備|そな}える** (phòng bị — N2) · {自然災害|しぜんさいがい} · {災害|さいがい}による{被害|ひがい} (mẫu ⑤). N3–N2.' },
        { w: '{揺|ゆ}れます［{揺|ゆ}れる］2', pos: 'động từ nhóm 2', ipa: 'yuremasu [yureru]', vi: 'rung, lắc', ex: '{家|いえ}が{大|おお}きく{揺|ゆ}れたせいで、{棚|たな}の{本|ほん}が{落|お}ちました。', exRo: 'Ie ga ookiku yureta sei de, tana no hon ga ochimashita.', exVi: 'Tại nhà rung mạnh nên sách trên kệ rơi xuống.', more: '**{揺|ゆ}れ** (sự rung — danh từ: {強|つよ}い{揺|ゆ}れ) · tự ↔ tha: {揺|ゆ}れる ↔ {揺|ゆ}らす · {棚|たな} = cái kệ (N3). N3.' },
        { w: '{激|はげ}しい', pos: 'tính từ い', ipa: 'hageshii', vi: 'dữ dội, mãnh liệt', ex: '{夜|よる}から{激|はげ}しい{雨|あめ}が{降|ふ}っています。', exRo: 'Yoru kara hageshii ame ga futte imasu.', exVi: 'Từ tối mưa đang rơi dữ dội.', more: '**{激|はげ}しい{雨|あめ}／{風|かぜ}／{揺|ゆ}れ／{競争|きょうそう}** · ≈ {強|つよ}い (văn nói) · {激|はげ}しく{降|ふ}る (phó từ). N3.' },
      ],
    },

    /* ── C ── */
    { t: 'h', text: 'C. Giao thông (12 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{渋滞|じゅうたい}します［{渋滞|じゅうたい}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'juutai shimasu [juutai suru]', vi: 'tắc đường, ùn xe', ex: '{事故|じこ}のため、{高速道路|こうそくどうろ}が10キロ{渋滞|じゅうたい}しています。', exRo: 'Jiko no tame, kousoku douro ga jukkiro juutai shite imasu.', exVi: 'Do tai nạn, đường cao tốc đang ùn 10 km.', more: '**{渋滞|じゅうたい}がひどい** · **{渋滞|じゅうたい}に{巻|ま}き{込|こ}まれる** (bị kẹt xe — N2) · {事故|じこ}による{渋滞|じゅうたい} (mẫu ⑤). ⚠ じゅうたい (hai trường âm). N3.' },
        { w: '{列車|れっしゃ}', pos: 'danh từ', ipa: 'ressha', vi: 'đoàn tàu', ex: '{大雪|おおゆき}の{影響|えいきょう}で、{列車|れっしゃ}が30{分|ぷん}{遅|おく}れています。', exRo: 'Ooyuki no eikyou de, ressha ga sanjuppun okurete imasu.', exVi: 'Do ảnh hưởng của tuyết lớn, tàu đang chậm 30 phút.', more: '{電車|でんしゃ} (văn nói, tàu điện trong thành phố) ↔ **{列車|れっしゃ}** (văn thông báo, tàu đường dài) · {夜行列車|やこうれっしゃ} (tàu đêm). ⚠ れっしゃ (có っ). N3.' },
        { w: '{乗客|じょうきゃく}', pos: 'danh từ', ipa: 'joukyaku', vi: 'hành khách', ex: '{列車|れっしゃ}が{止|と}まったせいで、{多|おお}くの{乗客|じょうきゃく}が{駅|えき}で{困|こま}っていました。', exRo: 'Ressha ga tomatta sei de, ooku no joukyaku ga eki de komatte imashita.', exVi: 'Tại tàu dừng nên nhiều hành khách bị kẹt ở ga.', more: '{乗客|じょうきゃく}のみなさま (lời thông báo trên tàu) · {乗|じょう} (lên xe) + {客|きゃく} (khách) · ≠ {観光客|かんこうきゃく} (khách du lịch). N3.' },
        { w: '{道路|どうろ}', pos: 'danh từ', ipa: 'douro', vi: 'đường (xe chạy), đường sá', ex: '{雪|ゆき}で{道路|どうろ}が{凍|こお}っているので、{運転|うんてん}に{気|き}をつけてください。', exRo: 'Yuki de douro ga kootte iru node, unten ni ki o tsukete kudasai.', exVi: 'Đường đóng băng vì tuyết nên hãy cẩn thận khi lái xe.', more: '{道路|どうろ}が{混|こ}む／{渋滞|じゅうたい}する · **{高速道路|こうそくどうろ}** (đường cao tốc) · {道|みち} (đường nói chung, cả lối đi bộ, đường đời) ↔ {道路|どうろ} (đường cho xe). {凍|こお}る = đóng băng (N3). N3.' },
        { w: '{線路|せんろ}', pos: 'danh từ', ipa: 'senro', vi: 'đường ray', ex: '{強|つよ}い{風|かぜ}で、{線路|せんろ}に{木|き}が{倒|たお}れました。', exRo: 'Tsuyoi kaze de, senro ni ki ga taoremashita.', exVi: 'Gió mạnh làm cây đổ xuống đường ray.', more: '{線路|せんろ}に{入|はい}らないでください (biển cảnh báo) · ～{線|せん} = tuyến ({山手線|やまのてせん}) · {倒|たお}れる (Bài 15). N3.' },
        { w: '{通行止|つうこうど}め', pos: 'danh từ', ipa: 'tsuukoudome', vi: 'cấm lưu thông, cấm đi qua', ex: 'この{先|さき}は、{工事|こうじ}のため{通行止|つうこうど}めです。', exRo: 'Kono saki wa, kouji no tame tsuukoudome desu.', exVi: 'Phía trước cấm lưu thông do đang thi công.', more: '**～が{通行止|つうこうど}めになる** · {通行|つうこう} (đi lại) + {止|と}め (dừng) · Biển báo hay gặp: 「{工事中|こうじちゅう}につき{通行止|つうこうど}め」 (～につき = ため — văn biển báo, N2). N3–N2.' },
        { w: '{運休|うんきゅう}', pos: 'danh từ / động từ nhóm 3 (運休する)', ipa: 'unkyuu', vi: '(tàu, xe, máy bay) ngừng chạy', ex: '{台風|たいふう}のため、{新幹線|しんかんせん}は{全|すべ}て{運休|うんきゅう}です。', exRo: 'Taifuu no tame, shinkansen wa subete unkyuu desu.', exVi: 'Do bão, toàn bộ tàu Shinkansen ngừng chạy.', more: '**{運休|うんきゅう}する／になる** · {運|うん}({転|てん}) + {休|きゅう} (nghỉ) · ≠ {休講|きゅうこう} (lớp nghỉ — Bài 26) · {全|すべ}て = tất cả (văn viết của {全部|ぜんぶ}). N2.' },
        { w: '{遅延|ちえん}します［{遅延|ちえん}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'chien shimasu [chien suru]', vi: 'chậm trễ (tàu, chuyến bay)', ex: '{信号|しんごう}の{故障|こしょう}により、{電車|でんしゃ}が{遅延|ちえん}しています。', exRo: 'Shingou no koshou ni yori, densha ga chien shite imasu.', exVi: 'Do hỏng tín hiệu, tàu đang bị chậm.', more: '**{遅延証明書|ちえんしょうめいしょ}** (giấy chứng nhận tàu trễ — lấy ở ga, nộp cho trường / chỗ làm khi đến muộn!) · văn nói: {遅|おく}れる · ～により = によって (văn viết, mẫu ⑤). {故障|こしょう} = hỏng hóc (N3). N2.' },
        { w: '{再開|さいかい}します［{再開|さいかい}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'saikai shimasu [saikai suru]', vi: 'mở lại, chạy lại, tiếp tục lại', ex: '{電車|でんしゃ}は、{午後|ごご}3{時|じ}に{運転|うんてん}を{再開|さいかい}しました。', exRo: 'Densha wa, gogo sanji ni unten o saikai shimashita.', exVi: 'Tàu đã chạy lại lúc 3 giờ chiều.', more: '**{運転|うんてん}を{再開|さいかい}する** · {試合|しあい}／{営業|えいぎょう}が{再開|さいかい}される · {再|さい} = lại ({再来週|さらいしゅう} đọc さ). N3.' },
        { w: '{交通機関|こうつうきかん}', pos: 'danh từ', ipa: 'koutsuu kikan', vi: 'phương tiện giao thông (công cộng)', ex: '{大雪|おおゆき}の{日|ひ}は、{交通機関|こうつうきかん}が{乱|みだ}れることがあります。', exRo: 'Ooyuki no hi wa, koutsuu kikan ga midareru koto ga arimasu.', exVi: 'Ngày tuyết lớn, giao thông công cộng có khi bị rối loạn.', more: '**{公共交通機関|こうきょうこうつうきかん}** (giao thông công cộng: tàu, xe buýt) · {交通機関|こうつうきかん}が{止|と}まる／{乱|みだ}れる · {乱|みだ}れる = rối loạn (N2). N3.' },
        { w: '{混乱|こんらん}します［{混乱|こんらん}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'konran shimasu [konran suru]', vi: 'hỗn loạn; rối (trí)', ex: '{電車|でんしゃ}が{止|と}まったせいで、{駅|えき}は{混乱|こんらん}していました。', exRo: 'Densha ga tomatta sei de, eki wa konran shite imashita.', exVi: 'Tại tàu dừng nên nhà ga hỗn loạn.', more: '{頭|あたま}が{混乱|こんらん}する (rối trí) · ⚠ {混乱|こんらん} (LỘN XỘN, mất trật tự) ≠ {混雑|こんざつ} (ĐÔNG đúc — Bài 15 {混|こ}む) — xem bảng. N3.' },
        { w: '{見合|みあ}わせます［{見合|みあ}わせる］2', pos: 'động từ nhóm 2', ipa: 'miawasemasu [miawaseru]', vi: 'tạm hoãn, tạm dừng (chờ xem)', ex: '{強|つよ}い{風|かぜ}のため、{電車|でんしゃ}は{運転|うんてん}を{見合|みあ}わせています。', exRo: 'Tsuyoi kaze no tame, densha wa unten o miawasete imasu.', exVi: 'Do gió mạnh, tàu đang tạm dừng chạy.', more: '**{運転見合|うんてんみあ}わせ** — dòng chữ hay thấy nhất trên bảng điện tử ở ga khi có sự cố. Cấp **N1** — chỉ cần NHẬN RA: "tàu tạm dừng, chưa biết khi nào chạy lại".' },
      ],
    },

    /* ── D ── */
    { t: 'h', text: 'D. Xã hội & kinh tế (14 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{社会|しゃかい}', pos: 'danh từ', ipa: 'shakai', vi: 'xã hội', ex: 'インターネットによって、{社会|しゃかい}は{大|おお}きく{変|か}わりました。', exRo: 'Intaanetto ni yotte, shakai wa ookiku kawarimashita.', exVi: 'Internet đã làm xã hội thay đổi rất lớn.', more: '**{社会人|しゃかいじん}** (người đã đi làm) · {社会問題|しゃかいもんだい} · {社会|しゃかい}に{出|で}る (ra đời, đi làm). Ví dụ: によって nguyên nhân / phương tiện (⑤⑥). N3.' },
        { w: '{政治|せいじ}', pos: 'danh từ', ipa: 'seiji', vi: 'chính trị', ex: '{若|わか}い{人|ひと}にも、{政治|せいじ}に{興味|きょうみ}を{持|も}ってほしいです。', exRo: 'Wakai hito ni mo, seiji ni kyoumi o motte hoshii desu.', exVi: 'Tôi mong người trẻ cũng quan tâm đến chính trị.', more: '{政治家|せいじか} (chính trị gia) · {政治|せいじ}のニュース · ～てほしい (mong người khác làm — ôn N4). N3.' },
        { w: '{政府|せいふ}', pos: 'danh từ', ipa: 'seifu', vi: 'chính phủ', ex: '{政府|せいふ}は、{災害|さいがい}で{家|いえ}をなくした{人|ひと}を{助|たす}けると{発表|はっぴょう}しました。', exRo: 'Seifu wa, saigai de ie o nakushita hito o tasukeru to happyou shimashita.', exVi: 'Chính phủ tuyên bố sẽ giúp đỡ những người mất nhà vì thiên tai.', more: '**{政府|せいふ}が{決|き}める／{発表|はっぴょう}する** · {日本政府|にほんせいふ}. N3.' },
        { w: '{国民|こくみん}', pos: 'danh từ', ipa: 'kokumin', vi: 'người dân (của một nước), quốc dân', ex: '{新|あたら}しい{法律|ほうりつ}によって、{国民|こくみん}の{生活|せいかつ}が{変|か}わります。', exRo: 'Atarashii houritsu ni yotte, kokumin no seikatsu ga kawarimasu.', exVi: 'Luật mới sẽ làm thay đổi đời sống người dân.', more: '{国民|こくみん}の{祝日|しゅくじつ} (ngày lễ quốc gia) · phân biệt {国民|こくみん}・{市民|しみん}・{住民|じゅうみん} ở bảng từ dễ nhầm. N3.' },
        { w: '{住民|じゅうみん}', pos: 'danh từ', ipa: 'juumin', vi: 'cư dân (người sống ở một khu)', ex: '{工事|こうじ}の{音|おと}のせいで、{近|ちか}くの{住民|じゅうみん}が{困|こま}っています。', exRo: 'Kouji no oto no sei de, chikaku no juumin ga komatte imasu.', exVi: 'Tại tiếng ồn công trường nên cư dân gần đó khổ sở.', more: '**{住民票|じゅうみんひょう}** (giấy đăng ký cư trú — người nước ngoài ở Nhật cũng có, làm ở {役所|やくしょ}) · {地域|ちいき}の{住民|じゅうみん}. N3–N2.' },
        { w: '{物価|ぶっか}', pos: 'danh từ', ipa: 'bukka', vi: 'vật giá, giá cả (nói chung)', ex: '{東京|とうきょう}は{物価|ぶっか}が{高|たか}いので、{生活費|せいかつひ}がかかります。', exRo: 'Toukyou wa bukka ga takai node, seikatsuhi ga kakarimasu.', exVi: 'Tokyo vật giá cao nên tốn chi phí sinh hoạt.', more: '**{物価|ぶっか}が{上|あ}がる／{高|たか}い／{安|やす}い** · ⚠ **ぶっか** (có っ — không đọc ~~ものか~~) · {物価|ぶっか} (giá cả chung) ≠ {値段|ねだん} (giá MỘT món). N3.' },
        { w: '{値上|ねあ}がりします［{値上|ねあ}がりする］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'neagari shimasu [neagari suru]', vi: '(giá) tăng lên', ex: '{天候|てんこう}が{悪|わる}かったせいで、{野菜|やさい}が{値上|ねあ}がりしました。', exRo: 'Tenkou ga warukatta sei de, yasai ga neagari shimashita.', exVi: 'Tại thời tiết xấu nên rau tăng giá.', more: '**{値上|ねあ}がり** (giá TỰ tăng — thị trường) ↔ **{値上|ねあ}げ** (người bán TĂNG giá: {料金|りょうきん}を{値上|ねあ}げする) · đối: {値下|ねさ}がり／{値下|ねさ}げ. N3.' },
        { w: '{景気|けいき}', pos: 'danh từ', ipa: 'keiki', vi: 'tình hình kinh tế, làm ăn buôn bán', ex: '{景気|けいき}が{悪|わる}いせいか、{商店街|しょうてんがい}の{店|みせ}がどんどん{閉|し}まっています。', exRo: 'Keiki ga warui sei ka, shoutengai no mise ga dondon shimatte imasu.', exVi: 'Chắc tại kinh tế khó khăn mà các cửa hàng ở phố mua sắm cứ lần lượt đóng cửa.', more: '**{景気|けいき}がいい／{悪|わる}い** · {不景気|ふけいき} (suy thoái) · {商店街|しょうてんがい} = phố cửa hàng (N3). Ví dụ: mẫu ②. N3.' },
        { w: '{税金|ぜいきん}', pos: 'danh từ', ipa: 'zeikin', vi: 'tiền thuế', ex: '{集|あつ}めた{税金|ぜいきん}は、{道路|どうろ}や{学校|がっこう}を{作|つく}るために{使|つか}われます。', exRo: 'Atsumeta zeikin wa, douro ya gakkou o tsukuru tame ni tsukawaremasu.', exVi: 'Tiền thuế thu được dùng để làm đường và trường học.', more: '**{税金|ぜいきん}を{払|はら}う** · **{消費税|しょうひぜい}** (thuế tiêu dùng — 10%, đồ ăn mang về 8%) · ví dụ có ために MỤC ĐÍCH (Bài 21) — so với ため nguyên nhân của bài này. N3.' },
        { w: '{少子化|しょうしか}', pos: 'danh từ', ipa: 'shoushika', vi: 'tỉ lệ sinh giảm, ít trẻ em', ex: '{少子化|しょうしか}のため、{小学校|しょうがっこう}の{数|かず}が{減|へ}っています。', exRo: 'Shoushika no tame, shougakkou no kazu ga hette imasu.', exVi: 'Do tỉ lệ sinh giảm, số trường tiểu học đang giảm.', more: '**{少子高齢化|しょうしこうれいか}** (cụm báo chí: ít trẻ em + già hoá) · ～{化|か} = hoá ({国際化|こくさいか}, {高齢化|こうれいか}). N2.' },
        { w: '{高齢化|こうれいか}', pos: 'danh từ', ipa: 'koureika', vi: 'già hoá (dân số)', ex: '{高齢化|こうれいか}によって、{病院|びょういん}に{行|い}く{人|ひと}が{増|ふ}えています。', exRo: 'Koureika ni yotte, byouin ni iku hito ga fuete imasu.', exVi: 'Do già hoá dân số, số người đi bệnh viện đang tăng.', more: '**{高齢者|こうれいしゃ}** (người cao tuổi — lịch sự hơn {お年寄|おとしよ}り) · {高齢化社会|こうれいかしゃかい}. Ví dụ: mẫu ⑤. N2.' },
        { w: '{環境|かんきょう}', pos: 'danh từ', ipa: 'kankyou', vi: 'môi trường', ex: 'ごみを{分別|ぶんべつ}することによって、{環境|かんきょう}を{守|まも}ることができます。', exRo: 'Gomi o bunbetsu suru koto ni yotte, kankyou o mamoru koto ga dekimasu.', exVi: 'Bằng việc phân loại rác, ta có thể bảo vệ môi trường.', more: '**{環境|かんきょう}を{守|まも}る** · **{環境問題|かんきょうもんだい}** · {生活環境|せいかつかんきょう} (môi trường sống) · Vること＋によって (mẫu ⑥). N3.' },
        { w: '{平和|へいわ}（な）', pos: 'danh từ / tính từ な', ipa: 'heiwa (na)', vi: 'hoà bình', ex: '{世界|せかい}が{平和|へいわ}になることを{願|ねが}っています。', exRo: 'Sekai ga heiwa ni naru koto o negatte imasu.', exVi: 'Tôi mong thế giới được hoà bình.', more: '{平和|へいわ}な{社会|しゃかい} · ↔ {戦争|せんそう} · {願|ねが}う = mong ước (N3). N3.' },
        { w: '{戦争|せんそう}', pos: 'danh từ', ipa: 'sensou', vi: 'chiến tranh', ex: '{祖父|そふ}は、{戦争|せんそう}のせいで{大学|だいがく}に{行|い}けなかったそうです。', exRo: 'Sofu wa, sensou no sei de daigaku ni ikenakatta sou desu.', exVi: 'Nghe nói ông tôi vì chiến tranh mà không vào được đại học.', more: '**{戦争|せんそう}が{起|お}こる／{終|お}わる** · {戦争中|せんそうちゅう} · ↔ {平和|へいわ}. Ví dụ: mẫu ① (đổ lỗi cho hoàn cảnh). N3.' },
      ],
    },

    /* ── E ── */
    { t: 'h', text: 'E. Nguyên nhân – cách thức – tuỳ theo (13 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{起|お}こります［{起|お}こる］1', pos: 'động từ nhóm 1', ipa: 'okorimasu [okoru]', vi: 'xảy ra (sự việc)', ex: '{昨日|きのう}、{駅|えき}の{前|まえ}で{事故|じこ}が{起|お}こりました。', exRo: 'Kinou, eki no mae de jiko ga okorimashita.', exVi: 'Hôm qua đã xảy ra tai nạn trước nhà ga.', more: '**N が{起|お}こる** (tự) ↔ **N を{起|お}こす** (gây ra: {事故|じこ}を{起|お}こす; Bài 22 {起|お}こす = đánh thức) · ≈ {起|お}きる (văn nói, cùng nghĩa "xảy ra") · {発生|はっせい}する (văn tin tức). N3.' },
        { w: '{防|ふせ}ぎます［{防|ふせ}ぐ］1', pos: 'động từ nhóm 1', ipa: 'fusegimasu [fusegu]', vi: 'phòng, ngăn chặn', ex: '{手|て}を{洗|あら}うことによって、{病気|びょうき}を{防|ふせ}ぐことができます。', exRo: 'Te o arau koto ni yotte, byouki o fusegu koto ga dekimasu.', exVi: 'Bằng việc rửa tay, có thể phòng được bệnh.', more: '**{事故|じこ}／{病気|びょうき}／{火事|かじ}を{防|ふせ}ぐ** · {防止|ぼうし} (phòng chống — N2) · Vること＋によって (mẫu ⑥). N3.' },
        { w: '{種類|しゅるい}', pos: 'danh từ', ipa: 'shurui', vi: 'loại, chủng loại', ex: 'この{店|みせ}には、50{種類|しゅるい}のパンがあります。', exRo: 'Kono mise ni wa, gojusshurui no pan ga arimasu.', exVi: 'Cửa hàng này có 50 loại bánh mì.', more: '**～{種類|しゅるい}** (đếm loại: {一種類|ひとしゅるい} (cũng đọc いっしゅるい), {二種類|ふたしゅるい}, {三種類|さんしゅるい}…) · {種類|しゅるい}によって{値段|ねだん}が{違|ちが}う (mẫu ⑦). ⚠ 50{種類|しゅるい} đọc ごじゅっしゅるい (hoặc ごじっしゅるい). N3.' },
        { w: '{手段|しゅだん}', pos: 'danh từ', ipa: 'shudan', vi: 'phương tiện, cách (để đạt mục đích)', ex: 'この{村|むら}の{交通手段|こうつうしゅだん}は、バスしかありません。', exRo: 'Kono mura no koutsuu shudan wa, basu shika arimasen.', exVi: 'Phương tiện đi lại của làng này chỉ có xe buýt.', more: '**{交通手段|こうつうしゅだん}** · {連絡手段|れんらくしゅだん} (cách liên lạc) · {手段|しゅだん}を{選|えら}ばない (bất chấp thủ đoạn) · ≈ {方法|ほうほう} (Bài 21) — xem bảng. N3–N2.' },
        { w: '{地域|ちいき}', pos: 'danh từ', ipa: 'chiiki', vi: 'khu vực, vùng, địa phương', ex: '{地域|ちいき}によって、ごみの{出|だ}し{方|かた}が{違|ちが}います。', exRo: 'Chiiki ni yotte, gomi no dashikata ga chigaimasu.', exVi: 'Tuỳ khu vực mà cách đổ rác khác nhau.', more: '**{地域|ちいき}によって** (cụm rất hay vào đề — mẫu ⑦) · {地域|ちいき}の{住民|じゅうみん}／{行事|ぎょうじ} · ⚠ ちいき (trường âm ちい). N3.' },
        { w: '{異|こと}なります［{異|こと}なる］1', pos: 'động từ nhóm 1', ipa: 'kotonarimasu [kotonaru]', vi: 'khác nhau (văn viết)', ex: '{国|くに}によって、{文化|ぶんか}や{習慣|しゅうかん}が{異|こと}なります。', exRo: 'Kuni ni yotte, bunka ya shuukan ga kotonarimasu.', exVi: 'Tuỳ nước mà văn hoá, phong tục khác nhau.', more: '**A は B と{異|こと}なる** · ≈ {違|ちが}う (văn nói) · {異|こと}なった{意見|いけん} (ý kiến khác) · Văn viết N3: ～によって{異|こと}なる (mẫu ⑦). N3–N2.' },
        { w: 'さまざま（な）', pos: 'tính từ な', ipa: 'samazama (na)', vi: 'đa dạng, đủ kiểu, khác nhau', ex: '{同|おな}じニュースでも、{人|ひと}によって{感|かん}じ{方|かた}はさまざまです。', exRo: 'Onaji nyuusu demo, hito ni yotte kanjikata wa samazama desu.', exVi: 'Cùng một tin nhưng mỗi người cảm nhận một kiểu.', more: 'Chữ Hán: **{様々|さまざま}** (様 — Bài 20) · ≈ いろいろ (văn nói) · ～によってさまざまだ (mẫu ⑦). N3.' },
        { w: '{責任|せきにん}', pos: 'danh từ', ipa: 'sekinin', vi: 'trách nhiệm', ex: '{失敗|しっぱい}を{人|ひと}のせいにしないで、{自分|じぶん}で{責任|せきにん}を{取|と}りなさい。', exRo: 'Shippai o hito no sei ni shinaide, jibun de sekinin o torinasai.', exVi: 'Đừng đổ lỗi thất bại cho người khác, hãy tự chịu trách nhiệm.', more: '**{責任|せきにん}を{取|と}る** (chịu trách nhiệm) · {責任者|せきにんしゃ} (người phụ trách) · **{人|ひと}のせいにする** (đổ lỗi cho người khác — cụm của mẫu ①). N3.' },
        { w: '{支|ささ}えます［{支|ささ}える］2', pos: 'động từ nhóm 2', ipa: 'sasaemasu [sasaeru]', vi: 'chống đỡ, nâng đỡ, hỗ trợ', ex: '{家族|かぞく}が{支|ささ}えてくれたおかげで、{留学|りゅうがく}を{続|つづ}けられました。', exRo: 'Kazoku ga sasaete kureta okage de, ryuugaku o tsuzukeraremashita.', exVi: 'Nhờ gia đình hỗ trợ mà tôi tiếp tục du học được.', more: '**{生活|せいかつ}／{社会|しゃかい}を{支|ささ}える** · {心|こころ}の{支|ささ}え (chỗ dựa tinh thần) · ～てくれたおかげで (mẫu ③). N3.' },
        { w: '{感謝|かんしゃ}します［{感謝|かんしゃ}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'kansha shimasu [kansha suru]', vi: 'biết ơn, cảm tạ', ex: '{皆|みな}さんのおかげです。{本当|ほんとう}に{感謝|かんしゃ}しています。', exRo: 'Minasan no okage desu. Hontou ni kansha shite imasu.', exVi: 'Là nhờ mọi người. Tôi thật lòng biết ơn.', more: '**N に{感謝|かんしゃ}する** · {感謝|かんしゃ}の{気持|きも}ち · trang trọng hơn ありがとう — hay đứng sau câu ～おかげです. N3.' },
        { w: '{寝不足|ねぶそく}', pos: 'danh từ', ipa: 'nebusoku', vi: 'thiếu ngủ', ex: '{寝不足|ねぶそく}のせいか、{今日|きょう}は{仕事|しごと}に{集中|しゅうちゅう}できません。', exRo: 'Nebusoku no sei ka, kyou wa shigoto ni shuuchuu dekimasen.', exVi: 'Chắc tại thiếu ngủ mà hôm nay tôi không tập trung làm việc được.', more: '**{寝不足|ねぶそく}になる** · ～{不足|ぶそく} = thiếu ({運動不足|うんどうぶそく} — Bài 21, {人手不足|ひとでぶそく} thiếu người) · ⚠ ねぶそく (không phải ~~ねふそく~~). N3.' },
        { w: '{延期|えんき}します［{延期|えんき}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'enki shimasu [enki suru]', vi: 'hoãn lại (sang ngày khác)', ex: '{台風|たいふう}のため、{運動会|うんどうかい}は{来週|らいしゅう}に{延期|えんき}されました。', exRo: 'Taifuu no tame, undoukai wa raishuu ni enki saremashita.', exVi: 'Do bão, hội thao được hoãn sang tuần sau.', more: '**～に{延期|えんき}する／される** · ⚠ {延期|えんき} (HOÃN — sẽ làm sau) ≠ {中止|ちゅうし} (Bài 15 — HUỶ hẳn) · {期|き} (kỳ hạn — Bài 26). N3.' },
        { w: '{気|き}のせい', pos: 'cụm danh từ', ipa: 'ki no sei', vi: 'do (mình) tưởng tượng, do cảm giác', ex: '{誰|だれ}かに{呼|よ}ばれた{気|き}がしましたが、{気|き}のせいでした。', exRo: 'Dareka ni yobareta ki ga shimashita ga, ki no sei deshita.', exVi: 'Tôi tưởng có ai gọi mình, nhưng hoá ra là do tưởng tượng.', more: '**{気|き}のせいだ** (chỉ là tưởng tượng thôi) · **{気|き}のせいか** (không biết có phải mình tưởng tượng không mà…) · đáp bạn: 「{気|き}のせいだよ」. Cụm cố định của mẫu ①②. N3.' },
      ],
    },

    {
      t: 'hinh',
      title: '🖼️ Thẻ từ có hình — nhìn hình nói ra từ (chạm thẻ để nghe)',
      items: [
        { anh: 'television', w: 'アナウンサー', ro: 'anaunsaa', vi: 'phát thanh viên (hình: ti vi)' },
        { anh: 'microphone', w: '{記者|きしゃ}', ro: 'kisha', vi: 'phóng viên (hình: micro phỏng vấn)' },
        { anh: 'satellite-antenna', w: '{放送|ほうそう}する', ro: 'housou suru', vi: 'phát sóng (hình: ăng-ten vệ tinh)' },
        { anh: 'police-car', w: '{事件|じけん}', ro: 'jiken', vi: 'vụ án (hình: xe cảnh sát)' },
        { anh: 'cloud-with-rain', w: '{大雨|おおあめ}', ro: 'ooame', vi: 'mưa lớn (hình: mây mưa)' },
        { anh: 'snowflake', w: '{大雪|おおゆき}', ro: 'ooyuki', vi: 'tuyết lớn (hình: bông tuyết)' },
        { anh: 'thermometer', w: '{気温|きおん}', ro: 'kion', vi: 'nhiệt độ (hình: nhiệt kế)' },
        { anh: 'umbrella-with-rain-drops', w: '{梅雨|つゆ}', ro: 'tsuyu', vi: 'mùa mưa (hình: ô đọng giọt mưa)' },
        { anh: 'water-wave', w: '{津波|つなみ}', ro: 'tsunami', vi: 'sóng thần (hình: con sóng)' },
        { anh: 'person-running', w: '{避難|ひなん}する', ro: 'hinan suru', vi: 'sơ tán (hình: người chạy)' },
        { anh: 'derelict-house', w: '{災害|さいがい}', ro: 'saigai', vi: 'thiên tai (hình: ngôi nhà đổ nát)' },
        { anh: 'automobile', w: '{渋滞|じゅうたい}', ro: 'juutai', vi: 'tắc đường (hình: ô tô)' },
        { anh: 'train', w: '{列車|れっしゃ}', ro: 'ressha', vi: 'đoàn tàu (hình: tàu hoả)' },
        { anh: 'railway-track', w: '{線路|せんろ}', ro: 'senro', vi: 'đường ray (hình: đường ray)' },
        { anh: 'motorway', w: '{道路|どうろ}', ro: 'douro', vi: 'đường xe chạy (hình: đường cao tốc)' },
        { anh: 'no-entry', w: '{通行止|つうこうど}め', ro: 'tsuukoudome', vi: 'cấm lưu thông (hình: biển cấm vào)' },
        { anh: 'classical-building', w: '{政治|せいじ}', ro: 'seiji', vi: 'chính trị (hình: toà nhà nghị viện)' },
        { anh: 'shopping-cart', w: '{物価|ぶっか}', ro: 'bukka', vi: 'vật giá (hình: xe đẩy mua sắm)' },
        { anh: 'chart-increasing', w: '{値上|ねあ}がり', ro: 'neagari', vi: 'tăng giá (hình: biểu đồ đi lên)' },
        { anh: 'yen-banknote', w: '{税金|ぜいきん}', ro: 'zeikin', vi: 'tiền thuế (hình: tờ tiền yên)' },
        { anh: 'older-person', w: '{高齢化|こうれいか}', ro: 'koureika', vi: 'già hoá dân số (hình: người già)' },
        { anh: 'baby', w: '{少子化|しょうしか}', ro: 'shoushika', vi: 'ít trẻ em (hình: em bé)' },
        { anh: 'deciduous-tree', w: '{環境|かんきょう}', ro: 'kankyou', vi: 'môi trường (hình: cây xanh)' },
        { anh: 'dove', w: '{平和|へいわ}', ro: 'heiwa', vi: 'hoà bình (hình: chim bồ câu)' },
        { anh: 'yawning-face', w: '{寝不足|ねぶそく}', ro: 'nebusoku', vi: 'thiếu ngủ (hình: mặt ngáp)' },
        { anh: 'spiral-calendar', w: '{延期|えんき}', ro: 'enki', vi: 'hoãn lại (hình: cuốn lịch)' },
        { anh: 'folded-hands', w: '{感謝|かんしゃ}', ro: 'kansha', vi: 'biết ơn (hình: hai tay chắp)' },
      ],
    },
    {
      t: 'table',
      caption: 'Từ của bài + mẫu ngữ pháp của bài — học thành cụm để nói ngay',
      head: ['Từ', 'Cụm với mẫu của bài', 'Romaji', 'Nghĩa'],
      rows: [
        ['{寝不足|ねぶそく}', '{寝不足|ねぶそく}の**せいで**{頭|あたま}が{痛|いた}い', 'nebusoku no sei de atama ga itai', 'tại thiếu ngủ nên đau đầu (①)'],
        ['{責任|せきにん}', '{人|ひと}の**せいにしないで**、{責任|せきにん}を{取|と}る', 'hito no sei ni shinaide, sekinin o toru', 'không đổ lỗi, tự chịu trách nhiệm (①)'],
        ['{梅雨|つゆ}', '{梅雨|つゆ}の**せいか**、{体|からだ}がだるい', 'tsuyu no sei ka, karada ga darui', 'chắc tại mùa mưa mà người uể oải (②)'],
        ['{気|き}のせい', '{気|き}の**せいか**、{今日|きょう}は{静|しず}かだ', 'ki no sei ka, kyou wa shizuka da', 'không biết có phải tưởng tượng không, hôm nay yên ắng (②)'],
        ['{支|ささ}える', '{家族|かぞく}が{支|ささ}えてくれた**おかげで**', 'kazoku ga sasaete kureta okage de', 'nhờ gia đình nâng đỡ (③)'],
        ['{感謝|かんしゃ}', '{皆|みな}さんの**おかげ**です。{感謝|かんしゃ}しています', 'minasan no okage desu. kansha shite imasu', 'nhờ mọi người, tôi biết ơn (③)'],
        ['{大雨|おおあめ}・{警報|けいほう}', '{大雨警報|おおあめけいほう}が{出|で}た**ため**、{休校|きゅうこう}になった', 'ooame keihou ga deta tame, kyuukou ni natta', 'do có cảnh báo mưa lớn nên trường nghỉ (④)'],
        ['{少子化|しょうしか}', '{少子化|しょうしか}の**ため**、{学校|がっこう}が{減|へ}る', 'shoushika no tame, gakkou ga heru', 'do ít trẻ em nên trường học giảm (④)'],
        ['{影響|えいきょう}', '{台風|たいふう}の{影響|えいきょう}で／{台風|たいふう}**による**{影響|えいきょう}', 'taifuu no eikyou de / taifuu ni yoru eikyou', 'do ảnh hưởng của bão (⑤)'],
        ['{渋滞|じゅうたい}', '{事故|じこ}**による**{渋滞|じゅうたい}', 'jiko ni yoru juutai', 'tắc đường do tai nạn (⑤)'],
        ['{調査|ちょうさ}', '{調査|ちょうさ}**によって**{原因|げんいん}が{分|わ}かった', "chousa ni yotte gen'in ga wakatta", 'nhờ điều tra mà biết nguyên nhân (⑥)'],
        ['{防|ふせ}ぐ', '{手|て}を{洗|あら}うこと**によって**{病気|びょうき}を{防|ふせ}ぐ', 'te o arau koto ni yotte byouki o fusegu', 'phòng bệnh bằng cách rửa tay (⑥)'],
        ['{地域|ちいき}・{異|こと}なる', '{地域|ちいき}**によって**{異|こと}なる', 'chiiki ni yotte kotonaru', 'tuỳ khu vực mà khác (⑦)'],
        ['{種類|しゅるい}', '{種類|しゅるい}**によって**{値段|ねだん}がさまざまだ', 'shurui ni yotte nedan ga samazama da', 'tuỳ loại mà giá đủ kiểu (⑦)'],
        ['{記者|きしゃ}', '{記者|きしゃ}**によって**{書|か}かれた{記事|きじ}', 'kisha ni yotte kakareta kiji', 'bài báo do phóng viên viết (⑧)'],
      ],
    },
    {
      t: 'table',
      caption: '⭐ Từ dễ nhầm (類義語) — đề N3 phần 言い換え類義 và 用法 hay hỏi',
      head: ['Nhóm', 'Phân biệt', 'Ví dụ đúng', 'Romaji'],
      rows: [
        ['{原因|げんいん} ↔ {理由|りゆう}', '{原因|げんいん}: cái GÂY RA một sự việc (thường xấu, khách quan — tai nạn, bệnh, hỏng hóc) · {理由|りゆう} (Bài 19): lý do GIẢI THÍCH một hành động / quyết định của con người', '{事故|じこ}の{原因|げんいん}／{遅刻|ちこく}した{理由|りゆう}', "jiko no gen'in / chikoku shita riyuu"],
        ['{事件|じけん} ↔ {事故|じこ} ↔ {災害|さいがい}', '{事件|じけん}: có người CỐ Ý gây ra (trộm, lừa đảo, giết người) · {事故|じこ} (Bài 15): tai nạn KHÔNG cố ý (xe đâm, tàu trật bánh) · {災害|さいがい}: do THIÊN NHIÊN (bão, động đất, lũ)', '{盗難事件|とうなんじけん}／{交通事故|こうつうじこ}／{自然災害|しぜんさいがい}', 'tounan jiken / koutsuu jiko / shizen saigai'],
        ['{天気|てんき} ↔ {天候|てんこう} ↔ {気候|きこう}', '{天気|てんき}: thời tiết HÔM NAY, vài ngày · {天候|てんこう}: thời tiết trong MỘT KHOẢNG (mùa, cả tháng — văn viết) · {気候|きこう}: khí hậu đặc trưng của MỘT VÙNG qua nhiều năm', '{明日|あした}の{天気|てんき}／{今年|ことし}の{天候|てんこう}／{日本|にほん}の{気候|きこう}', 'ashita no tenki / kotoshi no tenkou / Nihon no kikou'],
        ['{報道|ほうどう}する ↔ {放送|ほうそう}する ↔ {伝|つた}える', '{報道|ほうどう}: báo chí ĐƯA TIN về sự việc · {放送|ほうそう}: PHÁT SÓNG (TV, radio, loa — kể cả phim, nhạc) · {伝|つた}える (Bài 20): truyền đạt (rộng nhất, cả người với người)', '{事件|じけん}を{報道|ほうどう}する／ドラマを{放送|ほうそう}する', 'jiken o houdou suru / dorama o housou suru'],
        ['{延期|えんき} ↔ {中止|ちゅうし} ↔ {運休|うんきゅう} ↔ {休講|きゅうこう}', '{延期|えんき}: HOÃN sang ngày khác · {中止|ちゅうし} (Bài 15): HUỶ, không làm nữa · {運休|うんきゅう}: TÀU XE ngừng chạy · {休講|きゅうこう} (Bài 26): LỚP được nghỉ', '{試合|しあい}は{来週|らいしゅう}に{延期|えんき}／{試合|しあい}は{中止|ちゅうし}', 'shiai wa raishuu ni enki / shiai wa chuushi'],
        ['{遅延|ちえん} ↔ {遅|おく}れる ↔ {渋滞|じゅうたい}', '{遅延|ちえん}: (thông báo) tàu, chuyến bay CHẬM giờ · {遅|おく}れる: văn nói, nghĩa rộng · {渋滞|じゅうたい}: ĐƯỜNG tắc, xe nhích từng chút', '{電車|でんしゃ}が{遅延|ちえん}する／{道路|どうろ}が{渋滞|じゅうたい}する', 'densha ga chien suru / douro ga juutai suru'],
        ['{混乱|こんらん} ↔ {混雑|こんざつ}', '{混乱|こんらん}: HỖN LOẠN, mất trật tự, không ai biết làm gì · {混雑|こんざつ}: ĐÔNG người, chật chội (nhưng vẫn trật tự)', '{事故|じこ}で{駅|えき}が{混乱|こんらん}した／{朝|あさ}の{駅|えき}は{混雑|こんざつ}している', 'jiko de eki ga konran shita / asa no eki wa konzatsu shite iru'],
        ['{国民|こくみん} ↔ {市民|しみん} ↔ {住民|じゅうみん}', '{国民|こくみん}: người dân của MỘT NƯỚC (có quốc tịch) · {市民|しみん}: người dân của một THÀNH PHỐ · {住民|じゅうみん}: người SỐNG ở một khu (cả người nước ngoài)', '{日本国民|にほんこくみん}／{横浜市民|よこはましみん}／マンションの{住民|じゅうみん}', 'Nihon kokumin / Yokohama shimin / manshon no juumin'],
        ['{値上|ねあ}がり ↔ {値上|ねあ}げ', '{値上|ねあ}がり: giá TỰ tăng (thị trường) — が{値上|ねあ}がりする · {値上|ねあ}げ: người bán / công ty TĂNG giá — を{値上|ねあ}げする', '{野菜|やさい}が{値上|ねあ}がりした／{店|みせ}がランチを{値上|ねあ}げした', 'yasai ga neagari shita / mise ga ranchi o neage shita'],
        ['{手段|しゅだん} ↔ {方法|ほうほう}', '{手段|しゅだん}: CÔNG CỤ, phương tiện để đạt mục đích ({交通手段|こうつうしゅだん}, {連絡手段|れんらくしゅだん}) · {方法|ほうほう} (Bài 21): CÁCH LÀM, các bước', '{交通手段|こうつうしゅだん}はバスだけ／{勉強|べんきょう}の{方法|ほうほう}', 'koutsuu shudan wa basu dake / benkyou no houhou'],
        ['{異|こと}なる ↔ {違|ちが}う', 'cùng nghĩa "khác"; {異|こと}なる là văn viết (bài báo, báo cáo) · {違|ちが}う văn nói, còn có nghĩa "sai" ({答|こた}えが{違|ちが}う) mà {異|こと}なる không có', '{意見|いけん}が{異|こと}なる／その{答|こた}えは{違|ちが}う', 'iken ga kotonaru / sono kotae wa chigau'],
        ['さまざま ↔ いろいろ', 'cùng nghĩa "đủ loại"; さまざま văn viết, nhấn "mỗi cái một khác" · いろいろ (N5) văn nói', '{人|ひと}によって{意見|いけん}はさまざまだ', 'hito ni yotte iken wa samazama da'],
        ['{起|お}こる ↔ {起|お}こす ↔ {起|お}きる', '{起|お}こる: (sự việc) XẢY RA — tự · {起|お}こす: GÂY RA ({事故|じこ}を{起|お}こす) / đánh thức · {起|お}きる: thức dậy; cũng = xảy ra (văn nói)', '{地震|じしん}が{起|お}こった／{事故|じこ}を{起|お}こした', 'jishin ga okotta / jiko o okoshita'],
        ['{注意報|ちゅういほう} ↔ {警報|けいほう}', '{注意報|ちゅういほう}: cần CHÚ Ý (mức thấp) · {警報|けいほう}: CẢNH BÁO, có nguy hiểm (trường thường cho nghỉ)', '{大雨注意報|おおあめちゅういほう}が{大雨警報|おおあめけいほう}に{変|か}わった', 'ooame chuuihou ga ooame keihou ni kawatta'],
      ],
    },
    {
      t: 'note',
      title: 'Kết hợp từ (コロケーション) nên học thành cụm',
      items: [
        '**ニュースで{報道|ほうどう}される** · **{速報|そくほう}が{入|はい}る** · **{番組|ばんぐみ}を{放送|ほうそう}する** · **{事件|じけん}が{起|お}こる** · **{地震|じしん}が{発生|はっせい}する** · **{状況|じょうきょう}を{伝|つた}える** · **{原因|げんいん}を{調|しら}べる／{調査|ちょうさ}する** · **{影響|えいきょう}を{受|う}ける／{与|あた}える** · **～の{影響|えいきょう}で** · **{記録|きろく}を{破|やぶ}る** · **{全国|ぜんこく}{各地|かくち}で**',
        '**{大雨|おおあめ}が{降|ふ}る** · **{気温|きおん}が{上|あ}がる／{下|さ}がる** · **{天候|てんこう}が{悪|わる}い** · **{梅雨|つゆ}に{入|はい}る／{梅雨|つゆ}が{明|あ}ける** · **{警報|けいほう}が{出|で}る** · **{津波|つなみ}が{来|く}る** · **{避難所|ひなんじょ}に{避難|ひなん}する** · **{災害|さいがい}に{備|そな}える** · **{激|はげ}しく{揺|ゆ}れる**',
        '**{道路|どうろ}が{渋滞|じゅうたい}する** · **{列車|れっしゃ}が{遅延|ちえん}する** · **{電車|でんしゃ}が{運休|うんきゅう}になる** · **{運転|うんてん}を{見合|みあ}わせる／{再開|さいかい}する** · **{通行止|つうこうど}めになる** · **{交通機関|こうつうきかん}が{乱|みだ}れる** · **{駅|えき}が{混乱|こんらん}する** · **{遅延証明書|ちえんしょうめいしょ}をもらう**',
        '**{物価|ぶっか}が{上|あ}がる** · **{野菜|やさい}が{値上|ねあ}がりする** · **{料金|りょうきん}を{値上|ねあ}げする** · **{景気|けいき}がいい／{悪|わる}い** · **{税金|ぜいきん}を{払|はら}う** · **{環境|かんきょう}を{守|まも}る** · **{平和|へいわ}を{願|ねが}う** · **{戦争|せんそう}が{終|お}わる** · **{政府|せいふ}が{発表|はっぴょう}する**',
        '**{事故|じこ}／{病気|びょうき}を{防|ふせ}ぐ** · **{責任|せきにん}を{取|と}る** · **{人|ひと}のせいにする** · **{家族|かぞく}に{感謝|かんしゃ}する** · **{生活|せいかつ}を{支|ささ}える** · **{寝不足|ねぶそく}になる** · **{来週|らいしゅう}に{延期|えんき}する** · **{地域|ちいき}によって{異|こと}なる** · **{人|ひと}によってさまざまだ** · **{気|き}のせいだ**',
      ],
    },
    {
      t: 'write',
      id: 'b27-viet-tu',
      title: 'Viết tay 10 từ hay vào đề',
      note: 'Dòng trên tô theo mẫu, dòng dưới tự viết. Bật "Che mẫu" để tự nhớ ra từ chỉ từ gợi ý nghĩa.',
      chars: ['原因', '影響', '事件', '政治', '国民', '道路', '物価', '値段', '種類', '平和'],
      goi: {
        '原因': 'げんいん · nguyên nhân',
        '影響': 'えいきょう · ảnh hưởng',
        '事件': 'じけん · vụ án',
        '政治': 'せいじ · chính trị',
        '国民': 'こくみん · người dân',
        '道路': 'どうろ · đường xe chạy',
        '物価': 'ぶっか · vật giá',
        '値段': 'ねだん · giá (một món)',
        '種類': 'しゅるい · loại',
        '平和': 'へいわ · hoà bình',
      },
    },
    {
      t: 'mcq',
      id: 'b27-tv-trac-nghiem',
      title: 'Kiểm tra từ vựng — 15 câu (dạng 文脈規定・言い換え類義・用法 của đề N3)',
      items: [
        { q: '{警察|けいさつ}は、{事故|じこ}の（　）を{調|しら}べています。', options: ['{理由|りゆう}', '{原因|げんいん}', '{結果|けっか}', '{手段|しゅだん}'], correct: 1, why: 'Cái GÂY RA một sự việc (tai nạn) = **{原因|げんいん}**. {理由|りゆう} dùng cho lý do hành động của con người. 〔Jiko no gen\'in o shirabete imasu.〕' },
        { q: '{台風|たいふう}の（　）で、{飛行機|ひこうき}が{遅|おく}れています。', options: ['{影響|えいきょう}', '{状況|じょうきょう}', '{記録|きろく}', '{速報|そくほう}'], correct: 0, why: '**～の{影響|えいきょう}で** = do ảnh hưởng của — cụm cố định của bản tin. 〔Taifuu no eikyou de…〕' },
        { q: '{雨|あめ}がひどいため、{運動会|うんどうかい}は{来週|らいしゅう}に（　）になりました。', options: ['{中止|ちゅうし}', '{延期|えんき}', '{運休|うんきゅう}', '{休講|きゅうこう}'], correct: 1, why: 'Có "{来週|らいしゅう}に" (sang tuần sau) → HOÃN = **{延期|えんき}**. {中止|ちゅうし} là huỷ hẳn, không có ngày mới. 〔Raishuu ni enki ni narimashita.〕' },
        { q: '{事故|じこ}のため、{高速道路|こうそくどうろ}が20キロ（　）しています。', options: ['{混乱|こんらん}', '{遅延|ちえん}', '{渋滞|じゅうたい}', '{避難|ひなん}'], correct: 2, why: 'ĐƯỜNG tắc dài 20 km = **{渋滞|じゅうたい}**. {遅延|ちえん} dùng cho tàu, chuyến bay. 〔Nijukkiro juutai shite imasu.〕' },
        { q: '{地震|じしん}で{家|いえ}が{大|おお}きく（　）、とても{怖|こわ}かったです。', options: ['{揺|ゆ}れて', '{起|お}こって', '{防|ふせ}いで', '{支|ささ}えて'], correct: 0, why: 'Nhà RUNG lắc = **{揺|ゆ}れる**. 〔Ie ga ookiku yurete, totemo kowakatta desu.〕' },
        { q: '{川|かわ}の{水|みず}が{増|ふ}えてきたので、{近|ちか}くの{住民|じゅうみん}は{小学校|しょうがっこう}に（　）しました。', options: ['{放送|ほうそう}', '{避難|ひなん}', '{報道|ほうどう}', '{調査|ちょうさ}'], correct: 1, why: 'Đến trường học lánh nạn = **{避難|ひなん}する**. 〔Shougakkou ni hinan shimashita.〕' },
        { q: '{今年|ことし}は{天候|てんこう}が{悪|わる}かったので、{野菜|やさい}が（　）しています。', options: ['{値上|ねあ}がり', '{値上|ねあ}げ', '{物価|ぶっか}', '{景気|けいき}'], correct: 0, why: 'Rau (chủ ngữ が) TỰ tăng giá = **{値上|ねあ}がりする**. {値上|ねあ}げ là người bán tăng giá (を{値上|ねあ}げする). 〔Yasai ga neagari shite imasu.〕' },
        { q: 'この{町|まち}は、バスのほかに{交通|こうつう}（　）がありません。', options: ['{手段|しゅだん}', '{方法|ほうほう}', '{種類|しゅるい}', '{状況|じょうきょう}'], correct: 0, why: 'Phương tiện đi lại = **{交通手段|こうつうしゅだん}** (cụm cố định). 〔Koutsuu shudan ga arimasen.〕' },
        { q: '「{国|くに}によって、{結婚式|けっこんしき}のやり{方|かた}は{異|こと}なります。」と{意味|いみ}が{近|ちか}いのは？', options: ['{結婚式|けっこんしき}のやり{方|かた}は、どの{国|くに}も{同|おな}じです。', '{結婚式|けっこんしき}のやり{方|かた}は、{国|くに}が{決|き}めます。', '{結婚式|けっこんしき}のやり{方|かた}は、{国|くに}ごとに{違|ちが}います。', '{結婚式|けっこんしき}は、{国|くに}でしてはいけません。'], correct: 2, why: '{異|こと}なる = **{違|ちが}う**; ～によって = tuỳ, mỗi… một khác (～ごとに = mỗi). 〔Kuni goto ni chigaimasu.〕' },
        { q: '「{駅|えき}は{混乱|こんらん}していました。」と{意味|いみ}が{近|ちか}いのは？', options: ['{駅|えき}はとても{静|しず}かでした。', '{駅|えき}では、{人|ひと}がどうしたらいいか{分|わ}からず、ばらばらに{動|うご}いていました。', '{駅|えき}はきれいに{掃除|そうじ}されていました。', '{駅|えき}には{誰|だれ}もいませんでした。'], correct: 1, why: '{混乱|こんらん} = hỗn loạn, mất trật tự → mọi người không biết làm gì, mỗi người một hướng. 〔Hito ga dou shitara ii ka wakarazu…〕' },
        { q: '「{景気|けいき}が{悪|わる}い」と{意味|いみ}が{近|ちか}いのは？', options: ['{天気|てんき}が{悪|わる}い', '{気分|きぶん}が{悪|わる}い', 'お{金|かね}の{動|うご}きが{少|すく}なくて、{物|もの}があまり{売|う}れない', '{空気|くうき}が{悪|わる}い'], correct: 2, why: '{景気|けいき} = tình hình làm ăn, kinh tế → **{物|もの}が{売|う}れない**. Đừng nhầm với {天気|てんき}／{気分|きぶん} vì cùng chữ 気. 〔Mono ga amari urenai.〕' },
        { q: '「{責任|せきにん}」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{今日|きょう}は{責任|せきにん}がいいです。', 'この{仕事|しごと}は、{私|わたし}が{最後|さいご}まで{責任|せきにん}を{持|も}ってやります。', '{責任|せきにん}が{降|ふ}って、{傘|かさ}をさしました。', '{責任|せきにん}な{人|ひと}になりたいです。'], correct: 1, why: '**{責任|せきにん}を{持|も}つ／{取|と}る** (chịu trách nhiệm). {責任|せきにん} là danh từ — không có ~~{責任|せきにん}な~~ (phải là {責任感|せきにんかん}のある{人|ひと}). 〔Watashi ga saigo made sekinin o motte yarimasu.〕' },
        { q: '「{防|ふせ}ぐ」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{窓|まど}を{防|ふせ}いで、{風|かぜ}を{入|い}れました。', '{毎朝|まいあさ}、{顔|かお}を{防|ふせ}ぎます。', '{交通事故|こうつうじこ}を{防|ふせ}ぐために、スピードを{出|だ}しすぎないでください。', '{友達|ともだち}を{駅|えき}まで{防|ふせ}ぎました。'], correct: 2, why: '**{事故|じこ}を{防|ふせ}ぐ** (ngăn tai nạn). Các câu khác dùng sai động từ ({開|あ}ける／{洗|あら}う／{送|おく}る). 〔Koutsuu jiko o fusegu tame ni…〕' },
        { q: '「{発生|はっせい}する」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{明日|あした}、{誕生日|たんじょうび}パーティーが{発生|はっせい}します。', '{今朝|けさ}、{駅|えき}の{近|ちか}くで{火事|かじ}が{発生|はっせい}しました。', '{私|わたし}は{毎朝|まいあさ}6{時|じ}に{発生|はっせい}します。', '{先生|せんせい}が{新|あたら}しい{本|ほん}を{発生|はっせい}しました。'], correct: 1, why: '{発生|はっせい}する dùng cho sự việc **không ai định trước** (hoả hoạn, động đất, tai nạn). Tiệc → {開|ひら}かれる; thức dậy → {起|お}きる; sách → {出|だ}す. 〔Eki no chikaku de kaji ga hassei shimashita.〕' },
        { q: '「さまざま」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{留学生|りゅうがくせい}の{国|くに}は、アジアやヨーロッパなどさまざまです。', '{私|わたし}はさまざまに{一人|ひとり}です。', 'さまざまの{雨|あめ}が{降|ふ}りました。', '{今日|きょう}はさまざま{寒|さむ}いです。'], correct: 0, why: 'さまざま = đa dạng, mỗi cái một khác: **～はさまざまだ** / **さまざまな N**. 〔Ajia ya Yooroppa nado samazama desu.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b27-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp N3 — ～せいで・せいだ, ～せいか, ～おかげで・おかげだ, ～ため（に） nguyên nhân, ～によって／～による (nguyên nhân · cách thức · tuỳ theo · tác nhân bị động) + bảng phân biệt せいで・おかげで・ため・から・ので',
  goal: 'Nối đúng mọi loại từ (V普通形・イA・ナAな・Nの) vào ～せいで／～せいか／～おかげで／～ため và nối đúng N (hoặc Vこと) vào ～によって／～による; dùng ～せいで khi kết quả XẤU và người nói đổ lỗi, ～せいか khi KHÔNG CHẮC nguyên nhân, ～おかげで khi kết quả TỐT và người nói biết ơn (nhận ra cả cách dùng mỉa mai); dùng ～ため（に） chỉ nguyên nhân trong văn viết, thông báo, tin tức và phân biệt chắc chắn với ために MỤC ĐÍCH (Bài 21) qua thể của động từ và loại vế sau; nhận ra và dùng bốn nghĩa của ～によって (nguyên nhân 台風によって, cách thức 話し合いによって, tuỳ theo 国によって違う / ～によっては, tác nhân bị động 記者によって書かれた) và không nhầm với ～によると (Bài 20); chọn đúng giữa せいで・おかげで・ため・によって・から・ので・で trong câu đề N3; nhận ra ～ばかりに, ～につき, ～ことから (N2) khi đọc.',
  minutes: 150,
  blocks: [
    {
      t: 'p',
      text: 'Bài 27 xoay quanh **một câu hỏi: B xảy ra VÌ A — và người nói NHÌN quan hệ nhân – quả đó thế nào?** — **(1)** A gây ra chuyện **xấu**, người nói **trách** A → **～せいで** ①. **(2)** Người nói **đoán** A là nguyên nhân, không chắc → **～せいか** ②. **(3)** A mang lại chuyện **tốt**, người nói **biết ơn** → **～おかげで** ③. **(4)** Người nói chỉ **thông báo khách quan**, không khen không chê — văn viết, bản tin → **～ため（に）** ④ hoặc **～によって／～による** ⑤. Ngoài nguyên nhân, **によって** còn ba nghĩa nữa: **bằng cách** ⑥, **tuỳ theo** ⑦, **do (ai) làm ra** ⑧. Cuối bài là **bảng phân biệt** ⑨ — đề N3 phần 文法 gần như lần nào cũng có một câu hỏi せいで ↔ おかげで ↔ ため.',
    },
    {
      t: 'table',
      caption: 'Bản đồ ngữ pháp Bài 27',
      head: ['#', 'Mẫu', 'Nghĩa', 'Ví dụ ngắn', 'Cấp'],
      rows: [
        ['①', 'V{普通形|ふつうけい}・イA・ナAな・Nの ＋ せいで／せいだ', 'tại, do (kết quả XẤU — đổ lỗi)', '{寝不足|ねぶそく}のせいで{頭|あたま}が{痛|いた}い。', 'N3'],
        ['②', 'V{普通形|ふつうけい}・イA・ナAな・Nの ＋ せいか', 'có lẽ tại / có lẽ vì (không chắc)', '{年|とし}のせいか、{疲|つか}れやすい。', 'N3'],
        ['③', 'V{普通形|ふつうけい}・イA・ナAな・Nの ＋ おかげで／おかげだ', 'nhờ (kết quả TỐT — biết ơn)', '{先生|せんせい}のおかげで{合格|ごうかく}した。', 'N3'],
        ['④', 'V{普通形|ふつうけい}・イA・ナAな・Nの ＋ ため（に）／ためだ', 'do, vì (nguyên nhân — văn viết, thông báo)', '{大雨|おおあめ}のため、{電車|でんしゃ}が{止|と}まった。', 'N3'],
        ['⑤', 'N ＋ によって／により · N ＋ による ＋ N', 'do (nguyên nhân — tin tức)', '{台風|たいふう}による{被害|ひがい}', 'N3'],
        ['⑥', 'N／Vこと ＋ によって', 'bằng, thông qua (cách thức, phương tiện)', '{話|はな}し{合|あ}いによって{解決|かいけつ}する。', 'N3'],
        ['⑦', 'N ＋ によって（は）＋ {違|ちが}う・{異|こと}なる・さまざまだ', 'tuỳ theo… (mà khác)', '{国|くに}によって{習慣|しゅうかん}が{違|ちが}う。', 'N3'],
        ['⑧', 'N(người) ＋ によって ＋ V(ら)れる · N による N', 'do (ai) làm ra — tác nhân bị động', '{記者|きしゃ}によって{書|か}かれた{記事|きじ}', 'N3 (ôn Bài 22)'],
        ['⑨', 'Bảng phân biệt + nhận ra ～ばかりに・～につき・～ことから', 'せいで・おかげで・ため・によって・から・ので・で', '—', 'N3 (N2: nhận ra)'],
      ],
    },
    {
      t: 'table',
      caption: '⭐ BẢNG NỐI TỪ TRỌN BÀI — loại từ nào đứng trước mẫu nào (○ dùng được · ✗ không dùng)',
      head: ['Đứng trước', 'せいで・せいか', 'おかげで', 'ため（に）', 'によって・による'],
      rows: [
        ['V{普通形|ふつうけい} ({遅|おく}れた・{降|ふ}っている・{来|こ}ない)', '○ {遅|おく}れたせいで', '○ {手伝|てつだ}ってくれたおかげで', '○ {遅|おく}れたため', '✗ → Vこと ＋ によって (chỉ nghĩa ⑥)'],
        ['イA ({高|たか}い・{悪|わる}かった)', '○ {高|たか}いせいで', '○ {近|ちか}いおかげで', '○ {悪|わる}かったため', '✗'],
        ['ナA ({複雑|ふくざつ}な・{静|しず}かだった)', '○ {複雑|ふくざつ}なせいで', '○ {便利|べんり}なおかげで', '○ {不便|ふべん}なため · {不便|ふべん}であるため (văn viết)', '✗'],
        ['N ({雨|あめ}・{台風|たいふう})', '○ {雨|あめ}のせいで', '○ {先生|せんせい}のおかげで', '○ {雨|あめ}のため · {雨|あめ}であるため', '○ {台風|たいふう}によって · {台風|たいふう}による{被害|ひがい}'],
        ['Kết quả ở vế sau', 'XẤU (せいか: xấu / trung tính)', 'TỐT (xấu = mỉa mai)', 'trung tính (sự thật)', 'sự thật, thay đổi lớn'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ bảng nối — ba câu thần chú',
      items: [
        '**"せい・おかげ・ため là DANH TỪ"** — nên chúng nối y như danh từ trong câu bổ nghĩa (ポイント 109): **Nの**, **ナAな**, **イA** và **V thể thường** đứng trước. ~~{雨|あめ}だせいで~~, ~~{便利|べんり}のおかげで~~ đều sai.',
        '**"によって chỉ ăn danh từ"** — {台風|たいふう}によって, {国|くに}によって, {記者|きしゃ}によって. Muốn đặt động từ trước thì biến nó thành danh từ bằng **こと**: {毎日|まいにち}{書|か}く**こと**によって.',
        '**"Nhìn vế sau để chọn mẫu"** — xấu + trách → せいで; tốt + biết ơn → おかげで; không chắc → せいか; thông báo khách quan → ため／によって; nói chuyện bình thường → から／ので.',
        'Chữ: **せい** viết {所為|せい} rất hiếm — luôn viết kana **せい**. **おかげ** có chữ Hán {お陰|おかげ} nhưng đề và báo thường viết **おかげ**. **ため** có chữ {為|ため} — văn hiện đại viết **ため**.',
      ],
    },

    /* ══════ ① せいで ══════ */
    { t: 'h', text: '① ～せいで／～せいだ — "tại, tại vì… (kết quả XẤU, người nói đổ lỗi)"' },
    {
      t: 'p',
      text: 'Vế trước là **nguyên nhân**, vế sau là **kết quả xấu, không mong muốn** (muộn, hỏng, ốm, thất bại, thiệt hại). Người nói **không vui** và **quy trách nhiệm** cho nguyên nhân đó — có khi là trách người khác, có khi là trách chính mình. Tiếng Việt: "**tại…** nên…", "**vì…** mà…", "**đều tại…**". Ba dạng hay gặp: **AせいでB** (giữa câu) · **BのはAのせいだ** (cuối câu — "B là tại A") · **～を…のせいにする** ("đổ lỗi … cho …").',
    },
    {
      t: 'table',
      caption: 'Cách nối ～せいで — như nối với một danh từ',
      head: ['Loại từ', 'Khuôn', 'Ví dụ', 'Romaji'],
      rows: [
        ['Động từ (thể thường)', 'V{辞書形|じしょけい}・Vた・Vない・Vている ＋ せいで', '{電車|でんしゃ}が{遅|おく}れた**せいで** · {雨|あめ}が{降|ふ}っている**せいで** · {寝|ね}ない**せいで**', 'densha ga okureta sei de · ame ga futte iru sei de · nenai sei de'],
        ['Tính từ い', 'イA（～い／～かった）＋ せいで', '{部屋|へや}が{狭|せま}い**せいで** · {暑|あつ}かった**せいで**', 'heya ga semai sei de · atsukatta sei de'],
        ['Tính từ な', 'ナA な（だった）＋ せいで', '{説明|せつめい}が{複雑|ふくざつ}な**せいで** · {下手|へた}だった**せいで**', 'setsumei ga fukuzatsu na sei de · heta datta sei de'],
        ['Danh từ', 'N の（だった）＋ せいで', '{台風|たいふう}の**せいで** · {私|わたし}の**せいで**', 'taifuu no sei de · watashi no sei de'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '［nguyên nhân］＋ せいで、［kết quả XẤU］',
          vi: '"**Tại** … nên …". Vế sau là sự thật đã / đang xảy ra (không phải lời rủ, lời nhờ). Câu hỏi: **どうして～んですか** → **～せいで～んです**.',
          examples: [
            E('{台風|たいふう}のせいで、{旅行|りょこう}が{中止|ちゅうし}になりました。', 'Taifuu no sei de, ryokou ga chuushi ni narimashita.', 'Tại bão mà chuyến du lịch bị huỷ.'),
            E('{電車|でんしゃ}が{遅|おく}れたせいで、{試験|しけん}に{間|ま}に{合|あ}いませんでした。', 'Densha ga okureta sei de, shiken ni ma ni aimasen deshita.', 'Tại tàu chậm nên tôi không kịp giờ thi.'),
            E('{寝不足|ねぶそく}のせいで、{授業|じゅぎょう}に{集中|しゅうちゅう}できませんでした。', 'Nebusoku no sei de, jugyou ni shuuchuu dekimasen deshita.', 'Tại thiếu ngủ nên tôi không tập trung học được.'),
            E('{部屋|へや}が{狭|せま}いせいで、{友達|ともだち}を{呼|よ}べません。', 'Heya ga semai sei de, tomodachi o yobemasen.', 'Tại phòng chật nên tôi không mời bạn về được.'),
            E('{説明|せつめい}が{複雑|ふくざつ}なせいで、{誰|だれ}も{分|わ}かりませんでした。', 'Setsumei ga fukuzatsu na sei de, daremo wakarimasen deshita.', 'Tại lời giải thích rắc rối quá nên chẳng ai hiểu.'),
            E('{私|わたし}が{地図|ちず}を{忘|わす}れたせいで、みんなが{道|みち}に{迷|まよ}ってしまいました。', 'Watashi ga chizu o wasureta sei de, minna ga michi ni mayotte shimaimashita.', 'Tại tôi quên bản đồ mà cả nhóm bị lạc đường. (tự trách mình)'),
            E('{工事|こうじ}の{音|おと}のせいで、{夜|よる}も{眠|ねむ}れません。', 'Kouji no oto no sei de, yoru mo nemuremasen.', 'Tại tiếng công trường mà đêm cũng không ngủ được.'),
          ],
        },
        {
          formula: '［kết quả xấu］のは、［nguyên nhân］せいだ · ［việc xấu］を［người］のせいにする',
          vi: '**～のは～せいだ** đưa kết quả lên trước, nguyên nhân xuống cuối câu để **nhấn mạnh thủ phạm**. **～のせいにする** = "đổ lỗi cho…" — thường dùng ở dạng phủ định để khuyên: **{人|ひと}のせいにしないで**.',
          examples: [
            E('{頭|あたま}が{痛|いた}いのは、{寝不足|ねぶそく}のせいです。', 'Atama ga itai no wa, nebusoku no sei desu.', 'Đau đầu là tại thiếu ngủ.'),
            E('{試合|しあい}に{負|ま}けたのは、{私|わたし}のせいだ。', 'Shiai ni maketa no wa, watashi no sei da.', 'Thua trận là tại tôi.'),
            E('{野菜|やさい}が{高|たか}いのは、{天候|てんこう}が{悪|わる}かったせいです。', 'Yasai ga takai no wa, tenkou ga warukatta sei desu.', 'Rau đắt là tại thời tiết xấu.'),
            E('{遅刻|ちこく}を{電車|でんしゃ}のせいにしないでください。', 'Chikoku o densha no sei ni shinaide kudasai.', 'Đừng đổ lỗi việc đến muộn cho tàu.'),
            E('{彼|かれ}はいつも{失敗|しっぱい}を{人|ひと}のせいにします。', 'Kare wa itsumo shippai o hito no sei ni shimasu.', 'Anh ta lúc nào cũng đổ lỗi thất bại cho người khác.'),
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp với ～せいで',
      lines: [
        { who: '{本田先生|ほんだせんせい}', role: 'examiner', text: 'ダニエルさん、どうして{遅|おく}れたんですか。', ro: 'Danieru-san, doushite okureta n desu ka.', vi: 'Daniel, sao em đến muộn?' },
        { who: 'ダニエル', role: 'b', text: 'すみません。{電車|でんしゃ}が{事故|じこ}で{止|と}まったせいで、30{分|ぷん}も{駅|えき}で{待|ま}っていたんです。', ro: 'Sumimasen. Densha ga jiko de tomatta sei de, sanjuppun mo eki de matte ita n desu.', vi: 'Em xin lỗi. Tại tàu dừng vì tai nạn nên em phải chờ ở ga những 30 phút ạ.' },
        { who: '{本田先生|ほんだせんせい}', role: 'examiner', text: 'そうですか。{遅延証明書|ちえんしょうめいしょ}はもらいましたか。', ro: 'Sou desu ka. Chien shoumeisho wa moraimashita ka.', vi: 'Thế à. Em đã lấy giấy chứng nhận tàu trễ chưa?' },
        { who: 'ダニエル', role: 'b', text: 'はい、これです。……あの、{実|じつ}は{昨日|きのう}の{小|しょう}テストも{悪|わる}かったんですが、それは{熱|ねつ}があったせいなんです。', ro: 'Hai, kore desu. …… Ano, jitsu wa kinou no shou tesuto mo warukatta n desu ga, sore wa netsu ga atta sei na n desu.', vi: 'Vâng, đây ạ. … À, thật ra bài kiểm tra nhỏ hôm qua em cũng làm kém, nhưng đó là tại em bị sốt ạ.' },
        { who: '{本田先生|ほんだせんせい}', role: 'examiner', text: '{全部|ぜんぶ}{何|なに}かのせいにしないで、{今日|きょう}からしっかり{勉強|べんきょう}しましょう。', ro: 'Zenbu nani ka no sei ni shinaide, kyou kara shikkari benkyou shimashou.', vi: 'Đừng cái gì cũng đổ lỗi cho thứ khác, từ hôm nay học hành cho đàng hoàng nhé.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — ［nguyên nhân］せいで、［kết quả xấu］',
      head: ['Nguyên nhân', '＋ せいで', 'Kết quả xấu', 'Câu', 'Romaji'],
      rows: [
        ['{雨|あめ}', '{雨|あめ}のせいで', '{試合|しあい}が{中止|ちゅうし}になる', '{雨|あめ}のせいで、{試合|しあい}が{中止|ちゅうし}になった。', 'Ame no sei de, shiai ga chuushi ni natta.'],
        ['{寝坊|ねぼう}した', '{寝坊|ねぼう}したせいで', 'バスに{乗|の}り{遅|おく}れる', '{寝坊|ねぼう}したせいで、バスに{乗|の}り{遅|おく}れた。', 'Nebou shita sei de, basu ni noriokureta.'],
        ['{食|た}べすぎた', '{食|た}べすぎたせいで', 'お{腹|なか}が{痛|いた}い', '{食|た}べすぎたせいで、お{腹|なか}が{痛|いた}い。', 'Tabesugita sei de, onaka ga itai.'],
        ['{道|みち}が{狭|せま}い', '{道|みち}が{狭|せま}いせいで', '{事故|じこ}が{多|おお}い', '{道|みち}が{狭|せま}いせいで、{事故|じこ}が{多|おお}い。', 'Michi ga semai sei de, jiko ga ooi.'],
        ['{字|じ}が{下手|へた}な', '{字|じ}が{下手|へた}なせいで', '{読|よ}んでもらえない', '{字|じ}が{下手|へた}なせいで、{読|よ}んでもらえなかった。', 'Ji ga heta na sei de, yonde moraenakatta.'],
        ['{物価|ぶっか}が{上|あ}がっている', '{物価|ぶっか}が{上|あ}がっているせいで', '{生活|せいかつ}が{苦|くる}しい', '{物価|ぶっか}が{上|あ}がっているせいで、{生活|せいかつ}が{苦|くる}しい。', 'Bukka ga agatte iru sei de, seikatsu ga kurushii.'],
        ['{戦争|せんそう}', '{戦争|せんそう}のせいで', '{家|いえ}を{失|うしな}う', '{戦争|せんそう}のせいで、{多|おお}くの{人|ひと}が{家|いえ}を{失|うしな}った。', 'Sensou no sei de, ooku no hito ga ie o ushinatta.'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～せいで (sai → đúng)',
      items: [
        '~~{先生|せんせい}のせいで、{合格|ごうかく}できました~~ → **{先生|せんせい}のおかげで** — kết quả TỐT không dùng せいで. Đây là lỗi bị bắt nhiều nhất.',
        '~~{雨|あめ}だせいで~~ / ~~{複雑|ふくざつ}のせいで~~ → **{雨|あめ}のせいで** / **{複雑|ふくざつ}なせいで** — せい là danh từ: N **の**, ナA **な**.',
        '~~{雨|あめ}のせいで、{家|いえ}で{映画|えいが}を{見|み}ましょう~~ → **{雨|あめ}だから／{雨|あめ}なので、{家|いえ}で{映画|えいが}を{見|み}ましょう** — vế sau là **lời rủ, lời nhờ, ý chí** thì せいで không hợp (せいで kể kết quả đã xảy ra).',
        '⚠ Dùng **せいで** với người nghe / người trên là **đổ lỗi trực tiếp** — rất nặng: ~~{部長|ぶちょう}のせいで{失敗|しっぱい}しました~~ (nói trước mặt sếp = gây chuyện). Với chuyện của mình, nói **{私|わたし}のせいです** (là lỗi của tôi) là cách nhận lỗi lịch sự.',
        '**せいで ≠ せいか**: せいで — người nói **chắc** đó là thủ phạm; せいか — chỉ **đoán** (mục ②).',
      ],
    },
    { t: 'rule', formula: 'V普通形・イA・ナAな・Nの ＋ せいで、［kết quả xấu］ · ～のは～せいだ · ～を～のせいにする', vi: '"Tại … nên …" — kết quả xấu, người nói đổ lỗi. Không dùng cho kết quả tốt (→ おかげで) và không đi với vế sau là lời rủ / nhờ.' },

    /* ══════ ② せいか ══════ */
    { t: 'h', text: '② ～せいか — "có lẽ tại / chắc là vì… (người nói KHÔNG CHẮC)"' },
    {
      t: 'p',
      text: 'Thêm **か** (dấu hỏi) vào せい: người nói **đoán** A là nguyên nhân của B nhưng **không dám chắc** — "**không biết có phải tại… không mà…**", "**chắc là vì…**". Vế sau thường là kết quả **xấu hoặc trung tính** (mệt, ít người, khác thường); đôi khi cả kết quả tốt ({運動|うんどう}を{始|はじ}めたせいか、{体|からだ}の{調子|ちょうし}がいい — chấp nhận được, nhưng đề N3 thường cho kết quả xấu / trung tính). Cuối câu hay có **～ようだ／～みたいだ／～気がする**. Cụm cố định: **{気|き}のせいか** ("không biết có phải mình tưởng tượng không, nhưng…") và **{気|き}のせいだ** ("chỉ là tưởng tượng thôi").',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '［nguyên nhân phỏng đoán］＋ せいか、［kết quả］（～ようだ・～気がする）',
          vi: 'Nối giống せいで (V thể thường・イA・ナAな・Nの). Câu hỏi: **どうしたんですか** → **～せいか、～んです**.',
          examples: [
            E('{年|とし}のせいか、{最近|さいきん}{疲|つか}れやすくなりました。', 'Toshi no sei ka, saikin tsukareyasuku narimashita.', 'Chắc tại tuổi tác mà dạo này tôi dễ mệt.'),
            E('{緊張|きんちょう}していたせいか、{自分|じぶん}の{名前|なまえ}を{間違|まちが}えてしまいました。', 'Kinchou shite ita sei ka, jibun no namae o machigaete shimaimashita.', 'Chắc vì căng thẳng mà tôi viết nhầm cả tên mình.'),
            E('{天気|てんき}がいいせいか、{公園|こうえん}は{人|ひと}が{多|おお}いです。', 'Tenki ga ii sei ka, kouen wa hito ga ooi desu.', 'Chắc vì trời đẹp mà công viên đông người. (trung tính)'),
            E('{薬|くすり}を{飲|の}んだせいか、{眠|ねむ}くなってきました。', 'Kusuri o nonda sei ka, nemuku natte kimashita.', 'Chắc tại uống thuốc mà tôi bắt đầu buồn ngủ.'),
            E('{梅雨|つゆ}のせいか、{体|からだ}がだるいです。', 'Tsuyu no sei ka, karada ga darui desu.', 'Chắc tại mùa mưa mà người uể oải.'),
            E('{景気|けいき}が{悪|わる}いせいか、{店|みせ}のお{客|きゃく}さんが{少|すく}ないようです。', 'Keiki ga warui sei ka, mise no okyaku-san ga sukunai you desu.', 'Có lẽ tại kinh tế khó khăn mà quán có vẻ ít khách.'),
          ],
        },
        {
          formula: '{気|き}のせいか、～ · ～のは{気|き}のせいだ · 「{気|き}のせいだよ」',
          vi: '**{気|き}のせいか** mở đầu một nhận xét mình không chắc; **{気|き}のせいだ** phủ nhận cảm giác (của mình / của bạn) là thật.',
          examples: [
            E('{気|き}のせいか、{彼女|かのじょ}は{最近|さいきん}{元気|げんき}がないようです。', 'Ki no sei ka, kanojo wa saikin genki ga nai you desu.', 'Không biết có phải tôi tưởng tượng không, dạo này cô ấy có vẻ không khoẻ.'),
            E('{誰|だれ}かいる{気|き}がしたけど、{気|き}のせいでした。', 'Dareka iru ki ga shita kedo, ki no sei deshita.', 'Tưởng có ai đó, nhưng hoá ra là tưởng tượng.'),
            E('「{地震|じしん}？{今|いま}、{揺|ゆ}れなかった？」「{気|き}のせいだよ。」', '"Jishin? Ima, yurenakatta?" "Ki no sei da yo."', '"Động đất à? Vừa rồi có rung không?" "Cậu tưởng tượng thôi."'),
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp với ～せいか',
      lines: [
        { who: 'マリヤム', role: 'a', text: 'リンさん、{顔色|かおいろ}が{悪|わる}いけど、どうしたの？', ro: 'Rin-san, kaoiro ga warui kedo, dou shita no?', vi: 'Linh, sắc mặt em kém thế, sao vậy?' },
        { who: 'リン', role: 'c', text: '{昨日|きのう}、{雨|あめ}にぬれたせいか、{少|すこ}し{寒気|さむけ}がするんです。', ro: 'Kinou, ame ni nureta sei ka, sukoshi samuke ga suru n desu.', vi: 'Chắc tại hôm qua bị mắc mưa mà em thấy hơi ớn lạnh ạ.' },
        { who: 'マリヤム', role: 'a', text: '{今日|きょう}は{早|はや}く{寝|ね}たほうがいいよ。……それに、{気|き}のせいか、{最近|さいきん}{寮|りょう}の{中|なか}も{寒|さむ}くない？', ro: 'Kyou wa hayaku neta hou ga ii yo. …… Sore ni, ki no sei ka, saikin ryou no naka mo samuku nai?', vi: 'Hôm nay em nên ngủ sớm đi. … Mà không biết có phải chị tưởng tượng không, dạo này trong ký túc xá cũng lạnh nhỉ?' },
        { who: 'リン', role: 'c', text: '{気|き}のせいじゃないですよ。{暖房|だんぼう}が{壊|こわ}れているせいです。{管理人|かんりにん}さんに{言|い}いましょう。', ro: 'Ki no sei ja nai desu yo. Danbou ga kowarete iru sei desu. Kanrinin-san ni iimashou.', vi: 'Không phải tưởng tượng đâu ạ. Là tại máy sưởi đang hỏng đấy. Mình báo chú quản lý đi.' },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～せいか',
      items: [
        '~~{雨|あめ}のせいか、{試合|しあい}は{中止|ちゅうし}だ~~ (thông báo chính thức) → **{雨|あめ}のため、{試合|しあい}は{中止|ちゅうし}です** — sự thật đã rõ thì không "đoán". せいか chỉ dùng khi **không chắc**.',
        '**せいか ↔ せいで**: 「{寝不足|ねぶそく}のせいで{頭|あたま}が{痛|いた}い」 — tôi biết rõ; 「{寝不足|ねぶそく}のせいか{頭|あたま}が{痛|いた}い」 — chắc vậy. Khi kể với bác sĩ, giáo viên mà không chắc → せいか nghe khiêm tốn hơn.',
        '**Kết quả tốt** nhưng không chắc nguyên nhân: người Nhật hay nói **おかげか** ({新|あたら}しい{薬|くすり}のおかげか、{調子|ちょうし}がいい). せいか cho kết quả tốt vẫn gặp, nhưng trong đề N3, gặp kết quả TỐT + nguyên nhân chắc chắn thì chọn **おかげで**.',
      ],
    },
    { t: 'rule', formula: 'V普通形・イA・ナAな・Nの ＋ せいか、［kết quả］（～ようだ）', vi: '"Chắc là tại …" — đoán nguyên nhân, không chắc. Cụm: 気のせいか (không biết có phải tưởng tượng không) · 気のせいだ (chỉ là tưởng tượng).' },

    /* ══════ ③ おかげで ══════ */
    { t: 'h', text: '③ ～おかげで／～おかげだ — "nhờ… (kết quả TỐT, người nói biết ơn)"' },
    {
      t: 'p',
      text: 'Đối xứng với せいで: vế sau là **kết quả tốt**, người nói **biết ơn** nguyên nhân (người giúp, thuốc, thời tiết tốt, sự cố gắng). Gốc của từ là **{陰|かげ}** (bóng râm — "được che chở dưới bóng của…"), nên **おかげさまで** (Bài 12) là lời cảm ơn chung chung. Ba dạng: **AおかげでB** · **BのはAのおかげだ** · **～てくれたおかげで／～てもらったおかげで** (người khác làm giúp — ôn Bài 18). ⚠ Dùng おかげで với **kết quả xấu** = **mỉa mai** ("nhờ ơn cậu mà…" = tại cậu) — như câu anh 小林 ở hội thoại ③.',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '［nguyên nhân］＋ おかげで、［kết quả TỐT］',
          vi: '"**Nhờ** … mà …". Câu hỏi: **どうして～できたんですか** → **～おかげです**.',
          examples: [
            E('{先生|せんせい}のおかげで、N3に{合格|ごうかく}できました。', 'Sensei no okage de, enu-san ni goukaku dekimashita.', 'Nhờ thầy mà em đỗ N3.'),
            E('{薬|くすり}を{飲|の}んだおかげで、{熱|ねつ}が{下|さ}がりました。', 'Kusuri o nonda okage de, netsu ga sagarimashita.', 'Nhờ uống thuốc mà hạ sốt.'),
            E('{駅|えき}が{近|ちか}いおかげで、{通学|つうがく}が{楽|らく}です。', 'Eki ga chikai okage de, tsuugaku ga raku desu.', 'Nhờ nhà ga gần mà đi học nhàn.'),
            E('{毎日|まいにち}{練習|れんしゅう}したおかげで、{日本語|にほんご}が{上手|じょうず}になりました。', 'Mainichi renshuu shita okage de, nihongo ga jouzu ni narimashita.', 'Nhờ luyện tập mỗi ngày mà tiếng Nhật của tôi giỏi lên.'),
            E('{友達|ともだち}が{手伝|てつだ}ってくれたおかげで、{引|ひ}っ{越|こ}しが{早|はや}く{終|お}わりました。', 'Tomodachi ga tetsudatte kureta okage de, hikkoshi ga hayaku owarimashita.', 'Nhờ bạn giúp mà chuyển nhà xong sớm.'),
            E('{天気|てんき}がよかったおかげで、{富士山|ふじさん}がきれいに{見|み}えました。', 'Tenki ga yokatta okage de, Fujisan ga kirei ni miemashita.', 'Nhờ trời đẹp mà nhìn thấy núi Phú Sĩ rõ.'),
            E('この{町|まち}は{交通|こうつう}が{便利|べんり}なおかげで、{住|す}む{人|ひと}が{増|ふ}えています。', 'Kono machi wa koutsuu ga benri na okage de, sumu hito ga fuete imasu.', 'Thị trấn này nhờ giao thông tiện mà người đến ở ngày càng đông.'),
          ],
        },
        {
          formula: '［kết quả tốt］のは、［nguyên nhân］のおかげだ · おかげさまで · （mỉa mai）［nguyên nhân］のおかげで、［kết quả XẤU］',
          vi: '**～のは～おかげです** = câu cảm ơn trang trọng (phát biểu, thư cảm ơn). Mỉa mai: giọng trêu hoặc bực, nghĩa thật là せいで.',
          examples: [
            E('{合格|ごうかく}できたのは、{皆|みな}さんのおかげです。', 'Goukaku dekita no wa, minasan no okage desu.', 'Tôi đỗ được là nhờ mọi người.'),
            E('{留学|りゅうがく}を{続|つづ}けられたのは、{家族|かぞく}が{支|ささ}えてくれたおかげです。', 'Ryuugaku o tsuzukerareta no wa, kazoku ga sasaete kureta okage desu.', 'Tôi tiếp tục du học được là nhờ gia đình đã nâng đỡ.'),
            E('「お{元気|げんき}ですか。」「はい、おかげさまで。」', '"Ogenki desu ka." "Hai, okagesama de."', '"Anh khoẻ không?" "Vâng, nhờ trời (cảm ơn anh)." (ôn Bài 12)'),
            E('{君|きみ}が{寝坊|ねぼう}したおかげで、{電車|でんしゃ}に{乗|の}り{遅|おく}れたよ。', 'Kimi ga nebou shita okage de, densha ni noriokureta yo.', '"Nhờ" cậu ngủ quên mà mình lỡ tàu đấy. (mỉa mai = せいで)'),
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp với ～おかげで',
      lines: [
        { who: '{佐藤先生|さとうせんせい}', role: 'a', text: 'リンさん、レポート、とてもよく{書|か}けていましたよ。', ro: 'Rin-san, repooto, totemo yoku kakete imashita yo.', vi: 'Linh, bài báo cáo của em viết rất tốt.' },
        { who: 'リン', role: 'c', text: 'ありがとうございます。{先生|せんせい}が{紹介|しょうかい}してくださった{本|ほん}のおかげです。', ro: 'Arigatou gozaimasu. Sensei ga shoukai shite kudasatta hon no okage desu.', vi: 'Em cảm ơn cô ạ. Là nhờ những quyển sách cô đã giới thiệu.' },
        { who: '{佐藤先生|さとうせんせい}', role: 'a', text: '{日本語|にほんご}も、{前|まえ}よりずっと{自然|しぜん}になりましたね。', ro: 'Nihongo mo, mae yori zutto shizen ni narimashita ne.', vi: 'Tiếng Nhật của em cũng tự nhiên hơn trước nhiều rồi.' },
        { who: 'リン', role: 'c', text: '{寮|りょう}の{日本人|にほんじん}の{友達|ともだち}が、{毎日|まいにち}{話|はな}してくれるおかげだと{思|おも}います。', ro: 'Ryou no nihonjin no tomodachi ga, mainichi hanashite kureru okage da to omoimasu.', vi: 'Em nghĩ là nhờ các bạn người Nhật ở ký túc xá ngày nào cũng nói chuyện với em ạ.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — ［nguyên nhân］おかげで、［kết quả tốt］',
      head: ['Nguyên nhân', '＋ おかげで', 'Kết quả tốt', 'Câu', 'Romaji'],
      rows: [
        ['{先輩|せんぱい}のアドバイス', '{先輩|せんぱい}のアドバイスのおかげで', '{面接|めんせつ}がうまくいく', '{先輩|せんぱい}のアドバイスのおかげで、{面接|めんせつ}がうまくいった。', 'Senpai no adobaisu no okage de, mensetsu ga umaku itta.'],
        ['{早|はや}く{家|いえ}を{出|で}た', '{早|はや}く{家|いえ}を{出|で}たおかげで', '{渋滞|じゅうたい}に{巻|ま}き{込|こ}まれない', '{早|はや}く{家|いえ}を{出|で}たおかげで、{渋滞|じゅうたい}に{巻|ま}き{込|こ}まれなかった。', 'Hayaku ie o deta okage de, juutai ni makikomarenakatta.'],
        ['{天気予報|てんきよほう}を{見|み}ていた', '{天気予報|てんきよほう}を{見|み}ていたおかげで', '{傘|かさ}を{持|も}っていける', '{天気予報|てんきよほう}を{見|み}ていたおかげで、{傘|かさ}を{持|も}っていけた。', 'Tenki yohou o mite ita okage de, kasa o motte iketa.'],
        ['{家賃|やちん}が{安|やす}い', '{家賃|やちん}が{安|やす}いおかげで', '{貯金|ちょきん}ができる', '{家賃|やちん}が{安|やす}いおかげで、{貯金|ちょきん}ができる。', 'Yachin ga yasui okage de, chokin ga dekiru.'],
        ['{店長|てんちょう}が{親切|しんせつ}な', '{店長|てんちょう}が{親切|しんせつ}なおかげで', 'アルバイトが{楽|たの}しい', '{店長|てんちょう}が{親切|しんせつ}なおかげで、アルバイトが{楽|たの}しい。', 'Tenchou ga shinsetsu na okage de, arubaito ga tanoshii.'],
        ['インターネット', 'インターネットのおかげで', '{家族|かぞく}と{毎日|まいにち}{話|はな}せる', 'インターネットのおかげで、{家族|かぞく}と{毎日|まいにち}{話|はな}せる。', 'Intaanetto no okage de, kazoku to mainichi hanaseru.'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～おかげで',
      items: [
        '~~{雨|あめ}のおかげで、{試合|しあい}が{中止|ちゅうし}になった~~ (kể nghiêm túc) → **{雨|あめ}のせいで** — kết quả xấu. Chỉ dùng おかげ cho chuyện xấu khi **cố ý mỉa mai**.',
        '~~{友達|ともだち}が{手伝|てつだ}ったおかげで~~ → **{手伝|てつだ}ってくれたおかげで** — khi người khác giúp mình, tiếng Nhật gần như luôn thêm **～てくれた** để tỏ lòng biết ơn (ôn Bài 18).',
        '~~{便利|べんり}のおかげで~~ → **{便利|べんり}なおかげで**; ~~{先生|せんせい}だおかげで~~ → **{先生|せんせい}のおかげで**.',
        '~~おかげで、{一緒|いっしょ}に{行|い}きましょう~~ — vế sau KHÔNG là lời rủ / nhờ / mệnh lệnh; おかげで kể **kết quả đã có**.',
        'Câu trả lời mẫu cho thi nói: **～ことができたのは、～のおかげです。{本当|ほんとう}に{感謝|かんしゃ}しています** — một câu "ăn điểm" khi kể về người mình biết ơn.',
      ],
    },
    { t: 'rule', formula: 'V普通形・イA・ナAな・Nの ＋ おかげで、［kết quả tốt］ · ～のは～おかげだ · ～てくれたおかげで', vi: '"Nhờ … mà …" — kết quả tốt, người nói biết ơn. Dùng với kết quả xấu = mỉa mai (nghĩa thật là せいで).' },
    {
      t: 'table',
      caption: 'So nhanh ①②③ — cùng một nguyên nhân, ba cách nhìn',
      head: ['Mẫu', 'Kết quả', 'Người nói chắc?', 'Thái độ', 'Ví dụ'],
      rows: [
        ['～せいで', 'xấu', 'chắc', 'trách, bực, tiếc', '{雨|あめ}のせいで、{花火大会|はなびたいかい}が{中止|ちゅうし}になった。'],
        ['～せいか', 'xấu / trung tính', 'KHÔNG chắc', 'đoán', '{雨|あめ}のせいか、{今日|きょう}は{客|きゃく}が{少|すく}ない。'],
        ['～おかげで', 'tốt', 'chắc', 'biết ơn, vui', '{雨|あめ}のおかげで、{涼|すず}しくなった。'],
        ['～おかげで (mỉa mai)', 'xấu', 'chắc', 'trêu, mát mẻ', '{君|きみ}のおかげで、{大変|たいへん}だったよ。'],
      ],
    },

    /* ══════ ④ ため — nguyên nhân ══════ */
    { t: 'h', text: '④ ～ため（に）／～ためだ — "do, vì…" chỉ NGUYÊN NHÂN (văn viết, thông báo, tin tức)' },
    {
      t: 'p',
      text: 'Ở Bài 21 bạn đã học **～ために** = "**để**" (mục đích: {留学|りゅうがく}するために{貯金|ちょきん}する). Cùng chữ ため đó còn nghĩa thứ hai: **nguyên nhân** — "**do…, vì…**". Đây là cách nói **khách quan, trang trọng**: bản tin, loa ở ga, biển báo, email công việc, bài văn. Người nói **không khen không chê** — chỉ nêu sự thật. Trong hội thoại với bạn bè, người Nhật nói **から／ので**; nghe ため trong lời nói là biết người đó đang **thuật lại thông báo** hoặc nói **rất lịch sự**. Dạng cuối câu **～のは～ためだ** = "… là do …" (rất hay gặp trong bài đọc: giải thích nguyên nhân).',
    },
    {
      t: 'table',
      caption: 'Cách nối ～ため (nguyên nhân)',
      head: ['Loại từ', 'Khuôn', 'Ví dụ', 'Romaji'],
      rows: [
        ['Động từ (thể thường — thường là Vた, Vている, Vない)', 'V{普通形|ふつうけい} ＋ ため（に）', '{事故|じこ}があった**ため** · {工事|こうじ}をしている**ため** · {雪|ゆき}が{降|ふ}らない**ため**', 'jiko ga atta tame · kouji o shite iru tame · yuki ga furanai tame'],
        ['Tính từ い', 'イA ＋ ため（に）', '{気温|きおん}が{高|たか}い**ため** · {天候|てんこう}が{悪|わる}かった**ため**', 'kion ga takai tame · tenkou ga warukatta tame'],
        ['Tính từ な', 'ナA な／である ＋ ため', '{道|みち}が{不便|ふべん}な**ため** · {危険|きけん}である**ため**', 'michi ga fuben na tame · kiken de aru tame'],
        ['Danh từ', 'N の／である ＋ ため', '{大雨|おおあめ}の**ため** · {工事中|こうじちゅう}の**ため** · {休日|きゅうじつ}である**ため**', 'ooame no tame · koujichuu no tame · kyuujitsu de aru tame'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '［nguyên nhân］＋ ため（に）、［kết quả — sự thật］',
          vi: 'Trong thông báo, **に** thường bị lược: {大雨|おおあめ}のため、～. Vế sau là **sự thật** (đã / đang xảy ra, hoặc quyết định chính thức).',
          examples: [
            E('{大雨|おおあめ}のため、{電車|でんしゃ}が{止|と}まっています。', 'Ooame no tame, densha ga tomatte imasu.', 'Do mưa lớn, tàu đang dừng.'),
            E('{事故|じこ}があったため、{道路|どうろ}が{渋滞|じゅうたい}しています。', 'Jiko ga atta tame, douro ga juutai shite imasu.', 'Do có tai nạn, đường đang tắc.'),
            E('{工事中|こうじちゅう}のため、この{道|みち}は{通|とお}れません。', 'Koujichuu no tame, kono michi wa tooremasen.', 'Do đang thi công, không đi qua đường này được.'),
            E('{気温|きおん}が{高|たか}いため、{体調|たいちょう}に{気|き}をつけてください。', 'Kion ga takai tame, taichou ni ki o tsukete kudasai.', 'Do nhiệt độ cao, xin hãy giữ gìn sức khoẻ. (thông báo)'),
            E('{少子化|しょうしか}のため、{子|こ}どもの{数|かず}が{減|へ}っています。', 'Shoushika no tame, kodomo no kazu ga hette imasu.', 'Do tỉ lệ sinh giảm, số trẻ em đang giảm.'),
            E('{今年|ことし}は{雪|ゆき}が{少|すく}ないため、スキー{場|じょう}が{困|こま}っています。', 'Kotoshi wa yuki ga sukunai tame, sukiijou ga komatte imasu.', 'Năm nay do ít tuyết nên các khu trượt tuyết đang khó khăn.'),
            E('{準備|じゅんび}が{間|ま}に{合|あ}わなかったため、{発表|はっぴょう}を{延期|えんき}しました。', 'Junbi ga ma ni awanakatta tame, happyou o enki shimashita.', 'Do chuẩn bị không kịp, chúng tôi đã hoãn buổi thuyết trình.'),
          ],
        },
        {
          formula: '［kết quả］のは、［nguyên nhân］ためだ／ためです',
          vi: 'Câu giải thích kiểu bài báo / bài đọc: "**… là do …**". Đề đọc hiểu N3 rất hay hỏi 「どうしてですか」 và đáp án nằm ở câu ～ためだ.',
          examples: [
            E('{電車|でんしゃ}が{遅|おく}れたのは、{信号|しんごう}が{故障|こしょう}したためです。', 'Densha ga okureta no wa, shingou ga koshou shita tame desu.', 'Tàu chậm là do tín hiệu bị hỏng.'),
            E('{野菜|やさい}が{高|たか}いのは、{天候|てんこう}が{悪|わる}かったためだ。', 'Yasai ga takai no wa, tenkou ga warukatta tame da.', 'Rau đắt là do thời tiết xấu.'),
            E('{試合|しあい}が{中止|ちゅうし}になったのは、{台風|たいふう}が{近|ちか}づいているためです。', 'Shiai ga chuushi ni natta no wa, taifuu ga chikazuite iru tame desu.', 'Trận đấu bị huỷ là do bão đang đến gần.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: '⭐ ため MỤC ĐÍCH (Bài 21) ↔ ため NGUYÊN NHÂN (Bài 27) — đề N3 rất hay gài',
      head: ['', 'Mục đích "để…" (Bài 21)', 'Nguyên nhân "do…" (Bài 27)'],
      rows: [
        ['Động từ đứng trước', 'V{辞書形|じしょけい} của động từ CHỦ Ý ({買|か}う・{行|い}く・{合格|ごうかく}する)', 'thường Vた・Vている・Vない (sự việc đã / đang xảy ra) — hoặc động từ không chủ ý'],
        ['Tính từ đứng trước', '✗ không có', '○ {高|たか}いため・{不便|ふべん}なため'],
        ['Danh từ', 'N の ために = vì LỢI ÍCH của N ({家族|かぞく}のために{働|はたら}く)', 'N の ため = vì SỰ VIỆC N ({雨|あめ}のため・{事故|じこ}のため)'],
        ['Vế sau', 'việc người nói CHỦ Ý làm (貯金する・勉強する)', 'KẾT QUẢ, sự thật (止まった・中止になった・渋滞している)'],
        ['Ví dụ', '{日本|にほん}の{大学|だいがく}に{入|はい}るために、{勉強|べんきょう}している。', '{日本|にほん}の{大学|だいがく}に{入|はい}ったため、{国|くに}を{出|で}た。'],
        ['Phủ định', '✗ ~~{忘|わす}れないために~~ → {忘|わす}れないように (Bài 21)', '○ {雨|あめ}が{降|ふ}らないため、{水|みず}が{足|た}りない。'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp: thuật lại thông báo bằng ～ため',
      lines: [
        { who: 'カルロス', role: 'b', text: 'アンナさん、{駅|えき}の{放送|ほうそう}、{何|なん}て{言|い}ってた？{速|はや}くて{分|わ}からなかった。', ro: 'Anna-san, eki no housou, nan te itteta? Hayakute wakaranakatta.', vi: 'Anna, loa ở ga vừa nói gì thế? Nhanh quá mình không hiểu.' },
        { who: 'アンナ', role: 'a', text: '「{線路|せんろ}に{木|き}が{倒|たお}れたため、{運転|うんてん}を{見合|みあ}わせています」だって。', ro: '"Senro ni ki ga taoreta tame, unten o miawasete imasu" datte.', vi: 'Họ bảo "Do cây đổ xuống đường ray nên tàu đang tạm dừng chạy".' },
        { who: 'カルロス', role: 'b', text: 'えっ、いつ{動|うご}くの？', ro: 'E, itsu ugoku no?', vi: 'Hả, bao giờ chạy lại?' },
        { who: 'アンナ', role: 'a', text: 'まだ{分|わ}からないって。バスで{行|い}こうよ。{雨|あめ}だから、バスも{混|こ}むかもしれないけど。', ro: 'Mada wakaranai tte. Basu de ikou yo. Ame da kara, basu mo komu kamo shirenai kedo.', vi: 'Họ bảo chưa biết. Mình đi xe buýt đi. Trời mưa nên có khi xe buýt cũng đông đấy.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — ［nguyên nhân］ため、［kết quả］(giọng thông báo)',
      head: ['Nguyên nhân', '＋ ため', 'Kết quả', 'Câu', 'Romaji'],
      rows: [
        ['{台風|たいふう}', '{台風|たいふう}のため', '{全便|ぜんびん}が{欠航|けっこう}する', '{台風|たいふう}のため、{全便|ぜんびん}が{欠航|けっこう}となりました。', 'Taifuu no tame, zenbin ga kekkou to narimashita.'],
        ['{信号|しんごう}が{故障|こしょう}した', '{信号|しんごう}が{故障|こしょう}したため', '{電車|でんしゃ}が{遅|おく}れる', '{信号|しんごう}が{故障|こしょう}したため、{電車|でんしゃ}が{遅|おく}れています。', 'Shingou ga koshou shita tame, densha ga okurete imasu.'],
        ['{雪|ゆき}が{積|つ}もっている', '{雪|ゆき}が{積|つ}もっているため', '{通行止|つうこうど}めになる', '{雪|ゆき}が{積|つ}もっているため、{道路|どうろ}は{通行止|つうこうど}めです。', 'Yuki ga tsumotte iru tame, douro wa tsuukoudome desu.'],
        ['{参加者|さんかしゃ}が{少|すく}ない', '{参加者|さんかしゃ}が{少|すく}ないため', '{中止|ちゅうし}する', '{参加者|さんかしゃ}が{少|すく}ないため、{今回|こんかい}のツアーは{中止|ちゅうし}します。', 'Sankasha ga sukunai tame, konkai no tsuaa wa chuushi shimasu.'],
        ['{店内|てんない}が{改装中|かいそうちゅう}', '{改装中|かいそうちゅう}のため', '{休業|きゅうぎょう}する', '{改装中|かいそうちゅう}のため、しばらく{休業|きゅうぎょう}いたします。', 'Kaisouchuu no tame, shibaraku kyuugyou itashimasu.'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～ため (nguyên nhân)',
      items: [
        '~~{雨|あめ}だため~~ / ~~{不便|ふべん}ため~~ → **{雨|あめ}のため** / **{不便|ふべん}なため** — ため là danh từ (giống せい, おかげ).',
        '~~（{友達|ともだち}に）{雨|あめ}のため、{傘|かさ}を{持|も}っていって~~ → **{雨|あめ}だから、{傘|かさ}を{持|も}っていって** — với bạn bè, lời khuyên / nhờ → から／ので. ため hợp văn viết, thông báo (thông báo thì có thể có 「～ため、ご{注意|ちゅうい}ください」 — đó là văn phong lịch sự của nhà ga, nhà trường).',
        '**Câu mơ hồ**: 「{勉強|べんきょう}するため」 → mục đích (để học); 「{勉強|べんきょう}したため」 → nguyên nhân (vì đã học). Nhìn **thể động từ + vế sau** mà đoán: {試験|しけん}に{合格|ごうかく}する**ために**{勉強|べんきょう}した (mục đích) ↔ よく{勉強|べんきょう}した**ため**、{合格|ごうかく}できた (nguyên nhân).',
        '**N の ため** hai nghĩa: {子|こ}どものために{料理|りょうり}を{作|つく}る (vì LỢI ÍCH của con → mục đích) ↔ {子|こ}どもの{病気|びょうき}のため、{会社|かいしゃ}を{休|やす}んだ (vì SỰ VIỆC con ốm → nguyên nhân). Người / tổ chức + ために = thường là "vì lợi ích"; sự việc, hiện tượng + ため = nguyên nhân.',
        '**ため ↔ で (ポイント 124)**: {台風|たいふう}**で**{電車|でんしゃ}が{止|と}まった (văn nói) = {台風|たいふう}**のため**、{電車|でんしゃ}が{止|と}まった (văn viết / thông báo). Nghĩa giống nhau, chỉ khác văn phong.',
      ],
    },
    { t: 'rule', formula: 'V普通形・イA・ナAな・Nの ＋ ため（に）、［kết quả — sự thật］ · ～のは～ためだ', vi: '"Do …, …" — nguyên nhân, giọng khách quan (thông báo, tin tức, văn viết). Khác ために mục đích (V辞書形 chủ ý + việc mình làm). Nói chuyện thường ngày → から／ので.' },

    /* ══════ ⑤ によって — nguyên nhân ══════ */
    { t: 'h', text: '⑤ ～によって／～により／～による N — "do… (gây ra)" — NGUYÊN NHÂN trong tin tức, văn viết' },
    {
      t: 'p',
      text: '**によって** là động từ {因|よ}る ("dựa vào, do") ở thể て. Nghĩa thứ nhất: **nguyên nhân** của một sự việc **lớn, khách quan** — thiên tai, tai nạn, thay đổi xã hội. Gần như chỉ gặp trong **bản tin, bài báo, sách**. Ba hình thức: **N によって**、～ (giữa câu) · **N により**、～ (văn viết trang trọng hơn nữa — bảng thông báo, báo giấy) · **N1 による N2** ("N2 do N1 gây ra" — bổ nghĩa danh từ). Chỉ đứng sau **danh từ**. Văn nói thường ngày: **N で** (ポイント 124) hoặc **N のせいで／N のため**.',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N ＋ によって／により、［kết quả lớn: hư hại, thay đổi］',
          vi: 'Vế sau hay ở **bị động** hoặc **tự động từ** (壊れた, 止まった, 変わった, 被害を受けた).',
          examples: [
            E('{台風|たいふう}によって、{多|おお}くの{家|いえ}が{壊|こわ}れました。', 'Taifuu ni yotte, ooku no ie ga kowaremashita.', 'Do bão, nhiều ngôi nhà bị hư hại.'),
            E('{大雨|おおあめ}により、{川|かわ}の{水|みず}が{増|ふ}えています。', 'Ooame ni yori, kawa no mizu ga fuete imasu.', 'Do mưa lớn, nước sông đang dâng. (văn bản tin)'),
            E('{大雪|おおゆき}によって、{高速道路|こうそくどうろ}が{通行止|つうこうど}めになりました。', 'Ooyuki ni yotte, kousoku douro ga tsuukoudome ni narimashita.', 'Do tuyết lớn, đường cao tốc bị cấm lưu thông.'),
            E('{信号|しんごう}の{故障|こしょう}により、{電車|でんしゃ}が{遅|おく}れています。', 'Shingou no koshou ni yori, densha ga okurete imasu.', 'Do tín hiệu hỏng, tàu đang chậm. (loa ở ga)'),
            E('インターネットの{登場|とうじょう}によって、{人々|ひとびと}の{生活|せいかつ}は{大|おお}きく{変|か}わった。', 'Intaanetto no toujou ni yotte, hitobito no seikatsu wa ookiku kawatta.', 'Sự ra đời của Internet đã làm cuộc sống con người thay đổi lớn.'),
          ],
        },
        {
          formula: 'N1 ＋ による ＋ N2 — "N2 do N1 gây ra"',
          vi: 'Hay gặp nhất với **{被害|ひがい}・{事故|じこ}・{渋滞|じゅうたい}・{影響|えいきょう}・{停電|ていでん}・{死者|ししゃ}**. Đề đọc hiểu N3 dùng dạng này rất nhiều trong đoạn tin ngắn.',
          examples: [
            E('{地震|じしん}による{被害|ひがい}は、まだ{分|わ}かっていません。', 'Jishin ni yoru higai wa, mada wakatte imasen.', 'Thiệt hại do động đất vẫn chưa rõ.'),
            E('{事故|じこ}による{渋滞|じゅうたい}が、10キロ{続|つづ}いています。', 'Jiko ni yoru juutai ga, jukkiro tsuzuite imasu.', 'Đoạn tắc do tai nạn kéo dài 10 km.'),
            E('{台風|たいふう}による{停電|ていでん}は、{今朝|けさ}{全部|ぜんぶ}{直|なお}りました。', 'Taifuu ni yoru teiden wa, kesa zenbu naorimashita.', 'Mất điện do bão đã được khắc phục hết sáng nay.'),
            E('{不注意|ふちゅうい}による{事故|じこ}が{増|ふ}えています。', 'Fuchuui ni yoru jiko ga fuete imasu.', 'Tai nạn do bất cẩn đang tăng.'),
            E('{寝不足|ねぶそく}による{居眠|いねむ}り{運転|うんてん}は、とても{危険|きけん}です。', 'Nebusoku ni yoru inemuri unten wa, totemo kiken desu.', 'Ngủ gật khi lái xe do thiếu ngủ rất nguy hiểm.'),
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Ghi nhớ ⑤ — によって nguyên nhân',
      items: [
        '**Chỉ sau danh từ**: ~~{雨|あめ}が{降|ふ}ったによって~~ → **{雨|あめ}によって** / {雨|あめ}が{降|ふ}った**ため**.',
        '**Văn phong**: によって／により／による = bản tin, sách báo. Kể với bạn: {台風|たいふう}**で**{家|いえ}が{壊|こわ}れたんだって. Đề N3 đôi khi hỏi "câu nào là văn nói tự nhiên".',
        '**Cụm phải thuộc**: **～による{被害|ひがい}** · **～の{影響|えいきょう}で** (≈ によって, cũng rất hay trong tin) · **～により{遅延|ちえん}** · **～によって{亡|な}くなった** (chết do — tin tức).',
        'Chuyện **nhỏ, riêng tư** không dùng によって: ~~{寝坊|ねぼう}によって{遅刻|ちこく}しました~~ → **{寝坊|ねぼう}して／{寝坊|ねぼう}したせいで{遅刻|ちこく}しました**.',
      ],
    },
    { t: 'rule', formula: 'N ＋ によって／により、［kết quả lớn］ · N1 ＋ による ＋ N2', vi: '"Do N (gây ra)…" — nguyên nhân khách quan trong tin tức, văn viết. Chỉ sau danh từ. Văn nói → N で／N のせいで.' },

    /* ══════ ⑥ によって — cách thức ══════ */
    { t: 'h', text: '⑥ ～によって — "bằng, thông qua…" — CÁCH THỨC, PHƯƠNG TIỆN' },
    {
      t: 'p',
      text: 'Nghĩa thứ hai: **phương tiện / cách** để làm được một việc — "**bằng (cách)…**", "**thông qua…**". Là bản **trang trọng** của trợ từ **で** (phương tiện — {電車|でんしゃ}で{行|い}く). Dùng với cách thức **trừu tượng, lớn**: thảo luận, điều tra, bỏ phiếu, công nghệ, thuốc, luyện tập. Muốn đặt **động từ** trước thì thêm **こと**: **Vること ＋ によって** ("bằng việc …"). ⚠ Không dùng với dụng cụ đơn giản trong đời thường: ~~{箸|はし}によって{食|た}べる~~ → **{箸|はし}で{食|た}べる**.',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N ＋ によって ＋ V（làm được / giải quyết / biết được）',
          vi: 'Câu hỏi: **どうやって～んですか** → **～によって～ます**.',
          examples: [
            E('{話|はな}し{合|あ}いによって、{問題|もんだい}を{解決|かいけつ}しました。', 'Hanashiai ni yotte, mondai o kaiketsu shimashita.', 'Đã giải quyết vấn đề bằng cách thảo luận.'),
            E('{調査|ちょうさ}によって、{事故|じこ}の{原因|げんいん}が{分|わ}かりました。', "Chousa ni yotte, jiko no gen'in ga wakarimashita.", 'Nhờ điều tra mà biết được nguyên nhân tai nạn.'),
            E('インターネットによって、{世界中|せかいじゅう}の{人|ひと}と{話|はな}せるようになりました。', 'Intaanetto ni yotte, sekaijuu no hito to hanaseru you ni narimashita.', 'Thông qua Internet, ta đã có thể nói chuyện với người khắp thế giới.'),
            E('この{病気|びょうき}は、{薬|くすり}によって{治|なお}すことができます。', 'Kono byouki wa, kusuri ni yotte naosu koto ga dekimasu.', 'Bệnh này có thể chữa bằng thuốc.'),
            E('クラスの{代表|だいひょう}は、{投票|とうひょう}によって{決|き}めます。', 'Kurasu no daihyou wa, touhyou ni yotte kimemasu.', 'Lớp trưởng sẽ được chọn bằng bỏ phiếu.'),
          ],
        },
        {
          formula: 'Vこと ＋ によって — "bằng việc …"',
          vi: 'Văn viết, bài luận N3: nêu **cách** để đạt kết quả. Vế sau thường có **～ことができる／～ようになる**.',
          examples: [
            E('{毎日|まいにち}{書|か}くことによって、{漢字|かんじ}を{覚|おぼ}えました。', 'Mainichi kaku koto ni yotte, kanji o oboemashita.', 'Bằng việc viết mỗi ngày, tôi đã nhớ chữ Hán.'),
            E('{手|て}を{洗|あら}うことによって、{病気|びょうき}を{防|ふせ}ぐことができます。', 'Te o arau koto ni yotte, byouki o fusegu koto ga dekimasu.', 'Bằng việc rửa tay, có thể phòng bệnh.'),
            E('ニュースを{聞|き}くことによって、{聞|き}く{力|ちから}が{伸|の}びます。', 'Nyuusu o kiku koto ni yotte, kiku chikara ga nobimasu.', 'Bằng việc nghe tin tức, khả năng nghe sẽ tiến bộ.'),
            E('ごみを{分別|ぶんべつ}することによって、{環境|かんきょう}を{守|まも}ることができます。', 'Gomi o bunbetsu suru koto ni yotte, kankyou o mamoru koto ga dekimasu.', 'Bằng việc phân loại rác, có thể bảo vệ môi trường.'),
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp với ～によって (cách thức)',
      lines: [
        { who: 'カルロス', role: 'b', text: 'リンさんは、どうやってニュースが{聞|き}き{取|と}れるようになったの？', ro: 'Rin-san wa, dou yatte nyuusu ga kikitoreru you ni natta no?', vi: 'Linh này, em làm thế nào mà nghe được tin tức vậy?' },
        { who: 'リン', role: 'c', text: '{毎朝|まいあさ}、{同|おな}じニュースを{三回|さんかい}{聞|き}くことによって、{少|すこ}しずつ{分|わ}かるようになりました。', ro: 'Maiasa, onaji nyuusu o sankai kiku koto ni yotte, sukoshi zutsu wakaru you ni narimashita.', vi: 'Bằng việc mỗi sáng nghe một bản tin ba lần, em dần dần hiểu được.' },
        { who: 'カルロス', role: 'b', text: '{言葉|ことば}は{辞書|じしょ}で{調|しら}べるの？', ro: 'Kotoba wa jisho de shiraberu no?', vi: 'Từ thì em tra từ điển à?' },
        { who: 'リン', role: 'c', text: 'はい、スマホの{辞書|じしょ}で{調|しら}べます。それから、ノートに{書|か}くことによって{覚|おぼ}えています。', ro: 'Hai, sumaho no jisho de shirabemasu. Sorekara, nooto ni kaku koto ni yotte oboete imasu.', vi: 'Vâng, em tra bằng từ điển trên điện thoại. Rồi em nhớ bằng cách chép vào vở.' },
      ],
    },
    {
      t: 'note',
      title: 'Ghi nhớ ⑥ — によって cách thức',
      items: [
        '**で vs によって**: dụng cụ cụ thể, đời thường → **で** ({辞書|じしょ}で{調|しら}べる, バスで{行|い}く, ペンで{書|か}く). Cách thức trừu tượng, văn viết → **によって** ({話|はな}し{合|あ}いによって, {技術|ぎじゅつ}によって). Câu hội thoại trên dùng cả hai đúng chỗ.',
        '**Vること＋によって** — không bỏ こと: ~~{書|か}くによって~~ → **{書|か}くことによって**.',
        '⚠ Nhiều câu **によって** đọc được theo hai nghĩa ⑤ (nguyên nhân) và ⑥ (cách thức): インターネットによって、{生活|せいかつ}が{変|か}わった (do / nhờ Internet). Đề N3 không bắt phân biệt hai nghĩa này — chỉ cần hiểu câu.',
      ],
    },
    { t: 'rule', formula: 'N／Vこと ＋ によって ＋ V（解決する・分かる・できる）', vi: '"Bằng, thông qua…" — cách thức, phương tiện (văn viết của で). Dụng cụ đời thường vẫn dùng で.' },

    /* ══════ ⑦ によって — tuỳ theo ══════ */
    { t: 'h', text: '⑦ ～によって（は）— "tuỳ theo… (mà khác nhau)" · ～によっては "tuỳ … thì có khi…"' },
    {
      t: 'p',
      text: 'Nghĩa thứ ba — **hay vào đề N3 nhất**: "**tuỳ theo** N **mà** khác nhau". Dấu hiệu chắc chắn: **vế sau là sự KHÁC BIỆT / THAY ĐỔI** — **{違|ちが}う・{異|こと}なる・さまざまだ・{変|か}わる・いろいろだ** — hoặc một hành động **thay đổi theo** N ({変|か}える, {決|き}める, {選|えら}ぶ). Danh từ trước によって thường là **loại hình**: {国|くに}, {人|ひと}, {地域|ちいき}, {季節|きせつ}, {曜日|ようび}, {店|みせ}, {種類|しゅるい}, {場合|ばあい}, {天気|てんき}. Thêm **は** → **～によっては** = "tuỳ … thì **có** trường hợp …" — chỉ ra **một số** trường hợp đặc biệt. Còn có dạng **câu hỏi lồng ＋ によって**: {何|なに}を{選|えら}ぶかによって ("tuỳ vào việc chọn gì").',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N ＋ によって、［{違|ちが}う・{異|こと}なる・さまざまだ・{変|か}わる］',
          vi: 'Câu hỏi: **～は{何|なに}によって{違|ちが}いますか** → **～によって{違|ちが}います**.',
          examples: [
            E('{国|くに}によって、{習慣|しゅうかん}が{違|ちが}います。', 'Kuni ni yotte, shuukan ga chigaimasu.', 'Tuỳ nước mà phong tục khác nhau.'),
            E('{人|ひと}によって、{考|かんが}え{方|かた}が{異|こと}なります。', 'Hito ni yotte, kangaekata ga kotonarimasu.', 'Tuỳ người mà cách nghĩ khác nhau.'),
            E('{季節|きせつ}によって、{山|やま}の{景色|けしき}が{変|か}わります。', 'Kisetsu ni yotte, yama no keshiki ga kawarimasu.', 'Tuỳ mùa mà cảnh núi thay đổi.'),
            E('{地域|ちいき}によって、ごみの{出|だ}し{方|かた}はさまざまです。', 'Chiiki ni yotte, gomi no dashikata wa samazama desu.', 'Tuỳ khu vực mà cách đổ rác mỗi nơi mỗi kiểu.'),
            E('{同|おな}じパンでも、{店|みせ}によって{値段|ねだん}が{違|ちが}います。', 'Onaji pan demo, mise ni yotte nedan ga chigaimasu.', 'Cùng một loại bánh mì nhưng tuỳ cửa hàng mà giá khác nhau.'),
            E('{日|ひ}によって、{気温|きおん}の{差|さ}が{大|おお}きいです。', 'Hi ni yotte, kion no sa ga ookii desu.', 'Tuỳ ngày mà chênh lệch nhiệt độ lớn.'),
            E('{曜日|ようび}によって、アルバイトの{人数|にんずう}を{変|か}えています。', 'Youbi ni yotte, arubaito no ninzuu o kaete imasu.', 'Tuỳ thứ mà thay đổi số người làm thêm.'),
          ],
        },
        {
          formula: 'N ＋ によっては、［có trường hợp …］ · ［câu hỏi lồng か］＋ によって',
          vi: '**によっては** chỉ **một phần**: "tuỳ … thì cũng có khi…". Vế sau hay có **～こともある／～場合もある／～人もいる**.',
          examples: [
            E('{天気|てんき}によっては、{試合|しあい}が{中止|ちゅうし}になることもあります。', 'Tenki ni yotte wa, shiai ga chuushi ni naru koto mo arimasu.', 'Tuỳ thời tiết, có khi trận đấu bị huỷ.'),
            E('{人|ひと}によっては、{納豆|なっとう}が{大好|だいす}きな{外国人|がいこくじん}もいます。', 'Hito ni yotte wa, nattou ga daisuki na gaikokujin mo imasu.', 'Tuỳ người, cũng có người nước ngoài rất thích natto.'),
            E('{地域|ちいき}によっては、{夏|なつ}でも{雪|ゆき}が{残|のこ}っています。', 'Chiiki ni yotte wa, natsu demo yuki ga nokotte imasu.', 'Có vùng thì mùa hè vẫn còn tuyết.'),
            E('どの{大学|だいがく}を{選|えら}ぶかによって、{将来|しょうらい}が{変|か}わるかもしれません。', 'Dono daigaku o erabu ka ni yotte, shourai ga kawaru kamo shiremasen.', 'Tuỳ vào việc chọn trường nào mà tương lai có thể thay đổi.'),
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp với ～によって (tuỳ theo)',
      lines: [
        { who: 'マルコ', role: 'b', text: '{日本|にほん}のごみの{日|ひ}は、どこでも{同|おな}じなの？', ro: 'Nihon no gomi no hi wa, doko demo onaji na no?', vi: 'Ngày đổ rác ở Nhật ở đâu cũng giống nhau à?' },
        { who: '{鈴木|すずき}', role: 'a', text: 'ううん、{地域|ちいき}によって{違|ちが}うよ。{同|おな}じ{市|し}の{中|なか}でも、{町|まち}によって{曜日|ようび}が{異|こと}なることがあるの。', ro: 'Uun, chiiki ni yotte chigau yo. Onaji shi no naka demo, machi ni yotte youbi ga kotonaru koto ga aru no.', vi: 'Không, tuỳ khu vực mà khác. Ngay trong cùng một thành phố, tuỳ phường mà thứ đổ rác cũng có khi khác.' },
        { who: 'マルコ', role: 'b', text: 'へえ。じゃ、{引|ひ}っ{越|こ}したら、まず{何|なに}を{見|み}ればいい？', ro: 'Hee. Ja, hikkoshitara, mazu nani o mireba ii?', vi: 'Ồ. Vậy chuyển nhà rồi thì trước tiên nên xem gì?' },
        { who: '{鈴木|すずき}', role: 'a', text: '{市|し}のホームページを{見|み}て。{場合|ばあい}によっては、{英語|えいご}の{説明|せつめい}もあるよ。', ro: 'Shi no hoomupeeji o mite. Baai ni yotte wa, eigo no setsumei mo aru yo.', vi: 'Xem trang web của thành phố ấy. Tuỳ trường hợp còn có cả giải thích bằng tiếng Anh nữa.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — ［N］によって、［khác nhau］',
      head: ['N', '＋ によって', 'Cái khác nhau', 'Câu', 'Romaji'],
      rows: [
        ['{国|くに}', '{国|くに}によって', '{食|た}べ{方|かた}', '{国|くに}によって、{食|た}べ{方|かた}が{違|ちが}う。', 'Kuni ni yotte, tabekata ga chigau.'],
        ['{年齢|ねんれい}', '{年齢|ねんれい}によって', '{好|す}きな{番組|ばんぐみ}', '{年齢|ねんれい}によって、{好|す}きな{番組|ばんぐみ}が{異|こと}なる。', 'Nenrei ni yotte, suki na bangumi ga kotonaru.'],
        ['{店|みせ}', '{店|みせ}によって', '{営業時間|えいぎょうじかん}', '{店|みせ}によって、{営業時間|えいぎょうじかん}はさまざまだ。', 'Mise ni yotte, eigyou jikan wa samazama da.'],
        ['{種類|しゅるい}', '{種類|しゅるい}によって', '{値段|ねだん}', 'りんごは{種類|しゅるい}によって、{値段|ねだん}が{違|ちが}う。', 'Ringo wa shurui ni yotte, nedan ga chigau.'],
        ['{時間|じかん}', '{時間|じかん}によって', '{電車|でんしゃ}の{混|こ}み{方|かた}', '{時間|じかん}によって、{電車|でんしゃ}の{混|こ}み{方|かた}が{変|か}わる。', 'Jikan ni yotte, densha no komikata ga kawaru.'],
        ['{新聞|しんぶん}', '{新聞|しんぶん}によって', '{記事|きじ}の{書|か}き{方|かた}', '{新聞|しんぶん}によって、{同|おな}じ{事件|じけん}でも{書|か}き{方|かた}が{異|こと}なる。', 'Shinbun ni yotte, onaji jiken demo kakikata ga kotonaru.'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～によって (tuỳ theo)',
      items: [
        '~~{国|くに}によって、{習慣|しゅうかん}は{同|おな}じです~~ — vế sau phải là **khác nhau / thay đổi**. Muốn nói "ở đâu cũng giống" → **どの{国|くに}でも{同|おな}じです**.',
        '~~{人|ひと}によって、{私|わたし}は{納豆|なっとう}が{好|す}きです~~ — chủ ngữ là MỘT người cụ thể thì không "tuỳ người". によって cần **nhiều** đối tượng để so.',
        '**によって ↔ によっては**: {国|くに}によって{違|ちが}う (mỗi nước mỗi khác — nói chung) ↔ {国|くに}によっては{禁止|きんし}されている (có những nước cấm — một số).',
        '⚠ **によって ≠ によると**: {天気予報|てんきよほう}**によると**、{明日|あした}は{雨|あめ}だ**そうです** (theo dự báo — nguồn tin, Bài 20) ↔ {天気|てんき}**によって**、{予定|よてい}が{変|か}わります (tuỳ thời tiết). によると gần như luôn đi với **～そうだ／～ということだ** ở cuối câu.',
      ],
    },
    { t: 'rule', formula: 'N ＋ によって ＋ 違う・異なる・さまざまだ・変わる · N ＋ によっては ＋ ～こともある', vi: '"Tuỳ theo N mà khác nhau" (vế sau luôn là khác biệt / thay đổi). によっては = tuỳ N thì có trường hợp…' },

    /* ══════ ⑧ によって — tác nhân bị động ══════ */
    { t: 'h', text: '⑧ (người) ＋ によって ＋ V(ら)れる · ～による N — "do (ai) làm ra" — TÁC NHÂN của bị động (ôn + mở rộng Bài 22 ⑤)' },
    {
      t: 'p',
      text: 'Bài 22 ⑤ đã có: **{電話|でんわ}はベルによって{発明|はつめい}されました**. Quy tắc: trong câu bị động mà chủ ngữ là **vật được TẠO RA** (sách, tranh, toà nhà, phát minh, luật, kế hoạch) hoặc **sự việc chính thức** (điều tra, quyết định), **người làm** đi với **によって** — không đi với に. Động từ hay gặp: **{書|か}く・{描|か}く・{建|た}てる・{作|つく}る・{発明|はつめい}する・{発見|はっけん}する・{決|き}める・{調|しら}べる・{行|おこな}う**. Dạng bổ nghĩa: **(người) による N** — {専門家|せんもんか}による{調査|ちょうさ} (cuộc điều tra do chuyên gia thực hiện), {画家|がか}による{作品|さくひん}.',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N(vật／sự việc) は ＋ N(người) によって ＋ V(ら)れる',
          vi: 'Câu kiểu sách lịch sử, bảo tàng, bài báo. Câu hỏi: **これは{誰|だれ}によって～されたんですか**.',
          examples: [
            E('『{源氏物語|げんじものがたり}』は、{紫式部|むらさきしきぶ}によって{書|か}かれました。', 'Genji monogatari wa, Murasaki Shikibu ni yotte kakaremashita.', '"Truyện Genji" do Murasaki Shikibu viết.'),
            E('ペニシリンは、フレミングによって{発見|はっけん}されました。', 'Penishirin wa, Furemingu ni yotte hakken saremashita.', 'Penicillin do Fleming phát hiện.'),
            E('この{寺|てら}は、{約|やく}600{年前|ねんまえ}に{建|た}てられたと{言|い}われています。', 'Kono tera wa, yaku roppyaku-nen mae ni taterareta to iwarete imasu.', 'Người ta nói ngôi chùa này được xây khoảng 600 năm trước. (người xây không quan trọng → không cần によって — ôn Bài 22)'),
            E('{事故|じこ}の{原因|げんいん}は、{警察|けいさつ}によって{調|しら}べられています。', "Jiko no gen'in wa, keisatsu ni yotte shiraberarete imasu.", 'Nguyên nhân tai nạn đang được cảnh sát điều tra.'),
            E('{新|あたら}しいルールは、{学生|がくせい}の{代表|だいひょう}によって{決|き}められました。', 'Atarashii ruuru wa, gakusei no daihyou ni yotte kimeraremashita.', 'Quy định mới do đại diện sinh viên quyết định.'),
          ],
        },
        {
          formula: 'N(người) ＋ による ＋ N(tác phẩm／hoạt động)',
          vi: 'Dạng rút gọn rất hay gặp trên poster triển lãm, chương trình hoà nhạc, báo cáo.',
          examples: [
            E('これは、{有名|ゆうめい}な{画家|がか}による{作品|さくひん}です。', 'Kore wa, yuumei na gaka ni yoru sakuhin desu.', 'Đây là tác phẩm của một hoạ sĩ nổi tiếng.'),
            E('{専門家|せんもんか}による{調査|ちょうさ}が{始|はじ}まりました。', 'Senmonka ni yoru chousa ga hajimarimashita.', 'Cuộc điều tra do các chuyên gia thực hiện đã bắt đầu.'),
            E('{学生|がくせい}によるコンサートが、{来月|らいげつ}{開|ひら}かれます。', 'Gakusei ni yoru konsaato ga, raigetsu hirakaremasu.', 'Buổi hoà nhạc do sinh viên biểu diễn sẽ được tổ chức tháng sau.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Người làm trong câu bị động: に hay によって? — và đừng nhầm によると',
      head: ['Trường hợp', 'Dùng', 'Ví dụ', 'Romaji'],
      rows: [
        ['Người làm gì đó TÁC ĐỘNG lên người (khen, mắng, nhờ, bước lên chân)', '**に**', '{先生|せんせい}**に**{褒|ほ}められた。', 'Sensei ni homerareta.'],
        ['Người TẠO RA vật / tác phẩm (viết, xây, phát minh, phát hiện)', '**によって**', 'この{本|ほん}は{夏目漱石|なつめそうせき}**によって**{書|か}かれた。', 'Kono hon wa Natsume Souseki ni yotte kakareta.'],
        ['Cơ quan / người thực hiện việc CHÍNH THỨC (điều tra, quyết định, tổ chức)', '**によって** (văn viết)', '{原因|げんいん}は{警察|けいさつ}**によって**{調|しら}べられている。', "Gen'in wa keisatsu ni yotte shiraberarete iru."],
        ['NGUỒN TIN (theo… thì nghe nói)', '**によると** ＋ ～そうだ', 'ニュース**によると**、{犯人|はんにん}は{捕|つか}まったそうだ。', 'Nyuusu ni yoru to, hannin wa tsukamatta sou da.'],
      ],
    },
    {
      t: 'note',
      title: 'Ghi nhớ ⑧',
      items: [
        '~~{先生|せんせい}によって{褒|ほ}められた~~ → **{先生|せんせい}に{褒|ほ}められた** — người tác động lên người: に (Bài 22 ②).',
        '~~この{本|ほん}は{夏目漱石|なつめそうせき}に{書|か}かれた~~ → **によって** — người tạo ra tác phẩm: によって (Bài 22 ⑤).',
        '**～によって** ở đây ≈ "**bởi**" trong tiếng Việt văn viết ("được viết **bởi**…"). Câu bị động không cần nêu người làm thì **bỏ hẳn** によって: この{寺|てら}は600{年前|ねんまえ}に{建|た}てられた.',
      ],
    },
    { t: 'rule', formula: 'N(vật) は N(người) によって V(ら)れる · N(người) による N(tác phẩm)', vi: '"Do (ai) viết / xây / phát minh / quyết định" — tác nhân của bị động khi chủ ngữ là thứ được tạo ra. Người tác động lên người → に. Nguồn tin → によると.' },

    /* ══════ ⑨ BẢNG PHÂN BIỆT ══════ */
    { t: 'h', text: '⑨ Bảng phân biệt — せいで ↔ おかげで ↔ ため ↔ によって ↔ から ↔ ので ↔ で' },
    {
      t: 'p',
      text: 'Đề N3 phần **文法形式の判断** hay cho một câu nguyên nhân và bốn lựa chọn trong nhóm này. Cách chọn trong 3 giây: **(1)** Nhìn **vế sau** — tốt hay xấu? ý chí (rủ, nhờ, mệnh lệnh) hay sự thật? **(2)** Nhìn **phần đứng trước** — danh từ trần hay câu? **(3)** Nhìn **văn phong** — hội thoại hay thông báo?',
    },
    {
      t: 'table',
      caption: '⭐ Bảng phân biệt các mẫu chỉ nguyên nhân',
      head: ['Mẫu', 'Đứng trước', 'Vế sau', 'Thái độ / văn phong', 'Vế sau là rủ, nhờ, lệnh?', 'Ví dụ'],
      rows: [
        ['～せいで', 'V普通形・イA・ナAな・Nの', 'kết quả XẤU', 'trách, đổ lỗi — nói + viết', '✗', '{雨|あめ}のせいで{遅|おく}れた。'],
        ['～せいか', 'như trên', 'xấu / trung tính', 'đoán, không chắc', '✗', '{雨|あめ}のせいか{客|きゃく}が{少|すく}ない。'],
        ['～おかげで', 'như trên', 'kết quả TỐT', 'biết ơn — nói + viết', '✗', '{君|きみ}のおかげで{助|たす}かった。'],
        ['～ため（に）', 'như trên', 'sự thật, kết quả', 'khách quan — văn viết, thông báo', '△ chỉ trong thông báo lịch sự', '{大雨|おおあめ}のため{運休|うんきゅう}です。'],
        ['～によって／による', 'CHỈ danh từ', 'kết quả lớn, xã hội', 'khách quan — tin tức, sách', '✗', '{地震|じしん}による{被害|ひがい}'],
        ['～から', 'thể thường / lịch sự + から', 'gì cũng được', 'chủ quan, văn nói', '○', '{雨|あめ}だから{家|いえ}にいよう。'],
        ['～ので', 'V普通形・イA・ナAな・Nな + ので', 'gì cũng được (nhẹ nhàng)', 'lịch sự, mềm — nói + viết', '○ (lịch sự)', '{雨|あめ}なので{家|いえ}にいましょう。'],
        ['N で (ポイント 124)', 'CHỈ danh từ', 'kết quả (thường không ý chí)', 'văn nói, ngắn gọn', '✗', '{台風|たいふう}で{電車|でんしゃ}が{止|と}まった。'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{雨|あめ}のせいで、{花火大会|はなびたいかい}が{中止|ちゅうし}になった。', 'Ame no sei de, hanabi taikai ga chuushi ni natta.', 'Tại mưa mà lễ hội pháo hoa bị huỷ. (tiếc, bực)'),
        E('{雨|あめ}のおかげで、{涼|すず}しくなった。', 'Ame no okage de, suzushiku natta.', 'Nhờ mưa mà trời mát hẳn. (vui)'),
        E('{雨|あめ}のため、{花火大会|はなびたいかい}は{中止|ちゅうし}となりました。', 'Ame no tame, hanabi taikai wa chuushi to narimashita.', 'Do mưa, lễ hội pháo hoa bị huỷ. (thông báo của ban tổ chức)'),
        E('{大雨|おおあめ}によって、{各地|かくち}で{被害|ひがい}が{出|で}ています。', 'Ooame ni yotte, kakuchi de higai ga dete imasu.', 'Do mưa lớn, thiệt hại xảy ra ở nhiều nơi. (bản tin)'),
        E('{雨|あめ}だから、{今日|きょう}は{家|いえ}で{映画|えいが}を{見|み}よう。', 'Ame da kara, kyou wa ie de eiga o miyou.', 'Mưa nên hôm nay ở nhà xem phim đi. (rủ → から)'),
        E('{雨|あめ}なので、{傘|かさ}を{持|も}っていってください。', 'Ame na node, kasa o motte itte kudasai.', 'Trời mưa nên hãy mang ô theo. (nhờ, lịch sự → ので)'),
        E('{雨|あめ}で、{試合|しあい}が{中止|ちゅうし}になったよ。', 'Ame de, shiai ga chuushi ni natta yo.', 'Mưa nên trận đấu bị huỷ rồi. (văn nói ngắn → で)'),
      ],
    },
    {
      t: 'note',
      title: 'Bốn nghĩa của によって — nhận ra bằng VẾ SAU',
      items: [
        '**⑤ Nguyên nhân** — vế sau là **hư hại / thay đổi lớn**: {台風|たいふう}によって{家|いえ}が{壊|こわ}れた · {地震|じしん}による{被害|ひがい}.',
        '**⑥ Cách thức** — vế sau là **làm được / giải quyết / biết được**: {話|はな}し{合|あ}いによって{解決|かいけつ}した · {書|か}くことによって{覚|おぼ}えた.',
        '**⑦ Tuỳ theo** — vế sau là **khác nhau / thay đổi**: {国|くに}によって{違|ちが}う · {人|ひと}によっては{嫌|きら}いだ.',
        '**⑧ Tác nhân bị động** — vế sau là **động từ bị động** (書かれた・建てられた・発見された) và N trước によって là **người**: {紫式部|むらさきしきぶ}によって{書|か}かれた.',
        'Và **によると** (Bài 20) — vế sau kết thúc bằng **～そうだ／～ということだ**: ニュースによると、{雪|ゆき}が{降|ふ}るそうだ.',
      ],
    },
    {
      t: 'table',
      caption: 'Chỉ cần NHẬN RA khi đọc (N2) — cùng nhóm nguyên nhân',
      head: ['Mẫu', 'Nghĩa', 'Ví dụ', 'Romaji', 'Ghi chú'],
      rows: [
        ['～ばかりに', 'chỉ vì … mà (hậu quả xấu, hối hận)', '{一言|ひとこと}{言|い}ったばかりに、{彼女|かのじょ}を{怒|おこ}らせてしまった。', 'Hitokoto itta bakari ni, kanojo o okorasete shimatta.', 'N2 — mạnh hơn せいで, có ý "chỉ một chuyện nhỏ thôi mà…"'],
        ['～につき', 'do, vì (biển báo, giấy dán)', '{工事中|こうじちゅう}につき、{通行止|つうこうど}め', 'Koujichuu ni tsuki, tsuukoudome', 'N2 — chỉ sau danh từ, văn biển báo; = のため'],
        ['～ことから', 'vì (căn cứ vào việc…) nên', '{富士山|ふじさん}が{見|み}えることから、この{町|まち}は「{富士見|ふじみ}」と{呼|よ}ばれる。', 'Fujisan ga mieru koto kara, kono machi wa "Fujimi" to yobareru.', 'N2 — giải thích tên gọi, căn cứ phán đoán'],
        ['～により', '= によって (nguyên nhân / cách thức)', '{強風|きょうふう}により、{運転|うんてん}を{見合|みあ}わせています。', 'Kyoufuu ni yori, unten o miawasete imasu.', 'N3 — văn viết, loa ở ga'],
      ],
    },
    {
      t: 'table',
      caption: '📺 Khuôn câu của bản tin (ニュースの決まり文句) — nghe là nhận ra ngay',
      head: ['Khuôn câu', 'Nghĩa', 'Ví dụ', 'Romaji'],
      rows: [
        ['{次|つぎ}のニュースです。', 'Tin tiếp theo.', '{次|つぎ}のニュースです。{東京|とうきょう}で～', 'Tsugi no nyuusu desu.'],
        ['～で～が{発生|はっせい}しました', '… đã xảy ra ở …', '{今朝|けさ}、{駅前|えきまえ}で{火事|かじ}が{発生|はっせい}しました。', 'Kesa, ekimae de kaji ga hassei shimashita.'],
        ['～の{影響|えいきょう}で、～', 'do ảnh hưởng của …', '{台風|たいふう}の{影響|えいきょう}で、{各地|かくち}で{雨|あめ}が{強|つよ}まっています。', 'Taifuu no eikyou de, kakuchi de ame ga tsuyomatte imasu.'],
        ['～のため、～', 'do … (nguyên nhân khách quan)', '{大雪|おおゆき}のため、{高速道路|こうそくどうろ}が{通行止|つうこうど}めです。', 'Ooyuki no tame, kousoku douro ga tsuukoudome desu.'],
        ['～により、～', 'do … (văn viết hơn によって)', '{信号|しんごう}の{故障|こしょう}により、{電車|でんしゃ}が{遅|おく}れています。', 'Shingou no koshou ni yori, densha ga okurete imasu.'],
        ['～による{被害|ひがい}は～', 'thiệt hại do … thì …', '{地震|じしん}による{被害|ひがい}は、{今|いま}のところ{入|はい}っていません。', 'Jishin ni yoru higai wa, ima no tokoro haitte imasen.'],
        ['～によりますと、～ということです', 'theo … thì nghe nói … (giọng phát thanh viên)', '{警察|けいさつ}によりますと、けが{人|にん}はいないということです。', 'Keisatsu ni yorimasu to, kega nin wa inai to iu koto desu.'],
        ['～おそれがあります', 'có nguy cơ … (N2 — nhận ra)', '{川|かわ}があふれるおそれがあります。', 'Kawa ga afureru osore ga arimasu.'],
        ['～を{調|しら}べています', 'đang điều tra …', '{警察|けいさつ}が{事故|じこ}の{原因|げんいん}を{調|しら}べています。', "Keisatsu ga jiko no gen'in o shirabete imasu."],
        ['～と{見|み}られています', 'được cho là … (N2 — nhận ra)', '{原因|げんいん}は{寝不足|ねぶそく}による{居眠|いねむ}り{運転|うんてん}と{見|み}られています。', "Gen'in wa nebusoku ni yoru inemuri unten to mirarete imasu."],
        ['{専門家|せんもんか}は～と{話|はな}しています', 'chuyên gia cho rằng …', '{専門家|せんもんか}は、{値段|ねだん}は{下|さ}がるだろうと{話|はな}しています。', 'Senmonka wa, nedan wa sagaru darou to hanashite imasu.'],
        ['～に{注意|ちゅうい}してください', 'xin hãy chú ý / đề phòng …', '{土砂災害|どしゃさいがい}に{注意|ちゅうい}してください。', 'Dosha saigai ni chuui shite kudasai.'],
      ],
    },
    {
      t: 'note',
      title: 'Ghi nhớ khuôn câu bản tin',
      items: [
        '**～によりますと** = によると ở dạng lịch sự của phát thanh viên (〜ます chèn vào giữa). Cuối câu luôn có **～ということです** hoặc **～そうです**. Đừng nhầm với によって.',
        '**けが{人|にん}** (người bị thương) đọc **けがにん** — chữ 人 đọc にん trong vài từ: {病人|びょうにん} (người ốm — Bài 12), {犯人|はんにん} (Bài 22).',
        'Trong một bản tin, **～のため／～により／～の{影響|えいきょう}で** thường đứng **ngay câu thứ hai** — đó là đáp án của câu hỏi "どうして" ở đề 概要理解. Ghi lại ngay khi nghe.',
      ],
    },

    /* ══════ LUYỆN TỔNG HỢP ══════ */
    { t: 'h', text: 'Luyện tổng hợp — ghép câu, điền dạng đúng, sửa câu, trắc nghiệm kiểu đề N3' },
    {
      t: 'build',
      id: 'b27-np-ghep',
      title: 'Ghép câu — bấm mảnh theo đúng thứ tự (12 câu)',
      items: [
        { vi: 'Tại thiếu ngủ nên tôi đau đầu.', chips: ['{寝不足|ねぶそく}の', 'せいで', '{頭|あたま}が', '{痛|いた}いです', 'おかげで', '{寝不足|ねぶそく}な'], answer: ['{寝不足|ねぶそく}の', 'せいで', '{頭|あたま}が', '{痛|いた}いです'], ro: 'Nebusoku no sei de atama ga itai desu.' },
        { vi: 'Tại tàu chậm nên tôi không kịp giờ.', chips: ['{電車|でんしゃ}が', '{遅|おく}れた', 'せいで', '{間|ま}に{合|あ}いませんでした', '{遅|おく}れる', 'ために'], answer: ['{電車|でんしゃ}が', '{遅|おく}れた', 'せいで', '{間|ま}に{合|あ}いませんでした'], ro: 'Densha ga okureta sei de ma ni aimasen deshita.' },
        { vi: 'Chắc tại tuổi tác mà dễ mệt.', chips: ['{年|とし}の', 'せいか', '{疲|つか}れ', 'やすいです', 'おかげか', '{年|とし}な'], answer: ['{年|とし}の', 'せいか', '{疲|つか}れ', 'やすいです'], ro: 'Toshi no sei ka tsukare yasui desu.' },
        { vi: 'Nhờ thầy mà tôi đỗ.', chips: ['{先生|せんせい}の', 'おかげで', '{合格|ごうかく}', 'できました', 'せいで', 'ために'], answer: ['{先生|せんせい}の', 'おかげで', '{合格|ごうかく}', 'できました'], ro: 'Sensei no okage de goukaku dekimashita.' },
        { vi: 'Nhờ bạn giúp mà xong sớm.', chips: ['{友達|ともだち}が', '{手伝|てつだ}って', 'くれた', 'おかげで', '{早|はや}く{終|お}わりました', 'せいで'], answer: ['{友達|ともだち}が', '{手伝|てつだ}って', 'くれた', 'おかげで', '{早|はや}く{終|お}わりました'], ro: 'Tomodachi ga tetsudatte kureta okage de hayaku owarimashita.' },
        { vi: 'Do mưa lớn, tàu đang dừng.', chips: ['{大雨|おおあめ}の', 'ため', '{電車|でんしゃ}が', '{止|と}まっています', '{大雨|おおあめ}な', 'によると'], answer: ['{大雨|おおあめ}の', 'ため', '{電車|でんしゃ}が', '{止|と}まっています'], ro: 'Ooame no tame densha ga tomatte imasu.' },
        { vi: 'Trận đấu bị huỷ là do bão.', chips: ['{試合|しあい}が', '{中止|ちゅうし}になった', 'のは', '{台風|たいふう}の', 'ためです', 'おかげです'], answer: ['{試合|しあい}が', '{中止|ちゅうし}になった', 'のは', '{台風|たいふう}の', 'ためです'], ro: 'Shiai ga chuushi ni natta no wa taifuu no tame desu.' },
        { vi: 'Thiệt hại do động đất vẫn chưa rõ.', chips: ['{地震|じしん}に', 'よる', '{被害|ひがい}は', 'まだ{分|わ}かりません', 'よって', 'よると'], answer: ['{地震|じしん}に', 'よる', '{被害|ひがい}は', 'まだ{分|わ}かりません'], ro: 'Jishin ni yoru higai wa mada wakarimasen.' },
        { vi: 'Đã giải quyết bằng thảo luận.', chips: ['{話|はな}し{合|あ}い', 'によって', '{問題|もんだい}を', '{解決|かいけつ}しました', 'のせいで', 'によると'], answer: ['{話|はな}し{合|あ}い', 'によって', '{問題|もんだい}を', '{解決|かいけつ}しました'], ro: 'Hanashiai ni yotte mondai o kaiketsu shimashita.' },
        { vi: 'Bằng việc viết mỗi ngày, tôi đã nhớ chữ Hán.', chips: ['{毎日|まいにち}', '{書|か}く', 'ことに', 'よって', '{漢字|かんじ}を{覚|おぼ}えました', '{書|か}いた'], answer: ['{毎日|まいにち}', '{書|か}く', 'ことに', 'よって', '{漢字|かんじ}を{覚|おぼ}えました'], ro: 'Mainichi kaku koto ni yotte kanji o oboemashita.' },
        { vi: 'Tuỳ nước mà phong tục khác nhau.', chips: ['{国|くに}に', 'よって', '{習慣|しゅうかん}が', '{違|ちが}います', 'よると', '{同|おな}じです'], answer: ['{国|くに}に', 'よって', '{習慣|しゅうかん}が', '{違|ちが}います'], ro: 'Kuni ni yotte shuukan ga chigaimasu.' },
        { vi: 'Cuốn sách này do Natsume Soseki viết.', chips: ['この{本|ほん}は', '{夏目漱石|なつめそうせき}に', 'よって', '{書|か}かれました', '{書|か}きました', 'よると'], answer: ['この{本|ほん}は', '{夏目漱石|なつめそうせき}に', 'よって', '{書|か}かれました'], ro: 'Kono hon wa Natsume Souseki ni yotte kakaremashita.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b27-np-dien',
      title: 'Điền dạng đúng — chia từ trong ngoặc cho hợp mẫu (12 câu)',
      kind: 'fill',
      grammar: 'せい・おかげ・ため: Nの／ナAな／イA／V普通形 · によって: chỉ N (hoặc Vこと)',
      items: [
        { q: '（{雨|あめ}）せいで、{試合|しあい}が{中止|ちゅうし}になった。', answers: V('{雨|あめ}の'), hint: 'N ＋ の' },
        { q: '{説明|せつめい}が（{複雑|ふくざつ}）せいで、{分|わ}かりませんでした。', answers: V('{複雑|ふくざつ}な'), hint: 'ナA ＋ な' },
        { q: '{部屋|へや}が（{狭|せま}い）せいで、{友達|ともだち}を{呼|よ}べない。', answers: V('{狭|せま}い'), hint: 'イA giữ nguyên' },
        { q: '{寝坊|ねぼう}（する→quá khứ）せいで、バスに{乗|の}り{遅|おく}れた。', answers: V('した'), hint: 'thể た: した' },
        { q: '（{年|とし}）せいか、{目|め}が{悪|わる}くなった。', answers: V('{年|とし}の'), hint: 'N ＋ の' },
        { q: '{先輩|せんぱい}が（{教|おし}える→cho mình, quá khứ）おかげで、{仕事|しごと}を{早|はや}く{覚|おぼ}えられた。', answers: V('{教|おし}えてくれた'), hint: 'おしえて くれた' },
        { q: '{駅|えき}が（{近|ちか}い）おかげで、{毎朝|まいあさ}ゆっくり{寝|ね}られます。', answers: V('{近|ちか}い'), hint: 'イA giữ nguyên' },
        { q: '{交通|こうつう}が（{便利|べんり}）おかげで、{通学|つうがく}が{楽|らく}だ。', answers: V('{便利|べんり}な'), hint: 'ナA ＋ な' },
        { q: '（{工事中|こうじちゅう}）ため、この{道|みち}は{通|とお}れません。', answers: V('{工事中|こうじちゅう}の'), hint: 'N ＋ の' },
        { q: '{事故|じこ}が（ある→quá khứ）ため、{道路|どうろ}が{渋滞|じゅうたい}しています。', answers: V('あった'), hint: 'thể た: あった' },
        { q: '{毎日|まいにち}（{練習|れんしゅう}する）によって、{上手|じょうず}になりました。', answers: V('{練習|れんしゅう}すること', '{練習|れんしゅう}する こと'), hint: 'V ＋ こと ＋ によって' },
        { q: '{大雪|おおゆき}（　）{被害|ひがい}が{出|で}ています。（によって／による）', answers: V('による'), hint: 'trước danh từ 被害 → による' },
      ],
    },
    {
      t: 'quiz',
      id: 'b27-np-sua',
      title: 'Sửa câu sai — viết lại câu đúng (8 câu)',
      kind: 'translate',
      grammar: 'Kiểm tra: kết quả tốt hay xấu · nối N の／ナA な · vế sau có phải lời rủ / nhờ không · によって chỉ sau N',
      items: [
        { q: '✗ {先生|せんせい}のせいで、{試験|しけん}に{合格|ごうかく}できました。', answers: V('{先生|せんせい}のおかげで、{試験|しけん}に{合格|ごうかく}できました。'), hint: 'kết quả tốt → おかげで' },
        { q: '✗ {雨|あめ}のおかげで、{運動会|うんどうかい}が{中止|ちゅうし}になりました。（kể nghiêm túc）', answers: V('{雨|あめ}のせいで、{運動会|うんどうかい}が{中止|ちゅうし}になりました。', '{雨|あめ}のため、{運動会|うんどうかい}が{中止|ちゅうし}になりました。', '{雨|あめ}で、{運動会|うんどうかい}が{中止|ちゅうし}になりました。'), hint: 'kết quả xấu → せいで (hoặc ため／で)' },
        { q: '✗ {台風|たいふう}だせいで、{旅行|りょこう}に{行|い}けませんでした。', answers: V('{台風|たいふう}のせいで、{旅行|りょこう}に{行|い}けませんでした。'), hint: 'N ＋ の ＋ せいで' },
        { q: '✗ {便利|べんり}のおかげで、{住|す}む{人|ひと}が{増|ふ}えた。', answers: V('{便利|べんり}なおかげで、{住|す}む{人|ひと}が{増|ふ}えた。'), hint: 'ナA ＋ な' },
        { q: '✗ {雨|あめ}のせいで、{今日|きょう}は{家|いえ}で{映画|えいが}を{見|み}ましょう。', answers: V('{雨|あめ}だから、{今日|きょう}は{家|いえ}で{映画|えいが}を{見|み}ましょう。', '{雨|あめ}なので、{今日|きょう}は{家|いえ}で{映画|えいが}を{見|み}ましょう。'), hint: 'lời rủ → から／ので' },
        { q: '✗ {雨|あめ}が{降|ふ}ったによって、{川|かわ}の{水|みず}が{増|ふ}えた。', answers: V('{雨|あめ}によって、{川|かわ}の{水|みず}が{増|ふ}えた。', '{雨|あめ}が{降|ふ}ったため、{川|かわ}の{水|みず}が{増|ふ}えた。', '{雨|あめ}が{降|ふ}ったせいで、{川|かわ}の{水|みず}が{増|ふ}えた。'), hint: 'によって chỉ sau N; câu → ため／せいで' },
        { q: '✗ {国|くに}によって、{習慣|しゅうかん}は{同|おな}じです。', answers: V('どの{国|くに}でも、{習慣|しゅうかん}は{同|おな}じです。', '{国|くに}によって、{習慣|しゅうかん}は{違|ちが}います。', '{国|くに}によって、{習慣|しゅうかん}が{違|ちが}います。'), hint: 'によって + khác nhau; giống nhau → どの国でも' },
        { q: '✗ この{絵|え}はピカソに{描|か}かれました。', answers: V('この{絵|え}はピカソによって{描|か}かれました。'), hint: 'người tạo ra tác phẩm → によって' },
      ],
    },
    {
      t: 'mcq',
      id: 'b27-np-jlpt',
      title: '文法 — kiểu đề N3: 文法形式の判断 (12 câu) + 文の組み立て ★ (4 câu)',
      items: [
        { q: '{寝坊|ねぼう}した（　）、{大事|だいじ}な{会議|かいぎ}に{遅|おく}れてしまった。', options: ['おかげで', 'せいで', 'によって', 'のに'], correct: 1, why: 'Kết quả XẤU + tự trách → **せいで** (①). おかげで cho kết quả tốt; によって không đứng sau động từ; のに (vậy mà) trái nghĩa. 〔Nebou shita sei de…〕' },
        { q: '{友達|ともだち}が{駅|えき}まで{送|おく}ってくれた（　）、{雨|あめ}にぬれずに{済|す}んだ。', options: ['せいで', 'おかげで', 'せいか', 'によって'], correct: 1, why: 'Kết quả TỐT (không bị ướt) + ～てくれた → **おかげで** (③). 〔Okutte kureta okage de, ame ni nurezu ni sunda.〕' },
        { q: '{気|き}の（　）、{最近|さいきん}{彼|かれ}は{元気|げんき}がないように{見|み}える。', options: ['せいか', 'おかげで', 'ため', 'によって'], correct: 0, why: 'Cụm cố định **{気|き}のせいか** + ～ように{見|み}える (đoán) → ②. 〔Ki no sei ka…〕' },
        { q: '{本日|ほんじつ}は{台風|たいふう}の（　）、{閉店|へいてん}いたします。', options: ['おかげで', 'せいで', 'ため', 'によると'], correct: 2, why: 'Thông báo chính thức của cửa hàng, khách quan → **ため** (④). せいで mang ý trách, không dùng trong thông báo. 〔Taifuu no tame, heiten itashimasu.〕' },
        { q: '{電車|でんしゃ}が{遅|おく}れたのは、{線路|せんろ}に{木|き}が{倒|たお}れた（　）です。', options: ['ため', 'おかげ', 'によって', 'ばかり'], correct: 0, why: '**～のは～ためです** = "… là do …" (④). 〔Senro ni ki ga taoreta tame desu.〕' },
        { q: '{地震|じしん}（　）{被害|ひがい}は、{全国|ぜんこく}に{広|ひろ}がっている。', options: ['による', 'によって', 'によると', 'のおかげの'], correct: 0, why: 'Đứng trước danh từ {被害|ひがい} → **による** (⑤ dạng bổ nghĩa). 〔Jishin ni yoru higai…〕' },
        { q: 'インターネット（　）、{遠|とお}くに{住|す}む{家族|かぞく}と{毎日|まいにち}{顔|かお}を{見|み}て{話|はな}せる。', options: ['によると', 'によって', 'のせいで', 'について'], correct: 1, why: 'Phương tiện → **によって** (⑥). によると = theo nguồn tin. 〔Intaanetto ni yotte…〕' },
        { q: 'ホテルの{料金|りょうきん}は、{季節|きせつ}（　）かなり{違|ちが}う。', options: ['によって', 'のせいで', 'のおかげで', 'によると'], correct: 0, why: 'Vế sau là "khác nhau" → **によって** tuỳ theo (⑦). 〔Kisetsu ni yotte kanari chigau.〕' },
        { q: '{場合|ばあい}（　）、{予約|よやく}をキャンセルできないこともあります。', options: ['によって', 'によっては', 'によると', 'による'], correct: 1, why: '"Tuỳ trường hợp thì có khi…" + ～こともある → **によっては** (⑦). 〔Baai ni yotte wa…〕' },
        { q: 'この{小説|しょうせつ}は、{若|わか}い{作家|さっか}（　）{書|か}かれた。', options: ['に', 'によって', 'によると', 'のせいで'], correct: 1, why: 'Người TẠO RA tác phẩm trong câu bị động → **によって** (⑧). 〔Wakai sakka ni yotte kakareta.〕' },
        { q: '{天気予報|てんきよほう}（　）、{明日|あした}は{大雪|おおゆき}になるそうだ。', options: ['によって', 'による', 'によると', 'のおかげで'], correct: 2, why: 'Nguồn tin + ～そうだ → **によると** (Bài 20). Bẫy kinh điển của nhóm によって. 〔Tenki yohou ni yoru to…〕' },
        { q: '「{君|きみ}が{地図|ちず}を{忘|わす}れたおかげで、2{時間|じかん}も{歩|ある}いたよ。」この「おかげで」の{意味|いみ}に{近|ちか}いのは？', options: ['{感謝|かんしゃ}している', '{相手|あいて}を{少|すこ}し{責|せ}めている', '{相手|あいて}をほめている', '{原因|げんいん}が{分|わ}からない'], correct: 1, why: 'Kết quả xấu (đi bộ 2 tiếng) + おかげで = **mỉa mai**, trách nhẹ — nghĩa thật là せいで (③). {責|せ}める = trách. 〔Aite o sukoshi semete iru.〕' },
        { q: '★ {毎日|まいにち}{日本語|にほんご}の ＿＿ ＿＿ ★ ＿＿、{聞|き}き{取|と}れるようになった。（{聞|き}く／ニュースを／によって／こと）', options: ['{聞|き}く', 'ニュースを', 'によって', 'こと'], correct: 3, why: 'Câu đúng: {毎日|まいにち}{日本語|にほんご}の **ニュースを {聞|き}く こと によって**、{聞|き}き{取|と}れるようになった. ★ (thứ 3) = **こと**. 〔Mainichi nihongo no nyuusu o kiku koto ni yotte, kikitoreru you ni natta.〕' },
        { q: '★ {試験|しけん}に ＿＿ ★ ＿＿ ＿＿ です。（{先生|せんせい}の／{合格|ごうかく}できた／おかげ／のは）', options: ['{先生|せんせい}の', '{合格|ごうかく}できた', 'おかげ', 'のは'], correct: 3, why: 'Câu đúng: {試験|しけん}に **{合格|ごうかく}できた のは {先生|せんせい}の おかげ** です. ★ (thứ 2) = **のは**. 〔Shiken ni goukaku dekita no wa sensei no okage desu.〕' },
        { q: '★ {大雨|おおあめ}の ＿＿ ★ ＿＿ ＿＿ {運休|うんきゅう}となります。（{午後|ごご}の／ため／{全|すべ}て／{電車|でんしゃ}は）', options: ['{午後|ごご}の', 'ため', '{全|すべ}て', '{電車|でんしゃ}は'], correct: 0, why: 'Câu đúng: {大雨|おおあめ}の **ため {午後|ごご}の {電車|でんしゃ}は {全|すべ}て** {運休|うんきゅう}となります. ★ (thứ 2) = **{午後|ごご}の**. 〔Ooame no tame, gogo no densha wa subete unkyuu to narimasu.〕' },
        { q: '★ ＿＿ ＿＿ ★ ＿＿ {違|ちが}うので、{確認|かくにん}してください。（{地域|ちいき}に／{出|だ}し{方|かた}が／よって／ごみの）', options: ['{地域|ちいき}に', '{出|だ}し{方|かた}が', 'よって', 'ごみの'], correct: 3, why: 'Câu đúng: **{地域|ちいき}に よって ごみの {出|だ}し{方|かた}が** {違|ちが}うので… ★ (thứ 3) = **ごみの**. 〔Chiiki ni yotte gomi no dashikata ga chigau node…〕' },
      ],
    },
    {
      t: 'passage',
      title: '文章の文法 — đoạn văn có chỗ trống (kiểu 問題3 đề N3)',
      intro: 'Đọc bài văn ngắn của ダニエル trong tờ báo tường của ký túc xá rồi chọn từ đúng cho các chỗ (1)–(4) ở câu hỏi bên dưới.',
      paras: [
        { text: '{先月|せんげつ}、{大|おお}きな{台風|たいふう}が{来|き}ました。{台風|たいふう}（1）、{寮|りょう}の{近|ちか}くの{川|かわ}があふれそうになり、{住民|じゅうみん}は{小学校|しょうがっこう}に{避難|ひなん}しました。{私|わたし}たち{留学生|りゅうがくせい}も、{管理人|かんりにん}さんと{一緒|いっしょ}に{避難|ひなん}しました。' },
        { text: '{避難所|ひなんじょ}では、{日本語|にほんご}の{放送|ほうそう}が{速|はや}くて、{最初|さいしょ}は{何|なに}も{分|わ}かりませんでした。でも、{日本人|にほんじん}の{学生|がくせい}が{英語|えいご}で{説明|せつめい}してくれた（2）、{落|お}ち{着|つ}いて{行動|こうどう}することができました。' },
        { text: '{一方|いっぽう}、{寮|りょう}に{残|のこ}った{友達|ともだち}もいました。{私|わたし}の{友達|ともだち}は、ニュースを{見|み}ていなかった（3）、{避難|ひなん}が{遅|おく}れてしまったそうです。{幸|さいわ}い、けがはありませんでした。' },
        { text: 'この{経験|けいけん}から、{国|くに}（4）{災害|さいがい}の{種類|しゅるい}や{避難|ひなん}の{方法|ほうほう}が{違|ちが}うことを{知|し}りました。{日本|にほん}にいる{間|あいだ}は、{毎日|まいにち}{天気|てんき}のニュースを{見|み}るようにしています。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b27-np-bunsho',
      title: '文章の文法 — chọn từ cho (1)–(4)',
      items: [
        { q: '（1）', options: ['によって', 'のおかげで', 'によると', 'について'], correct: 0, why: 'Nguyên nhân của sự việc lớn (sông sắp tràn) trong văn viết → **によって** (⑤). のおかげで cho kết quả tốt; によると = nguồn tin; について = về (chủ đề).' },
        { q: '（2）', options: ['せいで', 'おかげで', 'せいか', 'のに'], correct: 1, why: 'Có người giúp + ～てくれた + kết quả tốt (bình tĩnh hành động) → **おかげで** (③).' },
        { q: '（3）', options: ['おかげで', 'によって', 'せいで', 'によっては'], correct: 2, why: 'Kết quả xấu (sơ tán muộn) + nguyên nhân là chính người đó không xem tin → **せいで** (①). によって không đứng sau động từ.' },
        { q: '（4）', options: ['によって', 'による', 'のせいで', 'によると'], correct: 0, why: 'Vế sau là "{違|ちが}う" (khác nhau) → **によって** tuỳ theo (⑦).' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const HAN_TU: Lesson = {
  id: 'b27-han-tu',
  kind: 'kanji',
  title: 'Chữ Hán mới — 20 chữ: 原 因 影 響 政 民 件 状 候 速 路 価 値 法 種 類 告 和 戦 争',
  goal: 'Đọc đúng (không cần furigana) và hiểu nghĩa 20 chữ Hán N3 của bản tin: nguyên nhân & ảnh hưởng (原因・影響・響く・影), xã hội & chính trị (政治・政府・国民・市民・住民・事件・条件・平和・戦争・競争), thời tiết & giao thông (天候・気候・速度・速報・道路・線路・状況), kinh tế & cách thức (物価・値段・値上がり・方法・法律・種類・書類・報告・広告・和食); phân biệt chữ trông giống (原↔願↔源, 因↔困↔固, 影↔景, 政↔故↔敗, 民↔氏, 候↔侯, 速↔束↔連, 路↔落, 値↔直↔植, 法↔去, 種↔重↔動, 和↔利↔私, 戦↔単, 争↔事) và đọc được đoạn văn kiểu đề N3 không có furigana.',
  minutes: 55,
  blocks: [
    {
      t: 'p',
      text: 'Chữ mới của Bài 27 là **20 chữ** đi theo đúng các từ của **bản tin**: 原 因 影 響 政 民 件 状 候 速 路 価 値 法 種 類 告 和 戦 争. Gần như mọi chữ đều là chữ của **báo chí** — mở một trang NHK NEWS WEB là gặp {原因|げんいん}, {影響|えいきょう}, {政府|せいふ}, {国民|こくみん}, {事件|じけん}. Phần lớn chỉ cần **👁 nhận mặt** (đọc được trong từ + hiểu nghĩa). Chữ **✍ nên viết** là chữ ít nét, rất hay dùng: 民 件 速 法 告 和. Mẹo của bài: nhiều chữ là **chữ hình thanh** (một phần chỉ nghĩa + một phần gợi âm) — {政|せい} có 正 (セイ), {値|ち} có 直 (チョク→チ), {響|きょう} có 郷 (キョウ), {速|そく} có 束 (ソク) — biết phần gợi âm là đoán được âm On.',
    },
    {
      t: 'table',
      caption: '20 chữ Hán mới của Bài 27',
      head: ['Chữ', 'Hán Việt', 'Âm On', 'Âm Kun', 'Nghĩa', 'Từ ví dụ', 'Mức'],
      rows: [
        ['原', 'NGUYÊN', 'ゲン', 'はら', 'nguồn gốc; cánh đồng', '{原因|げんいん} (nguyên nhân) · {原料|げんりょう} (nguyên liệu — N2) · {高原|こうげん} (cao nguyên) · {野原|のはら} (cánh đồng)', '👁 N3'],
        ['因', 'NHÂN', 'イン', 'よ(る)', 'nguyên do, bởi vì', '{原因|げんいん} · {要因|よういん} (yếu tố, nguyên nhân chính — N1) · {因|よ}る (do — N1)', '👁 N3'],
        ['影', 'ẢNH', 'エイ', 'かげ', 'bóng; hình bóng', '{影響|えいきょう} (ảnh hưởng) · {影|かげ} (cái bóng) · {撮影|さつえい} (quay phim, chụp ảnh — N2)', '👁 N3 (có bảng xếp N2)'],
        ['響', 'HƯỞNG', 'キョウ', 'ひび(く)', 'vang, vọng lại', '{影響|えいきょう} · {響|ひび}く (vang lên — N2) · {反響|はんきょう} (tiếng vang, phản hồi — N1)', '👁 N3–N2'],
        ['政', 'CHÍNH', 'セイ・ショウ', 'まつりごと', 'việc nước, chính trị', '{政治|せいじ} (chính trị) · {政府|せいふ} (chính phủ) · {行政|ぎょうせい} (hành chính — N1)', '👁 N3'],
        ['民', 'DÂN', 'ミン', 'たみ', 'người dân', '{国民|こくみん} (quốc dân) · {市民|しみん} (thị dân) · {住民|じゅうみん} (cư dân) · {民族|みんぞく} (dân tộc — N2)', '✍ N3'],
        ['件', 'KIỆN', 'ケン', '—', 'vụ việc; điều khoản', '{事件|じけん} (vụ án) · {条件|じょうけん} (điều kiện — N3) · {用件|ようけん} (việc cần nói — N2) · ～{件|けん} (đếm vụ, đếm email)', '✍ N3'],
        ['状', 'TRẠNG', 'ジョウ', '—', 'hình trạng; tờ thư, giấy', '{状況|じょうきょう} (tình hình) · {状態|じょうたい} (trạng thái — N3) · {招待状|しょうたいじょう} (thiệp mời) · {年賀状|ねんがじょう} (thiệp năm mới)', '👁 N3'],
        ['候', 'HẬU', 'コウ', 'そうろう', 'thời tiết, khí hậu; chờ', '{天候|てんこう} (thời tiết) · {気候|きこう} (khí hậu) · {候補|こうほ} (ứng cử viên — N2)', '👁 N3'],
        ['速', 'TỐC', 'ソク', 'はや(い)・はや(める)・すみ(やか)', 'nhanh (tốc độ)', '{速|はや}い (nhanh) · {速度|そくど} (tốc độ) · {速報|そくほう} (tin nhanh) · {高速道路|こうそくどうろ} · {早速|さっそく} (ngay lập tức — N3)', '✍ N3'],
        ['路', 'LỘ', 'ロ', 'じ', 'con đường', '{道路|どうろ} (đường xe chạy) · {線路|せんろ} (đường ray) · {通路|つうろ} (lối đi) · {家路|いえじ} (đường về nhà — N1)', '👁 N3'],
        ['価', 'GIÁ', 'カ', 'あたい', 'giá cả, giá trị', '{物価|ぶっか} (vật giá) · {価格|かかく} (giá — N2) · {定価|ていか} (giá niêm yết — N2)', '👁 N3 (có bảng xếp N2)'],
        ['値', 'TRỊ', 'チ', 'ね・あたい', 'giá; trị số', '{値段|ねだん} (giá) · {値上|ねあ}がり (tăng giá) · {値上|ねあ}げ · {価値|かち} (giá trị — N2)', '👁 N3'],
        ['法', 'PHÁP', 'ホウ（ハッ・ホッ）', '—', 'phép, luật; cách làm', '{方法|ほうほう} (phương pháp) · {法律|ほうりつ} (pháp luật) · {文法|ぶんぽう} (ngữ pháp) · {法学部|ほうがくぶ} (khoa Luật)', '✍ N3'],
        ['種', 'CHỦNG', 'シュ', 'たね', 'loại; hạt giống', '{種類|しゅるい} (chủng loại) · {種|たね} (hạt giống) · {一種|いっしゅ} (một loại — N2) · {人種|じんしゅ} (chủng tộc — N1)', '👁 N3'],
        ['類', 'LOẠI', 'ルイ', 'たぐ(い)', 'loại, giống nhau', '{種類|しゅるい} · {書類|しょるい} (giấy tờ) · {人類|じんるい} (nhân loại — N2) · {親類|しんるい} (họ hàng — N2)', '👁 N3'],
        ['告', 'CÁO', 'コク', 'つ(げる)', 'báo, nói cho biết', '{報告|ほうこく} (báo cáo) · {広告|こうこく} (quảng cáo — N3) · {警告|けいこく} (cảnh cáo — N2) · {告|つ}げる (báo — N2)', '✍ N3'],
        ['和', 'HOÀ', 'ワ・オ', 'やわ(らぐ)・なご(む)', 'hoà thuận; (kiểu) Nhật', '{平和|へいわ} (hoà bình) · {和食|わしょく} (món Nhật) · {和室|わしつ} (phòng kiểu Nhật) · {和服|わふく} · {令和|れいわ} (niên hiệu hiện nay)', '✍ N3'],
        ['戦', 'CHIẾN', 'セン', 'たたか(う)・いくさ', 'đánh nhau, chiến tranh', '{戦争|せんそう} (chiến tranh) · {戦|たたか}う (chiến đấu — N3) · {挑戦|ちょうせん} (thử thách — Bài 26) · {作戦|さくせん} (kế sách — N2)', '👁 N3'],
        ['争', 'TRANH', 'ソウ', 'あらそ(う)', 'tranh giành', '{戦争|せんそう} · {競争|きょうそう} (cạnh tranh — N3) · {争|あらそ}う (tranh nhau — N2) · {言|い}い{争|あらそ}う (cãi nhau)', '👁 N3'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ bằng cấu tạo chữ (học kèm khi tập viết)',
      items: [
        '**原** = 厂 (vách đá) + 泉 (dòng suối, viết gọn thành 白 + 小): nước suối chảy ra từ chân vách đá = **NGUỒN** → gốc, nguyên → {原因|げんいん}. Thêm 氵 → 源 (nguồn — N2); thêm 頁 → **願** (nguyện — お{願|ねが}い, đã học).',
        '**因** = 囗 (cái chiếu) + 大 (người dang tay): người **nằm dựa** trên chiếu = dựa vào → nguyên DO → {原因|げんいん}. ⚠ Khác **困** ({困|こま}る — 囗 + 木) và **固** (cố — 囗 + 古).',
        '**影** = 景 (cảnh — ánh nắng, phần gợi âm) + 彡 (ba nét — tia sáng): ánh nắng chiếu xuống tạo ra **BÓNG** → {影|かげ}. Khác 景 ({景色|けしき}) — không có 彡.',
        '**響** = 郷 (làng quê — gợi âm キョウ) + 音 (âm thanh): tiếng **vang** khắp làng → {響|ひび}く. Mẹo: **{影響|えいきょう}** = "**bóng** + **tiếng vang**" — thứ lan ra xung quanh từ một vật = ẢNH HƯỞNG.',
        '**政** = 正 (ngay thẳng — gợi âm セイ) + 攵 (tay cầm roi): dùng quyền làm cho mọi việc **ngay ngắn** = cai trị, **CHÍNH** trị → {政治|せいじ}. Cùng 攵: 故 ({事故|じこ}), 敗 ({失敗|しっぱい}) — đã học.',
        '**民** — theo cách giải thích phổ biến, chữ cổ vẽ **con mắt bị một mũi nhọn đâm** (người bị trị, nô lệ) → **DÂN** thường. Viết 5 nét, nét cuối là nét móc cong lên phải. ⚠ Khác 氏 (thị — họ, 4 nét, không có khung trên).',
        '**件** = 亻 (người) + 牛 (con bò): người xưa đếm tài sản theo **từng con bò** → từng **MÓN, từng VỤ** → {事件|じけん}, ～{件|けん} (một vụ, một email: メールが3{件|けん}).',
        '**状** = 丬 (tấm ván — gợi âm ジョウ) + 犬 (con chó): **HÌNH DẠNG** con chó → hình trạng, tình **TRẠNG** → {状態|じょうたい}; về sau còn nghĩa tờ giấy viết rõ sự tình → {招待状|しょうたいじょう}.',
        '**候** = 亻 + một nét sổ ngắn + phần gợi âm コウ (người cầm cung đứng canh): người **đứng trông chừng, chờ đợi** → nhìn trời chờ thời tiết → khí **HẬU** → {天候|てんこう}, {気候|きこう}. ⚠ Quên nét sổ ngắn giữa 亻 và phần phải là thành chữ 侯 (hầu tước).',
        '**速** = 辶 (bước đi) + 束 (bó — gợi âm ソク; {約束|やくそく}): bó gọn hành trang rồi đi cho **NHANH** → {速|はや}い, {速度|そくど}. ⚠ **{速|はや}い** = nhanh (tốc độ: tàu, chạy, nói) ≠ **{早|はや}い** = sớm (thời điểm: dậy sớm). Khác 連 (liên — 辶 + 車).',
        '**路** = ⻊ (chân) + 各 (mỗi — gợi âm ロ): con **ĐƯỜNG** mỗi người đi bằng đôi chân → {道路|どうろ}, {線路|せんろ}. Cùng 各: 落 ({落|お}ちる), 絡 ({連絡|れんらく}).',
        '**価** = 亻 (người) + 覀 (phần trên của 賈 — người buôn): người buôn bán định **GIÁ** cho hàng → {物価|ぶっか}, {価格|かかく}.',
        '**値** = 亻 + 直 (thẳng, đúng — gợi âm チ; {直|なお}す): cái giá **ngay thẳng**, đúng với món hàng → {値段|ねだん}, {価値|かち}. ⚠ Khác 植 (thực — 木 + 直: {植物|しょくぶつ}).',
        '**法** = 氵 (nước) + 去 (đi — {過去|かこ}): nước luôn **chảy xuống chỗ thấp** — quy luật không đổi = **PHÉP**, **LUẬT** → {法律|ほうりつ}, {方法|ほうほう}. ⚠ {文法|ぶんぽう} đọc **ぽう** (ん + ほ → ぽ).',
        '**種** = 禾 (cây lúa) + 重 (nặng — {重|おも}い): hạt lúa **nặng, chắc** được giữ làm **GIỐNG** → {種|たね}, rồi "giống, loại" → {種類|しゅるい}. Khác 動 ({動|うご}く — 重 + 力).',
        '**類** = 米 (gạo) + 大 (trong chữ cổ là 犬 — con chó) + 頁 (cái đầu): những con vật, hạt gạo **trông giống nhau** gom thành một **LOẠI** → {種類|しゅるい}, {書類|しょるい}. ⚠ Phần dưới bên trái là **大** (không có dấu chấm như 犬).',
        '**告** = 牛 (con bò — viết gọn ở trên) + 口 (miệng): dâng bò lên rồi **khấn BÁO** với thần → {報告|ほうこく}, {広告|こうこく}.',
        '**和** = 禾 (lúa — gợi âm) + 口 (miệng): lúa đủ cho **mọi miệng** ăn → yên ổn, **HOÀ** thuận → {平和|へいわ}; nghĩa "kiểu Nhật" → {和食|わしょく}, {和室|わしつ}. ⚠ Khác **利** (禾 + 刂 — {便利|べんり}) và **私** (禾 + 厶).',
        '**戦** = 単 (cái khiên — gợi âm セン; {簡単|かんたん}) + 戈 (cây qua — vũ khí): khiên + giáo = **CHIẾN** đấu → {戦争|せんそう}, {戦|たたか}う.',
        '**争** — phía trên ⺈ và dạng ヨ là **hai bàn tay**, nét sổ móc 亅 là một cây gậy: hai tay **giành giật** một cây gậy = **TRANH** → {戦争|せんそう}, {競争|きょうそう}. ⚠ Khác **事** (sự — {事件|じけん}): 事 có 口 ở trên.',
      ],
    },
    {
      t: 'table',
      caption: 'Đứng riêng hay đứng chung — kun khi đứng một mình / có đuôi kana, on trong từ ghép',
      head: ['Chữ', 'Đứng riêng (kun)', 'Trong từ ghép (on)', 'Bẫy'],
      rows: [
        ['原', '{野原|のはら} (はら — hay biến thành ばら trong địa danh)', 'ゲン: {原因|げんいん}・{高原|こうげん}', '{原宿|はらじゅく} (địa danh — kun)'],
        ['因', '(hầu như không gặp)', 'イン: {原因|げんいん}', 'romaji gen\'in'],
        ['影', '{影|かげ} (bóng)', 'エイ: {影響|えいきょう}・{撮影|さつえい}', 'かげ cũng viết 陰 (bóng râm — おかげ)'],
        ['響', '{響|ひび}く (vang)', 'キョウ: {影響|えいきょう}', 'きょう trường âm'],
        ['政', '(まつりごと — chữ cổ)', 'セイ: {政治|せいじ}・{政府|せいふ}', 'ショウ chỉ trong vài từ hiếm'],
        ['民', '{民|たみ} (văn chương)', 'ミン: {国民|こくみん}・{市民|しみん}・{住民|じゅうみん}', '{住民|じゅうみん} — じゅう trường âm'],
        ['件', '—', 'ケン: {事件|じけん}・{条件|じょうけん}・～{件|けん}', 'ケン ≠ ケン của 県 (tỉnh — Bài 18)'],
        ['状', '—', 'ジョウ: {状況|じょうきょう}・{状態|じょうたい}', 'じょう trường âm'],
        ['候', '(そうろう — văn cổ)', 'コウ: {天候|てんこう}・{気候|きこう}', '{気候|きこう} ≠ {記号|きごう} (ký hiệu)'],
        ['速', '{速|はや}い・{速|はや}さ', 'ソク: {速度|そくど}・{速報|そくほう}・{高速|こうそく}', '{早速|さっそく} (ソク → そく, さっ)'],
        ['路', '{家路|いえじ} (じ)', 'ロ: {道路|どうろ}・{線路|せんろ}', '—'],
        ['価', '(あたい — văn viết)', 'カ: {物価|ぶっか}・{価格|かかく}', '{物価|ぶっか} (có っ)'],
        ['値', '{値|ね} ({値段|ねだん}・{値上|ねあ}がり)', 'チ: {価値|かち}', 'KUN ね trong {値段|ねだん} — không đọc ~~ちだん~~'],
        ['法', '—', 'ホウ／ポウ: {方法|ほうほう}・{法律|ほうりつ}・{文法|ぶんぽう}', 'ぽう sau ん'],
        ['種', '{種|たね} (hạt giống)', 'シュ: {種類|しゅるい}', '{種類|しゅるい} — しゅ (không phải しゅう)'],
        ['類', '—', 'ルイ: {種類|しゅるい}・{書類|しょるい}', '—'],
        ['告', '{告|つ}げる', 'コク: {報告|ほうこく}・{広告|こうこく}', 'コク — không đọc ~~こう~~'],
        ['和', '{和|やわ}らぐ・{和|なご}む', 'ワ: {平和|へいわ}・{和食|わしょく}', '{平和|へいわ} — へい (không phải ~~ひょう~~)'],
        ['戦', '{戦|たたか}う', 'セン: {戦争|せんそう}・{挑戦|ちょうせん}', '—'],
        ['争', '{争|あらそ}う', 'ソウ: {戦争|せんそう}・{競争|きょうそう}', 'そう trường âm'],
      ],
    },
    {
      t: 'table',
      caption: 'Chữ trông giống — bẫy của đề 表記',
      head: ['Chữ của bài', 'Chữ dễ nhầm', 'Phân biệt'],
      rows: [
        ['原 (nguyên)', '願 (nguyện) · 源 (nguồn)', '願 = 原 + 頁; 源 = 氵 + 原. {原因|げんいん} chỉ có 原 trần.'],
        ['因 (nhân)', '困 (khốn) · 固 (cố)', 'trong khung: 因 → 大 · 困 → 木 · 固 → 古.'],
        ['影 (ảnh)', '景 (cảnh)', '影 có thêm 彡 bên phải.'],
        ['政 (chính)', '故 (cố) · 敗 (bại)', 'bên trái: 政 → 正 · 故 → 古 · 敗 → 貝; cùng 攵 bên phải.'],
        ['民 (dân)', '氏 (thị)', '民 có khung 口 phía trên (5 nét); 氏 4 nét.'],
        ['候 (hậu)', '侯 (hầu) · 修 (tu)', '候 có một nét sổ ngắn giữa 亻 và phần phải.'],
        ['速 (tốc)', '束 (thúc) · 連 (liên) · 遠 (viễn)', '辶 + 束 = 速; 辶 + 車 = 連; 辶 + 袁 = 遠.'],
        ['路 (lộ)', '落 (lạc) · 絡 (lạc)', 'cùng 各: 路 có ⻊ (chân); 落 có 艹 + 氵; 絡 có 糸.'],
        ['値 (trị)', '直 (trực) · 植 (thực)', '値 = 亻 + 直; 植 = 木 + 直.'],
        ['法 (pháp)', '去 (khứ) · 決 (quyết)', '法 = 氵 + 去; 決 = 氵 + 夬.'],
        ['種 (chủng)', '重 (trọng) · 動 (động)', '種 = 禾 + 重; 動 = 重 + 力.'],
        ['和 (hoà)', '利 (lợi) · 私 (tư) · 知 (tri)', '禾 + 口 = 和; 禾 + 刂 = 利; 禾 + 厶 = 私; 矢 + 口 = 知.'],
        ['戦 (chiến)', '単 (đơn) · 獣 (thú)', '戦 = 単 + 戈.'],
        ['争 (tranh)', '事 (sự) · 急 (cấp)', '争 trên là ⺈; 事 trên là 一 + 口; 急 dưới có 心.'],
      ],
    },
    {
      t: 'readkanji',
      id: 'b27-doc-kanji',
      title: 'Đọc KHÔNG furigana — 22 câu (chữ mới + chữ đã học)',
      note: 'Che phần đáp án, đọc to cả câu rồi bấm hiện cách đọc. Câu nào vấp ở chữ mới thì quay lại bảng trên.',
      items: [
        { text: '{事故|じこ}の{原因|げんいん}は、まだ{分|わ}かりません。', ro: "Jiko no gen'in wa, mada wakarimasen.", vi: 'Nguyên nhân vụ tai nạn vẫn chưa rõ.' },
        { text: '{台風|たいふう}の{影響|えいきょう}で、{電車|でんしゃ}が{遅|おく}れています。', ro: 'Taifuu no eikyou de, densha ga okurete imasu.', vi: 'Do ảnh hưởng của bão, tàu đang chậm.' },
        { text: '{夏|なつ}は{木|き}の{影|かげ}で{休|やす}みましょう。', ro: 'Natsu wa ki no kage de yasumimashou.', vi: 'Mùa hè hãy nghỉ dưới bóng cây.' },
        { text: '{山|やま}の{上|うえ}で、{大|おお}きな{声|こえ}が{響|ひび}きました。', ro: 'Yama no ue de, ookina koe ga hibikimashita.', vi: 'Trên núi, một tiếng gọi lớn vang lên.' },
        { text: '{父|ちち}は{毎朝|まいあさ}、{政治|せいじ}のニュースを{見|み}ます。', ro: 'Chichi wa maiasa, seiji no nyuusu o mimasu.', vi: 'Bố tôi sáng nào cũng xem tin chính trị.' },
        { text: '{新|あたら}しいルールで、{国民|こくみん}の{生活|せいかつ}が{変|か}わりました。', ro: 'Atarashii ruuru de, kokumin no seikatsu ga kawarimashita.', vi: 'Quy định mới làm đời sống người dân thay đổi.' },
        { text: 'この{町|まち}の{住民|じゅうみん}は、とても{親切|しんせつ}です。', ro: 'Kono machi no juumin wa, totemo shinsetsu desu.', vi: 'Cư dân thị trấn này rất tốt bụng.' },
        { text: '{駅|えき}の{近|ちか}くで{事件|じけん}がありました。', ro: 'Eki no chikaku de jiken ga arimashita.', vi: 'Có một vụ án gần nhà ga.' },
        { text: '{友達|ともだち}から{結婚式|けっこんしき}の{招待状|しょうたいじょう}が{届|とど}きました。', ro: 'Tomodachi kara kekkonshiki no shoutaijou ga todokimashita.', vi: 'Thiệp mời đám cưới của bạn đã đến.' },
        { text: '{日本|にほん}の{春|はる}は、{気候|きこう}がいいです。', ro: 'Nihon no haru wa, kikou ga ii desu.', vi: 'Mùa xuân ở Nhật khí hậu dễ chịu.' },
        { text: '{明日|あした}の{天候|てんこう}が{心配|しんぱい}です。', ro: 'Ashita no tenkou ga shinpai desu.', vi: 'Tôi lo thời tiết ngày mai.' },
        { text: 'ここでは{車|くるま}の{速度|そくど}に{注意|ちゅうい}してください。', ro: 'Koko de wa kuruma no sokudo ni chuui shite kudasai.', vi: 'Ở đây hãy chú ý tốc độ xe.' },
        { text: 'テレビにニュース{速報|そくほう}が{出|で}ました。', ro: 'Terebi ni nyuusu sokuhou ga demashita.', vi: 'Trên ti vi hiện tin nhanh.' },
        { text: '{朝|あさ}の{道路|どうろ}はいつも{混|こ}んでいます。', ro: 'Asa no douro wa itsumo konde imasu.', vi: 'Đường buổi sáng lúc nào cũng đông.' },
        { text: '{最近|さいきん}、{物価|ぶっか}が{上|あ}がっています。', ro: 'Saikin, bukka ga agatte imasu.', vi: 'Dạo này vật giá đang tăng.' },
        { text: 'この{店|みせ}は、{値段|ねだん}が{少|すこ}し{高|たか}いです。', ro: 'Kono mise wa, nedan ga sukoshi takai desu.', vi: 'Quán này giá hơi cao.' },
        { text: '{新|あたら}しい{方法|ほうほう}で{漢字|かんじ}を{覚|おぼ}えています。', ro: 'Atarashii houhou de kanji o oboete imasu.', vi: 'Tôi đang nhớ chữ Hán bằng một cách mới.' },
        { text: 'ケーキは{三種類|さんしゅるい}あります。どれがいいですか。', ro: 'Keeki wa sanshurui arimasu. Dore ga ii desu ka.', vi: 'Có ba loại bánh. Bạn thích loại nào?' },
        { text: '{旅行|りょこう}のことを、{先生|せんせい}に{報告|ほうこく}しました。', ro: 'Ryokou no koto o, sensei ni houkoku shimashita.', vi: 'Tôi đã báo cáo với thầy về chuyến đi.' },
        { text: '{私|わたし}は{和食|わしょく}が{大好|だいす}きです。', ro: 'Watashi wa washoku ga daisuki desu.', vi: 'Tôi rất thích món Nhật.' },
        { text: '{祖父|そふ}は{戦争|せんそう}の{話|はなし}をしてくれました。', ro: 'Sofu wa sensou no hanashi o shite kuremashita.', vi: 'Ông tôi đã kể cho tôi nghe chuyện chiến tranh.' },
        { text: '{世界|せかい}が{平和|へいわ}になってほしいです。', ro: 'Sekai ga heiwa ni natte hoshii desu.', vi: 'Tôi mong thế giới hoà bình.' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b27-doc-doan',
      title: 'Đọc đoạn ngắn kiểu đề — 3 đoạn không furigana',
      note: 'Đọc to cả đoạn trong 50 giây như phần Reading của thi nói, rồi mới mở đáp án.',
      items: [
        { text: '{昨日|きのう}の{夜|よる}から、{台風|たいふう}の{影響|えいきょう}で{強|つよ}い{雨|あめ}が{降|ふ}っています。{道路|どうろ}は{水|みず}が{多|おお}くて{危|あぶ}ないため、{車|くるま}の{速度|そくど}を{落|お}としてください。{電車|でんしゃ}も{遅|おく}れているので、{駅|えき}で{情報|じょうほう}を{確|たし}かめてから{出|で}かけましょう。', ro: 'Kinou no yoru kara, taifuu no eikyou de tsuyoi ame ga futte imasu. Douro wa mizu ga ookute abunai tame, kuruma no sokudo o otoshite kudasai. Densha mo okurete iru node, eki de jouhou o tashikamete kara dekakemashou.', vi: 'Từ tối qua, do ảnh hưởng của bão, mưa đang rơi rất to. Đường nhiều nước nguy hiểm nên hãy giảm tốc độ xe. Tàu cũng đang chậm, vì vậy hãy kiểm tra thông tin ở ga rồi hãy đi.' },
        { text: '{最近|さいきん}、{野菜|やさい}の{値段|ねだん}が{上|あ}がっています。{原因|げんいん}は、{天候|てんこう}が{悪|わる}かったためだそうです。{物価|ぶっか}が{上|あ}がると、{国民|こくみん}の{生活|せいかつ}は{大変|たいへん}になります。{政治|せいじ}の{力|ちから}で、{早|はや}く{何|なん}とかしてほしいです。', ro: "Saikin, yasai no nedan ga agatte imasu. Gen'in wa, tenkou ga warukatta tame da sou desu. Bukka ga agaru to, kokumin no seikatsu wa taihen ni narimasu. Seiji no chikara de, hayaku nan to ka shite hoshii desu.", vi: 'Dạo này giá rau đang tăng. Nghe nói nguyên nhân là do thời tiết xấu. Vật giá tăng thì đời sống người dân sẽ vất vả. Tôi mong chính trị sớm làm được gì đó.' },
        { text: '{祖父|そふ}は{子|こ}どものころ、{戦争|せんそう}を{経験|けいけん}しました。{国|くに}によって{戦争|せんそう}の{記録|きろく}の{残|のこ}し{方|かた}はさまざまですが、{祖父|そふ}はいつも「{平和|へいわ}が{一番|いちばん}{大切|たいせつ}だ」と{言|い}っています。', ro: 'Sofu wa kodomo no koro, sensou o keiken shimashita. Kuni ni yotte sensou no kiroku no nokoshikata wa samazama desu ga, sofu wa itsumo "Heiwa ga ichiban taisetsu da" to itte imasu.', vi: 'Ông tôi đã trải qua chiến tranh khi còn nhỏ. Tuỳ nước mà cách lưu giữ tư liệu về chiến tranh mỗi nơi một khác, nhưng ông tôi lúc nào cũng nói: "Hoà bình là quý nhất."' },
      ],
    },
    {
      t: 'mcq',
      id: 'b27-han-doc',
      title: '漢字読み — chọn cách đọc của từ in đậm (14 câu)',
      items: [
        { q: '{事故|じこ}の**原因**を{調|しら}べます。', options: ['げにん', 'げんいん', 'がんいん', 'げんにん'], correct: 1, why: '**{原因|げんいん}** (gen\'in) — ん + い, không nối thành ~~げにん~~.' },
        { q: '{雨|あめ}の**影響**で{遅|おく}れました。', options: ['えいきょ', 'えいきょう', 'かげきょう', 'えいこう'], correct: 1, why: '**{影響|えいきょう}** (eikyou) — きょう trường âm.' },
        { q: '**政治**に{興味|きょうみ}があります。', options: ['せいじ', 'しょうじ', 'せいち', 'まつりじ'], correct: 0, why: '**{政治|せいじ}** (seiji) — 治 ở đây đọc じ.' },
        { q: '**国民**の{声|こえ}を{聞|き}く。', options: ['くにみん', 'こくみん', 'こくたみ', 'ごくみん'], correct: 1, why: '**{国民|こくみん}** (kokumin).' },
        { q: '**住民**が{集|あつ}まりました。', options: ['じゅうみん', 'じゅみん', 'すみん', 'じゅうたみ'], correct: 0, why: '**{住民|じゅうみん}** (juumin) — じゅう trường âm.' },
        { q: '{昨日|きのう}、**事件**がありました。', options: ['じこ', 'じけん', 'しけん', 'じげん'], correct: 1, why: '**{事件|じけん}** (jiken). しけん = {試験|しけん} (thi) — bẫy âm gần.' },
        { q: '{今年|ことし}は**天候**が{悪|わる}い。', options: ['てんこう', 'てんきょう', 'てんごう', 'てんこ'], correct: 0, why: '**{天候|てんこう}** (tenkou).' },
        { q: '**速度**を{落|お}としてください。', options: ['そくど', 'はやど', 'そうど', 'そくたく'], correct: 0, why: '**{速度|そくど}** (sokudo).' },
        { q: '**道路**が{渋滞|じゅうたい}しています。', options: ['みちろ', 'どろ', 'どうろ', 'とうろ'], correct: 2, why: '**{道路|どうろ}** (douro) — どう trường âm; どろ = bùn.' },
        { q: '**物価**が{高|たか}い。', options: ['ものか', 'ぶつか', 'ぶっか', 'ぶっが'], correct: 2, why: '**{物価|ぶっか}** (bukka) — có âm ngắt.' },
        { q: 'この**値段**は{安|やす}いです。', options: ['ちだん', 'ねだん', 'あたいだん', 'ねたん'], correct: 1, why: '**{値段|ねだん}** — 値 đọc KUN ね.' },
        { q: '{新|あたら}しい**方法**を{試|ため}します。', options: ['ほうほう', 'ほうぽう', 'かたほう', 'ほほう'], correct: 0, why: '**{方法|ほうほう}** (houhou). ぽう chỉ sau ん ({文法|ぶんぽう}).' },
        { q: '{上司|じょうし}に**報告**しました。', options: ['ほうこう', 'ほうごく', 'ほうこく', 'ほこく'], correct: 2, why: '**{報告|ほうこく}** (houkoku) — 告 = こく.' },
        { q: '**和食**のレストランに{行|い}きました。', options: ['わしょく', 'わじき', 'かしょく', 'わぐ'], correct: 0, why: '**{和食|わしょく}** (washoku).' },
      ],
    },
    {
      t: 'mcq',
      id: 'b27-han-chon',
      title: '表記 — chọn chữ Hán đúng cho từ viết bằng hiragana (12 câu)',
      items: [
        { q: '{火事|かじ}の**げんいん**は{何|なん}ですか。', options: ['原困', '原因', '願因', '源因'], correct: 1, why: '**原因** — 因 trong khung là 大 (困 là 木).' },
        { q: '{雨|あめ}の**えいきょう**で{遅|おく}れた。', options: ['景響', '影郷', '影響', '映響'], correct: 2, why: '**影響** — 影 có 彡; 響 dưới là 音.' },
        { q: '**せいじ**のニュースを{読|よ}む。', options: ['正治', '政治', '故治', '政地'], correct: 1, why: '**政治** — 政 = 正 + 攵.' },
        { q: '**しみん**の{意見|いけん}を{聞|き}く。', options: ['市氏', '市民', '市眠', '詩民'], correct: 1, why: '**市民** — 民 (dân). 眠 (ngủ) có 目 bên trái.' },
        { q: '{大|おお}きな**じけん**が{起|お}きた。', options: ['事件', '事牛', '字件', '事県'], correct: 0, why: '**事件** — 件 = 亻 + 牛. 県 là tỉnh.' },
        { q: '{日本|にほん}の**きこう**は{住|す}みやすい。', options: ['気侯', '気候', '記候', '気校'], correct: 1, why: '**気候** — 候 có nét sổ ngắn (侯 không có).' },
        { q: 'この{電車|でんしゃ}は**はやい**。', options: ['早い', '速い', '束い', '連い'], correct: 1, why: 'Nhanh về TỐC ĐỘ → **速い**. 早い = sớm.' },
        { q: '**どうろ**を{渡|わた}るときは{気|き}をつけて。', options: ['道路', '道落', '道絡', '堂路'], correct: 0, why: '**道路** — 路 có ⻊ (chân).' },
        { q: 'りんごの**ねだん**が{上|あ}がった。', options: ['直段', '植段', '値段', '値談'], correct: 2, why: '**値段** — 値 = 亻 + 直; 段 (bậc).' },
        { q: '{勉強|べんきょう}の**ほうほう**を{変|か}えた。', options: ['方去', '方法', '方決', '放法'], correct: 1, why: '**方法** — 法 = 氵 + 去.' },
        { q: 'いろいろな**しゅるい**の{花|はな}がある。', options: ['重類', '種数', '種類', '動類'], correct: 2, why: '**種類** — 種 = 禾 + 重; 類 có 頁.' },
        { q: '{世界|せかい}の**へいわ**を{願|ねが}う。', options: ['平利', '平私', '平和', '兵和'], correct: 2, why: '**平和** — 和 = 禾 + 口.' },
      ],
    },
    {
      t: 'write',
      id: 'b27-viet-kanji',
      title: 'Tập viết — 6 chữ ✍ và 8 từ',
      note: 'Viết 6 chữ ✍ trước (đúng thứ tự nét theo hoạt hình — chú ý 民 có nét móc cuối, 速 viết 束 trước rồi mới đến 辶), rồi viết cả từ. 👁 chỉ cần đọc được — viết thêm nếu còn thời gian.',
      chars: ['民', '件', '速', '法', '告', '和', '原因', '影響', '政治', '国民', '道路', '値段', '種類', '報告'],
      goi: {
        '原因': 'げんいん · nguyên nhân',
        '影響': 'えいきょう · ảnh hưởng',
        '政治': 'せいじ · chính trị',
        '国民': 'こくみん · người dân',
        '道路': 'どうろ · đường xe chạy',
        '値段': 'ねだん · giá',
        '種類': 'しゅるい · loại',
        '報告': 'ほうこく · báo cáo',
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
  id: 'b27-nghe',
  kind: 'listening',
  title: 'Nghe hiểu N3 — 7 bài theo đủ 5 dạng đề: 課題理解 · ポイント理解 · 概要理解 (bản tin) · 発話表現 · 即時応答',
  goal: 'Nghe hội thoại ở văn phòng trường và điện thoại với chỗ làm thêm trong ngày bão / tuyết để biết việc phải làm TRƯỚC (～ため休講, ～の影響で止まっている, ～のせいで店を閉める); nghe để bắt đúng lý do thật sau hai lý do bị phủ định (寝坊？電車のせい？→ ～たとたん気がついた); nghe một bản tin kinh tế ~1 phút để nắm chủ đề, nguyên nhân (～ため・～によって) và ảnh hưởng (～の影響で); chọn câu nói đúng (おかげで ↔ せいで ↔ ため) trong tình huống; đáp ngay câu than phiền, cảm ơn, hỏi tin, hỏi "tuỳ…" và "do ai làm ra".',
  minutes: 50,
  blocks: [
    {
      t: 'table',
      caption: 'Phần nghe (聴解) đề JLPT N3 — 40 phút',
      head: ['Mondai', 'Dạng', 'Số câu', 'Mẹo của bài này'],
      rows: [
        ['問題1', '課題理解 — việc phải làm', '6', 'Ngày bão / tuyết: việc bị huỷ vì ～ため／～の影響で → còn lại việc gì? Thứ tự "まず" thường đổi ở cuối bài.'],
        ['問題2', 'ポイント理解 — lý do, điểm chính', '6', '"～のせい？" → "違うよ" → lý do thật đến SAU, thường có ～たとたん／実は.'],
        ['問題3', '概要理解 — ý chính (độc thoại)', '3', 'Bản tin: câu đầu = chủ đề; ～ため／～によって = nguyên nhân; ～の影響で = ảnh hưởng; 専門家は～と話しています = dự báo.'],
        ['問題4', '発話表現 — nói gì trong tình huống', '4', 'Cảm ơn → おかげで; xin lỗi, giải thích lịch sự → ～ため／～て; than → せいで; đoán → せいか.'],
        ['問題5', '即時応答 — đáp ngay', '9', 'Bạn than "～のせいで…" → an ủi (それは残念だったね); bạn khen → "～のおかげです".'],
      ],
    },
    {
      t: 'note',
      title: 'Chiến thuật nghe bản tin (ニュース) — cấp N3',
      items: [
        '**Câu đầu tiên là chủ đề**: 「{次|つぎ}のニュースです。～」 — ghi ngay 2–3 từ khoá ({野菜|やさい}・{値段|ねだん}・{上|あ}がる).',
        '**Nguyên nhân** đứng trước **～ため／～ため、／～によって／～により／～の{影響|えいきょう}で**. **Kết quả / ảnh hưởng** đứng sau. Đề 概要理解 hay hỏi "ニュースは{何|なに}について{伝|つた}えていますか" → đáp án thường gói **cả nguyên nhân lẫn ảnh hưởng**.',
        '**Nguồn tin** đứng trước **～によると・～の{話|はなし}では** và câu kết bằng **～ということです／～そうです** (người khác nói, không phải phát thanh viên).',
        '**Dự báo** ở cuối bản tin: **{専門家|せんもんか}は～だろうと{話|はな}しています／～見通しです**.',
        'Số và ngày đọc rất nhanh — ghi số trước, hiểu sau. Từ hay rơi rớt: {各地|かくち}・{一方|いっぽう} (mặt khác)・{特|とく}に・{近|ちか}く (gần — {二倍近|にばいちか}く = gần gấp đôi).',
      ],
    },

    /* ── 1 ── */
    { t: 'h', text: 'Bài 1 — 問題1 課題理解: ngày bão — hỏi văn phòng trường' },
    NG('b27-ng-1', '{男|おとこ}の{留学生|りゅうがくせい}はこのあとまず{何|なに}をしますか', 'Dạng 課題理解 — trang web của trường: SÁNG MAI mới xem; hạn nộp báo cáo: hỏi THẦY (email — về ký túc xá rồi gửi); cửa sổ rung: báo QUẢN LÝ KÝ TÚC XÁ — phòng đóng lúc 5 giờ, bây giờ 4 rưỡi → làm TRƯỚC.', [
      ['ナレーター', 'ja-nu', '{大学|だいがく}の{事務室|じむしつ}で、{事務|じむ}の{人|ひと}と{男|おとこ}の{留学生|りゅうがくせい}が{話|はな}しています。{男|おとこ}の{留学生|りゅうがくせい}はこのあとまず{何|なに}をしますか。', 'Daigaku no jimushitsu de, jimu no hito to otoko no ryuugakusei ga hanashite imasu. Otoko no ryuugakusei wa kono ato mazu nani o shimasu ka.', 'Ở văn phòng trường, nhân viên văn phòng và một nam du học sinh đang nói chuyện. Sau đây nam du học sinh sẽ làm gì trước tiên?'],
      ['カルロス', 'ja-nam', 'すみません。{明日|あした}、{台風|たいふう}が{来|く}るそうですが、{講義|こうぎ}はありますか。', 'Sumimasen. Ashita, taifuu ga kuru sou desu ga, kougi wa arimasu ka.', 'Xin lỗi. Nghe nói mai bão đến, vậy có giờ giảng không ạ?'],
      ['{事務|じむ}の{人|ひと}', 'ja-nu', '{明日|あした}の{講義|こうぎ}については、{朝|あさ}6{時|じ}に{大学|だいがく}のホームページでお{知|し}らせします。{大雨警報|おおあめけいほう}が{出|で}ている{場合|ばあい}は、{午前|ごぜん}の{講義|こうぎ}は{休講|きゅうこう}になります。', 'Ashita no kougi ni tsuite wa, asa rokuji ni daigaku no hoomupeeji de oshirase shimasu. Ooame keihou ga dete iru baai wa, gozen no kougi wa kyuukou ni narimasu.', 'Về giờ giảng ngày mai, 6 giờ sáng chúng tôi sẽ thông báo trên trang web của trường. Trường hợp đang có cảnh báo mưa lớn thì các giờ giảng buổi sáng sẽ được nghỉ.'],
      ['カルロス', 'ja-nam', 'そうですか。でも、{僕|ぼく}は{来週|らいしゅう}の{月曜日|げつようび}が{締|し}め{切|き}りのレポートがあって……。', 'Sou desu ka. Demo, boku wa raishuu no getsuyoubi ga shimekiri no repooto ga atte…….', 'Vậy ạ. Nhưng em có bài báo cáo hạn nộp thứ Hai tuần sau…'],
      ['{事務|じむ}の{人|ひと}', 'ja-nu', '{締|し}め{切|き}りは{先生|せんせい}によって{違|ちが}いますから、それは{先生|せんせい}に{直接|ちょくせつ}{確認|かくにん}してください。', 'Shimekiri wa sensei ni yotte chigaimasu kara, sore wa sensei ni chokusetsu kakunin shite kudasai.', 'Hạn nộp thì tuỳ thầy cô mà khác nhau, nên việc đó em hãy hỏi trực tiếp thầy cô nhé.'],
      ['カルロス', 'ja-nam', '{分|わ}かりました。それから、{寮|りょう}の{窓|まど}が{古|ふる}くて、{風|かぜ}が{強|つよ}いとすごく{揺|ゆ}れるんですが……。', 'Wakarimashita. Sorekara, ryou no mado ga furukute, kaze ga tsuyoi to sugoku yureru n desu ga…….', 'Em hiểu rồi. Còn nữa, cửa sổ ký túc xá cũ, gió mạnh là rung dữ lắm ạ…'],
      ['{事務|じむ}の{人|ひと}', 'ja-nu', 'それは{寮|りょう}の{管理人|かんりにん}さんに{言|い}ってください。でも、{管理人室|かんりにんしつ}は{今日|きょう}は5{時|じ}で{閉|し}まりますよ。', 'Sore wa ryou no kanrinin-san ni itte kudasai. Demo, kanrininshitsu wa kyou wa goji de shimarimasu yo.', 'Việc đó em báo chú quản lý ký túc xá nhé. Nhưng hôm nay phòng quản lý đóng cửa lúc 5 giờ đấy.'],
      ['カルロス', 'ja-nam', 'えっ、もう4{時半|じはん}ですね。じゃ、まず、そちらに{行|い}ってきます。{先生|せんせい}へのメールは、{寮|りょう}に{帰|かえ}ってから{送|おく}ります。', 'E, mou yojihan desu ne. Ja, mazu, sochira ni itte kimasu. Sensei e no meeru wa, ryou ni kaette kara okurimasu.', 'Ơ, đã 4 rưỡi rồi. Vậy trước tiên em đến đó đã. Email cho thầy thì về ký túc xá rồi em gửi.'],
      ['{事務|じむ}の{人|ひと}', 'ja-nu', 'そうしてください。ホームページは、{明日|あした}の{朝|あさ}{必|かなら}ず{見|み}てくださいね。', 'Sou shite kudasai. Hoomupeeji wa, ashita no asa kanarazu mite kudasai ne.', 'Em làm vậy nhé. Còn trang web thì sáng mai nhất định phải xem đấy.'],
    ]),
    {
      t: 'mcq',
      id: 'b27-ng-1-q',
      title: 'Bài 1 — chọn đáp án',
      items: [
        { q: '{男|おとこ}の{留学生|りゅうがくせい}はこのあとまず{何|なに}をしますか。', options: ['{大学|だいがく}のホームページを{見|み}る', '{先生|せんせい}にメールを{送|おく}る', '{寮|りょう}の{管理人室|かんりにんしつ}に{行|い}く', '{事務室|じむしつ}でレポートを{出|だ}す'], correct: 2, why: 'Phòng quản lý đóng lúc 5 giờ, bây giờ đã 4 rưỡi → **まず、そちらに{行|い}ってきます**. Email thì "về rồi gửi"; trang web thì "sáng mai". 〔Mazu, sochira ni itte kimasu.〕' },
        { q: '{明日|あした}の{午前|ごぜん}の{講義|こうぎ}は、どんなとき{休講|きゅうこう}になりますか。', options: ['{台風|たいふう}が{来|き}たとき', '{大雨警報|おおあめけいほう}が{出|で}ているとき', '{朝|あさ}6{時|じ}に{雨|あめ}が{降|ふ}っているとき', '{先生|せんせい}がメールを{送|おく}ったとき'], correct: 1, why: '**{大雨警報|おおあめけいほう}が{出|で}ている{場合|ばあい}は、{午前|ごぜん}の{講義|こうぎ}は{休講|きゅうこう}** — điều kiện là CẢNH BÁO, không phải chỉ "bão đến" hay "trời mưa". 〔Ooame keihou ga dete iru baai wa…〕' },
      ],
    },

    /* ── 2 ── */
    { t: 'h', text: 'Bài 2 — 問題1 課題理解: tuyết lớn — điện thoại với anh chủ quán' },
    NG('b27-ng-2', '{女|おんな}の{留学生|りゅうがくせい}は{明日|あした}{何|なに}をしますか', 'Dạng 課題理解 — hôm nay: quán đóng sớm vì tuyết → nghỉ làm, KHÔNG cần chờ tàu. Ngày mai: đến lúc 8 giờ (sớm hơn 1 tiếng) để xúc tuyết; nên đi XE BUÝT.', [
      ['ナレーター', 'ja-nu', '{女|おんな}の{留学生|りゅうがくせい}とアルバイト{先|さき}の{店長|てんちょう}が{電話|でんわ}で{話|はな}しています。{女|おんな}の{留学生|りゅうがくせい}は{明日|あした}{何|なに}をしますか。', 'Onna no ryuugakusei to arubaito saki no tenchou ga denwa de hanashite imasu. Onna no ryuugakusei wa ashita nani o shimasu ka.', 'Một nữ du học sinh và anh chủ quán nơi cô làm thêm đang nói chuyện điện thoại. Ngày mai nữ du học sinh sẽ làm gì?'],
      ['{店長|てんちょう}', 'ja-nam', 'もしもし、リンさん？{小林|こばやし}です。{今日|きょう}のアルバイトのことなんだけど。', 'Moshimoshi, Rin-san? Kobayashi desu. Kyou no arubaito no koto na n da kedo.', 'Alô, Linh à? Anh Kobayashi đây. Anh gọi về chuyện ca làm hôm nay.'],
      ['リン', 'ja-nu', 'はい。{実|じつ}は{今|いま}、{駅|えき}にいるんですが、{大雪|おおゆき}の{影響|えいきょう}で{電車|でんしゃ}が{止|と}まっているんです。', 'Hai. Jitsu wa ima, eki ni iru n desu ga, ooyuki no eikyou de densha ga tomatte iru n desu.', 'Dạ. Thật ra bây giờ em đang ở ga, mà do ảnh hưởng của tuyết lớn nên tàu đang dừng ạ.'],
      ['{店長|てんちょう}', 'ja-nam', 'そうか、ニュースで{見|み}たよ。{動|うご}くのを{待|ま}たなくていいよ。{今日|きょう}は{雪|ゆき}のせいでお{客|きゃく}さんも{少|すく}ないから、{店|みせ}を{早|はや}く{閉|し}めることにしたんだ。', 'Sou ka, nyuusu de mita yo. Ugoku no o matanakute ii yo. Kyou wa yuki no sei de okyaku-san mo sukunai kara, mise o hayaku shimeru koto ni shita n da.', 'Ừ, anh xem tin rồi. Em không cần chờ tàu chạy đâu. Hôm nay tại tuyết nên khách cũng ít, anh quyết định đóng quán sớm.'],
      ['リン', 'ja-nu', 'すみません。じゃ、{今日|きょう}はお{休|やす}みしてもいいですか。', 'Sumimasen. Ja, kyou wa oyasumi shite mo ii desu ka.', 'Em xin lỗi. Vậy hôm nay em nghỉ được không ạ?'],
      ['{店長|てんちょう}', 'ja-nam', 'うん。そのかわり、{明日|あした}の{朝|あさ}、{少|すこ}し{早|はや}く{来|き}てもらえるかな。{店|みせ}の{前|まえ}の{雪|ゆき}かきを{手伝|てつだ}ってほしいんだ。', 'Un. Sono kawari, ashita no asa, sukoshi hayaku kite moraeru ka na. Mise no mae no yukikaki o tetsudatte hoshii n da.', 'Ừ. Bù lại, sáng mai em đến sớm một chút được không? Anh muốn em giúp xúc tuyết trước cửa quán.'],
      ['リン', 'ja-nu', 'はい。{何時|なんじ}に{行|い}けばいいですか。', 'Hai. Nanji ni ikeba ii desu ka.', 'Vâng. Em đến lúc mấy giờ ạ?'],
      ['{店長|てんちょう}', 'ja-nam', 'いつもより1{時間|じかん}{早|はや}い8{時|じ}にお{願|ねが}い。あ、それから、{電車|でんしゃ}がまた{遅|おく}れるかもしれないから、{明日|あした}はバスで{来|き}たほうがいいね。', 'Itsumo yori ichijikan hayai hachiji ni onegai. A, sorekara, densha ga mata okureru kamo shirenai kara, ashita wa basu de kita hou ga ii ne.', 'Sớm hơn mọi khi 1 tiếng, 8 giờ nhé. À, còn nữa, tàu có khi lại chậm nên mai em đi xe buýt thì hơn.'],
      ['リン', 'ja-nu', '{分|わ}かりました。バスの{時間|じかん}を{調|しら}べて、8{時|じ}までに{行|い}きます。', 'Wakarimashita. Basu no jikan o shirabete, hachiji made ni ikimasu.', 'Em hiểu rồi. Em sẽ tra giờ xe buýt và đến trước 8 giờ.'],
    ]),
    {
      t: 'mcq',
      id: 'b27-ng-2-q',
      title: 'Bài 2 — chọn đáp án',
      items: [
        { q: '{女|おんな}の{留学生|りゅうがくせい}は{明日|あした}{何|なに}をしますか。', options: ['いつもの{時間|じかん}に{電車|でんしゃ}で{店|みせ}に{行|い}く', 'バスで8{時|じ}までに{店|みせ}に{行|い}って、{雪|ゆき}かきを{手伝|てつだ}う', '{電車|でんしゃ}が{動|うご}くまで{駅|えき}で{待|ま}つ', '{店長|てんちょう}に{電話|でんわ}して{休|やす}む'], correct: 1, why: '**8{時|じ}**（いつもより1{時間|じかん}{早|はや}い）+ **{雪|ゆき}かき** + **バスで**. 〔Hachiji made ni ikimasu.〕' },
        { q: '{店長|てんちょう}はどうして{今日|きょう}{店|みせ}を{早|はや}く{閉|し}めますか。', options: ['{電車|でんしゃ}が{止|と}まったから', '{雪|ゆき}のせいでお{客|きゃく}さんが{少|すく}ないから', 'リンさんが{来|こ}られないから', '{雪|ゆき}かきをしなければならないから'], correct: 1, why: '**{雪|ゆき}のせいでお{客|きゃく}さんも{少|すく}ないから、{店|みせ}を{早|はや}く{閉|し}める**. 〔Yuki no sei de okyaku-san mo sukunai kara…〕' },
      ],
    },

    /* ── 3 ── */
    { t: 'h', text: 'Bài 3 — 問題2 ポイント理解: vì sao cậu ấy đến lớp muộn?' },
    NG('b27-ng-3', '{男|おとこ}の{学生|がくせい}はどうして{授業|じゅぎょう}に{遅|おく}れましたか', 'Dạng ポイント理解 — "ngủ quên?" → KHÔNG (dậy 6 giờ); "tàu chậm vì mưa?" → KHÔNG (tàu đúng giờ); lý do thật đến SAU: vừa đến ga thì nhận ra quên vé tháng → quay về ký túc xá.', [
      ['ナレーター', 'ja-nu', '{男|おとこ}の{学生|がくせい}と{女|おんな}の{学生|がくせい}が{話|はな}しています。{男|おとこ}の{学生|がくせい}はどうして{授業|じゅぎょう}に{遅|おく}れましたか。', 'Otoko no gakusei to onna no gakusei ga hanashite imasu. Otoko no gakusei wa doushite jugyou ni okuremashita ka.', 'Một nam sinh và một nữ sinh đang nói chuyện. Vì sao nam sinh đến lớp muộn?'],
      ['マリヤム', 'ja-nu', 'ダニエルさん、{今日|きょう}、1{限|げん}に{遅|おく}れたでしょう。また{寝坊|ねぼう}？', 'Danieru-san, kyou, ichigen ni okureta deshou. Mata nebou?', 'Daniel, hôm nay cậu đến muộn tiết 1 đúng không. Lại ngủ quên à?'],
      ['ダニエル', 'ja-nam', '{違|ちが}うよ。{今日|きょう}はちゃんと6{時|じ}に{起|お}きたんだ。', 'Chigau yo. Kyou wa chanto rokuji ni okita n da.', 'Không phải. Hôm nay mình dậy đàng hoàng lúc 6 giờ mà.'],
      ['マリヤム', 'ja-nu', 'じゃ、{電車|でんしゃ}？{雨|あめ}のせいで{遅|おく}れている{線|せん}があるって、ニュースで{言|い}ってたよ。', 'Ja, densha? Ame no sei de okurete iru sen ga aru tte, nyuusu de itteta yo.', 'Vậy là tại tàu? Tin tức nói có tuyến bị chậm tại mưa đấy.'],
      ['ダニエル', 'ja-nam', 'ううん、{電車|でんしゃ}は{時間|じかん}どおりだった。{実|じつ}は、{駅|えき}に{着|つ}いたとたん、{定期券|ていきけん}を{寮|りょう}に{忘|わす}れてきたことに{気|き}がついたんだ。', 'Uun, densha wa jikan doori datta. Jitsu wa, eki ni tsuita totan, teikiken o ryou ni wasurete kita koto ni ki ga tsuita n da.', 'Không, tàu đúng giờ. Thật ra vừa đến ga là mình nhận ra đã để quên vé tháng ở ký túc xá.'],
      ['マリヤム', 'ja-nu', 'えっ、それで{寮|りょう}に{戻|もど}ったの？', 'E, sore de ryou ni modotta no?', 'Hả, thế là cậu quay về ký túc xá à?'],
      ['ダニエル', 'ja-nam', 'うん。{切符|きっぷ}を{買|か}えばよかったんだけど、{慌|あわ}てていたせいか、そのことを{全然|ぜんぜん}{思|おも}いつかなくて……。', 'Un. Kippu o kaeba yokatta n da kedo, awatete ita sei ka, sono koto o zenzen omoitsukanakute…….', 'Ừ. Lẽ ra mua vé lẻ là xong, nhưng chắc tại cuống quá nên mình chẳng nghĩ ra…'],
      ['マリヤム', 'ja-nu', 'ダニエルさんらしいね。', 'Danieru-san rashii ne.', 'Đúng kiểu Daniel nhỉ.'],
    ]),
    {
      t: 'mcq',
      id: 'b27-ng-3-q',
      title: 'Bài 3 — chọn đáp án',
      items: [
        { q: '{男|おとこ}の{学生|がくせい}はどうして{授業|じゅぎょう}に{遅|おく}れましたか。', options: ['{寝坊|ねぼう}したから', '{雨|あめ}のせいで{電車|でんしゃ}が{遅|おく}れたから', '{定期券|ていきけん}を{取|と}りに{寮|りょう}に{戻|もど}ったから', '{切符|きっぷ}が{買|か}えなかったから'], correct: 2, why: 'Hai lý do đầu bị phủ định ({違|ちが}うよ／ううん). Lý do thật: **{駅|えき}に{着|つ}いたとたん、{定期券|ていきけん}を{忘|わす}れてきたことに{気|き}がついた** → quay về. Không phải "không mua được vé" — cậu ấy **không nghĩ ra** việc mua vé. 〔Teikiken o wasurete kita koto ni ki ga tsuita.〕' },
      ],
    },

    /* ── 4 ── */
    { t: 'h', text: 'Bài 4 — 問題3 概要理解: bản tin về giá rau' },
    NG('b27-ng-4', 'ニュース — {野菜|やさい}の{値段|ねだん}', 'Dạng 概要理解 (độc thoại, bản tin ~1 phút) — chủ đề ở câu đầu; nguyên nhân sau ～ため／～によって; ảnh hưởng sau ～の影響で; dự báo ở câu cuối.', [
      ['ナレーター', 'ja-nu', 'テレビでアナウンサーが{話|はな}しています。', 'Terebi de anaunsaa ga hanashite imasu.', 'Một phát thanh viên đang nói trên ti vi.'],
      ['アナウンサー', 'ja-nam', '{次|つぎ}のニュースです。{今年|ことし}の{夏|なつ}は{雨|あめ}の{日|ひ}が{少|すく}なく、{気温|きおん}の{高|たか}い{日|ひ}が{続|つづ}いたため、{各地|かくち}で{野菜|やさい}の{値段|ねだん}が{上|あ}がっています。', 'Tsugi no nyuusu desu. Kotoshi no natsu wa ame no hi ga sukunaku, kion no takai hi ga tsuzuita tame, kakuchi de yasai no nedan ga agatte imasu.', 'Tin tiếp theo. Mùa hè năm nay ít ngày mưa và những ngày nhiệt độ cao kéo dài, nên giá rau đang tăng ở nhiều nơi.'],
      ['アナウンサー', 'ja-nam', '{特|とく}にキャベツやレタスは、{去年|きょねん}の{同|おな}じ{時期|じき}の{二倍近|にばいちか}くになっています。{農家|のうか}の{人|ひと}によると、{暑|あつ}さによって{野菜|やさい}が{大|おお}きく{育|そだ}たなかったということです。', 'Toku ni kyabetsu ya retasu wa, kyonen no onaji jiki no nibai chikaku ni natte imasu. Nouka no hito ni yoru to, atsusa ni yotte yasai ga ookiku sodatanakatta to iu koto desu.', 'Đặc biệt bắp cải và xà lách đắt gần gấp đôi cùng kỳ năm ngoái. Theo nông dân, do nắng nóng mà rau không lớn được.'],
      ['アナウンサー', 'ja-nam', '{一方|いっぽう}、{野菜|やさい}の{値上|ねあ}がりの{影響|えいきょう}で、スーパーでは{冷凍野菜|れいとうやさい}がよく{売|う}れているそうです。{専門家|せんもんか}は、{涼|すず}しくなる{来月|らいげつ}の{中|なか}ごろには、{値段|ねだん}は{少|すこ}しずつ{下|さ}がるだろうと{話|はな}しています。', 'Ippou, yasai no neagari no eikyou de, suupaa de wa reitou yasai ga yoku urete iru sou desu. Senmonka wa, suzushiku naru raigetsu no nakagoro ni wa, nedan wa sukoshi zutsu sagaru darou to hanashite imasu.', 'Mặt khác, do ảnh hưởng của việc rau tăng giá, nghe nói rau đông lạnh đang bán rất chạy ở siêu thị. Các chuyên gia cho rằng khoảng giữa tháng sau, khi trời mát, giá sẽ giảm dần.'],
    ]),
    {
      t: 'mcq',
      id: 'b27-ng-4-q',
      title: 'Bài 4 — chọn đáp án (3 câu)',
      items: [
        { q: 'ニュースは{何|なに}について{伝|つた}えていますか。', options: ['{野菜|やさい}が{値上|ねあ}がりした{原因|げんいん}とその{影響|えいきょう}', '{冷凍野菜|れいとうやさい}の{作|つく}り{方|かた}', '{農家|のうか}の{人|ひと}の{生活|せいかつ}', '{来月|らいげつ}の{天気|てんき}'], correct: 0, why: 'Câu đầu: giá rau tăng (chủ đề) + ～ため (nguyên nhân) + ～の{影響|えいきょう}で (ảnh hưởng) → đáp án gói cả hai. 〔Yasai ga neagari shita gen\'in to sono eikyou.〕' },
        { q: '{野菜|やさい}の{値段|ねだん}が{上|あ}がった{原因|げんいん}は{何|なん}ですか。', options: ['{雨|あめ}が{多|おお}かったから', '{雨|あめ}が{少|すく}なく、{暑|あつ}い{日|ひ}が{続|つづ}いたから', '{冷凍野菜|れいとうやさい}がよく{売|う}れたから', '{農家|のうか}が{少|すく}なくなったから'], correct: 1, why: '**{雨|あめ}の{日|ひ}が{少|すく}なく、{気温|きおん}の{高|たか}い{日|ひ}が{続|つづ}いたため** + **{暑|あつ}さによって{育|そだ}たなかった**. Rau đông lạnh bán chạy là ẢNH HƯỞNG, không phải nguyên nhân. 〔Ame ga sukunaku, atsui hi ga tsuzuita kara.〕' },
        { q: '{専門家|せんもんか}は、{値段|ねだん}はいつごろ{下|さ}がると{言|い}っていますか。', options: ['{今週|こんしゅう}', '{来月|らいげつ}の{中|なか}ごろ', '{来年|らいねん}の{夏|なつ}', '{分|わ}からない'], correct: 1, why: '**{涼|すず}しくなる{来月|らいげつ}の{中|なか}ごろには、{少|すこ}しずつ{下|さ}がるだろう**. 〔Raigetsu no nakagoro.〕' },
      ],
    },

    /* ── 5 ── */
    { t: 'h', text: 'Bài 5 — 問題4 発話表現: nói gì trong tình huống (4 câu)' },
    NG('b27-ng-5', '{何|なん}と{言|い}いますか（4{問|もん}）', 'Dạng 発話表現 — nghe tình huống + 3 câu, chọn câu nói đúng. Bẫy: おかげで ↔ せいで (tốt / xấu), ため hợp khi giải thích lịch sự / thông báo.', [
      ['ナレーター', 'ja-nu', '1{番|ばん}。{友達|ともだち}が{手伝|てつだ}ってくれて、レポートが{早|はや}く{終|お}わりました。{友達|ともだち}に{何|なん}と{言|い}いますか。', 'Ichiban. Tomodachi ga tetsudatte kurete, repooto ga hayaku owarimashita. Tomodachi ni nan to iimasu ka.', 'Câu 1. Bạn bè giúp nên bài báo cáo của bạn xong sớm. Bạn nói gì với bạn ấy?'],
      ['ナレーター', 'ja-nu', '1、{手伝|てつだ}ってくれたせいで、{早|はや}く{終|お}わったよ。 2、{手伝|てつだ}ってくれたおかげで、{早|はや}く{終|お}わったよ。ありがとう。 3、{手伝|てつだ}ったため、{早|はや}く{終|お}わりました。', 'Ichi, tetsudatte kureta sei de, hayaku owatta yo. Ni, tetsudatte kureta okage de, hayaku owatta yo. Arigatou. San, tetsudatta tame, hayaku owarimashita.', '1. Tại cậu giúp nên xong sớm. 2. Nhờ cậu giúp mà xong sớm. Cảm ơn nhé. 3. Do đã giúp nên đã xong sớm.'],
      ['ナレーター', 'ja-nu', '2{番|ばん}。あなたは{駅員|えきいん}です。{大雪|おおゆき}で{電車|でんしゃ}が{止|と}まっていることを、お{客|きゃく}さんに{伝|つた}えます。{何|なん}と{言|い}いますか。', 'Niban. Anata wa ekiin desu. Ooyuki de densha ga tomatte iru koto o, okyaku-san ni tsutaemasu. Nan to iimasu ka.', 'Câu 2. Bạn là nhân viên nhà ga. Bạn thông báo với khách rằng tàu đang dừng vì tuyết lớn. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、{大雪|おおゆき}のため、ただいま{運転|うんてん}を{見合|みあ}わせております。 2、{大雪|おおゆき}のおかげで、{電車|でんしゃ}が{止|と}まっています。 3、{大雪|おおゆき}のせいか、{電車|でんしゃ}が{止|と}まったかもしれません。', 'Ichi, ooyuki no tame, tadaima unten o miawasete orimasu. Ni, ooyuki no okage de, densha ga tomatte imasu. San, ooyuki no sei ka, densha ga tomatta kamo shiremasen.', '1. Do tuyết lớn, hiện tàu đang tạm dừng chạy. 2. Nhờ tuyết lớn mà tàu đang dừng. 3. Có lẽ tại tuyết mà tàu có thể đã dừng.'],
      ['ナレーター', 'ja-nu', '3{番|ばん}。{電車|でんしゃ}が{遅|おく}れて、{授業|じゅぎょう}に{遅刻|ちこく}しました。{先生|せんせい}に{何|なん}と{言|い}いますか。', 'Sanban. Densha ga okurete, jugyou ni chikoku shimashita. Sensei ni nan to iimasu ka.', 'Câu 3. Tàu chậm nên bạn đến lớp muộn. Bạn nói gì với thầy?'],
      ['ナレーター', 'ja-nu', '1、{電車|でんしゃ}が{遅|おく}れたおかげで、{遅|おそ}くなりました。 2、{電車|でんしゃ}によって{遅|おく}れました。 3、{電車|でんしゃ}が{遅|おく}れたため、{遅|おそ}くなってしまいました。{申|もう}し{訳|わけ}ありません。', 'Ichi, densha ga okureta okage de, osoku narimashita. Ni, densha ni yotte okuremashita. San, densha ga okureta tame, osoku natte shimaimashita. Moushiwake arimasen.', '1. Nhờ tàu chậm mà em đến muộn. 2. Em bị muộn bởi tàu. 3. Do tàu chậm nên em đã đến muộn. Em thành thật xin lỗi.'],
      ['ナレーター', 'ja-nu', '4{番|ばん}。{友達|ともだち}の{顔色|かおいろ}が{悪|わる}いです。{昨日|きのう}{遅|おそ}くまでゲームをしていたようです。{何|なん}と{言|い}いますか。', 'Yonban. Tomodachi no kaoiro ga warui desu. Kinou osoku made geemu o shite ita you desu. Nan to iimasu ka.', 'Câu 4. Sắc mặt bạn của bạn kém. Có vẻ hôm qua bạn ấy chơi game đến khuya. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、{寝不足|ねぶそく}のおかげで、{元気|げんき}そうだね。 2、{寝不足|ねぶそく}のせいか、{顔色|かおいろ}が{悪|わる}いね。{大丈夫|だいじょうぶ}？ 3、{寝不足|ねぶそく}によって、{顔色|かおいろ}が{悪|わる}いです。', 'Ichi, nebusoku no okage de, genkisou da ne. Ni, nebusoku no sei ka, kaoiro ga warui ne. Daijoubu? San, nebusoku ni yotte, kaoiro ga warui desu.', '1. Nhờ thiếu ngủ mà trông cậu khoẻ nhỉ. 2. Chắc tại thiếu ngủ mà sắc mặt cậu kém nhỉ. Có sao không? 3. Do thiếu ngủ, sắc mặt kém.'],
    ]),
    {
      t: 'mcq',
      id: 'b27-ng-5-q',
      title: 'Bài 5 — chọn câu đúng',
      items: [
        { q: '1{番|ばん} — {友達|ともだち}が{手伝|てつだ}ってくれた', options: ['1', '2', '3'], correct: 1, why: 'Kết quả tốt + cảm ơn → **{手伝|てつだ}ってくれたおかげで…ありがとう** (③). 1 dùng せいで cho chuyện tốt — nghe như trách; 3 giọng thông báo, mất ý cảm ơn. 〔Tetsudatte kureta okage de…〕' },
        { q: '2{番|ばん} — {駅員|えきいん}のアナウンス', options: ['1', '2', '3'], correct: 0, why: 'Thông báo chính thức → **{大雪|おおゆき}のため、ただいま{運転|うんてん}を{見合|みあ}わせております** (④ + khiêm nhường ngữ おります). 2 dùng おかげ sai; 3 nhân viên không được "đoán". 〔Ooyuki no tame, tadaima unten o miawasete orimasu.〕' },
        { q: '3{番|ばん} — {先生|せんせい}に{遅刻|ちこく}の{理由|りゆう}を{言|い}う', options: ['1', '2', '3'], correct: 2, why: 'Giải thích lịch sự với thầy → **～ため、～てしまいました。{申|もう}し{訳|わけ}ありません** (④). 1 おかげ sai; 2 によって không dùng cho chuyện nhỏ, riêng tư. 〔Densha ga okureta tame, osoku natte shimaimashita.〕' },
        { q: '4{番|ばん} — {友達|ともだち}の{顔色|かおいろ}が{悪|わる}い', options: ['1', '2', '3'], correct: 1, why: 'Đoán nguyên nhân + hỏi thăm → **{寝不足|ねぶそく}のせいか…{大丈夫|だいじょうぶ}？** (②). 3 giọng bản tin, không hợp nói với bạn. 〔Nebusoku no sei ka, kaoiro ga warui ne.〕' },
      ],
    },

    /* ── 6 ── */
    { t: 'h', text: 'Bài 6 — 問題5 即時応答: đáp ngay (8 câu)' },
    NG('b27-ng-6', '{正|ただ}しい{返事|へんじ}を{選|えら}んでください（8{問|もん}）', 'Dạng 即時応答 — không có câu hỏi in sẵn: nghe 1 câu, chọn 1 trong 3 câu đáp. Câu đáp lặp lại mẫu ngữ pháp thường là bẫy.', [
      ['ナレーター', 'ja-nu', '1{番|ばん}。', 'Ichiban.', 'Câu 1.'],
      ['アンナ', 'ja-nu', '{昨日|きのう}は{雨|あめ}のせいで、どこにも{行|い}けなかったよ。', 'Kinou wa ame no sei de, doko ni mo ikenakatta yo.', 'Hôm qua tại mưa mà mình chẳng đi đâu được.'],
      ['マルコ', 'ja-nam', '1、それは{残念|ざんねん}だったね。 2、{雨|あめ}のおかげだね。 3、じゃ、{雨|あめ}が{降|ふ}ったら{行|い}こう。', 'Ichi, sore wa zannen datta ne. Ni, ame no okage da ne. San, ja, ame ga futtara ikou.', '1. Tiếc thật nhỉ. 2. Là nhờ mưa nhỉ. 3. Vậy trời mưa thì mình đi.'],
      ['ナレーター', 'ja-nu', '2{番|ばん}。', 'Niban.', 'Câu 2.'],
      ['{佐藤先生|さとうせんせい}', 'ja-nu', 'リンさん、N3{合格|ごうかく}、おめでとう。', 'Rin-san, enu-san goukaku, omedetou.', 'Linh, chúc mừng em đỗ N3.'],
      ['リン', 'ja-nu', '1、いいえ、{先生|せんせい}のせいです。 2、ありがとうございます。{先生|せんせい}のおかげです。 3、はい、{合格|ごうかく}のためです。', 'Ichi, iie, sensei no sei desu. Ni, arigatou gozaimasu. Sensei no okage desu. San, hai, goukaku no tame desu.', '1. Không ạ, là tại cô. 2. Em cảm ơn cô. Là nhờ cô ạ. 3. Vâng, là do đỗ ạ.'],
      ['ナレーター', 'ja-nu', '3{番|ばん}。', 'Sanban.', 'Câu 3.'],
      ['{小林店長|こばやしてんちょう}', 'ja-nam', '{今日|きょう}はお{客|きゃく}さんが{少|すく}ないなあ。', 'Kyou wa okyaku-san ga sukunai naa.', 'Hôm nay ít khách quá nhỉ.'],
      ['ナタポン', 'ja-nam', '1、お{客|きゃく}さんのおかげですね。 2、{雨|あめ}によって{少|すく}ないです。 3、{雨|あめ}のせいかもしれませんね。', 'Ichi, okyaku-san no okage desu ne. Ni, ame ni yotte sukunai desu. San, ame no sei kamo shiremasen ne.', '1. Là nhờ khách nhỉ. 2. Ít bởi mưa. 3. Có khi là tại mưa anh nhỉ.'],
      ['ナレーター', 'ja-nu', '4{番|ばん}。', 'Yonban.', 'Câu 4.'],
      ['カルロス', 'ja-nam', '{駅|えき}の{放送|ほうそう}、{何|なん}て{言|い}ってた？', 'Eki no housou, nan te itteta?', 'Loa ở ga vừa nói gì thế?'],
      ['アンナ', 'ja-nu', '1、{事故|じこ}のため、{電車|でんしゃ}が{遅|おく}れているって。 2、{事故|じこ}によると、{遅|おく}れているって。 3、{事故|じこ}のおかげで、{早|はや}く{着|つ}くって。', 'Ichi, jiko no tame, densha ga okurete iru tte. Ni, jiko ni yoru to, okurete iru tte. San, jiko no okage de, hayaku tsuku tte.', '1. Họ bảo do tai nạn nên tàu đang chậm. 2. Theo tai nạn thì đang chậm. 3. Nhờ tai nạn mà đến sớm.'],
      ['ナレーター', 'ja-nu', '5{番|ばん}。', 'Goban.', 'Câu 5.'],
      ['マルコ', 'ja-nam', '{日本|にほん}のごみの{出|だ}し{方|かた}は、どこでも{同|おな}じですか。', 'Nihon no gomi no dashikata wa, doko demo onaji desu ka.', 'Cách đổ rác ở Nhật ở đâu cũng giống nhau à?'],
      ['{鈴木|すずき}', 'ja-nu', '1、はい、{地域|ちいき}によって{同|おな}じです。 2、いいえ、{地域|ちいき}によって{違|ちが}いますよ。 3、{地域|ちいき}のせいです。', 'Ichi, hai, chiiki ni yotte onaji desu. Ni, iie, chiiki ni yotte chigaimasu yo. San, chiiki no sei desu.', '1. Vâng, tuỳ khu vực mà giống nhau. 2. Không, tuỳ khu vực mà khác nhau đấy. 3. Là tại khu vực.'],
      ['ナレーター', 'ja-nu', '6{番|ばん}。', 'Rokuban.', 'Câu 6.'],
      ['メアリー', 'ja-nu', 'このお{寺|てら}、{誰|だれ}が{建|た}てたんですか。', 'Kono otera, dare ga tateta n desu ka.', 'Ngôi chùa này ai xây vậy?'],
      ['{西川|にしかわ}', 'ja-nam', '1、{将軍|しょうぐん}のおかげで{建|た}てました。 2、{将軍|しょうぐん}によると、{建|た}てたそうです。 3、{昔|むかし}の{将軍|しょうぐん}によって{建|た}てられたそうですよ。', 'Ichi, shougun no okage de tatemashita. Ni, shougun ni yoru to, tateta sou desu. San, mukashi no shougun ni yotte taterareta sou desu yo.', '1. Nhờ tướng quân mà đã xây. 2. Theo tướng quân thì nghe nói đã xây. 3. Nghe nói chùa được một vị tướng quân ngày xưa xây đấy.'],
      ['ナレーター', 'ja-nu', '7{番|ばん}。', 'Nanaban.', 'Câu 7.'],
      ['{山口|やまぐち}', 'ja-nu', '{最近|さいきん}、{肩|かた}がすごく{痛|いた}くて……。', 'Saikin, kata ga sugoku itakute…….', 'Dạo này vai tớ đau ghê…'],
      ['ダニエル', 'ja-nam', '1、パソコンのおかげだね。 2、パソコンの{使|つか}いすぎのせいじゃない？ 3、パソコンによって{痛|いた}いです。', 'Ichi, pasokon no okage da ne. Ni, pasokon no tsukaisugi no sei ja nai? San, pasokon ni yotte itai desu.', '1. Là nhờ máy tính nhỉ. 2. Không phải tại dùng máy tính nhiều quá à? 3. Đau bởi máy tính.'],
      ['ナレーター', 'ja-nu', '8{番|ばん}。', 'Hachiban.', 'Câu 8.'],
      ['ワン', 'ja-nu', 'あれ？{今|いま}、{地震|じしん}じゃなかった？', 'Are? Ima, jishin ja nakatta?', 'Ơ? Vừa rồi không phải động đất à?'],
      ['リン', 'ja-nu', '1、え？{気|き}のせいだよ。{何|なに}も{揺|ゆ}れてないよ。 2、{地震|じしん}のおかげだね。 3、{地震|じしん}によって{行|い}きましょう。', 'Ichi, e? Ki no sei da yo. Nani mo yuretenai yo. Ni, jishin no okage da ne. San, jishin ni yotte ikimashou.', '1. Hả? Cậu tưởng tượng thôi. Có rung gì đâu. 2. Là nhờ động đất nhỉ. 3. Mình đi bằng động đất nhé.'],
    ]),
    {
      t: 'mcq',
      id: 'b27-ng-6-q',
      title: 'Bài 6 — chọn câu đáp đúng',
      items: [
        { q: '1{番|ばん} — 「{雨|あめ}のせいで、どこにも{行|い}けなかったよ。」', options: ['1', '2', '3'], correct: 0, why: 'Bạn than chuyện xấu → chia buồn: **それは{残念|ざんねん}だったね**. 2 lặp おかげ sai nghĩa; 3 vô lý. 〔Sore wa zannen datta ne.〕' },
        { q: '2{番|ばん} — 「N3{合格|ごうかく}、おめでとう。」', options: ['1', '2', '3'], correct: 1, why: 'Được chúc mừng → **ありがとうございます。{先生|せんせい}のおかげです**. 1 せいで = đổ lỗi; 3 vô nghĩa. 〔Sensei no okage desu.〕' },
        { q: '3{番|ばん} — 「{今日|きょう}はお{客|きゃく}さんが{少|すく}ないなあ。」', options: ['1', '2', '3'], correct: 2, why: 'Đoán nguyên nhân chuyện xấu → **{雨|あめ}のせいかもしれませんね**. 2 によって giọng văn viết, không tự nhiên trong hội thoại. 〔Ame no sei kamo shiremasen ne.〕' },
        { q: '4{番|ばん} — 「{駅|えき}の{放送|ほうそう}、{何|なん}て{言|い}ってた？」', options: ['1', '2', '3'], correct: 0, why: 'Thuật lại thông báo → **{事故|じこ}のため、{電車|でんしゃ}が{遅|おく}れているって** (④ + って). 2 によると sai (tai nạn không phải nguồn tin). 〔Jiko no tame, densha ga okurete iru tte.〕' },
        { q: '5{番|ばん} — 「ごみの{出|だ}し{方|かた}は、どこでも{同|おな}じですか。」', options: ['1', '2', '3'], correct: 1, why: '**{地域|ちいき}によって{違|ちが}います** (⑦). 1 sai luật: によって + {同|おな}じ ✗. 〔Chiiki ni yotte chigaimasu yo.〕' },
        { q: '6{番|ばん} — 「このお{寺|てら}、{誰|だれ}が{建|た}てたんですか。」', options: ['1', '2', '3'], correct: 2, why: 'Người xây → bị động + **によって** (⑧) + そうです (nghe nói). 2 によると = nguồn tin, sai vai. 〔Mukashi no shougun ni yotte taterareta sou desu yo.〕' },
        { q: '7{番|ばん} — 「{最近|さいきん}、{肩|かた}がすごく{痛|いた}くて……。」', options: ['1', '2', '3'], correct: 1, why: 'Đoán nguyên nhân chuyện xấu cho bạn → **～のせいじゃない？** (①). 〔Pasokon no tsukaisugi no sei ja nai?〕' },
        { q: '8{番|ばん} — 「{今|いま}、{地震|じしん}じゃなかった？」', options: ['1', '2', '3'], correct: 0, why: 'Phủ nhận cảm giác của bạn → **{気|き}のせいだよ** (cụm của ①②). 〔Ki no sei da yo.〕' },
      ],
    },
    /* ── 7 ── */
    { t: 'h', text: 'Bài 7 — 問題2 ポイント理解: dự báo thời tiết cuối tuần' },
    NG('b27-ng-7', '{女|おんな}の{人|ひと}はいつ{洗濯物|せんたくもの}を{外|そと}に{干|ほ}しますか', 'Dạng ポイント理解 — câu hỏi nghe TRƯỚC. Thứ Bảy: sáng nắng nhưng chiều mưa rào (梅雨前線の影響で); Chủ nhật: mưa cả ngày; thứ Hai: nắng, độ ẩm thấp → phơi được. Bẫy: "sáng thứ Bảy nắng" — nhưng cô ấy đi làm cả ngày nên không cất kịp.', [
      ['ナレーター', 'ja-nu', 'ラジオで{天気予報|てんきよほう}を{聞|き}いたあと、{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}が{話|はな}しています。{女|おんな}の{人|ひと}はいつ{洗濯物|せんたくもの}を{外|そと}に{干|ほ}しますか。', 'Rajio de tenki yohou o kiita ato, otoko no hito to onna no hito ga hanashite imasu. Onna no hito wa itsu sentakumono o soto ni hoshimasu ka.', 'Sau khi nghe dự báo thời tiết trên radio, một người đàn ông và một người phụ nữ đang nói chuyện. Người phụ nữ sẽ phơi quần áo ngoài trời khi nào?'],
      ['アナウンサー', 'ja-nu', '{週末|しゅうまつ}のお{天気|てんき}です。{土曜日|どようび}は、{朝|あさ}のうちは{晴|は}れますが、{梅雨前線|ばいうぜんせん}の{影響|えいきょう}で、{午後|ごご}からはにわか{雨|あめ}が{降|ふ}るでしょう。{日曜日|にちようび}は{一日中|いちにちじゅう}{雨|あめ}で、{所|ところ}によっては{激|はげ}しく{降|ふ}るおそれがあります。{月曜日|げつようび}は{晴|は}れて、{空気|くうき}も{乾|かわ}くでしょう。', 'Shuumatsu no otenki desu. Doyoubi wa, asa no uchi wa haremasu ga, baiu zensen no eikyou de, gogo kara wa niwaka ame ga furu deshou. Nichiyoubi wa ichinichijuu ame de, tokoro ni yotte wa hageshiku furu osore ga arimasu. Getsuyoubi wa harete, kuuki mo kawaku deshou.', 'Thời tiết cuối tuần. Thứ Bảy, buổi sáng trời nắng, nhưng do ảnh hưởng của front mùa mưa, từ chiều sẽ có mưa rào. Chủ nhật mưa cả ngày, có nơi mưa có thể rất to. Thứ Hai trời nắng, không khí cũng khô ráo.'],
      ['{男|おとこ}の{人|ひと}', 'ja-nam', '{土曜日|どようび}の{朝|あさ}は{晴|は}れるって。{洗濯|せんたく}するなら{土曜日|どようび}だね。', 'Doyoubi no asa wa hareru tte. Sentaku suru nara doyoubi da ne.', 'Họ bảo sáng thứ Bảy nắng đấy. Giặt đồ thì thứ Bảy nhỉ.'],
      ['{女|おんな}の{人|ひと}', 'ja-nu', 'でも、{私|わたし}、{土曜日|どようび}はアルバイトで{夜|よる}まで{家|いえ}にいないの。{午後|ごご}に{雨|あめ}が{降|ふ}ったら、{取|と}り{込|こ}めないでしょう？', 'Demo, watashi, doyoubi wa arubaito de yoru made ie ni inai no. Gogo ni ame ga futtara, torikomenai deshou?', 'Nhưng thứ Bảy em đi làm thêm, tối mới về. Chiều mà mưa thì không thu vào được còn gì?'],
      ['{男|おとこ}の{人|ひと}', 'ja-nam', 'そうか。{日曜日|にちようび}は{一日中|いちにちじゅう}{雨|あめ}だし……。', 'Sou ka. Nichiyoubi wa ichinichijuu ame da shi…….', 'Ừ nhỉ. Chủ nhật thì mưa cả ngày…'],
      ['{女|おんな}の{人|ひと}', 'ja-nu', 'うん。{月曜日|げつようび}は{授業|じゅぎょう}が{午後|ごご}からだから、{朝|あさ}{干|ほ}していくことにする。{梅雨|つゆ}のせいで、{最近|さいきん}ずっと{部屋|へや}の{中|なか}に{干|ほ}してたから、うれしい。', 'Un. Getsuyoubi wa jugyou ga gogo kara da kara, asa hoshite iku koto ni suru. Tsuyu no sei de, saikin zutto heya no naka ni hoshiteta kara, ureshii.', 'Ừ. Thứ Hai em học từ chiều, nên em quyết định sáng phơi rồi đi. Tại mùa mưa mà dạo này toàn phơi trong phòng, nên vui ghê.'],
    ]),
    {
      t: 'mcq',
      id: 'b27-ng-7-q',
      title: 'Bài 7 — chọn đáp án (2 câu)',
      items: [
        { q: '{女|おんな}の{人|ひと}はいつ{洗濯物|せんたくもの}を{外|そと}に{干|ほ}しますか。', options: ['{土曜日|どようび}の{朝|あさ}', '{土曜日|どようび}の{午後|ごご}', '{日曜日|にちようび}', '{月曜日|げつようび}の{朝|あさ}'], correct: 3, why: 'Sáng thứ Bảy nắng nhưng cô ấy vắng nhà tới tối, chiều có mưa rào → không thu kịp; Chủ nhật mưa cả ngày → **{月曜日|げつようび}は…{朝|あさ}{干|ほ}していくことにする**.' },
        { q: '{土曜日|どようび}の{午後|ごご}に{雨|あめ}が{降|ふ}るのはどうしてですか。', options: ['{台風|たいふう}が{来|く}るから', '{梅雨前線|ばいうぜんせん}の{影響|えいきょう}', '{空気|くうき}が{乾|かわ}いているから', '{気温|きおん}が{高|たか}いから'], correct: 1, why: '**{梅雨前線|ばいうぜんせん}の{影響|えいきょう}で、{午後|ごご}からはにわか{雨|あめ}** — ～の{影響|えいきょう}で = nguyên nhân trong bản tin thời tiết. {梅雨前線|ばいうぜんせん} = front mùa mưa (đọc ばいう).' },
      ],
    },
    {
      t: 'note',
      title: 'Từ mới trong bài nghe',
      items: [
        '**{事務室|じむしつ}** (văn phòng — Bài 26 {事務|じむ}) · **{直接|ちょくせつ}** (trực tiếp — N3) · **{確認|かくにん}する** (Bài 20) · **アルバイト{先|さき}** (chỗ làm thêm) · **{雪|ゆき}かき** (xúc tuyết — N2) · **そのかわり** (bù lại — N3) · **{定期券|ていきけん}** (vé tháng — N3) · **{時間|じかん}どおり** (đúng giờ) · **{思|おも}いつく** (nghĩ ra — N3) · **～らしい** (đúng kiểu… — N3).',
        '**{時期|じき}** (thời kỳ — N3) · **{二倍近|にばいちか}く** (gần gấp đôi) · **{農家|のうか}** (nhà nông — N3) · **{育|そだ}つ** (lớn lên — N3) · **～ということです** (nghe nói — giọng bản tin, N3) · **{一方|いっぽう}** (mặt khác — N3) · **{冷凍|れいとう}** (đông lạnh — N2) · **{専門家|せんもんか}** (chuyên gia — N3) · **{中|なか}ごろ** (khoảng giữa).',
        '**ただいま～ております** (hiện đang… — khiêm nhường ngữ của nhân viên, ôn Bài 24) · **{将軍|しょうぐん}** (tướng quân — N2) · **{肩|かた}** (vai — N3) · **{使|つか}いすぎ** (dùng quá nhiều — ôn ～すぎる Bài 17).',
      ],
    },
  ],
};

/* ═══════════════════════════ 6. ĐỌC HIỂU ═══════════════════════════ */

const DOC: Lesson = {
  id: 'b27-doc',
  kind: 'reading',
  title: 'Đọc hiểu N3 — thông báo đường cấm của thành phố (短文), mẩu tin báo về phố cửa hàng (短文), bài văn "Cách tôi xem tin tức" (中文〜長文), bảng thông tin giao thông ngày tuyết (情報検索)',
  goal: 'Đọc thông báo ~350 chữ của thành phố để biết thời gian, phạm vi và ngoại lệ (～のため通行止め・～場合は); đọc bài văn ~650 chữ để nắm nguyên nhân của từng thay đổi (～せいで・～ことによって・～によって違う), lý do tác giả rút ra kết luận và ý chính; tra bảng thông tin giao thông theo điều kiện (giờ, tuyến, nguyên nhân, dự kiến chạy lại) và đọc kỹ các dòng ※.',
  minutes: 55,
  blocks: [
    {
      t: 'table',
      caption: 'Phần đọc (読解) đề JLPT N3',
      head: ['Mondai', 'Dạng', 'Độ dài', 'Bài này luyện'],
      rows: [
        ['問題4', '内容理解（短文）', '150–200 chữ (có khi tới ~350)', 'Bài 1 — thông báo của thành phố: thời gian, phạm vi, ngoại lệ · Bài 2′ — mẩu tin báo: nguyên nhân chính ↔ phụ'],
        ['問題5', '内容理解（中文）', '~350 chữ', 'Bài 2 (đoạn 1–3) — nguyên nhân, thay đổi'],
        ['問題6', '内容理解（長文）', '~550 chữ', 'Bài 2 (cả bài ~650 chữ) — vì sao tác giả nghĩ vậy, ý chính'],
        ['問題7', '情報検索', '~600 chữ (bảng / thông báo)', 'Bài 3 — bảng thông tin giao thông: lọc theo điều kiện, đọc ※'],
      ],
    },
    {
      t: 'note',
      title: 'Chiến thuật đọc N3 — văn bản tin tức, thông báo',
      items: [
        '**Đọc câu hỏi trước**, gạch chân từ khoá (どうして・{分|わ}かること・{正|ただ}しいもの・いつ・どうすれば). Câu hỏi "どうして" → tìm **～ため／～せいで／～から／～によって／～のは～ためだ** trong bài.',
        'Thông báo: **{期間|きかん}** (thời gian) · **{場所|ばしょ}／{区間|くかん}** (phạm vi) · **ngoại lệ** ở **※／ただし／～場合は** · việc người đọc **phải làm / không được làm** ở **～てください／～ことはできません**.',
        'Bài văn: tìm **mốc thay đổi** — **ところが** (thế nhưng — trái dự đoán), **その{日|ひ}から** (sự kiện then chốt), **～ことによって** (cách làm dẫn đến thay đổi), **{今|いま}では** (kết quả). Ý chính tác giả ở đoạn cuối — thường có **～ことだと{思|おも}う／～大切だ**.',
        '情報検索: lập **bảng điều kiện** rồi **loại** từng lựa chọn. Bảng giao thông: cột **{状況|じょうきょう}** (đang chạy / chậm / tạm dừng / ngừng) quan trọng hơn cột **{原因|げんいん}**. Luôn đọc dòng **※** — đáp án hay giấu ở đó.',
      ],
    },

    /* ── Bài 1 ── */
    { t: 'h', text: 'Bài 1 — 内容理解（短文）: thông báo thi công của thành phố' },
    {
      t: 'passage',
      title: '【お{知|し}らせ】さくら{通|どお}りの{道路工事|どうろこうじ}について',
      intro: 'Thông báo dán ở bảng tin của khu dân cư. Đọc rồi trả lời câu hỏi.',
      paras: [
        { text: 'さくら{市|し}　{道路課|どうろか}' },
        { text: 'さくら{通|どお}りでは、{古|ふる}くなった{水道管|すいどうかん}を{新|あたら}しくする{工事|こうじ}を{行|おこな}います。{工事|こうじ}のため、{下|した}の{期間|きかん}は、さくら{駅前|えきまえ}から{市民公園前|しみんこうえんまえ}まで、{車|くるま}は{通行止|つうこうど}めになります。{歩|ある}いて{通|とお}ることはできます。' },
        { text: '・{期間|きかん}：10{月|がつ}7{日|か}（{月|げつ}）～10{月|がつ}18{日|にち}（{金|きん}）　{午前|ごぜん}9{時|じ}～{午後|ごご}5{時|じ}　※{土曜日|どようび}・{日曜日|にちようび}は{工事|こうじ}を{行|おこな}いません。' },
        { text: '{雨|あめ}や{強|つよ}い{風|かぜ}の{日|ひ}は、{工事|こうじ}を{中止|ちゅうし}することがあります。{中止|ちゅうし}になった{場合|ばあい}、{工事|こうじ}の{期間|きかん}が{延|の}びることがあります。{新|あたら}しい{情報|じょうほう}は、{市|し}のホームページでお{知|し}らせします。' },
        { text: '{工事|こうじ}の{間|あいだ}は、さくら{駅前|えきまえ}のバス{停|てい}も{使|つか}えません。バスは、{駅|えき}の{北口|きたぐち}の{臨時|りんじ}バス{停|てい}から{出|で}ます。ご{迷惑|めいわく}をおかけしますが、ご{協力|きょうりょく}をお{願|ねが}いします。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b27-doc-1',
      title: 'Bài 1 — câu hỏi (2 câu)',
      items: [
        { q: 'このお{知|し}らせから{分|わ}かることはどれですか。', options: ['10{月|がつ}7{日|か}から18{日|にち}まで、{毎日|まいにち}{一日中|いちにちじゅう}{車|くるま}が{通|とお}れない。', '{工事|こうじ}の{期間|きかん}でも、{歩|ある}いてさくら{通|どお}りを{通|とお}ることができる。', '{雨|あめ}の{日|ひ}は、バスが{北口|きたぐち}から{出|で}ない。', '{工事|こうじ}は{必|かなら}ず10{月|がつ}18{日|にち}に{終|お}わる。'], correct: 1, why: '**{歩|ある}いて{通|とお}ることはできます**. 1 sai (chỉ 9–17 giờ, không làm thứ Bảy, CN); 3 không có trong bài; 4 sai (gặp mưa thì **{期間|きかん}が{延|の}びることがあります**).' },
        { q: '10{月|がつ}12{日|にち}（{土|ど}）の{午後|ごご}、さくら{駅前|えきまえ}から{市民公園前|しみんこうえんまえ}まで{車|くるま}で{行|い}けますか。', options: ['{行|い}けない。{工事中|こうじちゅう}だから。', '{行|い}ける。{土曜日|どようび}は{工事|こうじ}をしないから。', '{行|い}けない。バス{停|てい}が{使|つか}えないから。', '{雨|あめ}の{場合|ばあい}だけ{行|い}ける。'], correct: 1, why: 'Dòng ※: **{土曜日|どようび}・{日曜日|にちようび}は{工事|こうじ}を{行|おこな}いません** → thứ Bảy xe đi được. Dòng ※ là chỗ đề hay giấu đáp án.' },
      ],
    },
    {
      t: 'note',
      title: 'Từ mới trong bài 1',
      items: [
        '**{道路課|どうろか}** (phòng quản lý đường — 課 Bài 24) · **{水道管|すいどうかん}** (ống nước — N2) · **{行|おこな}う** (tiến hành — Bài 22) · **{期間|きかん}** (khoảng thời gian — N3) · **{延|の}びる** (kéo dài — N3) · **バス{停|てい}** (trạm xe buýt) · **{臨時|りんじ}** (tạm thời — N2) · **ご{迷惑|めいわく}をおかけしますが、ご{協力|きょうりょく}をお{願|ねが}いします** (câu chuẩn cuối mọi thông báo thi công — "xin lỗi vì sự bất tiện, mong được hợp tác").',
      ],
    },

    /* ── Bài 2 ── */
    { t: 'h', text: 'Bài 2 — 内容理解（中文〜長文）: bài văn "Cách tôi xem tin tức" của リン' },
    {
      t: 'passage',
      title: 'ニュースの{見方|みかた}　{経済学部|けいざいがくぶ}1{年|ねん}　リン',
      intro: 'Bài văn リン viết cho môn "Truyền thông và xã hội" của cô 佐藤 (~650 chữ). Đọc rồi trả lời 4 câu hỏi.',
      paras: [
        { label: '1', text: '{日本|にほん}に{来|く}るまで、{私|わたし}はニュースをほとんど{見|み}なかった。ベトナムにいたころは、SNSで{友達|ともだち}が{書|か}いたことを{読|よ}むだけで、それで{十分|じゅうぶん}だと{思|おも}っていた。' },
        { label: '2', text: '{日本|にほん}に{来|き}て三か{月|げつ}{目|め}に、{大|おお}きな{台風|たいふう}が{来|き}た。その{前|まえ}の{晩|ばん}、{寮|りょう}のテレビでアナウンサーが「{台風|たいふう}の{影響|えいきょう}で、{明日|あした}は{交通機関|こうつうきかん}が{大|おお}きく{乱|みだ}れるおそれがあります」と{話|はな}していた。しかし、{私|わたし}には{意味|いみ}がよく{分|わ}からず、{次|つぎ}の{日|ひ}、いつもどおり{駅|えき}に{行|い}った。ところが、{電車|でんしゃ}は{運休|うんきゅう}になっていて、{駅|えき}は{混乱|こんらん}していた。{結局|けっきょく}、{私|わたし}はその{日|ひ}の{試験|しけん}を{受|う}けられなかった。ニュースが{分|わ}からなかったせいで{困|こま}ったのは、{私|わたし}だけではなかった。{寮|りょう}の{留学生|りゅうがくせい}の{多|おお}くが、{同|おな}じ{経験|けいけん}をしていた。' },
        { label: '3', text: 'その{日|ひ}から、{私|わたし}は{毎朝|まいあさ}、{日本語|にほんご}のニュースを{聞|き}くことにした。{最初|さいしょ}はほとんど{分|わ}からなかったが、{同|おな}じニュースを{何回|なんかい}も{聞|き}くことによって、{少|すこ}しずつ{聞|き}き{取|と}れるようになった。また、{佐藤先生|さとうせんせい}の{授業|じゅぎょう}で、{国|くに}によって{報道|ほうどう}の{仕方|しかた}が{違|ちが}うことを{学|まな}んだ。{同|おな}じ{事件|じけん}でも、ある{国|くに}では{大|おお}きく{報道|ほうどう}され、{別|べつ}の{国|くに}ではほとんど{報道|ほうどう}されないことがあるそうだ。' },
        { label: '4', text: '{今|いま}では、{一|ひと}つのニュースを、{日本|にほん}とベトナムの{両方|りょうほう}のサイトで{読|よ}むようにしている。{比|くら}べてみると、{同|おな}じ{出来事|できごと}でも、{書|か}く{人|ひと}によって{伝|つた}え{方|かた}がずいぶん{違|ちが}うことが{分|わ}かる。ニュースを{見|み}るときに{大切|たいせつ}なのは、{一|ひと}つの{情報|じょうほう}をすぐに{信|しん}じないで、いろいろな{情報|じょうほう}を{比|くら}べてみることだと{思|おも}う。あの{台風|たいふう}の{日|ひ}は{大変|たいへん}だったが、そのおかげで、{私|わたし}の{物|もの}の{見方|みかた}は{大|おお}きく{変|か}わった。' },
      ],
    },
    {
      t: 'note',
      title: 'Đọc kỹ — các câu nguyên nhân trong bài (gạch chân khi làm đề)',
      items: [
        'Đoạn 2: **{台風|たいふう}の{影響|えいきょう}で** (bản tin) · **{意味|いみ}がよく{分|わ}からず** (～ず = ～ないで, văn viết — N3) · **ところが** (thế nhưng — trái dự đoán) · **ニュースが{分|わ}からなかったせいで{困|こま}った** (mẫu ①) · **～おそれがある** (có nguy cơ — N2, chỉ cần nhận ra).',
        'Đoạn 3: **{何回|なんかい}も{聞|き}くことによって** (mẫu ⑥ — cách làm) · **{国|くに}によって{報道|ほうどう}の{仕方|しかた}が{違|ちが}う** (mẫu ⑦) · **{報道|ほうどう}され／{報道|ほうどう}されない** (bị động — Bài 22).',
        'Đoạn 4: **{書|か}く{人|ひと}によって{伝|つた}え{方|かた}が{違|ちが}う** (⑦) · **{大切|たいせつ}なのは～ことだと{思|おも}う** (câu ý chính) · **そのおかげで** (mẫu ③ — nhìn lại chuyện xấu theo hướng tốt) · **{出来事|できごと}** (sự việc xảy ra — N3) · **{両方|りょうほう}** (cả hai).',
      ],
    },
    {
      t: 'mcq',
      id: 'b27-doc-2',
      title: 'Bài 2 — câu hỏi (4 câu)',
      items: [
        { q: '{台風|たいふう}の{次|つぎ}の{日|ひ}、{筆者|ひっしゃ}はどうして{試験|しけん}を{受|う}けられなかったのですか。', options: ['{寮|りょう}のテレビが{壊|こわ}れていたから', 'ニュースの{意味|いみ}が{分|わ}からず{駅|えき}に{行|い}ったが、{電車|でんしゃ}が{運休|うんきゅう}していたから', '{試験|しけん}が{延期|えんき}になったことを{知|し}らなかったから', '{友達|ともだち}のSNSを{信|しん}じたから'], correct: 1, why: 'Đoạn 2: **{意味|いみ}がよく{分|わ}からず、{次|つぎ}の{日|ひ}、いつもどおり{駅|えき}に{行|い}った。ところが、{電車|でんしゃ}は{運休|うんきゅう}…{結局|けっきょく}、{試験|しけん}を{受|う}けられなかった**. {筆者|ひっしゃ} = tác giả.' },
        { q: '{筆者|ひっしゃ}がニュースを{聞|き}き{取|と}れるようになったのは、どうしてですか。', options: ['{佐藤先生|さとうせんせい}の{授業|じゅぎょう}に{出|で}たから', '{同|おな}じニュースを{何回|なんかい}も{聞|き}いたから', 'ベトナムのサイトを{読|よ}んだから', '{寮|りょう}の{留学生|りゅうがくせい}と{話|はな}したから'], correct: 1, why: 'Đoạn 3: **{同|おな}じニュースを{何回|なんかい}も{聞|き}くことによって、{少|すこ}しずつ{聞|き}き{取|と}れるようになった** — ～ことによって = cách làm (⑥).' },
        { q: '「{書|か}く{人|ひと}によって{伝|つた}え{方|かた}がずいぶん{違|ちが}う」とあるが、{筆者|ひっしゃ}はどうしてそれが{分|わ}かったのですか。', options: ['{佐藤先生|さとうせんせい}がそう{言|い}ったから', '{日本|にほん}とベトナムのサイトで、{同|おな}じニュースを{比|くら}べたから', 'アナウンサーの{話|はなし}が{分|わ}からなかったから', 'SNSで{友達|ともだち}の{意見|いけん}を{読|よ}んだから'], correct: 1, why: 'Đoạn 4: **{日本|にほん}とベトナムの{両方|りょうほう}のサイトで{読|よ}む…{比|くら}べてみると…{分|わ}かる**. Lời cô 佐藤 là về "tuỳ NƯỚC", không phải "tuỳ người viết" — bẫy.' },
        { q: '{筆者|ひっしゃ}がこの{文章|ぶんしょう}で{一番|いちばん}{言|い}いたいことは{何|なん}ですか。', options: ['{留学生|りゅうがくせい}は{毎朝|まいあさ}ニュースを{聞|き}かなければならない。', '{台風|たいふう}の{日|ひ}は{駅|えき}に{行|い}かないほうがいい。', 'ニュースはすぐに{信|しん}じないで、いろいろな{情報|じょうほう}を{比|くら}べることが{大切|たいせつ}だ。', 'SNSの{情報|じょうほう}は{全部|ぜんぶ}{間違|まちが}っている。'], correct: 2, why: 'Câu ý chính ở đoạn cuối: **{大切|たいせつ}なのは、{一|ひと}つの{情報|じょうほう}をすぐに{信|しん}じないで、いろいろな{情報|じょうほう}を{比|くら}べてみることだと{思|おも}う**. 4 nói quá ("全部") — tác giả không nói thế.' },
      ],
    },

    /* ── Bài 2′ ── */
    { t: 'h', text: 'Bài 2′ — 内容理解（短文）: một mẩu tin trên báo' },
    {
      t: 'passage',
      title: '{商店街|しょうてんがい}に{人|ひと}が{戻|もど}ってきた',
      intro: 'Mẩu tin ngắn (~250 chữ) trên báo địa phương. Đọc rồi trả lời 2 câu hỏi.',
      paras: [
        { text: 'みなと{市|し}の「さくら{商店街|しょうてんがい}」は、10{年|ねん}ほど{前|まえ}から{客|きゃく}が{減|へ}り{続|つづ}けていた。{近|ちか}くに{大|おお}きなショッピングセンターができたため、{多|おお}くの{人|ひと}がそちらで{買|か}い{物|もの}をするようになったのだ。{景気|けいき}が{悪|わる}くなったこともあって、{閉|し}まる{店|みせ}が{増|ふ}えていた。' },
        { text: 'ところが、{去年|きょねん}から{少|すこ}しずつ{客|きゃく}が{戻|もど}ってきている。{商店街|しょうてんがい}の{若|わか}い{店主|てんしゅ}たちが、{空|あ}いた{店|みせ}を{使|つか}って、{留学生|りゅうがくせい}による{料理教室|りょうりきょうしつ}や{子|こ}ども{向|む}けのイベントを{始|はじ}めたおかげだ。{店主|てんしゅ}の{一人|ひとり}は「{店|みせ}によって{得意|とくい}なことが{違|ちが}うので、みんなで{協力|きょうりょく}することによって、{新|あたら}しいお{客|きゃく}さんを{呼|よ}ぶことができました」と{話|はな}している。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b27-doc-4',
      title: 'Bài 2′ — câu hỏi (2 câu)',
      items: [
        { q: 'さくら{商店街|しょうてんがい}の{客|きゃく}が{減|へ}った{一番|いちばん}の{原因|げんいん}は{何|なん}ですか。', options: ['{留学生|りゅうがくせい}が{料理教室|りょうりきょうしつ}を{始|はじ}めたから', '{近|ちか}くに{大|おお}きなショッピングセンターができたから', '{若|わか}い{店主|てんしゅ}が{増|ふ}えたから', '{子|こ}ども{向|む}けのイベントがなかったから'], correct: 1, why: '**{大|おお}きなショッピングセンターができたため、{多|おお}くの{人|ひと}がそちらで{買|か}い{物|もの}をするようになった** — câu ～ため là nguyên nhân chính. {景気|けいき} chỉ là "cũng có" (～こともあって — thêm một lý do phụ).' },
        { q: '{客|きゃく}が{戻|もど}ってきたのはどうしてですか。', options: ['ショッピングセンターが{閉|し}まったから', '{景気|けいき}がよくなったから', '{店主|てんしゅ}たちが{協力|きょうりょく}して{新|あたら}しいイベントを{始|はじ}めたから', '{店|みせ}の{値段|ねだん}が{安|やす}くなったから'], correct: 2, why: '**～イベントを{始|はじ}めたおかげだ** + lời chủ quán **みんなで{協力|きょうりょく}することによって** → おかげ = nguyên nhân TỐT.' },
      ],
    },
    {
      t: 'note',
      title: 'Từ mới trong bài 2′',
      items: [
        '**{商店街|しょうてんがい}** (phố cửa hàng — N3) · **{減|へ}り{続|つづ}ける** (cứ giảm mãi — Vます＋{続|つづ}ける) · **～ほど** (khoảng — N3) · **～こともあって** (cũng vì — thêm lý do phụ, N2 nhận ra) · **{店主|てんしゅ}** (chủ cửa hàng — N2) · **{空|あ}く** (trống) · **～{向|む}け** (dành cho — N3: {子|こ}ども{向|む}け) · **{得意|とくい}** (giỏi, sở trường) · **{呼|よ}ぶ** (gọi, thu hút).',
        'Bài có đủ bốn kiểu nguyên nhân của Bài 27: **ため** (khách quan) · **おかげ** (tốt) · **による** (tác nhân: {留学生|りゅうがくせい}による{料理教室|りょうりきょうしつ} = lớp nấu ăn do du học sinh dạy) · **によって** (tuỳ theo + cách thức).',
      ],
    },

    /* ── Bài 3 ── */
    { t: 'h', text: 'Bài 3 — 情報検索: bảng thông tin giao thông ngày tuyết' },
    {
      t: 'passage',
      title: 'みなと{市|し}　{交通情報|こうつうじょうほう}（12{月|がつ}5{日|か}　{朝|あさ}7{時|じ}{現在|げんざい}）',
      intro: 'Bảng thông tin trên trang web của thành phố. Đọc rồi trả lời 2 câu hỏi.',
      paras: [
        { label: 'みなと{線|せん}', text: '{状況|じょうきょう}：{運転見合|うんてんみあ}わせ　／　{原因|げんいん}：{大雪|おおゆき}のため　／　{再開|さいかい}の{見込|みこ}み：{正午|しょうご}ごろ' },
        { label: 'さくら{線|せん}', text: '{状況|じょうきょう}：{遅|おく}れ（{約|やく}20{分|ぷん}）　／　{原因|げんいん}：{信号|しんごう}の{故障|こしょう}により　／　{運転|うんてん}しています' },
        { label: '{市営|しえい}バス（{駅|えき}{北口|きたぐち}{発|はつ}）', text: '{状況|じょうきょう}：{一部|いちぶ}{運休|うんきゅう}　／　{原因|げんいん}：{道路|どうろ}が{凍|こお}っているため　／　{再開|さいかい}の{見込|みこ}み：{未定|みてい}' },
        { label: '{空港線|くうこうせん}', text: '{状況|じょうきょう}：{運休|うんきゅう}　／　{原因|げんいん}：{強|つよ}い{風|かぜ}のため　／　{再開|さいかい}の{見込|みこ}み：{午後|ごご}3{時|じ}ごろ' },
        { label: '{高速|こうそく}バス（{東京|とうきょう}{行|ゆ}き）', text: '{状況|じょうきょう}：{通常|つうじょう}どおり{運転|うんてん}しています' },
        { label: '※', text: '{遅延証明書|ちえんしょうめいしょ}は、{各駅|かくえき}の{改札口|かいさつぐち}でお{渡|わた}ししています。' },
        { label: '※', text: '{再開|さいかい}の{時間|じかん}は、{天候|てんこう}によって{変|か}わることがあります。{出|で}かける{前|まえ}に、もう{一度|いちど}{確認|かくにん}してください。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b27-doc-3',
      title: 'Bài 3 — câu hỏi (2 câu)',
      items: [
        { q: 'リンさんは、{今日|きょう}の{午前|ごぜん}10{時|じ}までに{大学|だいがく}に{着|つ}きたいです。{大学|だいがく}へは、みなと{線|せん}、さくら{線|せん}、{駅|えき}{北口|きたぐち}{発|はつ}の{市営|しえい}バスのどれでも{行|い}けます。リンさんはどうすればいいですか。', options: ['みなと{線|せん}で{行|い}く。', '{少|すこ}し{早|はや}めに{家|いえ}を{出|で}て、さくら{線|せん}で{行|い}く。', '{市営|しえい}バスで{行|い}く。', '{正午|しょうご}まで{待|ま}ってから{行|い}く。'], correct: 1, why: 'Chỉ **さくら{線|せん}** đang chạy (chậm ~20 phút → đi sớm). みなと{線|せん} tạm dừng tới trưa; bus 北口 ngừng một phần, chưa rõ khi nào chạy lại; chờ đến trưa thì trễ 10 giờ.' },
        { q: 'この{交通情報|こうつうじょうほう}について{正|ただ}しいものはどれですか。', options: ['みなと{線|せん}は{今日|きょう}{一日中|いちにちじゅう}{運休|うんきゅう}する。', 'さくら{線|せん}は{信号|しんごう}の{故障|こしょう}のため{止|と}まっている。', '{遅|おく}れた{人|ひと}は、{駅|えき}の{改札口|かいさつぐち}で{遅延証明書|ちえんしょうめいしょ}をもらえる。', '{再開|さいかい}の{時間|じかん}は{絶対|ぜったい}に{変|か}わらない。'], correct: 2, why: 'Dòng ※ thứ nhất: **{遅延証明書|ちえんしょうめいしょ}は、{各駅|かくえき}の{改札口|かいさつぐち}でお{渡|わた}ししています**. 1 sai (dự kiến chạy lại trưa); 2 sai (chậm, vẫn chạy); 4 sai (※ thứ hai: **{天候|てんこう}によって{変|か}わることがあります**).' },
      ],
    },
    {
      t: 'note',
      title: 'Từ mới trong bài 3 — bảng giao thông',
      items: [
        '**～{現在|げんざい}** (tính đến — 7{時|じ}{現在|げんざい}, N3) · **{見込|みこ}み** (dự kiến — N2) · **{正午|しょうご}** (12 giờ trưa — N3) · **{市営|しえい}** (do thành phố điều hành — N2) · **{一部|いちぶ}** (một phần) · **{未定|みてい}** (chưa định — N2) · **{通常|つうじょう}どおり** (như bình thường — N2) · **{改札口|かいさつぐち}** (cửa soát vé) · **お{渡|わた}しする** (trao — khiêm nhường ngữ) · **{凍|こお}る** (đóng băng).',
      ],
    },
  ],
};

/* ═══════════════════════════ 7. NÓI ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b27-noi',
  kind: 'speaking',
  title: 'Luyện nói — kể nguyên nhân bằng ～せいで・～せいか・～おかげで, nói "tuỳ…" bằng ～によって, mô tả tranh tin tức, trình bày 1 phút "Một tin tức gần đây", đọc to',
  goal: 'Trả lời trôi chảy câu hỏi thi nói về tin tức, thời tiết, đời sống (最近気になったニュースは・天気のせいで困ったことは・誰のおかげで～できたか・国によって違うことは) bằng câu 2–3 ý có mẫu của bài; mô tả tranh có nguyên nhân – kết quả; trình bày 1 phút có mở – thân – kết; đọc to đoạn tin ~150 chữ đúng nhịp và đúng trường âm.',
  minutes: 50,
  blocks: [
    {
      t: 'table',
      caption: 'Thi nói kiểu JPD (khung của bộ môn) nâng lên N3 — chủ đề Bài 27 rơi vào đâu',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 27 xuất hiện ở đâu'],
      rows: [
        ['Reading', '30', 'Chuẩn bị 30 giây, đọc to đoạn ~150 chữ.', 'Đoạn bản tin: ～の影響で, ～ため, ～によって, 原因・状況・道路・物価…'],
        ['Talking — có tranh', '3 × 10', 'Nhìn tranh (mưa → trận đấu huỷ, bạn giúp → chuyển nhà xong sớm, tuyết → ga hỗn loạn) trả lời 2 ý.', '{試合|しあい}はどうなりましたか、どうしてですか · {誰|だれ}のおかげで～ · {駅|えき}はどんな{様子|ようす}ですか'],
        ['Talking — không tranh', '2 × 10', 'Trả lời câu hỏi về bản thân, có lý do / ví dụ.', '{天気|てんき}のせいで{困|こま}ったことはありますか · {国|くに}によって{違|ちが}う{習慣|しゅうかん}を{一|ひと}つ{教|おし}えてください'],
        ['Presenting (N3)', '20', 'Trình bày 1 phút một chủ đề cho sẵn, có mở – thân – kết.', '「{最近|さいきん}{気|き}になったニュース」 — xem dàn ý bên dưới'],
      ],
    },
    {
      t: 'note',
      title: 'Luật trả lời cho câu hỏi Bài 27 (mỗi câu ít nhất 2 ý)',
      items: [
        '**"Có lúc nào thời tiết làm bạn khổ không?"** → kể **một** lần cụ thể: **～のせいで～てしまいました** + **cảm xúc** ({残念|ざんねん}でした／{困|こま}りました) + **sau đó làm gì** (それから、～ようにしています).',
        '**"Nhờ ai mà bạn làm được điều gì?"** → **～が～てくれたおかげで、～ことができました** + **lời biết ơn** ({本当|ほんとう}に{感謝|かんしゃ}しています). Đây là câu "ăn điểm" nhất của bài.',
        '**"Ở nước bạn có gì khác Nhật không?"** → **～は{国|くに}によって{違|ちが}います。{例|たと}えば、{日本|にほん}では～が、ベトナムでは～** — câu so sánh hai vế có が.',
        '**Kể lại tin tức** → giọng thuật lại: **ニュースによると、～ため、～そうです** — kết hợp によると (nguồn) + ため (nguyên nhân) + そうです (nghe nói).',
        '⚠ Hai lỗi bị trừ điểm nhiều nhất: dùng **せいで cho chuyện tốt** (~~{先生|せんせい}のせいで{合格|ごうかく}した~~) và dùng **によって sau động từ** (~~{雨|あめ}が{降|ふ}ったによって~~).',
      ],
    },
    {
      t: 'dialogue',
      title: 'Câu trả lời mẫu — giám thị ↔ thí sinh',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{最近|さいきん}、{何|なに}か{気|き}になったニュースはありますか。', ro: 'Saikin, nani ka ki ni natta nyuusu wa arimasu ka.', vi: 'Dạo gần đây em có chú ý tin tức nào không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい。{野菜|やさい}の{値段|ねだん}が{上|あ}がっているというニュースです。{夏|なつ}に{雨|あめ}が{少|すく}なかったため、{野菜|やさい}が{育|そだ}たなかったそうです。{私|わたし}は{自炊|じすい}しているので、とても{困|こま}っています。', ro: 'Hai. Yasai no nedan ga agatte iru to iu nyuusu desu. Natsu ni ame ga sukunakatta tame, yasai ga sodatanakatta sou desu. Watashi wa jisui shite iru node, totemo komatte imasu.', vi: 'Có ạ. Là tin giá rau đang tăng. Nghe nói do mùa hè ít mưa nên rau không lớn được. Em tự nấu ăn nên rất khổ ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{天気|てんき}のせいで{困|こま}ったことはありますか。', ro: 'Tenki no sei de komatta koto wa arimasu ka.', vi: 'Em đã bao giờ gặp khó khăn vì thời tiết chưa?' },
        { who: 'Bạn', role: 'candidate', text: 'はい。{去年|きょねん}、{台風|たいふう}のせいで{電車|でんしゃ}が{止|と}まって、{試験|しけん}に{遅|おく}れてしまいました。それから、{前|まえ}の{日|ひ}に{必|かなら}ず{天気予報|てんきよほう}を{見|み}るようにしています。', ro: 'Hai. Kyonen, taifuu no sei de densha ga tomatte, shiken ni okurete shimaimashita. Sorekara, mae no hi ni kanarazu tenki yohou o miru you ni shite imasu.', vi: 'Có ạ. Năm ngoái tại bão mà tàu dừng, em bị muộn giờ thi. Từ đó em luôn xem dự báo thời tiết vào hôm trước.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{日本|にほん}に{来|き}て、{誰|だれ}のおかげで{頑張|がんば}れましたか。', ro: 'Nihon ni kite, dare no okage de ganbaremashita ka.', vi: 'Sang Nhật, nhờ ai mà em đã cố gắng được?' },
        { who: 'Bạn', role: 'candidate', text: '{寮|りょう}の{先輩|せんぱい}のおかげです。{役所|やくしょ}の{手続|てつづ}きを{一緒|いっしょ}にしてくれたおかげで、すぐに{生活|せいかつ}に{慣|な}れることができました。{本当|ほんとう}に{感謝|かんしゃ}しています。', ro: 'Ryou no senpai no okage desu. Yakusho no tetsuzuki o issho ni shite kureta okage de, sugu ni seikatsu ni nareru koto ga dekimashita. Hontou ni kansha shite imasu.', vi: 'Là nhờ đàn chị ở ký túc xá ạ. Nhờ chị làm thủ tục ở cơ quan hành chính cùng em mà em quen với cuộc sống rất nhanh. Em thật lòng biết ơn chị.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{国|くに}によって{違|ちが}う{習慣|しゅうかん}を、{一|ひと}つ{教|おし}えてください。', ro: 'Kuni ni yotte chigau shuukan o, hitotsu oshiete kudasai.', vi: 'Em hãy kể một phong tục khác nhau tuỳ nước.' },
        { who: 'Bạn', role: 'candidate', text: 'ごみの{出|だ}し{方|かた}です。{日本|にほん}では{地域|ちいき}によって{細|こま}かく{分別|ぶんべつ}しなければなりませんが、ベトナムではあまり{分別|ぶんべつ}しません。{最初|さいしょ}はとても{大変|たいへん}でした。', ro: 'Gomi no dashikata desu. Nihon de wa chiiki ni yotte komakaku bunbetsu shinakereba narimasen ga, Betonamu de wa amari bunbetsu shimasen. Saisho wa totemo taihen deshita.', vi: 'Là cách đổ rác ạ. Ở Nhật, tuỳ khu vực mà phải phân loại rất kỹ, còn ở Việt Nam thì không phân loại mấy. Lúc đầu em rất vất vả.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'ニュースは、どうやって{見|み}ていますか。', ro: 'Nyuusu wa, dou yatte mite imasu ka.', vi: 'Em xem tin tức bằng cách nào?' },
        { who: 'Bạn', role: 'candidate', text: 'スマホのアプリで{見|み}ています。でも、SNSの{情報|じょうほう}は{人|ひと}によって{違|ちが}うので、{大|おお}きなニュースはテレビでも{確|たし}かめるようにしています。', ro: 'Sumaho no apuri de mite imasu. Demo, SNS no jouhou wa hito ni yotte chigau node, ookina nyuusu wa terebi demo tashikameru you ni shite imasu.', vi: 'Em xem bằng ứng dụng trên điện thoại. Nhưng thông tin trên SNS tuỳ người mà khác nhau, nên tin lớn em cố gắng kiểm tra cả trên ti vi.' },
      ],
    },
    { t: 'h', text: 'Talking — có tranh: 3 tranh kiểu đề thi' },
    {
      t: 'canh',
      anh: ['cloud-with-rain', 'handshake', 'snowflake'],
      caption: 'Tranh 1: sân bóng ngập nước dưới mưa to, tấm biển "中止" (huỷ). Tranh 2: hai người bạn cùng khiêng thùng các-tông vào căn hộ mới, đồng hồ chỉ 11 giờ trưa. Tranh 3: nhà ga ngày tuyết, bảng điện tử ghi "運転見合わせ", hành khách chen chúc, nhân viên cầm loa.',
    },
    {
      t: 'dialogue',
      title: 'Câu trả lời mẫu — nhìn tranh trả lời (mỗi câu 2 ý)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{絵|え}1を{見|み}てください。{試合|しあい}はどうなりましたか。どうしてですか。', ro: 'E ichi o mite kudasai. Shiai wa dou narimashita ka. Doushite desu ka.', vi: 'Em xem tranh 1. Trận đấu ra sao? Vì sao?' },
        { who: 'Bạn', role: 'candidate', text: '{大雨|おおあめ}のせいで、{試合|しあい}は{中止|ちゅうし}になりました。グラウンドに{水|みず}がたくさんあって、{危|あぶ}ないからだと{思|おも}います。', ro: 'Ooame no sei de, shiai wa chuushi ni narimashita. Guraundo ni mizu ga takusan atte, abunai kara da to omoimasu.', vi: 'Tại mưa lớn nên trận đấu đã bị huỷ. Em nghĩ là vì sân đầy nước, nguy hiểm.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{絵|え}2を{見|み}てください。{引|ひ}っ{越|こ}しはどうでしたか。', ro: 'E ni o mite kudasai. Hikkoshi wa dou deshita ka.', vi: 'Em xem tranh 2. Việc chuyển nhà thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{友達|ともだち}が{手伝|てつだ}ってくれたおかげで、{引|ひ}っ{越|こ}しは{午前中|ごぜんちゅう}に{終|お}わりそうです。{一人|ひとり}だったら、{一日中|いちにちじゅう}かかったと{思|おも}います。', ro: 'Tomodachi ga tetsudatte kureta okage de, hikkoshi wa gozenchuu ni owarisou desu. Hitori dattara, ichinichijuu kakatta to omoimasu.', vi: 'Nhờ bạn giúp mà việc chuyển nhà có vẻ xong trong buổi sáng. Nếu một mình thì chắc mất cả ngày.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{絵|え}3を{見|み}てください。{駅|えき}はどんな{様子|ようす}ですか。', ro: 'E san o mite kudasai. Eki wa donna yousu desu ka.', vi: 'Em xem tranh 3. Nhà ga trông thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{大雪|おおゆき}のため、{電車|でんしゃ}が{止|と}まっていて、{駅|えき}は{混乱|こんらん}しています。{駅員|えきいん}が{乗客|じょうきゃく}に{状況|じょうきょう}を{説明|せつめい}しているようです。', ro: 'Ooyuki no tame, densha ga tomatte ite, eki wa konran shite imasu. Ekiin ga joukyaku ni joukyou o setsumei shite iru you desu.', vi: 'Do tuyết lớn, tàu đang dừng và nhà ga hỗn loạn. Có vẻ nhân viên ga đang giải thích tình hình cho hành khách.' },
      ],
    },
    {
      t: 'phatam',
      id: 'b27-noi-phat-am',
      title: 'Đọc to & chấm phát âm — 14 câu hay dùng của Bài 27',
      note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Chú ý trường âm: え・い・きょ・う, じょ・う・きょ・う, じゅ・う・た・い, ほ・う・ど・う; âm ngắt: ぶ・っ・か, れ・っ・しゃ; げ・ん・い・ん (ん và い tách rõ, không thành ~~げにん~~); せ・い (không kéo dài thành せー quá mức).',
      items: [
        { text: '{寝不足|ねぶそく}のせいで、{頭|あたま}が{痛|いた}いです。', ipa: 'nebusoku no sei de atama ga itai desu', vi: 'Tại thiếu ngủ nên tôi đau đầu.' },
        { text: '{電車|でんしゃ}が{遅|おく}れたせいで、{間|ま}に{合|あ}いませんでした。', ipa: 'densha ga okureta sei de ma ni aimasen deshita', vi: 'Tại tàu chậm nên tôi không kịp.' },
        { text: '{年|とし}のせいか、{疲|つか}れやすくなりました。', ipa: 'toshi no sei ka tsukare yasuku narimashita', vi: 'Chắc tại tuổi tác mà tôi dễ mệt.' },
        { text: '{先生|せんせい}のおかげで、{合格|ごうかく}できました。', ipa: 'sensei no okage de goukaku dekimashita', vi: 'Nhờ thầy mà tôi đỗ.' },
        { text: '{友達|ともだち}が{手伝|てつだ}ってくれたおかげです。', ipa: 'tomodachi ga tetsudatte kureta okage desu', vi: 'Là nhờ bạn đã giúp.' },
        { text: '{大雨|おおあめ}のため、{電車|でんしゃ}が{運休|うんきゅう}しています。', ipa: 'ooame no tame densha ga unkyuu shite imasu', vi: 'Do mưa lớn, tàu đang ngừng chạy.' },
        { text: '{事故|じこ}があったため、{道路|どうろ}が{渋滞|じゅうたい}しています。', ipa: 'jiko ga atta tame douro ga juutai shite imasu', vi: 'Do có tai nạn, đường đang tắc.' },
        { text: '{台風|たいふう}の{影響|えいきょう}で、{飛行機|ひこうき}が{遅|おく}れています。', ipa: 'taifuu no eikyou de hikouki ga okurete imasu', vi: 'Do ảnh hưởng của bão, máy bay đang chậm.' },
        { text: '{地震|じしん}による{被害|ひがい}は、まだ{分|わ}かりません。', ipa: 'jishin ni yoru higai wa mada wakarimasen', vi: 'Thiệt hại do động đất vẫn chưa rõ.' },
        { text: '{話|はな}し{合|あ}いによって、{問題|もんだい}を{解決|かいけつ}しました。', ipa: 'hanashiai ni yotte mondai o kaiketsu shimashita', vi: 'Đã giải quyết vấn đề bằng thảo luận.' },
        { text: '{国|くに}によって、{習慣|しゅうかん}が{違|ちが}います。', ipa: 'kuni ni yotte shuukan ga chigaimasu', vi: 'Tuỳ nước mà phong tục khác nhau.' },
        { text: 'この{本|ほん}は、{有名|ゆうめい}な{作家|さっか}によって{書|か}かれました。', ipa: 'kono hon wa yuumei na sakka ni yotte kakaremashita', vi: 'Cuốn sách này do một nhà văn nổi tiếng viết.' },
        { text: '{事故|じこ}の{原因|げんいん}を{調査|ちょうさ}しています。', ipa: 'jiko no gen in o chousa shite imasu', vi: 'Đang điều tra nguyên nhân tai nạn.' },
        { text: '{最近|さいきん}、{物価|ぶっか}が{上|あ}がっています。', ipa: 'saikin bukka ga agatte imasu', vi: 'Dạo này vật giá đang tăng.' },
      ],
    },
    {
      t: 'note',
      title: 'Trình bày 1 phút (できる！) — dàn ý + bài mẫu "Một tin tức gần đây khiến tôi chú ý"',
      items: [
        '**Dàn ý 4 phần (≈ 6–8 câu, 250–300 chữ nói)**: ① **Mở** — tin gì, xem ở đâu ({最近|さいきん}、～というニュースを{見|み}ました) → ② **Nguyên nhân** (～ため／～によって／～の{影響|えいきょう}で) → ③ **Ảnh hưởng đến mình / mọi người** (～のせいで～ / ～おかげで～) → ④ **Ý kiến + tuỳ nước / tuỳ người** (～によって{違|ちが}うと{思|おも}います · ～ほうがいいと{思|おも}います).',
        '{最近|さいきん}、{日本|にほん}で{物価|ぶっか}が{上|あ}がっているというニュースを{見|み}ました。{特|とく}に{野菜|やさい}の{値段|ねだん}が{高|たか}くなっています。ニュースによると、{今年|ことし}の{夏|なつ}は{雨|あめ}が{少|すく}なかったため、{野菜|やさい}が{大|おお}きく{育|そだ}たなかったそうです。{私|わたし}は{寮|りょう}で{自炊|じすい}しているので、{物価|ぶっか}が{上|あ}がったせいで、{生活費|せいかつひ}が{足|た}りなくなってしまいました。でも、{寮|りょう}の{友達|ともだち}と{一緒|いっしょ}に{料理|りょうり}をするようになったおかげで、{前|まえ}より{節約|せつやく}できるようになりました。{物価|ぶっか}の{問題|もんだい}は{国|くに}によって{違|ちが}いますが、どの{国|くに}でも{生活|せいかつ}に{大|おお}きな{影響|えいきょう}があると{思|おも}います。',
        'Romaji: Saikin, Nihon de bukka ga agatte iru to iu nyuusu o mimashita. Toku ni yasai no nedan ga takaku natte imasu. Nyuusu ni yoru to, kotoshi no natsu wa ame ga sukunakatta tame, yasai ga ookiku sodatanakatta sou desu. Watashi wa ryou de jisui shite iru node, bukka ga agatta sei de, seikatsuhi ga tarinaku natte shimaimashita. Demo, ryou no tomodachi to issho ni ryouri o suru you ni natta okage de, mae yori setsuyaku dekiru you ni narimashita. Bukka no mondai wa kuni ni yotte chigaimasu ga, dono kuni demo seikatsu ni ookina eikyou ga aru to omoimasu.',
        'Nghĩa: Gần đây tôi xem tin vật giá ở Nhật đang tăng. Đặc biệt giá rau đắt lên. Theo tin tức, mùa hè năm nay do ít mưa nên rau không lớn được. Tôi tự nấu ăn ở ký túc xá, nên tại vật giá tăng mà tiền sinh hoạt không đủ. Nhưng nhờ bắt đầu nấu ăn chung với bạn bè trong ký túc xá, tôi đã tiết kiệm được hơn trước. Vấn đề vật giá tuỳ nước mà khác nhau, nhưng tôi nghĩ ở nước nào nó cũng ảnh hưởng lớn đến đời sống.',
        'Chỗ dễ vấp khi nói: **ニュースによると** (nguồn tin — đừng nói ~~ニュースによって~~) · **{少|すく}なかったため** (su-ku-na-ka-t-ta-ta-me — âm ngắt) · **{上|あ}がったせいで** · **{節約|せつやく}** (se-tsu-ya-ku) · **{影響|えいきょう}** (e-i-kyo-u — bốn mora).',
      ],
    },
    {
      t: 'note',
      title: 'Đọc to (Reading 30 điểm) — đoạn mẫu 40 giây',
      items: [
        '{今日|きょう}{午後|ごご}3{時|じ}ごろ、みなと{市|し}で{強|つよ}い{地震|じしん}が{発生|はっせい}しました。この{地震|じしん}の{影響|えいきょう}で、{電車|でんしゃ}は{安全|あんぜん}を{確認|かくにん}するため、{一時|いちじ}{運転|うんてん}を{見合|みあ}わせています。{今|いま}のところ、{地震|じしん}による{大|おお}きな{被害|ひがい}は{報告|ほうこく}されていません。{専門家|せんもんか}によると、{一週間|いっしゅうかん}ぐらいは{同|おな}じぐらいの{地震|じしん}に{注意|ちゅうい}が{必要|ひつよう}だということです。',
        'Romaji: Kyou gogo sanji goro, Minato-shi de tsuyoi jishin ga hassei shimashita. Kono jishin no eikyou de, densha wa anzen o kakunin suru tame, ichiji unten o miawasete imasu. Ima no tokoro, jishin ni yoru ookina higai wa houkoku sarete imasen. Senmonka ni yoru to, isshuukan gurai wa onaji gurai no jishin ni chuui ga hitsuyou da to iu koto desu.',
        'Nghĩa: Khoảng 3 giờ chiều nay, một trận động đất mạnh đã xảy ra ở thành phố Minato. Do ảnh hưởng của trận động đất, tàu tạm dừng chạy để kiểm tra an toàn. Hiện chưa có báo cáo nào về thiệt hại lớn do động đất. Theo các chuyên gia, trong khoảng một tuần cần đề phòng những trận động đất cỡ tương tự.',
        'Chỗ dễ vấp: **{発生|はっせい}** (ha-s-se-i) · **{確認|かくにん}するため** — ため ở đây là **MỤC ĐÍCH** (V{辞書形|じしょけい} chủ ý: để kiểm tra) — đọc to rồi tự hỏi: mục đích hay nguyên nhân? · **{一時|いちじ}** (tạm thời — không đọc ~~いちとき~~) · **{報告|ほうこく}されていません** (ho-u-ko-ku) · **ということです** (giọng bản tin, nghe nói).',
      ],
    },
    {
      t: 'speak',
      id: 'b27-noi-ghi-am',
      part: '1',
      questions: [
        'さいきん、 なにか きに なった ニュースは ありますか。',
        'てんきの せいで こまった ことは ありますか。',
        'にほんに きて、 だれの おかげで がんばれましたか。',
        'くにに よって ちがう しゅうかんを、 ひとつ おしえて ください。',
        'ニュースは、 どうやって みて いますか。',
        'さいきん きに なった ニュースに ついて、 1ぷんで はなして ください。',
      ],
    },
  ],
};

/* ═══════════════════════════ 8. VIẾT ═══════════════════════════ */

const VIET: Lesson = {
  id: 'b27-viet',
  kind: 'writing',
  title: 'Viết — bài văn N3 "Một tin tức gần đây khiến tôi chú ý" (khoảng 300 chữ) và email báo nghỉ làm thêm vì tàu ngừng chạy',
  goal: 'Viết bài văn ~300 chữ thể です／ます có 4 đoạn (giới thiệu tin → nguyên nhân → ảnh hưởng đến mình / xã hội → ý kiến), dùng đúng ít nhất 4 mẫu của bài (～ため／～によって・による／～の影響で／～せいで／～おかげで／～によって違う); viết email ngắn cho anh chủ quán báo không đến được vì tàu ngừng chạy, đúng khuôn email Nhật và dùng ため khi giải thích lịch sự.',
  minutes: 50,
  blocks: [
    {
      t: 'p',
      text: 'Đề chính: **作文「{最近|さいきん}{気|き}になったニュース」**, **khoảng 300 chữ**, thể です／ます. Đề phụ: **email cho anh {小林|こばやし}** (~150 chữ) — tàu ngừng chạy vì tuyết, xin nghỉ ca hôm nay và hỏi có cần đến bù không. Viết xong tự chấm theo 5 tiêu chí cuối mục.',
    },
    {
      t: 'table',
      caption: 'Dàn ý bài văn 「{最近|さいきん}{気|き}になったニュース」 — 4 đoạn, ~300 chữ',
      head: ['Đoạn', 'Nội dung', 'Mẫu nên dùng', 'Câu mở gợi ý'],
      rows: [
        ['1 · giới thiệu (~50 chữ)', 'Tin gì, xem ở đâu, khi nào', '～というニュースを{見|み}ました · ～と{報道|ほうどう}されていました', '{先週|せんしゅう}、テレビで～というニュースを{見|み}ました。'],
        ['2 · nguyên nhân (~80 chữ)', 'Vì sao chuyện đó xảy ra', '～ため · ～によって · ～の{影響|えいきょう}で · ～のは～ためだ', 'ニュースによると、～ため、～そうです。'],
        ['3 · ảnh hưởng (~90 chữ)', 'Ảnh hưởng đến mình / người xung quanh — tốt và xấu', '～せいで · ～おかげで · ～せいか', 'この～のせいで、{私|わたし}の{生活|せいかつ}も～。{一方|いっぽう}、～おかげで～。'],
        ['4 · ý kiến (~80 chữ)', 'So với nước mình; mình nghĩ nên làm gì', '～によって{違|ちが}う／{異|こと}なる · ～ことによって～ · ～と{思|おも}います', '{国|くに}によって～は{違|ちが}いますが、～ことによって～と{思|おも}います。'],
      ],
    },
    {
      t: 'note',
      title: 'Từ nối và câu "đinh" cấp N3',
      items: [
        '**Thời gian / nguồn**: {最近|さいきん} · {先日|せんじつ} (hôm trước — N3) · ニュースによると · {新聞|しんぶん}によると · ～と{報道|ほうどう}されていました.',
        '**Đảo chiều / bổ sung**: **しかし** · **一方（で）** (mặt khác — N3) · **それに** · **その{結果|けっか}** (kết quả là) · **そのため** (vì thế — N3: câu trước là nguyên nhân).',
        '**Câu "đinh" của bài văn tin tức**: **～のは、～ためだそうです** — một câu gói cả kết quả, nguyên nhân và nguồn tin. Và **～によって{違|ちが}いますが、～** để mở ý kiến so sánh.',
        '**Kết bài**: **～ことが{大切|たいせつ}だと{思|おも}います** · **これからも～ていきたいです** · **～ことによって、～ができるのではないでしょうか** (phải chăng có thể… — N3, lịch sự).',
        '**そのため ↔ そのおかげで ↔ そのせいで**: cùng là "vì thế", nhưng そのため trung tính, そのおかげで kết quả tốt, そのせいで kết quả xấu — chọn đúng là có điểm "từ vựng chính xác".',
      ],
    },
    {
      t: 'h',
      text: 'Bài mẫu (≈ 300 chữ) — 「{最近|さいきん}{気|き}になったニュース」',
    },
    {
      t: 'passage',
      title: '{最近|さいきん}{気|き}になったニュース',
      intro: 'Đọc to bài mẫu, gạch chân các mẫu của Bài 27, rồi viết bài của bạn theo cùng dàn ý.',
      paras: [
        { text: '{先週|せんしゅう}、テレビで「{日本|にほん}の{小学校|しょうがっこう}が{毎年|まいとし}{減|へ}っている」というニュースを{見|み}ました。' },
        { text: 'ニュースによると、{学校|がっこう}が{減|へ}っているのは、{少子化|しょうしか}のため、{子|こ}どもの{数|かず}が{少|すく}なくなったためだそうです。{特|とく}に{地方|ちほう}では、{若|わか}い{人|ひと}が{都会|とかい}に{出|で}ていく{影響|えいきょう}で、{村|むら}に{子|こ}どもがほとんどいない{所|ところ}もあるそうです。' },
        { text: '{学校|がっこう}がなくなったせいで、{毎日|まいにち}バスで1{時間|じかん}かけて{通学|つうがく}する{子|こ}どももいるそうです。しかし、{一方|いっぽう}で、{古|ふる}い{学校|がっこう}をカフェや{図書館|としょかん}に{変|か}えた{町|まち}もあります。そのおかげで、{町|まち}に{人|ひと}が{集|あつ}まるようになったそうです。' },
        { text: '{子|こ}どもの{数|かず}の{問題|もんだい}は{国|くに}によって{違|ちが}います。ベトナムではまだ{子|こ}どもが{多|おお}いですが、{将来|しょうらい}は{同|おな}じ{問題|もんだい}が{起|お}こるかもしれません。{古|ふる}い{建物|たてもの}を{上手|じょうず}に{使|つか}うことによって、{町|まち}を{元気|げんき}にすることができると{思|おも}います。' },
      ],
    },
    {
      t: 'note',
      title: 'Bài mẫu — romaji, nghĩa và từ mới',
      items: [
        'Romaji: Senshuu, terebi de "Nihon no shougakkou ga maitoshi hette iru" to iu nyuusu o mimashita. Nyuusu ni yoru to, gakkou ga hette iru no wa, shoushika no tame, kodomo no kazu ga sukunaku natta tame da sou desu. Toku ni chihou de wa, wakai hito ga tokai ni dete iku eikyou de, mura ni kodomo ga hotondo inai tokoro mo aru sou desu. Gakkou ga nakunatta sei de, mainichi basu de ichijikan kakete tsuugaku suru kodomo mo iru sou desu. Shikashi, ippou de, furui gakkou o kafe ya toshokan ni kaeta machi mo arimasu. Sono okage de, machi ni hito ga atsumaru you ni natta sou desu. Kodomo no kazu no mondai wa kuni ni yotte chigaimasu. Betonamu de wa mada kodomo ga ooi desu ga, shourai wa onaji mondai ga okoru kamo shiremasen. Furui tatemono o jouzu ni tsukau koto ni yotte, machi o genki ni suru koto ga dekiru to omoimasu.',
        'Nghĩa: Tuần trước tôi xem trên ti vi tin "Số trường tiểu học ở Nhật mỗi năm một giảm". Theo tin tức, trường giảm là do tỉ lệ sinh giảm, số trẻ em ít đi. Đặc biệt ở các địa phương, do ảnh hưởng của việc người trẻ ra thành phố, có những làng gần như không còn trẻ em. Tại trường học đóng cửa mà có những em ngày nào cũng mất một tiếng đi xe buýt đến trường. Nhưng mặt khác, cũng có thị trấn biến trường cũ thành quán cà phê hay thư viện. Nhờ vậy mà người dân lại tụ về thị trấn. Vấn đề số trẻ em tuỳ nước mà khác nhau. Ở Việt Nam trẻ em vẫn còn đông, nhưng trong tương lai có thể vấn đề tương tự sẽ xảy ra. Tôi nghĩ bằng cách dùng khéo các toà nhà cũ, ta có thể làm thị trấn sống lại.',
        'Mẫu của Bài 27 trong bài: **～のは、～ためだそうです** · **{少子化|しょうしか}のため** · **～の{影響|えいきょう}で** · **～せいで** · **そのおかげで** · **{国|くに}によって{違|ちが}います** · **～ことによって** — 7 mẫu trong ~300 chữ.',
        'Từ mới: **{地方|ちほう}** (địa phương, vùng quê — N3) · **{都会|とかい}** (thành phố lớn — N3) · **{村|むら}** (làng) · **{通学|つうがく}する** (đi học — N3) · **{建物|たてもの}** (toà nhà) · **{元気|げんき}にする** (làm cho sống động).',
      ],
    },
    {
      t: 'h',
      text: 'Email mẫu — báo anh 小林 không đến ca làm được (~150 chữ)',
    },
    {
      t: 'examples',
      items: [
        E('{件名|けんめい}：{本日|ほんじつ}のアルバイトについて（リン）', 'Kenmei: Honjitsu no arubaito ni tsuite (Rin)', 'Tiêu đề: Về ca làm thêm hôm nay (Linh)'),
        E('{小林店長|こばやしてんちょう}　お{疲|つか}れさまです。リンです。', 'Kobayashi tenchou. Otsukaresama desu. Rin desu.', 'Anh Kobayashi, em chào anh. Em là Linh.'),
        E('{実|じつ}は、{大雪|おおゆき}のため、みなと{線|せん}が{朝|あさ}から{運転|うんてん}を{見合|みあ}わせています。', 'Jitsu wa, ooyuki no tame, Minato-sen ga asa kara unten o miawasete imasu.', 'Chả là do tuyết lớn, tuyến Minato đã tạm dừng chạy từ sáng.'),
        E('{駅|えき}の{情報|じょうほう}によると、{再開|さいかい}は{正午|しょうご}ごろの{予定|よてい}ですが、{天候|てんこう}によって{遅|おそ}くなることもあるそうです。', 'Eki no jouhou ni yoru to, saikai wa shougo goro no yotei desu ga, tenkou ni yotte osoku naru koto mo aru sou desu.', 'Theo thông tin ở ga, dự kiến chạy lại vào khoảng trưa, nhưng tuỳ thời tiết có thể muộn hơn.'),
        E('そのため、{申|もう}し{訳|わけ}ありませんが、{今日|きょう}の{午前|ごぜん}のシフトはお{休|やす}みさせていただけないでしょうか。', 'Sono tame, moushiwake arimasen ga, kyou no gozen no shifuto wa oyasumi sasete itadakenai deshou ka.', 'Vì vậy, em rất xin lỗi, nhưng anh có thể cho em nghỉ ca sáng nay được không ạ?'),
        E('{代|か}わりに{明日|あした}{入|はい}ることもできますので、ご{連絡|れんらく}をお{待|ま}ちしています。よろしくお{願|ねが}いいたします。', 'Kawari ni ashita hairu koto mo dekimasu node, gorenraku o omachi shite imasu. Yoroshiku onegai itashimasu.', 'Em có thể làm bù vào ngày mai, nên em chờ anh liên lạc ạ. Em cảm ơn anh.'),
      ],
    },
    {
      t: 'note',
      title: 'Khuôn email báo nghỉ (Nhật) — 5 phần',
      items: [
        '**① {件名|けんめい}** — nói rõ việc + tên: {本日|ほんじつ}のアルバイトについて（{名前|なまえ}）.',
        '**② Chào**: với chỗ làm → **お{疲|つか}れさまです。～です。** (với giáo viên → いつもお{世話|せわ}になっております — Bài 26).',
        '**③ Lý do** bắt đầu bằng **{実|じつ}は**, dùng **～のため** (khách quan, lịch sự — không đổ lỗi) + **nguồn tin** (～によると).',
        '**④ Lời xin**: **そのため、{申|もう}し{訳|わけ}ありませんが、～させていただけないでしょうか** (ôn Bài 23) + **đề nghị bù** ({代|か}わりに～こともできます).',
        '**⑤ Kết**: よろしくお{願|ねが}いいたします。⚠ Không viết ~~{雪|ゆき}のせいで{行|い}けません~~ — せいで nghe như **cằn nhằn**, không hợp email công việc.',
      ],
    },
    {
      t: 'quiz',
      id: 'b27-viet-cau',
      title: 'Viết từng câu cho bài của bạn — dịch Việt → Nhật (8 câu)',
      kind: 'translate',
      grammar: '～というニュース · ニュースによると、～そうです · ～のは～ためだ · ～の影響で · ～せいで · そのおかげで · ～によって違う · ～ことによって',
      items: [
        { q: 'Tuần trước tôi xem tin "vật giá đang tăng".', answers: V('{先週|せんしゅう}、「{物価|ぶっか}が{上|あ}がっている」というニュースを{見|み}ました。', '{先週|せんしゅう}、{物価|ぶっか}が{上|あ}がっているというニュースを{見|み}ました。'), hint: '…というニュースを みました' },
        { q: 'Theo tin tức, nghe nói do mùa hè ít mưa nên rau không lớn được.', answers: V('ニュースによると、{夏|なつ}に{雨|あめ}が{少|すく}なかったため、{野菜|やさい}が{育|そだ}たなかったそうです。', 'ニュースによると、{夏|なつ}は{雨|あめ}が{少|すく}なかったため、{野菜|やさい}が{育|そだ}たなかったそうです。'), hint: 'ニュースによると … ため … そうです' },
        { q: 'Trường học giảm là do số trẻ em ít đi.', answers: V('{学校|がっこう}が{減|へ}っているのは、{子|こ}どもが{少|すく}なくなったためです。', '{学校|がっこう}が{減|へ}ったのは、{子|こ}どもが{少|すく}なくなったためです。', '{学校|がっこう}が{減|へ}っているのは、{子|こ}どもの{数|かず}が{少|すく}なくなったためです。'), hint: '…のは … ためです' },
        { q: 'Do ảnh hưởng của bão, tàu đang chậm.', answers: V('{台風|たいふう}の{影響|えいきょう}で、{電車|でんしゃ}が{遅|おく}れています。'), hint: 'たいふうの えいきょうで' },
        { q: 'Tại vật giá tăng nên tiền sinh hoạt không đủ.', answers: V('{物価|ぶっか}が{上|あ}がったせいで、{生活費|せいかつひ}が{足|た}りなくなりました。', '{物価|ぶっか}が{上|あ}がっているせいで、{生活費|せいかつひ}が{足|た}りません。', '{物価|ぶっか}が{上|あ}がったせいで、{生活費|せいかつひ}が{足|た}りません。'), hint: 'あがった せいで … たりない' },
        { q: 'Nhờ vậy mà người ta lại tụ về thị trấn.', answers: V('そのおかげで、{町|まち}に{人|ひと}が{集|あつ}まるようになりました。', 'そのおかげで、{町|まち}に{人|ひと}が{集|あつ}まるようになったそうです。'), hint: 'そのおかげで … あつまるように なりました' },
        { q: 'Vấn đề này tuỳ nước mà khác nhau.', answers: V('この{問題|もんだい}は{国|くに}によって{違|ちが}います。', 'この{問題|もんだい}は、{国|くに}によって{違|ちが}います。', 'この{問題|もんだい}は{国|くに}によって{異|こと}なります。'), hint: 'くにに よって ちがいます' },
        { q: 'Tôi nghĩ bằng việc phân loại rác, ta có thể bảo vệ môi trường.', answers: V('ごみを{分別|ぶんべつ}することによって、{環境|かんきょう}を{守|まも}ることができると{思|おも}います。'), hint: 'ぶんべつする ことに よって … まもる ことが できる' },
      ],
    },
    {
      t: 'h',
      text: 'Kỹ năng phụ — tóm tắt một bản tin trong 3 câu (要約)',
    },
    {
      t: 'note',
      title: 'Khuôn tóm tắt 3 câu — dùng khi giáo viên hỏi "Bản tin nói gì?"',
      items: [
        '**Câu 1 — Chuyện gì?** ～というニュースです。／～が{起|お}きたそうです。',
        '**Câu 2 — Vì sao?** {原因|げんいん}は～ためだそうです。／～によって～。',
        '**Câu 3 — Kết quả / ảnh hưởng?** その{影響|えいきょう}で、～。／そのため、～。',
        'Ví dụ (bản tin giá rau ở mục Nghe, bài 4): **{今年|ことし}、{野菜|やさい}の{値段|ねだん}が{上|あ}がっているというニュースです。{原因|げんいん}は、{雨|あめ}が{少|すく}なく、{暑|あつ}い{日|ひ}が{続|つづ}いたためだそうです。その{影響|えいきょう}で、{冷凍野菜|れいとうやさい}がよく{売|う}れているそうです。** — Romaji: Kotoshi, yasai no nedan ga agatte iru to iu nyuusu desu. Gen\'in wa, ame ga sukunaku, atsui hi ga tsuzuita tame da sou desu. Sono eikyou de, reitou yasai ga yoku urete iru sou desu.',
      ],
    },
    {
      t: 'quiz',
      id: 'b27-viet-tomtat',
      title: 'Tóm tắt — viết câu 2 (nguyên nhân) cho mỗi tin (4 câu)',
      kind: 'translate',
      grammar: '原因は～ためだそうです · ～によって～ · ～の影響で～',
      items: [
        { q: 'Tin: tàu Shinkansen ngừng chạy. Nguyên nhân: tuyết lớn. → Viết: "Nghe nói nguyên nhân là do tuyết lớn."', answers: V('{原因|げんいん}は{大雪|おおゆき}のためだそうです。', '{原因|げんいん}は、{大雪|おおゆき}のためだそうです。', '{大雪|おおゆき}のためだそうです。'), hint: 'げんいんは おおゆきの ためだ そうです' },
        { q: 'Tin: đường cao tốc tắc 15 km. Nguyên nhân: có tai nạn. → "Do tai nạn mà đường cao tốc tắc 15 km."', answers: V('{事故|じこ}のため、{高速道路|こうそくどうろ}が15キロ{渋滞|じゅうたい}しています。', '{事故|じこ}によって、{高速道路|こうそくどうろ}が15キロ{渋滞|じゅうたい}しています。', '{事故|じこ}があったため、{高速道路|こうそくどうろ}が15キロ{渋滞|じゅうたい}しています。'), hint: 'じこの ため … じゅうたい' },
        { q: 'Tin: nhiều nhà bị hỏng. Nguyên nhân: động đất mạnh. → "Do trận động đất mạnh, nhiều nhà bị hư hại."', answers: V('{強|つよ}い{地震|じしん}によって、{多|おお}くの{家|いえ}が{壊|こわ}れました。', '{強|つよ}い{地震|じしん}のため、{多|おお}くの{家|いえ}が{壊|こわ}れました。', '{強|つよ}い{地震|じしん}で、{多|おお}くの{家|いえ}が{壊|こわ}れました。'), hint: 'つよい じしんに よって' },
        { q: 'Tin: máy bay chậm. Nguyên nhân: ảnh hưởng của bão. → "Do ảnh hưởng của bão, máy bay đang chậm."', answers: V('{台風|たいふう}の{影響|えいきょう}で、{飛行機|ひこうき}が{遅|おく}れています。'), hint: 'たいふうの えいきょうで' },
      ],
    },
    {
      t: 'note',
      title: 'Đề luyện thêm — chọn 1 trong 3 (cùng khuôn 4 đoạn, ~300 chữ)',
      items: [
        '**{天気|てんき}・{災害|さいがい}と{私|わたし}** — một lần thời tiết / thiên tai ảnh hưởng đến bạn (～のため・～のせいで), ai đã giúp bạn (～おかげで), và nước bạn chuẩn bị cho thiên tai khác Nhật thế nào (～によって{違|ちが}う).',
        '**インターネットと{社会|しゃかい}** — Internet làm xã hội thay đổi ra sao (～によって{変|か}わった), điều tốt (～おかげで) và điều xấu (～せいで), cách dùng thông minh (～ことによって).',
        '**{私|わたし}の{国|くに}の{社会問題|しゃかいもんだい}** — một vấn đề (物価, 交通渋滞, 環境…), nguyên nhân (～ため／～による), ảnh hưởng, và cách giải quyết bạn nghĩ ra.',
      ],
    },
    {
      t: 'note',
      title: 'Tự chấm — 5 tiêu chí (mỗi tiêu chí 2 điểm, tổng 10)',
      items: [
        '**① Đủ 4 đoạn, 270–330 chữ** (đếm cả kana; dưới 220 chữ → 0 điểm tiêu chí này).',
        '**② Có ít nhất 4 mẫu của Bài 27 dùng đúng**: ～ため · ～によって／による · ～の{影響|えいきょう}で · ～せいで · ～おかげで · ～によって{違|ちが}う — đúng phần đứng trước (Nの／ナAな／V{普通形|ふつうけい}; によって chỉ sau N).',
        '**③ Không dùng ngược せいで ↔ おかげで** và không viết によって sau động từ (hai lỗi N3 hay bị trừ điểm nhất).',
        '**④ Phân biệt rõ nguồn tin và ý kiến**: ニュースによると～そうです (người khác nói) ↔ ～と{思|おも}います (mình nghĩ).',
        '**⑤ Văn viết thống nhất**: thể です／ます, しかし／一方 thay でも, không ～ちゃった／～って; chữ Hán của bài viết đúng ({原因|げんいん}・{影響|えいきょう}・{政治|せいじ}・{物価|ぶっか}・{値段|ねだん}・{種類|しゅるい}・{平和|へいわ}…).',
      ],
    },
  ],
};

/* ═══════════════════════════ 9. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b27-bai-tap',
  kind: 'homework',
  title: 'Bài tập Bài 27 — dịch, trắc nghiệm, ghép câu, đổi câu (có đáp án)',
  goal: 'Tự kiểm tra toàn bộ Bài 27: dịch Việt → Nhật với ～せいで・せいだ, ～せいか, ～おかげで・おかげだ, ～ため (nguyên nhân), ～によって／～による (bốn nghĩa); chọn đúng mẫu và đúng từ vựng N3 trong câu kiểu đề; ghép câu; đổi câu giữa văn nói (から・で) và văn viết (ため・によって).',
  minutes: 55,
  blocks: [
    {
      t: 'note',
      title: 'Cách làm',
      items: [
        'Làm lần lượt I → V, không nhìn mục Ngữ pháp. Câu gõ tay nhận cả chữ Hán lẫn kana, có hoặc không dấu câu.',
        'Sai câu nào: đọc lại đúng mẫu (① せいで trách · ② せいか đoán · ③ おかげで biết ơn · ④ ため thông báo · ⑤ によって nguyên nhân · ⑥ cách thức · ⑦ tuỳ theo · ⑧ tác nhân · ⑨ bảng phân biệt) rồi làm lại câu đó.',
        'Mục tiêu: ≥ 43/48 câu. Dưới 34 → làm lại 3 buổi trên lớp (② Theo buổi) trước khi sang Bài 28.',
      ],
    },
    {
      t: 'quiz',
      id: 'b27-bt-dich',
      title: 'I. Dịch Việt → Nhật (12 câu)',
      kind: 'translate',
      grammar: 'せいで・せいか・おかげで · ため (nguyên nhân) · によって／による',
      items: [
        { q: 'Tại tôi ngủ quên nên lỡ chuyến xe buýt đầu tiên.', answers: V('{寝坊|ねぼう}したせいで、{始発|しはつ}のバスに{乗|の}り{遅|おく}れました。', '{寝坊|ねぼう}したせいで、{一番|いちばん}{早|はや}いバスに{乗|の}り{遅|おく}れました。', '{寝坊|ねぼう}したせいで、{最初|さいしょ}のバスに{乗|の}り{遅|おく}れました。'), hint: 'ねぼうした せいで … のりおくれました' },
        { q: 'Đau bụng là tại ăn nhiều quá.', answers: V('お{腹|なか}が{痛|いた}いのは、{食|た}べすぎたせいです。', 'お{腹|なか}が{痛|いた}いのは、{食|た}べすぎのせいです。'), hint: '…のは たべすぎた せいです' },
        { q: 'Chắc tại mùa mưa mà quần áo mãi không khô.', answers: V('{梅雨|つゆ}のせいか、{洗濯物|せんたくもの}がなかなか{乾|かわ}きません。'), hint: 'つゆの せいか … かわきません' },
        { q: 'Không biết có phải tôi tưởng tượng không, hôm nay thầy có vẻ vui.', answers: V('{気|き}のせいか、{今日|きょう}は{先生|せんせい}がうれしそうです。', '{気|き}のせいか、{今日|きょう}は{先生|せんせい}が{楽|たの}しそうです。', '{気|き}のせいか、{今日|きょう}の{先生|せんせい}はうれしそうです。'), hint: 'きの せいか … うれしそう' },
        { q: 'Nhờ đàn anh chỉ cho mà tôi quen việc nhanh.', answers: V('{先輩|せんぱい}が{教|おし}えてくれたおかげで、{仕事|しごと}にすぐ{慣|な}れました。', '{先輩|せんぱい}が{教|おし}えてくれたおかげで、{早|はや}く{仕事|しごと}に{慣|な}れました。'), hint: 'おしえて くれた おかげで' },
        { q: 'Tôi đỗ được là nhờ gia đình.', answers: V('{合格|ごうかく}できたのは、{家族|かぞく}のおかげです。'), hint: '…のは かぞくの おかげです' },
        { q: 'Do đang thi công nên không đi qua đường này được.', answers: V('{工事中|こうじちゅう}のため、この{道|みち}は{通|とお}れません。', '{工事中|こうじちゅう}のため、この{道|みち}は{通|とお}ることができません。'), hint: 'こうじちゅうの ため' },
        { q: 'Do có tai nạn nên tàu đang chậm khoảng 20 phút.', answers: V('{事故|じこ}があったため、{電車|でんしゃ}が20{分|ぷん}ぐらい{遅|おく}れています。', '{事故|じこ}があったため、{電車|でんしゃ}が{約|やく}20{分|ぷん}{遅|おく}れています。', '{事故|じこ}のため、{電車|でんしゃ}が20{分|ぷん}ぐらい{遅|おく}れています。'), hint: 'じこが あった ため' },
        { q: 'Thiệt hại do bão đã lan ra cả nước.', answers: V('{台風|たいふう}による{被害|ひがい}は、{全国|ぜんこく}に{広|ひろ}がりました。', '{台風|たいふう}による{被害|ひがい}が、{全国|ぜんこく}に{広|ひろ}がりました。'), hint: 'たいふうに よる ひがい' },
        { q: 'Bằng việc nghe tin tức mỗi ngày, khả năng nghe của tôi đã tiến bộ.', answers: V('{毎日|まいにち}ニュースを{聞|き}くことによって、{聞|き}く{力|ちから}が{伸|の}びました。', '{毎日|まいにち}ニュースを{聞|き}くことによって、{聞|き}き{取|と}れるようになりました。'), hint: 'きく ことに よって' },
        { q: 'Tuỳ cửa hàng mà giá khác nhau.', answers: V('{店|みせ}によって、{値段|ねだん}が{違|ちが}います。', '{店|みせ}によって{値段|ねだん}が{違|ちが}います。', '{店|みせ}によって、{値段|ねだん}が{異|こと}なります。'), hint: 'みせに よって ねだんが ちがいます' },
        { q: 'Bức tranh này do một hoạ sĩ nổi tiếng vẽ.', answers: V('この{絵|え}は、{有名|ゆうめい}な{画家|がか}によって{描|か}かれました。', 'この{絵|え}は{有名|ゆうめい}な{画家|がか}によって{描|か}かれました。'), hint: 'がかに よって かかれました' },
      ],
    },
    {
      t: 'mcq',
      id: 'b27-bt-chon',
      title: 'II. Chọn đáp án đúng (12 câu)',
      items: [
        { q: '{彼|かれ}が{遅|おく}れてきた（　）、{会議|かいぎ}が30{分|ぷん}も{遅|おそ}く{始|はじ}まった。', options: ['おかげで', 'せいで', 'によって', 'のに'], correct: 1, why: 'Kết quả xấu + trách người khác → **せいで**. によって không đứng sau động từ; のに trái nghĩa.' },
        { q: '{祖母|そぼ}が{毎日|まいにち}{電話|でんわ}してくれる（　）、{寂|さび}しくありません。', options: ['せいで', 'せいか', 'おかげで', 'によって'], correct: 2, why: '～てくれる + kết quả tốt → **おかげで**.' },
        { q: '（　）、この{部屋|へや}、{少|すこ}し{寒|さむ}くない？', options: ['{気|き}のせいか', '{気|き}のおかげで', '{気|き}のため', '{気|き}によって'], correct: 0, why: 'Cụm cố định **{気|き}のせいか** (không biết có phải tưởng tượng không).' },
        { q: '{本日|ほんじつ}は{祝日|しゅくじつ}の（　）、{窓口|まどぐち}はお{休|やす}みです。', options: ['せいで', 'おかげで', 'ため', 'によると'], correct: 2, why: 'Thông báo khách quan → **ため**.' },
        { q: 'この{地方|ちほう}は{冬|ふゆ}、{雪|ゆき}が{多|おお}い（　）、{家|いえ}の{屋根|やね}が{急|きゅう}になっている。', options: ['ため', 'のに', 'によって', 'ても'], correct: 0, why: 'Nguyên nhân (イA + ため) — văn giải thích khách quan: tuyết nhiều → mái nhà dốc. のに／ても nghĩa ngược (trái kỳ vọng); によって không đứng sau tính từ. {屋根|やね} = mái nhà. 〔Yuki ga ooi tame, ie no yane ga kyuu ni natte iru.〕' },
        { q: '{大雨|おおあめ}（　）{土砂崩|どしゃくず}れが{起|お}きた。', options: ['による', 'によって', 'によると', 'のおかげで'], correct: 1, why: 'Giữa câu, trước động từ → **によって** (nguyên nhân). による phải đứng trước danh từ. {土砂崩|どしゃくず}れ = sạt lở đất (N1).' },
        { q: '{住民|じゅうみん}の{話|はな}し{合|あ}い（　）、{新|あたら}しい{公園|こうえん}の{名前|なまえ}が{決|き}まった。', options: ['のせいで', 'によって', 'によると', 'のせいか'], correct: 1, why: 'Cách thức → **によって** (⑥).' },
        { q: '{電車|でんしゃ}の{料金|りょうきん}は、{距離|きょり}（　）{違|ちが}います。', options: ['によって', 'によると', 'のおかげで', 'のため'], correct: 0, why: 'Vế sau "khác nhau" → **によって** (⑦). {距離|きょり} = khoảng cách (N3).' },
        { q: '{天気|てんき}（　）、{花火大会|はなびたいかい}が{中止|ちゅうし}になることもあります。', options: ['によって', 'によっては', 'による', 'のおかげで'], correct: 1, why: '"Tuỳ thời tiết thì có khi…" + ～こともある → **によっては**.' },
        { q: 'この{橋|はし}は、100{年前|ねんまえ}にイギリス{人|じん}の{技術者|ぎじゅつしゃ}（　）{造|つく}られた。', options: ['に', 'から', 'によって', 'によると'], correct: 2, why: 'Người tạo ra công trình trong câu bị động → **によって** (⑧). {造|つく}る = xây, chế tạo (công trình lớn).' },
        { q: '「この{店|みせ}は{値段|ねだん}が{安|やす}いおかげで、{学生|がくせい}に{人気|にんき}がある。」と{意味|いみ}が{近|ちか}いのは？', options: ['{値段|ねだん}が{安|やす}いのに、{学生|がくせい}は{来|こ}ない。', '{値段|ねだん}が{安|やす}いので、{学生|がくせい}がよく{来|く}る。', '{値段|ねだん}が{安|やす}いせいで、{学生|がくせい}が{困|こま}っている。', '{学生|がくせい}が{来|く}るので、{値段|ねだん}が{安|やす}い。'], correct: 1, why: 'おかげで = nhờ (kết quả tốt) ≈ **ので + kết quả tốt**. 4 đảo nhân – quả.' },
        { q: '「{物価|ぶっか}」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['このりんごの{物価|ぶっか}は100{円|えん}です。', '{東京|とうきょう}は{物価|ぶっか}が{高|たか}いので、{生活|せいかつ}が{大変|たいへん}だ。', '{物価|ぶっか}を{払|はら}ってください。', 'この{物価|ぶっか}は{重|おも}いです。'], correct: 1, why: '{物価|ぶっか} = giá cả CHUNG của một nơi. Giá MỘT món → {値段|ねだん}.' },
      ],
    },
    {
      t: 'build',
      id: 'b27-bt-ghep',
      title: 'III. Ghép câu (8 câu)',
      items: [
        { vi: 'Tại chiến tranh mà ông tôi không vào được đại học.', chips: ['{祖父|そふ}は', '{戦争|せんそう}の', 'せいで', '{大学|だいがく}に{行|い}けませんでした', 'おかげで', '{戦争|せんそう}な'], answer: ['{祖父|そふ}は', '{戦争|せんそう}の', 'せいで', '{大学|だいがく}に{行|い}けませんでした'], ro: 'Sofu wa sensou no sei de daigaku ni ikemasen deshita.' },
        { vi: 'Chắc vì căng thẳng mà tôi nói nhầm.', chips: ['{緊張|きんちょう}して', 'いた', 'せいか', '{言|い}い{間違|まちが}えました', 'おかげで', 'ために'], answer: ['{緊張|きんちょう}して', 'いた', 'せいか', '{言|い}い{間違|まちが}えました'], ro: 'Kinchou shite ita sei ka iimachigaemashita.' },
        { vi: 'Nhờ nhà ga gần mà đi học nhàn.', chips: ['{駅|えき}が', '{近|ちか}い', 'おかげで', '{通学|つうがく}が{楽|らく}です', 'せいで', '{近|ちか}くて'], answer: ['{駅|えき}が', '{近|ちか}い', 'おかげで', '{通学|つうがく}が{楽|らく}です'], ro: 'Eki ga chikai okage de tsuugaku ga raku desu.' },
        { vi: 'Do gió mạnh, tàu đang tạm dừng chạy.', chips: ['{強|つよ}い{風|かぜ}の', 'ため', '{運転|うんてん}を', '{見合|みあ}わせています', 'おかげで', 'によると'], answer: ['{強|つよ}い{風|かぜ}の', 'ため', '{運転|うんてん}を', '{見合|みあ}わせています'], ro: 'Tsuyoi kaze no tame unten o miawasete imasu.' },
        { vi: 'Tắc đường do tai nạn kéo dài 5 km.', chips: ['{事故|じこ}に', 'よる', '{渋滞|じゅうたい}が', '5キロ{続|つづ}いています', 'よって', 'よると'], answer: ['{事故|じこ}に', 'よる', '{渋滞|じゅうたい}が', '5キロ{続|つづ}いています'], ro: 'Jiko ni yoru juutai ga gokiro tsuzuite imasu.' },
        { vi: 'Bằng việc rửa tay, có thể phòng bệnh.', chips: ['{手|て}を', '{洗|あら}う', 'ことに', 'よって', '{病気|びょうき}を{防|ふせ}げます', '{洗|あら}った'], answer: ['{手|て}を', '{洗|あら}う', 'ことに', 'よって', '{病気|びょうき}を{防|ふせ}げます'], ro: 'Te o arau koto ni yotte byouki o fusegemasu.' },
        { vi: 'Tuỳ mùa mà cảnh núi thay đổi.', chips: ['{季節|きせつ}に', 'よって', '{山|やま}の{景色|けしき}が', '{変|か}わります', 'よると', 'よる'], answer: ['{季節|きせつ}に', 'よって', '{山|やま}の{景色|けしき}が', '{変|か}わります'], ro: 'Kisetsu ni yotte yama no keshiki ga kawarimasu.' },
        { vi: 'Penicillin do Fleming phát hiện.', chips: ['ペニシリンは', 'フレミングに', 'よって', '{発見|はっけん}されました', '{発見|はっけん}しました', 'よると'], answer: ['ペニシリンは', 'フレミングに', 'よって', '{発見|はっけん}されました'], ro: 'Penishirin wa Furemingu ni yotte hakken saremashita.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b27-bt-doi',
      title: 'IV. Đổi câu — viết lại bằng mẫu trong ngoặc (8 câu)',
      kind: 'fill',
      grammar: 'Văn nói (から・で) → văn viết / thông báo (ため・によって) và ngược lại; tốt ↔ xấu',
      items: [
        { q: '{雨|あめ}で{電車|でんしゃ}が{止|と}まった。→（ため）', answers: V('{雨|あめ}のため、{電車|でんしゃ}が{止|と}まった。', '{雨|あめ}のため、{電車|でんしゃ}が{止|と}まりました。'), hint: 'あめの ため' },
        { q: '{台風|たいふう}で{家|いえ}が{壊|こわ}れた。→（によって）', answers: V('{台風|たいふう}によって、{家|いえ}が{壊|こわ}れた。', '{台風|たいふう}によって{家|いえ}が{壊|こわ}れました。'), hint: 'たいふうに よって' },
        { q: '{地震|じしん}で{出|で}た{被害|ひがい}は{大|おお}きい。→（による）', answers: V('{地震|じしん}による{被害|ひがい}は{大|おお}きい。', '{地震|じしん}による{被害|ひがい}は{大|おお}きいです。'), hint: 'じしんに よる ひがい' },
        { q: '{雪|ゆき}が{降|ふ}ったから、{試合|しあい}が{中止|ちゅうし}になった。→（せいで）', answers: V('{雪|ゆき}が{降|ふ}ったせいで、{試合|しあい}が{中止|ちゅうし}になった。', '{雪|ゆき}のせいで、{試合|しあい}が{中止|ちゅうし}になった。'), hint: 'ふった せいで' },
        { q: '{先生|せんせい}が{教|おし}えてくださったから、{分|わ}かるようになった。→（おかげで）', answers: V('{先生|せんせい}が{教|おし}えてくださったおかげで、{分|わ}かるようになった。', '{先生|せんせい}のおかげで、{分|わ}かるようになった。'), hint: 'おしえて くださった おかげで' },
        { q: '{野菜|やさい}が{高|たか}い。{理由|りゆう}は{天候|てんこう}が{悪|わる}かったことだ。→（のは～ためだ）', answers: V('{野菜|やさい}が{高|たか}いのは、{天候|てんこう}が{悪|わる}かったためだ。', '{野菜|やさい}が{高|たか}いのは、{天候|てんこう}が{悪|わる}かったためです。'), hint: '…のは … ためだ' },
        { q: '{国|くに}が{違|ちが}うと、{習慣|しゅうかん}も{違|ちが}う。→（によって）', answers: V('{国|くに}によって、{習慣|しゅうかん}が{違|ちが}う。', '{国|くに}によって{習慣|しゅうかん}が{違|ちが}います。', '{国|くに}によって、{習慣|しゅうかん}は{違|ちが}う。'), hint: 'くにに よって' },
        { q: '{紫式部|むらさきしきぶ}が『{源氏物語|げんじものがたり}』を{書|か}いた。→（によって — bị động）', answers: V('『{源氏物語|げんじものがたり}』は{紫式部|むらさきしきぶ}によって{書|か}かれた。', '{源氏物語|げんじものがたり}は{紫式部|むらさきしきぶ}によって{書|か}かれた。', '『{源氏物語|げんじものがたり}』は{紫式部|むらさきしきぶ}によって{書|か}かれました。'), hint: '…は … に よって かかれた' },
      ],
    },
    {
      t: 'mcq',
      id: 'b27-bt-tin',
      title: 'V. Đọc tin ngắn — tìm NGUYÊN NHÂN và KẾT QUẢ (8 câu)',
      items: [
        { q: '「{強|つよ}い{風|かぜ}の{影響|えいきょう}で、{今日|きょう}の{船|ふね}は{全|すべ}て{欠航|けっこう}となりました。」{船|ふね}が{出|で}ない{原因|げんいん}は？', options: ['{強|つよ}い{風|かぜ}', '{乗客|じょうきゃく}が{少|すく}ない', '{船|ふね}の{故障|こしょう}', '{雨|あめ}'], correct: 0, why: '**～の{影響|えいきょう}で** = nguyên nhân. {欠航|けっこう} = huỷ chuyến (tàu thuỷ, máy bay — N2).' },
        { q: '「{小麦|こむぎ}の{値段|ねだん}が{上|あ}がったため、{来月|らいげつ}からパンが{値上|ねあ}げされます。」{来月|らいげつ}{何|なに}が{起|お}こりますか。', options: ['{小麦|こむぎ}の{値段|ねだん}が{下|さ}がる', 'パンの{値段|ねだん}が{上|あ}がる', 'パンが{売|う}れなくなる', '{小麦|こむぎ}が{足|た}りなくなる'], correct: 1, why: 'Vế sau ため = KẾT QUẢ: **パンが{値上|ねあ}げされます**. {小麦|こむぎ} = lúa mì (N3).' },
        { q: '「{市|し}の{調査|ちょうさ}によると、{自転車|じてんしゃ}による{事故|じこ}が{去年|きょねん}より2{割|わり}{増|ふ}えたということです。」{何|なに}が{増|ふ}えましたか。', options: ['{市|し}の{調査|ちょうさ}', '{自転車|じてんしゃ}を{買|か}う{人|ひと}', '{自転車|じてんしゃ}が{起|お}こした{事故|じこ}', '{自転車|じてんしゃ}の{値段|ねだん}'], correct: 2, why: '**{自転車|じてんしゃ}による{事故|じこ}** = tai nạn do xe đạp gây ra. ～によると = nguồn tin (cuộc điều tra). 2{割|わり} = 20%.' },
        { q: '「{雪|ゆき}が{少|すく}なかったせいで、スキー{場|じょう}のお{客|きゃく}さんが{半分|はんぶん}になった。」この{文|ぶん}を{書|か}いた{人|ひと}の{気持|きも}ちは？', options: ['うれしい', '{残念|ざんねん}・{困|こま}っている', '{感謝|かんしゃ}している', '{気|き}にしていない'], correct: 1, why: '**せいで** = kết quả xấu + tiếc / bực. Bản tin khách quan sẽ viết ため; câu này có cảm xúc.' },
        { q: '「ボランティアの{皆|みな}さんが{手伝|てつだ}ってくださったおかげで、{町|まち}は{一週間|いっしゅうかん}できれいになりました。」{町|まち}がきれいになったのはどうしてですか。', options: ['{政府|せいふ}が{掃除|そうじ}したから', 'ボランティアが{手伝|てつだ}ったから', '{雨|あめ}が{降|ふ}ったから', '{住民|じゅうみん}が{避難|ひなん}したから'], correct: 1, why: '**～てくださったおかげで** = nhờ (kết quả tốt, kính trọng người giúp — ôn Bài 24).' },
        { q: '「{電車|でんしゃ}の{運転|うんてん}は、{安全|あんぜん}が{確認|かくにん}でき{次第|しだい}、{再開|さいかい}する{予定|よてい}です。」{電車|でんしゃ}はいつ{動|うご}きますか。', options: ['もう{動|うご}いている', '{安全|あんぜん}が{確認|かくにん}できたらすぐ', '{明日|あした}の{朝|あさ}', 'しばらく{動|うご}かない'], correct: 1, why: '**Vます＋{次第|しだい}** = ngay khi … (N2 — nhận ra trong thông báo). Ở đây: ngay khi xác nhận an toàn.' },
        { q: '「{留学生|りゅうがくせい}の{数|かず}は、{国|くに}によって{大|おお}きく{異|こと}なる。」{正|ただ}しい{説明|せつめい}は？', options: ['どの{国|くに}の{留学生|りゅうがくせい}も{同|おな}じ{数|かず}だ', '{国|くに}が{留学生|りゅうがくせい}の{数|かず}を{決|き}める', '{留学生|りゅうがくせい}が{多|おお}い{国|くに}もあれば、{少|すく}ない{国|くに}もある', '{留学生|りゅうがくせい}が{国|くに}を{変|か}えた'], correct: 2, why: 'によって + {異|こと}なる = **tuỳ nước mà khác nhau** → nước nhiều, nước ít. ～もあれば～もある = có… cũng có… (N3).' },
        { q: '「この{橋|はし}は、1980{年|ねん}に{地元|じもと}の{会社|かいしゃ}によって{造|つく}られた。」{誰|だれ}が{橋|はし}を{造|つく}りましたか。', options: ['1980{年|ねん}の{人|ひと}', '{地元|じもと}の{会社|かいしゃ}', '{国|くに}', '{分|わ}からない'], correct: 1, why: 'Tác nhân bị động: **{地元|じもと}の{会社|かいしゃ}によって{造|つく}られた**. {地元|じもと} = địa phương (N3).' },
      ],
    },
  ],
};

/* ═══════════════════════ ② THEO BUỔI TRÊN LỚP ═══════════════════════ */

const BUOI_1: Lesson = {
  id: 'b27-buoi-1-sei-okage',
  kind: 'review',
  title: 'Buổi 1 — Mở Bài 27 (N3): từ mới tin tức & thời tiết · ～せいで tại · ～せいか có lẽ tại · ～おかげで nhờ · hội thoại ①',
  goal: 'Theo nhịp một buổi trên lớp: khởi động bằng から／ので／N で (ポイント 47, 124), học từ nhóm tin tức & truyền thông và thời tiết & thiên tai, nắm ba cách nhìn nguyên nhân — せいで (xấu, trách), せいか (đoán), おかげで (tốt, biết ơn — và mỉa mai), đọc hội thoại ① ở phòng sinh hoạt chung, luyện cặp "最近、何かいいこと／困ったことあった？" và trả lời 5 câu kiểm tra cuối buổi.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 1 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Khởi động (5′)** — ôn **～から** (ポイント 47), **～ので** và **N で** chỉ nguyên nhân (ポイント 124: {台風|たいふう}で{電車|でんしゃ}が{止|と}まった). Câu hỏi mở đầu: "Tiếng Việt có \'tại\' và \'nhờ\' — tiếng Nhật có không?"',
        '**Từ mới (12′)** — nhóm A (tin tức: {報道|ほうどう}, {速報|そくほう}, {記者|きしゃ}, {放送|ほうそう}, アナウンサー, {事件|じけん}, {発生|はっせい}, {状況|じょうきょう}, {原因|げんいん}, {影響|えいきょう}, {調査|ちょうさ}, {記録|きろく}, {全国|ぜんこく}, {各地|かくち}) + nhóm B (thời tiết: {大雨|おおあめ}, {大雪|おおゆき}, {気温|きおん}, {天候|てんこう}, {気候|きこう}, {梅雨|つゆ}, {警報|けいほう}, {津波|つなみ}, {避難|ひなん}, {災害|さいがい}, {揺|ゆ}れる, {激|はげ}しい).',
        '**Ngữ pháp (20′)** — ① **～せいで／～せいだ** "tại…" (xấu, đổ lỗi) · ② **～せいか** "chắc tại…" (đoán) + **{気|き}のせい** · ③ **～おかげで／～おかげだ** "nhờ…" (tốt, biết ơn) + **mỉa mai**.',
        '**Hội thoại (8′)** — ① phòng sinh hoạt chung lúc 7 giờ sáng: bản tin bão.',
        '**チャレンジ (5′)** — luyện cặp: A hỏi 「{最近|さいきん}、{何|なに}かいいこと／{困|こま}ったことあった？」 ↔ B trả lời bằng おかげで／せいで. Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b27-b1-slides',
      title: 'Bài 27 ニュース — Buổi 1: ～せいで・～せいか・～おかげで',
      slides: [
        {
          tieuDe: '{第|だい}27{課|か} ニュース',
          anh: ['television', 'cyclone', 'rolled-up-newspaper'],
          nhan: ['ニュース', '{台風|たいふう}', '{新聞|しんぶん}'],
          dong: ['Hôm nay: **～せいで** (tại) · **～せいか** (chắc tại) · **～おかげで** (nhờ)'],
          ro: ['~sei de · ~sei ka · ~okage de'],
          ghi: 'Bài 27 là bài "vì sao": nguyên nhân – kết quả – cách thức. Buổi 1: ba cách nhìn nguyên nhân trong lời nói hằng ngày (せいで, せいか, おかげで). Buổi 2: giọng thông báo, tin tức (ため, によって). Buổi 3: によって còn ba nghĩa nữa.',
        },
        {
          tieuDe: 'できること — Học xong Bài 27 làm được gì?',
          anh: ['television', 'woman-teacher', 'man-cook'],
          nhan: ['27-1 せい・おかげ', '27-2 ため・による', '27-3 によって'],
          dong: ['① Than & cảm ơn: {寝不足|ねぶそく}のせいで{頭|あたま}が{痛|いた}い。{君|きみ}のおかげで{助|たす}かった。', '② Thuật lại bản tin: {大雨|おおあめ}のため、{電車|でんしゃ}が{運休|うんきゅう}です。', '③ So sánh: {国|くに}によって{報道|ほうどう}の{仕方|しかた}が{違|ちが}う。'],
          ro: ['Nebusoku no sei de atama ga itai. Kimi no okage de tasukatta.', 'Ooame no tame, densha ga unkyuu desu.', 'Kuni ni yotte houdou no shikata ga chigau.'],
          ghi: 'Cuối Bài 27 bạn trình bày được 1 phút "Một tin tức gần đây khiến tôi chú ý" — dạng Presenting của thi nói N3.',
        },
        {
          tieuDe: 'Khởi động — ～から・～ので・N で',
          anh: ['cyclone', 'train'],
          nhan: ['{台風|たいふう}', '{電車|でんしゃ}'],
          dong: ['{台風|たいふう}で、{電車|でんしゃ}が{止|と}まりました。', '{雨|あめ}だから、{家|いえ}にいます。'],
          ro: ['Taifuu de, densha ga tomarimashita.', 'Ame da kara, ie ni imasu.'],
          hoi: '「{台風|たいふう}で」の「で」はどんな{意味|いみ}ですか。',
          dap: 'Nguyên nhân — "vì bão" (ポイント 124). Hôm nay học thêm cách nói có **cảm xúc**: tại (せいで), nhờ (おかげで).',
          ghi: 'Ghi lên góc bảng: で／から／ので = trung tính. Hôm nay thêm: せいで = trách · おかげで = biết ơn.',
        },
        {
          tieuDe: '{新|あたら}しいことば ① — ニュース',
          anh: ['television', 'microphone', 'police-car', 'loudspeaker'],
          nhan: ['アナウンサー', '{記者|きしゃ}', '{事件|じけん}', '{速報|そくほう}'],
          dong: ['アナウンサーがニュースを{伝|つた}えています。', '{駅|えき}の{近|ちか}くで{事件|じけん}が{発生|はっせい}しました。'],
          ro: ['Anaunsaa ga nyuusu o tsutaete imasu.', 'Eki no chikaku de jiken ga hassei shimashita.'],
          hoi: '{事件|じけん}と{事故|じこ}はどう{違|ちが}いますか。',
          dap: '{事件|じけん}: có người CỐ Ý (trộm, lừa đảo). {事故|じこ}: tai nạn, không cố ý.',
          ghi: 'Thêm: {報道|ほうどう}する (đưa tin), {放送|ほうそう}する (phát sóng), {状況|じょうきょう} (tình hình), {調査|ちょうさ} (điều tra), {記録|きろく}, {全国|ぜんこく}・{各地|かくち}.',
        },
        {
          tieuDe: '{新|あたら}しいことば ② — {天気|てんき}・{災害|さいがい}',
          anh: ['cloud-with-rain', 'snowflake', 'thermometer', 'umbrella-with-rain-drops'],
          nhan: ['{大雨|おおあめ}', '{大雪|おおゆき}', '{気温|きおん}', '{梅雨|つゆ}'],
          dong: ['{大雨警報|おおあめけいほう}が{出|で}ました。', '{梅雨|つゆ}に{入|はい}りました。'],
          ro: ['Ooame keihou ga demashita.', 'Tsuyu ni hairimashita.'],
          hoi: '「{梅雨|つゆ}」と「{大雨|おおあめ}」はどう{読|よ}みますか。',
          dap: '**つゆ** (đọc cả từ) · **おおあめ** (không phải だいう).',
          ghi: 'Thêm: {天候|てんこう}・{気候|きこう} (bảng phân biệt với {天気|てんき}), {警報|けいほう}, {津波|つなみ}, {避難|ひなん}する, {災害|さいがい}, {揺|ゆ}れる, {激|はげ}しい.',
        },
        {
          tieuDe: '{新|あたら}しいことば ③ — {原因|げんいん}・{影響|えいきょう}',
          anh: ['police-car', 'cyclone'],
          nhan: ['{事故|じこ}の{原因|げんいん}', '{台風|たいふう}の{影響|えいきょう}'],
          dong: ['{事故|じこ}の{原因|げんいん}を{調|しら}べています。', '{台風|たいふう}の{影響|えいきょう}で、{飛行機|ひこうき}が{遅|おく}れています。'],
          ro: ["Jiko no gen'in o shirabete imasu.", 'Taifuu no eikyou de, hikouki ga okurete imasu.'],
          hoi: '「{遅刻|ちこく}した{原因|げんいん}」と「{遅刻|ちこく}した{理由|りゆう}」、どちらが{自然|しぜん}ですか。',
          dap: '**{理由|りゆう}** — lý do của hành động con người. {原因|げんいん} cho sự việc (tai nạn, bệnh, hỏng hóc).',
          ghi: '～の{影響|えいきょう}で = cụm bản tin hay nghe nhất. Romaji: gen\'in (có dấu nháy).',
        },
        {
          tieuDe: '① ～せいで — "tại…" (chuyện XẤU)',
          anh: ['cloud-with-rain', 'crying-face'],
          nhan: ['{雨|あめ}', '{残念|ざんねん}'],
          dong: ['{雨|あめ}のせいで、{試合|しあい}が{中止|ちゅうし}になりました。', '{電車|でんしゃ}が{遅|おく}れたせいで、{遅刻|ちこく}しました。'],
          ro: ['Ame no sei de, shiai ga chuushi ni narimashita.', 'Densha ga okureta sei de, chikoku shimashita.'],
          bang: { head: ['Loại từ', '＋ せいで'], rows: [['N', '{雨|あめ}**の**せいで'], ['ナA', '{複雑|ふくざつ}**な**せいで'], ['イA', '{狭|せま}い**せいで**'], ['V', '{遅|おく}れた**せいで**']] },
          ghi: 'せい là danh từ → nối như danh từ. Vế sau là chuyện xấu đã xảy ra; người nói không vui, đổ lỗi.',
        },
        {
          tieuDe: '① ～のは～せいだ · ～のせいにする',
          anh: ['sleeping-face', 'pouting-face'],
          nhan: ['{寝不足|ねぶそく}', '{人|ひと}のせい'],
          dong: ['{頭|あたま}が{痛|いた}いのは、{寝不足|ねぶそく}のせいです。', '{失敗|しっぱい}を{人|ひと}のせいにしないでください。'],
          ro: ['Atama ga itai no wa, nebusoku no sei desu.', 'Shippai o hito no sei ni shinaide kudasai.'],
          hoi: '「{先生|せんせい}のせいで、{合格|ごうかく}できました」は{正|ただ}しいですか。',
          dap: 'Không. Kết quả TỐT → **{先生|せんせい}のおかげで**.',
          ghi: '{私|わたし}のせいです (là lỗi của tôi) = cách nhận lỗi lịch sự. Nhưng nói "{部長|ぶちょう}のせいで" trước mặt sếp là đổ lỗi rất nặng.',
        },
        {
          tieuDe: '② ～せいか — "chắc là tại…" (không chắc)',
          anh: ['yawning-face', 'older-person'],
          nhan: ['{寝不足|ねぶそく}', '{年|とし}'],
          dong: ['{年|とし}のせいか、{疲|つか}れやすくなりました。', '{気|き}のせいか、{今日|きょう}は{静|しず}かですね。'],
          ro: ['Toshi no sei ka, tsukare yasuku narimashita.', 'Ki no sei ka, kyou wa shizuka desu ne.'],
          hoi: '「せいで」と「せいか」はどう{違|ちが}いますか。',
          dap: 'せいで: biết chắc nguyên nhân. せいか: chỉ đoán ("chắc là tại…").',
          ghi: 'Cụm: {気|き}のせいか (không biết có phải tưởng tượng không) · {気|き}のせいだよ (cậu tưởng tượng thôi).',
        },
        {
          tieuDe: '③ ～おかげで — "nhờ…" (chuyện TỐT)',
          anh: ['folded-hands', 'handshake'],
          nhan: ['{感謝|かんしゃ}', '{手伝|てつだ}う'],
          dong: ['{先生|せんせい}のおかげで、{合格|ごうかく}できました。', '{友達|ともだち}が{手伝|てつだ}ってくれたおかげで、{早|はや}く{終|お}わりました。'],
          ro: ['Sensei no okage de, goukaku dekimashita.', 'Tomodachi ga tetsudatte kureta okage de, hayaku owarimashita.'],
          hoi: '{日本|にほん}に{来|き}て、{誰|だれ}のおかげで{頑張|がんば}れましたか。',
          dap: '（{例|れい}）{寮|りょう}の{先輩|せんぱい}のおかげです。{手続|てつづ}きを{手伝|てつだ}ってくれたおかげで、すぐ{慣|な}れました。',
          ghi: 'Người khác giúp → luôn kèm ～てくれた. Câu cảm ơn trang trọng: ～のは、～のおかげです。',
        },
        {
          tieuDe: '③ おかげで + chuyện XẤU = mỉa mai',
          anh: ['face-with-rolling-eyes', 'train'],
          nhan: ['（{笑|わら}）', '{乗|の}り{遅|おく}れた'],
          dong: ['{君|きみ}が{寝坊|ねぼう}したおかげで、{電車|でんしゃ}に{乗|の}り{遅|おく}れたよ。'],
          ro: ['Kimi ga nebou shita okage de, densha ni noriokureta yo.'],
          hoi: 'この「おかげで」の{本当|ほんとう}の{意味|いみ}は？',
          dap: '**せいで** — trách nhẹ, trêu chọc ("nhờ ơn cậu mà…").',
          ghi: 'Như câu anh 小林 ở hội thoại ③. Hiểu được là đủ — đừng tự dùng với người trên.',
        },
        {
          tieuDe: '{会話|かいわ}① — {寮|りょう}のラウンジで',
          anh: ['television', 'cyclone', 'yawning-face'],
          nhan: ['{朝|あさ}のニュース', '{台風|たいふう}', 'ダニエル'],
          dong: ['{大雨|おおあめ}のため、{午前中|ごぜんちゅう}は{運休|うんきゅう}するそうです。', '{風|かぜ}の{音|おと}がうるさかったせいで、{眠|ねむ}れなかったんだ。', 'リンさんのおかげで、{助|たす}かったよ。'],
          ro: ['Ooame no tame, gozenchuu wa unkyuu suru sou desu.', 'Kaze no oto ga urusakatta sei de, nemurenakatta n da.', 'Rin-san no okage de, tasukatta yo.'],
          hoi: 'ダニエルさんはどうして{眠|ねむ}いのですか。',
          dap: '{風|かぜ}の{音|おと}がうるさかったせいで、ゆうべ{眠|ねむ}れなかったからです。',
          ghi: 'Đọc to theo vai (リン — ダニエル). Gạch chân: ため (thuật lại bản tin), せいで, せいか, おかげ, による.',
        },
        {
          tieuDe: 'チャレンジ — {話|はな}してみよう',
          anh: ['person-raising-hand', 'handshake'],
          nhan: ['A', 'B'],
          dong: ['A：{最近|さいきん}、{何|なに}かいいことあった？', 'B：うん。～のおかげで、～。', 'A：じゃ、{困|こま}ったことは？', 'B：～のせいで、～てしまったんだ。'],
          ro: ['A: Saikin, nani ka ii koto atta?', 'B: Un. ~ no okage de, ~.', 'A: Ja, komatta koto wa?', 'B: ~ no sei de, ~te shimatta n da.'],
          ghi: 'Đổi vai 2 lần. Mỗi người nói 1 chuyện tốt (おかげで) + 1 chuyện xấu (せいで) có thật của mình. Giáo viên đi quanh nghe và sửa phần nối (Nの／ナAな).',
        },
        {
          tieuDe: 'まとめ — Buổi 1',
          bang: {
            head: ['Mẫu', 'Kết quả', 'Thái độ', 'Ví dụ'],
            rows: [
              ['～せいで', 'xấu', 'trách', '{雨|あめ}のせいで{中止|ちゅうし}'],
              ['～せいか', 'xấu / trung tính', 'đoán', '{年|とし}のせいか{疲|つか}れる'],
              ['～おかげで', 'tốt', 'biết ơn', '{先生|せんせい}のおかげで{合格|ごうかく}'],
              ['おかげで (mỉa mai)', 'xấu', 'trêu', '{君|きみ}のおかげで{遅|おく}れた'],
            ],
          },
          ghi: 'Bài về nhà: viết 3 câu せいで và 3 câu おかげで về đời sống du học của bạn. Buổi sau: ため và によって — giọng bản tin.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Khởi động: から・ので・N で' },
    {
      t: 'p',
      text: 'Giáo viên hỏi: "Hôm bão, tàu dừng — các em nói thế nào?" Cả lớp: {台風|たいふう}で{電車|でんしゃ}が{止|と}まりました (ポイント 124). Giáo viên: "Đúng. Nhưng nếu tàu dừng làm em **trễ thi** — em bực — người Nhật hay nói **{台風|たいふう}のせいで**. Còn nếu bão làm trường **cho nghỉ** — em vui — thì có người đùa **{台風|たいふう}のおかげで**. Hôm nay ta học hai chữ này."',
    },
    {
      t: 'mcq',
      id: 'b27-b1-khoi-dong',
      title: 'Khởi động — ôn から・ので・N で (4 câu)',
      items: [
        { q: '{台風|たいふう}（　）、{電車|でんしゃ}が{止|と}まりました。', options: ['で', 'に', 'を', 'が'], correct: 0, why: 'N ＋ **で** = nguyên nhân (ポイント 124). 〔Taifuu de, densha ga tomarimashita.〕' },
        { q: '{雨|あめ}（　）から、{家|いえ}で{映画|えいが}を{見|み}ましょう。', options: ['だ', 'な', 'の', 'で'], correct: 0, why: 'N ＋ **だから** (ポイント 47). 〔Ame da kara…〕' },
        { q: '{雨|あめ}（　）ので、{傘|かさ}を{持|も}っていってください。', options: ['だ', 'な', 'の', 'に'], correct: 1, why: 'N ＋ **なので** (ので nối N bằng な). 〔Ame na node…〕' },
        { q: 'Vế sau là lời rủ "～ましょう" thì dùng được mẫu nào?', options: ['から・ので', 'N で', 'cả hai', 'không mẫu nào'], correct: 0, why: '**から／ので** đi được với lời rủ, nhờ. **N で** chỉ đi với kết quả (không ý chí). Hôm nay: せいで, おかげで cũng KHÔNG đi với lời rủ.' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Từ mới: bản tin buổi sáng' },
    {
      t: 'p',
      text: 'Giáo viên bật một bản tin (giả lập) và cho cả lớp đọc to từng dòng — mỗi dòng có một từ mới của nhóm A và B.',
    },
    {
      t: 'examples',
      items: [
        E('{今朝|けさ}6{時|じ}ごろ、{関東|かんとう}で{地震|じしん}が{発生|はっせい}しました。', 'Kesa rokuji goro, Kantou de jishin ga hassei shimashita.', 'Khoảng 6 giờ sáng nay, một trận động đất đã xảy ra ở Kanto.'),
        E('この{地震|じしん}による{津波|つなみ}の{心配|しんぱい}はありません。', 'Kono jishin ni yoru tsunami no shinpai wa arimasen.', 'Không có nguy cơ sóng thần do trận động đất này.'),
        E('{台風|たいふう}の{影響|えいきょう}で、{各地|かくち}で{激|はげ}しい{雨|あめ}が{降|ふ}っています。', 'Taifuu no eikyou de, kakuchi de hageshii ame ga futte imasu.', 'Do ảnh hưởng của bão, mưa đang rơi dữ dội ở nhiều nơi.'),
        E('{九州|きゅうしゅう}に{大雨警報|おおあめけいほう}が{出|で}ています。', 'Kyuushuu ni ooame keihou ga dete imasu.', 'Vùng Kyushu đang có cảnh báo mưa lớn.'),
        E('{川|かわ}の{近|ちか}くの{住民|じゅうみん}は、{早|はや}めに{避難|ひなん}してください。', 'Kawa no chikaku no juumin wa, hayame ni hinan shite kudasai.', 'Cư dân gần sông xin hãy sơ tán sớm.'),
        E('{今日|きょう}の{最高気温|さいこうきおん}は、{東京|とうきょう}で35{度|ど}の{予想|よそう}です。', 'Kyou no saikou kion wa, Toukyou de sanjuugo-do no yosou desu.', 'Nhiệt độ cao nhất hôm nay ở Tokyo dự kiến 35 độ.'),
      ],
    },
    { t: 'h', text: 'Slide 3 — せいで・せいか・おかげで: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b27-b1-noi-tu',
      title: 'Luyện nhanh — nối từ trong ngoặc với mẫu (8 câu)',
      kind: 'fill',
      items: [
        { q: '（{台風|たいふう}）せいで、{旅行|りょこう}が{中止|ちゅうし}になった。', answers: V('{台風|たいふう}の'), hint: 'N ＋ の' },
        { q: '{説明|せつめい}が（{下手|へた}）せいで、{誰|だれ}も{分|わ}からなかった。', answers: V('{下手|へた}な'), hint: 'ナA ＋ な' },
        { q: '{家|いえ}が（{駅|えき}から{遠|とお}い）せいで、{毎朝|まいあさ}{大変|たいへん}だ。', answers: V('{駅|えき}から{遠|とお}い'), hint: 'イA giữ nguyên' },
        { q: '{昨日|きのう}（{飲|の}みすぎる→quá khứ）せいで、{頭|あたま}が{痛|いた}い。', answers: V('{飲|の}みすぎた'), hint: 'のみすぎた' },
        { q: '（{気|き}）せいか、{最近|さいきん}{彼女|かのじょ}は{元気|げんき}がない。', answers: V('{気|き}の'), hint: 'cụm 気のせいか' },
        { q: '（{先生|せんせい}）おかげで、N3に{合格|ごうかく}できました。', answers: V('{先生|せんせい}の'), hint: 'N ＋ の' },
        { q: '{友達|ともだち}が（{手伝|てつだ}う→cho mình, quá khứ）おかげで、{早|はや}く{終|お}わった。', answers: V('{手伝|てつだ}ってくれた'), hint: 'てつだって くれた' },
        { q: '{交通|こうつう}が（{便利|べんり}）おかげで、{通学|つうがく}が{楽|らく}です。', answers: V('{便利|べんり}な'), hint: 'ナA ＋ な' },
      ],
    },
    {
      t: 'quiz',
      id: 'b27-b1-noi',
      title: 'Nói thành câu — dịch nhanh Việt → Nhật rồi đọc to (6 câu)',
      kind: 'translate',
      grammar: '～せいで · ～せいか · ～おかげで',
      items: [
        { q: 'Tại mưa mà trận đấu bị huỷ.', answers: V('{雨|あめ}のせいで、{試合|しあい}が{中止|ちゅうし}になりました。', '{雨|あめ}のせいで{試合|しあい}が{中止|ちゅうし}になった。'), hint: 'あめの せいで' },
        { q: 'Tại tàu chậm nên tôi đến muộn.', answers: V('{電車|でんしゃ}が{遅|おく}れたせいで、{遅刻|ちこく}しました。', '{電車|でんしゃ}が{遅|おく}れたせいで、{遅|おく}れました。', '{電車|でんしゃ}が{遅|おく}れたせいで、{遅刻|ちこく}してしまいました。'), hint: 'おくれた せいで' },
        { q: 'Chắc tại thiếu ngủ mà tôi không tập trung được.', answers: V('{寝不足|ねぶそく}のせいか、{集中|しゅうちゅう}できません。', '{寝不足|ねぶそく}のせいか、{集中|しゅうちゅう}できませんでした。'), hint: 'ねぶそくの せいか' },
        { q: 'Nhờ thầy mà tôi đỗ.', answers: V('{先生|せんせい}のおかげで、{合格|ごうかく}できました。', '{先生|せんせい}のおかげで{合格|ごうかく}しました。'), hint: 'せんせいの おかげで' },
        { q: 'Nhờ bạn giúp mà chuyển nhà xong sớm.', answers: V('{友達|ともだち}が{手伝|てつだ}ってくれたおかげで、{引|ひ}っ{越|こ}しが{早|はや}く{終|お}わりました。'), hint: 'てつだって くれた おかげで' },
        { q: 'Tôi đỗ được là nhờ mọi người.', answers: V('{合格|ごうかく}できたのは、{皆|みな}さんのおかげです。', '{合格|ごうかく}できたのは{皆|みな}さんのおかげです。'), hint: '…のは みなさんの おかげです' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**Nối đúng**: Nの・ナAな・イA・V{普通形|ふつうけい} ＋ せいで／せいか／おかげで. Không ~~{雨|あめ}だせいで~~, không ~~{便利|べんり}のおかげで~~.',
        '**Nhìn vế sau để chọn**: chuyện xấu → せいで; chuyện tốt → おかげで; không chắc → せいか. Vế sau là lời rủ / nhờ → không dùng cả ba (dùng から／ので).',
        '**Người giúp mình** → **～てくれたおかげで** + lời cảm ơn. Đây là câu "ăn điểm" khi thi nói.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 1)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '「{雨|あめ}」と「せいで」をつないでください。', ro: '"Ame" to "sei de" o tsunaide kudasai.', vi: 'Em nối "ame" với "sei de" đi.' },
        { who: 'Bạn', role: 'candidate', text: '「{雨|あめ}のせいで」です。{雨|あめ}のせいで、{試合|しあい}が{中止|ちゅうし}になりました。', ro: '"Ame no sei de" desu. Ame no sei de, shiai ga chuushi ni narimashita.', vi: 'Là "ame no sei de" ạ. Tại mưa mà trận đấu bị huỷ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{最近|さいきん}、{何|なに}か{困|こま}ったことはありますか。', ro: 'Saikin, nani ka komatta koto wa arimasu ka.', vi: 'Dạo này em có gặp chuyện gì khó khăn không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい。{隣|となり}の{部屋|へや}がうるさいせいで、よく{眠|ねむ}れないんです。', ro: 'Hai. Tonari no heya ga urusai sei de, yoku nemurenai n desu.', vi: 'Có ạ. Tại phòng bên cạnh ồn nên em ngủ không ngon.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{日本語|にほんご}が{上手|じょうず}になったのは、{何|なん}のおかげですか。', ro: 'Nihongo ga jouzu ni natta no wa, nan no okage desu ka.', vi: 'Tiếng Nhật của em giỏi lên là nhờ cái gì?' },
        { who: 'Bạn', role: 'candidate', text: 'アルバイトのおかげです。{毎日|まいにち}お{客|きゃく}さんと{話|はな}すので、{会話|かいわ}が{速|はや}くなりました。', ro: 'Arubaito no okage desu. Mainichi okyaku-san to hanasu node, kaiwa ga hayaku narimashita.', vi: 'Là nhờ việc làm thêm ạ. Ngày nào em cũng nói chuyện với khách nên em nói nhanh hơn.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「{君|きみ}のおかげで{遅|おく}れたよ」は、ほめていますか。', ro: '"Kimi no okage de okureta yo" wa, homete imasu ka.', vi: '"Kimi no okage de okureta yo" là đang khen à?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ。{本当|ほんとう}は「せいで」の{意味|いみ}です。{少|すこ}し{怒|おこ}っています。', ro: 'Iie. Hontou wa "sei de" no imi desu. Sukoshi okotte imasu.', vi: 'Không ạ. Thật ra nghĩa là "sei de". Người nói đang hơi bực ạ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b27-b1-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: '{説明|せつめい}が{複雑|ふくざつ}（　）せいで、{分|わ}からなかった。', options: ['の', 'な', 'だ', 'で'], correct: 1, why: 'ナA ＋ **な** ＋ せいで. 〔Fukuzatsu na sei de…〕' },
        { q: '{先輩|せんぱい}がアドバイスしてくれた（　）、{面接|めんせつ}に{合格|ごうかく}した。', options: ['せいで', 'おかげで', 'せいか', 'のに'], correct: 1, why: 'Người giúp + kết quả tốt → **おかげで**. せいで／せいか cho kết quả xấu; のに (vậy mà) trái nghĩa. 〔Adobaisu shite kureta okage de…〕' },
        { q: '{緊張|きんちょう}した（　）、{名前|なまえ}を{間違|まちが}えてしまった。（không chắc）', options: ['せいか', 'おかげか', 'のに', 'によって'], correct: 0, why: 'Đoán nguyên nhân chuyện xấu → **せいか**. おかげか cho kết quả tốt; によって không đứng sau động từ. 〔Kinchou shita sei ka…〕' },
        { q: 'どの{文|ぶん}が{正|ただ}しいですか。', options: ['{雨|あめ}のおかげで、{運動会|うんどうかい}が{中止|ちゅうし}になって{悲|かな}しい。', '{雨|あめ}のせいで、{運動会|うんどうかい}が{中止|ちゅうし}になって{悲|かな}しい。', '{雨|あめ}のせいで、{家|いえ}で{遊|あそ}びましょう。', '{雨|あめ}だせいで、{中止|ちゅうし}になった。'], correct: 1, why: 'Chuyện xấu + buồn → **せいで**. 1 dùng おかげ sai; 3 vế sau là lời rủ; 4 sai nối (~~だせいで~~).' },
        { q: '「{気|き}のせいだよ」の{意味|いみ}は？', options: ['Là tại tâm trạng của cậu đấy.', 'Cậu tưởng tượng thôi, không có gì đâu.', 'Nhờ cảm giác của cậu đấy.', 'Cẩn thận nhé.'], correct: 1, why: '**{気|き}のせいだ** = chỉ là tưởng tượng / do cảm giác thôi. 〔Ki no sei da yo.〕' },
      ],
    },
  ],
};

const BUOI_2: Lesson = {
  id: 'b27-buoi-2-tame-niyotte',
  kind: 'review',
  title: 'Buổi 2 — Giọng bản tin: từ mới giao thông & kinh tế · ～ため nguyên nhân (≠ ために mục đích) · ～によって／～による nguyên nhân · bảng phân biệt · hội thoại ③',
  goal: 'Theo nhịp một buổi trên lớp: ôn せいで・おかげで bằng câu hỏi nhanh, học từ nhóm giao thông và xã hội – kinh tế, nắm ～ため chỉ nguyên nhân (Nの・イA・ナAな・V普通形 + ため) và phân biệt chắc chắn với ために mục đích của Bài 21, dùng ～によって／～により／～による N trong văn tin tức, chọn đúng giữa せいで・おかげで・ため・から・ので, đọc hội thoại ③ ở ひまわり食堂, đóng vai nhân viên ga đọc thông báo và trả lời 5 câu kiểm tra cuối buổi.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 2 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Ôn bài cũ (5′)** — 3 câu hỏi nhanh: せいで hay おかげで? (chuyện tốt / xấu). Câu hỏi mở đầu: "Loa ở ga Nhật nói 「{雪|ゆき}のため」 — sao họ không nói 「{雪|ゆき}のせいで」?"',
        '**Từ mới (12′)** — nhóm C (giao thông: {渋滞|じゅうたい}, {列車|れっしゃ}, {乗客|じょうきゃく}, {道路|どうろ}, {線路|せんろ}, {通行止|つうこうど}め, {運休|うんきゅう}, {遅延|ちえん}, {再開|さいかい}, {交通機関|こうつうきかん}, {混乱|こんらん}, {見合|みあ}わせる) + nhóm D phần kinh tế ({物価|ぶっか}, {値上|ねあ}がり, {景気|けいき}, {税金|ぜいきん}, {少子化|しょうしか}, {高齢化|こうれいか}).',
        '**Ngữ pháp (20′)** — ④ **～ため（に）／～のは～ためだ** (nguyên nhân, khách quan) + bảng **ため mục đích ↔ ため nguyên nhân** · ⑤ **～によって／～により／～による N** (nguyên nhân trong tin tức) · bảng phân biệt **せいで・おかげで・ため・から・ので・で**.',
        '**Hội thoại (8′)** — ③ ひまわり{食堂|しょくどう}: giá rau tăng — ため, せいで, おかげで (cả nghĩa mỉa mai).',
        '**チャレンジ (5′)** — đóng vai **nhân viên nhà ga**: đọc thông báo 「～のため、～ております」. Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b27-b2-slides',
      title: 'Bài 27 ニュース — Buổi 2: ～ため・～によって（nguyên nhân）',
      slides: [
        {
          tieuDe: '{第|だい}27{課|か} ニュース — Buổi 2',
          anh: ['train', 'snowflake', 'loudspeaker'],
          nhan: ['{電車|でんしゃ}', '{大雪|おおゆき}', '{駅|えき}の{放送|ほうそう}'],
          dong: ['Hôm nay: **～ため** (do — thông báo) · **～によって／～による** (do — tin tức)'],
          ro: ['~tame · ~ni yotte / ~ni yoru'],
          ghi: 'Buổi 1 là cách nói có cảm xúc (trách / biết ơn). Buổi 2 là giọng KHÁCH QUAN — loa ở ga, bản tin, email công việc.',
        },
        {
          tieuDe: 'Ôn bài cũ — せいで？おかげで？',
          anh: ['crying-face', 'smiling-face-with-smiling-eyes'],
          nhan: ['xấu', 'tốt'],
          dong: ['{雨|あめ}（　）、{花火|はなび}が{中止|ちゅうし}になった。', '{薬|くすり}（　）、{熱|ねつ}が{下|さ}がった。'],
          ro: ['Ame ( ), hanabi ga chuushi ni natta.', 'Kusuri ( ), netsu ga sagatta.'],
          hoi: '（　）に{何|なに}が{入|はい}りますか。',
          dap: '{雨|あめ}**のせいで** (xấu) · {薬|くすり}**のおかげで** (tốt).',
          ghi: 'Hỏi thêm: nếu là loa thông báo của ban tổ chức pháo hoa thì nói thế nào? → {雨|あめ}**のため**、{中止|ちゅうし}です. Đó là bài hôm nay.',
        },
        {
          tieuDe: '{新|あたら}しいことば ① — {交通|こうつう}',
          anh: ['automobile', 'train', 'no-entry', 'railway-track'],
          nhan: ['{渋滞|じゅうたい}', '{列車|れっしゃ}', '{通行止|つうこうど}め', '{線路|せんろ}'],
          dong: ['{高速道路|こうそくどうろ}が10キロ{渋滞|じゅうたい}しています。', 'この{先|さき}は{通行止|つうこうど}めです。'],
          ro: ['Kousoku douro ga jukkiro juutai shite imasu.', 'Kono saki wa tsuukoudome desu.'],
          hoi: '{渋滞|じゅうたい}と{遅延|ちえん}はどう{違|ちが}いますか。',
          dap: '{渋滞|じゅうたい}: ĐƯỜNG tắc (xe). {遅延|ちえん}: TÀU / chuyến bay chậm giờ.',
          ghi: 'Thêm: {乗客|じょうきゃく} (hành khách), {道路|どうろ} (đường xe chạy), {交通機関|こうつうきかん} (giao thông công cộng), {混乱|こんらん} ≠ {混雑|こんざつ}.',
        },
        {
          tieuDe: '{新|あたら}しいことば ② — {駅|えき}の{電光掲示板|でんこうけいじばん}',
          anh: ['station', 'stop-sign', 'hourglass-not-done'],
          nhan: ['{運休|うんきゅう}', '{運転見合|うんてんみあ}わせ', '{遅延|ちえん}'],
          dong: ['{台風|たいふう}のため、{新幹線|しんかんせん}は{運休|うんきゅう}です。', '{強風|きょうふう}のため、{運転|うんてん}を{見合|みあ}わせています。', '{午後|ごご}3{時|じ}に{運転|うんてん}を{再開|さいかい}しました。'],
          ro: ['Taifuu no tame, shinkansen wa unkyuu desu.', 'Kyoufuu no tame, unten o miawasete imasu.', 'Gogo sanji ni unten o saikai shimashita.'],
          hoi: '「{運休|うんきゅう}」と「{運転見合|うんてんみあ}わせ」、どちらが{長|なが}く{止|と}まりますか。',
          dap: '{運休|うんきゅう}: ngừng hẳn chuyến đó (cả ngày, cả buổi). {見合|みあ}わせ: tạm dừng, đang chờ — có thể chạy lại sớm.',
          ghi: 'Đến muộn vì tàu → xin **{遅延証明書|ちえんしょうめいしょ}** ở cửa soát vé, nộp cho trường / chỗ làm.',
        },
        {
          tieuDe: '{新|あたら}しいことば ③ — {経済|けいざい}・{社会|しゃかい}',
          anh: ['shopping-cart', 'chart-increasing', 'yen-banknote', 'older-person'],
          nhan: ['{物価|ぶっか}', '{値上|ねあ}がり', '{税金|ぜいきん}', '{高齢化|こうれいか}'],
          dong: ['{物価|ぶっか}が{上|あ}がっています。', '{野菜|やさい}が{値上|ねあ}がりしました。'],
          ro: ['Bukka ga agatte imasu.', 'Yasai ga neagari shimashita.'],
          hoi: '「{値上|ねあ}がり」と「{値上|ねあ}げ」はどう{違|ちが}いますか。',
          dap: '{値上|ねあ}がり: giá TỰ tăng (が). {値上|ねあ}げ: người bán TĂNG giá (を).',
          ghi: 'Thêm: {景気|けいき} (tình hình kinh tế), {少子化|しょうしか} (ít trẻ em). {物価|ぶっか} = giá chung; {値段|ねだん} = giá một món.',
        },
        {
          tieuDe: '④ ～ため — "do…" (khách quan)',
          anh: ['loudspeaker', 'snowflake'],
          nhan: ['{放送|ほうそう}', '{大雪|おおゆき}'],
          dong: ['{大雪|おおゆき}のため、{電車|でんしゃ}が{遅|おく}れています。', '{事故|じこ}があったため、{道路|どうろ}が{渋滞|じゅうたい}しています。'],
          ro: ['Ooyuki no tame, densha ga okurete imasu.', 'Jiko ga atta tame, douro ga juutai shite imasu.'],
          bang: { head: ['Loại từ', '＋ ため'], rows: [['N', '{大雪|おおゆき}**の**ため'], ['ナA', '{不便|ふべん}**な**ため'], ['イA', '{高|たか}い**ため**'], ['V', 'あった**ため**']] },
          ghi: 'Nối y như せいで. Khác ở THÁI ĐỘ: ため không trách, không khen — chỉ báo tin. Văn viết, thông báo, email công việc.',
        },
        {
          tieuDe: '④ ため MỤC ĐÍCH ↔ ため NGUYÊN NHÂN',
          anh: ['books', 'cloud-with-rain'],
          nhan: ['{目的|もくてき}', '{原因|げんいん}'],
          dong: ['{合格|ごうかく}するために、{勉強|べんきょう}しています。（Bài 21 — để）', '{雨|あめ}が{降|ふ}ったため、{試合|しあい}が{中止|ちゅうし}になった。（Bài 27 — do）'],
          ro: ['Goukaku suru tame ni, benkyou shite imasu.', 'Ame ga futta tame, shiai ga chuushi ni natta.'],
          hoi: '「よく{勉強|べんきょう}したため、{合格|ごうかく}できた」の「ため」はどちら？',
          dap: '**Nguyên nhân** — Vた + vế sau là kết quả (合格できた).',
          ghi: 'Mẹo: V辞書形 chủ ý + việc mình làm → mục đích. Vた／Vない／tính từ + kết quả → nguyên nhân.',
        },
        {
          tieuDe: '④ ～のは～ためだ — "… là do …"',
          anh: ['train', 'warning'],
          nhan: ['{遅|おく}れ', '{原因|げんいん}'],
          dong: ['{電車|でんしゃ}が{遅|おく}れたのは、{信号|しんごう}が{故障|こしょう}したためです。'],
          ro: ['Densha ga okureta no wa, shingou ga koshou shita tame desu.'],
          hoi: 'どうして{野菜|やさい}が{高|たか}いのですか。（{天候|てんこう}が{悪|わる}かった）',
          dap: '{野菜|やさい}が{高|たか}いのは、{天候|てんこう}が{悪|わる}かったためです。',
          ghi: 'Câu kiểu bài báo — đề đọc hiểu "どうして" gần như luôn có đáp án ở câu ～ためだ.',
        },
        {
          tieuDe: '⑤ ～によって／～により — "do…" (tin tức)',
          anh: ['cyclone', 'derelict-house'],
          nhan: ['{台風|たいふう}', '{被害|ひがい}'],
          dong: ['{台風|たいふう}によって、{多|おお}くの{家|いえ}が{壊|こわ}れました。', '{信号|しんごう}の{故障|こしょう}により、{電車|でんしゃ}が{遅|おく}れています。'],
          ro: ['Taifuu ni yotte, ooku no ie ga kowaremashita.', 'Shingou no koshou ni yori, densha ga okurete imasu.'],
          hoi: '「{雨|あめ}が{降|ふ}ったによって」は{正|ただ}しいですか。',
          dap: 'Không. によって CHỈ sau danh từ: {雨|あめ}によって. Câu → {雨|あめ}が{降|ふ}ったため.',
          ghi: 'により = によって, văn viết hơn nữa (báo giấy, loa ga). Chuyện nhỏ riêng tư không dùng によって.',
        },
        {
          tieuDe: '⑤ N1 による N2',
          anh: ['house', 'automobile'],
          nhan: ['{地震|じしん}', '{渋滞|じゅうたい}'],
          dong: ['{地震|じしん}による{被害|ひがい}', '{事故|じこ}による{渋滞|じゅうたい}', '{台風|たいふう}による{停電|ていでん}'],
          ro: ['jishin ni yoru higai', 'jiko ni yoru juutai', 'taifuu ni yoru teiden'],
          hoi: '{地震|じしん}（　）{被害|ひがい}は{大|おお}きかった。によって？による？',
          dap: '**による** — đứng trước danh từ {被害|ひがい}.',
          ghi: 'によって ＋ động từ／câu; による ＋ danh từ. Giống ～ための N / ～ために V ở Bài 21.',
        },
        {
          tieuDe: 'Bảng phân biệt — chọn trong 3 giây',
          bang: {
            head: ['Mẫu', 'Vế sau', 'Văn phong', 'Rủ / nhờ?'],
            rows: [
              ['せいで', 'xấu', 'trách', '✗'],
              ['おかげで', 'tốt', 'biết ơn', '✗'],
              ['ため', 'sự thật', 'thông báo, văn viết', '△'],
              ['によって', 'kết quả lớn', 'tin tức (chỉ sau N)', '✗'],
              ['から・ので', 'gì cũng được', 'hội thoại', '○'],
              ['N で', 'kết quả', 'văn nói ngắn', '✗'],
            ],
          },
          ghi: 'Quy trình: ① vế sau là rủ / nhờ? → から／ので. ② chuyện tốt hay xấu + có cảm xúc? → おかげで／せいで. ③ thông báo, tin tức? → ため／によって.',
        },
        {
          tieuDe: '{会話|かいわ}③ — ひまわり{食堂|しょくどう}',
          anh: ['man-cook', 'leafy-green', 'chart-increasing'],
          nhan: ['{小林店長|こばやしてんちょう}', '{野菜|やさい}', '{値上|ねあ}がり'],
          dong: ['{天候|てんこう}が{悪|わる}かったため、{野菜|やさい}が{値上|ねあ}がりしているんだよ。', 'お{客|きゃく}さんが{少|すく}ないのは、{雨|あめ}のせいだと{思|おも}う。', '{雑誌|ざっし}に{紹介|しょうかい}されたおかげだね。'],
          ro: ['Tenkou ga warukatta tame, yasai ga neagari shite iru n da yo.', 'Okyaku-san ga sukunai no wa, ame no sei da to omou.', 'Zasshi ni shoukai sareta okage da ne.'],
          hoi: '{店長|てんちょう}はどうして「ナタポンくんのおかげで」と{言|い}ったのですか。',
          dap: 'Đùa — mỉa mai: ナタポン làm vỡ đĩa (chuyện xấu). Nghĩa thật là せいで.',
          ghi: 'Đọc theo vai (店長 — ナタポン — リン). Chú ý vì sao anh chủ dùng ため: anh đang nhắc lại nội dung bản tin.',
        },
        {
          tieuDe: 'チャレンジ — {駅員|えきいん}になってみよう',
          anh: ['loudspeaker', 'station'],
          nhan: ['{放送|ほうそう}', '{駅|えき}'],
          dong: ['{皆様|みなさま}にお{知|し}らせいたします。', '（{大雪|おおゆき}／{強風|きょうふう}／{信号|しんごう}の{故障|こしょう}）のため、', 'ただいま、（{電車|でんしゃ}が{遅|おく}れて／{運転|うんてん}を{見合|みあ}わせて）おります。', 'ご{迷惑|めいわく}をおかけして、{申|もう}し{訳|わけ}ございません。'],
          ro: ['Minasama ni oshirase itashimasu.', '(Ooyuki / kyoufuu / shingou no koshou) no tame,', 'tadaima, (densha ga okurete / unten o miawasete) orimasu.', 'Gomeiwaku o okake shite, moushiwake gozaimasen.'],
          ghi: 'Từng người lên đọc thông báo với một nguyên nhân khác. Người nghe hỏi lại bằng văn nói: 「えっ、どうして{止|と}まってるの？」→ 「{大雪|おおゆき}のせいだって。」 — đổi giọng thông báo ↔ giọng bạn bè.',
        },
        {
          tieuDe: 'まとめ — Buổi 2',
          bang: {
            head: ['Mẫu', 'Đứng trước', 'Ví dụ'],
            rows: [
              ['～ため', 'Nの・ナAな・イA・V普通形', '{大雨|おおあめ}のため{運休|うんきゅう}'],
              ['～のは～ためだ', 'câu', '{遅|おく}れたのは{故障|こしょう}のためだ'],
              ['～によって／により', 'N', '{台風|たいふう}によって{壊|こわ}れた'],
              ['N による N', 'N', '{地震|じしん}による{被害|ひがい}'],
            ],
          },
          ghi: 'Bài về nhà: viết 3 câu thông báo (～のため、～) và 2 câu tin tức (～による～). Buổi sau: によって còn ba nghĩa — cách thức, tuỳ theo, tác nhân bị động.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Ôn bài cũ: せいで・おかげで' },
    {
      t: 'p',
      text: 'Giáo viên mở băng loa ở ga (giả lập): 「{大雪|おおゆき}のため、{電車|でんしゃ}が{遅|おく}れております」. "Tại sao nhân viên ga không nói 「{大雪|おおゆき}のせいで」? — Vì せいで có ý **trách**, mà nhà ga thì phải **báo tin khách quan, lịch sự**. Hôm nay ta học giọng nói đó: **ため** và **によって**."',
    },
    {
      t: 'mcq',
      id: 'b27-b2-khoi-dong',
      title: 'Ôn bài cũ + khởi động (4 câu)',
      items: [
        { q: '{友達|ともだち}が{起|お}こしてくれた（　）、{遅刻|ちこく}しなかった。', options: ['せいで', 'おかげで', 'せいか', 'のに'], correct: 1, why: 'Người giúp + kết quả tốt → **おかげで** (Buổi 1).' },
        { q: '{隣|となり}の{工事|こうじ}の{音|おと}の（　）、{勉強|べんきょう}できない。', options: ['せいで', 'おかげで', 'について', 'によって'], correct: 0, why: 'Chuyện xấu + bực → **せいで** (Buổi 1).' },
        { q: '{留学|りゅうがく}する（　）、アルバイトでお{金|かね}を{貯|た}めています。', options: ['せいで', 'ために', 'おかげで', 'によって'], correct: 1, why: 'Mục đích (V辞書形 chủ ý + việc mình làm) → **ために** (Bài 21). Hôm nay so với ため nguyên nhân.' },
        { q: '「{雪|ゆき}のため、{電車|でんしゃ}が{遅|おく}れております。」これは{誰|だれ}の{言葉|ことば}ですか。', options: ['{友達|ともだち}', '{駅|えき}のアナウンス', '{家族|かぞく}', '{子|こ}ども'], correct: 1, why: '～のため + ～ております → giọng **thông báo chính thức** (nhân viên ga).' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Từ mới: thông báo ở ga và bản tin kinh tế' },
    {
      t: 'p',
      text: 'Giáo viên dán lên bảng 6 "biển thông báo" (giả lập) — cả lớp đọc to, đoán nghĩa từ mới, rồi giáo viên giải thích.',
    },
    {
      t: 'examples',
      items: [
        E('{大雪|おおゆき}のため、{本日|ほんじつ}の{特急|とっきゅう}は{全|すべ}て{運休|うんきゅう}です。', 'Ooyuki no tame, honjitsu no tokkyuu wa subete unkyuu desu.', 'Do tuyết lớn, toàn bộ tàu tốc hành hôm nay ngừng chạy.'),
        E('{信号|しんごう}の{故障|こしょう}により、{電車|でんしゃ}が{約|やく}15{分|ふん}{遅延|ちえん}しております。', 'Shingou no koshou ni yori, densha ga yaku juugofun chien shite orimasu.', 'Do tín hiệu hỏng, tàu đang chậm khoảng 15 phút.'),
        E('{事故|じこ}による{渋滞|じゅうたい}のため、バスが{遅|おく}れています。', 'Jiko ni yoru juutai no tame, basu ga okurete imasu.', 'Do tắc đường vì tai nạn, xe buýt đang chậm.'),
        E('{午後|ごご}2{時|じ}に{運転|うんてん}を{再開|さいかい}する{予定|よてい}です。', 'Gogo niji ni unten o saikai suru yotei desu.', 'Dự kiến chạy lại lúc 2 giờ chiều.'),
        E('{物価|ぶっか}が{上|あ}がっているため、{生活|せいかつ}が{苦|くる}しいという{人|ひと}が{増|ふ}えています。', 'Bukka ga agatte iru tame, seikatsu ga kurushii to iu hito ga fuete imasu.', 'Do vật giá tăng, số người nói cuộc sống khó khăn đang tăng.'),
        E('{少子化|しょうしか}によって、{働|はたら}く{人|ひと}が{少|すく}なくなっています。', 'Shoushika ni yotte, hataraku hito ga sukunaku natte imasu.', 'Do tỉ lệ sinh giảm, số người lao động đang ít đi.'),
      ],
    },
    { t: 'h', text: 'Slide 3 — ため: mục đích hay nguyên nhân?' },
    {
      t: 'mcq',
      id: 'b27-b2-chon',
      title: 'Phân loại — ため trong câu là MỤC ĐÍCH (để) hay NGUYÊN NHÂN (do)? (8 câu)',
      items: [
        { q: '{日本|にほん}の{会社|かいしゃ}で{働|はたら}くために、{日本語|にほんご}を{勉強|べんきょう}しています。', options: ['Mục đích (để)', 'Nguyên nhân (do)'], correct: 0, why: 'V辞書形 chủ ý (働く) + việc mình làm (勉強する) → **mục đích**.' },
        { q: '{電車|でんしゃ}が{遅|おく}れたため、{会議|かいぎ}に{間|ま}に{合|あ}いませんでした。', options: ['Mục đích (để)', 'Nguyên nhân (do)'], correct: 1, why: 'Vた + kết quả → **nguyên nhân**.' },
        { q: '{家族|かぞく}のために、{毎日|まいにち}{料理|りょうり}を{作|つく}ります。', options: ['Mục đích (để)', 'Nguyên nhân (do)'], correct: 0, why: 'Người + のために = vì LỢI ÍCH của gia đình → **mục đích**.' },
        { q: '{台風|たいふう}のため、{学校|がっこう}が{休|やす}みになりました。', options: ['Mục đích (để)', 'Nguyên nhân (do)'], correct: 1, why: 'Hiện tượng (台風) + kết quả → **nguyên nhân**.' },
        { q: '{道|みち}が{狭|せま}いため、{大|おお}きい{車|くるま}は{通|とお}れません。', options: ['Mục đích (để)', 'Nguyên nhân (do)'], correct: 1, why: 'イA + ため → luôn là **nguyên nhân** (tính từ không thể là mục đích).' },
        { q: '{健康|けんこう}のために、{毎朝|まいあさ}{走|はし}っています。', options: ['Mục đích (để)', 'Nguyên nhân (do)'], correct: 0, why: '"Vì sức khoẻ" = để giữ sức khoẻ → **mục đích** (Bài 21).' },
        { q: '{雪|ゆき}が{降|ふ}らないため、スキー{場|じょう}が{困|こま}っています。', options: ['Mục đích (để)', 'Nguyên nhân (do)'], correct: 1, why: 'Vない + ため + kết quả → **nguyên nhân** (mục đích phủ định phải dùng ように).' },
        { q: '{安全|あんぜん}を{確認|かくにん}するため、{電車|でんしゃ}を{止|と}めています。', options: ['Mục đích (để)', 'Nguyên nhân (do)'], correct: 0, why: 'V辞書形 chủ ý (確認する) + việc nhà ga cố ý làm (止めている — tha động từ) → **mục đích**: dừng tàu ĐỂ kiểm tra an toàn. Bẫy hay gặp trong bản tin.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b27-b2-noi',
      title: 'Viết thông báo — dịch Việt → Nhật bằng ～ため／～によって (6 câu)',
      kind: 'translate',
      grammar: 'N の ため · V た ため · N によって／により · N1 による N2',
      items: [
        { q: 'Do mưa lớn, tàu đang ngừng chạy.', answers: V('{大雨|おおあめ}のため、{電車|でんしゃ}が{運休|うんきゅう}しています。', '{大雨|おおあめ}のため、{電車|でんしゃ}は{運休|うんきゅう}です。', '{大雨|おおあめ}のため、{電車|でんしゃ}が{止|と}まっています。'), hint: 'おおあめの ため' },
        { q: 'Do có tai nạn, đường đang tắc.', answers: V('{事故|じこ}があったため、{道路|どうろ}が{渋滞|じゅうたい}しています。', '{事故|じこ}のため、{道路|どうろ}が{渋滞|じゅうたい}しています。'), hint: 'じこが あった ため' },
        { q: 'Do đang thi công, cấm lưu thông.', answers: V('{工事中|こうじちゅう}のため、{通行止|つうこうど}めです。', '{工事|こうじ}のため、{通行止|つうこうど}めです。'), hint: 'こうじちゅうの ため' },
        { q: 'Do tuyết lớn, đường cao tốc bị cấm lưu thông.', answers: V('{大雪|おおゆき}によって、{高速道路|こうそくどうろ}が{通行止|つうこうど}めになりました。', '{大雪|おおゆき}により、{高速道路|こうそくどうろ}が{通行止|つうこうど}めになりました。', '{大雪|おおゆき}のため、{高速道路|こうそくどうろ}が{通行止|つうこうど}めになりました。'), hint: 'おおゆきに よって' },
        { q: 'Thiệt hại do bão vẫn chưa rõ.', answers: V('{台風|たいふう}による{被害|ひがい}は、まだ{分|わ}かっていません。', '{台風|たいふう}による{被害|ひがい}はまだ{分|わ}かりません。'), hint: 'たいふうに よる ひがい' },
        { q: 'Tàu chậm là do tín hiệu bị hỏng.', answers: V('{電車|でんしゃ}が{遅|おく}れたのは、{信号|しんごう}が{故障|こしょう}したためです。', '{電車|でんしゃ}が{遅|おく}れているのは、{信号|しんごう}の{故障|こしょう}のためです。', '{電車|でんしゃ}が{遅|おく}れたのは、{信号|しんごう}の{故障|こしょう}のためです。'), hint: '…のは … ためです' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**ため = せいで không cảm xúc**: nối giống hệt (Nの・ナAな・イA・V{普通形|ふつうけい}), chỉ khác thái độ. Thông báo, email công việc → ため. Nói với bạn → から／ので／せいで.',
        '**ため mục đích ↔ nguyên nhân**: V辞書形 chủ ý + việc mình làm = để; Vた・Vない・tính từ・hiện tượng + kết quả = do. **イA + ため** luôn là nguyên nhân.',
        '**によって chỉ ăn danh từ**; trước danh từ khác thì đổi thành **による**: {台風|たいふう}による{被害|ひがい}.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 2)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '「{雨|あめ}のため、{中止|ちゅうし}です」を、{友達|ともだち}に{言|い}うように{言|い}ってください。', ro: '"Ame no tame, chuushi desu" o, tomodachi ni iu you ni itte kudasai.', vi: 'Em nói câu "Ame no tame, chuushi desu" theo kiểu nói với bạn bè đi.' },
        { who: 'Bạn', role: 'candidate', text: '「{雨|あめ}だから、{中止|ちゅうし}だって」とか「{雨|あめ}で{中止|ちゅうし}になったよ」です。', ro: '"Ame da kara, chuushi da tte" toka "Ame de chuushi ni natta yo" desu.', vi: 'Là "Ame da kara, chuushi da tte" hoặc "Ame de chuushi ni natta yo" ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「{勉強|べんきょう}したため」と「{勉強|べんきょう}するために」はどう{違|ちが}いますか。', ro: '"Benkyou shita tame" to "benkyou suru tame ni" wa dou chigaimasu ka.', vi: '"Benkyou shita tame" và "benkyou suru tame ni" khác nhau thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '「{勉強|べんきょう}したため」は{原因|げんいん}で、「{勉強|べんきょう}するために」は{目的|もくてき}です。', ro: '"Benkyou shita tame" wa gen\'in de, "benkyou suru tame ni" wa mokuteki desu.', vi: '"Benkyou shita tame" là nguyên nhân, "benkyou suru tame ni" là mục đích ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「{地震|じしん}」と「{被害|ひがい}」で{一|ひと}つの{言葉|ことば}を{作|つく}ってください。', ro: '"Jishin" to "higai" de hitotsu no kotoba o tsukutte kudasai.', vi: 'Em ghép "jishin" và "higai" thành một cụm.' },
        { who: 'Bạn', role: 'candidate', text: '「{地震|じしん}による{被害|ひがい}」です。', ro: '"Jishin ni yoru higai" desu.', vi: 'Là "jishin ni yoru higai" ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'どうして{駅員|えきいん}は「せいで」を{使|つか}わないのですか。', ro: 'Doushite ekiin wa "sei de" o tsukawanai no desu ka.', vi: 'Vì sao nhân viên ga không dùng "sei de"?' },
        { who: 'Bạn', role: 'candidate', text: '「せいで」は{文句|もんく}を{言|い}っているように{聞|き}こえるからです。{駅員|えきいん}は「ため」を{使|つか}います。', ro: '"Sei de" wa monku o itte iru you ni kikoeru kara desu. Ekiin wa "tame" o tsukaimasu.', vi: 'Vì "sei de" nghe như đang phàn nàn ạ. Nhân viên ga dùng "tame".' },
      ],
    },
    {
      t: 'mcq',
      id: 'b27-b2-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: '{工事中|こうじちゅう}（　）、こちらの{入口|いりぐち}は{使|つか}えません。', options: ['のため', 'のおかげで', 'によると', 'なため'], correct: 0, why: 'Thông báo + N の ため. ~~なため~~ chỉ cho ナA. 〔Koujichuu no tame…〕' },
        { q: '{台風|たいふう}（　）{停電|ていでん}が、{今|いま}も{続|つづ}いている。', options: ['によって', 'による', 'のおかげの', 'ために'], correct: 1, why: 'Trước danh từ {停電|ていでん} → **による**. 〔Taifuu ni yoru teiden…〕' },
        { q: '{試験|しけん}に{合格|ごうかく}する（　）、{毎日|まいにち}3{時間|じかん}{勉強|べんきょう}している。', options: ['おかげで', 'ために', 'せいで', 'によって'], correct: 1, why: 'Mục đích (V辞書形 chủ ý + việc mình làm) → **ために** (Bài 21). Ba lựa chọn kia đều chỉ nguyên nhân, không hợp với vế sau là việc mình chủ động làm.' },
        { q: '{電車|でんしゃ}が{止|と}まったのは、{線路|せんろ}に{木|き}が{倒|たお}れた（　）です。', options: ['ため', 'おかげ', 'によって', 'ように'], correct: 0, why: '**～のは～ためです** (giải thích nguyên nhân).' },
        { q: '{友達|ともだち}に{言|い}うとき、{一番|いちばん}{自然|しぜん}なのは？', options: ['{大雨|おおあめ}により、{電車|でんしゃ}が{運休|うんきゅう}となっております。', '{大雨|おおあめ}で、{電車|でんしゃ}が{止|と}まってるんだって。', '{大雨|おおあめ}による{電車|でんしゃ}の{運休|うんきゅう}です。', '{大雨|おおあめ}のため、{運転|うんてん}を{見合|みあ}わせております。'], correct: 1, why: 'Với bạn bè → văn nói: **N で + ～んだって**. Ba câu kia là giọng thông báo / bản tin.' },
      ],
    },
  ],
};

const BUOI_3: Lesson = {
  id: 'b27-buoi-3-niyotte',
  kind: 'review',
  title: 'Buổi 3 — Bốn nghĩa của によって: cách thức · tuỳ theo · tác nhân bị động (+ ≠ によると) · từ mới xã hội & cách thức · hội thoại ② · trình bày 1 phút',
  goal: 'Theo nhịp một buổi trên lớp: ôn ため・によって nguyên nhân, học từ nhóm xã hội và nguyên nhân – cách thức – tuỳ theo, dùng ～によって (bằng cách — kể cả Vことによって), ～によって・～によっては (tuỳ theo), (người) によって + bị động / ～による N (tác nhân), nhận ra nghĩa của によって qua vế sau và không nhầm với ～によると; đọc hội thoại ② sau giờ giảng của cô 佐藤, trình bày 1 phút "Một tin tức gần đây" và trả lời 5 câu kiểm tra cuối buổi.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 3 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Ôn bài cũ (5′)** — đọc to 3 thông báo có ～ため／～による của Buổi 2. Câu hỏi mở đầu: "によって ở Buổi 2 là “do”. Còn 「{国|くに}によって{違|ちが}う」 thì “do nước” à?"',
        '**Từ mới (10′)** — nhóm D phần xã hội ({社会|しゃかい}, {政治|せいじ}, {政府|せいふ}, {国民|こくみん}, {住民|じゅうみん}, {環境|かんきょう}, {平和|へいわ}, {戦争|せんそう}) + nhóm E ({起|お}こる, {防|ふせ}ぐ, {種類|しゅるい}, {手段|しゅだん}, {地域|ちいき}, {異|こと}なる, さまざま, {責任|せきにん}, {支|ささ}える, {感謝|かんしゃ}, {寝不足|ねぶそく}, {延期|えんき}, {気|き}のせい).',
        '**Ngữ pháp (20′)** — ⑥ **によって** "bằng cách" + **Vことによって** · ⑦ **によって** "tuỳ theo" + **によっては** · ⑧ **(người) によって ＋ bị động** · bảng **4 nghĩa của によって** nhận ra bằng vế sau · **によって ≠ によると**.',
        '**Hội thoại (8′)** — ② sau giờ giảng "Truyền thông và xã hội": cùng một vụ việc, mỗi nước đưa tin một kiểu.',
        '**できる！ (7′)** — trình bày 1 phút "Một tin tức gần đây khiến tôi chú ý" theo dàn ý 4 phần. Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b27-b3-slides',
      title: 'Bài 27 ニュース — Buổi 3: ～によって（cách thức・tuỳ theo・tác nhân）',
      slides: [
        {
          tieuDe: '{第|だい}27{課|か} ニュース — Buổi 3',
          anh: ['globe-showing-asia-australia', 'rolled-up-newspaper', 'mobile-phone'],
          nhan: ['{国|くに}によって', '{新聞|しんぶん}', 'SNS'],
          dong: ['Hôm nay: によって còn **ba nghĩa nữa** — bằng cách · tuỳ theo · do (ai) làm ra'],
          ro: ['~ni yotte'],
          ghi: 'Buổi 2: によって = do (nguyên nhân). Buổi 3: ba nghĩa còn lại + mẹo nhận ra nghĩa bằng VẾ SAU. Cuối buổi: trình bày 1 phút.',
        },
        {
          tieuDe: 'Ôn bài cũ — ～ため・～による',
          anh: ['loudspeaker', 'derelict-house'],
          nhan: ['{放送|ほうそう}', '{被害|ひがい}'],
          dong: ['{強風|きょうふう}のため、{運転|うんてん}を{見合|みあ}わせています。', '{地震|じしん}による{被害|ひがい}はありません。'],
          ro: ['Kyoufuu no tame, unten o miawasete imasu.', 'Jishin ni yoru higai wa arimasen.'],
          hoi: '「{雨|あめ}が{降|ふ}ったによって」はどこが{間違|まちが}っていますか。',
          dap: 'によって chỉ sau danh từ → {雨|あめ}によって, hoặc {雨|あめ}が{降|ふ}ったため.',
          ghi: 'Giữ ý này cho cả buổi: によって + N. Muốn dùng động từ → こと + によって (slide sau).',
        },
        {
          tieuDe: '{新|あたら}しいことば ① — {社会|しゃかい}',
          anh: ['classical-building', 'deciduous-tree', 'dove', 'older-person'],
          nhan: ['{政治|せいじ}', '{環境|かんきょう}', '{平和|へいわ}', '{高齢化|こうれいか}'],
          dong: ['{政府|せいふ}が{新|あたら}しいルールを{発表|はっぴょう}しました。', '{環境|かんきょう}を{守|まも}りましょう。'],
          ro: ['Seifu ga atarashii ruuru o happyou shimashita.', 'Kankyou o mamorimashou.'],
          hoi: '{国民|こくみん}・{市民|しみん}・{住民|じゅうみん}はどう{違|ちが}いますか。',
          dap: '{国民|こくみん}: dân một nước · {市民|しみん}: dân một thành phố · {住民|じゅうみん}: người sống ở một khu (cả người nước ngoài).',
          ghi: 'Thêm: {社会|しゃかい}, {戦争|せんそう} ↔ {平和|へいわ}. Chữ mới: 政・民・和・戦・争.',
        },
        {
          tieuDe: '{新|あたら}しいことば ② — {種類|しゅるい}・{地域|ちいき}・{手段|しゅだん}',
          anh: ['bento-box', 'world-map', 'bus'],
          nhan: ['{種類|しゅるい}', '{地域|ちいき}', '{手段|しゅだん}'],
          dong: ['この{店|みせ}には30{種類|しゅるい}のお{弁当|べんとう}があります。', '{地域|ちいき}によって、ごみの{出|だ}し{方|かた}が{異|こと}なります。'],
          ro: ['Kono mise ni wa sanjusshurui no obentou ga arimasu.', 'Chiiki ni yotte, gomi no dashikata ga kotonarimasu.'],
          hoi: '「{異|こと}なる」を{話|はな}すときの{言葉|ことば}で{言|い}うと？',
          dap: '**{違|ちが}う**. {異|こと}なる là văn viết.',
          ghi: 'Thêm: さまざま (≈ いろいろ, văn viết), {起|お}こる, {防|ふせ}ぐ, {責任|せきにん}を{取|と}る, {支|ささ}える, {感謝|かんしゃ}する, {延期|えんき} ≠ {中止|ちゅうし}.',
        },
        {
          tieuDe: '⑥ ～によって — "bằng, thông qua…"',
          anh: ['handshake', 'laptop'],
          nhan: ['{話|はな}し{合|あ}い', 'インターネット'],
          dong: ['{話|はな}し{合|あ}いによって、{問題|もんだい}を{解決|かいけつ}しました。', 'インターネットによって、{世界中|せかいじゅう}の{人|ひと}と{話|はな}せます。'],
          ro: ['Hanashiai ni yotte, mondai o kaiketsu shimashita.', 'Intaanetto ni yotte, sekaijuu no hito to hanasemasu.'],
          hoi: '「{箸|はし}によって{食|た}べます」は{自然|しぜん}ですか。',
          dap: 'Không. Dụng cụ đời thường → **{箸|はし}で{食|た}べます**. によって cho cách thức trừu tượng, văn viết.',
          ghi: 'によって (cách thức) = で trang trọng. Vế sau: {解決|かいけつ}する, {分|わ}かる, {決|き}める, できる.',
        },
        {
          tieuDe: '⑥ Vこと ＋ によって',
          anh: ['books', 'open-book'],
          nhan: ['{毎日|まいにち}{書|か}く', '{覚|おぼ}える'],
          dong: ['{毎日|まいにち}{書|か}くことによって、{漢字|かんじ}を{覚|おぼ}えました。', '{手|て}を{洗|あら}うことによって、{病気|びょうき}を{防|ふせ}ぐことができます。'],
          ro: ['Mainichi kaku koto ni yotte, kanji o oboemashita.', 'Te o arau koto ni yotte, byouki o fusegu koto ga dekimasu.'],
          hoi: 'どうやって{日本語|にほんご}が{上手|じょうず}になりましたか。「ことによって」で{答|こた}えてください。',
          dap: '（{例|れい}）{毎日|まいにち}{日本人|にほんじん}と{話|はな}すことによって、{上手|じょうず}になりました。',
          ghi: 'Không bỏ こと: ~~{書|か}くによって~~. Câu kiểu bài luận N3 — dùng ở đoạn ý kiến.',
        },
        {
          tieuDe: '⑦ ～によって — "tuỳ theo… mà khác"',
          anh: ['globe-showing-asia-australia', 'spiral-calendar'],
          nhan: ['{国|くに}', '{季節|きせつ}'],
          dong: ['{国|くに}によって、{習慣|しゅうかん}が{違|ちが}います。', '{季節|きせつ}によって、{景色|けしき}が{変|か}わります。'],
          ro: ['Kuni ni yotte, shuukan ga chigaimasu.', 'Kisetsu ni yotte, keshiki ga kawarimasu.'],
          hoi: '「{国|くに}によって、{習慣|しゅうかん}は{同|おな}じです」は{正|ただ}しいですか。',
          dap: 'Không. Vế sau phải là **khác / thay đổi**. Giống nhau → どの{国|くに}でも{同|おな}じです.',
          ghi: 'Dấu hiệu chắc chắn: {違|ちが}う・{異|こと}なる・さまざまだ・{変|か}わる ở cuối câu.',
        },
        {
          tieuDe: '⑦ ～によっては — "tuỳ … thì có khi…"',
          anh: ['cloud-with-rain', 'stop-sign'],
          nhan: ['{天気|てんき}', '{中止|ちゅうし}'],
          dong: ['{天気|てんき}によっては、{試合|しあい}が{中止|ちゅうし}になることもあります。', '{人|ひと}によっては、{納豆|なっとう}が{大好|だいす}きです。'],
          ro: ['Tenki ni yotte wa, shiai ga chuushi ni naru koto mo arimasu.', 'Hito ni yotte wa, nattou ga daisuki desu.'],
          hoi: 'によって と によっては の{違|ちが}いは？',
          dap: 'によって: nói chung "mỗi … mỗi khác". によっては: chỉ MỘT SỐ trường hợp — hay đi với ～こともある／～人もいる.',
          ghi: 'Câu hỏi lồng + によって: どの{大学|だいがく}を{選|えら}ぶかによって、{将来|しょうらい}が{変|か}わる.',
        },
        {
          tieuDe: '⑧ (người) によって ＋ bị động',
          anh: ['books', 'microscope'],
          nhan: ['{書|か}かれた', '{発見|はっけん}された'],
          dong: ['『{源氏物語|げんじものがたり}』は{紫式部|むらさきしきぶ}によって{書|か}かれました。', 'ペニシリンはフレミングによって{発見|はっけん}されました。'],
          ro: ['Genji monogatari wa Murasaki Shikibu ni yotte kakaremashita.', 'Penishirin wa Furemingu ni yotte hakken saremashita.'],
          hoi: '「{先生|せんせい}によって{褒|ほ}められた」は{正|ただ}しいですか。',
          dap: 'Không. Người tác động lên người → **{先生|せんせい}に{褒|ほ}められた** (Bài 22). によって cho người TẠO RA thứ gì đó.',
          ghi: 'Dạng bổ nghĩa: {画家|がか}による{作品|さくひん}, {専門家|せんもんか}による{調査|ちょうさ}.',
        },
        {
          tieuDe: 'によって — 4 nghĩa, nhìn VẾ SAU',
          bang: {
            head: ['Nghĩa', 'Vế sau', 'Ví dụ'],
            rows: [
              ['⑤ do (nguyên nhân)', 'hư hại, thay đổi lớn', '{台風|たいふう}によって{家|いえ}が{壊|こわ}れた'],
              ['⑥ bằng (cách thức)', 'làm được, giải quyết', '{話|はな}し{合|あ}いによって{解決|かいけつ}した'],
              ['⑦ tuỳ theo', 'khác nhau, thay đổi', '{国|くに}によって{違|ちが}う'],
              ['⑧ do (ai) làm ra', 'động từ bị động', '{紫式部|むらさきしきぶ}によって{書|か}かれた'],
            ],
          },
          ghi: 'Đề N3 không hỏi "đây là nghĩa mấy" — nhưng hỏi chọn によって／によると／による đúng chỗ. Hiểu 4 nghĩa là không bị lừa.',
        },
        {
          tieuDe: 'によって ≠ によると',
          anh: ['television', 'globe-showing-asia-australia'],
          nhan: ['ニュースによると', '{国|くに}によって'],
          dong: ['ニュースによると、{明日|あした}は{雪|ゆき}が{降|ふ}るそうです。', '{国|くに}によって、ニュースの{伝|つた}え{方|かた}が{違|ちが}います。'],
          ro: ['Nyuusu ni yoru to, ashita wa yuki ga furu sou desu.', 'Kuni ni yotte, nyuusu no tsutaekata ga chigaimasu.'],
          hoi: '{天気予報|てんきよほう}（　）、{明日|あした}は{晴|は}れるそうです。',
          dap: '**によると** — nguồn tin + ～そうです (Bài 20).',
          ghi: 'によると luôn kéo theo ～そうだ／～ということだ ở cuối câu. Thấy そうだ là nghĩ ngay đến によると.',
        },
        {
          tieuDe: '{会話|かいわ}② — {講義|こうぎ}のあとで',
          anh: ['woman-teacher', 'man-student', 'woman-student'],
          nhan: ['{佐藤先生|さとうせんせい}', 'カルロス', 'リン'],
          dong: ['{国|くに}によって{報道|ほうどう}の{仕方|しかた}が{違|ちが}う。', 'SNSによって{広|ひろ}がることが{多|おお}いです。', '{記者|きしゃ}によって{書|か}かれたものです。'],
          ro: ['Kuni ni yotte houdou no shikata ga chigau.', 'SNS ni yotte hirogaru koto ga ooi desu.', 'Kisha ni yotte kakareta mono desu.'],
          hoi: 'この{会話|かいわ}に、によって の{意味|いみ}はいくつありますか。',
          dap: 'Bốn: tuỳ theo (国によって), cách thức (SNSによって), tác nhân (記者によって), nguyên nhân (地震による被害).',
          ghi: 'Đọc theo vai (佐藤先生 — カルロス — リン). Mỗi lần gặp によって, cả lớp giơ 4 ngón tay ứng với nghĩa ⑤⑥⑦⑧.',
        },
        {
          tieuDe: 'できる！ — 1{分|ぷん}スピーチ「{最近|さいきん}{気|き}になったニュース」',
          anh: ['studio-microphone', 'rolled-up-newspaper'],
          nhan: ['スピーチ', 'ニュース'],
          dong: ['① {最近|さいきん}、～というニュースを{見|み}ました。', '② ニュースによると、～ため、～そうです。', '③ ～のせいで／～おかげで、～。', '④ ～は{国|くに}によって{違|ちが}いますが、～と{思|おも}います。'],
          ro: ['Saikin, ~ to iu nyuusu o mimashita.', 'Nyuusu ni yoru to, ~ tame, ~ sou desu.', '~ no sei de / ~ okage de, ~.', '~ wa kuni ni yotte chigaimasu ga, ~ to omoimasu.'],
          ghi: 'Chuẩn bị 2 phút, nói 1 phút. Bạn nghe ghi lại: dùng mấy mẫu? có nhầm によって／によると không? Bài mẫu ở mục Nói.',
        },
        {
          tieuDe: 'まとめ — Bài 27',
          bang: {
            head: ['Mẫu', 'Nghĩa', 'Ví dụ'],
            rows: [
              ['せいで／せいか／おかげで', 'tại / chắc tại / nhờ', '{雨|あめ}のせいで・{年|とし}のせいか・{君|きみ}のおかげで'],
              ['ため', 'do (thông báo)', '{大雨|おおあめ}のため{運休|うんきゅう}'],
              ['によって・による', 'do (tin tức)', '{地震|じしん}による{被害|ひがい}'],
              ['によって', 'bằng cách', '{話|はな}し{合|あ}いによって'],
              ['によって（は）', 'tuỳ theo', '{国|くに}によって{違|ちが}う'],
              ['によって + bị động', 'do (ai) làm ra', '{記者|きしゃ}によって{書|か}かれた'],
            ],
          },
          ghi: 'Về nhà: làm mục 9 Bài tập + Luyện thêm 4 (phân biệt). Viết bài văn 300 chữ ở mục Viết. Bài 28: ～くせに, ～ものの, ～にもかかわらず, ～に対して.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Ôn bài cũ: によって nguyên nhân' },
    {
      t: 'p',
      text: 'Giáo viên viết lên bảng hai câu: 「{台風|たいふう}によって{家|いえ}が{壊|こわ}れた」 và 「{国|くに}によって{習慣|しゅうかん}が{違|ちが}う」. "Câu thứ hai có phải là \'do nước mà phong tục khác\' không? — Không hẳn. Nhìn vế sau: **{違|ちが}う**. Đây là nghĩa khác: **tuỳ theo**. Hôm nay ta học cách nhận ra nghĩa của によって chỉ bằng vế sau."',
    },
    {
      t: 'mcq',
      id: 'b27-b3-khoi-dong',
      title: 'Ôn bài cũ (4 câu)',
      items: [
        { q: '{大雪|おおゆき}（　）、{高速道路|こうそくどうろ}が{通行止|つうこうど}めになった。', options: ['によって', 'によると', 'のおかげで', 'による'], correct: 0, why: 'Nguyên nhân, giữa câu → **によって** (Buổi 2).' },
        { q: '{事故|じこ}（　）{渋滞|じゅうたい}が{続|つづ}いている。', options: ['によって', 'による', 'によると', 'のおかげで'], correct: 1, why: 'Trước danh từ → **による** (Buổi 2).' },
        { q: '{本日|ほんじつ}は{祝日|しゅくじつ}（　）、お{休|やす}みです。', options: ['のため', 'のせいで', 'のおかげで', 'によると'], correct: 0, why: 'Thông báo → **のため** (Buổi 2).' },
        { q: '{雨|あめ}が{降|ふ}った（　）、{試合|しあい}が{中止|ちゅうし}になった。', options: ['によって', 'ため', 'による', 'によると'], correct: 1, why: 'Sau động từ → **ため** (によって chỉ sau danh từ).' },
      ],
    },
    { t: 'h', text: 'Slide 2 — によって: nghĩa nào? (nhìn vế sau)' },
    {
      t: 'mcq',
      id: 'b27-b3-imi',
      title: 'Nhận ra nghĩa của によって (8 câu)',
      items: [
        { q: '{地震|じしん}によって、{古|ふる}い{建物|たてもの}が{壊|こわ}れた。', options: ['⑤ do (nguyên nhân)', '⑥ bằng (cách thức)', '⑦ tuỳ theo', '⑧ do (ai) làm ra'], correct: 0, why: 'Vế sau là hư hại → **nguyên nhân**.' },
        { q: '{話|はな}し{合|あ}いによって、クラスのルールを{決|き}めた。', options: ['⑤ do (nguyên nhân)', '⑥ bằng (cách thức)', '⑦ tuỳ theo', '⑧ do (ai) làm ra'], correct: 1, why: 'Vế sau là "quyết định được" bằng thảo luận → **cách thức**.' },
        { q: '{人|ひと}によって、{好|す}きな{食|た}べ{物|もの}は{違|ちが}う。', options: ['⑤ do (nguyên nhân)', '⑥ bằng (cách thức)', '⑦ tuỳ theo', '⑧ do (ai) làm ra'], correct: 2, why: 'Vế sau là {違|ちが}う → **tuỳ theo**.' },
        { q: 'この{歌|うた}は、{有名|ゆうめい}な{歌手|かしゅ}によって{作|つく}られた。', options: ['⑤ do (nguyên nhân)', '⑥ bằng (cách thức)', '⑦ tuỳ theo', '⑧ do (ai) làm ra'], correct: 3, why: 'Bị động + người tạo ra → **tác nhân**.' },
        { q: '{季節|きせつ}によって、{電車|でんしゃ}の{混|こ}み{方|かた}が{変|か}わる。', options: ['⑤ do (nguyên nhân)', '⑥ bằng (cách thức)', '⑦ tuỳ theo', '⑧ do (ai) làm ra'], correct: 2, why: 'Vế sau là {変|か}わる → **tuỳ theo**.' },
        { q: '{毎日|まいにち}{練習|れんしゅう}することによって、{上手|じょうず}になった。', options: ['⑤ do (nguyên nhân)', '⑥ bằng (cách thức)', '⑦ tuỳ theo', '⑧ do (ai) làm ra'], correct: 1, why: 'Vこと＋によって + đạt được → **cách thức**.' },
        { q: '{大雨|おおあめ}によって、{川|かわ}があふれた。', options: ['⑤ do (nguyên nhân)', '⑥ bằng (cách thức)', '⑦ tuỳ theo', '⑧ do (ai) làm ra'], correct: 0, why: 'Hiện tượng tự nhiên + thiệt hại → **nguyên nhân**.' },
        { q: '{新|あたら}しい{法律|ほうりつ}は、{国会|こっかい}によって{決|き}められた。', options: ['⑤ do (nguyên nhân)', '⑥ bằng (cách thức)', '⑦ tuỳ theo', '⑧ do (ai) làm ra'], correct: 3, why: 'Bị động + cơ quan thực hiện → **tác nhân**. {国会|こっかい} = quốc hội (N2).' },
      ],
    },
    {
      t: 'quiz',
      id: 'b27-b3-noi',
      title: 'Nói thành câu — dịch nhanh Việt → Nhật rồi đọc to (6 câu)',
      kind: 'translate',
      grammar: 'N によって (cách thức) · Vことによって · N によって違う · N によっては · N(người) によって V(ら)れる',
      items: [
        { q: 'Đã giải quyết vấn đề bằng thảo luận.', answers: V('{話|はな}し{合|あ}いによって、{問題|もんだい}を{解決|かいけつ}しました。', '{話|はな}し{合|あ}いによって{問題|もんだい}を{解決|かいけつ}した。'), hint: 'はなしあいに よって' },
        { q: 'Bằng việc nghe tin mỗi ngày, tôi đã nghe được.', answers: V('{毎日|まいにち}ニュースを{聞|き}くことによって、{聞|き}き{取|と}れるようになりました。', '{毎日|まいにち}ニュースを{聞|き}くことによって、{分|わ}かるようになりました。'), hint: 'きく ことに よって' },
        { q: 'Tuỳ khu vực mà cách đổ rác khác nhau.', answers: V('{地域|ちいき}によって、ごみの{出|だ}し{方|かた}が{違|ちが}います。', '{地域|ちいき}によって、ごみの{出|だ}し{方|かた}が{異|こと}なります。', '{地域|ちいき}によってごみの{出|だ}し{方|かた}が{違|ちが}う。'), hint: 'ちいきに よって' },
        { q: 'Tuỳ thời tiết, có khi chuyến tham quan bị huỷ.', answers: V('{天気|てんき}によっては、ツアーが{中止|ちゅうし}になることもあります。', '{天気|てんき}によっては、{見学|けんがく}が{中止|ちゅうし}になることもあります。'), hint: 'てんきに よっては … ことも あります' },
        { q: 'Bài báo này do một phóng viên trẻ viết.', answers: V('この{記事|きじ}は、{若|わか}い{記者|きしゃ}によって{書|か}かれました。', 'この{記事|きじ}は{若|わか}い{記者|きしゃ}によって{書|か}かれた。'), hint: 'きしゃに よって かかれました' },
        { q: 'Theo dự báo thời tiết, nghe nói mai có tuyết.', answers: V('{天気予報|てんきよほう}によると、{明日|あした}は{雪|ゆき}が{降|ふ}るそうです。', '{天気予報|てんきよほう}によると、{明日|あした}は{雪|ゆき}だそうです。'), hint: 'によると … そうです (Bài 20)' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**Nhìn vế sau để biết nghĩa của によって**: hư hại → do; làm được → bằng cách; khác nhau → tuỳ theo; bị động → do (ai) làm ra.',
        '**によって (cách thức) là văn viết** — dụng cụ đời thường dùng で ({箸|はし}で, バスで). によって (tuỳ theo) thì dùng được cả khi nói.',
        '**によると** = nguồn tin + そうだ. Đây là bẫy số một của nhóm によって trong đề N3.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 3)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{日本|にほん}とベトナムで{違|ちが}うことを、「によって」を{使|つか}って{言|い}ってください。', ro: 'Nihon to Betonamu de chigau koto o, "ni yotte" o tsukatte itte kudasai.', vi: 'Em nói một điều khác nhau giữa Nhật và Việt Nam, dùng "ni yotte".' },
        { who: 'Bạn', role: 'candidate', text: '{国|くに}によって、{正月|しょうがつ}の{時期|じき}が{違|ちが}います。{日本|にほん}は1{月|がつ}1{日|にち}ですが、ベトナムは{旧暦|きゅうれき}の{正月|しょうがつ}です。', ro: 'Kuni ni yotte, shougatsu no jiki ga chigaimasu. Nihon wa ichigatsu tsuitachi desu ga, Betonamu wa kyuureki no shougatsu desu.', vi: 'Tuỳ nước mà thời điểm Tết khác nhau. Nhật là ngày 1 tháng 1, còn Việt Nam là Tết âm lịch ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'どうやって{漢字|かんじ}を{覚|おぼ}えていますか。', ro: 'Dou yatte kanji o oboete imasu ka.', vi: 'Em nhớ chữ Hán bằng cách nào?' },
        { who: 'Bạn', role: 'candidate', text: '{言葉|ことば}と{一緒|いっしょ}に{書|か}くことによって、{覚|おぼ}えています。', ro: 'Kotoba to issho ni kaku koto ni yotte, oboete imasu.', vi: 'Em nhớ bằng cách viết chữ cùng với từ ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '『{坊|ぼ}っちゃん』は{誰|だれ}によって{書|か}かれましたか。', ro: '"Botchan" wa dare ni yotte kakaremashita ka.', vi: '"Cậu ấm" do ai viết?' },
        { who: 'Bạn', role: 'candidate', text: '{夏目漱石|なつめそうせき}によって{書|か}かれました。', ro: 'Natsume Souseki ni yotte kakaremashita.', vi: 'Do Natsume Soseki viết ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「ニュースによって、{明日|あした}は{雨|あめ}だそうです」は{正|ただ}しいですか。', ro: '"Nyuusu ni yotte, ashita wa ame da sou desu" wa tadashii desu ka.', vi: '"Nyuusu ni yotte, ashita wa ame da sou desu" có đúng không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ。{情報|じょうほう}の{出所|でどころ}ですから、「ニュースによると」です。', ro: 'Iie. Jouhou no dedokoro desu kara, "nyuusu ni yoru to" desu.', vi: 'Không ạ. Vì là nguồn của thông tin nên phải là "nyuusu ni yoru to".' },
      ],
    },
    {
      t: 'mcq',
      id: 'b27-b3-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: '{子|こ}どもの{遊|あそ}び{方|かた}は、{時代|じだい}（　）{変|か}わってきた。', options: ['によって', 'によると', 'のせいで', 'のおかげで'], correct: 0, why: 'Vế sau là "thay đổi" → **によって** tuỳ theo. {時代|じだい} = thời đại (N3).' },
        { q: '{薬|くすり}（　）、この{病気|びょうき}は{治|なお}せるようになった。', options: ['によると', 'によって', 'のせいか', 'による'], correct: 1, why: 'Cách thức / phương tiện → **によって**.' },
        { q: '{店|みせ}（　）、{日曜日|にちようび}に{休|やす}むところもある。', options: ['によって', 'によっては', 'によると', 'による'], correct: 1, why: '"Có những cửa hàng…" + ～ところもある → **によっては**.' },
        { q: 'この{絵|え}は、ゴッホ（　）{描|か}かれた。', options: ['に', 'によって', 'によると', 'から'], correct: 1, why: 'Người tạo ra tác phẩm + bị động → **によって**.' },
        { q: '{新聞|しんぶん}（　）、{来年|らいねん}から{消費税|しょうひぜい}が{変|か}わるそうだ。', options: ['によって', 'による', 'によると', 'のため'], correct: 2, why: 'Nguồn tin + そうだ → **によると**.' },
      ],
    },
  ],
};

/* ═══════════════════════ ③ LUYỆN THÊM DỄ → KHÓ ═══════════════════════ */

type Mcq = Extract<Block, { t: 'mcq' }>['items'][number];

/** Bộ từ cho trắc nghiệm Nhật → Việt / Việt → Nhật (lấy đúng 65 từ của mục Từ vựng; nghĩa không trùng nhau). */
const TU_LT: [w: string, ro: string, vi: string][] = [
  ['{報道|ほうどう}します', 'houdou shimasu', 'đưa tin (báo chí)'],
  ['{速報|そくほう}', 'sokuhou', 'tin nhanh, tin khẩn'],
  ['{記者|きしゃ}', 'kisha', 'phóng viên'],
  ['{放送|ほうそう}します', 'housou shimasu', 'phát sóng'],
  ['アナウンサー', 'anaunsaa', 'phát thanh viên'],
  ['{事件|じけん}', 'jiken', 'vụ án, vụ việc (có người gây ra)'],
  ['{発生|はっせい}します', 'hassei shimasu', 'phát sinh, xảy ra (văn tin tức)'],
  ['{状況|じょうきょう}', 'joukyou', 'tình hình'],
  ['{原因|げんいん}', "gen'in", 'nguyên nhân'],
  ['{影響|えいきょう}', 'eikyou', 'ảnh hưởng'],
  ['{調査|ちょうさ}します', 'chousa shimasu', 'điều tra, khảo sát'],
  ['{記録|きろく}', 'kiroku', 'kỷ lục; sự ghi chép'],
  ['{全国|ぜんこく}', 'zenkoku', 'toàn quốc'],
  ['{各地|かくち}', 'kakuchi', 'các nơi'],
  ['{大雨|おおあめ}', 'ooame', 'mưa lớn'],
  ['{大雪|おおゆき}', 'ooyuki', 'tuyết lớn'],
  ['{気温|きおん}', 'kion', 'nhiệt độ không khí'],
  ['{天候|てんこう}', 'tenkou', 'thời tiết (trong một khoảng)'],
  ['{気候|きこう}', 'kikou', 'khí hậu'],
  ['{梅雨|つゆ}', 'tsuyu', 'mùa mưa (tháng 6–7)'],
  ['{警報|けいほう}', 'keihou', 'cảnh báo (thiên tai)'],
  ['{津波|つなみ}', 'tsunami', 'sóng thần'],
  ['{避難|ひなん}します', 'hinan shimasu', 'sơ tán, lánh nạn'],
  ['{災害|さいがい}', 'saigai', 'thiên tai'],
  ['{揺|ゆ}れます', 'yuremasu', 'rung, lắc'],
  ['{激|はげ}しい', 'hageshii', 'dữ dội'],
  ['{渋滞|じゅうたい}します', 'juutai shimasu', 'tắc đường'],
  ['{列車|れっしゃ}', 'ressha', 'đoàn tàu'],
  ['{乗客|じょうきゃく}', 'joukyaku', 'hành khách'],
  ['{道路|どうろ}', 'douro', 'đường xe chạy'],
  ['{線路|せんろ}', 'senro', 'đường ray'],
  ['{通行止|つうこうど}め', 'tsuukoudome', 'cấm lưu thông'],
  ['{運休|うんきゅう}', 'unkyuu', '(tàu xe) ngừng chạy'],
  ['{遅延|ちえん}します', 'chien shimasu', '(tàu) chậm giờ'],
  ['{再開|さいかい}します', 'saikai shimasu', 'chạy lại, mở lại'],
  ['{交通機関|こうつうきかん}', 'koutsuu kikan', 'phương tiện giao thông công cộng'],
  ['{混乱|こんらん}します', 'konran shimasu', 'hỗn loạn'],
  ['{見合|みあ}わせます', 'miawasemasu', 'tạm hoãn, tạm dừng'],
  ['{社会|しゃかい}', 'shakai', 'xã hội'],
  ['{政治|せいじ}', 'seiji', 'chính trị'],
  ['{政府|せいふ}', 'seifu', 'chính phủ'],
  ['{国民|こくみん}', 'kokumin', 'người dân (một nước)'],
  ['{住民|じゅうみん}', 'juumin', 'cư dân (một khu)'],
  ['{物価|ぶっか}', 'bukka', 'vật giá'],
  ['{値上|ねあ}がりします', 'neagari shimasu', '(giá) tăng lên'],
  ['{景気|けいき}', 'keiki', 'tình hình kinh tế'],
  ['{税金|ぜいきん}', 'zeikin', 'tiền thuế'],
  ['{少子化|しょうしか}', 'shoushika', 'tỉ lệ sinh giảm'],
  ['{高齢化|こうれいか}', 'koureika', 'già hoá dân số'],
  ['{環境|かんきょう}', 'kankyou', 'môi trường'],
  ['{平和|へいわ}', 'heiwa', 'hoà bình'],
  ['{戦争|せんそう}', 'sensou', 'chiến tranh'],
  ['{起|お}こります', 'okorimasu', '(sự việc) xảy ra'],
  ['{防|ふせ}ぎます', 'fusegimasu', 'phòng, ngăn chặn'],
  ['{種類|しゅるい}', 'shurui', 'loại, chủng loại'],
  ['{手段|しゅだん}', 'shudan', 'phương tiện, cách (để đạt mục đích)'],
  ['{地域|ちいき}', 'chiiki', 'khu vực, vùng'],
  ['{異|こと}なります', 'kotonarimasu', 'khác nhau (văn viết)'],
  ['さまざま', 'samazama', 'đa dạng, đủ kiểu'],
  ['{責任|せきにん}', 'sekinin', 'trách nhiệm'],
  ['{支|ささ}えます', 'sasaemasu', 'nâng đỡ, hỗ trợ'],
  ['{感謝|かんしゃ}します', 'kansha shimasu', 'biết ơn'],
  ['{寝不足|ねぶそく}', 'nebusoku', 'thiếu ngủ'],
  ['{延期|えんき}します', 'enki shimasu', 'hoãn lại'],
  ['{気|き}のせい', 'ki no sei', 'do tưởng tượng'],
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
  id: 'b27-lt-1-tu-vung',
  kind: 'homework',
  title: 'Luyện thêm 1 · Từ vựng — 🟢 nhận mặt → 🟡 điền câu (50 câu)',
  goal: 'Nhớ chắc 65 từ N3 của Bài 27 theo hai chiều (Nhật → Việt, Việt → Nhật) rồi chọn đúng từ trong câu, kể cả các cặp dễ nhầm (原因・理由, 事件・事故, 天気・天候・気候, 延期・中止・運休, 遅延・渋滞, 混乱・混雑, 国民・住民, 値上がり・値上げ, 手段・方法).',
  minutes: 35,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟢 Mức Dễ** — 20 câu Nhật → Việt và 15 câu Việt → Nhật. Sai câu nào: đọc to từ đó 3 lần (romaji có ngay trong câu hỏi).',
        '**🟡 Mức Vừa** — 15 câu điền từ vào câu, đúng dạng 文脈規定 của đề N3 (4 lựa chọn cùng loại từ — phải hiểu cả câu mới chọn được).',
        'Lỗi hay mắc: {遅刻|ちこく}した~~{原因|げんいん}~~ (→ {理由|りゆう}), {道路|どうろ}が~~{遅延|ちえん}~~する (→ {渋滞|じゅうたい}), {来週|らいしゅう}に~~{中止|ちゅうし}~~する (→ {延期|えんき}), {店|みせ}がランチを~~{値上|ねあ}がり~~した (→ {値上|ねあ}げ), {朝|あさ}の{駅|えき}は~~{混乱|こんらん}~~している (→ {混雑|こんざつ} — đông chứ không loạn), りんごの~~{物価|ぶっか}~~ (→ {値段|ねだん}).',
      ],
    },
    { t: 'h', text: '🟢 Mức 1 — Dễ: nhìn từ → nghĩa; nghe nghĩa → từ' },
    { t: 'mcq', id: 'b27-lt1-nv', title: 'Nhật → Việt (20 câu)', items: MCQ_NV(0, 20) },
    { t: 'mcq', id: 'b27-lt1-vn', title: 'Việt → Nhật (15 câu)', items: MCQ_VN(38, 53) },
    { t: 'h', text: '🟡 Mức 2 — Vừa: chọn từ hợp với câu (文脈規定)' },
    {
      t: 'mcq',
      id: 'b27-lt1-dien',
      title: 'Điền từ vào câu (15 câu)',
      items: [
        { q: 'ニュースによると、{火事|かじ}の（　）はたばこだったそうです。', options: ['{原因|げんいん}', '{理由|りゆう}', '{結果|けっか}', '{手段|しゅだん}'], correct: 0, why: 'Cái gây ra hoả hoạn → **{原因|げんいん}**. 〔Kaji no gen\'in wa tabako datta sou desu.〕' },
        { q: '{今朝|けさ}、{駅|えき}の{近|ちか}くで{交通事故|こうつうじこ}が（　）しました。', options: ['{発生|はっせい}', '{報道|ほうどう}', '{調査|ちょうさ}', '{避難|ひなん}'], correct: 0, why: 'Tai nạn xảy ra (văn tin tức) → **{発生|はっせい}する**.' },
        { q: '{台風|たいふう}のニュースは、{全国|ぜんこく}のテレビで（　）されました。', options: ['{放送|ほうそう}', '{発生|はっせい}', '{避難|ひなん}', '{延期|えんき}'], correct: 0, why: 'Được phát trên ti vi → **{放送|ほうそう}される**.' },
        { q: '{今年|ことし}の{冬|ふゆ}は{寒|さむ}くて、{何度|なんど}も（　）が{降|ふ}りました。', options: ['{大雪|おおゆき}', '{津波|つなみ}', '{梅雨|つゆ}', '{気候|きこう}'], correct: 0, why: 'Mùa đông lạnh + rơi → **{大雪|おおゆき}が{降|ふ}る**.' },
        { q: '{日本|にほん}は6{月|がつ}になると（　）に{入|はい}って、{雨|あめ}の{日|ひ}が{多|おお}くなります。', options: ['{梅雨|つゆ}', '{警報|けいほう}', '{天候|てんこう}', '{災害|さいがい}'], correct: 0, why: 'Tháng 6 vào mùa mưa → **{梅雨|つゆ}に{入|はい}る**.' },
        { q: '{地震|じしん}のとき、{本棚|ほんだな}が{大|おお}きく（　）。', options: ['{揺|ゆ}れました', '{防|ふせ}ぎました', '{支|ささ}えました', '{起|お}こしました'], correct: 0, why: 'Kệ sách rung → **{揺|ゆ}れる**.' },
        { q: '{雪|ゆき}で{道|みち}が{凍|こお}っているため、この{先|さき}は（　）です。', options: ['{通行止|つうこうど}め', '{運休|うんきゅう}', '{遅延|ちえん}', '{休講|きゅうこう}'], correct: 0, why: 'ĐƯỜNG không cho đi → **{通行止|つうこうど}め**. {運休|うんきゅう} dùng cho tàu xe.' },
        { q: '{強|つよ}い{風|かぜ}のため、{今日|きょう}の{飛行機|ひこうき}は{全部|ぜんぶ}（　）になりました。', options: ['{運休|うんきゅう}', '{渋滞|じゅうたい}', '{通行止|つうこうど}め', '{再開|さいかい}'], correct: 0, why: 'Chuyến bay ngừng → **{運休|うんきゅう}**.' },
        { q: '{電車|でんしゃ}が{遅|おく}れたら、{駅|えき}で（　）{証明書|しょうめいしょ}をもらってください。', options: ['{遅延|ちえん}', '{渋滞|じゅうたい}', '{混乱|こんらん}', '{延期|えんき}'], correct: 0, why: 'Giấy chứng nhận tàu trễ = **{遅延証明書|ちえんしょうめいしょ}**.' },
        { q: '{午後|ごご}3{時|じ}に、{電車|でんしゃ}の{運転|うんてん}が（　）されました。', options: ['{再開|さいかい}', '{避難|ひなん}', '{発生|はっせい}', '{報道|ほうどう}'], correct: 0, why: 'Chạy lại → **{運転|うんてん}が{再開|さいかい}される**.' },
        { q: '{東京|とうきょう}は（　）が{高|たか}いので、{家賃|やちん}も{食費|しょくひ}もかかります。', options: ['{物価|ぶっか}', '{値段|ねだん}', '{税金|ぜいきん}', '{景気|けいき}'], correct: 0, why: 'Giá cả CHUNG của một nơi → **{物価|ぶっか}**.' },
        { q: '{来月|らいげつ}から、この{店|みせ}はコーヒーを50{円|えん}（　）するそうです。', options: ['{値上|ねあ}げ', '{値上|ねあ}がり', '{物価|ぶっか}', '{値段|ねだん}'], correct: 0, why: 'Cửa hàng chủ động tăng giá → **{値上|ねあ}げする**.' },
        { q: 'この{国|くに}では（　）が{進|すす}んで、{子|こ}どもの{数|かず}が{減|へ}っています。', options: ['{少子化|しょうしか}', '{高齢化|こうれいか}', '{環境|かんきょう}', '{平和|へいわ}'], correct: 0, why: 'Trẻ em giảm → **{少子化|しょうしか}**. {進|すす}む = tiến triển (N3).' },
        { q: '{会社|かいしゃ}の{失敗|しっぱい}は、{社長|しゃちょう}が（　）を{取|と}るべきだ。', options: ['{責任|せきにん}', '{原因|げんいん}', '{手段|しゅだん}', '{種類|しゅるい}'], correct: 0, why: '**{責任|せきにん}を{取|と}る** (chịu trách nhiệm). ～べきだ = nên (N3).' },
        { q: '{雨|あめ}のため、{遠足|えんそく}は{来週|らいしゅう}の{金曜日|きんようび}に（　）されました。', options: ['{延期|えんき}', '{中止|ちゅうし}', '{運休|うんきゅう}', '{休講|きゅうこう}'], correct: 0, why: 'Có ngày mới → HOÃN = **{延期|えんき}**. {遠足|えんそく} = dã ngoại (N3).' },
      ],
    },
  ],
};

const LT_2: Lesson = {
  id: 'b27-lt-2-han-tu',
  kind: 'homework',
  title: 'Luyện thêm 2 · Chữ Hán — 🟢 đọc → 🟡 chọn chữ → 🔴 chữ giống & đồng âm (28 câu)',
  goal: 'Đọc đúng và viết đúng (chọn chữ) các từ có 20 chữ Hán mới của Bài 27 như đề N3 phần 漢字読み・表記, và không bị lừa bởi chữ trông giống (原・願, 因・困, 影・景, 政・故, 民・氏, 候・侯, 速・早, 路・落, 値・直・植, 法・決, 種・動, 和・利) hay từ đồng âm (気候・記号, 事件・試験, 価格・科学).',
  minutes: 25,
  blocks: [
    { t: 'h', text: '🟢 Mức 1 — Dễ: đọc từ in đậm (漢字読み)' },
    {
      t: 'mcq',
      id: 'b27-lt2-doc',
      title: 'Chọn cách đọc (12 câu)',
      items: [
        { q: '{事故|じこ}の**原因**が{分|わ}かりました。', options: ['げんいん', 'げにん', 'がんいん', 'げんじん'], correct: 0, why: '**{原因|げんいん}** (gen\'in).' },
        { q: '{野菜|やさい}の**値段**が{上|あ}がった。', options: ['ちだん', 'ねだん', 'ねたん', 'ちたん'], correct: 1, why: '**{値段|ねだん}** — kun ね.' },
        { q: '**国民**の{生活|せいかつ}を{守|まも}る。', options: ['こくみん', 'くにみん', 'こくたみ', 'こっみん'], correct: 0, why: '**{国民|こくみん}** (kokumin).' },
        { q: 'この{国|くに}は**気候**がいい。', options: ['きこ', 'きごう', 'きこう', 'けこう'], correct: 2, why: '**{気候|きこう}** (kikou). きごう = {記号|きごう} (ký hiệu).' },
        { q: '**道路**が{凍|こお}っている。', options: ['どうろ', 'みちろ', 'どろう', 'とうろ'], correct: 0, why: '**{道路|どうろ}** (douro).' },
        { q: '**種類**が{多|おお}い。', options: ['しゅうるい', 'しゅるい', 'たねるい', 'じゅるい'], correct: 1, why: '**{種類|しゅるい}** (shurui) — しゅ không kéo dài.' },
        { q: '**影響**を{受|う}けた。', options: ['えいきょう', 'かげきょう', 'えいこう', 'えきょう'], correct: 0, why: '**{影響|えいきょう}** (eikyou).' },
        { q: '{電車|でんしゃ}の**速度**を{落|お}とす。', options: ['そくど', 'はやど', 'そくたく', 'そうど'], correct: 0, why: '**{速度|そくど}** (sokudo).' },
        { q: '**平和**な{世界|せかい}がいい。', options: ['へいわ', 'ひょうわ', 'へいか', 'べいわ'], correct: 0, why: '**{平和|へいわ}** (heiwa).' },
        { q: '{社長|しゃちょう}に**報告**する。', options: ['ほうこう', 'ほうこく', 'ほこく', 'ほうごく'], correct: 1, why: '**{報告|ほうこく}** (houkoku).' },
        { q: '{英語|えいご}の**文法**は{難|むずか}しい。', options: ['ぶんほう', 'ぶんぽう', 'もんぽう', 'ぶんぼう'], correct: 1, why: '**{文法|ぶんぽう}** — ん + ほ → ぽ.' },
        { q: '**戦争**が{終|お}わった。', options: ['せんそう', 'せんしょう', 'たたかそう', 'ぜんそう'], correct: 0, why: '**{戦争|せんそう}** (sensou).' },
      ],
    },
    { t: 'h', text: '🟡 Mức 2 — Vừa: chọn chữ Hán đúng (表記)' },
    {
      t: 'mcq',
      id: 'b27-lt2-chon',
      title: 'Chọn chữ (10 câu)',
      items: [
        { q: '**げんいん**を{調|しら}べる。', options: ['原困', '原因', '願因', '源因'], correct: 1, why: '**原因**.' },
        { q: '**せいじ**に{興味|きょうみ}がある。', options: ['政治', '正治', '故治', '政冶'], correct: 0, why: '**政治** — 治 có 氵 (冶 có 冫).' },
        { q: '**じゅうみん**の{声|こえ}。', options: ['住氏', '住民', '注民', '往民'], correct: 1, why: '**住民** — 住 (亻+主); 注 (氵), 往 (彳).' },
        { q: '**てんこう**が{悪|わる}い。', options: ['天侯', '天候', '天後', '天校'], correct: 1, why: '**天候** — có nét sổ ngắn.' },
        { q: 'この{車|くるま}は**はやい**。', options: ['早い', '速い', '束い', '遠い'], correct: 1, why: 'Tốc độ → **速い**.' },
        { q: '**せんろ**に{入|はい}らないで。', options: ['線落', '線路', '泉路', '線絡'], correct: 1, why: '**線路** — 路 có ⻊.' },
        { q: '**かち**のある{経験|けいけん}。', options: ['価直', '価値', '価植', '仮値'], correct: 1, why: '**価値** — 値 = 亻 + 直.' },
        { q: '{新|あたら}しい**ほうりつ**。', options: ['決律', '法律', '去律', '方律'], correct: 1, why: '**法律** — 法 = 氵 + 去.' },
        { q: '**しゅるい**が{少|すく}ない。', options: ['種類', '動類', '重類', '種数'], correct: 0, why: '**種類**.' },
        { q: '**わしょく**が{好|す}きだ。', options: ['利食', '私食', '和食', '知食'], correct: 2, why: '**和食** — 禾 + 口.' },
      ],
    },
    { t: 'h', text: '🔴 Mức 3 — Khó: đồng âm & chữ giống trong câu' },
    {
      t: 'mcq',
      id: 'b27-lt2-bay',
      title: 'Bẫy đồng âm / chữ giống (6 câu)',
      items: [
        { q: '{地図|ちず}の**きごう**の{意味|いみ}を{調|しら}べた。', options: ['気候', '記号', '気功', '帰港'], correct: 1, why: 'Ký hiệu trên bản đồ = **記号** (きごう — có ご đục). {気候|きこう} = khí hậu (こ trong).' },
        { q: '{明日|あした}は{日本語|にほんご}の**しけん**です。', options: ['事件', '試験', '私見', '始検'], correct: 1, why: 'Kỳ thi = **試験** (しけん). {事件|じけん} = vụ án (じ đục).' },
        { q: 'この{本|ほん}の**かかく**は2,000{円|えん}です。', options: ['科学', '価格', '画角', '過覚'], correct: 1, why: 'Giá = **価格** (かかく). {科学|かがく} = khoa học (が đục).' },
        { q: '{雪|ゆき}が{多|おお}いと、{家|いえ}の**ねだん**も{上|あ}がるの？', options: ['値段', '寝段', '根段', '直段'], correct: 0, why: '**値段** — ね viết 値 (không phải 寝 — ngủ, 根 — rễ).' },
        { q: '{子|こ}どもたちが{公園|こうえん}で**あらそって**いる。', options: ['争って', '事って', '急って', '洗って'], correct: 0, why: 'Tranh giành = **争う**. {洗|あら}う (rửa) cùng âm đầu あら — bẫy.' },
        { q: '{会議|かいぎ}の**けっか**を{報告|ほうこく}する。', options: ['結果', '決果', '結価', '欠果'], correct: 0, why: 'Kết quả = **結果** (Bài 21). Câu này để bạn thấy 告 (報告) đứng cạnh từ đã học.' },
      ],
    },
  ],
};

const LT_3: Lesson = {
  id: 'b27-lt-3-noi-cau',
  kind: 'homework',
  title: 'Luyện thêm 3 · Ngữ pháp — nối đúng dạng & viết lại câu (22 câu)',
  goal: 'Nối đúng mọi loại từ trước ～せいで・～せいか・～おかげで・～ため・～によって／による và viết lại câu (gộp hai câu, đổi văn nói ↔ văn viết, đổi tốt ↔ xấu) mà không sai phần nối.',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Nhắc nhanh — bảng nối',
      items: [
        '**せいで・せいか・おかげで・ため**: Nの・ナAな・イA・V{普通形|ふつうけい} (giống nối với danh từ).',
        '**によって・により**: chỉ N (hoặc Vこと); trước danh từ khác → **による**.',
        '**ため** văn viết còn có dạng **Nである ため／ナAである ため** (trang trọng).',
      ],
    },
    {
      t: 'quiz',
      id: 'b27-lt3-noi',
      title: '🟡 Nối đúng dạng — viết cả cụm (12 câu)',
      kind: 'fill',
      grammar: 'Viết đúng dạng từ trong ngoặc + mẫu đã cho',
      items: [
        { q: '（{雪|ゆき} ＋ せいで）、{電車|でんしゃ}が{遅|おく}れた。', answers: V('{雪|ゆき}のせいで'), hint: 'N の せいで' },
        { q: '（{静|しず}か ＋ おかげで）、よく{眠|ねむ}れた。', answers: V('{静|しず}かなおかげで'), hint: 'ナA な おかげで' },
        { q: '（{暑|あつ}い ＋ せいか）、{食欲|しょくよく}がない。', answers: V('{暑|あつ}いせいか'), hint: 'イA せいか' },
        { q: '（{事故|じこ}がある→quá khứ ＋ ため）、{渋滞|じゅうたい}している。', answers: V('{事故|じこ}があったため'), hint: 'あった ため' },
        { q: '（{工事中|こうじちゅう} ＋ ため）、{通|とお}れません。', answers: V('{工事中|こうじちゅう}のため'), hint: 'N の ため' },
        { q: '（{台風|たいふう} ＋ による）{被害|ひがい}', answers: V('{台風|たいふう}による'), hint: 'N による N' },
        { q: '（{毎日|まいにち}{歩|ある}く ＋ によって）、{健康|けんこう}になった。', answers: V('{毎日|まいにち}{歩|ある}くことによって'), hint: 'V こと に よって' },
        { q: '（{人|ひと} ＋ によっては）、{反対|はんたい}する{人|ひと}もいる。', answers: V('{人|ひと}によっては'), hint: 'N によっては' },
        { q: '（{先輩|せんぱい}が{手伝|てつだ}う→cho mình, quá khứ ＋ おかげで）、{間|ま}に{合|あ}った。', answers: V('{先輩|せんぱい}が{手伝|てつだ}ってくれたおかげで'), hint: 'てつだって くれた おかげで' },
        { q: '（{説明|せつめい}が{不十分|ふじゅうぶん} ＋ せいで）、{誤解|ごかい}が{生|う}まれた。', answers: V('{説明|せつめい}が{不十分|ふじゅうぶん}なせいで', '{説明|せつめい}が{不十分|ふじゅうぶん}だったせいで'), hint: 'ナA な／だった せいで' },
        { q: '（{気|き} ＋ せいか）、{今日|きょう}は{道|みち}が{空|す}いている。', answers: V('{気|き}のせいか'), hint: '気の せいか' },
        { q: '（{少子化|しょうしか} ＋ ため）、{学校|がっこう}が{減|へ}っている。', answers: V('{少子化|しょうしか}のため'), hint: 'N の ため' },
      ],
    },
    {
      t: 'quiz',
      id: 'b27-lt3-viet',
      title: '🔴 Viết lại câu (10 câu)',
      kind: 'translate',
      grammar: 'Gộp hai câu bằng mẫu trong ngoặc; đổi văn nói ↔ văn viết',
      items: [
        { q: '{寝坊|ねぼう}しました。それで、{試験|しけん}に{遅|おく}れました。→（せいで）', answers: V('{寝坊|ねぼう}したせいで、{試験|しけん}に{遅|おく}れました。'), hint: 'ねぼうした せいで' },
        { q: '{友達|ともだち}がノートを{貸|か}してくれました。それで、{試験|しけん}に{合格|ごうかく}できました。→（おかげで）', answers: V('{友達|ともだち}がノートを{貸|か}してくれたおかげで、{試験|しけん}に{合格|ごうかく}できました。'), hint: 'かして くれた おかげで' },
        { q: '{大雨|おおあめ}が{降|ふ}っています。それで、{電車|でんしゃ}が{止|と}まっています。→（ため — thông báo）', answers: V('{大雨|おおあめ}が{降|ふ}っているため、{電車|でんしゃ}が{止|と}まっています。', '{大雨|おおあめ}のため、{電車|でんしゃ}が{止|と}まっています。'), hint: 'ふっている ため' },
        { q: '{雨|あめ}で{試合|しあい}が{中止|ちゅうし}になったよ。→（ため — văn thông báo, です／ます）', answers: V('{雨|あめ}のため、{試合|しあい}は{中止|ちゅうし}になりました。', '{雨|あめ}のため、{試合|しあい}が{中止|ちゅうし}になりました。', '{雨|あめ}のため、{試合|しあい}は{中止|ちゅうし}です。'), hint: 'あめの ため' },
        { q: '{大雨|おおあめ}のため、{電車|でんしゃ}が{運休|うんきゅう}しています。→（văn nói với bạn: で ＋ んだって）', answers: V('{大雨|おおあめ}で、{電車|でんしゃ}が{止|と}まってるんだって。', '{大雨|おおあめ}で{電車|でんしゃ}が{止|と}まっているんだって。', '{大雨|おおあめ}で、{電車|でんしゃ}が{運休|うんきゅう}してるんだって。'), hint: 'おおあめで … んだって' },
        { q: '{地震|じしん}が{起|お}きて、{被害|ひがい}が{出|で}ました。その{被害|ひがい}は{大|おお}きかったです。→（による — một câu）', answers: V('{地震|じしん}による{被害|ひがい}は{大|おお}きかったです。', '{地震|じしん}による{被害|ひがい}は{大|おお}きかった。'), hint: 'じしんに よる ひがいは' },
        { q: 'ベルが{電話|でんわ}を{発明|はつめい}しました。→（によって — bị động, chủ ngữ 電話）', answers: V('{電話|でんわ}はベルによって{発明|はつめい}されました。'), hint: 'でんわは ベルに よって はつめい されました' },
        { q: '{国|くに}が{違|ちが}えば、{結婚式|けっこんしき}のやり{方|かた}も{違|ちが}います。→（によって）', answers: V('{国|くに}によって、{結婚式|けっこんしき}のやり{方|かた}が{違|ちが}います。', '{国|くに}によって、{結婚式|けっこんしき}のやり{方|かた}は{違|ちが}います。', '{国|くに}によって{結婚式|けっこんしき}のやり{方|かた}が{異|こと}なります。'), hint: 'くにに よって' },
        { q: '{毎日|まいにち}{単語|たんご}を10{個|こ}{覚|おぼ}えます。そうすれば、{語彙|ごい}が{増|ふ}えます。→（ことによって）', answers: V('{毎日|まいにち}{単語|たんご}を10{個|こ}{覚|おぼ}えることによって、{語彙|ごい}が{増|ふ}えます。'), hint: 'おぼえる ことに よって' },
        { q: '{野菜|やさい}が{高|たか}いです。{原因|げんいん}は{雨|あめ}が{少|すく}なかったことです。→（のは～ためだ）', answers: V('{野菜|やさい}が{高|たか}いのは、{雨|あめ}が{少|すく}なかったためです。', '{野菜|やさい}が{高|たか}いのは、{雨|あめ}が{少|すく}なかったためだ。'), hint: '…のは … ためです' },
      ],
    },
  ],
};

const LT_4: Lesson = {
  id: 'b27-lt-4-phan-biet',
  kind: 'homework',
  title: 'Luyện thêm 4 · Phân biệt — せいで・おかげで・ため・によって・から・ので・によると (22 câu)',
  goal: 'Chọn đúng mẫu nguyên nhân trong câu có bẫy: kết quả tốt / xấu, vế sau là lời rủ / nhờ, văn nói / văn viết, động từ hay danh từ đứng trước, によって ↔ による ↔ によると, ため mục đích ↔ nguyên nhân.',
  minutes: 25,
  blocks: [
    {
      t: 'note',
      title: 'Nhắc nhanh — 4 câu hỏi để chọn',
      items: [
        '**① Vế sau là rủ / nhờ / mệnh lệnh?** → から／ので.',
        '**② Có cảm xúc?** Tốt + biết ơn → おかげで · Xấu + trách → せいで · Không chắc → せいか.',
        '**③ Thông báo / tin tức khách quan?** → ため (sau mọi loại từ) / によって・により (chỉ sau N) / による + N.',
        '**④ Có ～そうだ ở cuối + một NGUỒN TIN?** → によると.',
      ],
    },
    {
      t: 'mcq',
      id: 'b27-lt4-cap',
      title: '🟡 Chọn mẫu đúng (14 câu)',
      items: [
        { q: '{雨|あめ}（　）、{今日|きょう}は{家|いえ}でゲームをしよう。', options: ['のせいで', 'のおかげで', 'だから', 'によって'], correct: 2, why: 'Vế sau là lời rủ → **だから** (から).' },
        { q: '{彼|かれ}が{道|みち}を{間違|まちが}えた（　）、{約束|やくそく}の{時間|じかん}に{遅|おく}れた。', options: ['おかげで', 'せいで', 'によって', 'のに'], correct: 1, why: 'Kết quả xấu + trách → **せいで**.' },
        { q: '{近所|きんじょ}の{人|ひと}が{親切|しんせつ}な（　）、{一人暮|ひとりぐ}らしも{寂|さび}しくない。', options: ['せいで', 'おかげで', 'のに', 'によって'], correct: 1, why: 'Kết quả tốt → **おかげで**. のに (vậy mà) trái nghĩa; によって không đứng sau ナA.' },
        { q: 'エレベーターは{点検|てんけん}の（　）、{使|つか}えません。', options: ['せいで', 'ため', 'おかげで', 'によると'], correct: 1, why: 'Biển thông báo → **ため**. {点検|てんけん} = kiểm tra định kỳ (N2).' },
        { q: '{大雨|おおあめ}（　）{土砂崩|どしゃくず}れで、{道路|どうろ}が{通|とお}れなくなった。', options: ['による', 'によって', 'によると', 'のおかげの'], correct: 0, why: 'Trước danh từ {土砂崩|どしゃくず}れ → **による**.' },
        { q: '{専門家|せんもんか}（　）、この{地震|じしん}は100{年|ねん}に{一度|いちど}の{大|おお}きさだそうだ。', options: ['によって', 'によると', 'による', 'のせいで'], correct: 1, why: 'Nguồn + そうだ → **によると**.' },
        { q: '{言葉|ことば}の{意味|いみ}は、{使|つか}う{場面|ばめん}（　）{変|か}わる。', options: ['によって', 'によると', 'のせいで', 'のおかげで'], correct: 0, why: 'Vế sau "thay đổi" → **によって** tuỳ theo. {場面|ばめん} = tình huống (N3).' },
        { q: 'この{寺|てら}は、{有名|ゆうめい}な{建築家|けんちくか}（　）{建|た}てられた。', options: ['に', 'によって', 'によると', 'から'], correct: 1, why: 'Người tạo ra công trình + bị động → **によって**.' },
        { q: '{飛行機|ひこうき}の{窓|まど}から{見|み}た{景色|けしき}は、{天気|てんき}が{良|よ}かった（　）、とてもきれいだった。', options: ['せいで', 'おかげで', 'によって', 'のに'], correct: 1, why: 'Kết quả tốt → **おかげで**.' },
        { q: '{電気代|でんきだい}を{節約|せつやく}する（　）、エアコンの{温度|おんど}を{上|あ}げた。', options: ['ため', 'せいで', 'おかげで', 'によって'], correct: 0, why: 'MỤC ĐÍCH (V辞書形 chủ ý + việc mình làm) → **ため（に）** (Bài 21). Bẫy: không phải nguyên nhân.' },
        { q: '{電気代|でんきだい}が{上|あ}がった（　）、{生活|せいかつ}が{苦|くる}しくなった。', options: ['ように', 'せいで', 'おかげで', 'によると'], correct: 1, why: 'Vた + kết quả xấu + than → **せいで**. おかげで cho kết quả tốt; ように (để) là mục đích; によると = nguồn tin.' },
        { q: '{一生懸命|いっしょうけんめい}{練習|れんしゅう}した（　）か、{試合|しあい}に{勝|か}つことができた。', options: ['せい', 'おかげ', 'のに', 'によって'], correct: 1, why: 'Kết quả tốt + không chắc (か) → **おかげか**. Cụm "おかげか" ở mục ②.' },
        { q: '{父|ちち}は{仕事|しごと}の（　）、{毎晩|まいばん}{帰|かえ}りが{遅|おそ}い。', options: ['ため', 'おかげで', 'によると', 'による'], correct: 0, why: 'Giải thích khách quan → **N の ため** (vì công việc). Câu này đọc cả "vì mục đích công việc" cũng hợp — đều là ため.' },
        { q: '「{試験|しけん}に{合格|ごうかく}できたのは、（　）。」{先生|せんせい}に{言|い}う{言葉|ことば}として{一番|いちばん}いいのは？', options: ['{先生|せんせい}のせいです', '{先生|せんせい}のおかげです', '{先生|せんせい}のためです', '{先生|せんせい}によってです'], correct: 1, why: 'Cảm ơn thầy → **{先生|せんせい}のおかげです**. ため nghe như "vì lợi ích của thầy" — sai ý.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b27-lt4-bay',
      title: '🔴 Bẫy — câu nào ĐÚNG? (8 câu)',
      items: [
        { q: 'Câu nào đúng?', options: ['{雨|あめ}が{降|ふ}ったによって、{試合|しあい}が{延期|えんき}になった。', '{雨|あめ}によって、{試合|しあい}が{延期|えんき}になった。', '{雨|あめ}だによって、{試合|しあい}が{延期|えんき}になった。', '{雨|あめ}なによって、{試合|しあい}が{延期|えんき}になった。'], correct: 1, why: 'によって chỉ sau N trần: **{雨|あめ}によって**.' },
        { q: 'Câu nào đúng?', options: ['{便利|べんり}のおかげで、{人|ひと}が{増|ふ}えた。', '{便利|べんり}だおかげで、{人|ひと}が{増|ふ}えた。', '{便利|べんり}なおかげで、{人|ひと}が{増|ふ}えた。', '{便利|べんり}でおかげで、{人|ひと}が{増|ふ}えた。'], correct: 2, why: 'ナA + **な** + おかげで.' },
        { q: 'Câu nào đúng?', options: ['{国|くに}によって、ルールは{同|おな}じです。', '{国|くに}によって、ルールが{違|ちが}います。', '{国|くに}によると、ルールが{違|ちが}います。', '{国|くに}のせいで、ルールが{違|ちが}います。'], correct: 1, why: 'によって (tuỳ theo) + {違|ちが}う.' },
        { q: 'Câu nào đúng?', options: ['{先生|せんせい}によって{褒|ほ}められました。', '{先生|せんせい}に{褒|ほ}められました。', '{先生|せんせい}によると{褒|ほ}められました。', '{先生|せんせい}のため{褒|ほ}められました。'], correct: 1, why: 'Người tác động lên người → **に** (Bài 22). によって chỉ cho người tạo ra vật.' },
        { q: 'Câu nào đúng?', options: ['{事故|じこ}によって{渋滞|じゅうたい}が10キロ{続|つづ}いている。', '{事故|じこ}による{渋滞|じゅうたい}が10キロ{続|つづ}いている。', '{事故|じこ}によると{渋滞|じゅうたい}が10キロ{続|つづ}いている。', 'Cả 1 và 2 đều đúng.'], correct: 3, why: '1: によって + câu (渋滞が続いている) ✓; 2: による + N (渋滞) ✓. Cả hai đều đúng, chỉ khác cấu trúc.' },
        { q: 'Câu nào đúng?', options: ['{熱|ねつ}があるせいで、{今日|きょう}は{休|やす}みましょう。', '{熱|ねつ}があるので、{今日|きょう}は{休|やす}みましょう。', '{熱|ねつ}があるおかげで、{今日|きょう}は{休|やす}みましょう。', '{熱|ねつ}によって、{今日|きょう}は{休|やす}みましょう。'], correct: 1, why: 'Vế sau là lời rủ → **ので** (hoặc から).' },
        { q: 'Câu nào là MỈA MAI?', options: ['{薬|くすり}のおかげで、{熱|ねつ}が{下|さ}がった。', '{君|きみ}のおかげで、{仕事|しごと}が{全部|ぜんぶ}やり{直|なお}しだよ。', '{先輩|せんぱい}のおかげで、{合格|ごうかく}できた。', '{天気|てんき}がいいおかげで、{洗濯物|せんたくもの}が{乾|かわ}いた。'], correct: 1, why: 'おかげで + chuyện XẤU (phải làm lại toàn bộ) → **mỉa mai**. {直|なお}し = làm lại.' },
        { q: 'Câu nào dùng ため với nghĩa NGUYÊN NHÂN?', options: ['{家|いえ}を{買|か}うために、{貯金|ちょきん}している。', '{試験|しけん}に{受|う}かるために、{毎日|まいにち}{勉強|べんきょう}する。', '{道|みち}が{凍|こお}っていたため、{事故|じこ}が{多|おお}かった。', '{子|こ}どものために、{絵本|えほん}を{買|か}った。'], correct: 2, why: 'Vている／Vた + kết quả → **nguyên nhân**. Ba câu kia là mục đích / lợi ích (Bài 21).' },
      ],
    },
  ],
};

const LT_5: Lesson = {
  id: 'b27-lt-5-tong-hop',
  kind: 'homework',
  title: 'Luyện thêm 5 · Đề tổng hợp kiểu N3 — 文字・語彙 · 文法 · 読解 (18 câu, có thang điểm)',
  goal: 'Làm một đề nhỏ kiểu JLPT N3 trộn từ vựng, chữ Hán, ngữ pháp và đọc hiểu của Bài 27 trong 30 phút; tự chấm theo thang điểm và biết sai câu nào thì ôn mục nào.',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Thang điểm & cách ôn',
      items: [
        '**文字・語彙** 6 câu × 1 điểm · **文法** 8 câu × 1,5 điểm (12) · **読解** 4 câu × 2 điểm (8). Tổng **26 điểm**. ≥ 20: vững Bài 27 · 14–19: ôn lại phần sai · < 14: làm lại 3 buổi trên lớp.',
        'Sai câu 文字・語彙 → mục 2 Từ vựng + mục 4 Chữ Hán. Sai 文法 1–2 → mẫu ①③ (せいで・おかげで) · 3 → ② (せいか) · 4 → ④ (ため) · 5 → ⑤ (による) · 6 → ⑦ (tuỳ theo) · 7–8 (★) → bảng phân biệt ⑨. Sai 読解 → đọc lại mục 6 "Chiến thuật đọc N3".',
        'Làm trong **30 phút**, không xem lời giải trước khi xong cả đề.',
      ],
    },
    {
      t: 'mcq',
      id: 'b27-lt5-moji',
      title: '文字・語彙 (6 câu)',
      items: [
        { q: '{台風|たいふう}の**影響**で{電車|でんしゃ}が{遅|おく}れた。（{読|よ}み）', options: ['えいきょう', 'えいこう', 'かげきょう', 'えいきょ'], correct: 0, why: '**{影響|えいきょう}**.' },
        { q: '{事故|じこ}の**げんいん**を{調|しら}べる。（{表記|ひょうき}）', options: ['原困', '願因', '原因', '源因'], correct: 2, why: '**原因**.' },
        { q: '{大雪|おおゆき}のため、{今日|きょう}の{特急|とっきゅう}は（　）です。', options: ['{運休|うんきゅう}', '{渋滞|じゅうたい}', '{通行止|つうこうど}め', '{休講|きゅうこう}'], correct: 0, why: 'Tàu ngừng chạy → **{運休|うんきゅう}**.' },
        { q: '{川|かわ}の{水|みず}が{増|ふ}えたので、{住民|じゅうみん}は{学校|がっこう}に（　）した。', options: ['{避難|ひなん}', '{発生|はっせい}', '{報道|ほうどう}', '{延期|えんき}'], correct: 0, why: '**{避難|ひなん}する**.' },
        { q: '「{意見|いけん}は{人|ひと}によって{異|こと}なる」と{意味|いみ}が{近|ちか}いのは？', options: ['{意見|いけん}はみんな{同|おな}じだ', '{意見|いけん}は{人|ひと}によって{違|ちが}う', '{意見|いけん}は{人|ひと}が{決|き}める', '{意見|いけん}を{言|い}う{人|ひと}は{少|すく}ない'], correct: 1, why: '{異|こと}なる ≈ **{違|ちが}う**.' },
        { q: '「{延期|えんき}」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{雨|あめ}のため、{運動会|うんどうかい}は{来週|らいしゅう}に{延期|えんき}された。', '{電車|でんしゃ}が10{分|ぷん}{延期|えんき}した。', '{道路|どうろ}が{延期|えんき}している。', '{会議|かいぎ}を{延期|えんき}に{開|ひら}いた。'], correct: 0, why: '**～に{延期|えんき}される** (hoãn sang). Tàu chậm → {遅|おく}れた／{遅延|ちえん}した.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b27-lt5-bunpou',
      title: '文法 (8 câu — 6 câu điền + 2 câu ★)',
      items: [
        { q: '{隣|となり}の{人|ひと}がうるさい（　）、ゆうべは{全然|ぜんぜん}{眠|ねむ}れなかった。', options: ['せいで', 'おかげで', 'によって', 'のに'], correct: 0, why: 'Xấu + trách → **せいで** (①). によって không đứng sau tính từ; のに trái nghĩa.' },
        { q: '{皆|みな}さんが{応援|おうえん}してくれた（　）、{最後|さいご}まで{走|はし}ることができました。', options: ['せいで', 'おかげで', 'せいか', 'によると'], correct: 1, why: 'Tốt + biết ơn → **おかげで** (③).' },
        { q: '{年|とし}の（　）、{最近|さいきん}{物|もの}をよく{忘|わす}れる。', options: ['せいか', 'おかげで', 'について', 'によって'], correct: 0, why: 'Đoán → **せいか** (②).' },
        { q: '{本日|ほんじつ}は{停電|ていでん}の（　）、{営業|えいぎょう}を{中止|ちゅうし}いたします。', options: ['せいで', 'ため', 'おかげで', 'によると'], correct: 1, why: 'Thông báo → **ため** (④).' },
        { q: '{地震|じしん}（　）{被害|ひがい}について、{政府|せいふ}が{調査|ちょうさ}を{始|はじ}めた。', options: ['による', 'によって', 'によると', 'のせいで'], correct: 0, why: 'Trước danh từ → **による** (⑤).' },
        { q: 'お{祭|まつ}りの{日|ひ}は、{地域|ちいき}（　）さまざまです。', options: ['によって', 'によると', 'のせいで', 'のために'], correct: 0, why: 'さまざまだ → **によって** tuỳ theo (⑦).' },
        { q: '★ この ＿＿ ＿＿ ★ ＿＿ {書|か}かれた。（{有名|ゆうめい}な／{小説|しょうせつ}は／{作家|さっか}に／よって）', options: ['{有名|ゆうめい}な', '{小説|しょうせつ}は', '{作家|さっか}に', 'よって'], correct: 2, why: 'Câu đúng: この **{小説|しょうせつ}は {有名|ゆうめい}な {作家|さっか}に よって** {書|か}かれた. ★ (thứ 3) = **{作家|さっか}に**.' },
        { q: '★ {電車|でんしゃ}が ＿＿ ★ ＿＿ ＿＿ ためです。（{信号|しんごう}が／{遅|おく}れた／{故障|こしょう}した／のは）', options: ['{信号|しんごう}が', '{遅|おく}れた', '{故障|こしょう}した', 'のは'], correct: 3, why: 'Câu đúng: {電車|でんしゃ}が **{遅|おく}れた のは {信号|しんごう}が {故障|こしょう}した** ためです. ★ (thứ 2) = **のは**.' },
      ],
    },
    {
      t: 'passage',
      title: '読解 — {寮|りょう}の{掲示板|けいじばん}から（マリヤム）',
      intro: 'Đọc thông báo マリヤム viết lên bảng tin ký túc xá trước mùa bão rồi trả lời 4 câu hỏi.',
      paras: [
        { text: '{寮|りょう}の{皆|みな}さんへ。{今年|ことし}も{台風|たいふう}の{季節|きせつ}が{来|き}ました。{去年|きょねん}、{大|おお}きな{台風|たいふう}が{来|き}たとき、{寮|りょう}では{停電|ていでん}が{起|お}こりました。{私|わたし}は{懐中電灯|かいちゅうでんとう}を{持|も}っていなかったせいで、{暗|くら}い{部屋|へや}で{何|なに}もできませんでした。' },
        { text: 'でも、{隣|となり}の{部屋|へや}の{日本人|にほんじん}の{学生|がくせい}が{水|みず}とろうそくを{分|わ}けてくれたおかげで、{安心|あんしん}して{朝|あさ}を{待|ま}つことができました。{日本|にほん}では、{地域|ちいき}によって{避難所|ひなんじょ}の{場所|ばしょ}が{違|ちが}います。{私|わたし}たちの{寮|りょう}の{避難所|ひなんじょ}は、{近|ちか}くの{小学校|しょうがっこう}です。' },
        { text: '{台風|たいふう}が{来|く}る{前|まえ}に、{懐中電灯|かいちゅうでんとう}と{水|みず}を{準備|じゅんび}しておいてください。また、{大雨警報|おおあめけいほう}が{出|で}たため{授業|じゅぎょう}が{休|やす}みになっても、{外|そと}には{出|で}ないでください。{分|わ}からないことがあったら、{遠慮|えんりょ}しないで{聞|き}いてくださいね。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b27-lt5-doc',
      title: '読解 (4 câu)',
      items: [
        { q: '{去年|きょねん}の{台風|たいふう}のとき、マリヤムさんはどうして{何|なに}もできませんでしたか。', options: ['{寮|りょう}の{外|そと}に{出|で}られなかったから', '{懐中電灯|かいちゅうでんとう}を{持|も}っていなかったから', '{日本人|にほんじん}の{学生|がくせい}がいなかったから', '{避難所|ひなんじょ}に{行|い}ったから'], correct: 1, why: '**{懐中電灯|かいちゅうでんとう}を{持|も}っていなかったせいで、{暗|くら}い{部屋|へや}で{何|なに}もできませんでした**. {懐中電灯|かいちゅうでんとう} = đèn pin (N2).' },
        { q: 'マリヤムさんが{安心|あんしん}できたのはどうしてですか。', options: ['{電気|でんき}がすぐについたから', '{隣|となり}の{学生|がくせい}が{水|みず}とろうそくをくれたから', '{避難所|ひなんじょ}に{行|い}ったから', '{台風|たいふう}が{来|こ}なかったから'], correct: 1, why: '**{分|わ}けてくれたおかげで、{安心|あんしん}して{朝|あさ}を{待|ま}つことができました**.' },
        { q: '「{地域|ちいき}によって{避難所|ひなんじょ}の{場所|ばしょ}が{違|ちが}います」の「によって」と{同|おな}じ{使|つか}い{方|かた}はどれですか。', options: ['{台風|たいふう}によって{家|いえ}が{壊|こわ}れた。', '{話|はな}し{合|あ}いによって{決|き}めた。', '{店|みせ}によって{値段|ねだん}が{違|ちが}う。', 'この{本|ほん}は{有名|ゆうめい}な{作家|さっか}によって{書|か}かれた。'], correct: 2, why: 'Vế sau "{違|ちが}う" → **tuỳ theo** (⑦). 1 nguyên nhân, 2 cách thức, 4 tác nhân.' },
        { q: 'マリヤムさんが{寮|りょう}の{人|ひと}たちに{一番|いちばん}{伝|つた}えたいことは{何|なん}ですか。', options: ['{台風|たいふう}の{前|まえ}に{準備|じゅんび}をして、{危|あぶ}ないときは{外|そと}に{出|で}ないでほしい。', '{日本人|にほんじん}の{学生|がくせい}と{友達|ともだち}になってほしい。', '{授業|じゅぎょう}が{休|やす}みになったら{遊|あそ}びに{行|い}ってほしい。', '{避難所|ひなんじょ}の{場所|ばしょ}は{覚|おぼ}えなくてもいい。'], correct: 0, why: 'Đoạn cuối: **{準備|じゅんび}しておいてください** + **{外|そと}には{出|で}ないでください** — lời nhắn chính của bài.' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('{懐中電灯|かいちゅうでんとう}を{持|も}っていなかったせいで、{何|なに}もできませんでした。', 'Kaichuu dentou o motte inakatta sei de, nani mo dekimasen deshita.', 'Tại không có đèn pin nên tôi chẳng làm được gì.'),
        E('{水|みず}を{分|わ}けてくれたおかげで、{安心|あんしん}できました。', 'Mizu o wakete kureta okage de, anshin dekimashita.', 'Nhờ bạn chia nước cho mà tôi yên tâm.'),
        E('{地域|ちいき}によって、{避難所|ひなんじょ}の{場所|ばしょ}が{違|ちが}います。', 'Chiiki ni yotte, hinanjo no basho ga chigaimasu.', 'Tuỳ khu vực mà vị trí nơi lánh nạn khác nhau.'),
        E('{大雨警報|おおあめけいほう}が{出|で}たため、{授業|じゅぎょう}が{休|やす}みになりました。', 'Ooame keihou ga deta tame, jugyou ga yasumi ni narimashita.', 'Do có cảnh báo mưa lớn nên giờ học được nghỉ.'),
      ],
    },
  ],
};

export const BAI_27: Lesson[] = [
  // ① Cốt lõi
  HOI_THOAI, TU_VUNG, NGU_PHAP, HAN_TU, NGHE, DOC, NOI, VIET, BAI_TAP,
  // ② Theo buổi trên lớp
  BUOI_1, BUOI_2, BUOI_3,
  // ③ Luyện thêm dễ → khó
  LT_1, LT_2, LT_3, LT_4, LT_5,
];
