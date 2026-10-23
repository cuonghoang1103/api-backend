/**
 * "THEO SLIDE LỚP JPD123" — Bài 6 và Bài 7 (soạn 23/10/2026).
 *
 * Mỗi buổi Slot của cô (Slot 10 → Slot 19) = một bài `slot-NN-…`, đi ĐÚNG thứ tự slide:
 * tóm tắt buổi · từng slide quan trọng + giải thích bằng chữ · ngữ pháp đủ (ví dụ romaji, lỗi hay
 * mắc, cách nhớ) · bài luyện có đáp án · "cô hay hỏi gì" khi gọi phát biểu.
 * Thêm: hai bài "Slide tổng hợp từ vựng & ngữ pháp" (B6, B7), bài "BT từ vựng & ngữ pháp B6–7
 * — đáp án + giải thích" và bài "Chia thể て (bài tập bài 7)".
 *
 * Nguồn: slide Slot 10–19 + slide tổng hợp B6/B7 + file BT (scan sách bài tập) + bài tập chia thể て.
 * Câu ví dụ/hội thoại VIẾT MỚI (không chép slide/sách), chỉ dùng từ Bài 1–7.
 * Các chỗ slide chỉ có hình/không có đáp án: đáp án là TỰ GIẢI — có ghi rõ ngay trong bài.
 * Bài này KHÔNG sửa bai6.ts/bai7.ts — nội dung bổ sung, đứng cạnh chúng.
 */
import type { Lesson, Block, Ex } from '@/components/sach-hoc/types';

const E = (en: string, ro: string, vi: string): Ex => ({ en, ro, vi });

/** Đáp án gõ tay: viết một lần bằng {漢字|かな}, hàm sinh đủ cách viết chữ Hán / kana. */
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

type Line = [who: string, role: 'a' | 'b' | 'c', text: string, ro: string, vi: string];
const DL = (title: string, lines: Line[]): Block => ({
  t: 'dialogue',
  title,
  lines: lines.map(([who, role, text, ro, vi]) => ({ who, role, text, ro, vi })),
});

/* ═══════════════════════ SLOT 10 — Ôn Kanji 5 · Ôn L4–5 · L6.1 ═══════════════════════ */

const SLOT_10: Lesson = {
  id: 'slot-10-on-kanji5-l6-1',
  kind: 'review',
  title: 'Slot 10 — Ôn Kanji bài 5 · mở Bài 6.1: rủ bạn (ませんか / ましょう / ～はちょっと)',
  goal: 'Đọc lại 11 từ chữ Hán Bài 5 trên slide, rồi rủ bạn đi chơi, nhận lời hoặc từ chối khéo đúng như cô dạy ở slide チャレンジ 1–2.',
  minutes: 45,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 10 cô dạy gì (theo thứ tự slide)',
      items: [
        '**Ôn chữ Hán Bài 5** — 見 食 行 買 飲 休 後 物 週 先 午 毎: cô cho nhìn chữ, đọc hiragana, rồi đọc ngược lại.',
        '**Ôn Bài 4–5** nhanh (động từ ます, trợ từ, ～に行きます) vì Bài 6 dùng lại hết.',
        '**Mở Bài 6 — 一緒に！ (Cùng nhau)**. Mục tiêu できる: rủ bạn, nhận lời hoặc từ chối lời rủ.',
        '**Từ mới** của chủ đề: カラオケ · コンサート · しあい · やきゅう · ちず · ドライブ · チケット · みずぎ.',
        '**チャレンジ 1**: ～ませんか (rủ) và ～ましょう (hô hào / nhận lời). **チャレンジ 2**: すみません、～はちょっと… + ～がありますから (từ chối).',
      ],
    },

    /* ── Phần 1: Kanji 5 ── */
    { t: 'h', text: 'Phần 1 — Ôn chữ Hán Bài 5 (slide 漢字 5 課)' },
    {
      t: 'p',
      text: 'Slide hiện **hiragana trước, chữ Hán sau**: cô đọc "やすみます" rồi bạn phải viết/nhận ra **休みます**. Thi thì đảo lại: cho chữ Hán trần (không furigana), bạn đọc ra. Vì vậy học **theo từ**, đừng học chữ rời.',
    },
    {
      t: 'table',
      caption: 'Từ chữ Hán Bài 5 trên slide — nhóm động từ',
      head: ['Chữ Hán', 'Hiragana', 'Romaji', 'Nghĩa', 'Gợi nhớ'],
      rows: [
        ['{見|み}ます', 'みます', 'mimasu', 'xem, nhìn', '見 = con mắt (目) có hai chân chạy theo cái nhìn'],
        ['{見|み}せます', 'みせます', 'misemasu', 'cho xem', 'thêm せ — "làm cho người khác thấy"'],
        ['{食|た}べます', 'たべます', 'tabemasu', 'ăn', '食 có nắp đậy (人) + 良 = cái nồi đầy đồ ăn'],
        ['{行|い}きます', 'いきます', 'ikimasu', 'đi', '行 = ngã tư đường'],
        ['{買|か}います', 'かいます', 'kaimasu', 'mua', '買 = cái lưới (四) + 貝 (vỏ sò = tiền xưa)'],
        ['{飲|の}みます', 'のみます', 'nomimasu', 'uống', '飲 có bộ 食 bên trái: liên quan ăn uống'],
        ['{休|やす}みます', 'やすみます', 'yasumimasu', 'nghỉ', '休 = người (亻) dựa vào cái cây (木)'],
      ],
    },
    {
      t: 'table',
      caption: 'Từ chữ Hán Bài 5 trên slide — danh từ & từ ghép',
      head: ['Chữ Hán', 'Hiragana', 'Romaji', 'Nghĩa'],
      rows: [
        ['{休|やす}み', 'やすみ', 'yasumi', 'ngày nghỉ, kỳ nghỉ'],
        ['{後|うし}ろ', 'うしろ', 'ushiro', 'phía sau'],
        ['{物|もの}', 'もの', 'mono', 'đồ, vật'],
        ['{食|た}べ{物|もの}', 'たべもの', 'tabemono', 'đồ ăn'],
        ['{飲|の}み{物|もの}', 'のみもの', 'nomimono', 'đồ uống'],
        ['{買|か}い{物|もの}', 'かいもの', 'kaimono', 'việc mua sắm'],
        ['{食事|しょくじ}', 'しょくじ', 'shokuji', 'bữa ăn'],
        ['{一週間|いっしゅうかん}', 'いっしゅうかん', 'isshuukan', 'một tuần'],
        ['{毎週|まいしゅう}', 'まいしゅう', 'maishuu', 'mỗi tuần'],
        ['{毎月|まいつき}', 'まいつき', 'maitsuki', 'mỗi tháng'],
        ['{先月|せんげつ}', 'せんげつ', 'sengetsu', 'tháng trước'],
        ['{先生|せんせい}', 'せんせい', 'sensei', 'thầy cô giáo'],
        ['{午前|ごぜん}', 'ごぜん', 'gozen', 'buổi sáng (trước 12 giờ)'],
        ['{午後|ごご}', 'ごご', 'gogo', 'buổi chiều (sau 12 giờ)'],
      ],
    },
    {
      t: 'note',
      title: 'Nhầm hay gặp ở chữ Hán Bài 5',
      items: [
        '**物** đọc **もの** khi đứng sau (食べ**物**, 飲み**物**, 買い**物**) — đừng đọc ぶつ. Ba từ này **đều có もの nhưng する-động từ của 買い物 là かいものします**.',
        '**休** trong 休み (danh từ) và 休みます (động từ) cùng gốc; **休み** = ngày nghỉ, hay gặp trong "{休|やす}みの{日|ひ}".',
        '**週** (tuần) và **周/遇** nhìn gần giống — chữ có bộ 辶 (đi) bên trái, trong là 周 (vòng): 一**週**間 = một vòng bảy ngày.',
        '**午前/午後** = trước/sau 午 (giữa trưa). Có thể nhớ: 午前 **gozen** (ze-n), 午後 **gogo** (đọc lặp "go-go").',
        '**先**: 先生 (sensei) và 先月 (sengetsu) cùng chữ nhưng sen- ở cả hai — "trước/đi trước".',
      ],
    },
    {
      t: 'readkanji',
      id: 'slot10-doc-kanji5',
      title: 'Tự thử — đọc KHÔNG furigana (chữ Hán Bài 5)',
      note: 'Đọc to rồi bấm hiện đáp án. Câu viết mới, chỉ dùng từ đã học.',
      items: [
        { text: '{先生|せんせい}は{毎週|まいしゅう}{日曜日|にちようび}に{買|か}い{物|もの}に{行|い}きます。', ro: 'Sensei wa maishuu nichiyoubi ni kaimono ni ikimasu.', vi: 'Cô giáo mỗi Chủ Nhật đi mua sắm.' },
        { text: '{午前|ごぜん}に{食事|しょくじ}をして、{午後|ごご}に{休|やす}みます。', ro: 'Gozen ni shokuji o shite, gogo ni yasumimasu.', vi: 'Buổi sáng ăn, buổi chiều nghỉ.' },
        { text: '{飲|の}み{物|もの}を{買|か}います。', ro: 'Nomimono o kaimasu.', vi: 'Mua đồ uống.' },
        { text: '{先月|せんげつ}、{友達|ともだち}に{見|み}せました。', ro: 'Sengetsu, tomodachi ni misemashita.', vi: 'Tháng trước tôi đã cho bạn xem.' },
        { text: '{後|うし}ろの{人|ひと}は{一週間|いっしゅうかん}{休|やす}みです。', ro: 'Ushiro no hito wa isshuukan yasumi desu.', vi: 'Người phía sau nghỉ một tuần.' },
        { text: '{毎月|まいつき}{食|た}べ{物|もの}を{買|か}います。', ro: 'Maitsuki tabemono o kaimasu.', vi: 'Mỗi tháng tôi mua đồ ăn.' },
      ],
    },

    /* ── Phần 2: Ôn L4–5 ── */
    { t: 'h', text: 'Phần 2 — Ôn Bài 4–5 (những gì Bài 6 dùng lại)' },
    {
      t: 'p',
      text: 'Slide chỉ ghi tiêu đề "Ôn L4, 5" — cô hỏi miệng. Bài 6.1 cần chắc ba thứ: **(1) bảng ます → ません → ました → ませんでした**, **(2) ～に行きます (đi để làm gì)**, **(3) ～から (vì)**. Làm bốn câu dưới đây; sai câu nào thì mở lại Bài 5 đúng mục đó.',
    },
    {
      t: 'mcq',
      id: 'slot10-on-b45',
      title: 'Khởi động — kiến thức Bài 4–5 dùng cho Bài 6',
      items: [
        { q: '「{昨日|きのう}、{何|なに}を{食|た}べましたか。」「（　）。」(chưa ăn gì)', options: ['なにも たべました', 'なにも たべませんでした', 'なにも たべません', 'なにを たべます'], correct: 1, why: 'Quá khứ phủ định: **ませんでした**. なにも + phủ định = "không ... gì cả". (Bài 5)' },
        { q: 'ご{飯|はん}を（　）に{行|い}きます。', options: ['たべ', 'たべる', 'たべて', 'たべた'], correct: 0, why: 'Mục đích **V (bỏ ます) + に + 行きます**: たべ + に. Bài 5 — Bài 6 dùng ngay trong "たべにいきませんか".' },
        { q: '{今日|きょう}は{雨|あめ}です（　）、どこへも{行|い}きません。', options: ['から', 'ので', 'が', 'を'], correct: 0, why: '**から** = vì (đặt sau lý do). Bài 6 dùng ～がありますから để từ chối.' },
        { q: '「{図書館|としょかん}（　）{勉強|べんきょう}します。」(học Ở thư viện)', options: ['を', 'で', 'に', 'は'], correct: 1, why: '**で** chỉ nơi hành động diễn ra. Phân biệt với に (nơi tồn tại) — ngay slide sau cô so sánh hai cái này.' },
      ],
    },

    /* ── Phần 3: L6.1 mở đầu ── */
    { t: 'h', text: 'Phần 3 — Bài 6.1「一緒に行きませんか」: từ mới và できること' },
    {
      t: 'p',
      text: 'Slide ghi mục tiêu: **友達を誘うことができる。また、誘いを受けたり断ったりすることができる。** = "Rủ được bạn; nhận lời được và từ chối được". Từ mới của chủ đề (slide チャレンジ — 8 từ):',
    },
    {
      t: 'vocab',
      items: [
        { w: 'カラオケ', pos: 'Danh từ', ipa: 'karaoke', vi: 'karaoke', ex: '{今晩|こんばん}、カラオケに{行|い}きませんか。', exRo: 'Konban, karaoke ni ikimasen ka.', exVi: 'Tối nay đi karaoke không?' },
        { w: 'コンサート', pos: 'Danh từ', ipa: 'konsaato', vi: 'buổi hòa nhạc', ex: 'コンサートを{聞|き}きに{行|い}きましょう。', exRo: 'Konsaato o kiki ni ikimashou.', exVi: 'Đi nghe hòa nhạc thôi.' },
        { w: '{試合|しあい}', pos: 'Danh từ', ipa: 'shiai', vi: 'trận đấu', ex: 'サッカーの{試合|しあい}を{見|み}ませんか。', exRo: 'Sakkaa no shiai o mimasen ka.', exVi: 'Xem trận bóng đá không?' },
        { w: '{野球|やきゅう}', pos: 'Danh từ', ipa: 'yakyuu', vi: 'bóng chày', ex: '{野球|やきゅう}をしませんか。', exRo: 'Yakyuu o shimasen ka.', exVi: 'Chơi bóng chày không?' },
        { w: '{地図|ちず}', pos: 'Danh từ', ipa: 'chizu', vi: 'bản đồ', ex: '{地図|ちず}を{見|み}ましょう。', exRo: 'Chizu o mimashou.', exVi: 'Cùng xem bản đồ nhé.' },
        { w: 'ドライブ', pos: 'Danh từ', ipa: 'doraibu', vi: 'lái xe đi chơi', ex: '{日曜日|にちようび}、ドライブに{行|い}きませんか。', exRo: 'Nichiyoubi, doraibu ni ikimasen ka.', exVi: 'Chủ Nhật đi lái xe chơi không?' },
        { w: 'チケット', pos: 'Danh từ', ipa: 'chiketto', vi: 'vé', ex: 'コンサートのチケットがあります。', exRo: 'Konsaato no chiketto ga arimasu.', exVi: 'Tôi có vé hòa nhạc.' },
        { w: '{水着|みずぎ}', pos: 'Danh từ', ipa: 'mizugi', vi: 'đồ bơi', ex: '{海|うみ}へ{水着|みずぎ}を{持|も}って{行|い}きます。', exRo: 'Umi e mizugi o motte ikimasu.', exVi: 'Tôi mang đồ bơi ra biển.', more: '水着 = 水 (nước) + 着 (mặc) → "đồ mặc xuống nước".' },
      ],
    },

    /* ── チャレンジ 1 ── */
    { t: 'h', text: 'チャレンジ 1 — ～ませんか (rủ) và ～ましょう (nhận lời)  ·  ポイント 48–49' },
    {
      t: 'p',
      text: 'Slide mở bằng mẫu: **A：ごはんを たべに いきませんか。B：いいですね。たべに いきましょう。** Cô tóm lại bằng một khung hai ô: **～ませんか = mời, rủ ai cùng làm gì** · **～ましょう = hô hào cùng làm gì**. Vế "いっしょに" (cùng nhau) thường đi kèm vì lời rủ luôn có người cùng làm.',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '（いっしょに）V ませんか。',
          vi: 'Rủ — hỏi ý người kia, **lịch sự, người kia dễ từ chối**. (Slide: "Rủ rê, mời mọc".)',
          examples: [
            E('{一緒|いっしょ}にコーヒーを{飲|の}みませんか。', 'Issho ni koohii o nomimasen ka.', 'Cùng uống cà phê không?'),
            E('{明日|あした}、{一緒|いっしょ}に{公園|こうえん}へ{行|い}きませんか。', 'Ashita, issho ni kouen e ikimasen ka.', 'Ngày mai cùng đi công viên không?'),
            E('{日曜日|にちようび}、{一緒|いっしょ}にサッカーをしませんか。', 'Nichiyoubi, issho ni sakkaa o shimasen ka.', 'Chủ Nhật cùng đá bóng không?'),
          ],
        },
        {
          formula: 'いいですね。V ましょう。',
          vi: 'Nhận lời — khen "hay đấy" rồi **lặp lại động từ** của người rủ, đổi ませんか → ましょう. (Slide: "Hô hào cùng làm gì".)',
          examples: [
            E('…いいですね。{飲|の}みましょう。', '…Ii desu ne. Nomimashou.', '…Hay đấy. Uống thôi.'),
            E('…いいですね。{行|い}きましょう。', '…Ii desu ne. Ikimashou.', '…Hay đấy. Đi thôi.'),
            E('…いいですね。しましょう。', '…Ii desu ne. Shimashou.', '…Hay đấy. Chơi/làm thôi.'),
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ & lỗi hay mắc',
      items: [
        '**Đổi đuôi**: ます → **ませんか** (rủ) / **ましょう** (đồng ý). Chỉ đổi đuôi, phần trước giữ nguyên: たべ-ます → たべ-ませんか → たべ-ましょう.',
        '**Sai**: ~~いっしょに ごはんを たべませんか。→ はい、たべます。~~ — "たべます" chỉ là "tôi ăn", không phải "ăn nhé". Phải trả lời **いいですね。たべましょう。**',
        '**Sai**: ~~ごはんを たべに いきましょう~~ khi người kia **chưa** đồng ý — nghe ép. Người mới quen: rủ bằng ませんか trước.',
        '**ませんか không phải "không … à?"**: hình thức phủ định nhưng nghĩa là lời mời.',
        'Slide có hai chỗ ghi **べんきょうましょう** (thiếu し). Đúng là **べんきょうします → べんきょうしましょう**; nhóm "します" luôn là しましょう.',
      ],
    },
    { t: 'h', text: 'Slide "5 hoạt động" — hô hào Vましょう' },
    {
      t: 'p',
      text: 'Cô cho năm hình rồi bảo cả lớp hô: **かいものしましょう。 べんきょうしましょう。 がっこうへ いきましょう。 うちへ かえりましょう。** (và ごはんを たべましょう). Đây là ましょう dùng làm **lời đề nghị chung**, không cần trả lời. Cách học: đổi từng động từ trong bảng.',
    },
    {
      t: 'table',
      caption: 'Năm hoạt động trên slide → ～ましょう',
      head: ['Hoạt động', 'Dạng ます', 'Hô hào ～ましょう', 'Romaji', 'Nghĩa'],
      rows: [
        ['{勉強|べんきょう}', 'べんきょうします', 'べんきょうしましょう', 'benkyou shimashou', 'học bài thôi'],
        ['ご{飯|はん}を{食|た}べる', 'ごはんを たべます', 'ごはんを たべましょう', 'gohan o tabemashou', 'ăn cơm thôi'],
        ['{買|か}い{物|もの}', 'かいものします', 'かいものしましょう', 'kaimono shimashou', 'đi mua sắm thôi'],
        ['{家|うち}へ{帰|かえ}る', 'うちへ かえります', 'うちへ かえりましょう', 'uchi e kaerimashou', 'về nhà thôi'],
        ['{学校|がっこう}へ{行|い}く', 'がっこうへ いきます', 'がっこうへ いきましょう', 'gakkou e ikimashou', 'đến trường thôi'],
      ],
    },
    {
      t: 'note',
      title: 'Hai cách rủ trong cùng một cuộc hội thoại',
      items: [
        '**Rủ để người ta chọn**: V**ませんか** → "Bạn có muốn … không?" (chờ ý kiến).',
        '**Hô hào/chốt**: V**ましょう** → "… nhé / … thôi". Dùng khi đã chắc, hoặc khi nhận lời.',
        'Cô hay đưa tình huống: bạn nghe **ませんか** → phản xạ trả lời bằng **ましょう**. Nghe **ましょう** (chốt) thì chỉ cần gật đầu, hoặc nói **はい、そうしましょう**.',
      ],
    },
    DL('Hội thoại luyện (slide 会話練習 — viết lại bằng lời mới)', [
        ['女', 'a', '{今度|こんど}の{土曜日|どようび}、{一緒|いっしょ}に{絵|え}を{見|み}に{行|い}きませんか。', 'Kondo no doyoubi, issho ni e o mi ni ikimasen ka.', 'Thứ Bảy tới cùng đi xem tranh không?'],
        ['男', 'b', 'いいですね。{行|い}きましょう。', 'Ii desu ne. Ikimashou.', 'Hay đấy. Đi thôi.'],
        ['女', 'a', 'じゃ、{十時|じゅうじ}に{会|あ}いましょう。', 'Ja, juuji ni aimashou.', 'Vậy gặp lúc 10 giờ nhé.'],
        ['男', 'b', 'はい、わかりました。', 'Hai, wakarimashita.', 'Vâng, mình biết rồi.'],
    ]),

    /* ── チャレンジ 2 ── */
    { t: 'h', text: 'チャレンジ 2 — Từ chối khéo: すみません。～はちょっと…  ·  ポイント 48 (phần từ chối) + 50' },
    {
      t: 'p',
      text: 'Slide: **A：しゅうまつ いっしょに レストランへ いきませんか。B：すみません。しゅうまつは ちょっと…。アルバイトが ありますから。A：ああ、そうですか。ざんねんですね。じゃ、またこんど。B：はい、すみません。** Tiêu đề trên slide: "Cách từ chối lời mời của ai đó". Người Nhật **không nói いいえ、行きません** — họ bỏ lửng câu để người kia tự hiểu.',
    },
    {
      t: 'table',
      caption: 'Khung từ chối 4 bước (đúng thứ tự cô dạy)',
      head: ['Bước', 'Câu', 'Romaji', 'Ý nghĩa'],
      rows: [
        ['① Xin lỗi', 'すみません。', 'Sumimasen.', 'xin lỗi (báo trước là sắp từ chối)'],
        ['② Nêu cái bị từ chối + ちょっと…', '{週末|しゅうまつ}は ちょっと……。', 'Shuumatsu wa chotto……', 'Cuối tuần thì hơi … (không tiện)'],
        ['③ Lý do ngắn', 'アルバイトが ありますから。', 'Arubaito ga arimasu kara.', 'Vì tôi có ca làm thêm'],
        ['④ Người rủ đáp', 'ああ、そうですか。ざんねんですね。じゃ、また こんど。', 'Aa, sou desu ka. Zannen desu ne. Ja, mata kondo.', 'Vậy à. Tiếc nhỉ. Hẹn lần sau.'],
      ],
    },
    {
      t: 'table',
      caption: 'Ba cặp từ để thay vào (slide: A カラオケ/ようじ · A りょこう/テスト · A バーベキュー/やくそく)',
      head: ['Lời rủ (A)', 'Lý do từ chối (B)', 'Câu mẫu'],
      rows: [
        ['カラオケ', 'ようじ', 'A: いっしょに カラオケに いきませんか。 B: すみません。カラオケは ちょっと…。ようじが ありますから。'],
        ['りょこう', 'テスト', 'A: いっしょに りょこうに いきませんか。 B: すみません。りょこうは ちょっと…。テストが ありますから。'],
        ['バーベキュー', 'やくそく', 'A: いっしょに バーベキューを しませんか。 B: すみません。バーベキューは ちょっと…。やくそくが ありますから。'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{今度|こんど}の{週末|しゅうまつ}、{旅行|りょこう}に{行|い}きませんか。…すみません。{旅行|りょこう}はちょっと……。テストがありますから。', 'Kondo no shuumatsu, ryokou ni ikimasen ka. …Sumimasen. Ryokou wa chotto……. Tesuto ga arimasu kara.', 'Cuối tuần tới đi du lịch không? …Xin lỗi, du lịch thì hơi khó. Vì tôi có bài thi.'),
        E('{今晩|こんばん}、カラオケに{行|い}きませんか。…ああ、{今晩|こんばん}はちょっと……。{用事|ようじ}がありますから。', 'Konban, karaoke ni ikimasen ka. …Aa, konban wa chotto……. Youji ga arimasu kara.', 'Tối nay đi karaoke không? …À, tối nay thì hơi … vì tôi có việc.'),
        E('{日曜日|にちようび}、バーベキューをしませんか。…すみません。{友達|ともだち}と{約束|やくそく}がありますから。', 'Nichiyoubi, baabekyuu o shimasen ka. …Sumimasen. Tomodachi to yakusoku ga arimasu kara.', 'Chủ Nhật nướng thịt không? …Xin lỗi, mình có hẹn với bạn.'),
      ],
    },
    {
      t: 'note',
      title: 'Nhầm hay gặp khi từ chối',
      items: [
        '**Sai**: ~~すみません。{行|い}きません。~~ → đúng ngữ pháp, nghe rất phũ. Nói **すみません。～は ちょっと……。**',
        '**は** sau cái bị từ chối (しゅうまつ**は**, カラオケ**は**) — "còn cái khác thì tôi chưa biết, riêng cái này thì không được".',
        '**～がありますから** = vì có việc. Nhớ **が** (không phải を): あります đi với が. {用事|ようじ} = việc riêng — lý do "an toàn" nhất.',
        '**ざんねんですね** là câu của NGƯỜI RỦ (tiếc nhỉ), không phải của người từ chối. **また こんど** = "để dịp khác".',
        'Từ chối xong, người từ chối thường nói thêm **すみません** lần nữa (slide: B ：はい、すみません。).',
      ],
    },
    {
      t: 'note',
      title: 'Cô hay hỏi gì khi gọi phát biểu (Slot 10)',
      items: [
        '"**あした、いっしょに ごはんを たべませんか。**" → bạn trả lời được CẢ HAI: nhận (いいですね。たべましょう。) và từ chối (すみません。あしたは ちょっと……。ようじが ありますから。).',
        '"**この ことばは なんですか。**" khi chỉ vào hình: カラオケ / コンサート / しあい / ちず / ドライブ / みずぎ / チケット / やきゅう → gọi tên đúng, có thể nói kèm câu rủ.',
        'Gọi hai bạn lên **đóng vai**: một người rủ, một người từ chối có lý do (ようじ / テスト / やくそく / アルバイト).',
        'Đọc chữ Hán Bài 5 từ slide: cô chỉ chữ, bạn đọc từ (毎週, 先月, 午後…).',
      ],
    },

    /* ── Luyện ── */
    {
      t: 'mcq',
      id: 'slot10-luyen-rue',
      title: 'Luyện — rủ, nhận lời, từ chối (có giải thích)',
      items: [
        { q: 'A：いっしょに ごはんを たべませんか。 B：いいですね。（　）。', options: ['たべます', 'たべましょう', 'たべません', 'たべました'], correct: 1, why: 'Nhận lời rủ = **ましょう** (lặp động từ của người rủ). ポイント 49.' },
        { q: 'A：{週末|しゅうまつ}、{映画|えいが}を{見|み}に{行|い}きませんか。 B：すみません。{週末|しゅうまつ}は（　）……。', options: ['ちょっと', 'いいですね', 'ぜひ', 'だいじょうぶです'], correct: 0, why: 'Từ chối khéo: **～は ちょっと…**. いいですね/ぜひ là nhận lời.' },
        { q: 'アルバイト（　）ありますから、{行|い}けません。', options: ['を', 'が', 'に', 'で'], correct: 1, why: 'あります đi với **が**: アルバイト**が**あります (ポイント 50).' },
        { q: '「ごはんを {食|た}べに（　）。」(rủ lịch sự)', options: ['いきますか', 'いきませんか', 'いきました', 'いきません'], correct: 1, why: 'Rủ = **いきませんか**. いきますか chỉ hỏi "bạn có đi không" (hỏi thông tin).' },
        { q: '{勉強|べんきょう}します → rủ cùng làm:', options: ['べんきょうましょう', 'べんきょうしましょう', 'べんきょうしますましょう', 'べんきょうをましょう'], correct: 1, why: 'します → **しましょう** (slide của cô in thiếu し — đừng chép theo).' },
        { q: '「また（　）。」(Hẹn lần sau nhé)', options: ['こんど', 'こんばん', 'こんげつ', 'こんしゅう'], correct: 0, why: '**また こんど** = để dịp khác. Cố định, không đổi.' },
        { q: 'Câu nào là từ chối lịch sự?', options: ['いいえ、いきません。', 'いやです。', 'すみません。ちょっと……。', 'いきましょう。'], correct: 2, why: 'Chỉ câu 3 có xin lỗi + bỏ lửng đúng kiểu Nhật.' },
        { q: '「カラオケ」の{意味|いみ}は？', options: ['Hát karaoke', 'Bản đồ', 'Vé', 'Đồ bơi'], correct: 0, why: 'カラオケ = karaoke. ちず = bản đồ, チケット = vé, みずぎ = đồ bơi.' },
      ],
    },
    {
      t: 'quiz',
      id: 'slot10-luyen-dich',
      title: 'Luyện dịch Việt → Nhật (gõ tay)',
      kind: 'translate',
      grammar: 'V ませんか / V ましょう / ～は ちょっと…… / ～が ありますから',
      items: [
        { q: 'Tối nay cùng đi karaoke không?', answers: V('{今晩|こんばん}、{一緒|いっしょ}にカラオケに{行|い}きませんか。', '{今晩|こんばん}、カラオケに{行|い}きませんか。'), hint: 'こんばん · いっしょに · いきませんか' },
        { q: 'Hay đấy. Đi thôi.', answers: V('いいですね。{行|い}きましょう。'), hint: 'いいですね · いきましょう' },
        { q: 'Xin lỗi. Cuối tuần thì hơi … (Vì tôi có hẹn.)', answers: V('すみません。{週末|しゅうまつ}はちょっと……。{約束|やくそく}がありますから。', 'すみません。{週末|しゅうまつ}はちょっと。{約束|やくそく}がありますから。'), hint: 'しゅうまつ · やくそく · ありますから' },
        { q: 'Chủ Nhật cùng đá bóng không?', answers: V('{日曜日|にちようび}、{一緒|いっしょ}にサッカーをしませんか。', '{日曜日|にちようび}、サッカーをしませんか。'), hint: 'にちようび · サッカー · します' },
        { q: 'Về nhà thôi.', answers: V('{家|うち}へ{帰|かえ}りましょう。', 'うちへ{帰|かえ}りましょう。', '{家|いえ}へ{帰|かえ}りましょう。'), hint: 'うち · かえります' },
      ],
    },
    {
      t: 'build',
      id: 'slot10-luyen-ghep',
      title: 'Ghép câu — bấm đúng thứ tự',
      items: [
        { vi: 'Cùng đi mua sắm không?', chips: ['いっしょに', 'かいものに', 'いきませんか', 'いきましょう'], answer: ['いっしょに', 'かいものに', 'いきませんか'], ro: 'Issho ni kaimono ni ikimasen ka.' },
        { vi: 'Xin lỗi. Tối nay thì hơi …', chips: ['すみません', 'こんばんは', 'ちょっと', 'こんばんを'], answer: ['すみません', 'こんばんは', 'ちょっと'], ro: 'Sumimasen. Konban wa chotto.' },
        { vi: 'Vì tôi có việc bận.', chips: ['ようじが', 'ありますから', 'ようじを', 'います'], answer: ['ようじが', 'ありますから'], ro: 'Youji ga arimasu kara.' },
      ],
    },
  ],
};

/* ═══════════════════════ SLOT 11 — Test 1 · L6.1 tiếp (チャレンジ 3–4) ═══════════════════════ */

const SLOT_11: Lesson = {
  id: 'slot-11-test1-l6-1-tiep',
  kind: 'grammar',
  title: 'Slot 11 — Test 1 (Bài 4+5) · Bài 6.1 tiếp: ～で ～があります (sự kiện) · đếm ～枚 / ～つ',
  goal: 'Nói được "ở đâu có sự kiện gì" (ポイント 51), phân biệt に/で với あります, và đếm vé/áo/ảnh bằng ～枚, đồ vật chung bằng ～つ (ポイント 52).',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 11 cô dạy gì',
      items: [
        '**Test 1** (Bài 4 + Bài 5) đầu giờ — slide chỉ ghi tiêu đề. Cô trả bài sau đó, nên Bài 4–5 phải chắc.',
        '**Ôn lại chủ đề rủ**: câu mẫu trên slide dùng từ mới — カラオケに行きませんか · コンサートをききましょう · しあいを みませんか · やきゅうを しませんか · ドライブに いきましょう · コンサートの チケット · みずぎが あります.',
        '**チャレンジ 3** — よこはまで はなびが あります: **Nで Nが あります** (ở đâu có sự kiện).',
        '**チャレンジ 4** — びじゅつかんの チケットが ２まい あります: **trợ số từ ～枚 và ～つ**.',
        '**やってみよう 1** (sách p.105) làm cuối buổi.',
      ],
    },
    { t: 'h', text: 'Phần 1 — Test 1 (Bài 4+5): nên ôn gì cho kỳ thi 20%' },
    {
      t: 'note',
      title: 'Bài kiểm tra 1 thường có (dạng của cô)',
      items: [
        '**I. Từ vựng**: chọn từ hợp với câu (từ Bài 4–5: tính từ い/な, ăn uống, thời gian).',
        '**II. Chữ Hán** Bài 4–5: đọc hiragana chữ Hán trần (見 食 行 買 飲 休 物 週 先 午 毎 …).',
        '**III. Ngữ pháp**: chia tính từ (quá khứ, phủ định), ～に行きます, ～から, ～が ほしいです, ～たいです.',
        'Điểm Test 1 không còn sửa được — hãy xem lại câu sai để khỏi sai lần nữa ở Test 2 (có Bài 6–7).',
      ],
    },

    /* ── Phần 2: từ mới & mẫu rủ ── */
    { t: 'h', text: 'Phần 2 — Câu mẫu rủ với từ mới (slide "いっしょに — ST 1")' },
    {
      t: 'table',
      caption: 'Sáu câu cô cho đọc trước khi vào チャレンジ 3',
      head: ['Câu', 'Romaji', 'Nghĩa & ghi chú'],
      rows: [
        ['カラオケに{行|い}きませんか。', 'Karaoke ni ikimasen ka.', 'Đi karaoke không? (rủ)'],
        ['コンサートを{聞|き}きましょう。', 'Konsaato o kikimashou.', 'Cùng nghe hòa nhạc nhé. Nghe nhạc = **聞きます**'],
        ['{試合|しあい}を{見|み}ませんか。', 'Shiai o mimasen ka.', 'Xem trận đấu không? Xem trận = **見ます**'],
        ['{野球|やきゅう}をしませんか。', 'Yakyuu o shimasen ka.', 'Chơi bóng chày không? Thể thao = **します**'],
        ['ドライブに{行|い}きましょう。', 'Doraibu ni ikimashou.', 'Đi lái xe chơi nhé.'],
        ['コンサートの チケットが あります。 / {水着|みずぎ}が あります。', 'Konsaato no chiketto ga arimasu. / Mizugi ga arimasu.', 'Tôi có vé hòa nhạc. / Tôi có đồ bơi.'],
      ],
    },

    /* ── チャレンジ 3 ── */
    { t: 'h', text: 'チャレンジ 3 — よこはまで はなびが あります  ·  ポイント 50–51' },
    {
      t: 'p',
      text: 'Slide: **よこはまで はなびが あります。** (Ở Yokohama có pháo hoa.) Cô chú thích: **「あります」 dùng cho đồ vật** và **cho sự kiện** (cô viết hai nhãn: "Dùng cho đồ vật" / "Dùng cho sự kiện"). Câu thứ hai cô cho: **こんしゅうの げつようび、やくそくが あります。** (Thứ Hai tuần này tôi có hẹn.)',
    },
    {
      t: 'table',
      caption: 'Hai cấu trúc có あります — slide so sánh (1) với (2)',
      head: ['', 'Mẫu', 'Trợ từ', 'Nghĩa', 'Ví dụ'],
      rows: [
        ['(1) Tồn tại', 'N1 **に** N2 が あります', 'に = nơi N2 **nằm / có**', 'Ở N1 có N2 (đồ vật, người)', 'つくえの うえ**に** ほん**が** あります。 (Trên bàn có sách.)'],
        ['(2) Sự kiện', 'N1 **で** N2 が あります', 'で = nơi **diễn ra** sự kiện', 'Ở N1 diễn ra N2', 'こうえん**で** コンサート**が** あります。 (Ở công viên có buổi hòa nhạc.)'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1（nơi chốn）で N2（sự kiện）が あります。',
          vi: 'Ở **N1** có **N2** diễn ra. N2 là sự kiện: パーティー, コンサート, しあい, セール, まつり, はなび, テスト, かいぎ.',
          examples: [
            E('ハノイで サッカーの しあいが あります。', 'Hanoi de sakkaa no shiai ga arimasu.', 'Ở Hà Nội có trận bóng đá.'),
            E('FPT{大学|だいがく}で コンサートが あります。', 'FPT daigaku de konsaato ga arimasu.', 'Ở Đại học FPT có buổi hòa nhạc.'),
            E('{日本|にほん}で オリンピックが あります。', 'Nihon de orinpikku ga arimasu.', 'Ở Nhật có Thế vận hội.'),
            E('デパートで セールが あります。', 'Depaato de seeru ga arimasu.', 'Ở trung tâm thương mại có đợt giảm giá.'),
            E('ハノイで おおきい おまつりが あります。', 'Hanoi de ookii omatsuri ga arimasu.', 'Ở Hà Nội có lễ hội lớn.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế theo slide: N1 (nơi) × N2 (sự kiện)',
      head: ['N1 — nơi chốn', 'N2 — sự kiện', 'Câu hoàn chỉnh'],
      rows: [
        ['ハノイ', 'サッカーの しあい', 'ハノイで サッカーの しあいが あります。'],
        ['FPT 大学', 'コンサート', 'FPT 大学で コンサートが あります。'],
        ['日本', 'オリンピック', '日本で オリンピックが あります。'],
        ['デパート', 'セール', 'デパートで セールが あります。'],
        ['ハノイ', 'おおきい まつり', 'ハノイで おおきい まつりが あります。'],
      ],
    },
    {
      t: 'note',
      title: 'Phân biệt に / で với あります — cách nhớ & lỗi hay mắc',
      items: [
        '**Hỏi: có thể "ngồi ở đó" không?** Đồ vật/người đứng yên ở N1 → **に**. Sự kiện **xảy ra, diễn ra** ở N1 → **で**.',
        '**Sai**: ~~こうえんに コンサートが あります~~ → đúng: **こうえんで** コンサートが あります (vì コンサート là việc diễn ra).',
        '**Sai**: ~~つくえの うえで ほんが あります~~ → đúng: つくえの うえ**に** ほんが あります.',
        'Cô có thêm một ý: **thời điểm đi với に** — こんしゅうの げつようび**に**／こんしゅうの にちようびの ごぜん 7じから ごご 8じまで アルバイトが あります (từ 7 giờ sáng đến 8 giờ tối). Thời điểm có thể bỏ に khi có "こんしゅう/らいしゅう/せんしゅう".',
        'Quá khứ: **ありました** (せんしゅうの もくようび ようじが ありました = tuần trước thứ Năm tôi có việc). Phủ định: **ありません** (わたしの まちに スーパーが ありません = ở thành phố tôi không có siêu thị).',
        '**かいぎ** (cuộc họp) và **パーティー** cũng là sự kiện: こんばんは しゃちょうの うちで パーティーが あります (tối nay ở nhà giám đốc có tiệc).',
      ],
    },
    DL('Hội thoại cô cho luyện (会話練習 — viết lại)', [
        ['男', 'a', '{週末|しゅうまつ}、よこはまで はなびが あります。', 'Shuumatsu, Yokohama de hanabi ga arimasu.', 'Cuối tuần ở Yokohama có pháo hoa.'],
        ['女', 'b', 'へえ。', 'Hee.', 'Ồ.'],
        ['男', 'a', '{一緒|いっしょ}に {見|み}に いきませんか。', 'Issho ni mi ni ikimasen ka.', 'Cùng đi xem không?'],
        ['女', 'b', 'いいですね。いきましょう。', 'Ii desu ne. Ikimashou.', 'Hay đấy. Đi thôi.'],
    ]),
    {
      t: 'note',
      title: 'Cách dùng へえ',
      items: [
        '**へえ** = "ồ / thế à" — ngạc nhiên nhẹ khi nghe thông tin mới. Đứng đầu câu trả lời, không phải nhận lời hay từ chối.',
        'Cô hay yêu cầu: bạn A thông báo sự kiện (N で N が あります) → bạn B nói **へえ。** → bạn A rủ → bạn B nhận lời.',
      ],
    },

    /* ── チャレンジ 4 ── */
    { t: 'h', text: 'チャレンジ 4 — びじゅつかんの チケットが ２まい あります  ·  ポイント 52' },
    {
      t: 'p',
      text: 'Slide: **びじゅつかんの チケットが ２まい あります。** Khung "TRỢ SỐ TỪ 助数詞" của cô: **đi với số từ để xác định CHỦNG LOẠI của đối tượng**. Hai trợ số từ trong buổi này: **～つ** (đồ vật nói chung) và **～枚** (đồ vật mỏng, phẳng).',
    },
    {
      t: 'table',
      caption: 'Hai trợ số từ trên slide',
      head: ['Trợ số từ', 'Dùng đếm', 'Ví dụ', 'Hỏi bao nhiêu'],
      rows: [
        ['**～つ**', 'đồ vật nói chung: bàn, ghế, quả trứng, trái cây…', 'ひとつ・ふたつ・みっつ…', '**いくつ**'],
        ['**～枚（まい）**', 'đồ mỏng, phẳng: vé, tem, giấy, áo sơ mi, CD/DVD, ảnh, bản đồ', 'いちまい・にまい・さんまい…', '**なんまい**'],
      ],
    },
    {
      t: 'table',
      caption: '～つ (slide ghi: "Đặc biệt, rất dễ nhầm lẫn — buộc phải học thuộc, giống cách nói ngày")',
      head: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Bao nhiêu'],
      rows: [['ひとつ', 'ふたつ', 'みっつ', 'よっつ', 'いつつ', 'むっつ', 'ななつ', 'やっつ', 'ここのつ', 'とお', 'いくつ']],
    },
    {
      t: 'table',
      caption: '～枚 (slide ghi: "ghép trực tiếp với số từ — KHÔNG biến âm")',
      head: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Bao nhiêu'],
      rows: [['いちまい', 'にまい', 'さんまい', 'よんまい', 'ごまい', 'ろくまい', 'ななまい', 'はちまい', 'きゅうまい', 'じゅうまい', 'なんまい']],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N が （số）まい あります。',
          vi: 'Có bao nhiêu N. N là vật mỏng, phẳng. Số đứng **sau trợ từ が/を, ngay trước động từ**.',
          examples: [
            E('チケットが ２まい あります。', 'Chiketto ga nimai arimasu.', 'Tôi có 2 vé.'),
            E('CD が １まい あります。', 'CD ga ichimai arimasu.', 'Tôi có 1 đĩa CD.'),
            E('シャツを ２まい かいました。', 'Shatsu o nimai kaimashita.', 'Tôi đã mua 2 cái áo sơ mi.'),
            E('CD を ３まい かいました。', 'CD o sanmai kaimashita.', 'Tôi đã mua 3 đĩa CD.'),
            E('みずぎを ８まい ください。', 'Mizugi o hachimai kudasai.', 'Cho tôi 8 bộ đồ bơi.'),
            E('ちずを １まい かきました。', 'Chizu o ichimai kakimashita.', 'Tôi đã vẽ 1 tờ bản đồ.'),
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ & lỗi hay mắc khi đếm',
      items: [
        '**Ba bước**: ① đồ mỏng phẳng? → ～枚; ② không → ～つ; ③ hỏi "mấy?" → **なんまい／いくつ**. Slide ghi: "Không biết đếm thế nào? → hỏi なんまい".',
        '**Số đặt ở đâu?** Thứ tự trên slide: *N が/を + số-trợ số từ + động từ* (チケット**が** ２まい あります, CD**を** ３まい かいました). Số đứng ngay trước động từ.',
        '**Không có trợ từ sau số**: ~~２まいを あります~~ ✗ → ２まい あります ✓.',
        '**～枚 không biến âm** (khác ～本 ほん/ぼん/ぽん, ～杯…) — đây là điểm dễ cho người học. 4 = よん (không đọc し), 7 = なな, 9 = きゅう.',
        '**シャツ** (áo sơ mi) đếm bằng 枚 vì mỏng, phẳng khi gấp. Ngược lại: ~~シャツを ひとつ~~ nghe lạ.',
        '**～つ chỉ tới 10 (とお)**; từ 11 trở đi dùng số bình thường: じゅういち (ví dụ りんごが じゅういち あります — không thêm つ).',
      ],
    },
    DL('Hội thoại cô cho luyện (viết lại)', [
        ['男', 'a', '{絵|え}が すきですか。', 'E ga suki desu ka.', 'Bạn thích tranh không?'],
        ['女', 'b', 'はい。', 'Hai.', 'Có.'],
        ['男', 'a', 'そうですか。びじゅつかんの チケットが ２まい あります。', 'Sou desu ka. Bijutsukan no chiketto ga nimai arimasu.', 'Vậy à. Tôi có 2 vé bảo tàng mỹ thuật.'],
        ['男', 'a', '{一緒|いっしょ}に びじゅつかんへ いきませんか。', 'Issho ni bijutsukan e ikimasen ka.', 'Cùng đến bảo tàng không?'],
        ['女', 'b', 'わあ、いいですね。いきましょう。', 'Waa, ii desu ne. Ikimashou.', 'Oa, hay quá. Đi thôi.'],
    ]),

    /* ── Dịch 5 câu của slide ── */
    { t: 'h', text: 'Slide "Dịch 5 câu" (cuối buổi) — đáp án mẫu' },
    {
      t: 'table',
      caption: 'Năm câu cô cho dịch sang tiếng Nhật (đáp án do mình soạn — slide không in đáp án)',
      head: ['Tiếng Việt', 'Tiếng Nhật', 'Romaji'],
      rows: [
        ['1. Tôi đã mua 2 áo sơ mi đắt tiền.', '{高|たか}い シャツを ２まい かいました。', 'Takai shatsu o nimai kaimashita.'],
        ['2. Tôi có 6 vé nghe hòa nhạc.', 'コンサートの チケットが ６まい あります。', 'Konsaato no chiketto ga rokumai arimasu.'],
        ['3. Tôi đã chụp 3 tấm ảnh núi.', '{山|やま}の しゃしんを ３まい とりました。', 'Yama no shashin o sanmai torimashita.'],
        ['4. Tôi mượn của bạn 4 đĩa CD.', '{友達|ともだち}に CD を ４まい かりました。', 'Tomodachi ni CD o yonmai karimashita.'],
        ['5. Tôi muốn có 10 đĩa DVD.', 'DVD が １０まい ほしいです。', 'DVD ga juumai hoshii desu.'],
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú đáp án',
      items: [
        '**Câu 3**: とります (chụp, nhóm 1) học ở Bài 5; "chụp ảnh" = **しゃしんを とります**. Cũng có thể viết 山**の**しゃしん (ảnh núi) hoặc 山**を**とった… nhưng dạng trên là mẫu thi.',
        '**Câu 4**: かります (mượn) đi với **に** (người cho mượn) → ともだち**に**かります; cũng chấp nhận **から**. Nếu cô hỏi "ai cho mượn?" thì dùng に/から.',
        '**Câu 5**: muốn có = **N が ほしいです** (Bài 5). Số đứng trước ほしい.',
      ],
    },
    {
      t: 'note',
      title: 'Cô hay hỏi gì khi gọi phát biểu (Slot 11)',
      items: [
        '"**〇〇で なにが ありますか。**" — bạn trả lời bằng sự kiện: こうえんで コンサートが あります.',
        '"**チケットが なんまい ありますか。**" → ２まい / ６まい … (nhớ **なんまい**).',
        '"**これは いくつですか。**" khi cô giơ trái cây/đồ vật → みっつ / よっつ… (không dùng 枚).',
        'Cô cho cả lớp làm **やってみよう 1** (sách p.105): nghe và chọn đúng ○/× khi bạn rủ.',
      ],
    },
    {
      t: 'mcq',
      id: 'slot11-luyen',
      title: 'Luyện — に/で・đếm ～枚/～つ (có giải thích)',
      items: [
        { q: 'FPT{大学|だいがく}（　）サッカーの{試合|しあい}があります。', options: ['に', 'で', 'を', 'は'], correct: 1, why: 'しあい = sự kiện diễn ra → **で**. (ポイント 51)' },
        { q: 'つくえの{上|うえ}（　）ほんが あります。', options: ['で', 'に', 'を', 'も'], correct: 1, why: 'Vật nằm ở đâu → **に**. (ポイント 50 — Bài 2/6)' },
        { q: 'チケットが（　）あります。(3 vé)', options: ['みっつ', 'さんまい', 'さんこ', 'さんつ'], correct: 1, why: 'Vé là vật mỏng, phẳng → **～枚**: さんまい.' },
        { q: 'りんごが（　）あります。(4 quả)', options: ['よんまい', 'よっつ', 'よんつ', 'しまい'], correct: 1, why: 'Đồ vật chung → **～つ**: よっつ (4 = よっつ, không phải よんつ).' },
        { q: 'CD を（　）かいました。(2 đĩa)', options: ['にまい', 'ふたつ', 'に', 'にこ'], correct: 0, why: 'CD mỏng, phẳng → **にまい**.' },
        { q: '「シャツは（　）ありますか。」(hỏi số lượng áo)', options: ['いくつ', 'なんまい', 'なんにん', 'なんじ'], correct: 1, why: 'Áo sơ mi → hỏi **なんまい**.' },
        { q: '{来週|らいしゅう}の{日曜日|にちようび}、コンサート（　）あります。', options: ['を', 'が', 'に', 'は'], correct: 1, why: 'あります dùng **が** để chỉ cái "có".' },
        { q: 'A：{今度|こんど}の{週末|しゅうまつ}、よこはまで はなびが あります。 B：へえ。（　）。', options: ['いきましたか', 'いっしょに みにいきませんか', 'みました', 'ありません'], correct: 1, why: 'A đưa thông tin, B đáp "へえ" rồi A (hoặc B) rủ: いっしょに みに いきませんか.' },
      ],
    },
    {
      t: 'quiz',
      id: 'slot11-luyen-dich',
      title: 'Luyện dịch Việt → Nhật',
      kind: 'translate',
      grammar: 'N1 で N2 が あります · N が ～まい あります',
      items: [
        { q: 'Ở Hà Nội có trận bóng đá.', answers: V('ハノイでサッカーの{試合|しあい}があります。'), hint: 'で · しあい · あります' },
        { q: 'Ở công viên có buổi hòa nhạc.', answers: V('{公園|こうえん}でコンサートがあります。'), hint: 'こうえん · コンサート' },
        { q: 'Tôi có 2 vé bảo tàng mỹ thuật.', answers: V('びじゅつかんのチケットが２まいあります。', 'びじゅつかんのチケットが{二|に}まいあります。', '{美術館|びじゅつかん}のチケットが２まいあります。'), hint: 'まい · チケット' },
        { q: 'Tôi đã mua 3 đĩa CD.', answers: V('CDを３まい{買|か}いました。', 'CDを{三|さん}まい{買|か}いました。'), hint: 'かいました · まい' },
        { q: 'Ngày mai ở trung tâm thương mại có đợt giảm giá.', answers: V('{明日|あした}、デパートでセールがあります。', 'あしたデパートでセールがあります。'), hint: 'セール · で' },
      ],
    },
  ],
};
/* ═══════════════════════ SLOT 12 — L6.2 どちらがいいですか ═══════════════════════ */

const SLOT_12: Lesson = {
  id: 'slot-12-l6-2-docchi',
  kind: 'grammar',
  title: 'Slot 12 — Bài 6.2「どちらがいいですか」: nhất · hơn · hỏi chọn 1 trong 2',
  goal: 'Nói và hỏi so sánh đúng 3 mẫu của cô: N1で N2が いちばん A / N1と N2と どちらが A — N(の ほう)が A / N1は N2より A (ポイント 53–56).',
  minutes: 60,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 12 cô dạy gì',
      items: [
        '**できること** của ST 2: hỏi ý bạn và so sánh thông tin để cùng bàn bạc chọn (món ăn, chỗ đi).',
        '**Từ mới (slide チャレンジ)**: たべもの · のみもの · やきにく · ラーメン · たべほうだい · いざかや · えいがかん · ちかてつ · かしゅ · きせつ · コメディー · ジャズ · ツアー · コース · どちら · とおい/ちかい/ひろい/はやい.',
        '**チャレンジ 1** — **N1で N2が いちばん A です**: "Trong N1, N2 A nhất".',
        '**チャレンジ 2** — **N1と N2と どちらが A ですか** / **N(1/2)の ほうが A です** / **どちらも A です**.',
        '**チャレンジ 3** — **N1は N2より A です**: "N1 thì A hơn N2". + hội thoại chọn quán sushi (さくらずし / みどりずし).',
        '**やってみよう 2** (sách p.109) và 5 câu dịch cuối buổi.',
      ],
    },

    { t: 'h', text: 'Phần 1 — Từ mới của ST 2 (slide: danh sách + hình)' },
    {
      t: 'table',
      caption: 'Cô cho xem hình rồi bắt đọc to — nên thuộc cả nhóm',
      head: ['Nhóm', 'Từ', 'Romaji', 'Nghĩa'],
      rows: [
        ['Ăn uống', '{食|た}べ{物|もの} / {飲|の}み{物|もの}', 'tabemono / nomimono', 'đồ ăn / đồ uống'],
        ['Ăn uống', '{焼|や}き{肉|にく} · ラーメン', 'yakiniku · raamen', 'thịt nướng · mì ramen'],
        ['Ăn uống', '{食|た}べ{放題|ほうだい}', 'tabehoudai', 'buffet tự chọn ăn thoải mái'],
        ['Ăn uống', 'コース', 'koosu', 'suất ăn / tour theo thực đơn định sẵn'],
        ['Nơi chốn', '{居酒屋|いざかや}', 'izakaya', 'quán nhậu kiểu Nhật'],
        ['Nơi chốn', '{映画館|えいがかん}', 'eigakan', 'rạp chiếu phim'],
        ['Nơi chốn', '{地下鉄|ちかてつ}', 'chikatetsu', 'tàu điện ngầm'],
        ['Giải trí', '{歌手|かしゅ}', 'kashu', 'ca sĩ'],
        ['Giải trí', 'ジャズ', 'jazu', 'nhạc jazz'],
        ['Giải trí', 'コメディー', 'komedii', 'phim/hài kịch'],
        ['Giải trí', 'ツアー', 'tsuaa', 'tour du lịch'],
        ['Thời gian', '{季節|きせつ}', 'kisetsu', 'mùa'],
        ['Hỏi', 'どちら', 'dochira', 'bên nào (trong hai)'],
        ['Tính từ', '{遠|とお}い ↔ {近|ちか}い', 'tooi ↔ chikai', 'xa ↔ gần'],
        ['Tính từ', '{広|ひろ}い', 'hiroi', 'rộng'],
        ['Tính từ', '{早|はや}い', 'hayai', 'sớm / nhanh (slide dùng cho ちかてつ…はやい)'],
      ],
    },
    {
      t: 'vocab',
      items: [
        { w: '{面積|めんせき}', pos: 'Danh từ', ipa: 'menseki', vi: 'diện tích', ex: 'ハノイの{面積|めんせき}は ひろいですか。', exRo: 'Hanoi no menseki wa hiroi desu ka.', exVi: 'Diện tích Hà Nội rộng không?', more: 'Từ xuất hiện trong slide so sánh Hà Nội / TP.HCM / Huế — chỉ cần nghe hiểu.' },
        { w: '{人口|じんこう}', pos: 'Danh từ', ipa: 'jinkou', vi: 'dân số', ex: 'ホーチミンしは{人口|じんこう}が おおいです。', exRo: 'Hoochimin-shi wa jinkou ga ooi desu.', exVi: 'TP. Hồ Chí Minh đông dân.' },
        { w: 'いちご / りんご / ぶどう', pos: 'Danh từ', ipa: 'ichigo / ringo / budou', vi: 'dâu / táo / nho', ex: 'くだものでは りんごが いちばん すきです。', exRo: 'Kudamono dewa ringo ga ichiban suki desu.', exVi: 'Trong trái cây, tôi thích táo nhất.', more: 'Ba hình trái cây trên slide minh họa N1 = くだもの.' },
        { w: 'こうちゃ', pos: 'Danh từ', ipa: 'koucha', vi: 'hồng trà', ex: 'コーヒーと こうちゃと どちらが すきですか。', exRo: 'Koohii to koucha to dochira ga suki desu ka.', exVi: 'Cà phê và hồng trà, bạn thích cái nào hơn?' },
        { w: 'ずっと', pos: 'Phó từ', ipa: 'zutto', vi: 'hơn hẳn / suốt', ex: '{日本語|にほんご}は{英語|えいご}より ずっと むずかしいです。', exRo: 'Nihongo wa eigo yori zutto muzukashii desu.', exVi: 'Tiếng Nhật khó hơn tiếng Anh hẳn.', more: 'Đi sau より, trước tính từ: ずっと = chênh nhiều · ちょっと/すこし = chênh một chút.' },
      ],
    },

    /* ── チャレンジ 1 ── */
    { t: 'h', text: 'チャレンジ 1 — 「N1で N2が いちばん A です」  ·  ポイント 53' },
    {
      t: 'p',
      text: 'Slide: **A：えいがで なにが いちばん すきですか。B：コメディーが いちばん すきです。** Công thức cô viết: **N1 で N2 が いちばん A です — "Trong số N1 thì N2 A nhất"**. N1 là **phạm vi** (nhóm), N2 là **thứ được chọn**, A là tính từ. いちばん = "số 1", đứng **ngay trước tính từ** (như một phó từ).',
    },
    {
      t: 'rule',
      formula: 'N1 で N2 が いちばん A です。',
      vi: 'Trong nhóm N1, N2 là A nhất. Hỏi: N1 で なに／だれ／どこ／いつ が いちばん A ですか。',
    },
    {
      t: 'table',
      caption: 'Câu hỏi theo từ nghi vấn (slide: "N1で なに、だれ、どこ、いつが いちばん A ですか")',
      head: ['Hỏi về', 'Từ hỏi', 'Câu hỏi', 'Câu trả lời'],
      rows: [
        ['vật / món / môn', 'なに', 'のみもので なにが いちばん すきですか。', 'コーヒーが いちばん すきです。'],
        ['người', 'だれ', 'クラスで だれが いちばん ゆうめいですか。', 'ワンさんが いちばん ゆうめいです。'],
        ['nơi chốn', 'どこ', 'とうきょうで どこが いちばん おもしろいですか。', 'あきはばらが いちばん おもしろいです。'],
        ['thời gian', 'いつ', 'きせつで いつが いちばん いいですか。', 'あきが いちばん いいです。'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('{食|た}べ{物|もの}で{ラーメン|らーめん}が いちばん すきです。', 'Tabemono de raamen ga ichiban suki desu.', 'Trong đồ ăn, tôi thích ramen nhất. (ví dụ mẫu trên slide: たべもの・ラーメン・すき)'),
        E('くだもので りんごが いちばん すきです。', 'Kudamono de ringo ga ichiban suki desu.', 'Trong trái cây, tôi thích táo nhất.'),
        E('{飲|の}み{物|もの}で コーヒーが いちばん すきです。', 'Nomimono de koohii ga ichiban suki desu.', 'Trong đồ uống, tôi thích cà phê nhất.'),
        E('{日本|にほん}で {北海道|ほっかいどう}が いちばん きれいです。', 'Nihon de Hokkaidou ga ichiban kirei desu.', 'Ở Nhật, Hokkaido đẹp nhất. (slide ④)'),
        E('{一年|いちねん}で いつが いちばん あついですか。…{8月|はちがつ}が いちばん あついです。', 'Ichinen de itsu ga ichiban atsui desu ka. …Hachigatsu ga ichiban atsui desu.', 'Trong một năm, khi nào nóng nhất? …Tháng 8 nóng nhất.'),
        E('このレストランの りょうりで{何|なに}が いちばん おいしいですか。…カレーが いちばん おいしいです。', 'Kono resutoran no ryouri de nani ga ichiban oishii desu ka. …Karee ga ichiban oishii desu.', 'Trong các món của nhà hàng này, món nào ngon nhất? …Cà ri ngon nhất.'),
        E('スポーツで{何|なに}が いちばん すきですか。…ぜんぶ すきです。', 'Supootsu de nani ga ichiban suki desu ka. …Zenbu suki desu.', 'Trong các môn thể thao, bạn thích môn nào nhất? …Tôi thích tất cả.'),
      ],
    },
    {
      t: 'table',
      caption: 'Sáu câu "①–⑥" của slide (cô cho từ khóa, bạn đặt câu) — đáp án mẫu',
      head: ['Từ khóa', 'Đáp án mẫu', 'Romaji'],
      rows: [
        ['のみもの・ビール・すき', 'のみもので ビールが いちばん すきです。', 'Nomimono de biiru ga ichiban suki desu.'],
        ['スポーツ・やきゅう・すき', 'スポーツで やきゅうが いちばん すきです。', 'Supootsu de yakyuu ga ichiban suki desu.'],
        ['(thể loại) … いちばん すき', 'ＸＸで スマイルが いちばん すきです。 (tên riêng: tự thay)', 'XX de Sumairu ga ichiban suki desu.'],
        ['にほん・ほっかいどう・きれい', 'にほんで ほっかいどうが いちばん きれいです。', 'Nihon de Hokkaidou ga ichiban kirei desu.'],
        ['きせつ・なつ・すき', 'きせつで なつが いちばん すきです。', 'Kisetsu de natsu ga ichiban suki desu.'],
        ['いちねん・2がつ・さむい', 'いちねんで ２がつが いちばん さむいです。', 'Ichinen de nigatsu ga ichiban samui desu.'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ & lỗi hay mắc',
      items: [
        '**で** ở đây chỉ **phạm vi**, không phải nơi diễn ra hành động. "Trong (nhóm) …": くだもの**で**, スポーツ**で**, クラス**で**, にほん**で**.',
        '**Hỏi bằng từ nghi vấn ở vị trí N2**: câu hỏi và câu đáp cùng khung, chỉ thay "なに" bằng thứ được chọn.',
        '**Sai**: ~~たべものが ラーメンで いちばん すきです~~ ✗ → **たべもので ラーメンが** いちばん すきです ✓ (nhóm trước, món sau).',
        '**Không nói** ~~いちばんが すきです~~: いちばん luôn đứng TRƯỚC tính từ (hoặc すき/きらい, tính từ な đi cùng).',
        'Thích → **すき** (tính từ な). Câu này không dùng を: ~~ラーメンを いちばん すきです~~ ✗ → ラーメン**が** いちばん すきです ✓.',
        '**ぜんぶ** = tất cả: ぜんぶ すきです (dùng khi không muốn chọn một).',
      ],
    },
    DL('Hội thoại slide (A/B) — viết lại bằng lời mới', [
        ['A', 'a', '{音楽|おんがく}が すきですか。', 'Ongaku ga suki desu ka.', 'Bạn thích âm nhạc không?'],
        ['B', 'b', 'はい。', 'Hai.', 'Có.'],
        ['A', 'a', '{音楽|おんがく}で{何|なに}が いちばん すきですか。', 'Ongaku de nani ga ichiban suki desu ka.', 'Trong âm nhạc, bạn thích gì nhất?'],
        ['B', 'b', 'ジャズが いちばん すきです。', 'Jazu ga ichiban suki desu.', 'Tôi thích jazz nhất.'],
        ['A', 'a', 'そうですか。{私|わたし}も ジャズが すきです。{今度|こんど}、いっしょに コンサートへ いきませんか。', 'Sou desu ka. Watashi mo jazu ga suki desu. Kondo, issho ni konsaato e ikimasen ka.', 'Vậy à. Tôi cũng thích jazz. Lần tới cùng đi hòa nhạc nhé?'],
        ['B', 'b', 'いいですね。', 'Ii desu ne.', 'Hay đấy.'],
    ]),

    /* ── チャレンジ 2 ── */
    { t: 'h', text: 'チャレンジ 2 — 「N1と N2と どちらが A ですか」  ·  ポイント 55–56' },
    {
      t: 'p',
      text: 'Slide: **A：にくと さかなと どちらが すきですか。B：さかなの ほうが すきです。** Ví dụ cô vẽ: **Shinkansen và máy bay, cái nào nhanh hơn? — ひこうきの ほうが はやいです.** Công thức: **N1 と N2 と どちらが A ですか → N1（N2）の ほうが A です**; nếu cả hai như nhau: **どちらも A です**.',
    },
    {
      t: 'rule',
      formula: 'N1 と N2 と どちらが A ですか。→ N1 の ほうが A です。／ どちらも A です。',
      vi: 'So sánh hai vật. Trả lời bằng "N + の ほうが A" — nhắc lại cái được chọn.',
    },
    {
      t: 'examples',
      items: [
        E('コーヒーと こうちゃと どちらが すきですか。…コーヒーの ほうが すきです。', 'Koohii to koucha to dochira ga suki desu ka. …Koohii no hou ga suki desu.', 'Cà phê và hồng trà, thích cái nào hơn? …Cà phê hơn.'),
        E('{中国|ちゅうごく}と ベトナムと どちらが おおきいですか。…ちゅうごくの ほうが おおきいです。', 'Chuugoku to Betonamu to dochira ga ookii desu ka. …Chuugoku no hou ga ookii desu.', 'Trung Quốc và Việt Nam, nước nào lớn hơn? …Trung Quốc lớn hơn.'),
        E('ベトナムりょうりと {日本|にほん}りょうりと どちらが おいしいですか。…どちらも おいしいです。', 'Betonamu ryouri to Nihon ryouri to dochira ga oishii desu ka. …Dochira mo oishii desu.', 'Món Việt và món Nhật, món nào ngon hơn? …Cả hai đều ngon.'),
        E('バスと ちかてつと どちらが はやいですか。…ちかてつの ほうが はやいです。', 'Basu to chikatetsu to dochira ga hayai desu ka. …Chikatetsu no hou ga hayai desu.', 'Xe buýt và tàu điện ngầm, cái nào nhanh hơn? …Tàu điện ngầm.'),
        E('カラオケと コンサートと どちらが すきですか。…カラオケの ほうが すきです。', 'Karaoke to konsaato to dochira ga suki desu ka. …Karaoke no hou ga suki desu.', 'Karaoke và hòa nhạc, thích cái nào hơn? …Karaoke hơn.'),
        E('コースと たべほうだいと どちらが いいですか。…どちらも いいです。', 'Koosu to tabehoudai to dochira ga ii desu ka. …Dochira mo ii desu.', 'Suất cố định và buffet, cái nào được hơn? …Cái nào cũng tốt.'),
        E('{7月|しちがつ}と {8月|はちがつ}と どちらが {雨|あめ}が おおいですか。…{7月|しちがつ}の ほうが おおいです。', 'Shichigatsu to hachigatsu to dochira ga ame ga ooi desu ka. …Shichigatsu no hou ga ooi desu.', 'Tháng 7 và tháng 8, tháng nào mưa nhiều hơn? …Tháng 7 nhiều hơn.'),
      ],
    },
    {
      t: 'table',
      caption: 'Ba bài "例１・①②③" của slide: từ khóa → đáp án',
      head: ['Từ khóa', 'Hỏi', 'Đáp'],
      rows: [
        ['ニコニコマート・ハッピースーパー・やすい / ハッピースーパー', 'ニコニコマートと ハッピースーパーと どちらが やすいですか。', 'ハッピースーパーの ほうが やすいです。'],
        ['① よこはま・かまくら・ちかい / よこはま', 'よこはまと かまくらと どちらが ちかいですか。', 'よこはまの ほうが ちかいです。'],
        ['② ７がつ・８がつ・あめがおおい / ７がつ', '７がつと ８がつと どちらが あめが おおいですか。', '７がつの ほうが おおいです。'],
        ['③ サッカー・やきゅう・すき / どちらも', 'サッカーと やきゅうと どちらが すきですか。', 'どちらも すきです。'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ & lỗi hay mắc',
      items: [
        '**Hai と**: N1**と** N2**と** — nhớ có "と" thứ hai, không bỏ: ~~にくと さかな どちら~~ ✗.',
        '**どちら** (không phải どれ) vì chỉ có HAI lựa chọn. Từ 3 lựa chọn trở lên dùng **どれ** (Bài 7).',
        '**の ほう** = "phía …": N**の ほう**が A. **Bỏ の** là sai: ~~さかなほうが~~ ✗.',
        '**Không dùng いちばん** trong câu hỏi hai vật: ~~にくと さかなと どちらが いちばん~~ ✗.',
        '**どちらも A です** = cả hai đều A (không có "の ほう"). Phủ định: **どちらも A くないです** (Bài 4).',
      ],
    },
    DL('Hội thoại slide — chọn món cho buổi tối (viết lại)', [
        ['A', 'a', '{今晩|こんばん}、いっしょに ごはんを たべに いきませんか。', 'Konban, issho ni gohan o tabe ni ikimasen ka.', 'Tối nay cùng đi ăn không?'],
        ['B', 'b', 'いいですね。', 'Ii desu ne.', 'Hay đấy.'],
        ['A', 'a', '{肉|にく}と {魚|さかな}と どちらが すきですか。', 'Niku to sakana to dochira ga suki desu ka.', 'Thịt và cá, bạn thích cái nào hơn?'],
        ['B', 'b', '{魚|さかな}の ほうが すきです。', 'Sakana no hou ga suki desu.', 'Tôi thích cá hơn.'],
        ['A', 'a', 'そうですか。じゃ、すしを たべに いきましょう。', 'Sou desu ka. Ja, sushi o tabe ni ikimashou.', 'Vậy à. Thế thì đi ăn sushi nhé.'],
    ]),
    {
      t: 'table',
      caption: 'Slide "ST 2 — 3 cặp hình" luyện nói (bạn tự nói to, đáp án mẫu)',
      head: ['Cặp trên hình', 'Câu hỏi mẫu', 'Đáp mẫu'],
      rows: [
        ['バーベキュー / ひろい', 'バーベキューを するところは どちらが ひろいですか。', '(tùy hình) ＸＸの ほうが ひろいです。'],
        ['えいが / おもしろい', 'コメディーと ドラマと どちらが おもしろいですか。', 'コメディーの ほうが おもしろいです。'],
        ['たべほうだい / やすい', 'たべほうだいと コースと どちらが やすいですか。', 'たべほうだいの ほうが やすいです。'],
        ['やきにく と ラーメン / おいしい', 'やきにくと ラーメンと どちらが おいしいですか。', 'ラーメンの ほうが おいしいです。'],
        ['たべほうだい と コース / いい', 'たべほうだいと コースと どちらが いいですか。', 'たべほうだいの ほうが いいです。'],
      ],
    },

    /* ── チャレンジ 3 ── */
    { t: 'h', text: 'チャレンジ 3 — 「N1は N2より A です」  ·  ポイント 54' },
    {
      t: 'p',
      text: 'Slide: **A：さくらずしと みどりずしと どちらが いいですか。B：みどりずしの ほうが いいです。** Rồi cô giới thiệu mẫu mới: **N1 は N2 より A です — "N1 thì A hơn N2"**. Ví dụ cô: 日曜日は 土曜日より 人が おおいです · ひこうきは しんかんせんより はやいです · タイりょうりは 日本りょうりより からいです · JTP ツアーは HLS ツアーより おもしろいです · ハッピースーパーは ニコニコマートより とおいです.',
    },
    {
      t: 'rule',
      formula: 'N1 は N2 より A です。',
      vi: 'N1 A hơn N2. より = "so với". Phó từ nhấn: ずっと (hơn hẳn) · ちょっと/すこし (hơn một chút) — đứng trước A.',
    },
    {
      t: 'examples',
      items: [
        E('{日曜日|にちようび}は {土曜日|どようび}より {人|ひと}が おおいです。', 'Nichiyoubi wa doyoubi yori hito ga ooi desu.', 'Chủ Nhật đông người hơn thứ Bảy.'),
        E('ひこうきは しんかんせんより はやいです。', 'Hikouki wa shinkansen yori hayai desu.', 'Máy bay nhanh hơn tàu Shinkansen.'),
        E('くるまは しんかんせんより おそいです。', 'Kuruma wa shinkansen yori osoi desu.', 'Ô tô chậm hơn tàu Shinkansen.'),
        E('バスは ちかてつより やすいです。', 'Basu wa chikatetsu yori yasui desu.', 'Xe buýt rẻ hơn tàu điện ngầm.'),
        E('ベトナムは {日本|にほん}より あついです。', 'Betonamu wa Nihon yori atsui desu.', 'Việt Nam nóng hơn Nhật Bản.'),
        E('コースは たべほうだいより たかいです。', 'Koosu wa tabehoudai yori takai desu.', 'Suất cố định đắt hơn buffet.'),
        E('{日本語|にほんご}は {英語|えいご}より ずっと むずかしいです。', 'Nihongo wa eigo yori zutto muzukashii desu.', 'Tiếng Nhật khó hơn tiếng Anh hẳn.'),
        E('きょうは あしたより ちょっと いそがしいです。', 'Kyou wa ashita yori chotto isogashii desu.', 'Hôm nay bận hơn ngày mai một chút.'),
      ],
    },
    {
      t: 'table',
      caption: 'Ba cách nói so sánh — chọn đúng theo câu hỏi',
      head: ['Câu hỏi', 'Trả lời', 'Ví dụ'],
      rows: [
        ['**Có hay không** (câu hỏi Có/Không): にほんごは えいごより むずかしいですか。', 'はい、**ずっと** むずかしいです。', 'Dùng より ngay trong câu hỏi'],
        ['**Chọn 1 trong 2** (hỏi từ): にほんごと えいごと どちらが むずかしいですか。', '**にほんごの ほうが** むずかしいです。', 'Không cần より'],
        ['**Cả hai như nhau**', '**どちらも** むずかしいです。', 'Không có "の ほう"'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ & lỗi hay mắc',
      items: [
        '**Hơn ↔ より**: cái đứng **trước より** là cái **bị so** (kém hơn); cái đứng trước は là cái **được khen**. "ひこうき**は** しんかんせん**より** はやい" = máy bay nhanh (nhanh hơn Shinkansen).',
        '**Sai**: ~~ひこうきは しんかんせんが より はやいです~~ — không có が giữa N2 và より.',
        '**Sai**: ~~ひこうきは しんかんせんより もっと はやいです~~ — もっと dùng được trong hội thoại nhưng khi thi cô muốn **ずっと/ちょっと/すこし** (slide tổng hợp).',
        '**Tính từ KHÔNG chia theo より**: ひこうき は しんかんせん より はやい**です** (không かった, không く trừ khi phủ định).',
        '**Phủ định**: A は B より A**くないです**. Ví dụ: くるまは しんかんせんより はやくないです.',
        '"**N1 は N2 より ずっと A**" = chênh nhiều; "**ちょっと A / すこし A**" = hơn chút ít.',
      ],
    },
    DL('Hội thoại slide — chọn quán (viết lại)', [
        ['A', 'a', 'どこへ たべに いきますか。', 'Doko e tabe ni ikimasu ka.', 'Ăn ở đâu nhỉ?'],
        ['B', 'b', 'さくらずしと みどりずしが ありますよ。', 'Sakura-zushi to Midori-zushi ga arimasu yo.', 'Có quán Sakura và quán Midori đấy.'],
        ['A', 'a', 'さくらずしと みどりずしと どちらが いいですか。', 'Sakura-zushi to Midori-zushi to dochira ga ii desu ka.', 'Quán nào tốt hơn?'],
        ['B', 'b', 'そうですねえ。みどりずしの ほうが いいです。みどりずしは さくらずしより やすいですから。', 'Sou desu nee. Midori-zushi no hou ga ii desu. Midori-zushi wa Sakura-zushi yori yasui desu kara.', 'Để xem nào… Midori tốt hơn. Vì Midori rẻ hơn Sakura.'],
        ['A', 'a', 'じゃ、そうしましょう。', 'Ja, sou shimashou.', 'Vậy làm thế nhé.'],
    ]),
    {
      t: 'note',
      title: 'Slide hình: tìm lý do để chọn (cô cho 2 bảng số)',
      items: [
        '**Hình đường đi**: しんじゅく **40ふん**, しぶや **25ふん** → しぶやは しんじゅくより **ちかい** です / しぶやの ほうが ちかいです.',
        '**Hình giá**: A コース **5000円**, B コース **3000円** → B コースは A コースより **やすい** です.',
        'Cách dùng trong hội thoại: **［lý do］から** → **［lựa chọn］の ほうが いいです。** (みどりずしは やすいですから。)',
        '**そうですねえ** = "để xem nào…" — câu đệm khi đang suy nghĩ trước khi chọn.',
      ],
    },

    { t: 'h', text: 'Slide "Dịch 5 câu" (cuối buổi) — đáp án' },
    {
      t: 'table',
      caption: 'Slide in cả đáp án; mình chép lại có romaji',
      head: ['Tiếng Việt', 'Tiếng Nhật', 'Romaji'],
      rows: [
        ['1. Trong các loại nhạc, tôi thích nhất nhạc Jazz.', 'おんがくで ジャズが いちばん すきです。', 'Ongaku de jazu ga ichiban suki desu.'],
        ['2. Trong các món ăn, tôi thấy thịt nướng ngon nhất.', 'たべもので やきにくが いちばん おいしいです。', 'Tabemono de yakiniku ga ichiban oishii desu.'],
        ['3. Ở Việt Nam thì Bác Hồ là người nổi tiếng nhất.', 'ベトナムで ホーチミンさまが いちばん ゆうめいな ひとです。', 'Betonamu de Hoochimin-sama ga ichiban yuumei na hito desu.'],
        ['4. Trung Quốc thì rộng hơn Việt Nam.', 'ちゅうごくは ベトナムより ひろいです。', 'Chuugoku wa Betonamu yori hiroi desu.'],
        ['5. Tàu điện ngầm nhanh hơn tàu điện phải không?', 'ちかてつは でんしゃより はやいですか。', 'Chikatetsu wa densha yori hayai desu ka.'],
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú câu 3',
      items: [
        'Slide dùng **ホーチミンさま** (kính trọng). Vì là danh từ chỉ người, đứng sau **が** và trước **いちばん ゆうめいな ひとです**: tính từ な (ゆうめい) + **な** + danh từ (ひと).',
        'Nếu chỉ hỏi "ai nổi tiếng nhất?" thì: ベトナムで だれが いちばん ゆうめいですか。',
      ],
    },
    {
      t: 'note',
      title: 'Cô hay hỏi gì khi gọi phát biểu (Slot 12)',
      items: [
        '"**〇〇で なにが いちばん すきですか。**" (たべもの・のみもの・スポーツ・おんがく・きせつ・くだもの…) — trả lời đúng khung **N1 で N2 が いちばん すきです** và nói thêm lý do bằng **おいしいですから**.',
        '"**AさんとBさんと どちらが 〇〇ですか。**" — chọn đúng **の ほうが**; nếu bằng nhau nói **どちらも**.',
        '"**とうきょうで どこが いちばん おもしろいですか。**" — あきはばら/しぶや/あさくさ… (dùng tên có trong slide).',
        '"**ベトナムは にほんより あついですか。**" — はい、ずっと あついです. Có thể xen **ちょっと / すこし**.',
      ],
    },
    {
      t: 'mcq',
      id: 'slot12-luyen',
      title: 'Luyện — いちばん · どちら · より (có giải thích)',
      items: [
        { q: 'スポーツ（　）サッカーが いちばん すきです。', options: ['で', 'に', 'を', 'が'], correct: 0, why: 'Phạm vi nhóm = **で** (ポイント 53).' },
        { q: '「にくと さかなと（　）が すきですか。」', options: ['どこ', 'どちら', 'いつ', 'だれ'], correct: 1, why: 'Hai lựa chọn → **どちら** (ポイント 55).' },
        { q: '「さかなの（　）が すきです。」', options: ['ほう', 'より', 'いちばん', 'もっと'], correct: 0, why: '**の ほうが** để chọn một trong hai (ポイント 56).' },
        { q: 'ひこうきは しんかんせん（　）はやいです。', options: ['と', 'より', 'に', 'で'], correct: 1, why: 'So sánh hơn = **より** (ポイント 54).' },
        { q: '「バスと ちかてつと どちらが やすいですか。」「（　）やすいです。」(cả hai)', options: ['どちらも', 'どちらが', 'どちらを', 'どれも'], correct: 0, why: 'Cả hai như nhau → **どちらも**.' },
        { q: '{一年|いちねん}で（　）が いちばん あついですか。', options: ['いつ', 'だれ', 'どこ', 'どちら'], correct: 0, why: 'Hỏi thời điểm → **いつ**. 8月が いちばん あついです.' },
        { q: '{日本語|にほんご}は {英語|えいご}より（　）むずかしいです。(khó hơn hẳn)', options: ['ずっと', 'いちばん', 'どちら', 'もう'], correct: 0, why: '**ずっと** đứng sau より, trước tính từ = chênh nhiều.' },
        { q: '「ベトナムで だれが いちばん ゆうめいですか。」の{答|こた}えは？', options: ['ホーチミンさまが いちばん ゆうめいです。', 'ホーチミンさまの ほうが ゆうめいです。', 'ホーチミンさまより ゆうめいです。', 'どちらも ゆうめいです。'], correct: 0, why: 'Hỏi いちばん → đáp いちばん. 3 phương án sau thuộc mẫu khác (so 2 vật).' },
      ],
    },
    {
      t: 'quiz',
      id: 'slot12-luyen-dich',
      title: 'Luyện dịch Việt → Nhật',
      kind: 'translate',
      grammar: 'N1で N2が いちばん A · N1と N2と どちらが A · N(の ほう)が A · N1は N2より A',
      items: [
        { q: 'Trong đồ uống, tôi thích cà phê nhất.', answers: V('{飲|の}み{物|もの}でコーヒーがいちばんすきです。'), hint: 'のみもの · いちばん · すき' },
        { q: 'Cà phê và hồng trà, bạn thích cái nào hơn?', answers: V('コーヒーとこうちゃとどちらがすきですか。', 'コーヒーと{紅茶|こうちゃ}とどちらがすきですか。'), hint: 'どちら' },
        { q: 'Tôi thích cà phê hơn.', answers: V('コーヒーのほうがすきです。'), hint: 'の ほう' },
        { q: 'Tàu điện ngầm nhanh hơn xe buýt.', answers: V('{地下鉄|ちかてつ}はバスより{早|はや}いです。', 'ちかてつはバスよりはやいです。'), hint: 'より · はやい' },
        { q: 'Ở Nhật, Hokkaido đẹp nhất.', answers: V('{日本|にほん}で{北海道|ほっかいどう}がいちばんきれいです。', 'にほんでほっかいどうがいちばんきれいです。'), hint: 'で · いちばん · きれい' },
        { q: 'Món Việt và món Nhật, cả hai đều ngon.', answers: V('ベトナムりょうりも{日本|にほん}りょうりもおいしいです。', 'ベトナムりょうりと{日本|にほん}りょうりはどちらもおいしいです。', 'どちらもおいしいです。'), hint: 'どちらも' },
      ],
    },
  ],
};

/* ═══════════════════════ SLOT 13 — L6.3 やくそく ═══════════════════════ */

const SLOT_13: Lesson = {
  id: 'slot-13-l6-3-yakusoku',
  kind: 'grammar',
  title: 'Slot 13 — Bài 6.3「やくそく」: もう～ましたか · よ · どうですか · ね · hẹn ngày giờ',
  goal: 'Hẹn được nơi và giờ gặp: hỏi "đã … chưa", đề xuất bằng "Nはどうですか", báo tin bằng よ, xác nhận bằng ね (ポイント 57–60).',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 13 cô dạy gì',
      items: [
        '**できること**: hẹn được nơi gặp, giờ gặp. Từ mới: **おこのみやき · すきやき · あそびます**.',
        '**チャレンジ 1** — もう V ましたか → はい、(もう) V ました／いいえ、まだです (ポイント 57).',
        '**チャレンジ 2** — **よ** (báo thông tin mới) (ポイント 60).',
        '**チャレンジ 3** — **N は どうですか** (đề xuất ngày/nơi) (ポイント 58).',
        '**チャレンジ 4** — **ね** (xác nhận, đồng tình) (ポイント 59) + hẹn giờ **～ごろ**.',
        '**会話練習 5 tranh** nối thành một cuộc hẹn trọn vẹn + **やってみよう 3** (sách p.113).',
      ],
    },
    {
      t: 'vocab',
      items: [
        { w: 'おこのみやき', pos: 'Danh từ', ipa: 'okonomiyaki', vi: 'bánh xèo kiểu Nhật okonomiyaki', ex: '{大阪|おおさか}で おこのみやきを {食|た}べました。', exRo: 'Oosaka de okonomiyaki o tabemashita.', exVi: 'Tôi đã ăn okonomiyaki ở Osaka.' },
        { w: 'すきやき', pos: 'Danh từ', ipa: 'sukiyaki', vi: 'lẩu thịt bò sukiyaki', ex: 'すきやきは {肉|にく}と やさいの りょうりです。', exRo: 'Sukiyaki wa niku to yasai no ryouri desu.', exVi: 'Sukiyaki là món thịt và rau.' },
        { w: '{遊|あそ}びます', pos: 'Động từ nhóm 1', ipa: 'asobimasu', vi: 'chơi, đi chơi', ex: '{日曜日|にちようび}に ともだちと あそびます。', exRo: 'Nichiyoubi ni tomodachi to asobimasu.', exVi: 'Chủ Nhật tôi đi chơi với bạn.', more: 'Thể て: あそんで (び → んで).' },
      ],
    },

    /* ── チャレンジ 1 ── */
    { t: 'h', text: 'チャレンジ 1 — 「もう おこのみやきを 食べましたか」  ·  ポイント 57' },
    {
      t: 'p',
      text: 'Slide: **A：もう おこのみやきを たべましたか。B：いいえ、まだです。** Cô đối chiếu với Bài 5: "Bạn đã ăn sáng chưa? …はい、たべました／…いいえ、たべませんでした" (Bài 5 — chỉ **kể lại** việc đã qua) và Bài 6 "もう…ましたか… **まだです**" (chỉ **đã làm xong chưa**; việc vẫn dự định làm).',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'もう V ましたか。',
          vi: 'Hỏi "Đã … chưa?". もう đứng đầu vị ngữ, V ở quá khứ.',
          examples: [
            E('もう カラオケに {行|い}きましたか。', 'Mou karaoke ni ikimashita ka.', 'Bạn đã đi karaoke chưa?'),
            E('もう おこのみやきを {食|た}べましたか。', 'Mou okonomiyaki o tabemashita ka.', 'Bạn đã ăn okonomiyaki chưa?'),
            E('もう ゆきを {見|み}ましたか。', 'Mou yuki o mimashita ka.', 'Bạn đã thấy tuyết chưa?'),
          ],
        },
        {
          formula: 'はい、（もう）V ました。 ／ いいえ、まだです。',
          vi: 'Đáp: **Rồi** → はい、もう V ました. **Chưa** → いいえ、**まだです** (không dùng ~~V ませんでした~~).',
          examples: [
            E('はい、もう {行|い}きました。', 'Hai, mou ikimashita.', 'Rồi, tôi đã đi rồi.'),
            E('いいえ、まだです。ぜひ {食|た}べたいです。', 'Iie, mada desu. Zehi tabetai desu.', 'Chưa. Tôi rất muốn ăn.'),
            E('はい、もう {見|み}ました。きれいですよ。', 'Hai, mou mimashita. Kirei desu yo.', 'Rồi, đã xem. Đẹp lắm đó.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'So sánh Bài 5 và Bài 6 — nhớ chỗ khác',
      head: ['', 'Hỏi', 'Có', 'Không (chưa)'],
      rows: [
        ['Bài 5 — việc ĐÃ QUA', 'あさごはんを たべましたか。', 'はい、たべました。', 'いいえ、**たべませんでした**。 (hôm đó không ăn)'],
        ['Bài 6 — "xong chưa?"', 'もう おこのみやきを たべましたか。', 'はい、**もう** たべました。', 'いいえ、**まだです**。 (chưa, có thể sẽ ăn)'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ & lỗi hay mắc',
      items: [
        '**まだです** = "vẫn chưa". Đi với câu hỏi もう～ましたか. Không dùng ~~いいえ、まだ たべません~~ ✗ (nghe cứng). Dạng đầy đủ **まだ V ていません** là mẫu lên cao hơn, bài này chỉ cần まだです.',
        '**もう** ở câu hỏi ≠ もう ở Bài 7 "もう ありません" (hết). Hai もう khác nhau: ở Bài 6 = "đã … rồi"; ở Bài 7 (もう ありません) = "không còn nữa".',
        '**はい、もう たべました** hay **はい、たべました** đều đúng; もう làm câu mạnh hơn (đã … rồi).',
        'Câu hay thêm sau まだです: **ぜひ V たいです** ("nhất định muốn …") — rất tự nhiên khi bạn muốn được rủ.',
        '**ぜひ** chỉ đi với **muốn / mong / xin** (たいです, ください, ましょう). Sai: ~~ぜひ たべました~~ ✗, ~~ぜひ あついです~~ ✗ (đúng là bài tập sách: chỉ "ぜひ いきたいです" đúng).',
      ],
    },
    DL('Hội thoại slide (viết lại bằng lời mới)', [
        ['A', 'a', '{週末|しゅうまつ}、いっしょに たべに いきませんか。', 'Shuumatsu, issho ni tabe ni ikimasen ka.', 'Cuối tuần cùng đi ăn không?'],
        ['B', 'b', 'いいですね。{何|なに}を たべますか。', 'Ii desu ne. Nani o tabemasu ka.', 'Hay đấy. Ăn gì nhỉ?'],
        ['A', 'a', 'もう おこのみやきを たべましたか。', 'Mou okonomiyaki o tabemashita ka.', 'Bạn đã ăn okonomiyaki chưa?'],
        ['B', 'b', 'いいえ、まだです。', 'Iie, mada desu.', 'Chưa.'],
        ['A', 'a', 'じゃ、おこのみやきを たべませんか。', 'Ja, okonomiyaki o tabemasen ka.', 'Vậy thì ăn okonomiyaki nhé?'],
        ['B', 'b', 'いいですね。そうしましょう。', 'Ii desu ne. Sou shimashou.', 'Hay đấy. Làm thế nhé.'],
    ]),

    /* ── チャレンジ 2 ── */
    { t: 'h', text: 'チャレンジ 2 — よ: báo thông tin mới  ·  ポイント 60' },
    {
      t: 'p',
      text: 'Slide: **A：じゃ、おこのみやきを たべに いきませんか。しんじゅくの おこのみやきは とても おいしいですよ。** Cô giải thích: **よ** = từ cảm thán dùng để **thông báo một thông tin mới mà người nghe chưa biết**.',
    },
    {
      t: 'examples',
      items: [
        E('いっしょに おこのみやきを たべませんか。おこのみやきは おいしいですよ。', 'Issho ni okonomiyaki o tabemasen ka. Okonomiyaki wa oishii desu yo.', 'Cùng ăn okonomiyaki không? Ngon lắm đấy.'),
        E('ラーメンは やすいですよ。', 'Raamen wa yasui desu yo.', 'Ramen rẻ đó.'),
        E('さくらは きれいですよ。', 'Sakura wa kirei desu yo.', 'Hoa anh đào đẹp lắm đó.'),
        E('えいがは おもしろいですよ。', 'Eiga wa omoshiroi desu yo.', 'Phim hay lắm đó.'),
      ],
    },
    {
      t: 'note',
      title: 'Cách dùng よ',
      items: [
        '**よ** đặt cuối câu, sau です/ます: おいしい**ですよ**, あります**よ**.',
        'Dùng khi bạn **biết, người kia chưa biết**: giới thiệu quán, báo giờ, báo sự kiện. Nhờ vậy lời rủ có lý do.',
        '**Đừng dùng よ với người trên** để sửa lỗi ("Anh sai rồi đấy") — nghe áp đặt. Khi bạn muốn nhường, bỏ よ.',
        'よ = đưa thông tin; **ね** = xin xác nhận / đồng tình — cặp này cô so ở Phần 4.',
      ],
    },
    {
      t: 'table',
      caption: 'Slide "会話練習": thay cặp N / tính từ trong khung',
      head: ['N', 'Tính từ', 'Câu rủ + よ'],
      rows: [
        ['ラーメン', 'やすい', 'いっしょに ラーメンを たべに いきませんか。ラーメンは やすいですよ。'],
        ['さくら', 'きれい', 'いっしょに さくらを みに いきませんか。さくらは きれいですよ。'],
        ['えいが', 'おもしろい', 'いっしょに えいがを みに いきませんか。えいがは おもしろいですよ。'],
      ],
    },

    /* ── チャレンジ 3 ── */
    { t: 'h', text: 'チャレンジ 3 — 「土曜日の よるは どうですか」  ·  ポイント 58' },
    {
      t: 'p',
      text: 'Slide: **A：いつ いきますか。B：そうですねえ。どようびの よるは どうですか。A：すみません。どようびは ちょっと…。にちようびは どうですか。B：はい、だいじょうぶです。** Cô so sánh: **Bài 4 "N は どうですか" = hỏi cảm tưởng** (にほんは どうですか — Nhật Bản thế nào?). **Bài 6 "N は どうですか" = đưa gợi ý** (あさっては どうですか — ngày kia thì sao?). Cô ghi nhãn: "どうですか: dùng để gợi ý".',
    },
    {
      t: 'table',
      caption: 'Hai nghĩa của 「N は どうですか」',
      head: ['Bài', 'Nghĩa', 'Ví dụ', 'Trả lời'],
      rows: [
        ['Bài 4', 'hỏi cảm tưởng / tình trạng', 'ベトナムりょうりは どうですか。', 'おいしいです。 (một tính từ)'],
        ['Bài 6', '**đề xuất** (ngày, giờ, nơi, món)', 'あさっては どうですか。', 'いいですよ。／ちょっと…。'],
      ],
    },
    DL('Hẹn ngày — mẫu từ chối rồi đề xuất lại', [
        ['A', 'a', 'Bさん、あした いっしょに えいがを みに いきませんか。', 'B-san, ashita issho ni eiga o mi ni ikimasen ka.', 'B ơi, mai cùng đi xem phim không?'],
        ['B', 'b', 'あしたですか。あしたは ちょっと……。', 'Ashita desu ka. Ashita wa chotto…….', 'Ngày mai à. Ngày mai thì hơi …'],
        ['A', 'a', 'じゃ、あさっては どうですか。', 'Ja, asatte wa dou desu ka.', 'Vậy ngày kia thì sao?'],
        ['B', 'b', 'あさっては いいですよ。', 'Asatte wa ii desu yo.', 'Ngày kia được đó.'],
    ]),
    DL('Hẹn nơi — chọn quán nhậu (slide ghi Hoa Lac, mình viết lại)', [
        ['A', 'a', '{週末|しゅうまつ}、のみに いきませんか。', 'Shuumatsu, nomi ni ikimasen ka.', 'Cuối tuần đi uống không?'],
        ['B', 'b', 'いいですね。どこへ いきますか。', 'Ii desu ne. Doko e ikimasu ka.', 'Hay đấy. Đi đâu?'],
        ['A', 'a', 'Hoa Lac の いざかやは どうですか。', 'Hoa Lac no izakaya wa dou desu ka.', 'Quán nhậu ở Hòa Lạc thì sao?'],
        ['B', 'b', 'いいですね。そうしましょう。', 'Ii desu ne. Sou shimashou.', 'Hay đấy. Cứ vậy nhé.'],
    ]),
    {
      t: 'note',
      title: 'Cách nhớ & lỗi hay mắc',
      items: [
        '**Trả lời 3 kiểu**: **いいですよ／だいじょうぶです** (được) · **ちょっと……** (không tiện) · **そうしましょう** (đồng ý hẳn).',
        '**あした／あさって** đi với は khi bạn bị đề xuất: あさっては どうですか → あさっては いいですよ (nhắc lại "あさって" + は).',
        '**だいじょうぶです** = ổn / được (đồng ý), khác nghĩa "không sao" khi xin lỗi.',
        'Hỏi hẹn đầy đủ: **いつ** (khi nào) → **どこ** (ở đâu) → **なんじ** (mấy giờ). Cô yêu cầu đủ ba câu khi đóng vai.',
      ],
    },

    /* ── チャレンジ 4 ── */
    { t: 'h', text: 'チャレンジ 4 — 「６時ごろは どうですか」・ね  ·  ポイント 59' },
    {
      t: 'p',
      text: 'Slide: **A：じゃ、にちようび なんじに あいますか。B：６じごろは どうですか。A：６じですね。わかりました。** Cô giải thích **ね** qua hai tình huống: (1) **あついですね。…そうですね。** = thông tin người nghe cũng biết → ね xin đồng tình; (2) **いま なんじですか。5じです。5じですね。** = nhắc lại để **xác nhận**.',
    },
    {
      t: 'table',
      caption: 'ね và よ — slide tổng hợp so sánh (câu mẫu 12 giờ)',
      head: ['Câu', 'Nghĩa', 'Chức năng'],
      rows: [
        ['もう 12じ**ですね**。', '12 giờ rồi nhỉ.', '**ね**: kêu gọi sự đồng tình / xác nhận thông tin'],
        ['もう 12じ**ですよ**。', '12 giờ rồi đấy.', '**よ**: đưa thông tin mới / nhấn mạnh'],
        ['もう 12じ**ですか**。', '12 giờ rồi à?', '**か**: hỏi, ngạc nhiên'],
        ['もう 12じですが……', '12 giờ rồi nhưng…', '**が**: mở đầu một ý tiếp theo'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('なんじに あいますか。…６じごろは どうですか。…６じですね。わかりました。', 'Nanji ni aimasu ka. …Rokuji goro wa dou desu ka. …Rokuji desu ne. Wakarimashita.', 'Mấy giờ gặp? …Khoảng 6 giờ thì sao? …6 giờ nhé. Mình hiểu rồi.'),
        E('あついですね。…そうですね。', 'Atsui desu ne. …Sou desu ne.', 'Nóng nhỉ. …Ừ nhỉ.'),
        E('いま なんじですか。…５じです。…５じですね。', 'Ima nanji desu ka. …Goji desu. …Goji desu ne.', 'Mấy giờ rồi? …5 giờ. …5 giờ nhỉ (để chắc).'),
      ],
    },
    {
      t: 'note',
      title: 'ごろ và ね — cách nhớ',
      items: [
        '**ごろ** đi sau **thời điểm** (6じごろ = khoảng 6 giờ); **ぐらい/くらい** đi sau **thời lượng** (1じかんぐらい = khoảng 1 tiếng). Đừng nhầm.',
        '**ね** lên giọng nhẹ = hỏi xác nhận; xuống giọng = đồng tình. Cả hai đều lịch sự.',
        '**わかりました** = "mình hiểu rồi / chốt nhé" — câu chốt sau khi hẹn xong.',
        'Không nói ~~６じですよ~~ khi bạn chỉ **nhắc lại** giờ người kia vừa nói — dùng **ね**.',
      ],
    },

    /* ── 5 tranh ── */
    { t: 'h', text: 'Hội thoại 5 tranh (会話練習) — nối thành một cuộc hẹn trọn vẹn' },
    DL('Cô chia 5 tranh: rủ → hỏi đã ăn chưa → rủ đi quán → hẹn ngày → hẹn giờ', [
        ['A', 'a', 'いっしょに ごはんを たべませんか。', 'Issho ni gohan o tabemasen ka.', '(① Rủ) Cùng ăn cơm không?'],
        ['B', 'b', 'いいですね。{何|なに}を たべますか。', 'Ii desu ne. Nani o tabemasu ka.', 'Hay đấy. Ăn gì?'],
        ['A', 'a', 'もう おこのみやきを たべましたか。', 'Mou okonomiyaki o tabemashita ka.', '(② Hỏi đã ăn chưa)'],
        ['B', 'b', 'いいえ、まだです。', 'Iie, mada desu.', 'Chưa.'],
        ['A', 'a', 'しんじゅくに おいしい おこのみやきの みせが ありますよ。いっしょに いきませんか。', 'Shinjuku ni oishii okonomiyaki no mise ga arimasu yo. Issho ni ikimasen ka.', '(③ Báo tin bằng よ + rủ) Ở Shinjuku có tiệm ngon đó, cùng đi không?'],
        ['B', 'b', 'いいですね。そうしましょう。', 'Ii desu ne. Sou shimashou.', 'Hay đấy. Cứ vậy.'],
        ['B', 'b', 'いつ いきますか。', 'Itsu ikimasu ka.', '(④ Hỏi ngày)'],
        ['A', 'a', 'どようびは どうですか。', 'Doyoubi wa dou desu ka.', 'Thứ Bảy thì sao?'],
        ['B', 'b', 'どようびは ちょっと……。にちようびは どうですか。', 'Doyoubi wa chotto……. Nichiyoubi wa dou desu ka.', 'Thứ Bảy thì hơi … Chủ Nhật thì sao?'],
        ['A', 'a', 'にちようびは いいです。', 'Nichiyoubi wa ii desu.', 'Chủ Nhật được.'],
        ['B', 'b', 'なんじに あいますか。', 'Nanji ni aimasu ka.', '(⑤ Hẹn giờ)'],
        ['A', 'a', '６じは どうですか。', 'Rokuji wa dou desu ka.', '6 giờ thì sao?'],
        ['B', 'b', '６じですね。わかりました。', 'Rokuji desu ne. Wakarimashita.', '6 giờ nhé. Mình hiểu rồi.'],
    ]),
    {
      t: 'note',
      title: 'Cô hay hỏi gì khi gọi phát biểu (Slot 13)',
      items: [
        '"**もう 〇〇を 〜ましたか。**" — bạn trả lời **はい、もう～ました／いいえ、まだです** (không dùng ませんでした).',
        '"**いつ いきますか。／なんじに あいますか。／どこで あいますか。**" — trả lời bằng **N は どうですか** và **ね** xác nhận.',
        '"**〇〇は どうですか**" mà bạn không tiện → **すみません、〇〇は ちょっと……。〇〇は どうですか。** (đề xuất lại).',
        'Đóng vai cả cuộc hẹn trong 1 phút: rủ → hỏi → ngày → giờ → わかりました.',
      ],
    },
    {
      t: 'mcq',
      id: 'slot13-luyen',
      title: 'Luyện — もう/まだ · よ · どうですか · ね (có giải thích)',
      items: [
        { q: '「もう おこのみやきを たべましたか。」「いいえ、（　）。」', options: ['まだです', 'たべません', 'もう', 'たべませんでした'], correct: 0, why: 'Trả lời "chưa" cho câu もう～ましたか = **まだです**. (ポイント 57)' },
        { q: '「ラーメンは おいしい（　）。いっしょに たべませんか。」(thông báo thông tin mới)', options: ['よ', 'ね', 'か', 'を'], correct: 0, why: '**よ** = báo tin người nghe chưa biết. (ポイント 60)' },
        { q: '「あついです（　）。」「そうですね。」', options: ['ね', 'よ', 'が', 'を'], correct: 0, why: '**ね** xin đồng tình. (ポイント 59)' },
        { q: '「あしたは ちょっと……。」「じゃ、あさっては（　）。」', options: ['どうですか', 'なんですか', 'だれですか', 'どこですか'], correct: 0, why: '**N は どうですか** = đề xuất lại ngày khác. (ポイント 58)' },
        { q: '「なんじに あいますか。」「６じ（　）は どうですか。」', options: ['ごろ', 'ぐらい', 'ごと', 'から'], correct: 0, why: '**ごろ** sau thời điểm; ぐらい sau thời lượng.' },
        { q: '「もう カラオケに いきましたか。」「はい、（　）。」', options: ['もう いきました', 'まだ いきました', 'いきませんでした', 'いきません'], correct: 0, why: 'Trả lời "rồi" = **はい、もう V ました**.' },
        { q: '「６じですね。（　）。」(chốt cuộc hẹn)', options: ['わかりました', 'ざんねんです', 'まだです', 'すみません'], correct: 0, why: 'Chốt giờ: **わかりました**. ざんねんです = tiếc quá (khi bị từ chối).' },
        { q: 'Trong câu "ぜひ ～"、～ phải là:', options: ['たべたいです', 'たべました', 'たべません', 'おいしいです'], correct: 0, why: '**ぜひ** đi với muốn/mong: **ぜひ V たいです / ぜひ V てください / ぜひ V ましょう**.' },
      ],
    },
    {
      t: 'quiz',
      id: 'slot13-luyen-dich',
      title: 'Luyện dịch Việt → Nhật',
      kind: 'translate',
      grammar: 'もう V ましたか · まだです · N は どうですか · ね · よ',
      items: [
        { q: 'Bạn đã xem phim đó chưa? — Chưa.', answers: V('もう{映画|えいが}を{見|み}ましたか。いいえ、まだです。', 'もうえいがをみましたか。いいえ、まだです。'), hint: 'もう · まだ' },
        { q: 'Ngày kia thì sao?', answers: V('あさってはどうですか。'), hint: 'どうですか' },
        { q: 'Tiệm này ngon lắm đó.', answers: V('このみせはおいしいですよ。', 'この{店|みせ}はおいしいですよ。'), hint: 'よ · おいしい' },
        { q: '6 giờ nhé. Mình hiểu rồi.', answers: V('{6時|ろくじ}ですね。わかりました。', 'ろくじですね。わかりました。', '６じですね。わかりました。'), hint: 'ね · わかりました' },
        { q: 'Cuối tuần cùng đi ăn okonomiyaki không?', answers: V('{週末|しゅうまつ}、いっしょにおこのみやきを{食|た}べにいきませんか。', 'しゅうまつ、いっしょにおこのみやきをたべにいきませんか。'), hint: 'おこのみやき · たべに' },
      ],
    },
  ],
};
/* ═══════════════════════ SLOT 14 — Kanji 6 · Ôn tập L6 · Chữa B6 ═══════════════════════ */

const SLOT_14: Lesson = {
  id: 'slot-14-kanji6-on-l6-chua-b6',
  kind: 'review',
  title: 'Slot 14 — Chữ Hán bài 6 (15 chữ) · ôn tập Bài 6 · chữa bài tập Bài 6',
  goal: 'Đọc đúng 15 chữ Hán bài 6 trên slide cùng từ ghép của cô, nhớ lại cả 13 ポイント của Bài 6 bằng bảng ôn một trang, và biết cô chữa bài tập bài 6 theo kiểu gì.',
  minutes: 55,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 14 cô dạy gì (theo slide)',
      items: [
        '**Slide 漢字たまご 第6回目** — 15 chữ: **今 来 帰 会 社 聞 読 書 話 寺 言 貝 田 力 門**. Mỗi chữ một slide: chữ to, Hán Việt, âm On (katakana) · âm Kun (hiragana), và 2 từ ghép cô viết.',
        '**Ôn tập Bài 6**: rủ/từ chối · に/で + あります · đếm ～枚 · so sánh (いちばん / どちら / より) · もう/まだ · どうですか · ね/よ.',
        '**Chữa bài tập Bài 6** — slide chỉ ghi tiêu đề (cô chữa miệng từ file BT từ vựng + ngữ pháp). Đáp án và giải thích chi tiết ở bài **"BT từ vựng & ngữ pháp Bài 6–7"** trong mục này.',
      ],
    },

    { t: 'h', text: 'Phần 1 — 15 chữ Hán bài 6: bảng tra theo thứ tự slide' },
    {
      t: 'table',
      caption: 'Cô dạy theo kiểu: chữ → Hán Việt → On/Kun → từ ghép. (✍ = nên viết · 👁 = chỉ cần nhận mặt)',
      head: ['Chữ', 'Hán Việt', 'On (katakana)', 'Kun (hiragana)', 'Nghĩa', 'Mức'],
      rows: [
        ['今', 'Kim', 'コン', 'いま', 'bây giờ, nay', '✍'],
        ['来', 'Lai', 'ライ', 'き・ます / く・る', 'đến, tương lai', '✍'],
        ['帰', 'Quy', 'キ', 'かえ・ります', 'trở về', '👁'],
        ['会', 'Hội', 'カイ', 'あ・います', 'gặp gỡ, hội', '✍'],
        ['社', 'Xã', 'シャ', '—', 'công ty, đền thần đạo', '✍'],
        ['聞', 'Văn', 'ブン', 'き・きます', 'nghe, hỏi', '👁'],
        ['読', 'Độc', 'ドク', 'よ・みます', 'đọc', '👁'],
        ['書', 'Thư', 'ショ', 'か・きます', 'viết', '👁'],
        ['話', 'Thoại', 'ワ', 'はな・します / はなし', 'nói chuyện, câu chuyện', '👁'],
        ['寺', 'Tự', 'ジ', 'てら', 'chùa', '✍'],
        ['言', 'Ngôn', 'ゲン / ゴン', 'い・います', 'nói', '👁'],
        ['貝', 'Bối', '—', 'かい', 'con sò', '✍'],
        ['田', 'Điền', 'デン', 'た', 'ruộng', '✍'],
        ['力', 'Lực', 'リョク / リキ', 'ちから', 'sức lực', '✍'],
        ['門', 'Môn', 'モン', '—', 'cánh cổng', '✍'],
      ],
    },
    {
      t: 'table',
      caption: 'Từ ghép cô viết trên slide — nhóm "thời gian" (今 来)',
      head: ['Từ', 'Hiragana', 'Romaji', 'Nghĩa'],
      rows: [
        ['{今週|こんしゅう}', 'こんしゅう', 'konshuu', 'tuần này'],
        ['{今月|こんげつ}', 'こんげつ', 'kongetsu', 'tháng này'],
        ['{今年|ことし}', 'ことし', 'kotoshi', 'năm nay'],
        ['{今日|きょう}', 'きょう', 'kyou', 'hôm nay'],
        ['{今|いま}', 'いま', 'ima', 'bây giờ'],
        ['{来週|らいしゅう}', 'らいしゅう', 'raishuu', 'tuần sau'],
        ['{来月|らいげつ}', 'らいげつ', 'raigetsu', 'tháng sau'],
        ['{来年|らいねん}', 'らいねん', 'rainen', 'năm sau'],
        ['{来日|らいにち}', 'らいにち', 'rainichi', 'đến Nhật (khách nước ngoài)'],
        ['{来|き}ます', 'きます', 'kimasu', 'đến'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm "đi – gặp – công ty" (帰 会 社)',
      head: ['Từ', 'Hiragana', 'Romaji', 'Nghĩa'],
      rows: [
        ['{帰|かえ}ります', 'かえります', 'kaerimasu', 'về'],
        ['{日帰|ひがえ}り', 'ひがえり', 'higaeri', 'đi về trong ngày'],
        ['{帰国|きこく}', 'きこく', 'kikoku', 'về nước'],
        ['{会|あ}います', 'あいます', 'aimasu', 'gặp'],
        ['{飲|の}み{会|かい}', 'のみかい', 'nomikai', 'tiệc nhậu'],
        ['{国会|こっかい}', 'こっかい', 'kokkai', 'quốc hội'],
        ['{会見|かいけん}', 'かいけん', 'kaiken', 'họp báo, cuộc phỏng vấn'],
        ['{会社|かいしゃ}', 'かいしゃ', 'kaisha', 'công ty'],
        ['{社会|しゃかい}', 'しゃかい', 'shakai', 'xã hội'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm "nghe – đọc – viết – nói" (聞 読 書 話 言)',
      head: ['Từ', 'Hiragana', 'Romaji', 'Nghĩa'],
      rows: [
        ['{聞|き}きます', 'ききます', 'kikimasu', 'nghe, hỏi'],
        ['{読|よ}みます', 'よみます', 'yomimasu', 'đọc'],
        ['{読|よ}み{物|もの}', 'よみもの', 'yomimono', 'tài liệu đọc'],
        ['{読書|どくしょ}', 'どくしょ', 'dokusho', 'đọc sách'],
        ['{書|か}きます', 'かきます', 'kakimasu', 'viết'],
        ['{書|か}き{物|もの}', 'かきもの', 'kakimono', 'văn bản/đồ viết'],
        ['{話|はな}します', 'はなします', 'hanashimasu', 'nói chuyện'],
        ['{話|はなし}', 'はなし', 'hanashi', 'câu chuyện'],
        ['{会話|かいわ}', 'かいわ', 'kaiwa', 'hội thoại'],
        ['{言|い}います', 'いいます', 'iimasu', 'nói'],
        ['{言語|げんご}', 'げんご', 'gengo', 'ngôn ngữ'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm "địa điểm – sức mạnh" (寺 貝 田 力 門)',
      head: ['Từ', 'Hiragana', 'Romaji', 'Nghĩa'],
      rows: [
        ['お{寺|てら}', 'おてら', 'otera', 'chùa'],
        ['{貝|かい}', 'かい', 'kai', 'con sò'],
        ['{田|た}んぼ', 'たんぼ', 'tanbo', 'ruộng lúa'],
        ['{水田|すいでん}', 'すいでん', 'suiden', 'ruộng nước'],
        ['{力|ちから}', 'ちから', 'chikara', 'sức lực'],
        ['{水力|すいりょく}', 'すいりょく', 'suiryoku', 'thủy lực (thủy điện)'],
        ['{火力|かりょく}', 'かりょく', 'karyoku', 'hỏa lực / nhiệt điện'],
        ['{大学|だいがく}の{門|もん}', 'だいがくの もん', 'daigaku no mon', 'cổng trường đại học'],
        ['{学校|がっこう}の{門|もん}', 'がっこうの もん', 'gakkou no mon', 'cổng trường'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ từng chữ (liên kết với hình) & lỗi hay mắc',
      items: [
        '**今 (kim, ima)**: "một mái nhà che hiện tại". Từ cần thuộc: 今日, 今週, 今月, 今年 (**ことし**, không đọc こんねん).',
        '**来 (lai, kuru)**: cây lúa mì bên ngoài đang tới. 来**ます** = きます; 来**週** = らいしゅう. **Đừng nhầm** 来 (らい) với 未.',
        '**帰 (quy, kaeru)**: 巾 + chổi + bước chân → "đi trở về dọn nhà". **帰る ≠ 変える**.',
        '**会 (hội, au)**: nhiều người gặp nhau dưới một mái. **会う** gặp (người); **会社** = công ty ("nơi mọi người họp").',
        '**社 (xã)**: 示 (bàn thờ) + 土 (đất) = đền thờ → **công ty / xã hội**.',
        '**聞 (văn)**: 門 + 耳 (cái tai áp vào cánh cổng) = nghe lén → **nghe / hỏi**. **聞く** = nghe, và **hỏi** (先生に聞きます).',
        '**読 (độc)** có 言 (lời) bên trái; **書 (thư)** là tay cầm bút + 日; **話 (thoại)** cũng có 言. **言 → 読 → 話 → 語**: bộ 言 báo hiệu "lời nói".',
        '**寺 (tự)** = chùa; **持 (cầm)** và **時 (giờ)** có 寺 bên phải nhưng nghĩa khác — đừng đọc nhầm khi đọc câu.',
        '**貝 (bối)** là gốc của 買 (mua), 貸 (cho mượn): "vỏ sò = tiền ngày xưa".',
        '**田 (điền)**: ô vuông ruộng. **力 (lực)**: cánh tay gân guốc. **門 (môn)**: cổng hai cánh.',
      ],
    },
    {
      t: 'readkanji',
      id: 'slot14-doc-kanji6',
      title: 'Tự thử — đọc KHÔNG furigana (chữ Hán bài 6)',
      note: 'Cô thi chữ Hán dạng đọc hiragana. Đọc to, bấm xem đáp án, tự chấm.',
      items: [
        { text: '{今週|こんしゅう}の{土曜日|どようび}、{会社|かいしゃ}で{会議|かいぎ}があります。', ro: 'Konshuu no doyoubi, kaisha de kaigi ga arimasu.', vi: 'Thứ Bảy tuần này công ty có cuộc họp.' },
        { text: '{来週|らいしゅう}、{友達|ともだち}に{会|あ}います。', ro: 'Raishuu, tomodachi ni aimasu.', vi: 'Tuần sau tôi gặp bạn.' },
        { text: '{来年|らいねん}、{日本|にほん}へ{来|き}ます。', ro: 'Rainen, Nihon e kimasu.', vi: 'Năm sau tôi đến Nhật.' },
        { text: '{今日|きょう}は{早|はや}く{帰|かえ}ります。', ro: 'Kyou wa hayaku kaerimasu.', vi: 'Hôm nay tôi về sớm.' },
        { text: '{先生|せんせい}の{話|はなし}を{聞|き}きます。', ro: 'Sensei no hanashi o kikimasu.', vi: 'Tôi nghe lời thầy cô nói.' },
        { text: '{毎日|まいにち}{読書|どくしょ}を{読|よ}みます。', ro: 'Mainichi dokusho o yomimasu.', vi: 'Mỗi ngày tôi đọc sách.', },
        { text: '{手紙|てがみ}を{書|か}きます。', ro: 'Tegami o kakimasu.', vi: 'Tôi viết thư.' },
        { text: '{日本語|にほんご}で{会話|かいわ}をします。', ro: 'Nihongo de kaiwa o shimasu.', vi: 'Tôi hội thoại bằng tiếng Nhật.' },
        { text: 'お{寺|てら}の{門|もん}は{大|おお}きいです。', ro: 'Otera no mon wa ookii desu.', vi: 'Cổng chùa to.' },
        { text: '{水力|すいりょく}と{火力|かりょく}の{話|はなし}です。', ro: 'Suiryoku to karyoku no hanashi desu.', vi: 'Đó là chuyện về thủy điện và nhiệt điện.' },
        { text: '{田|た}んぼに{貝|かい}がいます。', ro: 'Tanbo ni kai ga imasu.', vi: 'Trong ruộng có con sò.' },
        { text: '{今年|ことし}は{社会|しゃかい}の{勉強|べんきょう}をします。', ro: 'Kotoshi wa shakai no benkyou o shimasu.', vi: 'Năm nay tôi học môn xã hội.' },
      ],
    },
    {
      t: 'mcq',
      id: 'slot14-kanji-mcq',
      title: 'Luyện chữ Hán bài 6 — chọn cách đọc (kèm giải thích)',
      items: [
        { q: '{今年|ことし}→ nghĩa?', options: ['hôm nay', 'năm nay', 'năm sau', 'tuần này'], correct: 1, why: '今年 **ことし** = năm nay. Đọc đặc biệt.' },
        { q: '「来月」の読み方は？', options: ['らいつき', 'らいげつ', 'こんげつ', 'きげつ'], correct: 1, why: '来月 = **らいげつ** (tháng sau). こんげつ = 今月.' },
        { q: '「会社」の読み方は？', options: ['かいしゃ', 'かいじゃ', 'あいしゃ', 'かいせい'], correct: 0, why: '会社 = **かいしゃ** (công ty).' },
        { q: '「聞きます」の読み方は？', options: ['もんきます', 'ききます', 'みみます', 'ぶんきます'], correct: 1, why: '聞 kun **き**: き-きます.' },
        { q: '「読書」の読み方は？', options: ['どくしょ', 'よみしょ', 'どくがき', 'よみがき'], correct: 0, why: '読書 on-yomi **どくしょ** (đọc sách).' },
        { q: '「大学の門」の「門」は？', options: ['もん', 'かど', 'もう', 'とびら'], correct: 0, why: '門 = **もん** (cổng).' },
        { q: '「水田」→ nghĩa?', options: ['hồ nước', 'ruộng nước', 'nước ngọt', 'sông'], correct: 1, why: '水田 **すいでん** = ruộng nước.' },
        { q: '「言語」の読み方は？', options: ['ごんご', 'げんご', 'いごん', 'ことば'], correct: 1, why: '言語 **げんご** (ngôn ngữ). 言 on: ゲン / ゴン (ゴン trong 伝言, 言う…).' },
        { q: '{来日|らいにち}の意味は？', options: ['về nước', 'đến Nhật', 'đi ngày mai', 'ngày sau'], correct: 1, why: '来日 = **người nước ngoài đến Nhật**. 帰国 = về nước.' },
        { q: '「日帰り」の読み方は？', options: ['にちかえり', 'ひがえり', 'ひきかえり', 'にっき'], correct: 1, why: '日帰り **ひがえり** = đi về trong ngày.' },
      ],
    },
    {
      t: 'write',
      id: 'slot14-viet-kanji6',
      title: 'Tập viết (✍) — chữ Hán bài 6',
      chars: ['今', '来', '会', '社', '田', '力', '門', '寺'],
      note: 'Viết theo thứ tự nét; nhớ 来 có 7 nét (không phải 6).',
    },

    { t: 'h', text: 'Phần 2 — Ôn tập Bài 6 một trang (13 ポイント)' },
    {
      t: 'table',
      caption: 'Bảng ôn nhanh để tự hỏi mình trước khi làm bài tập',
      head: ['PT', 'Mẫu', 'Ví dụ', 'Nhớ'],
      rows: [
        ['48', 'V ませんか', 'いっしょに ごはんを たべませんか。', 'rủ lịch sự (không phải phủ định)'],
        ['49', 'V ましょう', 'いいですね。たべましょう。', 'nhận lời / hô hào'],
        ['50', 'N が あります', 'あした、やくそくが あります。', 'có hẹn/việc/sự kiện — dùng が'],
        ['51', 'N1 で N2 が あります', 'ハノイで しあいが あります。', 'sự kiện diễn ra ở đâu → で'],
        ['52', 'N が ～まい あります', 'チケットが ２まい あります。', 'vật mỏng 枚, vật chung つ'],
        ['53', 'N1 で N2 が いちばん A', 'くだもので りんごが いちばん すき。', 'nhất — で chỉ phạm vi'],
        ['54', 'N1 は N2 より A', 'ひこうきは しんかんせんより はやい。', 'hơn'],
        ['55', 'N1 と N2 と どちらが A', 'にくと さかなと どちらが すきですか。', 'hỏi chọn 1 trong 2'],
        ['56', 'N の ほうが A / どちらも A', 'さかなの ほうが すきです。', 'chọn một / cả hai'],
        ['57', 'もう V ましたか — まだです', 'もう たべましたか。まだです。', 'chưa → まだです'],
        ['58', 'N は どうですか', 'あさっては どうですか。', 'đề xuất ngày/nơi'],
        ['59', '～ね', '６じですね。', 'xác nhận/đồng tình'],
        ['60', '～よ', 'おいしいですよ。', 'báo thông tin mới'],
      ],
    },
    {
      t: 'note',
      title: 'Cô hay hỏi gì khi chữa bài Bài 6 (Slot 14)',
      items: [
        '"**これは なんですか。**" — chỉ chữ Hán: bạn đọc từ + nghĩa (今日, 来月, 会社…).',
        'Gọi bạn lên chữa câu **dịch Việt → Nhật** (so sánh, đếm ～枚, hẹn giờ) → phải nói đúng cả trợ từ **で/に/が/の**.',
        'Hỏi lỗi hay gặp: "**ませんか と ますか の ちがいは？**" (rủ ≠ hỏi), "**まだです と ませんでした**".',
        'Chữa bài từ vựng: chọn **ぜひ** đúng chỗ (ぜひ + たいです/ください/ましょう), chọn **どちら / どちらも**.',
      ],
    },
  ],
};

/* ═══════════════════════ SLOT 15 — Ôn Kanji 6 · L7.1 道がわかりません ═══════════════════════ */

const SLOT_15: Lesson = {
  id: 'slot-15-on-kanji6-l7-1',
  kind: 'grammar',
  title: 'Slot 15 — Ôn chữ Hán bài 6 · Bài 7.1「道がわかりません」: vị trí, あります/います, hỏi đường',
  goal: 'Nói và hỏi vị trí đúng mẫu của cô: N1は N2に あります／います · N1に N2が あります／います + từ chỉ vị trí (ポイント 61–62).',
  minutes: 55,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 15 cô dạy gì',
      items: [
        '**Ôn chữ Hán bài 6**: cô chiếu hiragana → bạn nhớ chữ Hán (今週, 来年, 会社, 話します…).',
        '**Bài 7 — 友達の家で** · mục tiêu **行動目標**: nói ngắn gọn về hoàn cảnh xung quanh; nhờ vả, đề xuất và cùng hành động.',
        '**ST 1 「道が分かりません」**: khi bị lạc, hỏi nơi muốn đến ở đâu và nói mình đang ở đâu.',
        '**Từ mới**: かいさつ · こうばん · じどうはんばいき · バスてい · ポスト · はな + **từ chỉ vị trí**.',
        '**チャレンジ 1**: ～は ～に あります (đồ vật). **チャレンジ 2**: ～は ～に います (người/con vật). **チャレンジ 3**: ～に ～が あります／います.',
      ],
    },

    { t: 'h', text: 'Phần 1 — Ôn chữ Hán bài 6 (slide 漢字 6 課)' },
    {
      t: 'p',
      text: 'Slide ghép **hiragana ↔ chữ Hán** thành hai cột: cô đọc "かいしゃ", cả lớp chọn **会社**; hoặc cô chiếu 社会 để đọc. Những ghép bạn phải nhận ra ngay trong 2 giây:',
    },
    {
      t: 'table',
      caption: 'Danh sách đủ trên slide — chữ ↔ cách đọc (✓ nên nhớ cả hai hướng)',
      head: ['Nhóm', 'Từ', 'Đọc'],
      rows: [
        ['Động từ', '来ます / 帰ります / 会います / 言います', 'きます / かえります / あいます / いいます'],
        ['Động từ', '話します / 聞きます / 書きます / 読みます', 'はなします / ききます / かきます / よみます'],
        ['Thời gian', '今週 / 今月 / 今年 / 今日', 'こんしゅう / こんげつ / ことし / きょう'],
        ['Thời gian', '来月 / 来年 / 来日', 'らいげつ / らいねん / らいにち'],
        ['Từ ghép', '会社 / 社会 / 会話', 'かいしゃ / しゃかい / かいわ'],
        ['Từ ghép', '読書 / 読み物 / 書き物', 'どくしょ / よみもの / かきもの'],
        ['Từ ghép', '帰国 / 言語', 'きこく / げんご'],
        ['Từ ghép', '水田 / 水力 / 火力', 'すいでん / すいりょく / かりょく'],
        ['Chữ lẻ', '貝 / 田 / 力 / 門 / 寺 / 今', 'かい / た / ちから / もん / てら / いま'],
      ],
    },
    {
      t: 'note',
      title: 'Lưu ý khi thấy slide',
      items: [
        'Slide có một ô viết **"聞き物 ききもの"**; chữ này không phải từ thông dụng. Nên học đúng **読み物 (よみもの)** và **書き物 (かきもの)**. Nếu cô hỏi, bạn nói "ききもの" theo slide nhưng khi thi đừng dùng.',
        '**今日** (きょう), **今年** (ことし) đọc đặc biệt — thuộc lòng.',
      ],
    },

    { t: 'h', text: 'Phần 2 — Mở Bài 7: 行動目標 và ST 1 「道が分かりません」' },
    {
      t: 'note',
      title: 'Hiểu mục tiêu trên slide',
      items: [
        '**行動目標**: 周りの状況を簡単に友達に伝えることができる = **nói đơn giản cho bạn biết tình hình xung quanh**; また、何かを頼んだり提案したりしながら、一緒に行動することができる = **nhờ vả, đề xuất và cùng làm**.',
        '**ST 1**: 迷子になったとき、行きたい場所がどこにあるか質問したり、自分がどこにいるか言ったりすることができる。 = **Khi lạc đường, hỏi nơi cần đến ở đâu và nói mình đang ở đâu**.',
        'Câu hỏi nên chuẩn bị: **〜は どこに ありますか** (vật) và **〜は どこに いますか** (người). **あのう、すみません** để bắt chuyện, **ありがとうございます** để cảm ơn.',
      ],
    },
    {
      t: 'vocab',
      items: [
        { w: '{改札|かいさつ}', pos: 'Danh từ', ipa: 'kaisatsu', vi: 'cổng soát vé', ex: '{改札|かいさつ}の{前|まえ}で{会|あ}いましょう。', exRo: 'Kaisatsu no mae de aimashou.', exVi: 'Gặp nhau trước cổng soát vé nhé.' },
        { w: '{交番|こうばん}', pos: 'Danh từ', ipa: 'kouban', vi: 'đồn cảnh sát nhỏ (chốt công an)', ex: '{交番|こうばん}は{駅|えき}の{前|まえ}に あります。', exRo: 'Kouban wa eki no mae ni arimasu.', exVi: 'Đồn công an ở trước ga.' },
        { w: '{自動販売機|じどうはんばいき}', pos: 'Danh từ', ipa: 'jidouhanbaiki', vi: 'máy bán hàng tự động', ex: '{自動販売機|じどうはんばいき}で ジュースを{買|か}います。', exRo: 'Jidouhanbaiki de juusu o kaimasu.', exVi: 'Tôi mua nước ở máy bán hàng tự động.' },
        { w: 'バス{停|てい}', pos: 'Danh từ', ipa: 'basutei', vi: 'trạm xe buýt', ex: 'バス{停|てい}は あそこに あります。', exRo: 'Basutei wa asoko ni arimasu.', exVi: 'Trạm xe buýt ở đằng kia.' },
        { w: 'ポスト', pos: 'Danh từ', ipa: 'posuto', vi: 'hòm thư', ex: 'ポストは {郵便局|ゆうびんきょく}の{前|まえ}に あります。', exRo: 'Posuto wa yuubinkyoku no mae ni arimasu.', exVi: 'Hòm thư ở trước bưu điện.' },
        { w: '{花|はな}', pos: 'Danh từ', ipa: 'hana', vi: 'hoa', ex: '{公園|こうえん}に{花|はな}が あります。', exRo: 'Kouen ni hana ga arimasu.', exVi: 'Ở công viên có hoa.' },
      ],
    },
    {
      t: 'table',
      caption: 'Từ chỉ vị trí (slide có hình: trên/dưới/sau/trước/trong/ngoài/trái/phải/cạnh/giữa/gần)',
      head: ['Từ', 'Hiragana', 'Romaji', 'Nghĩa', 'Ghi nhớ'],
      rows: [
        ['{上|うえ}', 'うえ', 'ue', 'trên', 'cạnh/ở trên bề mặt'],
        ['{下|した}', 'した', 'shita', 'dưới', 'ngược với うえ'],
        ['{前|まえ}', 'まえ', 'mae', 'phía trước', 'ngược với うしろ'],
        ['{後|うし}ろ', 'うしろ', 'ushiro', 'phía sau', ''],
        ['{中|なか}', 'なか', 'naka', 'bên trong', 'cả vật rỗng như hộp, phòng'],
        ['{外|そと}', 'そと', 'soto', 'bên ngoài', 'ngược với なか'],
        ['{右|みぎ}', 'みぎ', 'migi', 'bên phải', ''],
        ['{左|ひだり}', 'ひだり', 'hidari', 'bên trái', ''],
        ['{横|よこ}／{隣|となり}', 'よこ／となり', 'yoko / tonari', 'bên cạnh', 'となり = cùng loại sát kề (nhà, phòng); よこ = bên hông'],
        ['{近|ちか}く', 'ちかく', 'chikaku', 'gần đây', ''],
        ['{間|あいだ}', 'あいだ', 'aida', 'ở giữa (hai vật)', 'luôn có A と B の あいだ'],
      ],
    },

    /* ── チャレンジ 1 ── */
    { t: 'h', text: 'チャレンジ 1 — 「たいようぎんこうは あそこに あります」  ·  ポイント 61 (đồ vật)' },
    {
      t: 'p',
      text: 'Slide: **A：あのう、すみません。たいようぎんこうは どこに ありますか。B：たいようぎんこうは あそこに あります。** Cô viết hai khung: **(1) [ở đâu] [có] [cái gì] ～に ～が あります** và **(2) [cái gì] [có/tồn tại] [ở đâu] ～は ～に あります**. Chú thích: "**Trợ từ に: chỉ sự tồn tại ở đâu đó của đồ vật**".',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1 は N2（nơi）に あります。',
          vi: 'N1 ở N2. N1 là chủ đề (cái đang nói tới), N2 là vị trí. Hỏi: N1 は どこに ありますか。',
          examples: [
            E('たいようぎんこうは あそこに あります。', 'Taiyou ginkou wa asoko ni arimasu.', 'Ngân hàng Taiyou ở đằng kia.'),
            E('ほんやは えきの まえに あります。', 'Honya wa eki no mae ni arimasu.', 'Hiệu sách ở trước ga.'),
            E('ほんやは パンやと レストランの あいだに あります。', 'Honya wa panya to resutoran no aida ni arimasu.', 'Hiệu sách ở giữa tiệm bánh và nhà hàng.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'N の + Từ chỉ vị trí (slide: Danh từ の Từ chỉ vị trí)',
      head: ['Danh từ', '＋ の ＋', 'Từ vị trí', 'Câu mẫu'],
      rows: [
        ['つくえ', 'の', 'うえ', 'ペンは つくえの うえに あります。'],
        ['かばん', 'の', 'なか', 'ほんは かばんの なかに あります。'],
        ['テレビ', 'の', 'まえ／うしろ', 'いすは テレビの まえに あります。'],
        ['ほんや', 'の', 'となり', 'はなやは ほんやの となりに あります。'],
        ['わたし', 'の', 'ちかく', 'こうばんは わたしの ちかくに あります。'],
      ],
    },
    {
      t: 'table',
      caption: 'Năm đáp án của slide "N の vị trí" (tình huống hình vẽ) — viết lại',
      head: ['#', 'Câu đáp', 'Romaji'],
      rows: [
        ['①', 'レストランの {前|まえ}に あります。', 'Resutoran no mae ni arimasu.'],
        ['②', 'はなやの となりに あります。', 'Hanaya no tonari ni arimasu.'],
        ['③', 'スーパーの {前|まえ}に あります。', 'Suupaa no mae ni arimasu.'],
        ['④', 'ゆうびんきょくの うしろに あります。', 'Yuubinkyoku no ushiro ni arimasu.'],
        ['⑤', 'ぎんこうと きっさてんの {間|あいだ}に あります。', 'Ginkou to kissaten no aida ni arimasu.'],
      ],
    },
    DL('Hỏi đường (slide 会話練習 — viết lại)', [
        ['A', 'a', 'あのう、すみません。こうばんは どこに ありますか。', 'Anou, sumimasen. Kouban wa doko ni arimasu ka.', 'Xin lỗi, đồn công an ở đâu ạ?'],
        ['B', 'b', 'あ、こうばんですか。あの ビルの うしろに ありますよ。', 'A, kouban desu ka. Ano biru no ushiro ni arimasu yo.', 'À, đồn công an à? Ở sau tòa nhà kia đấy.'],
        ['A', 'a', 'ありがとうございます。', 'Arigatou gozaimasu.', 'Cảm ơn bạn.'],
    ]),
    DL('Không thấy chỗ cần tìm (slide "えっ、どこですか")', [
        ['A', 'a', 'えっ、どこですか。', 'E, doko desu ka.', 'Hả, ở đâu ạ?'],
        ['B', 'b', 'あそこです。ほんやの となりに あります。', 'Asoko desu. Honya no tonari ni arimasu.', 'Ở đằng kia. Cạnh hiệu sách.'],
    ]),
    {
      t: 'note',
      title: 'Cách nhớ & lỗi hay mắc',
      items: [
        '**N に あります** — ở đây に chỉ **nơi tồn tại** (khác で). Sai: ~~ほんやは えきの まえで あります~~ ✗.',
        '**Thứ tự**: *Vật は Vị trí に あります.* Vị trí gồm *N + の + từ chỉ vị trí* (えき**の**まえ). **Không bỏ の**: ~~えき まえ~~ ✗.',
        '**あいだ** luôn cần HAI vật nối bằng と: **A と B の あいだ**. Sai: ~~ぎんこうの あいだ~~ ✗.',
        '**となり / よこ**: となり dùng cho vật cùng loại kề sát (ほんやの となり = cửa hàng cạnh), よこ = bên hông. Khi thi cả hai đều được.',
        'Hỏi đường lịch sự: **あのう、すみません。〜は どこに ありますか。** Nghe xong: **ありがとうございます**.',
        '**あそこ** = chỗ kia (xa cả hai). Khi chỉ gần bạn: **ここ**, gần người nghe: **そこ**.',
      ],
    },

    /* ── チャレンジ 2 ── */
    { t: 'h', text: 'チャレンジ 2 — 「コンビニの 前に います」  ·  ポイント 61 (người / con vật)' },
    {
      t: 'p',
      text: 'Slide: **A：どこに いますか。B：コンビニの まえに います。** Khung của cô: **(1) [Người/con vật] [có/tồn tại] [ở đâu] ～は ～に います** — "Trợ từ に: chỉ sự tồn tại ở đâu đó của **người/con vật**". Người/con vật dùng **います**, đồ vật dùng **あります**.',
    },
    {
      t: 'table',
      caption: 'あります ↔ います: chọn đúng',
      head: ['Chủ thể', 'Động từ', 'Ví dụ'],
      rows: [
        ['Đồ vật, cây cối, công trình, sự kiện', 'あります / ありません', 'ポストは えきの まえに あります。'],
        ['Người, động vật (có thể tự di chuyển)', 'います / いません', 'いぬは ソファーの うえに います。'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('じどうはんばいきの {前|まえ}に います。', 'Jidouhanbaiki no mae ni imasu.', '(Tôi) đang đứng trước máy bán hàng tự động.'),
        E('こうえんの {中|なか}に います。', 'Kouen no naka ni imasu.', 'Tôi đang ở trong công viên.'),
        E('こうえんの {前|まえ}に います。', 'Kouen no mae ni imasu.', 'Tôi đang ở trước công viên.'),
        E('こうばんの {横|よこ}に います。', 'Kouban no yoko ni imasu.', 'Tôi đang ở bên cạnh đồn công an.'),
        E('いぬは ソファーの うえに います。', 'Inu wa sofaa no ue ni imasu.', 'Con chó ở trên ghế sofa.'),
        E('ねこは いすの うしろに います。', 'Neko wa isu no ushiro ni imasu.', 'Con mèo ở sau cái ghế.'),
      ],
    },
    DL('Gọi điện tìm nhau (slide 会話練習 — viết lại)', [
        ['A', 'a', 'もしもし、Bさん、いま どこに いますか。', 'Moshimoshi, B-san, ima doko ni imasu ka.', 'A lô, B ơi, giờ bạn đang ở đâu?'],
        ['B', 'b', 'こうばんの まえに います。', 'Kouban no mae ni imasu.', 'Mình đang ở trước đồn công an.'],
        ['A', 'a', 'じゃ、そこへ いきます。', 'Ja, soko e ikimasu.', 'Vậy mình tới chỗ đó.'],
    ]),
    {
      t: 'note',
      title: 'Cách nhớ & lỗi hay mắc',
      items: [
        '**います** chỉ dùng cho **sinh vật di chuyển được**. Cây (木) và hoa (花) là **あります**: こうえんに はなが あります.',
        'Nói **về chính mình** bằng います: わたしは えきの まえに います (Tôi đang ở trước ga). Đây là câu trả lời khi bạn bị hỏi "どこに いますか" qua điện thoại.',
        '**もしもし** chỉ dùng khi **gọi điện**; mặt đối mặt dùng あのう/すみません.',
        '**そこへ いきます** = tôi đến chỗ đó (trợ từ へ cho hướng). Slide dùng để bắt đầu tới nơi bạn kia đang chờ.',
      ],
    },

    /* ── チャレンジ 3 ── */
    { t: 'h', text: 'チャレンジ 3 — 「ちかくに こうえんが あります」  ·  ポイント 62' },
    {
      t: 'p',
      text: 'Slide: **A：ちかくに なにが ありますか。B：ちかくに こうえんが あります。** Khung (2) của cô: **[ở đâu] [có/tồn tại] [ai/cái gì] — ～に ～が あります／います** — "Trợ từ に: chỉ sự tồn tại ở đâu đó của người hay đồ vật". Khác チャレンジ 1: ở đây cái **đang hỏi** là **"có gì?"** nên dùng **が**; cái đã biết dùng **は**.',
    },
    {
      t: 'table',
      caption: 'Hai khung (1) và (2) — cô vẽ đối chiếu trên cùng slide',
      head: ['Khung', 'Mẫu', 'Hỏi', 'Câu hỏi mẫu', 'Đáp'],
      rows: [
        ['(1) Vị trí → có gì', 'N1（nơi）に N2 が あります／います', 'なに／だれ', 'へやに なにが ありますか。', 'へやに テレビが あります。'],
        ['(2) Vật → ở đâu', 'N2 は N1（nơi）に あります／います', 'どこ', 'テレビは どこに ありますか。', 'テレビは へやに あります。'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('こうえんに {人|ひと}が たくさん います。', 'Kouen ni hito ga takusan imasu.', 'Trong công viên có rất nhiều người.'),
        E('にわに いぬが います。', 'Niwa ni inu ga imasu.', 'Ngoài vườn có con chó.'),
        E('かばんの なかに いぬが います。', 'Kaban no naka ni inu ga imasu.', 'Trong cặp có con chó.'),
        E('へやの なかに ちずが あります。', 'Heya no naka ni chizu ga arimasu.', 'Trong phòng có bản đồ.'),
        E('いえの そとに くるまが あります。', 'Ie no soto ni kuruma ga arimasu.', 'Ngoài nhà có ô tô.'),
        E('きょうしつに {先生|せんせい}と {学生|がくせい}が います。', 'Kyoushitsu ni sensei to gakusei ga imasu.', 'Trong lớp có thầy cô và sinh viên.'),
        E('ゆうびんきょくの {前|まえ}に ポストが あります。', 'Yuubinkyoku no mae ni posuto ga arimasu.', 'Trước bưu điện có hòm thư.'),
      ],
    },
    {
      t: 'table',
      caption: 'Hỏi – đáp theo slide (A hỏi, B đáp)',
      head: ['Hỏi', 'Đáp', 'Ghi chú'],
      rows: [
        ['きょうしつに だれが いますか。', 'だれも いません。', '**だれも + phủ định** = không có ai'],
        ['つくえの うえに なにが ありますか。', 'パソコンが あります。', ''],
        ['はこの なかに なにが ありますか。', 'なにも ありません。', '**なにも + phủ định** = không có gì'],
        ['ほんやの となりに なにが ありますか。', 'パンやが あります。', ''],
        ['かばんの なかに なにが ありますか。', '{日本語|にほんご}の {本|ほん}が あります。', 'một thứ'],
        ['', '{本|ほん}と ペンが あります。', 'hai thứ: **A と B**'],
        ['', '{本|ほん}や ペンや お{金|かね}などが あります。', 'liệt kê nhiều thứ: **A や B や C など**'],
        ['', '{何|なに}も ありません。', 'không có gì'],
      ],
    },
    {
      t: 'note',
      title: 'Liệt kê: と ↔ や ～など (slide cuối)',
      items: [
        '**A と B** = chỉ có hai thứ đó (đủ, liệt kê hết): ほんと ペンが あります.',
        '**A や B (など)** = **ví dụ** vài thứ trong nhiều: ほんや ペンや おかねなどが あります (còn có nữa). **など** = "vân vân" thêm cho chắc.',
        '**Sai**: ~~ほんや ペンが あります~~ khi chỉ 2 món → dùng と. Câu có や thường kết thúc bằng など (không bắt buộc).',
      ],
    },
    {
      t: 'note',
      title: 'Phủ định với từ nghi vấn (だれも / なにも)',
      items: [
        '**だれも + V ません** = không ai V. **なにも + V ません** = không gì cả. Với います/あります: **だれも いません／なにも ありません**.',
        '**Sai**: ~~だれも います~~ ✗ — だれも bắt buộc đi với phủ định.',
        'Hỏi "có ai ở đó không?" → **だれか いますか** (có ai không?) — mẫu mở rộng, thi chủ yếu dùng だれも.',
      ],
    },
    {
      t: 'table',
      caption: 'Ví dụ cô hay dùng: nhà bếp (slide 冷蔵庫の中 · ビール)',
      head: ['Mẫu', 'Câu', 'Nghĩa'],
      rows: [
        ['N1 に N2 が', '{冷蔵庫|れいぞうこ}の なかに ビールが あります。', 'Trong tủ lạnh có bia.'],
        ['N1 に なにが', '{冷蔵庫|れいぞうこ}の なかに なにが ありますか。', 'Trong tủ lạnh có gì?'],
        ['N2 は N1 に', 'ビールは {冷蔵庫|れいぞうこ}の なかに あります。', 'Bia ở trong tủ lạnh.'],
        ['N2 は どこ', 'ビールは どこに ありますか。', 'Bia ở đâu?'],
        ['N2 は N1 です', 'ビールは {冷蔵庫|れいぞうこ}の なかです。', 'Bia thì ở trong tủ lạnh. (rút gọn: bỏ に あります)'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ (は và が) & lỗi hay mắc',
      items: [
        '**が** = cái **mới, chưa biết** (đang hỏi "có gì?"). **は** = cái **đã biết, đang nói tới**. Bạn đã biết "bia" thì dùng ビール**は**; chưa biết trong tủ có gì → なに**が**.',
        'Hỏi người dùng **だれが**, vật dùng **なにが**: きょうしつに **だれが** いますか／つくえの うえに **なにが** ありますか.',
        '**Sai**: ~~へやに テレビは ありますか~~ khi chưa biết → hỏi **へやに テレビが ありますか** (có TV không?).',
        '**います/あります** phải khớp chủ thể: へやに テレビが あります／へやに アリさんが います.',
        '**たくさん** = nhiều; không dùng おおい trước động từ: ~~こうえんに ひとが おおい います~~ ✗ → たくさん います.',
      ],
    },
    {
      t: 'note',
      title: 'Cô hay hỏi gì khi gọi phát biểu (Slot 15)',
      items: [
        '"**〇〇は どこに ありますか。**" — dựa vào hình, trả lời bằng **N の vị trí に あります** (ほんやの となり, ぎんこうと きっさてんの あいだ…).',
        '"**〇〇さんは どこに いますか。**" — いま どこに いますか? → **N の vị trí に います**.',
        '"**かばんの なかに なにが ありますか。**" — trả lời thật về cặp của bạn: **ほんと ペンが あります** hoặc **なにも ありません**.',
        '"**きょうしつに だれが いますか。**" — nhìn quanh lớp và trả lời **〇〇さんと △△さんが います**.',
      ],
    },
    {
      t: 'mcq',
      id: 'slot15-luyen',
      title: 'Luyện — vị trí, あります/います, が/は (có giải thích)',
      items: [
        { q: 'ポストは えきの まえ（　）あります。', options: ['に', 'で', 'を', 'が'], correct: 0, why: 'Vị trí tồn tại → **に**. (ポイント 61)' },
        { q: 'いぬは ソファーの うえに（　）。', options: ['あります', 'います', 'ありません', 'いきます'], correct: 1, why: 'Con vật → **います**.' },
        { q: 'はなや（　）となりに ほんやが あります。', options: ['の', 'に', 'で', 'を'], correct: 0, why: 'N **の** Từ chỉ vị trí: はなや**の**となり.' },
        { q: '「きょうしつに だれが いますか。」「（　）いません。」', options: ['だれも', 'だれが', 'なにも', 'だれか'], correct: 0, why: 'Phủ định "không ai" = **だれも ～いません**.' },
        { q: '「かばんの なかに なにが ありますか。」「ほん（　）ペン（　）おかねなどが あります。」', options: ['や / や', 'と / と', 'が / が', 'も / も'], correct: 0, why: 'Liệt kê ví dụ + など → **や … や … など**.' },
        { q: 'ぎんこうと きっさてんの（　）に あります。', options: ['あいだ', 'うしろ', 'となり', 'まえ'], correct: 0, why: 'Hai vật A と B → **あいだ** (giữa).' },
        { q: '「こうえんの なかに（　）が たくさん います。」', options: ['ひと', 'ポスト', 'つくえ', 'バスてい'], correct: 0, why: 'います đi với người/con vật; ポスト・つくえ・バスてい là đồ vật (あります).' },
        { q: '「ビールは どこに ありますか。」「れいぞうこの（　）です。」', options: ['なか', 'そと', 'まえ', 'よこ'], correct: 0, why: 'Bia để trong tủ lạnh → **なか**. Mẫu rút gọn: Nは Nの なかです.' },
      ],
    },
    {
      t: 'quiz',
      id: 'slot15-luyen-dich',
      title: 'Luyện dịch Việt → Nhật',
      kind: 'translate',
      grammar: 'N1 は N2 に あります／います · N1 に N2 が あります／います',
      items: [
        { q: 'Đồn công an ở sau tòa nhà kia.', answers: V('{交番|こうばん}はあのビルのうしろにあります。', 'こうばんはあのビルの{後|うし}ろにあります。', '{交番|こうばん}はあのビルの{後|うし}ろにあります。'), hint: 'こうばん · うしろ · あります' },
        { q: 'Hiệu sách ở giữa tiệm bánh và nhà hàng.', answers: V('{本屋|ほんや}はパンやとレストランの{間|あいだ}にあります。', 'ほんやはパンやとレストランのあいだにあります。'), hint: 'あいだ' },
        { q: 'Tôi đang ở trước đồn công an.', answers: V('{交番|こうばん}の{前|まえ}にいます。', 'こうばんのまえにいます。', '{私|わたし}は{交番|こうばん}の{前|まえ}にいます。'), hint: 'います' },
        { q: 'Trong cặp có sách và bút.', answers: V('かばんの{中|なか}に{本|ほん}とペンがあります。', 'かばんのなかにほんとペンがあります。'), hint: 'と · が' },
        { q: 'Trong lớp không có ai.', answers: V('きょうしつにだれもいません。', '{教室|きょうしつ}にだれもいません。'), hint: 'だれも' },
        { q: 'Gần đây có công viên.', answers: V('{近|ちか}くに{公園|こうえん}があります。', 'ちかくにこうえんがあります。'), hint: 'ちかく' },
      ],
    },
  ],
};
/* ═══════════════════════ SLOT 16 — L7.2 パーティーの準備 (1) ═══════════════════════ */

const SLOT_16: Lesson = {
  id: 'slot-16-l7-2-chuan-bi-tiec',
  kind: 'grammar',
  title: 'Slot 16 — Bài 7.2「パーティーの準備」(1): chia nhóm động từ · thể て · ～て ください · trợ từ で',
  goal: 'Chia được thể て của cả 3 nhóm theo bảng cô dạy, nhờ người khác làm việc bằng ～て ください, và nói "bằng gì" bằng trợ từ で (ポイント 63, 71).',
  minutes: 65,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 16 cô dạy gì (theo thứ tự slide)',
      items: [
        '**ST 2 「パーティーの準備」** — mục tiêu: nhờ và chỉ đạo khi chuẩn bị tiệc.',
        '**Từ mới (đồ trong bếp & bàn ăn)**: テーブル · いす · でんしレンジ · れいぞうこ · さとう · しお · しょうゆ · はし · スプーン · ナイフ · フォーク.',
        '**Cách chia nhóm động từ**: nhóm I = V[i]ます · nhóm II = V[e]ます (+ ngoại lệ) · nhóm III = きます / します / N します.',
        '**Thể て (te-kei)**: bảng chia 3 nhóm — nhóm II bỏ ます thêm て, nhóm I theo đuôi, nhóm III thuộc lòng.',
        '**～て ください** (xin hãy …) — "Đề nghị, mệnh lệnh lịch sự" — hội thoại **サラダを つくって ください**.',
        '**Trợ từ で** chỉ phương tiện / dụng cụ / cách thức (ポイント 71) + câu hỏi **なんで**.',
      ],
    },
    {
      t: 'vocab',
      items: [
        { w: 'テーブル', pos: 'Danh từ', ipa: 'teeburu', vi: 'bàn ăn', ex: 'テーブルの うえに コップが あります。', exRo: 'Teeburu no ue ni koppu ga arimasu.', exVi: 'Trên bàn có cái cốc.' },
        { w: 'いす', pos: 'Danh từ', ipa: 'isu', vi: 'ghế', ex: 'いすは テーブルの よこに あります。', exRo: 'Isu wa teeburu no yoko ni arimasu.', exVi: 'Ghế ở cạnh bàn.' },
        { w: '{電子|でんし}レンジ', pos: 'Danh từ', ipa: 'denshi renji', vi: 'lò vi sóng', ex: '{電子|でんし}レンジで ごはんを あたためます。', exRo: 'Denshi renji de gohan o atatamemasu.', exVi: 'Tôi hâm cơm bằng lò vi sóng.', more: 'あたためます = hâm nóng (từ phụ, chỉ cần nghe hiểu).' },
        { w: '{冷蔵庫|れいぞうこ}', pos: 'Danh từ', ipa: 'reizouko', vi: 'tủ lạnh', ex: '{冷蔵庫|れいぞうこ}に ジュースが あります。', exRo: 'Reizouko ni juusu ga arimasu.', exVi: 'Trong tủ lạnh có nước hoa quả.' },
        { w: '{砂糖|さとう}', pos: 'Danh từ', ipa: 'satou', vi: 'đường', ex: 'コーヒーに {砂糖|さとう}を いれます。', exRo: 'Koohii ni satou o iremasu.', exVi: 'Cho đường vào cà phê.' },
        { w: '{塩|しお}', pos: 'Danh từ', ipa: 'shio', vi: 'muối', ex: '{塩|しお}を とって ください。', exRo: 'Shio o totte kudasai.', exVi: 'Làm ơn lấy giúp muối.' },
        { w: 'しょうゆ', pos: 'Danh từ', ipa: 'shouyu', vi: 'nước tương', ex: 'しょうゆは どれですか。', exRo: 'Shouyu wa dore desu ka.', exVi: 'Nước tương là chai nào?' },
        { w: 'はし', pos: 'Danh từ', ipa: 'hashi', vi: 'đũa', ex: 'はしで ごはんを たべます。', exRo: 'Hashi de gohan o tabemasu.', exVi: 'Ăn cơm bằng đũa.' },
        { w: 'スプーン', pos: 'Danh từ', ipa: 'supuun', vi: 'thìa', ex: 'スプーンで スープを のみます。', exRo: 'Supuun de suupu o nomimasu.', exVi: 'Uống súp bằng thìa.' },
        { w: 'ナイフ', pos: 'Danh từ', ipa: 'naifu', vi: 'dao', ex: 'ナイフで パンを きります。', exRo: 'Naifu de pan o kirimasu.', exVi: 'Cắt bánh mì bằng dao.' },
        { w: 'フォーク', pos: 'Danh từ', ipa: 'fooku', vi: 'dĩa', ex: 'フォークで ケーキを たべます。', exRo: 'Fooku de keeki o tabemasu.', exVi: 'Ăn bánh bằng dĩa.' },
      ],
    },

    /* ── chia nhóm ── */
    { t: 'h', text: 'Phần 1 — Cách chia nhóm động từ (slide: "Cách chia nhóm động từ")' },
    {
      t: 'p',
      text: 'Cô viết ba khung. Nhìn **âm đứng ngay trước ます** (bỏ ます đi, xem chữ cuối của "gốc"): **kết thúc bằng nguyên âm i → nhóm I**, **kết thúc bằng e → nhóm II**. Hai điều "ngoại lệ" cô gạch chân: một số động từ có i nhưng thuộc nhóm II, và nhóm III chỉ có vài từ.',
    },
    {
      t: 'table',
      caption: 'Ba nhóm động từ (đúng như khung của cô)',
      head: ['Nhóm', 'Dạng nhận biết', 'Ví dụ trên slide', 'Gốc (bỏ ます)'],
      rows: [
        ['**I**', '**V[i] ます** — trước ます là âm hàng い', 'あらいます · おきます (置きます) · かします · もちます · かきます · あそびます', 'あらい · おき · かし · もち · かき · あそび'],
        ['**II**', '**V[e] ます** — trước ます là âm hàng え', 'たべます · おしえます · みせます · ねます', 'たべ · おしえ · みせ · ね'],
        ['**II (ngoại lệ ghi "chú ý")**', 'trước ます là **i** nhưng thuộc nhóm II', '**おきます (起きます) · みます · います · かります**', 'おき · み · い · かり'],
        ['**III**', 'bất quy tắc', 'きます · します · N します (べんきょうします · かいものします)', '—'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ & lỗi hay mắc khi chia nhóm',
      items: [
        '**Hai chữ おきます**: 置きます (đặt) là **nhóm I**; 起きます (thức dậy) là **nhóm II**. Chỉ khác nhau ở chữ Hán; slide ghi rõ "(置きます)" và "(起きます)".',
        '**Ngoại lệ bắt buộc thuộc**: みます (xem), います (có/ở), かります (mượn), おきます (起), + (học sau) あびます, できます, たります. Tiện nhớ: "**mi-i-ka-o**".',
        '**Động từ kết thúc り** (かえります, はいります, きります, しります…) → có i trước ます → **nhóm I** dù mặt chữ nhìn giống nhóm II. Đây là bẫy nhiều người sai.',
        '**N します** = danh từ + します: べんきょうします, かいものします, そうじします, せんたくします, しょくじします → đều **nhóm III**.',
        'Mẹo kiểm tra khi không chắc: dạng từ điển (ます → る): nhóm II thường kết thúc **いる/える** (みる, たべる) còn nhóm I thường là **う-dạng** (かく, のむ).',
      ],
    },
    {
      t: 'mcq',
      id: 'slot16-nhom',
      title: 'Phân loại nhóm — kiểm tra nhanh',
      items: [
        { q: 'あらいます thuộc nhóm?', options: ['I', 'II', 'III'], correct: 0, why: 'Trước ます là い (らい) → **nhóm I**.' },
        { q: 'たべます thuộc nhóm?', options: ['I', 'II', 'III'], correct: 1, why: 'Trước ます là べ (e) → **nhóm II**.' },
        { q: 'みます thuộc nhóm?', options: ['I', 'II', 'III'], correct: 1, why: 'Ngoại lệ: có み (i) nhưng **nhóm II**.' },
        { q: 'かえります thuộc nhóm?', options: ['I', 'II', 'III'], correct: 0, why: 'Trước ます là り (i) và không nằm trong ngoại lệ → **nhóm I**.' },
        { q: 'おきます (起きます) thuộc nhóm?', options: ['I', 'II', 'III'], correct: 1, why: 'Ngoại lệ: 起きます **nhóm II** (置きます mới là nhóm I).' },
        { q: 'べんきょうします thuộc nhóm?', options: ['I', 'II', 'III'], correct: 2, why: 'N します → **nhóm III**.' },
        { q: 'かします (cho mượn) thuộc nhóm?', options: ['I', 'II', 'III'], correct: 0, why: 'し (i) → **nhóm I**; て-form: かして.' },
        { q: 'かります (mượn) thuộc nhóm?', options: ['I', 'II', 'III'], correct: 1, why: 'Ngoại lệ → **nhóm II**; て-form: かりて.' },
      ],
    },

    /* ── thể て ── */
    { t: 'h', text: 'Phần 2 — Thể て (「て形」) — bảng chia cô dạy' },
    {
      t: 'p',
      text: 'Slide nhắc đi nhắc lại: **Thể て = dạng nối của động từ**. Cô chia thành ba bảng: nhóm II và III dễ, nhóm I theo **đuôi**.',
    },
    {
      t: 'table',
      caption: 'Nhóm II và III (slide "グループ２ / グループ３")',
      head: ['Nhóm', 'Quy tắc', 'Ví dụ'],
      rows: [
        ['II', '**-e ます → -e て** · **-i ます → -i て** (bỏ ます, thêm て)', 'ねます→ねて · たべます→たべて · みます→みて · おきます→おきて'],
        ['III', 'きます → **きて** · します → **して** · N します → **N して**', 'きます→きて · します→して · べんきょうします→べんきょうして'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm I — theo đuôi (slide gom thành 4 ô)',
      head: ['Đuôi trước ます', 'Đổi thành', 'Ví dụ trên slide'],
      rows: [
        ['**い · ち · り**', '**って**', 'あいます→あって · たちます→たって · きります→きって'],
        ['**み · び · に**', '**んで**', 'のみます→のんで · あそびます→あそんで · しにます→しんで'],
        ['**き**', '**いて**', 'かきます→かいて · **ただし** いきます→**いって** (ngoại lệ!)'],
        ['**ぎ**', '**いで**', 'いそぎます→いそいで · およぎます→およいで'],
        ['**し**', '**して**', 'かします→かして · はなします→はなして'],
      ],
    },
    {
      t: 'rule',
      formula: 'い・ち・り→って　み・び・に→んで　き→いて　ぎ→いで　し→して　（行きます→行って）',
      vi: 'Câu thần chú nhóm I — đọc to nhiều lần. Ngoại lệ DUY NHẤT của đuôi き là 行きます → 行って.',
    },
    {
      t: 'note',
      title: 'Cách nhớ & lỗi hay mắc',
      items: [
        '**Vần điệu**: "**い・ち・り — って**, **み・び・に — んで**" (っ và ん đều là âm ngắt/mũi, nghe tự nhiên khi đọc).',
        '**Sai phổ biến**: ~~いきて~~ ✗ → **いって** ✓. Mọi bạn chia き→いて nên nhớ ngoại lệ này.',
        '**し→して**: động từ nhóm I kết thúc し giữ nguyên し (はなします → はなして, かします → かして).',
        '**かえります→かえって; はいります→はいって** (nhóm I, đuôi り → って) — đừng chia kiểu nhóm II (~~かえて~~ ✗).',
        '**Nghe lẫn**: のんで (uống) ≠ よんで (đọc/gọi: よみます → よんで, よびます → よんで) → phải dựa vào ngữ cảnh.',
        '**たべて・ねて・みて・でて** chỉ có **1 mora trước て** → nhóm II dễ nhận.',
      ],
    },
    {
      t: 'table',
      caption: 'Danh sách trên slide — thể て của từng động từ (đáp án đầy đủ; tự che cột phải để luyện)',
      head: ['Động từ', 'Nhóm', 'Thể て', 'Nghĩa'],
      rows: [
        ['はたらきます', 'I', 'はたらいて', 'làm việc'],
        ['かきます', 'I', 'かいて', 'viết'],
        ['ききます', 'I', 'きいて', 'nghe / hỏi'],
        ['およぎます', 'I', 'およいで', 'bơi'],
        ['やすみます', 'I', 'やすんで', 'nghỉ'],
        ['よびます', 'I', 'よんで', 'gọi'],
        ['かいます', 'I', 'かって', 'mua'],
        ['あいます', 'I', 'あって', 'gặp'],
        ['もちます', 'I', 'もって', 'cầm / mang'],
        ['きります', 'I', 'きって', 'cắt'],
        ['ならいます', 'I', 'ならって', 'học (với ai)'],
        ['もらいます', 'I', 'もらって', 'nhận'],
        ['わかります', 'I', 'わかって', 'hiểu'],
        ['はいります', 'I', 'はいって', 'vào'],
        ['てつだいます', 'I', 'てつだって', 'giúp đỡ'],
        ['のぼります', 'I', 'のぼって', 'leo'],
        ['すいます', 'I', 'すって', 'hút (thuốc)'],
        ['あらいます', 'I', 'あらって', 'rửa'],
        ['かえります', 'I', 'かえって', 'về'],
        ['よみます', 'I', 'よんで', 'đọc'],
        ['のみます', 'I', 'のんで', 'uống'],
        ['もっていきます', 'I', 'もっていって', 'mang đi'],
        ['はじめます', 'II', 'はじめて', 'bắt đầu'],
        ['しめます', 'II', 'しめて', 'đóng'],
        ['とめます', 'II', 'とめて', 'dừng/đỗ'],
        ['あけます', 'II', 'あけて', 'mở'],
        ['かけます', 'II', 'かけて', 'treo / gọi (điện)'],
        ['でます', 'II', 'でて', 'ra'],
        ['おぼえます', 'II', 'おぼえて', 'nhớ'],
        ['おきます (起)', 'II', 'おきて', 'thức dậy'],
        ['みます', 'II', 'みて', 'xem'],
        ['かります', 'II', 'かりて', 'mượn'],
        ['います', 'II', 'いて', 'có/ở (người)'],
        ['そうじします', 'III', 'そうじして', 'dọn dẹp'],
        ['けっこんします', 'III', 'けっこんして', 'kết hôn'],
        ['しょくじします', 'III', 'しょくじして', 'dùng bữa'],
      ],
    },
    {
      t: 'quiz',
      id: 'slot16-quiz-te',
      title: 'Luyện chia thể て (gõ hiragana)',
      kind: 'fill',
      grammar: 'い・ち・り→って · み・び・に→んで · き→いて · ぎ→いで · し→して · 行く→行って',
      items: [
        { q: 'かえります → ?', answers: ['かえって', '帰って'], hint: 'り → って' },
        { q: 'よみます → ?', answers: ['よんで', '読んで'], hint: 'み → んで' },
        { q: 'いきます → ?', answers: ['いって', '行って'], hint: 'ngoại lệ' },
        { q: 'はなします → ?', answers: ['はなして', '話して'], hint: 'し → して' },
        { q: 'あそびます → ?', answers: ['あそんで', '遊んで'], hint: 'び → んで' },
        { q: 'かきます → ?', answers: ['かいて', '書いて'], hint: 'き → いて' },
        { q: 'いそぎます → ?', answers: ['いそいで', '急いで'], hint: 'ぎ → いで' },
        { q: 'たべます → ?', answers: ['たべて', '食べて'], hint: 'nhóm II' },
        { q: 'みます → ?', answers: ['みて', '見て'], hint: 'nhóm II (ngoại lệ)' },
        { q: 'べんきょうします → ?', answers: ['べんきょうして', '勉強して'], hint: 'nhóm III' },
        { q: 'きます (来ます) → ?', answers: ['きて', '来て'], hint: 'nhóm III' },
        { q: 'かします → ?', answers: ['かして', '貸して'], hint: 'し → して' },
      ],
    },

    /* ── て ください ── */
    { t: 'h', text: 'Phần 3 — ～て ください (nhờ, bảo, mời)  ·  ポイント 63' },
    {
      t: 'p',
      text: 'Slide chú thích: **"CÁC MẪU CÂU VỚI ĐỘNG TỪ DẠNG TE — (Xin mời…, xin hãy…, xin vui lòng) — Đề nghị, mệnh lệnh lịch sự"**. Ví dụ cô viết: **てつだってください** (Hãy giúp với) · **なまえを かいてください** (Hãy viết tên) · **あした 9じに きてください** (Ngày mai hãy đến lúc 9 giờ).',
    },
    {
      t: 'rule',
      formula: 'V て + ください。',
      vi: 'Xin hãy V. Dùng để **nhờ, hướng dẫn, mời**. Người nhận đáp: **はい、わかりました** / **はい、どうぞ**.',
    },
    {
      t: 'examples',
      items: [
        E('サラダを つくって ください。…はい。', 'Sarada o tsukutte kudasai. …Hai.', 'Hãy làm món salad giúp tôi. …Vâng.'),
        E('やさいを あらって ください。', 'Yasai o aratte kudasai.', 'Hãy rửa rau giúp.'),
        E('かばんを とって ください。', 'Kaban o totte kudasai.', 'Hãy lấy cặp giúp tôi.'),
        E('あの テーブルの うえに おいて ください。', 'Ano teeburu no ue ni oite kudasai.', 'Hãy đặt lên cái bàn kia.'),
        E('れいぞうこから みずを だして ください。', 'Reizouko kara mizu o dashite kudasai.', 'Hãy lấy nước từ tủ lạnh ra.'),
        E('その かばんを ここへ もって きて ください。', 'Sono kaban o koko e motte kite kudasai.', 'Hãy mang cái cặp đó đến đây.'),
        E('ここに なまえを かいて ください。', 'Koko ni namae o kaite kudasai.', 'Hãy viết tên ở đây.'),
        E('まどを しめて ください。', 'Mado o shimete kudasai.', 'Hãy đóng cửa sổ.'),
        E('ビールを のんで ください。', 'Biiru o nonde kudasai.', 'Mời uống bia.'),
        E('たべて ください。', 'Tabete kudasai.', 'Mời ăn.'),
      ],
    },
    {
      t: 'table',
      caption: 'Bài "れんしゅうします" của slide — chuyển V ます → V て ください (đáp án)',
      head: ['Đề', 'Đáp án', 'Romaji'],
      rows: [
        ['日本語を かきます', '日本語を かいて ください。', 'Nihongo o kaite kudasai.'],
        ['ふくを あらいます', 'ふくを あらって ください。', 'Fuku o aratte kudasai.'],
        ['先生に ききます', '先生に きいて ください。', 'Sensei ni kiite kudasai.'],
        ['パソコンを つかいます', 'パソコンを つかって ください。', 'Pasokon o tsukatte kudasai.'],
        ['しおを とります', 'しおを とって ください。', 'Shio o totte kudasai.'],
        ['日本語を おしえます', '日本語を おしえて ください。', 'Nihongo o oshiete kudasai.'],
      ],
    },
    {
      t: 'table',
      caption: 'Sáu câu ①–⑥ trên slide (nhìn hình rồi nói) — đáp án mẫu',
      head: ['#', 'Câu', 'Romaji'],
      rows: [
        ['①', 'やさいを あらって ください。', 'Yasai o aratte kudasai.'],
        ['②', 'かばんを とって ください。', 'Kaban o totte kudasai.'],
        ['③', 'てつだって ください。', 'Tetsudatte kudasai.'],
        ['④', 'あの テーブルの うえに おいて ください。', 'Ano teeburu no ue ni oite kudasai.'],
        ['⑤', 'だして ください。', 'Dashite kudasai.'],
        ['⑥', 'テーブルの うえに さらを おいて ください。', 'Teeburu no ue ni sara o oite kudasai.'],
      ],
    },
    DL('Hội thoại 会話練習 — sai việc chuẩn bị tiệc (viết lại)', [
        ['A', 'a', 'くだものを あらって ください。', 'Kudamono o aratte kudasai.', 'Hãy rửa trái cây giúp tôi.'],
        ['B', 'b', 'はい。', 'Hai.', 'Vâng.'],
        ['A', 'a', 'それから、テーブルの うえに さらを おいて ください。', 'Sorekara, teeburu no ue ni sara o oite kudasai.', 'Rồi đặt đĩa lên bàn nhé.'],
        ['B', 'b', 'はい、わかりました。', 'Hai, wakarimashita.', 'Vâng, tôi hiểu rồi.'],
    ]),
    {
      t: 'note',
      title: 'Cách nhớ & lỗi hay mắc',
      items: [
        '**Cấu trúc**: *(N を) + V-て + ください* — thể て phải chia đúng nhóm. Lỗi hay nhất là **chia sai て** (~~とりて~~ ✗ → とって ✓).',
        '**Lịch sự theo hoàn cảnh**: bạn bè dùng **てください**; với người trên thêm **すみませんが、** hoặc dùng ～てくださいませんか (cao hơn, chưa học). Không đứng một mình ~~てください~~ khi nói với cô giáo — hãy thêm **すみませんが**.',
        '**Đừng dùng ください khi muốn người kia dừng ngay** — tiếng Nhật hay nói ～ないでください (bài 10).',
        '**Hai nghĩa**: (1) **nhờ** — やさいを あらって ください; (2) **mời / khuyến khích** — たくさん たべて ください. Phân biệt bằng ngữ cảnh.',
        '**Trợ từ trước V て**: giữ nguyên trợ từ như ます: を (đối tượng), に (nơi đặt/đích), へ (hướng), から (xuất phát).',
        '**もって きます** = mang **đến** (người nói), **もって いきます** = mang **đi** (xa người nói); thể て: もって きて / もって いって.',
      ],
    },

    /* ── trợ từ で ── */
    { t: 'h', text: 'Phần 4 — Trợ từ で: bằng phương tiện / dụng cụ / cách thức  ·  ポイント 71' },
    {
      t: 'p',
      text: 'Slide chia thành hai cột: **Phương tiện đi lại** (バイクで · タクシーで) và **Phương tiện, công cụ, cách thức thực hiện hành động** (はしで · ペンで). Cô ghi thêm: "Địa điểm xảy ra hành động" để nhắc: **で còn dùng cho NƠI diễn ra hành động** (Bài 3). Dịch: **"Bằng phương tiện, cách thức gì"**.',
    },
    {
      t: 'table',
      caption: 'Hai chức năng của で (slide đặt cạnh nhau để so sánh)',
      head: ['Chức năng', 'Mẫu', 'Ví dụ'],
      rows: [
        ['Nơi hành động', 'N(nơi) で V', '**がっこうで** べんきょうします。 (Học ở trường)'],
        ['Phương tiện', 'N(xe) で いきます／かえります', '**バイクで** がっこうへ いきます。 · **タクシーで** うちへ かえります。'],
        ['Dụng cụ / cách thức', 'N(dụng cụ) で V', '**はしで** ごはんを たべます。 · **ペンで** てがみを かきます。'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('バイクで がっこうへ いきます。', 'Baiku de gakkou e ikimasu.', 'Tôi đến trường bằng xe máy.'),
        E('タクシーで うちへ かえります。', 'Takushii de uchi e kaerimasu.', 'Tôi về nhà bằng taxi.'),
        E('はしで ごはんを たべます。', 'Hashi de gohan o tabemasu.', 'Ăn cơm bằng đũa.'),
        E('ナイフで にくを きります。', 'Naifu de niku o kirimasu.', 'Cắt thịt bằng dao.'),
        E('ペンで なまえを かきます。', 'Pen de namae o kakimasu.', 'Viết tên bằng bút.'),
        E('わたしは ナイフで りんごを きります。', 'Watashi wa naifu de ringo o kirimasu.', 'Tôi gọt/cắt táo bằng dao.'),
        E('わたしは ラジオで {日本語|にほんご}を ききます。', 'Watashi wa rajio de nihongo o kikimasu.', 'Tôi nghe tiếng Nhật qua radio.'),
        E('ボールペンで なまえを かいて ください。', 'Boorupen de namae o kaite kudasai.', 'Hãy viết tên bằng bút bi.'),
      ],
    },
    {
      t: 'table',
      caption: 'Câu hỏi: なんで (bằng gì?) và các từ hỏi liên quan',
      head: ['Hỏi', 'Câu', 'Đáp'],
      rows: [
        ['**なんで**', '**なんで** ごはんを たべますか。', 'はしで たべます。'],
        ['なんで (xe)', '**なんで** がっこうへ いきますか。', 'バイクで いきます。'],
        ['なにを', 'なにを たべますか。', 'ごはんを たべます。 (khác: hỏi vật bị tác động)'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ & lỗi hay mắc',
      items: [
        '**で = "bằng"**. Có thể thử thay bằng "bằng" trong câu Việt: "ăn **bằng** đũa", "đi **bằng** taxi" → で. Nếu thay không được ("học ở trường") thì đó là で chỉ nơi.',
        '**Sai**: ~~はしを ごはんを たべます~~ ✗ (hai を). Dụng cụ luôn đi với **で**.',
        '**なんで** ≠ **なぜ** (tại sao). Ở bài này なんで = bằng gì; khi hỏi lý do người ta dùng **どうして / なぜ**.',
        '**Ngôn ngữ**: nói bằng ngôn ngữ nào cũng dùng で: 日本語**で** はなします (nói bằng tiếng Nhật).',
      ],
    },
    {
      t: 'note',
      title: 'Cô hay hỏi gì khi gọi phát biểu (Slot 16)',
      items: [
        '"**〇〇を とって ください。**" (cô giơ tay) — bạn lấy đồ và nói **はい、どうぞ**.',
        '"**これを 〜て ください**" cho 6 động từ (かきます, あらいます, ききます, つかいます, とります, おしえます) → bạn chia て đúng.',
        '"**なんで ごはんを たべますか。**" — はしで / スプーンで / フォークで.',
        '"**ナイフと はしと フォークは どこに ありますか。**" — nhắc cả vị trí (Slot 15) và từ mới.',
        '**Nhóm động từ**: cô chỉ động từ bất kỳ và hỏi "グループ いくつ?" — trả lời **I / II / III** và chia て ngay.',
      ],
    },
    {
      t: 'mcq',
      id: 'slot16-luyen',
      title: 'Luyện — ～て ください · で (có giải thích)',
      items: [
        { q: 'しおを（　）ください。(lấy)', options: ['とって', 'とりて', 'とて', 'とんで'], correct: 0, why: 'とります (nhóm I) → り → **って**: とって.' },
        { q: 'ここに なまえを（　）ください。(viết)', options: ['かって', 'かいて', 'かんで', 'かきて'], correct: 1, why: 'かきます → き → **いて**: かいて.' },
        { q: 'テーブルの うえに さらを（　）ください。(đặt)', options: ['おいて', 'おきて', 'おって', 'おんで'], correct: 0, why: '置きます (nhóm I) → き → いて: **おいて**. おきて là 起きる (thức dậy).' },
        { q: 'この {本|ほん}を（　）ください。(đọc)', options: ['よって', 'よんで', 'よいて', 'よみて'], correct: 1, why: 'よみます → み → **んで**: よんで.' },
        { q: '（　）ごはんを たべます。(bằng đũa)', options: ['はしを', 'はしで', 'はしに', 'はしが'], correct: 1, why: 'Dụng cụ → **で**.' },
        { q: 'バイク（　）がっこうへ いきます。', options: ['で', 'に', 'を', 'が'], correct: 0, why: 'Phương tiện → **で**.' },
        { q: '「なんで ごはんを たべますか。」「（　）たべます。」', options: ['はしで', 'はしを', 'はしの', 'はしが'], correct: 0, why: 'Hỏi なんで → đáp **N で**.' },
        { q: 'いって / かえって / のんで — 3 thể て nào chia ĐÚNG từ いきます / かえります / のみます?', options: ['いって・かえって・のんで', 'いきて・かえりて・のみて', 'いいて・かえって・のんで', 'いって・かえて・のんで'], correct: 0, why: 'いきます→いって (ngoại lệ), かえります→かえって, のみます→のんで.' },
      ],
    },
    {
      t: 'quiz',
      id: 'slot16-luyen-dich',
      title: 'Luyện dịch Việt → Nhật',
      kind: 'translate',
      grammar: 'V て ください · N で V',
      items: [
        { q: 'Hãy rửa rau giúp tôi.', answers: V('やさいをあらってください。', '{野菜|やさい}を{洗|あら}ってください。'), hint: 'あらいます → あらって' },
        { q: 'Hãy lấy nước từ tủ lạnh ra.', answers: V('{冷蔵庫|れいぞうこ}から{水|みず}をだしてください。', 'れいぞうこからみずをだしてください。'), hint: 'だします → だして' },
        { q: 'Hãy viết tên bằng bút bi.', answers: V('ボールペンで{名前|なまえ}をかいてください。', 'ボールペンでなまえを{書|か}いてください。'), hint: 'で · かいて' },
        { q: 'Tôi ăn cơm bằng đũa.', answers: V('はしでごはんをたべます。', 'はしで{ご飯|ごはん}を{食|た}べます。'), hint: 'はしで' },
        { q: 'Hãy mang cặp đó đến đây.', answers: V('そのかばんをここへもってきてください。', 'そのかばんをここへ{持|も}って{来|き}てください。'), hint: 'もってきて' },
      ],
    },
  ],
};

/* ═══════════════════════ SLOT 17 — L7.2 tiếp · Kanji 7 ═══════════════════════ */

const SLOT_17: Lesson = {
  id: 'slot-17-l7-2-tiep-kanji7',
  kind: 'grammar',
  title: 'Slot 17 — Bài 7.2 tiếp: V ます＋方 (cách làm) · どの N · どれ · bảng こ・そ・あ・ど · Chữ Hán bài 7',
  goal: 'Hỏi cách làm bằng 「Nの V かた」, chỉ đúng đồ vật bằng どの N / どれ, nắm bảng こ・そ・あ・ど, và đọc 7 chữ Hán bài 7 (肉 料 理 野 半 大 小).',
  minutes: 60,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 17 cô dạy gì',
      items: [
        '**Nhắc lại** từ mới đồ bếp (slide lặp lại để nhớ): テーブル, いす, でんしレンジ, れいぞうこ, さとう, しお, しょうゆ, はし, スプーン, ナイフ, フォーク.',
        '**チャレンジ 3** — **カレーの つくりかた を おしえてください**: V ます＋**方 (かた)** = "cách …" — biến động từ thành danh từ.',
        '**チャレンジ 4** — **どの おさらですか。その おさらです。**: **どの N**.',
        '**チャレンジ 5** — **どれですか。それです。**: **どれ**.',
        '**Bảng こ・そ・あ・ど** tổng kết (どこ, どちら, どの, どれ, どんな, どう, どのくらい).',
        '**Chữ Hán bài 7** (漢字たまご 第 7 回目): **肉 料 理 野 半 大 小**. Làm **やってみよう 2** (sách p.127).',
      ],
    },

    /* ── つくりかた ── */
    { t: 'h', text: 'チャレンジ 3 — 「カレーの つくりかたを おしえてください」  ·  ポイント 66' },
    {
      t: 'p',
      text: 'Slide: **A：カレーの つくりかたを おしえてください。B：はい。** Cô vẽ sơ đồ: **V ました / V ません / V ましょう / V ます＋たいです** đều là ghép với "V ます"; thêm một mẫu mới: **V ます＋方（かた）= CÁCH …**, tiêu đề **Tạo DANH TỪ từ ĐỘNG TỪ**. Ví dụ cô: スープの つくりかた · かんじの よみかた · やさいの きりかた · ほんの つかいかた.',
    },
    {
      t: 'rule',
      formula: 'N の ＋ V (bỏ ます) ＋ かた',
      vi: '"Cách V N". Giữ nguyên trợ từ **の** giữa N và động từ (không dùng を). かた = 方.',
    },
    {
      t: 'table',
      caption: 'Sáu cặp cô cho (N · V) → đáp án',
      head: ['Đề', 'Đáp án', 'Romaji', 'Nghĩa'],
      rows: [
        ['かんじ・かきます', 'かんじの かきかた', 'kanji no kakikata', 'cách viết chữ Hán'],
        ['やさい・きります', 'やさいの きりかた', 'yasai no kirikata', 'cách cắt rau'],
        ['スープ・つくります', 'スープの つくりかた', 'suupu no tsukurikata', 'cách nấu súp'],
        ['パソコン・つかいます', 'パソコンの つかいかた', 'pasokon no tsukaikata', 'cách dùng máy tính'],
        ['かんじ・よみます', 'かんじの よみかた', 'kanji no yomikata', 'cách đọc chữ Hán'],
        ['りょうり・たべます', 'りょうりの たべかた', 'ryouri no tabekata', 'cách ăn món'],
      ],
    },
    DL('Hỏi cách làm — nhận lời hay từ chối (viết lại)', [
        ['A', 'a', 'カレーの つくりかたが わかりません。すみませんが、つくりかたを おしえて ください。', 'Karee no tsukurikata ga wakarimasen. Sumimasen ga, tsukurikata o oshiete kudasai.', 'Mình không biết cách nấu cà ri. Xin lỗi, bạn chỉ giúp mình cách làm nhé.'],
        ['B', 'b', 'いいですよ。', 'Ii desu yo.', 'Được thôi.'],
    ]),
    DL('Nếu người kia cũng không biết', [
        ['A', 'a', 'カレーの つくりかたが わかりません。', 'Karee no tsukurikata ga wakarimasen.', 'Mình không biết cách nấu cà ri.'],
        ['B', 'b', 'すみません。わたしも わかりません。Cさんに きいて ください。', 'Sumimasen. Watashi mo wakarimasen. C-san ni kiite kudasai.', 'Xin lỗi. Mình cũng không biết. Bạn hỏi bạn C đi.'],
    ]),
    {
      t: 'note',
      title: 'Cách nhớ & lỗi hay mắc (ポイント 66)',
      items: [
        '**Sai**: ~~カレーを つくりかた~~ ✗ → **カレーの つくりかた** ✓ (の thay を).',
        '**Bỏ ます trước かた**: つくり**ます** → つくり**かた**; のみ**ます** → のみ**かた**; **します → しかた** (べんきょうの しかた = cách học).',
        '**つくりかた＋が わかりません**: わかります đi với **が** (giống すき): つくりかた**が** わかりません = không biết cách làm.',
        'Đề nghị lịch sự: **すみませんが、～を おしえて ください。** (Slot 16: ～て ください).',
        '**わかりません** (không biết, không hiểu) dùng cho cả sự việc và cách làm.',
      ],
    },

    /* ── どの / どれ ── */
    { t: 'h', text: 'チャレンジ 4–5 — 「どの おさらですか」「どれですか」  ·  ポイント 69–70' },
    {
      t: 'p',
      text: 'Slide: **A：どの おさらですか。B：その おさらです。** rồi **A：どれですか。B：それです。** Cô lập bảng ba cột: **Cái này これ / この + N · Cái đó それ / その + N · Cái kia あれ / あの + N · Cái nào どれ / どの + N**. Điểm mấu chốt: **これ・それ・あれ・どれ đứng một mình** (đại từ), **この・その・あの・どの bắt buộc đi với danh từ**.',
    },
    {
      t: 'table',
      caption: 'Bảng こ・そ・あ・ど (slide 24–25 và slide tổng hợp)',
      head: ['', 'こ (gần người nói)', 'そ (gần người nghe)', 'あ (xa cả hai)', 'ど (hỏi)'],
      rows: [
        ['**Vật (đứng riêng)**', 'これ', 'それ', 'あれ', '**どれ**'],
        ['**Vật + N**', 'この N', 'その N', 'あの N', '**どの N**'],
        ['**Nơi chốn**', 'ここ', 'そこ', 'あそこ', 'どこ'],
        ['**Phương hướng / lịch sự**', 'こちら', 'そちら', 'あちら', 'どちら'],
      ],
    },
    {
      t: 'table',
      caption: 'Slide cuối: từ hỏi có "ど" và câu gần nghĩa (cô liệt kê để cả lớp thuộc)',
      head: ['Từ hỏi', 'Nghĩa', 'Ví dụ'],
      rows: [
        ['どこ', 'ở đâu', 'ほんやは どこですか。'],
        ['どちら', 'phía nào / bên nào / ở đâu (lịch sự)', 'おくには どちらですか。 (Bạn ở nước nào?)'],
        ['どの N', 'N nào', 'どの おさらですか。'],
        ['どれ', 'cái nào (trong ≥ 3 cái)', 'さとうは どれですか。'],
        ['どんな', 'như thế nào (kiểu gì)', 'どんな ひとですか。 (Là người như thế nào?)'],
        ['どう', 'thế nào, ra sao', 'がっこうは どうですか。'],
        ['どのくらい', 'khoảng bao lâu / bao nhiêu', 'どのくらい かかりますか。 (Mất khoảng bao lâu?)'],
      ],
    },
    DL('Hội thoại slide — lấy đĩa (viết lại)', [
        ['A', 'a', 'おさらを とって ください。', 'Osara o totte kudasai.', 'Lấy giúp tôi cái đĩa.'],
        ['B', 'b', 'どの おさらですか。', 'Dono osara desu ka.', 'Cái đĩa nào ạ?'],
        ['A', 'a', 'その おさらです。', 'Sono osara desu.', 'Cái đĩa đó.'],
        ['B', 'b', 'ああ、これですか。はい、どうぞ。', 'Aa, kore desu ka. Hai, douzo.', 'À, cái này à? Đây ạ.'],
    ]),
    DL('Hội thoại slide — chọn gia vị (どれ)', [
        ['A', 'a', 'しおを とって ください。', 'Shio o totte kudasai.', 'Lấy giúp muối.'],
        ['B', 'b', 'どれですか。', 'Dore desu ka.', 'Cái nào ạ?'],
        ['A', 'a', 'それです。', 'Sore desu.', 'Cái đó.'],
        ['B', 'b', 'これですか。はい、どうぞ。', 'Kore desu ka. Hai, douzo.', 'Cái này à? Đây ạ.'],
        ['A', 'a', 'どうも。', 'Doumo.', 'Cảm ơn.'],
    ]),
    {
      t: 'examples',
      items: [
        E('Bさん、コップを あらって ください。…どの コップですか。…その コップです。', 'B-san, koppu o aratte kudasai. …Dono koppu desu ka. …Sono koppu desu.', 'B ơi, rửa giúp cái cốc. …Cốc nào ạ? …Cái cốc đó.'),
        E('Bさん、スプーンを ください。…どの スプーンですか。…その スプーンです。', 'B-san, supuun o kudasai. …Dono supuun desu ka. …Sono supuun desu.', 'B ơi, cho mình cái thìa. …Thìa nào ạ? …Thìa đó.'),
        E('Bさん、いすを テーブルの よこに おいて ください。…どの いすですか。…あの いすです。', 'B-san, isu o teeburu no yoko ni oite kudasai. …Dono isu desu ka. …Ano isu desu.', 'B ơi, đặt ghế cạnh bàn. …Ghế nào ạ? …Cái ghế kia.'),
        E('さとうは どれですか。…それです。', 'Satou wa dore desu ka. …Sore desu.', 'Đường là cái nào? …Cái đó.'),
        E('しょうゆは どれですか。…それです。', 'Shouyu wa dore desu ka. …Sore desu.', 'Nước tương là cái nào? …Cái đó.'),
        E('おさけは どれですか。…それです。', 'Osake wa dore desu ka. …Sore desu.', 'Rượu là cái nào? …Cái đó.'),
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ & lỗi hay mắc (ポイント 69–70)',
      items: [
        '**N đi theo**: この/その/あの/どの **luôn có danh từ ngay sau**; これ/それ/あれ/どれ **không có danh từ**. Sai: ~~どれ おさらですか~~ ✗, ~~その です~~ ✗.',
        '**Người hỏi** dùng chữ **そ/あ** theo vị trí người trả lời. Khi A chỉ vật gần A → B nói **その/それ**; khi A chỉ vật gần B → B nói **これ**. Slide: "ああ、これですか。" (B cầm lên khi đã hiểu).',
        '**どれ vs どちら**: どれ cho 3 vật trở lên; どちら cho 2 vật (Slot 12).',
        '**Cách trả lời**: lặp lại **それです / あれです**. Hỏi **どの N** thì đáp **その N です** (hoặc それです).',
        '**ああ、これですか** = "À, cái này à?" xác nhận trước khi đưa. Rất tự nhiên.',
        '**どうぞ** = "xin mời, đây ạ" khi đưa đồ; **どうも** = "cảm ơn" ngắn (gần với ありがとう).',
      ],
    },

    /* ── Kanji 7 ── */
    { t: 'h', text: 'Phần 3 — Chữ Hán bài 7 (slide 漢字たまご 第 7 回目): 肉 料 理 野 半 大 小' },
    {
      t: 'table',
      caption: '7 chữ cô dạy (thứ tự slide) — Hán Việt, On/Kun và từ ghép trên slide',
      head: ['Chữ', 'Hán Việt', 'On', 'Kun', 'Nghĩa', 'Từ trên slide'],
      rows: [
        ['肉', 'Nhục', 'ニク', 'にく (từ riêng)', 'thịt', '牛肉 ぎゅうにく · 鶏肉 とりにく'],
        ['料', 'Liệu', 'リョウ', '—', 'nguyên liệu, tiền phí', '料金 りょうきん · 料理 りょうり'],
        ['理', 'Lý', 'リ', '—', 'lý luận, nguyên lý, lý do', '料理 りょうり'],
        ['野', 'Dã', 'ヤ', 'の', 'đồng bằng, hoang dã', '野菜 やさい · 長野 ながの'],
        ['半', 'Bán', 'ハン', 'なか・ば', 'nửa, giữa chừng', '一時半 いちじはん · 半分 はんぶん · 半年 はんとし · 半月 はんつき · 半日 はんにち／はんじつ · 半ば なかば'],
        ['大', 'Đại', 'ダイ / タイ', 'おお・きい', 'to lớn', '大学 だいがく · 大学生 だいがくせい · 大半 たいはん · 大会 たいかい · 大人 おとな · 大きい おおきい'],
        ['小', 'Tiểu', 'ショウ', 'ちい・さい', 'nhỏ, bé', '小学校 しょうがっこう · 小学生 しょうがくせい · 小人 こびと'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ & lỗi hay mắc',
      items: [
        '**肉**: hình miếng thịt có vân. Dễ lẫn với **内** (bên trong): 肉 có **人 hai lần** bên trong, 内 chỉ có **入/人 một lần**. Nhớ: 肉 = thịt, người nấu hai lần.',
        '**料理** (りょうり) = nấu ăn / món ăn; **料金** = tiền phí. 料 gồm 米 (gạo) + 斗 (cái đấu) = "đong nguyên liệu".',
        '**理**: bộ 王 (ngọc) + 里 (làng) — "sắp xếp đúng lẽ". Chỉ cần nhớ trong **料理**.',
        '**野菜 (やさい)** = rau — **đọc đặc biệt** (không phải の+さい). **長野 (ながの)** là tên tỉnh/thành phố ở Nhật.',
        '**半**: hai nét chấm trên và nét sổ giữa chia cả chữ làm đôi — nghĩa "một nửa". 一時**半** (1 giờ rưỡi), **半**年 (nửa năm), **半**日 (nửa ngày).',
        '**大** (chữ người dang tay) và **小** (ba nét). **大きい/小さい** là tính từ い; **大学/小学校** dùng On (ダイ/ショウ).',
        '**大人 (おとな)** và **小人 (こびと)**: hai từ đọc đặc biệt, không đọc theo On.',
        '**半日** có hai cách đọc: **はんにち** và **はんじつ** (slide ghi cả hai); trong đề thi chấp nhận cả hai nhưng はんにち thông dụng hơn.',
      ],
    },
    {
      t: 'readkanji',
      id: 'slot17-doc-kanji7',
      title: 'Tự thử — đọc KHÔNG furigana (chữ Hán bài 7)',
      note: 'Đọc to, bấm xem đáp án. Chữ Hán bài 6 và 7 xen kẽ.',
      items: [
        { text: '{牛肉|ぎゅうにく}と{野菜|やさい}を{切|き}ります。', ro: 'Gyuuniku to yasai o kirimasu.', vi: 'Cắt thịt bò và rau.' },
        { text: '{鶏肉|とりにく}の{料理|りょうり}を{作|つく}ります。', ro: 'Toriniku no ryouri o tsukurimasu.', vi: 'Nấu món thịt gà.' },
        { text: '{大学|だいがく}に{大|おお}きい{門|もん}があります。', ro: 'Daigaku ni ookii mon ga arimasu.', vi: 'Đại học có cổng lớn.' },
        { text: '{小学生|しょうがくせい}は{半日|はんにち}で{帰|かえ}ります。', ro: 'Shougakusei wa hannichi de kaerimasu.', vi: 'Học sinh tiểu học về sau nửa ngày.' },
        { text: '{一時半|いちじはん}に{会社|かいしゃ}で{会|あ}います。', ro: 'Ichiji han ni kaisha de aimasu.', vi: 'Gặp nhau ở công ty lúc 1 giờ rưỡi.' },
        { text: '{来月|らいげつ}、{長野|ながの}で{大会|たいかい}があります。', ro: 'Raigetsu, Nagano de taikai ga arimasu.', vi: 'Tháng sau ở Nagano có đại hội.' },
        { text: '{半年|はんとし}{前|まえ}、{大人|おとな}の{友達|ともだち}ができました。', ro: 'Hantoshi mae, otona no tomodachi ga dekimashita.', vi: 'Nửa năm trước tôi có bạn người lớn.' },
        { text: '{料金|りょうきん}は{高|たか}いですか。', ro: 'Ryoukin wa takai desu ka.', vi: 'Phí có đắt không?' },
        { text: '{小人|こびと}は{小|ちい}さいです。', ro: 'Kobito wa chiisai desu.', vi: 'Người tí hon thì nhỏ.' },
        { text: '{半分|はんぶん}ずつ{食|た}べましょう。', ro: 'Hanbun zutsu tabemashou.', vi: 'Mỗi người ăn một nửa nhé.' },
      ],
    },
    {
      t: 'mcq',
      id: 'slot17-kanji-mcq',
      title: 'Luyện chữ Hán bài 7 — chọn cách đọc',
      items: [
        { q: '「野菜」の読み方は？', options: ['やさい', 'のさい', 'やなぎ', 'のうさい'], correct: 0, why: '野菜 = **やさい** (đọc đặc biệt).' },
        { q: '「半分」の読み方は？', options: ['はんぶん', 'はんふん', 'なかぶん', 'ばんぶん'], correct: 0, why: '半分 = **はんぶん** (một nửa).' },
        { q: '「大人」の読み方は？', options: ['だいにん', 'おおひと', 'おとな', 'たいじん'], correct: 2, why: '大人 = **おとな** (người lớn).' },
        { q: '「小学校」の読み方は？', options: ['しょうがっこう', 'ちいがっこう', 'しょうがくこう', 'こがっこう'], correct: 0, why: '小学校 = **しょうがっこう** (trường tiểu học).' },
        { q: '「料理」の読み方は？', options: ['りょうり', 'りょうリ', 'りょうい', 'りゅうり'], correct: 0, why: '料理 = **りょうり**.' },
        { q: '「牛肉」の意味は？', options: ['thịt bò', 'thịt gà', 'thịt heo', 'cá'], correct: 0, why: '牛 (bò) + 肉 = 牛肉 **ぎゅうにく**. 鶏肉 = thịt gà.' },
        { q: '「大会」の読み方は？', options: ['たいかい', 'だいかい', 'おおかい', 'だいえ'], correct: 0, why: '大会 = **たいかい** (đại hội, cuộc thi lớn).' },
        { q: '「半月」の読み方は？', options: ['はんつき', 'はんげつ', 'なかつき', 'はんがつ'], correct: 0, why: '半月 = **はんつき** (nửa tháng).' },
      ],
    },
    {
      t: 'write',
      id: 'slot17-viet-kanji7',
      title: 'Tập viết (✍) — chữ Hán bài 7',
      chars: ['肉', '半', '大', '小', '野'],
      note: 'Hai chữ 大 và 小 viết nhiều lần để quen nét. 肉 viết hai nét "人" bên trong.',
    },
    {
      t: 'note',
      title: 'Cô hay hỏi gì khi gọi phát biểu (Slot 17)',
      items: [
        '"**〇〇の つくりかたを おしえてください。**" — bạn đáp bằng một bước làm đơn giản (**まず … それから …**) hoặc **すみません、わたしも わかりません。**',
        '"**これは なんですか。／どれですか。**" — cô cầm đồ bếp (しお, さとう, しょうゆ, スプーン) rồi hỏi **どの N** / **どれ**.',
        '"**ベトナムりょうりの つくりかたが わかりますか。**" — はい、わかります／いいえ、わかりません.',
        'Chữ Hán: cô chỉ chữ 料理, 野菜, 半分, 大学… bạn đọc to.',
      ],
    },
    {
      t: 'mcq',
      id: 'slot17-luyen',
      title: 'Luyện — つくりかた · どの/どれ (có giải thích)',
      items: [
        { q: 'スープの（　）を おしえて ください。(cách nấu)', options: ['つくりかた', 'つくかた', 'つくるかた', 'つくっかた'], correct: 0, why: 'つくります → つくり + かた = **つくりかた**.' },
        { q: '「おさらを とって ください。」「（　）おさらですか。」', options: ['どの', 'どれ', 'どこ', 'どちら'], correct: 0, why: 'Có danh từ おさら → **どの + N**.' },
        { q: '「さとうは（　）ですか。」「それです。」', options: ['どれ', 'どの', 'どこ', 'どんな'], correct: 0, why: 'Không có danh từ sau → **どれ**.' },
        { q: '（　）かんじは よみかたが わかりません。(chữ này)', options: ['この', 'これ', 'ここ', 'こちら'], correct: 0, why: 'Có danh từ かんじ → **この**.' },
        { q: 'カレー（　）つくりかたを おしえて ください。', options: ['の', 'を', 'が', 'に'], correct: 0, why: 'N **の** V かた.' },
        { q: '「どれですか。」に{対|たい}する{答|こた}えとして{正|ただ}しいのは？', options: ['それです。', 'そのです。', 'それを です。', 'そこです。'], correct: 0, why: 'どれ → それ/これ/あれ (không có N).' },
        { q: '{英語|えいご}の よみかたが（　）。', options: ['わかりません', 'あります', 'います', 'ください'], correct: 0, why: '"không biết cách đọc" → **わかりません**. Cô hay hỏi câu này.' },
        { q: '「（　）くらい かかりますか。」(hỏi thời lượng)', options: ['どの', 'どれ', 'どのくらい', 'どんな'], correct: 2, why: '**どのくらい** = khoảng bao lâu.' },
      ],
    },
    {
      t: 'quiz',
      id: 'slot17-luyen-dich',
      title: 'Luyện dịch Việt → Nhật',
      kind: 'translate',
      grammar: 'N の V かた · どの N · どれ',
      items: [
        { q: 'Hãy chỉ tôi cách nấu cà ri.', answers: V('カレーのつくりかたをおしえてください。', 'カレーの{作|つく}り{方|かた}を{教|おし}えてください。'), hint: 'つくりかた · おしえて' },
        { q: 'Cái đĩa nào ạ? — Cái đĩa đó.', answers: V('どのおさらですか。そのおさらです。', 'どのお{皿|さら}ですか。そのお{皿|さら}です。'), hint: 'どの · その' },
        { q: 'Muối là cái nào? — Cái đó.', answers: V('しおはどれですか。それです。', '{塩|しお}はどれですか。それです。'), hint: 'どれ · それ' },
        { q: 'Tôi không biết cách đọc chữ Hán này.', answers: V('このかんじのよみかたがわかりません。', 'この{漢字|かんじ}の{読|よ}み{方|かた}がわかりません。', 'この{漢字|かんじ}のよみかたがわかりません。'), hint: 'よみかた · わかりません' },
        { q: 'Cách dùng máy tính.', answers: V('パソコンのつかいかた', 'パソコンの{使|つか}い{方|かた}'), hint: 'つかいかた' },
      ],
    },
  ],
};
/* ═══════════════════════ SLOT 18 — L7.3 みんなで楽しいパーティー ═══════════════════════ */

const SLOT_18: Lesson = {
  id: 'slot-18-l7-3-tiec',
  kind: 'grammar',
  title: 'Slot 18 — Bài 7.3「みんなで楽しいパーティー」: ～ています · ～ましょうか · だれが · まだ/もう',
  goal: 'Ở bữa tiệc, nói được ai đang làm gì (V ています), chủ động đề nghị giúp (V ましょうか), hỏi "ai đã làm" bằng だれが và hỏi còn/hết bằng まだ・もう (ポイント 64, 65, 67, 68).',
  minutes: 60,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 18 cô dạy gì',
      items: [
        '**できること** của ST 3: chủ động nói giúp một tay, mời món ăn/đồ uống — những câu bạn dùng khi đi dự tiệc bạn bè.',
        '**Từ mới**: ギター · だいどころ · たばこ · でんわ · ピザ · まど (+ うたいます · すいます · はなします · ひきます · かけます).',
        '**チャレンジ 1** — **ダニエルさんは どこに いますか。あそこで たばこを すっています**: **V て います** (đang V).',
        '**チャレンジ 2** — **しゃしんを とりましょうか**: đề nghị làm giúp. **チャレンジ 3** — **だれが ケーキを つくりましたか**. **チャレンジ 4** — **ビールは まだ ありますか。もう ありません**.',
        '**やってみよう 3** (sách p.133).',
      ],
    },
    {
      t: 'vocab',
      items: [
        { w: 'ギター', pos: 'Danh từ', ipa: 'gitaa', vi: 'đàn ghi-ta', ex: 'ギターを ひいて ください。', exRo: 'Gitaa o hiite kudasai.', exVi: 'Hãy chơi ghi-ta nhé.' },
        { w: '{台所|だいどころ}', pos: 'Danh từ', ipa: 'daidokoro', vi: 'nhà bếp', ex: '{台所|だいどころ}で おさらを あらっています。', exRo: 'Daidokoro de osara o aratte imasu.', exVi: 'Đang rửa đĩa trong bếp.' },
        { w: 'たばこ', pos: 'Danh từ', ipa: 'tabako', vi: 'thuốc lá', ex: 'たばこは そとで すって ください。', exRo: 'Tabako wa soto de sutte kudasai.', exVi: 'Thuốc lá hãy hút bên ngoài.' },
        { w: '{電話|でんわ}', pos: 'Danh từ', ipa: 'denwa', vi: 'điện thoại', ex: '{電話|でんわ}を かけます。', exRo: 'Denwa o kakemasu.', exVi: 'Gọi điện thoại.' },
        { w: 'ピザ', pos: 'Danh từ', ipa: 'piza', vi: 'bánh pizza', ex: 'ピザを たべませんか。', exRo: 'Piza o tabemasen ka.', exVi: 'Ăn pizza không?' },
        { w: '{窓|まど}', pos: 'Danh từ', ipa: 'mado', vi: 'cửa sổ', ex: '{窓|まど}を あけましょうか。', exRo: 'Mado o akemashou ka.', exVi: 'Để tôi mở cửa sổ nhé?' },
        { w: '{歌|うた}います', pos: 'Động từ nhóm 1', ipa: 'utaimasu', vi: 'hát', ex: 'ギターを ひいて、{歌|うた}を {歌|うた}います。', exRo: 'Gitaa o hiite, uta o utaimasu.', exVi: 'Vừa chơi ghi-ta vừa hát.', more: 'て: うたって.' },
        { w: '{吸|す}います', pos: 'Động từ nhóm 1', ipa: 'suimasu', vi: 'hút (thuốc)', ex: 'たばこを {吸|す}います。', exRo: 'Tabako o suimasu.', exVi: 'Hút thuốc.', more: 'て: すって.' },
        { w: '{弾|ひ}きます', pos: 'Động từ nhóm 1', ipa: 'hikimasu', vi: 'chơi (đàn dây, piano)', ex: 'ピアノを {弾|ひ}きます。', exRo: 'Piano o hikimasu.', exVi: 'Chơi piano.', more: 'て: ひいて.' },
        { w: 'かけます', pos: 'Động từ nhóm 2', ipa: 'kakemasu', vi: 'gọi (điện thoại), treo', ex: 'ワンさんは でんわを かけています。', exRo: 'Wan-san wa denwa o kakete imasu.', exVi: 'Chị Wang đang gọi điện.', more: 'Nhóm II → て: かけて.' },
      ],
    },

    /* ── ています ── */
    { t: 'h', text: 'チャレンジ 1 — 「あそこで たばこを すっています」  ·  ポイント 64' },
    {
      t: 'p',
      text: 'Slide: **A：ダニエルさんは どこに いますか。B：あそこで たばこを すっています。** Khung cô ghi: **"CÁC MẪU CÂU VỚI ĐỘNG TỪ DẠNG -TE — Câu tiếp diễn: thể hiện hành động đang diễn ra — (Đang…)"**. Ví dụ: バスを まちます → **バスを まっています** (đang đợi xe buýt); たばこを すいます → **すっています**; 日本語を べんきょうします → **べんきょうしています**.',
    },
    {
      t: 'rule',
      formula: 'V て ＋ います。',
      vi: 'Đang V (hành động đang diễn ra ngay lúc nói). Thể て chia theo nhóm (Slot 16).',
    },
    {
      t: 'table',
      caption: 'れい） CD を ききます ＝＞ CD を きいています — sáu hình ①–⑥ của slide (đáp án)',
      head: ['#', 'Hành động', 'Câu đáp', 'Romaji'],
      rows: [
        ['①', 'rửa', 'あらって います。', 'Aratte imasu.'],
        ['②', 'hát', 'うたって います。', 'Utatte imasu.'],
        ['③', 'chơi đàn', 'ひいて います。', 'Hiite imasu.'],
        ['④', 'gọi điện', 'かけて います。', 'Kakete imasu.'],
        ['⑤', 'nói chuyện', 'はなして います。', 'Hanashite imasu.'],
        ['⑥', 'hút thuốc', 'すって います。', 'Sutte imasu.'],
      ],
    },
    {
      t: 'table',
      caption: 'Hỏi "なにを していますか" — 5 hình trên slide',
      head: ['Hình', 'Hỏi', 'Đáp'],
      rows: [
        ['chụp ảnh', 'なにを していますか。', 'しゃしんを とって います。'],
        ['chơi ghi-ta', 'なにを していますか。', 'ギターを ひいて います。'],
        ['ăn tiệc', 'なにを していますか。', 'しょくじして います。'],
        ['gọi điện', 'なにを していますか。', 'でんわを かけて います。'],
        ['nghe nhạc', 'なにを していますか。', 'おんがくを きいて います。'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('ダニエルさんは あそこで たばこを すっています。', 'Danieru-san wa asoko de tabako o sutte imasu.', 'Daniel đang hút thuốc ở đằng kia.'),
        E('{今|いま}、{日本語|にほんご}の うたを きいています。', 'Ima, nihongo no uta o kiite imasu.', 'Bây giờ tôi đang nghe bài hát tiếng Nhật.'),
        E('ダニエルさんは {今|いま} だいどころで おさらを あらっています。', 'Danieru-san wa ima daidokoro de osara o aratte imasu.', 'Bây giờ Daniel đang rửa đĩa ở bếp.'),
        E('アンナさんは {今|いま} へやの なかで ごかぞくに でんわを かけています。', 'Anna-san wa ima heya no naka de gokazoku ni denwa o kakete imasu.', 'Bây giờ Anna đang gọi điện cho gia đình trong phòng.'),
        E('ナタポンさんは {今|いま} どこで たばこを すっていますか。', 'Natapon-san wa ima doko de tabako o sutte imasu ka.', 'Bây giờ Natapon đang hút thuốc ở đâu?'),
        E('パクさんは {今|いま} {隣|となり}の へやで ワンさんと はなして います。', 'Paku-san wa ima tonari no heya de Wan-san to hanashite imasu.', 'Bây giờ Park đang nói chuyện với Wang ở phòng bên cạnh.'),
      ],
    },
    DL('Tìm người trong tiệc (slide 会話練習 với hình A–E)', [
        ['男', 'a', 'A さんは どこに いますか。', 'A-san wa doko ni imasu ka.', 'A đang ở đâu?'],
        ['女', 'b', 'あそこに います。あそこで E さんと はなしていますよ。', 'Asoko ni imasu. Asoko de E-san to hanashite imasu yo.', 'Đang ở đằng kia. Đang nói chuyện với E ở đó đấy.'],
    ]),
    {
      t: 'note',
      title: 'Cách nhớ & lỗi hay mắc',
      items: [
        '**Ghép đúng**: chia て rồi + **います**. Lỗi gấp ba: ① sai て-form (~~すいて~~ ✗ → **すって**), ② bỏ い (~~すってます~~ khi thi chấp nhận trong hội thoại nhanh nhưng bài viết dùng **います**), ③ dùng ます thay vì ています (~~あそこで たばこを すいます~~ = "tôi hút" thói quen/kế hoạch).',
        '**います trong ～ています luôn là います** (không phải あります) — dù chủ thể là đồ vật nhưng việc "đang diễn ra" thì chủ ngữ vẫn là người.',
        '**Trợ từ**: giữ nguyên như câu ます — **N を V ています**, **N で V ています** (nơi), **N と V ています** (với ai).',
        '**Nhóm động từ**: かけて (II), ひいて (I: き → いて), はなして (I: し → して), すって (I: い → って).',
        '**Hỏi người**: ~さんは どこに いますか → あそこで ～ています (nói "ở đâu" + "đang làm gì").',
        '**Đừng nhầm** ～ています (đang làm) với ～て います (trạng thái kéo dài — ví dụ けっこんしています, đã học sau). Bài này chỉ cần nghĩa "đang".',
      ],
    },

    /* ── ましょうか ── */
    { t: 'h', text: 'チャレンジ 2 — 「しゃしんを とりましょうか」  ·  ポイント 65' },
    {
      t: 'p',
      text: 'Slide: **A：しゃしんを とりましょうか。B：あ、ありがとうございます。おねがいします。** Cô gloss: **"(Để tôi … nhé)"** — **てつだいます → てつだいましょうか** ("Để tôi giúp bạn nhé!"); **かさを かします → かさを かしましょうか** (Để tôi cho bạn mượn ô nhé!); **しおを とります → しおを とりましょうか** (Để tôi lấy muối cho bạn nhé!). Ghi chú: **"Trả lời: はい、V"**.',
    },
    {
      t: 'rule',
      formula: 'V ましょうか。 → はい、おねがいします。',
      vi: 'Để tôi V nhé? — **đề nghị làm giúp**. Nhận: はい、おねがいします / ありがとうございます.',
    },
    {
      t: 'table',
      caption: 'Sáu hình ①–⑥ trên slide: れい） ケーキを きります → ケーキを きりましょうか (đáp án)',
      head: ['#', 'Đáp án', 'Romaji'],
      rows: [
        ['①', 'とりましょうか。', 'Torimashou ka.'],
        ['②', 'あらいましょうか。', 'Araimashou ka.'],
        ['③', 'もちましょうか。', 'Mochimashou ka.'],
        ['④', 'もってきましょうか。', 'Motte kimashou ka.'],
        ['⑤', 'あけましょうか。', 'Akemashou ka.'],
        ['⑥', 'しめましょうか。', 'Shimemashou ka.'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('まどを あけましょうか。', 'Mado o akemashou ka.', 'Để tôi mở cửa sổ nhé?'),
        E('コップを あらいましょうか。', 'Koppu o araimashou ka.', 'Để tôi rửa cốc cho bạn nhé?'),
        E('かばんを もちましょうか。', 'Kaban o mochimashou ka.', 'Để tôi cầm cặp giúp bạn nhé?'),
        E('おさらを もってきましょうか。', 'Osara o motte kimashou ka.', 'Để tôi mang đĩa đến cho bạn nhé?'),
        E('まどを しめましょうか。', 'Mado o shimemashou ka.', 'Để tôi đóng cửa sổ nhé?'),
        E('そうじ しましょうか。', 'Souji shimashou ka.', 'Để tôi dọn dẹp nhé?'),
        E('しゃしんを とりましょうか。', 'Shashin o torimashou ka.', 'Để tôi chụp ảnh cho bạn nhé?'),
      ],
    },
    DL('Hội thoại 会話練習 — đề nghị giúp (viết lại)', [
        ['A', 'a', 'あつい ですね。まどを あけましょうか。', 'Atsui desu ne. Mado o akemashou ka.', 'Nóng nhỉ. Để tôi mở cửa sổ nhé?'],
        ['B', 'b', 'あ、ありがとうございます。おねがいします。', 'A, arigatou gozaimasu. Onegai shimasu.', 'À, cảm ơn bạn. Nhờ bạn nhé.'],
        ['A', 'a', 'もちましょうか。', 'Mochimashou ka.', 'Để tôi cầm nhé?'],
        ['B', 'b', 'あ、ありがとうございます。おねがいします。', 'A, arigatou gozaimasu. Onegai shimasu.', 'À, cảm ơn. Nhờ bạn.'],
    ]),
    {
      t: 'note',
      title: 'Cách nhớ & lỗi hay mắc (ポイント 65)',
      items: [
        '**ましょうか** = đề nghị **của người nói làm cho người nghe** ("để tôi …"). **ましょう** (Slot 10) = rủ **cùng làm**. Cùng một từ, khác "ai làm": ましょうか → TÔI làm; ませんか/ましょう → CHÚNG TA làm.',
        '**Nhận**: **はい、おねがいします / ありがとうございます**. **Từ chối nhẹ**: **いいえ、だいじょうぶです** ("không sao, được rồi") — học sau; bài này chỉ cần nhận.',
        '**Không dùng ましょうか cho việc người kia phải làm**: ~~あなたが やりましょうか~~ ✗ — nếu muốn nhờ, dùng V て ください.',
        '**Đổi đuôi**: V**ます** → V**ましょうか**. Nhóm III: します → しましょうか; きます → きましょうか.',
        'Cô nhấn ở slide: **Trả lời: はい、V** nghĩa "Vâng, (nhờ bạn) V" — tuy nhiên cách thi mẫu là はい、おねがいします.',
      ],
    },

    /* ── だれが ── */
    { t: 'h', text: 'チャレンジ 3 — 「だれが この ケーキを つくりましたか」  ·  ポイント 68' },
    {
      t: 'p',
      text: 'Slide: **A：だれが この ケーキを つくりましたか。B：アンナさんが つくりました。** Cô viết: **"Từ để hỏi が ～か。 — ～が～"** và đặt bốn từ nghi vấn: **だれが · いつが · どこが · なにが**. Cô giải thích: **"Hỏi cho đối tượng là chủ thể của câu"** — tức là hỏi **ai làm / cái gì xảy ra**.',
    },
    {
      t: 'rule',
      formula: 'だれ が V ましたか。→ N が V ました。',
      vi: 'Hỏi **ai** là người làm: dùng **が** sau từ hỏi. Đáp: tên người + が + động từ.',
    },
    {
      t: 'table',
      caption: 'Hỏi chủ thể: だれが ↔ N が',
      head: ['Hỏi', 'Đáp', 'Nghĩa'],
      rows: [
        ['だれが この ケーキを つくりましたか。', 'アンナさんが つくりました。', 'Ai làm bánh này? — Anna làm.'],
        ['だれが もって きましたか。', 'アンナさんが もって きました。', 'Ai mang đến? — Anna mang.'],
        ['だれが いきますか。', 'わたしが いきます。', 'Ai đi? — Tôi đi.'],
      ],
    },
    DL('Hội thoại 会話練習 (viết lại)', [
        ['A', 'a', 'だれが もって きましたか。', 'Dare ga motte kimashita ka.', 'Ai mang đến vậy?'],
        ['B', 'b', 'アンナさんが もって きました。', 'Anna-san ga motte kimashita.', 'Anna mang đến.'],
    ]),
    {
      t: 'table',
      caption: 'Ba câu dịch trong slide tổng hợp — đáp án mẫu (slide chỉ đưa tiếng Việt)',
      head: ['Tiếng Việt', 'Tiếng Nhật', 'Romaji'],
      rows: [
        ['Ngày mai bạn Lan sẽ mang bánh ngọt tới.', 'あした ランさんが ケーキを もって きます。', 'Ashita Ran-san ga keeki o motte kimasu.'],
        ['Anh Kim đang nói chuyện với khách hàng.', 'キムさんは きゃくさまと はなして います。', 'Kimu-san wa kyakusama to hanashite imasu.'],
        ['Cô giáo sẽ không đi du lịch cùng mọi người.', 'せんせいは みんなと いっしょに りょこうに いきません。', 'Sensei wa minna to issho ni ryokou ni ikimasen.'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ & lỗi hay mắc (ポイント 68)',
      items: [
        '**Hỏi chủ thể dùng が, KHÔNG dùng は**: ~~だれは つくりましたか~~ ✗ → **だれが** つくりましたか ✓. Đây là mục thi thường gặp.',
        '**Đáp cũng dùng が**: アンナさん**が** つくりました (nhấn mạnh "chính là Anna"). Nếu đã nhắc tới Anna rồi thì mới là アンナさん**は**.',
        'Bốn từ hỏi trong slide: **だれが** (ai) · **いつが** (khi nào, ví dụ **いつが いいですか**) · **どこが** (chỗ nào, **どこが いちばん おもしろいですか** — Slot 12) · **なにが** (cái gì — **なにが ありますか**, Slot 15).',
        '**Tên khách**: きゃくさま (khách hàng, lịch sự); trong hội thoại đời thường dùng おきゃくさん.',
        '**いっしょに + と** : みんな**と** いっしょに (cùng với mọi người).',
      ],
    },

    /* ── まだ/もう ── */
    { t: 'h', text: 'チャレンジ 4 — 「ビールは まだ ありますか」  ·  ポイント 67' },
    {
      t: 'p',
      text: 'Slide: **A：ビールは まだ ありますか。B：すみません。もう ありません。** Cô nhấn: **まだ あります = Vẫn còn · もう ありません = Không còn nữa**, rồi vẽ bảng so sánh bằng chuyện tiền: **お金が まだ あります (VẪN CÓ) · お金が まだ ありません (VẪN CHƯA CÓ ... ) · お金が もう ありません (KHÔNG CÓ NỮA)**.',
    },
    {
      t: 'table',
      caption: 'Bốn cách nói "còn/hết" (slide tổng hợp: まだ VS もう)',
      head: ['Câu', 'Nghĩa', 'Dùng khi'],
      rows: [
        ['おかねが **まだ** あります。', 'Vẫn còn tiền.', 'Số lượng chưa hết'],
        ['おかねが **もう** ありません。', 'Không còn tiền nữa.', 'Số lượng đã hết'],
        ['おかねが **まだ** ありません。', 'Vẫn chưa có tiền (chưa kiếm được).', 'Chưa có tới giờ (hiếm gặp)'],
        ['ビールは **まだ** ありますか。', 'Bia còn không?', 'Hỏi kiểm tra còn hay hết'],
      ],
    },
    {
      t: 'table',
      caption: 'So sánh với もう Vましたか (Slot 13) và まだ V ていません',
      head: ['Mẫu', 'Hỏi', 'Đáp có', 'Đáp chưa'],
      rows: [
        ['Bài 6: もう V ましたか', 'しゅくだいを もう しましたか。', 'はい、もう しました。', 'いいえ、**まだです**。'],
        ['Bài 7: まだ V ていません', '(cùng ý)', '—', 'いいえ、**まだ して いません**。 (nói đầy đủ hơn)'],
        ['Bài 7: まだ／もう あります', 'ビールは まだ ありますか。', 'はい、まだ あります。', 'いいえ、**もう ありません**。'],
      ],
    },
    DL('Hội thoại slide — mời món (viết lại)', [
        ['A', 'a', 'サラダは まだ ありますか。', 'Sarada wa mada arimasu ka.', 'Salad còn không?'],
        ['B', 'b', 'はい、まだ あります。どうぞ。', 'Hai, mada arimasu. Douzo.', 'Còn đấy. Mời bạn.'],
        ['A', 'a', 'ありがとうございます。', 'Arigatou gozaimasu.', 'Cảm ơn bạn.'],
        ['A', 'a', 'ビールは まだ ありますか。', 'Biiru wa mada arimasu ka.', 'Bia còn không?'],
        ['B', 'b', 'すみません。もう ありません。ワインは どうですか。', 'Sumimasen. Mou arimasen. Wain wa dou desu ka.', 'Xin lỗi, hết rồi. Rượu vang thì sao?'],
        ['A', 'a', 'いいですね。', 'Ii desu ne.', 'Hay đấy.'],
    ]),
    {
      t: 'table',
      caption: '5 hình ①–⑤ trên slide — hỏi/đáp còn hay hết',
      head: ['#', 'Hỏi', 'Đáp'],
      rows: [
        ['①', 'つめたい おちゃは まだ ありますか。', 'はい、まだ あります。'],
        ['②', 'カレーは まだ ありますか。', 'いいえ、もう ありません。'],
        ['③', 'ケーキは まだ ありますか。', 'いいえ、もう ありません。'],
        ['④', 'ごはんは まだ ありますか。', 'はい、まだ たくさん あります。'],
        ['⑤', 'ジュースは まだ ありますか。', 'はい、まだ すこし あります。'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ & lỗi hay mắc (ポイント 67)',
      items: [
        '**まだ ありますか** = "còn không?" → **まだ あります** (còn) / **もう ありません** (hết). Cả hai もう/まだ đứng **trước động từ**.',
        '**Dễ nhầm**: ~~まだ ありません~~ khi muốn nói hết — đúng là **もう ありません**. まだ ありません nghĩa là "chưa có" (chưa xuất hiện).',
        '**たくさん** (nhiều) và **すこし** (một ít) đi sau まだ: まだ たくさん あります / まだ すこし あります.',
        'Hai もう: "đã (xong)" khi đi với **V ました** (Slot 13); "không còn" khi đi với **ありません** (Slot 18). Nhìn đuôi câu để biết.',
        '**どうぞ** khi đưa đồ; **おねがいします** khi nhờ; **ワインは どうですか** = gợi ý món khác (ポイント 58).',
      ],
    },
    {
      t: 'note',
      title: 'Cô hay hỏi gì khi gọi phát biểu (Slot 18)',
      items: [
        '"**いま なにを していますか。**" — chỉ vào hình hoặc bạn trong lớp → **～て います** (きいて/かいて/はなして/すって…). Có thể hỏi "**〇〇さんは いま どこで なにを していますか**".',
        '"**まどを しめましょうか。**" (cô thử bạn) — đáp **はい、おねがいします** hoặc nhờ ngược lại.',
        '"**だれが 〇〇を しましたか。**" — nhìn quanh lớp và đáp **〇〇さんが …**.',
        '"**ビールは まだ ありますか。**" (cô giơ chai rỗng) — bạn đáp **すみません、もう ありません**.',
      ],
    },
    {
      t: 'mcq',
      id: 'slot18-luyen',
      title: 'Luyện — ています · ましょうか · だれが · まだ/もう (có giải thích)',
      items: [
        { q: 'ダニエルさんは あそこで たばこを（　）。', options: ['すっています', 'すいます', 'すっていません', 'すいました'], correct: 0, why: 'Đang hút = **すっています** (すいます → すって + います). ポイント 64.' },
        { q: 'まどを（　）か。(Để tôi mở nhé?)', options: ['あけましょう', 'あけましょうか', 'あけて', 'あけますか'], correct: 1, why: 'Đề nghị làm giúp = **ましょうか**. ポイント 65.' },
        { q: '（　）この ケーキを つくりましたか。', options: ['だれが', 'だれは', 'だれを', 'だれに'], correct: 0, why: 'Hỏi chủ thể → **だれが**. ポイント 68.' },
        { q: '「ビールは まだ ありますか。」「すみません。（　）ありません。」', options: ['もう', 'まだ', 'ぜひ', 'まず'], correct: 0, why: 'Hết = **もう ありません**. ポイント 67.' },
        { q: 'パクさんは {今|いま} ギターを（　）。', options: ['ひいています', 'ひきています', 'ひっています', 'ひんでいます'], correct: 0, why: 'ひきます → き → **いて** → ひいて + います.' },
        { q: 'A：しゃしんを とりましょうか。B：（　）。', options: ['おねがいします', 'いきましょう', 'ありません', 'まだです'], correct: 0, why: 'Nhận đề nghị = **おねがいします / ありがとうございます**.' },
        { q: 'アンナさんは {今|いま} {部屋|へや}で ごかぞくに でんわを（　）。', options: ['かけています', 'かいています', 'かって います', 'かけます'], correct: 0, why: 'かけます (nhóm II) → かけて + います.' },
        { q: '「ジュースは まだ ありますか。」「はい、まだ（　）あります。」(còn ít)', options: ['すこし', 'もう', 'ぜひ', 'ぜんぜん'], correct: 0, why: '**すこし** = một ít; たくさん = nhiều.' },
      ],
    },
    {
      t: 'quiz',
      id: 'slot18-luyen-dich',
      title: 'Luyện dịch Việt → Nhật',
      kind: 'translate',
      grammar: 'V ています · V ましょうか · だれが · まだ／もう',
      items: [
        { q: 'Anh Daniel đang hút thuốc ở đằng kia.', answers: V('ダニエルさんはあそこでたばこをすっています。', 'ダニエルさんはあそこでたばこを{吸|す}っています。'), hint: 'すっています' },
        { q: 'Để tôi mở cửa sổ nhé?', answers: V('{窓|まど}をあけましょうか。', 'まどをあけましょうか。', 'まどを{開|あ}けましょうか。'), hint: 'あけましょうか' },
        { q: 'Ai đã làm bánh này?', answers: V('だれがこのケーキをつくりましたか。', 'だれがこのケーキを{作|つく}りましたか。'), hint: 'だれが' },
        { q: 'Bia còn không? — Xin lỗi, hết rồi.', answers: V('ビールはまだありますか。すみません。もうありません。'), hint: 'まだ · もう' },
        { q: 'Park đang chơi ghi-ta ở phòng bên.', answers: V('パクさんは{隣|となり}の{部屋|へや}でギターをひいています。', 'パクさんはとなりのへやでギターを{弾|ひ}いています。'), hint: 'ひいています' },
      ],
    },
  ],
};

/* ═══════════════════════ SLOT 19 — Ôn Kanji 7 · Ôn L7 · Chữa BT7 ═══════════════════════ */

const SLOT_19: Lesson = {
  id: 'slot-19-on-kanji7-on-l7-chua-bt7',
  kind: 'review',
  title: 'Slot 19 — Ôn chữ Hán bài 7 · ôn tập Bài 7 · chữa bài tập Bài 7',
  goal: 'Nhận mặt đủ 21 từ chữ Hán Bài 7 trên slide, tóm lại 11 ポイント + thể て của Bài 7 trong một trang, và biết cách chữa bài tập Bài 7.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      title: 'Buổi 19 cô dạy gì',
      items: [
        '**Slide 漢字 7 課**: 21 từ ghép hiragana ↔ chữ Hán (肉 · 半分 · 料理 · 小学生 · 小人 · 半日 · 大会 · 大人 · 料金 · 長野 · 一時半 · 小学校 · 半年 · 大きい · 半ば · 牛肉 · 大半 · 大学 · 野菜 · 半月 · 鶏肉).',
        '**Ôn tập Bài 7** (slide chỉ ghi tiêu đề): vị trí · あります/います · thể て · ～て ください · ～ています · ～ましょうか · だれが · まだ/もう.',
        '**Chữa bài tập Bài 7** — đáp án + giải thích đầy đủ ở bài **"BT từ vựng & ngữ pháp Bài 6–7"** và **"Chia thể て (bài tập bài 7)"**.',
      ],
    },
    { t: 'h', text: 'Phần 1 — Ôn chữ Hán bài 7: bảng đủ trên slide' },
    {
      t: 'table',
      caption: 'Slide ghép hai cột (hiragana ↔ chữ Hán). Tự che một cột để luyện.',
      head: ['Chữ Hán', 'Đọc', 'Romaji', 'Nghĩa'],
      rows: [
        ['{肉|にく}', 'にく', 'niku', 'thịt'],
        ['{牛肉|ぎゅうにく}', 'ぎゅうにく', 'gyuuniku', 'thịt bò'],
        ['{鶏肉|とりにく}', 'とりにく', 'toriniku', 'thịt gà'],
        ['{半分|はんぶん}', 'はんぶん', 'hanbun', 'một nửa'],
        ['{半日|はんにち}', 'はんにち／はんじつ', 'hannichi / hanjitsu', 'nửa ngày'],
        ['{半年|はんとし}', 'はんとし', 'hantoshi', 'nửa năm'],
        ['{半月|はんつき}', 'はんつき', 'hantsuki', 'nửa tháng'],
        ['{一時半|いちじはん}', 'いちじはん', 'ichiji han', '1 giờ rưỡi'],
        ['{半|なか}ば', 'なかば', 'nakaba', 'giữa chừng, khoảng giữa'],
        ['{大半|たいはん}', 'たいはん', 'taihan', 'phần lớn'],
        ['{料理|りょうり}', 'りょうり', 'ryouri', 'món ăn, nấu ăn'],
        ['{料金|りょうきん}', 'りょうきん', 'ryoukin', 'tiền phí'],
        ['{野菜|やさい}', 'やさい', 'yasai', 'rau'],
        ['{長野|ながの}', 'ながの', 'Nagano', 'tỉnh Nagano'],
        ['{大学|だいがく}', 'だいがく', 'daigaku', 'đại học'],
        ['{大会|たいかい}', 'たいかい', 'taikai', 'đại hội, giải đấu'],
        ['{大人|おとな}', 'おとな', 'otona', 'người lớn'],
        ['{大|おお}きい', 'おおきい', 'ookii', 'to'],
        ['{小学校|しょうがっこう}', 'しょうがっこう', 'shougakkou', 'trường tiểu học'],
        ['{小学生|しょうがくせい}', 'しょうがくせい', 'shougakusei', 'học sinh tiểu học'],
        ['{小人|こびと}', 'こびと', 'kobito', 'người tí hon'],
      ],
    },
    {
      t: 'note',
      title: 'Bẫy hay gặp khi đọc',
      items: [
        '**大 đọc 3 kiểu**: **だい** (大学 だいがく) · **たい** (大会 たいかい, 大半 たいはん) · **おお** (大きい) · **おと** (大人 おとな). Không có quy tắc đơn giản — học theo từ.',
        '**半 đọc はん** (半分, 半年, 半日) nhưng **なか** trong 半ば và **は** khi nối với giờ: 一時**半** = いちじ**はん**.',
        '**小学校 しょうがっこう** có **っ** (âm ngắt) vì ショウ + ガッ + コウ. 小学生 **しょうがくせい** không có っ.',
        '**野菜 やさい** và **長野 ながの** đều có 野 nhưng đọc khác (や・の).',
        '**肉** trong **牛肉** đọc **にく** nhưng biến **ぎゅうにく** (牛 = ぎゅう). **鶏肉 とりにく** (鶏 = とり).',
      ],
    },
    {
      t: 'readkanji',
      id: 'slot19-doc-kanji7',
      title: 'Ôn đọc KHÔNG furigana — gộp chữ Hán bài 6–7',
      note: 'Cô cho đề đọc kiểu này trong Test 2. Đọc to rồi so đáp án.',
      items: [
        { text: '{来週|らいしゅう}、{長野|ながの}で{大会|たいかい}があります。', ro: 'Raishuu, Nagano de taikai ga arimasu.', vi: 'Tuần sau Nagano có đại hội.' },
        { text: '{大人|おとな}の{料金|りょうきん}は{今|いま}{高|たか}いです。', ro: 'Otona no ryoukin wa ima takai desu.', vi: 'Phí người lớn hiện nay đắt.' },
        { text: '{今日|きょう}は{半日|はんにち}だけ{会社|かいしゃ}で{働|はたら}きます。', ro: 'Kyou wa hannichi dake kaisha de hatarakimasu.', vi: 'Hôm nay tôi chỉ làm nửa ngày ở công ty.' },
        { text: '{小学生|しょうがくせい}が{野菜|やさい}を{切|き}ります。', ro: 'Shougakusei ga yasai o kirimasu.', vi: 'Học sinh tiểu học cắt rau.' },
        { text: '{牛肉|ぎゅうにく}の{料理|りょうり}を{食|た}べませんか。', ro: 'Gyuuniku no ryouri o tabemasen ka.', vi: 'Ăn món thịt bò không?' },
        { text: '{大学|だいがく}の{門|もん}の{前|まえ}で{会|あ}います。', ro: 'Daigaku no mon no mae de aimasu.', vi: 'Gặp trước cổng đại học.' },
        { text: '{一時半|いちじはん}に{帰|かえ}ります。', ro: 'Ichiji han ni kaerimasu.', vi: 'Tôi về lúc 1 giờ rưỡi.' },
        { text: '{半年|はんとし}で{日本語|にほんご}が{話|はな}せます。', ro: 'Hantoshi de nihongo ga hanasemasu.', vi: 'Trong nửa năm là nói được tiếng Nhật.' },
      ],
    },
    {
      t: 'quiz',
      id: 'slot19-quiz-doc',
      title: 'Gõ hiragana cho chữ Hán (Bài 6–7)',
      kind: 'fill',
      grammar: 'Đọc chữ Hán',
      items: [
        { q: '野菜', answers: ['やさい'], hint: 'đọc đặc biệt' },
        { q: '大人', answers: ['おとな'], hint: 'đọc đặc biệt' },
        { q: '小学校', answers: ['しょうがっこう'], hint: 'có っ' },
        { q: '半年', answers: ['はんとし'], hint: 'はん + とし' },
        { q: '牛肉', answers: ['ぎゅうにく'], hint: 'ぎゅう' },
        { q: '今年', answers: ['ことし'], hint: 'đặc biệt' },
        { q: '会社', answers: ['かいしゃ'], hint: 'công ty' },
        { q: '読書', answers: ['どくしょ'], hint: 'On-yomi' },
      ],
    },

    { t: 'h', text: 'Phần 2 — Ôn tập Bài 7 một trang (11 ポイント + thể て)' },
    {
      t: 'table',
      caption: 'Bảng ôn nhanh — hỏi mình từng dòng',
      head: ['PT', 'Mẫu', 'Ví dụ', 'Nhớ'],
      rows: [
        ['61', 'N1 は N2 に あります／います', 'ポストは えきの まえに あります。', 'vật あります · người います'],
        ['62', 'N1 に N2 が あります／います', 'へやに テレビが あります。', 'hỏi なにが/だれが; trống → なにも/だれも'],
        ['—', 'Thể て', 'いきます→いって · のみます→のんで', '3 nhóm; い・ち・り→って…'],
        ['63', 'V て ください', 'やさいを あらって ください。', 'nhờ, mời'],
        ['64', 'V て います', 'たばこを すっています。', 'đang V'],
        ['65', 'V ましょうか', 'まどを あけましょうか。', 'để tôi V nhé'],
        ['66', 'N の V かた', 'カレーの つくりかた', 'cách làm'],
        ['67', 'まだ／もう', 'ビールは まだ ありますか。もう ありません。', 'còn / hết'],
        ['68', 'だれが', 'だれが つくりましたか。', 'hỏi chủ thể bằng が'],
        ['69', 'どの N', 'どの おさらですか。', 'có danh từ'],
        ['70', 'どれ', 'さとうは どれですか。', 'không danh từ'],
        ['71', 'N で V', 'はしで たべます。', 'bằng dụng cụ / phương tiện'],
      ],
    },
    {
      t: 'note',
      title: 'Cách chữa Bài tập Bài 7 mà cô hay làm (Slot 19)',
      items: [
        '**Phần ポイントチェック (16 câu)**: cô đọc từng câu, cả lớp chọn đáp án đồng thanh rồi hỏi "なぜ?" — bạn phải nêu **lý do** (vì vật あります, vì dụng cụ で…). Đáp án + giải thích có ở bài BT trong mục này.',
        '**Phần thể て (bảng 1 nhóm/2 nhóm/3 nhóm)**: cô gọi từng bạn lên điền; đọc to cả cột "ます" và cột "て". Xem bài **Chia thể て (bài tập bài 7)**.',
        '**Phần hình (nhà bếp, bản đồ phố, công viên)**: nói tên đồ vật, vị trí, hành động trên hình. Bài BT có đáp án mẫu cho từng ô (một số ô tự giải theo hình).',
        '**Phần ghép đôi / trái nghĩa** (いれます ↔ だします, もってきます ↔ もっていきます, うしろ ↔ まえ, そと ↔ なか, みぎ ↔ ひだり).',
      ],
    },
    {
      t: 'mcq',
      id: 'slot19-luyen',
      title: 'Luyện tổng hợp Bài 7 (có giải thích)',
      items: [
        { q: 'ポストは ゆうびんきょく（　）まえに あります。', options: ['の', 'に', 'を', 'で'], correct: 0, why: 'N **の** từ chỉ vị trí.' },
        { q: 'いぬは こうえんに（　）。', options: ['います', 'あります', 'ありません', 'いきます'], correct: 0, why: 'Con vật → **います**.' },
        { q: 'あした 9じに（　）ください。(đến)', options: ['きて', 'いって', 'かえって', 'きいて'], correct: 0, why: 'きます → **きて**.' },
        { q: 'じどうはんばいきで ジュースを（　）。(đang mua)', options: ['かっています', 'かいています', 'かんでいます', 'かいます'], correct: 0, why: 'かいます → か**って** + います.' },
        { q: 'かんじの（　）を おしえて ください。', options: ['よみかた', 'よみかたが', 'よむかた', 'よみをかた'], correct: 0, why: 'よみ + かた = **よみかた**.' },
        { q: '「（　）おさらですか。」「その おさらです。」', options: ['どの', 'どれ', 'どこ', 'どんな'], correct: 0, why: 'どの + N.' },
        { q: '「ビールは まだ ありますか。」「いいえ、もう（　）。」', options: ['ありません', 'あります', 'います', 'ありました'], correct: 0, why: '**もう ありません** = hết rồi.' },
        { q: '{小学校|しょうがっこう}の{読|よ}み{方|かた}は？', options: ['しょうがっこう', 'こがっこう', 'しょうがくこう', 'ちいがっこう'], correct: 0, why: '小学校 = **しょうがっこう**.' },
      ],
    },
  ],
};
/* ═══════════════════════ BT TỪ VỰNG & NGỮ PHÁP BÀI 6–7 — ĐÁP ÁN ═══════════════════════ */

const BT_B67: Lesson = {
  id: 'bt-tu-vung-ngu-phap-b6-7',
  kind: 'homework',
  title: 'BT từ vựng & ngữ pháp Bài 6–7 — đáp án + giải thích (4 tệp BT của cô)',
  goal: 'Làm lại đúng các đề trong thư mục BT của cô (BT Từ vựng 06, 07 · BT Ngữ pháp 06, 07), đối chiếu đáp án và hiểu vì sao đúng.',
  minutes: 90,
  blocks: [
    {
      t: 'recap',
      title: 'Đọc trước khi làm',
      items: [
        '4 tệp PDF của cô là **bản scan bài tập (không có đáp án in sẵn)**. **Toàn bộ đáp án dưới đây là TỰ GIẢI** — đối chiếu với từ vựng/ngữ pháp của chính các Slot (Slot 10–19) và các bài Bài 6, Bài 7 của khoá.',
        'Câu nào **dựa vào hình** mà hình không đủ rõ để chắc 100% thì mình ghi **"(theo hình)"**; nếu nhiều đáp án đúng thì chấp nhận cách khác miễn đúng mẫu.',
        'Cách làm: che đáp án → tự làm trên giấy → mở xem → câu sai thì đọc lại **số ポイント** được ghi bên cạnh.',
        'Tổng: **Từ vựng Bài 6 (6 phần) · Từ vựng Bài 7 (5 phần) · Ngữ pháp Bài 6 (ポイントチェック 11 câu + 8 dạng bài + 練習) · Ngữ pháp Bài 7 (ポイントチェック 16 câu + 6 dạng bài + 練習 + hình công viên).**',
      ],
    },

    /* ═════ A. TỪ VỰNG BÀI 6 ═════ */
    { t: 'h', text: 'A. BT Từ vựng Bài 6 (4 trang: みんなで話そう · 確認しよう · もっと覚えよう)' },
    {
      t: 'table',
      caption: 'みんなで話そう — chia từ vào 3 nhóm (旅行 · 水泳 · 音楽)',
      head: ['Từ cho', 'Nhóm đúng', 'Vì sao'],
      rows: [
        ['うみ (biển)', '水泳 (bơi lội) — cũng chấp nhận 旅行', 'đi biển = bơi / du lịch'],
        ['みずぎ (đồ bơi)', '水泳', 'đồ để bơi'],
        ['おんせん (suối nước nóng)', '旅行', 'điểm đến khi đi chơi xa'],
        ['けしき (phong cảnh)', '旅行', 'đi du lịch để ngắm'],
        ['ちず (bản đồ)', '旅行', 'cần khi đi chơi'],
        ['ドライブ (lái xe đi chơi)', '旅行', 'đi chơi xa bằng xe'],
        ['カラオケ', '音楽', 'hát'],
        ['かしゅ (ca sĩ)', '音楽', 'người hát'],
        ['コンサート', '音楽', 'buổi nhạc'],
        ['チケット (vé)', '音楽 (vé hòa nhạc) — hoặc 旅行', 'cần vé để vào / đi'],
        ['ツアー (tour)', '旅行', 'chuyến đi theo tour'],
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú — "chia nhóm" có nhiều đáp án',
      items: [
        'Bài này cô cho **thảo luận cả lớp** nên không có đáp án duy nhất. Điều cô muốn nghe: bạn **gọi đúng tên từ** và **nói được lý do** (うみは すいえいです: Biển thì bơi).',
        'Từ mới đáng nhớ trong bài: **おんせん** (suối nước nóng), **けしき** (phong cảnh), **うみ** (biển) — có trong sách nhưng chưa nằm trong danh sách 55 từ.',
      ],
    },
    {
      t: 'table',
      caption: 'Trang 確認しよう 1 — ①〜④ là gì? (nhìn hình)',
      head: ['#', 'Hình', 'Đáp án', 'Romaji'],
      rows: [
        ['①', 'cầu thủ bóng chày', 'やきゅう', 'yakyuu'],
        ['②', 'rạp CINEMA', 'えいがかん', 'eigakan'],
        ['③', 'tàu điện ngầm', 'ちかてつ', 'chikatetsu'],
        ['④', 'tô mì ramen', 'ラーメン', 'raamen'],
      ],
    },
    {
      t: 'table',
      caption: 'Trang 確認しよう 2 — Từ chỉ thời gian bằng hiragana (きのう / きょう / あした)',
      head: ['', 'きのう', 'きょう', 'あした'],
      rows: [
        ['せんしゅう (tuần trước) · hàng', '—', '① **こんしゅう**', '② **らいしゅう**'],
        ['せんげつ (tháng trước) · hàng', '—', '③ **こんげつ**', '④ **らいげつ**'],
      ],
    },
    {
      t: 'note',
      title: 'Cách hiểu bảng thời gian',
      items: [
        'Đây là bảng "**quá khứ — hiện tại — tương lai**" theo từng đơn vị. Cột giữa = **これ** (kỳ này): こんしゅう / こんげつ; cột phải = **kỳ sau**: らいしゅう / らいげつ.',
        'Nếu cô hỏi mở rộng: **せんしゅう** (tuần trước) ↔ **こんしゅう** ↔ **らいしゅう** — **せんげつ ↔ こんげつ ↔ らいげつ**; năm: **きょねん ↔ ことし ↔ らいねん**.',
      ],
    },
    {
      t: 'mcq',
      id: 'bt6-tv-group',
      title: 'Trang 確認しよう 3 — Tên nhóm (グループの名前)',
      items: [
        { q: '例（　）: ラーメン · ハンバーグ · カレーライス', options: ['りょうり (món ăn)', 'のみもの', 'きせつ', 'くだもの'], correct: 0, why: 'Ví dụ của sách: nhóm **料理**.' },
        { q: '①（　）: みず · ジュース · ワイン', options: ['のみもの (đồ uống)', 'たべもの', 'くだもの', 'りょうり'], correct: 0, why: 'Nước, nước hoa quả, rượu vang → **のみもの**.' },
        { q: '②（　）: パン · たまご · イチゴ', options: ['たべもの (đồ ăn)', 'のみもの', 'きせつ', 'どうぶつ'], correct: 0, why: 'Bánh mì, trứng, dâu → **たべもの**.' },
        { q: '③（　）: はる · なつ · あき · ふゆ', options: ['きせつ (mùa)', 'つき', 'ようび', 'じかん'], correct: 0, why: 'Xuân hạ thu đông → **きせつ**.' },
      ],
    },
    {
      t: 'mcq',
      id: 'bt6-tv-chon',
      title: 'Trang 4 — どちらがいいですか (chọn từ đúng)',
      items: [
        { q: 'この居酒屋は{駅|えき}から［　］です。(はやい / ちかい)', options: ['はやい', 'ちかい'], correct: 1, why: 'Khoảng cách → **ちかい**. はやい = nhanh/sớm.' },
        { q: 'この{公園|こうえん}はとても［　］です。(ひろい / やすい)', options: ['ひろい', 'やすい'], correct: 0, why: 'Công viên → **ひろい** (rộng).' },
        { q: '{明日|あした}、{横浜|よこはま}でサッカーの［　］があります。(ようじ / しあい)', options: ['ようじ', 'しあい'], correct: 1, why: 'Sự kiện diễn ra ở Yokohama → **しあい** (trận đấu).' },
        { q: 'デパートの［　］に{行|い}きました。(コース / セール)', options: ['コース', 'セール'], correct: 1, why: 'Đi trung tâm thương mại → **セール**.' },
        { q: '{野球|やきゅう}を［　］。(します / あそびます)', options: ['します', 'あそびます'], correct: 0, why: 'Chơi thể thao = **します**; あそびます = đi chơi.' },
        { q: 'A:{明日|あした}、{映画|えいが}に{行|い}きませんか。 B:すみません。{明日|あした}は{友達|ともだち}と［　］がありますから……。', options: ['やくそく', 'ようじ'], correct: 0, why: '友達と → **やくそく** (hẹn với bạn). ようじ là việc riêng, không đi với "友達と".' },
        { q: 'A:ご飯とパンと［　］が{好|す}きですか。 B:［　］{好|す}きです。', options: ['どちら / どちらも', 'どちらも / どちら', 'どちら / どちら', 'どちらも / どちらも'], correct: 0, why: 'Hỏi hai vật → **どちら**; đáp cả hai → **どちらも**.' },
      ],
    },
    {
      t: 'mcq',
      id: 'bt6-tv-zehi',
      title: 'Trang 5 — 「ぜひ」の使い方が正しいものは？',
      items: [
        {
          q: 'Chọn câu dùng ぜひ ĐÚNG (chọn 1)',
          options: [
            'a. 一緒にお祭りに行きませんか。…ぜひ行きたいです。',
            'b. タイは今、暑いですか。…はい、ぜひ暑いです。',
            'c. 子どもチケットを買いますか。…はい、ぜひ買います。',
          ],
          correct: 0,
          why: '**ぜひ** = "nhất định" — đi với điều **mong muốn** (たいです, ください, ましょう). b nói trạng thái (暑い), c là hành động bình thường — đều sai.',
        },
      ],
    },
    {
      t: 'table',
      caption: 'Trang 6 — Điền chỗ trống từ khung (たべほうだい · ざんねん · またこんど · いっしょに)',
      head: ['Chỗ', 'Từ điền', 'Câu hoàn chỉnh'],
      rows: [
        ['①', 'いっしょに', '週末、友達と**いっしょに**渋谷へ遊びに行きました。'],
        ['②', 'ざんねん', 'パクさんはアルバイトがありましたから、来ませんでした。**ざんねん**でした。'],
        ['③', 'たべほうだい', '私たちは渋谷で買い物をしました。それから、**たべほうだい**に行きました。'],
        ['④', 'またこんど', 'とてもおいしかったです。**また今度**行きたいです。'],
      ],
    },
    {
      t: 'note',
      title: 'Giải thích 4 chỗ',
      items: [
        '**① いっしょに** + 遊びに行きます (cùng bạn đi chơi).',
        '**② ざんねん** = tiếc — vì Park **không đến được** ("ざんねんでした").',
        '**③ たべほうだい** = buffet — chọn sau "買い物をしました。それから…" (đi ăn).',
        '**④ また今度** = lần sau nữa; phù hợp câu cuối "とてもおいしかったです。…行きたいです".',
      ],
    },
    {
      t: 'table',
      caption: 'もっと覚えよう — 日本の有名なところ (bản đồ Nhật; ①②③ là đâu? theo gợi ý)',
      head: ['#', 'Gợi ý', 'Đáp án', 'Romaji'],
      rows: [
        ['①', '冬、とても寒いです。', '**北海道** (ほっかいどう) — vùng phía bắc', 'Hokkaidou'],
        ['②', '人が多いです。にぎやかです。', '**東京** (とうきょう)', 'Toukyou'],
        ['③', '古いお寺が多いです。', '**京都** (きょうと)', 'Kyouto'],
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú — bài nói cuối trang',
      items: [
        '"どこへ旅行に行きたいですか。" = bạn muốn đi du lịch đâu? Trả lời theo mẫu: **〇〇へ 行きたいです。〜から** (理由). Ví dụ: **北海道へ 行きたいです。ゆきが すきですから。**',
        'Địa danh trên bản đồ: 沖縄 おきなわ · 長野 ながの · 仙台 せんだい · 名古屋 なごや · 大阪 おおさか · 神戸 こうべ · 広島 ひろしま · 福岡 ふくおか.',
      ],
    },

    /* ═════ B. NGỮ PHÁP BÀI 6 ═════ */
    { t: 'h', text: 'B. BT Ngữ pháp Bài 6 (6 trang: ポイントチェック · 練習 1–7 · 練習 1–3 · 週末の約束)' },
    {
      t: 'mcq',
      id: 'bt6-np-poin',
      title: 'ポイントチェック — Bài 6 (11 câu)',
      items: [
        { q: '① A:{土曜日|どようび}、{一緒|いっしょ}にサッカーをしませんか。 B:すみません。{土曜日|どようび}、{用事|ようじ}［が / は］ありますから。', options: ['が', 'は'], correct: 0, why: 'あります đi với **が** (ポイント 50).' },
        { q: '② {今晩|こんばん}、{浅草|あさくさ}［に / で］お{祭|まつ}り［が / は］あります。', options: ['で / が', 'に / が', 'で / は', 'に / は'], correct: 0, why: 'Sự kiện diễn ra ở đâu → **で**; "có lễ hội" → **が** (ポイント 51).' },
        { q: '③ コンサートのチケット［が / ×］2{枚|まい}［が / ×］あります。', options: ['が / ×', '× / が', 'が / が', '× / ×'], correct: 0, why: 'チケット**が** 2まい (×) あります — số từ không có trợ từ (ポイント 52).' },
        { q: '④ スポーツ［に / で］サッカー［が / を］いちばん{好|す}きです。', options: ['で / が', 'に / が', 'で / を', 'に / を'], correct: 0, why: 'Phạm vi → **で**; すき đi với **が** (ポイント 53).' },
        { q: '⑤ A:バス［も / と］{地下鉄|ちかてつ}［も / と］どちらがいいですか。 B:{地下鉄|ちかてつ}［が / の］ほう［が / を］いいです。', options: ['と / と / の / が', 'も / も / が / を', 'と / も / の / が', 'も / と / の / を'], correct: 0, why: '**N1と N2と どちらが** + **N の ほうが** (ポイント 55–56).' },
        { q: '⑥ A:みどり{寿司|ずし}はとてもおいしいです［ね / よ］。 B:へえ。そうですか。', options: ['よ', 'ね'], correct: 0, why: 'A **báo tin mới** cho B (B nói へえ "thế à") → **よ** (ポイント 60).' },
        { q: '⑦ A:3{時|じ}にさくら{駅|えき}で{会|あ}いましょう。 B:3{時|じ}にさくら{駅|えき}です［ね / よ］。わかりました。', options: ['ね', 'よ'], correct: 0, why: 'B **nhắc lại để xác nhận** → **ね** (ポイント 59).' },
        { q: '⑧ バスは{電車|でんしゃ}［より / のほうが］{安|やす}いです。', options: ['より', 'のほうが'], correct: 0, why: 'N1は **N2より** A です (ポイント 54).' },
        { q: '⑨ A:パクさん、{一緒|いっしょ}に{昼|ひる}ご{飯|はん}を［食べますか / 食べませんか］。 B:いいですね。［食べましょう / 食べませんか］。 A:{何|なに}を{食|た}べますか。 B:［ラーメンを食べますか / ラーメンはどうですか］。 A:いいですね。', options: ['食べませんか / 食べましょう / ラーメンはどうですか', '食べますか / 食べましょう / ラーメンを食べますか', '食べませんか / 食べませんか / ラーメンはどうですか', '食べますか / 食べませんか / ラーメンを食べますか'], correct: 0, why: 'Rủ → **ませんか**; nhận → **ましょう**; đề xuất món → **N は どうですか** (ポイント 48, 49, 58).' },
        { q: '⑩ A:もう「キングマン」を［見ますか / 見ましたか］。 B:いいえ、［まだ見ません / まだです］。', options: ['見ましたか / まだです', '見ますか / まだです', '見ましたか / まだ見ません', '見ますか / まだ見ません'], correct: 0, why: 'もう + **ました** か → trả lời **まだです** (ポイント 57).' },
        { q: '⑪ A:{明日|あした}、{一緒|いっしょ}に{映画|えいが}を{見|み}に{行|い}きませんか。 B:［いいえ、行きません / すみません、ちょっと……］。', options: ['すみません、ちょっと……', 'いいえ、行きません'], correct: 0, why: 'Từ chối lịch sự = **すみません、ちょっと……** (ポイント 48).' },
      ],
    },
    {
      t: 'table',
      caption: '練習 1 — 5 tranh (rủ → nhận ○ / từ chối ×)  [theo hình: ① không ký hiệu, ②③ ○, ④⑤ ×]',
      head: ['#', 'Câu A (rủ)', 'Câu B (đáp)', 'Romaji'],
      rows: [
        ['①  土曜日 · bia', '土曜日、一緒にビールを飲みに行きませんか。', 'いいですね。行きましょう。', 'Doyoubi, issho ni biiru o nomi ni ikimasen ka. — Ii desu ne. Ikimashou.'],
        ['②  trường học', '一緒に学校へ行きませんか。', 'いいですね。行きましょう。', 'Issho ni gakkou e ikimasen ka. — Ii desu ne. Ikimashou.'],
        ['③  明日 · bóng đá', '明日、一緒にサッカーをしませんか。', 'いいですね。しましょう。', 'Ashita, issho ni sakkaa o shimasen ka. — Ii desu ne. Shimashou.'],
        ['④  週末 · lái xe · × 用事', '週末、一緒にドライブに行きませんか。', 'すみません、週末はちょっと……。用事がありますから。', 'Shuumatsu, issho ni doraibu ni ikimasen ka. — Sumimasen, shuumatsu wa chotto……. Youji ga arimasu kara.'],
        ['⑤  今晩 · karaoke · × 明日 test', '今晩、カラオケに行きませんか。', 'すみません、今晩はちょっと……。明日、テストがありますから。', 'Konban, karaoke ni ikimasen ka. — Sumimasen, konban wa chotto……. Ashita, tesuto ga arimasu kara.'],
      ],
    },
    {
      t: 'table',
      caption: '練習 2 — 「土曜日、浅草でお祭りがあります」 ba poster (A nói thông tin + rủ; B nhận lời)',
      head: ['#', 'Poster', 'Câu A (chỗ trống)', 'Romaji'],
      rows: [
        ['①', '日曜日 · お台場 · pháo hoa', '日曜日、お台場で花火があります。', 'Nichiyoubi, Odaiba de hanabi ga arimasu.'],
        ['②', '10日〜13日 · ニコニコショッピングビル · Sale 50%', '10日から13日まで、ニコニコショッピングビルでセールがあります。', 'Tooka kara juusannichi made, Nikoniko shoppingu biru de seeru ga arimasu.'],
        ['③', '土曜日 · 東京 · bóng đá Nhật–Brazil', '土曜日、東京でサッカーの試合があります。', 'Doyoubi, Toukyou de sakkaa no shiai ga arimasu.'],
      ],
    },
    {
      t: 'table',
      caption: '練習 3 — 「映画のチケットが2枚あります」 ba tranh (theo hình)',
      head: ['#', 'Câu A', 'Câu B', 'Romaji'],
      rows: [
        ['①  vé hòa nhạc · ○', 'コンサートのチケットが2枚あります。一緒に聞きに行きませんか。', 'いいですね。行きましょう。', 'Konsaato no chiketto ga nimai arimasu. Issho ni kiki ni ikimasen ka. — Ii desu ne. Ikimashou.'],
        ['②  vé phim · ○', '映画のチケットが2枚あります。一緒に見に行きませんか。', 'いいですね。行きましょう。', 'Eiga no chiketto ga nimai arimasu. Issho ni mi ni ikimasen ka. — Ii desu ne. Ikimashou.'],
        ['③  biển · × (đồ bơi)', '今度の週末、一緒に海へ行きませんか。', 'すみません、海はちょっと……。水着がありませんから。', 'Kondo no shuumatsu, issho ni umi e ikimasen ka. — Sumimasen, umi wa chotto……. Mizugi ga arimasen kara.'],
      ],
    },
    {
      t: 'table',
      caption: '練習 4 — 「さくら公園とみどり公園とどちらが近いですか」 bốn hình so sánh (hình cho sẵn lựa chọn khoanh tròn)',
      head: ['#', 'Hình', 'A (hỏi)', 'B (đáp)'],
      rows: [
        ['①', 'ハッピースーパー (牛乳 100円, たまねぎ 30円) vs ABスーパー (130円, 50円)', 'ハッピースーパーとABスーパーとどちらが安いですか。', 'ハッピースーパーのほうが安いです。'],
        ['②', 'バス 20分 vs 電車/地下鉄 10分', 'バスと電車とどちらが早いですか。', '電車のほうが早いです。'],
        ['③', 'ニコニコ映画館 200㎡ vs ふじ映画館 150㎡', 'ニコニコ映画館とふじ映画館とどちらが広いですか。', 'ニコニコ映画館のほうが広いです。'],
        ['④', 'biển vs núi (♥ ở giữa — theo hình, tự giải)', '海と山とどちらが好きですか。', '山のほうが好きです。 (chọn biển cũng đúng)'],
      ],
    },
    {
      t: 'note',
      title: 'Cách đặt câu cho 練習 4',
      items: [
        'Luôn viết **N1 と N2 と どちらが A ですか** — A là tính từ khớp với hình: **やすい** (giá), **はやい** (thời gian), **ひろい** (diện tích), **すき** (thích).',
        'Đáp **N の ほうが A です** (chọn cái được khoanh/đã thắng).',
        'Hai tính từ gần nhau: ② chọn **はやい** (nhanh) vì có đồng hồ ⏱; nếu hỏi **ちかい** thì không khớp hình thời gian.',
      ],
    },
    {
      t: 'quiz',
      id: 'bt6-np-ex5',
      title: '練習 5 — 「JTP のツアーは HLS のツアーよりおもしろいです」 (đặt câu theo gợi ý)',
      kind: 'translate',
      grammar: 'N1 は N2 より A です',
      items: [
        { q: 'タイ ＞ 韓国・遠い', answers: V('タイは{韓国|かんこく}より{遠|とお}いです。'), hint: 'タイ > かんこく: とおい' },
        { q: 'この携帯電話 ＞ パソコン・高い', answers: V('この{携帯電話|けいたいでんわ}はパソコンより{高|たか}いです。'), hint: 'たかい' },
        { q: '私の町 ＞ 東京・にぎやか', answers: V('{私|わたし}の{町|まち}は{東京|とうきょう}よりにぎやかです。', 'わたしのまちはとうきょうよりにぎやかです。'), hint: 'にぎやか' },
        { q: '昨日 ＞ 今日・寒い', answers: V('{昨日|きのう}は{今日|きょう}より{寒|さむ}いです。'), hint: 'さむい' },
        { q: '先週 ＞ 今週・暇 (ひま)', answers: V('{先週|せんしゅう}は{今週|こんしゅう}より{暇|ひま}です。'), hint: 'ひま' },
      ],
    },
    {
      t: 'quiz',
      id: 'bt6-np-ex6',
      title: '練習 6 — 「日本の食べ物ですしがいちばん好きです」 (đặt câu)',
      kind: 'translate',
      grammar: 'N1 で N2 が いちばん A です',
      items: [
        { q: '季節・秋・好き', answers: V('{季節|きせつ}で{秋|あき}がいちばん{好|す}きです。'), hint: 'きせつで あきが' },
        { q: '電器屋・サカイ電器・安い', answers: V('{電器屋|でんきや}でサカイ{電器|でんき}がいちばん{安|やす}いです。', '{電器屋|でんきや}でサカイでんきがいちばん{安|やす}いです。'), hint: 'でんきやで サカイでんきが' },
        { q: 'このレストラン・とんかつ・おいしい', answers: V('このレストランでとんかつがいちばんおいしいです。'), hint: 'レストランで とんかつが' },
        { q: '日本のお寺・法隆寺・古い', answers: V('{日本|にほん}のお{寺|てら}で{法隆寺|ほうりゅうじ}がいちばん{古|ふる}いです。'), hint: 'おてらで ほうりゅうじが' },
      ],
    },
    {
      t: 'table',
      caption: '練習 7 — 「もうお好み焼きを食べましたか」: điền câu đáp',
      head: ['#', 'A hỏi', 'B đáp', 'Romaji'],
      rows: [
        ['①', 'もう携帯電話を買いましたか。', 'はい、**もう買いました**。', 'Hai, mou kaimashita.'],
        ['②', 'もう昼ご飯を食べましたか。', 'いいえ、**まだです**。', 'Iie, mada desu.'],
        ['③', 'もう掃除をしましたか。', 'はい、**もうしました**。', 'Hai, mou shimashita.'],
        ['④', 'マルコさんはもう来ましたか。', 'いいえ、**まだです**。', 'Iie, mada desu.'],
      ],
    },
    {
      t: 'table',
      caption: '練習 1 (trang 38) — chia động từ trong ngoặc',
      head: ['Câu', 'Đáp án', 'Lý do'],
      rows: [
        ['A: もうお台場へ（行きます→　）。', '**行きましたか**', 'もう + ましたか (ポイント 57)'],
        ['B: いいえ、まだです。', '—', ''],
        ['A: じゃ、今度一緒に（行きます→　）。', '**行きませんか**', 'rủ (ポイント 48)'],
        ['B: いいですね。（行きます→　）。', '**行きましょう**', 'nhận lời (ポイント 49)'],
        ['A: お台場においしいカレー屋がありますよ。一緒に（食べに行きます→　）。', '**食べに行きませんか**', 'báo tin bằng よ rồi rủ lại'],
        ['B: はい。ぜひ（食べます→　）です。', '**食べたい**', 'ぜひ + たいです (Slot 13)'],
      ],
    },
    {
      t: 'table',
      caption: '練習 2 (trang 39) — hỏi bằng từ nghi vấn (khung: 何・いつ・誰・どこ・どちら・どう)',
      head: ['#', 'Câu hỏi cần điền', 'Từ hỏi', 'Câu đáp có sẵn'],
      rows: [
        ['例', 'スポーツで何がいちばん好きですか。', '何', '野球がいちばん好きです。'],
        ['①', 'お酒で**何が**いちばん好きですか。', '何', 'ビールがいちばん好きです。'],
        ['②', 'Bさんの国は1年で**いつが**いちばん寒いですか。', 'いつ', '2月がいちばん寒いです。'],
        ['③', '日本で**どこが**いちばんいいですか。', 'どこ', '北海道がいちばんいいです。'],
        ['④', '日本の歌手で**誰が**いちばん好きですか。', '誰', '田中愛がいちばん好きです。'],
        ['⑤', 'さくら公園とみどり公園と**どちらが**広いですか。', 'どちら', 'みどり公園のほうが広いです。'],
        ['⑥', 'A: 渋谷**はどうですか**。', 'どう', 'いいですね。そうしましょう。'],
      ],
    },
    {
      t: 'table',
      caption: '練習 3 (trang 39) — điền trợ từ ( ) — ○ = có trợ từ, × = để trống',
      head: ['Câu', 'Đáp án từng ô', 'Lý do'],
      rows: [
        ['① A: ワンさん、映画（　）チケット（　）2枚（　）あります。', '**の** / **が** / **×**', 'N の N が + số (không trợ từ)'],
        ['  あさって（　）、一緒に見（　）行きませんか。', '**×** / **に**', 'V (bỏ ます) **に** 行きます (mục đích)'],
        ['  C: あさって（　）ちょっと……。約束（　）あります（　）（　）。', '**は** / **が** / **から** / (×)', 'ちょっと đi sau は · あります đi với が · ～から (ô cuối để trống/ký hiệu "。")'],
        ['② A: マルコさんはスポーツ（　）何（　）いちばん好きですか。', '**で** / **が**', 'phạm vi で · từ hỏi + が'],
        ['  B: サッカー（　）いちばん好きです。', '**が**', 'すき + が'],
        ['  A: 来月の15日、横浜（　）サッカーの試合（　）あります。', '**で** / **が**', 'sự kiện で · が あります'],
        ['  B: 何時（　）会いますか。', '**に**', 'thời điểm + に'],
        ['  A: 5時（　）どうですか。', '**は**', 'N は どうですか'],
        ['  A: じゃ、日曜日、5時（　）新宿駅（　）会いましょう。', '**に** / **で**', 'giờ に · nơi gặp で'],
        ['③ B: オレンジ（　）ひまわり（　）どちら（　）いいですか。', '**と** / **と** / **が**', 'N1 と N2 と どちらが'],
        ['  A: オレンジ（　）ほう（　）いいです。', '**の** / **が**', 'N の ほうが'],
        ['  オレンジはひまわり（　）（　）おいしいですから。', '**より** / (ずっと hoặc ×)', '**より** là ý chính; ô thứ hai có thể điền ずっと hoặc để trống (không chắc từ sách — tự giải)'],
      ],
    },
    DL('週末の約束 (trang 40) — 6 khung tranh nối thành một cuộc hội thoại mẫu (tự soạn theo hình)', [
        ['A', 'a', '今度の週末、一緒にほしの美術館へ行きませんか。', 'Kondo no shuumatsu, issho ni Hoshi no bijutsukan e ikimasen ka.', 'Cuối tuần này cùng đi bảo tàng Hoshi không?'],
        ['B', 'b', 'ああ、ほしの美術館ですか。すみません、ちょっと……。', 'Aa, Hoshi no bijutsukan desu ka. Sumimasen, chotto…….', 'À, bảo tàng Hoshi à. Xin lỗi, hơi khó.'],
        ['A', 'a', 'じゃ、ほかの美術館はどうですか。', 'Ja, hoka no bijutsukan wa dou desu ka.', 'Vậy bảo tàng khác thì sao?'],
        ['B', 'b', 'いいですね。いつ行きますか。', 'Ii desu ne. Itsu ikimasu ka.', 'Hay đấy. Khi nào đi?'],
        ['A', 'a', 'あさってはどうですか。', 'Asatte wa dou desu ka.', 'Ngày kia thì sao?'],
        ['B', 'b', 'あさってはちょっと……。週末はどうですか。', 'Asatte wa chotto……. Shuumatsu wa dou desu ka.', 'Ngày kia thì hơi… Cuối tuần thì sao?'],
        ['A', 'a', '週末ですね。土曜日と日曜日とどちらがいいですか。', 'Shuumatsu desu ne. Doyoubi to nichiyoubi to dochira ga ii desu ka.', 'Cuối tuần nhé. Thứ Bảy hay Chủ Nhật được hơn?'],
        ['B', 'b', '土曜日のほうがいいです。', 'Doyoubi no hou ga ii desu.', 'Thứ Bảy tốt hơn.'],
        ['A', 'a', 'バスと電車とどちらが早いですか。', 'Basu to densha to dochira ga hayai desu ka.', 'Xe buýt và tàu, cái nào nhanh hơn?'],
        ['B', 'b', '電車のほうが早いですよ。', 'Densha no hou ga hayai desu yo.', 'Tàu nhanh hơn đó.'],
        ['A', 'a', '何時に会いますか。', 'Nanji ni aimasu ka.', 'Mấy giờ gặp?'],
        ['B', 'b', '10時はどうですか。', 'Juuji wa dou desu ka.', '10 giờ thì sao?'],
        ['A', 'a', '10時ですね。わかりました。', 'Juuji desu ne. Wakarimashita.', '10 giờ nhé. Mình biết rồi.'],
    ]),
    {
      t: 'note',
      title: 'Lưu ý khi chấm "週末の約束"',
      items: [
        'Đây là bài **viết hội thoại theo tranh** — cô chấm theo: có **rủ (ませんか)**, **từ chối/đề xuất (は どうですか)**, **chọn (どちらが / の ほうが)**, **hỏi giờ (なんじに) + ね + わかりました**.',
        'Hộp từ trong đề: **ああ · わあ · ええ · じゃ · いいですね · そうですか · そうですねえ · そうしましょう · わかりました · たのしみです** — dùng ít nhất 4 từ cho tự nhiên.',
        'Khung 1 trong tranh ghi "ほしの美術館 + ×" → từ chối; khung 2 đưa "hoshino museum / ?" → hỏi lại địa điểm; khung 3 "いつ / あさって"; khung 4 "週末 · 土? 日? · 土"; khung 5 "バス vs 電車 · はやい"; khung 6 "何時 · 10時".',
      ],
    },

    /* ═════ C. TỪ VỰNG BÀI 7 ═════ */
    { t: 'h', text: 'C. BT Từ vựng Bài 7 (4 trang)' },
    {
      t: 'table',
      caption: 'みんなで話そう 1 — ①〜⑧ là gì? (chọn từ trong khung: まど · テーブル · いす · コップ · ナイフ · おさら · はし · れいぞうこ)',
      head: ['#', 'Đồ vật trong hình', 'Đáp án', 'Romaji'],
      rows: [
        ['①', 'tủ lạnh cạnh bồn rửa', 'れいぞうこ', 'reizouko'],
        ['②', 'cửa sổ có rèm', 'まど', 'mado'],
        ['③', 'cái cốc trên bàn', 'コップ', 'koppu'],
        ['④', 'dụng cụ cắt đặt trên đĩa/bàn ăn (theo hình)', 'ナイフ', 'naifu'],
        ['⑤', 'cái đĩa', 'おさら', 'osara'],
        ['⑥', 'đôi đũa', 'はし', 'hashi'],
        ['⑦', 'bàn', 'テーブル', 'teeburu'],
        ['⑧', 'ghế', 'いす', 'isu'],
      ],
    },
    {
      t: 'note',
      title: 'みんなで話そう 2 — các đồ này thường ở đâu? (学校 · 家 · 図書館)',
      items: [
        '**家 (ở nhà)**: れいぞうこ, コップ, おさら, はし, ナイフ, テーブル, いす, まど (cả 8 đều có).',
        '**学校 (trường)**: いす, テーブル (つくえ), まど; có thể có コップ ở căng tin.',
        '**図書館 (thư viện)**: いす, テーブル, まど.',
        'Bài này cô cho **thảo luận**: nói theo mẫu **〇〇は 家に あります。** — không có đáp án cố định.',
      ],
    },
    {
      t: 'table',
      caption: '確認しよう 1 — 地図: ①〜⑤ là gì?',
      head: ['#', 'Hình', 'Đáp án', 'Romaji'],
      rows: [
        ['①', 'cổng soát vé ở ga', 'かいさつ', 'kaisatsu'],
        ['②', 'hòm thư đỏ cạnh trạm xe buýt', 'ポスト', 'posuto'],
        ['③', 'biển báo trạm xe buýt', 'バスてい', 'basutei'],
        ['④', 'nhà có chữ POLICE', 'こうばん', 'kouban'],
        ['⑤', 'máy bán hàng tự động', 'じどうはんばいき', 'jidouhanbaiki'],
      ],
    },
    {
      t: 'table',
      caption: '確認しよう 2 — Nối bằng đường (động từ ↔ danh từ) — đáp án',
      head: ['Danh từ', 'Động từ nối', 'Câu', 'Romaji'],
      rows: [
        ['例 サラダを', 'たべます', 'サラダを たべます。', 'Sarada o tabemasu.'],
        ['① お皿を', 'あらいます', 'おさらを あらいます。', 'Osara o araimasu.'],
        ['② 名前を', 'かきます', 'なまえを かきます。', 'Namae o kakimasu.'],
        ['③ 電話を', 'かけます', 'でんわを かけます。', 'Denwa o kakemasu.'],
        ['④ 歌を', 'うたいます', 'うたを うたいます。', 'Uta o utaimasu.'],
        ['⑤ ギターを', 'ひきます', 'ギターを ひきます。', 'Gitaa o hikimasu.'],
        ['⑥ たばこを', 'すいます', 'たばこを すいます。', 'Tabako o suimasu.'],
      ],
    },
    {
      t: 'table',
      caption: '確認しよう 3 — ペンはどこですか。（　）に書きましょう (theo hình)',
      head: ['#', 'Hình', 'Đáp án', 'Romaji'],
      rows: [
        ['①', 'bút nằm dưới tờ báo', '新聞の **した**', 'shinbun no shita'],
        ['②', 'bút kẹp giữa hai quyển sách', '本と本の **あいだ**', 'hon to hon no aida'],
        ['③', 'bút nằm cạnh laptop', 'パソコンの **よこ**', 'pasokon no yoko (cũng chấp nhận となり / ひだり)'],
        ['④', 'bút trong cặp', 'かばんの **なか**', 'kaban no naka'],
      ],
    },
    {
      t: 'mcq',
      id: 'bt7-tv-chon',
      title: '確認しよう 4 — どちらがいいですか',
      items: [
        { q: 'コーヒーに［さとう / しお］を入れます。', options: ['さとう', 'しお'], correct: 0, why: 'Cho vào cà phê → **さとう** (đường).' },
        { q: 'A:パクさん、すみませんが、{消|け}しゴムを［かりて / かして］ください。 B:はい、どうぞ。', options: ['かりて', 'かして'], correct: 1, why: 'Nhờ **cho mượn** → **かして**. かりて = đi mượn (người nói là người mượn): かりてください ✗.' },
        { q: 'スープの［つくりかた / しかた］を教えてください。 B:いいですよ。', options: ['つくりかた', 'しかた'], correct: 0, why: 'つくります → **つくりかた**. しかた dùng với します.' },
        { q: 'A:{暑|あつ}いですね。{窓|まど}を［あけましょうか / しめましょうか］。 B:はい、お願いします。', options: ['あけましょうか', 'しめましょうか'], correct: 0, why: 'Nóng → **mở** cửa sổ.' },
      ],
    },
    {
      t: 'table',
      caption: '確認しよう 5 — 反対の言葉 (ghép từ trái nghĩa; khung: a しめます b なか c もっていきます d だします e ひだり f まえ)',
      head: ['Đề', 'Trái nghĩa', 'Ký hiệu', 'Romaji'],
      rows: [
        ['例 あけます', 'しめます', 'a', 'akemasu ⇔ shimemasu'],
        ['① いれます', 'だします', 'd', 'iremasu ⇔ dashimasu'],
        ['② もってきます', 'もっていきます', 'c', 'motte kimasu ⇔ motte ikimasu'],
        ['③ うしろ', 'まえ', 'f', 'ushiro ⇔ mae'],
        ['④ そと', 'なか', 'b', 'soto ⇔ naka'],
        ['⑤ みぎ', 'ひだり', 'e', 'migi ⇔ hidari'],
      ],
    },
    {
      t: 'table',
      caption: 'もっと覚えよう — 文房具 (đồ dùng văn phòng) ① ② là gì?',
      head: ['Nhãn', 'Từ', 'Romaji', 'Ghi chú'],
      rows: [
        ['①', 'とけい (めざましどけい)', 'tokei / mezamashi-dokei', 'đồng hồ báo thức (theo hình)'],
        ['②', 'vật nhỏ hiển thị số (theo hình khó xác định)', '—', 'hình nhỏ, không đoán chắc → (tự giải: có thể là "けいさんき / máy tính bỏ túi") — không thi'],
        ['カレンダー', 'カレンダー', 'karendaa', 'lịch'],
        ['ホチキス', 'ホチキス', 'hochikisu', 'cái dập ghim'],
        ['ボールペン', 'ボールペン', 'boorupen', 'bút bi'],
        ['セロハンテープ', 'セロハンテープ', 'serohan teepu', 'băng dính'],
        ['はさみ', 'はさみ', 'hasami', 'kéo'],
        ['シャープペンシル／シャーペン', 'シャープペンシル', 'shaapu penshiru', 'bút chì bấm'],
        ['教科書', 'きょうかしょ', 'kyoukasho', 'sách giáo khoa'],
      ],
    },
    {
      t: 'note',
      title: 'Câu hỏi nói cuối trang',
      items: [
        '"かばんの中には何がありますか。" — trả lời thật: **ノートと ペンと さいふが あります。** (Bài 7: N1 に N2 が あります; liệt kê と/や … など; trống → なにも ありません).',
      ],
    },

    /* ═════ D. NGỮ PHÁP BÀI 7 ═════ */
    { t: 'h', text: 'D. BT Ngữ pháp Bài 7 (6 trang: ポイントチェック · 1–6 · 練習 1–4 · 公園で)' },
    {
      t: 'mcq',
      id: 'bt7-np-poin',
      title: 'ポイントチェック — Bài 7 (16 câu)',
      items: [
        { q: '① {西川|にしかわ}さんは{公園|こうえん}［で / に］います。', options: ['に', 'で'], correct: 0, why: 'Người ở đâu → **に います** (ポイント 61).' },
        { q: '② {駅|えき}の{前|まえ}に{本屋|ほんや}［は / が］あります。', options: ['が', 'は'], correct: 0, why: 'N1 に **N2 が** あります (ポイント 62).' },
        { q: '③ A:アンナさん［は / が］どこにいますか。 B:{隣|となり}の{部屋|へや}にいます。', options: ['は', 'が'], correct: 0, why: 'Đã biết "Anna", hỏi cô ở đâu → **は** (ポイント 61).' },
        { q: '④ {喫茶店|きっさてん}は{花屋|はなや}［の / と］{上|うえ}にあります。', options: ['の', 'と'], correct: 0, why: 'N **の** vị trí: はなや**の**うえ.' },
        { q: '⑤ ペン［で / を］{名前|なまえ}を{書|か}いてください。', options: ['で', 'を'], correct: 0, why: 'Dụng cụ → **で** (ポイント 71).' },
        { q: '⑥ ハンバーグ［を / の］{作|つく}り{方|かた}を{教|おし}えてください。', options: ['の', 'を'], correct: 0, why: 'N **の** V かた (ポイント 66).' },
        { q: '⑦ A:この{写真|しゃしん}、きれいですね。{誰|だれ}［は / が］{撮|と}りましたか。 B:パクさん［は / が］{撮|と}りました。', options: ['が / が', 'は / は', 'が / は', 'は / が'], correct: 0, why: 'Hỏi chủ thể **だれが**; đáp **N が V ました** (ポイント 68).' },
        { q: '⑧ スーパーは{駅|えき}の{前|まえ}に［あります / います］。', options: ['あります', 'います'], correct: 0, why: 'Siêu thị là vật → **あります**.' },
        { q: '⑨ アンナさんはコンビニに［あります / います］。', options: ['います', 'あります'], correct: 0, why: 'Người → **います**.' },
        { q: '⑩ りんごを［きて / きって / きいて］ください。', options: ['きって', 'きて', 'きいて'], correct: 0, why: '切ります → り → **って**: きって. (きて = 来て, きいて = 聞いて).' },
        { q: '⑪ {窓|まど}を［あけて / あげて / あけって］ください。', options: ['あけて', 'あげて', 'あけって'], correct: 0, why: 'あけます (nhóm II) → **あけて**.' },
        { q: '⑫ A:ナタポンさん、コップを{取|と}ってください。 B:［どれ / どの］コップですか。 A:［それ / その］です。', options: ['どの / その', 'どれ / それ', 'どの / それ', 'どれ / その'], correct: 0, why: '**どの + N** (コップ) → đáp **その** (+ N hoặc それです; theo mẫu cô: そのコップです) (ポイント 69–70).' },
        { q: '⑬ A:ビールは［まだ / もう］ありますか。 B:いいえ、［まだ / もう］ありません。', options: ['まだ / もう', 'もう / まだ', 'まだ / まだ', 'もう / もう'], correct: 0, why: 'Hỏi còn không → **まだ ありますか**; hết rồi → **もう ありません** (ポイント 67).' },
        { q: '⑭ A:エレナさん、{野菜|やさい}を［洗ってください / 洗いましょうか］。 B:はい、わかりました。', options: ['洗ってください', '洗いましょうか'], correct: 0, why: 'B nhận việc ("はい、わかりました") → A **nhờ** → ～てください (ポイント 63).' },
        { q: '⑮ A:イさん、［手伝ってください / 手伝いましょうか］。 B:はい、ありがとうございます。', options: ['手伝いましょうか', '手伝ってください'], correct: 0, why: 'B cảm ơn → A **đề nghị giúp** → ～ましょうか (ポイント 65).' },
        { q: '⑯ A:パクさんはどこにいますか。 B:{隣|となり}の{部屋|へや}でワンさんと［話します / 話しています］。', options: ['話しています', '話します'], correct: 0, why: 'Đang diễn ra → **～ています** (ポイント 64).' },
      ],
    },
    {
      t: 'table',
      caption: '練習 1 — 「バス停はコンビニの前にあります」 ①〜⑤ (theo hình, tự giải)',
      head: ['#', 'Hình', 'Câu đáp', 'Romaji'],
      rows: [
        ['①', 'tôi đứng cạnh máy bán hàng', '私は自動販売機の前にいます。', 'Watashi wa jidouhanbaiki no mae ni imasu.'],
        ['②', 'tôi đứng trong hiệu sách', '私は本屋の中にいます。', 'Watashi wa honya no naka ni imasu.'],
        ['③', 'chị Yamada đứng trước cửa KOBAN', '山田さんは交番の前にいます。', 'Yamada-san wa kouban no mae ni imasu.'],
        ['④', 'cửa hàng 24 STORE giữa hiệu hoa và ngân hàng', 'コンビニは花屋と銀行の間にあります。', 'Konbini wa hanaya to ginkou no aida ni arimasu.'],
        ['⑤', 'quán Cafe phía sau bưu điện', '喫茶店は郵便局のうしろにあります。', 'Kissaten wa yuubinkyoku no ushiro ni arimasu.'],
      ],
    },
    {
      t: 'table',
      caption: '練習 2 — 「本屋の前にパクさんがいます」 ①〜⑤ (theo hình, tự giải)',
      head: ['#', 'Hình', 'Câu đáp', 'Romaji'],
      rows: [
        ['①', 'chó trước quán COFFEE', '喫茶店の前に犬がいます。', 'Kissaten no mae ni inu ga imasu.'],
        ['②', 'cô gái đứng cạnh cột đồng hồ', '時計の下に女の人がいます。', 'Tokei no shita ni onna no hito ga imasu.'],
        ['③', 'bưu điện — hòm thư đứng trước', '郵便局の前にポストがあります。', 'Yuubinkyoku no mae ni posuto ga arimasu.'],
        ['④', 'ngân hàng cạnh đồn công an', '銀行の隣に交番があります。', 'Ginkou no tonari ni kouban ga arimasu.'],
        ['⑤', 'nhà vệ sinh công cộng bên đường', '公園にトイレがあります。', 'Kouen ni toire ga arimasu.'],
      ],
    },
    {
      t: 'quiz',
      id: 'bt7-np-te-bang',
      title: '練習 3 — Bảng thể て (1 nhóm / 2 nhóm / 3 nhóm) — điền て-form',
      kind: 'fill',
      grammar: 'い・ち・り→って · み・び・に→んで · き→いて · ぎ→いで · し→して',
      items: [
        { q: '買います', answers: ['かって', '買って'], hint: 'nhóm I (đã cho sẵn trong đề)' },
        { q: '手伝います', answers: ['てつだって', '手伝って'], hint: 'い → って' },
        { q: '吸います', answers: ['すって', '吸って'], hint: 'い → って' },
        { q: '持ちます', answers: ['もって', '持って'], hint: 'ち → って' },
        { q: '作ります', answers: ['つくって', '作って'], hint: 'り → って' },
        { q: '切ります', answers: ['きって', '切って'], hint: 'り → って' },
        { q: '飲みます', answers: ['のんで', '飲んで'], hint: 'み → んで' },
        { q: '読みます', answers: ['よんで', '読んで'], hint: 'み → んで' },
        { q: '遊びます', answers: ['あそんで', '遊んで'], hint: 'び → んで' },
        { q: '書きます', answers: ['かいて', '書いて'], hint: 'き → いて' },
        { q: '置きます', answers: ['おいて', '置いて'], hint: 'き → いて' },
        { q: '行きます', answers: ['いって', '行って'], hint: 'ngoại lệ' },
        { q: '持って行きます', answers: ['もっていって', '持って行って'], hint: 'もって + いって' },
        { q: '泳ぎます', answers: ['およいで', '泳いで'], hint: 'ぎ → いで' },
        { q: '話します', answers: ['はなして', '話して'], hint: 'し → して' },
        { q: '貸します', answers: ['かして', '貸して'], hint: 'し → して' },
        { q: '食べます', answers: ['たべて', '食べて'], hint: 'nhóm II' },
        { q: '開けます', answers: ['あけて', '開けて'], hint: 'nhóm II' },
        { q: '教えます', answers: ['おしえて', '教えて'], hint: 'nhóm II' },
        { q: '起きます (thức dậy)', answers: ['おきて', '起きて'], hint: 'nhóm II' },
        { q: '来ます', answers: ['きて', '来て'], hint: 'nhóm III' },
        { q: '持って来ます', answers: ['もってきて', '持って来て'], hint: 'もって + きて' },
        { q: '勉強します', answers: ['べんきょうして', '勉強して'], hint: 'nhóm III' },
      ],
    },
    {
      t: 'quiz',
      id: 'bt7-np-ex4',
      title: '練習 4 — 「私のかばんを取ってください」: chọn động từ từ khung và chia ～てください',
      kind: 'fill',
      grammar: 'V て ください (khung: 開けます 洗います 書きます 来ます 貸します 出します 作ります 持って行きます)',
      items: [
        { q: '①暑いですから、窓を（　）ください。', answers: ['あけて', '開けて'], hint: 'あけます' },
        { q: '②ここに名前を（　）ください。', answers: ['かいて', '書いて'], hint: 'かきます' },
        { q: '③明日9時からパーティーです。9時に学校へ（　）ください。', answers: ['きて', '来て'], hint: 'きます' },
        { q: '④この料理を隣の部屋へ（　）ください。', answers: ['もっていって', '持って行って'], hint: 'もっていきます' },
        { q: '⑤冷蔵庫から飲み物を（　）ください。', answers: ['だして', '出して'], hint: 'だします' },
        { q: '⑥消しゴムを（　）ください。', answers: ['かして', '貸して'], hint: 'かします (nhờ cho mượn)' },
        { q: '⑦エレナさん、国の料理を（　）ください。', answers: ['つくって', '作って'], hint: 'つくります' },
      ],
    },
    {
      t: 'quiz',
      id: 'bt7-np-ex5',
      title: '5. 「この漢字の読み方を教えてください」 — đặt câu "cách V + おしえて / わかりません"',
      kind: 'translate',
      grammar: 'N の V かた を おしえてください / が わかりません',
      items: [
        { q: 'DVD・使います・教えてください', answers: V('DVDの{使|つか}い{方|かた}を{教|おし}えてください。', 'DVDのつかいかたをおしえてください。'), hint: 'つかいかた' },
        { q: 'チケット・買います・教えてください', answers: V('チケットの{買|か}い{方|かた}を{教|おし}えてください。', 'チケットのかいかたをおしえてください。'), hint: 'かいかた' },
        { q: '野菜・切ります・わかりません', answers: V('{野菜|やさい}の{切|き}り{方|かた}がわかりません。', 'やさいのきりかたがわかりません。', '{野菜|やさい}の{切|き}り{方|かた}をわかりません。'), hint: 'きりかた が' },
        { q: 'カレー・作ります・わかりません', answers: V('カレーの{作|つく}り{方|かた}がわかりません。', 'カレーのつくりかたがわかりません。'), hint: 'つくりかた が' },
      ],
    },
    {
      t: 'quiz',
      id: 'bt7-np-ex6',
      title: '6. 「アンナさんはお皿を洗っています」 — chia ～ています',
      kind: 'fill',
      grammar: 'V て います',
      items: [
        { q: '①パクさんはピアノを（弾きます→　）。', answers: ['ひいています', '弾いています', 'ひいている'], hint: 'き → いて' },
        { q: '②ダニエルさんは本を（読みます→　）。', answers: ['よんでいます', '読んでいます'], hint: 'み → んで' },
        { q: '③ワンさんは電話を（かけます→　）。', answers: ['かけています'], hint: 'nhóm II' },
        { q: '④山口さんは図書館で（勉強します→　）。', answers: ['べんきょうしています', '勉強しています'], hint: 'nhóm III' },
        { q: '⑤ナタポンさんは歌を（歌います→　）。', answers: ['うたっています', '歌っています'], hint: 'い → って' },
        { q: '⑥マルコさんはあそこでたばこを（吸います→　）。', answers: ['すっています', '吸っています'], hint: 'い → って' },
        { q: '⑦メアリーさんは部屋で何を（します→　）か。', answers: ['していますか', 'していますか。', 'しています'], hint: 'して + いますか' },
      ],
    },
    {
      t: 'quiz',
      id: 'bt7-np-renshu1',
      title: '練習 1 (trang 44) — chọn mẫu: ～方 · ～ています · ～てください · ～ましょうか',
      kind: 'fill',
      grammar: 'khung: ～方 ～ています ～てください ～ましょうか',
      items: [
        { q: '例）このケーキはおいしいですよ。ぜひ（食べます→食べてください）。 — ①A:カルロスさんはどこですか。B:あそこでCDを（聞きます→　）よ。', answers: ['きいています', '聞いています'], hint: '～ています' },
        { q: '②A:このケーキ、冷蔵庫に（入れます→　）。 B:あ、はい、お願いします。', answers: ['いれましょうか', '入れましょうか'], hint: '～ましょうか (đề nghị)' },
        { q: '③パソコンの（使います→　）を教えてください。', answers: ['つかいかた', '使い方'], hint: '～方' },
        { q: '④A:パクさん、かばんを（持ちます→　）。 B:あ、ありがとうございます。', answers: ['もちましょうか', '持ちましょうか'], hint: '～ましょうか' },
        { q: '⑤A:隣の部屋からいすを（持って来ます→　）。 B:はい、わかりました。', answers: ['もってきてください', '持って来てください'], hint: '～てください' },
      ],
    },
    {
      t: 'mcq',
      id: 'bt7-np-renshu2',
      title: '練習 2 (trang 44) — あります / います',
      items: [
        { q: '例）{駅|えき}の{前|まえ}にコンビニが［あります / います］。', options: ['あります', 'います'], correct: 0, why: 'Cửa hàng → あります.' },
        { q: '① {私|わたし}の{部屋|へや}にテレビが［　］。', options: ['あります', 'います'], correct: 0, why: 'Ti vi → あります.' },
        { q: '② {先生|せんせい}は1{階|かい}に［　］。', options: ['います', 'あります'], correct: 0, why: 'Người → います.' },
        { q: '③ テーブルの{上|うえ}に{花|はな}が［　］。', options: ['あります', 'います'], correct: 0, why: 'Hoa → あります.' },
        { q: '④ {携帯電話|けいたいでんわ}がテーブルの{上|うえ}に［　］。', options: ['あります', 'います'], correct: 0, why: 'Điện thoại → あります.' },
        { q: '⑤ {公園|こうえん}にパクさんが［　］。', options: ['います', 'あります'], correct: 0, why: 'Người → います.' },
      ],
    },
    {
      t: 'table',
      caption: '練習 3 (trang 45) — điền câu hỏi/đáp thích hợp',
      head: ['#', 'Câu cần điền', 'Đáp án', 'Romaji'],
      rows: [
        ['例', '誕生日は＿＿。', 'いつですか', 'Tanjoubi wa itsu desu ka.'],
        ['①', 'A: 今、＿＿。B: コンビニにいます。', 'どこにいますか', 'Ima, doko ni imasu ka.'],
        ['②', 'A: …携帯電話を取ってください。B: ワンさんの＿＿。A: それです。', 'どれですか (どの携帯電話ですか)', 'Wan-san no dore desu ka.'],
        ['③', 'A: このケーキ、おいしいですね。＿＿。B: 山口さんが作りました。', 'だれが作りましたか', 'Dare ga tsukurimashita ka.'],
        ['④', 'A: フォークを取ってください。B: ＿＿。A: その小さいフォークです。', 'どのフォークですか', 'Dono fooku desu ka.'],
      ],
    },
    {
      t: 'table',
      caption: '練習 4 (trang 45) — điền trợ từ ( ) — × = để trống',
      head: ['Câu', 'Đáp án từng ô', 'Lý do'],
      rows: [
        ['① 〈電話で〉 A: もしもし、ワンさん？今、どこ（　）いますか。', '**に**', 'nơi tồn tại (người) に います'],
        ['  B: 公園（　）前（　）います。近く（　）スーパー（　）あります。', '**の** / **に** / **に** / **が**', 'N の前 · に います · ちかくに スーパーが あります'],
        ['  A: わかりました。迎え（　）行きます。', '**に**', 'V (bỏ ます) に 行きます'],
        ['② 〈パーティーの準備〉 A: メアリーさん、このナイフ（　）パン（　）切ってください。', '**で** / **を**', 'dụng cụ で · đối tượng を'],
        ['  それから、お皿（　）パン（　）置いてください。', '**に** / **を**', 'đặt (nơi に) bánh (を)'],
        ['  A: カルロスさん、冷蔵庫（　）このケーキ（　）入れてください。', '**に** / **を**', 'cho vào tủ lạnh'],
        ['  それから、冷蔵庫（　）（　）ビール（　）出してください。', '**から** / (×, tự giải) / **を**', 'lấy từ tủ ra: から … を (ô giữa không chắc từ ảnh)'],
        ['  B: パクさんは隣の部屋（　）メアリーさん（　）話していますよ。', '**で** / **と**', 'nơi hành động で · cùng ai と'],
        ['③ A: マルコさんの電話番号（　）わかりません。教えてください。', '**が**', 'わかります đi với が'],
        ['  B: 私（　）わかりませんから、ダニエルさん（　）聞いてください。', '**も** / **に**', 'tôi cũng không biết (も) · hỏi ai に'],
      ],
    },
    {
      t: 'table',
      caption: '公園で (trang 46) — nhìn tranh, viết hội thoại A/B ①〜④ (mẫu; theo hình, tự giải)',
      head: ['#', 'Tình huống trên hình', 'A', 'B'],
      rows: [
        ['①', 'cô gái chỉ vào bồn rửa và đưa đĩa rau cho bạn', 'やさいを洗ってください。 (Yasai o aratte kudasai.)', 'はい、わかりました。 (Hai, wakarimashita.)'],
        ['②', 'bạn cầm gắp thịt nướng, bạn kia hỏi về Sato (bóng nói 佐藤)', '佐藤さんはどこにいますか。 (Satou-san wa doko ni imasu ka.)', 'あそこで電話をかけています。 (Asoko de denwa o kakete imasu.)'],
        ['③', 'cô gái chỉ giỏ picnic (bóng nói giỏ)', 'あのかばんを取ってください。 (Ano kaban o totte kudasai.) — hoặc かごはどれですか', 'どのかばんですか。 (Dono kaban desu ka.) → あれです。 (Are desu.)'],
        ['④', 'hai người chụp ảnh', '写真を撮りましょうか。 (Shashin o torimashou ka.)', 'あ、ありがとうございます。お願いします。 (A, arigatou gozaimasu. Onegai shimasu.)'],
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú tổng kết BT',
      items: [
        '**Phần "theo hình"** (hình ảnh scan của sách bài tập): đáp án mình dựng lại theo hình + mẫu câu của chính bài tập; nếu cô chữa khác một chút (ví dụ ⑤ trong 練習 1 Bài 7), **hãy theo cô** — miễn đúng mẫu ngữ pháp.',
        '**Phần ô điền trợ từ**: ô nào ghi "(tự giải / không chắc)" là chỗ chữ trong ảnh mờ; ý nghĩa vẫn giải thích rõ để bạn hiểu vì sao điền thế.',
        'Làm xong hãy làm tiếp **Đề luyện Bài 6–7** (40 câu) ở mục phụ của khoá để thử tốc độ.',
      ],
    },
  ],
};
/* ═══════════════════════ SLIDE TỔNG HỢP TỪ VỰNG & NGỮ PHÁP — BÀI 6 ═══════════════════════ */

const TONG_HOP_B6: Lesson = {
  id: 'slide-tong-hop-b6',
  kind: 'review',
  title: 'Slide tổng hợp từ vựng & ngữ pháp Bài 6 (bộ slide cô dùng ôn thi) — đi đúng thứ tự slide',
  goal: 'Có trong tay "bản tóm tắt thi" của Bài 6 đúng như bộ slide tổng hợp của cô: 3 phần (rủ · so sánh · hẹn), từ vựng gom theo phần, và những ví dụ riêng của bộ slide này.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      title: 'Bộ slide tổng hợp Bài 6 có gì',
      items: [
        '**Mở đầu**: 新しい言葉 (từ mới) chia 3 phần — Phần 1: 10 từ + ざんねんです; Phần 2: 16 từ; Phần 3: おこのみやき · すきやき · あそびます.',
        '**文型 (mẫu câu)** chia cùng 3 phần: **一緒に行きませんか** · **どちらがいいですか** · **約束**.',
        'Slide tổng hợp **chỉ ghi công thức + ví dụ ngắn** — phần giải thích đầy đủ nằm ở Slot 10–13 của khoá.',
        'Có vài ví dụ **chỉ xuất hiện ở bộ tổng hợp** (ずっと/ちょっと, もう = đã từng, ぜんぶ, diện tích/dân số, ね vs よ) — bài này gom lại.',
      ],
    },

    { t: 'h', text: 'Phần 0 — Từ mới theo thứ tự slide (3 phần)' },
    {
      t: 'table',
      caption: 'Phần 1 (rủ) — 10 từ + 1 tính từ',
      head: ['Từ', 'Đọc', 'Nghĩa'],
      rows: [
        ['カラオケ', 'karaoke', 'karaoke'],
        ['コンサート', 'konsaato', 'hòa nhạc'],
        ['しあい', 'shiai', 'trận đấu'],
        ['セール', 'seeru', 'đợt giảm giá'],
        ['チケット', 'chiketto', 'vé'],
        ['ちず', 'chizu', 'bản đồ'],
        ['ドライブ', 'doraibu', 'lái xe đi chơi'],
        ['みずぎ', 'mizugi', 'đồ bơi'],
        ['やきゅう', 'yakyuu', 'bóng chày'],
        ['やくそく', 'yakusoku', 'cuộc hẹn / lời hứa'],
        ['あります (có)', 'arimasu', 'có (sự kiện, hẹn, việc…)'],
        ['ざんねんです', 'zannen desu', 'tiếc quá'],
      ],
    },
    {
      t: 'table',
      caption: 'Phần 2 (so sánh) — 16 từ',
      head: ['Từ', 'Đọc', 'Nghĩa'],
      rows: [
        ['たべもの', 'tabemono', 'đồ ăn'],
        ['のみもの', 'nomimono', 'đồ uống'],
        ['やきにく', 'yakiniku', 'thịt nướng'],
        ['ラーメン', 'raamen', 'mì ramen'],
        ['たべほうだい', 'tabehoudai', 'buffet'],
        ['いざかや', 'izakaya', 'quán nhậu'],
        ['えいがかん', 'eigakan', 'rạp phim'],
        ['ちかてつ', 'chikatetsu', 'tàu điện ngầm'],
        ['かしゅ', 'kashu', 'ca sĩ'],
        ['きせつ', 'kisetsu', 'mùa'],
        ['コメディー', 'komedii', 'hài kịch'],
        ['ジャズ', 'jazu', 'nhạc jazz'],
        ['ツアー', 'tsuaa', 'tour'],
        ['どちら', 'dochira', 'bên nào (trong hai)'],
        ['とおい / ちかい', 'tooi / chikai', 'xa / gần'],
        ['ひろい', 'hiroi', 'rộng'],
      ],
    },
    {
      t: 'table',
      caption: 'Phần 3 (hẹn)',
      head: ['Từ', 'Đọc', 'Nghĩa'],
      rows: [
        ['おこのみやき', 'okonomiyaki', 'bánh xèo okonomiyaki'],
        ['すきやき', 'sukiyaki', 'lẩu sukiyaki'],
        ['あそびます', 'asobimasu', 'chơi'],
      ],
    },

    { t: 'h', text: 'Phần 1 — 一緒に行きませんか (nhắc lại công thức)' },
    {
      t: 'rule',
      formula: 'V ませんか (rủ) · V ましょう (nhận / hô hào) · ～はちょっと… (từ chối khéo)',
      vi: 'Slide nhấn: **ませんか** = "mời, rủ ai cùng làm gì" · **ましょう** = "hô hào cùng làm" · **はちょっと** = "cách từ chối mà không muốn nêu lý do".',
    },
    {
      t: 'examples',
      items: [
        E('{昼|ひる}ご{飯|はん}を{食|た}べませんか。…ええ、{食|た}べましょう。', 'Hirugohan o tabemasen ka. …Ee, tabemashou.', 'Cùng ăn trưa không? …Vâng, ăn thôi.'),
        E('{今晩|こんばん}、{飲|の}みませんか。…いいですね。{飲|の}みましょう。', 'Konban, nomimasen ka. …Ii desu ne. Nomimashou.', 'Tối nay uống không? …Hay đấy. Uống thôi.'),
        E('コーヒーを{飲|の}みませんか。…コーヒーはちょっと……。', 'Koohii o nomimasen ka. …Koohii wa chotto……', 'Uống cà phê không? …Cà phê thì hơi… (không thích/không tiện).'),
        E('あしたは ちょっと……。', 'Ashita wa chotto……', 'Ngày mai thì hơi… (khó).'),
        E('{学校|がっこう}へ{行|い}きましょう。{終|お}わりましょう。{始|はじ}めましょう。', 'Gakkou e ikimashou. Owarimashou. Hajimemashou.', 'Đến trường thôi. Kết thúc thôi. Bắt đầu thôi.'),
      ],
    },
    {
      t: 'note',
      title: 'Cái mới trên bộ tổng hợp (so với Slot 10)',
      items: [
        '**はじめましょう / おわりましょう** (bắt đầu thôi / kết thúc thôi) — câu cô dùng đầu và cuối tiết học. Từ: **はじめます** (bắt đầu), **おわります** (kết thúc).',
        '**ちょっと** dùng cả khi từ chối **một thứ** (コーヒーは ちょっと…: không muốn cà phê) lẫn **một thời điểm** (こんばんは ちょっと…: tối nay không tiện).',
        '**すみません、ちょっと…** có thể đứng một mình để từ chối.',
      ],
    },
    {
      t: 'table',
      caption: 'あります — dùng cho đồ vật và sự kiện (các câu mẫu của slide)',
      head: ['Câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['こんしゅうの げつようび、やくそくが あります。', 'Konshuu no getsuyoubi, yakusoku ga arimasu.', 'Thứ Hai tuần này tôi có hẹn.'],
        ['らいしゅうの かようび かんこくごの テストが あります。', 'Raishuu no kayoubi kankokugo no tesuto ga arimasu.', 'Thứ Ba tuần sau có bài thi tiếng Hàn.'],
        ['せんしゅうの もくようび ようじが ありました。', 'Senshuu no mokuyoubi youji ga arimashita.', 'Thứ Năm tuần trước tôi có việc bận.'],
        ['こんしゅうの にちようびの ごぜん 7じから ごご 8じまで アルバイトが あります。', 'Konshuu no nichiyoubi no gozen shichiji kara gogo hachiji made arubaito ga arimasu.', 'Chủ Nhật tuần này, từ 7 giờ sáng đến 8 giờ tối tôi có việc làm thêm.'],
        ['FPT だいがくで サッカーの しあいが あります。', 'FPT daigaku de sakkaa no shiai ga arimasu.', 'Ở Đại học FPT có trận bóng đá.'],
        ['わたしの まちに スーパーが ありません。', 'Watashi no machi ni suupaa ga arimasen.', 'Ở thành phố tôi không có siêu thị.'],
        ['ハイフォンに じどうしゃこうじょうが あります。', 'Haifon ni jidoushakoujou ga arimasu.', 'Ở Hải Phòng có nhà máy ô tô.'],
        ['こんばん しゃちょうの うちで パーティーが あります。', 'Konban shachou no uchi de paatii ga arimasu.', 'Tối nay ở nhà giám đốc có tiệc.'],
        ['あした かいしゃで かいぎが あります。', 'Ashita kaisha de kaigi ga arimasu.', 'Ngày mai ở công ty có cuộc họp.'],
      ],
    },
    {
      t: 'note',
      title: 'Nhớ: に hay で?',
      items: [
        '**Không phải sự kiện** (vật, người, cơ sở, thành phố có siêu thị…) → **N に N が あります**. **Sự kiện diễn ra** (trận đấu, tiệc, họp, lễ hội…) → **N で N が あります**.',
        '**Thời điểm** (こんしゅうの げつようび, らいしゅうの かようび…) có thể thêm **に** hoặc bỏ khi có こんしゅう/らいしゅう/せんしゅう.',
        '**ありました** = đã có (quá khứ), **ありません** = không có.',
      ],
    },
    {
      t: 'table',
      caption: 'Trợ số từ 枚 / つ (slide tổng hợp)',
      head: ['Câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['わたしは コンサートの きっぷを ２まい かいました。', 'Watashi wa konsaato no kippu o nimai kaimashita.', 'Tôi đã mua 2 vé hòa nhạc.'],
        ['シャツが あります → シャツが いちまい あります → シャツが にまい あります。', 'Shatsu ga arimasu → Shatsu ga ichimai arimasu → Shatsu ga nimai arimasu.', 'Có áo → có 1 chiếc áo → có 2 chiếc áo.'],
        ['CD を さんまい かいました。', 'CD o sanmai kaimashita.', 'Tôi đã mua 3 đĩa CD.'],
        ['みずぎを はちまい ください。', 'Mizugi o hachimai kudasai.', 'Cho tôi 8 bộ đồ bơi.'],
        ['ちずを いちまい かきました。', 'Chizu o ichimai kakimashita.', 'Tôi đã vẽ 1 tờ bản đồ.'],
      ],
    },
    {
      t: 'note',
      title: 'Lưu ý (きっぷ / チケット)',
      items: [
        'Slide tổng hợp dùng **きっぷ** (vé tàu/xe) lẫn **チケット**: cả hai đều đếm bằng **まい**. Khi thi chọn **チケット** (từ trong danh sách của cô).',
        'Hỏi số: **なんまい** (vật mỏng) · **いくつ** (vật chung). Ghi nhớ: 枚 **không đổi âm** (ichimai, nimai, sanmai…).',
      ],
    },

    { t: 'h', text: 'Phần 2 — どちらがいいですか (so sánh)' },
    {
      t: 'table',
      caption: 'Ví dụ so sánh hơn (slide dùng ví dụ Việt Nam)',
      head: ['Tiếng Việt', 'Tiếng Nhật', 'Romaji'],
      rows: [
        ['Tokyo rộng lớn hơn Osaka.', 'とうきょうは おおさかより ひろいです。', 'Toukyou wa Oosaka yori hiroi desu.'],
        ['Máy bay nhanh hơn Shinkansen.', 'ひこうきは しんかんせんより はやいです。', 'Hikouki wa shinkansen yori hayai desu.'],
        ['Món Thái cay hơn món Nhật.', 'タイりょうりは にほんりょうりより からいです。', 'Tai ryouri wa Nihon ryouri yori karai desu.'],
        ['Tour Nha Trang thú vị hơn tour Đà Nẵng.', 'ニャチャンツアーは ダナンツアーより おもしろいです。', 'Nyachan tsuaa wa Danan tsuaa yori omoshiroi desu.'],
        ['Big C gần hơn Vincom.', 'BigC は Vincom より ちかいです。', 'BigC wa Vincom yori chikai desu.'],
        ['Hà Nội náo nhiệt hơn thành phố của tôi.', 'ハノイは わたしの まちより にぎやかです。', 'Hanoi wa watashi no machi yori nigiyaka desu.'],
        ['Điện thoại của tôi đắt hơn điện thoại của Anna.', 'わたしの けいたいでんわは アンナさんの けいたいでんわより たかいです。', 'Watashi no keitai denwa wa Anna-san no keitai denwa yori takai desu.'],
        ['Hôm nay tôi bận hơn ngày mai.', 'きょうは あしたより いそがしいです。', 'Kyou wa ashita yori isogashii desu.'],
      ],
    },
    {
      t: 'table',
      caption: 'Mức độ hơn kém (chỉ có ở bộ tổng hợp)',
      head: ['Mẫu', 'Nghĩa', 'Ví dụ'],
      rows: [
        ['A は B より 大きいです', 'A lớn hơn B', 'A は B より おおきいです。'],
        ['A は B より **ずっと** 大きいです', 'A lớn hơn B **hẳn**', 'にほんごは えいごより ずっと むずかしいです。'],
        ['A は B より **ちょっと／すこし** 大きいです', 'A lớn hơn B **một chút**', 'このへやは あのへやより ちょっと ひろいです。'],
      ],
    },
    {
      t: 'table',
      caption: 'Câu hỏi: có/không · hỏi từ · chọn 1 trong 2 (slide ví dụ にほんご / えいご)',
      head: ['Kiểu câu hỏi', 'Câu', 'Trả lời'],
      rows: [
        ['Có/Không', 'にほんごは えいごより むずかしいですか。', 'はい、ずっと むずかしいです。'],
        ['Hỏi chọn 1 trong 2', 'にほんごと えいごと どちらが むずかしいですか。', 'にほんごの ほうが むずかしいです。'],
        ['Cả hai', 'AツアーとBツアーと どちらが やすいですか。', 'どちらも やすいです。'],
      ],
    },
    {
      t: 'table',
      caption: 'N1 と N2 と どちらが A ですか — ví dụ slide',
      head: ['Hỏi', 'Đáp', 'Nghĩa'],
      rows: [
        ['しんかんせんと ひこうきと どちらが はやいですか。', 'ひこうきの ほうが はやいです。', 'Máy bay nhanh hơn.'],
        ['コーヒーと こうちゃと どちらが すきですか。', 'コーヒーの ほうが すきです。/ どちらも すきです。', 'Thích cà phê hơn. / Cả hai.'],
        ['しちがつと はちがつと どちらが あめが おおいですか。', 'しちがつの ほうが あめが おおいです。', 'Tháng 7 mưa nhiều hơn.'],
        ['このへやと あのへやと どちらが ひろいですか。', 'このへやの ほうが ひろいです。', 'Phòng này rộng hơn.'],
        ['A ツアーと B ツアーと どちらが やすいですか。', 'どちらも やすいです。', 'Cả hai đều rẻ.'],
      ],
    },
    {
      t: 'table',
      caption: 'いちばん (nhất) — slide nhấn: đặt NGAY TRƯỚC tính từ, như một phó từ',
      head: ['Hỏi', 'Đáp', 'Nghĩa'],
      rows: [
        ['スポーツで なにが いちばん すきですか。', 'サッカーが いちばん すきです。 / ぜんぶ すきです。', 'Trong thể thao thích gì nhất? — Bóng đá / Tôi thích tất cả.'],
        ['にほんで どこが いちばん おおきいですか。', 'とうきょうが いちばん おおきいです。', 'Ở Nhật, nơi nào lớn nhất? — Tokyo.'],
        ['いつが いちばん あついですか。', 'はちがつが いちばん あついです。', 'Khi nào nóng nhất? — Tháng 8.'],
        ['このクラスで だれが いちばん ゆうめいですか。', 'タインさんが いちばん ゆうめいです。', 'Lớp này ai nổi tiếng nhất? — Bạn Thanh.'],
        ['おんがくで なにが いちばん すきですか。', 'ジャズが いちばん すきです。', 'Trong âm nhạc thích gì nhất? — Jazz.'],
        ['とうきょうで どこが いちばん おもしろいですか。', 'あきはばらが いちばん おもしろいです。', 'Ở Tokyo nơi nào thú vị nhất? — Akihabara.'],
        ['このレストランの りょうりで なにが いちばん おいしいですか。', 'カレーが いちばん おいしいです。', 'Món nào ngon nhất? — Cà ri.'],
      ],
    },
    {
      t: 'table',
      caption: 'Bài thực hành so sánh bằng số liệu (slide hình Hà Nội / TP.HCM / Huế) — tự nói to',
      head: ['Thành phố', 'Diện tích (めんせき)', 'Dân số (じんこう)'],
      rows: [
        ['ハノイ', '920,97 km²', '3.400.000 người'],
        ['ホーチミンし', '2.095 km²', '8.500.000 người'],
        ['フエ', '5.053,99 km²', '1.134.480 người'],
      ],
    },
    {
      t: 'examples',
      items: [
        E('ホーチミンしは ハノイより じんこうが おおいです。', 'Hoochimin-shi wa Hanoi yori jinkou ga ooi desu.', 'TP.HCM đông dân hơn Hà Nội.'),
        E('フエは ホーチミンしより めんせきが ひろいです。', 'Hue wa Hoochimin-shi yori menseki ga hiroi desu.', 'Huế có diện tích rộng hơn TP.HCM.'),
        E('この 三つの まちで ホーチミンしが いちばん じんこうが おおいです。', 'Kono mittsu no machi de Hoochimin-shi ga ichiban jinkou ga ooi desu.', 'Trong 3 thành phố này, TP.HCM đông dân nhất.'),
        E('この 三つの まちで フエが いちばん ひろいです。', 'Kono mittsu no machi de Hue ga ichiban hiroi desu.', 'Trong 3 thành phố này, Huế rộng nhất.'),
      ],
    },

    { t: 'h', text: 'Phần 3 — 約束 (hẹn)' },
    {
      t: 'table',
      caption: 'もう V ました — slide ghi "thường đi với động từ quá khứ; nhấn mạnh hành động đã hoàn thành / từng làm"',
      head: ['Tiếng Nhật', 'Romaji', 'Nghĩa'],
      rows: [
        ['わたしは にほんへ いきました。', 'Watashi wa Nihon e ikimashita.', 'Tôi đã đi Nhật.'],
        ['わたしは もう にほんへ いきました。', 'Watashi wa mou Nihon e ikimashita.', 'Tôi đã (từng) đi Nhật rồi.'],
        ['わたしは もう ふじさんを みました。', 'Watashi wa mou Fujisan o mimashita.', 'Tôi đã thấy núi Phú Sĩ rồi.'],
        ['パクさんは もう やきにくを たべました。', 'Paku-san wa mou yakiniku o tabemashita.', 'Park đã ăn yakiniku rồi.'],
        ['きむらさんは もう にほんの いざかやに はいりました。', 'Kimura-san wa mou Nihon no izakaya ni hairimashita.', 'Kimura đã vào quán nhậu Nhật rồi.'],
        ['わたしは もう ひとりで えいがかんへ いきました。', 'Watashi wa mou hitori de eigakan e ikimashita.', 'Tôi đã tự đi rạp phim một mình rồi.'],
        ['ダニエルさんは もう かんこくの かしゅに あいました。', 'Danieru-san wa mou Kankoku no kashu ni aimashita.', 'Daniel đã gặp ca sĩ Hàn Quốc rồi.'],
        ['アンナさんは もう スキーを しましたか。', 'Anna-san wa mou sukii o shimashita ka.', 'Anna đã trượt tuyết chưa?'],
      ],
    },
    {
      t: 'note',
      title: 'Nghĩa "đã từng" của もう (chỉ ở bản tổng hợp)',
      items: [
        'Slide dịch **"đã từng"**: もう V ましたか có thể hỏi kinh nghiệm (**đã từng … chưa?**). Đáp: **はい、もう V ました** (rồi) / **いいえ、まだです** (chưa).',
        '**ひとりで** = một mình (で chỉ cách thức). Có thể gặp ở phần đọc.',
        '**Hỏi lịch sự**: ～さんは もう にほんへ いきましたか。→ はい、もう いきました。/ いいえ、まだです.',
      ],
    },
    {
      t: 'table',
      caption: 'もう～ましたか — bốn câu hỏi mẫu của slide',
      head: ['Câu hỏi', 'Nghĩa'],
      rows: [
        ['もう おこのみやきを たべましたか。', 'Bạn đã ăn okonomiyaki chưa?'],
        ['もう コンサートへ いきましたか。', 'Bạn đã đi hòa nhạc chưa?'],
        ['もう ふじさんを みましたか。', 'Bạn đã thấy núi Phú Sĩ chưa?'],
        ['もう カラオケに いきましたか。', 'Bạn đã đi karaoke chưa?'],
      ],
    },
    {
      t: 'table',
      caption: 'N は どうですか — Bài 4 (hỏi cảm tưởng) vs Bài 6 (đề xuất)',
      head: ['Bài', 'Ví dụ', 'Nghĩa'],
      rows: [
        ['Bài 4', 'にほんは どうですか。', 'Nhật Bản thế nào?'],
        ['Bài 6', 'あしたは ちょっと……。あさっては どうですか。→ あさっては いいですよ。', 'Mai thì hơi… Ngày kia thì sao? → Ngày kia được đó.'],
        ['Bài 6', 'しゅうまつ、のみに いきませんか。…Hoa Lac の いざかやは どうですか。', 'Cuối tuần đi uống không? …Quán nhậu Hòa Lạc thì sao?'],
        ['ね (Bài 4)', 'あついですね。…そうですね。', 'Nóng nhỉ. Ừ nhỉ. (thông tin cả hai biết)'],
        ['ね (Bài 6)', 'いま なんじですか。…5じです。…5じですね。', 'Mấy giờ? 5 giờ. 5 giờ nhé (xác nhận).'],
      ],
    },
    {
      t: 'mcq',
      id: 'tonghop6-luyen',
      title: 'Luyện nhanh từ bộ slide tổng hợp Bài 6',
      items: [
        { q: 'A は B より（　）大きいです。(lớn hơn hẳn)', options: ['ずっと', 'まだ', 'もう', 'いちばん'], correct: 0, why: '**ずっと** đứng sau より. ポイント 54.' },
        { q: '「パクさんは（　）やきにくを たべました。」(đã ăn rồi)', options: ['もう', 'まだ', 'ぜひ', 'ずっと'], correct: 0, why: 'もう + V ました.' },
        { q: 'いま 12じ。「もう 12じです（　）。」(thông báo cho người chưa biết)', options: ['よ', 'ね', 'か', 'が'], correct: 0, why: '**よ** = đưa thông tin mới.' },
        { q: 'テーブルのうえに りんごが ３（　）あります。', options: ['つ', 'まい', 'ほん', 'だい'], correct: 0, why: 'りんご = vật chung → **～つ** (みっつ).' },
        { q: 'FPT大学（　）コンサートが あります。', options: ['で', 'に', 'を', 'へ'], correct: 0, why: 'Sự kiện → **で**.' },
        { q: '「A ツアーと B ツアーと どちらが やすいですか。」「（　）やすいです。」', options: ['どちらも', 'どれも', 'どこも', 'だれも'], correct: 0, why: 'Cả hai → **どちらも**.' },
      ],
    },
  ],
};

/* ═══════════════════════ SLIDE TỔNG HỢP TỪ VỰNG & NGỮ PHÁP — BÀI 7 ═══════════════════════ */

const TONG_HOP_B7: Lesson = {
  id: 'slide-tong-hop-b7',
  kind: 'review',
  title: 'Slide tổng hợp từ vựng & ngữ pháp Bài 7 (bộ slide cô dùng ôn thi) — đi đúng thứ tự slide',
  goal: 'Có "bản tóm tắt thi" của Bài 7 đúng như bộ slide tổng hợp của cô: 3 phần (vị trí · chuẩn bị tiệc · vui tiệc), từ vựng gom theo phần và các ví dụ riêng của bộ này.',
  minutes: 45,
  blocks: [
    {
      t: 'recap',
      title: 'Bộ slide tổng hợp Bài 7 có gì',
      items: [
        '**Từ mới 3 phần**: Phần 1 (đường phố & vị trí) — かいさつ · こうばん · じどうはんばいき · バスてい · ポスト · はな · いぬ + vị trí; Phần 2 (bếp & chuẩn bị tiệc) — いす · テーブル · でんしレンジ · れいぞうこ · さとう · しお · しょうゆ · コップ · (お)さら · はし · スプーン · ナイフ · フォーク + kanji/katakana/ひらがな/ローマじ + てつだいます · あらいます… · どれ; Phần 3 — ギター · だいどころ · たばこ · でんわ · ピザ · まど · うたいます · すいます · はなします · ひきます · かけます.',
        '**Ngữ pháp**: ～に ～が あります／います · ～は ～に あります／います · thể て · ～てください · で (dụng cụ) · V ます+方 · どの/どれ · ～ています · ～ましょうか · まだ/もう · だれが/いつが/どこが/なにが.',
        'Cuối mỗi phần có **ví dụ dịch Việt → Nhật**; bài này gom lại có romaji.',
      ],
    },

    { t: 'h', text: 'Phần 1 — パート１ 「道がわかりません」' },
    {
      t: 'table',
      caption: 'あります (đồ vật) / います (người + động vật): ví dụ riêng của bộ tổng hợp',
      head: ['Câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['わたしは こいびとが いません。', 'Watashi wa koibito ga imasen.', 'Tôi không có người yêu.'],
        ['あには にほんじんの ともだちが います。', 'Ani wa nihonjin no tomodachi ga imasu.', 'Anh trai tôi có bạn người Nhật.'],
        ['こうえんに ひとが たくさん います。', 'Kouen ni hito ga takusan imasu.', 'Trong công viên có rất nhiều người.'],
        ['テーブルに でんわが あります。', 'Teeburu ni denwa ga arimasu.', 'Trên bàn có điện thoại.'],
        ['きょうしつに せんせいと がくせいが います。', 'Kyoushitsu ni sensei to gakusei ga imasu.', 'Trong lớp có thầy cô và sinh viên.'],
        ['きょうしつに いすや つくえが あります。', 'Kyoushitsu ni isu ya tsukue ga arimasu.', 'Trong lớp có ghế, bàn…'],
      ],
    },
    {
      t: 'note',
      title: 'Hai ví dụ lạ ở slide — hiểu cho đúng',
      items: [
        '**こいびとが いません / ともだちが います**: います cũng dùng để nói **"có (người thân/bạn bè)"** — không chỉ nơi chốn. Cô nhấn mạnh "**Dùng cho người và động vật**".',
        '**や** liệt kê "ví dụ nhiều thứ": いすや つくえ (ghế, bàn…); **と** liệt kê "chỉ hai thứ đó": せんせいと がくせい.',
      ],
    },
    {
      t: 'table',
      caption: 'N の ＋ vị trí (slide có thêm "よこ / となり", "まえ / うしろ" cho cả ぎんこう)',
      head: ['Câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['きょうしつの なかに いすや つくえが あります。', 'Kyoushitsu no naka ni isu ya tsukue ga arimasu.', 'Trong lớp có ghế, bàn…'],
        ['かばんの なかに いぬが います。', 'Kaban no naka ni inu ga imasu.', 'Trong cặp có con chó.'],
        ['きの うえに いぬと ねこが います。', 'Ki no ue ni inu to neko ga imasu.', 'Trên cây có chó và mèo.'],
        ['れいぞうこの なかに みずや たまごが あります。', 'Reizouko no naka ni mizu ya tamago ga arimasu.', 'Trong tủ lạnh có nước, trứng…'],
        ['テーブルの うえに コップが あります。', 'Teeburu no ue ni koppu ga arimasu.', 'Trên bàn có cái cốc.'],
        ['テーブルの うえに コップや さらが あります。', 'Teeburu no ue ni koppu ya sara ga arimasu.', 'Trên bàn có cốc, đĩa…'],
        ['テーブルの うえに いろいろな りょうりが あります。', 'Teeburu no ue ni iroiro na ryouri ga arimasu.', 'Trên bàn có nhiều món ăn khác nhau.'],
        ['ゆうびんきょくの まえに ポストが あります。', 'Yuubinkyoku no mae ni posuto ga arimasu.', 'Trước bưu điện có hòm thư.'],
        ['いすの うえに おとこの ひとと いぬと ねこが います。', 'Isu no ue ni otoko no hito to inu to neko ga imasu.', 'Trên ghế có một người đàn ông, một con chó và một con mèo.'],
        ['いえの まえに くるまと きが あります。', 'Ie no mae ni kuruma to ki ga arimasu.', 'Trước nhà có ô tô và cây.'],
      ],
    },
    {
      t: 'table',
      caption: 'Hỏi bằng なに / だれ và đáp (slide tổng hợp)',
      head: ['Hỏi', 'Đáp', 'Nghĩa'],
      rows: [
        ['レストランの なかに だれが いますか。', 'おとこの ひとと おんなの ひとが います。', 'Trong nhà hàng có ai? — Một người đàn ông và một người phụ nữ.'],
        ['テーブルの うえに なにが ありますか。', 'コップと おさらが あります。', 'Trên bàn có gì? — Cốc và đĩa.'],
        ['ほんやの みぎに なにが ありますか。', 'パンやが あります。', 'Bên phải hiệu sách có gì? — Tiệm bánh.'],
        ['パンやと レストランの あいだに なにが ありますか。', 'ほんやが あります。', 'Giữa tiệm bánh và nhà hàng có gì? — Hiệu sách.'],
        ['クラスの なかに だれが いますか。', 'だれも いません。', 'Trong lớp có ai không? — Không có ai.'],
        ['はこの なかに なにが ありますか。', 'なにも ありません。', 'Trong hộp có gì? — Chẳng có gì.'],
        ['きの したに だれが いますか。', 'きの したに だれも いません。', 'Dưới cây có ai? — Dưới cây không có ai.'],
      ],
    },
    {
      t: 'table',
      caption: 'Hai khung (1) và (2) với những câu rất "đời thường" của slide',
      head: ['Khung', 'Câu', 'Romaji'],
      rows: [
        ['(1) N に N が', 'あそこに トイレが あります。', 'Asoko ni toire ga arimasu.'],
        ['(1) N に N が', 'あそこに おんなの ひとが います。', 'Asoko ni onna no hito ga imasu.'],
        ['(1) N に N が', 'としょかんに おおきい つくえが あります。', 'Toshokan ni ookii tsukue ga arimasu.'],
        ['(1) N に N が', 'きょうしつに あたらしい がくせいが います。', 'Kyoushitsu ni atarashii gakusei ga imasu.'],
        ['(2) N は N に', 'トイレは あそこに あります。', 'Toire wa asoko ni arimasu.'],
        ['(2) N は N に', 'ヴァンせんせいは わたしの まえに います。', 'Van-sensei wa watashi no mae ni imasu.'],
      ],
    },
    {
      t: 'note',
      title: 'Cách nhớ (1) và (2)',
      items: [
        'Khung (1): **chỗ trước** (N に) → **cái gì sau** (N が). Khung (2): **cái đã biết trước** (N は) → **ở đâu** (N に).',
        'Hỏi **どこ** ở khung (2): ~さんは **どこに** いますか。 Hỏi **なに/だれ** ở khung (1): ～に **なにが** ありますか。',
      ],
    },

    { t: 'h', text: 'Phần 2 — パート２ 「パーティーのじゅんび」' },
    {
      t: 'table',
      caption: 'Câu ví dụ với ～てください của bộ tổng hợp (có dịch Việt)',
      head: ['Tiếng Nhật', 'Romaji', 'Nghĩa'],
      rows: [
        ['テーブルに コップを おいて ください。', 'Teeburu ni koppu o oite kudasai.', 'Hãy đặt cốc xuống bàn.'],
        ['まいにち にほんごで はなして ください。', 'Mainichi nihongo de hanashite kudasai.', 'Hãy nói chuyện bằng tiếng Nhật mỗi ngày.'],
        ['れいぞうこに ケーキを いれて ください。', 'Reizouko ni keeki o irete kudasai.', 'Hãy cho bánh ngọt vào tủ lạnh.'],
        ['おさらを あらって ください。それから、いすを あそこへ もっていって ください。', 'Osara o aratte kudasai. Sorekara, isu o asoko e motte itte kudasai.', 'Hãy rửa đĩa, sau đó hãy mang ghế lại đằng kia.'],
        ['れいぞうこから ジュースを だして ください。', 'Reizouko kara juusu o dashite kudasai.', 'Hãy lấy nước hoa quả từ tủ lạnh.'],
        ['いすを あそこへ もっていって ください。', 'Isu o asoko e motte itte kudasai.', 'Hãy mang ghế đến chỗ kia.'],
        ['このりょうりは おいしいですから、たくさん たべて ください。', 'Kono ryouri wa oishii desu kara, takusan tabete kudasai.', 'Vì món này ngon, hãy ăn nhiều nhé.'],
        ['たばこは あそこで すって ください。', 'Tabako wa asoko de sutte kudasai.', 'Thuốc lá xin hãy hút ở chỗ kia.'],
        ['サラダを つくって ください。', 'Sarada o tsukutte kudasai.', 'Hãy làm món salad.'],
        ['そのかばんを ここへ もって きて ください。', 'Sono kaban o koko e motte kite kudasai.', 'Hãy mang cái cặp đó đến đây.'],
      ],
    },
    {
      t: 'note',
      title: 'Hai điểm chỉ có ở bộ tổng hợp',
      items: [
        'Hình minh họa các từ mới của Phần 2: **かんじ · カタカナ · ひらがな · ローマじ** (chữ viết — đi với かきます), **かさ** (かします), **ラジオ · CD · テープ** (ききます), **かみ · パン** (きります), **にほんご** (おしえます): dùng làm ví dụ cho **で** (dụng cụ) và các động từ đi kèm.',
        '**ききます** xuất hiện hai lần trên slide: 聞く (nghe) với CD/ラジオ/テープ và 聞く (hỏi) với 先生に ききます. Cùng て-form: **きいて**.',
      ],
    },
    {
      t: 'table',
      caption: 'どの / どれ — gọn nhất (slide cuối phần 2)',
      head: ['Cái này', 'Cái đó', 'Cái kia', 'Cái nào'],
      rows: [
        ['これ / この', 'それ / その', 'あれ / あの', 'どれ / どの'],
      ],
    },
    {
      t: 'table',
      caption: 'Hai hội thoại ví dụ trong slide',
      head: ['Hội thoại', 'Romaji', 'Nghĩa'],
      rows: [
        ['A: Bさん、コップに みずを いれて ください。 B: どの コップですか。 A: その コップです。', 'A: B-san, koppu ni mizu o irete kudasai. B: Dono koppu desu ka. A: Sono koppu desu.', 'A: B ơi, rót nước vào cốc giúp. B: Cốc nào ạ? A: Cái cốc đó.'],
        ['A: Bさん、スプーンを ください。 B: どの スプーンですか。 A: その スプーンです。', 'A: B-san, supuun o kudasai. B: Dono supuun desu ka. A: Sono supuun desu.', 'A: B ơi, cho mình cái thìa. B: Thìa nào ạ? A: Cái thìa đó.'],
        ['A: Bさん、いすを テーブルの よこに おいて ください。 B: どの いすですか。 A: あの いすです。', 'A: B-san, isu o teeburu no yoko ni oite kudasai. B: Dono isu desu ka. A: Ano isu desu.', 'A: B ơi, đặt ghế cạnh bàn. B: Ghế nào ạ? A: Cái ghế kia.'],
      ],
    },

    { t: 'h', text: 'Phần 3 — パート３ 「みんなで楽しいパーティー」' },
    {
      t: 'table',
      caption: 'Ví dụ ～ています riêng của bộ tổng hợp',
      head: ['Tiếng Nhật', 'Romaji', 'Nghĩa'],
      rows: [
        ['いま わたしは にほんごの うたを きいて います。', 'Ima watashi wa nihongo no uta o kiite imasu.', 'Bây giờ tôi đang nghe bài hát tiếng Nhật.'],
        ['いま ソンさんは 2かいの 201の へやで ヴァンせんせいと はなして います。', 'Ima Son-san wa nikai no nihyakuichi no heya de Van-sensei to hanashite imasu.', 'Bây giờ bạn Sơn đang nói chuyện với cô Vân ở phòng 201 tầng 2.'],
        ['ダニエルさんは いま だいどころで おさらを あらって います。', 'Danieru-san wa ima daidokoro de osara o aratte imasu.', 'Bây giờ Daniel đang rửa đĩa ở bếp.'],
        ['アンナさんは いま へやの なかで ごかぞくに でんわを かけて います。', 'Anna-san wa ima heya no naka de gokazoku ni denwa o kakete imasu.', 'Bây giờ Anna đang gọi điện cho gia đình trong phòng.'],
        ['ナタポンさんは いま どこで たばこを すって いますか。', 'Natapon-san wa ima doko de tabako o sutte imasu ka.', 'Bây giờ Natapon đang hút thuốc ở đâu?'],
      ],
    },
    {
      t: 'table',
      caption: 'ましょうか (để tôi…) — ví dụ của slide',
      head: ['Tiếng Nhật', 'Romaji', 'Nghĩa'],
      rows: [
        ['てつだって ください。', 'Tetsudatte kudasai.', 'Hãy giúp tôi.'],
        ['てつだいましょうか。', 'Tetsudaimashou ka.', 'Để tôi giúp bạn nhé!'],
        ['かさを かしましょうか。', 'Kasa o kashimashou ka.', 'Để tôi cho bạn mượn ô nhé!'],
        ['しおを とりましょうか。', 'Shio o torimashou ka.', 'Để tôi lấy muối cho bạn nhé!'],
        ['まどを あけましょうか。', 'Mado o akemashou ka.', 'Để tôi mở cửa sổ nhé!'],
        ['コップを あらいましょうか。', 'Koppu o araimashou ka.', 'Để tôi rửa cốc cho bạn nhé!'],
        ['かばんを もちましょうか。', 'Kaban o mochimashou ka.', 'Để tôi mang cặp cho bạn nhé!'],
        ['おさらを もって きましょうか。', 'Osara o motte kimashou ka.', 'Để tôi mang đĩa đến cho bạn nhé!'],
        ['まどを しめましょうか。', 'Mado o shimemashou ka.', 'Để tôi đóng cửa sổ nhé!'],
      ],
    },
    {
      t: 'table',
      caption: 'まだ VS もう — bảng ở slide cuối (hỏi thăm bài tập về nhà)',
      head: ['Hỏi', 'Đáp', 'Nghĩa của đáp'],
      rows: [
        ['しゅくだいを もう しましたか。', 'はい、もう しました。', 'Rồi, tôi đã làm rồi.'],
        ['(cùng câu hỏi)', 'いいえ、まだです。', 'Chưa.'],
        ['(cùng câu hỏi)', 'いいえ、まだ して いません。', 'Chưa làm.'],
        ['おかねが ありますか。', 'おかねが まだ あります。', 'Vẫn còn tiền.'],
        ['(…)', 'おかねが まだ ありません。', 'Vẫn chưa có tiền.'],
        ['(…)', 'おかねが もう ありません。', 'Không còn tiền nữa.'],
      ],
    },
    {
      t: 'table',
      caption: 'だれが / いつが / どこが / なにが — ba câu dịch của slide (đáp án mẫu)',
      head: ['Tiếng Việt', 'Tiếng Nhật', 'Romaji'],
      rows: [
        ['Ngày mai bạn Lan sẽ mang bánh ngọt tới.', 'あした ランさんが ケーキを もって きます。', 'Ashita Ran-san ga keeki o motte kimasu.'],
        ['Anh Kim đang nói chuyện với khách hàng.', 'キムさんは おきゃくさまと はなして います。', 'Kimu-san wa okyakusama to hanashite imasu.'],
        ['Cô giáo sẽ không đi du lịch cùng mọi người.', 'せんせいは みんなと いっしょに りょこうに いきません。', 'Sensei wa minna to issho ni ryokou ni ikimasen.'],
      ],
    },
    {
      t: 'mcq',
      id: 'tonghop7-luyen',
      title: 'Luyện nhanh từ bộ slide tổng hợp Bài 7',
      items: [
        { q: 'あには にほんじんの ともだちが（　）。', options: ['います', 'あります', 'いきます', 'ありません'], correct: 0, why: 'Bạn bè = người → **います** (có bạn).' },
        { q: 'きょうしつに いすや つくえが（　）。', options: ['あります', 'います', 'いません', 'ありました'], correct: 0, why: 'Đồ vật → あります.' },
        { q: 'ナタポンさんは いま どこで たばこを（　）か。', options: ['すっていますか', 'すいますか', 'すいていますか', 'すいて ください'], correct: 0, why: 'Đang hút → **すっています**.' },
        { q: 'かさを（　）。(Để tôi cho bạn mượn ô nhé!)', options: ['かしましょうか', 'かりましょうか', 'かして ください', 'かしました'], correct: 0, why: 'かします + ましょうか = **かしましょうか**.' },
        { q: 'おかねが（　）ありません。(hết rồi)', options: ['もう', 'まだ', 'ぜひ', 'ずっと'], correct: 0, why: '**もう ありません** = không còn nữa.' },
        { q: 'クラスの なかに だれが いますか。→（　）いません。', options: ['だれも', 'だれが', 'なにも', 'だれか'], correct: 0, why: 'だれも + phủ định.' },
      ],
    },
  ],
};

/* ═══════════════════════ CHIA THỂ て — BÀI TẬP BÀI 7 ═══════════════════════ */

const TE_BT7: Lesson = {
  id: 'chia-the-te-bt-bai-7',
  kind: 'homework',
  title: 'Chia thể て (bài tập bài 7) — đáp án 49 động từ + cách chia nhanh',
  goal: 'Chia đúng thể て của 49 động từ Bài 3–7 trong file "Bài tập chia thể te bài 7" (nhóm + thể て), và có thủ thuật chia nhanh khi thi.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'File bài tập của cô là gì',
      items: [
        '"**Bài tập chia thể te bài 7**" (3 trang) là bảng 5 cột: **Số thứ tự · Bài · Động từ · Nhóm · Thể て**, gồm **49 động từ** lấy từ Bài 3 đến Bài 7. Hàng đầu **行きます · nhóm 1** được cô tô đỏ vì là **ngoại lệ**.',
        'Cô đã điền sẵn nhóm của vài hàng đầu (行きます 1, 帰ります 1, 飲みます 1, 食べます 2) làm mẫu — còn lại bạn tự điền. Đáp án đầy đủ ở bảng dưới (nhóm + て).',
        'File **không có đáp án in** → bảng này là **TỰ GIẢI** đối chiếu quy tắc ở Slot 16 và tra từ điển; đã kiểm từng từ.',
      ],
    },
    {
      t: 'rule',
      formula: 'Nhóm I: い・ち・り→って　み・び・に→んで　き→いて　ぎ→いで　し→して　（行く→行って）　·　Nhóm II: bỏ ます + て　·　Nhóm III: して・きて',
      vi: 'Bảng thần chú — chia 49 từ dưới đây theo đúng thứ tự này.',
    },

    { t: 'h', text: 'Bảng đáp án đầy đủ (theo thứ tự trong file)' },
    {
      t: 'table',
      caption: 'Phần 1 — Bài 3–4 (16 động từ)',
      head: ['#', 'Động từ', 'Nhóm', 'Thể て', 'Romaji', 'Nghĩa'],
      rows: [
        ['1', '{行|い}きます', 'I', 'いって', 'itte', 'đi (ngoại lệ)'],
        ['2', '{帰|かえ}ります', 'I', 'かえって', 'kaette', 'về'],
        ['3', '{飲|の}みます', 'I', 'のんで', 'nonde', 'uống'],
        ['4', '{食|た}べます', 'II', 'たべて', 'tabete', 'ăn'],
        ['5', '{見|み}ます', 'II', 'みて', 'mite', 'xem'],
        ['6', 'します', 'III', 'して', 'shite', 'làm'],
        ['7', '{買|か}います', 'I', 'かって', 'katte', 'mua'],
        ['8', '{聞|き}きます', 'I', 'きいて', 'kiite', 'nghe / hỏi'],
        ['9', 'はたらきます', 'I', 'はたらいて', 'hataraite', 'làm việc'],
        ['10', '{読|よ}みます', 'I', 'よんで', 'yonde', 'đọc'],
        ['11', '{起|お}きます', 'II', 'おきて', 'okite', 'thức dậy'],
        ['12', 'ねます', 'II', 'ねて', 'nete', 'ngủ'],
        ['13', '{勉強|べんきょう}します', 'III', 'べんきょうして', 'benkyou shite', 'học'],
        ['14', '{来|き}ます', 'III', 'きて', 'kite', 'đến'],
        ['15', '{会|あ}います', 'I', 'あって', 'atte', 'gặp'],
        ['16', 'つくります', 'I', 'つくって', 'tsukutte', 'làm / nấu'],
      ],
    },
    {
      t: 'table',
      caption: 'Phần 2 — Bài 5–6 (17 động từ)',
      head: ['#', 'Động từ', 'Nhóm', 'Thể て', 'Romaji', 'Nghĩa'],
      rows: [
        ['17', '{買|か}い{物|もの}します', 'III', 'かいものして', 'kaimono shite', 'mua sắm'],
        ['18', 'しょくじします', 'III', 'しょくじして', 'shokuji shite', 'dùng bữa'],
        ['19', 'せんたくします', 'III', 'せんたくして', 'sentaku shite', 'giặt đồ'],
        ['20', 'そうじします', 'III', 'そうじして', 'souji shite', 'dọn dẹp'],
        ['21', 'のぼります', 'I', 'のぼって', 'nobotte', 'leo'],
        ['22', 'はいります', 'I', 'はいって', 'haitte', 'vào (ngoại lệ: nhóm I)'],
        ['23', '{撮|と}ります', 'I', 'とって', 'totte', 'chụp (ảnh)'],
        ['24', 'かります', 'II', 'かりて', 'karite', 'mượn (ngoại lệ: nhóm II)'],
        ['25', 'あります', 'I', 'あって', 'atte', 'có (vật)'],
        ['26', 'あそびます', 'I', 'あそんで', 'asonde', 'chơi'],
        ['27', 'います', 'II', 'いて', 'ite', 'có / ở (người)'],
        ['28', 'あらいます', 'I', 'あらって', 'aratte', 'rửa'],
        ['29', '{置|お}きます', 'I', 'おいて', 'oite', 'đặt'],
        ['30', '{書|か}きます', 'I', 'かいて', 'kaite', 'viết'],
        ['31', 'かします', 'I', 'かして', 'kashite', 'cho mượn'],
        ['32', 'きります', 'I', 'きって', 'kitte', 'cắt'],
        ['33', 'つかいます', 'I', 'つかって', 'tsukatte', 'dùng'],
      ],
    },
    {
      t: 'table',
      caption: 'Phần 3 — Bài 7 (16 động từ)',
      head: ['#', 'Động từ', 'Nhóm', 'Thể て', 'Romaji', 'Nghĩa'],
      rows: [
        ['34', 'てつだいます', 'I', 'てつだって', 'tetsudatte', 'giúp đỡ'],
        ['35', '{取|と}ります', 'I', 'とって', 'totte', 'lấy'],
        ['36', '{持|も}っていきます', 'I', 'もっていって', 'motte itte', 'mang đi (ngoại lệ いって)'],
        ['37', 'わかります', 'I', 'わかって', 'wakatte', 'hiểu'],
        ['38', 'だします', 'I', 'だして', 'dashite', 'lấy ra'],
        ['39', 'いれます', 'II', 'いれて', 'irete', 'cho vào'],
        ['40', 'おしえます', 'II', 'おしえて', 'oshiete', 'dạy / chỉ'],
        ['41', 'うたいます', 'I', 'うたって', 'utatte', 'hát'],
        ['42', 'すいます', 'I', 'すって', 'sutte', 'hút (thuốc)'],
        ['43', '{話|はな}します', 'I', 'はなして', 'hanashite', 'nói chuyện'],
        ['44', 'ひきます', 'I', 'ひいて', 'hiite', 'chơi (đàn)'],
        ['45', 'もちます', 'I', 'もって', 'motte', 'cầm'],
        ['46', 'あけます', 'II', 'あけて', 'akete', 'mở'],
        ['47', 'しめます', 'II', 'しめて', 'shimete', 'đóng'],
        ['48', 'かけます', 'II', 'かけて', 'kakete', 'gọi điện / treo'],
        ['49', '{持|も}って{来|き}ます', 'III', 'もってきて', 'motte kite', 'mang đến'],
      ],
    },
    {
      t: 'note',
      title: 'Thống kê & những chỗ dễ sai trong bảng',
      items: [
        '**Nhóm I**: 30 từ · **Nhóm II**: 11 từ · **Nhóm III**: 8 từ (きます 2 dạng, します 6 dạng).',
        '**Hai từ nhóm I mà nhìn như nhóm II**: はいります (入ります), かえります (帰ります). Chúng chia **って** (はいって, かえって).',
        '**Hai từ nhóm II mà nhìn như nhóm I**: かります (借ります) → かりて; おきます (起きます) → おきて (đừng nhầm với 置きます → おいて).',
        '**Cặp dễ lẫn**: 取ります・撮ります đều là とって (cùng âm, khác chữ Hán); 持っていきます → もっていって (**いって**, không phải ~~いきて~~).',
        '**のんで / よんで / あそんで** đều có **ん** vì み・び → んで. **きって / かって / あって** đều có **っ** vì り・い → って.',
        '**あります** thể て = **あって** (nhóm I, đuôi り → って). **います** = **いて** (nhóm II).',
      ],
    },

    { t: 'h', text: 'Cách chia nhanh khi thi (3 bước, dưới 3 giây/từ)' },
    {
      t: 'table',
      caption: '3 bước chia て',
      head: ['Bước', 'Làm gì', 'Ví dụ'],
      rows: [
        ['① Nhìn đuôi ます', 'Nếu là **します / きます / N します** → nhóm III: して / きて.', 'べんきょうします → べんきょうして'],
        ['② Nhìn âm trước ます', '**Âm え** → nhóm II (bỏ ます + て). **Âm い**: thuộc lòng 4 ngoại lệ みます・います・かります・おきます(起) → nhóm II; còn lại → nhóm I.', 'たべます → たべて; みます → みて; かきます (い-き) → nhóm I'],
        ['③ Nhóm I: nhìn **chữ cuối**', 'い・ち・り → **って** · み・び・に → **んで** · き → **いて** · ぎ → **いで** · し → **して** · ngoại lệ 行く → 行って', 'のみます → のんで; きります → きって'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo ghi nhớ',
      items: [
        '**"って hay gặp nhất"**: trong nhóm I, **い・ち・り** (3 đuôi) đều → って, nên trong bảng 30 từ nhóm I có khoảng một nửa chia って.',
        '**"ん đi cùng ん"**: み・び・に có âm mũi (m, b, n) → んで. Nhớ **みびに → んで** như số điện thoại.',
        '**"き = い"**: かきます → かいて. Ngoại lệ **行く** đã có "って" từ gốc (いって = đi rồi).',
        '**"し = して"**: giữ nguyên し, chỉ thêm て (はなして, かして, だして).',
      ],
    },
    {
      t: 'quiz',
      id: 'te-bt7-chia',
      title: 'Luyện chia て — 30 từ ngẫu nhiên từ bảng (gõ hiragana)',
      kind: 'fill',
      grammar: 'い・ち・り→って · み・び・に→んで · き→いて · ぎ→いで · し→して · 行く→行って',
      items: [
        { q: 'のぼります', answers: ['のぼって'], hint: 'り → って' },
        { q: 'はいります', answers: ['はいって', '入って'], hint: 'nhóm I' },
        { q: '撮ります', answers: ['とって', '撮って'], hint: 'り → って' },
        { q: 'かります', answers: ['かりて', '借りて'], hint: 'nhóm II' },
        { q: 'あそびます', answers: ['あそんで', '遊んで'], hint: 'び → んで' },
        { q: 'います', answers: ['いて', '居て'], hint: 'nhóm II' },
        { q: 'あらいます', answers: ['あらって', '洗って'], hint: 'い → って' },
        { q: '置きます', answers: ['おいて', '置いて'], hint: 'き → いて' },
        { q: 'かします', answers: ['かして', '貸して'], hint: 'し → して' },
        { q: 'つかいます', answers: ['つかって', '使って'], hint: 'い → って' },
        { q: 'てつだいます', answers: ['てつだって', '手伝って'], hint: 'い → って' },
        { q: '持っていきます', answers: ['もっていって', '持って行って', '持っていって'], hint: 'いって' },
        { q: 'だします', answers: ['だして', '出して'], hint: 'し → して' },
        { q: 'いれます', answers: ['いれて', '入れて'], hint: 'nhóm II' },
        { q: 'おしえます', answers: ['おしえて', '教えて'], hint: 'nhóm II' },
        { q: 'うたいます', answers: ['うたって', '歌って'], hint: 'い → って' },
        { q: 'すいます', answers: ['すって', '吸って'], hint: 'い → って' },
        { q: 'ひきます', answers: ['ひいて', '弾いて'], hint: 'き → いて' },
        { q: 'もちます', answers: ['もって', '持って'], hint: 'ち → って' },
        { q: 'あけます', answers: ['あけて', '開けて'], hint: 'nhóm II' },
        { q: 'しめます', answers: ['しめて', '閉めて'], hint: 'nhóm II' },
        { q: 'かけます', answers: ['かけて'], hint: 'nhóm II' },
        { q: '持って来ます', answers: ['もってきて', '持って来て'], hint: 'nhóm III' },
        { q: 'せんたくします', answers: ['せんたくして', '洗濯して'], hint: 'nhóm III' },
        { q: 'そうじします', answers: ['そうじして', '掃除して'], hint: 'nhóm III' },
        { q: 'しょくじします', answers: ['しょくじして', '食事して'], hint: 'nhóm III' },
        { q: 'かいものします', answers: ['かいものして', '買い物して'], hint: 'nhóm III' },
        { q: 'あります', answers: ['あって'], hint: 'nhóm I' },
        { q: 'つくります', answers: ['つくって', '作って'], hint: 'り → って' },
        { q: 'はたらきます', answers: ['はたらいて', '働いて'], hint: 'き → いて' },
      ],
    },
    {
      t: 'mcq',
      id: 'te-bt7-nhom',
      title: 'Xác định nhóm — những từ hay sai',
      items: [
        { q: 'はいります (入ります) thuộc nhóm?', options: ['I', 'II', 'III'], correct: 0, why: 'り (i) → nhóm I: **はいって**.' },
        { q: 'かりる／かります (mượn) thuộc nhóm?', options: ['I', 'II', 'III'], correct: 1, why: 'Ngoại lệ → nhóm II: **かりて**.' },
        { q: '起きます (thức dậy) vs 置きます (đặt): て-form của 2 từ này?', options: ['おきて / おいて', 'おいて / おきて', 'おきて / おきて', 'おいて / おいて'], correct: 0, why: '起きます (II) → おきて · 置きます (I) → おいて.' },
        { q: '行きます → ?', options: ['いって', 'いいて', 'いきて', 'いんで'], correct: 0, why: 'Ngoại lệ: **いって**.' },
        { q: '持って来ます → ?', options: ['もってきて', 'もっていって', 'もってくて', 'もってきって'], correct: 0, why: 'きます → きて. もっていきます (đi) → もっていって.' },
        { q: 'のぼります → ?', options: ['のぼって', 'のぼんで', 'のぼいて', 'のぼりて'], correct: 0, why: 'り → って.' },
      ],
    },
    {
      t: 'note',
      title: 'Cô hay hỏi gì khi chữa bài chia て',
      items: [
        '"**〇〇ます、グループ いくつ？ て-form は？**" — trả lời đủ **nhóm + て** (ví dụ: **のみます、グループ 1、のんで**).',
        'Cô hay chọn từ **ngoại lệ** (行きます, かります, はいります, 起きます) để kiểm tra — thuộc lòng 4 từ này.',
        'Sau khi chia, cô bảo đặt câu **～て ください / ～て います** với đúng từ đó.',
      ],
    },
  ],
};

/* ═══════════════════════ XUẤT BẢN ═══════════════════════ */

export const SLIDE_B67: Lesson[] = [
  SLOT_10,
  SLOT_11,
  TONG_HOP_B6,
  SLOT_12,
  SLOT_13,
  SLOT_14,
  SLOT_15,
  TONG_HOP_B7,
  SLOT_16,
  SLOT_17,
  SLOT_18,
  SLOT_19,
  BT_B67,
  TE_BT7,
];
