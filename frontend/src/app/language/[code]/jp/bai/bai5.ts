/**
 * KHOÁ JP · Bài 5 — Đi đâu, bằng gì, với ai: 行きます・来ます・かえります, へ, で, と, いつ
 * (05/10/2026). Bài cuối CHẶNG 1 ⇒ có thêm mục `b5-kiem-tra` (kiểm tra Bài 0–5).
 *
 * Soạn theo ../SOAN-BAI.md. Tự viết 100% (hội thoại, ví dụ, bài nghe, bài đọc, đề kiểm tra).
 * Nối tiếp Bài 4 (giờ, thứ, ngày tháng, から・まで): đây là bài ĐẦU TIÊN có động từ —
 * thể ます／ません／ました／ませんでした của ba động từ di chuyển; giờ/ngày của Bài 4
 * giờ thành "khi nào đi" (いつ, ～に).
 *
 * Chữ viết: chữ Hán N5 có furigana ({行|い}きます, {来週|らいしゅう}, {電車|でんしゃ});
 * từ có chữ ngoài N5 viết kana (かえります — 帰 ngoài N5; きょねん, ひこうき, ちかてつ).
 *
 * Nhân vật & giọng: ラン (Lan, nữ, vai a) · たなかさん (Tanaka, nam, vai b) ·
 * えきいん (nhân viên nhà ga, nam, vai b) · マイクさん (Mike, nam, vai b) ·
 * やまだ先生 (nữ, vai c) · キムさん (nữ, chỉ trong bài nghe/đọc) · すずきさん (nam).
 */
import type { Lesson } from '@/components/sach-hoc/types';

/* ── Đáp án gõ tay ─────────────────────────────────────────────────────────
 * Bộ chấm bỏ dấu câu/khoảng trắng và đổi chữ/số toàn khổ về nửa khổ, nhưng
 * KHÔNG tự đổi chữ Hán ↔ kana. ans() nhận mẫu có furigana {漢字|かな} và sinh
 * mọi tổ hợp gõ Hán hoặc gõ kana cho từng cặp, cộng じゃ/では và へ/に (đi tới
 * một nơi). Phần tử ĐẦU là bản chữ Hán đầy đủ (trang hiện nó làm "Đáp án").
 */
const RUBY = /\{([^|}]+)\|([^}]+)\}/g;
function ans(...forms: string[]): string[] {
  const out = new Set<string>();
  for (const f of forms) {
    const n = [...f.matchAll(RUBY)].length;
    const bases: string[] = [];
    if (n <= 6) {
      for (let mask = 0; mask < 1 << n; mask++) {
        let i = 0;
        bases.push(f.replace(RUBY, (_m, k: string, r: string) => ((mask >> i++) & 1 ? r : k)));
      }
    } else {
      bases.push(f.replace(RUBY, '$1'), f.replace(RUBY, '$2'));
    }
    for (const b of bases) {
      for (const x of [b, b.replace(/じゃありません/g, 'ではありません')]) {
        out.add(x);
        // "N へ 行きます" ≈ "N に 行きます" — chấp nhận cả hai.
        out.add(x.replace(/へ(行|い|来|き|かえ)/g, 'に$1'));
      }
    }
  }
  return [...out];
}

/* ══════════════════════════ 1. HỘI THOẠI ══════════════════════════ */

