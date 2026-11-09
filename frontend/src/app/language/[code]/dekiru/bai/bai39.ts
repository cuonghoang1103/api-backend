/**
 * Bài 39 — 聴解 N3 (Nghe hiểu: nghe ý chính, nghe chi tiết; chiến thuật làm đề) · TIẾP SAU SÁCH, cấp N3 (xem ../SOAN-BAI.md mục 8).
 * Bài thứ tư của chặng 36–40 (Bài 38 = 読解 N3, Bài 40 = ôn tập & thi thử N3). Đây là bài CHUYÊN KỸ NĂNG NGHE — KHÔNG có mẫu ngữ
 * pháp mới theo kiểu "một bài – bốn mẫu". Mục ngữ pháp đổi thành "Văn nói & mẹo nghe".
 * Người học đã xong Bài 1–15 (ポイント 1–124 — trong đó 普通形・友達言葉 Bài 11, ～んです ポイント 104, ～なければなりません ポイント 115),
 * Bài 16–24 (N4: ～ておく Bài 18, ～てしまう + văn nói ～ちゃう Bài 19…), Bài 25 (ôn N4), Bài 26–37 (N3: ～って・～とのことだ Bài 30,
 * つまり・要するに Bài 31, kính ngữ – điện thoại Bài 37…) và Bài 38 (từ nối cho đọc hiểu: しかし・ところが・ただし・なお…).
 * KHÔNG dạy lại các mẫu đó — ở đây chỉ học NGHE RA chúng khi người Nhật nói nhanh, rút gọn, nói vòng (ghi "ôn: Bài X").
 *
 * "Văn nói & mẹo nghe" (N3): ① dạng rút gọn ～てる・～とく・～てく (ている・ておく・ていく) · ② ～ちゃう／～じゃう・～ちゃった ·
 * ③ ～なきゃ／～なくちゃ／～ないと · ～ちゃだめ／～なくてもいい · ④ ～って (bốn nghĩa: と言った・という・は・んだって) · ⑤ đuôi câu
 * văn nói: ～んだ／～の・～んじゃない？・～じゃん・～っけ・～かな · ⑥ âm biến: ら行 → ん (わかんない), ところ → とこ, やっぱ, すいません ·
 * ⑦ cách nói VÒNG (đồng ý / từ chối không nói thẳng): ちょっと…・～はちょっと・～かな・～んじゃないかな・考えておきます・せっかくですが ·
 * ⑧ từ ĐẢO Ý & câu then chốt: でも・ただ・実は・やっぱり・それより・というか・結局 · ⑨ dấu hiệu "làm gì TRƯỚC": まず・先に・その前に・
 * ～てからでいい・もう～てある・～なくてもいい · ⑩ bẫy ĐỔI Ý giữa chừng: あ、やっぱり・～と思ったんだけど・じゃあ～にしよう ·
 * ⑪ cặp nghe giống mà khác (きてよかった ↔ くればよかった…) · ⑫ chiến thuật làm đề 聴解 N3 (đọc lựa chọn trước, ghi chú, có / không có
 * câu hỏi trước, 40 phút cho 28 câu).
 * Nghe (mục LỚN NHẤT): 22 bài `listen` theo đủ 5 dạng đề 聴解 N3 — 課題理解 ×4 · ポイント理解 ×5 (bài 9 = loa nhà ga) · 概要理解 ×4 ·
 * 発話表現 ×4 (mỗi bài một cảnh `canh`) · 即時応答 ×5 bộ (mỗi bộ 3 câu). Mỗi câu `mcq` có giải thích + CÂU THEN CHỐT trong kịch bản
 * (romaji + nghĩa). Luyện thêm 4: 16 bài nghe nữa (課題 ×3 · ポイント ×3 · 概要 ×3 · 発話 ×3 · 即時 ×4 bộ) · Luyện thêm 5: đề nghe mini
 * ~20 phút (11 bài, 14 câu, thang 30 điểm).
 * ⚠ Khuôn `listen.dan` (lời dẫn băng đề) hiện chỉ đọc tiếng Anh kiểu IELTS (components/sach-hoc/nghe.ts, giọng en-GB) ⇒ KHÔNG dùng;
 * lời dẫn kiểu đề JLPT viết thành dòng ナレーター (giọng ja-nu) đầu và cuối mỗi bài như Bài 35/37/38.
 * Từ vựng: 67 từ hay gặp trong đề nghe N3 (nghe & hỏi lại, nhà ga & đi lại, cửa hàng & dịch vụ, bệnh viện & thủ tục, trường học & sự
 * kiện – đặt chỗ, từ hay gặp trong lời nói) + 類義語 + コロケーション. Từ đã học ở Bài 1–38 (往復・片道・割引・指定席・自由席・予算 Bài 17,
 * 乗り換えます・両替します・案内します・キャンセルします Bài 17, 取り替えます・届けます Bài 18, 温めます Bài 19, 着替えます Bài 23,
 * 結局 Bài 22, 席を外します Bài 24, 休講・締め切り・手続き・振り込みます Bài 26, 運休・遅延・見合わせます・再開・渋滞・延期・放送 Bài 27,
 * 症状・くしゃみ・鼻水 Bài 29, 聞き取ります・聞き返します・言い直します・聞き間違えます・希望します・調整します Bài 30, 要点・日程・打ち合わせ Bài 30, 選択肢 Bài 33, 要するに Bài 31, 書類・記入 Bài 35,
 * 念のため・見積もり・申請・署名・内線 Bài 37, 品切れ・在庫・返却・変更・窓口・掲示板・定員・抽選・有料・会員・お知らせ・むしろ Bài 38,
 * 保険証・薬局 Bài 12, 改札 Bài 7, 信号・出口 Bài 10…) KHÔNG lặp lại — gặp trong bài nghe là ôn.
 * Chữ Hán mới (21): 聴 符 往 換 駐 輪 渋 滞 税 替 領 振 算 症 傷 希 補 却 訂 催 請 (N3–N2 theo các bảng tham khảo phổ biến; 聴・渋・滞・
 * 却・訂・催・請 nhiều bảng xếp N2 nhưng các từ 聴解・渋滞・返却・訂正・開催・申請 rất hay gặp ở bài nghe / thông báo N3 — JLPT không công
 * bố danh sách chữ chính thức) — không trùng hanTu.ts, hanTu16–38.ts, hanTuTiep.ts, hanLop.ts, các bảng chữ Hán Bài 1–38 (kiểm 09/11:
 * Bài 37 = 丁 寧 謙 譲 挨 拶 宛 署 添 締 至 致 遣 縮 司 僚 刺 貴 延 封 筒 · Bài 38 = 筆 掲 載 募 抽 臨 営 条 額 慮 環 境 策 効 量 源 逆 批 及 府
 * 易 造). Thẻ chữ Hán: hanTu39.ts (HAN_TU_39).
 * Hội thoại, câu ví dụ, kịch bản nghe, câu hỏi, bài đọc: VIẾT MỚI 100%, không chép đề JLPT thật hay sách luyện thi nào (新完全マスター
 * 聴解, 総まとめ, 公式問題集…). Chỉ giữ DẠNG đề (5 dạng 聴解 N3, số câu, thời gian) — kiến thức chung.
 *
 * Nhân vật (giới tính quyết định giọng đọc, theo sách p.14): nữ = パク, ワン, アンナ, メアリー, マリヤム, 山口, 木村, リン, 鈴木,
 * {佐藤先生|さとうせんせい} · nam = マルコ, ダニエル, ナタポン, カルロス, 西川, 本田先生, {小林店長|こばやしてんちょう}, {森課長|もりかちょう}, {田村|たむら}.
 * Nối tiếp: リン (nữ) và カルロス (nam) — sinh viên {みなと大学|みなとだいがく}, ゼミ của cô 佐藤, đang ôn JLPT N3 · マリヤム (nữ) và
 * ダニエル (nam) ở {国際寮|こくさいりょう} · ナタポン (nam) làm thêm ở ひまわり{食堂|しょくどう} của anh 小林 · ワン (nữ) thực tập ở さくらシステム,
 * {鈴木|すずき} (nữ), {森課長|もりかちょう} (nam) — Bài 35/37.
 * Người MỚI (chỉ ở hội thoại / phần nghe): {駅員|えきいん} (nam — giọng nam), {病院|びょういん}の{受付|うけつけ}の{人|ひと} (nữ — giọng nữ),
 * {駅|えき}・{店内|てんない}のアナウンス (nữ — ja-nu), {店員|てんいん} (nữ hoặc nam — ghi theo từng bài), ラジオのパーソナリティー (nam — ja-nam),
 * {図書館|としょかん}の{職員|しょくいん} (nữ — ja-nu). ナレーター (người dẫn đề) = ja-nu.
 * Hội thoại: role 'a'/'c' = giọng nữ, 'b'/'examiner' = giọng nam (trang tự đổi sang giọng thứ hai khi có hai người cùng giới).
 * Nghe: 'ja-nu' = nữ, 'ja-nam' = nam. Hình: tên trong scripts/hinh/fluent-catalog.json (Fluent Emoji).
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
  id: 'b39-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — 聴解 ngoài đời: thông báo tàu dừng ở sân ga, quầy lễ tân phòng khám, gọi điện đặt chỗ ở quán ăn',
  goal: 'Nghe ra thông báo ở sân ga (運転を見合わせております・運転再開は～の見込みです) rồi hỏi lại nhân viên khi không nghe kịp (すみません、よく聞き取れなかったんですが・もう一度お願いします); làm theo hướng dẫn nhiều bước ở quầy lễ tân và hỏi lại đúng đoạn bị sót (「～」のあと、何とおっしゃいましたか); nói lại để xác nhận (まず～て、それから～、ということですね); gọi điện đặt chỗ, nghe ra 満席・空き・ただ、～ và theo kịp khi người nói ĐỔI Ý giữa chừng (あ、でも・やっぱり～).',
  minutes: 55,
  blocks: [
    {
      t: 'recap',
      title: 'Bài 39 — chủ đề: nghe hiểu ngoài đời & trong đề JLPT N3 (bài kỹ năng, không có mẫu ngữ pháp mới)',
      items: [
        'Bài 39 là bài **chuyên kỹ năng NGHE** của chặng 36–40. Không có "bốn mẫu mới" — thay vào đó là **nghe ra** những thứ đã học khi người Nhật **nói nhanh, rút gọn, nói vòng, đổi ý**: {聞|き}いて**る**, やっ**とく**, {忘|わす}れ**ちゃった**, {行|い}か**なきゃ**, ～**って**, ちょっと……',
        'Ba hội thoại là ba chỗ người học hay "đứng hình" vì không nghe kịp: ① **sân ga** — loa báo tàu dừng · ② **quầy lễ tân phòng khám** — một tràng hướng dẫn nhiều bước · ③ **điện thoại đặt chỗ** — người bên kia nói "hết chỗ" và đưa phương án khác. Cả ba đều có **câu hỏi lại** và **câu nói lại để xác nhận** — kỹ năng sống còn khi nghe chưa chắc.',
        'Mục **Nghe** là mục LỚN NHẤT của bài: 21 bài theo đủ **5 dạng đề 聴解 N3** (課題理解・ポイント理解・概要理解・発話表現・即時応答). Mục **Văn nói & mẹo nghe** dạy các dạng rút gọn, cách nói vòng, từ đảo ý, dấu hiệu câu then chốt và bẫy đổi ý. Có cả chiến thuật làm đề 40 phút.',
        'Cách học hội thoại của bài này: **nghe 2 lần KHÔNG nhìn chữ** (bấm 🔊 cả bài), tự trả lời "người này phải làm gì tiếp?", rồi mới mở lời thoại, đọc romaji, đọc phân vai.',
      ],
    },
    {
      t: 'note',
      title: 'Học xong bài 39 bạn làm được (できる)',
      items: [
        '**① {駅|えき}のホームで** — nghe thông báo: **ただいま、{運転|うんてん}を{見合|みあ}わせております** (đang tạm dừng chạy) · **{運転再開|うんてんさいかい}は{八時四十分|はちじよんじゅっぷん}ごろの{見込|みこ}みです** (dự kiến chạy lại) · hỏi lại: **すみません、{今|いま}のアナウンス、よく{聞|き}き{取|と}れなかったんですが** · **もう{一度|いちど}お{願|ねが}いします** · xác nhận: **{東口|ひがしぐち}の{三番乗|さんばんの}り{場|ば}ですね**.',
        '**② {病院|びょういん}の{受付|うけつけ}で** — nghe hướng dẫn nhiều bước và hỏi lại đúng chỗ sót: **「{書|か}き{終|お}わったら」のあと、{何|なん}とおっしゃいましたか** · nghe ra lời **đổi ý**: **{大丈夫|だいじょうぶ}……あ、でも、{念|ねん}のため、{先|さき}に{測|はか}っていただけますか** · nói lại cả trình tự: **まず{熱|ねつ}を{測|はか}って、それから～、ということですね**.',
        '**③ {電話|でんわ}で{予約|よやく}** — nghe **{満席|まんせき}なんです** · hỏi **{何時|なんじ}なら{空|あ}きがありますか** · nghe điều kiện sau **ただ、～** · tự đổi ý lịch sự: **やっぱり、{日曜日|にちようび}はどうですか** · nghe người kia **nói lại để xác nhận** (**{確認|かくにん}いたします。～ですね**) và sửa nếu sai.',
        '**できる！** — làm được đề 聴解 N3 đủ 5 dạng: biết **mỗi dạng nghe CÁI GÌ**, ghi chú nhanh khi nghe, không bị lừa bởi việc "đã làm rồi / để sau / người khác làm", bởi lý do bị phủ định, bởi lời đổi ý; chọn đúng câu nói trong tình huống và đáp ngay câu ngắn.',
      ],
    },
    {
      t: 'table',
      caption: 'Bức tranh chung — khi nghe chưa chắc, nói gì',
      head: ['Bạn muốn…', 'Câu nói', 'Romaji', 'Ghi chú'],
      rows: [
        ['Nói là mình KHÔNG NGHE KỊP', 'すみません、よく{聞|き}き{取|と}れなかったんですが……', 'Sumimasen, yoku kikitorenakatta n desu ga……', '{聞|き}き{取|と}る (Bài 30) — thể khả năng phủ định quá khứ'],
        ['Xin NÓI LẠI', 'もう{一度|いちど}お{願|ねが}いします。／もう{一度|いちど}{言|い}っていただけますか。', 'Mou ichido onegai shimasu. / Mou ichido itte itadakemasu ka.', 'Với bạn: もう{一回|いっかい}{言|い}って？'],
        ['Xin nói CHẬM hơn', 'すみません、もう{少|すこ}しゆっくり{話|はな}していただけますか。', 'Sumimasen, mou sukoshi yukkuri hanashite itadakemasu ka.', 'Lịch sự — Bài 24'],
        ['Hỏi lại ĐÚNG CHỖ bị sót', '「～」のあと、{何|なん}とおっしゃいましたか。', '"~" no ato, nan to osshaimashita ka.', 'Lặp lại từ cuối cùng mình nghe được'],
        ['Hỏi nghĩa một TỪ lạ', '「{遅延証明書|ちえんしょうめいしょ}」って{何|なん}ですか。', '"Chien shoumeisho" tte nan desu ka.', '～って = ～というのは (Bài 30)'],
        ['NÓI LẠI để xác nhận', '{東口|ひがしぐち}の{三番乗|さんばんの}り{場|ば}ですね。', 'Higashiguchi no sanban noriba desu ne.', 'Lặp lại thông tin chính + ですね'],
        ['Xác nhận cả TRÌNH TỰ', 'まず～て、それから～、ということですね。', 'Mazu ~te, sore kara ~, to iu koto desu ne.', 'ということ (Bài 30) — tóm lại điều đã nghe'],
        ['Hỏi PHƯƠNG ÁN KHÁC', '{何時|なんじ}なら{空|あ}きがありますか。', 'Nanji nara aki ga arimasu ka.', '～なら (Bài 17)'],
      ],
    },

    /* ── ① 駅のホーム ── */
    { t: 'h', text: '① {駅|えき}のホームで — "Xin lỗi, thông báo vừa rồi tôi nghe không rõ…"' },
    {
      t: 'canh',
      anh: ['station', 'loudspeaker', 'man-student', 'man-police-officer', 'alarm-clock'],
      caption: '8 giờ 10 sáng thứ Hai, sân ga 中央駅. カルロス có bài thi lúc 9 giờ ở trường. Loa trên sân ga vang lên một thông báo dài, mọi người xung quanh thở dài và rút điện thoại. カルロス chỉ nghe được chữ "見合わせ" — anh chạy lại hỏi một nhân viên nhà ga (駅員) đội mũ.',
    },
    {
      t: 'p',
      text: 'Tình huống: **カルロス** (nam) nghe **loa thông báo** tàu tuyến さくら線 **tạm dừng chạy** (**{運転|うんてん}を{見合|みあ}わせております**). Không nghe kịp, anh **hỏi lại nhân viên nhà ga** (**よく{聞|き}き{取|と}れなかったんですが**), được khuyên đi xe buýt và **mang giấy chứng nhận tàu trễ** (**{遅延証明書|ちえんしょうめいしょ}**). Gặp từ lạ, anh **xin nói lại** (**もう{一度|いちど}お{願|ねが}いします**), rồi **nói lại trình tự để xác nhận** (**まず～、それから～ですね**).',
    },
    DL('Sân ga 8:10 — tàu dừng, sắp đến giờ thi', [
      ['アナウンス', 'c', 'お{客様|きゃくさま}にお{知|し}らせいたします。ただいま、さくら{線|せん}は、{信号|しんごう}の{点検|てんけん}のため、{運転|うんてん}を{見合|みあ}わせております。{運転再開|うんてんさいかい}は、{八時四十分|はちじよんじゅっぷん}ごろの{見込|みこ}みです。', 'Okyakusama ni oshirase itashimasu. Tadaima, Sakura-sen wa, shingou no tenken no tame, unten o miawasete orimasu. Unten saikai wa, hachiji yonjuppun goro no mikomi desu.', 'Xin thông báo tới quý khách. Hiện tại tuyến Sakura đang tạm dừng chạy tàu để kiểm tra tín hiệu. Dự kiến chạy lại vào khoảng 8 giờ 40.'],
      ['カルロス', 'b', 'えっ、{見合|みあ}わせ？ ……すみません、{今|いま}のアナウンス、よく{聞|き}き{取|と}れなかったんですが……。', 'E, miawase? …… Sumimasen, ima no anaunsu, yoku kikitorenakatta n desu ga…….', 'Ơ, tạm dừng á? … Xin lỗi, thông báo vừa rồi tôi nghe không rõ lắm…'],
      ['{駅員|えきいん}', 'examiner', 'さくら{線|せん}が{今|いま}、{止|と}まっているんです。{八時四十分|はちじよんじゅっぷん}ごろには{動|うご}くと{思|おも}いますが。', 'Sakura-sen ga ima, tomatte iru n desu. Hachiji yonjuppun goro ni wa ugoku to omoimasu ga.', 'Tuyến Sakura hiện đang dừng ạ. Tôi nghĩ khoảng 8 giờ 40 sẽ chạy lại.'],
      ['カルロス', 'b', '{八時四十分|はちじよんじゅっぷん}ですか。{九時|くじ}から{試験|しけん}なんですけど、{間|ま}に{合|あ}いますか。', 'Hachiji yonjuppun desu ka. Kuji kara shiken na n desu kedo, ma ni aimasu ka.', '8 giờ 40 ạ? Chín giờ tôi có bài thi, liệu có kịp không ạ?'],
      ['{駅員|えきいん}', 'examiner', 'どちらまでですか。', 'Dochira made desu ka.', 'Anh đi đến đâu ạ?'],
      ['カルロス', 'b', '{大学前駅|だいがくまええき}です。', 'Daigakumae-eki desu.', 'Ga Daigakumae ạ.'],
      ['{駅員|えきいん}', 'examiner', 'それなら、バスのほうが{早|はや}いかもしれません。{東口|ひがしぐち}を{出|で}て、{三番乗|さんばんの}り{場|ば}から{大学行|だいがくゆ}きのバスが{出|で}ています。', 'Sore nara, basu no hou ga hayai kamo shiremasen. Higashiguchi o dete, sanban noriba kara daigaku-yuki no basu ga dete imasu.', 'Nếu vậy thì đi xe buýt có khi nhanh hơn. Ra cửa Đông, ở bến số 3 có xe buýt đi trường đại học.'],
      ['カルロス', 'b', '{東口|ひがしぐち}の{三番乗|さんばんの}り{場|ば}ですね。', 'Higashiguchi no sanban noriba desu ne.', 'Bến số 3 cửa Đông nhỉ.'],
      ['{駅員|えきいん}', 'examiner', 'はい。あ、それから、{試験|しけん}に{遅|おく}れたときのために、{遅延証明書|ちえんしょうめいしょ}を{持|も}っていってください。{改札|かいさつ}の{横|よこ}で{配|くば}っています。', 'Hai. A, sore kara, shiken ni okureta toki no tame ni, chien shoumeisho o motte itte kudasai. Kaisatsu no yoko de kubatte imasu.', 'Vâng. À, còn nữa, phòng khi anh bị muộn giờ thi, anh mang theo giấy chứng nhận tàu trễ nhé. Đang phát ở cạnh cửa soát vé.'],
      ['カルロス', 'b', 'ちえん……？ すみません、もう{一度|いちど}お{願|ねが}いします。', 'Chien……? Sumimasen, mou ichido onegai shimasu.', 'Chi-en…? Xin lỗi, anh nói lại giúp tôi một lần nữa.'],
      ['{駅員|えきいん}', 'examiner', '{遅延証明書|ちえんしょうめいしょ}。{電車|でんしゃ}が{遅|おく}れたことを{証明|しょうめい}する{紙|かみ}です。{大学|だいがく}に{出|だ}せば、{遅刻|ちこく}になりませんよ。', 'Chien shoumeisho. Densha ga okureta koto o shoumei suru kami desu. Daigaku ni daseba, chikoku ni narimasen yo.', 'Giấy chứng nhận tàu trễ. Là tờ giấy chứng minh tàu đã bị trễ. Nộp cho trường thì không bị tính là đi muộn đâu.'],
      ['カルロス', 'b', 'なるほど。じゃあ、まず{証明書|しょうめいしょ}をもらって、それから{東口|ひがしぐち}のバスですね。ありがとうございます。', 'Naruhodo. Jaa, mazu shoumeisho o moratte, sore kara higashiguchi no basu desu ne. Arigatou gozaimasu.', 'Ra vậy. Vậy trước tiên tôi lấy giấy chứng nhận, rồi ra xe buýt ở cửa Đông nhỉ. Cảm ơn anh.'],
      ['{駅員|えきいん}', 'examiner', 'お{気|き}をつけて。', 'Oki o tsukete.', 'Anh đi cẩn thận.'],
    ]),
    {
      t: 'examples',
      items: [
        E('ただいま、{運転|うんてん}を{見合|みあ}わせております。', 'Tadaima, unten o miawasete orimasu.', 'Hiện tại đang tạm dừng chạy tàu. (câu loa chuẩn — ～ております khiêm nhường của おる, Bài 24)'),
        E('{運転再開|うんてんさいかい}は{八時四十分|はちじよんじゅっぷん}ごろの{見込|みこ}みです。', 'Unten saikai wa hachiji yonjuppun goro no mikomi desu.', 'Dự kiến chạy lại khoảng 8 giờ 40. ({見込|みこ}み = dự kiến — N2, rất hay nghe ở loa ga)'),
        E('すみません、よく{聞|き}き{取|と}れなかったんですが。', 'Sumimasen, yoku kikitorenakatta n desu ga.', 'Xin lỗi, tôi nghe không rõ lắm. (～んですが — mở lời nhờ, Bài 12)'),
        E('すみません、もう{一度|いちど}お{願|ねが}いします。', 'Sumimasen, mou ichido onegai shimasu.', 'Xin lỗi, anh nói lại giúp tôi một lần nữa.'),
        E('{東口|ひがしぐち}の{三番乗|さんばんの}り{場|ば}ですね。', 'Higashiguchi no sanban noriba desu ne.', 'Bến số 3 cửa Đông nhỉ. (nói lại để xác nhận)'),
        E('まず{証明書|しょうめいしょ}をもらって、それからバスですね。', 'Mazu shoumeisho o moratte, sore kara basu desu ne.', 'Trước tiên lấy giấy chứng nhận, rồi mới đi xe buýt nhỉ. (xác nhận trình tự — đúng dạng câu hỏi 課題理解)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ①',
      items: [
        '**Loa nhà ga có khuôn cố định**: **お{客様|きゃくさま}にお{知|し}らせいたします** (mở) → **ただいま、～は、[lý do]のため、～ております** (tình trạng hiện tại) → **～は～ごろの{見込|みこ}みです** (dự kiến). Nghe ra khuôn này thì chỉ cần bắt **ba thứ**: TUYẾN nào · VÌ SAO · MẤY GIỜ. Đề 聴解 rất thích hỏi đúng ba thứ đó.',
        '**{運転|うんてん}を{見合|みあ}わせる** (tạm dừng chạy — Bài 27) ≠ **{運休|うんきゅう}** (Bài 27 — huỷ chuyến hẳn) ≠ **{遅延|ちえん}** (Bài 27 — chạy trễ). Ôn nhanh vì đây là ba từ đề nghe hay đặt cạnh nhau: Ba từ khác nhau về mức độ: trễ < tạm dừng < huỷ.',
        '**よく{聞|き}き{取|と}れなかったんですが** — {聞|き}き{取|と}る (nghe ra được — Bài 30) → thể khả năng {聞|き}き{取|と}れる → phủ định quá khứ {聞|き}き{取|と}れ**なかった**. Đuôi **んですが** bỏ lửng = "…nên anh giúp tôi với" — người Nhật hiểu ngay là bạn đang nhờ nói lại.',
        '**ちえん……？ もう{一度|いちど}お{願|ねが}いします** — gặp từ lạ, **lặp lại phần mình nghe được** (ちえん) rồi xin nói lại. Người nghe sẽ nói chậm và giải thích. Cách này tốt hơn nhiều so với im lặng gật đầu.',
        '**{東口|ひがしぐち}の{三番乗|さんばんの}り{場|ば}ですね** — **nói lại để xác nhận**: lặp lại thông tin chính (cửa nào, số mấy) + **ですね**. Trong đề 課題理解, câu cuối của người được hướng dẫn thường **tóm lại việc sẽ làm** đúng kiểu này — nghe kỹ câu cuối.',
        '**{遅|おく}れたときのために** — ～ときのために = "phòng khi…" (V-た／V-る + ときのために). **{出|だ}せば、{遅刻|ちこく}になりません** — ～ば (Bài 17) + になる.',
        'Từ trong hội thoại: **アナウンス** (thông báo qua loa) · **{見合|みあ}わせる** (tạm dừng — Bài 27) · **{運転再開|うんてんさいかい}** ({再開|さいかい} Bài 27) · **{見込|みこ}み** (dự kiến — N2) · **{乗|の}り{場|ば}** (bến, chỗ lên xe — từ mới) · **{遅延証明書|ちえんしょうめいしょ}** (giấy chứng nhận tàu trễ — {遅延|ちえん} Bài 27 + {証明書|しょうめいしょ}) · **{証明|しょうめい}する** (chứng minh) · **{配|くば}る** (phát).',
      ],
    },

    /* ── ② 病院の受付 ── */
    { t: 'h', text: '② {病院|びょういん}の{受付|うけつけ}で — "「Viết xong」rồi sau đó chị nói gì ạ?"' },
    {
      t: 'canh',
      anh: ['hospital', 'woman-health-worker', 'woman-student', 'sneezing-face', 'thermometer', 'clipboard'],
      caption: 'Chiều thứ Tư, một phòng khám nhỏ gần ký túc xá. リン hắt hơi liên tục, cầm thẻ bảo hiểm đứng trước quầy lễ tân. Chị lễ tân nói nhanh, tay chỉ vào tấm bảng kẹp giấy, chiếc nhiệt kế và hàng ghế chờ.',
    },
    {
      t: 'p',
      text: 'Tình huống: **リン** (nữ) lần đầu đi khám vì hắt hơi, sổ mũi. Chị **lễ tân** (nữ) nói một tràng **ba bước** — chỉ cần sót một bước là làm sai. リン **hỏi lại đúng đoạn bị sót** (**「～」のあと、{何|なん}とおっしゃいましたか**). Chị lễ tân đang nói "không cần đo nhiệt độ" thì **đổi ý** (**あ、でも、{念|ねん}のため～**) — đây là kiểu **bẫy đổi ý** rất hay gặp trong đề 課題理解. Cuối cùng リン **nói lại cả trình tự** để chắc chắn.',
    },
    DL('Quầy lễ tân — ba bước và một lần đổi ý', [
      ['{受付|うけつけ}', 'c', 'こんにちは。こちらは{初|はじ}めてですか。', 'Konnichiwa. Kochira wa hajimete desu ka.', 'Xin chào. Bạn đến đây lần đầu phải không?'],
      ['リン', 'a', 'はい、{初|はじ}めてです。{三日前|みっかまえ}から、くしゃみと{鼻水|はなみず}が{止|と}まらなくて……。', 'Hai, hajimete desu. Mikka mae kara, kushami to hanamizu ga tomaranakute…….', 'Vâng, lần đầu ạ. Từ ba hôm trước em cứ hắt hơi và chảy nước mũi không dứt…'],
      ['{受付|うけつけ}', 'c', 'そうですか。では、{保険証|ほけんしょう}をお{願|ねが}いします。', 'Sou desu ka. Dewa, hokenshou o onegai shimasu.', 'Vậy à. Thế cho chị xin thẻ bảo hiểm.'],
      ['リン', 'a', 'はい、これです。', 'Hai, kore desu.', 'Vâng, đây ạ.'],
      ['{受付|うけつけ}', 'c', 'お{預|あず}かりします。こちらの{問診票|もんしんひょう}に、{今|いま}の{症状|しょうじょう}を{書|か}いてください。{書|か}き{終|お}わったら、ここに{持|も}ってきてください。それで{診察券|しんさつけん}を{作|つく}りますので、お{名前|なまえ}を{呼|よ}ぶまで、あちらでお{待|ま}ちください。', 'Oazukari shimasu. Kochira no monshinhyou ni, ima no shoujou o kaite kudasai. Kakiowattara, koko ni motte kite kudasai. Sore de shinsatsuken o tsukurimasu node, onamae o yobu made, achira de omachi kudasai.', 'Chị giữ nhé. Em ghi triệu chứng hiện tại vào phiếu khai bệnh này. Viết xong thì mang lại đây. Chị sẽ làm thẻ khám bệnh, em ngồi chờ đằng kia cho đến khi được gọi tên nhé.'],
      ['リン', 'a', 'すみません、「{書|か}き{終|お}わったら」のあと、{何|なん}とおっしゃいましたか。', 'Sumimasen, "kakiowattara" no ato, nan to osshaimashita ka.', 'Xin lỗi, sau câu "viết xong" chị nói gì ạ?'],
      ['{受付|うけつけ}', 'c', '{書|か}き{終|お}わったら、ここに{持|も}ってきてください。{診察券|しんさつけん}を{作|つく}りますから。', 'Kakiowattara, koko ni motte kite kudasai. Shinsatsuken o tsukurimasu kara.', 'Viết xong thì mang lại đây. Chị làm thẻ khám bệnh cho.'],
      ['リン', 'a', 'わかりました。……あの、{熱|ねつ}は{測|はか}らなくてもいいですか。', 'Wakarimashita. …… Ano, netsu wa hakaranakute mo ii desu ka.', 'Em hiểu rồi. … À, em không cần đo nhiệt độ ạ?'],
      ['{受付|うけつけ}', 'c', '{熱|ねつ}ですか。{鼻|はな}の{症状|しょうじょう}だけなら、{大丈夫|だいじょうぶ}……あ、でも、{念|ねん}のため、{先|さき}に{測|はか}っていただけますか。{体温計|たいおんけい}はそちらにあります。', 'Netsu desu ka. Hana no shoujou dake nara, daijoubu …… a, demo, nen no tame, saki ni hakatte itadakemasu ka. Taionkei wa sochira ni arimasu.', 'Nhiệt độ à? Nếu chỉ có triệu chứng ở mũi thì không sao… À, nhưng để cho chắc, em đo trước giúp chị nhé. Nhiệt kế ở chỗ kia.'],
      ['リン', 'a', 'はい。じゃあ、まず{熱|ねつ}を{測|はか}って、それから{問診票|もんしんひょう}を{書|か}いて、ここに{持|も}ってくる、ということですね。', 'Hai. Jaa, mazu netsu o hakatte, sore kara monshinhyou o kaite, koko ni motte kuru, to iu koto desu ne.', 'Vâng. Vậy là trước tiên em đo nhiệt độ, sau đó viết phiếu khai bệnh rồi mang lại đây, đúng không ạ?'],
      ['{受付|うけつけ}', 'c', 'はい、そうです。それから、お{薬|くすり}は{診察|しんさつ}のあとで、{向|む}かいの{薬局|やっきょく}でもらってくださいね。', 'Hai, sou desu. Sore kara, okusuri wa shinsatsu no ato de, mukai no yakkyoku de moratte kudasai ne.', 'Đúng rồi. À còn thuốc thì sau khi khám, em lấy ở hiệu thuốc đối diện nhé.'],
      ['リン', 'a', '{向|む}かいの{薬局|やっきょく}ですね。わかりました。', 'Mukai no yakkyoku desu ne. Wakarimashita.', 'Hiệu thuốc đối diện nhỉ. Em hiểu rồi.'],
      ['{受付|うけつけ}', 'c', '{診察券|しんさつけん}は{次|つぎ}からも{使|つか}いますので、なくさないでくださいね。', 'Shinsatsuken wa tsugi kara mo tsukaimasu node, nakusanaide kudasai ne.', 'Thẻ khám bệnh lần sau vẫn dùng nên em đừng làm mất nhé.'],
    ]),
    {
      t: 'examples',
      items: [
        E('「{書|か}き{終|お}わったら」のあと、{何|なん}とおっしゃいましたか。', '"Kakiowattara" no ato, nan to osshaimashita ka.', 'Sau câu "viết xong" chị nói gì ạ? (hỏi lại đúng chỗ sót — おっしゃる kính ngữ của 言う, Bài 24)'),
        E('{熱|ねつ}は{測|はか}らなくてもいいですか。', 'Netsu wa hakaranakute mo ii desu ka.', 'Không cần đo nhiệt độ ạ? (～なくてもいい — ポイント 116)'),
        E('{大丈夫|だいじょうぶ}……あ、でも、{念|ねん}のため、{先|さき}に{測|はか}っていただけますか。', 'Daijoubu …… a, demo, nen no tame, saki ni hakatte itadakemasu ka.', 'Không sao… À, nhưng để chắc, đo trước giúp chị nhé. (ĐỔI Ý: câu sau あ、でも mới là câu thật)'),
        E('まず{熱|ねつ}を{測|はか}って、それから{問診票|もんしんひょう}を{書|か}く、ということですね。', 'Mazu netsu o hakatte, sore kara monshinhyou o kaku, to iu koto desu ne.', 'Vậy là trước tiên đo nhiệt độ, sau đó viết phiếu, đúng không ạ?'),
        E('お{薬|くすり}は{診察|しんさつ}のあとで、{向|む}かいの{薬局|やっきょく}でもらってください。', 'Okusuri wa shinsatsu no ato de, mukai no yakkyoku de moratte kudasai.', 'Thuốc thì sau khi khám, lấy ở hiệu thuốc đối diện. (việc "để SAU" — đề hay dùng làm đáp án nhiễu)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ②',
      items: [
        '**Một tràng ba bước**: 問診票に書く → ここに持ってくる → 待つ. Người Nhật nói nối bằng **～て／～たら／～ので**, không ngắt. Mẹo: **ghi bằng mũi tên** khi nghe (書 → 持 → 待), mỗi bước một chữ.',
        '**「{書|か}き{終|お}わったら」のあと、{何|なん}とおっしゃいましたか** — lặp lại **chữ cuối cùng mình nghe được** trong ngoặc 「」 rồi hỏi "sau đó nói gì". Người kia chỉ cần nói lại đúng đoạn đó — nhanh và lịch sự. **{書|か}き{終|お}わる** = viết xong (V-ます + {終|お}わる).',
        '**{大丈夫|だいじょうぶ}……あ、でも、{念|ねん}のため** — câu đang nói dở thì **đổi ý**. Trong đề 課題理解: câu ĐẦU (không cần đo) là **bẫy**, câu SAU **あ、でも** mới là thật. Dấu hiệu đổi ý: **あ、でも・やっぱり・いや、待って・～と{思|おも}ったけど**. **{念|ねん}のため** (để cho chắc — Bài 37).',
        '**～ていただけますか** — chị lễ tân nhờ khách rất lịch sự (Bài 24) nhưng thực chất là **chỉ thị**: "đo đi". Trong đề nghe, **～てもらえますか／～ていただけますか／～てくれる？** của người hướng dẫn = **việc người nghe PHẢI làm**.',
        '**まず～て、それから～、ということですね** — câu xác nhận trình tự. **ということ** (Bài 30) gói cả cụm lại. Câu đáp **はい、そうです** xác nhận — còn nếu người kia nói **いえ、～** thì lắng nghe chỗ sửa.',
        '**お{薬|くすり}は{診察|しんさつ}のあとで** — việc **để sau** (あとで). Câu hỏi "まず何をしますか" → loại ngay việc có **あとで・～てからでいい**.',
        'Từ trong hội thoại: **くしゃみ** (hắt hơi) · **{鼻水|はなみず}** (nước mũi) · **{保険証|ほけんしょう}** (thẻ bảo hiểm — Bài 12) · **お{預|あず}かりします** (xin giữ — Bài 30) · **{問診票|もんしんひょう}** (phiếu khai bệnh — N1, chỉ cần nghe ra) · **{症状|しょうじょう}** (triệu chứng — Bài 29) · **{診察券|しんさつけん}** (thẻ khám bệnh — từ mới) · **{体温計|たいおんけい}** (nhiệt kế — từ mới) · **{向|む}かい** (đối diện) · **{薬局|やっきょく}** (hiệu thuốc — Bài 12).',
      ],
    },

    /* ── ③ 電話で予約 ── */
    { t: 'h', text: '③ {電話|でんわ}で{予約|よやく} — "Thứ Bảy hết chỗ rồi ạ"' },
    {
      t: 'canh',
      anh: ['woman-student', 'mobile-phone', 'man-cook', 'fork-and-knife-with-plate', 'spiral-calendar'],
      caption: 'Tối thứ Hai ở ký túc xá 国際寮. マリヤム được giao đặt chỗ cho tiệc chia tay một bạn sắp về nước — 12 người. Cô gọi tới ひまわり食堂, nơi ナタポン làm thêm. Người nhấc máy là anh 小林, chủ quán.',
    },
    {
      t: 'p',
      text: 'Tình huống: **マリヤム** (nữ) gọi điện cho **anh 小林** (nam, chủ quán) đặt chỗ **12 người tối thứ Bảy**. Anh 小林 báo **hết chỗ** (**{満席|まんせき}なんです**), đưa phương án **5 giờ 30 nhưng có điều kiện** (**ただ、～**). マリヤム **đổi ý** sang Chủ nhật (**やっぱり～**). Anh 小林 **nói lại toàn bộ để xác nhận** (**{確認|かくにん}いたします**) — chỗ người nghe phải soát xem có sai không. Cuối cùng còn một chi tiết: một người **không ăn được thịt**.',
    },
    DL('Điện thoại tới ひまわり食堂 — hết chỗ, phương án khác, đổi ý', [
      ['{小林店長|こばやしてんちょう}', 'b', 'はい、ひまわり{食堂|しょくどう}でございます。', 'Hai, Himawari Shokudou de gozaimasu.', 'Vâng, quán ăn Himawari xin nghe.'],
      ['マリヤム', 'a', 'もしもし、{予約|よやく}をお{願|ねが}いしたいんですが。{今週|こんしゅう}の{土曜日|どようび}、{夜|よる}{七時|しちじ}から、{十二人|じゅうににん}です。', 'Moshimoshi, yoyaku o onegai shitai n desu ga. Konshuu no doyoubi, yoru shichiji kara, juuninin desu.', 'A lô, tôi muốn đặt chỗ ạ. Thứ Bảy tuần này, từ 7 giờ tối, 12 người.'],
      ['{小林店長|こばやしてんちょう}', 'b', '{土曜日|どようび}の{七時|しちじ}ですね。{少々|しょうしょう}お{待|ま}ちください。……{申|もう}し{訳|わけ}ございません。その{時間|じかん}は{満席|まんせき}なんです。', 'Doyoubi no shichiji desu ne. Shoushou omachi kudasai. …… Moushiwake gozaimasen. Sono jikan wa manseki na n desu.', 'Bảy giờ thứ Bảy nhỉ. Xin chờ một chút. … Thành thật xin lỗi, giờ đó đã kín chỗ rồi ạ.'],
      ['マリヤム', 'a', 'そうですか……。{何時|なんじ}なら{空|あ}きがありますか。', 'Sou desu ka……. Nanji nara aki ga arimasu ka.', 'Vậy ạ… Mấy giờ thì còn chỗ trống ạ?'],
      ['{小林店長|こばやしてんちょう}', 'b', '{五時半|ごじはん}からでしたら、{十二名様|じゅうにめいさま}、{大丈夫|だいじょうぶ}です。ただ、{八時|はちじ}から{次|つぎ}のご{予約|よやく}が{入|はい}っておりまして……。', 'Goji han kara deshitara, juunimei-sama, daijoubu desu. Tada, hachiji kara tsugi no goyoyaku ga haitte orimashite…….', 'Nếu từ 5 giờ rưỡi thì 12 vị được ạ. Có điều, từ 8 giờ đã có khách đặt tiếp…'],
      ['マリヤム', 'a', '{八時|はちじ}までですか。うーん、{五時半|ごじはん}だと、{授業|じゅぎょう}がある{人|ひと}もいるし……。やっぱり、{日曜日|にちようび}はどうですか。{日曜日|にちようび}の{七時|しちじ}は？', 'Hachiji made desu ka. Uun, goji han da to, jugyou ga aru hito mo iru shi……. Yappari, nichiyoubi wa dou desu ka. Nichiyoubi no shichiji wa?', 'Đến 8 giờ thôi ạ. Ừm, 5 rưỡi thì có người còn tiết học… Thôi, Chủ nhật thì sao ạ? Bảy giờ Chủ nhật?'],
      ['{小林店長|こばやしてんちょう}', 'b', '{日曜日|にちようび}でしたら、{七時|しちじ}からでも{大丈夫|だいじょうぶ}ですよ。お{時間|じかん}も{気|き}にしなくて{結構|けっこう}です。', 'Nichiyoubi deshitara, shichiji kara demo daijoubu desu yo. Ojikan mo ki ni shinakute kekkou desu.', 'Chủ nhật thì từ 7 giờ cũng được ạ. Thời gian cũng không cần lo đâu.'],
      ['マリヤム', 'a', 'よかった。じゃあ、{日曜日|にちようび}の{七時|しちじ}、{十二人|じゅうににん}でお{願|ねが}いします。', 'Yokatta. Jaa, nichiyoubi no shichiji, juuninin de onegai shimasu.', 'May quá. Vậy cho tôi đặt 7 giờ Chủ nhật, 12 người.'],
      ['{小林店長|こばやしてんちょう}', 'b', 'かしこまりました。お{料理|りょうり}は、コースになさいますか。', 'Kashikomarimashita. Oryouri wa, koosu ni nasaimasu ka.', 'Vâng ạ. Món ăn quý khách chọn theo set phải không ạ?'],
      ['マリヤム', 'a', 'はい、{三千円|さんぜんえん}のコースで。あ、{一人|ひとり}、お{肉|にく}が{食|た}べられない{人|ひと}がいるんですが……。', 'Hai, sanzen en no koosu de. A, hitori, oniku ga taberarenai hito ga iru n desu ga…….', 'Vâng, set 3.000 yên. À, có một người không ăn được thịt ạ…'],
      ['{小林店長|こばやしてんちょう}', 'b', '{承知|しょうち}しました。お{一人様|ひとりさま}、お{肉|にく}の{代|か}わりにお{魚|さかな}にいたしますね。では、{確認|かくにん}いたします。{今週|こんしゅう}の{日曜日|にちようび}、{夜|よる}{七時|しちじ}から、{十二名様|じゅうにめいさま}、{三千円|さんぜんえん}のコースで、お{一人様|ひとりさま}はお{魚|さかな}。お{名前|なまえ}をお{願|ねが}いします。', 'Shouchi shimashita. Ohitori-sama, oniku no kawari ni osakana ni itashimasu ne. Dewa, kakunin itashimasu. Konshuu no nichiyoubi, yoru shichiji kara, juunimei-sama, sanzen en no koosu de, ohitori-sama wa osakana. Onamae o onegai shimasu.', 'Tôi hiểu rồi. Một vị thì thay thịt bằng cá nhé. Vậy tôi xin xác nhận: Chủ nhật tuần này, từ 7 giờ tối, 12 vị, set 3.000 yên, một vị dùng cá. Xin cho biết quý danh.'],
      ['マリヤム', 'a', 'マリヤムです。{電話番号|でんわばんごう}は、この{番号|ばんごう}で{大丈夫|だいじょうぶ}です。', 'Mariyamu desu. Denwa bangou wa, kono bangou de daijoubu desu.', 'Tôi là Mariyam. Số điện thoại thì số này là được ạ.'],
      ['{小林店長|こばやしてんちょう}', 'b', 'マリヤム{様|さま}ですね。ご{予約|よやく}ありがとうございます。お{待|ま}ちしております。', 'Mariyamu-sama desu ne. Goyoyaku arigatou gozaimasu. Omachi shite orimasu.', 'Chị Mariyam nhỉ. Cảm ơn quý khách đã đặt chỗ. Chúng tôi xin chờ quý khách.'],
    ]),
    {
      t: 'examples',
      items: [
        E('その{時間|じかん}は{満席|まんせき}なんです。', 'Sono jikan wa manseki na n desu.', 'Giờ đó kín chỗ rồi ạ. ({満席|まんせき} — từ mới; ～なんです giải thích, Bài 12)'),
        E('{何時|なんじ}なら{空|あ}きがありますか。', 'Nanji nara aki ga arimasu ka.', 'Mấy giờ thì còn chỗ trống? ({空|あ}き — từ mới)'),
        E('ただ、{八時|はちじ}から{次|つぎ}のご{予約|よやく}が{入|はい}っておりまして……。', 'Tada, hachiji kara tsugi no goyoyaku ga haitte orimashite…….', 'Có điều, từ 8 giờ đã có khách đặt tiếp… (ただ = "có điều" — sau nó là ĐIỀU KIỆN quan trọng)'),
        E('やっぱり、{日曜日|にちようび}はどうですか。', 'Yappari, nichiyoubi wa dou desu ka.', 'Thôi, Chủ nhật thì sao ạ? (やっぱり = đổi ý)'),
        E('{確認|かくにん}いたします。{日曜日|にちようび}、{夜|よる}{七時|しちじ}から、{十二名様|じゅうにめいさま}ですね。', 'Kakunin itashimasu. Nichiyoubi, yoru shichiji kara, juunimei-sama desu ne.', 'Tôi xin xác nhận: Chủ nhật, từ 7 giờ tối, 12 vị nhé. (nói lại — chỗ ta soát lỗi)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú hội thoại ③',
      items: [
        '**{満席|まんせき}なんです** — hết chỗ (quán, tàu, rạp). Trái nghĩa: **{空|あ}きがある** (còn chỗ). Câu **{何時|なんじ}なら{空|あ}きがありますか** dùng ～なら (Bài 17) — "nếu là mấy giờ thì…".',
        '**ただ、～** (có điều) — sau **ただ** là **điều kiện / hạn chế** làm thay đổi quyết định. Trong hội thoại: 5 giờ rưỡi được, **ただ** 8 giờ phải trả bàn → マリヤム không chọn. Đề ポイント理解 thích đặt **lý do thật** ngay sau **ただ・でも・{実|じつ}は**.',
        '**{入|はい}っておりまして……** — ～ておりまして = ～ていて (khiêm nhường, Bài 24), bỏ lửng = "nên…" (khó). Người Nhật hay **không nói hết câu từ chối** — người nghe tự hiểu.',
        '**{五時半|ごじはん}だと、{授業|じゅぎょう}がある{人|ひと}もいるし……。やっぱり、{日曜日|にちようび}は** — **đổi ý**: đang nghĩ tới 5 rưỡi, nêu lý do (～し……), rồi **やっぱり** chuyển sang Chủ nhật. Câu hỏi "Họ đặt ngày nào?" → **Chủ nhật**, không phải thứ Bảy.',
        '**{確認|かくにん}いたします。～ですね** — người nhận đặt chỗ nói lại toàn bộ. Đây là lúc **soát**: ngày, giờ, số người, món, yêu cầu riêng. Nếu sai: **すみません、{十二人|じゅうににん}じゃなくて{十三人|じゅうさんにん}です**.',
        '**お{肉|にく}の{代|か}わりにお{魚|さかな}** — N の{代|か}わりに = thay cho N. Chi tiết nhỏ này là kiểu câu hỏi "chi tiết" của đề ポイント理解.',
        'Từ trong hội thoại: **{満席|まんせき}** (kín chỗ) · **{空|あ}き** (chỗ trống) · **～{名様|めいさま}** (… vị — đếm khách, kính ngữ) · **コース** (set món) · **になさいますか** (chọn… ạ — kính ngữ của にする) · **{承知|しょうち}しました** (Bài 30) · **{結構|けっこう}です** (được, không cần — Bài 24).',
      ],
    },
    {
      t: 'table',
      caption: 'Tóm tắt — ba hội thoại, ba kỹ năng nghe',
      head: ['Hội thoại', 'Câu then chốt cần nghe ra', 'Kỹ năng', 'Dạng đề tương ứng'],
      rows: [
        ['① Sân ga', 'ただいま、{運転|うんてん}を{見合|みあ}わせております · ～の{見込|みこ}みです', 'Bắt 3 thông tin: tuyến – lý do – giờ; hỏi lại khi không nghe kịp', '問題2 ポイント理解 (vì sao tàu dừng?) · 問題1 (làm gì trước?)'],
        ['② Quầy lễ tân', 'あ、でも、{念|ねん}のため、{先|さき}に～ · お{薬|くすり}は～のあとで', 'Ghi trình tự bằng mũi tên; nghe ra đổi ý; loại việc "để sau"', '問題1 課題理解 (まず何をしますか)'],
        ['③ Điện thoại', '{満席|まんせき}なんです · ただ、～ · やっぱり、～ · {確認|かくにん}いたします', 'Nghe điều kiện sau ただ; theo kịp đổi ý; soát lời xác nhận', '問題2 ポイント理解 (vì sao không chọn 5 rưỡi?) · 問題5 即時応答'],
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b39-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 67 từ hay gặp trong đề nghe N3: nghe & nói, nhà ga & đi lại, cửa hàng & dịch vụ, bệnh viện – ngân hàng – thủ tục, trường học – sự kiện – đặt chỗ, từ hay gặp trong lời nói',
  goal: 'Nghe ra ngay (không cần nhìn chữ) 67 từ hay xuất hiện trong bài nghe N3: nghe & nói (聴解・聞き逃す・聞き流す・聞き覚え・早口・相づち・話し手・聞き手・見込み・呼び出し・アナウンス), nhà ga (間もなく・白線・車内・番線・発車・各駅停車・快速・急行・終電・乗り場・乗り越す・払い戻し・駐車場), cửa hàng (税込み・税抜き・領収書・レシート・お釣り・会計・レジ袋・持ち帰り・店内・取り寄せる・返品・営業時間・定休日), bệnh viện & thủ tục (診察券・体温計・傷・花粉症・熱中症・整理券・身分証明書・暗証番号・印鑑・紛失・再発行), trường – sự kiện – đặt chỗ (補習・訂正・開催・雨天・満席・空席・空き・請求書・手数料・再配達), lời nói (とりあえず・さっそく・ついでに・どうせ・せめて・なんとか・早める・遅らせる・配る); phân biệt các cặp dễ nhầm khi NGHE (税込み↔税抜き, 領収書↔レシート, 満席↔満員, 早める↔急ぐ, 聞き逃す↔聞き流す…).',
  minutes: 65,
  blocks: [
    {
      t: 'p',
      text: '**67 từ** chia 6 nhóm theo đúng các "bối cảnh" mà đề 聴解 N3 hay dùng: **A** nghe & nói (11) · **B** nhà ga & đi lại (13) · **C** cửa hàng & dịch vụ (13) · **D** bệnh viện, ngân hàng & thủ tục (11) · **E** trường học, sự kiện, đặt chỗ & giao hàng (10) · **F** từ hay gặp trong lời nói (9). Bài này học từ **bằng TAI trước**: bấm 🔊 nghe từ + câu ví dụ, che chữ, tự nói nghĩa — vì trong phòng thi bạn **không bao giờ thấy chữ** của bài nghe.',
    },
    {
      t: 'note',
      title: 'Cách học 67 từ của bài nghe trong 4 ngày',
      items: [
        '**Ngày 1** — nhóm A + B (24 từ): "**từ của loa và của người nói**". Nghe to từng câu ví dụ nhóm B **như nghe loa nhà ga**: {間|ま}もなく、{二番線|にばんせん}に{快速|かいそく}が{参|まい}ります — tập bắt **SỐ** (番線, giờ) và **LOẠI TÀU** (各駅停車・快速・急行).',
        '**Ngày 2** — nhóm C (13 từ): "**từ ở quầy thu ngân**". Học thành cặp đối: **{税込|ぜいこ}み ↔ {税抜|ぜいぬ}き** · **{店内|てんない} ↔ お{持|も}ち{帰|かえ}り** · **{領収書|りょうしゅうしょ} ↔ レシート**. Đề hay hỏi đúng chỗ khác nhau giữa hai từ cặp.',
        '**Ngày 3** — nhóm D + E (21 từ): "**từ ở quầy thủ tục**" (bệnh viện, ngân hàng, văn phòng trường). Phần lớn là danh từ Hán (診察券・身分証明書・再発行・請求書) — **nghe theo âm On**: しんさつ・けん, みぶん・しょうめい・しょ.',
        '**Ngày 4** — nhóm F + thẻ hình + bảng **Từ dễ nhầm (類義語)** + bảng **Kết hợp từ (コロケーション)** + trắc nghiệm cuối mục + viết tay 10 từ. Nhóm F là **phó từ của lời nói** (とりあえず・ついでに・どうせ・せめて) — chúng không mang thông tin chính nhưng cho biết **thái độ** người nói (đề 概要理解 hay hỏi thái độ).',
        'Romaji: trường âm viết đôi ({聴解|ちょうかい} → **chou**kai, {終電|しゅうでん} → **shuu**den, {急行|きゅうこう} → **kyuu**kou, {領収書|りょうしゅうしょ} → **ryou**shuu**sho**, {営業|えいぎょう} → ei**gyou**, {雨天|うてん} → u**ten**); âm ngắt viết đôi phụ âm ({発車|はっしゃ} → **has**sha, {熱中症|ねっちゅうしょう} → **nec**chuu**shou**).',
      ],
    },

    /* ── A ── */
    { t: 'h', text: 'A. Nghe & nói — từ để nói VỀ việc nghe (11 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{聴解|ちょうかい}', pos: 'danh từ', ipa: 'choukai', vi: 'nghe hiểu (phần thi nghe)', ex: 'JLPTの{聴解|ちょうかい}は{四十分|よんじゅっぷん}です。', exRo: 'JLPT no choukai wa yonjuppun desu.', exVi: 'Phần nghe hiểu của JLPT dài 40 phút.', more: 'Tên phần thi: **{言語知識|げんごちしき}・{読解|どっかい}・{聴解|ちょうかい}**. Chữ {聴|ちょう} (nghe chăm chú) là chữ mới của bài — xem mục Chữ Hán.' },
        { w: '{聞|き}き{逃|のが}す', pos: 'động từ nhóm 1', ipa: 'kikinogasu', vi: 'nghe sót, lỡ không nghe được', ex: '{大事|だいじ}なところを{聞|き}き{逃|のが}してしまった。', exRo: 'Daiji na tokoro o kikinogashite shimatta.', exVi: 'Tôi lỡ nghe sót mất chỗ quan trọng.', more: 'N2. V-ます + {逃|のが}す = "để lỡ": {見逃|みのが}す (xem sót, bỏ qua), {乗|の}り{逃|のが}す (lỡ chuyến). Đề nghe chỉ phát **MỘT lần** — sót thì đừng tiếc, nghe tiếp câu sau.' },
        { w: '{聞|き}き{流|なが}す', pos: 'động từ nhóm 1', ipa: 'kikinagasu', vi: 'nghe lướt, nghe cho qua (không để ý)', ex: '{母|はは}の{注意|ちゅうい}を{聞|き}き{流|なが}していたら、{同|おな}じ{失敗|しっぱい}をした。', exRo: 'Haha no chuui o kikinagashite itara, onaji shippai o shita.', exVi: 'Nghe lời mẹ nhắc cho qua, thế là tôi mắc lại đúng lỗi cũ.', more: 'N2. Cũng dùng tốt: **{聞|き}き{流|なが}し** — cách luyện nghe "bật nền" (nghe thụ động). ⚠ Khác **{聞|き}き{逃|のが}す** (muốn nghe mà sót).' },
        { w: '{聞|き}き{覚|おぼ}え', pos: 'danh từ', ipa: 'kikioboe', vi: 'cảm giác đã từng nghe (nghe quen)', ex: 'この{声|こえ}には{聞|き}き{覚|おぼ}えがある。', exRo: 'Kono koe ni wa kikioboe ga aru.', exVi: 'Giọng này tôi nghe quen quen.', more: 'N2. Cụm cố định: **～に{聞|き}き{覚|おぼ}えがある／ない**. Tương tự: {見覚|みおぼ}え (trông quen).' },
        { w: '{早口|はやくち}', pos: 'danh từ / tính từ な', ipa: 'hayakuchi', vi: 'nói nhanh', ex: '{店長|てんちょう}は{早口|はやくち}なので、{最初|さいしょ}は{全然|ぜんぜん}{聞|き}き{取|と}れなかった。', exRo: 'Tenchou wa hayakuchi na node, saisho wa zenzen kikitorenakatta.', exVi: 'Quản lý nói nhanh nên lúc đầu tôi chẳng nghe ra gì.', more: '**{早口言葉|はやくちことば}** = câu nói líu lưỡi (なまむぎ なまごめ なまたまご). Trái nghĩa: ゆっくり{話|はな}す.' },
        { w: '{相|あい}づち', pos: 'danh từ', ipa: 'aizuchi', vi: 'tiếng đệm (ừ, vâng, thế à… khi nghe người khác nói)', ex: '{日本人|にほんじん}は{話|はなし}を{聞|き}きながら、よく{相|あい}づちを{打|う}つ。', exRo: 'Nihonjin wa hanashi o kikinagara, yoku aizuchi o utsu.', exVi: 'Người Nhật vừa nghe vừa hay chêm tiếng đệm.', more: 'N2. Cụm: **{相|あい}づちを{打|う}つ**. Tiếng đệm hay gặp: はい・ええ・うん・へえ・そうなんですか・なるほど. ⚠ Trong đề nghe, **はい／ええ của người nghe KHÔNG có nghĩa là "đồng ý"** — chỉ là "tôi đang nghe".' },
        { w: '{話|はな}し{手|て}', pos: 'danh từ', ipa: 'hanashite', vi: 'người nói', ex: '{話|はな}し{手|て}が{一番|いちばん}{言|い}いたいことは{何|なん}ですか。', exRo: 'Hanashite ga ichiban iitai koto wa nan desu ka.', exVi: 'Điều người nói muốn nói nhất là gì?', more: 'Câu hỏi kinh điển của đề 概要理解. Cặp: **{話|はな}し{手|て} ↔ {聞|き}き{手|て}**. ⚠ {話|はな}し{手|て} đọc **hanashite** — trùng âm với {話|はな}して (thể て)!' },
        { w: '{聞|き}き{手|て}', pos: 'danh từ', ipa: 'kikite', vi: 'người nghe', ex: 'いい{聞|き}き{手|て}は、{相手|あいて}の{話|はなし}を{最後|さいご}まで{聞|き}く。', exRo: 'Ii kikite wa, aite no hanashi o saigo made kiku.', exVi: 'Người nghe giỏi nghe người kia nói đến cuối.', more: 'Tương tự: {書|か}き{手|て} (người viết), {読|よ}み{手|て} (người đọc), {買|か}い{手|て} (người mua).' },
        { w: '{見込|みこ}み', pos: 'danh từ', ipa: 'mikomi', vi: 'dự kiến, triển vọng', ex: '{工事|こうじ}は{来月|らいげつ}{終|お}わる{見込|みこ}みです。', exRo: 'Kouji wa raigetsu owaru mikomi desu.', exVi: 'Công trình dự kiến xong vào tháng sau.', more: 'N2 — nhưng nghe rất nhiều ở **loa nhà ga, dự báo, tin tức**: **～の{見込|みこ}みです・～{見込|みこ}みが{立|た}たない** (chưa biết bao giờ). Gặp {見込|みこ}み = thông tin về **tương lai**, chưa chắc.' },
        { w: '{呼|よ}び{出|だ}し', pos: 'danh từ', ipa: 'yobidashi', vi: 'việc gọi (tên / qua loa) — gọi ra, gọi lên', ex: '{迷子|まいご}のお{呼|よ}び{出|だ}しを{申|もう}し{上|あ}げます。', exRo: 'Maigo no oyobidashi o moushiagemasu.', exVi: 'Xin thông báo tìm trẻ đi lạc. (câu loa ở siêu thị)', more: 'Động từ: **{呼|よ}び{出|だ}す** (gọi ra, triệu tập): {先生|せんせい}に{呼|よ}び{出|だ}された (bị thầy gọi lên). Ở phòng khám: **{番号|ばんごう}でお{呼|よ}びします** (sẽ gọi theo số).' },
        { w: 'アナウンス', pos: 'danh từ (する)', ipa: 'anaunsu', vi: 'thông báo (qua loa, phát thanh)', ex: '{電車|でんしゃ}が{遅|おく}れているというアナウンスが{流|なが}れた。', exRo: 'Densha ga okurete iru to iu anaunsu ga nagareta.', exVi: 'Loa phát thông báo rằng tàu đang bị trễ.', more: 'Cụm: **アナウンスが{流|なが}れる／{入|はい}る** · **{車内|しゃない}アナウンス** · người đọc: アナウンサー. Từ gần: **{放送|ほうそう}** (Bài 27) — {館内放送|かんないほうそう} (loa trong toà nhà).' },
      ],
    },

    /* ── B ── */
    { t: 'h', text: 'B. Nhà ga & đi lại — từ của loa sân ga (13 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{間|ま}もなく', pos: 'phó từ', ipa: 'mamonaku', vi: 'sắp, chẳng bao lâu nữa', ex: '{間|ま}もなく、{電車|でんしゃ}が{参|まい}ります。', exRo: 'Mamonaku, densha ga mairimasu.', exVi: 'Tàu sắp đến. (câu loa chuẩn)', more: 'N3. ≈ もうすぐ (văn nói) nhưng trang trọng — loa ga, sân bay: **{間|ま}もなく{発車|はっしゃ}いたします**. {参|まい}ります = khiêm nhường của 来る (Bài 24) — loa dùng cho TÀU.' },
        { w: '{白線|はくせん}', pos: 'danh từ', ipa: 'hakusen', vi: 'vạch trắng (trên sân ga)', ex: '{危|あぶ}ないですから、{白線|はくせん}の{内側|うちがわ}までお{下|さ}がりください。', exRo: 'Abunai desu kara, hakusen no uchigawa made osagari kudasai.', exVi: 'Nguy hiểm, xin quý khách lùi vào phía trong vạch trắng.', more: 'Câu loa nghe mỗi ngày ở ga Nhật. Nay nhiều ga có vạch vàng: **{黄色|きいろ}い{線|せん}の{内側|うちがわ}**. お{下|さ}がりください = lịch sự của {下|さ}がってください.' },
        { w: '{車内|しゃない}', pos: 'danh từ', ipa: 'shanai', vi: 'trong toa, trong xe', ex: '{車内|しゃない}では、{携帯電話|けいたいでんわ}をマナーモードにしてください。', exRo: 'Shanai de wa, keitai denwa o manaa moodo ni shite kudasai.', exVi: 'Trong toa xin để điện thoại ở chế độ im lặng.', more: 'Cụm: **{車内|しゃない}アナウンス** · **{車内|しゃない}{販売|はんばい}** (bán hàng trên tàu). Cùng khuôn: {店内|てんない} (nhóm C), {館内|かんない} (trong toà nhà), {機内|きない} (trong máy bay).' },
        { w: '～{番線|ばんせん}', pos: 'hậu tố', ipa: '~bansen', vi: 'đường ray số…, sân số…', ex: '{三番線|さんばんせん}の{電車|でんしゃ}は{東京行|とうきょうゆ}きです。', exRo: 'Sanbansen no densha wa Toukyou-yuki desu.', exVi: 'Tàu ở đường ray số 3 đi Tokyo.', more: 'Hỏi: **{何番線|なんばんせん}ですか**. ⚠ Nghe số kỹ: {一番線|いちばんせん}・{二番線|にばんせん}・{四番線|よんばんせん}・{七番線|ななばんせん} (loa thường đọc なな, không đọc しち để khỏi nhầm với いち).' },
        { w: '{発車|はっしゃ}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'hassha (suru)', vi: '(tàu, xe) xuất phát, chuyển bánh', ex: 'ドアが{閉|し}まります。{発車|はっしゃ}します。', exRo: 'Doa ga shimarimasu. Hassha shimasu.', exVi: 'Cửa sắp đóng. Tàu chuyển bánh.', more: 'N3. Chỉ dùng cho **xe, tàu**. Người xuất phát → **{出発|しゅっぱつ}**. Trái: **{到着|とうちゃく}** (Bài 30). Âm ngắt: は**っ**しゃ.' },
        { w: '{各駅停車|かくえきていしゃ}', pos: 'danh từ', ipa: 'kakueki teisha', vi: 'tàu thường (dừng ở mọi ga)', ex: '{各駅停車|かくえきていしゃ}は{遅|おそ}いけど、{空|す}いている。', exRo: 'Kakueki teisha wa osoi kedo, suite iru.', exVi: 'Tàu thường chậm nhưng vắng.', more: 'Gọi tắt: **{各停|かくてい}**, hay gọi **{普通|ふつう}**. Ba loại tàu đề nghe hay so: **{各駅停車|かくえきていしゃ}** (dừng mọi ga) < **{快速|かいそく}** < **{急行|きゅうこう}** (dừng ít ga nhất).' },
        { w: '{快速|かいそく}', pos: 'danh từ', ipa: 'kaisoku', vi: 'tàu nhanh (bỏ qua một số ga, không tốn phụ phí)', ex: '{快速|かいそく}は{次|つぎ}の{駅|えき}には{止|と}まりません。', exRo: 'Kaisoku wa tsugi no eki ni wa tomarimasen.', exVi: 'Tàu nhanh không dừng ở ga tiếp theo.', more: '{快|かい} (Bài 35) + {速|そく}. Bẫy đề nghe: "Tôi xuống ga nhỏ kế tiếp" → **không** đi {快速|かいそく} được, phải đi {各駅停車|かくえきていしゃ}.' },
        { w: '{急行|きゅうこう}', pos: 'danh từ', ipa: 'kyuukou', vi: 'tàu tốc hành', ex: '{急行|きゅうこう}に{乗|の}れば、{二十分|にじゅっぷん}で{着|つ}きます。', exRo: 'Kyuukou ni noreba, nijuppun de tsukimasu.', exVi: 'Đi tàu tốc hành thì 20 phút là tới.', more: 'N4. Có tuyến phải mua thêm vé tốc hành ({急行券|きゅうこうけん}). Nhanh hơn nữa: **{特急|とっきゅう}** (tàu tốc hành đặc biệt).' },
        { w: '{終電|しゅうでん}', pos: 'danh từ', ipa: 'shuuden', vi: 'chuyến tàu cuối ngày', ex: '{飲|の}み{会|かい}が{長引|ながび}いて、{終電|しゅうでん}に{乗|の}り{遅|おく}れた。', exRo: 'Nomikai ga nagabiite, shuuden ni noriokureta.', exVi: 'Tiệc kéo dài nên tôi lỡ chuyến tàu cuối.', more: 'Trái: **{始発|しはつ}** (chuyến đầu). {乗|の}り{遅|おく}れる (Bài 19). Đề nghe hay dùng: {終電|しゅうでん}に{間|ま}に{合|あ}う？ — tính giờ.' },
        { w: '{乗|の}り{場|ば}', pos: 'danh từ', ipa: 'noriba', vi: 'bến, chỗ lên xe (buýt, taxi…)', ex: 'タクシー{乗|の}り{場|ば}は{駅|えき}の{西口|にしぐち}にあります。', exRo: 'Takushii noriba wa eki no nishiguchi ni arimasu.', exVi: 'Bến taxi ở cửa Tây của ga.', more: 'N3. **バス{乗|の}り{場|ば}・タクシー{乗|の}り{場|ば}・{三番乗|さんばんの}り{場|ば}**. Cùng khuôn V-ます + {場|ば}: {売|う}り{場|ば} (quầy bán), {置|お}き{場|ば} (chỗ để).' },
        { w: '{乗|の}り{越|こ}す', pos: 'động từ nhóm 1', ipa: 'norikosu', vi: 'đi quá ga định xuống', ex: '{寝|ね}てしまって、{二駅|ふたえき}{乗|の}り{越|こ}した。', exRo: 'Nete shimatte, futaeki norikoshita.', exVi: 'Ngủ quên nên tôi đi quá hai ga.', more: 'N3. Đi quá thì phải trả thêm: **{乗|の}り{越|こ}し{精算|せいさん}** (máy bù tiền vé ở cửa soát vé).' },
        { w: '{払|はら}い{戻|もど}し', pos: 'danh từ', ipa: 'haraimodoshi', vi: 'hoàn tiền, trả lại tiền', ex: '{試合|しあい}が{中止|ちゅうし}になったので、チケット{代|だい}の{払|はら}い{戻|もど}しがあります。', exRo: 'Shiai ga chuushi ni natta node, chiketto dai no haraimodoshi ga arimasu.', exVi: 'Trận đấu bị huỷ nên có hoàn tiền vé.', more: 'N2. Động từ: **{払|はら}い{戻|もど}す**. Nơi: {窓口|まどぐち}で{払|はら}い{戻|もど}す. Nghe trong thông báo huỷ chuyến, huỷ sự kiện.' },
        { w: '{駐車場|ちゅうしゃじょう}', pos: 'danh từ', ipa: 'chuushajou', vi: 'bãi đỗ xe (ô tô)', ex: 'お{店|みせ}の{駐車場|ちゅうしゃじょう}はいつも{満車|まんしゃ}だ。', exRo: 'Omise no chuushajou wa itsumo mansha da.', exVi: 'Bãi đỗ xe của quán lúc nào cũng kín.', more: 'N3. Xe đạp: **{駐輪場|ちゅうりんじょう}** (Bài 14). {満車|まんしゃ} = bãi đầy ↔ {空車|くうしゃ} = còn chỗ (bảng điện ở cổng bãi xe).' },
      ],
    },

    /* ── C ── */
    { t: 'h', text: 'C. Cửa hàng & dịch vụ — từ ở quầy thu ngân (13 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{税込|ぜいこ}み', pos: 'danh từ', ipa: 'zeikomi', vi: 'đã gồm thuế', ex: 'このお{弁当|べんとう}は{税込|ぜいこ}みで{五百四十円|ごひゃくよんじゅうえん}です。', exRo: 'Kono obentou wa zeikomi de gohyaku yonjuu en desu.', exVi: 'Hộp cơm này giá 540 yên đã gồm thuế.', more: 'N3. Cặp đối **{税込|ぜいこ}み ↔ {税抜|ぜいぬ}き** — đề nghe tính tiền hay đặt BẪY ở đây. Thuế: **{消費税|しょうひぜい}** (thuế tiêu dùng).' },
        { w: '{税抜|ぜいぬ}き', pos: 'danh từ', ipa: 'zeinuki', vi: 'chưa gồm thuế', ex: '{値札|ねふだ}の{値段|ねだん}は{税抜|ぜいぬ}きです。レジで{税金|ぜいきん}がかかります。', exRo: 'Nefuda no nedan wa zeinuki desu. Reji de zeikin ga kakarimasu.', exVi: 'Giá trên nhãn là chưa gồm thuế. Ra quầy sẽ tính thêm thuế.', more: '{抜|ぬ}き = bỏ ra (V-ます danh từ hoá): {朝|あさ}ご{飯|はん}{抜|ぬ}き (nhịn sáng). Câu hỏi đề: 「{全部|ぜんぶ}でいくら{払|はら}いますか」 → nhớ cộng thuế nếu là {税抜|ぜいぬ}き.' },
        { w: '{領収書|りょうしゅうしょ}', pos: 'danh từ', ipa: 'ryoushuusho', vi: 'hoá đơn (biên lai có ghi tên người nhận — để thanh toán chi phí)', ex: 'すみません、{領収書|りょうしゅうしょ}をお{願|ねが}いします。{宛名|あてな}は「さくらシステム」で。', exRo: 'Sumimasen, ryoushuusho o onegai shimasu. Atena wa "Sakura Shisutemu" de.', exVi: 'Xin cho tôi hoá đơn. Tên người nhận ghi "Sakura System".', more: 'N3. Ba chữ mới đều ở bài này: {領|りょう} (nhận) + {収|しゅう} + {書|しょ}. Cụm: **{領収書|りょうしゅうしょ}をもらう／{切|き}る** (viết hoá đơn). ⚠ Khác **レシート** — xem bảng 類義語.' },
        { w: 'レシート', pos: 'danh từ', ipa: 'reshiito', vi: 'hoá đơn in (từ máy tính tiền)', ex: '{返品|へんぴん}するときは、レシートが{必要|ひつよう}です。', exRo: 'Henpin suru toki wa, reshiito ga hitsuyou desu.', exVi: 'Khi trả hàng cần có hoá đơn in.', more: 'Câu thu ngân hay hỏi: **レシートはご{利用|りよう}ですか** (quý khách có lấy hoá đơn không). Trường âm: re**shii**to.' },
        { w: 'お{釣|つ}り', pos: 'danh từ', ipa: 'otsuri', vi: 'tiền thừa (trả lại)', ex: '{千円|せんえん}お{預|あず}かりします。{三百円|さんびゃくえん}のお{釣|つ}りです。', exRo: 'Sen en oazukari shimasu. Sanbyaku en no otsuri desu.', exVi: 'Tôi nhận của quý khách 1.000 yên. Tiền thừa 300 yên ạ.', more: 'Câu thu ngân chuẩn: **～お{預|あず}かりします → ～のお{返|かえ}し／お{釣|つ}りです**. Đề nghe tính tiền: giá – tiền đưa – tiền thừa.' },
        { w: '{会計|かいけい}', pos: 'danh từ', ipa: 'kaikei', vi: 'việc thanh toán, tính tiền', ex: 'お{会計|かいけい}はレジでお{願|ねが}いします。', exRo: 'Okaikei wa reji de onegai shimasu.', exVi: 'Xin quý khách thanh toán ở quầy.', more: 'N3. Ở quán: **お{会計|かいけい}お{願|ねが}いします** (tính tiền giúp tôi). Cụm: **{会計|かいけい}を{済|す}ませる** (thanh toán xong). Ở công ty: {会計|かいけい} = kế toán.' },
        { w: 'レジ{袋|ぶくろ}', pos: 'danh từ', ipa: 'rejibukuro', vi: 'túi nilon (ở quầy thu ngân)', ex: 'レジ{袋|ぶくろ}は{有料|ゆうりょう}ですが、お{使|つか}いになりますか。', exRo: 'Rejibukuro wa yuuryou desu ga, otsukai ni narimasu ka.', exVi: 'Túi nilon có tính phí, quý khách có dùng không ạ?', more: '{袋|ふくろ} (Bài 31) → **ぶくろ** (biến âm khi ghép). Ở Nhật túi nilon tính phí từ 2020 — câu hỏi rất hay gặp ở quầy. Đáp: **いえ、{大丈夫|だいじょうぶ}です** (không cần).' },
        { w: 'お{持|も}ち{帰|かえ}り', pos: 'danh từ', ipa: 'omochikaeri', vi: 'mang về (đồ ăn)', ex: 'こちらでお{召|め}し{上|あ}がりですか、お{持|も}ち{帰|かえ}りですか。', exRo: 'Kochira de omeshiagari desu ka, omochikaeri desu ka.', exVi: 'Quý khách dùng tại đây hay mang về ạ?', more: 'N3. Câu kinh điển ở quán đồ ăn nhanh. Đáp: **{持|も}ち{帰|かえ}りで** / **{店内|てんない}で**. Thuế ăn tại chỗ và mang về có thể khác nhau.' },
        { w: '{店内|てんない}', pos: 'danh từ', ipa: 'tennai', vi: 'trong cửa hàng', ex: '{店内|てんない}でお{召|め}し{上|あ}がりの{方|かた}は、こちらにお{並|なら}びください。', exRo: 'Tennai de omeshiagari no kata wa, kochira ni onarabi kudasai.', exVi: 'Quý khách dùng tại chỗ xin xếp hàng ở đây.', more: 'Cụm: **{店内|てんない}{放送|ほうそう}** (loa trong cửa hàng) · **{店内|てんない}{飲食|いんしょく}** (ăn uống tại chỗ). Khuôn ～{内|ない}: {車内|しゃない}, {館内|かんない}, {社内|しゃない}.' },
        { w: '{取|と}り{寄|よ}せる', pos: 'động từ nhóm 2', ipa: 'toriyoseru', vi: 'đặt hàng về (cho gửi tới)', ex: 'このサイズは{品切|しなぎ}れなので、お{取|と}り{寄|よ}せになります。', exRo: 'Kono saizu wa shinagire na node, otoriyose ni narimasu.', exVi: 'Cỡ này hết hàng nên phải đặt hàng về ạ.', more: 'N2. Câu cửa hàng: **お{取|と}り{寄|よ}せできます・{一週間|いっしゅうかん}ほどかかります**. Đi cùng {品切|しなぎ}れ・{在庫|ざいこ} (Bài 38).' },
        { w: '{返品|へんぴん}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'henpin (suru)', vi: 'trả lại hàng', ex: 'サイズが{合|あ}わなかったので、{返品|へんぴん}した。', exRo: 'Saizu ga awanakatta node, henpin shita.', exVi: 'Không vừa cỡ nên tôi đã trả hàng.', more: 'N2. Gần nghĩa: **{交換|こうかん}** (đổi hàng — Bài 38). Thông báo: {返品|へんぴん}・{交換|こうかん}は{一週間|いっしゅうかん}{以内|いない}、レシートをお{持|も}ちください.' },
        { w: '{営業時間|えいぎょうじかん}', pos: 'danh từ', ipa: 'eigyou jikan', vi: 'giờ mở cửa (kinh doanh)', ex: '{年末|ねんまつ}は{営業時間|えいぎょうじかん}が{変|か}わります。', exRo: 'Nenmatsu wa eigyou jikan ga kawarimasu.', exVi: 'Cuối năm giờ mở cửa thay đổi.', more: '{営業|えいぎょう} (Bài 21). Loa siêu thị cuối ngày: **{本日|ほんじつ}の{営業|えいぎょう}は{九時|くじ}までとなっております**.' },
        { w: '{定休日|ていきゅうび}', pos: 'danh từ', ipa: 'teikyuubi', vi: 'ngày nghỉ định kỳ (của cửa hàng)', ex: 'あの{店|みせ}は{水曜日|すいようび}が{定休日|ていきゅうび}だ。', exRo: 'Ano mise wa suiyoubi ga teikyuubi da.', exVi: 'Quán kia nghỉ vào thứ Tư hằng tuần.', more: 'N3. Bẫy đề nghe: "Thứ Tư đi được không?" → nếu {定休日|ていきゅうび} là thứ Tư thì loại. Khác **{臨時休業|りんじきゅうぎょう}** (nghỉ đột xuất — {臨時|りんじ} Bài 38).' },
      ],
    },

    /* ── D ── */
    { t: 'h', text: 'D. Bệnh viện, ngân hàng & thủ tục — từ ở quầy (11 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{診察券|しんさつけん}', pos: 'danh từ', ipa: 'shinsatsuken', vi: 'thẻ khám bệnh (của phòng khám)', ex: '{二回目|にかいめ}からは、{受付|うけつけ}に{診察券|しんさつけん}を{出|だ}してください。', exRo: 'Nikaime kara wa, uketsuke ni shinsatsuken o dashite kudasai.', exVi: 'Từ lần thứ hai, hãy đưa thẻ khám bệnh cho lễ tân.', more: '{診察|しんさつ} (Bài 29) + {券|けん}. Lần đầu: **{保険証|ほけんしょう}** (Bài 12). Câu lễ tân: **{診察券|しんさつけん}と{保険証|ほけんしょう}をお{願|ねが}いします**.' },
        { w: '{体温計|たいおんけい}', pos: 'danh từ', ipa: 'taionkei', vi: 'nhiệt kế (đo thân nhiệt)', ex: '{体温計|たいおんけい}で{熱|ねつ}を{測|はか}ったら、{三十八度|さんじゅうはちど}あった。', exRo: 'Taionkei de netsu o hakattara, sanjuuhachido atta.', exVi: 'Đo bằng nhiệt kế thì thấy sốt 38 độ.', more: '{体温|たいおん} (thân nhiệt) + {計|けい} (dụng cụ đo): {時計|とけい}, {温度計|おんどけい}. Động từ đi kèm: **{熱|ねつ}を{測|はか}る**.' },
        { w: '{傷|きず}', pos: 'danh từ', ipa: 'kizu', vi: 'vết thương, vết xước', ex: '{転|ころ}んで、{膝|ひざ}に{傷|きず}ができた。', exRo: 'Koronde, hiza ni kizu ga dekita.', exVi: 'Ngã nên đầu gối bị xước.', more: 'Chữ mới {傷|しょう}. Cũng dùng cho ĐỒ: **{車|くるま}に{傷|きず}がつく** (xe bị xước). **{傷|きず}つく／{傷|きず}つける** = tổn thương (cả tình cảm). ⚠ けが (Bài 12) = chấn thương nói chung; {傷|きず} = chỗ bị xước, rách.' },
        { w: '{花粉症|かふんしょう}', pos: 'danh từ', ipa: 'kafunshou', vi: 'dị ứng phấn hoa', ex: '{春|はる}になると、{花粉症|かふんしょう}でくしゃみが{止|と}まらない。', exRo: 'Haru ni naru to, kafunshou de kushami ga tomaranai.', exVi: 'Cứ đến mùa xuân là tôi bị dị ứng phấn hoa, hắt hơi không ngừng.', more: 'N3. {花粉|かふん} + {症|しょう} (chứng — chữ mới). Đề nghe mùa xuân hay có: マスク・{目|め}がかゆい・{鼻水|はなみず}.' },
        { w: '{熱中症|ねっちゅうしょう}', pos: 'danh từ', ipa: 'necchuushou', vi: 'say nắng, sốc nhiệt', ex: '{熱中症|ねっちゅうしょう}にならないように、こまめに{水|みず}を{飲|の}んでください。', exRo: 'Necchuushou ni naranai you ni, komame ni mizu o nonde kudasai.', exVi: 'Để không bị say nắng, hãy uống nước thường xuyên.', more: 'N2 — nhưng mùa hè ngày nào TV, trường học cũng nhắc. Cụm: **{熱中症|ねっちゅうしょう}に{気|き}をつける** · **{熱中症対策|ねっちゅうしょうたいさく}**. こまめに = thường xuyên, từng chút.' },
        { w: '{整理券|せいりけん}', pos: 'danh từ', ipa: 'seiriken', vi: 'vé (phiếu) số thứ tự', ex: '{整理券|せいりけん}をお{取|と}りになって、{番号|ばんごう}が{呼|よ}ばれるまでお{待|ま}ちください。', exRo: 'Seiriken o otori ni natte, bangou ga yobareru made omachi kudasai.', exVi: 'Xin lấy phiếu số thứ tự và chờ đến khi số được gọi.', more: '{整理|せいり} (sắp xếp) + {券|けん}. Gặp ở ngân hàng, bưu điện, sự kiện, xe buýt (lấy {整理券|せいりけん} khi lên). Cụm: **{整理券|せいりけん}を{取|と}る／{配|くば}る**.' },
        { w: '{身分証明書|みぶんしょうめいしょ}', pos: 'danh từ', ipa: 'mibun shoumeisho', vi: 'giấy tờ tuỳ thân', ex: '{口座|こうざ}を{作|つく}るときは、{身分証明書|みぶんしょうめいしょ}が{必要|ひつよう}です。', exRo: 'Kouza o tsukuru toki wa, mibun shoumeisho ga hitsuyou desu.', exVi: 'Khi mở tài khoản cần giấy tờ tuỳ thân.', more: 'N3. Ví dụ: {在留|ざいりゅう}カード, {学生証|がくせいしょう} (Bài 31), パスポート. Câu quầy thủ tục: **ご{本人|ほんにん}{確認|かくにん}のため、{身分証明書|みぶんしょうめいしょ}をお{願|ねが}いします**.' },
        { w: '{暗証番号|あんしょうばんごう}', pos: 'danh từ', ipa: 'anshou bangou', vi: 'mã PIN, mật mã số', ex: 'こちらに{四桁|よんけた}の{暗証番号|あんしょうばんごう}を{入力|にゅうりょく}してください。', exRo: 'Kochira ni yonketa no anshou bangou o nyuuryoku shite kudasai.', exVi: 'Xin nhập mã PIN 4 chữ số vào đây.', more: 'N2. {入力|にゅうりょく} (Bài 35). {桁|けた} = chữ số (hàng): {四桁|よんけた} = 4 chữ số. ⚠ Đề nghe hay đặt bẫy "quên mã PIN thì làm gì".' },
        { w: '{印鑑|いんかん}', pos: 'danh từ', ipa: 'inkan', vi: 'con dấu (cá nhân)', ex: 'ここにサインか、{印鑑|いんかん}をお{願|ねが}いします。', exRo: 'Koko ni sain ka, inkan o onegai shimasu.', exVi: 'Xin ký tên hoặc đóng dấu vào đây.', more: 'N2. Văn nói: **はんこ** — **はんこを{押|お}す** (đóng dấu). Nhận bưu kiện: はんこかサインをお{願|ねが}いします.' },
        { w: '{紛失|ふんしつ}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'funshitsu (suru)', vi: 'đánh mất, thất lạc (trang trọng)', ex: 'カードを{紛失|ふんしつ}した{場合|ばあい}は、すぐにご{連絡|れんらく}ください。', exRo: 'Kaado o funshitsu shita baai wa, sugu ni gorenraku kudasai.', exVi: 'Trường hợp làm mất thẻ, xin liên lạc ngay.', more: 'N2. Văn nói: **なくす** (Bài 12). {紛失|ふんしつ} gặp ở thông báo, quầy thủ tục: **{紛失届|ふんしつとどけ}** (đơn báo mất).' },
        { w: '{再発行|さいはっこう}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'saihakkou (suru)', vi: 'cấp lại (thẻ, giấy tờ)', ex: '{学生証|がくせいしょう}の{再発行|さいはっこう}には、{三日|みっか}かかります。', exRo: 'Gakuseishou no saihakkou ni wa, mikka kakarimasu.', exVi: 'Cấp lại thẻ sinh viên mất 3 ngày.', more: 'N2. {再|さい}～ = lại: {再開|さいかい} (Bài 27), **{再配達|さいはいたつ}** (nhóm E), {再試験|さいしけん}. Chuỗi hay gặp trong đề 課題理解: {紛失|ふんしつ} → {届|とど}け → {再発行|さいはっこう}.' },
      ],
    },

    /* ── E ── */
    { t: 'h', text: 'E. Trường học, sự kiện, đặt chỗ & giao hàng (10 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{補習|ほしゅう}', pos: 'danh từ', ipa: 'hoshuu', vi: 'học bù, học phụ đạo', ex: '{休講|きゅうこう}になった{授業|じゅぎょう}の{補習|ほしゅう}は、{土曜日|どようび}にあります。', exRo: 'Kyuukou ni natta jugyou no hoshuu wa, doyoubi ni arimasu.', exVi: 'Buổi học bù cho tiết bị nghỉ sẽ vào thứ Bảy.', more: 'N2. {補|ほ} (bổ sung — chữ mới) + {習|しゅう}. Đi với **{休講|きゅうこう}** (Bài 26). Thông báo trường: **{補講|ほこう}** (dạy bù — cùng nghĩa, phía giảng viên).' },
        { w: '{訂正|ていせい}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'teisei (suru)', vi: 'đính chính, sửa lại (cho đúng)', ex: '{先|さき}ほどのお{知|し}らせに{間違|まちが}いがありましたので、{訂正|ていせい}いたします。', exRo: 'Sakihodo no oshirase ni machigai ga arimashita node, teisei itashimasu.', exVi: 'Thông báo vừa rồi có chỗ sai nên xin đính chính.', more: 'N2. ⚠ Đề nghe RẤT thích kiểu này: thông báo nói A, rồi **{訂正|ていせい}いたします** → B. Đáp án là **B**. Khác **{修正|しゅうせい}** (Bài 35 — chỉnh sửa văn bản, dữ liệu).' },
        { w: '{開催|かいさい}（する）', pos: 'danh từ / động từ nhóm 3', ipa: 'kaisai (suru)', vi: 'tổ chức (sự kiện, hội nghị)', ex: '{大学祭|だいがくさい}は{十一月|じゅういちがつ}に{開催|かいさい}されます。', exRo: 'Daigakusai wa juuichigatsu ni kaisai saremasu.', exVi: 'Lễ hội trường được tổ chức vào tháng 11.', more: 'N2. Văn nói: ～を{開|ひら}く・～がある. Thông báo: **{予定|よてい}どおり{開催|かいさい}します** (vẫn tổ chức như dự kiến) ↔ **{中止|ちゅうし}** (huỷ) ↔ **{延期|えんき}** (hoãn — Bài 27).' },
        { w: '{雨天|うてん}', pos: 'danh từ', ipa: 'uten', vi: 'trời mưa (văn thông báo)', ex: '{雨天|うてん}の{場合|ばあい}は、{体育館|たいいくかん}で{行|おこな}います。', exRo: 'Uten no baai wa, taiikukan de okonaimasu.', exVi: 'Trường hợp trời mưa sẽ tổ chức ở nhà thể chất.', more: 'N2. Cụm thông báo: **{雨天中止|うてんちゅうし}** (mưa thì huỷ) · **{雨天決行|うてんけっこう}** (mưa vẫn tổ chức) · **{小雨決行|こさめけっこう}** (mưa nhỏ vẫn làm). ⚠ Đọc **うてん**, không phải あめてん.' },
        { w: '{満席|まんせき}', pos: 'danh từ', ipa: 'manseki', vi: 'kín chỗ, hết ghế', ex: '{金曜日|きんようび}の{夜|よる}の{便|びん}は、もう{満席|まんせき}です。', exRo: 'Kin\'youbi no yoru no bin wa, mou manseki desu.', exVi: 'Chuyến bay tối thứ Sáu đã kín chỗ.', more: 'N3. Dùng cho chỗ NGỒI có số (quán, tàu, rạp, máy bay). ⚠ **{満員|まんいん}** (Bài 22) = đông kín NGƯỜI (tàu chật, phòng chật).' },
        { w: '{空席|くうせき}', pos: 'danh từ', ipa: 'kuuseki', vi: 'ghế trống, chỗ còn trống', ex: '{窓側|まどがわ}の{空席|くうせき}はありますか。', exRo: 'Madogawa no kuuseki wa arimasu ka.', exVi: 'Còn ghế trống phía cửa sổ không?', more: 'N3. Trái **{満席|まんせき}**. Trang trọng (bảng điện, quầy vé). Văn nói: **{空|あ}いている{席|せき}**.' },
        { w: '{空|あ}き', pos: 'danh từ', ipa: 'aki', vi: 'chỗ trống, cái còn trống (chỗ, phòng, giờ)', ex: '{来週|らいしゅう}の{予約|よやく}に{空|あ}きが{出|で}たら、{連絡|れんらく}します。', exRo: 'Raishuu no yoyaku ni aki ga detara, renraku shimasu.', exVi: 'Nếu lịch đặt tuần sau có chỗ trống, tôi sẽ liên lạc.', more: 'N3. Danh từ của {空|あ}く. Cụm: **{空|あ}きがある／ない・{空|あ}きが{出|で}る** (có người huỷ nên trống) · **{空|あ}き{部屋|べや}** · **{空|あ}き{時間|じかん}**.' },
        { w: '{請求書|せいきゅうしょ}', pos: 'danh từ', ipa: 'seikyuusho', vi: 'giấy đòi tiền, hoá đơn thanh toán (gửi để yêu cầu trả)', ex: '{今月|こんげつ}の{請求書|せいきゅうしょ}が{届|とど}いたので、{来週|らいしゅう}までに{振|ふ}り{込|こ}みます。', exRo: 'Kongetsu no seikyuusho ga todoita node, raishuu made ni furikomimasu.', exVi: 'Hoá đơn tháng này đã đến nên tôi sẽ chuyển khoản trước tuần sau.', more: 'N2. {請|せい} (xin — chữ mới) + {求|きゅう} (đòi). Chuỗi: **{見積|みつ}もり** (Bài 37 — báo giá) → **{請求書|せいきゅうしょ}** (đòi tiền) → **{領収書|りょうしゅうしょ}** (đã nhận tiền).' },
        { w: '{手数料|てすうりょう}', pos: 'danh từ', ipa: 'tesuuryou', vi: 'phí dịch vụ, phí thủ tục', ex: '{夜|よる}{七時|しちじ}{以降|いこう}にお{金|かね}を{下|お}ろすと、{手数料|てすうりょう}がかかります。', exRo: 'Yoru shichiji ikou ni okane o orosu to, tesuuryou ga kakarimasu.', exVi: 'Rút tiền sau 7 giờ tối thì mất phí.', more: 'N2. お{手数|てすう} (Bài 35) + {料|りょう}. Cụm: **{手数料|てすうりょう}がかかる／{無料|むりょう}**. Đề nghe tính tiền hay thêm phí này.' },
        { w: '{再配達|さいはいたつ}', pos: 'danh từ', ipa: 'saihaitatsu', vi: 'giao lại (bưu kiện khi vắng nhà)', ex: '{留守|るす}だったので、{再配達|さいはいたつ}を{頼|たの}んだ。', exRo: 'Rusu datta node, saihaitatsu o tanonda.', exVi: 'Vì vắng nhà nên tôi đã yêu cầu giao lại.', more: 'N3. {再|さい} + {配達|はいたつ} (giao hàng). Tờ giấy dán cửa: **{不在連絡票|ふざいれんらくひょう}** ({不在|ふざい} Bài 30). Đề 課題理解 hay hỏi: gọi điện / quét mã để hẹn {再配達|さいはいたつ}.' },
      ],
    },

    /* ── F ── */
    { t: 'h', text: 'F. Từ hay gặp trong lời nói — phó từ & động từ nhỏ mang THÁI ĐỘ (9 từ)' },
    {
      t: 'vocab',
      items: [
        { w: 'とりあえず', pos: 'phó từ', ipa: 'toriaezu', vi: 'trước mắt, tạm thời (làm cái này trước đã)', ex: '{詳|くわ}しいことはあとで{話|はな}すから、とりあえず{会議室|かいぎしつ}に{来|き}て。', exRo: 'Kuwashii koto wa ato de hanasu kara, toriaezu kaigishitsu ni kite.', exVi: 'Chi tiết nói sau, trước mắt cứ đến phòng họp đã.', more: 'N3. ⭐ **Dấu hiệu "làm gì TRƯỚC"** trong đề 課題理解: とりあえず + V = việc làm NGAY. Ở quán nhậu: とりあえずビール (trước hết cho bia).' },
        { w: 'さっそく', pos: 'phó từ', ipa: 'sassoku', vi: 'ngay lập tức, liền (không chần chừ)', ex: '{新|あたら}しいアプリを{教|おし}えてもらって、さっそく{使|つか}ってみた。', exRo: 'Atarashii apuri o oshiete moratte, sassoku tsukatte mita.', exVi: 'Được chỉ app mới, tôi dùng thử ngay.', more: 'N3. Viết chữ Hán: {早速|さっそく}. Mở đầu cuộc họp: **では、さっそく{始|はじ}めましょう**.' },
        { w: 'ついでに', pos: 'phó từ', ipa: 'tsuide ni', vi: 'tiện thể, nhân tiện', ex: 'コンビニに{行|い}くなら、ついでに{牛乳|ぎゅうにゅう}も{買|か}ってきて。', exRo: 'Konbini ni iku nara, tsuide ni gyuunyuu mo katte kite.', exVi: 'Nếu ra cửa hàng tiện lợi thì tiện mua giúp sữa nhé.', more: 'N3. ⚠ Trong đề 課題理解, việc nhờ "ついでに" cũng là **việc phải làm** — nhưng thường làm **SAU** việc chính. Khuôn: N のついでに / V-る・V-た ついでに.' },
        { w: 'どうせ', pos: 'phó từ', ipa: 'douse', vi: 'đằng nào cũng, dù sao thì (thường giọng chán, buông xuôi)', ex: 'どうせ{間|ま}に{合|あ}わないから、ゆっくり{行|い}こう。', exRo: 'Douse ma ni awanai kara, yukkuri ikou.', exVi: 'Đằng nào cũng không kịp rồi, cứ đi thong thả thôi.', more: 'N3. Mang **thái độ tiêu cực, buông xuôi** — đề 概要理解 hỏi "người nói cảm thấy thế nào" thì đây là manh mối. Có khi tích cực: どうせやるなら、{楽|たの}しくやろう.' },
        { w: 'せめて', pos: 'phó từ', ipa: 'semete', vi: 'ít nhất thì, tối thiểu cũng', ex: '{忙|いそが}しくても、せめて{朝|あさ}ご{飯|はん}は{食|た}べたほうがいい。', exRo: 'Isogashikute mo, semete asagohan wa tabeta hou ga ii.', exVi: 'Dù bận thì ít nhất cũng nên ăn sáng.', more: 'N3. Hay đi với **～だけでも・～くらい・～たい・～てほしい**: せめて{一日|いちにち}だけでも{休|やす}みたい. Nghe せめて → điều theo sau là **mong muốn tối thiểu**.' },
        { w: 'なんとか', pos: 'phó từ', ipa: 'nantoka', vi: 'bằng cách nào đó, xoay xở được', ex: '{走|はし}って、なんとか{終電|しゅうでん}に{間|ま}に{合|あ}った。', exRo: 'Hashitte, nantoka shuuden ni ma ni atta.', exVi: 'Chạy một mạch, cuối cùng cũng kịp chuyến tàu cuối.', more: 'N3. Chữ: {何|なん}とか. Cụm: **なんとかなる** (rồi sẽ ổn) · **なんとかする** (tìm cách) · **なんとか～た** (khó khăn nhưng làm được). Nghe なんとか{間|ま}に{合|あ}った → KỊP (không phải trễ).' },
        { w: '{早|はや}める', pos: 'động từ nhóm 2', ipa: 'hayameru', vi: 'đẩy sớm lên, làm cho sớm hơn', ex: '{台風|たいふう}が{来|く}るので、{出発|しゅっぱつ}を{一時間|いちじかん}{早|はや}めます。', exRo: 'Taifuu ga kuru node, shuppatsu o ichijikan hayamemasu.', exVi: 'Vì bão đến nên xuất phát sớm hơn một tiếng.', more: 'N3. Tha động từ (～を{早|はや}める). Trái: **{遅|おく}らせる**. ⚠ Khác **{急|いそ}ぐ** (vội — làm nhanh). Đề nghe: "{会議|かいぎ}を{三十分|さんじゅっぷん}{早|はや}めて{二時|にじ}から" → tính giờ mới.' },
        { w: '{遅|おく}らせる', pos: 'động từ nhóm 2', ipa: 'okuraseru', vi: 'lùi lại, làm cho muộn đi', ex: '{雨|あめ}がひどいので、{試合|しあい}の{開始|かいし}を{三十分|さんじゅっぷん}{遅|おく}らせます。', exRo: 'Ame ga hidoi node, shiai no kaishi o sanjuppun okurasemasu.', exVi: 'Mưa to quá nên lùi giờ bắt đầu trận đấu 30 phút.', more: 'N3. Hình thức là sai khiến của {遅|おく}れる (Bài 23) nhưng dùng như một động từ riêng. Cặp đề hay hỏi: **{早|はや}める ↔ {遅|おく}らせる ↔ {延期|えんき}する** (hoãn sang ngày khác).' },
        { w: '{配|くば}る', pos: 'động từ nhóm 1', ipa: 'kubaru', vi: 'phát (cho nhiều người), phân phát', ex: '{会議|かいぎ}の{前|まえ}に、この{資料|しりょう}をみんなに{配|くば}ってください。', exRo: 'Kaigi no mae ni, kono shiryou o minna ni kubatte kudasai.', exVi: 'Trước cuộc họp, hãy phát tài liệu này cho mọi người.', more: 'N3. Cụm: **チラシを{配|くば}る** (phát tờ rơi) · **{気|き}を{配|くば}る** (để ý, chu đáo). ⚠ Khác **{渡|わた}す** (đưa cho MỘT người).' },
      ],
    },

    /* ── Thẻ hình ── */
    {
      t: 'hinh',
      title: 'Thẻ hình — 18 thứ bạn sẽ "nghe thấy" trong đề',
      items: [
        { anh: 'headphone', w: '{聴解|ちょうかい}', ro: 'choukai', vi: 'nghe hiểu' },
        { anh: 'loudspeaker', w: 'アナウンス', ro: 'anaunsu', vi: 'thông báo qua loa' },
        { anh: 'station', w: '～{番線|ばんせん}', ro: '~bansen', vi: 'đường ray số…' },
        { anh: 'high-speed-train', w: '{快速|かいそく}', ro: 'kaisoku', vi: 'tàu nhanh' },
        { anh: 'bus-stop', w: '{乗|の}り{場|ば}', ro: 'noriba', vi: 'bến, chỗ lên xe' },
        { anh: 'automobile', w: '{駐車場|ちゅうしゃじょう}', ro: 'chuushajou', vi: 'bãi đỗ xe' },
        { anh: 'receipt', w: 'レシート', ro: 'reshiito', vi: 'hoá đơn in' },
        { anh: 'coin', w: 'お{釣|つ}り', ro: 'otsuri', vi: 'tiền thừa' },
        { anh: 'shopping-bags', w: 'レジ{袋|ぶくろ}', ro: 'rejibukuro', vi: 'túi nilon' },
        { anh: 'bento-box', w: 'お{持|も}ち{帰|かえ}り', ro: 'omochikaeri', vi: 'mang về' },
        { anh: 'thermometer', w: '{体温計|たいおんけい}', ro: 'taionkei', vi: 'nhiệt kế' },
        { anh: 'adhesive-bandage', w: '{傷|きず}', ro: 'kizu', vi: 'vết thương' },
        { anh: 'sneezing-face', w: '{花粉症|かふんしょう}', ro: 'kafunshou', vi: 'dị ứng phấn hoa' },
        { anh: 'hot-face', w: '{熱中症|ねっちゅうしょう}', ro: 'necchuushou', vi: 'say nắng' },
        { anh: 'identification-card', w: '{身分証明書|みぶんしょうめいしょ}', ro: 'mibun shoumeisho', vi: 'giấy tờ tuỳ thân' },
        { anh: 'ticket', w: '{整理券|せいりけん}', ro: 'seiriken', vi: 'phiếu số thứ tự' },
        { anh: 'umbrella-with-rain-drops', w: '{雨天|うてん}', ro: 'uten', vi: 'trời mưa (thông báo)' },
        { anh: 'package', w: '{再配達|さいはいたつ}', ro: 'saihaitatsu', vi: 'giao lại bưu kiện' },
      ],
    },

    /* ── Cụm với kỹ năng nghe ── */
    {
      t: 'table',
      caption: 'Từ của bài trong CÂU THEN CHỐT của đề nghe — nghe ra cụm này là có đáp án',
      head: ['Từ', 'Câu then chốt hay gặp', 'Romaji', 'Nghĩa — dạng đề'],
      rows: [
        ['とりあえず', 'とりあえず、{会議室|かいぎしつ}の{準備|じゅんび}をしておいて。', 'Toriaezu, kaigishitsu no junbi o shite oite.', 'trước mắt chuẩn bị phòng họp đi — 課題理解 (việc làm NGAY)'],
        ['ついでに', 'ついでに、{郵便局|ゆうびんきょく}にも{寄|よ}ってきてくれる？', 'Tsuide ni, yuubinkyoku ni mo yotte kite kureru?', 'tiện ghé bưu điện giúp nhé — 課題理解 (việc làm SAU việc chính)'],
        ['{訂正|ていせい}', '{先|さき}ほどのお{知|し}らせを{訂正|ていせい}いたします。', 'Sakihodo no oshirase o teisei itashimasu.', 'xin đính chính thông báo vừa rồi — ポイント理解 (thông tin MỚI là đáp án)'],
        ['{雨天|うてん}', '{雨天|うてん}の{場合|ばあい}は、{体育館|たいいくかん}で{行|おこな}います。', 'Uten no baai wa, taiikukan de okonaimasu.', 'nếu mưa thì làm ở nhà thể chất — ポイント理解 (điều kiện)'],
        ['{税抜|ぜいぬ}き', 'こちらは{税抜|ぜいぬ}きの{値段|ねだん}になります。', 'Kochira wa zeinuki no nedan ni narimasu.', 'đây là giá chưa thuế — 課題理解／ポイント理解 (tính tiền)'],
        ['{早|はや}める', '{会議|かいぎ}を{三十分|さんじゅっぷん}{早|はや}めることになりました。', 'Kaigi o sanjuppun hayameru koto ni narimashita.', 'cuộc họp được đẩy sớm 30 phút — ポイント理解 (giờ MỚI)'],
        ['{見込|みこ}み', '{運転再開|うんてんさいかい}の{見込|みこ}みは{立|た}っておりません。', 'Unten saikai no mikomi wa tatte orimasen.', 'chưa biết bao giờ chạy lại — ポイント理解／即時応答'],
        ['どうせ', 'どうせ{行|い}っても、もう{売|う}り{切|き}れだよ。', 'Douse itte mo, mou urikire da yo.', 'đằng nào đi cũng hết rồi — 概要理解 (thái độ buông xuôi)'],
        ['せめて', 'せめて{連絡|れんらく}だけでもしてほしかった。', 'Semete renraku dake demo shite hoshikatta.', 'ít ra cũng nên liên lạc — 概要理解／即時応答 (trách nhẹ)'],
        ['なんとか', 'なんとか{間|ま}に{合|あ}いました。', 'Nantoka ma ni aimashita.', 'cuối cùng cũng kịp — 即時応答 (đáp: よかったですね)'],
      ],
    },

    /* ── 類義語 ── */
    {
      t: 'table',
      caption: '⭐ Từ dễ nhầm (類義語) — nhầm khi NGHE là chọn sai đáp án',
      head: ['Nhóm', 'Phân biệt', 'Ví dụ đúng', 'Romaji'],
      rows: [
        ['{税込|ぜいこ}み ↔ {税抜|ぜいぬ}き', '{税込|ぜいこ}み: giá ĐÃ cộng thuế (trả đúng số đó) · {税抜|ぜいぬ}き: giá CHƯA thuế (trả nhiều hơn)', '{税抜|ぜいぬ}き{千円|せんえん}なら、{税込|ぜいこ}みで{千百円|せんひゃくえん}です。', 'Zeinuki sen en nara, zeikomi de senhyaku en desu.'],
        ['{領収書|りょうしゅうしょ} ↔ レシート ↔ {請求書|せいきゅうしょ}', 'レシート: phiếu in tự động, ghi từng món · {領収書|りょうしゅうしょ}: hoá đơn ghi TÊN người trả (công ty thanh toán) · {請求書|せいきゅうしょ}: giấy ĐÒI tiền (chưa trả)', '{会社|かいしゃ}に{出|だ}すので、{領収書|りょうしゅうしょ}をください。', 'Kaisha ni dasu node, ryoushuusho o kudasai.'],
        ['{満席|まんせき} ↔ {満員|まんいん} ↔ {満車|まんしゃ}', '{満席|まんせき}: hết GHẾ (quán, tàu, máy bay) · {満員|まんいん} (Bài 22): đầy NGƯỜI (tàu chật, thang máy) · {満車|まんしゃ}: bãi đỗ hết chỗ XE', '{満員電車|まんいんでんしゃ}／レストランは{満席|まんせき}／{駐車場|ちゅうしゃじょう}は{満車|まんしゃ}', 'man\'in densha / resutoran wa manseki / chuushajou wa mansha'],
        ['{空席|くうせき} ↔ {空|あ}き ↔ {空|す}いている', '{空席|くうせき}: ghế trống (trang trọng) · {空|あ}き: chỗ / giờ / phòng còn trống (đặt chỗ) · {空|す}いている: VẮNG người (tàu, quán)', '{空席|くうせき}あり／{予約|よやく}に{空|あ}きがある／{電車|でんしゃ}が{空|す}いている', 'kuuseki ari / yoyaku ni aki ga aru / densha ga suite iru'],
        ['{聞|き}き{逃|のが}す ↔ {聞|き}き{流|なが}す ↔ {聞|き}き{間違|まちが}える', '{聞|き}き{逃|のが}す: muốn nghe mà SÓT · {聞|き}き{流|なが}す: cố ý nghe CHO QUA · {聞|き}き{間違|まちが}える (Bài 30): nghe NHẦM thành cái khác', '{名前|なまえ}を{聞|き}き{逃|のが}した／{文句|もんく}を{聞|き}き{流|なが}す／「{四|よん}」を「{七|なな}」と{聞|き}き{間違|まちが}えた', 'namae o kikinogashita / monku o kikinagasu / "yon" o "nana" to kikimachigaeta'],
        ['{早|はや}める ↔ {急|いそ}ぐ ↔ {早|はや}く', '{早|はや}める: đổi THỜI ĐIỂM sớm hơn (～を{早|はや}める) · {急|いそ}ぐ: làm cho NHANH, vội · {早|はや}く: phó từ "sớm / nhanh lên"', '{出発|しゅっぱつ}を{早|はや}める／{急|いそ}いで{行|い}く／{早|はや}く{来|き}て', 'shuppatsu o hayameru / isoide iku / hayaku kite'],
        ['{遅|おく}らせる ↔ {延期|えんき}する ↔ {遅|おく}れる', '{遅|おく}らせる: lùi giờ trong CÙNG ngày (～を{遅|おく}らせる) · {延期|えんき}する (Bài 27): hoãn sang NGÀY khác · {遅|おく}れる: BỊ muộn (tự động từ)', '{開始|かいし}を{一時間|いちじかん}{遅|おく}らせる／{試合|しあい}を{来週|らいしゅう}に{延期|えんき}する／バスが{遅|おく}れる', 'kaishi o ichijikan okuraseru / shiai o raishuu ni enki suru / basu ga okureru'],
        ['{発車|はっしゃ} ↔ {出発|しゅっぱつ}', '{発車|はっしゃ}: XE, TÀU chuyển bánh · {出発|しゅっぱつ}: NGƯỜI, đoàn, chuyến bay khởi hành', '{電車|でんしゃ}が{発車|はっしゃ}する／{私|わたし}たちは{七時|しちじ}に{出発|しゅっぱつ}する', 'densha ga hassha suru / watashitachi wa shichiji ni shuppatsu suru'],
        ['{紛失|ふんしつ}する ↔ なくす ↔ {落|お}とす', 'なくす (Bài 12): làm mất (văn nói) · {落|お}とす: đánh rơi · {紛失|ふんしつ}する: mất, thất lạc (văn thông báo, giấy tờ)', '{財布|さいふ}を{落|お}とした／{鍵|かぎ}をなくした／カードを{紛失|ふんしつ}した{場合|ばあい}', 'saifu o otoshita / kagi o nakushita / kaado o funshitsu shita baai'],
        ['{配|くば}る ↔ {渡|わた}す', '{配|くば}る: phát cho NHIỀU người, mỗi người một phần · {渡|わた}す (Bài 10): đưa cho MỘT người', 'チラシを{配|くば}る／{先生|せんせい}にレポートを{渡|わた}す', 'chirashi o kubaru / sensei ni repooto o watasu'],
        ['とりあえず ↔ さっそく ↔ ついでに', 'とりあえず: TẠM, làm cái này trước (chưa phải cuối cùng) · さっそく: NGAY, không chần chừ (đã quyết rồi) · ついでに: TIỆN thể, nhân dịp làm việc khác', 'とりあえず{水|みず}を{飲|の}む／さっそく{始|はじ}める／ついでに{買|か}う', 'toriaezu mizu o nomu / sassoku hajimeru / tsuide ni kau'],
        ['{傷|きず} ↔ けが', 'けが (Bài 12): chấn thương nói chung (gãy tay, bong gân) · {傷|きず}: CHỖ bị thương cụ thể (vết xước, vết cắt); cũng dùng cho đồ vật', '{足|あし}にけがをした／{手|て}に{小|ちい}さい{傷|きず}がある／{机|つくえ}に{傷|きず}がついた', 'ashi ni kega o shita / te ni chiisai kizu ga aru / tsukue ni kizu ga tsuita'],
      ],
    },
    {
      t: 'note',
      title: 'Kết hợp từ (コロケーション) — học thành cụm để nghe ra cả cụm',
      items: [
        '**A**: **{聴解|ちょうかい}{試験|しけん}** · **{大事|だいじ}なところを{聞|き}き{逃|のが}す** · **{話|はなし}を{聞|き}き{流|なが}す** · **～に{聞|き}き{覚|おぼ}えがある** · **{早口|はやくち}で{話|はな}す** · **{相|あい}づちを{打|う}つ** · **～の{見込|みこ}みです・{見込|みこ}みが{立|た}たない** · **お{呼|よ}び{出|だ}しいたします** · **アナウンスが{流|なが}れる／{入|はい}る**.',
        '**B**: **{間|ま}もなく{参|まい}ります** · **{白線|はくせん}の{内側|うちがわ}までお{下|さ}がりください** · **{車内|しゃない}アナウンス** · **{三番線|さんばんせん}から{発車|はっしゃ}する** · **{各駅停車|かくえきていしゃ}に{乗|の}り{換|か}える** · **{終電|しゅうでん}に{間|ま}に{合|あ}う／{乗|の}り{遅|おく}れる** · **タクシー{乗|の}り{場|ば}** · **{一駅|ひとえき}{乗|の}り{越|こ}す** · **{窓口|まどぐち}で{払|はら}い{戻|もど}しを{受|う}ける** · **{駐車場|ちゅうしゃじょう}に{車|くるま}を{止|と}める**.',
        '**C**: **{税込|ぜいこ}みで{千円|せんえん}** · **{領収書|りょうしゅうしょ}を{切|き}る／もらう** · **レシートをお{返|かえ}しします** · **お{釣|つ}りを{渡|わた}す** · **お{会計|かいけい}を{済|す}ませる** · **レジ{袋|ぶくろ}は{有料|ゆうりょう}です** · **お{持|も}ち{帰|かえ}りで** · **{店内|てんない}で{食|た}べる** · **{商品|しょうひん}を{取|と}り{寄|よ}せる** · **{返品|へんぴん}・{交換|こうかん}を{受|う}け{付|つ}ける** · **{営業時間|えいぎょうじかん}が{変|か}わる** · **{水曜日|すいようび}が{定休日|ていきゅうび}だ**.',
        '**D**: **{診察券|しんさつけん}を{出|だ}す** · **{体温計|たいおんけい}で{熱|ねつ}を{測|はか}る** · **{傷|きず}ができる／{傷|きず}がつく** · **{花粉症|かふんしょう}がひどい** · **{熱中症|ねっちゅうしょう}に{気|き}をつける** · **{整理券|せいりけん}を{取|と}る** · **{身分証明書|みぶんしょうめいしょ}を{見|み}せる** · **{暗証番号|あんしょうばんごう}を{入力|にゅうりょく}する** · **{印鑑|いんかん}を{押|お}す** · **カードを{紛失|ふんしつ}する** · **{学生証|がくせいしょう}を{再発行|さいはっこう}する**.',
        '**E + F**: **{補習|ほしゅう}を{受|う}ける** · **{内容|ないよう}を{訂正|ていせい}する** · **{予定|よてい}どおり{開催|かいさい}する** · **{雨天中止|うてんちゅうし}／{雨天決行|うてんけっこう}** · **{満席|まんせき}になる** · **{空席|くうせき}がある** · **{空|あ}きが{出|で}る** · **{請求書|せいきゅうしょ}を{送|おく}る** · **{手数料|てすうりょう}がかかる** · **{再配達|さいはいたつ}を{頼|たの}む** · **とりあえず～ておく** · **さっそく{始|はじ}める** · **～のついでに** · **どうせ～なら** · **せめて～だけでも** · **なんとか{間|ま}に{合|あ}う** · **{予定|よてい}を{早|はや}める／{遅|おく}らせる** · **{資料|しりょう}を{配|くば}る**.',
      ],
    },
    {
      t: 'write',
      id: 'b39-viet-tu',
      title: 'Viết tay 10 từ hay vào đề',
      note: 'Dòng trên tô theo mẫu, dòng dưới tự viết. Bật "Che mẫu" để tự nhớ ra từ chỉ từ gợi ý nghĩa.',
      chars: ['聴解', '快速', '終電', '税込み', '領収書', '会計', '傷', '補習', '訂正', '開催'],
      goi: {
        '聴解': 'ちょうかい · nghe hiểu',
        '快速': 'かいそく · tàu nhanh',
        '終電': 'しゅうでん · chuyến tàu cuối',
        '税込み': 'ぜいこみ · đã gồm thuế',
        '領収書': 'りょうしゅうしょ · hoá đơn',
        '会計': 'かいけい · tính tiền',
        '傷': 'きず · vết thương',
        '補習': 'ほしゅう · học bù',
        '訂正': 'ていせい · đính chính',
        '開催': 'かいさい · tổ chức',
      },
    },
    {
      t: 'mcq',
      id: 'b39-tv-trac-nghiem',
      title: 'Kiểm tra từ vựng — 16 câu (dạng 文脈規定・言い換え類義・用法 của đề N3)',
      items: [
        { q: '{間|ま}もなく、{二番線|にばんせん}から{電車|でんしゃ}が（　）します。', options: ['{発車|はっしゃ}', '{出発|しゅっぱつ}', '{到着|とうちゃく}', '{開催|かいさい}'], correct: 0, why: 'TÀU chuyển bánh → **{発車|はっしゃ}する**. {出発|しゅっぱつ} dùng cho người. 〔Densha ga hassha shimasu.〕' },
        { q: '{次|つぎ}の{小|ちい}さい{駅|えき}で{降|お}りたいので、（　）に{乗|の}ります。', options: ['{各駅停車|かくえきていしゃ}', '{快速|かいそく}', '{急行|きゅうこう}', '{終電|しゅうでん}'], correct: 0, why: 'Ga nhỏ → chỉ tàu **dừng mọi ga** mới dừng. 〔Kakueki teisha ni norimasu.〕' },
        { q: 'このシャツは（　）で{三千三百円|さんぜんさんびゃくえん}です。{値札|ねふだ}の{三千円|さんぜんえん}に{税金|ぜいきん}が{入|はい}っています。', options: ['{税込|ぜいこ}み', '{税抜|ぜいぬ}き', '{手数料|てすうりょう}', 'お{釣|つ}り'], correct: 0, why: 'Giá đã cộng thuế → **{税込|ぜいこ}み**. 〔Zeikomi de sanzen sanbyaku en.〕' },
        { q: '{会社|かいしゃ}で{払|はら}ってもらうので、{店|みせ}で（　）をもらった。', options: ['{領収書|りょうしゅうしょ}', '{請求書|せいきゅうしょ}', '{整理券|せいりけん}', '{診察券|しんさつけん}'], correct: 0, why: 'Hoá đơn ghi tên để công ty thanh toán → **{領収書|りょうしゅうしょ}**. {請求書|せいきゅうしょ} là giấy đòi tiền (chưa trả). 〔Ryoushuusho o moratta.〕' },
        { q: '{金曜日|きんようび}の{夜|よる}は（　）で、{予約|よやく}が{取|と}れなかった。', options: ['{満席|まんせき}', '{満員|まんいん}', '{空席|くうせき}', '{定休日|ていきゅうび}'], correct: 0, why: 'Hết chỗ đặt ở quán → **{満席|まんせき}**. {満員|まんいん} = đầy người (tàu chật). 〔Manseki de, yoyaku ga torenakatta.〕' },
        { q: '{運動会|うんどうかい}は、（　）の{場合|ばあい}、{来週|らいしゅう}に{延期|えんき}します。', options: ['{雨天|うてん}', '{空|あ}き', '{見込|みこ}み', '{呼|よ}び{出|だ}し'], correct: 0, why: 'Nếu trời mưa → **{雨天|うてん}の{場合|ばあい}**. 〔Uten no baai, raishuu ni enki shimasu.〕' },
        { q: '{先|さき}ほどの{放送|ほうそう}に{間違|まちが}いがありました。{集合時間|しゅうごうじかん}を（　）いたします。', options: ['{訂正|ていせい}', '{返品|へんぴん}', '{紛失|ふんしつ}', '{補習|ほしゅう}'], correct: 0, why: 'Sửa lại thông báo sai → **{訂正|ていせい}**. 〔Shuugou jikan o teisei itashimasu.〕' },
        { q: '{台風|たいふう}が{近|ちか}づいているので、{出発|しゅっぱつ}を{一時間|いちじかん}（　）ことにした。', options: ['{早|はや}める', '{急|いそ}ぐ', '{乗|の}り{越|こ}す', '{配|くば}る'], correct: 0, why: 'Đổi thời điểm sớm hơn → **～を{早|はや}める**. {急|いそ}ぐ không đi với ～を{一時間|いちじかん}. 〔Shuppatsu o ichijikan hayameru.〕' },
        { q: '{寝|ね}てしまって、{降|お}りる{駅|えき}を{二|ふた}つ（　）。', options: ['{乗|の}り{越|こ}した', '{乗|の}り{換|か}えた', '{払|はら}い{戻|もど}した', '{聞|き}き{逃|のが}した'], correct: 0, why: 'Đi quá ga → **{乗|の}り{越|こ}す**. 〔Oriru eki o futatsu norikoshita.〕' },
        { q: 'この{色|いろ}は{在庫|ざいこ}がないので、{東京|とうきょう}の{店|みせ}から（　）ことになります。', options: ['{取|と}り{寄|よ}せる', '{返品|へんぴん}する', '{開催|かいさい}する', '{遅|おく}らせる'], correct: 0, why: 'Hết hàng → **đặt hàng về**: {取|と}り{寄|よ}せる. 〔Toukyou no mise kara toriyoseru.〕' },
        { q: '「{会議|かいぎ}の{前|まえ}に、とりあえず{資料|しりょう}を{読|よ}んでおいて」と{意味|いみ}が{近|ちか}いのは？', options: ['{会議|かいぎ}のあとで、{資料|しりょう}を{読|よ}む。', 'まず、{資料|しりょう}を{読|よ}んでおく。', '{資料|しりょう}は{読|よ}まなくてもいい。', '{会議|かいぎ}の{間|あいだ}に{資料|しりょう}を{読|よ}む。'], correct: 1, why: 'とりあえず = **trước mắt / trước hết**. 〔Mazu, shiryou o yonde oku.〕' },
        { q: '「この{声|こえ}、{聞|き}き{覚|おぼ}えがある」と{意味|いみ}が{近|ちか}いのは？', options: ['この{声|こえ}を{前|まえ}に{聞|き}いたことがあるような{気|き}がする。', 'この{声|こえ}は{聞|き}き{取|と}りにくい。', 'この{声|こえ}を{覚|おぼ}えなければならない。', 'この{声|こえ}は{初|はじ}めて{聞|き}いた。'], correct: 0, why: '{聞|き}き{覚|おぼ}えがある = **nghe quen, hình như đã nghe**. 〔Mae ni kiita koto ga aru you na ki ga suru.〕' },
        { q: '「なんとか{終電|しゅうでん}に{間|ま}に{合|あ}った」と{意味|いみ}が{近|ちか}いのは？', options: ['{終電|しゅうでん}に{乗|の}れなかった。', '{大変|たいへん}だったが、{終電|しゅうでん}に{乗|の}れた。', '{終電|しゅうでん}より{早|はや}い{電車|でんしゃ}に{乗|の}った。', '{終電|しゅうでん}は{遅|おく}れていた。'], correct: 1, why: 'なんとか + ～た = **khó khăn nhưng làm được** → đã kịp. 〔Taihen datta ga, noreta.〕' },
        { q: '「{配|くば}る」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{駅前|えきまえ}で{新|あたら}しい{店|みせ}のチラシを{配|くば}っていた。', '{先生|せんせい}にレポートを{一枚|いちまい}{配|くば}った。', '{友達|ともだち}に{電話|でんわ}を{配|くば}った。', '{雨|あめ}が{配|くば}ってきた。'], correct: 0, why: 'Phát cho NHIỀU người → **チラシを{配|くば}る**. Đưa cho một người là {渡|わた}す. 〔Chirashi o kubatte ita.〕' },
        { q: '「{見込|みこ}み」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{工事|こうじ}は{三月|さんがつ}に{終|お}わる{見込|みこ}みです。', '{昨日|きのう}の{見込|みこ}みはおいしかった。', '{友達|ともだち}の{見込|みこ}みに{行|い}きました。', '{見込|みこ}みを{打|う}って{話|はなし}を{聞|き}く。'], correct: 0, why: '{見込|みこ}み = **dự kiến** (tương lai): ～{見込|みこ}みです. 〔Sangatsu ni owaru mikomi desu.〕' },
        { q: '「せめて」の{使|つか}い{方|かた}が{正|ただ}しいのは？', options: ['{旅行|りょこう}に{行|い}けないなら、せめて{写真|しゃしん}だけでも{見|み}せて。', 'せめて{雨|あめ}が{降|ふ}った。', '{彼|かれ}はせめて{背|せ}が{高|たか}い。', 'せめて{全部|ぜんぶ}{食|た}べてしまった。'], correct: 0, why: 'せめて + **～だけでも** = ít nhất thì… (mong muốn tối thiểu). 〔Semete shashin dake demo misete.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 3. VĂN NÓI & MẸO NGHE ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b39-ngu-phap',
  kind: 'grammar',
  title: 'Văn nói & mẹo nghe — dạng rút gọn (～てる・～とく・～ちゃう・～なきゃ・～って・～んだ・～じゃん…), cách nói vòng, từ đảo ý, dấu hiệu câu then chốt, bẫy đổi ý, cặp âm dễ nhầm, chiến thuật làm đề 聴解 N3',
  goal: 'Nghe ra ngay dạng ĐẦY ĐỦ đằng sau mọi dạng rút gọn của văn nói (してる・やっとく・持ってく・忘れちゃった・行かなきゃ・触っちゃだめ・わかんない・～って); hiểu đúng ý thật của cách nói vòng (その日はちょっと……・考えておきます・～んじゃないかな); biết sau từ nào là câu then chốt (でも・ただ・実は・やっぱり・それより・結局・一番～のは); lọc được việc "đã xong / để sau / người khác làm / không cần" trong đề 課題理解; không bị lừa khi người nói đổi ý (あ、やっぱり・～じゃなくて); phân biệt các cặp âm dễ nhầm (来てよかった ↔ 来ればよかった, 病院 ↔ 美容院, 四日 ↔ 八日); nắm cấu trúc 5 dạng đề 聴解 N3 và cách phân 40 phút.',
  minutes: 120,
  blocks: [
    {
      t: 'p',
      text: 'Bài 39 **không có mẫu ngữ pháp mới**. Mục này dạy thứ mà sách ngữ pháp ít khi dạy nhưng đề 聴解 dùng ở **mọi câu**: người Nhật nói chuyện với nhau **không nói đủ chữ**. Bạn đã học {読|よ}んでいる, {買|か}っておく, {忘|わす}れてしまった, {行|い}かなければならない — trong bài nghe chúng thành **{読|よ}んでる, {買|か}っとく, {忘|わす}れちゃった, {行|い}かなきゃ**. Nghe không ra dạng rút gọn = mất cả câu. Mười hai phần dưới đây đi từ **dạng rút gọn** (①–⑥) sang **cách nói và cấu trúc bài nói** (⑦–⑪) rồi **chiến thuật làm đề** (⑫).',
    },
    {
      t: 'table',
      caption: 'Bảng tổng — 20 dạng rút gọn hay nghe nhất (縮約形)',
      head: ['Dạng đầy đủ (đã học)', 'Nghe thành', 'Ví dụ', 'Romaji', 'Ôn'],
      rows: [
        ['～ている', '～てる', '{何|なに}してるの？', 'Nani shiteru no?', 'sách (thể て)'],
        ['～でいる', '～でる', '{何|なに}{読|よ}んでるの？', 'Nani yonderu no?', 'sách (thể て)'],
        ['～ていない', '～てない', 'まだ{食|た}べてない。', 'Mada tabetenai.', 'ポイント 91'],
        ['～ておく', '～とく', '{買|か}っとくね。', 'Kattoku ne.', 'Bài 18'],
        ['～でおく', '～どく', '{読|よ}んどいて。', 'Yondoite.', 'Bài 18'],
        ['～ていく', '～てく', '{傘|かさ}、{持|も}ってく？', 'Kasa, motteku?', 'Bài 18'],
        ['～てしまう', '～ちゃう', '{全部|ぜんぶ}{食|た}べちゃった。', 'Zenbu tabechatta.', 'Bài 19'],
        ['～でしまう', '～じゃう', 'もう{飲|の}んじゃった。', 'Mou nonjatta.', 'Bài 19'],
        ['～なければ（ならない）', '～なきゃ・～なくちゃ', 'もう{行|い}かなきゃ。', 'Mou ikanakya.', 'ポイント 115'],
        ['～ないと（いけない）', '～ないと', '{早|はや}く{寝|ね}ないと。', 'Hayaku nenai to.', 'ポイント 115'],
        ['～ては', '～ちゃ', '{触|さわ}っちゃだめ。', 'Sawaccha dame.', 'ポイント 114'],
        ['～では', '～じゃ', 'ここで{遊|あそ}んじゃいけない。', 'Koko de asonja ikenai.', 'ポイント 114'],
        ['～と（言った）・～という', '～って', '{田中|たなか}さん、{遅|おく}れるって。', 'Tanaka-san, okureru tte.', 'Bài 30'],
        ['～のだ・～のです', '～んだ・～んです', 'そうなんだ。', 'Sou na n da.', 'ポイント 104'],
        ['～ではない', '～じゃない', '{私|わたし}のじゃない。', 'Watashi no ja nai.', 'sách'],
        ['～ではないか', '～じゃん', 'いいじゃん。', 'Ii jan.', 'mới (nhận ra)'],
        ['～らない・～れない…', '～んない', 'わかんない。', 'Wakannai.', 'mới (nhận ra)'],
        ['ところ', 'とこ', '{今|いま}、{行|い}くとこ。', 'Ima, iku toko.', 'Bài 19'],
        ['やっぱり', 'やっぱ', 'やっぱ{無理|むり}。', 'Yappa muri.', 'mới (nhận ra)'],
        ['すみません', 'すいません', 'すいません、{遅|おく}れました。', 'Suimasen, okuremashita.', 'sách'],
      ],
    },

    /* ── ① ── */
    { t: 'h', text: '① ～てる・～とく・～てく — ている・ておく・ていく nói nhanh' },
    {
      t: 'table',
      caption: 'Ba dạng rút gọn với て — và họ hàng của chúng',
      head: ['Đầy đủ', 'Rút gọn', 'Thể た', 'Thể て', 'Phủ định'],
      rows: [
        ['{見|み}ている', '{見|み}てる', '{見|み}てた', '{見|み}てて', '{見|み}てない'],
        ['{読|よ}んでいる', '{読|よ}んでる', '{読|よ}んでた', '{読|よ}んでて', '{読|よ}んでない'],
        ['{買|か}っておく', '{買|か}っとく', '{買|か}っといた', '{買|か}っといて', '{買|か}っとかない'],
        ['{読|よ}んでおく', '{読|よ}んどく', '{読|よ}んどいた', '{読|よ}んどいて', '{読|よ}んどかない'],
        ['{持|も}っていく', '{持|も}ってく', '{持|も}ってった', '{持|も}ってって', '{持|も}ってかない'],
      ],
    },
    {
      t: 'p',
      text: '**Luật nghe**: **い** sau て **rơi mất** (て**い**る → てる, て**い**く → てく); **ておく** dính lại thành **とく** (て + お → と), **でおく** thành **どく**. Chỉ cần nghe ra **"…teru / …toku / …teku"** là biết dạng đầy đủ. Nghĩa **không đổi**: てる = đang / trạng thái · とく = làm sẵn · てく = (làm rồi) đi.',
    },
    {
      t: 'examples',
      items: [
        E('{今|いま}、{何|なに}してる？', 'Ima, nani shiteru?', 'Giờ cậu đang làm gì? (= している)'),
        E('{鍵|かぎ}、まだ{返|かえ}してないよ。', 'Kagi, mada kaeshite nai yo.', 'Chìa khoá tớ vẫn chưa trả đâu. (= 返していない — CHƯA làm)'),
        E('{飲|の}み{物|もの}は{私|わたし}が{買|か}っとくね。', 'Nomimono wa watashi ga kattoku ne.', 'Đồ uống để tớ mua sẵn nhé. (= 買っておく)'),
        E('{明日|あした}までに、この{資料|しりょう}{読|よ}んどいて。', 'Ashita made ni, kono shiryou yondoite.', 'Đọc trước tài liệu này giúp tôi trước ngày mai nhé. (= 読んでおいて — CHỈ THỊ)'),
        E('{雨|あめ}だから、{傘|かさ}{持|も}ってったほうがいいよ。', 'Ame da kara, kasa mottetta hou ga ii yo.', 'Trời mưa đấy, nên mang ô theo. (= 持っていった)'),
        E('{会議室|かいぎしつ}の{予約|よやく}？ もうしといたよ。', 'Kaigishitsu no yoyaku? Mou shitoita yo.', 'Đặt phòng họp á? Tớ làm sẵn rồi. (= しておいた — ĐÃ XONG ⇒ loại khỏi "việc phải làm")'),
      ],
    },
    {
      t: 'note',
      title: '⚠ Ba cặp dễ nhầm khi nghe ①',
      items: [
        '**{持|も}ってく** (mang ĐI) ↔ **{持|も}ってくる** (mang ĐẾN) ↔ **{持|も}っとく** (cầm / giữ sẵn): chỉ khác **một âm cuối**. Trong đề 課題理解 "mang gì đến" thường là đáp án — nghe kỹ **…teku／…tekuru／…toku**.',
        '**もうしといた** (đã làm sẵn) = **việc ĐÃ XONG** — đáp án nhiễu kinh điển của câu "このあとまず何をしますか".',
        '**{見|み}てて** = {見|み}ていて (thể て của てる: "nhìn giúp / trông giúp") — ちょっと{荷物|にもつ}{見|み}てて = trông đồ giúp tớ một lát. Đừng nhầm với {見|み}て (hãy nhìn).',
      ],
    },
    { t: 'rule', formula: 'ている → てる · ておく → とく · でおく → どく · ていく → てく', vi: 'Âm い sau て rơi mất; て＋お dính thành と. Nghĩa không đổi.' },

    /* ── ② ── */
    { t: 'h', text: '② ～ちゃう／～じゃう・～ちゃった — てしまう nói nhanh (ôn Bài 19)' },
    {
      t: 'table',
      caption: 'Họ ～ちゃう',
      head: ['Đầy đủ', 'Rút gọn', 'Nghĩa trong bài nghe', 'Romaji'],
      rows: [
        ['{忘|わす}れてしまった', '{忘|わす}れちゃった', 'lỡ quên mất (ĐÃ xảy ra, thường tiếc)', 'wasurechatta'],
        ['{飲|の}んでしまった', '{飲|の}んじゃった', 'lỡ uống mất / uống hết rồi', 'nonjatta'],
        ['{行|い}ってしまう', '{行|い}っちゃう', 'sẽ đi mất (sắp xảy ra)', 'icchau'],
        ['{食|た}べてしまおう', '{食|た}べちゃおう', 'ăn hết luôn cho xong đi', 'tabechaou'],
        ['{遅|おく}れてしまって', '{遅|おく}れちゃって', 'vì lỡ muộn nên… (thể て — xin lỗi, giải thích)', 'okurechatte'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('ごめん、{宿題|しゅくだい}{持|も}ってくるの{忘|わす}れちゃった。', 'Gomen, shukudai motte kuru no wasurechatta.', 'Xin lỗi, tớ lỡ quên mang bài tập. (ĐÃ quên)'),
        E('ケーキ、もう{全部|ぜんぶ}{食|た}べちゃったの？', 'Keeki, mou zenbu tabechatta no?', 'Cậu ăn hết bánh rồi à?'),
        E('{早|はや}く{行|い}かないと、バスが{行|い}っちゃうよ。', 'Hayaku ikanai to, basu ga icchau yo.', 'Không đi nhanh là xe buýt chạy mất đấy. (SẼ xảy ra)'),
        E('{面倒|めんどう}だから、{今日|きょう}{全部|ぜんぶ}やっちゃおう。', 'Mendou da kara, kyou zenbu yacchaou.', 'Phiền lắm, hôm nay làm hết luôn cho xong.'),
        E('{電車|でんしゃ}が{止|と}まっちゃって、{三十分|さんじゅっぷん}{遅|おく}れます。', 'Densha ga tomacchatte, sanjuppun okuremasu.', 'Tàu bị dừng mất nên tôi sẽ muộn 30 phút.'),
      ],
    },
    {
      t: 'note',
      title: 'Nghe ～ちゃう trong đề',
      items: [
        '**～ちゃった** (quá khứ) = việc **đã rồi**, không quay lại được → câu đáp tự nhiên ở 即時応答 là **đồng cảm / giúp** (えっ、{大丈夫|だいじょうぶ}？・{私|わたし}の{貸|か}そうか？), KHÔNG phải ~~よかったね~~.',
        '**～ちゃう** (không た) = **sắp** xảy ra → thường là **cảnh báo** (バスが{行|い}っちゃうよ — đi nhanh lên).',
        'Âm dễ lẫn: **{行|い}っちゃう** "icchau" (đi mất) ↔ **{言|い}っちゃう** "icchau" (lỡ nói ra) — CÙNG âm, đoán bằng ngữ cảnh.',
      ],
    },
    { t: 'rule', formula: 'てしまう → ちゃう · でしまう → じゃう · てしまった → ちゃった', vi: 'ちゃった = đã lỡ (tiếc) · ちゃう = sắp mất (cảnh báo).' },

    /* ── ③ ── */
    { t: 'h', text: '③ ～なきゃ／～なくちゃ／～ないと · ～ちゃだめ · ～なくていい — phải / không được / không cần' },
    {
      t: 'table',
      caption: 'Ba nhóm câu quyết định "việc phải làm" trong đề 課題理解',
      head: ['Nghĩa', 'Đầy đủ (đã học)', 'Văn nói nghe thành', 'Romaji'],
      rows: [
        ['PHẢI làm', '{行|い}かなければならない', '{行|い}かなきゃ（いけない）・{行|い}かなくちゃ・{行|い}かないと', 'ikanakya · ikanakucha · ikanai to'],
        ['PHẢI làm (quá khứ)', '{出|だ}さなければならなかった', '{出|だ}さなきゃいけなかった・{出|だ}さなくちゃいけなかった', 'dasanakya ikenakatta'],
        ['KHÔNG ĐƯỢC làm', '{触|さわ}ってはいけない', '{触|さわ}っちゃだめ・{触|さわ}っちゃいけない', 'sawaccha dame · sawaccha ikenai'],
        ['KHÔNG ĐƯỢC làm (で)', '{飲|の}んではいけない', '{飲|の}んじゃだめ', 'nonja dame'],
        ['KHÔNG CẦN làm', '{書|か}かなくてもいい', '{書|か}かなくていい・{書|か}かなくても{大丈夫|だいじょうぶ}・{書|か}かなくて{平気|へいき}', 'kakanakute ii · kakanakute mo daijoubu'],
        ['LÀM CŨNG ĐƯỢC', '{使|つか}ってもいい', '{使|つか}っていい・{使|つか}っても{大丈夫|だいじょうぶ}', 'tsukatte ii'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('あ、もう{九時|くじ}だ。{帰|かえ}らなきゃ。', 'A, mou kuji da. Kaeranakya.', 'Ôi, 9 giờ rồi. Phải về thôi.'),
        E('{明日|あした}までにレポート{出|だ}さなくちゃ。', 'Ashita made ni repooto dasanakucha.', 'Phải nộp báo cáo trước ngày mai.'),
        E('{熱|ねつ}があるなら、{早|はや}く{寝|ね}ないと。', 'Netsu ga aru nara, hayaku nenai to.', 'Có sốt thì phải ngủ sớm đi chứ. (～ないと bỏ lửng = PHẢI)'),
        E('そのボタン、{押|お}しちゃだめ！', 'Sono botan, oshicha dame!', 'Đừng bấm cái nút đó!'),
        E('{名前|なまえ}は{書|か}かなくていいよ。{番号|ばんごう}だけで。', 'Namae wa kakanakute ii yo. Bangou dake de.', 'Không cần viết tên đâu. Chỉ số là được.'),
      ],
    },
    {
      t: 'note',
      title: '⚠ Lỗi nghe hay gặp ③',
      items: [
        '**～ないと** đứng cuối câu (bỏ lửng) = **"phải…"** (～ないといけない rút gọn), **không phải** "nếu không…". {早|はや}く{寝|ね}ないと。 = Phải ngủ sớm. Chỉ khi có vế sau mới là "nếu không…": {早|はや}く{寝|ね}ないと、{明日|あした}{起|お}きられないよ.',
        '**～なきゃ** (ikanaKYA) nghe giống **～なか**…? Không: chú ý âm **kya** cuối. Đứng sau thể ない của động từ.',
        '**～なくていい** (không cần) là câu **LOẠI đáp án** trong đề 課題理解 — nghe thấy là gạch ngay.',
        '**～ちゃだめ** "-cha dame": **cha + dame** = cấm. Đừng nhầm với **～ちゃった** (đã lỡ).',
      ],
    },
    { t: 'rule', formula: 'なければ → なきゃ／なくちゃ／ないと · ては → ちゃ · では → じゃ', vi: 'なきゃ = phải · ちゃだめ = cấm · なくていい = không cần.' },

    /* ── ④ ── */
    { t: 'h', text: '④ ～って — bốn nghĩa trong bài nghe (ôn Bài 30)' },
    {
      t: 'table',
      caption: '～って thay cho gì?',
      head: ['Thay cho', 'Ví dụ', 'Romaji', 'Nghĩa'],
      rows: [
        ['① と{言|い}った・と{言|い}っていた (kể lời)', '{店長|てんちょう}、{今日|きょう}{遅|おく}れるって。', 'Tenchou, kyou okureru tte.', 'Quản lý bảo hôm nay đến muộn.'],
        ['② という (gọi là)', '「ひまわり」って{店|みせ}、{知|し}ってる？', '"Himawari" tte mise, shitteru?', 'Cậu biết quán tên "Himawari" không?'],
        ['③ は／というのは (chủ đề, hỏi nghĩa)', '「{遅延証明書|ちえんしょうめいしょ}」って{何|なん}ですか。', '"Chien shoumeisho" tte nan desu ka.', '"Giấy chứng nhận tàu trễ" là gì ạ?'],
        ['④ んだって・だって (nghe nói)', '{明日|あした}、{休講|きゅうこう}なんだって。', 'Ashita, kyuukou na n datte.', 'Nghe nói mai được nghỉ học.'],
        ['⑤ って？ (hỏi lại, ngạc nhiên)', 'え、{中止|ちゅうし}だって？', 'E, chuushi datte?', 'Hả, bảo là huỷ á?'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{佐藤先生|さとうせんせい}、{明日|あした}のゼミは{三時|さんじ}からだって。', 'Satou-sensei, ashita no zemi wa sanji kara datte.', 'Cô Sato bảo buổi seminar mai bắt đầu từ 3 giờ.'),
        E('{聴解|ちょうかい}って、{思|おも}ったより{難|むずか}しいね。', 'Choukai tte, omotta yori muzukashii ne.', 'Phần nghe hiểu khó hơn tớ tưởng nhỉ.'),
        E('{駅前|えきまえ}に「{青空|あおぞら}」ってカフェができたんだって。', 'Ekimae ni "Aozora" tte kafe ga dekita n datte.', 'Nghe nói trước ga mới mở quán cà phê tên "Aozora".'),
        E('{何時|なんじ}に{集合|しゅうごう}って{言|い}ってた？', 'Nanji ni shuugou tte itteta?', 'Họ bảo tập trung lúc mấy giờ?'),
        E('{本田先生|ほんだせんせい}が、レポートは{来週|らいしゅう}でいいって。', 'Honda-sensei ga, repooto wa raishuu de ii tte.', 'Thầy Honda bảo báo cáo nộp tuần sau cũng được. (⇒ việc để SAU)'),
      ],
    },
    {
      t: 'note',
      title: 'Nghe ～って trong đề',
      items: [
        '**～って** ở cuối câu thường là **lời của NGƯỜI THỨ BA** — đề ポイント理解 hay hỏi "Thầy giáo đã nói gì?" mà đáp án nằm ngay trong câu ～って.',
        '**～でいいって** = "(người ta) bảo … là được" → thường là **thông tin làm thay đổi kế hoạch** (để sau, không cần).',
        'Phân biệt **って** (kể lời) với **だって** đầu câu = "vì… mà" (biện bạch): だって、{時間|じかん}がなかったんだもん — "Vì không có thời gian mà".',
      ],
    },
    { t: 'rule', formula: '～って ＝ と言った／という／は／んだって', vi: 'Cuối câu = kể lời người khác; giữa câu = "tên là / thì là".' },

    /* ── ⑤ ── */
    { t: 'h', text: '⑤ Đuôi câu văn nói — ～んだ・～の・～んじゃない？・～じゃん・～っけ・～かな・～よね・～もん' },
    {
      t: 'table',
      caption: 'Đuôi câu cho biết THÁI ĐỘ người nói — đề 概要理解・即時応答 hay dựa vào đây',
      head: ['Đuôi', 'Thái độ / chức năng', 'Ví dụ', 'Romaji', 'Nghĩa'],
      rows: [
        ['～んだ／～の', 'giải thích, kể lý do; ～の？ = hỏi (thân mật)', '{熱|ねつ}があるんだ。／どうしたの？', 'Netsu ga aru n da. / Dou shita no?', 'Tớ bị sốt. / Sao thế?'],
        ['～んじゃない？ (lên giọng)', 'ý kiến nhẹ: "chắc là… / hay là…"', 'バスのほうが{早|はや}いんじゃない？', 'Basu no hou ga hayai n ja nai?', 'Chắc đi buýt nhanh hơn đấy?'],
        ['～んじゃない！ (xuống giọng)', 'CẤM (người trên → dưới)', 'そんなところで{寝|ね}るんじゃない！', 'Sonna tokoro de neru n ja nai!', 'Không được ngủ ở chỗ đó!'],
        ['～じゃん', '"chẳng phải… đó sao", khẳng định suồng sã', 'いいじゃん、{行|い}こうよ。', 'Ii jan, ikou yo.', 'Được mà, đi thôi.'],
        ['～っけ', 'hỏi lại điều mình QUÊN', '{試験|しけん}、{何曜日|なんようび}だっけ？', 'Shiken, nan\'youbi dakke?', 'Thi thứ mấy nhỉ?'],
        ['～かな', 'tự hỏi, ý kiến không chắc', '{間|ま}に{合|あ}うかな。', 'Ma ni au kana.', 'Không biết có kịp không nhỉ.'],
        ['～よね', 'xác nhận điều cả hai biết', '{明日|あした}、{休|やす}みだよね。', 'Ashita, yasumi da yo ne.', 'Mai nghỉ đúng không?'],
        ['～もん', 'biện bạch, nũng nịu "vì… mà"', 'だって、{眠|ねむ}かったんだもん。', 'Datte, nemukatta n da mon.', 'Vì buồn ngủ mà.'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{今日|きょう}は{来|こ}られないって。{熱|ねつ}があるんだって。', 'Kyou wa korarenai tte. Netsu ga aru n datte.', 'Bạn ấy bảo hôm nay không đến được. Nghe nói bị sốt.'),
        E('それ、{店員|てんいん}さんに{聞|き}いたほうがいいんじゃない？', 'Sore, ten\'in-san ni kiita hou ga ii n ja nai?', 'Cái đó hỏi nhân viên cửa hàng thì hơn đấy? (gợi ý nhẹ)'),
        E('{言|い}ったじゃん、{三時|さんじ}からって。', 'Itta jan, sanji kara tte.', 'Tớ nói rồi còn gì, từ 3 giờ mà.'),
        E('あれ、{集合場所|しゅうごうばしょ}、どこだっけ？', 'Are, shuugou basho, doko dakke?', 'Ủa, chỗ tập trung là ở đâu nhỉ?'),
        E('この{天気|てんき}じゃ、{試合|しあい}は{無理|むり}かな。', 'Kono tenki ja, shiai wa muri kana.', 'Trời thế này chắc trận đấu không được nhỉ.'),
      ],
    },
    {
      t: 'note',
      title: '⚠ ～んじゃない — hai ngữ điệu, hai nghĩa ngược nhau',
      items: [
        '**～んじゃない？↗** (lên giọng, thường có **か**: ～んじゃないかな) = **"chắc là / có lẽ"** → là **đồng ý / đề xuất**: いいんじゃない？ = được đấy chứ.',
        '**～んじゃない！↘** (xuống giọng, mạnh) = **"không được"** → cấm: {走|はし}るんじゃない！ = Không được chạy!',
        'Trong đề, **いいんじゃない？** của người nghe = **đồng ý**. **～んじゃないかな** của người nói = **ý kiến của họ** (đề 概要理解 hỏi "người nói nghĩ gì" — đây là chỗ cần nghe).',
      ],
    },

    /* ── ⑥ ── */
    { t: 'h', text: '⑥ Âm biến trong văn nói nhanh — ら行 → ん, ところ → とこ, やっぱ, すいません' },
    {
      t: 'table',
      caption: 'Âm biến — nhận ra là đủ, KHÔNG cần tự nói (nhất là với người trên)',
      head: ['Đầy đủ', 'Nghe thành', 'Luật', 'Romaji'],
      rows: [
        ['わからない', 'わかんない', 'ら・り・る・れ + な → ん + な', 'wakannai'],
        ['つまらない', 'つまんない', '〃', 'tsumannai'],
        ['やらなきゃ', 'やんなきゃ', '〃', 'yannakya'],
        ['{来|く}るの？', '{来|く}んの？', 'る + の → ん + の', 'kun no?'],
        ['{帰|かえ}るところ', '{帰|かえ}るとこ', 'ところ → とこ', 'kaeru toko'],
        ['やっぱり', 'やっぱ', 'bỏ り', 'yappa'],
        ['すみません', 'すいません', 'み → い', 'suimasen'],
        ['{本当|ほんとう}に', 'ほんとに', 'bỏ trường âm う', 'honto ni'],
        ['それは', 'そりゃ', 'れ + は → りゃ', 'sorya'],
        ['というか', 'ってか', 'という → って', 'tteka'],
        ['{私|わたし}', 'あたし (nữ)', 'bỏ わ', 'atashi'],
        ['すごい', 'すっごい／すげえ (nam, rất suồng sã)', 'nhấn mạnh / ai → ee', 'suggoi / sugee'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('この{問題|もんだい}、{全然|ぜんぜん}わかんない。', 'Kono mondai, zenzen wakannai.', 'Bài này tớ chẳng hiểu gì cả. (= わからない)'),
        E('{今|いま}、{帰|かえ}るとこなんだけど、{何|なに}か{買|か}ってく？', 'Ima, kaeru toko na n da kedo, nani ka katteku?', 'Tớ đang định về đây, có cần mua gì mang về không? (とこ = ところ, てく = ていく)'),
        E('やっぱ、{今日|きょう}はやめとく。', 'Yappa, kyou wa yametoku.', 'Thôi, hôm nay tớ không đi đâu. (やっぱ = đổi ý, やめとく = やめておく)'),
        E('そりゃ{大変|たいへん}だったね。', 'Sorya taihen datta ne.', 'Thế thì vất vả quá nhỉ. (= それは)'),
        E('ほんとに{助|たす}かった。ありがとう。', 'Honto ni tasukatta. Arigatou.', 'Thật sự đỡ quá. Cảm ơn nhé.'),
      ],
    },

    /* ── ⑦ ── */
    { t: 'h', text: '⑦ Cách nói VÒNG — người Nhật ít khi nói thẳng "không"' },
    {
      t: 'table',
      caption: 'Nghe câu này ⇒ ý thật là…',
      head: ['Câu nghe được', 'Romaji', 'Ý thật', 'Đề hay hỏi'],
      rows: [
        ['{土曜日|どようび}はちょっと……。', 'Doyoubi wa chotto…….', 'TỪ CHỐI (thứ Bảy không được)', '即時応答・ポイント理解'],
        ['それはちょっと{難|むずか}しいかな。', 'Sore wa chotto muzukashii kana.', 'gần như KHÔNG (khó → không làm)', 'ポイント理解'],
        ['せっかくですが、{今回|こんかい}は……。', 'Sekkaku desu ga, konkai wa…….', 'TỪ CHỐI lịch sự lời mời', '発話表現'],
        ['{考|かんが}えておきます。', 'Kangaete okimasu.', 'thường là KHÔNG (từ chối nhẹ)', 'ポイント理解'],
        ['{行|い}けたら{行|い}くね。', 'Iketara iku ne.', 'thường KHÔNG đi', '即時応答'],
        ['また{今度|こんど}ね。', 'Mata kondo ne.', 'lần này KHÔNG', '即時応答'],
        ['～んじゃないかな。', '~n ja nai kana.', 'Ý KIẾN của người nói (nhẹ)', '概要理解'],
        ['{悪|わる}くはないけど……。', 'Waruku wa nai kedo…….', 'KHÔNG thích lắm (khen nửa vời)', '概要理解'],
        ['まあ、いいけど。', 'Maa, ii kedo.', 'đồng ý MIỄN CƯỠNG', '即時応答'],
        ['いいですね、ぜひ。', 'Ii desu ne, zehi.', 'ĐỒNG Ý thật', '即時応答'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('A：{金曜日|きんようび}、{飲|の}みに{行|い}かない？　B：{金曜日|きんようび}はちょっと……。{土曜日|どようび}なら。', 'A: Kin\'youbi, nomi ni ikanai? B: Kin\'youbi wa chotto……. Doyoubi nara.', 'A: Thứ Sáu đi nhậu không? B: Thứ Sáu thì hơi… Thứ Bảy thì được. (từ chối thứ Sáu, đưa phương án thứ Bảy)'),
        E('その{色|いろ}、{悪|わる}くはないけど、もう{少|すこ}し{明|あか}るいほうがいいんじゃない？', 'Sono iro, waruku wa nai kedo, mou sukoshi akarui hou ga ii n ja nai?', 'Màu đó không tệ, nhưng sáng hơn chút có lẽ hay hơn? (ý thật: KHÔNG thích màu đó lắm)'),
        E('せっかく{誘|さそ}っていただいたんですが、その{日|ひ}は{用事|ようじ}がありまして……。', 'Sekkaku sasotte itadaita n desu ga, sono hi wa youji ga arimashite…….', 'Được anh mời thật quý, nhưng hôm đó tôi có việc… (từ chối lịch sự)'),
        E('そうですね……{少|すこ}し{考|かんが}えておきます。', 'Sou desu ne…… sukoshi kangaete okimasu.', 'Vâng… để tôi suy nghĩ thêm. (thường = không mua / không nhận)'),
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nghe cách nói vòng',
      items: [
        '**ちょっと + bỏ lửng (……)** = **từ chối**. Không cần nghe vế sau — người Nhật không nói tiếp.',
        'Sau lời từ chối vòng thường có **phương án khác**: ～なら（いい）・～はどう？ → đề ポイント理解 hỏi "cuối cùng quyết định thế nào" thì đáp án là **phương án khác** đó.',
        '**～けど** cuối câu (bỏ lửng) = mềm hoá, thường mang ý **"nhưng mà…"** — chú ý điều đi TRƯỚC けど: {悪|わる}くはないけど = không tệ (nhưng không hay).',
      ],
    },

    /* ── ⑧ ── */
    { t: 'h', text: '⑧ Từ ĐẢO Ý & dấu hiệu CÂU THEN CHỐT — sau từ này là đáp án' },
    {
      t: 'table',
      caption: 'Nghe thấy từ này ⇒ câu ngay SAU nó quan trọng hơn câu trước',
      head: ['Từ', 'Romaji', 'Chức năng', 'Ví dụ'],
      rows: [
        ['でも・だけど・けど', 'demo · dakedo · kedo', 'đảo ý: điều sau mới là thật', '{安|やす}いんだけど、{遠|とお}いんだよね。'],
        ['ただ', 'tada', 'thêm ĐIỀU KIỆN / hạn chế', '{行|い}けます。ただ、{七時|しちじ}には{帰|かえ}ります。'],
        ['{実|じつ}は', 'jitsu wa', 'nói ra LÝ DO / sự thật', '{実|じつ}は、{財布|さいふ}をなくしたんです。'],
        ['やっぱり（やっぱ）', 'yappari', 'quay về ý cũ / đổi ý', 'やっぱり、{電車|でんしゃ}で{行|い}きます。'],
        ['それより', 'sore yori', 'việc QUAN TRỌNG hơn', 'それより、{先|さき}にメールを{送|おく}って。'],
        ['というか（ってか）', 'to iu ka', 'sửa lại, nói chính xác hơn', '{忙|いそが}しいというか、{人|ひと}が{足|た}りないんだ。'],
        ['{結局|けっきょく}', 'kekkyoku', 'KẾT QUẢ cuối cùng', '{結局|けっきょく}、{行|い}かなかった。'],
        ['とにかく', 'tonikaku', 'dù sao thì, việc CHÍNH là', 'とにかく、{今日中|きょうじゅう}に{出|だ}して。'],
        ['{一番|いちばん}～のは', 'ichiban ~ no wa', 'điều NHẤT (đáp án 概要理解)', '{一番|いちばん}{大切|たいせつ}なのは、{続|つづ}けることです。'],
        ['つまり・{要|よう}するに', 'tsumari · you suru ni', 'TÓM LẠI (Bài 31)', 'つまり、{今週|こんしゅう}は{無理|むり}ってこと？'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{料理|りょうり}はおいしかったよ。でも、{店員|てんいん}さんの{態度|たいど}がちょっとね……。', 'Ryouri wa oishikatta yo. Demo, ten\'in-san no taido ga chotto ne…….', 'Đồ ăn thì ngon. Nhưng thái độ nhân viên thì hơi… (ý chính: KHÔNG hài lòng về thái độ)'),
        E('{参加|さんか}は{自由|じゆう}です。ただ、{参加|さんか}する{人|ひと}は{前|まえ}の{日|ひ}までに{連絡|れんらく}してください。', 'Sanka wa jiyuu desu. Tada, sanka suru hito wa mae no hi made ni renraku shite kudasai.', 'Tham gia tuỳ ý. Có điều, ai tham gia hãy báo trước một ngày. (việc PHẢI làm nằm sau ただ)'),
        E('{遅|おく}れた{理由|りゆう}？ {電車|でんしゃ}も{混|こ}んでたけど、{実|じつ}は{寝坊|ねぼう}したんだ。', 'Okureta riyuu? Densha mo kondeta kedo, jitsu wa nebou shita n da.', 'Lý do muộn á? Tàu cũng đông, nhưng thật ra là tớ ngủ quên. (lý do THẬT sau 実は)'),
        E('{会議|かいぎ}の{準備|じゅんび}もあるけど、それより{先|さき}に{田村|たむら}さんに{電話|でんわ}して。', 'Kaigi no junbi mo aru kedo, sore yori saki ni Tamura-san ni denwa shite.', 'Còn chuẩn bị họp nữa, nhưng trước hết gọi điện cho anh Tamura đã. (việc làm TRƯỚC sau それより)'),
      ],
    },
    { t: 'rule', formula: 'でも／ただ／実は／それより／やっぱり ＋【câu then chốt】', vi: 'Câu trước các từ này thường là bẫy; câu sau là đáp án.' },

    /* ── ⑨ ── */
    { t: 'h', text: '⑨ Dấu hiệu "làm gì TRƯỚC" — bộ lọc bốn ô cho đề 課題理解' },
    {
      t: 'table',
      caption: 'Nghe xong mỗi việc, xếp nó vào một trong bốn ô — ô ① là đáp án',
      head: ['Ô', 'Dấu hiệu nghe được', 'Romaji', 'Xử lý'],
      rows: [
        ['① LÀM NGAY', 'まず・{先|さき}に・その{前|まえ}に・とりあえず・すぐ・{今|いま}すぐ・それより{先|さき}に', 'mazu · saki ni · sono mae ni · toriaezu · sugu', '✅ khoanh tròn — thường là đáp án'],
        ['② ĐÃ XONG', 'もう～てある・もう～ておいた（～といた）・～は{済|す}んだ・～はやった', 'mou ~te aru · mou ~toita · ~wa sunda', '✕ gạch đi'],
        ['③ ĐỂ SAU', '～てからでいい・～はあとで・～は{午後|ごご}でいい・{来週|らいしゅう}までに・ついでに', '~te kara de ii · ~wa ato de · ~made ni', '→ ghi mũi tên, không phải đáp án "まず"'],
        ['④ KHÔNG CẦN / NGƯỜI KHÁC', '～なくていい・～はいい・～は{私|わたし}がやる・～は{鈴木|すずき}さんに{頼|たの}んだ', '~nakute ii · ~wa ii · ~wa watashi ga yaru', '✕ gạch đi'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{名札|なふだ}はもう{作|つく}ってあるから、{大丈夫|だいじょうぶ}。', 'Nafuda wa mou tsukutte aru kara, daijoubu.', 'Bảng tên làm sẵn rồi nên không sao. (② đã xong)'),
        E('{飲|の}み{物|もの}は{会場|かいじょう}に{着|つ}いてからでいいよ。', 'Nomimono wa kaijou ni tsuite kara de ii yo.', 'Đồ uống đến hội trường rồi mua cũng được. (③ để sau)'),
        E('{受付|うけつけ}は{私|わたし}がやるから。', 'Uketsuke wa watashi ga yaru kara.', 'Quầy đón khách để tôi lo. (④ người khác làm)'),
        E('その{前|まえ}に、{椅子|いす}を{並|なら}べといてくれる？', 'Sono mae ni, isu o narabetoite kureru?', 'Trước đó, xếp ghế sẵn giúp chị được không? (① làm ngay — ～といて = ておいて)'),
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú bằng ký hiệu (khi nghe đề 課題理解)',
      items: [
        'Đề in sẵn 4 lựa chọn (chữ hoặc tranh). Trong lúc nghe, đánh dấu **ngay cạnh** từng lựa chọn: **○** làm ngay · **✕** đã xong / không cần / người khác · **→** để sau · **?** chưa rõ.',
        'Nghe đến **cuối** rồi mới chọn — câu chốt hay ở cuối: じゃあ、まず～ます (người được hướng dẫn nói lại).',
        'Câu hỏi được đọc **hai lần** (trước và sau đoạn hội thoại). Lần đầu: nghe kỹ **AI** làm (男の人？女の人？) và **TRƯỚC / SAU** (まず？このあと？).',
      ],
    },

    /* ── ⑩ ── */
    { t: 'h', text: '⑩ Bẫy ĐỔI Ý giữa chừng — câu SAU cùng mới tính' },
    {
      t: 'table',
      caption: 'Dấu hiệu đổi ý',
      head: ['Dấu hiệu', 'Romaji', 'Ví dụ', 'Kết luận'],
      rows: [
        ['あ、やっぱり～', 'a, yappari', '{赤|あか}にします。あ、やっぱり{青|あお}で。', '→ **xanh**'],
        ['いや、{待|ま}って', 'iya, matte', '{三時|さんじ}に……いや、{待|ま}って、{四時|よじ}だ。', '→ **4 giờ**'],
        ['～と{思|おも}ったんだけど', '~to omotta n da kedo', 'バスで{行|い}こうと{思|おも}ったんだけど、{歩|ある}くことにした。', '→ **đi bộ**'],
        ['～つもりだったけど', '~tsumori datta kedo', '{今日|きょう}{出|だ}すつもりだったけど、{明日|あした}にする。', '→ **ngày mai**'],
        ['じゃあ、～にしよう', 'jaa, ~ni shiyou', 'それなら、じゃあ{日曜|にちよう}にしよう。', '→ **Chủ nhật**'],
        ['～じゃなくて～', '~ja nakute ~', '{二階|にかい}じゃなくて、{三階|さんがい}です。', '→ **tầng 3**'],
        ['あ、そうだ', 'a, sou da', 'あ、そうだ、{今日|きょう}は{定休日|ていきゅうび}だった。', '→ kế hoạch **đổi** vì điều vừa nhớ ra'],
        ['{訂正|ていせい}いたします', 'teisei itashimasu', '{先|さき}ほどの{三番線|さんばんせん}は、{五番線|ごばんせん}の{誤|あやま}りです。', '→ **số 5**'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{会議|かいぎ}は{二時|にじ}から……あ、ごめん、{二時半|にじはん}からだった。', 'Kaigi wa niji kara …… a, gomen, nijihan kara datta.', 'Họp từ 2 giờ… à xin lỗi, từ 2 rưỡi mới đúng. (→ 2:30)'),
        E('コーヒーお{願|ねが}いします。あ、やっぱり{紅茶|こうちゃ}にしてください。', 'Koohii onegai shimasu. A, yappari koucha ni shite kudasai.', 'Cho tôi cà phê. À thôi, cho tôi trà đen. (→ trà)'),
        E('{明日|あした}{行|い}こうと{思|おも}ってたんだけど、{雨|あめ}みたいだから、{来週|らいしゅう}にしようかな。', 'Ashita ikou to omotteta n da kedo, ame mitai da kara, raishuu ni shiyou ka na.', 'Tớ định mai đi, nhưng hình như mưa nên chắc để tuần sau. (→ tuần sau)'),
        E('{集合|しゅうごう}は{駅|えき}の{東口|ひがしぐち}じゃなくて、{西口|にしぐち}ですよ。', 'Shuugou wa eki no higashiguchi ja nakute, nishiguchi desu yo.', 'Tập trung không phải cửa Đông, mà là cửa Tây nhé. (→ cửa Tây)'),
      ],
    },
    { t: 'rule', formula: 'A……あ、やっぱり／いや／じゃなくて ＋ B ⇒ đáp án = B', vi: 'Điều nói sau cùng, sau dấu hiệu đổi ý, mới là quyết định.' },

    /* ── ⑪ ── */
    { t: 'h', text: '⑪ Cặp nghe giống mà khác — một âm đổi cả nghĩa' },
    {
      t: 'table',
      caption: '12 cặp người Việt hay nghe nhầm',
      head: ['A', 'Romaji A', 'B', 'Romaji B', 'Phân biệt'],
      rows: [
        ['{来|き}てよかった', 'kite yokatta', '{来|く}ればよかった', 'kureba yokatta', 'MAY MÀ đã đến (có đến) ↔ GIÁ MÀ đã đến (không đến) — Bài 35'],
        ['{行|い}ってない', 'ittenai', '{行|い}かない', 'ikanai', 'CHƯA đi (có thể sẽ đi) ↔ KHÔNG đi'],
        ['{行|い}けない', 'ikenai', '{行|い}かない', 'ikanai', 'không đi ĐƯỢC (muốn mà không thể) ↔ không đi (không muốn)'],
        ['{切|き}って', 'kitte', '{来|き}て・{着|き}て', 'kite', 'âm ngắt っ: cắt ↔ đến / mặc'],
        ['{病院|びょういん}', 'byouin', '{美容院|びよういん}', 'biyouin', 'bệnh viện ↔ tiệm làm tóc (byo ↔ bi-yo)'],
        ['おばさん', 'obasan', 'おばあさん', 'obaasan', 'cô, dì ↔ bà (trường âm)'],
        ['{四日|よっか}', 'yokka', '{八日|ようか}', 'youka', 'mùng 4 ↔ mùng 8'],
        ['{四時|よじ}', 'yoji', '{七時|しちじ}・{一時|いちじ}', 'shichiji · ichiji', 'しち ↔ いち dễ lẫn ⇒ loa thường đọc なな'],
        ['{十四|じゅうよん}', 'juuyon', '{四十|よんじゅう}', 'yonjuu', '14 ↔ 40 — nghe thứ tự'],
        ['{着|つ}いた', 'tsuita', '{付|つ}いた・ついた', 'tsuita', 'đến nơi ↔ dính / bật (đèn) — đoán theo ngữ cảnh'],
        ['～ちゃった', '~chatta', '～ちゃう', '~chau', 'ĐÃ lỡ ↔ SẼ mất'],
        ['{聞|き}いた', 'kiita', '{来|き}た', 'kita', 'trường âm いい: đã nghe ↔ đã đến'],
      ],
    },
    {
      t: 'note',
      title: 'Cách luyện tai cho các cặp này',
      items: [
        'Đọc to **từng cặp 5 lần**, ghi âm, nghe lại — tai nghe ra được thứ miệng nói ra được.',
        'Với số và ngày: viết ra giấy **ngay khi nghe** (4日 / 8日), đừng giữ trong đầu. Đề 課題理解・ポイント理解 hay đặt bẫy ở số.',
        'Với cặp ～てよかった ↔ ～ばよかった: hỏi lại mình "**có làm hay không?**" — よかった một mình là may; **ば**よかった là tiếc.',
      ],
    },

    /* ── ⑫ ── */
    { t: 'h', text: '⑫ Chiến thuật làm đề 聴解 N3 — 5 dạng, 28 câu, khoảng 40 phút' },
    {
      t: 'table',
      caption: 'Cấu trúc đề 聴解 N3 (kiến thức chung về dạng đề — số câu theo mẫu đề phổ biến, có thể chênh 1–2 câu)',
      head: ['Mondai', 'Dạng', 'Số câu', 'Trên giấy có gì', 'Câu hỏi nghe khi nào', 'Nghe CÁI GÌ'],
      rows: [
        ['問題1', '課題理解 (hiểu nhiệm vụ)', '6', '4 lựa chọn (chữ / tranh)', 'TRƯỚC và SAU hội thoại', 'Việc phải làm TRƯỚC / TIẾP THEO — lọc bốn ô (⑨)'],
        ['問題2', 'ポイント理解 (hiểu điểm chính)', '6', '4 lựa chọn (chữ)', 'TRƯỚC (+ ~20 giây đọc lựa chọn) và SAU', 'LÝ DO / điều quan trọng nhất — nghe sau でも・実は・それより (⑧)'],
        ['問題3', '概要理解 (hiểu ý khái quát)', '3', 'KHÔNG có gì', 'chỉ SAU đoạn nói', 'Ý CHÍNH / thái độ / chủ đề — thường ở câu kết'],
        ['問題4', '発話表現 (nói gì)', '4', 'Tranh có mũi tên chỉ người nói', 'mô tả tình huống trước', 'Ai nói với ai (trên / dưới / bạn), MÌNH làm hay NHỜ người khác làm'],
        ['問題5', '即時応答 (đáp ngay)', '9', 'KHÔNG có gì', '— (chỉ một câu ngắn)', 'Câu đáp TỰ NHIÊN — câu lặp lại từ của câu hỏi thường là bẫy'],
      ],
    },
    {
      t: 'note',
      title: '10 luật làm đề nghe',
      items: [
        '**1. Đọc lựa chọn TRƯỚC.** Đề 問題1・2 in sẵn lựa chọn — dùng thời gian lời dẫn và phần ví dụ (例) để đọc lựa chọn câu tiếp theo, đoán trước "đề sẽ hỏi gì".',
        '**2. Phân biệt CÓ / KHÔNG có câu hỏi trước.** 問題1・2: có câu hỏi trước → nghe CÓ MỤC TIÊU (chỉ bắt đúng thứ được hỏi). 問題3・5: không có → nghe TOÀN BỘ, nắm ý chung.',
        '**3. Câu hỏi đọc lần đầu là quan trọng nhất.** Ghi lại 2–3 chữ: **誰** (男？女？) · **何** (まず？理由？) · **いつ**.',
        '**4. Ghi chú bằng ký hiệu**, không viết câu: ○ ✕ → ? và số (4日, 3:30). Chữ Nhật viết bằng katakana / romaji cho nhanh cũng được.',
        '**5. Câu đầu thường là bẫy, câu sau dấu hiệu là thật** — でも・ただ・実は・それより・やっぱり (⑧ ⑩).',
        '**6. Không dừng lại ở câu sót.** Đề chỉ phát MỘT lần. Sót một từ → đoán bằng phần còn lại, đi tiếp.',
        '**7. 問題3: nghe khuôn bài nói** — mở (chủ đề) → ví dụ / chuyện → **ですから・つまり・一番～のは** → kết. Ý chính ở **câu kết**; câu hỏi thường là "話し手は何について話していますか／一番言いたいことは何ですか".',
        '**8. 問題4: nhìn tranh trước** — ai là người nói (mũi tên), người nghe là ai (sếp? khách? bạn?), mình MUỐN gì. Ba câu khác nhau ở **ai làm** (させて ↔ して) và **mức lịch sự**.',
        '**9. 問題5: chọn phản ứng tự nhiên** — câu đáp nhắc lại đúng từ / mẫu của câu hỏi hầu như luôn là **bẫy**; chú ý ngữ điệu (lên = hỏi, xuống = khẳng định).',
        '**10. Quản lý 40 phút: KHÔNG có thời gian quay lại.** Mỗi câu chỉ có ~10–12 giây sau câu hỏi cuối. Chọn ngay, tô phiếu ngay, chuyển sang đọc lựa chọn câu sau. Câu không chắc → chọn đáp án hợp lý nhất, không để trống (không trừ điểm sai).',
      ],
    },
    {
      t: 'table',
      caption: 'Phân thời gian 40 phút (ước lượng cho luyện tập)',
      head: ['Phần', 'Thời gian', 'Việc làm trong khoảng lặng'],
      rows: [
        ['Lời dẫn + 問題1 (6 câu)', '~10 phút', 'Đọc 4 lựa chọn câu tiếp theo trong lúc ví dụ / khoảng lặng'],
        ['問題2 (6 câu)', '~12 phút', 'Dùng ~20 giây đọc lựa chọn — gạch chân từ khoá khác nhau giữa 4 lựa chọn'],
        ['問題3 (3 câu)', '~6 phút', 'Không có giấy — ghi 2–3 từ khoá + câu kết'],
        ['問題4 (4 câu)', '~4 phút', 'Nhìn tranh câu sau ngay khi xong câu trước'],
        ['問題5 (9 câu)', '~6 phút', 'Mỗi câu ~10 giây — chọn ngay, không nghĩ lâu'],
      ],
    },

    /* ── Bài luyện ── */
    { t: 'h', text: 'Luyện tập — nhận ra văn nói & ghép câu' },
    {
      t: 'build',
      id: 'b39-np-ghep',
      title: 'Ghép câu văn nói (10 câu) — xếp đúng thứ tự, đọc to bằng dạng rút gọn',
      items: [
        { vi: 'Đồ uống để tớ mua sẵn nhé.', chips: ['{飲|の}み{物|もの}は', '{私|わたし}が', '{買|か}っとく', 'ね', '{買|か}ってく'], answer: ['{飲|の}み{物|もの}は', '{私|わたし}が', '{買|か}っとく', 'ね'], ro: 'Nomimono wa watashi ga kattoku ne.' },
        { vi: 'Xin lỗi, tớ lỡ quên mang ô.', chips: ['ごめん', '{傘|かさ}', '{持|も}ってくるの', '{忘|わす}れちゃった', '{忘|わす}れちゃう'], answer: ['ごめん', '{傘|かさ}', '{持|も}ってくるの', '{忘|わす}れちゃった'], ro: 'Gomen, kasa motte kuru no wasurechatta.' },
        { vi: 'Sắp 9 giờ rồi, phải về thôi.', chips: ['もう', '{九時|くじ}', 'だから', '{帰|かえ}らなきゃ', '{帰|かえ}っちゃだめ'], answer: ['もう', '{九時|くじ}', 'だから', '{帰|かえ}らなきゃ'], ro: 'Mou kuji da kara, kaeranakya.' },
        { vi: 'Không cần viết tên đâu.', chips: ['{名前|なまえ}は', '{書|か}かなくて', 'いいよ', '{書|か}かなきゃ'], answer: ['{名前|なまえ}は', '{書|か}かなくて', 'いいよ'], ro: 'Namae wa kakanakute ii yo.' },
        { vi: 'Cô Sato bảo mai nghỉ học.', chips: ['{佐藤先生|さとうせんせい}', '{明日|あした}', '{休講|きゅうこう}', 'だって', 'じゃん'], answer: ['{佐藤先生|さとうせんせい}', '{明日|あした}', '{休講|きゅうこう}', 'だって'], ro: 'Satou-sensei, ashita kyuukou datte.' },
        { vi: 'Ủa, buổi thi là thứ mấy nhỉ?', chips: ['あれ', '{試験|しけん}', '{何曜日|なんようび}', 'だっけ', 'だって'], answer: ['あれ', '{試験|しけん}', '{何曜日|なんようび}', 'だっけ'], ro: 'Are, shiken nan\'youbi dakke?' },
        { vi: 'Đi xe buýt chắc nhanh hơn đấy?', chips: ['バスの', 'ほうが', '{早|はや}い', 'んじゃない？', 'だっけ？'], answer: ['バスの', 'ほうが', '{早|はや}い', 'んじゃない？'], ro: 'Basu no hou ga hayai n ja nai?' },
        { vi: 'Bài này tớ chẳng hiểu gì cả.', chips: ['この{問題|もんだい}', '{全然|ぜんぜん}', 'わかんない', 'わかっとく'], answer: ['この{問題|もんだい}', '{全然|ぜんぜん}', 'わかんない'], ro: 'Kono mondai, zenzen wakannai.' },
        { vi: 'Trước đó, xếp ghế sẵn giúp tớ được không?', chips: ['その{前|まえ}に', '{椅子|いす}を', '{並|なら}べといて', 'くれる？', '{並|なら}べちゃって'], answer: ['その{前|まえ}に', '{椅子|いす}を', '{並|なら}べといて', 'くれる？'], ro: 'Sono mae ni, isu o narabetoite kureru?' },
        { vi: 'Cho tôi cà phê. À thôi, cho trà đen.', chips: ['コーヒー', 'お{願|ねが}いします', 'あ、やっぱり', '{紅茶|こうちゃ}で', 'それより'], answer: ['コーヒー', 'お{願|ねが}いします', 'あ、やっぱり', '{紅茶|こうちゃ}で'], ro: 'Koohii onegai shimasu. A, yappari koucha de.' },
        { vi: 'Đặt phòng họp thì tớ làm sẵn rồi.', chips: ['{会議室|かいぎしつ}の', '{予約|よやく}は', 'もう', 'しといた', 'しとく'], answer: ['{会議室|かいぎしつ}の', '{予約|よやく}は', 'もう', 'しといた'], ro: 'Kaigishitsu no yoyaku wa mou shitoita.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b39-np-day-du',
      title: 'Nghe ra dạng đầy đủ — viết lại phần in đậm bằng dạng đã học (12 câu)',
      kind: 'fill',
      grammar: 'てる = ている · とく = ておく · てく = ていく · ちゃう = てしまう · なきゃ = なければ · ちゃ = ては · って = と言った／という',
      items: [
        { q: '{何|なに}**{読|よ}んでる**の？ →', answers: V('{読|よ}んでいる'), hint: 'でる = でいる' },
        { q: 'この{資料|しりょう}、**{読|よ}んどいて**。 →', answers: V('{読|よ}んでおいて'), hint: 'どいて = でおいて' },
        { q: '{傘|かさ}、**{持|も}ってく**？ →', answers: V('{持|も}っていく'), hint: 'てく = ていく' },
        { q: 'もう**{食|た}べちゃった**。 →', answers: V('{食|た}べてしまった'), hint: 'ちゃった = てしまった' },
        { q: '{全部|ぜんぶ}**{飲|の}んじゃった**。 →', answers: V('{飲|の}んでしまった'), hint: 'じゃった = でしまった' },
        { q: 'もう**{行|い}かなきゃ**。 →', answers: V('{行|い}かなければ', '{行|い}かなければならない', '{行|い}かなければいけない'), hint: 'なきゃ = なければ' },
        { q: 'そこに**{座|すわ}っちゃだめ**。 →', answers: V('{座|すわ}ってはだめ', '{座|すわ}ってはいけない'), hint: 'ちゃ = ては' },
        { q: '{予約|よやく}は**しといた**よ。 →', answers: V('しておいた'), hint: 'といた = ておいた' },
        { q: 'まだ**{見|み}てない**。 →', answers: V('{見|み}ていない'), hint: 'てない = ていない' },
        { q: '{全然|ぜんぜん}**わかんない**。 →', answers: V('わからない'), hint: 'んない = らない' },
        { q: '{今|いま}、{出|で}る**とこ**。 →', answers: V('ところ'), hint: 'とこ = ところ' },
        { q: '{店長|てんちょう}、{遅|おく}れる**って**。 →', answers: V('と{言|い}っていた', 'と{言|い}った', 'と{言|い}っていました', 'と{言|い}いました'), hint: 'って (cuối câu) = と言っていた' },
      ],
    },
    {
      t: 'quiz',
      id: 'b39-np-rut-gon',
      title: 'Nói kiểu bạn bè — đổi sang dạng rút gọn (6 câu)',
      kind: 'fill',
      grammar: 'ている → てる · ておく → とく · てしまった → ちゃった · なければ → なきゃ · ては → ちゃ',
      items: [
        { q: '{雨|あめ}が{降|ふ}っている。 →', answers: V('{降|ふ}ってる'), hint: 'ふってる' },
        { q: '{窓|まど}を{開|あ}けておく。 →', answers: V('{開|あ}けとく'), hint: 'あけとく' },
        { q: '{財布|さいふ}を{忘|わす}れてしまった。 →', answers: V('{忘|わす}れちゃった'), hint: 'わすれちゃった' },
        { q: '{明日|あした}{早|はや}く{起|お}きなければ。 →', answers: V('{起|お}きなきゃ', '{起|お}きなくちゃ'), hint: 'おきなきゃ' },
        { q: 'ここでたばこを{吸|す}ってはだめ。 →', answers: V('{吸|す}っちゃだめ'), hint: 'すっちゃだめ' },
        { q: '{駅|えき}まで{送|おく}っていくよ。 →', answers: V('{送|おく}ってく'), hint: 'おくってく' },
      ],
    },
    {
      t: 'mcq',
      id: 'b39-np-jlpt',
      title: 'Nghe hiểu ý thật — 12 câu (dạng câu hỏi của 聴解: ý người nói, việc phải làm, quyết định cuối)',
      items: [
        { q: '「{明日|あした}までにこれ、やっといて」と{言|い}われました。どういう{意味|いみ}ですか。', options: ['{明日|あした}までにこれをしておいてほしい', '{明日|あした}これをしてしまった', '{明日|あした}はこれをしなくてもいい', '{明日|あした}これを{持|も}っていく'], correct: 0, why: '**やっといて** = やっておいて → CHỈ THỊ làm sẵn trước ngày mai. 〔Yatte oite hoshii.〕' },
        { q: '「ごめん、{鍵|かぎ}、{家|いえ}に{置|お}いてきちゃった」 — {何|なに}がありましたか。', options: ['{鍵|かぎ}を{家|いえ}に{忘|わす}れてきた', '{鍵|かぎ}を{家|いえ}に{取|と}りに{行|い}く', '{鍵|かぎ}を{家|いえ}に{置|お}いておくつもりだ', '{鍵|かぎ}を{家|いえ}で{見|み}つけた'], correct: 0, why: '**{置|お}いてきちゃった** = {置|お}いてきてしまった — đã lỡ để quên ở nhà. 〔Oite kite shimatta.〕' },
        { q: '「{名前|なまえ}は{書|か}かなくていいよ」 — {名前|なまえ}はどうしますか。', options: ['{必|かなら}ず{書|か}く', '{書|か}かない', 'あとで{書|か}く', 'カタカナで{書|か}く'], correct: 1, why: '**～なくていい** = KHÔNG CẦN → không viết. 〔Kakanakute ii.〕' },
        { q: '「{熱|ねつ}があるなら、{早|はや}く{寝|ね}ないと」 — {話|はな}し{手|て}は{何|なに}を{言|い}いたいですか。', options: ['{早|はや}く{寝|ね}なければならない', '{早|はや}く{寝|ね}なくてもいい', '{早|はや}く{寝|ね}ないと{思|おも}う', '{早|はや}く{寝|ね}てはいけない'], correct: 0, why: '**～ないと** đứng cuối = ～ないといけない → PHẢI ngủ sớm. 〔Hayaku nenai to (ikenai).〕' },
        { q: 'A「{土曜日|どようび}、{映画|えいが}{行|い}かない？」B「{土曜日|どようび}はちょっと……」 — Bは{行|い}きますか。', options: ['{行|い}く', '{行|い}かない', 'ちょっとだけ{行|い}く', 'まだ{決|き}めていない'], correct: 1, why: '**ちょっと……** bỏ lửng = **TỪ CHỐI**. 〔Doyoubi wa chotto…….〕' },
        { q: '「{会議|かいぎ}は{三時|さんじ}から……いや、{三時半|さんじはん}からだった」 — {会議|かいぎ}は{何時|なんじ}からですか。', options: ['{三時|さんじ}', '{三時半|さんじはん}', '{二時半|にじはん}', '{四時|よじ}'], correct: 1, why: '**いや** = đổi ý → câu SAU: **{三時半|さんじはん}**. 〔Sanji han kara datta.〕' },
        { q: '「{飲|の}み{物|もの}は{着|つ}いてからでいいよ。それより、{先|さき}に{地図|ちず}を{印刷|いんさつ}して」 — まず{何|なに}をしますか。', options: ['{飲|の}み{物|もの}を{買|か}う', '{地図|ちず}を{印刷|いんさつ}する', '{会場|かいじょう}に{着|つ}く', '{何|なに}もしない'], correct: 1, why: 'Đồ uống: **～てからでいい** (để sau). **それより、{先|さき}に** → in bản đồ. 〔Saki ni chizu o insatsu shite.〕' },
        { q: '「{安|やす}いのはいいんだけど、{駅|えき}から{遠|とお}いんだよね」 — {話|はな}し{手|て}はこの{部屋|へや}をどう{思|おも}っていますか。', options: ['{安|やす}いから{借|か}りたい', '{遠|とお}いのであまりよくない', '{駅|えき}から{近|ちか}くていい', '{高|たか}すぎる'], correct: 1, why: 'Ý chính sau **けど**: {遠|とお}い → không hài lòng. 〔Eki kara tooi n da yo ne.〕' },
        { q: '「{佐藤先生|さとうせんせい}、レポートは{来週|らいしゅう}でいいって」 — レポートはいつ{出|だ}しますか。', options: ['{今日|きょう}', '{明日|あした}', '{来週|らいしゅう}', '{出|だ}さない'], correct: 2, why: '**～でいいって** = cô bảo tuần sau cũng được → **{来週|らいしゅう}**. 〔Raishuu de ii tte.〕' },
        { q: '「それ、{店員|てんいん}さんに{聞|き}いたほうがいいんじゃない？」 — {話|はな}し{手|て}は{何|なに}をしていますか。', options: ['{禁止|きんし}している', '{提案|ていあん}している', '{質問|しつもん}している', '{謝|あやま}っている'], correct: 1, why: '**～ほうがいいんじゃない？** (lên giọng) = GỢI Ý nhẹ. 〔Kiita hou ga ii n ja nai?〕' },
        { q: '「{来|き}てよかった！」と「{来|く}ればよかった」 — {正|ただ}しいのはどれですか。', options: ['どちらも{来|き}た', '「{来|き}てよかった」は{来|き}た、「{来|く}ればよかった」は{来|こ}なかった', 'どちらも{来|こ}なかった', '「{来|き}てよかった」は{来|こ}なかった'], correct: 1, why: '**Vてよかった** = may mà đã làm · **Vばよかった** = giá mà đã làm (thực tế KHÔNG làm). 〔Kite yokatta ↔ kureba yokatta.〕' },
        { q: '「{集合|しゅうごう}は{東口|ひがしぐち}じゃなくて、{西口|にしぐち}だって」 — どこに{集合|しゅうごう}しますか。', options: ['{東口|ひがしぐち}', '{西口|にしぐち}', '{東口|ひがしぐち}と{西口|にしぐち}', 'まだわからない'], correct: 1, why: '**A じゃなくて B** → B: **{西口|にしぐち}** (+ だって = nghe người khác nói). 〔Higashiguchi ja nakute, nishiguchi datte.〕' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const HAN_TU: Lesson = {
  id: 'b39-han-tu',
  kind: 'kanji',
  title: 'Chữ Hán mới — 21 chữ của nhà ga, cửa hàng, quầy thủ tục, bệnh viện và chính việc nghe: 聴 符 往 換 駐 輪 渋 滞 税 替 領 振 算 症 傷 希 補 却 訂 催 請',
  goal: 'Đọc đúng (không cần furigana) và hiểu nghĩa 21 chữ Hán của bối cảnh đề nghe: nghe (聴解・聴く), đường phố & nhà ga (切符・往復・乗り換え・交換・駐車場・駐輪場・指輪・渋滞・滞在), cửa hàng & quầy (税込み・消費税・両替・着替える・領収書・振り込む・計算・予算・返却・訂正・申請・請求書), bệnh viện (症状・花粉症・熱中症・傷・傷つく), trường & sự kiện (補習・候補・希望・開催・主催・催し); phân biệt chữ trông giống (聴↔徳, 符↔府・付, 往↔住, 駐↔注・柱・住, 輪↔論, 滞↔帯, 税↔説・脱, 替↔賛, 領↔冷・鈴, 振↔震, 症↔証・政, 傷↔湯・場, 希↔布, 補↔捕, 却↔脚, 訂↔町・庁, 催↔推, 請↔晴・清・精・静) và cặp đồng âm かえる (換える・替える・代える・変える).',
  minutes: 55,
  blocks: [
    {
      t: 'p',
      text: 'Chữ mới của Bài 39 là **21 chữ** đi theo các **bối cảnh của đề nghe**: nhà ga, đường phố, cửa hàng, quầy thủ tục, bệnh viện, trường học — và chữ **聴** của chính phần thi **{聴解|ちょうかい}**. Rất nhiều chữ bạn **đã gặp trong từ** mà chưa học riêng: {切符|きっぷ} (Bài 13), {往復|おうふく}・{乗|の}り{換|か}えます・{両替|りょうがえ}します (Bài 17), {取|と}り{替|か}えます (Bài 18), {着替|きが}えます (Bài 23), {振|ふ}り{込|こ}みます (Bài 26), {渋滞|じゅうたい} (Bài 27), {症状|しょうじょう} (Bài 29), {希望|きぼう} (Bài 30), {申請|しんせい} (Bài 37), {交換|こうかん}・{返却|へんきゃく} (Bài 38). Đề N3 phần **漢字読み** rất hay hỏi đúng các từ quen này — nay bạn đọc được chữ.',
    },
    {
      t: 'table',
      caption: '21 chữ Hán mới của Bài 39',
      head: ['Chữ', 'Hán Việt', 'Âm On', 'Âm Kun', 'Nghĩa', 'Từ ví dụ', 'Mức'],
      rows: [
        ['聴', 'THÍNH', 'チョウ', 'き(く)', 'nghe (chăm chú)', '{聴解|ちょうかい} (nghe hiểu) · {聴|き}く (lắng nghe) · {視聴者|しちょうしゃ} (người xem — N2)', '👁 N2 (từ N3)'],
        ['符', 'PHÙ', 'フ', '—', 'thẻ, phù hiệu; ký hiệu', '{切符|きっぷ} (vé) · {音符|おんぷ} (nốt nhạc) · {符号|ふごう} (ký hiệu — N1)', '👁 N3'],
        ['往', 'VÃNG', 'オウ', '—', 'đi tới, qua lại', '{往復|おうふく} (khứ hồi) · {往来|おうらい} (qua lại — N1)', '👁 N3'],
        ['換', 'HOÁN', 'カン', 'か(える)・か(わる)', 'đổi, trao đổi', '{交換|こうかん} (trao đổi) · {乗|の}り{換|か}える (đổi tàu) · {換気|かんき} (thông gió — N2)', '✍ N3'],
        ['駐', 'TRÚ', 'チュウ', '—', 'dừng lại, đóng', '{駐車場|ちゅうしゃじょう} (bãi đỗ xe) · {駐輪場|ちゅうりんじょう} (bãi xe đạp) · {駐車禁止|ちゅうしゃきんし}', '👁 N3'],
        ['輪', 'LUÂN', 'リン', 'わ', 'bánh xe; vòng', '{輪|わ} (vòng) · {指輪|ゆびわ} (nhẫn) · {車輪|しゃりん} (bánh xe — N2)', '✍ N3'],
        ['渋', 'SÁP', 'ジュウ', 'しぶ・しぶ(い)・しぶ(る)', 'chát; tắc', '{渋滞|じゅうたい} (kẹt xe) · {渋|しぶ}い (chát; trầm — N2) · {渋谷|しぶや}', '👁 N2'],
        ['滞', 'TRỆ', 'タイ', 'とどこお(る)', 'ứ đọng, ở lại', '{渋滞|じゅうたい} · {滞在|たいざい} (lưu trú — N2) · {滞|とどこお}る (N1)', '👁 N2'],
        ['税', 'THUẾ', 'ゼイ', '—', 'thuế', '{税込|ぜいこ}み · {税抜|ぜいぬ}き · {税金|ぜいきん} · {消費税|しょうひぜい} · {免税|めんぜい} (N2)', '✍ N3'],
        ['替', 'THẾ', 'タイ', 'か(える)・か(わる)', 'thay, thay thế', '{両替|りょうがえ} (đổi tiền) · {着替|きが}える (thay đồ) · {取|と}り{替|か}える · {交替|こうたい} (thay ca — N2)', '👁 N3'],
        ['領', 'LĨNH', 'リョウ', '—', 'nhận; cai quản', '{領収書|りょうしゅうしょ} (hoá đơn) · {大統領|だいとうりょう} (tổng thống — N2) · {要領|ようりょう} (N1)', '👁 N2–N3'],
        ['振', 'CHẤN', 'シン', 'ふ(る)・ふ(るう)・ふ(れる)', 'vẫy, lắc, rung', '{振|ふ}る (vẫy) · {振|ふ}り{込|こ}む (chuyển khoản) · {久|ひさ}し{振|ぶ}り · {振動|しんどう} (N1)', '✍ N3'],
        ['算', 'TOÁN', 'サン', '—', 'tính toán', '{計算|けいさん} (tính toán) · {予算|よさん} (ngân sách) · {算数|さんすう} (môn toán) · {精算|せいさん} (tính bù — N1)', '✍ N3'],
        ['症', 'CHỨNG', 'ショウ', '—', 'chứng bệnh', '{症状|しょうじょう} (triệu chứng) · {花粉症|かふんしょう} · {熱中症|ねっちゅうしょう} · {軽症|けいしょう} (N1)', '👁 N2'],
        ['傷', 'THƯƠNG', 'ショウ', 'きず・いた(む)・いた(める)', 'vết thương', '{傷|きず} · {傷|きず}つく (bị tổn thương) · {負傷|ふしょう} (N1) · {傷|いた}む ((đồ ăn) hỏng — N2)', '👁 N3'],
        ['希', 'HI', 'キ', '—', 'mong; hiếm', '{希望|きぼう} (nguyện vọng) · {希望者|きぼうしゃ} · {希少|きしょう} (hiếm — N1)', '👁 N3'],
        ['補', 'BỔ', 'ホ', 'おぎな(う)', 'bổ sung, vá', '{補習|ほしゅう} (học bù) · {補|おぎな}う (bù — N2) · {候補|こうほ} (ứng viên — N2)', '👁 N2–N3'],
        ['却', 'KHƯỚC', 'キャク', '—', 'lùi; trả lại', '{返却|へんきゃく} (trả lại) · {返却日|へんきゃくび} (hạn trả) · {冷却|れいきゃく} (N1)', '👁 N2'],
        ['訂', 'ĐÍNH', 'テイ', '—', 'sửa cho đúng', '{訂正|ていせい} (đính chính) · {改訂|かいてい} (sửa đổi — N1) · {改訂版|かいていばん}', '👁 N2'],
        ['催', 'THÔI', 'サイ', 'もよお(す)', 'tổ chức; thúc', '{開催|かいさい} (tổ chức) · {主催|しゅさい} (đơn vị tổ chức — N2) · {催|もよお}し (sự kiện — N2) · {催促|さいそく} (N1)', '👁 N2'],
        ['請', 'THỈNH', 'セイ・シン', 'こ(う)・う(ける)', 'xin, thỉnh cầu', '{申請|しんせい} (xin cấp phép) · {請求|せいきゅう} (đòi thanh toán — N2) · {請求書|せいきゅうしょ}', '👁 N2'],
      ],
    },
    {
      t: 'note',
      title: 'Cách học 21 chữ trong 3 ngày',
      items: [
        '**Ngày 1 — chữ của đường phố (7)**: 符 往 換 駐 輪 渋 滞. Học theo **một chuyến đi**: mua {切符|きっぷ} {往復|おうふく} → {乗|の}り{換|か}える → ra ga, xe buýt kẹt {渋滞|じゅうたい} → gửi xe đạp ở {駐輪場|ちゅうりんじょう}. ✍ Viết: 換 輪.',
        '**Ngày 2 — chữ của quầy (8)**: 税 替 領 振 算 請 却 訂. Học theo **một lần đi mua sắm + làm thủ tục**: giá {税込|ぜいこ}み → {計算|けいさん} → {領収書|りょうしゅうしょ} → {両替|りょうがえ} → {振|ふ}り{込|こ}む {請求書|せいきゅうしょ} → {返却|へんきゃく} sách → {申請|しんせい} giấy tờ → {訂正|ていせい} chỗ sai. ✍ Viết: 税 振 算.',
        '**Ngày 3 — bệnh viện, trường, nghe (6)**: 症 傷 希 補 催 聴. Chuyện: hè bị {熱中症|ねっちゅうしょう}, ngã có {傷|きず} → nghỉ học phải đi {補習|ほしゅう} → nộp {希望|きぼう} đi sự kiện {開催|かいさい} ở trường → về nhà luyện {聴解|ちょうかい}. Rồi làm phần đọc không furigana + trắc nghiệm.',
        '**Học theo TỪ, không học âm rời**: 15/21 chữ chỉ có âm On → nhớ bằng từ: {税|ぜい}＝{税金|ぜいきん}, {領|りょう}＝{領収書|りょうしゅうしょ}, {訂|てい}＝{訂正|ていせい}. Chữ hình thanh: nhìn **phần gợi âm** ({駐|ちゅう}←主, {輪|りん}←侖, {請|せい}←青, {振|しん}←辰, {補|ほ}←甫) là đoán được âm On.',
      ],
    },
    {
      t: 'table',
      caption: 'Đứng riêng hay đứng chung — kun (đứng một mình) ↔ on (trong từ ghép)',
      head: ['Chữ', 'Đứng riêng (kun)', 'Trong từ ghép (on)', 'Mẹo đọc'],
      rows: [
        ['聴', '{聴|き}く', '{聴解|ちょうかい}・{視聴者|しちょうしゃ}', 'ちょう — trường âm: **chou**kai'],
        ['換', '{換|か}える・{乗|の}り{換|か}える', '{交換|こうかん}・{換気|かんき}', 'かん — kết hợp với 交 → こう**かん**'],
        ['輪', '{輪|わ}・{指輪|ゆびわ}', '{車輪|しゃりん}・{駐輪場|ちゅうりんじょう}', '{指輪|ゆびわ}: hai chữ đều kun'],
        ['渋', '{渋|しぶ}い', '{渋滞|じゅうたい}', 'じゅう (không phải しゅう) — **juu**tai'],
        ['滞', '{滞|とどこお}る (N1)', '{渋滞|じゅうたい}・{滞在|たいざい}', 'たい — giống 帯 (たい)'],
        ['替', '{替|か}える・{着替|きが}える', '{両替|りょうがえ}・{交替|こうたい}', '{両替|りょうがえ}: 替 đọc **がえ** (kun, biến âm)!'],
        ['振', '{振|ふ}る・{振|ふ}り{込|こ}む', '{振動|しんどう}', '{久|ひさ}し{振|ぶ}り: **ぶ**り (biến âm)'],
        ['傷', '{傷|きず}・{傷|きず}つく・{傷|いた}む', '{負傷|ふしょう}・{重傷|じゅうしょう}', 'Đứng một mình đọc **きず**'],
        ['補', '{補|おぎな}う', '{補習|ほしゅう}・{候補|こうほ}', 'ほ — ngắn: **ho**shuu'],
        ['催', '{催|もよお}す・{催|もよお}し', '{開催|かいさい}・{主催|しゅさい}', '{催|もよお}し: **もよおし** (4 âm)'],
        ['請', '{請|こ}う (N1)', '{申請|しんせい}・{請求|せいきゅう}', '{申請|しんせい}: しん + **せい**'],
        ['符 往 駐 税 領 算 症 希 却 訂', '— (không đứng riêng)', '{切符|きっぷ}・{往復|おうふく}・{駐車|ちゅうしゃ}・{税金|ぜいきん}・{領収書|りょうしゅうしょ}・{計算|けいさん}・{症状|しょうじょう}・{希望|きぼう}・{返却|へんきゃく}・{訂正|ていせい}', 'Luôn đọc On — {切符|きっぷ}: ふ → **っぷ** (âm ngắt + biến âm)'],
      ],
    },
    {
      t: 'table',
      caption: 'Chữ trông giống — bẫy của đề 表記',
      head: ['Chữ của bài', 'Chữ dễ nhầm', 'Phân biệt'],
      rows: [
        ['聴 (ちょう)', '徳 (とく)', 'cùng phần phải 十 + 罒 + 心: 聴 có 耳 (tai) · 徳 có 彳'],
        ['符 (ふ)', '府 (ふ — Bài 38)・付 (つける)', 'cùng 付: 符 ⺮ trên · 府 广 trùm — cùng đọc フ'],
        ['往 (おう)', '住 (すむ・じゅう)', 'cùng 主 bên phải: 往 彳 (đi) · 住 亻 (người ở)'],
        ['駐 (ちゅう)', '注 (ちゅう)・柱 (はしら)・住 (じゅう)', 'cùng 主: 駐 馬 · 注 氵 · 柱 木 · 住 亻'],
        ['輪 (りん)', '論 (ろん)', 'cùng 侖: 輪 車 (bánh xe) · 論 言 (bàn luận)'],
        ['滞 (たい)', '帯 (おび・たい)', '滞 = 氵 + 帯 — cùng đọc タイ'],
        ['税 (ぜい)', '説 (せつ)・脱 (だつ)', 'cùng 兑: 税 禾 · 説 言 · 脱 月'],
        ['替 (かえる)', '賛 (さん — tán thành)', 'trên cùng là 夫夫: 替 dưới 日 · 賛 dưới 貝'],
        ['領 (りょう)', '冷 (れい)・鈴 (すず)・頭 (あたま)', '領 = 令 + 頁 · 冷 = 冫 + 令 · 頭 = 豆 + 頁'],
        ['振 (しん・ふる)', '震 (しん — động đất)', 'cùng 辰: 振 扌 (tay) · 震 雨 trên — cùng シン'],
        ['症 (しょう)', '証 (しょう)・政 (せい)', 'cùng 正: 症 疒 · 証 言 · 政 攵'],
        ['傷 (きず)', '湯 (ゆ)・場 (ば)・陽 (よう)', 'cùng 昜: 傷 亻 + ⺈ · 湯 氵 · 場 土 · 陽 阝'],
        ['希 (き)', '布 (ぬの)', '希 = 㐅 + 布'],
        ['補 (ほ)', '捕 (ほ — bắt)・浦 (うら)', 'cùng 甫: 補 衤 (áo) · 捕 扌 · 浦 氵'],
        ['却 (きゃく)', '脚 (きゃく — chân)', '脚 = 月 + 却 — cùng キャク'],
        ['訂 (てい)', '町 (まち)・庁 (ちょう)', 'cùng 丁: 訂 言 · 町 田 · 庁 广'],
        ['催 (さい)', '推 (すい)', 'cùng 隹: 催 亻 + 山 · 推 扌'],
        ['請 (せい)', '晴 (はれ)・清 (せい)・精 (せい)・静 (しずか)', 'cùng 青: 請 言 · 晴 日 · 清 氵 · 精 米 · 静 争'],
      ],
    },
    {
      t: 'table',
      caption: '⭐ Bốn chữ cùng đọc かえる／かわる — đề 表記 rất hay hỏi',
      head: ['Chữ', 'Nghĩa', 'Ví dụ', 'Romaji'],
      rows: [
        ['{変|か}える／{変|か}わる', 'BIẾN ĐỔI (khác đi)', '{予定|よてい}を{変|か}える・{天気|てんき}が{変|か}わる', 'yotei o kaeru · tenki ga kawaru'],
        ['{換|か}える', 'ĐỔI cái này lấy cái kia', '{円|えん}をドルに{換|か}える・{乗|の}り{換|か}える', 'en o doru ni kaeru · norikaeru'],
        ['{替|か}える／{替|か}わる', 'THAY cái cũ bằng cái mới', '{電池|でんち}を{替|か}える・{着替|きが}える・{両替|りょうがえ}', 'denchi o kaeru · kigaeru · ryougae'],
        ['{代|か}える／{代|か}わる', 'THAY THẾ vai trò (người / vật làm thay)', '{部長|ぶちょう}に{代|か}わって{挨拶|あいさつ}する', 'buchou ni kawatte aisatsu suru'],
      ],
    },
    {
      t: 'readkanji',
      id: 'b39-doc-kanji',
      title: 'Đọc không furigana — 18 câu như đề thi (bấm hiện cách đọc sau khi tự đọc)',
      note: 'Đọc to cả câu, chú ý từ có chữ mới. Câu dùng chữ đã học tới Bài 39.',
      items: [
        { text: '{来週|らいしゅう}、JLPTの{聴解|ちょうかい}の{模擬試験|もぎしけん}があります。', ro: 'Raishuu, JLPT no choukai no mogi shiken ga arimasu.', vi: 'Tuần sau có thi thử phần nghe hiểu JLPT.' },
        { text: '{大阪|おおさか}までの{往復|おうふく}の{切符|きっぷ}を{買|か}いました。', ro: 'Oosaka made no oufuku no kippu o kaimashita.', vi: 'Tôi đã mua vé khứ hồi đến Osaka.' },
        { text: '{次|つぎ}の{駅|えき}で{快速|かいそく}に{乗|の}り{換|か}えてください。', ro: 'Tsugi no eki de kaisoku ni norikaete kudasai.', vi: 'Hãy đổi sang tàu nhanh ở ga tiếp theo.' },
        { text: '{駅前|えきまえ}の{駐輪場|ちゅうりんじょう}に{自転車|じてんしゃ}を{止|と}めた。', ro: 'Ekimae no chuurinjou ni jitensha o tometa.', vi: 'Tôi đỗ xe đạp ở bãi xe đạp trước ga.' },
        { text: '{事故|じこ}のため、{高速道路|こうそくどうろ}が{渋滞|じゅうたい}している。', ro: 'Jiko no tame, kousoku douro ga juutai shite iru.', vi: 'Do tai nạn, đường cao tốc đang kẹt xe.' },
        { text: '{東京|とうきょう}に{一週間|いっしゅうかん}{滞在|たいざい}する{予定|よてい}です。', ro: 'Toukyou ni isshuukan taizai suru yotei desu.', vi: 'Tôi dự định lưu trú ở Tokyo một tuần.' },
        { text: 'この{値段|ねだん}は{税込|ぜいこ}みですか、{税抜|ぜいぬ}きですか。', ro: 'Kono nedan wa zeikomi desu ka, zeinuki desu ka.', vi: 'Giá này đã gồm thuế hay chưa gồm thuế?' },
        { text: '{空港|くうこう}で{円|えん}をドルに{両替|りょうがえ}した。', ro: 'Kuukou de en o doru ni ryougae shita.', vi: 'Tôi đã đổi yên sang đô ở sân bay.' },
        { text: '{会社|かいしゃ}に{出|だ}すので、{領収書|りょうしゅうしょ}をください。', ro: 'Kaisha ni dasu node, ryoushuusho o kudasai.', vi: 'Tôi nộp cho công ty nên cho tôi xin hoá đơn.' },
        { text: '{今月|こんげつ}の{家賃|やちん}は、もう{振|ふ}り{込|こ}みました。', ro: 'Kongetsu no yachin wa, mou furikomimashita.', vi: 'Tiền nhà tháng này tôi đã chuyển khoản rồi.' },
        { text: '{旅行|りょこう}の{予算|よさん}を{計算|けいさん}してみよう。', ro: 'Ryokou no yosan o keisan shite miyou.', vi: 'Thử tính ngân sách cho chuyến du lịch đi.' },
        { text: '{熱|ねつ}とせきの{症状|しょうじょう}があったら、{連絡|れんらく}してください。', ro: 'Netsu to seki no shoujou ga attara, renraku shite kudasai.', vi: 'Nếu có triệu chứng sốt và ho, hãy liên lạc.' },
        { text: '{夏|なつ}は{熱中症|ねっちゅうしょう}に{気|き}をつけましょう。', ro: 'Natsu wa necchuushou ni ki o tsukemashou.', vi: 'Mùa hè hãy cẩn thận với say nắng.' },
        { text: '{転|ころ}んで、{手|て}に{小|ちい}さな{傷|きず}ができた。', ro: 'Koronde, te ni chiisa na kizu ga dekita.', vi: 'Tôi ngã, tay bị một vết xước nhỏ.' },
        { text: '{希望|きぼう}する{人|ひと}は、{土曜日|どようび}の{補習|ほしゅう}に{参加|さんか}できます。', ro: 'Kibou suru hito wa, doyoubi no hoshuu ni sanka dekimasu.', vi: 'Ai có nguyện vọng có thể tham gia buổi học bù thứ Bảy.' },
        { text: '{借|か}りた{本|ほん}は{来週|らいしゅう}までに{返却|へんきゃく}してください。', ro: 'Karita hon wa raishuu made ni henkyaku shite kudasai.', vi: 'Sách đã mượn hãy trả lại trước tuần sau.' },
        { text: '{先|さき}ほどのお{知|し}らせに{間違|まちが}いがありましたので、{訂正|ていせい}いたします。', ro: 'Sakihodo no oshirase ni machigai ga arimashita node, teisei itashimasu.', vi: 'Thông báo vừa rồi có chỗ sai, xin đính chính.' },
        { text: '{大学祭|だいがくさい}は{雨|あめ}でも{予定|よてい}どおり{開催|かいさい}されます。{申請|しんせい}の{締|し}め{切|き}りは{金曜日|きんようび}です。', ro: 'Daigakusai wa ame demo yotei doori kaisai saremasu. Shinsei no shimekiri wa kin\'youbi desu.', vi: 'Lễ hội trường vẫn được tổ chức như dự kiến dù mưa. Hạn nộp đơn là thứ Sáu.' },
      ],
    },
    {
      t: 'readkanji',
      id: 'b39-doc-doan',
      title: 'Đọc đoạn không furigana — 3 thông báo kiểu bài nghe được in ra',
      note: 'Đây chính là lời của ba bài nghe trong bài, in ra thành chữ. Đọc to trôi chảy = nghe ra được.',
      items: [
        { text: 'お{客様|きゃくさま}にお{知|し}らせいたします。{本日|ほんじつ}、{駅前|えきまえ}{通|どお}りは{工事|こうじ}のため{渋滞|じゅうたい}しております。バスをご{利用|りよう}のお{客様|きゃくさま}は、{二番乗|にばんの}り{場|ば}から{臨時|りんじ}バスにお{乗|の}り{換|か}えください。{往復|おうふく}{切符|きっぷ}をお{持|も}ちの{方|かた}は、そのままご{利用|りよう}いただけます。', ro: 'Okyakusama ni oshirase itashimasu. Honjitsu, ekimae doori wa kouji no tame juutai shite orimasu. Basu o goriyou no okyakusama wa, niban noriba kara rinji basu ni onorikae kudasai. Oufuku kippu o omochi no kata wa, sono mama goriyou itadakemasu.', vi: 'Xin thông báo tới quý khách. Hôm nay đường trước ga đang kẹt xe do thi công. Quý khách đi xe buýt xin đổi sang xe buýt tạm thời ở bến số 2. Quý khách có vé khứ hồi có thể dùng luôn.' },
        { text: '{店内|てんない}のお{客様|きゃくさま}にご{案内|あんない}いたします。{本日|ほんじつ}{表示|ひょうじ}の{値段|ねだん}はすべて{税抜|ぜいぬ}きです。お{会計|かいけい}の{際|さい}に{消費税|しょうひぜい}を{計算|けいさん}いたします。{領収書|りょうしゅうしょ}が{必要|ひつよう}な{方|かた}はレジでお{申|もう}し{付|つ}けください。{商品|しょうひん}の{交換|こうかん}・{返品|へんぴん}はレシートをお{持|も}ちの{方|かた}に{限|かぎ}ります。', ro: 'Tennai no okyakusama ni goannai itashimasu. Honjitsu hyouji no nedan wa subete zeinuki desu. Okaikei no sai ni shouhizei o keisan itashimasu. Ryoushuusho ga hitsuyou na kata wa reji de omoushitsuke kudasai. Shouhin no koukan, henpin wa reshiito o omochi no kata ni kagirimasu.', vi: 'Xin thông báo tới quý khách trong cửa hàng. Hôm nay mọi giá niêm yết đều chưa gồm thuế. Khi thanh toán chúng tôi sẽ tính thuế tiêu dùng. Quý khách cần hoá đơn xin báo ở quầy. Đổi, trả hàng chỉ áp dụng cho quý khách có hoá đơn in.' },
        { text: '{学生|がくせい}の{皆|みな}さんへ。{先週|せんしゅう}{休講|きゅうこう}になった{授業|じゅぎょう}の{補習|ほしゅう}を、{土曜日|どようび}に{開催|かいさい}します。{参加|さんか}を{希望|きぼう}する{人|ひと}は、{木曜日|もくようび}までに{申請|しんせい}してください。なお、{昨日|きのう}のお{知|し}らせの{教室|きょうしつ}は{三〇一|さんまるいち}ではなく{三〇二|さんまるに}でした。{訂正|ていせい}します。', ro: 'Gakusei no minasan e. Senshuu kyuukou ni natta jugyou no hoshuu o, doyoubi ni kaisai shimasu. Sanka o kibou suru hito wa, mokuyoubi made ni shinsei shite kudasai. Nao, kinou no oshirase no kyoushitsu wa san-maru-ichi de wa naku san-maru-ni deshita. Teisei shimasu.', vi: 'Gửi các bạn sinh viên. Buổi học bù cho tiết nghỉ tuần trước sẽ tổ chức vào thứ Bảy. Ai muốn tham gia hãy đăng ký trước thứ Năm. Ngoài ra, phòng học trong thông báo hôm qua không phải 301 mà là 302. Xin đính chính.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b39-han-doc',
      title: '漢字読み — chọn cách đọc đúng của từ in đậm (10 câu)',
      items: [
        { q: '**聴解**の{試験|しけん}は{四十分|よんじゅっぷん}です。', options: ['ちょうかい', 'ちょかい', 'きょうかい', 'ちょうげ'], correct: 0, why: '**{聴解|ちょうかい}** — 聴 ちょう (trường âm) + 解 かい. 〔Choukai〕' },
        { q: '**往復**で{二千円|にせんえん}かかります。', options: ['おうふく', 'おふく', 'じゅうふく', 'おうぶく'], correct: 0, why: '**{往復|おうふく}** — 往 おう. Đừng đọc theo 住 (じゅう). 〔Oufuku〕' },
        { q: '{朝|あさ}の{道路|どうろ}はいつも**渋滞**している。', options: ['しゅうたい', 'じゅうたい', 'しぶたい', 'じゅうだい'], correct: 1, why: '**{渋滞|じゅうたい}** — 渋 じゅう (đục), 滞 たい. 〔Juutai〕' },
        { q: '**両替**はどこでできますか。', options: ['りょうたい', 'りょうかえ', 'りょうがえ', 'りょがえ'], correct: 2, why: '**{両替|りょうがえ}** — 替 đọc kun **がえ** (biến âm). 〔Ryougae〕' },
        { q: '**領収書**をお{願|ねが}いします。', options: ['りょうしゅうしょ', 'りょしゅうしょ', 'れいしゅうしょ', 'りょうしゅしょ'], correct: 0, why: '**{領収書|りょうしゅうしょ}** — ba trường âm: ryou-shuu-sho. 〔Ryoushuusho〕' },
        { q: '{家賃|やちん}を**振**り{込|こ}んだ。', options: ['しん', 'ふ', 'ぶ', 'の'], correct: 1, why: '**{振|ふ}り{込|こ}む** — kun ふ. 〔Furikonda〕' },
        { q: '**症状**を{教|おし}えてください。', options: ['しょうじょう', 'しょじょう', 'せいじょう', 'しょうじょ'], correct: 0, why: '**{症状|しょうじょう}** — cả hai chữ trường âm. 〔Shoujou〕' },
        { q: '{膝|ひざ}に**傷**がある。', options: ['しょう', 'きず', 'いたみ', 'けが'], correct: 1, why: 'Đứng một mình → kun **{傷|きず}**. けが là từ khác (không viết bằng 傷 trong đề). 〔Kizu〕' },
        { q: '**補習**は{土曜日|どようび}です。', options: ['ほしゅう', 'ほうしゅう', 'ほしゅ', 'ぼしゅう'], correct: 0, why: '**{補習|ほしゅう}** — 補 ほ (ngắn). ⚠ ぼしゅう là {募集|ぼしゅう} (Bài 38). 〔Hoshuu〕' },
        { q: '{会議|かいぎ}は{東京|とうきょう}で**開催**されます。', options: ['かいさい', 'かいせい', 'かいざい', 'かいもよお'], correct: 0, why: '**{開催|かいさい}** — 催 さい. 〔Kaisai〕' },
      ],
    },
    {
      t: 'mcq',
      id: 'b39-han-chon',
      title: '表記 — chọn chữ Hán đúng cho phần in đậm (8 câu)',
      items: [
        { q: '{駅|えき}で**きっぷ**を{買|か}う。', options: ['切府', '切符', '切付', '切布'], correct: 1, why: '**{切符|きっぷ}** — 符 có ⺮ trên. 府 là phủ (Bài 38). 〔Kippu〕' },
        { q: '{次|つぎ}の{駅|えき}で**のりかえる**。', options: ['乗り変える', '乗り換える', '乗り代える', '乗り帰る'], correct: 1, why: 'Đổi tàu → **{乗|の}り{換|か}える** (換 = đổi cái này lấy cái kia). 〔Norikaeru〕' },
        { q: '{車|くるま}を**ちゅうしゃじょう**に{止|と}める。', options: ['注車場', '住車場', '駐車場', '柱車場'], correct: 2, why: '**{駐車場|ちゅうしゃじょう}** — 駐 có 馬 (ngựa dừng). 注・住・柱 cùng 主 nhưng khác bộ. 〔Chuushajou〕' },
        { q: 'この{値段|ねだん}は**ぜいこみ**です。', options: ['説込み', '税込み', '脱込み', '祝込み'], correct: 1, why: '**{税込|ぜいこ}み** — 税 có 禾 (lúa). 〔Zeikomi〕' },
        { q: '**きがえて**から{出|で}かけます。', options: ['着換えて', '着替えて', '着変えて', '着代えて'], correct: 1, why: 'Thay quần áo → **{着替|きが}える** (替 = thay cái cũ bằng cái mới). 〔Kigaete〕' },
        { q: '{本|ほん}を**へんきゃく**する。', options: ['返却', '返脚', '変却', '返去'], correct: 0, why: '**{返却|へんきゃく}** — 却 = 去 + 卩. 脚 là chân. 〔Henkyaku〕' },
        { q: '{間違|まちが}いを**ていせい**する。', options: ['町正', '丁正', '訂正', '停正'], correct: 2, why: '**{訂正|ていせい}** — 訂 có 言 (sửa LỜI). 〔Teisei〕' },
        { q: 'ビザを**しんせい**する。', options: ['申晴', '申清', '申精', '申請'], correct: 3, why: '**{申請|しんせい}** — 請 có 言 (dùng lời xin). 晴・清・精 cùng 青 nhưng khác bộ. 〔Shinsei〕' },
      ],
    },
    {
      t: 'write',
      id: 'b39-viet-kanji',
      title: 'Tập viết 21 chữ mới',
      note: 'Ưu tiên ✍: 換 輪 税 振 算. Các chữ 👁 chỉ cần nhận mặt — viết 2–3 lần cho nhớ hình.',
      chars: ['聴', '符', '往', '換', '駐', '輪', '渋', '滞', '税', '替', '領', '振', '算', '症', '傷', '希', '補', '却', '訂', '催', '請'],
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
  id: 'b39-nghe',
  kind: 'listening',
  title: 'Nghe hiểu N3 — 22 bài theo đủ 5 dạng đề: 課題理解 ×4 · ポイント理解 ×5 · 概要理解 ×4 · 発話表現 ×4 · 即時応答 ×5 bộ (15 câu) + chiến thuật từng dạng',
  goal: 'Làm được đủ 5 dạng đề 聴解 N3: chọn việc phải làm TRƯỚC khi có việc đã xong / để sau / người khác làm / bị đổi ý (課題理解); bắt đúng lý do thật, giờ mới, điều kiện sau でも・ただ・実は・それより (ポイント理解); nắm chủ đề, ý chính, thái độ của cả bài nói không có câu hỏi trước (概要理解); chọn câu nói đúng vai, đúng người làm, đúng mức lịch sự (発話表現); đáp ngay tự nhiên với câu ngắn có văn nói rút gọn (即時応答).',
  minutes: 90,
  blocks: [
    {
      t: 'table',
      caption: 'Phần nghe (聴解) đề JLPT N3 — 5 dạng, khoảng 40 phút, 28 câu',
      head: ['Mondai', 'Dạng', 'Bài trong mục này', 'Mẹo then chốt'],
      rows: [
        ['問題1', '課題理解', 'Bài 1–4: quầy thủ tục trường · văn phòng công ty · ký túc xá · thư viện', 'Lọc bốn ô: ○ làm ngay · ✕ đã xong · → để sau · ✕ người khác làm. Câu cuối của người được hướng dẫn hay tóm lại việc sẽ làm.'],
        ['問題2', 'ポイント理解', 'Bài 5–9: vì sao đến muộn · vì sao không trả được hàng · giờ đi làm mới · vì sao đổi ngày · loa nhà ga', 'Lý do bị phủ định trước (それは大丈夫だった・～わけじゃない), lý do thật sau 実は／それより. Số / giờ bị đổi: tin câu sau いや・ごめん・あ、～で.'],
        ['問題3', '概要理解', 'Bài 10–13: radio "người nghe giỏi" · ý kiến về quán cà phê · loa của khu phố · lời khuyên của cô giáo', 'Không có câu hỏi trước — nghe toàn bài, ghi 2–3 từ khoá. Ý chính ở câu kết (大切なのは・ですから・つまり); thái độ ở けど・まあ・どうせ.'],
        ['問題4', '発話表現', 'Bài 14–17: xin hoá đơn · hỏi lại giảng viên · nhờ bạn tiện mua giùm · gọi điện hỏi còn chỗ', 'Nhìn cảnh: ai nói với ai, MÌNH muốn gì. Loại câu sai người làm (～てあげる ↔ ～てもらう), sai hướng kính ngữ (差し上げる ↔ いただく).'],
        ['問題5', '即時応答', 'Bài 18–22: 5 bộ × 3 câu', 'Câu đáp lặp lại đúng từ / mẫu của câu hỏi thường là bẫy. Nghe ngữ điệu và dạng rút gọn (～ちゃった・～といて・～っけ・ちょっと……).'],
      ],
    },
    {
      t: 'note',
      title: 'Cách luyện mỗi bài nghe (4 lượt)',
      items: [
        '**Lượt 1 — như đi thi**: đọc lựa chọn (nếu dạng đó có in), bấm nghe **một lần**, KHÔNG mở lời thoại, chọn đáp án.',
        '**Lượt 2 — soát**: xem giải thích, tìm **câu then chốt** (ghi trong phần giải thích, có romaji + nghĩa). Nghe lại đúng đoạn đó.',
        '**Lượt 3 — đọc theo**: mở lời thoại + romaji, nghe và nhìn chữ, gạch dưới mọi **dạng rút gọn** (～とく・～ちゃう・～って…) và **từ đảo ý** (でも・実は・やっぱり…).',
        '**Lượt 4 — nói theo (shadowing)**: chọn 2–3 câu then chốt, bấm nghe từng câu rồi nói đè theo ngay sau người đọc. Mục **Luyện nói** có bài shadowing riêng.',
        '⚠ Đề thật: 問題3・4・5 **không in lựa chọn** — chỉ đọc bằng tiếng. Khi luyện ba dạng này, **che 4 lựa chọn** bên dưới, nghe xong tự nói ý chính / câu đáp, rồi mới mở ra so.',
      ],
    },

    /* ═══ 問題1 課題理解 ═══ */
    { t: 'h', text: '問題1 課題理解 — "Người này phải làm gì TRƯỚC?" (4 bài)' },
    {
      t: 'note',
      title: 'Dạng 課題理解 — nghe gì',
      items: [
        'Câu hỏi đọc **trước và sau** hội thoại: thường là **このあとまず何をしますか** (trước tiên) hoặc **何をしなければなりませんか** (phải làm gì). Chú ý **AI** làm — 男の人 hay 女の人.',
        'Hội thoại kể ra **3–5 việc**. Chỉ một việc là đáp án; các việc khác đều thuộc một trong ba loại bẫy: **đã xong** (もう～てある・～といた), **để sau** (～てからでいい・あとで・明日の朝でいい), **người khác làm / không cần** (～は私が・～がやってくれてる・～なくていい).',
        'Dấu hiệu đáp án: **まず・先に・その前に・それより・とりあえず** + lời nhờ **～てくれる？／～てもらえる？／～てください**.',
      ],
    },

    /* ── 1 ── */
    { t: 'h', text: 'Bài 1 — 問題1 課題理解: ở phòng công tác sinh viên (学生課) — làm lại thẻ sinh viên' },
    NG('b39-ng-1', '{女|おんな}の{学生|がくせい}はこのあとまず{何|なに}をしますか', 'Dạng 課題理解 — ảnh: đã mang (持ってきました); thẻ cư trú: có sẵn, nộp cùng đơn; viết đơn: viết ở bàn cạnh máy (SAU khi mua phiếu). Việc làm TRƯỚC (先に): mua phiếu lệ phí 1.000 yên ở máy.', [
      ['ナレーター', 'ja-nu', '{大学|だいがく}の{学生課|がくせいか}で、{女|おんな}の{学生|がくせい}と{職員|しょくいん}が{話|はな}しています。{女|おんな}の{学生|がくせい}はこのあとまず{何|なに}をしますか。', 'Daigaku no gakuseika de, onna no gakusei to shokuin ga hanashite imasu. Onna no gakusei wa kono ato mazu nani o shimasu ka.', 'Ở phòng công tác sinh viên của trường, một nữ sinh và một cán bộ đang nói chuyện. Sau đây nữ sinh sẽ làm gì trước tiên?'],
      ['アンナ', 'ja-nu', 'すみません。{学生証|がくせいしょう}をなくしてしまったんですが……。', 'Sumimasen. Gakuseishou o nakushite shimatta n desu ga…….', 'Xin lỗi, em lỡ làm mất thẻ sinh viên…'],
      ['{職員|しょくいん}', 'ja-nam', '{再発行|さいはっこう}ですね。では、この{申請書|しんせいしょ}に{記入|きにゅう}して、{写真|しゃしん}を{一枚|いちまい}{貼|は}ってください。', 'Saihakkou desu ne. Dewa, kono shinseisho ni kinyuu shite, shashin o ichimai hatte kudasai.', 'Cấp lại nhỉ. Vậy em điền vào đơn này và dán một tấm ảnh.'],
      ['アンナ', 'ja-nu', '{写真|しゃしん}は、{今日|きょう}{持|も}ってきました。', 'Shashin wa, kyou motte kimashita.', 'Ảnh thì hôm nay em mang theo rồi ạ.'],
      ['{職員|しょくいん}', 'ja-nam', 'それはよかった。それから、{再発行|さいはっこう}には{手数料|てすうりょう}が{千円|せんえん}かかります。あちらの{機械|きかい}で、{先|さき}に{千円|せんえん}の{券|けん}を{買|か}ってきてください。その{券|けん}を{申請書|しんせいしょ}に{貼|は}りますので。', 'Sore wa yokatta. Sore kara, saihakkou ni wa tesuuryou ga sen en kakarimasu. Achira no kikai de, saki ni sen en no ken o katte kite kudasai. Sono ken o shinseisho ni harimasu node.', 'Tốt quá. Còn nữa, cấp lại mất phí 1.000 yên. Em ra cái máy đằng kia mua trước phiếu 1.000 yên nhé. Phiếu đó sẽ dán vào đơn.'],
      ['アンナ', 'ja-nu', '{券|けん}ですね。{身分証明書|みぶんしょうめいしょ}も{要|い}りますか。', 'Ken desu ne. Mibun shoumeisho mo irimasu ka.', 'Phiếu nhỉ. Có cần giấy tờ tuỳ thân không ạ?'],
      ['{職員|しょくいん}', 'ja-nam', '{在留|ざいりゅう}カードはお{持|も}ちですか。', 'Zairyuu kaado wa omochi desu ka.', 'Em có mang thẻ cư trú không?'],
      ['アンナ', 'ja-nu', 'はい、あります。', 'Hai, arimasu.', 'Vâng, có ạ.'],
      ['{職員|しょくいん}', 'ja-nam', 'じゃあ、それを{申請書|しんせいしょ}と{一緒|いっしょ}に{出|だ}してください。{書|か}くのは、{機械|きかい}の{横|よこ}の{机|つくえ}でもできますよ。', 'Jaa, sore o shinseisho to issho ni dashite kudasai. Kaku no wa, kikai no yoko no tsukue demo dekimasu yo.', 'Vậy em nộp cái đó cùng với đơn. Viết đơn thì ngồi ở bàn cạnh cái máy cũng được.'],
      ['アンナ', 'ja-nu', 'わかりました。じゃあ、まず{券|けん}を{買|か}って、それから{向|む}こうで{書|か}きます。', 'Wakarimashita. Jaa, mazu ken o katte, sore kara mukou de kakimasu.', 'Em hiểu rồi. Vậy trước tiên em mua phiếu, rồi viết ở đằng kia.'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{学生|がくせい}はこのあとまず{何|なに}をしますか。', 'Onna no gakusei wa kono ato mazu nani o shimasu ka.', 'Sau đây nữ sinh sẽ làm gì trước tiên?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-ng-1-q',
      title: 'Bài 1 — chọn đáp án',
      items: [
        { q: '{女|おんな}の{学生|がくせい}はこのあとまず{何|なに}をしますか。', options: ['{写真|しゃしん}を{撮|と}りに{行|い}く', '{申請書|しんせいしょ}に{記入|きにゅう}する', '{機械|きかい}で{手数料|てすうりょう}の{券|けん}を{買|か}う', '{在留|ざいりゅう}カードを{見|み}せる'], correct: 2, why: 'Ảnh: **{写真|しゃしん}は{持|も}ってきました** (đã có) → loại 1. Thẻ cư trú: nộp **cùng đơn** (sau) → loại 4. Đơn: viết **sau** khi mua phiếu → loại 2. Câu then chốt: **「あちらの{機械|きかい}で、{先|さき}に{千円|せんえん}の{券|けん}を{買|か}ってきてください」**〔Achira no kikai de, saki ni sen en no ken o katte kite kudasai — Em ra máy đằng kia mua trước phiếu 1.000 yên〕 + câu chốt của chính cô: **まず{券|けん}を{買|か}って**.' },
        { q: '{学生証|がくせいしょう}の{再発行|さいはっこう}に{必要|ひつよう}なものはどれですか。', options: ['{写真|しゃしん}だけ', '{写真|しゃしん}と{千円|せんえん}の{券|けん}と{在留|ざいりゅう}カード', '{千円|せんえん}と{古|ふる}い{学生証|がくせいしょう}', '{在留|ざいりゅう}カードだけ'], correct: 1, why: 'Ba thứ: **{写真|しゃしん}を{一枚|いちまい}{貼|は}って** + **{千円|せんえん}の{券|けん}** + **{在留|ざいりゅう}カード…{申請書|しんせいしょ}と{一緒|いっしょ}に{出|だ}して**. 〔Shashin, sen en no ken, zairyuu kaado.〕 Thẻ cũ đã mất nên 3 vô lý.' },
      ],
    },

    /* ── 2 ── */
    { t: 'h', text: 'Bài 2 — 問題1 課題理解: ở さくらシステム — chuẩn bị buổi gặp khách' },
    NG('b39-ng-2', '{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか', 'Dạng 課題理解 — phòng họp: もう取っといた (đã xong); photo: 鈴木さんがやってくれてる (người khác làm); máy chiếu: 明日の朝でいい (để sau); trà: ついでに, 帰りに (sau). Việc làm TRƯỚC (それより、先に): email xác nhận giờ cho anh 田村.', [
      ['ナレーター', 'ja-nu', '{会社|かいしゃ}で、{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}が{話|はな}しています。{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Kaisha de, otoko no hito to onna no hito ga hanashite imasu. Onna no hito wa kono ato mazu nani o shimasu ka.', 'Ở công ty, một người đàn ông và một người phụ nữ đang nói chuyện. Sau đây người phụ nữ sẽ làm gì trước tiên?'],
      ['{森課長|もりかちょう}', 'ja-nam', 'ワンさん、{明日|あした}の{東京商事|とうきょうしょうじ}さんとの{打|う}ち{合|あ}わせなんだけど、{準備|じゅんび}、{手伝|てつだ}ってもらえる？', 'Wan-san, ashita no Toukyou Shouji-san to no uchiawase na n da kedo, junbi, tetsudatte moraeru?', 'Wan này, buổi họp với công ty Tokyo Shoji ngày mai ấy, em giúp anh chuẩn bị được không?'],
      ['ワン', 'ja-nu', 'はい。{会議室|かいぎしつ}の{予約|よやく}をしましょうか。', 'Hai. Kaigishitsu no yoyaku o shimashou ka.', 'Vâng. Em đặt phòng họp nhé?'],
      ['{森課長|もりかちょう}', 'ja-nam', 'ああ、{会議室|かいぎしつ}はもう{取|と}っといたから{大丈夫|だいじょうぶ}。{資料|しりょう}のコピーも、{鈴木|すずき}さんがやってくれてる。', 'Aa, kaigishitsu wa mou tottoita kara daijoubu. Shiryou no kopii mo, Suzuki-san ga yatte kureteru.', 'À, phòng họp anh đặt sẵn rồi nên không sao. Photo tài liệu thì chị Suzuki đang làm giúp rồi.'],
      ['ワン', 'ja-nu', 'じゃあ、プロジェクターの{確認|かくにん}をしておきます。', 'Jaa, purojekutaa no kakunin o shite okimasu.', 'Vậy em kiểm tra máy chiếu trước nhé.'],
      ['{森課長|もりかちょう}', 'ja-nam', 'プロジェクターは{明日|あした}の{朝|あさ}でいいよ。それより、{先|さき}に{田村|たむら}さんにメールで、{時間|じかん}の{確認|かくにん}をしといてくれる？ {十時|じゅうじ}からで{変|か}わりないかどうか。', 'Purojekutaa wa ashita no asa de ii yo. Sore yori, saki ni Tamura-san ni meeru de, jikan no kakunin o shitoite kureru? Juuji kara de kawari nai ka dou ka.', 'Máy chiếu để sáng mai cũng được. Quan trọng hơn, em gửi email cho anh Tamura xác nhận giờ trước giúp anh nhé? Xem có vẫn là 10 giờ không.'],
      ['ワン', 'ja-nu', 'はい、わかりました。', 'Hai, wakarimashita.', 'Vâng, em hiểu rồi.'],
      ['{森課長|もりかちょう}', 'ja-nam', 'あ、それから、ついでに{帰|かえ}りにお{茶|ちゃ}を{買|か}ってきてくれると{助|たす}かるな。お{客様|きゃくさま}の{分|ぶん}。', 'A, sore kara, tsuide ni kaeri ni ocha o katte kite kureru to tasukaru na. Okyakusama no bun.', 'À, còn nữa, tiện lúc về em mua giúp trà thì tốt quá. Phần cho khách.'],
      ['ワン', 'ja-nu', 'お{茶|ちゃ}ですね。わかりました。じゃあ、すぐメールを{送|おく}ります。', 'Ocha desu ne. Wakarimashita. Jaa, sugu meeru o okurimasu.', 'Trà nhỉ. Em hiểu rồi. Vậy em gửi email ngay ạ.'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Onna no hito wa kono ato mazu nani o shimasu ka.', 'Sau đây người phụ nữ sẽ làm gì trước tiên?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-ng-2-q',
      title: 'Bài 2 — chọn đáp án',
      items: [
        { q: '{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', options: ['{会議室|かいぎしつ}を{予約|よやく}する', '{資料|しりょう}をコピーする', 'プロジェクターを{確認|かくにん}する', '{田村|たむら}さんにメールを{送|おく}る'], correct: 3, why: '**もう{取|と}っといた** (= 取っておいた, đã xong) → loại 1. **{鈴木|すずき}さんがやってくれてる** (người khác) → loại 2. **{明日|あした}の{朝|あさ}でいい** (để sau) → loại 3. Câu then chốt: **「それより、{先|さき}に{田村|たむら}さんにメールで、{時間|じかん}の{確認|かくにん}をしといてくれる？」**〔Sore yori, saki ni Tamura-san ni meeru de, jikan no kakunin o shitoite kureru? — Quan trọng hơn, gửi email xác nhận giờ cho anh Tamura trước nhé?〕. Trà mua **ついでに{帰|かえ}りに** — sau.' },
        { q: '「{会議室|かいぎしつ}はもう{取|と}っといた」はどういう{意味|いみ}ですか。', options: ['{会議室|かいぎしつ}はもう{予約|よやく}してある', '{会議室|かいぎしつ}をこれから{予約|よやく}する', '{会議室|かいぎしつ}は{使|つか}わなくてもいい', '{会議室|かいぎしつ}を{取|と}ってほしい'], correct: 0, why: '**{取|と}っといた** = {取|と}って**おいた** (đã làm sẵn) → phòng ĐÃ được đặt. 〔Tottoita = totte oita.〕' },
      ],
    },

    /* ── 3 ── */
    { t: 'h', text: 'Bài 3 — 問題1 課題理解: ở ký túc xá 国際寮 — chuẩn bị tiệc chia tay' },
    NG('b39-ng-3', '{男|おとこ}の{人|ひと}は{何|なに}をしなければなりませんか', 'Dạng 課題理解 (có ĐỔI Ý) — đặt quán: もうしといた (đã xong); quà: 私が買っとく (người khác); thu tiền: đầu tiên nhờ, rồi やっぱり…当日、お店で (đổi ý → không cần làm bây giờ). Việc PHẢI làm: đi xin mọi người viết lời nhắn vào tấm 色紙.', [
      ['ナレーター', 'ja-nu', '{寮|りょう}で、{女|おんな}の{人|ひと}と{男|おとこ}の{人|ひと}が{話|はな}しています。{男|おとこ}の{人|ひと}は{何|なに}をしなければなりませんか。', 'Ryou de, onna no hito to otoko no hito ga hanashite imasu. Otoko no hito wa nani o shinakereba narimasen ka.', 'Ở ký túc xá, một người phụ nữ và một người đàn ông đang nói chuyện. Người đàn ông phải làm gì?'],
      ['マリヤム', 'ja-nu', 'ダニエル、{日曜日|にちようび}のアンナのお{別|わか}れ{会|かい}のことなんだけど、お{店|みせ}の{予約|よやく}はもうしといたよ。ひまわり{食堂|しょくどう}、{七時|しちじ}から。', 'Danieru, nichiyoubi no Anna no owakarekai no koto na n da kedo, omise no yoyaku wa mou shitoita yo. Himawari Shokudou, shichiji kara.', 'Daniel ơi, chuyện tiệc chia tay Anna Chủ nhật ấy, tớ đặt quán rồi nhé. Quán Himawari, từ 7 giờ.'],
      ['ダニエル', 'ja-nam', 'ありがとう。プレゼントはどうする？', 'Arigatou. Purezento wa dou suru?', 'Cảm ơn nhé. Quà thì sao?'],
      ['マリヤム', 'ja-nu', 'プレゼントは{私|わたし}が{買|か}っとく。ダニエルには、みんなのメッセージを{集|あつ}めてほしいんだ。{色紙|しきし}に{一人|ひとり}ずつ{書|か}いてもらって。', 'Purezento wa watashi ga kattoku. Danieru ni wa, minna no messeeji o atsumete hoshii n da. Shikishi ni hitori zutsu kaite moratte.', 'Quà để tớ mua. Còn cậu thì tớ muốn cậu đi gom lời nhắn của mọi người. Nhờ từng người viết vào tấm thiệp lớn.'],
      ['ダニエル', 'ja-nam', '{寄|よ}せ{書|が}きか。いいね。', 'Yosegaki ka. Ii ne.', 'Thiệp nhiều người cùng viết à. Hay đấy.'],
      ['マリヤム', 'ja-nu', 'あと、お{金|かね}も{集|あつ}めてくれる？ {一人|ひとり}{三千円|さんぜんえん}。', 'Ato, okane mo atsumete kureru? Hitori sanzen en.', 'Với lại, cậu thu tiền giúp luôn nhé? Mỗi người 3.000 yên.'],
      ['ダニエル', 'ja-nam', 'うん……。', 'Un…….', 'Ừm…'],
      ['マリヤム', 'ja-nu', 'あ、やっぱりお{金|かね}は{当日|とうじつ}、お{店|みせ}で{集|あつ}めればいいや。そのほうが{楽|らく}だし。', 'A, yappari okane wa toujitsu, omise de atsumereba ii ya. Sono hou ga raku da shi.', 'À thôi, tiền thì hôm đó thu ở quán là được. Như thế cho nhàn.'],
      ['ダニエル', 'ja-nam', 'そうだね。じゃあ、{明日|あした}から{色紙|しきし}を{持|も}って、みんなの{部屋|へや}を{回|まわ}るよ。', 'Sou da ne. Jaa, ashita kara shikishi o motte, minna no heya o mawaru yo.', 'Ừ nhỉ. Vậy từ mai tớ cầm thiệp đi một vòng các phòng.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}は{何|なに}をしなければなりませんか。', 'Otoko no hito wa nani o shinakereba narimasen ka.', 'Người đàn ông phải làm gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-ng-3-q',
      title: 'Bài 3 — chọn đáp án',
      items: [
        { q: '{男|おとこ}の{人|ひと}は{何|なに}をしなければなりませんか。', options: ['{店|みせ}に{予約|よやく}の{電話|でんわ}をする', 'プレゼントを{買|か}う', 'みんなにメッセージを{書|か}いてもらう', 'みんなからお{金|かね}を{集|あつ}める'], correct: 2, why: 'Đặt quán: **もうしといた** → loại 1. Quà: **{私|わたし}が{買|か}っとく** → loại 2. Tiền: lúc đầu nhờ, rồi **ĐỔI Ý** — **「あ、やっぱりお{金|かね}は{当日|とうじつ}、お{店|みせ}で{集|あつ}めればいいや」**〔A, yappari okane wa toujitsu, omise de atsumereba ii ya — À thôi, tiền thì hôm đó thu ở quán là được〕 → loại 4. Câu then chốt: **「ダニエルには、みんなのメッセージを{集|あつ}めてほしいんだ」**〔Danieru ni wa, minna no messeeji o atsumete hoshii n da — Tớ muốn cậu gom lời nhắn của mọi người〕.' },
      ],
    },
    {
      t: 'note',
      title: 'Từ trong bài 3',
      items: [
        '**お{別|わか}れ{会|かい}** (tiệc chia tay — ≈ {送別会|そうべつかい} Bài 35) · **{色紙|しきし}** (tấm bìa vuông để xin chữ ký, lời nhắn — N2) · **{寄|よ}せ{書|が}き** (thiệp / tấm bìa nhiều người cùng viết lời nhắn — N1, chỉ cần nghe ra) · **{当日|とうじつ}** (hôm đó — Bài 35) · **～ばいいや** (～ばいい + や: "thôi thì… là được" — văn nói, tự quyết định).',
        '⚠ **やっぱり** ở đây là **đổi ý** — mọi thứ trước nó về chuyện tiền bị huỷ. Đề rất thích đặt việc bị đổi ý thành đáp án nhiễu.',
      ],
    },

    /* ── 4 ── */
    { t: 'h', text: 'Bài 4 — 問題1 課題理解: ở thư viện — muốn mượn sách mới' },
    NG('b39-ng-4', '{男|おとこ}の{学生|がくせい}はこのあとまず{何|なに}をしますか', 'Dạng 課題理解 — mượn 3 quyển: chưa được (phải trả sách quá hạn trước); gia hạn thẻ: 今日でなくても大丈夫 (để lần sau); về lấy giấy tờ: không cần vì để lần sau. Việc làm TRƯỚC (まず): trả quyển sách quá hạn ở quầy.', [
      ['ナレーター', 'ja-nu', '{図書館|としょかん}で、{職員|しょくいん}と{男|おとこ}の{学生|がくせい}が{話|はな}しています。{男|おとこ}の{学生|がくせい}はこのあとまず{何|なに}をしますか。', 'Toshokan de, shokuin to otoko no gakusei ga hanashite imasu. Otoko no gakusei wa kono ato mazu nani o shimasu ka.', 'Ở thư viện, một nhân viên và một nam sinh đang nói chuyện. Sau đây nam sinh sẽ làm gì trước tiên?'],
      ['マルコ', 'ja-nam', 'すみません、この{三冊|さんさつ}を{借|か}りたいんですが。', 'Sumimasen, kono sansatsu o karitai n desu ga.', 'Xin lỗi, tôi muốn mượn ba quyển này.'],
      ['{職員|しょくいん}', 'ja-nu', 'はい、{利用|りよう}カードをお{願|ねが}いします。……あ、{返却日|へんきゃくび}が{過|す}ぎている{本|ほん}が{一冊|いっさつ}ありますね。{先|さき}にそちらを{返|かえ}していただかないと、{新|あたら}しくは{借|か}りられないんです。', 'Hai, riyou kaado o onegai shimasu. …… A, henkyakubi ga sugite iru hon ga issatsu arimasu ne. Saki ni sochira o kaeshite itadakanai to, atarashiku wa karirarenai n desu.', 'Vâng, cho tôi xin thẻ thư viện. … À, có một quyển đã quá hạn trả. Nếu không trả quyển đó trước thì không mượn mới được ạ.'],
      ['マルコ', 'ja-nam', 'あ、その{本|ほん}なら、{今日|きょう}かばんに{入|い}れてきました。', 'A, sono hon nara, kyou kaban ni irete kimashita.', 'À, quyển đó thì hôm nay tôi cho vào cặp mang theo rồi.'],
      ['{職員|しょくいん}', 'ja-nu', 'よかった。では、まずそちらの{返却|へんきゃく}をお{願|ねが}いします。{返却|へんきゃく}はあちらのカウンターです。', 'Yokatta. Dewa, mazu sochira no henkyaku o onegai shimasu. Henkyaku wa achira no kauntaa desu.', 'Tốt quá. Vậy trước tiên anh trả quyển đó giúp. Trả sách ở quầy đằng kia.'],
      ['マルコ', 'ja-nam', 'わかりました。それから、カードの{期限|きげん}が{来月|らいげつ}までって{書|か}いてあるんですけど……。', 'Wakarimashita. Sore kara, kaado no kigen ga raigetsu made tte kaite aru n desu kedo…….', 'Tôi hiểu rồi. Còn nữa, trên thẻ ghi hạn đến tháng sau…'],
      ['{職員|しょくいん}', 'ja-nu', 'ええ、{更新|こうしん}には{身分証明書|みぶんしょうめいしょ}が{必要|ひつよう}ですが、{今日|きょう}でなくても{大丈夫|だいじょうぶ}ですよ。{次|つぎ}にいらっしゃったときで。', 'Ee, koushin ni wa mibun shoumeisho ga hitsuyou desu ga, kyou de naku temo daijoubu desu yo. Tsugi ni irasshatta toki de.', 'Vâng, gia hạn thì cần giấy tờ tuỳ thân, nhưng không cần hôm nay đâu. Lần sau anh đến làm cũng được.'],
      ['マルコ', 'ja-nam', 'じゃあ、{更新|こうしん}は{次|つぎ}にします。', 'Jaa, koushin wa tsugi ni shimasu.', 'Vậy gia hạn để lần sau.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{学生|がくせい}はこのあとまず{何|なに}をしますか。', 'Otoko no gakusei wa kono ato mazu nani o shimasu ka.', 'Sau đây nam sinh sẽ làm gì trước tiên?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-ng-4-q',
      title: 'Bài 4 — chọn đáp án',
      items: [
        { q: '{男|おとこ}の{学生|がくせい}はこのあとまず{何|なに}をしますか。', options: ['{三冊|さんさつ}の{本|ほん}を{借|か}りる', '{返却日|へんきゃくび}が{過|す}ぎた{本|ほん}を{返|かえ}す', '{利用|りよう}カードを{更新|こうしん}する', '{身分証明書|みぶんしょうめいしょ}を{取|と}りに{帰|かえ}る'], correct: 1, why: 'Mượn 3 quyển: **{先|さき}にそちらを{返|かえ}していただかないと、{借|か}りられない** → phải trả trước, loại 1. Gia hạn: **{今日|きょう}でなくても{大丈夫|だいじょうぶ}…{次|つぎ}に** → loại 3, 4. Câu then chốt: **「では、まずそちらの{返却|へんきゃく}をお{願|ねが}いします」**〔Dewa, mazu sochira no henkyaku o onegai shimasu — Vậy trước tiên anh trả quyển đó giúp〕.' },
        { q: '「{返|かえ}していただかないと、{借|か}りられないんです」の{意味|いみ}は？', options: ['{返|かえ}さなくても{借|か}りられる', '{返|かえ}したら{借|か}りられる', '{返|かえ}してもらったので{借|か}りられる', '{返|かえ}しても{借|か}りられない'], correct: 1, why: '**～ないと、～ない** = không A thì không B ⇒ **A rồi mới B**: trả rồi mới mượn được. 〔Kaeshite itadakanai to, karirarenai.〕' },
      ],
    },

    /* ═══ 問題2 ポイント理解 ═══ */
    { t: 'h', text: '問題2 ポイント理解 — "VÌ SAO? / CÁI GÌ? / MẤY GIỜ?" (5 bài)' },
    {
      t: 'note',
      title: 'Dạng ポイント理解 — nghe gì',
      items: [
        'Câu hỏi đọc **trước**, sau đó có **khoảng 20 giây đọc 4 lựa chọn** — dùng khoảng này để gạch chân **chỗ khác nhau** giữa 4 lựa chọn (đó chính là thứ phải nghe).',
        'Câu hỏi hay gặp: **どうして～か** (vì sao) · **一番の理由は** · **何が問題ですか** · **何時に～か** · **どうすればいいですか**.',
        'Khuôn bẫy: người nói **gạt từng lý do** (それは大丈夫だった・～も渋滞してなかったし・～わけじゃない) rồi mới nói lý do thật sau **{実|じつ}は・それより・ただ・でも**. Với giờ / số: tin con số nói **sau cùng**, sau **いや・ごめん・あ、～で**.',
      ],
    },

    /* ── 5 ── */
    { t: 'h', text: 'Bài 5 — 問題2 ポイント理解: vì sao カルロス đến muộn giờ thi?' },
    NG('b39-ng-5', '{男|おとこ}の{学生|がくせい}はどうして{試験|しけん}に{遅|おく}れましたか', 'Dạng ポイント理解 — tàu dừng: đã đổi sang buýt nên それは大丈夫; buýt: 渋滞してなくて; lý do thật sau 実は: không biết phòng thi đã đổi (thông báo đính chính trên bảng tin).', [
      ['ナレーター', 'ja-nu', '{大学|だいがく}で、{女|おんな}の{学生|がくせい}と{男|おとこ}の{学生|がくせい}が{話|はな}しています。{男|おとこ}の{学生|がくせい}はどうして{試験|しけん}に{遅|おく}れましたか。', 'Daigaku de, onna no gakusei to otoko no gakusei ga hanashite imasu. Otoko no gakusei wa doushite shiken ni okuremashita ka.', 'Ở trường, một nữ sinh và một nam sinh đang nói chuyện. Vì sao nam sinh đến muộn giờ thi?'],
      ['リン', 'ja-nu', 'カルロスさん、{今朝|けさ}の{試験|しけん}、{遅|おく}れてきたでしょう。{電車|でんしゃ}が{止|と}まってたから？', 'Karurosu-san, kesa no shiken, okurete kita deshou. Densha ga tomatteta kara?', 'Carlos, sáng nay cậu đến muộn giờ thi đúng không. Vì tàu dừng à?'],
      ['カルロス', 'ja-nam', 'うん、{電車|でんしゃ}は{止|と}まってたんだけど、{駅員|えきいん}さんに{言|い}われてバスに{乗|の}ったから、それは{大丈夫|だいじょうぶ}だったんだ。バスも{渋滞|じゅうたい}してなくて、{八時半|はちじはん}には{大学|だいがく}に{着|つ}いたし。', 'Un, densha wa tomatteta n da kedo, ekiin-san ni iwarete basu ni notta kara, sore wa daijoubu datta n da. Basu mo juutai shitenakute, hachiji han ni wa daigaku ni tsuita shi.', 'Ừ, tàu thì dừng thật, nhưng tớ nghe nhân viên ga đi xe buýt nên chuyện đó không sao. Xe buýt cũng không kẹt, 8 rưỡi tớ đã đến trường rồi.'],
      ['リン', 'ja-nu', 'じゃあ、どうして？', 'Jaa, doushite?', 'Thế sao lại muộn?'],
      ['カルロス', 'ja-nam', '{実|じつ}は、{試験|しけん}の{教室|きょうしつ}が{変|か}わってたのを{知|し}らなくて。{前|まえ}の{教室|きょうしつ}で、ずっと{一人|ひとり}で{待|ま}ってたんだよ。', 'Jitsu wa, shiken no kyoushitsu ga kawatteta no o shiranakute. Mae no kyoushitsu de, zutto hitori de matteta n da yo.', 'Thật ra là tớ không biết phòng thi đã đổi. Tớ cứ ngồi chờ một mình ở phòng cũ.'],
      ['リン', 'ja-nu', 'えっ、{掲示板|けいじばん}に{訂正|ていせい}が{出|で}てたじゃん。{三〇一|さんまるいち}じゃなくて{三〇二|さんまるに}だって。', 'E, keijiban ni teisei ga deteta jan. San-maru-ichi ja nakute san-maru-ni datte.', 'Hả, trên bảng tin có đính chính rồi còn gì. Không phải 301 mà là 302.'],
      ['カルロス', 'ja-nam', 'そうなんだ……。{掲示板|けいじばん}、ちゃんと{見|み}とけばよかった。', 'Sou na n da……. Keijiban, chanto mitokeba yokatta.', 'Thế à… Giá mà tớ xem bảng tin cho kỹ.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{学生|がくせい}はどうして{試験|しけん}に{遅|おく}れましたか。', 'Otoko no gakusei wa doushite shiken ni okuremashita ka.', 'Vì sao nam sinh đến muộn giờ thi?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-ng-5-q',
      title: 'Bài 5 — chọn đáp án',
      items: [
        { q: '{男|おとこ}の{学生|がくせい}はどうして{試験|しけん}に{遅|おく}れましたか。', options: ['{電車|でんしゃ}が{止|と}まったから', 'バスが{渋滞|じゅうたい}していたから', '{教室|きょうしつ}が{変|か}わったことを{知|し}らなかったから', '{大学|だいがく}に{着|つ}くのが{遅|おそ}かったから'], correct: 2, why: 'Tàu: **それは{大丈夫|だいじょうぶ}だった** → loại 1. Buýt: **{渋滞|じゅうたい}してなくて** → loại 2. Đến trường **{八時半|はちじはん}** (sớm) → loại 4. Câu then chốt: **「{実|じつ}は、{試験|しけん}の{教室|きょうしつ}が{変|か}わってたのを{知|し}らなくて」**〔Jitsu wa, shiken no kyoushitsu ga kawatteta no o shiranakute — Thật ra là tớ không biết phòng thi đã đổi〕.' },
        { q: '{試験|しけん}の{教室|きょうしつ}は{何番|なんばん}でしたか。', options: ['{三〇一|さんまるいち}', '{三〇二|さんまるに}', '{二〇三|にまるさん}', '{三〇〇|さんまるまる}'], correct: 1, why: '**{三〇一|さんまるいち}じゃなくて{三〇二|さんまるに}だって** — A じゃなくて B → **302**. 〔San-maru-ichi ja nakute san-maru-ni.〕' },
      ],
    },

    /* ── 6 ── */
    { t: 'h', text: 'Bài 6 — 問題2 ポイント理解: ở cửa hàng giày — vì sao không trả hàng được?' },
    NG('b39-ng-6', '{男|おとこ}の{人|ひと}はどうして{靴|くつ}を{返品|へんぴん}できませんか', 'Dạng ポイント理解 — hoá đơn: có (これです); đã mang chưa: chưa một lần; hết hàng: có thể đặt về (取り寄せ). Lý do thật: hàng giảm giá (セールの商品) không nhận trả. Sau ただ: đổi cỡ thì được.', [
      ['ナレーター', 'ja-nu', '{靴|くつ}の{店|みせ}で、{男|おとこ}の{人|ひと}と{店員|てんいん}が{話|はな}しています。{男|おとこ}の{人|ひと}はどうして{靴|くつ}を{返品|へんぴん}できませんか。', 'Kutsu no mise de, otoko no hito to ten\'in ga hanashite imasu. Otoko no hito wa doushite kutsu o henpin dekimasen ka.', 'Ở cửa hàng giày, một người đàn ông và nhân viên đang nói chuyện. Vì sao người đàn ông không trả được giày?'],
      ['ナタポン', 'ja-nam', 'すみません、{昨日|きのう}ここで{買|か}った{靴|くつ}なんですが、サイズが{合|あ}わなくて……。{返品|へんぴん}できますか。', 'Sumimasen, kinou koko de katta kutsu na n desu ga, saizu ga awanakute……. Henpin dekimasu ka.', 'Xin lỗi, đôi giày tôi mua ở đây hôm qua không vừa cỡ… Tôi trả lại được không?'],
      ['{店員|てんいん}', 'ja-nu', 'レシートはお{持|も}ちですか。', 'Reshiito wa omochi desu ka.', 'Anh có mang hoá đơn không ạ?'],
      ['ナタポン', 'ja-nam', 'はい、これです。まだ{一度|いちど}もはいていません。', 'Hai, kore desu. Mada ichido mo haite imasen.', 'Vâng, đây. Tôi chưa đi lần nào.'],
      ['{店員|てんいん}', 'ja-nu', 'ありがとうございます。……{申|もう}し{訳|わけ}ございません。こちらはセールの{商品|しょうひん}ですので、{返品|へんぴん}はお{受|う}けできないんです。', 'Arigatou gozaimasu. …… Moushiwake gozaimasen. Kochira wa seeru no shouhin desu node, henpin wa ouke dekinai n desu.', 'Cảm ơn anh. … Thành thật xin lỗi. Đây là hàng giảm giá nên chúng tôi không nhận trả lại ạ.'],
      ['ナタポン', 'ja-nam', 'そうなんですか……。', 'Sou na n desu ka…….', 'Vậy à…'],
      ['{店員|てんいん}', 'ja-nu', 'ただ、{同|おな}じ{商品|しょうひん}の{別|べつ}のサイズとの{交換|こうかん}でしたら、できますよ。{今|いま}お{店|みせ}に{在庫|ざいこ}がなくても、お{取|と}り{寄|よ}せできます。', 'Tada, onaji shouhin no betsu no saizu to no koukan deshitara, dekimasu yo. Ima omise ni zaiko ga nakute mo, otoriyose dekimasu.', 'Có điều, nếu đổi sang cỡ khác của cùng mẫu thì được ạ. Dù bây giờ cửa hàng không còn hàng, chúng tôi vẫn đặt về được.'],
      ['ナタポン', 'ja-nam', 'じゃあ、{一|ひと}つ{大|おお}きいサイズに{交換|こうかん}してください。', 'Jaa, hitotsu ookii saizu ni koukan shite kudasai.', 'Vậy đổi cho tôi lên một cỡ.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}はどうして{靴|くつ}を{返品|へんぴん}できませんか。', 'Otoko no hito wa doushite kutsu o henpin dekimasen ka.', 'Vì sao người đàn ông không trả được giày?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-ng-6-q',
      title: 'Bài 6 — chọn đáp án',
      items: [
        { q: '{男|おとこ}の{人|ひと}はどうして{靴|くつ}を{返品|へんぴん}できませんか。', options: ['レシートがないから', '{一度|いちど}はいてしまったから', 'セールの{商品|しょうひん}だから', '{店|みせ}に{在庫|ざいこ}がないから'], correct: 2, why: 'Hoá đơn: **はい、これです** → loại 1. **まだ{一度|いちど}もはいていません** → loại 2. Hết hàng chỉ liên quan tới việc ĐỔI (đặt về được) → loại 4. Câu then chốt: **「こちらはセールの{商品|しょうひん}ですので、{返品|へんぴん}はお{受|う}けできないんです」**〔Kochira wa seeru no shouhin desu node, henpin wa ouke dekinai n desu — Đây là hàng giảm giá nên không nhận trả lại〕.' },
        { q: '{男|おとこ}の{人|ひと}はこのあとどうしますか。', options: ['お{金|かね}を{返|かえ}してもらう', '{大|おお}きいサイズに{交換|こうかん}してもらう', '{別|べつ}の{店|みせ}で{返品|へんぴん}する', 'レシートを{取|と}りに{帰|かえ}る'], correct: 1, why: 'Sau **ただ、～{交換|こうかん}でしたら、できますよ** → anh chọn: **{一|ひと}つ{大|おお}きいサイズに{交換|こうかん}してください**. 〔Hitotsu ookii saizu ni koukan shite kudasai.〕' },
      ],
    },

    /* ── 7 ── */
    { t: 'h', text: 'Bài 7 — 問題2 ポイント理解: tin nhắn thoại của anh 小林 — mấy giờ đi làm?' },
    NG('b39-ng-7', 'ナタポンさんは{土曜日|どようび}、{何時|なんじ}に{店|みせ}に{行|い}けばいいですか', 'Dạng ポイント理解 (giờ bị ĐỔI hai lần) — giờ cũ: 5 giờ; anh 小林 xin đến 4 giờ, rồi ごめん…4 giờ chị 山口 còn dọn → 4 giờ rưỡi; 10 giờ là giờ kết thúc.', [
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}が{留守番電話|るすばんでんわ}にメッセージを{残|のこ}しています。ナタポンさんは{土曜日|どようび}、{何時|なんじ}に{店|みせ}に{行|い}けばいいですか。', 'Otoko no hito ga rusuban denwa ni messeeji o nokoshite imasu. Natapon-san wa doyoubi, nanji ni mise ni ikeba ii desu ka.', 'Một người đàn ông để lại tin nhắn trong hộp thư thoại. Thứ Bảy Natapon nên đến quán lúc mấy giờ?'],
      ['{小林店長|こばやしてんちょう}', 'ja-nam', 'もしもし、ナタポン{君|くん}？ {小林|こばやし}です。{土曜日|どようび}のシフトのことなんだけど、{五時|ごじ}からって{言|い}ってたよね。{悪|わる}いんだけど、{四時|よじ}に{来|き}てもらえないかな。{団体|だんたい}の{予約|よやく}が{入|はい}って、{準備|じゅんび}を{早|はや}めたいんだ。……あ、ごめん、{四時|よじ}はまだ{山口|やまぐち}さんが{掃除|そうじ}してるから、{四時半|よじはん}で。{終|お}わりはいつも{通|どお}り{十時|じゅうじ}ね。もし{無理|むり}だったら、{今日中|きょうじゅう}に{電話|でんわ}ください。よろしく。', 'Moshimoshi, Natapon-kun? Kobayashi desu. Doyoubi no shifuto no koto na n da kedo, goji kara tte itteta yo ne. Warui n da kedo, yoji ni kite moraenai kana. Dantai no yoyaku ga haitte, junbi o hayametai n da. …… A, gomen, yoji wa mada Yamaguchi-san ga souji shiteru kara, yoji han de. Owari wa itsumo doori juuji ne. Moshi muri dattara, kyoujuu ni denwa kudasai. Yoroshiku.', 'A lô, Natapon à? Kobayashi đây. Chuyện ca thứ Bảy ấy, anh bảo em làm từ 5 giờ nhỉ. Ngại quá, em đến lúc 4 giờ được không? Có đoàn khách đặt nên anh muốn chuẩn bị sớm hơn. … À xin lỗi, 4 giờ chị Yamaguchi còn đang dọn, nên 4 giờ rưỡi nhé. Kết thúc vẫn 10 giờ như mọi khi. Nếu không được thì gọi cho anh trong hôm nay. Nhờ em nhé.'],
      ['ナレーター', 'ja-nu', 'ナタポンさんは{土曜日|どようび}、{何時|なんじ}に{店|みせ}に{行|い}けばいいですか。', 'Natapon-san wa doyoubi, nanji ni mise ni ikeba ii desu ka.', 'Thứ Bảy Natapon nên đến quán lúc mấy giờ?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-ng-7-q',
      title: 'Bài 7 — chọn đáp án',
      items: [
        { q: 'ナタポンさんは{土曜日|どようび}、{何時|なんじ}に{店|みせ}に{行|い}けばいいですか。', options: ['{四時|よじ}', '{四時半|よじはん}', '{五時|ごじ}', '{十時|じゅうじ}'], correct: 1, why: '5 giờ = giờ CŨ. 4 giờ = bị sửa ngay sau đó. 10 giờ = giờ KẾT THÚC. Câu then chốt: **「あ、ごめん、{四時|よじ}はまだ{山口|やまぐち}さんが{掃除|そうじ}してるから、{四時半|よじはん}で」**〔A, gomen, yoji wa mada Yamaguchi-san ga souji shiteru kara, yoji han de — À xin lỗi, 4 giờ chị Yamaguchi còn dọn nên 4 rưỡi nhé〕. Dấu hiệu đổi ý: **あ、ごめん**.' },
        { q: '{店長|てんちょう}はどうして{準備|じゅんび}を{早|はや}めたいのですか。', options: ['{山口|やまぐち}さんが{休|やす}むから', '{団体|だんたい}の{予約|よやく}が{入|はい}ったから', '{店|みせ}が{早|はや}く{閉|し}まるから', '{掃除|そうじ}が{終|お}わらないから'], correct: 1, why: '**{団体|だんたい}の{予約|よやく}が{入|はい}って、{準備|じゅんび}を{早|はや}めたいんだ** — ～て nêu lý do. 〔Dantai no yoyaku ga haitte.〕' },
      ],
    },

    /* ── 8 ── */
    { t: 'h', text: 'Bài 8 — 問題2 ポイント理解: cô 佐藤 thông báo đổi ngày đi tham quan nhà máy' },
    NG('b39-ng-8', '{工場見学|こうじょうけんがく}の{日|ひ}は、どうして{変|か}わりましたか', 'Dạng ポイント理解 — mưa: tham quan trong nhà máy nên không liên quan; xe buýt: đã đặt rồi; lý do thật sau 実は: hôm thứ Tư nhà máy kiểm tra máy móc nên không cho vào xem. Giờ và chỗ tập trung không đổi.', [
      ['ナレーター', 'ja-nu', '{大学|だいがく}の{授業|じゅぎょう}で、{先生|せんせい}が{話|はな}しています。{工場見学|こうじょうけんがく}の{日|ひ}は、どうして{変|か}わりましたか。', 'Daigaku no jugyou de, sensei ga hanashite imasu. Koujou kengaku no hi wa, doushite kawarimashita ka.', 'Trong giờ học ở trường đại học, cô giáo đang nói. Vì sao ngày đi tham quan nhà máy bị đổi?'],
      ['{佐藤先生|さとうせんせい}', 'ja-nu', '{皆|みな}さん、{来週|らいしゅう}の{水曜日|すいようび}の{工場見学|こうじょうけんがく}ですが、{金曜日|きんようび}に{変更|へんこう}になりました。{水曜日|すいようび}は{雨|あめ}の{予報|よほう}が{出|で}ていますが、{見学|けんがく}は{工場|こうじょう}の{中|なか}なので、{雨|あめ}は{関係|かんけい}ありません。バスも、もう{予約|よやく}してあります。{実|じつ}は、{工場|こうじょう}の{方|かた}から{連絡|れんらく}があって、{水曜日|すいようび}に{機械|きかい}の{点検|てんけん}をすることになったそうなんです。{点検|てんけん}の{日|ひ}は、{中|なか}を{見|み}せていただけないので、{金曜日|きんようび}にしました。{集合|しゅうごう}の{時間|じかん}と{場所|ばしょ}は{変|か}わりません。', 'Minasan, raishuu no suiyoubi no koujou kengaku desu ga, kin\'youbi ni henkou ni narimashita. Suiyoubi wa ame no yohou ga dete imasu ga, kengaku wa koujou no naka na node, ame wa kankei arimasen. Basu mo, mou yoyaku shite arimasu. Jitsu wa, koujou no kata kara renraku ga atte, suiyoubi ni kikai no tenken o suru koto ni natta sou na n desu. Tenken no hi wa, naka o misete itadakenai node, kin\'youbi ni shimashita. Shuugou no jikan to basho wa kawarimasen.', 'Các em, buổi tham quan nhà máy thứ Tư tuần sau đã đổi sang thứ Sáu. Thứ Tư có dự báo mưa, nhưng tham quan ở bên trong nhà máy nên mưa không liên quan. Xe buýt cũng đã đặt sẵn rồi. Thật ra là phía nhà máy liên lạc, nghe nói thứ Tư họ sẽ kiểm tra máy móc. Ngày kiểm tra thì họ không cho vào xem được, nên cô đổi sang thứ Sáu. Giờ và chỗ tập trung không đổi.'],
      ['ナレーター', 'ja-nu', '{工場見学|こうじょうけんがく}の{日|ひ}は、どうして{変|か}わりましたか。', 'Koujou kengaku no hi wa, doushite kawarimashita ka.', 'Vì sao ngày đi tham quan nhà máy bị đổi?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-ng-8-q',
      title: 'Bài 8 — chọn đáp án',
      items: [
        { q: '{工場見学|こうじょうけんがく}の{日|ひ}は、どうして{変|か}わりましたか。', options: ['{雨|あめ}の{予報|よほう}が{出|で}ているから', 'バスが{予約|よやく}できなかったから', '{工場|こうじょう}で{機械|きかい}の{点検|てんけん}があるから', '{集合場所|しゅうごうばしょ}が{変|か}わったから'], correct: 2, why: 'Mưa: **{雨|あめ}は{関係|かんけい}ありません** → loại 1. Xe: **もう{予約|よやく}してあります** → loại 2. Chỗ tập trung **{変|か}わりません** → loại 4. Câu then chốt: **「{実|じつ}は、…{水曜日|すいようび}に{機械|きかい}の{点検|てんけん}をすることになったそうなんです」**〔Jitsu wa, … suiyoubi ni kikai no tenken o suru koto ni natta sou na n desu — Thật ra là nghe nói thứ Tư họ sẽ kiểm tra máy móc〕.' },
      ],
    },

    /* ── 9 ── */
    { t: 'h', text: 'Bài 9 — 問題2 ポイント理解: loa nhà ga — tàu dừng vì mưa lớn' },
    NG('b39-ng-9', '{大学前駅|だいがくまええき}に{行|い}く{人|ひと}は、どうすればいいですか', 'Dạng ポイント理解 (thông báo) — chạy lại: 見込みは立っておりません (chưa biết, chờ không được); buýt: kẹt và rất đông; vé: dùng luôn được (không cần mua mới). Hướng dẫn: đổi sang tàu điện ngầm みどり線 ở lối ra số 3.', [
      ['ナレーター', 'ja-nu', '{駅|えき}でアナウンスを{聞|き}いています。{大学前駅|だいがくまええき}に{行|い}く{人|ひと}は、どうすればいいですか。', 'Eki de anaunsu o kiite imasu. Daigakumae-eki ni iku hito wa, dou sureba ii desu ka.', 'Bạn đang nghe thông báo ở ga. Người đi ga Daigakumae nên làm thế nào?'],
      ['アナウンス', 'ja-nu', 'お{客様|きゃくさま}にお{知|し}らせいたします。さくら{線|せん}は、ただいま、{大雨|おおあめ}のため、{全線|ぜんせん}で{運転|うんてん}を{見合|みあ}わせております。{運転再開|うんてんさいかい}の{見込|みこ}みは{立|た}っておりません。{大学前駅|だいがくまええき}{方面|ほうめん}へお{急|いそ}ぎのお{客様|きゃくさま}は、{地下鉄|ちかてつ}みどり{線|せん}をご{利用|りよう}ください。みどり{線|せん}へは、{三番出口|さんばんでぐち}からお{乗|の}り{換|か}えいただけます。なお、お{持|も}ちの{切符|きっぷ}は、そのままみどり{線|せん}でお{使|つか}いいただけます。{駅前|えきまえ}のバスは、{道路|どうろ}が{渋滞|じゅうたい}しているため、{大変|たいへん}{混雑|こんざつ}しております。', 'Okyakusama ni oshirase itashimasu. Sakura-sen wa, tadaima, ooame no tame, zensen de unten o miawasete orimasu. Unten saikai no mikomi wa tatte orimasen. Daigakumae-eki houmen e oisogi no okyakusama wa, chikatetsu Midori-sen o goriyou kudasai. Midori-sen e wa, sanban deguchi kara onorikae itadakemasu. Nao, omochi no kippu wa, sono mama Midori-sen de otsukai itadakemasu. Ekimae no basu wa, douro ga juutai shite iru tame, taihen konzatsu shite orimasu.', 'Xin thông báo tới quý khách. Tuyến Sakura hiện đang tạm dừng chạy trên toàn tuyến do mưa lớn. Chưa có dự kiến giờ chạy lại. Quý khách đang vội đi hướng ga Daigakumae xin dùng tàu điện ngầm tuyến Midori. Quý khách có thể chuyển sang tuyến Midori từ lối ra số 3. Ngoài ra, vé quý khách đang có dùng luôn được cho tuyến Midori. Xe buýt trước ga đang rất đông do đường kẹt xe.'],
      ['ナレーター', 'ja-nu', '{大学前駅|だいがくまええき}に{行|い}く{人|ひと}は、どうすればいいですか。', 'Daigakumae-eki ni iku hito wa, dou sureba ii desu ka.', 'Người đi ga Daigakumae nên làm thế nào?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-ng-9-q',
      title: 'Bài 9 — chọn đáp án',
      items: [
        { q: '{大学前駅|だいがくまええき}に{行|い}く{人|ひと}は、どうすればいいですか。', options: ['{運転|うんてん}が{再開|さいかい}するまで{駅|えき}で{待|ま}つ', '{地下鉄|ちかてつ}のみどり{線|せん}に{乗|の}り{換|か}える', '{駅前|えきまえ}からバスに{乗|の}る', 'みどり{線|せん}の{切符|きっぷ}を{新|あたら}しく{買|か}う'], correct: 1, why: 'Chạy lại: **{見込|みこ}みは{立|た}っておりません** (chưa biết bao giờ) → loại 1. Buýt: **{大変|たいへん}{混雑|こんざつ}** → loại 3. Vé: **そのまま…お{使|つか}いいただけます** → loại 4. Câu then chốt: **「{大学前駅|だいがくまええき}{方面|ほうめん}へお{急|いそ}ぎのお{客様|きゃくさま}は、{地下鉄|ちかてつ}みどり{線|せん}をご{利用|りよう}ください」**〔… oisogi no okyakusama wa, chikatetsu Midori-sen o goriyou kudasai — Quý khách đang vội xin dùng tàu điện ngầm tuyến Midori〕.' },
        { q: 'みどり{線|せん}へはどこから{乗|の}り{換|か}えますか。', options: ['{一番出口|いちばんでぐち}', '{三番出口|さんばんでぐち}', '{三番線|さんばんせん}', 'バス{乗|の}り{場|ば}'], correct: 1, why: '**みどり{線|せん}へは、{三番出口|さんばんでぐち}からお{乗|の}り{換|か}えいただけます**. ⚠ Lối RA số 3 (出口), không phải đường ray số 3 (番線). 〔Sanban deguchi kara.〕' },
      ],
    },
    {
      t: 'note',
      title: 'Từ trong bài 9',
      items: [
        '**{全線|ぜんせん}** (toàn tuyến) · **{見込|みこ}みは{立|た}っておりません** (chưa có dự kiến — lịch sự của {立|た}っていない) · **～{方面|ほうめん}** (hướng…, phía… — N2) · **お{急|いそ}ぎのお{客様|きゃくさま}** (quý khách đang vội) · **お{乗|の}り{換|か}えいただけます** (quý khách có thể chuyển — kính ngữ お～いただく) · **なお** (ngoài ra — Bài 38) · **{混雑|こんざつ}** (đông đúc — N2).',
        'Khuôn loa sân ga ôn lại hội thoại ①: **tuyến — lý do (～のため) — tình trạng (～ております) — dự kiến (見込み) — hướng dẫn (～をご利用ください) — bổ sung (なお)**. Câu hỏi "どうすればいいですか" → đáp án nằm ở **phần hướng dẫn**.',
      ],
    },

    /* ═══ 問題3 概要理解 ═══ */
    { t: 'h', text: '問題3 概要理解 — "Bài nói NÓI VỀ GÌ? Người nói NGHĨ GÌ?" (4 bài)' },
    {
      t: 'note',
      title: 'Dạng 概要理解 — nghe gì',
      items: [
        '**Không có câu hỏi trước, không có lựa chọn in sẵn** — chỉ nghe lời dẫn ngắn (ラジオで男の人が話しています), rồi cả bài nói, rồi mới nghe câu hỏi và 4 lựa chọn (đọc bằng tiếng).',
        'Ba loại câu hỏi: **何について話していますか** (chủ đề) · **一番言いたいことは何ですか** (ý chính) · **～についてどう思っていますか** (thái độ / ý kiến).',
        'Khuôn bài nói: **mở chủ đề** → **ví dụ / chuyện / số liệu** → **ですから・つまり・そこで** → **kết: 一番大切なのは～・～てはいかがでしょうか**. Ghi chú 2–3 từ khoá lặp lại nhiều nhất + câu kết. Thái độ: nghe **けど・まあ・どうせ・～かな**.',
      ],
    },

    /* ── 10 ── */
    { t: 'h', text: 'Bài 10 — 問題3 概要理解: chương trình radio về "người nghe giỏi"' },
    NG('b39-ng-10', '{男|おとこ}の{人|ひと}は{何|なに}について{話|はな}していますか', 'Dạng 概要理解 (chủ đề) — từ khoá lặp lại: 聞き上手 (người nghe giỏi) ×3; ba ý: 相づち · nghe đến cuối · hỏi lại chỗ không hiểu; câu kết: まずは聞き上手を目指してみては.', [
      ['ナレーター', 'ja-nu', 'ラジオで{男|おとこ}の{人|ひと}が{話|はな}しています。', 'Rajio de otoko no hito ga hanashite imasu.', 'Một người đàn ông đang nói trên radio.'],
      ['パーソナリティー', 'ja-nam', '{皆|みな}さん、「{聞|き}き{上手|じょうず}」な{人|ひと}と{話|はな}すと、なんだか{気持|きも}ちがいいですよね。では、{聞|き}き{上手|じょうず}な{人|ひと}は{何|なに}をしているのでしょうか。{番組|ばんぐみ}に{届|とど}いたお{便|たよ}りを{読|よ}むと、{三|みっ}つのことがよく{書|か}かれていました。', 'Minasan, "kikijouzu" na hito to hanasu to, nan da ka kimochi ga ii desu yo ne. Dewa, kikijouzu na hito wa nani o shite iru no deshou ka. Bangumi ni todoita otayori o yomu to, mittsu no koto ga yoku kakarete imashita.', 'Các bạn ơi, nói chuyện với người "nghe giỏi" thì cảm thấy dễ chịu sao đó nhỉ. Vậy người nghe giỏi làm gì? Đọc thư gửi đến chương trình, có ba điều được viết nhiều.'],
      ['パーソナリティー', 'ja-nam', '{一|ひと}つ{目|め}は、{相|あい}づちです。「へえ」「そうなんですか」と{言|い}ってもらうと、{話|はな}し{手|て}は{安心|あんしん}して{話|はなし}を{続|つづ}けられます。{二|ふた}つ{目|め}は、{相手|あいて}の{話|はなし}を{最後|さいご}まで{聞|き}くこと。{途中|とちゅう}で「つまり、こういうことでしょう」と{言|い}ってしまう{人|ひと}がいますが、{話|はな}し{手|て}はがっかりしてしまいます。{三|みっ}つ{目|め}は、わからないところを{聞|き}き{返|かえ}すことです。{聞|き}き{返|かえ}されると、「ちゃんと{聞|き}いてくれているんだ」とうれしくなるそうです。', 'Hitotsume wa, aizuchi desu. "Hee", "sou na n desu ka" to itte morau to, hanashite wa anshin shite hanashi o tsuzukeraremasu. Futatsume wa, aite no hanashi o saigo made kiku koto. Tochuu de "tsumari, kou iu koto deshou" to itte shimau hito ga imasu ga, hanashite wa gakkari shite shimaimasu. Mittsume wa, wakaranai tokoro o kikikaesu koto desu. Kikikaesareru to, "chanto kiite kurete iru n da" to ureshiku naru sou desu.', 'Thứ nhất là tiếng đệm. Được người kia nói "Ồ", "Thế à", người nói yên tâm nói tiếp được. Thứ hai là nghe hết câu chuyện của người kia. Có người giữa chừng đã nói "Tóm lại là thế này chứ gì", người nói sẽ thất vọng. Thứ ba là hỏi lại chỗ mình không hiểu. Nghe nói khi được hỏi lại, người nói thấy vui vì "người ta đang chịu khó nghe mình".'],
      ['パーソナリティー', 'ja-nam', '{話|はな}すのが{苦手|にがて}な{人|ひと}も、まずは{聞|き}き{上手|じょうず}を{目指|めざ}してみてはいかがでしょうか。', 'Hanasu no ga nigate na hito mo, mazu wa kikijouzu o mezashite mite wa ikaga deshou ka.', 'Người không giỏi nói thì cũng thử đặt mục tiêu trở thành người nghe giỏi trước, bạn thấy sao?'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}は{何|なに}について{話|はな}していますか。', 'Otoko no hito wa nani ni tsuite hanashite imasu ka.', 'Người đàn ông đang nói về điều gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-ng-10-q',
      title: 'Bài 10 — chọn đáp án (luyện như đề thật: che lựa chọn, nói ý chính trước)',
      items: [
        { q: '{男|おとこ}の{人|ひと}は{何|なに}について{話|はな}していますか。', options: ['{上手|じょうず}に{話|はな}すための{練習|れんしゅう}のしかた', '{聞|き}き{上手|じょうず}な{人|ひと}がしていること', 'ラジオ{番組|ばんぐみ}へのお{便|たよ}りの{書|か}き{方|かた}', '{話|はなし}を{途中|とちゅう}で{終|お}わらせる{方法|ほうほう}'], correct: 1, why: 'Từ khoá lặp lại: **{聞|き}き{上手|じょうず}**. Câu mở: **「では、{聞|き}き{上手|じょうず}な{人|ひと}は{何|なに}をしているのでしょうか」**〔Dewa, kikijouzu na hito wa nani o shite iru no deshou ka — Vậy người nghe giỏi làm gì?〕, rồi kể ba điều. 1 sai: bài nói về NGHE, không phải luyện NÓI (người không giỏi nói chỉ được nhắc ở câu kết).' },
        { q: '{男|おとこ}の{人|ひと}によると、{話|はなし}の{途中|とちゅう}で「つまり、こういうことでしょう」と{言|い}われると、{話|はな}し{手|て}はどうなりますか。', options: ['{安心|あんしん}する', 'うれしくなる', 'がっかりする', '{話|はなし}を{続|つづ}けられる'], correct: 2, why: '**{話|はな}し{手|て}はがっかりしてしまいます**〔Hanashite wa gakkari shite shimaimasu — người nói sẽ thất vọng〕. 1, 4 là tác dụng của 相づち; 2 là của 聞き返す.' },
      ],
    },

    /* ── 11 ── */
    { t: 'h', text: 'Bài 11 — 問題3 概要理解: ý kiến về quán cà phê mới trước ga' },
    NG('b39-ng-11', '{女|おんな}の{人|ひと}は{新|あたら}しいカフェについてどう{思|おも}っていますか', 'Dạng 概要理解 (thái độ) — khen: ngon, rẻ (300 yên đã gồm thuế); けど → chê: nhân viên nói nhanh, khó gọi món, luôn kín chỗ phải chờ 20 phút; kết bằng まあ、持ち帰りなら…: chỉ ổn nếu mang về.', [
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}と{男|おとこ}の{人|ひと}が、{新|あたら}しいカフェについて{話|はな}しています。', 'Onna no hito to otoko no hito ga, atarashii kafe ni tsuite hanashite imasu.', 'Một người phụ nữ và một người đàn ông đang nói về quán cà phê mới.'],
      ['ダニエル', 'ja-nam', 'リンさん、{駅前|えきまえ}の{新|あたら}しいカフェ、{行|い}ってみた？', 'Rin-san, ekimae no atarashii kafe, itte mita?', 'Rin, quán cà phê mới trước ga cậu đi thử chưa?'],
      ['リン', 'ja-nu', 'うん、{昨日|きのう}{行|い}ってきた。コーヒーはおいしかったし、{値段|ねだん}も{税込|ぜいこ}みで{三百円|さんびゃくえん}だから{安|やす}いんだけど……。', 'Un, kinou itte kita. Koohii wa oishikatta shi, nedan mo zeikomi de sanbyaku en da kara yasui n da kedo…….', 'Ừ, hôm qua tớ đi rồi. Cà phê thì ngon, giá cũng 300 yên đã gồm thuế nên rẻ, nhưng mà…'],
      ['ダニエル', 'ja-nam', 'けど？', 'Kedo?', 'Nhưng sao?'],
      ['リン', 'ja-nu', '{店員|てんいん}さんがすごく{早口|はやくち}で、{注文|ちゅうもん}するのが{大変|たいへん}だったの。それに、{店内|てんない}はいつも{満席|まんせき}で、{二十分|にじゅっぷん}も{待|ま}ったんだよね。', 'Ten\'in-san ga sugoku hayakuchi de, chuumon suru no ga taihen datta no. Sore ni, tennai wa itsumo manseki de, nijuppun mo matta n da yo ne.', 'Nhân viên nói nhanh khủng khiếp, gọi món vất vả lắm. Thêm nữa trong quán lúc nào cũng kín chỗ, tớ phải chờ những 20 phút.'],
      ['ダニエル', 'ja-nam', 'へえ、{人気|にんき}なんだ。', 'Hee, ninki na n da.', 'Ồ, đông khách thế à.'],
      ['リン', 'ja-nu', 'まあ、{持|も}ち{帰|かえ}りなら{待|ま}たなくていいから、{次|つぎ}はそうしようかな。', 'Maa, mochikaeri nara matanakute ii kara, tsugi wa sou shiyou kana.', 'Thôi, mua mang về thì khỏi chờ, lần sau chắc tớ làm thế.'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}は{新|あたら}しいカフェについてどう{思|おも}っていますか。', 'Onna no hito wa atarashii kafe ni tsuite dou omotte imasu ka.', 'Người phụ nữ nghĩ gì về quán cà phê mới?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-ng-11-q',
      title: 'Bài 11 — chọn đáp án',
      items: [
        { q: '{女|おんな}の{人|ひと}は{新|あたら}しいカフェについてどう{思|おも}っていますか。', options: ['コーヒーも{店員|てんいん}も、{全部|ぜんぶ}{気|き}に{入|い}っている', 'コーヒーは{安|やす}くておいしいが、{店|みせ}の{中|なか}で{飲|の}むのは{大変|たいへん}だ', '{値段|ねだん}が{高|たか}すぎるので、もう{行|い}かない', 'コーヒーがおいしくないので、{持|も}ち{帰|かえ}りにする'], correct: 1, why: 'Khen ở vế trước **けど**: **おいしかったし…{安|やす}いんだけど** → loại 3, 4. Chê sau けど: nhân viên **{早口|はやくち}**, **{店内|てんない}はいつも{満席|まんせき}で、{二十分|にじゅっぷん}も{待|ま}った** → loại 1. Câu kết: **「まあ、{持|も}ち{帰|かえ}りなら{待|ま}たなくていいから、{次|つぎ}はそうしようかな」**〔Maa, mochikaeri nara matanakute ii kara, tsugi wa sou shiyou kana — Thôi, mang về thì khỏi chờ, lần sau chắc làm thế〕.' },
      ],
    },

    /* ── 12 ── */
    { t: 'h', text: 'Bài 12 — 問題3 概要理解: loa phát thanh của thành phố' },
    NG('b39-ng-12', '{何|なに}についての{放送|ほうそう}ですか', 'Dạng 概要理解 (chủ đề thông báo) — từ khoá: 気温35度, 水を飲む, 熱中症に注意; người già và trẻ nhỏ; なお…: thư viện, nhà văn hoá mở đến 7 giờ để làm chỗ tránh nóng (chi tiết phụ).', [
      ['ナレーター', 'ja-nu', '{町|まち}の{放送|ほうそう}を{聞|き}いています。', 'Machi no housou o kiite imasu.', 'Bạn đang nghe loa phát thanh của khu phố.'],
      ['アナウンス', 'ja-nu', 'こちらは、みなと{市役所|しやくしょ}です。{市民|しみん}の{皆様|みなさま}にお{知|し}らせします。{本日|ほんじつ}は、{気温|きおん}が{三十五度|さんじゅうごど}を{超|こ}える{見込|みこ}みです。{外|そと}での{運動|うんどう}はなるべく{控|ひか}え、こまめに{水|みず}を{飲|の}むなど、{熱中症|ねっちゅうしょう}に{十分|じゅうぶん}ご{注意|ちゅうい}ください。{特|とく}に、お{年寄|としよ}りや{小|ちい}さいお{子様|こさま}は、{暑|あつ}さを{感|かん}じにくいことがあります。ご{家族|かぞく}や{近所|きんじょ}の{方|かた}も、{声|こえ}をかけ{合|あ}ってください。なお、{市内|しない}の{図書館|としょかん}と{公民館|こうみんかん}は、{涼|すず}しく{過|す}ごせる{場所|ばしょ}として、{夜|よる}{七時|しちじ}まで{開館|かいかん}しております。', 'Kochira wa, Minato shiyakusho desu. Shimin no minasama ni oshirase shimasu. Honjitsu wa, kion ga sanjuugodo o koeru mikomi desu. Soto de no undou wa narubeku hikae, komame ni mizu o nomu nado, necchuushou ni juubun gochuui kudasai. Toku ni, otoshiyori ya chiisai okosama wa, atsusa o kanjinikui koto ga arimasu. Gokazoku ya kinjo no kata mo, koe o kakeatte kudasai. Nao, shinai no toshokan to kouminkan wa, suzushiku sugoseru basho to shite, yoru shichiji made kaikan shite orimasu.', 'Đây là Uỷ ban thành phố Minato. Xin thông báo tới bà con. Hôm nay nhiệt độ dự kiến vượt 35 độ. Xin hạn chế vận động ngoài trời, uống nước thường xuyên…, hết sức cẩn thận với say nắng. Đặc biệt, người già và trẻ nhỏ có khi khó cảm nhận cái nóng. Gia đình và hàng xóm hãy hỏi han nhau. Ngoài ra, thư viện và nhà văn hoá trong thành phố mở cửa đến 7 giờ tối làm nơi tránh nóng.'],
      ['ナレーター', 'ja-nu', '{何|なに}についての{放送|ほうそう}ですか。', 'Nani ni tsuite no housou desu ka.', 'Đây là thông báo về điều gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-ng-12-q',
      title: 'Bài 12 — chọn đáp án',
      items: [
        { q: '{何|なに}についての{放送|ほうそう}ですか。', options: ['{図書館|としょかん}の{開館時間|かいかんじかん}が{変|か}わること', '{暑|あつ}い{日|ひ}に{熱中症|ねっちゅうしょう}に{気|き}をつけること', 'お{年寄|としよ}りのための{運動会|うんどうかい}', '{水道|すいどう}の{工事|こうじ}のお{知|し}らせ'], correct: 1, why: 'Từ khoá: **{三十五度|さんじゅうごど}・{水|みず}を{飲|の}む・{熱中症|ねっちゅうしょう}**. Câu then chốt: **「{熱中症|ねっちゅうしょう}に{十分|じゅうぶん}ご{注意|ちゅうい}ください」**〔Necchuushou ni juubun gochuui kudasai — Hết sức cẩn thận với say nắng〕. 1 là chi tiết phụ sau **なお** (bẫy: chi tiết đúng nhưng không phải chủ đề).' },
        { q: 'この{放送|ほうそう}によると、{図書館|としょかん}は{今日|きょう}どうなっていますか。', options: ['{休館|きゅうかん}している', '{夜|よる}{七時|しちじ}まで{開|あ}いている', '{運動|うんどう}ができる', 'お{年寄|としよ}りしか{入|はい}れない'], correct: 1, why: '**{夜|よる}{七時|しちじ}まで{開館|かいかん}しております** — chỗ mát để tránh nóng. 〔Yoru shichiji made kaikan shite orimasu.〕' },
      ],
    },

    /* ── 13 ── */
    { t: 'h', text: 'Bài 13 — 問題3 概要理解: cô 佐藤 khuyên cách làm bài nghe' },
    NG('b39-ng-13', '{先生|せんせい}が{一番|いちばん}{言|い}いたいことは{何|なん}ですか', 'Dạng 概要理解 (ý chính) — vấn đề: cố nghe hết từng chữ, gặp chữ lạ là dừng; lý do sai: bài nghe chỉ phát MỘT lần, dừng là sót; ý chính ở câu kết: bỏ qua chữ lạ, nắm mạch câu chuyện (誰が、何を、どうしたい) — それが一番大切.', [
      ['ナレーター', 'ja-nu', '{日本語|にほんご}の{授業|じゅぎょう}で、{先生|せんせい}が{話|はな}しています。', 'Nihongo no jugyou de, sensei ga hanashite imasu.', 'Trong giờ tiếng Nhật, cô giáo đang nói.'],
      ['{佐藤先生|さとうせんせい}', 'ja-nu', 'JLPTの{聴解|ちょうかい}の{前|まえ}になると、「{全部|ぜんぶ}の{言葉|ことば}を{聞|き}き{取|と}らなきゃ」と{思|おも}って、{一|ひと}つでもわからない{言葉|ことば}があると、そこで{止|と}まってしまう{人|ひと}がいます。でも、{試験|しけん}の{音声|おんせい}は{一回|いっかい}しか{流|なが}れません。{止|と}まっている{間|あいだ}に、{大事|だいじ}なところを{聞|き}き{逃|のが}してしまうんです。', 'JLPT no choukai no mae ni naru to, "zenbu no kotoba o kikitoranakya" to omotte, hitotsu demo wakaranai kotoba ga aru to, soko de tomatte shimau hito ga imasu. Demo, shiken no onsei wa ikkai shika nagaremasen. Tomatte iru aida ni, daiji na tokoro o kikinogashite shimau n desu.', 'Cứ sắp thi nghe JLPT là có người nghĩ "phải nghe ra hết mọi chữ", gặp dù chỉ một chữ không hiểu là dừng lại ở đó. Nhưng âm thanh của bài thi chỉ phát một lần thôi. Trong lúc mình dừng lại là sót mất chỗ quan trọng.'],
      ['{佐藤先生|さとうせんせい}', 'ja-nu', '{日本人|にほんじん}でも、{全部|ぜんぶ}の{言葉|ことば}をはっきり{聞|き}いているわけではありません。わからない{言葉|ことば}は、とりあえず{飛|と}ばして、「{誰|だれ}が、{何|なに}を、どうしたいのか」という{話|はなし}の{流|なが}れをつかむこと。それが{一番|いちばん}{大切|たいせつ}なんです。{単語|たんご}は、{試験|しけん}のあとでゆっくり{調|しら}べればいいんですよ。', 'Nihonjin demo, zenbu no kotoba o hakkiri kiite iru wake de wa arimasen. Wakaranai kotoba wa, toriaezu tobashite, "dare ga, nani o, dou shitai no ka" to iu hanashi no nagare o tsukamu koto. Sore ga ichiban taisetsu na n desu. Tango wa, shiken no ato de yukkuri shirabereba ii n desu yo.', 'Ngay cả người Nhật cũng không phải nghe rõ từng chữ một. Chữ không hiểu thì cứ tạm bỏ qua, nắm lấy mạch câu chuyện "ai, muốn làm gì, thế nào". Đó mới là điều quan trọng nhất. Từ vựng thì sau khi thi tra từ từ là được.'],
      ['ナレーター', 'ja-nu', '{先生|せんせい}が{一番|いちばん}{言|い}いたいことは{何|なん}ですか。', 'Sensei ga ichiban iitai koto wa nan desu ka.', 'Điều cô giáo muốn nói nhất là gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-ng-13-q',
      title: 'Bài 13 — chọn đáp án',
      items: [
        { q: '{先生|せんせい}が{一番|いちばん}{言|い}いたいことは{何|なん}ですか。', options: ['{試験|しけん}の{前|まえ}に、{全部|ぜんぶ}の{単語|たんご}を{覚|おぼ}えるべきだ', 'わからない{言葉|ことば}があっても、{話|はなし}の{流|なが}れをつかむことが{大切|たいせつ}だ', '{試験|しけん}の{音声|おんせい}は{二回|にかい}{聞|き}くといい', '{日本人|にほんじん}は{全部|ぜんぶ}の{言葉|ことば}を{聞|き}いている'], correct: 1, why: 'Câu kết: **「わからない{言葉|ことば}は、とりあえず{飛|と}ばして、…{話|はなし}の{流|なが}れをつかむこと。それが{一番|いちばん}{大切|たいせつ}なんです」**〔Wakaranai kotoba wa, toriaezu tobashite, … hanashi no nagare o tsukamu koto. Sore ga ichiban taisetsu na n desu — Chữ không hiểu thì tạm bỏ qua, nắm mạch câu chuyện. Đó là điều quan trọng nhất〕. 3 sai: **{一回|いっかい}しか{流|なが}れません**; 4 ngược: **～わけではありません**.' },
      ],
    },
    {
      t: 'note',
      title: 'Từ trong bài 10–13',
      items: [
        '**{聞|き}き{上手|じょうず}** (người nghe giỏi — ↔ {話|はな}し{上手|じょうず}) · **お{便|たよ}り** (thư gửi chương trình) · **がっかりする** (thất vọng) · **{目指|めざ}す** (nhắm tới — N2) · **～てはいかがでしょうか** (thử… xem sao — lời khuyên lịch sự).',
        '**{控|ひか}える** (hạn chế — N2) · **こまめに** (thường xuyên, từng chút) · **{声|こえ}をかけ{合|あ}う** (hỏi han nhau) · **{公民館|こうみんかん}** (nhà văn hoá) · **{開館|かいかん}** (mở cửa — thư viện, bảo tàng) · **{音声|おんせい}** (âm thanh, phần audio) · **{飛|と}ばす** (bỏ qua) · **{流|なが}れをつかむ** (nắm mạch).',
      ],
    },

    /* ═══ 問題4 発話表現 ═══ */
    { t: 'h', text: '問題4 発話表現 — "Trong tình huống này bạn NÓI GÌ?" (4 bài)' },
    {
      t: 'note',
      title: 'Dạng 発話表現 — nghe gì',
      items: [
        'Đề có **tranh**, mũi tên chỉ người nói. Nghe mô tả tình huống ngắn, rồi **ba câu** (chỉ đọc, không in). Chọn câu người có mũi tên nên nói.',
        'Ba câu thường khác nhau ở: **AI làm** (～てもらう／～てくれる ↔ ～てあげる・～させていただく ↔ ～していただく) · **hướng kính ngữ** (いただく ↔ 差し上げる・おっしゃる ↔ 申す) · **mức lịch sự** (với thầy ↔ với bạn) · **chức năng** (nhờ ↔ đề nghị giúp ↔ cấm).',
        'Mẹo: trước khi nghe ba câu, tự nói thử trong đầu câu mình sẽ nói. Câu nào gần nhất là đáp án.',
      ],
    },

    /* ── 14 ── */
    { t: 'h', text: 'Bài 14 — 問題4 発話表現: xin hoá đơn ghi tên công ty' },
    {
      t: 'canh',
      anh: ['man-office-worker', 'fork-and-knife-with-plate', 'receipt', 'yen-banknote'],
      caption: 'Tranh: quầy thu ngân của một nhà hàng. Một nhân viên văn phòng (có mũi tên) vừa trả tiền bữa trưa tiếp khách của công ty, tay cầm ví, nhìn nhân viên thu ngân. Công ty sẽ thanh toán lại cho anh.',
    },
    NG('b39-ng-14', '{何|なん}と{言|い}いますか', 'Dạng 発話表現 — người nói là KHÁCH, muốn NHẬN (いただく) hoá đơn có tên công ty (領収書 + 宛名). Loại: câu của nhân viên (いかがですか), câu sai hướng kính ngữ (差し上げます = mình đưa cho người khác).', [
      ['ナレーター', 'ja-nu', 'レストランで{食事|しょくじ}のお{金|かね}を{払|はら}いました。{会社|かいしゃ}にお{金|かね}を{出|だ}してもらうので、{会社|かいしゃ}の{名前|なまえ}が{書|か}いてある{紙|かみ}がほしいです。{何|なん}と{言|い}いますか。', 'Resutoran de shokuji no okane o haraimashita. Kaisha ni okane o dashite morau node, kaisha no namae ga kaite aru kami ga hoshii desu. Nan to iimasu ka.', 'Bạn vừa trả tiền bữa ăn ở nhà hàng. Công ty sẽ trả lại tiền cho bạn nên bạn muốn có tờ giấy ghi tên công ty. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、すみません、レシートはいかがですか。　2、すみません、{領収書|りょうしゅうしょ}をいただけますか。{宛名|あてな}は「さくらシステム」でお{願|ねが}いします。　3、すみません、{領収書|りょうしゅうしょ}を{差|さ}し{上|あ}げます。{宛名|あてな}は「さくらシステム」です。', 'Ichi, sumimasen, reshiito wa ikaga desu ka. Ni, sumimasen, ryoushuusho o itadakemasu ka. Atena wa "Sakura Shisutemu" de onegai shimasu. San, sumimasen, ryoushuusho o sashiagemasu. Atena wa "Sakura Shisutemu" desu.', '1. Xin lỗi, quý khách có lấy hoá đơn in không ạ? 2. Xin lỗi, cho tôi xin hoá đơn được không? Tên người nhận ghi "Sakura System". 3. Xin lỗi, tôi xin biếu hoá đơn. Tên người nhận là "Sakura System".'],
    ]),
    {
      t: 'mcq',
      id: 'b39-ng-14-q',
      title: 'Bài 14 — chọn câu đúng',
      items: [
        { q: '{会社|かいしゃ}の{名前|なまえ}が{書|か}いてある{領収書|りょうしゅうしょ}がほしい。{何|なん}と{言|い}いますか。', options: ['1', '2', '3'], correct: 1, why: 'Khách xin NHẬN → **いただけますか** + ghi tên → **{宛名|あてな}は～でお{願|ねが}いします**. Câu then chốt: **「{領収書|りょうしゅうしょ}をいただけますか。{宛名|あてな}は「さくらシステム」でお{願|ねが}いします」**〔Ryoushuusho o itadakemasu ka. Atena wa "Sakura Shisutemu" de onegai shimasu〕. 1 là câu của NHÂN VIÊN; 3 **{差|さ}し{上|あ}げます** = mình ĐƯA — ngược hướng.' },
      ],
    },

    /* ── 15 ── */
    { t: 'h', text: 'Bài 15 — 問題4 発話表現: không nghe kịp hạn nộp thầy cô vừa nói' },
    {
      t: 'canh',
      anh: ['school', 'woman-teacher', 'man-student', 'spiral-calendar'],
      caption: 'Tranh: cuối giờ học, cô giáo đang thu dọn sách. Một nam sinh (có mũi tên) chạy lên bàn giáo viên, tay cầm sổ, trang ghi "レポート締め切り：？月？日".',
    },
    NG('b39-ng-15', '{何|なん}と{言|い}いますか', 'Dạng 発話表現 — người nghe là CÔ GIÁO → kính ngữ おっしゃる; mục đích: HỎI LẠI điều đã nói. Loại: câu suồng sã với bạn (だっけ？), câu ngược vai (聞いてもいいですよ — cho phép cô hỏi).', [
      ['ナレーター', 'ja-nu', '{授業|じゅぎょう}で、{先生|せんせい}がレポートの{締|し}め{切|き}りを{言|い}いましたが、{聞|き}き{逃|のが}してしまいました。{先生|せんせい}に{聞|き}きます。{何|なん}と{言|い}いますか。', 'Jugyou de, sensei ga repooto no shimekiri o iimashita ga, kikinogashite shimaimashita. Sensei ni kikimasu. Nan to iimasu ka.', 'Trong giờ học, cô giáo đã nói hạn nộp báo cáo nhưng bạn nghe sót mất. Bạn hỏi cô. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、{先生|せんせい}、すみません。{締|し}め{切|き}りは{何日|なんにち}とおっしゃいましたか。　2、{先生|せんせい}、{締|し}め{切|き}りって{何日|なんにち}だっけ？　3、{先生|せんせい}、{締|し}め{切|き}りを{聞|き}いてもいいですよ。', 'Ichi, sensei, sumimasen. Shimekiri wa nannichi to osshaimashita ka. Ni, sensei, shimekiri tte nannichi dakke? San, sensei, shimekiri o kiite mo ii desu yo.', '1. Thưa cô, em xin lỗi. Cô nói hạn nộp là ngày mấy ạ? 2. Cô ơi, hạn nộp là ngày mấy nhỉ? (suồng sã) 3. Cô ơi, cô hỏi hạn nộp cũng được đấy.'],
    ]),
    {
      t: 'mcq',
      id: 'b39-ng-15-q',
      title: 'Bài 15 — chọn câu đúng',
      items: [
        { q: '{先生|せんせい}が{言|い}った{締|し}め{切|き}りを{聞|き}き{逃|のが}した。{何|なん}と{言|い}いますか。', options: ['1', '2', '3'], correct: 0, why: 'Hỏi lại người trên → **～とおっしゃいましたか** (kính ngữ của 言う). Câu then chốt: **「{締|し}め{切|き}りは{何日|なんにち}とおっしゃいましたか」**〔Shimekiri wa nannichi to osshaimashita ka — Cô nói hạn nộp là ngày mấy ạ?〕. 2 **だっけ？** dùng với bạn — thất lễ với cô; 3 vô nghĩa (cho phép cô hỏi).' },
      ],
    },

    /* ── 16 ── */
    { t: 'h', text: 'Bài 16 — 問題4 発話表現: nhờ bạn tiện thể mua giùm' },
    {
      t: 'canh',
      anh: ['woman-student', 'man-student', 'convenience-store', 'hot-beverage'],
      caption: 'Tranh: phòng học nhóm ở thư viện. Một nam sinh đứng dậy cầm ví, chỉ tay ra cửa: "コンビニ行ってくる". Nữ sinh (có mũi tên) đang gõ máy tính, cốc nước trên bàn đã cạn.',
    },
    NG('b39-ng-16', '{何|なん}と{言|い}いますか', 'Dạng 発話表現 — người nói NHỜ bạn (～てくれる？) mua giùm "tiện thể" (ついでに). Loại: câu ĐỀ NGHỊ giúp người khác (～てあげようか — ngược vai), câu ngăn bạn đi.', [
      ['ナレーター', 'ja-nu', '{友達|ともだち}がコンビニに{行|い}くと{言|い}っています。{自分|じぶん}の{飲|の}み{物|もの}も{買|か}ってきてほしいです。{何|なん}と{言|い}いますか。', 'Tomodachi ga konbini ni iku to itte imasu. Jibun no nomimono mo katte kite hoshii desu. Nan to iimasu ka.', 'Bạn của bạn nói sẽ ra cửa hàng tiện lợi. Bạn muốn bạn ấy mua giùm đồ uống cho mình. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、ついでにお{茶|ちゃ}、{買|か}ってきてあげようか。　2、コンビニに{行|い}かなくてもいいよ。　3、コンビニ{行|い}くなら、ついでにお{茶|ちゃ}{買|か}ってきてくれる？', 'Ichi, tsuide ni ocha, katte kite ageyou ka. Ni, konbini ni ikanakute mo ii yo. San, konbini iku nara, tsuide ni ocha katte kite kureru?', '1. Tiện tớ mua trà về cho cậu nhé? 2. Cậu không cần ra cửa hàng đâu. 3. Nếu cậu ra cửa hàng thì tiện mua giùm tớ chai trà được không?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-ng-16-q',
      title: 'Bài 16 — chọn câu đúng',
      items: [
        { q: '{友達|ともだち}にコンビニで{飲|の}み{物|もの}を{買|か}ってきてほしい。{何|なん}と{言|い}いますか。', options: ['1', '2', '3'], correct: 2, why: 'Mình NHỜ bạn → **～てくれる？** + **ついでに**. Câu then chốt: **「コンビニ{行|い}くなら、ついでにお{茶|ちゃ}{買|か}ってきてくれる？」**〔Konbini iku nara, tsuide ni ocha katte kite kureru? — Nếu cậu ra cửa hàng thì tiện mua giùm tớ trà nhé?〕. 1 **～てあげようか** = MÌNH đề nghị mua cho người khác — ngược vai; 2 ngăn bạn đi.' },
      ],
    },

    /* ── 17 ── */
    { t: 'h', text: 'Bài 17 — 問題4 発話表現: gọi điện hỏi quán còn chỗ không' },
    {
      t: 'canh',
      anh: ['mobile-phone', 'woman-student', 'fork-and-knife-with-plate', 'spiral-calendar'],
      caption: 'Tranh: một nữ sinh (có mũi tên) cầm điện thoại, trên tờ lịch khoanh tròn "土 19:00", bên cạnh vẽ bốn hình người. Bên kia đầu dây là nhân viên nhà hàng.',
    },
    NG('b39-ng-17', '{何|なん}と{言|い}いますか', 'Dạng 発話表現 — người nói là KHÁCH gọi tới, muốn HỎI còn chỗ (空いていますか) cho 4 người, 7 giờ thứ Bảy. Loại: câu của NHÂN VIÊN (お取りしましょうか), câu hỏi vô lý (満席になりましたか).', [
      ['ナレーター', 'ja-nu', 'レストランに{電話|でんわ}をしました。{土曜日|どようび}の{夜|よる}{七時|しちじ}に{四人|よにん}で{行|い}きたいです。{席|せき}があるかどうか{聞|き}きます。{何|なん}と{言|い}いますか。', 'Resutoran ni denwa o shimashita. Doyoubi no yoru shichiji ni yonin de ikitai desu. Seki ga aru ka dou ka kikimasu. Nan to iimasu ka.', 'Bạn gọi điện cho nhà hàng. Bạn muốn đến lúc 7 giờ tối thứ Bảy, 4 người. Bạn hỏi xem còn chỗ không. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、{土曜日|どようび}の{夜|よる}{七時|しちじ}に、{四人分|よにんぶん}の{席|せき}をお{取|と}りしましょうか。　2、{土曜日|どようび}の{夜|よる}{七時|しちじ}に{四人|よにん}なんですが、{席|せき}は{空|あ}いていますか。　3、{土曜日|どようび}の{夜|よる}{七時|しちじ}は、{四人|よにん}で{満席|まんせき}になりましたか。', 'Ichi, doyoubi no yoru shichiji ni, yoninbun no seki o otori shimashou ka. Ni, doyoubi no yoru shichiji ni yonin na n desu ga, seki wa aite imasu ka. San, doyoubi no yoru shichiji wa, yonin de manseki ni narimashita ka.', '1. Tôi giữ chỗ cho 4 người lúc 7 giờ tối thứ Bảy nhé? 2. Tôi muốn 4 người lúc 7 giờ tối thứ Bảy, còn chỗ trống không ạ? 3. 7 giờ tối thứ Bảy đã kín chỗ với 4 người chưa?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-ng-17-q',
      title: 'Bài 17 — chọn câu đúng',
      items: [
        { q: 'レストランに{電話|でんわ}して、{席|せき}があるかどうか{聞|き}く。{何|なん}と{言|い}いますか。', options: ['1', '2', '3'], correct: 1, why: 'Khách HỎI còn chỗ → **～なんですが、{席|せき}は{空|あ}いていますか**. Câu then chốt: **「{土曜日|どようび}の{夜|よる}{七時|しちじ}に{四人|よにん}なんですが、{席|せき}は{空|あ}いていますか」**〔Doyoubi no yoru shichiji ni yonin na n desu ga, seki wa aite imasu ka〕. 1 **お{取|と}りしましょうか** là câu của NHÂN VIÊN (khiêm nhường お～する); 3 vô lý.' },
      ],
    },

    /* ═══ 問題5 即時応答 ═══ */
    { t: 'h', text: '問題5 即時応答 — "Nghe MỘT câu, đáp ngay" (5 bộ × 3 câu)' },
    {
      t: 'note',
      title: 'Dạng 即時応答 — nghe gì',
      items: [
        'Không có gì trên giấy. Nghe **một câu ngắn** (của bạn, của sếp, của nhân viên…), rồi **ba câu đáp**. Chọn câu đáp **tự nhiên nhất**. Mỗi câu chỉ ~10 giây — quyết định ngay.',
        'Hỏi mình trước khi nghe ba câu đáp: câu vừa nghe là **hỏi / nhờ / mời / than / báo tin / xin lỗi**? Mỗi loại có kiểu đáp riêng: nhờ → nhận lời; mời → nhận hoặc từ chối vòng; than → đồng cảm / giúp; báo tin vui → chúc mừng.',
        '⚠ Bẫy kinh điển: câu đáp **lặp lại đúng từ / mẫu** của câu hỏi (よかった ↔ よかったね, 忘れちゃった ↔ 忘れといて, 快速 ↔ 快速に乗り換えます). Và bẫy **ngôi**: câu đáp nói như thể mình là người kia.',
      ],
    },

    /* ── 18 ── */
    { t: 'h', text: 'Bài 18 — 問題5 即時応答: bộ A (3 câu)' },
    NG('b39-ng-18', '{正|ただ}しい{返事|へんじ}を{選|えら}んでください（{3問|さんもん}）', 'Dạng 即時応答 — ① bạn than đã lỡ quên ví (～ちゃった) · ② sếp nhờ đọc trước (～といてくれる？) · ③ bạn hỏi lại điều đã quên (～だっけ？).', [
      ['ナレーター', 'ja-nu', '1{番|ばん}。', 'Ichiban.', 'Câu 1.'],
      ['ナタポン', 'ja-nam', 'あ、{財布|さいふ}、{家|いえ}に{忘|わす}れてきちゃった。', 'A, saifu, ie ni wasurete kichatta.', 'Ôi, tớ để quên ví ở nhà mất rồi.'],
      ['マリヤム', 'ja-nu', '1、よかったね。　2、えっ、{大丈夫|だいじょうぶ}？ {少|すこ}し{貸|か}そうか。　3、{忘|わす}れといてね。', 'Ichi, yokatta ne. Ni, e, daijoubu? Sukoshi kasou ka. San, wasuretoite ne.', '1. May quá nhỉ. 2. Ơ, có sao không? Tớ cho mượn ít nhé? 3. Cứ quên sẵn đi nhé.'],
      ['ナレーター', 'ja-nu', '2{番|ばん}。', 'Niban.', 'Câu 2.'],
      ['{森課長|もりかちょう}', 'ja-nam', 'この{資料|しりょう}、{明日|あした}までに{読|よ}んどいてくれる？', 'Kono shiryou, ashita made ni yondoite kureru?', 'Tài liệu này em đọc trước giúp anh trước ngày mai được không?'],
      ['ワン', 'ja-nu', '1、はい、{読|よ}んでおきます。　2、はい、{読|よ}んでしまいました。　3、いえ、{読|よ}まなくてもいいです。', 'Ichi, hai, yonde okimasu. Ni, hai, yonde shimaimashita. San, ie, yomanakute mo ii desu.', '1. Vâng, em sẽ đọc trước ạ. 2. Vâng, em lỡ đọc mất rồi. 3. Không, không cần đọc đâu ạ.'],
      ['ナレーター', 'ja-nu', '3{番|ばん}。', 'Sanban.', 'Câu 3.'],
      ['リン', 'ja-nu', '{明日|あした}の{補習|ほしゅう}、{何時|なんじ}からだっけ？', 'Ashita no hoshuu, nanji kara dakke?', 'Buổi học bù mai mấy giờ bắt đầu nhỉ?'],
      ['カルロス', 'ja-nam', '1、{補習|ほしゅう}しなきゃね。　2、{九時|くじ}からって{言|い}ってたよ。　3、{補習|ほしゅう}、{楽|たの}しかったね。', 'Ichi, hoshuu shinakya ne. Ni, kuji kara tte itteta yo. San, hoshuu, tanoshikatta ne.', '1. Phải học bù nhỉ. 2. Họ bảo từ 9 giờ đấy. 3. Buổi học bù vui nhỉ.'],
    ]),
    {
      t: 'mcq',
      id: 'b39-ng-18-q',
      title: 'Bài 18 — chọn câu đáp đúng',
      items: [
        { q: '1{番|ばん} — 「あ、{財布|さいふ}、{家|いえ}に{忘|わす}れてきちゃった。」', options: ['1', '2', '3'], correct: 1, why: '**～ちゃった** = đã LỠ (chuyện xấu) → đồng cảm + giúp: **えっ、{大丈夫|だいじょうぶ}？ {少|すこ}し{貸|か}そうか**〔E, daijoubu? Sukoshi kasou ka〕. 1 nhầm thành chuyện vui; 3 lặp ～とく vô nghĩa.' },
        { q: '2{番|ばん} — 「この{資料|しりょう}、{明日|あした}までに{読|よ}んどいてくれる？」', options: ['1', '2', '3'], correct: 0, why: '**{読|よ}んどいて** = {読|よ}んでおいて (đọc trước) → nhận lời: **はい、{読|よ}んでおきます**〔Hai, yonde okimasu〕. 2 nghe nhầm ～とく thành ～ちゃう; 3 từ chối lời sếp một cách kỳ quặc.' },
        { q: '3{番|ばん} — 「{明日|あした}の{補習|ほしゅう}、{何時|なんじ}からだっけ？」', options: ['1', '2', '3'], correct: 1, why: '**～だっけ？** = hỏi lại điều quên → trả lời đúng điều được hỏi: **{九時|くじ}からって{言|い}ってたよ**〔Kuji kara tte itteta yo — Họ bảo từ 9 giờ〕. 3 dùng quá khứ — buổi học bù là ngày MAI.' },
      ],
    },

    /* ── 19 ── */
    { t: 'h', text: 'Bài 19 — 問題5 即時応答: bộ B (3 câu — ở quầy, ở ga)' },
    NG('b39-ng-19', '{正|ただ}しい{返事|へんじ}を{選|えら}んでください（{3問|さんもん}）', 'Dạng 即時応答 — ① thu ngân hỏi có dùng túi không · ② nhân viên ga báo tàu nhanh không dừng ga sau · ③ lễ tân yêu cầu điền tên và ngày mong muốn.', [
      ['ナレーター', 'ja-nu', '1{番|ばん}。', 'Ichiban.', 'Câu 1.'],
      ['{店員|てんいん}', 'ja-nu', 'レジ{袋|ぶくろ}はご{利用|りよう}ですか。', 'Rejibukuro wa goriyou desu ka.', 'Quý khách có dùng túi nilon không ạ?'],
      ['ダニエル', 'ja-nam', '1、はい、ご{利用|りよう}です。　2、{袋|ふくろ}を{差|さ}し{上|あ}げます。　3、いえ、{大丈夫|だいじょうぶ}です。', 'Ichi, hai, goriyou desu. Ni, fukuro o sashiagemasu. San, ie, daijoubu desu.', '1. Vâng, tôi "quý dùng". 2. Tôi xin biếu túi. 3. Không, không cần đâu ạ.'],
      ['ナレーター', 'ja-nu', '2{番|ばん}。', 'Niban.', 'Câu 2.'],
      ['{駅員|えきいん}', 'ja-nam', 'お{客様|きゃくさま}、こちらは{快速|かいそく}なので、{次|つぎ}の{駅|えき}には{止|と}まりませんよ。', 'Okyakusama, kochira wa kaisoku na node, tsugi no eki ni wa tomarimasen yo.', 'Thưa quý khách, đây là tàu nhanh nên không dừng ở ga tiếp theo đâu ạ.'],
      ['パク', 'ja-nu', '1、えっ、そうなんですか。{各駅停車|かくえきていしゃ}はどれですか。　2、{止|と}まらなくてよかったです。　3、じゃあ、{快速|かいそく}に{乗|の}り{換|か}えます。', 'Ichi, e, sou na n desu ka. Kakueki teisha wa dore desu ka. Ni, tomaranakute yokatta desu. San, jaa, kaisoku ni norikaemasu.', '1. Ơ, vậy ạ? Tàu thường là tàu nào ạ? 2. May mà không dừng. 3. Vậy tôi đổi sang tàu nhanh.'],
      ['ナレーター', 'ja-nu', '3{番|ばん}。', 'Sanban.', 'Câu 3.'],
      ['{受付|うけつけ}', 'ja-nu', 'こちらにお{名前|なまえ}と、ご{希望|きぼう}の{日|ひ}にちをご{記入|きにゅう}ください。', 'Kochira ni onamae to, gokibou no hinichi o gokinyuu kudasai.', 'Xin ghi tên và ngày quý khách mong muốn vào đây.'],
      ['アンナ', 'ja-nu', '1、お{名前|なまえ}はアンナさんです。　2、はい。{日|ひ}にちは、{来週|らいしゅう}の{水曜日|すいようび}でもいいですか。　3、{記入|きにゅう}していただけますか。', 'Ichi, onamae wa Anna-san desu. Ni, hai. Hinichi wa, raishuu no suiyoubi demo ii desu ka. San, kinyuu shite itadakemasu ka.', '1. Quý danh là chị Anna. 2. Vâng. Ngày thì thứ Tư tuần sau có được không ạ? 3. Chị điền giúp tôi được không?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-ng-19-q',
      title: 'Bài 19 — chọn câu đáp đúng',
      items: [
        { q: '1{番|ばん} — 「レジ{袋|ぶくろ}はご{利用|りよう}ですか。」', options: ['1', '2', '3'], correct: 2, why: 'Câu đáp chuẩn ở quầy: **いえ、{大丈夫|だいじょうぶ}です**〔Ie, daijoubu desu — Không cần đâu〕 (hoặc はい、お{願|ねが}いします). 1 lặp nguyên kính ngữ ご{利用|りよう} cho chính mình — sai; 2 ngược vai.' },
        { q: '2{番|ばん} — 「こちらは{快速|かいそく}なので、{次|つぎ}の{駅|えき}には{止|と}まりませんよ。」', options: ['1', '2', '3'], correct: 0, why: 'Muốn xuống ga sau mà tàu nhanh không dừng → hỏi tàu thường: **{各駅停車|かくえきていしゃ}はどれですか**〔Kakueki teisha wa dore desu ka〕. 3 lặp từ 快速 (đang ở trên tàu nhanh rồi); 2 vô lý.' },
        { q: '3{番|ばん} — 「お{名前|なまえ}と、ご{希望|きぼう}の{日|ひ}にちをご{記入|きにゅう}ください。」', options: ['1', '2', '3'], correct: 1, why: 'Được yêu cầu điền → làm theo + hỏi lại chi tiết: **{日|ひ}にちは、{来週|らいしゅう}の{水曜日|すいようび}でもいいですか**〔Hinichi wa, raishuu no suiyoubi demo ii desu ka〕. 1 tự gọi mình bằng さん — sai; 3 nhờ lễ tân điền thay — sai việc.' },
      ],
    },

    /* ── 20 ── */
    { t: 'h', text: 'Bài 20 — 問題5 即時応答: bộ C (3 câu — mời, nhờ đổi ca, đòi đồ)' },
    NG('b39-ng-20', '{正|ただ}しい{返事|へんじ}を{選|えら}んでください（{3問|さんもん}）', 'Dạng 即時応答 — ① bạn rủ đi xem phim thứ Bảy · ② quản lý nhờ đến sớm một tiếng (ca 5 giờ) · ③ bạn nhắc chưa trả sách.', [
      ['ナレーター', 'ja-nu', '1{番|ばん}。', 'Ichiban.', 'Câu 1.'],
      ['マルコ', 'ja-nam', '{土曜日|どようび}、みんなで{映画|えいが}{行|い}くんだけど、{来|こ}ない？', 'Doyoubi, minna de eiga iku n da kedo, konai?', 'Thứ Bảy cả bọn đi xem phim, cậu đi không?'],
      ['メアリー', 'ja-nu', '1、{来|こ}ないよ。　2、{映画|えいが}、{行|い}ってよかったね。　3、{土曜日|どようび}はちょっと……。{日曜日|にちようび}ならいいんだけど。', 'Ichi, konai yo. Ni, eiga, itte yokatta ne. San, doyoubi wa chotto……. Nichiyoubi nara ii n da kedo.', '1. Không đến đâu. 2. Đi xem phim vui nhỉ. 3. Thứ Bảy thì hơi… Chủ nhật thì được.'],
      ['ナレーター', 'ja-nu', '2{番|ばん}。', 'Niban.', 'Câu 2.'],
      ['{小林店長|こばやしてんちょう}', 'ja-nam', '{悪|わる}いけど、{明日|あした}{五時|ごじ}からのシフト、{一時間|いちじかん}{早|はや}めてもらえないかな。', 'Warui kedo, ashita goji kara no shifuto, ichijikan hayamete moraenai kana.', 'Ngại quá, ca 5 giờ ngày mai em đến sớm hơn một tiếng được không?'],
      ['ナタポン', 'ja-nam', '1、わかりました。じゃあ、{四時|よじ}に{来|き}ます。　2、わかりました。じゃあ、{六時|ろくじ}に{来|き}ます。　3、{一時間|いちじかん}{遅|おく}れてすみません。', 'Ichi, wakarimashita. Jaa, yoji ni kimasu. Ni, wakarimashita. Jaa, rokuji ni kimasu. San, ichijikan okurete sumimasen.', '1. Em hiểu rồi. Vậy em đến lúc 4 giờ. 2. Em hiểu rồi. Vậy em đến lúc 6 giờ. 3. Xin lỗi vì em đến muộn một tiếng.'],
      ['ナレーター', 'ja-nu', '3{番|ばん}。', 'Sanban.', 'Câu 3.'],
      ['{山口|やまぐち}', 'ja-nu', '{先週|せんしゅう}{貸|か}した{本|ほん}、まだ{返|かえ}してもらってないんだけど……。', 'Senshuu kashita hon, mada kaeshite moratte nai n da kedo…….', 'Quyển sách tớ cho mượn tuần trước, tớ vẫn chưa được trả…'],
      ['{西川|にしかわ}', 'ja-nam', '1、{返|かえ}してもらってよかったね。　2、あっ、ごめん。{明日|あした}{必|かなら}ず{持|も}ってくるね。　3、まだ{読|よ}んでないの？', 'Ichi, kaeshite moratte yokatta ne. Ni, a, gomen. Ashita kanarazu motte kuru ne. San, mada yonde nai no?', '1. Được trả rồi, may nhỉ. 2. Ôi, xin lỗi. Mai tớ nhất định mang đến. 3. Cậu vẫn chưa đọc à?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-ng-20-q',
      title: 'Bài 20 — chọn câu đáp đúng',
      items: [
        { q: '1{番|ばん} — 「{土曜日|どようび}、みんなで{映画|えいが}{行|い}くんだけど、{来|こ}ない？」', options: ['1', '2', '3'], correct: 2, why: 'Lời MỜI (～ない？) → nhận / từ chối vòng: **{土曜日|どようび}はちょっと……。{日曜日|にちようび}ならいいんだけど**〔Doyoubi wa chotto……. Nichiyoubi nara ii n da kedo〕. 1 lặp {来|こ}ない — nghe như cãi; 2 dùng quá khứ.' },
        { q: '2{番|ばん} — 「{明日|あした}{五時|ごじ}からのシフト、{一時間|いちじかん}{早|はや}めてもらえないかな。」', options: ['1', '2', '3'], correct: 0, why: '**{早|はや}める** = đẩy SỚM: 5 giờ − 1 tiếng = **4 giờ** → **じゃあ、{四時|よじ}に{来|き}ます**〔Jaa, yoji ni kimasu〕. 2 nhầm với {遅|おく}らせる; 3 nhầm thành bị trách đến muộn.' },
        { q: '3{番|ばん} — 「{先週|せんしゅう}{貸|か}した{本|ほん}、まだ{返|かえ}してもらってないんだけど……。」', options: ['1', '2', '3'], correct: 1, why: '**～てもらってない** = CHƯA được trả + ～けど…… (nhắc khéo) → xin lỗi + hứa: **あっ、ごめん。{明日|あした}{必|かなら}ず{持|も}ってくるね**〔A, gomen. Ashita kanarazu motte kuru ne〕. 1 hiểu ngược (đã trả); 3 không đáp lời nhắc.' },
      ],
    },

    /* ── 21 ── */
    { t: 'h', text: 'Bài 21 — 問題5 即時応答: bộ D (3 câu — cô giáo, bạn bè, đồng nghiệp)' },
    NG('b39-ng-21', '{正|ただ}しい{返事|へんじ}を{選|えら}んでください（{3問|さんもん}）', 'Dạng 即時応答 — ① cô cho nộp báo cáo tuần sau (～でいいですよ) · ② bạn hỏi đã đi thử quán chưa (～てみた？) · ③ đồng nghiệp hỏi lại giờ họp (～って言ってたっけ？).', [
      ['ナレーター', 'ja-nu', '1{番|ばん}。', 'Ichiban.', 'Câu 1.'],
      ['{佐藤先生|さとうせんせい}', 'ja-nu', 'レポート、{来週|らいしゅう}でいいですよ。', 'Repooto, raishuu de ii desu yo.', 'Báo cáo tuần sau nộp cũng được đấy.'],
      ['リン', 'ja-nu', '1、{来週|らいしゅう}はちょっと……。　2、いいですね。{来週|らいしゅう}にしましょうか。　3、ありがとうございます。{助|たす}かります。', 'Ichi, raishuu wa chotto……. Ni, ii desu ne. Raishuu ni shimashou ka. San, arigatou gozaimasu. Tasukarimasu.', '1. Tuần sau thì hơi… 2. Hay đấy ạ. Mình chọn tuần sau nhé? 3. Em cảm ơn cô. Đỡ cho em quá.'],
      ['ナレーター', 'ja-nu', '2{番|ばん}。', 'Niban.', 'Câu 2.'],
      ['ダニエル', 'ja-nam', '{駅前|えきまえ}の{新|あたら}しいカフェ、{行|い}ってみた？', 'Ekimae no atarashii kafe, itte mita?', 'Quán cà phê mới trước ga cậu đi thử chưa?'],
      ['マリヤム', 'ja-nu', '1、うん、{昨日|きのう}{行|い}ってみた。ケーキがおいしかったよ。　2、うん、{行|い}ってみてくれる？　3、{行|い}かなきゃいけないの？', 'Ichi, un, kinou itte mita. Keeki ga oishikatta yo. Ni, un, itte mite kureru? San, ikanakya ikenai no?', '1. Ừ, hôm qua đi thử rồi. Bánh ngon lắm. 2. Ừ, cậu đi thử giúp tớ nhé? 3. Có phải đi không?'],
      ['ナレーター', 'ja-nu', '3{番|ばん}。', 'Sanban.', 'Câu 3.'],
      ['{鈴木|すずき}', 'ja-nu', 'ごめん、さっきの{会議|かいぎ}、{課長|かちょう}、{何時|なんじ}からって{言|い}ってたっけ？', 'Gomen, sakki no kaigi, kachou, nanji kara tte ittetakke?', 'Xin lỗi, cuộc họp vừa nãy, trưởng phòng bảo mấy giờ bắt đầu ấy nhỉ?'],
      ['ワン', 'ja-nu', '1、{会議|かいぎ}に{行|い}かなくてもいいですよ。　2、{二時半|にじはん}からっておっしゃってました。　3、{会議|かいぎ}、よかったですね。', 'Ichi, kaigi ni ikanakute mo ii desu yo. Ni, nijihan kara tte osshatte mashita. San, kaigi, yokatta desu ne.', '1. Chị không cần đi họp đâu. 2. Anh ấy nói từ 2 rưỡi ạ. 3. Cuộc họp hay chị nhỉ.'],
    ]),
    {
      t: 'mcq',
      id: 'b39-ng-21-q',
      title: 'Bài 21 — chọn câu đáp đúng',
      items: [
        { q: '1{番|ばん} — 「レポート、{来週|らいしゅう}でいいですよ。」', options: ['1', '2', '3'], correct: 2, why: 'Cô cho thêm thời gian (tin tốt cho mình) → cảm ơn: **ありがとうございます。{助|たす}かります**〔Arigatou gozaimasu. Tasukarimasu〕. 1 từ chối kỳ quặc; 2 nói như ngang hàng, như thể mình quyết định.' },
        { q: '2{番|ばん} — 「{駅前|えきまえ}の{新|あたら}しいカフェ、{行|い}ってみた？」', options: ['1', '2', '3'], correct: 0, why: '**～てみた？** = đi thử chưa → trả lời có / chưa + cảm nhận: **うん、{昨日|きのう}{行|い}ってみた。ケーキがおいしかったよ**〔Un, kinou itte mita. Keeki ga oishikatta yo〕. 2 lặp ～てみる thành lời nhờ; 3 sai chức năng.' },
        { q: '3{番|ばん} — 「さっきの{会議|かいぎ}、{課長|かちょう}、{何時|なんじ}からって{言|い}ってたっけ？」', options: ['1', '2', '3'], correct: 1, why: 'Hỏi lại lời của trưởng phòng → kể lại bằng kính ngữ: **{二時半|にじはん}からっておっしゃってました**〔Nijihan kara tte osshatte mashita — Anh ấy nói từ 2 rưỡi〕. 1, 3 không trả lời câu hỏi.' },
      ],
    },

    /* ── 22 ── */
    { t: 'h', text: 'Bài 22 — 問題5 即時応答: bộ E (3 câu — than, báo hết chỗ, báo tin vui)' },
    NG('b39-ng-22', '{正|ただ}しい{返事|へんじ}を{選|えら}んでください（{3問|さんもん}）', 'Dạng 即時応答 — ① bạn than không hiểu bài (わかんない) · ② quán báo kín chỗ · ③ bạn báo cuối cùng cũng kịp tàu cuối (なんとか～た).', [
      ['ナレーター', 'ja-nu', '1{番|ばん}。', 'Ichiban.', 'Câu 1.'],
      ['カルロス', 'ja-nam', 'この{問題|もんだい}、{全然|ぜんぜん}わかんないよ。', 'Kono mondai, zenzen wakannai yo.', 'Bài này tớ chẳng hiểu gì cả.'],
      ['リン', 'ja-nu', '1、わかってよかったね。　2、わからなくてもいいって。　3、じゃあ、{一緒|いっしょ}に{考|かんが}えようか。', 'Ichi, wakatte yokatta ne. Ni, wakaranakute mo ii tte. San, jaa, issho ni kangaeyou ka.', '1. Hiểu ra rồi, tốt quá nhỉ. 2. Người ta bảo không hiểu cũng được. 3. Thế thì mình cùng nghĩ nhé?'],
      ['ナレーター', 'ja-nu', '2{番|ばん}。', 'Niban.', 'Câu 2.'],
      ['{小林店長|こばやしてんちょう}', 'ja-nam', '{申|もう}し{訳|わけ}ございません。その{時間|じかん}はもう{満席|まんせき}なんです。', 'Moushiwake gozaimasen. Sono jikan wa mou manseki na n desu.', 'Thành thật xin lỗi. Giờ đó đã kín chỗ rồi ạ.'],
      ['マリヤム', 'ja-nu', '1、そうですか。{何時|なんじ}なら{空|あ}いていますか。　2、{満席|まんせき}でよかったです。　3、じゃあ、その{時間|じかん}にお{願|ねが}いします。', 'Ichi, sou desu ka. Nanji nara aite imasu ka. Ni, manseki de yokatta desu. San, jaa, sono jikan ni onegai shimasu.', '1. Vậy ạ. Mấy giờ thì còn chỗ ạ? 2. Kín chỗ thì may quá. 3. Vậy cho tôi đặt giờ đó.'],
      ['ナレーター', 'ja-nu', '3{番|ばん}。', 'Sanban.', 'Câu 3.'],
      ['{西川|にしかわ}', 'ja-nam', 'なんとか{終電|しゅうでん}に{間|ま}に{合|あ}ったよ。', 'Nantoka shuuden ni ma ni atta yo.', 'Cuối cùng tớ cũng kịp chuyến tàu cuối.'],
      ['パク', 'ja-nu', '1、{乗|の}り{遅|おく}れちゃったの？　2、それはよかった。{走|はし}ったの？　3、{間|ま}に{合|あ}わなくて{残念|ざんねん}だったね。', 'Ichi, noriokurechatta no? Ni, sore wa yokatta. Hashitta no? San, ma ni awanakute zannen datta ne.', '1. Cậu lỡ tàu à? 2. Thế thì tốt quá. Cậu phải chạy à? 3. Không kịp, tiếc nhỉ.'],
    ]),
    {
      t: 'mcq',
      id: 'b39-ng-22-q',
      title: 'Bài 22 — chọn câu đáp đúng',
      items: [
        { q: '1{番|ばん} — 「この{問題|もんだい}、{全然|ぜんぜん}わかんないよ。」', options: ['1', '2', '3'], correct: 2, why: '**わかんない** = わからない (than) → giúp: **じゃあ、{一緒|いっしょ}に{考|かんが}えようか**〔Jaa, issho ni kangaeyou ka〕. 1 nghe nhầm thành わかった; 2 vô căn cứ.' },
        { q: '2{番|ばん} — 「その{時間|じかん}はもう{満席|まんせき}なんです。」', options: ['1', '2', '3'], correct: 0, why: 'Hết chỗ → hỏi phương án khác: **{何時|なんじ}なら{空|あ}いていますか**〔Nanji nara aite imasu ka〕 (hội thoại ③). 2 vô lý; 3 vẫn đặt giờ đã kín.' },
        { q: '3{番|ばん} — 「なんとか{終電|しゅうでん}に{間|ま}に{合|あ}ったよ。」', options: ['1', '2', '3'], correct: 1, why: '**なんとか～た** = vất vả nhưng ĐÃ KỊP → mừng + hỏi thêm: **それはよかった。{走|はし}ったの？**〔Sore wa yokatta. Hashitta no?〕. 1, 3 hiểu ngược thành lỡ tàu.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tổng kết mục Nghe — 22 bài, dấu hiệu đáp án của từng dạng',
      head: ['Dạng', 'Bài', 'Dấu hiệu đáp án', 'Bẫy đã gặp'],
      rows: [
        ['課題理解', '1–4', 'まず・先に・それより、先に・まずそちらの + ～てください／～てくれる？', 'もう～てある・～といた · ～がやってくれてる · ～でいい · ついでに · やっぱり (đổi ý) · 今日でなくても大丈夫'],
        ['ポイント理解', '5–9', '実は・ただ・あ、ごめん、～で · ～をご利用ください', 'lý do bị gạt (それは大丈夫・関係ありません) · giờ cũ / giờ kết thúc · chi tiết đúng nhưng không được hỏi'],
        ['概要理解', '10–13', 'từ khoá lặp lại · câu kết (一番大切なのは・～てはいかがでしょうか) · vế sau けど', 'chi tiết phụ sau なお · câu bị phủ định (～わけではありません・一回しか)'],
        ['発話表現', '14–17', 'đúng vai: khách → いただけますか／空いていますか; trò → おっしゃいましたか; nhờ bạn → ～てくれる？', 'câu của người KIA (いかがですか・お取りしましょうか) · ngược hướng (差し上げます・～てあげようか) · quá suồng sã (だっけ？)'],
        ['即時応答', '18–22', 'phản ứng tự nhiên: đồng cảm, nhận lời, trả lời đúng điều hỏi, cảm ơn', 'lặp từ của câu hỏi · nhầm ～とく ↔ ～ちゃう · nhầm 早める ↔ 遅らせる · nhầm なんとか間に合った ↔ 乗り遅れた'],
      ],
    },
  ],
};

/* ═══════════════════════════ 6. ĐỌC HIỂU ═══════════════════════════ */

const DOC: Lesson = {
  id: 'b39-doc',
  kind: 'reading',
  title: 'Đọc hiểu N3 (gọn) — thông báo "Lớp luyện nghe JLPT" (短文・情報) và bài văn "Tôi từng sợ phần nghe" (中文)',
  goal: 'Đọc thông báo ~300 chữ của trường để tìm điều kiện, hạn nộp đơn, chỗ đính chính (先着順・申請・※・訂正); đọc bài văn ~550 chữ của một du học sinh kể chuyện luyện nghe để hiểu "それ" chỉ gì, vì sao người viết thay đổi cách luyện và điều người viết muốn nói nhất — đồng thời ôn lại chiến thuật nghe của bài.',
  minutes: 35,
  blocks: [
    {
      t: 'p',
      text: 'Bài 39 là bài nghe nên mục đọc **gọn** (2 bài) — nội dung bài đọc lại chính là **chiến thuật nghe**, đọc xong là ôn luôn. Bật / tắt furigana bằng nút trên trang: chữ mới của Bài 39 ({聴解|ちょうかい}・{申請|しんせい}・{訂正|ていせい}・{開催|かいさい}・{補習|ほしゅう}・{希望|きぼう}) nay đọc trần được.',
    },

    /* ── Bài 1 ── */
    { t: 'h', text: 'Bài 1 — 内容理解（短文）・情報検索: thông báo "Lớp luyện nghe JLPT N3"' },
    {
      t: 'passage',
      title: '【お{知|し}らせ】JLPT N3 {聴解対策講座|ちょうかいたいさくこうざ}（{国際交流|こくさいこうりゅう}センター）',
      intro: 'Thông báo dán ở bảng tin của trường đại học みなと大学. Đọc rồi trả lời 3 câu hỏi.',
      paras: [
        { text: '{十二月|じゅうにがつ}のJLPTに{向|む}けて、{聴解|ちょうかい}の{対策講座|たいさくこうざ}を{開催|かいさい}します。{問題|もんだい}の{形式|けいしき}ごとに、{聞|き}き{方|かた}のポイントを{練習|れんしゅう}します。' },
        { text: '{日時|にちじ}：{十一月|じゅういちがつ}の{毎週|まいしゅう}{火曜日|かようび}（{全|ぜん}{四回|よんかい}）{十八時|じゅうはちじ}～{十九時半|じゅうくじはん}　／　{場所|ばしょ}：{二号館|にごうかん}{二〇四|にまるよん}{教室|きょうしつ}　／　{対象|たいしょう}：{本学|ほんがく}の{留学生|りゅうがくせい}　／　{定員|ていいん}：{三十名|さんじゅうめい}（{先着順|せんちゃくじゅん}）　／　{参加費|さんかひ}：{無料|むりょう}' },
        { text: '{申|もう}し{込|こ}み：{参加|さんか}を{希望|きぼう}する{人|ひと}は、{十月|じゅうがつ}{三十一日|さんじゅういちにち}までに、センターの{窓口|まどぐち}で{申請書|しんせいしょ}を{出|だ}してください。メールでの{申|もう}し{込|こ}みは{受|う}け{付|つ}けません。' },
        { text: '※{一回目|いっかいめ}に{模擬試験|もぎしけん}を{行|おこな}います。イヤホンを{必|かなら}ずお{持|も}ちください。※{四回|よんかい}のうち{三回|さんかい}{以上|いじょう}{出席|しゅっせき}した{人|ひと}には、{修了証|しゅうりょうしょう}を{渡|わた}します。' },
        { text: '【{訂正|ていせい}】{先週|せんしゅう}のお{知|し}らせで「{二〇三|にまるさん}{教室|きょうしつ}」とありましたが、{正|ただ}しくは「{二〇四|にまるよん}{教室|きょうしつ}」です。お{詫|わ}びして{訂正|ていせい}いたします。' },
      ],
    },
    {
      t: 'note',
      title: 'Từ & mẫu trong thông báo',
      items: [
        '**～に{向|む}けて** (hướng tới, chuẩn bị cho — N3) · **{対策講座|たいさくこうざ}** (lớp luyện chuyên đề) · **{形式|けいしき}ごとに** (theo từng dạng — ～ごとに: mỗi…) · **{本学|ほんがく}** (trường chúng tôi — văn thông báo) · **{修了証|しゅうりょうしょう}** (giấy chứng nhận hoàn thành) · **お{詫|わ}びして{訂正|ていせい}いたします** (xin lỗi và đính chính — câu cố định).',
        'Cách đọc: câu hỏi điều kiện → tìm trong **dòng ※** và **【訂正】** — y như bài nghe: thông tin **sau cùng / được sửa** là thông tin đúng.',
      ],
    },
    {
      t: 'mcq',
      id: 'b39-doc-1',
      title: 'Bài 1 — câu hỏi',
      items: [
        { q: 'この{講座|こうざ}に{申|もう}し{込|こ}みたい{人|ひと}は、どうしなければなりませんか。', options: ['{十月|じゅうがつ}{三十一日|さんじゅういちにち}までにメールを{送|おく}る', '{十月|じゅうがつ}{三十一日|さんじゅういちにち}までに{窓口|まどぐち}で{申請書|しんせいしょ}を{出|だ}す', '{一回目|いっかいめ}の{講座|こうざ}の{日|ひ}に{申請書|しんせいしょ}を{持|も}っていく', '{参加費|さんかひ}を{払|はら}ってから{申請書|しんせいしょ}を{出|だ}す'], correct: 1, why: '**{十月|じゅうがつ}{三十一日|さんじゅういちにち}までに、センターの{窓口|まどぐち}で{申請書|しんせいしょ}を{出|だ}してください** · **メールでの{申|もう}し{込|こ}みは{受|う}け{付|つ}けません** → loại 1. **{参加費|さんかひ}：{無料|むりょう}** → loại 4.' },
        { q: '{一回目|いっかいめ}の{講座|こうざ}に{必|かなら}ず{持|も}っていくものは{何|なん}ですか。', options: ['{修了証|しゅうりょうしょう}', '{申請書|しんせいしょ}', 'イヤホン', '{模擬試験|もぎしけん}の{問題|もんだい}'], correct: 2, why: '※ **{一回目|いっかいめ}に{模擬試験|もぎしけん}を{行|おこな}います。イヤホンを{必|かなら}ずお{持|も}ちください**. {修了証|しゅうりょうしょう} là thứ được NHẬN sau khi học đủ ba buổi.' },
        { q: 'このお{知|し}らせの{内容|ないよう}と{合|あ}っているものはどれですか。', options: ['{講座|こうざ}は{二〇三|にまるさん}{教室|きょうしつ}で{行|おこな}われる', '{申|もう}し{込|こ}んだ{人|ひと}は{全員|ぜんいん}{参加|さんか}できる', '{三回|さんかい}{以上|いじょう}{出席|しゅっせき}すると{修了証|しゅうりょうしょう}がもらえる', '{日本人|にほんじん}の{学生|がくせい}も{参加|さんか}できる'], correct: 2, why: '※ **{四回|よんかい}のうち{三回|さんかい}{以上|いじょう}{出席|しゅっせき}した{人|ひと}には、{修了証|しゅうりょうしょう}を{渡|わた}します**. 1 sai — 【{訂正|ていせい}】 **{正|ただ}しくは{二〇四|にまるよん}**; 2 sai — **{定員|ていいん}{三十名|さんじゅうめい}（{先着順|せんちゃくじゅん}）**; 4 sai — **{対象|たいしょう}：{本学|ほんがく}の{留学生|りゅうがくせい}**.' },
      ],
    },

    /* ── Bài 2 ── */
    { t: 'h', text: 'Bài 2 — 内容理解（中文）: bài văn của カルロス "Tôi từng sợ phần nghe"' },
    {
      t: 'passage',
      title: '{聴解|ちょうかい}が{怖|こわ}かった{私|わたし}（カルロス）',
      intro: 'Bài văn đăng trên bản tin của trung tâm giao lưu quốc tế. Khoảng 550 chữ. Đọc rồi trả lời 4 câu hỏi.',
      paras: [
        { label: '1', text: '{私|わたし}は{日本|にほん}に{来|き}て{半年|はんとし}になるが、{来|き}たばかりのころは{聴解|ちょうかい}が{本当|ほんとう}に{怖|こわ}かった。{教科書|きょうかしょ}の{会話|かいわ}は{分|わ}かるのに、{駅|えき}のアナウンスや{店員|てんいん}さんの{言葉|ことば}は{全然|ぜんぜん}{聞|き}き{取|と}れなかったのだ。{夏|なつ}に{受|う}けたN3の{模擬試験|もぎしけん}でも、{聴解|ちょうかい}は{六十点|ろくじゅってん}{中|ちゅう}{十八点|じゅうはちてん}で、{基準点|きじゅんてん}に{届|とど}かなかった。' },
        { label: '2', text: 'そのころの{私|わたし}は、{一|ひと}つでも{知|し}らない{言葉|ことば}があると、そこで{考|かんが}え{込|こ}んでしまっていた。{考|かんが}えている{間|あいだ}に{話|はなし}はどんどん{進|すす}み、{気|き}がつくと{質問|しつもん}が{終|お}わっている。それが{何度|なんど}も{続|つづ}いた。' },
        { label: '3', text: 'そんなとき、{佐藤先生|さとうせんせい}に「{全部|ぜんぶ}{聞|き}き{取|と}ろうとしなくていい。{話|はなし}の{流|なが}れをつかみなさい」と{言|い}われた。{先生|せんせい}によると、{日本語|にほんご}の{会話|かいわ}では「てる」「とく」「ちゃう」のような{短|みじか}い{形|かたち}がよく{使|つか}われるので、{教科書|きょうかしょ}の{形|かたち}しか{知|し}らないと{聞|き}き{取|と}れないのは{当然|とうぜん}なのだそうだ。' },
        { label: '4', text: 'それから、{私|わたし}は{練習|れんしゅう}の{方法|ほうほう}を{変|か}えた。{毎朝|まいあさ}{電車|でんしゃ}の{中|なか}で、{日本語|にほんご}のラジオを{十五分|じゅうごふん}{聞|き}き、{聞|き}こえた{文|ぶん}をすぐ{後|あと}から{小|ちい}さい{声|こえ}でまねする。いわゆるシャドーイングである。また、{駅|えき}のアナウンスも{毎日|まいにち}{同|おな}じ{文|ぶん}が{流|なが}れるので、{耳|みみ}を{澄|す}まして{聞|き}くようにした。{三か月|さんかげつ}ほどで、「{間|ま}もなく」「{見合|みあ}わせ」のような{言葉|ことば}が、{意味|いみ}と{一緒|いっしょ}に{耳|みみ}に{入|はい}ってくるようになった。' },
        { label: '5', text: '{先月|せんげつ}の{模擬試験|もぎしけん}では、{聴解|ちょうかい}が{四十点|よんじゅってん}を{超|こ}えた。まだ{分|わ}からない{言葉|ことば}は{多|おお}いが、もう{怖|こわ}くはない。{聴解|ちょうかい}で{大切|たいせつ}なのは、{完璧|かんぺき}に{聞|き}き{取|と}ることではなく、{分|わ}からないところがあっても{聞|き}き{続|つづ}けることだと{思|おも}う。' },
      ],
    },
    {
      t: 'note',
      title: 'Từ & mẫu trong bài văn',
      items: [
        '**{基準点|きじゅんてん}に{届|とど}かない** (không đạt điểm liệt / điểm chuẩn — 19/60 ở N3) · **{考|かんが}え{込|こ}む** (chìm vào suy nghĩ) · **{気|き}がつくと** (khi nhận ra thì…) · **{当然|とうぜん}** (đương nhiên — N3) · **いわゆる** (cái gọi là — N2) · **{耳|みみ}を{澄|す}ます** (lắng tai nghe — N2) · **{耳|みみ}に{入|はい}ってくる** (lọt vào tai).',
        'Mẫu ôn: **～によると、～そうだ** (Bài 33 + sách) · **～ようになった** (Bài 21) · **～ではなく、～ことだ** (không phải A mà là B — ý chính hay nằm ở vế B).',
      ],
    },
    {
      t: 'mcq',
      id: 'b39-doc-2',
      title: 'Bài 2 — câu hỏi',
      items: [
        { q: '②「それが{何度|なんど}も{続|つづ}いた」とあるが、「それ」とは{何|なに}か。', options: ['{知|し}らない{言葉|ことば}を{辞書|じしょ}で{調|しら}べること', '{知|し}らない{言葉|ことば}について{考|かんが}えている{間|あいだ}に、{質問|しつもん}が{終|お}わってしまうこと', '{駅|えき}のアナウンスを{毎日|まいにち}{聞|き}くこと', '{模擬試験|もぎしけん}で{六十点|ろくじゅってん}を{取|と}ること'], correct: 1, why: '「それ」 chỉ câu ngay trước: **{考|かんが}えている{間|あいだ}に{話|はなし}はどんどん{進|すす}み、{気|き}がつくと{質問|しつもん}が{終|お}わっている** (đoạn 2). Bài 38 ⑨: こそあど chỉ nội dung NGAY TRƯỚC.' },
        { q: '{先生|せんせい}によると、{留学生|りゅうがくせい}が{会話|かいわ}を{聞|き}き{取|と}れないのはなぜか。', options: ['{日本人|にほんじん}がとても{早口|はやくち}だから', '{教科書|きょうかしょ}にない{言葉|ことば}ばかり{使|つか}われるから', '{会話|かいわ}では「てる」「とく」のような{短|みじか}い{形|かたち}がよく{使|つか}われるから', '{留学生|りゅうがくせい}が{単語|たんご}を{知|し}らないから'], correct: 2, why: 'Đoạn 3: **「てる」「とく」「ちゃう」のような{短|みじか}い{形|かたち}がよく{使|つか}われるので、{教科書|きょうかしょ}の{形|かたち}しか{知|し}らないと{聞|き}き{取|と}れないのは{当然|とうぜん}** — chính là phần ①–⑥ của mục Văn nói.' },
        { q: '{筆者|ひっしゃ}はどのように{練習|れんしゅう}の{方法|ほうほう}を{変|か}えたか。', options: ['{毎朝|まいあさ}ラジオを{聞|き}いて、{聞|き}こえた{文|ぶん}をすぐまねした', '{知|し}らない{単語|たんご}を{全部|ぜんぶ}ノートに{書|か}いた', '{電車|でんしゃ}の{中|なか}で{教科書|きょうかしょ}の{会話|かいわ}を{読|よ}んだ', '{駅員|えきいん}さんにアナウンスの{意味|いみ}を{聞|き}いた'], correct: 0, why: 'Đoạn 4: **ラジオを{十五分|じゅうごふん}{聞|き}き、{聞|き}こえた{文|ぶん}をすぐ{後|あと}から{小|ちい}さい{声|こえ}でまねする。いわゆるシャドーイング**. Thêm: chú ý nghe loa ga (không phải hỏi nhân viên).' },
        { q: '{筆者|ひっしゃ}が{一番|いちばん}{言|い}いたいことは{何|なに}か。', options: ['{聴解|ちょうかい}の{点|てん}を{上|あ}げるには、{単語|たんご}を{完璧|かんぺき}に{覚|おぼ}えるべきだ', '{聴解|ちょうかい}では、{分|わ}からないところがあっても{聞|き}き{続|つづ}けることが{大切|たいせつ}だ', '{駅|えき}のアナウンスは{簡単|かんたん}だ', '{模擬試験|もぎしけん}は{何度|なんど}も{受|う}けたほうがいい'], correct: 1, why: 'Câu kết (đoạn 5): **{大切|たいせつ}なのは、{完璧|かんぺき}に{聞|き}き{取|と}ることではなく、{分|わ}からないところがあっても{聞|き}き{続|つづ}けることだと{思|おも}う** — ý chính ở vế sau **～ではなく**.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 7. NÓI ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b39-noi',
  kind: 'speaking',
  title: 'Luyện nói — nghe rồi nhắc lại (shadowing 12 câu then chốt), hỏi lại khi không nghe kịp, tóm tắt bài nghe trong 1 phút (この話は～についての話です・一番言いたいのは～)',
  goal: 'Nói đuổi theo (shadowing) trôi chảy 12 câu then chốt của bài có dạng rút gọn, nhịp văn nói; hỏi lại / xác nhận đúng mức lịch sự khi không nghe kịp; nghe một đoạn nói rồi tóm tắt bằng 3–4 câu (chủ đề → ý chính → chi tiết → ý kiến mình); trả lời câu hỏi thi nói về việc học nghe (どうやって聴解を練習していますか・日本語の会話で難しいことは何ですか).',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Thi nói kiểu JPD (khung của bộ môn) nâng lên N3 — chủ đề Bài 39 rơi vào đâu',
      head: ['Phần', 'Làm gì', 'Bài 39 luyện'],
      rows: [
        ['Reading (đọc to)', 'Chuẩn bị 30 giây, đọc to đoạn ~150 chữ.', 'Đoạn loa nhà ga / loa cửa hàng (mục Chữ Hán, đọc đoạn) — nhịp trang trọng: ～ております・～いただけます'],
        ['Talking (hỏi đáp)', 'Trả lời câu hỏi về bản thân, có lý do / ví dụ.', '{日本語|にほんご}の{会話|かいわ}で{難|むずか}しいことは{何|なん}ですか · どうやって{聴解|ちょうかい}を{練習|れんしゅう}していますか'],
        ['Presenting / tóm tắt (N3)', 'Nghe hoặc đọc một đoạn, tóm tắt + nêu ý kiến trong 1 phút.', 'Tóm tắt bài nghe 10 (radio "người nghe giỏi") hoặc 13 (lời khuyên của cô 佐藤)'],
      ],
    },
    {
      t: 'note',
      title: 'Shadowing — 4 bước (5–10 phút mỗi ngày)',
      items: [
        '**Bước 1 — Nghe**: bấm 🔊 cả bài bên dưới 2 lần, không nhìn chữ.',
        '**Bước 2 — Nhìn và nói theo (overlapping)**: mở lời + romaji, nói CÙNG LÚC với giọng đọc.',
        '**Bước 3 — Đuổi theo (shadowing)**: không nhìn chữ, nói **ngay sau** giọng đọc khoảng nửa giây, như cái bóng. Giữ nhịp, đừng dừng lại khi vấp.',
        '**Bước 4 — Chấm**: dùng khối "Đọc to & chấm phát âm" bên dưới cho từng câu. Câu nào điểm thấp → nghe lại, chú ý âm ngắt (っ), trường âm, âm ん.',
      ],
    },
    NG('b39-noi-shadow', 'Shadowing — 12 câu then chốt của Bài 39 (nghe → nói đuổi theo)', 'Mỗi câu một dòng. Nghe một lần, rồi nói đuổi theo. Chú ý các dạng rút gọn: とい・ちゃった・ちょっと…', [
      ['ワン', 'ja-nu', 'すみません、もう{一度|いちど}お{願|ねが}いします。', 'Sumimasen, mou ichido onegai shimasu.', 'Xin lỗi, anh nói lại giúp tôi một lần nữa.'],
      ['カルロス', 'ja-nam', 'すみません、よく{聞|き}き{取|と}れなかったんですが。', 'Sumimasen, yoku kikitorenakatta n desu ga.', 'Xin lỗi, tôi nghe không rõ lắm.'],
      ['リン', 'ja-nu', '「{書|か}き{終|お}わったら」のあと、{何|なん}とおっしゃいましたか。', '"Kakiowattara" no ato, nan to osshaimashita ka.', 'Sau câu "viết xong" chị nói gì ạ?'],
      ['アンナ', 'ja-nu', 'まず{券|けん}を{買|か}って、それから{向|む}こうで{書|か}きます。', 'Mazu ken o katte, sore kara mukou de kakimasu.', 'Trước tiên tôi mua phiếu, rồi viết ở đằng kia.'],
      ['マリヤム', 'ja-nu', '{何時|なんじ}なら{空|あ}きがありますか。', 'Nanji nara aki ga arimasu ka.', 'Mấy giờ thì còn chỗ trống ạ?'],
      ['マリヤム', 'ja-nu', 'やっぱり、{日曜日|にちようび}はどうですか。', 'Yappari, nichiyoubi wa dou desu ka.', 'Thôi, Chủ nhật thì sao ạ?'],
      ['{森課長|もりかちょう}', 'ja-nam', '{会議室|かいぎしつ}はもう{取|と}っといたから{大丈夫|だいじょうぶ}。', 'Kaigishitsu wa mou tottoita kara daijoubu.', 'Phòng họp đặt sẵn rồi nên không sao.'],
      ['{森課長|もりかちょう}', 'ja-nam', 'それより、{先|さき}にメールを{送|おく}っといてくれる？', 'Sore yori, saki ni meeru o okuttoite kureru?', 'Quan trọng hơn, gửi email trước giúp anh nhé?'],
      ['ナタポン', 'ja-nam', 'あ、{財布|さいふ}、{家|いえ}に{忘|わす}れてきちゃった。', 'A, saifu, ie ni wasurete kichatta.', 'Ôi, tớ để quên ví ở nhà mất rồi.'],
      ['メアリー', 'ja-nu', '{土曜日|どようび}はちょっと……。{日曜日|にちようび}ならいいんだけど。', 'Doyoubi wa chotto……. Nichiyoubi nara ii n da kedo.', 'Thứ Bảy thì hơi… Chủ nhật thì được.'],
      ['{佐藤先生|さとうせんせい}', 'ja-nu', 'わからない{言葉|ことば}は、とりあえず{飛|と}ばしましょう。', 'Wakaranai kotoba wa, toriaezu tobashimashou.', 'Chữ không hiểu thì cứ tạm bỏ qua.'],
      ['{佐藤先生|さとうせんせい}', 'ja-nu', '{話|はなし}の{流|なが}れをつかむことが、{一番|いちばん}{大切|たいせつ}です。', 'Hanashi no nagare o tsukamu koto ga, ichiban taisetsu desu.', 'Nắm được mạch câu chuyện là quan trọng nhất.'],
    ]),
    {
      t: 'phatam',
      id: 'b39-noi-phat-am',
      title: 'Đọc to & chấm phát âm — 12 câu shadowing',
      note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Chú ý âm ngắt: と・っ・と・い・た (tottoita), お・く・っ・と・い・て (okuttoite), き・ちゃ・っ・た (kichatta); trường âm: い・ち・ど (ngắn) ↔ きょ・う (dài); ん: な・ん・じ, ま・ん・せ・き.',
      items: [
        { text: 'すみません、もう{一度|いちど}お{願|ねが}いします。', ipa: 'sumimasen, mou ichido onegai shimasu', vi: 'Xin lỗi, nói lại giúp tôi một lần nữa.' },
        { text: 'すみません、よく{聞|き}き{取|と}れなかったんですが。', ipa: 'sumimasen, yoku kikitorenakatta n desu ga', vi: 'Xin lỗi, tôi nghe không rõ lắm.' },
        { text: '「{書|か}き{終|お}わったら」のあと、{何|なん}とおっしゃいましたか。', ipa: 'kakiowattara no ato, nan to osshaimashita ka', vi: 'Sau câu "viết xong" chị nói gì ạ?' },
        { text: 'まず{券|けん}を{買|か}って、それから{向|む}こうで{書|か}きます。', ipa: 'mazu ken o katte, sore kara mukou de kakimasu', vi: 'Trước tiên mua phiếu, rồi viết ở đằng kia.' },
        { text: '{何時|なんじ}なら{空|あ}きがありますか。', ipa: 'nanji nara aki ga arimasu ka', vi: 'Mấy giờ thì còn chỗ trống ạ?' },
        { text: 'やっぱり、{日曜日|にちようび}はどうですか。', ipa: 'yappari, nichiyoubi wa dou desu ka', vi: 'Thôi, Chủ nhật thì sao ạ?' },
        { text: '{会議室|かいぎしつ}はもう{取|と}っといたから{大丈夫|だいじょうぶ}。', ipa: 'kaigishitsu wa mou tottoita kara daijoubu', vi: 'Phòng họp đặt sẵn rồi nên không sao.' },
        { text: 'それより、{先|さき}にメールを{送|おく}っといてくれる？', ipa: 'sore yori, saki ni meeru o okuttoite kureru', vi: 'Quan trọng hơn, gửi email trước giúp nhé?' },
        { text: 'あ、{財布|さいふ}、{家|いえ}に{忘|わす}れてきちゃった。', ipa: 'a, saifu, ie ni wasurete kichatta', vi: 'Ôi, để quên ví ở nhà mất rồi.' },
        { text: '{土曜日|どようび}はちょっと……。{日曜日|にちようび}ならいいんだけど。', ipa: 'doyoubi wa chotto, nichiyoubi nara ii n da kedo', vi: 'Thứ Bảy thì hơi… Chủ nhật thì được.' },
        { text: 'わからない{言葉|ことば}は、とりあえず{飛|と}ばしましょう。', ipa: 'wakaranai kotoba wa, toriaezu tobashimashou', vi: 'Chữ không hiểu thì cứ tạm bỏ qua.' },
        { text: '{話|はなし}の{流|なが}れをつかむことが、{一番|いちばん}{大切|たいせつ}です。', ipa: 'hanashi no nagare o tsukamu koto ga, ichiban taisetsu desu', vi: 'Nắm mạch câu chuyện là quan trọng nhất.' },
      ],
    },
    {
      t: 'note',
      title: 'Tóm tắt bài nghe trong 1 phút — khuôn 4 câu',
      items: [
        '**① Chủ đề**: この{話|はなし}は、～についての{話|はなし}です。／{話|はな}し{手|て}は～について{話|はな}しています。',
        '**② Ý chính**: {話|はな}し{手|て}が{一番|いちばん}{言|い}いたいのは、～ということです。',
        '**③ Chi tiết (1–2 ý)**: {例|たと}えば、～と{言|い}っていました。／{理由|りゆう}は～からだそうです。',
        '**④ Ý kiến của mình**: {私|わたし}も～と{思|おも}います。これからは～ようにしたいです。',
        '⚠ Tóm tắt **không kể lại từng câu**. Dùng thể **～と言っていました・～そうです** (truyền lại lời người khác — Bài 30) để giám khảo thấy rõ đâu là ý người nói, đâu là ý mình.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Câu trả lời mẫu — giám thị ↔ thí sinh (tóm tắt + hỏi đáp)',
      lines: [
        { who: '{試験官|しけんかん}', role: 'examiner', text: '{今|いま}{聞|き}いたラジオの{話|はなし}を、{簡単|かんたん}にまとめてください。', ro: 'Ima kiita rajio no hanashi o, kantan ni matomete kudasai.', vi: 'Hãy tóm tắt ngắn gọn câu chuyện trên radio bạn vừa nghe.' },
        { who: 'Bạn', role: 'candidate', text: 'この{話|はなし}は、「{聞|き}き{上手|じょうず}」な{人|ひと}についての{話|はなし}です。{話|はな}し{手|て}が{一番|いちばん}{言|い}いたいのは、{話|はな}すのが{苦手|にがて}でも、まず{聞|き}き{上手|じょうず}になればいいということです。{聞|き}き{上手|じょうず}な{人|ひと}は、{相|あい}づちを{打|う}って、{話|はなし}を{最後|さいご}まで{聞|き}いて、わからないところを{聞|き}き{返|かえ}すそうです。{私|わたし}も、これからは{相|あい}づちを{打|う}つようにしたいです。', ro: 'Kono hanashi wa, "kikijouzu" na hito ni tsuite no hanashi desu. Hanashite ga ichiban iitai no wa, hanasu no ga nigate demo, mazu kikijouzu ni nareba ii to iu koto desu. Kikijouzu na hito wa, aizuchi o utte, hanashi o saigo made kiite, wakaranai tokoro o kikikaesu sou desu. Watashi mo, kore kara wa aizuchi o utsu you ni shitai desu.', vi: 'Đây là câu chuyện về người "nghe giỏi". Điều người nói muốn nói nhất là dù không giỏi nói thì trước hết cứ trở thành người nghe giỏi là được. Nghe nói người nghe giỏi thì chêm tiếng đệm, nghe đến cuối và hỏi lại chỗ không hiểu. Tôi cũng muốn từ nay sẽ chêm tiếng đệm.' },
        { who: '{試験官|しけんかん}', role: 'examiner', text: '{日本語|にほんご}の{会話|かいわ}で、{難|むずか}しいことは{何|なん}ですか。', ro: 'Nihongo no kaiwa de, muzukashii koto wa nan desu ka.', vi: 'Trong hội thoại tiếng Nhật, điều gì khó với bạn?' },
        { who: 'Bạn', role: 'candidate', text: '{友達|ともだち}{同士|どうし}の{会話|かいわ}が{難|むずか}しいです。「やっとく」や「{忘|わす}れちゃった」のような{短|みじか}い{形|かたち}が{多|おお}くて、{最初|さいしょ}は{全然|ぜんぜん}{聞|き}き{取|と}れませんでした。でも、{今|いま}は{少|すこ}しずつ{慣|な}れてきました。', ro: 'Tomodachi doushi no kaiwa ga muzukashii desu. "Yattoku" ya "wasurechatta" no you na mijikai katachi ga ookute, saisho wa zenzen kikitoremasen deshita. Demo, ima wa sukoshi zutsu narete kimashita.', vi: 'Hội thoại giữa bạn bè với nhau khó ạ. Có nhiều dạng rút gọn như "yattoku" hay "wasurechatta", lúc đầu tôi chẳng nghe ra gì. Nhưng bây giờ tôi đã quen dần.' },
        { who: '{試験官|しけんかん}', role: 'examiner', text: 'どうやって{聴解|ちょうかい}を{練習|れんしゅう}していますか。', ro: 'Dou yatte choukai o renshuu shite imasu ka.', vi: 'Bạn luyện nghe hiểu bằng cách nào?' },
        { who: 'Bạn', role: 'candidate', text: '{毎朝|まいあさ}、バスの{中|なか}で{日本語|にほんご}のポッドキャストを{十五分|じゅうごふん}{聞|き}いています。{家|いえ}では、{短|みじか}い{文|ぶん}を{聞|き}いて、すぐにまねするシャドーイングをしています。わからない{言葉|ことば}があっても、とりあえず{最後|さいご}まで{聞|き}くようにしています。', ro: 'Maiasa, basu no naka de nihongo no poddokyasuto o juugofun kiite imasu. Ie de wa, mijikai bun o kiite, sugu ni mane suru shadooingu o shite imasu. Wakaranai kotoba ga atte mo, toriaezu saigo made kiku you ni shite imasu.', vi: 'Sáng nào tôi cũng nghe podcast tiếng Nhật 15 phút trên xe buýt. Ở nhà tôi luyện shadowing — nghe câu ngắn rồi bắt chước ngay. Dù có chữ không hiểu, tôi cũng cố nghe đến hết.' },
        { who: '{試験官|しけんかん}', role: 'examiner', text: '{相手|あいて}の{話|はなし}がよく{聞|き}き{取|と}れなかったとき、どうしますか。', ro: 'Aite no hanashi ga yoku kikitorenakatta toki, dou shimasu ka.', vi: 'Khi không nghe rõ người kia nói, bạn làm gì?' },
        { who: 'Bạn', role: 'candidate', text: '{先生|せんせい}や{店員|てんいん}さんには、「すみません、もう{一度|いちど}お{願|ねが}いします」と{言|い}います。{聞|き}き{取|と}れた{言葉|ことば}をくり{返|かえ}して、「～のあと、{何|なん}とおっしゃいましたか」と{聞|き}くこともあります。{友達|ともだち}なら、「え、もう{一回|いっかい}{言|い}って？」と{言|い}います。', ro: 'Sensei ya ten\'in-san ni wa, "sumimasen, mou ichido onegai shimasu" to iimasu. Kikitoreta kotoba o kurikaeshite, "~ no ato, nan to osshaimashita ka" to kiku koto mo arimasu. Tomodachi nara, "e, mou ikkai itte?" to iimasu.', vi: 'Với thầy cô hay nhân viên cửa hàng, tôi nói "Xin lỗi, nói lại giúp tôi một lần nữa". Cũng có khi tôi lặp lại chữ mình nghe được rồi hỏi "Sau ~ anh/chị nói gì ạ?". Với bạn thì tôi nói "Hả, nói lại lần nữa đi?".' },
      ],
    },
    {
      t: 'speak',
      id: 'b39-noi-ghi-am',
      part: '1',
      questions: [
        'にほんごの かいわで、むずかしい ことは なんですか。',
        'どうやって ちょうかいを れんしゅう して いますか。',
        'あいての はなしが よく ききとれなかった とき、どう しますか。',
        'ラジオの はなし「ききじょうず な ひと」を、1ぷんで まとめて ください。',
        'せんせいの はなし「わからない ことばが あっても」を、まとめて、あなたの いけんも いって ください。',
        'にほんの えきや みせで、よく きく ことばを みっつ おしえて ください。',
      ],
    },
  ],
};

/* ═══════════════════════════ 8. VIẾT ═══════════════════════════ */

const VIET: Lesson = {
  id: 'b39-viet',
  kind: 'writing',
  title: 'Viết — chép chính tả 8 câu nghe được (書き取り) + tóm tắt bài nghe bằng văn viết (要約, ~200 chữ, thể だ／である)',
  goal: 'Nghe và chép đúng (kanji / kana) 8 câu hay gặp ở nhà ga, cửa hàng, quầy thủ tục và lời nói thường ngày; viết bản tóm tắt ~200 chữ thể だ／である cho một bài nghe — có chủ đề, ý chính, 1–2 chi tiết, không chép lại nguyên văn, dùng đúng ～と述べている・～という.',
  minutes: 40,
  blocks: [
    {
      t: 'p',
      text: 'Phần viết của bài nghe có hai việc: **chép chính tả** (nghe → viết đúng chữ, luyện tai và chữ Hán cùng lúc) và **tóm tắt** (nghe → chọn ý chính → viết lại bằng lời mình). Đề JLPT không có phần viết, nhưng viết lại được một câu là bằng chứng bạn đã **nghe ra thật**, không đoán mò.',
    },
    { t: 'h', text: 'A. 書き取り — chép chính tả 8 câu' },
    NG('b39-viet-nghe', 'Chép chính tả — nghe từng câu (bấm 🔊 từng dòng), rồi gõ vào ô bên dưới', 'Mỗi câu nghe tối đa 3 lần. Gõ bằng kanji hoặc kana đều được; máy chấm bỏ qua dấu câu.', [
      ['アナウンス', 'ja-nu', '{間|ま}もなく、{三番線|さんばんせん}に{快速|かいそく}が{参|まい}ります。', 'Mamonaku, sanbansen ni kaisoku ga mairimasu.', 'Tàu nhanh sắp vào đường ray số 3.'],
      ['アナウンス', 'ja-nu', '{白線|はくせん}の{内側|うちがわ}までお{下|さ}がりください。', 'Hakusen no uchigawa made osagari kudasai.', 'Xin lùi vào phía trong vạch trắng.'],
      ['{店員|てんいん}', 'ja-nam', 'こちらは{税込|ぜいこ}みの{値段|ねだん}です。', 'Kochira wa zeikomi no nedan desu.', 'Đây là giá đã gồm thuế.'],
      ['ワン', 'ja-nu', '{領収書|りょうしゅうしょ}をお{願|ねが}いします。', 'Ryoushuusho o onegai shimasu.', 'Cho tôi xin hoá đơn.'],
      ['アナウンス', 'ja-nu', '{熱中症|ねっちゅうしょう}に{気|き}をつけてください。', 'Necchuushou ni ki o tsukete kudasai.', 'Hãy cẩn thận với say nắng.'],
      ['{職員|しょくいん}', 'ja-nam', '{申請|しんせい}は{金曜日|きんようび}までにお{願|ねが}いします。', 'Shinsei wa kin\'youbi made ni onegai shimasu.', 'Xin nộp đơn trước thứ Sáu.'],
      ['アナウンス', 'ja-nu', '{先|さき}ほどのお{知|し}らせを{訂正|ていせい}いたします。', 'Sakihodo no oshirase o teisei itashimasu.', 'Xin đính chính thông báo vừa rồi.'],
      ['{森課長|もりかちょう}', 'ja-nam', '{会議|かいぎ}の{資料|しりょう}、{明日|あした}までに{読|よ}んどいて。', 'Kaigi no shiryou, ashita made ni yondoite.', 'Tài liệu họp, đọc trước giúp tôi trước ngày mai nhé.'],
    ]),
    {
      t: 'quiz',
      id: 'b39-viet-chep',
      title: 'Gõ lại câu vừa nghe (8 câu)',
      kind: 'fill',
      grammar: 'Câu 8 viết đúng dạng rút gọn đã nghe (読んどいて), không đổi sang dạng đầy đủ.',
      items: [
        { q: 'Câu 1 (loa sân ga — tàu sắp vào)', answers: V('{間|ま}もなく、{三番線|さんばんせん}に{快速|かいそく}が{参|まい}ります。'), hint: 'まもなく、さんばんせんに かいそくが まいります' },
        { q: 'Câu 2 (loa sân ga — lùi vào)', answers: V('{白線|はくせん}の{内側|うちがわ}までお{下|さ}がりください。'), hint: 'はくせんの うちがわまで おさがりください' },
        { q: 'Câu 3 (nhân viên cửa hàng — giá)', answers: V('こちらは{税込|ぜいこ}みの{値段|ねだん}です。'), hint: 'こちらは ぜいこみの ねだんです' },
        { q: 'Câu 4 (khách — xin hoá đơn)', answers: V('{領収書|りょうしゅうしょ}をお{願|ねが}いします。'), hint: 'りょうしゅうしょを おねがいします' },
        { q: 'Câu 5 (loa thành phố)', answers: V('{熱中症|ねっちゅうしょう}に{気|き}をつけてください。'), hint: 'ねっちゅうしょうに きを つけて ください' },
        { q: 'Câu 6 (cán bộ — hạn nộp đơn)', answers: V('{申請|しんせい}は{金曜日|きんようび}までにお{願|ねが}いします。'), hint: 'しんせいは きんようびまでに おねがいします' },
        { q: 'Câu 7 (loa — đính chính)', answers: V('{先|さき}ほどのお{知|し}らせを{訂正|ていせい}いたします。'), hint: 'さきほどの おしらせを ていせい いたします' },
        { q: 'Câu 8 (trưởng phòng — văn nói)', answers: V('{会議|かいぎ}の{資料|しりょう}、{明日|あした}までに{読|よ}んどいて。', '{会議|かいぎ}の{資料|しりょう}、{明日|あした}までに{読|よ}んでおいて。'), hint: 'かいぎの しりょう、あしたまでに よんどいて' },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi chép chính tả hay gặp',
      items: [
        '**まいります** (参ります) ≠ まります — nghe đủ ba âm **ma-i-ri**. **おさがり** (お下がり) ≠ おさがし.',
        '**ぜいこみ** — ぜ là âm đục; **ねっちゅうしょう** — có っ và hai trường âm (ちゅう・しょう).',
        '**りょうしゅうしょ** — ba âm ghép ょ/ゅ liên tiếp; viết chậm từng âm: りょ・う・しゅ・う・しょ.',
        '**よんどいて** — nghe "yondoite" thì viết đúng như nghe; nếu đề yêu cầu dạng lịch sự thì đổi thành 読んでおいてください.',
      ],
    },
    { t: 'h', text: 'B. 要約 — tóm tắt bài nghe bằng văn viết (~200 chữ, thể だ／である)' },
    {
      t: 'note',
      title: 'Dàn ý tóm tắt (cho bài nghe 13 — lời khuyên của cô 佐藤)',
      items: [
        '**① Chủ đề (1 câu)**: この{話|はなし}は、JLPTの{聴解|ちょうかい}の{聞|き}き{方|かた}についての{話|はなし}である。',
        '**② Vấn đề người nói nêu ra (1–2 câu)**: {多|おお}くの{学習者|がくしゅうしゃ}は～ので、～てしまう。',
        '**③ Ý chính (1 câu, dùng ～と述べている)**: {話|はな}し{手|て}は、～ことが{一番|いちばん}{大切|たいせつ}だと{述|の}べている。',
        '**④ Chi tiết bổ trợ (1 câu)**: また、～という。',
        '**⑤ (Tuỳ chọn) Ý kiến mình (1 câu)**: {私|わたし}もこの{意見|いけん}に{賛成|さんせい}だ。',
        'Từ nối: **{多|おお}くの～は・しかし・そのため・つまり・また**. ⚠ Viết thể **だ／である**, không dùng です／ます và không dùng dạng rút gọn văn nói (聞き取らなきゃ → 聞き取らなければならない).',
      ],
    },
    {
      t: 'passage',
      title: '{要約|ようやく}の{例|れい}（{約|やく}{二百字|にひゃくじ}）',
      intro: 'Bài mẫu tóm tắt bài nghe 13. Đọc, rồi tự viết tóm tắt bài nghe 10 (radio "người nghe giỏi") theo cùng khuôn.',
      paras: [
        { text: 'この{話|はなし}は、JLPTの{聴解|ちょうかい}の{聞|き}き{方|かた}についての{話|はなし}である。{多|おお}くの{学習者|がくしゅうしゃ}は、{全部|ぜんぶ}の{言葉|ことば}を{聞|き}き{取|と}らなければならないと{考|かんが}え、{知|し}らない{言葉|ことば}があるとそこで{止|と}まってしまう。しかし、{試験|しけん}の{音声|おんせい}は{一回|いっかい}しか{流|なが}れないため、{止|と}まっている{間|あいだ}に{大事|だいじ}なところを{聞|き}き{逃|のが}してしまう。そこで{話|はな}し{手|て}は、わからない{言葉|ことば}は{飛|と}ばして、{誰|だれ}が{何|なに}をどうしたいのかという{話|はなし}の{流|なが}れをつかむことが{一番|いちばん}{大切|たいせつ}だと{述|の}べている。また、{日本人|にほんじん}でも{全部|ぜんぶ}の{言葉|ことば}を{聞|き}いているわけではないという。{私|わたし}もこの{意見|いけん}に{賛成|さんせい}だ。' },
      ],
    },
    {
      t: 'table',
      caption: 'Tiêu chí tự chấm bản tóm tắt (10 điểm)',
      head: ['Tiêu chí', 'Điểm', 'Tự hỏi'],
      rows: [
        ['Chủ đề đúng ở câu đầu', '2', 'Câu 1 có "～についての話である" không?'],
        ['Ý chính đúng (giống đáp án 概要理解)', '3', 'Có dùng ～と述べている cho ý chính không? Ý đó có phải câu kết của bài nghe không?'],
        ['Chọn chi tiết, không kể lại từng câu', '2', 'Có ≤ 2 chi tiết? Có bỏ ví dụ thừa không?'],
        ['Văn viết đúng', '2', 'Toàn bộ thể だ／である? Không còn ～なきゃ・～ちゃう・～って?'],
        ['Độ dài 180–220 chữ', '1', 'Đếm cả dấu câu như ô vuông 原稿用紙.'],
      ],
    },
    {
      t: 'quiz',
      id: 'b39-viet-cau',
      title: 'Câu then chốt của bản tóm tắt — dịch Việt → Nhật (thể だ／である, 6 câu)',
      kind: 'translate',
      grammar: '～についての話である · ～と述べている · ～という · ～わけではない · ～ため',
      items: [
        { q: 'Đây là câu chuyện về cách nghe trong phần thi nghe hiểu.', answers: V('これは{聴解|ちょうかい}の{聞|き}き{方|かた}についての{話|はなし}である。', 'この{話|はなし}は{聴解|ちょうかい}の{聞|き}き{方|かた}についての{話|はなし}である。', 'これは{聴解|ちょうかい}の{聞|き}き{方|かた}についての{話|はなし}だ。'), hint: 'ちょうかいの ききかたに ついての はなしである' },
        { q: 'Người nói cho rằng nắm mạch câu chuyện là quan trọng nhất.', answers: V('{話|はな}し{手|て}は、{話|はなし}の{流|なが}れをつかむことが{一番|いちばん}{大切|たいせつ}だと{述|の}べている。', '{話|はな}し{手|て}は{話|はなし}の{流|なが}れをつかむことが{一番|いちばん}{大切|たいせつ}だと{述|の}べている。', '{話|はな}し{手|て}は、{話|はなし}の{流|なが}れをつかむのが{一番|いちばん}{大切|たいせつ}だと{述|の}べている。'), hint: 'はなしの ながれを つかむ ことが いちばん たいせつだと のべている' },
        { q: 'Vì âm thanh bài thi chỉ phát một lần.', answers: V('{試験|しけん}の{音声|おんせい}は{一回|いっかい}しか{流|なが}れないためだ。', '{試験|しけん}の{音声|おんせい}は{一回|いっかい}しか{流|なが}れないからだ。', '{試験|しけん}の{音声|おんせい}は{一度|いちど}しか{流|なが}れないためだ。'), hint: 'いっかいしか ながれない ためだ' },
        { q: 'Ngay cả người Nhật cũng không phải nghe hết mọi chữ.', answers: V('{日本人|にほんじん}でも{全部|ぜんぶ}の{言葉|ことば}を{聞|き}いているわけではない。', '{日本人|にほんじん}でも、{全部|ぜんぶ}の{言葉|ことば}を{聞|き}いているわけではない。', '{日本人|にほんじん}でもすべての{言葉|ことば}を{聞|き}いているわけではない。'), hint: '～ている わけではない (Bài 31)' },
        { q: 'Theo người nói, người nghe giỏi thì chêm tiếng đệm.', answers: V('{話|はな}し{手|て}によると、{聞|き}き{上手|じょうず}な{人|ひと}は{相|あい}づちを{打|う}つという。', '{話|はな}し{手|て}によると、{聞|き}き{上手|じょうず}な{人|ひと}は{相|あい}づちを{打|う}つそうだ。', '{話|はな}し{手|て}によると、{聞|き}き{上手|じょうず}な{人|ひと}は{相|あい}づちを{打|う}つ。'), hint: '～に よると、～という／～そうだ' },
        { q: 'Tôi cũng tán thành ý kiến này.', answers: V('{私|わたし}もこの{意見|いけん}に{賛成|さんせい}だ。', '{私|わたし}もこの{意見|いけん}に{賛成|さんせい}である。', '{私|わたし}もこの{意見|いけん}に{賛成|さんせい}です。'), hint: 'わたしも この いけんに さんせいだ' },
      ],
    },
  ],
};

/* ═══════════════════════════ 9. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b39-bai-tap',
  kind: 'homework',
  title: 'Bài tập về nhà — dịch câu văn nói & thông báo, trắc nghiệm nghe hiểu ý thật – từ vựng – chữ Hán, ghép câu',
  goal: 'Tự kiểm lại toàn Bài 39: dịch Việt → Nhật các câu hỏi lại, xác nhận, nhờ, từ chối vòng, câu thông báo; nhận ra nghĩa thật của dạng rút gọn và cách nói vòng; chọn đúng từ của bối cảnh đề nghe; ghép câu văn nói.',
  minutes: 40,
  blocks: [
    {
      t: 'quiz',
      id: 'b39-bt-dich',
      title: 'Dịch Việt → Nhật (12 câu)',
      kind: 'translate',
      grammar: 'もう一度お願いします · ～とおっしゃいましたか · ～ですね (xác nhận) · ～なら · ～てくれる？ · ちょっと…… · ～ておく／～とく',
      items: [
        { q: 'Xin lỗi, tôi nghe không rõ lắm.', answers: V('すみません、よく{聞|き}き{取|と}れなかったんですが。', 'すみません、よく{聞|き}き{取|と}れませんでした。', 'すみません、よく{聞|き}こえなかったんですが。'), hint: 'よく ききとれなかったんですが' },
        { q: 'Xin lỗi, anh nói lại giúp tôi một lần nữa.', answers: V('すみません、もう{一度|いちど}お{願|ねが}いします。', 'すみません、もう{一度|いちど}{言|い}っていただけますか。', 'すみません、もう{一度|いちど}{言|い}ってください。'), hint: 'もう いちど おねがいします' },
        { q: 'Thưa cô, cô nói hạn nộp là ngày mấy ạ?', answers: V('{先生|せんせい}、{締|し}め{切|き}りは{何日|なんにち}とおっしゃいましたか。', '{先生|せんせい}、{締|し}め{切|き}りは{何日|なんにち}だとおっしゃいましたか。'), hint: 'しめきりは なんにちと おっしゃいましたか' },
        { q: 'Bến số 3 cửa Đông nhỉ.', answers: V('{東口|ひがしぐち}の{三番乗|さんばんの}り{場|ば}ですね。'), hint: 'ひがしぐちの さんばんのりば ですね' },
        { q: 'Mấy giờ thì còn chỗ trống ạ?', answers: V('{何時|なんじ}なら{空|あ}きがありますか。', '{何時|なんじ}なら{空|あ}いていますか。', '{何時|なんじ}なら{席|せき}が{空|あ}いていますか。'), hint: 'なんじなら あきが ありますか' },
        { q: 'Vậy là trước tiên đo nhiệt độ, sau đó viết phiếu, đúng không ạ?', answers: V('まず{熱|ねつ}を{測|はか}って、それから{問診票|もんしんひょう}を{書|か}く、ということですね。', 'まず{熱|ねつ}を{測|はか}って、それから{問診票|もんしんひょう}を{書|か}くんですね。', 'じゃあ、まず{熱|ねつ}を{測|はか}って、それから{問診票|もんしんひょう}を{書|か}く、ということですね。'), hint: 'まず ～て、それから ～、と いう ことですね' },
        { q: '(với bạn) Nếu cậu ra cửa hàng tiện lợi thì tiện mua giùm tớ trà nhé?', answers: V('コンビニ{行|い}くなら、ついでにお{茶|ちゃ}{買|か}ってきてくれる？', 'コンビニに{行|い}くなら、ついでにお{茶|ちゃ}を{買|か}ってきてくれる？', 'コンビニに{行|い}くなら、ついでにお{茶|ちゃ}を{買|か}ってきてくれない？'), hint: '～なら、ついでに ～て きて くれる？' },
        { q: '(với bạn) Đồ uống để tớ mua sẵn nhé.', answers: V('{飲|の}み{物|もの}は{私|わたし}が{買|か}っとくね。', '{飲|の}み{物|もの}は{私|わたし}が{買|か}っておくね。', '{飲|の}み{物|もの}は{私|わたし}が{買|か}っておきます。'), hint: 'かっとく ね' },
        { q: '(từ chối vòng) Thứ Bảy thì hơi… Chủ nhật thì được.', answers: V('{土曜日|どようび}はちょっと……。{日曜日|にちようび}ならいいんだけど。', '{土曜日|どようび}はちょっと。{日曜日|にちようび}ならいいです。', '{土曜日|どようび}はちょっと……。{日曜日|にちようび}なら{大丈夫|だいじょうぶ}です。'), hint: 'どようびは ちょっと…… にちようびなら' },
        { q: 'Cho tôi xin hoá đơn. Tên người nhận ghi "Sakura System".', answers: V('{領収書|りょうしゅうしょ}をお{願|ねが}いします。{宛名|あてな}は「さくらシステム」でお{願|ねが}いします。', '{領収書|りょうしゅうしょ}をいただけますか。{宛名|あてな}は「さくらシステム」でお{願|ねが}いします。', '{領収書|りょうしゅうしょ}をください。{宛名|あてな}は「さくらシステム」で。'), hint: 'りょうしゅうしょ… あてなは ～で おねがいします' },
        { q: '(loa) Tuyến Sakura hiện đang tạm dừng chạy tàu.', answers: V('さくら{線|せん}は、ただいま{運転|うんてん}を{見合|みあ}わせております。', 'ただいま、さくら{線|せん}は{運転|うんてん}を{見合|みあ}わせております。', 'さくら{線|せん}は{今|いま}、{運転|うんてん}を{見合|みあ}わせています。'), hint: 'ただいま うんてんを みあわせて おります' },
        { q: '(thông báo) Trường hợp trời mưa sẽ tổ chức ở nhà thể chất.', answers: V('{雨天|うてん}の{場合|ばあい}は、{体育館|たいいくかん}で{行|おこな}います。', '{雨天|うてん}の{場合|ばあい}は{体育館|たいいくかん}で{開催|かいさい}します。', '{雨|あめ}の{場合|ばあい}は、{体育館|たいいくかん}で{行|おこな}います。'), hint: 'うてんの ばあいは たいいくかんで おこないます' },
      ],
    },
    {
      t: 'mcq',
      id: 'b39-bt-trac-nghiem',
      title: 'Trắc nghiệm (12 câu) — văn nói, cách nói vòng, từ vựng, chữ Hán',
      items: [
        { q: '「{会議室|かいぎしつ}、{取|と}っといて」の{意味|いみ}は？', options: ['{会議室|かいぎしつ}を{予約|よやく}しておいて', '{会議室|かいぎしつ}を{予約|よやく}してしまった', '{会議室|かいぎしつ}を{予約|よやく}しなくていい', '{会議室|かいぎしつ}を{予約|よやく}している'], correct: 0, why: '**～といて** = ～ておいて (hãy làm sẵn) → chỉ thị đặt phòng. 〔Tottoite = totte oite.〕' },
        { q: '「ごめん、{言|い}っちゃった」 — {何|なに}がありましたか。', options: ['これから{言|い}う', 'うっかり{言|い}ってしまった', '{言|い}わなかった', '{言|い}ってもらった'], correct: 1, why: '**～ちゃった** = ～てしまった (lỡ làm rồi). 〔Icchatta = itte shimatta.〕' },
        { q: '「{明日|あした}、{早|はや}く{起|お}きなきゃ」 — {話|はな}し{手|て}は？', options: ['{早|はや}く{起|お}きなくてもいい', '{早|はや}く{起|お}きなければならない', '{早|はや}く{起|お}きてはいけない', '{早|はや}く{起|お}きたくない'], correct: 1, why: '**～なきゃ** = ～なければ（ならない）. 〔Okinakya.〕' },
        { q: 'A「この{仕事|しごと}、{今日中|きょうじゅう}にできる？」B「{今日中|きょうじゅう}はちょっと{難|むずか}しいかな」 — Bは？', options: ['{今日中|きょうじゅう}にできる', '{今日中|きょうじゅう}にはたぶんできない', '{今日|きょう}は{休|やす}む', '{少|すこ}しだけする'], correct: 1, why: '**ちょっと{難|むずか}しいかな** = cách nói vòng → gần như KHÔNG. 〔Chotto muzukashii kana.〕' },
        { q: '「{安|やす}いのはいいんだけど……」の{後|あと}に{続|つづ}くのは？', options: ['だからすぐ{買|か}いたい', 'ちょっと{遠|とお}いんだよね', 'とても{安|やす}い', 'もっと{安|やす}くしてほしい'], correct: 1, why: '**～けど** → sau đó là điều KHÔNG tốt (đảo ý). 〔~ kedo, chotto tooi n da yo ne.〕' },
        { q: '「{三時|さんじ}から……いや、{三時半|さんじはん}からだ」 — {正|ただ}しい{時間|じかん}は？', options: ['{三時|さんじ}', '{三時半|さんじはん}', '{三時|さんじ}か{三時半|さんじはん}', '{二時半|にじはん}'], correct: 1, why: '**いや** = đổi ý → câu sau. 〔Iya, sanji han kara da.〕' },
        { q: '{次|つぎ}の{小|ちい}さい{駅|えき}で{降|お}りたい{人|ひと}が{乗|の}る{電車|でんしゃ}は？', options: ['{急行|きゅうこう}', '{快速|かいそく}', '{各駅停車|かくえきていしゃ}', '{特急|とっきゅう}'], correct: 2, why: 'Ga nhỏ → tàu **dừng mọi ga**. 〔Kakueki teisha.〕' },
        { q: '{値札|ねふだ}に「{税抜|ぜいぬ}き{千円|せんえん}」とあります。レジで{払|はら}うお{金|かね}は？', options: ['{千円|せんえん}より{少|すく}ない', 'ちょうど{千円|せんえん}', '{千円|せんえん}より{多|おお}い', '{無料|むりょう}'], correct: 2, why: '**{税抜|ぜいぬ}き** = CHƯA gồm thuế → trả nhiều hơn. 〔Zeinuki.〕' },
        { q: '「{運転再開|うんてんさいかい}の{見込|みこ}みは{立|た}っておりません」の{意味|いみ}は？', options: ['もうすぐ{動|うご}く', 'いつ{動|うご}くかわからない', '{今日|きょう}はもう{動|うご}かない', '{電車|でんしゃ}が{遅|おく}れている'], correct: 1, why: '**{見込|みこ}みが{立|た}たない** = chưa có dự kiến → chưa biết bao giờ. 〔Mikomi wa tatte orimasen.〕' },
        { q: '**しゅうでん**に{間|ま}に{合|あ}った。', options: ['終電', '集電', '修電', '週電'], correct: 0, why: '**{終電|しゅうでん}** = chuyến tàu CUỐI (終 = kết thúc). 〔Shuuden.〕' },
        { q: '{家賃|やちん}を**振**り{込|こ}む — 「振」の{読|よ}み{方|かた}は？', options: ['ふ', 'しん', 'ぶ', 'ゆ'], correct: 0, why: '**{振|ふ}り{込|こ}む** — kun ふ. しん là âm On ({振動|しんどう}). 〔Furikomu.〕' },
        { q: '「{訂正|ていせい}いたします」のあとの{情報|じょうほう}は？', options: ['{古|ふる}い{情報|じょうほう}', '{正|ただ}しい{情報|じょうほう}', '{関係|かんけい}ない{情報|じょうほう}', '{間違|まちが}った{情報|じょうほう}'], correct: 1, why: '**{訂正|ていせい}** = đính chính → thông tin SAU là đúng. 〔Teisei itashimasu.〕' },
      ],
    },
    {
      t: 'build',
      id: 'b39-bt-ghep',
      title: 'Ghép câu (8 câu)',
      items: [
        { vi: 'Xin lỗi, sau câu "viết xong" chị nói gì ạ?', chips: ['すみません', '「{書|か}き{終|お}わったら」の', 'あと', '{何|なん}と', 'おっしゃいましたか', '{申|もう}しましたか'], answer: ['すみません', '「{書|か}き{終|お}わったら」の', 'あと', '{何|なん}と', 'おっしゃいましたか'], ro: 'Sumimasen, "kakiowattara" no ato, nan to osshaimashita ka.' },
        { vi: 'Trước tiên lấy giấy chứng nhận, rồi đi xe buýt nhỉ.', chips: ['まず', '{証明書|しょうめいしょ}を', 'もらって', 'それから', 'バスですね', 'あとで'], answer: ['まず', '{証明書|しょうめいしょ}を', 'もらって', 'それから', 'バスですね'], ro: 'Mazu shoumeisho o moratte, sore kara basu desu ne.' },
        { vi: 'Giờ đó đã kín chỗ rồi ạ.', chips: ['その{時間|じかん}は', 'もう', '{満席|まんせき}', 'なんです', '{空席|くうせき}'], answer: ['その{時間|じかん}は', 'もう', '{満席|まんせき}', 'なんです'], ro: 'Sono jikan wa mou manseki na n desu.' },
        { vi: 'Quan trọng hơn, gửi email cho anh Tamura trước nhé.', chips: ['それより', '{先|さき}に', '{田村|たむら}さんに', 'メールを', '{送|おく}っといて', '{送|おく}っちゃって'], answer: ['それより', '{先|さき}に', '{田村|たむら}さんに', 'メールを', '{送|おく}っといて'], ro: 'Sore yori, saki ni Tamura-san ni meeru o okuttoite.' },
        { vi: 'À thôi, tiền thì hôm đó thu ở quán là được.', chips: ['あ、やっぱり', 'お{金|かね}は', '{当日|とうじつ}', 'お{店|みせ}で', '{集|あつ}めればいいや', '{集|あつ}めなきゃ'], answer: ['あ、やっぱり', 'お{金|かね}は', '{当日|とうじつ}', 'お{店|みせ}で', '{集|あつ}めればいいや'], ro: 'A, yappari okane wa toujitsu omise de atsumereba ii ya.' },
        { vi: 'Thật ra là tớ không biết phòng thi đã đổi.', chips: ['{実|じつ}は', '{試験|しけん}の{教室|きょうしつ}が', '{変|か}わってたのを', '{知|し}らなくて', 'それより'], answer: ['{実|じつ}は', '{試験|しけん}の{教室|きょうしつ}が', '{変|か}わってたのを', '{知|し}らなくて'], ro: 'Jitsu wa, shiken no kyoushitsu ga kawatteta no o shiranakute.' },
        { vi: 'Xin quý khách dùng tàu điện ngầm tuyến Midori.', chips: ['{地下鉄|ちかてつ}', 'みどり{線|せん}を', 'ご{利用|りよう}', 'ください', 'いたします'], answer: ['{地下鉄|ちかてつ}', 'みどり{線|せん}を', 'ご{利用|りよう}', 'ください'], ro: 'Chikatetsu Midori-sen o goriyou kudasai.' },
        { vi: 'Chữ không hiểu thì cứ tạm bỏ qua.', chips: ['わからない', '{言葉|ことば}は', 'とりあえず', '{飛|と}ばしましょう', 'ついでに'], answer: ['わからない', '{言葉|ことば}は', 'とりあえず', '{飛|と}ばしましょう'], ro: 'Wakaranai kotoba wa, toriaezu tobashimashou.' },
      ],
    },
  ],
};

/* ═══════════════════════ ② THEO BUỔI TRÊN LỚP ═══════════════════════ */

const O4 = ['① làm NGAY (đáp án)', '② ĐÃ XONG', '③ để SAU', '④ người khác làm / không cần'];

const BUOI_1: Lesson = {
  id: 'b39-buoi-1-kadai',
  kind: 'review',
  title: 'Buổi 1 — Mở Bài 39 (聴解 N3): đề nghe N3 có gì · từ nhóm A, B (nghe & nhà ga) · loa sân ga · hỏi lại & xác nhận (hội thoại ①) · ～てる・～とく・～てく · dạng 課題理解 và bộ lọc bốn ô',
  goal: 'Theo nhịp một buổi trên lớp: khởi động bằng câu hỏi "em hay nghe tiếng Nhật ở đâu, khó nhất là gì?", nắm cấu trúc 5 dạng đề 聴解 N3, học từ nhóm A (nghe & nói) và B (nhà ga), nghe ra khuôn loa sân ga, luyện câu hỏi lại / xác nhận của hội thoại ①, nghe ra ～てる・～とく・～てく, rồi làm đề 課題理解 bằng bộ lọc bốn ô.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 1 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Khởi động (5′)** — giáo viên hỏi: "Các em hay nghe tiếng Nhật ở đâu? Lúc nào nghe không ra?". Câu trả lời hay gặp: **{駅|えき}のアナウンス・{店員|てんいん}さん・{友達|ともだち}の{会話|かいわ}** — giáo viên: "Ba chỗ đó chính là ba bối cảnh của đề nghe N3. Hôm nay bắt đầu từ nhà ga."',
        '**Đề nghe N3 (5′)** — 5 dạng, 28 câu, ~40 phút: 課題理解・ポイント理解・概要理解・発話表現・即時応答. Dạng nào có câu hỏi trước, dạng nào không.',
        '**Từ mới (10′)** — nhóm A (nghe & nói: {聴解|ちょうかい}・{聞|き}き{逃|のが}す・{聞|き}き{流|なが}す・{早口|はやくち}・{相|あい}づち・{話|はな}し{手|て}・{見込|みこ}み・アナウンス…) + nhóm B (nhà ga: {間|ま}もなく・{白線|はくせん}・{番線|ばんせん}・{発車|はっしゃ}・{各駅停車|かくえきていしゃ}・{快速|かいそく}・{急行|きゅうこう}・{終電|しゅうでん}・{乗|の}り{場|ば}…).',
        '**Nghe & nói (20′)** — khuôn loa sân ga · hội thoại ① (hỏi lại khi không nghe kịp, xác nhận bằng ～ですね, まず～それから) · văn nói ① ～てる・～とく・～てく · dạng 課題理解 + bộ lọc bốn ô.',
        '**チャレンジ (10′)** — luyện cặp: A đọc một đoạn hướng dẫn 4 việc (có việc đã xong, để sau, người khác làm), B nghe và nói "まず～ます". Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b39-b1-slides',
      title: 'Bài 39 聴解 — Buổi 1: đề nghe N3 · nhà ga · 課題理解',
      slides: [
        {
          tieuDe: '{第|だい}39{課|か} {聴解|ちょうかい} N3',
          anh: ['headphone', 'ear', 'memo'],
          nhan: ['{聴解|ちょうかい}', '{聞|き}く', 'メモ'],
          dong: ['Hôm nay: **đề nghe N3 có gì** · **loa nhà ga** · **課題理解** (làm gì trước?)'],
          ro: ['Choukai N3'],
          ghi: 'Bài 39 là bài kỹ năng — không có mẫu ngữ pháp mới. Ba buổi: buổi 1 nhà ga + 課題理解; buổi 2 văn nói rút gọn + cách nói vòng + ポイント理解; buổi 3 概要理解 + 発話表現 + 即時応答 + chiến thuật làm đề.',
        },
        {
          tieuDe: 'できること — Học xong Bài 39 làm được gì?',
          anh: ['station', 'convenience-store', 'hospital'],
          nhan: ['{駅|えき}', '{店|みせ}', '{病院|びょういん}'],
          dong: ['① Nghe ra loa ga, loa cửa hàng, hướng dẫn ở quầy.', '② Hỏi lại khi không nghe kịp: もう{一度|いちど}お{願|ねが}いします。', '③ Làm đủ 5 dạng đề 聴解 N3.'],
          ro: ['Eki no anaunsu · mise · madoguchi', 'Mou ichido onegai shimasu.', 'Choukai N3 no itsutsu no mondai'],
          ghi: 'Mục tiêu cuối bài: làm đề nghe mini 20 phút (Luyện thêm 5) đạt từ 70%.',
        },
        {
          tieuDe: 'Khởi động — どこで{日本語|にほんご}を{聞|き}きますか',
          anh: ['train', 'shopping-cart', 'busts-in-silhouette'],
          nhan: ['{電車|でんしゃ}', '{買|か}い{物|もの}', '{友達|ともだち}'],
          dong: ['A：どこで{日本語|にほんご}をよく{聞|き}きますか。', 'B：{駅|えき}のアナウンスです。でも、{早口|はやくち}で{聞|き}き{取|と}れません。'],
          ro: ['Doko de nihongo o yoku kikimasu ka.', 'Eki no anaunsu desu. Demo, hayakuchi de kikitoremasen.'],
          hoi: 'どんなときに{日本語|にほんご}が{聞|き}き{取|と}れませんか。',
          dap: 'Ví dụ: {早口|はやくち}のとき・{知|し}らない{言葉|ことば}があるとき・{友達|ともだち}{同士|どうし}の{短|みじか}い{言葉|ことば}のとき。',
          ghi: 'Gọi 3–4 bạn. Ghi lên bảng các câu trả lời — đó là danh sách "kẻ thù" của buổi học: nói nhanh, từ lạ, văn nói rút gọn.',
        },
        {
          tieuDe: '{聴解|ちょうかい} N3 — 5{つ|いつ}の{問題|もんだい}',
          anh: ['clipboard', 'stopwatch'],
          nhan: ['28{問|もん}', '{約|やく}40{分|ぷん}'],
          dong: ['Có câu hỏi TRƯỚC: 問題1・2 · KHÔNG có: 問題3・5 · Có tranh: 問題4'],
          ro: ['Mondai ichi, ni · mondai san, go · mondai yon'],
          bang: { head: ['Mondai', 'Dạng', 'Nghe gì'], rows: [['1', '課題理解', 'làm gì TRƯỚC'], ['2', 'ポイント理解', 'VÌ SAO / cái gì'], ['3', '概要理解', 'Ý CHÍNH'], ['4', '発話表現', 'NÓI gì'], ['5', '即時応答', 'ĐÁP ngay']] },
          hoi: '{問題|もんだい}3と{問題|もんだい}5は、{何|なに}が{違|ちが}いますか。',
          dap: 'Cả hai không có lựa chọn in sẵn. 問題3: nghe một bài nói dài, hỏi ý chính. 問題5: nghe một câu ngắn, chọn câu đáp.',
          ghi: 'Bảng này học thuộc — trước mỗi phần nghe, biết mình phải bắt CÁI GÌ là đã đúng được một nửa.',
        },
        {
          tieuDe: '{新|あたら}しいことば ① — {聞|き}く・{話|はな}す',
          anh: ['ear', 'speaking-head', 'loudspeaker'],
          nhan: ['{聞|き}き{逃|のが}す', '{早口|はやくち}', 'アナウンス'],
          dong: ['{大事|だいじ}なところを{聞|き}き{逃|のが}した。', '{店長|てんちょう}は{早口|はやくち}だ。', '{日本人|にほんじん}はよく{相|あい}づちを{打|う}つ。'],
          ro: ['Daiji na tokoro o kikinogashita.', 'Tenchou wa hayakuchi da.', 'Nihonjin wa yoku aizuchi o utsu.'],
          hoi: '「{聞|き}き{逃|のが}す」と「{聞|き}き{流|なが}す」はどう{違|ちが}いますか。',
          dap: '{聞|き}き{逃|のが}す = muốn nghe mà SÓT; {聞|き}き{流|なが}す = cố ý nghe CHO QUA.',
          ghi: 'Cho lớp đọc to 11 từ nhóm A. Nhấn: 相づち — người Nhật nói はい・ええ khi nghe, KHÔNG có nghĩa là đồng ý.',
        },
        {
          tieuDe: '{新|あたら}しいことば ② — {駅|えき}',
          anh: ['station', 'high-speed-train', 'train'],
          nhan: ['～{番線|ばんせん}', '{快速|かいそく}', '{各駅停車|かくえきていしゃ}'],
          dong: ['{間|ま}もなく、{三番線|さんばんせん}に{電車|でんしゃ}が{参|まい}ります。', '{快速|かいそく}は{次|つぎ}の{駅|えき}に{止|と}まりません。', '{終電|しゅうでん}に{乗|の}り{遅|おく}れた。'],
          ro: ['Mamonaku, sanbansen ni densha ga mairimasu.', 'Kaisoku wa tsugi no eki ni tomarimasen.', 'Shuuden ni noriokureta.'],
          hoi: '{次|つぎ}の{小|ちい}さい{駅|えき}で{降|お}りたいです。どの{電車|でんしゃ}に{乗|の}りますか。',
          dap: '{各駅停車|かくえきていしゃ}です。{快速|かいそく}・{急行|きゅうこう}は{止|と}まらないかもしれません。',
          ghi: 'Vẽ lên bảng một tuyến 6 ga, đánh dấu ga dừng của 各駅停車 / 快速 / 急行. Đây là bẫy kinh điển của 課題理解.',
        },
        {
          tieuDe: '{駅|えき}のアナウンス — 5つの{部分|ぶぶん}',
          anh: ['loudspeaker', 'warning', 'eight-oclock'],
          nhan: ['お{知|し}らせ', '{理由|りゆう}', '{時間|じかん}'],
          dong: ['お{客様|きゃくさま}にお{知|し}らせいたします。', 'さくら{線|せん}は、{信号|しんごう}の{点検|てんけん}のため、{運転|うんてん}を{見合|みあ}わせております。', '{運転再開|うんてんさいかい}は{八時四十分|はちじよんじゅっぷん}ごろの{見込|みこ}みです。'],
          ro: ['Okyakusama ni oshirase itashimasu.', 'Sakura-sen wa, shingou no tenken no tame, unten o miawasete orimasu.', 'Unten saikai wa hachiji yonjuppun goro no mikomi desu.'],
          hoi: 'このアナウンスで、{大事|だいじ}な{情報|じょうほう}は{何|なん}ですか。{三|みっ}つ{言|い}ってください。',
          dap: 'TUYẾN (さくら線) · LÝ DO (信号の点検) · GIỜ (8:40 ごろ).',
          ghi: 'Khuôn: mở → tuyến + lý do (～のため) → tình trạng (～ております) → dự kiến (見込み) → hướng dẫn (～をご利用ください) → bổ sung (なお).',
        },
        {
          tieuDe: '{会話|かいわ} ① — {聞|き}き{取|と}れなかったとき',
          anh: ['man-student', 'man-police-officer', 'red-question-mark'],
          nhan: ['カルロス', '{駅員|えきいん}', '？'],
          dong: ['すみません、よく{聞|き}き{取|と}れなかったんですが……。', 'ちえん……？ すみません、もう{一度|いちど}お{願|ねが}いします。', '「{遅延証明書|ちえんしょうめいしょ}」って{何|なん}ですか。'],
          ro: ['Sumimasen, yoku kikitorenakatta n desu ga…….', 'Chien……? Sumimasen, mou ichido onegai shimasu.', '"Chien shoumeisho" tte nan desu ka.'],
          hoi: '{知|し}らない{言葉|ことば}があったとき、どうしますか。',
          dap: 'Lặp lại phần nghe được + もう{一度|いちど}お{願|ねが}いします／「～」って{何|なん}ですか。',
          ghi: 'Đọc phân vai hội thoại ①. Nhấn: đừng gật đầu khi chưa hiểu — người Nhật sẽ tưởng bạn hiểu.',
        },
        {
          tieuDe: '{確認|かくにん}する — ～ですね・まず～、それから～',
          anh: ['check-mark-button', 'bus-stop'],
          nhan: ['{確認|かくにん}', '{乗|の}り{場|ば}'],
          dong: ['{東口|ひがしぐち}の{三番乗|さんばんの}り{場|ば}ですね。', 'じゃあ、まず{証明書|しょうめいしょ}をもらって、それから{東口|ひがしぐち}のバスですね。'],
          ro: ['Higashiguchi no sanban noriba desu ne.', 'Jaa, mazu shoumeisho o moratte, sore kara higashiguchi no basu desu ne.'],
          hoi: '{駅員|えきいん}さんが「{西口|にしぐち}の{五番|ごばん}から{出|で}ています」と{言|い}いました。{確認|かくにん}してください。',
          dap: '{西口|にしぐち}の{五番|ごばん}ですね。',
          ghi: 'Trong đề 課題理解, câu cuối của người được hướng dẫn thường là câu xác nhận kiểu này — nó chính là đáp án.',
        },
        {
          tieuDe: '{話|はな}し{言葉|ことば} ① — ～てる・～とく・～てく',
          anh: ['writing-hand', 'speech-balloon'],
          nhan: ['{書|か}き{言葉|ことば}', '{話|はな}し{言葉|ことば}'],
          dong: ['{読|よ}んでいる → {読|よ}んでる', '{買|か}っておく → {買|か}っとく', '{持|も}っていく → {持|も}ってく'],
          ro: ['Yonde iru → yonderu', 'Katte oku → kattoku', 'Motte iku → motteku'],
          bang: { head: ['Nghe', '= Đầy đủ'], rows: [['～てる', '～ている'], ['～といた', '～ておいた'], ['～といて', '～ておいて'], ['～てった', '～ていった']] },
          hoi: '「{会議室|かいぎしつ}はもう{取|と}っといた」は、{何|なに}をしましたか。',
          dap: '{会議室|かいぎしつ}をもう{予約|よやく}しておいた — việc ĐÃ XONG.',
          ghi: 'Luật: い sau て rơi mất; て＋お → と. Đọc to bảng 3 lần.',
        },
        {
          tieuDe: '{問題|もんだい}1 {課題理解|かだいりかい} — 4つの{箱|はこ}',
          anh: ['check-mark-button', 'cross-mark', 'right-arrow', 'busts-in-silhouette'],
          nhan: ['○ まず', '✕ もう～てある', '→ あとでいい', '✕ ～がやる'],
          dong: ['まず・{先|さき}に・それより → ○', 'もう～てある・～といた → ✕', '～てからでいい・あとで → →', '～は{私|わたし}がやる・～なくていい → ✕'],
          ro: ['mazu · saki ni · sore yori', 'mou ~te aru · ~toita', '~te kara de ii · ato de', '~wa watashi ga yaru · ~nakute ii'],
          hoi: '「プロジェクターは{明日|あした}の{朝|あさ}でいいよ」は、どの{箱|はこ}ですか。',
          dap: '③ để SAU (→).',
          ghi: 'Mỗi việc nghe được xếp vào một hộp. Chỉ hộp ① là đáp án. Đánh ký hiệu ngay cạnh lựa chọn in trên đề.',
        },
        {
          tieuDe: '{練習|れんしゅう} — まず{何|なに}をしますか',
          anh: ['office-building', 'man-office-worker', 'woman-office-worker'],
          nhan: ['{会社|かいしゃ}', '{森課長|もりかちょう}', 'ワン'],
          dong: ['{会議室|かいぎしつ}はもう{取|と}っといたから。', 'コピーは{鈴木|すずき}さんがやってくれてる。', 'プロジェクターは{明日|あした}の{朝|あさ}でいい。', 'それより、{先|さき}に{田村|たむら}さんにメールしといて。'],
          ro: ['Kaigishitsu wa mou tottoita kara.', 'Kopii wa Suzuki-san ga yatte kureteru.', 'Purojekutaa wa ashita no asa de ii.', 'Sore yori, saki ni Tamura-san ni meeru shitoite.'],
          hoi: 'ワンさんはまず{何|なに}をしますか。',
          dap: '{田村|たむら}さんにメールを{送|おく}ります。',
          ghi: 'Cho cả lớp xếp từng câu vào bốn hộp trên bảng. Đây là bài nghe 2 của mục Nghe — về nhà nghe lại.',
        },
        {
          tieuDe: 'チャレンジ — ペアで{練習|れんしゅう}',
          anh: ['busts-in-silhouette', 'speech-balloon'],
          nhan: ['A', 'B'],
          dong: ['A：{明日|あした}のパーティーだけど、{飲|の}み{物|もの}はもう{買|か}っといた。{料理|りょうり}は{私|わたし}が{作|つく}る。{掃除|そうじ}は{夜|よる}でいい。{先|さき}に{椅子|いす}を{並|なら}べといてくれる？', 'B：わかった。じゃあ、まず{椅子|いす}を{並|なら}べるね。'],
          ro: ['Ashita no paatii da kedo, nomimono wa mou kattoita. Ryouri wa watashi ga tsukuru. Souji wa yoru de ii. Saki ni isu o narabetoite kureru?', 'Wakatta. Jaa, mazu isu o naraberu ne.'],
          hoi: 'A の{役|やく}で、{自分|じぶん}で{新|あたら}しい{指示|しじ}を{作|つく}ってください。',
          dap: 'Khuôn: もう～といた／～は{私|わたし}が～／～は～でいい／{先|さき}に～てくれる？',
          ghi: 'Đổi vai 2 lần. B phải nói đúng "まず～". Giáo viên đi vòng nghe, sửa ～といた ↔ ～ちゃった.',
        },
        {
          tieuDe: 'まとめ・{宿題|しゅくだい}',
          anh: ['notebook', 'headphone'],
          nhan: ['まとめ', '{宿題|しゅくだい}'],
          dong: ['Hỏi lại: もう{一度|いちど}お{願|ねが}いします · Xác nhận: ～ですね', '～てる・～とく・～てく · 課題理解 = bộ lọc bốn ô'],
          ro: ['Mou ichido onegai shimasu · ~desu ne', '~teru · ~toku · ~teku'],
          hoi: '{宿題|しゅくだい}：{聴解|ちょうかい}のBài 1–4 を{聞|き}いて、{四|よっ}つの{箱|はこ}に{分|わ}けてください。',
          dap: 'Tự soát bằng phần giải thích của mỗi bài.',
          ghi: 'Buổi sau: văn nói ～ちゃう・～なきゃ・～って, cách nói vòng (ちょっと……), dạng ポイント理解.',
        },
      ],
    },
    {
      t: 'mcq',
      id: 'b39-b1-hop',
      title: 'Luyện nhanh — câu này vào hộp nào? (8 câu)',
      items: [
        { q: '「チケットはもう{買|か}ってあるよ。」', options: O4, correct: 1, why: '**もう～てある** = đã xong.' },
        { q: '「とりあえず、{会議室|かいぎしつ}の{鍵|かぎ}を{取|と}ってきて。」', options: O4, correct: 0, why: '**とりあえず** + chỉ thị = làm ngay.' },
        { q: '「{飲|の}み{物|もの}は{会場|かいじょう}に{着|つ}いてからでいいよ。」', options: O4, correct: 2, why: '**～てからでいい** = để sau.' },
        { q: '「{受付|うけつけ}は{鈴木|すずき}さんがやってくれるから。」', options: O4, correct: 3, why: '**～がやってくれる** = người khác làm.' },
        { q: '「{名札|なふだ}は{作|つく}らなくていいよ。」', options: O4, correct: 3, why: '**～なくていい** = không cần.' },
        { q: '「その{前|まえ}に、{椅子|いす}を{並|なら}べといてくれる？」', options: O4, correct: 0, why: '**その{前|まえ}に** + ～といてくれる？ = làm ngay.' },
        { q: '「{資料|しりょう}のコピーはもうしといた。」', options: O4, correct: 1, why: '**しといた** = しておいた = đã xong.' },
        { q: '「お{茶|ちゃ}は、ついでに{帰|かえ}りに{買|か}ってきて。」', options: O4, correct: 2, why: '**ついでに{帰|かえ}りに** = làm sau việc chính.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b39-b1-day-du',
      title: 'Nghe ra dạng đầy đủ (6 câu)',
      kind: 'fill',
      grammar: 'てる = ている · とく = ておく · といた = ておいた · といて = ておいて · てく = ていく',
      items: [
        { q: '{雨|あめ}、{降|ふ}ってる？ →', answers: V('{降|ふ}っている'), hint: 'ふっている' },
        { q: '{窓|まど}、{閉|し}めといて。 →', answers: V('{閉|し}めておいて'), hint: 'しめておいて' },
        { q: '{予約|よやく}はしといたよ。 →', answers: V('しておいた'), hint: 'しておいた' },
        { q: 'お{弁当|べんとう}、{持|も}ってく？ →', answers: V('{持|も}っていく'), hint: 'もっていく' },
        { q: 'まだ{決|き}めてない。 →', answers: V('{決|き}めていない'), hint: 'きめていない' },
        { q: '{名前|なまえ}、{書|か}いといてね。 →', answers: V('{書|か}いておいて'), hint: 'かいておいて' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**Biết mình nghe CÁI GÌ trước khi nghe** — 問題1 hỏi việc làm TRƯỚC, 問題2 hỏi LÝ DO, 問題3 hỏi Ý CHÍNH. Đọc / nghe câu hỏi kỹ ngay lần đầu.',
        '**Không nghe kịp thì hỏi lại** — ngoài đời: もう{一度|いちど}お{願|ねが}いします / 「～」のあと、{何|なん}とおっしゃいましたか. Trong đề: đừng dừng, nghe tiếp.',
        '**Bốn hộp của 課題理解** — ○ làm ngay · ✕ đã xong (～てある・～といた) · → để sau (～でいい) · ✕ người khác / không cần. Câu cuối (まず～ます) là xác nhận.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 1)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{聴解|ちょうかい}の{問題|もんだい}1は、{何|なに}を{聞|き}く{問題|もんだい}ですか。', ro: 'Choukai no mondai ichi wa, nani o kiku mondai desu ka.', vi: 'Mondai 1 của phần nghe là dạng nghe cái gì?' },
        { who: 'Bạn', role: 'candidate', text: '{課題理解|かだいりかい}です。{話|はなし}を{聞|き}いて、{人|ひと}が{最初|さいしょ}に{何|なに}をするかを{選|えら}ぶ{問題|もんだい}です。', ro: 'Kadai rikai desu. Hanashi o kiite, hito ga saisho ni nani o suru ka o erabu mondai desu.', vi: 'Là 課題理解 ạ. Nghe câu chuyện rồi chọn người đó sẽ làm gì đầu tiên.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '「もう{取|と}っといた」は、どういう{意味|いみ}ですか。', ro: '"Mou tottoita" wa, dou iu imi desu ka.', vi: '"Mou tottoita" nghĩa là gì?' },
        { who: 'Bạn', role: 'candidate', text: '「もう{取|と}っておいた」という{意味|いみ}です。もう{終|お}わったことなので、{答|こた}えではありません。', ro: '"Mou totte oita" to iu imi desu. Mou owatta koto na node, kotae de wa arimasen.', vi: 'Nghĩa là "đã đặt sẵn rồi" ạ. Là việc đã xong nên không phải đáp án.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{駅|えき}のアナウンスがよく{聞|き}き{取|と}れなかったら、{駅員|えきいん}さんに{何|なん}と{言|い}いますか。', ro: 'Eki no anaunsu ga yoku kikitorenakattara, ekiin-san ni nan to iimasu ka.', vi: 'Nếu không nghe rõ loa nhà ga, em nói gì với nhân viên ga?' },
        { who: 'Bạn', role: 'candidate', text: '「すみません、{今|いま}のアナウンス、よく{聞|き}き{取|と}れなかったんですが……」と{言|い}います。', ro: '"Sumimasen, ima no anaunsu, yoku kikitorenakatta n desu ga……" to iimasu.', vi: 'Em nói "Xin lỗi, thông báo vừa rồi em nghe không rõ lắm…" ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{快速|かいそく}と{各駅停車|かくえきていしゃ}は、どう{違|ちが}いますか。', ro: 'Kaisoku to kakueki teisha wa, dou chigaimasu ka.', vi: 'Tàu nhanh và tàu thường khác nhau thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{各駅停車|かくえきていしゃ}は{全部|ぜんぶ}の{駅|えき}に{止|と}まりますが、{快速|かいそく}は{止|と}まらない{駅|えき}があります。', ro: 'Kakueki teisha wa zenbu no eki ni tomarimasu ga, kaisoku wa tomaranai eki ga arimasu.', vi: 'Tàu thường dừng ở tất cả các ga, còn tàu nhanh có ga không dừng ạ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b39-b1-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: '{問題|もんだい}3（{概要理解|がいようりかい}）について{正|ただ}しいのはどれですか。', options: ['{質問|しつもん}が{先|さき}に{読|よ}まれる', '{選択肢|せんたくし}が{紙|かみ}に{書|か}いてある', '{質問|しつもん}は{話|はなし}のあとで{聞|き}く', '{絵|え}を{見|み}て{答|こた}える'], correct: 2, why: '概要理解: **không có câu hỏi trước, không in lựa chọn** — câu hỏi nghe SAU bài nói.' },
        { q: '「{間|ま}もなく{電車|でんしゃ}が{参|まい}ります」の「{間|ま}もなく」は？', options: ['もうすぐ', 'ゆっくり', 'ときどき', 'もう{一度|いちど}'], correct: 0, why: '**{間|ま}もなく** = sắp, chẳng bao lâu nữa (= もうすぐ).' },
        { q: '「{雨|あめ}だから、{傘|かさ}{持|も}ってったほうがいいよ」の「{持|も}ってった」は？', options: ['{持|も}ってきた', '{持|も}っていった', '{持|も}っておいた', '{持|も}ってしまった'], correct: 1, why: '**てった** = ていった (mang theo đi).' },
        { q: '{駅員|えきいん}さんの{説明|せつめい}がわからなかった。{何|なん}と{言|い}いますか。', options: ['わかりました。', 'すみません、もう{一度|いちど}お{願|ねが}いします。', 'もう{一度|いちど}{言|い}いますね。', '{聞|き}き{取|と}れてよかったです。'], correct: 1, why: 'Hỏi lại lịch sự → **もう{一度|いちど}お{願|ねが}いします**.' },
        { q: '「{掃除|そうじ}は{夜|よる}でいい。{先|さき}に{買|か}い{物|もの}に{行|い}ってきて」 — まず{何|なに}をしますか。', options: ['{掃除|そうじ}', '{買|か}い{物|もの}', '{夜|よる}まで{待|ま}つ', '{何|なに}もしない'], correct: 1, why: 'Dọn: **{夜|よる}でいい** (để sau). **{先|さき}に** → đi mua đồ.' },
      ],
    },
  ],
};

const BUOI_2: Lesson = {
  id: 'b39-buoi-2-van-noi',
  kind: 'review',
  title: 'Buổi 2 — Văn nói rút gọn (～ちゃう・～なきゃ・～ちゃだめ・～って・～んだ・～じゃん・～っけ・わかんない) · cách nói vòng (ちょっと……) · từ đảo ý (でも・ただ・実は・それより) · từ nhóm C, D · hội thoại ②③ · dạng ポイント理解',
  goal: 'Theo nhịp một buổi trên lớp: ôn ～てる・～とく bằng câu hỏi nhanh, nghe ra các dạng rút gọn ～ちゃう・～なきゃ・～ちゃだめ・～って và đuôi câu ～んだ・～じゃん・～っけ, hiểu đúng ý thật của cách nói vòng, biết câu then chốt nằm sau でも・ただ・実は・それより, học từ nhóm C (cửa hàng) và D (bệnh viện – thủ tục), luyện hội thoại ②③ và làm dạng ポイント理解.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 2 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Ôn bài cũ (5′)** — giáo viên đọc nhanh: "{読|よ}んどいて・{持|も}ってく・もう{取|と}っといた" → cả lớp nói dạng đầy đủ. Hỏi: "Bốn hộp của 課題理解 là gì?".',
        '**Văn nói (15′)** — ② ～ちゃう／～ちゃった · ③ ～なきゃ・～ないと・～ちゃだめ・～なくていい · ④ ～って (bốn nghĩa) · ⑤ ～んだ・～んじゃない？・～じゃん・～っけ・～かな · ⑥ わかんない・とこ・やっぱ.',
        '**Cách nói vòng & từ đảo ý (10′)** — ⑦ ちょっと……・考えておきます · ⑧ でも・ただ・実は・それより・結局 — câu sau là đáp án.',
        '**Từ mới + hội thoại (10′)** — nhóm C ({税込|ぜいこ}み・{領収書|りょうしゅうしょ}・お{釣|つ}り・お{持|も}ち{帰|かえ}り…) + nhóm D ({診察券|しんさつけん}・{体温計|たいおんけい}・{整理券|せいりけん}・{暗証番号|あんしょうばんごう}…) · hội thoại ② (quầy lễ tân, đổi ý) và ③ (điện thoại, 満席・ただ・やっぱり).',
        '**チャレンジ (10′)** — luyện cặp ポイント理解: A kể lý do có hai lý do giả + một lý do thật sau 実は, B trả lời "vì sao". Cuối buổi: 5 câu kiểm tra.',
      ],
    },
    {
      t: 'slides',
      id: 'b39-b2-slides',
      title: 'Bài 39 聴解 — Buổi 2: văn nói · nói vòng · ポイント理解',
      slides: [
        {
          tieuDe: '{第|だい}39{課|か} — {二回目|にかいめ}',
          anh: ['speech-balloon', 'thinking-face', 'speaking-head'],
          nhan: ['{話|はな}し{言葉|ことば}', '{本当|ほんとう}の{意味|いみ}', 'ポイント'],
          dong: ['Hôm nay: **văn nói rút gọn** · **nói vòng** · **từ đảo ý** · **ポイント理解**'],
          ro: ['Hanashi kotoba'],
          ghi: 'Buổi khó nhất của bài — nhiều dạng nhưng chỉ cần NHẬN RA, không bắt các em tự nói với người trên.',
        },
        {
          tieuDe: 'ふくしゅう — {何|なん}の{形|かたち}？',
          anh: ['repeat-button'],
          nhan: ['ふくしゅう'],
          dong: ['{読|よ}んどいて → ?', '{持|も}ってく → ?', 'もう{取|と}っといた → ?'],
          ro: ['Yondoite → ?', 'Motteku → ?', 'Mou tottoita → ?'],
          hoi: '{三|みっ}つの{文|ぶん}の{元|もと}の{形|かたち}を{言|い}ってください。',
          dap: '{読|よ}んでおいて · {持|も}っていく · もう{取|と}っておいた',
          ghi: 'Gọi 3 bạn, mỗi bạn một câu. Bạn nào sai thì cả lớp đọc lại luật: い rơi, て＋お → と.',
        },
        {
          tieuDe: '{話|はな}し{言葉|ことば} ② — ～ちゃう・～ちゃった',
          anh: ['face-with-open-mouth', 'purse'],
          nhan: ['あっ！', '{財布|さいふ}'],
          dong: ['{忘|わす}れてしまった → {忘|わす}れちゃった', '{飲|の}んでしまった → {飲|の}んじゃった', 'バスが{行|い}っちゃうよ！'],
          ro: ['Wasurete shimatta → wasurechatta', 'Nonde shimatta → nonjatta', 'Basu ga icchau yo!'],
          hoi: '{友達|ともだち}が「{財布|さいふ}、{忘|わす}れちゃった」と{言|い}いました。{何|なん}と{答|こた}えますか。',
          dap: 'えっ、{大丈夫|だいじょうぶ}？ {貸|か}そうか。 (không phải よかったね)',
          ghi: 'ちゃった = đã lỡ (đáp: đồng cảm, giúp). ちゃう = sắp mất (cảnh báo).',
        },
        {
          tieuDe: '{話|はな}し{言葉|ことば} ③ — ～なきゃ・～ちゃだめ・～なくていい',
          anh: ['alarm-clock', 'no-entry', 'check-mark-button'],
          nhan: ['なきゃ', 'ちゃだめ', 'なくていい'],
          dong: ['もう{九時|くじ}だ。{帰|かえ}らなきゃ。', 'そのボタン、{押|お}しちゃだめ！', '{名前|なまえ}は{書|か}かなくていいよ。'],
          ro: ['Mou kuji da. Kaeranakya.', 'Sono botan, oshicha dame!', 'Namae wa kakanakute ii yo.'],
          bang: { head: ['Nghe', 'Nghĩa'], rows: [['～なきゃ・～なくちゃ・～ないと', 'PHẢI'], ['～ちゃだめ・～じゃだめ', 'KHÔNG ĐƯỢC'], ['～なくていい', 'KHÔNG CẦN']] },
          hoi: '「{早|はや}く{寝|ね}ないと」は「{寝|ね}なければならない」ですか、「{寝|ね}なくてもいい」ですか。',
          dap: '{寝|ね}なければならない。～ないと đứng cuối câu = PHẢI.',
          ghi: 'Bẫy: ～ないと bỏ lửng KHÔNG phải "nếu không". Và ～なくていい là câu LOẠI đáp án trong 課題理解.',
        },
        {
          tieuDe: '{話|はな}し{言葉|ことば} ④ — ～って',
          anh: ['speech-balloon', 'woman-teacher'],
          nhan: ['って', '{先生|せんせい}'],
          dong: ['{店長|てんちょう}、{遅|おく}れるって。（＝と{言|い}っていた）', '「ひまわり」って{店|みせ}（＝という）', '{明日|あした}、{休講|きゅうこう}なんだって。（＝そうだ）'],
          ro: ['Tenchou, okureru tte.', '"Himawari" tte mise', 'Ashita, kyuukou na n datte.'],
          hoi: '「{先生|せんせい}、レポートは{来週|らいしゅう}でいいって」 — レポートはいつ{出|だ}しますか。',
          dap: '{来週|らいしゅう}。～でいいって = cô bảo… là được.',
          ghi: 'って cuối câu = lời NGƯỜI THỨ BA. Ôn Bài 30.',
        },
        {
          tieuDe: '{話|はな}し{言葉|ことば} ⑤⑥ — ～じゃん・～っけ・わかんない',
          anh: ['thinking-face', 'face-with-raised-eyebrow'],
          nhan: ['～っけ', '～じゃん'],
          dong: ['{試験|しけん}、{何曜日|なんようび}だっけ？', '{言|い}ったじゃん、{三時|さんじ}からって。', 'この{問題|もんだい}、{全然|ぜんぜん}わかんない。'],
          ro: ['Shiken, nan\'youbi dakke?', 'Itta jan, sanji kara tte.', 'Kono mondai, zenzen wakannai.'],
          hoi: '「～っけ」はどんなときに{使|つか}いますか。',
          dap: 'Khi hỏi lại điều mình đã biết nhưng QUÊN.',
          ghi: '～んじゃない？ (lên giọng) = có lẽ / đề xuất; ～んじゃない！ (xuống giọng) = cấm. Đọc mẫu cả hai cho lớp nghe.',
        },
        {
          tieuDe: '{遠回|とおまわ}しな{言|い}い{方|かた} — ちょっと……',
          anh: ['person-tipping-hand', 'cross-mark'],
          nhan: ['ちょっと……', '＝ NO'],
          dong: ['A：{金曜日|きんようび}、{飲|の}みに{行|い}かない？', 'B：{金曜日|きんようび}はちょっと……。{土曜日|どようび}なら。'],
          ro: ['Kin\'youbi, nomi ni ikanai?', 'Kin\'youbi wa chotto……. Doyoubi nara.'],
          hoi: 'Bさんは{金曜日|きんようび}に{行|い}きますか。',
          dap: '{行|い}きません。{土曜日|どようび}なら{行|い}けます。',
          ghi: 'ちょっと + bỏ lửng = từ chối. Sau đó hay có phương án khác (～なら) — đề hỏi "cuối cùng thế nào" thì đáp án là phương án đó. Thêm: {考|かんが}えておきます・{行|い}けたら{行|い}くね = thường là KHÔNG.',
        },
        {
          tieuDe: 'ポイントはどこ？ — でも・ただ・{実|じつ}は・それより',
          anh: ['key', 'backhand-index-pointing-right'],
          nhan: ['ポイント', 'この{後|あと}！'],
          dong: ['{電車|でんしゃ}は{止|と}まってたけど、それは{大丈夫|だいじょうぶ}だった。', '{実|じつ}は、{教室|きょうしつ}が{変|か}わってたのを{知|し}らなくて。'],
          ro: ['Densha wa tomatteta kedo, sore wa daijoubu datta.', 'Jitsu wa, kyoushitsu ga kawatteta no o shiranakute.'],
          hoi: '{遅|おく}れた{本当|ほんとう}の{理由|りゆう}は{何|なん}ですか。',
          dap: '{教室|きょうしつ}が{変|か}わったのを{知|し}らなかったから。',
          ghi: 'Đề ポイント理解: người nói GẠT lý do giả trước (～は大丈夫だった・～わけじゃない), lý do thật sau 実は. Đây là bài nghe 5.',
        },
        {
          tieuDe: '{新|あたら}しいことば ③ — {店|みせ}で',
          anh: ['receipt', 'coin', 'bento-box', 'shopping-bags'],
          nhan: ['{領収書|りょうしゅうしょ}', 'お{釣|つ}り', 'お{持|も}ち{帰|かえ}り', 'レジ{袋|ぶくろ}'],
          dong: ['こちらは{税込|ぜいこ}みの{値段|ねだん}です。', '{店内|てんない}でお{召|め}し{上|あ}がりですか、お{持|も}ち{帰|かえ}りですか。', 'レジ{袋|ぶくろ}はご{利用|りよう}ですか。'],
          ro: ['Kochira wa zeikomi no nedan desu.', 'Tennai de omeshiagari desu ka, omochikaeri desu ka.', 'Rejibukuro wa goriyou desu ka.'],
          hoi: '「{税抜|ぜいぬ}き{千円|せんえん}」のシャツ。{千円|せんえん}で{買|か}えますか。',
          dap: '{買|か}えません。{税金|ぜいきん}が{加|くわ}わるので、{千円|せんえん}より{高|たか}くなります。',
          ghi: 'Cặp đối: 税込み ↔ 税抜き · 店内 ↔ 持ち帰り · 領収書 ↔ レシート. Đề tính tiền hay đặt bẫy ở cặp này.',
        },
        {
          tieuDe: '{新|あたら}しいことば ④ — {病院|びょういん}・{窓口|まどぐち}',
          anh: ['hospital', 'thermometer', 'ticket', 'identification-card'],
          nhan: ['{診察券|しんさつけん}', '{体温計|たいおんけい}', '{整理券|せいりけん}', '{身分証明書|みぶんしょうめいしょ}'],
          dong: ['{診察券|しんさつけん}と{保険証|ほけんしょう}をお{願|ねが}いします。', '{整理券|せいりけん}を{取|と}って、お{待|ま}ちください。', '{暗証番号|あんしょうばんごう}を{入力|にゅうりょく}してください。'],
          ro: ['Shinsatsuken to hokenshou o onegai shimasu.', 'Seiriken o totte, omachi kudasai.', 'Anshou bangou o nyuuryoku shite kudasai.'],
          hoi: 'カードをなくしました。{窓口|まどぐち}で{何|なん}と{言|い}いますか。',
          dap: 'カードを{紛失|ふんしつ}したので、{再発行|さいはっこう}をお{願|ねが}いします。',
          ghi: 'Nhóm D là danh từ Hán — nghe theo âm On từng chữ: しんさつ・けん, みぶん・しょうめい・しょ.',
        },
        {
          tieuDe: '{会話|かいわ} ②③ — {途中|とちゅう}で{変|か}わる！',
          anh: ['woman-health-worker', 'mobile-phone', 'man-cook'],
          nhan: ['{受付|うけつけ}', '{電話|でんわ}', '{小林店長|こばやしてんちょう}'],
          dong: ['{大丈夫|だいじょうぶ}……あ、でも、{念|ねん}のため、{先|さき}に{測|はか}っていただけますか。', '{五時半|ごじはん}からでしたら{大丈夫|だいじょうぶ}です。ただ、{八時|はちじ}から{次|つぎ}のご{予約|よやく}が……。', 'やっぱり、{日曜日|にちようび}はどうですか。'],
          ro: ['Daijoubu …… a, demo, nen no tame, saki ni hakatte itadakemasu ka.', 'Goji han kara deshitara daijoubu desu. Tada, hachiji kara tsugi no goyoyaku ga…….', 'Yappari, nichiyoubi wa dou desu ka.'],
          hoi: 'マリヤムさんは{何曜日|なんようび}に{予約|よやく}しましたか。',
          dap: '{日曜日|にちようび}です。{土曜日|どようび}は{満席|まんせき}、{五時半|ごじはん}は{八時|はちじ}までなので、やめました。',
          ghi: 'Đọc phân vai hai hội thoại. Khoanh tròn trên bảng: あ、でも · ただ · やっぱり — ba chỗ ý thay đổi.',
        },
        {
          tieuDe: 'チャレンジ — どうして？',
          anh: ['busts-in-silhouette', 'red-question-mark'],
          nhan: ['A', 'B'],
          dong: ['A：{昨日|きのう}、パーティーに{行|い}かなかったんだ。{雨|あめ}だったけど、それは{平気|へいき}。{遠|とお}いけど、それもいい。{実|じつ}は、{熱|ねつ}があったんだ。', 'B：そうなんだ。{熱|ねつ}があったから{行|い}かなかったんだね。'],
          ro: ['Kinou, paatii ni ikanakatta n da. Ame datta kedo, sore wa heiki. Tooi kedo, sore mo ii. Jitsu wa, netsu ga atta n da.', 'Sou na n da. Netsu ga atta kara ikanakatta n da ne.'],
          hoi: 'Aの{役|やく}で、{理由|りゆう}を{三|みっ}つ{作|つく}ってください。{本当|ほんとう}の{理由|りゆう}は「{実|じつ}は」のあとに。',
          dap: 'Khuôn: ～けど、それは{平気|へいき}／～わけじゃない → {実|じつ}は、～んだ。',
          ghi: 'B phải trả lời đúng lý do thật. Đổi vai. Giáo viên chọn 2 cặp diễn trước lớp.',
        },
        {
          tieuDe: 'まとめ・{宿題|しゅくだい}',
          anh: ['notebook', 'headphone'],
          nhan: ['まとめ', '{宿題|しゅくだい}'],
          dong: ['ちゃう・なきゃ・ちゃだめ・って・っけ・じゃん・わかんない', 'ちょっと…… = NO · でも／ただ／実は／それより → ポイント'],
          ro: ['chau · nakya · cha dame · tte · kke · jan · wakannai', 'chotto = NO'],
          hoi: '{宿題|しゅくだい}：{聴解|ちょうかい}のBài 5–9 を{聞|き}いて、「{本当|ほんとう}の{理由|りゆう}」の{前|まえ}の{言葉|ことば}に{線|せん}を{引|ひ}いてください。',
          dap: 'Ví dụ Bài 5: 実は · Bài 6: (ので) — sau ありがとうございます…申し訳ございません · Bài 8: 実は.',
          ghi: 'Buổi sau: 概要理解, 発話表現, 即時応答, bẫy đổi ý, cặp âm dễ nhầm, chiến thuật 40 phút + đề mini.',
        },
      ],
    },
    {
      t: 'mcq',
      id: 'b39-b2-y-that',
      title: 'Luyện nhanh — ý thật là gì? (8 câu)',
      items: [
        { q: '「{明日|あした}はちょっと……」', options: ['đồng ý', 'từ chối', 'chưa quyết', 'hỏi lại'], correct: 1, why: '**ちょっと + bỏ lửng** = từ chối.' },
        { q: '「{傘|かさ}、{持|も}ってきちゃった」', options: ['sẽ mang', 'đã lỡ mang (tới)', 'phải mang', 'không được mang'], correct: 1, why: '**～てきちゃった** = ～てきてしまった.' },
        { q: '「{今日中|きょうじゅう}に{出|だ}さなきゃ」', options: ['phải nộp trong hôm nay', 'không cần nộp', 'đã nộp rồi', 'không được nộp'], correct: 0, why: '**～なきゃ** = phải.' },
        { q: '「ここで{写真|しゃしん}を{撮|と}っちゃだめ」', options: ['nên chụp', 'được chụp', 'không được chụp', 'đã lỡ chụp'], correct: 2, why: '**～ちゃだめ** = ～てはだめ: cấm.' },
        { q: '「{集合|しゅうごう}、{何時|なんじ}だっけ？」', options: ['hỏi lại điều quên', 'mời đi', 'báo giờ mới', 'từ chối'], correct: 0, why: '**～っけ** = hỏi lại điều đã biết mà quên.' },
        { q: '「{考|かんが}えておきます」（{店|みせ}で{店員|てんいん}に）', options: ['chắc chắn sẽ mua', 'thường là không mua (từ chối nhẹ)', 'đã mua', 'nhờ nhân viên suy nghĩ'], correct: 1, why: 'Cách nói vòng — thường là **từ chối nhẹ**.' },
        { q: '「{料理|りょうり}はおいしかったけど、{高|たか}かったね」 — {一番|いちばん}{言|い}いたいのは？', options: ['ngon', 'đắt', 'muốn đi lại', 'đông'], correct: 1, why: 'Ý chính sau **けど**: {高|たか}かった.' },
        { q: '「{遅刻|ちこく}したわけじゃないんだ。{実|じつ}は{忘|わす}れ{物|もの}をしたんだ」 — {問題|もんだい}は？', options: ['đi muộn', 'để quên đồ', 'không đi', 'bị ốm'], correct: 1, why: '**～わけじゃない** gạt lý do giả; sau **{実|じつ}は** là thật.' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**Nhận ra, không cần bắt chước với người trên** — ～ちゃった・～じゃん・わかんない là văn nói bạn bè. Với thầy cô / sếp vẫn nói đầy đủ (～てしまいました・わかりません).',
        '**ちょっと…… = KHÔNG** — và nghe tiếp phương án thay thế sau nó (～なら・～はどう？).',
        '**Đề ポイント理解 = tìm câu sau でも・ただ・実は・それより** — câu trước là bẫy (lý do bị gạt, điều kiện chưa đủ).',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 2)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '「{行|い}かなきゃ」は、もとの{形|かたち}で{言|い}うと{何|なん}ですか。', ro: '"Ikanakya" wa, moto no katachi de iu to nan desu ka.', vi: '"Ikanakya" nói ở dạng gốc là gì?' },
        { who: 'Bạn', role: 'candidate', text: '「{行|い}かなければならない」です。', ro: '"Ikanakereba naranai" desu.', vi: 'Là "ikanakereba naranai" ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{友達|ともだち}に「{土曜日|どようび}はちょっと……」と{言|い}われました。どういう{意味|いみ}ですか。', ro: 'Tomodachi ni "doyoubi wa chotto……" to iwaremashita. Dou iu imi desu ka.', vi: 'Bạn em nói "Thứ Bảy thì hơi…". Nghĩa là gì?' },
        { who: 'Bạn', role: 'candidate', text: '{土曜日|どようび}は{都合|つごう}が{悪|わる}いという{意味|いみ}です。はっきり{言|い}いませんが、{断|ことわ}っています。', ro: 'Doyoubi wa tsugou ga warui to iu imi desu. Hakkiri iimasen ga, kotowatte imasu.', vi: 'Nghĩa là thứ Bảy bạn ấy không tiện ạ. Không nói thẳng nhưng là từ chối.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{問題|もんだい}2で、{答|こた}えはどこにあることが{多|おお}いですか。', ro: 'Mondai ni de, kotae wa doko ni aru koto ga ooi desu ka.', vi: 'Ở Mondai 2, đáp án thường nằm ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: '「でも」や「{実|じつ}は」や「それより」のあとにあることが{多|おお}いです。その{前|まえ}の{理由|りゆう}は、だいたい{違|ちが}います。', ro: '"Demo" ya "jitsu wa" ya "sore yori" no ato ni aru koto ga ooi desu. Sono mae no riyuu wa, daitai chigaimasu.', vi: 'Thường nằm sau "demo", "jitsu wa", "sore yori" ạ. Lý do trước đó thường là sai.' },
        { who: '{先生|せんせい}', role: 'examiner', text: 'お{店|みせ}で「{店内|てんない}でお{召|め}し{上|あ}がりですか」と{聞|き}かれました。{持|も}って{帰|かえ}りたいとき、{何|なん}と{答|こた}えますか。', ro: 'Omise de "tennai de omeshiagari desu ka" to kikaremashita. Motte kaeritai toki, nan to kotaemasu ka.', vi: 'Ở quán, em được hỏi "Quý khách dùng tại chỗ ạ?". Muốn mang về thì em trả lời thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '「いえ、{持|も}ち{帰|かえ}りでお{願|ねが}いします」と{答|こた}えます。', ro: '"Ie, mochikaeri de onegai shimasu" to kotaemasu.', vi: 'Em trả lời "Không, cho tôi mang về" ạ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b39-b2-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: '「{先生|せんせい}、{明日|あした}{休|やす}みだって」の「って」は？', options: ['という', 'と{言|い}っていた', 'は', 'でも'], correct: 1, why: '**って** cuối câu = **と{言|い}っていた** (kể lời).' },
        { q: '「もう{行|い}かないと」の{意味|いみ}は？', options: ['もう{行|い}かなければならない', 'もう{行|い}かなくてもいい', 'もう{行|い}かないつもりだ', '{行|い}かないと{思|おも}う'], correct: 0, why: '**～ないと** đứng cuối câu = ～ないといけない: phải.' },
        { q: 'お{店|みせ}で「お{会計|かいけい}お{願|ねが}いします」と{言|い}うのは、いつですか。', options: ['{店|みせ}に{入|はい}るとき', '{注文|ちゅうもん}するとき', 'お{金|かね}を{払|はら}うとき', '{席|せき}を{予約|よやく}するとき'], correct: 2, why: '**{会計|かいけい}** = thanh toán.' },
        { q: '「{安|やす}いんだけど、ちょっと{遠|とお}いんだよね」 — {話|はな}し{手|て}の{気持|きも}ちは？', options: ['とても{気|き}に{入|い}っている', 'あまりよくないと{思|おも}っている', '{安|やす}いからすぐ{決|き}めたい', '{遠|とお}いほうがいい'], correct: 1, why: 'Sau **けど** là điểm trừ → không hài lòng lắm.' },
        { q: '「その{時間|じかん}は{満席|まんせき}なんです」と{言|い}われました。{何|なん}と{答|こた}えますか。', options: ['じゃあ、その{時間|じかん}で。', 'そうですか。{何時|なんじ}なら{空|あ}いていますか。', '{満席|まんせき}でよかったです。', 'もう{一度|いちど}{満席|まんせき}にしてください。'], correct: 1, why: 'Hết chỗ → hỏi phương án khác.' },
      ],
    },
  ],
};

const BUOI_3: Lesson = {
  id: 'b39-buoi-3-chien-thuat',
  kind: 'review',
  title: 'Buổi 3 — 概要理解 (ý chính, thái độ) · 発話表現 (ai làm, mức lịch sự) · 即時応答 (phản ứng tự nhiên) · bẫy đổi ý · cặp âm dễ nhầm · từ nhóm E, F · chiến thuật 40 phút + đề mini',
  goal: 'Theo nhịp một buổi trên lớp: ôn văn nói và từ đảo ý bằng 4 câu nghe nhanh, làm ba dạng không có lựa chọn in sẵn (概要理解・発話表現・即時応答), nghe ra bẫy đổi ý (あ、やっぱり・いや・～じゃなくて・訂正いたします) và các cặp âm dễ nhầm, học từ nhóm E (trường – sự kiện – đặt chỗ) và F (phó từ của lời nói), nắm 10 luật làm đề và cách phân 40 phút, rồi làm đề nghe mini.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 3 học gì (theo trình tự giáo viên giảng)',
      items: [
        '**Ôn bài cũ (5′)** — giáo viên đọc 4 câu: "{行|い}かなきゃ・{日曜|にちよう}はちょっと……・{実|じつ}は{寝坊|ねぼう}したんだ・{言|い}ったじゃん" → lớp nói ý thật.',
        '**Ba dạng không in lựa chọn (20′)** — 問題3 概要理解 (ý chính ở câu kết, thái độ ở けど・まあ・どうせ) · 問題4 発話表現 (nhìn tranh: ai nói với ai, mình hay người kia làm) · 問題5 即時応答 (câu lặp từ = bẫy).',
        '**Bẫy (8′)** — ⑩ đổi ý giữa chừng · ⑪ cặp âm dễ nhầm ({来|き}てよかった ↔ {来|く}ればよかった, {病院|びょういん} ↔ {美容院|びよういん}, {四日|よっか} ↔ {八日|ようか}).',
        '**Từ mới (7′)** — nhóm E ({補習|ほしゅう}・{訂正|ていせい}・{開催|かいさい}・{雨天|うてん}・{満席|まんせき}・{空席|くうせき}・{請求書|せいきゅうしょ}・{手数料|てすうりょう}・{再配達|さいはいたつ}) + nhóm F (とりあえず・さっそく・ついでに・どうせ・せめて・なんとか・{早|はや}める・{遅|おく}らせる・{配|くば}る).',
        '**Chiến thuật + đề mini (10′)** — 10 luật làm đề, phân 40 phút. Bài về nhà: Luyện thêm 5 — đề nghe mini 20 phút có thang điểm.',
      ],
    },
    {
      t: 'slides',
      id: 'b39-b3-slides',
      title: 'Bài 39 聴解 — Buổi 3: 概要理解 · 発話表現 · 即時応答 · chiến thuật',
      slides: [
        {
          tieuDe: '{第|だい}39{課|か} — {三回目|さんかいめ}',
          anh: ['bullseye', 'stopwatch', 'trophy'],
          nhan: ['ポイント', '40{分|ぷん}', '{合格|ごうかく}'],
          dong: ['Hôm nay: **問題3・4・5** · **bẫy đổi ý** · **chiến thuật 40 phút**'],
          ro: ['Mondai san, yon, go'],
          ghi: 'Ba dạng hôm nay KHÔNG in lựa chọn — khi luyện, che lựa chọn, nói đáp án trước rồi mới mở.',
        },
        {
          tieuDe: 'ふくしゅう — {本当|ほんとう}の{意味|いみ}は？',
          anh: ['repeat-button', 'thinking-face'],
          nhan: ['ふくしゅう', '？'],
          dong: ['もう{行|い}かなきゃ。', '{日曜|にちよう}はちょっと……。', '{実|じつ}は{寝坊|ねぼう}したんだ。', '{言|い}ったじゃん。'],
          ro: ['Mou ikanakya.', 'Nichiyou wa chotto…….', 'Jitsu wa nebou shita n da.', 'Itta jan.'],
          hoi: '{四|よっ}つの{文|ぶん}の{本当|ほんとう}の{意味|いみ}を{言|い}ってください。',
          dap: 'phải đi · từ chối · lý do thật: ngủ quên · tớ đã nói rồi còn gì.',
          ghi: 'Đọc nhanh như người Nhật nói. Lớp trả lời bằng tiếng Việt cũng được.',
        },
        {
          tieuDe: '{問題|もんだい}3 {概要理解|がいようりかい} — {最後|さいご}を{聞|き}く',
          anh: ['radio', 'memo', 'key'],
          nhan: ['ラジオ', 'メモ', '{最後|さいご}'],
          dong: ['{話|はなし}の{形|かたち}：テーマ → {例|れい} → ですから・つまり → {一番|いちばん}{大切|たいせつ}なのは～', '{質問|しつもん}：{何|なに}について？・{一番|いちばん}{言|い}いたいことは？・どう{思|おも}っていますか？'],
          ro: ['teema → rei → desukara · tsumari → ichiban taisetsu na no wa ~', 'nani ni tsuite? · ichiban iitai koto wa? · dou omotte imasu ka?'],
          hoi: '{佐藤先生|さとうせんせい}の{話|はなし}（Bài 13）で、{一番|いちばん}{大切|たいせつ}なことは{何|なん}でしたか。',
          dap: 'わからない{言葉|ことば}があっても、{話|はなし}の{流|なが}れをつかむこと。',
          ghi: 'Mẹo: ghi 2–3 từ khoá lặp lại + câu kết. Chi tiết sau なお thường là bẫy (Bài 12).',
        },
        {
          tieuDe: '{気持|きも}ちを{聞|き}く — けど・まあ・どうせ',
          anh: ['hot-beverage', 'face-with-diagonal-mouth'],
          nhan: ['カフェ', 'まあまあ'],
          dong: ['コーヒーはおいしいんだけど、いつも{満席|まんせき}で……。', 'まあ、{持|も}ち{帰|かえ}りならいいかな。', 'どうせ{行|い}っても、もう{売|う}り{切|き}れだよ。'],
          ro: ['Koohii wa oishii n da kedo, itsumo manseki de…….', 'Maa, mochikaeri nara ii kana.', 'Douse itte mo, mou urikire da yo.'],
          hoi: 'この{人|ひと}はカフェが{好|す}きですか。',
          dap: 'Thích cà phê, nhưng không thích ngồi trong quán (luôn kín chỗ) — chỉ ổn nếu mang về.',
          ghi: 'Thái độ = điều sau けど + câu kết có まあ／かな. どうせ = buông xuôi, tiêu cực.',
        },
        {
          tieuDe: '{問題|もんだい}4 {発話表現|はつわひょうげん} — だれが、だれに？',
          anh: ['man-office-worker', 'receipt', 'backhand-index-pointing-right'],
          nhan: ['{客|きゃく}', '{領収書|りょうしゅうしょ}', '→ {自分|じぶん}'],
          dong: ['{客|きゃく}：{領収書|りょうしゅうしょ}をいただけますか。', '{店員|てんいん}：{領収書|りょうしゅうしょ}はいかがですか。', '✗ {領収書|りょうしゅうしょ}を{差|さ}し{上|あ}げます。（{客|きゃく}が{言|い}う？）'],
          ro: ['Ryoushuusho o itadakemasu ka.', 'Ryoushuusho wa ikaga desu ka.', '✗ Ryoushuusho o sashiagemasu.'],
          hoi: '{先生|せんせい}に{締|し}め{切|き}りを{聞|き}き{直|なお}します。{何|なん}と{言|い}いますか。',
          dap: '{締|し}め{切|き}りは{何日|なんにち}とおっしゃいましたか。 (không phải だっけ？)',
          ghi: 'Ba câu của 問題4 khác nhau ở: AI làm (てもらう ↔ てあげる), HƯỚNG kính ngữ (いただく ↔ 差し上げる), MỨC lịch sự (với cô ↔ với bạn).',
        },
        {
          tieuDe: '{問題|もんだい}5 {即時応答|そくじおうとう} — {自然|しぜん}な{返事|へんじ}',
          anh: ['speech-balloon', 'high-voltage'],
          nhan: ['{一言|ひとこと}', 'すぐ！'],
          dong: ['A：あ、{財布|さいふ}{忘|わす}れてきちゃった。', 'B：✗ よかったね。', 'B：○ えっ、{大丈夫|だいじょうぶ}？ {貸|か}そうか。'],
          ro: ['A, saifu wasurete kichatta.', '✗ Yokatta ne.', '○ E, daijoubu? Kasou ka.'],
          hoi: '「なんとか{終電|しゅうでん}に{間|ま}に{合|あ}ったよ」 — {何|なん}と{答|こた}えますか。',
          dap: 'それはよかった。{走|はし}ったの？',
          ghi: 'Hỏi mình trước: câu này là HỎI / NHỜ / MỜI / THAN / BÁO TIN? Câu đáp lặp lại từ của câu hỏi gần như luôn là bẫy.',
        },
        {
          tieuDe: 'ひっかけ ① — {途中|とちゅう}で{変|か}わる',
          anh: ['counterclockwise-arrows-button', 'four-oclock'],
          nhan: ['{変|か}わる', '{時間|じかん}'],
          dong: ['{四時|よじ}に{来|き}て。……あ、ごめん、{四時半|よじはん}で。', 'コーヒー。あ、やっぱり{紅茶|こうちゃ}で。', '{東口|ひがしぐち}じゃなくて、{西口|にしぐち}です。'],
          ro: ['Yoji ni kite. …… A, gomen, yoji han de.', 'Koohii. A, yappari koucha de.', 'Higashiguchi ja nakute, nishiguchi desu.'],
          hoi: '{三|みっ}つの{文|ぶん}で、{最後|さいご}に{決|き}まったことは{何|なん}ですか。',
          dap: '4 giờ rưỡi · trà đen · cửa Tây.',
          ghi: 'Dấu hiệu đổi ý: あ、ごめん・あ、やっぱり・いや、待って・～じゃなくて・訂正いたします. Đáp án = điều nói SAU CÙNG.',
        },
        {
          tieuDe: 'ひっかけ ② — {似|に}ている{音|おと}',
          anh: ['ear', 'hospital', 'barber-pole'],
          nhan: ['{聞|き}く', '{病院|びょういん}', '{美容院|びよういん}'],
          dong: ['{来|き}てよかった ↔ {来|く}ればよかった', '{病院|びょういん}（byouin）↔ {美容院|びよういん}（biyouin）', '{四日|よっか} ↔ {八日|ようか} ・ おばさん ↔ おばあさん'],
          ro: ['kite yokatta ↔ kureba yokatta', 'byouin ↔ biyouin', 'yokka ↔ youka · obasan ↔ obaasan'],
          hoi: '「{早|はや}く{来|く}ればよかった」 — この{人|ひと}は{早|はや}く{来|き}ましたか。',
          dap: '{来|き}ませんでした。～ばよかった = giá mà (thực tế không làm).',
          ghi: 'Cho lớp đọc to từng cặp 3 lần, rồi giáo viên đọc ngẫu nhiên một từ — lớp giơ tay A hay B.',
        },
        {
          tieuDe: '{新|あたら}しいことば ⑤ — {学校|がっこう}・イベント・{予約|よやく}',
          anh: ['school', 'umbrella-with-rain-drops', 'calendar', 'package'],
          nhan: ['{補習|ほしゅう}', '{雨天|うてん}', '{満席|まんせき}', '{再配達|さいはいたつ}'],
          dong: ['{雨天|うてん}の{場合|ばあい}は、{体育館|たいいくかん}で{行|おこな}います。', '{先|さき}ほどのお{知|し}らせを{訂正|ていせい}いたします。', '{留守|るす}だったので、{再配達|さいはいたつ}を{頼|たの}んだ。'],
          ro: ['Uten no baai wa, taiikukan de okonaimasu.', 'Sakihodo no oshirase o teisei itashimasu.', 'Rusu datta node, saihaitatsu o tanonda.'],
          hoi: '「{訂正|ていせい}いたします」のあとの{情報|じょうほう}と{前|まえ}の{情報|じょうほう}、どちらが{正|ただ}しいですか。',
          dap: 'Thông tin SAU (đã được sửa).',
          ghi: '雨天 đọc うてん (không phải あめてん). 満席 (hết ghế) ↔ 満員 (đầy người).',
        },
        {
          tieuDe: '{新|あたら}しいことば ⑥ — とりあえず・ついでに・どうせ・せめて',
          anh: ['person-running', 'convenience-store', 'face-exhaling', 'folded-hands'],
          nhan: ['とりあえず', 'ついでに', 'どうせ', 'せめて'],
          dong: ['とりあえず{会議室|かいぎしつ}に{来|き}て。', 'コンビニ{行|い}くなら、ついでに{牛乳|ぎゅうにゅう}も。', 'せめて{連絡|れんらく}だけでもしてほしかった。'],
          ro: ['Toriaezu kaigishitsu ni kite.', 'Konbini iku nara, tsuide ni gyuunyuu mo.', 'Semete renraku dake demo shite hoshikatta.'],
          hoi: '「{出発|しゅっぱつ}を{一時間|いちじかん}{早|はや}めます」。{出発|しゅっぱつ}は{九時|くじ}でした。{新|あたら}しい{時間|じかん}は？',
          dap: '{八時|はちじ}。({遅|おく}らせる thì là {十時|じゅうじ}.)',
          ghi: 'とりあえず = dấu hiệu "làm NGAY" của 課題理解; ついでに = làm SAU việc chính.',
        },
        {
          tieuDe: '{試験|しけん}のコツ — 10のルール',
          anh: ['clipboard', 'pencil', 'stopwatch'],
          nhan: ['{選択肢|せんたくし}', 'メモ', '{時間|じかん}'],
          dong: ['① Đọc lựa chọn trước · ② Có / không có câu hỏi trước · ③ Câu hỏi lần đầu là quan trọng nhất', '④ Ghi ký hiệu ○ ✕ → ? · ⑤ Câu sau でも／実は là thật · ⑥ Sót thì đi tiếp', '⑦ 問題3: câu kết · ⑧ 問題4: nhìn tranh trước · ⑨ 問題5: chọn phản ứng tự nhiên · ⑩ Không để trống'],
          ro: ['sentakushi o saki ni yomu · shitsumon ga saki ka dou ka · saisho no shitsumon', 'kigou de memo · demo / jitsu wa no ato · kikinogashitara tsugi e', 'mondai san: saigo · mondai yon: e o saki ni · mondai go: shizen na henji · kuuhaku ni shinai'],
          hoi: '{問題|もんだい}2で、{質問|しつもん}のあとの{二十秒|にじゅうびょう}に{何|なに}をしますか。',
          dap: 'Đọc 4 lựa chọn, gạch chân chỗ KHÁC nhau giữa chúng — đó là thứ phải nghe.',
          ghi: 'Phát bảng 10 luật (mục Văn nói & mẹo nghe ⑫). Nhấn: đề chỉ phát MỘT lần, không có thời gian quay lại.',
        },
        {
          tieuDe: '40{分|ぷん}の{使|つか}い{方|かた}',
          anh: ['hourglass-not-done', 'stopwatch'],
          nhan: ['40{分|ぷん}', '{一問|いちもん}{十秒|じゅうびょう}'],
          bang: { head: ['Phần', 'Thời gian', 'Trong khoảng lặng'], rows: [['問題1（6）', '~10′', 'đọc lựa chọn câu sau'], ['問題2（6）', '~12′', 'gạch chân chỗ khác nhau'], ['問題3（3）', '~6′', 'ghi từ khoá + câu kết'], ['問題4（4）', '~4′', 'nhìn tranh câu sau'], ['問題5（9）', '~6′', 'chọn ngay']] },
          hoi: '{答|こた}えがわからないとき、どうしますか。',
          dap: 'Chọn đáp án hợp lý nhất rồi chuyển câu — không để trống, không nghĩ lâu.',
          ghi: 'Luyện thêm 5 là đề mini 20 phút cùng nhịp này — làm như thi thật, không dừng băng.',
        },
        {
          tieuDe: 'チャレンジ — {即時応答|そくじおうとう}ゲーム',
          anh: ['busts-in-silhouette', 'high-voltage'],
          nhan: ['A', 'B'],
          dong: ['A：（{一言|ひとこと}）{明日|あした}のテスト、{範囲|はんい}どこだっけ？', 'B：（すぐ）{三課|さんか}から{五課|ごか}までだって。'],
          ro: ['Ashita no tesuto, han\'i doko dakke?', 'Sanka kara goka made datte.'],
          hoi: 'A の{役|やく}で、{一言|ひとこと}を{五|いつ}つ{作|つく}ってください（{頼|たの}む・{誘|さそ}う・{謝|あやま}る・{困|こま}る・うれしい）。',
          dap: 'B phải đáp trong 3 giây, đúng loại câu: nhờ → nhận lời; mời → nhận / từ chối vòng; than → đồng cảm; tin vui → chúc mừng.',
          ghi: 'Chơi theo nhóm 4 người, mỗi lượt 1 phút. Nhóm nào đáp sai loại câu bị trừ điểm.',
        },
        {
          tieuDe: 'まとめ・{宿題|しゅくだい}',
          anh: ['notebook', 'trophy'],
          nhan: ['まとめ', '{模擬試験|もぎしけん}'],
          dong: ['問題3 = câu kết · 問題4 = ai làm, với ai · 問題5 = phản ứng tự nhiên', 'Bẫy: đổi ý · cặp âm · câu lặp từ'],
          ro: ['Mondai san = saigo no bun · mondai yon = dare ga, dare ni · mondai go = shizen na hannou', 'Hikkake: kawaru · nite iru oto · onaji kotoba'],
          hoi: '{宿題|しゅくだい}：Luyện thêm 4（{十六|じゅうろく}の{聴解|ちょうかい}）と Luyện thêm 5（ミニ{模擬試験|もぎしけん}{二十分|にじゅっぷん}）。',
          dap: 'Đạt ≥ 10/14 câu ở đề mini là sẵn sàng cho Bài 40 (ôn tập & thi thử N3).',
          ghi: 'Nhắc: shadowing 12 câu then chốt (mục Luyện nói) mỗi ngày 5 phút cho tới ngày thi.',
        },
      ],
    },
    {
      t: 'mcq',
      id: 'b39-b3-bay',
      title: 'Luyện nhanh — điều được quyết định cuối cùng / ý thật (8 câu)',
      items: [
        { q: '「{集合|しゅうごう}は{九時|くじ}……いや、{八時半|はちじはん}にしよう」', options: ['{九時|くじ}', '{八時半|はちじはん}', '{九時半|くじはん}', 'まだ{決|き}まっていない'], correct: 1, why: '**いや** → câu sau: 8:30.' },
        { q: '「{会場|かいじょう}は{三階|さんがい}じゃなくて{四階|よんかい}です」', options: ['{三階|さんがい}', '{四階|よんかい}', '{三階|さんがい}と{四階|よんかい}', '{二階|にかい}'], correct: 1, why: '**A じゃなくて B** → B.' },
        { q: '「{早|はや}く{来|き}てよかった」 — この{人|ひと}は？', options: ['{早|はや}く{来|き}た', '{早|はや}く{来|こ}なかった', '{遅|おく}れて{来|き}た', '{来|こ}なかった'], correct: 0, why: '**～てよかった** = may mà đã làm.' },
        { q: '「{美容院|びよういん}に{行|い}ってきた」 — どこに{行|い}きましたか。', options: ['bệnh viện', 'tiệm làm tóc', 'thư viện', 'hiệu thuốc'], correct: 1, why: '**びよういん** (bi-yo-u-in) = tiệm làm tóc; びょういん = bệnh viện.' },
        { q: '「{先|さき}ほどの{三番線|さんばんせん}は、{五番線|ごばんせん}の{誤|あやま}りでした。{訂正|ていせい}いたします」', options: ['{三番線|さんばんせん}', '{五番線|ごばんせん}', 'どちらも', 'わからない'], correct: 1, why: '**{訂正|ていせい}** → thông tin sửa lại: số 5.' },
        { q: '「{会議|かいぎ}を{三十分|さんじゅっぷん}{遅|おく}らせます」 — {会議|かいぎ}は{二時|にじ}でした。', options: ['{一時半|いちじはん}', '{二時|にじ}', '{二時半|にじはん}', '{三時|さんじ}'], correct: 2, why: '**{遅|おく}らせる** = lùi lại → 2:30.' },
        { q: '「どうせ{間|ま}に{合|あ}わないよ」 — {話|はな}し{手|て}の{気持|きも}ちは？', options: ['buông xuôi, chán', 'vui vẻ', 'quyết tâm', 'ngạc nhiên'], correct: 0, why: '**どうせ** = đằng nào cũng… (tiêu cực, buông xuôi).' },
        { q: '「{十四日|じゅうよっか}」と「{四日|よっか}」 — {聞|き}き{分|わ}けるポイントは？', options: ['âm じゅう ở đầu', 'trường âm cuối', 'âm ngắt っ', 'không phân biệt được'], correct: 0, why: '{十四日|じゅうよっか} = **juu**-yokka; {四日|よっか} = yokka. Nghe âm đầu.' },
      ],
    },
    {
      t: 'note',
      title: 'Giáo viên nhấn mạnh 3 điều',
      items: [
        '**Ba dạng không in lựa chọn** — luyện bằng cách CHE lựa chọn: nghe xong tự nói ý chính / câu nói / câu đáp, rồi mới so.',
        '**Điều nói SAU CÙNG thắng** — sau あ、ごめん・やっぱり・いや・～じゃなくて・訂正いたします.',
        '**Không để trống, không quay lại** — đề phát một lần; chọn đáp án hợp lý nhất rồi đọc lựa chọn câu tiếp theo.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Giáo viên hay hỏi gì khi gọi phát biểu (Buổi 3)',
      lines: [
        { who: '{先生|せんせい}', role: 'examiner', text: '{問題|もんだい}3で、{話|はな}し{手|て}が{一番|いちばん}{言|い}いたいことは、どこによく{出|で}てきますか。', ro: 'Mondai san de, hanashite ga ichiban iitai koto wa, doko ni yoku dete kimasu ka.', vi: 'Ở Mondai 3, điều người nói muốn nói nhất thường xuất hiện ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: '{話|はなし}の{最後|さいご}によく{出|で}てきます。「{一番|いちばん}{大切|たいせつ}なのは」や「ですから」のあとです。', ro: 'Hanashi no saigo ni yoku dete kimasu. "Ichiban taisetsu na no wa" ya "desukara" no ato desu.', vi: 'Thường ở cuối bài nói ạ. Sau "điều quan trọng nhất là" hoặc "vì vậy".' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{問題|もんだい}4で、{先生|せんせい}に{話|はな}すときと{友達|ともだち}に{話|はな}すときは、どう{違|ちが}いますか。', ro: 'Mondai yon de, sensei ni hanasu toki to tomodachi ni hanasu toki wa, dou chigaimasu ka.', vi: 'Ở Mondai 4, nói với thầy cô và nói với bạn khác nhau thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{先生|せんせい}には「おっしゃいましたか」のような{敬語|けいご}を{使|つか}います。{友達|ともだち}には「だっけ？」や「くれる？」でいいです。', ro: 'Sensei ni wa "osshaimashita ka" no you na keigo o tsukaimasu. Tomodachi ni wa "dakke?" ya "kureru?" de ii desu.', vi: 'Với thầy cô em dùng kính ngữ như "osshaimashita ka". Với bạn thì "dakke?", "kureru?" là được ạ.' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{友達|ともだち}が「なんとか{間|ま}に{合|あ}ったよ」と{言|い}いました。{間|ま}に{合|あ}いましたか。', ro: 'Tomodachi ga "nantoka ma ni atta yo" to iimashita. Ma ni aimashita ka.', vi: 'Bạn em nói "nantoka ma ni atta yo". Bạn ấy có kịp không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、{間|ま}に{合|あ}いました。{大変|たいへん}だったけど、{間|ま}に{合|あ}ったという{意味|いみ}です。だから「よかったね」と{答|こた}えます。', ro: 'Hai, ma ni aimashita. Taihen datta kedo, ma ni atta to iu imi desu. Dakara "yokatta ne" to kotaemasu.', vi: 'Có ạ. Nghĩa là vất vả nhưng đã kịp. Vì vậy em đáp "may quá nhỉ".' },
        { who: '{先生|せんせい}', role: 'examiner', text: '{試験|しけん}で{一問|いちもん}{聞|き}き{逃|のが}してしまったら、どうしますか。', ro: 'Shiken de ichimon kikinogashite shimattara, dou shimasu ka.', vi: 'Nếu trong lúc thi em nghe sót một câu thì làm thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{一番|いちばん}よさそうな{答|こた}えを{選|えら}んで、すぐ{次|つぎ}の{問題|もんだい}の{準備|じゅんび}をします。{前|まえ}の{問題|もんだい}のことは{考|かんが}えません。', ro: 'Ichiban yosasou na kotae o erande, sugu tsugi no mondai no junbi o shimasu. Mae no mondai no koto wa kangaemasen.', vi: 'Em chọn đáp án có vẻ đúng nhất rồi chuẩn bị ngay cho câu sau. Không nghĩ về câu trước nữa ạ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b39-b3-cuoi-buoi',
      title: 'Kiểm tra cuối buổi (5 câu)',
      items: [
        { q: '{問題|もんだい}4で、{店|みせ}の{客|きゃく}が{言|い}う{言葉|ことば}はどれですか。', options: ['お{取|と}りしましょうか', 'いかがですか', '{空|あ}いていますか', 'かしこまりました'], correct: 2, why: 'Khách HỎI còn chỗ: **{空|あ}いていますか**. Ba câu kia là của nhân viên.' },
        { q: '「{雨天|うてん}{決行|けっこう}」の{意味|いみ}は？', options: ['mưa thì huỷ', 'mưa vẫn tổ chức', 'mưa thì hoãn', 'chỉ tổ chức khi mưa'], correct: 1, why: '**{雨天決行|うてんけっこう}** = mưa vẫn tổ chức; {雨天中止|うてんちゅうし} = mưa thì huỷ.' },
        { q: '「コーヒーは{安|やす}いけど、まあ、もう{行|い}かないかな」 — {気持|きも}ちは？', options: ['また{行|い}きたい', 'あまり{行|い}きたくない', 'とても{気|き}に{入|い}った', '{安|やす}いからうれしい'], correct: 1, why: 'Câu kết có **まあ……かな** + もう{行|い}かない → không muốn đi nữa.' },
        { q: '{友達|ともだち}「{傘|かさ}、{貸|か}してくれない？」 — {自然|しぜん}な{返事|へんじ}は？', options: ['うん、いいよ。はい。', '{貸|か}してくれないよ。', '{傘|かさ}を{貸|か}してよかったね。', 'じゃあ、{傘|かさ}を{借|か}りるね。'], correct: 0, why: 'Được nhờ → **nhận lời**. 2 lặp từ; 4 ngược vai.' },
        { q: '{聴解|ちょうかい}の{試験|しけん}で、{正|ただ}しいのはどれですか。', options: ['{音声|おんせい}は{二回|にかい}{流|なが}れる', 'わからないときは{答|こた}えを{書|か}かない', '{問題|もんだい}1・2は{選択肢|せんたくし}を{先|さき}に{読|よ}める', '{問題|もんだい}5は{絵|え}を{見|み}て{答|こた}える'], correct: 2, why: '問題1・2 in lựa chọn — **đọc trước**. Âm thanh phát MỘT lần; không để trống; 問題5 không có tranh.' },
      ],
    },
  ],
};

/* ═══════════════════════ ③ LUYỆN THÊM DỄ → KHÓ ═══════════════════════ */

type Mcq = Extract<Block, { t: 'mcq' }>['items'][number];

/** Bộ từ cho trắc nghiệm Nhật → Việt / Việt → Nhật (đúng 67 từ của mục Từ vựng; nghĩa không trùng nhau). */
const TU_LT: [w: string, ro: string, vi: string][] = [
  ['{聴解|ちょうかい}', 'choukai', 'nghe hiểu (phần thi)'],
  ['{聞|き}き{逃|のが}す', 'kikinogasu', 'nghe sót'],
  ['{聞|き}き{流|なが}す', 'kikinagasu', 'nghe cho qua'],
  ['{聞|き}き{覚|おぼ}え', 'kikioboe', 'cảm giác đã từng nghe'],
  ['{早口|はやくち}', 'hayakuchi', 'nói nhanh'],
  ['{相|あい}づち', 'aizuchi', 'tiếng đệm khi nghe'],
  ['{話|はな}し{手|て}', 'hanashite', 'người nói'],
  ['{聞|き}き{手|て}', 'kikite', 'người nghe'],
  ['{見込|みこ}み', 'mikomi', 'dự kiến'],
  ['{呼|よ}び{出|だ}し', 'yobidashi', 'việc gọi tên, gọi qua loa'],
  ['アナウンス', 'anaunsu', 'thông báo qua loa'],
  ['{間|ま}もなく', 'mamonaku', 'sắp, chẳng bao lâu nữa'],
  ['{白線|はくせん}', 'hakusen', 'vạch trắng'],
  ['{車内|しゃない}', 'shanai', 'trong toa, trong xe'],
  ['～{番線|ばんせん}', '~bansen', 'đường ray số…'],
  ['{発車|はっしゃ}', 'hassha', '(tàu, xe) chuyển bánh'],
  ['{各駅停車|かくえきていしゃ}', 'kakueki teisha', 'tàu dừng mọi ga'],
  ['{快速|かいそく}', 'kaisoku', 'tàu nhanh'],
  ['{急行|きゅうこう}', 'kyuukou', 'tàu tốc hành'],
  ['{終電|しゅうでん}', 'shuuden', 'chuyến tàu cuối ngày'],
  ['{乗|の}り{場|ば}', 'noriba', 'bến, chỗ lên xe'],
  ['{乗|の}り{越|こ}す', 'norikosu', 'đi quá ga'],
  ['{払|はら}い{戻|もど}し', 'haraimodoshi', 'hoàn tiền'],
  ['{駐車場|ちゅうしゃじょう}', 'chuushajou', 'bãi đỗ ô tô'],
  ['{税込|ぜいこ}み', 'zeikomi', 'đã gồm thuế'],
  ['{税抜|ぜいぬ}き', 'zeinuki', 'chưa gồm thuế'],
  ['{領収書|りょうしゅうしょ}', 'ryoushuusho', 'hoá đơn ghi tên người trả'],
  ['レシート', 'reshiito', 'hoá đơn in từ máy'],
  ['お{釣|つ}り', 'otsuri', 'tiền thừa trả lại'],
  ['{会計|かいけい}', 'kaikei', 'việc thanh toán'],
  ['レジ{袋|ぶくろ}', 'rejibukuro', 'túi nilon ở quầy'],
  ['お{持|も}ち{帰|かえ}り', 'omochikaeri', 'mang về (đồ ăn)'],
  ['{店内|てんない}', 'tennai', 'trong cửa hàng'],
  ['{取|と}り{寄|よ}せる', 'toriyoseru', 'đặt hàng về'],
  ['{返品|へんぴん}', 'henpin', 'trả lại hàng'],
  ['{営業時間|えいぎょうじかん}', 'eigyou jikan', 'giờ mở cửa'],
  ['{定休日|ていきゅうび}', 'teikyuubi', 'ngày nghỉ định kỳ'],
  ['{診察券|しんさつけん}', 'shinsatsuken', 'thẻ khám bệnh'],
  ['{体温計|たいおんけい}', 'taionkei', 'nhiệt kế'],
  ['{傷|きず}', 'kizu', 'vết thương, vết xước'],
  ['{花粉症|かふんしょう}', 'kafunshou', 'dị ứng phấn hoa'],
  ['{熱中症|ねっちゅうしょう}', 'necchuushou', 'say nắng, sốc nhiệt'],
  ['{整理券|せいりけん}', 'seiriken', 'phiếu số thứ tự'],
  ['{身分証明書|みぶんしょうめいしょ}', 'mibun shoumeisho', 'giấy tờ tuỳ thân'],
  ['{暗証番号|あんしょうばんごう}', 'anshou bangou', 'mã PIN'],
  ['{印鑑|いんかん}', 'inkan', 'con dấu'],
  ['{紛失|ふんしつ}', 'funshitsu', 'đánh mất (trang trọng)'],
  ['{再発行|さいはっこう}', 'saihakkou', 'cấp lại'],
  ['{補習|ほしゅう}', 'hoshuu', 'học bù'],
  ['{訂正|ていせい}', 'teisei', 'đính chính'],
  ['{開催|かいさい}', 'kaisai', 'tổ chức (sự kiện)'],
  ['{雨天|うてん}', 'uten', 'trời mưa (văn thông báo)'],
  ['{満席|まんせき}', 'manseki', 'kín ghế, hết chỗ ngồi'],
  ['{空席|くうせき}', 'kuuseki', 'ghế trống'],
  ['{空|あ}き', 'aki', 'chỗ / giờ còn trống'],
  ['{請求書|せいきゅうしょ}', 'seikyuusho', 'giấy đòi tiền'],
  ['{手数料|てすうりょう}', 'tesuuryou', 'phí dịch vụ, phí thủ tục'],
  ['{再配達|さいはいたつ}', 'saihaitatsu', 'giao lại bưu kiện'],
  ['とりあえず', 'toriaezu', 'trước mắt, tạm thời'],
  ['さっそく', 'sassoku', 'ngay lập tức'],
  ['ついでに', 'tsuide ni', 'tiện thể'],
  ['どうせ', 'douse', 'đằng nào cũng'],
  ['せめて', 'semete', 'ít nhất thì'],
  ['なんとか', 'nantoka', 'xoay xở được, bằng cách nào đó'],
  ['{早|はや}める', 'hayameru', 'đẩy sớm lên'],
  ['{遅|おく}らせる', 'okuraseru', 'lùi lại, làm muộn đi'],
  ['{配|くば}る', 'kubaru', 'phát cho nhiều người'],
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
  id: 'b39-lt-1-tu-vung',
  kind: 'homework',
  title: 'Luyện thêm 1 · Từ vựng — 🟢 nhận mặt → 🟡 điền câu (50 câu)',
  goal: 'Nhớ chắc 67 từ của bối cảnh đề nghe N3 theo hai chiều (Nhật → Việt, Việt → Nhật) rồi chọn đúng từ trong câu, kể cả các cặp dễ nhầm (税込み・税抜き, 領収書・レシート・請求書, 満席・満員・空席・空き, 聞き逃す・聞き流す, 早める・遅らせる・延期, 発車・出発, 紛失・なくす, 配る・渡す, とりあえず・さっそく・ついでに).',
  minutes: 35,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟢 Mức Dễ** — 20 câu Nhật → Việt và 15 câu Việt → Nhật. Sai câu nào: bấm 🔊 ở mục Từ vựng nghe từ đó 3 lần — đây là bài nghe nên phải nhớ bằng TAI.',
        '**🟡 Mức Vừa** — 15 câu điền từ vào câu, đúng dạng 文脈規定 của đề N3 (4 lựa chọn cùng loại từ).',
        'Lỗi hay mắc: {雨天|うてん} (うてん, không phải あめてん) · {発車|はっしゃ} (âm ngắt) · {熱中症|ねっちゅうしょう} · {領収書|りょうしゅうしょ} (ba trường âm) · {乗|の}り{場|ば} (ば, không phải じょう).',
      ],
    },
    { t: 'h', text: '🟢 Mức 1 — Dễ: nhìn từ → nghĩa; nghe nghĩa → từ' },
    { t: 'mcq', id: 'b39-lt1-nv', title: 'Nhật → Việt (20 câu)', items: MCQ_NV(0, 20) },
    { t: 'mcq', id: 'b39-lt1-vn', title: 'Việt → Nhật (15 câu)', items: MCQ_VN(30, 45) },
    { t: 'h', text: '🟡 Mức 2 — Vừa: chọn từ hợp với câu (文脈規定)' },
    {
      t: 'mcq',
      id: 'b39-lt1-dien',
      title: 'Điền từ vào câu (15 câu)',
      items: [
        { q: '（　）、{一番線|いちばんせん}に{電車|でんしゃ}が{参|まい}ります。', options: ['{間|ま}もなく', 'とりあえず', 'せめて', 'どうせ'], correct: 0, why: 'Câu loa: **{間|ま}もなく、～が{参|まい}ります** = tàu sắp đến. 〔Mamonaku…〕' },
        { q: '{電車|でんしゃ}の（　）では、{大|おお}きな{声|こえ}で{話|はな}さないでください。', options: ['{車内|しゃない}', '{店内|てんない}', '{白線|はくせん}', '{乗|の}り{場|ば}'], correct: 0, why: 'Trong toa tàu → **{車内|しゃない}**. 〔Densha no shanai de wa…〕' },
        { q: '{財布|さいふ}を{落|お}としたので、カードの（　）を{頼|たの}んだ。', options: ['{再発行|さいはっこう}', '{再配達|さいはいたつ}', '{返品|へんぴん}', '{訂正|ていせい}'], correct: 0, why: 'Mất thẻ → xin **cấp lại**: {再発行|さいはっこう}. 〔Kaado no saihakkou…〕' },
        { q: '{会社|かいしゃ}に{出|だ}すので、（　）をお{願|ねが}いします。', options: ['{領収書|りょうしゅうしょ}', 'お{釣|つ}り', 'レジ{袋|ぶくろ}', '{整理券|せいりけん}'], correct: 0, why: 'Nộp công ty → **{領収書|りょうしゅうしょ}**. 〔Ryoushuusho o onegai shimasu.〕' },
        { q: '{千円|せんえん}お{預|あず}かりします。{二百円|にひゃくえん}の（　）です。', options: ['お{釣|つ}り', '{手数料|てすうりょう}', '{会計|かいけい}', '{税込|ぜいこ}み'], correct: 0, why: 'Tiền thừa → **お{釣|つ}り**. 〔Nihyaku en no otsuri desu.〕' },
        { q: 'この{店|みせ}は{毎週|まいしゅう}{月曜日|げつようび}が（　）です。', options: ['{定休日|ていきゅうび}', '{営業時間|えいぎょうじかん}', '{雨天|うてん}', '{見込|みこ}み'], correct: 0, why: 'Ngày nghỉ hằng tuần → **{定休日|ていきゅうび}**. 〔Getsuyoubi ga teikyuubi desu.〕' },
        { q: '{銀行|ぎんこう}では、まず（　）を{取|と}って、{番号|ばんごう}が{呼|よ}ばれるのを{待|ま}つ。', options: ['{整理券|せいりけん}', '{診察券|しんさつけん}', '{請求書|せいきゅうしょ}', '{印鑑|いんかん}'], correct: 0, why: 'Lấy **phiếu số thứ tự** → {整理券|せいりけん}を{取|と}る. 〔Seiriken o totte…〕' },
        { q: 'カードを{作|つく}るときは、{在留|ざいりゅう}カードなどの（　）が{必要|ひつよう}です。', options: ['{身分証明書|みぶんしょうめいしょ}', '{暗証番号|あんしょうばんごう}', '{体温計|たいおんけい}', '{領収書|りょうしゅうしょ}'], correct: 0, why: 'Giấy tờ tuỳ thân → **{身分証明書|みぶんしょうめいしょ}**. 〔Mibun shoumeisho ga hitsuyou desu.〕' },
        { q: '{夏|なつ}は（　）にならないように、こまめに{水|みず}を{飲|の}もう。', options: ['{熱中症|ねっちゅうしょう}', '{花粉症|かふんしょう}', '{傷|きず}', '{早口|はやくち}'], correct: 0, why: 'Mùa hè → **{熱中症|ねっちゅうしょう}** (say nắng). 〔Necchuushou ni naranai you ni…〕' },
        { q: '{運動会|うんどうかい}は、（　）の{場合|ばあい}、{来週|らいしゅう}の{日曜日|にちようび}に{延期|えんき}します。', options: ['{雨天|うてん}', '{満席|まんせき}', '{開催|かいさい}', '{空席|くうせき}'], correct: 0, why: '**{雨天|うてん}の{場合|ばあい}** = nếu trời mưa. 〔Uten no baai…〕' },
        { q: '{金曜日|きんようび}の{便|びん}は{満席|まんせき}ですが、{土曜日|どようび}なら（　）があります。', options: ['{空席|くうせき}', '{満員|まんいん}', '{手数料|てすうりょう}', '{呼|よ}び{出|だ}し'], correct: 0, why: 'Trái với 満席 → **{空席|くうせき}**. 〔Doyoubi nara kuuseki ga arimasu.〕' },
        { q: '{留守|るす}にしていたので、{荷物|にもつ}の（　）をお{願|ねが}いした。', options: ['{再配達|さいはいたつ}', '{再発行|さいはっこう}', '{払|はら}い{戻|もど}し', '{補習|ほしゅう}'], correct: 0, why: 'Vắng nhà → **giao lại**: {再配達|さいはいたつ}. 〔Nimotsu no saihaitatsu…〕' },
        { q: '{台風|たいふう}が{来|く}るので、{会議|かいぎ}を{一時間|いちじかん}（　）ことにした。', options: ['{早|はや}める', '{配|くば}る', '{乗|の}り{越|こ}す', '{取|と}り{寄|よ}せる'], correct: 0, why: 'Đẩy sớm lên → **{早|はや}める**. 〔Ichijikan hayameru…〕' },
        { q: '{郵便局|ゆうびんきょく}に{行|い}くなら、（　）この{手紙|てがみ}も{出|だ}してきてくれる？', options: ['ついでに', 'どうせ', 'せめて', 'さっそく'], correct: 0, why: 'Tiện thể → **ついでに**. 〔Tsuide ni kono tegami mo…〕' },
        { q: '{会議|かいぎ}の{前|まえ}に、この{資料|しりょう}を{全員|ぜんいん}に（　）ください。', options: ['{配|くば}って', '{渡|わた}って', '{返品|へんぴん}して', '{開催|かいさい}して'], correct: 0, why: 'Phát cho mọi người → **{配|くば}る**. 〔Zen\'in ni kubatte kudasai.〕' },
      ],
    },
  ],
};

const LT_2: Lesson = {
  id: 'b39-lt-2-han-tu',
  kind: 'homework',
  title: 'Luyện thêm 2 · Chữ Hán — 🟢 đọc → 🟡 chọn chữ → 🔴 chữ giống & đồng âm (26 câu)',
  goal: 'Đọc đúng và chọn đúng chữ cho các từ có 21 chữ Hán mới của Bài 39 — kể cả từ mở rộng chưa gặp trong bài (視聴者, 音符, 換気, 車輪, 渋い, 滞在, 免税, 大統領, 振動, 算数, 負傷, 候補, 主催, 請求, 改訂) — như đề N3 phần 漢字読み・表記, và không bị lừa bởi chữ trông giống (往↔住, 駐↔注, 輪↔論, 税↔説, 振↔震, 請↔晴…) hay bốn chữ đồng âm かえる (変・換・替・代).',
  minutes: 30,
  blocks: [
    {
      t: 'note',
      title: 'Học thế nào',
      items: [
        '**🟢 Đọc (12 câu)** — từ quen + từ mở rộng. Nhìn phần **gợi âm** của chữ hình thanh để đoán âm On: 駐 ← 主 (ちゅう), 輪 ← 侖 (りん), 請 ← 青 (せい), 補 ← 甫 (ほ), 振 ← 辰 (しん).',
        '**🟡 Chọn chữ (8 câu)** — phân biệt bằng **bộ bên trái**: 彳 (đi) · 馬 (ngựa) · 車 (xe) · 禾 (lúa) · 扌 (tay) · 言 (lời) · 衤 (áo).',
        '**🔴 Chữ giống & đồng âm (6 câu)** — bốn chữ かえる: 変える (biến đổi) · 換える (đổi lấy) · 替える (thay mới) · 代える (thay vai trò).',
      ],
    },
    {
      t: 'mcq',
      id: 'b39-lt2-doc',
      title: '🟢 漢字読み — chọn cách đọc (12 câu)',
      items: [
        { q: 'この{番組|ばんぐみ}は**視聴者**が{多|おお}い。', options: ['しちょうしゃ', 'してんしゃ', 'しちょしゃ', 'じちょうしゃ'], correct: 0, why: '**{視聴者|しちょうしゃ}** — 聴 ちょう. 〔Shichousha — người xem〕' },
        { q: '**音符**を{読|よ}むのが{苦手|にがて}だ。', options: ['おんぷ', 'おんふ', 'おとふ', 'いんぷ'], correct: 0, why: '**{音符|おんぷ}** — sau ん, ふ → ぷ. 〔Onpu — nốt nhạc〕' },
        { q: '{窓|まど}を{開|あ}けて**換気**しましょう。', options: ['かんき', 'こうき', 'かき', 'かえき'], correct: 0, why: '**{換気|かんき}** — 換 かん. 〔Kanki — thông gió〕' },
        { q: '{自転車|じてんしゃ}の**車輪**が{壊|こわ}れた。', options: ['しゃりん', 'くるまわ', 'しゃろん', 'しゃわ'], correct: 0, why: '**{車輪|しゃりん}** — 輪 りん (On). 〔Sharin — bánh xe〕' },
        { q: 'このお{茶|ちゃ}は少し**渋い**。', options: ['しぶい', 'じゅうい', 'にがい', 'しびい'], correct: 0, why: '**{渋|しぶ}い** — kun しぶ. 〔Shibui — chát〕' },
        { q: '{京都|きょうと}に{三日間|みっかかん}**滞在**した。', options: ['たいざい', 'たいさい', 'ていざい', 'たいじゅう'], correct: 0, why: '**{滞在|たいざい}** — 在 ざい (đục). 〔Taizai — lưu trú〕' },
        { q: '{空港|くうこう}の**免税**{店|てん}で{買|か}い{物|もの}をした。', options: ['めんぜい', 'めんせい', 'めんぜ', 'べんぜい'], correct: 0, why: '**{免税|めんぜい}** — 税 ぜい. 〔Menzei — miễn thuế〕' },
        { q: 'アメリカの**大統領**が{来日|らいにち}した。', options: ['だいとうりょう', 'たいとうりょう', 'だいとうれい', 'だいとりょう'], correct: 0, why: '**{大統領|だいとうりょう}** — 領 りょう. 〔Daitouryou — tổng thống〕' },
        { q: 'スマホの**振動**で{目|め}が{覚|さ}めた。', options: ['しんどう', 'ふどう', 'しんうご', 'しどう'], correct: 0, why: '**{振動|しんどう}** — 振 しん (On, cùng 震). 〔Shindou — rung〕' },
        { q: '{子|こ}どもは**算数**が{好|す}きだ。', options: ['さんすう', 'さんず', 'けいすう', 'さんかず'], correct: 0, why: '**{算数|さんすう}** — môn toán tiểu học. 〔Sansuu〕' },
        { q: '{次|つぎ}の{会長|かいちょう}の**候補**は{三人|さんにん}だ。', options: ['こうほ', 'こうぼ', 'こほ', 'こうふ'], correct: 0, why: '**{候補|こうほ}** — 補 ほ. 〔Kouho — ứng viên〕' },
        { q: 'この{大会|たいかい}は{市|し}が**主催**している。', options: ['しゅさい', 'しゅうさい', 'しゅざい', 'ぬしさい'], correct: 0, why: '**{主催|しゅさい}** — 催 さい. 〔Shusai — đơn vị tổ chức〕' },
      ],
    },
    {
      t: 'mcq',
      id: 'b39-lt2-chon',
      title: '🟡 表記 — chọn chữ đúng (8 câu)',
      items: [
        { q: '{東京|とうきょう}まで**おうふく**で{五千円|ごせんえん}です。', options: ['住復', '往復', '注復', '柱復'], correct: 1, why: '**{往復|おうふく}** — 往 có 彳 (bước đi). 住 = ở.' },
        { q: '{駅前|えきまえ}に**ちゅうりんじょう**がある。', options: ['駐輪場', '駐論場', '注輪場', '駐倫場'], correct: 0, why: '**{駐輪場|ちゅうりんじょう}** — 駐 (馬) + 輪 (車).' },
        { q: '**しょうひぜい**が{上|あ}がった。', options: ['消費説', '消費脱', '消費税', '消費鋭'], correct: 2, why: '**{消費税|しょうひぜい}** — 税 có 禾 (lúa).' },
        { q: '{転|ころ}んで、{足|あし}に**きず**ができた。', options: ['湯', '場', '傷', '陽'], correct: 2, why: '**{傷|きず}** — 亻 (người bị thương). 湯・場・陽 cùng phần 昜 nhưng khác bộ trái.' },
        { q: '{家賃|やちん}を**ふりこむ**。', options: ['震り込む', '振り込む', '辰り込む', '娠り込む'], correct: 1, why: '**{振|ふ}り{込|こ}む** — 振 có 扌 (tay). 震 = động đất.' },
        { q: '{旅行|りょこう}の**よさん**を{決|き}める。', options: ['予箕', '予算', '予筆', '予管'], correct: 1, why: '**{予算|よさん}** — 算 = ⺮ + 目 + 廾.' },
        { q: '{電気代|でんきだい}の**せいきゅうしょ**が{届|とど}いた。', options: ['晴求書', '清求書', '請求書', '精求書'], correct: 2, why: '**{請求書|せいきゅうしょ}** — 請 có 言 (dùng lời đòi).' },
        { q: '{辞書|じしょ}の**かいてい**{版|ばん}が{出|で}た。', options: ['改町', '改訂', '改丁', '改停'], correct: 1, why: '**{改訂|かいてい}** — 訂 có 言 (sửa lời văn).' },
      ],
    },
    {
      t: 'mcq',
      id: 'b39-lt2-giong',
      title: '🔴 Chữ giống & đồng âm かえる (6 câu)',
      items: [
        { q: '{次|つぎ}の{駅|えき}で{地下鉄|ちかてつ}に**のりかえる**。', options: ['乗り変える', '乗り換える', '乗り替える', '乗り代える'], correct: 1, why: 'Đổi tàu = đổi cái này lấy cái kia → **{換|か}える**: {乗|の}り{換|か}える.' },
        { q: '{空港|くうこう}で{円|えん}をドルに**りょうがえ**した。', options: ['両変', '両換', '両替', '両代'], correct: 2, why: 'Đổi tiền → luôn viết **{両替|りょうがえ}** (替 = thay cái này bằng cái kia).' },
        { q: '{予定|よてい}を**かえる**ことになった。', options: ['変える', '換える', '替える', '代える'], correct: 0, why: 'Thay đổi kế hoạch (khác đi) → **{変|か}える**.' },
        { q: '{部長|ぶちょう}に**かわって**、{私|わたし}がご{挨拶|あいさつ}します。', options: ['変わって', '換わって', '替わって', '代わって'], correct: 3, why: 'Thay vai trò người khác → **{代|か}わって**.' },
        { q: '「{傷|きず}」と{同|おな}じ{部分|ぶぶん}（{右|みぎ}がわ）を{持|も}つ{漢字|かんじ}は？', options: ['湯', '陽', '場', 'どれも'], correct: 3, why: '湯・陽・場 đều có phần 昜 như 傷 (傷 thêm ⺈). Khác nhau ở bộ trái: 氵・阝・土・亻.' },
        { q: '「{症|しょう}」の{中|なか}にある、{音|おと}を{表|あらわ}す{部分|ぶぶん}は？', options: ['疒', '正', '止', '一'], correct: 1, why: '症 = 疒 (bệnh) + **正** (gợi âm しょう／せい) — như 証・政.' },
      ],
    },
  ],
};

const LT_3: Lesson = {
  id: 'b39-lt-3-van-noi',
  kind: 'homework',
  title: 'Luyện thêm 3 · Văn nói & bẫy — dạng đầy đủ · ý thật của cách nói vòng · quyết định cuối khi đổi ý (24 câu)',
  goal: 'Nghe ra ngay dạng đầy đủ của 10 câu văn nói rút gọn, hiểu đúng ý thật của 7 câu nói vòng / có từ đảo ý, và tìm đúng điều được quyết định cuối cùng trong 7 câu có đổi ý — ba kỹ năng nền của mọi dạng đề 聴解.',
  minutes: 25,
  blocks: [
    {
      t: 'mcq',
      id: 'b39-lt3-rut-gon',
      title: '🟢 Dạng đầy đủ là gì? (10 câu)',
      items: [
        { q: '「もう{寝|ね}てる。」', options: ['{寝|ね}ている', '{寝|ね}ておく', '{寝|ね}てしまう', '{寝|ね}ていく'], correct: 0, why: '**てる** = ている.' },
        { q: '「{冷蔵庫|れいぞうこ}に{入|い}れとくね。」', options: ['{入|い}れている', '{入|い}れておく', '{入|い}れてしまう', '{入|い}れていく'], correct: 1, why: '**とく** = ておく.' },
        { q: '「{傘|かさ}、{持|も}ってって。」', options: ['{持|も}っていって', '{持|も}っておいて', '{持|も}ってきて', '{持|も}ってしまって'], correct: 0, why: '**てって** = ていって.' },
        { q: '「あ、{電車|でんしゃ}、{行|い}っちゃった。」', options: ['{行|い}ってしまった', '{行|い}っておいた', '{行|い}かなかった', '{行|い}っていた'], correct: 0, why: '**ちゃった** = てしまった.' },
        { q: '「{全部|ぜんぶ}{読|よ}んじゃった。」', options: ['{読|よ}んでいた', '{読|よ}んでしまった', '{読|よ}んでおいた', '{読|よ}まなかった'], correct: 1, why: '**じゃった** = でしまった.' },
        { q: '「もう{出|で}なきゃ。」', options: ['{出|で}なくてもいい', '{出|で}なければならない', '{出|で}てはいけない', '{出|で}ないつもりだ'], correct: 1, why: '**なきゃ** = なければ（ならない）.' },
        { q: '「ここで{遊|あそ}んじゃだめ。」', options: ['{遊|あそ}んでもいい', '{遊|あそ}んでしまった', '{遊|あそ}んではだめ', '{遊|あそ}ばなければならない'], correct: 2, why: '**じゃだめ** = ではだめ.' },
        { q: '「{山田|やまだ}さん、{来|こ}られないって。」', options: ['と{言|い}っていた', 'という{人|ひと}', 'だから', 'でも'], correct: 0, why: '**って** cuối câu = と{言|い}っていた.' },
        { q: '「{何|なに}が{言|い}いたいのか、わかんない。」', options: ['わからない', 'わかった', 'わかるかな', 'わかっている'], correct: 0, why: '**わかんない** = わからない (ら + な → ん + な).' },
        { q: '「{今|いま}、{家|いえ}を{出|で}るとこ。」', options: ['{出|で}るところ', '{出|で}ること', '{出|で}る{所|ところ}（chỗ）', '{出|で}るとき'], correct: 0, why: '**とこ** = ところ (đang đúng lúc sắp làm — Bài 19).' },
      ],
    },
    {
      t: 'mcq',
      id: 'b39-lt3-y-that',
      title: '🟡 Ý thật là gì? (7 câu)',
      items: [
        { q: 'A「{日曜日|にちようび}、{手伝|てつだ}ってくれない？」B「{日曜日|にちようび}はちょっと……」', options: ['B sẽ giúp', 'B từ chối', 'B hỏi lại', 'B chưa nghe rõ'], correct: 1, why: '**ちょっと……** = từ chối.' },
        { q: '{店員|てんいん}「こちらはいかがですか」{客|きゃく}「そうですね……{考|かんが}えておきます」', options: ['khách sẽ mua ngay', 'khách thường là không mua', 'khách nhờ nhân viên nghĩ', 'khách đã mua'], correct: 1, why: '**{考|かんが}えておきます** = từ chối nhẹ.' },
        { q: '「その{服|ふく}、{悪|わる}くはないけど……」', options: ['rất thích', 'không thích lắm', 'muốn mua', 'chê đắt'], correct: 1, why: 'Khen nửa vời + **けど……** = không thích lắm.' },
        { q: '「{行|い}けたら{行|い}くね」', options: ['chắc chắn đi', 'thường là không đi', 'đã đi rồi', 'muốn đi nhất'], correct: 1, why: 'Câu hứa lửng → thường **không đi**.' },
        { q: '「そのほうがいいんじゃない？」（{上|あ}がる{言|い}い{方|かた}）', options: ['cấm', 'đề xuất nhẹ', 'xin lỗi', 'than phiền'], correct: 1, why: '**～んじゃない？** lên giọng = đề xuất / đồng ý nhẹ.' },
        { q: '「{遅刻|ちこく}じゃないんだ。{実|じつ}は{道|みち}に{迷|まよ}ったんだ」 — {問題|もんだい}は？', options: ['đi muộn', 'lạc đường', 'quên đồ', 'bị ốm'], correct: 1, why: 'Sau **{実|じつ}は** = lý do thật.' },
        { q: '「{参加|さんか}は{自由|じゆう}です。ただ、{前|まえ}の{日|ひ}までに{連絡|れんらく}してください」 — {参加|さんか}する{人|ひと}は？', options: ['không cần làm gì', 'phải báo trước một ngày', 'phải trả tiền', 'phải đến sớm'], correct: 1, why: 'Sau **ただ** = điều kiện phải làm.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b39-lt3-doi-y',
      title: '🔴 Cuối cùng quyết định thế nào? (7 câu)',
      items: [
        { q: '「{赤|あか}いのにします。あ、やっぱり{白|しろ}で」', options: ['đỏ', 'trắng', 'cả hai', 'chưa chọn'], correct: 1, why: '**あ、やっぱり** → trắng.' },
        { q: '「{集合|しゅうごう}は{十時|じゅうじ}……いや、{九時半|くじはん}だった」', options: ['10:00', '9:30', '10:30', '9:00'], correct: 1, why: '**いや** → 9:30.' },
        { q: '「{教室|きょうしつ}は{二〇一|にまるいち}じゃなくて{二〇二|にまるに}です」', options: ['201', '202', '201 và 202', '200'], correct: 1, why: '**A じゃなくて B** → 202.' },
        { q: '「バスで{行|い}こうと{思|おも}ってたんだけど、{歩|ある}くことにした」', options: ['xe buýt', 'đi bộ', 'tàu', 'taxi'], correct: 1, why: '**～と{思|おも}ってたんだけど** → điều sau: đi bộ.' },
        { q: '「{今日|きょう}{出|だ}すつもりだったけど、{明日|あした}にする」', options: ['hôm nay', 'ngày mai', 'tuần sau', 'không nộp'], correct: 1, why: '**～つもりだったけど** → ngày mai.' },
        { q: '「{先|さき}ほど{三時|さんじ}と{申|もう}しましたが、{四時|よじ}の{誤|あやま}りでした」', options: ['3 giờ', '4 giờ', '3 rưỡi', 'chưa biết'], correct: 1, why: '**～の{誤|あやま}りでした** (đính chính) → 4 giờ.' },
        { q: '「{明日|あした}{行|い}こう。……あ、そうだ、{明日|あした}は{定休日|ていきゅうび}だった。じゃあ、{明後日|あさって}にしよう」', options: ['hôm nay', 'ngày mai', 'ngày kia', 'không đi'], correct: 2, why: '**あ、そうだ** (nhớ ra) + **じゃあ～にしよう** → ngày kia.' },
      ],
    },
  ],
};

const LT_4: Lesson = {
  id: 'b39-lt-4-nghe-them',
  kind: 'homework',
  title: 'Luyện thêm 4 · Nghe thêm — 16 bài đủ 5 dạng: 課題理解 ×3 · ポイント理解 ×3 · 概要理解 ×3 · 発話表現 ×3 · 即時応答 ×4 bộ (20 câu)',
  goal: 'Luyện thêm 16 bài nghe theo đủ 5 dạng đề 聴解 N3 ở các bối cảnh mới (bưu điện, ngày đầu đi làm thêm, chuẩn bị thuyết trình, chuyển nhà, đổi lịch nha sĩ, loa siêu thị, lời nhắn thoại, ứng dụng học, quán cơm, công ty, nhà ga) — áp dụng bộ lọc bốn ô, từ đảo ý, câu kết, đúng vai và phản ứng tự nhiên.',
  minutes: 50,
  blocks: [
    {
      t: 'note',
      title: 'Cách làm',
      items: [
        'Làm như đi thi: đọc lựa chọn (nếu có), nghe **một lần**, chọn. Sau đó mới mở lời thoại + giải thích.',
        'Ghi lại số câu sai theo dạng. Sai nhiều ở dạng nào → đọc lại phần tương ứng của mục **Văn nói & mẹo nghe** (課題理解 → ⑨, ポイント理解 → ⑧, 概要理解 → ⑫ luật 7, 発話表現 → ⑫ luật 8, 即時応答 → ⑤⑦).',
      ],
    },

    /* ═══ 課題理解 ═══ */
    { t: 'h', text: '課題理解 1 — ở bưu điện: gửi hàng về Việt Nam' },
    NG('b39-lt4-ng-1', '{女|おんな}の{人|ひと}はまず{何|なに}をしますか', 'Dạng 課題理解 — hộp: đã mang; kiểm tra bên trong: SAU khi viết; trả tiền: sau cùng. Việc làm TRƯỚC (先に): điền địa chỉ người nhận và đồ bên trong vào tờ khai.', [
      ['ナレーター', 'ja-nu', '{郵便局|ゆうびんきょく}で、{女|おんな}の{人|ひと}と{局員|きょくいん}が{話|はな}しています。{女|おんな}の{人|ひと}はまず{何|なに}をしますか。', 'Yuubinkyoku de, onna no hito to kyokuin ga hanashite imasu. Onna no hito wa mazu nani o shimasu ka.', 'Ở bưu điện, một người phụ nữ và nhân viên bưu điện đang nói chuyện. Người phụ nữ sẽ làm gì trước tiên?'],
      ['パク', 'ja-nu', 'すみません、この{荷物|にもつ}をベトナムに{送|おく}りたいんですが。', 'Sumimasen, kono nimotsu o Betonamu ni okuritai n desu ga.', 'Xin lỗi, tôi muốn gửi kiện hàng này về Việt Nam.'],
      ['{局員|きょくいん}', 'ja-nam', 'はい。{箱|はこ}はお{持|も}ちですね。では、{先|さき}にこちらの{用紙|ようし}に、{送|おく}り{先|さき}の{住所|じゅうしょ}と{中身|なかみ}を{書|か}いてください。', 'Hai. Hako wa omochi desu ne. Dewa, saki ni kochira no youshi ni, okurisaki no juusho to nakami o kaite kudasai.', 'Vâng. Chị có hộp rồi nhỉ. Vậy trước tiên chị ghi địa chỉ người nhận và đồ bên trong vào tờ này.'],
      ['パク', 'ja-nu', '{中身|なかみ}も{書|か}くんですか。', 'Nakami mo kaku n desu ka.', 'Phải ghi cả đồ bên trong ạ?'],
      ['{局員|きょくいん}', 'ja-nam', 'ええ。{書|か}いたら、{箱|はこ}を{一度|いちど}{開|あ}けて、{中|なか}を{確認|かくにん}させていただきます。{料金|りょうきん}はそのあとでお{支払|しはら}いください。', 'Ee. Kaitara, hako o ichido akete, naka o kakunin sasete itadakimasu. Ryoukin wa sono ato de oshiharai kudasai.', 'Vâng. Viết xong, tôi xin phép mở hộp ra kiểm tra một lần. Tiền thì chị thanh toán sau đó.'],
      ['パク', 'ja-nu', 'わかりました。あの、ペンをお{借|か}りしてもいいですか。', 'Wakarimashita. Ano, pen o okari shite mo ii desu ka.', 'Tôi hiểu rồi. À, tôi mượn bút được không ạ?'],
      ['{局員|きょくいん}', 'ja-nam', 'どうぞ、お{使|つか}いください。', 'Douzo, otsukai kudasai.', 'Chị cứ dùng ạ.'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}はまず{何|なに}をしますか。', 'Onna no hito wa mazu nani o shimasu ka.', 'Người phụ nữ sẽ làm gì trước tiên?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-lt4-ng-1-q',
      title: 'Câu hỏi',
      items: [
        { q: '{女|おんな}の{人|ひと}はまず{何|なに}をしますか。', options: ['{箱|はこ}を{買|か}う', '{用紙|ようし}に{住所|じゅうしょ}と{中身|なかみ}を{書|か}く', '{箱|はこ}を{開|あ}けて{見|み}せる', '{料金|りょうきん}を{払|はら}う'], correct: 1, why: 'Hộp **お{持|も}ちですね** → loại 1. Mở hộp: **{書|か}いたら** (sau) → loại 3. Tiền: **そのあとで** → loại 4. Câu then chốt: **「{先|さき}にこちらの{用紙|ようし}に、{送|おく}り{先|さき}の{住所|じゅうしょ}と{中身|なかみ}を{書|か}いてください」**〔Saki ni kochira no youshi ni, okurisaki no juusho to nakami o kaite kudasai〕.' },
      ],
    },

    { t: 'h', text: '課題理解 2 — ngày đầu làm thêm ở ひまわり食堂' },
    NG('b39-lt4-ng-2', '{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか', 'Dạng 課題理解 — đồng phục: もう着替えてる (đã xong); lau bàn: 手を洗ったら (sau); thực đơn: 家で読んどいて (để về nhà). Việc làm TRƯỚC (まず): đi rửa tay.', [
      ['ナレーター', 'ja-nu', '{食堂|しょくどう}で、{店長|てんちょう}と{新|あたら}しいアルバイトの{女|おんな}の{人|ひと}が{話|はな}しています。{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Shokudou de, tenchou to atarashii arubaito no onna no hito ga hanashite imasu. Onna no hito wa kono ato mazu nani o shimasu ka.', 'Ở quán ăn, chủ quán và một nữ nhân viên làm thêm mới đang nói chuyện. Sau đây người phụ nữ sẽ làm gì trước tiên?'],
      ['{小林店長|こばやしてんちょう}', 'ja-nam', 'アンナさん、{今日|きょう}からよろしくね。あ、もう{制服|せいふく}に{着替|きが}えてるね。じゃあ、まず{手|て}を{洗|あら}ってきて。{厨房|ちゅうぼう}に{入|はい}る{前|まえ}は{必|かなら}ず。', 'Anna-san, kyou kara yoroshiku ne. A, mou seifuku ni kigaeteru ne. Jaa, mazu te o aratte kite. Chuubou ni hairu mae wa kanarazu.', 'Anna, từ hôm nay nhờ em nhé. À, em thay đồng phục rồi nhỉ. Vậy trước tiên đi rửa tay đi. Trước khi vào bếp là nhất định phải rửa.'],
      ['アンナ', 'ja-nu', 'はい。そのあと、テーブルを{拭|ふ}きましょうか。', 'Hai. Sono ato, teeburu o fukimashou ka.', 'Vâng. Sau đó em lau bàn nhé?'],
      ['{小林店長|こばやしてんちょう}', 'ja-nam', 'うん、{手|て}を{洗|あら}ったら、テーブルをお{願|ねが}い。メニューは{少|すこ}しずつ{覚|おぼ}えればいいから、{今日|きょう}は{家|いえ}で{読|よ}んどいて。', 'Un, te o arattara, teeburu o onegai. Menyuu wa sukoshi zutsu oboereba ii kara, kyou wa ie de yondoite.', 'Ừ, rửa tay xong thì lau bàn giúp anh. Thực đơn thì nhớ dần dần là được, hôm nay về nhà đọc trước nhé.'],
      ['アンナ', 'ja-nu', 'わかりました。じゃあ、すぐ{洗|あら}ってきます。', 'Wakarimashita. Jaa, sugu aratte kimasu.', 'Em hiểu rồi. Vậy em đi rửa ngay ạ.'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Onna no hito wa kono ato mazu nani o shimasu ka.', 'Sau đây người phụ nữ sẽ làm gì trước tiên?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-lt4-ng-2-q',
      title: 'Câu hỏi',
      items: [
        { q: '{女|おんな}の{人|ひと}はこのあとまず{何|なに}をしますか。', options: ['{制服|せいふく}に{着替|きが}える', 'テーブルを{拭|ふ}く', 'メニューを{覚|おぼ}える', '{手|て}を{洗|あら}う'], correct: 3, why: '**もう{制服|せいふく}に{着替|きが}えてる** (đã xong) → loại 1. Bàn: **{手|て}を{洗|あら}ったら** (sau) → loại 2. Thực đơn: **{家|いえ}で{読|よ}んどいて** → loại 3. Câu then chốt: **「じゃあ、まず{手|て}を{洗|あら}ってきて」**〔Jaa, mazu te o aratte kite〕.' },
      ],
    },

    { t: 'h', text: '課題理解 3 — chuẩn bị bài thuyết trình ở ゼミ' },
    NG('b39-lt4-ng-3', '{男|おとこ}の{学生|がくせい}は{今日|きょう}まず{何|なに}をしなければなりませんか', 'Dạng 課題理解 — slide: gần xong; in tài liệu: リン sẽ làm; tập thuyết trình: cuối tuần cũng được. Việc PHẢI làm hôm nay: vẽ biểu đồ kết quả khảo sát và cho cô xem.', [
      ['ナレーター', 'ja-nu', '{大学|だいがく}で、{先生|せんせい}と{男|おとこ}の{学生|がくせい}が{話|はな}しています。{男|おとこ}の{学生|がくせい}は{今日|きょう}まず{何|なに}をしなければなりませんか。', 'Daigaku de, sensei to otoko no gakusei ga hanashite imasu. Otoko no gakusei wa kyou mazu nani o shinakereba narimasen ka.', 'Ở trường, cô giáo và một nam sinh đang nói chuyện. Hôm nay nam sinh trước tiên phải làm gì?'],
      ['{佐藤先生|さとうせんせい}', 'ja-nu', 'カルロスさん、{来週|らいしゅう}の{発表|はっぴょう}の{準備|じゅんび}はどう？', 'Karurosu-san, raishuu no happyou no junbi wa dou?', 'Carlos, chuẩn bị bài thuyết trình tuần sau thế nào rồi?'],
      ['カルロス', 'ja-nam', 'スライドはだいたいできました。{資料|しりょう}の{印刷|いんさつ}は、リンさんがやってくれることになっています。', 'Suraido wa daitai dekimashita. Shiryou no insatsu wa, Rin-san ga yatte kureru koto ni natte imasu.', 'Slide em làm gần xong rồi ạ. In tài liệu thì bạn Rin sẽ làm giúp ạ.'],
      ['{佐藤先生|さとうせんせい}', 'ja-nu', 'そう。じゃあ、{練習|れんしゅう}は{週末|しゅうまつ}でもいいから、アンケートの{結果|けっか}をグラフにして、{今日中|きょうじゅう}に{私|わたし}に{見|み}せてくれる？ {数字|すうじ}が{合|あ}っているか、{確認|かくにん}したいの。', 'Sou. Jaa, renshuu wa shuumatsu demo ii kara, ankeeto no kekka o gurafu ni shite, kyoujuu ni watashi ni misete kureru? Suuji ga atte iru ka, kakunin shitai no.', 'Vậy à. Thế thì tập dượt để cuối tuần cũng được, em làm biểu đồ kết quả khảo sát rồi cho cô xem trong hôm nay nhé? Cô muốn kiểm tra số liệu có đúng không.'],
      ['カルロス', 'ja-nam', 'グラフですね。わかりました。じゃあ、{図書館|としょかん}でやってきます。', 'Gurafu desu ne. Wakarimashita. Jaa, toshokan de yatte kimasu.', 'Biểu đồ nhỉ. Em hiểu rồi. Vậy em lên thư viện làm ạ.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{学生|がくせい}は{今日|きょう}まず{何|なに}をしなければなりませんか。', 'Otoko no gakusei wa kyou mazu nani o shinakereba narimasen ka.', 'Hôm nay nam sinh trước tiên phải làm gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-lt4-ng-3-q',
      title: 'Câu hỏi',
      items: [
        { q: '{男|おとこ}の{学生|がくせい}は{今日|きょう}まず{何|なに}をしなければなりませんか。', options: ['スライドを{作|つく}る', 'アンケートの{結果|けっか}をグラフにする', '{資料|しりょう}を{印刷|いんさつ}する', '{発表|はっぴょう}の{練習|れんしゅう}をする'], correct: 1, why: 'Slide **だいたいできました** → loại 1. In: **リンさんがやってくれる** → loại 3. Tập: **{週末|しゅうまつ}でもいい** → loại 4. Câu then chốt: **「アンケートの{結果|けっか}をグラフにして、{今日中|きょうじゅう}に{私|わたし}に{見|み}せてくれる？」**〔Ankeeto no kekka o gurafu ni shite, kyoujuu ni watashi ni misete kureru?〕.' },
      ],
    },

    /* ═══ ポイント理解 ═══ */
    { t: 'h', text: 'ポイント理解 1 — vì sao anh 西川 chuyển nhà?' },
    NG('b39-lt4-ng-4', '{男|おとこ}の{人|ひと}はどうして{引|ひ}っ{越|こ}しましたか', 'Dạng ポイント理解 — tiền nhà: như cũ; xa ga: không, gần ga; lý do thật sau 実は: công trình bên cạnh ồn, không ngủ được.', [
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}と{男|おとこ}の{人|ひと}が{話|はな}しています。{男|おとこ}の{人|ひと}はどうして{引|ひ}っ{越|こ}しましたか。', 'Onna no hito to otoko no hito ga hanashite imasu. Otoko no hito wa doushite hikkoshimashita ka.', 'Một người phụ nữ và một người đàn ông đang nói chuyện. Vì sao người đàn ông chuyển nhà?'],
      ['{山口|やまぐち}', 'ja-nu', '{西川|にしかわ}さん、{引|ひ}っ{越|こ}したんだって？ {前|まえ}の{部屋|へや}、{家賃|やちん}が{高|たか}かったの？', 'Nishikawa-san, hikkoshita n datte? Mae no heya, yachin ga takakatta no?', 'Anh Nishikawa, nghe nói anh chuyển nhà à? Phòng cũ tiền thuê đắt à?'],
      ['{西川|にしかわ}', 'ja-nam', 'ううん、{家賃|やちん}は{今|いま}と{同|おな}じくらいだよ。{駅|えき}からも{近|ちか}くて{便利|べんり}だったし。', 'Uun, yachin wa ima to onaji kurai da yo. Eki kara mo chikakute benri datta shi.', 'Không, tiền nhà cũng ngang bây giờ. Lại gần ga, tiện nữa.'],
      ['{山口|やまぐち}', 'ja-nu', 'じゃあ、どうして？', 'Jaa, doushite?', 'Thế sao lại chuyển?'],
      ['{西川|にしかわ}', 'ja-nam', '{実|じつ}は、{隣|となり}で{大|おお}きなビルの{工事|こうじ}が{始|はじ}まってね。{朝|あさ}{七時|しちじ}からずっとうるさくて、{夜勤|やきん}のあと、{全然|ぜんぜん}{眠|ねむ}れなかったんだ。', 'Jitsu wa, tonari de ookina biru no kouji ga hajimatte ne. Asa shichiji kara zutto urusakute, yakin no ato, zenzen nemurenakatta n da.', 'Thật ra là bên cạnh bắt đầu xây một toà nhà lớn. Từ 7 giờ sáng ồn suốt, sau ca đêm anh chẳng ngủ được chút nào.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}はどうして{引|ひ}っ{越|こ}しましたか。', 'Otoko no hito wa doushite hikkoshimashita ka.', 'Vì sao người đàn ông chuyển nhà?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-lt4-ng-4-q',
      title: 'Câu hỏi',
      items: [
        { q: '{男|おとこ}の{人|ひと}はどうして{引|ひ}っ{越|こ}しましたか。', options: ['{家賃|やちん}が{高|たか}かったから', '{駅|えき}から{遠|とお}かったから', '{隣|となり}の{工事|こうじ}がうるさくて{眠|ねむ}れなかったから', '{夜勤|やきん}の{仕事|しごと}を{始|はじ}めたから'], correct: 2, why: '**{家賃|やちん}は{今|いま}と{同|おな}じくらい** → loại 1. **{駅|えき}からも{近|ちか}くて** → loại 2. Câu then chốt: **「{実|じつ}は、{隣|となり}で{大|おお}きなビルの{工事|こうじ}が{始|はじ}まってね。…{全然|ぜんぜん}{眠|ねむ}れなかったんだ」**〔Jitsu wa, tonari de ookina biru no kouji ga hajimatte ne. … zenzen nemurenakatta n da〕.' },
      ],
    },

    { t: 'h', text: 'ポイント理解 2 — gọi điện đổi lịch nha sĩ' },
    NG('b39-lt4-ng-5', 'ダニエルさんの{新|あたら}しい{予約|よやく}はいつですか', 'Dạng ポイント理解 (giờ bị sửa) — thứ Tư 3 giờ: không đi được; thứ Năm 10 giờ: có tiết học; thứ Sáu 4 giờ → lễ tân sửa: あ、失礼しました…4 giờ rưỡi.', [
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}が{歯医者|はいしゃ}に{電話|でんわ}しています。ダニエルさんの{新|あたら}しい{予約|よやく}はいつですか。', 'Otoko no hito ga haisha ni denwa shite imasu. Danieru-san no atarashii yoyaku wa itsu desu ka.', 'Một người đàn ông đang gọi điện cho phòng nha. Lịch hẹn mới của Daniel là khi nào?'],
      ['ダニエル', 'ja-nam', 'もしもし、ダニエルです。{水曜日|すいようび}の{三時|さんじ}に{予約|よやく}しているんですが、{行|い}けなくなってしまって……。{変更|へんこう}できますか。', 'Moshimoshi, Danieru desu. Suiyoubi no sanji ni yoyaku shite iru n desu ga, ikenaku natte shimatte……. Henkou dekimasu ka.', 'A lô, tôi là Daniel. Tôi có hẹn lúc 3 giờ thứ Tư nhưng không đi được nữa… Tôi đổi được không ạ?'],
      ['{受付|うけつけ}', 'ja-nu', 'はい。{木曜日|もくようび}の{午前|ごぜん}{十時|じゅうじ}はいかがですか。', 'Hai. Mokuyoubi no gozen juuji wa ikaga desu ka.', 'Vâng. 10 giờ sáng thứ Năm thì sao ạ?'],
      ['ダニエル', 'ja-nam', '{木曜日|もくようび}の{午前|ごぜん}は{授業|じゅぎょう}があるんです。{金曜日|きんようび}はどうですか。', 'Mokuyoubi no gozen wa jugyou ga aru n desu. Kin\'youbi wa dou desu ka.', 'Sáng thứ Năm tôi có tiết học. Thứ Sáu thì sao ạ?'],
      ['{受付|うけつけ}', 'ja-nu', '{金曜日|きんようび}ですと、{午後|ごご}{四時|よじ}が{空|あ}いております。……あ、{失礼|しつれい}しました。{四時|よじ}は{埋|う}まっていて、{四時半|よじはん}からでした。', 'Kin\'youbi desu to, gogo yoji ga aite orimasu. …… A, shitsurei shimashita. Yoji wa umatte ite, yoji han kara deshita.', 'Thứ Sáu thì 4 giờ chiều còn trống ạ. … À, xin lỗi. 4 giờ đã kín, từ 4 giờ rưỡi mới trống ạ.'],
      ['ダニエル', 'ja-nam', '{大丈夫|だいじょうぶ}です。じゃあ、それでお{願|ねが}いします。', 'Daijoubu desu. Jaa, sore de onegai shimasu.', 'Được ạ. Vậy cho tôi đặt giờ đó.'],
      ['ナレーター', 'ja-nu', 'ダニエルさんの{新|あたら}しい{予約|よやく}はいつですか。', 'Danieru-san no atarashii yoyaku wa itsu desu ka.', 'Lịch hẹn mới của Daniel là khi nào?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-lt4-ng-5-q',
      title: 'Câu hỏi',
      items: [
        { q: 'ダニエルさんの{新|あたら}しい{予約|よやく}はいつですか。', options: ['{水曜日|すいようび}の{三時|さんじ}', '{木曜日|もくようび}の{十時|じゅうじ}', '{金曜日|きんようび}の{四時|よじ}', '{金曜日|きんようび}の{四時半|よじはん}'], correct: 3, why: 'Thứ Tư = lịch CŨ; thứ Năm: **{授業|じゅぎょう}がある** → loại. Câu then chốt (đính chính): **「あ、{失礼|しつれい}しました。{四時|よじ}は{埋|う}まっていて、{四時半|よじはん}からでした」**〔A, shitsurei shimashita. Yoji wa umatte ite, yoji han kara deshita〕. **{埋|う}まる** = (lịch) kín.' },
      ],
    },

    { t: 'h', text: 'ポイント理解 3 — loa siêu thị: hôm nay cái gì rẻ?' },
    NG('b39-lt4-ng-6', '{今日|きょう}だけ{半額|はんがく}になるものは{何|なん}ですか', 'Dạng ポイント理解 (thông báo) — giảm 10% mọi hàng NHƯNG ただし cơm hộp không áp dụng; なお 本日限り (chỉ hôm nay) trứng nửa giá; rau giảm từ 5 giờ (mỗi ngày).', [
      ['ナレーター', 'ja-nu', 'スーパーで{店内|てんない}{放送|ほうそう}を{聞|き}いています。{今日|きょう}だけ{半額|はんがく}になるものは{何|なん}ですか。', 'Suupaa de tennai housou o kiite imasu. Kyou dake hangaku ni naru mono wa nan desu ka.', 'Bạn đang nghe loa trong siêu thị. Thứ gì chỉ hôm nay giảm nửa giá?'],
      ['アナウンス', 'ja-nu', '{本日|ほんじつ}もご{来店|らいてん}ありがとうございます。ただいま、{店内|てんない}の{全商品|ぜんしょうひん}を{一割引|いちわりびき}でご{提供|ていきょう}しております。ただし、お{弁当|べんとう}とお{惣菜|そうざい}は{対象外|たいしょうがい}となります。なお、{本日|ほんじつ}{限|かぎ}り、{卵|たまご}が{半額|はんがく}です。{野菜|やさい}は、{毎日|まいにち}{午後|ごご}{五時|ごじ}から{三割引|さんわりびき}になります。どうぞご{利用|りよう}ください。', 'Honjitsu mo goraiten arigatou gozaimasu. Tadaima, tennai no zenshouhin o ichiwaribiki de goteikyou shite orimasu. Tadashi, obentou to osouzai wa taishougai to narimasu. Nao, honjitsu kagiri, tamago ga hangaku desu. Yasai wa, mainichi gogo goji kara sanwaribiki ni narimasu. Douzo goriyou kudasai.', 'Cảm ơn quý khách hôm nay đã ghé cửa hàng. Hiện tất cả hàng trong cửa hàng đang giảm 10%. Tuy nhiên, cơm hộp và món ăn sẵn không áp dụng. Ngoài ra, chỉ riêng hôm nay, trứng giảm nửa giá. Rau thì ngày nào cũng giảm 30% từ 5 giờ chiều. Kính mời quý khách.'],
      ['ナレーター', 'ja-nu', '{今日|きょう}だけ{半額|はんがく}になるものは{何|なん}ですか。', 'Kyou dake hangaku ni naru mono wa nan desu ka.', 'Thứ gì chỉ hôm nay giảm nửa giá?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-lt4-ng-6-q',
      title: 'Câu hỏi',
      items: [
        { q: '{今日|きょう}だけ{半額|はんがく}になるものは{何|なん}ですか。', options: ['{店内|てんない}の{全部|ぜんぶ}の{商品|しょうひん}', 'お{弁当|べんとう}', '{卵|たまご}', '{野菜|やさい}'], correct: 2, why: 'Mọi hàng: chỉ **{一割引|いちわりびき}** (10%) → loại 1. Cơm hộp: **{対象外|たいしょうがい}** → loại 2. Rau: **{毎日|まいにち}…{三割引|さんわりびき}** → loại 4. Câu then chốt: **「なお、{本日|ほんじつ}{限|かぎ}り、{卵|たまご}が{半額|はんがく}です」**〔Nao, honjitsu kagiri, tamago ga hangaku desu〕. ～{割引|わりびき}: {一割|いちわり} = 10%.' },
      ],
    },

    /* ═══ 概要理解 ═══ */
    { t: 'h', text: '概要理解 1 — radio: đọc to giúp nghe giỏi hơn' },
    NG('b39-lt4-ng-7', '{男|おとこ}の{人|ひと}は{何|なに}について{話|はな}していますか', 'Dạng 概要理解 (chủ đề) — từ khoá: 声に出して読む (đọc thành tiếng) lặp lại; lý do: miệng nói được thì tai nghe được; kết: ですから、一日五分でも声に出して読んでみて.', [
      ['ナレーター', 'ja-nu', 'ラジオで{男|おとこ}の{人|ひと}が{話|はな}しています。', 'Rajio de otoko no hito ga hanashite imasu.', 'Một người đàn ông đang nói trên radio.'],
      ['パーソナリティー', 'ja-nam', '{外国語|がいこくご}を{勉強|べんきょう}している{皆|みな}さん、{教科書|きょうかしょ}を{声|こえ}に{出|だ}して{読|よ}んでいますか。{実|じつ}は、{声|こえ}に{出|だ}して{読|よ}むことは、{聞|き}く{力|ちから}にもとても{役|やく}に{立|た}つんです。{自分|じぶん}で{言|い}える{音|おと}は、{耳|みみ}にも{入|はい}りやすくなるからです。{反対|はんたい}に、{一度|いちど}も{口|くち}に{出|だ}したことのない{言葉|ことば}は、{聞|き}いても{気|き}がつきにくいんですね。ですから、{一日|いちにち}{五分|ごふん}でもいいので、{声|こえ}に{出|だ}して{読|よ}んでみてください。', 'Gaikokugo o benkyou shite iru minasan, kyoukasho o koe ni dashite yonde imasu ka. Jitsu wa, koe ni dashite yomu koto wa, kiku chikara ni mo totemo yaku ni tatsu n desu. Jibun de ieru oto wa, mimi ni mo hairiyasuku naru kara desu. Hantai ni, ichido mo kuchi ni dashita koto no nai kotoba wa, kiite mo ki ga tsukinikui n desu ne. Desukara, ichinichi gofun demo ii node, koe ni dashite yonde mite kudasai.', 'Các bạn đang học ngoại ngữ ơi, các bạn có đọc to sách giáo khoa không? Thật ra, đọc thành tiếng cũng rất có ích cho khả năng nghe. Vì âm mình tự nói được thì tai cũng dễ nghe ra. Ngược lại, chữ chưa từng nói ra miệng lần nào thì có nghe cũng khó nhận ra. Vì vậy, mỗi ngày 5 phút cũng được, hãy thử đọc thành tiếng.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}は{何|なに}について{話|はな}していますか。', 'Otoko no hito wa nani ni tsuite hanashite imasu ka.', 'Người đàn ông đang nói về điều gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-lt4-ng-7-q',
      title: 'Câu hỏi',
      items: [
        { q: '{男|おとこ}の{人|ひと}は{何|なに}について{話|はな}していますか。', options: ['{教科書|きょうかしょ}の{選|えら}び{方|かた}', '{声|こえ}に{出|だ}して{読|よ}むことが{聞|き}く{力|ちから}に{役立|やくだ}つこと', 'ラジオを{毎日|まいにち}{五分|ごふん}{聞|き}くこと', '{外国語|がいこくご}の{発音|はつおん}の{難|むずか}しさ'], correct: 1, why: 'Từ khoá lặp lại: **{声|こえ}に{出|だ}して{読|よ}む**. Câu then chốt: **「{声|こえ}に{出|だ}して{読|よ}むことは、{聞|き}く{力|ちから}にもとても{役|やく}に{立|た}つんです」**〔Koe ni dashite yomu koto wa, kiku chikara ni mo totemo yaku ni tatsu n desu〕. 3: 5 phút là thời gian ĐỌC, không phải nghe radio.' },
      ],
    },

    { t: 'h', text: '概要理解 2 — lời nhắn thoại của chị 鈴木' },
    NG('b39-lt4-ng-8', '{鈴木|すずき}さんは{何|なん}のために{電話|でんわ}しましたか', 'Dạng 概要理解 (mục đích cuộc gọi) — xin lỗi gọi muộn; nội dung chính: buổi họp mai ĐỔI CHỖ (phòng họp → văn phòng công ty khách); giờ không đổi; kết: hẹn gặp ở cửa toà nhà.', [
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}が{留守番電話|るすばんでんわ}にメッセージを{残|のこ}しています。', 'Onna no hito ga rusuban denwa ni messeeji o nokoshite imasu.', 'Một người phụ nữ để lại tin nhắn trong hộp thư thoại.'],
      ['{鈴木|すずき}', 'ja-nu', 'ワンさん、{鈴木|すずき}です。{遅|おそ}くにごめんね。{明日|あした}の{打|う}ち{合|あ}わせなんだけど、{会社|かいしゃ}の{会議室|かいぎしつ}じゃなくて、{東京商事|とうきょうしょうじ}さんの{事務所|じむしょ}でやることになったの。{時間|じかん}は{変|か}わらなくて、{十時|じゅうじ}から。{九時半|くじはん}に、{東京商事|とうきょうしょうじ}さんのビルの{入|い}り{口|ぐち}で{待|ま}ち{合|あ}わせしよう。じゃあ、よろしくね。', 'Wan-san, Suzuki desu. Osoku ni gomen ne. Ashita no uchiawase na n da kedo, kaisha no kaigishitsu ja nakute, Toukyou Shouji-san no jimusho de yaru koto ni natta no. Jikan wa kawaranakute, juuji kara. Kujihan ni, Toukyou Shouji-san no biru no iriguchi de machiawase shiyou. Jaa, yoroshiku ne.', 'Wan à, chị Suzuki đây. Xin lỗi gọi muộn nhé. Buổi họp ngày mai ấy, không phải ở phòng họp công ty mình nữa mà sẽ họp ở văn phòng công ty Tokyo Shoji. Giờ không đổi, từ 10 giờ. 9 rưỡi mình hẹn gặp ở cửa toà nhà Tokyo Shoji nhé. Thế nhé, nhờ em.'],
      ['ナレーター', 'ja-nu', '{鈴木|すずき}さんは{何|なん}のために{電話|でんわ}しましたか。', 'Suzuki-san wa nan no tame ni denwa shimashita ka.', 'Chị Suzuki gọi điện để làm gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-lt4-ng-8-q',
      title: 'Câu hỏi',
      items: [
        { q: '{鈴木|すずき}さんは{何|なん}のために{電話|でんわ}しましたか。', options: ['{打|う}ち{合|あ}わせの{時間|じかん}が{変|か}わったことを{伝|つた}えるため', '{打|う}ち{合|あ}わせの{場所|ばしょ}が{変|か}わったことを{伝|つた}えるため', '{打|う}ち{合|あ}わせが{中止|ちゅうし}になったことを{伝|つた}えるため', '{会議室|かいぎしつ}の{予約|よやく}を{頼|たの}むため'], correct: 1, why: 'Câu then chốt: **「{会社|かいしゃ}の{会議室|かいぎしつ}じゃなくて、{東京商事|とうきょうしょうじ}さんの{事務所|じむしょ}でやることになったの」**〔Kaisha no kaigishitsu ja nakute, Toukyou Shouji-san no jimusho de yaru koto ni natta no〕. Giờ: **{変|か}わらなくて** → loại 1.' },
      ],
    },

    { t: 'h', text: '概要理解 3 — ý kiến về ứng dụng học tiếng mới' },
    NG('b39-lt4-ng-9', '{女|おんな}の{人|ひと}はこのアプリについてどう{思|おも}っていますか', 'Dạng 概要理解 (thái độ) — khen: tiện, bài nghe nhiều; けど: chỉ miễn phí tháng đầu, sau đó đắt; kết bằng まあ…ずっとは使わないかな: dùng thử thì được, không dùng lâu.', [
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}が、{日本語|にほんご}のアプリについて{話|はな}しています。', 'Otoko no hito to onna no hito ga, nihongo no apuri ni tsuite hanashite imasu.', 'Một người đàn ông và một người phụ nữ đang nói về ứng dụng học tiếng Nhật.'],
      ['マルコ', 'ja-nam', 'メアリーさん、この{新|あたら}しいアプリ、もう{使|つか}ってみた？', 'Mearii-san, kono atarashii apuri, mou tsukatte mita?', 'Mary, cái app mới này cậu dùng thử chưa?'],
      ['メアリー', 'ja-nu', 'うん。{聴解|ちょうかい}の{問題|もんだい}がたくさんあって、{便利|べんり}なんだけど……{無料|むりょう}なのは{最初|さいしょ}の{一|いっ}か{月|げつ}だけなんだよね。そのあとは{毎月|まいつき}{二千円|にせんえん}。', 'Un. Choukai no mondai ga takusan atte, benri na n da kedo…… muryou na no wa saisho no ikkagetsu dake na n da yo ne. Sono ato wa maitsuki nisen en.', 'Ừ. Có nhiều bài nghe, tiện lắm, nhưng mà… chỉ miễn phí tháng đầu thôi. Sau đó mỗi tháng 2.000 yên.'],
      ['マルコ', 'ja-nam', '{二千円|にせんえん}か。ちょっと{高|たか}いね。', 'Nisen en ka. Chotto takai ne.', '2.000 yên à. Hơi đắt nhỉ.'],
      ['メアリー', 'ja-nu', 'まあ、{一|いっ}か{月|げつ}{試|ため}してみるのはいいと{思|おも}うけど、ずっとは{使|つか}わないかな。', 'Maa, ikkagetsu tameshite miru no wa ii to omou kedo, zutto wa tsukawanai kana.', 'Thôi thì dùng thử một tháng thì được, nhưng chắc tớ không dùng lâu đâu.'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}はこのアプリについてどう{思|おも}っていますか。', 'Onna no hito wa kono apuri ni tsuite dou omotte imasu ka.', 'Người phụ nữ nghĩ gì về ứng dụng này?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-lt4-ng-9-q',
      title: 'Câu hỏi',
      items: [
        { q: '{女|おんな}の{人|ひと}はこのアプリについてどう{思|おも}っていますか。', options: ['{便利|べんり}なので、ずっと{使|つか}いたい', '{試|ため}すのはいいが、ずっと{使|つか}うつもりはない', '{問題|もんだい}が{少|すく}ないので、{使|つか}いたくない', '{無料|むりょう}なので、みんなに{勧|すす}めたい'], correct: 1, why: 'Khen trước **けど**, chê sau (đắt). Câu kết: **「まあ、{一|いっ}か{月|げつ}{試|ため}してみるのはいいと{思|おも}うけど、ずっとは{使|つか}わないかな」**〔Maa, ikkagetsu tameshite miru no wa ii to omou kedo, zutto wa tsukawanai kana〕.' },
      ],
    },

    /* ═══ 発話表現 ═══ */
    { t: 'h', text: '発話表現 1 — nhờ nhân viên hâm nóng cơm hộp' },
    { t: 'canh', anh: ['convenience-store', 'bento-box', 'woman-student'], caption: 'Tranh: quầy thu ngân cửa hàng tiện lợi. Nữ sinh (có mũi tên) đặt hộp cơm lên quầy, chỉ vào lò vi sóng sau lưng nhân viên.' },
    NG('b39-lt4-ng-10', '{何|なん}と{言|い}いますか', 'Dạng 発話表現 — khách NHỜ nhân viên hâm (～ていただけますか). Loại: câu của nhân viên (温めましょうか), câu cho phép (温めてもいいですよ).', [
      ['ナレーター', 'ja-nu', 'コンビニでお{弁当|べんとう}を{買|か}います。{店員|てんいん}に{温|あたた}めてほしいです。{何|なん}と{言|い}いますか。', 'Konbini de obentou o kaimasu. Ten\'in ni atatamete hoshii desu. Nan to iimasu ka.', 'Bạn mua cơm hộp ở cửa hàng tiện lợi. Bạn muốn nhân viên hâm nóng. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、お{弁当|べんとう}、{温|あたた}めましょうか。　2、お{弁当|べんとう}、{温|あたた}めていただけますか。　3、お{弁当|べんとう}、{温|あたた}めてもいいですよ。', 'Ichi, obentou, atatamemashou ka. Ni, obentou, atatamete itadakemasu ka. San, obentou, atatamete mo ii desu yo.', '1. Tôi hâm cơm hộp cho nhé? 2. Anh hâm giúp tôi hộp cơm được không? 3. Anh hâm cơm hộp cũng được đấy.'],
    ]),
    { t: 'mcq', id: 'b39-lt4-ng-10-q', title: 'Câu hỏi', items: [{ q: 'お{弁当|べんとう}を{温|あたた}めてほしい。', options: ['1', '2', '3'], correct: 1, why: 'Khách NHỜ → **{温|あたた}めていただけますか**〔Atatamete itadakemasu ka〕. 1 là câu nhân viên hỏi khách; 3 là câu cho phép.' }] },

    { t: 'h', text: '発話表現 2 — đến muộn buổi họp, xin lỗi trưởng phòng' },
    { t: 'canh', anh: ['woman-office-worker', 'man-office-worker', 'mantelpiece-clock'], caption: 'Tranh: phòng họp, đồng hồ chỉ 10 giờ 15. Một nữ nhân viên (có mũi tên) vừa mở cửa bước vào, cúi đầu trước trưởng phòng đang ngồi đầu bàn.' },
    NG('b39-lt4-ng-11', '{何|なん}と{言|い}いますか', 'Dạng 発話表現 — xin lỗi CẤP TRÊN vì đã muộn → lịch sự: 申し訳ありません. Loại: câu suồng sã với bạn (ごめんね), câu xin phép tương lai (遅れてもいいですか).', [
      ['ナレーター', 'ja-nu', '{会議|かいぎ}に{遅|おく}れてしまいました。{課長|かちょう}に{謝|あやま}ります。{何|なん}と{言|い}いますか。', 'Kaigi ni okurete shimaimashita. Kachou ni ayamarimasu. Nan to iimasu ka.', 'Bạn lỡ đến muộn cuộc họp. Bạn xin lỗi trưởng phòng. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、{遅|おく}れちゃって、ごめんね。　2、{遅|おく}れてもいいですか。　3、{遅|おく}れてしまって、{申|もう}し{訳|わけ}ありません。', 'Ichi, okurechatte, gomen ne. Ni, okurete mo ii desu ka. San, okurete shimatte, moushiwake arimasen.', '1. Lỡ muộn mất, xin lỗi nha. 2. Tôi đến muộn có được không? 3. Tôi đã đến muộn, thành thật xin lỗi anh.'],
    ]),
    { t: 'mcq', id: 'b39-lt4-ng-11-q', title: 'Câu hỏi', items: [{ q: '{会議|かいぎ}に{遅|おく}れて、{課長|かちょう}に{謝|あやま}る。', options: ['1', '2', '3'], correct: 2, why: 'Với cấp trên → **{遅|おく}れてしまって、{申|もう}し{訳|わけ}ありません**〔Okurete shimatte, moushiwake arimasen〕. 1 dạng ～ちゃって + ごめんね chỉ dùng với bạn; 2 là xin phép trước — đã muộn rồi.' }] },

    { t: 'h', text: '発話表現 3 — hỏi đường tới bến taxi' },
    { t: 'canh', anh: ['station', 'man-student', 'oncoming-taxi'], caption: 'Tranh: cửa soát vé nhà ga, một nam sinh (có mũi tên) kéo vali, nhìn quanh tìm biển "タクシー乗り場". Cạnh đó là một nhân viên nhà ga.' },
    NG('b39-lt4-ng-12', '{何|なん}と{言|い}いますか', 'Dạng 発話表現 — khách HỎI đường (～はどちらですか). Loại: câu của nhân viên (ご案内します・あちらでございます).', [
      ['ナレーター', 'ja-nu', '{駅|えき}でタクシーに{乗|の}りたいです。{駅員|えきいん}に{聞|き}きます。{何|なん}と{言|い}いますか。', 'Eki de takushii ni noritai desu. Ekiin ni kikimasu. Nan to iimasu ka.', 'Bạn muốn đi taxi ở ga. Bạn hỏi nhân viên ga. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、タクシー{乗|の}り{場|ば}までご{案内|あんない}します。　2、タクシー{乗|の}り{場|ば}はあちらでございます。　3、すみません、タクシー{乗|の}り{場|ば}はどちらですか。', 'Ichi, takushii noriba made goannai shimasu. Ni, takushii noriba wa achira de gozaimasu. San, sumimasen, takushii noriba wa dochira desu ka.', '1. Tôi xin dẫn anh đến bến taxi. 2. Bến taxi ở đằng kia ạ. 3. Xin lỗi, bến taxi ở phía nào ạ?'],
    ]),
    { t: 'mcq', id: 'b39-lt4-ng-12-q', title: 'Câu hỏi', items: [{ q: '{駅員|えきいん}にタクシー{乗|の}り{場|ば}を{聞|き}く。', options: ['1', '2', '3'], correct: 2, why: 'Khách HỎI → **すみません、タクシー{乗|の}り{場|ば}はどちらですか**〔Sumimasen, takushii noriba wa dochira desu ka〕. 1, 2 là câu của nhân viên (ご{案内|あんない}します・でございます).' }] },

    /* ═══ 即時応答 ═══ */
    { t: 'h', text: '即時応答 1 — bộ F (2 câu)' },
    NG('b39-lt4-ng-13', '{正|ただ}しい{返事|へんじ}を{選|えら}んでください（{2問|にもん}）', 'Dạng 即時応答 — ① chị khoá trên nhờ photo sẵn (～といてくれる？) · ② bạn báo xong báo cáo.', [
      ['ナレーター', 'ja-nu', '1{番|ばん}。', 'Ichiban.', 'Câu 1.'],
      ['{鈴木|すずき}', 'ja-nu', 'ワンさん、この{資料|しりょう}、コピーしといてくれる？', 'Wan-san, kono shiryou, kopii shitoite kureru?', 'Wan ơi, photo sẵn tài liệu này giúp chị nhé?'],
      ['ワン', 'ja-nu', '1、コピーしなくてもいいですよ。　2、はい、{何部|なんぶ}ですか。　3、はい、コピーしちゃいました。', 'Ichi, kopii shinakute mo ii desu yo. Ni, hai, nanbu desu ka. San, hai, kopii shichaimashita.', '1. Không cần photo đâu chị. 2. Vâng, bao nhiêu bản ạ? 3. Vâng, em lỡ photo mất rồi.'],
      ['ナレーター', 'ja-nu', '2{番|ばん}。', 'Niban.', 'Câu 2.'],
      ['マルコ', 'ja-nam', 'レポート、やっと{終|お}わった！', 'Repooto, yatto owatta!', 'Báo cáo cuối cùng cũng xong!'],
      ['リン', 'ja-nu', '1、{早|はや}く{終|お}わらせてね。　2、{終|お}わらなくて{大変|たいへん}だね。　3、お{疲|つか}れさま。よく{頑張|がんば}ったね。', 'Ichi, hayaku owarasete ne. Ni, owaranakute taihen da ne. San, otsukaresama. Yoku ganbatta ne.', '1. Làm xong nhanh đi nhé. 2. Không xong được, vất vả nhỉ. 3. Vất vả rồi. Cậu cố gắng giỏi lắm.'],
    ]),
    {
      t: 'mcq',
      id: 'b39-lt4-ng-13-q',
      title: 'Câu hỏi',
      items: [
        { q: '1{番|ばん} — 「この{資料|しりょう}、コピーしといてくれる？」', options: ['1', '2', '3'], correct: 1, why: 'Được nhờ → nhận lời + hỏi chi tiết: **はい、{何部|なんぶ}ですか**〔Hai, nanbu desu ka〕. 3 nghe nhầm ～とく thành ～ちゃう.' },
        { q: '2{番|ばん} — 「レポート、やっと{終|お}わった！」', options: ['1', '2', '3'], correct: 2, why: 'Tin vui (やっと = cuối cùng) → **お{疲|つか}れさま**〔Otsukaresama〕. 1, 2 hiểu ngược (chưa xong).' },
      ],
    },

    { t: 'h', text: '即時応答 2 — bộ G (2 câu)' },
    NG('b39-lt4-ng-14', '{正|ただ}しい{返事|へんじ}を{選|えら}んでください（{2問|にもん}）', 'Dạng 即時応答 — ① thu ngân hỏi có thẻ tích điểm không · ② bạn báo mai hình như mưa.', [
      ['ナレーター', 'ja-nu', '1{番|ばん}。', 'Ichiban.', 'Câu 1.'],
      ['{店員|てんいん}', 'ja-nu', 'ポイントカードはお{持|も}ちですか。', 'Pointo kaado wa omochi desu ka.', 'Quý khách có thẻ tích điểm không ạ?'],
      ['ダニエル', 'ja-nam', '1、はい、お{持|も}ちです。　2、いえ、{持|も}っていません。　3、ポイントを{差|さ}し{上|あ}げます。', 'Ichi, hai, omochi desu. Ni, ie, motte imasen. San, pointo o sashiagemasu.', '1. Vâng, tôi "quý có". 2. Không, tôi không có. 3. Tôi xin biếu điểm.'],
      ['ナレーター', 'ja-nu', '2{番|ばん}。', 'Niban.', 'Câu 2.'],
      ['パク', 'ja-nu', '{明日|あした}、{雨|あめ}みたいだよ。', 'Ashita, ame mitai da yo.', 'Mai hình như mưa đấy.'],
      ['{西川|にしかわ}', 'ja-nam', '1、{雨|あめ}でよかったね。　2、{雨|あめ}、{降|ふ}らせないで。　3、じゃあ、{傘|かさ}{持|も}ってかなきゃ。', 'Ichi, ame de yokatta ne. Ni, ame, furasenaide. San, jaa, kasa motte kanakya.', '1. Mưa thì may nhỉ. 2. Đừng làm mưa nhé. 3. Vậy phải mang ô theo thôi.'],
    ]),
    {
      t: 'mcq',
      id: 'b39-lt4-ng-14-q',
      title: 'Câu hỏi',
      items: [
        { q: '1{番|ばん} — 「ポイントカードはお{持|も}ちですか。」', options: ['1', '2', '3'], correct: 1, why: '**いえ、{持|も}っていません**〔Ie, motte imasen〕. 1 dùng kính ngữ お{持|も}ち cho chính mình — sai; 3 ngược vai.' },
        { q: '2{番|ばん} — 「{明日|あした}、{雨|あめ}みたいだよ。」', options: ['1', '2', '3'], correct: 2, why: 'Báo tin → phản ứng hợp lý: **じゃあ、{傘|かさ}{持|も}ってかなきゃ**〔Jaa, kasa motte kanakya — = 持っていかなければ〕.' },
      ],
    },

    { t: 'h', text: '即時応答 3 — bộ H (2 câu)' },
    NG('b39-lt4-ng-15', '{正|ただ}しい{返事|へんじ}を{選|えら}んでください（{2問|にもん}）', 'Dạng 即時応答 — ① trưởng phòng xin lùi cuộc họp 2 giờ thêm 30 phút (遅らせる) · ② bạn xin một miếng bánh.', [
      ['ナレーター', 'ja-nu', '1{番|ばん}。', 'Ichiban.', 'Câu 1.'],
      ['{森課長|もりかちょう}', 'ja-nam', '{悪|わる}いけど、{二時|にじ}からの{会議|かいぎ}、{三十分|さんじゅっぷん}{遅|おく}らせてもいいかな。', 'Warui kedo, niji kara no kaigi, sanjuppun okurasete mo ii kana.', 'Ngại quá, cuộc họp 2 giờ lùi lại 30 phút được không?'],
      ['ワン', 'ja-nu', '1、はい、では{二時半|にじはん}からですね。　2、はい、{早|はや}めておきます。　3、{遅|おく}れてすみません。', 'Ichi, hai, dewa nijihan kara desu ne. Ni, hai, hayamete okimasu. San, okurete sumimasen.', '1. Vâng, vậy là từ 2 rưỡi nhỉ. 2. Vâng, em sẽ đẩy sớm lên. 3. Xin lỗi em đến muộn.'],
      ['ナレーター', 'ja-nu', '2{番|ばん}。', 'Niban.', 'Câu 2.'],
      ['メアリー', 'ja-nu', 'そのケーキ、{一口|ひとくち}もらってもいい？', 'Sono keeki, hitokuchi moratte mo ii?', 'Cho tớ một miếng bánh đó được không?'],
      ['アンナ', 'ja-nu', '1、うん、もらってね。　2、ケーキ、あげなきゃ。　3、うん、どうぞ。', 'Ichi, un, moratte ne. Ni, keeki, agenakya. San, un, douzo.', '1. Ừ, nhận đi nhé. 2. Phải cho bánh thôi. 3. Ừ, cậu ăn đi.'],
    ]),
    {
      t: 'mcq',
      id: 'b39-lt4-ng-15-q',
      title: 'Câu hỏi',
      items: [
        { q: '1{番|ばん} — 「{二時|にじ}からの{会議|かいぎ}、{三十分|さんじゅっぷん}{遅|おく}らせてもいいかな。」', options: ['1', '2', '3'], correct: 0, why: '**{遅|おく}らせる** = lùi: 2:00 + 30 phút → **では{二時半|にじはん}からですね**〔Dewa nijihan kara desu ne〕. 2 nhầm với {早|はや}める.' },
        { q: '2{番|ばん} — 「そのケーキ、{一口|ひとくち}もらってもいい？」', options: ['1', '2', '3'], correct: 2, why: 'Bạn xin → **うん、どうぞ**〔Un, douzo〕. 1 lặp もらう — ngôi lệch.' },
      ],
    },

    { t: 'h', text: '即時応答 4 — bộ I (2 câu)' },
    NG('b39-lt4-ng-16', '{正|ただ}しい{返事|へんじ}を{選|えら}んでください（{2問|にもん}）', 'Dạng 即時応答 — ① lễ tân bảo ngồi chờ đến khi gọi tên · ② bạn hỏi bài thi thế nào.', [
      ['ナレーター', 'ja-nu', '1{番|ばん}。', 'Ichiban.', 'Câu 1.'],
      ['{受付|うけつけ}', 'ja-nu', 'お{名前|なまえ}をお{呼|よ}びするまで、あちらでお{待|ま}ちください。', 'Onamae o oyobi suru made, achira de omachi kudasai.', 'Xin quý khách chờ ở đằng kia cho đến khi được gọi tên.'],
      ['カルロス', 'ja-nam', '1、お{名前|なまえ}は{何|なん}ですか。　2、はい、わかりました。　3、お{待|ま}たせしました。', 'Ichi, onamae wa nan desu ka. Ni, hai, wakarimashita. San, omatase shimashita.', '1. Quý danh của chị là gì? 2. Vâng, tôi hiểu rồi. 3. Xin lỗi đã để chị chờ.'],
      ['ナレーター', 'ja-nu', '2{番|ばん}。', 'Niban.', 'Câu 2.'],
      ['{山口|やまぐち}', 'ja-nu', '{試験|しけん}、どうだった？', 'Shiken, dou datta?', 'Bài thi thế nào?'],
      ['マルコ', 'ja-nam', '1、{試験|しけん}、{頑張|がんば}ってね。　2、まだ{受|う}けてないって。　3、なんとか{全部|ぜんぶ}{書|か}けたよ。', 'Ichi, shiken, ganbatte ne. Ni, mada uketenai tte. San, nantoka zenbu kaketa yo.', '1. Thi cố lên nhé. 2. Người ta bảo chưa thi. 3. Cuối cùng tớ cũng viết được hết.'],
    ]),
    {
      t: 'mcq',
      id: 'b39-lt4-ng-16-q',
      title: 'Câu hỏi',
      items: [
        { q: '1{番|ばん} — 「お{名前|なまえ}をお{呼|よ}びするまで、あちらでお{待|ま}ちください。」', options: ['1', '2', '3'], correct: 1, why: 'Được hướng dẫn → **はい、わかりました**〔Hai, wakarimashita〕. 1 hỏi tên lễ tân — vô lý; 3 là câu của người làm khách chờ.' },
        { q: '2{番|ばん} — 「{試験|しけん}、どうだった？」', options: ['1', '2', '3'], correct: 2, why: 'Hỏi bài thi (quá khứ) → kể kết quả: **なんとか{全部|ぜんぶ}{書|か}けたよ**〔Nantoka zenbu kaketa yo〕. 1 dùng cho thi sắp tới; 2 ngôi lệch.' },
      ],
    },
  ],
};

const LT_5: Lesson = {
  id: 'b39-lt-5-de-mini',
  kind: 'homework',
  title: 'Luyện thêm 5 · Đề nghe mini 20 phút — 問題1 ×3 · 問題2 ×3 · 問題3 ×2 · 問題4 ×2 · 問題5 ×4 (14 câu, thang điểm 30)',
  goal: 'Làm một đề nghe thu nhỏ đúng cấu trúc 5 dạng của 聴解 N3 trong khoảng 20 phút, không dừng băng, rồi tự chấm theo thang 30 điểm và biết sai câu nào thì ôn phần nào.',
  minutes: 25,
  blocks: [
    {
      t: 'table',
      caption: 'Cấu trúc & thang điểm đề mini (mô phỏng 聴解 N3, rút gọn một nửa)',
      head: ['Phần', 'Số câu', 'Điểm mỗi câu', 'Tổng'],
      rows: [
        ['問題1 課題理解', '3', '3', '9'],
        ['問題2 ポイント理解', '3', '3', '9'],
        ['問題3 概要理解', '2', '3', '6'],
        ['問題4 発話表現', '2', '1', '2'],
        ['問題5 即時応答', '4', '1', '4'],
        ['**Tổng**', '**14**', '', '**30**'],
      ],
    },
    {
      t: 'note',
      title: 'Luật làm đề & điểm đạt',
      items: [
        '**Làm như thi thật**: bấm nghe từng bài **một lần**, không mở lời thoại, không tua lại. 問題3・4・5: che lựa chọn, nghe xong mới mở. Toàn đề ~20 phút.',
        '**Điểm đạt của khoá: ≥ 18 / 30** (60%). **≥ 24**: rất tốt — sẵn sàng thi thử N3 ở Bài 40. **18–23**: đạt — ôn đúng phần sai theo bảng cuối. **< 18**: làm lại Luyện thêm 4 và mục Nghe, rồi làm lại đề này sau 3 ngày.',
        'Tham chiếu JLPT: 聴解 N3 có điểm liệt **19 / 60** (≈ 32%) — trong đề mini tương đương **≈ 10 / 30**. Dưới mức này là trượt dù các phần khác cao.',
      ],
    },

    /* 問題1 */
    { t: 'h', text: '問題1 課題理解 (3 câu)' },
    NG('b39-lt5-1', '{女|おんな}の{学生|がくせい}はこのあとまず{何|なに}をしますか', 'Đề mini — 問題1 câu 1.', [
      ['ナレーター', 'ja-nu', '{大学|だいがく}で、{男|おとこ}の{学生|がくせい}と{女|おんな}の{学生|がくせい}が{大学祭|だいがくさい}の{準備|じゅんび}について{話|はな}しています。{女|おんな}の{学生|がくせい}はこのあとまず{何|なに}をしますか。', 'Daigaku de, otoko no gakusei to onna no gakusei ga daigakusai no junbi ni tsuite hanashite imasu. Onna no gakusei wa kono ato mazu nani o shimasu ka.', 'Ở trường, một nam sinh và một nữ sinh đang nói về việc chuẩn bị lễ hội trường. Sau đây nữ sinh sẽ làm gì trước tiên?'],
      ['ダニエル', 'ja-nam', 'リンさん、ポスターはもう{貼|は}っといたよ。{飲|の}み{物|もの}の{注文|ちゅうもん}は{僕|ぼく}がやっとく。', 'Rin-san, posutaa wa mou hattoita yo. Nomimono no chuumon wa boku ga yattoku.', 'Rin ơi, áp phích tớ dán rồi đấy. Đặt đồ uống thì để tớ lo.'],
      ['リン', 'ja-nu', 'ありがとう。じゃあ、{私|わたし}は{看板|かんばん}を{作|つく}ろうかな。', 'Arigatou. Jaa, watashi wa kanban o tsukurou kana.', 'Cảm ơn. Vậy tớ làm biển hiệu nhé.'],
      ['ダニエル', 'ja-nam', '{看板|かんばん}は{昼|ひる}ご{飯|はん}のあとでみんなで{作|つく}ろうよ。それより、テントを{借|か}りる{申請|しんせい}、{今日|きょう}の{五時|ごじ}までだよ。{先|さき}にそれ、{学生課|がくせいか}に{出|だ}してきてくれる？', 'Kanban wa hirugohan no ato de minna de tsukurou yo. Sore yori, tento o kariru shinsei, kyou no goji made da yo. Saki ni sore, gakuseika ni dashite kite kureru?', 'Biển hiệu thì sau bữa trưa cả nhóm cùng làm. Quan trọng hơn, đơn xin mượn lều hạn là 5 giờ hôm nay đấy. Cậu nộp cái đó cho phòng công tác sinh viên trước giúp tớ nhé?'],
      ['リン', 'ja-nu', 'あ、そうだった。すぐ{行|い}ってくる。', 'A, sou datta. Sugu itte kuru.', 'À đúng rồi. Tớ đi ngay.'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{学生|がくせい}はこのあとまず{何|なに}をしますか。', 'Onna no gakusei wa kono ato mazu nani o shimasu ka.', 'Sau đây nữ sinh sẽ làm gì trước tiên?'],
    ]),
    NG('b39-lt5-2', '{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか', 'Đề mini — 問題1 câu 2.', [
      ['ナレーター', 'ja-nu', '{歯医者|はいしゃ}の{受付|うけつけ}で、{受付|うけつけ}の{人|ひと}と{男|おとこ}の{人|ひと}が{話|はな}しています。{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Haisha no uketsuke de, uketsuke no hito to otoko no hito ga hanashite imasu. Otoko no hito wa kono ato mazu nani o shimasu ka.', 'Ở quầy lễ tân phòng nha, nhân viên lễ tân và một người đàn ông đang nói chuyện. Sau đây người đàn ông sẽ làm gì trước tiên?'],
      ['{受付|うけつけ}', 'ja-nu', 'お{疲|つか}れさまでした。お{会計|かいけい}の{前|まえ}に、{次|つぎ}のご{予約|よやく}を{決|き}めましょうか。{来週|らいしゅう}の{火曜日|かようび}はいかがですか。', 'Otsukaresama deshita. Okaikei no mae ni, tsugi no goyoyaku o kimemashou ka. Raishuu no kayoubi wa ikaga desu ka.', 'Anh vất vả rồi. Trước khi thanh toán, mình hẹn lịch lần sau nhé. Thứ Ba tuần sau thì sao ạ?'],
      ['マルコ', 'ja-nam', '{火曜日|かようび}は{授業|じゅぎょう}があるので……{水曜日|すいようび}はどうですか。', 'Kayoubi wa jugyou ga aru node…… suiyoubi wa dou desu ka.', 'Thứ Ba tôi có tiết học… Thứ Tư thì sao ạ?'],
      ['{受付|うけつけ}', 'ja-nu', '{水曜日|すいようび}の{四時|よじ}でしたら、{空|あ}いております。', 'Suiyoubi no yoji deshitara, aite orimasu.', 'Nếu 4 giờ thứ Tư thì còn trống ạ.'],
      ['マルコ', 'ja-nam', 'じゃあ、それでお{願|ねが}いします。', 'Jaa, sore de onegai shimasu.', 'Vậy cho tôi giờ đó.'],
      ['{受付|うけつけ}', 'ja-nu', 'かしこまりました。{次回|じかい}も{診察券|しんさつけん}をお{持|も}ちください。お{会計|かいけい}は、お{名前|なまえ}をお{呼|よ}びしますので、あちらでお{待|ま}ちください。', 'Kashikomarimashita. Jikai mo shinsatsuken o omochi kudasai. Okaikei wa, onamae o oyobi shimasu node, achira de omachi kudasai.', 'Vâng ạ. Lần sau anh cũng mang thẻ khám nhé. Thanh toán thì chúng tôi sẽ gọi tên, anh ngồi chờ đằng kia ạ.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか。', 'Otoko no hito wa kono ato mazu nani o shimasu ka.', 'Sau đây người đàn ông sẽ làm gì trước tiên?'],
    ]),
    NG('b39-lt5-3', '{女|おんな}の{人|ひと}は{今日|きょう}{何|なに}をしなければなりませんか', 'Đề mini — 問題1 câu 3.', [
      ['ナレーター', 'ja-nu', '{会社|かいしゃ}で、{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}が{出張|しゅっちょう}について{話|はな}しています。{女|おんな}の{人|ひと}は{今日|きょう}{何|なに}をしなければなりませんか。', 'Kaisha de, otoko no hito to onna no hito ga shucchou ni tsuite hanashite imasu. Onna no hito wa kyou nani o shinakereba narimasen ka.', 'Ở công ty, một người đàn ông và một người phụ nữ đang nói về chuyến công tác. Hôm nay người phụ nữ phải làm gì?'],
      ['{森課長|もりかちょう}', 'ja-nam', 'ワンさん、{来週|らいしゅう}の{大阪|おおさか}{出張|しゅっちょう}だけど、{新幹線|しんかんせん}の{切符|きっぷ}はもう{買|か}ってあるから。', 'Wan-san, raishuu no Oosaka shucchou da kedo, shinkansen no kippu wa mou katte aru kara.', 'Wan à, chuyến công tác Osaka tuần sau ấy, vé tàu Shinkansen anh mua sẵn rồi.'],
      ['ワン', 'ja-nu', 'ありがとうございます。ホテルの{予約|よやく}はどうしましょうか。', 'Arigatou gozaimasu. Hoteru no yoyaku wa dou shimashou ka.', 'Em cảm ơn ạ. Còn đặt khách sạn thì sao ạ?'],
      ['{森課長|もりかちょう}', 'ja-nam', 'ホテルは{総務|そうむ}の{人|ひと}がやってくれる。{資料|しりょう}の{印刷|いんさつ}は{前|まえ}の{日|ひ}でいいよ。ただ、{出張|しゅっちょう}の{申請書|しんせいしょ}は{今日|きょう}の{五時|ごじ}までだから、{忘|わす}れずに{出|だ}してね。', 'Hoteru wa soumu no hito ga yatte kureru. Shiryou no insatsu wa mae no hi de ii yo. Tada, shucchou no shinseisho wa kyou no goji made da kara, wasurezu ni dashite ne.', 'Khách sạn thì người bên tổng vụ làm giúp. In tài liệu để hôm trước cũng được. Có điều, đơn xin đi công tác hạn là 5 giờ hôm nay, đừng quên nộp nhé.'],
      ['ワン', 'ja-nu', 'わかりました。お{昼|ひる}までに{出|だ}しておきます。', 'Wakarimashita. Ohiru made ni dashite okimasu.', 'Em hiểu rồi. Em sẽ nộp trước buổi trưa ạ.'],
      ['ナレーター', 'ja-nu', '{女|おんな}の{人|ひと}は{今日|きょう}{何|なに}をしなければなりませんか。', 'Onna no hito wa kyou nani o shinakereba narimasen ka.', 'Hôm nay người phụ nữ phải làm gì?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-lt5-m1',
      title: '問題1 — 3 câu (3 điểm / câu)',
      items: [
        { q: '1{番|ばん} — {女|おんな}の{学生|がくせい}はこのあとまず{何|なに}をしますか。', options: ['ポスターを{貼|は}る', '{飲|の}み{物|もの}を{注文|ちゅうもん}する', '{看板|かんばん}を{作|つく}る', 'テントの{申請|しんせい}を{出|だ}しに{行|い}く'], correct: 3, why: 'Áp phích: **もう{貼|は}っといた**; đồ uống: **{僕|ぼく}がやっとく**; biển hiệu: **{昼|ひる}ご{飯|はん}のあとで**. Câu then chốt: **「それより、テントを{借|か}りる{申請|しんせい}、…{先|さき}にそれ、{学生課|がくせいか}に{出|だ}してきてくれる？」**〔Sore yori, tento o kariru shinsei, … saki ni sore, gakuseika ni dashite kite kureru?〕.' },
        { q: '2{番|ばん} — {男|おとこ}の{人|ひと}はこのあとまず{何|なに}をしますか。', options: ['{次|つぎ}の{予約|よやく}を{決|き}める', '{名前|なまえ}を{呼|よ}ばれるまで{待|ま}つ', '{診察券|しんさつけん}を{出|だ}す', '{薬局|やっきょく}に{行|い}く'], correct: 1, why: 'Lịch hẹn đã quyết **trong hội thoại** (thứ Tư 4 giờ) → loại 1. Thẻ khám: **{次回|じかい}も** (lần sau) → loại 3. Câu then chốt: **「お{会計|かいけい}は、お{名前|なまえ}をお{呼|よ}びしますので、あちらでお{待|ま}ちください」**〔Okaikei wa, onamae o oyobi shimasu node, achira de omachi kudasai〕.' },
        { q: '3{番|ばん} — {女|おんな}の{人|ひと}は{今日|きょう}{何|なに}をしなければなりませんか。', options: ['{新幹線|しんかんせん}の{切符|きっぷ}を{買|か}う', 'ホテルを{予約|よやく}する', '{資料|しりょう}を{印刷|いんさつ}する', '{出張|しゅっちょう}の{申請書|しんせいしょ}を{出|だ}す'], correct: 3, why: 'Vé: **もう{買|か}ってある**; khách sạn: **{総務|そうむ}の{人|ひと}がやってくれる**; in: **{前|まえ}の{日|ひ}でいい**. Câu then chốt (sau ただ): **「{出張|しゅっちょう}の{申請書|しんせいしょ}は{今日|きょう}の{五時|ごじ}までだから、{忘|わす}れずに{出|だ}してね」**〔Shucchou no shinseisho wa kyou no goji made da kara, wasurezu ni dashite ne〕.' },
      ],
    },

    /* 問題2 */
    { t: 'h', text: '問題2 ポイント理解 (3 câu)' },
    NG('b39-lt5-4', '{男|おとこ}の{学生|がくせい}はどうしてサークルをやめましたか', 'Đề mini — 問題2 câu 1.', [
      ['ナレーター', 'ja-nu', '{女|おんな}の{学生|がくせい}と{男|おとこ}の{学生|がくせい}が{話|はな}しています。{男|おとこ}の{学生|がくせい}はどうしてサークルをやめましたか。', 'Onna no gakusei to otoko no gakusei ga hanashite imasu. Otoko no gakusei wa doushite saakuru o yamemashita ka.', 'Một nữ sinh và một nam sinh đang nói chuyện. Vì sao nam sinh bỏ câu lạc bộ?'],
      ['マリヤム', 'ja-nu', 'ナタポンさん、{陸上|りくじょう}のサークル、やめちゃったんだって？ バイトが{忙|いそが}しいの？', 'Natapon-san, rikujou no saakuru, yamechatta n datte? Baito ga isogashii no?', 'Natapon, nghe nói cậu bỏ câu lạc bộ điền kinh rồi à? Làm thêm bận à?'],
      ['ナタポン', 'ja-nam', 'ううん、バイトは{先月|せんげつ}から{減|へ}らしたんだ。{先輩|せんぱい}たちも{優|やさ}しかったし。', 'Uun, baito wa sengetsu kara herashita n da. Senpaitachi mo yasashikatta shi.', 'Không, làm thêm thì tớ giảm từ tháng trước rồi. Các anh chị khoá trên cũng hiền nữa.'],
      ['マリヤム', 'ja-nu', 'じゃあ、どうして？', 'Jaa, doushite?', 'Thế sao lại bỏ?'],
      ['ナタポン', 'ja-nam', '{実|じつ}は、{練習|れんしゅう}で{膝|ひざ}を{傷|いた}めちゃって。お{医者|いしゃ}さんに、しばらく{走|はし}らないほうがいいって{言|い}われたんだ。', 'Jitsu wa, renshuu de hiza o itamechatte. Oisha-san ni, shibaraku hashiranai hou ga ii tte iwareta n da.', 'Thật ra là tớ lỡ bị đau đầu gối lúc tập. Bác sĩ bảo một thời gian không nên chạy.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{学生|がくせい}はどうしてサークルをやめましたか。', 'Otoko no gakusei wa doushite saakuru o yamemashita ka.', 'Vì sao nam sinh bỏ câu lạc bộ?'],
    ]),
    NG('b39-lt5-5', '{今日|きょう}、{店|みせ}は{何時|なんじ}に{閉|し}まりますか', 'Đề mini — 問題2 câu 2.', [
      ['ナレーター', 'ja-nu', 'デパートで{放送|ほうそう}を{聞|き}いています。{今日|きょう}、{店|みせ}は{何時|なんじ}に{閉|し}まりますか。', 'Depaato de housou o kiite imasu. Kyou, mise wa nanji ni shimarimasu ka.', 'Bạn đang nghe loa ở trung tâm thương mại. Hôm nay cửa hàng đóng cửa lúc mấy giờ?'],
      ['アナウンス', 'ja-nu', 'ご{来店|らいてん}のお{客様|きゃくさま}にお{知|し}らせいたします。{本日|ほんじつ}は{店内|てんない}の{点検|てんけん}のため、{営業時間|えいぎょうじかん}を{短|みじか}くさせていただき、{午後|ごご}{七時|しちじ}で{閉店|へいてん}いたします。……{失礼|しつれい}いたしました。{訂正|ていせい}いたします。{本日|ほんじつ}の{閉店|へいてん}は、{午後|ごご}{六時半|ろくじはん}でございます。なお、{地下|ちか}の{食品売|しょくひんう}り{場|ば}は、いつもどおり{八時|はちじ}まで{営業|えいぎょう}しております。', 'Goraiten no okyakusama ni oshirase itashimasu. Honjitsu wa tennai no tenken no tame, eigyou jikan o mijikaku sasete itadaki, gogo shichiji de heiten itashimasu. …… Shitsurei itashimashita. Teisei itashimasu. Honjitsu no heiten wa, gogo rokuji han de gozaimasu. Nao, chika no shokuhin uriba wa, itsumo doori hachiji made eigyou shite orimasu.', 'Xin thông báo tới quý khách. Hôm nay do kiểm tra trong cửa hàng, chúng tôi xin rút ngắn giờ mở cửa và đóng cửa lúc 7 giờ tối. … Xin lỗi quý khách. Xin đính chính: hôm nay cửa hàng đóng cửa lúc 6 giờ rưỡi tối. Ngoài ra, khu thực phẩm ở tầng hầm vẫn mở đến 8 giờ như thường lệ.'],
      ['ナレーター', 'ja-nu', '{今日|きょう}、{店|みせ}は{何時|なんじ}に{閉|し}まりますか。', 'Kyou, mise wa nanji ni shimarimasu ka.', 'Hôm nay cửa hàng đóng cửa lúc mấy giờ?'],
    ]),
    NG('b39-lt5-6', 'どうして{試験|しけん}が{延期|えんき}になりましたか', 'Đề mini — 問題2 câu 3.', [
      ['ナレーター', 'ja-nu', '{大学|だいがく}で、{先生|せんせい}が{話|はな}しています。どうして{試験|しけん}が{延期|えんき}になりましたか。', 'Daigaku de, sensei ga hanashite imasu. Doushite shiken ga enki ni narimashita ka.', 'Ở trường, thầy giáo đang nói. Vì sao bài thi bị hoãn?'],
      ['{本田先生|ほんだせんせい}', 'ja-nam', '{皆|みな}さん、{明日|あした}の{期末試験|きまつしけん}ですが、{来週|らいしゅう}の{月曜日|げつようび}に{延期|えんき}します。{台風|たいふう}が{来|く}るという{予報|よほう}でしたが、{台風|たいふう}はそれたので、{心配|しんぱい}ありません。{実|じつ}は、{試験|しけん}をする{大教室|だいきょうしつ}のエアコンが{壊|こわ}れてしまって、{明日|あした}までに{直|なお}らないそうなんです。この{暑|あつ}さでは{無理|むり}ですからね。{時間|じかん}と{範囲|はんい}は{変|か}わりません。', 'Minasan, ashita no kimatsu shiken desu ga, raishuu no getsuyoubi ni enki shimasu. Taifuu ga kuru to iu yohou deshita ga, taifuu wa soreta node, shinpai arimasen. Jitsu wa, shiken o suru daikyoushitsu no eakon ga kowarete shimatte, ashita made ni naoranai sou na n desu. Kono atsusa de wa muri desu kara ne. Jikan to han\'i wa kawarimasen.', 'Các em, bài thi cuối kỳ ngày mai sẽ hoãn sang thứ Hai tuần sau. Có dự báo bão đến nhưng bão đã chệch hướng nên không phải lo. Thật ra là điều hoà ở giảng đường lớn nơi thi bị hỏng, nghe nói đến mai cũng không sửa xong. Nóng thế này thì không thi được. Giờ và phạm vi thi không đổi.'],
      ['ナレーター', 'ja-nu', 'どうして{試験|しけん}が{延期|えんき}になりましたか。', 'Doushite shiken ga enki ni narimashita ka.', 'Vì sao bài thi bị hoãn?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-lt5-m2',
      title: '問題2 — 3 câu (3 điểm / câu)',
      items: [
        { q: '1{番|ばん} — {男|おとこ}の{学生|がくせい}はどうしてサークルをやめましたか。', options: ['アルバイトが{忙|いそが}しいから', '{先輩|せんぱい}が{厳|きび}しいから', '{膝|ひざ}を{傷|いた}めたから', '{練習|れんしゅう}が{多|おお}すぎるから'], correct: 2, why: 'Làm thêm: **{減|へ}らした**; khoá trên: **{優|やさ}しかった** → loại 1, 2. Câu then chốt: **「{実|じつ}は、{練習|れんしゅう}で{膝|ひざ}を{傷|いた}めちゃって」**〔Jitsu wa, renshuu de hiza o itamechatte〕 — {傷|いた}める = làm đau (chữ mới 傷, kun いた・める).' },
        { q: '2{番|ばん} — {今日|きょう}、{店|みせ}は{何時|なんじ}に{閉|し}まりますか。', options: ['{六時|ろくじ}', '{六時半|ろくじはん}', '{七時|しちじ}', '{八時|はちじ}'], correct: 1, why: '7 giờ bị **{訂正|ていせい}**; 8 giờ chỉ là khu thực phẩm tầng hầm (sau **なお**). Câu then chốt: **「{訂正|ていせい}いたします。{本日|ほんじつ}の{閉店|へいてん}は、{午後|ごご}{六時半|ろくじはん}でございます」**〔Teisei itashimasu. Honjitsu no heiten wa, gogo rokuji han de gozaimasu〕.' },
        { q: '3{番|ばん} — どうして{試験|しけん}が{延期|えんき}になりましたか。', options: ['{台風|たいふう}が{来|く}るから', '{先生|せんせい}が{出張|しゅっちょう}するから', '{教室|きょうしつ}のエアコンが{壊|こわ}れたから', '{試験|しけん}の{範囲|はんい}が{変|か}わったから'], correct: 2, why: 'Bão: **それたので、{心配|しんぱい}ありません** → loại 1. Phạm vi **{変|か}わりません** → loại 4. Câu then chốt: **「{実|じつ}は、…{大教室|だいきょうしつ}のエアコンが{壊|こわ}れてしまって」**〔Jitsu wa, … daikyoushitsu no eakon ga kowarete shimatte〕.' },
      ],
    },

    /* 問題3 */
    { t: 'h', text: '問題3 概要理解 (2 câu) — che lựa chọn khi nghe' },
    NG('b39-lt5-7', '{男|おとこ}の{人|ひと}が{一番|いちばん}{言|い}いたいことは{何|なん}ですか', 'Đề mini — 問題3 câu 1.', [
      ['ナレーター', 'ja-nu', 'ラジオで{男|おとこ}の{人|ひと}が{話|はな}しています。', 'Rajio de otoko no hito ga hanashite imasu.', 'Một người đàn ông đang nói trên radio.'],
      ['パーソナリティー', 'ja-nam', '{家事|かじ}をしながら、{音楽|おんがく}やラジオを{聞|き}く「ながら{聞|ぎ}き」をしている{人|ひと}は{多|おお}いと{思|おも}います。{外国語|がいこくご}の{勉強|べんきょう}でも、ながら{聞|ぎ}きは{耳|みみ}を{慣|な}らすのには{役|やく}に{立|た}ちます。ただ、{試験|しけん}の{練習|れんしゅう}となると{話|はなし}は{別|べつ}です。{試験|しけん}では、{一回|いっかい}だけの{音声|おんせい}を{集中|しゅうちゅう}して{聞|き}かなければなりませんよね。ですから、{慣|な}れるためにはながら{聞|ぎ}き、{試験|しけん}のためには{集中|しゅうちゅう}して{聞|き}く。{目的|もくてき}に{合|あ}わせて{聞|き}き{方|かた}を{変|か}えることが{大切|たいせつ}なんです。', 'Kaji o shinagara, ongaku ya rajio o kiku "nagaragiki" o shite iru hito wa ooi to omoimasu. Gaikokugo no benkyou demo, nagaragiki wa mimi o narasu no ni wa yaku ni tachimasu. Tada, shiken no renshuu to naru to hanashi wa betsu desu. Shiken de wa, ikkai dake no onsei o shuuchuu shite kikanakereba narimasen yo ne. Desukara, nareru tame ni wa nagaragiki, shiken no tame ni wa shuuchuu shite kiku. Mokuteki ni awasete kikikata o kaeru koto ga taisetsu na n desu.', 'Tôi nghĩ có nhiều người vừa làm việc nhà vừa nghe nhạc hay radio — "nghe trong lúc làm việc khác". Khi học ngoại ngữ, kiểu nghe này cũng có ích để tai quen. Có điều, khi luyện thi thì lại khác. Trong kỳ thi, ta phải tập trung nghe đoạn âm thanh chỉ phát một lần. Vì vậy, để quen tai thì nghe trong lúc làm việc khác, để thi thì nghe tập trung. Thay đổi cách nghe cho hợp mục đích là điều quan trọng.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}が{一番|いちばん}{言|い}いたいことは{何|なん}ですか。', 'Otoko no hito ga ichiban iitai koto wa nan desu ka.', 'Điều người đàn ông muốn nói nhất là gì?'],
    ]),
    NG('b39-lt5-8', '{男|おとこ}の{人|ひと}は{在宅勤務|ざいたくきんむ}についてどう{思|おも}っていますか', 'Đề mini — 問題3 câu 2.', [
      ['ナレーター', 'ja-nu', '{会社|かいしゃ}で、{女|おんな}の{人|ひと}と{男|おとこ}の{人|ひと}が{話|はな}しています。', 'Kaisha de, onna no hito to otoko no hito ga hanashite imasu.', 'Ở công ty, một người phụ nữ và một người đàn ông đang nói chuyện.'],
      ['{鈴木|すずき}', 'ja-nu', '{課長|かちょう}、{来月|らいげつ}から{在宅勤務|ざいたくきんむ}が{週|しゅう}{二日|ふつか}になりますね。', 'Kachou, raigetsu kara zaitaku kinmu ga shuu futsuka ni narimasu ne.', 'Thưa trưởng phòng, từ tháng sau làm việc ở nhà sẽ thành hai ngày một tuần nhỉ.'],
      ['{森課長|もりかちょう}', 'ja-nam', 'うん。{通勤|つうきん}がない{日|ひ}が{増|ふ}えるのは{助|たす}かるし、{集中|しゅうちゅう}できるのもいいんだけどね……。', 'Un. Tsuukin ga nai hi ga fueru no wa tasukaru shi, shuuchuu dekiru no mo ii n da kedo ne…….', 'Ừ. Có thêm ngày không phải đi làm thì đỡ, tập trung được cũng hay, nhưng mà…'],
      ['{鈴木|すずき}', 'ja-nu', 'けど？', 'Kedo?', 'Nhưng sao ạ?'],
      ['{森課長|もりかちょう}', 'ja-nam', 'みんなと{話|はな}す{機会|きかい}が{減|へ}るでしょう。{新人|しんじん}の{人|ひと}たちが{困|こま}ったとき、すぐ{相談|そうだん}できるか、ちょっと{心配|しんぱい}なんだよ。', 'Minna to hanasu kikai ga heru deshou. Shinjin no hitotachi ga komatta toki, sugu soudan dekiru ka, chotto shinpai na n da yo.', 'Cơ hội nói chuyện với mọi người sẽ ít đi đúng không. Anh hơi lo không biết khi nhân viên mới gặp khó khăn có trao đổi ngay được không.'],
      ['ナレーター', 'ja-nu', '{男|おとこ}の{人|ひと}は{在宅勤務|ざいたくきんむ}についてどう{思|おも}っていますか。', 'Otoko no hito wa zaitaku kinmu ni tsuite dou omotte imasu ka.', 'Người đàn ông nghĩ gì về làm việc ở nhà?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-lt5-m3',
      title: '問題3 — 2 câu (3 điểm / câu)',
      items: [
        { q: '1{番|ばん} — {男|おとこ}の{人|ひと}が{一番|いちばん}{言|い}いたいことは{何|なん}ですか。', options: ['ながら{聞|ぎ}きは{役|やく}に{立|た}たない', '{試験|しけん}の{前|まえ}は{音楽|おんがく}を{聞|き}かないほうがいい', '{目的|もくてき}に{合|あ}わせて{聞|き}き{方|かた}を{変|か}えることが{大切|たいせつ}だ', '{家事|かじ}をしながら{勉強|べんきょう}するべきだ'], correct: 2, why: 'Khuôn: chủ đề (ながら聞き) → ích lợi → **ただ** (khác khi thi) → **ですから** → kết. Câu then chốt: **「{目的|もくてき}に{合|あ}わせて{聞|き}き{方|かた}を{変|か}えることが{大切|たいせつ}なんです」**〔Mokuteki ni awasete kikikata o kaeru koto ga taisetsu na n desu〕.' },
        { q: '2{番|ばん} — {男|おとこ}の{人|ひと}は{在宅勤務|ざいたくきんむ}についてどう{思|おも}っていますか。', options: ['{便利|べんり}なので、{毎日|まいにち}にしたい', '{便利|べんり}だが、{話|はな}す{機会|きかい}が{減|へ}るのが{心配|しんぱい}だ', '{集中|しゅうちゅう}できないので、やめたい', '{新人|しんじん}には{必要|ひつよう}ない'], correct: 1, why: 'Khen trước **けど**, lo sau: **「みんなと{話|はな}す{機会|きかい}が{減|へ}るでしょう。…ちょっと{心配|しんぱい}なんだよ」**〔Minna to hanasu kikai ga heru deshou. … chotto shinpai na n da yo〕.' },
      ],
    },

    /* 問題4 */
    { t: 'h', text: '問題4 発話表現 (2 câu)' },
    { t: 'canh', anh: ['books', 'woman-student', 'calendar'], caption: 'Tranh 1: quầy thư viện. Nữ sinh (có mũi tên) đưa một quyển sách cho nhân viên, chỉ vào tờ phiếu "返却日：明日" — cô chưa đọc xong.' },
    NG('b39-lt5-9', '{何|なん}と{言|い}いますか', 'Đề mini — 問題4 câu 1.', [
      ['ナレーター', 'ja-nu', '{図書館|としょかん}で{借|か}りた{本|ほん}をまだ{読|よ}み{終|お}わっていません。{返却日|へんきゃくび}を{延|の}ばしてほしいです。{何|なん}と{言|い}いますか。', 'Toshokan de karita hon o mada yomiowatte imasen. Henkyakubi o nobashite hoshii desu. Nan to iimasu ka.', 'Bạn chưa đọc xong quyển sách mượn ở thư viện. Bạn muốn gia hạn ngày trả. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、すみません、{返却日|へんきゃくび}を{延|の}ばしていただけますか。　2、すみません、{返却日|へんきゃくび}を{延|の}ばしてあげましょうか。　3、すみません、{返却日|へんきゃくび}を{延|の}ばさなくてもいいですよ。', 'Ichi, sumimasen, henkyakubi o nobashite itadakemasu ka. Ni, sumimasen, henkyakubi o nobashite agemashou ka. San, sumimasen, henkyakubi o nobasanakute mo ii desu yo.', '1. Xin lỗi, chị gia hạn ngày trả giúp em được không ạ? 2. Xin lỗi, tôi gia hạn ngày trả cho chị nhé? 3. Xin lỗi, không cần gia hạn đâu.'],
    ]),
    { t: 'canh', anh: ['man-student', 'notebook', 'woman-student'], caption: 'Tranh 2: hành lang trường. Nam sinh (có mũi tên) nghỉ học hôm qua, đứng trước một chị khoá trên đang cầm vở ghi chép môn kinh tế.' },
    NG('b39-lt5-10', '{何|なん}と{言|い}いますか', 'Đề mini — 問題4 câu 2.', [
      ['ナレーター', 'ja-nu', '{昨日|きのう}、{授業|じゅぎょう}を{休|やす}みました。{先輩|せんぱい}にノートを{貸|か}してほしいです。{何|なん}と{言|い}いますか。', 'Kinou, jugyou o yasumimashita. Senpai ni nooto o kashite hoshii desu. Nan to iimasu ka.', 'Hôm qua bạn nghỉ học. Bạn muốn chị khoá trên cho mượn vở. Bạn nói gì?'],
      ['ナレーター', 'ja-nu', '1、ノート、{貸|か}してあげましょうか。　2、ノートを{借|か}りてもいいですよ。　3、すみません、{昨日|きのう}のノート、{貸|か}してもらえませんか。', 'Ichi, nooto, kashite agemashou ka. Ni, nooto o karite mo ii desu yo. San, sumimasen, kinou no nooto, kashite moraemasen ka.', '1. Em cho chị mượn vở nhé? 2. Chị mượn vở cũng được đấy. 3. Xin lỗi, chị cho em mượn vở hôm qua được không ạ?'],
    ]),
    {
      t: 'mcq',
      id: 'b39-lt5-m4',
      title: '問題4 — 2 câu (1 điểm / câu)',
      items: [
        { q: '1{番|ばん} — {返却日|へんきゃくび}を{延|の}ばしてほしい。', options: ['1', '2', '3'], correct: 0, why: 'Mình NHỜ → **{延|の}ばしていただけますか**〔Nobashite itadakemasu ka〕. 2 ngược vai (mình làm cho người khác); 3 vô nghĩa.' },
        { q: '2{番|ばん} — {先輩|せんぱい}にノートを{貸|か}してほしい。', options: ['1', '2', '3'], correct: 2, why: 'Nhờ khoá trên cho mượn → **{貸|か}してもらえませんか**〔Kashite moraemasen ka〕. 1 ngược vai; 2 là câu cho phép.' },
      ],
    },

    /* 問題5 */
    { t: 'h', text: '問題5 即時応答 (4 câu)' },
    NG('b39-lt5-11', '{正|ただ}しい{返事|へんじ}を{選|えら}んでください（{4問|よんもん}）', 'Đề mini — 問題5.', [
      ['ナレーター', 'ja-nu', '1{番|ばん}。', 'Ichiban.', 'Câu 1.'],
      ['{店員|てんいん}', 'ja-nu', 'お{箸|はし}はお{付|つ}けしますか。', 'Ohashi wa otsuke shimasu ka.', 'Quý khách có lấy đũa không ạ?'],
      ['ダニエル', 'ja-nam', '1、はい、お{付|つ}けします。　2、はい、お{願|ねが}いします。　3、お{箸|はし}を{差|さ}し{上|あ}げます。', 'Ichi, hai, otsuke shimasu. Ni, hai, onegai shimasu. San, ohashi o sashiagemasu.', '1. Vâng, tôi xin kèm. 2. Vâng, cho tôi xin. 3. Tôi xin biếu đũa.'],
      ['ナレーター', 'ja-nu', '2{番|ばん}。', 'Niban.', 'Câu 2.'],
      ['カルロス', 'ja-nam', '{明日|あした}の{授業|じゅぎょう}、{休講|きゅうこう}だって。', 'Ashita no jugyou, kyuukou datte.', 'Nghe nói tiết học ngày mai được nghỉ.'],
      ['リン', 'ja-nu', '1、{本当|ほんとう}？ じゃあ、{図書館|としょかん}で{勉強|べんきょう}しようかな。　2、{休講|きゅうこう}しなきゃ。　3、{授業|じゅぎょう}、{楽|たの}しかったね。', 'Ichi, hontou? Jaa, toshokan de benkyou shiyou kana. Ni, kyuukou shinakya. San, jugyou, tanoshikatta ne.', '1. Thật à? Vậy chắc tớ lên thư viện học. 2. Phải nghỉ học thôi. 3. Tiết học vui nhỉ.'],
      ['ナレーター', 'ja-nu', '3{番|ばん}。', 'Sanban.', 'Câu 3.'],
      ['{森課長|もりかちょう}', 'ja-nam', 'ワンさん、ちょっと{手伝|てつだ}ってもらえる？', 'Wan-san, chotto tetsudatte moraeru?', 'Wan ơi, giúp anh một chút được không?'],
      ['ワン', 'ja-nu', '1、{手伝|てつだ}ってあげましょうか。　2、{手伝|てつだ}ってもらえますよ。　3、はい、{何|なに}をすればいいですか。', 'Ichi, tetsudatte agemashou ka. Ni, tetsudatte moraemasu yo. San, hai, nani o sureba ii desu ka.', '1. Em giúp anh nhé? (thất lễ) 2. Anh được giúp đấy. 3. Vâng, em nên làm gì ạ?'],
      ['ナレーター', 'ja-nu', '4{番|ばん}。', 'Yonban.', 'Câu 4.'],
      ['マリヤム', 'ja-nu', 'ごめん、{待|ま}った？', 'Gomen, matta?', 'Xin lỗi, cậu chờ lâu chưa?'],
      ['アンナ', 'ja-nu', '1、ううん、{今|いま}{来|き}たところ。　2、うん、{待|ま}っといた。　3、{待|ま}たせちゃったね。', 'Ichi, uun, ima kita tokoro. Ni, un, mattoita. San, matasechatta ne.', '1. Không, tớ cũng vừa đến. 2. Ừ, tớ chờ sẵn rồi. 3. Tớ để cậu chờ rồi nhỉ.'],
    ]),
    {
      t: 'mcq',
      id: 'b39-lt5-m5',
      title: '問題5 — 4 câu (1 điểm / câu)',
      items: [
        { q: '1{番|ばん} — 「お{箸|はし}はお{付|つ}けしますか。」', options: ['1', '2', '3'], correct: 1, why: '**はい、お{願|ねが}いします**〔Hai, onegai shimasu〕. 1 lặp khiêm nhường ngữ của nhân viên; 3 ngược vai.' },
        { q: '2{番|ばん} — 「{明日|あした}の{授業|じゅぎょう}、{休講|きゅうこう}だって。」', options: ['1', '2', '3'], correct: 0, why: 'Báo tin (～だって) → phản ứng + kế hoạch: **{本当|ほんとう}？ じゃあ、{図書館|としょかん}で{勉強|べんきょう}しようかな**〔Hontou? Jaa, toshokan de benkyou shiyou kana〕. 2 lặp từ; 3 sai thì.' },
        { q: '3{番|ばん} — 「ちょっと{手伝|てつだ}ってもらえる？」', options: ['1', '2', '3'], correct: 2, why: 'Cấp trên nhờ → nhận lời + hỏi việc: **はい、{何|なに}をすればいいですか**〔Hai, nani o sureba ii desu ka〕. 1 ～てあげましょうか với sếp là thất lễ; 2 sai ngôi.' },
        { q: '4{番|ばん} — 「ごめん、{待|ま}った？」', options: ['1', '2', '3'], correct: 0, why: 'Câu đáp tự nhiên: **ううん、{今|いま}{来|き}たところ**〔Uun, ima kita tokoro — Không, tớ cũng vừa đến〕. 2 lặp ～とく vô nghĩa; 3 là câu của người đến muộn.' },
      ],
    },
    {
      t: 'table',
      caption: 'Sai câu nào — ôn phần nào',
      head: ['Câu sai', 'Kỹ năng hụt', 'Ôn lại'],
      rows: [
        ['問題1 (1–3)', 'Lọc việc đã xong / để sau / người khác làm', 'Văn nói & mẹo nghe ⑨ · Nghe bài 1–4 · Buổi 1'],
        ['問題2 (1–3)', 'Bắt lý do thật sau 実は; tin đính chính', 'Văn nói & mẹo nghe ⑧ ⑩ · Nghe bài 5–9 · Buổi 2'],
        ['問題3 (1–2)', 'Ý chính ở câu kết; thái độ sau けど', 'Văn nói & mẹo nghe ⑦ ⑫ · Nghe bài 10–13 · Buổi 3'],
        ['問題4 (1–2)', 'Ai làm (てもらう ↔ てあげる); hướng kính ngữ', 'Nghe bài 14–17 · Buổi 3 (slide 発話表現)'],
        ['問題5 (1–4)', 'Phản ứng tự nhiên; nhận ra dạng rút gọn', 'Văn nói & mẹo nghe ①–⑥ · Nghe bài 18–22 · Luyện thêm 3'],
      ],
    },
  ],
};

export const BAI_39: Lesson[] = [
  // ① Cốt lõi
  HOI_THOAI, TU_VUNG, NGU_PHAP, HAN_TU, NGHE, DOC, NOI, VIET, BAI_TAP,
  // ② Theo buổi trên lớp
  BUOI_1, BUOI_2, BUOI_3,
  // ③ Luyện thêm dễ → khó
  LT_1, LT_2, LT_3, LT_4, LT_5,
];
