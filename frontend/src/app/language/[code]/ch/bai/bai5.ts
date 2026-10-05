/**
 * Bài 5 — HSK 1 · 数字: số đếm 0–99, 二/两, 一 trong số, tuổi 多大/几岁, số điện thoại (khoá CH).
 * Bài cuối CHẶNG 1 ⇒ có thêm `b5-kiem-tra` (kind review) phủ Bài 0–5 theo dạng đề HSK 1.
 *
 * Phạm vi: từ Bài 1–4 + số 零…十, cách ghép 11–99, 二 hay 两, 一 đọc yī / yí / yì / yāo,
 * hỏi tuổi 多大 (người lớn, bạn bè) / 几岁 (trẻ nhỏ), S + (今年) + số + 岁 (không cần 是),
 * 几 và 多少, số điện thoại đọc từng chữ số (1 = yāo). Từ ngoài HSK 1 ghi "(từ mở rộng)".
 *
 * Quy ước pinyin như Bài 0–4: 3+3 ghi theo từ điển; 不 và 一 ghi theo cách đọc (一个 yí ge,
 * 一岁 yí suì, 一口 yì kǒu); trong số đếm 一 giữ yī (十一 shíyī); trong số điện thoại 一 ghi
 * yāo. Số nhiều chữ viết liền một từ: 二十一 èrshíyī, 十二 shí'èr.
 * Tuổi cố định cho cả khoá (năm 2026): Lan 20 · Vương Minh 21 · Anna 19 · Đại Vĩ 22 ·
 * anh trai Lan 25 · em gái Lan 15 · bố Lan 52 · mẹ Lan 48 · con trai bà chủ 10 · con gái 6.
 * Số điện thoại (hư cấu): Lan 158 1066 2479 · Đại Vĩ 139 0127 3580.
 */
import type { Lesson } from '@/components/sach-hoc/types';

type McqItem = { q: string; options: string[]; correct: number; why: string };
const m = (q: string, options: string[], correct: number, why: string): McqItem => ({ q, options, correct, why });

/** Đáp án pinyin: mỗi dạng truyền vào (có dấu hoặc dạng số) được nhận cả khi có lẫn không có dấu cách. */
const py = (...forms: string[]): string[] => {
  const out = new Set<string>();
  for (const f of forms) {
    out.add(f);
    out.add(f.replace(/\s+/g, ''));
  }
  return [...out];
};

/* ══════════════════════════ 1. HỘI THOẠI ══════════════════════════ */

