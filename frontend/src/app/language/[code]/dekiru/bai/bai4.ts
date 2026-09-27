/**
 * Bài 4 — 私の国・町 (Đất nước tôi, thành phố tôi) · できる日本語 初級 · JPD113/JPD123.
 *
 * Ngữ pháp: ポイント 24–36 (NはAです／イA-くないです／ナAじゃありません · イA+N／ナAな+N ·
 * N(国・町)は[季節・月]、Aです · とても／少し／あまり～ない · N1(場所)にN2があります ·
 * N(町)はN(国)の東西南北・真ん中です · N1からN2までどのくらいですか · N(乗り物)で · どんなN ·
 * Nはどうですか · そして · ___が、___ · ___ね) + bảng chia tính từ (表 p.282), đếm ～分/～時間.
 * Từ vựng: đủ 72 mục trong danh sách từ mới Bài 4 của cô (sổ tra JPD123), gồm 4 câu mẫu.
 * Hội thoại, câu ví dụ, bài nghe, bài đọc: VIẾT MỚI theo đúng tình huống của sách
 * (xem ../SOAN-BAI.md). Nhân vật リン (nữ, người Việt, quê Đà Nẵng) là nhân vật thêm của khoá,
 * đứng thay cho người học khi nói về Việt Nam.
 */
import type { Lesson } from '@/components/sach-hoc/types';

/* ═══════════════════════════ 1. HỘI THOẠI ═══════════════════════════ */