const HOI_THOAI: Lesson = {
  id: 'b5-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại: どこへ 行きましたか・なんで 行きますか・いつ かえりますか',
  goal: 'Kể đã đi đâu, đi bằng gì, đi với ai; hỏi tàu ở nhà ga; nói khi nào về nước và khi nào quay lại Nhật.',
  minutes: 35,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Bài 5 — hôm nay học gì',
      items: [
        'Ba **động từ đầu tiên**: **{行|い}きます** (đi), **{来|き}ます** (đến), **かえります** (về) — và bốn dạng: **～ます・～ません・～ました・～ませんでした**.',
        '**N へ** = đi / đến / về **nơi** N (へ đọc là **e**): {学校|がっこう}**へ**{行|い}きます.',
        '**N で** = **bằng** phương tiện N: {電車|でんしゃ}**で**{行|い}きます. Đi bộ là **あるいて** (không có で).',
        '**N と** = **cùng với** người N: {友|とも}だち**と**{行|い}きます. Một mình là **{一人|ひとり}で**.',
        '**いつ** = khi nào? — trả lời bằng giờ/ngày của Bài 4 + **に**: {7月|しちがつ}{20日|はつか}**に**かえります.',
      ],
    },
    { t: 'h', text: 'Học xong Bài 5 bạn nói được gì' },
    {
      t: 'table',
      head: ['Tình huống', 'Bạn làm được', 'Mẫu câu dùng'],
      rows: [
        ['1. Sáng thứ Hai ở lớp', 'Kể cuối tuần đã đi đâu, với ai, bằng gì; nói mỗi ngày đến trường thế nào.', '～へ{行|い}きました, ～と, ～で, あるいて, どこへも{行|い}きませんでした'],
        ['2. Ở nhà ga', 'Hỏi tàu này có đi tới X không, chuyến sau mấy giờ, sân ga số mấy.', 'この{電車|でんしゃ}は～へ{行|い}きますか, つぎの, ～ばんせん'],
        ['3. Kỳ nghỉ hè', 'Nói khi nào về nước, đi với ai, khi nào quay lại Nhật.', 'いつ, ～に, かえります, {来|き}ます'],
      ],
    },
    {
      t: 'p',
      text: 'Cách học: đọc **bối cảnh** → nghe cả đoạn → bấm từng câu, đọc to theo 3 lần → tắt furigana và romaji rồi đọc lại. Bài này lần đầu có **động từ** — để ý **đuôi câu**: ～ます (sẽ/thường), ～ました (đã), ～ません (không), ～ませんでした (đã không). Nghe đuôi câu là biết chuyện xảy ra lúc nào.',
    },

    /* ── Tình huống 1 ── */
    { t: 'h', text: 'Tình huống 1 — Sáng thứ Hai ở lớp: にちようびに どこへ {行|い}きましたか' },
    {
      t: 'p',
      text: '**Bối cảnh.** Sáng thứ Hai, trước giờ học. Tanaka hỏi Lan cuối tuần đi đâu. Lan đã đi Shinjuku với Kim. Sau đó hai bạn nói chuyện mỗi ngày đến trường bằng gì. Để ý: hai bạn **đang ở trường**, nên nói "đến trường" là **{来|き}ます**.',
    },
    {
      t: 'dialogue',
      title: 'Trước giờ học',
      lines: [
        { who: 'たなか', role: 'b', text: 'ランさん、にちようびにどこへ{行|い}きましたか。', ro: 'Ran-san, nichiyōbi ni doko e ikimashita ka.', vi: 'Lan ơi, Chủ nhật bạn đã đi đâu?' },
        { who: 'ラン', role: 'a', text: 'しんじゅくへ{行|い}きました。', ro: 'Shinjuku e ikimashita.', vi: 'Mình đã đi Shinjuku.' },
        { who: 'たなか', role: 'b', text: 'だれと{行|い}きましたか。', ro: 'Dare to ikimashita ka.', vi: 'Bạn đi với ai?' },
        { who: 'ラン', role: 'a', text: 'キムさんと{行|い}きました。{電車|でんしゃ}で{行|い}きました。たなかさんは？', ro: 'Kimu-san to ikimashita. Densha de ikimashita. Tanaka-san wa?', vi: 'Mình đi với Kim. Đi bằng tàu điện. Còn anh Tanaka?' },
        { who: 'たなか', role: 'b', text: 'ぼくはどこへも{行|い}きませんでした。', ro: 'Boku wa doko e mo ikimasen deshita.', vi: 'Mình chẳng đi đâu cả.' },
        { who: 'ラン', role: 'a', text: 'そうですか。たなかさんは{毎日|まいにち}なんで{学校|がっこう}へ{来|き}ますか。', ro: 'Sō desu ka. Tanaka-san wa mainichi nan de gakkō e kimasu ka.', vi: 'Vậy à. Hằng ngày anh Tanaka đến trường bằng gì?' },
        { who: 'たなか', role: 'b', text: 'あるいて{来|き}ます。ランさんは？', ro: 'Aruite kimasu. Ran-san wa?', vi: 'Mình đi bộ đến. Còn Lan?' },
        { who: 'ラン', role: 'a', text: 'わたしはじてんしゃで{来|き}ます。{10分|じゅっぷん}ぐらいです。', ro: 'Watashi wa jitensha de kimasu. Juppun gurai desu.', vi: 'Mình đến bằng xe đạp. Khoảng 10 phút.' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong đoạn này',
      items: [
        '**{行|い}きました** = đã đi (quá khứ của {行|い}きます). Câu hỏi **どこへ{行|い}きましたか** = "đã đi đâu?".',
        '**へ** viết bằng chữ へ (he) nhưng **đọc là "e"** khi làm trợ từ chỉ hướng — giống は đọc "wa" (Bài 0).',
        '**だれと** = với ai · **キムさんと** = với Kim. **と** đứng **sau** người, ngược tiếng Việt "**với** Kim".',
        '**どこへも{行|い}きませんでした** = "đã không đi đâu cả": どこ + へ + **も** + thể phủ định.',
        '**なんで** = bằng gì. Trả lời **N で**: {電車|でんしゃ}で, じてんしゃで. Đi bộ thì nói **あるいて** (không thêm で).',
        'Hai bạn đang ở trường nên "đến trường" là **{来|き}ます** (đến chỗ người nói đang ở). Ở nhà thì nói {学校|がっこう}へ**{行|い}きます**.',
        '**～ぐらい** = khoảng (độ dài thời gian, số lượng) — khác **～ごろ** (khoảng một **mốc** giờ, Bài 4).',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'にちようびにどこへ{行|い}きましたか。', ro: 'Nichiyōbi ni doko e ikimashita ka.', vi: 'Chủ nhật bạn đã đi đâu?' },
        { en: 'しんじゅくへ{行|い}きました。', ro: 'Shinjuku e ikimashita.', vi: 'Tôi đã đi Shinjuku.' },
        { en: 'キムさんと{行|い}きました。', ro: 'Kimu-san to ikimashita.', vi: 'Tôi đã đi với Kim.' },
        { en: '{電車|でんしゃ}で{行|い}きました。', ro: 'Densha de ikimashita.', vi: 'Tôi đã đi bằng tàu điện.' },
        { en: 'どこへも{行|い}きませんでした。', ro: 'Doko e mo ikimasen deshita.', vi: 'Tôi đã không đi đâu cả.' },
        { en: 'あるいて{来|き}ます。', ro: 'Aruite kimasu.', vi: 'Tôi đi bộ đến.' },
      ],
    },

    /* ── Tình huống 2 ── */
    { t: 'h', text: 'Tình huống 2 — Ở nhà ga: この{電車|でんしゃ}はよこはまへ{行|い}きますか' },
    {
      t: 'p',
      text: '**Bối cảnh.** Thứ Bảy, Lan muốn đi Yokohama. Ở nhà ga có nhiều đường ray (**ばんせん** — sân ga số…) và nhiều loại tàu: **ふつう** (tàu thường, dừng mọi ga) và **きゅうこう** (tàu nhanh, chỉ dừng ga lớn). Lan hỏi anh nhân viên nhà ga (**えきいん**).',
    },
    {
      t: 'dialogue',
      title: 'Trên sân ga',
      lines: [
        { who: 'ラン', role: 'a', text: 'すみません、この{電車|でんしゃ}はよこはまへ{行|い}きますか。', ro: 'Sumimasen, kono densha wa Yokohama e ikimasu ka.', vi: 'Xin lỗi, tàu này có đi Yokohama không ạ?' },
        { who: 'えきいん', role: 'b', text: 'いいえ、{行|い}きません。よこはまはつぎの{電車|でんしゃ}です。', ro: 'Iie, ikimasen. Yokohama wa tsugi no densha desu.', vi: 'Không, không đi ạ. Đi Yokohama là chuyến sau.' },
        { who: 'ラン', role: 'a', text: 'つぎの{電車|でんしゃ}は{何時|なんじ}ですか。', ro: 'Tsugi no densha wa nanji desu ka.', vi: 'Chuyến sau là mấy giờ ạ?' },
        { who: 'えきいん', role: 'b', text: '{10時|じゅうじ}{15分|じゅうごふん}です。', ro: 'Jūji jūgofun desu.', vi: '10 giờ 15 ạ.' },
        { who: 'ラン', role: 'a', text: '{何|なん}ばんせんですか。', ro: 'Nanbansen desu ka.', vi: 'Ở sân ga số mấy ạ?' },
        { who: 'えきいん', role: 'b', text: '{3|さん}ばんせんです。きゅうこうですよ。', ro: 'Sanbansen desu. Kyūkō desu yo.', vi: 'Sân ga số 3. Là tàu nhanh đấy.' },
        { who: 'ラン', role: 'a', text: 'きゅうこうですね。ありがとうございます。', ro: 'Kyūkō desu ne. Arigatō gozaimasu.', vi: 'Tàu nhanh nhỉ. Cảm ơn anh.' },
        { who: 'えきいん', role: 'b', text: 'どういたしまして。', ro: 'Dō itashimashite.', vi: 'Không có gì ạ.' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong đoạn này',
      items: [
        '**この{電車|でんしゃ}はよこはまへ{行|い}きますか** — hỏi "tàu này có đi tới X không?". Trả lời **はい、{行|い}きます** / **いいえ、{行|い}きません** — lặp lại động từ, không trả lời ~~はい、そうです~~.',
        '**{行|い}きません** = không đi (phủ định của {行|い}きます): chỉ cần đổi **ます → ません**.',
        '**つぎの{電車|でんしゃ}** = chuyến tàu sau. つぎ (tiếp theo) + の + N.',
        '**{何|なん}ばんせん** = sân ga số mấy. Bảng điện tử ở ga Nhật ghi **1番線, 2番線…** (番 ngoài N5 nên khoá viết ばんせん).',
        '**よ** cuối câu = "đấy / đó" — báo cho người nghe một thông tin họ chưa biết. Khác **ね** = xác nhận điều cả hai đã biết.',
        '**どういたしまして** = "không có gì" — đáp lại lời cảm ơn.',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'この{電車|でんしゃ}はよこはまへ{行|い}きますか。', ro: 'Kono densha wa Yokohama e ikimasu ka.', vi: 'Tàu này có đi Yokohama không?' },
        { en: 'いいえ、{行|い}きません。', ro: 'Iie, ikimasen.', vi: 'Không, không đi.' },
        { en: 'つぎの{電車|でんしゃ}は{何時|なんじ}ですか。', ro: 'Tsugi no densha wa nanji desu ka.', vi: 'Chuyến sau mấy giờ?' },
        { en: '{何|なん}ばんせんですか。', ro: 'Nanbansen desu ka.', vi: 'Sân ga số mấy?' },
        { en: '{3|さん}ばんせんです。', ro: 'Sanbansen desu.', vi: 'Sân ga số 3.' },
        { en: 'どういたしまして。', ro: 'Dō itashimashite.', vi: 'Không có gì.' },
      ],
    },

    /* ── Tình huống 3 ── */
    { t: 'h', text: 'Tình huống 3 — Kỳ nghỉ hè: いつ{国|くに}へかえりますか' },
    {
      t: 'p',
      text: '**Bối cảnh.** Tháng 7, sắp nghỉ hè. Cô Yamada hỏi Lan có về Việt Nam không. Chú ý cô dùng **かえります** (về — về nhà, về nước mình) cho Lan, và **{来|き}ます** khi nói Lan quay **lại Nhật** — vì cô đang ở Nhật.',
    },
    {
      t: 'dialogue',
      title: 'Ở phòng giáo viên',
      lines: [
        { who: 'やまだ先生', role: 'c', text: 'ランさん、なつ{休|やす}みに{国|くに}へかえりますか。', ro: 'Ran-san, natsuyasumi ni kuni e kaerimasu ka.', vi: 'Lan, nghỉ hè em có về nước không?' },
        { who: 'ラン', role: 'a', text: 'はい、かえります。', ro: 'Hai, kaerimasu.', vi: 'Dạ, có ạ.' },
        { who: 'やまだ先生', role: 'c', text: 'いつかえりますか。', ro: 'Itsu kaerimasu ka.', vi: 'Khi nào em về?' },
        { who: 'ラン', role: 'a', text: '{7月|しちがつ}{25日|にじゅうごにち}にかえります。', ro: 'Shichigatsu nijūgonichi ni kaerimasu.', vi: 'Em về vào ngày 25 tháng 7 ạ.' },
        { who: 'やまだ先生', role: 'c', text: '{一人|ひとり}でかえりますか。', ro: 'Hitori de kaerimasu ka.', vi: 'Em về một mình à?' },
        { who: 'ラン', role: 'a', text: 'いいえ、ベトナムの{友|とも}だちとかえります。', ro: 'Iie, Betonamu no tomodachi to kaerimasu.', vi: 'Không ạ, em về cùng một bạn người Việt.' },
        { who: 'やまだ先生', role: 'c', text: 'そうですか。いつ{日本|にほん}へ{来|き}ますか。', ro: 'Sō desu ka. Itsu Nihon e kimasu ka.', vi: 'Vậy à. Khi nào em quay lại Nhật?' },
        { who: 'ラン', role: 'a', text: '{8月|はちがつ}{20日|はつか}に{来|き}ます。{来年|らいねん}は{母|はは}も{日本|にほん}へ{来|き}ます。', ro: 'Hachigatsu hatsuka ni kimasu. Rainen wa haha mo Nihon e kimasu.', vi: 'Ngày 20 tháng 8 em sang lại ạ. Năm sau mẹ em cũng sang Nhật.' },
        { who: 'やまだ先生', role: 'c', text: 'いいですね。', ro: 'Ii desu ne.', vi: 'Hay quá nhỉ.' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong đoạn này',
      items: [
        '**いつ** = khi nào. Trả lời bằng mốc thời gian: **{7月|しちがつ}{25日|にじゅうごにち}に**かえります. Mốc có **số** (ngày, giờ) thì thêm **に**.',
        '**なつ{休|やす}みに** — kỳ nghỉ hè cũng là một mốc thời gian, nên có に.',
        '**かえります** = về (nơi mình thuộc về: nhà, nước mình). Người Việt về Việt Nam là **かえります**, không phải ~~{行|い}きます~~.',
        '**{日本|にほん}へ{来|き}ます** — cô Yamada ở Nhật nên Lan "**đến**" Nhật là {来|き}ます (hướng về phía người nói).',
        '**{一人|ひとり}で** = một mình. **Không** nói ~~{一人|ひとり}と~~ — một mình thì không có "với ai".',
        '**{母|はは}** = mẹ (tôi). **{来年|らいねん}** = năm sau. **いいですね** = hay quá / tốt quá nhỉ.',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'いつ{国|くに}へかえりますか。', ro: 'Itsu kuni e kaerimasu ka.', vi: 'Khi nào bạn về nước?' },
        { en: '{7月|しちがつ}{25日|にじゅうごにち}にかえります。', ro: 'Shichigatsu nijūgonichi ni kaerimasu.', vi: 'Tôi về vào ngày 25 tháng 7.' },
        { en: '{一人|ひとり}でかえりますか。', ro: 'Hitori de kaerimasu ka.', vi: 'Bạn về một mình à?' },
        { en: '{友|とも}だちとかえります。', ro: 'Tomodachi to kaerimasu.', vi: 'Tôi về cùng bạn.' },
        { en: 'いつ{日本|にほん}へ{来|き}ますか。', ro: 'Itsu Nihon e kimasu ka.', vi: 'Khi nào bạn (sang lại) Nhật?' },
        { en: '{来年|らいねん}、{母|はは}も{日本|にほん}へ{来|き}ます。', ro: 'Rainen, haha mo Nihon e kimasu.', vi: 'Năm sau mẹ tôi cũng sang Nhật.' },
      ],
    },
    {
      t: 'note',
      title: 'Nhầm hay gặp khi nói theo hội thoại',
      items: [
        'Về nước mình mà nói ~~ベトナムへ{行|い}きます~~ → **ベトナムへかえります**. {行|い}きます chỉ dùng khi đi tới nơi **không phải nhà mình**.',
        'Đang ở Nhật mà mời bạn: ~~{日本|にほん}へ{行|い}きますか~~ → **{日本|にほん}へ{来|き}ますか**. Nơi người nói đang ở → {来|き}ます.',
        'Đọc trợ từ **へ** là ~~"he"~~ → **"e"**: がっこう**え**いきます.',
        'Thêm で sau あるいて: ~~あるいてで~~ → **あるいて**.',
        'Thêm に cho từ tương đối: ~~あしたにいきます~~ → **あした{行|い}きます** (あした, {来年|らいねん}, {毎日|まいにち}… không có に).',
      ],
    },
  ],
};

/* ══════════════════════════ 2. TỪ VỰNG ══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b5-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng: động từ di chuyển, phương tiện, nơi đến, tuần–tháng–năm',
  goal: 'Nhớ 45 từ: 3 động từ đi–đến–về, 8 phương tiện, nơi đến, người đi cùng, các mốc tuần/tháng/năm và câu chào khi ra khỏi nhà – về nhà.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      items: [
        '7 nhóm: **động từ**, **phương tiện**, **nơi đến**, **đi với ai**, **tuần – tháng – năm**, **ở nhà ga**, **chào khi đi – về**.',
        'Động từ trong từ điển của khoá ghi ở **thể ます** ({行|い}きます) — dạng lịch sự dùng hằng ngày. Thể từ điển ({行|い}く) học ở Bài 18.',
        'Bộ **trước – này – sau**: **{先|せん}**～ (trước) · **{今|こん}**～ (này) · **{来|らい}**～ (sau) — áp cho tuần ({週|しゅう}) và tháng ({月|げつ}); riêng **năm** có cách đọc riêng: きょねん · ことし · らいねん.',
        'Đã học ở Bài 2: **じてんしゃ** (xe đạp), **{車|くるま}** (ô tô) — dùng lại ngay với で.',
      ],
    },

    { t: 'h', text: '1. Ba động từ di chuyển' },
    {
      t: 'vocab',
      items: [
        { w: '{行|い}きます', pos: 'động từ nhóm I', ipa: 'ikimasu', vi: 'đi (tới nơi khác)', ex: 'あした{学校|がっこう}へ{行|い}きます。', exRo: 'Ashita gakkō e ikimasu.', exVi: 'Ngày mai tôi đi học (tới trường).', more: '行 Hán Việt **HÀNH** (như "hành trình", "đi hành quân"). Thể từ điển: {行|い}く. Phủ định: {行|い}きません · quá khứ: {行|い}きました.' },
        { w: '{来|き}ます', pos: 'động từ nhóm III (bất quy tắc)', ipa: 'kimasu', vi: 'đến (tới chỗ người nói đang ở)', ex: 'マイクさんはあした{来|き}ます。', exRo: 'Maiku-san wa ashita kimasu.', exVi: 'Ngày mai Mike sẽ đến.', more: '来 Hán Việt **LAI** (như "tương lai", "vãng lai"). ⚠️ Chữ 来 đọc **き** trong {来|き}ます nhưng **らい** trong {来週|らいしゅう}, {来年|らいねん}.' },
        { w: 'かえります', pos: 'động từ nhóm I', ipa: 'kaerimasu', vi: 'về (nhà, về nước mình)', ex: '{毎日|まいにち}{6時|ろくじ}にうちへかえります。', exRo: 'Mainichi rokuji ni uchi e kaerimasu.', exVi: 'Hằng ngày tôi về nhà lúc 6 giờ.', more: 'Chữ Hán 帰ります (QUY — như "quy hương") — 帰 ngoài N5 nên khoá viết kana. Thể từ điển: かえる.' },
      ],
    },

    { t: 'h', text: '2. Phương tiện' },
    {
      t: 'vocab',
      items: [
        { w: '{電車|でんしゃ}', pos: 'danh từ', ipa: 'densha', vi: 'tàu điện', ex: '{電車|でんしゃ}で{会社|かいしゃ}へ{行|い}きます。', exRo: 'Densha de kaisha e ikimasu.', exVi: 'Tôi đi làm bằng tàu điện.', more: '電 (ĐIỆN) + 車 (XA) — hai chữ đã học ở Bài 2. Phương tiện chính của người Tokyo.' },
        { w: 'ちかてつ', pos: 'danh từ', ipa: 'chikatetsu', vi: 'tàu điện ngầm', ex: 'ちかてつでしんじゅくへ{行|い}きました。', exRo: 'Chikatetsu de Shinjuku e ikimashita.', exVi: 'Tôi đã đi Shinjuku bằng tàu điện ngầm.', more: 'Chữ Hán 地下鉄 (ĐỊA HẠ THIẾT = sắt dưới đất). ちか = tầng hầm (Bài 3).' },
        { w: 'しんかんせん', pos: 'danh từ', ipa: 'shinkansen', vi: 'tàu cao tốc Shinkansen', ex: 'しんかんせんできょうとへ{行|い}きます。', exRo: 'Shinkansen de Kyōto e ikimasu.', exVi: 'Tôi đi Kyoto bằng Shinkansen.', more: 'Chữ Hán 新幹線 (TÂN CÁN TUYẾN). Tokyo → Kyoto khoảng 2 tiếng 15 phút.' },
        { w: 'バス', pos: 'danh từ', ipa: 'basu', vi: 'xe buýt', ex: 'バスでびょういんへ{行|い}きます。', exRo: 'Basu de byōin e ikimasu.', exVi: 'Tôi đi bệnh viện bằng xe buýt.', more: 'Từ tiếng Anh *bus*. Đọc **ba-su**, âm su rất nhẹ.' },
        { w: 'タクシー', pos: 'danh từ', ipa: 'takushī', vi: 'taxi', ex: 'タクシーでかえりました。', exRo: 'Takushī de kaerimashita.', exVi: 'Tôi đã về bằng taxi.', more: 'Taxi Nhật **tự mở cửa sau** — đừng kéo cửa.' },
        { w: 'ひこうき', pos: 'danh từ', ipa: 'hikōki', vi: 'máy bay', ex: 'ひこうきでベトナムへかえります。', exRo: 'Hikōki de Betonamu e kaerimasu.', exVi: 'Tôi về Việt Nam bằng máy bay.', more: 'Chữ Hán 飛行機 (PHI HÀNH CƠ = máy bay). Trường âm: hi-**kō**-ki.' },
        { w: 'ふね', pos: 'danh từ', ipa: 'fune', vi: 'tàu thuỷ, thuyền', ex: 'ふねでおきなわへ{行|い}きました。', exRo: 'Fune de Okinawa e ikimashita.', exVi: 'Tôi đã đi Okinawa bằng tàu thuỷ.', more: 'Chữ Hán 船 (THUYỀN).' },
        { w: 'あるいて', pos: 'cụm (động từ thể て)', ipa: 'aruite', vi: 'đi bộ (bằng cách đi bộ)', ex: 'あるいて{学校|がっこう}へ{行|い}きます。', exRo: 'Aruite gakkō e ikimasu.', exVi: 'Tôi đi bộ đến trường.', more: '⚠️ **Không thêm で**: ~~あるいてで~~. Đây là thể て của あるきます (đi bộ) — Bài 14 học thể て.' },
      ],
    },

    { t: 'h', text: '3. Nơi đến' },
    {
      t: 'vocab',
      items: [
        { w: 'スーパー', pos: 'danh từ', ipa: 'sūpā', vi: 'siêu thị', ex: 'きのうスーパーへ{行|い}きました。', exRo: 'Kinō sūpā e ikimashita.', exVi: 'Hôm qua tôi đã đi siêu thị.', more: 'Rút gọn của スーパーマーケット. Hai trường âm: **sū-pā**.' },
        { w: 'こうえん', pos: 'danh từ', ipa: 'kōen', vi: 'công viên', ex: 'にちようびに{友|とも}だちとこうえんへ{行|い}きます。', exRo: 'Nichiyōbi ni tomodachi to kōen e ikimasu.', exVi: 'Chủ nhật tôi đi công viên với bạn.', more: 'Chữ Hán 公園 (CÔNG VIÊN) — y hệt tiếng Việt.' },
        { w: 'くうこう', pos: 'danh từ', ipa: 'kūkō', vi: 'sân bay', ex: 'バスでくうこうへ{行|い}きます。', exRo: 'Basu de kūkō e ikimasu.', exVi: 'Tôi đi sân bay bằng xe buýt.', more: 'Chữ Hán 空港 (KHÔNG CẢNG). Hai trường âm: **kū-kō** — đọc ngắn ~~kuko~~ người Nhật không hiểu.' },
        { w: 'えいがかん', pos: 'danh từ', ipa: 'eigakan', vi: 'rạp chiếu phim', ex: 'どようびにえいがかんへ{行|い}きました。', exRo: 'Doyōbi ni eigakan e ikimashita.', exVi: 'Thứ Bảy tôi đã đi rạp chiếu phim.', more: 'Chữ Hán 映画館 (ẢNH HOẠ QUÁN). えいが = phim.' },
        { w: 'うち', pos: 'danh từ', ipa: 'uchi', vi: 'nhà (nhà mình)', ex: '{何時|なんじ}にうちへかえりますか。', exRo: 'Nanji ni uchi e kaerimasu ka.', exVi: 'Mấy giờ bạn về nhà?', more: 'Đã gặp ở Bài 3. **うちへかえります** = về nhà — cụm hay dùng nhất của bài.' },
        { w: '{国|くに}', pos: 'danh từ', ipa: 'kuni', vi: 'đất nước; quê nhà', ex: 'なつ{休|やす}みに{国|くに}へかえります。', exRo: 'Natsuyasumi ni kuni e kaerimasu.', exVi: 'Nghỉ hè tôi về nước.', more: 'Đã học ở Bài 3. Du học sinh nói **{国|くに}へかえります** = về nước (mình).' },
      ],
    },

    { t: 'h', text: '4. Đi với ai' },
    {
      t: 'vocab',
      items: [
        { w: 'かぞく', pos: 'danh từ', ipa: 'kazoku', vi: 'gia đình', ex: 'しょうがつにかぞくとかえります。', exRo: 'Shōgatsu ni kazoku to kaerimasu.', exVi: 'Tết tôi về cùng gia đình.', more: 'Chữ Hán 家族 (GIA TỘC). しょうがつ = Tết (năm mới).' },
        { w: '{一人|ひとり}で', pos: 'cụm', ipa: 'hitori de', vi: 'một mình', ex: '{一人|ひとり}でとうきょうへ{来|き}ました。', exRo: 'Hitori de Tōkyō e kimashita.', exVi: 'Tôi đã đến Tokyo một mình.', more: '{一人|ひとり} đọc đặc biệt **ひとり** (không phải ~~いちにん~~). Đi kèm **で**, không phải と.' },
        { w: 'みんなで', pos: 'cụm', ipa: 'minna de', vi: 'cùng mọi người, cả nhóm', ex: 'みんなでこうえんへ{行|い}きました。', exRo: 'Minna de kōen e ikimashita.', exVi: 'Cả nhóm đã cùng đi công viên.', more: 'みんな = mọi người. Giống {一人|ひとり}で: chỉ số người cùng làm → dùng **で**.' },
        { w: '{母|はは}', pos: 'danh từ', ipa: 'haha', vi: 'mẹ (của tôi)', ex: '{来月|らいげつ}、{母|はは}は{日本|にほん}へ{来|き}ます。', exRo: 'Raigetsu, haha wa Nihon e kimasu.', exVi: 'Tháng sau mẹ tôi sang Nhật.', more: '母 Hán Việt **MẪU**. Nói về mẹ **người khác**: おかあさん. Bố mình: ちち (父), bố người khác: おとうさん.' },
      ],
    },

    { t: 'h', text: '5. Tuần – tháng – năm & tần suất' },
    {
      t: 'vocab',
      items: [
        { w: 'いつ', pos: 'từ để hỏi', ipa: 'itsu', vi: 'khi nào', ex: 'いつ{日本|にほん}へ{来|き}ましたか。', exRo: 'Itsu Nihon e kimashita ka.', exVi: 'Bạn đến Nhật khi nào?', more: '⚠️ いつ **không bao giờ đi với に**: ~~いつにいきますか~~.' },
        { w: '{先週|せんしゅう}', pos: 'danh từ (thời gian)', ipa: 'senshū', vi: 'tuần trước', ex: '{先週|せんしゅう}きょうとへ{行|い}きました。', exRo: 'Senshū Kyōto e ikimashita.', exVi: 'Tuần trước tôi đã đi Kyoto.', more: '先 (TIÊN = trước) + 週 (CHU = tuần).' },
        { w: '{今週|こんしゅう}', pos: 'danh từ (thời gian)', ipa: 'konshū', vi: 'tuần này', ex: '{今週|こんしゅう}はアルバイトへ{行|い}きません。', exRo: 'Konshū wa arubaito e ikimasen.', exVi: 'Tuần này tôi không đi làm thêm.', more: '今 đọc **こん** ở đây (KIM).' },
        { w: '{来週|らいしゅう}', pos: 'danh từ (thời gian)', ipa: 'raishū', vi: 'tuần sau', ex: '{来週|らいしゅう}マイクさんはアメリカへかえります。', exRo: 'Raishū Maiku-san wa Amerika e kaerimasu.', exVi: 'Tuần sau Mike về Mỹ.', more: '来 đọc **らい** ở đây (LAI).' },
        { w: '{先月|せんげつ}', pos: 'danh từ (thời gian)', ipa: 'sengetsu', vi: 'tháng trước', ex: '{先月|せんげつ}{日本|にほん}へ{来|き}ました。', exRo: 'Sengetsu Nihon e kimashita.', exVi: 'Tháng trước tôi đã đến Nhật.', more: '月 đọc **げつ** (như げつようび).' },
        { w: '{今月|こんげつ}', pos: 'danh từ (thời gian)', ipa: 'kongetsu', vi: 'tháng này', ex: '{今月|こんげつ}の{20日|はつか}にかえります。', exRo: 'Kongetsu no hatsuka ni kaerimasu.', exVi: 'Tôi về vào ngày 20 tháng này.' },
        { w: '{来月|らいげつ}', pos: 'danh từ (thời gian)', ipa: 'raigetsu', vi: 'tháng sau', ex: '{来月|らいげつ}おおさかへ{行|い}きます。', exRo: 'Raigetsu Ōsaka e ikimasu.', exVi: 'Tháng sau tôi đi Osaka.' },
        { w: 'きょねん', pos: 'danh từ (thời gian)', ipa: 'kyonen', vi: 'năm ngoái', ex: 'きょねん{日本|にほん}へ{来|き}ました。', exRo: 'Kyonen Nihon e kimashita.', exVi: 'Năm ngoái tôi đã đến Nhật.', more: 'Chữ Hán 去年 (KHỨ NIÊN) — 去 ngoài N5. ⚠️ Không nói ~~せんねん~~ (せんねん = 1.000 năm!).' },
        { w: '{今年|ことし}', pos: 'danh từ (thời gian)', ipa: 'kotoshi', vi: 'năm nay', ex: '{今年|ことし}のなつ{休|やす}みは{国|くに}へかえりません。', exRo: 'Kotoshi no natsuyasumi wa kuni e kaerimasen.', exVi: 'Nghỉ hè năm nay tôi không về nước.', more: 'Đọc đặc biệt **ことし** (không phải ~~こんねん~~), giống {今日|きょう}.' },
        { w: '{来年|らいねん}', pos: 'danh từ (thời gian)', ipa: 'rainen', vi: 'năm sau', ex: '{来年|らいねん}{母|はは}も{日本|にほん}へ{来|き}ます。', exRo: 'Rainen haha mo Nihon e kimasu.', exVi: 'Năm sau mẹ tôi cũng sang Nhật.' },
        { w: '{毎週|まいしゅう}', pos: 'danh từ / phó từ', ipa: 'maishū', vi: 'hằng tuần', ex: '{毎週|まいしゅう}どようびにスーパーへ{行|い}きます。', exRo: 'Maishū doyōbi ni sūpā e ikimasu.', exVi: 'Thứ Bảy hằng tuần tôi đi siêu thị.', more: 'Bộ 毎 (MỖI): {毎日|まいにち} (mỗi ngày), {毎週|まいしゅう}, {毎月|まいつき}, {毎年|まいとし}.' },
        { w: '{毎月|まいつき}', pos: 'danh từ / phó từ', ipa: 'maitsuki', vi: 'hằng tháng', ex: '{毎月|まいつき}びょういんへ{行|い}きます。', exRo: 'Maitsuki byōin e ikimasu.', exVi: 'Hằng tháng tôi đi bệnh viện.', more: 'Ở đây 月 đọc **つき** (không phải ~~まいげつ~~).' },
        { w: 'けさ', pos: 'danh từ (thời gian)', ipa: 'kesa', vi: 'sáng nay', ex: 'けさ{7時|しちじ}に{学校|がっこう}へ{来|き}ました。', exRo: 'Kesa shichiji ni gakkō e kimashita.', exVi: 'Sáng nay tôi đến trường lúc 7 giờ.', more: 'Chữ Hán 今朝 — đọc đặc biệt けさ.' },
        { w: 'こんばん', pos: 'danh từ (thời gian)', ipa: 'konban', vi: 'tối nay', ex: 'こんばん{何時|なんじ}にかえりますか。', exRo: 'Konban nanji ni kaerimasu ka.', exVi: 'Tối nay mấy giờ bạn về?', more: 'Chữ Hán 今晩. Cùng gốc với **こんばんは** (chào buổi tối).' },
      ],
    },

    { t: 'h', text: '6. Ở nhà ga' },
    {
      t: 'vocab',
      items: [
        { w: '～ばんせん', pos: 'hậu tố', ipa: '-bansen', vi: 'sân ga số …, đường ray số …', ex: 'よこはまは{3|さん}ばんせんです。', exRo: 'Yokohama wa sanbansen desu.', exVi: 'Tàu đi Yokohama ở sân ga số 3.', more: 'Chữ Hán 番線. Hỏi: **{何|なん}ばんせん**ですか.' },
        { w: 'つぎ', pos: 'danh từ', ipa: 'tsugi', vi: 'tiếp theo, kế tiếp', ex: 'つぎの{電車|でんしゃ}は{何時|なんじ}ですか。', exRo: 'Tsugi no densha wa nanji desu ka.', exVi: 'Chuyến tàu tiếp theo là mấy giờ?', more: 'Chữ Hán 次 (THỨ). Trên tàu: **つぎは しんじゅく** = ga tiếp theo là Shinjuku.' },
        { w: 'ふつう', pos: 'danh từ', ipa: 'futsū', vi: 'tàu thường (dừng mọi ga)', ex: 'この{電車|でんしゃ}はふつうです。', exRo: 'Kono densha wa futsū desu.', exVi: 'Tàu này là tàu thường.', more: 'Chữ Hán 普通 (PHỔ THÔNG) — còn nghĩa "bình thường". Có nơi gọi **かくえきていしゃ** (各駅停車).' },
        { w: 'きゅうこう', pos: 'danh từ', ipa: 'kyūkō', vi: 'tàu nhanh (chỉ dừng ga lớn)', ex: 'きゅうこうはこのえきへ{来|き}ません。', exRo: 'Kyūkō wa kono eki e kimasen.', exVi: 'Tàu nhanh không đến (không dừng ở) ga này.', more: 'Chữ Hán 急行 (CẤP HÀNH). Nhanh hơn nữa: **とっきゅう** (特急, tàu tốc hành — thường mất thêm tiền vé).' },
        { w: 'えきいん', pos: 'danh từ', ipa: 'ekiin', vi: 'nhân viên nhà ga', ex: 'あの{人|ひと}はえきいんです。', exRo: 'Ano hito wa ekiin desu.', exVi: 'Người kia là nhân viên nhà ga.', more: 'Chữ Hán 駅員 (DỊCH VIÊN): えき (ga) + いん (nhân viên), giống かいしゃいん.' },
        { w: 'どういたしまして', pos: 'cụm từ', ipa: 'dō itashimashite', vi: 'không có gì (đáp lời cảm ơn)', ex: 'ありがとうございます。——どういたしまして。', exRo: 'Arigatō gozaimasu. — Dō itashimashite.', exVi: 'Cảm ơn. — Không có gì.', more: 'Trong đời thường người Nhật hay đáp nhẹ hơn: いいえ (không có gì đâu).' },
      ],
    },

    { t: 'h', text: '7. Chào khi đi – khi về (dùng mỗi ngày)' },
    {
      t: 'vocab',
      items: [
        { w: 'いってきます', pos: 'câu chào', ipa: 'itte kimasu', vi: 'con/tôi đi đây (người đi nói)', ex: 'いってきます！——いってらっしゃい。', exRo: 'Itte kimasu! — Itte rasshai.', exVi: 'Con đi đây! — Đi nhé.', more: 'Nghĩa đen: "đi rồi sẽ về" = {行|い}って + {来|き}ます. Nói khi ra khỏi nhà, rời ký túc xá, rời văn phòng.' },
        { w: 'いってらっしゃい', pos: 'câu chào', ipa: 'itte rasshai', vi: 'đi nhé, đi cẩn thận (người ở nhà nói)', ex: 'ランさん、いってらっしゃい。', exRo: 'Ran-san, itte rasshai.', exVi: 'Lan, đi nhé.', more: 'Đáp lại いってきます.' },
        { w: 'ただいま', pos: 'câu chào', ipa: 'tadaima', vi: 'con/tôi về rồi đây (người về nói)', ex: 'ただいま。——おかえりなさい。', exRo: 'Tadaima. — Okaerinasai.', exVi: 'Con về rồi. — Về rồi đấy à.', more: 'Bước vào nhà là nói ngay. Lan về ký túc xá cũng nói ただいま.' },
        { w: 'おかえりなさい', pos: 'câu chào', ipa: 'okaerinasai', vi: 'về rồi đấy à (người ở nhà nói)', ex: 'たなかさん、おかえりなさい。', exRo: 'Tanaka-san, okaerinasai.', exVi: 'Tanaka, về rồi đấy à.', more: 'Cùng gốc với かえります (về). Nói thân mật: おかえり.' },
      ],
    },

    {
      t: 'note',
      title: 'Người Việt hay nhầm khi học từ Bài 5',
      items: [
        'Chữ **来** có hai cách đọc trong bài: **き** ({来|き}ます) và **らい** ({来週|らいしゅう}, {来月|らいげつ}, {来年|らいねん}).',
        '**{今年|ことし}** (năm nay), **{今日|きょう}** (hôm nay), **けさ** (sáng nay) — ba từ có 今 đều đọc **đặc biệt**. Còn {今週|こんしゅう}, {今月|こんげつ}, こんばん thì đọc こん.',
        '**きょねん** (năm ngoái) — không theo khuôn {先|せん}～: ~~せんねん~~ nghĩa là "một nghìn năm".',
        '**{毎月|まいつき}** — 月 đọc つき (không phải ~~まいげつ~~); **{毎年|まいとし}** (cũng nói まいねん).',
        '**くうこう** (sân bay, 2 trường âm) ≠ **こうこう** (trường cấp 3) ≠ **こうえん** (công viên).',
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thời gian "trước – này – sau" (thuộc theo hàng)',
      head: ['', 'Trước', 'Này', 'Sau', 'Mỗi'],
      rows: [
        ['Ngày', 'きのう', '{今日|きょう}', 'あした', '{毎日|まいにち}'],
        ['Sáng / tối', '(きのうのあさ)', 'けさ · こんばん', '(あしたのあさ)', 'まいあさ · まいばん'],
        ['Tuần', '{先週|せんしゅう}', '{今週|こんしゅう}', '{来週|らいしゅう}', '{毎週|まいしゅう}'],
        ['Tháng', '{先月|せんげつ}', '{今月|こんげつ}', '{来月|らいげつ}', '{毎月|まいつき}'],
        ['Năm', 'きょねん', '{今年|ことし}', '{来年|らいねん}', '{毎年|まいとし}'],
      ],
    },
    {
      t: 'mcq',
      id: 'b5-tv-nghia',
      title: 'Kiểm tra nghĩa từ — Bài 5',
      items: [
        { q: '**かえります** là gì?', options: ['đi', 'đến', 'về (nhà, nước mình)', 'đi bộ'], correct: 2, why: 'かえります = về. 行きます = đi, 来ます = đến.' },
        { q: '"Tàu điện ngầm" là:', options: ['でんしゃ', 'ちかてつ', 'しんかんせん', 'きゅうこう'], correct: 1, why: 'ちかてつ (地下鉄) = tàu điện ngầm.' },
        { q: '**{来月|らいげつ}** là:', options: ['tháng trước', 'tháng này', 'tháng sau', 'hằng tháng'], correct: 2, why: '来 = sau → 来月 = tháng sau.' },
        { q: '"Năm ngoái" là:', options: ['せんねん', 'きょねん', 'ことし', 'らいねん'], correct: 1, why: 'Năm ngoái = きょねん. せんねん = 1.000 năm.' },
        { q: '**ひこうき** là:', options: ['tàu thuỷ', 'máy bay', 'sân bay', 'xe buýt'], correct: 1, why: 'ひこうき = máy bay. Sân bay = くうこう, tàu thuỷ = ふね.' },
        { q: '**{一人|ひとり}で** nghĩa là:', options: ['với một người bạn', 'một mình', 'người thứ nhất', 'cả nhóm'], correct: 1, why: '一人で = một mình.' },
        { q: 'Ra khỏi nhà, bạn nói:', options: ['ただいま', 'いってきます', 'おかえりなさい', 'いらっしゃいませ'], correct: 1, why: 'Người đi nói いってきます; người ở nhà đáp いってらっしゃい.' },
        { q: '**いつ** hỏi gì?', options: ['ở đâu', 'với ai', 'bằng gì', 'khi nào'], correct: 3, why: 'いつ = khi nào.' },
        { q: '"Tuần trước" là:', options: ['せんしゅう', 'こんしゅう', 'らいしゅう', 'まいしゅう'], correct: 0, why: '先週 (せんしゅう) = tuần trước.' },
        { q: '**つぎの{電車|でんしゃ}** là:', options: ['chuyến tàu trước', 'chuyến tàu sau (tiếp theo)', 'tàu nhanh', 'tàu cuối'], correct: 1, why: 'つぎ = tiếp theo.' },
      ],
    },
  ],
};

/* ══════════════════════════ 3. NGỮ PHÁP ══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b5-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp: thể ます (4 dạng), N へ 行きます・来ます・かえります, で, と, いつ',
  goal: 'Chia ba động từ di chuyển ở 4 dạng, nói đi/đến/về đâu, bằng gì, với ai, khi nào — và ghép tất cả vào một câu đúng trật tự.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      items: [
        '**7 điểm**: ① thể ます — 4 dạng ② N へ {行|い}きます・{来|き}ます・かえります ③ どこへも ＋ phủ định ④ N で (phương tiện), あるいて ⑤ N と (cùng ai), {一人|ひとり}で ⑥ いつ, mốc + に ⑦ câu đầy đủ.',
        'Động từ tiếng Nhật đứng **CUỐI câu**. Mọi thứ khác (nơi, xe, người, giờ) đứng trước, mỗi thứ mang một **trợ từ** cho biết vai của nó.',
        'Động từ **không đổi theo người** (tôi / anh / họ đều là {行|い}きます) — chỉ đổi theo **thời** (hiện tại / quá khứ) và **khẳng định / phủ định**.',
        'Thể ます **không phân biệt hiện tại và tương lai**: {行|い}きます = (thường) đi / (sẽ) đi — từ chỉ thời gian quyết định nghĩa.',
      ],
    },

    /* ── Điểm 1 ── */
    { t: 'h', text: '① Động từ thể ます — ～ます・～ません・～ました・～ませんでした' },
    {
      t: 'p',
      text: 'Động từ trong bài học được dạy ở **thể ます** — dạng **lịch sự**, nói với thầy cô, người lạ, đồng nghiệp. Gốc động từ (phần trước ます: **{行|い}き**, **{来|き}**, **かえり**) giữ nguyên, chỉ **thay đuôi** để đổi nghĩa. Đây là cái lợi lớn của tiếng Nhật: học **4 đuôi** là chia được **mọi** động từ ở thể lịch sự.',
    },
    {
      t: 'table',
      caption: 'Bốn đuôi của thể ます — học thuộc theo hàng',
      head: ['', 'Hiện tại / tương lai', 'Quá khứ'],
      rows: [
        ['Khẳng định', '～**ます** (đi / sẽ đi)', '～**ました** (đã đi)'],
        ['Phủ định', '～**ません** (không đi / sẽ không đi)', '～**ませんでした** (đã không đi)'],
      ],
    },
    {
      t: 'table',
      caption: 'Ba động từ của bài ở 4 dạng',
      head: ['Nghĩa', '～ます', '～ません', '～ました', '～ませんでした'],
      rows: [
        ['đi', '{行|い}きます ikimasu', '{行|い}きません ikimasen', '{行|い}きました ikimashita', '{行|い}きませんでした ikimasen deshita'],
        ['đến', '{来|き}ます kimasu', '{来|き}ません kimasen', '{来|き}ました kimashita', '{来|き}ませんでした kimasen deshita'],
        ['về', 'かえります kaerimasu', 'かえりません kaerimasen', 'かえりました kaerimashita', 'かえりませんでした kaerimasen deshita'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '[thời gian] ＋ V ます／ません',
          vi: '(Thường / sẽ) làm — (thường / sẽ) không làm',
          examples: [
            { en: 'あした{学校|がっこう}へ{行|い}きます。', ro: 'Ashita gakkō e ikimasu.', vi: 'Ngày mai tôi (sẽ) đi học.' },
            { en: '{毎日|まいにち}{学校|がっこう}へ{行|い}きます。', ro: 'Mainichi gakkō e ikimasu.', vi: 'Hằng ngày tôi đi học.' },
            { en: 'にちようびは{学校|がっこう}へ{行|い}きません。', ro: 'Nichiyōbi wa gakkō e ikimasen.', vi: 'Chủ nhật tôi không đi học.' },
            { en: '{来週|らいしゅう}マイクさんは{来|き}ません。', ro: 'Raishū Maiku-san wa kimasen.', vi: 'Tuần sau Mike sẽ không đến.' },
          ],
        },
        {
          formula: '[thời gian quá khứ] ＋ V ました／ませんでした',
          vi: 'Đã làm — đã không làm',
          examples: [
            { en: 'きのうスーパーへ{行|い}きました。', ro: 'Kinō sūpā e ikimashita.', vi: 'Hôm qua tôi đã đi siêu thị.' },
            { en: '{先月|せんげつ}{日本|にほん}へ{来|き}ました。', ro: 'Sengetsu Nihon e kimashita.', vi: 'Tháng trước tôi đã đến Nhật.' },
            { en: 'きのうはアルバイトへ{行|い}きませんでした。', ro: 'Kinō wa arubaito e ikimasen deshita.', vi: 'Hôm qua tôi đã không đi làm thêm.' },
            { en: 'きょねんは{国|くに}へかえりませんでした。', ro: 'Kyonen wa kuni e kaerimasen deshita.', vi: 'Năm ngoái tôi đã không về nước.' },
          ],
        },
        {
          formula: 'V ますか → はい、V ます ／ いいえ、V ません',
          vi: 'Hỏi có/không — trả lời lặp lại động từ',
          examples: [
            { en: 'あした{学校|がっこう}へ{行|い}きますか。——はい、{行|い}きます。', ro: 'Ashita gakkō e ikimasu ka. — Hai, ikimasu.', vi: 'Mai bạn có đi học không? — Có, tôi đi.' },
            { en: 'きのうアルバイトへ{行|い}きましたか。——いいえ、{行|い}きませんでした。', ro: 'Kinō arubaito e ikimashita ka. — Iie, ikimasen deshita.', vi: 'Hôm qua bạn có đi làm thêm không? — Không, tôi đã không đi.' },
            { en: 'キムさんは{来|き}ますか。——いいえ、{来|き}ません。', ro: 'Kimu-san wa kimasu ka. — Iie, kimasen.', vi: 'Kim có đến không? — Không, cậu ấy không đến.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — mẫu: きのう ～へ ＿＿。 (đổi đuôi theo cột)',
      head: ['Ý muốn nói', 'Câu', 'Romaji'],
      rows: [
        ['Mai tôi đi siêu thị.', 'あしたスーパーへ{行|い}きます。', 'Ashita sūpā e ikimasu.'],
        ['Mai tôi không đi siêu thị.', 'あしたスーパーへ{行|い}きません。', 'Ashita sūpā e ikimasen.'],
        ['Hôm qua tôi đã đi siêu thị.', 'きのうスーパーへ{行|い}きました。', 'Kinō sūpā e ikimashita.'],
        ['Hôm qua tôi đã không đi siêu thị.', 'きのうスーパーへ{行|い}きませんでした。', 'Kinō sūpā e ikimasen deshita.'],
      ],
    },
    { t: 'rule', formula: 'V ます → ません → ました → ませんでした', vi: 'Giữ gốc động từ, đổi đuôi: hiện tại/tương lai – phủ định – quá khứ – quá khứ phủ định.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        'Nói quá khứ mà quên đổi đuôi: ~~きのうスーパーへ{行|い}きます~~ → **{行|い}きました**. Có きのう / {先週|せんしゅう} / きょねん… là phải dùng ～ました.',
        'Quá khứ phủ định: ~~{行|い}きませんました~~, ~~{行|い}きましたじゃありません~~ → **{行|い}きませんでした**.',
        'Trả lời ~~はい、そうです~~ cho câu hỏi động từ → **はい、{行|い}きます**. (そうです chỉ dùng cho câu N です, Bài 1.)',
        '{来|き}ます đọc **き**, không phải ~~くます~~, ~~らいます~~.',
      ],
    },

    /* ── Điểm 2 ── */
    { t: 'h', text: '② N（nơi chốn）へ {行|い}きます・{来|き}ます・かえります' },
    {
      t: 'p',
      text: '**へ** đánh dấu **hướng / nơi đến** của động từ di chuyển. Viết là chữ **へ** nhưng **đọc "e"**. Câu hỏi: **どこへ**{行|い}きますか (đi đâu?). Ba động từ khác nhau ở **góc nhìn**: **{行|い}きます** = đi **ra xa** chỗ người nói; **{来|き}ます** = đến **chỗ người nói đang ở**; **かえります** = về **nơi mình thuộc về** (nhà, nước mình, ký túc xá).',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N（nơi）へ {行|い}きます',
          vi: 'Đi tới N',
          examples: [
            { en: 'きょうとへ{行|い}きます。', ro: 'Kyōto e ikimasu.', vi: 'Tôi đi Kyoto.' },
            { en: 'あしたびょういんへ{行|い}きます。', ro: 'Ashita byōin e ikimasu.', vi: 'Mai tôi đi bệnh viện.' },
            { en: 'どこへ{行|い}きますか。——ぎんこうへ{行|い}きます。', ro: 'Doko e ikimasu ka. — Ginkō e ikimasu.', vi: 'Bạn đi đâu đấy? — Tôi đi ngân hàng.' },
          ],
        },
        {
          formula: 'N（nơi người nói đang ở）へ {来|き}ます',
          vi: 'Đến N (đến chỗ này)',
          examples: [
            { en: '{先月|せんげつ}{日本|にほん}へ{来|き}ました。', ro: 'Sengetsu Nihon e kimashita.', vi: 'Tháng trước tôi đã đến Nhật.' },
            { en: 'マイクさんは{何時|なんじ}に{来|き}ますか。', ro: 'Maiku-san wa nanji ni kimasu ka.', vi: 'Mấy giờ Mike đến?' },
            { en: 'あした{母|はは}はうちへ{来|き}ます。', ro: 'Ashita haha wa uchi e kimasu.', vi: 'Mai mẹ tôi đến nhà (chỗ tôi).' },
          ],
        },
        {
          formula: 'N（nhà, nước mình）へ かえります',
          vi: 'Về N',
          examples: [
            { en: '{何時|なんじ}にうちへかえりますか。——{6時|ろくじ}にかえります。', ro: 'Nanji ni uchi e kaerimasu ka. — Rokuji ni kaerimasu.', vi: 'Mấy giờ bạn về nhà? — 6 giờ.' },
            { en: 'しょうがつに{国|くに}へかえります。', ro: 'Shōgatsu ni kuni e kaerimasu.', vi: 'Tết tôi về nước.' },
            { en: 'マイクさんはアメリカへかえりました。', ro: 'Maiku-san wa Amerika e kaerimashita.', vi: 'Mike đã về Mỹ.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: '行きます・来ます・かえります — chọn theo chỗ người nói đang đứng',
      head: ['Lan đang ở…', 'Ý', 'Câu đúng', 'Romaji'],
      rows: [
        ['ký túc xá', 'mai đi trường', 'あした{学校|がっこう}へ{行|い}きます。', 'Ashita gakkō e ikimasu.'],
        ['trường', 'mai đến trường', 'あしたも{学校|がっこう}へ{来|き}ます。', 'Ashita mo gakkō e kimasu.'],
        ['trường', 'tối về ký túc xá', '{6時|ろくじ}にりょうへかえります。', 'Rokuji ni ryō e kaerimasu.'],
        ['Nhật (nói chuyện với cô)', 'tháng 8 về Việt Nam', '{8月|はちがつ}にベトナムへかえります。', 'Hachigatsu ni Betonamu e kaerimasu.'],
        ['Nhật', 'mẹ sang Nhật', '{母|はは}は{来年|らいねん}{日本|にほん}へ{来|き}ます。', 'Haha wa rainen Nihon e kimasu.'],
      ],
    },
    {
      t: 'note',
      title: 'へ hay に?',
      items: [
        'Với động từ di chuyển, **へ** và **に** đều đúng: {学校|がっこう}**へ**{行|い}きます = {学校|がっこう}**に**{行|い}きます. へ nhấn **hướng đi**, に nhấn **điểm đến**; người Nhật nói hằng ngày dùng cả hai.',
        'Khoá dùng **へ** ở Bài 5 cho rõ; **に** sẽ trở lại ở Bài 7, 10, 13 với nhiều nghĩa khác. Bài tập gõ tay của khoá chấp nhận cả hai.',
        '**りょう** = ký túc xá (寮 — ngoài N5).',
      ],
    },
    { t: 'rule', formula: 'N（nơi）へ {行|い}きます／{来|き}ます／かえります', vi: 'へ (đọc e) chỉ nơi đến; chọn động từ theo chỗ người nói đang ở.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        'Quên trợ từ: ~~{学校|がっこう}{行|い}きます~~ (nói nhanh ngoài đời có nghe thấy) → khi học viết đủ **{学校|がっこう}へ{行|い}きます**.',
        'Dùng を như tiếng Việt "đi **đến** trường": ~~{学校|がっこう}を{行|い}きます~~ → **へ**.',
        'Đọc へ là "he": ~~gakkō he~~ → **gakkō e**.',
        'Về nhà mình mà dùng {行|い}きます: ~~うちへ{行|い}きます~~ → **うちへかえります**.',
      ],
    },

    /* ── Điểm 3 ── */
    { t: 'h', text: '③ どこへも {行|い}きません — Không đi đâu cả' },
    {
      t: 'p',
      text: 'Từ để hỏi + **も** + **động từ phủ định** = "không … gì cả / không … đâu cả". Với nơi chốn: **どこ(へ)も** + {行|い}きません／{行|い}きませんでした. へ có thể bỏ: **どこも{行|い}きません** cũng đúng và tự nhiên. Khác với **も** "cũng" ở Bài 1 (わたしも学生です) — ở đây も đứng sau **từ để hỏi**.',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'どこ（へ）も V ません／ませんでした',
          vi: 'Không đi (đến) đâu cả',
          examples: [
            { en: 'にちようびにどこへ{行|い}きましたか。——どこへも{行|い}きませんでした。', ro: 'Nichiyōbi ni doko e ikimashita ka. — Doko e mo ikimasen deshita.', vi: 'Chủ nhật bạn đi đâu? — Mình chẳng đi đâu cả.' },
            { en: 'あしたはどこも{行|い}きません。', ro: 'Ashita wa doko mo ikimasen.', vi: 'Mai tôi không đi đâu cả.' },
            { en: 'なつ{休|やす}みはどこへも{行|い}きません。', ro: 'Natsuyasumi wa doko e mo ikimasen.', vi: 'Nghỉ hè tôi không đi đâu cả.' },
            { en: 'しゅうまつ、どこかへ{行|い}きますか。——いいえ、どこも{行|い}きません。', ro: 'Shūmatsu, dokoka e ikimasu ka. — Iie, doko mo ikimasen.', vi: 'Cuối tuần bạn có đi đâu không? — Không, tôi không đi đâu cả.' },
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Để ý',
      items: [
        '**どこかへ{行|い}きますか** (có đi **đâu đó** không?) — どこ**か** = một nơi nào đó. Trả lời **はい／いいえ**. Còn **どこへ{行|い}きますか** (đi **đâu**?) — trả lời tên nơi, không có はい／いいえ.',
        'Mẫu này luôn đi với **phủ định**: ~~どこへも{行|い}きます~~ là câu sai.',
      ],
    },
    { t: 'rule', formula: 'どこ（へ）も ＋ V ません／ませんでした', vi: '"Không đi đâu cả" — từ để hỏi + も + phủ định.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        '~~どこへも{行|い}きました~~ → **どこへも{行|い}きませんでした**.',
        'Đặt も sai chỗ: ~~どこもへ~~ → **どこへも** (へ trước, も sau).',
      ],
    },

    /* ── Điểm 4 ── */
    { t: 'h', text: '④ N（phương tiện）で {行|い}きます — Đi bằng N; あるいて' },
    {
      t: 'p',
      text: '**で** đứng sau phương tiện = "**bằng**". Câu hỏi: **なんで**{行|い}きますか (đi bằng gì?) — cũng nói **なにで** cho khỏi nhầm với なんで "tại sao" trong văn nói. **Đi bộ** là **あるいて** — đứng một mình, **không có で** (nó đã là động từ).',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N（phương tiện）で {行|い}きます／{来|き}ます／かえります',
          vi: 'Đi / đến / về bằng N',
          examples: [
            { en: 'バスで{学校|がっこう}へ{行|い}きます。', ro: 'Basu de gakkō e ikimasu.', vi: 'Tôi đi học bằng xe buýt.' },
            { en: 'しんかんせんでおおさかへ{行|い}きました。', ro: 'Shinkansen de Ōsaka e ikimashita.', vi: 'Tôi đã đi Osaka bằng Shinkansen.' },
            { en: 'ひこうきで{国|くに}へかえります。', ro: 'Hikōki de kuni e kaerimasu.', vi: 'Tôi về nước bằng máy bay.' },
            { en: 'たなかさんは{車|くるま}で{来|き}ました。', ro: 'Tanaka-san wa kuruma de kimashita.', vi: 'Tanaka đã đến bằng ô tô.' },
            { en: 'タクシーでかえりました。', ro: 'Takushī de kaerimashita.', vi: 'Tôi đã về bằng taxi.' },
          ],
        },
        {
          formula: 'なんで／なにで {行|い}きますか ・ あるいて {行|い}きます',
          vi: 'Đi bằng gì? · Đi bộ',
          examples: [
            { en: 'なんで{会社|かいしゃ}へ{行|い}きますか。——ちかてつで{行|い}きます。', ro: 'Nan de kaisha e ikimasu ka. — Chikatetsu de ikimasu.', vi: 'Bạn đi làm bằng gì? — Bằng tàu điện ngầm.' },
            { en: 'なにでくうこうへ{行|い}きますか。——バスで{行|い}きます。', ro: 'Nani de kūkō e ikimasu ka. — Basu de ikimasu.', vi: 'Bạn ra sân bay bằng gì? — Bằng xe buýt.' },
            { en: 'えきからあるいて{来|き}ました。', ro: 'Eki kara aruite kimashita.', vi: 'Tôi đã đi bộ từ ga đến.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — mẫu: ＿＿ で {学校|がっこう}へ {行|い}きます。',
      head: ['Phương tiện', 'Câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['{電車|でんしゃ}', '{電車|でんしゃ}で{学校|がっこう}へ{行|い}きます。', 'Densha de gakkō e ikimasu.', 'Đi học bằng tàu điện.'],
        ['じてんしゃ', 'じてんしゃで{学校|がっこう}へ{行|い}きます。', 'Jitensha de gakkō e ikimasu.', 'Đi học bằng xe đạp.'],
        ['バス', 'バスで{学校|がっこう}へ{行|い}きます。', 'Basu de gakkō e ikimasu.', 'Đi học bằng xe buýt.'],
        ['(đi bộ)', 'あるいて{学校|がっこう}へ{行|い}きます。', 'Aruite gakkō e ikimasu.', 'Đi bộ đến trường.'],
      ],
    },
    {
      t: 'p',
      text: '**Kết hợp với から／まで (Bài 4)**: **えきから{学校|がっこう}まであるいて{行|い}きます** = đi bộ từ ga đến trường. **うちからえきまでじてんしゃで{行|い}きます** = đi xe đạp từ nhà ra ga. から／まで cũng dùng được cho **nơi chốn**, không chỉ giờ.',
    },
    { t: 'rule', formula: 'N（xe, tàu…）で V ／ あるいて V', vi: 'で = bằng (phương tiện); đi bộ là あるいて, không có で.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        '~~あるいてで{行|い}きます~~ → **あるいて{行|い}きます**.',
        'Dùng と cho phương tiện kiểu "đi **với** xe buýt": ~~バスと{行|い}きます~~ → **バスで**. と chỉ dành cho **người**.',
        '~~じてんしゃに{行|い}きます~~ (nghĩa thành "đi tới chiếc xe đạp") → **じてんしゃで**.',
      ],
    },

    /* ── Điểm 5 ── */
    { t: 'h', text: '⑤ N（người）と {行|い}きます — Đi cùng với N; {一人|ひとり}で' },
    {
      t: 'p',
      text: '**と** đứng sau **người** = "**cùng với**". Câu hỏi: **だれと**{行|い}きますか (đi với ai?). Một mình thì **không có "với ai"** — dùng **{一人|ひとり}で** (một mình); cả nhóm cùng đi: **みんなで**. Bạn đã gặp と ở Bài 3–4 với nghĩa "và" nối danh từ (おにぎり**と**おちゃ) — cùng một chữ, ý "đi cùng".',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N（người）と V',
          vi: 'Làm V cùng với N',
          examples: [
            { en: '{友|とも}だちとえいがかんへ{行|い}きました。', ro: 'Tomodachi to eigakan e ikimashita.', vi: 'Tôi đã đi rạp phim với bạn.' },
            { en: 'かぞくと{日本|にほん}へ{来|き}ました。', ro: 'Kazoku to Nihon e kimashita.', vi: 'Tôi đã sang Nhật cùng gia đình.' },
            { en: 'やまだ{先生|せんせい}とこうえんへ{行|い}きます。', ro: 'Yamada-sensei to kōen e ikimasu.', vi: 'Tôi đi công viên với cô Yamada.' },
            { en: 'だれと{行|い}きますか。——マイクさんと{行|い}きます。', ro: 'Dare to ikimasu ka. — Maiku-san to ikimasu.', vi: 'Bạn đi với ai? — Đi với Mike.' },
          ],
        },
        {
          formula: '{一人|ひとり}で V ／ みんなで V',
          vi: 'Làm V một mình / cùng cả nhóm',
          examples: [
            { en: '{一人|ひとり}できょうとへ{行|い}きました。', ro: 'Hitori de Kyōto e ikimashita.', vi: 'Tôi đã đi Kyoto một mình.' },
            { en: 'みんなでこうえんへ{行|い}きます。', ro: 'Minna de kōen e ikimasu.', vi: 'Cả nhóm cùng đi công viên.' },
            { en: 'だれと{行|い}きましたか。——{一人|ひとり}で{行|い}きました。', ro: 'Dare to ikimashita ka. — Hitori de ikimashita.', vi: 'Bạn đã đi với ai? — Tôi đi một mình.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — mẫu: ＿＿ と こうえんへ {行|い}きます。',
      head: ['Người', 'Câu', 'Romaji'],
      rows: [
        ['キムさん', 'キムさんとこうえんへ{行|い}きます。', 'Kimu-san to kōen e ikimasu.'],
        ['{友|とも}だち', '{友|とも}だちとこうえんへ{行|い}きます。', 'Tomodachi to kōen e ikimasu.'],
        ['かぞく', 'かぞくとこうえんへ{行|い}きます。', 'Kazoku to kōen e ikimasu.'],
        ['(một mình)', '{一人|ひとり}でこうえんへ{行|い}きます。', 'Hitori de kōen e ikimasu.'],
      ],
    },
    { t: 'rule', formula: 'N（người）と V ／ {一人|ひとり}で V', vi: 'と = cùng với (người); một mình / cả nhóm dùng で.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        '~~{一人|ひとり}と{行|い}きます~~ → **{一人|ひとり}で{行|い}きます**.',
        'Dịch máy "cùng với" thành ~~といっしょ~~ rồi bỏ dở — người Nhật nói **{友|とも}だちと** là đủ (いっしょに = cùng nhau, học ở Bài 6).',
        'Đặt と trước người như tiếng Việt: ~~とキムさん~~ → **キムさんと**.',
      ],
    },

    /* ── Điểm 6 ── */
    { t: 'h', text: '⑥ いつ — Khi nào? · Mốc thời gian ＋ に' },
    {
      t: 'p',
      text: '**いつ** = khi nào. Đặt ở chỗ thời gian trong câu: **いつ**{国|くに}へかえりますか. Trả lời bằng mốc thời gian. Quy tắc **に**: mốc có **con số** (giờ, ngày, tháng, năm) hoặc **thứ, kỳ nghỉ** → thêm **に**; từ **tương đối** với hôm nay (きのう, {今日|きょう}, あした, {先週|せんしゅう}, {来月|らいげつ}, {毎日|まいにち}…) → **không** có に. Và **いつ** không bao giờ có に.',
    },
    {
      t: 'table',
      caption: 'Có に hay không?',
      head: ['Có に (mốc tuyệt đối)', 'Ví dụ', 'Không に (mốc tương đối)', 'Ví dụ'],
      rows: [
        ['giờ', '{7時|しちじ}に', 'hôm nay / mai / qua', '{今日|きょう}, あした, きのう'],
        ['ngày, tháng', '{5月|ごがつ}{3日|みっか}に', 'tuần/tháng/năm này–trước–sau', '{来週|らいしゅう}, {先月|せんげつ}, {来年|らいねん}'],
        ['thứ', 'にちようびに', 'mỗi …', '{毎日|まいにち}, {毎週|まいしゅう}'],
        ['kỳ nghỉ, dịp', 'なつ{休|やす}みに, しょうがつに', 'từ để hỏi', 'いつ'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'いつ V ますか → [mốc]（に） V ます',
          vi: 'Khi nào …? → Vào lúc …',
          examples: [
            { en: 'いつ{日本|にほん}へ{来|き}ましたか。——{4月|しがつ}{2日|ふつか}に{来|き}ました。', ro: 'Itsu Nihon e kimashita ka. — Shigatsu futsuka ni kimashita.', vi: 'Bạn sang Nhật khi nào? — Ngày 2 tháng 4.' },
            { en: 'いつきょうとへ{行|い}きますか。——{来週|らいしゅう}{行|い}きます。', ro: 'Itsu Kyōto e ikimasu ka. — Raishū ikimasu.', vi: 'Khi nào bạn đi Kyoto? — Tuần sau.' },
            { en: '{何時|なんじ}にうちへかえりますか。——{9時|くじ}ごろかえります。', ro: 'Nanji ni uchi e kaerimasu ka. — Kuji goro kaerimasu.', vi: 'Mấy giờ bạn về nhà? — Khoảng 9 giờ.' },
            { en: 'どようびにスーパーへ{行|い}きます。', ro: 'Doyōbi ni sūpā e ikimasu.', vi: 'Thứ Bảy tôi đi siêu thị.' },
            { en: '{先週|せんしゅう}のにちようびにおおさかへ{行|い}きました。', ro: 'Senshū no nichiyōbi ni Ōsaka e ikimashita.', vi: 'Chủ nhật tuần trước tôi đã đi Osaka.' },
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Để ý',
      items: [
        '**{9時|くじ}ごろ** (khoảng 9 giờ) — có ごろ thì **thường bỏ に** (cũng có người nói ごろに).',
        '**{何時|なんじ}に** (mấy giờ — mốc có số) có に; **いつ** (khi nào) thì không.',
        'Câu có cả mốc tương đối và tuyệt đối: **{先週|せんしゅう}のにちようびに** — に đi theo từ cuối (にちようび).',
      ],
    },
    { t: 'rule', formula: 'いつ V ますか ／ [giờ, ngày, thứ] に V ます ／ [あした, {来週|らいしゅう}…] V ます', vi: 'Mốc có số hoặc thứ → に; mốc tương đối và いつ → không に.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        '~~いつにかえりますか~~ → **いつかえりますか**.',
        '~~あしたに{行|い}きます~~, ~~{来週|らいしゅう}に{行|い}きます~~ → **あした{行|い}きます**, **{来週|らいしゅう}{行|い}きます**.',
        'Quên に với giờ: ~~{7時|しちじ}{行|い}きます~~ → **{7時|しちじ}に{行|い}きます**.',
      ],
    },

    /* ── Điểm 7 ── */
    { t: 'h', text: '⑦ Ghép tất cả — trật tự một câu đầy đủ' },
    {
      t: 'p',
      text: 'Mỗi thành phần mang **trợ từ** riêng nên trật tự khá tự do, nhưng trật tự **tự nhiên nhất** là: **Ai は → Khi nào (に) → Với ai と → Bằng gì で → Đi đâu へ → Động từ**. Động từ **luôn ở cuối**. Hỏi phần nào thì thay phần đó bằng từ để hỏi: **いつ, だれと, なんで, どこへ**.',
    },
    {
      t: 'table',
      caption: 'Câu đầy đủ, xếp theo cột',
      head: ['Ai は', 'Khi nào', 'Với ai と', 'Bằng gì で', 'Đi đâu へ', 'Động từ'],
      rows: [
        ['ランさんは', '{来週|らいしゅう}', 'キムさんと', 'しんかんせんで', 'きょうとへ', '{行|い}きます。'],
        ['わたしは', 'きのう', '{友|とも}だちと', '{電車|でんしゃ}で', 'しんじゅくへ', '{行|い}きました。'],
        ['マイクさんは', '{8月|はちがつ}{1日|ついたち}に', 'かぞくと', 'ひこうきで', 'アメリカへ', 'かえります。'],
        ['ランさんは', 'いつ', 'だれと', 'なんで', 'どこへ', '{行|い}きますか。'],
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'わたしは{来週|らいしゅう}キムさんとしんかんせんできょうとへ{行|い}きます。', ro: 'Watashi wa raishū Kimu-san to shinkansen de Kyōto e ikimasu.', vi: 'Tuần sau tôi đi Kyoto bằng Shinkansen cùng Kim.' },
        { en: 'たなかさんはきのう{一人|ひとり}で{電車|でんしゃ}でよこはまへ{行|い}きました。', ro: 'Tanaka-san wa kinō hitori de densha de Yokohama e ikimashita.', vi: 'Hôm qua Tanaka đã một mình đi Yokohama bằng tàu điện.' },
        { en: 'マイクさんは{8月|はちがつ}{1日|ついたち}にかぞくとアメリカへかえります。', ro: 'Maiku-san wa hachigatsu tsuitachi ni kazoku to Amerika e kaerimasu.', vi: 'Ngày 1 tháng 8 Mike về Mỹ cùng gia đình.' },
        { en: 'やまだ{先生|せんせい}は{毎日|まいにち}{車|くるま}で{学校|がっこう}へ{来|き}ます。', ro: 'Yamada-sensei wa mainichi kuruma de gakkō e kimasu.', vi: 'Hằng ngày cô Yamada đến trường bằng ô tô.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: hỏi từng phần của câu',
      lines: [
        { who: 'たなか', role: 'b', text: 'ランさん、{来週|らいしゅう}どこへ{行|い}きますか。', ro: 'Ran-san, raishū doko e ikimasu ka.', vi: 'Lan, tuần sau bạn đi đâu?' },
        { who: 'ラン', role: 'a', text: 'きょうとへ{行|い}きます。', ro: 'Kyōto e ikimasu.', vi: 'Mình đi Kyoto.' },
        { who: 'たなか', role: 'b', text: 'いつ{行|い}きますか。', ro: 'Itsu ikimasu ka.', vi: 'Khi nào bạn đi?' },
        { who: 'ラン', role: 'a', text: 'どようびに{行|い}きます。', ro: 'Doyōbi ni ikimasu.', vi: 'Thứ Bảy.' },
        { who: 'たなか', role: 'b', text: 'だれと{行|い}きますか。', ro: 'Dare to ikimasu ka.', vi: 'Đi với ai?' },
        { who: 'ラン', role: 'a', text: 'キムさんと{行|い}きます。', ro: 'Kimu-san to ikimasu.', vi: 'Đi với Kim.' },
        { who: 'たなか', role: 'b', text: 'なんで{行|い}きますか。', ro: 'Nan de ikimasu ka.', vi: 'Đi bằng gì?' },
        { who: 'ラン', role: 'a', text: 'しんかんせんで{行|い}きます。', ro: 'Shinkansen de ikimasu.', vi: 'Bằng Shinkansen.' },
      ],
    },
    { t: 'rule', formula: 'N は ［いつ］ ［N と］ ［N で］ ［N へ］ V', vi: 'Thời gian – người – phương tiện – nơi đến – động từ; động từ luôn đứng cuối.' },
    {
      t: 'note',
      title: 'Lỗi hay sai',
      items: [
        'Đặt động từ giữa câu như tiếng Việt: ~~わたしは{行|い}きますきょうとへ~~ → **わたしはきょうとへ{行|い}きます**.',
        'Lẫn ba trợ từ: **へ** (tới đâu) · **で** (bằng gì) · **と** (với ai). Mẹo: hỏi lại bằng tiếng Việt "tới đâu? bằng gì? với ai?" rồi gắn đúng trợ từ.',
      ],
    },

    /* ── Luyện tổng hợp ── */
    { t: 'h', text: 'Luyện tổng hợp' },
    {
      t: 'build',
      id: 'b5-np-ghep',
      title: 'Ghép câu — Bài 5',
      items: [
        { vi: 'Ngày mai tôi đi ngân hàng.', chips: ['あした', 'ぎんこう', 'へ', '{行|い}きます。', 'を'], answer: ['あした', 'ぎんこう', 'へ', '{行|い}きます。'], ro: 'Ashita ginkō e ikimasu.' },
        { vi: 'Hôm qua tôi đã không đi làm thêm.', chips: ['きのう', 'アルバイトへ', '{行|い}きませんでした。', '{行|い}きません。'], answer: ['きのう', 'アルバイトへ', '{行|い}きませんでした。'], ro: 'Kinō arubaito e ikimasen deshita.' },
        { vi: 'Tôi đi học bằng xe buýt.', chips: ['バス', 'で', '{学校|がっこう}へ', '{行|い}きます。', 'と'], answer: ['バス', 'で', '{学校|がっこう}へ', '{行|い}きます。'], ro: 'Basu de gakkō e ikimasu.' },
        { vi: 'Tôi đã đi công viên với bạn.', chips: ['{友|とも}だち', 'と', 'こうえんへ', '{行|い}きました。', 'で'], answer: ['{友|とも}だち', 'と', 'こうえんへ', '{行|い}きました。'], ro: 'Tomodachi to kōen e ikimashita.' },
        { vi: 'Tôi đi bộ về nhà.', chips: ['あるいて', 'うちへ', 'かえります。', 'で'], answer: ['あるいて', 'うちへ', 'かえります。'], ro: 'Aruite uchi e kaerimasu.' },
        { vi: 'Chủ nhật bạn đã đi đâu?', chips: ['にちようびに', 'どこへ', '{行|い}きましたか。', 'いつ'], answer: ['にちようびに', 'どこへ', '{行|い}きましたか。'], ro: 'Nichiyōbi ni doko e ikimashita ka.' },
        { vi: 'Tôi đã không đi đâu cả.', chips: ['どこへ', 'も', '{行|い}きませんでした。', '{行|い}きました。'], answer: ['どこへ', 'も', '{行|い}きませんでした。'], ro: 'Doko e mo ikimasen deshita.' },
        { vi: 'Khi nào bạn về nước?', chips: ['いつ', '{国|くに}へ', 'かえりますか。', 'に'], answer: ['いつ', '{国|くに}へ', 'かえりますか。'], ro: 'Itsu kuni e kaerimasu ka.' },
        { vi: 'Ngày 3 tháng 8 tôi sang Nhật (đến Nhật).', chips: ['{8月|はちがつ}', '{3日|みっか}', 'に', '{日本|にほん}へ', '{来|き}ます。', '{行|い}きます。'], answer: ['{8月|はちがつ}', '{3日|みっか}', 'に', '{日本|にほん}へ', '{来|き}ます。'], ro: 'Hachigatsu mikka ni Nihon e kimasu.' },
        { vi: 'Tuần sau tôi đi Kyoto một mình bằng Shinkansen.', chips: ['{来週|らいしゅう}', '{一人|ひとり}で', 'しんかんせんで', 'きょうとへ', '{行|い}きます。', '{一人|ひとり}と'], answer: ['{来週|らいしゅう}', '{一人|ひとり}で', 'しんかんせんで', 'きょうとへ', '{行|い}きます。'], ro: 'Raishū hitori de shinkansen de Kyōto e ikimasu.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b5-np-dien',
      title: 'Điền trợ từ / đuôi động từ (へ・で・と・に・も・ません…)',
      kind: 'fill',
      items: [
        { q: 'あした{学校|がっこう} ___ {行|い}きます。（nơi đến）', answers: ['へ', 'に'] },
        { q: '{電車|でんしゃ} ___ {行|い}きます。（bằng tàu điện）', answers: ['で'] },
        { q: '{友|とも}だち ___ {行|い}きます。（với bạn）', answers: ['と'] },
        { q: '{一人|ひとり} ___ {行|い}きます。（một mình）', answers: ['で'] },
        { q: '{7時|しちじ} ___ うちへかえります。', answers: ['に'] },
        { q: 'どこへ ___ {行|い}きませんでした。（không đi đâu cả）', answers: ['も'] },
        { q: 'きのうスーパーへ{行|い}き ___。（đã đi）', answers: ['ました'] },
        { q: 'あしたは{学校|がっこう}へ{行|い}き ___。（sẽ không đi）', answers: ['ません'] },
        { q: '{先週|せんしゅう}は{国|くに}へかえり ___。（đã không về）', answers: ['ませんでした'] },
        { q: '___ {国|くに}へかえりますか。——{来月|らいげつ}かえります。（khi nào）', answers: ['いつ'] },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-np-chon',
      title: 'Chọn câu đúng',
      items: [
        { q: '"Hôm qua tôi đã đi siêu thị":', options: ['きのうスーパーへ行きます。', 'きのうスーパーへ行きました。', 'きのうスーパーで行きました。', 'きのうにスーパーへ行きました。'], correct: 1, why: 'Quá khứ → 行きました; nơi đến → へ; きのう không có に.' },
        { q: '"Tôi đi bộ đến trường":', options: ['あるいてで学校へ行きます。', 'あるいて学校へ行きます。', 'あるいてと学校へ行きます。', '学校へあるいてで行きます。'], correct: 1, why: 'あるいて không đi kèm で.' },
        { q: 'Lan ở Nhật, nói với cô giáo: "Tháng 8 em về Việt Nam":', options: ['8月にベトナムへ行きます。', '8月にベトナムへ来ます。', '8月にベトナムへかえります。', '8月ベトナムをかえります。'], correct: 2, why: 'Về nước mình → かえります.' },
        { q: '"Bạn đã đi với ai?":', options: ['だれと行きましたか。', 'だれで行きましたか。', 'だれへ行きましたか。', 'だれの行きましたか。'], correct: 0, why: 'Với ai → だれと.' },
        { q: '"Khi nào bạn đến Nhật?":', options: ['いつに日本へ来ましたか。', 'いつ日本へ来ましたか。', 'なんじ日本へ来ましたか。', 'いつ日本で来ましたか。'], correct: 1, why: 'いつ không có に; nơi đến dùng へ.' },
        { q: 'Câu nào SAI?', options: ['どこへも行きません。', 'あした行きます。', '一人で行きます。', '来週に行きます。'], correct: 3, why: '来週 là từ tương đối → không có に: 来週行きます.' },
        { q: '"Mai Mike có đến không? — Không, cậu ấy không đến.":', options: ['…いいえ、来ませんでした。', '…いいえ、来ません。', '…いいえ、そうじゃありません。', '…いいえ、行きません。'], correct: 1, why: 'Hỏi về ngày mai → hiện tại/tương lai phủ định: 来ません.' },
        { q: '"Tuần trước tôi đã đi Osaka bằng Shinkansen":', options: ['先週しんかんせんでおおさかへ行きました。', '先週しんかんせんとおおさかへ行きました。', '先週しんかんせんでおおさかへ行きます。', '先週におおさかでしんかんせんへ行きました。'], correct: 0, why: 'Phương tiện で, nơi đến へ, quá khứ ました, 先週 không に.' },
      ],
    },
  ],
};

/* ══════════════════════════ 4. CHỮ HÁN ══════════════════════════ */

const KANJI: Lesson = {
  id: 'b5-kanji',
  kind: 'kanji',
  title: 'Chữ Hán: 行・来・今・先・年・週・毎・休',
  goal: 'Đọc được 行きます, 来ます và cả bộ "trước – này – sau – mỗi" (先週, 今月, 来年, 毎日…); viết tay 7 chữ ✍.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      items: [
        '**Hai động từ**: 行 (đi) · 来 (đến) — mỗi chữ có **âm Kun** trong động từ (い・き) và **âm On** trong từ ghép (こう, らい).',
        '**Bộ thời gian**: 先 (trước) · 今 (này) · 来 (sau) · 毎 (mỗi) ghép với 週 (tuần), 月 (tháng), 年 (năm), 日 (ngày) → học **một lần ra 15 từ**.',
        '**休** (nghỉ) — trong {休|やす}み, なつ{休|やす}み của Bài 4.',
        'Ba chữ 今 có cách đọc **đặc biệt** phải thuộc riêng: **{今日|きょう}**, **{今年|ことし}**, **けさ** (今朝).',
      ],
    },
    {
      t: 'table',
      caption: 'Chữ Hán Bài 5 (✍ = nên viết thuộc · 👁 = nhìn nhận ra là đủ)',
      head: ['Chữ', 'Hán Việt', 'On', 'Kun', 'Nghĩa', 'Từ ví dụ', 'Mức'],
      rows: [
        ['行', 'HÀNH', 'コウ・ギョウ', 'い(く)', 'đi; làm', '{行|い}きます · {銀行|ぎんこう} (ngân hàng)', '✍'],
        ['来', 'LAI', 'ライ', 'く(る)・き(ます)', 'đến; sau (tới)', '{来|き}ます · {来週|らいしゅう} · {来年|らいねん}', '✍'],
        ['今', 'KIM', 'コン', 'いま', 'bây giờ; này', '{今|いま} · {今週|こんしゅう} · {今月|こんげつ} · {今日|きょう}', '✍'],
        ['先', 'TIÊN', 'セン', 'さき', 'trước', '{先週|せんしゅう} · {先月|せんげつ} · {先生|せんせい}', '✍'],
        ['年', 'NIÊN', 'ネン', 'とし', 'năm; tuổi', '{来年|らいねん} · {今年|ことし} · {毎年|まいとし}', '✍'],
        ['週', 'CHU', 'シュウ', '—', 'tuần', '{先週|せんしゅう} · {毎週|まいしゅう} · {週末|しゅうまつ}', '👁'],
        ['毎', 'MỖI', 'マイ', '—', 'mỗi', '{毎日|まいにち} · {毎週|まいしゅう} · {毎月|まいつき}', '✍'],
        ['休', 'HƯU', 'キュウ', 'やす(む)', 'nghỉ', '{休|やす}み · なつ{休|やす}み · ひる{休|やす}み', '✍'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ mặt chữ',
      items: [
        '**行**: hình ngã tư đường nhìn từ trên xuống (bên trái 彳 = bước chân) → **đi** trên đường.',
        '**来**: cây lúa 木 có hai bông trĩu xuống → mùa lúa **đến** — lúa tới thì năm mới **tới** (来年).',
        '**今**: mái nhà 𠆢 che một dấu "một" — "ngay dưới mái nhà, **lúc này**".',
        '**先**: chân người 儿 bước lên trước → **đi trước** → {先生|せんせい} = người sinh ra trước (thầy).',
        '**休**: người 亻 dựa vào cây 木 → **nghỉ** ngơi. Dễ nhớ nhất trong bài!',
        '**毎**: có 母 (mẹ) bên dưới — mẹ ngày **nào** cũng lo cho con → **mỗi**. (Chú ý: phần dưới của 毎 viết hơi khác 母.)',
        '**年**: người vác bó lúa trên vai → một vụ lúa = một **năm**.',
      ],
    },
    {
      t: 'note',
      title: 'Đọc nhầm hay gặp',
      items: [
        '**来ます** đọc **きます** — không phải ~~らいます~~, ~~くます~~. Còn trong từ ghép: **らい**しゅう, **らい**げつ, **らい**ねん.',
        '**今日** đọc **きょう**, **今年** đọc **ことし** — không phải ~~こんにち~~, ~~こんねん~~.',
        '**毎月** đọc **まいつき**; **毎年** đọc **まいとし** (cũng nghe まいねん).',
        '**先月** đọc **せんげつ** (月 = げつ), không phải ~~せんがつ~~ (がつ chỉ dùng cho tên tháng: 7月).',
        '**行** trong **銀行** đọc **こう** (On) — chữ trong động từ thì đọc **い**.',
      ],
    },
    {
      t: 'table',
      caption: 'Ma trận thời gian — đọc to theo hàng, rồi theo cột',
      head: ['', '先 (trước)', '今 (này)', '来 (sau)', '毎 (mỗi)'],
      rows: [
        ['週 (tuần)', '{先週|せんしゅう}', '{今週|こんしゅう}', '{来週|らいしゅう}', '{毎週|まいしゅう}'],
        ['月 (tháng)', '{先月|せんげつ}', '{今月|こんげつ}', '{来月|らいげつ}', '{毎月|まいつき}'],
        ['年 (năm)', 'きょねん (去年)', '{今年|ことし}', '{来年|らいねん}', '{毎年|まいとし}'],
        ['日 (ngày)', 'きのう (昨日)', '{今日|きょう}', 'あした (明日)', '{毎日|まいにち}'],
      ],
    },
    {
      t: 'readkanji',
      id: 'b5-kj-doc',
      title: 'Đọc to — động từ và thời gian',
      note: 'Đọc cả câu không nhìn furigana. Chỗ vấp nhiều nhất: 来ます (きます) ↔ 来週 (らいしゅう), 今年 (ことし), 毎月 (まいつき), 先月 (せんげつ).',
      items: [
        { text: '{毎日|まいにち}{学校|がっこう}へ{行|い}きます。', ro: 'Mainichi gakkō e ikimasu.', vi: 'Hằng ngày tôi đi học.' },
        { text: 'マイクさんは{来週|らいしゅう}{来|き}ます。', ro: 'Maiku-san wa raishū kimasu.', vi: 'Tuần sau Mike sẽ đến.' },
        { text: '{先週|せんしゅう}きょうとへ{行|い}きました。', ro: 'Senshū Kyōto e ikimashita.', vi: 'Tuần trước tôi đã đi Kyoto.' },
        { text: '{今年|ことし}は{国|くに}へかえりません。', ro: 'Kotoshi wa kuni e kaerimasen.', vi: 'Năm nay tôi không về nước.' },
        { text: '{来年|らいねん}{母|はは}は{日本|にほん}へ{来|き}ます。', ro: 'Rainen haha wa Nihon e kimasu.', vi: 'Năm sau mẹ tôi sang Nhật.' },
        { text: '{今日|きょう}はどこへも{行|い}きません。', ro: 'Kyō wa doko e mo ikimasen.', vi: 'Hôm nay tôi không đi đâu cả.' },
        { text: '{先月|せんげつ}{日本|にほん}へ{来|き}ました。', ro: 'Sengetsu Nihon e kimashita.', vi: 'Tháng trước tôi đã đến Nhật.' },
        { text: '{毎月|まいつき}{一日|ついたち}はびょういんへ{行|い}きます。', ro: 'Maitsuki tsuitachi wa byōin e ikimasu.', vi: 'Ngày mồng 1 hằng tháng tôi đi bệnh viện.' },
        { text: '{今|いま}、{何時|なんじ}ですか。', ro: 'Ima, nanji desu ka.', vi: 'Bây giờ là mấy giờ?' },
        { text: '{今週|こんしゅう}の{休|やす}みはにちようびです。', ro: 'Konshū no yasumi wa nichiyōbi desu.', vi: 'Ngày nghỉ tuần này là Chủ nhật.' },
        { text: '{先生|せんせい}は{車|くるま}で{来|き}ました。', ro: 'Sensei wa kuruma de kimashita.', vi: 'Cô giáo đã đến bằng ô tô.' },
        { text: '{毎週|まいしゅう}{電車|でんしゃ}で{行|い}きます。', ro: 'Maishū densha de ikimasu.', vi: 'Hằng tuần tôi đi bằng tàu điện.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-kj-chon',
      title: 'Chọn cách đọc đúng',
      items: [
        { q: '**来ます**', options: ['らいます', 'きます', 'くます', 'こます'], correct: 1, why: '来ます = きます (đến).' },
        { q: '**来週**', options: ['きしゅう', 'くしゅう', 'らいしゅう', 'らいしゅ'], correct: 2, why: 'Trong từ ghép 来 đọc らい: らいしゅう (trường âm ở しゅう).' },
        { q: '**今年**', options: ['こんねん', 'いまとし', 'ことし', 'こんとし'], correct: 2, why: '今年 đọc đặc biệt: ことし.' },
        { q: '**先月**', options: ['せんがつ', 'せんげつ', 'さきつき', 'せんつき'], correct: 1, why: '先月 = せんげつ (月 đọc げつ).' },
        { q: '**毎月**', options: ['まいげつ', 'まいがつ', 'まいつき', 'まいにち'], correct: 2, why: '毎月 = まいつき.' },
        { q: '**行きます**', options: ['いきます', 'ゆきます', 'こうきます', 'ぎょうきます'], correct: 0, why: '行きます = いきます.' },
        { q: '**休み**', options: ['やすみ', 'きゅうみ', 'やすむ', 'よすみ'], correct: 0, why: '休み = やすみ (ngày nghỉ).' },
        { q: '**毎週**', options: ['まいしゅう', 'まいしゅ', 'まいにち', 'まいしょう'], correct: 0, why: '毎週 = まいしゅう (trường âm う).' },
      ],
    },
    {
      t: 'write',
      id: 'b5-kj-viet',
      title: 'Tập viết chữ Hán Bài 5',
      note: '7 chữ ✍. 週 là 👁 (11 nét) — viết thử nếu còn sức. Chú ý 休: bộ 亻 (người) bên trái + 木 (cây) bên phải; đừng viết thành 体 (thể — cơ thể).',
      chars: ['行', '来', '今', '先', '年', '毎', '休', '週'],
    },
  ],
};

/* ══════════════════════════ 5. NGHE ══════════════════════════ */

const NGHE: Lesson = {
  id: 'b5-nghe',
  kind: 'listening',
  title: 'Nghe: đi đâu, bằng gì, với ai, khi nào?',
  goal: 'Nghe kiểu đề JLPT N5 và bắt được: nơi đến, phương tiện, người đi cùng, thời điểm, và đuôi ～ました／～ませんでした.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      items: [
        '5 bài theo dạng đề **JLPT N5 聴解**: ポイント理解, 課題理解, 発話表現, 即時応答.',
        'Từ khoá phải bắt: **～へ** (nơi), **～で** (phương tiện), **～と** (người), **～に** (mốc), và **đuôi động từ**.',
        'Bẫy của bài: một người **đoán sai** rồi người kia **sửa lại** ("いいえ、～じゃありません") — đáp án là câu sửa.',
        '**{来週|らいしゅう}** (tuần sau) và **{来月|らいげつ}** (tháng sau) nghe khá giống — nghe kỹ âm cuối しゅう／げつ.',
      ],
    },
    {
      t: 'listen',
      id: 'b5-nghe-1',
      title: 'Bài nghe 1 — Cuối tuần của Mike (ポイント理解)',
      note: 'Dạng ポイント理解. Câu hỏi chính: "Mike đã đi Kamakura bằng gì?". Kim đoán một phương tiện — Mike sửa lại.',
      lines: [
        { who: 'キム', voice: 'ja-nu', text: 'マイクさん、どようびにどこへ{行|い}きましたか。', ro: 'Maiku-san, doyōbi ni doko e ikimashita ka.', vi: 'Mike ơi, thứ Bảy anh đã đi đâu?' },
        { who: 'マイク', voice: 'ja-nam', text: 'かまくらへ{行|い}きました。', ro: 'Kamakura e ikimashita.', vi: 'Tôi đã đi Kamakura.' },
        { who: 'キム', voice: 'ja-nu', text: '{電車|でんしゃ}で{行|い}きましたか。', ro: 'Densha de ikimashita ka.', vi: 'Anh đi bằng tàu điện à?' },
        { who: 'マイク', voice: 'ja-nam', text: 'いいえ、{電車|でんしゃ}じゃありません。{会社|かいしゃ}の{友|とも}だちの{車|くるま}で{行|い}きました。', ro: 'Iie, densha ja arimasen. Kaisha no tomodachi no kuruma de ikimashita.', vi: 'Không, không phải tàu điện. Tôi đi bằng ô tô của bạn ở công ty.' },
        { who: 'キム', voice: 'ja-nu', text: 'いいですね。にちようびは？', ro: 'Ii desu ne. Nichiyōbi wa?', vi: 'Hay quá nhỉ. Còn Chủ nhật?' },
        { who: 'マイク', voice: 'ja-nam', text: 'にちようびはどこへも{行|い}きませんでした。', ro: 'Nichiyōbi wa doko e mo ikimasen deshita.', vi: 'Chủ nhật tôi chẳng đi đâu cả.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-nghe-1-cau',
      title: 'Câu hỏi bài nghe 1',
      items: [
        { q: 'Mike đã đi Kamakura bằng gì?', options: ['Tàu điện', 'Ô tô', 'Xe buýt', 'Shinkansen'], correct: 1, why: 'Kim đoán 電車, Mike sửa: 友だちの車で行きました — bằng ô tô.' },
        { q: 'Mike đi Kamakura với ai?', options: ['Một mình', 'Với Kim', 'Với bạn ở công ty', 'Với gia đình'], correct: 2, why: '会社の友だちの車で — đi bằng xe của bạn đồng nghiệp, tức là đi cùng bạn ấy.' },
        { q: 'Chủ nhật Mike làm gì?', options: ['Đi Kamakura', 'Đi làm', 'Không đi đâu cả', 'Đi với Kim'], correct: 2, why: 'どこへも行きませんでした.' },
      ],
    },
    {
      t: 'listen',
      id: 'b5-nghe-2',
      title: 'Bài nghe 2 — Lên tàu nào? (課題理解)',
      note: 'Dạng 課題理解: nghe rồi quyết định. Lan muốn đi Shinjuku và muốn tới **sớm nhất**. Câu hỏi: "Lan sẽ lên tàu nào?". Ghi nháp: sân ga – giờ – loại tàu.',
      lines: [
        { who: 'ラン', voice: 'ja-nu', text: 'すみません、2ばんせんの{電車|でんしゃ}はしんじゅくへ{行|い}きますか。', ro: 'Sumimasen, nibansen no densha wa Shinjuku e ikimasu ka.', vi: 'Xin lỗi, tàu ở sân ga số 2 có đi Shinjuku không ạ?' },
        { who: 'えきいん', voice: 'ja-nam', text: 'いいえ、{行|い}きません。しんじゅくは4ばんせんです。', ro: 'Iie, ikimasen. Shinjuku wa yonbansen desu.', vi: 'Không ạ. Đi Shinjuku là sân ga số 4.' },
        { who: 'ラン', voice: 'ja-nu', text: 'つぎの{電車|でんしゃ}は{何時|なんじ}ですか。', ro: 'Tsugi no densha wa nanji desu ka.', vi: 'Chuyến tiếp theo là mấy giờ ạ?' },
        { who: 'えきいん', voice: 'ja-nam', text: '{10時|じゅうじ}{5分|ごふん}のふつうです。でも、{10時|じゅうじ}{12分|じゅうにふん}のきゅうこうははやいですよ。しんじゅくに{10時半|じゅうじはん}につきます。', ro: 'Jūji gofun no futsū desu. Demo, jūji jūnifun no kyūkō wa hayai desu yo. Shinjuku ni jūji han ni tsukimasu.', vi: 'Là tàu thường lúc 10:05. Nhưng tàu nhanh lúc 10:12 thì tới sớm hơn đấy. Tàu đó đến Shinjuku lúc 10:30.' },
        { who: 'ラン', voice: 'ja-nu', text: 'そうですか。じゃ、きゅうこうで{行|い}きます。', ro: 'Sō desu ka. Ja, kyūkō de ikimasu.', vi: 'Vậy à. Thế em đi tàu nhanh.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-nghe-2-cau',
      title: 'Câu hỏi bài nghe 2',
      items: [
        { q: 'Lan sẽ lên tàu nào?', options: ['Sân ga 2, 10:05', 'Sân ga 4, 10:05, tàu thường', 'Sân ga 4, 10:12, tàu nhanh', 'Sân ga 2, 10:12, tàu nhanh'], correct: 2, why: 'Tàu đi Shinjuku ở 4ばんせん; Lan chọn きゅうこう lúc 10:12.' },
        { q: 'Tàu Lan đi tới Shinjuku lúc mấy giờ?', options: ['10:05', '10:12', '10:30', '11:00'], correct: 2, why: 'しんじゅくに10時半につきます — 10:30. (つきます = đến nơi.)' },
        { q: '"はやいですよ" — anh nhân viên muốn nói gì?', options: ['Tàu đó tới sớm hơn (nhanh hơn)', 'Tàu đó đắt hơn', 'Tàu đó đông người', 'Tàu đó đã chạy rồi'], correct: 0, why: 'はやい = sớm / nhanh (tính từ, Bài 8). よ = báo thông tin mới.' },
      ],
    },
    {
      t: 'listen',
      id: 'b5-nghe-3',
      title: 'Bài nghe 3 — Khi nào Kim về nước? (ポイント理解)',
      note: 'Dạng ポイント理解. Câu hỏi: "Kim về Hàn Quốc khi nào, với ai?". Nghe kỹ **らいしゅう ↔ らいげつ** và câu sửa của Kim.',
      lines: [
        { who: 'たなか', voice: 'ja-nam', text: 'キムさん、{来週|らいしゅう}かんこくへかえりますね。', ro: 'Kimu-san, raishū Kankoku e kaerimasu ne.', vi: 'Kim này, tuần sau bạn về Hàn Quốc nhỉ.' },
        { who: 'キム', voice: 'ja-nu', text: 'いいえ、{来週|らいしゅう}じゃありません。{来月|らいげつ}です。{12月|じゅうにがつ}{20日|はつか}にかえります。', ro: 'Iie, raishū ja arimasen. Raigetsu desu. Jūnigatsu hatsuka ni kaerimasu.', vi: 'Không, không phải tuần sau. Tháng sau cơ. Mình về ngày 20 tháng 12.' },
        { who: 'たなか', voice: 'ja-nam', text: '{一人|ひとり}でかえりますか。', ro: 'Hitori de kaerimasu ka.', vi: 'Bạn về một mình à?' },
        { who: 'キム', voice: 'ja-nu', text: 'いいえ、{母|はは}とかえります。{母|はは}は{12月|じゅうにがつ}{15日|じゅうごにち}に{日本|にほん}へ{来|き}ます。', ro: 'Iie, haha to kaerimasu. Haha wa jūnigatsu jūgonichi ni Nihon e kimasu.', vi: 'Không, mình về cùng mẹ. Mẹ mình sang Nhật ngày 15 tháng 12.' },
        { who: 'たなか', voice: 'ja-nam', text: 'そうですか。いつ{日本|にほん}へ{来|き}ますか。', ro: 'Sō desu ka. Itsu Nihon e kimasu ka.', vi: 'Vậy à. Khi nào bạn quay lại Nhật?' },
        { who: 'キム', voice: 'ja-nu', text: '{1月|いちがつ}{6日|むいか}に{来|き}ます。', ro: 'Ichigatsu muika ni kimasu.', vi: 'Ngày 6 tháng 1.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-nghe-3-cau',
      title: 'Câu hỏi bài nghe 3',
      items: [
        { q: 'Kim về Hàn Quốc ngày nào?', options: ['Tuần sau', '15/12', '20/12', '6/1'], correct: 2, why: '12月20日にかえります. 15/12 là ngày mẹ Kim sang Nhật; 6/1 là ngày Kim quay lại.' },
        { q: 'Kim về cùng ai?', options: ['Một mình', 'Với Tanaka', 'Với mẹ', 'Với bạn'], correct: 2, why: '母とかえります.' },
        { q: 'Khi nào Kim quay lại Nhật?', options: ['Ngày 6 tháng 1', 'Ngày 4 tháng 1', 'Ngày 1 tháng 6', 'Tháng sau'], correct: 0, why: '1月6日 = いちがつむいか.' },
      ],
    },
    {
      t: 'listen',
      id: 'b5-nghe-4',
      title: 'Bài nghe 4 — Nói gì bây giờ? (発話表現)',
      note: 'Dạng 発話表現: đề cho tình huống, máy đọc 3 câu, chọn câu nên nói. **Tình huống A**: buổi sáng, bạn ra khỏi ký túc xá, anh quản lý đứng ở cửa. **Tình huống B**: buổi tối bạn về tới ký túc xá.',
      lines: [
        { who: 'A-1', voice: 'ja-nu', text: 'いってらっしゃい。', ro: 'Itte rasshai.', vi: 'Đi nhé. (người ở lại nói)' },
        { who: 'A-2', voice: 'ja-nu', text: 'いってきます。', ro: 'Itte kimasu.', vi: 'Tôi đi đây.' },
        { who: 'A-3', voice: 'ja-nu', text: 'おかえりなさい。', ro: 'Okaerinasai.', vi: 'Về rồi đấy à. (người ở nhà nói)' },
        { who: 'B-1', voice: 'ja-nu', text: 'ただいま。', ro: 'Tadaima.', vi: 'Tôi về rồi đây.' },
        { who: 'B-2', voice: 'ja-nu', text: 'いってきます。', ro: 'Itte kimasu.', vi: 'Tôi đi đây.' },
        { who: 'B-3', voice: 'ja-nu', text: 'いらっしゃいませ。', ro: 'Irasshaimase.', vi: 'Kính chào quý khách.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-nghe-4-cau',
      title: 'Câu hỏi bài nghe 4',
      items: [
        { q: 'Tình huống A (bạn ra khỏi ký túc xá) — bạn nói câu nào?', options: ['1', '2', '3'], correct: 1, why: 'Người ĐI nói いってきます; người ở lại đáp いってらっしゃい.' },
        { q: 'Tình huống B (bạn về tới ký túc xá) — bạn nói câu nào?', options: ['1', '2', '3'], correct: 0, why: 'Người VỀ nói ただいま; người ở nhà đáp おかえりなさい.' },
      ],
    },
    {
      t: 'listen',
      id: 'b5-nghe-5',
      title: 'Bài nghe 5 — Đáp ngay (即時応答)',
      note: 'Dạng 即時応答: nghe một câu, chọn câu đáp tự nhiên nhất. 4 câu nhỏ.',
      lines: [
        { who: 'Câu 1', voice: 'ja-nam', text: 'きのう、どこへ{行|い}きましたか。', ro: 'Kinō, doko e ikimashita ka.', vi: 'Hôm qua bạn đã đi đâu?' },
        { who: 'Câu 2', voice: 'ja-nu', text: 'なんで{学校|がっこう}へ{来|き}ますか。', ro: 'Nan de gakkō e kimasu ka.', vi: 'Bạn đến trường bằng gì?' },
        { who: 'Câu 3', voice: 'ja-nam', text: 'だれと{行|い}きましたか。', ro: 'Dare to ikimashita ka.', vi: 'Bạn đã đi với ai?' },
        { who: 'Câu 4', voice: 'ja-nu', text: 'いつ{国|くに}へかえりますか。', ro: 'Itsu kuni e kaerimasu ka.', vi: 'Khi nào bạn về nước?' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-nghe-5-cau',
      title: 'Câu hỏi bài nghe 5 — chọn câu đáp',
      items: [
        { q: 'Câu 1: きのう、どこへ行きましたか。', options: ['としょかんへ行きます。', 'としょかんへ行きました。', 'バスで行きました。'], correct: 1, why: 'Hỏi nơi, quá khứ → としょかんへ行きました. Câu c trả lời phương tiện.' },
        { q: 'Câu 2: なんで学校へ来ますか。', options: ['あるいて来ます。', '友だちと来ます。', '9時に来ます。'], correct: 0, why: 'なんで = bằng gì → あるいて来ます.' },
        { q: 'Câu 3: だれと行きましたか。', options: ['一人で行きました。', '電車で行きました。', 'きのう行きました。'], correct: 0, why: 'Hỏi với ai → 一人で (một mình).' },
        { q: 'Câu 4: いつ国へかえりますか。', options: ['ひこうきでかえります。', '来月かえります。', 'かぞくとかえります。'], correct: 1, why: 'Hỏi khi nào → 来月.' },
      ],
    },
  ],
};

/* ══════════════════════════ 6. NÓI ══════════════════════════ */

const NOI: Lesson = {
  id: 'b5-noi',
  kind: 'speaking',
  title: 'Nói: kể chuyện đi lại — đi đâu, bằng gì, với ai, khi nào',
  goal: 'Đọc trôi 12 câu mẫu (từ câu chào đi – về tới câu đủ 5 thành phần), rồi tự kể cuối tuần và cách đi học của mình.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      items: [
        '**Luyện phát âm** 12 câu từ ngắn tới dài — cũng là danh sách câu khi 📞 gọi **CuongMini** trong bài này.',
        'Chú trọng: đuôi **-mashita / -masen deshita** đọc rõ từng nhịp; trợ từ **へ đọc "e"**; âm **っ** trong **itte**; trường âm trong **gakkō, raishū, Kyōto**.',
        'Hội thoại mẫu "giám khảo ↔ thí sinh": kể cuối tuần và kế hoạch nghỉ hè.',
        'Ghi âm trả lời 5 câu hỏi về bản thân.',
      ],
    },
    {
      t: 'phatam',
      id: 'b5-noi-phat-am',
      title: 'Đọc to & chấm phát âm — 12 câu Bài 5',
      note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Âm **u** cuối trong **-masu** gần như câm: "i-ki-mas". Đuôi **-mashita**: âm **i** trong shi cũng rất nhẹ: "i-ki-ma-shta".',
      items: [
        { text: 'いってきます。', ipa: 'itte kimasu', vi: 'Tôi đi đây.' },
        { text: 'ただいま。', ipa: 'tadaima', vi: 'Tôi về rồi đây.' },
        { text: 'どこへ{行|い}きますか。', ipa: 'doko e ikimasu ka', vi: 'Bạn đi đâu đấy?' },
        { text: '{学校|がっこう}へ{行|い}きます。', ipa: 'gakkō e ikimasu', vi: 'Tôi đi học.' },
        { text: '{電車|でんしゃ}で{行|い}きました。', ipa: 'densha de ikimashita', vi: 'Tôi đã đi bằng tàu điện.' },
        { text: '{友|とも}だちと{行|い}きました。', ipa: 'tomodachi to ikimashita', vi: 'Tôi đã đi với bạn.' },
        { text: 'あるいてうちへかえります。', ipa: 'aruite uchi e kaerimasu', vi: 'Tôi đi bộ về nhà.' },
        { text: 'きのうはどこへも{行|い}きませんでした。', ipa: 'kinō wa doko e mo ikimasen deshita', vi: 'Hôm qua tôi không đi đâu cả.' },
        { text: 'いつ{国|くに}へかえりますか。', ipa: 'itsu kuni e kaerimasu ka', vi: 'Khi nào bạn về nước?' },
        { text: '{来月|らいげつ}{一人|ひとり}でかえります。', ipa: 'raigetsu hitori de kaerimasu', vi: 'Tháng sau tôi về một mình.' },
        { text: 'この{電車|でんしゃ}はしんじゅくへ{行|い}きますか。', ipa: 'kono densha wa Shinjuku e ikimasu ka', vi: 'Tàu này có đi Shinjuku không?' },
        { text: '{来週|らいしゅう}キムさんとしんかんせんできょうとへ{行|い}きます。', ipa: 'raishū Kimu san to shinkansen de Kyōto e ikimasu', vi: 'Tuần sau tôi đi Kyoto bằng Shinkansen với Kim.' },
      ],
    },
    {
      t: 'note',
      title: 'Phát âm người Việt hay sai',
      items: [
        'Đọc trợ từ **へ** thành "hê" → đọc **"e"** ngắn: がっこう**e**いきます.',
        '**いってきます**: có một nhịp lặng ở っ — **it-te**, không đọc ~~ite~~ (nghe thành "đi rồi").',
        '**きます** (đến) ≠ **ききます** (nghe, Bài 6) ≠ **きって** (con tem). Một âm khác là đổi cả nghĩa.',
        '**-ませんでした** dài 6 nhịp: **ma-se-n-de-shi-ta** — giữ đủ nhịp ん, đừng nuốt thành ~~masendeshta~~ quá nhanh.',
        '**Kyōto** (京都) có trường âm ở **kyō**, Tokyo (**Tōkyō**) có **hai** trường âm.',
      ],
    },
    {
      t: 'dialogue',
      title: 'Mẫu: giám khảo hỏi chuyện đi lại',
      lines: [
        { who: 'Giám khảo', role: 'examiner', text: 'まいにちなんで{学校|がっこう}へ{行|い}きますか。', ro: 'Mainichi nan de gakkō e ikimasu ka.', vi: 'Hằng ngày em đi học bằng gì?' },
        { who: 'Thí sinh', role: 'candidate', text: 'バイクで{行|い}きます。{20分|にじゅっぷん}ぐらいです。', ro: 'Baiku de ikimasu. Nijuppun gurai desu.', vi: 'Em đi bằng xe máy ạ. Khoảng 20 phút.' },
        { who: 'Giám khảo', role: 'examiner', text: 'しゅうまつ、どこへ{行|い}きましたか。', ro: 'Shūmatsu, doko e ikimashita ka.', vi: 'Cuối tuần em đã đi đâu?' },
        { who: 'Thí sinh', role: 'candidate', text: 'どようびに{友|とも}だちとこうえんへ{行|い}きました。', ro: 'Doyōbi ni tomodachi to kōen e ikimashita.', vi: 'Thứ Bảy em đi công viên với bạn ạ.' },
        { who: 'Giám khảo', role: 'examiner', text: 'にちようびは？', ro: 'Nichiyōbi wa?', vi: 'Còn Chủ nhật?' },
        { who: 'Thí sinh', role: 'candidate', text: 'にちようびはどこへも{行|い}きませんでした。', ro: 'Nichiyōbi wa doko e mo ikimasen deshita.', vi: 'Chủ nhật em không đi đâu cả ạ.' },
        { who: 'Giám khảo', role: 'examiner', text: 'なつ{休|やす}みにどこへ{行|い}きますか。', ro: 'Natsuyasumi ni doko e ikimasu ka.', vi: 'Nghỉ hè em sẽ đi đâu?' },
        { who: 'Thí sinh', role: 'candidate', text: 'かぞくとダナンへ{行|い}きます。ひこうきで{行|い}きます。', ro: 'Kazoku to Danan e ikimasu. Hikōki de ikimasu.', vi: 'Em đi Đà Nẵng với gia đình ạ. Đi bằng máy bay.' },
      ],
    },
    {
      t: 'note',
      title: 'Bí quyết trả lời',
      items: [
        '**バイク** = xe máy — phương tiện của người Việt, nhớ để kể về mình. Tên thành phố Việt Nam viết katakana: **ハノイ** (Hà Nội), **ホーチミン** (TP.HCM), **ダナン** (Đà Nẵng).',
        'Nghe kỹ **đuôi câu hỏi**: ～ました**か** → trả lời ～ました; ～ます**か** → trả lời ～ます. Lệch thì là lỗi nặng.',
        'Trả lời xong một ý, **thêm một chi tiết** (với ai / bằng gì / bao lâu) — giám khảo đánh giá cao câu trả lời có 2 câu.',
      ],
    },
    {
      t: 'speak',
      id: 'b5-noi-ghi-am',
      part: '1',
      questions: [
        'まいにち なんで がっこうへ いきますか。',
        'きのう どこへ いきましたか。',
        'しゅうまつ だれと どこへ いきましたか。',
        'なんじに うちへ かえりますか。',
        'なつやすみに どこへ いきますか。',
      ],
    },
  ],
};

/* ══════════════════════════ 7. BÀI TẬP ══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b5-bai-tap',
  kind: 'homework',
  title: 'Bài tập Bài 5 — dịch, chọn trợ từ, ghép câu, đọc hiểu',
  goal: 'Tự viết câu kể việc đi lại ở 4 dạng động từ với へ・で・と・に; đọc hiểu một trang nhật ký ngắn.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      items: [
        '**Dịch Việt → Nhật** 12 câu (gõ kana hay chữ Hán đều được; へ hay に cho nơi đến đều được chấm đúng).',
        '**Trắc nghiệm** 12 câu: trợ từ へ／で／と／に／も, 行きます・来ます・かえります, 4 dạng động từ.',
        '**Ghép câu** 6 câu và **đọc hiểu** nhật ký cuối tuần của Lan.',
      ],
    },
    {
      t: 'quiz',
      id: 'b5-bt-dich',
      title: 'Dịch sang tiếng Nhật',
      kind: 'translate',
      grammar: 'N へ 行きます／来ます／かえります · N で · N と · 一人で · いつ · ～に · ～ます／ません／ました／ませんでした',
      items: [
        { q: 'Ngày mai tôi đi ngân hàng.', answers: ans('あしたぎんこうへ{行|い}きます。', 'あしたはぎんこうへ{行|い}きます。'), hint: 'あした, ぎんこう, へ, 行きます' },
        { q: 'Hôm qua tôi đã đi siêu thị.', answers: ans('きのうスーパーへ{行|い}きました。', 'きのうはスーパーへ{行|い}きました。'), hint: 'きのう, スーパー, 行きました' },
        { q: 'Chủ nhật tôi đã không đi đâu cả.', answers: ans('にちようびはどこへも{行|い}きませんでした。', 'にちようびはどこも{行|い}きませんでした。', 'にちようびにどこへも{行|い}きませんでした。'), hint: 'どこへも, 行きませんでした' },
        { q: 'Tôi đi học bằng xe đạp.', answers: ans('じてんしゃで{学校|がっこう}へ{行|い}きます。', '{学校|がっこう}へじてんしゃで{行|い}きます。'), hint: 'じてんしゃ, で, 学校' },
        { q: 'Tôi đi bộ về nhà.', answers: ans('あるいてうちへかえります。', 'うちへあるいてかえります。'), hint: 'あるいて, うち, かえります' },
        { q: 'Tôi đã đi Kyoto với bạn.', answers: ans('{友|とも}だちときょうとへ{行|い}きました。', 'きょうとへ{友|とも}だちと{行|い}きました。'), hint: '友だち, と, きょうと' },
        { q: 'Bạn đã đi với ai?', answers: ans('だれと{行|い}きましたか。'), hint: 'だれと' },
        { q: 'Khi nào bạn về nước?', answers: ans('いつ{国|くに}へかえりますか。', '{国|くに}へいつかえりますか。'), hint: 'いつ, 国, かえります' },
        { q: 'Tháng trước tôi đã đến Nhật.', answers: ans('{先月|せんげつ}{日本|にほん}へ{来|き}ました。', 'わたしは{先月|せんげつ}{日本|にほん}へ{来|き}ました。'), hint: '先月, 日本, 来ました' },
        { q: 'Mấy giờ bạn về nhà?', answers: ans('{何時|なんじ}にうちへかえりますか。'), hint: '何時に, うち, かえります' },
        { q: 'Tuần sau Mike sẽ không đến.', answers: ans('{来週|らいしゅう}マイクさんは{来|き}ません。', 'マイクさんは{来週|らいしゅう}{来|き}ません。'), hint: '来週, 来ません' },
        { q: 'Tôi về nước một mình bằng máy bay.', answers: ans('{一人|ひとり}でひこうきで{国|くに}へかえります。', 'ひこうきで{一人|ひとり}で{国|くに}へかえります。'), hint: '一人で, ひこうきで, 国' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-bt-chon',
      title: 'Chọn trợ từ / từ đúng',
      items: [
        { q: 'あしたびょういん ___ 行きます。', options: ['を', 'へ', 'で', 'と'], correct: 1, why: 'Nơi đến → へ (hoặc に).' },
        { q: 'タクシー ___ かえりました。', options: ['へ', 'と', 'で', 'に'], correct: 2, why: 'Phương tiện → で.' },
        { q: 'かぞく ___ 日本へ来ました。', options: ['と', 'で', 'へ', 'も'], correct: 0, why: 'Cùng với người → と.' },
        { q: '一人 ___ 行きました。', options: ['と', 'で', 'に', 'へ'], correct: 1, why: 'Một mình → 一人で.' },
        { q: '9時 ___ 学校へ来ます。', options: ['に', 'で', 'へ', '(không gì)'], correct: 0, why: 'Giờ có số → に.' },
        { q: 'あした ___ 行きます。', options: ['に', 'で', 'へ', '(không gì)'], correct: 3, why: 'あした là mốc tương đối → không có に.' },
        { q: 'どこへ ___ 行きませんでした。', options: ['は', 'も', 'と', 'か'], correct: 1, why: 'どこへも + phủ định = không đi đâu cả.' },
        { q: 'Lan đang ở trường, nói "Mai mình cũng đến trường": あしたも学校へ ___。', options: ['行きます', '来ます', 'かえります', '来ました'], correct: 1, why: 'Nơi người nói đang ở → 来ます.' },
        { q: 'Về nhà mình: うちへ ___。', options: ['行きます', '来ます', 'かえります', 'いきます'], correct: 2, why: 'Về nơi mình thuộc về → かえります.' },
        { q: 'きのう学校へ行きましたか。——いいえ、___。', options: ['行きません', '行きませんでした', '行きました', 'そうじゃありません'], correct: 1, why: 'Câu hỏi quá khứ → phủ định quá khứ: 行きませんでした.' },
        { q: '"Năm ngoái" là:', options: ['先年', 'きょねん', 'らいねん', 'ことし'], correct: 1, why: 'Năm ngoái = きょねん (去年).' },
        { q: 'なんで行きますか。——___。', options: ['友だちと行きます', 'あるいて行きます', '来週行きます', 'きょうとへ行きます'], correct: 1, why: 'なんで = bằng gì → あるいて (đi bộ).' },
      ],
    },
    {
      t: 'build',
      id: 'b5-bt-ghep',
      title: 'Ghép câu — kể chuyện đi lại',
      items: [
        { vi: 'Thứ Bảy tôi đã đi Shinjuku với Kim.', chips: ['どようびに', 'キムさんと', 'しんじゅくへ', '{行|い}きました。', 'キムさんで'], answer: ['どようびに', 'キムさんと', 'しんじゅくへ', '{行|い}きました。'], ro: 'Doyōbi ni Kimu-san to Shinjuku e ikimashita.' },
        { vi: 'Hằng ngày tôi đi làm bằng tàu điện ngầm.', chips: ['{毎日|まいにち}', 'ちかてつで', '{会社|かいしゃ}へ', '{行|い}きます。', '{毎日|まいにち}に'], answer: ['{毎日|まいにち}', 'ちかてつで', '{会社|かいしゃ}へ', '{行|い}きます。'], ro: 'Mainichi chikatetsu de kaisha e ikimasu.' },
        { vi: 'Mẹ tôi sang Nhật vào ngày 2 tháng 5.', chips: ['{母|はは}は', '{5月|ごがつ}', '{2日|ふつか}に', '{日本|にほん}へ', '{来|き}ます。', 'かえります。'], answer: ['{母|はは}は', '{5月|ごがつ}', '{2日|ふつか}に', '{日本|にほん}へ', '{来|き}ます。'], ro: 'Haha wa gogatsu futsuka ni Nihon e kimasu.' },
        { vi: 'Tôi đã không về nước.', chips: ['{国|くに}へ', 'かえりませんでした。', 'かえりました。', 'へも'], answer: ['{国|くに}へ', 'かえりませんでした。'], ro: 'Kuni e kaerimasen deshita.' },
        { vi: 'Tàu này có đi Yokohama không?', chips: ['この', '{電車|でんしゃ}は', 'よこはまへ', '{行|い}きますか。', 'で'], answer: ['この', '{電車|でんしゃ}は', 'よこはまへ', '{行|い}きますか。'], ro: 'Kono densha wa Yokohama e ikimasu ka.' },
        { vi: 'Bạn đi đâu bằng xe buýt?', chips: ['バスで', 'どこへ', '{行|い}きますか。', 'いつ'], answer: ['バスで', 'どこへ', '{行|い}きますか。'], ro: 'Basu de doko e ikimasu ka.' },
      ],
    },
    {
      t: 'passage',
      title: 'Đọc hiểu — ランさんのにっき (Nhật ký của Lan)',
      intro: 'Tối Chủ nhật, Lan viết nhật ký bằng tiếng Nhật để luyện viết. Đọc rồi trả lời câu hỏi.',
      paras: [
        { label: 'どようび', text: '{今日|きょう}は{午前|ごぜん}{10時|じゅうじ}に{一人|ひとり}でスーパーへ{行|い}きました。じてんしゃで{行|い}きました。{午後|ごご}はキムさんとあさくさへ{行|い}きました。ちかてつで{行|い}きました。あさくさから{電車|でんしゃ}でかえりました。うちへ{9時|くじ}ごろかえりました。' },
        { label: 'にちようび', text: 'にちようびはどこへも{行|い}きませんでした。{来週|らいしゅう}のどようびに、マイクさんはアメリカへかえります。わたしとたなかさんはバスでくうこうへ{行|い}きます。' },
      ],
    },
    {
      t: 'note',
      title: 'Bản dịch & từ mới (xem sau khi làm)',
      items: [
        '**Thứ Bảy**: Hôm nay 10 giờ sáng tôi đi siêu thị một mình. Tôi đi bằng xe đạp. Buổi chiều tôi đi Asakusa với Kim. Chúng tôi đi bằng tàu điện ngầm. Từ Asakusa chúng tôi về bằng tàu điện. Tôi về đến nhà khoảng 9 giờ.',
        '**Chủ nhật**: Chủ nhật tôi chẳng đi đâu cả. Thứ Bảy tuần sau Mike về Mỹ. Tôi và Tanaka sẽ đi ra sân bay bằng xe buýt.',
        'Từ mới: **にっき** = nhật ký · **あさくさ** = Asakusa (khu phố cổ ở Tokyo, có chùa Sensō-ji) · **AとB** = A và B (わたし**と**たなかさん).',
      ],
    },
    {
      t: 'mcq',
      id: 'b5-bt-doc',
      title: 'Câu hỏi đọc hiểu',
      items: [
        { q: 'Sáng thứ Bảy Lan đi siêu thị thế nào?', options: ['Với Kim, bằng tàu điện ngầm', 'Một mình, bằng xe đạp', 'Một mình, đi bộ', 'Với Tanaka, bằng xe buýt'], correct: 1, why: '一人でスーパーへ行きました。じてんしゃで行きました.' },
        { q: 'Lan đi Asakusa bằng gì?', options: ['Xe đạp', 'Tàu điện ngầm', 'Tàu điện', 'Xe buýt'], correct: 1, why: 'あさくさへ…ちかてつで行きました. Lúc VỀ mới đi 電車.' },
        { q: 'Lan về nhà lúc mấy giờ?', options: ['Đúng 9 giờ', 'Khoảng 9 giờ', 'Khoảng 10 giờ', 'Không ghi'], correct: 1, why: '9時ごろ = khoảng 9 giờ.' },
        { q: 'Chủ nhật Lan làm gì?', options: ['Đi sân bay', 'Đi Asakusa', 'Không đi đâu cả', 'Đi siêu thị'], correct: 2, why: 'にちようびはどこへも行きませんでした.' },
        { q: 'Thứ Bảy tuần sau ai đi sân bay, bằng gì?', options: ['Mike, bằng taxi', 'Lan và Tanaka, bằng xe buýt', 'Lan và Kim, bằng tàu điện', 'Chỉ Mike, bằng xe buýt'], correct: 1, why: 'わたしとたなかさんはバスでくうこうへ行きます. (Mike về Mỹ — đi máy bay từ sân bay.)' },
      ],
    },
  ],
};

/* ══════════════════════════ 8. KIỂM TRA CHẶNG 1 ══════════════════════════ */

const KIEM_TRA: Lesson = {
  id: 'b5-kiem-tra',
  kind: 'review',
  title: 'Kiểm tra chặng 1 (Bài 0–5) — đề kiểu JLPT N5',
  goal: 'Tự đo mình đã nắm chặng 1 tới đâu bằng 51 câu đủ 4 phần như đề JLPT N5; dưới 70% ở phần nào thì biết ôn lại bài nào trước khi sang Bài 6.',
  minutes: 60,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Cách làm bài kiểm tra',
      items: [
        'Phủ **Bài 0 → Bài 5**: bảng chữ, chào hỏi & N は N です, これ・この・の, ここ・どこ・いくら & số lớn, giờ – thứ – ngày tháng, 行きます・来ます・かえります với へ・で・と.',
        '**4 phần như đề thật**: もじ・ごい (chữ & từ) · ぶんぽう (ngữ pháp) · どっかい (đọc hiểu) · ちょうかい (nghe). Tổng **51 câu, mỗi câu 1 điểm**.',
        'Làm **một mạch 60 phút**, không xem lại bài, không bật romaji ở phần đọc. Phần nghe: mỗi bài **chỉ nghe 2 lần**, không mở lời thoại.',
        'Mỗi khối trắc nghiệm hiện **"Đúng x/y"** ở cuối — cộng lại theo bảng điểm bên dưới. Câu sai nào cũng ghi **(Bài N)** trong lời giải để biết ôn ở đâu.',
      ],
    },
    {
      t: 'table',
      caption: 'Cấu trúc đề & thang điểm',
      head: ['Phần', 'Dạng câu', 'Số câu', 'Thời gian gợi ý', 'Đạt (≥ 70%)'],
      rows: [
        ['1. もじ・ごい (chữ & từ vựng)', 'Viết kana · đọc chữ Hán · viết chữ Hán · chọn từ theo ngữ cảnh · câu cùng nghĩa', '25', '15′', '≥ 18'],
        ['2. ぶんぽう (ngữ pháp)', 'Chọn trợ từ · sắp xếp câu (★)', '14', '15′', '≥ 10'],
        ['3. どっかい (đọc hiểu)', 'Một đoạn tự giới thiệu + 4 câu hỏi', '4', '10′', '≥ 3'],
        ['4. ちょうかい (nghe)', '課題理解 · ポイント理解 · 即時応答', '8', '15′', '≥ 6'],
        ['**Tổng**', '', '**51**', '**~60′**', '**≥ 36 (70%)**'],
      ],
    },
    {
      t: 'note',
      title: 'Đọc kết quả',
      items: [
        '**≥ 46 điểm (90%)**: rất chắc — sang Bài 6 ngay.',
        '**36–45 điểm (70–89%)**: đạt — xem lại các câu sai theo bảng "ôn lại bài nào" ở cuối đề rồi học tiếp.',
        '**Dưới 36 điểm**, hoặc **một phần bất kỳ dưới mức "Đạt"**: dừng lại 1–2 buổi ôn đúng các bài được chỉ ra, làm lại phần đó (đề giữ nguyên, tiến độ lưu theo câu) rồi mới sang Bài 6.',
      ],
    },

    /* ── Phần 1: 文字・語彙 ── */
    { t: 'h', text: 'Phần 1 — もじ・ごい (chữ & từ vựng) · 25 câu' },
    {
      t: 'mcq',
      id: 'b5-kt-kana',
      title: 'もんだい1 — Chọn cách viết đúng bằng kana (4 câu)',
      items: [
        { q: '**kitte** (con tem)', options: ['きて', 'きって', 'きつて', 'きいて'], correct: 1, why: '(Bài 0) Âm ngắt viết bằng っ nhỏ: きって. きて = "đến đây".' },
        { q: '**obāsan** (bà)', options: ['おばさん', 'おばあさん', 'おぼあさん', 'おばさあん'], correct: 1, why: '(Bài 0) Trường âm ā viết thêm あ: おばあさん. おばさん = cô, dì.' },
        { q: '**gakkō** (trường học)', options: ['がこう', 'がっこ', 'がっこう', 'かっこう'], correct: 2, why: '(Bài 0–1) Có っ và trường âm う: がっこう.' },
        { q: '**kōhī** (cà phê) — viết katakana', options: ['コヒー', 'コーヒ', 'コオヒイ', 'コーヒー'], correct: 3, why: '(Bài 0, 2) Katakana kéo dài bằng dấu ー: コーヒー.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-kt-doc-han',
      title: 'もんだい2 — Chữ in đậm đọc thế nào? (8 câu)',
      items: [
        { q: 'わたしは **学生** です。', options: ['がくせい', 'がっせい', 'かくせい', 'がくせ'], correct: 0, why: '(Bài 1) 学生 = がくせい (học sinh, sinh viên).' },
        { q: 'これは **日本語** の ほんです。', options: ['にほんじん', 'にほんご', 'にほんごう', 'にぼんご'], correct: 1, why: '(Bài 2) 日本語 = にほんご (tiếng Nhật).' },
        { q: 'この かさは **千円** です。', options: ['せんねん', 'ちえん', 'せんえん', 'いっせんえん'], correct: 2, why: '(Bài 3) 千円 = せんえん; 1.000 không có いち.' },
        { q: '**入口** は あちらです。', options: ['でぐち', 'いりくち', 'にゅうぐち', 'いりぐち'], correct: 3, why: '(Bài 3) 入口 = いりぐち (lối vào). 出口 = でぐち.' },
        { q: 'じゅぎょうは **9時** からです。', options: ['きゅうじ', 'くじ', 'ここのじ', 'くうじ'], correct: 1, why: '(Bài 4) 9時 = くじ.' },
        { q: 'アルバイトは **午後** です。', options: ['ごご', 'ごぜん', 'ごうご', 'ひるご'], correct: 0, why: '(Bài 4) 午後 = ごご (buổi chiều).' },
        { q: '**来週** きょうとへ 行きます。', options: ['きしゅう', 'らいしゅう', 'らいしゅ', 'くるしゅう'], correct: 1, why: '(Bài 5) 来週 = らいしゅう (tuần sau).' },
        { q: '**毎日** でんしゃで 行きます。', options: ['まいび', 'まいひ', 'まいにち', 'まいじつ'], correct: 2, why: '(Bài 4–5) 毎日 = まいにち (hằng ngày).' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-kt-viet-han',
      title: 'もんだい3 — Chữ in đậm viết bằng chữ Hán thế nào? (4 câu)',
      items: [
        { q: 'うちの **でんわ** ばんごう', options: ['電話', '電語', '雷話', '電活'], correct: 0, why: '(Bài 2) 電話 = でんわ. 語 là "ngữ" (日本語), 雷 là "sấm".' },
        { q: 'にちようびは **やすみ** です。', options: ['体み', '休み', '木み', '保み'], correct: 1, why: '(Bài 4–5) 休み: người 亻 dựa vào cây 木. 体 = cơ thể.' },
        { q: '**ごぜん** 10じに 来ます。', options: ['牛前', '午後', '午前', '干前'], correct: 2, why: '(Bài 4) 午前 = ごぜん. 牛 (con bò) có nét dọc nhô lên trên; 午後 = ごご.' },
        { q: '**らいねん** にほんへ 来ます。', options: ['来年', '未年', '今年', '来手'], correct: 0, why: '(Bài 5) 来年 = らいねん. 今年 = ことし.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-kt-tu-ngu-canh',
      title: 'もんだい4 — Chọn từ đúng cho chỗ（　）(6 câu)',
      items: [
        { q: 'A「この とけいは いくらですか。」B「さんぜん（　）です。」', options: ['じ', 'えん', 'がつ', 'かい'], correct: 1, why: '(Bài 3) Hỏi giá → số tiền + えん (円).' },
        { q: 'A「トイレは（　）ですか。」B「あそこです。」', options: ['なん', 'だれ', 'どこ', 'いつ'], correct: 2, why: '(Bài 3) Trả lời là nơi chốn → どこ.' },
        { q: 'きょうは すいようびです。あしたは（　）です。', options: ['かようび', 'もくようび', 'きんようび', 'どようび'], correct: 1, why: '(Bài 4) Sau thứ Tư (すいようび) là thứ Năm (もくようび).' },
        { q: 'わたしは まいにち（　）で がっこうへ 行きます。', options: ['じてんしゃ', 'ともだち', 'えき', 'しんぶん'], correct: 0, why: '(Bài 5) N で + 行きます → phương tiện: じてんしゃ.' },
        { q: 'A「これは（　）の かさですか。」B「たなかさんのです。」', options: ['なん', 'だれ', 'どこ', 'いくら'], correct: 1, why: '(Bài 2) Trả lời là người sở hữu → だれの.' },
        { q: 'マイクさんは アメリカ（　）です。', options: ['ご', 'じん', 'こく', 'さい'], correct: 1, why: '(Bài 1) Quốc tịch: tên nước + じん (人). アメリカご là "tiếng Mỹ" — không dùng.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-kt-cung-nghia',
      title: 'もんだい5 — Chọn câu có nghĩa GẦN NHẤT với câu đã cho (3 câu)',
      items: [
        { q: '**あしたは どようびです。**', options: ['きょうは どようびです。', 'きょうは きんようびです。', 'きのうは どようびです。', 'あさっては どようびです。'], correct: 1, why: '(Bài 4) Mai là thứ Bảy ⇔ hôm nay là thứ Sáu (きんようび).' },
        { q: '**トイレは あちらです。**', options: ['トイレは あそこです。', 'トイレは これです。', 'トイレは どこですか。', 'トイレは ここじゃありません。'], correct: 0, why: '(Bài 3) あちら là cách nói lịch sự của あそこ.' },
        { q: '**キムさんは かんこくじんです。**', options: ['キムさんの かいしゃは かんこくです。', 'キムさんは かんこくごの せんせいです。', 'キムさんの くには かんこくです。', 'キムさんは かんこくへ 行きます。'], correct: 2, why: '(Bài 1, 3) Người Hàn Quốc ⇔ nước của Kim là Hàn Quốc.' },
      ],
    },

    /* ── Phần 2: 文法 ── */
    { t: 'h', text: 'Phần 2 — ぶんぽう (ngữ pháp) · 14 câu' },
    {
      t: 'mcq',
      id: 'b5-kt-tro-tu',
      title: 'もんだい1 — Chọn trợ từ cho chỗ（　）(10 câu)',
      items: [
        { q: 'わたし（　）ランです。ベトナムから きました。', options: ['は', 'も', 'の', 'を'], correct: 0, why: '(Bài 1) Chủ đề câu → は (đọc wa).' },
        { q: 'ランさんは がくせいです。キムさん（　）がくせいです。', options: ['は', 'も', 'と', 'の'], correct: 1, why: '(Bài 1) "cũng" → も.' },
        { q: 'これは わたし（　）ほんです。', options: ['は', 'を', 'の', 'で'], correct: 2, why: '(Bài 2) Sở hữu → の: わたしのほん.' },
        { q: 'あの ひとは せんせいです（　）。', options: ['か', 'も', 'の', 'へ'], correct: 0, why: '(Bài 1) Câu hỏi có/không → か cuối câu.' },
        { q: 'じゃ、この ネクタイ（　）ください。', options: ['は', 'を', 'が', 'に'], correct: 1, why: '(Bài 3) Cụm cố định khi mua: N をください.' },
        { q: 'じゅぎょうは 9じ（　）12じまでです。', options: ['まで', 'から', 'に', 'で'], correct: 1, why: '(Bài 4) Mốc bắt đầu → から.' },
        { q: 'ゆうびんきょくは ごご5じ（　）です。', options: ['から', 'に', 'まで', 'と'], correct: 2, why: '(Bài 4) Mở cửa đến 5 giờ → まで.' },
        { q: 'あした きょうと（　）行きます。', options: ['を', 'で', 'へ', 'と'], correct: 2, why: '(Bài 5) Nơi đến → へ (đọc e).' },
        { q: 'まいにち バス（　）がっこうへ 行きます。', options: ['で', 'と', 'へ', 'に'], correct: 0, why: '(Bài 5) Phương tiện → で.' },
        { q: 'にちようびに ともだち（　）こうえんへ 行きました。', options: ['で', 'と', 'の', 'を'], correct: 1, why: '(Bài 5) Cùng với người → と.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-kt-sap-xep',
      title: 'もんだい2 — Sắp xếp: từ nào đứng ở vị trí ★? (4 câu)',
      items: [
        { q: 'それは ＿＿ ＿＿ ★ ＿＿ か。（ 1.かさ　2.です　3.だれ　4.の ）', options: ['かさ', 'です', 'だれ', 'の'], correct: 0, why: '(Bài 2) Câu đúng: それは だれ の **かさ** です か。 → ★ = かさ.' },
        { q: 'たなかさんは きのう ＿＿ ＿＿ ★ ＿＿。（ 1.行き　2.きょうと　3.ました　4.へ ）', options: ['行き', 'きょうと', 'ました', 'へ'], correct: 0, why: '(Bài 5) Câu đúng: きのう きょうと へ **行き** ました。 → ★ = 行き.' },
        { q: 'わたしの ＿＿ ＿＿ ★ ＿＿ です。（ 1.4がつ　2.たんじょうび　3.ついたち　4.は ）', options: ['4がつ', 'たんじょうび', 'ついたち', 'は'], correct: 0, why: '(Bài 4) Câu đúng: わたしの たんじょうび は **4がつ** ついたち です。 → ★ = 4がつ (tháng trước, ngày sau).' },
        { q: 'ぎんこうは ＿＿ ＿＿ ★ ＿＿ です。（ 1.まで　2.ごご3じ　3.ごぜん9じ　4.から ）', options: ['まで', 'ごご3じ', 'ごぜん9じ', 'から'], correct: 1, why: '(Bài 4) Câu đúng: ぎんこうは ごぜん9じ から **ごご3じ** まで です。 → ★ = ごご3じ.' },
      ],
    },

    /* ── Phần 3: 読解 ── */
    { t: 'h', text: 'Phần 3 — どっかい (đọc hiểu) · 4 câu' },
    {
      t: 'passage',
      title: 'キムさんの じこしょうかい (Bài tự giới thiệu của Kim)',
      intro: 'Kim viết bài tự giới thiệu cho bảng tin của lớp. Đọc rồi trả lời câu hỏi. (Không bật romaji — như đề thật.)',
      paras: [
        { text: 'はじめまして。キムです。かんこくから きました。とうきょう{日本語学校|にほんごがっこう}の がくせいです。' },
        { text: 'わたしの うちは しぶやです。まいにち {電車|でんしゃ}で {学校|がっこう}へ {行|い}きます。じゅぎょうは {午前|ごぜん}{9時|くじ}から {12時|じゅうにじ}までです。' },
        { text: 'アルバイトは どようびと にちようびです。デパートの パンうりばです。{午後|ごご}{1時|いちじ}から {6時|ろくじ}までです。' },
        { text: '{来月|らいげつ}、{母|はは}は {日本|にほん}へ {来|き}ます。{母|はは}と きょうとへ {行|い}きます。どうぞ よろしく おねがいします。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-kt-doc-hieu',
      title: 'Câu hỏi đọc hiểu (4 câu)',
      items: [
        { q: 'Kim đến trường bằng gì?', options: ['Đi bộ', 'Xe đạp', 'Tàu điện', 'Xe buýt'], correct: 2, why: '(Bài 5) まいにち電車で学校へ行きます.' },
        { q: 'Kim làm thêm ở đâu?', options: ['Quầy bánh mì ở trung tâm thương mại', 'Cửa hàng tiện lợi', 'Thư viện', 'Nhà ga Shibuya'], correct: 0, why: '(Bài 3) デパートのパンうりば = quầy bánh mì của trung tâm thương mại.' },
        { q: 'Ca làm thêm của Kim là:', options: ['Thứ Bảy, Chủ nhật — 9:00 đến 12:00', 'Thứ Bảy, Chủ nhật — 13:00 đến 18:00', 'Thứ Hai đến thứ Sáu — 13:00 đến 18:00', 'Chủ nhật — 13:00 đến 16:00'], correct: 1, why: '(Bài 4) どようびとにちようび、午後1時から6時まで. 9:00–12:00 là giờ học.' },
        { q: 'Tháng sau chuyện gì xảy ra?', options: ['Kim về Hàn Quốc', 'Mẹ Kim sang Nhật, hai mẹ con đi Kyoto', 'Kim chuyển nhà tới Shibuya', 'Kim đi Kyoto một mình'], correct: 1, why: '(Bài 5) 来月、母は日本へ来ます。母ときょうとへ行きます.' },
      ],
    },

    /* ── Phần 4: 聴解 ── */
    { t: 'h', text: 'Phần 4 — ちょうかい (nghe) · 8 câu' },
    {
      t: 'listen',
      id: 'b5-kt-nghe-1',
      title: 'もんだい1 — Thi ở đâu, lúc mấy giờ? (課題理解)',
      note: 'Dạng 課題理解. Nghe 2 lần rồi trả lời: "Lan phải tới phòng nào, lúc mấy giờ bắt đầu thi?". Bẫy: Lan nhắc lại SAI, cô sửa.',
      lines: [
        { who: 'ラン', voice: 'ja-nu', text: '{先生|せんせい}、あしたのしけんは{何時|なんじ}からですか。', ro: 'Sensei, ashita no shiken wa nanji kara desu ka.', vi: 'Thưa cô, bài thi ngày mai bắt đầu từ mấy giờ ạ?' },
        { who: 'やまだ先生', voice: 'ja-nu', text: '{9時半|くじはん}からです。{12時|じゅうにじ}までです。', ro: 'Kuji han kara desu. Jūniji made desu.', vi: 'Từ 9 rưỡi. Đến 12 giờ.' },
        { who: 'ラン', voice: 'ja-nu', text: 'きょうしつは{何|なん}がいですか。', ro: 'Kyōshitsu wa nangai desu ka.', vi: 'Phòng thi ở tầng mấy ạ?' },
        { who: 'やまだ先生', voice: 'ja-nu', text: 'さんがいです。306きょうしつです。', ro: 'Sangai desu. San-zero-roku kyōshitsu desu.', vi: 'Tầng 3. Phòng 306.' },
        { who: 'ラン', voice: 'ja-nu', text: '305きょうしつですね。', ro: 'San-zero-go kyōshitsu desu ne.', vi: 'Phòng 305 nhỉ.' },
        { who: 'やまだ先生', voice: 'ja-nu', text: 'いいえ、305じゃありません。306です。', ro: 'Iie, san-zero-go ja arimasen. San-zero-roku desu.', vi: 'Không, không phải 305. Là 306.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-kt-nghe-1-cau',
      title: 'Câu hỏi もんだい1 (2 câu)',
      items: [
        { q: 'Bài thi bắt đầu lúc mấy giờ?', options: ['9:00', '9:30', '12:00', '3:06'], correct: 1, why: '(Bài 4) 9時半から = 9 rưỡi.' },
        { q: 'Lan phải tới phòng nào?', options: ['Tầng 3, phòng 305', 'Tầng 3, phòng 306', 'Tầng 6, phòng 306', 'Tầng 3, phòng 360'], correct: 1, why: '(Bài 3) さんがい、306きょうしつ — cô đã sửa 305 thành 306.' },
      ],
    },
    {
      t: 'listen',
      id: 'b5-kt-nghe-2',
      title: 'もんだい2 — Mike mua gì, trả bao nhiêu? (ポイント理解)',
      note: 'Dạng ポイント理解. Lan đang làm ca ở cửa hàng tiện lợi, Mike vào mua đồ. Câu hỏi: "Mike trả tất cả bao nhiêu tiền?". Từ mới: **ぜんぶで** = tất cả là, tổng cộng.',
      lines: [
        { who: 'ラン', voice: 'ja-nu', text: 'いらっしゃいませ。あ、マイクさん。', ro: 'Irasshaimase. A, Maiku-san.', vi: 'Kính chào quý khách. A, Mike.' },
        { who: 'マイク', voice: 'ja-nam', text: 'こんばんは。この べんとうは いくらですか。', ro: 'Konbanwa. Kono bentō wa ikura desu ka.', vi: 'Chào Lan. Hộp cơm này bao nhiêu?' },
        { who: 'ラン', voice: 'ja-nu', text: 'ごひゃくごじゅう{円|えん}です。', ro: 'Gohyaku gojū en desu.', vi: '550 yên.' },
        { who: 'マイク', voice: 'ja-nam', text: 'じゃ、これと その おちゃを ください。', ro: 'Ja, kore to sono ocha o kudasai.', vi: 'Vậy cho mình cái này và chai trà đó.' },
        { who: 'ラン', voice: 'ja-nu', text: 'はい。おちゃは ひゃくごじゅう{円|えん}です。ぜんぶで ななひゃく{円|えん}です。', ro: 'Hai. Ocha wa hyaku gojū en desu. Zenbu de nanahyaku en desu.', vi: 'Vâng. Trà 150 yên. Tất cả là 700 yên.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-kt-nghe-2-cau',
      title: 'Câu hỏi もんだい2 (2 câu)',
      items: [
        { q: 'Mike mua gì?', options: ['Cơm hộp và trà', 'Cơm nắm và trà', 'Chỉ cơm hộp', 'Bánh mì và nước'], correct: 0, why: '(Bài 3) このべんとう と そのおちゃ をください.' },
        { q: 'Mike trả tất cả bao nhiêu tiền?', options: ['550 yên', '150 yên', '700 yên', '750 yên'], correct: 2, why: '(Bài 3) 550 + 150 = 700 — ぜんぶでななひゃく円.' },
      ],
    },
    {
      t: 'listen',
      id: 'b5-kt-nghe-3',
      title: 'もんだい3 — Đáp ngay (即時応答)',
      note: 'Dạng 即時応答: nghe một câu, chọn câu đáp tự nhiên nhất. 4 câu, mỗi câu chỉ nghe 2 lần.',
      lines: [
        { who: 'Câu 1', voice: 'ja-nam', text: 'はじめまして。たなかです。', ro: 'Hajimemashite. Tanaka desu.', vi: 'Rất vui được gặp. Tôi là Tanaka.' },
        { who: 'Câu 2', voice: 'ja-nu', text: 'これは だれの ほんですか。', ro: 'Kore wa dare no hon desu ka.', vi: 'Đây là sách của ai?' },
        { who: 'Câu 3', voice: 'ja-nam', text: 'すみません、{今|いま} {何時|なんじ}ですか。', ro: 'Sumimasen, ima nanji desu ka.', vi: 'Xin lỗi, bây giờ mấy giờ?' },
        { who: 'Câu 4', voice: 'ja-nu', text: 'なつやすみに {国|くに}へ かえりますか。', ro: 'Natsuyasumi ni kuni e kaerimasu ka.', vi: 'Nghỉ hè bạn có về nước không?' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-kt-nghe-3-cau',
      title: 'Câu hỏi もんだい3 — chọn câu đáp (4 câu)',
      items: [
        { q: 'Câu 1: はじめまして。たなかです。', options: ['ランです。どうぞ よろしく おねがいします。', 'いいえ、ちがいます。', 'どういたしまして。'], correct: 0, why: '(Bài 1) Đáp lời chào lần đầu: giới thiệu tên + よろしくおねがいします.' },
        { q: 'Câu 2: これは だれの ほんですか。', options: ['にほんごの ほんです。', 'マイクさんのです。', 'せんえんです。'], correct: 1, why: '(Bài 2) だれの → trả lời người: マイクさんのです.' },
        { q: 'Câu 3: すみません、今何時ですか。', options: ['3じ10ぷんです。', 'もくようびです。', '10かいです。'], correct: 0, why: '(Bài 4) Hỏi giờ → trả lời giờ.' },
        { q: 'Câu 4: なつやすみに国へかえりますか。', options: ['はい、そうです。', 'はい、かえります。', 'はい、行きました。'], correct: 1, why: '(Bài 5) Câu hỏi động từ → trả lời lặp lại động từ cùng thì: はい、かえります.' },
      ],
    },

    /* ── Tổng kết ── */
    { t: 'h', text: 'Chấm điểm & ôn lại' },
    {
      t: 'table',
      caption: 'Dưới 70% ở phần / nhóm câu nào → ôn lại bài nào',
      head: ['Nhóm câu bạn sai nhiều', 'Ôn lại', 'Ôn gì trước tiên'],
      rows: [
        ['もんだい1 viết kana (っ, trường âm, katakana ー)', '**Bài 0**', 'Mục âm ngắt っ, trường âm; làm lại bài viết/ghép kana.'],
        ['Câu về は・も・か, quốc tịch ～じん, chào hỏi', '**Bài 1**', 'Ngữ pháp N は N です／じゃありません／か／も; từ vựng nghề & nước.'],
        ['Câu về これ・この・の・だれの', '**Bài 2**', 'Bảng こ・そ・あ・ど (vật) và の sở hữu; だれの ↔ どこの.'],
        ['Câu về ここ・どこ・あちら, giá tiền, số biến âm, 入口・千円', '**Bài 3**', 'Bảng số tới hàng vạn (6 số biến âm), いくら, N をください.'],
        ['Câu về giờ, thứ, ngày, から・まで, 9時・午後', '**Bài 4**', 'Ba bảng: giờ (よじ・しちじ・くじ), phút (ふん／ぷん), ngày (ついたち…はつか).'],
        ['Câu về へ・で・と・に, 4 dạng động từ, 来週・毎日', '**Bài 5**', 'Bảng 4 dạng ます; điểm ⑦ "câu đầy đủ"; bảng có に / không に.'],
        ['Phần nghe (ちょうかい) dưới 6/8', '**Mục Nghe** của Bài 3–5', 'Nghe lại không mở lời thoại; ghi nháp số trước, chữ sau; luôn nghe tới câu sửa cuối cùng.'],
        ['Phần đọc (どっかい) dưới 3/4', '**Mục Bài tập** (bài đọc) của Bài 3–5', 'Đọc lại 3 bài đọc, gạch chân trợ từ へ・で・と・から・まで trước khi trả lời.'],
      ],
    },
    {
      t: 'note',
      title: 'Trước khi sang Bài 6',
      items: [
        'Bài 6 thêm **động từ có tân ngữ** (をたべます, をのみます), **で** chỉ nơi xảy ra hành động và lời rủ **～ませんか／～ましょう** — tất cả xây trên **4 dạng ます** của Bài 5. Chưa chắc 4 dạng này thì ôn lại điểm ① Bài 5 trước.',
        'Gọi 📞 **CuongMini** và tự giới thiệu đủ 6 câu: tên – nước – nghề – trường – giờ học – cách đi học. Nói trôi được là bạn đã xong chặng 1. 🎉',
      ],
    },
  ],
};

export const BAI_5: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, KANJI, NGHE, NOI, BAI_TAP, KIEM_TRA];