const HOI_THOAI: Lesson = {
  id: 'b5-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại: 数字 — Bạn bao nhiêu tuổi? Số điện thoại là gì?',
  goal: 'Hỏi và nói tuổi của bạn bè, người thân và trẻ nhỏ đúng cách; đọc và hỏi số điện thoại; đếm từ 0 đến 99.',
  minutes: 35,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Bài 5 học gì',
      items: [
        'Số **0–10**: 零 一 二 三 四 五 六 七 八 九 十 — và cách ghép **11–99** giống hệt tiếng Việt: 二十一 = "hai mươi mốt".',
        '**二 hay 两?** Đếm, đọc số: **二** (十二, 二十). Trước lượng từ: **两** (两个, 两岁, 两口人).',
        'Hỏi tuổi: **你今年多大？** (bạn bè, người lớn) · **你几岁？** (trẻ dưới ~10 tuổi) → **我今年二十岁。** — KHÔNG cần 是.',
        'Hỏi số: **你的手机号是多少？** — đọc **từng chữ số**, số 1 đọc **yāo**: 一五八 = yāo wǔ bā.',
        '**一** đổi cách đọc: đếm **yī** (十一 shíyī) · trước thanh 4 **yí** (一个, 一岁) · trước thanh 1-2-3 **yì** (一口) · trong số điện thoại **yāo**.',
      ],
    },
    { t: 'h', text: 'Học xong Bài 5 bạn làm được gì' },
    {
      t: 'table',
      head: ['Tình huống', 'Bạn làm được', 'Câu then chốt'],
      rows: [
        ['1. Ở thư viện', 'Hỏi tuổi bạn bè và người thân của bạn, nói tuổi mình', '你今年多大？我今年二十岁。你哥哥多大？'],
        ['2. Ở quán ăn', 'Hỏi tuổi trẻ nhỏ đúng cách, dùng 两 và 二 đúng chỗ', '你几岁？我六岁。我哥哥十岁。'],
        ['3. Trao đổi số điện thoại', 'Hỏi, đọc và nhắc lại số điện thoại', '你的手机号是多少？一五八……'],
      ],
    },
    {
      t: 'p',
      text: 'Cách học phần này: đọc **bối cảnh** → nghe cả đoạn → bấm từng câu đọc theo 3 lần. Bài này có **rất nhiều con số**: mỗi khi nghe một số, hãy **viết ngay bằng chữ số** (20, 158…) ra giấy — đó cũng là cách làm bài nghe HSK.',
    },

    /* ── Tình huống 1 ── */
    { t: 'h', text: 'Tình huống 1 — Ở thư viện: "Bạn bao nhiêu tuổi?"' },
    {
      t: 'p',
      text: '**Bối cảnh.** Lan và Vương Minh ngồi học ở thư viện. Vương Minh làm bảng thông tin cho câu lạc bộ tiếng Anh nên hỏi tuổi các bạn. Lan nhân tiện kể về anh trai và em gái (đã giới thiệu ở Bài 4).',
    },
    {
      t: 'dialogue',
      title: '你今年多大？— Năm nay bạn bao nhiêu tuổi?',
      lines: [
        { who: '王明 Vương Minh', role: 'b', text: '{兰兰|Lánlan}，{你|nǐ}{今年|jīnnián}{多大|duō dà}？', ro: 'Lánlan, nǐ jīnnián duō dà?', vi: 'Lan, năm nay bạn bao nhiêu tuổi?' },
        { who: '兰兰 Lan', role: 'a', text: '{我|wǒ}{今年|jīnnián}{二十|èrshí}{岁|suì}。{你|nǐ}{呢|ne}？', ro: 'Wǒ jīnnián èrshí suì. Nǐ ne?', vi: 'Năm nay mình hai mươi tuổi. Còn bạn?' },
        { who: '王明 Vương Minh', role: 'b', text: '{我|wǒ}{二十一|èrshíyī}{岁|suì}。{安娜|Ānnà}{多大|duō dà}？', ro: 'Wǒ èrshíyī suì. Ānnà duō dà?', vi: 'Mình hai mươi mốt. Anna bao nhiêu tuổi?' },
        { who: '兰兰 Lan', role: 'a', text: '{她|tā}{十九|shíjiǔ}{岁|suì}。{大伟|Dàwěi}{二十二|èrshí\'èr}{岁|suì}。', ro: "Tā shíjiǔ suì. Dàwěi èrshí'èr suì.", vi: 'Bạn ấy mười chín tuổi. Đại Vĩ hai mươi hai tuổi.' },
        { who: '王明 Vương Minh', role: 'b', text: '{你|nǐ}{哥哥|gēge}{多大|duō dà}？', ro: 'Nǐ gēge duō dà?', vi: 'Anh trai bạn bao nhiêu tuổi?' },
        { who: '兰兰 Lan', role: 'a', text: '{他|tā}{二十五|èrshíwǔ}{岁|suì}。{我|wǒ}{妹妹|mèimei}{很|hěn}{小|xiǎo}，{她|tā}{十五|shíwǔ}{岁|suì}。', ro: 'Tā èrshíwǔ suì. Wǒ mèimei hěn xiǎo, tā shíwǔ suì.', vi: 'Anh ấy hai mươi lăm tuổi. Em gái mình còn nhỏ, mới mười lăm tuổi.' },
        { who: '王明 Vương Minh', role: 'b', text: '{你|nǐ}{爸爸|bàba}{妈妈|māma}{呢|ne}？', ro: 'Nǐ bàba māma ne?', vi: 'Còn bố mẹ bạn?' },
        { who: '兰兰 Lan', role: 'a', text: '{我|wǒ}{爸爸|bàba}{五十二|wǔshí\'èr}，{我|wǒ}{妈妈|māma}{四十八|sìshíbā}。', ro: "Wǒ bàba wǔshí'èr, wǒ māma sìshíbā.", vi: 'Bố mình năm mươi hai, mẹ mình bốn mươi tám.' },
        { who: '王明 Vương Minh', role: 'b', text: '{好|hǎo}，{谢谢|xièxie}！{我们|wǒmen}{有|yǒu}{十二|shí\'èr}{个|ge}{人|rén}{了|le}！', ro: "Hǎo, xièxie! Wǒmen yǒu shí'èr ge rén le!", vi: 'Được rồi, cảm ơn nhé! Câu lạc bộ mình có mười hai người rồi!' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong tình huống 1',
      items: [
        '**你今年多大？** — "năm nay bạn **lớn bao nhiêu**?" 多 duō = bao nhiêu, 大 dà = lớn (tuổi). Đây là cách hỏi tuổi **bạn bè, người trẻ, người ngang hàng**.',
        '**我今年二十岁** — nói tuổi **không cần 是**: S + (今年) + số + 岁. Giống tiếng Việt "Tôi hai mươi tuổi" — không ai nói "tôi **là** hai mươi tuổi".',
        '**二十一** èrshíyī = 2 × 10 + 1, đọc y như tiếng Việt "hai mươi mốt". 一 ở **cuối số** giữ **yī**.',
        '**我爸爸五十二** — với tuổi trên 10, trong câu nói thường có thể **bỏ 岁** khi ngữ cảnh đã rõ đang nói tuổi.',
        '**二十二** èrshí\'èr: trong số đếm, "hai" luôn là **二** — kể cả 十二 shí\'èr, 二十二. Dấu **\'** tách âm tiết bắt đầu bằng nguyên âm (èr).',
        '**我们有十二个人了** — 了 le ở cuối câu báo "đã thành, đã đủ" (học kỹ ở Bài 15). Ở đây chỉ cần hiểu "đã có 12 người rồi".',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{你|nǐ}{今年|jīnnián}{多大|duō dà}？', ro: 'Nǐ jīnnián duō dà?', vi: 'Năm nay bạn bao nhiêu tuổi?' },
        { en: '{我|wǒ}{今年|jīnnián}{二十|èrshí}{岁|suì}。', ro: 'Wǒ jīnnián èrshí suì.', vi: 'Năm nay tôi hai mươi tuổi.' },
        { en: '{我|wǒ}{二十一|èrshíyī}{岁|suì}。', ro: 'Wǒ èrshíyī suì.', vi: 'Tôi hai mươi mốt tuổi.' },
        { en: '{你|nǐ}{哥哥|gēge}{多大|duō dà}？', ro: 'Nǐ gēge duō dà?', vi: 'Anh trai bạn bao nhiêu tuổi?' },
        { en: '{她|tā}{十五|shíwǔ}{岁|suì}。', ro: 'Tā shíwǔ suì.', vi: 'Em ấy mười lăm tuổi.' },
        { en: '{我|wǒ}{妈妈|māma}{四十八|sìshíbā}{岁|suì}。', ro: 'Wǒ māma sìshíbā suì.', vi: 'Mẹ tôi bốn mươi tám tuổi.' },
      ],
    },

    /* ── Tình huống 2 ── */
    { t: 'h', text: 'Tình huống 2 — Ở quán ăn: "Cháu mấy tuổi rồi?"' },
    {
      t: 'p',
      text: '**Bối cảnh.** Lan quay lại quán ăn của bà chủ (Bài 4). Cô con gái nhỏ của bà chủ đang ngồi đếm que tính. Lan hỏi chuyện bé — với trẻ nhỏ thì hỏi tuổi bằng **几岁**.',
    },
    {
      t: 'dialogue',
      title: '你几岁？— Cháu mấy tuổi?',
      lines: [
        { who: '兰兰 Lan', role: 'a', text: '{你好|nǐ hǎo}！{你|nǐ}{叫|jiào}{什么|shénme}{名字|míngzi}？', ro: 'Nǐ hǎo! Nǐ jiào shénme míngzi?', vi: 'Chào em! Em tên là gì?' },
        { who: '小女孩 Bé gái', role: 'c', text: '{我|wǒ}{叫|jiào}{小美|Xiǎoměi}。', ro: 'Wǒ jiào Xiǎoměi.', vi: 'Em tên là Tiểu Mỹ.' },
        { who: '兰兰 Lan', role: 'a', text: '{小美|Xiǎoměi}，{你|nǐ}{几|jǐ}{岁|suì}？', ro: 'Xiǎoměi, nǐ jǐ suì?', vi: 'Tiểu Mỹ, em mấy tuổi rồi?' },
        { who: '小女孩 Bé gái', role: 'c', text: '{我|wǒ}{六|liù}{岁|suì}！{一|yī}、{二|èr}、{三|sān}、{四|sì}、{五|wǔ}、{六|liù}！', ro: 'Wǒ liù suì! Yī, èr, sān, sì, wǔ, liù!', vi: 'Em sáu tuổi! Một, hai, ba, bốn, năm, sáu!' },
        { who: '兰兰 Lan', role: 'a', text: '{你|nǐ}{哥哥|gēge}{几|jǐ}{岁|suì}？', ro: 'Nǐ gēge jǐ suì?', vi: 'Anh trai em mấy tuổi?' },
        { who: '小女孩 Bé gái', role: 'c', text: '{他|tā}{十|shí}{岁|suì}。{他|tā}{很|hěn}{大|dà}！', ro: 'Tā shí suì. Tā hěn dà!', vi: 'Anh ấy mười tuổi. Anh ấy lớn lắm!' },
        { who: '老板 Bà chủ quầy', role: 'c', text: '{兰兰|Lánlan}，{你|nǐ}{妹妹|mèimei}{几|jǐ}{岁|suì}？', ro: 'Lánlan, nǐ mèimei jǐ suì?', vi: 'Lan ơi, em gái cháu mấy tuổi?' },
        { who: '兰兰 Lan', role: 'a', text: '{她|tā}{不|bú}{是|shì}{六|liù}{岁|suì}，{她|tā}{十五|shíwǔ}{岁|suì}{了|le}！{她|tā}{不|bù}{小|xiǎo}{了|le}。', ro: 'Tā bú shì liù suì, tā shíwǔ suì le! Tā bù xiǎo le.', vi: 'Em ấy không phải sáu tuổi đâu, mười lăm tuổi rồi ạ! Không còn nhỏ nữa.' },
        { who: '老板 Bà chủ quầy', role: 'c', text: '{哈哈|hāhā}，{十五|shíwǔ}{岁|suì}{不|bù}{小|xiǎo}。{我|wǒ}{有|yǒu}{两|liǎng}{个|ge}{孩子|háizi}，{一|yí}{个|ge}{十|shí}{岁|suì}，{一|yí}{个|ge}{六|liù}{岁|suì}。', ro: 'Hāhā, shíwǔ suì bù xiǎo. Wǒ yǒu liǎng ge háizi, yí ge shí suì, yí ge liù suì.', vi: 'Ha ha, mười lăm tuổi thì không nhỏ thật. Cô có hai đứa, một đứa mười tuổi, một đứa sáu tuổi.' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong tình huống 2',
      items: [
        '**你几岁？** — hỏi tuổi **trẻ em** (khoảng dưới 10 tuổi), vì 几 dùng khi đoán con số nhỏ. Hỏi người lớn bằng 几岁 nghe như coi họ là trẻ con — với người lớn dùng **多大**.',
        '**一、二、三、四、五、六** — khi **đếm** liên tiếp, 一 đọc **yī** (thanh gốc), 二 đọc **èr**. Không dùng 两 khi đếm.',
        '**她不是六岁** — câu tuổi khẳng định không cần 是, nhưng khi **phủ định** thì dùng **不是**: 她**不是**六岁 (em ấy không phải 6 tuổi).',
        '**十五岁了** — 了 cuối câu nhấn "đã đến mức đó rồi" (mười lăm tuổi rồi). 不小了 = không còn nhỏ nữa. (了 học kỹ ở Bài 15.)',
        '**小美** Xiǎoměi — tên ở nhà rất phổ biến: 小 (nhỏ) + một chữ trong tên. Người Trung Quốc gọi trẻ con và bạn thân bằng 小 + tên.',
        '小女孩 xiǎo nǚhái (bé gái) và 哈哈 hāhā (ha ha) là từ mở rộng.',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{你|nǐ}{几|jǐ}{岁|suì}？', ro: 'Nǐ jǐ suì?', vi: 'Cháu/em mấy tuổi? (hỏi trẻ nhỏ)' },
        { en: '{我|wǒ}{六|liù}{岁|suì}。', ro: 'Wǒ liù suì.', vi: 'Cháu sáu tuổi.' },
        { en: '{他|tā}{十|shí}{岁|suì}。', ro: 'Tā shí suì.', vi: 'Anh ấy mười tuổi.' },
        { en: '{她|tā}{不|bú}{是|shì}{六|liù}{岁|suì}。', ro: 'Tā bú shì liù suì.', vi: 'Em ấy không phải sáu tuổi.' },
        { en: '{我|wǒ}{有|yǒu}{两|liǎng}{个|ge}{孩子|háizi}。', ro: 'Wǒ yǒu liǎng ge háizi.', vi: 'Tôi có hai đứa con.' },
      ],
    },

    /* ── Tình huống 3 ── */
    { t: 'h', text: 'Tình huống 3 — Trao đổi số điện thoại' },
    {
      t: 'p',
      text: '**Bối cảnh.** Sau giờ học, Đại Vĩ muốn rủ cả nhóm đi ăn cuối tuần nên xin số điện thoại của Lan. Số di động Trung Quốc có **11 chữ số**, người ta đọc theo nhóm 3 – 4 – 4, **từng chữ số một**.',
    },
    {
      t: 'dialogue',
      title: '你的手机号是多少？— Số điện thoại của bạn là bao nhiêu?',
      lines: [
        { who: '大伟 Đại Vĩ', role: 'b', text: '{兰兰|Lánlan}，{你|nǐ}{的|de}{手机号|shǒujīhào}{是|shì}{多少|duōshao}？', ro: 'Lánlan, nǐ de shǒujīhào shì duōshao?', vi: 'Lan ơi, số di động của bạn là bao nhiêu?' },
        { who: '兰兰 Lan', role: 'a', text: '{一|yāo}{五|wǔ}{八|bā}，{一|yāo}{零|líng}{六|liù}{六|liù}，{二|èr}{四|sì}{七|qī}{九|jiǔ}。', ro: 'Yāo wǔ bā, yāo líng liù liù, èr sì qī jiǔ.', vi: '158 – 1066 – 2479.' },
        { who: '大伟 Đại Vĩ', role: 'b', text: '{一|yāo}{五|wǔ}{八|bā}，{一|yāo}{零|líng}{六|liù}{六|liù}，{二|èr}{四|sì}{七|qī}{九|jiǔ}，{对|duì}{吗|ma}？', ro: 'Yāo wǔ bā, yāo líng liù liù, èr sì qī jiǔ, duì ma?', vi: '158 – 1066 – 2479, đúng không?' },
        { who: '兰兰 Lan', role: 'a', text: '{对|duì}！{你|nǐ}{的|de}{呢|ne}？', ro: 'Duì! Nǐ de ne?', vi: 'Đúng rồi! Còn số của bạn?' },
        { who: '大伟 Đại Vĩ', role: 'b', text: '{我|wǒ}{的|de}{是|shì}{一|yāo}{三|sān}{九|jiǔ}，{零|líng}{一|yāo}{二|èr}{七|qī}，{三|sān}{五|wǔ}{八|bā}{零|líng}。', ro: 'Wǒ de shì yāo sān jiǔ, líng yāo èr qī, sān wǔ bā líng.', vi: 'Số của mình là 139 – 0127 – 3580.' },
        { who: '兰兰 Lan', role: 'a', text: '{三|sān}{五|wǔ}{八|bā}{零|líng}？{不|bú}{是|shì}{三|sān}{五|wǔ}{八|bā}{一|yāo}？', ro: 'Sān wǔ bā líng? Bú shì sān wǔ bā yāo?', vi: '3580 à? Không phải 3581 à?' },
        { who: '大伟 Đại Vĩ', role: 'b', text: '{不|bú}{是|shì}，{是|shì}{三|sān}{五|wǔ}{八|bā}{零|líng}。{王明|Wáng Míng}{的|de}{电话|diànhuà}{你|nǐ}{有|yǒu}{吗|ma}？', ro: 'Bú shì, shì sān wǔ bā líng. Wáng Míng de diànhuà nǐ yǒu ma?', vi: 'Không phải, là 3580. Bạn có số điện thoại của Vương Minh không?' },
        { who: '兰兰 Lan', role: 'a', text: '{有|yǒu}。{谢谢|xièxie}{你|nǐ}，{大伟|Dàwěi}！{明天|míngtiān}{见|jiàn}！', ro: 'Yǒu. Xièxie nǐ, Dàwěi! Míngtiān jiàn!', vi: 'Có. Cảm ơn bạn nhé, Đại Vĩ! Mai gặp!' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong tình huống 3',
      items: [
        '**你的手机号是多少？** — hỏi **số** (điện thoại, phòng, mã…) dùng **是多少** "là bao nhiêu". 手机号 shǒujīhào = số di động (手机 điện thoại di động + 号 số).',
        '**一 đọc yāo** trong số điện thoại, số phòng, số xe buýt — để khỏi nhầm **yī** (1) với **qī** (7) khi nghe qua điện thoại. Vẫn viết chữ 一, chỉ đổi cách đọc.',
        'Đọc **từng chữ số**, không đọc thành "một trăm năm mươi tám": 158 = **yāo wǔ bā**. Tiếng Việt cũng đọc số điện thoại từng chữ số — chỉ khác ở số 1.',
        '**零** líng = số 0. Trong số điện thoại luôn đọc rõ líng.',
        '**对吗？** duì ma — "đúng không?"; **对！** — "đúng!". (对 duì = đúng — từ HSK 1, học kỹ ở bài sau; 对不起 ở Bài 1 cũng có chữ này.)',
        '**王明的电话你有吗？** — đưa "số của Vương Minh" lên đầu câu để nhấn chủ đề; câu bình thường là 你有王明的电话吗？. 电话 diànhuà = điện thoại / số điện thoại.',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{你|nǐ}{的|de}{手机号|shǒujīhào}{是|shì}{多少|duōshao}？', ro: 'Nǐ de shǒujīhào shì duōshao?', vi: 'Số di động của bạn là bao nhiêu?' },
        { en: '{一|yāo}{五|wǔ}{八|bā}，{一|yāo}{零|líng}{六|liù}{六|liù}，{二|èr}{四|sì}{七|qī}{九|jiǔ}。', ro: 'Yāo wǔ bā, yāo líng liù liù, èr sì qī jiǔ.', vi: '158 1066 2479.' },
        { en: '{对|duì}{吗|ma}？— {对|duì}！', ro: 'Duì ma? — Duì!', vi: 'Đúng không? — Đúng!' },
        { en: '{你|nǐ}{有|yǒu}{王明|Wáng Míng}{的|de}{电话|diànhuà}{吗|ma}？', ro: 'Nǐ yǒu Wáng Míng de diànhuà ma?', vi: 'Bạn có số điện thoại của Vương Minh không?' },
      ],
    },

    /* ── Văn hoá ── */
    { t: 'h', text: 'Văn hoá: đếm bằng một bàn tay và những con số "may mắn"' },
    {
      t: 'p',
      text: 'Người Trung Quốc **đếm từ 1 đến 10 chỉ bằng một bàn tay**. Số 1–5 giơ ngón như ta, nhưng 6–10 có ký hiệu riêng. Ngoài chợ, khi trả giá ồn ào, người bán hay **giơ tay ra hiệu** thay vì nói — bạn nên nhận ra được.',
    },
    {
      t: 'table',
      caption: 'Ký hiệu tay số 6–10 (một bàn tay)',
      head: ['Số', 'Chữ', 'Cách giơ tay'],
      rows: [
        ['6', '六 liù', 'Giơ ngón cái và ngón út, gập ba ngón giữa (như hình gọi điện thoại)'],
        ['7', '七 qī', 'Chụm đầu ngón cái, ngón trỏ và ngón giữa lại với nhau'],
        ['8', '八 bā', 'Giơ ngón cái và ngón trỏ thành hình chữ L (giống chữ 八)'],
        ['9', '九 jiǔ', 'Giơ ngón trỏ rồi gập cong như cái móc câu'],
        ['10', '十 shí', 'Nắm cả bàn tay lại, hoặc bắt chéo hai ngón trỏ thành chữ 十'],
      ],
    },
    {
      t: 'note',
      title: 'Con số và âm đọc — vì sao người Trung Quốc thích số 8, ngại số 4',
      items: [
        '**8 八 bā** đọc gần **发 fā** (phát — phát tài) → số đẹp nhất. Biển số xe, số điện thoại có nhiều số 8 được bán giá cao. Lễ khai mạc Olympic Bắc Kinh bắt đầu lúc 8 giờ 8 phút tối ngày 8/8/2008.',
        '**4 四 sì** đọc gần **死 sǐ** (chết — từ mở rộng) → nhiều toà nhà **bỏ tầng 4**, số phòng tránh số 4, giống người Việt ngại số 13.',
        '**6 六 liù** gần **流 liú** (trôi chảy) → "suôn sẻ": 六六大顺 liùliù dà shùn — mọi việc thuận lợi (từ mở rộng).',
        '**9 九 jiǔ** đồng âm **久 jiǔ** (lâu dài) → hay dùng trong quà cưới, quà tình yêu.',
        'Người Việt cũng thích số 8 ("phát") và 6 ("lộc") — một điểm văn hoá chung rất dễ nhớ.',
      ],
    },
  ],
};

/* ══════════════════════════ 2. TỪ VỰNG ══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b5-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng Bài 5 — 25 từ: số 0–10, tuổi, số điện thoại',
  goal: 'Đọc đúng thanh và dùng được 11 con số cơ bản cùng 14 từ về tuổi tác, số lượng và điện thoại.',
  minutes: 35,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Ghi nhớ trước khi học',
      items: [
        '**11 số cơ bản** (零 → 十) là đủ để ghép mọi số 0–99. Âm Hán Việt của chúng bạn đã biết: NHẤT, NHỊ, TAM, TỨ, NGŨ, LỤC, THẤT, BÁT, CỬU, THẬP.',
        '**Thanh điệu của số** rất hay nhầm: **四 sì** (thanh 4, hạ mạnh) ≠ **十 shí** (thanh 2, đi lên); **七 qī** (cao, phẳng) ≠ **一 yī**. Nghe 🔊 thật kỹ.',
        '**岁** suì = tuổi · **多大** = bao nhiêu tuổi · **几岁** = mấy tuổi (trẻ nhỏ) · **多少** = bao nhiêu (số bất kỳ).',
        'Mỗi từ: 🔊 nghe → đọc to 3 lần → đọc câu ví dụ → bấm **Che nghĩa** để tự kiểm tra.',
      ],
    },

    { t: 'h', text: 'Nhóm 1 — Số đếm 0–10 (11 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{零|líng}', pos: 'số từ', ipa: 'líng', vi: 'số không (0)', ex: '{一|yāo}{零|líng}{六|liù}', exRo: 'yāo líng liù', exVi: '106 (đọc từng chữ số)', more: 'Hán Việt: **LINH** (một trăm linh sáu — 106!). Viết năm còn dùng 〇: 二〇二六 = 2026.' },
        { w: '{一|yī}', pos: 'số từ', ipa: 'yī', vi: 'một (1)', ex: '{我|wǒ}{有|yǒu}{一|yí}{个|ge}{哥哥|gēge}。', exRo: 'Wǒ yǒu yí ge gēge.', exVi: 'Tôi có một anh trai.', more: 'Hán Việt: **NHẤT**. Đếm: yī · trước thanh 4: **yí** (一个, 一岁) · trước thanh 1-2-3: **yì** (一口) · số điện thoại: **yāo**.' },
        { w: '{二|èr}', pos: 'số từ', ipa: 'èr', vi: 'hai (2) — khi đếm, đọc số', ex: '{我|wǒ}{今年|jīnnián}{二十|èrshí}{岁|suì}。', exRo: 'Wǒ jīnnián èrshí suì.', exVi: 'Năm nay tôi hai mươi tuổi.', more: 'Hán Việt: **NHỊ**. Vần **er** cuộn lưỡi. Trước lượng từ dùng **两** (两个) — xem Ngữ pháp ③.' },
        { w: '{三|sān}', pos: 'số từ', ipa: 'sān', vi: 'ba (3)', ex: '{王明|Wáng Míng}{家|jiā}{有|yǒu}{三|sān}{口|kǒu}{人|rén}。', exRo: 'Wáng Míng jiā yǒu sān kǒu rén.', exVi: 'Nhà Vương Minh có ba người.', more: 'Hán Việt: **TAM**. **s** đầu lưỡi (không uốn) — khác **shān** (núi).' },
        { w: '{四|sì}', pos: 'số từ', ipa: 'sì', vi: 'bốn (4)', ex: '{安娜|Ānnà}{家|jiā}{有|yǒu}{四|sì}{口|kǒu}{人|rén}。', exRo: 'Ānnà jiā yǒu sì kǒu rén.', exVi: 'Nhà Anna có bốn người.', more: 'Hán Việt: **TỨ**. **sì** (s thẳng, thanh 4) ≠ **shí** 十 (sh uốn, thanh 2) — cặp người Việt nhầm nhiều nhất.' },
        { w: '{五|wǔ}', pos: 'số từ', ipa: 'wǔ', vi: 'năm (5)', ex: '{兰兰|Lánlan}{家|jiā}{有|yǒu}{五|wǔ}{口|kǒu}{人|rén}。', exRo: 'Lánlan jiā yǒu wǔ kǒu rén.', exVi: 'Nhà Lan có năm người.', more: 'Hán Việt: **NGŨ** (ngũ hành). Thanh 3 trầm: đọc "ủ" kéo xuống.' },
        { w: '{六|liù}', pos: 'số từ', ipa: 'liù', vi: 'sáu (6)', ex: '{小美|Xiǎoměi}{六|liù}{岁|suì}。', exRo: 'Xiǎoměi liù suì.', exVi: 'Tiểu Mỹ sáu tuổi.', more: 'Hán Việt: **LỤC** (lục địa). Vần **iu** = iou viết gọn: đọc "liêu" nhanh, hạ giọng.' },
        { w: '{七|qī}', pos: 'số từ', ipa: 'qī', vi: 'bảy (7)', ex: '{我|wǒ}{有|yǒu}{七|qī}{个|ge}{中国|Zhōngguó}{朋友|péngyou}。', exRo: 'Wǒ yǒu qī ge Zhōngguó péngyou.', exVi: 'Tôi có bảy người bạn Trung Quốc.', more: 'Hán Việt: **THẤT**. **q** bật hơi (như "ch" có hơi) — khác **jī**. Nghe qua điện thoại dễ lẫn với 一 yī → nên đọc 1 là yāo.' },
        { w: '{八|bā}', pos: 'số từ', ipa: 'bā', vi: 'tám (8)', ex: '{我|wǒ}{妈妈|māma}{四十八|sìshíbā}{岁|suì}。', exRo: 'Wǒ māma sìshíbā suì.', exVi: 'Mẹ tôi bốn mươi tám tuổi.', more: 'Hán Việt: **BÁT**. Số may mắn (gần âm 发 fā — phát).' },
        { w: '{九|jiǔ}', pos: 'số từ', ipa: 'jiǔ', vi: 'chín (9)', ex: '{安娜|Ānnà}{十九|shíjiǔ}{岁|suì}。', exRo: 'Ānnà shíjiǔ suì.', exVi: 'Anna mười chín tuổi.', more: 'Hán Việt: **CỬU** (cửu long). Vần iu, thanh 3. Đừng viết nhầm với 几 (mấy).' },
        { w: '{十|shí}', pos: 'số từ', ipa: 'shí', vi: 'mười (10)', ex: '{她|tā}{儿子|érzi}{十|shí}{岁|suì}。', exRo: 'Tā érzi shí suì.', exVi: 'Con trai cô ấy mười tuổi.', more: 'Hán Việt: **THẬP** (thập phân). **sh** uốn lưỡi, thanh 2 đi lên. 十一 shíyī … 九十九 jiǔshíjiǔ.' },
      ],
    },

    { t: 'h', text: 'Nhóm 2 — Tuổi tác, lớn nhỏ (7 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{岁|suì}', pos: 'lượng từ (tuổi)', ipa: 'suì', vi: 'tuổi', ex: '{我|wǒ}{二十|èrshí}{岁|suì}。', exRo: 'Wǒ èrshí suì.', exVi: 'Tôi hai mươi tuổi.', more: 'Hán Việt: **TUẾ** (vạn tuế). 岁 đứng **sau** con số như tiếng Việt. 一岁 đọc **yí** suì; 两岁 liǎng suì (không nói 二岁).' },
        { w: '{多|duō}', pos: 'tính từ / phó từ', ipa: 'duō', vi: 'nhiều; (trong câu hỏi) bao nhiêu, mức nào', ex: '{我|wǒ}{有|yǒu}{很|hěn}{多|duō}{朋友|péngyou}。', exRo: 'Wǒ yǒu hěn duō péngyou.', exVi: 'Tôi có rất nhiều bạn.', more: 'Hán Việt: **ĐA** (đa số). 多 + tính từ = hỏi mức độ: 多大 (bao nhiêu tuổi). Trái nghĩa: 少 shǎo (ít).' },
        { w: '{大|dà}', pos: 'tính từ', ipa: 'dà', vi: 'to, lớn; (tuổi) lớn, nhiều tuổi', ex: '{北京|Běijīng}{很|hěn}{大|dà}。', exRo: 'Běijīng hěn dà.', exVi: 'Bắc Kinh rất rộng lớn.', more: 'Hán Việt: **ĐẠI**. Với tuổi: 多大 (bao nhiêu tuổi), 我哥哥很大 — anh tôi lớn tuổi rồi. Đã gặp trong 大家.' },
        { w: '{小|xiǎo}', pos: 'tính từ', ipa: 'xiǎo', vi: 'nhỏ, bé; (tuổi) nhỏ', ex: '{我|wǒ}{妹妹|mèimei}{很|hěn}{小|xiǎo}。', exRo: 'Wǒ mèimei hěn xiǎo.', exVi: 'Em gái tôi còn nhỏ.', more: 'Hán Việt: **TIỂU** (tiểu học). 小 + tên = tên gọi thân mật: 小美, 小王.' },
        { w: '{多大|duō dà}', pos: 'cụm hỏi', ipa: 'duō dà', vi: 'bao nhiêu tuổi (hỏi người trẻ, người ngang hàng)', ex: '{你|nǐ}{今年|jīnnián}{多大|duō dà}？', exRo: 'Nǐ jīnnián duō dà?', exVi: 'Năm nay bạn bao nhiêu tuổi?', more: 'Nghĩa đen "lớn bao nhiêu". Hỏi người già lịch sự: 您多大年纪了？(từ mở rộng).' },
        { w: '{今年|jīnnián}', pos: 'danh từ (thời gian)', ipa: 'jīnnián', vi: 'năm nay', ex: '{我|wǒ}{妹妹|mèimei}{今年|jīnnián}{十五|shíwǔ}{岁|suì}。', exRo: 'Wǒ mèimei jīnnián shíwǔ suì.', exVi: 'Năm nay em gái tôi mười lăm tuổi.', more: 'Hán Việt: KIM NIÊN (今 = nay). Từ thời gian đứng **sau chủ ngữ, trước vị ngữ** (hoặc đầu câu).' },
        { w: '{年|nián}', pos: 'danh từ', ipa: 'nián', vi: 'năm', ex: '{今年|jīnnián}{是|shì}{二〇二六|èr líng èr liù}{年|nián}。', exRo: 'Jīnnián shì èr líng èr liù nián.', exVi: 'Năm nay là năm 2026.', more: 'Hán Việt: **NIÊN** (thanh niên). Đọc năm: **từng chữ số** + 年 — 二〇二六年 èr líng èr liù nián. Bài 6 học ngày tháng năm.' },
      ],
    },

    { t: 'h', text: 'Nhóm 3 — Số lượng, điện thoại (7 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{多少|duōshao}', pos: 'đại từ nghi vấn', ipa: 'duōshao', vi: 'bao nhiêu (số bất kỳ, thường lớn)', ex: '{你|nǐ}{的|de}{电话|diànhuà}{是|shì}{多少|duōshao}？', exRo: 'Nǐ de diànhuà shì duōshao?', exVi: 'Số điện thoại của bạn là bao nhiêu?', more: 'Hán Việt: ĐA THIỂU (nhiều–ít). 少 đọc nhẹ. Khác 几: không giới hạn con số, lượng từ có thể bỏ. Bài 8: 多少钱 — bao nhiêu tiền.' },
        { w: '{电话|diànhuà}', pos: 'danh từ', ipa: 'diànhuà', vi: 'điện thoại; số điện thoại', ex: '{你|nǐ}{有|yǒu}{他|tā}{的|de}{电话|diànhuà}{吗|ma}？', exRo: 'Nǐ yǒu tā de diànhuà ma?', exVi: 'Bạn có số điện thoại của anh ấy không?', more: 'Hán Việt: **ĐIỆN THOẠI** — y hệt tiếng Việt! Hai thanh 4. Gọi điện: 打电话 dǎ diànhuà (Bài 17).' },
        { w: '{手机|shǒujī}', pos: 'danh từ', ipa: 'shǒujī', vi: 'điện thoại di động', ex: '{我|wǒ}{的|de}{手机号|shǒujīhào}{是|shì}{一五八|yāo wǔ bā}……', exRo: 'Wǒ de shǒujīhào shì yāo wǔ bā……', exVi: 'Số di động của tôi là 158…', more: 'Hán Việt: THỦ CƠ ("máy cầm tay"). 手机号 = số di động. Khác 电话 (điện thoại nói chung, máy bàn).' },
        { w: '{号|hào}', pos: 'danh từ', ipa: 'hào', vi: 'số (số hiệu); ngày (trong tháng)', ex: '{你|nǐ}{的|de}{手机号|shǒujīhào}{是|shì}{多少|duōshao}？', exRo: 'Nǐ de shǒujīhào shì duōshao?', exVi: 'Số di động của bạn là bao nhiêu?', more: 'Hán Việt: **HIỆU** (số hiệu, ký hiệu). Bài 6: 几号 = ngày mấy.' },
        { w: '{号码|hàomǎ}', pos: 'danh từ', ipa: 'hàomǎ', vi: 'số, dãy số (từ mở rộng)', ex: '{电话|diànhuà}{号码|hàomǎ}{是|shì}{多少|duōshao}？', exRo: 'Diànhuà hàomǎ shì duōshao?', exVi: 'Số điện thoại là bao nhiêu?', more: 'Hán Việt: HIỆU MÃ. Từ mở rộng — hay gặp trên giấy tờ, biểu mẫu: 电话号码, 手机号码.' },
        { w: '{百|bǎi}', pos: 'số từ', ipa: 'bǎi', vi: 'trăm (từ mở rộng)', ex: '{一百|yìbǎi}', exRo: 'yìbǎi', exVi: 'một trăm', more: 'Hán Việt: **BÁCH** (bách khoa). Từ mở rộng — Bài 8 (tiền) dùng nhiều. 一百 đọc **yì**bǎi (百 thanh 3). Khác tiếng Việt: phải nói **一**百, không nói trơn "百".' },
        { w: '{数字|shùzì}', pos: 'danh từ', ipa: 'shùzì', vi: 'con số, chữ số (từ mở rộng)', ex: '{数字|shùzì}{八|bā}{很|hěn}{好|hǎo}！', exRo: 'Shùzì bā hěn hǎo!', exVi: 'Số 8 rất đẹp (rất tốt)!', more: 'Hán Việt: SỐ TỰ. Từ mở rộng — tên của bài này. 数字 cũng là "kỹ thuật số": 数字化 (số hoá).' },
      ],
    },
    {
      t: 'table',
      caption: 'Tóm tắt: hỏi gì — đáp gì về con số',
      head: ['Hỏi', 'Đáp', 'Nghĩa'],
      rows: [
        ['你今年多大？', '我今年二十岁。', 'Năm nay bạn bao nhiêu tuổi? — Năm nay tôi 20 tuổi.'],
        ['你几岁？(hỏi trẻ nhỏ)', '我六岁。', 'Cháu mấy tuổi? — Cháu 6 tuổi.'],
        ['你哥哥多大？', '他二十五岁。', 'Anh bạn bao nhiêu tuổi? — 25 tuổi.'],
        ['你的手机号是多少？', '一五八，一零六六，二四七九。', 'Số di động của bạn? — 158 1066 2479.'],
        ['你有几个中国朋友？', '我有两个中国朋友。', 'Bạn có mấy bạn Trung Quốc? — Hai người.'],
        ['你们班有多少学生？', '我们班有二十个学生。', 'Lớp bạn có bao nhiêu học sinh? — 20 học sinh. (班 — từ mở rộng)'],
      ],
    },
    {
      t: 'mcq',
      id: 'b5-tv-nghia',
      title: 'Kiểm tra nghĩa từ',
      items: [
        m('{四|sì} là số mấy?', ['4', '10', '7', '6'], 0, '四 sì = 4. Đừng nhầm với 十 shí = 10.'),
        m('{七|qī} là số mấy?', ['1', '7', '9', '6'], 1, '七 qī = 7.'),
        m('{零|líng} là:', ['0', '10', '100', '1'], 0, '零 = 0 (LINH).'),
        m('{岁|suì} nghĩa là:', ['năm', 'tuổi', 'số', 'ngày'], 1, '岁 = tuổi (TUẾ).'),
        m('{今年|jīnnián} nghĩa là:', ['năm ngoái', 'năm nay', 'năm sau', 'hôm nay'], 1, '今年 = năm nay (KIM NIÊN).'),
        m('{多大|duō dà} dùng để hỏi:', ['tuổi của người trẻ/ngang hàng', 'tuổi của trẻ nhỏ', 'số điện thoại', 'có mấy người'], 0, '多大 hỏi tuổi bạn bè, người lớn; trẻ nhỏ dùng 几岁.'),
        m('{手机|shǒujī} là:', ['máy tính', 'điện thoại di động', 'đồng hồ', 'máy ảnh'], 1, '手机 = điện thoại di động.'),
        m('{多少|duōshao} nghĩa là:', ['mấy (số nhỏ)', 'bao nhiêu (số bất kỳ)', 'rất nhiều', 'ít'], 1, '多少 hỏi số bất kỳ; 几 dùng cho số nhỏ.'),
        m('{小|xiǎo} trái nghĩa với:', ['多', '大', '少', '好'], 1, '小 (nhỏ) ↔ 大 (lớn).'),
        m('{电话|diànhuà} có âm Hán Việt là:', ['ĐIỆN THOẠI', 'THỦ CƠ', 'HIỆU MÃ', 'SỐ TỰ'], 0, '电话 = ĐIỆN THOẠI — giống hệt tiếng Việt.'),
      ],
    },
  ],
};

/* ══════════════════════════ 3. NGỮ PHÁP ══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b5-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp Bài 5 — số 0–99, 二 và 两, 一 trong số, tuổi 多大/几岁, 几 và 多少, số điện thoại',
  goal: 'Đọc và viết mọi số từ 0 đến 99, chọn đúng 二/两, đọc đúng 一 trong mọi trường hợp, hỏi–đáp tuổi đúng đối tượng và hỏi–đọc số điện thoại.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Sáu điểm ngữ pháp',
      items: [
        '**① Số 11–99**: [chục] + 十 + [đơn vị] — 十五 (15), 五十 (50), 五十五 (55). Giống hệt tiếng Việt, chỉ thay chữ.',
        '**② 二 hay 两**: đếm / đọc số / trong số nhiều chữ → **二**; trước lượng từ (个, 口, 岁…) → **两**.',
        '**③ 一 có 4 cách đọc**: yī (đếm, cuối số) · yí (trước thanh 4) · yì (trước thanh 1-2-3) · yāo (số điện thoại, số phòng).',
        '**④ Tuổi**: S + (今年) + 多大？/ 几岁？ → S + (今年) + số + 岁。 Không cần 是; phủ định dùng 不是.',
        '**⑤ 几 hay 多少**: 几 — số nhỏ, bắt buộc lượng từ · 多少 — số bất kỳ, lượng từ có thể bỏ.',
        '**⑥ Số điện thoại**: …是多少？ → đọc **từng chữ số**, nhóm 3–4–4.',
      ],
    },

    /* ── ① ── */
    { t: 'h', text: '① Ghép số từ 11 đến 99' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '十 + đơn vị (11–19)',
          vi: 'Mười + số lẻ — KHÔNG nói 一十',
          examples: [
            { en: '{十一|shíyī}', ro: 'shíyī', vi: '11 — mười một (一 cuối số giữ yī)' },
            { en: '{十二|shí\'èr}', ro: "shí'èr", vi: '12 — mười hai' },
            { en: '{十五|shíwǔ}', ro: 'shíwǔ', vi: '15 — mười lăm' },
            { en: '{十九|shíjiǔ}', ro: 'shíjiǔ', vi: '19 — mười chín' },
          ],
        },
        {
          formula: 'chục + 十 (20, 30 … 90)',
          vi: 'Số chục: [2–9] + 十',
          examples: [
            { en: '{二十|èrshí}', ro: 'èrshí', vi: '20 — hai mươi' },
            { en: '{四十|sìshí}', ro: 'sìshí', vi: '40 — bốn mươi' },
            { en: '{七十|qīshí}', ro: 'qīshí', vi: '70 — bảy mươi' },
            { en: '{九十|jiǔshí}', ro: 'jiǔshí', vi: '90 — chín mươi' },
          ],
        },
        {
          formula: 'chục + 十 + đơn vị (21–99)',
          vi: 'Đọc y như tiếng Việt: hai mươi mốt, bốn mươi tám…',
          examples: [
            { en: '{二十一|èrshíyī}', ro: 'èrshíyī', vi: '21 — hai mươi mốt' },
            { en: '{三十五|sānshíwǔ}', ro: 'sānshíwǔ', vi: '35 — ba mươi lăm' },
            { en: '{四十八|sìshíbā}', ro: 'sìshíbā', vi: '48 — bốn mươi tám' },
            { en: '{六十四|liùshísì}', ro: 'liùshísì', vi: '64 — sáu mươi tư' },
            { en: '{九十九|jiǔshíjiǔ}', ro: 'jiǔshíjiǔ', vi: '99 — chín mươi chín' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: 'Tin vui: cách ghép số của tiếng Trung **giống hệt tiếng Việt** — "hai mươi mốt" = 二十一 (hai · mười · một). Thậm chí còn **đơn giản hơn**: tiếng Việt đổi "một → mốt", "năm → lăm", "mười → mươi", "bốn → tư"; tiếng Trung **không đổi chữ nào** — 二十一, 十五, 二十五, 六十四 vẫn là 一, 五, 十, 四 như cũ. Hai chỗ cần nhớ: (1) **11–19 bắt đầu bằng 十**, không nói ~~一十五~~ (giống ta không nói "một mười lăm"); (2) chữ **十 ở giữa** số (二十五) khi nói nhanh thường đọc nhẹ hơn, nhưng pinyin vẫn ghi shí.',
    },
    {
      t: 'table',
      caption: 'Bảng số 0–99 — đọc theo hàng, mỗi hàng một chục',
      head: ['Chục', '…0', '…1', '…2', '…5', '…8', '…9'],
      rows: [
        ['0', '零 líng', '一 yī', '二 èr', '五 wǔ', '八 bā', '九 jiǔ'],
        ['1', '十 shí', '十一 shíyī', "十二 shí'èr", '十五 shíwǔ', '十八 shíbā', '十九 shíjiǔ'],
        ['2', '二十 èrshí', '二十一 èrshíyī', "二十二 èrshí'èr", '二十五 èrshíwǔ', '二十八 èrshíbā', '二十九 èrshíjiǔ'],
        ['3', '三十 sānshí', '三十一 sānshíyī', "三十二 sānshí'èr", '三十五 sānshíwǔ', '三十八 sānshíbā', '三十九 sānshíjiǔ'],
        ['4', '四十 sìshí', '四十一 sìshíyī', "四十二 sìshí'èr", '四十五 sìshíwǔ', '四十八 sìshíbā', '四十九 sìshíjiǔ'],
        ['5', '五十 wǔshí', '五十一 wǔshíyī', "五十二 wǔshí'èr", '五十五 wǔshíwǔ', '五十八 wǔshíbā', '五十九 wǔshíjiǔ'],
        ['6', '六十 liùshí', '六十一 liùshíyī', "六十二 liùshí'èr", '六十五 liùshíwǔ', '六十八 liùshíbā', '六十九 liùshíjiǔ'],
        ['7', '七十 qīshí', '七十一 qīshíyī', "七十二 qīshí'èr", '七十五 qīshíwǔ', '七十八 qīshíbā', '七十九 qīshíjiǔ'],
        ['8', '八十 bāshí', '八十一 bāshíyī', "八十二 bāshí'èr", '八十五 bāshíwǔ', '八十八 bāshíbā', '八十九 bāshíjiǔ'],
        ['9', '九十 jiǔshí', '九十一 jiǔshíyī', "九十二 jiǔshí'èr", '九十五 jiǔshíwǔ', '九十八 jiǔshíbā', '九十九 jiǔshíjiǔ'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay nhầm',
      items: [
        '**十四 shísì (14) ↔ 四十 sìshí (40)**: hai chữ đổi chỗ, nghĩa khác hẳn. Nghe kỹ thanh: shí (lên) **trước** = 14; sì (xuống) **trước** = 40.',
        '**四 sì ↔ 十 shí**: s thẳng + thanh 4 (xuống) / sh uốn lưỡi + thanh 2 (lên). Người miền Nam Trung Quốc cũng hay lẫn — câu nói vui "四是四，十是十" luyện chính cặp này (phần Nói).',
        'Thêm 一 trước 十: ~~一十五~~ → **十五**. (Chỉ dùng 一十 bên trong số lớn hơn 100 — chưa học.)',
        'Dịch "mốt/lăm/tư/mươi" thành chữ khác: tiếng Trung không có biến thể — **二十一, 二十五, 二十四, 二十**.',
        '**100 là 一百 yìbǎi** (từ mở rộng) — luôn có 一 phía trước, không nói trơn ~~百~~.',
      ],
    },
    { t: 'rule', formula: '[chục] + 十 + [đơn vị] · 11–19 = 十 + đơn vị', vi: 'Ghép số y như tiếng Việt, không đổi chữ (không có "mốt, lăm, tư"); 11–19 không có 一 phía trước.' },

    /* ── ② ── */
    { t: 'h', text: '② 二 hay 两?' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '二 èr: đếm · đọc số · trong số nhiều chữ · thứ tự',
          vi: '"Hai" như một CON SỐ',
          examples: [
            { en: '{一|yī}、{二|èr}、{三|sān}', ro: 'yī, èr, sān', vi: 'một, hai, ba (đếm)' },
            { en: '{十二|shí\'èr}、{二十|èrshí}、{二十二|èrshí\'èr}', ro: "shí'èr, èrshí, èrshí'èr", vi: '12, 20, 22 (trong số nhiều chữ)' },
            { en: '{二|èr}{四|sì}{七|qī}{九|jiǔ}', ro: 'èr sì qī jiǔ', vi: '2479 (đọc từng chữ số)' },
            { en: '{我|wǒ}{今年|jīnnián}{二十二|èrshí\'èr}{岁|suì}。', ro: "Wǒ jīnnián èrshí'èr suì.", vi: 'Năm nay tôi hai mươi hai tuổi.' },
          ],
        },
        {
          formula: '两 liǎng + lượng từ',
          vi: '"Hai" như một SỐ LƯỢNG (hai cái, hai người, hai tuổi)',
          examples: [
            { en: '{两|liǎng}{个|ge}{哥哥|gēge}', ro: 'liǎng ge gēge', vi: 'hai anh trai' },
            { en: '{两|liǎng}{口|kǒu}{人|rén}', ro: 'liǎng kǒu rén', vi: 'hai người (nhà hai người)' },
            { en: '{他|tā}{儿子|érzi}{两|liǎng}{岁|suì}。', ro: 'Tā érzi liǎng suì.', vi: 'Con trai anh ấy hai tuổi.' },
            { en: '{我|wǒ}{有|yǒu}{两|liǎng}{个|ge}{中国|Zhōngguó}{朋友|péngyou}。', ro: 'Wǒ yǒu liǎng ge Zhōngguó péngyou.', vi: 'Tôi có hai người bạn Trung Quốc.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: 'Tiếng Trung có **hai chữ "hai"**. Cách chọn đơn giản: hỏi xem "hai" đang là **con số** hay là **số lượng của thứ gì đó**. Nếu chỉ là con số (đếm 1-2-3, số điện thoại, số tuổi 22, số 12) → **二**. Nếu có **lượng từ đứng ngay sau** (hai **cái**, hai **người**, hai **tuổi**) → **两**. Lưu ý: chỉ con số **2 đứng một mình trước lượng từ** mới đổi thành 两; trong 十二个, 二十二个 vẫn là **二** (số nhiều chữ không đổi).',
    },
    {
      t: 'table',
      caption: 'Bảng chọn 二 / 两',
      head: ['Bạn muốn nói', 'Đúng', 'Sai', 'Vì sao'],
      rows: [
        ['hai người con', '两个孩子', '二个孩子', '2 đứng trước lượng từ 个'],
        ['hai tuổi', '两岁', '二岁', '岁 là lượng từ chỉ tuổi'],
        ['nhà hai người', '两口人', '二口人', 'trước lượng từ 口'],
        ['mười hai tuổi', '十二岁', '十两岁', 'trong số nhiều chữ → 二'],
        ['hai mươi hai người', '二十二个人', '两十两个人', 'trong số nhiều chữ → 二'],
        ['một, hai, ba', '一、二、三', '一、两、三', 'đếm → 二'],
        ['số điện thoại …2479', '二四七九', '两四七九', 'đọc từng chữ số → 二'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        '~~二个哥哥~~ → **两个哥哥**. Lỗi phổ biến nhất của bài.',
        '~~我两十岁~~ → **我二十岁**. 两 chỉ thay cho "2" đứng một mình trước lượng từ.',
        'Đọc 两 thành "liáng" hoặc "lǎng": **liǎng** — có âm đệm i, thanh 3.',
      ],
    },
    { t: 'rule', formula: '二: đếm, đọc số, số nhiều chữ · 两 + lượng từ', vi: '"Hai" làm con số → 二; "hai cái/người/tuổi" (có lượng từ ngay sau) → 两.' },

    /* ── ③ ── */
    { t: 'h', text: '③ Bốn cách đọc của 一 khi nói về số' },
    {
      t: 'table',
      caption: '一 — viết một chữ, đọc bốn kiểu (ghi pinyin theo cách đọc thực tế)',
      head: ['Khi nào', 'Đọc', 'Ví dụ', 'Nghĩa'],
      rows: [
        ['Đếm, đứng một mình, ở cuối số', '**yī**', '一、二、三 · 十一 shíyī · 二十一 èrshíyī', 'một · 11 · 21'],
        ['Trước chữ thanh 4 (và trước 个)', '**yí**', '一个 yí ge · 一岁 yí suì', 'một cái · một tuổi'],
        ['Trước chữ thanh 1, 2, 3', '**yì**', '一口人 yì kǒu rén · 一年 yì nián · 一百 yìbǎi', 'một người (nhà) · một năm · một trăm'],
        ['Số điện thoại, số phòng, số xe', '**yāo**', '一五八 yāo wǔ bā · 一一〇 yāo yāo líng', '158 · 110 (số gọi cảnh sát)'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: '一 + lượng từ / danh từ → yí / yì',
          vi: '"Một + cái gì đó": đổi theo thanh của chữ đứng sau (đã học ở Bài 0)',
          examples: [
            { en: '{我|wǒ}{有|yǒu}{一|yí}{个|ge}{妹妹|mèimei}。', ro: 'Wǒ yǒu yí ge mèimei.', vi: 'Tôi có một em gái. (个 gốc thanh 4 → yí)' },
            { en: '{她|tā}{女儿|nǚ\'ér}{一|yí}{岁|suì}。', ro: "Tā nǚ'ér yí suì.", vi: 'Con gái cô ấy một tuổi. (岁 thanh 4 → yí)' },
            { en: '{他|tā}{家|jiā}{只|zhǐ}{有|yǒu}{一|yì}{口|kǒu}{人|rén}。', ro: 'Tā jiā zhǐ yǒu yì kǒu rén.', vi: 'Nhà anh ấy chỉ có một người. (口 thanh 3 → yì; 只 zhǐ — chỉ, từ mở rộng)' },
          ],
        },
        {
          formula: '一 trong con số → yī',
          vi: 'Đếm, số có 一 ở cuối, số thứ tự: giữ nguyên thanh 1',
          examples: [
            { en: '{十一|shíyī}', ro: 'shíyī', vi: 'mười một' },
            { en: '{三十一|sānshíyī}', ro: 'sānshíyī', vi: 'ba mươi mốt' },
            { en: '{我|wǒ}{二十一|èrshíyī}{岁|suì}。', ro: 'Wǒ èrshíyī suì.', vi: 'Tôi hai mươi mốt tuổi. (一 cuối số → yī, dù 岁 thanh 4)' },
          ],
        },
        {
          formula: '一 trong dãy số → yāo',
          vi: 'Đọc từng chữ số (điện thoại, phòng, xe buýt): 1 đọc yāo cho khỏi nhầm với 七 qī',
          examples: [
            { en: '{一|yāo}{三|sān}{九|jiǔ}', ro: 'yāo sān jiǔ', vi: '139' },
            { en: '{一|yāo}{零|líng}{一|yāo}', ro: 'yāo líng yāo', vi: '101 (số phòng)' },
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận: 二十一岁 đọc yī, không phải yí',
      items: [
        'Quy tắc yí/yì chỉ áp dụng khi **一 đứng một mình** làm số lượng ("một" cái/tuổi). Khi 一 là **chữ số cuối** của một số lớn hơn (十一, 二十一, 三十一) thì luôn đọc **yī** — kể cả khi chữ sau là thanh 4: 二十一岁 **èrshíyī suì**, 十一个 **shíyī ge**.',
        '**yāo** không phải chữ khác — vẫn viết 一. Chỉ đọc yāo khi đọc **dãy chữ số** (điện thoại, số phòng 101, số xe buýt). Số tuổi, số lượng không bao giờ đọc yāo.',
        'Trong năm (二〇二一年) đọc từng chữ số nhưng 一 vẫn là **yī**: èr líng èr yī nián. yāo dùng nhiều nhất cho số điện thoại và số phòng.',
      ],
    },
    { t: 'rule', formula: '一: yī (đếm, cuối số) · yí (+ thanh 4) · yì (+ thanh 1/2/3) · yāo (dãy số điện thoại)', vi: 'Một chữ 一 — chọn cách đọc theo vai trò: con số, số lượng, hay chữ số trong dãy.' },

    /* ── ④ ── */
    { t: 'h', text: '④ Hỏi và nói tuổi: 多大 / 几岁 / 岁' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'S + (今年) + 多大？',
          vi: 'Hỏi tuổi bạn bè, người trẻ, người ngang hàng, người lớn (không quá lớn tuổi)',
          examples: [
            { en: '{你|nǐ}{今年|jīnnián}{多大|duō dà}？', ro: 'Nǐ jīnnián duō dà?', vi: 'Năm nay bạn bao nhiêu tuổi?' },
            { en: '{你|nǐ}{哥哥|gēge}{多大|duō dà}？', ro: 'Nǐ gēge duō dà?', vi: 'Anh trai bạn bao nhiêu tuổi?' },
            { en: '{王明|Wáng Míng}{多大|duō dà}？', ro: 'Wáng Míng duō dà?', vi: 'Vương Minh bao nhiêu tuổi?' },
          ],
        },
        {
          formula: 'S + (今年) + 几岁？',
          vi: 'Hỏi tuổi trẻ nhỏ (khoảng dưới 10 tuổi)',
          examples: [
            { en: '{你|nǐ}{几|jǐ}{岁|suì}？', ro: 'Nǐ jǐ suì?', vi: 'Cháu mấy tuổi?' },
            { en: '{你|nǐ}{女儿|nǚ\'ér}{今年|jīnnián}{几|jǐ}{岁|suì}？', ro: "Nǐ nǚ'ér jīnnián jǐ suì?", vi: 'Năm nay con gái anh/chị mấy tuổi?' },
            { en: '{她|tā}{儿子|érzi}{几|jǐ}{岁|suì}？', ro: 'Tā érzi jǐ suì?', vi: 'Con trai cô ấy mấy tuổi?' },
          ],
        },
        {
          formula: 'S + (今年) + số + 岁。 · S + 不是 + số + 岁。',
          vi: 'Trả lời: KHÔNG cần 是 — nhưng câu phủ định dùng 不是',
          examples: [
            { en: '{我|wǒ}{今年|jīnnián}{二十|èrshí}{岁|suì}。', ro: 'Wǒ jīnnián èrshí suì.', vi: 'Năm nay tôi 20 tuổi.' },
            { en: '{小美|Xiǎoměi}{六|liù}{岁|suì}。', ro: 'Xiǎoměi liù suì.', vi: 'Tiểu Mỹ 6 tuổi.' },
            { en: '{安娜|Ānnà}{十九|shíjiǔ}{岁|suì}。', ro: 'Ānnà shíjiǔ suì.', vi: 'Anna 19 tuổi.' },
            { en: '{我|wǒ}{不|bú}{是|shì}{十九|shíjiǔ}{岁|suì}，{我|wǒ}{二十|èrshí}{岁|suì}。', ro: 'Wǒ bú shì shíjiǔ suì, wǒ èrshí suì.', vi: 'Tôi không phải 19 tuổi, tôi 20 tuổi.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: 'Câu nói tuổi giống tiếng Việt: **chủ ngữ + số + 岁** — "tôi hai mươi tuổi" = 我二十岁. Danh từ chỉ **số tuổi, ngày tháng, giá tiền** có thể **tự làm vị ngữ**, nên **không cần 是**. Nhưng muốn phủ định thì phải mượn **不是**: 我**不是**二十岁. Từ thời gian **今年** đứng **sau chủ ngữ, trước số tuổi** (hoặc đầu câu: 今年我二十岁) — không đặt cuối câu như tiếng Việt "tôi 20 tuổi **năm nay**". Chọn câu hỏi theo **người được hỏi**: trẻ nhỏ → 几岁; bạn bè, người trẻ → 多大; người già → 您多大年纪了？ (từ mở rộng, rất lịch sự).',
    },
    {
      t: 'table',
      caption: 'Hỏi tuổi ai — dùng câu nào',
      head: ['Người được hỏi', 'Câu hỏi', 'Pinyin', 'Ghi chú'],
      rows: [
        ['Bé 5 tuổi', '你几岁？', 'Nǐ jǐ suì?', 'đoán số nhỏ → 几'],
        ['Bạn cùng lớp', '你今年多大？', 'Nǐ jīnnián duō dà?', 'thân mật, phổ biến nhất'],
        ['Anh/chị của bạn', '你哥哥多大？', 'Nǐ gēge duō dà?', 'hỏi về người thứ ba'],
        ['Thầy cô, người trung niên', '(nên tránh hỏi trực tiếp)', '—', 'hỏi tuổi người lớn hơn có thể bất lịch sự'],
        ['Cụ ông, cụ bà', '您多大年纪了？', 'Nín duō dà niánjì le?', 'từ mở rộng — kính trọng'],
      ],
    },
    {
      t: 'table',
      caption: 'Cặp hỏi ↔ đáp: khẳng định và phủ định',
      head: ['Hỏi', 'Đáp khẳng định', 'Đáp phủ định'],
      rows: [
        ['你二十岁吗？Nǐ èrshí suì ma?', '是，我二十岁。Shì, wǒ èrshí suì.', '不是，我十九岁。Bú shì, wǒ shíjiǔ suì.'],
        ['她十五岁吗？Tā shíwǔ suì ma?', '对，她十五岁。Duì, tā shíwǔ suì.', '不是，她十六岁。Bú shì, tā shíliù suì.'],
        ['你今年多大？Nǐ jīnnián duō dà?', '我今年二十一岁。Wǒ jīnnián èrshíyī suì.', '—'],
        ['你几岁？Nǐ jǐ suì?', '我六岁。Wǒ liù suì.', '—'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Thêm 是 vào câu khẳng định: ~~我是二十岁。~~ → **我二十岁。** (Có 是 không hẳn sai, nhưng nghe như đang cãi lại; câu thường thì bỏ.)',
        'Phủ định không có 是: ~~我不二十岁。~~ → **我不是二十岁。**',
        'Đặt 今年 cuối câu: ~~我二十岁今年。~~ → **我今年二十岁。**',
        'Hỏi người lớn bằng 几岁: ~~老师，您几岁？~~ — nghe như hỏi trẻ con. Tốt nhất không hỏi tuổi thầy cô; với bạn bè dùng **多大**.',
        '~~我二岁~~ (2 tuổi) → **我两岁**. Một tuổi: **一岁 yí suì**.',
      ],
    },
    { t: 'rule', formula: 'S + (今年) + 多大 / 几岁？ → S + (今年) + số + 岁 · 不是 + số + 岁', vi: 'Hỏi tuổi: 多大 cho bạn bè/người lớn, 几岁 cho trẻ nhỏ; trả lời không cần 是, phủ định dùng 不是.' },

    /* ── ⑤ ── */
    { t: 'h', text: '⑤ 几 hay 多少?' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '几 + lượng từ + N？',
          vi: 'Đoán con số NHỎ (thường dưới 10) — BẮT BUỘC có lượng từ',
          examples: [
            { en: '{你|nǐ}{有|yǒu}{几|jǐ}{个|ge}{妹妹|mèimei}？', ro: 'Nǐ yǒu jǐ ge mèimei?', vi: 'Bạn có mấy em gái?' },
            { en: '{你|nǐ}{家|jiā}{有|yǒu}{几|jǐ}{口|kǒu}{人|rén}？', ro: 'Nǐ jiā yǒu jǐ kǒu rén?', vi: 'Nhà bạn có mấy người?' },
            { en: '{你|nǐ}{女儿|nǚ\'ér}{几|jǐ}{岁|suì}？', ro: "Nǐ nǚ'ér jǐ suì?", vi: 'Con gái anh/chị mấy tuổi?' },
          ],
        },
        {
          formula: '多少 + (lượng từ) + N？ · … 是多少？',
          vi: 'Con số BẤT KỲ (thường lớn hoặc không đoán được) — lượng từ có thể bỏ',
          examples: [
            { en: '{你们|nǐmen}{学校|xuéxiào}{有|yǒu}{多少|duōshao}{学生|xuésheng}？', ro: 'Nǐmen xuéxiào yǒu duōshao xuésheng?', vi: 'Trường các bạn có bao nhiêu sinh viên? (学校 xuéxiào — trường học, HSK 1, gặp lại ở Bài 12)' },
            { en: '{你|nǐ}{有|yǒu}{多少|duōshao}{个|ge}{中国|Zhōngguó}{朋友|péngyou}？', ro: 'Nǐ yǒu duōshao ge Zhōngguó péngyou?', vi: 'Bạn có bao nhiêu người bạn Trung Quốc?' },
            { en: '{你|nǐ}{的|de}{手机号|shǒujīhào}{是|shì}{多少|duōshao}？', ro: 'Nǐ de shǒujīhào shì duōshao?', vi: 'Số di động của bạn là bao nhiêu?' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'So sánh 几 và 多少',
      head: ['', '几 jǐ', '多少 duōshao'],
      rows: [
        ['Con số dự đoán', 'nhỏ (thường < 10)', 'bất kỳ, thường lớn'],
        ['Lượng từ', 'BẮT BUỘC: 几个, 几口, 几岁', 'có thể bỏ: 多少学生 / 多少个学生'],
        ['Hỏi số điện thoại, số phòng', '✗', '✓ 是多少？'],
        ['Hỏi tuổi', '✓ trẻ nhỏ: 几岁', '✗ (không nói 多少岁 với bạn bè — dùng 多大)'],
        ['Ví dụ', '你有几个哥哥？', '你们学校有多少学生？'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Hỏi số điện thoại bằng 几: ~~你的手机号是几？~~ → **你的手机号是多少？**',
        '几 thiếu lượng từ: ~~你有几哥哥？~~ → **你有几个哥哥？** (多少 thì được bỏ: 多少学生.)',
        'Hỏi số người của cả trường bằng 几: ~~学校有几个学生？~~ — nghe như bạn nghĩ trường chỉ có vài người. Dùng **多少**.',
      ],
    },
    { t: 'rule', formula: '几 + lượng từ (số nhỏ) · 多少 (+ lượng từ) (số bất kỳ) · …是多少？', vi: 'Đoán số nhỏ → 几 + lượng từ; số lớn/không đoán được, số điện thoại → 多少.' },

    /* ── ⑥ ── */
    { t: 'h', text: '⑥ Hỏi và đọc số điện thoại' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '(Ai) 的 + 手机号 / 电话 + 是 + 多少？ → (Ai) 的 + … + 是 + dãy số。',
          vi: 'Hỏi – đáp số điện thoại; đọc từng chữ số, nhóm 3–4–4',
          examples: [
            { en: '{你|nǐ}{的|de}{电话|diànhuà}{是|shì}{多少|duōshao}？', ro: 'Nǐ de diànhuà shì duōshao?', vi: 'Số điện thoại của bạn là bao nhiêu?' },
            { en: '{我|wǒ}{的|de}{手机号|shǒujīhào}{是|shì}{一|yāo}{三|sān}{九|jiǔ}，{零|líng}{一|yāo}{二|èr}{七|qī}，{三|sān}{五|wǔ}{八|bā}{零|líng}。', ro: 'Wǒ de shǒujīhào shì yāo sān jiǔ, líng yāo èr qī, sān wǔ bā líng.', vi: 'Số di động của tôi là 139 0127 3580.' },
            { en: '{老师|lǎoshī}{的|de}{电话|diànhuà}{是|shì}{多少|duōshao}？', ro: 'Lǎoshī de diànhuà shì duōshao?', vi: 'Số điện thoại của cô giáo là bao nhiêu?' },
            { en: '{王明|Wáng Míng}{的|de}{手机号|shǒujīhào}{你|nǐ}{有|yǒu}{吗|ma}？', ro: 'Wáng Míng de shǒujīhào nǐ yǒu ma?', vi: 'Số di động của Vương Minh bạn có không?' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Số khẩn cấp ở Trung Quốc — cũng là bài luyện đọc yāo',
      head: ['Số', 'Đọc', 'Gọi ai'],
      rows: [
        ['110', 'yāo yāo líng', 'Cảnh sát'],
        ['119', 'yāo yāo jiǔ', 'Cứu hoả'],
        ['120', 'yāo èr líng', 'Cấp cứu'],
        ['114', 'yāo yāo sì', 'Tra cứu số điện thoại'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Đọc số điện thoại như số đếm: 158 ~~一百五十八~~ → **一五八 yāo wǔ bā**.',
        'Đọc 1 là yī trong số điện thoại: không sai hẳn, nhưng người nghe dễ nhầm với 七 qī. Thói quen chuẩn: **yāo**.',
        'Đọc 0 là "không" kiểu tiếng Việt quen miệng — nhớ nói **líng**.',
      ],
    },
    { t: 'rule', formula: '…的手机号是多少？ → 一五八 (yāo wǔ bā)…', vi: 'Số điện thoại hỏi bằng 是多少, đọc từng chữ số theo nhóm, 1 đọc yāo, 0 đọc líng.' },

    /* ── So sánh ── */
    { t: 'h', text: 'Đặt cạnh tiếng Việt — giống và khác' },
    {
      t: 'table',
      caption: 'Câu Bài 5 so với tiếng Việt',
      head: ['Tiếng Việt', 'Tiếng Trung', 'Giống / khác'],
      rows: [
        ['hai mươi **mốt**, mười **lăm**', '二十**一**, 十**五**', 'Giống cách ghép; khác: tiếng Trung không đổi chữ.'],
        ['Tôi hai mươi tuổi.', '我二十岁。', 'Giống hệt: không cần "là".'],
        ['Tôi hai mươi tuổi **năm nay**.', '我**今年**二十岁。', 'Khác: 今年 đứng trước số tuổi.'],
        ['**hai** anh trai', '**两个**哥哥', 'Khác: "hai" trước lượng từ là 两, và phải có 个.'],
        ['Số điện thoại **là bao nhiêu**?', '电话**是多少**？', 'Giống hệt trật tự.'],
        ['một năm tám (158)', '一五八 **yāo** wǔ bā', 'Giống: đọc từng số; khác: 1 đọc yāo.'],
      ],
    },

    /* ── Tổng kết ── */
    { t: 'h', text: 'Tổng kết ngữ pháp Bài 5' },
    {
      t: 'table',
      head: ['Điểm', 'Công thức', 'Ví dụ', 'Dùng khi'],
      rows: [
        ['①', '[chục] 十 [đơn vị]', '十五 · 四十八 · 九十九', 'Đọc số 11–99'],
        ['②', '二 (con số) · 两 + lượng từ', '二十二 · 两个', 'Chọn chữ "hai"'],
        ['③', '一: yī / yí / yì / yāo', '十一 · 一个 · 一口 · 一五八', 'Đọc đúng 一'],
        ['④', 'S + 今年 + 多大/几岁？→ số + 岁', '你今年多大？我二十岁。', 'Hỏi – nói tuổi'],
        ['⑤', '几 + lượng từ · 多少', '几个哥哥 · 多少学生', 'Hỏi số lượng'],
        ['⑥', '…是多少？', '你的手机号是多少？', 'Hỏi số điện thoại'],
      ],
    },
    {
      t: 'build',
      id: 'b5-np-ghep',
      title: 'Ghép câu — Bài 5',
      items: [
        { vi: 'Năm nay bạn bao nhiêu tuổi?', chips: ['{你|nǐ}', '{今年|jīnnián}', '{多大|duō dà}', '{几|jǐ}', '{吗|ma}'], answer: ['{你|nǐ}', '{今年|jīnnián}', '{多大|duō dà}'], ro: 'Nǐ jīnnián duō dà?' },
        { vi: 'Năm nay tôi hai mươi tuổi.', chips: ['{我|wǒ}', '{今年|jīnnián}', '{二十|èrshí}', '{岁|suì}', '{是|shì}'], answer: ['{我|wǒ}', '{今年|jīnnián}', '{二十|èrshí}', '{岁|suì}'], alt: [['{今年|jīnnián}', '{我|wǒ}', '{二十|èrshí}', '{岁|suì}']], ro: 'Wǒ jīnnián èrshí suì.' },
        { vi: 'Cháu mấy tuổi?', chips: ['{你|nǐ}', '{几|jǐ}', '{岁|suì}', '{多少|duōshao}'], answer: ['{你|nǐ}', '{几|jǐ}', '{岁|suì}'], ro: 'Nǐ jǐ suì?' },
        { vi: 'Tôi không phải mười chín tuổi.', chips: ['{我|wǒ}', '{不|bú}', '{是|shì}', '{十九|shíjiǔ}', '{岁|suì}', '{没|méi}'], answer: ['{我|wǒ}', '{不|bú}', '{是|shì}', '{十九|shíjiǔ}', '{岁|suì}'], ro: 'Wǒ bú shì shíjiǔ suì.' },
        { vi: 'Con trai cô ấy hai tuổi.', chips: ['{她|tā}', '{儿子|érzi}', '{两|liǎng}', '{岁|suì}', '{二|èr}'], answer: ['{她|tā}', '{儿子|érzi}', '{两|liǎng}', '{岁|suì}'], ro: 'Tā érzi liǎng suì.' },
        { vi: 'Số di động của bạn là bao nhiêu?', chips: ['{你|nǐ}', '{的|de}', '{手机号|shǒujīhào}', '{是|shì}', '{多少|duōshao}', '{几|jǐ}'], answer: ['{你|nǐ}', '{的|de}', '{手机号|shǒujīhào}', '{是|shì}', '{多少|duōshao}'], ro: 'Nǐ de shǒujīhào shì duōshao?' },
        { vi: 'Anh trai tôi hai mươi lăm tuổi.', chips: ['{我|wǒ}', '{哥哥|gēge}', '{二十五|èrshíwǔ}', '{岁|suì}', '{的|de}'], answer: ['{我|wǒ}', '{哥哥|gēge}', '{二十五|èrshíwǔ}', '{岁|suì}'], ro: 'Wǒ gēge èrshíwǔ suì.' },
        { vi: 'Trường các bạn có bao nhiêu sinh viên?', chips: ['{你们|nǐmen}', '{学校|xuéxiào}', '{有|yǒu}', '{多少|duōshao}', '{学生|xuésheng}'], answer: ['{你们|nǐmen}', '{学校|xuéxiào}', '{有|yǒu}', '{多少|duōshao}', '{学生|xuésheng}'], ro: 'Nǐmen xuéxiào yǒu duōshao xuésheng?' },
      ],
    },
    {
      t: 'quiz',
      id: 'b5-np-viet-so',
      title: 'Viết số bằng chữ Hán',
      kind: 'fill',
      grammar: '[chục] + 十 + [đơn vị] · 11–19 = 十 + đơn vị · 0 = 零',
      items: [
        { q: '15', answers: ['十五'], hint: '十 + 五' },
        { q: '20', answers: ['二十'], hint: '二 + 十' },
        { q: '48', answers: ['四十八'], hint: '四 + 十 + 八' },
        { q: '11', answers: ['十一'], hint: 'Không có 一 phía trước' },
        { q: '99', answers: ['九十九'], hint: '九 + 十 + 九' },
        { q: '62', answers: ['六十二'], hint: 'Trong số nhiều chữ dùng 二' },
        { q: '37', answers: ['三十七'], hint: '三 + 十 + 七' },
        { q: '0', answers: ['零', '〇'], hint: 'LINH' },
      ],
    },
    {
      t: 'quiz',
      id: 'b5-np-dien',
      title: 'Điền một chữ vào （　）: 二 · 两 · 岁 · 多 · 几 · 少',
      kind: 'fill',
      grammar: '二/两 · S + số + 岁 · 多大 · 几岁 · 多少',
      items: [
        { q: '{我|wǒ}{有|yǒu}（　）{个|ge}{姐姐|jiějie}。', answers: ['两'], hint: 'HAI chị gái — trước lượng từ' },
        { q: '{他|tā}{今年|jīnnián}（　）{十|shí}{岁|suì}。', answers: ['二'], hint: 'HAI mươi tuổi — trong số nhiều chữ' },
        { q: '{你|nǐ}{今年|jīnnián}（　）{大|dà}？', answers: ['多'], hint: 'Bao nhiêu tuổi?' },
        { q: '{小美|Xiǎoměi}，{你|nǐ}（　）{岁|suì}？', answers: ['几'], hint: 'Hỏi tuổi bé gái' },
        { q: '{我|wǒ}{十九|shíjiǔ}（　）。', answers: ['岁'], hint: 'Tôi 19 TUỔI' },
        { q: '{你|nǐ}{的|de}{手机号|shǒujīhào}{是|shì}{多|duō}（　）？', answers: ['少'], hint: 'Bao nhiêu?' },
        { q: '{一|yī}、（　）、{三|sān}', answers: ['二'], hint: 'Đếm' },
        { q: '{她|tā}{女儿|nǚ\'ér}（　）{岁|suì}。', answers: ['两'], hint: 'Con gái cô ấy HAI tuổi' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-np-trac-nghiem',
      title: 'Trắc nghiệm ngữ pháp Bài 5',
      items: [
        m('"Năm nay tôi 20 tuổi." — câu nào đúng?', ['我是二十岁今年。', '我今年二十岁。', '我今年两十岁。', '今年二十岁是我。'], 1, 'S + 今年 + số + 岁, không cần 是, "20" là 二十.'),
        m('"Hai đứa con" là:', ['二个孩子', '两个孩子', '两孩子', '二孩子个'], 1, '两 + lượng từ 个.'),
        m('Hỏi tuổi bé 5 tuổi, câu nào **tự nhiên nhất**?', ['你多大？', '你几岁？', '您多大年纪了？', '你多少岁？'], 1, 'Trẻ nhỏ → 几岁.'),
        m('Hỏi tuổi bạn cùng lớp:', ['你几岁？', '你今年多大？', '你是多少？', '你几个岁？'], 1, 'Bạn bè → 多大.'),
        m('"Tôi không phải 21 tuổi" là:', ['我不二十一岁。', '我没二十一岁。', '我不是二十一岁。', '我二十一不岁。'], 2, 'Phủ định câu tuổi dùng 不是.'),
        m('14 viết là:', ['四十', '十四', '一十四', '四一十'], 1, '十四 = 14; 四十 = 40.'),
        m('二十一岁 đọc là:', ['èrshíyí suì', 'èrshíyī suì', 'liǎngshíyī suì', 'èrshíyāo suì'], 1, '一 là chữ số cuối của số → giữ yī.'),
        m('一岁 (một tuổi) đọc là:', ['yī suì', 'yí suì', 'yì suì', 'yāo suì'], 1, '一 đứng một mình trước 岁 (thanh 4) → yí.'),
        m('Số điện thoại 110 đọc là:', ['yìbǎi yīshí', 'yāo yāo líng', 'yī yī shí', 'shíyī líng'], 1, 'Đọc từng chữ số, 1 = yāo, 0 = líng.'),
        m('Câu nào **sai**?', ['你有几个哥哥？', '你们学校有多少学生？', '你的手机号是几？', '她几岁？'], 2, 'Số điện thoại hỏi bằng 多少.'),
      ],
    },
  ],
};

/* ══════════════════════════ 4. CHỮ HÁN ══════════════════════════ */

const HAN_TU: Lesson = {
  id: 'b5-han-tu',
  kind: 'kanji',
  title: 'Chữ Hán Bài 5 — 12 chữ: 四 五 六 七 八 九 两 岁 多 少 号 年',
  goal: 'Viết được toàn bộ chữ số còn lại (一 二 三 十 đã học ở Bài 0) cùng 6 chữ về tuổi và con số; đọc chữ trần các câu có số.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Cách học chữ Hán bài này',
      items: [
        'Bài 0 đã viết **一 二 三 十**. Bài này viết nốt **四 五 六 七 八 九** — xong là viết được mọi số 0–99 (trừ 零 — 13 nét, chỉ cần nhận mặt).',
        'Chữ số **ít nét** (七 八 九 chỉ 2 nét) nhưng **thứ tự nét** dễ sai — xem kỹ hoạt hình trước khi viết.',
        '**多** = hai chữ 夕 chồng lên nhau; **少** = 小 thêm một nét phẩy — một cặp trái nghĩa, nhớ cùng nhau.',
        'Trên hoá đơn, séc ngân hàng, người Trung Quốc viết số bằng **chữ đại tự** (壹 贰 叁…) để chống sửa — chỉ cần biết là có, không cần học.',
      ],
    },
    {
      t: 'table',
      caption: '12 chữ Hán của Bài 5',
      head: ['Chữ', 'Pinyin', 'Hán Việt', 'Bộ thủ', 'Số nét', 'Nghĩa', 'Từ ví dụ'],
      rows: [
        ['四', 'sì', 'TỨ', '囗 (vây quanh)', '5', 'bốn', '四口人 · 四十'],
        ['五', 'wǔ', 'NGŨ', '二 (hai)', '4', 'năm', '五口人 · 十五'],
        ['六', 'liù', 'LỤC', '八 (tám)', '4', 'sáu', '六岁 · 六十'],
        ['七', 'qī', 'THẤT', '一 (một)', '2', 'bảy', '七个 · 十七'],
        ['八', 'bā', 'BÁT', '八 (tự là bộ)', '2', 'tám', '十八 · 四十八'],
        ['九', 'jiǔ', 'CỬU', '乙 (ất)', '2', 'chín', '十九 · 九十九'],
        ['两', 'liǎng', 'LƯỠNG', '一 (một)', '7', 'hai (+ lượng từ)', '两个 · 两岁'],
        ['岁', 'suì', 'TUẾ', '山 (núi)', '6', 'tuổi', '几岁 · 二十岁'],
        ['多', 'duō', 'ĐA', '夕 (buổi tối)', '6', 'nhiều; bao nhiêu', '多大 · 多少'],
        ['少', 'shǎo', 'THIỂU', '小 (nhỏ)', '4', 'ít', '多少 · 很少'],
        ['号', 'hào', 'HIỆU', '口 (miệng)', '5', 'số; ngày', '手机号 · 几号'],
        ['年', 'nián', 'NIÊN', '丿 (phẩy) — Khang Hy xếp bộ 干', '6', 'năm', '今年 · 一年'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ bằng hình và bộ thủ',
      items: [
        '**四** = khung **囗** với hai "chân" 儿 bên trong: một căn phòng **bốn** bức tường. Viết khung trái → trên-phải → hai nét trong → **đóng đáy** sau cùng.',
        '**五** — 4 nét: ngang trên → sổ → ngang gập → ngang dưới. Đừng viết thành 5 nét vì nó là số 5!',
        '**六** — một **mái nhà** (chấm + ngang) với hai chân bên dưới (phẩy + chấm).',
        '**七** — hình một nhát **dao chặt** ngang qua: nét ngang hơi xiên lên, rồi nét sổ cong móc xuyên qua.',
        '**八** — hai nét **tách ra** hai bên: nghĩa gốc "chia ra" (chữ 分 phân — chia, có 八 ở trên). Hình ký hiệu tay số 8 (ngón cái + ngón trỏ) trông giống 八 xoay ngang.',
        '**九** — nét phẩy viết **trước**, rồi nét ngang gập cong móc **xuyên qua** nó. Khác 几 (mấy): 几 hai nét **không cắt nhau**.',
        '**两** — chữ 一 trên cùng là "đòn gánh" có **hai** quang gánh treo hai bên (hai chữ 人 nhỏ trong khung).',
        '**岁** = **山** (núi) + **夕** (chiều tối): mặt trời lặn sau núi, ngày qua ngày thành **năm tháng, tuổi tác**. (Phồn thể: 歲.)',
        '**多** = **夕** + **夕**: hai buổi tối chồng lên nhau → **nhiều**. **少** = **小** (nhỏ) bị thêm một nét phẩy cắt bớt → **ít**. 多少 = nhiều-ít = bao nhiêu.',
        '**号** = **口** (miệng) + **丂**: mở miệng hô to → **hiệu lệnh**, khẩu hiệu 口号, rồi thành "số hiệu" — 手机号.',
        '**年** — hình người **vác bó lúa** trên vai: mỗi lần gặt xong là hết một **năm**. Chú ý nét sổ dài cuối cùng xuyên qua cả chữ.',
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận: các chữ dễ viết nhầm',
      items: [
        '**九 ↔ 几 ↔ 力**: 九 (chín) nét móc **cắt qua** nét phẩy; 几 (mấy) hai nét **đứng riêng**; 力 (lì — sức) nét phẩy xuyên xuống dưới nét ngang gập.',
        '**七 ↔ 匕**: 七 nét ngang **xuyên qua** nét sổ cong; 匕 (bǐ — cái thìa) nét phẩy không xuyên.',
        '**八 ↔ 人 ↔ 入**: 八 hai nét **tách rời**; 人 hai nét **chạm nhau** ở đỉnh, nét phẩy cao hơn; 入 (rù — vào) nét **mác** cao hơn.',
        '**岁 ↔ 罗**: 岁 trên là **山**; 罗 (luó) trên là **罒**.',
        '**少 ↔ 小**: 少 có thêm **nét phẩy dài** ở dưới. 多少 nhớ viết 少, không phải 小.',
      ],
    },
    {
      t: 'readkanji',
      id: 'b5-doc-chu',
      title: 'Đọc chữ trần — không pinyin',
      note: 'Như đề HSK: chữ không có pinyin. Nhớ: 一 trong 一个/一岁 → yí; 十一/二十一 → yī; số điện thoại 1 → yāo; 二 ↔ 两. Đọc to cả câu rồi mới bấm hiện pinyin.',
      items: [
        { text: '{你|nǐ}{今年|jīnnián}{多大|duō dà}？', ro: 'Nǐ jīnnián duō dà?', vi: 'Năm nay bạn bao nhiêu tuổi?' },
        { text: '{我|wǒ}{今年|jīnnián}{二十|èrshí}{岁|suì}。', ro: 'Wǒ jīnnián èrshí suì.', vi: 'Năm nay tôi hai mươi tuổi.' },
        { text: '{你|nǐ}{几|jǐ}{岁|suì}？', ro: 'Nǐ jǐ suì?', vi: 'Cháu mấy tuổi?' },
        { text: '{我|wǒ}{六|liù}{岁|suì}。', ro: 'Wǒ liù suì.', vi: 'Cháu sáu tuổi.' },
        { text: '{王明|Wáng Míng}{二十一|èrshíyī}{岁|suì}。', ro: 'Wáng Míng èrshíyī suì.', vi: 'Vương Minh hai mươi mốt tuổi.' },
        { text: '{安娜|Ānnà}{十九|shíjiǔ}{岁|suì}。', ro: 'Ānnà shíjiǔ suì.', vi: 'Anna mười chín tuổi.' },
        { text: '{她|tā}{儿子|érzi}{两|liǎng}{岁|suì}。', ro: 'Tā érzi liǎng suì.', vi: 'Con trai cô ấy hai tuổi.' },
        { text: '{我|wǒ}{妈妈|māma}{四十八|sìshíbā}{岁|suì}。', ro: 'Wǒ māma sìshíbā suì.', vi: 'Mẹ tôi bốn mươi tám tuổi.' },
        { text: '{你|nǐ}{的|de}{手机号|shǒujīhào}{是|shì}{多少|duōshao}？', ro: 'Nǐ de shǒujīhào shì duōshao?', vi: 'Số di động của bạn là bao nhiêu?' },
        { text: '{我|wǒ}{有|yǒu}{很|hěn}{多|duō}{朋友|péngyou}。', ro: 'Wǒ yǒu hěn duō péngyou.', vi: 'Tôi có rất nhiều bạn.' },
        { text: '{我|wǒ}{不|bú}{是|shì}{十四|shísì}{岁|suì}，{我|wǒ}{四十|sìshí}{岁|suì}！', ro: 'Wǒ bú shì shísì suì, wǒ sìshí suì!', vi: 'Tôi không phải 14 tuổi, tôi 40 tuổi!' },
        { text: '{今年|jīnnián}{是|shì}{二〇二六|èr líng èr liù}{年|nián}。', ro: 'Jīnnián shì èr líng èr liù nián.', vi: 'Năm nay là năm 2026.' },
      ],
    },
    {
      t: 'table',
      caption: 'Chữ của bài trong từ ghép khác — đoán nghĩa nhờ âm Hán Việt (chỉ để nhận mặt, chưa cần học)',
      head: ['Từ', 'Pinyin', 'Hán Việt', 'Nghĩa'],
      rows: [
        ['多数', 'duōshù', 'ĐA SỐ', 'đa số'],
        ['少年', 'shàonián', 'THIẾU NIÊN', 'thiếu niên (少 ở đây đọc shào!)'],
        ['青年', 'qīngnián', 'THANH NIÊN', 'thanh niên'],
        ['口号', 'kǒuhào', 'KHẨU HIỆU', 'khẩu hiệu'],
        ['八卦', 'bāguà', 'BÁT QUÁI', 'bát quái; (khẩu ngữ) chuyện tầm phào'],
        ['九月', 'jiǔyuè', 'CỬU NGUYỆT', 'tháng Chín (Bài 6)'],
        ['万岁', 'wànsuì', 'VẠN TUẾ', 'muôn năm'],
      ],
    },
    {
      t: 'readkanji',
      id: 'b5-doc-doan',
      title: 'Đọc to cả đoạn — chữ trần',
      note: 'Mỗi đoạn có nhiều con số. Đọc một hơi, rồi bấm hiện pinyin để tự chấm. Chỗ hay vấp: 二十一 (yī), 两岁, 一个 (yí), số điện thoại (yāo).',
      items: [
        { text: '{我|wǒ}{家|jiā}{有|yǒu}{五|wǔ}{口|kǒu}{人|rén}。{我|wǒ}{爸爸|bàba}{五十二|wǔshí\'èr}{岁|suì}，{我|wǒ}{妈妈|māma}{四十八|sìshíbā}{岁|suì}，{我|wǒ}{哥哥|gēge}{二十五|èrshíwǔ}{岁|suì}，{我|wǒ}{妹妹|mèimei}{十五|shíwǔ}{岁|suì}。', ro: "Wǒ jiā yǒu wǔ kǒu rén. Wǒ bàba wǔshí'èr suì, wǒ māma sìshíbā suì, wǒ gēge èrshíwǔ suì, wǒ mèimei shíwǔ suì.", vi: 'Nhà tôi có năm người. Bố tôi 52 tuổi, mẹ tôi 48 tuổi, anh trai tôi 25 tuổi, em gái tôi 15 tuổi.' },
        { text: '{老板|lǎobǎn}{有|yǒu}{两|liǎng}{个|ge}{孩子|háizi}：{一|yí}{个|ge}{十|shí}{岁|suì}，{一|yí}{个|ge}{六|liù}{岁|suì}。', ro: 'Lǎobǎn yǒu liǎng ge háizi: yí ge shí suì, yí ge liù suì.', vi: 'Bà chủ có hai đứa con: một đứa 10 tuổi, một đứa 6 tuổi.' },
        { text: '{我|wǒ}{的|de}{手机号|shǒujīhào}{是|shì}{一|yāo}{五|wǔ}{八|bā}，{一|yāo}{零|líng}{六|liù}{六|liù}，{二|èr}{四|sì}{七|qī}{九|jiǔ}。', ro: 'Wǒ de shǒujīhào shì yāo wǔ bā, yāo líng liù liù, èr sì qī jiǔ.', vi: 'Số di động của tôi là 158 1066 2479.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-han-tu-nhan',
      title: 'Nhận mặt chữ',
      items: [
        m('Chữ nào là số 9?', ['几', '九', '力', '七'], 1, '九 = 9; 几 = mấy.'),
        m('Chữ nào là số 6?', ['八', '六', '大', '文'], 1, '六 = 6.'),
        m('Chữ nào nghĩa là "tuổi"?', ['年', '岁', '号', '多'], 1, '岁 = tuổi (TUẾ).'),
        m('多 được ghép từ:', ['夕 + 夕', '夕 + 口', '小 + 夕', '大 + 夕'], 0, '多 = hai chữ 夕 chồng lên.'),
        m('Chữ nào trái nghĩa với 多?', ['大', '小', '少', '两'], 2, '多 (nhiều) ↔ 少 (ít).'),
        m('Âm Hán Việt của 年 là:', ['NIÊN', 'TUẾ', 'HIỆU', 'ĐA'], 0, '年 = NIÊN (thanh niên).'),
        m('四 có mấy nét?', ['4', '5', '6', '3'], 1, '四: 5 nét (khung 3 nét + 2 nét bên trong; nét đóng đáy cuối cùng).'),
        m('"Hai" đứng trước lượng từ viết là:', ['二', '两', '十', '儿'], 1, '两个, 两岁.'),
        m('Âm Hán Việt của 号 là:', ['HIỆU', 'KHẨU', 'HẢO', 'TỰ'], 0, '号 = HIỆU (khẩu hiệu, số hiệu).'),
      ],
    },
    {
      t: 'write',
      id: 'b5-viet-chu',
      title: 'Tập viết 12 chữ của Bài 5',
      note: 'Thứ tự gợi ý: chữ ít nét trước. Bấm ▶ xem nét → tô theo → tự viết 3 lần, đọc to pinyin mỗi lần viết. Chú ý: 四 đóng đáy cuối cùng; 九 nét phẩy viết trước; 七 nét ngang trước; 年 nét sổ dài cuối cùng.',
      chars: ['七', '八', '九', '五', '六', '少', '四', '号', '岁', '多', '年', '两'],
    },
  ],
};

/* ══════════════════════════ 5. NGHE ══════════════════════════ */

const NGHE: Lesson = {
  id: 'b5-nghe',
  kind: 'listening',
  title: 'Luyện nghe Bài 5 — con số, tuổi, số điện thoại (kiểu đề HSK 1)',
  goal: 'Nghe và viết lại đúng con số 0–99, phân biệt 十四/四十, nghe tuổi của nhiều người trong một đoạn hội thoại và chép lại số điện thoại.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Cách làm bài nghe có số',
      items: [
        '**Viết ngay** con số bằng chữ số Ả Rập khi nghe (20, 48, 158…) — đừng cố nhớ trong đầu.',
        'Cặp dễ nhầm nhất: **shísì (14) ↔ sìshí (40)** · **sì (4) ↔ shí (10)** · **qī (7) ↔ yī (1)** · **jiǔ (9) ↔ liù (6)**.',
        'Nghe **两** = 2 (trước lượng từ); nghe **yāo** = 1 (trong dãy số điện thoại).',
        'Đề hay đổi thứ tự: người A nói tuổi người B. Ghi **tên + tuổi** thành từng cặp.',
      ],
    },
    {
      t: 'note',
      title: 'Dạng đề HSK 1 (phần Nghe — 听力) dùng trong bài này',
      items: [
        '**Phần 1**: nghe cụm từ ngắn, chọn đúng/sai so với tranh → *Bài nghe 1* (tranh = con số hoặc mô tả).',
        '**Phần 3**: nghe hội thoại hai câu, chọn tranh → *Bài nghe 2*.',
        '**Phần 4**: nghe câu/đoạn, trả lời câu hỏi chọn 1 trong 3 → *Bài nghe 3, 4*.',
      ],
    },

    { t: 'h', text: 'Bài nghe 1 — Bạn nghe được số nào?' },
    {
      t: 'listen',
      id: 'b5-nghe-1',
      title: 'Sáu con số',
      note: 'Mỗi câu một con số. Nghe → chọn số đúng. Cẩn thận các cặp gần âm.',
      lines: [
        { who: 'Câu 1', voice: 'zh-nu', text: '{十四|shísì}', ro: 'shísì', vi: '14' },
        { who: 'Câu 2', voice: 'zh-nam', text: '{四十|sìshí}', ro: 'sìshí', vi: '40' },
        { who: 'Câu 3', voice: 'zh-nu', text: '{七十一|qīshíyī}', ro: 'qīshíyī', vi: '71' },
        { who: 'Câu 4', voice: 'zh-nam', text: '{九十六|jiǔshíliù}', ro: 'jiǔshíliù', vi: '96' },
        { who: 'Câu 5', voice: 'zh-nu', text: '{两|liǎng}{个|ge}{人|rén}', ro: 'liǎng ge rén', vi: 'hai người' },
        { who: 'Câu 6', voice: 'zh-nam', text: '{三十八|sānshíbā}', ro: 'sānshíbā', vi: '38' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-nghe-q1',
      title: 'Câu hỏi bài nghe 1',
      items: [
        m('Câu 1 là số:', ['4', '14', '40', '44'], 1, '十四 shísì: 十 (lên giọng) trước → 14.'),
        m('Câu 2 là số:', ['4', '14', '40', '10'], 2, '四十 sìshí: 四 (xuống giọng) trước → 40.'),
        m('Câu 3 là số:', ['17', '71', '11', '77'], 1, '七十一 = 7 × 10 + 1 = 71.'),
        m('Câu 4 là số:', ['69', '96', '99', '66'], 1, '九十六 = 96.'),
        m('Câu 5: có bao nhiêu người?', ['1', '2', '10', '12'], 1, '两个人 = hai người.'),
        m('Câu 6 là số:', ['38', '83', '28', '33'], 0, '三十八 = 38.'),
      ],
    },

    { t: 'h', text: 'Bài nghe 2 — Ai bao nhiêu tuổi?' },
    {
      t: 'listen',
      id: 'b5-nghe-2',
      title: 'Bốn cặp hỏi – đáp',
      note: 'Mỗi cặp hỏi tuổi một người. Ghi tên + tuổi.',
      lines: [
        { who: 'Cặp 1 — Nam', voice: 'zh-nam', text: '{你|nǐ}{今年|jīnnián}{多大|duō dà}？', ro: 'Nǐ jīnnián duō dà?', vi: 'Năm nay bạn bao nhiêu tuổi?' },
        { who: 'Cặp 1 — Nữ', voice: 'zh-nu', text: '{我|wǒ}{今年|jīnnián}{十八|shíbā}{岁|suì}。', ro: 'Wǒ jīnnián shíbā suì.', vi: 'Năm nay tôi 18 tuổi.' },
        { who: 'Cặp 2 — Nữ', voice: 'zh-nu', text: '{你|nǐ}{儿子|érzi}{几|jǐ}{岁|suì}？', ro: 'Nǐ érzi jǐ suì?', vi: 'Con trai anh mấy tuổi?' },
        { who: 'Cặp 2 — Nam', voice: 'zh-nam', text: '{他|tā}{三|sān}{岁|suì}。', ro: 'Tā sān suì.', vi: 'Nó ba tuổi.' },
        { who: 'Cặp 3 — Nam', voice: 'zh-nam', text: '{你|nǐ}{姐姐|jiějie}{多大|duō dà}？', ro: 'Nǐ jiějie duō dà?', vi: 'Chị gái bạn bao nhiêu tuổi?' },
        { who: 'Cặp 3 — Nữ', voice: 'zh-nu', text: '{她|tā}{二十七|èrshíqī}{岁|suì}，{她|tā}{是|shì}{老师|lǎoshī}。', ro: 'Tā èrshíqī suì, tā shì lǎoshī.', vi: 'Chị ấy 27 tuổi, chị ấy là giáo viên.' },
        { who: 'Cặp 4 — Nữ', voice: 'zh-nu', text: '{你|nǐ}{爸爸|bàba}{六十|liùshí}{岁|suì}{吗|ma}？', ro: 'Nǐ bàba liùshí suì ma?', vi: 'Bố bạn 60 tuổi à?' },
        { who: 'Cặp 4 — Nam', voice: 'zh-nam', text: '{不|bú}{是|shì}，{他|tā}{五十九|wǔshíjiǔ}。', ro: 'Bú shì, tā wǔshíjiǔ.', vi: 'Không phải, ông ấy 59.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-nghe-q2',
      title: 'Câu hỏi bài nghe 2',
      items: [
        m('Cặp 1: người nữ bao nhiêu tuổi?', ['8', '18', '80'], 1, '十八岁 = 18 tuổi.'),
        m('Cặp 2: "tranh" nào đúng?', ['Một bé trai khoảng 3 tuổi', 'Một bé gái 3 tuổi', 'Một cậu thiếu niên 13 tuổi'], 0, '儿子 (con trai) 三岁 — dùng 几岁 vì là trẻ nhỏ.'),
        m('Cặp 3: chị gái bao nhiêu tuổi, làm nghề gì?', ['17, học sinh', '27, giáo viên', '27, bác sĩ'], 1, '二十七岁，她是老师。'),
        m('Cặp 4: bố người nam bao nhiêu tuổi?', ['60', '59', '69'], 1, '不是，他五十九。'),
      ],
    },

    { t: 'h', text: 'Bài nghe 3 — Chép số điện thoại' },
    {
      t: 'listen',
      id: 'b5-nghe-3',
      title: 'Anna xin số điện thoại của cô Lý',
      lines: [
        { who: '安娜', voice: 'zh-nu', text: '{李|Lǐ}{老师|lǎoshī}，{您|nín}{的|de}{电话|diànhuà}{是|shì}{多少|duōshao}？', ro: 'Lǐ lǎoshī, nín de diànhuà shì duōshao?', vi: 'Cô Lý ơi, số điện thoại của cô là bao nhiêu ạ?' },
        { who: '李老师', voice: 'zh-nu', text: '{我|wǒ}{的|de}{手机号|shǒujīhào}{是|shì}{一|yāo}{八|bā}{六|liù}，{一|yāo}{二|èr}{三|sān}{零|líng}，{九|jiǔ}{四|sì}{五|wǔ}{七|qī}。', ro: 'Wǒ de shǒujīhào shì yāo bā liù, yāo èr sān líng, jiǔ sì wǔ qī.', vi: 'Số di động của cô là 186 1230 9457.' },
        { who: '安娜', voice: 'zh-nu', text: '{一|yāo}{八|bā}{六|liù}，{一|yāo}{二|èr}{三|sān}{零|líng}，{九|jiǔ}{四|sì}{五|wǔ}{一|yāo}？', ro: 'Yāo bā liù, yāo èr sān líng, jiǔ sì wǔ yāo?', vi: '186 1230 9451 ạ?' },
        { who: '李老师', voice: 'zh-nu', text: '{不|bú}{是|shì}{一|yāo}，{是|shì}{七|qī}。{九|jiǔ}{四|sì}{五|wǔ}{七|qī}。', ro: 'Bú shì yāo, shì qī. Jiǔ sì wǔ qī.', vi: 'Không phải 1, là 7. 9457.' },
        { who: '安娜', voice: 'zh-nu', text: '{好|hǎo}，{谢谢|xièxie}{老师|lǎoshī}！', ro: 'Hǎo, xièxie lǎoshī!', vi: 'Vâng, em cảm ơn cô ạ!' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-nghe-q3',
      title: 'Câu hỏi bài nghe 3',
      items: [
        m('Số điện thoại của cô Lý là:', ['186 1230 9451', '186 1230 9457', '168 1230 9457'], 1, 'Cô sửa lại: 不是一，是七 → 9457.'),
        m('Vì sao Anna nhắc lại sai?', ['Nhầm 7 (qī) với 1 (yāo/yī)', 'Nhầm 4 với 10', 'Nhầm 6 với 9'], 0, 'Đây chính là lý do người Trung Quốc đọc 1 là yāo.'),
        m('Anna dùng từ nào để hỏi số điện thoại?', ['几', '多少', '多大'], 1, '您的电话是多少？'),
      ],
    },

    { t: 'h', text: 'Bài nghe 4 — Câu lạc bộ tiếng Anh' },
    {
      t: 'listen',
      id: 'b5-nghe-4',
      title: 'Vương Minh giới thiệu câu lạc bộ',
      note: 'Một người nói. Ghi: có bao nhiêu thành viên, mấy người Việt Nam, ai nhỏ tuổi nhất, ai lớn tuổi nhất.',
      lines: [
        { who: '王明', voice: 'zh-nam', text: '{我们|wǒmen}{有|yǒu}{十二|shí\'èr}{个|ge}{人|rén}：{八|bā}{个|ge}{中国|Zhōngguó}{人|rén}，{两|liǎng}{个|ge}{越南|Yuènán}{人|rén}，{一|yí}{个|ge}{美国|Měiguó}{人|rén}，{一|yí}{个|ge}{俄罗斯|Éluósī}{人|rén}。', ro: "Wǒmen yǒu shí'èr ge rén: bā ge Zhōngguó rén, liǎng ge Yuènán rén, yí ge Měiguó rén, yí ge Éluósī rén.", vi: 'Chúng tôi có 12 người: 8 người Trung Quốc, 2 người Việt Nam, 1 người Mỹ, 1 người Nga.' },
        { who: '王明', voice: 'zh-nam', text: '{安娜|Ānnà}{十九|shíjiǔ}{岁|suì}，{她|tā}{很|hěn}{小|xiǎo}。{兰兰|Lánlan}{二十|èrshí}{岁|suì}，{我|wǒ}{二十一|èrshíyī}{岁|suì}。', ro: 'Ānnà shíjiǔ suì, tā hěn xiǎo. Lánlan èrshí suì, wǒ èrshíyī suì.', vi: 'Anna 19 tuổi, bạn ấy nhỏ nhất. Lan 20 tuổi, tôi 21 tuổi.' },
        { who: '王明', voice: 'zh-nam', text: '{大伟|Dàwěi}{二十二|èrshí\'èr}{岁|suì}。{李|Lǐ}{老师|lǎoshī}{也|yě}{是|shì}{我们|wǒmen}{的|de}{朋友|péngyou}！', ro: "Dàwěi èrshí'èr suì. Lǐ lǎoshī yě shì wǒmen de péngyou!", vi: 'Đại Vĩ 22 tuổi. Cô Lý cũng là bạn của chúng tôi!' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-nghe-q4',
      title: 'Câu hỏi bài nghe 4',
      items: [
        m('Câu lạc bộ có bao nhiêu người?', ['10', '12', '20'], 1, '我们有十二个人。'),
        m('Có mấy người Việt Nam?', ['1', '2', '8'], 1, '两个越南人。'),
        m('Ai 19 tuổi?', ['兰兰', '安娜', '大伟'], 1, '安娜十九岁。'),
        m('大伟多大？', ['二十岁', '二十一岁', '二十二岁'], 2, '大伟二十二岁。'),
        m('俄罗斯人 (Éluósī rén) là người nước nào?', ['Pháp', 'Nga', 'Đức'], 1, '俄罗斯 = Nga (từ mở rộng) — Anna là người Nga.'),
      ],
    },
  ],
};

/* ══════════════════════════ 6. NÓI ══════════════════════════ */

const NOI: Lesson = {
  id: 'b5-noi',
  kind: 'speaking',
  title: 'Luyện nói Bài 5 — đếm số, nói tuổi, đọc số điện thoại',
  goal: 'Đọc đúng thanh mọi số 0–99, phân biệt rõ sì/shí, nói tuổi của mình và người nhà, đọc trôi chảy số điện thoại của mình.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Luyện nói thế nào',
      items: [
        '**Phát âm từng câu**: nghe mẫu → ghi âm → máy chấm từng chữ. Chữ dưới 80 điểm: nghe lại, để ý **thanh** và **phụ âm đầu**.',
        'Chỗ khó của bài: **sì ↔ shí** (s thẳng / sh uốn lưỡi) · **qī** (q bật hơi) · **èr** (cuộn lưỡi) · **liǎng** · **yí ge / yí suì** · **yāo**.',
        'Câu nói vui **四是四，十是十** là "bài tập thể dục" kinh điển cho lưỡi — người Trung Quốc cũng luyện câu này.',
        'Danh sách 12 câu cũng là bộ câu cho 📞 **CuongMini** trong bài.',
      ],
    },
    {
      t: 'phatam',
      id: 'b5-noi-phat-am',
      title: '12 câu then chốt — ngắn đến dài',
      note: 'Đọc chậm → bình thường → không nhìn pinyin. Với số, đọc rõ từng âm tiết, không nuốt chữ 十.',
      items: [
        { text: '{一|yī}、{二|èr}、{三|sān}、{四|sì}、{五|wǔ}。', ipa: 'Yī, èr, sān, sì, wǔ.', vi: 'Một, hai, ba, bốn, năm.' },
        { text: '{六|liù}、{七|qī}、{八|bā}、{九|jiǔ}、{十|shí}。', ipa: 'Liù, qī, bā, jiǔ, shí.', vi: 'Sáu, bảy, tám, chín, mười.' },
        { text: '{十四|shísì}，{四十|sìshí}。', ipa: 'Shísì, sìshí.', vi: 'Mười bốn, bốn mươi. — đổi chỗ sh/s' },
        { text: '{你|nǐ}{几|jǐ}{岁|suì}？', ipa: 'Nǐ jǐ suì?', vi: 'Cháu mấy tuổi? — ní jǐ suì' },
        { text: '{你|nǐ}{今年|jīnnián}{多大|duō dà}？', ipa: 'Nǐ jīnnián duō dà?', vi: 'Năm nay bạn bao nhiêu tuổi?' },
        { text: '{我|wǒ}{今年|jīnnián}{二十|èrshí}{岁|suì}。', ipa: 'Wǒ jīnnián èrshí suì.', vi: 'Năm nay tôi hai mươi tuổi.' },
        { text: '{我|wǒ}{有|yǒu}{两|liǎng}{个|ge}{哥哥|gēge}。', ipa: 'Wǒ yǒu liǎng ge gēge.', vi: 'Tôi có hai anh trai. — wó yóu liǎng ge' },
        { text: '{她|tā}{女儿|nǚ\'ér}{一|yí}{岁|suì}。', ipa: "Tā nǚ'ér yí suì.", vi: 'Con gái cô ấy một tuổi. — yí suì' },
        { text: '{你|nǐ}{的|de}{手机号|shǒujīhào}{是|shì}{多少|duōshao}？', ipa: 'Nǐ de shǒujīhào shì duōshao?', vi: 'Số di động của bạn là bao nhiêu?' },
        { text: '{一|yāo}{五|wǔ}{八|bā}，{一|yāo}{零|líng}{六|liù}{六|liù}，{二|èr}{四|sì}{七|qī}{九|jiǔ}。', ipa: 'Yāo wǔ bā, yāo líng liù liù, èr sì qī jiǔ.', vi: '158 1066 2479. — 1 đọc yāo' },
        { text: '{我|wǒ}{爸爸|bàba}{五十二|wǔshí\'èr}{岁|suì}，{我|wǒ}{妈妈|māma}{四十八|sìshíbā}{岁|suì}。', ipa: "Wǒ bàba wǔshí'èr suì, wǒ māma sìshíbā suì.", vi: 'Bố tôi 52 tuổi, mẹ tôi 48 tuổi.' },
        { text: '{四|sì}{是|shì}{四|sì}，{十|shí}{是|shì}{十|shí}，{十四|shísì}{是|shì}{十四|shísì}，{四十|sìshí}{是|shì}{四十|sìshí}。', ipa: 'Sì shì sì, shí shì shí, shísì shì shísì, sìshí shì sìshí.', vi: 'Bốn là bốn, mười là mười, mười bốn là mười bốn, bốn mươi là bốn mươi. — câu nói vui luyện s/sh' },
      ],
    },
    {
      t: 'note',
      title: 'Ba cặp âm phải tách bạch trong bài này',
      items: [
        '**sì (四) ↔ shí (十) ↔ shì (是)**: 四 — đầu lưỡi chạm **sau răng dưới**, hơi đi thẳng, thanh 4. 十 — **cong đầu lưỡi lên** gần vòm miệng, thanh 2 đi lên. 是 — cũng uốn lưỡi nhưng thanh 4. Câu "四是四，十是十" luyện đúng cả ba.',
        '**qī (七) ↔ jī ↔ yī (一)**: q như "ch" tiếng Việt nhưng **bật mạnh hơi** (đặt tờ giấy trước miệng — giấy phải bay). Đừng đọc thành "chi" kiểu tiếng Việt.',
        '**èr (二)**: đọc "ơ" rồi **cuộn lưỡi** lên. Trong 十二 shí\'èr và 二十 èrshí giữ nguyên âm cuộn lưỡi.',
      ],
    },

    { t: 'h', text: 'Hỏi — đáp mẫu với giám khảo' },
    {
      t: 'p',
      text: 'Phần thi nói sơ cấp hay ghép **tuổi** và **gia đình** vào cùng một lượt hỏi. Trả lời bằng câu đầy đủ, dùng đúng **两** và **岁**.',
    },
    {
      t: 'dialogue',
      title: 'Giám khảo ↔ thí sinh',
      lines: [
        { who: 'Giám khảo', role: 'examiner', text: '{你|nǐ}{今年|jīnnián}{多大|duō dà}？', ro: 'Nǐ jīnnián duō dà?', vi: 'Năm nay em bao nhiêu tuổi?' },
        { who: 'Thí sinh', role: 'candidate', text: '{我|wǒ}{今年|jīnnián}{二十|èrshí}{岁|suì}。', ro: 'Wǒ jīnnián èrshí suì.', vi: 'Năm nay em hai mươi tuổi ạ.' },
        { who: 'Giám khảo', role: 'examiner', text: '{你|nǐ}{家|jiā}{有|yǒu}{几|jǐ}{口|kǒu}{人|rén}？', ro: 'Nǐ jiā yǒu jǐ kǒu rén?', vi: 'Nhà em có mấy người?' },
        { who: 'Thí sinh', role: 'candidate', text: '{我|wǒ}{家|jiā}{有|yǒu}{四|sì}{口|kǒu}{人|rén}：{爸爸|bàba}、{妈妈|māma}、{弟弟|dìdi}{和|hé}{我|wǒ}。', ro: 'Wǒ jiā yǒu sì kǒu rén: bàba, māma, dìdi hé wǒ.', vi: 'Nhà em có bốn người: bố, mẹ, em trai và em.' },
        { who: 'Giám khảo', role: 'examiner', text: '{你|nǐ}{弟弟|dìdi}{几|jǐ}{岁|suì}？', ro: 'Nǐ dìdi jǐ suì?', vi: 'Em trai em mấy tuổi?' },
        { who: 'Thí sinh', role: 'candidate', text: '{他|tā}{八|bā}{岁|suì}，{他|tā}{是|shì}{小学生|xiǎoxuéshēng}。', ro: 'Tā bā suì, tā shì xiǎoxuéshēng.', vi: 'Em ấy tám tuổi, là học sinh tiểu học. (小学生 — từ mở rộng)' },
        { who: 'Giám khảo', role: 'examiner', text: '{你|nǐ}{爸爸|bàba}{多大|duō dà}？', ro: 'Nǐ bàba duō dà?', vi: 'Bố em bao nhiêu tuổi?' },
        { who: 'Thí sinh', role: 'candidate', text: '{我|wǒ}{爸爸|bàba}{四十九|sìshíjiǔ}{岁|suì}，{他|tā}{是|shì}{医生|yīshēng}。', ro: 'Wǒ bàba sìshíjiǔ suì, tā shì yīshēng.', vi: 'Bố em 49 tuổi, bố là bác sĩ.' },
        { who: 'Giám khảo', role: 'examiner', text: '{你|nǐ}{的|de}{手机号|shǒujīhào}{是|shì}{多少|duōshao}？', ro: 'Nǐ de shǒujīhào shì duōshao?', vi: 'Số di động của em là bao nhiêu?' },
        { who: 'Thí sinh', role: 'candidate', text: '{一|yāo}{三|sān}{九|jiǔ}，{零|líng}{一|yāo}{二|èr}{七|qī}，{三|sān}{五|wǔ}{八|bā}{零|líng}。', ro: 'Yāo sān jiǔ, líng yāo èr qī, sān wǔ bā líng.', vi: '139 0127 3580 ạ.' },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo để không mất điểm',
      items: [
        'Tuổi **người nhà**: dùng 多大 cho người lớn, 几岁 cho em nhỏ — giám khảo để ý chỗ này.',
        'Đọc số điện thoại **theo nhóm 3–4–4**, ngừng nhẹ giữa các nhóm; 1 đọc **yāo**. Không muốn nói số thật thì bịa một số — không ai kiểm tra!',
        'Nói tuổi **không thêm 是**: 我二十岁. Chỉ khi phủ định mới dùng 不是.',
        'Không nghe rõ con số giám khảo hỏi? Nhắc lại con số kèm 吗 để xác nhận: 四十吗？',
      ],
    },

    { t: 'h', text: 'Đến lượt bạn' },
    {
      t: 'p',
      text: 'Năm câu hỏi dưới đây sẽ được đọc lên. Trả lời **về bản thân thật** của bạn (tuổi, người nhà, số điện thoại — số bịa cũng được), ghi âm rồi nghe lại.',
    },
    {
      t: 'examples',
      items: [
        { en: '{你|nǐ}{今年|jīnnián}{多大|duō dà}？', ro: 'Nǐ jīnnián duō dà?', vi: 'Năm nay bạn bao nhiêu tuổi? → 我今年…岁。' },
        { en: '{你|nǐ}{家|jiā}{有|yǒu}{几|jǐ}{口|kǒu}{人|rén}？', ro: 'Nǐ jiā yǒu jǐ kǒu rén?', vi: 'Nhà bạn có mấy người? → 我家有…口人。' },
        { en: '{你|nǐ}{妈妈|māma}{多大|duō dà}？', ro: 'Nǐ māma duō dà?', vi: 'Mẹ bạn bao nhiêu tuổi? → 我妈妈…岁。' },
        { en: '{你|nǐ}{有|yǒu}{几|jǐ}{个|ge}{中国|Zhōngguó}{朋友|péngyou}？', ro: 'Nǐ yǒu jǐ ge Zhōngguó péngyou?', vi: 'Bạn có mấy người bạn Trung Quốc? → 我有…个中国朋友。/ 我没有中国朋友。' },
        { en: '{你|nǐ}{的|de}{手机号|shǒujīhào}{是|shì}{多少|duōshao}？', ro: 'Nǐ de shǒujīhào shì duōshao?', vi: 'Số di động của bạn là bao nhiêu? → 我的手机号是……' },
      ],
    },
    {
      t: 'speak',
      id: 'b5-noi-ghi-am',
      part: '1',
      questions: ['你今年多大？', '你家有几口人？', '你妈妈多大？', '你有几个中国朋友？', '你的手机号是多少？'],
    },
  ],
};

/* ══════════════════════════ 7. BÀI TẬP ══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b5-bai-tap',
  kind: 'homework',
  title: 'Bài tập Bài 5 — dịch, pinyin, trắc nghiệm, ghép câu, đọc hiểu',
  goal: 'Tự kiểm tra toàn bộ Bài 5: viết số và câu về tuổi bằng chữ Hán, chọn đúng 二/两, 几/多少, đọc đúng 一; đọc hiểu một đoạn có nhiều con số.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Trước khi làm bài',
      items: [
        'Ô dịch: gõ **chữ Hán** (gõ "ershi" → 二十). Số trong câu trả lời viết bằng **chữ Hán** (二十岁), không viết 20岁 — ô vẫn chấm đúng nếu bạn gõ chữ số, nhưng thi HSK yêu cầu đọc được chữ.',
        'Ô pinyin: có dấu (èrshí) hoặc dạng số (er4shi2).',
        'Công thức: **S + 今年 + số + 岁** · **多大 / 几岁** · **两 + lượng từ** · **…是多少？** · 一 = yī / yí / yì / yāo.',
        'Đạt ≥ 80% → làm **Kiểm tra chặng 1** (mục kế tiếp). Dưới 70% → xem lại Ngữ pháp ②–④.',
      ],
    },
    { t: 'h', text: '1. Dịch sang tiếng Trung (viết chữ Hán)' },
    {
      t: 'quiz',
      id: 'b5-bt-dich',
      title: 'Dịch Việt → Trung',
      kind: 'translate',
      grammar: 'S + (今年) + số + 岁 · 多大 / 几岁 · 两 + lượng từ · …是多少 · 不是 + số + 岁',
      items: [
        { q: 'Năm nay bạn bao nhiêu tuổi?', answers: ['你今年多大？'], hint: '今年 · 多大' },
        { q: 'Năm nay tôi mười chín tuổi.', answers: ['我今年十九岁。', '今年我十九岁。', '我今年19岁。'], hint: '今年 · 十九 · 岁' },
        { q: 'Cháu mấy tuổi? (hỏi một bé gái)', answers: ['你几岁？', '你今年几岁？'], hint: '几 · 岁' },
        { q: 'Em trai tôi hai tuổi.', answers: ['我弟弟两岁。', '我弟弟2岁。'], hint: '两 · 岁' },
        { q: 'Anh ấy không phải ba mươi tuổi.', answers: ['他不是三十岁。', '他不是30岁。'], hint: '不是 · 三十 · 岁' },
        { q: 'Số di động của bạn là bao nhiêu?', answers: ['你的手机号是多少？', '你的手机号码是多少？'], hint: '手机号 · 是 · 多少' },
        { q: 'Tôi có hai người bạn Trung Quốc.', answers: ['我有两个中国朋友。'], hint: '两个 · 中国 · 朋友' },
        { q: 'Mẹ tôi bốn mươi lăm tuổi.', answers: ['我妈妈四十五岁。', '我妈妈45岁。', '我的妈妈四十五岁。'], hint: '四十五 · 岁' },
        { q: 'Trường các bạn có bao nhiêu sinh viên?', answers: ['你们学校有多少学生？', '你们学校有多少个学生？'], hint: '学校 · 多少 · 学生' },
        { q: 'Anh trai bạn bao nhiêu tuổi?', answers: ['你哥哥多大？', '你哥哥今年多大？'], hint: '哥哥 · 多大' },
        { q: 'Nhà tôi có ba người, tôi không có anh trai.', answers: ['我家有三口人，我没有哥哥。', '我家有三口人。我没有哥哥。', '我家有三口人，我没哥哥。'], hint: '三口人 · 没有 · 哥哥' },
        { q: 'Mười một, mười hai, hai mươi.', answers: ['十一、十二、二十。', '十一，十二，二十。', '十一 十二 二十'], hint: '十一 · 十二 · 二十' },
      ],
    },

    { t: 'h', text: '2. Viết pinyin' },
    {
      t: 'quiz',
      id: 'b5-bt-pinyin',
      title: 'Viết pinyin có dấu thanh (hoặc dạng số)',
      kind: 'fill',
      grammar: 'Số nhiều chữ viết liền · 一 ghi theo cách đọc · ’ trước èr khi đứng sau âm tiết khác',
      items: [
        { q: '十四 (14)', answers: py('shísì', 'shi2si4', 'shí sì', 'shi2 si4'), hint: '2 + 4' },
        { q: '四十 (40)', answers: py('sìshí', 'si4shi2', 'sì shí', 'si4 shi2'), hint: '4 + 2' },
        { q: '二十一 (21)', answers: py('èrshíyī', 'er4shi2yi1', 'èr shí yī', 'er4 shi2 yi1'), hint: '一 cuối số giữ thanh 1' },
        { q: '一岁 (một tuổi)', answers: py('yí suì', 'yi2 sui4'), hint: '一 trước thanh 4' },
        { q: '两个 (hai cái)', answers: py('liǎng ge', 'liang3 ge', 'liang3 ge5', 'liǎng gè', 'liang3 ge4'), hint: '3 + nhẹ' },
        { q: '多少 (bao nhiêu)', answers: py('duōshao', 'duo1shao', 'duo1shao5', 'duōshǎo', 'duo1shao3', 'duō shao', 'duo1 shao', 'duo1 shao5', 'duō shǎo', 'duo1 shao3'), hint: '1 + nhẹ (từ điển cũng ghi duōshǎo)' },
        { q: '今年 (năm nay)', answers: py('jīnnián', 'jin1nian2', 'jīn nián', 'jin1 nian2'), hint: '1 + 2' },
        { q: '手机 (điện thoại di động)', answers: py('shǒujī', 'shou3ji1', 'shǒu jī', 'shou3 ji1'), hint: '3 + 1' },
      ],
    },

    { t: 'h', text: '3. Trắc nghiệm tổng hợp' },
    {
      t: 'mcq',
      id: 'b5-bt-trac-nghiem',
      title: 'Chọn câu đúng / phù hợp',
      items: [
        m('Bạn muốn hỏi tuổi Vương Minh (21 tuổi):', ['王明几岁？', '王明多大？', '王明是多少？', '王明几个岁？'], 1, 'Người trẻ, bạn bè → 多大.'),
        m('Chọn từ đúng: 我有（　）个妹妹。', ['二', '两', '十二', '几'], 1, 'Trước lượng từ → 两.'),
        m('Chọn từ đúng: 我今年（　）十岁。', ['两', '二', '几', '多'], 1, 'Trong số 20 → 二十.'),
        m('Chọn từ đúng: 你的电话是（　）？', ['几', '多少', '多大', '谁'], 1, 'Số điện thoại → 多少.'),
        m('Chọn từ đúng: 小美，你（　）岁？', ['多', '几', '多少', '两'], 1, 'Hỏi trẻ nhỏ → 几岁.'),
        m('"Bốn mươi tư" là:', ['十四', '四十四', '四四十', '四十'], 1, '四十四 = 44.'),
        m('Câu nào **sai**?', ['我二十岁。', '我是二十岁。', '我不是二十岁。', '我今年二十岁。'], 1, 'Khẳng định không cần 是 — câu 2 nghe như cãi lại, sách giáo khoa coi là sai.'),
        m('110 (cảnh sát) đọc là:', ['yāo yāo líng', 'yìbǎi yīshí', 'shí yī líng', 'yī yī shí'], 0, 'Dãy số: 1 = yāo, 0 = líng.'),
        m('一个 / 一口 / 十一 lần lượt đọc là:', ['yí ge / yì kǒu / shíyī', 'yī ge / yī kǒu / shíyí', 'yì ge / yí kǒu / shíyī', 'yí ge / yí kǒu / shíyì'], 0, '个 gốc thanh 4 → yí; 口 thanh 3 → yì; cuối số → yī.'),
        m('Hỏi một cụ bà 80 tuổi lịch sự nhất:', ['你几岁？', '你多大？', '您多大年纪了？', '您是多少？'], 2, '您多大年纪了 — kính trọng (từ mở rộng).'),
        m('我有很多朋友 nghĩa là:', ['Tôi có rất nhiều bạn.', 'Tôi có bao nhiêu bạn?', 'Bạn tôi rất lớn.', 'Tôi có ít bạn.'], 0, '很多 = rất nhiều.'),
        m('"Con trai cô ấy 10 tuổi" — câu nào đúng?', ['她儿子是十岁。', '她儿子十岁。', '她儿子岁十。', '她的十岁儿子。'], 1, 'S + số + 岁.'),
      ],
    },

    { t: 'h', text: '4. Ghép câu' },
    {
      t: 'build',
      id: 'b5-bt-ghep',
      title: 'Ghép thành câu đúng',
      items: [
        { vi: 'Năm nay em gái tôi mười lăm tuổi.', chips: ['{我|wǒ}', '{妹妹|mèimei}', '{今年|jīnnián}', '{十五|shíwǔ}', '{岁|suì}', '{是|shì}'], answer: ['{我|wǒ}', '{妹妹|mèimei}', '{今年|jīnnián}', '{十五|shíwǔ}', '{岁|suì}'], ro: 'Wǒ mèimei jīnnián shíwǔ suì.' },
        { vi: 'Anh trai bạn bao nhiêu tuổi?', chips: ['{你|nǐ}', '{哥哥|gēge}', '{多大|duō dà}', '{几|jǐ}'], answer: ['{你|nǐ}', '{哥哥|gēge}', '{多大|duō dà}'], ro: 'Nǐ gēge duō dà?' },
        { vi: 'Tôi có hai em trai.', chips: ['{我|wǒ}', '{有|yǒu}', '{两|liǎng}', '{个|ge}', '{弟弟|dìdi}', '{二|èr}'], answer: ['{我|wǒ}', '{有|yǒu}', '{两|liǎng}', '{个|ge}', '{弟弟|dìdi}'], ro: 'Wǒ yǒu liǎng ge dìdi.' },
        { vi: 'Số điện thoại của cô giáo là bao nhiêu?', chips: ['{老师|lǎoshī}', '{的|de}', '{电话|diànhuà}', '{是|shì}', '{多少|duōshao}', '{几|jǐ}'], answer: ['{老师|lǎoshī}', '{的|de}', '{电话|diànhuà}', '{是|shì}', '{多少|duōshao}'], ro: 'Lǎoshī de diànhuà shì duōshao?' },
        { vi: 'Tôi không phải hai mươi hai tuổi.', chips: ['{我|wǒ}', '{不|bú}', '{是|shì}', '{二十二|èrshí\'èr}', '{岁|suì}'], answer: ['{我|wǒ}', '{不|bú}', '{是|shì}', '{二十二|èrshí\'èr}', '{岁|suì}'], ro: "Wǒ bú shì èrshí'èr suì." },
        { vi: 'Con gái bà chủ sáu tuổi.', chips: ['{老板|lǎobǎn}', '{的|de}', '{女儿|nǚ\'ér}', '{六|liù}', '{岁|suì}'], answer: ['{老板|lǎobǎn}', '{的|de}', '{女儿|nǚ\'ér}', '{六|liù}', '{岁|suì}'], ro: "Lǎobǎn de nǚ'ér liù suì." },
        { vi: 'Tôi có rất nhiều bạn.', chips: ['{我|wǒ}', '{有|yǒu}', '{很|hěn}', '{多|duō}', '{朋友|péngyou}', '{少|shǎo}'], answer: ['{我|wǒ}', '{有|yǒu}', '{很|hěn}', '{多|duō}', '{朋友|péngyou}'], ro: 'Wǒ yǒu hěn duō péngyou.' },
      ],
    },

    { t: 'h', text: '4b. Sửa câu sai' },
    {
      t: 'quiz',
      id: 'b5-bt-sua-cau',
      title: 'Mỗi câu có một lỗi — viết lại câu đúng (chữ Hán)',
      kind: 'translate',
      grammar: '两 + lượng từ · 二 trong số · không 是 khi nói tuổi · 不是 khi phủ định · 多少 cho số điện thoại · 多大/几岁',
      items: [
        { q: '~~我有二个哥哥。~~ (Tôi có hai anh trai.)', answers: ['我有两个哥哥。'], hint: '"Hai" trước lượng từ' },
        { q: '~~我两十岁。~~ (Tôi hai mươi tuổi.)', answers: ['我二十岁。'], hint: 'Trong số nhiều chữ' },
        { q: '~~我不二十岁。~~ (Tôi không phải hai mươi tuổi.)', answers: ['我不是二十岁。'], hint: 'Phủ định câu tuổi' },
        { q: '~~你的手机号是几？~~ (Số di động của bạn là bao nhiêu?)', answers: ['你的手机号是多少？'], hint: 'Hỏi số bất kỳ' },
        { q: '~~我二十岁今年。~~ (Năm nay tôi hai mươi tuổi.)', answers: ['我今年二十岁。', '今年我二十岁。'], hint: 'Vị trí của 今年' },
        { q: '~~一十五~~ (mười lăm)', answers: ['十五'], hint: '11–19 không có 一 phía trước' },
        { q: '~~你几哥哥？~~ (Bạn có mấy anh trai?)', answers: ['你有几个哥哥？'], hint: 'Thiếu động từ và lượng từ' },
        { q: '~~她女儿二岁。~~ (Con gái cô ấy hai tuổi.)', answers: ['她女儿两岁。'], hint: '岁 là lượng từ' },
      ],
    },

    { t: 'h', text: '5. Đọc hiểu' },
    {
      t: 'passage',
      title: 'Thẻ thành viên câu lạc bộ — Lan viết hộ Vương Minh',
      intro: 'Lan viết một đoạn giới thiệu các thành viên cho bảng tin câu lạc bộ. Đọc to (tắt pinyin nếu được), chú ý mọi con số, rồi trả lời câu hỏi.',
      paras: [
        { label: 'A', text: '{我们|wǒmen}{有|yǒu}{十二|shí\'èr}{个|ge}{人|rén}。{王明|Wáng Míng}{是|shì}{中国|Zhōngguó}{人|rén}，{他|tā}{今年|jīnnián}{二十一|èrshíyī}{岁|suì}。{他|tā}{家|jiā}{有|yǒu}{三|sān}{口|kǒu}{人|rén}，{他|tā}{的|de}{手机号|shǒujīhào}{是|shì}{一|yāo}{三|sān}{八|bā}，{六|liù}{六|liù}{零|líng}{二|èr}，{四|sì}{一|yāo}{九|jiǔ}{七|qī}。' },
        { label: 'B', text: '{安娜|Ānnà}{是|shì}{俄罗斯|Éluósī}{人|rén}，{她|tā}{十九|shíjiǔ}{岁|suì}。{她|tā}{有|yǒu}{一|yí}{个|ge}{哥哥|gēge}，{她|tā}{哥哥|gēge}{二十六|èrshíliù}{岁|suì}，{是|shì}{医生|yīshēng}。' },
        { label: 'C', text: '{大伟|Dàwěi}{是|shì}{美国|Měiguó}{人|rén}，{他|tā}{二十二|èrshí\'èr}{岁|suì}。{我|wǒ}{是|shì}{越南|Yuènán}{人|rén}，{我|wǒ}{二十|èrshí}{岁|suì}。{我们|wǒmen}{的|de}{老师|lǎoshī}{姓|xìng}{李|Lǐ}，{她|tā}{的|de}{电话|diànhuà}{是|shì}{一|yāo}{八|bā}{六|liù}，{一|yāo}{二|èr}{三|sān}{零|líng}，{九|jiǔ}{四|sì}{五|wǔ}{七|qī}。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-bt-doc-hieu',
      title: 'Câu hỏi đọc hiểu',
      items: [
        m('Câu lạc bộ có bao nhiêu người?', ['10', '12', '21'], 1, 'Đoạn A: 我们有十二个人。'),
        m('Số di động của Vương Minh là:', ['138 6602 4197', '183 6602 4197', '138 6620 4197'], 0, 'Đoạn A: 一三八，六六零二，四一九七.'),
        m('Anh trai Anna bao nhiêu tuổi, làm nghề gì?', ['16, học sinh', '26, bác sĩ', '26, giáo viên'], 1, 'Đoạn B: 她哥哥二十六岁，是医生。'),
        m('Ai nhiều tuổi nhất trong bốn bạn Lan, Vương Minh, Anna, Đại Vĩ?', ['王明', '大伟', '兰兰'], 1, '大伟二十二岁 — lớn nhất.'),
        m('Người viết đoạn văn là ai?', ['Anna — người Nga, 19 tuổi', 'Lan — người Việt Nam, 20 tuổi', 'Cô Lý'], 1, 'Đoạn C: 我是越南人，我二十岁 — đó là Lan.'),
      ],
    },
    {
      t: 'table',
      caption: 'Tự đánh giá Bài 5',
      head: ['Kết quả', 'Ý nghĩa', 'Làm gì tiếp'],
      rows: [
        ['≥ 80%', 'Nắm chắc Bài 5', 'Làm **Kiểm tra chặng 1** (mục kế tiếp) — 40 câu kiểu đề HSK 1, phủ Bài 0–5.'],
        ['70–79%', 'Còn vài chỗ hổng', 'Làm lại phần sai; luyện lại câu "四是四，十是十" và bảng 二/两.'],
        ['< 70%', 'Chưa vững', 'Học lại Ngữ pháp ①–④ (số, 二/两, 一, tuổi) rồi làm lại toàn bộ bài tập.'],
      ],
    },
  ],
};

/* ══════════════════════════ 8. KIỂM TRA CHẶNG 1 ══════════════════════════ */

const KIEM_TRA: Lesson = {
  id: 'b5-kiem-tra',
  kind: 'review',
  title: 'Kiểm tra chặng 1 — 40 câu kiểu đề HSK 1 (Bài 0–5)',
  goal: 'Tự đo mức nắm vững Bài 0–5 bằng một đề 40 câu theo khuôn HSK 1 (听力 + 阅读), biết mình đạt bao nhiêu điểm và phải ôn lại bài nào trước khi sang chặng 2.',
  minutes: 60,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Trước khi làm bài',
      items: [
        'Đề có **40 câu**: **听力 Nghe 20 câu** (phần 1–4) + **阅读 Đọc 20 câu** (phần 5–8). Mỗi câu **5 điểm**, tổng **200 điểm** — đúng thang điểm của HSK 1 thật.',
        'Phủ toàn bộ chặng 1: **Bài 0** pinyin & thanh điệu · **Bài 1** chào hỏi · **Bài 2** tên, 是 · **Bài 3** quốc tịch, 不, 也, 呢 · **Bài 4** gia đình, 有, 几, 的 · **Bài 5** số, tuổi.',
        'Làm như thi thật: **tắt pinyin** (nút trên trang), mỗi bài nghe **chỉ nghe 2 lần**, không mở lời thoại cho tới khi chọn xong. Thời gian gợi ý: Nghe ~20 phút, Đọc ~20 phút.',
        'Làm xong: cộng điểm, rồi xem bảng **"Sai câu nào — ôn bài nào"** ở cuối để biết chỗ hổng.',
      ],
    },
    {
      t: 'table',
      caption: 'Cấu trúc đề (mô phỏng HSK 1 — tranh trong đề thật được thay bằng mô tả chữ)',
      head: ['Phần', 'Kỹ năng', 'Dạng câu hỏi', 'Câu'],
      rows: [
        ['1', '听力 Nghe', 'Nghe từ/cụm từ — đúng (√) hay sai (×) so với tranh', '1–5'],
        ['2', '听力 Nghe', 'Nghe một câu — chọn tranh A / B / C', '6–10'],
        ['3', '听力 Nghe', 'Nghe hội thoại hai câu — chọn đáp án đúng', '11–15'],
        ['4', '听力 Nghe', 'Nghe một đoạn + câu hỏi — chọn 1 trong 3', '16–20'],
        ['5', '阅读 Đọc', 'Từ + tranh — đúng (√) hay sai (×)', '21–25'],
        ['6', '阅读 Đọc', 'Pinyin & thanh điệu (phần riêng của khoá — ôn Bài 0)', '26–30'],
        ['7', '阅读 Đọc', 'Ghép câu hỏi với câu trả lời phù hợp', '31–35'],
        ['8', '阅读 Đọc', 'Chọn từ điền vào chỗ trống', '36–40'],
      ],
    },

    /* ── 听力 ── */
    { t: 'h', text: '一、听力 — Phần 1 (câu 1–5): Đúng hay sai?' },
    {
      t: 'listen',
      id: 'b5-kt-nghe-1',
      title: 'Phần 1 — năm từ/cụm từ',
      note: 'Mỗi câu đọc HAI lần. Xem mô tả "tranh" trong câu hỏi, nghe, rồi chọn √ (khớp) hoặc × (không khớp).',
      lines: [
        { who: 'Câu 1', voice: 'zh-nu', text: '{妈妈|māma}', ro: 'māma', vi: 'mẹ' },
        { who: 'Câu 2', voice: 'zh-nam', text: '{四|sì}', ro: 'sì', vi: 'bốn' },
        { who: 'Câu 3', voice: 'zh-nu', text: '{再见|zàijiàn}', ro: 'zàijiàn', vi: 'tạm biệt' },
        { who: 'Câu 4', voice: 'zh-nam', text: '{医生|yīshēng}', ro: 'yīshēng', vi: 'bác sĩ' },
        { who: 'Câu 5', voice: 'zh-nu', text: '{中国|Zhōngguó}', ro: 'Zhōngguó', vi: 'Trung Quốc' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-kt-q1',
      title: 'Phần 1 — chọn √ hoặc ×',
      items: [
        m('Câu 1 — Tranh: một người phụ nữ đang bế em bé.', ['√ Đúng', '× Sai'], 0, '妈妈 = mẹ → khớp. (Bài 4)'),
        m('Câu 2 — Tranh: tờ lịch ghi số 10.', ['√ Đúng', '× Sai'], 1, 'Nghe sì (四 = 4), không phải shí (十 = 10). (Bài 0 · Bài 5)'),
        m('Câu 3 — Tranh: hai người vẫy tay chia tay ở cổng trường.', ['√ Đúng', '× Sai'], 0, '再见 = tạm biệt. (Bài 1)'),
        m('Câu 4 — Tranh: một cô giáo đứng trước bảng đen.', ['√ Đúng', '× Sai'], 1, '医生 = bác sĩ, không phải giáo viên (老师). (Bài 4)'),
        m('Câu 5 — Tranh: Vạn Lý Trường Thành.', ['√ Đúng', '× Sai'], 0, '中国 = Trung Quốc → khớp. (Bài 3)'),
      ],
    },

    { t: 'h', text: 'Phần 2 (câu 6–10): Nghe câu — chọn tranh' },
    {
      t: 'listen',
      id: 'b5-kt-nghe-2',
      title: 'Phần 2 — năm câu',
      note: 'Mỗi câu đọc HAI lần. Chọn "tranh" (A, B, C) khớp với câu nghe được.',
      lines: [
        { who: 'Câu 6', voice: 'zh-nu', text: '{我|wǒ}{是|shì}{越南|Yuènán}{人|rén}。', ro: 'Wǒ shì Yuènán rén.', vi: 'Tôi là người Việt Nam.' },
        { who: 'Câu 7', voice: 'zh-nam', text: '{我|wǒ}{家|jiā}{有|yǒu}{三|sān}{口|kǒu}{人|rén}。', ro: 'Wǒ jiā yǒu sān kǒu rén.', vi: 'Nhà tôi có ba người.' },
        { who: 'Câu 8', voice: 'zh-nu', text: '{对不起|duìbuqǐ}！', ro: 'Duìbuqǐ!', vi: 'Xin lỗi!' },
        { who: 'Câu 9', voice: 'zh-nam', text: '{她|tā}{是|shì}{我|wǒ}{姐姐|jiějie}。', ro: 'Tā shì wǒ jiějie.', vi: 'Cô ấy là chị gái tôi.' },
        { who: 'Câu 10', voice: 'zh-nu', text: '{我|wǒ}{叫|jiào}{王明|Wáng Míng}，{我|wǒ}{是|shì}{学生|xuésheng}。', ro: 'Wǒ jiào Wáng Míng, wǒ shì xuésheng.', vi: 'Tôi tên là Vương Minh, tôi là sinh viên.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-kt-q2',
      title: 'Phần 2 — chọn tranh A / B / C',
      items: [
        m('Câu 6:', ['A. Cô gái cầm lá cờ đỏ sao vàng', 'B. Cô gái cầm lá cờ đỏ năm sao vàng nhỏ', 'C. Cô gái cầm lá cờ sao và sọc'], 0, '越南人 — cờ đỏ sao vàng là cờ Việt Nam. (Bài 3)'),
        m('Câu 7:', ['A. Ảnh gia đình 2 người', 'B. Ảnh gia đình 3 người: bố, mẹ, một con', 'C. Ảnh gia đình 5 người'], 1, '三口人 — ba người. (Bài 4)'),
        m('Câu 8:', ['A. Một người tặng quà', 'B. Một người lỡ va vào người khác', 'C. Hai người chào buổi sáng'], 1, '对不起 — xin lỗi. (Bài 1)'),
        m('Câu 9:', ['A. Một cậu bé', 'B. Một người đàn ông lớn tuổi', 'C. Một cô gái trẻ'], 2, '姐姐 = chị gái → người nữ trẻ. (Bài 4)'),
        m('Câu 10:', ['A. Nam sinh viên đeo ba lô, cầm sách', 'B. Ông bác sĩ', 'C. Cô giáo'], 0, '我是学生 — sinh viên, tên 王明 (nam). (Bài 2)'),
      ],
    },

    { t: 'h', text: 'Phần 3 (câu 11–15): Nghe hội thoại' },
    {
      t: 'listen',
      id: 'b5-kt-nghe-3',
      title: 'Phần 3 — năm đoạn hội thoại ngắn',
      note: 'Mỗi đoạn đọc HAI lần: một người hỏi, một người đáp.',
      lines: [
        { who: 'Câu 11 — Nam', voice: 'zh-nam', text: '{你|nǐ}{叫|jiào}{什么|shénme}{名字|míngzi}？', ro: 'Nǐ jiào shénme míngzi?', vi: 'Bạn tên là gì?' },
        { who: 'Câu 11 — Nữ', voice: 'zh-nu', text: '{我|wǒ}{叫|jiào}{安娜|Ānnà}。', ro: 'Wǒ jiào Ānnà.', vi: 'Tôi tên là Anna.' },
        { who: 'Câu 12 — Nữ', voice: 'zh-nu', text: '{你|nǐ}{是|shì}{美国|Měiguó}{人|rén}{吗|ma}？', ro: 'Nǐ shì Měiguó rén ma?', vi: 'Bạn là người Mỹ à?' },
        { who: 'Câu 12 — Nam', voice: 'zh-nam', text: '{不|bú}{是|shì}，{我|wǒ}{是|shì}{中国|Zhōngguó}{人|rén}。', ro: 'Bú shì, wǒ shì Zhōngguó rén.', vi: 'Không phải, tôi là người Trung Quốc.' },
        { who: 'Câu 13 — Nam', voice: 'zh-nam', text: '{你|nǐ}{有|yǒu}{几|jǐ}{个|ge}{哥哥|gēge}？', ro: 'Nǐ yǒu jǐ ge gēge?', vi: 'Bạn có mấy anh trai?' },
        { who: 'Câu 13 — Nữ', voice: 'zh-nu', text: '{两|liǎng}{个|ge}。{我|wǒ}{没有|méiyǒu}{弟弟|dìdi}。', ro: 'Liǎng ge. Wǒ méiyǒu dìdi.', vi: 'Hai người. Tôi không có em trai.' },
        { who: 'Câu 14 — Nữ', voice: 'zh-nu', text: '{你|nǐ}{的|de}{手机号|shǒujīhào}{是|shì}{多少|duōshao}？', ro: 'Nǐ de shǒujīhào shì duōshao?', vi: 'Số di động của bạn là bao nhiêu?' },
        { who: 'Câu 14 — Nam', voice: 'zh-nam', text: '{一|yāo}{三|sān}{七|qī}，{八|bā}{零|líng}{六|liù}{二|èr}，{五|wǔ}{九|jiǔ}{一|yāo}{四|sì}。', ro: 'Yāo sān qī, bā líng liù èr, wǔ jiǔ yāo sì.', vi: '137 8062 5914.' },
        { who: 'Câu 15 — Nam', voice: 'zh-nam', text: '{老师|lǎoshī}，{您|nín}{好|hǎo}！{您|nín}{忙|máng}{吗|ma}？', ro: 'Lǎoshī, nín hǎo! Nín máng ma?', vi: 'Em chào cô! Cô có bận không ạ?' },
        { who: 'Câu 15 — Nữ', voice: 'zh-nu', text: '{我|wǒ}{不|bù}{忙|máng}，{谢谢|xièxie}。', ro: 'Wǒ bù máng, xièxie.', vi: 'Cô không bận, cảm ơn em.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-kt-q3',
      title: 'Phần 3 — chọn đáp án',
      items: [
        m('Câu 11: Người nữ tên là gì?', ['兰兰', '安娜', '王明'], 1, '我叫安娜。(Bài 2)'),
        m('Câu 12: Người nam là người nước nào?', ['美国人', '越南人', '中国人'], 2, '不是，我是中国人。(Bài 3)'),
        m('Câu 13: Người nữ có…', ['hai anh trai, không có em trai', 'hai em trai', 'một anh trai, một em trai'], 0, '两个（哥哥）。我没有弟弟。(Bài 4)'),
        m('Câu 14: Số di động của người nam là:', ['137 8062 5914', '173 8062 5914', '137 8026 5914'], 0, 'yāo sān qī = 137; bā líng liù èr = 8062; wǔ jiǔ yāo sì = 5914. (Bài 5)'),
        m('Câu 15: Cô giáo thế nào?', ['很忙', '不忙', '很冷'], 1, '我不忙，谢谢。(Bài 1)'),
      ],
    },

    { t: 'h', text: 'Phần 4 (câu 16–20): Nghe đoạn — trả lời câu hỏi' },
    {
      t: 'listen',
      id: 'b5-kt-nghe-4',
      title: 'Phần 4 — năm đoạn ngắn',
      note: 'Mỗi đoạn đọc HAI lần, sau đó là câu hỏi bắt đầu bằng 问 wèn (= hỏi) — đúng như băng đề HSK. Chọn 1 trong 3 đáp án.',
      lines: [
        { who: 'Câu 16', voice: 'zh-nam', text: '{我|wǒ}{叫|jiào}{大伟|Dàwěi}，{我|wǒ}{是|shì}{美国|Měiguó}{人|rén}。{问|wèn}：{大伟|Dàwěi}{是|shì}{哪|nǎ}{国|guó}{人|rén}？', ro: 'Wǒ jiào Dàwěi, wǒ shì Měiguó rén. Wèn: Dàwěi shì nǎ guó rén?', vi: 'Tôi tên là Đại Vĩ, tôi là người Mỹ. Hỏi: Đại Vĩ là người nước nào?' },
        { who: 'Câu 17', voice: 'zh-nu', text: '{王明|Wáng Míng}{家|jiā}{有|yǒu}{三|sān}{口|kǒu}{人|rén}，{他|tā}{没有|méiyǒu}{哥哥|gēge}，{也|yě}{没有|méiyǒu}{姐姐|jiějie}。{问|wèn}：{王明|Wáng Míng}{有|yǒu}{哥哥|gēge}{吗|ma}？', ro: 'Wáng Míng jiā yǒu sān kǒu rén, tā méiyǒu gēge, yě méiyǒu jiějie. Wèn: Wáng Míng yǒu gēge ma?', vi: 'Nhà Vương Minh có ba người, cậu ấy không có anh trai, cũng không có chị gái. Hỏi: Vương Minh có anh trai không?' },
        { who: 'Câu 18', voice: 'zh-nu', text: '{小美|Xiǎoměi}{今年|jīnnián}{六|liù}{岁|suì}，{她|tā}{哥哥|gēge}{十|shí}{岁|suì}。{问|wèn}：{小美|Xiǎoměi}{的|de}{哥哥|gēge}{几|jǐ}{岁|suì}？', ro: 'Xiǎoměi jīnnián liù suì, tā gēge shí suì. Wèn: Xiǎoměi de gēge jǐ suì?', vi: 'Năm nay Tiểu Mỹ sáu tuổi, anh trai bé mười tuổi. Hỏi: Anh trai Tiểu Mỹ mấy tuổi?' },
        { who: 'Câu 19', voice: 'zh-nu', text: '{你们|nǐmen}{好|hǎo}！{我|wǒ}{姓|xìng}{李|Lǐ}，{我|wǒ}{是|shì}{你们|nǐmen}{的|de}{老师|lǎoshī}。{问|wèn}：{她|tā}{姓|xìng}{什么|shénme}？', ro: 'Nǐmen hǎo! Wǒ xìng Lǐ, wǒ shì nǐmen de lǎoshī. Wèn: Tā xìng shénme?', vi: 'Chào các em! Cô họ Lý, cô là giáo viên của các em. Hỏi: Cô ấy họ gì?' },
        { who: 'Câu 20', voice: 'zh-nam', text: '{我|wǒ}{十四|shísì}{岁|suì}，{我|wǒ}{妹妹|mèimei}{四|sì}{岁|suì}。{问|wèn}：{他|tā}{妹妹|mèimei}{几|jǐ}{岁|suì}？', ro: 'Wǒ shísì suì, wǒ mèimei sì suì. Wèn: Tā mèimei jǐ suì?', vi: 'Tôi mười bốn tuổi, em gái tôi bốn tuổi. Hỏi: Em gái cậu ấy mấy tuổi?' },
      ],
    },
    {
      t: 'mcq',
      id: 'b5-kt-q4',
      title: 'Phần 4 — chọn đáp án',
      items: [
        m('Câu 16: 大伟是哪国人？', ['中国人', '美国人', '越南人'], 1, '我是美国人。(Bài 3)'),
        m('Câu 17: 王明有哥哥吗？', ['有一个', '有两个', '没有'], 2, '他没有哥哥。(Bài 4)'),
        m('Câu 18: 小美的哥哥几岁？', ['六岁', '十岁', '十六岁'], 1, '她哥哥十岁。(Bài 5)'),
        m('Câu 19: 她姓什么？', ['姓王', '姓李', '姓安'], 1, '我姓李。(Bài 2)'),
        m('Câu 20: 他妹妹几岁？', ['四岁', '十岁', '十四岁'], 0, '我十四岁，我妹妹四岁 — nghe kỹ sì / shísì. (Bài 0 · Bài 5)'),
      ],
    },

    /* ── 阅读 ── */
    { t: 'h', text: '二、阅读 — Phần 5 (câu 21–25): Từ và tranh — đúng hay sai?' },
    {
      t: 'mcq',
      id: 'b5-kt-q5',
      title: 'Phần 5 — chọn √ hoặc ×',
      items: [
        m('Câu 21 — Từ: **医生** · Tranh: người mặc áo blouse trắng, đeo ống nghe.', ['√ Đúng', '× Sai'], 0, '医生 = bác sĩ. (Bài 4)'),
        m('Câu 22 — Từ: **六** · Tranh: con số 9.', ['√ Đúng', '× Sai'], 1, '六 = 6, không phải 9 (九). (Bài 5)'),
        m('Câu 23 — Từ: **学生** · Tranh: cô giáo đang giảng bài trên bục.', ['√ Đúng', '× Sai'], 1, '学生 = học sinh/sinh viên; cô giáo là 老师. (Bài 2)'),
        m('Câu 24 — Từ: **妹妹** · Tranh: một bé gái đang cười.', ['√ Đúng', '× Sai'], 0, '妹妹 = em gái. (Bài 4)'),
        m('Câu 25 — Từ: **冷** · Tranh: một người mặc áo phao dày, run cầm cập giữa tuyết.', ['√ Đúng', '× Sai'], 0, '冷 = lạnh. (Bài 1)'),
      ],
    },

    { t: 'h', text: 'Phần 6 (câu 26–30): Pinyin và thanh điệu' },
    {
      t: 'mcq',
      id: 'b5-kt-q6',
      title: 'Phần 6 — chọn đáp án đúng (ôn Bài 0)',
      items: [
        m('Câu 26 — 你好 **đọc thực tế** là:', ['nǐ hǎo', 'ní hǎo', 'nì hǎo', 'nǐ háo'], 1, 'Thanh 3 + thanh 3 → chữ đầu đọc thanh 2: ní hǎo. (Bài 0)'),
        m('Câu 27 — 不是 đọc là:', ['bù shì', 'bú shì', 'bǔ shì', 'bū shì'], 1, '不 trước thanh 4 → bú. (Bài 0 · Bài 3)'),
        m('Câu 28 — 中国 viết pinyin đúng là:', ['Zōngguó', 'Zhōngguó', 'Zhōngguǒ', 'Jōngguó'], 1, 'zh uốn lưỡi; 国 thanh 2. (Bài 0 · Bài 3)'),
        m('Câu 29 — Chữ nào mang **thanh 3**?', ['他 tā', '是 shì', '好 hǎo', '人 rén'], 2, 'hǎo — dấu ˇ là thanh 3. (Bài 0)'),
        m('Câu 30 — 谢谢 đọc thế nào?', ['xièxiè — hai thanh 4 rõ', 'xièxie — chữ sau đọc nhẹ', 'xiéxie', 'xiēxie'], 1, 'Chữ lặp sau đọc thanh nhẹ. (Bài 0 · Bài 1)'),
      ],
    },

    { t: 'h', text: 'Phần 7 (câu 31–35): Câu hỏi — câu trả lời' },
    {
      t: 'p',
      text: 'Năm câu hỏi dưới đây, mỗi câu chọn **câu trả lời phù hợp nhất** (trong đề thật: nối cột trái với cột phải A–F).',
    },
    {
      t: 'mcq',
      id: 'b5-kt-q7',
      title: 'Phần 7 — chọn câu trả lời',
      items: [
        m('Câu 31 — 你叫什么名字？', ['我是越南人。', '我叫兰兰。', '我很好。', '五口人。'], 1, 'Hỏi tên → 我叫…。(Bài 2)'),
        m('Câu 32 — 你是哪国人？', ['我是越南人。', '我是学生。', '我叫兰兰。', '我二十岁。'], 0, 'Hỏi quốc tịch → 我是…人。(Bài 3)'),
        m('Câu 33 — 你家有几口人？', ['我有哥哥。', '五口人。', '两个。', '我很好。'], 1, 'Hỏi số người trong nhà → …口人。(Bài 4)'),
        m('Câu 34 — 谢谢你！', ['没关系。', '不客气。', '对不起。', '再见！'], 1, 'Cảm ơn → 不客气。(Bài 1)'),
        m('Câu 35 — 你今年多大？', ['我今年二十岁。', '我今年两个。', '我是二十。', '我家有二十口人。'], 0, 'Hỏi tuổi → S + 今年 + số + 岁。(Bài 5)'),
      ],
    },

    { t: 'h', text: 'Phần 8 (câu 36–40): Chọn từ điền vào chỗ trống' },
    {
      t: 'mcq',
      id: 'b5-kt-q8',
      title: 'Phần 8 — chọn từ đúng cho （　）',
      items: [
        m('Câu 36 — 我（　）有姐姐。', ['不', '没', '很', '也'], 1, 'Phủ định 有 → 没有. (Bài 4)'),
        m('Câu 37 — 他是美国人，我（　）是美国人。', ['也', '呢', '吗', '的'], 0, '也 = cũng. (Bài 3)'),
        m('Câu 38 — 你（　）什么名字？', ['是', '叫', '姓', '有'], 1, '你叫什么名字？(Bài 2)'),
        m('Câu 39 — 我有（　）个弟弟。', ['二', '两', '几', '多'], 1, 'Trước lượng từ → 两. (Bài 5)'),
        m('Câu 40 — 你好（　）？— 我很好。', ['呢', '吗', '的', '谁'], 1, 'Câu hỏi có/không → 吗. (Bài 1)'),
      ],
    },

    /* ── Chấm điểm ── */
    { t: 'h', text: 'Chấm điểm và kết luận' },
    {
      t: 'table',
      caption: 'Thang điểm — mỗi câu 5 điểm (giống HSK 1 thật: Nghe 100 + Đọc 100 = 200)',
      head: ['Số câu đúng', 'Điểm', 'Mức', 'Làm gì tiếp'],
      rows: [
        ['36–40', '180–200', '⭐ Xuất sắc', 'Sang chặng 2 (Bài 6). Thử nói lại toàn bộ phần Nói Bài 1–5 với 📞 CuongMini cho nhuyễn.'],
        ['28–35', '140–175', '✅ Đạt (≥ 70%)', 'Sang chặng 2. Trước đó xem bảng dưới: bài nào sai ≥ 2 câu thì làm lại phần Bài tập của bài đó.'],
        ['24–27', '120–135', '⚠️ Đạt chuẩn HSK thật (≥ 120) nhưng dưới chuẩn khoá', 'Ôn lại các bài sai ≥ 2 câu (bảng dưới), rồi làm lại đề này.'],
        ['0–23', '0–115', '❌ Chưa đạt (< 60%)', 'Học lại theo bảng dưới, bắt đầu từ bài có nhiều câu sai nhất. Nghe sai nhiều → làm lại Bài 0 (thanh điệu) trước.'],
      ],
    },
    {
      t: 'table',
      caption: 'Sai câu nào — ôn bài nào (dưới 70% ôn lại theo bảng này)',
      head: ['Bài', 'Nội dung', 'Các câu kiểm tra bài đó', 'Sai ≥ 2 câu → ôn lại'],
      rows: [
        ['Bài 0', 'Pinyin, thanh điệu, biến điệu', '2, 20, 26, 27, 28, 29, 30', 'Mục biến điệu (3+3, 不, 一) + cặp dễ nhầm s/sh, z/zh'],
        ['Bài 1', 'Chào hỏi, 很 + tính từ, 吗, cảm ơn – xin lỗi', '3, 8, 15, 25, 30, 34, 40', 'Ngữ pháp ③④ + bảng "hỏi gì đáp gì"'],
        ['Bài 2', 'Tên, họ, 叫 / 姓 / 是, 什么', '10, 11, 19, 23, 31, 38', 'Ngữ pháp 叫/姓/是 + hội thoại làm quen'],
        ['Bài 3', 'Quốc tịch, 哪国人, 不是, 也, 呢', '5, 6, 12, 16, 27, 28, 32, 37', 'Ngữ pháp 不是 / 也 / 呢'],
        ['Bài 4', 'Gia đình, 有 / 没有, 几, 个 / 口, 的', '1, 4, 7, 9, 13, 17, 21, 24, 33, 36', 'Ngữ pháp ① 有/没有, ② lượng từ, ⑤ 的'],
        ['Bài 5', 'Số 0–99, 二 / 两, tuổi, số điện thoại', '2, 14, 18, 20, 22, 35, 39', 'Ngữ pháp ② 二/两, ④ tuổi; Nghe bài 1 (số)'],
      ],
    },
    {
      t: 'note',
      title: 'Lời khuyên sau bài kiểm tra',
      items: [
        'Một số câu kiểm tra **hai bài cùng lúc** (vd. câu 20: nghe sì/shí của Bài 0 trong câu nói tuổi của Bài 5) — vì vậy tổng ở bảng trên nhiều hơn 40.',
        '**Sai phần Nghe nhiều hơn phần Đọc?** Vấn đề thường là **thanh điệu**: mở lại Bài 0, luyện cặp 妈麻马骂 và "四是四，十是十" mỗi ngày 5 phút trước khi học tiếp.',
        '**Sai phần Đọc nhiều?** Học lại chữ Hán theo bảng ở mục Chữ Hán của từng bài, làm lại các khối "Đọc chữ trần".',
        'Làm lại đề này sau **3–4 ngày** (không xem đáp án trước). Đạt ≥ 140 điểm hai lần liền là đủ vững để sang chặng 2.',
      ],
    },
  ],
};

export const BAI_5: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, HAN_TU, NGHE, NOI, BAI_TAP, KIEM_TRA];