const HOI_THOAI: Lesson = {
  id: 'b4-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại — Quê bạn ở đâu, là nơi thế nào, thời tiết và món ăn',
  goal: 'Nói được quê mình ở đâu và đi mất bao lâu, quê mình là nơi như thế nào, có gì, thời tiết từng mùa và món ăn — và hỏi lại người khác đúng những điều đó.',
  minutes: 35,
  blocks: [
    { t: 'h', text: 'Học xong bài này bạn làm được gì? (できる)' },
    {
      t: 'table',
      head: ['#', 'Mục tiêu (できる)', 'Câu then chốt'],
      rows: [
        ['1', 'Nói được **quê/nước mình ở đâu** (phía bắc, phía nam, chính giữa…) và **đi từ A đến B mất bao lâu**, bằng phương tiện gì; hỏi lại được người khác.', '～は～の{北|きた}です。・AからBまでどのくらいですか。・{飛行機|ひこうき}で～{時間|じかん}くらいです。'],
        ['2', 'Nói được quê mình **là nơi như thế nào** (to/nhỏ, yên tĩnh/nhộn nhịp, đẹp, nổi tiếng) và **ở đó có gì**; hỏi lại được.', 'どんなところですか。・にぎやかなところです。・{古|ふる}いお{寺|てら}があります。'],
        ['3', 'Nói được **thời tiết theo mùa/tháng** và **món ăn, đồ uống** của quê mình (ngọt, cay, nóng, lạnh…); hỏi được "bên bạn thì sao?".', '{私|わたし}の{国|くに}は8{月|がつ}、とても{暑|あつ}いです。・～はどうですか。・{暑|あつ}いですね。'],
      ],
    },
    {
      t: 'table',
      caption: 'Quê của các nhân vật trong bài (dùng suốt bài — ngữ pháp, bài nghe, bài nói đều quay lại bảng này)',
      head: ['Nhân vật', 'Nước — thành phố', 'Ở đâu', 'Nơi thế nào'],
      rows: [
        ['リン (nữ, người Việt — nhân vật thêm)', 'ベトナム — ダナン (Đà Nẵng)', 'ベトナムの{真|ま}ん{中|なか}', 'きれいな{町|まち} · {海|うみ}と{山|やま}'],
        ['アンナ (nữ)', 'ロシア — モスクワ', 'ロシアの{西|にし}', 'にぎやか · {古|ふる}い{教会|きょうかい} · {冬|ふゆ}とても{寒|さむ}い'],
        ['ダニエル (nam)', 'オーストラリア — パース', 'オーストラリアの{西|にし}', '{大|おお}きくない · {緑|みどり}が{多|おお}い · {静|しず}か'],
        ['パク (nữ)', '{韓国|かんこく} — プサン', '{韓国|かんこく}の{南|みなみ}', '{海|うみ} · 8{月|がつ}{暑|あつ}い · {料理|りょうり}が{辛|から}い'],
        ['ナタポン (nam)', 'タイ — チェンマイ', 'タイの{北|きた}', '{山|やま} · {古|ふる}いお{寺|てら}'],
        ['{西川|にしかわ}{先生|せんせい} (nam)', '{日本|にほん} — {京都|きょうと}', '{東京|とうきょう}の{西|にし}', '{古|ふる}いお{寺|てら}や{神社|じんじゃ} · {有名|ゆうめい}'],
      ],
    },

    /* ── Tình huống 1 ── */
    { t: 'h', text: 'Tình huống 1 — どこ？: Quê bạn ở đâu, đi mất bao lâu' },
    {
      t: 'p',
      text: 'Giờ giải lao, cả lớp đứng trước **bản đồ thế giới** dán trên tường. Marco hỏi Linh — bạn mới từ Việt Nam — nước và thành phố của cô, rồi nhờ chỉ trên bản đồ.',
    },
    {
      t: 'dialogue',
      title: '① Trước bản đồ thế giới',
      lines: [
        { who: 'マルコ', role: 'a', text: 'リンさん、お{国|くに}はどちらですか。', ro: 'Rin-san, okuni wa dochira desu ka.', vi: 'Linh ơi, nước bạn là nước nào?' },
        { who: 'リン', role: 'b', text: 'ベトナムです。', ro: 'Betonamu desu.', vi: 'Việt Nam.' },
        { who: 'マルコ', role: 'a', text: 'ベトナムのどこですか。', ro: 'Betonamu no doko desu ka.', vi: 'Ở đâu của Việt Nam?' },
        { who: 'リン', role: 'b', text: 'ダナンです。', ro: 'Danan desu.', vi: 'Đà Nẵng.' },
        { who: 'マルコ', role: 'a', text: 'ダナン？ダナンはどこですか。', ro: 'Danan? Danan wa doko desu ka.', vi: 'Đà Nẵng? Đà Nẵng ở đâu?' },
        { who: 'リン', role: 'b', text: 'ここです。ダナンはベトナムの{真|ま}ん{中|なか}です。', ro: 'Koko desu. Danan wa Betonamu no mannaka desu.', vi: '(chỉ bản đồ) Đây này. Đà Nẵng ở chính giữa Việt Nam.' },
        { who: 'マルコ', role: 'a', text: 'そうですか。ハノイはベトナムの{北|きた}ですね。', ro: 'Sou desu ka. Hanoi wa Betonamu no kita desu ne.', vi: 'Thế à. Hà Nội ở phía bắc Việt Nam nhỉ.' },
        { who: 'リン', role: 'b', text: 'はい。ホーチミンは{南|みなみ}です。', ro: 'Hai. Hoochimin wa minami desu.', vi: 'Vâng. TP. Hồ Chí Minh ở phía nam.' },
      ],
    },
    {
      t: 'p',
      text: 'Park nghe thấy, hỏi tiếp: từ Tokyo đến Đà Nẵng bay mất bao lâu, và từ Hà Nội vào Đà Nẵng thì đi thế nào.',
    },
    {
      t: 'dialogue',
      title: '② Mất bao lâu?',
      lines: [
        { who: 'パク', role: 'c', text: '{東京|とうきょう}からダナンまでどのくらいですか。', ro: 'Toukyou kara Danan made dono kurai desu ka.', vi: 'Từ Tokyo đến Đà Nẵng mất bao lâu?' },
        { who: 'リン', role: 'b', text: '{飛行機|ひこうき}で5{時間半|じかんはん}くらいです。', ro: 'Hikouki de go-jikan han kurai desu.', vi: 'Đi máy bay khoảng 5 tiếng rưỡi.' },
        { who: 'パク', role: 'c', text: 'そうですか。ハノイからダナンまでどのくらいですか。', ro: 'Sou desu ka. Hanoi kara Danan made dono kurai desu ka.', vi: 'Thế à. Từ Hà Nội đến Đà Nẵng mất bao lâu?' },
        { who: 'リン', role: 'b', text: '{飛行機|ひこうき}で1{時間|じかん}20{分|ぷん}くらいです。{電車|でんしゃ}で16{時間|じかん}くらいです。', ro: 'Hikouki de ichi-jikan nijuppun kurai desu. Densha de juuroku-jikan kurai desu.', vi: 'Máy bay khoảng 1 tiếng 20 phút. Tàu điện (tàu hoả) khoảng 16 tiếng.' },
        { who: 'パク', role: 'c', text: 'へえ、16{時間|じかん}！', ro: 'Hee, juuroku-jikan!', vi: 'Chà, 16 tiếng!' },
        { who: 'リン', role: 'b', text: 'はい。ダナンからホイアンまでは{車|くるま}で45{分|ふん}くらいです。', ro: 'Hai. Danan kara Hoian made wa kuruma de yonjuugo-fun kurai desu.', vi: 'Vâng. Từ Đà Nẵng đến Hội An thì đi ô tô khoảng 45 phút.' },
      ],
    },
    {
      t: 'p',
      text: 'Tan học, Daniel hỏi Kimura nhà cô cách trường bao xa.',
    },
    {
      t: 'dialogue',
      title: '③ Từ nhà đến trường',
      lines: [
        { who: 'ダニエル', role: 'a', text: '{木村|きむら}さん、うちから{学校|がっこう}までどのくらいですか。', ro: 'Kimura-san, uchi kara gakkou made dono kurai desu ka.', vi: 'Kimura ơi, từ nhà bạn đến trường mất bao lâu?' },
        { who: '{木村|きむら}', role: 'b', text: '{電車|でんしゃ}で40{分|ぷん}くらいです。', ro: 'Densha de yonjuppun kurai desu.', vi: 'Đi tàu điện khoảng 40 phút.' },
        { who: 'ダニエル', role: 'a', text: '{駅|えき}から{学校|がっこう}までは？', ro: 'Eki kara gakkou made wa?', vi: 'Còn từ ga đến trường?' },
        { who: '{木村|きむら}', role: 'b', text: '{歩|ある}いて10{分|ぷん}です。ダニエルさんは？', ro: 'Aruite juppun desu. Danieru-san wa?', vi: 'Đi bộ 10 phút. Còn Daniel?' },
        { who: 'ダニエル', role: 'a', text: '{私|わたし}のうちは{学校|がっこう}から{歩|ある}いて5{分|ふん}です。', ro: 'Watashi no uchi wa gakkou kara aruite go-fun desu.', vi: 'Nhà tôi cách trường 5 phút đi bộ.' },
        { who: '{木村|きむら}', role: 'b', text: 'いいですね。', ro: 'Ii desu ne.', vi: 'Thích thế.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'お{国|くに}はどちらですか。——ベトナムです。', ro: 'Okuni wa dochira desu ka. — Betonamu desu.', vi: 'Nước bạn là nước nào? — Việt Nam. (Bài 1)' },
        { en: 'ベトナムのどこですか。——ダナンです。', ro: 'Betonamu no doko desu ka. — Danan desu.', vi: 'Ở đâu của Việt Nam? — Đà Nẵng.' },
        { en: 'ダナンはベトナムの{真|ま}ん{中|なか}です。', ro: 'Danan wa Betonamu no mannaka desu.', vi: 'Đà Nẵng ở chính giữa Việt Nam. (ポイント 29)' },
        { en: '{東京|とうきょう}からダナンまでどのくらいですか。', ro: 'Toukyou kara Danan made dono kurai desu ka.', vi: 'Từ Tokyo đến Đà Nẵng mất bao lâu? (ポイント 30)' },
        { en: '{飛行機|ひこうき}で5{時間半|じかんはん}くらいです。', ro: 'Hikouki de go-jikan han kurai desu.', vi: 'Đi máy bay khoảng 5 tiếng rưỡi. (ポイント 30, 31)' },
        { en: '{駅|えき}から{学校|がっこう}まで{歩|ある}いて10{分|ぷん}です。', ro: 'Eki kara gakkou made aruite juppun desu.', vi: 'Từ ga đến trường đi bộ 10 phút.' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý',
      items: [
        'Hỏi lần lượt từ **to đến nhỏ**: お{国|くに}はどちらですか → ～の**どこ**ですか → ～は**どこ**ですか. Người Nhật hỏi đúng thứ tự này, bạn trả lời cũng theo thứ tự này.',
        '**へえ** (hee) = "chà, ồ" khi nghe điều mới lạ (đã gặp Bài 3). Nói kéo dài, lên giọng.',
        '**～までは？** (made wa?) = "còn (đến) ～ thì sao?" — hỏi tiếp một chặng khác mà không cần nhắc lại cả câu.',
        '{分|ふん} có lúc đọc **ふん**, có lúc **ぷん** (20{分|ぷん} にじゅっぷん, 5{分|ふん} ごふん). Bảng đầy đủ ở phần Ngữ pháp, ポイント 30.',
      ],
    },

    /* ── Tình huống 2 ── */
    { t: 'h', text: 'Tình huống 2 — どんなところ？: Quê bạn là nơi thế nào' },
    {
      t: 'p',
      text: 'Mỗi người mang vài tấm ảnh quê mình đến lớp. Park xem ảnh của Anna và hỏi về Moskva.',
    },
    {
      t: 'dialogue',
      title: '④ Xem ảnh Moskva',
      lines: [
        { who: 'パク', role: 'a', text: 'アンナさんの{町|まち}はどこですか。', ro: 'Anna-san no machi wa doko desu ka.', vi: 'Thành phố của Anna ở đâu?' },
        { who: 'アンナ', role: 'b', text: 'モスクワです。ロシアの{西|にし}です。', ro: 'Mosukuwa desu. Roshia no nishi desu.', vi: 'Moskva. Ở phía tây nước Nga.' },
        { who: 'パク', role: 'a', text: 'モスクワはどんなところですか。', ro: 'Mosukuwa wa donna tokoro desu ka.', vi: 'Moskva là nơi như thế nào?' },
        { who: 'アンナ', role: 'b', text: 'にぎやかなところです。そして、きれいです。', ro: 'Nigiyaka na tokoro desu. Soshite, kirei desu.', vi: 'Là nơi nhộn nhịp. Và (còn) đẹp nữa.' },
        { who: 'パク', role: 'a', text: 'そうですか。モスクワに{何|なに}がありますか。', ro: 'Sou desu ka. Mosukuwa ni nani ga arimasu ka.', vi: 'Thế à. Ở Moskva có gì?' },
        { who: 'アンナ', role: 'b', text: '{古|ふる}い{教会|きょうかい}があります。これです。とても{有名|ゆうめい}です。', ro: 'Furui kyoukai ga arimasu. Kore desu. Totemo yuumei desu.', vi: 'Có nhà thờ cổ. Đây này. Rất nổi tiếng.' },
        { who: 'パク', role: 'a', text: 'わあ、きれいな{教会|きょうかい}ですね。', ro: 'Waa, kirei na kyoukai desu ne.', vi: 'Oa, nhà thờ đẹp nhỉ.' },
      ],
    },
    {
      t: 'p',
      text: 'Wang hỏi Daniel về Perth. Perth không to, nhưng Daniel rất thích nó.',
    },
    {
      t: 'dialogue',
      title: '⑤ Perth — không to nhưng dễ chịu',
      lines: [
        { who: 'ワン', role: 'a', text: 'ダニエルさんのお{国|くに}はオーストラリアですね。オーストラリアのどこですか。', ro: 'Danieru-san no okuni wa Oosutoraria desu ne. Oosutoraria no doko desu ka.', vi: 'Nước của Daniel là Úc nhỉ. Ở đâu của Úc?' },
        { who: 'ダニエル', role: 'b', text: 'パースです。オーストラリアの{西|にし}です。', ro: 'Paasu desu. Oosutoraria no nishi desu.', vi: 'Perth. Ở phía tây nước Úc.' },
        { who: 'ワン', role: 'a', text: 'パースは{大|おお}きい{町|まち}ですか。', ro: 'Paasu wa ookii machi desu ka.', vi: 'Perth là thành phố lớn à?' },
        { who: 'ダニエル', role: 'b', text: 'いいえ、あまり{大|おお}きくないです。{大|おお}きくないですが、いいところです。', ro: 'Iie, amari ookiku nai desu. Ookiku nai desu ga, ii tokoro desu.', vi: 'Không, không lớn lắm. Không lớn nhưng là nơi tốt.' },
        { who: 'ワン', role: 'a', text: 'どんなところですか。', ro: 'Donna tokoro desu ka.', vi: 'Là nơi như thế nào?' },
        { who: 'ダニエル', role: 'b', text: '{静|しず}かなところです。{緑|みどり}が{多|おお}いです。そして、きれいな{川|かわ}があります。', ro: 'Shizuka na tokoro desu. Midori ga ooi desu. Soshite, kirei na kawa ga arimasu.', vi: 'Là nơi yên tĩnh. Nhiều cây xanh. Và có một con sông đẹp.' },
        { who: 'ワン', role: 'a', text: '{人|ひと}は{多|おお}いですか。', ro: 'Hito wa ooi desu ka.', vi: 'Người có đông không?' },
        { who: 'ダニエル', role: 'b', text: 'いいえ、あまり{多|おお}くないです。', ro: 'Iie, amari ooku nai desu.', vi: 'Không, không đông lắm.' },
      ],
    },
    {
      t: 'p',
      text: 'Thầy Nishikawa cho Linh xem ảnh một ngôi chùa ở Kyoto — quê của thầy.',
    },
    {
      t: 'dialogue',
      title: '⑥ Ảnh Kyoto',
      lines: [
        { who: 'リン', role: 'a', text: '{先生|せんせい}、これはどこですか。', ro: 'Sensei, kore wa doko desu ka.', vi: 'Thầy ơi, đây là ở đâu ạ?' },
        { who: '{西川|にしかわ}', role: 'b', text: '{京都|きょうと}です。{私|わたし}の{町|まち}です。これは{古|ふる}いお{寺|てら}です。', ro: 'Kyouto desu. Watashi no machi desu. Kore wa furui otera desu.', vi: 'Kyoto. Thành phố của tôi. Đây là một ngôi chùa cổ.' },
        { who: 'リン', role: 'a', text: 'きれいなお{寺|てら}ですね。', ro: 'Kirei na otera desu ne.', vi: 'Ngôi chùa đẹp quá ạ.' },
        { who: '{西川|にしかわ}', role: 'b', text: 'ええ。{京都|きょうと}に{古|ふる}いお{寺|てら}や{神社|じんじゃ}などがあります。{京都|きょうと}のお{寺|てら}はとても{有名|ゆうめい}です。', ro: 'Ee. Kyouto ni furui otera ya jinja nado ga arimasu. Kyouto no otera wa totemo yuumei desu.', vi: 'Ừ. Ở Kyoto có chùa cổ, đền thờ, v.v. Chùa ở Kyoto rất nổi tiếng.' },
        { who: 'リン', role: 'a', text: '{京都|きょうと}は{東京|とうきょう}の{西|にし}ですか。', ro: 'Kyouto wa Toukyou no nishi desu ka.', vi: 'Kyoto ở phía tây Tokyo ạ?' },
        { who: '{西川|にしかわ}', role: 'b', text: 'はい。{東京|とうきょう}から{新幹線|しんかんせん}で2{時間|じかん}15{分|ふん}くらいです。', ro: 'Hai. Toukyou kara shinkansen de ni-jikan juugo-fun kurai desu.', vi: 'Đúng. Từ Tokyo đi Shinkansen khoảng 2 tiếng 15 phút.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '～はどんなところですか。', ro: '~ wa donna tokoro desu ka.', vi: '～ là nơi như thế nào? (ポイント 32)' },
        { en: 'にぎやかなところです。／{静|しず}かなところです。', ro: 'Nigiyaka na tokoro desu. / Shizuka na tokoro desu.', vi: 'Là nơi nhộn nhịp. / Là nơi yên tĩnh. (ポイント 25)' },
        { en: '{大|おお}きくないですが、いいところです。', ro: 'Ookiku nai desu ga, ii tokoro desu.', vi: 'Không lớn nhưng là nơi tốt. (ポイント 24, 35)' },
        { en: '～に{何|なに}がありますか。——{古|ふる}い{教会|きょうかい}があります。', ro: '~ ni nani ga arimasu ka. — Furui kyoukai ga arimasu.', vi: 'Ở ～ có gì? — Có nhà thờ cổ. (ポイント 28)' },
        { en: 'にぎやかです。そして、きれいです。', ro: 'Nigiyaka desu. Soshite, kirei desu.', vi: 'Nhộn nhịp. Và đẹp nữa. (ポイント 34)' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý',
      items: [
        '**ええ** (ee) = "ừ, vâng" — nghĩa như はい nhưng thân mật hơn một chút. Chỉ cần nghe hiểu; khi thi cứ dùng **はい**.',
        '**わあ** (waa) = "oa" khi thấy thứ đẹp. …**ですね** ở cuối = "…nhỉ, …quá" khi cùng nhìn một thứ (ポイント 36).',
        'Trả lời "không lớn **lắm**" dùng **あまり + phủ định**: あまり{大|おお}きくないです. Không có phủ định thì あまり vô nghĩa (ポイント 27).',
      ],
    },

    /* ── Tình huống 3 ── */
    { t: 'h', text: 'Tình huống 3 — 季節・料理: Thời tiết và món ăn' },
    {
      t: 'p',
      text: 'Tháng 8, lớp học rất nóng. Nataphon vừa vào lớp vừa quạt. Chuyện thời tiết bắt đầu từ một câu cửa miệng: **暑いですね** — "Nóng nhỉ".',
    },
    {
      t: 'dialogue',
      title: '⑦ Nóng nhỉ!',
      lines: [
        { who: 'ナタポン', role: 'a', text: '{暑|あつ}いですね。', ro: 'Atsui desu ne.', vi: 'Nóng nhỉ.' },
        { who: 'アンナ', role: 'b', text: 'そうですね。ナタポンさんの{国|くに}も8{月|がつ}、{暑|あつ}いですか。', ro: 'Sou desu ne. Natapon-san no kuni mo hachi-gatsu, atsui desu ka.', vi: 'Ừ nhỉ. Nước Nataphon tháng 8 cũng nóng à?' },
        { who: 'ナタポン', role: 'a', text: 'はい、とても{暑|あつ}いです。そして、{雨|あめ}が{多|おお}いです。アンナさんの{国|くに}はどうですか。', ro: 'Hai, totemo atsui desu. Soshite, ame ga ooi desu. Anna-san no kuni wa dou desu ka.', vi: 'Vâng, rất nóng. Và mưa nhiều. Nước Anna thì sao?' },
        { who: 'アンナ', role: 'b', text: 'モスクワは8{月|がつ}、あまり{暑|あつ}くないです。{涼|すず}しいです。', ro: 'Mosukuwa wa hachi-gatsu, amari atsuku nai desu. Suzushii desu.', vi: 'Moskva tháng 8 không nóng lắm. Mát mẻ.' },
        { who: 'ナタポン', role: 'a', text: 'いいですね。{冬|ふゆ}は{寒|さむ}いですか。', ro: 'Ii desu ne. Fuyu wa samui desu ka.', vi: 'Thích nhỉ. Mùa đông có lạnh không?' },
        { who: 'アンナ', role: 'b', text: 'はい、とても{寒|さむ}いです。{雪|ゆき}が{多|おお}いです。', ro: 'Hai, totemo samui desu. Yuki ga ooi desu.', vi: 'Có, rất lạnh. Tuyết nhiều.' },
      ],
    },
    {
      t: 'p',
      text: 'Park hỏi Linh người Việt ăn gì vào những ngày trời lạnh.',
    },
    {
      t: 'dialogue',
      title: '⑧ Ngày lạnh ăn gì?',
      lines: [
        { who: 'パク', role: 'a', text: 'リンさん、ベトナムで{寒|さむ}い{日|ひ}に{何|なに}を{食|た}べますか。', ro: 'Rin-san, Betonamu de samui hi ni nani o tabemasu ka.', vi: 'Linh ơi, ở Việt Nam ngày lạnh thì ăn gì?' },
        { who: 'リン', role: 'b', text: 'フォーを{食|た}べます。', ro: 'Foo o tabemasu.', vi: 'Ăn phở.' },
        { who: 'パク', role: 'a', text: 'フォー？「フォー」は{何|なん}ですか。', ro: 'Foo? "Foo" wa nan desu ka.', vi: 'Phở? "Phở" là gì?' },
        { who: 'リン', role: 'b', text: '{牛肉|ぎゅうにく}のスープの{料理|りょうり}です。{温|あたた}かいです。そして、とてもおいしいです。', ro: 'Gyuuniku no suupu no ryouri desu. Atatakai desu. Soshite, totemo oishii desu.', vi: 'Là món nước dùng thịt bò. Nóng ấm. Và rất ngon.' },
        { who: 'パク', role: 'a', text: '{辛|から}いですか。', ro: 'Karai desu ka.', vi: 'Có cay không?' },
        { who: 'リン', role: 'b', text: 'いいえ、あまり{辛|から}くないです。{韓国|かんこく}の{料理|りょうり}はどうですか。', ro: 'Iie, amari karaku nai desu. Kankoku no ryouri wa dou desu ka.', vi: 'Không, không cay lắm. Món Hàn thì sao?' },
        { who: 'パク', role: 'a', text: '{韓国|かんこく}の{料理|りょうり}は{辛|から}いです。キムチはとても{辛|から}いです。', ro: 'Kankoku no ryouri wa karai desu. Kimuchi wa totemo karai desu.', vi: 'Món Hàn cay. Kim chi rất cay.' },
        { who: 'リン', role: 'b', text: 'じゃ、{暑|あつ}い{日|ひ}に{何|なに}を{飲|の}みますか。', ro: 'Ja, atsui hi ni nani o nomimasu ka.', vi: 'Thế ngày nóng thì uống gì?' },
        { who: 'パク', role: 'a', text: '{冷|つめ}たいお{茶|ちゃ}を{飲|の}みます。', ro: 'Tsumetai ocha o nomimasu.', vi: 'Uống trà lạnh.' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{暑|あつ}いですね。——そうですね。', ro: 'Atsui desu ne. — Sou desu ne.', vi: 'Nóng nhỉ. — Ừ nhỉ. (ポイント 36)' },
        { en: '～さんの{国|くに}も8{月|がつ}、{暑|あつ}いですか。', ro: '~-san no kuni mo hachi-gatsu, atsui desu ka.', vi: 'Nước bạn tháng 8 cũng nóng à? (ポイント 26)' },
        { en: 'はい、とても{暑|あつ}いです。／いいえ、あまり{暑|あつ}くないです。', ro: 'Hai, totemo atsui desu. / Iie, amari atsuku nai desu.', vi: 'Vâng, rất nóng. / Không, không nóng lắm. (ポイント 27)' },
        { en: '～さんの{国|くに}はどうですか。', ro: '~-san no kuni wa dou desu ka.', vi: 'Nước bạn thì sao? (ポイント 33)' },
        { en: '{寒|さむ}い{日|ひ}に{何|なに}を{食|た}べますか。', ro: 'Samui hi ni nani o tabemasu ka.', vi: 'Ngày lạnh thì ăn gì? (Nを食べます — Bài 3)' },
        { en: '「フォー」は{何|なん}ですか。——{牛肉|ぎゅうにく}のスープの{料理|りょうり}です。', ro: '"Foo" wa nan desu ka. — Gyuuniku no suupu no ryouri desu.', vi: '"Phở" là gì? — Là món nước dùng thịt bò.' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý: そうですね ≠ そうですか',
      items: [
        '**そうですね** (hạ giọng ở ね) = "ừ nhỉ, đúng thế" — **đồng tình** với điều người kia vừa nói. Đáp lại {暑|あつ}いですね.',
        '**そうですか** (Bài 1) = "thế à" — nhận một **thông tin mới**. Nghe "Moskva tháng 8 mát" → そうですか.',
        'Nói về trời nóng/lạnh dùng **{暑|あつ}い／{寒|さむ}い**; về đồ ăn uống nóng/lạnh dùng **{熱|あつ}い／{冷|つめ}たい**. Xem bảng ở phần Từ vựng nhóm 8.',
      ],
    },

    /* ── できる ── */
    { t: 'h', text: 'できる！— Giới thiệu quê mình với bạn cùng lớp' },
    {
      t: 'p',
      text: 'Mang 2–3 tấm ảnh quê bạn. Theo cặp: một người hỏi theo 5 câu khung dưới đây, người kia trả lời, rồi đổi vai. Đoạn mẫu: Daniel hỏi, Linh kể về Đà Nẵng.',
    },
    {
      t: 'dialogue',
      title: '⑨ Kể về Đà Nẵng',
      lines: [
        { who: 'ダニエル', role: 'a', text: 'リンさんの{町|まち}はどんなところですか。', ro: 'Rin-san no machi wa donna tokoro desu ka.', vi: 'Thành phố của Linh là nơi thế nào?' },
        { who: 'リン', role: 'b', text: 'ダナンはあまり{大|おお}きくないですが、きれいな{町|まち}です。', ro: 'Danan wa amari ookiku nai desu ga, kirei na machi desu.', vi: 'Đà Nẵng không lớn lắm nhưng là thành phố đẹp.' },
        { who: 'ダニエル', role: 'a', text: 'ダナンに{何|なに}がありますか。', ro: 'Danan ni nani ga arimasu ka.', vi: 'Ở Đà Nẵng có gì?' },
        { who: 'リン', role: 'b', text: '{海|うみ}と{山|やま}があります。{新|あたら}しいビルも{多|おお}いです。', ro: 'Umi to yama ga arimasu. Atarashii biru mo ooi desu.', vi: 'Có biển và núi. Toà nhà mới cũng nhiều.' },
        { who: 'ダニエル', role: 'a', text: '{天気|てんき}はどうですか。', ro: 'Tenki wa dou desu ka.', vi: 'Thời tiết thế nào?' },
        { who: 'リン', role: 'b', text: '{夏|なつ}はとても{暑|あつ}いです。10{月|がつ}と11{月|がつ}は{雨|あめ}が{多|おお}いです。', ro: 'Natsu wa totemo atsui desu. Juu-gatsu to juuichi-gatsu wa ame ga ooi desu.', vi: 'Mùa hè rất nóng. Tháng 10 và tháng 11 mưa nhiều.' },
        { who: 'ダニエル', role: 'a', text: '{何|なに}がおいしいですか。', ro: 'Nani ga oishii desu ka.', vi: 'Món gì ngon?' },
        { who: 'リン', role: 'b', text: 'ミークアンがおいしいです。{少|すこ}し{辛|から}いです。', ro: 'Miikuan ga oishii desu. Sukoshi karai desu.', vi: 'Mì Quảng ngon. Hơi cay một chút.' },
        { who: 'ダニエル', role: 'a', text: 'へえ、いいですね。', ro: 'Hee, ii desu ne.', vi: 'Chà, hay quá nhỉ.' },
      ],
    },
    {
      t: 'table',
      caption: '5 câu khung để hỏi về quê của bạn cùng lớp',
      head: ['Câu hỏi', 'Romaji', 'Nghĩa', 'Trả lời bằng'],
      rows: [
        ['お{国|くに}はどちらですか。', 'Okuni wa dochira desu ka.', 'Nước bạn là nước nào?', '～です。～の{北|きた}です。'],
        ['どんなところですか。', 'Donna tokoro desu ka.', 'Là nơi như thế nào?', 'にぎやかなところです。'],
        ['{何|なに}がありますか。', 'Nani ga arimasu ka.', 'Ở đó có gì?', '～があります。'],
        ['{何|なに}がおいしいですか。', 'Nani ga oishii desu ka.', 'Món gì ngon?', '～がおいしいです。'],
        ['{天気|てんき}はどうですか。', 'Tenki wa dou desu ka.', 'Thời tiết thế nào?', '{夏|なつ}はとても{暑|あつ}いです。'],
      ],
    },

    { t: 'h', text: 'Đọc – nói: 私の町 (Thành phố của tôi)' },
    {
      t: 'p',
      text: 'Bài viết mẫu của Linh giới thiệu Đà Nẵng. Đọc to từng câu, rồi thay tên thành phố, vị trí, thời tiết, món ăn để nói về **quê của bạn** — đây cũng là khung cho bài nói "giới thiệu quê tôi" ở phần Luyện nói.',
    },
    {
      t: 'examples',
      items: [
        { en: '{私|わたし}はベトナムのダナンから{来|き}ました。', ro: 'Watashi wa Betonamu no Danan kara kimashita.', vi: 'Tôi đến từ Đà Nẵng, Việt Nam. (～から来ました: câu cố định, học như một khối)' },
        { en: 'ダナンはベトナムの{真|ま}ん{中|なか}です。ハノイから{飛行機|ひこうき}で1{時間|じかん}20{分|ぷん}くらいです。', ro: 'Danan wa Betonamu no mannaka desu. Hanoi kara hikouki de ichi-jikan nijuppun kurai desu.', vi: 'Đà Nẵng ở chính giữa Việt Nam. Từ Hà Nội đi máy bay khoảng 1 tiếng 20 phút.' },
        { en: 'ダナンはあまり{大|おお}きくないですが、きれいな{町|まち}です。', ro: 'Danan wa amari ookiku nai desu ga, kirei na machi desu.', vi: 'Đà Nẵng không lớn lắm nhưng là một thành phố đẹp.' },
        { en: '{海|うみ}と{山|やま}があります。{海|うみ}はとてもきれいです。', ro: 'Umi to yama ga arimasu. Umi wa totemo kirei desu.', vi: 'Có biển và núi. Biển rất đẹp.' },
        { en: '{夏|なつ}はとても{暑|あつ}いです。そして、10{月|がつ}と11{月|がつ}は{雨|あめ}が{多|おお}いです。', ro: 'Natsu wa totemo atsui desu. Soshite, juu-gatsu to juuichi-gatsu wa ame ga ooi desu.', vi: 'Mùa hè rất nóng. Và tháng 10, tháng 11 mưa nhiều.' },
        { en: 'ミークアンは{有名|ゆうめい}な{料理|りょうり}です。{少|すこ}し{辛|から}いですが、とてもおいしいです。', ro: 'Miikuan wa yuumei na ryouri desu. Sukoshi karai desu ga, totemo oishii desu.', vi: 'Mì Quảng là món nổi tiếng. Hơi cay nhưng rất ngon.' },
        { en: 'ダナンはいいところです。', ro: 'Danan wa ii tokoro desu.', vi: 'Đà Nẵng là một nơi tuyệt.' },
      ],
    },
  ],
};

/* ═══════════════════════════ 2. TỪ VỰNG ═══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b4-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng — 72 mục của danh sách Bài 4',
  goal: 'Thuộc đủ 72 mục trong danh sách từ mới Bài 4 của cô (68 từ + 4 câu mẫu), mỗi từ nói được trong một câu về quê mình, thời tiết hoặc món ăn.',
  minutes: 45,
  blocks: [
    {
      t: 'p',
      text: 'Đủ **72 mục** theo đúng danh sách cô phát (sổ tra JPD123, Bài 4 — gồm 68 từ và 4 câu mẫu), chia thành 9 nhóm. Câu ví dụ chỉ dùng từ của Bài 1–4. Bài này có **25 tính từ** — học mỗi tính từ kèm **dạng phủ định** ngay từ đầu (cột ví dụ nhiều chỗ cố ý dùng dạng ～くないです／～じゃありません).',
    },
    {
      t: 'note',
      title: 'Cách đọc romaji trong khoá',
      items: [
        'Trường âm viết đúng theo chữ kana: おおきい → **ookii**, ゆうめい → **yuumei**, きょうかい → **kyoukai**, いちねんじゅう → **ichinenjuu**.',
        'Âm ngắt っ viết đôi phụ âm: すっぱい → **suppai**, いっぷん → **ippun**.',
        'Tính từ đuôi な ghi kèm （な） trong danh sách: きれい（な）. Chữ な **chỉ xuất hiện khi đứng trước danh từ**: きれい**な**{町|まち}.',
      ],
    },

    { t: 'h', text: '1. Phương hướng, vị trí (ポイント 29)' },
    {
      t: 'vocab',
      items: [
        { w: '{北|きた}', pos: 'danh từ', ipa: 'kita', vi: 'Phía bắc', ex: 'ハノイはベトナムの{北|きた}です。', exRo: 'Hanoi wa Betonamu no kita desu.', exVi: 'Hà Nội ở phía bắc Việt Nam.' },
        { w: '{南|みなみ}', pos: 'danh từ', ipa: 'minami', vi: 'Phía nam', ex: 'ホーチミンはベトナムの{南|みなみ}です。', exRo: 'Hoochimin wa Betonamu no minami desu.', exVi: 'TP. Hồ Chí Minh ở phía nam Việt Nam.' },
        { w: '{東|ひがし}', pos: 'danh từ', ipa: 'higashi', vi: 'Phía đông', ex: 'シャンハイは{中国|ちゅうごく}の{東|ひがし}です。', exRo: 'Shanhai wa Chuugoku no higashi desu.', exVi: 'Thượng Hải ở phía đông Trung Quốc.' },
        { w: '{西|にし}', pos: 'danh từ', ipa: 'nishi', vi: 'Phía tây', ex: 'パースはオーストラリアの{西|にし}です。', exRo: 'Paasu wa Oosutoraria no nishi desu.', exVi: 'Perth ở phía tây nước Úc.' },
        { w: '{真|ま}ん{中|なか}', pos: 'danh từ', ipa: 'mannaka', vi: 'Chính giữa', ex: 'ダナンはベトナムの{真|ま}ん{中|なか}です。', exRo: 'Danan wa Betonamu no mannaka desu.', exVi: 'Đà Nẵng ở chính giữa Việt Nam.' },
      ],
    },

    { t: 'h', text: '2. Phương tiện, nhà ga, thành phố (ポイント 31)' },
    {
      t: 'vocab',
      items: [
        { w: '{車|くるま}', pos: 'danh từ', ipa: 'kuruma', vi: 'Ô tô', ex: 'ダナンからホイアンまで{車|くるま}で45{分|ふん}くらいです。', exRo: 'Danan kara Hoian made kuruma de yonjuugo-fun kurai desu.', exVi: 'Từ Đà Nẵng đến Hội An đi ô tô khoảng 45 phút.' },
        { w: '{新幹線|しんかんせん}', pos: 'danh từ', ipa: 'shinkansen', vi: 'Tàu cao tốc Shinkansen', ex: '{東京|とうきょう}から{京都|きょうと}まで{新幹線|しんかんせん}で2{時間|じかん}くらいです。', exRo: 'Toukyou kara Kyouto made shinkansen de ni-jikan kurai desu.', exVi: 'Từ Tokyo đến Kyoto đi Shinkansen khoảng 2 tiếng.' },
        { w: '{電車|でんしゃ}', pos: 'danh từ', ipa: 'densha', vi: 'Tàu điện', ex: 'うちから{学校|がっこう}まで{電車|でんしゃ}で30{分|ぷん}です。', exRo: 'Uchi kara gakkou made densha de sanjuppun desu.', exVi: 'Từ nhà đến trường đi tàu điện 30 phút.' },
        { w: '{飛行機|ひこうき}', pos: 'danh từ', ipa: 'hikouki', vi: 'Máy bay', ex: 'ハノイから{東京|とうきょう}まで{飛行機|ひこうき}で5{時間|じかん}くらいです。', exRo: 'Hanoi kara Toukyou made hikouki de go-jikan kurai desu.', exVi: 'Từ Hà Nội đến Tokyo đi máy bay khoảng 5 tiếng.' },
        { w: '{駅|えき}', pos: 'danh từ', ipa: 'eki', vi: 'Nhà ga', ex: 'うちから{駅|えき}まで{歩|ある}いて5{分|ふん}です。', exRo: 'Uchi kara eki made aruite go-fun desu.', exVi: 'Từ nhà đến ga đi bộ 5 phút.' },
        { w: '{町|まち}', pos: 'danh từ', ipa: 'machi', vi: 'Thành phố, thị trấn (nơi mình sống)', ex: '{私|わたし}の{町|まち}はにぎやかです。', exRo: 'Watashi no machi wa nigiyaka desu.', exVi: 'Thành phố của tôi nhộn nhịp.' },
      ],
    },

    { t: 'h', text: '3. Thời gian đi đường & "bao lâu" (ポイント 30)' },
    {
      t: 'vocab',
      items: [
        { w: '～{時間|じかん}', pos: 'hậu tố (khoảng thời gian)', ipa: '~jikan', vi: '～ tiếng (đồng hồ) — khác ～{時|じ} là "～ giờ" (Bài 3)', ex: '{東京|とうきょう}からダナンまで{飛行機|ひこうき}で6{時間|じかん}くらいです。', exRo: 'Toukyou kara Danan made hikouki de roku-jikan kurai desu.', exVi: 'Từ Tokyo đến Đà Nẵng đi máy bay khoảng 6 tiếng.' },
        { w: '～{時間半|じかんはん}', pos: 'hậu tố', ipa: '~jikan han', vi: '～ tiếng rưỡi', ex: 'ハノイからハロンまで{車|くるま}で2{時間半|じかんはん}くらいです。', exRo: 'Hanoi kara Haron made kuruma de ni-jikan han kurai desu.', exVi: 'Từ Hà Nội đến Hạ Long đi ô tô khoảng 2 tiếng rưỡi.' },
        { w: '～{分|ふん}', pos: 'hậu tố', ipa: '~fun / ~pun', vi: '～ phút (1 いっぷん, 3 さんぷん, 10 じゅっぷん…)', ex: '{駅|えき}から{学校|がっこう}まで{歩|ある}いて10{分|ぷん}です。', exRo: 'Eki kara gakkou made aruite juppun desu.', exVi: 'Từ ga đến trường đi bộ 10 phút.' },
        { w: 'うちから{学校|がっこう}まで20{分|ぷん}です。', pos: 'câu mẫu', ipa: 'Uchi kara gakkou made nijuppun desu.', vi: 'Từ nhà đến trường mất 20 phút.', ex: 'A：うちから{学校|がっこう}までどのくらいですか。 B：20{分|ぷん}です。', exRo: 'A: Uchi kara gakkou made dono kurai desu ka. B: Nijuppun desu.', exVi: 'A: Từ nhà đến trường mất bao lâu? B: 20 phút.' },
        { w: '{歩|ある}いて', pos: 'cụm (cách đi)', ipa: 'aruite', vi: 'Đi bộ (KHÔNG thêm で)', ex: 'うちから{学校|がっこう}まで{歩|ある}いて15{分|ふん}です。', exRo: 'Uchi kara gakkou made aruite juugo-fun desu.', exVi: 'Từ nhà đến trường đi bộ 15 phút.' },
        { w: '～くらい', pos: 'trợ từ (ước lượng)', ipa: '~kurai', vi: 'Khoảng ～ (cũng nói ～ぐらい)', ex: '{電車|でんしゃ}で1{時間|じかん}くらいです。', exRo: 'Densha de ichi-jikan kurai desu.', exVi: 'Đi tàu điện khoảng 1 tiếng.' },
        { w: 'どのくらい', pos: 'từ để hỏi', ipa: 'dono kurai', vi: 'Bao lâu (hỏi thời gian đi đường)', ex: 'ハノイからダナンまでどのくらいですか。', exRo: 'Hanoi kara Danan made dono kurai desu ka.', exVi: 'Từ Hà Nội đến Đà Nẵng mất bao lâu?' },
      ],
    },

    { t: 'h', text: '4. Cảnh vật, công trình, "có" (ポイント 28)' },
    {
      t: 'vocab',
      items: [
        { w: '{温泉|おんせん}', pos: 'danh từ', ipa: 'onsen', vi: 'Suối nước nóng', ex: '{私|わたし}の{町|まち}に{温泉|おんせん}があります。', exRo: 'Watashi no machi ni onsen ga arimasu.', exVi: 'Ở thành phố tôi có suối nước nóng.' },
        { w: '{川|かわ}', pos: 'danh từ', ipa: 'kawa', vi: 'Sông', ex: 'ハノイに{大|おお}きい{川|かわ}があります。', exRo: 'Hanoi ni ookii kawa ga arimasu.', exVi: 'Ở Hà Nội có một con sông lớn.' },
        { w: '{山|やま}', pos: 'danh từ', ipa: 'yama', vi: 'Núi', ex: 'チェンマイは{山|やま}が{多|おお}いです。', exRo: 'Chenmai wa yama ga ooi desu.', exVi: 'Chiang Mai có nhiều núi.' },
        { w: '{教会|きょうかい}', pos: 'danh từ', ipa: 'kyoukai', vi: 'Nhà thờ', ex: 'ホーチミンに{古|ふる}い{教会|きょうかい}があります。', exRo: 'Hoochimin ni furui kyoukai ga arimasu.', exVi: 'Ở TP. Hồ Chí Minh có nhà thờ cổ.' },
        { w: '（お）{城|しろ}', pos: 'danh từ', ipa: '(o)shiro', vi: 'Lâu đài, thành (thành cổ)', ex: 'フエに{古|ふる}いお{城|しろ}があります。', exRo: 'Fue ni furui oshiro ga arimasu.', exVi: 'Ở Huế có thành cổ.' },
        { w: '{神社|じんじゃ}', pos: 'danh từ', ipa: 'jinja', vi: 'Đền (đền thờ Thần đạo của Nhật)', ex: '{京都|きょうと}に{有名|ゆうめい}な{神社|じんじゃ}があります。', exRo: 'Kyouto ni yuumei na jinja ga arimasu.', exVi: 'Ở Kyoto có ngôi đền nổi tiếng.' },
        { w: '（お）{寺|てら}', pos: 'danh từ', ipa: '(o)tera', vi: 'Chùa', ex: 'このお{寺|てら}はとても{古|ふる}いです。', exRo: 'Kono otera wa totemo furui desu.', exVi: 'Ngôi chùa này rất cổ.' },
        { w: 'ビル', pos: 'danh từ', ipa: 'biru', vi: 'Toà nhà (cao tầng)', ex: 'ホーチミンは{新|あたら}しいビルが{多|おお}いです。', exRo: 'Hoochimin wa atarashii biru ga ooi desu.', exVi: 'TP. Hồ Chí Minh có nhiều toà nhà mới.' },
        { w: 'ところ', pos: 'danh từ', ipa: 'tokoro', vi: 'Nơi, chỗ', ex: 'ダナンはいいところです。', exRo: 'Danan wa ii tokoro desu.', exVi: 'Đà Nẵng là nơi tốt (nơi tuyệt vời).' },
        { w: '{人|ひと}', pos: 'danh từ', ipa: 'hito', vi: 'Người (đứng một mình; khác ～{人|じん} "người nước ～")', ex: 'ハノイは{人|ひと}が{多|おお}いです。', exRo: 'Hanoi wa hito ga ooi desu.', exVi: 'Hà Nội đông người.' },
        { w: '{緑|みどり}', pos: 'danh từ', ipa: 'midori', vi: 'Màu xanh lá; cây xanh', ex: 'パースは{緑|みどり}が{多|おお}いです。', exRo: 'Paasu wa midori ga ooi desu.', exVi: 'Perth nhiều cây xanh.' },
        { w: 'あります［ある］1', pos: 'động từ nhóm 1', ipa: 'arimasu [aru]', vi: 'Có (đồ vật, nơi chốn); phủ định: ありません', ex: '{私|わたし}の{町|まち}に{海|うみ}があります。{山|やま}はありません。', exRo: 'Watashi no machi ni umi ga arimasu. Yama wa arimasen.', exVi: 'Thành phố tôi có biển. Núi thì không có.' },
        { w: '{箱根|はこね}に{温泉|おんせん}があります。', pos: 'câu mẫu', ipa: 'Hakone ni onsen ga arimasu.', vi: 'Ở Hakone có suối nước nóng.', ex: 'A：{箱根|はこね}に{何|なに}がありますか。 B：{温泉|おんせん}があります。', exRo: 'A: Hakone ni nani ga arimasu ka. B: Onsen ga arimasu.', exVi: 'A: Ở Hakone có gì? B: Có suối nước nóng.' },
      ],
    },

    { t: 'h', text: '5. Tính từ đuôi い: miêu tả nơi chốn (ポイント 24, 25)' },
    {
      t: 'vocab',
      items: [
        { w: '{新|あたら}しい', pos: 'tính từ い', ipa: 'atarashii', vi: 'Mới', ex: 'この{駅|えき}は{新|あたら}しいです。', exRo: 'Kono eki wa atarashii desu.', exVi: 'Nhà ga này mới.' },
        { w: '{古|ふる}い', pos: 'tính từ い', ipa: 'furui', vi: 'Cũ, cổ', ex: 'ホイアンは{古|ふる}い{町|まち}です。', exRo: 'Hoian wa furui machi desu.', exVi: 'Hội An là một phố cổ.' },
        { w: 'いい', pos: 'tính từ い (bất quy tắc)', ipa: 'ii', vi: 'Tốt, hay, đẹp (phủ định: よくないです)', ex: 'ここはいいところです。{天気|てんき}はよくないです。', exRo: 'Koko wa ii tokoro desu. Tenki wa yoku nai desu.', exVi: 'Đây là nơi tốt. Thời tiết thì không tốt.' },
        { w: '（～が）{多|おお}い', pos: 'tính từ い', ipa: '(~ga) ooi', vi: 'Nhiều ～ (dùng: N が 多いです)', ex: 'ハノイはバイクが{多|おお}いです。', exRo: 'Hanoi wa baiku ga ooi desu.', exVi: 'Hà Nội nhiều xe máy.' },
        { w: '（～が）{少|すく}ない', pos: 'tính từ い', ipa: '(~ga) sukunai', vi: 'Ít ～', ex: '{私|わたし}の{町|まち}は{人|ひと}が{少|すく}ないです。', exRo: 'Watashi no machi wa hito ga sukunai desu.', exVi: 'Thành phố tôi ít người.' },
        { w: '{大|おお}きい', pos: 'tính từ い', ipa: 'ookii', vi: 'To, lớn', ex: 'ホーチミンは{大|おお}きい{町|まち}です。', exRo: 'Hoochimin wa ookii machi desu.', exVi: 'TP. Hồ Chí Minh là thành phố lớn.' },
        { w: '{小|ちい}さい', pos: 'tính từ い', ipa: 'chiisai', vi: 'Nhỏ, bé', ex: '{私|わたし}の{町|まち}は{小|ちい}さいです。', exRo: 'Watashi no machi wa chiisai desu.', exVi: 'Thị trấn của tôi nhỏ.' },
        { w: '{高|たか}い', pos: 'tính từ い', ipa: 'takai', vi: 'Cao; đắt', ex: 'この{山|やま}は{高|たか}いです。このカメラも{高|たか}いです。', exRo: 'Kono yama wa takai desu. Kono kamera mo takai desu.', exVi: 'Ngọn núi này cao. Cái máy ảnh này cũng đắt.' },
        { w: '{富士山|ふじさん}は{高|たか}いです。', pos: 'câu mẫu', ipa: 'Fujisan wa takai desu.', vi: 'Núi Phú Sĩ cao.', ex: 'A：{富士山|ふじさん}は{高|たか}いですか。 B：はい、とても{高|たか}いです。', exRo: 'A: Fujisan wa takai desu ka. B: Hai, totemo takai desu.', exVi: 'A: Núi Phú Sĩ có cao không? B: Có, rất cao.' },
        { w: '{低|ひく}い', pos: 'tính từ い', ipa: 'hikui', vi: 'Thấp (KHÔNG dùng cho giá — "rẻ" là từ khác)', ex: 'この{山|やま}は{低|ひく}いですが、きれいです。', exRo: 'Kono yama wa hikui desu ga, kirei desu.', exVi: 'Ngọn núi này thấp nhưng đẹp.' },
      ],
    },

    { t: 'h', text: '6. Tính từ đuôi な, từ hỏi và từ nối (ポイント 24, 25, 32, 34)' },
    {
      t: 'vocab',
      items: [
        { w: 'きれい（な）', pos: 'tính từ な', ipa: 'kirei (na)', vi: 'Đẹp, sạch sẽ (đuôi い nhưng là tính từ な!)', ex: 'ダナンはきれいな{町|まち}です。{川|かわ}はきれいじゃありません。', exRo: 'Danan wa kirei na machi desu. Kawa wa kirei ja arimasen.', exVi: 'Đà Nẵng là thành phố đẹp. Sông thì không sạch.' },
        { w: '{静|しず}か（な）', pos: 'tính từ な', ipa: 'shizuka (na)', vi: 'Yên tĩnh', ex: 'パースは{静|しず}かなところです。', exRo: 'Paasu wa shizuka na tokoro desu.', exVi: 'Perth là nơi yên tĩnh.' },
        { w: 'にぎやか（な）', pos: 'tính từ な', ipa: 'nigiyaka (na)', vi: 'Náo nhiệt, nhộn nhịp', ex: 'ハノイはにぎやかです。{静|しず}かじゃありません。', exRo: 'Hanoi wa nigiyaka desu. Shizuka ja arimasen.', exVi: 'Hà Nội nhộn nhịp. Không yên tĩnh.' },
        { w: '{有名|ゆうめい}（な）', pos: 'tính từ な', ipa: 'yuumei (na)', vi: 'Nổi tiếng (đuôi い nhưng là tính từ な!)', ex: 'フォーは{有名|ゆうめい}なベトナムの{料理|りょうり}です。', exRo: 'Foo wa yuumei na Betonamu no ryouri desu.', exVi: 'Phở là món ăn Việt Nam nổi tiếng.' },
        { w: 'どんな', pos: 'từ để hỏi (+ danh từ)', ipa: 'donna', vi: '～ như thế nào (luôn đi với danh từ: どんなところ)', ex: 'ハノイはどんなところですか。', exRo: 'Hanoi wa donna tokoro desu ka.', exVi: 'Hà Nội là nơi như thế nào?' },
        { w: 'そして', pos: 'từ nối (đầu câu)', ipa: 'soshite', vi: 'Và, thêm nữa (nối hai CÂU)', ex: 'ダナンはきれいです。そして、{静|しず}かです。', exRo: 'Danan wa kirei desu. Soshite, shizuka desu.', exVi: 'Đà Nẵng đẹp. Và yên tĩnh.' },
      ],
    },

    { t: 'h', text: '7. Thời tiết, mùa (ポイント 26)' },
    {
      t: 'vocab',
      items: [
        { w: '{雨|あめ}', pos: 'danh từ', ipa: 'ame', vi: 'Mưa', ex: 'フエは11{月|がつ}、{雨|あめ}が{多|おお}いです。', exRo: 'Fue wa juuichi-gatsu, ame ga ooi desu.', exVi: 'Huế tháng 11 mưa nhiều.' },
        { w: '{雪|ゆき}', pos: 'danh từ', ipa: 'yuki', vi: 'Tuyết', ex: 'ベトナムは{雪|ゆき}が{少|すく}ないです。', exRo: 'Betonamu wa yuki ga sukunai desu.', exVi: 'Việt Nam ít tuyết.' },
        { w: '{日|ひ}', pos: 'danh từ', ipa: 'hi', vi: 'Ngày; mặt trời (trong bài: {暑|あつ}い{日|ひ} = ngày nóng)', ex: '{暑|あつ}い{日|ひ}に{冷|つめ}たいお{茶|ちゃ}を{飲|の}みます。', exRo: 'Atsui hi ni tsumetai ocha o nomimasu.', exVi: 'Ngày nóng tôi uống trà lạnh.' },
        { w: '{暖|あたた}かい', pos: 'tính từ い', ipa: 'atatakai', vi: 'Ấm áp (thời tiết, không khí)', ex: 'ハノイは{春|はる}、{暖|あたた}かいです。', exRo: 'Hanoi wa haru, atatakai desu.', exVi: 'Hà Nội mùa xuân ấm áp.' },
        { w: '{涼|すず}しい', pos: 'tính từ い', ipa: 'suzushii', vi: 'Mát mẻ (thời tiết)', ex: 'ハノイは{秋|あき}、{涼|すず}しいです。', exRo: 'Hanoi wa aki, suzushii desu.', exVi: 'Hà Nội mùa thu mát mẻ.' },
        { w: '{暑|あつ}い', pos: 'tính từ い', ipa: 'atsui', vi: 'Nóng bức (thời tiết)', ex: 'ホーチミンは{一年中|いちねんじゅう}{暑|あつ}いです。', exRo: 'Hoochimin wa ichinenjuu atsui desu.', exVi: 'TP. Hồ Chí Minh nóng quanh năm.' },
        { w: '{寒|さむ}い', pos: 'tính từ い', ipa: 'samui', vi: 'Lạnh, rét (thời tiết)', ex: 'ハノイは1{月|がつ}、{少|すこ}し{寒|さむ}いです。', exRo: 'Hanoi wa ichi-gatsu, sukoshi samui desu.', exVi: 'Hà Nội tháng 1 hơi lạnh.' },
        { w: '{天気|てんき}がいい', pos: 'cụm (thời tiết)', ipa: 'tenki ga ii', vi: 'Thời tiết đẹp', ex: 'パースは{一年中|いちねんじゅう}{天気|てんき}がいいです。', exRo: 'Paasu wa ichinenjuu tenki ga ii desu.', exVi: 'Perth quanh năm thời tiết đẹp.' },
        { w: '{天気|てんき}がわるい', pos: 'cụm (thời tiết)', ipa: 'tenki ga warui', vi: 'Thời tiết xấu (sách viết {悪|わる}い)', ex: 'フエは11{月|がつ}、{天気|てんき}がわるいです。{雨|あめ}が{多|おお}いです。', exRo: 'Fue wa juuichi-gatsu, tenki ga warui desu. Ame ga ooi desu.', exVi: 'Huế tháng 11 thời tiết xấu. Mưa nhiều.' },
      ],
    },

    { t: 'h', text: '8. Đồ ăn uống: nóng lạnh & mùi vị' },
    {
      t: 'vocab',
      items: [
        { w: 'メロン', pos: 'danh từ', ipa: 'meron', vi: 'Dưa lưới (dưa vàng Nhật)', ex: '{北海道|ほっかいどう}のメロンはとても{甘|あま}いです。', exRo: 'Hokkaidou no meron wa totemo amai desu.', exVi: 'Dưa lưới Hokkaido rất ngọt.' },
        { w: '{温|あたた}かい', pos: 'tính từ い', ipa: 'atatakai', vi: 'Ấm (đồ ăn, đồ uống, cảm giác)', ex: '{寒|さむ}い{日|ひ}に{温|あたた}かいスープを{飲|の}みます。', exRo: 'Samui hi ni atatakai suupu o nomimasu.', exVi: 'Ngày lạnh tôi uống súp ấm.' },
        { w: '{熱|あつ}い', pos: 'tính từ い', ipa: 'atsui', vi: 'Nóng (đồ vật, đồ ăn uống)', ex: 'このコーヒーは{熱|あつ}いです。', exRo: 'Kono koohii wa atsui desu.', exVi: 'Cà phê này nóng.' },
        { w: '{冷|つめ}たい', pos: 'tính từ い', ipa: 'tsumetai', vi: 'Lạnh, mát (đồ ăn uống, cảm giác chạm vào)', ex: '{冷|つめ}たいビールはおいしいです。', exRo: 'Tsumetai biiru wa oishii desu.', exVi: 'Bia lạnh thì ngon.' },
        { w: 'おいしい', pos: 'tính từ い', ipa: 'oishii', vi: 'Ngon', ex: '{日本|にほん}の{料理|りょうり}はおいしいです。', exRo: 'Nihon no ryouri wa oishii desu.', exVi: 'Đồ ăn Nhật ngon.' },
        { w: '{甘|あま}い', pos: 'tính từ い', ipa: 'amai', vi: 'Ngọt', ex: 'このケーキはあまり{甘|あま}くないです。', exRo: 'Kono keeki wa amari amaku nai desu.', exVi: 'Cái bánh này không ngọt lắm.' },
        { w: '{辛|から}い', pos: 'tính từ い', ipa: 'karai', vi: 'Cay', ex: '{韓国|かんこく}の{料理|りょうり}は{辛|から}いです。', exRo: 'Kankoku no ryouri wa karai desu.', exVi: 'Món Hàn cay.' },
        { w: '{苦|にが}い', pos: 'tính từ い', ipa: 'nigai', vi: 'Đắng', ex: 'ベトナムのコーヒーは{少|すこ}し{苦|にが}いです。', exRo: 'Betonamu no koohii wa sukoshi nigai desu.', exVi: 'Cà phê Việt Nam hơi đắng.' },
        { w: 'すっぱい', pos: 'tính từ い', ipa: 'suppai', vi: 'Chua', ex: 'このスープは{少|すこ}しすっぱいです。', exRo: 'Kono suupu wa sukoshi suppai desu.', exVi: 'Món canh này hơi chua.' },
      ],
    },

    { t: 'h', text: '9. Mức độ & câu giao tiếp (ポイント 26, 27, 33, 36)' },
    {
      t: 'vocab',
      items: [
        { w: '{一年中|いちねんじゅう}', pos: 'danh từ (thời gian)', ipa: 'ichinenjuu', vi: 'Suốt 1 năm, quanh năm', ex: 'ダナンは{一年中|いちねんじゅう}{雪|ゆき}がありません。', exRo: 'Danan wa ichinenjuu yuki ga arimasen.', exVi: 'Đà Nẵng quanh năm không có tuyết.' },
        { w: 'あまり', pos: 'phó từ (+ phủ định)', ipa: 'amari', vi: 'Không ～ lắm (luôn đi với câu phủ định)', ex: 'パースはあまり{大|おお}きくないです。', exRo: 'Paasu wa amari ookiku nai desu.', exVi: 'Perth không lớn lắm.' },
        { w: '{私|わたし}の{国|くに}は{夏|なつ}、あまり{暑|あつ}くないです。', pos: 'câu mẫu', ipa: 'Watashi no kuni wa natsu, amari atsuku nai desu.', vi: 'Nước tôi mùa hè không nóng lắm.', ex: 'A：アンナさんの{国|くに}は{夏|なつ}、{暑|あつ}いですか。 B：いいえ、あまり{暑|あつ}くないです。', exRo: 'A: Anna-san no kuni wa natsu, atsui desu ka. B: Iie, amari atsuku nai desu.', exVi: 'A: Nước Anna mùa hè có nóng không? B: Không, không nóng lắm.' },
        { w: '{少|すこ}し', pos: 'phó từ', ipa: 'sukoshi', vi: 'Một chút, hơi', ex: 'このカレーは{少|すこ}し{辛|から}いです。', exRo: 'Kono karee wa sukoshi karai desu.', exVi: 'Món cà ri này hơi cay.' },
        { w: 'とても', pos: 'phó từ', ipa: 'totemo', vi: 'Rất', ex: 'ホイアンはとてもきれいです。', exRo: 'Hoian wa totemo kirei desu.', exVi: 'Hội An rất đẹp.' },
        { w: 'どう', pos: 'từ để hỏi', ipa: 'dou', vi: 'Thế nào (hỏi cảm nhận, tình trạng)', ex: '{日本|にほん}の{料理|りょうり}はどうですか。', exRo: 'Nihon no ryouri wa dou desu ka.', exVi: 'Đồ ăn Nhật (bạn thấy) thế nào?' },
        { w: 'そうですね。', pos: 'câu đồng tình', ipa: 'Sou desu ne.', vi: 'Ừ nhỉ / Đúng thế nhỉ (đồng tình với người kia)', ex: 'A：{寒|さむ}いですね。 B：そうですね。', exRo: 'A: Samui desu ne. B: Sou desu ne.', exVi: 'A: Lạnh nhỉ. B: Ừ nhỉ.' },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay nhầm — ba cặp đồng âm khác chữ, và một chỗ dịch sai trong danh sách',
      items: [
        '**{暑|あつ}い** (trời nóng) ≠ **{熱|あつ}い** (đồ vật/đồ uống nóng). ~~このコーヒーは{暑|あつ}いです~~ → このコーヒーは**{熱|あつ}い**です. Nói thì giống nhau, viết chữ Hán mới khác.',
        '**{暖|あたた}かい** (trời/không khí ấm) ≠ **{温|あたた}かい** (súp, trà, cơ thể ấm). {春|はる}は**{暖|あたた}かい**です · **{温|あたた}かい**スープ.',
        '**{寒|さむ}い** (trời lạnh, người thấy rét) ≠ **{冷|つめ}たい** (chạm vào thấy lạnh: nước, bia, tay). ~~{冷|つめ}たい{冬|ふゆ}~~ → **{寒|さむ}い**{冬|ふゆ}; ~~{寒|さむ}いビール~~ → **{冷|つめ}たい**ビール.',
        '**{高|たか}い** có hai nghĩa: cao (núi, toà nhà) **và** đắt (giá). Nhưng **{低|ひく}い** chỉ là "thấp" — "rẻ" là từ khác (やすい, bài sau).',
        'Danh sách từ của cô (mục 68) dịch câu 私の国は夏、あまり暑くないです là "…không **lạnh** lắm" — **nhầm**: {暑|あつ}い là **nóng**, nên đúng là "Nước tôi mùa hè **không nóng lắm**".',
      ],
    },

    { t: 'h', text: 'Từ thêm (sách/đề có, danh sách của cô không có — chỉ cần nghe hiểu)' },
    {
      t: 'table',
      head: ['Từ / câu', 'Romaji', 'Nghĩa'],
      rows: [
        ['{季節|きせつ}', 'kisetsu', 'Mùa (tên mục 3 của bài)'],
        ['{天気|てんき}', 'tenki', 'Thời tiết (đứng một mình: {天気|てんき}はどうですか)'],
        ['{悪|わる}い', 'warui', 'Xấu, tệ — chữ Hán của わるい'],
        ['～から{来|き}ました', '~ kara kimashita', 'Tôi đến từ ～ (câu cố định; thì quá khứ học ở Bài 5)'],
        ['たくさん', 'takusan', 'Nhiều (たくさんあります = có nhiều)'],
        ['ええ', 'ee', 'Vâng, ừ (thân mật hơn はい)'],
        ['わあ', 'waa', 'Oa! (thán phục)'],
        ['{北海道|ほっかいどう} · {京都|きょうと} · {大阪|おおさか} · {沖縄|おきなわ}', 'Hokkaidou · Kyouto · Oosaka · Okinawa', 'Địa danh Nhật hay gặp: đảo cực bắc · cố đô · thành phố lớn phía tây · đảo phía nam'],
        ['ハノイ · ホーチミン · ダナン · フエ · ホイアン · ハロン · サパ', 'Hanoi · Hoochimin · Danan · Fue · Hoian · Haron · Sapa', 'Hà Nội · TP. HCM · Đà Nẵng · Huế · Hội An · Hạ Long · Sa Pa'],
        ['{海|うみ} · {公園|こうえん} · {果物|くだもの} · バス · バイク', 'umi · kouen · kudamono · basu · baiku', 'Biển · công viên · hoa quả · xe buýt (Bài 3) · xe máy'],
        ['フォー · ブンチャー · ミークアン · キムチ', 'foo · bunchaa · miikuan · kimuchi', 'Phở · bún chả · mì Quảng · kim chi'],
      ],
    },
  ],
};

/* ═══════════════════════════ 3. NGỮ PHÁP ═══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b4-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp — ポイント 24–36 + bảng chia tính từ',
  goal: 'Chia đúng mọi tính từ い／な ở khẳng định, phủ định và trước danh từ; nói được vị trí, thời gian đi đường, nơi đó có gì, thời tiết theo mùa; hỏi どんな／どう và nối câu bằng そして／が.',
  minutes: 75,
  blocks: [
    {
      t: 'p',
      text: 'Bài 4 có **13 điểm ngữ pháp** (ポイント 24–36) — nhiều nhất từ đầu khoá. Nhưng xương sống chỉ có một: **tính từ**. Tiếng Nhật có **hai loại tính từ**, chia khác nhau: **tính từ い** ({大|おお}きい, {暑|あつ}い…) và **tính từ な** ({静|しず}か, きれい…). Nắm chắc bảng chia ngay dưới đây thì 13 điểm còn lại rất nhẹ.',
    },
    {
      t: 'table',
      caption: 'Bảng chia tính từ Bài 4 (表 p.282) — học thuộc bảng này trước',
      head: ['', 'Khẳng định', 'Phủ định', 'Đứng trước danh từ'],
      rows: [
        ['**Tính từ い**', '{大|おお}きい**です**', '{大|おお}き~~い~~**くないです**', '{大|おお}きい + {町|まち}'],
        ['**いい** (bất quy tắc)', 'いい**です**', '**よくないです**', 'いい + ところ'],
        ['**Tính từ な**', '{静|しず}か**です**', '{静|しず}か**じゃありません**', '{静|しず}か**な** + ところ'],
        ['(nhắc lại) **Danh từ**', '{雨|あめ}**です**', '{雨|あめ}**じゃありません**', '{雨|あめ}**の** + {日|ひ}'],
      ],
    },
    {
      t: 'table',
      caption: 'Toàn bộ tính từ của Bài 4 đã chia sẵn',
      head: ['Tính từ', 'Nghĩa', 'Phủ định', '+ danh từ (ví dụ)'],
      rows: [
        ['{新|あたら}しい', 'mới', '{新|あたら}しくないです', '{新|あたら}しいビル'],
        ['{古|ふる}い', 'cũ, cổ', '{古|ふる}くないです', '{古|ふる}いお{寺|てら}'],
        ['**いい**', 'tốt', '**よくないです**', 'いいところ'],
        ['{多|おお}い', 'nhiều', '{多|おお}くないです', '{緑|みどり}が{多|おお}い{町|まち}'],
        ['{少|すく}ない', 'ít', '{少|すく}なくないです', '{人|ひと}が{少|すく}ない{町|まち}'],
        ['{大|おお}きい', 'to', '{大|おお}きくないです', '{大|おお}きい{川|かわ}'],
        ['{小|ちい}さい', 'nhỏ', '{小|ちい}さくないです', '{小|ちい}さい{町|まち}'],
        ['{高|たか}い', 'cao; đắt', '{高|たか}くないです', '{高|たか}い{山|やま}'],
        ['{低|ひく}い', 'thấp', '{低|ひく}くないです', '{低|ひく}い{山|やま}'],
        ['{暖|あたた}かい', 'ấm (trời)', '{暖|あたた}かくないです', '{暖|あたた}かい{日|ひ}'],
        ['{涼|すず}しい', 'mát', '{涼|すず}しくないです', '{涼|すず}しい{日|ひ}'],
        ['{暑|あつ}い', 'nóng (trời)', '{暑|あつ}くないです', '{暑|あつ}い{日|ひ}'],
        ['{寒|さむ}い', 'lạnh (trời)', '{寒|さむ}くないです', '{寒|さむ}い{日|ひ}'],
        ['{温|あたた}かい', 'ấm (đồ)', '{温|あたた}かくないです', '{温|あたた}かいスープ'],
        ['{熱|あつ}い', 'nóng (đồ)', '{熱|あつ}くないです', '{熱|あつ}いコーヒー'],
        ['{冷|つめ}たい', 'lạnh (đồ)', '{冷|つめ}たくないです', '{冷|つめ}たいお{茶|ちゃ}'],
        ['おいしい', 'ngon', 'おいしくないです', 'おいしい{料理|りょうり}'],
        ['{甘|あま}い', 'ngọt', '{甘|あま}くないです', '{甘|あま}いケーキ'],
        ['{辛|から}い', 'cay', '{辛|から}くないです', '{辛|から}いカレー'],
        ['{苦|にが}い', 'đắng', '{苦|にが}くないです', '{苦|にが}いコーヒー'],
        ['すっぱい', 'chua', 'すっぱくないです', 'すっぱいスープ'],
        ['わるい (天気がわるい)', 'xấu', 'わるくないです', '—'],
        ['きれい（な）', 'đẹp, sạch', 'きれいじゃありません', 'きれい**な**{町|まち}'],
        ['{静|しず}か（な）', 'yên tĩnh', '{静|しず}かじゃありません', '{静|しず}か**な**ところ'],
        ['にぎやか（な）', 'nhộn nhịp', 'にぎやかじゃありません', 'にぎやか**な**{町|まち}'],
        ['{有名|ゆうめい}（な）', 'nổi tiếng', '{有名|ゆうめい}じゃありません', '{有名|ゆうめい}**な**お{寺|てら}'],
      ],
    },
    {
      t: 'note',
      title: 'Nhận ra tính từ な "đội lốt" い',
      items: [
        '**きれい** và **{有名|ゆうめい}（ゆうめい）** kết thúc bằng âm い nhưng là **tính từ な**. Chữ い cuối của chúng là một phần của từ, không phải đuôi để chia. Vì thế: ~~きれくないです~~ ~~ゆうめくないです~~ → **きれいじゃありません**, **{有名|ゆうめい}じゃありません**.',
        'Cách nhớ: trong danh sách từ, tính từ な luôn ghi kèm **（な）**. Bài 4 chỉ có **4** tính từ な: きれい · {静|しず}か · にぎやか · {有名|ゆうめい}. Còn lại đều là tính từ い.',
        'Cách nói phủ định khác bạn sẽ nghe: {大|おお}きく**ありません** (= {大|おお}きくないです), {静|しず}か**ではありません** / {静|しず}か**じゃないです** (= {静|しず}かじゃありません). Nghĩa như nhau — khi nói, dùng dạng trong bảng là đủ.',
      ],
    },

    /* ── ポイント 24 ── */
    { t: 'h', text: 'ポイント 24 — N は A です／イA-くないです／ナA じゃありません' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N は イA です。 ／ N は イA~~い~~くないです。',
          vi: 'N thì (tính từ い). / N thì không (tính từ い). Bỏ い cuối, thêm くないです.',
          examples: [
            { en: 'ホーチミンは{大|おお}きいです。', ro: 'Hoochimin wa ookii desu.', vi: 'TP. Hồ Chí Minh lớn.' },
            { en: 'この{料理|りょうり}は{辛|から}くないです。', ro: 'Kono ryouri wa karaku nai desu.', vi: 'Món này không cay.' },
            { en: '{天気|てんき}はよくないです。', ro: 'Tenki wa yoku nai desu.', vi: 'Thời tiết không tốt. (いい → よくない)' },
          ],
        },
        {
          formula: 'N は ナA です。 ／ N は ナA じゃありません。',
          vi: 'N thì (tính từ な). / N thì không (tính từ な). Chia y hệt danh từ (Bài 1).',
          examples: [
            { en: 'ハノイはにぎやかです。', ro: 'Hanoi wa nigiyaka desu.', vi: 'Hà Nội nhộn nhịp.' },
            { en: '{私|わたし}の{町|まち}は{静|しず}かじゃありません。', ro: 'Watashi no machi wa shizuka ja arimasen.', vi: 'Thành phố tôi không yên tĩnh.' },
          ],
        },
        {
          formula: 'N1 は N2 が A です。',
          vi: 'N1 thì N2 (thế nào). Dùng để nói một ĐẶC ĐIỂM của nơi chốn: 町は 緑が多い.',
          examples: [
            { en: '{私|わたし}の{町|まち}は{緑|みどり}が{多|おお}いです。', ro: 'Watashi no machi wa midori ga ooi desu.', vi: 'Thành phố tôi (thì) nhiều cây xanh.' },
            { en: 'ハノイは{人|ひと}が{多|おお}いです。', ro: 'Hanoi wa hito ga ooi desu.', vi: 'Hà Nội (thì) đông người.' },
            { en: 'パースは{天気|てんき}がいいです。', ro: 'Paasu wa tenki ga ii desu.', vi: 'Perth (thì) thời tiết đẹp.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: khẳng định và phủ định (hai loại tính từ)',
      lines: [
        { who: 'A', role: 'a', text: 'リンさんの{町|まち}は{大|おお}きいですか。', ro: 'Rin-san no machi wa ookii desu ka.', vi: 'Thành phố của Linh có lớn không?' },
        { who: 'リン', role: 'b', text: 'いいえ、{大|おお}きくないです。', ro: 'Iie, ookiku nai desu.', vi: 'Không, không lớn.' },
        { who: 'A', role: 'a', text: 'にぎやかですか。', ro: 'Nigiyaka desu ka.', vi: 'Có nhộn nhịp không?' },
        { who: 'リン', role: 'b', text: 'いいえ、にぎやかじゃありません。{静|しず}かです。', ro: 'Iie, nigiyaka ja arimasen. Shizuka desu.', vi: 'Không, không nhộn nhịp. Yên tĩnh.' },
        { who: 'A', role: 'a', text: '{天気|てんき}はいいですか。', ro: 'Tenki wa ii desu ka.', vi: 'Thời tiết có đẹp không?' },
        { who: 'リン', role: 'b', text: '10{月|がつ}はよくないです。{雨|あめ}が{多|おお}いです。', ro: 'Juu-gatsu wa yoku nai desu. Ame ga ooi desu.', vi: 'Tháng 10 thì không đẹp. Mưa nhiều.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — hỏi và trả lời',
      head: ['N は', 'A ですか。', 'はい、～です。', 'いいえ、～'],
      rows: [
        ['～さんの{町|まち}は', '{大|おお}きいですか。', 'はい、{大|おお}きいです。', 'いいえ、{大|おお}きくないです。'],
        ['ハノイは', '{静|しず}かですか。', 'はい、{静|しず}かです。', 'いいえ、{静|しず}かじゃありません。'],
        ['このカレーは', '{辛|から}いですか。', 'はい、{辛|から}いです。', 'いいえ、{辛|から}くないです。'],
        ['ダナンは', '{人|ひと}が{多|おお}いですか。', 'はい、{多|おお}いです。', 'いいえ、{多|おお}くないです。'],
        ['{天気|てんき}は', 'いいですか。', 'はい、いいです。', 'いいえ、**よくないです**。'],
        ['ホイアンは', '{有名|ゆうめい}ですか。', 'はい、{有名|ゆうめい}です。', 'いいえ、{有名|ゆうめい}じゃありません。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — chia sai tính từ (mất điểm ngữ pháp ngay)',
      items: [
        '~~{大|おお}きいくないです~~ → **{大|おお}きくないです**. Phải **bỏ い** rồi mới thêm くない.',
        '~~{大|おお}きいじゃありません~~ → **{大|おお}きくないです**. じゃありません chỉ dành cho tính từ な và danh từ.',
        '~~{静|しず}かくないです~~ → **{静|しず}かじゃありません**. Tính từ な không bao giờ đi với くない.',
        '~~きれくないです~~ / ~~きれいくないです~~ → **きれいじゃありません** (きれい là tính từ な).',
        '~~いくないです~~ → **よくないです**. いい là tính từ bất quy tắc duy nhất: phủ định mượn gốc よ.',
        '~~{静|しず}かなです~~ → **{静|しず}かです**. Chữ な chỉ xuất hiện khi có danh từ đứng sau (ポイント 25).',
        'Trả lời いいえ mà quên đổi sang phủ định: ~~いいえ、{大|おお}きいです~~ → nghĩa bị đảo ngược = **mất trọn điểm câu** trong thi nói.',
      ],
    },

    /* ── ポイント 25 ── */
    { t: 'h', text: 'ポイント 25 — イA ＋ N ／ ナA な ＋ N' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'イA（～い） ＋ N',
          vi: 'Tính từ い đứng thẳng trước danh từ, giữ nguyên い.',
          examples: [
            { en: 'ホイアンは{古|ふる}い{町|まち}です。', ro: 'Hoian wa furui machi desu.', vi: 'Hội An là một phố cổ.' },
            { en: 'ハノイに{大|おお}きい{川|かわ}があります。', ro: 'Hanoi ni ookii kawa ga arimasu.', vi: 'Ở Hà Nội có con sông lớn.' },
            { en: 'ここはいいところです。', ro: 'Koko wa ii tokoro desu.', vi: 'Đây là một nơi tốt.' },
          ],
        },
        {
          formula: 'ナA ＋ な ＋ N',
          vi: 'Tính từ な phải thêm な rồi mới đến danh từ.',
          examples: [
            { en: 'ダナンはきれいな{町|まち}です。', ro: 'Danan wa kirei na machi desu.', vi: 'Đà Nẵng là một thành phố đẹp.' },
            { en: 'パースは{静|しず}かなところです。', ro: 'Paasu wa shizuka na tokoro desu.', vi: 'Perth là một nơi yên tĩnh.' },
            { en: 'フォーは{有名|ゆうめい}な{料理|りょうり}です。', ro: 'Foo wa yuumei na ryouri desu.', vi: 'Phở là một món ăn nổi tiếng.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Cùng một ý, hai cách nói',
      head: ['A đứng cuối câu (ポイント 24)', 'A đứng trước danh từ (ポイント 25)', 'Nghĩa'],
      rows: [
        ['このお{寺|てら}は{古|ふる}いです。', 'これは**{古|ふる}い**お{寺|てら}です。', 'Chùa này cổ. / Đây là ngôi chùa cổ.'],
        ['ダナンはきれいです。', 'ダナンは**きれいな**{町|まち}です。', 'Đà Nẵng đẹp. / Đà Nẵng là thành phố đẹp.'],
        ['この{山|やま}は{高|たか}いです。', 'これは**{高|たか}い**{山|やま}です。', 'Núi này cao. / Đây là ngọn núi cao.'],
        ['ハノイはにぎやかです。', 'ハノイは**にぎやかな**{町|まち}です。', 'Hà Nội nhộn nhịp. / Hà Nội là thành phố nhộn nhịp.'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — "(nơi đó) là (một) ～ như thế nào"',
      head: ['N は', 'A (+な)', 'N です。'],
      rows: [
        ['{私|わたし}の{町|まち}は', '{小|ちい}さい · {新|あたら}しい · いい', '{町|まち}です。'],
        ['ハノイは', 'にぎやかな · {古|ふる}い · {有名|ゆうめい}な', '{町|まち}です。'],
        ['ダナンは', 'きれいな · {静|しず}かな · いい', 'ところです。'],
        ['これは', '{古|ふる}い · {有名|ゆうめい}な · {大|おお}きい', 'お{寺|てら}／お{城|しろ}／{教会|きょうかい}です。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — な đặt sai chỗ',
      items: [
        '~~きれい{町|まち}~~ → **きれいな{町|まち}**; ~~にぎやか{町|まち}~~ → **にぎやかな{町|まち}**. Quên な là lỗi phổ biến nhất của bài.',
        '~~{大|おお}きいな{町|まち}~~ → **{大|おお}きい{町|まち}**. Tính từ い KHÔNG thêm な.',
        '~~{大|おお}きいの{町|まち}~~ → **{大|おお}きい{町|まち}**. の chỉ nối danh từ với danh từ (ベトナム**の**{料理|りょうり}).',
        'Tiếng Việt nói "thành phố **đẹp**" (tính từ đứng sau), tiếng Nhật nói "**きれいな** {町|まち}" (tính từ đứng trước). Đừng viết ~~{町|まち}きれいな~~.',
        '{多|おお}い／{少|すく}ない ít khi đứng thẳng trước danh từ: ~~{多|おお}い{人|ひと}~~. Nói **{人|ひと}が{多|おお}いです** hoặc **{緑|みどり}が{多|おお}い{町|まち}** (có cả cụm "N が" đi trước).',
      ],
    },

    /* ── ポイント 26 ── */
    { t: 'h', text: 'ポイント 26 — N（国・町）は［{春|はる}・～{月|がつ}・{一年中|いちねんじゅう}…］、A です' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N（nơi） は ［mùa／tháng／一年中］、 A です。',
          vi: 'Nơi đó vào (mùa/tháng) thì (thế nào). Thời gian đặt sau は, có dấu phẩy, KHÔNG cần trợ từ.',
          examples: [
            { en: 'ハノイは{夏|なつ}、とても{暑|あつ}いです。', ro: 'Hanoi wa natsu, totemo atsui desu.', vi: 'Hà Nội mùa hè rất nóng.' },
            { en: 'フエは11{月|がつ}、{雨|あめ}が{多|おお}いです。', ro: 'Fue wa juuichi-gatsu, ame ga ooi desu.', vi: 'Huế tháng 11 mưa nhiều.' },
            { en: 'ホーチミンは{一年中|いちねんじゅう}、{暑|あつ}いです。', ro: 'Hoochimin wa ichinenjuu, atsui desu.', vi: 'TP. Hồ Chí Minh nóng quanh năm.' },
          ],
        },
        {
          formula: 'N（nơi） は ［mùa／tháng］、 N が A です。',
          vi: 'Kết hợp với ポイント 24: nơi đó, vào lúc đó, (mưa/tuyết…) thế nào.',
          examples: [
            { en: 'モスクワは{冬|ふゆ}、{雪|ゆき}が{多|おお}いです。', ro: 'Mosukuwa wa fuyu, yuki ga ooi desu.', vi: 'Moskva mùa đông nhiều tuyết.' },
            { en: 'パースは{一年中|いちねんじゅう}、{天気|てんき}がいいです。', ro: 'Paasu wa ichinenjuu, tenki ga ii desu.', vi: 'Perth quanh năm thời tiết đẹp.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Thời tiết Việt Nam theo mùa — dùng ngay khi thi (ghép với ポイント 27)',
      head: ['Nơi', '{春|はる} (xuân)', '{夏|なつ} (hè)', '{秋|あき} (thu)', '{冬|ふゆ} (đông)'],
      rows: [
        ['ハノイ', '{暖|あたた}かいです', 'とても{暑|あつ}いです', '{涼|すず}しいです', '{少|すこ}し{寒|さむ}いです'],
        ['ダナン', '{暖|あたた}かいです', 'とても{暑|あつ}いです', '{雨|あめ}が{多|おお}いです', 'あまり{寒|さむ}くないです'],
        ['ホーチミン ({一年中|いちねんじゅう}{暑|あつ}い)', '{暑|あつ}いです', '{暑|あつ}いです · {雨|あめ}が{多|おお}いです', '{雨|あめ}が{多|おお}いです', 'あまり{寒|さむ}くないです'],
        ['サパ', '{涼|すず}しいです', 'あまり{暑|あつ}くないです', '{涼|すず}しいです', 'とても{寒|さむ}いです'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp',
      lines: [
        { who: 'A', role: 'a', text: 'ハノイは{冬|ふゆ}、{寒|さむ}いですか。', ro: 'Hanoi wa fuyu, samui desu ka.', vi: 'Hà Nội mùa đông có lạnh không?' },
        { who: 'B', role: 'b', text: 'はい、{少|すこ}し{寒|さむ}いです。', ro: 'Hai, sukoshi samui desu.', vi: 'Có, hơi lạnh.' },
        { who: 'A', role: 'a', text: 'ホーチミンも{冬|ふゆ}、{寒|さむ}いですか。', ro: 'Hoochimin mo fuyu, samui desu ka.', vi: 'TP. HCM mùa đông cũng lạnh à?' },
        { who: 'B', role: 'b', text: 'いいえ、{寒|さむ}くないです。ホーチミンは{一年中|いちねんじゅう}、{暑|あつ}いです。', ro: 'Iie, samuku nai desu. Hoochimin wa ichinenjuu, atsui desu.', vi: 'Không, không lạnh. TP. HCM nóng quanh năm.' },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc',
      items: [
        '~~ハノイは{夏|なつ}に{暑|あつ}いです~~ — không sai hẳn nhưng sách dạy khuôn **ハノイは{夏|なつ}、{暑|あつ}いです** (dấu phẩy, không に). Dùng đúng khuôn của sách cho chắc điểm.',
        'Đừng đảo: ~~{夏|なつ}はハノイ、{暑|あつ}いです~~. Nơi chốn đứng đầu với は, thời gian theo sau.',
        'Tháng đọc là **～がつ**: 4{月|がつ} **しがつ**, 7{月|がつ} **しちがつ**, 9{月|がつ} **くがつ** (Bài 1). ~~よんがつ~~ ~~きゅうがつ~~.',
      ],
    },

    /* ── ポイント 27 ── */
    { t: 'h', text: 'ポイント 27 — とても／少し A です ・ あまり｛イA-くないです／ナA じゃありません｝' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'とても ＋ A です。 ／ 少し ＋ A です。',
          vi: 'Rất (A). / Hơi (A), (A) một chút. Đi với câu KHẲNG ĐỊNH.',
          examples: [
            { en: 'ハノイは{夏|なつ}、とても{暑|あつ}いです。', ro: 'Hanoi wa natsu, totemo atsui desu.', vi: 'Hà Nội mùa hè rất nóng.' },
            { en: 'このスープは{少|すこ}しすっぱいです。', ro: 'Kono suupu wa sukoshi suppai desu.', vi: 'Món canh này hơi chua.' },
          ],
        },
        {
          formula: 'あまり ＋ イA-くないです／ナA じゃありません。',
          vi: 'Không (A) lắm. あまり LUÔN đi với câu PHỦ ĐỊNH.',
          examples: [
            { en: 'この{公園|こうえん}はあまり{大|おお}きくないです。', ro: 'Kono kouen wa amari ookiku nai desu.', vi: 'Công viên này không lớn lắm.' },
            { en: '{私|わたし}の{町|まち}はあまりにぎやかじゃありません。', ro: 'Watashi no machi wa amari nigiyaka ja arimasen.', vi: 'Thành phố tôi không nhộn nhịp lắm.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Thang mức độ — từ "rất" đến "không … lắm"',
      head: ['Mức', 'Câu', 'Nghĩa'],
      rows: [
        ['▲▲▲', 'とても{辛|から}いです。', 'Rất cay.'],
        ['▲▲', '{辛|から}いです。', 'Cay.'],
        ['▲', '{少|すこ}し{辛|から}いです。', 'Hơi cay.'],
        ['▽', 'あまり{辛|から}くないです。', 'Không cay lắm.'],
        ['▽▽', '{辛|から}くないです。', 'Không cay.'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: ba mức trả lời',
      lines: [
        { who: 'A', role: 'a', text: 'ベトナムの{料理|りょうり}は{辛|から}いですか。', ro: 'Betonamu no ryouri wa karai desu ka.', vi: 'Món Việt có cay không?' },
        { who: 'B', role: 'b', text: 'いいえ、あまり{辛|から}くないです。', ro: 'Iie, amari karaku nai desu.', vi: 'Không, không cay lắm.' },
        { who: 'A', role: 'a', text: 'ベトナムのコーヒーは{苦|にが}いですか。', ro: 'Betonamu no koohii wa nigai desu ka.', vi: 'Cà phê Việt có đắng không?' },
        { who: 'B', role: 'b', text: 'はい、とても{苦|にが}いです。', ro: 'Hai, totemo nigai desu.', vi: 'Có, rất đắng.' },
        { who: 'A', role: 'a', text: 'ハノイは{冬|ふゆ}、{寒|さむ}いですか。', ro: 'Hanoi wa fuyu, samui desu ka.', vi: 'Hà Nội mùa đông lạnh không?' },
        { who: 'B', role: 'b', text: 'はい、{少|すこ}し{寒|さむ}いです。', ro: 'Hai, sukoshi samui desu.', vi: 'Có, hơi lạnh.' },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — あまり đi với khẳng định',
      items: [
        '~~あまり{暑|あつ}いです~~ → **あまり{暑|あつ}くないです**. Nghe あまり là phải chờ phủ định ở cuối câu.',
        '~~とても{暑|あつ}くないです~~ → muốn nói "không nóng lắm" thì dùng **あまり**. とても chỉ đi với khẳng định (ở trình độ này).',
        '~~{少|すこ}し{暑|あつ}くないです~~ → sai. {少|すこ}し + khẳng định: **{少|すこ}し{暑|あつ}いです**.',
        'Tiếng Việt "không … **lắm**" → tiếng Nhật đặt あまり **ở trước** tính từ: ~~{暑|あつ}くないですあまり~~.',
      ],
    },

    /* ── ポイント 28 ── */
    { t: 'h', text: 'ポイント 28 — N1（{場所|ばしょ}）に N2 が あります' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1（nơi chốn） に N2 が あります。',
          vi: 'Ở N1 có N2. に đánh dấu NƠI tồn tại, が đánh dấu THỨ tồn tại.',
          examples: [
            { en: 'ダナンに{海|うみ}があります。', ro: 'Danan ni umi ga arimasu.', vi: 'Ở Đà Nẵng có biển.' },
            { en: '{私|わたし}の{町|まち}にきれいな{川|かわ}があります。', ro: 'Watashi no machi ni kirei na kawa ga arimasu.', vi: 'Thành phố tôi có một con sông đẹp.' },
            { en: 'フエに{古|ふる}いお{城|しろ}やお{寺|てら}などがあります。', ro: 'Fue ni furui oshiro ya otera nado ga arimasu.', vi: 'Ở Huế có thành cổ, chùa, v.v. (や～など — Bài 3)' },
          ],
        },
        {
          formula: 'N1 に 何 が ありますか。 → N2 が あります。',
          vi: 'Ở N1 có gì? → Có N2.',
          examples: [
            { en: 'ホイアンに{何|なに}がありますか。', ro: 'Hoian ni nani ga arimasu ka.', vi: 'Ở Hội An có gì?' },
            { en: '{古|ふる}い{町|まち}があります。', ro: 'Furui machi ga arimasu.', vi: 'Có phố cổ.' },
          ],
        },
        {
          formula: 'N1 に N2 が ありますか。 → はい、あります。／いいえ、ありません。',
          vi: 'Ở N1 có N2 không? → Có. / Không có.',
          examples: [
            { en: 'ハノイに{温泉|おんせん}がありますか。', ro: 'Hanoi ni onsen ga arimasu ka.', vi: 'Ở Hà Nội có suối nước nóng không?' },
            { en: 'いいえ、ありません。', ro: 'Iie, arimasen.', vi: 'Không, không có.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp',
      lines: [
        { who: 'A', role: 'a', text: 'ナタポンさんの{町|まち}に{何|なに}がありますか。', ro: 'Natapon-san no machi ni nani ga arimasu ka.', vi: 'Thành phố của Nataphon có gì?' },
        { who: 'ナタポン', role: 'b', text: '{古|ふる}いお{寺|てら}があります。', ro: 'Furui otera ga arimasu.', vi: 'Có chùa cổ.' },
        { who: 'A', role: 'a', text: 'どんなお{寺|てら}ですか。', ro: 'Donna otera desu ka.', vi: 'Chùa như thế nào?' },
        { who: 'ナタポン', role: 'b', text: 'きれいなお{寺|てら}です。とても{有名|ゆうめい}です。', ro: 'Kirei na otera desu. Totemo yuumei desu.', vi: 'Là ngôi chùa đẹp. Rất nổi tiếng.' },
        { who: 'A', role: 'a', text: '{海|うみ}もありますか。', ro: 'Umi mo arimasu ka.', vi: 'Có cả biển không?' },
        { who: 'ナタポン', role: 'b', text: 'いいえ、{海|うみ}はありません。{山|やま}があります。', ro: 'Iie, umi wa arimasen. Yama ga arimasu.', vi: 'Không, biển thì không có. Có núi.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế',
      head: ['N1（nơi）に', 'N2 が', 'あります。'],
      rows: [
        ['ハノイに', '{古|ふる}いお{寺|てら} · {大|おお}きい{川|かわ} · {有名|ゆうめい}な{教会|きょうかい}', 'があります。'],
        ['ダナンに', 'きれいな{海|うみ} · {山|やま} · {新|あたら}しいビル', 'があります。'],
        ['{日本|にほん}に', '{高|たか}い{山|やま} · {温泉|おんせん} · {神社|じんじゃ}', 'があります。'],
        ['{私|わたし}の{町|まち}に', '{駅|えき} · {大|おお}きい{公園|こうえん} · いいレストラン', 'があります。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — に/で/は/が',
      items: [
        '~~ハノイ**で**{川|かわ}があります~~ → ハノイ**に**{川|かわ}があります. "Có ở đâu" (tồn tại) dùng **に**; で là nơi xảy ra HÀNH ĐỘNG (Bài 3: ハノイ**で**フォーを{食|た}べます).',
        '~~ハノイに{川|かわ}**は**あります~~ khi giới thiệu lần đầu → dùng **が**. Câu hỏi 何**が**ありますか → đáp ～**が**あります. Chỉ khi phủ định/so sánh mới đổi sang は: {海|うみ}**は**ありません.',
        '**あります** dùng cho đồ vật, cây cối, công trình, nơi chốn. Người và con vật dùng một động từ khác (います — bài sau), đừng nói ~~{人|ひと}があります~~.',
        'Hỏi "có gì" nhưng đáp tính từ: ~~きれいです~~ → trả lời phải có **N があります**.',
      ],
    },

    /* ── ポイント 29 ── */
    { t: 'h', text: 'ポイント 29 — N（町）は N（国）の［{東|ひがし}・{西|にし}・{南|みなみ}・{北|きた}・{真|ま}ん{中|なか}］です' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N（thành phố） は N（nước） の 北／南／東／西／真ん中 です。',
          vi: '(Thành phố) ở phía bắc/nam/đông/tây/chính giữa của (nước).',
          examples: [
            { en: 'ハノイはベトナムの{北|きた}です。', ro: 'Hanoi wa Betonamu no kita desu.', vi: 'Hà Nội ở phía bắc Việt Nam.' },
            { en: 'ダナンはベトナムの{真|ま}ん{中|なか}です。', ro: 'Danan wa Betonamu no mannaka desu.', vi: 'Đà Nẵng ở chính giữa Việt Nam.' },
            { en: '{沖縄|おきなわ}は{日本|にほん}の{南|みなみ}です。', ro: 'Okinawa wa Nihon no minami desu.', vi: 'Okinawa ở phía nam Nhật Bản.' },
          ],
        },
        {
          formula: 'N（thành phố） は どこですか。',
          vi: 'Hỏi vị trí: (thành phố) ở đâu? Hỏi thêm cho rõ: ～の どこですか (ở đâu của ～).',
          examples: [
            { en: 'フエはどこですか。', ro: 'Fue wa doko desu ka.', vi: 'Huế ở đâu?' },
            { en: 'フエはベトナムの{真|ま}ん{中|なか}です。ダナンの{北|きた}です。', ro: 'Fue wa Betonamu no mannaka desu. Danan no kita desu.', vi: 'Huế ở giữa Việt Nam. Ở phía bắc Đà Nẵng.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'La bàn — học kèm vị trí trên bản đồ',
      head: ['Hướng', 'Kanji', 'Đọc', 'Romaji', 'Ví dụ'],
      rows: [
        ['Bắc (trên)', '{北|きた}', 'きた', 'kita', 'ハノイ · サパ · {北海道|ほっかいどう}'],
        ['Nam (dưới)', '{南|みなみ}', 'みなみ', 'minami', 'ホーチミン · カントー · {沖縄|おきなわ}'],
        ['Đông (phải)', '{東|ひがし}', 'ひがし', 'higashi', '{東京|とうきょう} (chữ 東!) · シャンハイ'],
        ['Tây (trái)', '{西|にし}', 'にし', 'nishi', 'パース · モスクワ'],
        ['Chính giữa', '{真|ま}ん{中|なか}', 'まんなか', 'mannaka', 'ダナン · フエ'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp theo thứ tự từ to đến nhỏ',
      lines: [
        { who: 'A', role: 'a', text: 'お{国|くに}はどちらですか。', ro: 'Okuni wa dochira desu ka.', vi: 'Nước bạn là nước nào?' },
        { who: 'B', role: 'b', text: 'ベトナムです。', ro: 'Betonamu desu.', vi: 'Việt Nam.' },
        { who: 'A', role: 'a', text: 'ベトナムのどこですか。', ro: 'Betonamu no doko desu ka.', vi: 'Ở đâu của Việt Nam?' },
        { who: 'B', role: 'b', text: 'ハイフォンです。', ro: 'Haifon desu.', vi: 'Hải Phòng.' },
        { who: 'A', role: 'a', text: 'ハイフォンはどこですか。', ro: 'Haifon wa doko desu ka.', vi: 'Hải Phòng ở đâu?' },
        { who: 'B', role: 'b', text: 'ハイフォンはベトナムの{北|きた}です。ハノイの{東|ひがし}です。', ro: 'Haifon wa Betonamu no kita desu. Hanoi no higashi desu.', vi: 'Hải Phòng ở phía bắc Việt Nam. Ở phía đông Hà Nội.' },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc',
      items: [
        '~~ベトナムは ハノイの{北|きた}です~~ — đảo ngược: nơi NHỎ đứng trước は, nơi LỚN đứng trước の. **ハノイはベトナムの{北|きた}です**.',
        '~~ハノイは{北|きた}のベトナムです~~ → **ハノイはベトナムの{北|きた}です**. Tiếng Việt "phía bắc **của** Việt Nam" → tiếng Nhật "ベトナム**の**{北|きた}" (nơi lớn の hướng).',
        '"Hơi chếch về phía bắc" nói: ～の{少|すこ}し{北|きた}です (イタリアの{少|すこ}し{北|きた}). Không cần học thêm gì, chỉ chèn {少|すこ}し.',
      ],
    },

    /* ── ポイント 30 ── */
    { t: 'h', text: 'ポイント 30 — N1 から N2 まで どのくらいですか ／ ～{時間|じかん}・～{分|ふん} です' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1（nơi 1） から N2（nơi 2） まで どのくらいですか。',
          vi: 'Từ N1 đến N2 mất bao lâu? (から～まで đã học ở Bài 3 với giờ giấc; nay dùng cho nơi chốn)',
          examples: [
            { en: 'ハノイからダナンまでどのくらいですか。', ro: 'Hanoi kara Danan made dono kurai desu ka.', vi: 'Từ Hà Nội đến Đà Nẵng mất bao lâu?' },
            { en: 'うちから{駅|えき}までどのくらいですか。', ro: 'Uchi kara eki made dono kurai desu ka.', vi: 'Từ nhà đến ga mất bao lâu?' },
          ],
        },
        {
          formula: '（N1 から N2 まで） ～時間／～時間半／～分（くらい）です。',
          vi: 'Mất (khoảng) ～ tiếng / ～ tiếng rưỡi / ～ phút.',
          examples: [
            { en: '1{時間半|じかんはん}くらいです。', ro: 'Ichi-jikan han kurai desu.', vi: 'Khoảng một tiếng rưỡi.' },
            { en: 'うちから{駅|えき}まで5{分|ふん}です。', ro: 'Uchi kara eki made go-fun desu.', vi: 'Từ nhà đến ga 5 phút.' },
            { en: '2{時間|じかん}30{分|ぷん}くらいです。', ro: 'Ni-jikan sanjuppun kurai desu.', vi: 'Khoảng 2 tiếng 30 phút.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Đếm phút ～{分|ふん} (表 p.286) — chú ý các ô đậm (ふん → ぷん)',
      head: ['Số', 'Đọc', 'Romaji'],
      rows: [
        ['1{分|ぷん}', '**いっぷん**', 'ippun'],
        ['2{分|ふん}', 'にふん', 'nifun'],
        ['3{分|ぷん}', '**さんぷん**', 'sanpun'],
        ['4{分|ぷん}', '**よんぷん**', 'yonpun'],
        ['5{分|ふん}', 'ごふん', 'gofun'],
        ['6{分|ぷん}', '**ろっぷん**', 'roppun'],
        ['7{分|ふん}', 'ななふん', 'nanafun'],
        ['8{分|ぷん}', '**はっぷん** (はちふん)', 'happun'],
        ['9{分|ふん}', 'きゅうふん', 'kyuufun'],
        ['10{分|ぷん}', '**じゅっぷん** (じっぷん)', 'juppun'],
        ['15{分|ふん}', 'じゅうごふん', 'juugofun'],
        ['20{分|ぷん}', '**にじゅっぷん**', 'nijuppun'],
        ['30{分|ぷん}', '**さんじゅっぷん**', 'sanjuppun'],
        ['45{分|ふん}', 'よんじゅうごふん', 'yonjuugofun'],
        ['？', '**なんぷん**', 'nanpun'],
      ],
    },
    {
      t: 'table',
      caption: 'Đếm tiếng ～{時間|じかん} — chú ý 4 và 9',
      head: ['Số', 'Đọc', 'Romaji'],
      rows: [
        ['1{時間|じかん}', 'いちじかん', 'ichi-jikan'],
        ['2{時間|じかん}', 'にじかん', 'ni-jikan'],
        ['3{時間|じかん}', 'さんじかん', 'san-jikan'],
        ['4{時間|じかん}', '**よじかん**', 'yo-jikan'],
        ['5{時間|じかん}', 'ごじかん', 'go-jikan'],
        ['6{時間|じかん}', 'ろくじかん', 'roku-jikan'],
        ['7{時間|じかん}', 'ななじかん (しちじかん)', 'nana-jikan'],
        ['8{時間|じかん}', 'はちじかん', 'hachi-jikan'],
        ['9{時間|じかん}', '**くじかん**', 'ku-jikan'],
        ['10{時間|じかん}', 'じゅうじかん', 'juu-jikan'],
        ['1{時間半|じかんはん}', 'いちじかんはん', 'ichi-jikan han (1 tiếng rưỡi)'],
        ['？', '**なんじかん**', 'nan-jikan'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp',
      lines: [
        { who: 'A', role: 'a', text: 'ハノイからハロンまでどのくらいですか。', ro: 'Hanoi kara Haron made dono kurai desu ka.', vi: 'Từ Hà Nội đến Hạ Long mất bao lâu?' },
        { who: 'B', role: 'b', text: '{車|くるま}で2{時間半|じかんはん}くらいです。', ro: 'Kuruma de ni-jikan han kurai desu.', vi: 'Đi ô tô khoảng 2 tiếng rưỡi.' },
        { who: 'A', role: 'a', text: 'うちから{学校|がっこう}までどのくらいですか。', ro: 'Uchi kara gakkou made dono kurai desu ka.', vi: 'Từ nhà bạn đến trường mất bao lâu?' },
        { who: 'B', role: 'b', text: 'バスで40{分|ぷん}くらいです。', ro: 'Basu de yonjuppun kurai desu.', vi: 'Đi xe buýt khoảng 40 phút.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế',
      head: ['N1 から', 'N2 まで', 'phương tiện で', 'thời gian くらいです。'],
      rows: [
        ['{東京|とうきょう}から', 'ハノイまで', '{飛行機|ひこうき}で', '6{時間|じかん}くらいです。'],
        ['ハノイから', 'サパまで', 'バスで', '5{時間|じかん}くらいです。'],
        ['{東京|とうきょう}から', '{京都|きょうと}まで', '{新幹線|しんかんせん}で', '2{時間|じかん}15{分|ふん}くらいです。'],
        ['うちから', '{駅|えき}まで', '{歩|ある}いて', '10{分|ぷん}です。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc',
      items: [
        '**～{時|じ}** (Bài 3) là **mốc giờ** — 3{時|じ} = 3 giờ. **～{時間|じかん}** là **khoảng thời gian** — 3{時間|じかん} = 3 tiếng. Hỏi どのくらい mà đáp ~~3{時|じ}です~~ là sai nghĩa.',
        '~~よんじかん~~ → **よじかん**; ~~きゅうじかん~~ → **くじかん** (giống 4時 よじ, 9時 くじ ở Bài 3).',
        '~~いちふん~~ → **いっぷん**; ~~じゅうふん~~ → **じゅっぷん**; ~~さんふん~~ → **さんぷん**.',
        '"Rưỡi" đặt SAU 時間: **2{時間半|じかんはん}** (にじかんはん), không phải ~~{半|はん}2{時間|じかん}~~.',
        '**くらい** đứng SAU con số: 5{時間|じかん}**くらい**. Tiếng Việt "khoảng 5 tiếng" (khoảng đứng trước) — đừng dịch từng chữ thành ~~くらい5{時間|じかん}~~.',
      ],
    },

    /* ── ポイント 31 ── */
    { t: 'h', text: 'ポイント 31 — N（{乗|の}り{物|もの}）で' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N（phương tiện） で',
          vi: 'Bằng (phương tiện). で ở đây là "bằng cách" — giống ～語で (Bài 2).',
          examples: [
            { en: '{大阪|おおさか}から{京都|きょうと}まで{電車|でんしゃ}で30{分|ぷん}くらいです。', ro: 'Oosaka kara Kyouto made densha de sanjuppun kurai desu.', vi: 'Từ Osaka đến Kyoto đi tàu điện khoảng 30 phút.' },
            { en: 'ハノイからダナンまで{飛行機|ひこうき}で1{時間|じかん}20{分|ぷん}くらいです。', ro: 'Hanoi kara Danan made hikouki de ichi-jikan nijuppun kurai desu.', vi: 'Từ Hà Nội đến Đà Nẵng đi máy bay khoảng 1 tiếng 20 phút.' },
          ],
        },
        {
          formula: '歩いて（KHÔNG có で）',
          vi: 'Đi bộ: {歩|ある}いて là một động từ đã chia, đứng một mình.',
          examples: [
            { en: '{駅|えき}から{学校|がっこう}まで{歩|ある}いて10{分|ぷん}です。', ro: 'Eki kara gakkou made aruite juppun desu.', vi: 'Từ ga đến trường đi bộ 10 phút.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Phương tiện',
      head: ['Nói', 'Romaji', 'Nghĩa'],
      rows: [
        ['{飛行機|ひこうき}で', 'hikouki de', 'bằng máy bay'],
        ['{新幹線|しんかんせん}で', 'shinkansen de', 'bằng tàu Shinkansen'],
        ['{電車|でんしゃ}で', 'densha de', 'bằng tàu điện'],
        ['バスで', 'basu de', 'bằng xe buýt (バス — Bài 3)'],
        ['{車|くるま}で', 'kuruma de', 'bằng ô tô'],
        ['**{歩|ある}いて**', 'aruite', 'đi bộ (không で)'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp',
      lines: [
        { who: 'A', role: 'a', text: '{東京|とうきょう}から{京都|きょうと}までどのくらいですか。', ro: 'Toukyou kara Kyouto made dono kurai desu ka.', vi: 'Từ Tokyo đến Kyoto mất bao lâu?' },
        { who: 'B', role: 'b', text: '{新幹線|しんかんせん}で2{時間|じかん}15{分|ふん}くらいです。', ro: 'Shinkansen de ni-jikan juugo-fun kurai desu.', vi: 'Đi Shinkansen khoảng 2 tiếng 15 phút.' },
        { who: 'A', role: 'a', text: 'バスでどのくらいですか。', ro: 'Basu de dono kurai desu ka.', vi: 'Đi xe buýt mất bao lâu?' },
        { who: 'B', role: 'b', text: 'バスで8{時間|じかん}くらいです。', ro: 'Basu de hachi-jikan kurai desu.', vi: 'Xe buýt khoảng 8 tiếng.' },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc',
      items: [
        '~~{歩|ある}いてで~~ / ~~{足|あし}で~~ → **{歩|ある}いて**. Chỉ phương tiện (danh từ) mới có で.',
        '~~{飛行機|ひこうき}に~~ / ~~{飛行機|ひこうき}を~~ → **{飛行機|ひこうき}で**. Trả lời "bằng gì" luôn là で.',
        'Thứ tự tự nhiên: **N1 から N2 まで ＋ phương tiện で ＋ thời gian くらいです**.',
      ],
    },

    /* ── ポイント 32 ── */
    { t: 'h', text: 'ポイント 32 — どんな N' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1 は どんな N2 ですか。 → （N1 は） A（な） N2 です。',
          vi: 'N1 là N2 như thế nào? → (N1) là N2 (tính từ). Trả lời bằng tính từ + danh từ (ポイント 25).',
          examples: [
            { en: 'ホイアンはどんなところですか。', ro: 'Hoian wa donna tokoro desu ka.', vi: 'Hội An là nơi như thế nào?' },
            { en: '{古|ふる}い{町|まち}です。{静|しず}かなところです。', ro: 'Furui machi desu. Shizuka na tokoro desu.', vi: 'Là phố cổ. Là nơi yên tĩnh.' },
            { en: 'フォーはどんな{料理|りょうり}ですか。——{温|あたた}かい{料理|りょうり}です。', ro: 'Foo wa donna ryouri desu ka. — Atatakai ryouri desu.', vi: 'Phở là món thế nào? — Là món nóng ấm.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'どんな vs các từ hỏi đã học — nghe nhầm là trả lời sai cả câu',
      head: ['Câu hỏi', 'Hỏi về', 'Trả lời mẫu'],
      rows: [
        ['**どんな**ところですか。', 'Tính chất (thế nào)', 'にぎやかなところです。'],
        ['**どこ**ですか。', 'Vị trí', 'ベトナムの{北|きた}です。'],
        ['**{何|なん}の**{料理|りょうり}ですか。(Bài 2)', 'Làm từ gì', '{牛肉|ぎゅうにく}の{料理|りょうり}です。'],
        ['**どこの**{料理|りょうり}ですか。(Bài 2)', 'Của nước nào', 'ベトナムの{料理|りょうり}です。'],
        ['**どんな**{料理|りょうり}ですか。', 'Món như thế nào', '{辛|から}い{料理|りょうり}です。'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp',
      lines: [
        { who: 'A', role: 'a', text: 'ハノイはどんなところですか。', ro: 'Hanoi wa donna tokoro desu ka.', vi: 'Hà Nội là nơi như thế nào?' },
        { who: 'B', role: 'b', text: 'にぎやかなところです。{古|ふる}いお{寺|てら}が{多|おお}いです。', ro: 'Nigiyaka na tokoro desu. Furui otera ga ooi desu.', vi: 'Là nơi nhộn nhịp. Có nhiều chùa cổ.' },
        { who: 'A', role: 'a', text: 'サパはどんなところですか。', ro: 'Sapa wa donna tokoro desu ka.', vi: 'Sa Pa là nơi như thế nào?' },
        { who: 'B', role: 'b', text: '{山|やま}が{多|おお}いところです。{静|しず}かです。そして、{冬|ふゆ}、とても{寒|さむ}いです。', ro: 'Yama ga ooi tokoro desu. Shizuka desu. Soshite, fuyu, totemo samui desu.', vi: 'Là nơi nhiều núi. Yên tĩnh. Và mùa đông rất lạnh.' },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc',
      items: [
        '~~どんなですか~~ → **どんなところですか** / **どんな{町|まち}ですか**. どんな luôn cần một danh từ đứng sau (giống この/その ở Bài 2).',
        'Nghe どんな mà trả lời vị trí (~~ベトナムの{北|きた}です~~) là **sai nghĩa cả câu**. どんな → tính từ.',
        'Nói "như thế nào" về cảm nhận (ngon không, thích không) thì dùng **どう** (ポイント 33), không phải どんな.',
      ],
    },

    /* ── ポイント 33 ── */
    { t: 'h', text: 'ポイント 33 — N は どうですか' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N は どうですか。',
          vi: '(1) N (bạn thấy) thế nào? — hỏi cảm nhận, tình trạng. (2) Còn N thì sao? — hỏi lại sau khi mình đã nói.',
          examples: [
            { en: '{日本|にほん}の{料理|りょうり}はどうですか。——とてもおいしいです。', ro: 'Nihon no ryouri wa dou desu ka. — Totemo oishii desu.', vi: 'Đồ ăn Nhật (bạn thấy) thế nào? — Rất ngon.' },
            { en: 'ハノイは8{月|がつ}、とても{暑|あつ}いです。モスクワはどうですか。——モスクワはあまり{暑|あつ}くないです。', ro: 'Hanoi wa hachi-gatsu, totemo atsui desu. Mosukuwa wa dou desu ka. — Mosukuwa wa amari atsuku nai desu.', vi: 'Hà Nội tháng 8 rất nóng. Moskva thì sao? — Moskva không nóng lắm.' },
            { en: '{天気|てんき}はどうですか。——{雨|あめ}です。{天気|てんき}がわるいです。', ro: 'Tenki wa dou desu ka. — Ame desu. Tenki ga warui desu.', vi: 'Thời tiết thế nào? — Mưa. Thời tiết xấu.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: nói về mình rồi hỏi lại',
      lines: [
        { who: 'リン', role: 'a', text: 'ベトナムのコーヒーは{苦|にが}いです。{韓国|かんこく}のコーヒーはどうですか。', ro: 'Betonamu no koohii wa nigai desu. Kankoku no koohii wa dou desu ka.', vi: 'Cà phê Việt đắng. Cà phê Hàn thì sao?' },
        { who: 'パク', role: 'b', text: 'あまり{苦|にが}くないです。{少|すこ}し{甘|あま}いです。', ro: 'Amari nigaku nai desu. Sukoshi amai desu.', vi: 'Không đắng lắm. Hơi ngọt.' },
        { who: 'リン', role: 'a', text: 'プサンの{冬|ふゆ}はどうですか。', ro: 'Pusan no fuyu wa dou desu ka.', vi: 'Mùa đông ở Busan thế nào?' },
        { who: 'パク', role: 'b', text: '{少|すこ}し{寒|さむ}いですが、{雪|ゆき}は{少|すく}ないです。', ro: 'Sukoshi samui desu ga, yuki wa sukunai desu.', vi: 'Hơi lạnh, nhưng tuyết thì ít. (が — ポイント 35)' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý',
      items: [
        'Câu thi rất hay gặp: **{日本|にほん}の{料理|りょうり}はどうですか** / **ベトナムの{料理|りょうり}はどうですか** → trả lời bằng **tính từ** + mức độ: とてもおいしいです。{少|すこ}し{辛|から}いです。',
        '~~どうの{料理|りょうり}~~ — không có. Muốn "món như thế nào" + danh từ thì dùng **どんな{料理|りょうり}** (ポイント 32).',
        'Đáp どうですか bằng はい／いいえ là sai: ~~はい、おいしいです~~ → **おいしいです** (câu hỏi không phải có/không).',
      ],
    },

    /* ── ポイント 34 ── */
    { t: 'h', text: 'ポイント 34 — そして' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'Câu 1。 そして、 Câu 2。',
          vi: 'Và, thêm nữa: nối hai câu CÙNG CHIỀU (thêm một ý cùng hướng tốt/xấu). そして đứng đầu câu thứ hai, sau đó có dấu phẩy.',
          examples: [
            { en: 'この{町|まち}はにぎやかです。そして、きれいです。', ro: 'Kono machi wa nigiyaka desu. Soshite, kirei desu.', vi: 'Thành phố này nhộn nhịp. Và đẹp.' },
            { en: 'ダナンは{海|うみ}がきれいです。そして、{料理|りょうり}がおいしいです。', ro: 'Danan wa umi ga kirei desu. Soshite, ryouri ga oishii desu.', vi: 'Đà Nẵng biển đẹp. Và đồ ăn ngon.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'と hay そして?',
      head: ['Nối', 'Dùng', 'Ví dụ'],
      rows: [
        ['Hai **danh từ**', '**と** (Bài 1)', '{海|うみ}**と**{山|やま}があります。'],
        ['Hai **câu** (cùng chiều)', '**そして**', '{海|うみ}がきれいです。**そして**、{山|やま}も{高|たか}いです。'],
        ['Hai **câu** (ngược chiều)', '**が** (ポイント 35)', '{小|ちい}さいです**が**、きれいです。'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc',
      items: [
        '~~{海|うみ}そして{山|やま}があります~~ → **{海|うみ}と{山|やま}があります**. そして không nối danh từ.',
        '~~{小|ちい}さいです。そして、いいところです~~ — hai ý ngược chiều (nhỏ ↔ tốt) nên dùng **が**: {小|ちい}さいですが、いいところです.',
        '~~{大|おお}きいそしてきれいです~~ → hai câu riêng: **{大|おお}きいです。そして、きれいです。** (Nối hai tính từ trong MỘT câu là thể て — Bài 8.)',
      ],
    },

    /* ── ポイント 35 ── */
    { t: 'h', text: 'ポイント 35 — ＿＿が、＿＿' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'Câu 1 （～です） が、 Câu 2。',
          vi: '…nhưng… : nối hai ý NGƯỢC CHIỀU. が đặt ngay sau です／ません của câu 1, rồi dấu phẩy.',
          examples: [
            { en: '{私|わたし}の{町|まち}は{大|おお}きくないですが、いいところです。', ro: 'Watashi no machi wa ookiku nai desu ga, ii tokoro desu.', vi: 'Thành phố tôi không lớn, nhưng là nơi tốt.' },
            { en: 'この{山|やま}は{低|ひく}いですが、きれいです。', ro: 'Kono yama wa hikui desu ga, kirei desu.', vi: 'Ngọn núi này thấp nhưng đẹp.' },
            { en: 'ミークアンは{少|すこ}し{辛|から}いですが、おいしいです。', ro: 'Miikuan wa sukoshi karai desu ga, oishii desu.', vi: 'Mì Quảng hơi cay nhưng ngon.' },
          ],
        },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp: nói thật nhưng vẫn khen',
      lines: [
        { who: 'A', role: 'a', text: 'ハノイは{静|しず}かですか。', ro: 'Hanoi wa shizuka desu ka.', vi: 'Hà Nội có yên tĩnh không?' },
        { who: 'B', role: 'b', text: 'いいえ、{静|しず}かじゃありませんが、いいところです。', ro: 'Iie, shizuka ja arimasen ga, ii tokoro desu.', vi: 'Không, không yên tĩnh, nhưng là nơi tốt.' },
        { who: 'A', role: 'a', text: 'ベトナムのコーヒーはどうですか。', ro: 'Betonamu no koohii wa dou desu ka.', vi: 'Cà phê Việt thế nào?' },
        { who: 'B', role: 'b', text: '{苦|にが}いですが、とてもおいしいです。', ro: 'Nigai desu ga, totemo oishii desu.', vi: 'Đắng nhưng rất ngon.' },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc — hai chữ が khác nhau',
      items: [
        '**が** ở ポイント 35 là **"nhưng"**, đứng **sau です** ở cuối vế câu: {低|ひく}いです**が**、… .',
        '**が** ở ポイント 24/28 là **trợ từ chủ ngữ**, đứng **sau danh từ**: {緑|みどり}**が**{多|おお}いです · {海|うみ}**が**あります.',
        'Câu có cả hai: {私|わたし}の{町|まち}は{人|ひと}**が**{少|すく}ないです**が**、にぎやかです — đọc kỹ chữ nào đứng sau cái gì.',
        '~~{高|たか}いが、きれいです~~ — ở trình độ lịch sự này giữ **です** trước が: **{高|たか}いですが**、… .',
      ],
    },

    /* ── ポイント 36 ── */
    { t: 'h', text: 'ポイント 36 — ＿＿ね' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'Câu ＋ ね。 → そうですね。',
          vi: '…nhỉ, …quá ha: tìm sự đồng tình về điều CẢ HAI cùng cảm thấy/cùng thấy. Người nghe đáp そうですね (ừ nhỉ).',
          examples: [
            { en: '{暑|あつ}いですね。——そうですね。', ro: 'Atsui desu ne. — Sou desu ne.', vi: 'Nóng nhỉ. — Ừ nhỉ.' },
            { en: 'このお{寺|てら}はきれいですね。——そうですね。', ro: 'Kono otera wa kirei desu ne. — Sou desu ne.', vi: 'Ngôi chùa này đẹp nhỉ. — Ừ nhỉ.' },
            { en: '{毎日|まいにち}、{雨|あめ}ですね。——そうですね。', ro: 'Mainichi, ame desu ne. — Sou desu ne.', vi: 'Ngày nào cũng mưa nhỉ. — Ừ nhỉ.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Ba cái đuôi câu dễ lẫn',
      head: ['Câu', 'Ngữ điệu', 'Ý'],
      rows: [
        ['{暑|あつ}いです**ね**。', 'ね kéo nhẹ, hơi lên', 'Rủ người kia đồng tình (cả hai cùng thấy nóng).'],
        ['そうです**ね**。', 'ね hạ xuống', 'Đồng tình: "ừ nhỉ".'],
        ['そうです**か**。', 'か hạ xuống', 'Nhận tin mới: "thế à" (Bài 1).'],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc',
      items: [
        'Nghe {暑|あつ}いですね mà đáp ~~はい、{暑|あつ}いです~~ nghe cứng; tự nhiên là **そうですね** (có thể thêm: そうですね。とても{暑|あつ}いです).',
        'Nghe một thông tin mới (モスクワは{涼|すず}しいです) mà đáp ~~そうですね~~ = "ừ, tôi cũng biết thế" → dùng **そうですか**.',
        'Không dùng ね để hỏi thông tin mình chưa biết: ~~{天気|てんき}はどうですね~~ → **{天気|てんき}はどうですか**.',
      ],
    },

    /* ── Tổng kết ── */
    { t: 'h', text: 'Tổng kết — các câu hỏi của Bài 4 và cách trả lời' },
    {
      t: 'table',
      head: ['Câu hỏi', 'Hỏi về', 'Trả lời mẫu', 'ポイント'],
      rows: [
        ['～は{大|おお}きいですか／{静|しず}かですか。', 'Có/không (tính từ)', 'いいえ、{大|おお}きくないです。／{静|しず}かじゃありません。', '24'],
        ['～はどんなところですか。', 'Nơi thế nào', 'にぎやかなところです。', '25, 32'],
        ['～は{夏|なつ}、{暑|あつ}いですか。', 'Thời tiết theo mùa', 'はい、とても{暑|あつ}いです。／いいえ、あまり{暑|あつ}くないです。', '26, 27'],
        ['～に{何|なに}がありますか。', 'Có gì', '{古|ふる}いお{寺|てら}があります。', '28'],
        ['～はどこですか。', 'Vị trí', 'ベトナムの{北|きた}です。', '29'],
        ['AからBまでどのくらいですか。', 'Mất bao lâu', '{飛行機|ひこうき}で5{時間|じかん}くらいです。', '30, 31'],
        ['～はどうですか。', 'Cảm nhận', 'とてもおいしいです。', '33'],
        ['{暑|あつ}いですね。', 'Rủ đồng tình', 'そうですね。', '36'],
      ],
    },

    {
      t: 'quiz',
      id: 'b4-np-chia',
      title: 'Chia tính từ — viết dạng phủ định lịch sự (～くないです／～じゃありません)',
      kind: 'fill',
      grammar: 'イA: bỏ い + くないです · いい → よくないです · ナA: + じゃありません',
      items: [
        { q: '{大|おお}きいです → ?', answers: ['大きくないです', 'おおきくないです', '大きくありません', 'おおきくありません'] },
        { q: '{暑|あつ}いです → ?', answers: ['暑くないです', 'あつくないです', '暑くありません', 'あつくありません'] },
        { q: 'いいです → ?', answers: ['よくないです', '良くないです', 'よくありません'], hint: 'Bất quy tắc!' },
        { q: '{静|しず}かです → ?', answers: ['静かじゃありません', 'しずかじゃありません', '静かではありません', 'しずかではありません', '静かじゃないです', 'しずかじゃないです'] },
        { q: 'きれいです → ?', answers: ['きれいじゃありません', 'きれいではありません', 'きれいじゃないです', '綺麗じゃありません'], hint: 'きれい là tính từ な' },
        { q: '{有名|ゆうめい}です → ?', answers: ['有名じゃありません', 'ゆうめいじゃありません', '有名ではありません', 'ゆうめいではありません', '有名じゃないです'] },
        { q: 'おいしいです → ?', answers: ['おいしくないです', 'おいしくありません', '美味しくないです'] },
        { q: '{多|おお}いです → ?', answers: ['多くないです', 'おおくないです', '多くありません'] },
        { q: 'にぎやかです → ?', answers: ['にぎやかじゃありません', 'にぎやかではありません', 'にぎやかじゃないです', '賑やかじゃありません'] },
        { q: '{新|あたら}しいです → ?', answers: ['新しくないです', 'あたらしくないです', '新しくありません'] },
      ],
    },
    {
      t: 'build',
      id: 'b4-np-ghep',
      title: 'Ghép câu — dùng đủ 13 điểm ngữ pháp',
      items: [
        { vi: 'Thành phố tôi nhiều cây xanh.', chips: ['{私|わたし}の', '{町|まち}', 'は', '{緑|みどり}', 'が', '{多|おお}いです', 'に', 'を'], answer: ['{私|わたし}の', '{町|まち}', 'は', '{緑|みどり}', 'が', '{多|おお}いです'], ro: 'Watashi no machi wa midori ga ooi desu.' },
        { vi: 'Món này không cay.', chips: ['この', '{料理|りょうり}', 'は', '{辛|から}くないです', '{辛|から}いくないです', '{辛|から}いじゃありません'], answer: ['この', '{料理|りょうり}', 'は', '{辛|から}くないです'], ro: 'Kono ryouri wa karaku nai desu.' },
        { vi: 'Đà Nẵng là một thành phố đẹp.', chips: ['ダナン', 'は', 'きれいな', '{町|まち}', 'です', 'きれい', 'の'], answer: ['ダナン', 'は', 'きれいな', '{町|まち}', 'です'], ro: 'Danan wa kirei na machi desu.' },
        { vi: 'Hà Nội mùa hè rất nóng.', chips: ['ハノイ', 'は', '{夏|なつ}、', 'とても', '{暑|あつ}いです', 'あまり', '{熱|あつ}いです'], answer: ['ハノイ', 'は', '{夏|なつ}、', 'とても', '{暑|あつ}いです'], ro: 'Hanoi wa natsu, totemo atsui desu.' },
        { vi: 'Công viên này không lớn lắm.', chips: ['この', '{公園|こうえん}', 'は', 'あまり', '{大|おお}きくないです', 'とても', '{大|おお}きいです'], answer: ['この', '{公園|こうえん}', 'は', 'あまり', '{大|おお}きくないです'], ro: 'Kono kouen wa amari ookiku nai desu.' },
        { vi: 'Ở thành phố tôi có một con sông đẹp.', chips: ['{私|わたし}の', '{町|まち}', 'に', 'きれいな', '{川|かわ}', 'が', 'あります', 'で'], answer: ['{私|わたし}の', '{町|まち}', 'に', 'きれいな', '{川|かわ}', 'が', 'あります'], ro: 'Watashi no machi ni kirei na kawa ga arimasu.' },
        { vi: 'Hà Nội ở phía bắc Việt Nam.', chips: ['ハノイ', 'は', 'ベトナム', 'の', '{北|きた}', 'です', '{南|みなみ}', 'に'], answer: ['ハノイ', 'は', 'ベトナム', 'の', '{北|きた}', 'です'], ro: 'Hanoi wa Betonamu no kita desu.' },
        { vi: 'Từ Hà Nội đến Đà Nẵng mất bao lâu?', chips: ['ハノイ', 'から', 'ダナン', 'まで', 'どのくらい', 'ですか', 'どんな', 'で'], answer: ['ハノイ', 'から', 'ダナン', 'まで', 'どのくらい', 'ですか'], ro: 'Hanoi kara Danan made dono kurai desu ka.' },
        { vi: 'Đi máy bay khoảng 5 tiếng rưỡi.', chips: ['{飛行機|ひこうき}', 'で', '5{時間半|じかんはん}', 'くらい', 'です', 'を', '5{時半|じはん}'], answer: ['{飛行機|ひこうき}', 'で', '5{時間半|じかんはん}', 'くらい', 'です'], ro: 'Hikouki de go-jikan han kurai desu.' },
        { vi: 'Từ ga đến trường đi bộ 10 phút.', chips: ['{駅|えき}', 'から', '{学校|がっこう}', 'まで', '{歩|ある}いて', '10{分|ぷん}', 'です', 'で'], answer: ['{駅|えき}', 'から', '{学校|がっこう}', 'まで', '{歩|ある}いて', '10{分|ぷん}', 'です'], ro: 'Eki kara gakkou made aruite juppun desu.' },
        { vi: 'Hội An là nơi như thế nào?', chips: ['ホイアン', 'は', 'どんな', 'ところ', 'ですか', 'どう', 'どこ'], answer: ['ホイアン', 'は', 'どんな', 'ところ', 'ですか'], ro: 'Hoian wa donna tokoro desu ka.' },
        { vi: 'Đồ ăn Nhật (bạn thấy) thế nào?', chips: ['{日本|にほん}', 'の', '{料理|りょうり}', 'は', 'どう', 'ですか', 'どんな'], answer: ['{日本|にほん}', 'の', '{料理|りょうり}', 'は', 'どう', 'ですか'], ro: 'Nihon no ryouri wa dou desu ka.' },
        { vi: 'Thành phố này nhộn nhịp. Và đẹp.', chips: ['この', '{町|まち}', 'は', 'にぎやかです。', 'そして、', 'きれいです。', 'と', 'が、'], answer: ['この', '{町|まち}', 'は', 'にぎやかです。', 'そして、', 'きれいです。'], ro: 'Kono machi wa nigiyaka desu. Soshite, kirei desu.' },
        { vi: 'Thành phố tôi không lớn nhưng là nơi tốt.', chips: ['{私|わたし}の', '{町|まち}', 'は', '{大|おお}きくないです', 'が、', 'いい', 'ところ', 'です', 'そして、'], answer: ['{私|わたし}の', '{町|まち}', 'は', '{大|おお}きくないです', 'が、', 'いい', 'ところ', 'です'], ro: 'Watashi no machi wa ookiku nai desu ga, ii tokoro desu.' },
        { vi: 'Lạnh nhỉ. (rủ đồng tình)', chips: ['{寒|さむ}い', 'です', 'ね', 'か', '{冷|つめ}たい'], answer: ['{寒|さむ}い', 'です', 'ね'], ro: 'Samui desu ne.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-np-kiem',
      title: 'Kiểm tra nhanh ngữ pháp Bài 4',
      items: [
        { q: 'Phủ định của 「{大|おお}きいです」:', options: ['{大|おお}きいじゃありません', '{大|おお}きくないです', '{大|おお}きいくないです', '{大|おお}きくじゃありません'], correct: 1, why: 'Tính từ い: bỏ い + **くないです** (ポイント 24).' },
        { q: 'Phủ định của 「きれいです」:', options: ['きれくないです', 'きれいくないです', 'きれいじゃありません', 'きれいないです'], correct: 2, why: 'きれい là **tính từ な** → じゃありません.' },
        { q: 'Phủ định của 「いいです」:', options: ['いくないです', 'いいくないです', 'よくないです', 'いいじゃありません'], correct: 2, why: 'Bất quy tắc: いい → **よくない**.' },
        { q: '「ハノイは＿＿{町|まち}です。」 (nhộn nhịp)', options: ['にぎやか', 'にぎやかな', 'にぎやかの', 'にぎやかい'], correct: 1, why: 'Tính từ な + danh từ → **な** (ポイント 25).' },
        { q: '「これは＿＿お{寺|てら}です。」 (cổ)', options: ['{古|ふる}いな', '{古|ふる}いの', '{古|ふる}い', '{古|ふる}く'], correct: 2, why: 'Tính từ い đứng thẳng trước danh từ (ポイント 25).' },
        { q: '「{私|わたし}の{町|まち}は{夏|なつ}、＿＿{暑|あつ}くないです。」', options: ['とても', '{少|すこ}し', 'あまり', 'そして'], correct: 2, why: 'Câu phủ định "không … lắm" → **あまり** (ポイント 27).' },
        { q: '「ダナン＿＿{海|うみ}があります。」', options: ['で', 'に', 'を', 'の'], correct: 1, why: 'Nơi tồn tại → **に** (ポイント 28).' },
        { q: '「ハノイはベトナム＿＿{北|きた}です。」', options: ['に', 'の', 'で', 'が'], correct: 1, why: 'Nước **の** hướng (ポイント 29).' },
        { q: '「{東京|とうきょう}から{大阪|おおさか}まで＿＿ですか。」 (mất bao lâu)', options: ['いくら', 'どのくらい', 'どんな', 'いつ'], correct: 1, why: 'Hỏi thời gian đi đường → **どのくらい** (ポイント 30).' },
        { q: '「うちから{駅|えき}まで＿＿10{分|ぷん}です。」 (đi bộ)', options: ['{歩|ある}いてで', '{歩|ある}いて', '{足|あし}で', '{歩|ある}くで'], correct: 1, why: '**歩いて**, không có で (ポイント 31).' },
        { q: '「ホイアンは＿＿ところですか。」 —「{静|しず}かなところです。」', options: ['どう', 'どこ', 'どんな', '{何|なん}の'], correct: 2, why: '**どんな** + N (ポイント 32).' },
        { q: '「{私|わたし}の{国|くに}は8{月|がつ}、{暑|あつ}いです。Bさんの{国|くに}は＿＿ですか。」', options: ['どんな', 'どう', 'どこ', 'どの'], correct: 1, why: 'Hỏi lại "còn … thì sao?" → **どうですか** (ポイント 33).' },
        { q: 'Nối "Biển đẹp. Và đồ ăn ngon." :', options: ['{海|うみ}がきれいです。と、{料理|りょうり}がおいしいです。', '{海|うみ}がきれいです。そして、{料理|りょうり}がおいしいです。', '{海|うみ}がきれいですが、{料理|りょうり}がおいしいです。', '{海|うみ}がきれいです。の{料理|りょうり}がおいしいです。'], correct: 1, why: 'Hai câu cùng chiều → **そして** (ポイント 34).' },
        { q: '「この{山|やま}は{低|ひく}いです＿＿、きれいです。」', options: ['そして', 'が', 'と', 'ね'], correct: 1, why: 'Ngược chiều (thấp ↔ đẹp) → **が** "nhưng" (ポイント 35).' },
        { q: '「{暑|あつ}いですね。」 Câu đáp tự nhiên nhất:', options: ['そうですか。', 'そうですね。', 'いいえ、{暑|あつ}いです。', 'どうですか。'], correct: 1, why: 'Đồng tình → **そうですね** (ポイント 36).' },
      ],
    },
  ],
};

/* ═══════════════════════════ 4. CHỮ HÁN ═══════════════════════════ */

const KANJI: Lesson = {
  id: 'b4-kanji',
  kind: 'kanji',
  title: 'Chữ Hán — trong từ vựng Bài 4',
  goal: 'Đọc được mọi chữ Hán trong từ vựng Bài 4 (hướng, phương tiện, cảnh vật, tính từ, thời tiết, mùi vị) và phân biệt ba cặp đồng âm 暑/熱 · 暖/温 · 寒/冷.',
  minutes: 30,
  blocks: [
    {
      t: 'p',
      text: 'Bài 4 có nhiều chữ Hán nhất từ đầu khoá, nhưng phần lớn là **tính từ** — chữ Hán + đuôi kana (大**きい**, 静**か**). Mẹo đọc: chữ Hán trong tính từ gần như luôn đọc **âm Kun** (âm Nhật): 大きい おおきい, 暑い あつい. Phần Reading của đề có **4 từ chữ Hán gạch chân không furigana** — các chữ dưới đây rất hay vào đề.',
    },
    {
      t: 'table',
      caption: 'Nhóm 1 — Phương hướng, vị trí',
      head: ['Chữ', 'Hán Việt', 'Âm On (音)', 'Âm Kun (訓)', 'Từ trong bài'],
      rows: [
        ['北', 'BẮC', 'ほく', 'きた', '{北|きた} · {北海道|ほっかいどう}'],
        ['南', 'NAM', 'なん', 'みなみ', '{南|みなみ}'],
        ['東', 'ĐÔNG', 'とう', 'ひがし', '{東|ひがし} · {東京|とうきょう}'],
        ['西', 'TÂY', 'せい・さい', 'にし', '{西|にし} · {西川|にしかわ}'],
        ['真', 'CHÂN', 'しん', 'ま', '{真|ま}ん{中|なか}'],
        ['中', 'TRUNG', 'ちゅう・じゅう', 'なか', '{真|ま}ん{中|なか} · {一年中|いちねんじゅう} · {中国|ちゅうごく}'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm 2 — Phương tiện, đường đi, thời gian',
      head: ['Chữ', 'Hán Việt', 'Âm On (音)', 'Âm Kun (訓)', 'Từ trong bài'],
      rows: [
        ['車', 'XA', 'しゃ', 'くるま', '{車|くるま} · {電車|でんしゃ}'],
        ['電', 'ĐIỆN', 'でん', '—', '{電車|でんしゃ} · {電話|でんわ}'],
        ['新', 'TÂN', 'しん', 'あたら(しい)', '{新幹線|しんかんせん} · {新|あたら}しい'],
        ['幹', 'CÁN', 'かん', 'みき', '{新幹線|しんかんせん}'],
        ['線', 'TUYẾN', 'せん', '—', '{新幹線|しんかんせん}'],
        ['飛', 'PHI', 'ひ', 'と(ぶ)', '{飛行機|ひこうき}'],
        ['行', 'HÀNH', 'こう', 'い(く)', '{飛行機|ひこうき} · {行|い}きます'],
        ['機', 'CƠ', 'き', '—', '{飛行機|ひこうき}'],
        ['駅', 'DỊCH', 'えき', '—', '{駅|えき}'],
        ['町', 'ĐINH', 'ちょう', 'まち', '{町|まち}'],
        ['時', 'THỜI', 'じ', 'とき', '～{時間|じかん} · ～{時|じ}'],
        ['間', 'GIAN', 'かん', 'あいだ', '～{時間|じかん}'],
        ['半', 'BÁN', 'はん', 'なか(ば)', '～{時間半|じかんはん}'],
        ['分', 'PHÂN', 'ふん・ぷん', 'わ(ける)', '～{分|ふん}'],
        ['歩', 'BỘ', 'ほ', 'ある(く)', '{歩|ある}いて'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm 3 — Cảnh vật, công trình',
      head: ['Chữ', 'Hán Việt', 'Âm On (音)', 'Âm Kun (訓)', 'Từ trong bài'],
      rows: [
        ['温', 'ÔN', 'おん', 'あたた(かい)', '{温泉|おんせん} · {温|あたた}かい'],
        ['泉', 'TUYỀN', 'せん', 'いずみ', '{温泉|おんせん}'],
        ['川', 'XUYÊN', 'せん', 'かわ', '{川|かわ}'],
        ['山', 'SƠN', 'さん', 'やま', '{山|やま} · {富士山|ふじさん}'],
        ['教', 'GIÁO', 'きょう', 'おし(える)', '{教会|きょうかい} · {教師|きょうし}'],
        ['会', 'HỘI', 'かい', 'あ(う)', '{教会|きょうかい} · {会社|かいしゃ}'],
        ['城', 'THÀNH', 'じょう', 'しろ', 'お{城|しろ}'],
        ['神', 'THẦN', 'しん・じん', 'かみ', '{神社|じんじゃ}'],
        ['社', 'XÃ', 'しゃ (じゃ)', 'やしろ', '{神社|じんじゃ} · {会社|かいしゃ}'],
        ['寺', 'TỰ', 'じ', 'てら', 'お{寺|てら}'],
        ['人', 'NHÂN', 'じん・にん', 'ひと', '{人|ひと} · ベトナム{人|じん}'],
        ['緑', 'LỤC', 'りょく', 'みどり', '{緑|みどり}'],
        ['有', 'HỮU', 'ゆう', 'あ(る)', '{有名|ゆうめい}'],
        ['名', 'DANH', 'めい', 'な', '{有名|ゆうめい} · お{名前|なまえ}'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm 4 — Tính từ miêu tả nơi chốn',
      head: ['Chữ', 'Hán Việt', 'Âm On (音)', 'Âm Kun (訓)', 'Từ trong bài'],
      rows: [
        ['古', 'CỔ', 'こ', 'ふる(い)', '{古|ふる}い'],
        ['多', 'ĐA', 'た', 'おお(い)', '{多|おお}い'],
        ['少', 'THIỂU', 'しょう', 'すく(ない)・すこ(し)', '{少|すく}ない · {少|すこ}し'],
        ['大', 'ĐẠI', 'だい・たい', 'おお(きい)', '{大|おお}きい · {大学|だいがく}'],
        ['小', 'TIỂU', 'しょう', 'ちい(さい)', '{小|ちい}さい'],
        ['高', 'CAO', 'こう', 'たか(い)', '{高|たか}い · {高校|こうこう}'],
        ['低', 'ĐÊ', 'てい', 'ひく(い)', '{低|ひく}い'],
        ['静', 'TĨNH', 'せい', 'しず(か)', '{静|しず}か'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm 5 — Thời tiết, nhiệt độ, mùi vị',
      head: ['Chữ', 'Hán Việt', 'Âm On (音)', 'Âm Kun (訓)', 'Từ trong bài'],
      rows: [
        ['雨', 'VŨ', 'う', 'あめ', '{雨|あめ}'],
        ['雪', 'TUYẾT', 'せつ', 'ゆき', '{雪|ゆき}'],
        ['日', 'NHẬT', 'にち・じつ', 'ひ・か', '{日|ひ} · {日本|にほん}'],
        ['天', 'THIÊN', 'てん', 'あめ・あま', '{天気|てんき}'],
        ['気', 'KHÍ', 'き', '—', '{天気|てんき}'],
        ['暖', 'NOÃN', 'だん', 'あたた(かい)', '{暖|あたた}かい (trời ấm)'],
        ['涼', 'LƯƠNG', 'りょう', 'すず(しい)', '{涼|すず}しい'],
        ['暑', 'THỬ', 'しょ', 'あつ(い)', '{暑|あつ}い (trời nóng)'],
        ['寒', 'HÀN', 'かん', 'さむ(い)', '{寒|さむ}い'],
        ['熱', 'NHIỆT', 'ねつ', 'あつ(い)', '{熱|あつ}い (đồ nóng)'],
        ['冷', 'LÃNH', 'れい', 'つめ(たい)', '{冷|つめ}たい'],
        ['甘', 'CAM', 'かん', 'あま(い)', '{甘|あま}い'],
        ['辛', 'TÂN', 'しん', 'から(い)', '{辛|から}い'],
        ['苦', 'KHỔ', 'く', 'にが(い)', '{苦|にが}い'],
        ['年', 'NIÊN', 'ねん', 'とし', '{一年中|いちねんじゅう}'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ',
      items: [
        '**Hán Việt đoán nghĩa**: 温泉 = ÔN TUYỀN (suối ấm), 有名 = HỮU DANH (có tên tuổi), 新幹線 = TÂN CÁN TUYẾN (tuyến trục mới), 飛行機 = PHI HÀNH CƠ (máy bay), 天気 = THIÊN KHÍ (khí trời), 教会 = GIÁO HỘI.',
        '**暑 (THỬ) và 寒 (HÀN)** — trời nóng/lạnh, trên đầu chữ 暑 có 日 (mặt trời). **熱 (NHIỆT)** — vật nóng, dưới chân có 4 chấm lửa 灬. **冷 (LÃNH)** — vật lạnh, bên trái có bộ băng 冫.',
        '**暖 (NOÃN)** có bộ 日 (mặt trời) → trời ấm. **温 (ÔN)** có bộ 氵 (nước) → nước/súp ấm.',
        '**東京** = "kinh đô phía ĐÔNG" (東 ĐÔNG + 京 KINH), còn **京都** là kinh đô cũ phía tây. Nhớ 東 là nhớ luôn hướng đông.',
        '**社** đọc しゃ trong 会社 nhưng **じゃ** trong 神社 (biến âm). **人** đọc ひと khi đứng một mình, じん sau tên nước.',
      ],
    },
    {
      t: 'mcq',
      id: 'b4-kj-doc',
      title: 'Đọc chữ Hán — chọn cách đọc đúng',
      items: [
        { q: '北', options: ['みなみ', 'きた', 'ひがし', 'にし'], correct: 1, why: '**きた** — phía bắc.' },
        { q: '東', options: ['ひがし', 'にし', 'とう', 'みなみ'], correct: 0, why: 'Đứng một mình đọc Kun **ひがし**; とう là âm On (東京 とうきょう).' },
        { q: '真ん中', options: ['しんなか', 'まんなか', 'まなか', 'まんちゅう'], correct: 1, why: '**まんなか** — chính giữa.' },
        { q: '新幹線', options: ['しんかんせん', 'あたらかんせん', 'しんかせん', 'しんがんせん'], correct: 0, why: '**しんかんせん**.' },
        { q: '飛行機', options: ['ひこき', 'ひこうき', 'ひぎょうき', 'とびこうき'], correct: 1, why: '**ひこうき** — こう là trường âm.' },
        { q: '電車', options: ['でんくるま', 'でんしゃ', 'てんしゃ', 'でんじゃ'], correct: 1, why: '**でんしゃ** — tàu điện.' },
        { q: '駅', options: ['えき', 'いき', 'えぎ', 'やく'], correct: 0, why: '**えき** — nhà ga.' },
        { q: '温泉', options: ['おんせん', 'おんぜん', 'あたたせん', 'おせん'], correct: 0, why: '**おんせん** — suối nước nóng.' },
        { q: '教会', options: ['きょかい', 'きょうかい', 'きょうがい', 'おしかい'], correct: 1, why: '**きょうかい** — nhà thờ.' },
        { q: '神社', options: ['しんしゃ', 'かみしゃ', 'じんじゃ', 'じんしゃ'], correct: 2, why: '**じんじゃ** — 神 đọc じん, 社 biến âm しゃ → じゃ.' },
        { q: '有名', options: ['ゆうめい', 'ゆめい', 'ありな', 'ゆうな'], correct: 0, why: '**ゆうめい** — nổi tiếng.' },
        { q: '緑', options: ['みどり', 'りょく', 'みとり', 'あお'], correct: 0, why: '**みどり** — màu xanh lá, cây xanh.' },
        { q: '静か', options: ['しずか', 'せいか', 'しづか', 'じずか'], correct: 0, why: '**しずか** — yên tĩnh.' },
        { q: '少ない', options: ['すこない', 'すくない', 'しょうない', 'ちいない'], correct: 1, why: '**すくない** (ít). Còn 少し đọc すこし.' },
        { q: '低い', options: ['ひくい', 'たかい', 'ていい', 'ひろい'], correct: 0, why: '**ひくい** — thấp.' },
        { q: '一年中', options: ['いちねんちゅう', 'いちねんじゅう', 'ひとねんじゅう', 'いちとしじゅう'], correct: 1, why: '中 sau khoảng thời gian đọc **じゅう**: いちねんじゅう (suốt 1 năm).' },
        { q: '涼しい', options: ['すずしい', 'りょうしい', 'すすしい', 'さむしい'], correct: 0, why: '**すずしい** — mát mẻ.' },
        { q: '冷たい', options: ['れいたい', 'さむたい', 'つめたい', 'ひたい'], correct: 2, why: '**つめたい** — lạnh (đồ vật).' },
        { q: '辛い', options: ['あまい', 'からい', 'にがい', 'しんい'], correct: 1, why: '**からい** — cay.' },
        { q: '天気', options: ['てんき', 'てんけ', 'あまき', 'でんき'], correct: 0, why: '**てんき** — thời tiết. (でんき 電気 = điện — khác!)' },
        { q: '3時間半', options: ['さんじはん', 'さんじかんはん', 'みじかんはん', 'さんじかんばん'], correct: 1, why: '**さんじかんはん** = 3 tiếng rưỡi. さんじはん (3時半) = 3 giờ rưỡi.' },
        { q: 'Trời nóng — chữ đúng là:', options: ['熱い', '暑い', '厚い', '温い'], correct: 1, why: 'Thời tiết nóng: **暑い**. 熱い là đồ vật nóng.' },
        { q: 'Súp ấm — chữ đúng là:', options: ['暖かいスープ', '温かいスープ', '暑いスープ', '涼しいスープ'], correct: 1, why: 'Đồ ăn uống ấm: **温かい** (bộ 氵 nước).' },
      ],
    },
    {
      t: 'write',
      id: 'b4-viet-kanji',
      title: 'Tập viết tay 58 chữ Hán của Bài 4',
      note: 'Mỗi nhóm 10 chữ (bấm dải chữ để chuyển nhóm). Bấm ▶ Thứ tự nét trước khi viết — chữ Hán viết đúng thứ tự (trên → dưới, trái → phải, ngang trước sổ sau) thì cân và đẹp. Viết xong nhờ ✨ AI xem chữ.',
      chars: ['北', '南', '東', '西', '真', '中', '車', '電', '新', '幹', '線', '飛', '行', '機', '駅', '町', '時', '間', '半', '分', '歩', '温', '泉', '川', '山', '教', '会', '城', '神', '社', '寺', '人', '緑', '有', '名', '古', '多', '少', '大', '小', '高', '低', '静', '雨', '雪', '日', '天', '気', '暖', '涼', '暑', '寒', '熱', '冷', '甘', '辛', '苦', '年'],
    },
  ],
};

/* ═══════════════════════════ 5. NGHE ═══════════════════════════ */

const NGHE: Lesson = {
  id: 'b4-nghe',
  kind: 'listening',
  title: 'Luyện nghe — vị trí, thời gian đi đường, nơi chốn, thời tiết, món ăn',
  goal: 'Nghe và bắt đúng hướng (北・南…), số giờ/phút và phương tiện, tính từ miêu tả (khẳng định hay phủ định), thời tiết theo tháng và mùi vị món ăn.',
  minutes: 40,
  blocks: [
    {
      t: 'note',
      title: 'Cách nghe Bài 4',
      items: [
        'Đọc **câu hỏi trước**, biết mình cần bắt: hướng? số giờ? tính từ? — rồi mới bấm nghe.',
        'Bẫy lớn nhất của bài: **đuôi câu**. {大|おお}きいです hay {大|おお}き**くない**です, にぎやかです hay にぎやか**じゃありません** — nghĩa ngược hẳn nhau, và phần quyết định nằm ở **cuối** câu. Nghe đến hết câu rồi mới chọn.',
        'Nghe **あまり** là biết câu sắp phủ định; nghe **が、** giữa câu là biết vế sau sẽ ngược ý vế trước.',
        '{時|じ} (giờ) ≠ {時間|じかん} (tiếng): ろくじ = 6 giờ, ろくじかん = 6 tiếng.',
      ],
    },

    { t: 'h', text: 'Bài 1 — Quê của Wang ở đâu? (やってみよう)' },
    {
      t: 'listen',
      id: 'b4-ng-1',
      title: 'Wang nói về nước mình',
      note: 'Nghe: thành phố của Wang ở phía nào của Trung Quốc, đi từ Tokyo mất bao lâu, bằng gì.',
      lines: [
        { who: '{木村|きむら}', voice: 'ja-nu', text: 'ワンさんのお{国|くに}は{中国|ちゅうごく}ですね。{中国|ちゅうごく}のどこですか。', ro: 'Wan-san no okuni wa Chuugoku desu ne. Chuugoku no doko desu ka.', vi: 'Nước của Wang là Trung Quốc nhỉ. Ở đâu của Trung Quốc?' },
        { who: 'ワン', voice: 'ja-nu', text: 'シャンハイです。', ro: 'Shanhai desu.', vi: 'Thượng Hải.' },
        { who: '{木村|きむら}', voice: 'ja-nu', text: 'シャンハイは{中国|ちゅうごく}の{北|きた}ですか。', ro: 'Shanhai wa Chuugoku no kita desu ka.', vi: 'Thượng Hải ở phía bắc Trung Quốc à?' },
        { who: 'ワン', voice: 'ja-nu', text: 'いいえ、{北|きた}じゃありません。{東|ひがし}です。', ro: 'Iie, kita ja arimasen. Higashi desu.', vi: 'Không, không phải phía bắc. Phía đông.' },
        { who: '{木村|きむら}', voice: 'ja-nu', text: '{東京|とうきょう}からシャンハイまでどのくらいですか。', ro: 'Toukyou kara Shanhai made dono kurai desu ka.', vi: 'Từ Tokyo đến Thượng Hải mất bao lâu?' },
        { who: 'ワン', voice: 'ja-nu', text: '{飛行機|ひこうき}で3{時間|じかん}くらいです。', ro: 'Hikouki de san-jikan kurai desu.', vi: 'Máy bay khoảng 3 tiếng.' },
        { who: '{木村|きむら}', voice: 'ja-nu', text: 'へえ、3{時間|じかん}ですか。', ro: 'Hee, san-jikan desu ka.', vi: 'Chà, 3 tiếng thôi à.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-ng-1-q',
      title: 'Câu hỏi bài 1',
      items: [
        { q: 'シャンハイは{中国|ちゅうごく}のどこですか。', options: ['{北|きた}', '{南|みなみ}', '{東|ひがし}', '{西|にし}'], correct: 2, why: 'Bẫy: 木村 đoán {北|きた} → いいえ、{北|きた}じゃありません。**{東|ひがし}**です。' },
        { q: '{東京|とうきょう}からシャンハイまでどのくらいですか。', options: ['{飛行機|ひこうき}で3{時間|じかん}', '{飛行機|ひこうき}で3{時|じ}', '{飛行機|ひこうき}で13{時間|じかん}', '{新幹線|しんかんせん}で3{時間|じかん}'], correct: 0, why: '{飛行機|ひこうき}で**さんじかん**くらいです。' },
      ],
    },

    { t: 'h', text: 'Bài 2 — Từ nhà đến trường' },
    {
      t: 'listen',
      id: 'b4-ng-2',
      title: 'Ba người đi học thế nào?',
      note: 'Ghi lại mỗi người đi bằng gì và mất bao lâu.',
      lines: [
        { who: '{先生|せんせい}', voice: 'ja-nam', text: 'マルコさん、うちから{学校|がっこう}までどのくらいですか。', ro: 'Maruko-san, uchi kara gakkou made dono kurai desu ka.', vi: 'Marco, từ nhà em đến trường mất bao lâu?' },
        { who: 'マルコ', voice: 'ja-nam', text: '{電車|でんしゃ}で25{分|ふん}くらいです。', ro: 'Densha de nijuugo-fun kurai desu.', vi: 'Đi tàu điện khoảng 25 phút.' },
        { who: '{先生|せんせい}', voice: 'ja-nam', text: 'アンナさんは？', ro: 'Anna-san wa?', vi: 'Còn Anna?' },
        { who: 'アンナ', voice: 'ja-nu', text: '{私|わたし}はバスで1{時間|じかん}くらいです。', ro: 'Watashi wa basu de ichi-jikan kurai desu.', vi: 'Em đi xe buýt khoảng 1 tiếng.' },
        { who: '{先生|せんせい}', voice: 'ja-nam', text: '1{時間|じかん}ですか。そうですか。リンさんは？', ro: 'Ichi-jikan desu ka. Sou desu ka. Rin-san wa?', vi: '1 tiếng à. Thế à. Còn Linh?' },
        { who: 'リン', voice: 'ja-nu', text: '{私|わたし}はうちから{学校|がっこう}まで{歩|ある}いて8{分|ぷん}です。', ro: 'Watashi wa uchi kara gakkou made aruite happun desu.', vi: 'Em từ nhà đến trường đi bộ 8 phút.' },
        { who: '{先生|せんせい}', voice: 'ja-nam', text: 'いいですね。', ro: 'Ii desu ne.', vi: 'Thích nhỉ.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b4-ng-2-q',
      title: 'Mỗi người mất bao nhiêu phút? (viết số phút)',
      kind: 'fill',
      items: [
        { q: 'マルコさん ({電車|でんしゃ})', answers: ['25', '25分', '２５', '２５分', 'にじゅうごふん'] },
        { q: 'アンナさん (バス)', answers: ['60', '60分', '６０', '1時間', '１時間', 'いちじかん'] },
        { q: 'リンさん ({歩|ある}いて)', answers: ['8', '8分', '８', '８分', 'はっぷん', 'はちふん'] },
        { q: 'Ai đi bộ? (viết tên bằng katakana)', answers: ['リン', 'リンさん'] },
      ],
    },

    { t: 'h', text: 'Bài 3 — Thành phố của bốn người (どんなところ？)' },
    {
      t: 'listen',
      id: 'b4-ng-3',
      title: 'Bốn người kể về thành phố của mình',
      note: 'Nghe từng người và chọn câu miêu tả đúng. Chú ý đuôi khẳng định / phủ định.',
      lines: [
        { who: 'マルコ', voice: 'ja-nam', text: '{私|わたし}の{町|まち}はミラノです。イタリアの{北|きた}です。とてもにぎやかな{町|まち}です。{有名|ゆうめい}な{教会|きょうかい}があります。', ro: 'Watashi no machi wa Mirano desu. Itaria no kita desu. Totemo nigiyaka na machi desu. Yuumei na kyoukai ga arimasu.', vi: 'Thành phố của tôi là Milano. Ở phía bắc nước Ý. Là thành phố rất nhộn nhịp. Có nhà thờ nổi tiếng.' },
        { who: 'パク', voice: 'ja-nu', text: '{私|わたし}の{町|まち}はプサンです。{韓国|かんこく}の{南|みなみ}です。{海|うみ}があります。{海|うみ}はとてもきれいです。', ro: 'Watashi no machi wa Pusan desu. Kankoku no minami desu. Umi ga arimasu. Umi wa totemo kirei desu.', vi: 'Thành phố của tôi là Busan. Ở phía nam Hàn Quốc. Có biển. Biển rất đẹp.' },
        { who: '{木村|きむら}', voice: 'ja-nu', text: '{私|わたし}の{町|まち}は{北海道|ほっかいどう}です。{日本|にほん}の{北|きた}です。{町|まち}は{大|おお}きくないですが、{緑|みどり}が{多|おお}いです。{冬|ふゆ}、{雪|ゆき}が{多|おお}いです。', ro: 'Watashi no machi wa Hokkaidou desu. Nihon no kita desu. Machi wa ookiku nai desu ga, midori ga ooi desu. Fuyu, yuki ga ooi desu.', vi: 'Quê tôi ở Hokkaido. Phía bắc Nhật Bản. Thị trấn không lớn nhưng nhiều cây xanh. Mùa đông tuyết nhiều.' },
        { who: '{西川|にしかわ}', voice: 'ja-nam', text: '{私|わたし}の{町|まち}は{京都|きょうと}です。{古|ふる}いお{寺|てら}や{神社|じんじゃ}などがあります。{人|ひと}が{多|おお}いです。あまり{静|しず}かじゃありません。', ro: 'Watashi no machi wa Kyouto desu. Furui otera ya jinja nado ga arimasu. Hito ga ooi desu. Amari shizuka ja arimasen.', vi: 'Thành phố của tôi là Kyoto. Có chùa cổ, đền, v.v. Đông người. Không yên tĩnh lắm.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-ng-3-q',
      title: 'Câu hỏi bài 3',
      items: [
        { q: 'マルコさんの{町|まち}はどんなところですか。', options: ['{静|しず}かなところ', 'にぎやかなところ', '{小|ちい}さい{町|まち}', '{雪|ゆき}が{多|おお}いところ'], correct: 1, why: 'とても**にぎやかな**{町|まち}です。' },
        { q: 'プサンに{何|なに}がありますか。', options: ['{山|やま}', '{温泉|おんせん}', '{海|うみ}', '{教会|きょうかい}'], correct: 2, why: '**{海|うみ}**があります。' },
        { q: '{木村|きむら}さんの{町|まち}は{大|おお}きいですか。', options: ['はい、とても{大|おお}きいです。', 'いいえ、{大|おお}きくないです。', 'Không nói', 'はい、{少|すこ}し{大|おお}きいです。'], correct: 1, why: '{大|おお}き**くない**ですが、{緑|みどり}が{多|おお}いです — nghe hết câu!' },
        { q: '{京都|きょうと}は{静|しず}かですか。', options: ['はい、とても{静|しず}かです。', 'いいえ、あまり{静|しず}かじゃありません。', 'はい、{少|すこ}し{静|しず}かです。', 'Không nói'], correct: 1, why: '{人|ひと}が{多|おお}いです。**あまり{静|しず}かじゃありません**。' },
        { q: 'Thành phố nào ở phía bắc của nước mình? (chọn cặp đúng)', options: ['ミラノ と {北海道|ほっかいどう}', 'プサン と {京都|きょうと}', 'ミラノ と プサン', '{北海道|ほっかいどう} と プサン'], correct: 0, why: 'ミラノ: イタリアの**{北|きた}**; {北海道|ほっかいどう}: {日本|にほん}の**{北|きた}**. プサン là **{南|みなみ}**.' },
      ],
    },

    { t: 'h', text: 'Bài 4 — Thời tiết theo tháng' },
    {
      t: 'listen',
      id: 'b4-ng-4',
      title: 'Dự báo quê hai người',
      note: 'Nghe và điền tính từ còn thiếu (viết bằng hiragana).',
      lines: [
        { who: 'ダニエル', voice: 'ja-nam', text: '{私|わたし}の{町|まち}はパースです。パースは12{月|がつ}、{暑|あつ}いです。{雨|あめ}が{少|すく}ないです。{天気|てんき}がいい{日|ひ}、{公園|こうえん}でバーベキューをします。', ro: 'Watashi no machi wa Paasu desu. Paasu wa juuni-gatsu, atsui desu. Ame ga sukunai desu. Tenki ga ii hi, kouen de baabekyuu o shimasu.', vi: 'Thành phố tôi là Perth. Perth tháng 12 nóng. Ít mưa. Ngày đẹp trời, tôi nướng BBQ ở công viên.' },
        { who: 'リン', voice: 'ja-nu', text: 'ハノイは1{月|がつ}、{少|すこ}し{寒|さむ}いです。{雪|ゆき}はありません。{寒|さむ}い{日|ひ}、{温|あたた}かいフォーを{食|た}べます。とてもおいしいです。', ro: 'Hanoi wa ichi-gatsu, sukoshi samui desu. Yuki wa arimasen. Samui hi, atatakai foo o tabemasu. Totemo oishii desu.', vi: 'Hà Nội tháng 1 hơi lạnh. Không có tuyết. Ngày lạnh, tôi ăn phở nóng. Rất ngon.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b4-ng-4-q',
      title: 'Điền vào chỗ trống (hiragana)',
      kind: 'fill',
      items: [
        { q: 'パースは12{月|がつ}、＿＿です。', answers: ['あつい', '暑い', 'atsui'] },
        { q: 'パースは12{月|がつ}、{雨|あめ}が＿＿です。', answers: ['すくない', '少ない', 'sukunai'] },
        { q: '＿＿がいい{日|ひ}、{公園|こうえん}でバーベキューをします。', answers: ['てんき', '天気', 'tenki'] },
        { q: 'ハノイは1{月|がつ}、{少|すこ}し＿＿です。', answers: ['さむい', '寒い', 'samui'] },
        { q: '{寒|さむ}い{日|ひ}、＿＿フォーを{食|た}べます。', answers: ['あたたかい', '温かい', 'atatakai'], hint: 'Phở nóng ấm — đồ ăn, chữ Hán có bộ 氵.' },
      ],
    },

    { t: 'h', text: 'Bài 5 — Món ăn, đồ uống: vị thế nào?' },
    {
      t: 'listen',
      id: 'b4-ng-5',
      title: 'Nataphon mời bạn nếm thử',
      note: 'Nghe: mỗi món vị gì, có … lắm không.',
      lines: [
        { who: 'ナタポン', voice: 'ja-nam', text: 'これはタイの{料理|りょうり}です。どうぞ。', ro: 'Kore wa Tai no ryouri desu. Douzo.', vi: 'Đây là món Thái. Mời bạn.' },
        { who: 'アンナ', voice: 'ja-nu', text: 'ありがとうございます。…あ、{辛|から}いですね！', ro: 'Arigatou gozaimasu. … A, karai desu ne!', vi: 'Cảm ơn. … Á, cay nhỉ!' },
        { who: 'ナタポン', voice: 'ja-nam', text: 'そうですね。{少|すこ}し{辛|から}いです。そして、{少|すこ}しすっぱいです。', ro: 'Sou desu ne. Sukoshi karai desu. Soshite, sukoshi suppai desu.', vi: 'Ừ. Hơi cay. Và hơi chua.' },
        { who: 'アンナ', voice: 'ja-nu', text: '{辛|から}いですが、おいしいです。このジュースは{何|なん}のジュースですか。', ro: 'Karai desu ga, oishii desu. Kono juusu wa nan no juusu desu ka.', vi: 'Cay nhưng ngon. Nước ép này là nước gì?' },
        { who: 'ナタポン', voice: 'ja-nam', text: 'メロンのジュースです。{冷|つめ}たいですよ。', ro: 'Meron no juusu desu. Tsumetai desu yo.', vi: 'Nước dưa lưới. Lạnh đấy.' },
        { who: 'アンナ', voice: 'ja-nu', text: '{甘|あま}いですか。', ro: 'Amai desu ka.', vi: 'Có ngọt không?' },
        { who: 'ナタポン', voice: 'ja-nam', text: 'いいえ、あまり{甘|あま}くないです。', ro: 'Iie, amari amaku nai desu.', vi: 'Không, không ngọt lắm.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-ng-5-q',
      title: 'Câu hỏi bài 5',
      items: [
        { q: 'タイの{料理|りょうり}はどうですか。', options: ['{甘|あま}いです。', '{少|すこ}し{辛|から}いです。そして、{少|すこ}しすっぱいです。', '{苦|にが}いです。', 'あまり{辛|から}くないです。'], correct: 1, why: 'ナタポン：{少|すこ}し{辛|から}いです。そして、{少|すこ}しすっぱいです。' },
        { q: 'ジュースは{何|なん}のジュースですか。', options: ['リンゴ', 'イチゴ', 'メロン', 'Không nói'], correct: 2, why: '**メロン**のジュースです。' },
        { q: 'ジュースは{甘|あま}いですか。', options: ['はい、とても{甘|あま}いです。', 'いいえ、あまり{甘|あま}くないです。', 'はい、{少|すこ}し{甘|あま}いです。', 'いいえ、{苦|にが}いです。'], correct: 1, why: 'いいえ、**あまり{甘|あま}くない**です。' },
        { q: 'ジュースは{温|あたた}かいですか、{冷|つめ}たいですか。', options: ['{温|あたた}かい', '{冷|つめ}たい', '{熱|あつ}い', 'Không nói'], correct: 1, why: '{冷|つめ}たいですよ。' },
      ],
    },

    { t: 'h', text: 'Bài 6 — Hội thoại dài: Huế là nơi thế nào? (もう一度聞こう)' },
    {
      t: 'listen',
      id: 'b4-ng-6',
      title: 'Park hỏi Linh về Huế',
      note: 'Bài tổng hợp cả ba mục của bài. Nghe hết một lượt rồi trả lời 6 câu hỏi.',
      lines: [
        { who: 'パク', voice: 'ja-nu', text: 'リンさん、{夏休|なつやす}み、どこへ{行|い}きますか。', ro: 'Rin-san, natsuyasumi, doko e ikimasu ka.', vi: 'Linh ơi, nghỉ hè bạn đi đâu?' },
        { who: 'リン', voice: 'ja-nu', text: 'フエへ{行|い}きます。', ro: 'Fue e ikimasu.', vi: 'Mình đi Huế.' },
        { who: 'パク', voice: 'ja-nu', text: 'フエはどこですか。', ro: 'Fue wa doko desu ka.', vi: 'Huế ở đâu?' },
        { who: 'リン', voice: 'ja-nu', text: 'ベトナムの{真|ま}ん{中|なか}です。ダナンの{北|きた}です。ダナンから{車|くるま}で2{時間|じかん}くらいです。', ro: 'Betonamu no mannaka desu. Danan no kita desu. Danan kara kuruma de ni-jikan kurai desu.', vi: 'Ở giữa Việt Nam. Phía bắc Đà Nẵng. Từ Đà Nẵng đi ô tô khoảng 2 tiếng.' },
        { who: 'パク', voice: 'ja-nu', text: 'フエはどんなところですか。', ro: 'Fue wa donna tokoro desu ka.', vi: 'Huế là nơi thế nào?' },
        { who: 'リン', voice: 'ja-nu', text: '{静|しず}かなところです。そして、きれいです。{古|ふる}いお{城|しろ}や{大|おお}きい{川|かわ}などがあります。お{城|しろ}はとても{有名|ゆうめい}です。', ro: 'Shizuka na tokoro desu. Soshite, kirei desu. Furui oshiro ya ookii kawa nado ga arimasu. Oshiro wa totemo yuumei desu.', vi: 'Là nơi yên tĩnh. Và đẹp. Có thành cổ, sông lớn, v.v. Thành cổ rất nổi tiếng.' },
        { who: 'パク', voice: 'ja-nu', text: 'いいですね。{夏|なつ}は{暑|あつ}いですか。', ro: 'Ii desu ne. Natsu wa atsui desu ka.', vi: 'Hay nhỉ. Mùa hè có nóng không?' },
        { who: 'リン', voice: 'ja-nu', text: 'はい、とても{暑|あつ}いです。{夏|なつ}は{雨|あめ}が{少|すく}ないですが、10{月|がつ}と11{月|がつ}は{雨|あめ}が{多|おお}いです。', ro: 'Hai, totemo atsui desu. Natsu wa ame ga sukunai desu ga, juu-gatsu to juuichi-gatsu wa ame ga ooi desu.', vi: 'Có, rất nóng. Mùa hè ít mưa, nhưng tháng 10 và 11 thì mưa nhiều.' },
        { who: 'パク', voice: 'ja-nu', text: 'フエの{料理|りょうり}はどうですか。', ro: 'Fue no ryouri wa dou desu ka.', vi: 'Đồ ăn Huế thế nào?' },
        { who: 'リン', voice: 'ja-nu', text: 'とてもおいしいですが、{辛|から}いです。ブンボーフエは{有名|ゆうめい}です。{牛肉|ぎゅうにく}のスープの{料理|りょうり}です。', ro: 'Totemo oishii desu ga, karai desu. Bunboo Fue wa yuumei desu. Gyuuniku no suupu no ryouri desu.', vi: 'Rất ngon nhưng cay. Bún bò Huế nổi tiếng. Là món nước dùng thịt bò.' },
        { who: 'パク', voice: 'ja-nu', text: 'へえ、いいですね。', ro: 'Hee, ii desu ne.', vi: 'Chà, hay quá nhỉ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-ng-6-q',
      title: 'Câu hỏi bài 6',
      items: [
        { q: 'フエはどこですか。', options: ['ベトナムの{北|きた}', 'ベトナムの{南|みなみ}', 'ベトナムの{真|ま}ん{中|なか}', 'ダナンの{南|みなみ}'], correct: 2, why: 'ベトナムの**{真|ま}ん{中|なか}**です。ダナンの**{北|きた}**です。' },
        { q: 'ダナンからフエまでどのくらいですか。', options: ['{車|くるま}で2{時間|じかん}くらい', '{飛行機|ひこうき}で2{時間|じかん}くらい', '{車|くるま}で2{時間半|じかんはん}くらい', '{電車|でんしゃ}で12{時間|じかん}くらい'], correct: 0, why: '{車|くるま}で**2{時間|じかん}**くらいです。' },
        { q: 'フエはどんなところですか。', options: ['にぎやかなところ', '{静|しず}かできれいなところ', '{新|あたら}しいビルが{多|おお}いところ', '{雪|ゆき}が{多|おお}いところ'], correct: 1, why: '{静|しず}かなところです。そして、きれいです。' },
        { q: 'フエに{何|なに}がありますか。', options: ['{温泉|おんせん}と{山|やま}', '{古|ふる}いお{城|しろ}と{大|おお}きい{川|かわ}', '{教会|きょうかい}と{海|うみ}', '{神社|じんじゃ}'], correct: 1, why: '{古|ふる}いお{城|しろ}や{大|おお}きい{川|かわ}などがあります。' },
        { q: 'フエは{何月|なんがつ}、{雨|あめ}が{多|おお}いですか。', options: ['6{月|がつ}と7{月|がつ}', '8{月|がつ}', '10{月|がつ}と11{月|がつ}', '{一年中|いちねんじゅう}'], correct: 2, why: 'Bẫy: mùa hè {雨|あめ}は{少|すく}ないです; **10{月|がつ}と11{月|がつ}**は{雨|あめ}が{多|おお}いです。' },
        { q: 'フエの{料理|りょうり}はどうですか。', options: ['{甘|あま}いです。', 'あまりおいしくないです。', 'おいしいですが、{辛|から}いです。', '{冷|つめ}たいです。'], correct: 2, why: 'とてもおいしいです**が**、{辛|から}いです。' },
      ],
    },
  ],
};

/* ═══════════════════════════ 6. NÓI (dạng thi) ═══════════════════════════ */

const NOI: Lesson = {
  id: 'b4-noi',
  kind: 'speaking',
  title: 'Luyện nói — câu hỏi thi JPD về quê, thời tiết, món ăn',
  goal: 'Trả lời trọn câu, đúng dạng tính từ mọi câu hỏi Bài 4 trong đề thi nói (quê ở đâu, đi bao lâu, nơi thế nào, có gì, thời tiết, món ăn), nói liền một đoạn giới thiệu quê mình, và đọc to trôi chảy đoạn văn có tính từ.',
  minutes: 45,
  blocks: [
    {
      t: 'table',
      caption: 'Nhắc lại cách chấm phần Talking (hướng dẫn ôn thi JPD113)',
      head: ['Lỗi', 'Bị trừ'],
      rows: [
        ['Sai làm đổi nghĩa cả câu (vd. いいえ nhưng nói {大|おお}きいです; hỏi どんな mà đáp vị trí)', '**mất hết** điểm câu đó'],
        ['Sai không đổi nghĩa (vd. quên はい／いいえ)', 'tối đa 5 điểm'],
        ['Đúng ngữ pháp nhưng dùng sai từ (vd. {熱|あつ}い cho thời tiết, {冷|つめ}たい cho mùa đông)', 'chỉ được tối đa 3 điểm'],
        ['Sai **trợ từ** (で thay に trong ～に～があります, quên の trong ベトナムの{北|きた})', '2 điểm'],
        ['Lưu loát, phát âm', '2 điểm mỗi câu'],
      ],
    },
    {
      t: 'note',
      title: 'Ba quy tắc vàng của Bài 4',
      items: [
        '**Nghe hết câu hỏi, bắt đúng từ để hỏi**: どこ → vị trí · どのくらい → thời gian · どんな → tính từ + danh từ · どう → cảm nhận · {何|なに}が → ～があります. Năm từ hỏi, năm kiểu trả lời.',
        'Câu hỏi có/không về tính từ → **はい／いいえ trước**, rồi nói **nguyên câu với tính từ đã chia**: いいえ、あまり{大|おお}きくないです. Đừng trả lời cụt ~~いいえ~~.',
        '**Thêm một câu** sau câu trả lời chính để ghi điểm lưu loát: {静|しず}かなところです。**そして、きれいです。** — nhưng chỉ thêm câu bạn chắc chắn đúng.',
      ],
    },

    { t: 'h', text: 'Câu hỏi KHÔNG có tranh (10 điểm) — quê quán, vị trí, đi lại' },
    {
      t: 'dialogue',
      title: 'Hỏi về quê bạn (thay bằng quê thật của bạn)',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'お{国|くに}はどちらですか。', ro: 'Okuni wa dochira desu ka.', vi: 'Nước bạn là nước nào? (đề Bài 1 — vẫn hay mở đầu Bài 4)' },
        { who: 'Bạn', role: 'candidate', text: 'ベトナムです。', ro: 'Betonamu desu.', vi: 'Việt Nam. (KHÔNG thêm じん)' },
        { who: 'Giám thị', role: 'examiner', text: 'ベトナムのどこですか。', ro: 'Betonamu no doko desu ka.', vi: 'Ở đâu của Việt Nam?' },
        { who: 'Bạn', role: 'candidate', text: 'ハノイです。', ro: 'Hanoi desu.', vi: 'Hà Nội.' },
        { who: 'Giám thị', role: 'examiner', text: 'ハノイはどこですか。', ro: 'Hanoi wa doko desu ka.', vi: 'Hà Nội ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: 'ハノイはベトナムの{北|きた}です。', ro: 'Hanoi wa Betonamu no kita desu.', vi: 'Hà Nội ở phía bắc Việt Nam.' },
        { who: 'Giám thị', role: 'examiner', text: '{東京|とうきょう}からハノイまでどのくらいですか。', ro: 'Toukyou kara Hanoi made dono kurai desu ka.', vi: 'Từ Tokyo đến Hà Nội mất bao lâu?' },
        { who: 'Bạn', role: 'candidate', text: '{東京|とうきょう}からハノイまで{飛行機|ひこうき}で5{時間|じかん}くらいです。', ro: 'Toukyou kara Hanoi made hikouki de go-jikan kurai desu.', vi: 'Từ Tokyo đến Hà Nội đi máy bay khoảng 5 tiếng.' },
        { who: 'Giám thị', role: 'examiner', text: 'うちから{学校|がっこう}までどのくらいですか。', ro: 'Uchi kara gakkou made dono kurai desu ka.', vi: 'Từ nhà bạn đến trường mất bao lâu?' },
        { who: 'Bạn', role: 'candidate', text: 'うちから{学校|がっこう}までバスで30{分|ぷん}くらいです。', ro: 'Uchi kara gakkou made basu de sanjuppun kurai desu.', vi: 'Từ nhà đến trường đi xe buýt khoảng 30 phút. (đổi phương tiện/thời gian cho đúng với bạn)' },
      ],
    },
    {
      t: 'table',
      caption: 'Thay vào cho đúng quê bạn',
      head: ['Quê', 'Vị trí', '{東京|とうきょう}から', 'ハノイから'],
      rows: [
        ['ハノイ', 'ベトナムの{北|きた}', '{飛行機|ひこうき}で5{時間|じかん}くらい', '—'],
        ['ハイフォン', 'ベトナムの{北|きた} (ハノイの{東|ひがし})', '{飛行機|ひこうき}で5{時間|じかん}くらい (ハノイまで)', '{車|くるま}で2{時間|じかん}くらい'],
        ['ダナン', 'ベトナムの{真|ま}ん{中|なか}', '{飛行機|ひこうき}で5{時間半|じかんはん}くらい', '{飛行機|ひこうき}で1{時間|じかん}20{分|ぷん}くらい'],
        ['フエ', 'ベトナムの{真|ま}ん{中|なか}', '—', '{飛行機|ひこうき}で1{時間|じかん}10{分|ぷん}くらい'],
        ['ホーチミン', 'ベトナムの{南|みなみ}', '{飛行機|ひこうき}で6{時間|じかん}くらい', '{飛行機|ひこうき}で2{時間|じかん}くらい'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi nơi đó thế nào, có gì',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'ハノイはどんなところですか。', ro: 'Hanoi wa donna tokoro desu ka.', vi: 'Hà Nội là nơi như thế nào?' },
        { who: 'Bạn', role: 'candidate', text: 'ハノイはにぎやかなところです。そして、{古|ふる}い{町|まち}です。', ro: 'Hanoi wa nigiyaka na tokoro desu. Soshite, furui machi desu.', vi: 'Hà Nội là nơi nhộn nhịp. Và là thành phố cổ.' },
        { who: 'Giám thị', role: 'examiner', text: 'ハノイは{静|しず}かですか。', ro: 'Hanoi wa shizuka desu ka.', vi: 'Hà Nội có yên tĩnh không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{静|しず}かじゃありません。にぎやかです。', ro: 'Iie, shizuka ja arimasen. Nigiyaka desu.', vi: 'Không, không yên tĩnh. Nhộn nhịp.' },
        { who: 'Giám thị', role: 'examiner', text: 'ハノイは{大|おお}きいですか。', ro: 'Hanoi wa ookii desu ka.', vi: 'Hà Nội có lớn không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、とても{大|おお}きいです。{人|ひと}が{多|おお}いです。', ro: 'Hai, totemo ookii desu. Hito ga ooi desu.', vi: 'Có, rất lớn. Đông người.' },
        { who: 'Giám thị', role: 'examiner', text: 'ハノイに{何|なに}がありますか。', ro: 'Hanoi ni nani ga arimasu ka.', vi: 'Ở Hà Nội có gì?' },
        { who: 'Bạn', role: 'candidate', text: 'ハノイに{古|ふる}いお{寺|てら}や{大|おお}きい{川|かわ}などがあります。', ro: 'Hanoi ni furui otera ya ookii kawa nado ga arimasu.', vi: 'Ở Hà Nội có chùa cổ, sông lớn, v.v.' },
        { who: 'Giám thị', role: 'examiner', text: 'ハノイに{温泉|おんせん}がありますか。', ro: 'Hanoi ni onsen ga arimasu ka.', vi: 'Ở Hà Nội có suối nước nóng không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、ありません。', ro: 'Iie, arimasen.', vi: 'Không, không có.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi thời tiết và món ăn',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'ハノイは{夏|なつ}、{暑|あつ}いですか。', ro: 'Hanoi wa natsu, atsui desu ka.', vi: 'Hà Nội mùa hè có nóng không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、とても{暑|あつ}いです。', ro: 'Hai, totemo atsui desu.', vi: 'Có, rất nóng.' },
        { who: 'Giám thị', role: 'examiner', text: 'ハノイは{冬|ふゆ}、{雪|ゆき}が{多|おお}いですか。', ro: 'Hanoi wa fuyu, yuki ga ooi desu ka.', vi: 'Hà Nội mùa đông có nhiều tuyết không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{雪|ゆき}はありません。{冬|ふゆ}は{少|すこ}し{寒|さむ}いです。', ro: 'Iie, yuki wa arimasen. Fuyu wa sukoshi samui desu.', vi: 'Không, không có tuyết. Mùa đông hơi lạnh.' },
        { who: 'Giám thị', role: 'examiner', text: 'ベトナムの{天気|てんき}はどうですか。', ro: 'Betonamu no tenki wa dou desu ka.', vi: 'Thời tiết Việt Nam thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{南|みなみ}は{一年中|いちねんじゅう}、{暑|あつ}いです。{北|きた}は{冬|ふゆ}、{少|すこ}し{寒|さむ}いです。', ro: 'Minami wa ichinenjuu, atsui desu. Kita wa fuyu, sukoshi samui desu.', vi: 'Miền nam nóng quanh năm. Miền bắc mùa đông hơi lạnh.' },
        { who: 'Giám thị', role: 'examiner', text: '{日本|にほん}の{料理|りょうり}はどうですか。', ro: 'Nihon no ryouri wa dou desu ka.', vi: 'Bạn thấy đồ ăn Nhật thế nào? (câu có trong ngân hàng đề)' },
        { who: 'Bạn', role: 'candidate', text: 'とてもおいしいです。', ro: 'Totemo oishii desu.', vi: 'Rất ngon.' },
        { who: 'Giám thị', role: 'examiner', text: 'ベトナムの{料理|りょうり}は{辛|から}いですか。', ro: 'Betonamu no ryouri wa karai desu ka.', vi: 'Đồ ăn Việt có cay không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、あまり{辛|から}くないです。', ro: 'Iie, amari karaku nai desu.', vi: 'Không, không cay lắm.' },
        { who: 'Giám thị', role: 'examiner', text: 'ベトナムで{何|なに}がおいしいですか。', ro: 'Betonamu de nani ga oishii desu ka.', vi: 'Ở Việt Nam món gì ngon?' },
        { who: 'Bạn', role: 'candidate', text: 'フォーがおいしいです。フォーは{牛肉|ぎゅうにく}のスープの{料理|りょうり}です。', ro: 'Foo ga oishii desu. Foo wa gyuuniku no suupu no ryouri desu.', vi: 'Phở ngon. Phở là món nước dùng thịt bò.' },
        { who: 'Giám thị', role: 'examiner', text: '{暑|あつ}いですね。', ro: 'Atsui desu ne.', vi: 'Nóng nhỉ. (giám thị có thể mở đầu bằng câu xã giao)' },
        { who: 'Bạn', role: 'candidate', text: 'そうですね。', ro: 'Sou desu ne.', vi: 'Ừ nhỉ / Vâng, đúng thế ạ.' },
      ],
    },

    { t: 'h', text: 'Câu hỏi CÓ tranh (15 điểm/câu)' },
    {
      t: 'p',
      text: 'Đề thật cho một tranh; giám thị hỏi một câu về tranh. Dưới đây là 4 kiểu tranh hợp với Bài 4 (dữ liệu tranh viết thành bảng) và mọi câu giám thị có thể hỏi. Tranh là thông tin **của người khác/nơi khác** — trả lời theo tranh, không theo quê bạn.',
    },
    {
      t: 'table',
      caption: 'Tranh A — Thẻ giới thiệu thành phố さっぽろ',
      head: ['Mục', 'Thông tin'],
      rows: [
        ['Vị trí', '{日本|にほん}の{北|きた} ({北海道|ほっかいどう})'],
        ['{東京|とうきょう}から', '{飛行機|ひこうき} (máy bay) · 1.5h'],
        ['Thành phố', '{大|おお}きい · にぎやか'],
        ['Có gì', '{雪|ゆき}のお{祭|まつ}り (lễ hội tuyết) · {温泉|おんせん}'],
        ['Thời tiết', '{冬|ふゆ}: rất lạnh, tuyết nhiều · {夏|なつ}: mát'],
        ['Món ngon', 'ラーメン · メロン'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh A — câu hỏi & trả lời mẫu',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'さっぽろはどこですか。', ro: 'Sapporo wa doko desu ka.', vi: 'Sapporo ở đâu?' },
        { who: 'Bạn', role: 'candidate', text: 'さっぽろは{日本|にほん}の{北|きた}です。', ro: 'Sapporo wa Nihon no kita desu.', vi: 'Sapporo ở phía bắc Nhật Bản.' },
        { who: 'Giám thị', role: 'examiner', text: '{東京|とうきょう}からさっぽろまでどのくらいですか。', ro: 'Toukyou kara Sapporo made dono kurai desu ka.', vi: 'Từ Tokyo đến Sapporo mất bao lâu?' },
        { who: 'Bạn', role: 'candidate', text: '{飛行機|ひこうき}で1{時間半|じかんはん}くらいです。', ro: 'Hikouki de ichi-jikan han kurai desu.', vi: 'Đi máy bay khoảng một tiếng rưỡi.' },
        { who: 'Giám thị', role: 'examiner', text: 'さっぽろはどんなところですか。', ro: 'Sapporo wa donna tokoro desu ka.', vi: 'Sapporo là nơi như thế nào?' },
        { who: 'Bạn', role: 'candidate', text: 'さっぽろは{大|おお}きい{町|まち}です。そして、にぎやかです。', ro: 'Sapporo wa ookii machi desu. Soshite, nigiyaka desu.', vi: 'Sapporo là thành phố lớn. Và nhộn nhịp.' },
        { who: 'Giám thị', role: 'examiner', text: 'さっぽろは{冬|ふゆ}、{寒|さむ}いですか。', ro: 'Sapporo wa fuyu, samui desu ka.', vi: 'Sapporo mùa đông có lạnh không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、とても{寒|さむ}いです。{雪|ゆき}が{多|おお}いです。', ro: 'Hai, totemo samui desu. Yuki ga ooi desu.', vi: 'Có, rất lạnh. Tuyết nhiều.' },
        { who: 'Giám thị', role: 'examiner', text: 'さっぽろは{夏|なつ}、{暑|あつ}いですか。', ro: 'Sapporo wa natsu, atsui desu ka.', vi: 'Sapporo mùa hè có nóng không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、あまり{暑|あつ}くないです。{涼|すず}しいです。', ro: 'Iie, amari atsuku nai desu. Suzushii desu.', vi: 'Không, không nóng lắm. Mát mẻ.' },
        { who: 'Giám thị', role: 'examiner', text: 'さっぽろに{何|なに}がありますか。', ro: 'Sapporo ni nani ga arimasu ka.', vi: 'Ở Sapporo có gì?' },
        { who: 'Bạn', role: 'candidate', text: '{雪|ゆき}のお{祭|まつ}りや{温泉|おんせん}などがあります。', ro: 'Yuki no omatsuri ya onsen nado ga arimasu.', vi: 'Có lễ hội tuyết, suối nước nóng, v.v.' },
        { who: 'Giám thị', role: 'examiner', text: 'さっぽろで{何|なに}がおいしいですか。', ro: 'Sapporo de nani ga oishii desu ka.', vi: 'Ở Sapporo món gì ngon?' },
        { who: 'Bạn', role: 'candidate', text: 'ラーメンとメロンがおいしいです。', ro: 'Raamen to meron ga oishii desu.', vi: 'Mì ramen và dưa lưới ngon.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh B — Thời tiết ソウル theo tháng',
      head: ['Tháng', 'Tranh', 'Nói'],
      rows: [
        ['1{月|がつ}', 'tuyết rơi, người co ro', 'とても{寒|さむ}いです · {雪|ゆき}が{多|おお}いです'],
        ['4{月|がつ}', 'hoa nở, nắng dịu', '{暖|あたた}かいです'],
        ['7{月|がつ}', 'người cầm ô, mưa to', '{暑|あつ}いです · {雨|あめ}が{多|おお}いです'],
        ['10{月|がつ}', 'lá đỏ, gió nhẹ, trời trong', '{涼|すず}しいです · {天気|てんき}がいいです'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh B — câu hỏi & trả lời mẫu',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'ソウルは1{月|がつ}、どうですか。', ro: 'Souru wa ichi-gatsu, dou desu ka.', vi: 'Seoul tháng 1 thế nào?' },
        { who: 'Bạn', role: 'candidate', text: 'ソウルは1{月|がつ}、とても{寒|さむ}いです。{雪|ゆき}が{多|おお}いです。', ro: 'Souru wa ichi-gatsu, totemo samui desu. Yuki ga ooi desu.', vi: 'Seoul tháng 1 rất lạnh. Tuyết nhiều.' },
        { who: 'Giám thị', role: 'examiner', text: 'ソウルは4{月|がつ}、{寒|さむ}いですか。', ro: 'Souru wa shi-gatsu, samui desu ka.', vi: 'Seoul tháng 4 có lạnh không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{寒|さむ}くないです。{暖|あたた}かいです。', ro: 'Iie, samuku nai desu. Atatakai desu.', vi: 'Không, không lạnh. Ấm áp.' },
        { who: 'Giám thị', role: 'examiner', text: 'ソウルは7{月|がつ}、{天気|てんき}がいいですか。', ro: 'Souru wa shichi-gatsu, tenki ga ii desu ka.', vi: 'Seoul tháng 7 thời tiết có đẹp không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、よくないです。{雨|あめ}が{多|おお}いです。', ro: 'Iie, yoku nai desu. Ame ga ooi desu.', vi: 'Không, không đẹp. Mưa nhiều. (いい → よくない!)' },
        { who: 'Giám thị', role: 'examiner', text: 'ソウルは{何月|なんがつ}、{涼|すず}しいですか。', ro: 'Souru wa nan-gatsu, suzushii desu ka.', vi: 'Seoul tháng mấy thì mát?' },
        { who: 'Bạn', role: 'candidate', text: '10{月|がつ}、{涼|すず}しいです。', ro: 'Juu-gatsu, suzushii desu.', vi: 'Tháng 10 mát.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh C — Món ăn, đồ uống trên bàn',
      head: ['Món', 'Của nước', 'Vị / nhiệt độ'],
      rows: [
        ['キムチ', '{韓国|かんこく}', 'rất cay (3 quả ớt)'],
        ['ケーキ', '{日本|にほん}', 'hơi ngọt'],
        ['コーヒー', 'ベトナム', 'đắng · nóng'],
        ['お{茶|ちゃ}', '{日本|にほん}', 'lạnh · không ngọt'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh C — câu hỏi & trả lời mẫu',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'このキムチは{辛|から}いですか。', ro: 'Kono kimuchi wa karai desu ka.', vi: 'Kim chi này có cay không?' },
        { who: 'Bạn', role: 'candidate', text: 'はい、そのキムチはとても{辛|から}いです。', ro: 'Hai, sono kimuchi wa totemo karai desu.', vi: 'Có, kim chi đó rất cay. (giám thị nói この → bạn nói その)' },
        { who: 'Giám thị', role: 'examiner', text: 'このケーキはどうですか。', ro: 'Kono keeki wa dou desu ka.', vi: 'Cái bánh này thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{少|すこ}し{甘|あま}いです。', ro: 'Sukoshi amai desu.', vi: 'Hơi ngọt.' },
        { who: 'Giám thị', role: 'examiner', text: 'これはどこのコーヒーですか。', ro: 'Kore wa doko no koohii desu ka.', vi: 'Đây là cà phê nước nào? (Bài 2)' },
        { who: 'Bạn', role: 'candidate', text: 'それはベトナムのコーヒーです。', ro: 'Sore wa Betonamu no koohii desu.', vi: 'Đó là cà phê Việt Nam.' },
        { who: 'Giám thị', role: 'examiner', text: 'このコーヒーはどんなコーヒーですか。', ro: 'Kono koohii wa donna koohii desu ka.', vi: 'Cà phê này là cà phê như thế nào?' },
        { who: 'Bạn', role: 'candidate', text: '{熱|あつ}いコーヒーです。そして、{苦|にが}いです。', ro: 'Atsui koohii desu. Soshite, nigai desu.', vi: 'Là cà phê nóng. Và đắng.' },
        { who: 'Giám thị', role: 'examiner', text: 'このお{茶|ちゃ}は{甘|あま}いですか。', ro: 'Kono ocha wa amai desu ka.', vi: 'Trà này có ngọt không?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{甘|あま}くないです。{冷|つめ}たいお{茶|ちゃ}です。', ro: 'Iie, amaku nai desu. Tsumetai ocha desu.', vi: 'Không, không ngọt. Là trà lạnh.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tranh D — Bản đồ đường đi của みどり町',
      head: ['Chặng', 'Phương tiện', 'Thời gian'],
      rows: [
        ['うち → {駅|えき}', 'đi bộ', '5 phút'],
        ['{駅|えき} → {学校|がっこう}', 'tàu điện', '20 phút'],
        ['みどり{町|まち} → さくら{町|まち} (phía nam)', 'ô tô', '1h'],
        ['みどり{町|まち} → さくら{町|まち}', 'xe buýt', '1.5h'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Tranh D — câu hỏi & trả lời mẫu',
      lines: [
        { who: 'Giám thị', role: 'examiner', text: 'うちから{駅|えき}までどのくらいですか。', ro: 'Uchi kara eki made dono kurai desu ka.', vi: 'Từ nhà đến ga mất bao lâu?' },
        { who: 'Bạn', role: 'candidate', text: '{歩|ある}いて5{分|ふん}です。', ro: 'Aruite go-fun desu.', vi: 'Đi bộ 5 phút.' },
        { who: 'Giám thị', role: 'examiner', text: '{駅|えき}から{学校|がっこう}まで{何|なに}で{行|い}きますか。', ro: 'Eki kara gakkou made nani de ikimasu ka.', vi: 'Từ ga đến trường đi bằng gì?' },
        { who: 'Bạn', role: 'candidate', text: '{電車|でんしゃ}で{行|い}きます。20{分|ぷん}です。', ro: 'Densha de ikimasu. Nijuppun desu.', vi: 'Đi bằng tàu điện. 20 phút.' },
        { who: 'Giám thị', role: 'examiner', text: 'さくら{町|まち}はみどり{町|まち}の{北|きた}ですか。', ro: 'Sakura-machi wa Midori-machi no kita desu ka.', vi: 'Thị trấn Sakura ở phía bắc Midori à?' },
        { who: 'Bạn', role: 'candidate', text: 'いいえ、{北|きた}じゃありません。{南|みなみ}です。', ro: 'Iie, kita ja arimasen. Minami desu.', vi: 'Không, không phải phía bắc. Phía nam.' },
        { who: 'Giám thị', role: 'examiner', text: 'みどり{町|まち}からさくら{町|まち}までバスでどのくらいですか。', ro: 'Midori-machi kara Sakura-machi made basu de dono kurai desu ka.', vi: 'Từ Midori đến Sakura đi xe buýt mất bao lâu?' },
        { who: 'Bạn', role: 'candidate', text: 'バスで1{時間半|じかんはん}くらいです。', ro: 'Basu de ichi-jikan han kurai desu.', vi: 'Đi xe buýt khoảng một tiếng rưỡi.' },
      ],
    },
    {
      t: 'note',
      title: 'Bẫy trong câu hỏi có tranh',
      items: [
        '**{何|なに}で{行|い}きますか** (đi bằng gì) — {何|なに}で đọc **なにで**; trả lời **phương tiện + で{行|い}きます**. Đừng nhầm với どのくらい (bao lâu).',
        'Tranh ghi "1.5h" → nói **1{時間半|じかんはん}** (いちじかんはん), không phải ~~1{時|じ}{半|はん}~~ (1 giờ rưỡi — mốc giờ).',
        'Câu "～{月|がつ}、どうですか" → trả lời bằng **tính từ thời tiết**, nhắc lại tháng: ソウルは1{月|がつ}、{寒|さむ}いです.',
        'Muốn nói hai tính từ thì **tách thành hai câu** nối bằng そして (さっぽろは{大|おお}きい{町|まち}です。そして、にぎやかです。). Đừng thử nối trong một câu bằng thể て — Bài 8 mới học.',
      ],
    },

    { t: 'h', text: 'Bài nói liền — 私の町 (giới thiệu quê tôi)' },
    {
      t: 'p',
      text: 'Thầy cô hay cho nói **liền 30–60 giây** về quê mình. Học thuộc khung 8 câu dưới đây (bản Hà Nội), rồi đổi chữ tô đậm trong bảng thay thế cho đúng quê bạn. Mỗi câu dùng đúng một điểm ngữ pháp của bài.',
    },
    {
      t: 'dialogue',
      title: 'Bài mẫu — ハノイ',
      lines: [
        { who: 'Bạn', role: 'candidate', text: '{私|わたし}の{町|まち}はハノイです。', ro: 'Watashi no machi wa Hanoi desu.', vi: 'Thành phố của tôi là Hà Nội.' },
        { who: 'Bạn', role: 'candidate', text: 'ハノイはベトナムの{北|きた}です。{東京|とうきょう}から{飛行機|ひこうき}で5{時間|じかん}くらいです。', ro: 'Hanoi wa Betonamu no kita desu. Toukyou kara hikouki de go-jikan kurai desu.', vi: 'Hà Nội ở phía bắc Việt Nam. Từ Tokyo đi máy bay khoảng 5 tiếng. (ポイント 29, 30, 31)' },
        { who: 'Bạn', role: 'candidate', text: 'ハノイはにぎやかな{町|まち}です。{人|ひと}が{多|おお}いです。', ro: 'Hanoi wa nigiyaka na machi desu. Hito ga ooi desu.', vi: 'Hà Nội là thành phố nhộn nhịp. Đông người. (ポイント 25, 24)' },
        { who: 'Bạn', role: 'candidate', text: 'ハノイに{古|ふる}いお{寺|てら}や{大|おお}きい{川|かわ}などがあります。', ro: 'Hanoi ni furui otera ya ookii kawa nado ga arimasu.', vi: 'Ở Hà Nội có chùa cổ, sông lớn, v.v. (ポイント 28)' },
        { who: 'Bạn', role: 'candidate', text: 'ハノイは{夏|なつ}、とても{暑|あつ}いです。{冬|ふゆ}は{少|すこ}し{寒|さむ}いですが、{雪|ゆき}はありません。', ro: 'Hanoi wa natsu, totemo atsui desu. Fuyu wa sukoshi samui desu ga, yuki wa arimasen.', vi: 'Hà Nội mùa hè rất nóng. Mùa đông hơi lạnh nhưng không có tuyết. (ポイント 26, 27, 35)' },
        { who: 'Bạn', role: 'candidate', text: 'フォーは{有名|ゆうめい}です。あまり{辛|から}くないです。そして、とてもおいしいです。', ro: 'Foo wa yuumei desu. Amari karaku nai desu. Soshite, totemo oishii desu.', vi: 'Phở nổi tiếng. Không cay lắm. Và rất ngon. (ポイント 27, 34)' },
        { who: 'Bạn', role: 'candidate', text: 'ハノイはいいところです。', ro: 'Hanoi wa ii tokoro desu.', vi: 'Hà Nội là một nơi tuyệt vời.' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế cho bài nói liền',
      head: ['Câu', 'ハノイ', 'ホーチミン', 'ダナン'],
      rows: [
        ['Vị trí', 'ベトナムの{北|きた}', 'ベトナムの{南|みなみ}', 'ベトナムの{真|ま}ん{中|なか}'],
        ['Nơi thế nào', 'にぎやかな{町|まち}', '{大|おお}きい{町|まち} · {新|あたら}しいビルが{多|おお}い', 'きれいな{町|まち} · あまり{大|おお}きくない'],
        ['Có gì', '{古|ふる}いお{寺|てら}や{大|おお}きい{川|かわ}', '{古|ふる}い{教会|きょうかい}や{大|おお}きい{川|かわ}', '{海|うみ}と{山|やま}'],
        ['Thời tiết', '{夏|なつ}とても{暑|あつ}い · {冬|ふゆ}{少|すこ}し{寒|さむ}い', '{一年中|いちねんじゅう}{暑|あつ}い · 5～11{月|がつ}{雨|あめ}が{多|おお}い', '{夏|なつ}{暑|あつ}い · 10・11{月|がつ}{雨|あめ}が{多|おお}い'],
        ['Món ăn', 'フォー · ブンチャー', 'フーティウ · バインミー', 'ミークアン'],
      ],
    },

    { t: 'h', text: 'Đọc to — Reading (40 điểm)' },
    {
      t: 'p',
      text: 'Đề đọc dài khoảng 100–110 ký tự: **4 từ chữ Hán** gạch chân (12đ), **4 từ katakana** (12đ), còn lại hiragana (16đ, đọc sai một ký tự trừ 0,2đ). Có 30 giây chuẩn bị. Bốn đoạn dưới đây viết theo đúng khuôn đó và chỉ dùng từ Bài 1–4. Tắt furigana khi đã quen.',
    },
    {
      t: 'examples',
      items: [
        {
          en: '{私|わたし}の{町|まち}はハノイです。ベトナムの{北|きた}です。とてもにぎやかなところです。バイクがおおいです。ふるいおてらや{大|おお}きいかわがあります。なつはとてもあついです。フォーがおいしいです。',
          ro: 'Watashi no machi wa Hanoi desu. Betonamu no kita desu. Totemo nigiyaka na tokoro desu. Baiku ga ooi desu. Furui otera ya ookii kawa ga arimasu. Natsu wa totemo atsui desu. Foo ga oishii desu.',
          vi: 'Thành phố của tôi là Hà Nội. Ở phía bắc Việt Nam. Là nơi rất nhộn nhịp. Nhiều xe máy. Có chùa cổ, sông lớn. Mùa hè rất nóng. Phở ngon.',
        },
        {
          en: '{北海道|ほっかいどう}は{日本|にほん}のきたです。とうきょうから{飛行機|ひこうき}で{一|いち}じかん{半|はん}くらいです。ふゆはとてもさむいです。ゆきがおおいです。スキーをします。メロンやラーメンがおいしいです。ホテルのおんせんもいいです。',
          ro: 'Hokkaidou wa Nihon no kita desu. Toukyou kara hikouki de ichi-jikan han kurai desu. Fuyu wa totemo samui desu. Yuki ga ooi desu. Sukii o shimasu. Meron ya raamen ga oishii desu. Hoteru no onsen mo ii desu.',
          vi: 'Hokkaido ở phía bắc Nhật Bản. Từ Tokyo đi máy bay khoảng một tiếng rưỡi. Mùa đông rất lạnh. Nhiều tuyết. Người ta trượt tuyết. Dưa lưới, mì ramen ngon. Suối nước nóng của khách sạn cũng tuyệt.',
        },
        {
          en: 'A：あついですね。B：そうですね。Aさんの{国|くに}も{八月|はちがつ}、あついですか。A：いいえ、あまりあつくないです。すずしいです。B：いいですね。わたしの{国|くに}は{一年中|いちねんじゅう}あついです。つめたいジュースやビール、アイスコーヒーをのみます。',
          ro: 'A: Atsui desu ne. B: Sou desu ne. A-san no kuni mo hachi-gatsu, atsui desu ka. A: Iie, amari atsuku nai desu. Suzushii desu. B: Ii desu ne. Watashi no kuni wa ichinenjuu atsui desu. Tsumetai juusu ya biiru, aisu koohii o nomimasu.',
          vi: 'A: Nóng nhỉ. B: Ừ nhỉ. Nước bạn tháng 8 cũng nóng à? A: Không, không nóng lắm. Mát mẻ. B: Thích nhỉ. Nước tôi nóng quanh năm. Tôi uống nước ép lạnh, bia, cà phê đá.',
        },
        {
          en: 'ダナンはベトナムのまんなかです。ハノイからひこうきで{一|いち}じかん{二十|にじゅっ}ぷんくらいです。{町|まち}はあまり{大|おお}きくないですが、きれいです。うみとやまがあります。{新|あたら}しいビルやホテルもおおいです。ミークアンはすこしからいですが、おいしいです。',
          ro: 'Danan wa Betonamu no mannaka desu. Hanoi kara hikouki de ichi-jikan nijuppun kurai desu. Machi wa amari ookiku nai desu ga, kirei desu. Umi to yama ga arimasu. Atarashii biru ya hoteru mo ooi desu. Miikuan wa sukoshi karai desu ga, oishii desu.',
          vi: 'Đà Nẵng ở chính giữa Việt Nam. Từ Hà Nội đi máy bay khoảng 1 tiếng 20 phút. Thành phố không lớn lắm nhưng đẹp. Có biển và núi. Toà nhà mới, khách sạn cũng nhiều. Mì Quảng hơi cay nhưng ngon.',
        },
      ],
    },
    {
      t: 'note',
      title: 'Chỗ dễ đọc sai trong bốn đoạn trên',
      items: [
        '{大|おお}きい **おおきい** (hai chữ お — trường âm), {多|おお}い **おおい**: đọc đủ độ dài, đừng đọc ~~おきい~~ ~~おい~~.',
        '{一年中|いちねんじゅう} **いちねんじゅう** (じゅう, không phải ちゅう) · {飛行機|ひこうき} **ひこうき** (こう dài).',
        '一じかん{半|はん} **いちじかんはん** · 二十ぷん **にじゅっぷん** — ぷん chứ không phải ふん.',
        'Katakana có trường âm ー: **ラーメン** raamen, **アイスコーヒー** aisu koohii, **ミークアン** miikuan — kéo dài đúng một nhịp ở chỗ ー.',
        'Đoạn 3 là hội thoại: **lên giọng** ở cuối câu hỏi (…{暑|あつ}いですか↗), **hạ giọng** ở そうですね↘ — đọc có ngữ điệu được tính vào điểm lưu loát.',
      ],
    },

    { t: 'h', text: 'Tự ghi âm — trả lời không nhìn đáp án' },
    {
      t: 'speak',
      id: 'b4-noi-ghi-am',
      part: '1',
      questions: [
        'おくには どちらですか。',
        'ベトナムの どこですか。',
        'ハノイは どこですか。',
        'とうきょうから ハノイまで どのくらいですか。',
        'うちから がっこうまで どのくらいですか。',
        'あなたの まちは どんなところですか。',
        'あなたの まちは おおきいですか。',
        'ハノイに なにが ありますか。',
        'ハノイは なつ、あついですか。',
        'ベトナムの てんきは どうですか。',
        'にほんの りょうりは どうですか。',
        'ベトナムの りょうりは からいですか。',
        'あついですね。',
        'あなたの まちを しょうかいしてください。',
      ],
    },
  ],
};

/* ═══════════════════════════ 7. BÀI TẬP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b4-bai-tap',
  kind: 'homework',
  title: 'Bài tập về nhà — Bài 4 (có đáp án)',
  goal: 'Tự dịch, chia tính từ, chọn trợ từ và ghép câu Bài 4 không cần nhìn bài học.',
  minutes: 45,
  blocks: [
    {
      t: 'p',
      text: 'Gõ tiếng Nhật bằng bộ gõ (gõ romaji, máy đổi sang kana). Chữ Hán hay kana đều được chấp nhận ở những từ hay gặp; dấu câu và dấu cách không tính. Nếu máy chấm sai mà bạn tin mình đúng, bấm **Hỏi gia sư** ngay dưới câu đó.',
    },
    {
      t: 'quiz',
      id: 'b4-bt-dich',
      title: 'Dịch sang tiếng Nhật',
      kind: 'translate',
      grammar: 'N は イA-くないです／ナA じゃありません · イA＋N／ナAな＋N · N は［mùa］、A です · とても／少し／あまり～ない · N1 に N2 が あります · N は N の 北… です · N1 から N2 まで どのくらい · N で · どんな N · N は どうですか · そして · ～が、～ · ～ね',
      items: [
        { q: 'Thành phố của tôi yên tĩnh.', answers: ['私の町は静かです', 'わたしのまちはしずかです', '私の町はしずかです', 'わたしの町は静かです'], hint: '{私|わたし}の{町|まち} · {静|しず}か — ポイント 24' },
        { q: 'Hà Nội không yên tĩnh.', answers: ['ハノイは静かじゃありません', 'ハノイはしずかじゃありません', 'ハノイは静かではありません', 'ハノイはしずかではありません', 'ハノイは静かじゃないです', 'ハノイはしずかじゃないです'], hint: 'Tính từ な + じゃありません' },
        { q: 'Món này không cay.', answers: ['この料理は辛くないです', 'このりょうりはからくないです', 'この料理はからくないです', 'この料理は辛くありません', 'このりょうりはからくありません'], hint: '{辛|から}い → {辛|から}くないです' },
        { q: 'Thời tiết không tốt.', answers: ['天気はよくないです', 'てんきはよくないです', '天気が良くないです', '天気がよくないです', 'てんきがよくないです', '天気はよくありません'], hint: 'いい → よくない (bất quy tắc)' },
        { q: 'Thành phố tôi nhiều cây xanh.', answers: ['私の町は緑が多いです', 'わたしのまちはみどりがおおいです', '私の町はみどりが多いです'], hint: 'N1 は N2 が {多|おお}いです' },
        { q: 'Đà Nẵng là thành phố đẹp.', answers: ['ダナンはきれいな町です', 'ダナンはきれいなまちです', 'ダナンは綺麗な町です'], hint: 'きれい + な + {町|まち} — ポイント 25' },
        { q: 'Hội An là một phố cổ.', answers: ['ホイアンは古い町です', 'ホイアンはふるいまちです', 'ホイアンは古いまちです'], hint: '{古|ふる}い + {町|まち} (không な)' },
        { q: 'Hà Nội mùa hè rất nóng.', answers: ['ハノイは夏、とても暑いです', 'ハノイはなつ、とてもあついです', 'ハノイは夏とても暑いです', 'ハノイは夏はとても暑いです', 'ハノイはなつはとてもあついです'], hint: 'N は {夏|なつ}、とても{暑|あつ}いです — ポイント 26, 27' },
        { q: 'TP. Hồ Chí Minh nóng quanh năm.', answers: ['ホーチミンは一年中、暑いです', 'ホーチミンはいちねんじゅう、あついです', 'ホーチミンは一年中暑いです', 'ホーチミンはいちねんじゅうあついです'], hint: '{一年中|いちねんじゅう} · {暑|あつ}い' },
        { q: 'Nước tôi mùa đông không lạnh lắm.', answers: ['私の国は冬、あまり寒くないです', 'わたしのくにはふゆ、あまりさむくないです', '私の国は冬あまり寒くないです', '私の国は冬はあまり寒くないです', 'わたしのくにはふゆはあまりさむくないです'], hint: 'あまり + ～くないです — ポイント 27' },
        { q: 'Ở thành phố tôi có một con sông đẹp.', answers: ['私の町にきれいな川があります', 'わたしのまちにきれいなかわがあります', '私の町にきれいなかわがあります'], hint: 'N1 に N2 が あります — ポイント 28' },
        { q: 'Ở Hà Nội có gì?', answers: ['ハノイに何がありますか', 'ハノイになにがありますか'], hint: '{何|なに}が ありますか' },
        { q: 'Đà Nẵng ở chính giữa Việt Nam.', answers: ['ダナンはベトナムの真ん中です', 'ダナンはベトナムのまんなかです'], hint: 'N の {真|ま}ん{中|なか} — ポイント 29' },
        { q: 'Từ Hà Nội đến Đà Nẵng mất bao lâu?', answers: ['ハノイからダナンまでどのくらいですか', 'ハノイからダナンまでどれくらいですか', 'ハノイからダナンまでどのぐらいですか'], hint: 'から～まで どのくらい — ポイント 30' },
        { q: 'Đi máy bay khoảng một tiếng rưỡi.', answers: ['飛行機で1時間半くらいです', 'ひこうきでいちじかんはんくらいです', '飛行機で一時間半くらいです', 'ひこうきで1じかんはんくらいです', '飛行機で1時間半ぐらいです'], hint: '{飛行機|ひこうき}で — ポイント 31' },
        { q: 'Từ nhà đến ga đi bộ 5 phút.', answers: ['うちから駅まで歩いて5分です', 'うちからえきまであるいてごふんです', 'うちから駅まで歩いて五分です', 'うちからえきまであるいて5ふんです', '家から駅まで歩いて5分です'], hint: '{歩|ある}いて (không で)' },
        { q: 'Hà Nội là nơi như thế nào?', answers: ['ハノイはどんなところですか', 'ハノイはどんな所ですか'], hint: 'どんな + ところ — ポイント 32' },
        { q: 'Đồ ăn Nhật (bạn thấy) thế nào?', answers: ['日本の料理はどうですか', 'にほんのりょうりはどうですか', '日本のりょうりはどうですか'], hint: 'N は どうですか — ポイント 33' },
        { q: 'Thành phố này nhộn nhịp. Và đẹp.', answers: ['この町はにぎやかです。そして、きれいです', 'このまちはにぎやかです。そして、きれいです', 'この町はにぎやかです。そしてきれいです'], hint: 'そして — ポイント 34' },
        { q: 'Ngọn núi này thấp nhưng đẹp.', answers: ['この山は低いですが、きれいです', 'このやまはひくいですが、きれいです', 'この山は低いですがきれいです'], hint: '～ですが、～ — ポイント 35' },
        { q: 'Lạnh nhỉ. — Ừ nhỉ.', answers: ['寒いですね。そうですね', 'さむいですね。そうですね'], hint: '～ね · そうですね — ポイント 36' },
      ],
    },
    {
      t: 'quiz',
      id: 'b4-bt-chia',
      title: 'Chia tính từ — viết dạng được yêu cầu',
      kind: 'fill',
      grammar: 'Phủ định: イA bỏ い + くないです · いい → よくないです · ナA + じゃありません. Trước danh từ: イA giữ い · ナA + な',
      items: [
        { q: '{小|ちい}さい → phủ định', answers: ['小さくないです', 'ちいさくないです', '小さくありません'] },
        { q: '{涼|すず}しい → phủ định', answers: ['涼しくないです', 'すずしくないです', '涼しくありません'] },
        { q: '{甘|あま}い → phủ định', answers: ['甘くないです', 'あまくないです', '甘くありません'] },
        { q: '{天気|てんき}がいい → phủ định', answers: ['天気がよくないです', 'てんきがよくないです', '天気が良くないです', '天気はよくないです'] },
        { q: '{有名|ゆうめい} → phủ định', answers: ['有名じゃありません', 'ゆうめいじゃありません', '有名ではありません', '有名じゃないです'] },
        { q: 'きれい → phủ định', answers: ['きれいじゃありません', 'きれいではありません', 'きれいじゃないです'] },
        { q: '{静|しず}か + ところ', answers: ['静かなところ', 'しずかなところ', '静かな所'] },
        { q: '{新|あたら}しい + ビル', answers: ['新しいビル', 'あたらしいビル'] },
        { q: 'にぎやか + {町|まち}', answers: ['にぎやかな町', 'にぎやかなまち'] },
        { q: 'いい + ところ', answers: ['いいところ', 'いい所', '良いところ'] },
        { q: '{有名|ゆうめい} + お{寺|てら}', answers: ['有名なお寺', 'ゆうめいなおてら', '有名なおてら'] },
        { q: '{冷|つめ}たい + お{茶|ちゃ}', answers: ['冷たいお茶', 'つめたいおちゃ', '冷たいおちゃ'] },
      ],
    },
    {
      t: 'quiz',
      id: 'b4-bt-doc-so',
      title: 'Đọc thời gian — viết bằng hiragana (hoặc romaji)',
      kind: 'fill',
      grammar: '～分: いっぷん・さんぷん・よんぷん・ろっぷん・はっぷん・じゅっぷん (còn lại ふん) · ～時間: 4 = よじかん, 9 = くじかん',
      items: [
        { q: '1分', answers: ['いっぷん', 'ippun'] },
        { q: '3分', answers: ['さんぷん', 'sanpun'] },
        { q: '6分', answers: ['ろっぷん', 'roppun'] },
        { q: '10分', answers: ['じゅっぷん', 'じっぷん', 'juppun', 'jippun'] },
        { q: '15分', answers: ['じゅうごふん', 'juugofun'] },
        { q: '20分', answers: ['にじゅっぷん', 'にじっぷん', 'nijuppun'] },
        { q: '4時間', answers: ['よじかん', 'yojikan'] },
        { q: '9時間', answers: ['くじかん', 'kujikan'] },
        { q: '2時間半', answers: ['にじかんはん', 'nijikanhan'] },
        { q: '何分', answers: ['なんぷん', 'nanpun'] },
        { q: '何時間', answers: ['なんじかん', 'nanjikan'] },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-bt-tro-tu',
      title: 'Chọn trợ từ đúng',
      items: [
        { q: 'ハノイ＿大きい川があります。', options: ['で', 'に', 'を', 'は'], correct: 1, why: 'Nơi tồn tại → **に**.' },
        { q: 'ハノイに大きい川＿あります。', options: ['を', 'が', 'の', 'で'], correct: 1, why: 'Vật tồn tại → **が**.' },
        { q: 'ダナンはベトナム＿真ん中です。', options: ['に', 'の', 'で', 'が'], correct: 1, why: 'Nước **の** vị trí.' },
        { q: 'ハノイ＿ダナン＿どのくらいですか。', options: ['から / まで', 'まで / から', 'に / で', 'で / に'], correct: 0, why: 'Từ … đến … = **から … まで**.' },
        { q: '電車＿30分くらいです。', options: ['に', 'を', 'で', 'が'], correct: 2, why: 'Phương tiện → **で**.' },
        { q: '私の町は緑＿多いです。', options: ['を', 'が', 'に', 'で'], correct: 1, why: 'N1 は N2 **が** A (đặc điểm).' },
        { q: '海＿山があります。 (biển và núi)', options: ['そして', 'と', 'が', 'も'], correct: 1, why: 'Nối hai danh từ → **と**. そして nối hai câu.' },
        { q: 'パースは小さいです＿、いいところです。', options: ['そして', 'と', 'が', 'ね'], correct: 2, why: 'Hai ý ngược chiều → **が** (nhưng).' },
        { q: 'ベトナム＿冬、何を食べますか。 (ở Việt Nam, ăn — hành động)', options: ['に', 'で', 'の', 'が'], correct: 1, why: 'Nơi xảy ra hành động {食|た}べます → **で** (Bài 3). Khác với "có ở" → に.' },
        { q: 'ハノイは暑いです。ダナン＿暑いです。 (Đà Nẵng cũng nóng)', options: ['は', 'も', 'が', 'の'], correct: 1, why: '"Cũng" → **も** (Bài 1).' },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-bt-tu-vung',
      title: 'Từ vựng',
      items: [
        { q: 'Phía nam là:', options: ['きた', 'みなみ', 'ひがし', 'にし'], correct: 1, why: '**みなみ** ({南|みなみ}).' },
        { q: '「{新幹線|しんかんせん}」 là:', options: ['Tàu điện thường', 'Tàu cao tốc', 'Máy bay', 'Xe buýt'], correct: 1, why: 'Shinkansen = tàu cao tốc.' },
        { q: '「{温泉|おんせん}」 là:', options: ['Sông', 'Chùa', 'Suối nước nóng', 'Lâu đài'], correct: 2, why: 'おんせん = suối nước nóng.' },
        { q: 'Đền thờ (Thần đạo) là:', options: ['おてら', 'きょうかい', 'じんじゃ', 'おしろ'], correct: 2, why: '**じんじゃ**; おてら = chùa, きょうかい = nhà thờ, おしろ = lâu đài.' },
        { q: 'Trái nghĩa của 「{高|たか}い」 (cao) là:', options: ['{低|ひく}い', '{小|ちい}さい', '{少|すく}ない', '{古|ふる}い'], correct: 0, why: 'Cao ↔ thấp: {高|たか}い ↔ **{低|ひく}い**.' },
        { q: 'Trái nghĩa của 「{新|あたら}しい」 là:', options: ['{大|おお}きい', '{古|ふる}い', 'いい', '{高|たか}い'], correct: 1, why: 'Mới ↔ cũ: **{古|ふる}い**.' },
        { q: '「にぎやか」 là:', options: ['Yên tĩnh', 'Nổi tiếng', 'Nhộn nhịp', 'Sạch đẹp'], correct: 2, why: 'にぎやか = nhộn nhịp; {静|しず}か = yên tĩnh.' },
        { q: 'Trời mát mẻ:', options: ['すずしい', 'つめたい', 'さむい', 'あたたかい'], correct: 0, why: '**すずしい** (thời tiết mát). つめたい = đồ vật lạnh.' },
        { q: 'Cà phê này **nóng** — chọn từ đúng:', options: ['このコーヒーは{暑|あつ}いです。', 'このコーヒーは{熱|あつ}いです。', 'このコーヒーは{暖|あたた}かいです。', 'このコーヒーは{寒|さむ}いです。'], correct: 1, why: 'Đồ uống nóng → **{熱|あつ}い**.' },
        { q: '「すっぱい」 là:', options: ['Ngọt', 'Cay', 'Đắng', 'Chua'], correct: 3, why: 'すっぱい = chua; {甘|あま}い ngọt, {辛|から}い cay, {苦|にが}い đắng.' },
        { q: '「{一年中|いちねんじゅう}」 là:', options: ['Một năm một lần', 'Suốt một năm', 'Năm ngoái', 'Giữa năm'], correct: 1, why: 'いちねんじゅう = quanh năm.' },
        { q: 'Hỏi "mất bao lâu" dùng:', options: ['いくら', 'どのくらい', 'どんな', 'いつ'], correct: 1, why: '**どのくらい**.' },
        { q: '「そうですね」 dùng khi:', options: ['Nhận thông tin mới', 'Đồng tình với người kia', 'Hỏi lại', 'Xin lỗi'], correct: 1, why: 'Đồng tình. Thông tin mới → そうですか.' },
        { q: '「{緑|みどり}が{多|おお}い」 nghĩa là:', options: ['Nhiều nước', 'Nhiều cây xanh', 'Nhiều người', 'Nhiều mưa'], correct: 1, why: '{緑|みどり} = màu xanh lá, cây xanh.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-bt-sai',
      title: 'Câu nào ĐÚNG? (tìm câu không có lỗi)',
      items: [
        { q: 'Chọn câu đúng:', options: ['ハノイは大きいじゃありません。', 'ハノイは大きくないです。', 'ハノイは大きいくないです。', 'ハノイは大きくじゃないです。'], correct: 1, why: 'イA: **大きくないです**.' },
        { q: 'Chọn câu đúng:', options: ['ダナンはきれい町です。', 'ダナンはきれいの町です。', 'ダナンはきれいな町です。', 'ダナンはきれいい町です。'], correct: 2, why: 'ナA + **な** + N.' },
        { q: 'Chọn câu đúng:', options: ['この町は静かくないです。', 'この町は静かじゃありません。', 'この町は静かないです。', 'この町は静かなじゃありません。'], correct: 1, why: 'ナA phủ định: **じゃありません**.' },
        { q: 'Chọn câu đúng:', options: ['私の国は夏、あまり暑いです。', '私の国は夏、とても暑くないです。', '私の国は夏、あまり暑くないです。', '私の国は夏、少し暑くないです。'], correct: 2, why: '**あまり** + phủ định.' },
        { q: 'Chọn câu đúng:', options: ['ハノイで古いお寺があります。', 'ハノイに古いお寺があります。', 'ハノイに古いお寺をあります。', 'ハノイは古いお寺にあります。'], correct: 1, why: 'N1 **に** N2 **が** あります.' },
        { q: 'Chọn câu đúng:', options: ['駅まで歩いてで10分です。', '駅まで歩いて10分です。', '駅まで足で10分です。', '駅まで歩きで10分です。'], correct: 1, why: '**歩いて** — không で.' },
        { q: 'Chọn câu đúng:', options: ['天気はいくないです。', '天気はいいくないです。', '天気はよくないです。', '天気はいいじゃありません。'], correct: 2, why: 'いい → **よくない**.' },
        { q: 'Chọn câu đúng:', options: ['ハノイは北のベトナムです。', 'ベトナムはハノイの北です。', 'ハノイはベトナムの北です。', 'ハノイのベトナムは北です。'], correct: 2, why: 'Nơi nhỏ は nơi lớn **の** hướng です.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-bt-hoi-dap',
      title: 'Chọn câu trả lời đúng cho câu hỏi',
      items: [
        { q: 'ハノイはどんなところですか。', options: ['ベトナムの{北|きた}です。', 'にぎやかなところです。', '{飛行機|ひこうき}で5{時間|じかん}です。', 'はい、いいところです。'], correct: 1, why: 'どんな → tính từ + danh từ.' },
        { q: 'ハノイはどこですか。', options: ['にぎやかです。', 'ベトナムの{北|きた}です。', 'フォーがあります。', 'とても{暑|あつ}いです。'], correct: 1, why: 'どこ → vị trí.' },
        { q: '{東京|とうきょう}から{大阪|おおさか}までどのくらいですか。', options: ['{新幹線|しんかんせん}で2{時間半|じかんはん}くらいです。', '{大阪|おおさか}は{日本|にほん}の{西|にし}です。', '2{時|じ}{半|はん}です。', 'にぎやかです。'], correct: 0, why: 'どのくらい → thời gian (時間, không phải 時).' },
        { q: 'ダナンに{何|なに}がありますか。', options: ['きれいです。', '{海|うみ}と{山|やま}があります。', 'ベトナムの{真|ま}ん{中|なか}です。', 'はい、あります。'], correct: 1, why: '{何|なに}が → ～があります.' },
        { q: 'ベトナムの{料理|りょうり}はどうですか。', options: ['はい、おいしいです。', 'とてもおいしいです。', 'ベトナムの{料理|りょうり}です。', 'フォーです。'], correct: 1, why: 'どう → cảm nhận, không dùng はい.' },
        { q: 'ハノイは{冬|ふゆ}、{暑|あつ}いですか。', options: ['はい、{暑|あつ}くないです。', 'いいえ、あまり{暑|あつ}くないです。', 'いいえ、{暑|あつ}いです。', 'いいえ、{暑|あつ}いじゃありません。'], correct: 1, why: 'いいえ + phủ định đúng dạng.' },
        { q: 'あなたの{町|まち}は{静|しず}かですか。 (thành phố bạn nhộn nhịp)', options: ['いいえ、{静|しず}かくないです。', 'いいえ、{静|しず}かじゃありません。にぎやかです。', 'はい、にぎやかです。', 'いいえ、{静|しず}かです。'], correct: 1, why: 'ナA phủ định + nói thêm đáp án đúng = trọn điểm.' },
        { q: '{寒|さむ}いですね。', options: ['そうですか。', 'そうですね。', 'はい、{寒|さむ}いですか。', 'どうですか。'], correct: 1, why: 'Đồng tình → そうですね.' },
      ],
    },
    {
      t: 'build',
      id: 'b4-bt-ghep',
      title: 'Ghép câu — nói về quê mình',
      items: [
        { vi: 'Nước bạn mùa hè cũng nóng à?', chips: ['〜さんの', '{国|くに}', 'も', '{夏|なつ}、', '{暑|あつ}い', 'ですか', 'は', '{熱|あつ}い'], answer: ['〜さんの', '{国|くに}', 'も', '{夏|なつ}、', '{暑|あつ}い', 'ですか'], ro: '~-san no kuni mo natsu, atsui desu ka.' },
        { vi: 'Ở Huế có thành cổ, sông lớn, v.v.', chips: ['フエ', 'に', '{古|ふる}い', 'お{城|しろ}', 'や', '{大|おお}きい', '{川|かわ}', 'など', 'が', 'あります', 'で'], answer: ['フエ', 'に', '{古|ふる}い', 'お{城|しろ}', 'や', '{大|おお}きい', '{川|かわ}', 'など', 'が', 'あります'], ro: 'Fue ni furui oshiro ya ookii kawa nado ga arimasu.' },
        { vi: 'TP. Hồ Chí Minh ở phía nam Việt Nam.', chips: ['ホーチミン', 'は', 'ベトナム', 'の', '{南|みなみ}', 'です', '{北|きた}', 'に'], answer: ['ホーチミン', 'は', 'ベトナム', 'の', '{南|みなみ}', 'です'], ro: 'Hoochimin wa Betonamu no minami desu.' },
        { vi: 'Từ Tokyo đến Kyoto đi Shinkansen khoảng 2 tiếng.', chips: ['{東京|とうきょう}', 'から', '{京都|きょうと}', 'まで', '{新幹線|しんかんせん}', 'で', '2{時間|じかん}', 'くらい', 'です', '2{時|じ}'], answer: ['{東京|とうきょう}', 'から', '{京都|きょうと}', 'まで', '{新幹線|しんかんせん}', 'で', '2{時間|じかん}', 'くらい', 'です'], ro: 'Toukyou kara Kyouto made shinkansen de ni-jikan kurai desu.' },
        { vi: 'Sa Pa là nơi yên tĩnh.', chips: ['サパ', 'は', '{静|しず}かな', 'ところ', 'です', '{静|しず}か', 'の'], answer: ['サパ', 'は', '{静|しず}かな', 'ところ', 'です'], ro: 'Sapa wa shizuka na tokoro desu.' },
        { vi: 'Cà phê Việt Nam hơi đắng.', chips: ['ベトナム', 'の', 'コーヒー', 'は', '{少|すこ}し', '{苦|にが}い', 'です', 'あまり'], answer: ['ベトナム', 'の', 'コーヒー', 'は', '{少|すこ}し', '{苦|にが}い', 'です'], ro: 'Betonamu no koohii wa sukoshi nigai desu.' },
        { vi: 'Hà Nội không lớn lắm nhưng là nơi tốt.', chips: ['ハノイ', 'は', 'あまり', '{大|おお}きくないです', 'が、', 'いい', 'ところ', 'です', 'とても'], answer: ['ハノイ', 'は', 'あまり', '{大|おお}きくないです', 'が、', 'いい', 'ところ', 'です'], ro: 'Hanoi wa amari ookiku nai desu ga, ii tokoro desu.' },
        { vi: 'Ngày lạnh tôi uống trà nóng ấm.', chips: ['{寒|さむ}い', '{日|ひ}', 'に', '{温|あたた}かい', 'お{茶|ちゃ}', 'を', '{飲|の}みます', '{暖|あたた}かい'], answer: ['{寒|さむ}い', '{日|ひ}', 'に', '{温|あたた}かい', 'お{茶|ちゃ}', 'を', '{飲|の}みます'], ro: 'Samui hi ni atatakai ocha o nomimasu.' },
        { vi: 'Thời tiết Việt Nam thế nào?', chips: ['ベトナム', 'の', '{天気|てんき}', 'は', 'どう', 'ですか', 'どんな'], answer: ['ベトナム', 'の', '{天気|てんき}', 'は', 'どう', 'ですか'], ro: 'Betonamu no tenki wa dou desu ka.' },
        { vi: 'Đà Nẵng biển đẹp. Và đồ ăn ngon.', chips: ['ダナン', 'は', '{海|うみ}', 'が', 'きれいです。', 'そして、', '{料理|りょうり}', 'が', 'おいしいです。', 'と'], answer: ['ダナン', 'は', '{海|うみ}', 'が', 'きれいです。', 'そして、', '{料理|りょうり}', 'が', 'おいしいです。'], ro: 'Danan wa umi ga kirei desu. Soshite, ryouri ga oishii desu.' },
      ],
    },
  ],
};

export const BAI_4: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, KANJI, NGHE, NOI, BAI_TAP];
