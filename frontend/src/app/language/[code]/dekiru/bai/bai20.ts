/**
 * Bài 20 — うわさ (Tin đồn) · TIẾP SAU SÁCH, cấp N4 (xem ../SOAN-BAI.md mục 8). Bài CUỐI chặng 16–20 ⇒ có ④ Kiểm tra chặng.
 * Người học đã xong Bài 1–15 (ポイント 1–124 — trong đó ポイント 119 「普通形＋そうです」 nghe nói, ポイント 123 「たぶん／きっと～と思います」),
 * Bài 16 (thể khả năng, thể ý chí, ～つもり, ～予定), Bài 17 (～ば, ～なら, ～し, ～すぎる, ～やすい・にくい), Bài 18
 * (～てあげる・くれる・もらう, ～ておく, ～てある) và Bài 19 (～てしまう, ～てみる, ～ところ, ～のに). KHÔNG dạy lại — chỉ dùng lại
 * trong câu (ghi "ôn: Bài X").
 *
 * Ngữ pháp (N4) — nhóm "suy đoán & truyền tin": ① ～そう 様態 (Vます／イA／ナA ＋ そう — trông có vẻ, sắp…; そうな N, そうに V,
 * よさそう・なさそう, ～そうにない) + bảng HAI nghĩa của そう (様態 ↔ 伝聞 ポイント 119) · ② ～ようだ・～みたいだ (suy đoán từ dấu
 * hiệu mình thấy / cảm nhận; so sánh まるで～ようだ; ～のような N／みたいな N) · ③ ～らしい (suy đoán từ thông tin nghe được,
 * khách quan; "biết thêm" N らしい = đúng chất) · ④ ～かもしれない (có thể…; もしかしたら) · ⑤ ～はずだ (chắc là, lẽ ra — có căn
 * cứ; ～はずなのに, ～ないはず; ～はずがない để Bài 31). Cuối: bảng "nguồn tin & độ chắc chắn" so sánh cả nhóm.
 * Từ vựng: 48 từ N4 (một số N3 có ghi cấp): tin đồn & tin tức, người yêu & các mối quan hệ, vẻ ngoài & tâm trạng, thời tiết &
 * dấu hiệu, suy đoán & kiểm chứng. Từ đã học ở Bài 1–19 (本当, 恋人, 結婚, 別れる, 天気予報, 人気, 雑誌, ニュース, 寂しい,
 * 眠い, 甘い, 心配, 安心, びっくり…) KHÔNG lặp lại.
 * Chữ Hán mới (15): 様 確 実 彼 似 太 泣 表 情 報 絶 対 雲 想 幸 (N3 theo các bảng tham khảo phổ biến; 太 確 có bảng xếp N4 —
 * JLPT không công bố danh sách chữ chính thức) — không trùng hanTu.ts, hanTu16–19.ts, hanLop.ts, bảng chữ Bài 1–19.
 * Thẻ chữ Hán: hanTu20.ts (HAN_TU_20).
 * Hội thoại, câu ví dụ, bài đọc, kịch bản nghe, đề kiểm tra: VIẾT MỚI 100%, không chép giáo trình/đề thi nào.
 *
 * Nhân vật (giới tính quyết định giọng đọc, theo sách p.14): nữ = パク, ワン, アンナ, メアリー, マリヤム, 山口, 木村, リン, 鈴木 ·
 * nam = マルコ, ダニエル, ナタポン, カルロス, 西川, 本田先生, 小林店長.
 * {小林|こばやし}{店長|てんちょう} (nam, role 'examiner' / ja-nam) — chủ quán ひまわり{食堂|しょくどう} nơi ナタポン làm thêm (Bài 16).
 * {本田先生|ほんだせんせい} (nam, role 'examiner' / ja-nam) — giáo viên tiếng Nhật của lớp.
 * Người MỚI của bài này (không tên riêng):
 *  - {八百屋|やおや}の{人|ひと} (hội thoại ③) — nữ, role 'a' / giọng ja-nu — cửa hàng rau giao hàng cho quán.
 *  - {本田先生|ほんだせんせい}の{妹|いもうと}さん chỉ được nhắc tới, không nói.
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
  id: 'b20-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — うわさ: dã ngoại trời sắp mưa, tin đồn thầy Honda sắp cưới, hàng giao trễ và quán mới ở ga',
  goal: 'Nhìn rồi nói vẻ bề ngoài và điều sắp xảy ra (おいしそう・今にも雨が降りそう・眠そう・よさそう), phân biệt với tin nghe được (天気予報では晴れるそうです); kể và bàn một tin đồn bằng ～らしい・～みたい・～ようだ・～かもしれない, rồi kiểm chứng sự thật; nói điều "chắc là / lẽ ra" có căn cứ bằng ～はずです, ～はずなのに khi hàng giao trễ và khi bàn chuyện quán mới mở gần quán mình làm thêm.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Bài 20 — chủ đề: tin đồn, suy đoán (cấp N4, bài cuối chặng 16–20)',
      items: [
        'Hằng ngày ta liên tục **đoán**: nhìn trời thì đoán sắp mưa, nhìn mặt bạn thì đoán bạn mệt, nghe bạn kể thì đoán chuyện gì đã xảy ra, biết lịch thì đoán hàng "chắc chắn sẽ đến lúc 10 giờ". Tiếng Nhật có **cả một nhóm mẫu** cho việc này — và chọn mẫu nào phụ thuộc vào **bạn biết điều đó từ đâu** và **chắc đến mức nào**.',
        'Năm mẫu N4: **～そう** (nhìn thấy: trông có vẻ / sắp), **～ようだ・～みたい** (suy từ dấu hiệu mình thấy), **～らしい** (suy từ tin nghe được), **～かもしれない** (có thể), **～はず** (chắc là, lẽ ra — có căn cứ). Kèm ôn **～そうです = nghe nói** (ポイント 119) để không bao giờ nhầm hai そう.',
        'Ba tình huống: ① メアリー, パク, ダニエル đi dã ngoại — đồ ăn trông ngon, trời sắp mưa trong khi dự báo nói nắng · ② tin đồn ở ký túc xá: thầy 本田 sắp cưới? — rồi sự thật · ③ ở quán ひまわり食堂: rau giao trễ, và tin quán cà ri mới sắp mở trước ga.',
        'Bài 20 là **bài cuối chặng 16–20**: học xong làm **Kiểm tra chặng** (cuối danh sách) theo đúng dạng đề JLPT N4.',
        'Mọi câu có furigana và romaji; bấm 🔊 để nghe từng câu rồi đọc to theo.',
      ],
    },
    {
      t: 'note',
      title: 'Học xong bài 20 bạn làm được (できる)',
      items: [
        '**① ピクニック** — nói điều mắt thấy: **おいしそうですね**, **{今|いま}にも{雨|あめ}が{降|ふ}りそう**, **{眠|ねむ}そうですね**, **このカフェ、よさそう**; tách bạch với tin nghe được: **{天気予報|てんきよほう}では{晴|は}れるそうです**.',
        '**② うわさ** — kể tin đồn: **{先生|せんせい}、{結婚|けっこん}するらしいよ**; đoán từ dấu hiệu: **{指輪|ゆびわ}をしていたみたい**; nêu khả năng: **その{人|ひと}が{相手|あいて}かもしれない**; nhắc người khác: **うわさをそのまま{信|しん}じてはいけません**.',
        '**③ はず** — nói điều có căn cứ: **10{時|じ}に{届|とど}くはずなんですが……**, **{間|ま}に{合|あ}うはずだね**; nói điều trái kỳ vọng: **いつもは{時間|じかん}どおりに{来|く}るはずなのに**; truyền lời đối tác: **11{時|じ}までには{着|つ}くはずだそうです**.',
        '**できる！** — kể 1 phút về một tin đồn mình từng nghe: nghe từ đâu (～らしい／～そうです), mình đã đoán gì (～ようだ／～かもしれない), sự thật là gì, và mình nghĩ gì về tin đồn.',
      ],
    },
    {
      t: 'table',
      caption: 'Bức tranh chung của bài — biết từ đâu, nói bằng mẫu nào',
      head: ['Bạn biết vì…', 'Câu then chốt', 'Romaji', 'Mẫu'],
      rows: [
        ['Mắt thấy ngay trước mặt', 'このケーキ、おいしそう！', 'Kono keeki, oishisou!', 'イA bỏ い ＋ そう'],
        ['Thấy dấu hiệu "sắp"', '{今|いま}にも{雨|あめ}が{降|ふ}りそうです。', 'Ima ni mo ame ga furisou desu.', 'Vます ＋ そう'],
        ['Nghe / đọc tin nguyên văn', '{明日|あした}は{雨|あめ}だそうです。', 'Ashita wa ame da sou desu.', '普通形 ＋ そうです (ポイント 119)'],
        ['Suy từ nhiều dấu hiệu mình thấy', '{誰|だれ}もいないようです。', 'Dare mo inai you desu.', '普通形 ＋ ようだ'],
        ['(văn nói của ようだ)', '{先生|せんせい}、{疲|つか}れているみたい。', 'Sensei, tsukarete iru mitai.', '普通形 ＋ みたい'],
        ['Nghe người khác nói, đoán theo', '{駅前|えきまえ}に{新|あたら}しい{店|みせ}ができるらしいよ。', 'Ekimae ni atarashii mise ga dekiru rashii yo.', '普通形 ＋ らしい'],
        ['Không chắc, có khả năng', '{道|みち}が{混|こ}んでいるかもしれません。', 'Michi ga konde iru kamoshiremasen.', '普通形 ＋ かもしれない'],
        ['Có căn cứ, lý lẽ', '10{時|じ}に{届|とど}くはずです。', 'Juuji ni todoku hazu desu.', '普通形 ＋ はずだ'],
      ],
    },

    /* ── ① ピクニック ── */
    { t: 'h', text: '① ピクニック — "Trông ngon quá!" · "Trời sắp mưa rồi!"' },
    {
      t: 'canh',
      anh: ['woman-student', 'man-student', 'woman-student', 'sandwich', 'cloud-with-rain'],
      caption: 'Trưa Chủ nhật ở công viên: メアリー mang hộp cơm tự làm, パク mang bánh ngọt, ダニエル đến sau. Đang ăn thì trời kéo mây đen — dù dự báo thời tiết nói cả ngày nắng.',
    },
    {
      t: 'p',
      text: 'Tình huống: **メアリー, パク, ダニエル** đi dã ngoại. Mọi thứ **nhìn thấy trước mắt** đều được nói bằng **～そう** (様態): đồ ăn **おいしそう**, bánh **{甘|あま}そう**, パク **{眠|ねむ}そう**, mây đen kéo đến — **{今|いま}にも{雨|あめ}が{降|ふ}りそう**, cái hộp **{重|おも}そう**, quán cà phê **よさそう**. Còn điều **nghe từ dự báo** thì nói bằng **～そうです** của ポイント 119: **{天気予報|てんきよほう}では、{一日中|いちにちじゅう}{晴|は}れるそうです**. Hai そう đứng cạnh nhau trong một cuộc nói chuyện — nghe kỹ phần đứng trước そう.',
    },
    DL('Ở công viên — "Hộp cơm của Mary trông ngon quá!"', [
      ['ダニエル', 'b', 'わあ、メアリーさんのお{弁当|べんとう}、おいしそうですね！', 'Waa, Mearii-san no obentou, oishisou desu ne!', 'Oa, hộp cơm của Mary trông ngon quá!'],
      ['メアリー', 'a', 'ありがとう。{朝|あさ}{早|はや}く{起|お}きて{作|つく}ったの。このサンドイッチ、{食|た}べてみて。', 'Arigatou. Asa hayaku okite tsukutta no. Kono sandoicchi, tabete mite.', 'Cảm ơn. Mình dậy sớm làm đấy. Ăn thử bánh mì kẹp này đi.'],
      ['ダニエル', 'b', 'いただきます。……{本当|ほんとう}においしい！パクさんのケーキも{甘|あま}そうですね。', 'Itadakimasu. …… Hontou ni oishii! Paku-san no keeki mo amasou desu ne.', 'Mình xin. … Ngon thật! Bánh của Park trông cũng ngọt nhỉ.'],
      ['パク', 'c', 'うん、ちょっと{甘|あま}すぎるかもしれない。ダニエルさん、{甘|あま}いもの、{大丈夫|だいじょうぶ}？', 'Un, chotto amasugiru kamoshirenai. Danieru-san, amai mono, daijoubu?', 'Ừ, có khi hơi ngọt quá. Daniel ăn đồ ngọt được không?'],
      ['ダニエル', 'b', '{大好|だいす}きです。……あれ？パクさん、{眠|ねむ}そうですね。', 'Daisuki desu. …… Are? Paku-san, nemusou desu ne.', 'Mình thích lắm. … Ơ? Park trông buồn ngủ nhỉ.'],
      ['パク', 'c', '{昨日|きのう}、{夜|よる}{遅|おそ}くまでレポートを{書|か}いていたから……。{今|いま}にも{寝|ね}てしまいそう。', 'Kinou, yoru osoku made repooto o kaite ita kara……. Ima ni mo nete shimaisou.', 'Hôm qua mình viết báo cáo đến khuya… Mình sắp ngủ gục đến nơi rồi.'],
      ['メアリー', 'a', 'あ、{空|そら}を{見|み}て。{黒|くろ}い{雲|くも}が{出|で}てきた。{今|いま}にも{雨|あめ}が{降|ふ}りそう。', 'A, sora o mite. Kuroi kumo ga dete kita. Ima ni mo ame ga furisou.', 'Ơ, nhìn trời kìa. Mây đen kéo đến rồi. Trời sắp mưa đến nơi.'],
      ['ダニエル', 'b', 'でも、{今朝|けさ}の{天気予報|てんきよほう}では、{今日|きょう}は{一日中|いちにちじゅう}{晴|は}れるそうですよ。', 'Demo, kesa no tenki yohou de wa, kyou wa ichinichijuu hareru sou desu yo.', 'Nhưng dự báo thời tiết sáng nay nói hôm nay nắng cả ngày mà.'],
      ['パク', 'c', '{風|かぜ}も{強|つよ}くなってきたし、{天気予報|てんきよほう}が{外|はず}れたかもしれないね。', 'Kaze mo tsuyoku natte kita shi, tenki yohou ga hazureta kamoshirenai ne.', 'Gió cũng mạnh lên rồi, có khi dự báo sai rồi đấy.'],
      ['メアリー', 'a', '{早|はや}く{片付|かたづ}けよう。……ダニエルさん、その{箱|はこ}、{重|おも}そうだけど{大丈夫|だいじょうぶ}？', 'Hayaku katazukeyou. …… Danieru-san, sono hako, omosou da kedo daijoubu?', 'Mau dọn thôi. … Daniel ơi, cái hộp đó trông nặng, có sao không?'],
      ['ダニエル', 'b', '{大丈夫|だいじょうぶ}です。{僕|ぼく}が{持|も}ちます。……あっ、{降|ふ}り{出|だ}しました！', 'Daijoubu desu. Boku ga mochimasu. …… A, furidashimashita!', 'Không sao. Mình xách cho. … Á, mưa rồi!'],
      ['パク', 'c', 'この{雨|あめ}、すぐにはやみそうにないね。', 'Kono ame, sugu ni wa yamisou ni nai ne.', 'Mưa này chắc không tạnh ngay đâu nhỉ.'],
      ['メアリー', 'a', 'あそこにカフェがあるよ。{静|しず}かでよさそう。{入|はい}ってみよう。', 'Asoko ni kafe ga aru yo. Shizuka de yosasou. Haitte miyou.', 'Đằng kia có quán cà phê đấy. Trông yên tĩnh, được đấy. Vào thử đi.'],
      ['ダニエル', 'b', 'いいですね。{温|あたた}かいコーヒーでも{飲|の}みながら、ケーキの{続|つづ}きを{食|た}べましょう。', 'Ii desu ne. Atatakai koohii demo nominagara, keeki no tsuzuki o tabemashou.', 'Hay đấy. Vừa uống cà phê nóng vừa ăn nốt bánh nào.'],
    ]),
    {
      t: 'examples',
      items: [
        E('お{弁当|べんとう}、おいしそうですね。', 'Obentou, oishisou desu ne.', 'Hộp cơm trông ngon nhỉ.'),
        E('パクさん、{眠|ねむ}そうですね。', 'Paku-san, nemusou desu ne.', 'Park trông buồn ngủ nhỉ.'),
        E('{今|いま}にも{雨|あめ}が{降|ふ}りそうです。', 'Ima ni mo ame ga furisou desu.', 'Trời sắp mưa đến nơi.'),
        E('{天気予報|てんきよほう}では、{一日中|いちにちじゅう}{晴|は}れるそうです。', 'Tenki yohou de wa, ichinichijuu hareru sou desu.', 'Dự báo thời tiết nói (nghe nói) nắng cả ngày.'),
        E('この{雨|あめ}は、すぐにはやみそうにないですね。', 'Kono ame wa, sugu ni wa yamisou ni nai desu ne.', 'Mưa này chắc không tạnh ngay được.'),
        E('あのカフェ、{静|しず}かでよさそうですね。', 'Ano kafe, shizuka de yosasou desu ne.', 'Quán cà phê kia trông yên tĩnh, có vẻ được đấy.'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ①',
      items: [
        '**おいしそう／{甘|あま}そう／{重|おも}そう／{眠|ねむ}そう** — tính từ い **bỏ い + そう**: nói điều **mắt đang thấy** nhưng **chưa thử / chưa chắc** (chưa ăn mà nhìn thấy ngon). Ăn rồi thì nói thẳng **おいしい！** — ダニエル ăn thử xong đổi ngay sang {本当|ほんとう}においしい.',
        '**{降|ふ}りそう／{寝|ね}てしまいそう** — động từ **thể ます bỏ ます + そう**: "**sắp** … (đến nơi)" — nhìn dấu hiệu (mây đen, mắt díp lại) mà đoán việc sắp xảy ra. **{今|いま}にも** ("đến nơi, bất cứ lúc nào") gần như chỉ đi với ～そう. {寝|ね}てしまいそう = ～てしまう (ôn Bài 19) + そう.',
        '**{晴|は}れるそうです** — ⚠ cùng chữ そう nhưng là **nghe nói** (ポイント 119): đứng sau **thể thường** ({晴|は}れる), không phải thể ます. Nguồn tin đi với **～では／～によると** ({天気予報|てんきよほう}では).',
        '**よさそう** — いい là ngoại lệ: **いい → よさそう** (không nói ~~いそう~~). **やみそうにない** — phủ định của Vます＋そう: "**không có vẻ** sẽ tạnh". **{甘|あま}すぎる** (ôn Bài 17), **{外|はず}れたかもしれない** (mẫu ④ của bài), **{強|つよ}くなってきたし** (～てくる "dần lên" + ～し — ôn Bài 17).',
        '**{降|ふ}り{出|だ}しました** — Vます + {出|だ}す = **bắt đầu (đột ngột)**: {降|ふ}り{出|だ}す (bắt đầu mưa), {泣|な}き{出|だ}す (oà khóc). **～でも{飲|の}みながら** — でも = "hay gì đó" (gợi ý nhẹ), ～ながら (ôn Bài 12).',
      ],
    },

    /* ── ② うわさ ── */
    { t: 'h', text: '② {寮|りょう}のうわさ — "Nghe đâu thầy Honda sắp cưới?"' },
    {
      t: 'canh',
      anh: ['man-student', 'woman-student', 'woman-student', 'speech-balloon', 'ring'],
      caption: 'Tối thứ Năm ở phòng sinh hoạt chung của ký túc xá: マルコ hớt hải chạy vào báo một "tin nóng" về thầy 本田. リン tò mò, còn アンナ nhớ ra hôm qua đã thấy thầy ở nhà ga với một phụ nữ lạ.',
    },
    {
      t: 'p',
      text: 'Tình huống: **マルコ** nghe một tin đồn từ lớp bên cạnh — **{先生|せんせい}、{結婚|けっこん}するらしいよ** (**～らしい**: đoán theo thông tin nghe được). **リン** nhận xét từ điều chính mình thấy — **{最近|さいきん}{楽|たの}しそう**. **アンナ** kể đã thấy thầy đi với một người phụ nữ, **{指輪|ゆびわ}をしていたみたい** (**～みたい**: đoán từ dấu hiệu mình thấy, văn nói của ～ようだ). Cả nhóm đưa ra khả năng — **{相手|あいて}かもしれない** (**～かもしれない**) — và lý lẽ — **{先生|せんせい}は{言|い}わないはずだよ** (**～はず**). Hôm sau thầy 本田 kể **sự thật** — một bài học về việc đừng tin ngay tin đồn.',
    },
    DL('Ở ký túc xá — "Nghe chưa? Tin nóng đây!"', [
      ['マルコ', 'b', 'リンさん、{聞|き}いた？{本田先生|ほんだせんせい}、{来月|らいげつ}{結婚|けっこん}するらしいよ。', 'Rin-san, kiita? Honda-sensei, raigetsu kekkon suru rashii yo.', 'Lin ơi, nghe chưa? Nghe đâu tháng sau thầy Honda cưới đấy.'],
      ['リン', 'a', 'えっ、{本当|ほんとう}？{誰|だれ}に{聞|き}いたの？', 'E, hontou? Dare ni kiita no?', 'Hả, thật á? Cậu nghe ai nói?'],
      ['マルコ', 'b', '{隣|となり}のクラスの{人|ひと}が{話|はな}していたんだ。まだ{秘密|ひみつ}らしいけど。', 'Tonari no kurasu no hito ga hanashite ita n da. Mada himitsu rashii kedo.', 'Người lớp bên cạnh nói chuyện đó. Hình như vẫn còn là bí mật.'],
      ['リン', 'a', 'そういえば、{最近|さいきん}の{先生|せんせい}、なんだかとても{楽|たの}しそうだよね。', 'Sou ieba, saikin no sensei, nandaka totemo tanoshisou da yo ne.', 'Nói mới nhớ, dạo này thầy trông vui hẳn nhỉ.'],
      ['アンナ', 'c', 'あ、{私|わたし}、{昨日|きのう}{駅|えき}で{先生|せんせい}を{見|み}たよ。きれいな{女|おんな}の{人|ひと}と{楽|たの}しそうに{話|はな}していた。', 'A, watashi, kinou eki de sensei o mita yo. Kirei na onna no hito to tanoshisou ni hanashite ita.', 'À, hôm qua mình thấy thầy ở ga đấy. Thầy đang nói chuyện vui vẻ với một chị rất xinh.'],
      ['マルコ', 'b', 'やっぱり！その{人|ひと}が{結婚|けっこん}の{相手|あいて}かもしれないね。', 'Yappari! Sono hito ga kekkon no aite kamoshirenai ne.', 'Biết ngay mà! Có khi người đó là cô dâu đấy.'],
      ['リン', 'a', '{先生|せんせい}、{指輪|ゆびわ}をしていた？', 'Sensei, yubiwa o shite ita?', 'Thầy có đeo nhẫn không?'],
      ['アンナ', 'c', 'うーん、よく{見|み}えなかったけど、していたみたい。', 'Uun, yoku mienakatta kedo, shite ita mitai.', 'Ừm, mình không nhìn rõ, nhưng hình như có đeo.'],
      ['リン', 'a', 'でも、{先生|せんせい}は{前|まえ}に「{僕|ぼく}はずっと{独身|どくしん}です」って{言|い}っていたよ。', 'Demo, sensei wa mae ni "Boku wa zutto dokushin desu" tte itte ita yo.', 'Nhưng trước đây thầy nói "Tôi vẫn độc thân" mà.'],
      ['マルコ', 'b', 'それは{去年|きょねん}の{話|はなし}でしょう？{今年|ことし}、{彼女|かのじょ}ができたのかもしれないよ。', 'Sore wa kyonen no hanashi deshou? Kotoshi, kanojo ga dekita no kamoshirenai yo.', 'Đó là chuyện năm ngoái chứ? Có khi năm nay thầy có bạn gái rồi.'],
      ['アンナ', 'c', 'そういえば、あの{女|おんな}の{人|ひと}、{先生|せんせい}にちょっと{似|に}ていたよ。', 'Sou ieba, ano onna no hito, sensei ni chotto nite ita yo.', 'Nói mới nhớ, chị đó trông hơi giống thầy đấy.'],
      ['リン', 'a', '{明日|あした}の{授業|じゅぎょう}で、{先生|せんせい}に{聞|き}いてみようか。', 'Ashita no jugyou de, sensei ni kiite miyou ka.', 'Mai trong giờ học thử hỏi thầy xem nhé?'],
      ['マルコ', 'b', 'だめだよ。まだ{秘密|ひみつ}なら、{聞|き}いても{先生|せんせい}は{言|い}わないはずだよ。', 'Dame da yo. Mada himitsu nara, kiite mo sensei wa iwanai hazu da yo.', 'Không được đâu. Nếu còn bí mật thì có hỏi thầy chắc chắn cũng không nói đâu.'],
      ['リン', 'a', 'そうだね。でも、{本当|ほんとう}だったら、みんなでお{祝|いわ}いしたいね。', 'Sou da ne. Demo, hontou dattara, minna de oiwai shitai ne.', 'Ừ nhỉ. Nhưng nếu thật thì muốn cả lớp cùng chúc mừng thầy ghê.'],
    ]),
    DL('②′ Hôm sau trong lớp — sự thật', [
      ['{本田先生|ほんだせんせい}', 'examiner', 'みなさん、{何|なに}をそんなに{楽|たの}しそうに{話|はな}しているんですか。', 'Minasan, nani o sonna ni tanoshisou ni hanashite iru n desu ka.', 'Các em đang nói chuyện gì mà vui thế?'],
      ['リン', 'a', 'あのう、{先生|せんせい}……{来月|らいげつ}{結婚|けっこん}するって{本当|ほんとう}ですか。', 'Anou, sensei…… raigetsu kekkon suru tte hontou desu ka.', 'Dạ, thầy ơi… tháng sau thầy cưới có thật không ạ?'],
      ['{本田先生|ほんだせんせい}', 'examiner', 'えっ？{結婚|けっこん}するのは{僕|ぼく}じゃなくて、{妹|いもうと}ですよ。', 'E? Kekkon suru no wa boku ja nakute, imouto desu yo.', 'Hả? Người cưới không phải thầy mà là em gái thầy đấy.'],
      ['マルコ', 'b', 'えっ、じゃ、{駅|えき}で{一緒|いっしょ}にいた{女|おんな}の{人|ひと}は……。', 'E, ja, eki de issho ni ita onna no hito wa…….', 'Ơ, vậy chị đi cùng thầy ở ga là…'],
      ['{本田先生|ほんだせんせい}', 'examiner', 'ああ、それが{妹|いもうと}です。{結婚式|けっこんしき}の{相談|そうだん}をしていたんです。{顔|かお}がよく{似|に}ているでしょう？', 'Aa, sore ga imouto desu. Kekkonshiki no soudan o shite ita n desu. Kao ga yoku nite iru deshou?', 'À, đó là em gái thầy. Hai anh em bàn chuyện đám cưới. Mặt giống nhau lắm đúng không?'],
      ['アンナ', 'c', 'はい、そっくりでした。じゃ、{指輪|ゆびわ}も……。', 'Hai, sokkuri deshita. Ja, yubiwa mo…….', 'Dạ, giống y hệt ạ. Vậy còn cái nhẫn…'],
      ['{本田先生|ほんだせんせい}', 'examiner', '{指輪|ゆびわ}？これは{時計|とけい}ですよ。……うわさはすぐに{広|ひろ}がりますね。みなさん、うわさをそのまま{信|しん}じてはいけませんよ。', 'Yubiwa? Kore wa tokei desu yo. …… Uwasa wa sugu ni hirogarimasu ne. Minasan, uwasa o sono mama shinjite wa ikemasen yo.', 'Nhẫn á? Đây là đồng hồ mà. … Tin đồn lan nhanh thật. Các em đừng tin ngay tin đồn nhé.'],
      ['マルコ', 'b', 'すみません……。うわさは{半分|はんぶん}だけ{本当|ほんとう}だったんですね。', 'Sumimasen……. Uwasa wa hanbun dake hontou datta n desu ne.', 'Em xin lỗi… Hoá ra tin đồn chỉ đúng một nửa.'],
      ['{本田先生|ほんだせんせい}', 'examiner', 'そうですね。じゃ、{今日|きょう}の{授業|じゅぎょう}は「うわさ」の{文法|ぶんぽう}にしましょう。ちょうどいいですね。', 'Sou desu ne. Ja, kyou no jugyou wa "uwasa" no bunpou ni shimashou. Choudo ii desu ne.', 'Đúng vậy. Thế thì hôm nay ta học ngữ pháp "tin đồn" nhé. Thật vừa khéo.'],
    ]),
    {
      t: 'examples',
      items: [
        E('{本田先生|ほんだせんせい}、{来月|らいげつ}{結婚|けっこん}するらしいよ。', 'Honda-sensei, raigetsu kekkon suru rashii yo.', 'Nghe đâu tháng sau thầy Honda cưới đấy. (đoán theo tin nghe được)'),
        E('{最近|さいきん}の{先生|せんせい}、{楽|たの}しそうだよね。', 'Saikin no sensei, tanoshisou da yo ne.', 'Dạo này thầy trông vui nhỉ. (mắt thấy)'),
        E('{指輪|ゆびわ}をしていたみたい。', 'Yubiwa o shite ita mitai.', 'Hình như (thầy) có đeo nhẫn. (đoán từ điều mình thấy, văn nói)'),
        E('その{人|ひと}が{結婚|けっこん}の{相手|あいて}かもしれない。', 'Sono hito ga kekkon no aite kamoshirenai.', 'Có khi người đó là cô dâu.'),
        E('{秘密|ひみつ}なら、{先生|せんせい}は{言|い}わないはずだ。', 'Himitsu nara, sensei wa iwanai hazu da.', 'Nếu là bí mật thì chắc chắn thầy không nói. (có lý lẽ)'),
        E('うわさをそのまま{信|しん}じてはいけません。', 'Uwasa o sono mama shinjite wa ikemasen.', 'Không được tin ngay tin đồn.'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ②',
      items: [
        '**{結婚|けっこん}するらしい／{秘密|ひみつ}らしい** — **～らしい** = "nghe đâu, hình như" — điều người nói **nghe từ người khác** rồi truyền lại kèm chút suy đoán, **không chịu trách nhiệm** về độ đúng. Danh từ + らしい **không có だ**: ~~{秘密|ひみつ}だらしい~~ → {秘密|ひみつ}らしい.',
        '**していたみたい** — **～みたい** = "hình như" — đoán từ **điều chính mình thấy / cảm nhận** (アンナ có nhìn, dù không rõ). Là **văn nói** của **～ようだ** (lịch sự / văn viết: {指輪|ゆびわ}をしていたようです).',
        '**{相手|あいて}かもしれない／できたのかもしれない** — **～かもしれない** = "có thể, có khi": chỉ là một **khả năng** (~50%), người nói không có căn cứ chắc. ～のかもしれない = かもしれない + の giải thích ("có khi là vì…").',
        '**{言|い}わないはずだ** — **～はず** = "chắc chắn là, theo lý thì": người nói **có lý lẽ** (đã là bí mật → thầy sẽ không nói). Chắc hơn かもしれない nhiều. **{聞|き}いても** (ôn ポイント 121) · **{秘密|ひみつ}なら** (ôn Bài 17).',
        '**{楽|たの}しそうに{話|はな}していた** — ～そう + **に** đứng trước động từ = "một cách (trông) vui vẻ". **そっくり** = giống y hệt (N3). **うわさが{広|ひろ}がる** = tin đồn lan ra. **～って{本当|ほんとう}ですか** = "chuyện ~ là thật ạ?" (って = という — văn nói).',
      ],
    },

    /* ── ③ ひまわり食堂 ── */
    { t: 'h', text: '③ ひまわり{食堂|しょくどう} — "Lẽ ra 10 giờ rau phải đến rồi chứ…"' },
    {
      t: 'canh',
      anh: ['man-cook', 'man-student', 'leafy-green', 'delivery-truck', 'curry-rice'],
      caption: '10 giờ rưỡi sáng ở quán ひまわり食堂: chưa đến giờ mở cửa nhưng xe rau quen thuộc vẫn chưa thấy đâu. ナタポン gọi điện hỏi, rồi kể cho anh 小林 một tin đồn nghe được ở trước ga.',
    },
    {
      t: 'p',
      text: 'Tình huống: rau thường giao lúc 10 giờ — **10{時|じ}に{届|とど}くはずなんですが……** (**～はず**: có căn cứ là lịch giao hàng) — nhưng đến 10 rưỡi vẫn chưa thấy. ナタポン đoán **{道|みち}が{混|こ}んでいるのかもしれません** (**～かもしれない**), rồi **gọi thử** (～てみる, ôn Bài 19). Người cửa hàng rau báo xe hỏng và hứa **11{時|じ}までには{着|つ}くはずです**. Sau đó ナタポン kể tin đồn **{駅前|えきまえ}に{新|あたら}しいカレー{屋|や}ができるらしい** — anh 小林 lo **お{客|きゃく}さんが{減|へ}るかもしれない**, còn ナタポン tin **{来|き}てくれるはずです**.',
    },
    DL('Ở quán ひまわり食堂 — "Rau vẫn chưa đến à?"', [
      ['{小林店長|こばやしてんちょう}', 'examiner', 'ナタポンくん、{野菜|やさい}はもう{届|とど}いた？', 'Natapon-kun, yasai wa mou todoita?', 'Nattapon, rau đến chưa em?'],
      ['ナタポン', 'b', 'いいえ、まだです。いつも10{時|じ}に{届|とど}くはずなんですが……。', 'Iie, mada desu. Itsumo juuji ni todoku hazu na n desu ga…….', 'Dạ chưa ạ. Theo lệ thì 10 giờ là đến rồi…'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'もう10{時半|じはん}だよ。{毎週|まいしゅう}{時間|じかん}どおりに{来|く}るのに、おかしいね。', 'Mou juuji han da yo. Maishuu jikan doori ni kuru noni, okashii ne.', 'Đã 10 rưỡi rồi đấy. Tuần nào cũng đến đúng giờ vậy mà, lạ thật.'],
      ['ナタポン', 'b', '{道|みち}が{混|こ}んでいるのかもしれません。{電話|でんわ}してみましょうか。', 'Michi ga konde iru no kamoshiremasen. Denwa shite mimashou ka.', 'Có khi đường đang tắc ạ. Em gọi điện thử nhé?'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'うん、お{願|ねが}い。', 'Un, onegai.', 'Ừ, nhờ em.'],
      ['{八百屋|やおや}の{人|ひと}', 'a', 'はい、みどり{八百屋|やおや}です。', 'Hai, Midori yaoya desu.', 'Vâng, cửa hàng rau Midori xin nghe.'],
      ['ナタポン', 'b', 'ひまわり{食堂|しょくどう}のナタポンです。{今日|きょう}の{野菜|やさい}がまだ{届|とど}いていないんですが……。', 'Himawari shokudou no Natapon desu. Kyou no yasai ga mada todoite inai n desu ga…….', 'Em là Nattapon ở quán Himawari. Rau hôm nay vẫn chưa đến ạ…'],
      ['{八百屋|やおや}の{人|ひと}', 'a', '{申|もう}し{訳|わけ}ありません！トラックが{故障|こしょう}してしまって……。{今|いま}、{別|べつ}の{車|くるま}でそちらに{向|む}かっていますから、11{時|じ}までには{着|つ}くはずです。', 'Moushiwake arimasen! Torakku ga koshou shite shimatte……. Ima, betsu no kuruma de sochira ni mukatte imasu kara, juuichiji made ni wa tsuku hazu desu.', 'Thành thật xin lỗi! Xe tải bị hỏng mất… Bây giờ đang có xe khác đi đến chỗ quán, nên chắc chắn trước 11 giờ sẽ tới ạ.'],
      ['ナタポン', 'b', 'わかりました。よろしくお{願|ねが}いします。……{店長|てんちょう}、トラックが{故障|こしょう}したそうです。11{時|じ}までには{着|つ}くはずだそうです。', 'Wakarimashita. Yoroshiku onegai shimasu. …… Tenchou, torakku ga koshou shita sou desu. Juuichiji made ni wa tsuku hazu da sou desu.', 'Vâng ạ. Nhờ chị. … Anh ơi, nghe nói xe tải bị hỏng. Họ bảo chắc chắn trước 11 giờ sẽ tới.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'そうか。ランチは11{時半|じはん}からだから、{間|ま}に{合|あ}うはずだね。よかった。', 'Sou ka. Ranchi wa juuichiji han kara da kara, ma ni au hazu da ne. Yokatta.', 'Vậy à. Bữa trưa từ 11 rưỡi nên chắc là kịp. May quá.'],
      ['ナタポン', 'b', 'あ、それから{店長|てんちょう}、うわさなんですが、{駅前|えきまえ}に{新|あたら}しいカレー{屋|や}ができるらしいですよ。', 'A, sorekara tenchou, uwasa na n desu ga, ekimae ni atarashii karee-ya ga dekiru rashii desu yo.', 'À, còn nữa anh ạ, em nghe đồn là trước ga sắp mở một quán cà ri mới.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'えっ、{本当|ほんとう}？どこで{聞|き}いたの？', 'E, hontou? Doko de kiita no?', 'Hả, thật à? Em nghe ở đâu thế?'],
      ['ナタポン', 'b', '{常連|じょうれん}のお{客|きゃく}さんが{話|はな}していました。{昨日|きのう}{見|み}たら、{本当|ほんとう}に{工事|こうじ}をしているようでした。', 'Jouren no okyaku-san ga hanashite imashita. Kinou mitara, hontou ni kouji o shite iru you deshita.', 'Một khách quen nói với em ạ. Hôm qua em ra xem thì có vẻ đúng là đang thi công.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'そうか……。うちのお{客|きゃく}さんが{減|へ}るかもしれないな。', 'Sou ka……. Uchi no okyaku-san ga heru kamoshirenai na.', 'Vậy à… Khách của quán mình có khi sẽ ít đi đây.'],
      ['ナタポン', 'b', '{大丈夫|だいじょうぶ}ですよ。ここのカレーは{人気|にんき}がありますから、みなさん{来|き}てくれるはずです。', 'Daijoubu desu yo. Koko no karee wa ninki ga arimasu kara, minasan kite kureru hazu desu.', 'Không sao đâu anh. Cà ri ở đây được yêu thích lắm, chắc chắn mọi người vẫn đến.'],
      ['{小林店長|こばやしてんちょう}', 'examiner', 'ありがとう。じゃ、ナタポンくんの{新|あたら}しいカレーも、もっとおいしくしよう。', 'Arigatou. Ja, Natapon-kun no atarashii karee mo, motto oishiku shiyou.', 'Cảm ơn em. Vậy mình làm món cà ri mới của Nattapon ngon hơn nữa nào.'],
    ]),
    {
      t: 'examples',
      items: [
        E('いつも10{時|じ}に{届|とど}くはずなんですが……。', 'Itsumo juuji ni todoku hazu na n desu ga…….', 'Theo lệ thì 10 giờ là phải đến rồi… (có căn cứ, nhưng chưa thấy)'),
        E('{道|みち}が{混|こ}んでいるのかもしれません。', 'Michi ga konde iru no kamoshiremasen.', 'Có khi (là vì) đường đang tắc.'),
        E('11{時|じ}までには{着|つ}くはずです。', 'Juuichiji made ni wa tsuku hazu desu.', 'Chắc chắn trước 11 giờ sẽ tới.'),
        E('{駅前|えきまえ}に{新|あたら}しいカレー{屋|や}ができるらしいですよ。', 'Ekimae ni atarashii karee-ya ga dekiru rashii desu yo.', 'Nghe đồn trước ga sắp mở quán cà ri mới đấy.'),
        E('{本当|ほんとう}に{工事|こうじ}をしているようでした。', 'Hontou ni kouji o shite iru you deshita.', 'Có vẻ đúng là đang thi công. (mình đã thấy)'),
        E('お{客|きゃく}さんが{減|へ}るかもしれない。', 'Okyaku-san ga heru kamoshirenai.', 'Khách có khi sẽ giảm.'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ③',
      items: [
        '**{届|とど}くはずなんですが……** — ～はず + **なんですが** (ôn ～んです ポイント 104) rồi bỏ lửng: "theo lẽ thì phải… vậy mà chưa" — cách nói rất hay dùng khi **điều có căn cứ** lại **không xảy ra**. Cùng ý: **{来|く}るはずなのに** (～はず + のに, ôn Bài 19).',
        '**{混|こ}んでいるのかもしれません** — đoán **lý do** bằng ～**の**かもしれない. Lịch sự: **かもしれません**. Ở chỗ làm, người Nhật hay đưa ra phỏng đoán bằng かもしれません cho mềm, rồi đề nghị kiểm tra ({電話|でんわ}してみましょうか).',
        '**{着|つ}くはずだそうです** — hai mẫu chồng nhau: người cửa hàng rau nói "{着|つ}くはずです" → ナタポン **truyền lại** = **～はずだ + そうです** (nghe nói). **{故障|こしょう}したそうです** — ポイント 119.',
        '**{工事|こうじ}をしているようでした** — ～ようだ: ナタポン **tự đi xem** rồi đoán từ dấu hiệu (công trường, bảng hiệu). Đổi sang quá khứ ở **ようでした**. Tin nghe từ khách thì dùng **らしい** — một cuộc nói chuyện có đủ cả hai nguồn tin.',
        '**{時間|じかん}どおりに** = đúng giờ (N + どおり). **{常連|じょうれん}のお{客|きゃく}さん** = khách quen (N3). **{減|へ}る** = giảm (N4; ⇔ {増|ふ}える). **カレー{屋|や}** = quán cà ri (～{屋|や} = cửa hàng ~). **{間|ま}に{合|あ}う** (ôn Bài 15). **おいしくしよう** = イA く + する (làm cho) + thể ý chí (ôn Bài 16).',
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b20-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 48 từ N4: tin đồn & tin tức, người yêu & các mối quan hệ, vẻ ngoài & tâm trạng, thời tiết & dấu hiệu, suy đoán & kiểm chứng',
  goal: 'Thuộc 48 từ của chủ đề tin đồn: tin đồn và tin tức (うわさ・うそ・秘密・情報・話題・発表する・伝える・信じる・驚く・実は・まさか・確か), người yêu và các mối quan hệ (付き合う・彼・彼女・彼氏・相手・指輪・独身・仲がいい・けんかする・幸せ), vẻ ngoài và tâm trạng (様子・顔色・具合・気分・表情・機嫌・似ている・太る・やせる・落ち込む), thời tiết và dấu hiệu (雲・今にも・降り出す・吹く・雷・星・電池・切れる), suy đoán và kiểm chứng (もしかしたら・絶対・まるで・本物・予想する・当たる・外れる・確認する) — và biết từ nào hay đi với mẫu nào (今にも～そう, まるで～ようだ, もしかしたら～かもしれない).',
  minutes: 50,
  blocks: [
    {
      t: 'p',
      text: '**48 từ** chia 5 nhóm theo đúng các tình huống của bài: **A** tin đồn & tin tức (12) · **B** người yêu & các mối quan hệ (10) · **C** vẻ ngoài & tâm trạng (10) · **D** thời tiết & dấu hiệu (8) · **E** suy đoán & kiểm chứng (8). Từ đã học ở Bài 1–19 ({本当|ほんとう}, {恋人|こいびと}, {結婚|けっこん}, {別|わか}れる, {天気予報|てんきよほう}, {人気|にんき}, {雑誌|ざっし}, ニュース, {寂|さび}しい, {眠|ねむ}い, びっくり, {心配|しんぱい}, {安心|あんしん}…) KHÔNG lặp lại — gặp trong câu ví dụ thì coi như ôn. Số **1 / 2 / 3** sau động từ = nhóm động từ; dòng **"+"** cho **dạng ghép với ～そう** khi từ đó rất hay đi với そう. Từ ghi **N3** là từ hơi vượt cấp nhưng rất hay gặp trong chủ đề này.',
    },
    {
      t: 'note',
      title: 'Cách học 48 từ trong 3 ngày',
      items: [
        '**Ngày 1** — nhóm A + B (22 từ): đọc to theo 🔊, che nghĩa tự nói; đọc to hội thoại ② — gần như cả hai nhóm nằm trong đó. Kể lại tin đồn thầy 本田 bằng chính các từ うわさ, {秘密|ひみつ}, {相手|あいて}, {指輪|ゆびわ}, {独身|どくしん}, {信|しん}じる.',
        '**Ngày 2** — nhóm C + D (18 từ): nhìn ảnh người quen / trời hôm nay rồi nói thành câu ～そう: {顔色|かおいろ}が{悪|わる}そう, {具合|ぐあい}が{悪|わる}そう, {今|いま}にも{雨|あめ}が{降|ふ}りそう, {電池|でんち}が{切|き}れそう.',
        '**Ngày 3** — nhóm E (8 từ) + thẻ hình + bảng "Từ dễ nhầm" + trắc nghiệm cuối mục + viết tay 10 từ hay vào đề.',
        'Romaji: trường âm viết đôi ({情報|じょうほう} → **jouhou**, {表情|ひょうじょう} → **hyoujou**, {予想|よそう} → **yosou**, {様子|ようす} → **yousu**); âm ngắt っ viết đôi phụ âm ({発表|はっぴょう} → **happyou**, {絶対|ぜったい} → **zettai**); ん trước nguyên âm thêm dấu nháy nếu cần ({今|いま}にも → **ima ni mo**).',
      ],
    },

    /* ── A ── */
    { t: 'h', text: 'A. Tin đồn & tin tức (12 từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'うわさ', pos: 'danh từ / động từ nhóm 3 (うわさする)', ipa: 'uwasa', vi: 'tin đồn, lời đồn; chuyện bàn tán về ai', ex: 'クラスで{本田先生|ほんだせんせい}のうわさを{聞|き}きました。', exRo: 'Kurasu de Honda-sensei no uwasa o kikimashita.', exVi: 'Tôi nghe được một tin đồn về thầy Honda ở lớp.', more: 'Chữ Hán 噂 không thuộc bảng thường dụng — viết **かな**. **うわさが{広|ひろ}がる** (lan ra) · **うわさを{聞|き}く／する** · うわさ{話|ばなし} (chuyện ngồi lê). Thành ngữ: うわさをすれば{影|かげ} — "vừa nhắc Tào Tháo" (N2).' },
        { w: 'うそ', pos: 'danh từ', ipa: 'uso', vi: 'lời nói dối, điều không thật', ex: '{彼|かれ}はうそをつく{人|ひと}じゃありません。', exRo: 'Kare wa uso o tsuku hito ja arimasen.', exVi: 'Anh ấy không phải người nói dối.', more: '**うそをつく** = nói dối — cụm chuẩn đi với **つく** (うそを{言|い}う cũng nghe thấy trong văn nói, nhưng khi viết / làm đề hãy dùng うそをつく). 「うそ！」「うそでしょう？」 = "Không thể nào! / Thật á?" — văn nói, ngạc nhiên chứ không buộc tội. Đối: {本当|ほんとう} (Bài 2). Chữ 嘘 cấp cao — viết かな.' },
        { w: '{秘密|ひみつ}', pos: 'danh từ', ipa: 'himitsu', vi: 'bí mật', ex: 'これは{二人|ふたり}だけの{秘密|ひみつ}ですよ。', exRo: 'Kore wa futari dake no himitsu desu yo.', exVi: 'Đây là bí mật của riêng hai chúng ta đấy.', more: '**{秘密|ひみつ}を{守|まも}る** (giữ bí mật — 守 Bài 16) · {秘密|ひみつ}にする (giữ kín) · {秘密|ひみつ}がばれる (lộ — N3). Chữ 秘・密 cấp cao (N2) — đọc được là đủ.' },
        { w: '{情報|じょうほう}', pos: 'danh từ', ipa: 'jouhou', vi: 'thông tin', ex: 'インターネットで{旅行|りょこう}の{情報|じょうほう}を{集|あつ}めました。', exRo: 'Intaanetto de ryokou no jouhou o atsumemashita.', exVi: 'Tôi đã thu thập thông tin du lịch trên mạng.', more: '{情報|じょうほう}を{集|あつ}める／{調|しら}べる · **{確|たし}かな{情報|じょうほう}** (thông tin chắc chắn) ↔ うわさ. {情報|じょうほう}{工学|こうがく} (CNTT). Chữ **情・報** là chữ Hán mới; 報 cũng trong {天気予報|てんきよほう}.' },
        { w: '{話題|わだい}', pos: 'danh từ', ipa: 'wadai', vi: 'đề tài, chuyện được bàn tán', ex: '{駅前|えきまえ}の{新|あたら}しいカフェが{学校|がっこう}で{話題|わだい}になっています。', exRo: 'Ekimae no atarashii kafe ga gakkou de wadai ni natte imasu.', exVi: 'Quán cà phê mới trước ga đang thành chuyện được bàn tán ở trường.', more: '**{話題|わだい}になる** (thành đề tài, gây chú ý) · {話題|わだい}を{変|か}える (đổi chủ đề) · {話題|わだい}の{映画|えいが} (bộ phim đang hot). N3.' },
        { w: '{発表|はっぴょう}します［{発表|はっぴょう}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'happyou shimasu [happyou suru]', vi: 'công bố; thuyết trình', ex: '{来週|らいしゅう}の{授業|じゅぎょう}で、グループの{調査|ちょうさ}を{発表|はっぴょう}します。', exRo: 'Raishuu no jugyou de, guruupu no chousa o happyou shimasu.', exVi: 'Giờ học tuần sau, nhóm tôi sẽ thuyết trình kết quả khảo sát.', more: 'Hai nghĩa: **công bố** chính thức ({合格者|ごうかくしゃ}を{発表|はっぴょう}する, {結婚|けっこん}を{発表|はっぴょう}する) và **thuyết trình** ở lớp. Khác うわさ: {発表|はっぴょう} là tin CHÍNH THỨC. 発 (Bài 17) + **表** (chữ mới).' },
        { w: '{伝|つた}えます［{伝|つた}える］2', pos: 'động từ nhóm 2', ipa: 'tsutaemasu [tsutaeru]', vi: 'truyền đạt, nhắn lại, chuyển lời', ex: '{先生|せんせい}に「{明日|あした}は{休|やす}みます」と{伝|つた}えてください。', exRo: 'Sensei ni "Ashita wa yasumimasu" to tsutaete kudasai.', exVi: 'Nhờ bạn nhắn với thầy là "Ngày mai em nghỉ".', more: '+ て: {伝|つた}えて. **人に N を／「…」と{伝|つた}える**. Câu cố định khi nhờ chuyển lời: **よろしくお{伝|つた}えください** (cho tôi gửi lời hỏi thăm). Học sâu "nhắn lại" ở Bài 30.' },
        { w: '{信|しん}じます［{信|しん}じる］2', pos: 'động từ nhóm 2', ipa: 'shinjimasu [shinjiru]', vi: 'tin, tin tưởng', ex: 'そんなうわさは{信|しん}じないほうがいいですよ。', exRo: 'Sonna uwasa wa shinjinai hou ga ii desu yo.', exVi: 'Tin đồn như thế thì không nên tin đâu.', more: '+ て: {信|しん}じて. **N を{信|しん}じる** (tin vào điều gì / tin ai). {信|しん}じられない！ = "Không thể tin nổi!" (thể khả năng — ôn Bài 16).' },
        { w: '{驚|おどろ}きます［{驚|おどろ}く］1', pos: 'động từ nhóm 1', ipa: 'odorokimasu [odoroku]', vi: 'ngạc nhiên, giật mình', ex: '{先生|せんせい}のニュースを{聞|き}いて、みんな{驚|おどろ}きました。', exRo: 'Sensei no nyuusu o kiite, minna odorokimashita.', exVi: 'Nghe tin về thầy, ai cũng ngạc nhiên.', more: '+ て: **{驚|おどろ}いて**. **N に{驚|おどろ}く**. ≈ びっくりする (văn nói); {驚|おどろ}く trang trọng hơn, hay gặp trong bài đọc. Chữ 驚 cấp cao — đọc được là đủ (khác 警 trong 警察, Bài 19).' },
        { w: '{実|じつ}は', pos: 'phó từ (đầu câu)', ipa: 'jitsu wa', vi: 'thật ra là, nói thật là', ex: '{実|じつ}は、{私|わたし}も{同|おな}じうわさを{聞|き}いたんです。', exRo: 'Jitsu wa, watashi mo onaji uwasa o kiita n desu.', exVi: 'Thật ra tôi cũng nghe cùng tin đồn đó.', more: 'Mở đầu một điều **chưa nói / bất ngờ / khó nói**, rất hay đi với **～んです** (ポイント 104): {実|じつ}は、お{願|ねが}いがあるんですが…… (thật ra là tôi có việc muốn nhờ). Chữ **実** là chữ Hán mới.' },
        { w: 'まさか', pos: 'phó từ', ipa: 'masaka', vi: 'không lẽ nào, chẳng lẽ', ex: '「{先生|せんせい}が{結婚|けっこん}？」「まさか！」', exRo: '"Sensei ga kekkon?" "Masaka!"', exVi: '"Thầy cưới á?" "Không thể nào!"', more: 'Đứng một mình = "Không đời nào!". **まさか～ないでしょう** = chẳng lẽ lại… (không tin điều đó xảy ra): まさか{忘|わす}れていないでしょうね (chẳng lẽ cậu quên rồi?). N3.' },
        { w: '{確|たし}か', pos: 'phó từ / tính từ な', ipa: 'tashika', vi: '(phó từ) hình như là, nếu tôi nhớ không nhầm; (ナA) chắc chắn', ex: '{確|たし}か、{西川|にしかわ}さんは{来月|らいげつ}{引|ひ}っ{越|こ}すと{言|い}っていました。', exRo: 'Tashika, Nishikawa-san wa raigetsu hikkosu to itte imashita.', exVi: 'Nếu tôi nhớ không nhầm thì anh Nishikawa nói tháng sau chuyển nhà.', more: 'Đầu câu = nhớ **không chắc lắm**. ナA: **{確|たし}かな{情報|じょうほう}** (thông tin xác thực). **{確|たし}かに** = quả thật, đúng là: {確|たし}かに{高|たか}いですね. {確|たし}かめる (kiểm tra cho chắc — Bài 19). Chữ **確** là chữ Hán mới.' },
      ],
    },

    /* ── B ── */
    { t: 'h', text: 'B. Người yêu & các mối quan hệ (10 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{付|つ}き{合|あ}います［{付|つ}き{合|あ}う］1', pos: 'động từ nhóm 1', ipa: 'tsukiaimasu [tsukiau]', vi: 'hẹn hò, yêu nhau; giao du; đi cùng (cho có bạn)', ex: '{兄|あに}は{大学|だいがく}のときから{今|いま}の{奥|おく}さんと{付|つ}き{合|あ}っていました。', exRo: 'Ani wa daigaku no toki kara ima no okusan to tsukiatte imashita.', exVi: 'Anh trai tôi đã quen (hẹn hò với) vợ anh ấy từ hồi đại học.', more: '+ て: **{付|つ}き{合|あ}って**. **人と{付|つ}き{合|あ}う**. Đang hẹn hò = {付|つ}き{合|あ}っている. Nghĩa "đi cùng": {買|か}い{物|もの}に{付|つ}き{合|あ}ってくれる？ (đi mua sắm cùng tớ nhé?).' },
        { w: '{彼|かれ}', pos: 'danh từ (đại từ)', ipa: 'kare', vi: 'anh ấy; bạn trai', ex: '{彼|かれ}はいつも{約束|やくそく}を{守|まも}る{人|ひと}です。', exRo: 'Kare wa itsumo yakusoku o mamoru hito desu.', exVi: 'Anh ấy là người luôn giữ lời hứa.', more: '⚠ Người Nhật **ít dùng 彼 để gọi người trước mặt** hay người trên — gọi bằng TÊN + さん. 彼 hay dùng trong bài đọc, kể chuyện; trong văn nói thân mật 彼 còn nghĩa "bạn trai". Chữ **彼** là chữ Hán mới.' },
        { w: '{彼女|かのじょ}', pos: 'danh từ (đại từ)', ipa: 'kanojo', vi: 'cô ấy; bạn gái', ex: '{彼女|かのじょ}は{料理|りょうり}がとても{上手|じょうず}です。', exRo: 'Kanojo wa ryouri ga totemo jouzu desu.', exVi: 'Cô ấy nấu ăn rất giỏi.', more: '**{彼女|かのじょ}ができる** = có bạn gái. Cùng lưu ý với 彼: không dùng để gọi người trên. {彼|かれ}ら = họ (nhóm người — N3).' },
        { w: '{彼氏|かれし}', pos: 'danh từ', ipa: 'kareshi', vi: 'bạn trai (văn nói)', ex: '{姉|あね}に{彼氏|かれし}ができたみたいです。', exRo: 'Ane ni kareshi ga dekita mitai desu.', exVi: 'Hình như chị tôi có bạn trai rồi.', more: '**{彼氏|かれし}／{彼女|かのじょ}ができる** · {彼氏|かれし}がいる. Trang trọng hơn: {恋人|こいびと} (Bài 8). N3.' },
        { w: '{相手|あいて}', pos: 'danh từ', ipa: 'aite', vi: 'đối phương, người kia; người (cùng làm gì) với mình', ex: '{話|はな}すときは、{相手|あいて}の{目|め}を{見|み}てください。', exRo: 'Hanasu toki wa, aite no me o mite kudasai.', exVi: 'Khi nói chuyện hãy nhìn vào mắt người đối diện.', more: '{結婚|けっこん}の{相手|あいて} (người sẽ cưới) · {試合|しあい}の{相手|あいて} (đối thủ) · {話|はな}し{相手|あいて} (người để trò chuyện) · {相手|あいて}にする (để ý đến, tiếp chuyện — N3).' },
        { w: '{指輪|ゆびわ}', pos: 'danh từ', ipa: 'yubiwa', vi: 'chiếc nhẫn', ex: '{先生|せんせい}は{左手|ひだりて}に{指輪|ゆびわ}をしていました。', exRo: 'Sensei wa hidarite ni yubiwa o shite imashita.', exVi: 'Thầy đeo nhẫn ở tay trái.', more: '**{指輪|ゆびわ}をする** (đeo — trạng thái: {指輪|ゆびわ}をしている, ôn ポイント 110). {結婚指輪|けっこんゆびわ} (nhẫn cưới). {指|ゆび} (ngón tay — chữ 指 Bài 17) + {輪|わ} (vòng).' },
        { w: '{独身|どくしん}', pos: 'danh từ', ipa: 'dokushin', vi: 'độc thân', ex: '{兄|あに}は{三十歳|さんじゅっさい}ですが、まだ{独身|どくしん}です。', exRo: 'Ani wa sanjussai desu ga, mada dokushin desu.', exVi: 'Anh tôi 30 tuổi nhưng vẫn còn độc thân.', more: 'Đối: {結婚|けっこん}している (đã kết hôn — trạng thái, ôn Bài 13). {独身|どくしん}の{人|ひと}. Chữ 独 = một mình. N3.' },
        { w: '{仲|なか}がいい', pos: 'cụm (tính từ い)', ipa: 'naka ga ii', vi: 'thân thiết, hoà thuận', ex: 'あの{二人|ふたり}は{子|こ}どものころから{仲|なか}がいいです。', exRo: 'Ano futari wa kodomo no koro kara naka ga ii desu.', exVi: 'Hai người đó thân nhau từ hồi nhỏ.', more: '{仲|なか}が{悪|わる}い (không hợp nhau) · **{仲|なか}のいい{友達|ともだち}** (bạn thân — trong mệnh đề が → の) · {仲良|なかよ}し (bạn thân, N3). Trông thân: {仲|なか}がよさそう (いい → よさそう!).' },
        { w: 'けんかします［けんかする］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'kenka shimasu [kenka suru]', vi: 'cãi nhau; đánh nhau', ex: '{昨日|きのう}、{小|ちい}さいことで{弟|おとうと}とけんかしてしまいました。', exRo: 'Kinou, chiisai koto de otouto to kenka shite shimaimashita.', exVi: 'Hôm qua tôi lỡ cãi nhau với em trai vì chuyện nhỏ.', more: '**人とけんかする**. Làm lành: {仲直|なかなお}りする (N3). Chữ 喧嘩 cấp cao — viết かな. Hay đi với ～てしまう (ôn Bài 19).' },
        { w: '{幸|しあわ}せ（な）', pos: 'tính từ な / danh từ', ipa: 'shiawase (na)', vi: 'hạnh phúc', ex: '{結婚式|けっこんしき}の{二人|ふたり}は、とても{幸|しあわ}せそうでした。', exRo: 'Kekkonshiki no futari wa, totemo shiawasesou deshita.', exVi: 'Đôi trẻ trong lễ cưới trông vô cùng hạnh phúc.', more: '+ そう: **{幸|しあわ}せそう** (ナA + そう). {幸|しあわ}せな{家族|かぞく} · {幸|しあわ}せになる. Chữ **幸** là chữ Hán mới.' },
      ],
    },

    /* ── C ── */
    { t: 'h', text: 'C. Vẻ ngoài & tâm trạng (10 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{様子|ようす}', pos: 'danh từ', ipa: 'yousu', vi: 'dáng vẻ, vẻ bề ngoài; tình hình', ex: '{最近|さいきん}、{先生|せんせい}の{様子|ようす}がちょっと{変|へん}です。', exRo: 'Saikin, sensei no yousu ga chotto hen desu.', exVi: 'Dạo này dáng vẻ của thầy hơi lạ.', more: '**{様子|ようす}を{見|み}る** = chờ xem tình hình ({少|すこ}し{様子|ようす}を{見|み}ましょう — câu bác sĩ hay nói). Từ khoá của đoán: {様子|ようす}を{見|み}て → ～そう／～ようだ. Chữ **様** là chữ Hán mới (お{客様|きゃくさま} cũng có chữ này).' },
        { w: '{顔色|かおいろ}', pos: 'danh từ', ipa: 'kaoiro', vi: 'sắc mặt', ex: '{顔色|かおいろ}が{悪|わる}いですね。{大丈夫|だいじょうぶ}ですか。', exRo: 'Kaoiro ga warui desu ne. Daijoubu desu ka.', exVi: 'Sắc mặt bạn kém quá. Có sao không?', more: '**{顔色|かおいろ}が{悪|わる}い／いい**. ⚠ 色 ở đây đọc **いろ** — kaoiro, không đọc ~~かおしょく~~. {顔色|かおいろ}を{見|み}る = nhìn sắc mặt người khác (để ý thái độ).' },
        { w: '{具合|ぐあい}', pos: 'danh từ', ipa: 'guai', vi: 'tình trạng (sức khoẻ, máy móc)', ex: '{具合|ぐあい}が{悪|わる}そうですね。{早|はや}く{帰|かえ}ったほうがいいですよ。', exRo: 'Guai ga warusou desu ne. Hayaku kaetta hou ga ii desu yo.', exVi: 'Trông bạn có vẻ không khoẻ. Nên về sớm đi.', more: '**{具合|ぐあい}が{悪|わる}い** (không khoẻ / máy trục trặc) · お{体|からだ}の{具合|ぐあい}はいかがですか (lịch sự). パソコンの{具合|ぐあい}がおかしい. Chữ 具 (Bài 18) + 合.' },
        { w: '{気分|きぶん}', pos: 'danh từ', ipa: 'kibun', vi: 'tâm trạng; cảm giác trong người', ex: 'バスに{長|なが}く{乗|の}ったら、{気分|きぶん}が{悪|わる}くなりました。', exRo: 'Basu ni nagaku nottara, kibun ga waruku narimashita.', exVi: 'Đi xe buýt lâu nên tôi thấy khó chịu trong người.', more: '**{気分|きぶん}が{悪|わる}い** = buồn nôn, khó chịu (cơ thể) hoặc bực bội · **{気分|きぶん}がいい** = sảng khoái. Khác {機嫌|きげん} (vui / không vui thể hiện ra ngoài cho người khác thấy).' },
        { w: '{表情|ひょうじょう}', pos: 'danh từ', ipa: 'hyoujou', vi: 'nét mặt, biểu cảm', ex: '{彼|かれ}は{悲|かな}しそうな{表情|ひょうじょう}をしていました。', exRo: 'Kare wa kanashisou na hyoujou o shite imashita.', exVi: 'Anh ấy mang nét mặt buồn bã.', more: '**{表情|ひょうじょう}をする** · {表情|ひょうじょう}が{明|あか}るい／{暗|くら}い. Rất hay đi với **～そうな{表情|ひょうじょう}** ({嬉|うれ}しそうな{表情|ひょうじょう}). Chữ **表・情** là chữ Hán mới. N3.' },
        { w: '{機嫌|きげん}', pos: 'danh từ', ipa: 'kigen', vi: 'tâm trạng (vui hay không vui)', ex: '{今日|きょう}の{店長|てんちょう}は{機嫌|きげん}がいいみたいです。', exRo: 'Kyou no tenchou wa kigen ga ii mitai desu.', exVi: 'Hôm nay anh quản lý có vẻ đang vui.', more: '**{機嫌|きげん}がいい／{悪|わる}い** · ご{機嫌|きげん} (dạng lịch sự). {機嫌|きげん}は người khác **nhìn thấy được** ở thái độ — nên rất hợp với ～みたい／～ようだ／～そう. N3.' },
        { w: '{似|に}ています［{似|に}る］2', pos: 'động từ nhóm 2 (gần như luôn ở dạng ～ている)', ipa: 'nite imasu [niru]', vi: 'giống', ex: 'あなたはお{母|かあ}さんによく{似|に}ていますね。', exRo: 'Anata wa okaasan ni yoku nite imasu ne.', exVi: 'Bạn trông giống mẹ quá.', more: '**A は B に{似|に}ている** (A giống B). ⚠ Nói "giống" là **{似|に}ている** (trạng thái) — ~~{似|に}ます~~ hầu như không dùng. Đứng trước danh từ: **{似|に}ている{人|ひと}** / {似|に}た{人|ひと}. Gần: {似合|にあ}う (hợp với — その{服|ふく}、よく{似合|にあ}うね).' },
        { w: '{太|ふと}ります［{太|ふと}る］1', pos: 'động từ nhóm 1', ipa: 'futorimasu [futoru]', vi: 'béo lên, tăng cân', ex: '{日本|にほん}に{来|き}てから、{三|さん}キロ{太|ふと}りました。', exRo: 'Nihon ni kite kara, san kiro futorimashita.', exVi: 'Từ khi sang Nhật, tôi lên 3 cân.', more: '+ て: **{太|ふと}って**. ⚠ "Người béo" (trạng thái) = **{太|ふと}っている** — KHÔNG nói ~~あの{人|ひと}は{太|ふと}いです~~ ({太|ふと}い = to, dày: {太|ふと}いペン, {太|ふと}い{足|あし}). Chữ **太** là chữ Hán mới ({太陽|たいよう} — mặt trời).' },
        { w: 'やせます［やせる］2', pos: 'động từ nhóm 2', ipa: 'yasemasu [yaseru]', vi: 'gầy đi, sút cân', ex: 'アルバイトが{忙|いそが}しくて、{少|すこ}しやせたようです。', exRo: 'Arubaito ga isogashikute, sukoshi yaseta you desu.', exVi: 'Bận làm thêm quá nên có vẻ tôi gầy đi một chút.', more: '"Người gầy" = **やせている**. Đối: {太|ふと}る. Chữ 痩せる cấp cao — viết かな. ⚠ やせる là nhóm 2 (やせ・ます), {太|ふと}る là nhóm 1 ({太|ふと}り・ます).' },
        { w: '{落|お}ち{込|こ}みます［{落|お}ち{込|こ}む］1', pos: 'động từ nhóm 1', ipa: 'ochikomimasu [ochikomu]', vi: 'suy sụp, buồn rầu, xuống tinh thần', ex: '{試験|しけん}に{落|お}ちて、{彼|かれ}はかなり{落|お}ち{込|こ}んでいるようです。', exRo: 'Shiken ni ochite, kare wa kanari ochikonde iru you desu.', exVi: 'Thi trượt, anh ấy có vẻ khá suy sụp.', more: '+ て: **{落|お}ち{込|こ}んで**. Trạng thái: {落|お}ち{込|こ}んでいる. Câu an ủi: そんなに{落|お}ち{込|こ}まないで. N3.' },
      ],
    },

    /* ── D ── */
    { t: 'h', text: 'D. Thời tiết & dấu hiệu (8 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{雲|くも}', pos: 'danh từ', ipa: 'kumo', vi: 'mây', ex: '{空|そら}に{黒|くろ}い{雲|くも}が{出|で}てきました。', exRo: 'Sora ni kuroi kumo ga dete kimashita.', exVi: 'Trên trời mây đen đã kéo đến.', more: '{雲|くも}が{出|で}る／{多|おお}い · {雨雲|あまぐも} (mây mưa — 雨 đọc あま). ⚠ {雲|くも} (mây) ↔ {曇|くも}り (trời nhiều mây — Bài 15): chữ 曇 = 日 + 雲. Chữ **雲** là chữ Hán mới.' },
        { w: '{今|いま}にも', pos: 'phó từ', ipa: 'ima ni mo', vi: '(sắp …) đến nơi, bất cứ lúc nào', ex: '{子|こ}どもは{今|いま}にも{泣|な}き{出|だ}しそうな{顔|かお}をしていました。', exRo: 'Kodomo wa ima ni mo nakidashisou na kao o shite imashita.', exVi: 'Đứa bé có vẻ mặt như sắp oà khóc đến nơi.', more: 'Gần như **chỉ đi với Vます＋そう** (sắp): {今|いま}にも{雨|あめ}が{降|ふ}りそう, {今|いま}にも{倒|たお}れそう. Khác {今|いま}から (từ bây giờ) và もうすぐ (sắp — chỉ thời gian).' },
        { w: '{降|ふ}り{出|だ}します［{降|ふ}り{出|だ}す］1', pos: 'động từ nhóm 1', ipa: 'furidashimasu [furidasu]', vi: '(mưa, tuyết) bắt đầu rơi', ex: '{駅|えき}に{着|つ}いたとき、{急|きゅう}に{雨|あめ}が{降|ふ}り{出|だ}しました。', exRo: 'Eki ni tsuita toki, kyuu ni ame ga furidashimashita.', exVi: 'Lúc tôi đến ga thì trời đột nhiên đổ mưa.', more: '+ て: {降|ふ}り{出|だ}して. **Vます ＋ {出|だ}す** = bắt đầu (đột ngột, ngoài ý muốn): {泣|な}き{出|だ}す (oà khóc), {笑|わら}い{出|だ}す (bật cười), {走|はし}り{出|だ}す (vụt chạy). Khác Vます＋{始|はじ}める (bắt đầu — trung tính, có chủ ý). N3.' },
        { w: '{吹|ふ}きます［{吹|ふ}く］1', pos: 'động từ nhóm 1', ipa: 'fukimasu [fuku]', vi: '(gió) thổi; thổi (sáo, kèn)', ex: '{今日|きょう}は{一日中|いちにちじゅう}{強|つよ}い{風|かぜ}が{吹|ふ}いています。', exRo: 'Kyou wa ichinichijuu tsuyoi kaze ga fuite imasu.', exVi: 'Hôm nay gió mạnh thổi suốt cả ngày.', more: '+ て: **{吹|ふ}いて**. **{風|かぜ}が{吹|ふ}く** (luôn dùng {吹|ふ}く, không dùng ~~{風|かぜ}が{来|く}る~~). {笛|ふえ}を{吹|ふ}く (thổi sáo). Chữ 吹 = 口 + 欠 — đọc được là đủ.' },
        { w: '{雷|かみなり}', pos: 'danh từ', ipa: 'kaminari', vi: 'sấm, sét', ex: '{遠|とお}くで{雷|かみなり}が{鳴|な}っています。{早|はや}く{帰|かえ}りましょう。', exRo: 'Tooku de kaminari ga natte imasu. Hayaku kaerimashou.', exVi: 'Đằng xa sấm đang rền. Về nhanh thôi.', more: '**{雷|かみなり}が{鳴|な}る** (sấm rền) · {雷|かみなり}が{落|お}ちる (sét đánh). Văn nói: {雷|かみなり}が{落|お}ちる còn nghĩa "bị mắng té tát". N3.' },
        { w: '{星|ほし}', pos: 'danh từ', ipa: 'hoshi', vi: 'ngôi sao', ex: '{星|ほし}がたくさん{見|み}えるから、{明日|あした}は{晴|は}れるはずです。', exRo: 'Hoshi ga takusan mieru kara, ashita wa hareru hazu desu.', exVi: 'Thấy nhiều sao như vậy thì mai chắc chắn trời nắng.', more: '{星|ほし}が{見|み}える (ôn ポイント 94) · {星|ほし}がきれい · {星空|ほしぞら} (bầu trời sao). Ví dụ trên dùng **はず** (mẫu ⑤): có căn cứ (trời quang, thấy sao).' },
        { w: '{電池|でんち}', pos: 'danh từ', ipa: 'denchi', vi: 'pin', ex: 'スマホの{電池|でんち}がもうすぐなくなりそうです。', exRo: 'Sumaho no denchi ga mou sugu nakunarisou desu.', exVi: 'Pin điện thoại có vẻ sắp hết rồi.', more: '**{電池|でんち}が{切|き}れる／なくなる** (hết pin) · {電池|でんち}を{替|か}える (thay pin) · {充電|じゅうでん}する (sạc — N3). Câu rất đời thường để luyện **Vます＋そう** (sắp).' },
        { w: '{切|き}れます［{切|き}れる］2', pos: 'động từ nhóm 2 (tự động từ)', ipa: 'kiremasu [kireru]', vi: 'đứt; hết (pin, hạn, hàng)', ex: '{電池|でんち}が{切|き}れそうですから、{充電|じゅうでん}しておきます。', exRo: 'Denchi ga kiresou desu kara, juuden shite okimasu.', exVi: 'Pin sắp hết nên tôi sạc sẵn.', more: '+ て: {切|き}れて. Cặp: {切|き}る (cắt — tha, Bài 7) ↔ **{切|き}れる** (đứt — tự). {糸|いと}が{切|き}れる (chỉ đứt) · {期限|きげん}が{切|き}れる (hết hạn) · {売|う}り{切|き}れ (bán hết — biển hay gặp ở cửa hàng!).' },
      ],
    },

    /* ── E ── */
    { t: 'h', text: 'E. Suy đoán & kiểm chứng (8 từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'もしかしたら', pos: 'phó từ', ipa: 'moshika shitara', vi: 'biết đâu, có khi', ex: 'もしかしたら、{明日|あした}は{雪|ゆき}が{降|ふ}るかもしれません。', exRo: 'Moshika shitara, ashita wa yuki ga furu kamoshiremasen.', exVi: 'Biết đâu ngày mai có tuyết.', more: 'Gần như luôn đi với **～かもしれない** (mẫu ④). Cùng nghĩa: もしかすると (trang trọng hơn), もしかして (văn nói — hay dùng khi hỏi: もしかして、{本田先生|ほんだせんせい}ですか).' },
        { w: '{絶対|ぜったい}（に）', pos: 'phó từ', ipa: 'zettai (ni)', vi: 'nhất định, tuyệt đối', ex: 'このことは{絶対|ぜったい}に{誰|だれ}にも{言|い}わないでください。', exRo: 'Kono koto wa zettai ni dare ni mo iwanaide kudasai.', exVi: 'Chuyện này tuyệt đối đừng nói với ai nhé.', more: '{絶対|ぜったい}～ない (tuyệt đối không) · văn nói: {絶対|ぜったい}おいしいよ (chắc chắn ngon). ⚠ Không ghép {絶対|ぜったい} với ～かもしれない (mâu thuẫn: tuyệt đối ↔ có khi). Chữ **絶・対** là chữ Hán mới.' },
        { w: 'まるで', pos: 'phó từ', ipa: 'marude', vi: 'cứ như là, y như', ex: 'この{部屋|へや}は{広|ひろ}くて、まるでホテルのようです。', exRo: 'Kono heya wa hirokute, marude hoteru no you desu.', exVi: 'Căn phòng này rộng, cứ như khách sạn vậy.', more: '**まるで～ようだ／みたいだ** = so sánh ví von (biết là không phải, nhưng giống). Không dùng まるで với ～らしい／～そう／～かもしれない.' },
        { w: '{本物|ほんもの}', pos: 'danh từ', ipa: 'honmono', vi: 'đồ thật, hàng thật', ex: 'このバッグは{本物|ほんもの}みたいですが、{値段|ねだん}が{安|やす}すぎます。', exRo: 'Kono baggu wa honmono mitai desu ga, nedan ga yasusugimasu.', exVi: 'Cái túi này trông như hàng thật, nhưng giá rẻ quá.', more: 'Đối: {偽物|にせもの} (đồ giả — N3). Danh từ + **みたい／のようだ** (không phải ~~{本物|ほんもの}そう~~ — そう không đi với danh từ).' },
        { w: '{予想|よそう}します［{予想|よそう}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'yosou shimasu [yosou suru]', vi: 'dự đoán', ex: '{明日|あした}の{試合|しあい}は、どちらが{勝|か}つと{予想|よそう}しますか。', exRo: 'Ashita no shiai wa, dochira ga katsu to yosou shimasu ka.', exVi: 'Trận ngày mai, bạn dự đoán bên nào thắng?', more: '**～と{予想|よそう}する** · {予想|よそう}が{当|あ}たる／{外|はず}れる · {予想|よそう}どおり (đúng như dự đoán). 予 (Bài 16) + **想** (chữ mới). N3.' },
        { w: '{当|あ}たります［{当|あ}たる］1', pos: 'động từ nhóm 1', ipa: 'atarimasu [ataru]', vi: 'trúng; (dự đoán) đúng', ex: '{天気予報|てんきよほう}が{当|あ}たって、{本当|ほんとう}に{雨|あめ}が{降|ふ}りました。', exRo: 'Tenki yohou ga atatte, hontou ni ame ga furimashita.', exVi: 'Dự báo thời tiết đã đúng, trời mưa thật.', more: '+ て: **{当|あ}たって**. {予想|よそう}が{当|あ}たる · {宝|たから}くじに{当|あ}たる (trúng xổ số) · ボールが{頭|あたま}に{当|あ}たる (bóng trúng đầu). Đối: {外|はず}れる.' },
        { w: '{外|はず}れます［{外|はず}れる］2', pos: 'động từ nhóm 2', ipa: 'hazuremasu [hazureru]', vi: '(dự đoán) sai, trật; tuột ra', ex: '{天気予報|てんきよほう}が{外|はず}れて、{雨|あめ}は{降|ふ}りませんでした。', exRo: 'Tenki yohou ga hazurete, ame wa furimasen deshita.', exVi: 'Dự báo thời tiết sai, trời không mưa.', more: '+ て: {外|はず}れて. ⚠ **はずれる ≠ はず** (mẫu ⑤ "chắc là"): {外|はず}れる là động từ, viết chữ 外. {宝|たから}くじが{外|はず}れた (không trúng) · ボタンが{外|はず}れた (tuột cúc). N3.' },
        { w: '{確認|かくにん}します［{確認|かくにん}する］3', pos: 'động từ nhóm 3 / danh từ', ipa: 'kakunin shimasu [kakunin suru]', vi: 'xác nhận, kiểm tra lại', ex: '{出|で}かける{前|まえ}に、{電車|でんしゃ}の{時間|じかん}を{確認|かくにん}しました。', exRo: 'Dekakeru mae ni, densha no jikan o kakunin shimashita.', exVi: 'Trước khi ra ngoài tôi đã kiểm tra lại giờ tàu.', more: 'Nghe tin đồn rồi thì **{確認|かくにん}する** (kiểm chứng) trước khi tin: {本人|ほんにん}に{確認|かくにん}する (hỏi chính người đó). {確|たし}かめる (Bài 19) gần nghĩa nhưng là từ thuần Nhật, mềm hơn. Chữ **確** là chữ Hán mới.' },
      ],
    },

    {
      t: 'hinh',
      title: '🖼️ Thẻ từ có hình — nhìn hình nói ra từ (chạm thẻ để nghe)',
      items: [
        { anh: 'speech-balloon', w: 'うわさ', ro: 'uwasa', vi: 'tin đồn (hình: bóng thoại)' },
        { anh: 'lying-face', w: 'うそ', ro: 'uso', vi: 'lời nói dối (hình: mũi dài)' },
        { anh: 'shushing-face', w: '{秘密|ひみつ}', ro: 'himitsu', vi: 'bí mật ("suỵt!")' },
        { anh: 'newspaper', w: '{情報|じょうほう}', ro: 'jouhou', vi: 'thông tin (hình: tờ báo)' },
        { anh: 'loudspeaker', w: '{発表|はっぴょう}します', ro: 'happyou shimasu', vi: 'công bố (hình: loa)' },
        { anh: 'astonished-face', w: '{驚|おどろ}きます', ro: 'odorokimasu', vi: 'ngạc nhiên' },
        { anh: 'two-hearts', w: '{付|つ}き{合|あ}います', ro: 'tsukiaimasu', vi: 'hẹn hò (hình: hai trái tim)' },
        { anh: 'ring', w: '{指輪|ゆびわ}', ro: 'yubiwa', vi: 'chiếc nhẫn' },
        { anh: 'wedding', w: '{結婚式|けっこんしき}', ro: 'kekkonshiki', vi: 'lễ cưới (ôn)' },
        { anh: 'smiling-face-with-hearts', w: '{幸|しあわ}せ', ro: 'shiawase', vi: 'hạnh phúc' },
        { anh: 'face-with-steam-from-nose', w: 'けんかします', ro: 'kenka shimasu', vi: 'cãi nhau (hình: mặt bốc hoả)' },
        { anh: 'face-with-thermometer', w: '{具合|ぐあい}が{悪|わる}い', ro: 'guai ga warui', vi: 'không khoẻ (hình: ngậm nhiệt kế)' },
        { anh: 'nauseated-face', w: '{気分|きぶん}が{悪|わる}い', ro: 'kibun ga warui', vi: 'khó chịu trong người, buồn nôn' },
        { anh: 'pensive-face', w: '{落|お}ち{込|こ}みます', ro: 'ochikomimasu', vi: 'suy sụp, buồn rầu' },
        { anh: 'grinning-face', w: '{機嫌|きげん}がいい', ro: 'kigen ga ii', vi: 'đang vui' },
        { anh: 'cloud', w: '{雲|くも}', ro: 'kumo', vi: 'mây' },
        { anh: 'cloud-with-rain', w: '{雨|あめ}が{降|ふ}り{出|だ}します', ro: 'ame ga furidashimasu', vi: 'trời bắt đầu mưa' },
        { anh: 'wind-face', w: '{風|かぜ}が{吹|ふ}きます', ro: 'kaze ga fukimasu', vi: 'gió thổi' },
        { anh: 'cloud-with-lightning', w: '{雷|かみなり}', ro: 'kaminari', vi: 'sấm sét' },
        { anh: 'glowing-star', w: '{星|ほし}', ro: 'hoshi', vi: 'ngôi sao' },
        { anh: 'low-battery', w: '{電池|でんち}が{切|き}れそう', ro: 'denchi ga kiresou', vi: 'pin sắp hết' },
        { anh: 'crystal-ball', w: '{予想|よそう}します', ro: 'yosou shimasu', vi: 'dự đoán (hình: quả cầu tiên tri)' },
        { anh: 'bullseye', w: '{当|あ}たります', ro: 'atarimasu', vi: 'trúng, (đoán) đúng (hình: hồng tâm)' },
        { anh: 'check-mark-button', w: '{確認|かくにん}します', ro: 'kakunin shimasu', vi: 'xác nhận, kiểm tra lại' },
      ],
    },
    {
      t: 'table',
      caption: 'Từ của bài + ～そう (様態) — chuẩn bị cho Ngữ pháp ①',
      head: ['Từ', 'Ghép với そう', 'Romaji', 'Nghĩa'],
      rows: [
        ['{幸|しあわ}せ (ナA)', '{幸|しあわ}せそう', 'shiawasesou', 'trông hạnh phúc'],
        ['{具合|ぐあい}が{悪|わる}い (イA)', '{具合|ぐあい}が{悪|わる}そう', 'guai ga warusou', 'trông không khoẻ'],
        ['{仲|なか}がいい (イA — ngoại lệ!)', '{仲|なか}がよさそう', 'naka ga yosasou', 'trông thân nhau'],
        ['{機嫌|きげん}がいい', '{機嫌|きげん}がよさそう', 'kigen ga yosasou', 'trông đang vui'],
        ['{降|ふ}り{出|だ}す (V)', '{降|ふ}り{出|だ}しそう', 'furidashisou', 'sắp đổ mưa'],
        ['{切|き}れる (V)', '{切|き}れそう', 'kiresou', 'sắp đứt / sắp hết'],
        ['{落|お}ち{込|こ}む (V)', '{落|お}ち{込|こ}んでいるようだ', 'ochikonde iru you da', 'có vẻ đang suy sụp (V-ている + ようだ — mẫu ②)'],
        ['{本物|ほんもの} (N)', '{本物|ほんもの}みたい／{本物|ほんもの}のようだ', 'honmono mitai / honmono no you da', 'trông như hàng thật (N không đi với そう!)'],
      ],
    },
    {
      t: 'note',
      title: 'Từ dễ nhầm trong bài',
      items: [
        '**うわさ ↔ {情報|じょうほう} ↔ {発表|はっぴょう}** — うわさ: tin **truyền miệng**, chưa chắc thật; {情報|じょうほう}: **thông tin** nói chung (đúng hay sai đều được, {確|たし}かな{情報|じょうほう} = thông tin xác thực); {発表|はっぴょう}: tin **chính thức** do người có trách nhiệm công bố. Tin đồn thường kết thúc bằng ～らしい; tin chính thức thì nói thẳng hoặc ～そうです.',
        '**{気分|きぶん} ↔ {機嫌|きげん} ↔ {具合|ぐあい}** — {気分|きぶん}: cảm giác **bên trong** (khoẻ khoắn / buồn nôn / bực); {機嫌|きげん}: tâm trạng **lộ ra ngoài** cho người khác thấy (vui vẻ hay cáu); {具合|ぐあい}: **tình trạng** cơ thể hoặc máy móc. "Tôi buồn nôn" = {気分|きぶん}が{悪|わる}い, không nói ~~{機嫌|きげん}が{悪|わる}い~~.',
        '**{太|ふと}る ↔ {太|ふと}い** — {太|ふと}る: béo lên (động từ; người béo = **{太|ふと}っている**); {太|ふと}い: to, dày (đồ vật, chân tay). ~~{田中|たなか}さんは{太|ふと}いです~~ → {太|ふと}っています. Tương tự **やせる → やせている**.',
        '**{似|に}ている ↔ {似合|にあ}う** — {似|に}ている: hai người / vật **giống nhau** (A は B に{似|に}ている); {似合|にあ}う: (quần áo, kiểu tóc) **hợp với** ai (その{服|ふく}、よく{似合|にあ}いますね).',
        '**{彼|かれ}・{彼女|かのじょ} ↔ {彼氏|かれし}・{恋人|こいびと}** — {彼|かれ}／{彼女|かのじょ}: "anh ấy / cô ấy" (kể chuyện) và cũng là "bạn trai / bạn gái"; {彼氏|かれし}: chỉ nghĩa bạn trai (văn nói); {恋人|こいびと}: người yêu (trung tính, Bài 8). Gọi người trước mặt: dùng **tên + さん**, không dùng {彼|かれ}.',
        '**{当|あ}たる ↔ {外|はず}れる** — dự đoán **đúng** ↔ **sai**. ⚠ {外|はず}れる (はずれる) KHÁC hẳn **～はず** (chắc là) dù cùng âm はず: {外|はず}れる là động từ, có đuôi れる.',
        '**{降|ふ}り{出|だ}す ↔ {降|ふ}り{始|はじ}める** — {降|ふ}り{出|だ}す: bắt đầu **đột ngột** (bất ngờ); {降|ふ}り{始|はじ}める: bắt đầu (trung tính). {泣|な}き{出|だ}す (oà khóc) tự nhiên hơn {泣|な}き{始|はじ}める khi kể chuyện bất ngờ.',
        '**{確認|かくにん}する ↔ {確|たし}かめる** — cùng nghĩa "kiểm tra cho chắc". {確認|かくにん}する: từ Hán, dùng nhiều ở công việc, văn bản; {確|たし}かめる: từ thuần Nhật, văn nói. **{確|たし}か** (phó từ): "hình như là" — CHƯA chắc! Đừng dịch thành "chắc chắn".',
        '**もしかしたら ↔ {絶対|ぜったい} ↔ {確|たし}か** — もしかしたら (biết đâu, ~30–50%) + かもしれない; {絶対|ぜったい} (chắc chắn 100%) + câu khẳng định / ない; {確|たし}か (nhớ là, không chắc lắm) + ～と{言|い}っていました／～はずです.',
      ],
    },
    {
      t: 'note',
      title: 'Kết hợp từ (コロケーション) nên học thành cụm',
      items: [
        'うわさ**を{聞|き}く** · うわさ**が{広|ひろ}がる** · うそ**をつく** · {秘密|ひみつ}**を{守|まも}る** · {情報|じょうほう}**を{集|あつ}める** · {話題|わだい}**になる** · {結果|けっか}**を{発表|はっぴょう}する** · よろしく**お{伝|つた}えください** · うわさ**を{信|しん}じる** · ニュース**に{驚|おどろ}く**',
        '{人|ひと}**と{付|つ}き{合|あ}う** · {彼女|かのじょ}**ができる** · {結婚|けっこん}**の{相手|あいて}** · {指輪|ゆびわ}**をする** · **まだ**{独身|どくしん}だ · {仲|なか}**がいい／{悪|わる}い** · {弟|おとうと}**とけんかする** · {幸|しあわ}せ**になる**',
        '{様子|ようす}**を{見|み}る** · {顔色|かおいろ}**が{悪|わる}い** · {具合|ぐあい}**が{悪|わる}い** · {気分|きぶん}**が{悪|わる}くなる** · {悲|かな}しそうな{表情|ひょうじょう}**をする** · {機嫌|きげん}**がいい** · {母|はは}**に{似|に}ている** · {三|さん}キロ**{太|ふと}る** · {試験|しけん}に{落|お}ちて**{落|お}ち{込|こ}む**',
        '{黒|くろ}い{雲|くも}**が{出|で}る** · **{今|いま}にも**{雨|あめ}が{降|ふ}り**そう** · {急|きゅう}に**{降|ふ}り{出|だ}す** · {風|かぜ}**が{吹|ふ}く** · {雷|かみなり}**が{鳴|な}る** · {星|ほし}**が{見|み}える** · {電池|でんち}**が{切|き}れる**',
        '**もしかしたら**～**かもしれない** · **{絶対|ぜったい}に**～ない · **まるで**～**のようだ／みたいだ** · {予想|よそう}**が{当|あ}たる／{外|はず}れる** · {本人|ほんにん}**に{確認|かくにん}する**',
      ],
    },
    {
      t: 'write',
      id: 'b20-viet-tu',
      title: 'Viết tay 10 từ hay vào đề',
      note: 'Dòng trên tô theo mẫu, dòng dưới tự viết. Bật "Che mẫu" để tự nhớ ra từ chỉ từ gợi ý nghĩa.',
      chars: ['様子', '確か', '実は', '彼女', '似る', '太る', '発表', '情報', '絶対', '予想'],
      goi: {
        '様子': 'ようす · dáng vẻ, tình hình',
        '確か': 'たしか · hình như; chắc chắn',
        '実は': 'じつは · thật ra là',
        '彼女': 'かのじょ · cô ấy; bạn gái',
        '似る': 'にる · giống (似ている)',
        '太る': 'ふとる · béo lên',
        '発表': 'はっぴょう · công bố, thuyết trình',
        '情報': 'じょうほう · thông tin',
        '絶対': 'ぜったい · tuyệt đối',
        '予想': 'よそう · dự đoán',
      },
    },
    {
      t: 'mcq',
      id: 'b20-tv-trac-nghiem',
      title: 'Kiểm tra từ vựng — 14 câu (dạng 文脈規定・言い換え類義・用法 của đề N4)',
      items: [
        { q: '{駅前|えきまえ}に{新|あたら}しい{店|みせ}ができるという（　）を{聞|き}きました。', options: ['うわさ', 'うそ', '{秘密|ひみつ}', '{相手|あいて}'], correct: 0, why: 'Tin nghe truyền miệng = **うわさ**. 〔Atarashii mise ga dekiru to iu uwasa o kikimashita.〕' },
        { q: '{彼|かれ}はよく（　）をつくので、{誰|だれ}も{信|しん}じません。', options: ['うわさ', 'うそ', '{話題|わだい}', '{情報|じょうほう}'], correct: 1, why: '**うそをつく** = nói dối (đi với つく). 〔Kare wa yoku uso o tsuku node, dare mo shinjimasen.〕' },
        { q: '{空|そら}に{黒|くろ}い（　）が{出|で}てきました。{雨|あめ}が{降|ふ}りそうです。', options: ['{星|ほし}', '{雷|かみなり}', '{雲|くも}', '{風|かぜ}'], correct: 2, why: 'Mây đen = **{黒|くろ}い{雲|くも}** → sắp mưa. 〔Sora ni kuroi kumo ga dete kimashita.〕' },
        { q: '{顔|かお}が{青|あお}いですね。{体|からだ}の（　）が{悪|わる}いんですか。', options: ['{具合|ぐあい}', '{機嫌|きげん}', '{様子|ようす}', '{表情|ひょうじょう}'], correct: 0, why: 'Tình trạng sức khoẻ = **{具合|ぐあい}が{悪|わる}い**. {機嫌|きげん}が{悪|わる}い = đang cáu (không phải ốm). 〔Karada no guai ga warui n desu ka.〕' },
        { q: '{日本|にほん}のお{菓子|かし}がおいしくて、{五|ご}キロも（　）しまいました。', options: ['やせて', '{太|ふと}って', '{太|ふと}くて', '{似|に}て'], correct: 1, why: 'Béo lên = **{太|ふと}る** (động từ). {太|ふと}い là tính từ "to, dày". 〔Go kiro mo futotte shimaimashita.〕' },
        { q: 'リンさんはお{姉|ねえ}さんによく（　）います。', options: ['{似|に}て', '{似合|にあ}って', '{付|つ}き{合|あ}って', '{合|あ}って'], correct: 0, why: 'Giống ai = **N に{似|に}ている**. 〔Rin-san wa oneesan ni yoku nite imasu.〕' },
        { q: '{今日|きょう}は{風|かぜ}が{強|つよ}く（　）いますね。', options: ['{降|ふ}って', '{吹|ふ}いて', '{鳴|な}って', '{出|で}て'], correct: 1, why: 'Gió thổi = **{風|かぜ}が{吹|ふ}く**. {雨|あめ}が{降|ふ}る · {雷|かみなり}が{鳴|な}る. 〔Kaze ga tsuyoku fuite imasu.〕' },
        { q: '{天気予報|てんきよほう}が（　）、{雨|あめ}は{一日中|いちにちじゅう}{降|ふ}りませんでした。', options: ['{当|あ}たって', '{外|はず}れて', '{切|き}れて', '{確認|かくにん}して'], correct: 1, why: 'Dự báo mưa mà không mưa → dự báo **sai** = **{外|はず}れる**. 〔Tenki yohou ga hazurete…〕' },
        { q: '（　）、{明日|あした}のパーティーに{行|い}けないかもしれません。', options: ['{絶対|ぜったい}に', 'もしかしたら', 'まるで', '{実|じつ}は'], correct: 1, why: '**もしかしたら ～かもしれません** (biết đâu). {絶対|ぜったい} mâu thuẫn với かもしれない; まるで đi với ようだ. 〔Moshika shitara, ashita no paatii ni ikenai kamoshiremasen.〕' },
        { q: 'このケーキは（　）{本物|ほんもの}の{花|はな}のようですね。', options: ['まるで', '{確|たし}か', 'もしかしたら', '{今|いま}にも'], correct: 0, why: '**まるで ～のようだ** = cứ như là (so sánh). 〔Kono keeki wa marude honmono no hana no you desu ne.〕' },
        { q: '「{確|たし}か、{木村|きむら}さんは{来週|らいしゅう}{国|くに}へ{帰|かえ}ると{言|い}っていました。」の「{確|たし}か」に{意味|いみ}が{近|ちか}いのは？', options: ['{絶対|ぜったい}に', '{私|わたし}の{記憶|きおく}では', 'うそで', '{初|はじ}めて'], correct: 1, why: 'Phó từ **{確|たし}か** = "nếu tôi nhớ không nhầm" ≈ **{私|わたし}の{記憶|きおく}では** (theo trí nhớ của tôi). Không phải "tuyệt đối". (dạng 言い換え類義)' },
        { q: '「{二人|ふたり}は{仲|なか}がいいです。」と{意味|いみ}が{近|ちか}いのは？', options: ['{二人|ふたり}はよくけんかします。', '{二人|ふたり}は{親|した}しいです。', '{二人|ふたり}は{似|に}ていません。', '{二人|ふたり}は{独身|どくしん}です。'], correct: 1, why: '{仲|なか}がいい ≈ **{親|した}しい** (thân thiết). 〔Futari wa shitashii desu.〕 (dạng 言い換え類義)' },
        { q: '「{発表|はっぴょう}」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{友達|ともだち}にうわさを{発表|はっぴょう}しました。', '{大学|だいがく}が{合格者|ごうかくしゃ}の{名前|なまえ}を{発表|はっぴょう}しました。', '{朝|あさ}ご{飯|はん}を{発表|はっぴょう}しました。', '{雨|あめ}が{発表|はっぴょう}しそうです。'], correct: 1, why: '{発表|はっぴょう} = công bố **chính thức** (trường công bố danh sách đỗ). Kể tin đồn cho bạn thì dùng {話|はな}す. (dạng 用法)' },
        { q: '「{伝|つた}える」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{山口|やまぐち}さんに、{会議|かいぎ}の{時間|じかん}が{変|か}わったと{伝|つた}えてください。', '{雨|あめ}が{伝|つた}えて、{寒|さむ}くなりました。', 'この{料理|りょうり}はとても{伝|つた}えます。', '{毎朝|まいあさ}{七時|しちじ}に{伝|つた}えます。'], correct: 0, why: '**人に「…」と{伝|つた}える** = nhắn lại cho ai. 〔Yamaguchi-san ni, kaigi no jikan ga kawatta to tsutaete kudasai.〕 (dạng 用法)' },
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b20-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp N4 — ～そう (2 nghĩa), ～ようだ・～みたい, ～らしい, ～かもしれない, ～はず',
  goal: 'Nói vẻ bề ngoài và điều sắp xảy ra bằng ～そう (Vます・イA・ナA; よさそう・なさそう; ～そうな N・～そうに V; ～そうにない) và không bao giờ nhầm với そうです "nghe nói"; đoán từ dấu hiệu mình thấy bằng ～ようだ／～みたい (cả so sánh まるで～ようだ, ～のような N); đoán theo tin nghe được bằng ～らしい; nêu khả năng bằng ～かもしれない (もしかしたら); nói điều có căn cứ bằng ～はず (～はずなのに, ～ないはず) — nối đúng từng mẫu với V／イA／ナA／N và chọn đúng mẫu theo nguồn tin + độ chắc chắn như đề N4 hay hỏi.',
  minutes: 120,
  blocks: [
    {
      t: 'p',
      text: 'Bài 20 là một **nhóm mẫu cùng họ**: tất cả đều để **đoán** hoặc **truyền tin**, nên đề N4 rất thích cho bốn lựa chọn ～そう／～ようだ／～らしい／～はず rồi bắt chọn một. Muốn chọn đúng, mỗi câu hãy tự hỏi **hai câu**: **(1) Mình biết điều này từ đâu?** — tận mắt thấy ngay trước mặt (そう), tự quan sát nhiều dấu hiệu (ようだ・みたい), nghe người khác nói (らしい, そうです), suy từ lý lẽ / lịch trình (はず), hay chỉ là một khả năng (かもしれない). **(2) Nối vào V／イA／ナA／N thế nào?** — mỗi mẫu có cách nối riêng (bảng ngay dưới). Học kỹ **bảng nối** trước, rồi học nghĩa từng mẫu.',
    },
    {
      t: 'table',
      caption: 'Bản đồ ngữ pháp Bài 20',
      head: ['#', 'Mẫu', 'Nghĩa', 'Ví dụ ngắn', 'Cấp'],
      rows: [
        ['①a', 'イA(bỏ い)／ナA ＋ そうだ', 'trông có vẻ (nhìn bề ngoài)', 'このケーキ、おいしそう。', 'N4'],
        ['①b', 'Vます ＋ そうだ', 'sắp…, có vẻ sẽ… (thấy dấu hiệu)', '{雨|あめ}が{降|ふ}りそうです。', 'N4'],
        ['①′', '普通形 ＋ そうだ (ôn ポイント 119)', 'nghe nói (truyền lại tin)', '{雨|あめ}が{降|ふ}るそうです。', 'N4'],
        ['②a', '普通形 ＋ ようだ (ナA な・N の)', 'hình như, có vẻ (suy từ dấu hiệu mình thấy)', '{誰|だれ}もいないようです。', 'N4'],
        ['②b', '普通形 ＋ みたいだ (ナA・N trần)', '= ようだ, văn nói', '{誰|だれ}もいないみたい。', 'N4'],
        ['②c', 'まるで ～ようだ／みたいだ · N のような N', 'cứ như là (so sánh) · như N (ví dụ)', 'まるで{夢|ゆめ}のようです。', 'N4'],
        ['③', '普通形 ＋ らしい (ナA・N trần)', 'nghe đâu, hình như (suy theo tin nghe được)', '{来月|らいげつ}{結婚|けっこん}するらしい。', 'N4'],
        ['④', '普通形 ＋ かもしれない (ナA・N trần)', 'có thể, có khi', '{遅|おく}れるかもしれません。', 'N4'],
        ['⑤', '普通形 ＋ はずだ (ナA な・N の)', 'chắc chắn là, theo lý thì; lẽ ra', '10{時|じ}に{着|つ}くはずです。', 'N4'],
      ],
    },
    {
      t: 'table',
      caption: '⭐ BẢNG NỐI — học thuộc bảng này là đã đúng một nửa (khẳng định, hiện tại)',
      head: ['Mẫu', 'V ({降|ふ}る)', 'イA ({高|たか}い)', 'ナA ({元気|げんき})', 'N ({学生|がくせい})'],
      rows: [
        ['① そう (trông có vẻ)', '{降|ふ}り**そう** (thể ます bỏ ます)', '{高|たか}**そう** (bỏ い) · いい → **よさそう**', '{元気|げんき}**そう**', '✗ (không dùng)'],
        ['①′ そうだ (nghe nói)', '{降|ふ}る**そうだ**', '{高|たか}い**そうだ**', '{元気|げんき}**だ**そうだ', '{学生|がくせい}**だ**そうだ'],
        ['② ようだ', '{降|ふ}る**ようだ**', '{高|たか}い**ようだ**', '{元気|げんき}**な**ようだ', '{学生|がくせい}**の**ようだ'],
        ['② みたいだ', '{降|ふ}る**みたいだ**', '{高|たか}い**みたいだ**', '{元気|げんき}**みたいだ**', '{学生|がくせい}**みたいだ**'],
        ['③ らしい', '{降|ふ}る**らしい**', '{高|たか}い**らしい**', '{元気|げんき}**らしい**', '{学生|がくせい}**らしい**'],
        ['④ かもしれない', '{降|ふ}る**かもしれない**', '{高|たか}い**かもしれない**', '{元気|げんき}**かもしれない**', '{学生|がくせい}**かもしれない**'],
        ['⑤ はずだ', '{降|ふ}る**はずだ**', '{高|たか}い**はずだ**', '{元気|げんき}**な**はずだ', '{学生|がくせい}**の**はずだ'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ bảng nối',
      items: [
        '**Chỉ ① そう (trông có vẻ) dùng thể ます / gốc tính từ** — mọi mẫu còn lại đứng sau **thể thường 普通形** (Bài 11): {降|ふ}る・{降|ふ}らない・{降|ふ}った・{降|ふ}らなかった.',
        '**ようだ và はず "giống danh từ"**: ナA giữ **な**, N thêm **の** — y như khi bổ nghĩa cho danh từ ({元気|げんき}**な**{人|ひと}, {学生|がくせい}**の**{本|ほん}). Vì ようだ, はず vốn là danh từ hình thức.',
        '**みたい, らしい, かもしれない "trần"**: ナA và N đứng trần, **không だ, không な, không の**: {元気|げんき}みたい, {学生|がくせい}らしい, {雨|あめ}かもしれない.',
        '**そうだ (nghe nói) giữ だ** với ナA và N: {元気|げんき}**だ**そうだ, {雨|あめ}**だ**そうだ — đây là chỗ phân biệt nhanh với ① {元気|げんき}そう.',
        'Quá khứ / phủ định nằm ở **phần đứng trước** (thể thường): {降|ふ}った**ようだ**, {来|こ}ない**かもしれない**, {雨|あめ}だった**らしい**, {行|い}かなかった**はずだ**. Riêng ① そう có cách phủ định riêng (mục ①).',
      ],
    },

    /* ══════ ① ～そう ══════ */
    { t: 'h', text: '① ～そう (様態) — "trông có vẻ…" · "sắp…": đoán ngay từ điều mắt thấy' },
    {
      t: 'p',
      text: '**～そう** (様態 — "dáng vẻ") nói điều người nói **đoán ngay từ vẻ bề ngoài**, ở **thời điểm nhìn thấy**, trước khi kiểm chứng. Có **hai cách dùng** tuỳ loại từ: **(a)** với **tính từ** — "trông có vẻ…": nhìn bánh mà đoán vị (**おいしそう**), nhìn người mà đoán cảm xúc (**{楽|たの}しそう**, **{眠|ねむ}そう**), nhìn hộp mà đoán sức nặng (**{重|おも}そう**) — tức là những tính chất **không nhìn thấy trực tiếp** được; **(b)** với **động từ** — "sắp…, có vẻ sẽ…": thấy **dấu hiệu** một việc sắp xảy ra (**{雨|あめ}が{降|ふ}りそう**, **{泣|な}きそう**, **ボタンが{取|と}れそう**), hoặc đoán khả năng (**{合格|ごうかく}できそう** — có vẻ đỗ được).',
    },
    {
      t: 'table',
      caption: 'Cách nối ～そう (様態) — khẳng định',
      head: ['Loại', 'Cách nối', 'Ví dụ', 'Romaji'],
      rows: [
        ['V (mọi nhóm)', 'thể ます bỏ ます ＋ そう', '{降|ふ}ります → {降|ふ}り**そう** · {泣|な}きます → {泣|な}き**そう** · {切|き}れます → {切|き}れ**そう** · できます → でき**そう** · {来|き}ます → {来|き}**そう**', 'furisou · nakisou · kiresou · dekisou · kisou'],
        ['イA', 'bỏ い ＋ そう', 'おいしい → おいし**そう** · {重|おも}い → {重|おも}**そう** · {眠|ねむ}い → {眠|ねむ}**そう**', 'oishisou · omosou · nemusou'],
        ['いい／よい (ngoại lệ)', 'よ ＋ さ ＋ そう', 'いい → **よさそう** · {頭|あたま}がいい → {頭|あたま}が**よさそう**', 'yosasou'],
        ['ない (ngoại lệ)', 'な ＋ さ ＋ そう', 'お{金|かね}がない → お{金|かね}が**なさそう** · {時間|じかん}がない → {時間|じかん}が**なさそう**', 'nasasou'],
        ['ナA', 'bỏ な ＋ そう', '{元気|げんき} → {元気|げんき}**そう** · {暇|ひま} → {暇|ひま}**そう** · {幸|しあわ}せ → {幸|しあわ}せ**そう**', 'genkisou · himasou · shiawasesou'],
        ['N', '✗ — không dùng', '~~{学生|がくせい}そう~~ → {学生|がくせい}みたい／{学生|がくせい}のようだ (mục ②)', '—'],
      ],
    },
    {
      t: 'table',
      caption: '～そう chia theo vị trí trong câu — giống tính từ な',
      head: ['Dạng', 'Ví dụ', 'Romaji', 'Nghĩa'],
      rows: [
        ['～そうです (cuối câu)', 'このかばんは{重|おも}そうです。', 'Kono kaban wa omosou desu.', 'Cái túi này trông nặng.'],
        ['～そうな ＋ N', 'おいしそうなケーキですね。', 'Oishisou na keeki desu ne.', 'Cái bánh trông ngon nhỉ.'],
        ['～そうに ＋ V', '{子|こ}どもたちが{楽|たの}しそうに{遊|あそ}んでいます。', 'Kodomotachi ga tanoshisou ni asonde imasu.', 'Bọn trẻ đang chơi trông rất vui.'],
        ['～そうでした (quá khứ)', '{昨日|きのう}の{先生|せんせい}は{疲|つか}れていて、{眠|ねむ}そうでした。', 'Kinou no sensei wa tsukarete ite, nemusou deshita.', 'Hôm qua thầy mệt, trông buồn ngủ.'],
        ['～そうだ／～そう (thân mật)', 'わあ、{楽|たの}しそう！', 'Waa, tanoshisou!', 'Oa, trông vui quá!'],
        ['～そうで、～ (nối)', '{雨|あめ}が{降|ふ}りそうで、{心配|しんぱい}です。', 'Ame ga furisou de, shinpai desu.', 'Trời có vẻ sắp mưa, tôi lo quá.'],
      ],
    },

    /* ── ①a ── */
    { t: 'h', text: '①a イA／ナA ＋ そう — "trông có vẻ…" (vị, cảm xúc, tính chất không thấy trực tiếp)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N は イA(bỏ い)／ナA ＋ そうです',
          vi: 'Nhìn bề ngoài mà **đoán** tính chất bên trong: vị (おいしそう, {甘|あま}そう, {辛|から}そう), cảm xúc / tình trạng của người khác ({楽|たの}しそう, {寂|さび}しそう, {眠|ねむ}そう, {元気|げんき}そう), sức nặng, độ khó, giá… Người nói **chưa thử / chưa chắc**.',
          examples: [
            E('このラーメン、{辛|から}そうですね。', 'Kono raamen, karasou desu ne.', 'Mì ramen này trông cay nhỉ.'),
            E('{本田先生|ほんだせんせい}は{最近|さいきん}{忙|いそが}しそうです。', 'Honda-sensei wa saikin isogashisou desu.', 'Dạo này thầy Honda có vẻ bận.'),
            E('この{問題|もんだい}は{難|むずか}しそうですが、やってみます。', 'Kono mondai wa muzukashisou desu ga, yatte mimasu.', 'Bài này trông khó nhưng tôi sẽ thử làm. (～てみる — ôn Bài 19)'),
            E('{新|あたら}しいアパートは{駅|えき}から{近|ちか}くて{便利|べんり}そうです。', 'Atarashii apaato wa eki kara chikakute benrisou desu.', 'Căn hộ mới gần ga, trông có vẻ tiện.'),
            E('{二人|ふたり}はとても{幸|しあわ}せそうでした。', 'Futari wa totemo shiawasesou deshita.', 'Hai người trông rất hạnh phúc.'),
            E('{顔色|かおいろ}が{悪|わる}いですね。{具合|ぐあい}が{悪|わる}そうですよ。', 'Kaoiro ga warui desu ne. Guai ga warusou desu yo.', 'Sắc mặt cậu kém quá. Trông không khoẻ đấy.'),
            E('あのレストランは{高|たか}そうだから、{別|べつ}の{店|みせ}にしよう。', 'Ano resutoran wa takasou da kara, betsu no mise ni shiyou.', 'Nhà hàng kia trông đắt, chọn quán khác đi.'),
          ],
        },
        {
          formula: 'いい → よさそう ／ ない → なさそう',
          vi: 'Hai ngoại lệ PHẢI thuộc: **いい → よさそう**, **ない → なさそう** (thêm さ). Dùng rất nhiều trong đời sống: {天気|てんき}が**よさそう**, {時間|じかん}が**なさそう**, {人|ひと}が**よさそう** (trông hiền).',
          examples: [
            E('このパソコン、{軽|かる}くてよさそうですね。', 'Kono pasokon, karukute yosasou desu ne.', 'Cái laptop này nhẹ, trông được đấy.'),
            E('{明日|あした}は{天気|てんき}がよさそうです。', 'Ashita wa tenki ga yosasou desu.', 'Ngày mai trời có vẻ đẹp.'),
            E('{店長|てんちょう}は{今日|きょう}{時間|じかん}がなさそうです。', 'Tenchou wa kyou jikan ga nasasou desu.', 'Hôm nay anh quản lý có vẻ không có thời gian.'),
            E('あの{二人|ふたり}は{仲|なか}がよさそうですね。', 'Ano futari wa naka ga yosasou desu ne.', 'Hai người kia trông thân nhau nhỉ.'),
            E('{西川|にしかわ}さんは{元気|げんき}がなさそうでした。', 'Nishikawa-san wa genki ga nasasou deshita.', 'Anh Nishikawa trông không được khoẻ / không vui.'),
          ],
        },
      ],
    },

    /* ── ①b ── */
    { t: 'h', text: '①b Vます ＋ そう — "sắp…, có vẻ sắp…" (thấy dấu hiệu)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N が Vます ＋ そうです （{今|いま}にも ～そう）',
          vi: 'Nhìn **dấu hiệu** mà đoán một việc **sắp xảy ra** (ngay bây giờ hoặc rất gần): mây đen → {降|ふ}りそう; mắt đỏ → {泣|な}きそう; cúc áo lỏng → {取|と}れそう. Hay đi với **{今|いま}にも** (đến nơi), **もうすぐ**. Với thể khả năng: **～できそう／～られそう** = "có vẻ làm được".',
          examples: [
            E('{空|そら}が{暗|くら}くなってきました。{今|いま}にも{雨|あめ}が{降|ふ}りそうです。', 'Sora ga kuraku natte kimashita. Ima ni mo ame ga furisou desu.', 'Trời tối sầm lại rồi. Sắp mưa đến nơi.'),
            E('シャツのボタンが{取|と}れそうですよ。', 'Shatsu no botan ga toresou desu yo.', 'Cúc áo sơ mi của bạn sắp tuột ra đấy.'),
            E('あの{子|こ}、{今|いま}にも{泣|な}きそうな{顔|かお}をしています。', 'Ano ko, ima ni mo nakisou na kao o shite imasu.', 'Đứa bé kia đang mếu như sắp khóc.'),
            E('{棚|たな}の{上|うえ}の{箱|はこ}が{落|お}ちそうです。{気|き}をつけて！', 'Tana no ue no hako ga ochisou desu. Ki o tsukete!', 'Cái hộp trên kệ sắp rơi đấy. Cẩn thận!'),
            E('{電池|でんち}が{切|き}れそうだから、{充電|じゅうでん}しておこう。', 'Denchi ga kiresou da kara, juuden shite okou.', 'Pin sắp hết rồi, sạc sẵn thôi. (～ておく — ôn Bài 18)'),
            E('この{仕事|しごと}は{今日|きょう}{中|じゅう}に{終|お}わりそうです。', 'Kono shigoto wa kyoujuu ni owarisou desu.', 'Việc này có vẻ sẽ xong trong hôm nay.'),
            E('たくさん{練習|れんしゅう}したから、{明日|あした}の{試験|しけん}は{合格|ごうかく}できそうです。', 'Takusan renshuu shita kara, ashita no shiken wa goukaku dekisou desu.', 'Luyện nhiều rồi nên kỳ thi mai có vẻ sẽ đỗ được.'),
          ],
        },
        {
          formula: 'Vます ＋ そうに（も）ない ／ そうもない — "không có vẻ sẽ…"',
          vi: 'Phủ định của ①b đặt ở **sau** そう: **{降|ふ}りそうにない／{降|ふ}りそうもない** ("chắc không mưa đâu", "không có dấu hiệu sẽ…"). Lịch sự: ～そうにないです／～そうもありません. Văn nói còn nghe **{降|ふ}らなそう／{降|ふ}らなさそう** (V-ない ＋ そう) — nhận ra là được, khi viết bài dùng ～そうにない.',
          examples: [
            E('この{雨|あめ}は、なかなかやみそうにないですね。', 'Kono ame wa, nakanaka yamisou ni nai desu ne.', 'Mưa này chắc chưa tạnh được đâu nhỉ.'),
            E('{仕事|しごと}が{多|おお}くて、{今日|きょう}は{早|はや}く{帰|かえ}れそうもありません。', 'Shigoto ga ookute, kyou wa hayaku kaeresou mo arimasen.', 'Việc nhiều quá, hôm nay chắc không về sớm được.'),
            E('この{量|りょう}は、{一人|ひとり}では{食|た}べられそうにない。', 'Kono ryou wa, hitori de wa taberaresou ni nai.', 'Chừng này thì một mình chắc ăn không hết.'),
            E('{彼|かれ}は{来|き}そうにないから、{先|さき}に{始|はじ}めましょう。', 'Kare wa kisou ni nai kara, saki ni hajimemashou.', 'Có vẻ anh ấy không đến đâu, mình bắt đầu trước đi.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Phủ định của ～そう (様態) — mỗi loại một kiểu',
      head: ['Loại', 'Khẳng định', 'Phủ định', 'Romaji', 'Nghĩa'],
      rows: [
        ['V', '{降|ふ}りそう', '{降|ふ}り**そうにない**／{降|ふ}り**そうもない** (văn nói: {降|ふ}らなそう)', 'furisou ni nai / furisou mo nai', 'chắc không mưa'],
        ['イA', 'おいしそう', 'おいしく**なさそう**', 'oishiku nasasou', 'trông không ngon'],
        ['いい', 'よさそう', 'よく**なさそう**', 'yoku nasasou', 'trông không tốt'],
        ['ナA', '{元気|げんき}そう', '{元気|げんき}じゃ**なさそう**', 'genki ja nasasou', 'trông không khoẻ'],
        ['ない', 'なさそう', '(— đã là phủ định)', 'nasasou', 'có vẻ không có'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi – đáp với ～そう',
      lines: [
        { who: 'ワン', role: 'a', text: 'このケーキ、おいしそうだね。{一|ひと}つ{買|か}ってみない？', ro: 'Kono keeki, oishisou da ne. Hitotsu katte minai?', vi: 'Cái bánh này trông ngon nhỉ. Mua thử một cái không?' },
        { who: 'カルロス', role: 'b', text: 'いいね。でも、ちょっと{甘|あま}そうだな。', ro: 'Ii ne. Demo, chotto amasou da na.', vi: 'Được đấy. Nhưng trông hơi ngọt nhỉ.' },
        { who: 'ワン', role: 'a', text: 'カルロスさん、{今日|きょう}は{元気|げんき}がなさそうだけど、どうしたの？', ro: 'Karurosu-san, kyou wa genki ga nasasou da kedo, dou shita no?', vi: 'Carlos, hôm nay trông cậu không được vui, sao thế?' },
        { who: 'カルロス', role: 'b', text: 'レポートが{終|お}わりそうにないんだ。{締|し}め{切|き}りは{明日|あした}なのに。', ro: 'Repooto ga owarisou ni nai n da. Shimekiri wa ashita na noni.', vi: 'Báo cáo có vẻ không xong kịp. Hạn là ngày mai vậy mà.' },
        { who: 'ワン', role: 'a', text: '{大変|たいへん}そう……。{手伝|てつだ}ってあげようか。', ro: 'Taihensou……. Tetsudatte ageyou ka.', vi: 'Trông vất vả quá… Để mình giúp cậu nhé?' },
        { who: 'カルロス', role: 'b', text: 'ありがとう！ワンさんが{手伝|てつだ}ってくれたら、{今夜|こんや}{中|じゅう}に{終|お}わりそう。', ro: 'Arigatou! Wan-san ga tetsudatte kuretara, kon\'yajuu ni owarisou.', vi: 'Cảm ơn! Có Vương giúp thì chắc xong trong tối nay.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — nhìn tranh nói một câu ～そう',
      head: ['Bạn thấy…', 'Từ lắp vào', 'Câu', 'Romaji'],
      rows: [
        ['bát mì đỏ rực ớt', '{辛|から}い', 'このラーメンは{辛|から}そうです。', 'Kono raamen wa karasou desu.'],
        ['bạn ngáp liên tục', '{眠|ねむ}い', '{眠|ねむ}そうですね。', 'Nemusou desu ne.'],
        ['vali to, bạn kéo mãi không lên', '{重|おも}い', 'そのスーツケース、{重|おも}そうですね。', 'Sono suutsukeesu, omosou desu ne.'],
        ['đám trẻ cười vang trong công viên', '{楽|たの}しい', '{子|こ}どもたちが{楽|たの}しそうに{遊|あそ}んでいます。', 'Kodomotachi ga tanoshisou ni asonde imasu.'],
        ['mây đen, gió mạnh', '{降|ふ}ります', '{今|いま}にも{雨|あめ}が{降|ふ}りそうです。', 'Ima ni mo ame ga furisou desu.'],
        ['cái cốc sát mép bàn', '{落|お}ちます', 'コップが{落|お}ちそうですよ。', 'Koppu ga ochisou desu yo.'],
        ['quán cà phê sạch, yên tĩnh', 'いい', 'あのカフェはよさそうですね。', 'Ano kafe wa yosasou desu ne.'],
        ['bạn mặc áo mỏng giữa trời đông', '{寒|さむ}い', '{寒|さむ}そうですね。これ、{使|つか}ってください。', 'Samusou desu ne. Kore, tsukatte kudasai.'],
      ],
    },
    {
      t: 'note',
      title: '⚠ Khi nào KHÔNG dùng ～そう (様態)',
      items: [
        '**Điều đã thấy rõ bằng mắt** thì nói thẳng, không thêm そう: hoa màu đỏ → ~~{赤|あか}そうです~~ → **{赤|あか}いです**; cô gái xinh → ~~きれいそうです~~ → **きれいですね**. そう dùng cho điều **chưa chắc** (vị, cảm xúc, tính chất bên trong).',
        '**Đã ăn / đã thử rồi** thì không dùng そう: ăn xong mà nói ~~おいしそうです~~ là sai → **おいしいです**. ダニエル ở hội thoại ①: trước khi ăn おいしそう, ăn rồi {本当|ほんとう}においしい.',
        '**Danh từ** không đi với そう: ~~{学生|がくせい}そう~~, ~~{雨|あめ}そう~~ → **{学生|がくせい}みたい／{学生|がくせい}のようだ**, **{雨|あめ}が{降|ふ}りそう**.',
        '**かわいそう** là MỘT TỪ riêng = "tội nghiệp, đáng thương" (かわいそうな{犬|いぬ}). Muốn nói "trông dễ thương" thì nói thẳng **かわいい**. Tương tự, đừng nhầm {偉|えら}そう (ra vẻ ta đây) với "trông giỏi".',
        'Vế đoán cảm xúc của **người khác** thì PHẢI có そう (hoặc ～がっている, Bài sau): ~~{田中|たなか}さんは{寂|さび}しいです~~ (người nói không thể biết chắc lòng người khác) → **{寂|さび}しそうです**. Cảm xúc của chính mình thì nói thẳng: ({私|わたし}は){寂|さび}しいです.',
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～そう (様態)',
      items: [
        'Nối sai: ~~おいしいそう~~ (thành "nghe nói ngon"!) → **おいしそう**; ~~{降|ふ}るそう~~ (= nghe nói mưa) → **{降|ふ}りそう**; ~~{元気|げんき}なそう~~ → **{元気|げんき}そう**.',
        'Quên ngoại lệ: ~~いそう~~ → **よさそう**; ~~ないそう~~ (= nghe nói không có) → **なさそう**.',
        'Phủ định sai chỗ: ~~{降|ふ}りませんそう~~ → **{降|ふ}りそうにありません／{降|ふ}りそうもありません**; ~~おいしいくなそう~~ → **おいしくなさそう**.',
        'Trước danh từ quên な: ~~おいしそうケーキ~~ → **おいしそう**な**ケーキ**; trước động từ quên に: ~~{楽|たの}しそう{話|はな}す~~ → **{楽|たの}しそうに{話|はな}す**.',
      ],
    },
    { t: 'rule', formula: 'Vます／イA(bỏ い)／ナA ＋ そう（だ・な N・に V）： trông có vẻ… ／ sắp…', vi: 'Đoán ngay từ vẻ bề ngoài, trước khi kiểm chứng. いい → よさそう, ない → なさそう. Không dùng với N và với điều nhìn là thấy rõ. Phủ định: V → ～そうにない／もない; イA → ～くなさそう; ナA → ～じゃなさそう.' },

    /* ── ①′ hai そう ── */
    { t: 'h', text: '①′ HAI そう — "trông có vẻ" (様態) ↔ "nghe nói" (伝聞, ôn ポイント 119)' },
    {
      t: 'p',
      text: 'Đây là **câu hỏi kinh điển của đề N4**: cùng một chữ **そう** nhưng nghĩa khác hẳn, và **chỉ khác nhau ở phần đứng trước**. **様態** (trông có vẻ) đứng sau **thể ます bỏ ます / gốc tính từ**; **伝聞** (nghe nói — ポイント 119 của Bài 15) đứng sau **thể thường đầy đủ** (ナA, N thêm **だ**). Người nói 様態 **tự mình nhìn thấy**; người nói 伝聞 **không thấy**, chỉ **truyền lại** tin của người khác (thường có nguồn: {天気予報|てんきよほう}では／ニュースによると／{友達|ともだち}の{話|はなし}では).',
    },
    {
      t: 'table',
      caption: 'Đặt cạnh nhau — đọc to từng cặp',
      head: ['', '様態 — trông có vẻ (mình thấy)', '伝聞 — nghe nói (mình nghe)'],
      rows: [
        ['V', '{雨|あめ}が{降|ふ}り**そう**です。 (mây đen — sắp mưa)', '{雨|あめ}が{降|ふ}る**そう**です。 (dự báo nói sẽ mưa)'],
        ['V phủ định', '{雨|あめ}は{降|ふ}り**そうにない**です。', '{雨|あめ}は{降|ふ}らない**そう**です。'],
        ['V quá khứ', '(không dùng cho việc đã xảy ra)', '{昨日|きのう}、{雨|あめ}が{降|ふ}った**そう**です。'],
        ['イA', 'このカレーは{辛|から}**そう**です。 (trông cay)', 'このカレーは{辛|から}い**そう**です。 (nghe nói cay)'],
        ['いい', 'あの{店|みせ}は**よさそう**です。', 'あの{店|みせ}は**いいそう**です。'],
        ['ナA', '{先生|せんせい}は{元気|げんき}**そう**です。', '{先生|せんせい}は{元気|げんき}**だそう**です。'],
        ['N', '✗', '{明日|あした}は{雨|あめ}**だそう**です。'],
        ['Trước N', 'おいしそう**な**ケーキ ✓', '~~おいしいそうなケーキ~~ ✗ (伝聞 không đứng trước danh từ)'],
        ['Quá khứ của そう', 'おいしそう**でした** ✓ (lúc đó trông ngon)', '~~おいしいそうでした~~ ✗ (伝聞 không chia quá khứ)'],
      ],
    },
    {
      t: 'note',
      title: 'Phân biệt nhanh trong 3 giây',
      items: [
        'Nhìn **ngay trước そう**: gốc động từ (～り・～き・～れ…) hoặc tính từ mất い / mất な → **trông có vẻ**. Thể từ điển / ない / た, tính từ còn い, có **だ** → **nghe nói**.',
        'Có **nguồn tin** ({天気予報|てんきよほう}では・ニュースによると・～の{話|はなし}では) → gần như chắc là **nghe nói**.',
        'Có **{今|いま}にも** → chắc chắn là **trông có vẻ / sắp** ({今|いま}にも{降|ふ}りそう).',
        'Có **な／に** ngay sau そう (そうな N, そうに V) → chỉ có thể là **様態**.',
      ],
    },
    {
      t: 'examples',
      items: [
        E('{天気予報|てんきよほう}によると、{明日|あした}は{晴|は}れるそうです。でも、{空|そら}を{見|み}ると、{雨|あめ}が{降|ふ}りそうです。', 'Tenki yohou ni yoru to, ashita wa hareru sou desu. Demo, sora o miru to, ame ga furisou desu.', 'Dự báo nói mai trời nắng. Nhưng nhìn trời thì có vẻ sắp mưa.'),
        E('{友達|ともだち}の{話|はなし}では、あの{店|みせ}のケーキはおいしいそうです。{写真|しゃしん}も、とてもおいしそうでした。', 'Tomodachi no hanashi de wa, ano mise no keeki wa oishii sou desu. Shashin mo, totemo oishisou deshita.', 'Nghe bạn kể thì bánh tiệm đó ngon. Ảnh cũng trông rất ngon.'),
        E('{先生|せんせい}は{元気|げんき}そうでした。{奥|おく}さんも{元気|げんき}だそうです。', 'Sensei wa genkisou deshita. Okusan mo genki da sou desu.', 'Thầy trông khoẻ. Nghe nói vợ thầy cũng khoẻ.'),
      ],
    },

    /* ══════ ② ～ようだ・～みたいだ ══════ */
    { t: 'h', text: '② 普通形 ＋ ようだ／みたいだ — "hình như, có vẻ là": suy từ dấu hiệu chính mình thấy' },
    {
      t: 'p',
      text: '**～ようだ** (lịch sự: **～ようです**) nói một **kết luận** người nói rút ra từ **những gì chính mình quan sát / cảm nhận được** — nhìn, nghe, ngửi, sờ, hay cảm thấy trong người. Khác ～そう (đoán ngay theo vẻ bề ngoài), ～ようだ thường là **sau khi đã để ý tình hình**: "đèn tắt, gõ cửa không ai trả lời → **{留守|るす}のようです**". **～みたいだ** nghĩa **y hệt** nhưng là **văn nói thân mật** (nói với bạn bè: ～みたい／～みたいだね; lịch sự hơn một chút: ～みたいです). Viết bài, nói với người trên trong công việc → **～ようです**.',
    },
    {
      t: 'table',
      caption: 'Cách nối ～ようだ／～みたいだ (đủ thì)',
      head: ['Loại', '～ようだ', '～みたいだ', 'Romaji'],
      rows: [
        ['V', '{来|く}る／{来|こ}ない／{来|き}た／{来|こ}なかった ＋ ようだ', '{来|く}る／{来|こ}ない／{来|き}た／{来|こ}なかった ＋ みたいだ', 'kuru you da · kita mitai da'],
        ['イA', '{寒|さむ}い／{寒|さむ}くない／{寒|さむ}かった ＋ ようだ', '{寒|さむ}い／{寒|さむ}くない／{寒|さむ}かった ＋ みたいだ', 'samui you da · samukatta mitai da'],
        ['ナA', '{暇|ひま}**な**ようだ · {暇|ひま}じゃないようだ · {暇|ひま}だったようだ', '{暇|ひま}みたいだ · {暇|ひま}じゃないみたいだ · {暇|ひま}だったみたいだ', 'hima na you da · hima mitai da'],
        ['N', '{留守|るす}**の**ようだ · {留守|るす}じゃないようだ · {留守|るす}だったようだ', '{留守|るす}みたいだ · {留守|るす}じゃないみたいだ · {留守|るす}だったみたいだ', 'rusu no you da · rusu mitai da'],
      ],
    },

    /* ── ②a ── */
    { t: 'h', text: '②a ～ようだ／～みたいだ — suy đoán (推量)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '普通形 ＋ ようです （ナA な ／ N の）',
          vi: 'Kết luận **có căn cứ cảm quan** nhưng **không khẳng định 100%**. Hay đi với **どうも** (không hiểu sao / hình như) ở đầu câu.',
          examples: [
            E('{電気|でんき}が{消|き}えていますね。{山口|やまぐち}さんは{留守|るす}のようです。', 'Denki ga kiete imasu ne. Yamaguchi-san wa rusu no you desu.', 'Đèn tắt rồi nhỉ. Hình như chị Yamaguchi không có nhà.'),
            E('{外|そと}から{傘|かさ}を{持|も}った{人|ひと}が{入|はい}ってきます。{雨|あめ}が{降|ふ}っているようです。', 'Soto kara kasa o motta hito ga haitte kimasu. Ame ga futte iru you desu.', 'Người từ ngoài vào ai cũng cầm ô. Hình như trời đang mưa.'),
            E('どうも{風邪|かぜ}をひいたようです。{頭|あたま}が{痛|いた}くて、{寒気|さむけ}がします。', 'Doumo kaze o hiita you desu. Atama ga itakute, samuke ga shimasu.', 'Hình như tôi bị cảm rồi. Đầu đau, người ớn lạnh. (cảm nhận trong người)'),
            E('{隣|となり}の{部屋|へや}は{静|しず}かですね。{誰|だれ}もいないようです。', 'Tonari no heya wa shizuka desu ne. Dare mo inai you desu.', 'Phòng bên yên ắng nhỉ. Hình như không có ai.'),
            E('この{料理|りょうり}は{塩|しお}が{足|た}りないようです。', 'Kono ryouri wa shio ga tarinai you desu.', 'Món này hình như thiếu muối. (nếm rồi mới nói)'),
            E('{先生|せんせい}は{今日|きょう}とても{忙|いそが}しかったようです。', 'Sensei wa kyou totemo isogashikatta you desu.', 'Hôm nay thầy có vẻ đã rất bận.'),
          ],
        },
        {
          formula: '普通形 ＋ みたい（だ／です） （ナA・N trần）',
          vi: 'Văn nói của ～ようだ. Với bạn bè: **～みたい** / **～みたいだね** / **～みたいよ**; lịch sự nhẹ: **～みたいです**. ⚠ ナA và N **không thêm な／の**: {暇|ひま}みたい, {留守|るす}みたい.',
          examples: [
            E('あれ、{財布|さいふ}がない。{家|いえ}に{忘|わす}れてきたみたい。', 'Are, saifu ga nai. Ie ni wasurete kita mitai.', 'Ơ, không thấy ví. Hình như mình để quên ở nhà rồi.'),
            E('{店長|てんちょう}、{今日|きょう}は{機嫌|きげん}がいいみたいだね。', 'Tenchou, kyou wa kigen ga ii mitai da ne.', 'Hôm nay anh quản lý có vẻ đang vui nhỉ.'),
            E('この{店|みせ}、{今日|きょう}は{休|やす}みみたいです。', 'Kono mise, kyou wa yasumi mitai desu.', 'Quán này hôm nay hình như nghỉ.'),
            E('マルコさん、{最近|さいきん}{暇|ひま}みたい。{毎日|まいにち}ゲームをしているよ。', 'Maruko-san, saikin hima mitai. Mainichi geemu o shite iru yo.', 'Dạo này Marco có vẻ rảnh. Ngày nào cũng chơi game.'),
            E('{駅|えき}で{事故|じこ}があったみたいで、{電車|でんしゃ}が{止|と}まっています。', 'Eki de jiko ga atta mitai de, densha ga tomatte imasu.', 'Hình như ở ga có tai nạn nên tàu đang dừng.'),
          ],
        },
      ],
    },

    /* ── ②b ── */
    { t: 'h', text: '②b So sánh ví von & ví dụ — まるで～ようだ・みたいだ · N のような N／N みたいな N' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '(まるで) N の ようだ／N みたいだ — "cứ như là N"',
          vi: '**So sánh**: người nói **biết rõ là KHÔNG phải**, nhưng giống đến mức như vậy. Hay có **まるで** đứng trước. Trước danh từ: **N のような N／N みたいな N**; trước động từ / tính từ: **N のように／N みたいに**.',
          examples: [
            E('この{部屋|へや}は{広|ひろ}くて、まるでホテルのようです。', 'Kono heya wa hirokute, marude hoteru no you desu.', 'Căn phòng này rộng, cứ như khách sạn.'),
            E('{今日|きょう}は{暖|あたた}かくて、まるで{春|はる}みたいですね。', 'Kyou wa atatakakute, marude haru mitai desu ne.', 'Hôm nay ấm áp, cứ như mùa xuân nhỉ.'),
            E('アンナさんは{日本人|にほんじん}のように{日本語|にほんご}を{話|はな}します。', 'Anna-san wa nihonjin no you ni nihongo o hanashimasu.', 'Anna nói tiếng Nhật như người Nhật.'),
            E('{彼|かれ}は{子|こ}どもみたいに{喜|よろこ}んでいました。', 'Kare wa kodomo mitai ni yorokonde imashita.', 'Anh ấy vui mừng như trẻ con. (喜ぶ — ôn Bài 18)'),
            E('{夢|ゆめ}のような{一日|いちにち}でした。', 'Yume no you na ichinichi deshita.', 'Đó là một ngày như trong mơ.'),
          ],
        },
        {
          formula: 'N1 のような N2 ／ N1 みたいな N2 — "N2 như (kiểu) N1"',
          vi: '**Ví dụ tiêu biểu**: nêu N1 làm ví dụ cho loại N2. {東京|とうきょう}のような{大|おお}きい{町|まち} = thành phố lớn như (kiểu) Tokyo.',
          examples: [
            E('{東京|とうきょう}のような{大|おお}きい{町|まち}に{住|す}んでみたいです。', 'Toukyou no you na ookii machi ni sunde mitai desu.', 'Tôi muốn thử sống ở một thành phố lớn như Tokyo.'),
            E('すしみたいな{日本|にほん}の{料理|りょうり}が{好|す}きです。', 'Sushi mitai na Nihon no ryouri ga suki desu.', 'Tôi thích món Nhật kiểu như sushi.'),
            E('{本田先生|ほんだせんせい}のような{先生|せんせい}になりたいです。', 'Honda-sensei no you na sensei ni naritai desu.', 'Tôi muốn trở thành giáo viên như thầy Honda.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: '～そう ↔ ～ようだ — cùng tình huống, khác góc nhìn',
      head: ['Tình huống', '～そう (đoán ngay theo vẻ ngoài)', '～ようだ／みたい (kết luận từ dấu hiệu đã quan sát)'],
      rows: [
        ['Nhìn bánh ở tủ kính', 'おいしそうですね。 ✓', '(chưa có dấu hiệu gì ngoài vẻ ngoài — ít dùng)'],
        ['Thấy khách xếp hàng dài trước tiệm', '—', 'あの{店|みせ}のケーキはおいしいようです。 ✓'],
        ['Mây đen kéo đến', '{雨|あめ}が{降|ふ}りそうです。 ✓ (sắp mưa)', '—'],
        ['Nghe tiếng lộp độp trên mái, người vào đều cầm ô', '—', '{雨|あめ}が{降|ふ}っているようです。 ✓ (đang mưa)'],
        ['Bạn ngáp, mắt díp lại', '{眠|ねむ}そうですね。 ✓', '—'],
        ['Bạn không nhắn tin cả ngày, đèn phòng tắt', '—', 'もう{寝|ね}たようです。 ✓'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～ようだ／～みたい',
      items: [
        'Nối sai ナA／N: ~~{暇|ひま}ようだ~~ → **{暇|ひま}な**ようだ; ~~{留守|るす}ようだ~~ → **{留守|るす}の**ようだ; ngược lại ~~{暇|ひま}なみたい~~, ~~{留守|るす}のみたい~~ → **{暇|ひま}みたい, {留守|るす}みたい**.',
        'Dùng みたい khi viết bài / nói với người trên: ~~{部長|ぶちょう}は{会議|かいぎ}中みたいです~~ (nghe trẻ con) → **{会議中|かいぎちゅう}のようです**.',
        'Dùng cho điều mình **biết chắc**: ~~{私|わたし}は{学生|がくせい}のようです~~ → {私|わたし}は{学生|がくせい}です. Trừ khi nói về cảm nhận cơ thể mình chưa chắc: {熱|ねつ}があるようです.',
        'Lẫn so sánh với suy đoán: **{彼|かれ}は{先生|せんせい}のようだ** có hai nghĩa — "hình như anh ấy là giáo viên" (đoán) và "anh ấy cứ như giáo viên" (so sánh). Có **まるで** → chắc chắn là so sánh.',
      ],
    },
    { t: 'rule', formula: '普通形 ＋ ようだ（ナA な・N の）／みたいだ（ナA・N trần）： hình như, có vẻ là', vi: 'Kết luận từ điều chính mình thấy, nghe, cảm nhận. みたい = văn nói. まるで～ようだ = cứ như là (so sánh). N のような／みたいな N = như (kiểu) N.' },

    /* ══════ ③ ～らしい ══════ */
    { t: 'h', text: '③ 普通形 ＋ らしい — "nghe đâu, hình như": đoán theo thông tin nghe được' },
    {
      t: 'p',
      text: '**～らしい** (lịch sự: **～らしいです**) nói một điều người nói **biết qua người khác** — nghe kể, đọc trên mạng, đọc tin — rồi **truyền lại kèm suy đoán**, với giọng **khách quan, không chịu trách nhiệm**: "nghe đâu…, nghe nói hình như…". Vì thế らしい là mẫu **của tin đồn** (うわさ). Khác **～そうです** (ポイント 119 — truyền lại **nguyên tin**, thường có nguồn rõ, người nói không thêm gì), らしい có thêm chút "**tôi đoán là vậy, theo những gì tôi nghe**". Khác **～ようだ** (căn cứ là điều **chính mình** quan sát), らしい căn cứ là điều **người khác** nói.',
    },
    {
      t: 'table',
      caption: 'Cách nối ～らしい (đủ thì)',
      head: ['Loại', 'Hiện tại', 'Phủ định', 'Quá khứ', 'Romaji'],
      rows: [
        ['V', '{結婚|けっこん}する**らしい**', '{結婚|けっこん}しない**らしい**', '{結婚|けっこん}した**らしい**', 'kekkon suru rashii'],
        ['イA', '{安|やす}い**らしい**', '{安|やす}くない**らしい**', '{安|やす}かった**らしい**', 'yasui rashii'],
        ['ナA', '{有名|ゆうめい}**らしい** (không な, không だ)', '{有名|ゆうめい}じゃない**らしい**', '{有名|ゆうめい}だった**らしい**', 'yuumei rashii'],
        ['N', '{秘密|ひみつ}**らしい** (không だ)', '{秘密|ひみつ}じゃない**らしい**', '{秘密|ひみつ}だった**らしい**', 'himitsu rashii'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '普通形 ＋ らしいです （ナA・N trần）',
          vi: 'Tin nghe được, nguồn có thể không rõ ({噂|うわさ}, {話|はなし}, インターネット). Hay đi với **～の{話|はなし}では**, **うわさでは**, **ニュースによると**.',
          examples: [
            E('{駅前|えきまえ}に{新|あたら}しいカレー{屋|や}ができるらしいですよ。', 'Ekimae ni atarashii karee-ya ga dekiru rashii desu yo.', 'Nghe đâu trước ga sắp mở quán cà ri mới đấy.'),
            E('うわさでは、{西川|にしかわ}さんは{会社|かいしゃ}を{辞|や}めるらしいです。', 'Uwasa de wa, Nishikawa-san wa kaisha o yameru rashii desu.', 'Theo tin đồn thì anh Nishikawa sắp nghỉ việc.'),
            E('{来週|らいしゅう}のテストは{難|むずか}しいらしいよ。', 'Raishuu no tesuto wa muzukashii rashii yo.', 'Nghe đâu bài kiểm tra tuần sau khó đấy.'),
            E('あの{店|みせ}のラーメンは、{雑誌|ざっし}で{有名|ゆうめい}らしいです。', 'Ano mise no raamen wa, zasshi de yuumei rashii desu.', 'Mì ramen quán kia nghe nói nổi tiếng trên tạp chí.'),
            E('{昨日|きのう}の{夜|よる}、この{辺|へん}で{火事|かじ}があったらしいです。', 'Kinou no yoru, kono hen de kaji ga atta rashii desu.', 'Nghe đâu đêm qua quanh đây có cháy.'),
            E('{木村|きむら}さんは{来月|らいげつ}から{大阪|おおさか}で{働|はたら}くらしいです。', 'Kimura-san wa raigetsu kara Oosaka de hataraku rashii desu.', 'Nghe đâu chị Kimura từ tháng sau làm việc ở Osaka.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Ba mẫu dễ lẫn nhất — そうです (nghe nói) · らしい · ようだ',
      head: ['', '～そうです (伝聞, ポイント 119)', '～らしい', '～ようだ／みたい'],
      rows: [
        ['Căn cứ', 'tin nghe / đọc được', 'tin nghe / đọc được (+ đoán)', 'điều CHÍNH MÌNH thấy, cảm nhận'],
        ['Người nói', 'chỉ truyền lại nguyên văn, không thêm ý', 'truyền lại + "chắc là vậy", giữ khoảng cách', 'tự rút ra kết luận'],
        ['Nguồn', 'thường nói rõ (～によると, ～では)', 'thường mơ hồ (うわさ, みんなが～)', 'là chính mắt / tai / cơ thể mình'],
        ['Ví dụ', '{天気予報|てんきよほう}によると、{雨|あめ}が{降|ふ}るそうです。', 'みんなの{話|はなし}では、{先生|せんせい}が{結婚|けっこん}するらしい。', '{道|みち}が{濡|ぬ}れている。{雨|あめ}が{降|ふ}ったようだ。'],
        ['Romaji', 'Tenki yohou ni yoru to, ame ga furu sou desu.', 'Minna no hanashi de wa, sensei ga kekkon suru rashii.', 'Michi ga nurete iru. Ame ga futta you da.'],
      ],
    },
    {
      t: 'note',
      title: 'Biết thêm — N ＋ らしい "đúng chất, ra dáng" (N3, hay gặp ở bài đọc)',
      items: [
        '**N らしい** còn là một **tính từ い** nghĩa "**đúng là N, mang đặc trưng của N**": {春|はる}らしい{天気|てんき} (thời tiết đúng kiểu mùa xuân), {学生|がくせい}らしい{服|ふく} (quần áo đúng kiểu sinh viên), {男|おとこ}らしい (nam tính), あなたらしい (đúng là bạn!). Chia như イA: {春|はる}らしくない (không giống mùa xuân).',
        'Một câu có thể hai nghĩa: **あの{人|ひと}は{先生|せんせい}らしい** = (1) "nghe đâu người đó là giáo viên" (mẫu ③) hoặc (2) "người đó ra dáng giáo viên". Đề N4 chủ yếu hỏi nghĩa (1); nghĩa (2) học kỹ ở N3. Mẹo: **らしい + N** ({先生|せんせい}らしい{話|はな}し{方|かた}) hoặc **らしくない** gần như luôn là nghĩa (2).',
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～らしい',
      items: [
        'Thêm だ／な／の: ~~{秘密|ひみつ}だらしい~~, ~~{有名|ゆうめい}ならしい~~ → **{秘密|ひみつ}らしい, {有名|ゆうめい}らしい**.',
        'Dùng らしい cho điều **chính mình** vừa thấy rõ: ~~（{自分|じぶん}で{触|さわ}って）このスープは{熱|あつ}いらしい~~ → **{熱|あつ}いようだ／{熱|あつ}いです**. らしい là "tôi nghe vậy".',
        'Dùng らしい khi người kia hỏi thẳng mà mình biết rõ — nghe như **né trách nhiệm**: "Mai có họp không?" "~~あるらしいです~~" (nếu chính bạn là người sắp xếp cuộc họp) → **あります**.',
      ],
    },
    { t: 'rule', formula: '普通形 ＋ らしい（ナA・N trần）： nghe đâu, hình như (theo tin nghe được)', vi: 'Truyền lại tin của người khác kèm suy đoán, giữ khoảng cách — mẫu của tin đồn. So với そうです: thêm "chắc là"; so với ようだ: căn cứ là điều nghe, không phải điều mình thấy.' },

    /* ══════ ④ ～かもしれない ══════ */
    { t: 'h', text: '④ 普通形 ＋ かもしれない — "có thể…, có khi…"' },
    {
      t: 'p',
      text: '**～かもしれない** (lịch sự: **～かもしれません**) nói một **khả năng** — có thể đúng, có thể không, người nói **không có căn cứ chắc**. Độ chắc khoảng **50% trở xuống**, thấp hơn **たぶん～でしょう／～と{思|おも}います** (ôn ポイント 123). Rất hay đi với **もしかしたら／もしかすると** ở đầu câu. Bài 16 có ghi: "có thể có" không nói bằng thể khả năng — chính là mẫu này: **あるかもしれない**.',
    },
    {
      t: 'table',
      caption: 'Cách nối ～かもしれない (đủ thì)',
      head: ['Loại', 'Hiện tại', 'Phủ định', 'Quá khứ', 'Romaji'],
      rows: [
        ['V', '{遅|おく}れる**かもしれない**', '{来|こ}ない**かもしれない**', '{忘|わす}れた**かもしれない**', 'okureru kamoshirenai'],
        ['イA', '{寒|さむ}い**かもしれない**', '{高|たか}くない**かもしれない**', '{難|むずか}しかった**かもしれない**', 'samui kamoshirenai'],
        ['ナA', '{暇|ひま}**かもしれない** (không だ)', '{好|す}きじゃない**かもしれない**', '{大変|たいへん}だった**かもしれない**', 'hima kamoshirenai'],
        ['N', '{雨|あめ}**かもしれない** (không だ)', '{本物|ほんもの}じゃない**かもしれない**', '{留守|るす}だった**かもしれない**', 'ame kamoshirenai'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '(もしかしたら) 普通形 ＋ かもしれません',
          vi: 'Nêu một khả năng; trong công việc dùng để **nói mềm** (không khẳng định) và để **cảnh báo trước**: {遅|おく}れるかもしれません (có khi tôi đến muộn).',
          examples: [
            E('{道|みち}が{混|こ}んでいるから、{少|すこ}し{遅|おく}れるかもしれません。', 'Michi ga konde iru kara, sukoshi okureru kamoshiremasen.', 'Đường đang tắc nên có khi tôi đến muộn một chút.'),
            E('もしかしたら、{明日|あした}は{雪|ゆき}が{降|ふ}るかもしれません。', 'Moshika shitara, ashita wa yuki ga furu kamoshiremasen.', 'Biết đâu ngày mai có tuyết.'),
            E('{鍵|かぎ}はかばんの{中|なか}かもしれない。もう{一度|いちど}{探|さが}してみる。', 'Kagi wa kaban no naka kamoshirenai. Mou ichido sagashite miru.', 'Chìa khoá có khi ở trong túi. Mình thử tìm lại lần nữa.'),
            E('この{服|ふく}はちょっと{高|たか}いかもしれないけど、とてもいいですよ。', 'Kono fuku wa chotto takai kamoshirenai kedo, totemo ii desu yo.', 'Bộ này có khi hơi đắt, nhưng rất tốt đấy.'),
            E('{電話|でんわ}に{出|で}ません。{彼|かれ}はもう{寝|ね}たかもしれません。', 'Denwa ni demasen. Kare wa mou neta kamoshiremasen.', 'Không nghe máy. Có khi anh ấy ngủ rồi.'),
            E('{本田先生|ほんだせんせい}は{日曜日|にちようび}なら{暇|ひま}かもしれません。', 'Honda-sensei wa nichiyoubi nara hima kamoshiremasen.', 'Nếu là Chủ nhật thì có khi thầy Honda rảnh. (～なら — ôn Bài 17)'),
          ],
        },
        {
          formula: '～のかもしれない — "có khi là vì…" (đoán lý do)',
          vi: 'Thêm **の** (giải thích, ôn ～んです) khi đoán **lý do / hoàn cảnh** của một việc đang thấy: {電話|でんわ}に{出|で}ない → {忙|いそが}しいのかもしれない.',
          examples: [
            E('{返事|へんじ}が{来|こ}ないね。{忙|いそが}しいのかもしれない。', 'Henji ga konai ne. Isogashii no kamoshirenai.', 'Chưa thấy trả lời nhỉ. Có khi là bận.'),
            E('{彼女|かのじょ}、{元気|げんき}がないね。{何|なに}かあったのかもしれない。', 'Kanojo, genki ga nai ne. Nani ka atta no kamoshirenai.', 'Cô ấy trông buồn nhỉ. Có khi đã có chuyện gì.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Thang độ chắc chắn — từ thấp đến cao',
      head: ['Độ chắc', 'Mẫu', 'Ví dụ', 'Romaji'],
      rows: [
        ['~30–50%', '(もしかしたら) ～かもしれない', '{雨|あめ}が{降|ふ}るかもしれない。', 'Ame ga furu kamoshirenai.'],
        ['~60–70%', 'たぶん ～でしょう／～と{思|おも}う (ポイント 123)', 'たぶん{雨|あめ}が{降|ふ}るでしょう。', 'Tabun ame ga furu deshou.'],
        ['~80–90%', 'きっと ～と{思|おも}う · ～はずだ (có căn cứ)', '{予報|よほう}では{雨|あめ}だから、{降|ふ}るはずだ。', 'Yohou de wa ame da kara, furu hazu da.'],
        ['100%', 'câu khẳng định thẳng · {絶対|ぜったい}', '{雨|あめ}が{降|ふ}っています。', 'Ame ga futte imasu.'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～かもしれない',
      items: [
        'Thêm だ: ~~{雨|あめ}だかもしれない~~, ~~{暇|ひま}だかもしれない~~ → **{雨|あめ}かもしれない, {暇|ひま}かもしれない**.',
        'Dùng thể ます phía trước: ~~{来|き}ますかもしれません~~ → **{来|く}るかもしれません** (かもしれません tự nó đã lịch sự).',
        'Ghép với {絶対|ぜったい}／きっと: ~~{絶対|ぜったい}{来|く}るかもしれない~~ (mâu thuẫn) → {絶対|ぜったい}{来|く}る / **もしかしたら**{来|く}るかもしれない.',
        'Viết rời sai: かも／しれない là một khối; văn nói rút gọn **～かも** ({雨|あめ}かも！ — có khi mưa đấy) — chỉ dùng với bạn bè.',
      ],
    },
    { t: 'rule', formula: '普通形 ＋ かもしれない（ナA・N trần）： có thể…, có khi…', vi: 'Chỉ là một khả năng, không có căn cứ chắc (~50%). Đi với もしかしたら. Đoán lý do: ～のかもしれない. Lịch sự: かもしれません.' },

    /* ══════ ⑤ ～はず ══════ */
    { t: 'h', text: '⑤ 普通形 ＋ はずだ — "chắc chắn là, theo lý thì" · "lẽ ra"' },
    {
      t: 'p',
      text: '**～はずだ** (lịch sự: **～はずです**) nói điều người nói **tin là đúng vì có căn cứ** — lịch trình, quy luật, điều đã biết, lời người khác hứa: "tàu 9 giờ xuất phát, đi 1 tiếng → **10{時|じ}に{着|つ}くはずです**". Độ chắc **cao** (~80–90%) nhưng là **suy luận**, không phải điều tận mắt thấy. Khi thực tế **không như** căn cứ, nói **～はずなのに** (ôn ～のに Bài 19) hoặc **～はずだった** ("lẽ ra"). ⚠ はず là **danh từ hình thức** → nối như bổ nghĩa danh từ: **ナA な / N の**.',
    },
    {
      t: 'table',
      caption: 'Cách nối ～はずだ (đủ thì)',
      head: ['Loại', 'Hiện tại', 'Phủ định', 'Quá khứ', 'Romaji'],
      rows: [
        ['V', '{着|つ}く**はずだ**', '{来|こ}ない**はずだ**', '{届|とど}いた**はずだ**', 'tsuku hazu da'],
        ['イA', '{安|やす}い**はずだ**', '{寒|さむ}くない**はずだ**', '{楽|たの}しかった**はずだ**', 'yasui hazu da'],
        ['ナA', '{暇|ひま}**な**はずだ', '{暇|ひま}じゃない**はずだ**', '{暇|ひま}だった**はずだ**', 'hima na hazu da'],
        ['N', '{休|やす}み**の**はずだ', '{休|やす}みじゃない**はずだ**', '{休|やす}みだった**はずだ**', 'yasumi no hazu da'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '(căn cứ) から、普通形 ＋ はずです',
          vi: 'Thường **nói kèm căn cứ** ở vế trước (～から／～ので／～なら). Đề hay cho căn cứ rồi hỏi はず.',
          examples: [
            E('{九時|くじ}の{電車|でんしゃ}に{乗|の}ったから、{十時|じゅうじ}には{着|つ}くはずです。', 'Kuji no densha ni notta kara, juuji ni wa tsuku hazu desu.', 'Lên tàu 9 giờ rồi nên chắc chắn 10 giờ sẽ tới.'),
            E('{今日|きょう}は{日曜日|にちようび}だから、{銀行|ぎんこう}は{休|やす}みのはずです。', 'Kyou wa nichiyoubi da kara, ginkou wa yasumi no hazu desu.', 'Hôm nay Chủ nhật nên chắc chắn ngân hàng nghỉ.'),
            E('{西川|にしかわ}さんは{日本|にほん}に{十年|じゅうねん}{住|す}んでいるから、{日本語|にほんご}が{上手|じょうず}なはずです。', 'Nishikawa-san wa Nihon ni juunen sunde iru kara, nihongo ga jouzu na hazu desu.', 'Anh Nishikawa sống ở Nhật 10 năm nên chắc chắn giỏi tiếng Nhật.'),
            E('{荷物|にもつ}は{昨日|きのう}{送|おく}ったから、もう{届|とど}いているはずです。', 'Nimotsu wa kinou okutta kara, mou todoite iru hazu desu.', 'Hàng gửi hôm qua rồi nên chắc chắn đã đến nơi.'),
            E('このレストランは{有名|ゆうめい}だから、おいしいはずですよ。', 'Kono resutoran wa yuumei da kara, oishii hazu desu yo.', 'Nhà hàng này nổi tiếng nên chắc chắn ngon đấy.'),
            E('{鍵|かぎ}はちゃんとかけたはずです。{出|で}る{前|まえ}に{確認|かくにん}しましたから。', 'Kagi wa chanto kaketa hazu desu. Deru mae ni kakunin shimashita kara.', 'Tôi chắc chắn đã khoá cửa đàng hoàng. Trước khi ra tôi đã kiểm tra rồi.'),
          ],
        },
        {
          formula: '～はずなのに ／ ～はずだった（のに） — "lẽ ra… vậy mà"',
          vi: 'Căn cứ nói A, thực tế lại không phải A → người nói **ngạc nhiên / bực / tiếc**. Kết hợp với ～のに (Bài 19).',
          examples: [
            E('もう{着|つ}いているはずなのに、まだ{来|き}ません。', 'Mou tsuite iru hazu na noni, mada kimasen.', 'Lẽ ra phải tới rồi vậy mà vẫn chưa thấy đâu.'),
            E('かばんに{入|い}れたはずなのに、{財布|さいふ}がありません。', 'Kaban ni ireta hazu na noni, saifu ga arimasen.', 'Chắc chắn đã bỏ vào túi rồi vậy mà không thấy ví.'),
            E('{今日|きょう}は{休|やす}みのはずだったのに、{急|きゅう}に{仕事|しごと}が{入|はい}りました。', 'Kyou wa yasumi no hazu datta noni, kyuu ni shigoto ga hairimashita.', 'Lẽ ra hôm nay được nghỉ vậy mà đột nhiên có việc.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: '～はず ↔ ～つもり ↔ ～予定 (Bài 16) ↔ ～かもしれない',
      head: ['Mẫu', 'Nói về', 'Ví dụ', 'Romaji'],
      rows: [
        ['～つもり (Bài 16)', 'ý định của CHÍNH MÌNH', '{来年|らいねん}、{日本|にほん}で{就職|しゅうしょく}するつもりです。', 'Rainen, Nihon de shuushoku suru tsumori desu.'],
        ['～{予定|よてい} (Bài 16)', 'lịch đã định (của mình / tổ chức)', '{会議|かいぎ}は{三時|さんじ}からの{予定|よてい}です。', 'Kaigi wa sanji kara no yotei desu.'],
        ['～はず', 'điều suy ra từ căn cứ (thường về người / việc khác)', '{会議|かいぎ}は{三時|さんじ}からだから、{部長|ぶちょう}はもう{来|く}るはずです。', 'Kaigi wa sanji kara da kara, buchou wa mou kuru hazu desu.'],
        ['～かもしれない', 'chỉ là khả năng, không căn cứ chắc', '{部長|ぶちょう}は{遅|おく}れるかもしれません。', 'Buchou wa okureru kamoshiremasen.'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～はず',
      items: [
        'Nối sai: ~~{休|やす}みはず~~ → **{休|やす}みのはず**; ~~{暇|ひま}はず~~ → **{暇|ひま}なはず**; ~~{来|き}ますはず~~ → **{来|く}るはず**.',
        'Dùng はず cho **ý định của mình**: ~~{私|わたし}は{明日|あした}{図書館|としょかん}へ{行|い}くはずです~~ (nghe như nói về người khác) → **{行|い}くつもりです／{行|い}く{予定|よてい}です**.',
        'Dùng はず khi **không có căn cứ**: ~~{明日|あした}は{雨|あめ}が{降|ふ}るはずです~~ (chỉ linh cảm) → **{降|ふ}るかもしれません**. Có dự báo làm căn cứ thì mới nói はず.',
        '**Phủ định hai kiểu khác nhau** — **～ないはずだ** (chắc là KHÔNG ~: {彼|かれ}は{来|こ}ないはずだ) ↔ **～はずがない** ("không lẽ nào lại ~", phủ nhận mạnh — học ở **Bài 31**). Ở N4 dùng **～ないはずです**.',
      ],
    },
    { t: 'rule', formula: '普通形 ＋ はずだ（ナA な・N の）： chắc chắn là (theo căn cứ) ／ ～はずなのに： lẽ ra… vậy mà', vi: 'Suy luận có căn cứ, độ chắc cao. Không dùng cho ý định của mình (→ つもり). Phủ định: ～ないはずだ (N4) — ～はずがない ở Bài 31.' },

    /* ══════ TỔNG KẾT NHÓM ══════ */
    { t: 'h', text: 'Tổng kết — cùng một tình huống, năm cách nói (đề N4 rất hay hỏi)' },
    {
      t: 'table',
      caption: 'Chuyện thầy 本田 — mỗi câu một nguồn tin',
      head: ['Bạn biết vì…', 'Câu', 'Romaji'],
      rows: [
        ['Nhìn mặt thầy hôm nay', '{先生|せんせい}は{嬉|うれ}しそうです。', 'Sensei wa ureshisou desu.'],
        ['Thầy kể với cả lớp, bạn truyền lại nguyên văn', '{先生|せんせい}の{妹|いもうと}さんが{結婚|けっこん}するそうです。', 'Sensei no imouto-san ga kekkon suru sou desu.'],
        ['Nghe bạn lớp bên đồn', '{先生|せんせい}が{結婚|けっこん}するらしいです。', 'Sensei ga kekkon suru rashii desu.'],
        ['Tự thấy thầy đeo nhẫn, hay mỉm cười', '{先生|せんせい}は{結婚|けっこん}したようです。／{結婚|けっこん}したみたい。', 'Sensei wa kekkon shita you desu. / Kekkon shita mitai.'],
        ['Không có căn cứ, chỉ đoán bừa', '{先生|せんせい}は{結婚|けっこん}するかもしれません。', 'Sensei wa kekkon suru kamoshiremasen.'],
        ['Có căn cứ: thầy từng nói "năm sau tôi cưới"', '{先生|せんせい}は{来年|らいねん}{結婚|けっこん}するはずです。', 'Sensei wa rainen kekkon suru hazu desu.'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng chọn nhanh khi làm đề',
      head: ['Dấu hiệu trong câu', 'Chọn', 'Ví dụ'],
      rows: [
        ['{今|いま}にも · gốc động từ / tính từ mất い', '～そう (様態)', '{今|いま}にも{泣|な}き**そう**だ'],
        ['～によると · ～では (nguồn rõ) · thể thường đầy đủ', '～そうだ (伝聞)', 'ニュースによると、{事故|じこ}があった**そう**だ'],
        ['うわさでは · みんなが{言|い}っている', '～らしい', 'うわさでは、{店|みせ}が{閉|し}まる**らしい**'],
        ['どうも · tự thấy / nghe / ngửi / cảm thấy', '～ようだ／みたい', 'どうも{熱|ねつ}がある**ようだ**'],
        ['まるで · N のような', '～ようだ／みたい (so sánh)', 'まるで{夢|ゆめ}の**よう**だ'],
        ['もしかしたら · không căn cứ', '～かもしれない', 'もしかしたら{遅|おく}れる**かもしれない**'],
        ['～から／～ので + căn cứ rõ (lịch, quy luật)', '～はずだ', '{日曜日|にちようび}だから{休|やす}みの**はず**だ'],
      ],
    },

    /* ══════ LUYỆN TỔNG HỢP ══════ */
    { t: 'h', text: 'Luyện tổng hợp — ghép câu, chia, điền, trắc nghiệm kiểu đề N4' },
    {
      t: 'build',
      id: 'b20-np-ghep',
      title: 'Ghép câu — bấm mảnh theo đúng thứ tự (12 câu)',
      items: [
        { vi: 'Cái bánh này trông ngon nhỉ.', chips: ['この', 'ケーキは', 'おいし', 'そうですね', 'おいしい', 'らしいですね'], answer: ['この', 'ケーキは', 'おいし', 'そうですね'], ro: 'Kono keeki wa oishisou desu ne.' },
        { vi: 'Trời sắp mưa đến nơi rồi.', chips: ['{今|いま}にも', '{雨|あめ}が', '{降|ふ}り', 'そうです', '{降|ふ}る', 'はずです'], answer: ['{今|いま}にも', '{雨|あめ}が', '{降|ふ}り', 'そうです'], ro: 'Ima ni mo ame ga furisou desu.' },
        { vi: 'Quán cà phê kia trông được đấy.', chips: ['あの', 'カフェは', 'よさ', 'そうですね', 'いい', 'みたいな'], answer: ['あの', 'カフェは', 'よさ', 'そうですね'], ro: 'Ano kafe wa yosasou desu ne.' },
        { vi: 'Bọn trẻ đang chơi trông rất vui.', chips: ['{子|こ}どもたちが', '{楽|たの}しそうに', '{遊|あそ}んで', 'います', '{楽|たの}しそうな', '{楽|たの}しい'], answer: ['{子|こ}どもたちが', '{楽|たの}しそうに', '{遊|あそ}んで', 'います'], ro: 'Kodomotachi ga tanoshisou ni asonde imasu.' },
        { vi: 'Nghe dự báo nói ngày mai nắng.', chips: ['{天気予報|てんきよほう}では', '{明日|あした}は', '{晴|は}れる', 'そうです', '{晴|は}れ', 'ようです'], answer: ['{天気予報|てんきよほう}では', '{明日|あした}は', '{晴|は}れる', 'そうです'], ro: 'Tenki yohou de wa ashita wa hareru sou desu.' },
        { vi: 'Hình như chị Yamaguchi không có nhà.', chips: ['{山口|やまぐち}さんは', '{留守|るす}', 'の', 'ようです', 'な', 'だ'], answer: ['{山口|やまぐち}さんは', '{留守|るす}', 'の', 'ようです'], ro: 'Yamaguchi-san wa rusu no you desu.' },
        { vi: 'Hình như mình để quên ví ở nhà. (văn nói)', chips: ['{家|いえ}に', '{財布|さいふ}を', '{忘|わす}れてきた', 'みたい', 'そう', 'のよう'], answer: ['{家|いえ}に', '{財布|さいふ}を', '{忘|わす}れてきた', 'みたい'], alt: [['{財布|さいふ}を', '{家|いえ}に', '{忘|わす}れてきた', 'みたい']], ro: 'Ie ni saifu o wasurete kita mitai.' },
        { vi: 'Căn phòng này cứ như khách sạn.', chips: ['この', '{部屋|へや}は', 'まるで', 'ホテルの', 'ようです', 'ホテルな', 'らしいです'], answer: ['この', '{部屋|へや}は', 'まるで', 'ホテルの', 'ようです'], ro: 'Kono heya wa marude hoteru no you desu.' },
        { vi: 'Nghe đâu thầy Honda tháng sau cưới.', chips: ['{本田先生|ほんだせんせい}は', '{来月|らいげつ}', '{結婚|けっこん}する', 'らしいです', '{結婚|けっこん}し', 'そうな'], answer: ['{本田先生|ほんだせんせい}は', '{来月|らいげつ}', '{結婚|けっこん}する', 'らしいです'], ro: 'Honda-sensei wa raigetsu kekkon suru rashii desu.' },
        { vi: 'Biết đâu ngày mai có tuyết.', chips: ['もしかしたら', '{明日|あした}は', '{雪|ゆき}が', '{降|ふ}る', 'かもしれません', '{絶対|ぜったい}に', '{降|ふ}り'], answer: ['もしかしたら', '{明日|あした}は', '{雪|ゆき}が', '{降|ふ}る', 'かもしれません'], ro: 'Moshika shitara ashita wa yuki ga furu kamoshiremasen.' },
        { vi: 'Hôm nay Chủ nhật nên chắc chắn ngân hàng nghỉ.', chips: ['{今日|きょう}は', '{日曜日|にちようび}だから', '{銀行|ぎんこう}は', '{休|やす}みの', 'はずです', '{休|やす}み', 'そうな'], answer: ['{今日|きょう}は', '{日曜日|にちようび}だから', '{銀行|ぎんこう}は', '{休|やす}みの', 'はずです'], ro: 'Kyou wa nichiyoubi da kara ginkou wa yasumi no hazu desu.' },
        { vi: 'Lẽ ra phải tới rồi vậy mà vẫn chưa thấy.', chips: ['もう', '{着|つ}いている', 'はずな', 'のに', 'まだ', '{来|き}ません', 'はずだ'], answer: ['もう', '{着|つ}いている', 'はずな', 'のに', 'まだ', '{来|き}ません'], ro: 'Mou tsuite iru hazu na noni, mada kimasen.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b20-np-chia',
      title: 'Chia — gõ dạng được yêu cầu (14 câu)',
      kind: 'fill',
      grammar: 'Vます／イA(bỏ い)／ナA ＋ そう · 普通形 ＋ そうだ (ナA・N + だ) · ようだ (ナA な・N の) · みたい／らしい／かもしれない (ナA・N trần) · はず (ナA な・N の)',
      items: [
        { q: '{降|ふ}る → trông sắp (～そうです)', answers: V('{降|ふ}りそうです'), hint: 'thể ます bỏ ます + そう' },
        { q: '{辛|から}い → trông có vẻ (～そうです)', answers: V('{辛|から}そうです'), hint: 'bỏ い + そう' },
        { q: 'いい → trông có vẻ (～そうです)', answers: V('よさそうです'), hint: 'ngoại lệ!' },
        { q: '{元気|げんき} → trông có vẻ (～そうです)', answers: V('{元気|げんき}そうです'), hint: 'ナA + そう' },
        { q: 'おいしい → trông KHÔNG ngon (～そう phủ định)', answers: V('おいしくなさそうです', 'おいしくなさそう'), hint: 'くない → くなさそう' },
        { q: '{降|ふ}る → chắc không mưa (～そう phủ định của động từ)', answers: V('{降|ふ}りそうにないです', '{降|ふ}りそうもないです', '{降|ふ}りそうにありません', '{降|ふ}りそうもありません', '{降|ふ}りそうにない', '{降|ふ}りそうもない'), hint: '～そうにない／～そうもない' },
        { q: '{元気|げんき} → nghe nói (～そうです)', answers: V('{元気|げんき}だそうです'), hint: 'ナA + だ + そうです' },
        { q: '{留守|るす} → hình như (～ようです)', answers: V('{留守|るす}のようです'), hint: 'N + の + ようです' },
        { q: '{暇|ひま} → hình như (～ようです)', answers: V('{暇|ひま}なようです'), hint: 'ナA + な + ようです' },
        { q: '{暇|ひま} → hình như, văn nói (～みたい)', answers: V('{暇|ひま}みたい', '{暇|ひま}みたいです', '{暇|ひま}みたいだ'), hint: 'ナA + みたい (không な)' },
        { q: '{秘密|ひみつ} → nghe đâu (～らしいです)', answers: V('{秘密|ひみつ}らしいです'), hint: 'N + らしい (không だ)' },
        { q: '{雨|あめ} → có khi (～かもしれません)', answers: V('{雨|あめ}かもしれません'), hint: 'N + かもしれない (không だ)' },
        { q: '{休|やす}み → chắc chắn là (～はずです)', answers: V('{休|やす}みのはずです'), hint: 'N + の + はず' },
        { q: '{上手|じょうず} → chắc chắn là (～はずです)', answers: V('{上手|じょうず}なはずです'), hint: 'ナA + な + はず' },
      ],
    },
    {
      t: 'quiz',
      id: 'b20-np-dien',
      title: 'Điền vào chỗ trống — dùng đúng mẫu của bài (12 câu)',
      kind: 'fill',
      grammar: '～そう (2 nghĩa) · ～ようだ／～みたい · ～らしい · ～かもしれない · ～はず',
      items: [
        { q: '{黒|くろ}い{雲|くも}が{出|で}てきました。{今|いま}にも{雨|あめ}が（{降|ふ}る → sắp）です。', answers: V('{降|ふ}りそう'), hint: 'Vます + そう' },
        { q: 'わあ、（おいしい → trông）なケーキですね。', answers: V('おいしそう'), hint: '～そうな N' },
        { q: '{天気予報|てんきよほう}によると、{明日|あした}は{雪|ゆき}（　）そうです。', answers: ['だ'], hint: 'N + だ + そうです (nghe nói)' },
        { q: '{子|こ}どもたちが（{楽|たの}しい → trông）{遊|あそ}んでいます。', answers: V('{楽|たの}しそうに'), hint: '～そうに V' },
        { q: '{電気|でんき}が{消|き}えています。{誰|だれ}もいない（　）です。', answers: ['よう', 'みたい'], hint: 'suy từ dấu hiệu' },
        { q: 'この{町|まち}は{静|しず}か（　）ようです。', answers: ['な'], hint: 'ナA + な + ようだ' },
        { q: '{今日|きょう}は{暖|あたた}かくて、まるで{春|はる}（　）ようです。', answers: ['の'], hint: 'N + の + ようだ (so sánh)' },
        { q: 'うわさでは、あの{二人|ふたり}は{付|つ}き{合|あ}っている（　）よ。', answers: ['らしい', 'らしいです'], hint: 'tin đồn' },
        { q: 'もしかしたら、{電車|でんしゃ}が{遅|おく}れる（　）。', answers: ['かもしれません', 'かもしれない'], hint: 'もしかしたら + …' },
        { q: '{九時|くじ}に{出|で}たから、もう{着|つ}いている（　）です。', answers: ['はず'], hint: 'có căn cứ' },
        { q: '{今日|きょう}は{祝日|しゅくじつ}だから、{郵便局|ゆうびんきょく}は{休|やす}み（　）はずです。', answers: ['の'], hint: 'N + の + はず' },
        { q: 'かばんに{入|い}れた（　）なのに、{鍵|かぎ}がありません。', answers: ['はず'], hint: 'lẽ ra… vậy mà' },
      ],
    },
    {
      t: 'mcq',
      id: 'b20-np-jlpt',
      title: 'Trắc nghiệm dạng đề JLPT N4 — 文法形式の判断 (10 câu) + 文の組み立て ★ (4 câu)',
      items: [
        { q: 'あ、{空|そら}が{暗|くら}くなってきた。{雨|あめ}が（　）だね。', options: ['{降|ふ}るそう', '{降|ふ}りそう', '{降|ふ}るらしい', '{降|ふ}るはず'], correct: 1, why: 'Thấy trời tối sầm (dấu hiệu, tận mắt) → sắp mưa = **{降|ふ}りそう** (Vます + そう). {降|ふ}るそう = nghe nói mưa. 〔Ame ga furisou da ne.〕' },
        { q: '{天気予報|てんきよほう}によると、{午後|ごご}から{雨|あめ}が（　）そうです。', options: ['{降|ふ}り', '{降|ふ}る', '{降|ふ}って', '{降|ふ}った'], correct: 1, why: 'Có nguồn tin (～によると) → **nghe nói**, thể thường: **{降|ふ}るそうです**. 〔Gogo kara ame ga furu sou desu.〕' },
        { q: 'このかばんは（　）ですね。{持|も}ちましょうか。', options: ['{重|おも}そう', '{重|おも}いそう', '{重|おも}そうな', '{重|おも}くそう'], correct: 0, why: 'Trông nặng → **{重|おも}そう** (bỏ い). {重|おも}いそう = nghe nói nặng. 〔Kono kaban wa omosou desu ne.〕' },
        { q: 'A「この{映画|えいが}、どうかな。」 B「{評判|ひょうばん}もいいし、（　）よ。」', options: ['いいそうだ', 'よさそうだ', 'いいそうな', 'よそうだ'], correct: 1, why: 'いい + そう (様態) → **よさそう**. 〔Hyouban mo ii shi, yosasou da yo.〕' },
        { q: '{隣|となり}の{部屋|へや}から{音|おと}が{聞|き}こえません。{誰|だれ}もいない（　）です。', options: ['そう', 'よう', 'らしい', 'はず'], correct: 1, why: 'Tự mình nghe (không có tiếng) → kết luận từ dấu hiệu: **ようです**. いない + そう không đúng cách nối; らしい là tin nghe từ người khác. 〔Dare mo inai you desu.〕' },
        { q: 'あの{店|みせ}は、{今日|きょう}は{休|やす}み（　）です。シャッターが{閉|し}まっていますから。', options: ['のよう', 'なよう', 'よう', 'だよう'], correct: 0, why: 'N + **の** + ようです. 〔Kyou wa yasumi no you desu.〕' },
        { q: 'うわさでは、{駅前|えきまえ}に{大|おお}きいスーパーができる（　）。', options: ['ようです', 'らしいです', 'そうです（様態）', 'はずです'], correct: 1, why: '**うわさでは** = theo tin đồn → **らしいです**. 〔Uwasa de wa, ekimae ni ookii suupaa ga dekiru rashii desu.〕' },
        { q: '{道|みち}が{混|こ}んでいるので、{約束|やくそく}の{時間|じかん}に{遅|おく}れる（　）。', options: ['かもしれません', 'はずがありません', 'そうです（様態）', 'みたいな'], correct: 0, why: 'Khả năng (đường tắc) → **かもしれません**. 〔Okureru kamoshiremasen.〕' },
        { q: '{山田|やまだ}さんは{十年|じゅうねん}も{中国|ちゅうごく}に{住|す}んでいたから、{中国語|ちゅうごくご}が{上手|じょうず}な（　）です。', options: ['よう', 'はず', 'らしい', 'そう'], correct: 1, why: 'Căn cứ rõ (sống 10 năm) + **ナA な** → **はずです**. 上手なよう cũng đúng cách nối nhưng căn cứ là lý lẽ, không phải quan sát. 〔Chuugokugo ga jouzu na hazu desu.〕' },
        { q: 'この{部屋|へや}は{広|ひろ}くてきれいで、まるでホテル（　）。', options: ['のようです', 'らしいです', 'そうです', 'かもしれません'], correct: 0, why: '**まるで～のようです** = cứ như là (so sánh). 〔Marude hoteru no you desu.〕' },
        { q: '★ {空|そら}を{見|み}ると、＿＿ ＿＿ ★ ＿＿ です。（{雨|あめ}が／{今|いま}にも／{降|ふ}り／そう）', options: ['{雨|あめ}が', '{今|いま}にも', '{降|ふ}り', 'そう'], correct: 2, why: 'Câu đúng: {空|そら}を{見|み}ると、**{今|いま}にも {雨|あめ}が {降|ふ}り そう** です. Ô ★ (thứ 3) = **{降|ふ}り**. 〔Ima ni mo ame ga furisou desu.〕' },
        { q: '★ {先生|せんせい}の ＿＿ ＿＿ ★ ＿＿ らしいです。（{話|はなし}では／{試験|しけん}は／{来週|らいしゅう}の／{難|むずか}しい）', options: ['{話|はなし}では', '{試験|しけん}は', '{来週|らいしゅう}の', '{難|むずか}しい'], correct: 1, why: 'Câu đúng: {先生|せんせい}の **{話|はなし}では {来週|らいしゅう}の {試験|しけん}は {難|むずか}しい** らしいです. Ô ★ (thứ 3) = **{試験|しけん}は**. 〔Sensei no hanashi de wa, raishuu no shiken wa muzukashii rashii desu.〕' },
        { q: '★ {荷物|にもつ}は ＿＿ ＿＿ ★ ＿＿ です。（{送|おく}ったから／はず／もう{届|とど}いている／{昨日|きのう}）', options: ['{送|おく}ったから', 'はず', 'もう{届|とど}いている', '{昨日|きのう}'], correct: 2, why: 'Câu đúng: {荷物|にもつ}は **{昨日|きのう} {送|おく}ったから もう{届|とど}いている はず** です. Ô ★ (thứ 3) = **もう{届|とど}いている**. 〔Nimotsu wa kinou okutta kara, mou todoite iru hazu desu.〕' },
        { q: '★ かばんに ＿＿ ＿＿ ★ ＿＿ ありません。（はず／{入|い}れた／なのに／{財布|さいふ}が）', options: ['はず', '{入|い}れた', 'なのに', '{財布|さいふ}が'], correct: 2, why: 'Câu đúng: かばんに **{入|い}れた はず なのに {財布|さいふ}が** ありません. Ô ★ (thứ 3) = **なのに**. 〔Kaban ni ireta hazu na noni, saifu ga arimasen.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const HAN_TU: Lesson = {
  id: 'b20-han-tu',
  kind: 'kanji',
  title: 'Chữ Hán mới — 15 chữ: 様 確 実 彼 似 太 泣 表 情 報 絶 対 雲 想 幸',
  goal: 'Đọc đúng (không cần furigana) và hiểu nghĩa 15 chữ Hán mới của Bài 20 trong các từ hay gặp khi nói về tin đồn, suy đoán, vẻ ngoài và thời tiết (様子・お客様・確か・確認・実は・事実・彼・彼女・似ている・太る・泣く・発表・表情・時刻表・情報・天気予報・絶対・反対・雲・予想・感想・幸せ…), chọn đúng chữ khi đề cho hiragana, phân biệt chữ trông giống (様・横, 確・破, 実・美, 彼・波, 似・以, 太・犬, 泣・位, 情・晴, 報・服, 絶・給, 対・村, 雲・雪, 想・相, 幸・辛) và viết tay được các chữ ✍.',
  minutes: 45,
  blocks: [
    {
      t: 'p',
      text: 'Chữ mới của Bài 20 là **15 chữ N3** (vài chữ — {太|ふと}る, {確|たし}か — có bảng xếp vào N4; JLPT không công bố danh sách chữ chính thức) đi theo đúng các từ của chủ đề **tin đồn & suy đoán** mà bạn sẽ gặp trong tin nhắn, bản tin thời tiết, bài đọc N4–N3: 様 確 実 彼 似 太 泣 表 情 報 絶 対 雲 想 幸. Cột **Mức**: ✍ = nên viết được, 👁 = nhận mặt (đọc + hiểu). Học **theo từ**: {情報|じょうほう} (jouhou), {天気予報|てんきよほう} (tenki yohou), {発表|はっぴょう} (happyou), {絶対|ぜったい} (zettai) — đề 漢字読み và 表記 hỏi **cả từ**. Nhiều chữ ghép được với chữ đã học: 発 (Bài 17) + 表 → {発表|はっぴょう}; 予 (Bài 16) + 想 → {予想|よそう}; 時刻 (Bài 19) + 表 → {時刻表|じこくひょう}.',
    },
    {
      t: 'table',
      caption: '15 chữ Hán mới của Bài 20',
      head: ['Chữ', 'Hán Việt', 'Âm On', 'Âm Kun', 'Nghĩa', 'Từ ví dụ', 'Mức'],
      rows: [
        ['様', 'DẠNG', 'ヨウ', 'さま', 'dáng vẻ, kiểu; ngài (kính ngữ)', '{様子|ようす} (dáng vẻ, tình hình) · お{客様|きゃくさま} (quý khách) · {皆様|みなさま} (quý vị) · {田中様|たなかさま} (ngài Tanaka)', '👁 N3'],
        ['確', 'XÁC', 'カク', 'たし(か)・たし(かめる)', 'chắc chắn, xác thực', '{確|たし}か (hình như; chắc chắn) · {確|たし}かめる (kiểm tra cho chắc) · {確認|かくにん} (xác nhận) · {正確|せいかく} (chính xác — N3)', '👁 N3'],
        ['実', 'THỰC', 'ジツ', 'み・みの(る)', 'thật, sự thật; quả', '{実|じつ}は (thật ra là) · {事実|じじつ} (sự thật) · {実際|じっさい} (thực tế — N3) · {木|き}の{実|み} (quả trên cây)', '✍ N3'],
        ['彼', 'BỈ', 'ヒ', 'かれ・かの', 'người kia, anh ấy', '{彼|かれ} (anh ấy) · {彼女|かのじょ} (cô ấy; bạn gái) · {彼氏|かれし} (bạn trai) · {彼|かれ}ら (họ)', '✍ N3'],
        ['似', 'TỰ', 'ジ', 'に(る)', 'giống', '{似|に}ている (giống) · {似合|にあ}う (hợp với) · {真似|まね} (bắt chước — N3)', '👁 N3'],
        ['太', 'THÁI', 'タイ・タ', 'ふと(い)・ふと(る)', 'to, béo', '{太|ふと}る (béo lên) · {太|ふと}い (to, dày) · {太陽|たいよう} (mặt trời) · {太平洋|たいへいよう} (Thái Bình Dương — 洋 Bài 17)', '✍ N3'],
        ['泣', 'KHẤP', 'キュウ', 'な(く)', 'khóc', '{泣|な}く (khóc) · {泣|な}きそう (sắp khóc) · {泣|な}き{出|だ}す (oà khóc) · {泣|な}き{声|ごえ} (tiếng khóc)', '✍ N3'],
        ['表', 'BIỂU', 'ヒョウ', 'おもて・あらわ(す)', 'mặt ngoài; biểu hiện; bảng', '{発表|はっぴょう} (công bố) · {表情|ひょうじょう} (nét mặt) · {時刻表|じこくひょう} (bảng giờ tàu) · {表|おもて} (mặt trước) · {代表|だいひょう} (đại diện — 代 Bài 16)', '✍ N3'],
        ['情', 'TÌNH', 'ジョウ', 'なさ(け)', 'tình cảm; tình hình', '{情報|じょうほう} (thông tin) · {表情|ひょうじょう} (nét mặt) · {友情|ゆうじょう} (tình bạn) · {事情|じじょう} (hoàn cảnh — N3)', '👁 N3'],
        ['報', 'BÁO', 'ホウ', 'むく(いる)', 'báo tin; đáp lại', '{情報|じょうほう} (thông tin) · {天気予報|てんきよほう} (dự báo thời tiết) · {予報|よほう} (dự báo) · {報告|ほうこく} (báo cáo — N3)', '👁 N3'],
        ['絶', 'TUYỆT', 'ゼツ', 'た(える)', 'dứt hẳn; tuyệt đối', '{絶対|ぜったい} (tuyệt đối) · {絶対|ぜったい}に (nhất định) · {絶|た}える (dứt — N1, chỉ để biết âm kun)', '👁 N3'],
        ['対', 'ĐỐI', 'タイ・ツイ', '—', 'đối lại, đối với', '{絶対|ぜったい} (tuyệt đối) · {反対|はんたい} (phản đối; ngược lại) · {反対側|はんたいがわ} (phía đối diện — 側 Bài 17) · ～に{対|たい}して (đối với — N3)', '👁 N3'],
        ['雲', 'VÂN', 'ウン', 'くも', 'mây', '{雲|くも} (mây) · {雨雲|あまぐも} (mây mưa) · {白|しろ}い{雲|くも} (mây trắng)', '✍ N3'],
        ['想', 'TƯỞNG', 'ソウ・ソ', '—', 'nghĩ, tưởng tượng', '{予想|よそう} (dự đoán) · {感想|かんそう} (cảm tưởng — N3) · {想像|そうぞう} (tưởng tượng — N3) · {理想|りそう} (lý tưởng — N3)', '👁 N3'],
        ['幸', 'HẠNH', 'コウ', 'しあわ(せ)・さいわ(い)・さち', 'hạnh phúc, may mắn', '{幸|しあわ}せ (hạnh phúc) · {幸|さいわ}い (may là — N3) · {不幸|ふこう} (bất hạnh — N3) · {幸運|こううん} (vận may)', '👁 N3'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ bằng cấu tạo chữ (học kèm khi tập viết)',
      items: [
        '**様** = 木 (cây) + 羕 (gợi âm ヨウ — trên là 羊 con dê, dưới là dòng nước dài): mẹo nhìn — "dáng cây, dáng con dê" = **DẠNG**, hình dáng → {様子|ようす}. Đặt sau tên = "ngài": お{客様|きゃくさま}.',
        '**確** = 石 (đá) + 隺 (chim bay cao — gợi âm カク): rắn như đá = **CHẮC CHẮN** → {確|たし}か, {確認|かくにん}. Cùng bộ 石 với 破 (Bài 19).',
        '**実** — chữ cũ 實 = 宀 (mái nhà) + 貫 (xâu tiền): trong nhà đầy tiền thật = **ĐẦY, THỰC**; cây đầy quả = {実|み}. Chữ mới: 宀 + 三 + 大 — mẹo: dưới mái nhà có người (大) chất ba lớp (三) đồ thật.',
        '**彼** = 彳 (bước chân) + 皮 (da — gợi âm ヒ): người đang bước đi **đằng kia** = **KIA, người ấy** → {彼|かれ}, {彼女|かのじょ}. Cùng 皮 với 破 (Bài 19), 波 (sóng).',
        '**似** = 亻 (người) + 以 (gợi âm ジ; "lấy làm"): người lấy người khác làm mẫu = **GIỐNG** → {似|に}ている.',
        '**太** = 大 (to) + 丶 (một chấm ở dưới): to thêm một chút nữa = **TO, BÉO** → {太|ふと}る, {太陽|たいよう} (mặt trời — thứ to nhất). Chấm ở DƯỚI; 犬 (chó) chấm ở trên bên phải.',
        '**泣** = 氵 (nước) + 立 (đứng): đứng đó mà nước mắt chảy = **KHÓC** → {泣|な}く.',
        '**表** — chữ cổ = 衣 (áo) + 毛 (lông): áo lông khoác **bên ngoài** = **MẶT NGOÀI**, biểu hiện ra → {表情|ひょうじょう} (nét mặt hiện ra), {発表|はっぴょう} (đưa ra ngoài), {時刻表|じこくひょう} (bảng — thứ bày ra để nhìn).',
        '**情** = 忄 (lòng) + 青 (gợi âm; xanh, trong): lòng trong — **TÌNH** cảm; mở rộng: tình hình → {情報|じょうほう} (tin về tình hình). Cùng 青 với 晴 (Bài 15).',
        '**報** = 幸 (vốn vẽ cái cùm tay) + 㞋 (người quỳ + bàn tay): bắt kẻ có tội rồi **BÁO** lên trên → {報告|ほうこく}, {予報|よほう}, {情報|じょうほう}.',
        '**絶** = 糸 (sợi chỉ) + 色 (gợi âm; vốn là 刀 dao + người quỳ): lấy dao cắt **ĐỨT HẲN** sợi chỉ = **TUYỆT** → {絶対|ぜったい} (đã dứt khoát, không đổi).',
        '**対** — chữ cũ 對: hai vật đặt **ĐỐI** nhau; chữ mới 文 + 寸 (bàn tay) → {反対|はんたい}, {絶対|ぜったい}. Khác 村 (làng — trái là 木).',
        '**雲** = 雨 (mưa) + 云 (vốn vẽ đám mây cuộn): thứ cuộn trên trời mang mưa đến = **MÂY** → {雲|くも}. ⚠ {曇|くも}り (Bài 15) = 日 + 雲: mặt trời bị mây che.',
        '**想** = 相 (nhìn kỹ — gợi âm ソウ) + 心 (lòng): trong lòng "nhìn thấy" hình ảnh = **TƯỞNG**, nghĩ đến → {予想|よそう} (nghĩ trước), {感想|かんそう}.',
        '**幸** — gốc vẽ cái cùm tay; thoát được cùm là **MAY MẮN**. Mẹo nhìn (không phải gốc): 土 trên + 辛 (cay đắng) dưới: đi qua cay đắng mới tới **HẠNH PHÚC** → {幸|しあわ}せ. Khác 辛 ({辛|から}い — cay) thiếu một nét ngang trên.',
      ],
    },
    {
      t: 'table',
      caption: 'Đứng riêng hay đứng chung — kun khi đứng một mình / có đuôi kana, on trong từ ghép',
      head: ['Chữ', 'Đứng riêng (kun)', 'Trong từ ghép (on)', 'Bẫy'],
      rows: [
        ['様', '～{様|さま} (お{客様|きゃくさま})', '{様子|ようす} (ヨウ)', 'よう**す** — 子 đọc す (không phải こ)'],
        ['確', '{確|たし}か, {確|たし}かめる', '{確認|かくにん} (カク)', 'たし**か** (1 chữ kana đuôi) ↔ たし**かめる**'],
        ['実', '{実|み} (quả)', '{実|じつ}は, {事実|じじつ} (ジツ)', '{実際|じっさい} — ジツ → **じっ**'],
        ['彼', '{彼|かれ}, {彼女|かのじょ}', '(ヒ — ít gặp ở N4)', '{彼女|かのじょ} đọc **かの**じょ, không phải ~~かれじょ~~'],
        ['似', '{似|に}る, {似合|にあ}う', '(ジ — {類似|るいじ}, N1)', 'gần như chỉ gặp **に**'],
        ['太', '{太|ふと}い, {太|ふと}る', '{太陽|たいよう} (タイ)', 'ふと**い** (tính từ) ↔ ふと**る** (động từ)'],
        ['泣', '{泣|な}く', '(キュウ — {号泣|ごうきゅう}, N1)', 'đồng âm {鳴|な}く (chim kêu) — khác chữ!'],
        ['表', '{表|おもて}', '{発表|はっぴょう}, {表情|ひょうじょう} (ヒョウ → ぴょう)', 'はっ**ぴょう** — sau っ biến thành ぴょう'],
        ['情', '(なさけ — N1)', '{情報|じょうほう}, {表情|ひょうじょう} (ジョウ)', 'trường âm: **jou**hou, hyou**jou**'],
        ['報', '(むくいる — N1)', '{情報|じょうほう}, {予報|よほう} (ホウ)', 'よ**ほう** — trường âm ou'],
        ['絶', '(たえる — N1)', '{絶対|ぜったい} (ゼツ → ぜっ)', 'ぜ**っ**たい — âm ngắt'],
        ['対', '—', '{反対|はんたい}, {絶対|ぜったい} (タイ)', 'はん**たい** — không đục: ~~はんだい~~'],
        ['雲', '{雲|くも}', '(ウン — {雲海|うんかい}, N1)', '{雨雲|あまぐも}: 雨 → あま, 雲 → **ぐも** (đục)'],
        ['想', '—', '{予想|よそう}, {感想|かんそう} (ソウ)', 'trường âm: yo**sou**'],
        ['幸', '{幸|しあわ}せ, {幸|さいわ}い', '{幸運|こううん}, {不幸|ふこう} (コウ)', 'しあわ**せ** — đuôi せ; {幸|さいわ}い — đuôi い'],
      ],
    },
    {
      t: 'table',
      caption: 'Chữ trông giống — bẫy của đề 表記',
      head: ['Chữ của bài', 'Chữ dễ nhầm', 'Phân biệt'],
      rows: [
        ['様 (dạng)', '横 (ngang — {横|よこ})', 'cùng 木 bên trái; phải 様 là 羊 + nước, phải 横 là 黄'],
        ['確 (chắc)', '破 (rách — Bài 19)', 'cùng 石; phải 確 là 隺 (chim), phải 破 là 皮'],
        ['実 (thật)', '美 (đẹp — {美|うつく}しい)', '実 có 宀 (mái nhà) ở trên; 美 có 羊 ở trên'],
        ['彼 (người kia)', '波 (sóng — {波|なみ})', 'cùng 皮; trái 彼 là 彳 (bước chân), trái 波 là 氵'],
        ['似 (giống)', '以 ({以上|いじょう})', '似 = 亻 + 以'],
        ['太 (to, béo)', '犬 (chó)・大 (to)', '太 chấm ở dưới giữa; 犬 chấm trên bên phải; 大 không chấm'],
        ['泣 (khóc)', '位 (vị trí — {位置|いち})', 'cùng 立; trái 泣 là 氵, trái 位 là 亻'],
        ['表 (biểu)', '素 ({素晴|すば}らしい — Bài 17)', 'trên giống nhau; dưới 表 là phần áo, dưới 素 là 糸'],
        ['情 (tình)', '晴 (nắng — Bài 15)', 'cùng 青; trái 情 là 忄 (lòng), trái 晴 là 日'],
        ['報 (báo)', '服 (quần áo — {服|ふく})', 'cùng phần phải; trái 報 là 幸, trái 服 là 月'],
        ['絶 (tuyệt)', '給 ({給料|きゅうりょう} — Bài 16)', 'cùng 糸; phải 絶 là 色, phải 給 là 合'],
        ['対 (đối)', '村 (làng — {村|むら})', 'cùng 寸; trái 対 là 文, trái 村 là 木'],
        ['雲 (mây)', '雪 (tuyết)・雷 (sấm)', 'cùng 雨; dưới 雲 là 云, dưới 雪 là ヨ, dưới 雷 là 田'],
        ['想 (tưởng)', '相 ({相手|あいて})・思 ({思|おも}う)', '想 = 相 + 心; 思 = 田 + 心'],
        ['幸 (hạnh)', '辛 (cay — {辛|から}い)', '幸 trên là 土 (hai ngang + sổ), 辛 trên là 立'],
      ],
    },
    {
      t: 'readkanji',
      id: 'b20-doc-kanji',
      title: 'Đọc KHÔNG furigana — 20 câu (chữ mới + chữ đã học)',
      note: 'Che phần đáp án, đọc to cả câu rồi bấm hiện cách đọc. Câu nào vấp ở chữ mới thì quay lại bảng trên.',
      items: [
        { text: '{最近|さいきん}、{先生|せんせい}の{様子|ようす}が{少|すこ}し{変|へん}です。', ro: 'Saikin, sensei no yousu ga sukoshi hen desu.', vi: 'Dạo này dáng vẻ của thầy hơi lạ.' },
        { text: 'お{客様|きゃくさま}、こちらへどうぞ。', ro: 'Okyakusama, kochira e douzo.', vi: 'Mời quý khách đi lối này.' },
        { text: '{確|たし}か、{会議|かいぎ}は{三時|さんじ}からだったと{思|おも}います。', ro: 'Tashika, kaigi wa sanji kara datta to omoimasu.', vi: 'Nếu tôi nhớ không nhầm thì cuộc họp từ 3 giờ.' },
        { text: '{出|で}かける{前|まえ}に、{電車|でんしゃ}の{時間|じかん}を{確認|かくにん}しました。', ro: 'Dekakeru mae ni, densha no jikan o kakunin shimashita.', vi: 'Trước khi ra ngoài tôi đã kiểm tra giờ tàu.' },
        { text: '{実|じつ}は、{来月|らいげつ}{引|ひ}っ{越|こ}すんです。', ro: 'Jitsu wa, raigetsu hikkosu n desu.', vi: 'Thật ra là tháng sau tôi chuyển nhà.' },
        { text: 'それはうわさで、{事実|じじつ}ではありません。', ro: 'Sore wa uwasa de, jijitsu de wa arimasen.', vi: 'Đó là tin đồn, không phải sự thật.' },
        { text: '{彼|かれ}はいつも{約束|やくそく}を{守|まも}ります。', ro: 'Kare wa itsumo yakusoku o mamorimasu.', vi: 'Anh ấy luôn giữ lời hứa.' },
        { text: '{彼女|かのじょ}はお{母|かあ}さんによく{似|に}ています。', ro: 'Kanojo wa okaasan ni yoku nite imasu.', vi: 'Cô ấy rất giống mẹ.' },
        { text: '{日本|にほん}に{来|き}てから、{三|さん}キロ{太|ふと}りました。', ro: 'Nihon ni kite kara, san kiro futorimashita.', vi: 'Từ khi sang Nhật tôi lên 3 cân.' },
        { text: 'もっと{太|ふと}いペンはありますか。', ro: 'Motto futoi pen wa arimasu ka.', vi: 'Có cái bút nét to hơn không?' },
        { text: '{子|こ}どもが{今|いま}にも{泣|な}きそうな{顔|かお}をしています。', ro: 'Kodomo ga ima ni mo nakisou na kao o shite imasu.', vi: 'Đứa bé có vẻ mặt sắp khóc đến nơi.' },
        { text: '{来週|らいしゅう}、{試験|しけん}の{結果|けっか}が{発表|はっぴょう}になります。', ro: 'Raishuu, shiken no kekka ga happyou ni narimasu.', vi: 'Tuần sau kết quả thi sẽ được công bố.' },
        { text: '{彼|かれ}は{悲|かな}しそうな{表情|ひょうじょう}をしていました。', ro: 'Kare wa kanashisou na hyoujou o shite imashita.', vi: 'Anh ấy mang nét mặt buồn bã.' },
        { text: 'インターネットの{情報|じょうほう}をすぐに{信|しん}じてはいけません。', ro: 'Intaanetto no jouhou o sugu ni shinjite wa ikemasen.', vi: 'Không được tin ngay thông tin trên mạng.' },
        { text: '{天気予報|てんきよほう}によると、{明日|あした}は{雨|あめ}だそうです。', ro: 'Tenki yohou ni yoru to, ashita wa ame da sou desu.', vi: 'Theo dự báo thời tiết thì mai trời mưa.' },
        { text: 'このことは{絶対|ぜったい}に{誰|だれ}にも{言|い}わないでください。', ro: 'Kono koto wa zettai ni dare ni mo iwanaide kudasai.', vi: 'Chuyện này tuyệt đối đừng nói với ai.' },
        { text: '{駅|えき}の{反対側|はんたいがわ}に{新|あたら}しい{店|みせ}ができたらしいです。', ro: 'Eki no hantaigawa ni atarashii mise ga dekita rashii desu.', vi: 'Nghe đâu phía bên kia nhà ga mới mở một cửa hàng.' },
        { text: '{空|そら}に{黒|くろ}い{雲|くも}が{出|で}てきました。', ro: 'Sora ni kuroi kumo ga dete kimashita.', vi: 'Trên trời mây đen đã kéo đến.' },
        { text: '{私|わたし}の{予想|よそう}は{当|あ}たりました。', ro: 'Watashi no yosou wa atarimashita.', vi: 'Dự đoán của tôi đã đúng.' },
        { text: '{二人|ふたり}はとても{幸|しあわ}せそうです。', ro: 'Futari wa totemo shiawasesou desu.', vi: 'Hai người trông rất hạnh phúc.' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b20-doc-doan',
      title: 'Đọc đoạn ngắn kiểu đề — 3 đoạn không furigana',
      note: 'Đọc to cả đoạn trong 40 giây như phần Reading của thi nói, rồi mới mở đáp án.',
      items: [
        { text: '{今朝|けさ}の{天気予報|てんきよほう}では、{一日中|いちにちじゅう}{晴|は}れると{言|い}っていました。でも、{昼|ひる}ごろ{空|そら}に{黒|くろ}い{雲|くも}が{出|で}てきて、{今|いま}にも{雨|あめ}が{降|ふ}りそうになりました。{予報|よほう}が{外|はず}れたようです。{私|わたし}は{傘|かさ}を{持|も}っていなかったので、{急|いそ}いで{家|いえ}に{帰|かえ}りました。', ro: 'Kesa no tenki yohou de wa, ichinichijuu hareru to itte imashita. Demo, hiru goro sora ni kuroi kumo ga dete kite, ima ni mo ame ga furisou ni narimashita. Yohou ga hazureta you desu. Watashi wa kasa o motte inakatta node, isoide ie ni kaerimashita.', vi: 'Dự báo thời tiết sáng nay nói nắng cả ngày. Nhưng khoảng trưa mây đen kéo đến, trời như sắp mưa đến nơi. Có vẻ dự báo đã sai. Tôi không mang ô nên vội về nhà.' },
        { text: 'クラスで、{本田先生|ほんだせんせい}が{結婚|けっこん}するといううわさを{聞|き}きました。{確|たし}かに{最近|さいきん}の{先生|せんせい}は{幸|しあわ}せそうな{表情|ひょうじょう}をしています。でも、{実|じつ}は{結婚|けっこん}するのは{先生|せんせい}の{妹|いもうと}さんでした。うわさの{情報|じょうほう}は、{絶対|ぜったい}に{確認|かくにん}したほうがいいと{思|おも}いました。', ro: 'Kurasu de, Honda-sensei ga kekkon suru to iu uwasa o kikimashita. Tashika ni saikin no sensei wa shiawasesou na hyoujou o shite imasu. Demo, jitsu wa kekkon suru no wa sensei no imouto-san deshita. Uwasa no jouhou wa, zettai ni kakunin shita hou ga ii to omoimashita.', vi: 'Ở lớp tôi nghe tin đồn thầy Honda sắp cưới. Đúng là dạo này thầy mang nét mặt hạnh phúc. Nhưng thật ra người cưới là em gái thầy. Tôi nghĩ thông tin từ tin đồn thì nhất định nên kiểm chứng.' },
        { text: '{妹|いもうと}は{母|はは}によく{似|に}ていて、{笑|わら}うとき{目|め}が{細|ほそ}くなります。{子|こ}どものころはよく{泣|な}いていましたが、{今|いま}はとても{明|あか}るいです。{彼氏|かれし}ができたらしくて、{毎日|まいにち}{楽|たの}しそうです。{少|すこ}し{太|ふと}ったようですが、{本人|ほんにん}は{気|き}にしていません。', ro: 'Imouto wa haha ni yoku nite ite, warau toki me ga hosoku narimasu. Kodomo no koro wa yoku naite imashita ga, ima wa totemo akarui desu. Kareshi ga dekita rashikute, mainichi tanoshisou desu. Sukoshi futotta you desu ga, honnin wa ki ni shite imasen.', vi: 'Em gái tôi rất giống mẹ, khi cười mắt híp lại. Hồi nhỏ em hay khóc nhưng bây giờ rất vui tươi. Nghe đâu em đã có bạn trai, ngày nào trông cũng vui. Có vẻ em hơi béo lên nhưng bản thân em không bận tâm.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b20-han-doc',
      title: '漢字読み — chọn cách đọc của từ in đậm (12 câu)',
      items: [
        { q: '{医者|いしゃ}は「{少|すこ}し**様子**を{見|み}ましょう」と{言|い}いました。', options: ['ようこ', 'ようす', 'さまこ', 'さます'], correct: 1, why: '**{様子|ようす}** (yousu) — 子 đọc す trong từ này.' },
        { q: '**確**か、{彼|かれ}は{東京|とうきょう}に{住|す}んでいます。', options: ['たし', 'かく', 'たしか', 'たす'], correct: 0, why: '**{確|たし}か** (tashika) — chữ 確 đọc たし, đuôi か là kana.' },
        { q: '{名前|なまえ}をもう{一度|いちど}**確認**してください。', options: ['かくにん', 'かくいん', 'たしにん', 'かくじん'], correct: 0, why: '**{確認|かくにん}** (kakunin).' },
        { q: '**実**は、{私|わたし}も{知|し}りませんでした。', options: ['み', 'じつ', 'じっ', 'しつ'], correct: 1, why: '**{実|じつ}は** (jitsu wa).' },
        { q: '**彼女**はピアノがとても{上手|じょうず}です。', options: ['かれじょ', 'かのじょ', 'かのおんな', 'ひじょ'], correct: 1, why: '**{彼女|かのじょ}** (kanojo) — 彼 đọc かの ở đây.' },
        { q: '{兄|あに}と{弟|おとうと}はあまり**似**ていません。', options: ['に', 'じ', 'にあ', 'さ'], correct: 0, why: '**{似|に}ていません** (nite imasen).' },
        { q: '{最近|さいきん}、ちょっと**太**りました。', options: ['ふと', 'ふとい', 'たい', 'おお'], correct: 0, why: '**{太|ふと}りました** (futorimashita).' },
        { q: '{合格|ごうかく}して、うれしくて**泣**いてしまいました。', options: ['な', 'き', 'なき', 'きゅう'], correct: 0, why: '**{泣|な}いて** (naite).' },
        { q: '{来週|らいしゅう}、{授業|じゅぎょう}で**発表**します。', options: ['はつひょう', 'はっぴょう', 'はっひょう', 'はつぴょう'], correct: 1, why: '**{発表|はっぴょう}** (happyou) — ハツ + ヒョウ → はっぴょう.' },
        { q: '{旅行|りょこう}の**情報**をインターネットで{調|しら}べました。', options: ['じょうほう', 'じょほう', 'せいほう', 'じょうぼう'], correct: 0, why: '**{情報|じょうほう}** (jouhou) — hai trường âm.' },
        { q: 'その{意見|いけん}には**反対**です。', options: ['はんだい', 'はんたい', 'はんつい', 'ばんたい'], correct: 1, why: '**{反対|はんたい}** (hantai).' },
        { q: '**予想**どおり、{雨|あめ}が{降|ふ}りました。', options: ['よそう', 'よぞう', 'よしょう', 'ようそう'], correct: 0, why: '**{予想|よそう}** (yosou).' },
      ],
    },
    {
      t: 'mcq',
      id: 'b20-han-chon',
      title: '表記 — chọn chữ Hán đúng cho từ viết bằng hiragana (8 câu)',
      items: [
        { q: '{父|ちち}の**ようす**が{少|すこ}しおかしいです。', options: ['横子', '様子', '洋子', '様字'], correct: 1, why: '**様子** — 様 (木 + 羊 + nước). 横 là "ngang"; 洋 (Bài 17) là "biển".' },
        { q: '**じつ**は、うわさは{本当|ほんとう}でした。', options: ['美は', '実は', '室は', '宝は'], correct: 1, why: '**実は** — 宀 + 三 + 大. 美 (đẹp) có 羊 trên.' },
        { q: '**かれ**はどこに{住|す}んでいますか。', options: ['波', '皮', '彼', '被'], correct: 2, why: '**彼** — 彳 + 皮. 波 (sóng) có 氵.' },
        { q: '{子|こ}どもが**ないて**います。', options: ['位いて', '泣いて', '立いて', '鳴いて'], correct: 1, why: '**泣く** (người khóc) — 氵 + 立. **鳴く** = chim / mèo kêu — đồng âm, khác chữ.' },
        { q: '{新|あたら}しい**じょうほう**がありますか。', options: ['晴報', '情報', '情服', '清報'], correct: 1, why: '**情報** — 情 bên trái là 忄 (lòng), 報 bên trái là 幸.' },
        { q: '**ぜったい**に{遅|おく}れないでください。', options: ['絶村', '給対', '絶対', '色対'], correct: 2, why: '**絶対** — 絶 = 糸 + 色; 対 = 文 + 寸.' },
        { q: '{空|そら}に**くも**がありません。', options: ['雪', '雷', '雲', '電'], correct: 2, why: '**雲** — dưới 雨 là 云. 雪 (tuyết), 雷 (sấm), 電 (điện).' },
        { q: '{二人|ふたり}はとても**しあわせ**そうです。', options: ['辛せ', '幸せ', '午せ', '平せ'], correct: 1, why: '**幸せ** — trên là 土; 辛 (cay) trên là 立.' },
      ],
    },
    {
      t: 'write',
      id: 'b20-viet-kanji',
      title: 'Tập viết — 6 chữ ✍ và 8 từ',
      note: 'Viết 6 chữ ✍ trước (đúng thứ tự nét theo hoạt hình), rồi viết cả từ. 👁 chỉ cần đọc được — viết thêm nếu còn thời gian.',
      chars: ['実', '彼', '太', '泣', '表', '雲', '様子', '確か', '実は', '彼女', '発表', '情報', '絶対', '予想'],
      goi: {
        '様子': 'ようす · dáng vẻ, tình hình',
        '確か': 'たしか · hình như; chắc chắn',
        '実は': 'じつは · thật ra là',
        '彼女': 'かのじょ · cô ấy; bạn gái',
        '発表': 'はっぴょう · công bố, thuyết trình',
        '情報': 'じょうほう · thông tin',
        '絶対': 'ぜったい · tuyệt đối',
        '予想': 'よそう · dự đoán',
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
  id: 'b20-nghe',
  kind: 'listening',
  title: 'Nghe hiểu N4 — 6 bài theo đủ 4 dạng đề: 課題理解 · ポイント理解 · 発話表現 · 即時応答',
  goal: 'Nghe hai người chuẩn bị đi leo núi và một cuộc nói chuyện ở trường để biết việc phải làm TRƯỚC giữa nhiều thông tin "nghe nói / có khi / chắc là"; nghe để bắt đúng lý do một người trông buồn (tin đồn quán cà phê sắp đóng cửa) và đúng thời tiết buổi chiều trong bản tin dự báo; chọn câu nói đúng khi thấy bạn ốm, thấy đồ sắp rơi, muốn báo có thể đến muộn; đáp nhanh câu có ～そう, ～らしい, ～はず, ～かもしれない — đúng 4 dạng của phần 聴解 đề N4.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Phần nghe (聴解) đề JLPT N4 — 4 dạng, 35 phút',
      head: ['Mondai', 'Dạng', 'Làm gì', 'Mẹo của bài này'],
      rows: [
        ['問題1', '課題理解 (hiểu nhiệm vụ)', 'Nghe hội thoại, chọn việc người đó phải làm **trước / tiếp theo**.', 'Thông tin **～らしい／～かもしれない** thường là lý do để ĐỔI kế hoạch; việc người kia nhận làm (**{僕|ぼく}が～ておく**) → loại; câu chốt thường bắt đầu bằng **じゃ、まず～**.'],
        ['問題2', 'ポイント理解 (hiểu điểm chính)', 'Câu hỏi nghe **trước**, rồi tìm đúng điểm đó.', 'Lý do bị **phủ định** (**～じゃないんです**, **～と{思|おも}ったけど**) là bẫy. Bản tin thời tiết: chú ý **thời điểm** (午前・午後・夜) đi với từng dự báo **～でしょう／～かもしれません**.'],
        ['問題3', '発話表現 (nói gì trong tình huống)', 'Nghe mô tả tình huống, chọn câu nên nói.', 'Thấy bạn có vẻ ốm → **{具合|ぐあい}が{悪|わる}そうですね**; thấy đồ sắp rơi → **～そうですよ**; báo khả năng → **～かもしれません**.'],
        ['問題4', '即時応答 (đáp ngay)', 'Nghe một câu ngắn, chọn câu đáp tự nhiên nhất.', '"～らしいよ" (tin đồn) → **えっ、{本当|ほんとう}？{誰|だれ}に{聞|き}いたの？**; "～はずなのに" → đoán lý do **～のかもしれないね**. Cẩn thận câu lặp lại từ của câu hỏi nhưng sai nghĩa.'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nghe trong bài này',
      items: [
        '**Hai そう** — nghe ngay trước そう: "ふり**そう**" (sắp mưa — mình thấy) ↔ "ふる**そう**" (nghe nói mưa). Tốc độ thật rất nhanh: phân biệt bằng **り／る**, **おいし／おいしい**.',
        '**みたい** gần như luôn là văn nói của ようだ; **らしい** thường đi với **うわさ／～の{話|はなし}では／みんなが{言|い}ってる**. Đuôi **～かも** (rút gọn của かもしれない) rất hay nghe giữa bạn bè: {雨|あめ}かも！',
        '**はず** đi với căn cứ — nghe vế trước (～から／～ので) để hiểu vì sao người nói tin như vậy; **～はずなのに** báo hiệu thực tế KHÁC căn cứ.',
        'Bấm nghe 2 lần: lần 1 không nhìn lời, chỉ trả lời câu hỏi; lần 2 bật lời thoại + romaji để soát từng câu.',
      ],
    },

    /* ── 1 ── */
    { t: 'h', text: 'Bài 1 — 問題1 課題理解: chuẩn bị đi leo núi' },
    NG('b20-ng-1', '{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか', 'Dạng 課題理解 — người đàn ông nhận mang ô và mua cơm hộp; chỉ chọn việc NGƯỜI PHỤ NỮ phải làm trước tiên.', [
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}が{電話|でんわ}で{話|はな}しています。{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Otoko no hito to onna no hito ga denwa de hanashite imasu. Onna no hito wa kono ato mazu nani o shimasu ka.', 'Một người đàn ông và một người phụ nữ đang nói chuyện điện thoại. Sau đây người phụ nữ trước tiên sẽ làm gì?'],
      ['カルロス', 'ja-nam', 'もしもし、アンナさん。{明日|あした}の{山登|やまのぼ}り、{天気予報|てんきよほう}を{見|み}た？{午後|ごご}から{雨|あめ}が{降|ふ}るそうだよ。', 'Moshimoshi, Anna-san. Ashita no yamanobori, tenki yohou o mita? Gogo kara ame ga furu sou da yo.', 'A lô, Anna. Chuyến leo núi mai ấy, cậu xem dự báo chưa? Nghe nói từ chiều trời mưa đấy.'],
      ['アンナ', 'ja-nu', 'えっ、そうなの？じゃ、{傘|かさ}を{持|も}っていかなきゃ。', 'E, sou na no? Ja, kasa o motte ikanakya.', 'Hả, thế à? Vậy phải mang ô thôi.'],
      ['カルロス', 'ja-nam', '{傘|かさ}は{僕|ぼく}が{二本|にほん}{持|も}っていくから、{大丈夫|だいじょうぶ}。それより、{山|やま}の{上|うえ}はかなり{寒|さむ}いらしいよ。', 'Kasa wa boku ga nihon motte iku kara, daijoubu. Sore yori, yama no ue wa kanari samui rashii yo.', 'Ô thì mình mang hai cái, không sao. Quan trọng hơn là nghe đâu trên đỉnh núi lạnh lắm.'],
      ['アンナ', 'ja-nu', 'そう。{暖|あたた}かい{上着|うわぎ}なら、もうかばんに{入|い}れてあるよ。お{弁当|べんとう}はどうする？', 'Sou. Atatakai uwagi nara, mou kaban ni irete aru yo. Obentou wa dou suru?', 'Vậy à. Áo khoác ấm thì mình cho vào túi rồi. Cơm hộp tính sao?'],
      ['カルロス', 'ja-nam', '{山|やま}の{上|うえ}には{店|みせ}がないはずだから、{朝|あさ}、{駅|えき}のコンビニで{僕|ぼく}が{二人分|ふたりぶん}{買|か}っておくよ。', 'Yama no ue ni wa mise ga nai hazu da kara, asa, eki no konbini de boku ga futaribun katte oku yo.', 'Trên núi chắc chắn không có quán nên sáng mai mình mua sẵn hai suất ở cửa hàng tiện lợi trong ga.'],
      ['アンナ', 'ja-nu', 'ありがとう。{道|みち}はスマホの{地図|ちず}で{見|み}ればいいよね。', 'Arigatou. Michi wa sumaho no chizu de mireba ii yo ne.', 'Cảm ơn. Đường đi thì xem bản đồ trên điện thoại là được nhỉ.'],
      ['カルロス', 'ja-nam', 'うん。でも、アンナさんのスマホ、{今日|きょう}も{電池|でんち}が{切|き}れそうだって{言|い}っていたよね。{山|やま}で{使|つか}えなくなるかもしれないよ。', 'Un. Demo, Anna-san no sumaho, kyou mo denchi ga kiresou da tte itte ita yo ne. Yama de tsukaenaku naru kamoshirenai yo.', 'Ừ. Nhưng hôm nay cậu cũng nói điện thoại sắp hết pin mà. Có khi lên núi không dùng được đấy.'],
      ['アンナ', 'ja-nu', 'あ、そうだ。{今|いま}も{残|のこ}り{十|じゅう}パーセントぐらい……。じゃ、まず{充電|じゅうでん}しておくね。', 'A, sou da. Ima mo nokori juppaasento gurai……. Ja, mazu juuden shite oku ne.', 'À đúng rồi. Bây giờ cũng chỉ còn khoảng 10%… Vậy mình sạc trước đã.'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Onna no hito wa kono ato mazu nani o shimasu ka.', 'Sau đây người phụ nữ trước tiên sẽ làm gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b20-ng-1-q',
      title: 'Bài 1 — chọn đáp án',
      items: [
        { q: '{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', options: ['{傘|かさ}を{買|か}いに{行|い}く', '{上着|うわぎ}をかばんに{入|い}れる', 'スマホを{充電|じゅうでん}する', 'コンビニでお{弁当|べんとう}を{買|か}う'], correct: 2, why: 'Ô → **{僕|ぼく}が{二本|にほん}{持|も}っていく** (bẫy ①); áo khoác → **もうかばんに{入|い}れてある** (đã làm — bẫy ②); cơm hộp → **{僕|ぼく}が{買|か}っておく** (bẫy ③). Câu chốt: **じゃ、まず{充電|じゅうでん}しておくね**. 〔Mazu juuden shite oku ne.〕' },
        { q: '{山|やま}の{上|うえ}について、{男|おとこ}の{人|ひと}は{何|なん}と{言|い}っていますか。', options: ['{暖|あたた}かいそうだ', '{寒|さむ}いらしい', '{店|みせ}がたくさんあるはずだ', '{雨|あめ}は{降|ふ}らないかもしれない'], correct: 1, why: '**{山|やま}の{上|うえ}はかなり{寒|さむ}いらしいよ** và **{店|みせ}がないはずだ**. 〔Yama no ue wa kanari samui rashii yo.〕' },
      ],
    },

    /* ── 2 ── */
    { t: 'h', text: 'Bài 2 — 問題1 課題理解: hỏi thầy về buổi thuyết trình' },
    NG('b20-ng-2', '{女|おんな}の{学生|がくせい}はこのあとまず{何|なに}をしますか', 'Dạng 課題理解 — hai thông tin "nghe đâu" và "chắc là" làm đổi kế hoạch; chờ câu "じゃ、まず～" ở cuối.', [
      ['ナレーター', 'ja-nu', '{大学|だいがく}で{男|おとこ}の{学生|がくせい}と{女|おんな}の{学生|がくせい}が{話|はな}しています。{女|おんな}の{学生|がくせい}はこのあとまず{何|なに}をしますか。', 'Daigaku de otoko no gakusei to onna no gakusei ga hanashite imasu. Onna no gakusei wa kono ato mazu nani o shimasu ka.', 'Ở trường đại học, một nam sinh và một nữ sinh đang nói chuyện. Sau đây nữ sinh trước tiên sẽ làm gì?'],
      ['マリヤム', 'ja-nu', '{西川|にしかわ}さん、{来週|らいしゅう}の{発表|はっぴょう}のことで、{本田先生|ほんだせんせい}に{聞|き}きたいことがあるんですが、{先生|せんせい}は{今日|きょう}、{研究室|けんきゅうしつ}にいますか。', 'Nishikawa-san, raishuu no happyou no koto de, Honda-sensei ni kikitai koto ga aru n desu ga, sensei wa kyou, kenkyuushitsu ni imasu ka.', 'Anh Nishikawa, em có việc muốn hỏi thầy Honda về buổi thuyết trình tuần sau, hôm nay thầy có ở phòng nghiên cứu không ạ?'],
      ['{西川|にしかわ}', 'ja-nam', '{今日|きょう}は{会議|かいぎ}で{一日中|いちにちじゅう}いないらしいよ。さっき{事務室|じむしつ}の{人|ひと}がそう{言|い}っていた。', 'Kyou wa kaigi de ichinichijuu inai rashii yo. Sakki jimushitsu no hito ga sou itte ita.', 'Nghe đâu hôm nay thầy họp nên vắng cả ngày. Lúc nãy người ở văn phòng nói vậy.'],
      ['マリヤム', 'ja-nu', 'そうですか……。じゃ、{明日|あした}の{授業|じゅぎょう}のあとで{聞|き}こうかな。', 'Sou desu ka……. Ja, ashita no jugyou no ato de kikou ka na.', 'Vậy ạ… Thế để mai sau giờ học em hỏi vậy.'],
      ['{西川|にしかわ}', 'ja-nam', '{明日|あした}の{授業|じゅぎょう}は{休|やす}みのはずだよ。{掲示板|けいじばん}に{書|か}いてあったから。', 'Ashita no jugyou wa yasumi no hazu da yo. Keijiban ni kaite atta kara.', 'Mai chắc chắn là nghỉ học đấy. Trên bảng thông báo có ghi mà.'],
      ['マリヤム', 'ja-nu', 'えっ、{困|こま}ったな。{発表|はっぴょう}の{資料|しりょう}を{今週|こんしゅう}{中|じゅう}に{見|み}てもらいたいんです。', 'E, komatta na. Happyou no shiryou o konshuujuu ni mite moraitai n desu.', 'Ôi, khổ quá. Em muốn nhờ thầy xem tài liệu thuyết trình trong tuần này.'],
      ['{西川|にしかわ}', 'ja-nam', 'じゃ、メールで{送|おく}ってみたら？{先生|せんせい}は{夜|よる}、メールを{見|み}ているみたいだよ。{僕|ぼく}も{先週|せんしゅう}{夜|よる}{送|おく}ったら、すぐ{返事|へんじ}が{来|き}たから。', 'Ja, meeru de okutte mitara? Sensei wa yoru, meeru o mite iru mitai da yo. Boku mo senshuu yoru okuttara, sugu henji ga kita kara.', 'Thế thử gửi qua email xem? Hình như buổi tối thầy có xem email đấy. Tuần trước tối anh gửi là có trả lời ngay.'],
      ['マリヤム', 'ja-nu', 'そうなんですね。でも、{資料|しりょう}がまだ{少|すこ}し{終|お}わっていなくて……。', 'Sou na n desu ne. Demo, shiryou ga mada sukoshi owatte inakute…….', 'Ra vậy. Nhưng tài liệu em vẫn chưa xong hẳn…'],
      ['{西川|にしかわ}', 'ja-nam', '{全部|ぜんぶ}{終|お}わってからでいいよ。{今日|きょう}の{夜|よる}までに{送|おく}れば、{先生|せんせい}は{発表|はっぴょう}の{前|まえ}に{見|み}てくれるはずだよ。', 'Zenbu owatte kara de ii yo. Kyou no yoru made ni okureba, sensei wa happyou no mae ni mite kureru hazu da yo.', 'Xong hết rồi gửi cũng được. Gửi trước tối nay thì chắc chắn thầy sẽ xem cho em trước buổi thuyết trình.'],
      ['マリヤム', 'ja-nu', 'わかりました。じゃ、まず{資料|しりょう}を{最後|さいご}まで{作|つく}ってしまいます。ありがとうございました。', 'Wakarimashita. Ja, mazu shiryou o saigo made tsukutte shimaimasu. Arigatou gozaimashita.', 'Em hiểu rồi. Vậy trước tiên em làm xong hết tài liệu đã. Em cảm ơn anh.'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{学生|がくせい}はこのあとまず{何|なに}をしますか。', 'Onna no gakusei wa kono ato mazu nani o shimasu ka.', 'Sau đây nữ sinh trước tiên sẽ làm gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b20-ng-2-q',
      title: 'Bài 2 — chọn đáp án',
      items: [
        { q: '{女|おんな}の{学生|がくせい}はこのあとまず{何|なに}をしますか。', options: ['{研究室|けんきゅうしつ}へ{先生|せんせい}に{会|あ}いに{行|い}く', '{明日|あした}の{授業|じゅぎょう}のあとで{先生|せんせい}に{聞|き}く', '{発表|はっぴょう}の{資料|しりょう}を{最後|さいご}まで{作|つく}る', 'すぐ{先生|せんせい}にメールを{送|おく}る'], correct: 2, why: 'Thầy **vắng cả ngày** (bẫy ①); mai **nghỉ học** (bẫy ②); email gửi **sau khi xong hết** (bẫy ④ — chưa phải việc đầu tiên). Câu chốt: **じゃ、まず{資料|しりょう}を{最後|さいご}まで{作|つく}ってしまいます**. 〔Mazu shiryou o saigo made tsukutte shimaimasu.〕' },
        { q: '{明日|あした}の{授業|じゅぎょう}について、{男|おとこ}の{学生|がくせい}はどうしてそう{思|おも}いましたか。', options: ['{先生|せんせい}に{聞|き}いたから', '{掲示板|けいじばん}に{書|か}いてあったから', '{事務室|じむしつ}の{人|ひと}が{言|い}ったから', 'メールが{来|き}たから'], correct: 1, why: 'Căn cứ của **{休|やす}みのはず**: **{掲示板|けいじばん}に{書|か}いてあったから** (～てある — ôn Bài 18). Người văn phòng nói chuyện thầy vắng hôm nay (らしい). 〔Keijiban ni kaite atta kara.〕' },
      ],
    },

    /* ── 3 ── */
    { t: 'h', text: 'Bài 3 — 問題2 ポイント理解: vì sao bạn trông buồn?' },
    NG('b20-ng-3', '{女|おんな}の{人|ひと}はどうして{元気|げんき}がないのですか', 'Dạng ポイント理解 — nghe câu hỏi trước. Người nói phủ định hai lý do (không phải thi, không phải cãi nhau); lý do thật nằm sau "実は".', [
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}が{話|はな}しています。{女|おんな}の{人|ひと}はどうして{元気|げんき}がないのですか。', 'Otoko no hito to onna no hito ga hanashite imasu. Onna no hito wa doushite genki ga nai no desu ka.', 'Một người đàn ông và một người phụ nữ đang nói chuyện. Vì sao người phụ nữ trông không vui?'],
      ['ダニエル', 'ja-nam', 'メアリーさん、{今日|きょう}はなんだか{元気|げんき}がなさそうですね。{昨日|きのう}のテスト、だめだったんですか。', 'Mearii-san, kyou wa nandaka genki ga nasasou desu ne. Kinou no tesuto, dame datta n desu ka.', 'Mary, hôm nay trông cậu có vẻ không vui nhỉ. Bài kiểm tra hôm qua không ổn à?'],
      ['メアリー', 'ja-nu', 'ううん、テストはよくできたと{思|おも}う。', 'Uun, tesuto wa yoku dekita to omou.', 'Không, bài kiểm tra mình nghĩ làm tốt.'],
      ['ダニエル', 'ja-nam', 'じゃ、{友達|ともだち}とけんかでもしたんですか。', 'Ja, tomodachi to kenka demo shita n desu ka.', 'Vậy cãi nhau với bạn hay sao?'],
      ['メアリー', 'ja-nu', 'それも{違|ちが}う。{実|じつ}はね、{駅前|えきまえ}の「こもれび」っていうカフェ、{知|し}ってる？', 'Sore mo chigau. Jitsu wa ne, ekimae no "Komorebi" tte iu kafe, shitteru?', 'Cũng không phải. Thật ra là, cậu biết quán cà phê tên "Komorebi" trước ga không?'],
      ['ダニエル', 'ja-nam', 'ああ、メアリーさんがよく{勉強|べんきょう}している{店|みせ}ですよね。', 'Aa, Mearii-san ga yoku benkyou shite iru mise desu yo ne.', 'À, quán cậu hay ngồi học ấy nhỉ.'],
      ['メアリー', 'ja-nu', 'そう。あの{店|みせ}、{来月|らいげつ}{閉|し}まるらしいの。{常連|じょうれん}のお{客|きゃく}さんたちが{話|はな}していたんだ。', 'Sou. Ano mise, raigetsu shimaru rashii no. Jouren no okyaku-santachi ga hanashite ita n da.', 'Ừ. Nghe đâu tháng sau quán đó đóng cửa. Mấy khách quen nói chuyện với nhau thế.'],
      ['ダニエル', 'ja-nam', 'えっ、あんなに{人気|にんき}があるのに？でも、うわさですよね。{店|みせ}の{人|ひと}に{聞|き}いてみたら？', 'E, anna ni ninki ga aru noni? Demo, uwasa desu yo ne. Mise no hito ni kiite mitara?', 'Hả, đông khách như thế mà? Nhưng là tin đồn thôi mà. Thử hỏi nhân viên quán xem?'],
      ['メアリー', 'ja-nu', 'うん、{今日|きょう}{行|い}って{聞|き}いてみる。{本当|ほんとう}じゃなければいいんだけど……。', 'Un, kyou itte kiite miru. Hontou ja nakereba ii n da kedo…….', 'Ừ, hôm nay mình sẽ đến hỏi thử. Mong là không phải thật…'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}はどうして{元気|げんき}がないのですか。', 'Onna no hito wa doushite genki ga nai no desu ka.', 'Vì sao người phụ nữ trông không vui?'],
    ]),
    {
      t: 'mcq',
      id: 'b20-ng-3-q',
      title: 'Bài 3 — chọn đáp án',
      items: [
        { q: '{女|おんな}の{人|ひと}はどうして{元気|げんき}がないのですか。', options: ['テストがよくできなかったから', '{友達|ともだち}とけんかしたから', '{好|す}きなカフェが{閉|し}まるといううわさを{聞|き}いたから', 'カフェの{人|ひと}に{怒|おこ}られたから'], correct: 2, why: 'Thi → **よくできたと{思|おも}う** (phủ định); cãi nhau → **それも{違|ちが}う**. Lý do sau **{実|じつ}は**: **あの{店|みせ}、{来月|らいげつ}{閉|し}まるらしいの**. 〔Ano mise, raigetsu shimaru rashii no.〕' },
        { q: '{女|おんな}の{人|ひと}は{今日|きょう}どうしますか。', options: ['カフェへ{行|い}って{店|みせ}の{人|ひと}に{聞|き}いてみる', '{常連|じょうれん}のお{客|きゃく}さんに{話|はな}を{聞|き}く', '{別|べつ}のカフェを{探|さが}す', '{家|いえ}で{勉強|べんきょう}する'], correct: 0, why: '**{今日|きょう}{行|い}って{聞|き}いてみる** (～てみる — ôn Bài 19). 〔Kyou itte kiite miru.〕' },
      ],
    },

    /* ── 4 ── */
    { t: 'h', text: 'Bài 4 — 問題2 ポイント理解: bản tin dự báo thời tiết' },
    NG('b20-ng-4', '{明日|あした}の{午後|ごご}の{天気|てんき}はどうなりますか', 'Dạng ポイント理解 — một người nói (bản tin). Ghi nhanh ba mốc: 午前 / 午後 / 夜 và điều dự báo cho từng mốc; câu hỏi chỉ hỏi một mốc.', [
      ['ナレーター', 'ja-nu', 'ラジオで{天気予報|てんきよほう}を{聞|き}いています。{明日|あした}の{午後|ごご}の{天気|てんき}はどうなりますか。', 'Rajio de tenki yohou o kiite imasu. Ashita no gogo no tenki wa dou narimasu ka.', 'Đang nghe dự báo thời tiết trên đài. Chiều mai thời tiết sẽ thế nào?'],
      ['アナウンサー', 'ja-nu', '{明日|あした}の{天気|てんき}です。{明日|あした}の{朝|あさ}は{晴|は}れて、{気持|きも}ちのいい{天気|てんき}になるでしょう。', 'Ashita no tenki desu. Ashita no asa wa harete, kimochi no ii tenki ni naru deshou.', 'Thời tiết ngày mai. Sáng mai trời nắng, thời tiết dễ chịu.'],
      ['アナウンサー', 'ja-nu', 'しかし、{昼|ひる}ごろから{西|にし}の{方|ほう}から{雲|くも}が{広|ひろ}がって、{午後|ごご}はところどころで{雨|あめ}が{降|ふ}るでしょう。{風|かぜ}も{強|つよ}く{吹|ふ}きそうです。', 'Shikashi, hiru goro kara nishi no hou kara kumo ga hirogatte, gogo wa tokorodokoro de ame ga furu deshou. Kaze mo tsuyoku fukisou desu.', 'Tuy nhiên, từ khoảng trưa mây từ phía tây lan rộng, buổi chiều có mưa rải rác. Gió cũng có vẻ sẽ thổi mạnh.'],
      ['アナウンサー', 'ja-nu', '{夜|よる}は{雨|あめ}がやんで、{雷|かみなり}もなさそうです。ただ、{気温|きおん}が{下|さ}がりますので、{山|やま}の{方|ほう}では{雪|ゆき}になるかもしれません。', 'Yoru wa ame ga yande, kaminari mo nasasou desu. Tada, kion ga sagarimasu node, yama no hou de wa yuki ni naru kamoshiremasen.', 'Buổi tối mưa tạnh, có vẻ cũng không có sấm. Có điều nhiệt độ giảm nên vùng núi có thể có tuyết.'],
      ['アナウンサー', 'ja-nu', 'お{出|で}かけの{方|かた}は、{傘|かさ}を{持|も}っていったほうがいいでしょう。', 'Odekake no kata wa, kasa o motte itta hou ga ii deshou.', 'Quý vị ra ngoài nên mang theo ô.'],
      ['ナレーター', 'ja-nu', '{明日|あした}の{午後|ごご}の{天気|てんき}はどうなりますか。', 'Ashita no gogo no tenki wa dou narimasu ka.', 'Chiều mai thời tiết sẽ thế nào?'],
    ]),
    {
      t: 'mcq',
      id: 'b20-ng-4-q',
      title: 'Bài 4 — chọn đáp án',
      items: [
        { q: '{明日|あした}の{午後|ごご}の{天気|てんき}はどうなりますか。', options: ['{晴|は}れて、{風|かぜ}もない', 'ところどころで{雨|あめ}が{降|ふ}って、{風|かぜ}が{強|つよ}い', '{雷|かみなり}が{鳴|な}って、{雪|ゆき}が{降|ふ}る', '{雨|あめ}がやんで、{寒|さむ}くなる'], correct: 1, why: 'Mốc **{午後|ごご}**: **ところどころで{雨|あめ}が{降|ふ}るでしょう。{風|かぜ}も{強|つよ}く{吹|ふ}きそうです**. Nắng là buổi sáng; mưa tạnh + lạnh là buổi tối; tuyết chỉ "có thể" ở vùng núi. 〔Gogo wa tokorodokoro de ame ga furu deshou.〕' },
        { q: '{山|やま}の{方|ほう}では、{夜|よる}どうなるかもしれないと{言|い}っていますか。', options: ['{雪|ゆき}になる', '{雷|かみなり}が{鳴|な}る', '{晴|は}れる', '{暖|あたた}かくなる'], correct: 0, why: '**{山|やま}の{方|ほう}では{雪|ゆき}になるかもしれません** — vì nhiệt độ giảm. 〔Yama no hou de wa yuki ni naru kamoshiremasen.〕' },
      ],
    },

    /* ── 5 ── */
    { t: 'h', text: 'Bài 5 — 問題3 発話表現: nói gì trong tình huống (4 câu)' },
    {
      t: 'note',
      title: 'Cách làm 発話表現',
      items: [
        'Trong đề thật có tranh; ở đây tình huống được mô tả bằng lời. Nghe mô tả → nghe 3 câu → chọn câu NÊN NÓI.',
        'Chú ý **ai nói với ai** (bạn bè → thể thường, người trên → です／ます) và **nguồn tin** (tận mắt thấy → ～そう; chưa chắc → ～かもしれません).',
      ],
    },
    NG('b20-ng-5', '{何|なん}と{言|い}いますか（4{問|もん}）', 'Dạng 発話表現 — chọn đúng mẫu suy đoán theo điều người nói thấy.', [
      ['ナレーター', 'ja-nu', '{1番|いちばん}。{友達|ともだち}の{顔色|かおいろ}がとても{悪|わる}いです。{何|なん}と{言|い}いますか。', 'Ichiban. Tomodachi no kaoiro ga totemo warui desu. Nan to iimasu ka.', 'Câu 1. Sắc mặt bạn bạn rất kém. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、{具合|ぐあい}が{悪|わる}いそうだね。 2、{具合|ぐあい}が{悪|わる}そうだね。{大丈夫|だいじょうぶ}？ 3、{具合|ぐあい}が{悪|わる}いはずだね。', 'Ichi, guai ga warui sou da ne. Ni, guai ga warusou da ne. Daijoubu? San, guai ga warui hazu da ne.', '1. Nghe nói cậu không khoẻ nhỉ. 2. Trông cậu có vẻ không khoẻ. Có sao không? 3. Chắc chắn cậu không khoẻ nhỉ.'],
      ['ナレーター', 'ja-nu', '{2番|にばん}。{棚|たな}の{上|うえ}の{箱|はこ}が{落|お}ちそうです。{近|ちか}くにいる{人|ひと}に{何|なん}と{言|い}いますか。', 'Niban. Tana no ue no hako ga ochisou desu. Chikaku ni iru hito ni nan to iimasu ka.', 'Câu 2. Cái hộp trên kệ sắp rơi. Bạn nói gì với người đứng gần đó?'],
      ['ナレーター', 'ja-nu', '1、あ、{箱|はこ}が{落|お}ちそうですよ。 2、あ、{箱|はこ}が{落|お}ちるそうですよ。 3、あ、{箱|はこ}が{落|お}ちたらしいですよ。', 'Ichi, a, hako ga ochisou desu yo. Ni, a, hako ga ochiru sou desu yo. San, a, hako ga ochita rashii desu yo.', '1. Ơ, cái hộp sắp rơi kìa. 2. Ơ, nghe nói cái hộp sẽ rơi đấy. 3. Ơ, nghe đâu cái hộp rơi rồi.'],
      ['ナレーター', 'ja-nu', '{3番|さんばん}。{電車|でんしゃ}が{止|と}まっています。アルバイトの{店長|てんちょう}に{電話|でんわ}します。{何|なん}と{言|い}いますか。', 'Sanban. Densha ga tomatte imasu. Arubaito no tenchou ni denwa shimasu. Nan to iimasu ka.', 'Câu 3. Tàu đang dừng. Bạn gọi điện cho quản lý chỗ làm thêm. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、{電車|でんしゃ}が{止|と}まっていて、{少|すこ}し{遅|おく}れるかもしれません。 2、{電車|でんしゃ}が{止|と}まっていて、{少|すこ}し{遅|おく}れそうだそうです。 3、{電車|でんしゃ}が{止|と}まっていて、{店長|てんちょう}は{遅|おく}れるはずです。', 'Ichi, densha ga tomatte ite, sukoshi okureru kamoshiremasen. Ni, densha ga tomatte ite, sukoshi okuresou da sou desu. San, densha ga tomatte ite, tenchou wa okureru hazu desu.', '1. Tàu đang dừng, có khi em đến muộn một chút. 2. Tàu đang dừng, nghe nói có vẻ sắp muộn. 3. Tàu đang dừng, chắc chắn anh quản lý đến muộn.'],
      ['ナレーター', 'ja-nu', '{4番|よんばん}。{友達|ともだち}がケーキを{作|つく}りました。とてもおいしそうです。{何|なん}と{言|い}いますか。', 'Yonban. Tomodachi ga keeki o tsukurimashita. Totemo oishisou desu. Nan to iimasu ka.', 'Câu 4. Bạn bạn làm bánh. Trông rất ngon. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、わあ、おいしいらしいね。 2、わあ、おいしいかもしれないね。 3、わあ、おいしそう！{一|ひと}つ{食|た}べてもいい？', 'Ichi, waa, oishii rashii ne. Ni, waa, oishii kamoshirenai ne. San, waa, oishisou! Hitotsu tabete mo ii?', '1. Oa, nghe đâu ngon nhỉ. 2. Oa, có khi ngon nhỉ. 3. Oa, trông ngon quá! Mình ăn một cái được không?'],
    ]),
    {
      t: 'mcq',
      id: 'b20-ng-5-q',
      title: 'Bài 5 — chọn câu đúng',
      items: [
        { q: '{1番|いちばん} — {友達|ともだち}の{顔色|かおいろ}が{悪|わる}い', options: ['1', '2', '3'], correct: 1, why: 'Tận mắt thấy sắc mặt → **{具合|ぐあい}が{悪|わる}そうだね。{大丈夫|だいじょうぶ}？** {悪|わる}いそう = nghe nói (sai nguồn). 〔Guai ga warusou da ne.〕' },
        { q: '{2番|にばん} — {箱|はこ}が{落|お}ちそう', options: ['1', '2', '3'], correct: 0, why: 'Thấy dấu hiệu sắp rơi → **{落|お}ちそうですよ** (Vます + そう). 〔Hako ga ochisou desu yo.〕' },
        { q: '{3番|さんばん} — {電車|でんしゃ}が{止|と}まっている', options: ['1', '2', '3'], correct: 0, why: 'Báo khả năng mình đến muộn → **{少|すこ}し{遅|おく}れるかもしれません**. Câu 3 nói người QUẢN LÝ muộn — sai. 〔Sukoshi okureru kamoshiremasen.〕' },
        { q: '{4番|よんばん} — おいしそうなケーキ', options: ['1', '2', '3'], correct: 2, why: 'Nhìn bánh bạn làm → **おいしそう！** + xin ăn thử. らしい (nghe đâu) không hợp vì đang nhìn tận mắt. 〔Waa, oishisou!〕' },
      ],
    },

    /* ── 6 ── */
    { t: 'h', text: 'Bài 6 — 問題4 即時応答: đáp ngay (5 câu)' },
    NG('b20-ng-6', '{正|ただ}しい{返事|へんじ}を{選|えら}んでください（5{問|もん}）', 'Dạng 即時応答 — không có câu hỏi in sẵn: nghe 1 câu, chọn 1 trong 3 câu đáp. Cẩn thận câu lặp từ nhưng sai nghĩa.', [
      ['ナレーター', 'ja-nu', '{1番|いちばん}。', 'Ichiban.', 'Câu 1.'],
      ['マルコ', 'ja-nam', 'ねえ、{西川|にしかわ}さん、{会社|かいしゃ}を{辞|や}めるらしいよ。', 'Nee, Nishikawa-san, kaisha o yameru rashii yo.', 'Này, nghe đâu anh Nishikawa nghỉ việc đấy.'],
      ['リン', 'ja-nu', '1、えっ、{本当|ほんとう}？{誰|だれ}に{聞|き}いたの？ 2、うん、{辞|や}めそうだね。 3、じゃ、{辞|や}めてみよう。', 'Ichi, e, hontou? Dare ni kiita no? Ni, un, yamesou da ne. San, ja, yamete miyou.', '1. Hả, thật á? Cậu nghe ai nói? 2. Ừ, trông có vẻ sắp nghỉ nhỉ. 3. Vậy thử nghỉ việc xem.'],
      ['ナレーター', 'ja-nu', '{2番|にばん}。', 'Niban.', 'Câu 2.'],
      ['{小林店長|こばやしてんちょう}', 'ja-nam', 'ナタポンくん、もう{着|つ}いているはずなのに、{野菜|やさい}がまだ{来|こ}ないね。', 'Natapon-kun, mou tsuite iru hazu na noni, yasai ga mada konai ne.', 'Nattapon, lẽ ra phải tới rồi vậy mà rau vẫn chưa đến nhỉ.'],
      ['ナタポン', 'ja-nam', '1、はい、もう{着|つ}きました。 2、{道|みち}が{混|こ}んでいるのかもしれませんね。 3、{野菜|やさい}はおいしそうですね。', 'Ichi, hai, mou tsukimashita. Ni, michi ga konde iru no kamoshiremasen ne. San, yasai wa oishisou desu ne.', '1. Vâng, tới rồi ạ. 2. Có khi đường đang tắc anh nhỉ. 3. Rau trông ngon nhỉ.'],
      ['ナレーター', 'ja-nu', '{3番|さんばん}。', 'Sanban.', 'Câu 3.'],
      ['パク', 'ja-nu', 'あ、{空|そら}が{暗|くら}い。{雨|あめ}が{降|ふ}りそう。', 'A, sora ga kurai. Ame ga furisou.', 'Ơ, trời tối quá. Có vẻ sắp mưa.'],
      ['ダニエル', 'ja-nam', '1、{本当|ほんとう}だ。{傘|かさ}を{持|も}っていこう。 2、うん、{昨日|きのう}{降|ふ}ったそうだね。 3、{雨|あめ}が{降|ふ}ってよかったね。', 'Ichi, hontou da. Kasa o motte ikou. Ni, un, kinou futta sou da ne. San, ame ga futte yokatta ne.', '1. Đúng thật. Mang ô đi thôi. 2. Ừ, nghe nói hôm qua mưa nhỉ. 3. Mưa rồi may quá nhỉ.'],
      ['ナレーター', 'ja-nu', '{4番|よんばん}。', 'Yonban.', 'Câu 4.'],
      ['{本田先生|ほんだせんせい}', 'ja-nam', 'アンナさん、{眠|ねむ}そうですね。{昨日|きのう}、{遅|おそ}くまで{起|お}きていたんですか。', 'Anna-san, nemusou desu ne. Kinou, osoku made okite ita n desu ka.', 'Anna, trông em buồn ngủ nhỉ. Hôm qua thức khuya à?'],
      ['アンナ', 'ja-nu', '1、はい、{先生|せんせい}も{眠|ねむ}いそうです。 2、すみません、レポートを{書|か}いていて、{三時|さんじ}に{寝|ね}たんです。 3、はい、よく{寝|ね}たはずです。', 'Ichi, hai, sensei mo nemui sou desu. Ni, sumimasen, repooto o kaite ite, sanji ni neta n desu. San, hai, yoku neta hazu desu.', '1. Vâng, nghe nói thầy cũng buồn ngủ. 2. Em xin lỗi, em viết báo cáo, 3 giờ mới ngủ ạ. 3. Vâng, chắc chắn em ngủ ngon.'],
      ['ナレーター', 'ja-nu', '{5番|ごばん}。', 'Goban.', 'Câu 5.'],
      ['ワン', 'ja-nu', 'このお{店|みせ}、{人|ひと}がたくさん{並|なら}んでいるね。', 'Kono omise, hito ga takusan narande iru ne.', 'Quán này người xếp hàng đông nhỉ.'],
      ['カルロス', 'ja-nam', '1、うん、{人|ひと}がいないみたいだね。 2、うん、おいしい{店|みせ}みたいだね。{入|はい}ってみようか。 3、うん、{並|なら}んでおこう。', 'Ichi, un, hito ga inai mitai da ne. Ni, un, oishii mise mitai da ne. Haitte miyou ka. San, un, narande okou.', '1. Ừ, hình như không có ai nhỉ. 2. Ừ, hình như là quán ngon nhỉ. Vào thử không? 3. Ừ, xếp hàng sẵn thôi.'],
    ]),
    {
      t: 'mcq',
      id: 'b20-ng-6-q',
      title: 'Bài 6 — chọn câu đáp đúng',
      items: [
        { q: '{1番|いちばん} — 「{西川|にしかわ}さん、{会社|かいしゃ}を{辞|や}めるらしいよ。」', options: ['1', '2', '3'], correct: 0, why: 'Nghe tin đồn → phản ứng ngạc nhiên + hỏi nguồn: **えっ、{本当|ほんとう}？{誰|だれ}に{聞|き}いたの？** 〔E, hontou? Dare ni kiita no?〕' },
        { q: '{2番|にばん} — 「もう{着|つ}いているはずなのに、まだ{来|こ}ないね。」', options: ['1', '2', '3'], correct: 1, why: 'Lẽ ra đã tới mà chưa → đoán lý do: **{道|みち}が{混|こ}んでいるのかもしれませんね**. Câu 1 mâu thuẫn (chưa đến mà nói đến rồi). 〔Michi ga konde iru no kamoshiremasen ne.〕' },
        { q: '{3番|さんばん} — 「{雨|あめ}が{降|ふ}りそう。」', options: ['1', '2', '3'], correct: 0, why: 'Sắp mưa → **{傘|かさ}を{持|も}っていこう**. Câu 2 lẫn sang そう "nghe nói" + quá khứ. 〔Kasa o motte ikou.〕' },
        { q: '{4番|よんばん} — 「{眠|ねむ}そうですね。」', options: ['1', '2', '3'], correct: 1, why: 'Thầy nhận xét em trông buồn ngủ → giải thích lý do: **レポートを{書|か}いていて、{三時|さんじ}に{寝|ね}たんです**. 〔Repooto o kaite ite, sanji ni neta n desu.〕' },
        { q: '{5番|ごばん} — 「{人|ひと}がたくさん{並|なら}んでいるね。」', options: ['1', '2', '3'], correct: 1, why: 'Thấy người xếp hàng (dấu hiệu) → kết luận **おいしい{店|みせ}みたいだね** + rủ vào thử. Câu 1 mâu thuẫn (đông mà "không có ai"). 〔Oishii mise mitai da ne.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 6. ĐỌC HIỂU ═══════════════════════════ */

const DOC: Lesson = {
  id: 'b20-doc',
  kind: 'reading',
  title: 'Đọc hiểu N4 — thông báo "về tin đồn" của ký túc xá, bài viết "Tin đồn và mạng xã hội", lịch sự kiện cuối tuần + dự báo thời tiết (情報検索)',
  goal: 'Đọc thông báo ~200 chữ để biết điều người viết muốn nói nhất (tin đồn sai, sự thật là gì, phải làm gì); đọc bài viết ~450 chữ về một lần tin nhầm tin trên mạng để nắm chi tiết, lý do và ý chính; tra lịch sự kiện kết hợp với bảng dự báo thời tiết để chọn đúng sự kiện theo điều kiện "nếu mưa thì huỷ" — đọc ra sự khác nhau giữa ～らしい／～そうです／～はず／～かもしれない trong văn viết.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Phần đọc (読解) đề JLPT N4',
      head: ['Mondai', 'Dạng', 'Độ dài', 'Bài này luyện'],
      rows: [
        ['問題4', '内容理解（短文）', '~100–200 chữ: email, tin nhắn, thông báo', 'Bài 1 — thông báo của ký túc xá về một tin đồn'],
        ['問題5', '内容理解（中文）', '~350–450 chữ: bài viết, nhật ký', 'Bài 2 — 「うわさとSNS」 của リン'],
        ['問題6', '情報検索', '~400 chữ: bảng, tờ quảng cáo, lịch', 'Bài 3 — lịch sự kiện cuối tuần + dự báo thời tiết'],
      ],
    },
    {
      t: 'note',
      title: 'Chiến thuật đọc',
      items: [
        '**Đọc câu hỏi trước**, gạch chân từ khoá (いちばん{伝|つた}えたいこと・どうして・どれ・いつ), rồi mới đọc bài để tìm.',
        'Văn viết dùng **～ようです** (không dùng みたい), **～らしいです**, **～そうです**, **～はずです**. Khi đọc, hãy hỏi: câu này là **sự thật** người viết khẳng định, hay chỉ là **tin đồn / suy đoán**? Đề rất hay cho một lựa chọn "khẳng định" điều bài chỉ nói là ～らしい.',
        'Thông báo: điều người viết **muốn người đọc làm** nằm ở **～てください／～ないでください** gần cuối; điều **sự thật** nằm sau **{実|じつ}は／{事実|じじつ}は**.',
        '情報検索: lập **bảng điều kiện** (ngày rảnh, muốn làm gì, thời tiết hôm đó, mang gì), rồi **loại** từng lựa chọn. Luôn đọc dòng **※** (điều kiện "雨の{場合|ばあい}は{中止|ちゅうし}" — nếu mưa thì huỷ).',
      ],
    },

    /* ── Bài 1 ── */
    { t: 'h', text: 'Bài 1 — 内容理解（短文）: thông báo của ký túc xá' },
    {
      t: 'passage',
      title: 'さくら{寮|りょう}のみなさんへ（{管理人|かんりにん}からのお{知|し}らせ）',
      intro: 'Thông báo dán ở cửa thang máy ký túc xá nơi リン, マルコ, アンナ ở. Đọc rồi trả lời câu hỏi.',
      paras: [
        { text: 'さくら{寮|りょう}のみなさんへ' },
        { text: '{最近|さいきん}、「{来月|らいげつ}から{寮|りょう}の{家賃|やちん}が{高|たか}くなるらしい」といううわさが{広|ひろ}がっているようです。{心配|しんぱい}して、{事務室|じむしつ}に{電話|でんわ}をくれた{人|ひと}もいました。' },
        { text: 'でも、それは{事実|じじつ}ではありません。{来年|らいねん}の{三月|さんがつ}までは、{家賃|やちん}は{今|いま}と{同|おな}じです。{実|じつ}は、{来月|らいげつ}から{変|か}わるのは{洗濯機|せんたくき}の{料金|りょうきん}です。{一回|いっかい}{二百円|にひゃくえん}が{百五十円|ひゃくごじゅうえん}になります。' },
        { text: 'うわさを{聞|き}いたら、すぐに{信|しん}じないで、{事務室|じむしつ}に{確認|かくにん}してください。{大切|たいせつ}なお{知|し}らせは、いつもこの{掲示板|けいじばん}とメールで{伝|つた}えます。' },
        { text: '{管理人|かんりにん}　{山田|やまだ}' },
      ],
    },
    {
      t: 'mcq',
      id: 'b20-doc-1',
      title: 'Bài 1 — câu hỏi',
      items: [
        { q: 'このお{知|し}らせでいちばん{伝|つた}えたいことは{何|なん}ですか。', options: ['{来月|らいげつ}から{家賃|やちん}が{高|たか}くなること', '{家賃|やちん}のうわさは{本当|ほんとう}ではなく、うわさは{事務室|じむしつ}に{確認|かくにん}してほしいこと', '{洗濯機|せんたくき}が{新|あたら}しくなること', '{事務室|じむしつ}に{電話|でんわ}をしないでほしいこと'], correct: 1, why: 'Ý chính: **それは{事実|じじつ}ではありません** + **すぐに{信|しん}じないで、{事務室|じむしつ}に{確認|かくにん}してください**. Lựa chọn 1 là chính tin đồn (bẫy). 〔Sore wa jijitsu de wa arimasen.〕' },
        { q: '{来月|らいげつ}から{何|なに}が{変|か}わりますか。', options: ['{家賃|やちん}が{高|たか}くなる', '{家賃|やちん}が{安|やす}くなる', '{洗濯機|せんたくき}の{料金|りょうきん}が{安|やす}くなる', '{掲示板|けいじばん}がなくなる'], correct: 2, why: '**{来月|らいげつ}から{変|か}わるのは{洗濯機|せんたくき}の{料金|りょうきん}です。{二百円|にひゃくえん}が{百五十円|ひゃくごじゅうえん}になります** → rẻ đi. 〔Sentakuki no ryoukin ga yasuku naru.〕' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('うわさが{広|ひろ}がっているようです。', 'Uwasa ga hirogatte iru you desu.', 'Có vẻ tin đồn đang lan ra. (người viết quan sát: có người gọi điện)'),
        E('それは{事実|じじつ}ではありません。', 'Sore wa jijitsu de wa arimasen.', 'Đó không phải là sự thật.'),
        E('すぐに{信|しん}じないで、{確認|かくにん}してください。', 'Sugu ni shinjinaide, kakunin shite kudasai.', 'Đừng tin ngay, hãy xác nhận lại.'),
      ],
    },

    /* ── Bài 2 ── */
    { t: 'h', text: 'Bài 2 — 内容理解（中文）: bài viết 「うわさとSNS」' },
    {
      t: 'passage',
      title: 'うわさとSNS　　リン',
      intro: 'Bài viết của リン cho tờ báo nhỏ của lớp tiếng Nhật. Đọc rồi trả lời câu hỏi.',
      paras: [
        { label: '①', text: '{先月|せんげつ}、SNSで「{駅前|えきまえ}の{人気|にんき}のラーメン{屋|や}『はなまる』が{閉店|へいてん}したらしい」という{書|か}き{込|こ}みを{見|み}ました。「{店|みせ}の{前|まえ}に{紙|かみ}が{貼|は}ってあった」とも{書|か}いてありました。{私|わたし}は「はなまる」が{大好|だいす}きだったので、とても{驚|おどろ}いて、すぐにクラスの{友達|ともだち}に{伝|つた}えました。{友達|ともだち}も{驚|おどろ}いて、また{別|べつ}の{友達|ともだち}に{伝|つた}えたようです。{次|つぎ}の{日|ひ}には、クラスの{半分|はんぶん}ぐらいの{人|ひと}がそのうわさを{知|し}っていました。' },
        { label: '②', text: '{週末|しゅうまつ}、{私|わたし}は{最後|さいご}に{店|みせ}の{前|まえ}だけでも{見|み}たいと{思|おも}って、{駅前|えきまえ}へ{行|い}きました。すると、{店|みせ}の{前|まえ}にはいつものように{長|なが}い{列|れつ}ができていました。{貼|は}ってあった{紙|かみ}には「{店内|てんない}{工事|こうじ}のため、{三日間|みっかかん}お{休|やす}みします」と{書|か}いてありました。その{三日間|みっかかん}はもう{終|お}わっていて、{店|みせ}は{普通|ふつう}に{開|あ}いていたのです。' },
        { label: '③', text: '{書|か}き{込|こ}みをした{人|ひと}は、たぶん{紙|かみ}をよく{読|よ}まなかったのでしょう。でも、{私|わたし}も{同|おな}じです。{自分|じぶん}で{確認|かくにん}しないで、「らしい」の{話|はなし}をまるで{事実|じじつ}のように{友達|ともだち}に{話|はな}してしまいました。{悪|わる}いことをしたと{思|おも}って、クラスのみんなに{謝|あやま}りました。' },
        { label: '④', text: 'SNSは{便利|べんり}で、{情報|じょうほう}がすぐに{集|あつ}まります。でも、{速|はや}く{広|ひろ}がるのは、{正|ただ}しい{情報|じょうほう}だけではありません。これからは、{驚|おどろ}くような{話|はなし}を{見|み}たときほど、{誰|だれ}かに{伝|つた}える{前|まえ}に、{一度|いちど}{自分|じぶん}で{確|たし}かめてみようと{思|おも}っています。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b20-doc-2',
      title: 'Bài 2 — câu hỏi',
      items: [
        { q: 'リンさんはSNSの{書|か}き{込|こ}みを{見|み}て、まず{何|なに}をしましたか。', options: ['{店|みせ}へ{確認|かくにん}しに{行|い}った', 'クラスの{友達|ともだち}に{伝|つた}えた', '{店|みせ}に{電話|でんわ}した', '{書|か}き{込|こ}みをした{人|ひと}に{質問|しつもん}した'], correct: 1, why: 'Đoạn ①: **とても{驚|おどろ}いて、すぐにクラスの{友達|ともだち}に{伝|つた}えました**. Đi ra quán là chuyện cuối tuần sau đó. 〔Sugu ni kurasu no tomodachi ni tsutaemashita.〕' },
        { q: '{週末|しゅうまつ}、「はなまる」はどうでしたか。', options: ['{閉店|へいてん}していた', '{工事|こうじ}をしていた', 'いつものように{開|あ}いていて、{人|ひと}が{並|なら}んでいた', '{三日間|みっかかん}の{休|やす}みの{最初|さいしょ}の{日|ひ}だった'], correct: 2, why: 'Đoạn ②: **いつものように{長|なが}い{列|れつ}ができていました** · **{店|みせ}は{普通|ふつう}に{開|あ}いていたのです**. Tờ giấy chỉ báo nghỉ 3 ngày để sửa — đã hết. 〔Mise wa futsuu ni aite ita.〕' },
        { q: 'リンさんがいちばん{言|い}いたいことは{何|なん}ですか。', options: ['SNSは{便利|べんり}だから、たくさん{使|つか}ったほうがいい。', '「はなまる」のラーメンはとてもおいしい。', '{驚|おどろ}くような{話|はなし}ほど、{伝|つた}える{前|まえ}に{自分|じぶん}で{確|たし}かめたい。', '{書|か}き{込|こ}みをした{人|ひと}がいちばん{悪|わる}い。'], correct: 2, why: 'Ý chính ở đoạn cuối (④): **{驚|おどろ}くような{話|はなし}を{見|み}たときほど、{誰|だれ}かに{伝|つた}える{前|まえ}に、{一度|いちど}{自分|じぶん}で{確|たし}かめてみよう**. Đoạn ③ còn nói **{私|わたし}も{同|おな}じです** → không đổ lỗi cho người viết. 〔Jibun de tashikamete miyou.〕' },
      ],
    },
    {
      t: 'note',
      title: 'Ngữ pháp trong bài đọc 2 — vì sao người viết chọn mẫu đó',
      items: [
        '**{閉店|へいてん}したらしい** — câu trích từ mạng: tin "nghe đâu", chưa kiểm chứng. **{伝|つた}えたようです** — リン không tận mắt thấy bạn mình kể tiếp, chỉ đoán từ việc hôm sau cả lớp biết.',
        '**{読|よ}まなかったのでしょう** — ～のでしょう: đoán lý do (văn viết), gần với ～のかもしれない nhưng chắc hơn. **まるで{事実|じじつ}のように** — so sánh (mẫu ②b): "như thể là sự thật".',
        '**{驚|おどろ}くような{話|はなし}** — ～ような N: "kiểu chuyện gây sốc". **～ときほど** = "càng là lúc ~ thì càng" (N3 — đọc hiểu là đủ). **{確|たし}かめてみよう** — ～てみる (Bài 19) + ý chí (Bài 16).',
        '**{閉店|へいてん}** = đóng cửa hẳn (ngừng kinh doanh) / đóng cửa cuối ngày · **{書|か}き{込|こ}み** = bài đăng, bình luận trên mạng (N3) · **{列|れつ}ができる** = có hàng người xếp · **{店内|てんない}{工事|こうじ}のため** = vì sửa chữa trong quán (～のため — Bài 21, 27).',
      ],
    },

    /* ── Bài 3 ── */
    { t: 'h', text: 'Bài 3 — 情報検索: lịch sự kiện cuối tuần + dự báo thời tiết' },
    {
      t: 'passage',
      title: 'みどり{市|し}　{週末|しゅうまつ}のイベント',
      intro: 'パク và ダニエル muốn đi một sự kiện vào cuối tuần. Đọc bảng dự báo thời tiết và lịch sự kiện, rồi trả lời câu hỏi.',
      paras: [
        { label: '{天気予報|てんきよほう}', text: '{土曜日|どようび}：{晴|は}れ　{雨|あめ}が{降|ふ}る{確率|かくりつ} 10%　（{夜|よる}は{雲|くも}が{多|おお}くなるでしょう）　／　{日曜日|にちようび}：{雨|あめ}　{雨|あめ}が{降|ふ}る{確率|かくりつ} 80%　（{一日中|いちにちじゅう}{雨|あめ}で、{雷|かみなり}が{鳴|な}るかもしれません）' },
        { label: 'A', text: '{星|ほし}を{見|み}る{会|かい}　{土曜日|どようび} 19:00〜21:00　みどり{公園|こうえん}　{無料|むりょう}　※{雲|くも}が{多|おお}くて{星|ほし}が{見|み}えないときは{中止|ちゅうし}になります。' },
        { label: 'B', text: 'フリーマーケット　{土曜日|どようび} 10:00〜15:00　{駅前|えきまえ}{広場|ひろば}　{入場|にゅうじょう}{無料|むりょう}　※{雨|あめ}の{場合|ばあい}は{中止|ちゅうし}。' },
        { label: 'C', text: '{川|かわ}の{生|い}き{物|もの}を{見|み}よう　{日曜日|にちようび} 9:00〜12:00　みどり{川|がわ}　{五百円|ごひゃくえん}　※{雨|あめ}の{場合|ばあい}は{来週|らいしゅう}の{日曜日|にちようび}に{変|か}わります。' },
        { label: 'D', text: 'パン{作|づく}り{教室|きょうしつ}　{日曜日|にちようび} 13:00〜15:00　{市民|しみん}センター 2{階|かい}　{千円|せんえん}（{材料|ざいりょう}{費|ひ}を{含|ふく}む）　※{雨|あめ}でも{行|おこな}います。エプロンを{持|も}ってきてください。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b20-doc-3',
      title: 'Bài 3 — câu hỏi',
      items: [
        { q: 'パクさんは{日曜日|にちようび}しか{時間|じかん}がありません。{天気予報|てんきよほう}を{見|み}て、{行|い}けるイベントはどれですか。', options: ['A', 'B', 'C', 'D'], correct: 3, why: 'Chủ nhật có C và D. Chủ nhật **mưa 80%** → C **{雨|あめ}の{場合|ばあい}は{来週|らいしゅう}に{変|か}わります** (gần như chắc bị dời); D **{雨|あめ}でも{行|おこな}います** → **D**. 〔Ame demo okonaimasu.〕' },
        { q: 'ダニエルさんは{土曜日|どようび}の{夜|よる}、{星|ほし}を{見|み}る{会|かい}に{行|い}きたいです。どうして{中止|ちゅうし}になるかもしれませんか。', options: ['{雨|あめ}が{降|ふ}るはずだから', '{夜|よる}は{雲|くも}が{多|おお}くなりそうだから', 'お{金|かね}がかかるから', '{雷|かみなり}が{鳴|な}るそうだから'], correct: 1, why: 'Thứ Bảy mưa chỉ 10%, nhưng **{夜|よる}は{雲|くも}が{多|おお}くなるでしょう**; A ghi **※{雲|くも}が{多|おお}くて{星|ほし}が{見|み}えないときは{中止|ちゅうし}**. Sấm là dự báo cho Chủ nhật. 〔Yoru wa kumo ga ooku naru deshou.〕' },
      ],
    },
    {
      t: 'note',
      title: 'Từ trong bài đọc 3',
      items: [
        '**{確率|かくりつ}** = xác suất (N3) · **{雨|あめ}の{場合|ばあい}は** = trường hợp mưa thì (N4) · **{中止|ちゅうし}** = huỷ (Bài 15) · **{行|おこな}う** = tiến hành, tổ chức (N3, văn viết của する) · **{含|ふく}む** = bao gồm (N3) · **{生|い}き{物|もの}** = sinh vật · **{市民|しみん}センター** = nhà văn hoá thành phố.',
        'Dự báo dùng **～でしょう** (khá chắc) và **～かもしれません** (có thể) — đúng thang độ chắc chắn đã học ở Ngữ pháp ④.',
      ],
    },
  ],
};

/* ═══════════════════════════ 7. NÓI ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b20-noi',
  kind: 'speaking',
  title: 'Luyện nói — nhìn tranh nói ～そう, kể tin đồn, nêu khả năng & điều chắc chắn, kể 1 phút về một tin đồn, đọc to',
  goal: 'Trả lời trôi chảy câu hỏi thi nói có tranh (người này trông thế nào, chuyện gì sắp xảy ra) bằng ～そう; trả lời câu hỏi về bản thân bằng ～かもしれません／～はずです／～らしいです đúng nguồn tin; kể 1 phút về một tin đồn mình từng nghe có đủ bốn mẫu của bài; đọc to đoạn ~100 chữ không vấp ở そう／よう／らしい.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Thi nói kiểu JPD (khung của bộ môn) — chủ đề Bài 20 rơi vào đâu',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 20 xuất hiện ở đâu'],
      rows: [
        ['Reading', '40', 'Chuẩn bị 30 giây, đọc to đoạn ~100 chữ.', 'Đoạn kể tin đồn / thời tiết: {降|ふ}りそうです, {晴|は}れるそうです, {閉|し}まるらしいです, {留守|るす}のようです, {来|く}るはずです…'],
        ['Talking — có tranh', '3 × 15', 'Nhìn tranh (người ngáp, mây đen, bánh ngon, hộp sắp rơi) trả lời.', 'この{人|ひと}はどうですか（→ {眠|ねむ}そうです）· これから{何|なに}が{起|お}こりそうですか（→ {雨|あめ}が{降|ふ}りそうです）· このケーキはどうですか'],
        ['Talking — không tranh', '1 × 10', 'Trả lời 1 câu về bản thân.', '{明日|あした}の{天気|てんき}はどうですか · {最近|さいきん}{何|なに}かうわさを{聞|き}きましたか · {十年後|じゅうねんご}、{何|なに}をしていると{思|おも}いますか'],
        ['Presenting', '5', 'Chào khi vào/ra, thái độ.', 'Nghe không rõ: もう{一度|いちど}お{願|ねが}いします — không đoán bừa bằng ～かもしれません!'],
      ],
    },
    {
      t: 'note',
      title: 'Luật trả lời cho câu hỏi Bài 20',
      items: [
        '**Tranh có người / đồ vật** → **～そうです** cho điều không thấy trực tiếp ({眠|ねむ}そう, おいしそう, {重|おも}そう) và cho việc sắp xảy ra ({降|ふ}りそう, {落|お}ちそう). Thêm một câu lý do: {目|め}が{赤|あか}いですから / {黒|くろ}い{雲|くも}が{出|で}ていますから.',
        '**"Ngày mai trời thế nào?"** → nói **nguồn tin**: {天気予報|てんきよほう}では、{明日|あした}は{晴|は}れるそうです. Không xem dự báo → **たぶん{晴|は}れると{思|おも}います／{雨|あめ}が{降|ふ}るかもしれません**.',
        '**"Mười năm nữa bạn làm gì?"** → điều chưa biết: **～かもしれません**; điều có kế hoạch: **～つもりです** (Bài 16). Đừng dùng はず cho bản thân: ~~{私|わたし}は{日本|にほん}で{働|はたら}いているはずです~~.',
        '**Kể tin đồn** → mở **{実|じつ}は／{最近|さいきん}、こんなうわさを{聞|き}きました** · tin: **～らしいです** · mình thấy gì: **～ようでした** · sự thật: **でも、{本当|ほんとう}は～** · cảm nghĩ: **うわさはすぐに{信|しん}じないほうがいいと{思|おも}います**.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Câu trả lời mẫu — giám thị ↔ thí sinh',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: 'この{絵|え}を{見|み}てください。この{人|ひと}はどうですか。', ro: 'Kono e o mite kudasai. Kono hito wa dou desu ka.', vi: 'Hãy nhìn bức tranh này. Người này thế nào?' },
        { who: 'Bạn', role: 'candidate', text: 'とても{眠|ねむ}そうです。{大|おお}きいあくびをしていますから、{昨日|きのう}{遅|おそ}くまで{起|お}きていたのかもしれません。', ro: 'Totemo nemusou desu. Ookii akubi o shite imasu kara, kinou osoku made okite ita no kamoshiremasen.', vi: 'Trông rất buồn ngủ. Vì đang ngáp to, có khi hôm qua thức khuya.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'では、この{絵|え}はどうですか。これから{何|なに}が{起|お}こりそうですか。', ro: 'Dewa, kono e wa dou desu ka. Korekara nani ga okorisou desu ka.', vi: 'Vậy còn bức tranh này? Sắp có chuyện gì xảy ra?' },
        { who: 'Bạn', role: 'candidate', text: '{空|そら}に{黒|くろ}い{雲|くも}がたくさんあります。{今|いま}にも{雨|あめ}が{降|ふ}りそうです。', ro: 'Sora ni kuroi kumo ga takusan arimasu. Ima ni mo ame ga furisou desu.', vi: 'Trên trời có nhiều mây đen. Trời sắp mưa đến nơi.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{明日|あした}の{天気|てんき}はどうですか。', ro: 'Ashita no tenki wa dou desu ka.', vi: 'Thời tiết ngày mai thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{今朝|けさ}の{天気予報|てんきよほう}では、{明日|あした}は{晴|は}れるそうです。でも、{夕方|ゆうがた}は{雨|あめ}が{降|ふ}るかもしれません。', ro: 'Kesa no tenki yohou de wa, ashita wa hareru sou desu. Demo, yuugata wa ame ga furu kamoshiremasen.', vi: 'Dự báo sáng nay nói mai trời nắng. Nhưng chiều tối có thể có mưa.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{最近|さいきん}、{何|なに}かうわさを{聞|き}きましたか。', ro: 'Saikin, nani ka uwasa o kikimashita ka.', vi: 'Gần đây em có nghe tin đồn gì không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい。{学校|がっこう}の{近|ちか}くに{大|おお}きい{本屋|ほんや}ができるらしいです。{友達|ともだち}の{話|はなし}では、{来月|らいげつ}オープンするそうです。{本当|ほんとう}なら、とてもうれしいです。', ro: 'Hai. Gakkou no chikaku ni ookii hon\'ya ga dekiru rashii desu. Tomodachi no hanashi de wa, raigetsu oopun suru sou desu. Hontou nara, totemo ureshii desu.', vi: 'Có ạ. Nghe đâu gần trường sắp có một hiệu sách lớn. Theo lời bạn em thì tháng sau khai trương. Nếu thật thì em rất vui.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{十年後|じゅうねんご}、あなたは{何|なに}をしていると{思|おも}いますか。', ro: 'Juunengo, anata wa nani o shite iru to omoimasu ka.', vi: 'Mười năm nữa em nghĩ mình đang làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{日本|にほん}のIT{会社|がいしゃ}で{働|はたら}いているかもしれません。だから、{今|いま}{日本語|にほんご}を{一生懸命|いっしょうけんめい}{勉強|べんきょう}しています。', ro: 'Nihon no IT-gaisha de hataraite iru kamoshiremasen. Dakara, ima nihongo o isshoukenmei benkyou shite imasu.', vi: 'Có khi em đang làm ở một công ty IT của Nhật. Vì vậy bây giờ em đang chăm chỉ học tiếng Nhật.' },
      ],
    },
    {
      t: 'phatam',
      id: 'b20-noi-phat-am',
      title: 'Đọc to & chấm phát âm — 14 câu hay dùng của Bài 20',
      note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Chú ý: ふり・そう (そう kéo dài: so-o) ↔ ふる・そう; よさ・そう (yo-sa-so-o); よう・です (yo-o); らしい (ra-shi-i, い cuối kéo dài); かもしれません (ka-mo-shi-re-ma-se-n — liền một hơi); はず・です (ha-zu); じょう・ほう (jo-o-ho-o).',
      items: [
        { text: 'わあ、おいしそうですね。', ipa: 'waa oishisou desu ne', vi: 'Oa, trông ngon quá.' },
        { text: '{今|いま}にも{雨|あめ}が{降|ふ}りそうです。', ipa: 'ima ni mo ame ga furisou desu', vi: 'Trời sắp mưa đến nơi.' },
        { text: '{天気予報|てんきよほう}では、{明日|あした}は{晴|は}れるそうです。', ipa: 'tenki yohou de wa ashita wa hareru sou desu', vi: 'Dự báo nói mai trời nắng.' },
        { text: 'あのカフェ、よさそうですね。', ipa: 'ano kafe yosasou desu ne', vi: 'Quán cà phê kia trông được đấy.' },
        { text: '{具合|ぐあい}が{悪|わる}そうですね。{大丈夫|だいじょうぶ}ですか。', ipa: 'guai ga warusou desu ne daijoubu desu ka', vi: 'Trông bạn không khoẻ. Có sao không?' },
        { text: '{誰|だれ}もいないようです。', ipa: 'dare mo inai you desu', vi: 'Hình như không có ai.' },
        { text: '{財布|さいふ}を{家|いえ}に{忘|わす}れてきたみたい。', ipa: 'saifu o ie ni wasurete kita mitai', vi: 'Hình như mình để quên ví ở nhà.' },
        { text: 'まるで{夢|ゆめ}のようです。', ipa: 'marude yume no you desu', vi: 'Cứ như là mơ vậy.' },
        { text: '{来月|らいげつ}、{結婚|けっこん}するらしいですよ。', ipa: 'raigetsu kekkon suru rashii desu yo', vi: 'Nghe đâu tháng sau cưới đấy.' },
        { text: '{少|すこ}し{遅|おく}れるかもしれません。', ipa: 'sukoshi okureru kamoshiremasen', vi: 'Có khi tôi đến muộn một chút.' },
        { text: 'もしかしたら、{雪|ゆき}が{降|ふ}るかもしれません。', ipa: 'moshika shitara yuki ga furu kamoshiremasen', vi: 'Biết đâu trời có tuyết.' },
        { text: '{十時|じゅうじ}には{着|つ}くはずです。', ipa: 'juuji ni wa tsuku hazu desu', vi: 'Chắc chắn 10 giờ là tới.' },
        { text: 'もう{届|とど}いているはずなのに……。', ipa: 'mou todoite iru hazu na noni', vi: 'Lẽ ra phải đến rồi vậy mà…' },
        { text: 'うわさをそのまま{信|しん}じてはいけません。', ipa: 'uwasa o sono mama shinjite wa ikemasen', vi: 'Không được tin ngay tin đồn.' },
      ],
    },
    {
      t: 'note',
      title: 'Kể 1 phút (できる！) — dàn ý + bài mẫu "Một tin đồn tôi từng nghe"',
      items: [
        '**Dàn ý 4 câu chốt**: ① nghe tin gì, từ đâu (～らしいです／～そうです) → ② mình đã thấy / đã đoán gì (～ようでした／～かもしれないと{思|おも}いました) → ③ sự thật là gì ({実|じつ}は～) → ④ mình nghĩ gì (～ほうがいいと{思|おも}います).',
        '{去年|きょねん}、{寮|りょう}で「{来月|らいげつ}から{家賃|やちん}が{高|たか}くなるらしい」といううわさを{聞|き}きました。みんな{心配|しんぱい}そうで、{私|わたし}も{引|ひ}っ{越|こ}さなければならないかもしれないと{思|おも}いました。でも、{管理人|かんりにん}さんに{聞|き}いてみると、{実|じつ}は{変|か}わるのは{洗濯機|せんたくき}の{料金|りょうきん}だけでした。それも{安|やす}くなるそうです。うわさは{便利|べんり}な{情報|じょうほう}のように{見|み}えますが、すぐに{信|しん}じないで、{確認|かくにん}したほうがいいと{思|おも}います。',
        'Romaji: Kyonen, ryou de "Raigetsu kara yachin ga takaku naru rashii" to iu uwasa o kikimashita. Minna shinpaisou de, watashi mo hikkosanakereba naranai kamoshirenai to omoimashita. Demo, kanrinin-san ni kiite miru to, jitsu wa kawaru no wa sentakuki no ryoukin dake deshita. Sore mo yasuku naru sou desu. Uwasa wa benri na jouhou no you ni miemasu ga, sugu ni shinjinaide, kakunin shita hou ga ii to omoimasu.',
        'Nghĩa: Năm ngoái ở ký túc xá tôi nghe tin đồn "nghe đâu từ tháng sau tiền phòng tăng". Ai trông cũng lo, tôi cũng nghĩ có khi phải chuyển nhà. Nhưng hỏi thử bác quản lý thì thật ra chỉ có giá máy giặt thay đổi. Mà nghe nói còn rẻ đi. Tin đồn trông như thông tin hữu ích, nhưng tôi nghĩ đừng tin ngay mà nên kiểm chứng.',
      ],
    },
    {
      t: 'note',
      title: 'Đọc to (Reading 40 điểm) — đoạn mẫu 30 giây',
      items: [
        '{今朝|けさ}の{天気予報|てんきよほう}では、{今日|きょう}は{一日中|いちにちじゅう}{晴|は}れると{言|い}っていました。でも、{昼|ひる}ごろから{黒|くろ}い{雲|くも}が{出|で}てきて、{今|いま}にも{雨|あめ}が{降|ふ}りそうです。{予報|よほう}が{外|はず}れたようです。{友達|ともだち}は{傘|かさ}を{持|も}っていないはずなので、{駅|えき}まで{迎|むか}えに{行|い}こうと{思|おも}います。',
        'Romaji: Kesa no tenki yohou de wa, kyou wa ichinichijuu hareru to itte imashita. Demo, hiru goro kara kuroi kumo ga dete kite, ima ni mo ame ga furisou desu. Yohou ga hazureta you desu. Tomodachi wa kasa o motte inai hazu na node, eki made mukae ni ikou to omoimasu.',
        'Nghĩa: Dự báo thời tiết sáng nay nói hôm nay nắng cả ngày. Nhưng từ khoảng trưa mây đen kéo đến, trời như sắp mưa đến nơi. Có vẻ dự báo đã sai. Bạn tôi chắc chắn không mang ô, nên tôi định ra ga đón.',
        'Chỗ dễ vấp: **{晴|は}れると{言|い}っていました** (ha-re-ru-to-i-t-te-i-ma-shi-ta — kể lại lời dự báo trong quá khứ; ⚠ không nói ~~{晴|は}れるそうでした~~ vì そう "nghe nói" không chia quá khứ), **{降|ふ}りそうです** (fu-ri-so-o — đừng đọc thành ふる), **{外|はず}れたようです** (ha-zu-re-ta-yo-o), **{持|も}っていないはずなので** (mo-t-te-i-na-i-ha-zu-na-no-de — っ giữ 1 nhịp), **{迎|むか}えに** (mu-ka-e-ni).',
      ],
    },
    {
      t: 'speak',
      id: 'b20-noi-ghi-am',
      part: '1',
      questions: [
        'あしたの てんきは どうですか。',
        'さいきん、なにか うわさを ききましたか。どんな うわさですか。',
        'あなたの ともだちは どんな ひとですか。いま どんな ようすですか。',
        '10ねんご、あなたは なにを して いると おもいますか。',
        'うわさを きいた とき、あなたは どう しますか。',
        'あなたが きいた うわさの はなしを 1ぷんで して ください。',
      ],
    },
  ],
};

/* ═══════════════════════════ 8. VIẾT ═══════════════════════════ */

const VIET: Lesson = {
  id: 'b20-viet',
  kind: 'writing',
  title: 'Viết — bài văn "Tin đồn" (150–200 chữ) và tin nhắn báo "có thể đến muộn"',
  goal: 'Viết bài văn 150–200 chữ kể một tin đồn đã nghe và sự thật phía sau, dùng đúng nguồn tin (～らしい／～そうです／～ようでした) và độ chắc chắn (～かもしれない／～はず), kết bằng ý kiến của mình; viết tin nhắn ngắn báo người trên rằng mình có thể đến muộn và chắc chắn tới lúc mấy giờ — tự chấm theo 5 tiêu chí.',
  minutes: 40,
  blocks: [
    {
      t: 'p',
      text: 'Đề chính: **作文「うわさ」**, **150–200 chữ**, thể です／ます. Đề phụ: **tin nhắn cho quản lý / thầy** (~80 chữ) báo tàu dừng, **có thể đến muộn** (～かもしれません) và **chắc chắn tới lúc** mấy giờ (～はずです). Bài viết N4 chấm **đúng khuôn + dùng được mẫu vừa học**. Văn viết dùng **～ようです** (không dùng みたい), **～かもしれません** (không rút gọn ～かも).',
    },
    {
      t: 'table',
      caption: 'Dàn ý bài văn 「うわさ」 — 4 đoạn',
      head: ['Đoạn', 'Nội dung', 'Mẫu nên dùng', 'Câu mở gợi ý'],
      rows: [
        ['① Mở', 'Khi nào, ở đâu, nghe tin đồn gì', '～らしい · ～といううわさ', '{先月|せんげつ}、{学校|がっこう}で「～らしい」といううわさを{聞|き}きました。'],
        ['② Đoán', 'Mình / mọi người đã nghĩ gì, thấy gì', '～ようでした · ～かもしれないと{思|おも}いました · ～そうでした', 'みんな{心配|しんぱい}そうでした。{私|わたし}も～かもしれないと{思|おも}いました。'],
        ['③ Sự thật', 'Kiểm chứng ra sao, sự thật là gì', '{実|じつ}は～ · ～そうです (truyền lại lời người có trách nhiệm)', '{先生|せんせい}に{聞|き}いてみると、{実|じつ}は～。'],
        ['④ Ý kiến', 'Bài học / mình nghĩ gì về tin đồn', '～ほうがいいと{思|おも}います · ～はずです', 'うわさを{聞|き}いたら、～ほうがいいと{思|おも}います。'],
      ],
    },
    {
      t: 'note',
      title: 'Từ nối nên dùng',
      items: [
        '**{最初|さいしょ}は** (lúc đầu) · **それで** (vì vậy) · **でも／しかし** (nhưng) · **{実|じつ}は** (thật ra) · **それから** (sau đó) · **{最後|さいご}に** (cuối cùng) · **これからは** (từ nay về sau).',
        'Nguồn tin trong văn viết: **～によると、～そうです** · **うわさでは、～らしいです** · **～を{見|み}ると、～ようでした**.',
      ],
    },
    {
      t: 'passage',
      title: 'Bài mẫu — うわさ（186{字|じ}）',
      intro: 'Đọc to bài mẫu, gạch chân các mẫu ～らしい／～そうです／～ようでした／～かもしれない／～はず.',
      paras: [
        { text: '{先月|せんげつ}、クラスで「{本田先生|ほんだせんせい}が{来月|らいげつ}{結婚|けっこん}するらしい」といううわさを{聞|き}きました。{確|たし}かに{最近|さいきん}の{先生|せんせい}は{楽|たの}しそうで、{駅|えき}で{女|おんな}の{人|ひと}と{話|はな}しているのを{見|み}た{友達|ともだち}もいました。{私|わたし}も、その{人|ひと}が{結婚|けっこん}の{相手|あいて}かもしれないと{思|おも}いました。' },
        { text: 'でも、{次|つぎ}の{日|ひ}、{先生|せんせい}に{聞|き}いてみると、{実|じつ}は{結婚|けっこん}するのは{先生|せんせい}の{妹|いもうと}さんでした。{駅|えき}の{女|おんな}の{人|ひと}も{妹|いもうと}さんだったそうです。' },
        { text: 'うわさは{半分|はんぶん}だけ{本当|ほんとう}でした。{面白|おもしろ}い{話|はなし}ほど{早|はや}く{広|ひろ}がるようです。これからは、うわさを{聞|き}いたら、{誰|だれ}かに{話|はな}す{前|まえ}に{確認|かくにん}したほうがいいと{思|おも}います。' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('{件名|けんめい}：{少|すこ}し{遅|おく}れます', 'Kenmei: Sukoshi okuremasu', 'Tiêu đề: Em sẽ đến muộn một chút'),
        E('{小林店長|こばやしてんちょう}、お{疲|つか}れさまです。ナタポンです。', 'Kobayashi tenchou, otsukaresama desu. Natapon desu.', 'Anh Kobayashi, em chào anh. Em là Nattapon.'),
        E('{今|いま}、{事故|じこ}で{電車|でんしゃ}が{止|と}まっていて、{少|すこ}し{遅|おく}れるかもしれません。', 'Ima, jiko de densha ga tomatte ite, sukoshi okureru kamoshiremasen.', 'Hiện tàu đang dừng vì tai nạn, có khi em sẽ đến muộn một chút.'),
        E('{駅|えき}の{放送|ほうそう}では、{十分後|じっぷんご}に{動|うご}くそうです。', 'Eki no housou de wa, juppungo ni ugoku sou desu.', 'Theo thông báo của ga thì 10 phút nữa tàu chạy.'),
        E('{十一時|じゅういちじ}までには{店|みせ}に{着|つ}くはずです。', 'Juuichiji made ni wa mise ni tsuku hazu desu.', 'Chắc chắn trước 11 giờ em sẽ tới quán.'),
        E('ご{迷惑|めいわく}をおかけして、{申|もう}し{訳|わけ}ありません。', 'Gomeiwaku o okake shite, moushiwake arimasen.', 'Em xin lỗi vì đã gây phiền. (câu cố định — ôn Bài 19)'),
      ],
    },
    {
      t: 'quiz',
      id: 'b20-viet-cau',
      title: 'Viết từng câu cho bài của bạn — dịch Việt → Nhật (6 câu)',
      kind: 'translate',
      grammar: '～らしい · ～そうです · ～ようでした · ～かもしれない · ～はず · ～ほうがいいと思います',
      items: [
        { q: 'Tôi nghe tin đồn là nghe đâu quán đó sắp đóng cửa.', answers: V('あの{店|みせ}が{閉|し}まるらしいといううわさを{聞|き}きました。', 'その{店|みせ}が{閉|し}まるらしいといううわさを{聞|き}きました。', 'あの{店|みせ}が{閉店|へいてん}するらしいといううわさを{聞|き}きました。'), hint: 'しまる らしい という うわさ' },
        { q: 'Mọi người trông có vẻ lo lắng.', answers: V('みんな{心配|しんぱい}そうでした。', 'みんな{心配|しんぱい}そうです。', 'みんなは{心配|しんぱい}そうでした。'), hint: 'しんぱい そう' },
        { q: 'Tôi cũng đã nghĩ có khi đó là sự thật.', answers: V('{私|わたし}も{本当|ほんとう}かもしれないと{思|おも}いました。', '{私|わたし}もそれは{本当|ほんとう}かもしれないと{思|おも}いました。', '{私|わたし}も{事実|じじつ}かもしれないと{思|おも}いました。'), hint: 'ほんとう かもしれない と おもいました' },
        { q: 'Thật ra người cưới là em gái của thầy.', answers: V('{実|じつ}は{結婚|けっこん}するのは{先生|せんせい}の{妹|いもうと}さんでした。', '{実|じつ}は、{結婚|けっこん}するのは{先生|せんせい}の{妹|いもうと}さんです。', '{実|じつ}は{結婚|けっこん}するのは{先生|せんせい}の{妹|いもうと}でした。'), hint: 'じつは · けっこんするのは' },
        { q: 'Có khi em đến muộn một chút. (tin nhắn cho quản lý)', answers: V('{少|すこ}し{遅|おく}れるかもしれません。', 'ちょっと{遅|おく}れるかもしれません。'), hint: 'おくれる かもしれません' },
        { q: 'Chắc chắn trước 11 giờ em sẽ tới.', answers: V('{十一時|じゅういちじ}までには{着|つ}くはずです。', '{十一時|じゅういちじ}までに{着|つ}くはずです。', '11{時|じ}までには{着|つ}くはずです。', '11{時|じ}までに{着|つ}くはずです。'), hint: 'までには つく はずです' },
      ],
    },
    {
      t: 'note',
      title: 'Tự chấm — 5 tiêu chí (mỗi tiêu chí 2 điểm, tổng 10)',
      items: [
        '**① Khuôn** — đủ 4 đoạn: tin đồn → đoán → sự thật → ý kiến.',
        '**② Mẫu của bài** — có ít nhất 4 trong 6: ～そう (様態), ～そうです (伝聞), ～ようだ, ～らしい, ～かもしれない, ～はず — và **đúng nguồn tin** (tin nghe → らしい／そうです; mình thấy → ようだ／そう).',
        '**③ Nối đúng** — {留守|るす}**の**ようだ, {暇|ひま}**な**はず, {秘密|ひみつ}らしい (không だ), {雨|あめ}かもしれない (không だ), おいし**そう** (bỏ い), よ**さ**そう.',
        '**④ Nội dung cụ thể** — nói rõ tin gì, ai nói, kiểm chứng thế nào, ít nhất 1 chi tiết thời gian; có câu cảm xúc ({驚|おどろ}きました, ほっとしました…).',
        '**⑤ Độ dài & văn phong** — 150–200 chữ, toàn thể です／ます (không みたい, không ～かも), chữ Hán mới viết bằng chữ Hán ({様子|ようす}, {確認|かくにん}, {実|じつ}は, {情報|じょうほう}, {絶対|ぜったい}, {予想|よそう}…).',
      ],
    },
  ],
};

/* ═══════════════════════════ 9. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b20-bai-tap',
  kind: 'homework',
  title: 'Bài tập Bài 20 — dịch, trắc nghiệm, ghép câu, đổi câu (có đáp án)',
  goal: 'Tự kiểm tra toàn bộ Bài 20: dịch Việt → Nhật có ～そう (2 nghĩa), ～ようだ／～みたい, ～らしい, ～かもしれない, ～はず; chọn đúng mẫu theo nguồn tin và độ chắc chắn, nối đúng với V／イA／ナA／N; ghép câu đúng trật tự và đổi câu theo mẫu — mục tiêu ≥ 85% trước khi làm Kiểm tra chặng.',
  minutes: 50,
  blocks: [
    {
      t: 'note',
      title: 'Cách làm',
      items: [
        'Làm sau khi xong 8 mục cốt lõi. Gõ đáp án bằng kana hoặc chữ Hán đều được; dấu câu và dấu cách không tính.',
        'Sai câu nào thì mở lại đúng mục: ～そう (trông có vẻ) → Ngữ pháp ① (bảng nối + ngoại lệ よさそう・なさそう); hai そう → ①′; ～ようだ／～みたい → ② (bảng ～そう ↔ ～ようだ); ～らしい → ③ (bảng ba mẫu dễ lẫn); ～かもしれない → ④ (thang độ chắc chắn); ～はず → ⑤ (bảng はず ↔ つもり ↔ 予定).',
        'Mục tiêu: **≥ 85%** trước khi làm **Kiểm tra chặng 16–20** (cuối danh sách).',
      ],
    },
    {
      t: 'quiz',
      id: 'b20-bt-dich',
      title: 'I. Dịch Việt → Nhật (14 câu)',
      kind: 'translate',
      grammar: '～そう · ～そうです (nghe nói) · ～ようです／～みたい · ～らしい · ～かもしれません · ～はずです',
      items: [
        { q: 'Mì ramen này trông cay quá.', answers: V('このラーメンは{辛|から}そうです。', 'このラーメン、{辛|から}そうですね。', 'このラーメンはとても{辛|から}そうです。', 'このラーメンは{辛|から}そうですね。'), hint: 'からそう' },
        { q: 'Trời sắp mưa đến nơi.', answers: V('{今|いま}にも{雨|あめ}が{降|ふ}りそうです。', '{今|いま}にも{雨|あめ}が{降|ふ}りそう。'), hint: 'いまにも · ふりそう' },
        { q: 'Quán cà phê kia trông được đấy.', answers: V('あのカフェはよさそうですね。', 'あのカフェ、よさそうですね。', 'あのカフェはよさそうです。'), hint: 'いい → よさそう' },
        { q: 'Nghe nói (theo dự báo) ngày mai có tuyết.', answers: V('{天気予報|てんきよほう}によると、{明日|あした}は{雪|ゆき}だそうです。', '{天気予報|てんきよほう}では、{明日|あした}は{雪|ゆき}が{降|ふ}るそうです。', '{明日|あした}は{雪|ゆき}が{降|ふ}るそうです。', '{明日|あした}は{雪|ゆき}だそうです。'), hint: 'ゆきだ そうです／ふる そうです' },
        { q: 'Hình như chị Yamaguchi không có nhà. (lịch sự)', answers: V('{山口|やまぐち}さんは{留守|るす}のようです。', '{山口|やまぐち}さんはいないようです。', '{山口|やまぐち}さんは{留守|るす}みたいです。'), hint: 'るすの ようです' },
        { q: 'Hình như mình bị cảm rồi. (văn nói)', answers: V('{風邪|かぜ}をひいたみたい。', '{風邪|かぜ}をひいたみたいです。', '{風邪|かぜ}をひいたようです。'), hint: 'ひいた みたい' },
        { q: 'Hôm nay ấm áp cứ như mùa xuân.', answers: V('{今日|きょう}は{暖|あたた}かくて、まるで{春|はる}のようです。', '{今日|きょう}は{暖|あたた}かくて、まるで{春|はる}みたいです。', '{今日|きょう}はまるで{春|はる}のように{暖|あたた}かいです。'), hint: 'まるで はるの ようです' },
        { q: 'Nghe đâu anh Nishikawa sắp nghỉ việc.', answers: V('{西川|にしかわ}さんは{会社|かいしゃ}を{辞|や}めるらしいです。', '{西川|にしかわ}さんは{仕事|しごと}を{辞|や}めるらしいです。', '{西川|にしかわ}さんは{会社|かいしゃ}を{辞|や}めるらしいですよ。'), hint: 'やめる らしいです' },
        { q: 'Có khi tôi đến muộn một chút.', answers: V('{少|すこ}し{遅|おく}れるかもしれません。', 'ちょっと{遅|おく}れるかもしれません。'), hint: 'おくれる かもしれません' },
        { q: 'Biết đâu chìa khoá ở trong túi.', answers: V('もしかしたら、{鍵|かぎ}はかばんの{中|なか}かもしれません。', 'もしかしたら、{鍵|かぎ}はかばんの{中|なか}にあるかもしれません。', '{鍵|かぎ}はかばんの{中|なか}かもしれません。'), hint: 'もしかしたら · かもしれません' },
        { q: 'Hôm nay Chủ nhật nên chắc chắn ngân hàng nghỉ.', answers: V('{今日|きょう}は{日曜日|にちようび}だから、{銀行|ぎんこう}は{休|やす}みのはずです。', '{今日|きょう}は{日曜日|にちようび}なので、{銀行|ぎんこう}は{休|やす}みのはずです。', '{今日|きょう}は{日曜日|にちようび}ですから、{銀行|ぎんこう}は{休|やす}みのはずです。'), hint: 'やすみの はずです' },
        { q: 'Hàng gửi hôm qua nên chắc chắn đã đến rồi.', answers: V('{荷物|にもつ}は{昨日|きのう}{送|おく}ったから、もう{届|とど}いているはずです。', '{荷物|にもつ}は{昨日|きのう}{送|おく}ったので、もう{届|とど}いているはずです。', '{昨日|きのう}{送|おく}ったから、もう{届|とど}いているはずです。'), hint: 'とどいている はずです' },
        { q: 'Chắc chắn đã bỏ vào túi rồi vậy mà không thấy ví.', answers: V('かばんに{入|い}れたはずなのに、{財布|さいふ}がありません。', 'かばんに{入|い}れたはずなのに、{財布|さいふ}がない。'), hint: 'いれた はずなのに' },
        { q: 'Hai người trông rất hạnh phúc.', answers: V('{二人|ふたり}はとても{幸|しあわ}せそうです。', '{二人|ふたり}はとても{幸|しあわ}せそうですね。'), hint: 'しあわせそう' },
      ],
    },
    {
      t: 'mcq',
      id: 'b20-bt-chon',
      title: 'II. Chọn đáp án đúng (14 câu)',
      items: [
        { q: 'この{荷物|にもつ}、とても（　）ですね。{手伝|てつだ}いましょうか。', options: ['{重|おも}いそう', '{重|おも}そう', '{重|おも}いよう', '{重|おも}いはず'], correct: 1, why: 'Thấy người khác bê → trông nặng: **{重|おも}そう**. 〔Totemo omosou desu ne.〕' },
        { q: '{父|ちち}の{話|はなし}では、{明日|あした}は{会社|かいしゃ}が（　）そうです。', options: ['{休|やす}み', '{休|やす}みだ', '{休|やす}みの', '{休|やす}みな'], correct: 1, why: 'Nghe nói + N → **{休|やす}みだそうです**. 〔Ashita wa kaisha ga yasumi da sou desu.〕' },
        { q: '{今|いま}にも{泣|な}き（　）な{顔|かお}をしています。', options: ['そう', 'よう', 'らしい', 'はず'], correct: 0, why: '**{今|いま}にも** + Vます + **そう** → {泣|な}きそうな{顔|かお}. 〔Ima ni mo nakisou na kao.〕' },
        { q: '{今日|きょう}は{天気|てんき}が（　）ですね。{散歩|さんぽ}しましょう。', options: ['いいそう', 'よいそう', 'よさそう', 'いさそう'], correct: 2, why: 'いい → **よさそう**. 〔Tenki ga yosasou desu ne.〕' },
        { q: '{店|みせ}の{前|まえ}に{人|ひと}がたくさん{並|なら}んでいます。おいしい{店|みせ}（　）です。', options: ['そう', 'のよう', 'なよう', 'だそう'], correct: 1, why: 'Thấy dấu hiệu (người xếp hàng) → kết luận: N + **のようです**. ~~{店|みせ}そう~~ (そう không đi với N). 〔Oishii mise no you desu.〕' },
        { q: '{弟|おとうと}は{最近|さいきん}、{暇|ひま}（　）。{毎日|まいにち}ゲームをしています。', options: ['みたいです', 'なみたいです', 'のみたいです', 'だみたいです'], correct: 0, why: 'ナA + **みたい** (không な). 〔Saikin, hima mitai desu.〕' },
        { q: 'うわさでは、あの{二人|ふたり}は{来年|らいねん}{結婚|けっこん}する（　）。', options: ['そうな', 'らしいです', 'ようにします', 'はずがありません'], correct: 1, why: '**うわさでは** → **らしいです**. 〔Rainen kekkon suru rashii desu.〕' },
        { q: '{電話|でんわ}に{出|で}ませんね。もう{寝|ね}た（　）。', options: ['かもしれません', 'そうです（様態）', 'みたいな', 'らしく'], correct: 0, why: 'Không nghe máy → một khả năng: **{寝|ね}たかもしれません**. 〔Mou neta kamoshiremasen.〕' },
        { q: '{九時|くじ}に{出|で}たから、{十時|じゅうじ}には（　）はずです。', options: ['{着|つ}く', '{着|つ}き', '{着|つ}いて', '{着|つ}くの'], correct: 0, why: 'V thể thường + **はず**: **{着|つ}くはずです**. 〔Juuji ni wa tsuku hazu desu.〕' },
        { q: '{彼|かれ}は{日本|にほん}に{十年|じゅうねん}{住|す}んでいるから、{日本語|にほんご}が{上手|じょうず}（　）はずです。', options: ['だ', 'な', 'の', '—'], correct: 1, why: 'ナA + **な** + はず. 〔Nihongo ga jouzu na hazu desu.〕' },
        { q: '「{明日|あした}、{雨|あめ}が{降|ふ}るそうです。」の{意味|いみ}は？', options: ['{空|そら}を{見|み}ると、{雨|あめ}が{降|ふ}りそうだ。', '{天気予報|てんきよほう}などで、{雨|あめ}が{降|ふ}ると{聞|き}いた。', '{絶対|ぜったい}に{雨|あめ}が{降|ふ}る。', '{雨|あめ}が{降|ふ}ってほしい。'], correct: 1, why: '{降|ふ}る (thể thường) + そうです = **nghe nói** → đã nghe từ nguồn khác. 〔Tenki yohou nado de, ame ga furu to kiita.〕' },
        { q: '{私|わたし}は{来年|らいねん}、{日本|にほん}の{大学院|だいがくいん}に{進学|しんがく}する（　）です。', options: ['はず', 'つもり', 'らしい', 'よう'], correct: 1, why: 'Ý định của **chính mình** → **つもり** (Bài 16), không dùng はず. 〔Shingaku suru tsumori desu.〕' },
        { q: 'A「この{問題|もんだい}、できそう？」 B「うーん、{難|むずか}しくて、{今日|きょう}{中|じゅう}には（　）。」', options: ['できそうにない', 'できるそうだ', 'できたらしい', 'できるはずだ'], correct: 0, why: 'Phủ định của V + そう: **できそうにない** (chắc không làm xong được). 〔Kyoujuu ni wa dekisou ni nai.〕' },
        { q: '{本田先生|ほんだせんせい}（　）{先生|せんせい}になりたいです。', options: ['のような', 'らしい', 'みたいに', 'そうな'], correct: 0, why: 'N1 **のような** N2 = (giáo viên) như thầy Honda. 〔Honda-sensei no you na sensei ni naritai desu.〕' },
      ],
    },
    {
      t: 'build',
      id: 'b20-bt-ghep',
      title: 'III. Ghép câu (8 câu)',
      items: [
        { vi: 'Trông bạn có vẻ không khoẻ.', chips: ['{具合|ぐあい}が', '{悪|わる}', 'そうですね', '{悪|わる}い', 'らしいですね'], answer: ['{具合|ぐあい}が', '{悪|わる}', 'そうですね'], ro: 'Guai ga warusou desu ne.' },
        { vi: 'Pin có vẻ sắp hết rồi.', chips: ['{電池|でんち}が', '{切|き}れ', 'そうです', '{切|き}れる', 'はずです'], answer: ['{電池|でんち}が', '{切|き}れ', 'そうです'], ro: 'Denchi ga kiresou desu.' },
        { vi: 'Nghe nói quán đó tháng sau đóng cửa.', chips: ['あの', '{店|みせ}は', '{来月|らいげつ}', '{閉|し}まる', 'そうです', '{閉|し}まり'], answer: ['あの', '{店|みせ}は', '{来月|らいげつ}', '{閉|し}まる', 'そうです'], ro: 'Ano mise wa raigetsu shimaru sou desu.' },
        { vi: 'Hình như không có ai ở phòng bên.', chips: ['{隣|となり}の', '{部屋|へや}には', '{誰|だれ}も', 'いない', 'ようです', 'そうです'], answer: ['{隣|となり}の', '{部屋|へや}には', '{誰|だれ}も', 'いない', 'ようです'], ro: 'Tonari no heya ni wa dare mo inai you desu.' },
        { vi: 'Nghe đâu bài kiểm tra tuần sau khó.', chips: ['{来週|らいしゅう}の', 'テストは', '{難|むずか}しい', 'らしいです', '{難|むずか}し', 'そうな'], answer: ['{来週|らいしゅう}の', 'テストは', '{難|むずか}しい', 'らしいです'], ro: 'Raishuu no tesuto wa muzukashii rashii desu.' },
        { vi: 'Đường đang tắc nên có khi sẽ muộn.', chips: ['{道|みち}が', '{混|こ}んでいるから', '{遅|おく}れる', 'かもしれません', '{絶対|ぜったい}に', '{遅|おく}れ'], answer: ['{道|みち}が', '{混|こ}んでいるから', '{遅|おく}れる', 'かもしれません'], ro: 'Michi ga konde iru kara okureru kamoshiremasen.' },
        { vi: 'Anh ấy giỏi tiếng Nhật là chắc chắn rồi.', chips: ['{彼|かれ}は', '{日本語|にほんご}が', '{上手|じょうず}な', 'はずです', '{上手|じょうず}の', '{上手|じょうず}そう'], answer: ['{彼|かれ}は', '{日本語|にほんご}が', '{上手|じょうず}な', 'はずです'], ro: 'Kare wa nihongo ga jouzu na hazu desu.' },
        { vi: 'Tôi muốn sống ở một thành phố lớn như Tokyo.', chips: ['{東京|とうきょう}の', 'ような', '{大|おお}きい', '{町|まち}に', '{住|す}みたいです', 'らしい'], answer: ['{東京|とうきょう}の', 'ような', '{大|おお}きい', '{町|まち}に', '{住|す}みたいです'], ro: 'Toukyou no you na ookii machi ni sumitai desu.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b20-bt-doi',
      title: 'IV. Đổi câu theo mẫu (10 câu)',
      kind: 'fill',
      grammar: 'Đổi câu gốc sang mẫu trong ngoặc — giữ nguyên nghĩa còn lại',
      items: [
        { q: 'このケーキはおいしいです。→ (trông có vẻ)', answers: V('このケーキはおいしそうです。'), hint: 'おいしそう' },
        { q: '{雨|あめ}が{降|ふ}ります。→ (sắp, thấy mây đen)', answers: V('{雨|あめ}が{降|ふ}りそうです。'), hint: 'ふりそう' },
        { q: '{雨|あめ}が{降|ふ}ります。→ (nghe nói, theo dự báo)', answers: V('{雨|あめ}が{降|ふ}るそうです。'), hint: 'ふる そうです' },
        { q: '{先生|せんせい}は{元気|げんき}です。→ (nghe nói)', answers: V('{先生|せんせい}は{元気|げんき}だそうです。'), hint: 'げんきだ そうです' },
        { q: '{先生|せんせい}は{元気|げんき}です。→ (trông có vẻ)', answers: V('{先生|せんせい}は{元気|げんき}そうです。'), hint: 'げんきそう' },
        { q: '{山口|やまぐち}さんは{留守|るす}です。→ (hình như — ようです)', answers: V('{山口|やまぐち}さんは{留守|るす}のようです。'), hint: 'るすの ようです' },
        { q: '{山口|やまぐち}さんは{留守|るす}です。→ (hình như — văn nói みたい)', answers: V('{山口|やまぐち}さんは{留守|るす}みたいです。', '{山口|やまぐち}さんは{留守|るす}みたい。', '{山口|やまぐち}さんは{留守|るす}みたいだ。'), hint: 'るす みたい' },
        { q: '{駅前|えきまえ}に{店|みせ}ができます。→ (nghe đâu — らしい)', answers: V('{駅前|えきまえ}に{店|みせ}ができるらしいです。', '{駅前|えきまえ}に{店|みせ}ができるらしい。'), hint: 'できる らしいです' },
        { q: '{彼|かれ}は{来|き}ません。→ (có khi)', answers: V('{彼|かれ}は{来|こ}ないかもしれません。', '{彼|かれ}は{来|こ}ないかもしれない。'), hint: 'こない かもしれません' },
        { q: '{銀行|ぎんこう}は{休|やす}みです。→ (chắc chắn là — はず)', answers: V('{銀行|ぎんこう}は{休|やす}みのはずです。', '{銀行|ぎんこう}は{休|やす}みのはずだ。'), hint: 'やすみの はずです' },
      ],
    },
  ],
};

/* ═══════════════════════ ② THEO BUỔI TRÊN LỚP ═══════════════════════ */

const BUOI_1: Lesson = {
  id: 'b20-buoi-1-sou',
  kind: 'review',
  title: 'Buổi 1 — Mở Bài 20: từ mới vẻ ngoài & thời tiết · ～そう (trông có vẻ / sắp) · hai そう · hội thoại ①',
  goal: 'Theo nhịp một buổi trên lớp: khởi động bằng ～そうです "nghe nói" (ポイント 119), học từ vẻ ngoài – tâm trạng và từ thời tiết – dấu hiệu, dùng ～そう cho tính từ (おいしそう, よさそう, なさそう) và động từ (降りそう, 落ちそう), chia ～そうな N／～そうに V và phủ định, phân biệt chắc chắn hai そう, đóng vai hội thoại ① (dã ngoại), rồi trả lời được câu giáo viên hay gọi.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 1 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Khởi động (5′)** — ôn ポイント 119: {天気予報|てんきよほう}によると、{明日|あした}は{雨|あめ}が{降|ふ}るそうです. Câu hỏi mở đầu: "Nhìn ra cửa sổ thấy mây đen — nói thế nào?"',
        '**Từ mới (10′)** — nhóm C (vẻ ngoài, tâm trạng: {様子|ようす}, {顔色|かおいろ}, {具合|ぐあい}, {気分|きぶん}, {機嫌|きげん}, {似|に}ている, {太|ふと}る, やせる…) + nhóm D (thời tiết, dấu hiệu: {雲|くも}, {今|いま}にも, {降|ふ}り{出|だ}す, {吹|ふ}く, {雷|かみなり}, {電池|でんち}, {切|き}れる).',
        '**Ngữ pháp (15′)** — ～そう: ① tính từ — trông có vẻ (おいしそう・よさそう・なさそう) · ② động từ — sắp (降りそう) · そうな N／そうに V · phủ định · HAI そう.',
        '**Hội thoại (10′)** — ① dã ngoại: hộp cơm trông ngon, trời sắp mưa trong khi dự báo nói nắng.',
        '**チャレンジ (10′)** — luyện cặp: A chỉ tranh hỏi どうですか ↔ B trả lời ～そうです + lý do. Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b20-b1-slides',
      title: 'Bài 20 うわさ — Buổi 1: ～そう (trông có vẻ・sắp)',
      slides: [
        {
          tieuDe: '{第20課|だいにじゅっか} うわさ',
          anh: ['speech-balloon', 'cloud-with-rain', 'crystal-ball'],
          nhan: ['うわさ', '{雨|あめ}が{降|ふ}りそう', '{予想|よそう}'],
          dong: ['Hôm nay: **～そう** — trông có vẻ… · sắp… · và **hai そう**'],
          ro: ['~sou'],
          ghi: 'Bài 20 là bài "tin đồn và suy đoán" — bài cuối của chặng 16–20. Cả bài là một nhóm mẫu cùng họ: そう, ようだ, みたい, らしい, かもしれない, はず. Hôm nay bắt đầu bằng mẫu "dễ thấy" nhất: そう — đoán ngay bằng mắt.',
        },
        {
          tieuDe: 'できること — Học xong Bài 20 làm được gì?',
          anh: ['cloud-with-rain', 'speech-balloon', 'delivery-truck'],
          nhan: ['20-1 ～そう', '20-2 うわさ', '20-3 ～はず'],
          dong: ['① Nói điều mắt thấy: trông ngon, trông mệt, trời sắp mưa (～そう).', '② Kể & bàn tin đồn: nghe đâu, hình như, có khi (～らしい・～ようだ・～かもしれない).', '③ Nói điều có căn cứ: chắc chắn là, lẽ ra (～はず・～はずなのに).'],
          ro: ['~sou', '~rashii · ~you da · ~kamoshirenai', '~hazu · ~hazu na noni'],
          ghi: 'Ba buổi đi đúng ba phần này. Cuối Bài 20 bạn kể được 1 phút về một tin đồn mình từng nghe — và làm bài Kiểm tra chặng 16–20 theo đúng dạng đề N4.',
        },
        {
          tieuDe: 'Khởi động — "nghe nói" (ポイント 119)',
          anh: ['television', 'umbrella-with-rain-drops'],
          nhan: ['{天気予報|てんきよほう}', '{雨|あめ}'],
          dong: ['{天気予報|てんきよほう}によると、{明日|あした}は{雨|あめ}が{降|ふ}るそうです。'],
          ro: ['Tenki yohou ni yoru to, ashita wa ame ga furu sou desu.'],
          hoi: 'Người nói có nhìn thấy mưa không? そう ở đây nghĩa là gì?',
          dap: 'Không thấy. Người nói chỉ truyền lại tin của dự báo — そうです = "nghe nói" (ポイント 119). Đứng sau THỂ THƯỜNG: {降|ふ}る.',
          ghi: 'Hôm nay sẽ học một そう KHÁC hẳn — そう của mắt nhìn. Giữ câu này trên bảng để so sánh cuối buổi.',
        },
        {
          tieuDe: '{新|あたら}しいことば ① — Vẻ ngoài & tâm trạng',
          anh: ['face-with-thermometer', 'nauseated-face', 'pensive-face', 'grinning-face'],
          nhan: ['{具合|ぐあい}が{悪|わる}い', '{気分|きぶん}が{悪|わる}い', '{落|お}ち{込|こ}む', '{機嫌|きげん}がいい'],
          dong: ['{顔色|かおいろ}が{悪|わる}いですね。', '{先生|せんせい}の{様子|ようす}が{変|へん}です。'],
          ro: ['Kaoiro ga warui desu ne.', 'Sensei no yousu ga hen desu.'],
          hoi: '"Tôi buồn nôn" — {気分|きぶん}が{悪|わる}い hay {機嫌|きげん}が{悪|わる}い?',
          dap: '{気分|きぶん}が{悪|わる}い (cảm giác trong người). {機嫌|きげん}が{悪|わる}い = đang cáu, tâm trạng xấu lộ ra ngoài.',
          ghi: 'Thêm: {似|に}ている (giống — luôn dạng ている), {太|ふと}る (béo lên; người béo = {太|ふと}っている), やせる (gầy đi), {表情|ひょうじょう} (nét mặt).',
        },
        {
          tieuDe: '{新|あたら}しいことば ② — Thời tiết & dấu hiệu',
          anh: ['cloud', 'wind-face', 'cloud-with-lightning', 'low-battery'],
          nhan: ['{雲|くも}', '{風|かぜ}が{吹|ふ}く', '{雷|かみなり}', '{電池|でんち}が{切|き}れる'],
          dong: ['{黒|くろ}い{雲|くも}が{出|で}てきました。', '{急|きゅう}に{雨|あめ}が{降|ふ}り{出|だ}しました。'],
          ro: ['Kuroi kumo ga dete kimashita.', 'Kyuu ni ame ga furidashimashita.'],
          ghi: '{今|いま}にも = "đến nơi" — gần như chỉ đi với ～そう: {今|いま}にも{雨|あめ}が{降|ふ}りそう. Vます + {出|だ}す = bắt đầu đột ngột: {降|ふ}り{出|だ}す, {泣|な}き{出|だ}す.',
        },
        {
          tieuDe: '① イA ＋ そう — "trông có vẻ…"',
          anh: ['shortcake', 'hot-pepper', 'package'],
          nhan: ['おいしそう', '{辛|から}そう', '{重|おも}そう'],
          dong: ['このケーキはおいしそうです。', 'このラーメンは{辛|から}そうですね。', 'その{荷物|にもつ}、{重|おも}そうですね。'],
          ro: ['Kono keeki wa oishisou desu.', 'Kono raamen wa karasou desu ne.', 'Sono nimotsu, omosou desu ne.'],
          hoi: 'Đã ăn bánh rồi thì có nói 「おいしそう」 không?',
          dap: 'Không. Ăn rồi thì nói thẳng: おいしい！ そう chỉ dùng khi CHƯA thử, nhìn bề ngoài mà đoán.',
          ghi: 'Cách nối: bỏ い + そう. おいし-い → おいし-そう. Dùng cho thứ KHÔNG nhìn trực tiếp được: vị, cảm xúc, sức nặng, độ khó.',
        },
        {
          tieuDe: 'ナA ＋ そう — và cảm xúc của người khác',
          anh: ['smiling-face-with-hearts', 'woman-student', 'sleepy-face'],
          nhan: ['{幸|しあわ}せそう', '{暇|ひま}そう', '{眠|ねむ}そう'],
          dong: ['{二人|ふたり}は{幸|しあわ}せそうです。', 'パクさん、{眠|ねむ}そうですね。'],
          ro: ['Futari wa shiawasesou desu.', 'Paku-san, nemusou desu ne.'],
          hoi: 'Nói về bạn mình: 「リンさんは{寂|さび}しいです」 có tự nhiên không?',
          dap: 'Không — mình không biết chắc lòng người khác. Nói: リンさんは{寂|さび}しそうです.',
          ghi: 'ナA: bỏ な + そう ({元気|げんき}そう). Cảm xúc của NGƯỜI KHÁC phải có そう; cảm xúc của chính mình thì nói thẳng.',
        },
        {
          tieuDe: 'Hai ngoại lệ PHẢI thuộc — よさそう・なさそう',
          bang: {
            head: ['Từ', '＋ そう', 'Ví dụ'],
            rows: [
              ['いい', '**よさそう**', 'あのカフェ、よさそう。'],
              ['ない', '**なさそう**', '{時間|じかん}がなさそうです。'],
              ['{仲|なか}がいい', '{仲|なか}が**よさそう**', '{二人|ふたり}は{仲|なか}がよさそう。'],
              ['{元気|げんき}がない', '{元気|げんき}が**なさそう**', '{元気|げんき}がなさそうですね。'],
            ],
          },
          hoi: '「{天気|てんき}がいい」 + そう = ?',
          dap: '{天気|てんき}がよさそうです (không nói ~~いいそう~~ — nghe thành "nghe nói đẹp trời").',
          ghi: 'Hai ngoại lệ này là câu hỏi quen của đề N4. Viết lên góc bảng cả buổi.',
        },
        {
          tieuDe: '② Vます ＋ そう — "sắp…"',
          anh: ['cloud-with-rain', 'loudly-crying-face', 'package'],
          nhan: ['{降|ふ}りそう', '{泣|な}きそう', '{落|お}ちそう'],
          dong: ['{今|いま}にも{雨|あめ}が{降|ふ}りそうです。', 'あの{子|こ}、{泣|な}きそうですよ。', '{箱|はこ}が{落|お}ちそうです！'],
          ro: ['Ima ni mo ame ga furisou desu.', 'Ano ko, nakisou desu yo.', 'Hako ga ochisou desu!'],
          hoi: 'Bạn thấy cúc áo của bạn mình lỏng lẻo. Nói thế nào?',
          dap: 'ボタンが{取|と}れそうですよ。({取|と}れます → {取|と}れそう)',
          ghi: 'Cách nối: thể ます bỏ ます + そう. Nghĩa: nhìn DẤU HIỆU mà đoán việc sắp xảy ra. Với thể khả năng: できそう = có vẻ làm được.',
        },
        {
          tieuDe: 'そうな N ／ そうに V — chia như tính từ な',
          bang: {
            head: ['Vị trí', 'Câu'],
            rows: [
              ['cuối câu', 'このケーキはおいし**そうです**。'],
              ['＋ N', 'おいし**そうな**ケーキ'],
              ['＋ V', '{楽|たの}し**そうに**{話|はな}しています。'],
              ['quá khứ', '{先生|せんせい}は{眠|ねむ}**そうでした**。'],
            ],
          },
          hoi: 'Dịch: "Bọn trẻ đang chơi trông rất vui."',
          dap: '{子|こ}どもたちが{楽|たの}しそうに{遊|あそ}んでいます。',
          ghi: 'Nhớ: そう + な trước danh từ, そう + に trước động từ — y như {元気|げんき}な{人|ひと}, {元気|げんき}に{遊|あそ}ぶ.',
        },
        {
          tieuDe: 'Phủ định — mỗi loại một kiểu',
          bang: {
            head: ['Loại', 'Phủ định'],
            rows: [
              ['V', '{降|ふ}り**そうにない**／{降|ふ}り**そうもない**'],
              ['イA', 'おいしく**なさそう**'],
              ['ナA', '{元気|げんき}じゃ**なさそう**'],
            ],
          },
          hoi: '"Mưa này chắc chưa tạnh đâu" (やむ) — nói thế nào?',
          dap: 'この{雨|あめ}は、なかなかやみそうにないですね。',
          ghi: 'Văn nói còn nghe {降|ふ}らなそう／{降|ふ}らなさそう — nhận ra là được; viết bài dùng ～そうにない.',
        },
        {
          tieuDe: '⚡ HAI そう — đặt cạnh nhau',
          bang: {
            head: ['様態 — mình THẤY', '伝聞 — mình NGHE'],
            rows: [
              ['{雨|あめ}が{降|ふ}り**そう**です。', '{雨|あめ}が{降|ふ}る**そう**です。'],
              ['{辛|から}**そう**です。', '{辛|から}い**そう**です。'],
              ['よさ**そう**です。', 'いい**そう**です。'],
              ['{元気|げんき}**そう**です。', '{元気|げんき}だ**そう**です。'],
            ],
          },
          hoi: '「おいしそうなケーキ」 và 「おいしいそうなケーキ」 — câu nào đúng?',
          dap: 'Chỉ おいしそうなケーキ. そう "nghe nói" không đứng trước danh từ và không chia quá khứ.',
          ghi: 'Phân biệt trong 3 giây: nhìn chữ ngay trước そう — gốc động từ / tính từ mất い → "trông có vẻ"; thể thường đầy đủ, có だ → "nghe nói".',
        },
        {
          tieuDe: '⚠ Khi nào KHÔNG dùng ～そう',
          anh: ['rose', 'woman'],
          nhan: ['{赤|あか}い{花|はな}', 'きれいな{人|ひと}'],
          dong: ['~~{赤|あか}そうな{花|はな}~~ → {赤|あか}い{花|はな}', '~~きれいそうです~~ → きれいですね', '~~{学生|がくせい}そう~~ → {学生|がくせい}みたい'],
          ro: ['akai hana', 'kirei desu ne', 'gakusei mitai'],
          hoi: 'Vì sao không nói 「{赤|あか}そう」 về bông hoa đỏ trước mặt?',
          dap: 'Màu đỏ nhìn là THẤY RÕ, không cần đoán. そう dùng cho điều chưa chắc.',
          ghi: 'Ba điều cấm: (1) điều nhìn là thấy rõ, (2) đã thử rồi, (3) danh từ. Và nhớ かわいそう = "tội nghiệp", không phải "trông dễ thương".',
        },
        {
          tieuDe: '{会話|かいわ}① — ピクニック',
          anh: ['sandwich', 'cloud-with-rain', 'hot-beverage'],
          nhan: ['お{弁当|べんとう}', '{黒|くろ}い{雲|くも}', 'カフェ'],
          dong: ['わあ、お{弁当|べんとう}、おいしそうですね！', '{今|いま}にも{雨|あめ}が{降|ふ}りそう。', '{天気予報|てんきよほう}では{晴|は}れるそうですよ。'],
          ro: ['Waa, obentou, oishisou desu ne!', 'Ima ni mo ame ga furisou.', 'Tenki yohou de wa hareru sou desu yo.'],
          hoi: 'Trong hội thoại ①, câu nào là そう "nghe nói"?',
          dap: '{天気予報|てんきよほう}では、{一日中|いちにちじゅう}{晴|は}れるそうですよ — có nguồn tin, thể thường {晴|は}れる.',
          ghi: 'Đọc to hội thoại ① theo cặp ba người (メアリー, パク, ダニエル). Đếm xem có bao nhiêu そう "trông có vẻ" và bao nhiêu そう "nghe nói".',
        },
        {
          tieuDe: 'チャレンジ — nhìn tranh, nói một câu ～そう',
          anh: ['yawning-face', 'steaming-bowl', 'snowman', 'tired-face'],
          nhan: ['A', 'B', 'C', 'D'],
          dong: ['A：この{人|ひと}はどうですか。', 'B：{眠|ねむ}そうです。{大|おお}きいあくびをしていますから。'],
          ro: ['A: Kono hito wa dou desu ka.', 'B: Nemusou desu. Ookii akubi o shite imasu kara.'],
          hoi: 'Tranh B (bát canh bốc hơi) và C (người tuyết) — nói gì?',
          dap: 'B：{熱|あつ}そうです／おいしそうです。C：{寒|さむ}そうです／{外|そと}は{寒|さむ}そうですね。',
          ghi: 'Luyện cặp 3 phút, đổi vai. Mỗi câu ～そう thêm một câu lý do bằng ～から — câu trả lời 2 ý là đủ điểm thi nói.',
        },
        {
          tieuDe: 'まとめ — Buổi 1',
          bang: {
            head: ['', 'Cách nối', 'Ví dụ'],
            rows: [
              ['V', 'ます bỏ ます ＋ そう', '{降|ふ}りそう'],
              ['イA', 'bỏ い ＋ そう', 'おいしそう'],
              ['いい／ない', 'よさそう／なさそう', '—'],
              ['ナA', 'bỏ な ＋ そう', '{元気|げんき}そう'],
              ['N', '✗', '—'],
            ],
          },
          ghi: 'Bài về nhà: viết 5 câu ～そう về những gì bạn thấy trên đường về nhà hôm nay (trời, người, đồ ăn). Buổi sau: ～ようだ・～みたい・～らしい — đoán từ dấu hiệu và từ tin đồn.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Khởi động: hai câu trên bảng' },
    {
      t: 'p',
      text: 'Giáo viên viết lên bảng câu của Bài 15: 「{明日|あした}は{雨|あめ}が{降|ふ}るそうです」 rồi kéo rèm cửa sổ — trời đang kéo mây đen. Giáo viên chỉ ra ngoài: "Bây giờ mình **không nghe ai nói**, mình **tự nhìn thấy**. Câu sẽ thành 「{雨|あめ}が{降|ふ}り＿＿」". Cả lớp đoán. Đáp án: **{降|ふ}りそうです** — hôm nay học そう thứ hai.',
    },
    {
      t: 'mcq',
      id: 'b20-b1-khoi-dong',
      title: 'Khởi động — ôn ～そうです (nghe nói) và thể ます (4 câu)',
      items: [
        { q: 'ニュースによると、{昨日|きのう}{大阪|おおさか}で{地震|じしん}が（　）そうです。', options: ['あり', 'ある', 'あった', 'あって'], correct: 2, why: 'Nghe nói + việc đã xảy ra → thể thường quá khứ **あった** + そうです (ポイント 119). 〔Jishin ga atta sou desu.〕' },
        { q: '{友達|ともだち}の{話|はなし}では、あの{店|みせ}は（　）そうです。', options: ['{有名|ゆうめい}', '{有名|ゆうめい}だ', '{有名|ゆうめい}な', '{有名|ゆうめい}の'], correct: 1, why: 'Nghe nói + ナA → giữ **だ**: {有名|ゆうめい}だそうです. 〔Ano mise wa yuumei da sou desu.〕' },
        { q: '「{降|ふ}ります」の「ます」を{取|と}ると？', options: ['{降|ふ}る', '{降|ふ}り', '{降|ふ}って', '{降|ふ}ら'], correct: 1, why: 'Thể ます bỏ ます → **{降|ふ}り** — hôm nay ghép thêm そう: {降|ふ}りそう.' },
        { q: '「{落|お}ちます」の「ます」を{取|と}ると？', options: ['{落|お}ち', '{落|お}ちる', '{落|お}ちて', '{落|お}と'], correct: 0, why: '**{落|お}ち** → {落|お}ちそう (sắp rơi).' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Từ mới: bản tin thời tiết & "sổ theo dõi" bạn cùng phòng' },
    {
      t: 'table',
      caption: 'Giáo viên dán lên bảng một bản tin thời tiết và một trang nhật ký "hôm nay bạn cùng phòng trông thế nào" — mỗi dòng là một từ mới',
      head: ['Trên bảng', 'Đọc', 'Nghĩa'],
      rows: [
        ['{午後|ごご}から**{雲|くも}**が{広|ひろ}がり、**{雷|かみなり}**が{鳴|な}るかもしれません', 'kumo · kaminari', 'mây · sấm'],
        ['{北|きた}の{風|かぜ}が**{吹|ふ}き**、{夕方|ゆうがた}には{雨|あめ}が**{降|ふ}り{出|だ}す**でしょう', 'fuki · furidasu', 'thổi · bắt đầu mưa'],
        ['{朝|あさ}から**{顔色|かおいろ}**が{悪|わる}い → **{具合|ぐあい}**が{悪|わる}そう', 'kaoiro · guai', 'sắc mặt · tình trạng sức khoẻ'],
        ['バスで**{気分|きぶん}**が{悪|わる}くなった', 'kibun', 'cảm giác trong người'],
        ['{夜|よる}は**{機嫌|きげん}**がよかった（{好|す}きなドラマを{見|み}たから）', 'kigen', 'tâm trạng (lộ ra ngoài)'],
        ['スマホの**{電池|でんち}**が{今|いま}にも**{切|き}れ**そう', 'denchi · kire', 'pin · hết'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{最近|さいきん}、{先生|せんせい}の{様子|ようす}が{少|すこ}し{変|へん}です。', 'Saikin, sensei no yousu ga sukoshi hen desu.', 'Dạo này dáng vẻ thầy hơi lạ.'),
        E('リンさんはお{母|かあ}さんによく{似|に}ています。', 'Rin-san wa okaasan ni yoku nite imasu.', 'Lin rất giống mẹ.'),
        E('{日本|にほん}に{来|き}てから、{少|すこ}し{太|ふと}りました。', 'Nihon ni kite kara, sukoshi futorimashita.', 'Từ khi sang Nhật tôi béo lên một chút.'),
        E('{試験|しけん}に{落|お}ちて、{落|お}ち{込|こ}んでいます。', 'Shiken ni ochite, ochikonde imasu.', 'Thi trượt nên đang suy sụp.'),
      ],
    },
    { t: 'h', text: 'Slide 3 — ～そう: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b20-b1-chia',
      title: 'Luyện nhanh — chia ～そう (10 câu)',
      kind: 'fill',
      items: [
        { q: 'おいしい → ～そう', answers: V('おいしそう') },
        { q: '{眠|ねむ}い → ～そう', answers: V('{眠|ねむ}そう') },
        { q: '{暇|ひま} → ～そう', answers: V('{暇|ひま}そう') },
        { q: 'いい → ～そう', answers: ['よさそう'] },
        { q: 'ない → ～そう', answers: ['なさそう'] },
        { q: '{降|ふ}ります → ～そう', answers: V('{降|ふ}りそう') },
        { q: '{泣|な}きます → ～そう', answers: V('{泣|な}きそう') },
        { q: '{切|き}れます → ～そう', answers: V('{切|き}れそう') },
        { q: 'おいしい → ～そうな ケーキ', answers: V('おいしそうなケーキ') },
        { q: '{楽|たの}しい → ～そうに {話|はな}す', answers: V('{楽|たの}しそうに{話|はな}す') },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**～そう chỉ đi với Vます (bỏ ます), イA (bỏ い), ナA** — KHÔNG đi với danh từ. Hai ngoại lệ: **よさそう, なさそう**.',
        '**Hai nghĩa theo loại từ**: tính từ → "trông có vẻ" (chưa thử); động từ → "sắp…" (thấy dấu hiệu).',
        '**Hai そう**: {降|ふ}り**そう** (mình thấy) ≠ {降|ふ}る**そう** (mình nghe). Có {今|いま}にも, có な／に sau そう → luôn là "trông có vẻ".',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 1)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{窓|まど}の{外|そと}を{見|み}てください。{天気|てんき}はどうですか。', ro: 'Mado no soto o mite kudasai. Tenki wa dou desu ka.', vi: 'Các em nhìn ra cửa sổ. Thời tiết thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{雲|くも}が{多|おお}くて、{雨|あめ}が{降|ふ}りそうです。', ro: 'Kumo ga ookute, ame ga furisou desu.', vi: 'Nhiều mây, trời có vẻ sắp mưa ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{今朝|けさ}の{天気予報|てんきよほう}は{何|なん}と{言|い}っていましたか。', ro: 'Kesa no tenki yohou wa nan to itte imashita ka.', vi: 'Dự báo thời tiết sáng nay nói gì?' },
        { who: 'Bạn', role: 'candidate', text: '{天気予報|てんきよほう}では、{午後|ごご}から{雨|あめ}が{降|ふ}るそうです。', ro: 'Tenki yohou de wa, gogo kara ame ga furu sou desu.', vi: 'Dự báo nói từ chiều trời mưa ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'このケーキの{写真|しゃしん}を{見|み}てください。どうですか。', ro: 'Kono keeki no shashin o mite kudasai. Dou desu ka.', vi: 'Các em xem ảnh cái bánh này. Thế nào?' },
        { who: 'Bạn', role: 'candidate', text: 'とてもおいしそうです。でも、ちょっと{甘|あま}そうです。', ro: 'Totemo oishisou desu. Demo, chotto amasou desu.', vi: 'Trông rất ngon ạ. Nhưng có vẻ hơi ngọt.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「{先生|せんせい}は{元気|げんき}そうです」と「{先生|せんせい}は{元気|げんき}だそうです」は、どう{違|ちが}いますか。', ro: '"Sensei wa genkisou desu" to "Sensei wa genki da sou desu" wa, dou chigaimasu ka.', vi: '"Thầy trông khoẻ" và "Nghe nói thầy khoẻ" khác nhau thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '「{元気|げんき}そう」は{自分|じぶん}で{見|み}て{思|おも}ったことで、「{元気|げんき}だそう」は{人|ひと}から{聞|き}いたことです。', ro: '"Genkisou" wa jibun de mite omotta koto de, "genki da sou" wa hito kara kiita koto desu.', vi: '"Genkisou" là điều mình tự nhìn mà nghĩ ra, còn "genki da sou" là điều nghe từ người khác ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{隣|となり}の{人|ひと}を{見|み}てください。{今|いま}どんな{様子|ようす}ですか。', ro: 'Tonari no hito o mite kudasai. Ima donna yousu desu ka.', vi: 'Hãy nhìn bạn bên cạnh. Bây giờ bạn ấy trông thế nào?' },
        { who: 'Bạn', role: 'candidate', text: 'ちょっと{眠|ねむ}そうです。でも、{楽|たの}しそうに{話|はな}しています。', ro: 'Chotto nemusou desu. Demo, tanoshisou ni hanashite imasu.', vi: 'Bạn ấy trông hơi buồn ngủ ạ. Nhưng đang nói chuyện rất vui vẻ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b20-b1-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: 'あ、{空|そら}が{暗|くら}い。{雨|あめ}が（　）。', options: ['{降|ふ}るそう', '{降|ふ}りそう', '{降|ふ}ったそう', '{降|ふ}ってそう'], correct: 1, why: 'Mình thấy trời tối → sắp mưa: **{降|ふ}りそう**. 〔Ame ga furisou.〕' },
        { q: 'このかばん、{軽|かる}くて（　）ね。', options: ['いいそう', 'よさそう', 'よそう', 'いそう'], correct: 1, why: 'いい → **よさそう**. 〔Karukute yosasou da ne.〕' },
        { q: '（　）ケーキですね。', options: ['おいしいそうな', 'おいしそうな', 'おいしそうに', 'おいしいそうに'], correct: 1, why: 'Trước danh từ: **おいしそうな** ケーキ. 〔Oishisou na keeki desu ne.〕' },
        { q: '{山田|やまだ}さんは（　）{笑|わら}っています。', options: ['{嬉|うれ}しそうな', '{嬉|うれ}しそうに', '{嬉|うれ}しいそうに', '{嬉|うれ}しくそう'], correct: 1, why: 'Trước động từ: **{嬉|うれ}しそうに** {笑|わら}う. 〔Ureshisou ni waratte imasu.〕' },
        { q: '{天気予報|てんきよほう}によると、{明日|あした}は（　）そうです。', options: ['{晴|は}れ', '{晴|は}れる', '{晴|は}れて', '{晴|は}れた'], correct: 1, why: 'Có nguồn tin → nghe nói, thể thường: **{晴|は}れるそうです**. 〔Ashita wa hareru sou desu.〕' },
      ],
    },
  ],
};

const BUOI_2: Lesson = {
  id: 'b20-buoi-2-you-rashii',
  kind: 'review',
  title: 'Buổi 2 — Tin đồn ở ký túc xá: từ mới tin tức & quan hệ · ～ようだ・～みたい · ～らしい · hội thoại ②',
  goal: 'Theo nhịp một buổi trên lớp: ôn ～そう, học từ tin đồn – tin tức và từ quan hệ – người yêu, đoán từ dấu hiệu mình thấy bằng ～ようだ (ナA な・N の) và ～みたい (văn nói, ナA・N trần), so sánh bằng まるで～ようだ và nêu ví dụ bằng N のような N, truyền tin đồn bằng ～らしい, phân biệt ba mẫu そうです／らしい／ようだ, đóng vai hội thoại ② (tin đồn thầy 本田), rồi trả lời được câu giáo viên hay gọi.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 2 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Khởi động (5′)** — ôn ～そう: giáo viên giơ ảnh, cả lớp nói nhanh おいしそう／{眠|ねむ}そう／{降|ふ}りそう. Rồi một câu hỏi mới: "Đèn phòng bạn tắt, gõ cửa không ai thưa — nói thế nào?"',
        '**Từ mới (10′)** — nhóm A (うわさ, うそ, {秘密|ひみつ}, {情報|じょうほう}, {話題|わだい}, {発表|はっぴょう}, {伝|つた}える, {信|しん}じる, {驚|おどろ}く, {実|じつ}は, まさか, {確|たし}か) + nhóm B ({付|つ}き{合|あ}う, {彼|かれ}, {彼女|かのじょ}, {彼氏|かれし}, {相手|あいて}, {指輪|ゆびわ}, {独身|どくしん}, {仲|なか}がいい, けんか, {幸|しあわ}せ).',
        '**Ngữ pháp (15′)** — ～ようだ／～みたい (suy từ dấu hiệu, so sánh まるで～ようだ, N のような N) · ～らしい (tin đồn) · bảng ba mẫu そうです／らしい／ようだ.',
        '**Hội thoại (10′)** — ② tin đồn thầy 本田 sắp cưới — và ②′ sự thật.',
        '**チャレンジ (10′)** — trò "truyền tin" (伝言ゲーム): A nói một tin, B truyền lại cho C bằng ～らしい, C kiểm chứng. Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b20-b2-slides',
      title: 'Bài 20 うわさ — Buổi 2: ～ようだ・～みたい・～らしい',
      slides: [
        {
          tieuDe: 'Ôn Buổi 1 — ～そう',
          anh: ['shortcake', 'sleepy-face', 'cloud-with-rain'],
          nhan: ['おいしそう', '{眠|ねむ}そう', '{降|ふ}りそう'],
          dong: ['このケーキ、おいしそう！', '{今|いま}にも{雨|あめ}が{降|ふ}りそうです。'],
          ro: ['Kono keeki, oishisou!', 'Ima ni mo ame ga furisou desu.'],
          hoi: '「いい」 + そう = ? · 「{学生|がくせい}」 + そう = ?',
          dap: 'よさそう · ✗ (danh từ không đi với そう → {学生|がくせい}みたい — học hôm nay).',
          ghi: 'Hôm nay học hai mẫu đoán khác: ようだ／みたい (đoán từ dấu hiệu mình thấy) và らしい (đoán theo tin nghe được).',
        },
        {
          tieuDe: '{新|あたら}しいことば ① — Tin đồn & tin tức',
          anh: ['speech-balloon', 'lying-face', 'shushing-face', 'newspaper'],
          nhan: ['うわさ', 'うそ', '{秘密|ひみつ}', '{情報|じょうほう}'],
          dong: ['うわさを{聞|き}きました。', 'うそをつかないでください。', 'これは{秘密|ひみつ}ですよ。'],
          ro: ['Uwasa o kikimashita.', 'Uso o tsukanaide kudasai.', 'Kore wa himitsu desu yo.'],
          hoi: '"Nói dối" — うそを{言|い}う hay うそをつく?',
          dap: 'うそをつく — cụm chuẩn đi với つく (うそを{言|い}う chỉ thỉnh thoảng nghe trong văn nói).',
          ghi: 'Thêm: {話題|わだい}になる (thành chuyện bàn tán), {発表|はっぴょう}する (công bố chính thức), {伝|つた}える (nhắn lại), {信|しん}じる (tin), {驚|おどろ}く (ngạc nhiên), {実|じつ}は (thật ra), まさか (không lẽ!), {確|たし}か (hình như là).',
        },
        {
          tieuDe: '{新|あたら}しいことば ② — Người yêu & các mối quan hệ',
          anh: ['two-hearts', 'ring', 'face-with-steam-from-nose', 'smiling-face-with-hearts'],
          nhan: ['{付|つ}き{合|あ}う', '{指輪|ゆびわ}', 'けんか', '{幸|しあわ}せ'],
          dong: ['{彼女|かのじょ}ができました。', 'あの{二人|ふたり}は{仲|なか}がいいです。'],
          ro: ['Kanojo ga dekimashita.', 'Ano futari wa naka ga ii desu.'],
          hoi: 'Có nên gọi thầy giáo là 「{彼|かれ}」 khi thầy đứng trước mặt không?',
          dap: 'Không. Gọi bằng tên + {先生|せんせい}／さん. {彼|かれ}／{彼女|かのじょ} dùng khi kể chuyện, và còn nghĩa "bạn trai / bạn gái".',
          ghi: 'Thêm: {彼氏|かれし} (bạn trai), {相手|あいて} (người kia; {結婚|けっこん}の{相手|あいて}), {独身|どくしん} (độc thân), {指輪|ゆびわ}をする (đeo nhẫn).',
        },
        {
          tieuDe: '② ～ようだ — đoán từ dấu hiệu mình thấy',
          anh: ['house', 'locked', 'crescent-moon'],
          nhan: ['{電気|でんき}が{消|き}えている', '{鍵|かぎ}がかかっている', '{夜|よる}'],
          dong: ['{電気|でんき}が{消|き}えていますね。', '{山口|やまぐち}さんは{留守|るす}のようです。'],
          ro: ['Denki ga kiete imasu ne.', 'Yamaguchi-san wa rusu no you desu.'],
          hoi: 'Vì sao người nói biết chị Yamaguchi không có nhà?',
          dap: 'Vì CHÍNH MÌNH thấy dấu hiệu: đèn tắt, gõ cửa không ai thưa. Nhưng chưa chắc 100% → ようです.',
          ghi: 'ようだ = kết luận từ những gì mình thấy, nghe, ngửi, cảm nhận. Lịch sự / văn viết: ～ようです.',
        },
        {
          tieuDe: 'Nối ～ようだ — "như danh từ"',
          bang: {
            head: ['Loại', '～ようだ'],
            rows: [
              ['V', '{降|ふ}っている**ようだ** · {寝|ね}た**ようだ**'],
              ['イA', '{寒|さむ}い**ようだ**'],
              ['ナA', '{暇|ひま}**な**ようだ'],
              ['N', '{留守|るす}**の**ようだ'],
            ],
          },
          hoi: '「{静|しず}か」 + ようです = ?',
          dap: '{静|しず}かなようです (ナA giữ な).',
          ghi: 'Mẹo: ようだ nối giống như đứng trước danh từ — {静|しず}か**な**{町|まち}, {留守|るす}**の**{家|いえ}.',
        },
        {
          tieuDe: '～みたい — văn nói của ようだ',
          anh: ['purse', 'house', 'face-with-open-mouth'],
          nhan: ['{財布|さいふ}', '{家|いえ}', 'あれ？'],
          dong: ['あれ、{財布|さいふ}がない。{家|いえ}に{忘|わす}れてきたみたい。', '{店長|てんちょう}、{今日|きょう}は{機嫌|きげん}がいいみたいだね。'],
          ro: ['Are, saifu ga nai. Ie ni wasurete kita mitai.', 'Tenchou, kyou wa kigen ga ii mitai da ne.'],
          hoi: '「{暇|ひま}」 và 「{休|やす}み」 + みたい = ?',
          dap: '{暇|ひま}みたい · {休|やす}みみたい — KHÔNG thêm な／の.',
          ghi: 'みたい nghĩa y hệt ようだ nhưng là văn nói với bạn bè. Viết bài, nói với người trên trong công việc → ようです.',
        },
        {
          tieuDe: '～そう ↔ ～ようだ — khác ở đâu?',
          bang: {
            head: ['Bạn thấy…', 'Câu'],
            rows: [
              ['bánh trong tủ kính', 'おいし**そう**です。 (vẻ ngoài)'],
              ['khách xếp hàng dài trước tiệm', 'おいしい**よう**です。 (dấu hiệu)'],
              ['mây đen kéo đến', '{降|ふ}り**そう**です。 (sắp)'],
              ['người vào đều cầm ô ướt', '{降|ふ}っている**よう**です。 (đang)'],
            ],
          },
          hoi: 'Đường ướt, mái nhà còn nhỏ giọt. Câu nào đúng: {雨|あめ}が{降|ふ}ったようです／{雨|あめ}が{降|ふ}りそうです?',
          dap: '{雨|あめ}が{降|ふ}ったようです — việc ĐÃ xảy ra, đoán từ dấu hiệu. そう (sắp) không dùng cho việc đã qua.',
          ghi: 'そう: đoán NGAY theo vẻ ngoài, thường về điều sắp tới / chưa thử. ようだ: kết luận sau khi quan sát, được cả với việc đã xảy ra.',
        },
        {
          tieuDe: 'まるで ～ようだ — so sánh "cứ như là"',
          anh: ['hotel', 'cherry-blossom', 'sparkles'],
          nhan: ['ホテル', '{春|はる}', '{夢|ゆめ}'],
          dong: ['この{部屋|へや}はまるでホテルのようです。', '{今日|きょう}はまるで{春|はる}みたいですね。', '{夢|ゆめ}のような{一日|いちにち}でした。'],
          ro: ['Kono heya wa marude hoteru no you desu.', 'Kyou wa marude haru mitai desu ne.', 'Yume no you na ichinichi deshita.'],
          hoi: 'Có まるで thì ようだ là "đoán" hay "so sánh"?',
          dap: 'So sánh — người nói biết rõ KHÔNG phải (phòng không phải khách sạn), chỉ giống thôi.',
          ghi: 'Trước danh từ: のような／みたいな; trước động từ: のように／みたいに: {子|こ}どものように{泣|な}く.',
        },
        {
          tieuDe: 'N のような N — nêu ví dụ',
          anh: ['tokyo-tower', 'sushi', 'man-teacher'],
          nhan: ['{東京|とうきょう}', 'すし', '{本田先生|ほんだせんせい}'],
          dong: ['{東京|とうきょう}のような{大|おお}きい{町|まち}に{住|す}みたいです。', '{本田先生|ほんだせんせい}のような{先生|せんせい}になりたいです。'],
          ro: ['Toukyou no you na ookii machi ni sumitai desu.', 'Honda-sensei no you na sensei ni naritai desu.'],
          ghi: 'N1 のような N2 = N2 như (kiểu) N1 — N1 là ví dụ tiêu biểu. Văn nói: N1 みたいな N2 (すしみたいな{料理|りょうり}).',
        },
        {
          tieuDe: '③ ～らしい — tin nghe được (tin đồn)',
          anh: ['speech-balloon', 'man-student', 'ring'],
          nhan: ['うわさ', 'マルコ', '{結婚|けっこん}？'],
          dong: ['{本田先生|ほんだせんせい}、{来月|らいげつ}{結婚|けっこん}するらしいよ。', '{隣|となり}のクラスの{人|ひと}が{話|はな}していたんだ。'],
          ro: ['Honda-sensei, raigetsu kekkon suru rashii yo.', 'Tonari no kurasu no hito ga hanashite ita n da.'],
          hoi: 'マルコ có tận mắt thấy thầy cưới không? Vì sao dùng らしい?',
          dap: 'Không. マルコ nghe người lớp bên nói → truyền lại kèm suy đoán, không chịu trách nhiệm: らしい.',
          ghi: 'らしい = "nghe đâu, hình như" — mẫu của TIN ĐỒN. Hay đi với うわさでは, ～の{話|はなし}では, みんなが{言|い}っている.',
        },
        {
          tieuDe: 'Nối ～らしい — ナA, N "trần"',
          bang: {
            head: ['Loại', '～らしい'],
            rows: [
              ['V', '{辞|や}める**らしい** · {辞|や}めた**らしい**'],
              ['イA', '{難|むずか}しい**らしい**'],
              ['ナA', '{有名|ゆうめい}**らしい** (không な, không だ)'],
              ['N', '{秘密|ひみつ}**らしい** (không だ)'],
            ],
          },
          hoi: 'Sửa câu sai: ~~まだ{秘密|ひみつ}だらしいけど~~',
          dap: 'まだ{秘密|ひみつ}らしいけど (N + らしい, bỏ だ).',
          ghi: 'Bốn mẫu "trần" với ナA／N: みたい, らしい, かもしれない (buổi sau). Hai mẫu "như danh từ": ようだ, はず (buổi sau).',
        },
        {
          tieuDe: '⚡ そうです (nghe nói) ・ らしい ・ ようだ',
          bang: {
            head: ['', 'Căn cứ', 'Ví dụ'],
            rows: [
              ['そうです', 'tin nghe — truyền NGUYÊN văn', '{予報|よほう}によると、{雨|あめ}が{降|ふ}る**そうです**。'],
              ['らしい', 'tin nghe — truyền lại + "chắc vậy"', 'うわさでは、{店|みせ}が{閉|し}まる**らしい**。'],
              ['ようだ', 'điều CHÍNH MÌNH thấy', '{道|みち}が{濡|ぬ}れている。{雨|あめ}が{降|ふ}った**ようだ**。'],
            ],
          },
          hoi: 'Bạn tự nếm canh, thấy hơi nhạt. Câu nào đúng: {塩|しお}が{足|た}りないらしい／{塩|しお}が{足|た}りないようだ?',
          dap: '{塩|しお}が{足|た}りないようだ — căn cứ là chính lưỡi mình nếm. らしい là "nghe ai nói vậy".',
          ghi: 'Mẹo: hỏi "ai là nguồn?" — mình → ようだ／みたい; người khác (nguyên văn) → そうです; người khác (tin đồn, mơ hồ) → らしい.',
        },
        {
          tieuDe: 'Biết thêm — N らしい "đúng chất, ra dáng"',
          anh: ['cherry-blossom', 'man-student'],
          nhan: ['{春|はる}らしい', '{学生|がくせい}らしい'],
          dong: ['{今日|きょう}は{春|はる}らしい{天気|てんき}ですね。', 'あなたらしいですね！'],
          ro: ['Kyou wa haru rashii tenki desu ne.', 'Anata rashii desu ne!'],
          ghi: 'N らしい còn là tính từ い: "đúng kiểu N" — {春|はる}らしい (đúng kiểu mùa xuân), {男|おとこ}らしい (nam tính). Đề N4 chủ yếu hỏi らしい "nghe đâu"; nghĩa này học kỹ ở N3. Nhận ra bằng らしい + N hoặc らしくない.',
        },
        {
          tieuDe: '{会話|かいわ}② — {寮|りょう}のうわさ',
          anh: ['man-student', 'woman-student', 'woman-student', 'ring'],
          nhan: ['マルコ', 'リン', 'アンナ', '{指輪|ゆびわ}'],
          dong: ['{先生|せんせい}、{結婚|けっこん}するらしいよ。', '{指輪|ゆびわ}をしていたみたい。', 'その{人|ひと}が{相手|あいて}かもしれないね。'],
          ro: ['Sensei, kekkon suru rashii yo.', 'Yubiwa o shite ita mitai.', 'Sono hito ga aite kamoshirenai ne.'],
          hoi: 'Trong ②′, sự thật là gì? Tin đồn đúng mấy phần?',
          dap: 'Người cưới là EM GÁI thầy; người phụ nữ ở ga là em gái; "nhẫn" là đồng hồ. Tin đồn chỉ đúng một nửa (có đám cưới, nhưng không phải của thầy).',
          ghi: 'Đọc to hội thoại ② theo nhóm ba (マルコ, リン, アンナ), rồi ②′ có thêm thầy 本田. Gạch chân らしい (tin nghe), みたい／そう (mình thấy), かもしれない, はず.',
        },
        {
          tieuDe: 'チャレンジ — 伝言ゲーム (trò truyền tin)',
          anh: ['ear', 'speaking-head', 'check-mark-button'],
          nhan: ['A {聞|き}く', 'B {伝|つた}える', 'C {確認|かくにん}'],
          dong: ['A：{来週|らいしゅう}、テストがあります。', 'B：{来週|らいしゅう}、テストがあるらしいよ。', 'C：{本当|ほんとう}？{先生|せんせい}に{確認|かくにん}してみる。'],
          ro: ['A: Raishuu, tesuto ga arimasu.', 'B: Raishuu, tesuto ga aru rashii yo.', 'C: Hontou? Sensei ni kakunin shite miru.'],
          hoi: 'Nếu B nghe trực tiếp từ thầy, truyền lại nguyên văn thì dùng mẫu nào?',
          dap: '{先生|せんせい}の{話|はなし}では、{来週|らいしゅう}テストがあるそうです (そうです — nguồn rõ, nguyên văn).',
          ghi: 'Nhóm 3 người, 5 phút, đổi vai. Giáo viên phát phiếu tin (có tin thật, có tin bịa). C phải quyết: tin hay đi kiểm chứng.',
        },
        {
          tieuDe: 'まとめ — Buổi 2',
          bang: {
            head: ['Mẫu', 'Căn cứ', 'ナA／N'],
            rows: [
              ['～ようだ', 'mình thấy / cảm nhận', '{暇|ひま}**な** · {留守|るす}**の**'],
              ['～みたい', '= ようだ (văn nói)', '{暇|ひま} · {留守|るす} (trần)'],
              ['～らしい', 'tin nghe được', '{有名|ゆうめい} · {秘密|ひみつ} (trần)'],
              ['まるで～ようだ', 'so sánh', '{夢|ゆめ}**の**よう'],
            ],
          },
          ghi: 'Bài về nhà: viết 3 câu ～ようです về điều bạn quan sát ở ký túc xá / nhà, và 2 câu ～らしいです về một tin bạn nghe được tuần này. Buổi sau: ～かもしれない・～はず.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Khởi động: căn phòng tắt đèn' },
    {
      t: 'p',
      text: 'Giáo viên vẽ lên bảng một cánh cửa, ô cửa sổ tô đen, bên cạnh ghi 「ノック → {返事|へんじ}なし」. Hỏi: "Phòng chị Yamaguchi tắt đèn, gõ cửa không ai thưa. Chị ấy ở nhà không?" Cả lớp: "Chắc là không." — "Nhưng mình KHÔNG CHẮC 100%, mình chỉ đoán từ điều mình thấy. Câu sẽ là: **{山口|やまぐち}さんは{留守|るす}のようです**."',
    },
    {
      t: 'mcq',
      id: 'b20-b2-khoi-dong',
      title: 'Khởi động — ôn ～そう và thể thường (4 câu)',
      items: [
        { q: '{子|こ}どもたちが（　）{遊|あそ}んでいます。', options: ['{楽|たの}しそうな', '{楽|たの}しそうに', '{楽|たの}しいそうに', '{楽|たの}しそう'], correct: 1, why: 'Trước động từ → **{楽|たの}しそうに** (Buổi 1). 〔Tanoshisou ni asonde imasu.〕' },
        { q: '「{留守|るす}です」の{普通形|ふつうけい}（{現在|げんざい}）は？', options: ['{留守|るす}だ', '{留守|るす}の', '{留守|るす}な', '{留守|るす}で'], correct: 0, why: 'N + です → thể thường **{留守|るす}だ**. Nhưng trước ようだ thì đổi だ → **の**: {留守|るす}のようだ.' },
        { q: '「{有名|ゆうめい}です」の{普通形|ふつうけい}（{過去|かこ}）は？', options: ['{有名|ゆうめい}だった', '{有名|ゆうめい}でした', '{有名|ゆうめい}かった', '{有名|ゆうめい}なかった'], correct: 0, why: 'ナA quá khứ thể thường → **{有名|ゆうめい}だった** → {有名|ゆうめい}だったらしい／{有名|ゆうめい}だったようだ.' },
        { q: 'このかばんは（　）ね。', options: ['{高|たか}そうだ', '{高|たか}いそうだ', '{高|たか}そうな', '{高|たか}くそうだ'], correct: 0, why: 'Trông đắt → **{高|たか}そう**だね. 〔Kono kaban wa takasou da ne.〕' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Từ mới: bảng tin đồn của ký túc xá' },
    {
      t: 'table',
      caption: 'Giáo viên dán "bảng tin đồn" (うわさボード) của ký túc xá — mỗi dòng là một từ mới',
      head: ['Trên bảng', 'Đọc', 'Nghĩa'],
      rows: [
        ['「{先生|せんせい}が{結婚|けっこん}する」という**うわさ** — **{秘密|ひみつ}**らしい', 'uwasa · himitsu', 'tin đồn · bí mật'],
        ['{駅|えき}で{女|おんな}の{人|ひと}と{一緒|いっしょ}だった → **{結婚|けっこん}の{相手|あいて}**？', 'kekkon no aite', 'người sẽ cưới'],
        ['**{指輪|ゆびわ}**をしていた？（よく{見|み}えなかった）', 'yubiwa', 'nhẫn'],
        ['{前|まえ}は「{僕|ぼく}は**{独身|どくしん}**です」と{言|い}っていた', 'dokushin', 'độc thân'],
        ['**{確|たし}か**、{妹|いもうと}さんがいる', 'tashika', 'hình như là (nhớ không chắc)'],
        ['**{実|じつ}は**……{結婚|けっこん}するのは{妹|いもうと}さん！ → みんな**{驚|おどろ}いた**', 'jitsu wa · odoroita', 'thật ra · ngạc nhiên'],
        ['**{教訓|きょうくん}**：うわさをすぐ**{信|しん}じない**で、{本人|ほんにん}に**{確認|かくにん}**する', 'shinjinai · kakunin', 'đừng tin ngay · xác nhận'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{実|じつ}は、{私|わたし}も{同|おな}じうわさを{聞|き}いたんです。', 'Jitsu wa, watashi mo onaji uwasa o kiita n desu.', 'Thật ra tôi cũng nghe cùng tin đồn đó.'),
        E('「{先生|せんせい}が{結婚|けっこん}？」「まさか！」', '"Sensei ga kekkon?" "Masaka!"', '"Thầy cưới á?" "Không thể nào!"'),
        E('{彼|かれ}はうそをつく{人|ひと}じゃありません。', 'Kare wa uso o tsuku hito ja arimasen.', 'Anh ấy không phải người nói dối.'),
        E('あの{二人|ふたり}は{子|こ}どものころから{仲|なか}がいいです。', 'Ano futari wa kodomo no koro kara naka ga ii desu.', 'Hai người đó thân nhau từ nhỏ.'),
      ],
    },
    { t: 'h', text: 'Slide 3 — ～ようだ／～みたい／～らしい: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b20-b2-noi',
      title: 'Luyện nhanh — nối đúng (10 câu)',
      kind: 'fill',
      items: [
        { q: '{留守|るす} → ～ようです', answers: V('{留守|るす}のようです') },
        { q: '{静|しず}か → ～ようです', answers: V('{静|しず}かなようです') },
        { q: '{寒|さむ}い → ～ようです', answers: V('{寒|さむ}いようです') },
        { q: '{雨|あめ}が{降|ふ}った → ～ようです', answers: V('{雨|あめ}が{降|ふ}ったようです') },
        { q: '{休|やす}み → ～みたい', answers: V('{休|やす}みみたい') },
        { q: '{暇|ひま} → ～みたい', answers: V('{暇|ひま}みたい') },
        { q: '{秘密|ひみつ} → ～らしい', answers: V('{秘密|ひみつ}らしい') },
        { q: '{有名|ゆうめい} → ～らしい', answers: V('{有名|ゆうめい}らしい') },
        { q: '{辞|や}める → ～らしい', answers: V('{辞|や}めるらしい') },
        { q: '{夢|ゆめ} → まるで ～ようです', answers: V('まるで{夢|ゆめ}のようです') },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**Hỏi "ai là nguồn?"** — chính mình thấy / cảm nhận → **ようだ／みたい**; người khác nói, mơ hồ, tin đồn → **らしい**; người khác nói, nguồn rõ, nguyên văn → **そうです**.',
        '**Nối**: ようだ như danh từ (**な／の**); みたい, らしい **trần** (không な／の／だ).',
        '**みたい = văn nói** — viết bài, nói với người trên → ようです. **まるで～ようだ** = so sánh, không phải đoán.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 2)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{教室|きょうしつ}の{外|そと}が{静|しず}かですね。{隣|となり}の{教室|きょうしつ}はどうですか。', ro: 'Kyoushitsu no soto ga shizuka desu ne. Tonari no kyoushitsu wa dou desu ka.', vi: 'Bên ngoài lớp yên tĩnh nhỉ. Lớp bên cạnh thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{誰|だれ}もいないようです。{電気|でんき}も{消|き}えていますから。', ro: 'Dare mo inai you desu. Denki mo kiete imasu kara.', vi: 'Hình như không có ai ạ. Vì đèn cũng tắt.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{最近|さいきん}、{何|なに}かうわさを{聞|き}きましたか。', ro: 'Saikin, nani ka uwasa o kikimashita ka.', vi: 'Gần đây em có nghe tin đồn gì không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい。{駅前|えきまえ}に{新|あたら}しいカレー{屋|や}ができるらしいです。', ro: 'Hai. Ekimae ni atarashii karee-ya ga dekiru rashii desu.', vi: 'Có ạ. Nghe đâu trước ga sắp mở quán cà ri mới.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'それは{誰|だれ}から{聞|き}きましたか。{本当|ほんとう}ですか。', ro: 'Sore wa dare kara kikimashita ka. Hontou desu ka.', vi: 'Em nghe từ ai? Có thật không?' },
        { who: 'Bạn', role: 'candidate', text: 'アルバイトの{友達|ともだち}から{聞|き}きました。まだ{確認|かくにん}していないので、{本当|ほんとう}じゃないかもしれません。', ro: 'Arubaito no tomodachi kara kikimashita. Mada kakunin shite inai node, hontou ja nai kamoshiremasen.', vi: 'Em nghe từ bạn làm thêm. Em chưa kiểm chứng nên có khi không phải thật ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'あなたの{町|まち}はどんな{町|まち}ですか。「～のような」を{使|つか}って{言|い}ってください。', ro: 'Anata no machi wa donna machi desu ka. "~ no you na" o tsukatte itte kudasai.', vi: 'Thành phố của em là thành phố thế nào? Hãy nói bằng "～のような".' },
        { who: 'Bạn', role: 'candidate', text: '{私|わたし}の{町|まち}は、{京都|きょうと}のような{古|ふる}いお{寺|てら}がたくさんある{町|まち}です。', ro: 'Watashi no machi wa, Kyouto no you na furui otera ga takusan aru machi desu.', vi: 'Thành phố của em là nơi có nhiều chùa cổ giống như ở Kyoto ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「{部長|ぶちょう}は{会議中|かいぎちゅう}みたいです」— {会社|かいしゃ}で{使|つか}ってもいいですか。', ro: '"Buchou wa kaigichuu mitai desu" — kaisha de tsukatte mo ii desu ka.', vi: '"Trưởng phòng hình như đang họp (みたい)" — dùng ở công ty có được không?' },
        { who: 'Bạn', role: 'candidate', text: '{会社|かいしゃ}では「{会議中|かいぎちゅう}のようです」のほうがいいです。「みたい」は{友達|ともだち}と{話|はな}すときに{使|つか}います。', ro: 'Kaisha de wa "kaigichuu no you desu" no hou ga ii desu. "Mitai" wa tomodachi to hanasu toki ni tsukaimasu.', vi: 'Ở công ty nên nói "会議中のようです" ạ. "みたい" dùng khi nói với bạn bè.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b20-b2-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: '{電気|でんき}が{消|き}えています。{山口|やまぐち}さんは{留守|るす}（　）です。', options: ['よう', 'のよう', 'なよう', 'らしい'], correct: 1, why: 'N + **の** + ようです. 〔Rusu no you desu.〕' },
        { q: 'あの{店|みせ}、{今日|きょう}は{休|やす}み（　）。シャッターが{閉|し}まってる。', options: ['みたい', 'のみたい', 'なみたい', 'だみたい'], correct: 0, why: 'N + **みたい** (trần). 〔Kyou wa yasumi mitai.〕' },
        { q: 'うわさでは、あの{歌手|かしゅ}は{来年|らいねん}{引退|いんたい}する（　）。', options: ['そうだ（様態）', 'らしい', 'ような', 'みたいな'], correct: 1, why: '**うわさでは** → **らしい**. 〔Rainen intai suru rashii.〕' },
        { q: '{今日|きょう}は{暖|あたた}かくて、まるで{春|はる}（　）。', options: ['のようです', 'らしいです', 'そうです', 'なようです'], correct: 0, why: '**まるで** + N **のようです** (so sánh). 〔Marude haru no you desu.〕' },
        { q: '（{自分|じぶん}でスープを{飲|の}んで）ちょっと{塩|しお}が{足|た}りない（　）ですね。', options: ['らしい', 'よう', 'そう', 'の'], correct: 1, why: 'Căn cứ là chính mình nếm → **ようです**. らしい = nghe người khác nói. 〔Shio ga tarinai you desu ne.〕' },
      ],
    },
  ],
};

const BUOI_3: Lesson = {
  id: 'b20-buoi-3-kamo-hazu',
  kind: 'review',
  title: 'Buổi 3 — Ở quán ひまわり食堂: từ mới suy đoán & kiểm chứng · ～かもしれない · ～はず (～はずなのに) · tổng kết cả nhóm · hội thoại ③',
  goal: 'Theo nhịp một buổi trên lớp: ôn ～ようだ・～らしい, học từ suy đoán – kiểm chứng (もしかしたら・絶対・まるで・本物・予想・当たる・外れる・確認), nêu khả năng bằng ～かもしれない (もしかしたら, ～のかもしれない), nói điều có căn cứ bằng ～はず (ナA な・N の, ～ないはず, ～はずなのに) và phân biệt với ～つもり, xếp cả nhóm mẫu theo nguồn tin và độ chắc chắn, đóng vai hội thoại ③, rồi kể được 1 phút về một tin đồn.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 3 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Khởi động (5′)** — ôn ～ようだ／～らしい bằng câu hỏi "ai là nguồn?". Rồi giáo viên hỏi: "Tàu 9 giờ chạy, đi mất 1 tiếng. Bạn tôi đến lúc mấy giờ?"',
        '**Từ mới (8′)** — nhóm E (もしかしたら, {絶対|ぜったい}, まるで, {本物|ほんもの}, {予想|よそう}する, {当|あ}たる, {外|はず}れる, {確認|かくにん}する).',
        '**Ngữ pháp (17′)** — ～かもしれない (khả năng, もしかしたら, ～のかもしれない) · ～はず (có căn cứ, ～ないはず, ～はずなのに) · はず ↔ つもり · thang độ chắc chắn · bảng chọn nhanh cả nhóm.',
        '**Hội thoại (10′)** — ③ ở quán ひまわり食堂: rau giao trễ, tin đồn quán cà ri mới trước ga.',
        '**チャレンジ + できる (10′)** — đoán "hộp bí ẩn" bằng đủ các mẫu; kể 1 phút về một tin đồn. Cuối buổi: 6 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b20-b3-slides',
      title: 'Bài 20 うわさ — Buổi 3: ～かもしれない・～はず',
      slides: [
        {
          tieuDe: 'Ôn Buổi 2 — ai là nguồn?',
          anh: ['eyes', 'ear', 'speech-balloon'],
          nhan: ['{自分|じぶん}で{見|み}た', '{聞|き}いた', 'うわさ'],
          dong: ['{誰|だれ}もいないようです。', '{明日|あした}は{雨|あめ}だそうです。', '{店|みせ}が{閉|し}まるらしいです。'],
          ro: ['Dare mo inai you desu.', 'Ashita wa ame da sou desu.', 'Mise ga shimaru rashii desu.'],
          hoi: 'Ba câu trên — câu nào người nói tự thấy?',
          dap: 'Câu 1 (ようです). Câu 2 nghe nguyên văn (そうです), câu 3 tin đồn (らしい).',
          ghi: 'Hôm nay thêm hai mẫu nói về ĐỘ CHẮC: かもしれない (có khi — thấp) và はず (chắc chắn là — cao, có căn cứ).',
        },
        {
          tieuDe: '{新|あたら}しいことば — Suy đoán & kiểm chứng',
          anh: ['crystal-ball', 'bullseye', 'cross-mark', 'check-mark-button'],
          nhan: ['{予想|よそう}する', '{当|あ}たる', '{外|はず}れる', '{確認|かくにん}する'],
          dong: ['{天気予報|てんきよほう}が{当|あ}たりました。', '{予想|よそう}が{外|はず}れました。'],
          ro: ['Tenki yohou ga atarimashita.', 'Yosou ga hazuremashita.'],
          hoi: '{外|はず}れる có liên quan đến mẫu はず không?',
          dap: 'Không! {外|はず}れる là động từ "trật, sai" (viết chữ 外). Mẫu はず (chắc là) là danh từ hình thức — chỉ trùng âm.',
          ghi: 'Thêm: もしかしたら (biết đâu) — đi với かもしれない; {絶対|ぜったい} (tuyệt đối) — KHÔNG đi với かもしれない; まるで (cứ như) — đi với ようだ; {本物|ほんもの} (hàng thật).',
        },
        {
          tieuDe: '④ ～かもしれない — "có khi…"',
          anh: ['automobile', 'hourglass-not-done', 'thinking-face'],
          nhan: ['{渋滞|じゅうたい}', '{時間|じかん}', '？'],
          dong: ['{道|みち}が{混|こ}んでいるから、{遅|おく}れるかもしれません。', 'もしかしたら、{明日|あした}は{雪|ゆき}が{降|ふ}るかもしれません。'],
          ro: ['Michi ga konde iru kara, okureru kamoshiremasen.', 'Moshika shitara, ashita wa yuki ga furu kamoshiremasen.'],
          hoi: 'かもしれない chắc khoảng bao nhiêu phần trăm?',
          dap: 'Khoảng 50% trở xuống — chỉ là một khả năng, không có căn cứ chắc.',
          ghi: 'Trong công việc, かもしれません giúp nói MỀM và cảnh báo trước: {少|すこ}し{遅|おく}れるかもしれません. Văn nói với bạn: ～かも！',
        },
        {
          tieuDe: 'Nối ～かもしれない — ナA, N "trần"',
          bang: {
            head: ['Loại', '～かもしれない'],
            rows: [
              ['V', '{来|こ}ない**かもしれない** · {寝|ね}た**かもしれない**'],
              ['イA', '{高|たか}い**かもしれない**'],
              ['ナA', '{暇|ひま}**かもしれない** (không だ)'],
              ['N', '{雨|あめ}**かもしれない** (không だ)'],
            ],
          },
          hoi: 'Sửa câu sai: ~~{明日|あした}は{雨|あめ}だかもしれません~~',
          dap: '{明日|あした}は{雨|あめ}かもしれません.',
          ghi: 'Cùng nhóm "trần" với みたい, らしい. Đoán LÝ DO: ～のかもしれない — {返事|へんじ}が{来|こ}ない → {忙|いそが}しいのかもしれない.',
        },
        {
          tieuDe: '⑤ ～はず — "chắc chắn là" (có căn cứ)',
          anh: ['train', 'alarm-clock', 'station'],
          nhan: ['9:00 {出発|しゅっぱつ}', '1{時間|じかん}', '10:00 {着|つ}く？'],
          dong: ['{九時|くじ}の{電車|でんしゃ}に{乗|の}ったから、{十時|じゅうじ}には{着|つ}くはずです。'],
          ro: ['Kuji no densha ni notta kara, juuji ni wa tsuku hazu desu.'],
          hoi: 'Căn cứ của người nói là gì?',
          dap: 'Giờ tàu chạy (9 giờ) + thời gian đi (1 tiếng) → suy ra 10 giờ tới. Có căn cứ → はず.',
          ghi: 'はず thường đi kèm căn cứ ở vế trước (～から／～ので). Không có căn cứ → dùng かもしれない hoặc たぶん～と{思|おも}う.',
        },
        {
          tieuDe: 'Nối ～はず — "như danh từ"',
          bang: {
            head: ['Loại', '～はず'],
            rows: [
              ['V', '{着|つ}く**はず** · {届|とど}いた**はず** · {来|こ}ない**はず**'],
              ['イA', '{安|やす}い**はず**'],
              ['ナA', '{上手|じょうず}**な**はず'],
              ['N', '{休|やす}み**の**はず'],
            ],
          },
          hoi: '「{今日|きょう}は{日曜日|にちようび}だから、{銀行|ぎんこう}は{休|やす}み＿＿はずです」',
          dap: '{休|やす}み**の**はずです.',
          ghi: 'Giống ようだ: ナA giữ な, N thêm の. Đây là cặp "như danh từ" của bài.',
        },
        {
          tieuDe: '～はずなのに — "lẽ ra… vậy mà"',
          anh: ['leafy-green', 'delivery-truck', 'face-with-raised-eyebrow'],
          nhan: ['{野菜|やさい}', 'まだ{来|こ}ない', 'おかしい……'],
          dong: ['10{時|じ}に{届|とど}くはずなのに、まだ{来|こ}ません。', 'かばんに{入|い}れたはずなのに、{財布|さいふ}がない！'],
          ro: ['Juuji ni todoku hazu na noni, mada kimasen.', 'Kaban ni ireta hazu na noni, saifu ga nai!'],
          hoi: 'はず + のに: nối thế nào? (Bài 19: ナA／N + な + のに)',
          dap: 'はず là danh từ hình thức → はず**な**のに.',
          ghi: 'Căn cứ nói A, thực tế không phải A → ngạc nhiên / bực. Cũng nói: ～はずだったのに (lẽ ra đã…).',
        },
        {
          tieuDe: '⚠ はず ↔ つもり (Bài 16)',
          bang: {
            head: ['', 'Câu', 'Đúng?'],
            rows: [
              ['ý định của mình', '{私|わたし}は{来年|らいねん}{日本|にほん}で{働|はたら}く**つもり**です。', '✓'],
              ['ý định của mình', '~~{私|わたし}は{来年|らいねん}{日本|にほん}で{働|はたら}く**はず**です。~~', '✗'],
              ['suy về người khác', '{兄|あに}は{来年|らいねん}{日本|にほん}で{働|はたら}く**はず**です。({兄|あに}がそう{言|い}っていた)', '✓'],
            ],
          },
          hoi: 'Vì sao không nói 「{私|わたし}は{行|い}くはずです」 về kế hoạch của mình?',
          dap: 'Ý định của mình thì mình biết rõ → nói つもり／{予定|よてい}. はず là SUY ĐOÁN từ căn cứ — nghe như đang nói về người khác.',
          ghi: 'Phủ định: ～ないはずだ (chắc là không). ～はずがない ("không lẽ nào") là mẫu khác — Bài 31.',
        },
        {
          tieuDe: 'Thang độ chắc chắn',
          bang: {
            head: ['%', 'Mẫu'],
            rows: [
              ['~30–50', '(もしかしたら) ～**かもしれない**'],
              ['~60–70', 'たぶん ～**でしょう**／～**と{思|おも}う**'],
              ['~80–90', '～**はずだ** (có căn cứ)'],
              ['100', 'nói thẳng · **{絶対|ぜったい}**'],
            ],
          },
          hoi: 'Ghép đúng: もしかしたら／{絶対|ぜったい}／たぶん với ～かもしれない／～でしょう／câu khẳng định.',
          dap: 'もしかしたら ～かもしれない · たぶん ～でしょう · {絶対|ぜったい} + câu khẳng định (～ます／～ない).',
          ghi: 'Đề N4 hay gài: ~~{絶対|ぜったい}{来|く}るかもしれない~~ (mâu thuẫn).',
        },
        {
          tieuDe: '⭐ Cả nhóm — năm cách nói về một chuyện',
          bang: {
            head: ['Biết vì…', 'Câu'],
            rows: [
              ['nhìn mặt thầy', '{先生|せんせい}は{嬉|うれ}し**そう**です。'],
              ['thầy nói, mình kể lại', '{妹|いもうと}さんが{結婚|けっこん}する**そう**です。'],
              ['tin đồn', '{先生|せんせい}が{結婚|けっこん}する**らしい**です。'],
              ['tự quan sát (nhẫn…)', '{先生|せんせい}は{結婚|けっこん}した**よう**です。'],
              ['đoán bừa', '{先生|せんせい}は{結婚|けっこん}する**かもしれません**。'],
              ['có căn cứ', '{先生|せんせい}は{来年|らいねん}{結婚|けっこん}する**はず**です。'],
            ],
          },
          ghi: 'Đọc to cả bảng 2 lần. Giáo viên đọc một câu bất kỳ, cả lớp nói "nguồn" của nó: 見た／聞いた／うわさ／観察／{分|わ}からない／{根拠|こんきょ}がある.',
        },
        {
          tieuDe: '{会話|かいわ}③ — ひまわり{食堂|しょくどう}',
          anh: ['man-cook', 'man-student', 'delivery-truck', 'curry-rice'],
          nhan: ['{店長|てんちょう}', 'ナタポン', '{八百屋|やおや}', 'カレー{屋|や}？'],
          dong: ['10{時|じ}に{届|とど}くはずなんですが……。', '{道|みち}が{混|こ}んでいるのかもしれません。', '{駅前|えきまえ}に{新|あたら}しいカレー{屋|や}ができるらしいですよ。'],
          ro: ['Juuji ni todoku hazu na n desu ga…….', 'Michi ga konde iru no kamoshiremasen.', 'Ekimae ni atarashii karee-ya ga dekiru rashii desu yo.'],
          hoi: 'Câu 「11{時|じ}までには{着|つ}くはずだそうです」 có mấy mẫu chồng lên nhau?',
          dap: 'Hai: はずだ (lời người cửa hàng rau — có căn cứ) + そうです (ナタポン truyền lại cho anh 小林).',
          ghi: 'Đóng vai ba người: 小林店長, ナタポン, 八百屋の人. Đổi vai một lần.',
        },
        {
          tieuDe: 'チャレンジ — hộp bí ẩn',
          anh: ['package', 'ear', 'nose', 'thinking-face'],
          nhan: ['{箱|はこ}', '{音|おと}', 'におい', '？'],
          dong: ['{重|おも}そうです。', '{中|なか}に{何|なに}か{固|かた}い{物|もの}が{入|はい}っているようです。', 'もしかしたら、{本|ほん}かもしれません。'],
          ro: ['Omosou desu.', 'Naka ni nani ka katai mono ga haitte iru you desu.', 'Moshika shitara, hon kamoshiremasen.'],
          hoi: 'Hộp có ghi "từ hiệu sách gửi tới". Bây giờ nói bằng mẫu nào?',
          dap: '{本屋|ほんや}から{来|き}たから、{本|ほん}のはずです (có căn cứ → はず).',
          ghi: 'Giáo viên đưa một hộp kín cho từng nhóm: nhìn (～そう), lắc nghe (～ようだ), đọc nhãn (～はず), đoán bừa (～かもしれない). Nhóm nói đủ 4 mẫu được điểm cộng.',
        },
        {
          tieuDe: 'できる！ — kể 1 phút về một tin đồn',
          anh: ['speech-balloon', 'eyes', 'check-mark-button', 'light-bulb'],
          nhan: ['① {聞|き}いた', '② {思|おも}った', '③ {本当|ほんとう}は', '④ {意見|いけん}'],
          dong: ['「～らしい」といううわさを{聞|き}きました。', '～かもしれないと{思|おも}いました。', '{実|じつ}は～。', 'すぐに{信|しん}じないほうがいいと{思|おも}います。'],
          ro: ['"~rashii" to iu uwasa o kikimashita.', '~kamoshirenai to omoimashita.', 'Jitsu wa ~.', 'Sugu ni shinjinai hou ga ii to omoimasu.'],
          ghi: 'Bốn câu chốt là đủ khung. Mỗi câu thêm 1 chi tiết (khi nào, ai nói, mình đã làm gì) là đủ 1 phút. Bài mẫu ở mục Luyện nói.',
        },
        {
          tieuDe: 'まとめ — Bài 20',
          bang: {
            head: ['Mẫu', 'Căn cứ', 'ナA', 'N'],
            rows: [
              ['～そう', 'vẻ ngoài', '{元気|げんき}そう', '✗'],
              ['～そうだ', 'nghe nguyên văn', '{元気|げんき}だそうだ', '{雨|あめ}だそうだ'],
              ['～ようだ', 'mình thấy', '{元気|げんき}なようだ', '{雨|あめ}のようだ'],
              ['～みたい', 'mình thấy (nói)', '{元気|げんき}みたい', '{雨|あめ}みたい'],
              ['～らしい', 'tin đồn', '{元気|げんき}らしい', '{雨|あめ}らしい'],
              ['～かもしれない', 'khả năng', '{元気|げんき}かもしれない', '{雨|あめ}かもしれない'],
              ['～はず', 'căn cứ', '{元気|げんき}なはず', '{雨|あめ}のはず'],
            ],
          },
          ghi: 'Về nhà: làm Bài tập Bài 20 (≥ 85%), rồi làm **Kiểm tra chặng 16–20** — bấm giờ đúng như thi thật. Sai câu nào, bảng cuối bài kiểm tra chỉ đúng bài cần ôn.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Khởi động: bạn tôi đến lúc mấy giờ?' },
    {
      t: 'p',
      text: 'Giáo viên vẽ một đường tàu: ga A → ga B, ghi "9:00 {発|はつ}" và "1{時間|じかん}". Hỏi: "Bạn tôi lên chuyến 9 giờ ở ga A. Bạn ấy đến ga B lúc mấy giờ?" — "10 giờ." — "Các em có THẤY bạn tôi không? Không. Nhưng các em có **căn cứ**: giờ tàu. Nói: **{十時|じゅうじ}に{着|つ}くはずです**." Rồi giáo viên xoá chữ "9:00 {発|はつ}": "Giờ không biết bạn đi chuyến nào… → **{十時|じゅうじ}に{着|つ}くかもしれません**."',
    },
    {
      t: 'mcq',
      id: 'b20-b3-khoi-dong',
      title: 'Khởi động — ôn ～ようだ・～らしい (4 câu)',
      items: [
        { q: '{道|みち}が{濡|ぬ}れています。{夜|よる}、{雨|あめ}が{降|ふ}った（　）。', options: ['ようです', 'そうです（様態）', 'らしくて', 'のようです'], correct: 0, why: 'Tự thấy đường ướt → kết luận việc đã xảy ra: **{降|ふ}ったようです**. 〔Yoru, ame ga futta you desu.〕' },
        { q: 'みんなの{話|はなし}では、{来週|らいしゅう}テストがある（　）。', options: ['らしい', 'ような', 'そうな', 'みたいな'], correct: 0, why: 'Nguồn là "mọi người nói" (mơ hồ) → **らしい**. 〔Raishuu tesuto ga aru rashii.〕' },
        { q: '{山田|やまだ}さんは{今日|きょう}、{休|やす}み（　）ね。{席|せき}にいないから。', options: ['みたいだ', 'のみたいだ', 'なみたいだ', 'らしいの'], correct: 0, why: 'N + **みたい** (trần). 〔Kyou, yasumi mitai da ne.〕' },
        { q: 'あの{人|ひと}は（　）{日本語|にほんご}を{話|はな}します。', options: ['{日本人|にほんじん}のように', '{日本人|にほんじん}らしいに', '{日本人|にほんじん}そうに', '{日本人|にほんじん}みたいな'], correct: 0, why: 'So sánh trước động từ: **N のように** + V. (みたいに cũng đúng; みたいな chỉ đứng trước danh từ.) 〔Nihonjin no you ni nihongo o hanashimasu.〕' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Từ mới: "phiếu dự đoán" của lớp' },
    {
      t: 'table',
      caption: 'Giáo viên phát "phiếu dự đoán" (予想カード) trước trận bóng của trường — mỗi dòng là một từ mới',
      head: ['Trên phiếu', 'Đọc', 'Nghĩa'],
      rows: [
        ['あなたの**{予想|よそう}**：A{組|ぐみ}が{勝|か}つ／B{組|ぐみ}が{勝|か}つ', 'yosou', 'dự đoán'],
        ['**もしかしたら**、{引|ひ}き{分|わ}けになるかもしれない', 'moshika shitara', 'biết đâu'],
        ['**{絶対|ぜったい}**にA{組|ぐみ}が{勝|か}つ！（A{組|ぐみ}の{人|ひと}）', 'zettai', 'tuyệt đối, nhất định'],
        ['{結果|けっか}：{予想|よそう}が**{当|あ}たった**人 12{人|にん}・**{外|はず}れた**人 18{人|にん}', 'atatta · hazureta', 'đoán đúng · đoán sai'],
        ['MVPの{選手|せんしゅ}はまるで**{本物|ほんもの}**のプロみたいだった', 'honmono', 'thật, xịn'],
        ['{結果|けっか}は{先生|せんせい}が**{確認|かくにん}**してから{発表|はっぴょう}します', 'kakunin', 'xác nhận'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('もしかしたら、{明日|あした}は{休|やす}みかもしれません。', 'Moshika shitara, ashita wa yasumi kamoshiremasen.', 'Biết đâu mai được nghỉ.'),
        E('このことは{絶対|ぜったい}に{誰|だれ}にも{言|い}わないでください。', 'Kono koto wa zettai ni dare ni mo iwanaide kudasai.', 'Chuyện này tuyệt đối đừng nói với ai.'),
        E('{私|わたし}の{予想|よそう}が{当|あ}たりました。', 'Watashi no yosou ga atarimashita.', 'Dự đoán của tôi đã đúng.'),
        E('{出|で}かける{前|まえ}に、{電車|でんしゃ}の{時間|じかん}を{確認|かくにん}しました。', 'Dekakeru mae ni, densha no jikan o kakunin shimashita.', 'Trước khi ra ngoài tôi đã kiểm tra giờ tàu.'),
      ],
    },
    { t: 'h', text: 'Slide 3 — ～かもしれない／～はず: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b20-b3-noi',
      title: 'Luyện nhanh — nối đúng (10 câu)',
      kind: 'fill',
      items: [
        { q: '{遅|おく}れる → ～かもしれません', answers: V('{遅|おく}れるかもしれません') },
        { q: '{雨|あめ} → ～かもしれません', answers: V('{雨|あめ}かもしれません') },
        { q: '{暇|ひま} → ～かもしれません', answers: V('{暇|ひま}かもしれません') },
        { q: '{来|こ}ない → ～かもしれません', answers: V('{来|こ}ないかもしれません') },
        { q: '{忙|いそが}しい → lý do (～のかもしれない)', answers: V('{忙|いそが}しいのかもしれない', '{忙|いそが}しいのかもしれません') },
        { q: '{着|つ}く → ～はずです', answers: V('{着|つ}くはずです') },
        { q: '{休|やす}み → ～はずです', answers: V('{休|やす}みのはずです') },
        { q: '{上手|じょうず} → ～はずです', answers: V('{上手|じょうず}なはずです') },
        { q: '{来|こ}ない → ～はずです', answers: V('{来|こ}ないはずです') },
        { q: '{届|とど}く → lẽ ra… vậy mà (～はずなのに)', answers: V('{届|とど}くはずなのに') },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**かもしれない = khả năng (thấp)**, đi với もしかしたら; **はず = có căn cứ (cao)**, đi với ～から／～ので. Không có căn cứ thì đừng dùng はず.',
        '**Nối**: かもしれない trần ({雨|あめ}かもしれない); はず như danh từ ({休|やす}み**の**はず, {上手|じょうず}**な**はず).',
        '**Ý định của mình → つもり**, không phải はず. Phủ định của はず ở N4: **～ないはず**.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 3)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{明日|あした}の{天気|てんき}はどうだと{思|おも}いますか。', ro: 'Ashita no tenki wa dou da to omoimasu ka.', vi: 'Em nghĩ thời tiết ngày mai thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{今日|きょう}は{星|ほし}がよく{見|み}えるから、{明日|あした}は{晴|は}れるはずです。', ro: 'Kyou wa hoshi ga yoku mieru kara, ashita wa hareru hazu desu.', vi: 'Hôm nay thấy rõ sao nên chắc chắn mai trời nắng ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'マルコさんが{来|き}ていませんね。どうしたんでしょう。', ro: 'Maruko-san ga kite imasen ne. Dou shita n deshou.', vi: 'Marco chưa đến nhỉ. Có chuyện gì nhỉ?' },
        { who: 'Bạn', role: 'candidate', text: '{寝坊|ねぼう}したのかもしれません。{昨日|きのう}、{遅|おそ}くまでアルバイトがあったそうですから。', ro: 'Nebou shita no kamoshiremasen. Kinou, osoku made arubaito ga atta sou desu kara.', vi: 'Có khi bạn ấy ngủ quên ạ. Nghe nói hôm qua bạn ấy làm thêm đến khuya.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{来年|らいねん}、あなたは{何|なに}をしますか。', ro: 'Rainen, anata wa nani o shimasu ka.', vi: 'Sang năm em sẽ làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{日本語能力試験|にほんごのうりょくしけん}のN3を{受|う}けるつもりです。{合格|ごうかく}できるかもしれません。', ro: 'Nihongo nouryoku shiken no enu-san o ukeru tsumori desu. Goukaku dekiru kamoshiremasen.', vi: 'Em định thi N3 kỳ thi năng lực tiếng Nhật. Có khi em sẽ đỗ ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「{私|わたし}は{来年|らいねん}N3を{受|う}けるはずです」はどうですか。', ro: '"Watashi wa rainen enu-san o ukeru hazu desu" wa dou desu ka.', vi: 'Nói "私は来年N3を受けるはずです" thì sao?' },
        { who: 'Bạn', role: 'candidate', text: '{自分|じぶん}の{予定|よてい}なので、「はず」じゃなくて「つもり」を{使|つか}います。', ro: 'Jibun no yotei na node, "hazu" ja nakute "tsumori" o tsukaimasu.', vi: 'Vì là kế hoạch của mình nên dùng "つもり" chứ không dùng "はず" ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'では、{最近|さいきん}{聞|き}いたうわさを{一|ひと}つ{話|はな}してください。', ro: 'Dewa, saikin kiita uwasa o hitotsu hanashite kudasai.', vi: 'Vậy em kể một tin đồn em nghe gần đây đi.' },
        { who: 'Bạn', role: 'candidate', text: '{学校|がっこう}の{食堂|しょくどう}のメニューが{来月|らいげつ}から{変|か}わるらしいです。でも、まだ{発表|はっぴょう}がないので、{本当|ほんとう}じゃないかもしれません。', ro: 'Gakkou no shokudou no menyuu ga raigetsu kara kawaru rashii desu. Demo, mada happyou ga nai node, hontou ja nai kamoshiremasen.', vi: 'Nghe đâu thực đơn nhà ăn trường từ tháng sau thay đổi. Nhưng vì chưa có thông báo chính thức nên có khi không phải thật ạ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b20-b3-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (6 câu)',
      items: [
        { q: '{電話|でんわ}に{出|で}ませんね。{忙|いそが}しい（　）。', options: ['のかもしれません', 'のはずです', 'そうです（様態）', 'のらしいです'], correct: 0, why: 'Đoán lý do, không căn cứ → **のかもしれません**. 〔Isogashii no kamoshiremasen.〕' },
        { q: '{今日|きょう}は{祝日|しゅくじつ}だから、{郵便局|ゆうびんきょく}は{休|やす}み（　）はずです。', options: ['な', 'の', 'だ', '—'], correct: 1, why: 'N + **の** + はず. 〔Yasumi no hazu desu.〕' },
        { q: '{荷物|にもつ}は{昨日|きのう}{送|おく}ったから、もう（　）はずです。', options: ['{届|とど}いている', '{届|とど}きそう', '{届|とど}くらしい', '{届|とど}いて'], correct: 0, why: 'Có căn cứ (gửi hôm qua) → **{届|とど}いているはず**. 〔Mou todoite iru hazu desu.〕' },
        { q: 'もう{着|つ}いている（　）、まだ{来|き}ません。', options: ['はずなのに', 'はずだから', 'かもしれないので', 'そうなのに'], correct: 0, why: 'Lẽ ra… vậy mà → **はずなのに**. 〔Mou tsuite iru hazu na noni, mada kimasen.〕' },
        { q: '{私|わたし}は{夏休|なつやす}みに{国|くに}へ{帰|かえ}る（　）です。', options: ['はず', 'つもり', 'らしい', 'よう'], correct: 1, why: 'Ý định của chính mình → **つもり** (Bài 16). 〔Kuni e kaeru tsumori desu.〕' },
        { q: '（　）、{明日|あした}は{雪|ゆき}が{降|ふ}るかもしれません。', options: ['{絶対|ぜったい}に', 'もしかしたら', 'まるで', 'きっと'], correct: 1, why: '**もしかしたら ～かもしれません**. {絶対|ぜったい}／きっと mâu thuẫn với かもしれない. 〔Moshika shitara, ashita wa yuki ga furu kamoshiremasen.〕' },
      ],
    },
  ],
};

/* ═══════════════════════ ③ LUYỆN THÊM DỄ → KHÓ ═══════════════════════ */

type Mcq = Extract<Block, { t: 'mcq' }>['items'][number];

/** Bộ từ cho trắc nghiệm Nhật → Việt / Việt → Nhật (lấy đúng 48 từ của mục Từ vựng). */
const TU_LT: [w: string, ro: string, vi: string][] = [
  ['うわさ', 'uwasa', 'tin đồn'],
  ['うそ', 'uso', 'lời nói dối'],
  ['{秘密|ひみつ}', 'himitsu', 'bí mật'],
  ['{情報|じょうほう}', 'jouhou', 'thông tin'],
  ['{話題|わだい}', 'wadai', 'đề tài, chuyện được bàn tán'],
  ['{発表|はっぴょう}します', 'happyou shimasu', 'công bố; thuyết trình'],
  ['{伝|つた}えます', 'tsutaemasu', 'truyền đạt, nhắn lại'],
  ['{信|しん}じます', 'shinjimasu', 'tin, tin tưởng'],
  ['{驚|おどろ}きます', 'odorokimasu', 'ngạc nhiên'],
  ['{実|じつ}は', 'jitsu wa', 'thật ra là'],
  ['まさか', 'masaka', 'không lẽ nào'],
  ['{確|たし}か', 'tashika', 'hình như là (nhớ không chắc)'],
  ['{付|つ}き{合|あ}います', 'tsukiaimasu', 'hẹn hò; giao du'],
  ['{彼|かれ}', 'kare', 'anh ấy; bạn trai'],
  ['{彼女|かのじょ}', 'kanojo', 'cô ấy; bạn gái'],
  ['{彼氏|かれし}', 'kareshi', 'bạn trai'],
  ['{相手|あいて}', 'aite', 'đối phương, người kia'],
  ['{指輪|ゆびわ}', 'yubiwa', 'chiếc nhẫn'],
  ['{独身|どくしん}', 'dokushin', 'độc thân'],
  ['{仲|なか}がいい', 'naka ga ii', 'thân thiết'],
  ['けんかします', 'kenka shimasu', 'cãi nhau'],
  ['{幸|しあわ}せ', 'shiawase', 'hạnh phúc'],
  ['{様子|ようす}', 'yousu', 'dáng vẻ, tình hình'],
  ['{顔色|かおいろ}', 'kaoiro', 'sắc mặt'],
  ['{具合|ぐあい}', 'guai', 'tình trạng (sức khoẻ, máy)'],
  ['{気分|きぶん}', 'kibun', 'cảm giác trong người, tâm trạng'],
  ['{表情|ひょうじょう}', 'hyoujou', 'nét mặt'],
  ['{機嫌|きげん}', 'kigen', 'tâm trạng vui / không vui'],
  ['{似|に}ています', 'nite imasu', 'giống'],
  ['{太|ふと}ります', 'futorimasu', 'béo lên'],
  ['やせます', 'yasemasu', 'gầy đi'],
  ['{落|お}ち{込|こ}みます', 'ochikomimasu', 'suy sụp, buồn rầu'],
  ['{雲|くも}', 'kumo', 'mây'],
  ['{今|いま}にも', 'ima ni mo', '(sắp…) đến nơi'],
  ['{降|ふ}り{出|だ}します', 'furidashimasu', 'bắt đầu mưa'],
  ['{吹|ふ}きます', 'fukimasu', '(gió) thổi'],
  ['{雷|かみなり}', 'kaminari', 'sấm sét'],
  ['{星|ほし}', 'hoshi', 'ngôi sao'],
  ['{電池|でんち}', 'denchi', 'pin'],
  ['{切|き}れます', 'kiremasu', 'đứt; hết (pin, hạn)'],
  ['もしかしたら', 'moshika shitara', 'biết đâu'],
  ['{絶対|ぜったい}', 'zettai', 'tuyệt đối'],
  ['まるで', 'marude', 'cứ như là'],
  ['{本物|ほんもの}', 'honmono', 'đồ thật'],
  ['{予想|よそう}します', 'yosou shimasu', 'dự đoán'],
  ['{当|あ}たります', 'atarimasu', 'trúng; (đoán) đúng'],
  ['{外|はず}れます', 'hazuremasu', '(đoán) sai, trật'],
  ['{確認|かくにん}します', 'kakunin shimasu', 'xác nhận, kiểm tra lại'],
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
  id: 'b20-lt-1-tu-vung',
  kind: 'homework',
  title: 'Luyện thêm 1 · Từ vựng — 🟢 nhận mặt → 🟡 điền câu (40 câu)',
  goal: 'Nhớ chắc 48 từ của Bài 20 theo hai chiều (Nhật → Việt, Việt → Nhật) rồi chọn đúng từ trong câu, kể cả các cặp dễ nhầm (うわさ・情報・発表, 気分・機嫌・具合, 太る・太い, 似ている・似合う, 当たる・外れる, もしかしたら・絶対・確か).',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟢 Mức Dễ** — 15 câu Nhật → Việt và 10 câu Việt → Nhật. Sai câu nào: đọc to từ đó 3 lần (romaji có ngay trong câu hỏi).',
        '**🟡 Mức Vừa** — 15 câu điền từ vào câu, đúng dạng 文脈規定 của đề N4.',
        'Lỗi hay mắc: quên cụm chuẩn うそを**つく**, {機嫌|きげん}が{悪|わる}い khi buồn nôn (→ {気分|きぶん}), {太|ふと}いです cho người (→ {太|ふと}っています), {似|に}ます (→ {似|に}ています), {外|はず}れる ↔ mẫu はず.',
      ],
    },
    { t: 'h', text: '🟢 Mức 1 — Dễ: nhìn từ → nghĩa; nghe nghĩa → từ' },
    { t: 'mcq', id: 'b20-lt1-nv', title: 'Nhật → Việt (15 câu)', items: MCQ_NV(0, 15) },
    { t: 'mcq', id: 'b20-lt1-vn', title: 'Việt → Nhật (10 câu)', items: MCQ_VN(22, 32) },
    { t: 'h', text: '🟡 Mức 2 — Vừa: chọn từ hợp với câu (文脈規定)' },
    {
      t: 'mcq',
      id: 'b20-lt1-dien',
      title: 'Điền từ (15 câu)',
      items: [
        { q: 'これは{二人|ふたり}だけの（　）だから、{誰|だれ}にも{言|い}わないでね。', options: ['{秘密|ひみつ}', '{情報|じょうほう}', '{話題|わだい}', '{相手|あいて}'], correct: 0, why: 'Chỉ hai người biết, đừng nói ai = **{秘密|ひみつ}**. 〔Futari dake no himitsu.〕' },
        { q: '{来週|らいしゅう}、{大学|だいがく}が{合格者|ごうかくしゃ}を（　）します。', options: ['{伝|つた}え', '{発表|はっぴょう}', '{確認|かくにん}', '{予想|よそう}'], correct: 1, why: 'Công bố chính thức = **{発表|はっぴょう}する**. 〔Goukakusha o happyou shimasu.〕' },
        { q: '{山田|やまだ}さんに「{会議|かいぎ}は{三時|さんじ}からです」と（　）ください。', options: ['{伝|つた}えて', '{信|しん}じて', '{驚|おどろ}いて', '{付|つ}き{合|あ}って'], correct: 0, why: 'Nhắn lại = **{伝|つた}える**. 〔Yamada-san ni … to tsutaete kudasai.〕' },
        { q: '「{先生|せんせい}が{会社|かいしゃ}を{辞|や}める？（　）！」', options: ['{実|じつ}は', 'まさか', 'まるで', '{確|たし}か'], correct: 1, why: 'Không tin nổi = **まさか！** 〔Masaka!〕' },
        { q: '（　）、{会議|かいぎ}は{三時|さんじ}からだったと{思|おも}いますが……。', options: ['{絶対|ぜったい}', '{確|たし}か', 'まるで', '{今|いま}にも'], correct: 1, why: 'Nhớ không chắc = **{確|たし}か** + ～と{思|おも}います. 〔Tashika, kaigi wa sanji kara datta to omoimasu.〕' },
        { q: '{姉|あね}は{今|いま}の{彼|かれ}と{三年|さんねん}（　）います。', options: ['{付|つ}き{合|あ}って', '{似|に}て', 'けんかして', '{伝|つた}えて'], correct: 0, why: 'Hẹn hò với ai 3 năm = **{付|つ}き{合|あ}っている**. 〔San-nen tsukiatte imasu.〕' },
        { q: '{兄|あに}は{四十歳|よんじゅっさい}ですが、まだ（　）です。', options: ['{幸|しあわ}せ', '{独身|どくしん}', '{相手|あいて}', '{仲|なか}'], correct: 1, why: '40 tuổi vẫn chưa vợ = **{独身|どくしん}**. 〔Mada dokushin desu.〕' },
        { q: '{兄弟|きょうだい}は{小|ちい}さいことでよく（　）します。', options: ['けんか', '{確認|かくにん}', '{発表|はっぴょう}', '{予想|よそう}'], correct: 0, why: 'Hay cãi nhau vì chuyện nhỏ = **けんかする**. 〔Yoku kenka shimasu.〕' },
        { q: 'バスに{長|なが}く{乗|の}って、（　）が{悪|わる}くなりました。', options: ['{機嫌|きげん}', '{気分|きぶん}', '{様子|ようす}', '{表情|ひょうじょう}'], correct: 1, why: 'Khó chịu trong người (say xe) = **{気分|きぶん}が{悪|わる}い**. 〔Kibun ga waruku narimashita.〕' },
        { q: '{今日|きょう}の{部長|ぶちょう}は（　）が{悪|わる}いから、{話|はな}しかけないほうがいいよ。', options: ['{気分|きぶん}', '{機嫌|きげん}', '{具合|ぐあい}', '{顔色|かおいろ}'], correct: 1, why: 'Đang cáu (lộ ra ngoài) → **{機嫌|きげん}が{悪|わる}い**. 〔Kigen ga warui.〕' },
        { q: '{弟|おとうと}は{父|ちち}によく（　）います。', options: ['{似|に}て', '{似合|にあ}って', '{太|ふと}って', '{切|き}れて'], correct: 0, why: 'Giống bố = **{父|ちち}に{似|に}ている**. 〔Chichi ni yoku nite imasu.〕' },
        { q: '{空|そら}が{暗|くら}くなって、{急|きゅう}に{雨|あめ}が（　）。', options: ['{吹|ふ}きました', '{降|ふ}り{出|だ}しました', '{鳴|な}りました', '{切|き}れました'], correct: 1, why: 'Mưa bắt đầu đột ngột = **{降|ふ}り{出|だ}す**. 〔Kyuu ni ame ga furidashimashita.〕' },
        { q: 'スマホの（　）が{切|き}れそうです。', options: ['{電池|でんち}', '{雲|くも}', '{星|ほし}', '{雷|かみなり}'], correct: 0, why: 'Pin sắp hết = **{電池|でんち}が{切|き}れそう**. 〔Sumaho no denchi ga kiresou desu.〕' },
        { q: '{私|わたし}の{予想|よそう}が（　）、{日本|にほん}のチームが{勝|か}ちました。', options: ['{当|あ}たって', '{外|はず}れて', '{確認|かくにん}して', '{信|しん}じて'], correct: 0, why: 'Đoán đúng = **{予想|よそう}が{当|あ}たる**. 〔Yosou ga atatte…〕' },
        { q: 'このかばんは（　）みたいに{見|み}えますが、{値段|ねだん}が{安|やす}すぎます。', options: ['{本物|ほんもの}', '{相手|あいて}', '{情報|じょうほう}', '{話題|わだい}'], correct: 0, why: 'Trông như hàng thật = **{本物|ほんもの}みたい**. 〔Honmono mitai ni miemasu ga…〕' },
      ],
    },
  ],
};

const LT_2: Lesson = {
  id: 'b20-lt-2-han-tu',
  kind: 'homework',
  title: 'Luyện thêm 2 · Chữ Hán — 🟢 đọc → 🟡 chọn chữ → 🔴 chữ giống, đồng âm (22 câu)',
  goal: 'Đọc và viết đúng 15 chữ Hán mới trong từ: chọn cách đọc, chọn chữ đúng cho từ viết kana, phân biệt chữ trông giống (様・横, 確・破, 彼・波, 情・晴, 報・服, 絶・給, 対・村, 雲・雪, 想・相, 幸・辛) và từ đồng âm (泣く・鳴く, 外れる・はず).',
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
      id: 'b20-lt2-doc',
      title: '🟢 漢字読み — cách đọc của từ in đậm (10 câu)',
      items: [
        { q: 'お**客様**、こちらへどうぞ。', options: ['きゃくさま', 'きゃくよう', 'かくさま', 'きゃくざま'], correct: 0, why: '**お{客様|きゃくさま}** (okyakusama) — 様 đọc さま.' },
        { q: '**確**かめてから{返事|へんじ}します。', options: ['かく', 'たし', 'たしか', 'あきら'], correct: 1, why: '**{確|たし}かめて** (tashikamete).' },
        { q: 'それは**事実**ではありません。', options: ['じじつ', 'じしつ', 'ことみ', 'じっじつ'], correct: 0, why: '**{事実|じじつ}** (jijitsu) — 実 đọc ジツ.' },
        { q: '**彼**はとても{親切|しんせつ}です。', options: ['かの', 'かれ', 'ひ', 'かれし'], correct: 1, why: '**{彼|かれ}** (kare).' },
        { q: 'その{服|ふく}、よく**似合**いますね。', options: ['にあ', 'じあ', 'にごう', 'にい'], correct: 0, why: '**{似合|にあ}います** (niaimasu) — hợp với.' },
        { q: '**太陽**が{出|で}てきました。', options: ['ふとよう', 'たいよう', 'だいよう', 'たよう'], correct: 1, why: '**{太陽|たいよう}** (taiyou) — 太 trong từ ghép đọc タイ.' },
        { q: 'うれしくて**泣**き{出|だ}してしまいました。', options: ['な', 'き', 'なき', 'きゅう'], correct: 0, why: '**{泣|な}き{出|だ}して** (nakidashite).' },
        { q: 'うれしそうな**表情**をしています。', options: ['ひょうじょう', 'ひょうせい', 'おもてじょう', 'ひょじょう'], correct: 0, why: '**{表情|ひょうじょう}** (hyoujou) — hai trường âm.' },
        { q: '**天気予報**を{見|み}ましたか。', options: ['てんきよほう', 'てんきよぼう', 'てんきよそう', 'てんけよほう'], correct: 0, why: '**{天気予報|てんきよほう}** (tenki yohou).' },
        { q: 'この{映画|えいが}の**感想**を{書|か}いてください。', options: ['かんしょう', 'かんそう', 'かんぞう', 'かんおも'], correct: 1, why: '**{感想|かんそう}** (kansou) — cảm tưởng.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b20-lt2-chon',
      title: '🟡 表記 — chọn chữ đúng (8 câu)',
      items: [
        { q: '{電話番号|でんわばんごう}を**かくにん**してください。', options: ['確認', '破認', '確忍', '確任'], correct: 0, why: '**確認** — 確 = 石 + 隺. 破 (rách) phải là 皮.' },
        { q: '**かのじょ**は{歌|うた}が{上手|じょうず}です。', options: ['波女', '彼女', '皮女', '被女'], correct: 1, why: '**彼女** — 彳 + 皮. 波 có 氵.' },
        { q: '{最近|さいきん}、**ふとり**ました。', options: ['犬り', '大り', '太り', '天り'], correct: 2, why: '**太る** — chấm ở dưới giữa. 犬 chấm trên phải.' },
        { q: '{来週|らいしゅう}、**はっぴょう**があります。', options: ['発表', '発素', '登表', '発俵'], correct: 0, why: '**発表** — 表 dưới là phần áo; 素 dưới là 糸.' },
        { q: 'あたらしい**じょうほう**です。', options: ['晴報', '情服', '情報', '清報'], correct: 2, why: '**情報** — 情 = 忄 + 青; 報 trái là 幸 (服 trái là 月).' },
        { q: 'その{意見|いけん}に**はんたい**です。', options: ['反村', '反対', '返対', '坂対'], correct: 1, why: '**反対** — 対 = 文 + 寸; 村 = 木 + 寸.' },
        { q: '{空|そら}に**くも**がたくさんあります。', options: ['雪', '雲', '雷', '電'], correct: 1, why: '**雲** — 雨 + 云.' },
        { q: '{明日|あした}の{天気|てんき}を**よそう**します。', options: ['予相', '予想', '予思', '矛想'], correct: 1, why: '**予想** — 想 = 相 + 心. 相 thiếu 心; 思 = 田 + 心.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b20-lt2-bay',
      title: '🔴 Bẫy — chữ trông giống, đồng âm (4 câu)',
      items: [
        { q: '{鳥|とり}が**ないて**います。— chữ đúng là？', options: ['泣いて', '鳴いて', '位いて', '立いて'], correct: 1, why: 'Chim kêu = **鳴く** (có 口 + 鳥). **泣く** = người khóc — đồng âm, khác chữ!' },
        { q: '「{予想|よそう}が**はずれた**」— chữ đúng là？', options: ['外れた', '筈れた', '果れた', '払れた'], correct: 0, why: '**外れる** (trật, sai) — chữ 外. Mẫu ngữ pháp はず (chắc là) viết bằng かな, khác hẳn.' },
        { q: '「しあわせ」の{漢字|かんじ}は？', options: ['辛せ', '幸せ', '幸わせ', '倖せ'], correct: 1, why: '**幸せ** — trên là 土. 辛 (cay) trên là 立. Viết ~~幸わせ~~ (thừa わ) là sai okurigana.' },
        { q: '「ようす」の{漢字|かんじ}は？', options: ['横子', '洋子', '様子', '要子'], correct: 2, why: '**様子** — 様 (木 + 羊 + nước). 洋子 là tên người (ようこ); 横 là "ngang".' },
      ],
    },
  ],
};

const LT_3: Lesson = {
  id: 'b20-lt-3-noi-the',
  kind: 'homework',
  title: 'Luyện thêm 3 · Nối thể — ～そう, ～そうだ, ～ようだ・みたい, ～らしい, ～かもしれない, ～はず (28 câu gõ)',
  goal: 'Nối nhanh và đúng từng mẫu với V／イA／ナA／N ở mọi thì (hiện tại, phủ định, quá khứ), nhớ chắc hai ngoại lệ よさそう・なさそう, phủ định của ～そう, và ba nhóm cách nối (gốc ます／bỏ い — "như danh từ" な・の — "trần") — nền tảng để không sai ở phần ngữ pháp.',
  minutes: 25,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        'Ba nhóm cách nối: **(1) ～そう (trông có vẻ)** — gốc Vます / イA bỏ い / ナA · **(2) "như danh từ"** — ようだ, はず: ナA **な**, N **の** · **(3) "trần"** — みたい, らしい, かもしれない: ナA, N đứng trần. Riêng **そうだ (nghe nói)**: ナA, N + **だ**.',
        'Gõ bằng kana hoặc chữ Hán đều được. Mỗi phần 7 câu; làm lại phần nào sai ≥ 2 câu.',
      ],
    },
    {
      t: 'quiz',
      id: 'b20-lt3-sou',
      title: 'Phần 1 — ～そう (trông có vẻ / sắp) (7 câu)',
      kind: 'fill',
      grammar: 'Vます bỏ ます／イA bỏ い／ナA ＋ そう · いい → よさそう · ない → なさそう',
      items: [
        { q: '{落|お}ちる → sắp (～そうです)', answers: V('{落|お}ちそうです'), hint: '{落|お}ちます → {落|お}ち' },
        { q: '{難|むずか}しい → trông có vẻ (～そうです)', answers: V('{難|むずか}しそうです'), hint: 'bỏ い' },
        { q: '{便利|べんり} → trông có vẻ (～そうな ＋ {店|みせ})', answers: V('{便利|べんり}そうな{店|みせ}'), hint: 'ナA + そうな N' },
        { q: '{仲|なか}がいい → trông có vẻ (～そうです)', answers: V('{仲|なか}がよさそうです'), hint: 'いい → よさそう' },
        { q: '{時間|じかん}がない → có vẻ (～そうです)', answers: V('{時間|じかん}がなさそうです'), hint: 'ない → なさそう' },
        { q: '{元気|げんき} → trông KHÔNG (～そう phủ định)', answers: V('{元気|げんき}じゃなさそうです', '{元気|げんき}ではなさそうです', '{元気|げんき}じゃなさそう'), hint: 'じゃない → じゃなさそう' },
        { q: 'できる → chắc không làm được (～そう phủ định)', answers: V('できそうにないです', 'できそうもないです', 'できそうにありません', 'できそうもありません', 'できそうにない', 'できそうもない'), hint: '～そうにない／～そうもない' },
      ],
    },
    {
      t: 'quiz',
      id: 'b20-lt3-denbun-you',
      title: 'Phần 2 — ～そうだ (nghe nói) · ～ようだ (7 câu)',
      kind: 'fill',
      grammar: 'そうだ: 普通形 (ナA・N + だ) · ようだ: 普通形 (ナA な・N の)',
      items: [
        { q: '{雪|ゆき} → nghe nói (～そうです)', answers: V('{雪|ゆき}だそうです'), hint: 'N + だ + そうです' },
        { q: '{寒|さむ}かった → nghe nói (～そうです)', answers: V('{寒|さむ}かったそうです'), hint: 'thể thường quá khứ + そうです' },
        { q: '{来|こ}ない → nghe nói (～そうです)', answers: V('{来|こ}ないそうです'), hint: 'V-ない + そうです' },
        { q: '{病気|びょうき} → hình như (～ようです)', answers: V('{病気|びょうき}のようです'), hint: 'N + の' },
        { q: '{大変|たいへん} → hình như (～ようです)', answers: V('{大変|たいへん}なようです'), hint: 'ナA + な' },
        { q: '{寝|ね}た → hình như (～ようです)', answers: V('{寝|ね}たようです'), hint: 'V-た + ようです' },
        { q: '{夢|ゆめ} → cứ như là (まるで ～ようです)', answers: V('まるで{夢|ゆめ}のようです'), hint: 'まるで + N の ようです' },
      ],
    },
    {
      t: 'quiz',
      id: 'b20-lt3-mitai-rashii',
      title: 'Phần 3 — ～みたい · ～らしい · ～かもしれない (7 câu)',
      kind: 'fill',
      grammar: 'みたい／らしい／かもしれない: 普通形 — ナA, N đứng trần',
      items: [
        { q: '{子|こ}ども → cứ như (～みたい)', answers: V('{子|こ}どもみたい', '{子|こ}どもみたいです', '{子|こ}どもみたいだ'), hint: 'N + みたい' },
        { q: '{嫌|きら}い → hình như (～みたいです)', answers: V('{嫌|きら}いみたいです', '{嫌|きら}いみたい'), hint: 'ナA + みたい (嫌い là ナA!)' },
        { q: '{引|ひ}っ{越|こ}した → nghe đâu (～らしいです)', answers: V('{引|ひ}っ{越|こ}したらしいです', '{引|ひ}っ{越|こ}したらしい'), hint: 'V-た + らしい' },
        { q: '{上手|じょうず} → nghe đâu (～らしいです)', answers: V('{上手|じょうず}らしいです', '{上手|じょうず}らしい'), hint: 'ナA + らしい' },
        { q: '{留守|るす} → có khi (～かもしれません)', answers: V('{留守|るす}かもしれません', '{留守|るす}かもしれない'), hint: 'N + かもしれない' },
        { q: '{高|たか}くない → có khi (～かもしれません)', answers: V('{高|たか}くないかもしれません', '{高|たか}くないかもしれない'), hint: 'イA-くない + かもしれない' },
        { q: '{忙|いそが}しい → có khi là vì (～のかもしれません)', answers: V('{忙|いそが}しいのかもしれません', '{忙|いそが}しいのかもしれない'), hint: '～のかもしれない' },
      ],
    },
    {
      t: 'quiz',
      id: 'b20-lt3-hazu',
      title: 'Phần 4 — ～はず · tổng hợp (7 câu)',
      kind: 'fill',
      grammar: 'はず: 普通形 (ナA な・N の) · ～はずなのに · ～ないはず',
      items: [
        { q: '{知|し}っている → chắc chắn (～はずです)', answers: V('{知|し}っているはずです'), hint: 'V-ている + はず' },
        { q: '{無料|むりょう} → chắc chắn (～はずです)', answers: V('{無料|むりょう}のはずです'), hint: 'N + の' },
        { q: '{簡単|かんたん} → chắc chắn (～はずです)', answers: V('{簡単|かんたん}なはずです'), hint: 'ナA + な' },
        { q: '{来|く}る → chắc là KHÔNG (～ないはずです)', answers: V('{来|こ}ないはずです'), hint: '来ない + はず' },
        { q: '{言|い}った → lẽ ra đã… vậy mà (～はずなのに)', answers: V('{言|い}ったはずなのに'), hint: 'はず + な + のに' },
        { q: 'いい（{天気|てんき}が） → trông có vẻ (～そうです)', answers: V('{天気|てんき}がよさそうです'), hint: 'よさそう' },
        { q: 'いい（{天気|てんき}が） → nghe nói (～そうです)', answers: V('{天気|てんき}がいいそうです'), hint: 'thể thường いい + そうです' },
      ],
    },
  ],
};

const LT_4: Lesson = {
  id: 'b20-lt-4-phan-biet',
  kind: 'homework',
  title: 'Luyện thêm 4 · Ngữ pháp — 🟡 chọn mẫu theo nguồn tin → 🔴 bẫy đề N4 (26 câu)',
  goal: 'Chọn đúng mẫu theo câu hỏi "biết từ đâu, chắc đến đâu": ～そう／～そうだ／～ようだ／～みたい／～らしい／～かもしれない／～はず; nhận ra các bẫy kinh điển (hai そう, そう với danh từ, はず cho ý định của mình, 絶対 + かもしれない, まるで + らしい) và sắp xếp câu dài có nhiều mẫu chồng nhau.',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟡 Mức Vừa** — 12 câu: mỗi câu có dấu hiệu về **nguồn tin** (nhìn thấy / nghe nói / tin đồn / căn cứ / không căn cứ). Gạch chân dấu hiệu trước khi chọn.',
        '**🔴 Mức Khó** — 8 câu bẫy + 6 câu ghép (文の組み立て). Sai câu nào → mở bảng "Bảng chọn nhanh khi làm đề" cuối mục Ngữ pháp.',
      ],
    },
    { t: 'h', text: '🟡 Mức 2 — Vừa: chọn mẫu theo nguồn tin' },
    {
      t: 'mcq',
      id: 'b20-lt4-nguon',
      title: 'Chọn mẫu đúng (12 câu)',
      items: [
        { q: '（{店|みせ}の{前|まえ}で{見|み}て）わあ、このパン、（　）ですね。', options: ['おいしいそう', 'おいしそう', 'おいしいらしい', 'おいしいはず'], correct: 1, why: 'Nhìn trước mắt, chưa ăn → **おいしそう**. 〔Kono pan, oishisou desu ne.〕' },
        { q: '{雑誌|ざっし}によると、このパン{屋|や}は{東京|とうきょう}でいちばん{人気|にんき}がある（　）です。', options: ['そう', 'よう', 'はず', 'みたい'], correct: 0, why: 'Nguồn rõ (～によると) → nghe nói: **あるそうです**. 〔Ichiban ninki ga aru sou desu.〕' },
        { q: '{教室|きょうしつ}に{誰|だれ}もいません。{授業|じゅぎょう}はもう{終|お}わった（　）です。', options: ['そう', 'よう', 'らしい', 'はず'], correct: 1, why: 'Tự thấy lớp trống → kết luận: **{終|お}わったようです**. 〔Jugyou wa mou owatta you desu.〕' },
        { q: 'みんなが{言|い}っていますが、{来年|らいねん}から{学費|がくひ}が{上|あ}がる（　）よ。', options: ['らしい', 'ようだ', 'そうな', 'はずな'], correct: 0, why: '"Mọi người nói" — nguồn mơ hồ, tin đồn → **らしい**. 〔Rainen kara gakuhi ga agaru rashii yo.〕' },
        { q: '{彼|かれ}は{毎日|まいにち}{練習|れんしゅう}しているから、{試合|しあい}に{勝|か}つ（　）です。', options: ['かもしれない', 'はず', 'そう', 'らしい'], correct: 1, why: 'Có căn cứ (luyện mỗi ngày) → **{勝|か}つはずです**. 〔Shiai ni katsu hazu desu.〕' },
        { q: 'よくわからないけど、もしかしたら{今日|きょう}は{店|みせ}が{休|やす}み（　）。', options: ['かもしれない', 'のはずだ', 'そうだ（様態）', 'らしくない'], correct: 0, why: 'もしかしたら + không chắc → **かもしれない**. 〔Kyou wa mise ga yasumi kamoshirenai.〕' },
        { q: '{棚|たな}の{上|うえ}の{花瓶|かびん}が（　）ですよ。{危|あぶ}ない！', options: ['{落|お}ちるよう', '{落|お}ちそう', '{落|お}ちるらしい', '{落|お}ちたはず'], correct: 1, why: 'Thấy dấu hiệu sắp rơi → **{落|お}ちそう**. 〔Kabin ga ochisou desu yo.〕' },
        { q: 'A「{山田|やまだ}さん、{遅|おそ}いね。」 B「{電車|でんしゃ}が{遅|おく}れている（　）。」', options: ['のかもしれないね', 'そうだね（様態）', 'はずがないね', 'みたいな'], correct: 0, why: 'Đoán lý do, không căn cứ → **のかもしれないね**. 〔Densha ga okurete iru no kamoshirenai ne.〕' },
        { q: '{今日|きょう}は{寒|さむ}くて、まるで{冬|ふゆ}（　）。', options: ['みたいだ', 'らしい', 'そうだ', 'かもしれない'], correct: 0, why: '**まるで** + N **みたいだ／のようだ** (so sánh). 〔Marude fuyu mitai da.〕' },
        { q: 'このスープ、（{飲|の}んでみて）ちょっと{辛|から}い（　）ね。', options: ['みたい', 'そう', 'らしい', 'はず'], correct: 0, why: 'Đã nếm → cảm nhận của mình, văn nói → **{辛|から}いみたい**. {辛|から}そう chỉ dùng khi CHƯA nếm. 〔Chotto karai mitai ne.〕' },
        { q: '{兄|あに}は{来月|らいげつ}アメリカへ{行|い}く（　）です。{兄|あに}がそう{言|い}っていましたから。', options: ['はず', 'つもり', 'よう', 'そう（様態）'], correct: 0, why: 'Về người khác, có căn cứ (anh nói vậy) → **はずです**. つもり chỉ dùng cho ý định của chính người nói (hoặc khi hỏi ý định người nghe). 〔Ani wa raigetsu Amerika e iku hazu desu.〕' },
        { q: '{東京|とうきょう}（　）{大|おお}きい{町|まち}は、{家賃|やちん}が{高|たか}いです。', options: ['のような', 'らしい', 'そうな', 'のはずな'], correct: 0, why: 'Nêu ví dụ: N1 **のような** N2. 〔Toukyou no you na ookii machi wa…〕' },
      ],
    },
    { t: 'h', text: '🔴 Mức 3 — Khó: bẫy kinh điển + 文の組み立て' },
    {
      t: 'mcq',
      id: 'b20-lt4-bay',
      title: 'Bẫy đề N4 (8 câu)',
      items: [
        { q: 'Câu nào ĐÚNG?', options: ['あの{人|ひと}は{学生|がくせい}そうです。', 'あの{人|ひと}は{学生|がくせい}みたいです。', 'あの{人|ひと}は{学生|がくせい}なようです。', 'あの{人|ひと}は{学生|がくせい}だらしいです。'], correct: 1, why: 'N + **みたい** ✓. ~~{学生|がくせい}そう~~ (そう không đi với N), ~~{学生|がくせい}なよう~~ (phải の), ~~{学生|がくせい}だらしい~~ (bỏ だ).' },
        { q: 'Câu nào ĐÚNG?', options: ['{絶対|ぜったい}に{雨|あめ}が{降|ふ}るかもしれません。', 'もしかしたら{雨|あめ}が{降|ふ}るかもしれません。', 'まるで{雨|あめ}が{降|ふ}るかもしれません。', 'もしかしたら{雨|あめ}が{降|ふ}るはずです。'], correct: 1, why: '**もしかしたら ～かもしれません** ✓. {絶対|ぜったい} + かもしれない mâu thuẫn; まるで chỉ đi với ようだ; もしかしたら + はず (chắc chắn) mâu thuẫn.' },
        { q: '（ケーキを{食|た}べたあとで）', options: ['このケーキ、おいしそう！', 'このケーキ、おいしい！', 'このケーキ、おいしいはず！', 'このケーキ、おいしいらしい！'], correct: 1, why: 'Đã ăn rồi → nói thẳng **おいしい！** そう chỉ dùng khi chưa thử.' },
        { q: '「{雨|あめ}が{降|ふ}りそうです」と{同|おな}じ{意味|いみ}の{文|ぶん}は？', options: ['{雨|あめ}が{降|ふ}ると{聞|き}きました。', '{今|いま}にも{雨|あめ}が{降|ふ}ってきそうな{空|そら}です。', '{雨|あめ}が{降|ふ}ったようです。', '{雨|あめ}が{降|ふ}るはずがありません。'], correct: 1, why: '{降|ふ}りそう = nhìn trời thấy sắp mưa ≈ **{今|いま}にも{雨|あめ}が{降|ふ}ってきそうな{空|そら}** (bầu trời như sắp mưa). Câu 1 là そうだ "nghe nói".' },
        { q: 'Câu nào dùng らしい theo nghĩa "đúng chất, ra dáng"?', options: ['{来週|らいしゅう}{試験|しけん}があるらしい。', '{今日|きょう}は{春|はる}らしい{暖|あたた}かい{日|ひ}ですね。', '{店|みせ}が{閉|し}まるらしいよ。', '{彼|かれ}は{日本|にほん}へ{帰|かえ}ったらしい。'], correct: 1, why: '**{春|はる}らしい** + N = "đúng kiểu mùa xuân" (N らしい — tính từ). Ba câu còn lại là らしい "nghe đâu".' },
        { q: '{私|わたし}は{来年|らいねん}{日本|にほん}の{会社|かいしゃ}で（　）。', options: ['{働|はたら}くはずです', '{働|はたら}くつもりです', '{働|はたら}きそうです', '{働|はたら}くらしいです'], correct: 1, why: 'Ý định của chính mình → **つもり**. はず／らしい nói về mình nghe như kể chuyện người khác.' },
        { q: '「{田中|たなか}さんは{元気|げんき}そうです」の{意味|いみ}は？', options: ['{田中|たなか}さんが「{元気|げんき}です」と{言|い}っていた。', '{田中|たなか}さんを{見|み}て、{元気|げんき}だと{思|おも}った。', '{田中|たなか}さんはいつも{元気|げんき}なはずだ。', '{田中|たなか}さんは{元気|げんき}じゃないかもしれない。'], correct: 1, why: '{元気|げんき}**そう** (様態) = nhìn mà thấy → **{見|み}て、{元気|げんき}だと{思|おも}った**. Câu 1 là {元気|げんき}**だそう** (nghe nói).' },
        { q: 'かばんの{中|なか}に{入|い}れた（　）、{鍵|かぎ}がありません。', options: ['はずなのに', 'はずだから', 'そうなのに', 'らしいので'], correct: 0, why: 'Căn cứ (đã bỏ vào) ↔ thực tế (không thấy) → **はずなのに**. 〔Kaban no naka ni ireta hazu na noni, kagi ga arimasen.〕' },
      ],
    },
    {
      t: 'build',
      id: 'b20-lt4-ghep',
      title: '文の組み立て — ghép câu dài (6 câu)',
      items: [
        { vi: 'Theo dự báo thì mai nắng, nhưng nhìn trời thì có vẻ sắp mưa.', chips: ['{予報|よほう}では', '{明日|あした}は', '{晴|は}れるそうですが', '{空|そら}を{見|み}ると', '{雨|あめ}が', '{降|ふ}りそうです', '{降|ふ}るそうです'], answer: ['{予報|よほう}では', '{明日|あした}は', '{晴|は}れるそうですが', '{空|そら}を{見|み}ると', '{雨|あめ}が', '{降|ふ}りそうです'], ro: 'Yohou de wa ashita wa hareru sou desu ga, sora o miru to ame ga furisou desu.' },
        { vi: 'Đèn tắt rồi, hình như mọi người đã về hết.', chips: ['{電気|でんき}が', '{消|き}えているから', 'みんな', 'もう', '{帰|かえ}った', 'ようです', 'そうです'], answer: ['{電気|でんき}が', '{消|き}えているから', 'みんな', 'もう', '{帰|かえ}った', 'ようです'], ro: 'Denki ga kiete iru kara, minna mou kaetta you desu.' },
        { vi: 'Theo tin đồn thì thầy Honda đang hẹn hò với ai đó.', chips: ['うわさでは', '{本田先生|ほんだせんせい}は', '{誰|だれ}かと', '{付|つ}き{合|あ}っている', 'らしいです', 'はずです'], answer: ['うわさでは', '{本田先生|ほんだせんせい}は', '{誰|だれ}かと', '{付|つ}き{合|あ}っている', 'らしいです'], ro: 'Uwasa de wa Honda-sensei wa dareka to tsukiatte iru rashii desu.' },
        { vi: 'Biết đâu là vì anh ấy bận nên không trả lời.', chips: ['もしかしたら', '{忙|いそが}しくて', '{返事|へんじ}が', 'できない', 'のかもしれません', '{絶対|ぜったい}に'], answer: ['もしかしたら', '{忙|いそが}しくて', '{返事|へんじ}が', 'できない', 'のかもしれません'], ro: 'Moshika shitara isogashikute henji ga dekinai no kamoshiremasen.' },
        { vi: 'Đã gửi tuần trước nên chắc chắn đã đến rồi vậy mà vẫn chưa thấy.', chips: ['{先週|せんしゅう}', '{送|おく}ったから', 'もう', '{届|とど}いている', 'はずなのに', 'まだ{来|き}ません', 'そうなのに'], answer: ['{先週|せんしゅう}', '{送|おく}ったから', 'もう', '{届|とど}いている', 'はずなのに', 'まだ{来|き}ません'], ro: 'Senshuu okutta kara mou todoite iru hazu na noni, mada kimasen.' },
        { vi: 'Người cửa hàng rau bảo chắc chắn trước 11 giờ sẽ tới (nghe nói).', chips: ['{八百屋|やおや}の{人|ひと}の{話|はなし}では', '11{時|じ}までには', '{着|つ}く', 'はずだ', 'そうです', 'らしいな'], answer: ['{八百屋|やおや}の{人|ひと}の{話|はなし}では', '11{時|じ}までには', '{着|つ}く', 'はずだ', 'そうです'], ro: 'Yaoya no hito no hanashi de wa juuichiji made ni wa tsuku hazu da sou desu.' },
      ],
    },
  ],
};

const LT_5: Lesson = {
  id: 'b20-lt-5-tong-hop',
  kind: 'homework',
  title: 'Luyện thêm 5 · Đề tổng hợp kiểu N4 — 文字・語彙 · 文法 · 読解 (17 câu, có thang điểm)',
  goal: 'Làm một đề mini đúng ba phần của JLPT N4 (chữ – từ, ngữ pháp, đọc) trên nội dung Bài 20, tự chấm theo thang điểm và biết sai câu nào thì ôn mục nào — bước khởi động trước Kiểm tra chặng 16–20.',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Cách làm & thang điểm',
      items: [
        'Bấm giờ **25 phút**, không mở bài. ① 文字・語彙 6 câu · ② 文法 8 câu (6 chọn + 2 sắp xếp ★) · ③ 読解 3 câu.',
        'Mỗi câu 1 điểm, tổng **17**. **15–17**: rất tốt, làm ngay Kiểm tra chặng · **12–14**: đạt, ôn lại mục mình sai · **≤ 11**: học lại Ngữ pháp ①–⑤ và làm Luyện thêm 3–4.',
        'Sai ① → Từ vựng + Chữ Hán · sai ② câu ～そう → Ngữ pháp ① ①′ · sai câu ～ようだ／～らしい → ② ③ (bảng ba mẫu dễ lẫn) · sai câu ～かもしれない／～はず → ④ ⑤ · sai ③ → Đọc hiểu.',
      ],
    },
    { t: 'h', text: '① 文字・語彙' },
    {
      t: 'mcq',
      id: 'b20-lt5-tu',
      title: '文字・語彙 (6 câu)',
      items: [
        { q: '**情報**を{集|あつ}めます。— {読|よ}み{方|かた}', options: ['じょうほう', 'じょほう', 'せいほう', 'じょうぼう'], correct: 0, why: '**{情報|じょうほう}** (jouhou).' },
        { q: '{母|はは}に**似**ています。— {読|よ}み{方|かた}', options: ['じ', 'に', 'にあ', 'い'], correct: 1, why: '**{似|に}ています** (nite imasu).' },
        { q: '**ぜったい**に{行|い}きます。— {漢字|かんじ}', options: ['絶対', '絶村', '給対', '色対'], correct: 0, why: '**絶対**.' },
        { q: '{顔|かお}が{青|あお}いですね。（　）が{悪|わる}いんですか。', options: ['{具合|ぐあい}', '{機嫌|きげん}', '{話題|わだい}', '{相手|あいて}'], correct: 0, why: 'Ốm, không khoẻ → **{具合|ぐあい}が{悪|わる}い**.' },
        { q: '{予想|よそう}が（　）、{雨|あめ}は{降|ふ}りませんでした。', options: ['{当|あ}たって', '{外|はず}れて', '{切|き}れて', '{吹|ふ}いて'], correct: 1, why: 'Đoán mưa mà không mưa → **{外|はず}れる**.' },
        { q: '「{確|たし}か、{西川|にしかわ}さんは{独身|どくしん}です。」に{意味|いみ}がいちばん{近|ちか}いのは？', options: ['{西川|にしかわ}さんは{絶対|ぜったい}に{独身|どくしん}です。', '{私|わたし}が{覚|おぼ}えているのでは、{西川|にしかわ}さんは{結婚|けっこん}していません。', '{西川|にしかわ}さんは{結婚|けっこん}しています。', '{西川|にしかわ}さんは{結婚|けっこん}したいです。'], correct: 1, why: 'Phó từ **{確|たし}か** = "theo tôi nhớ" + {独身|どくしん} = chưa kết hôn.' },
      ],
    },
    { t: 'h', text: '② 文法' },
    {
      t: 'mcq',
      id: 'b20-lt5-np',
      title: '文法 — 文法形式の判断 (6 câu) + 文の組み立て ★ (2 câu)',
      items: [
        { q: 'あ、ボタンが（　）ですよ。', options: ['{取|と}れそう', '{取|と}れるそう', '{取|と}れるらしい', '{取|と}れるはず'], correct: 0, why: 'Thấy dấu hiệu sắp tuột → **{取|と}れそう**.' },
        { q: 'テレビのニュースによると、{昨日|きのう}{北海道|ほっかいどう}で{雪|ゆき}が（　）そうです。', options: ['{降|ふ}り', '{降|ふ}る', '{降|ふ}った', '{降|ふ}って'], correct: 2, why: 'Nghe nói + việc đã xảy ra → **{降|ふ}ったそうです**.' },
        { q: '{隣|となり}の{部屋|へや}から{楽|たの}しそうな{声|こえ}が{聞|き}こえます。パーティーをしている（　）です。', options: ['よう', 'そう', 'はず', 'の'], correct: 0, why: 'Nghe tiếng (dấu hiệu tự mình nghe) → **ようです**.' },
        { q: 'うわさでは、あのレストランは{来月|らいげつ}{閉店|へいてん}する（　）。', options: ['らしい', 'ような', 'そうな', 'はずな'], correct: 0, why: '**うわさでは** → **らしい**.' },
        { q: '{今日|きょう}は{日曜日|にちようび}だから、{郵便局|ゆうびんきょく}は{休|やす}み（　）。', options: ['のはずです', 'なはずです', 'はずです', 'だはずです'], correct: 0, why: 'N + **の** + はず.' },
        { q: '{雲|くも}が{少|すこ}し{出|で}てきたけど、{雨|あめ}は（　）ね。', options: ['{降|ふ}りそうにない', '{降|ふ}らないそうな', '{降|ふ}りそうな', '{降|ふ}るはずの'], correct: 0, why: 'Phủ định của V + そう: **{降|ふ}りそうにない** (chắc không mưa).' },
        { q: '★ {天気予報|てんきよほう}では ＿＿ ＿＿ ★ ＿＿ そうです。（{午後|ごご}から／{雨|あめ}が／{降|ふ}る／{明日|あした}の）', options: ['{午後|ごご}から', '{雨|あめ}が', '{降|ふ}る', '{明日|あした}の'], correct: 1, why: 'Câu đúng: {天気予報|てんきよほう}では **{明日|あした}の {午後|ごご}から {雨|あめ}が {降|ふ}る** そうです. Ô ★ (thứ 3) = **{雨|あめ}が**.' },
        { q: '★ もう ＿＿ ＿＿ ★ ＿＿ まだ{来|き}ません。（なのに／{着|つ}いている／はず／{駅|えき}に）', options: ['なのに', '{着|つ}いている', 'はず', '{駅|えき}に'], correct: 2, why: 'Câu đúng: もう **{駅|えき}に {着|つ}いている はず なのに** まだ{来|き}ません. Ô ★ (thứ 3) = **はず**.' },
      ],
    },
    { t: 'h', text: '③ 読解' },
    {
      t: 'passage',
      title: 'ナタポンさんのメモ（{店|みせ}の{休憩室|きゅうけいしつ}で）',
      intro: 'Tối thứ Sáu, ナタポン dán mẩu ghi chú này lên bảng ở phòng nghỉ của quán ひまわり食堂. Đọc rồi trả lời câu hỏi.',
      paras: [
        { text: 'アルバイトのみなさんへ' },
        { text: '{駅前|えきまえ}に{新|あたら}しいカレー{屋|や}ができるらしい、と{先週|せんしゅう}{話|はな}しましたが、{今日|きょう}{確認|かくにん}してきました。カレー{屋|や}ではなく、{本屋|ほんや}でした。{看板|かんばん}の「カレー」は、{前|まえ}にあった{店|みせ}の{古|ふる}い{看板|かんばん}だったようです。' },
        { text: '{店長|てんちょう}は「よかった」と、とてもうれしそうでした。でも、{本屋|ほんや}ができたら、{駅前|えきまえ}に{来|く}る{人|ひと}が{増|ふ}えるかもしれません。{土曜日|どようび}のランチは、いつもより{忙|いそが}しくなるはずです。{土曜日|どようび}に{来|こ}られる{人|ひと}は、{店長|てんちょう}に{連絡|れんらく}してください。　ナタポン' },
      ],
    },
    {
      t: 'mcq',
      id: 'b20-lt5-doc',
      title: '読解 (3 câu)',
      items: [
        { q: '{駅前|えきまえ}にできるのは、{何|なん}の{店|みせ}ですか。', options: ['カレー{屋|や}', '{本屋|ほんや}', 'ラーメン{屋|や}', 'まだわからない'], correct: 1, why: '**カレー{屋|や}ではなく、{本屋|ほんや}でした** — ナタポン đã tự đi xác nhận.' },
        { q: '「カレー」の{看板|かんばん}について、メモと{合|あ}っているのはどれですか。', options: ['{新|あたら}しい{店|みせ}の{看板|かんばん}だ。', '{前|まえ}にあった{店|みせ}の{古|ふる}い{看板|かんばん}だったようだ。', 'ナタポンさんが{作|つく}った。', '{店長|てんちょう}が{見|み}つけた。'], correct: 1, why: '**{前|まえ}にあった{店|みせ}の{古|ふる}い{看板|かんばん}だったようです** — ナタポン đoán từ điều mình thấy.' },
        { q: 'ナタポンさんは、{土曜日|どようび}のランチはどうなると{考|かんが}えていますか。', options: ['ひまになるかもしれない', 'いつもより{忙|いそが}しくなるはずだ', '{店|みせ}が{休|やす}みになる', 'カレーが{売|う}れなくなる'], correct: 1, why: '**{土曜日|どようび}のランチは、いつもより{忙|いそが}しくなるはずです** — căn cứ: hiệu sách mở → người đến ga tăng.' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('{今日|きょう}{確認|かくにん}してきました。', 'Kyou kakunin shite kimashita.', 'Hôm nay tôi đã đi xác nhận rồi về.'),
        E('{前|まえ}にあった{店|みせ}の{古|ふる}い{看板|かんばん}だったようです。', 'Mae ni atta mise no furui kanban datta you desu.', 'Hình như là biển hiệu cũ của quán trước đây.'),
        E('{駅前|えきまえ}に{来|く}る{人|ひと}が{増|ふ}えるかもしれません。', 'Ekimae ni kuru hito ga fueru kamoshiremasen.', 'Người đến trước ga có thể sẽ tăng.'),
        E('{土曜日|どようび}のランチは、いつもより{忙|いそが}しくなるはずです。', 'Doyoubi no ranchi wa, itsumo yori isogashiku naru hazu desu.', 'Bữa trưa thứ Bảy chắc chắn sẽ bận hơn mọi khi.'),
      ],
    },
  ],
};

/* ═══════════════════════ ④ KIỂM TRA CHẶNG 16–20 ═══════════════════════ */

const KT_THANG_DIEM: Block = {
  t: 'table',
  caption: 'Cấu trúc & thang điểm Kiểm tra chặng 16–20 (mô phỏng JLPT N4 — 70 câu, 60 phút)',
  head: ['Phần', 'Mondai', 'Số câu', 'Thời gian', 'Quy đổi điểm'],
  rows: [
    ['Phần 1 — 言語知識（文字・語彙）', '問題1 漢字読み 7 · 問題2 表記 5 · 問題3 文脈規定 8 · 問題4 言い換え類義 4 · 問題5 用法 4', '28', '15′', 'gộp vào 言語知識・読解'],
    ['Phần 1 — 言語知識（文法）', '問題1 文法形式の判断 13 · 問題2 文の組み立て ★ 4 · 問題3 文章の文法 4', '21', '15′', 'gộp vào 言語知識・読解'],
    ['Phần 2 — 読解', '問題4 短文 2 · 問題5 中文 3 · 問題6 情報検索 2', '7', '12′', 'gộp vào 言語知識・読解'],
    ['Phần 2 — 聴解', '問題1 課題理解 3 · 問題2 ポイント理解 3 · 問題3 発話表現 3 · 問題4 即時応答 5', '14', '18′', 'riêng'],
    ['Tổng', '', '**70**', '**60′**', '**180 điểm** như JLPT: 言語知識・読解 **120** (56 câu, mỗi câu ≈ 2,14 điểm) + 聴解 **60** (14 câu, mỗi câu ≈ 4,3 điểm)'],
  ],
};

const KT_DAT: Block = {
  t: 'note',
  title: 'Điểm đạt — giống luật JLPT N4 (cần CẢ HAI điều kiện)',
  items: [
    '**Tổng ≥ 90 / 180** (≈ đúng **35 / 70** câu nếu đều các phần) **và** không phần nào dưới **điểm liệt**: 言語知識・読解 ≥ **38 / 120** (≈ **18 / 56** câu) · 聴解 ≥ **19 / 60** (≈ **5 / 14** câu). Thiếu điểm liệt một phần là TRƯỢT dù tổng cao — luật thật của JLPT.',
    '**Mục tiêu của khoá (để sang chặng 21–25 vững)**: **≥ 49 / 70 câu (70%)**. **≥ 60 câu**: rất tốt — sang Bài 21. **49–59**: đạt — ôn đúng các mẫu mình sai theo bảng "sai câu nào ôn bài nào". **35–48**: đạt mức JLPT nhưng chưa vững — làm lại Bài tập + Luyện thêm của các bài sai nhiều nhất. **< 35**: học lại chặng theo bảng, làm lại bài kiểm tra sau 1 tuần.',
    'Cách tính nhanh: điểm 言語知識・読解 = số câu đúng (Phần 1 + 読解) × 120 ÷ 56; điểm 聴解 = số câu đúng × 60 ÷ 14. Làm tròn xuống.',
  ],
};

const KT_1: Lesson = {
  id: 'b20-kiem-tra-1-moji-bunpo',
  kind: 'review',
  title: 'Kiểm tra chặng 16–20 · Phần 1 — 言語知識: 文字・語彙 (28 câu) + 文法 (21 câu)',
  goal: 'Làm phần Kiến thức ngôn ngữ của bài kiểm tra chặng theo đúng dạng đề JLPT N4 — đọc và chọn chữ Hán, chọn từ theo ngữ cảnh, tìm câu cùng nghĩa, chọn cách dùng đúng; chọn mẫu ngữ pháp, sắp xếp câu ★ và điền vào đoạn văn — phủ đều Bài 16 (khả năng, ý chí, つもり), 17 (ば, なら, し, すぎる, やすい), 18 (cho – nhận hành động, ておく, てある), 19 (てしまう, てみる, ところ, のに) và 20 (そう, ようだ, らしい, かもしれない, はず).',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: 'Trước khi làm',
      items: [
        'Bài kiểm tra chặng có **2 phần, 70 câu, 60 phút** — đúng bốn mảng của JLPT N4: 文字・語彙, 文法, 読解, 聴解. Đây là **Phần 1** (49 câu, **30 phút**). Phần 2 (読解 + 聴解) ở mục ngay sau.',
        '**Bấm giờ, không mở bài, không tra từ.** Làm hết rồi mới bấm xem đáp án. Ghi lại số câu đúng của từng 問題 để tra bảng ôn ở cuối.',
        'Phủ đều 5 bài: mỗi 問題 có câu của **Bài 16, 17, 18, 19, 20**. Chữ Hán và từ vựng lấy đúng từ các bài đó.',
      ],
    },
    KT_THANG_DIEM,
    KT_DAT,

    /* ── 文字・語彙 ── */
    { t: 'h', text: '言語知識（文字・語彙）— 28 câu, 15 phút' },
    {
      t: 'mcq',
      id: 'b20-kt1-kanji-yomi',
      title: '問題1 漢字読み — ＿＿の ことばは ひらがなで どう かきますか（7 câu）',
      items: [
        { q: '（1）{明日|あした}、アルバイトの **面接** があります。', options: ['めんせつ', 'めんせっ', 'めんしょう', 'おもてせつ'], correct: 0, why: '**{面接|めんせつ}** (mensetsu) — chữ 面・接 Bài 16.' },
        { q: '（2）**将来**、{日本|にほん}の{会社|かいしゃ}で{働|はたら}きたいです。', options: ['じょうらい', 'しょうらい', 'しょらい', 'しょうれい'], correct: 1, why: '**{将来|しょうらい}** (shourai) — chữ 将 Bài 16.' },
        { q: '（3）{船|ふね}が **港** に{着|つ}きました。', options: ['みずうみ', 'しま', 'みなと', 'こう'], correct: 2, why: '**{港|みなと}** (minato) — đứng riêng đọc kun; 湖 (みずうみ), 島 (しま) cùng Bài 17.' },
        { q: '（4）{駅|えき}までご **案内** します。', options: ['あんない', 'あんうち', 'あない', 'あんだい'], correct: 0, why: '**{案内|あんない}** (annai) — chữ 案・内 Bài 17.' },
        { q: '（5）{借|か}りた{本|ほん}を{友達|ともだち}に **返** しました。', options: ['もど', 'かえ', 'へん', 'か'], correct: 1, why: '**{返|かえ}しました** (kaeshimashita) — chữ 返 Bài 18. {戻|もど}す là "trả về chỗ cũ".' },
        { q: '（6）お{金|かね}がなくて、**困** っています。', options: ['こわ', 'こん', 'こま', 'くる'], correct: 2, why: '**{困|こま}っています** (komatte imasu) — chữ 困 Bài 19.' },
        { q: '（7）{最近|さいきん}、{先生|せんせい}の **様子** が{少|すこ}し{変|へん}です。', options: ['ようす', 'ようこ', 'さまこ', 'さます'], correct: 0, why: '**{様子|ようす}** (yousu) — chữ 様 Bài 20.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b20-kt1-hyouki',
      title: '問題2 表記 — ＿＿の ことばは どう かきますか（5 câu）',
      items: [
        { q: '（8）{面接|めんせつ}で **しつもん** に{答|こた}えました。', options: ['貭問', '質門', '質問', '資問'], correct: 2, why: '**質問** — chữ 質・問 Bài 16 (門 là "cửa", thiếu 口).' },
        { q: '（9）この{荷物|にもつ}はとても **おもい** です。', options: ['動い', '重い', '量い', '里い'], correct: 1, why: '**重い** — chữ 重 Bài 17.' },
        { q: '（10）{新|あたら}しい{家|いえ}には{広|ひろ}い **にわ** があります。', options: ['庭', '廷', '底', '庁'], correct: 0, why: '**庭** — chữ 庭 Bài 18 (广 + 廷).' },
        { q: '（11）{財布|さいふ}を{落|お}としたので、**けいさつ** に{行|い}きました。', options: ['驚察', '警祭', '敬察', '警察'], correct: 3, why: '**警察** — chữ 警・察 Bài 19 (警 dưới là 言; 察 có 宀).' },
        { q: '（12）**じつは**、{私|わたし}も{知|し}りませんでした。', options: ['美は', '実は', '室は', '宝は'], correct: 1, why: '**実は** — chữ 実 Bài 20.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b20-kt1-bunmyaku',
      title: '問題3 文脈規定 — （　）に なにを いれますか（8 câu）',
      items: [
        { q: '（13）{駅前|えきまえ}のコンビニのアルバイトに（　）しました。', options: ['{募集|ぼしゅう}', '{応募|おうぼ}', '{面接|めんせつ}', '{条件|じょうけん}'], correct: 1, why: 'Người đi xin việc = **{応募|おうぼ}する** (Bài 16). {募集|ぼしゅう} là bên tuyển.' },
        { q: '（14）すみません、{明日|あした}は（　）が{悪|わる}いので、{来週|らいしゅう}にしてもいいですか。', options: ['{都合|つごう}', '{予定|よてい}', '{自信|じしん}', '{夢|ゆめ}'], correct: 0, why: '**{都合|つごう}が{悪|わる}い** = không tiện (Bài 16).' },
        { q: '（15）{旅行|りょこう}の（　）は{三万円|さんまんえん}ぐらいです。', options: ['{割引|わりびき}', '{往復|おうふく}', '{予算|よさん}', '{観光|かんこう}'], correct: 2, why: 'Ngân sách = **{予算|よさん}** (Bài 17).' },
        { q: '（16）{初|はじ}めての{町|まち}で、{道|みち}に（　）しまいました。', options: ['{迷|まよ}って', '{乗|の}り{換|か}えて', '{案内|あんない}して', '{足|た}りて'], correct: 0, why: '**{道|みち}に{迷|まよ}う** = lạc đường (Bài 17).' },
        { q: '（17）{引|ひ}っ{越|こ}しの{荷物|にもつ}を（　）に{入|い}れました。', options: ['{鏡|かがみ}', '{段|だん}ボール', '{壁|かべ}', '{棚|たな}'], correct: 1, why: 'Đóng đồ vào **{段|だん}ボール** (thùng các-tông — Bài 18).' },
        { q: '（18）{重|おも}い{荷物|にもつ}を{運|はこ}んでくれて、{本当|ほんとう}に（　）。', options: ['{頼|たの}みました', '{戻|もど}りました', '{助|たす}かりました', '{寄|よ}りました'], correct: 2, why: 'Được giúp → **{助|たす}かりました** (đỡ quá — Bài 18).' },
        { q: '（19）うっかりテーブルにコーヒーを（　）しまいました。', options: ['{拾|ひろ}って', 'こぼして', '{混|ま}ぜて', '{焦|こ}げて'], correct: 1, why: 'Làm đổ chất lỏng = **こぼす** (Bài 19).' },
        { q: '（20）そんなうわさは、すぐに（　）ないほうがいいですよ。', options: ['{信|しん}じ', '{伝|つた}え', '{驚|おどろ}か', '{発表|はっぴょう}し'], correct: 0, why: '**{信|しん}じない** = đừng tin (Bài 20).' },
      ],
    },
    {
      t: 'mcq',
      id: 'b20-kt1-iikae',
      title: '問題4 言い換え類義 — ＿＿の ぶんと だいたい おなじ いみの ぶんは どれですか（4 câu）',
      items: [
        { q: '（21）この{仕事|しごと}は、{私|わたし}には **{無理|むり}です**。', options: ['この{仕事|しごと}は、{私|わたし}にはできません。', 'この{仕事|しごと}は、{私|わたし}が{好|す}きです。', 'この{仕事|しごと}は、{私|わたし}が{得意|とくい}です。', 'この{仕事|しごと}は、{私|わたし}が{決|き}めました。'], correct: 0, why: '{無理|むり} (Bài 16) = không làm được ≈ **できません**.' },
        { q: '（22）この{道|みち}は{狭|せま}くて、**{運転|うんてん}しにくい** です。', options: ['{運転|うんてん}するのが{簡単|かんたん}です。', '{運転|うんてん}するのが{難|むずか}しいです。', '{運転|うんてん}してはいけません。', '{運転|うんてん}したくないです。'], correct: 1, why: 'Vます + にくい (Bài 17) = khó làm ≈ **{運転|うんてん}するのが{難|むずか}しい**.' },
        { q: '（23）{約束|やくそく}を **うっかり{忘|わす}れてしまいました**。', options: ['わざと{忘|わす}れました。', '{忘|わす}れるつもりはありませんでしたが、{忘|わす}れました。', 'まだ{覚|おぼ}えています。', '{忘|わす}れてもいいと{思|おも}いました。'], correct: 1, why: 'うっかり (Bài 19) = sơ ý, không cố ý ≈ **{忘|わす}れるつもりはなかった**.' },
        { q: '（24）{彼|かれ}は **うそをつきました**。', options: ['{彼|かれ}は{本当|ほんとう}のことを{言|い}いました。', '{彼|かれ}は{本当|ほんとう}じゃないことを{言|い}いました。', '{彼|かれ}は{何|なに}も{言|い}いませんでした。', '{彼|かれ}はうわさを{聞|き}きました。'], correct: 1, why: 'うそをつく (Bài 20) = nói điều **không thật**.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b20-kt1-youhou',
      title: '問題5 用法 — つぎの ことばの つかいかたで いちばん いい ものを えらんでください（4 câu）',
      items: [
        { q: '（25）{自信|じしん}', options: ['{明日|あした}は{自信|じしん}が{悪|わる}いので、{休|やす}みます。', '{毎日|まいにち}{練習|れんしゅう}したので、{試合|しあい}には{自信|じしん}があります。', 'この{店|みせ}の{自信|じしん}はとても{安|やす}いです。', '{自信|じしん}を{予約|よやく}しておきました。'], correct: 1, why: '**{自信|じしん}がある** = tự tin (Bài 16). Câu 1 nhầm với {都合|つごう}.' },
        { q: '（26）{届|とど}く', options: ['{昨日|きのう}{注文|ちゅうもん}した{本|ほん}が、{今日|きょう}{届|とど}きました。', '{毎朝|まいあさ}{七時|しちじ}に{学校|がっこう}へ{届|とど}きます。', '{友達|ともだち}に{電話|でんわ}を{届|とど}きました。', '{高|たか}いので、{手|て}が{届|とど}けます。'], correct: 0, why: '**N が{届|とど}く** = (đồ) được gửi tới (Bài 18). Người đi học thì {着|つ}く／{行|い}く.' },
        { q: '（27）せっかく', options: ['せっかく{雨|あめ}が{降|ふ}って、{寒|さむ}いです。', 'せっかく{作|つく}ったのに、{誰|だれ}も{食|た}べてくれませんでした。', 'せっかく{電車|でんしゃ}に{乗|の}り{遅|おく}れてしまいました。', '{財布|さいふ}をせっかく{落|お}としました。'], correct: 1, why: '**せっかく ～のに** = đã mất công… vậy mà (Bài 19).' },
        { q: '（28）{確認|かくにん}する', options: ['{出|で}かける{前|まえ}に、{窓|まど}が{閉|し}まっているか{確認|かくにん}しました。', '{友達|ともだち}の{誕生日|たんじょうび}に、{花|はな}を{確認|かくにん}しました。', '{毎朝|まいあさ}、コーヒーを{確認|かくにん}します。', '{天気|てんき}がよくて、{空|そら}が{確認|かくにん}しています。'], correct: 0, why: '**{確認|かくにん}する** = kiểm tra lại cho chắc (Bài 20). ～か{確認|かくにん}する: kiểm tra xem có… không.' },
      ],
    },

    /* ── 文法 ── */
    { t: 'h', text: '言語知識（文法）— 21 câu, 15 phút' },
    {
      t: 'mcq',
      id: 'b20-kt1-bunpou',
      title: '問題1 文法形式の判断 — （　）に なにを いれますか（13 câu）',
      items: [
        { q: '（29）{私|わたし}はひらがなとカタカナなら（　）。', options: ['{読|よ}めます', '{読|よ}まれます', '{読|よ}もう', '{読|よ}みそう'], correct: 0, why: 'Năng lực → thể khả năng **{読|よ}めます** (Bài 16).' },
        { q: '（30）A「{週末|しゅうまつ}、{一緒|いっしょ}に{映画|えいが}を（　）か。」 B「うん、いいね。」', options: ['{見|み}られる', '{見|み}よう', '{見|み}れば', '{見|み}そう'], correct: 1, why: 'Rủ thân mật → thể ý chí **{見|み}ようか** (Bài 16).' },
        { q: '（31）{夏休|なつやす}みは{国|くに}へ{帰|かえ}る（　）です。もう{切符|きっぷ}も{買|か}いました。', options: ['つもり', 'はず', 'らしい', 'よう'], correct: 0, why: 'Ý định của chính mình → **つもり** (Bài 16). はず／らしい không dùng cho ý định bản thân (Bài 20).' },
        { q: '（32）{道|みち}がわからなければ、{駅員|えきいん}さんに（　）いいですよ。', options: ['{聞|き}くと', '{聞|き}けば', '{聞|き}いても', '{聞|き}くなら'], correct: 1, why: 'Khuyên cách làm: **～ばいいです** (Bài 17).' },
        { q: '（33）A「{京都|きょうと}へ{行|い}きたいんです。」 B「{京都|きょうと}（　）、{秋|あき}がいちばんきれいですよ。」', options: ['なら', 'ば', 'たら', 'と'], correct: 0, why: 'Nhận lời người kia rồi khuyên → **N なら** (Bài 17).' },
        { q: '（34）{昨日|きのう}はお{酒|さけ}を（　）、{今朝|けさ}は{頭|あたま}が{痛|いた}いです。', options: ['{飲|の}んですぎて', '{飲|の}みすぎて', '{飲|の}むすぎて', '{飲|の}みすぎに'], correct: 1, why: 'Vます + **すぎる** → thể て **{飲|の}みすぎて** (Bài 17).' },
        { q: '（35）この{靴|くつ}は{軽|かる}くて、とても（　）です。', options: ['{歩|ある}くやすい', '{歩|ある}いてやすい', '{歩|ある}きやすい', '{歩|ある}きにくい'], correct: 2, why: 'Nhẹ → dễ đi: Vます + **やすい** (Bài 17).' },
        { q: '（36）{引|ひ}っ{越|こ}しのとき、{友達|ともだち}が{荷物|にもつ}を{運|はこ}んで（　）。', options: ['あげました', 'くれました', 'もらいました', 'おきました'], correct: 1, why: 'Người khác làm cho MÌNH → **～てくれました** (Bài 18).' },
        { q: '（37）{壁|かべ}に{町|まち}の{地図|ちず}が{貼|は}って（　）。', options: ['あります', 'おきます', 'しまいます', 'みます'], correct: 0, why: 'Trạng thái còn lại do ai đó cố ý làm: N が + tha động từ て + **ある** (Bài 18).' },
        { q: '（38）{電車|でんしゃ}の{中|なか}に{傘|かさ}を{忘|わす}れて（　）。', options: ['みました', 'おきました', 'しまいました', 'ありました'], correct: 2, why: 'Lỡ để quên → **～てしまいました** (Bài 19).' },
        { q: '（39）A「もう{家|いえ}を{出|で}た？」 B「ううん、{今|いま}から{出|で}る（　）。」', options: ['ところ', 'のに', 'はず', 'そう'], correct: 0, why: 'Sắp làm ngay bây giờ: Vる + **ところ** (Bài 19).' },
        { q: '（40）{薬|くすり}を{飲|の}んだ（　）、{熱|ねつ}が{下|さ}がりません。', options: ['ので', 'から', 'のに', 'ても'], correct: 2, why: 'Đã uống thuốc vậy mà không hạ sốt → **のに** (Bài 19).' },
        { q: '（41）{空|そら}が{暗|くら}くなってきました。{今|いま}にも{雨|あめ}が（　）です。', options: ['{降|ふ}るそう', '{降|ふ}りそう', '{降|ふ}るらしい', '{降|ふ}るはず'], correct: 1, why: 'Thấy dấu hiệu, {今|いま}にも → **{降|ふ}りそう** (Bài 20).' },
      ],
    },
    {
      t: 'mcq',
      id: 'b20-kt1-kumitate',
      title: '問題2 文の組み立て — ★に はいる ものは どれですか（4 câu）',
      items: [
        { q: '（42）{卒業|そつぎょう}したら、＿＿ ＿＿ ★ ＿＿ です。（{国|くに}に／つもり／{帰|かえ}らない／しばらく）', options: ['{国|くに}に', 'つもり', '{帰|かえ}らない', 'しばらく'], correct: 2, why: 'Câu đúng: {卒業|そつぎょう}したら、**しばらく {国|くに}に {帰|かえ}らない つもり** です. Ô ★ (thứ 3) = **{帰|かえ}らない** (Bài 16 — ～ないつもり).' },
        { q: '（43）お{客|きゃく}さんが{来|く}る ＿＿ ＿＿ ★ ＿＿ ください。（{部屋|へや}を／{前|まえ}に／おいて／{掃除|そうじ}して）', options: ['{部屋|へや}を', '{前|まえ}に', 'おいて', '{掃除|そうじ}して'], correct: 3, why: 'Câu đúng: お{客|きゃく}さんが{来|く}る **{前|まえ}に {部屋|へや}を {掃除|そうじ}して おいて** ください. Ô ★ (thứ 3) = **{掃除|そうじ}して** (Bài 18 — ～ておく).' },
        { q: '（44）この{服|ふく}、＿＿ ＿＿ ★ ＿＿ ですか。（みても／{着|き}て／いい／ちょっと）', options: ['みても', '{着|き}て', 'いい', 'ちょっと'], correct: 0, why: 'Câu đúng: この{服|ふく}、**ちょっと {着|き}て みても いい** ですか. Ô ★ (thứ 3) = **みても** (Bài 19 — ～てみる).' },
        { q: '（45）{九時|くじ}に{出発|しゅっぱつ}したから、＿＿ ＿＿ ★ ＿＿ です。（{着|つ}く／はず／{十時|じゅうじ}には／{空港|くうこう}に）', options: ['{着|つ}く', 'はず', '{十時|じゅうじ}には', '{空港|くうこう}に'], correct: 0, why: 'Câu đúng: **{十時|じゅうじ}には {空港|くうこう}に {着|つ}く はず** です. Ô ★ (thứ 3) = **{着|つ}く** (Bài 20 — ～はず).' },
      ],
    },
    {
      t: 'passage',
      title: '問題3 文章の文法 — マルコさんの作文「日本に来て一年」',
      intro: 'Đọc đoạn văn, rồi chọn từ đúng cho [46]–[49] ở câu hỏi ngay dưới.',
      paras: [
        { text: '{日本|にほん}に{来|き}て、もうすぐ{一年|いちねん}になります。{最初|さいしょ}のころは、{日本語|にほんご}があまり{話|はな}せなくて、{困|こま}ったことがたくさんありました。' },
        { text: '{一番|いちばん}{困|こま}ったのは{引|ひ}っ{越|こ}しのときです。{荷物|にもつ}が{多|おお}くて、{一人|ひとり}では{運|はこ}べませんでした。そのとき、{隣|となり}の{部屋|へや}の{山口|やまぐち}さんが{手伝|てつだ}って **[46]** 。{本当|ほんとう}に{助|たす}かりました。' },
        { text: 'アルバイトでも、よく{失敗|しっぱい}しました。{注文|ちゅうもん}を{何度|なんど}も{間違|まちが}えて **[47]** 、{店長|てんちょう}に{謝|あやま}りました。でも、{店長|てんちょう}は「{気|き}にしなくていいよ」と{言|い}ってくれました。' },
        { text: '{最近|さいきん}、{来年|らいねん}から{店|みせ}の{近|ちか}くに{大|おお}きいスーパーができる **[48]** 。{店長|てんちょう}は{少|すこ}し{心配|しんぱい}そうです。でも、ここの{料理|りょうり}はおいしいから、お{客|きゃく}さんは{来|き}てくれる **[49]** 。{私|わたし}もこれからもっとがんばるつもりです。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b20-kt1-bunshou',
      title: '問題3 文章の文法 — [46]〜[49]に なにを いれますか（4 câu）',
      items: [
        { q: '[46]', options: ['あげました', 'くれました', 'もらいました', 'おきました'], correct: 1, why: '山口さん là chủ ngữ (が) làm giúp マルコ (người viết) → **～てくれました** (Bài 18). ～てもらう cần "山口さん**に**".' },
        { q: '[47]', options: ['しまって', 'みて', 'おいて', 'あって'], correct: 0, why: 'Lỡ nhầm (đáng tiếc) rồi xin lỗi → **～てしまって** (Bài 19).' },
        { q: '[48]', options: ['そうな', 'らしいです', 'つもりです', 'ところです'], correct: 1, why: 'Tin nghe được (chưa chắc) về việc sắp có siêu thị → **らしいです** (Bài 20). そうな phải đứng trước danh từ; つもり là ý định của người nói; ところ là thời điểm hành động.' },
        { q: '[49]', options: ['はずです', 'ところでした', 'つもりです', 'そうでした'], correct: 0, why: 'Có căn cứ (đồ ăn ngon — vế ～から) → **はずです** (Bài 20). つもり chỉ nói ý định của chính người nói, không dùng cho お{客|きゃく}さん; ところでした／そうでした sai thì và sai nghĩa.' },
      ],
    },
    {
      t: 'table',
      caption: 'Phần 1 — sai câu nào ôn Bài nào / mẫu nào',
      head: ['Câu', 'Nội dung', 'Ôn ở đâu'],
      rows: [
        ['1, 2, 8, 13, 14, 21, 25', 'chữ Hán 面接・将来・質問 · từ 応募・都合・無理・自信', 'Bài 16 — Từ vựng + Chữ Hán (b16-tu-vung, b16-han-tu)'],
        ['3, 4, 9, 15, 16, 22', 'chữ Hán 港・案内・重 · từ 予算・迷う · ～にくい', 'Bài 17 — Từ vựng + Chữ Hán; Ngữ pháp ⑤ (やすい・にくい)'],
        ['5, 10, 17, 18, 26', 'chữ Hán 返・庭 · từ 段ボール・助かる・届く', 'Bài 18 — Từ vựng + Chữ Hán'],
        ['6, 11, 19, 23, 27', 'chữ Hán 困・警察 · từ こぼす・うっかり・せっかく', 'Bài 19 — Từ vựng + Chữ Hán'],
        ['7, 12, 20, 24, 28', 'chữ Hán 様子・実 · từ 信じる・うそ・確認', 'Bài 20 — Từ vựng + Chữ Hán'],
        ['29, 30, 31, 42', 'thể khả năng · thể ý chí · ～つもり／～ないつもり', 'Bài 16 — Ngữ pháp ① ② ③'],
        ['32, 33, 34, 35', '～ばいい · ～なら · ～すぎる · ～やすい', 'Bài 17 — Ngữ pháp ① ② ④ ⑤'],
        ['36, 37, 43, 46', '～てくれる · ～てある · ～ておく', 'Bài 18 — Ngữ pháp ① ② ③'],
        ['38, 39, 40, 44, 47', '～てしまう · ～ところ · ～のに · ～てみる', 'Bài 19 — Ngữ pháp ① ② ③ ④'],
        ['41, 45, 48, 49 (+ 31)', '～そう · ～はず · ～らしい (và はず ↔ つもり)', 'Bài 20 — Ngữ pháp ① ③ ⑤ + bảng "Bảng chọn nhanh"'],
      ],
    },
  ],
};

const KT_2: Lesson = {
  id: 'b20-kiem-tra-2-dokkai-choukai',
  kind: 'review',
  title: 'Kiểm tra chặng 16–20 · Phần 2 — 読解 (7 câu) + 聴解 (14 câu) · thang điểm & bảng ôn',
  goal: 'Làm phần Đọc và Nghe của bài kiểm tra chặng theo đúng dạng đề JLPT N4 — đọc thông báo, email, bài văn và bảng tuyển dụng để tìm đúng thông tin; nghe để biết việc phải làm trước, nắm lý do / điểm chính, chọn câu nói đúng tình huống và đáp nhanh — rồi quy đổi điểm 180, xét điểm liệt và tra bảng "sai câu nào ôn bài nào" cho cả chặng 16–20.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: 'Phần 2 — làm thế nào',
      items: [
        '**読解 (12 phút)**: đọc câu hỏi trước, gạch chân từ khoá, rồi mới đọc bài. 情報検索: lập bảng điều kiện rồi loại dần.',
        '**聴解 (18 phút)**: mỗi bài nghe **một lần** như thi thật (bấm 🔊 một lần, không mở lời thoại) rồi chọn ngay. Làm xong cả phần mới mở lời thoại để soát.',
        'Ghi số câu đúng: 読解 (câu 50–56) và 聴解 (câu 57–70). Cuối mục có cách quy đổi điểm 180, điểm liệt và bảng ôn.',
      ],
    },

    /* ── 読解 ── */
    { t: 'h', text: '読解 — 7 câu, 12 phút' },
    { t: 'h', text: '問題4 内容理解（短文）— 2 bài' },
    {
      t: 'passage',
      title: '（50）{本田先生|ほんだせんせい}からのお{知|し}らせ',
      intro: 'Thông báo dán ở cửa lớp.',
      paras: [
        { text: 'みなさんへ' },
        { text: '{来週|らいしゅう}の{発表|はっぴょう}は{木曜日|もくようび}のはずでしたが、{金曜日|きんようび}に{変|か}わりました。{教室|きょうしつ}も301から205に{変|か}わります。' },
        { text: '{発表|はっぴょう}の{資料|しりょう}は、{水曜日|すいようび}までに{私|わたし}にメールで{送|おく}っておいてください。{当日|とうじつ}、{印刷|いんさつ}して{持|も}ってくる{必要|ひつよう}はありません。わからないことがあれば、{研究室|けんきゅうしつ}に{来|き}てください。　{本田|ほんだ}' },
      ],
    },
    {
      t: 'mcq',
      id: 'b20-kt2-tanbun-1',
      title: '問題4（50）',
      items: [
        { q: '（50）{学生|がくせい}は{水曜日|すいようび}までに{何|なに}をしなければなりませんか。', options: ['{資料|しりょう}を{印刷|いんさつ}して{先生|せんせい}に{渡|わた}す', '{資料|しりょう}をメールで{先生|せんせい}に{送|おく}る', '205の{教室|きょうしつ}で{発表|はっぴょう}の{練習|れんしゅう}をする', '{研究室|けんきゅうしつ}へ{行|い}って{先生|せんせい}に{会|あ}う'], correct: 1, why: '**{資料|しりょう}は、{水曜日|すいようび}までに{私|わたし}にメールで{送|おく}っておいてください** (～ておく — Bài 18). In không cần; phòng nghiên cứu chỉ khi có thắc mắc. 〔Meeru de okutte oite kudasai.〕' },
      ],
    },
    {
      t: 'passage',
      title: '（51）{鈴木|すずき}さんからワンさんへのメール',
      intro: 'Email chị 鈴木 (chị khoá trên ở cửa hàng tiện lợi — Bài 16) gửi ワン.',
      paras: [
        { text: 'ワンさん　お{疲|つか}れさま。' },
        { text: '{来週|らいしゅう}の{土曜日|どようび}、{急|きゅう}に{用事|ようじ}ができて、アルバイトに{行|い}けなくなってしまいました。もしよかったら、{私|わたし}の{代|か}わりに{入|はい}ってもらえませんか。{午前|ごぜん}9{時|じ}から{午後|ごご}3{時|じ}までです。' },
        { text: '{無理|むり}なら、ほかの{人|ひと}に{頼|たの}んでみますから、{気|き}にしないでね。{今日|きょう}{中|じゅう}に{返事|へんじ}をくれると{助|たす}かります。　{鈴木|すずき}' },
      ],
    },
    {
      t: 'mcq',
      id: 'b20-kt2-tanbun-2',
      title: '問題4（51）',
      items: [
        { q: '（51）{鈴木|すずき}さんはワンさんに{何|なに}をしてほしいですか。', options: ['{土曜日|どようび}に{一緒|いっしょ}にアルバイトをしてほしい', '{土曜日|どようび}に{鈴木|すずき}さんの{代|か}わりにアルバイトに{入|はい}ってほしい', 'ほかの{人|ひと}にアルバイトを{頼|たの}んでほしい', '{来週|らいしゅう}{用事|ようじ}を{手伝|てつだ}ってほしい'], correct: 1, why: '**{私|わたし}の{代|か}わりに{入|はい}ってもらえませんか** (～てもらえませんか — Bài 18). Nhờ người khác là việc chị Suzuki tự làm nếu ワン không được. 〔Watashi no kawari ni haitte moraemasen ka.〕' },
      ],
    },
    { t: 'h', text: '問題5 内容理解（中文）— 1 bài, 3 câu' },
    {
      t: 'passage',
      title: '（52）〜（54）{初|はじ}めての{一人旅|ひとりたび}　　ダニエル',
      intro: 'Bài viết của ダニエル cho báo tường của lớp.',
      paras: [
        { label: '①', text: '{先月|せんげつ}、{初|はじ}めて{一人|ひとり}で{旅行|りょこう}しました。{行|い}き{先|さき}は{北|きた}の{山|やま}の{中|なか}にある、{湖|みずうみ}のきれいな{小|ちい}さい{町|まち}です。ガイドブックには「{景色|けしき}がいいし、{観光客|かんこうきゃく}も{少|すく}ないし、ゆっくりできる{町|まち}だ」と{書|か}いてありました。{私|わたし}は{一か月|いっかげつ}{前|まえ}に{割引|わりびき}のある{旅館|りょかん}を{予約|よやく}して、{特急|とっきゅう}の{時間|じかん}も{調|しら}べておきました。' },
        { label: '②', text: 'ところが、{当日|とうじつ}は{朝|あさ}から{雪|ゆき}が{降|ふ}っていて、{特急|とっきゅう}が{一時間|いちじかん}も{遅|おく}れてしまいました。それで、{乗|の}り{換|か}えの{電車|でんしゃ}に{乗|の}れませんでした。{次|つぎ}の{電車|でんしゃ}を{待|ま}っている{間|あいだ}に、{駅|えき}の{近|ちか}くで{道|みち}に{迷|まよ}ってしまいましたが、{近|ちか}くのお{店|みせ}のおばあさんが{親切|しんせつ}に{駅|えき}まで{連|つ}れていってくれました。' },
        { label: '③', text: 'やっと{町|まち}に{着|つ}くと、{驚|おどろ}きました。{観光客|かんこうきゃく}がとても{多|おお}かったのです。{旅館|りょかん}の{人|ひと}の{話|はなし}では、{先週|せんしゅう}テレビの{番組|ばんぐみ}がこの{町|まち}を{紹介|しょうかい}して、{急|きゅう}に{人気|にんき}が{出|で}たそうです。ガイドブックの{情報|じょうほう}は{少|すこ}し{古|ふる}かったようです。' },
        { label: '④', text: '{計画|けいかく}どおりにはいきませんでしたが、{夜|よる}、{旅館|りょかん}の{窓|まど}から{見|み}た{雪|ゆき}の{湖|みずうみ}は、まるで{絵|え}のようでした。{困|こま}ったときに{助|たす}けてくれた{人|ひと}のことも{忘|わす}れられません。{旅行|りょこう}は、{計画|けいかく}どおりにいかないほうが{思|おも}い{出|で}になるのかもしれないと{思|おも}いました。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b20-kt2-chuubun',
      title: '問題5（52）〜（54）',
      items: [
        { q: '（52）ダニエルさんは、どうして{乗|の}り{換|か}えの{電車|でんしゃ}に{乗|の}れませんでしたか。', options: ['{寝坊|ねぼう}してしまったから', '{道|みち}に{迷|まよ}ってしまったから', '{雪|ゆき}で{特急|とっきゅう}が{遅|おく}れたから', '{特急|とっきゅう}の{時間|じかん}を{間違|まちが}えたから'], correct: 2, why: 'Đoạn ②: **{特急|とっきゅう}が{一時間|いちじかん}も{遅|おく}れてしまいました。それで、{乗|の}り{換|か}えの{電車|でんしゃ}に{乗|の}れませんでした**. Lạc đường là chuyện SAU đó. (～てしまう — Bài 19)' },
        { q: '（53）{町|まち}について、ガイドブックと{違|ちが}っていたことは{何|なん}ですか。', options: ['{景色|けしき}がきれいではなかった', '{観光客|かんこうきゃく}が{多|おお}かった', '{旅館|りょかん}が{高|たか}かった', '{湖|みずうみ}がなかった'], correct: 1, why: 'Sách viết **{観光客|かんこうきゃく}も{少|すく}ない** (～し — Bài 17), thực tế **{観光客|かんこうきゃく}がとても{多|おお}かった** — vì vừa lên TV (～そうです — nghe chủ nhà trọ nói). 〔Kankoukyaku ga totemo ookatta.〕' },
        { q: '（54）ダニエルさんがこの{文章|ぶんしょう}でいちばん{言|い}いたいことは{何|なん}ですか。', options: ['ガイドブックの{情報|じょうほう}を{信|しん}じてはいけない。', '{一人|ひとり}で{旅行|りょこう}するのは{危|あぶ}ない。', '{計画|けいかく}どおりにいかなくても、いい{思|おも}い{出|で}になる{旅行|りょこう}だった。', '{雪|ゆき}の{日|ひ}は{旅行|りょこう}しないほうがいい。'], correct: 2, why: 'Ý chính ở đoạn ④: **{計画|けいかく}どおりにはいきませんでしたが**… **{計画|けいかく}どおりにいかないほうが{思|おも}い{出|で}になるのかもしれない** (～かもしれない — Bài 20).' },
      ],
    },
    { t: 'h', text: '問題6 情報検索 — 1 bài, 2 câu' },
    {
      t: 'passage',
      title: '（55）〜（56）アルバイト{募集|ぼしゅう}（みどり{駅|えき}の{近|ちか}く）',
      intro: 'リン tìm việc làm thêm. Cô học đến 5 giờ chiều các ngày trong tuần, chỉ muốn làm thứ Bảy – Chủ nhật, chưa tự tin dùng kính ngữ, và cần chỗ trả tiền đi lại vì nhà xa ga.',
      paras: [
        { label: 'A', text: 'コンビニ「さくらマート」　{月|げつ}〜{金|きん} 17:00〜22:00　{時給|じきゅう} 1,100{円|えん}　{交通費|こうつうひ}あり　{日本語|にほんご}：{簡単|かんたん}な{会話|かいわ}ができる{人|ひと}' },
        { label: 'B', text: 'レストラン「ひまわり{食堂|しょくどう}」　{土|ど}・{日|にち} 10:00〜16:00　{時給|じきゅう} 1,050{円|えん}　{交通費|こうつうひ}あり（1{日|にち}500{円|えん}まで）　{日本語|にほんご}：{簡単|かんたん}な{会話|かいわ}ができる{人|ひと}' },
        { label: 'C', text: 'ホテルのフロント　{土|ど}・{日|にち} 9:00〜17:00　{時給|じきゅう} 1,300{円|えん}　{交通費|こうつうひ}なし　{日本語|にほんご}：{敬語|けいご}が{上手|じょうず}に{使|つか}える{人|ひと}' },
        { label: 'D', text: '{本屋|ほんや}「ことば{堂|どう}」　{土|ど}・{日|にち} 13:00〜18:00　{時給|じきゅう} 1,000{円|えん}　{交通費|こうつうひ}なし　{日本語|にほんご}：{簡単|かんたん}な{会話|かいわ}ができる{人|ひと}' },
        { text: '※ どのアルバイトも、{面接|めんせつ}のときに{写真|しゃしん}を{貼|は}った{履歴書|りれきしょ}を{持|も}ってきてください。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b20-kt2-jouhou',
      title: '問題6（55）〜（56）',
      items: [
        { q: '（55）リンさんに{合|あ}うアルバイトはどれですか。', options: ['A', 'B', 'C', 'D'], correct: 1, why: 'A là ngày thường (loại). C cần **{敬語|けいご}が{上手|じょうず}** (loại). D **{交通費|こうつうひ}なし** (loại). Còn **B** — thứ Bảy, Chủ nhật, có tiền đi lại, chỉ cần hội thoại đơn giản.' },
        { q: '（56）リンさんがBで{毎週|まいしゅう}{土曜日|どようび}と{日曜日|にちようび}に{働|はたら}くと、1{週間|しゅうかん}でいくらもらえますか。{交通費|こうつうひ}は{毎回|まいかい}500{円|えん}かかります。', options: ['12,600{円|えん}', '13,100{円|えん}', '13,600{円|えん}', '15,600{円|えん}'], correct: 2, why: 'Mỗi ngày 10:00–16:00 = 6 giờ → 2 ngày 12 giờ × 1,050 = **12,600 円** + tiền đi lại 500 × 2 = 1,000 → **13,600 円**.' },
      ],
    },

    /* ── 聴解 ── */
    { t: 'h', text: '聴解 — 14 câu, 18 phút (mỗi bài nghe MỘT lần)' },
    { t: 'h', text: '問題1 課題理解 — 3 câu' },
    NG('b20-kt2-ng-57', '（57）{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか', '問題1 課題理解 — Bài 18: ～ておく, ～てくれる.', [
      ['ナレーター', 'ja-nu', '{引|ひ}っ{越|こ}しの{前|まえ}の{日|ひ}に、{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}が{話|はな}しています。{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Hikkoshi no mae no hi ni, otoko no hito to onna no hito ga hanashite imasu. Onna no hito wa kono ato mazu nani o shimasu ka.', 'Hôm trước ngày chuyển nhà, một người đàn ông và một người phụ nữ đang nói chuyện. Sau đây người phụ nữ trước tiên sẽ làm gì?'],
      ['マルコ', 'ja-nam', 'リンさん、{本|ほん}はもう{全部|ぜんぶ}{箱|はこ}に{入|い}れておいたよ。', 'Rin-san, hon wa mou zenbu hako ni irete oita yo.', 'Lin ơi, sách mình cho hết vào thùng rồi nhé.'],
      ['リン', 'ja-nu', 'ありがとう。じゃ、{私|わたし}は{台所|だいどころ}のお{皿|さら}を{包|つつ}もうかな。', 'Arigatou. Ja, watashi wa daidokoro no osara o tsutsumou ka na.', 'Cảm ơn. Vậy mình gói bát đĩa trong bếp nhỉ.'],
      ['マルコ', 'ja-nam', 'お{皿|さら}は、{明日|あした}{引|ひ}っ{越|こ}し{屋|や}さんが{包|つつ}んでくれるらしいよ。{契約|けいやく}の{紙|かみ}に{書|か}いてあった。', 'Osara wa, ashita hikkoshiya-san ga tsutsunde kureru rashii yo. Keiyaku no kami ni kaite atta.', 'Bát đĩa thì nghe đâu mai bên chuyển nhà gói cho đấy. Trên giấy hợp đồng có ghi.'],
      ['リン', 'ja-nu', 'そうなの。じゃ、{冷蔵庫|れいぞうこ}の{中|なか}を{片付|かたづ}けようか。', 'Sou na no. Ja, reizouko no naka o katazukeyou ka.', 'Thế à. Vậy dọn tủ lạnh nhé.'],
      ['マルコ', 'ja-nam', 'それは{今夜|こんや}でいいよ。それより、{明日|あした}の{朝|あさ}ガスの{人|ひと}が{来|く}るはずだから、{時間|じかん}をガス{会社|がいしゃ}に{電話|でんわ}で{確認|かくにん}しておいたほうがいいよ。{夕方|ゆうがた}で{受付|うけつけ}が{終|お}わっちゃうから。', 'Sore wa kon\'ya de ii yo. Sore yori, ashita no asa gasu no hito ga kuru hazu da kara, jikan o gasu-gaisha ni denwa de kakunin shite oita hou ga ii yo. Yuugata de uketsuke ga owacchau kara.', 'Cái đó tối nay làm cũng được. Quan trọng hơn là sáng mai chắc chắn người bên ga sẽ đến, nên gọi công ty ga xác nhận giờ trước đi. Chiều tối là họ hết nhận điện thoại rồi.'],
      ['リン', 'ja-nu', 'あ、そうだね。じゃ、まず{電話|でんわ}するね。', 'A, sou da ne. Ja, mazu denwa suru ne.', 'À đúng rồi. Vậy mình gọi điện trước đã.'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Onna no hito wa kono ato mazu nani o shimasu ka.', 'Sau đây người phụ nữ trước tiên sẽ làm gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b20-kt2-ng-57-q',
      title: '（57）',
      items: [
        { q: '（57）{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', options: ['{本|ほん}を{箱|はこ}に{入|い}れる', 'お{皿|さら}を{包|つつ}む', '{冷蔵庫|れいぞうこ}の{中|なか}を{片付|かたづ}ける', 'ガス{会社|がいしゃ}に{電話|でんわ}する'], correct: 3, why: 'Sách → **{入|い}れておいた** (đã xong); bát đĩa → bên chuyển nhà **{包|つつ}んでくれるらしい**; tủ lạnh → **{今夜|こんや}でいい**. Câu chốt: **じゃ、まず{電話|でんわ}するね**.' },
      ],
    },
    NG('b20-kt2-ng-58', '（58）{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか', '問題1 課題理解 — Bài 17: ～ば, ～なら, 指定席／自由席.', [
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}が{旅行|りょこう}の{相談|そうだん}をしています。{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Otoko no hito to onna no hito ga ryokou no soudan o shite imasu. Otoko no hito wa kono ato mazu nani o shimasu ka.', 'Một người đàn ông và một người phụ nữ đang bàn chuyện du lịch. Sau đây người đàn ông trước tiên sẽ làm gì?'],
      ['メアリー', 'ja-nu', 'ダニエルさん、{旅館|りょかん}は{私|わたし}が{予約|よやく}しておくね。{割引|わりびき}のプランがあるから。', 'Danieru-san, ryokan wa watashi ga yoyaku shite oku ne. Waribiki no puran ga aru kara.', 'Daniel, nhà trọ để mình đặt nhé. Vì có gói giảm giá.'],
      ['ダニエル', 'ja-nam', 'ありがとう。じゃ、{僕|ぼく}は{駅|えき}へ{行|い}って{特急|とっきゅう}の{切符|きっぷ}を{買|か}ってくるよ。', 'Arigatou. Ja, boku wa eki e itte tokkyuu no kippu o katte kuru yo.', 'Cảm ơn. Vậy mình ra ga mua vé tàu tốc hành nhé.'],
      ['メアリー', 'ja-nu', '{切符|きっぷ}なら、インターネットで{買|か}えば{一割|いちわり}{安|やす}くなるらしいよ。{駅|えき}まで{行|い}かなくてもいいし。', 'Kippu nara, intaanetto de kaeba ichiwari yasuku naru rashii yo. Eki made ikanakute mo ii shi.', 'Vé thì nghe nói mua trên mạng rẻ hơn 10% đấy. Lại không cần ra ga.'],
      ['ダニエル', 'ja-nam', 'そうなんだ。{指定席|していせき}と{自由席|じゆうせき}、どっちがいい？', 'Sou na n da. Shiteiseki to jiyuuseki, dotchi ga ii?', 'Thế à. Ghế đặt trước với ghế tự do, cái nào hơn?'],
      ['メアリー', 'ja-nu', '{連休|れんきゅう}だから、{自由席|じゆうせき}は{混|こ}みそう。{指定席|していせき}にしよう。', 'Renkyuu da kara, jiyuuseki wa komisou. Shiteiseki ni shiyou.', 'Kỳ nghỉ dài nên ghế tự do có vẻ sẽ đông. Lấy ghế đặt trước đi.'],
      ['ダニエル', 'ja-nam', 'わかった。じゃ、{今|いま}すぐインターネットで{指定席|していせき}を{買|か}うね。', 'Wakatta. Ja, ima sugu intaanetto de shiteiseki o kau ne.', 'Hiểu rồi. Vậy mình mua ghế đặt trước trên mạng ngay bây giờ.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Otoko no hito wa kono ato mazu nani o shimasu ka.', 'Sau đây người đàn ông trước tiên sẽ làm gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b20-kt2-ng-58-q',
      title: '（58）',
      items: [
        { q: '（58）{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか。', options: ['{旅館|りょかん}を{予約|よやく}する', '{駅|えき}へ{切符|きっぷ}を{買|か}いに{行|い}く', 'インターネットで{指定席|していせき}の{切符|きっぷ}を{買|か}う', 'インターネットで{自由席|じゆうせき}の{切符|きっぷ}を{買|か}う'], correct: 2, why: 'Nhà trọ → メアリー **{予約|よやく}しておく**; ra ga → đổi kế hoạch vì mạng **rẻ hơn** (～ば, ～らしい); ghế tự do **{混|こ}みそう**. Câu chốt: **インターネットで{指定席|していせき}を{買|か}うね**.' },
      ],
    },
    NG('b20-kt2-ng-59', '（59）{男|おとこ}の{人|ひと}は{面接|めんせつ}の{日|ひ}に{何|なに}を{持|も}っていきますか', '問題1 課題理解 — Bài 16: 面接, 履歴書, thể khả năng.', [
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}がアルバイトの{店|みせ}に{電話|でんわ}しています。{男|おとこ}の{人|ひと}は{面接|めんせつ}の{日|ひ}に{何|なに}を{持|も}っていきますか。', 'Otoko no hito ga arubaito no mise ni denwa shite imasu. Otoko no hito wa mensetsu no hi ni nani o motte ikimasu ka.', 'Một người đàn ông đang gọi điện tới cửa hàng tuyển người làm thêm. Ngày phỏng vấn người đàn ông sẽ mang gì?'],
      ['カルロス', 'ja-nam', 'もしもし、アルバイトの{面接|めんせつ}のことでお{電話|でんわ}しました。{何|なに}を{持|も}っていけばいいですか。', 'Moshimoshi, arubaito no mensetsu no koto de odenwa shimashita. Nani o motte ikeba ii desu ka.', 'A lô, tôi gọi về việc phỏng vấn làm thêm. Tôi nên mang gì ạ?'],
      ['{店|みせ}の{人|ひと}', 'ja-nu', '{履歴書|りれきしょ}をお{願|ねが}いします。{写真|しゃしん}は{履歴書|りれきしょ}に{貼|は}っておいてください。', 'Rirekisho o onegai shimasu. Shashin wa rirekisho ni hatte oite kudasai.', 'Anh mang sơ yếu lý lịch nhé. Ảnh thì dán sẵn vào sơ yếu lý lịch.'],
      ['カルロス', 'ja-nam', 'わかりました。{在留|ざいりゅう}カードも{必要|ひつよう}ですか。', 'Wakarimashita. Zairyuu kaado mo hitsuyou desu ka.', 'Tôi hiểu rồi. Có cần thẻ cư trú không ạ?'],
      ['{店|みせ}の{人|ひと}', 'ja-nu', 'それは{働|はたら}き{始|はじ}めるときでいいです。{面接|めんせつ}の{日|ひ}は{要|い}りません。', 'Sore wa hatarakihajimeru toki de ii desu. Mensetsu no hi wa irimasen.', 'Cái đó khi bắt đầu đi làm mới cần. Ngày phỏng vấn thì không cần.'],
      ['カルロス', 'ja-nam', '{日本語|にほんご}のテストはありますか。', 'Nihongo no tesuto wa arimasu ka.', 'Có kiểm tra tiếng Nhật không ạ?'],
      ['{店|みせ}の{人|ひと}', 'ja-nu', 'いいえ、{店長|てんちょう}と{少|すこ}し{話|はな}すだけです。{簡単|かんたん}な{会話|かいわ}ができれば{大丈夫|だいじょうぶ}ですよ。', 'Iie, tenchou to sukoshi hanasu dake desu. Kantan na kaiwa ga dekireba daijoubu desu yo.', 'Không, chỉ nói chuyện một chút với quản lý thôi. Giao tiếp đơn giản được là ổn.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}は{面接|めんせつ}の{日|ひ}に{何|なに}を{持|も}っていきますか。', 'Otoko no hito wa mensetsu no hi ni nani o motte ikimasu ka.', 'Ngày phỏng vấn người đàn ông sẽ mang gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b20-kt2-ng-59-q',
      title: '（59）',
      items: [
        { q: '（59）{男|おとこ}の{人|ひと}は{面接|めんせつ}の{日|ひ}に{何|なに}を{持|も}っていきますか。', options: ['{写真|しゃしん}を{貼|は}った{履歴書|りれきしょ}', '{履歴書|りれきしょ}と{在留|ざいりゅう}カード', '{写真|しゃしん}と{在留|ざいりゅう}カード', '{日本語|にほんご}のテストの{結果|けっか}'], correct: 0, why: '**{写真|しゃしん}は{履歴書|りれきしょ}に{貼|は}っておいてください** · thẻ cư trú **{面接|めんせつ}の{日|ひ}は{要|い}りません** · không có kiểm tra tiếng Nhật.' },
      ],
    },
    { t: 'h', text: '問題2 ポイント理解 — 3 câu' },
    NG('b20-kt2-ng-60', '（60）{女|おんな}の{学生|がくせい}はどうして{遅|おく}れましたか', '問題2 ポイント理解 — Bài 19: ～てしまう, ～のに. Lý do bị phủ định là bẫy.', [
      ['ナレーター', 'ja-nu', '{教室|きょうしつ}で{先生|せんせい}と{女|おんな}の{学生|がくせい}が{話|はな}しています。{女|おんな}の{学生|がくせい}はどうして{遅|おく}れましたか。', 'Kyoushitsu de sensei to onna no gakusei ga hanashite imasu. Onna no gakusei wa doushite okuremashita ka.', 'Trong lớp, thầy giáo và một nữ sinh đang nói chuyện. Vì sao nữ sinh đến muộn?'],
      ['{本田先生|ほんだせんせい}', 'ja-nam', 'パクさん、{今日|きょう}は{遅|おそ}かったですね。{寝坊|ねぼう}したんですか。', 'Paku-san, kyou wa osokatta desu ne. Nebou shita n desu ka.', 'Park, hôm nay em muộn nhỉ. Ngủ quên à?'],
      ['パク', 'ja-nu', 'いいえ、{今朝|けさ}はいつもより{早|はや}く{起|お}きたんです。{電車|でんしゃ}も{遅|おく}れていませんでした。', 'Iie, kesa wa itsumo yori hayaku okita n desu. Densha mo okurete imasen deshita.', 'Không ạ, sáng nay em còn dậy sớm hơn mọi khi. Tàu cũng không trễ.'],
      ['{本田先生|ほんだせんせい}', 'ja-nam', 'じゃ、どうしたんですか。', 'Ja, dou shita n desu ka.', 'Vậy có chuyện gì?'],
      ['パク', 'ja-nu', 'スマホを{見|み}ながら{乗|の}ったら、{反対|はんたい}の{方向|ほうこう}の{電車|でんしゃ}に{乗|の}ってしまって……。{早|はや}く{家|いえ}を{出|で}たのに、{三十分|さんじゅっぷん}も{遅|おく}れてしまいました。すみません。', 'Sumaho o minagara nottara, hantai no houkou no densha ni notte shimatte……. Hayaku ie o deta noni, sanjuppun mo okurete shimaimashita. Sumimasen.', 'Em vừa xem điện thoại vừa lên tàu nên lên nhầm chiều ngược lại… Ra khỏi nhà sớm vậy mà vẫn muộn tới 30 phút. Em xin lỗi.'],
      ['{本田先生|ほんだせんせい}', 'ja-nam', 'そうですか。{次|つぎ}からは{気|き}をつけてくださいね。', 'Sou desu ka. Tsugi kara wa ki o tsukete kudasai ne.', 'Vậy à. Lần sau chú ý nhé.'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{学生|がくせい}はどうして{遅|おく}れましたか。', 'Onna no gakusei wa doushite okuremashita ka.', 'Vì sao nữ sinh đến muộn?'],
    ]),
    {
      t: 'mcq',
      id: 'b20-kt2-ng-60-q',
      title: '（60）',
      items: [
        { q: '（60）{女|おんな}の{学生|がくせい}はどうして{遅|おく}れましたか。', options: ['{寝坊|ねぼう}したから', '{電車|でんしゃ}が{遅|おく}れたから', '{反対|はんたい}の{方向|ほうこう}の{電車|でんしゃ}に{乗|の}ってしまったから', '{家|いえ}を{出|で}るのが{遅|おそ}かったから'], correct: 2, why: 'Ngủ quên → **いいえ、いつもより{早|はや}く{起|お}きた**; tàu → **{遅|おく}れていませんでした**; ra khỏi nhà → **{早|はや}く{家|いえ}を{出|で}たのに**. Lý do thật: **{反対|はんたい}の{方向|ほうこう}の{電車|でんしゃ}に{乗|の}ってしまって**.' },
      ],
    },
    NG('b20-kt2-ng-61', '（61）{男|おとこ}の{人|ひと}がこのホテルを{選|えら}んだいちばんの{理由|りゆう}は{何|なん}ですか', '問題2 ポイント理解 — Bài 17: ～し、～し; tìm chữ いちばん.', [
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}がホテルについて{話|はな}しています。{男|おとこ}の{人|ひと}がこのホテルを{選|えら}んだいちばんの{理由|りゆう}は{何|なん}ですか。', 'Otoko no hito to onna no hito ga hoteru ni tsuite hanashite imasu. Otoko no hito ga kono hoteru o eranda ichiban no riyuu wa nan desu ka.', 'Một người đàn ông và một người phụ nữ đang nói về khách sạn. Lý do lớn nhất người đàn ông chọn khách sạn này là gì?'],
      ['アンナ', 'ja-nu', '{旅行|りょこう}のホテル、もう{決|き}めたの？', 'Ryokou no hoteru, mou kimeta no?', 'Khách sạn cho chuyến đi, cậu chọn xong chưa?'],
      ['ナタポン', 'ja-nam', 'うん、{駅|えき}の{前|まえ}のホテルにしたよ。{駅|えき}から{近|ちか}いし、{朝|あさ}ご{飯|はん}もおいしいらしいし。', 'Un, eki no mae no hoteru ni shita yo. Eki kara chikai shi, asagohan mo oishii rashii shi.', 'Ừ, mình chọn khách sạn trước ga. Gần ga, lại nghe đâu bữa sáng cũng ngon.'],
      ['アンナ', 'ja-nu', 'へえ、いいね。{高|たか}くなかった？', 'Hee, ii ne. Takaku nakatta?', 'Ồ, hay đấy. Không đắt à?'],
      ['ナタポン', 'ja-nam', '{実|じつ}は、それがいちばんの{理由|りゆう}なんだ。{学生|がくせい}なら{半額|はんがく}になるプランがあって、ほかのホテルよりずっと{安|やす}かったんだよ。', 'Jitsu wa, sore ga ichiban no riyuu na n da. Gakusei nara hangaku ni naru puran ga atte, hoka no hoteru yori zutto yasukatta n da yo.', 'Thật ra đó mới là lý do chính. Có gói giảm nửa giá cho sinh viên, rẻ hơn hẳn các khách sạn khác.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}がこのホテルを{選|えら}んだいちばんの{理由|りゆう}は{何|なん}ですか。', 'Otoko no hito ga kono hoteru o eranda ichiban no riyuu wa nan desu ka.', 'Lý do lớn nhất người đàn ông chọn khách sạn này là gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b20-kt2-ng-61-q',
      title: '（61）',
      items: [
        { q: '（61）{男|おとこ}の{人|ひと}がこのホテルを{選|えら}んだいちばんの{理由|りゆう}は{何|なん}ですか。', options: ['{駅|えき}から{近|ちか}いから', '{朝|あさ}ご{飯|はん}がおいしいから', '{安|やす}かったから', '{部屋|へや}が{広|ひろ}いから'], correct: 2, why: 'Gần ga, bữa sáng ngon là lý do liệt kê (～し、～し); câu chốt **{実|じつ}は、それがいちばんの{理由|りゆう}** — "それ" = giá: **ずっと{安|やす}かった**.' },
      ],
    },
    NG('b20-kt2-ng-62', '（62）パン{屋|や}はこれからどうなりますか', '問題2 ポイント理解 — Bài 20: ～らしい, ～みたい, ～そうです. Tin đồn được sửa lại ở cuối.', [
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}が{話|はな}しています。パン{屋|や}はこれからどうなりますか。', 'Otoko no hito to onna no hito ga hanashite imasu. Pan-ya wa korekara dou narimasu ka.', 'Một người đàn ông và một người phụ nữ đang nói chuyện. Tiệm bánh mì từ nay sẽ thế nào?'],
      ['カルロス', 'ja-nam', 'ワンさん、{駅前|えきまえ}のパン{屋|や}、{来月|らいげつ}{閉|し}まるらしいよ。', 'Wan-san, ekimae no pan-ya, raigetsu shimaru rashii yo.', 'Vương ơi, nghe đâu tiệm bánh mì trước ga tháng sau đóng cửa đấy.'],
      ['ワン', 'ja-nu', 'えっ、うそ！あそこのパン、{大好|だいす}きなのに。', 'E, uso! Asoko no pan, daisuki na noni.', 'Hả, không thể nào! Mình thích bánh ở đó lắm vậy mà.'],
      ['カルロス', 'ja-nam', 'でも、{閉|し}めるんじゃなくて、{引|ひ}っ{越|こ}すみたいなんだ。{店|みせ}のドアに{紙|かみ}が{貼|は}ってあって、「{駅|えき}の{反対側|はんたいがわ}に{移|うつ}ります」って{書|か}いてあった。', 'Demo, shimeru n ja nakute, hikkosu mitai na n da. Mise no doa ni kami ga hatte atte, "Eki no hantaigawa ni utsurimasu" tte kaite atta.', 'Nhưng hình như không phải đóng cửa mà là chuyển chỗ. Trên cửa tiệm có dán giấy ghi "Chuyển sang phía bên kia nhà ga".'],
      ['ワン', 'ja-nu', 'なんだ、よかった。{反対側|はんたいがわ}なら、{寮|りょう}からもっと{近|ちか}くなるね。', 'Nanda, yokatta. Hantaigawa nara, ryou kara motto chikaku naru ne.', 'Ra thế, may quá. Phía bên kia thì còn gần ký túc xá hơn ấy chứ.'],
      ['ナレーター', 'ja-nu', 'パン{屋|や}はこれからどうなりますか。', 'Pan-ya wa korekara dou narimasu ka.', 'Tiệm bánh mì từ nay sẽ thế nào?'],
    ]),
    {
      t: 'mcq',
      id: 'b20-kt2-ng-62-q',
      title: '（62）',
      items: [
        { q: '（62）パン{屋|や}はこれからどうなりますか。', options: ['{来月|らいげつ}{閉|し}まる', '{駅|えき}の{反対側|はんたいがわ}に{移|うつ}る', '{寮|りょう}の{中|なか}に{移|うつ}る', '{何|なに}も{変|か}わらない'], correct: 1, why: 'Tin đồn đầu (～らしい) bị sửa: **{閉|し}めるんじゃなくて、{引|ひ}っ{越|こ}すみたい** + giấy dán **「{駅|えき}の{反対側|はんたいがわ}に{移|うつ}ります」** (～てある — Bài 18).' },
      ],
    },
    { t: 'h', text: '問題3 発話表現 — 3 câu' },
    NG('b20-kt2-ng-63', '（63）〜（65）{何|なん}と{言|い}いますか', '問題3 発話表現 — Bài 18 (～てもらえませんか), Bài 19 (～てしまって、すみません), Bài 20 (～そう).', [
      ['ナレーター', 'ja-nu', '（63）{友達|ともだち}が{重|おも}い{荷物|にもつ}を{持|も}っています。{何|なん}と{言|い}いますか。', 'Rokujuusan. Tomodachi ga omoi nimotsu o motte imasu. Nan to iimasu ka.', 'Câu 63. Bạn bạn đang xách đồ nặng. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、{重|おも}いそうだね。 2、{重|おも}そうだね。{一|ひと}つ{持|も}とうか。 3、{重|おも}いはずだね。', 'Ichi, omoi sou da ne. Ni, omosou da ne. Hitotsu motou ka. San, omoi hazu da ne.', '1. Nghe nói nặng nhỉ. 2. Trông nặng quá. Để mình xách một cái nhé? 3. Chắc chắn nặng nhỉ.'],
      ['ナレーター', 'ja-nu', '（64）{先生|せんせい}に{作文|さくぶん}を{見|み}てほしいです。{何|なん}と{言|い}いますか。', 'Rokujuuyon. Sensei ni sakubun o mite hoshii desu. Nan to iimasu ka.', 'Câu 64. Bạn muốn thầy xem bài văn. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、{先生|せんせい}、{作文|さくぶん}を{見|み}てあげましょうか。 2、{先生|せんせい}、{作文|さくぶん}を{見|み}てもらえませんか。 3、{先生|せんせい}、{作文|さくぶん}を{見|み}てしまいました。', 'Ichi, sensei, sakubun o mite agemashou ka. Ni, sensei, sakubun o mite moraemasen ka. San, sensei, sakubun o mite shimaimashita.', '1. Thầy ơi, để em xem bài văn cho thầy nhé. 2. Thầy ơi, thầy xem giúp em bài văn được không ạ? 3. Thầy ơi, em lỡ xem bài văn mất rồi.'],
      ['ナレーター', 'ja-nu', '（65）{会議|かいぎ}に{遅|おく}れて{入|はい}りました。{何|なん}と{言|い}いますか。', 'Rokujuugo. Kaigi ni okurete hairimashita. Nan to iimasu ka.', 'Câu 65. Bạn vào phòng họp muộn. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、{遅|おく}れてしまって、すみません。 2、{遅|おく}れてみて、すみません。 3、{遅|おく}れるかもしれません。', 'Ichi, okurete shimatte, sumimasen. Ni, okurete mite, sumimasen. San, okureru kamoshiremasen.', '1. Xin lỗi vì tôi đã đến muộn. 2. Xin lỗi vì tôi đã thử đến muộn. 3. Có khi tôi sẽ muộn.'],
    ]),
    {
      t: 'mcq',
      id: 'b20-kt2-ng-63-q',
      title: '（63）〜（65）',
      items: [
        { q: '（63）{重|おも}い{荷物|にもつ}', options: ['1', '2', '3'], correct: 1, why: 'Tận mắt thấy → **{重|おも}そうだね** + đề nghị giúp (thể ý chí ～ようか — Bài 16).' },
        { q: '（64）{作文|さくぶん}を{見|み}てほしい', options: ['1', '2', '3'], correct: 1, why: 'Nhờ người trên → **～てもらえませんか** (Bài 18). ～てあげましょうか là mình làm cho người ta — thất lễ với thầy.' },
        { q: '（65）{会議|かいぎ}に{遅|おく}れた', options: ['1', '2', '3'], correct: 0, why: 'Việc đã lỡ xảy ra → **{遅|おく}れてしまって、すみません** (Bài 19). Câu 3 là chuyện chưa xảy ra.' },
      ],
    },
    { t: 'h', text: '問題4 即時応答 — 5 câu' },
    NG('b20-kt2-ng-66', '（66）〜（70）{正|ただ}しい{返事|へんじ}を{選|えら}んでください', '問題4 即時応答 — mỗi câu một bài: 16, 17, 18, 19, 20.', [
      ['ナレーター', 'ja-nu', '（66）', 'Rokujuuroku.', 'Câu 66.'],
      ['リン', 'ja-nu', 'この{漢字|かんじ}、{読|よ}める？', 'Kono kanji, yomeru?', 'Chữ Hán này cậu đọc được không?'],
      ['マルコ', 'ja-nam', '1、うん、「けいさつ」だよ。 2、うん、{読|よ}もう。 3、ううん、{読|よ}んでしまった。', 'Ichi, un, "keisatsu" da yo. Ni, un, yomou. San, uun, yonde shimatta.', '1. Được, là "keisatsu" đấy. 2. Ừ, đọc thôi. 3. Không, lỡ đọc mất rồi.'],
      ['ナレーター', 'ja-nu', '（67）', 'Rokujuunana.', 'Câu 67.'],
      ['ダニエル', 'ja-nam', '{明日|あした}、{雨|あめ}なら{何|なに}をする？', 'Ashita, ame nara nani o suru?', 'Mai mà mưa thì cậu làm gì?'],
      ['パク', 'ja-nu', '1、{雨|あめ}が{降|ふ}ったそうだよ。 2、{家|いえ}で{映画|えいが}でも{見|み}ようかな。 3、{雨|あめ}を{見|み}ておいたよ。', 'Ichi, ame ga futta sou da yo. Ni, ie de eiga demo miyou ka na. San, ame o mite oita yo.', '1. Nghe nói mưa rồi đấy. 2. Chắc ở nhà xem phim gì đó. 3. Mình xem mưa sẵn rồi.'],
      ['ナレーター', 'ja-nu', '（68）', 'Rokujuuhachi.', 'Câu 68.'],
      ['リン', 'ja-nu', '{引|ひ}っ{越|こ}し、{手伝|てつだ}ってくれてありがとう。', 'Hikkoshi, tetsudatte kurete arigatou.', 'Cảm ơn cậu đã giúp mình chuyển nhà.'],
      ['ナタポン', 'ja-nam', '1、どういたしまして。また{何|なに}かあったら{言|い}ってね。 2、うん、{手伝|てつだ}ってもらったよ。 3、じゃ、{手伝|てつだ}ってあげてね。', 'Ichi, dou itashimashite. Mata nani ka attara itte ne. Ni, un, tetsudatte moratta yo. San, ja, tetsudatte agete ne.', '1. Không có gì. Có gì cần cứ nói nhé. 2. Ừ, mình được giúp rồi. 3. Vậy cậu giúp người ta nhé.'],
      ['ナレーター', 'ja-nu', '（69）', 'Rokujuukyuu.', 'Câu 69.'],
      ['アンナ', 'ja-nu', 'もう{宿題|しゅくだい}やった？', 'Mou shukudai yatta?', 'Làm bài tập chưa?'],
      ['カルロス', 'ja-nam', '1、うん、{今|いま}からやるところ。 2、ううん、これからやるところ。 3、うん、やってみたい。', 'Ichi, un, ima kara yaru tokoro. Ni, uun, korekara yaru tokoro. San, un, yatte mitai.', '1. Ừ, mình sắp làm đây. 2. Chưa, mình sắp làm đây. 3. Ừ, mình muốn thử làm.'],
      ['ナレーター', 'ja-nu', '（70）', 'Nanajuu.', 'Câu 70.'],
      ['メアリー', 'ja-nu', '{西川|にしかわ}さん、{今日|きょう}は{休|やす}みみたいだね。', 'Nishikawa-san, kyou wa yasumi mitai da ne.', 'Hôm nay anh Nishikawa hình như nghỉ nhỉ.'],
      ['ダニエル', 'ja-nam', '1、{風邪|かぜ}をひいたのかもしれないね。 2、うん、{休|やす}みそうだね。 3、{休|やす}むつもりだね。', 'Ichi, kaze o hiita no kamoshirenai ne. Ni, un, yasumisou da ne. San, yasumu tsumori da ne.', '1. Có khi anh ấy bị cảm nhỉ. 2. Ừ, có vẻ sắp nghỉ nhỉ. 3. Anh ấy định nghỉ nhỉ.'],
    ]),
    {
      t: 'mcq',
      id: 'b20-kt2-ng-66-q',
      title: '（66）〜（70）',
      items: [
        { q: '（66）「この{漢字|かんじ}、{読|よ}める？」', options: ['1', '2', '3'], correct: 0, why: 'Hỏi khả năng (thể khả năng — Bài 16) → **うん、「けいさつ」だよ** (đọc được và đọc luôn).' },
        { q: '（67）「{明日|あした}、{雨|あめ}なら{何|なに}をする？」', options: ['1', '2', '3'], correct: 1, why: '～なら (Bài 17) hỏi kế hoạch → **{家|いえ}で{映画|えいが}でも{見|み}ようかな** (thể ý chí — Bài 16).' },
        { q: '（68）「{手伝|てつだ}ってくれてありがとう。」', options: ['1', '2', '3'], correct: 0, why: 'Được cảm ơn → **どういたしまして** (Bài 18 — ～てくれてありがとう).' },
        { q: '（69）「もう{宿題|しゅくだい}やった？」', options: ['1', '2', '3'], correct: 1, why: 'Chưa làm → **ううん、これからやるところ** (Bài 19). Câu 1 tự mâu thuẫn (うん + {今|いま}から).' },
        { q: '（70）「{今日|きょう}は{休|やす}みみたいだね。」', options: ['1', '2', '3'], correct: 0, why: 'Bạn đoán (みたい) → mình đoán lý do: **{風邪|かぜ}をひいたのかもしれないね** (Bài 20). {休|やす}みそう (sắp nghỉ) sai nghĩa; つもり không dùng để đoán về người khác.' },
      ],
    },

    /* ── Thang điểm & bảng ôn ── */
    { t: 'h', text: 'Chấm điểm — quy đổi 180, điểm liệt, bảng ôn cả chặng' },
    KT_THANG_DIEM,
    KT_DAT,
    {
      t: 'table',
      caption: 'Ví dụ quy đổi',
      head: ['Đúng (Phần 1 + 読解 / 56)', 'Đúng (聴解 / 14)', '言語知識・読解', '聴解', 'Tổng', 'Kết quả'],
      rows: [
        ['45', '11', '96', '47', '143', 'Đạt — rất tốt (56/70)'],
        ['36', '9', '77', '38', '115', 'Đạt (45/70) — ôn mẫu sai'],
        ['30', '4', '64', '17', '81', 'TRƯỢT — 聴解 dưới điểm liệt 19'],
        ['16', '12', '34', '51', '85', 'TRƯỢT — 言語知識・読解 dưới điểm liệt 38'],
      ],
    },
    {
      t: 'table',
      caption: 'Phần 2 — sai câu nào ôn Bài nào / mẫu nào',
      head: ['Câu', 'Nội dung', 'Ôn ở đâu'],
      rows: [
        ['50', 'thông báo — ～ておいてください, ～はずでした', 'Bài 18 Ngữ pháp ② + Bài 20 ⑤; chiến thuật 短文 (b20-doc)'],
        ['51', 'email nhờ vả — ～てもらえませんか, ～なくなってしまう', 'Bài 18 Ngữ pháp ①, Bài 19 ①'],
        ['52, 53, 54', 'bài văn du lịch — ～し, ～てしまう, ～そうです, ～ようだ, ～かもしれない', 'Bài 17 ③, Bài 19 ①, Bài 20 ①′ ② ④; Đọc hiểu Bài 17, 19, 20'],
        ['55, 56', 'bảng tuyển dụng — 時給, 交通費, 敬語, tính tiền', 'Bài 16 Từ vựng + Đọc hiểu (情報検索)'],
        ['57', 'chuyển nhà — ～ておく, ～てくれる, ～らしい, ～はず', 'Bài 18 + Bài 20; mẹo 課題理解 (b20-nghe)'],
        ['58', 'đặt vé — ～ば, ～なら, ～そう (混みそう)', 'Bài 17 ① ② + Bài 20 ①'],
        ['59', 'phỏng vấn làm thêm — 履歴書, ～ておく, ～ば', 'Bài 16 Từ vựng + Nghe'],
        ['60', 'đến muộn — ～てしまう, ～のに', 'Bài 19 ① ④; mẹo ポイント理解'],
        ['61', 'chọn khách sạn — ～し、～し, いちばんの理由', 'Bài 17 ③ (～し)'],
        ['62', 'tin đồn tiệm bánh — ～らしい → ～みたい, ～てある', 'Bài 20 ② ③ + Bài 18 ③'],
        ['63, 64, 65', 'nói gì — ～そう / ～てもらえませんか / ～てしまって、すみません', 'Bài 20 ①, Bài 18 ①, Bài 19 ①'],
        ['66–70', 'đáp nhanh — khả năng, ～なら, ～てくれて, ～ところ, ～かもしれない', 'Bài 16 ①, 17 ②, 18 ①, 19 ③, 20 ④ (mỗi câu một bài)'],
      ],
    },
    {
      t: 'note',
      title: 'Sau khi chấm',
      items: [
        'Đếm số câu sai **theo bài** (cộng cả hai bảng ôn): bài nào sai **≥ 4 câu** → làm lại **Bài tập** + **Luyện thêm 3–4** của bài đó trước khi sang Bài 21.',
        'Sai nhiều ở **聴解**: nghe lại 6 bài của mục Nghe hiểu Bài 16–20, lần này bật lời thoại + romaji, đọc to theo; rồi nghe lại không lời.',
        'Sai nhiều ở **文法** nhóm suy đoán (câu 31, 41, 45, 48, 49, 70): học lại bảng **"Bảng chọn nhanh khi làm đề"** cuối Ngữ pháp Bài 20 — đó là nhóm mẫu sẽ còn gặp lại ở N3 (Bài 31: ～に{違|ちが}いない, ～はずがない).',
        'Làm lại bài kiểm tra sau **1 tuần** (không xem đáp án trước) — mục tiêu tăng ít nhất 5 câu.',
      ],
    },
  ],
};

export const BAI_20: Lesson[] = [
  // ① Cốt lõi
  HOI_THOAI, TU_VUNG, NGU_PHAP, HAN_TU, NGHE, DOC, NOI, VIET, BAI_TAP,
  // ② Theo buổi trên lớp
  BUOI_1, BUOI_2, BUOI_3,
  // ③ Luyện thêm dễ → khó
  LT_1, LT_2, LT_3, LT_4, LT_5,
  // ④ Kiểm tra chặng 16–20
  KT_1, KT_2,
];

