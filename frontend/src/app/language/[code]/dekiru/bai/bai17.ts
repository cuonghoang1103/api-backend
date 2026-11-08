/**
 * Bài 17 — 旅行の計画 (Kế hoạch du lịch) · TIẾP SAU SÁCH, cấp N4 (xem ../SOAN-BAI.md mục 8).
 * Người học đã xong Bài 1–15 (ポイント 1–124) và Bài 16 (thể khả năng, thể ý chí, ～つもり, ～予定).
 *
 * Ngữ pháp (N4): ① thể điều kiện ～ば (条件形: 行けば・食べれば・すれば・来れば・安ければ・静かなら) — điều kiện
 * cần, ～ばいいですか／～ばいいです (hỏi / khuyên cách làm), bảng phân biệt ～ば ↔ ～と (ポイント 113) ↔ ～たら
 * (ポイント 120) · ② ～なら — "nếu là … thì" (nhận lời người kia rồi khuyên / nêu ý kiến), それなら, V辞書形なら ↔ Vたら ·
 * ③ ～し、～し — liệt kê lý do (～し、それに…) · ④ ～すぎる — "quá…" (V・イA・ナA), ～すぎて (lý do), danh từ ～すぎ ·
 * ⑤ Vます ＋ やすい／にくい — "dễ / khó V", cả nghĩa "dễ bị…" (壊れやすい).
 * Từ vựng: 50 từ N4 (đặt chỗ, vé tàu, ngắm cảnh, cảm nhận, chuẩn bị đi). Chữ Hán mới (15): 発 光 重 軽 洋 世 界
 * (N4 còn lại hợp chủ đề) + 港 島 湖 案 内 定 指 側 (N3) — không trùng hanTu.ts, hanTu16.ts, hanLop.ts, bảng chữ Bài 1–16.
 * Hội thoại, câu ví dụ, bài đọc, kịch bản nghe: VIẾT MỚI 100%, không chép giáo trình/đề thi nào.
 *
 * Nhân vật (giới tính quyết định giọng đọc, theo sách p.14): nữ = アンナ, パク, ワン, メアリー, リン, 鈴木 ·
 * nam = マルコ, カルロス, ダニエル, ナタポン, 西川, 本田先生. Người MỚI của bài này:
 *  - {旅行会社|りょこうがいしゃ}の{人|ひと} ({係|かかり}の{人|ひと}) — nam, role 'b' / giọng ja-nam — nhân viên quầy tư vấn du lịch ở hội thoại ②.
 *  - {駅員|えきいん} (nghe Bài 2) — nam, ja-nam · ホテルの{人|ひと} (nghe Bài 1) — nữ, ja-nu.
 * Hội thoại: role 'a'/'c' = giọng nữ, 'b'/'examiner' = giọng nam. Nghe: 'ja-nu' = nữ, 'ja-nam' = nam.
 * Hình: tên trong scripts/hinh/fluent-catalog.json (Fluent Emoji). Thẻ chữ Hán: hanTu17.ts (HAN_TU_17).
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
  id: 'b17-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — 旅行の計画: bàn chuyến đi kỳ nghỉ dài, hỏi quầy du lịch, một ngày ở Kyoto',
  goal: 'Bàn với bạn bè đi đâu, đi bằng gì, ở đâu bằng ～ば (安ければ・予約すれば) và ～なら (京都なら・温泉なら); đến quầy du lịch nói được điều kiện của mình, nghe tư vấn có ～し、～し và hỏi "phải làm thế nào" bằng ～ばいいですか; trong chuyến đi nhận xét được đồ vật, đường đi, món ăn bằng ～すぎる và ～やすい／～にくい.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Bài 17 — chủ đề: lên kế hoạch du lịch (cấp N4)',
      items: [
        'Du học sinh ở Nhật hay đi chơi vào **kỳ nghỉ dài (連休)**: bàn với bạn đi đâu, so giá, đặt vé, đặt chỗ ở, rồi kể lại chuyến đi. Bài 17 dạy đủ câu cho cả hành trình đó.',
        'Năm mẫu N4: **～ば** (nếu… thì), **～なら** (nếu là… thì — khuyên dựa vào lời người kia), **～し、～し** (vừa… vừa…, nêu nhiều lý do), **～すぎる** (quá…), **～やすい／～にくい** (dễ / khó làm).',
        'Ba tình huống: ① bàn chuyến đi Kyoto với bạn · ② hỏi quầy du lịch cho bố mẹ sang chơi · ③ một ngày ở Kyoto: hành lý quá nặng, bản đồ dễ đọc, dốc khó đi.',
        'Mọi câu có furigana và romaji; bấm 🔊 để nghe từng câu rồi đọc to theo.',
      ],
    },
    {
      t: 'note',
      title: 'Học xong bài 17 bạn làm được (できる)',
      items: [
        '**① {旅行|りょこう}の{相談|そうだん}** — rủ bạn đi chơi, nêu điều kiện: **{安|やす}ければ{行|い}きたいです**, **{早|はや}く{予約|よやく}すれば{割引|わりびき}があります**, **{温泉|おんせん}があれば、もっといいです**; đáp lời bạn bằng **{京都|きょうと}なら、{秋|あき}がいいですよ**.',
        '**② {旅行会社|りょこうがいしゃ}で** — nói mình cần gì, nghe nhân viên giới thiệu **{駅|えき}から{近|ちか}いし、{温泉|おんせん}もあるし…**, từ chối khéo **ちょっと{高|たか}すぎます**, hỏi **どうすればいいですか**, đặt **{往復|おうふく}の{指定席|していせき}**.',
        '**③ {旅行|りょこう}の{日|ひ}** — nhận xét trong chuyến đi: **スーツケースが{重|おも}すぎます**, **この{地図|ちず}はわかりやすいです**, **この{坂|さか}は{歩|ある}きにくいです**, **{食|た}べすぎました**.',
        '**できる！** — giới thiệu 1 phút một nơi nên đi ở nước mình: **～なら、～がいいです。～し、～し…。～ば、～ます。**',
      ],
    },
    {
      t: 'table',
      caption: 'Bức tranh chung của bài — từ lúc bàn chuyến đi đến lúc đi chơi',
      head: ['Lúc', 'Câu then chốt', 'Romaji', 'Mẫu'],
      rows: [
        ['Nêu điều kiện', '{安|やす}ければ、{行|い}きたいです。', 'Yasukereba, ikitai desu.', 'イA ‑ければ'],
        ['Nói cách được lợi', '{早|はや}く{予約|よやく}すれば、{安|やす}くなります。', 'Hayaku yoyaku sureba, yasuku narimasu.', 'V ‑ば'],
        ['Hỏi phải làm thế nào', 'どうすればいいですか。', 'Dou sureba ii desu ka.', '～ばいいですか'],
        ['Đáp lời bạn, khuyên', '{京都|きょうと}なら、{秋|あき}がいいですよ。', 'Kyouto nara, aki ga ii desu yo.', 'N なら'],
        ['Nêu nhiều lý do', '{近|ちか}いし、{温泉|おんせん}もあるし、いいですね。', 'Chikai shi, onsen mo aru shi, ii desu ne.', '～し、～し'],
        ['Chê nhẹ', 'ちょっと{高|たか}すぎます。', 'Chotto takasugimasu.', 'イA ＋ すぎる'],
        ['Khen đồ dùng', 'この{地図|ちず}はわかりやすいですね。', 'Kono chizu wa wakariyasui desu ne.', 'Vます ＋ やすい'],
        ['Kêu khó đi', 'この{靴|くつ}は{歩|ある}きにくいです。', 'Kono kutsu wa arukinikui desu.', 'Vます ＋ にくい'],
      ],
    },

    /* ── ① 旅行の相談 ── */
    { t: 'h', text: '① {旅行|りょこう}の{相談|そうだん} — Bàn chuyến đi kỳ nghỉ dài' },
    {
      t: 'canh',
      anh: ['woman-student', 'man-student', 'woman-student', 'spiral-calendar', 'bullet-train'],
      caption: 'Giờ nghỉ ở phòng sinh hoạt của trường: パク rủ アンナ và マルコ đi chơi vào kỳ nghỉ dài tháng sau. Ba người bàn đi đâu, đi bằng gì, ở đâu.',
    },
    {
      t: 'p',
      text: 'Tình huống: tháng sau có **kỳ nghỉ dài 3 ngày ({連休|れんきゅう})**. **パク** rủ **アンナ** và **マルコ** đi du lịch. Ba người bàn **đi đâu** (Kyoto), **đi bằng gì** (xe buýt đêm hay tàu Shinkansen), **ở đâu** (khách sạn hay nhà trọ kiểu Nhật). Khi nêu điều kiện, cả ba dùng **～ば**: {安|やす}ければ (nếu rẻ), {予約|よやく}すれば (nếu đặt), あれば (nếu có). Khi nhận lời người kia rồi góp ý, họ dùng **～なら**: {京都|きょうと}なら…, {温泉|おんせん}なら….',
    },
    DL('Ở phòng sinh hoạt — "Kỳ nghỉ dài, mình đi đâu đi!"', [
      ['パク', 'c', '{来月|らいげつ}の{連休|れんきゅう}、みんなでどこか{旅行|りょこう}に{行|い}きませんか。', 'Raigetsu no renkyuu, minna de dokoka ryokou ni ikimasen ka.', 'Kỳ nghỉ dài tháng sau, cả nhóm mình đi du lịch đâu đó không?'],
      ['マルコ', 'b', 'いいですね。{行|い}きたいです。どこがいいですかね。', 'Ii desu ne. Ikitai desu. Doko ga ii desu ka ne.', 'Hay đấy. Mình muốn đi. Đi đâu thì được nhỉ?'],
      ['アンナ', 'a', '{京都|きょうと}はどうですか。{京都|きょうと}なら、{秋|あき}の{紅葉|こうよう}がとても{有名|ゆうめい}ですよ。', 'Kyouto wa dou desu ka. Kyouto nara, aki no kouyou ga totemo yuumei desu yo.', 'Kyoto thì sao? Nói đến Kyoto thì lá đỏ mùa thu rất nổi tiếng đấy.'],
      ['パク', 'c', '{京都|きょうと}、いいですね。でも、{新幹線|しんかんせん}は{高|たか}くないですか。', 'Kyouto, ii desu ne. Demo, shinkansen wa takaku nai desu ka.', 'Kyoto hay đấy. Nhưng tàu Shinkansen không đắt à?'],
      ['マルコ', 'b', '{夜行|やこう}バスで{行|い}けば、{安|やす}いですよ。{往復|おうふく}で{1万円|いちまんえん}ぐらいです。', 'Yakou basu de ikeba, yasui desu yo. Oufuku de ichiman en gurai desu.', 'Nếu đi xe buýt đêm thì rẻ đấy. Khứ hồi khoảng 1 vạn yên.'],
      ['パク', 'c', '{夜行|やこう}バスはちょっと……。よく{寝|ね}られないし、{疲|つか}れるし。', 'Yakou basu wa chotto……. Yoku nerarenai shi, tsukareru shi.', 'Xe buýt đêm thì hơi… Vừa không ngủ ngon được, vừa mệt nữa.'],
      ['アンナ', 'a', 'じゃ、{新幹線|しんかんせん}にしましょう。{早|はや}く{予約|よやく}すれば、{少|すこ}し{安|やす}くなるそうですよ。', 'Ja, shinkansen ni shimashou. Hayaku yoyaku sureba, sukoshi yasuku naru sou desu yo.', 'Vậy đi Shinkansen đi. Nghe nói nếu đặt sớm thì sẽ rẻ hơn một chút đấy.'],
      ['マルコ', 'b', '{泊|と}まる{所|ところ}はどうしますか。', 'Tomaru tokoro wa dou shimasu ka.', 'Chỗ ở thì tính sao?'],
      ['パク', 'c', '{私|わたし}は{旅館|りょかん}に{泊|と}まりたいです。{温泉|おんせん}があれば、もっといいです。', 'Watashi wa ryokan ni tomaritai desu. Onsen ga areba, motto ii desu.', 'Mình muốn ở nhà trọ kiểu Nhật. Nếu có suối nước nóng thì càng tốt.'],
      ['アンナ', 'a', '{温泉|おんせん}なら、{嵐山|あらしやま}にいい{旅館|りょかん}がありますよ。{去年|きょねん}{家族|かぞく}と{泊|と}まりました。', 'Onsen nara, Arashiyama ni ii ryokan ga arimasu yo. Kyonen kazoku to tomarimashita.', 'Nếu là suối nước nóng thì ở Arashiyama có một nhà trọ tốt đấy. Năm ngoái mình ở đó với gia đình.'],
      ['マルコ', 'b', '{予算|よさん}はいくらぐらいにすればいいですか。', 'Yosan wa ikura gurai ni sureba ii desu ka.', 'Ngân sách thì nên để khoảng bao nhiêu?'],
      ['パク', 'c', '{一人|ひとり}{3万円|さんまんえん}ぐらいなら、{大丈夫|だいじょうぶ}です。', 'Hitori sanman en gurai nara, daijoubu desu.', 'Nếu khoảng 3 vạn yên một người thì mình ổn.'],
      ['アンナ', 'a', '{私|わたし}も。じゃ、{明日|あした}の{授業|じゅぎょう}の{後|あと}で、{駅前|えきまえ}の{旅行会社|りょこうがいしゃ}へ{相談|そうだん}に{行|い}きましょう。', 'Watashi mo. Ja, ashita no jugyou no ato de, ekimae no ryokougaisha e soudan ni ikimashou.', 'Mình cũng vậy. Vậy sau giờ học ngày mai, mình đến công ty du lịch trước ga hỏi nhé.'],
    ]),
    {
      t: 'examples',
      items: [
        E('{時間|じかん}があれば、{京都|きょうと}へ{行|い}きたいです。', 'Jikan ga areba, Kyouto e ikitai desu.', 'Nếu có thời gian thì tôi muốn đi Kyoto.'),
        E('{夜行|やこう}バスで{行|い}けば、{安|やす}いですよ。', 'Yakou basu de ikeba, yasui desu yo.', 'Nếu đi xe buýt đêm thì rẻ đấy.'),
        E('{安|やす}ければ、{新幹線|しんかんせん}で{行|い}きます。', 'Yasukereba, shinkansen de ikimasu.', 'Nếu rẻ thì tôi đi Shinkansen.'),
        E('{京都|きょうと}へ{行|い}きたいんですが。——{京都|きょうと}なら、{秋|あき}がいいですよ。', 'Kyouto e ikitai n desu ga. — Kyouto nara, aki ga ii desu yo.', 'Tôi muốn đi Kyoto… — Nếu là Kyoto thì mùa thu đẹp đấy.'),
        E('{予算|よさん}はいくらにすればいいですか。——{3万円|さんまんえん}ぐらいなら、{大丈夫|だいじょうぶ}です。', 'Yosan wa ikura ni sureba ii desu ka. — Sanman en gurai nara, daijoubu desu.', 'Ngân sách nên để bao nhiêu? — Nếu khoảng 3 vạn yên thì ổn.'),
        E('{夜行|やこう}バスは{寝|ね}られないし、{疲|つか}れるし……。', 'Yakou basu wa nerarenai shi, tsukareru shi…….', 'Xe buýt đêm vừa không ngủ được, vừa mệt… (bỏ lửng = từ chối khéo)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ①',
      items: [
        '**{行|い}きませんか** (rủ, ôn Bài 6) — giữa bạn cùng lớp vẫn hay dùng です／ます. Nói thân mật hơn: {行|い}かない？ hoặc {行|い}こうよ (thể ý chí, Bài 16).',
        '**{京都|きょうと}なら** — アンナ nhận chủ đề "đi đâu" rồi nói thông tin về đúng nơi đó. **N なら** = "nếu nói về N / nếu là N thì…". **{温泉|おんせん}なら** cũng vậy: パク vừa nói muốn có suối nước nóng → アンナ nhận lấy chữ {温泉|おんせん} rồi giới thiệu.',
        '**{行|い}けば／{予約|よやく}すれば／あれば** — thể **～ば**: vế trước là **điều kiện**, vế sau là **kết quả** (rẻ, rẻ hơn, càng tốt). Chưa học cách chia? Xem ngay ở Ngữ pháp ①.',
        '**{寝|ね}られないし、{疲|つか}れるし** — ～し nêu **nhiều lý do** (ở đây là lý do không thích xe buýt đêm). Câu bỏ lửng ở cuối, người nghe tự hiểu: "nên mình không muốn". {寝|ね}られない là thể khả năng của {寝|ね}る (Bài 16).',
        '**～にしましょう** = "chọn ~ đi" (quyết chọn một thứ). **～そうです** (nghe nói, ôn ポイント 119). **{相談|そうだん}に{行|い}きます** = đi để hỏi ý kiến (V/N(する) + に + {行|い}く, ôn Bài 9).',
      ],
    },

    /* ── ② 旅行会社で ── */
    { t: 'h', text: '② {旅行会社|りょこうがいしゃ}で — Hỏi quầy du lịch cho bố mẹ sang chơi' },
    {
      t: 'canh',
      anh: ['woman-student', 'man-office-worker', 'hot-springs', 'hotel'],
      caption: 'Quầy tư vấn của một công ty du lịch trước ga: ワン tìm chuyến đi 2 ngày 1 đêm cho bố mẹ từ Trung Quốc sang. Nhân viên giới thiệu nhà trọ có suối nước nóng và khách sạn rẻ hơn.',
    },
    {
      t: 'p',
      text: 'Tình huống: **bố mẹ ワン** từ Trung Quốc sang thăm. ワン đến quầy của **công ty du lịch ({旅行会社|りょこうがいしゃ})** tìm một chuyến **2 ngày 1 đêm ({1泊2日|いっぱくふつか})** không phải đi bộ nhiều. Nhân viên ({係|かかり}の{人|ひと}) nghe điều kiện rồi đáp bằng **～なら** ("nếu đi cùng bố mẹ thì…", **それなら** "vậy thì…"), kể ưu điểm bằng **～し、～し**. Giá quá ngân sách → ワン từ chối khéo **ちょっと{高|たか}すぎます**. Hỏi thủ tục → **どうすればいいですか**.',
    },
    DL('Ở quầy du lịch — "Đi cùng bố mẹ thì nên đi đâu ạ?"', [
      ['{係|かかり}の{人|ひと}', 'b', 'いらっしゃいませ。どちらへのご{旅行|りょこう}ですか。', 'Irasshaimase. Dochira e no goryokou desu ka.', 'Xin chào quý khách. Quý khách định đi du lịch ở đâu ạ?'],
      ['ワン', 'a', '{来月|らいげつ}、{両親|りょうしん}が{中国|ちゅうごく}から{来|く}るので、{1泊2日|いっぱくふつか}で{旅行|りょこう}したいんです。どこかいい{所|ところ}はありますか。', 'Raigetsu, ryoushin ga Chuugoku kara kuru node, ippaku futsuka de ryokou shitai n desu. Dokoka ii tokoro wa arimasu ka.', 'Tháng sau bố mẹ tôi từ Trung Quốc sang nên tôi muốn đi du lịch 2 ngày 1 đêm. Có chỗ nào hay không ạ?'],
      ['{係|かかり}の{人|ひと}', 'b', 'ご{両親|りょうしん}と{一緒|いっしょ}なら、{箱根|はこね}はいかがですか。{東京|とうきょう}から{近|ちか}いし、{温泉|おんせん}もあるし、{湖|みずうみ}もきれいですよ。', 'Goryoushin to issho nara, Hakone wa ikaga desu ka. Toukyou kara chikai shi, onsen mo aru shi, mizuumi mo kirei desu yo.', 'Nếu đi cùng bố mẹ thì Hakone thế nào ạ? Gần Tokyo, lại có suối nước nóng, hồ cũng đẹp nữa.'],
      ['ワン', 'a', 'いいですね。でも、{父|ちち}は{足|あし}があまり{強|つよ}くないので、たくさん{歩|ある}くのはちょっと……。', 'Ii desu ne. Demo, chichi wa ashi ga amari tsuyoku nai node, takusan aruku no wa chotto…….', 'Hay quá. Nhưng chân bố tôi không khoẻ lắm nên đi bộ nhiều thì hơi…'],
      ['{係|かかり}の{人|ひと}', 'b', 'それなら、この{旅館|りょかん}がおすすめです。{駅|えき}の{前|まえ}にありますから、{歩|ある}かなくてもいいですし、お{部屋|へや}から{湖|みずうみ}が{見|み}えます。', 'Sore nara, kono ryokan ga osusume desu. Eki no mae ni arimasu kara, arukanakute mo ii desu shi, oheya kara mizuumi ga miemasu.', 'Vậy thì tôi giới thiệu nhà trọ này. Nó ở ngay trước ga nên không cần đi bộ, mà từ phòng còn nhìn thấy hồ.'],
      ['ワン', 'a', '{1泊|いっぱく}いくらですか。', 'Ippaku ikura desu ka.', 'Một đêm bao nhiêu tiền ạ?'],
      ['{係|かかり}の{人|ひと}', 'b', 'お{一人|ひとり}{2万5千円|にまんごせんえん}です。{夕食|ゆうしょく}と{朝食|ちょうしょく}が{付|つ}いています。', 'Ohitori niman gosen en desu. Yuushoku to choushoku ga tsuite imasu.', 'Mỗi người 25.000 yên ạ. Có kèm bữa tối và bữa sáng.'],
      ['ワン', 'a', 'うーん、ちょっと{高|たか}すぎます。{予算|よさん}は{一人|ひとり}{1万5千円|いちまんごせんえん}ぐらいなんです。', 'Uun, chotto takasugimasu. Yosan wa hitori ichiman gosen en gurai na n desu.', 'Ừm, hơi đắt quá ạ. Ngân sách của tôi khoảng 15.000 yên một người.'],
      ['{係|かかり}の{人|ひと}', 'b', 'でしたら、こちらのホテルはいかがですか。{1万3千円|いちまんさんぜんえん}で、{和室|わしつ}もありますよ。', 'Deshitara, kochira no hoteru wa ikaga desu ka. Ichiman sanzen en de, washitsu mo arimasu yo.', 'Nếu vậy thì khách sạn này thế nào ạ? 13.000 yên, còn có cả phòng kiểu Nhật nữa.'],
      ['ワン', 'a', '{和室|わしつ}がいいです。{両親|りょうしん}は{畳|たたみ}のほうが{楽|らく}だと{思|おも}いますから。{予約|よやく}したいんですが、どうすればいいですか。', 'Washitsu ga ii desu. Ryoushin wa tatami no hou ga raku da to omoimasu kara. Yoyaku shitai n desu ga, dou sureba ii desu ka.', 'Phòng kiểu Nhật được ạ. Vì tôi nghĩ bố mẹ tôi ở chiếu tatami sẽ thoải mái hơn. Tôi muốn đặt, phải làm thế nào ạ?'],
      ['{係|かかり}の{人|ひと}', 'b', 'こちらの{紙|かみ}に、お{名前|なまえ}と{電話番号|でんわばんごう}を{書|か}いてください。', 'Kochira no kami ni, onamae to denwa bangou o kaite kudasai.', 'Xin quý khách viết tên và số điện thoại vào tờ giấy này.'],
      ['ワン', 'a', 'はい。あのう、{箱根|はこね}まで{電車|でんしゃ}で{行|い}けば、{乗|の}り{換|か}えがありますか。', 'Hai. Anou, Hakone made densha de ikeba, norikae ga arimasu ka.', 'Vâng. À, nếu đi tàu đến Hakone thì có phải đổi tàu không ạ?'],
      ['{係|かかり}の{人|ひと}', 'b', '{新宿|しんじゅく}から{特急|とっきゅう}に{乗|の}れば、{乗|の}り{換|か}えなしで{行|い}けますよ。{指定席|していせき}を{取|と}れば、{座|すわ}って{行|い}けます。', 'Shinjuku kara tokkyuu ni noreba, norikae nashi de ikemasu yo. Shiteiseki o toreba, suwatte ikemasu.', 'Nếu đi tàu tốc hành từ Shinjuku thì không cần đổi tàu. Nếu lấy ghế đặt trước thì được ngồi suốt đường.'],
      ['ワン', 'a', 'よかった。じゃ、{往復|おうふく}の{指定席|していせき}も{3枚|さんまい}お{願|ねが}いします。{窓側|まどがわ}がいいです。', 'Yokatta. Ja, oufuku no shiteiseki mo sanmai onegai shimasu. Madogawa ga ii desu.', 'May quá. Vậy cho tôi luôn 3 vé ghế đặt trước khứ hồi. Tôi muốn ghế cạnh cửa sổ.'],
    ]),
    {
      t: 'examples',
      items: [
        E('{両親|りょうしん}と{一緒|いっしょ}なら、{箱根|はこね}がいいですよ。', 'Ryoushin to issho nara, Hakone ga ii desu yo.', 'Nếu đi cùng bố mẹ thì Hakone hay đấy.'),
        E('{東京|とうきょう}から{近|ちか}いし、{温泉|おんせん}もあるし、いい{所|ところ}です。', 'Toukyou kara chikai shi, onsen mo aru shi, ii tokoro desu.', 'Vừa gần Tokyo, lại có suối nước nóng, là một nơi tốt.'),
        E('それなら、この{旅館|りょかん}がおすすめです。', 'Sore nara, kono ryokan ga osusume desu.', 'Vậy thì tôi giới thiệu nhà trọ này.'),
        E('ちょっと{高|たか}すぎます。もう{少|すこ}し{安|やす}いのはありますか。', 'Chotto takasugimasu. Mou sukoshi yasui no wa arimasu ka.', 'Hơi đắt quá. Có cái nào rẻ hơn một chút không ạ?'),
        E('{予約|よやく}したいんですが、どうすればいいですか。', 'Yoyaku shitai n desu ga, dou sureba ii desu ka.', 'Tôi muốn đặt chỗ, phải làm thế nào ạ?'),
        E('{特急|とっきゅう}に{乗|の}れば、{乗|の}り{換|か}えなしで{行|い}けます。', 'Tokkyuu ni noreba, norikae nashi de ikemasu.', 'Nếu đi tàu tốc hành thì đi được mà không cần đổi tàu.'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ② — nói chuyện ở quầy dịch vụ',
      items: [
        '**どちらへのご{旅行|りょこう}ですか** — nhân viên nói kính ngữ: どちら (= どこ, lịch sự), ご{旅行|りょこう} (ご + danh từ Hán, tôn trọng khách). Khách cứ trả lời bằng です／ます bình thường.',
        '**ご{両親|りょうしん}と{一緒|いっしょ}なら** — nhân viên nhận điều kiện ワン vừa nói (đi cùng bố mẹ) rồi khuyên → **なら**. Sau đó ワン thêm điều kiện mới (bố đi bộ yếu) → **それなら** = "nếu đã vậy thì".',
        '**{近|ちか}いし、{温泉|おんせん}もあるし、{湖|みずうみ}もきれいです** — ba ưu điểm nối bằng **し**; chú ý **も** đi kèm (温泉**も**, 湖**も**) = "lại còn". **{歩|ある}かなくてもいいですし** = "không cần đi bộ" (ôn ポイント 116) + し.',
        '**ちょっと{高|たか}すぎます** — từ chối khéo kiểu Nhật: chê nhẹ bằng ちょっと + すぎる, rồi nêu ngân sách. Đừng nói cụt ~~{高|たか}いです。いりません~~.',
        '**でしたら** = だったら (vậy thì) ở dạng lịch sự — nhân viên hay dùng. **{取|と}れば** — {席|せき}を{取|と}る = lấy/đặt chỗ ngồi. **{3枚|さんまい}** — vé đếm bằng {枚|まい} (Bài 6).',
      ],
    },

    /* ── ③ 京都で ── */
    { t: 'h', text: '③ {京都|きょうと}で — Một ngày đi chơi: hành lý, bản đồ, con dốc' },
    {
      t: 'canh',
      anh: ['luggage', 'world-map', 'man-walking', 'teacup-without-handle', 'night-with-stars'],
      caption: 'Ngày đầu ở Kyoto: パク kéo vali quá nặng, cả nhóm xem bản đồ du lịch, leo dốc lên chùa Kiyomizu, nghỉ ở quán trà rồi định tối đi dạo khu Gion.',
    },
    {
      t: 'p',
      text: 'Tình huống: **パク**, **アンナ**, **マルコ** đến Kyoto. Cả ngày ba người **nhận xét** mọi thứ: vali **quá nặng** ({重|おも}すぎる), bản đồ **dễ hiểu** (わかりやすい), con dốc **khó đi** ({歩|ある}きにくい), bánh **không quá ngọt nên dễ ăn** ({甘|あま}すぎなくて、{食|た}べやすい), ăn trưa **quá nhiều** ({食|た}べすぎた). Đây là lúc dùng **～すぎる** và **～やすい／～にくい** tự nhiên nhất.',
    },
    DL('Ở Kyoto — "Vali của cậu nặng quá rồi!"', [
      ['マルコ', 'b', 'パクさん、そのスーツケース、{重|おも}すぎませんか。', 'Paku-san, sono suutsukeesu, omosugimasen ka.', 'Park ơi, cái vali đó có nặng quá không?'],
      ['パク', 'c', '{服|ふく}をたくさん{持|も}ってきすぎました……。{全部|ぜんぶ}{着|き}たかったんです。', 'Fuku o takusan motte kisugimashita……. Zenbu kitakatta n desu.', 'Mình mang quá nhiều quần áo… Vì mình muốn mặc hết.'],
      ['アンナ', 'a', '{駅|えき}のコインロッカーに{入|い}れれば、{楽|らく}ですよ。', 'Eki no koin rokkaa ni irereba, raku desu yo.', 'Nếu bỏ vào tủ gửi đồ ở ga thì nhẹ người đấy.'],
      ['パク', 'c', 'そうですね。そうします。……わあ、この{地図|ちず}、わかりやすいですね。{中国語|ちゅうごくご}も{韓国語|かんこくご}もあります。', 'Sou desu ne. Sou shimasu. …… Waa, kono chizu, wakariyasui desu ne. Chuugokugo mo kankokugo mo arimasu.', 'Đúng rồi. Mình làm thế. … Ồ, bản đồ này dễ hiểu ghê. Có cả tiếng Trung lẫn tiếng Hàn.'],
      ['マルコ', 'b', '{本当|ほんとう}だ。{清水寺|きよみずでら}はここからバスで{15分|じゅうごふん}ですね。', 'Hontou da. Kiyomizudera wa koko kara basu de juugofun desu ne.', 'Đúng thật. Từ đây đến chùa Kiyomizu đi xe buýt 15 phút nhỉ.'],
      ['アンナ', 'a', 'ああ、この{坂|さか}、{歩|ある}きにくい……。{新|あたら}しい{靴|くつ}を{履|は}いてきたから、{足|あし}が{痛|いた}いです。', 'Aa, kono saka, arukinikui……. Atarashii kutsu o haite kita kara, ashi ga itai desu.', 'Ôi, con dốc này khó đi quá… Mình đi đôi giày mới nên đau chân.'],
      ['パク', 'c', '{大丈夫|だいじょうぶ}ですか。{少|すこ}し{休|やす}みましょう。あそこのお{茶屋|ちゃや}さん、{席|せき}が{空|あ}いていますよ。', 'Daijoubu desu ka. Sukoshi yasumimashou. Asoko no ochaya-san, seki ga aite imasu yo.', 'Cậu có sao không? Nghỉ một chút đi. Quán trà đằng kia còn chỗ trống đấy.'],
      ['マルコ', 'b', 'ここから{見|み}る{京都|きょうと}の{景色|けしき}、{素晴|すば}らしいですね。{写真|しゃしん}を{撮|と}ろう。', 'Koko kara miru Kyouto no keshiki, subarashii desu ne. Shashin o torou.', 'Cảnh Kyoto nhìn từ đây tuyệt thật. Chụp ảnh nào.'],
      ['アンナ', 'a', 'この{八|や}つ{橋|はし}、{甘|あま}すぎなくて、{食|た}べやすいですね。', 'Kono yatsuhashi, amasuginakute, tabeyasui desu ne.', 'Bánh yatsuhashi này không ngọt quá nên dễ ăn nhỉ.'],
      ['マルコ', 'b', 'お{土産|みやげ}にちょうどいいですね。でも、{僕|ぼく}はお{昼|ひる}を{食|た}べすぎて、もう{食|た}べられない……。', 'Omiyage ni choudo ii desu ne. Demo, boku wa ohiru o tabesugite, mou taberarenai…….', 'Làm quà thì vừa đẹp nhỉ. Nhưng trưa nay mình ăn nhiều quá, không ăn nổi nữa…'],
      ['パク', 'c', 'マルコさん、ラーメンを{大盛|おおも}りで{二杯|にはい}も{食|た}べましたからね。', 'Maruko-san, raamen o oomori de nihai mo tabemashita kara ne.', 'Marco ăn những hai bát ramen cỡ lớn cơ mà.'],
      ['アンナ', 'a', '{夜|よる}は{祇園|ぎおん}を{歩|ある}きたいです。でも、{道|みち}が{細|ほそ}くて、{迷|まよ}いやすいそうですよ。', 'Yoru wa Gion o arukitai desu. Demo, michi ga hosokute, mayoiyasui sou desu yo.', 'Tối mình muốn đi dạo khu Gion. Nhưng nghe nói đường nhỏ nên dễ bị lạc lắm.'],
      ['マルコ', 'b', '{地図|ちず}アプリを{使|つか}えば{大丈夫|だいじょうぶ}ですよ。{暗|くら}くなる{前|まえ}に{行|い}きましょう。', 'Chizu apuri o tsukaeba daijoubu desu yo. Kuraku naru mae ni ikimashou.', 'Dùng ứng dụng bản đồ thì không sao đâu. Đi trước khi trời tối nhé.'],
    ]),
    {
      t: 'examples',
      items: [
        E('このスーツケースは{重|おも}すぎます。', 'Kono suutsukeesu wa omosugimasu.', 'Cái vali này nặng quá.'),
        E('{服|ふく}を{持|も}ってきすぎました。', 'Fuku o motte kisugimashita.', 'Tôi mang quá nhiều quần áo.'),
        E('この{地図|ちず}はわかりやすいです。', 'Kono chizu wa wakariyasui desu.', 'Bản đồ này dễ hiểu.'),
        E('この{坂|さか}は{歩|ある}きにくいです。', 'Kono saka wa arukinikui desu.', 'Con dốc này khó đi.'),
        E('お{昼|ひる}を{食|た}べすぎて、もう{食|た}べられません。', 'Ohiru o tabesugite, mou taberaremasen.', 'Trưa ăn nhiều quá nên không ăn nổi nữa.'),
        E('{祇園|ぎおん}は{道|みち}が{細|ほそ}くて、{迷|まよ}いやすいです。', 'Gion wa michi ga hosokute, mayoiyasui desu.', 'Gion đường nhỏ nên dễ bị lạc.'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ③',
      items: [
        '**{重|おも}すぎませんか** — hỏi phủ định để quan tâm ("có nặng quá không?"). **すぎる** chia như động từ nhóm 2: すぎます／すぎません／すぎました／すぎて.',
        '**{持|も}ってきすぎました** — ～すぎる gắn được cả vào động từ ghép: {持|も}ってくる → {持|も}ってき**すぎる** (mang đến quá nhiều).',
        '**わかりやすい／{歩|ある}きにくい／{食|た}べやすい／{迷|まよ}いやすい** — Vます bỏ ます + やすい／にくい → thành **tính từ い**. {迷|まよ}いやすい ở đây là "dễ bị lạc" (khuynh hướng), không phải "lạc một cách dễ dàng".',
        '**{甘|あま}すぎなくて、{食|た}べやすい** — すぎない (không quá) → thể て **すぎなくて** = "vì không quá… nên…". **{食|た}べすぎて、もう{食|た}べられない** — すぎて nêu lý do.',
        '**{席|せき}が{空|あ}いています** (aite imasu) = còn chỗ trống. Đừng nhầm với **{電車|でんしゃ}が{空|す}いています** (suite imasu) = tàu vắng — cùng chữ 空, khác cách đọc (xem Từ vựng).',
        '**{二杯|にはい}も** — số lượng + も = "những… (nhiều hơn mong đợi)". **{履|は}いてきた** = đi (giày) đến; **～{前|まえ}に** ôn ポイント 106.',
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b17-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 50 từ N4: đặt chỗ, vé tàu, ngắm cảnh, cảm nhận, chuẩn bị đi',
  goal: 'Thuộc 50 từ N4 của chủ đề du lịch: bàn kế hoạch, đặt nhà trọ và vé tàu (往復・片道・指定席・窓側), nói nơi đến (観光地・名所・名物・島・湖・夜景), nhận xét (重い・軽い・狭い・楽) và chuẩn bị hành lý, tiền — mỗi tính từ biết luôn dạng ～すぎる, mỗi động từ biết dạng ～ば.',
  minutes: 50,
  blocks: [
    {
      t: 'p',
      text: '**50 từ** chia 5 nhóm theo đường đi của một chuyến du lịch: **A** lên kế hoạch & đặt chỗ (13) · **B** đi lại — vé, ghế, sân bay (8) · **C** ngắm cảnh (12) · **D** cảm nhận (10) · **E** chuẩn bị & tiền (7). Từ đã học ở Bài 1–16 ({旅行|りょこう}, {予約|よやく}します, {泊|と}まります, {新幹線|しんかんせん}, {温泉|おんせん}, {景色|けしき}, {紅葉|こうよう}, お{土産|みやげ}, {混|こ}みます, {計画|けいかく}, {予定|よてい}…) KHÔNG lặp lại — gặp trong câu ví dụ thì coi như ôn. Số **1 / 2 / 3** sau động từ = nhóm động từ; dòng **"+"** cho luôn **thể ～ば** (Ngữ pháp ①) và với tính từ là **～すぎる** (Ngữ pháp ④).',
    },
    {
      t: 'note',
      title: 'Cách học 50 từ trong 3 ngày',
      items: [
        '**Ngày 1** — nhóm A + B (21 từ): đọc to theo 🔊, che nghĩa tự nói; đọc to hội thoại ② (quầy du lịch) — gần như mọi từ của A, B đều có trong đó.',
        '**Ngày 2** — nhóm C (12 từ): nói 1 câu giới thiệu một nơi ở nước mình có dùng từ đó: {ハロン湾|ハロンわん}は{世界|せかい}で{有名|ゆうめい}な{観光地|かんこうち}です.',
        '**Ngày 3** — nhóm D + E (17 từ) + thẻ hình + trắc nghiệm cuối mục + viết tay 10 từ hay vào đề.',
        'Romaji: trường âm viết theo kana ({空港|くうこう} → **kuukou**, {往復|おうふく} → **oufuku**, {両替|りょうがえ} → **ryougae**); âm ngắt っ viết đôi phụ âm ({出発|しゅっぱつ} → **shuppatsu**, {特急|とっきゅう} → **tokkyuu**).',
      ],
    },

    /* ── A ── */
    { t: 'h', text: 'A. Lên kế hoạch & đặt chỗ (13 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{旅行会社|りょこうがいしゃ}', pos: 'danh từ', ipa: 'ryokougaisha', vi: 'công ty du lịch, đại lý du lịch', ex: '{駅前|えきまえ}の{旅行会社|りょこうがいしゃ}でホテルを{予約|よやく}しました。', exRo: 'Ekimae no ryokougaisha de hoteru o yoyaku shimashita.', exVi: 'Tôi đã đặt khách sạn ở công ty du lịch trước ga.', more: '会社 đọc **がいしゃ** khi đứng sau danh từ khác (âm đục 連濁): {旅行会社|りょこうがいしゃ}, {貿易会社|ぼうえきがいしゃ}. Gói tour = ツアー／パック{旅行|りょこう}.' },
        { w: '{相談|そうだん}します［{相談|そうだん}する］3', pos: 'động từ nhóm 3', ipa: 'soudan shimasu [soudan suru]', vi: 'bàn bạc, hỏi ý kiến, tư vấn (người に相談します)', ex: '{旅行|りょこう}のことを{友達|ともだち}に{相談|そうだん}しました。', exRo: 'Ryokou no koto o tomodachi ni soudan shimashita.', exVi: 'Tôi đã bàn chuyện du lịch với bạn.', more: '+ ば: {相談|そうだん}すれば. {先生|せんせい}に{相談|そうだん}する (hỏi ý kiến thầy cô). {相談|そうだん}に{乗|の}る = cho lời khuyên (N3).' },
        { w: '{調|しら}べます［{調|しら}べる］2', pos: 'động từ nhóm 2', ipa: 'shirabemasu [shiraberu]', vi: 'tra cứu, tìm hiểu, kiểm tra', ex: 'インターネットでホテルの{値段|ねだん}を{調|しら}べます。', exRo: 'Intaanetto de hoteru no nedan o shirabemasu.', exVi: 'Tôi tra giá khách sạn trên mạng.', more: '+ ば: {調|しら}べれば · {辞書|じしょ}で{調|しら}べる (tra từ điển). Khác {探|さが}す (tìm một vật/người cụ thể).' },
        { w: 'ガイドブック', pos: 'danh từ', ipa: 'gaidobukku', vi: 'sách hướng dẫn du lịch', ex: 'ガイドブックを{見|み}れば、{有名|ゆうめい}な{店|みせ}がすぐわかります。', exRo: 'Gaidobukku o mireba, yuumei na mise ga sugu wakarimasu.', exVi: 'Xem sách hướng dẫn thì biết ngay các quán nổi tiếng.', more: 'ガイド = hướng dẫn viên (ガイドさん). {観光|かんこう}ガイド = hướng dẫn viên du lịch.' },
        { w: '{連休|れんきゅう}', pos: 'danh từ', ipa: 'renkyuu', vi: 'kỳ nghỉ dài (nhiều ngày nghỉ liền nhau)', ex: '{今度|こんど}の{連休|れんきゅう}は{3日間|みっかかん}です。', exRo: 'Kondo no renkyuu wa mikkakan desu.', exVi: 'Kỳ nghỉ dài lần này kéo dài 3 ngày.', more: '連 (liền) + 休 (nghỉ). Kỳ nghỉ dài nổi tiếng nhất: ゴールデンウィーク (cuối tháng 4 – đầu tháng 5). {連休|れんきゅう}は{混|こ}みます.' },
        { w: '{日帰|ひがえ}り', pos: 'danh từ', ipa: 'higaeri', vi: 'đi về trong ngày', ex: '{箱根|はこね}なら、{日帰|ひがえ}りでも{行|い}けますよ。', exRo: 'Hakone nara, higaeri de mo ikemasu yo.', exVi: 'Nếu là Hakone thì đi về trong ngày cũng được đấy.', more: '日 (ngày) + {帰|かえ}り (về). {日帰|ひがえ}り{旅行|りょこう} = chuyến đi trong ngày · {日帰|ひがえ}り{温泉|おんせん} = tắm onsen không ngủ lại.' },
        { w: '～{泊|はく}／{1泊|いっぱく}', pos: 'hậu tố đếm', ipa: '~haku / ippaku', vi: '~ đêm (đếm số đêm ngủ lại)', ex: '{京都|きょうと}に{2泊|にはく}しました。', exRo: 'Kyouto ni nihaku shimashita.', exVi: 'Tôi đã ở Kyoto 2 đêm.', more: 'Đọc: {1泊|いっぱく} · {2泊|にはく} · {3泊|さんぱく}. **{1泊2日|いっぱくふつか}** = 2 ngày 1 đêm, **{2泊3日|にはくみっか}** = 3 ngày 2 đêm. {1泊|いっぱく}いくらですか = một đêm bao nhiêu tiền?' },
        { w: '{旅館|りょかん}', pos: 'danh từ', ipa: 'ryokan', vi: 'nhà trọ kiểu Nhật (phòng chiếu tatami, thường có onsen)', ex: '{旅館|りょかん}の{料理|りょうり}はとてもおいしかったです。', exRo: 'Ryokan no ryouri wa totemo oishikatta desu.', exVi: 'Đồ ăn ở nhà trọ kiểu Nhật rất ngon.', more: 'Đối với ホテル (khách sạn kiểu Tây). {旅館|りょかん}に{泊|と}まる. Ở {旅館|りょかん} khách mặc {浴衣|ゆかた} (Bài 13).' },
        { w: '{和室|わしつ}／{洋室|ようしつ}', pos: 'danh từ', ipa: 'washitsu / youshitsu', vi: 'phòng kiểu Nhật (chiếu tatami) / phòng kiểu Tây (giường)', ex: '{和室|わしつ}と{洋室|ようしつ}と、どちらがいいですか。', exRo: 'Washitsu to youshitsu to, dochira ga ii desu ka.', exVi: 'Phòng kiểu Nhật và phòng kiểu Tây, bạn thích phòng nào?', more: '和 = Nhật ({和食|わしょく} món Nhật), 洋 = Tây ({洋服|ようふく} quần áo Tây). Chữ **洋** là chữ Hán mới của bài.' },
        { w: '{予算|よさん}', pos: 'danh từ', ipa: 'yosan', vi: 'ngân sách, số tiền dự tính chi', ex: '{予算|よさん}は{一人|ひとり}{3万円|さんまんえん}です。', exRo: 'Yosan wa hitori sanman en desu.', exVi: 'Ngân sách là 3 vạn yên một người.', more: '{予算|よさん}が{足|た}りない (thiếu ngân sách) · {予算|よさん}をオーバーする (vượt ngân sách). Chữ 予 giống {予約|よやく}, {予定|よてい}.' },
        { w: '{割引|わりびき}', pos: 'danh từ', ipa: 'waribiki', vi: 'giảm giá', ex: '{学生|がくせい}は{割引|わりびき}があります。', exRo: 'Gakusei wa waribiki ga arimasu.', exVi: 'Sinh viên được giảm giá.', more: '**{2割引|にわりびき}** = giảm 20% (1割 = 10%) · {学割|がくわり} = giá sinh viên · {割引券|わりびきけん} = phiếu giảm giá. Biển 「割」 trong cửa hàng = đang giảm giá.' },
        { w: 'キャンセルします［キャンセルする］3', pos: 'động từ nhóm 3', ipa: 'kyanseru shimasu [kyanseru suru]', vi: 'huỷ (đặt chỗ, vé)', ex: '{台風|たいふう}で{飛行機|ひこうき}をキャンセルしました。', exRo: 'Taifuu de hikouki o kyanseru shimashita.', exVi: 'Vì bão nên tôi đã huỷ chuyến bay.', more: '+ ば: キャンセルすれば. キャンセル{料|りょう} = phí huỷ. Nghĩa giống {取|と}り{消|け}す (văn viết).' },
        { w: '{空|あ}いています［{空|あ}く］1', pos: 'động từ nhóm 1 (tự động từ) — dạng ています', ipa: 'aite imasu [aku]', vi: '(chỗ, phòng, ghế) còn trống', ex: '{今週|こんしゅう}の{土曜日|どようび}、{部屋|へや}は{空|あ}いていますか。', exRo: 'Konshuu no doyoubi, heya wa aite imasu ka.', exVi: 'Thứ Bảy tuần này còn phòng trống không ạ?', more: '⚠ Cùng chữ 空 nhưng **{電車|でんしゃ}が{空|す}いている** (suite iru) = tàu VẮNG ↔ {席|せき}が**{空|あ}いている** (aite iru) = ghế TRỐNG. Hết phòng = {満室|まんしつ}. Đối của {空|す}いている là {混|こ}んでいる (Bài 15).' },
      ],
    },

    /* ── B ── */
    { t: 'h', text: 'B. Đi lại — vé, ghế, sân bay (8 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{特急|とっきゅう}', pos: 'danh từ', ipa: 'tokkyuu', vi: 'tàu tốc hành đặc biệt (dừng ít ga)', ex: '{特急|とっきゅう}に{乗|の}れば、{1時間|いちじかん}で{着|つ}きます。', exRo: 'Tokkyuu ni noreba, ichijikan de tsukimasu.', exVi: 'Nếu đi tàu tốc hành thì 1 tiếng là tới.', more: 'Thứ tự nhanh dần: {普通|ふつう} (dừng mọi ga) → {快速|かいそく} → {急行|きゅうこう} → **{特急|とっきゅう}**. {特急券|とっきゅうけん} = vé phụ thu tốc hành.' },
        { w: '{指定席|していせき}／{自由席|じゆうせき}', pos: 'danh từ', ipa: 'shiteiseki / jiyuuseki', vi: 'ghế đặt trước (có số ghế) / ghế tự do (ai đến trước ngồi trước)', ex: '{連休|れんきゅう}は{混|こ}みますから、{指定席|していせき}を{取|と}ったほうがいいです。', exRo: 'Renkyuu wa komimasu kara, shiteiseki o totta hou ga ii desu.', exVi: 'Kỳ nghỉ dài đông nên lấy ghế đặt trước thì hơn.', more: '{指定席|していせき}を{取|と}る／{予約|よやく}する. {自由席|じゆうせき} rẻ hơn nhưng có thể phải đứng. Chữ **指・定** là chữ Hán mới của bài.' },
        { w: '{往復|おうふく}／{片道|かたみち}', pos: 'danh từ', ipa: 'oufuku / katamichi', vi: 'khứ hồi (đi và về) / một chiều', ex: '{大阪|おおさか}まで{往復|おうふく}でいくらですか。', exRo: 'Oosaka made oufuku de ikura desu ka.', exVi: 'Đến Osaka khứ hồi bao nhiêu tiền?', more: '{往復|おうふく}{切符|きっぷ} (vé khứ hồi) · {片道|かたみち}{2時間|にじかん} (một chiều mất 2 tiếng). 往 = đi, 復 = về.' },
        { w: '{窓側|まどがわ}／{通路側|つうろがわ}', pos: 'danh từ', ipa: 'madogawa / tsuurogawa', vi: 'phía cửa sổ / phía lối đi (chỗ ngồi)', ex: '{窓側|まどがわ}の{席|せき}をお{願|ねが}いします。', exRo: 'Madogawa no seki o onegai shimasu.', exVi: 'Cho tôi ghế cạnh cửa sổ.', more: '～**側**(がわ) = phía ~: {右側|みぎがわ}, {左側|ひだりがわ}, {反対側|はんたいがわ}. Chữ **側** là chữ Hán mới của bài — đọc **がわ** (đục) khi đứng sau danh từ.' },
        { w: '{空港|くうこう}', pos: 'danh từ', ipa: 'kuukou', vi: 'sân bay', ex: '{空港|くうこう}まで{電車|でんしゃ}で{1時間|いちじかん}かかります。', exRo: 'Kuukou made densha de ichijikan kakarimasu.', exVi: 'Đến sân bay đi tàu mất 1 tiếng.', more: '{成田空港|なりたくうこう}, {羽田空港|はねだくうこう}. 空 (trời) + 港 (cảng) = "cảng trên trời". Cảng biển = {港|みなと} (nhóm C).' },
        { w: '{出発|しゅっぱつ}します［{出発|しゅっぱつ}する］3', pos: 'động từ nhóm 3', ipa: 'shuppatsu shimasu [shuppatsu suru]', vi: 'xuất phát, khởi hành', ex: 'バスは{朝|あさ}{7時|しちじ}に{出発|しゅっぱつ}します。', exRo: 'Basu wa asa shichiji ni shuppatsu shimasu.', exVi: 'Xe buýt khởi hành lúc 7 giờ sáng.', more: '+ ば: {出発|しゅっぱつ}すれば. Đối: {到着|とうちゃく}する (đến nơi — văn thông báo; nói thường là {着|つ}く). Nơi đi dùng **を**: {東京|とうきょう}を{出発|しゅっぱつ}する.' },
        { w: '{乗|の}り{換|か}えます［{乗|の}り{換|か}える］2', pos: 'động từ nhóm 2', ipa: 'norikaemasu [norikaeru]', vi: 'đổi tàu, chuyển tuyến', ex: '{新宿|しんじゅく}で{特急|とっきゅう}に{乗|の}り{換|か}えてください。', exRo: 'Shinjuku de tokkyuu ni norikaete kudasai.', exVi: 'Hãy đổi sang tàu tốc hành ở Shinjuku.', more: '+ ば: {乗|の}り{換|か}えれば. Nơi đổi **で**, tàu mới **に**: AでBに{乗|の}り{換|か}える. Danh từ: {乗|の}り{換|か}え (lần đổi tàu) — {乗|の}り{換|か}えなしで = không phải đổi.' },
        { w: '{迷|まよ}います［{迷|まよ}う］1', pos: 'động từ nhóm 1', ipa: 'mayoimasu [mayou]', vi: 'lạc (đường); phân vân, do dự', ex: '{駅|えき}の{中|なか}で{道|みち}に{迷|まよ}いました。', exRo: 'Eki no naka de michi ni mayoimashita.', exVi: 'Tôi bị lạc đường trong nhà ga.', more: '**{道|みち}に{迷|まよ}う** (lạc đường — trợ từ に). Nghĩa 2: どちらにするか{迷|まよ}っています (đang phân vân chọn cái nào). + ば: {迷|まよ}えば. ～やすい: {迷|まよ}いやすい (dễ lạc).' },
      ],
    },

    /* ── C ── */
    { t: 'h', text: 'C. Ngắm cảnh — nơi đến và điều nổi tiếng (12 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{観光|かんこう}します［{観光|かんこう}する］3', pos: 'động từ nhóm 3', ipa: 'kankou shimasu [kankou suru]', vi: 'tham quan, du lịch ngắm cảnh', ex: '{京都|きょうと}で{3日間|みっかかん}{観光|かんこう}しました。', exRo: 'Kyouto de mikkakan kankou shimashita.', exVi: 'Tôi đã tham quan ở Kyoto 3 ngày.', more: '{観光客|かんこうきゃく} = khách du lịch · {観光|かんこう}バス. 観 (xem) + 光 (ánh sáng — "cái đẹp" của một vùng). Chữ **光** là chữ Hán mới của bài.' },
        { w: '{観光地|かんこうち}', pos: 'danh từ', ipa: 'kankouchi', vi: 'điểm du lịch, khu du lịch', ex: '{有名|ゆうめい}な{観光地|かんこうち}は{週末|しゅうまつ}とても{混|こ}みます。', exRo: 'Yuumei na kankouchi wa shuumatsu totemo komimasu.', exVi: 'Điểm du lịch nổi tiếng cuối tuần rất đông.', more: '～{地|ち} = vùng, nơi ~: {観光地|かんこうち}, {目的地|もくてきち} (nơi đến), {住宅地|じゅうたくち} (khu dân cư).' },
        { w: '{案内|あんない}します［{案内|あんない}する］3', pos: 'động từ nhóm 3', ipa: 'annai shimasu [annai suru]', vi: 'hướng dẫn, dẫn đường, giới thiệu (nơi chốn)', ex: '{友達|ともだち}が{京都|きょうと}を{案内|あんない}してくれました。', exRo: 'Tomodachi ga Kyouto o annai shite kuremashita.', exVi: 'Bạn tôi đã dẫn tôi đi tham quan Kyoto.', more: '{観光案内所|かんこうあんないじょ} = quầy thông tin du lịch · ご{案内|あんない}します (nhân viên: "xin mời đi lối này"). Chữ **案・内** là chữ Hán mới.' },
        { w: '{名所|めいしょ}', pos: 'danh từ', ipa: 'meisho', vi: 'danh lam, địa điểm nổi tiếng', ex: '{京都|きょうと}には{桜|さくら}の{名所|めいしょ}がたくさんあります。', exRo: 'Kyouto ni wa sakura no meisho ga takusan arimasu.', exVi: 'Ở Kyoto có rất nhiều nơi ngắm hoa anh đào nổi tiếng.', more: 'N の{名所|めいしょ}: {紅葉|こうよう}の{名所|めいしょ}, {桜|さくら}の{名所|めいしょ}. Trang trọng hơn {有名|ゆうめい}な{所|ところ}.' },
        { w: '{名物|めいぶつ}', pos: 'danh từ', ipa: 'meibutsu', vi: 'đặc sản (món, đồ nổi tiếng của một vùng)', ex: '{広島|ひろしま}の{名物|めいぶつ}はお{好|この}み{焼|や}きです。', exRo: 'Hiroshima no meibutsu wa okonomiyaki desu.', exVi: 'Đặc sản của Hiroshima là bánh okonomiyaki.', more: '{名物|めいぶつ}{料理|りょうり} (món đặc sản). Khác お{土産|みやげ} (quà mang về): {名物|めいぶつ}をお{土産|みやげ}に{買|か}う.' },
        { w: '{体験|たいけん}します［{体験|たいけん}する］3', pos: 'động từ nhóm 3', ipa: 'taiken shimasu [taiken suru]', vi: 'trải nghiệm (tự mình làm thử)', ex: '{京都|きょうと}で{着物|きもの}を{着|き}る{体験|たいけん}をしました。', exRo: 'Kyouto de kimono o kiru taiken o shimashita.', exVi: 'Ở Kyoto tôi đã trải nghiệm mặc kimono.', more: '{着物|きもの}{体験|たいけん}, {茶道|さどう}{体験|たいけん}. Khác {経験|けいけん} (Bài 14 — kinh nghiệm tích luỹ): {体験|たいけん} = làm thử một lần bằng chính cơ thể.' },
        { w: '{世界|せかい}', pos: 'danh từ', ipa: 'sekai', vi: 'thế giới', ex: '{富士山|ふじさん}は{世界|せかい}で{有名|ゆうめい}です。', exRo: 'Fujisan wa sekai de yuumei desu.', exVi: 'Núi Phú Sĩ nổi tiếng trên thế giới.', more: '**{世界遺産|せかいいさん}** = di sản thế giới · {世界中|せかいじゅう} = khắp thế giới · {世界一|せかいいち} = nhất thế giới. Chữ **世・界** là chữ Hán mới.' },
        { w: '{自然|しぜん}', pos: 'danh từ / tính từ đuôi な', ipa: 'shizen', vi: 'thiên nhiên; tự nhiên', ex: '{北海道|ほっかいどう}は{自然|しぜん}が{多|おお}くて、{空気|くうき}がきれいです。', exRo: 'Hokkaidou wa shizen ga ookute, kuuki ga kirei desu.', exVi: 'Hokkaido nhiều thiên nhiên, không khí trong lành.', more: '{自然|しぜん}が{豊|ゆた}か (thiên nhiên phong phú) · {自然|しぜん}な{日本語|にほんご} (tiếng Nhật tự nhiên — nghĩa tính từ).' },
        { w: '{島|しま}', pos: 'danh từ', ipa: 'shima', vi: 'đảo, hòn đảo', ex: '{沖縄|おきなわ}にはきれいな{島|しま}がたくさんあります。', exRo: 'Okinawa ni wa kirei na shima ga takusan arimasu.', exVi: 'Ở Okinawa có nhiều hòn đảo đẹp.', more: 'Đếm: {島|しま}が{三|みっ}つ. Trong tên đảo đọc **じま／しま／とう**: {宮島|みやじま}, {半島|はんとう} (bán đảo). Chữ **島** là chữ Hán mới.' },
        { w: '{湖|みずうみ}', pos: 'danh từ', ipa: 'mizuumi', vi: 'hồ (lớn, tự nhiên)', ex: '{旅館|りょかん}の{部屋|へや}から{湖|みずうみ}が{見|み}えます。', exRo: 'Ryokan no heya kara mizuumi ga miemasu.', exVi: 'Từ phòng nhà trọ nhìn thấy hồ.', more: '⚠ Romaji **mizu-umi** (4 âm: み・ず・う・み). Trong tên hồ đọc **こ**: {琵琶湖|びわこ}. Hồ nhỏ, ao = {池|いけ}.' },
        { w: '{港|みなと}', pos: 'danh từ', ipa: 'minato', vi: 'cảng (biển)', ex: '{港|みなと}から{船|ふね}で{島|しま}へ{行|い}きます。', exRo: 'Minato kara fune de shima e ikimasu.', exVi: 'Từ cảng đi thuyền ra đảo.', more: 'Đứng một mình đọc **みなと**; trong từ ghép đọc **こう**: {空港|くうこう}. Thành phố cảng nổi tiếng: {横浜|よこはま}, {神戸|こうべ}.' },
        { w: '{夜景|やけい}', pos: 'danh từ', ipa: 'yakei', vi: 'cảnh đêm (thành phố lên đèn)', ex: '{函館|はこだて}の{夜景|やけい}は{本当|ほんとう}にきれいです。', exRo: 'Hakodate no yakei wa hontou ni kirei desu.', exVi: 'Cảnh đêm Hakodate thật sự rất đẹp.', more: '夜 (đêm) + 景 (cảnh — như {景色|けしき}). {夜景|やけい}を{見|み}に{行|い}く. Cảnh ban ngày nói {景色|けしき}.' },
      ],
    },

    /* ── D ── */
    { t: 'h', text: 'D. Cảm nhận — dùng với ～すぎる・～やすい・～にくい (10 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{美|うつく}しい', pos: 'tính từ đuôi い', ipa: 'utsukushii', vi: 'đẹp (trang trọng, đẹp sâu sắc — cảnh, âm nhạc)', ex: '{山|やま}の{上|うえ}から{見|み}る{朝日|あさひ}は{美|うつく}しかったです。', exRo: 'Yama no ue kara miru asahi wa utsukushikatta desu.', exVi: 'Mặt trời buổi sáng nhìn từ đỉnh núi thật đẹp.', more: 'Văn viết, cảm xúc mạnh hơn きれい. Nói thường hằng ngày dùng きれい; viết bài, đọc thơ, giới thiệu cảnh → {美|うつく}しい.' },
        { w: '{素晴|すば}らしい', pos: 'tính từ đuôi い', ipa: 'subarashii', vi: 'tuyệt vời', ex: 'ここから{見|み}る{景色|けしき}は{素晴|すば}らしいですね。', exRo: 'Koko kara miru keshiki wa subarashii desu ne.', exVi: 'Cảnh nhìn từ đây tuyệt vời nhỉ.', more: 'Khen rất mạnh: {素晴|すば}らしい{景色|けしき}・{旅|たび}・{発表|はっぴょう}. Văn nói thân mật: すごい.' },
        { w: '{重|おも}い', pos: 'tính từ đuôi い', ipa: 'omoi', vi: 'nặng', ex: 'この{荷物|にもつ}は{重|おも}すぎて、{一人|ひとり}で{持|も}てません。', exRo: 'Kono nimotsu wa omosugite, hitori de motemasen.', exVi: 'Hành lý này nặng quá, một mình tôi không xách nổi.', more: '+ すぎる: {重|おも}すぎる. Nghĩa bóng: {病気|びょうき}が{重|おも}い (bệnh nặng). Chữ **重** là chữ Hán mới ✍.' },
        { w: '{軽|かる}い', pos: 'tính từ đuôi い', ipa: 'karui', vi: 'nhẹ', ex: '{軽|かる}いスーツケースなら、{持|も}ちやすいです。', exRo: 'Karui suutsukeesu nara, mochiyasui desu.', exVi: 'Nếu là vali nhẹ thì dễ xách.', more: '{軽|かる}い{食事|しょくじ} (bữa ăn nhẹ) · {軽|かる}い{風邪|かぜ} (cảm nhẹ). Đối: {重|おも}い. Chữ **軽** là chữ Hán mới.' },
        { w: '{狭|せま}い', pos: 'tính từ đuôi い', ipa: 'semai', vi: 'chật, hẹp', ex: 'ホテルの{部屋|へや}が{狭|せま}すぎて、スーツケースが{開|ひら}けません。', exRo: 'Hoteru no heya ga semasugite, suutsukeesu ga hirakemasen.', exVi: 'Phòng khách sạn chật quá, không mở nổi vali.', more: 'Đối: {広|ひろ}い (Bài 6). Đường hẹp nói {狭|せま}い{道|みち} hoặc {細|ほそ}い{道|みち} (đường nhỏ, mảnh).' },
        { w: '{楽|らく}（な）', pos: 'tính từ đuôi な', ipa: 'raku (na)', vi: 'nhẹ nhàng, thoải mái, đỡ vất vả', ex: 'タクシーで{行|い}けば、{楽|らく}ですよ。', exRo: 'Takushii de ikeba, raku desu yo.', exVi: 'Đi taxi thì đỡ vất vả đấy.', more: '⚠ Cùng chữ 楽 với {楽|たの}しい (vui) nhưng nghĩa khác: {楽|らく} = **không vất vả**. {楽|らく}な{仕事|しごと} = việc nhàn. Phó từ: {楽|らく}に.' },
        { w: '{不安|ふあん}（な）', pos: 'tính từ đuôi な / danh từ', ipa: 'fuan (na)', vi: 'lo lắng, bất an', ex: '{一人|ひとり}で{海外|かいがい}に{行|い}くのは{少|すこ}し{不安|ふあん}です。', exRo: 'Hitori de kaigai ni iku no wa sukoshi fuan desu.', exVi: 'Đi nước ngoài một mình tôi hơi lo.', more: 'Khác {心配|しんぱい} (Bài 15): {心配|しんぱい} hướng tới người/việc cụ thể ({母|はは}が{心配|しんぱい}する); {不安|ふあん} là cảm giác bất an chung. Đối: {安心|あんしん}.' },
        { w: '{安心|あんしん}します［{安心|あんしん}する］3', pos: 'động từ nhóm 3 / tính từ đuôi な', ipa: 'anshin shimasu [anshin suru]', vi: 'yên tâm', ex: 'ホテルの{人|ひと}が{日本語|にほんご}を{教|おし}えてくれて、{安心|あんしん}しました。', exRo: 'Hoteru no hito ga nihongo o oshiete kurete, anshin shimashita.', exVi: 'Nhân viên khách sạn chỉ cho tôi tiếng Nhật nên tôi yên tâm.', more: '{安心|あんしん}な{町|まち} (thị trấn an toàn, yên tâm). ご{安心|あんしん}ください (xin quý khách yên tâm).' },
        { w: '{大勢|おおぜい}', pos: 'danh từ / phó từ', ipa: 'oozei', vi: 'đông người, nhiều người', ex: '{連休|れんきゅう}は{観光客|かんこうきゃく}が{大勢|おおぜい}います。', exRo: 'Renkyuu wa kankoukyaku ga oozei imasu.', exVi: 'Kỳ nghỉ dài có rất đông khách du lịch.', more: '⚠ **Chỉ dùng cho NGƯỜI**: {人|ひと}が{大勢|おおぜい} ✓, ~~{車|くるま}が{大勢|おおぜい}~~ ✗ (đồ vật → たくさん). {大勢|おおぜい}の{人|ひと} = rất nhiều người. Romaji **oozei** (お・お・ぜ・い).' },
        { w: 'ちょうどいい', pos: 'cụm tính từ (đuôi い)', ipa: 'choudo ii', vi: 'vừa vặn, vừa đẹp, đúng lúc', ex: 'この{旅館|りょかん}は{値段|ねだん}もちょうどいいし、{駅|えき}からも{近|ちか}いです。', exRo: 'Kono ryokan wa nedan mo choudo ii shi, eki kara mo chikai desu.', exVi: 'Nhà trọ này giá cũng vừa phải, lại gần ga.', more: 'お{土産|みやげ}にちょうどいい (vừa đẹp để làm quà) · ちょうどいい{時間|じかん} (đúng lúc). Quá khứ: ちょうど**よかった**.' },
      ],
    },

    /* ── E ── */
    { t: 'h', text: 'E. Chuẩn bị & tiền (7 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{足|た}ります［{足|た}りる］2', pos: 'động từ nhóm 2', ipa: 'tarimasu [tariru]', vi: 'đủ', ex: '{3万円|さんまんえん}あれば、{足|た}りると{思|おも}います。', exRo: 'Sanman en areba, tariru to omoimasu.', exVi: 'Nếu có 3 vạn yên thì tôi nghĩ là đủ.', more: '⚠ {足|た}りる là **nhóm 2** (足りない, 足りれば). Hay dùng phủ định: お{金|かね}が{足|た}りない (không đủ tiền) · {時間|じかん}が{足|た}りない.' },
        { w: 'スーツケース', pos: 'danh từ', ipa: 'suutsukeesu', vi: 'vali (kéo)', ex: 'スーツケースはコインロッカーに{入|い}れましょう。', exRo: 'Suutsukeesu wa koin rokkaa ni iremashou.', exVi: 'Bỏ vali vào tủ gửi đồ đi.', more: 'スーツケースを{引|ひ}く (kéo vali) · {大|おお}きいスーツケース. コインロッカー = tủ gửi đồ bỏ xu ở ga.' },
        { w: '{忘|わす}れ{物|もの}', pos: 'danh từ', ipa: 'wasuremono', vi: 'đồ bỏ quên', ex: '{電車|でんしゃ}を{降|お}りるとき、{忘|わす}れ{物|もの}に{気|き}をつけてください。', exRo: 'Densha o oriru toki, wasuremono ni ki o tsukete kudasai.', exVi: 'Khi xuống tàu hãy chú ý đừng để quên đồ.', more: '{忘|わす}れ{物|もの}をする (để quên đồ) · {忘|わす}れ{物|もの}はありませんか (có quên gì không?). Phòng đồ thất lạc ở ga: {忘|わす}れ{物|もの}センター.' },
        { w: '{現金|げんきん}', pos: 'danh từ', ipa: 'genkin', vi: 'tiền mặt', ex: 'この{店|みせ}は{現金|げんきん}しか{使|つか}えません。', exRo: 'Kono mise wa genkin shika tsukaemasen.', exVi: 'Cửa hàng này chỉ dùng được tiền mặt.', more: '{現金|げんきん}で{払|はら}う (trả tiền mặt) ↔ カードで{払|はら}う. Quán nhỏ ở vùng quê Nhật nhiều nơi chỉ nhận {現金|げんきん}.' },
        { w: '{両替|りょうがえ}します［{両替|りょうがえ}する］3', pos: 'động từ nhóm 3', ipa: 'ryougae shimasu [ryougae suru]', vi: 'đổi tiền (ngoại tệ, tiền lẻ)', ex: '{空港|くうこう}でドンを{円|えん}に{両替|りょうがえ}しました。', exRo: 'Kuukou de don o en ni ryougae shimashita.', exVi: 'Tôi đã đổi tiền đồng sang yên ở sân bay.', more: 'AをBに{両替|りょうがえ}する (đổi A sang B). {両替|りょうがえ}{所|じょ} = quầy đổi tiền. + ば: {両替|りょうがえ}すれば.' },
        { w: '{天気予報|てんきよほう}', pos: 'danh từ', ipa: 'tenki yohou', vi: 'dự báo thời tiết', ex: '{天気予報|てんきよほう}によると、{明日|あした}は{雨|あめ}です。', exRo: 'Tenki yohou ni yoru to, ashita wa ame desu.', exVi: 'Theo dự báo thời tiết thì mai mưa.', more: '{天気予報|てんきよほう}を{見|み}る · **～によると** = theo ~ (nguồn tin, hay đi với ～そうです). Mẫu hay vào đề: {天気|てんき}がよければ、～ (nếu trời đẹp thì…).' },
        { w: '{楽|たの}しみ', pos: 'danh từ / tính từ đuôi な', ipa: 'tanoshimi', vi: 'niềm vui mong đợi; háo hức', ex: '{来週|らいしゅう}の{旅行|りょこう}、{楽|たの}しみにしています。', exRo: 'Raishuu no ryokou, tanoshimi ni shite imasu.', exVi: 'Tôi đang háo hức chờ chuyến đi tuần sau.', more: '**～を{楽|たの}しみにしています** (đang mong chờ ~ — câu kết thư rất hay dùng) · {楽|たの}しみです (háo hức quá). Gốc: {楽|たの}しい.' },
      ],
    },

    {
      t: 'hinh',
      title: '🖼️ Thẻ từ có hình — nhìn hình nói ra từ (chạm thẻ để nghe)',
      items: [
        { anh: 'airplane-departure', w: '{出発|しゅっぱつ}します', ro: 'shuppatsu shimasu', vi: 'xuất phát, khởi hành (máy bay cất cánh)' },
        { anh: 'airplane-arrival', w: '{到着|とうちゃく}します', ro: 'touchaku shimasu', vi: 'đến nơi (máy bay hạ cánh) — đối của 出発' },
        { anh: 'luggage', w: 'スーツケース', ro: 'suutsukeesu', vi: 'vali' },
        { anh: 'left-luggage', w: 'コインロッカー', ro: 'koin rokkaa', vi: 'tủ gửi đồ ở ga (biểu tượng gửi hành lý)' },
        { anh: 'seat', w: '{指定席|していせき}', ro: 'shiteiseki', vi: 'ghế đặt trước (có số ghế)' },
        { anh: 'bullet-train', w: '{新幹線|しんかんせん}', ro: 'shinkansen', vi: 'tàu Shinkansen (ôn Bài 4)' },
        { anh: 'woman-tipping-hand', w: '{案内|あんない}します', ro: 'annai shimasu', vi: 'hướng dẫn (hình: nhân viên quầy thông tin)' },
        { anh: 'open-book', w: 'ガイドブック', ro: 'gaidobukku', vi: 'sách hướng dẫn du lịch' },
        { anh: 'magnifying-glass-tilted-left', w: '{調|しら}べます', ro: 'shirabemasu', vi: 'tra cứu, tìm hiểu' },
        { anh: 'japanese-discount-button', w: '{割引|わりびき}', ro: 'waribiki', vi: 'giảm giá (biển chữ 割)' },
        { anh: 'japanese-vacancy-button', w: '{空|あ}いています', ro: 'aite imasu', vi: 'còn trống (biển chữ 空 = còn phòng)' },
        { anh: 'japanese-no-vacancy-button', w: '{満室|まんしつ}', ro: 'manshitsu', vi: 'hết phòng (biển chữ 満)' },
        { anh: 'world-map', w: '{世界|せかい}', ro: 'sekai', vi: 'thế giới' },
        { anh: 'national-park', w: '{自然|しぜん}', ro: 'shizen', vi: 'thiên nhiên' },
        { anh: 'desert-island', w: '{島|しま}', ro: 'shima', vi: 'hòn đảo' },
        { anh: 'night-with-stars', w: '{夜景|やけい}', ro: 'yakei', vi: 'cảnh đêm thành phố' },
        { anh: 'person-lifting-weights', w: '{重|おも}い', ro: 'omoi', vi: 'nặng (hình: người nâng tạ)' },
        { anh: 'feather', w: '{軽|かる}い', ro: 'karui', vi: 'nhẹ (hình: lông vũ)' },
        { anh: 'anxious-face-with-sweat', w: '{不安|ふあん}（な）', ro: 'fuan (na)', vi: 'lo lắng, bất an' },
        { anh: 'relieved-face', w: '{安心|あんしん}します', ro: 'anshin shimasu', vi: 'yên tâm (thở phào)' },
        { anh: 'yen-banknote', w: '{現金|げんきん}', ro: 'genkin', vi: 'tiền mặt' },
        { anh: 'running-shoe', w: '{歩|ある}きやすい{靴|くつ}', ro: 'arukiyasui kutsu', vi: 'giày dễ đi (mẫu ～やすい của bài)' },
      ],
    },
    {
      t: 'table',
      caption: 'Tính từ của bài + ～すぎる — nói được ngay (Ngữ pháp ④)',
      head: ['Tính từ', '～すぎます', 'Romaji', 'Câu mẫu'],
      rows: [
        ['{重|おも}い', '{重|おも}すぎます', 'omosugimasu', 'スーツケースが{重|おも}すぎます。'],
        ['{軽|かる}い', '{軽|かる}すぎます', 'karusugimasu', '{軽|かる}すぎるスーツケースは{壊|こわ}れやすいです。'],
        ['{狭|せま}い', '{狭|せま}すぎます', 'semasugimasu', '{部屋|へや}が{狭|せま}すぎます。'],
        ['{高|たか}い', '{高|たか}すぎます', 'takasugimasu', '{旅館|りょかん}は{高|たか}すぎます。'],
        ['いい', '**よ**すぎます', 'yosugimasu', '{天気|てんき}がよすぎて、{暑|あつ}いです。'],
        ['{楽|らく}（な）', '{楽|らく}すぎます', 'rakusugimasu', 'この{仕事|しごと}は{楽|らく}すぎます。'],
        ['{静|しず}か（な）', '{静|しず}かすぎます', 'shizukasugimasu', '{夜|よる}の{町|まち}が{静|しず}かすぎて、{少|すこ}し{不安|ふあん}です。'],
      ],
    },
    {
      t: 'note',
      title: 'Từ dễ nhầm trong bài',
      items: [
        '**{空|あ}いている ↔ {空|す}いている** — cùng chữ 空: {席|せき}・{部屋|へや}が**{空|あ}いている** (aite iru — còn trống, chưa ai dùng) ↔ {電車|でんしゃ}・{道|みち}・お{店|みせ}が**{空|す}いている** (suite iru — vắng, ít người). Đối của {空|す}いている là {混|こ}んでいる.',
        '**{楽|らく} ↔ {楽|たの}しい** — {楽|らく} = đỡ vất vả, nhàn; {楽|たの}しい = vui. "Đi taxi thì {楽|らく}" (đỡ mệt), "Chuyến đi {楽|たの}しかった" (vui).',
        '**{観光|かんこう} ↔ {旅行|りょこう}** — {旅行|りょこう} = cả chuyến đi xa; {観光|かんこう} = phần đi xem cảnh, tham quan ở nơi đến. {京都|きょうと}へ{旅行|りょこう}して、お{寺|てら}を{観光|かんこう}しました.',
        '**{体験|たいけん} ↔ {経験|けいけん}** — {体験|たいけん}: tự mình làm thử một lần ({着物|きもの}{体験|たいけん}); {経験|けいけん}: kinh nghiệm tích luỹ ({仕事|しごと}の{経験|けいけん}がある).',
        '**{大勢|おおぜい} ↔ たくさん** — {大勢|おおぜい} chỉ cho người; たくさん dùng cho cả người lẫn vật.',
        '**{名物|めいぶつ} ↔ お{土産|みやげ}** — {名物|めいぶつ}: thứ nổi tiếng của vùng (ăn tại chỗ hoặc mua); お{土産|みやげ}: quà mang về cho người khác.',
        '**{美|うつく}しい ↔ きれい** — cùng là "đẹp"; {美|うつく}しい trang trọng, hay ở văn viết. きれい còn có nghĩa "sạch" — {美|うつく}しい thì không.',
      ],
    },
    {
      t: 'note',
      title: 'Kết hợp từ (コロケーション) nên học thành cụm',
      items: [
        '{指定席|していせき}**を{取|と}る** · {部屋|へや}**を{予約|よやく}する** · ホテル**をキャンセルする** · {友達|ともだち}**に{相談|そうだん}する**',
        '{道|みち}**に{迷|まよ}う** · AでB**に{乗|の}り{換|か}える** · {東京|とうきょう}**を{出発|しゅっぱつ}する** · ドンを{円|えん}**に{両替|りょうがえ}する**',
        '{席|せき}**が{空|あ}いている** · お{金|かね}**が{足|た}りない** · {割引|わりびき}**がある** · {町|まち}**を{案内|あんない}する**',
        '{紅葉|こうよう}**の{名所|めいしょ}** · {京都|きょうと}**の{名物|めいぶつ}** · {旅行|りょこう}**を{楽|たの}しみにしている** · {忘|わす}れ{物|もの}**をする**',
      ],
    },
    {
      t: 'write',
      id: 'b17-viet-tu',
      title: 'Viết tay 10 từ hay vào đề',
      note: 'Dòng trên tô theo mẫu, dòng dưới tự viết. Bật "Che mẫu" để tự nhớ ra từ chỉ từ gợi ý nghĩa.',
      chars: ['出発', '世界', '重い', '軽い', '空港', '島', '案内', '予定', '窓側', '洋室'],
      goi: {
        '出発': 'しゅっぱつ · xuất phát',
        '世界': 'せかい · thế giới',
        '重い': 'おもい · nặng',
        '軽い': 'かるい · nhẹ',
        '空港': 'くうこう · sân bay',
        '島': 'しま · hòn đảo',
        '案内': 'あんない · hướng dẫn',
        '予定': 'よてい · dự định, lịch',
        '窓側': 'まどがわ · phía cửa sổ',
        '洋室': 'ようしつ · phòng kiểu Tây',
      },
    },
    {
      t: 'mcq',
      id: 'b17-tv-trac-nghiem',
      title: 'Kiểm tra từ vựng — 14 câu (dạng 文脈規定・言い換え của đề N4)',
      items: [
        { q: '{東京|とうきょう}から{大阪|おおさか}まで、（　）でいくらですか。{帰|かえ}りの{切符|きっぷ}もほしいです。', options: ['{片道|かたみち}', '{往復|おうふく}', '{日帰|ひがえ}り', '{予算|よさん}'], correct: 1, why: 'Cần cả vé về → **{往復|おうふく}** (khứ hồi). 〔Toukyou kara Oosaka made, oufuku de ikura desu ka.〕' },
        { q: '{連休|れんきゅう}は{混|こ}みますから、（　）を{取|と}ったほうがいいですよ。', options: ['{自由席|じゆうせき}', '{指定席|していせき}', '{忘|わす}れ{物|もの}', '{割引|わりびき}'], correct: 1, why: 'Đông người → lấy **{指定席|していせき}** (ghế đặt trước) cho chắc có chỗ. 〔Renkyuu wa komimasu kara, shiteiseki o totta hou ga ii desu yo.〕' },
        { q: '{新宿|しんじゅく}で{特急|とっきゅう}に（　）ください。', options: ['{乗|の}り{換|か}えて', '{出発|しゅっぱつ}して', '{迷|まよ}って', '{両替|りょうがえ}して'], correct: 0, why: 'Đổi sang tàu khác = **{乗|の}り{換|か}える** (A で B に). 〔Shinjuku de tokkyuu ni norikaete kudasai.〕' },
        { q: '{駅|えき}の{中|なか}が{広|ひろ}くて、{道|みち}に（　）。', options: ['{調|しら}べました', '{迷|まよ}いました', '{案内|あんない}しました', '{相談|そうだん}しました'], correct: 1, why: '**{道|みち}に{迷|まよ}う** = lạc đường. 〔Eki no naka ga hirokute, michi ni mayoimashita.〕' },
        { q: '{旅行|りょこう}に{行|い}く{前|まえ}に、インターネットでホテルを（　）。', options: ['{調|しら}べます', '{足|た}ります', '{空|あ}きます', '{迷|まよ}います'], correct: 0, why: 'Tra cứu = **{調|しら}べる**. 〔Ryokou ni iku mae ni, intaanetto de hoteru o shirabemasu.〕' },
        { q: 'すみません、{今週|こんしゅう}の{土曜日|どようび}、{部屋|へや}は（　）いますか。', options: ['{空|す}いて', '{空|あ}いて', '{混|こ}んで', '{足|た}りて'], correct: 1, why: 'Phòng còn trống = **{空|あ}いている** (aite iru). {空|す}いている là "vắng" (tàu, đường). 〔Heya wa aite imasu ka.〕' },
        { q: '{学生|がくせい}は（　）があって、{半分|はんぶん}の{値段|ねだん}で{入|はい}れます。', options: ['{予算|よさん}', '{割引|わりびき}', '{名物|めいぶつ}', '{夜景|やけい}'], correct: 1, why: 'Rẻ đi một nửa → **{割引|わりびき}** (giảm giá). 〔Gakusei wa waribiki ga atte, hanbun no nedan de hairemasu.〕' },
        { q: '{広島|ひろしま}の（　）はお{好|この}み{焼|や}きです。ぜひ{食|た}べてください。', options: ['{名物|めいぶつ}', '{名所|めいしょ}', '{自然|しぜん}', '{世界|せかい}'], correct: 0, why: 'Món nổi tiếng của vùng = **{名物|めいぶつ}**. {名所|めいしょ} là địa điểm. 〔Hiroshima no meibutsu wa okonomiyaki desu.〕' },
        { q: '{日曜日|にちようび}の{公園|こうえん}には{人|ひと}が（　）いました。', options: ['{大勢|おおぜい}', 'ちょうど', '{楽|らく}に', '{不安|ふあん}に'], correct: 0, why: '"Rất đông người" = **{大勢|おおぜい}** (chỉ dùng cho người). 〔Nichiyoubi no kouen ni wa hito ga oozei imashita.〕' },
        { q: 'タクシーで{行|い}けば、{歩|ある}かなくてもいいですから、（　）ですよ。', options: ['{楽|らく}', '{楽|たの}しみ', '{不安|ふあん}', '{狭|せま}い'], correct: 0, why: 'Không phải đi bộ → đỡ vất vả = **{楽|らく}**. Bẫy: {楽|たの}しみ (háo hức) cùng chữ 楽. 〔Takushii de ikeba, arukanakute mo ii desu kara, raku desu yo.〕' },
        { q: '{3万円|さんまんえん}で（　）と{思|おも}いますか。——{交通費|こうつうひ}も{入|い}れると、ちょっと……。', options: ['{足|た}りる', '{空|あ}く', '{迷|まよ}う', '{調|しら}べる'], correct: 0, why: 'Hỏi tiền có đủ không = **{足|た}りる**. 〔Sanman en de tariru to omoimasu ka.〕' },
        { q: '「{来週|らいしゅう}の{旅行|りょこう}を{楽|たの}しみにしています。」と{同|おな}じ{意味|いみ}は？', options: ['{来週|らいしゅう}の{旅行|りょこう}はたぶん{楽|らく}です。', '{来週|らいしゅう}の{旅行|りょこう}に{早|はや}く{行|い}きたいです。', '{来週|らいしゅう}の{旅行|りょこう}は{楽|たの}しかったです。', '{来週|らいしゅう}の{旅行|りょこう}をキャンセルしました。'], correct: 1, why: '{楽|たの}しみにしている = mong chờ ≈ **{早|はや}く{行|い}きたい**. 〔Raishuu no ryokou ni hayaku ikitai desu.〕 (dạng 言い換え類義)' },
        { q: '「{日帰|ひがえ}りで{温泉|おんせん}に{行|い}きました。」の{意味|いみ}は？', options: ['{温泉|おんせん}に{2泊|にはく}しました。', 'その{日|ひ}のうちに{家|うち}に{帰|かえ}りました。', '{温泉|おんせん}に{行|い}きませんでした。', '{温泉|おんせん}から{帰|かえ}りませんでした。'], correct: 1, why: '{日帰|ひがえ}り = đi về trong ngày ≈ **その{日|ひ}のうちに{帰|かえ}った**. 〔Sono hi no uchi ni uchi ni kaerimashita.〕' },
        { q: 'この{店|みせ}はカードが{使|つか}えませんから、（　）を{持|も}っていってください。', options: ['{現金|げんきん}', '{予算|よさん}', '{割引|わりびき}', 'ガイドブック'], correct: 0, why: 'Không dùng được thẻ → mang **{現金|げんきん}** (tiền mặt). 〔Genkin o motte itte kudasai.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b17-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp N4 — ～ば, ～ばいいですか, ～なら, ～し、～し, ～すぎる, ～やすい・～にくい',
  goal: 'Chia đúng thể ～ば của động từ, tính từ, danh từ (cả phủ định ～なければ) và dùng nó để nêu điều kiện, hỏi / khuyên cách làm (～ばいいですか); phân biệt ～ば với ～と, ～たら, ～なら như đề N4 hỏi; dùng ～なら để nhận lời người kia rồi khuyên; nối nhiều lý do bằng ～し、～し; nói "quá…" bằng ～すぎる và "dễ / khó làm" bằng ～やすい／～にくい.',
  minutes: 110,
  blocks: [
    {
      t: 'p',
      text: 'Bài 17 có **5 mẫu N4**. Hai mẫu đầu là **câu điều kiện** — họ hàng của ～と (ポイント 113) và ～たら (ポイント 120) bạn đã học: **(1) ～ば** — "nếu… thì…", kèm câu hỏi rất hay dùng **～ばいいですか** (phải làm thế nào?); **(2) ～なら** — "nếu là… thì…" (nhận lời người kia rồi góp ý). Ba mẫu sau dùng để **nhận xét**: **(3) ～し、～し** (vừa… lại…), **(4) ～すぎる** (quá…), **(5) ～やすい／～にくい** (dễ / khó làm). Mỗi mẫu: bảng chia → công thức → ≥5 ví dụ → hỏi–đáp → bảng thay thế → công thức 1 dòng → lỗi hay mắc. Cuối bài có **bảng phân biệt と・ば・たら・なら** — câu hỏi kinh điển của đề N4.',
    },
    {
      t: 'table',
      caption: 'Bản đồ ngữ pháp Bài 17',
      head: ['#', 'Mẫu', 'Nghĩa', 'Ví dụ ngắn', 'Cấp'],
      rows: [
        ['①', 'V／イA／ナA／N ‑ば (条件形)', 'nếu … thì … (điều kiện)', '{安|やす}ければ、{買|か}います。', 'N4'],
        ['①′', 'Vば いいですか／いいです', 'phải làm thế nào? / cứ làm … là được', 'どうすればいいですか。', 'N4'],
        ['②', 'N／普通形 ＋ なら', 'nếu là … thì … (nhận lời người kia)', '{京都|きょうと}なら、{秋|あき}がいいですよ。', 'N4'],
        ['③', '普通形 ＋ し、～し', 'vừa … lại … (nêu nhiều lý do)', '{近|ちか}いし、{安|やす}いし、いいですね。', 'N4'],
        ['④', 'Vます／イA／ナA ＋ すぎる', 'quá … (vượt mức, thường là không tốt)', '{高|たか}すぎます。', 'N4'],
        ['⑤', 'Vます ＋ やすい／にくい', 'dễ / khó V; dễ bị …', 'わかりやすいです。', 'N4'],
      ],
    },

    /* ══════ ① ～ば ══════ */
    { t: 'h', text: '① Thể điều kiện ～ば (条件形) — "nếu … thì …"' },
    {
      t: 'p',
      text: 'Bạn đã có hai cách nói "nếu": **～と** (ポイント 113 — hễ A là tự nhiên B: ボタンを{押|お}すと、{水|みず}が{出|で}ます) và **～たら** (ポイント 120 — nếu/khi A xong thì B, dùng được gần như mọi lúc). **～ば** là cách thứ ba: nó nhấn vào **điều kiện cần** — "chỉ cần A thì B", "có A thì mới B". Câu ば rất hay gặp khi **khuyên, so sánh phương án, nói cách được lợi**: {早|はや}く{予約|よやく}すれば、{安|やす}くなります (đặt sớm thì rẻ hơn).',
    },
    {
      t: 'table',
      caption: 'Cách chia thể ～ば — từ thể từ điển (động từ) và từ thể い／な (tính từ)',
      head: ['Loại', 'Quy tắc', 'Ví dụ', 'Phủ định ～なければ', 'Romaji'],
      rows: [
        ['Động từ nhóm 1', 'đuôi **う段 → え段 + ば**', '{行|い}く → {行|い}**けば** · {話|はな}す → {話|はな}**せば** · {待|ま}つ → {待|ま}**てば** · {読|よ}む → {読|よ}**めば** · {乗|の}る → {乗|の}**れば** · {買|か}う → {買|か}**えば** · ある → **あれば**', '{行|い}かない → {行|い}か**なければ**', 'ikeba · hanaseba · mateba · yomeba · noreba · kaeba · areba · ikanakereba'],
        ['Động từ nhóm 2', 'bỏ **る** + **れば**', '{食|た}べる → {食|た}べ**れば** · {見|み}る → {見|み}**れば** · {乗|の}り{換|か}える → {乗|の}り{換|か}え**れば**', '{食|た}べない → {食|た}べ**なければ**', 'tabereba · mireba · norikaereba · tabenakereba'],
        ['Động từ nhóm 3', '**する → すれば** · **{来|く}る → {来|く}れば**', '{予約|よやく}する → {予約|よやく}**すれば** · {来|く}る → **{来|く}れば**', 'しない → **しなければ** · {来|こ}ない → **{来|こ}なければ**', 'sureba · kureba · shinakereba · konakereba'],
        ['Tính từ い', 'bỏ **い** + **ければ**', '{安|やす}い → {安|やす}**ければ** · {近|ちか}い → {近|ちか}**ければ** · **いい → よければ**', '{安|やす}くない → {安|やす}く**なければ**', 'yasukereba · chikakereba · yokereba · yasuku nakereba'],
        ['Tính từ な', '**＋ なら(ば)**', '{静|しず}か → {静|しず}か**なら** · {暇|ひま} → {暇|ひま}**なら**', '{静|しず}かじゃ**なければ**', 'shizuka nara · hima nara · shizuka ja nakereba'],
        ['Danh từ', '**＋ なら(ば)**', '{雨|あめ} → {雨|あめ}**なら** · {学生|がくせい} → {学生|がくせい}**なら**', '{学生|がくせい}じゃ**なければ**', 'ame nara · gakusei nara · gakusei ja nakereba'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo chia nhanh từ thể ます (cách cô hay dạy)',
      items: [
        '**Nhóm 1**: âm trước ます **い → え**, rồi thay ます bằng **ば**: い**き**ます → い**け**ば, はな**し**ます → はな**せ**ば, の**り**ます → の**れ**ば, か**い**ます → か**え**ば. Giống hệt bước đầu của thể khả năng (Bài 16) — chỉ khác đuôi: {行|い}け**ます** (khả năng) ↔ {行|い}け**ば** (điều kiện).',
        '**Nhóm 2**: bỏ ます thêm **れば**: たべ**ます** → たべ**れば**, み**ます** → み**れば**.',
        '**Nhóm 3**: します → **すれば**, きます → **くれば** (đọc **く**, không phải ~~きれば~~).',
        '**Phủ định**: mọi loại đều đi qua thể ない rồi đổi **ない → なければ**: {行|い}かない → {行|い}かなければ, {安|やす}くない → {安|やす}くなければ. Bạn đã gặp đuôi này ở **～なければなりません** (ポイント 115) — chính là thể ば phủ định + なりません.',
        '**Tính từ な / danh từ**: dùng **なら** (なら**ば** là dạng đầy đủ, văn viết). Văn viết trang trọng còn có ～であれば ({学生|がくせい}であれば) — gặp ở N3.',
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'A ‑ば、B — ĐIỀU KIỆN CẦN: "(chỉ cần / nếu) A thì B"',
          vi: 'A là điều kiện, B là kết quả sẽ xảy ra khi A đúng. Rất tự nhiên khi B là **trạng thái, khả năng, nhận định** (rẻ, được, kịp, không sao…). Câu ば thường mang ý "có A thì được B — không có A thì không".',
          examples: [
            E('{早|はや}く{予約|よやく}すれば、{安|やす}くなります。', 'Hayaku yoyaku sureba, yasuku narimasu.', 'Đặt sớm thì sẽ rẻ hơn.'),
            E('{特急|とっきゅう}に{乗|の}れば、{1時間|いちじかん}で{着|つ}きます。', 'Tokkyuu ni noreba, ichijikan de tsukimasu.', 'Đi tàu tốc hành thì 1 tiếng là tới.'),
            E('この{地図|ちず}を{見|み}れば、すぐわかりますよ。', 'Kono chizu o mireba, sugu wakarimasu yo.', 'Xem bản đồ này là hiểu ngay.'),
            E('{天気|てんき}がよければ、{富士山|ふじさん}が{見|み}えます。', 'Tenki ga yokereba, Fujisan ga miemasu.', 'Nếu trời đẹp thì nhìn thấy núi Phú Sĩ.'),
            E('{時間|じかん}があれば、{奈良|なら}にも{行|い}きたいです。', 'Jikan ga areba, Nara ni mo ikitai desu.', 'Nếu có thời gian, tôi cũng muốn đi Nara.'),
            E('{急|いそ}がなければ、{電車|でんしゃ}に{間|ま}に{合|あ}いませんよ。', 'Isoganakereba, densha ni maniaimasen yo.', 'Không nhanh lên thì không kịp tàu đâu.'),
            E('{値段|ねだん}が{安|やす}ければ、{旅館|りょかん}に{泊|と}まりたいです。', 'Nedan ga yasukereba, ryokan ni tomaritai desu.', 'Nếu giá rẻ thì tôi muốn ở nhà trọ kiểu Nhật.'),
          ],
        },
        {
          formula: 'Vば いいですか／Vば いいです — "phải V thế nào? / cứ V là được"',
          vi: 'Câu **hỏi xin chỉ dẫn** dùng nhiều nhất khi đi du lịch, ở ga, ở quầy: **どうすればいいですか** (phải làm thế nào?), **{何番線|なんばんせん}に{行|い}けばいいですか** (phải ra sân ga số mấy?). Câu trả lời / lời khuyên: **Vばいいです** = "cứ V là được". Dạng thân mật: ～ばいい？／～ばいいよ.',
          examples: [
            E('{切符|きっぷ}はどこで{買|か}えばいいですか。——あの{機械|きかい}で{買|か}えばいいですよ。', 'Kippu wa doko de kaeba ii desu ka. — Ano kikai de kaeba ii desu yo.', 'Vé thì mua ở đâu ạ? — Mua ở cái máy kia là được.'),
            E('{空港|くうこう}まで{何|なに}で{行|い}けばいいですか。', 'Kuukou made nani de ikeba ii desu ka.', 'Đến sân bay thì nên đi bằng gì ạ?'),
            E('{何時|なんじ}に{出発|しゅっぱつ}すればいいですか。', 'Nanji ni shuppatsu sureba ii desu ka.', 'Phải xuất phát lúc mấy giờ ạ?'),
            E('{道|みち}がわからなければ、{駅員|えきいん}さんに{聞|き}けばいいですよ。', 'Michi ga wakaranakereba, ekiin-san ni kikeba ii desu yo.', 'Nếu không biết đường thì cứ hỏi nhân viên nhà ga là được.'),
            E('{両替|りょうがえ}したいんですが、どうすればいいですか。', 'Ryougae shitai n desu ga, dou sureba ii desu ka.', 'Tôi muốn đổi tiền, phải làm thế nào ạ?'),
            E('{予約|よやく}は{要|い}りません。{直接|ちょくせつ}{来|く}ればいいです。', 'Yoyaku wa irimasen. Chokusetsu kureba ii desu.', 'Không cần đặt trước. Cứ đến thẳng là được.'),
          ],
        },
        {
          formula: 'Vなければ、～ — "nếu không V thì …" (cảnh báo)',
          vi: 'Thể ば phủ định nói điều sẽ xảy ra **nếu không làm**: thường là kết quả xấu (không kịp, không vào được, hết chỗ). Đây là "nửa đầu" của ～なければなりません (ポイント 115).',
          examples: [
            E('{今|いま}{予約|よやく}しなければ、{部屋|へや}がなくなりますよ。', 'Ima yoyaku shinakereba, heya ga naku narimasu yo.', 'Không đặt ngay bây giờ thì sẽ hết phòng đấy.'),
            E('パスポートがなければ、{飛行機|ひこうき}に{乗|の}れません。', 'Pasupooto ga nakereba, hikouki ni noremasen.', 'Không có hộ chiếu thì không lên máy bay được.'),
            E('{7時|しちじ}に{起|お}きなければ、バスに{間|ま}に{合|あ}いません。', 'Shichiji ni okinakereba, basu ni maniaimasen.', 'Không dậy lúc 7 giờ thì không kịp xe buýt.'),
            E('{雨|あめ}じゃなければ、{自転車|じてんしゃ}で{回|まわ}りましょう。', 'Ame ja nakereba, jitensha de mawarimashou.', 'Nếu trời không mưa thì mình đạp xe đi một vòng nhé.'),
            E('{高|たか}くなければ、{買|か}いたいです。', 'Takaku nakereba, kaitai desu.', 'Nếu không đắt thì tôi muốn mua.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: '⚠ Giới hạn của ～ば — vế sau là Ý MUỐN / NHỜ / RỦ / MỆNH LỆNH thì sao?',
      head: ['Vế ば là…', 'Vế sau là ý muốn, nhờ, rủ', 'Ví dụ', 'Romaji', 'Được?'],
      rows: [
        ['TRẠNG THÁI (ある, いる, できる, tính từ, ～ない)', 'được', '{時間|じかん}が**あれば**、{手伝|てつだ}ってください。', 'Jikan ga areba, tetsudatte kudasai.', '✓'],
        ['TRẠNG THÁI', 'được', '{安|やす}**ければ**、{買|か}いましょう。', 'Yasukereba, kaimashou.', '✓'],
        ['TRẠNG THÁI (phủ định)', 'được', 'わから**なければ**、{聞|き}いてください。', 'Wakaranakereba, kiite kudasai.', '✓'],
        ['HÀNH ĐỘNG (着く, 行く, 終わる…)', 'KHÔNG tự nhiên', '~~{駅|えき}に{着|つ}けば、{電話|でんわ}してください。~~', '—', '✗'],
        ['HÀNH ĐỘNG → đổi sang ～たら', 'được', '{駅|えき}に{着|つ}**いたら**、{電話|でんわ}してください。', 'Eki ni tsuitara, denwa shite kudasai.', '✓'],
        ['HÀNH ĐỘNG → đổi sang ～たら', 'được', '{京都|きょうと}へ{行|い}**ったら**、{八|や}つ{橋|はし}を{買|か}ってきてね。', 'Kyouto e ittara, yatsuhashi o katte kite ne.', '✓'],
      ],
    },
    {
      t: 'note',
      title: 'Nhớ một luật cho an toàn khi thi',
      items: [
        'Vế sau là **～てください／～ましょう／～たいです／～つもりです／～ませんか** và vế trước là **hành động** ⇒ dùng **～たら**, không dùng ～ば. Vế trước là **trạng thái** (ある, いる, できる, ～ない, tính từ) ⇒ ～ば vẫn được.',
        'Vế sau là **nhận định, khả năng, kết quả tự nhiên** (～ます thường, ～できます, tính từ, ～なります) ⇒ ～ば luôn được: {急|いそ}げば、{間|ま}に{合|あ}います.',
        '**Không dùng ～ば cho một việc đã xảy ra một lần trong quá khứ**: ~~{駅|えき}に{着|つ}けば、{雨|あめ}が{降|ふ}っていました~~ → {駅|えき}に{着|つ}いたら、{雨|あめ}が{降|ふ}っていました (ポイント 120: たら + phát hiện).',
        'Không chắc thì **～たら** gần như luôn đúng — đó là lý do sách dạy ～たら trước. Riêng câu xin chỉ dẫn, **どうすればいいですか** và どうしたらいいですか đều đúng, đều rất hay dùng; đề N4 hay cho chọn **～ばいい**.',
      ],
    },
    DL('Hỏi – đáp với ～ば (ở ga, ở quầy, giữa bạn bè)', [
      ['メアリー', 'a', 'すみません、{清水寺|きよみずでら}へ{行|い}きたいんですが、{何番|なんばん}のバスに{乗|の}ればいいですか。', 'Sumimasen, Kiyomizudera e ikitai n desu ga, nanban no basu ni noreba ii desu ka.', 'Xin lỗi, tôi muốn đến chùa Kiyomizu, phải đi xe buýt số mấy ạ?'],
      ['{駅員|えきいん}', 'b', '{206番|にひゃくろくばん}に{乗|の}ればいいですよ。「{五条坂|ごじょうざか}」で{降|お}りてください。', 'Nihyaku roku-ban ni noreba ii desu yo. "Gojouzaka" de orite kudasai.', 'Cứ đi xe số 206 là được. Xuống ở trạm "Gojozaka" nhé.'],
      ['メアリー', 'a', '{歩|ある}けば、どのぐらいかかりますか。', 'Arukeba, dono gurai kakarimasu ka.', 'Nếu đi bộ thì mất khoảng bao lâu ạ?'],
      ['{駅員|えきいん}', 'b', '{30分|さんじゅっぷん}ぐらいです。でも、{坂|さか}が{多|おお}いですから、バスで{行|い}けば{楽|らく}ですよ。', 'Sanjuppun gurai desu. Demo, saka ga ooi desu kara, basu de ikeba raku desu yo.', 'Khoảng 30 phút. Nhưng nhiều dốc lắm nên đi xe buýt thì đỡ mệt.'],
      ['カルロス', 'b', 'リンさん、{明日|あした}の{山登|やまのぼ}り、{行|い}ける？', 'Rin-san, ashita no yamanobori, ikeru?', 'Lin ơi, chuyến leo núi ngày mai cậu đi được không?'],
      ['リン', 'c', '{雨|あめ}が{降|ふ}らなければ、{行|い}くよ。', 'Ame ga furanakereba, iku yo.', 'Nếu trời không mưa thì mình đi.'],
      ['カルロス', 'b', '{何|なに}を{持|も}っていけばいい？', 'Nani o motte ikeba ii?', 'Mang theo gì thì được?'],
      ['リン', 'c', '{水|みず}とお{弁当|べんとう}があれば{大丈夫|だいじょうぶ}。{寒|さむ}ければ、{上着|うわぎ}もね。', 'Mizu to obentou ga areba daijoubu. Samukereba, uwagi mo ne.', 'Có nước với cơm hộp là ổn. Nếu lạnh thì mang thêm áo khoác nhé.'],
    ]),
    {
      t: 'table',
      caption: 'Bảng thay thế — tự nói câu mới: 「＿＿ば、＿＿」',
      head: ['Điều kiện (gốc)', 'Thể ば', 'Câu hoàn chỉnh', 'Romaji'],
      rows: [
        ['{急|いそ}ぐ', '{急|いそ}げば', '{急|いそ}げば、{終電|しゅうでん}に{間|ま}に{合|あ}います。', 'Isogeba, shuuden ni maniaimasu.'],
        ['{予約|よやく}する', '{予約|よやく}すれば', 'ネットで{予約|よやく}すれば、{1割|いちわり}{安|やす}くなります。', 'Netto de yoyaku sureba, ichiwari yasuku narimasu.'],
        ['{乗|の}り{換|か}える', '{乗|の}り{換|か}えれば', '{大阪|おおさか}で{乗|の}り{換|か}えれば、{奈良|なら}まですぐです。', 'Oosaka de norikaereba, Nara made sugu desu.'],
        ['{来|く}る', '{来|く}れば', '{朝|あさ}{早|はや}く{来|く}れば、{混|こ}んでいませんよ。', 'Asa hayaku kureba, konde imasen yo.'],
        ['いい（{天気|てんき}）', 'よければ', '{天気|てんき}がよければ、{島|しま}が{見|み}えます。', 'Tenki ga yokereba, shima ga miemasu.'],
        ['{近|ちか}い', '{近|ちか}ければ', '{駅|えき}から{近|ちか}ければ、{歩|ある}いて{行|い}けます。', 'Eki kara chikakereba, aruite ikemasu.'],
        ['{暇|ひま}（な）', '{暇|ひま}なら', '{暇|ひま}なら、{一緒|いっしょ}に{見物|けんぶつ}しませんか。', 'Hima nara, issho ni kenbutsu shimasen ka.'],
        ['ある → ない', 'なければ', '{現金|げんきん}がなければ、カードでも{払|はら}えます。', 'Genkin ga nakereba, kaado de mo haraemasu.'],
      ],
    },
    { t: 'rule', formula: 'V(え段)ば ／ イA‑ければ ／ ナA・N なら ／ ～なければ', vi: 'Nêu điều kiện cần cho một kết quả; hỏi chỉ dẫn bằng ～ばいいですか. Vế trước là hành động thì vế sau không là ý muốn / nhờ / rủ (khi đó dùng ～たら).' },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～ば',
      items: [
        '~~{来|き}れば~~ → **{来|く}れば** (kureba). ~~しれば~~ → **すれば**. ~~いければ~~ (cho いい) → **よければ**.',
        '~~{安|やす}いば~~ / ~~{安|やす}いなら~~ (khi muốn nói thể ば) → **{安|やす}ければ**. Tính từ い đổi **い → ければ**, không giữ い.',
        '~~{静|しず}かければ~~ → **{静|しず}かなら**. Tính từ な và danh từ dùng **なら**, không có ければ.',
        '**{乗|の}れば** (の・れ・ば — điều kiện của 乗る) ≠ **{乗|の}れます** (thể khả năng). Nhìn đuôi: ば = điều kiện; ます = khả năng. Đề N4 hay đặt hai dạng cạnh nhau.',
        'Phủ định: ~~{行|い}かないば~~ → **{行|い}かなければ** (ない → なければ). ~~{行|い}かなかったら~~ cũng đúng nghĩa nhưng là mẫu ～たら, không phải mẫu đề yêu cầu.',
      ],
    },
    {
      t: 'note',
      title: 'Biết trước (gặp ở N3) — ～ば～ほど và ～ばよかった',
      items: [
        '**Aば Aほど** = "càng A càng…": {練習|れんしゅう}すれば**する**ほど、{上手|じょうず}になります (càng luyện càng giỏi) · {安|やす}ければ{安|やす}いほどいいです (càng rẻ càng tốt). Lặp cùng một từ: thể ば + thể từ điển + ほど.',
        '**Vばよかった** = "giá mà đã V" (tiếc nuối): もっと{早|はや}く{予約|よやく}すればよかった (giá mà đặt sớm hơn). Hay gặp trong hội thoại kể chuyện du lịch.',
      ],
    },

    /* ══════ ② ～なら ══════ */
    { t: 'h', text: '② N／普通形 ＋ なら — "nếu là … thì …" (nhận lời người kia rồi khuyên)' },
    {
      t: 'p',
      text: '**なら** khác ～ば, ～たら ở chỗ: nó **lấy lại điều người kia vừa nói** (hoặc tình huống vừa biết) làm chủ đề, rồi nói **lời khuyên, ý kiến, thông tin** về đúng chủ đề đó. A: 「{京都|きょうと}へ{行|い}きたいです」 → B: 「**{京都|きょうと}なら**、{秋|あき}がいいですよ」. Người Việt dịch: "Nếu là / nói đến … thì …", "Nếu (bạn) định … thì …". Câu nhân viên tư vấn, bạn bè cho lời khuyên gần như luôn có なら.',
    },
    {
      t: 'table',
      caption: 'Cách nối ～なら — đặt sau danh từ hoặc thể thường (KHÔNG có だ trước なら)',
      head: ['Loại', 'Cách nối', 'Ví dụ', 'Romaji'],
      rows: [
        ['Danh từ', 'N ＋ なら', '{温泉|おんせん}なら · {京都|きょうと}なら · {一人|ひとり}{3万円|さんまんえん}なら', 'onsen nara · Kyouto nara · hitori sanman en nara'],
        ['Động từ', 'V{辞書形|じしょけい}／Vない／Vた ＋ なら', '{行|い}くなら · {行|い}かないなら · {予約|よやく}するなら', 'iku nara · ikanai nara · yoyaku suru nara'],
        ['Tính từ い', 'イA ＋ なら', '{高|たか}いなら · {寒|さむ}いなら', 'takai nara · samui nara'],
        ['Tính từ な', 'ナA (bỏ だ) ＋ なら', '{暇|ひま}なら · {不安|ふあん}なら', 'hima nara · fuan nara'],
        ['Cả câu (nối với ý vừa nghe)', 'それなら／じゃ', 'それなら、この{旅館|りょかん}がおすすめです。', 'Sore nara, kono ryokan ga osusume desu.'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N なら、～ — "nếu là / nói về N thì …" (giới thiệu, khuyên)',
          vi: 'Người kia nhắc tới N (hoặc hỏi về N) → mình đáp lại bằng **N なら** + thông tin/lời khuyên. Vế sau hay là: ～がいいですよ, ～がおすすめです, ～が{有名|ゆうめい}です, ～に{聞|き}いてください.',
          examples: [
            E('{温泉|おんせん}なら、{箱根|はこね}がいいですよ。', 'Onsen nara, Hakone ga ii desu yo.', 'Nếu là suối nước nóng thì Hakone hay đấy.'),
            E('お{土産|みやげ}なら、{駅|えき}の{中|なか}の{店|みせ}が{便利|べんり}です。', 'Omiyage nara, eki no naka no mise ga benri desu.', 'Nếu là quà lưu niệm thì cửa hàng trong ga tiện lắm.'),
            E('{紅葉|こうよう}なら、{11月|じゅういちがつ}の{終|お}わりがいちばんきれいです。', 'Kouyou nara, juuichigatsu no owari ga ichiban kirei desu.', 'Lá đỏ thì cuối tháng 11 là đẹp nhất.'),
            E('パクさん？ パクさんなら、さっき{図書館|としょかん}にいましたよ。', 'Paku-san? Paku-san nara, sakki toshokan ni imashita yo.', 'Park à? Park thì lúc nãy ở thư viện đấy.'),
            E('{日本|にほん}の{自然|しぜん}なら、{北海道|ほっかいどう}がいちばんだと{思|おも}います。', 'Nihon no shizen nara, Hokkaidou ga ichiban da to omoimasu.', 'Nói về thiên nhiên Nhật Bản thì tôi nghĩ Hokkaido là nhất.'),
            E('{一人|ひとり}{2万円|にまんえん}なら、{大丈夫|だいじょうぶ}です。', 'Hitori niman en nara, daijoubu desu.', 'Nếu là 2 vạn yên một người thì được.'),
          ],
        },
        {
          formula: 'V{辞書形|じしょけい} なら、～ — "nếu (định) V thì (trước đó) nên …"',
          vi: 'Người kia **định làm** V (chưa làm) → mình khuyên điều nên làm **trước khi** làm V, hoặc nói thông tin để làm V. Thứ tự thời gian: vế sau có thể xảy ra **trước** vế なら — đây là điểm ～たら không làm được.',
          examples: [
            E('{京都|きょうと}へ{行|い}くなら、{新幹線|しんかんせん}が{便利|べんり}ですよ。', 'Kyouto e iku nara, shinkansen ga benri desu yo.', 'Nếu định đi Kyoto thì đi Shinkansen tiện đấy.'),
            E('{旅館|りょかん}に{泊|と}まるなら、{早|はや}く{予約|よやく}したほうがいいです。', 'Ryokan ni tomaru nara, hayaku yoyaku shita hou ga ii desu.', 'Nếu định ở nhà trọ kiểu Nhật thì nên đặt sớm.'),
            E('{両替|りょうがえ}するなら、{空港|くうこう}より{町|まち}の{銀行|ぎんこう}のほうが{得|とく}です。', 'Ryougae suru nara, kuukou yori machi no ginkou no hou ga toku desu.', 'Nếu định đổi tiền thì ngân hàng trong phố lợi hơn sân bay.'),
            E('{富士山|ふじさん}に{登|のぼ}るなら、{7月|しちがつ}か{8月|はちがつ}がいいです。', 'Fujisan ni noboru nara, shichigatsu ka hachigatsu ga ii desu.', 'Nếu định leo núi Phú Sĩ thì tháng 7 hoặc tháng 8 là tốt.'),
            E('{行|い}かないなら、{早|はや}くキャンセルしてください。', 'Ikanai nara, hayaku kyanseru shite kudasai.', 'Nếu không đi thì hãy huỷ sớm.'),
          ],
        },
        {
          formula: 'イA／ナA ＋ なら、～ ・ それなら、～ — "nếu (đúng là) vậy thì …"',
          vi: 'Nhận một **nhận xét / hoàn cảnh** người kia vừa nói ({高|たか}い, {暇|ひま}, {不安|ふあん}…) rồi đưa giải pháp. Nhận cả câu thì dùng **それなら** (= じゃ, nhưng lịch sự, mạch lạc hơn).',
          examples: [
            E('{新幹線|しんかんせん}が{高|たか}いなら、{夜行|やこう}バスはどうですか。', 'Shinkansen ga takai nara, yakou basu wa dou desu ka.', 'Nếu Shinkansen đắt thì xe buýt đêm thế nào?'),
            E('{一人|ひとり}で{行|い}くのが{不安|ふあん}なら、ツアーに{参加|さんか}すればいいですよ。', 'Hitori de iku no ga fuan nara, tsuaa ni sanka sureba ii desu yo.', 'Nếu lo khi đi một mình thì cứ tham gia tour là được.'),
            E('{暇|ひま}なら、{手伝|てつだ}ってくれませんか。', 'Hima nara, tetsudatte kuremasen ka.', 'Nếu rảnh thì giúp tôi một tay được không?'),
            E('{足|あし}が{痛|いた}いんです。——それなら、タクシーで{行|い}きましょう。', 'Ashi ga itai n desu. — Sore nara, takushii de ikimashou.', 'Tôi đau chân. — Vậy thì mình đi taxi đi.'),
            E('{寒|さむ}いなら、{窓|まど}を{閉|し}めましょうか。', 'Samui nara, mado o shimemashou ka.', 'Nếu lạnh thì tôi đóng cửa sổ nhé?'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'V{辞書形|じしょけい}なら ↔ Vたら — khuyên TRƯỚC khi đi hay nhờ SAU khi đến?',
      head: ['Câu', 'Romaji', 'Việc ở vế sau xảy ra lúc nào', 'Nghĩa'],
      rows: [
        ['{京都|きょうと}へ{行|い}く**なら**、ガイドブックを{買|か}ったほうがいいです。', 'Kyouto e iku nara, gaidobukku o katta hou ga ii desu.', '**TRƯỚC** khi đi (mua sách ở nhà)', 'Nếu định đi Kyoto thì nên mua sách hướng dẫn.'],
        ['{京都|きょうと}へ{行|い}っ**たら**、{八|や}つ{橋|はし}を{買|か}ってきてください。', 'Kyouto e ittara, yatsuhashi o katte kite kudasai.', '**SAU** khi đến Kyoto', 'Đến Kyoto rồi thì mua bánh yatsuhashi về giúp tôi.'],
        ['{飛行機|ひこうき}に{乗|の}る**なら**、{2時間前|にじかんまえ}に{空港|くうこう}へ{行|い}ってください。', 'Hikouki ni noru nara, nijikan mae ni kuukou e itte kudasai.', '**TRƯỚC** khi lên máy bay', 'Nếu đi máy bay thì hãy đến sân bay trước 2 tiếng.'],
        ['{空港|くうこう}に{着|つ}い**たら**、{電話|でんわ}してください。', 'Kuukou ni tsuitara, denwa shite kudasai.', '**SAU** khi tới sân bay', 'Tới sân bay rồi thì gọi điện cho tôi.'],
      ],
    },
    DL('Hỏi – đáp với ～なら (bạn bè cho lời khuyên)', [
      ['ダニエル', 'b', '{来週|らいしゅう}、{初|はじ}めて{北海道|ほっかいどう}へ{行|い}くんです。', 'Raishuu, hajimete Hokkaidou e iku n desu.', 'Tuần sau lần đầu tiên tôi đi Hokkaido.'],
      ['{鈴木|すずき}', 'c', '{北海道|ほっかいどう}なら、{函館|はこだて}の{夜景|やけい}をぜひ{見|み}てください。', 'Hokkaidou nara, Hakodate no yakei o zehi mite kudasai.', 'Hokkaido thì nhất định phải ngắm cảnh đêm Hakodate nhé.'],
      ['ダニエル', 'b', '{函館|はこだて}まで{何|なに}で{行|い}けばいいですか。', 'Hakodate made nani de ikeba ii desu ka.', 'Đến Hakodate thì nên đi bằng gì ạ?'],
      ['{鈴木|すずき}', 'c', '{東京|とうきょう}から{行|い}くなら、{新幹線|しんかんせん}も{飛行機|ひこうき}もあります。{安|やす}いのがよければ、{飛行機|ひこうき}ですね。', 'Toukyou kara iku nara, shinkansen mo hikouki mo arimasu. Yasui no ga yokereba, hikouki desu ne.', 'Nếu đi từ Tokyo thì có cả Shinkansen lẫn máy bay. Nếu muốn rẻ thì máy bay.'],
      ['ダニエル', 'b', '{寒|さむ}いですか。', 'Samui desu ka.', 'Có lạnh không chị?'],
      ['{鈴木|すずき}', 'c', '{今|いま}の{季節|きせつ}なら、{東京|とうきょう}より{10度|じゅうど}ぐらい{低|ひく}いですよ。{厚|あつ}いコートを{持|も}っていったほうがいいです。', 'Ima no kisetsu nara, Toukyou yori juudo gurai hikui desu yo. Atsui kooto o motte itta hou ga ii desu.', 'Mùa này thì thấp hơn Tokyo khoảng 10 độ đấy. Nên mang áo khoác dày.'],
      ['ダニエル', 'b', 'コート、{持|も}っていないんです。', 'Kooto, motte inai n desu.', 'Tôi không có áo khoác.'],
      ['{鈴木|すずき}', 'c', 'それなら、{私|わたし}のを{貸|か}しますよ。', 'Sore nara, watashi no o kashimasu yo.', 'Vậy thì tôi cho mượn cái của tôi.'],
    ]),
    {
      t: 'table',
      caption: 'Bảng thay thế — 「A：＿＿たいんです。 B：＿＿なら、＿＿がいいですよ。」',
      head: ['A muốn…', 'B nhận bằng なら', 'B khuyên', 'Romaji (lời B)'],
      rows: [
        ['{温泉|おんせん}に{行|い}きたい', '{温泉|おんせん}なら', '{箱根|はこね}がいいですよ。', 'Onsen nara, Hakone ga ii desu yo.'],
        ['{海|うみ}で{泳|およ}ぎたい', '{海|うみ}なら', '{沖縄|おきなわ}の{島|しま}がいいですよ。', 'Umi nara, Okinawa no shima ga ii desu yo.'],
        ['お{土産|みやげ}を{買|か}いたい', 'お{土産|みやげ}を{買|か}うなら', '{駅|えき}の{中|なか}の{店|みせ}がいいですよ。', 'Omiyage o kau nara, eki no naka no mise ga ii desu yo.'],
        ['{夜景|やけい}が{見|み}たい', '{夜景|やけい}なら', '{函館|はこだて}がいいですよ。', 'Yakei nara, Hakodate ga ii desu yo.'],
        ['{着物|きもの}を{着|き}たい', '{着物|きもの}の{体験|たいけん}なら', '{京都|きょうと}がいいですよ。', 'Kimono no taiken nara, Kyouto ga ii desu yo.'],
        ['{安|やす}く{泊|と}まりたい', '{安|やす}く{泊|と}まるなら', 'ゲストハウスがいいですよ。', 'Yasuku tomaru nara, gesutohausu ga ii desu yo.'],
      ],
    },
    { t: 'rule', formula: 'N／V普通形／イA／ナA（だ bỏ）＋ なら、～（lời khuyên・ý kiến）', vi: 'Lấy điều người kia vừa nói làm chủ đề rồi khuyên / nêu thông tin; V辞書形なら: việc ở vế sau có thể làm TRƯỚC vế なら.' },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～なら',
      items: [
        '~~{暇|ひま}だなら~~ / ~~{学生|がくせい}だなら~~ → **{暇|ひま}なら**, **{学生|がくせい}なら** — không có だ trước なら.',
        '**Không dùng なら cho quy luật tự nhiên / máy móc**: ~~{春|はる}なら、{桜|さくら}が{咲|さ}きます~~ → {春|はる}になると／なれば、{桜|さくら}が{咲|さ}きます. ~~このボタンを{押|お}すなら、{水|みず}が{出|で}ます~~ → {押|お}すと.',
        '**Không dùng なら khi vế sau xảy ra SAU vế なら và mình muốn nhờ việc ở nơi đến**: ~~{京都|きょうと}へ{行|い}くなら、{写真|しゃしん}を{送|おく}ってください~~ (gửi ảnh là việc làm ở/ sau khi tới) → {京都|きょうと}へ{行|い}ったら、{写真|しゃしん}を{送|おく}ってください.',
        'なら đứng đầu lời đáp, **nhắc lại đúng từ người kia nói**. Đề nghe 即時応答 hay cho câu "～に{行|い}きたいんですが" — đáp án đúng thường bắt đầu bằng "～なら、…".',
      ],
    },

    /* ══════ ③ ～し、～し ══════ */
    { t: 'h', text: '③ 普通形 ＋ し、～し — "vừa … lại …" (nêu nhiều lý do, ưu điểm)' },
    {
      t: 'p',
      text: 'Khi giải thích **vì sao** chọn / không chọn một thứ, người Nhật hay nêu **2–3 lý do nối bằng し**: {近|ちか}いし、{安|やす}いし、{温泉|おんせん}もあるし… ("vừa gần, vừa rẻ, lại có onsen"). ～し ngụ ý **"còn nhiều lý do khác nữa"** — khác ～から (một lý do, chặt chẽ). Câu し rất hợp phần thi nói: nêu ý kiến + 2 lý do.',
    },
    {
      t: 'table',
      caption: 'Cách nối ～し — gắn sau thể thường (普通形) của mọi loại từ',
      head: ['Loại', 'Hiện tại', 'Phủ định', 'Quá khứ', 'Romaji'],
      rows: [
        ['Động từ', '{温泉|おんせん}もある**し**', '{乗|の}り{換|か}えもない**し**', 'よく{歩|ある}いた**し**', 'onsen mo aru shi · norikae mo nai shi · yoku aruita shi'],
        ['Tính từ い', '{安|やす}い**し**', '{遠|とお}くない**し**', '{楽|たの}しかった**し**', 'yasui shi · tooku nai shi · tanoshikatta shi'],
        ['Tính từ な', '{便利|べんり}**だ**し', '{有名|ゆうめい}じゃない**し**', '{静|しず}かだった**し**', 'benri da shi · yuumei ja nai shi · shizuka datta shi'],
        ['Danh từ', '{雨|あめ}**だ**し', '{休|やす}みじゃない**し**', '{連休|れんきゅう}だった**し**', 'ame da shi · yasumi ja nai shi · renkyuu datta shi'],
        ['Lịch sự (nói với người trên)', '{近|ちか}いです**し**', 'ありません**し**', '{行|い}きました**し**', 'chikai desu shi · arimasen shi · ikimashita shi'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'A し、B し、（だから）C — nêu nhiều lý do cho kết luận C',
          vi: 'A, B là lý do / ưu điểm / nhược điểm; C là kết luận (thích, chọn, không đi…). Kết luận có thể bỏ lửng nếu người nghe tự hiểu. Lý do cùng chiều với nhau (cùng tốt hoặc cùng xấu). Hay đi với **も**: {景色|けしき}**も**きれいだし、{料理|りょうり}**も**おいしいし.',
          examples: [
            E('この{旅館|りょかん}は{駅|えき}から{近|ちか}いし、{安|やす}いし、とてもいいです。', 'Kono ryokan wa eki kara chikai shi, yasui shi, totemo ii desu.', 'Nhà trọ này vừa gần ga vừa rẻ, rất tốt.'),
            E('{京都|きょうと}は{お寺|おてら}も{多|おお}いし、{料理|りょうり}もおいしいし、また{行|い}きたいです。', 'Kyouto wa otera mo ooi shi, ryouri mo oishii shi, mata ikitai desu.', 'Kyoto vừa nhiều chùa, đồ ăn lại ngon, tôi muốn đi nữa.'),
            E('{今日|きょう}は{雨|あめ}だし、{寒|さむ}いし、ホテルでゆっくりしましょう。', 'Kyou wa ame da shi, samui shi, hoteru de yukkuri shimashou.', 'Hôm nay vừa mưa vừa lạnh, ở khách sạn nghỉ ngơi thôi.'),
            E('{夜行|やこう}バスは{安|やす}いし、{寝|ね}ている{間|あいだ}に{着|つ}くし、{便利|べんり}ですよ。', 'Yakou basu wa yasui shi, nete iru aida ni tsuku shi, benri desu yo.', 'Xe buýt đêm vừa rẻ, lại tới nơi trong lúc mình ngủ, tiện lắm.'),
            E('{沖縄|おきなわ}は{海|うみ}もきれいだったし、{人|ひと}も{親切|しんせつ}だったし、{最高|さいこう}でした。', 'Okinawa wa umi mo kirei datta shi, hito mo shinsetsu datta shi, saikou deshita.', 'Okinawa biển đẹp, người lại tử tế, tuyệt nhất luôn.'),
            E('{日本語|にほんご}もまだ{上手|じょうず}じゃないし、{一人|ひとり}で{行|い}くのは{不安|ふあん}です。', 'Nihongo mo mada jouzu ja nai shi, hitori de iku no wa fuan desu.', 'Tiếng Nhật cũng chưa giỏi, đi một mình tôi thấy lo.'),
          ],
        },
        {
          formula: 'A し、それに B — "A, hơn nữa B"',
          vi: '**それに** (hơn nữa, thêm vào đó) nối lý do cuối, làm câu mạnh hơn. Kiểu nói rất hay dùng trong thi nói khi nêu ý kiến.',
          examples: [
            E('{箱根|はこね}は{東京|とうきょう}から{近|ちか}いし、それに{温泉|おんせん}もあります。', 'Hakone wa Toukyou kara chikai shi, sore ni onsen mo arimasu.', 'Hakone gần Tokyo, hơn nữa còn có suối nước nóng.'),
            E('この{靴|くつ}は{軽|かる}いし、それに{歩|ある}きやすいです。', 'Kono kutsu wa karui shi, sore ni arukiyasui desu.', 'Đôi giày này nhẹ, hơn nữa lại dễ đi.'),
            E('{今日|きょう}は{疲|つか}れたし、それにもう{遅|おそ}いし、{明日|あした}にしよう。', 'Kyou wa tsukareta shi, sore ni mou osoi shi, ashita ni shiyou.', 'Hôm nay mệt rồi, hơn nữa cũng muộn rồi, để mai đi.'),
            E('{新幹線|しんかんせん}は{速|はや}いですし、それに{揺|ゆ}れませんから、{両親|りょうしん}も{楽|らく}です。', 'Shinkansen wa hayai desu shi, sore ni yuremasen kara, ryoushin mo raku desu.', 'Shinkansen nhanh, hơn nữa không rung lắc nên bố mẹ cũng thoải mái.'),
            E('この{町|まち}は{静|しず}かだし、それに{自然|しぜん}も{多|おお}いです。', 'Kono machi wa shizuka da shi, sore ni shizen mo ooi desu.', 'Thị trấn này yên tĩnh, hơn nữa nhiều thiên nhiên.'),
          ],
        },
        {
          formula: 'A し、～ (chỉ một し) — nêu lý do nhẹ nhàng, ngầm "còn lý do khác"',
          vi: 'Chỉ nêu một lý do nhưng dùng し thay vì から → nghe **mềm, không áp đặt**, ngầm ý "cũng vì nhiều thứ". Hay gặp trong lời rủ, lời từ chối thân mật.',
          examples: [
            E('{天気|てんき}もいいし、{散歩|さんぽ}しませんか。', 'Tenki mo ii shi, sanpo shimasen ka.', 'Trời cũng đẹp, mình đi dạo nhé?'),
            E('もう{遅|おそ}いし、そろそろ{帰|かえ}ろう。', 'Mou osoi shi, sorosoro kaerou.', 'Muộn rồi, về thôi.'),
            E('{明日|あした}は{休|やす}みだし、ゆっくり{寝|ね}ます。', 'Ashita wa yasumi da shi, yukkuri nemasu.', 'Mai được nghỉ nên tôi ngủ thoải mái.'),
            E('{近|ちか}いし、{歩|ある}いて{行|い}きましょう。', 'Chikai shi, aruite ikimashou.', 'Gần thôi mà, đi bộ đi.'),
            E('お{金|かね}もないし、{今年|ことし}は{旅行|りょこう}しません。', 'Okane mo nai shi, kotoshi wa ryokou shimasen.', 'Cũng chẳng có tiền nên năm nay tôi không đi du lịch.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: '～から ↔ ～し — một lý do chặt hay nhiều lý do mềm?',
      head: ['', '～から (ôn Bài 5–6)', '～し、～し'],
      rows: [
        ['Số lý do', '1 lý do chính', '2–3 lý do (ngầm còn nữa)'],
        ['Sắc thái', 'rõ ràng, chắc chắn', 'mềm, liệt kê, kể chuyện'],
        ['Ví dụ', '{近|ちか}いから、{歩|ある}いて{行|い}きます。', '{近|ちか}いし、{天気|てんき}もいいし、{歩|ある}いて{行|い}きます。'],
        ['Romaji', 'Chikai kara, aruite ikimasu.', 'Chikai shi, tenki mo ii shi, aruite ikimasu.'],
        ['Đi cùng nhau', '—', '～し、～から: {安|やす}いし、{近|ちか}いから、ここにします。 (lý do cuối dùng から — tự nhiên)'],
      ],
    },
    DL('Hỏi – đáp với ～し (nêu lý do khi được hỏi "Tại sao?")', [
      ['{本田先生|ほんだせんせい}', 'examiner', 'どうして{京都|きょうと}が{好|す}きなんですか。', 'Doushite Kyouto ga suki na n desu ka.', 'Tại sao em thích Kyoto?'],
      ['ナタポン', 'b', '{古|ふる}いお{寺|てら}が{多|おお}いし、{町|まち}もきれいだし、{歩|ある}いて{見物|けんぶつ}するのが{楽|たの}しいんです。', 'Furui otera ga ooi shi, machi mo kirei da shi, aruite kenbutsu suru no ga tanoshii n desu.', 'Vì có nhiều chùa cổ, phố cũng đẹp, đi bộ ngắm cảnh rất vui ạ.'],
      ['{本田先生|ほんだせんせい}', 'examiner', '{夏|なつ}の{京都|きょうと}はどうですか。', 'Natsu no Kyouto wa dou desu ka.', 'Kyoto mùa hè thì sao?'],
      ['ナタポン', 'b', '{夏|なつ}はちょっと……。{暑|あつ}いし、{観光客|かんこうきゃく}も{多|おお}いし。', 'Natsu wa chotto……. Atsui shi, kankoukyaku mo ooi shi.', 'Mùa hè thì hơi… Vừa nóng, khách du lịch lại đông.'],
      ['アンナ', 'a', 'マルコさん、{今日|きょう}は{何|なに}も{買|か}わないんですか。', 'Maruko-san, kyou wa nani mo kawanai n desu ka.', 'Marco, hôm nay cậu không mua gì à?'],
      ['マルコ', 'b', 'うん。お{金|かね}も{足|た}りないし、スーツケースももういっぱいだし……。', 'Un. Okane mo tarinai shi, suutsukeesu mo mou ippai da shi…….', 'Ừ. Tiền cũng không đủ, vali cũng đầy rồi…'],
    ]),
    {
      t: 'table',
      caption: 'Bảng thay thế — 「＿＿は ＿＿し、＿＿し、＿＿。」 (giới thiệu một nơi)',
      head: ['Nơi', 'Lý do 1', 'Lý do 2', 'Kết luận', 'Romaji'],
      rows: [
        ['{箱根|はこね}', '{東京|とうきょう}から{近|ちか}い', '{温泉|おんせん}もある', '{家族|かぞく}{旅行|りょこう}にいいです', 'Hakone wa Toukyou kara chikai shi, onsen mo aru shi, kazoku ryokou ni ii desu.'],
        ['{沖縄|おきなわ}', '{海|うみ}がきれいだ', '{冬|ふゆ}も{暖|あたた}かい', '{一年中|いちねんじゅう}{楽|たの}しめます', 'Okinawa wa umi ga kirei da shi, fuyu mo atatakai shi, ichinenjuu tanoshimemasu.'],
        ['{奈良|なら}', '{鹿|しか}がいる', '{古|ふる}いお{寺|てら}も{多|おお}い', '{子|こ}どもも{喜|よろこ}びます', 'Nara wa shika ga iru shi, furui otera mo ooi shi, kodomo mo yorokobimasu.'],
        ['ダナン', '{物価|ぶっか}が{安|やす}い', '{料理|りょうり}もおいしい', 'ぜひ{行|い}ってください', 'Danan wa bukka ga yasui shi, ryouri mo oishii shi, zehi itte kudasai.'],
        ['{東京|とうきょう}', '{交通|こうつう}が{便利|べんり}だ', '{店|みせ}も{多|おお}い', '{買|か}い{物|もの}が{楽|たの}しいです', 'Toukyou wa koutsuu ga benri da shi, mise mo ooi shi, kaimono ga tanoshii desu.'],
      ],
    },
    { t: 'rule', formula: '普通形（ナA・N だ）＋ し、～ し、（だから）～', vi: 'Nêu 2–3 lý do / ưu điểm cùng chiều (ngầm "còn nữa"); hay đi với も và それに; một し đứng riêng = lý do nhẹ, mềm.' },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～し',
      items: [
        '~~{便利|べんり}し~~ / ~~{雨|あめ}し~~ → **{便利|べんり}だし**, **{雨|あめ}だし** — tính từ な và danh từ phải có **だ** trước し (ngược với なら!).',
        '~~{安|やす}いだし~~ → **{安|やす}いし** — tính từ い KHÔNG thêm だ.',
        '**Lý do ngược chiều không nối bằng し**: ~~{安|やす}いし、まずいし、この{店|みせ}が{好|す}きです~~ (rẻ + dở → thích?). Ngược chiều dùng **が／けど**: {安|やす}いけど、まずいです.',
        'Nói với người trên vẫn được dùng し, nhưng nên dùng dạng lịch sự **～ですし／～ますし**: {近|ちか}いですし、{便利|べんり}ですし….',
      ],
    },

    /* ══════ ④ ～すぎる ══════ */
    { t: 'h', text: '④ Vます／イA／ナA ＋ すぎる — "quá …" (vượt mức)' },
    {
      t: 'p',
      text: '**すぎる** (vượt quá) gắn vào sau động từ hoặc tính từ để nói **vượt mức bình thường / mức mình muốn** — thường là chuyện **không tốt**: {高|たか}すぎる (đắt quá → không mua), {食|た}べすぎる (ăn quá nhiều → đau bụng). Khác **とても** (rất): とても{高|たか}い chỉ là "rất đắt", còn {高|たか}すぎる là "đắt quá, vượt ngưỡng".',
    },
    {
      t: 'table',
      caption: 'Cách nối ～すぎる',
      head: ['Loại', 'Quy tắc', 'Ví dụ', 'Romaji'],
      rows: [
        ['Động từ', 'Vます bỏ ます ＋ すぎる', '{食|た}べ**ます** → {食|た}べ**すぎる** · {飲|の}み**ます** → {飲|の}み**すぎる** · {歩|ある}き**ます** → {歩|ある}き**すぎる** · {持|も}ってき**ます** → {持|も}ってき**すぎる**', 'tabesugiru · nomisugiru · arukisugiru · motte kisugiru'],
        ['Tính từ い', 'bỏ い ＋ すぎる', '{高|たか}い → {高|たか}**すぎる** · {重|おも}い → {重|おも}**すぎる** · {狭|せま}い → {狭|せま}**すぎる**', 'takasugiru · omosugiru · semasugiru'],
        ['いい／ない (ngoại lệ)', 'いい → **よすぎる** · ない → **なさすぎる**', '{天気|てんき}がよすぎる · {時間|じかん}がなさすぎる', 'yosugiru · nasasugiru'],
        ['Tính từ な', 'bỏ な ＋ すぎる', '{静|しず}か → {静|しず}か**すぎる** · {簡単|かんたん} → {簡単|かんたん}**すぎる** · {不便|ふべん} → {不便|ふべん}**すぎる**', 'shizukasugiru · kantansugiru · fubensugiru'],
      ],
    },
    {
      t: 'table',
      caption: '～すぎる chia tiếp như động từ nhóm 2 (ví dụ: 高すぎる)',
      head: ['Thể', 'Lịch sự', 'Thể thường', 'Romaji (thường)'],
      rows: [
        ['Hiện tại', '{高|たか}すぎます', '{高|たか}すぎる', 'takasugiru'],
        ['Phủ định', '{高|たか}すぎません', '{高|たか}すぎない', 'takasuginai'],
        ['Quá khứ', '{高|たか}すぎました', '{高|たか}すぎた', 'takasugita'],
        ['Thể て (lý do)', '—', '{高|たか}すぎて', 'takasugite'],
        ['Phủ định + て', '—', '{高|たか}すぎなくて', 'takasuginakute'],
        ['Danh từ hoá (V)', '—', '{食|た}べすぎ・{飲|の}みすぎ・{働|はたら}きすぎ', 'tabesugi · nomisugi · hatarakisugi'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N は イA／ナA ＋ すぎます — "N … quá"',
          vi: 'Nhận xét một thứ **vượt mức** của mình: đắt quá, nặng quá, chật quá, yên tĩnh quá. Thêm ちょっと／{少|すこ}し để chê nhẹ, lịch sự (rất hay dùng khi từ chối).',
          examples: [
            E('このスーツケースは{重|おも}すぎます。', 'Kono suutsukeesu wa omosugimasu.', 'Cái vali này nặng quá.'),
            E('この{旅館|りょかん}は{私|わたし}にはちょっと{高|たか}すぎます。', 'Kono ryokan wa watashi ni wa chotto takasugimasu.', 'Nhà trọ này đối với tôi hơi đắt quá.'),
            E('ホテルの{部屋|へや}が{狭|せま}すぎました。', 'Hoteru no heya ga semasugimashita.', 'Phòng khách sạn chật quá.'),
            E('この{町|まち}は{夜|よる}{静|しず}かすぎて、{少|すこ}し{怖|こわ}いです。', 'Kono machi wa yoru shizukasugite, sukoshi kowai desu.', 'Thị trấn này ban đêm yên tĩnh quá, hơi sợ.'),
            E('この{問題|もんだい}は{簡単|かんたん}すぎます。', 'Kono mondai wa kantansugimasu.', 'Câu này dễ quá.'),
            E('{今日|きょう}は{天気|てんき}がよすぎて、{暑|あつ}いです。', 'Kyou wa tenki ga yosugite, atsui desu.', 'Hôm nay trời đẹp quá nên nóng.'),
          ],
        },
        {
          formula: 'Vます ＋ すぎました — "đã V quá nhiều / quá mức"',
          vi: 'Kể việc **làm quá tay** (ăn, uống, mua, đi bộ, ngủ…). Thường kèm hậu quả ở câu sau hoặc với ～すぎて.',
          examples: [
            E('{旅行|りょこう}でお{土産|みやげ}を{買|か}いすぎました。', 'Ryokou de omiyage o kaisugimashita.', 'Đi du lịch tôi mua quá nhiều quà.'),
            E('{昨日|きのう}は{歩|ある}きすぎて、{足|あし}が{痛|いた}いです。', 'Kinou wa arukisugite, ashi ga itai desu.', 'Hôm qua đi bộ nhiều quá nên đau chân.'),
            E('{朝|あさ}{寝|ね}すぎて、バスに{乗|の}れませんでした。', 'Asa nesugite, basu ni noremasen deshita.', 'Sáng ngủ quên quá giờ nên không lên kịp xe buýt.'),
            E('お{酒|さけ}を{飲|の}みすぎないでください。', 'Osake o nomisuginaide kudasai.', 'Đừng uống rượu quá nhiều nhé.'),
            E('{写真|しゃしん}を{撮|と}りすぎて、スマホの{電池|でんち}がなくなりました。', 'Shashin o torisugite, sumaho no denchi ga naku narimashita.', 'Chụp ảnh nhiều quá nên điện thoại hết pin.'),
          ],
        },
        {
          formula: '～すぎて、～ ・ ～すぎ（danh từ） — "vì quá … nên …" / "sự quá …"',
          vi: '**～すぎて** nêu lý do (thể て, ôn Bài 15 ～て = vì) — vế sau thường là **không làm được / kết quả xấu**. Động từ + すぎ thành **danh từ**: {食|た}べすぎ, {飲|の}みすぎ — gặp nhiều trên biển nhắc, lời khuyên: {飲|の}みすぎに{注意|ちゅうい}.',
          examples: [
            E('{値段|ねだん}が{高|たか}すぎて、{買|か}えませんでした。', 'Nedan ga takasugite, kaemasen deshita.', 'Giá đắt quá nên tôi không mua được.'),
            E('{荷物|にもつ}が{多|おお}すぎて、{一人|ひとり}で{持|も}てません。', 'Nimotsu ga oosugite, hitori de motemasen.', 'Hành lý nhiều quá, một mình không xách nổi.'),
            E('{人|ひと}が{多|おお}すぎて、{写真|しゃしん}が{撮|と}れませんでした。', 'Hito ga oosugite, shashin ga toremasen deshita.', 'Đông người quá nên không chụp ảnh được.'),
            E('{食|た}べすぎは{体|からだ}によくないですよ。', 'Tabesugi wa karada ni yoku nai desu yo.', 'Ăn quá nhiều không tốt cho cơ thể đâu.'),
            E('{働|はたら}きすぎに{気|き}をつけてください。', 'Hatarakisugi ni ki o tsukete kudasai.', 'Hãy cẩn thận đừng làm việc quá sức.'),
          ],
        },
      ],
    },
    DL('Hỏi – đáp với ～すぎる (chọn chỗ ở, kể chuyện)', [
      ['パク', 'c', 'このホテル、どうですか。{一泊|いっぱく}{8千円|はっせんえん}ですよ。', 'Kono hoteru, dou desu ka. Ippaku hassen en desu yo.', 'Khách sạn này thế nào? Một đêm 8.000 yên đấy.'],
      ['マルコ', 'b', 'でも、{駅|えき}から{遠|とお}すぎませんか。バスで{40分|よんじゅっぷん}ですよ。', 'Demo, eki kara toosugimasen ka. Basu de yonjuppun desu yo.', 'Nhưng chẳng phải xa ga quá sao? Đi xe buýt mất 40 phút đấy.'],
      ['パク', 'c', 'そうですね。じゃ、こっちは？ {駅|えき}の{前|まえ}です。', 'Sou desu ne. Ja, kotchi wa? Eki no mae desu.', 'Cũng phải. Vậy cái này thì sao? Ngay trước ga.'],
      ['マルコ', 'b', '{一泊|いっぱく}{3万円|さんまんえん}！ それは{高|たか}すぎます。', 'Ippaku sanman en! Sore wa takasugimasu.', 'Một đêm 3 vạn yên! Thế thì đắt quá.'],
      ['ワン', 'a', '{旅行|りょこう}、どうでしたか。', 'Ryokou, dou deshita ka.', 'Chuyến đi thế nào?'],
      ['カルロス', 'b', '{楽|たの}しかったです。でも、{毎日|まいにち}{歩|ある}きすぎて、{足|あし}が{痛|いた}くなりました。それに、{名物|めいぶつ}を{食|た}べすぎて、{2キロ|にキロ}{太|ふと}りました。', 'Tanoshikatta desu. Demo, mainichi arukisugite, ashi ga itaku narimashita. Sore ni, meibutsu o tabesugite, ni-kiro futorimashita.', 'Vui lắm. Nhưng ngày nào cũng đi bộ quá nhiều nên đau chân. Hơn nữa ăn đặc sản nhiều quá nên tăng 2 cân.'],
    ]),
    {
      t: 'table',
      caption: 'Bảng thay thế — 「＿＿が ＿＿すぎて、＿＿ませんでした。」',
      head: ['Cái gì', '～すぎて', 'Hậu quả', 'Romaji'],
      rows: [
        ['{部屋|へや}', '{狭|せま}すぎて', 'よく{寝|ね}られませんでした', 'Heya ga semasugite, yoku neraremasen deshita.'],
        ['{荷物|にもつ}', '{重|おも}すぎて', '{電車|でんしゃ}に{乗|の}れませんでした', 'Nimotsu ga omosugite, densha ni noremasen deshita.'],
        ['{山道|やまみち}', '{暗|くら}すぎて', '{何|なに}も{見|み}えませんでした', 'Yamamichi ga kurasugite, nani mo miemasen deshita.'],
        ['{説明|せつめい}', '{難|むずか}しすぎて', 'わかりませんでした', 'Setsumei ga muzukashisugite, wakarimasen deshita.'],
        ['{料理|りょうり}', '{辛|から}すぎて', '{全部|ぜんぶ}{食|た}べられませんでした', 'Ryouri ga karasugite, zenbu taberaremasen deshita.'],
        ['{観光地|かんこうち}', '{人|ひと}が{多|おお}すぎて', 'ゆっくり{見|み}られませんでした', 'Kankouchi wa hito ga oosugite, yukkuri miraremasen deshita.'],
      ],
    },
    { t: 'rule', formula: 'Vます／イA（‑い）／ナA ＋ すぎる（nhóm 2）· いい→よすぎる', vi: 'Nói vượt mức bình thường (thường là xấu); ～すぎて nêu lý do dẫn đến kết quả xấu; V＋すぎ là danh từ.' },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～すぎる',
      items: [
        '~~{高|たか}いすぎる~~ → **{高|たか}すぎる** (bỏ い). ~~{静|しず}かなすぎる~~ → **{静|しず}かすぎる** (bỏ な).',
        '~~いすぎる~~ (cho いい) → **よすぎる**. Nhưng **{少|すく}ない → {少|すく}なすぎる** (bỏ い như thường, KHÔNG phải ~~{少|すく}なさすぎる~~); chỉ tính từ ない đứng riêng mới thành **なさすぎる**.',
        '~~とても{高|たか}すぎる~~ — すぎる đã có nghĩa "quá", không thêm とても. Muốn nhẹ đi thì thêm **ちょっと／{少|すこ}し**.',
        '~~{食|た}べるすぎる~~ → **{食|た}べすぎる** (dùng gốc thể ます). ~~{食|た}べすぎります~~ → **{食|た}べすぎます** (すぎる là nhóm 2: すぎ + ます).',
        'Giới trẻ nói **かわいすぎる／おいしすぎる** để khen (= "dễ thương / ngon hết mức") — hiểu được, nhưng **trong bài thi, bài viết, ～すぎる mang nghĩa tiêu cực** "quá mức".',
      ],
    },

    /* ══════ ⑤ ～やすい・～にくい ══════ */
    { t: 'h', text: '⑤ Vます ＋ やすい／にくい — "dễ V / khó V"' },
    {
      t: 'p',
      text: 'Gắn **やすい** (dễ) hoặc **にくい** (khó) vào gốc thể ます để nhận xét **làm việc đó với một vật / một nơi có dễ không**: この{地図|ちず}は**わかりやすい** (bản đồ này dễ hiểu), この{坂|さか}は**{歩|ある}きにくい** (dốc này khó đi). Từ mới sinh ra là **tính từ い**, chia y như {高|たか}い. Chú ý: chủ ngữ của câu là **đồ vật / nơi chốn** được nhận xét, không phải người làm.',
    },
    {
      t: 'table',
      caption: 'Cách nối ～やすい／～にくい',
      head: ['Thể ます', '＋ やすい (dễ)', '＋ にくい (khó)', 'Romaji'],
      rows: [
        ['わかります', 'わかり**やすい**', 'わかり**にくい**', 'wakariyasui · wakarinikui'],
        ['{歩|ある}きます', '{歩|ある}き**やすい**', '{歩|ある}き**にくい**', 'arukiyasui · arukinikui'],
        ['{使|つか}います', '{使|つか}い**やすい**', '{使|つか}い**にくい**', 'tsukaiyasui · tsukainikui'],
        ['{読|よ}みます', '{読|よ}み**やすい**', '{読|よ}み**にくい**', 'yomiyasui · yominikui'],
        ['{食|た}べます', '{食|た}べ**やすい**', '{食|た}べ**にくい**', 'tabeyasui · tabenikui'],
        ['{覚|おぼ}えます', '{覚|おぼ}え**やすい**', '{覚|おぼ}え**にくい**', 'oboeyasui · oboenikui'],
        ['{住|す}みます', '{住|す}み**やすい**', '{住|す}み**にくい**', 'sumiyasui · suminikui'],
        ['{運転|うんてん}します', '{運転|うんてん}し**やすい**', '{運転|うんてん}し**にくい**', 'unten shiyasui · unten shinikui'],
      ],
    },
    {
      t: 'table',
      caption: '～やすい／～にくい chia tiếp như tính từ い (ví dụ: わかりやすい)',
      head: ['Thể', 'Dạng', 'Romaji', 'Ví dụ'],
      rows: [
        ['Hiện tại', 'わかりやすいです', 'wakariyasui desu', '{説明|せつめい}がわかりやすいです。'],
        ['Phủ định', 'わかりやすくないです', 'wakariyasuku nai desu', 'この{地図|ちず}はわかりやすくないです。'],
        ['Quá khứ', 'わかりやすかったです', 'wakariyasukatta desu', 'ガイドさんの{話|はなし}はわかりやすかったです。'],
        ['Thể て', 'わかりやすくて', 'wakariyasukute', 'わかりやすくて、{便利|べんり}です。'],
        ['Trước danh từ', 'わかりやすい＋N', 'wakariyasui ~', 'わかりやすい{地図|ちず}'],
        ['Thành phó từ', 'わかりやすく', 'wakariyasuku', 'わかりやすく{説明|せつめい}してください。'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N は Vます ＋ やすいです — "N dễ V" (dễ dùng, dễ hiểu, dễ đi…)',
          vi: 'Khen đồ vật / nơi chốn **làm việc đó dễ dàng, thuận lợi**. Chủ ngữ là thứ được nhận xét (đôi giày, cái bản đồ, thành phố).',
          examples: [
            E('この{靴|くつ}は{軽|かる}くて、{歩|ある}きやすいです。', 'Kono kutsu wa karukute, arukiyasui desu.', 'Đôi giày này nhẹ, dễ đi.'),
            E('この{地図|ちず}は{字|じ}が{大|おお}きくて、{見|み}やすいです。', 'Kono chizu wa ji ga ookikute, miyasui desu.', 'Bản đồ này chữ to, dễ nhìn.'),
            E('{京都|きょうと}は{町|まち}が{小|ちい}さくて、{観光|かんこう}しやすいです。', 'Kyouto wa machi ga chiisakute, kankou shiyasui desu.', 'Kyoto thành phố nhỏ, dễ tham quan.'),
            E('{先生|せんせい}の{説明|せつめい}はいつもわかりやすいです。', 'Sensei no setsumei wa itsumo wakariyasui desu.', 'Lời giải thích của thầy lúc nào cũng dễ hiểu.'),
            E('このアプリは{使|つか}いやすくて、{旅行|りょこう}のときに{便利|べんり}です。', 'Kono apuri wa tsukaiyasukute, ryokou no toki ni benri desu.', 'Ứng dụng này dễ dùng, tiện khi đi du lịch.'),
            E('{住|す}みやすい{町|まち}に{引|ひ}っ{越|こ}したいです。', 'Sumiyasui machi ni hikkoshitai desu.', 'Tôi muốn chuyển đến một thị trấn dễ sống.'),
          ],
        },
        {
          formula: 'N は Vます ＋ にくいです — "N khó V"',
          vi: 'Chê đồ vật / nơi chốn **làm việc đó khó, bất tiện**. Lịch sự hơn nói thẳng {悪|わる}い／だめ.',
          examples: [
            E('この{坂|さか}は{急|きゅう}で、{歩|ある}きにくいです。', 'Kono saka wa kyuu de, arukinikui desu.', 'Con dốc này dốc đứng, khó đi.'),
            E('この{駅|えき}は{広|ひろ}くて、{出口|でぐち}がわかりにくいです。', 'Kono eki wa hirokute, deguchi ga wakarinikui desu.', 'Ga này rộng, khó tìm lối ra.'),
            E('{骨|ほね}が{多|おお}い{魚|さかな}は{食|た}べにくいです。', 'Hone ga ooi sakana wa tabenikui desu.', 'Cá nhiều xương thì khó ăn.'),
            E('{日本|にほん}の{地名|ちめい}は{読|よ}みにくいです。', 'Nihon no chimei wa yominikui desu.', 'Địa danh Nhật Bản khó đọc.'),
            E('このペンは{書|か}きにくいですから、{別|べつ}のを{貸|か}してください。', 'Kono pen wa kakinikui desu kara, betsu no o kashite kudasai.', 'Cái bút này khó viết, cho tôi mượn cái khác.'),
          ],
        },
        {
          formula: 'N は Vます ＋ やすい — "N dễ bị V" (khuynh hướng, hay xảy ra)',
          vi: 'Với động từ chỉ **sự việc tự xảy ra** (壊れる, 割れる, 間違える, 迷う, 忘れる, 風邪をひく), やすい mang nghĩa **"dễ bị, hay bị"** — một khuynh hướng, thường không tốt. にくい ngược lại: **khó bị** ({割|わ}れにくい = khó vỡ, bền).',
          examples: [
            E('{祇園|ぎおん}は{道|みち}が{細|ほそ}くて、{迷|まよ}いやすいです。', 'Gion wa michi ga hosokute, mayoiyasui desu.', 'Gion đường nhỏ, dễ bị lạc.'),
            E('この{漢字|かんじ}は{間違|まちが}えやすいですから、{気|き}をつけてください。', 'Kono kanji wa machigaeyasui desu kara, ki o tsukete kudasai.', 'Chữ Hán này dễ viết nhầm, hãy cẩn thận.'),
            E('{寒|さむ}い{季節|きせつ}は{風邪|かぜ}をひきやすいです。', 'Samui kisetsu wa kaze o hikiyasui desu.', 'Mùa lạnh dễ bị cảm.'),
            E('このコップは{割|わ}れやすいですから、{丁寧|ていねい}に{運|はこ}んでください。', 'Kono koppu wa wareyasui desu kara, teinei ni hakonde kudasai.', 'Cái cốc này dễ vỡ, hãy bưng cẩn thận.'),
            E('このスーツケースは{軽|かる}くて、{壊|こわ}れにくいです。', 'Kono suutsukeesu wa karukute, kowarenikui desu.', 'Cái vali này nhẹ mà khó hỏng (bền).'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: '⚠ Bẫy kinh điển: ～やすい (dễ) ↔ {安|やす}い (rẻ) · ～にくい ↔ {難|むずか}しい ↔ できない',
      head: ['Câu', 'Romaji', 'Nghĩa', 'Ghi chú'],
      rows: [
        ['この{靴|くつ}は{歩|ある}き**やすい**です。', 'Kono kutsu wa arukiyasui desu.', 'Giày này **dễ đi**.', '～やすい viết **hiragana**, luôn gắn sau gốc động từ.'],
        ['この{靴|くつ}は**{安|やす}い**です。', 'Kono kutsu wa yasui desu.', 'Giày này **rẻ**.', '{安|やす}い (rẻ) là tính từ riêng, viết chữ 安.'],
        ['この{本|ほん}は{読|よ}み**にくい**です。', 'Kono hon wa yominikui desu.', 'Sách này khó đọc (chữ nhỏ, câu rối…).', 'Nhận xét **vật**: nó làm việc đọc trở nên khó.'],
        ['この{本|ほん}は**{難|むずか}しい**です。', 'Kono hon wa muzukashii desu.', 'Sách này khó (nội dung khó).', '{難|むずか}しい nói về nội dung, trình độ.'],
        ['{漢字|かんじ}が{読|よ}め**ません**。', 'Kanji ga yomemasen.', 'Tôi không đọc được chữ Hán.', 'Năng lực của NGƯỜI (Bài 16) — không phải ～にくい.'],
      ],
    },
    DL('Hỏi – đáp với ～やすい／～にくい (mua đồ đi du lịch)', [
      ['メアリー', 'a', '{旅行|りょこう}に{持|も}っていくかばんを{探|さが}しているんですが。', 'Ryokou ni motte iku kaban o sagashite iru n desu ga.', 'Tôi đang tìm cái túi để mang đi du lịch ạ.'],
      ['{店員|てんいん}', 'b', 'こちらはいかがですか。{軽|かる}いし、ポケットが{多|おお}くて{使|つか}いやすいですよ。', 'Kochira wa ikaga desu ka. Karui shi, poketto ga ookute tsukaiyasui desu yo.', 'Cái này thế nào ạ? Vừa nhẹ, lại nhiều ngăn nên dễ dùng.'],
      ['メアリー', 'a', '{雨|あめ}の{日|ひ}は{大丈夫|だいじょうぶ}ですか。', 'Ame no hi wa daijoubu desu ka.', 'Ngày mưa có sao không ạ?'],
      ['{店員|てんいん}', 'b', 'はい。{水|みず}が{入|はい}りにくい{生地|きじ}ですから、{安心|あんしん}です。', 'Hai. Mizu ga hairinikui kiji desu kara, anshin desu.', 'Vâng. Vải khó thấm nước nên quý khách yên tâm.'],
      ['リン', 'c', 'この{靴|くつ}、どう？ {履|は}きやすい？', 'Kono kutsu, dou? Hakiyasui?', 'Đôi giày này sao? Đi có dễ không?'],
      ['アンナ', 'a', 'うーん、ちょっと{小|ちい}さくて{歩|ある}きにくい。もう{少|すこ}し{大|おお}きいのがいいな。', 'Uun, chotto chiisakute arukinikui. Mou sukoshi ookii no ga ii na.', 'Ừm, hơi nhỏ nên khó đi. Cái to hơn một chút thì tốt.'],
    ]),
    {
      t: 'table',
      caption: 'Bảng thay thế — 「この ＿＿は ＿＿やすい／にくいです。」',
      head: ['Đồ vật / nơi', 'Vì sao', 'Câu', 'Romaji'],
      rows: [
        ['{地図|ちず}', '{絵|え}が{多|おお}い', 'この{地図|ちず}は{絵|え}が{多|おお}くて、わかりやすいです。', 'Kono chizu wa e ga ookute, wakariyasui desu.'],
        ['スーツケース', '{軽|かる}い', 'このスーツケースは{軽|かる}くて、{持|も}ちやすいです。', 'Kono suutsukeesu wa karukute, mochiyasui desu.'],
        ['{町|まち}', '{交通|こうつう}が{便利|べんり}', 'この{町|まち}は{交通|こうつう}が{便利|べんり}で、{住|す}みやすいです。', 'Kono machi wa koutsuu ga benri de, sumiyasui desu.'],
        ['{道|みち}', '{石|いし}が{多|おお}い', 'この{道|みち}は{石|いし}が{多|おお}くて、{歩|ある}きにくいです。', 'Kono michi wa ishi ga ookute, arukinikui desu.'],
        ['{名前|なまえ}', '{長|なが}い', 'この{駅|えき}の{名前|なまえ}は{長|なが}くて、{覚|おぼ}えにくいです。', 'Kono eki no namae wa nagakute, oboenikui desu.'],
        ['{料理|りょうり}', '{骨|ほね}が{多|おお}い', 'この{料理|りょうり}は{骨|ほね}が{多|おお}くて、{食|た}べにくいです。', 'Kono ryouri wa hone ga ookute, tabenikui desu.'],
      ],
    },
    { t: 'rule', formula: 'Vます（bỏ ます）＋ やすい／にくい（＝ tính từ い）', vi: 'Nhận xét một vật / nơi làm việc V dễ hay khó; với động từ "tự xảy ra" thì やすい = dễ bị, にくい = khó bị.' },
    {
      t: 'note',
      title: 'Lỗi hay mắc với ～やすい／～にくい',
      items: [
        '~~{歩|ある}くやすい~~ / ~~{歩|ある}いてやすい~~ → **{歩|ある}きやすい** (gốc thể ます).',
        '~~わかりやすいじゃないです~~ → **わかりやすくないです** — chia như tính từ い.',
        '~~{私|わたし}は{漢字|かんじ}が{書|か}きにくいです~~ (muốn nói "tôi không viết được") → **{私|わたし}は{漢字|かんじ}が{書|か}けません**. ～にくい nhận xét **vật** ({画数|かくすう}が{多|おお}い{漢字|かんじ}は{書|か}きにくい), không nói năng lực của người.',
        'Viết ~~{歩|ある}き{安|やす}い~~ là sai chữ — ～やすい ngữ pháp luôn viết **hiragana**.',
        '**Biết trước (N3)**: **～づらい** cũng là "khó", nhưng nhấn vào cảm giác khó chịu, ngại của người làm: {言|い}いづらい (khó mở lời), {足|あし}が{痛|いた}くて{歩|ある}きづらい.',
      ],
    },

    /* ══════ PHÂN BIỆT ══════ */
    { t: 'h', text: 'Phân biệt bốn cách nói "nếu": ～と・～ば・～たら・～なら (câu hỏi kinh điển của đề N4)' },
    {
      t: 'table',
      caption: 'と (ポイント 113) · ば (Bài 17) · たら (ポイント 120) · なら (Bài 17)',
      head: ['Mẫu', 'Lõi nghĩa', 'Vế sau là ý muốn / nhờ / rủ?', 'Ví dụ', 'Romaji'],
      rows: [
        ['～と', 'hễ A là (tự nhiên, luôn luôn) B — quy luật, máy móc, chỉ đường', '✗ không', '{右|みぎ}に{曲|ま}がると、{駅|えき}があります。', 'Migi ni magaru to, eki ga arimasu.'],
        ['～ば', 'điều kiện cần: có A thì được B — khuyên, so sánh phương án, ～ばいい', '△ chỉ khi A là trạng thái', '{急|いそ}げば、{間|ま}に{合|あ}います。', 'Isogeba, maniaimasu.'],
        ['～たら', 'nếu / khi A (xong) thì B — dùng rộng nhất, cả việc sắp xảy ra chắc chắn', '✓ được', '{着|つ}いたら、{電話|でんわ}してください。', 'Tsuitara, denwa shite kudasai.'],
        ['～なら', 'nếu là A (điều người kia nói) thì B — khuyên, thông tin; B có thể trước A', '✓ được', '{京都|きょうと}へ{行|い}くなら、{秋|あき}がいいですよ。', 'Kyouto e iku nara, aki ga ii desu yo.'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo chọn đúng trong đề',
      items: [
        'Thấy **{右|みぎ}に{曲|ま}がる／ボタンを{押|お}す／{春|はる}になる** + kết quả tự nhiên → **と** (cũng được ば; đề N4 thường lấy と).',
        'Thấy **どう＿＿いいですか／{何|なに}を＿＿いいですか** → **ば** (すれば／{持|も}っていけば).',
        'Thấy vế sau **～てください／～ましょう／～たいです** và vế trước là hành động ({着|つ}く, {終|お}わる, {帰|かえ}る) → **たら**.',
        'Thấy câu đáp lại lời người kia (**A：～たいんですが。B：＿＿、～がいいですよ**) → **なら**.',
        'Việc ở vế sau phải làm **trước** (mua sách trước khi đi, đặt vé trước khi đi) → **V{辞書形|じしょけい}なら**.',
      ],
    },
    {
      t: 'table',
      caption: 'Cùng một ý — chọn mẫu nào? (✓ tự nhiên · △ được nhưng lạ · ✗ sai)',
      head: ['Câu', 'と', 'ば', 'たら', 'なら'],
      rows: [
        ['このボタンを＿＿、{切符|きっぷ}が{出|で}ます。({押|お}す)', '✓ {押|お}すと', '✓ {押|お}せば', '✓ {押|お}したら', '✗'],
        ['{駅|えき}に＿＿、{電話|でんわ}してください。({着|つ}く)', '✗', '✗', '✓ {着|つ}いたら', '✗'],
        ['どう＿＿いいですか。(する)', '△ すると (ít dùng hơn)', '✓ すれば', '✓ したら', '✗'],
        ['A：{温泉|おんせん}に{行|い}きたい。B：{温泉|おんせん}＿＿、{箱根|はこね}がいいよ。', '✗', '✗', '✗', '✓ なら'],
        ['{旅行|りょこう}に＿＿、{早|はや}く{予約|よやく}したほうがいい。({行|い}く)', '✗', '△ {行|い}けば', '✗ (đặt sau khi đi?)', '✓ {行|い}くなら'],
        ['{時間|じかん}が＿＿、{手伝|てつだ}ってください。(ある)', '✗', '✓ あれば', '✓ あったら', '△ あるなら'],
      ],
    },

    /* ══════ TỔNG KẾT ══════ */
    { t: 'h', text: 'Luyện tổng hợp — ghép câu, chia, điền, trắc nghiệm kiểu đề N4' },
    {
      t: 'build',
      id: 'b17-np-ghep',
      title: 'Ghép câu — bấm mảnh theo đúng thứ tự (12 câu)',
      items: [
        { vi: 'Đặt sớm thì sẽ rẻ hơn.', chips: ['{早|はや}く', '{予約|よやく}すれば', '{安|やす}く', 'なります', '{予約|よやく}するし', 'なれば'], answer: ['{早|はや}く', '{予約|よやく}すれば', '{安|やす}く', 'なります'], ro: 'Hayaku yoyaku sureba, yasuku narimasu.' },
        { vi: 'Nếu trời đẹp thì nhìn thấy núi Phú Sĩ.', chips: ['{天気|てんき}が', 'よければ', '{富士山|ふじさん}が', '{見|み}えます', 'いければ', '{見|み}ます'], answer: ['{天気|てんき}が', 'よければ', '{富士山|ふじさん}が', '{見|み}えます'], ro: 'Tenki ga yokereba, Fujisan ga miemasu.' },
        { vi: 'Vé thì mua ở đâu ạ?', chips: ['{切符|きっぷ}は', 'どこで', '{買|か}えば', 'いいですか', '{買|か}えると', '{買|か}えたら'], answer: ['{切符|きっぷ}は', 'どこで', '{買|か}えば', 'いいですか'], ro: 'Kippu wa doko de kaeba ii desu ka.' },
        { vi: 'Không có hộ chiếu thì không lên máy bay được.', chips: ['パスポートが', 'なければ', '{飛行機|ひこうき}に', '{乗|の}れません', 'ないし', '{乗|の}りません'], answer: ['パスポートが', 'なければ', '{飛行機|ひこうき}に', '{乗|の}れません'], ro: 'Pasupooto ga nakereba, hikouki ni noremasen.' },
        { vi: 'Nếu là suối nước nóng thì Hakone hay đấy.', chips: ['{温泉|おんせん}', 'なら', '{箱根|はこね}が', 'いいですよ', 'だなら', '{箱根|はこね}に'], answer: ['{温泉|おんせん}', 'なら', '{箱根|はこね}が', 'いいですよ'], ro: 'Onsen nara, Hakone ga ii desu yo.' },
        { vi: 'Nếu định đi Kyoto thì nên mua sách hướng dẫn.', chips: ['{京都|きょうと}へ', '{行|い}くなら', 'ガイドブックを', '{買|か}ったほうがいいです', '{行|い}ったら', '{行|い}けば'], answer: ['{京都|きょうと}へ', '{行|い}くなら', 'ガイドブックを', '{買|か}ったほうがいいです'], ro: 'Kyouto e iku nara, gaidobukku o katta hou ga ii desu.' },
        { vi: 'Nhà trọ này vừa gần ga vừa rẻ.', chips: ['この{旅館|りょかん}は', '{駅|えき}から', '{近|ちか}いし', '{安|やす}いです', '{近|ちか}いだし', '{安|やす}いし'], answer: ['この{旅館|りょかん}は', '{駅|えき}から', '{近|ちか}いし', '{安|やす}いです'], ro: 'Kono ryokan wa eki kara chikai shi, yasui desu.' },
        { vi: 'Hôm nay vừa mưa vừa lạnh, ở nhà thôi.', chips: ['{今日|きょう}は', '{雨|あめ}だし', '{寒|さむ}いし', '{家|うち}にいよう', '{雨|あめ}し', '{寒|さむ}いだし'], answer: ['{今日|きょう}は', '{雨|あめ}だし', '{寒|さむ}いし', '{家|うち}にいよう'], ro: 'Kyou wa ame da shi, samui shi, uchi ni iyou.' },
        { vi: 'Cái vali này nặng quá.', chips: ['この', 'スーツケースは', '{重|おも}すぎます', '{重|おも}いすぎます', 'とても'], answer: ['この', 'スーツケースは', '{重|おも}すぎます'], ro: 'Kono suutsukeesu wa omosugimasu.' },
        { vi: 'Giá đắt quá nên tôi không mua được.', chips: ['{値段|ねだん}が', '{高|たか}すぎて', '{買|か}えませんでした', '{高|たか}すぎで', '{買|か}いませんでした'], answer: ['{値段|ねだん}が', '{高|たか}すぎて', '{買|か}えませんでした'], ro: 'Nedan ga takasugite, kaemasen deshita.' },
        { vi: 'Bản đồ này dễ hiểu.', chips: ['この', '{地図|ちず}は', 'わかりやすいです', 'わかるやすいです', 'わかって'], answer: ['この', '{地図|ちず}は', 'わかりやすいです'], ro: 'Kono chizu wa wakariyasui desu.' },
        { vi: 'Gion đường nhỏ nên dễ bị lạc.', chips: ['{祇園|ぎおん}は', '{道|みち}が', '{細|ほそ}くて', '{迷|まよ}いやすいです', '{迷|まよ}いにくいです', '{細|ほそ}いて'], answer: ['{祇園|ぎおん}は', '{道|みち}が', '{細|ほそ}くて', '{迷|まよ}いやすいです'], ro: 'Gion wa michi ga hosokute, mayoiyasui desu.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b17-np-chia',
      title: 'Chia — gõ dạng được yêu cầu (12 câu)',
      kind: 'fill',
      grammar: '～ば: nhóm 1 う→え+ば, nhóm 2 る→れば, する→すれば, 来る→来れば, イA い→ければ (いい→よければ), ナA/N なら, phủ định ない→なければ · ～すぎる: Vます／イA（‑い）／ナA ＋ すぎる · ～やすい／にくい: Vます ＋ やすい／にくい',
      items: [
        { q: '{行|い}く → thể ば', answers: V('{行|い}けば'), hint: 'く → け + ば' },
        { q: '{待|ま}つ → thể ば', answers: V('{待|ま}てば'), hint: 'つ → て + ば' },
        { q: '{乗|の}り{換|か}える → thể ば', answers: V('{乗|の}り{換|か}えれば'), hint: 'nhóm 2: る → れば' },
        { q: '{来|く}る → thể ば', answers: V('{来|く}れば'), hint: 'くれば' },
        { q: 'いい → thể ば', answers: ['よければ'], hint: 'いい → よい → よければ' },
        { q: '{暇|ひま}（な） → thể ば', answers: V('{暇|ひま}なら', '{暇|ひま}ならば'), hint: 'tính từ な + なら' },
        { q: 'しない → thể ば (phủ định)', answers: ['しなければ'], hint: 'ない → なければ' },
        { q: '{高|たか}い → ～すぎます', answers: V('{高|たか}すぎます'), hint: 'bỏ い' },
        { q: '{静|しず}か（な） → ～すぎます', answers: V('{静|しず}かすぎます'), hint: 'bỏ な' },
        { q: '{飲|の}みます → ～すぎました', answers: V('{飲|の}みすぎました'), hint: 'gốc ます + すぎました' },
        { q: '{使|つか}います → ～やすい', answers: V('{使|つか}いやすい'), hint: 'gốc ます + やすい' },
        { q: '{読|よ}みます → ～にくい (quá khứ, lịch sự)', answers: V('{読|よ}みにくかったです'), hint: 'chia như tính từ い' },
      ],
    },
    {
      t: 'quiz',
      id: 'b17-np-dien',
      title: 'Điền vào chỗ trống — dùng đúng mẫu của bài (10 câu)',
      kind: 'fill',
      grammar: '～ば · ～ばいいですか · ～なら · ～し · ～すぎる · ～やすい／にくい',
      items: [
        { q: '{急|いそ}（ぐ → điều kiện）、{間|ま}に{合|あ}いますよ。', answers: V('{急|いそ}げば'), hint: 'ぐ → げ + ば' },
        { q: 'すみません、{空港|くうこう}まで{何|なに}で（{行|い}く）いいですか。', answers: V('{行|い}けば'), hint: '～ばいいですか' },
        { q: 'お{金|かね}が（ない → điều kiện）、{旅行|りょこう}に{行|い}けません。', answers: V('なければ'), hint: 'ない → なければ' },
        { q: 'A「{海|うみ}に{行|い}きたいです。」B「{海|うみ}（　）、{沖縄|おきなわ}がいいですよ。」', answers: ['なら'], hint: 'nhận lời người kia' },
        { q: '{富士山|ふじさん}に（{登|のぼ}る）なら、{夏|なつ}がいいです。', answers: V('{登|のぼ}る'), hint: 'thể từ điển + なら' },
        { q: 'この{町|まち}は{静|しず}か（　）し、{自然|しぜん}も{多|おお}いし、{好|す}きです。', answers: ['だ'], hint: 'tính từ な + だ + し' },
        { q: 'この{部屋|へや}は（{狭|せま}い → quá）て、スーツケースが{開|ひら}けません。', answers: V('{狭|せま}すぎ', '{狭|せま}すぎて'), hint: 'bỏ い + すぎ' },
        { q: '{昨日|きのう}、{歩|ある}き（　）て、{足|あし}が{痛|いた}いです。(quá nhiều)', answers: ['すぎ'], hint: '～すぎて' },
        { q: 'この{地図|ちず}は{字|じ}が{大|おお}きくて、（{見|み}る → dễ）です。', answers: V('{見|み}やすい'), hint: 'gốc ます 見 + やすい' },
        { q: 'この{坂|さか}は{急|きゅう}で、（{歩|ある}く → khó）です。', answers: V('{歩|ある}きにくい'), hint: 'gốc ます + にくい' },
      ],
    },
    {
      t: 'mcq',
      id: 'b17-np-jlpt',
      title: 'Trắc nghiệm dạng đề JLPT N4 — 文法形式の判断 (10 câu) + 文の組み立て ★ (4 câu)',
      items: [
        { q: 'この{道|みち}をまっすぐ（　）、{右|みぎ}に{駅|えき}があります。', options: ['{行|い}くと', '{行|い}くなら', '{行|い}くし', '{行|い}きすぎて'], correct: 0, why: 'Chỉ đường, kết quả tự nhiên → **と** (ポイント 113). 〔Kono michi o massugu iku to, migi ni eki ga arimasu.〕' },
        { q: 'A「{日本語|にほんご}の{辞書|じしょ}がほしいんですが。」B「{辞書|じしょ}（　）、この{店|みせ}が{安|やす}いですよ。」', options: ['と', 'なら', 'し', 'ば'], correct: 1, why: 'Nhận lời người kia rồi khuyên → **なら**. 〔Jisho nara, kono mise ga yasui desu yo.〕' },
        { q: '{予約|よやく}したいんですが、どう（　）いいですか。', options: ['するし', 'すれば', 'するなら', 'しすぎて'], correct: 1, why: 'Hỏi chỉ dẫn → **～ばいいですか**: すれば. 〔Yoyaku shitai n desu ga, dou sureba ii desu ka.〕' },
        { q: '{駅|えき}に（　）、{電話|でんわ}してください。', options: ['{着|つ}けば', '{着|つ}くなら', '{着|つ}いたら', '{着|つ}くと'], correct: 2, why: 'Vế trước là hành động, vế sau là nhờ → **たら**. 〔Eki ni tsuitara, denwa shite kudasai.〕' },
        { q: '{天気|てんき}が（　）、{明日|あした}は{島|しま}へ{行|い}きます。', options: ['いいれば', 'よければ', 'いければ', 'よいなら'], correct: 1, why: 'いい → **よければ**. 〔Tenki ga yokereba, ashita wa shima e ikimasu.〕' },
        { q: 'この{旅館|りょかん}は{料理|りょうり}もおいしい（　）、{部屋|へや}もきれいです。', options: ['し', 'なら', 'すぎて', 'ば'], correct: 0, why: 'Liệt kê ưu điểm với も → **し**. 〔Kono ryokan wa ryouri mo oishii shi, heya mo kirei desu.〕' },
        { q: '{昨日|きのう}は{夜|よる}{遅|おそ}くまで{起|お}きていたので、{今朝|けさ}は{寝|ね}（　）、{授業|じゅぎょう}に{遅刻|ちこく}しました。', options: ['やすくて', 'すぎて', 'にくくて', 'なら'], correct: 1, why: 'Ngủ quá giờ → **{寝|ね}すぎて** (lý do) → đến muộn. 〔Kesa wa nesugite, jugyou ni chikoku shimashita.〕' },
        { q: 'このスーツケースは（　）すぎて、{一人|ひとり}で{持|も}てません。', options: ['{重|おも}い', '{重|おも}', '{重|おも}く', '{重|おも}くて'], correct: 1, why: 'Tính từ い bỏ い + すぎる → **{重|おも}すぎて**. 〔Kono suutsukeesu wa omosugite, hitori de motemasen.〕' },
        { q: '{先生|せんせい}の{説明|せつめい}は（　）やすいです。', options: ['わかる', 'わかり', 'わかって', 'わかった'], correct: 1, why: 'Gốc thể ます + やすい → **わかりやすい**. 〔Sensei no setsumei wa wakariyasui desu.〕' },
        { q: 'この{漢字|かんじ}は{形|かたち}が{似|に}ていて、{間違|まちが}え（　）です。', options: ['すぎ', 'やすい', 'なら', 'ば'], correct: 1, why: 'Khuynh hướng "dễ bị nhầm" → **{間違|まちが}えやすい**. 〔Kono kanji wa katachi ga nite ite, machigaeyasui desu.〕' },
        { q: '★ {早|はや}く ＿＿ ＿＿ ★ ＿＿。（{安|やす}く／すれば／なります／{予約|よやく}）', options: ['{安|やす}く', 'すれば', 'なります', '{予約|よやく}'], correct: 0, why: 'Câu đúng: {早|はや}く **{予約|よやく} すれば {安|やす}く なります**. Ô ★ (thứ 3) = **{安|やす}く**. 〔Hayaku yoyaku sureba yasuku narimasu.〕' },
        { q: '★ {北海道|ほっかいどう}へ ＿＿ ＿＿ ★ ＿＿ ほうがいいです。（{持|も}っていった／コートを／{行|い}くなら／{厚|あつ}い）', options: ['{持|も}っていった', 'コートを', '{行|い}くなら', '{厚|あつ}い'], correct: 1, why: 'Câu đúng: {北海道|ほっかいどう}へ **{行|い}くなら {厚|あつ}い コートを {持|も}っていった** ほうがいいです. Ô ★ (thứ 3) = **コートを**. 〔Hokkaidou e iku nara atsui kooto o motte itta hou ga ii desu.〕' },
        { q: '★ この{町|まち}は ＿＿ ＿＿ ★ ＿＿ です。（{住|す}みやすい／{静|しず}かだし／{店|みせ}も{多|おお}いし／とても）', options: ['{住|す}みやすい', '{静|しず}かだし', '{店|みせ}も{多|おお}いし', 'とても'], correct: 3, why: 'Câu đúng: この{町|まち}は **{静|しず}かだし {店|みせ}も{多|おお}いし とても {住|す}みやすい** です. Ô ★ (thứ 3) = **とても**. 〔Kono machi wa shizuka da shi, mise mo ooi shi, totemo sumiyasui desu.〕' },
        { q: '★ {人|ひと}が ＿＿ ＿＿ ★ ＿＿ でした。（{見|み}られません／{多|おお}すぎて／{紅葉|こうよう}が／ゆっくり）', options: ['{見|み}られません', '{多|おお}すぎて', '{紅葉|こうよう}が', 'ゆっくり'], correct: 3, why: 'Câu đúng: {人|ひと}が **{多|おお}すぎて {紅葉|こうよう}が ゆっくり {見|み}られません** でした. Ô ★ (thứ 3) = **ゆっくり**. 〔Hito ga oosugite kouyou ga yukkuri miraremasen deshita.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const HAN_TU: Lesson = {
  id: 'b17-han-tu',
  kind: 'kanji',
  title: 'Chữ Hán mới — 15 chữ: 発 光 重 軽 洋 世 界 港 島 湖 案 内 定 指 側',
  goal: 'Đọc đúng (không cần furigana) và hiểu nghĩa 15 chữ Hán mới của Bài 17 trong các từ hay gặp khi đi du lịch (出発・観光・重い・軽い・洋室・世界・空港・島・湖・案内・予定・指定席・窓側…), chọn đúng chữ khi đề cho hiragana, phân biệt chữ trông giống, và viết tay được các chữ ✍.',
  minutes: 45,
  blocks: [
    {
      t: 'p',
      text: 'Đến Bài 16, bạn đã gặp khoảng **550 chữ Hán** — gần như toàn bộ chữ N4. Bài 17 dùng **7 chữ N4 còn lại hợp chủ đề du lịch** (発 光 重 軽 洋 世 界) và **8 chữ N3** đi theo từ du lịch rất hay gặp trên biển báo, vé tàu, trang đặt phòng (港 島 湖 案 内 定 指 側). Cột **Mức** ghi cả cấp: ✍ = nên viết được, 👁 = nhận mặt (đọc + hiểu). Học **theo từ**: {出発|しゅっぱつ} (shuppatsu), {指定席|していせき} (shiteiseki), {窓側|まどがわ} (madogawa) — đề 漢字読み và 表記 hỏi **cả từ**.',
    },
    {
      t: 'table',
      caption: '15 chữ Hán mới của Bài 17',
      head: ['Chữ', 'Hán Việt', 'Âm On', 'Âm Kun', 'Nghĩa', 'Từ ví dụ', 'Mức'],
      rows: [
        ['発', 'PHÁT', 'ハツ・ホツ', '—', 'phát ra, xuất phát', '{出発|しゅっぱつ} (xuất phát) · {発音|はつおん} (phát âm) · {発表|はっぴょう} (phát biểu, thuyết trình) · {東京発|とうきょうはつ} (khởi hành từ Tokyo)', '✍ N4'],
        ['光', 'QUANG', 'コウ', 'ひか(る)・ひかり', 'ánh sáng', '{観光|かんこう} (tham quan) · {光|ひかり} (ánh sáng) · {光|ひか}る (toả sáng) · {日光|にっこう} (ánh nắng; Nikko)', '✍ N4'],
        ['重', 'TRỌNG', 'ジュウ・チョウ', 'おも(い)', 'nặng; quan trọng', '{重|おも}い (nặng) · {体重|たいじゅう} (cân nặng) · {貴重品|きちょうひん} (đồ quý giá) · {重要|じゅうよう} (quan trọng)', '✍ N4'],
        ['軽', 'KHINH', 'ケイ', 'かる(い)', 'nhẹ', '{軽|かる}い (nhẹ) · {軽食|けいしょく} (bữa ăn nhẹ) · {手軽|てがる} (dễ dàng, tiện)', '👁 N4'],
        ['洋', 'DƯƠNG', 'ヨウ', '—', 'đại dương; phương Tây', '{洋室|ようしつ} (phòng kiểu Tây) · {洋服|ようふく} (quần áo Tây) · {西洋|せいよう} (phương Tây) · {太平洋|たいへいよう} (Thái Bình Dương)', '👁 N4'],
        ['世', 'THẾ', 'セ・セイ', 'よ', 'đời, thế gian', '{世界|せかい} (thế giới) · {世話|せわ} (chăm sóc) · {世|よ}の{中|なか} (xã hội, cuộc đời)', '✍ N4'],
        ['界', 'GIỚI', 'カイ', '—', 'ranh giới, giới', '{世界|せかい} (thế giới) · {世界中|せかいじゅう} (khắp thế giới) · {世界遺産|せかいいさん} (di sản thế giới)', '👁 N4'],
        ['港', 'CẢNG', 'コウ', 'みなと', 'cảng', '{空港|くうこう} (sân bay) · {港|みなと} (cảng biển) · {成田空港|なりたくうこう}', '👁 N3'],
        ['島', 'ĐẢO', 'トウ', 'しま', 'đảo', '{島|しま} (đảo) · {半島|はんとう} (bán đảo) · {島国|しまぐに} (đảo quốc) · {宮島|みやじま} (đảo Miyajima)', '✍ N3'],
        ['湖', 'HỒ', 'コ', 'みずうみ', 'hồ', '{湖|みずうみ} (hồ) · {琵琶湖|びわこ} (hồ Biwa — trong tên hồ đọc こ) · {芦ノ湖|あしのこ} (hồ Ashi ở Hakone)', '👁 N3'],
        ['案', 'ÁN', 'アン', '—', 'phương án, ý tưởng; dẫn', '{案内|あんない} (hướng dẫn) · {観光案内所|かんこうあんないじょ} (quầy thông tin du lịch) · {案|あん} (phương án)', '👁 N3'],
        ['内', 'NỘI', 'ナイ・ダイ', 'うち', 'bên trong', '{案内|あんない} (hướng dẫn) · {国内|こくない} (trong nước) · {以内|いない} (trong vòng) · {内側|うちがわ} (phía trong)', '✍ N3'],
        ['定', 'ĐỊNH', 'テイ・ジョウ', 'さだ(める)', 'định, cố định', '{予定|よてい} (dự định) · {指定席|していせき} (ghế đặt trước) · {定食|ていしょく} (suất cơm) · {定休日|ていきゅうび} (ngày nghỉ cố định)', '✍ N3'],
        ['指', 'CHỈ', 'シ', 'ゆび・さ(す)', 'ngón tay; chỉ', '{指定席|していせき} (ghế đặt trước) · {指|ゆび} (ngón tay) · {指|さ}す (chỉ vào)', '👁 N3'],
        ['側', 'TRẮC', 'ソク', 'がわ・かわ', 'phía, bên', '{窓側|まどがわ} (phía cửa sổ) · {通路側|つうろがわ} (phía lối đi) · {右側|みぎがわ} (bên phải) · {両側|りょうがわ} (hai bên)', '👁 N3'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ bằng hình (học kèm khi tập viết)',
      items: [
        '**発** — trên là 癶 (hai bàn chân dang ra, bước đi), dưới trông như cánh cổng: bước chân ra khỏi cổng = **xuất PHÁT** → {出発|しゅっぱつ}.',
        '**光** — phần trên là ngọn lửa (biến dạng của 火), dưới là 儿 (đôi chân người): người đội lửa trên đầu toả **ánh SÁNG**. 観光 = "đi xem ánh sáng (cái đẹp) của một vùng".',
        '**重** — mẹo nhìn: 千 (nghìn) chồng lên 里 (dặm): gánh nghìn dặm thì **NẶNG**. Chữ ✍ — viết nét ngang giữa dài nhất.',
        '**軽** = 車 (xe) + 圣 (phần gợi âm ケイ — cũng có trong 経): **xe NHẸ** → {軽自動車|けいじどうしゃ} (ô tô cỡ nhỏ).',
        '**洋** = 氵 (nước) + 羊 (con dê — gợi âm ヨウ): nước mênh mông = **đại DƯƠNG**; bên kia đại dương = phương Tây → {洋室|ようしつ}, {洋服|ようふく}.',
        '**世** — gốc là ba chữ 十 nối liền (30 năm = một **ĐỜI** người) → {世界|せかい}.',
        '**界** = 田 (ruộng) + 介 (ở giữa — gợi âm カイ): bờ đất **ngăn giữa** các thửa ruộng = ranh **GIỚI** → {世界|せかい}.',
        '**港** = 氵 (nước) + 巷 (ngõ, lối nhỏ — gợi âm コウ): lối nước cho thuyền vào = **CẢNG** → {空港|くうこう} ("cảng trên trời").',
        '**島** — con chim 鳥 (bỏ bớt chân) đậu trên ngọn núi 山 giữa biển = hòn **ĐẢO**.',
        '**湖** = 氵 (nước) + 胡 (gợi âm コ): vùng nước lớn = **HỒ**.',
        '**案** = 安 (yên — gợi âm アン) + 木 (cái bàn gỗ): ngồi yên bên bàn nghĩ **phương ÁN** → {案内|あんない} (dẫn đường).',
        '**内** — khung 冂 (cửa, khung nhà) có người 人 đi vào: **bên TRONG** → {国内|こくない}, {案内|あんない}.',
        '**定** = 宀 (mái nhà) + phần dưới là biến thể của 正 (ngay ngắn): dưới mái nhà mọi thứ đặt **cố ĐỊNH** → {予定|よてい}.',
        '**指** = 扌 (tay) + 旨 (gợi âm シ): phần của bàn tay = **ngón tay**, dùng để **CHỈ** → {指定席|していせき} ("ghế được chỉ định").',
        '**側** = 亻 (người) + 則 (quy tắc — gợi âm ソク): người đứng **BÊN CẠNH** → ～{側|がわ} (phía ~).',
      ],
    },
    {
      t: 'table',
      caption: 'Đứng riêng hay đứng chung — kun khi đứng một mình / có đuôi kana, on trong từ ghép',
      head: ['Chữ', 'Đứng riêng (kun)', 'Trong từ ghép (on)', 'Bẫy'],
      rows: [
        ['発', '—', '{出発|しゅっぱつ} (パツ), {発音|はつおん} (ハツ), {発表|はっぴょう} (ハッ)', 'đổi âm: しゅっ**ぱつ** (っ + ぱ), はっ**ぴょう**'],
        ['光', '{光|ひかり}, {光|ひか}る', '{観光|かんこう} (コウ)', 'かん**こう** — trường âm, đừng đọc ~~かんこ~~'],
        ['重', '{重|おも}い', '{体重|たいじゅう} (ジュウ), {貴重品|きちょうひん} (チョウ)', 'hai âm On; {重|おも}い ≠ {思|おも}い (cùng đọc おもい!)'],
        ['軽', '{軽|かる}い', '{軽食|けいしょく} (ケイ)', '{軽|かる}い (karui) — đừng nhầm với {暗|くら}い'],
        ['洋', '—', '{洋室|ようしつ}, {洋服|ようふく} (ヨウ)', 'luôn ヨウ; {洋室|ようしつ} (kiểu Tây) ↔ {和室|わしつ} (kiểu Nhật)'],
        ['世', '{世|よ}の{中|なか}', '{世界|せかい} (セ), {世紀|せいき} (セイ)', '{世界|せかい} đọc **せ**, không phải ~~せい~~かい'],
        ['界', '—', '{世界|せかい} (カイ)', 'luôn カイ'],
        ['港', '{港|みなと}', '{空港|くうこう} (コウ)', 'đứng riêng みなと, trong từ ghép こう'],
        ['島', '{島|しま}', '{半島|はんとう} (トウ); trong tên: {宮島|みやじま} (じま)', 'tên đảo hay đọc **じま** (âm đục)'],
        ['湖', '{湖|みずうみ}', '{琵琶湖|びわこ} (コ)', 'み・ず・う・み — romaji **mizuumi**'],
        ['案', '—', '{案内|あんない}, {案|あん} (アン)', 'あん**ない** — hai âm ん liền nhau'],
        ['内', '{内|うち}がわ (=内側)', '{案内|あんない}, {国内|こくない} (ナイ)', '{内側|うちがわ} đọc **うち**'],
        ['定', '—', '{予定|よてい}, {指定|してい} (テイ), {定食|ていしょく}', 'よ**てい** (không đục) — đừng đọc ~~よでい~~'],
        ['指', '{指|ゆび}, {指|さ}す', '{指定席|していせき} (シ)', 'ゆび (ngón tay) ≠ ゆび**わ** ({指輪|ゆびわ} — nhẫn)'],
        ['側', '～{側|がわ}', '{側面|そくめん} (ソク — N2)', 'sau danh từ đọc **がわ**: {窓側|まどがわ}, {右側|みぎがわ}'],
      ],
    },
    {
      t: 'readkanji',
      id: 'b17-doc-kanji',
      title: 'Đọc KHÔNG furigana — 20 câu (chữ mới + chữ đã học)',
      note: 'Che phần đáp án, đọc to cả câu rồi bấm hiện cách đọc. Câu nào vấp ở chữ mới thì quay lại bảng trên.',
      items: [
        { text: 'バスは{朝|あさ}{七時|しちじ}に{出発|しゅっぱつ}します。', ro: 'Basu wa asa shichiji ni shuppatsu shimasu.', vi: 'Xe buýt khởi hành lúc 7 giờ sáng.' },
        { text: '{京都|きょうと}で{三日間|みっかかん}{観光|かんこう}しました。', ro: 'Kyouto de mikkakan kankou shimashita.', vi: 'Tôi đã tham quan Kyoto 3 ngày.' },
        { text: 'このスーツケースは{重|おも}すぎます。', ro: 'Kono suutsukeesu wa omosugimasu.', vi: 'Cái vali này nặng quá.' },
        { text: '{軽|かる}い{靴|くつ}は{歩|ある}きやすいです。', ro: 'Karui kutsu wa arukiyasui desu.', vi: 'Giày nhẹ thì dễ đi.' },
        { text: '{和室|わしつ}と{洋室|ようしつ}と、どちらがいいですか。', ro: 'Washitsu to youshitsu to, dochira ga ii desu ka.', vi: 'Phòng kiểu Nhật và phòng kiểu Tây, bạn thích phòng nào?' },
        { text: '{富士山|ふじさん}は{世界|せかい}で{有名|ゆうめい}な{山|やま}です。', ro: 'Fujisan wa sekai de yuumei na yama desu.', vi: 'Núi Phú Sĩ là ngọn núi nổi tiếng thế giới.' },
        { text: '{空港|くうこう}まで{電車|でんしゃ}で{一時間|いちじかん}かかります。', ro: 'Kuukou made densha de ichijikan kakarimasu.', vi: 'Đến sân bay đi tàu mất một tiếng.' },
        { text: '{港|みなと}から{船|ふね}で{島|しま}へ{行|い}きます。', ro: 'Minato kara fune de shima e ikimasu.', vi: 'Từ cảng đi thuyền ra đảo.' },
        { text: '{旅館|りょかん}の{部屋|へや}から{湖|みずうみ}が{見|み}えます。', ro: 'Ryokan no heya kara mizuumi ga miemasu.', vi: 'Từ phòng nhà trọ nhìn thấy hồ.' },
        { text: '{友達|ともだち}が{町|まち}を{案内|あんない}してくれました。', ro: 'Tomodachi ga machi o annai shite kuremashita.', vi: 'Bạn tôi đã dẫn tôi đi thăm thị trấn.' },
        { text: '{週末|しゅうまつ}の{予定|よてい}はまだ{決|き}めていません。', ro: 'Shuumatsu no yotei wa mada kimete imasen.', vi: 'Lịch cuối tuần tôi vẫn chưa quyết.' },
        { text: '{指定席|していせき}を{二枚|にまい}お{願|ねが}いします。', ro: 'Shiteiseki o nimai onegai shimasu.', vi: 'Cho tôi 2 vé ghế đặt trước.' },
        { text: '{窓側|まどがわ}の{席|せき}が{空|あ}いていますか。', ro: 'Madogawa no seki ga aite imasu ka.', vi: 'Còn ghế phía cửa sổ không ạ?' },
        { text: '{駅|えき}を{出|で}て、{右側|みぎがわ}に{観光案内所|かんこうあんないじょ}があります。', ro: 'Eki o dete, migigawa ni kankou annaijo ga arimasu.', vi: 'Ra khỏi ga, bên phải có quầy thông tin du lịch.' },
        { text: '{先生|せんせい}の{発音|はつおん}はとてもきれいです。', ro: 'Sensei no hatsuon wa totemo kirei desu.', vi: 'Phát âm của cô rất chuẩn.' },
        { text: '{国内|こくない}{旅行|りょこう}なら、{北海道|ほっかいどう}がいいです。', ro: 'Kokunai ryokou nara, Hokkaidou ga ii desu.', vi: 'Nếu là du lịch trong nước thì Hokkaido hay.' },
        { text: 'この{店|みせ}の{定休日|ていきゅうび}は{水曜日|すいようび}です。', ro: 'Kono mise no teikyuubi wa suiyoubi desu.', vi: 'Ngày nghỉ cố định của cửa hàng này là thứ Tư.' },
        { text: '{夜|よる}の{町|まち}に{光|ひかり}がたくさん{見|み}えます。', ro: 'Yoru no machi ni hikari ga takusan miemasu.', vi: 'Thấy rất nhiều ánh đèn trên phố đêm.' },
        { text: '{地図|ちず}のこの{島|しま}を{指|ゆび}で{指|さ}してください。', ro: 'Chizu no kono shima o yubi de sashite kudasai.', vi: 'Hãy lấy ngón tay chỉ vào hòn đảo này trên bản đồ.' },
        { text: '{来週|らいしゅう}、{授業|じゅぎょう}で{旅行|りょこう}の{計画|けいかく}を{発表|はっぴょう}します。', ro: 'Raishuu, jugyou de ryokou no keikaku o happyou shimasu.', vi: 'Tuần sau tôi sẽ thuyết trình kế hoạch du lịch trong giờ học.' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b17-doc-doan',
      title: 'Đọc đoạn ngắn kiểu đề — 3 đoạn không furigana',
      note: 'Đọc to cả đoạn trong 40 giây như phần Reading của thi nói, rồi mới mở đáp án.',
      items: [
        { text: '{来月|らいげつ}の{連休|れんきゅう}に、{友達|ともだち}と{京都|きょうと}へ{行|い}く{予定|よてい}です。{朝|あさ}{八時|はちじ}に{東京|とうきょう}を{出発|しゅっぱつ}して、{昼|ひる}から{観光|かんこう}します。{指定席|していせき}はもう{予約|よやく}しました。', ro: 'Raigetsu no renkyuu ni, tomodachi to Kyouto e iku yotei desu. Asa hachiji ni Toukyou o shuppatsu shite, hiru kara kankou shimasu. Shiteiseki wa mou yoyaku shimashita.', vi: 'Kỳ nghỉ dài tháng sau tôi sẽ đi Kyoto với bạn. 8 giờ sáng khởi hành từ Tokyo, từ trưa đi tham quan. Ghế đặt trước thì tôi đã đặt rồi.' },
        { text: 'この{旅館|りょかん}は{湖|みずうみ}の{近|ちか}くにあります。{部屋|へや}は{和室|わしつ}も{洋室|ようしつ}もあります。{駅|えき}から{遠|とお}いですが、{旅館|りょかん}の{人|ひと}が{車|くるま}で{案内|あんない}してくれます。', ro: 'Kono ryokan wa mizuumi no chikaku ni arimasu. Heya wa washitsu mo youshitsu mo arimasu. Eki kara tooi desu ga, ryokan no hito ga kuruma de annai shite kuremasu.', vi: 'Nhà trọ này ở gần hồ. Phòng có cả kiểu Nhật lẫn kiểu Tây. Xa ga nhưng nhân viên nhà trọ đưa đón bằng ô tô.' },
        { text: '{空港|くうこう}で{荷物|にもつ}を{量|はか}ったら、{重|おも}すぎました。それで、{重|おも}い{本|ほん}を{出|だ}して、{軽|かる}くしました。{世界|せかい}のどこへ{行|い}っても、{荷物|にもつ}は{少|すく}ないほうがいいです。', ro: 'Kuukou de nimotsu o hakattara, omosugimashita. Sorede, omoi hon o dashite, karuku shimashita. Sekai no doko e itte mo, nimotsu wa sukunai hou ga ii desu.', vi: 'Cân hành lý ở sân bay thì quá nặng. Vì thế tôi lấy sách nặng ra cho nhẹ bớt. Đi đâu trên thế giới thì hành lý cũng nên ít.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b17-han-doc',
      title: '漢字読み — chọn cách đọc của từ in đậm (12 câu)',
      items: [
        { q: '{電車|でんしゃ}は{九時|くじ}に**出発**します。', options: ['しゅっぱつ', 'しゅつはつ', 'でぱつ', 'しゅっぱっ'], correct: 0, why: '**{出発|しゅっぱつ}** (shuppatsu) — 出 シュツ + 発 ハツ → しゅっ・ぱつ (âm ngắt + âm bán đục).' },
        { q: '{京都|きょうと}を**観光**しました。', options: ['かんこ', 'かんこう', 'けんこう', 'かんひかり'], correct: 1, why: '**{観光|かんこう}** (kankou) — trường âm こう.' },
        { q: 'この{荷物|にもつ}は**重**いです。', options: ['かる', 'おも', 'おお', 'つよ'], correct: 1, why: '**{重|おも}い** (omoi) — nặng.' },
        { q: '**軽**い{食事|しょくじ}がしたいです。', options: ['かる', 'おも', 'ひく', 'やす'], correct: 0, why: '**{軽|かる}い** (karui) — nhẹ.' },
        { q: '**洋室**を{予約|よやく}しました。', options: ['わしつ', 'ようしつ', 'ようしき', 'よしつ'], correct: 1, why: '**{洋室|ようしつ}** (youshitsu) — phòng kiểu Tây. {和室|わしつ} là phòng kiểu Nhật.' },
        { q: '**世界**の{国|くに}を{旅行|りょこう}したいです。', options: ['せいかい', 'せかい', 'よかい', 'せけい'], correct: 1, why: '**{世界|せかい}** (sekai) — 世 đọc セ trong từ này.' },
        { q: '**空港**まで{迎|むか}えに{行|い}きます。', options: ['くうこう', 'そらこう', 'くこう', 'くうみなと'], correct: 0, why: '**{空港|くうこう}** (kuukou) — cả hai chữ đều trường âm.' },
        { q: '**島**へ{船|ふね}で{行|い}きました。', options: ['とう', 'しま', 'やま', 'みなと'], correct: 1, why: '**{島|しま}** (shima) — đứng riêng đọc kun.' },
        { q: '**湖**で{泳|およ}ぎました。', options: ['みずうみ', 'いけ', 'うみ', 'かわ'], correct: 0, why: '**{湖|みずうみ}** (mizuumi) — hồ. {池|いけ} = ao, {海|うみ} = biển.' },
        { q: '{駅|えき}の**案内**を{見|み}てください。', options: ['あんない', 'あない', 'あんうち', 'かんない'], correct: 0, why: '**{案内|あんない}** (annai) — hai âm ん.' },
        { q: '**指定席**は{三号車|さんごうしゃ}です。', options: ['しじょうせき', 'していせき', 'ゆびていせき', 'しでいせき'], correct: 1, why: '**{指定席|していせき}** (shiteiseki) — 指 シ, 定 テイ, 席 セキ.' },
        { q: '**窓側**の{席|せき}がいいです。', options: ['まどそく', 'まどかわ', 'まどがわ', 'そうがわ'], correct: 2, why: '**{窓側|まどがわ}** (madogawa) — 側 sau danh từ đọc **がわ** (âm đục).' },
      ],
    },
    {
      t: 'mcq',
      id: 'b17-han-chon',
      title: '表記 — chọn chữ Hán đúng cho từ viết bằng hiragana (8 câu)',
      items: [
        { q: '{明日|あした}の**しゅっぱつ**は{八時|はちじ}です。', options: ['出発', '出登', '出髪', '山発'], correct: 0, why: '**出発** — 発 có 癶 ở trên. 登 (leo) cũng có 癶 nhưng dưới là 豆; 髪 (tóc) khác hẳn.' },
        { q: 'このかばんは**おもい**です。', options: ['思い', '重い', '主い', '動い'], correct: 1, why: '**重い** = nặng. 思い (おもい — ý nghĩ) cùng âm nhưng khác nghĩa — bẫy đồng âm!' },
        { q: '**かるい**{靴|くつ}を{買|か}いました。', options: ['軽い', '経い', '転い', '車い'], correct: 0, why: '**軽い** — bộ 車 (xe). 経 có bộ 糸, 転 là "chuyển".' },
        { q: '**せかい**で{一番|いちばん}{高|たか}い{山|やま}はどこですか。', options: ['世介', '世界', '生界', '世回'], correct: 1, why: '**世界** — 界 = 田 + 介.' },
        { q: '**くうこう**に{着|つ}きました。', options: ['空港', '空巷', '空航', '室港'], correct: 0, why: '**空港** — 港 có 氵 (nước). 航 (hàng — đi thuyền) cũng có thật nhưng không phải từ này.' },
        { q: 'あの**しま**に{行|い}きたいです。', options: ['鳥', '島', '烏', '山'], correct: 1, why: '**島** — 鳥 bỏ chân + 山. 鳥 là con chim, 烏 là con quạ.' },
        { q: '{町|まち}を**あんない**します。', options: ['安内', '案内', '案肉', '安肉'], correct: 1, why: '**案内** — 案 = 安 + 木. 内 (trong) ≠ 肉 (thịt) — trông giống!' },
        { q: '{来週|らいしゅう}の**よてい**を{教|おし}えてください。', options: ['予定', '予足', '余定', '予走'], correct: 0, why: '**予定** — 定 có 宀 ở trên. 足 (chân), 走 (chạy) giống phần dưới nhưng không có mái.' },
      ],
    },
    {
      t: 'write',
      id: 'b17-viet-kanji',
      title: 'Tập viết — 7 chữ ✍ và 7 từ',
      note: 'Viết 7 chữ ✍ trước (đúng thứ tự nét theo hoạt hình), rồi viết cả từ. 👁 chỉ cần đọc được — viết thêm nếu còn thời gian.',
      chars: ['発', '光', '重', '世', '島', '内', '定', '出発', '観光', '世界', '空港', '案内', '指定席', '窓側'],
      goi: {
        '出発': 'しゅっぱつ · xuất phát',
        '観光': 'かんこう · tham quan',
        '世界': 'せかい · thế giới',
        '空港': 'くうこう · sân bay',
        '案内': 'あんない · hướng dẫn',
        '指定席': 'していせき · ghế đặt trước',
        '窓側': 'まどがわ · phía cửa sổ',
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
  id: 'b17-nghe',
  kind: 'listening',
  title: 'Nghe hiểu N4 — 6 bài theo đủ 4 dạng đề: 課題理解 · ポイント理解 · 発話表現 · 即時応答',
  goal: 'Nghe gọi điện đặt phòng, nghe mua vé ở quầy ga, nghe bạn kể vì sao chọn nơi du lịch và kể lại chuyến đi để bắt đúng thông tin đề hỏi; chọn câu nói đúng tình huống và đáp nhanh câu có ～ば, ～なら, ～すぎる, ～やすい — đúng 4 dạng của phần 聴解 đề N4.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Phần nghe (聴解) đề JLPT N4 — 4 dạng, 35 phút',
      head: ['Mondai', 'Dạng', 'Làm gì', 'Mẹo của bài này'],
      rows: [
        ['問題1', '課題理解 (hiểu nhiệm vụ)', 'Nghe hội thoại, chọn việc người đó sẽ làm **trước tiên / tiếp theo** hoặc thứ sẽ mua.', 'Phương án bị từ chối ("満室です", "いっぱいです", "{同|おな}じです") là bẫy. Câu chốt thường ở cuối: "じゃ、～にします／～でお{願|ねが}いします".'],
        ['問題2', 'ポイント理解 (hiểu điểm chính)', 'Câu hỏi nghe **trước**, rồi tìm đúng điểm đó (lý do, điều vất vả nhất…).', 'Nghe ～し、～し: người nói nêu NHIỀU lý do; đề hỏi "いちばん" thì chờ chữ **いちばん／{一番|いちばん}／ずっと**.'],
        ['問題3', '発話表現 (nói gì trong tình huống)', 'Nghe mô tả tình huống, chọn câu nên nói.', 'Hỏi chỉ dẫn → **～ばいいですか**; khuyên bạn → **～なら**; chê nhẹ / từ chối → **ちょっと～すぎます**.'],
        ['問題4', '即時応答 (đáp ngay)', 'Nghe một câu ngắn, chọn câu đáp tự nhiên nhất.', '"～たいんですが" → đáp **～なら、～がいいですよ**; "どうすればいい？" → đáp **～ばいいよ**; "{重|おも}そう／{重|おも}すぎない？" → đề nghị giúp.'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nghe trong bài này',
      items: [
        'Thể ば nghe ra ở đuôi **～えば／～れば／～ければ**: {行|い}けば, {乗|の}れば, {安|やす}ければ, なければ. Nghe "なければ" → thường là **điều kiện bắt buộc** (không có thì không được).',
        '**～なら** đứng sau chính từ người kia vừa nói → câu sau là lời khuyên — thường là đáp án.',
        '**～すぎて** → câu sau là kết quả xấu (không mua, không ngủ được…). **～やすい／～にくい** → nhận xét đồ vật, đường đi.',
        'Bấm nghe 2 lần: lần 1 không nhìn lời, chỉ trả lời câu hỏi; lần 2 bật lời thoại + romaji để soát từng câu.',
      ],
    },

    /* ── 1 ── */
    { t: 'h', text: 'Bài 1 — 問題1 課題理解: gọi điện đặt phòng khách sạn' },
    NG('b17-ng-1', '{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか', 'Dạng 課題理解 — nghe câu hỏi, nghe hội thoại, chọn việc làm TRƯỚC TIÊN.', [
      ['ナレーター', 'ja-nu', 'ホテルの{人|ひと}と{男|おとこ}の{人|ひと}が{電話|でんわ}で{話|はな}しています。{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Hoteru no hito to otoko no hito ga denwa de hanashite imasu. Otoko no hito wa kono ato mazu nani o shimasu ka.', 'Nhân viên khách sạn và một người đàn ông đang nói chuyện điện thoại. Sau đây việc đầu tiên người đàn ông làm là gì?'],
      ['ホテルの{人|ひと}', 'ja-nu', 'お{電話|でんわ}ありがとうございます。さくらホテルでございます。', 'Odenwa arigatou gozaimasu. Sakura hoteru de gozaimasu.', 'Cảm ơn quý khách đã gọi. Khách sạn Sakura xin nghe.'],
      ['カルロス', 'ja-nam', 'もしもし、{来週|らいしゅう}の{土曜日|どようび}に{二人|ふたり}で{泊|と}まりたいんですが、{部屋|へや}は{空|あ}いていますか。', 'Moshimoshi, raishuu no doyoubi ni futari de tomaritai n desu ga, heya wa aite imasu ka.', 'A lô, tôi muốn ở hai người vào thứ Bảy tuần sau, còn phòng trống không ạ?'],
      ['ホテルの{人|ひと}', 'ja-nu', '{少々|しょうしょう}お{待|ま}ちください。……{申|もう}し{訳|わけ}ありません。{土曜日|どようび}は{満室|まんしつ}です。{金曜日|きんようび}なら、{空|あ}いていますが。', 'Shoushou omachi kudasai. …… Moushiwake arimasen. Doyoubi wa manshitsu desu. Kin\'youbi nara, aite imasu ga.', 'Xin quý khách chờ một chút. … Thành thật xin lỗi, thứ Bảy đã hết phòng. Nếu là thứ Sáu thì còn trống ạ.'],
      ['カルロス', 'ja-nam', '{金曜日|きんようび}ですか。{友達|ともだち}に{聞|き}かなければ、わかりません。', 'Kin\'youbi desu ka. Tomodachi ni kikanakereba, wakarimasen.', 'Thứ Sáu à. Tôi phải hỏi bạn mới biết được.'],
      ['ホテルの{人|ひと}', 'ja-nu', 'では、{今日|きょう}の{6時|ろくじ}までにお{電話|でんわ}をください。{6時|ろくじ}までなら、お{部屋|へや}は{大丈夫|だいじょうぶ}です。', 'Dewa, kyou no rokuji made ni odenwa o kudasai. Rokuji made nara, oheya wa daijoubu desu.', 'Vậy xin quý khách gọi lại trước 6 giờ hôm nay. Đến 6 giờ thì phòng vẫn còn ạ.'],
      ['カルロス', 'ja-nam', 'わかりました。あ、{駅|えき}からホテルまでバスはありますか。', 'Wakarimashita. A, eki kara hoteru made basu wa arimasu ka.', 'Tôi hiểu rồi. À, từ ga đến khách sạn có xe buýt không ạ?'],
      ['ホテルの{人|ひと}', 'ja-nu', 'はい。でも、{駅|えき}から{歩|ある}いて{5分|ごふん}ですから、バスに{乗|の}らなくても{大丈夫|だいじょうぶ}ですよ。', 'Hai. Demo, eki kara aruite gofun desu kara, basu ni noranakute mo daijoubu desu yo.', 'Có ạ. Nhưng từ ga đi bộ 5 phút thôi nên không đi xe buýt cũng được.'],
      ['カルロス', 'ja-nam', 'そうですか。じゃ、すぐ{友達|ともだち}にメールして、また{電話|でんわ}します。', 'Sou desu ka. Ja, sugu tomodachi ni meeru shite, mata denwa shimasu.', 'Vậy à. Vậy tôi nhắn cho bạn ngay rồi gọi lại.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Otoko no hito wa kono ato mazu nani o shimasu ka.', 'Sau đây việc đầu tiên người đàn ông làm là gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b17-ng-1-q',
      title: 'Bài 1 — chọn đáp án',
      items: [
        { q: '{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか。', options: ['ホテルにもう{一度|いちど}{電話|でんわ}する', '{友達|ともだち}にメールする', 'バスの{時間|じかん}を{調|しら}べる', '{土曜日|どようび}の{部屋|へや}を{予約|よやく}する'], correct: 1, why: 'Câu cuối: **すぐ{友達|ともだち}にメールして、また{電話|でんわ}します** — nhắn bạn TRƯỚC, gọi lại khách sạn SAU (bẫy ①). Thứ Bảy hết phòng (bẫy ④), không cần xe buýt (bẫy ③). 〔Sugu tomodachi ni meeru shite, mata denwa shimasu.〕' },
        { q: 'どうして{男|おとこ}の{人|ひと}はすぐ{予約|よやく}しませんでしたか。', options: ['ホテルが{高|たか}すぎるから', '{金曜日|きんようび}に{泊|と}まれるか、{友達|ともだち}に{聞|き}かなければわからないから', '{駅|えき}から{遠|とお}いから', 'バスがないから'], correct: 1, why: '**{友達|ともだち}に{聞|き}かなければ、わかりません** — thể ば phủ định: chưa hỏi bạn thì chưa biết. 〔Tomodachi ni kikanakereba, wakarimasen.〕' },
      ],
    },

    /* ── 2 ── */
    { t: 'h', text: 'Bài 2 — 問題1 課題理解: mua vé Shinkansen ở quầy ga' },
    NG('b17-ng-2', '{女|おんな}の{人|ひと}はどの{切符|きっぷ}を{買|か}いますか', 'Dạng 課題理解 — ba thông tin cùng lúc: giờ tàu, loại ghế, khứ hồi hay một chiều.', [
      ['ナレーター', 'ja-nu', '{駅|えき}の{窓口|まどぐち}で、{女|おんな}の{人|ひと}と{駅員|えきいん}が{話|はな}しています。{女|おんな}の{人|ひと}はどの{切符|きっぷ}を{買|か}いますか。', 'Eki no madoguchi de, onna no hito to ekiin ga hanashite imasu. Onna no hito wa dono kippu o kaimasu ka.', 'Ở quầy bán vé nhà ga, một người phụ nữ và nhân viên nhà ga đang nói chuyện. Người phụ nữ mua vé nào?'],
      ['メアリー', 'ja-nu', 'すみません、{明日|あした}の{朝|あさ}、{大阪|おおさか}まで{新幹線|しんかんせん}の{指定席|していせき}を{一枚|いちまい}お{願|ねが}いします。', 'Sumimasen, ashita no asa, Oosaka made shinkansen no shiteiseki o ichimai onegai shimasu.', 'Xin lỗi, cho tôi một vé ghế đặt trước Shinkansen đi Osaka sáng mai.'],
      ['{駅員|えきいん}', 'ja-nam', '{明日|あした}の{朝|あさ}ですね。……{9時|くじ}の{新幹線|しんかんせん}は、{指定席|していせき}がもういっぱいです。{10時|じゅうじ}なら、{通路側|つうろがわ}が{空|あ}いていますが。', 'Ashita no asa desu ne. …… Kuji no shinkansen wa, shiteiseki ga mou ippai desu. Juuji nara, tsuurogawa ga aite imasu ga.', 'Sáng mai nhỉ. … Chuyến 9 giờ ghế đặt trước đã kín rồi. Nếu chuyến 10 giờ thì còn ghế phía lối đi.'],
      ['メアリー', 'ja-nu', '{10時|じゅうじ}だと、{会議|かいぎ}に{間|ま}に{合|あ}わないんです。{9時|くじ}の{自由席|じゆうせき}はどうですか。', 'Juuji da to, kaigi ni maniawanai n desu. Kuji no jiyuuseki wa dou desu ka.', 'Chuyến 10 giờ thì tôi không kịp cuộc họp. Ghế tự do chuyến 9 giờ thì sao ạ?'],
      ['{駅員|えきいん}', 'ja-nam', '{自由席|じゆうせき}なら、{乗|の}れますよ。でも、{連休|れんきゅう}ですから、とても{混|こ}みますよ。', 'Jiyuuseki nara, noremasu yo. Demo, renkyuu desu kara, totemo komimasu yo.', 'Ghế tự do thì đi được. Nhưng đang kỳ nghỉ dài nên sẽ rất đông đấy.'],
      ['メアリー', 'ja-nu', '{立|た}っても{大丈夫|だいじょうぶ}です。じゃ、{9時|くじ}の{自由席|じゆうせき}で。{帰|かえ}りの{切符|きっぷ}も{一緒|いっしょ}に{買|か}えば、{安|やす}くなりますか。', 'Tatte mo daijoubu desu. Ja, kuji no jiyuuseki de. Kaeri no kippu mo issho ni kaeba, yasuku narimasu ka.', 'Đứng cũng không sao. Vậy ghế tự do chuyến 9 giờ. Nếu mua luôn vé về thì có rẻ hơn không ạ?'],
      ['{駅員|えきいん}', 'ja-nam', 'いいえ、{大阪|おおさか}までは、{往復|おうふく}で{買|か}っても{値段|ねだん}は{同|おな}じです。', 'Iie, Oosaka made wa, oufuku de katte mo nedan wa onaji desu.', 'Không ạ, đến Osaka thì mua khứ hồi giá cũng như nhau.'],
      ['メアリー', 'ja-nu', 'そうですか。じゃ、{帰|かえ}りの{日|ひ}はまだ{決|き}めていないので、{今日|きょう}は{片道|かたみち}だけお{願|ねが}いします。', 'Sou desu ka. Ja, kaeri no hi wa mada kimete inai node, kyou wa katamichi dake onegai shimasu.', 'Vậy à. Vậy vì tôi chưa quyết ngày về nên hôm nay cho tôi vé một chiều thôi.'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}はどの{切符|きっぷ}を{買|か}いますか。', 'Onna no hito wa dono kippu o kaimasu ka.', 'Người phụ nữ mua vé nào?'],
    ]),
    {
      t: 'mcq',
      id: 'b17-ng-2-q',
      title: 'Bài 2 — chọn đáp án',
      items: [
        { q: '{女|おんな}の{人|ひと}はどの{切符|きっぷ}を{買|か}いますか。', options: ['{9時|くじ}・{指定席|していせき}・{往復|おうふく}', '{10時|じゅうじ}・{指定席|していせき}・{片道|かたみち}', '{9時|くじ}・{自由席|じゆうせき}・{片道|かたみち}', '{9時|くじ}・{自由席|じゆうせき}・{往復|おうふく}'], correct: 2, why: 'Chuyến 9 giờ hết ghế đặt trước → chọn **{9時|くじ}の{自由席|じゆうせき}**; khứ hồi không rẻ hơn + chưa quyết ngày về → **{片道|かたみち}だけ**. 〔Kuji no jiyuuseki de. … Katamichi dake onegai shimasu.〕' },
        { q: 'どうして{10時|じゅうじ}の{新幹線|しんかんせん}に{乗|の}りませんか。', options: ['{通路側|つうろがわ}が{嫌|きら}いだから', '{会議|かいぎ}に{間|ま}に{合|あ}わないから', '{高|たか}すぎるから', 'もういっぱいだから'], correct: 1, why: '**{10時|じゅうじ}だと、{会議|かいぎ}に{間|ま}に{合|あ}わないんです** (～と ở đây = "nếu là" — ポイント 113 mở rộng). 〔Juuji da to, kaigi ni maniawanai n desu.〕' },
      ],
    },

    /* ── 3 ── */
    { t: 'h', text: 'Bài 3 — 問題2 ポイント理解: vì sao không đi Okinawa (có đổi ý)' },
    NG('b17-ng-3', '{男|おとこ}の{人|ひと}はどうして{沖縄|おきなわ}へ{行|い}きませんか', 'Dạng ポイント理解 — người nói đổi ý: 最初は～と思っていました → でも… Lấy ý SAU.', [
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}と{男|おとこ}の{人|ひと}が{話|はな}しています。{男|おとこ}の{人|ひと}はどうして{沖縄|おきなわ}へ{行|い}きませんか。', 'Onna no hito to otoko no hito ga hanashite imasu. Otoko no hito wa doushite Okinawa e ikimasen ka.', 'Một người phụ nữ và một người đàn ông đang nói chuyện. Vì sao người đàn ông không đi Okinawa?'],
      ['{木村|きむら}', 'ja-nu', 'ダニエルさん、{冬休|ふゆやす}みはどこへ{行|い}くんですか。', 'Danieru-san, fuyuyasumi wa doko e iku n desu ka.', 'Daniel, nghỉ đông anh đi đâu?'],
      ['ダニエル', 'ja-nam', '{最初|さいしょ}は{沖縄|おきなわ}へ{行|い}こうと{思|おも}っていました。{暖|あたた}かいし、{海|うみ}もきれいだし。', 'Saisho wa Okinawa e ikou to omotte imashita. Atatakai shi, umi mo kirei da shi.', 'Lúc đầu tôi định đi Okinawa. Vừa ấm, biển lại đẹp.'],
      ['{木村|きむら}', 'ja-nu', 'いいですね。', 'Ii desu ne.', 'Hay quá nhỉ.'],
      ['ダニエル', 'ja-nam', 'でも、{調|しら}べたら、{冬休|ふゆやす}みは{飛行機|ひこうき}が{高|たか}すぎて……。それで、{北海道|ほっかいどう}にしました。', 'Demo, shirabetara, fuyuyasumi wa hikouki ga takasugite……. Sorede, Hokkaidou ni shimashita.', 'Nhưng tra thử thì vé máy bay dịp nghỉ đông đắt quá… Nên tôi chọn Hokkaido.'],
      ['{木村|きむら}', 'ja-nu', '{北海道|ほっかいどう}も{高|たか}くないですか。', 'Hokkaidou mo takaku nai desu ka.', 'Hokkaido chẳng phải cũng đắt sao?'],
      ['ダニエル', 'ja-nam', '{夜行|やこう}バスとフェリーで{行|い}けば、{安|やす}いんです。{時間|じかん}はかかりますけど。それに、{北海道|ほっかいどう}ならスキーができますから。{僕|ぼく}の{国|くに}は{雪|ゆき}が{降|ふ}らないので、スキーは{初|はじ}めてなんです。それがいちばん{楽|たの}しみです。', 'Yakou basu to ferii de ikeba, yasui n desu. Jikan wa kakarimasu kedo. Sore ni, Hokkaidou nara sukii ga dekimasu kara. Boku no kuni wa yuki ga furanai node, sukii wa hajimete na n desu. Sore ga ichiban tanoshimi desu.', 'Đi xe buýt đêm và phà thì rẻ. Tuy mất thời gian. Hơn nữa, Hokkaido thì trượt tuyết được. Nước tôi không có tuyết nên đây là lần đầu trượt tuyết. Đó là điều tôi mong nhất.'],
      ['{木村|きむら}', 'ja-nu', 'スキーなら、ニセコがいいですよ。{雪|ゆき}が{軽|かる}くて、{滑|すべ}りやすいそうです。', 'Sukii nara, Niseko ga ii desu yo. Yuki ga karukute, suberiyasui sou desu.', 'Trượt tuyết thì Niseko hay đấy. Nghe nói tuyết nhẹ, dễ trượt.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}はどうして{沖縄|おきなわ}へ{行|い}きませんか。', 'Otoko no hito wa doushite Okinawa e ikimasen ka.', 'Vì sao người đàn ông không đi Okinawa?'],
    ]),
    {
      t: 'mcq',
      id: 'b17-ng-3-q',
      title: 'Bài 3 — chọn đáp án',
      items: [
        { q: '{男|おとこ}の{人|ひと}はどうして{沖縄|おきなわ}へ{行|い}きませんか。', options: ['{寒|さむ}いから', '{海|うみ}がきれいじゃないから', '{飛行機|ひこうき}が{高|たか}すぎるから', 'スキーができないから'], correct: 2, why: '**{飛行機|ひこうき}が{高|たか}すぎて……それで{北海道|ほっかいどう}にしました**. "{暖|あたた}かいし、{海|うみ}もきれいだし" là ưu điểm của Okinawa (bẫy). 〔Hikouki ga takasugite…….〕' },
        { q: '{男|おとこ}の{人|ひと}は{北海道|ほっかいどう}で{何|なに}がいちばん{楽|たの}しみですか。', options: ['フェリーに{乗|の}ること', '{初|はじ}めてスキーをすること', '{海|うみ}で{泳|およ}ぐこと', '{安|やす}いホテルに{泊|と}まること'], correct: 1, why: '**スキーは{初|はじ}めてなんです。それがいちばん{楽|たの}しみです**. 〔Sukii wa hajimete na n desu. Sore ga ichiban tanoshimi desu.〕' },
      ],
    },

    /* ── 4 ── */
    { t: 'h', text: 'Bài 4 — 問題2 ポイント理解: kể lại chuyến đi Kyoto' },
    NG('b17-ng-4', '{女|おんな}の{人|ひと}は{旅行|りょこう}で{何|なに}がいちばん{大変|たいへん}でしたか', 'Dạng ポイント理解 — nhiều điều vất vả được nhắc; chờ chữ "ずっと／いちばん".', [
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}が{話|はな}しています。{女|おんな}の{人|ひと}は{旅行|りょこう}で{何|なに}がいちばん{大変|たいへん}でしたか。', 'Otoko no hito to onna no hito ga hanashite imasu. Onna no hito wa ryokou de nani ga ichiban taihen deshita ka.', 'Một người đàn ông và một người phụ nữ đang nói chuyện. Trong chuyến đi, điều gì vất vả nhất với người phụ nữ?'],
      ['{西川|にしかわ}', 'ja-nam', 'リンさん、{京都|きょうと}{旅行|りょこう}、どうでしたか。', 'Rin-san, Kyouto ryokou, dou deshita ka.', 'Lin, chuyến đi Kyoto thế nào?'],
      ['リン', 'ja-nu', 'とても{楽|たの}しかったです。お{寺|てら}もきれいだったし、{料理|りょうり}もおいしかったし。', 'Totemo tanoshikatta desu. Otera mo kirei datta shi, ryouri mo oishikatta shi.', 'Vui lắm ạ. Chùa thì đẹp, đồ ăn lại ngon.'],
      ['{西川|にしかわ}', 'ja-nam', 'ホテルはどうでしたか。', 'Hoteru wa dou deshita ka.', 'Khách sạn thì sao?'],
      ['リン', 'ja-nu', '{部屋|へや}はちょっと{狭|せま}かったですが、{駅|えき}から{近|ちか}くて{便利|べんり}でした。', 'Heya wa chotto semakatta desu ga, eki kara chikakute benri deshita.', 'Phòng hơi chật nhưng gần ga nên tiện ạ.'],
      ['{西川|にしかわ}', 'ja-nam', 'よかったですね。{何|なに}か{大変|たいへん}なことはありましたか。', 'Yokatta desu ne. Nanika taihen na koto wa arimashita ka.', 'Tốt quá. Có chuyện gì vất vả không?'],
      ['リン', 'ja-nu', '{着物|きもの}の{体験|たいけん}をしたんですが、{着物|きもの}で{歩|ある}くのが{本当|ほんとう}に{大変|たいへん}でした。{歩|ある}きにくいし、{暑|あつ}いし……。', 'Kimono no taiken o shita n desu ga, kimono de aruku no ga hontou ni taihen deshita. Arukinikui shi, atsui shi…….', 'Tôi trải nghiệm mặc kimono, đi bộ bằng kimono vất vả thật sự. Vừa khó đi, vừa nóng…'],
      ['{西川|にしかわ}', 'ja-nam', 'ああ、{着物|きもの}は{歩|ある}きにくいですよね。', 'Aa, kimono wa arukinikui desu yo ne.', 'À, kimono khó đi thật nhỉ.'],
      ['リン', 'ja-nu', 'それに、{写真|しゃしん}を{撮|と}りすぎて、スマホの{電池|でんち}がすぐなくなりました。でも、{着物|きもの}のほうがずっと{大変|たいへん}でした。', 'Sore ni, shashin o torisugite, sumaho no denchi ga sugu naku narimashita. Demo, kimono no hou ga zutto taihen deshita.', 'Thêm nữa, chụp ảnh nhiều quá nên điện thoại hết pin nhanh. Nhưng kimono vất vả hơn nhiều.'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}は{旅行|りょこう}で{何|なに}がいちばん{大変|たいへん}でしたか。', 'Onna no hito wa ryokou de nani ga ichiban taihen deshita ka.', 'Trong chuyến đi, điều gì vất vả nhất với người phụ nữ?'],
    ]),
    {
      t: 'mcq',
      id: 'b17-ng-4-q',
      title: 'Bài 4 — chọn đáp án',
      items: [
        { q: '{女|おんな}の{人|ひと}は{旅行|りょこう}で{何|なに}がいちばん{大変|たいへん}でしたか。', options: ['ホテルの{部屋|へや}が{狭|せま}かったこと', '{着物|きもの}で{歩|ある}いたこと', 'スマホの{電池|でんち}がなくなったこと', '{料理|りょうり}が{多|おお}すぎたこと'], correct: 1, why: '**{着物|きもの}のほうがずっと{大変|たいへん}でした** — so sánh trực tiếp với việc hết pin. Phòng chật thì bù lại "tiện" (bẫy ①). 〔Kimono no hou ga zutto taihen deshita.〕' },
        { q: 'ホテルはどうでしたか。', options: ['{広|ひろ}くて{便利|べんり}でした', '{狭|せま}かったですが、{駅|えき}から{近|ちか}くて{便利|べんり}でした', '{駅|えき}から{遠|とお}すぎました', '{高|たか}すぎました'], correct: 1, why: '**{部屋|へや}はちょっと{狭|せま}かったですが、{駅|えき}から{近|ちか}くて{便利|べんり}でした**. 〔Heya wa chotto semakatta desu ga, eki kara chikakute benri deshita.〕' },
      ],
    },

    /* ── 5 ── */
    { t: 'h', text: 'Bài 5 — 問題3 発話表現: nói gì trong tình huống (3 câu)' },
    {
      t: 'p',
      text: 'Đề thật có tranh và mũi tên chỉ người nói. Ở đây tình huống được đọc thành lời. Nghe tình huống + 3 câu nói, chọn câu đúng nhất.',
    },
    NG('b17-ng-5', '{何|なん}と{言|い}いますか（3{問|もん}）', 'Dạng 発話表現 — xác định người nghe (trên / ngang hàng) và việc muốn làm (hỏi đường, khuyên, từ chối).', [
      ['ナレーター', 'ja-nu', '{1番|いちばん}。{駅|えき}で{空港|くうこう}への{行|い}き{方|かた}がわかりません。{駅員|えきいん}に{聞|き}きます。{何|なん}と{言|い}いますか。', 'Ichiban. Eki de kuukou e no ikikata ga wakarimasen. Ekiin ni kikimasu. Nan to iimasu ka.', 'Câu 1. Ở ga bạn không biết cách đi đến sân bay. Bạn hỏi nhân viên nhà ga. Bạn nói gì?'],
      ['ワン', 'ja-nu', '1、{空港|くうこう}へ{行|い}くなら、{電車|でんしゃ}がいいですよ。 2、{空港|くうこう}へはどう{行|い}けばいいですか。 3、{空港|くうこう}へ{行|い}きすぎました。', 'Ichi, kuukou e iku nara, densha ga ii desu yo. Ni, kuukou e wa dou ikeba ii desu ka. San, kuukou e ikisugimashita.', '1. Nếu đi sân bay thì đi tàu tốt đấy. 2. Đến sân bay thì đi thế nào ạ? 3. Tôi đã đi sân bay quá nhiều.'],
      ['ナレーター', 'ja-nu', '{2番|にばん}。{友達|ともだち}が「{温泉|おんせん}に{行|い}きたい」と{言|い}っています。いい{温泉|おんせん}を{教|おし}えたいです。{何|なん}と{言|い}いますか。', 'Niban. Tomodachi ga "onsen ni ikitai" to itte imasu. Ii onsen o oshietai desu. Nan to iimasu ka.', 'Câu 2. Bạn bạn nói "muốn đi suối nước nóng". Bạn muốn chỉ một suối nước nóng hay. Bạn nói gì?'],
      ['アンナ', 'ja-nu', '1、{温泉|おんせん}なら、{箱根|はこね}がいいよ。 2、{温泉|おんせん}に{行|い}けば、いい？ 3、{温泉|おんせん}は{入|はい}りにくいよ。', 'Ichi, onsen nara, Hakone ga ii yo. Ni, onsen ni ikeba, ii? San, onsen wa hairinikui yo.', '1. Suối nước nóng thì Hakone hay đấy. 2. Đi suối nước nóng là được à? 3. Suối nước nóng khó vào lắm.'],
      ['ナレーター', 'ja-nu', '{3番|さんばん}。お{店|みせ}の{人|ひと}がかばんを{見|み}せました。でも、{予算|よさん}より{高|たか}いです。{何|なん}と{言|い}いますか。', 'Sanban. Omise no hito ga kaban o misemashita. Demo, yosan yori takai desu. Nan to iimasu ka.', 'Câu 3. Nhân viên cửa hàng cho bạn xem một cái túi. Nhưng nó đắt hơn ngân sách. Bạn nói gì?'],
      ['パク', 'ja-nu', '1、ちょっと{高|たか}すぎます。 2、{高|たか}ければ{買|か}います。 3、{高|たか}いし、{買|か}いましょう。', 'Ichi, chotto takasugimasu. Ni, takakereba kaimasu. San, takai shi, kaimashou.', '1. Hơi đắt quá ạ. 2. Nếu đắt thì tôi mua. 3. Vừa đắt nữa, mua thôi.'],
    ]),
    {
      t: 'mcq',
      id: 'b17-ng-5-q',
      title: 'Bài 5 — chọn câu nói đúng',
      items: [
        { q: '{1番|いちばん} — {駅員|えきいん}に{空港|くうこう}への{行|い}き{方|かた}を{聞|き}きたい。', options: ['1', '2', '3'], correct: 1, why: 'Hỏi chỉ dẫn → **どう{行|い}けばいいですか**. Câu 1 là lời KHUYÊN (vai nhân viên); câu 3 vô nghĩa. 〔Kuukou e wa dou ikeba ii desu ka.〕' },
        { q: '{2番|にばん} — {友達|ともだち}にいい{温泉|おんせん}を{教|おし}えたい。', options: ['1', '2', '3'], correct: 0, why: 'Nhận lời bạn rồi khuyên → **{温泉|おんせん}なら、{箱根|はこね}がいいよ**. 〔Onsen nara, Hakone ga ii yo.〕' },
        { q: '{3番|さんばん} — {予算|よさん}より{高|たか}いかばんを{断|ことわ}りたい。', options: ['1', '2', '3'], correct: 0, why: 'Từ chối khéo → **ちょっと{高|たか}すぎます**. Câu 2, 3 ngược ý. 〔Chotto takasugimasu.〕' },
      ],
    },

    /* ── 6 ── */
    { t: 'h', text: 'Bài 6 — 問題4 即時応答: đáp ngay (5 câu)' },
    NG('b17-ng-6', '{正|ただ}しい{返事|へんじ}を{選|えら}んでください（5{問|もん}）', 'Dạng 即時応答 — không có câu hỏi in sẵn: nghe 1 câu, chọn 1 trong 3 câu đáp.', [
      ['ナレーター', 'ja-nu', '{1番|いちばん}。', 'Ichiban.', 'Câu 1.'],
      ['メアリー', 'ja-nu', '{京都|きょうと}へ{行|い}きたいんですが、いつがいいですか。', 'Kyouto e ikitai n desu ga, itsu ga ii desu ka.', 'Tôi muốn đi Kyoto, khi nào thì đẹp ạ?'],
      ['{西川|にしかわ}', 'ja-nam', '1、{京都|きょうと}なら、{秋|あき}がいいですよ。 2、{京都|きょうと}へ{行|い}けば、いいですよ。 3、{京都|きょうと}は{行|い}きにくいですよ。', 'Ichi, Kyouto nara, aki ga ii desu yo. Ni, Kyouto e ikeba, ii desu yo. San, Kyouto wa ikinikui desu yo.', '1. Kyoto thì mùa thu đẹp đấy. 2. Cứ đi Kyoto là được. 3. Kyoto khó đi lắm.'],
      ['ナレーター', 'ja-nu', '{2番|にばん}。', 'Niban.', 'Câu 2.'],
      ['カルロス', 'ja-nam', 'この{荷物|にもつ}、{重|おも}すぎるよ……。', 'Kono nimotsu, omosugiru yo…….', 'Hành lý này nặng quá trời…'],
      ['リン', 'ja-nu', '1、じゃ、{半分|はんぶん}{持|も}とうか。 2、うん、{軽|かる}すぎるね。 3、{重|おも}ければ、{持|も}ってね。', 'Ichi, ja, hanbun motou ka. Ni, un, karusugiru ne. San, omokereba, motte ne.', '1. Vậy để mình xách một nửa nhé? 2. Ừ, nhẹ quá nhỉ. 3. Nếu nặng thì cậu xách nhé.'],
      ['ナレーター', 'ja-nu', '{3番|さんばん}。', 'Sanban.', 'Câu 3.'],
      ['アンナ', 'ja-nu', '{切符|きっぷ}はどこで{買|か}えばいいですか。', 'Kippu wa doko de kaeba ii desu ka.', 'Vé mua ở đâu thì được ạ?'],
      ['{駅員|えきいん}', 'ja-nam', '1、あそこの{機械|きかい}で{買|か}えますよ。 2、{切符|きっぷ}なら、{安|やす}いですよ。 3、{切符|きっぷ}を{買|か}いすぎましたね。', 'Ichi, asoko no kikai de kaemasu yo. Ni, kippu nara, yasui desu yo. San, kippu o kaisugimashita ne.', '1. Mua được ở cái máy đằng kia. 2. Vé thì rẻ lắm. 3. Bạn mua quá nhiều vé rồi.'],
      ['ナレーター', 'ja-nu', '{4番|よんばん}。', 'Yonban.', 'Câu 4.'],
      ['ナタポン', 'ja-nam', 'このホテル、どう？ {駅|えき}からも{近|ちか}いし、{安|やす}いし。', 'Kono hoteru, dou? Eki kara mo chikai shi, yasui shi.', 'Khách sạn này sao? Vừa gần ga, vừa rẻ.'],
      ['パク', 'ja-nu', '1、うん、{近|ちか}すぎて{不便|ふべん}だね。 2、いいね。そこにしよう。 3、{安|やす}ければ、{高|たか}いよ。', 'Ichi, un, chikasugite fuben da ne. Ni, ii ne. Soko ni shiyou. San, yasukereba, takai yo.', '1. Ừ, gần quá nên bất tiện nhỉ. 2. Được đấy. Chọn chỗ đó đi. 3. Nếu rẻ thì đắt đấy.'],
      ['ナレーター', 'ja-nu', '{5番|ごばん}。', 'Goban.', 'Câu 5.'],
      ['ダニエル', 'ja-nam', 'この{地図|ちず}、{字|じ}が{小|ちい}さくて{見|み}にくいですね。', 'Kono chizu, ji ga chiisakute minikui desu ne.', 'Bản đồ này chữ nhỏ, khó nhìn nhỉ.'],
      ['ワン', 'ja-nu', '1、じゃ、こっちの{大|おお}きい{地図|ちず}を{使|つか}いましょう。 2、ええ、{見|み}やすいですね。 3、はい、{字|じ}が{大|おお}きすぎます。', 'Ichi, ja, kotchi no ookii chizu o tsukaimashou. Ni, ee, miyasui desu ne. San, hai, ji ga ookisugimasu.', '1. Vậy mình dùng tấm bản đồ to bên này đi. 2. Vâng, dễ nhìn nhỉ. 3. Vâng, chữ to quá.'],
    ]),
    {
      t: 'mcq',
      id: 'b17-ng-6-q',
      title: 'Bài 6 — chọn câu đáp đúng',
      items: [
        { q: '{1番|いちばん} — 「{京都|きょうと}へ{行|い}きたいんですが、いつがいいですか。」', options: ['1', '2', '3'], correct: 0, why: 'Câu "～たいんですが" → đáp bằng **{京都|きょうと}なら、{秋|あき}がいいですよ**. 〔Kyouto nara, aki ga ii desu yo.〕' },
        { q: '{2番|にばん} — 「この{荷物|にもつ}、{重|おも}すぎるよ……。」', options: ['1', '2', '3'], correct: 0, why: 'Bạn kêu nặng → đề nghị giúp thân mật: **じゃ、{半分|はんぶん}{持|も}とうか** (thể ý chí + か, Bài 16). 〔Ja, hanbun motou ka.〕' },
        { q: '{3番|さんばん} — 「{切符|きっぷ}はどこで{買|か}えばいいですか。」', options: ['1', '2', '3'], correct: 0, why: 'Hỏi chỉ dẫn → chỉ chỗ: **あそこの{機械|きかい}で{買|か}えますよ**. 〔Asoko no kikai de kaemasu yo.〕' },
        { q: '{4番|よんばん} — 「このホテル、どう？ {駅|えき}からも{近|ちか}いし、{安|やす}いし。」', options: ['1', '2', '3'], correct: 1, why: 'Bạn nêu hai ưu điểm bằng し → đồng ý: **いいね。そこにしよう**. 〔Ii ne. Soko ni shiyou.〕' },
        { q: '{5番|ごばん} — 「この{地図|ちず}、{字|じ}が{小|ちい}さくて{見|み}にくいですね。」', options: ['1', '2', '3'], correct: 0, why: 'Bản đồ khó nhìn → đưa giải pháp: **こっちの{大|おお}きい{地図|ちず}を{使|つか}いましょう**. 2 và 3 ngược ý. 〔Kotchi no ookii chizu o tsukaimashou.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 6. ĐỌC HIỂU ═══════════════════════════ */

const DOC: Lesson = {
  id: 'b17-doc',
  kind: 'reading',
  title: 'Đọc hiểu N4 — email của nhà trọ, bài viết "Lần đầu đi du lịch một mình", tờ quảng cáo tour (情報検索)',
  goal: 'Đọc email xác nhận đặt phòng để biết việc phải làm và hạn chót; đọc bài viết ~450 chữ kể chuyến đi một mình để nắm lý do, diễn biến và ý chính người viết muốn nói; tra tờ quảng cáo 3 tour trong ngày để chọn đúng tour và tính đúng tiền theo điều kiện cho sẵn.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Phần đọc (読解) đề JLPT N4',
      head: ['Mondai', 'Dạng', 'Độ dài', 'Bài này luyện'],
      rows: [
        ['問題4', '内容理解（短文）', '~100–200 chữ: email, thông báo, ghi chú', 'Bài 1 — email xác nhận của nhà trọ'],
        ['問題5', '内容理解（中文）', '~350–450 chữ: bài viết, nhật ký', 'Bài 2 — 「はじめての{一人旅|ひとりたび}」'],
        ['問題6', '情報検索', '~400 chữ: bảng, tờ quảng cáo, lịch', 'Bài 3 — tờ quảng cáo 3 tour xe buýt trong ngày'],
      ],
    },
    {
      t: 'note',
      title: 'Chiến thuật đọc',
      items: [
        '**Đọc câu hỏi trước**, gạch chân từ khoá (まず・どうして・いくら・{何時|なんじ}までに), rồi mới đọc bài để tìm.',
        'Email/thông báo: việc phải làm nằm sau **～てください**; hạn chót ở **～までに**; điều kiện ở **～ば／～たら／～なら**; điều KHÔNG được ở **～だけ／～しか～ない**.',
        'Câu **～なければ、～にします** = "nếu không … thì (bên kia tự) chọn …" — đề rất hay hỏi chỗ này.',
        '情報検索: lập **bảng điều kiện** của người trong câu hỏi (ngày đi được, tiền, có đi bộ được không, giờ về…) rồi **loại** từng tour. Đừng quên dòng **※** ở cuối (giảm giá, phí huỷ).',
      ],
    },

    /* ── Bài 1 ── */
    { t: 'h', text: 'Bài 1 — 内容理解（短文）: email xác nhận của nhà trọ' },
    {
      t: 'passage',
      title: '{件名|けんめい}：ご{予約|よやく}の{確認|かくにん}（みずうみ{荘|そう}）',
      intro: 'ワン đặt phòng cho bố mẹ ở một nhà trọ cạnh hồ. Hôm sau cô nhận được email này. Đọc rồi trả lời câu hỏi.',
      paras: [
        { text: 'ワン{様|さま}' },
        { text: '{湖|みずうみ}の{宿|やど}「みずうみ{荘|そう}」です。ご{予約|よやく}、ありがとうございます。{11月|じゅういちがつ}{15日|じゅうごにち}（{土|ど}）、{1泊|いっぱく}、{和室|わしつ}、3{名様|めいさま}のご{予約|よやく}を{確認|かくにん}しました。' },
        { text: 'チェックインは{午後|ごご}{3時|さんじ}からです。{駅|えき}から{旅館|りょかん}まで、{無料|むりょう}のバスがあります。{駅|えき}に{着|つ}いたら、{旅館|りょかん}に{電話|でんわ}してください。{10分|じゅっぷん}ぐらいで{迎|むか}えに{行|い}きます。' },
        { text: '{夕食|ゆうしょく}は{6時|ろくじ}か{7時|しちじ}です。どちらがいいか、{11月|じゅういちがつ}{10日|とおか}までにメールでお{返事|へんじ}ください。お{返事|へんじ}がなければ、{7時|しちじ}にします。' },
        { text: 'お{部屋|へや}から{湖|みずうみ}が{見|み}えますが、{11月|じゅういちがつ}は{夜|よる}とても{寒|さむ}くなりますので、{暖|あたた}かい{服|ふく}を{持|も}ってきてください。お{支払|しはら}いはカードも{使|つか}えますが、{旅館|りょかん}の{中|なか}の{売店|ばいてん}は{現金|げんきん}だけです。' },
        { text: 'みずうみ{荘|そう}' },
      ],
    },
    {
      t: 'mcq',
      id: 'b17-doc-1',
      title: 'Bài 1 — câu hỏi',
      items: [
        { q: 'ワンさんはまず{何|なに}をしなければなりませんか。', options: ['{駅|えき}に{着|つ}いたら、{旅館|りょかん}に{電話|でんわ}する', '{11月|じゅういちがつ}{10日|とおか}までに、{夕食|ゆうしょく}の{時間|じかん}をメールで{知|し}らせる', '{売店|ばいてん}で{使|つか}う{現金|げんきん}を{両替|りょうがえ}する', '{旅館|りょかん}に{行|い}く{前|まえ}に、{暖|あたた}かい{服|ふく}を{買|か}う'], correct: 1, why: 'Việc có **hạn chót sớm nhất**: **{11月|じゅういちがつ}{10日|とおか}までにメールでお{返事|へんじ}ください**. Gọi điện là việc ngày 15 (khi tới ga). 〔Juuichigatsu tooka made ni meeru de ohenji kudasai.〕' },
        { q: 'メールの{内容|ないよう}と{合|あ}っているのはどれですか。', options: ['{返事|へんじ}をしなければ、{夕食|ゆうしょく}は{7時|しちじ}になる。', '{売店|ばいてん}ではカードが{使|つか}える。', '{駅|えき}から{旅館|りょかん}まで{歩|ある}いて{行|い}く。', 'チェックインは{夕方|ゆうがた}{6時|ろくじ}からだ。'], correct: 0, why: '**お{返事|へんじ}がなければ、{7時|しちじ}にします** (thể ば phủ định). Cửa hàng chỉ nhận tiền mặt; có xe buýt miễn phí; nhận phòng từ 3 giờ. 〔Ohenji ga nakereba, shichiji ni shimasu.〕' },
        { q: '「{迎|むか}えに{行|い}きます」— ai đi đón ai?', options: ['ワン đi đón bố mẹ ở sân bay', 'Nhà trọ đi đón khách ở ga (bằng xe buýt miễn phí)', 'Bố mẹ ワン đi đón ワン', 'Nhân viên đi đón khách ở hồ'], correct: 1, why: 'Câu trước: **{駅|えき}に{着|つ}いたら、{旅館|りょかん}に{電話|でんわ}してください** → nhà trọ **lái xe ra ga đón**. 〔Juppun gurai de mukae ni ikimasu.〕' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('ご{予約|よやく}、ありがとうございます。', 'Goyoyaku, arigatou gozaimasu.', 'Cảm ơn quý khách đã đặt chỗ.'),
        E('{駅|えき}に{着|つ}いたら、{旅館|りょかん}に{電話|でんわ}してください。', 'Eki ni tsuitara, ryokan ni denwa shite kudasai.', 'Tới ga thì gọi điện cho nhà trọ. (hành động + nhờ → たら, không phải ば)'),
        E('お{返事|へんじ}がなければ、{7時|しちじ}にします。', 'Ohenji ga nakereba, shichiji ni shimasu.', 'Nếu không có hồi âm, chúng tôi chọn 7 giờ.'),
        E('{売店|ばいてん}は{現金|げんきん}だけです。', 'Baiten wa genkin dake desu.', 'Quầy bán hàng chỉ nhận tiền mặt.'),
      ],
    },

    /* ── Bài 2 ── */
    { t: 'h', text: 'Bài 2 — 内容理解（中文）: 「はじめての一人旅」 (khoảng 450 chữ)' },
    {
      t: 'passage',
      title: 'はじめての{一人旅|ひとりたび}　—　パク',
      intro: 'Bài viết của パク trên trang báo tường của lớp. Đọc rồi trả lời câu hỏi.',
      paras: [
        { label: '1', text: '{私|わたし}は{先月|せんげつ}、{初|はじ}めて{一人|ひとり}で{旅行|りょこう}しました。{行|い}った{所|ところ}は{広島|ひろしま}と{宮島|みやじま}です。{本当|ほんとう}は{友達|ともだち}と{二人|ふたり}で{行|い}く{予定|よてい}でしたが、{友達|ともだち}が{急|きゅう}に{行|い}けなくなりました。でも、{新幹線|しんかんせん}のチケットはもう{買|か}っていたし、ホテルも{予約|よやく}していたし、{一人|ひとり}で{行|い}きました。' },
        { label: '2', text: '{出発|しゅっぱつ}する{前|まえ}は、とても{不安|ふあん}でした。{日本語|にほんご}もまだ{上手|じょうず}じゃないし、{私|わたし}は{道|みち}に{迷|まよ}いやすいし……。でも、{広島駅|ひろしまえき}に{着|つ}くと、{駅|えき}の{中|なか}に{観光案内所|かんこうあんないじょ}がありました。{案内所|あんないじょ}の{人|ひと}は{韓国語|かんこくご}も{話|はな}せて、{地図|ちず}をくれました。その{地図|ちず}は{絵|え}が{多|おお}くてとてもわかりやすかったので、{一日中|いちにちじゅう}{使|つか}いました。' },
        { label: '3', text: '{一日目|いちにちめ}は{平和公園|へいわこうえん}と{博物館|はくぶつかん}を{見|み}て、{広島|ひろしま}の{名物|めいぶつ}のお{好|この}み{焼|や}きを{食|た}べました。でも、{歩|ある}きすぎて、{夜|よる}は{足|あし}がとても{痛|いた}くなりました。{二日目|ふつかめ}は、{港|みなと}から{船|ふね}で{宮島|みやじま}へ{行|い}きました。{島|しま}には{鹿|しか}がたくさんいて、{海|うみ}の{中|なか}に{立|た}っている{大|おお}きい{鳥居|とりい}は{本当|ほんとう}に{美|うつく}しかったです。' },
        { label: '4', text: '{一人旅|ひとりたび}のいいところは、{自分|じぶん}の{好|す}きな{時間|じかん}に、{好|す}きな{所|ところ}へ{行|い}けることです。{疲|つか}れたらすぐ{休|やす}めるし、{入|はい}りたい{店|みせ}にゆっくり{入|はい}れるし。もちろん、{困|こま}ることもあります。{食事|しょくじ}のとき、{話|はな}す{人|ひと}がいないので、{少|すこ}し{寂|さび}しかったです。' },
        { label: '5', text: '{一人|ひとり}で{旅行|りょこう}するのが{不安|ふあん}なら、まず{近|ちか}い{所|ところ}へ{日帰|ひがえ}りで{行|い}けばいいと{思|おも}います。それができれば、{次|つぎ}は{自信|じしん}を{持|も}って{遠|とお}くへ{行|い}けます。{私|わたし}も{次|つぎ}の{連休|れんきゅう}には、{北海道|ほっかいどう}へ{一人|ひとり}で{行|い}こうと{思|おも}っています。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b17-doc-2',
      title: 'Bài 2 — câu hỏi',
      items: [
        { q: 'パクさんはどうして{一人|ひとり}で{旅行|りょこう}しましたか。', options: ['{一人旅|ひとりたび}が{好|す}きだから', '{友達|ともだち}が{行|い}けなくなったけど、チケットもホテルももう{予約|よやく}していたから', '{友達|ともだち}と{行|い}くとお{金|かね}が{足|た}りないから', '{一人|ひとり}なら{割引|わりびき}があるから'], correct: 1, why: 'Đoạn 1: {友達|ともだち}が{急|きゅう}に{行|い}けなくなりました。でも、チケットはもう{買|か}っていた**し**、ホテルも{予約|よやく}していた**し** — hai lý do nối bằng し. 〔Chiketto wa mou katte ita shi, hoteru mo yoyaku shite ita shi.〕' },
        { q: '{出発|しゅっぱつ}する{前|まえ}、パクさんはどうして{不安|ふあん}でしたか。', options: ['{広島|ひろしま}が{遠|とお}すぎるから', '{日本語|にほんご}がまだ{上手|じょうず}じゃないし、{道|みち}に{迷|まよ}いやすいから', '{案内所|あんないじょ}がないから', '{船|ふね}が{怖|こわ}いから'], correct: 1, why: 'Đoạn 2: **{日本語|にほんご}もまだ{上手|じょうず}じゃないし、{道|みち}に{迷|まよ}いやすいし**. 〔Nihongo mo mada jouzu ja nai shi, michi ni mayoiyasui shi.〕' },
        { q: '{一日目|いちにちめ}の{夜|よる}、どうなりましたか。', options: ['お{好|この}み{焼|や}きを{食|た}べすぎて、おなかが{痛|いた}くなった', '{歩|ある}きすぎて、{足|あし}が{痛|いた}くなった', '{道|みち}に{迷|まよ}って、ホテルに{帰|かえ}れなかった', '{地図|ちず}がわかりにくくて{困|こま}った'], correct: 1, why: 'Đoạn 3: **{歩|ある}きすぎて、{夜|よる}は{足|あし}がとても{痛|いた}くなりました**. Bản đồ thì **dễ hiểu** (bẫy ④). 〔Arukisugite, yoru wa ashi ga totemo itaku narimashita.〕' },
        { q: 'パクさんがこの{文章|ぶんしょう}でいちばん{言|い}いたいことは{何|なん}ですか。', options: ['{一人旅|ひとりたび}は{寂|さび}しいから、{友達|ともだち}と{行|い}ったほうがいい。', '{一人|ひとり}で{行|い}くのが{不安|ふあん}なら、まず{近|ちか}い{所|ところ}へ{日帰|ひがえ}りで{行|い}けばいい。', '{広島|ひろしま}より{北海道|ほっかいどう}のほうがいい。', '{旅行|りょこう}のときは{観光案内所|かんこうあんないじょ}に{行|い}かなければならない。'], correct: 1, why: 'Đoạn cuối là lời khuyên — ý chính: **{不安|ふあん}なら、まず{近|ちか}い{所|ところ}へ{日帰|ひがえ}りで{行|い}けばいい** (なら + ばいい: hai mẫu của bài). Việc "hơi cô đơn" chỉ là một chi tiết. 〔Fuan nara, mazu chikai tokoro e higaeri de ikeba ii to omoimasu.〕' },
      ],
    },
    {
      t: 'note',
      title: 'Từ và mẫu đáng chú ý trong bài 2',
      items: [
        '**{一人旅|ひとりたび}** (hitoritabi) = đi du lịch một mình · **{旅|たび}** = chuyến đi (văn viết, nhiều cảm xúc hơn {旅行|りょこう}).',
        '**{急|きゅう}に{行|い}けなくなりました** — {急|きゅう}に = đột ngột; {行|い}けない (thể khả năng phủ định) + なくなる = "trở thành không đi được" (ôn ポイント 95).',
        '**{着|つ}くと、～がありました** — ～と + phát hiện (đến nơi thì thấy…) — giống ～たら ở ポイント 120.',
        '**{一日目|いちにちめ}／{二日目|ふつかめ}** = ngày thứ nhất / ngày thứ hai (～{目|め} = thứ …).',
        '**{寂|さび}しい** (sabishii) = cô đơn, buồn vì một mình. **{自信|じしん}を{持|も}って** = một cách tự tin (từ Bài 16).',
        '**{鳥居|とりい}** = cổng đền Thần đạo; cổng đứng giữa biển ở {宮島|みやじま} là {世界遺産|せかいいさん}.',
      ],
    },
    {
      t: 'examples',
      items: [
        E('チケットはもう{買|か}っていたし、ホテルも{予約|よやく}していたし、{一人|ひとり}で{行|い}きました。', 'Chiketto wa mou katte ita shi, hoteru mo yoyaku shite ita shi, hitori de ikimashita.', 'Vé thì đã mua, khách sạn cũng đã đặt, nên tôi đi một mình.'),
        E('その{地図|ちず}は{絵|え}が{多|おお}くてとてもわかりやすかったです。', 'Sono chizu wa e ga ookute totemo wakariyasukatta desu.', 'Tấm bản đồ đó nhiều hình nên rất dễ hiểu.'),
        E('{歩|ある}きすぎて、{夜|よる}は{足|あし}がとても{痛|いた}くなりました。', 'Arukisugite, yoru wa ashi ga totemo itaku narimashita.', 'Đi bộ quá nhiều nên tối đau chân lắm.'),
        E('{疲|つか}れたらすぐ{休|やす}めるし、{入|はい}りたい{店|みせ}にゆっくり{入|はい}れるし。', 'Tsukaretara sugu yasumeru shi, hairitai mise ni yukkuri haireru shi.', 'Mệt thì nghỉ được ngay, quán muốn vào thì cứ thong thả vào.'),
        E('{不安|ふあん}なら、まず{近|ちか}い{所|ところ}へ{日帰|ひがえ}りで{行|い}けばいいと{思|おも}います。', 'Fuan nara, mazu chikai tokoro e higaeri de ikeba ii to omoimasu.', 'Nếu lo thì tôi nghĩ trước hết cứ đi về trong ngày ở nơi gần là được.'),
      ],
    },

    /* ── Bài 3 ── */
    { t: 'h', text: 'Bài 3 — 情報検索: tờ quảng cáo 3 tour xe buýt trong ngày' },
    {
      t: 'passage',
      title: 'さくら{旅行|りょこう}　{秋|あき}の{日帰|ひがえ}りバスツアー',
      intro: 'Tờ quảng cáo dán ở quầy công ty du lịch. Đọc rồi trả lời câu hỏi.',
      paras: [
        { label: 'A', text: '【{箱根|はこね}　{温泉|おんせん}と{湖|みずうみ}コース】　{出発|しゅっぱつ}：{毎週|まいしゅう}{土曜日|どようび}・{日曜日|にちようび}　{朝|あさ}{8時|はちじ}　{新宿駅|しんじゅくえき}{西口|にしぐち}　／　{帰|かえ}り：{夜|よる}{7時|しちじ}　／　{料金|りょうきん}：9,800{円|えん}（{昼|ひる}ご{飯|はん}{付|つ}き）。{温泉|おんせん}に{入|はい}れます。{湖|みずうみ}で{船|ふね}に{乗|の}ります。{歩|ある}く{時間|じかん}は{少|すこ}しだけです。' },
        { label: 'B', text: '【{日光|にっこう}　{世界遺産|せかいいさん}コース】　{出発|しゅっぱつ}：{毎週|まいしゅう}{土曜日|どようび}　{朝|あさ}{7時半|しちじはん}　{東京駅|とうきょうえき}　／　{帰|かえ}り：{夜|よる}{8時|はちじ}　／　{料金|りょうきん}：7,500{円|えん}（{昼|ひる}ご{飯|はん}なし）。{世界遺産|せかいいさん}のお{寺|てら}と{神社|じんじゃ}を{見物|けんぶつ}します。{山道|やまみち}を{2時間|にじかん}ぐらい{歩|ある}きますので、{歩|ある}きやすい{靴|くつ}で{来|き}てください。' },
        { label: 'C', text: '【{鎌倉|かまくら}　{海|うみ}と{古|ふる}いお{寺|てら}コース】　{出発|しゅっぱつ}：{毎週|まいしゅう}{日曜日|にちようび}　{朝|あさ}{9時|くじ}　{東京駅|とうきょうえき}　／　{帰|かえ}り：{夕方|ゆうがた}{5時半|ごじはん}　／　{料金|りょうきん}：6,900{円|えん}（{昼|ひる}ご{飯|はん}{付|つ}き）。{海|うみ}の{近|ちか}くのお{寺|てら}を{回|まわ}ります。{歩|ある}く{時間|じかん}は{1時間|いちじかん}ぐらいです。{温泉|おんせん}はありません。' },
        { label: '※', text: '{学生|がくせい}の{方|かた}は、{学生証|がくせいしょう}を{見|み}せれば、どのコースも1,000{円|えん}{安|やす}くなります。ツアーの{3日前|みっかまえ}までなら、キャンセル{料|りょう}はかかりません。{2日前|ふつかまえ}からは{料金|りょうきん}の{半分|はんぶん}をいただきます。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b17-doc-3',
      title: 'Bài 3 — câu hỏi',
      items: [
        { q: 'ナタポンさんは{大学生|だいがくせい}です。{土曜日|どようび}しか{行|い}けません。{温泉|おんせん}に{入|はい}りたいです。{学生証|がくせいしょう}を{見|み}せて、いくら{払|はら}いますか。', options: ['9,800{円|えん}', '8,800{円|えん}', '6,500{円|えん}', '5,900{円|えん}'], correct: 1, why: 'Có onsen + đi thứ Bảy được → **A** (9.800 yên); thẻ sinh viên giảm 1.000 → **8.800 yên**. B không có onsen; C chỉ Chủ nhật. 〔Gakuseishou o misereba, sen en yasuku narimasu.〕' },
        { q: 'マリヤムさんは{足|あし}があまり{強|つよ}くないので、{2時間|にじかん}も{歩|ある}くのは{無理|むり}です。{日曜日|にちようび}の{夜|よる}{6時|ろくじ}までに{帰|かえ}りたいです。どのコースがいいですか。', options: ['A', 'B', 'C', 'どれもだめ'], correct: 2, why: 'Chủ nhật có A và C. A về **7 giờ tối** (quá 6 giờ) → loại. **C** về 5 giờ rưỡi, đi bộ 1 tiếng → được. B đi bộ 2 tiếng và chỉ thứ Bảy. 〔C: kaeri wa yuugata goji han desu.〕' },
        { q: 'カルロスさんはツアーの{3日前|みっかまえ}にキャンセルしました。キャンセル{料|りょう}はいくらですか。', options: ['{料金|りょうきん}の{半分|はんぶん}', '1,000{円|えん}', 'かからない', '{料金|りょうきん}{全部|ぜんぶ}'], correct: 2, why: '**{3日前|みっかまえ}までなら、キャンセル{料|りょう}はかかりません** — "đến 3 ngày trước" là còn miễn phí; từ 2 ngày trước mới mất một nửa. 〔Mikka mae made nara, kyanseru-ryou wa kakarimasen.〕' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('{学生証|がくせいしょう}を{見|み}せれば、1,000{円|えん}{安|やす}くなります。', 'Gakuseishou o misereba, sen en yasuku narimasu.', 'Xuất trình thẻ sinh viên thì rẻ đi 1.000 yên.'),
        E('{歩|ある}きやすい{靴|くつ}で{来|き}てください。', 'Arukiyasui kutsu de kite kudasai.', 'Hãy đi giày dễ đi bộ.'),
        E('{3日前|みっかまえ}までなら、キャンセル{料|りょう}はかかりません。', 'Mikka mae made nara, kyanseru-ryou wa kakarimasen.', 'Nếu huỷ trước 3 ngày thì không mất phí huỷ.'),
        E('{昼|ひる}ご{飯|はん}{付|つ}き／{昼|ひる}ご{飯|はん}なし', 'Hirugohan tsuki / hirugohan nashi', 'Có kèm bữa trưa / không kèm bữa trưa (～付き ↔ ～なし: chữ hay gặp trên tờ quảng cáo)'),
      ],
    },
  ],
};

/* ═══════════════════════════ 7. NÓI ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b17-noi',
  kind: 'speaking',
  title: 'Luyện nói — hỏi đường đi, khuyên bạn đi đâu, nhận xét chuyến đi, giới thiệu 1 phút, đọc to',
  goal: 'Trả lời trôi chảy câu hỏi thi nói về du lịch (đi đâu, vì sao, nếu có tiền/thời gian thì làm gì) bằng ～ば, ～なら, ～し; nhìn tờ quảng cáo trả lời câu hỏi có tranh; giới thiệu 1 phút một nơi nên đến ở nước mình; đọc to đoạn văn 30 giây đúng nhịp.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Thi nói kiểu JPD (khung của bộ môn) — chủ đề Bài 17 rơi vào đâu',
      head: ['Phần', 'Điểm', 'Làm gì', 'Bài 17 xuất hiện ở đâu'],
      rows: [
        ['Reading', '40', 'Chuẩn bị 30 giây, đọc to đoạn ~100 chữ.', 'Đoạn kể kế hoạch du lịch: {連休|れんきゅう}, {出発|しゅっぱつ}, {指定席|していせき}, {観光|かんこう}, {重|おも}すぎて, わかりやすい…'],
        ['Talking — có tranh', '3 × 15', 'Nhìn tranh (tờ tour, bảng giờ tàu, bản đồ) trả lời.', 'このツアーはいくらですか · {何時|なんじ}に{出発|しゅっぱつ}しますか · {温泉|おんせん}に{入|はい}りたいなら、どのコースがいいですか'],
        ['Talking — không tranh', '1 × 10', 'Trả lời 1 câu về bản thân.', '{連休|れんきゅう}に{何|なに}をしたいですか · お{金|かね}があれば、どこへ{行|い}きたいですか · あなたの{国|くに}でおすすめの{所|ところ}はどこですか、どうしてですか'],
        ['Presenting', '5', 'Chào khi vào/ra, thái độ.', '{失礼|しつれい}します／よろしくお{願|ねが}いします／ありがとうございました'],
      ],
    },
    {
      t: 'note',
      title: 'Luật trả lời cho câu hỏi Bài 17',
      items: [
        '**Câu hỏi "nếu" → trả lời bằng đúng mẫu "nếu"**: 「お{金|かね}があれば、{何|なに}をしたいですか」→ **お{金|かね}があれば、{世界|せかい}を{旅行|りょこう}したいです。** (lặp lại vế ば của giám khảo — vừa đúng ngữ pháp vừa có thêm thời gian nghĩ).',
        '**Câu hỏi "vì sao" → 2 lý do bằng し**: 「どうして{京都|きょうと}が{好|す}きですか」→ **お{寺|てら}が{多|おお}いし、{料理|りょうり}もおいしいし、{町|まち}がきれいだからです。**',
        '**Câu hỏi xin lời khuyên → なら**: 「ベトナムへ{行|い}きたいんですが、どこがいいですか」→ **{海|うみ}なら、ダナンがいいですよ。{古|ふる}い{町|まち}なら、ホイアンです。**',
        'Thêm **1 câu nhận xét** bằng ～すぎる／～やすい: {夏|なつ}は{暑|あつ}すぎますから、{春|はる}がいいです · ホイアンは{小|ちい}さい{町|まち}で、{歩|ある}きやすいです.',
        'Không nghe rõ: **もう{一度|いちど}お{願|ねが}いします** (tối đa 2 lần, không bị trừ).',
      ],
    },
    {
      t: 'phatam',
      id: 'b17-noi-phat-am',
      title: 'Đọc to & chấm phát âm — 14 câu hay dùng của Bài 17',
      note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Chú ý: しゅっ・ぱ・つ (âm ngắt っ giữ 1 nhịp), か・ん・こ・う (4 nhịp), よ・け・れ・ば, {重|おも}すぎます (o-mo-su-gi-ma-su — đừng chèn い).',
      items: [
        { text: '{来月|らいげつ}の{連休|れんきゅう}、どこか{旅行|りょこう}に{行|い}きませんか。', ipa: 'raigetsu no renkyuu dokoka ryokou ni ikimasen ka', vi: 'Kỳ nghỉ dài tháng sau, đi du lịch đâu đó không?' },
        { text: '{早|はや}く{予約|よやく}すれば、{安|やす}くなります。', ipa: 'hayaku yoyaku sureba yasuku narimasu', vi: 'Đặt sớm thì sẽ rẻ hơn.' },
        { text: '{天気|てんき}がよければ、{富士山|ふじさん}が{見|み}えます。', ipa: 'tenki ga yokereba Fujisan ga miemasu', vi: 'Trời đẹp thì nhìn thấy núi Phú Sĩ.' },
        { text: 'すみません、{空港|くうこう}へはどう{行|い}けばいいですか。', ipa: 'sumimasen kuukou e wa dou ikeba ii desu ka', vi: 'Xin lỗi, đến sân bay thì đi thế nào ạ?' },
        { text: '{予約|よやく}したいんですが、どうすればいいですか。', ipa: 'yoyaku shitai n desu ga dou sureba ii desu ka', vi: 'Tôi muốn đặt chỗ, phải làm thế nào ạ?' },
        { text: '{温泉|おんせん}なら、{箱根|はこね}がいいですよ。', ipa: 'onsen nara Hakone ga ii desu yo', vi: 'Suối nước nóng thì Hakone hay đấy.' },
        { text: '{京都|きょうと}へ{行|い}くなら、{秋|あき}がいちばんきれいです。', ipa: 'Kyouto e iku nara aki ga ichiban kirei desu', vi: 'Nếu đi Kyoto thì mùa thu đẹp nhất.' },
        { text: '{駅|えき}から{近|ちか}いし、{温泉|おんせん}もあるし、いい{旅館|りょかん}です。', ipa: 'eki kara chikai shi onsen mo aru shi ii ryokan desu', vi: 'Vừa gần ga, lại có onsen, là nhà trọ tốt.' },
        { text: 'ちょっと{高|たか}すぎます。', ipa: 'chotto takasugimasu', vi: 'Hơi đắt quá ạ.' },
        { text: 'スーツケースが{重|おも}すぎて、{一人|ひとり}で{持|も}てません。', ipa: 'suutsukeesu ga omosugite hitori de motemasen', vi: 'Vali nặng quá, một mình không xách nổi.' },
        { text: 'この{地図|ちず}はとてもわかりやすいです。', ipa: 'kono chizu wa totemo wakariyasui desu', vi: 'Bản đồ này rất dễ hiểu.' },
        { text: 'この{坂|さか}は{歩|ある}きにくいですね。', ipa: 'kono saka wa arukinikui desu ne', vi: 'Con dốc này khó đi nhỉ.' },
        { text: '{往復|おうふく}の{指定席|していせき}を{二枚|にまい}お{願|ねが}いします。{窓側|まどがわ}がいいです。', ipa: 'oufuku no shiteiseki o nimai onegai shimasu madogawa ga ii desu', vi: 'Cho tôi 2 vé ghế đặt trước khứ hồi. Tôi muốn phía cửa sổ.' },
        { text: '{来週|らいしゅう}の{旅行|りょこう}、{楽|たの}しみにしています。', ipa: 'raishuu no ryokou tanoshimi ni shite imasu', vi: 'Tôi đang háo hức chờ chuyến đi tuần sau.' },
      ],
    },
    { t: 'h', text: 'Câu hỏi không tranh ① — "Nếu… thì bạn làm gì?"' },
    DL('Giám khảo hỏi — thí sinh trả lời (mẫu điểm cao)', [
      ['{先生|せんせい}', 'examiner', 'お{金|かね}と{時間|じかん}があれば、どこへ{行|い}きたいですか。', 'Okane to jikan ga areba, doko e ikitai desu ka.', 'Nếu có tiền và thời gian, em muốn đi đâu?'],
      ['{学生|がくせい}', 'candidate', 'お{金|かね}と{時間|じかん}があれば、ヨーロッパへ{行|い}きたいです。{古|ふる}い{町|まち}が{好|す}きですし、{美術館|びじゅつかん}もたくさんありますから。', 'Okane to jikan ga areba, Yooroppa e ikitai desu. Furui machi ga suki desu shi, bijutsukan mo takusan arimasu kara.', 'Nếu có tiền và thời gian em muốn đi châu Âu. Em thích phố cổ, lại có nhiều bảo tàng mỹ thuật.'],
      ['{先生|せんせい}', 'examiner', '{明日|あした}{雨|あめ}が{降|ふ}れば、{何|なに}をしますか。', 'Ashita ame ga fureba, nani o shimasu ka.', 'Nếu mai trời mưa, em làm gì?'],
      ['{学生|がくせい}', 'candidate', '{雨|あめ}が{降|ふ}れば、{家|うち}で{日本|にほん}の{映画|えいが}を{見|み}ます。{外|そと}は{寒|さむ}いし、{道|みち}も{滑|すべ}りやすいですから。', 'Ame ga fureba, uchi de Nihon no eiga o mimasu. Soto wa samui shi, michi mo suberiyasui desu kara.', 'Nếu mưa thì em xem phim Nhật ở nhà. Vì ngoài trời vừa lạnh, đường lại dễ trơn.'],
      ['{先生|せんせい}', 'examiner', '{日本|にほん}の{旅行|りょこう}で、{困|こま}ったことはありますか。', 'Nihon no ryokou de, komatta koto wa arimasu ka.', 'Đi du lịch ở Nhật em có gặp chuyện gì khó khăn không?'],
      ['{学生|がくせい}', 'candidate', 'はい。{東京駅|とうきょうえき}は{広|ひろ}すぎて、{乗|の}り{換|か}えがわかりにくかったです。でも、{駅員|えきいん}さんに{聞|き}けば、{丁寧|ていねい}に{教|おし}えてくれます。', 'Hai. Toukyou eki wa hirosugite, norikae ga wakarinikukatta desu. Demo, ekiin-san ni kikeba, teinei ni oshiete kuremasu.', 'Có ạ. Ga Tokyo rộng quá nên chỗ đổi tàu rất khó hiểu. Nhưng hỏi nhân viên nhà ga thì họ chỉ rất tận tình.'],
    ]),
    {
      t: 'note',
      title: 'Bẫy ở nhóm câu hỏi "nếu"',
      items: [
        'Giám khảo hỏi bằng ～ば ({降|ふ}れば) → đáp lặp lại **{降|ふ}れば** (không đổi sang ~~{降|ふ}ったら~~ cũng không sai, nhưng lặp đúng mẫu được điểm "dùng ngữ pháp bài").',
        '~~{雨|あめ}が{降|ふ}れば、{映画|えいが}を{見|み}ましょう~~ với giám khảo — đây là lời rủ; câu hỏi hỏi **bạn làm gì** → **～ます／～たいです**.',
        '**{滑|すべ}りやすい** (dễ trơn) — câu nhận xét thêm bằng ～やすい làm câu trả lời "dày" hơn, nhưng đọc kỹ: すべ・り・や・す・い.',
      ],
    },
    { t: 'h', text: 'Câu hỏi không tranh ② — "Bạn khuyên đi đâu? Vì sao?"' },
    DL('Giám khảo hỏi — thí sinh trả lời (mẫu điểm cao)', [
      ['{先生|せんせい}', 'examiner', 'ベトナムへ{旅行|りょこう}に{行|い}きたいんですが、どこがいいですか。', 'Betonamu e ryokou ni ikitai n desu ga, doko ga ii desu ka.', 'Tôi muốn đi du lịch Việt Nam, đi đâu thì hay?'],
      ['{学生|がくせい}', 'candidate', '{海|うみ}が{好|す}きなら、ダナンがいいです。{海|うみ}がきれいだし、{料理|りょうり}も{安|やす}くておいしいし、{空港|くうこう}から{近|ちか}いです。', 'Umi ga suki nara, Danan ga ii desu. Umi ga kirei da shi, ryouri mo yasukute oishii shi, kuukou kara chikai desu.', 'Nếu thầy thích biển thì Đà Nẵng hay ạ. Biển đẹp, đồ ăn rẻ mà ngon, lại gần sân bay.'],
      ['{先生|せんせい}', 'examiner', 'いつ{行|い}けばいいですか。', 'Itsu ikeba ii desu ka.', 'Đi lúc nào thì được?'],
      ['{学生|がくせい}', 'candidate', '{夏|なつ}は{暑|あつ}すぎますから、{3月|さんがつ}か{4月|しがつ}がいいと{思|おも}います。', 'Natsu wa atsusugimasu kara, sangatsu ka shigatsu ga ii to omoimasu.', 'Mùa hè nóng quá nên em nghĩ tháng 3 hoặc tháng 4 là đẹp.'],
      ['{先生|せんせい}', 'examiner', 'ハノイはどうですか。', 'Hanoi wa dou desu ka.', 'Còn Hà Nội thì sao?'],
      ['{学生|がくせい}', 'candidate', '{古|ふる}い{町|まち}を{見物|けんぶつ}するなら、ハノイがいちばんです。でも、バイクが{多|おお}くて、{道|みち}が{渡|わた}りにくいですから、{気|き}をつけてください。', 'Furui machi o kenbutsu suru nara, Hanoi ga ichiban desu. Demo, baiku ga ookute, michi ga watarinikui desu kara, ki o tsukete kudasai.', 'Nếu muốn ngắm phố cổ thì Hà Nội là nhất. Nhưng xe máy nhiều, khó qua đường nên thầy cẩn thận nhé.'],
    ]),
    {
      t: 'note',
      title: 'Bẫy ở nhóm câu hỏi khuyên',
      items: [
        '~~ダナンなら、{海|うみ}が{好|す}きです~~ — なら đặt sau **điều kiện / chủ đề người kia đưa ra**, lời khuyên đứng sau: **{海|うみ}が{好|す}きなら、ダナンがいいです**.',
        '~~{海|うみ}がきれいし~~ → **{海|うみ}がきれいだし** (きれい là tính từ な!). Lỗi này người Việt mắc rất nhiều vì きれい trông như tính từ い.',
        '**{渡|わた}りにくい** (khó băng qua) — {道|みち}を{渡|わた}る = băng qua đường (ポイント 96).',
      ],
    },
    { t: 'h', text: 'Câu hỏi có tranh — nhìn tờ quảng cáo tour trả lời' },
    {
      t: 'table',
      caption: 'Tranh: tờ "さくら旅行 秋の日帰りバスツアー" (xem Đọc hiểu · Bài 3)',
      head: ['Câu hỏi của giám khảo', 'Câu trả lời mẫu', 'Romaji'],
      rows: [
        ['Aのツアーは{何時|なんじ}に{出発|しゅっぱつ}しますか。', '{朝|あさ}{8時|はちじ}に{新宿駅|しんじゅくえき}の{西口|にしぐち}を{出発|しゅっぱつ}します。', 'Asa hachiji ni Shinjuku eki no nishiguchi o shuppatsu shimasu.'],
        ['{温泉|おんせん}に{入|はい}りたいなら、どのコースがいいですか。', '{温泉|おんせん}に{入|はい}りたいなら、Aのコースがいいです。', 'Onsen ni hairitai nara, A no koosu ga ii desu.'],
        ['Bのコースは{何|なに}を{持|も}っていけばいいですか。', '{昼|ひる}ご{飯|はん}が{付|つ}いていませんから、お{弁当|べんとう}を{持|も}っていけばいいです。それから、{歩|ある}きやすい{靴|くつ}を{履|は}いていきます。', 'Hirugohan ga tsuite imasen kara, obentou o motte ikeba ii desu. Sorekara, arukiyasui kutsu o haite ikimasu.'],
        ['{学生|がくせい}はいくら{安|やす}くなりますか。', '{学生証|がくせいしょう}を{見|み}せれば、1,000{円|えん}{安|やす}くなります。', 'Gakuseishou o misereba, sen en yasuku narimasu.'],
        ['あなたはどのコースに{行|い}きたいですか。どうしてですか。', 'Cのコースに{行|い}きたいです。{海|うみ}も{見|み}られるし、{安|やす}いし、{夕方|ゆうがた}に{帰|かえ}れますから。', 'C no koosu ni ikitai desu. Umi mo mirareru shi, yasui shi, yuugata ni kaeremasu kara.'],
      ],
    },
    { t: 'h', text: 'できる！ — Giới thiệu 1 phút: một nơi nên đến ở nước bạn' },
    {
      t: 'table',
      caption: 'Dàn ý 5 câu (khoảng 1 phút) — mỗi câu dùng một mẫu của bài',
      head: ['Bước', 'Nội dung', 'Mẫu', 'Câu mẫu'],
      rows: [
        ['① Mở', 'chào + chủ đề', '～を{紹介|しょうかい}します', '{今日|きょう}は{私|わたし}の{国|くに}のホイアンを{紹介|しょうかい}します。'],
        ['② Vì sao nên đi', '2 lý do', '～し、～し', '{古|ふる}い{町|まち}がきれいだし、{料理|りょうり}もおいしいし、{夜|よる}はランタンがとても{美|うつく}しいです。'],
        ['③ Lời khuyên theo điều kiện', 'ai thích gì thì…', '～なら', '{写真|しゃしん}が{好|す}きなら、{夜|よる}の{町|まち}がおすすめです。'],
        ['④ Cách đi / mẹo', 'nếu … thì tiện', '～ば／～やすい', 'ダナンの{空港|くうこう}からタクシーで{行|い}けば、{45分|よんじゅうごふん}ぐらいです。{町|まち}が{小|ちい}さくて、{歩|ある}きやすいです。'],
        ['⑤ Lưu ý + kết', 'nhận xét + mời', '～すぎる', 'でも、{夏|なつ}は{暑|あつ}すぎますから、{春|はる}がいいです。みなさん、ぜひ{行|い}ってください。'],
      ],
    },
    DL('Bài nói mẫu — ナタポン giới thiệu Chiang Mai (khoảng 1 phút)', [
      ['ナタポン', 'b', '{今日|きょう}は{私|わたし}の{国|くに}、タイのチェンマイを{紹介|しょうかい}します。', 'Kyou wa watashi no kuni, Tai no Chenmai o shoukai shimasu.', 'Hôm nay tôi xin giới thiệu Chiang Mai của Thái Lan, đất nước tôi.'],
      ['ナタポン', 'b', 'チェンマイは{山|やま}の{中|なか}にある{古|ふる}い{町|まち}です。お{寺|てら}が{多|おお}いし、{自然|しぜん}も{多|おお}いし、バンコクより{涼|すず}しいです。', 'Chenmai wa yama no naka ni aru furui machi desu. Otera ga ooi shi, shizen mo ooi shi, Bankoku yori suzushii desu.', 'Chiang Mai là thành phố cổ nằm giữa núi. Nhiều chùa, nhiều thiên nhiên, lại mát hơn Bangkok.'],
      ['ナタポン', 'b', 'タイ{料理|りょうり}が{好|す}きなら、{料理|りょうり}{教室|きょうしつ}の{体験|たいけん}がおすすめです。{一日|いちにち}で{三|みっ}つぐらい{料理|りょうり}が{作|つく}れます。', 'Tai ryouri ga suki nara, ryouri kyoushitsu no taiken ga osusume desu. Ichinichi de mittsu gurai ryouri ga tsukuremasu.', 'Nếu thích món Thái thì tôi khuyên trải nghiệm lớp học nấu ăn. Một ngày nấu được khoảng ba món.'],
      ['ナタポン', 'b', 'バンコクから{飛行機|ひこうき}で{行|い}けば、{1時間|いちじかん}ぐらいです。{町|まち}が{小|ちい}さいですから、{自転車|じてんしゃ}でも{回|まわ}りやすいです。', 'Bankoku kara hikouki de ikeba, ichijikan gurai desu. Machi ga chiisai desu kara, jitensha de mo mawariyasui desu.', 'Đi máy bay từ Bangkok thì mất khoảng 1 tiếng. Thành phố nhỏ nên đi xe đạp cũng dễ dạo quanh.'],
      ['ナタポン', 'b', 'でも、{4月|しがつ}は{暑|あつ}すぎますから、{11月|じゅういちがつ}から{2月|にがつ}ごろがいいです。みなさん、ぜひ{行|い}ってください。ありがとうございました。', 'Demo, shigatsu wa atsusugimasu kara, juuichigatsu kara nigatsu goro ga ii desu. Minasan, zehi itte kudasai. Arigatou gozaimashita.', 'Nhưng tháng 4 nóng quá nên khoảng tháng 11 đến tháng 2 là đẹp. Mọi người nhất định hãy đi nhé. Xin cảm ơn.'],
    ]),
    {
      t: 'note',
      title: 'Đoạn đọc to (Reading 40đ) — chuẩn bị 30 giây rồi đọc',
      items: [
        '{来月|らいげつ}の{連休|れんきゅう}に、{友達|ともだち}と{京都|きょうと}へ{行|い}きます。{早|はや}く{予約|よやく}すれば{安|やす}くなりますから、もう{新幹線|しんかんせん}の{指定席|していせき}を{取|と}りました。{京都|きょうと}は{古|ふる}いお{寺|てら}が{多|おお}いし、{紅葉|こうよう}もきれいだし、とても{楽|たの}しみです。でも、{坂|さか}が{多|おお}くて{歩|ある}きにくいそうですから、{軽|かる}くて{歩|ある}きやすい{靴|くつ}を{買|か}おうと{思|おも}っています。',
        'Romaji: Raigetsu no renkyuu ni, tomodachi to Kyouto e ikimasu. Hayaku yoyaku sureba yasuku narimasu kara, mou shinkansen no shiteiseki o torimashita. Kyouto wa furui otera ga ooi shi, kouyou mo kirei da shi, totemo tanoshimi desu. Demo, saka ga ookute arukinikui sou desu kara, karukute arukiyasui kutsu o kaou to omotte imasu.',
        'Nghĩa: Kỳ nghỉ dài tháng sau tôi đi Kyoto với bạn. Đặt sớm thì rẻ nên tôi đã lấy ghế đặt trước Shinkansen rồi. Kyoto nhiều chùa cổ, lá đỏ lại đẹp, tôi háo hức lắm. Nhưng nghe nói nhiều dốc, khó đi nên tôi định mua đôi giày nhẹ, dễ đi.',
        'Chỗ dễ vấp: **{予約|よやく}すれば** (yo-ya-ku-su-re-ba), **{指定席|していせき}** (shi-te-i-se-ki — đủ 5 nhịp), **きれいだし** (đừng nuốt だ), **{歩|ある}きにくいそうです** (a-ru-ki-ni-ku-i-so-u-de-su).',
      ],
    },
    {
      t: 'speak',
      id: 'b17-noi-ghi-am',
      part: '1',
      questions: [
        'れんきゅうに なにを したいですか。',
        'おかねが あれば、どこへ いきたいですか。',
        'あなたの くにで おすすめの ところは どこですか。どうしてですか。',
        'にほんで りょこうするなら、どこが いいと おもいますか。',
        'りょこうで こまった ことは ありますか。',
        'あなたの まちを 1ぷんで しょうかいして ください。',
      ],
    },
  ],
};

/* ═══════════════════════════ 8. VIẾT ═══════════════════════════ */

const VIET: Lesson = {
  id: 'b17-viet',
  kind: 'writing',
  title: 'Viết — 「おすすめの旅行先」 (150–200 chữ) và email hỏi nhà trọ',
  goal: 'Viết một đoạn 150–200 chữ giới thiệu một nơi du lịch nên đến, có đủ ～なら, ～し、～し, ～ば, ～すぎる／～やすい và câu kết mời; viết email ngắn hỏi nhà trọ về phòng trống, giá và cách đi đúng khuôn — tự chấm theo 5 tiêu chí.',
  minutes: 40,
  blocks: [
    {
      t: 'p',
      text: 'Đề chính: 「わたしのおすすめの{旅行先|りょこうさき}」 (Nơi du lịch tôi muốn giới thiệu), **150–200 chữ**, thể です／ます. Đề phụ: email hỏi nhà trọ (問い合わせのメール). Bài viết N4 chấm **đúng khuôn + dùng được mẫu vừa học**: mỗi đoạn một mẫu là đủ điểm ngữ pháp. Viết vào vở hoặc gõ ra, rồi so với bài mẫu và tự chấm theo bảng cuối mục.',
    },
    {
      t: 'table',
      caption: 'Dàn ý 4 đoạn — mỗi đoạn 1–3 câu',
      head: ['Đoạn', 'Nội dung', 'Mẫu nên dùng', 'Câu gợi ý'],
      rows: [
        ['① Giới thiệu', 'nơi nào, ở đâu, nổi tiếng vì gì', '～は～で{有名|ゆうめい}です', '{私|わたし}のおすすめは{北海道|ほっかいどう}です。{北海道|ほっかいどう}は{自然|しぜん}で{有名|ゆうめい}です。'],
        ['② Vì sao nên đi', '2–3 lý do', '～し、～し／それに', '{景色|けしき}がきれいだし、{料理|りょうり}もおいしいし、それに{人|ひと}も{親切|しんせつ}です。'],
        ['③ Lời khuyên', 'mùa nào, đi thế nào, ai thích gì', '～なら／～ば', '{雪|ゆき}が{見|み}たいなら、{2月|にがつ}がいいです。{飛行機|ひこうき}で{行|い}けば、{東京|とうきょう}から{1時間半|いちじかんはん}です。'],
        ['④ Lưu ý + kết', 'điều cần cẩn thận + mời', '～すぎる／～やすい／～にくい', '{冬|ふゆ}は{寒|さむ}すぎますから、{暖|あたた}かい{服|ふく}を{持|も}っていってください。ぜひ{行|い}ってください。'],
      ],
    },
    {
      t: 'table',
      caption: 'Từ nối giúp bài liền mạch',
      head: ['Từ nối', 'Romaji', 'Nghĩa', 'Dùng ở'],
      rows: [
        ['{私|わたし}のおすすめは', 'watashi no osusume wa', 'nơi tôi giới thiệu là', 'câu mở'],
        ['まず／それから', 'mazu / sorekara', 'trước hết / sau đó', 'kể cách đi, lịch trình'],
        ['それに', 'sore ni', 'hơn nữa', 'thêm lý do sau ～し'],
        ['でも', 'demo', 'nhưng', 'nêu điều cần chú ý'],
        ['ですから／だから', 'desu kara / dakara', 'vì vậy', 'trước lời khuyên'],
        ['ぜひ', 'zehi', 'nhất định (mời)', 'câu kết: ぜひ{行|い}ってください'],
      ],
    },
    {
      t: 'passage',
      title: 'Bài mẫu — {私|わたし}のおすすめの{旅行先|りょこうさき}（{約|やく}{200字|にひゃくじ}）',
      paras: [
        { text: '{私|わたし}のおすすめは、ベトナムの{中部|ちゅうぶ}にあるホイアンです。ホイアンは{古|ふる}い{町|まち}で、{世界遺産|せかいいさん}にもなっています。' },
        { text: '{町|まち}がとても{美|うつく}しいし、{料理|りょうり}も{安|やす}くておいしいし、それに{夜|よる}はたくさんのランタンが{光|ひか}って、とてもきれいです。' },
        { text: '{写真|しゃしん}が{好|す}きなら、{夜|よる}の{川|かわ}の{近|ちか}くがおすすめです。ダナンの{空港|くうこう}からタクシーで{行|い}けば、{45分|よんじゅうごふん}ぐらいで{着|つ}きます。{町|まち}は{小|ちい}さくて{歩|ある}きやすいですから、{自転車|じてんしゃ}を{借|か}りれば、{一日|いちにち}で{全部|ぜんぶ}{回|まわ}れます。' },
        { text: 'でも、{6月|ろくがつ}から{8月|はちがつ}は{暑|あつ}すぎますから、{2月|にがつ}から{4月|しがつ}ごろに{行|い}ったほうがいいです。みなさんも、ぜひ{行|い}ってください。' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('{私|わたし}のおすすめは、ベトナムの{中部|ちゅうぶ}にあるホイアンです。', 'Watashi no osusume wa, Betonamu no chuubu ni aru Hoian desu.', 'Nơi tôi giới thiệu là Hội An ở miền Trung Việt Nam.'),
        E('{町|まち}がとても{美|うつく}しいし、{料理|りょうり}も{安|やす}くておいしいし、それに{夜|よる}はランタンが{光|ひか}って、とてもきれいです。', 'Machi ga totemo utsukushii shi, ryouri mo yasukute oishii shi, sore ni yoru wa rantan ga hikatte, totemo kirei desu.', 'Phố rất đẹp, đồ ăn rẻ mà ngon, hơn nữa buổi tối đèn lồng sáng lên rất đẹp.'),
        E('{写真|しゃしん}が{好|す}きなら、{夜|よる}の{川|かわ}の{近|ちか}くがおすすめです。', 'Shashin ga suki nara, yoru no kawa no chikaku ga osusume desu.', 'Nếu thích chụp ảnh thì tôi khuyên khu gần sông buổi tối.'),
        E('{自転車|じてんしゃ}を{借|か}りれば、{一日|いちにち}で{全部|ぜんぶ}{回|まわ}れます。', 'Jitensha o karireba, ichinichi de zenbu mawaremasu.', 'Thuê xe đạp thì một ngày đi hết được.'),
        E('{6月|ろくがつ}から{8月|はちがつ}は{暑|あつ}すぎますから、{2月|にがつ}から{4月|しがつ}ごろに{行|い}ったほうがいいです。', 'Rokugatsu kara hachigatsu wa atsusugimasu kara, nigatsu kara shigatsu goro ni itta hou ga ii desu.', 'Tháng 6 đến tháng 8 nóng quá nên đi khoảng tháng 2 đến tháng 4 thì hơn.'),
      ],
    },
    {
      t: 'note',
      title: 'Vì sao bài mẫu được điểm cao',
      items: [
        '**Đủ 5 mẫu của bài**, mỗi mẫu một chỗ tự nhiên: し (đoạn 2), なら + ば (đoạn 3), やすい (đoạn 3), すぎる (đoạn 4).',
        '**Có số liệu cụ thể** ({45分|よんじゅうごふん}, {2月|にがつ}から{4月|しがつ}) — bài giới thiệu đáng tin hơn.',
        '**Lời khuyên có lý do**: {暑|あつ}すぎますから → {行|い}ったほうがいいです (ôn ポイント 105).',
        '**Câu kết mời** bằng ぜひ～てください — khuôn kết quen thuộc của bài giới thiệu.',
        'Độ dài ≈ 200 chữ; chỉ dùng thể です／ます, không lẫn thể thường.',
      ],
    },
    { t: 'h', text: 'Đề phụ — Email hỏi nhà trọ (問い合わせのメール)' },
    {
      t: 'table',
      caption: 'Khuôn email hỏi thông tin — 5 phần',
      head: ['Phần', 'Viết gì', 'Câu mẫu', 'Romaji'],
      rows: [
        ['{件名|けんめい}', 'tiêu đề ngắn', '{11月|じゅういちがつ}{15日|じゅうごにち}の{予約|よやく}について', 'Juuichigatsu juugonichi no yoyaku ni tsuite'],
        ['Mở', 'chào + tự giới thiệu', 'はじめまして。ワンと{申|もう}します。', 'Hajimemashite. Wan to moushimasu.'],
        ['Hỏi ①', 'còn phòng không', '{11月|じゅういちがつ}{15日|じゅうごにち}に{3人|さんにん}で{泊|と}まりたいんですが、{和室|わしつ}は{空|あ}いていますか。', 'Juuichigatsu juugonichi ni sannin de tomaritai n desu ga, washitsu wa aite imasu ka.'],
        ['Hỏi ②', 'giá, cách đi (～ばいいですか)', '{駅|えき}から{旅館|りょかん}まで、どう{行|い}けばいいですか。', 'Eki kara ryokan made, dou ikeba ii desu ka.'],
        ['Kết', 'nhờ trả lời + chào', 'お{返事|へんじ}をお{待|ま}ちしています。よろしくお{願|ねが}いします。', 'Ohenji o omachi shite imasu. Yoroshiku onegai shimasu.'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{父|ちち}は{足|あし}があまり{強|つよ}くないので、{駅|えき}から{近|ちか}ければ、うれしいです。', 'Chichi wa ashi ga amari tsuyoku nai node, eki kara chikakereba, ureshii desu.', 'Bố tôi chân không khoẻ lắm nên nếu gần ga thì tốt quá.'),
        E('{和室|わしつ}が{空|あ}いていなければ、{洋室|ようしつ}でも{大丈夫|だいじょうぶ}です。', 'Washitsu ga aite inakereba, youshitsu de mo daijoubu desu.', 'Nếu phòng kiểu Nhật không còn thì phòng kiểu Tây cũng được.'),
        E('{夕食|ゆうしょく}は{何時|なんじ}からですか。{現金|げんきん}しか{使|つか}えませんか。', 'Yuushoku wa nanji kara desu ka. Genkin shika tsukaemasen ka.', 'Bữa tối từ mấy giờ ạ? Có phải chỉ dùng được tiền mặt không ạ?'),
      ],
    },
    {
      t: 'quiz',
      id: 'b17-viet-cau',
      title: 'Viết từng câu cho bài của bạn — dịch Việt → Nhật (6 câu)',
      kind: 'translate',
      grammar: '～なら · ～し、～し · ～ば · ～すぎる · ～やすい',
      items: [
        { q: 'Nơi tôi giới thiệu là Đà Lạt.', answers: V('{私|わたし}のおすすめはダラットです。'), hint: 'わたしの おすすめは' },
        { q: 'Đà Lạt vừa mát, hoa lại đẹp.', answers: V('ダラットは{涼|すず}しいし、{花|はな}もきれいです。', 'ダラットは{涼|すず}しいし、{花|はな}もきれいだし……。'), hint: 'すずしいし · はなも' },
        { q: 'Nếu thích thiên nhiên thì Đà Lạt hay lắm.', answers: V('{自然|しぜん}が{好|す}きなら、ダラットがいいです。', '{自然|しぜん}が{好|す}きなら、ダラットがいいですよ。'), hint: 'すきなら' },
        { q: 'Đi máy bay từ Hà Nội thì mất khoảng 2 tiếng.', answers: V('ハノイから{飛行機|ひこうき}で{行|い}けば、{2時間|にじかん}ぐらいです。', 'ハノイから{飛行機|ひこうき}で{行|い}けば、{2時間|にじかん}ぐらいかかります。'), hint: 'いけば · ぐらい' },
        { q: 'Buổi tối lạnh quá nên hãy mang áo khoác.', answers: V('{夜|よる}は{寒|さむ}すぎますから、{上着|うわぎ}を{持|も}っていってください。', '{夜|よる}は{寒|さむ}すぎるから、{上着|うわぎ}を{持|も}っていってください。', '{夜|よる}は{寒|さむ}すぎますから、コートを{持|も}っていってください。'), hint: 'さむすぎます · もっていって' },
        { q: 'Thành phố nhỏ nên dễ đi bộ.', answers: V('{町|まち}が{小|ちい}さいですから、{歩|ある}きやすいです。', '{町|まち}が{小|ちい}さくて、{歩|ある}きやすいです。', '{町|まち}は{小|ちい}さくて{歩|ある}きやすいです。'), hint: 'ちいさくて · あるきやすい' },
      ],
    },
    {
      t: 'note',
      title: 'Tự chấm — 5 tiêu chí (mỗi tiêu chí 2 điểm, tổng 10)',
      items: [
        '**① Khuôn** — đủ 4 đoạn: giới thiệu → lý do → lời khuyên → lưu ý + kết.',
        '**② Mẫu của bài** — có ít nhất 4 trong 5: ～ば, ～なら, ～し, ～すぎる, ～やすい／にくい (mỗi mẫu dùng đúng = điểm).',
        '**③ Chia đúng** — ば (よければ, すれば, {来|く}れば), なら không có だ, し có だ sau tính từ な / danh từ, すぎる bỏ い／な.',
        '**④ Nội dung cụ thể** — có ít nhất 2 số liệu (thời gian, mùa, giá) và 1 lời khuyên có lý do.',
        '**⑤ Độ dài & văn phong** — 150–200 chữ, toàn thể です／ます, chữ Hán đã học viết bằng chữ Hán ({出発|しゅっぱつ}, {観光|かんこう}, {世界|せかい}…).',
      ],
    },
  ],
};

/* ═══════════════════════════ 9. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b17-bai-tap',
  kind: 'homework',
  title: 'Bài tập Bài 17 — dịch, trắc nghiệm, ghép câu, đổi câu (có đáp án)',
  goal: 'Tự kiểm tra toàn bộ Bài 17: dịch Việt → Nhật có ～ば／～なら／～し／～すぎる／～やすい・にくい, chọn đúng mẫu "nếu" trong câu, ghép câu đúng trật tự và đổi câu theo mẫu — mục tiêu ≥ 85%.',
  minutes: 50,
  blocks: [
    {
      t: 'note',
      title: 'Cách làm',
      items: [
        'Làm sau khi xong 8 mục cốt lõi. Gõ đáp án bằng kana hoặc chữ Hán đều được; dấu câu và dấu cách không tính.',
        'Sai câu nào thì mở lại đúng mục: ～ば → Ngữ pháp ①; ～なら → ②; ～し → ③; ～すぎる → ④; ～やすい・にくい → ⑤; chọn と・ば・たら・なら → bảng phân biệt cuối Ngữ pháp.',
        'Mục tiêu: **≥ 85%** trước khi sang Bài 18.',
      ],
    },
    {
      t: 'quiz',
      id: 'b17-bt-dich',
      title: 'I. Dịch Việt → Nhật (14 câu)',
      kind: 'translate',
      grammar: '～ば · ～ばいいですか · ～なら · ～し、～し · ～すぎる · ～やすい／にくい',
      items: [
        { q: 'Nếu có thời gian, tôi muốn đi Nara.', answers: V('{時間|じかん}があれば、{奈良|なら}へ{行|い}きたいです。', '{時間|じかん}があれば、{奈良|なら}に{行|い}きたいです。'), hint: 'あれば · いきたい' },
        { q: 'Đi tàu tốc hành thì 1 tiếng là tới.', answers: V('{特急|とっきゅう}に{乗|の}れば、{1時間|いちじかん}で{着|つ}きます。', '{特急|とっきゅう}で{行|い}けば、{1時間|いちじかん}で{着|つ}きます。'), hint: 'のれば · 1じかんで' },
        { q: 'Nếu rẻ thì tôi mua.', answers: V('{安|やす}ければ、{買|か}います。', '{安|やす}ければ{買|か}います。'), hint: 'やすければ' },
        { q: 'Nếu trời đẹp thì nhìn thấy đảo.', answers: V('{天気|てんき}がよければ、{島|しま}が{見|み}えます。'), hint: 'よければ · みえます' },
        { q: 'Vé mua ở đâu thì được ạ?', answers: V('{切符|きっぷ}はどこで{買|か}えばいいですか。', 'チケットはどこで{買|か}えばいいですか。'), hint: 'かえば いいですか' },
        { q: 'Tôi muốn đặt chỗ, phải làm thế nào ạ?', answers: V('{予約|よやく}したいんですが、どうすればいいですか。', '{予約|よやく}したいんですが、どうしたらいいですか。'), hint: 'どうすれば いいですか' },
        { q: 'Không có hộ chiếu thì không lên máy bay được.', answers: V('パスポートがなければ、{飛行機|ひこうき}に{乗|の}れません。'), hint: 'なければ · のれません' },
        { q: '(Đáp lời bạn) Suối nước nóng thì Hakone hay đấy.', answers: V('{温泉|おんせん}なら、{箱根|はこね}がいいですよ。', '{温泉|おんせん}なら、{箱根|はこね}がいいです。', '{温泉|おんせん}なら、{箱根|はこね}がいいよ。'), hint: 'おんせんなら' },
        { q: 'Nếu định đi Kyoto thì nên đặt khách sạn sớm.', answers: V('{京都|きょうと}へ{行|い}くなら、{早|はや}くホテルを{予約|よやく}したほうがいいです。', '{京都|きょうと}に{行|い}くなら、{早|はや}くホテルを{予約|よやく}したほうがいいです。', '{京都|きょうと}へ{行|い}くなら、ホテルを{早|はや}く{予約|よやく}したほうがいいです。'), hint: 'いくなら · ほうがいい' },
        { q: 'Nhà trọ này vừa gần ga vừa rẻ.', answers: V('この{旅館|りょかん}は{駅|えき}から{近|ちか}いし、{安|やす}いです。', 'この{旅館|りょかん}は{駅|えき}から{近|ちか}いし、{安|やす}いし……。', 'この{旅館|りょかん}は{駅|えき}に{近|ちか}いし、{安|やす}いです。'), hint: 'ちかいし' },
        { q: 'Hôm nay vừa mưa vừa lạnh, nên tôi ở nhà.', answers: V('{今日|きょう}は{雨|あめ}だし、{寒|さむ}いし、{家|うち}にいます。', '{今日|きょう}は{雨|あめ}だし、{寒|さむ}いから、{家|うち}にいます。', '{今日|きょう}は{雨|あめ}だし、{寒|さむ}いし、{家|いえ}にいます。'), hint: 'あめだし · さむいし' },
        { q: 'Cái vali này nặng quá.', answers: V('このスーツケースは{重|おも}すぎます。'), hint: 'おもすぎます' },
        { q: 'Giá đắt quá nên tôi không mua được.', answers: V('{値段|ねだん}が{高|たか}すぎて、{買|か}えませんでした。', '{高|たか}すぎて、{買|か}えませんでした。', '{値段|ねだん}が{高|たか}すぎて、{買|か}えません。'), hint: 'たかすぎて · かえません' },
        { q: 'Bản đồ này dễ hiểu, nhưng chữ nhỏ nên khó nhìn.', answers: V('この{地図|ちず}はわかりやすいですが、{字|じ}が{小|ちい}さくて{見|み}にくいです。', 'この{地図|ちず}はわかりやすいけど、{字|じ}が{小|ちい}さくて{見|み}にくいです。'), hint: 'わかりやすい · みにくい' },
      ],
    },
    {
      t: 'mcq',
      id: 'b17-bt-chon',
      title: 'II. Trắc nghiệm — chọn từ / mẫu đúng (12 câu)',
      items: [
        { q: 'このボタンを（　）、{切符|きっぷ}が{出|で}ます。', options: ['{押|お}すと', '{押|お}すなら', '{押|お}すし', '{押|お}しすぎて'], correct: 0, why: 'Máy móc, kết quả tự nhiên → **と**. 〔Kono botan o osu to, kippu ga demasu.〕' },
        { q: '{家|うち}に（　）、メールしてください。', options: ['{帰|かえ}れば', '{帰|かえ}るなら', '{帰|かえ}ったら', '{帰|かえ}ると'], correct: 2, why: 'Hành động + nhờ → **たら**. 〔Uchi ni kaettara, meeru shite kudasai.〕' },
        { q: '{分|わ}からないことが（　）、{聞|き}いてください。', options: ['あれば', 'あるし', 'あると', 'ありすぎて'], correct: 0, why: 'Vế trước là trạng thái (ある) → **ば** dùng được với lời nhờ. 〔Wakaranai koto ga areba, kiite kudasai.〕' },
        { q: 'A「パソコンを{買|か}いたいんです。」B「パソコン（　）、{秋葉原|あきはばら}がいいですよ。」', options: ['すれば', 'なら', 'だし', 'と'], correct: 1, why: 'Nhận chủ đề của người kia → **なら**. 〔Pasokon nara, Akihabara ga ii desu yo.〕' },
        { q: '{旅行|りょこう}に（　）なら、{早|はや}く{準備|じゅんび}したほうがいいですよ。', options: ['{行|い}って', '{行|い}く', '{行|い}き', '{行|い}けば'], correct: 1, why: '**V{辞書形|じしょけい} + なら**: {行|い}くなら. 〔Ryokou ni iku nara, hayaku junbi shita hou ga ii desu yo.〕' },
        { q: 'この{町|まち}は{静|しず}か（　）、{住|す}みやすいです。', options: ['だし', 'し', 'なし', 'ければ'], correct: 0, why: 'Tính từ な + **だし**. 〔Kono machi wa shizuka da shi, sumiyasui desu.〕' },
        { q: '{昨日|きのう}は（　）すぎて、おなかが{痛|いた}いです。', options: ['{食|た}べる', '{食|た}べ', '{食|た}べて', '{食|た}べた'], correct: 1, why: 'Gốc thể ます + すぎる: **{食|た}べすぎて**. 〔Kinou wa tabesugite, onaka ga itai desu.〕' },
        { q: '{今日|きょう}は{天気|てんき}が（　）すぎて、{暑|あつ}いです。', options: ['い', 'よ', 'いい', 'よく'], correct: 1, why: 'いい → **よすぎる**. 〔Kyou wa tenki ga yosugite, atsui desu.〕' },
        { q: 'この{本|ほん}は{字|じ}が{大|おお}きくて、（　）です。', options: ['{読|よ}みやすい', '{読|よ}むやすい', '{読|よ}めやすい', '{読|よ}んでやすい'], correct: 0, why: 'Gốc ます + やすい: **{読|よ}みやすい**. 〔Kono hon wa ji ga ookikute, yomiyasui desu.〕' },
        { q: 'このコップは{薄|うす}くて、{割|わ}れ（　）ですから、{気|き}をつけてください。', options: ['にくい', 'やすい', 'すぎ', 'なら'], correct: 1, why: 'Mỏng → **dễ bị vỡ**: {割|わ}れやすい (khuynh hướng). 〔Kono koppu wa usukute, wareyasui desu kara, ki o tsukete kudasai.〕' },
        { q: '{席|せき}が（　）いますから、{座|すわ}りましょう。', options: ['{空|す}いて', '{空|あ}いて', '{混|こ}んで', '{足|た}りて'], correct: 1, why: 'Ghế còn trống = **{空|あ}いている**. 〔Seki ga aite imasu kara, suwarimashou.〕' },
        { q: '{予算|よさん}が（　）ので、{日帰|ひがえ}りにしました。', options: ['{足|た}りない', '{空|あ}かない', '{迷|まよ}わない', '{調|しら}べない'], correct: 0, why: 'Thiếu ngân sách = **{予算|よさん}が{足|た}りない**. 〔Yosan ga tarinai node, higaeri ni shimashita.〕' },
      ],
    },
    {
      t: 'build',
      id: 'b17-bt-ghep',
      title: 'III. Ghép câu (8 câu)',
      items: [
        { vi: 'Nếu đặt qua mạng thì rẻ hơn 10%.', chips: ['ネットで', '{予約|よやく}すれば', '{1割|いちわり}', '{安|やす}くなります', '{予約|よやく}して', '{安|やす}いです'], answer: ['ネットで', '{予約|よやく}すれば', '{1割|いちわり}', '{安|やす}くなります'], ro: 'Netto de yoyaku sureba, ichiwari yasuku narimasu.' },
        { vi: 'Đến sân bay thì nên đi bằng gì ạ?', chips: ['{空港|くうこう}まで', '{何|なに}で', '{行|い}けば', 'いいですか', '{行|い}くし', '{行|い}くなら'], answer: ['{空港|くうこう}まで', '{何|なに}で', '{行|い}けば', 'いいですか'], ro: 'Kuukou made nani de ikeba ii desu ka.' },
        { vi: 'Nếu là đặc sản thì cửa hàng trong ga tiện đấy.', chips: ['{名物|めいぶつ}', 'なら', '{駅|えき}の{中|なか}の', '{店|みせ}が', '{便利|べんり}ですよ', 'だなら'], answer: ['{名物|めいぶつ}', 'なら', '{駅|えき}の{中|なか}の', '{店|みせ}が', '{便利|べんり}ですよ'], ro: 'Meibutsu nara, eki no naka no mise ga benri desu yo.' },
        { vi: 'Kyoto vừa nhiều chùa, đồ ăn lại ngon.', chips: ['{京都|きょうと}は', 'お{寺|てら}も{多|おお}いし', '{料理|りょうり}も', 'おいしいです', 'お{寺|てら}も{多|おお}いだし'], answer: ['{京都|きょうと}は', 'お{寺|てら}も{多|おお}いし', '{料理|りょうり}も', 'おいしいです'], ro: 'Kyouto wa otera mo ooi shi, ryouri mo oishii desu.' },
        { vi: 'Phòng chật quá nên không ngủ ngon được.', chips: ['{部屋|へや}が', '{狭|せま}すぎて', 'よく', '{寝|ね}られませんでした', '{狭|せま}いすぎて'], answer: ['{部屋|へや}が', '{狭|せま}すぎて', 'よく', '{寝|ね}られませんでした'], ro: 'Heya ga semasugite, yoku neraremasen deshita.' },
        { vi: 'Đừng uống rượu quá nhiều nhé.', chips: ['お{酒|さけ}を', '{飲|の}みすぎないで', 'ください', '{飲|の}むすぎないで'], answer: ['お{酒|さけ}を', '{飲|の}みすぎないで', 'ください'], ro: 'Osake o nomisuginaide kudasai.' },
        { vi: 'Giày này nhẹ, dễ đi.', chips: ['この{靴|くつ}は', '{軽|かる}くて', '{歩|ある}きやすいです', '{軽|かる}いて', '{歩|ある}きにくいです'], answer: ['この{靴|くつ}は', '{軽|かる}くて', '{歩|ある}きやすいです'], ro: 'Kono kutsu wa karukute, arukiyasui desu.' },
        { vi: 'Ga này rộng nên khó tìm lối ra.', chips: ['この{駅|えき}は', '{広|ひろ}くて', '{出口|でぐち}が', 'わかりにくいです', 'わかりやすいです'], answer: ['この{駅|えき}は', '{広|ひろ}くて', '{出口|でぐち}が', 'わかりにくいです'], ro: 'Kono eki wa hirokute, deguchi ga wakarinikui desu.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b17-bt-doi',
      title: 'IV. Đổi câu theo mẫu (8 câu)',
      kind: 'fill',
      grammar: '～たら → ～ば (khi được) · から → し · とても～ → ～すぎる · ～のは簡単／難しい → ～やすい／にくい',
      items: [
        { q: '{安|やす}かったら、{買|か}います。 → （　）、{買|か}います。', answers: V('{安|やす}ければ'), hint: 'い → ければ' },
        { q: '{急|いそ}いだら、{間|ま}に{合|あ}います。 → （　）、{間|ま}に{合|あ}います。', answers: V('{急|いそ}げば'), hint: 'ぐ → げ + ば' },
        { q: '{雨|あめ}が{降|ふ}らなかったら、{行|い}きます。 → {雨|あめ}が（　）、{行|い}きます。', answers: V('{降|ふ}らなければ'), hint: 'ない → なければ' },
        { q: '{近|ちか}いです。{安|やす}いです。だから、ここにします。 → {近|ちか}い（　）、{安|やす}いし、ここにします。', answers: ['し'], hint: '～し、～し' },
        { q: '{便利|べんり}です。{静|しず}かです。 → {便利|べんり}（　）、{静|しず}かです。', answers: ['だし'], hint: 'tính từ な + だし' },
        { q: '{荷物|にもつ}が{重|おも}くて、{持|も}てません。(quá) → {荷物|にもつ}が（　）、{持|も}てません。', answers: V('{重|おも}すぎて'), hint: 'bỏ い + すぎて' },
        { q: 'この{地図|ちず}を{見|み}るのは{簡単|かんたん}です。 → この{地図|ちず}は（　）です。', answers: V('{見|み}やすい'), hint: '見 + やすい' },
        { q: 'この{道|みち}を{歩|ある}くのは{大変|たいへん}です。 → この{道|みち}は（　）です。', answers: V('{歩|ある}きにくい'), hint: '歩き + にくい' },
      ],
    },
  ],
};

/* ═══════════════════════ ② THEO BUỔI TRÊN LỚP ═══════════════════════ */

const BUOI_1: Lesson = {
  id: 'b17-buoi-1-ba',
  kind: 'review',
  title: 'Buổi 1 — Mở Bài 17: từ mới đặt chỗ · thể ～ば · ～ばいいですか · hội thoại ①',
  goal: 'Theo nhịp một buổi trên lớp: khởi động bằng ～と／～たら đã học, học 13 từ lên kế hoạch & đặt chỗ, chia và dùng thể ～ば (điều kiện cần, ～ばいいですか, ～なければ), đóng vai bàn chuyến đi kỳ nghỉ dài, rồi trả lời được câu giáo viên hay gọi.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 1 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Khởi động (5′)** — ôn ～と (ポイント 113) và ～たら (ポイント 120): "nếu" thứ ba của tiếng Nhật hôm nay là **～ば**.',
        '**Từ mới (10′)** — nhóm A: lên kế hoạch & đặt chỗ ({旅行会社|りょこうがいしゃ}, {予算|よさん}, {割引|わりびき}, {空|あ}いています…).',
        '**Ngữ pháp (15′)** — thể ～ば: cách chia, điều kiện cần, **どうすればいいですか**, ～なければ, giới hạn của ば.',
        '**Hội thoại (10′)** — ① bàn chuyến đi Kyoto ở phòng sinh hoạt.',
        '**チャレンジ (10′)** — luyện cặp: hỏi chỉ dẫn ↔ trả lời bằng ～ばいいですよ. Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b17-b1-slides',
      title: 'Bài 17 旅行の計画 — Buổi 1: ～ば',
      slides: [
        {
          tieuDe: '{第17課|だいじゅうななか} {旅行|りょこう}の{計画|けいかく}',
          anh: ['spiral-calendar', 'bullet-train', 'hot-springs'],
          nhan: ['{連休|れんきゅう}', '{新幹線|しんかんせん}', '{旅館|りょかん}'],
          dong: ['Hôm nay: **bàn chuyến đi · nêu điều kiện bằng ～ば · hỏi "phải làm thế nào?"**'],
          ro: ['~ba · dou sureba ii desu ka'],
          ghi: 'Bài 17 là bài "lên kế hoạch du lịch". Ba hình là ba câu hỏi lúc bàn chuyến đi: nghỉ khi nào, đi bằng gì, ở đâu. Buổi 1 lo phần "nếu… thì…": nếu rẻ thì đi, nếu đặt sớm thì được giảm giá.',
        },
        {
          tieuDe: 'できること — Học xong Bài 17 làm được gì?',
          anh: ['woman-student', 'woman-tipping-hand', 'luggage'],
          nhan: ['17-1 {相談|そうだん}', '17-2 {旅行会社|りょこうがいしゃ}', '17-3 {旅行|りょこう}の{日|ひ}'],
          dong: ['① Bàn với bạn: đi đâu, đi bằng gì, **nếu… thì…** (～ば・～なら).', '② Ở quầy du lịch: nêu điều kiện, nghe tư vấn **～し、～し**, hỏi **どうすればいいですか**.', '③ Trong chuyến đi: **{重|おも}すぎる**, **わかりやすい**, **{歩|ある}きにくい**.'],
          ro: ['~ba · ~nara', '~shi, ~shi · dou sureba ii desu ka', 'omosugiru · wakariyasui · arukinikui'],
          ghi: 'Ba buổi đi đúng ba phần này. Cuối Bài 17 bạn nói được 1 phút giới thiệu một nơi nên đến ở nước mình.',
        },
        {
          tieuDe: 'Khởi động — "nếu" đã học',
          anh: ['vertical-traffic-light', 'airplane-arrival'],
          nhan: ['～と', '～たら'],
          dong: ['{右|みぎ}に{曲|ま}がると、{駅|えき}があります。', '{空港|くうこう}に{着|つ}いたら、{電話|でんわ}してください。'],
          ro: ['Migi ni magaru to, eki ga arimasu.', 'Kuukou ni tsuitara, denwa shite kudasai.'],
          hoi: 'Hai câu này dùng hai cách nói "nếu" khác nhau. Câu nào là "hễ… là (tự nhiên)…", câu nào là "khi… xong thì (hãy)…"?',
          dap: 'Câu 1 ～と (ポイント 113 — chỉ đường, kết quả tự nhiên). Câu 2 ～たら (ポイント 120 — khi tới nơi thì làm việc khác).',
          ghi: 'Ôn hai mẫu cũ trước. Hôm nay thêm mẫu thứ ba ～ば — cuối Bài 17 có bảng so sánh cả bốn: と・ば・たら・なら.',
        },
        {
          tieuDe: '{新|あたら}しいことば ① — Lên kế hoạch',
          anh: ['woman-tipping-hand', 'magnifying-glass-tilted-left', 'open-book', 'spiral-calendar'],
          nhan: ['{旅行会社|りょこうがいしゃ}', '{調|しら}べます', 'ガイドブック', '{連休|れんきゅう}'],
          dong: ['{旅行会社|りょこうがいしゃ}で{相談|そうだん}します。'],
          ro: ['Ryokougaisha de soudan shimasu.'],
          ghi: '相談します = bàn, hỏi ý kiến (người に相談する). 調べます là nhóm 2 (調べる). 連休 = nhiều ngày nghỉ liền nhau — ゴールデンウィーク là kỳ nghỉ dài nổi tiếng nhất.',
        },
        {
          tieuDe: '{新|あたら}しいことば ② — Đặt chỗ ở',
          anh: ['hot-springs', 'hotel', 'couch-and-lamp', 'bed'],
          nhan: ['{旅館|りょかん}', 'ホテル', '{和室|わしつ}', '{洋室|ようしつ}'],
          dong: ['{1泊2日|いっぱくふつか}で{旅館|りょかん}に{泊|と}まります。'],
          ro: ['Ippaku futsuka de ryokan ni tomarimasu.'],
          ghi: '旅館 = nhà trọ kiểu Nhật (chiếu tatami, onsen, mặc yukata). 和室 = phòng chiếu tatami, 洋室 = phòng giường kiểu Tây. Đếm đêm: 1泊 いっぱく, 2泊 にはく, 3泊 さんぱく; 1泊2日 = 2 ngày 1 đêm.',
        },
        {
          tieuDe: '{新|あたら}しいことば ③ — Tiền & chỗ trống',
          anh: ['yen-banknote', 'japanese-discount-button', 'japanese-vacancy-button', 'japanese-no-vacancy-button'],
          nhan: ['{予算|よさん}', '{割引|わりびき}', '{空|あ}いています', '{満室|まんしつ}'],
          dong: ['{部屋|へや}は{空|あ}いていますか。——すみません、{満室|まんしつ}です。'],
          ro: ['Heya wa aite imasu ka. — Sumimasen, manshitsu desu.'],
          ghi: 'Ba biển chữ Hán thật ở Nhật: 割 = đang giảm giá, 空 = còn phòng/còn chỗ, 満 = hết. ⚠ 席が空いている (aite) = ghế trống; 電車が空いている (suite) = tàu vắng — cùng chữ, khác cách đọc. Hôm nay mới học キャンセルします và 日帰り (đi về trong ngày) — chưa có hình.',
        },
        {
          tieuDe: 'Thể ～ば — đổi đuôi',
          bang: {
            head: ['', 'Thể từ điển', '→ ～ば', 'Phủ định'],
            rows: [
              ['Nhóm 1', '{行|い}く・{乗|の}る・ある', '{行|い}**け**ば・{乗|の}**れ**ば・**あれば**', '{行|い}か**なければ**'],
              ['Nhóm 2', '{食|た}べる・{見|み}る', '{食|た}べ**れば**・{見|み}**れば**', '{食|た}べ**なければ**'],
              ['Nhóm 3', 'する・{来|く}る', '**すれば**・**{来|く}れば**', 'し**なければ**・{来|こ}**なければ**'],
              ['Tính từ い', '{安|やす}い・いい', '{安|やす}**ければ**・**よければ**', '{安|やす}く**なければ**'],
              ['Tính từ な / N', '{暇|ひま}・{雨|あめ}', '{暇|ひま}**なら**・{雨|あめ}**なら**', '{雨|あめ}じゃ**なければ**'],
            ],
          },
          ghi: 'Nhóm 1 đổi giống thể khả năng (Bài 16): い段 → え段, chỉ khác đuôi ば. Ba chữ phải thuộc: すれば, 来(く)れば, よければ. Phủ định thì luôn ない → なければ — đuôi bạn đã gặp trong なければなりません.',
        },
        {
          tieuDe: '～ば — điều kiện cần: "có A thì B"',
          anh: ['alarm-clock', 'bullet-train'],
          nhan: ['{早|はや}く{予約|よやく}すれば', '{特急|とっきゅう}に{乗|の}れば'],
          dong: ['{早|はや}く{予約|よやく}すれば、{安|やす}くなります。', '{特急|とっきゅう}に{乗|の}れば、{1時間|いちじかん}で{着|つ}きます。', '{天気|てんき}がよければ、{富士山|ふじさん}が{見|み}えます。'],
          ro: ['Hayaku yoyaku sureba, yasuku narimasu.', 'Tokkyuu ni noreba, ichijikan de tsukimasu.', 'Tenki ga yokereba, Fujisan ga miemasu.'],
          ghi: 'Vế sau của ば tự nhiên nhất khi là kết quả, khả năng, trạng thái: rẻ hơn, tới nơi, nhìn thấy. Câu ば hay dùng khi so sánh phương án: "đi tàu tốc hành thì nhanh, đi xe buýt thì rẻ".',
        },
        {
          tieuDe: 'どうすればいいですか — hỏi chỉ dẫn',
          anh: ['station', 'ticket', 'woman-tipping-hand'],
          nhan: ['{何番線|なんばんせん}？', '{切符|きっぷ}は？', '{予約|よやく}は？'],
          dong: ['{切符|きっぷ}はどこで{買|か}えばいいですか。', '{予約|よやく}したいんですが、どうすればいいですか。'],
          ro: ['Kippu wa doko de kaeba ii desu ka.', 'Yoyaku shitai n desu ga, dou sureba ii desu ka.'],
          hoi: 'Bạn ở ga Shinjuku, muốn hỏi nhân viên "Muốn đi Hakone thì phải lên tàu ở sân ga số mấy?" — nói thế nào?',
          dap: '{箱根|はこね}へ{行|い}きたいんですが、{何番線|なんばんせん}に{行|い}けばいいですか。 (Hakone e ikitai n desu ga, nanbansen ni ikeba ii desu ka.)',
          ghi: 'Công thức: ～たいんですが、＋ từ để hỏi ＋ Vば いいですか. Trả lời: ～ばいいですよ (cứ… là được). Đây là câu dùng nhiều nhất khi đi du lịch Nhật.',
        },
        {
          tieuDe: '～なければ — "không… thì…"',
          anh: ['identification-card', 'airplane'],
          nhan: ['パスポート', '{飛行機|ひこうき}'],
          dong: ['パスポートがなければ、{飛行機|ひこうき}に{乗|の}れません。', '{急|いそ}がなければ、{間|ま}に{合|あ}いませんよ。'],
          ro: ['Pasupooto ga nakereba, hikouki ni noremasen.', 'Isoganakereba, maniaimasen yo.'],
          ghi: 'Thể ば phủ định cảnh báo hậu quả: không có / không làm thì sẽ không được. Hình thẻ là "giấy tờ tuỳ thân" — ở sân bay là hộ chiếu.',
        },
        {
          tieuDe: '⚠ Giới hạn của ～ば',
          bang: {
            head: ['Câu', 'Được?', 'Vì sao'],
            rows: [
              ['{時間|じかん}が**あれば**、{手伝|てつだ}ってください。', '✓', 'vế trước là trạng thái (ある)'],
              ['~~{駅|えき}に{着|つ}けば、{電話|でんわ}してください。~~', '✗', 'vế trước là hành động + nhờ'],
              ['{駅|えき}に{着|つ}い**たら**、{電話|でんわ}してください。', '✓', 'đổi sang ～たら'],
            ],
          },
          ghi: 'Luật an toàn khi thi: vế sau là てください／ましょう／たい mà vế trước là hành động (着く, 行く, 終わる) → dùng たら. Vế trước là ある, いる, できる, tính từ, ない → ば vẫn được.',
        },
        {
          tieuDe: '{会話|かいわ} ① — Kỳ nghỉ dài, đi đâu?',
          anh: ['woman-student', 'man-student', 'woman-student'],
          nhan: ['パク', 'マルコ', 'アンナ'],
          dong: ['パク：{夜行|やこう}バスは？', 'マルコ：{夜行|やこう}バスで{行|い}けば、{安|やす}いですよ。', 'アンナ：{早|はや}く{予約|よやく}すれば、{新幹線|しんかんせん}も{少|すこ}し{安|やす}くなりますよ。'],
          ro: ['Paku: Yakou basu wa?', 'Maruko: Yakou basu de ikeba, yasui desu yo.', 'Anna: Hayaku yoyaku sureba, shinkansen mo sukoshi yasuku narimasu yo.'],
          ghi: 'Đọc to theo vai cả đoạn hội thoại ① ở mục Hội thoại. Để ý ba câu ば: 行けば (đi bằng xe buýt đêm), 予約すれば (đặt sớm), あれば (có onsen).',
        },
        {
          tieuDe: 'チャレンジ — Hỏi đường ở ga',
          anh: ['station', 'woman-tipping-hand'],
          nhan: ['A：{旅行者|りょこうしゃ}', 'B：{駅員|えきいん}'],
          dong: ['A：すみません、＿＿へ{行|い}きたいんですが、＿＿ばいいですか。', 'B：＿＿ばいいですよ。'],
          ro: ['A: Sumimasen, ___ e ikitai n desu ga, ___ ba ii desu ka.', 'B: ___ ba ii desu yo.'],
          hoi: 'Thay: (1) {空港|くうこう} / {何|なに}で{行|い}く → {電車|でんしゃ}で{行|い}く · (2) {清水寺|きよみずでら} / {何番|なんばん}のバスに{乗|の}る → {206番|にひゃくろくばん}に{乗|の}る.',
          dap: '(1) A：{空港|くうこう}へ{行|い}きたいんですが、{何|なに}で{行|い}けばいいですか。 B：{電車|でんしゃ}で{行|い}けばいいですよ。 (2) A：{清水寺|きよみずでら}へ{行|い}きたいんですが、{何番|なんばん}のバスに{乗|の}ればいいですか。 B：{206番|にひゃくろくばん}に{乗|の}ればいいですよ。',
          ghi: 'Hai bạn một cặp, đổi vai sau mỗi lượt. Giáo viên đi quanh nghe: chỗ hay sai là 乗れば (không phải 乗るば) và 行けば (không phải 行くば).',
        },
        {
          tieuDe: 'まとめ — Buổi 1',
          anh: ['thumbs-up'],
          dong: ['V(え段)ば ／ イA‑ければ ／ ナA・N なら ／ ～なければ', 'どう＿＿ばいいですか。'],
          ro: ['V (e-dan) ba / i-adj -kereba / na-adj, N nara / ~nakereba', 'Dou ___ ba ii desu ka.'],
          hoi: 'Không nhìn bảng: thể ば của する, 来る, いい là gì?',
          dap: 'すれば (sureba) · {来|く}れば (kureba) · よければ (yokereba).',
          ghi: 'Bài về nhà: Ngữ pháp ① (bảng chia + bảng thay thế), Từ vựng nhóm A, đọc to hội thoại ①. Buổi sau học ～なら và ～し.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Khởi động: ba cách nói "nếu"' },
    {
      t: 'p',
      text: 'Giáo viên viết lên bảng hai câu: 「{右|みぎ}に{曲|ま}がる＿、{駅|えき}があります」 và 「{駅|えき}に{着|つ}い＿、{電話|でんわ}してください」, gọi hai bạn điền と và たら. Rồi viết câu thứ ba: 「{早|はや}く{予約|よやく}＿＿、{安|やす}くなります」 — "Hôm nay mình học chữ còn thiếu này: **すれば**."',
    },
    {
      t: 'mcq',
      id: 'b17-b1-khoi-dong',
      title: 'Khởi động — ôn と・たら và thể khả năng (4 câu)',
      items: [
        { q: 'この{道|みち}をまっすぐ{行|い}く（　）、{銀行|ぎんこう}があります。', options: ['と', 'たら', 'から', 'けど'], correct: 0, why: 'Chỉ đường → **と** (ポイント 113). 〔Kono michi o massugu iku to, ginkou ga arimasu.〕' },
        { q: '{家|うち}に{帰|かえ}っ（　）、{電話|でんわ}してください。', options: ['たら', 'と', 'て', 'ても'], correct: 0, why: 'Khi về tới nhà rồi thì gọi → **たら** (ポイント 120). 〔Uchi ni kaettara, denwa shite kudasai.〕' },
        { q: '「{乗|の}ります」の{可能形|かのうけい}は？', options: ['{乗|の}られます', '{乗|の}れます', '{乗|の}ります', '{乗|の}れば'], correct: 1, why: 'Nhóm 1: り → れ: **{乗|の}れます** (Bài 16). Thể ば sắp học dùng đúng âm れ đó: {乗|の}**れ**ば.' },
        { q: '「{来|き}ます」の{可能形|かのうけい}は？', options: ['{来|き}られます', '{来|こ}られます', '{来|く}れます', '{来|こ}れば'], correct: 1, why: '**{来|こ}られます** (Bài 16). Chú ý: thể ば lại đọc **く**れば — học hôm nay.' },
      ],
    },
    { t: 'h', text: 'Slide 2 — Từ mới: đặt chỗ, tiền, chỗ trống' },
    {
      t: 'table',
      caption: 'Giáo viên dán một trang đặt phòng lên bảng và gạch chân từ mới',
      head: ['Trên trang', 'Đọc', 'Nghĩa'],
      rows: [
        ['**{旅館|りょかん}**「みずうみ{荘|そう}」', 'ryokan', 'nhà trọ kiểu Nhật'],
        ['**{和室|わしつ}**（{畳|たたみ}）／**{洋室|ようしつ}**（ベッド）', 'washitsu / youshitsu', 'phòng kiểu Nhật / kiểu Tây'],
        ['**{1泊2日|いっぱくふつか}**　{夕食|ゆうしょく}・{朝食|ちょうしょく}{付|つ}き', 'ippaku futsuka', '2 ngày 1 đêm, kèm bữa tối và sáng'],
        ['**{空|あ}き**あり ／ **{満室|まんしつ}**', 'aki ari / manshitsu', 'còn phòng / hết phòng'],
        ['{早|はや}く{予約|よやく}すれば **{割引|わりびき}**！', 'waribiki', 'giảm giá'],
        ['**キャンセル**{料|りょう}：{3日前|みっかまえ}から', 'kyanseru-ryou', 'phí huỷ: từ 3 ngày trước'],
        ['**{日帰|ひがえ}り**プランもあります', 'higaeri', 'gói đi về trong ngày'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{予算|よさん}は{一人|ひとり}{2万円|にまんえん}です。', 'Yosan wa hitori niman en desu.', 'Ngân sách là 2 vạn yên một người.'),
        E('{旅行会社|りょこうがいしゃ}で{相談|そうだん}しました。', 'Ryokougaisha de soudan shimashita.', 'Tôi đã bàn với công ty du lịch.'),
        E('ネットでホテルを{調|しら}べます。', 'Netto de hoteru o shirabemasu.', 'Tôi tra khách sạn trên mạng.'),
        E('{台風|たいふう}で{旅行|りょこう}をキャンセルしました。', 'Taifuu de ryokou o kyanseru shimashita.', 'Vì bão nên tôi huỷ chuyến đi.'),
      ],
    },
    { t: 'h', text: 'Slide 3 — Thể ～ば: bảng đổi đuôi' },
    {
      t: 'table',
      caption: 'Giáo viên viết hai cột trên bảng — lớp đọc to theo hàng',
      head: ['ます', '→ ～ば', 'Romaji'],
      rows: [
        ['い**き**ます', 'い**け**ば', 'ikeba'],
        ['の**り**ます', 'の**れ**ば', 'noreba'],
        ['か**い**ます', 'か**え**ば', 'kaeba'],
        ['いそ**ぎ**ます', 'いそ**げ**ば', 'isogeba'],
        ['たべます', 'たべ**れば**', 'tabereba'],
        ['のりかえます', 'のりかえ**れば**', 'norikaereba'],
        ['します', '**すれば**', 'sureba'],
        ['きます', '**くれば**', 'kureba'],
        ['やすい', 'やす**ければ**', 'yasukereba'],
        ['いい', '**よければ**', 'yokereba'],
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**{来|く}れば** đọc **く** (kureba), khác thể khả năng **{来|こ}られます** và thể ない **{来|こ}ない**.',
        '**いい → よければ**: いい chia mọi thể đều từ よい (よくない, よかった, よければ).',
        '**Phủ định**: ない → なければ ({行|い}かなければ, {安|やす}くなければ, {雨|あめ}じゃなければ).',
      ],
    },
    {
      t: 'quiz',
      id: 'b17-b1-chia',
      title: 'Luyện nhanh — chia thể ～ば (8 câu)',
      kind: 'fill',
      items: [
        { q: '{待|ま}ちます →', answers: V('{待|ま}てば') },
        { q: '{読|よ}みます →', answers: V('{読|よ}めば') },
        { q: '{話|はな}します →', answers: V('{話|はな}せば') },
        { q: '{見|み}ます →', answers: V('{見|み}れば') },
        { q: '{予約|よやく}します →', answers: V('{予約|よやく}すれば') },
        { q: '{来|き}ます →', answers: V('{来|く}れば') },
        { q: '{近|ちか}い →', answers: V('{近|ちか}ければ') },
        { q: 'ない →', answers: ['なければ'] },
      ],
    },
    { t: 'h', text: 'Slide 4 — Hội thoại ① và チャレンジ luyện cặp' },
    DL('Mẫu luyện cặp (thay phần trong bảng dưới)', [
      ['パク', 'c', '{夜行|やこう}バスはどうですか。', 'Yakou basu wa dou desu ka.', 'Xe buýt đêm thì sao?'],
      ['マルコ', 'b', '{夜行|やこう}バスで{行|い}けば、{安|やす}いですよ。', 'Yakou basu de ikeba, yasui desu yo.', 'Đi xe buýt đêm thì rẻ đấy.'],
      ['パク', 'c', '{旅館|りょかん}はどうですか。', 'Ryokan wa dou desu ka.', 'Nhà trọ kiểu Nhật thì sao?'],
      ['マルコ', 'b', '{早|はや}く{予約|よやく}すれば、{割引|わりびき}がありますよ。', 'Hayaku yoyaku sureba, waribiki ga arimasu yo.', 'Đặt sớm thì được giảm giá đấy.'],
    ]),
    {
      t: 'table',
      caption: 'チャレンジ — đổi vai, thay từ: 「A：＿＿はどうですか。 B：＿＿ば、＿＿よ。」',
      head: ['A hỏi', 'B: điều kiện (～ば)', 'B: kết quả'],
      rows: [
        ['{新幹線|しんかんせん}', '{新幹線|しんかんせん}で{行|い}けば', '{2時間|にじかん}で{着|つ}きますよ。'],
        ['{飛行機|ひこうき}', '{早|はや}く{買|か}えば', '{安|やす}いですよ。'],
        ['{日帰|ひがえ}り', '{朝|あさ}{早|はや}く{出発|しゅっぱつ}すれば', '{日帰|ひがえ}りでも{行|い}けますよ。'],
        ['{和室|わしつ}', '{空|あ}いていなければ', '{洋室|ようしつ}でもいいですよ。'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 1)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '「{行|い}く」の{条件形|じょうけんけい}は{何|なん}ですか。', ro: '"Iku" no joukenkei wa nan desu ka.', vi: 'Thể điều kiện của 行く là gì?' },
        { who: 'Bạn', role: 'candidate', text: '「{行|い}けば」です。', ro: '"Ikeba" desu.', vi: 'Là 行けば ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「いい」は？', ro: '"Ii" wa?', vi: 'Còn いい?' },
        { who: 'Bạn', role: 'candidate', text: '「よければ」です。', ro: '"Yokereba" desu.', vi: 'Là よければ ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'お{金|かね}がたくさんあれば、{何|なに}がしたいですか。', ro: 'Okane ga takusan areba, nani ga shitai desu ka.', vi: 'Nếu có nhiều tiền, em muốn làm gì?' },
        { who: 'Bạn', role: 'candidate', text: 'お{金|かね}がたくさんあれば、{世界|せかい}を{旅行|りょこう}したいです。', ro: 'Okane ga takusan areba, sekai o ryokou shitai desu.', vi: 'Nếu có nhiều tiền, em muốn đi du lịch vòng quanh thế giới.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{日本語|にほんご}が{上手|じょうず}になりたいです。どうすればいいですか。', ro: 'Nihongo ga jouzu ni naritai desu. Dou sureba ii desu ka.', vi: 'Muốn giỏi tiếng Nhật thì phải làm thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{毎日|まいにち}{日本語|にほんご}で{話|はな}せばいいと{思|おも}います。', ro: 'Mainichi nihongo de hanaseba ii to omoimasu.', vi: 'Em nghĩ ngày nào cũng nói tiếng Nhật là được.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「{駅|えき}に{着|つ}けば、{電話|でんわ}してください」— {正|ただ}しいですか。', ro: '"Eki ni tsukeba, denwa shite kudasai" — tadashii desu ka.', vi: '"駅に着けば、電話してください" — có đúng không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ。「{着|つ}いたら」です。{後|うし}ろが「～てください」ですから。', ro: 'Iie. "Tsuitara" desu. Ushiro ga "~te kudasai" desu kara.', vi: 'Không ạ. Phải là 着いたら. Vì vế sau là ～てください.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b17-b1-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: '{急|いそ}（　）、{間|ま}に{合|あ}います。', options: ['ぐば', 'げば', 'ぎば', 'がば'], correct: 1, why: 'Nhóm 1: ぐ → **げば**. 〔Isogeba, maniaimasu.〕' },
        { q: '{明日|あした}{時間|じかん}が（　）、{一緒|いっしょ}に{行|い}きませんか。', options: ['あれば', 'あるば', 'あったと', 'あれる'], correct: 0, why: 'ある → **あれば** (trạng thái + rủ: được). 〔Ashita jikan ga areba, issho ni ikimasen ka.〕' },
        { q: 'すみません、{切符|きっぷ}はどこで（　）いいですか。', options: ['{買|か}えば', '{買|か}うし', '{買|か}えて', '{買|か}いば'], correct: 0, why: 'Hỏi chỉ dẫn: **{買|か}えば**いいですか. 〔Kippu wa doko de kaeba ii desu ka.〕' },
        { q: 'パスポートが（　）、{乗|の}れません。', options: ['なければ', 'ないば', 'ないなら', 'なくて'], correct: 0, why: 'ない → **なければ**. 〔Pasupooto ga nakereba, noremasen.〕' },
        { q: '{部屋|へや}は（　）いますか。——すみません、{満室|まんしつ}です。', options: ['{空|す}いて', '{空|あ}いて', '{混|こ}んで', '{足|た}りて'], correct: 1, why: 'Phòng còn trống = **{空|あ}いている**. 〔Heya wa aite imasu ka.〕' },
      ],
    },
  ],
};

const BUOI_2: Lesson = {
  id: 'b17-buoi-2-nara-shi',
  kind: 'review',
  title: 'Buổi 2 — Ở quầy du lịch: từ mới vé tàu & ngắm cảnh · ～なら · ～し、～し · hội thoại ②',
  goal: 'Ôn nhanh thể ～ば, học 20 từ về vé tàu và nơi ngắm cảnh, dùng ～なら để nhận lời người kia rồi khuyên (N なら / V辞書形なら / それなら), nối nhiều lý do bằng ～し、～し, đóng vai khách ↔ nhân viên quầy du lịch.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 2 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Ôn đầu giờ (5′)** — 6 câu chia thể ～ば.',
        '**Từ mới (10′)** — nhóm B (vé, ghế, sân bay) + nhóm C (ngắm cảnh).',
        '**Ngữ pháp (20′)** — ～なら: N なら · V{辞書形|じしょけい}なら (việc làm TRƯỚC) · それなら; ～し、～し: nêu lý do, ～し、それに.',
        '**Hội thoại (10′)** — ② quầy du lịch: bố mẹ ワン sang chơi.',
        '**チャレンジ (5′)** — khách nêu điều kiện, nhân viên khuyên bằng なら + し. Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b17-b2-slides',
      title: 'Bài 17 旅行の計画 — Buổi 2: ～なら・～し',
      slides: [
        {
          tieuDe: '{第17課|だいじゅうななか} — {旅行会社|りょこうがいしゃ}で',
          anh: ['woman-student', 'man-office-worker', 'hot-springs'],
          nhan: ['ワン', '{係|かかり}の{人|ひと}', '{箱根|はこね}'],
          dong: ['Hôm nay: **nghe lời khuyên ～なら · nêu lý do ～し、～し**'],
          ro: ['~nara · ~shi, ~shi'],
          ghi: 'Buổi 1 học cách nêu điều kiện. Buổi 2 là phía bên kia: người khác nêu điều kiện, mình đáp "nếu là vậy thì…" (なら) và giải thích bằng nhiều lý do (し).',
        },
        {
          tieuDe: 'Ôn nhanh — thể ～ば',
          anh: ['alarm-clock', 'yen-banknote'],
          nhan: ['{早|はや}く', '{安|やす}い'],
          hoi: 'Đổi sang thể ば: (1) {出発|しゅっぱつ}する (2) {来|く}る (3) {安|やす}い (4) いい (5) {乗|の}り{換|か}える (6) ない',
          dap: '(1) {出発|しゅっぱつ}すれば (2) {来|く}れば (3) {安|やす}ければ (4) よければ (5) {乗|の}り{換|か}えれば (6) なければ',
          ghi: 'Cả lớp đọc đồng thanh. Ai sai 来れば (đọc こ) hay よければ (đọc いければ) thì giáo viên cho đọc lại 3 lần.',
        },
        {
          tieuDe: '{新|あたら}しいことば ① — Vé & ghế',
          anh: ['bullet-train', 'seat', 'ticket', 'airplane-departure'],
          nhan: ['{特急|とっきゅう}', '{指定席|していせき}', '{往復|おうふく}／{片道|かたみち}', '{出発|しゅっぱつ}'],
          dong: ['{往復|おうふく}の{指定席|していせき}を{二枚|にまい}お{願|ねが}いします。{窓側|まどがわ}がいいです。'],
          ro: ['Oufuku no shiteiseki o nimai onegai shimasu. Madogawa ga ii desu.'],
          ghi: 'Câu mua vé hoàn chỉnh: (khứ hồi/một chiều) + (ghế đặt trước/tự do) + số vé + (cửa sổ/lối đi). Thêm (chưa có hình): 自由席 (ghế tự do), 通路側 (phía lối đi), 乗り換えます (đổi tàu), 迷います (lạc đường).',
        },
        {
          tieuDe: '{新|あたら}しいことば ② — Nơi ngắm cảnh',
          anh: ['desert-island', 'national-park', 'night-with-stars', 'world-map'],
          nhan: ['{島|しま}', '{自然|しぜん}', '{夜景|やけい}', '{世界|せかい}'],
          dong: ['{宮島|みやじま}は{世界|せかい}で{有名|ゆうめい}な{観光地|かんこうち}です。'],
          ro: ['Miyajima wa sekai de yuumei na kankouchi desu.'],
          ghi: 'Thêm (chưa có hình đúng nghĩa): 湖 (hồ — mizuumi), 港 (cảng — minato), 名所 (danh lam), 名物 (đặc sản), 観光します (tham quan), 案内します (dẫn đường), 体験します (trải nghiệm).',
        },
        {
          tieuDe: '～なら — "nếu là … thì …"',
          anh: ['woman-student', 'man-student'],
          nhan: ['A', 'B'],
          dong: ['A：{温泉|おんせん}に{行|い}きたいんです。', 'B：{温泉|おんせん}なら、{箱根|はこね}がいいですよ。'],
          ro: ['A: Onsen ni ikitai n desu.', 'B: Onsen nara, Hakone ga ii desu yo.'],
          ghi: 'なら nhặt lại đúng chữ người kia vừa nói (温泉) rồi đưa lời khuyên. Không có だ trước なら: 暇なら, 学生なら.',
        },
        {
          tieuDe: 'V{辞書形|じしょけい}なら — khuyên việc làm TRƯỚC',
          anh: ['open-book', 'airplane'],
          nhan: ['{買|か}う（{前|まえ}）', '{行|い}く（{後|あと}）'],
          dong: ['{京都|きょうと}へ{行|い}くなら、ガイドブックを{買|か}ったほうがいいです。', '{京都|きょうと}へ{行|い}ったら、{八|や}つ{橋|はし}を{買|か}ってきてください。'],
          ro: ['Kyouto e iku nara, gaidobukku o katta hou ga ii desu.', 'Kyouto e ittara, yatsuhashi o katte kite kudasai.'],
          hoi: 'Trong hai câu, việc "mua" xảy ra ở đâu — ở Tokyo trước khi đi, hay ở Kyoto sau khi tới?',
          dap: 'Câu なら: mua sách hướng dẫn TRƯỚC khi đi (ở nhà). Câu たら: mua bánh SAU khi tới Kyoto.',
          ghi: 'Đây là điểm đề N4 thích hỏi nhất về なら: vế sau có thể xảy ra trước vế なら. たら thì luôn là "sau khi A".',
        },
        {
          tieuDe: 'それなら — "nếu vậy thì…"',
          anh: ['person-walking', 'hotel'],
          nhan: ['{歩|ある}くのは…', '{駅|えき}の{前|まえ}'],
          dong: ['A：{父|ちち}はたくさん{歩|ある}けないんです。', 'B：それなら、{駅|えき}の{前|まえ}のホテルがいいですよ。'],
          ro: ['A: Chichi wa takusan arukenai n desu.', 'B: Sore nara, eki no mae no hoteru ga ii desu yo.'],
          ghi: 'それなら nhận lại CẢ CÂU người kia vừa nói. Nghĩa gần じゃ／では, nhưng nghe chu đáo hơn — nhân viên tư vấn hay dùng.',
        },
        {
          tieuDe: '～し、～し — nêu nhiều lý do',
          anh: ['bullet-train', 'hot-springs', 'national-park'],
          nhan: ['{近|ちか}いし', '{温泉|おんせん}もあるし', '{景色|けしき}もきれいだし'],
          dong: ['{箱根|はこね}は{東京|とうきょう}から{近|ちか}いし、{温泉|おんせん}もあるし、{景色|けしき}もきれいです。'],
          ro: ['Hakone wa Toukyou kara chikai shi, onsen mo aru shi, keshiki mo kirei desu.'],
          ghi: 'し gắn sau thể thường. Tính từ な và danh từ phải có だ: きれいだし, 雨だし (ngược với なら!). Hay đi với も: 温泉も, 景色も = "lại còn".',
        },
        {
          tieuDe: '～から ↔ ～し',
          bang: {
            head: ['', '～から', '～し、～し'],
            rows: [
              ['Số lý do', '1', '2–3 (ngầm còn nữa)'],
              ['Ví dụ', '{近|ちか}いから、{歩|ある}きます。', '{近|ちか}いし、{天気|てんき}もいいし、{歩|ある}きます。'],
              ['Sắc thái', 'rõ, chắc', 'mềm, liệt kê'],
            ],
          },
          ghi: 'Trong thi nói, câu "vì sao" trả lời bằng 2 lý do し được đánh giá cao hơn 1 lý do から — nhưng đừng nối hai lý do ngược chiều (rẻ し dở し…).',
        },
        {
          tieuDe: '{会話|かいわ} ② — Ở quầy du lịch',
          anh: ['woman-student', 'man-office-worker'],
          nhan: ['ワン', '{係|かかり}の{人|ひと}'],
          dong: ['{係|かかり}：ご{両親|りょうしん}と{一緒|いっしょ}なら、{箱根|はこね}はいかがですか。', 'ワン：ちょっと{高|たか}すぎます。', '{係|かかり}：でしたら、こちらのホテルはいかがですか。'],
          ro: ['Kakari: Goryoushin to issho nara, Hakone wa ikaga desu ka.', 'Wan: Chotto takasugimasu.', 'Kakari: Deshitara, kochira no hoteru wa ikaga desu ka.'],
          ghi: 'Đọc to theo vai cả hội thoại ②. Đếm xem nhân viên dùng なら / それなら mấy lần (3 lần: ご両親と一緒なら, それなら, でしたら ≈ だったら).',
        },
        {
          tieuDe: 'チャレンジ — Khách ↔ nhân viên',
          anh: ['woman-student', 'man-office-worker', 'map-of-japan'],
          nhan: ['{客|きゃく}', '{係|かかり}', '{日本|にほん}'],
          dong: ['{客|きゃく}：＿＿たいんですが。', '{係|かかり}：＿＿なら、＿＿がいいですよ。＿＿し、＿＿し。'],
          ro: ['Kyaku: ___ tai n desu ga.', 'Kakari: ___ nara, ___ ga ii desu yo. ___ shi, ___ shi.'],
          hoi: 'Thay: (1) {雪|ゆき}が{見|み}たい → {北海道|ほっかいどう}（{雪|ゆき}が{多|おお}い・{料理|りょうり}もおいしい） (2) {海|うみ}で{泳|およ}ぎたい → {沖縄|おきなわ}（{海|うみ}がきれいだ・{冬|ふゆ}も{暖|あたた}かい）',
          dap: '(1) {雪|ゆき}なら、{北海道|ほっかいどう}がいいですよ。{雪|ゆき}が{多|おお}いし、{料理|りょうり}もおいしいし。 (2) {海|うみ}なら、{沖縄|おきなわ}がいいですよ。{海|うみ}がきれいだし、{冬|ふゆ}も{暖|あたた}かいし。',
          ghi: 'Giáo viên nghe chỗ hay sai: きれいし (thiếu だ) và 雪だなら (thừa だ). Hai lỗi đối xứng — nhớ: し cần だ, なら không cần.',
        },
        {
          tieuDe: 'まとめ — Buổi 2',
          anh: ['thumbs-up'],
          dong: ['N／V{辞書形|じしょけい}／イA／ナA ＋ なら、～', '{普通形|ふつうけい}（ナA・N だ）＋ し、～し'],
          ro: ['N / V-jishokei / i-adj / na-adj + nara, ~', 'futsuukei (na-adj, N da) + shi, ~ shi'],
          hoi: 'Sửa lỗi: (1) {暇|ひま}だなら、{来|き}てください。 (2) {町|まち}がきれいし、{好|す}きです。',
          dap: '(1) {暇|ひま}なら、{来|き}てください。 (2) {町|まち}がきれいだし、{好|す}きです。',
          ghi: 'Bài về nhà: Ngữ pháp ②③ (bảng thay thế), Từ vựng nhóm B + C, đọc to hội thoại ②. Buổi sau: ～すぎる, ～やすい／にくい và chữ Hán.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Ôn đầu giờ: thể ～ば' },
    {
      t: 'quiz',
      id: 'b17-b2-on',
      title: 'Ôn đầu giờ — chia thể ～ば (6 câu)',
      kind: 'fill',
      items: [
        { q: '{出発|しゅっぱつ}する →', answers: V('{出発|しゅっぱつ}すれば') },
        { q: '{乗|の}り{換|か}える →', answers: V('{乗|の}り{換|か}えれば') },
        { q: '{迷|まよ}う →', answers: V('{迷|まよ}えば') },
        { q: '{安|やす}い →', answers: V('{安|やす}ければ') },
        { q: '{静|しず}か（な） →', answers: V('{静|しず}かなら', '{静|しず}かならば') },
        { q: '{来|こ}ない →', answers: V('{来|こ}なければ') },
      ],
    },
    { t: 'h', text: 'Slide 2 — Từ mới: vé tàu và nơi ngắm cảnh' },
    {
      t: 'table',
      caption: 'Giáo viên vẽ một tấm vé Shinkansen lên bảng và gạch chân từ mới',
      head: ['Trên vé / bảng', 'Đọc', 'Nghĩa'],
      rows: [
        ['**{東京|とうきょう}** → **{新大阪|しんおおさか}**　**{片道|かたみち}**', 'katamichi', 'một chiều (khứ hồi = {往復|おうふく})'],
        ['**{指定席|していせき}**　{7号車|ななごうしゃ} {12番|じゅうにばん}A', 'shiteiseki', 'ghế đặt trước (tự do = {自由席|じゆうせき})'],
        ['A = **{窓側|まどがわ}** ／ C = **{通路側|つうろがわ}**', 'madogawa / tsuurogawa', 'phía cửa sổ / phía lối đi'],
        ['**{出発|しゅっぱつ}** 9:00', 'shuppatsu', 'giờ khởi hành'],
        ['{名古屋|なごや}で**{乗|の}り{換|か}え**なし', 'norikae', '(không) đổi tàu'],
        ['**{観光案内所|かんこうあんないじょ}**（{駅|えき}の{中|なか}）', 'kankou annaijo', 'quầy thông tin du lịch'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{京都|きょうと}の{名物|めいぶつ}は{何|なん}ですか。', 'Kyouto no meibutsu wa nan desu ka.', 'Đặc sản của Kyoto là gì?'),
        E('{紅葉|こうよう}の{名所|めいしょ}を{案内|あんない}してください。', 'Kouyou no meisho o annai shite kudasai.', 'Hãy dẫn tôi đến những nơi ngắm lá đỏ nổi tiếng.'),
        E('{港|みなと}から{島|しま}へ{船|ふね}が{出|で}ます。', 'Minato kara shima e fune ga demasu.', 'Thuyền ra đảo xuất phát từ cảng.'),
        E('{京都|きょうと}で{着物|きもの}を{着|き}る{体験|たいけん}をしました。', 'Kyouto de kimono o kiru taiken o shimashita.', 'Ở Kyoto tôi đã trải nghiệm mặc kimono.'),
      ],
    },
    { t: 'h', text: 'Slide 3 — ～なら và ～し' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'A：～たいんです。 B：N なら、～がいいですよ。',
          vi: 'Nhận lời người kia → khuyên. Đầu câu đáp nhắc lại đúng từ của người kia.',
          examples: [
            E('{雪|ゆき}が{見|み}たいんです。——{雪|ゆき}なら、{北海道|ほっかいどう}がいいですよ。', 'Yuki ga mitai n desu. — Yuki nara, Hokkaidou ga ii desu yo.', 'Tôi muốn ngắm tuyết. — Tuyết thì Hokkaido hay đấy.'),
            E('{日本|にほん}の{古|ふる}い{町|まち}が{見|み}たいです。——それなら、{京都|きょうと}ですね。', 'Nihon no furui machi ga mitai desu. — Sore nara, Kyouto desu ne.', 'Tôi muốn xem phố cổ Nhật Bản. — Vậy thì Kyoto rồi.'),
          ],
        },
        {
          formula: 'N は A し、B し、（だから）～',
          vi: 'Giải thích vì sao khuyên. Nhớ だ trước し với tính từ な / danh từ.',
          examples: [
            E('{北海道|ほっかいどう}は{雪|ゆき}が{多|おお}いし、{料理|りょうり}もおいしいし、{冬|ふゆ}がいちばんです。', 'Hokkaidou wa yuki ga ooi shi, ryouri mo oishii shi, fuyu ga ichiban desu.', 'Hokkaido nhiều tuyết, đồ ăn lại ngon, mùa đông là nhất.'),
            E('{京都|きょうと}は{町|まち}もきれいだし、{歩|ある}いて{回|まわ}れるし、{楽|たの}しいですよ。', 'Kyouto wa machi mo kirei da shi, aruite mawareru shi, tanoshii desu yo.', 'Kyoto phố đẹp, đi bộ cũng dạo được, vui lắm.'),
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**なら KHÔNG có だ, し CÓ だ** (với tính từ な / danh từ): {暇|ひま}なら ↔ {暇|ひま}だし.',
        '**V{辞書形|じしょけい}なら**: vế sau có thể làm **trước** — {行|い}くなら、{予約|よやく}したほうがいい (đặt trước khi đi).',
        '**し nối lý do CÙNG CHIỀU**; ngược chiều dùng が／けど.',
      ],
    },
    { t: 'h', text: 'Slide 4 — Hội thoại ② và チャレンジ' },
    DL('Mẫu luyện cặp — khách ↔ nhân viên (thay phần trong bảng dưới)', [
      ['{客|きゃく}', 'a', '{両親|りょうしん}と{温泉|おんせん}に{行|い}きたいんですが。', 'Ryoushin to onsen ni ikitai n desu ga.', 'Tôi muốn đi suối nước nóng với bố mẹ…'],
      ['{係|かかり}の{人|ひと}', 'b', '{温泉|おんせん}なら、{箱根|はこね}がいいですよ。{近|ちか}いし、{湖|みずうみ}もきれいだし。', 'Onsen nara, Hakone ga ii desu yo. Chikai shi, mizuumi mo kirei da shi.', 'Suối nước nóng thì Hakone hay đấy. Gần, hồ lại đẹp.'],
      ['{客|きゃく}', 'a', 'でも、{父|ちち}はたくさん{歩|ある}けないんです。', 'Demo, chichi wa takusan arukenai n desu.', 'Nhưng bố tôi không đi bộ nhiều được.'],
      ['{係|かかり}の{人|ひと}', 'b', 'それなら、{駅|えき}の{前|まえ}の{旅館|りょかん}がおすすめです。', 'Sore nara, eki no mae no ryokan ga osusume desu.', 'Vậy thì tôi giới thiệu nhà trọ trước ga.'],
    ]),
    {
      t: 'table',
      caption: 'チャレンジ — đổi vai, thay từ',
      head: ['Khách muốn', 'Nhân viên: ～なら', 'Lý do (～し、～し)', 'Điều kiện thêm → それなら'],
      rows: [
        ['{紅葉|こうよう}を{見|み}たい', '{紅葉|こうよう}なら、{京都|きょうと}がいいですよ', 'お{寺|てら}も{多|おお}いし、{町|まち}もきれいだし', '{人|ひと}が{多|おお}いのは{嫌|いや}だ → それなら、{朝|あさ}{早|はや}く{行|い}けばいいですよ'],
        ['{海|うみ}で{泳|およ}ぎたい', '{海|うみ}なら、{沖縄|おきなわ}がいいですよ', '{海|うみ}がきれいだし、{魚|さかな}も{見|み}られるし', '{飛行機|ひこうき}が{高|たか}い → それなら、{平日|へいじつ}に{行|い}けば{安|やす}いですよ'],
        ['{夜景|やけい}を{見|み}たい', '{夜景|やけい}なら、{函館|はこだて}がいいですよ', '{山|やま}から{見|み}えるし、{港|みなと}もきれいだし', '{寒|さむ}いのが{苦手|にがて}だ → それなら、{夏|なつ}に{行|い}けばいいですよ'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 2)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{先生|せんせい}はベトナム{料理|りょうり}が{食|た}べたいです。', ro: 'Sensei wa Betonamu ryouri ga tabetai desu.', vi: 'Thầy muốn ăn món Việt.' },
        { who: 'Bạn', role: 'candidate', text: 'ベトナム{料理|りょうり}なら、{駅|えき}の{近|ちか}くの「サイゴン」がいいですよ。', ro: 'Betonamu ryouri nara, eki no chikaku no "Saigon" ga ii desu yo.', vi: 'Món Việt thì quán "Saigon" gần ga ngon lắm ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'どうしてですか。', ro: 'Doushite desu ka.', vi: 'Vì sao?' },
        { who: 'Bạn', role: 'candidate', text: '{安|やす}いし、フォーもおいしいし、{店|みせ}の{人|ひと}も{親切|しんせつ}ですから。', ro: 'Yasui shi, foo mo oishii shi, mise no hito mo shinsetsu desu kara.', vi: 'Vì rẻ, phở ngon, nhân viên lại tử tế.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{日本|にほん}の{会社|かいしゃ}で{働|はたら}くなら、{何|なに}をしたほうがいいですか。', ro: 'Nihon no kaisha de hataraku nara, nani o shita hou ga ii desu ka.', vi: 'Nếu định làm ở công ty Nhật thì nên làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{敬語|けいご}を{勉強|べんきょう}したほうがいいと{思|おも}います。', ro: 'Keigo o benkyou shita hou ga ii to omoimasu.', vi: 'Em nghĩ nên học kính ngữ ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「{静|しず}かし」— {正|ただ}しいですか。', ro: '"Shizuka shi" — tadashii desu ka.', vi: '"静かし" — có đúng không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、「{静|しず}かだし」です。な{形容詞|けいようし}ですから、「だ」が{要|い}ります。', ro: 'Iie, "shizuka da shi" desu. Na-keiyoushi desu kara, "da" ga irimasu.', vi: 'Không ạ, phải là 静かだし. Vì là tính từ な nên cần だ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b17-b2-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: 'A「お{土産|みやげ}を{買|か}いたいんですが。」B「お{土産|みやげ}（　）、{駅|えき}の{中|なか}の{店|みせ}がいいですよ。」', options: ['なら', 'だなら', 'ば', 'し'], correct: 0, why: '**N なら** (không có だ). 〔Omiyage nara, eki no naka no mise ga ii desu yo.〕' },
        { q: '{旅行|りょこう}に（　）、{早|はや}く{予約|よやく}したほうがいいです。', options: ['{行|い}ったら', '{行|い}くなら', '{行|い}くと', '{行|い}くし'], correct: 1, why: 'Đặt chỗ TRƯỚC khi đi → **V{辞書形|じしょけい}なら**. 〔Ryokou ni iku nara, hayaku yoyaku shita hou ga ii desu.〕' },
        { q: 'この{町|まち}は{便利|べんり}（　）、{安全|あんぜん}だし、{住|す}みやすいです。', options: ['し', 'だし', 'なし', 'なら'], correct: 1, why: 'Tính từ な + **だし**. 〔Kono machi wa benri da shi, anzen da shi, sumiyasui desu.〕' },
        { q: '{東京|とうきょう}から{大阪|おおさか}まで{行|い}って、また{東京|とうきょう}に{帰|かえ}ります。{切符|きっぷ}は（　）がいいです。', options: ['{片道|かたみち}', '{往復|おうふく}', '{自由席|じゆうせき}', '{窓側|まどがわ}'], correct: 1, why: 'Đi và về → **{往復|おうふく}**. 〔Kippu wa oufuku ga ii desu.〕' },
        { q: '{駅|えき}が{広|ひろ}くて、{道|みち}に（　）ました。', options: ['{迷|まよ}い', '{調|しら}べ', '{案内|あんない}し', '{乗|の}り{換|か}え'], correct: 0, why: '**{道|みち}に{迷|まよ}う** = lạc đường. 〔Eki ga hirokute, michi ni mayoimashita.〕' },
      ],
    },
  ],
};

const BUOI_3: Lesson = {
  id: 'b17-buoi-3-sugiru-yasui',
  kind: 'review',
  title: 'Buổi 3 — Trong chuyến đi: từ mới cảm nhận & chuẩn bị · ～すぎる · ～やすい／にくい · chữ Hán · できる！',
  goal: 'Học 17 từ cảm nhận và chuẩn bị đi, nói "quá…" bằng ～すぎる (cả ～すぎて nêu lý do) và "dễ / khó …" bằng ～やすい／にくい, đọc nhanh 15 chữ Hán mới, đóng vai một ngày ở Kyoto và giới thiệu 1 phút một nơi nên đến — kiểm tra tổng hợp cuối Bài 17.',
  minutes: 55,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 3 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Ôn đầu giờ (5′)** — なら hay し? 4 câu.',
        '**Từ mới (10′)** — nhóm D (cảm nhận) + nhóm E (chuẩn bị & tiền).',
        '**Ngữ pháp (15′)** — ～すぎる (V／イA／ナA, いい→よすぎる, ～すぎて) · ～やすい／にくい (dễ / khó; dễ bị).',
        '**Chữ Hán (10′)** — 15 chữ mới, đọc nhanh trên bảng.',
        '**できる！ (15′)** — hội thoại ③ + giới thiệu 1 phút một nơi nên đến. Cuối buổi: 6 câu tổng hợp cả Bài 17.',
      ],
    },
    {
      t: 'slides',
      id: 'b17-b3-slides',
      title: 'Bài 17 旅行の計画 — Buổi 3: ～すぎる・～やすい／にくい',
      slides: [
        {
          tieuDe: '{第17課|だいじゅうななか} — {京都|きょうと}で',
          anh: ['luggage', 'world-map', 'person-walking'],
          nhan: ['{重|おも}すぎる', 'わかりやすい', '{歩|ある}きにくい'],
          dong: ['Hôm nay: **nhận xét trong chuyến đi — quá…, dễ…, khó…**'],
          ghi: 'Hai buổi trước là lúc chuẩn bị. Buổi 3 là lúc đang đi: hành lý, bản đồ, đường, đồ ăn — cái gì cũng muốn nhận xét. Hai mẫu hôm nay biến động từ, tính từ thành lời nhận xét.',
        },
        {
          tieuDe: 'Ôn nhanh — なら hay し?',
          anh: ['woman-student', 'man-student'],
          hoi: 'Điền なら hoặc し: (1) {雪|ゆき}＿、{北海道|ほっかいどう}がいいよ。 (2) {近|ちか}い＿、{安|やす}い＿、いいね。 (3) {暇|ひま}＿、{手伝|てつだ}って。 (4) {雨|あめ}だ＿、{寒|さむ}い＿、{家|うち}にいよう。',
          dap: '(1) なら (2) し・し (3) なら (4) し・し',
          ghi: 'Mẹo: なら đứng sau thứ người kia nói rồi tới lời khuyên; し nối các lý do cùng chiều rồi tới kết luận.',
        },
        {
          tieuDe: '{新|あたら}しいことば ① — Cảm nhận',
          anh: ['person-lifting-weights', 'feather', 'anxious-face-with-sweat', 'relieved-face'],
          nhan: ['{重|おも}い', '{軽|かる}い', '{不安|ふあん}（な）', '{安心|あんしん}します'],
          dong: ['{一人|ひとり}で{行|い}くのは{不安|ふあん}です。', '{友達|ともだち}が{一緒|いっしょ}なので、{安心|あんしん}しました。'],
          ro: ['Hitori de iku no wa fuan desu.', 'Tomodachi ga issho na node, anshin shimashita.'],
          ghi: 'Thêm (chưa có hình): 狭い (chật), 楽（な）(đỡ vất vả — khác 楽しい!), 美しい, 素晴らしい, 大勢 (đông người — chỉ cho người), ちょうどいい (vừa đẹp).',
        },
        {
          tieuDe: '{新|あたら}しいことば ② — Chuẩn bị & tiền',
          anh: ['luggage', 'yen-banknote', 'umbrella-with-rain-drops', 'wrapped-gift'],
          nhan: ['スーツケース', '{現金|げんきん}', '{天気予報|てんきよほう}', '{楽|たの}しみ'],
          dong: ['{来週|らいしゅう}の{旅行|りょこう}、{楽|たの}しみにしています。'],
          ro: ['Raishuu no ryokou, tanoshimi ni shite imasu.'],
          ghi: 'Thêm (chưa có hình): 足ります (đủ — nhóm 2: 足りない), 忘れ物 (đồ bỏ quên), 両替します (đổi tiền). Hình ô = trời mưa; câu hay vào đề: 天気予報によると、明日は雨です.',
        },
        {
          tieuDe: '～すぎる — "quá…"',
          anh: ['person-lifting-weights', 'money-with-wings', 'couch-and-lamp'],
          nhan: ['{重|おも}すぎる', '{高|たか}すぎる', '{狭|せま}すぎる'],
          bang: {
            head: ['Gốc', '＋ すぎる', 'Romaji'],
            rows: [
              ['{食|た}べ（ます）', '{食|た}べすぎる', 'tabesugiru'],
              ['{重|おも}（い）', '{重|おも}すぎる', 'omosugiru'],
              ['{静|しず}か（な）', '{静|しず}かすぎる', 'shizukasugiru'],
              ['いい → よ', 'よすぎる', 'yosugiru'],
            ],
          },
          ghi: 'Bỏ ます, bỏ い, bỏ な rồi thêm すぎる. すぎる là động từ nhóm 2: すぎます, すぎません, すぎました, すぎて. Đừng nói とても高すぎる.',
        },
        {
          tieuDe: '～すぎて — "vì quá… nên…"',
          anh: ['steaming-bowl', 'face-with-spiral-eyes'],
          nhan: ['{食|た}べすぎて', 'もう{食|た}べられない'],
          dong: ['お{昼|ひる}を{食|た}べすぎて、もう{食|た}べられません。', '{部屋|へや}が{狭|せま}すぎて、よく{寝|ね}られませんでした。'],
          ro: ['Ohiru o tabesugite, mou taberaremasen.', 'Heya ga semasugite, yoku neraremasen deshita.'],
          hoi: 'Nói: "Đi bộ nhiều quá nên đau chân."',
          dap: '{歩|ある}きすぎて、{足|あし}が{痛|いた}いです。 (Arukisugite, ashi ga itai desu.)',
          ghi: 'Vế sau của すぎて thường là kết quả xấu hoặc "không làm được" (thể khả năng phủ định — Bài 16). Danh từ: 食べすぎ, 飲みすぎ (飲みすぎに注意).',
        },
        {
          tieuDe: '～やすい／～にくい — "dễ / khó"',
          anh: ['world-map', 'running-shoe', 'mountain'],
          nhan: ['わかりやすい', '{歩|ある}きやすい', '{歩|ある}きにくい'],
          dong: ['この{地図|ちず}はわかりやすいです。', 'この{坂|さか}は{歩|ある}きにくいです。'],
          ro: ['Kono chizu wa wakariyasui desu.', 'Kono saka wa arukinikui desu.'],
          ghi: 'Gốc ます + やすい／にくい = tính từ い mới (やすくない, やすかった, やすくて). Chủ ngữ là ĐỒ VẬT / NƠI được nhận xét. ～やすい viết hiragana — không phải 安い (rẻ).',
        },
        {
          tieuDe: '～やすい = "dễ bị…"',
          anh: ['wine-glass', 'face-with-thermometer', 'compass'],
          nhan: ['{割|わ}れやすい', '{風邪|かぜ}をひきやすい', '{迷|まよ}いやすい'],
          dong: ['このコップは{割|わ}れやすいです。', '{祇園|ぎおん}は{道|みち}が{細|ほそ}くて、{迷|まよ}いやすいです。'],
          ro: ['Kono koppu wa wareyasui desu.', 'Gion wa michi ga hosokute, mayoiyasui desu.'],
          ghi: 'Với động từ tự xảy ra (割れる, 壊れる, 迷う, 間違える, 風邪をひく), やすい là khuynh hướng "dễ bị". Ngược lại にくい = "khó bị": 割れにくい = bền, khó vỡ.',
        },
        {
          tieuDe: '⚠ にくい ≠ できない',
          bang: {
            head: ['Câu', 'Nói về', 'Nghĩa'],
            rows: [
              ['この{漢字|かんじ}は{書|か}きにくいです。', 'chữ Hán (vật)', 'chữ này khó viết (nhiều nét…)'],
              ['{私|わたし}は{漢字|かんじ}が{書|か}けません。', 'tôi (người)', 'tôi không viết được'],
              ['この{本|ほん}は{難|むずか}しいです。', 'nội dung', 'sách khó (nội dung)'],
            ],
          },
          ghi: 'Lỗi người Việt hay mắc: dịch "tôi khó viết chữ Hán" thành 私は漢字が書きにくい. Năng lực của người → thể khả năng (Bài 16).',
        },
        {
          tieuDe: '{漢字|かんじ} — 15 chữ mới',
          bang: {
            head: ['N4', 'N3'],
            rows: [
              ['{発|はつ}・{光|こう}・{重|おも}・{軽|かる}', '{港|みなと}・{島|しま}・{湖|みずうみ}・{案|あん}'],
              ['{洋|よう}・{世|せ}・{界|かい}', '{内|ない}・{定|てい}・{指|し}・{側|がわ}'],
            ],
          },
          hoi: 'Đọc to: {出発|しゅっぱつ}・{観光|かんこう}・{世界|せかい}・{空港|くうこう}・{案内|あんない}・{指定席|していせき}・{窓側|まどがわ}・{洋室|ようしつ}',
          dap: 'shuppatsu · kankou · sekai · kuukou · annai · shiteiseki · madogawa · youshitsu',
          ghi: 'Bảy chữ ✍ phải viết được: 発 光 重 世 島 内 定. Bẫy: 重い (nặng) ≠ 思い (ý nghĩ) cùng đọc おもい; 側 sau danh từ đọc がわ.',
        },
        {
          tieuDe: '{会話|かいわ} ③ — Một ngày ở Kyoto',
          anh: ['luggage', 'left-luggage', 'teacup-without-handle'],
          nhan: ['{重|おも}すぎ…', 'コインロッカー', 'お{茶屋|ちゃや}'],
          dong: ['マルコ：そのスーツケース、{重|おも}すぎませんか。', 'アンナ：コインロッカーに{入|い}れれば、{楽|らく}ですよ。', 'パク：この{地図|ちず}、わかりやすいですね。'],
          ro: ['Maruko: Sono suutsukeesu, omosugimasen ka.', 'Anna: Koin rokkaa ni irereba, raku desu yo.', 'Paku: Kono chizu, wakariyasui desu ne.'],
          ghi: 'Đọc to theo vai cả hội thoại ③. Đánh dấu mọi câu có すぎ / やすい / にくい (có 8 chỗ).',
        },
        {
          tieuDe: 'できる！ — Giới thiệu 1 phút',
          anh: ['map-of-japan', 'thinking-face', 'microphone'],
          nhan: ['どこ？', 'どうして？', 'どうやって？'],
          dong: ['{今日|きょう}は＿＿を{紹介|しょうかい}します。', '＿＿し、＿＿し、＿＿。', '＿＿なら、＿＿がおすすめです。', '＿＿ば、＿＿。でも、＿＿すぎますから、＿＿。'],
          ro: ['Kyou wa ___ o shoukai shimasu.', '___ shi, ___ shi, ___.', '___ nara, ___ ga osusume desu.', '___ ba, ___. Demo, ___ sugimasu kara, ___.'],
          hoi: 'Chuẩn bị 2 phút, nói 1 phút về một nơi ở nước bạn. Bạn bên cạnh đếm xem bạn dùng được mấy mẫu (し・なら・ば・すぎる・やすい).',
          dap: 'Ví dụ: {今日|きょう}はホイアンを{紹介|しょうかい}します。{町|まち}がきれいだし、{料理|りょうり}もおいしいし、{夜|よる}はランタンが{美|うつく}しいです。{写真|しゃしん}が{好|す}きなら、{夜|よる}の{町|まち}がおすすめです。{自転車|じてんしゃ}を{借|か}りれば、{一日|いちにち}で{回|まわ}れます。でも、{夏|なつ}は{暑|あつ}すぎますから、{春|はる}に{行|い}ってください。',
          ghi: 'Đủ 4 mẫu = đạt; đủ 5 mẫu, nói không ngắt quá 3 giây = giỏi. Xem bài mẫu đầy đủ ở Luyện nói.',
        },
        {
          tieuDe: 'まとめ — Bài 17',
          anh: ['thumbs-up', 'sparkles'],
          dong: ['～ば · ～ばいいですか · ～なら · ～し、～し · ～すぎる · ～やすい／にくい'],
          ro: ['~ba · ~ba ii desu ka · ~nara · ~shi, ~shi · ~sugiru · ~yasui / nikui'],
          hoi: 'Một câu dùng 3 mẫu: "Nếu định đi Kyoto thì giày dễ đi là tốt, vì dốc nhiều mà đường lại nhỏ."',
          dap: '{京都|きょうと}へ{行|い}くなら、{歩|ある}きやすい{靴|くつ}がいいですよ。{坂|さか}も{多|おお}いし、{道|みち}も{細|ほそ}いし。 (Kyouto e iku nara, arukiyasui kutsu ga ii desu yo. Saka mo ooi shi, michi mo hosoi shi.)',
          ghi: 'Bài về nhà: Ngữ pháp ④⑤, Chữ Hán (đọc không furigana), Luyện nói (ghi âm 6 câu), Viết (bài 150–200 chữ), rồi làm 5 bài Luyện thêm.',
        },
      ],
    },
    { t: 'h', text: 'Slide 1 — Ôn đầu giờ: なら hay し?' },
    {
      t: 'mcq',
      id: 'b17-b3-on',
      title: 'Ôn đầu giờ (4 câu)',
      items: [
        { q: 'A「{日本|にほん}のお{城|しろ}が{見|み}たいです。」B「お{城|しろ}（　）、{姫路城|ひめじじょう}がいいですよ。」', options: ['なら', 'し', 'だし', 'ば'], correct: 0, why: 'Nhận lời → khuyên: **なら**. 〔Oshiro nara, Himejijou ga ii desu yo.〕' },
        { q: 'このホテルは{駅|えき}から{近|ちか}い（　）、{朝|あさ}ご{飯|はん}もおいしいです。', options: ['なら', 'し', 'ば', 'だし'], correct: 1, why: 'Liệt kê ưu điểm: tính từ い + **し**. 〔Eki kara chikai shi, asagohan mo oishii desu.〕' },
        { q: '{今日|きょう}は{日曜日|にちようび}（　）、{観光地|かんこうち}は{混|こ}んでいると{思|おも}います。', options: ['し', 'だし', 'なら', 'ければ'], correct: 1, why: 'Danh từ + **だし** (lý do). 〔Kyou wa nichiyoubi da shi, kankouchi wa konde iru to omoimasu.〕' },
        { q: '{暇|ひま}（　）、{一緒|いっしょ}に{見物|けんぶつ}しませんか。', options: ['だなら', 'なら', 'だし', 'し'], correct: 1, why: 'Tính từ な + **なら** (không có だ). 〔Hima nara, issho ni kenbutsu shimasen ka.〕' },
      ],
    },
    { t: 'h', text: 'Slide 2 — ～すぎる và ～やすい／にくい: luyện nhanh' },
    {
      t: 'quiz',
      id: 'b17-b3-chia',
      title: 'Luyện nhanh — gắn すぎる / やすい / にくい (8 câu)',
      kind: 'fill',
      items: [
        { q: '{重|おも}い → ～すぎます', answers: V('{重|おも}すぎます') },
        { q: '{狭|せま}い → ～すぎて', answers: V('{狭|せま}すぎて') },
        { q: 'いい → ～すぎます', answers: ['よすぎます'] },
        { q: '{不便|ふべん}（な） → ～すぎます', answers: V('{不便|ふべん}すぎます') },
        { q: '{買|か}います → ～すぎました', answers: V('{買|か}いすぎました') },
        { q: 'わかります → ～やすい', answers: ['わかりやすい'] },
        { q: '{歩|ある}きます → ～にくい', answers: V('{歩|ある}きにくい') },
        { q: '{割|わ}れます → ～やすい', answers: V('{割|わ}れやすい') },
      ],
    },
    { t: 'h', text: 'Slide 3 — Chữ Hán mới: đọc nhanh trên bảng' },
    {
      t: 'readkanji',
      id: 'b17-b3-han',
      title: 'Giáo viên chỉ từng từ — cả lớp đọc to (10 câu, không furigana)',
      note: 'Đọc to trong 3 giây; chậm hơn thì quay lại mục Chữ Hán.',
      items: [
        { text: '{出発|しゅっぱつ}は{朝|あさ}{八時|はちじ}です。', ro: 'Shuppatsu wa asa hachiji desu.', vi: 'Giờ xuất phát là 8 giờ sáng.' },
        { text: '{京都|きょうと}を{観光|かんこう}します。', ro: 'Kyouto o kankou shimasu.', vi: 'Tôi tham quan Kyoto.' },
        { text: 'この{荷物|にもつ}は{重|おも}いです。', ro: 'Kono nimotsu wa omoi desu.', vi: 'Hành lý này nặng.' },
        { text: '{軽|かる}いかばんがほしいです。', ro: 'Karui kaban ga hoshii desu.', vi: 'Tôi muốn một cái túi nhẹ.' },
        { text: '{洋室|ようしつ}より{和室|わしつ}が{好|す}きです。', ro: 'Youshitsu yori washitsu ga suki desu.', vi: 'Tôi thích phòng kiểu Nhật hơn phòng kiểu Tây.' },
        { text: '{世界|せかい}を{旅行|りょこう}したいです。', ro: 'Sekai o ryokou shitai desu.', vi: 'Tôi muốn du lịch khắp thế giới.' },
        { text: '{空港|くうこう}から{港|みなと}までバスで{行|い}きます。', ro: 'Kuukou kara minato made basu de ikimasu.', vi: 'Từ sân bay đến cảng đi xe buýt.' },
        { text: '{島|しま}の{近|ちか}くに{湖|みずうみ}があります。', ro: 'Shima no chikaku ni mizuumi ga arimasu.', vi: 'Gần hòn đảo có một cái hồ.' },
        { text: '{駅|えき}の{中|なか}で{案内|あんない}を{見|み}ます。', ro: 'Eki no naka de annai o mimasu.', vi: 'Xem bảng chỉ dẫn trong ga.' },
        { text: '{指定席|していせき}の{窓側|まどがわ}を{予約|よやく}しました。', ro: 'Shiteiseki no madogawa o yoyaku shimashita.', vi: 'Tôi đã đặt ghế đặt trước phía cửa sổ.' },
      ],
    },
    { t: 'h', text: 'Slide 4 — できる！ Hội thoại ③ và giới thiệu 1 phút' },
    DL('Mẫu luyện cặp — trong chuyến đi (thay từ trong bảng dưới)', [
      ['マルコ', 'b', 'その{荷物|にもつ}、{重|おも}すぎませんか。', 'Sono nimotsu, omosugimasen ka.', 'Hành lý đó có nặng quá không?'],
      ['パク', 'c', 'ちょっと{重|おも}いです。お{土産|みやげ}を{買|か}いすぎました。', 'Chotto omoi desu. Omiyage o kaisugimashita.', 'Hơi nặng ạ. Mình mua quá nhiều quà.'],
      ['アンナ', 'a', 'コインロッカーに{入|い}れれば、{楽|らく}ですよ。', 'Koin rokkaa ni irereba, raku desu yo.', 'Bỏ vào tủ gửi đồ thì nhẹ người đấy.'],
      ['パク', 'c', 'そうですね。この{地図|ちず}、わかりやすいですね。', 'Sou desu ne. Kono chizu, wakariyasui desu ne.', 'Đúng rồi. Bản đồ này dễ hiểu nhỉ.'],
    ]),
    {
      t: 'table',
      caption: 'チャレンジ — nhận xét trong chuyến đi: 「＿＿、＿＿すぎませんか。」「＿＿ば、＿＿ですよ。」',
      head: ['Vật / việc', 'Câu than (～すぎる)', 'Lời khuyên (～ば)', 'Nhận xét thêm (～やすい／にくい)'],
      rows: [
        ['{靴|くつ}', 'その{靴|くつ}、{小|ちい}さすぎませんか。', 'あの{店|みせ}で{買|か}えば、{安|やす}いですよ。', 'スニーカーは{歩|ある}きやすいです。'],
        ['ホテル', 'このホテル、{遠|とお}すぎませんか。', 'タクシーで{行|い}けば、{10分|じゅっぷん}ですよ。', '{駅|えき}の{近|ちか}くは{便利|べんり}で、{泊|と}まりやすいです。'],
        ['{料理|りょうり}', 'この{料理|りょうり}、{辛|から}すぎませんか。', '{水|みず}を{飲|の}めば、{大丈夫|だいじょうぶ}ですよ。', '{骨|ほね}が{多|おお}くて、{食|た}べにくいです。'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 3)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '「{高|たか}い」に「すぎる」をつけてください。', ro: '"Takai" ni "sugiru" o tsukete kudasai.', vi: 'Gắn すぎる vào 高い.' },
        { who: 'Bạn', role: 'candidate', text: '「{高|たか}すぎる」です。', ro: '"Takasugiru" desu.', vi: 'Là 高すぎる ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「いい」は？', ro: '"Ii" wa?', vi: 'Còn いい?' },
        { who: 'Bạn', role: 'candidate', text: '「よすぎる」です。', ro: '"Yosugiru" desu.', vi: 'Là よすぎる ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'あなたの{町|まち}は{住|す}みやすいですか。', ro: 'Anata no machi wa sumiyasui desu ka.', vi: 'Thành phố của em có dễ sống không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{住|す}みやすいです。{物価|ぶっか}も{安|やす}いし、{交通|こうつう}も{便利|べんり}ですから。', ro: 'Hai, sumiyasui desu. Bukka mo yasui shi, koutsuu mo benri desu kara.', vi: 'Vâng, dễ sống ạ. Vật giá rẻ, giao thông lại tiện.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{日本語|にほんご}で{何|なに}がいちばん{覚|おぼ}えにくいですか。', ro: 'Nihongo de nani ga ichiban oboenikui desu ka.', vi: 'Trong tiếng Nhật cái gì khó nhớ nhất?' },
        { who: 'Bạn', role: 'candidate', text: '{漢字|かんじ}の{読|よ}み{方|かた}がいちばん{覚|おぼ}えにくいです。{読|よ}み{方|かた}が{多|おお}すぎますから。', ro: 'Kanji no yomikata ga ichiban oboenikui desu. Yomikata ga oosugimasu kara.', vi: 'Cách đọc chữ Hán khó nhớ nhất ạ. Vì nhiều cách đọc quá.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b17-b3-cuoi-bai',
      title: 'Kiểm tra cuối Bài 17 (6 câu — tổng hợp 3 buổi)',
      items: [
        { q: '{予約|よやく}したいんですが、どう（　）いいですか。', options: ['すれば', 'するし', 'するなら', 'しすぎて'], correct: 0, why: '**すれば**いいですか — hỏi chỉ dẫn. 〔Dou sureba ii desu ka.〕' },
        { q: 'A「{海|うみ}がきれいな{所|ところ}に{行|い}きたいです。」B「（　）、{沖縄|おきなわ}がいいですよ。」', options: ['それなら', 'それに', 'それで', 'それから'], correct: 0, why: 'Nhận cả câu của A → **それなら**. それに = hơn nữa (nối lý do). 〔Sore nara, Okinawa ga ii desu yo.〕' },
        { q: '{箱根|はこね}は{近|ちか}い（　）、{温泉|おんせん}もある（　）、{人気|にんき}があります。', options: ['し・し', 'なら・なら', 'ば・ば', 'と・と'], correct: 0, why: 'Liệt kê lý do: **し、し**. 〔Hakone wa chikai shi, onsen mo aru shi, ninki ga arimasu.〕' },
        { q: 'このスーツケースは（　）、{一人|ひとり}で{持|も}てません。', options: ['{重|おも}いすぎて', '{重|おも}すぎて', '{重|おも}くすぎて', '{重|おも}すぎで'], correct: 1, why: 'Bỏ い + **すぎて**. 〔Omosugite, hitori de motemasen.〕' },
        { q: 'この{地図|ちず}は{字|じ}が{大|おお}きくて、{見|み}（　）です。', options: ['すぎ', 'やすい', 'にくい', 'なら'], correct: 1, why: 'Chữ to → **{見|み}やすい** (dễ nhìn). 〔Kono chizu wa ji ga ookikute, miyasui desu.〕' },
        { q: '「{窓側|まどがわ}」の{読|よ}み{方|かた}は？', options: ['まどそく', 'まどかわ', 'まどがわ', 'そうがわ'], correct: 2, why: '**まどがわ** (madogawa) — 側 sau danh từ đọc がわ.' },
      ],
    },
  ],
};

/* ═══════════════════════ ③ LUYỆN THÊM — DỄ → KHÓ ═══════════════════════ */

type Mcq = Extract<Block, { t: 'mcq' }>['items'][number];

/** Bộ từ cho trắc nghiệm Nhật → Việt / Việt → Nhật (lấy đúng 50 từ của mục Từ vựng). */
const TU_LT: [w: string, ro: string, vi: string][] = [
  ['{旅行会社|りょこうがいしゃ}', 'ryokougaisha', 'công ty du lịch'],
  ['{相談|そうだん}します', 'soudan shimasu', 'bàn bạc, hỏi ý kiến'],
  ['{調|しら}べます', 'shirabemasu', 'tra cứu, tìm hiểu'],
  ['ガイドブック', 'gaidobukku', 'sách hướng dẫn du lịch'],
  ['{連休|れんきゅう}', 'renkyuu', 'kỳ nghỉ dài'],
  ['{日帰|ひがえ}り', 'higaeri', 'đi về trong ngày'],
  ['{1泊|いっぱく}', 'ippaku', 'một đêm (ngủ lại)'],
  ['{旅館|りょかん}', 'ryokan', 'nhà trọ kiểu Nhật'],
  ['{和室|わしつ}', 'washitsu', 'phòng kiểu Nhật (chiếu tatami)'],
  ['{予算|よさん}', 'yosan', 'ngân sách'],
  ['{割引|わりびき}', 'waribiki', 'giảm giá'],
  ['キャンセルします', 'kyanseru shimasu', 'huỷ (đặt chỗ)'],
  ['{空|あ}いています', 'aite imasu', '(chỗ, phòng) còn trống'],
  ['{特急|とっきゅう}', 'tokkyuu', 'tàu tốc hành đặc biệt'],
  ['{指定席|していせき}', 'shiteiseki', 'ghế đặt trước'],
  ['{往復|おうふく}', 'oufuku', 'khứ hồi'],
  ['{窓側|まどがわ}', 'madogawa', 'phía cửa sổ'],
  ['{空港|くうこう}', 'kuukou', 'sân bay'],
  ['{出発|しゅっぱつ}します', 'shuppatsu shimasu', 'xuất phát, khởi hành'],
  ['{乗|の}り{換|か}えます', 'norikaemasu', 'đổi tàu'],
  ['{迷|まよ}います', 'mayoimasu', 'lạc (đường); phân vân'],
  ['{観光|かんこう}します', 'kankou shimasu', 'tham quan'],
  ['{観光地|かんこうち}', 'kankouchi', 'điểm du lịch'],
  ['{案内|あんない}します', 'annai shimasu', 'hướng dẫn, dẫn đường'],
  ['{名所|めいしょ}', 'meisho', 'danh lam, nơi nổi tiếng'],
  ['{名物|めいぶつ}', 'meibutsu', 'đặc sản'],
  ['{体験|たいけん}します', 'taiken shimasu', 'trải nghiệm'],
  ['{世界|せかい}', 'sekai', 'thế giới'],
  ['{自然|しぜん}', 'shizen', 'thiên nhiên'],
  ['{島|しま}', 'shima', 'hòn đảo'],
  ['{湖|みずうみ}', 'mizuumi', 'hồ'],
  ['{港|みなと}', 'minato', 'cảng biển'],
  ['{夜景|やけい}', 'yakei', 'cảnh đêm'],
  ['{美|うつく}しい', 'utsukushii', 'đẹp (trang trọng)'],
  ['{素晴|すば}らしい', 'subarashii', 'tuyệt vời'],
  ['{重|おも}い', 'omoi', 'nặng'],
  ['{軽|かる}い', 'karui', 'nhẹ'],
  ['{狭|せま}い', 'semai', 'chật, hẹp'],
  ['{楽|らく}（な）', 'raku (na)', 'đỡ vất vả, thoải mái'],
  ['{不安|ふあん}（な）', 'fuan (na)', 'lo lắng, bất an'],
  ['{安心|あんしん}します', 'anshin shimasu', 'yên tâm'],
  ['{大勢|おおぜい}', 'oozei', 'đông người'],
  ['ちょうどいい', 'choudo ii', 'vừa vặn, vừa đẹp'],
  ['{足|た}ります', 'tarimasu', 'đủ'],
  ['スーツケース', 'suutsukeesu', 'vali'],
  ['{忘|わす}れ{物|もの}', 'wasuremono', 'đồ bỏ quên'],
  ['{現金|げんきん}', 'genkin', 'tiền mặt'],
  ['{両替|りょうがえ}します', 'ryougae shimasu', 'đổi tiền'],
  ['{天気予報|てんきよほう}', 'tenki yohou', 'dự báo thời tiết'],
  ['{楽|たの}しみ', 'tanoshimi', 'niềm háo hức mong chờ'],
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
  id: 'b17-lt-1-tu-vung',
  kind: 'homework',
  title: 'Luyện thêm 1 · Từ vựng — 🟢 nhận mặt → 🟡 điền câu (40 câu)',
  goal: 'Nhớ chắc 50 từ của Bài 17 theo hai chiều (Nhật → Việt, Việt → Nhật) rồi chọn đúng từ trong câu.',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟢 Mức Dễ** — 25 câu Nhật → Việt và Việt → Nhật. Sai câu nào: đọc to từ đó 3 lần (romaji có ngay trong câu hỏi).',
        '**🟡 Mức Vừa** — 15 câu điền từ vào câu, đúng dạng 文脈規定 của đề N4.',
        'Lỗi hay mắc: {空|あ}いている↔{空|す}いている, {楽|らく}↔{楽|たの}しい, {観光|かんこう}↔{旅行|りょこう}, {体験|たいけん}↔{経験|けいけん}, {大勢|おおぜい}↔たくさん, {名物|めいぶつ}↔{名所|めいしょ}.',
      ],
    },
    { t: 'h', text: '🟢 Mức 1 — Dễ: nhìn từ → nghĩa; nghe nghĩa → từ' },
    { t: 'mcq', id: 'b17-lt1-nv', title: 'Nhật → Việt (15 câu)', items: MCQ_NV(0, 15) },
    { t: 'mcq', id: 'b17-lt1-vn', title: 'Việt → Nhật (10 câu)', items: MCQ_VN(30, 40) },
    { t: 'h', text: '🟡 Mức 2 — Vừa: chọn từ hợp với câu (文脈規定)' },
    {
      t: 'mcq',
      id: 'b17-lt1-dien',
      title: 'Điền từ (15 câu)',
      items: [
        { q: '{旅行|りょこう}のことを{友達|ともだち}に（　）しました。', options: ['{相談|そうだん}', '{両替|りょうがえ}', '{出発|しゅっぱつ}', '{安心|あんしん}'], correct: 0, why: 'Bàn chuyện với bạn = **{相談|そうだん}する** (người に). 〔Ryokou no koto o tomodachi ni soudan shimashita.〕' },
        { q: '{今度|こんど}の（　）は{5日間|いつかかん}もあります。どこかへ{行|い}きたいです。', options: ['{連休|れんきゅう}', '{予算|よさん}', '{日帰|ひがえ}り', '{割引|わりびき}'], correct: 0, why: 'Nhiều ngày nghỉ liền = **{連休|れんきゅう}**. 〔Kondo no renkyuu wa itsukakan mo arimasu.〕' },
        { q: '{東京|とうきょう}から{近|ちか}いですから、（　）で{行|い}けます。', options: ['{日帰|ひがえ}り', '{往復|おうふく}', '{1泊|いっぱく}', '{連休|れんきゅう}'], correct: 0, why: 'Gần → đi về trong ngày được: **{日帰|ひがえ}り**. 〔Higaeri de ikemasu.〕' },
        { q: 'ベッドじゃなくて、{畳|たたみ}の{部屋|へや}がいいです。（　）をお{願|ねが}いします。', options: ['{洋室|ようしつ}', '{和室|わしつ}', '{指定席|していせき}', '{窓側|まどがわ}'], correct: 1, why: 'Phòng chiếu tatami = **{和室|わしつ}**. 〔Washitsu o onegai shimasu.〕' },
        { q: '{台風|たいふう}が{来|く}るので、ホテルを（　）しました。', options: ['キャンセル', '{予約|よやく}', '{案内|あんない}', '{体験|たいけん}'], correct: 0, why: 'Bão đến → **huỷ** phòng: キャンセル. 〔Hoteru o kyanseru shimashita.〕' },
        { q: '{電車|でんしゃ}が{混|こ}んでいて、{席|せき}が{一|ひと}つも（　）いません。', options: ['{空|あ}いて', '{足|た}りて', '{迷|まよ}って', '{調|しら}べて'], correct: 0, why: 'Không còn ghế trống = **{空|あ}いていない**. 〔Seki ga hitotsu mo aite imasen.〕' },
        { q: '{景色|けしき}が{見|み}たいので、（　）の{席|せき}をお{願|ねが}いします。', options: ['{通路側|つうろがわ}', '{窓側|まどがわ}', '{自由席|じゆうせき}', '{片道|かたみち}'], correct: 1, why: 'Muốn ngắm cảnh → ghế **{窓側|まどがわ}**. 〔Madogawa no seki o onegai shimasu.〕' },
        { q: '{大阪|おおさか}で{特急|とっきゅう}に（　）ください。', options: ['{乗|の}り{換|か}えて', '{迷|まよ}って', '{出発|しゅっぱつ}して', '{足|た}りて'], correct: 0, why: 'AでBに **{乗|の}り{換|か}える**. 〔Oosaka de tokkyuu ni norikaete kudasai.〕' },
        { q: '{友達|ともだち}が{京都|きょうと}のお{寺|てら}を（　）してくれました。', options: ['{案内|あんない}', '{相談|そうだん}', '{両替|りょうがえ}', '{出発|しゅっぱつ}'], correct: 0, why: 'Dẫn đi tham quan = **{案内|あんない}する**. 〔Tomodachi ga Kyouto no otera o annai shite kuremashita.〕' },
        { q: '{北海道|ほっかいどう}は{山|やま}や{湖|みずうみ}が{多|おお}くて、（　）が{豊|ゆた}かです。', options: ['{自然|しぜん}', '{世界|せかい}', '{夜景|やけい}', '{名物|めいぶつ}'], correct: 0, why: 'Núi, hồ → **{自然|しぜん}** (thiên nhiên) phong phú. 〔Shizen ga yutaka desu.〕' },
        { q: '{山|やま}の{上|うえ}から{見|み}る{町|まち}の（　）はとてもきれいでした。{夜|よる}{10時|じゅうじ}まで{見|み}ていました。', options: ['{夜景|やけい}', '{名所|めいしょ}', '{自然|しぜん}', '{島|しま}'], correct: 0, why: 'Ngắm phố về đêm = **{夜景|やけい}**. 〔Machi no yakei wa totemo kirei deshita.〕' },
        { q: 'コンビニで{袋|ふくろ}を{買|か}ったら、お{金|かね}が{少|すこ}し（　）なかったです。', options: ['{足|た}り', '{空|あ}か', '{迷|まよ}わ', '{調|しら}べ'], correct: 0, why: 'Thiếu tiền = **{足|た}りない** (足りる nhóm 2: 足り + なかった). 〔Okane ga sukoshi tarinakatta desu.〕' },
        { q: '{空港|くうこう}でドンを{円|えん}に（　）しました。', options: ['{両替|りょうがえ}', '{予約|よやく}', '{割引|わりびき}', '{安心|あんしん}'], correct: 0, why: '**AをBに{両替|りょうがえ}する** = đổi tiền. 〔Don o en ni ryougae shimashita.〕' },
        { q: '{電車|でんしゃ}の{中|なか}に（　）をしました。{傘|かさ}です。', options: ['{忘|わす}れ{物|もの}', 'お{土産|みやげ}', '{名物|めいぶつ}', '{現金|げんきん}'], correct: 0, why: 'Để quên ô trên tàu = **{忘|わす}れ{物|もの}をする**. 〔Densha no naka ni wasuremono o shimashita.〕' },
        { q: '{友達|ともだち}が{一緒|いっしょ}に{来|き}てくれたので、（　）しました。', options: ['{安心|あんしん}', '{不安|ふあん}', '{迷|まよ}い', '{相談|そうだん}'], correct: 0, why: 'Có bạn đi cùng → **{安心|あんしん}する** (yên tâm). 〔Anshin shimashita.〕' },
      ],
    },
  ],
};

const LT_2: Lesson = {
  id: 'b17-lt-2-han-tu',
  kind: 'homework',
  title: 'Luyện thêm 2 · Chữ Hán — 🟢 đọc → 🟡 chọn chữ → 🔴 chữ giống, đồng âm (22 câu)',
  goal: 'Đọc và viết đúng 15 chữ Hán mới trong từ: chọn cách đọc, chọn chữ đúng cho từ viết kana, phân biệt chữ trông giống và từ đồng âm.',
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
      id: 'b17-lt2-doc',
      title: '🟢 漢字読み — cách đọc của từ in đậm (10 câu)',
      items: [
        { q: '**発表**は{来週|らいしゅう}です。', options: ['はっぴょう', 'はつひょう', 'はっひょう', 'ほっぴょう'], correct: 0, why: '**{発表|はっぴょう}** (happyou) — 発 ハツ → はっ + 表 ヒョウ → ぴょう.' },
        { q: '**光**がきれいです。', options: ['ひかり', 'ひか', 'こう', 'あかり'], correct: 0, why: '**{光|ひかり}** (hikari) — đứng riêng đọc kun.' },
        { q: '**体重**を{量|はか}ります。', options: ['たいおも', 'たいじゅう', 'からだじゅう', 'たいちょう'], correct: 1, why: '**{体重|たいじゅう}** (taijuu) — cân nặng; 重 ジュウ.' },
        { q: '**洋服**を{買|か}いました。', options: ['ようふく', 'わふく', 'ようぶく', 'ようふ'], correct: 0, why: '**{洋服|ようふく}** (youfuku) — quần áo kiểu Tây.' },
        { q: '**世界中**から{観光客|かんこうきゃく}が{来|き}ます。', options: ['せかいなか', 'せかいじゅう', 'せいかいじゅう', 'よかいじゅう'], correct: 1, why: '**{世界中|せかいじゅう}** (sekaijuu) — 中 đọc じゅう = "khắp".' },
        { q: '**半島**の{先|さき}に{灯台|とうだい}があります。', options: ['はんしま', 'はんとう', 'はんじま', 'はんどう'], correct: 1, why: '**{半島|はんとう}** (hantou) — bán đảo; 島 On トウ.' },
        { q: '**国内**{旅行|りょこう}が{好|す}きです。', options: ['こくうち', 'くにない', 'こくない', 'こくだい'], correct: 2, why: '**{国内|こくない}** (kokunai) — trong nước.' },
        { q: '**定食**を{食|た}べました。', options: ['ていしょく', 'じょうしょく', 'ていじき', 'さだしょく'], correct: 0, why: '**{定食|ていしょく}** (teishoku) — suất cơm phần.' },
        { q: '**指**が{痛|いた}いです。', options: ['て', 'ゆび', 'し', 'あし'], correct: 1, why: '**{指|ゆび}** (yubi) — ngón tay.' },
        { q: '{道|みち}の**右側**を{歩|ある}いてください。', options: ['みぎそく', 'うそく', 'みぎがわ', 'みぎかわ'], correct: 2, why: '**{右側|みぎがわ}** (migigawa) — 側 đọc がわ sau danh từ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b17-lt2-chon',
      title: '🟡 表記 — chọn chữ Hán đúng (8 câu)',
      items: [
        { q: '**かんこう**バスに{乗|の}ります。', options: ['観光', '観行', '感光', '館光'], correct: 0, why: '**観光** — 観 (xem) + 光 (ánh sáng).' },
        { q: '**たいじゅう**が{増|ふ}えました。', options: ['休重', '体重', '体動', '体量'], correct: 1, why: '**体重** — 体 (thân) + 重 (nặng). 休 (nghỉ) trông giống 体!' },
        { q: '**ようしつ**を{予約|よやく}しました。', options: ['洋室', '羊室', '洋屋', '様室'], correct: 0, why: '**洋室** — 洋 có 氵. 羊 (con dê) là phần bên phải.' },
        { q: '**みなと**に{船|ふね}が{着|つ}きました。', options: ['湖', '港', '巷', '浅'], correct: 1, why: '**港** = 氵 + 巷. 湖 là hồ.' },
        { q: '**みずうみ**で{泳|およ}ぎました。', options: ['湖', '海', '池', '港'], correct: 0, why: '**湖** (みずうみ). 海 = biển, 池 = ao.' },
        { q: '**あんない**{所|じょ}はどこですか。', options: ['案内', '安内', '案肉', '按内'], correct: 0, why: '**案内** — 案 = 安 + 木.' },
        { q: '**していせき**を{取|と}りました。', options: ['指定席', '支定席', '指足席', '指定度'], correct: 0, why: '**指定席** — 指 (扌) + 定 (宀) + 席 (khăn trên ghế). 度 trông giống 席!' },
        { q: '**つうろがわ**の{席|せき}です。', options: ['通路則', '通路側', '通路測', '通露側'], correct: 1, why: '**通路側** — 側 có 亻. 則 (quy tắc), 測 (đo) trông giống.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b17-lt2-bay',
      title: '🔴 Chữ giống & đồng âm (4 câu)',
      items: [
        { q: '「このかばんは**おもい**です。」— chữ nào?', options: ['重い', '思い', '想い', '主い'], correct: 0, why: 'Nặng = **重い**. 思い (おもい) = ý nghĩ — đồng âm, khác chữ.' },
        { q: '「**かるい**」と「**くるま**」— hai chữ có chung bộ nào?', options: ['車', '圣', '亻', '氵'], correct: 0, why: '**軽** (nhẹ) có bộ **車** (xe) bên trái — "xe nhẹ".' },
        { q: 'Chữ nào KHÔNG có bộ 氵 (nước)?', options: ['港', '湖', '洋', '発'], correct: 3, why: '**発** có 癶 ở trên; 港・湖・洋 đều có 氵.' },
        { q: '「{鳥|とり}」と「{島|しま}」— khác nhau ở đâu?', options: ['島 có 山 ở dưới, bỏ bớt chân của 鳥', '島 có 氵', '島 có 木', 'Không khác'], correct: 0, why: '**島** = 鳥 (bỏ chân) + **山**: chim đậu trên núi giữa biển.' },
      ],
    },
  ],
};

const LT_3: Lesson = {
  id: 'b17-lt-3-chia-the',
  kind: 'homework',
  title: 'Luyện thêm 3 · Chia dạng — 🟢 ～ば → 🟡 ～すぎる・～やすい → 🔴 chọn dạng đúng (28 câu)',
  goal: 'Chia nhanh, đúng thể ～ば (cả phủ định), gắn ～すぎる và ～やすい／にくい vào động từ / tính từ, và nhận ra dạng sai mà đề hay cài.',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟢** 10 câu gõ thể ～ば. **🟡** 10 câu gắn すぎる / やすい / にくい. **🔴** 8 câu chọn dạng đúng (bẫy).',
        'Ba chữ phải thuộc: **すれば · {来|く}れば · よければ** — và hai cặp ngược nhau: **なら (không だ) ↔ だし (có だ)**.',
      ],
    },
    {
      t: 'quiz',
      id: 'b17-lt3-ba',
      title: '🟢 Gõ thể ～ば (10 câu)',
      kind: 'fill',
      grammar: 'nhóm 1 う→え+ば · nhóm 2 る→れば · する→すれば · 来る→来れば · イA い→ければ · ナA/N なら · ない→なければ',
      items: [
        { q: '{会|あ}う', answers: V('{会|あ}えば'), hint: 'う → え + ば' },
        { q: '{泳|およ}ぐ', answers: V('{泳|およ}げば'), hint: 'ぐ → げ' },
        { q: '{遊|あそ}ぶ', answers: V('{遊|あそ}べば'), hint: 'ぶ → べ' },
        { q: '{帰|かえ}る (nhóm 1!)', answers: V('{帰|かえ}れば'), hint: 'る → れ' },
        { q: '{起|お}きる', answers: V('{起|お}きれば'), hint: 'nhóm 2: る → れば' },
        { q: '{持|も}って{来|く}る', answers: V('{持|も}って{来|く}れば'), hint: 'くれば' },
        { q: '{寒|さむ}い', answers: V('{寒|さむ}ければ'), hint: 'い → ければ' },
        { q: '{便利|べんり}（な）', answers: V('{便利|べんり}なら', '{便利|べんり}ならば'), hint: 'なら' },
        { q: '{行|い}かない', answers: V('{行|い}かなければ'), hint: 'ない → なければ' },
        { q: '{高|たか}くない', answers: V('{高|たか}くなければ'), hint: 'ない → なければ' },
      ],
    },
    {
      t: 'quiz',
      id: 'b17-lt3-sugi',
      title: '🟡 Gắn ～すぎる・～やすい・～にくい (10 câu)',
      kind: 'fill',
      grammar: 'Vます／イA（‑い）／ナA ＋ すぎる · Vます ＋ やすい／にくい',
      items: [
        { q: '{辛|から}い + すぎます', answers: V('{辛|から}すぎます'), hint: 'bỏ い' },
        { q: '{簡単|かんたん}（な） + すぎます', answers: V('{簡単|かんたん}すぎます'), hint: 'bỏ な' },
        { q: '{寝|ね}ます + すぎました', answers: V('{寝|ね}すぎました'), hint: 'gốc ます: 寝' },
        { q: '{多|おお}い + すぎて', answers: V('{多|おお}すぎて'), hint: 'bỏ い' },
        { q: 'いい + すぎます', answers: ['よすぎます'], hint: 'いい → よ' },
        { q: '{使|つか}います + やすい', answers: V('{使|つか}いやすい'), hint: 'gốc ます: 使い' },
        { q: '{覚|おぼ}えます + にくい', answers: V('{覚|おぼ}えにくい'), hint: 'gốc ます: 覚え' },
        { q: '{住|す}みます + やすい (quá khứ, lịch sự)', answers: V('{住|す}みやすかったです'), hint: 'chia như イA: ～かったです' },
        { q: '{読|よ}みます + にくい (phủ định, lịch sự)', answers: V('{読|よ}みにくくないです', '{読|よ}みにくくありません'), hint: '～くないです' },
        { q: '{運転|うんてん}します + やすい', answers: V('{運転|うんてん}しやすい'), hint: 'gốc ます: し' },
      ],
    },
    {
      t: 'mcq',
      id: 'b17-lt3-bay',
      title: '🔴 Chọn dạng đúng — bẫy hay gặp (8 câu)',
      items: [
        { q: '{来|く}る → thể ば', options: ['{来|こ}れば', '{来|き}れば', '{来|く}れば', '{来|く}るば'], correct: 2, why: '**{来|く}れば** (kureba).' },
        { q: 'いい → thể ば', options: ['いければ', 'よければ', 'いいば', 'いいなら'], correct: 1, why: '**よければ** — いい chia từ よい.' },
        { q: '{静|しず}か → thể ば', options: ['{静|しず}かければ', '{静|しず}かだなら', '{静|しず}かなら', '{静|しず}かれば'], correct: 2, why: 'Tính từ な + **なら** (không だ).' },
        { q: '{高|たか}い + すぎる', options: ['{高|たか}いすぎる', '{高|たか}すぎる', '{高|たか}くすぎる', '{高|たか}さすぎる'], correct: 1, why: 'Bỏ い: **{高|たか}すぎる**.' },
        { q: '{少|すく}ない + すぎる', options: ['{少|すく}なさすぎる', '{少|すく}なすぎる', '{少|すく}ないすぎる', '{少|すく}なくすぎる'], correct: 1, why: '{少|すく}ない là tính từ い thường → bỏ い: **{少|すく}なすぎる**. Chỉ ない đứng riêng mới thành なさすぎる.' },
        { q: '{雨|あめ} + し', options: ['{雨|あめ}し', '{雨|あめ}だし', '{雨|あめ}なし', '{雨|あめ}のし'], correct: 1, why: 'Danh từ + **だし**.' },
        { q: 'わかる + やすい', options: ['わかるやすい', 'わかりやすい', 'わかってやすい', 'わかれやすい'], correct: 1, why: 'Gốc ます: **わかりやすい**.' },
        { q: 'わかりやすい → phủ định', options: ['わかりやすいじゃない', 'わかりやすくない', 'わかりにくくない', 'わかりやすくなかった'], correct: 1, why: 'Chia như tính từ い: **わかりやすくない**. (わかりやすくなかった là quá khứ phủ định.)' },
      ],
    },
  ],
};

const LT_4: Lesson = {
  id: 'b17-lt-4-ngu-phap',
  kind: 'homework',
  title: 'Luyện thêm 4 · Ngữ pháp — 🟡 chọn と・ば・たら・なら → 🔴 し・すぎる・やすい trong câu (30 câu)',
  goal: 'Chọn đúng một trong bốn cách nói "nếu" theo ngữ cảnh, dùng ～し, ～すぎる, ～やすい／にくい đúng nghĩa trong câu, và điền mẫu phù hợp — đúng dạng 文法形式の判断 của đề N4.',
  minutes: 35,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟡** 12 câu chọn と／ば／たら／なら — mở bảng phân biệt cuối Ngữ pháp nếu sai quá 3 câu.',
        '**🔴** 10 câu し・すぎる・やすい／にくい + 8 câu gõ điền.',
        'Mẹo: "どう＿いいですか" → ば · vế sau ～てください + vế trước hành động → たら · đáp lời người kia → なら · máy móc, chỉ đường → と.',
      ],
    },
    {
      t: 'mcq',
      id: 'b17-lt4-neu',
      title: '🟡 と・ば・たら・なら (12 câu)',
      items: [
        { q: '{春|はる}に（　）、{桜|さくら}が{咲|さ}きます。', options: ['なると', 'なるなら', 'なるし', 'なりすぎて'], correct: 0, why: 'Quy luật tự nhiên → **と** (なれば cũng đúng, nhưng không có trong lựa chọn). 〔Haru ni naru to, sakura ga sakimasu.〕' },
        { q: '{仕事|しごと}が（　）、{飲|の}みに{行|い}きましょう。', options: ['{終|お}われば', '{終|お}わったら', '{終|お}わるなら', '{終|お}わると'], correct: 1, why: 'Hành động + rủ → **たら**. 〔Shigoto ga owattara, nomi ni ikimashou.〕' },
        { q: '{分|わ}からない{言葉|ことば}は、{辞書|じしょ}で（　）いいですよ。', options: ['{調|しら}べれば', '{調|しら}べすぎて', '{調|しら}べるなら', '{調|しら}べたし'], correct: 0, why: 'Khuyên "cứ … là được" → **～ばいい**. 〔Jisho de shirabereba ii desu yo.〕' },
        { q: 'A「{日本|にほん}の{歴史|れきし}を{勉強|べんきょう}したいんです。」B「{歴史|れきし}（　）、{本田先生|ほんだせんせい}に{聞|き}いてください。」', options: ['と', 'なら', 'ば', 'たら'], correct: 1, why: 'Nhận chủ đề → **なら**. 〔Rekishi nara, Honda-sensei ni kiite kudasai.〕' },
        { q: '{車|くるま}を（　）なら、お{酒|さけ}を{飲|の}まないでください。', options: ['{運転|うんてん}する', '{運転|うんてん}した', '{運転|うんてん}すれば', '{運転|うんてん}して'], correct: 0, why: 'Định lái xe (việc sau) → đừng uống (trước) → **V{辞書形|じしょけい}なら**. 〔Kuruma o unten suru nara, osake o nomanaide kudasai.〕' },
        { q: 'この{薬|くすり}を（　）、{熱|ねつ}が{下|さ}がりますよ。', options: ['{飲|の}めば', '{飲|の}むなら', '{飲|の}みすぎて', '{飲|の}むし'], correct: 0, why: 'Điều kiện → kết quả → **ば**. 〔Kono kusuri o nomeba, netsu ga sagarimasu yo.〕' },
        { q: '{日本|にほん}に（　）、{一緒|いっしょ}にラーメンを{食|た}べに{行|い}こうね。', options: ['{来|く}れば', '{来|き}たら', '{来|く}るし', '{来|く}ると'], correct: 1, why: 'Sau khi đến Nhật + rủ → **たら**. 〔Nihon ni kitara, issho ni raamen o tabe ni ikou ne.〕' },
        { q: 'A「{寒|さむ}いですね。」B「（　）、{窓|まど}を{閉|し}めましょうか。」', options: ['それに', 'それなら', 'それで', 'それから'], correct: 1, why: 'Nhận câu của A → **それなら**. 〔Sore nara, mado o shimemashou ka.〕' },
        { q: 'あのかどを{左|ひだり}に{曲|ま}がる（　）、{郵便局|ゆうびんきょく}があります。', options: ['と', 'なら', 'し', 'すぎて'], correct: 0, why: 'Chỉ đường → **と**. 〔Ano kado o hidari ni magaru to, yuubinkyoku ga arimasu.〕' },
        { q: 'お{金|かね}が（　）、{新|あたら}しいパソコンを{買|か}いたいです。', options: ['あれば', 'ありすぎて', 'あると', 'あるし'], correct: 0, why: 'Trạng thái (ある) + mong muốn → **ば** được. 〔Okane ga areba, atarashii pasokon o kaitai desu.〕' },
        { q: '{来年|らいねん}{日本|にほん}へ{留学|りゅうがく}する（　）、{今|いま}から{日本語|にほんご}を{勉強|べんきょう}したほうがいいです。', options: ['と', 'なら', 'たら', 'ば'], correct: 1, why: 'Học trước khi đi du học → **V{辞書形|じしょけい}なら**. 〔Rainen Nihon e ryuugaku suru nara, ima kara nihongo o benkyou shita hou ga ii desu.〕' },
        { q: '{空港|くうこう}に（　）、{連絡|れんらく}してください。', options: ['{着|つ}けば', '{着|つ}いたら', '{着|つ}くなら', '{着|つ}くと'], correct: 1, why: 'Hành động + nhờ → **たら**. 〔Kuukou ni tsuitara, renraku shite kudasai.〕' },
      ],
    },
    {
      t: 'mcq',
      id: 'b17-lt4-nhanxet',
      title: '🔴 ～し・～すぎる・～やすい／にくい trong câu (10 câu)',
      items: [
        { q: 'あの{店|みせ}は{安|やす}い（　）、おいしいし、いつも{混|こ}んでいます。', options: ['し', 'なら', 'すぎて', 'ば'], correct: 0, why: 'Liệt kê lý do → **し**. 〔Ano mise wa yasui shi, oishii shi, itsumo konde imasu.〕' },
        { q: '{今日|きょう}は{疲|つか}れた（　）、{早|はや}く{寝|ね}よう。', options: ['し', 'すぎ', 'やすい', 'ば'], correct: 0, why: 'Một し nêu lý do nhẹ. 〔Kyou wa tsukareta shi, hayaku neyou.〕' },
        { q: '{夜|よる}、コーヒーを{飲|の}み（　）、{寝|ね}られませんでした。', options: ['やすくて', 'すぎて', 'にくくて', 'なら'], correct: 1, why: 'Uống quá nhiều → không ngủ được → **すぎて**. 〔Koohii o nomisugite, neraremasen deshita.〕' },
        { q: 'この{問題|もんだい}は{簡単|かんたん}（　）、すぐ{終|お}わりました。', options: ['すぎて', 'やすくて', 'にくくて', 'し'], correct: 0, why: 'Tính từ な + **すぎて** (dễ quá). 〔Kono mondai wa kantansugite, sugu owarimashita.〕' },
        { q: 'このペンは{細|ほそ}くて、{書|か}き（　）です。', options: ['すぎ', 'にくい', 'なら', 'し'], correct: 1, why: 'Bút mảnh → **khó viết**: {書|か}きにくい. 〔Kono pen wa hosokute, kakinikui desu.〕' },
        { q: '{雪|ゆき}の{日|ひ}は{道|みち}が{滑|すべ}り（　）ですから、{気|き}をつけてください。', options: ['やすい', 'にくい', 'すぎ', 'し'], correct: 0, why: 'Khuynh hướng "dễ trơn" → **{滑|すべ}りやすい**. 〔Michi ga suberiyasui desu kara.〕' },
        { q: '{田中|たなか}さんの{説明|せつめい}は（　）、よくわかりました。', options: ['わかりやすくて', 'わかりにくくて', 'わかりすぎて', 'わかるし'], correct: 0, why: 'Hiểu rõ → giải thích **dễ hiểu**: わかりやすくて. 〔Setsumei wa wakariyasukute, yoku wakarimashita.〕' },
        { q: 'このかばんは{丈夫|じょうぶ}で、{壊|こわ}れ（　）です。', options: ['やすい', 'にくい', 'すぎ', 'なら'], correct: 1, why: 'Chắc chắn → **khó hỏng**: {壊|こわ}れにくい. 〔Kono kaban wa joubu de, kowarenikui desu.〕' },
        { q: '{部屋|へや}が（　）すぎて、{3人|さんにん}は{泊|と}まれません。', options: ['{狭|せま}', '{狭|せま}い', '{狭|せま}く', '{狭|せま}くて'], correct: 0, why: 'Bỏ い + すぎて: **{狭|せま}すぎて**. 〔Heya ga semasugite, sannin wa tomaremasen.〕' },
        { q: '{私|わたし}は{漢字|かんじ}がまだ（　）。', options: ['{書|か}きにくいです', '{書|か}けません', '{書|か}きすぎます', '{書|か}きやすいです'], correct: 1, why: 'Năng lực của NGƯỜI → thể khả năng: **{書|か}けません**. ～にくい chỉ nhận xét vật. 〔Watashi wa kanji ga mada kakemasen.〕' },
      ],
    },
    {
      t: 'quiz',
      id: 'b17-lt4-dien',
      title: '🔴 Gõ điền — dùng đúng mẫu (8 câu)',
      kind: 'fill',
      grammar: '～ば · ～ばいい · ～なら · ～し · ～すぎる · ～やすい／にくい',
      items: [
        { q: '{安|やす}（い → nếu）、{三|みっ}つ{買|か}います。', answers: V('{安|やす}ければ'), hint: 'い → ければ' },
        { q: 'どこで{乗|の}り{換|か}え（　）いいですか。', answers: ['れば'], hint: 'nhóm 2: る → れば' },
        { q: 'A「パンを{買|か}いたいです。」B「パン（　）、あのお{店|みせ}がおいしいですよ。」', answers: ['なら'], hint: 'nhận lời người kia' },
        { q: 'この{部屋|へや}は{広|ひろ}い（　）、{明|あか}るいし、いいですね。', answers: ['し'], hint: '～し、～し' },
        { q: 'この{町|まち}は{有名|ゆうめい}じゃない（　）、{人|ひと}も{少|すく}ないです。', answers: ['し'], hint: 'thể thường + し' },
        { q: 'お{酒|さけ}を{飲|の}み（　）て、{頭|あたま}が{痛|いた}いです。', answers: ['すぎ'], hint: '～すぎて' },
        { q: 'この{辞書|じしょ}は{字|じ}が{大|おお}きくて、{使|つか}い（　）です。', answers: ['やすい'], hint: 'dễ dùng' },
        { q: '{名前|なまえ}が{長|なが}くて、{覚|おぼ}え（　）です。', answers: ['にくい'], hint: 'khó nhớ' },
      ],
    },
  ],
};

const LT_5: Lesson = {
  id: 'b17-lt-5-tong-hop',
  kind: 'homework',
  title: 'Luyện thêm 5 · Đề tổng hợp Bài 17 — kiểu đề N4 có thang điểm (20 câu)',
  goal: 'Làm một đề nhỏ 20 câu theo đúng các phần của đề N4 (文字・語彙, 文法, 読解) trên nội dung Bài 17, tự chấm theo thang điểm và biết sai câu nào thì ôn mục nào.',
  minutes: 30,
  blocks: [
    {
      t: 'table',
      caption: 'Cấu trúc và thang điểm đề tổng hợp (20 câu · 30 phút)',
      head: ['Phần', 'Số câu', 'Điểm/câu', 'Sai thì ôn'],
      rows: [
        ['① 漢字読み・表記', '4', '5', 'Chữ Hán · Luyện thêm 2'],
        ['② 語彙 (文脈規定・言い換え)', '4', '5', 'Từ vựng · Luyện thêm 1'],
        ['③ 文法形式の判断', '6', '5', 'Ngữ pháp ①–⑤ · Luyện thêm 3, 4'],
        ['④ 文の組み立て ★', '3', '5', 'Ngữ pháp · bảng thay thế'],
        ['⑤ 読解 (đoạn ngắn)', '3', '5', 'Đọc hiểu · Bài 1–3'],
        ['Tổng', '20', '100', '≥ 80 điểm: sang Bài 18 · 60–75: làm lại phần sai · < 60: học lại 3 buổi'],
      ],
    },
    {
      t: 'mcq',
      id: 'b17-lt5-tu',
      title: '①② 文字・語彙 (8 câu)',
      items: [
        { q: '①-1 {明日|あした}の**出発**は{何時|なんじ}ですか。', options: ['しゅっぱつ', 'しゅつはつ', 'でぱつ', 'しゅっぱん'], correct: 0, why: '**{出発|しゅっぱつ}** (shuppatsu).' },
        { q: '①-2 **洋室**と**和室**、どちらがいいですか。(chọn cách đọc của 洋室)', options: ['わしつ', 'ようしつ', 'ようしき', 'ようへや'], correct: 1, why: '**{洋室|ようしつ}** (youshitsu).' },
        { q: '①-3 **せかい**で{一番|いちばん}{長|なが}い{川|かわ}は{何|なん}ですか。', options: ['世介', '生界', '世界', '世回'], correct: 2, why: '**世界** — 界 = 田 + 介.' },
        { q: '①-4 **くうこう**から{電車|でんしゃ}で{行|い}きます。', options: ['空港', '空航', '室港', '空巷'], correct: 0, why: '**空港**.' },
        { q: '②-1 {東京|とうきょう}から{大阪|おおさか}まで（　）で{14,000円|いちまんよんせんえん}です。{帰|かえ}りの{切符|きっぷ}は{要|い}りません。', options: ['{往復|おうふく}', '{片道|かたみち}', '{日帰|ひがえ}り', '{予算|よさん}'], correct: 1, why: 'Không cần vé về → **{片道|かたみち}**. 〔Katamichi de ichiman yonsen en desu.〕' },
        { q: '②-2 {旅行|りょこう}の{前|まえ}に、ネットでホテルの{値段|ねだん}を（　）。', options: ['{調|しら}べました', '{迷|まよ}いました', '{足|た}りました', '{空|あ}きました'], correct: 0, why: 'Tra giá = **{調|しら}べる**. 〔Hoteru no nedan o shirabemashita.〕' },
        { q: '②-3 「タクシーで{行|い}けば、{楽|らく}ですよ。」と{同|おな}じ{意味|いみ}は？', options: ['タクシーで{行|い}けば、{楽|たの}しいです。', 'タクシーで{行|い}けば、{大変|たいへん}じゃないです。', 'タクシーで{行|い}けば、{安|やす}いです。', 'タクシーで{行|い}けば、{早|はや}く{着|つ}きます。'], correct: 1, why: '{楽|らく} = không vất vả ≈ **{大変|たいへん}じゃない**. Bẫy: {楽|たの}しい (vui). 〔Taihen ja nai desu.〕' },
        { q: '②-4 {日曜日|にちようび}の{動物園|どうぶつえん}には{子|こ}どもが（　）いました。', options: ['{大勢|おおぜい}', 'ちょうど', '{不安|ふあん}に', '{楽|らく}に'], correct: 0, why: 'Rất đông người → **{大勢|おおぜい}**. 〔Kodomo ga oozei imashita.〕' },
      ],
    },
    {
      t: 'mcq',
      id: 'b17-lt5-np',
      title: '③④ 文法 (9 câu)',
      items: [
        { q: '③-1 {雨|あめ}が（　）、{試合|しあい}は{中止|ちゅうし}です。', options: ['{降|ふ}れば', '{降|ふ}るなら', '{降|ふ}りすぎて', '{降|ふ}るし'], correct: 0, why: 'Điều kiện → kết quả → **{降|ふ}れば**. 〔Ame ga fureba, shiai wa chuushi desu.〕' },
        { q: '③-2 {両替|りょうがえ}したいんですが、どこに（　）いいですか。', options: ['{行|い}くし', '{行|い}けば', '{行|い}きすぎて', '{行|い}くなら'], correct: 1, why: 'Hỏi chỉ dẫn → **～ばいいですか**: {行|い}けば. 〔Doko ni ikeba ii desu ka.〕' },
        { q: '③-3 A「{和食|わしょく}が{食|た}べたいです。」B「{和食|わしょく}（　）、この{店|みせ}がおすすめです。」', options: ['なら', 'だし', 'ば', 'すぎ'], correct: 0, why: '**なら**. 〔Washoku nara, kono mise ga osusume desu.〕' },
        { q: '③-4 この{旅館|りょかん}は{静|しず}か（　）、{料理|りょうり}もおいしいです。', options: ['し', 'だし', 'なら', 'ければ'], correct: 1, why: 'Tính từ な + **だし**. 〔Shizuka da shi, ryouri mo oishii desu.〕' },
        { q: '③-5 {写真|しゃしん}を（　）すぎて、カメラの{電池|でんち}がなくなりました。', options: ['{撮|と}る', '{撮|と}り', '{撮|と}って', '{撮|と}れ'], correct: 1, why: 'Gốc ます + すぎる: **{撮|と}りすぎて**. 〔Shashin o torisugite.〕' },
        { q: '③-6 この{靴|くつ}は{軽|かる}くて、{歩|ある}き（　）です。', options: ['すぎ', 'やすい', 'なら', 'し'], correct: 1, why: 'Nhẹ → **dễ đi**: {歩|ある}きやすい. 〔Arukiyasui desu.〕' },
        { q: '④-1 ★ {天気|てんき}が ＿＿ ＿＿ ★ ＿＿。（{見|み}えます／よければ／{島|しま}が／ここから）', options: ['{見|み}えます', 'よければ', '{島|しま}が', 'ここから'], correct: 2, why: 'Câu đúng: {天気|てんき}が **よければ ここから {島|しま}が {見|み}えます**. Ô ★ (thứ 3) = **{島|しま}が**. 〔Tenki ga yokereba koko kara shima ga miemasu.〕' },
        { q: '④-2 ★ {旅行|りょこう}に ＿＿ ＿＿ ★ ＿＿ ほうがいいです。（{予約|よやく}した／{早|はや}く／{行|い}くなら／ホテルを）', options: ['{予約|よやく}した', '{早|はや}く', '{行|い}くなら', 'ホテルを'], correct: 1, why: 'Câu đúng: {旅行|りょこう}に **{行|い}くなら ホテルを {早|はや}く {予約|よやく}した** ほうがいいです. Ô ★ (thứ 3) = **{早|はや}く**. 〔Ryokou ni iku nara hoteru o hayaku yoyaku shita hou ga ii desu.〕' },
        { q: '④-3 ★ この{駅|えき}は ＿＿ ＿＿ ★ ＿＿ です。（わかりにくい／{出口|でぐち}が／{広|ひろ}すぎて／とても）', options: ['わかりにくい', '{出口|でぐち}が', '{広|ひろ}すぎて', 'とても'], correct: 3, why: 'Câu đúng: この{駅|えき}は **{広|ひろ}すぎて {出口|でぐち}が とても わかりにくい** です. Ô ★ (thứ 3) = **とても**. 〔Kono eki wa hirosugite deguchi ga totemo wakarinikui desu.〕' },
      ],
    },
    {
      t: 'passage',
      title: '⑤ 読解 — {旅行|りょこう}のメモ',
      intro: 'Ghi chú của ダニエル trước chuyến đi Hiroshima. Đọc rồi trả lời 3 câu.',
      paras: [
        { text: '{金曜日|きんようび}の{夜|よる}、{仕事|しごと}が{終|お}わったら、{夜行|やこう}バスで{広島|ひろしま}へ{行|い}く。{新幹線|しんかんせん}は{速|はや}いけど、{高|たか}すぎる。{夜行|やこう}バスなら、{半分|はんぶん}の{値段|ねだん}で{行|い}ける。' },
        { text: '{土曜日|どようび}：{朝|あさ}{広島|ひろしま}に{着|つ}く。{平和公園|へいわこうえん}を{見|み}てから、{港|みなと}から{船|ふね}で{宮島|みやじま}へ。{天気|てんき}がよければ、{山|やま}に{登|のぼ}る。{雨|あめ}なら、{水族館|すいぞくかん}。' },
        { text: '{日曜日|にちようび}：お{好|この}み{焼|や}きを{食|た}べて、{新幹線|しんかんせん}で{帰|かえ}る（{帰|かえ}りは{疲|つか}れているし、{月曜日|げつようび}は{仕事|しごと}だし）。{荷物|にもつ}は{軽|かる}いほうがいい。{坂|さか}が{多|おお}いから、{歩|ある}きやすい{靴|くつ}で！' },
      ],
    },
    {
      t: 'mcq',
      id: 'b17-lt5-doc',
      title: '⑤ 読解 (3 câu)',
      items: [
        { q: 'ダニエルさんはどうして{行|い}きは{夜行|やこう}バスにしますか。', options: ['{速|はや}いから', '{新幹線|しんかんせん}が{高|たか}すぎるから', '{寝|ね}られるから', '{荷物|にもつ}が{重|おも}いから'], correct: 1, why: '**{新幹線|しんかんせん}は{速|はや}いけど、{高|たか}すぎる** → xe buýt đêm giá một nửa. 〔Shinkansen wa hayai kedo, takasugiru.〕' },
        { q: '{土曜日|どようび}に{雨|あめ}が{降|ふ}ったら、{何|なに}をしますか。', options: ['{山|やま}に{登|のぼ}る', '{水族館|すいぞくかん}に{行|い}く', '{平和公園|へいわこうえん}を{見|み}ない', '{広島|ひろしま}に{帰|かえ}る'], correct: 1, why: '**{雨|あめ}なら、{水族館|すいぞくかん}** (N なら = nếu là mưa). Trời đẹp mới leo núi. 〔Ame nara, suizokukan.〕' },
        { q: 'どうして{帰|かえ}りは{新幹線|しんかんせん}にしますか。', options: ['{安|やす}いから', '{疲|つか}れているし、{次|つぎ}の{日|ひ}は{仕事|しごと}だから', '{夜行|やこう}バスがないから', '{宮島|みやじま}から{近|ちか}いから'], correct: 1, why: '**{疲|つか}れているし、{月曜日|げつようび}は{仕事|しごと}だし** — hai lý do nối bằng し. 〔Tsukarete iru shi, getsuyoubi wa shigoto da shi.〕' },
      ],
    },
    {
      t: 'examples',
      items: [
        E('{仕事|しごと}が{終|お}わったら、{夜行|やこう}バスで{広島|ひろしま}へ{行|い}く。', 'Shigoto ga owattara, yakou basu de Hiroshima e iku.', 'Xong việc thì đi xe buýt đêm đến Hiroshima. (ghi chú dùng thể thường)'),
        E('{夜行|やこう}バスなら、{半分|はんぶん}の{値段|ねだん}で{行|い}ける。', 'Yakou basu nara, hanbun no nedan de ikeru.', 'Nếu là xe buýt đêm thì đi được với nửa giá.'),
        E('{天気|てんき}がよければ、{山|やま}に{登|のぼ}る。{雨|あめ}なら、{水族館|すいぞくかん}。', 'Tenki ga yokereba, yama ni noboru. Ame nara, suizokukan.', 'Trời đẹp thì leo núi. Mưa thì đi thuỷ cung.'),
        E('{坂|さか}が{多|おお}いから、{歩|ある}きやすい{靴|くつ}で！', 'Saka ga ooi kara, arukiyasui kutsu de!', 'Nhiều dốc nên đi giày dễ đi!'),
      ],
    },
  ],
};

export const BAI_17: Lesson[] = [
  // ① Cốt lõi
  HOI_THOAI, TU_VUNG, NGU_PHAP, HAN_TU, NGHE, DOC, NOI, VIET, BAI_TAP,
  // ② Theo buổi trên lớp
  BUOI_1, BUOI_2, BUOI_3,
  // ③ Luyện thêm dễ → khó
  LT_1, LT_2, LT_3, LT_4, LT_5,
];
