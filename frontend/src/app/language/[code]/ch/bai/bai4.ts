/**
 * Bài 4 — HSK 1 · 我的家: gia đình, 有/没有, 几, 的 (sở hữu), lượng từ 个/口 (khoá CH).
 *
 * Phạm vi: từ Bài 1–3 (chào hỏi, 很 + Adj, 吗, 叫/姓/名字/什么/是, 哪国人/不是/也/呢) +
 * từ gia đình; 有/没有 (KHÔNG có 不有), câu hỏi 几 + lượng từ, 个 và 口 (家有几口人),
 * 的 sở hữu và khi nào được bỏ 的 (我爸爸, 我家), 谁, 和 nối danh từ. Số 1–10 xem trước
 * (Bài 5 học kỹ số đếm, 二/两, tuổi). Từ ngoài HSK 1 ghi "(từ mở rộng)".
 *
 * Quy ước pinyin như Bài 0–1: 3+3 ghi theo từ điển (你好 nǐ hǎo, 有几 yǒu jǐ); 不 và 一 ghi
 * theo cách đọc (不是 bú shì, 一个 yí ge, 一口 yì kǒu). Lượng từ 个 sau số đọc nhẹ: ge.
 * Nhân vật: 兰兰 Lan (a, nữ) · 王明 Vương Minh (b, nam) · 李老师 cô Lý (c, nữ) ·
 * 大伟 Đại Vĩ (b, nam) · 安娜 Anna (c, nữ) · 老板 bà chủ quầy (c, nữ).
 * Gia đình cố định cho cả khoá: Lan — 5 người (bố bác sĩ, mẹ giáo viên, anh trai, em gái);
 * Vương Minh — con một (bố giáo viên, mẹ bác sĩ); Đại Vĩ — 6 người (2 chị, 1 em trai);
 * Anna — 4 người (1 anh trai); bà chủ quầy — chồng cũng là chủ quán, 1 con trai, 1 con gái.
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
  id: 'b4-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại: 我的家 — Nhà bạn có mấy người?',
  goal: 'Giới thiệu gia đình mình (nhà có mấy người, có anh chị em không, bố mẹ làm gì), hỏi lại gia đình người khác và hỏi "người này là ai?".',
  minutes: 35,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Bài 4 học gì',
      items: [
        'Người trong nhà: **爸爸 · 妈妈 · 哥哥 · 姐姐 · 弟弟 · 妹妹 · 儿子 · 女儿 · 孩子**.',
        'Có / không có: **我有一个哥哥。** · **我没有姐姐。** — phủ định của 有 luôn là **没有**, không bao giờ là ~~不有~~.',
        'Hỏi số lượng nhỏ: **你有几个姐姐？** — 几 + **lượng từ** + danh từ.',
        'Hỏi số người trong nhà: **你家有几口人？** — **我家有五口人。** (口 chỉ dùng trong câu đếm người nhà).',
        'Sở hữu: **我的名字 · 王明的妈妈** — nhưng với người thân thì bỏ 的: **我爸爸 · 我家**.',
        'Hỏi "ai": **他是谁？** — **他是我哥哥。** · nối danh từ bằng **和**: 爸爸、妈妈和我.',
      ],
    },
    { t: 'h', text: 'Học xong Bài 4 bạn làm được gì' },
    {
      t: 'table',
      head: ['Tình huống', 'Bạn làm được', 'Câu then chốt'],
      rows: [
        ['1. Xem ảnh gia đình ở ký túc xá', 'Hỏi "người này là ai", kể nhà có mấy người, có/không có anh chị em', '他是谁？我家有五口人。我没有姐姐。'],
        ['2. Trong lớp học', 'Trả lời cô giáo: có mấy anh chị em, bố mẹ làm nghề gì', '你有几个姐姐？我有两个姐姐，一个弟弟。'],
        ['3. Ở quán ăn gần trường', 'Hỏi thăm gia đình người lớn tuổi một cách lịch sự', '您有几个孩子？他们是我的孩子。'],
      ],
    },
    {
      t: 'p',
      text: 'Cách học phần này: đọc **bối cảnh** → bấm nghe cả đoạn → bấm từng câu, đọc to theo 3 lần → tắt pinyin và tự đọc lại. Bài này có nhiều từ **lặp chữ** (爸爸, 妈妈, 哥哥…): chữ thứ hai luôn đọc **nhẹ và ngắn** — bàba, māma, gēge.',
    },

    /* ── Tình huống 1 ── */
    { t: 'h', text: 'Tình huống 1 — Xem ảnh gia đình ở ký túc xá' },
    {
      t: 'p',
      text: '**Bối cảnh.** Buổi tối, Vương Minh sang phòng Lan mượn sách. Trên bàn của Lan có một tấm ảnh gia đình chụp ở Hà Nội. Vương Minh tò mò hỏi từng người trong ảnh.',
    },
    {
      t: 'dialogue',
      title: '他是谁？— Anh ấy là ai?',
      lines: [
        { who: '王明 Vương Minh', role: 'b', text: '{兰兰|Lánlan}，{他|tā}{是|shì}{谁|shéi}？', ro: 'Lánlan, tā shì shéi?', vi: 'Lan ơi, anh này là ai thế?' },
        { who: '兰兰 Lan', role: 'a', text: '{他|tā}{是|shì}{我|wǒ}{哥哥|gēge}。', ro: 'Tā shì wǒ gēge.', vi: 'Anh ấy là anh trai mình.' },
        { who: '王明 Vương Minh', role: 'b', text: '{她|tā}{呢|ne}？', ro: 'Tā ne?', vi: 'Còn cô bé này?' },
        { who: '兰兰 Lan', role: 'a', text: '{她|tā}{是|shì}{我|wǒ}{妹妹|mèimei}。', ro: 'Tā shì wǒ mèimei.', vi: 'Em ấy là em gái mình.' },
        { who: '王明 Vương Minh', role: 'b', text: '{你|nǐ}{家|jiā}{有|yǒu}{几|jǐ}{口|kǒu}{人|rén}？', ro: 'Nǐ jiā yǒu jǐ kǒu rén?', vi: 'Nhà bạn có mấy người?' },
        { who: '兰兰 Lan', role: 'a', text: '{我|wǒ}{家|jiā}{有|yǒu}{五|wǔ}{口|kǒu}{人|rén}：{爸爸|bàba}、{妈妈|māma}、{哥哥|gēge}、{妹妹|mèimei}{和|hé}{我|wǒ}。', ro: 'Wǒ jiā yǒu wǔ kǒu rén: bàba, māma, gēge, mèimei hé wǒ.', vi: 'Nhà mình có năm người: bố, mẹ, anh trai, em gái và mình.' },
        { who: '王明 Vương Minh', role: 'b', text: '{你|nǐ}{有|yǒu}{姐姐|jiějie}{吗|ma}？', ro: 'Nǐ yǒu jiějie ma?', vi: 'Bạn có chị gái không?' },
        { who: '兰兰 Lan', role: 'a', text: '{我|wǒ}{没有|méiyǒu}{姐姐|jiějie}。{你|nǐ}{呢|ne}？{你|nǐ}{有|yǒu}{哥哥|gēge}{吗|ma}？', ro: 'Wǒ méiyǒu jiějie. Nǐ ne? Nǐ yǒu gēge ma?', vi: 'Mình không có chị gái. Còn bạn? Bạn có anh trai không?' },
        { who: '王明 Vương Minh', role: 'b', text: '{我|wǒ}{没有|méiyǒu}{哥哥|gēge}，{也|yě}{没有|méiyǒu}{妹妹|mèimei}。{我|wǒ}{家|jiā}{有|yǒu}{三|sān}{口|kǒu}{人|rén}：{爸爸|bàba}、{妈妈|māma}{和|hé}{我|wǒ}。', ro: 'Wǒ méiyǒu gēge, yě méiyǒu mèimei. Wǒ jiā yǒu sān kǒu rén: bàba, māma hé wǒ.', vi: 'Mình không có anh trai, cũng không có em gái. Nhà mình có ba người: bố, mẹ và mình.' },
        { who: '兰兰 Lan', role: 'a', text: '{你|nǐ}{爸爸|bàba}{是|shì}{医生|yīshēng}{吗|ma}？', ro: 'Nǐ bàba shì yīshēng ma?', vi: 'Bố bạn là bác sĩ à?' },
        { who: '王明 Vương Minh', role: 'b', text: '{不|bú}{是|shì}，{他|tā}{是|shì}{老师|lǎoshī}。{我|wǒ}{妈妈|māma}{是|shì}{医生|yīshēng}。', ro: 'Bú shì, tā shì lǎoshī. Wǒ māma shì yīshēng.', vi: 'Không phải, bố mình là giáo viên. Mẹ mình mới là bác sĩ.' },
        { who: '兰兰 Lan', role: 'a', text: '{我|wǒ}{爸爸|bàba}{是|shì}{医生|yīshēng}，{我|wǒ}{妈妈|māma}{是|shì}{老师|lǎoshī}！', ro: 'Wǒ bàba shì yīshēng, wǒ māma shì lǎoshī!', vi: 'Bố mình là bác sĩ, mẹ mình là giáo viên — ngược với nhà bạn!' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong tình huống 1',
      items: [
        '**他是谁？** — 谁 shéi = ai. Câu hỏi có từ để hỏi **giữ nguyên trật tự câu kể**: 他是**我哥哥** → 他是**谁**？ Thay phần muốn hỏi bằng 谁, không đảo gì cả. (Một số người đọc **shuí** — cũng đúng, nhưng shéi phổ biến hơn trong khẩu ngữ.)',
        '**她呢？** — 呢 (Bài 3) hỏi lại "còn … thì sao?" — ở đây nghĩa là "Còn cô bé này (là ai)?"',
        '**我家有五口人** — "nhà tôi có năm **khẩu**". 口 kǒu (miệng) là lượng từ đếm **người trong gia đình** — giống "nhân khẩu" trong tiếng Việt. Số người tính **cả bản thân mình**.',
        '**我没有姐姐** — phủ định của 有 là **没有** méiyǒu. Đây là quy tắc tuyệt đối: ~~我不有姐姐~~ là sai.',
        '**我哥哥, 我妹妹, 我爸爸** — với người thân, người Trung Quốc **bỏ 的**: không cần nói 我的哥哥. Học kỹ ở phần Ngữ pháp.',
        '**爸爸、妈妈和我** — liệt kê dùng dấu **、** (dấu phẩy nhỏ — 顿号 dùnhào) giữa các danh từ, và **和** hé (và) trước danh từ cuối cùng.',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{他|tā}{是|shì}{谁|shéi}？', ro: 'Tā shì shéi?', vi: 'Anh ấy là ai?' },
        { en: '{她|tā}{是|shì}{我|wǒ}{妹妹|mèimei}。', ro: 'Tā shì wǒ mèimei.', vi: 'Em ấy là em gái tôi.' },
        { en: '{你|nǐ}{家|jiā}{有|yǒu}{几|jǐ}{口|kǒu}{人|rén}？', ro: 'Nǐ jiā yǒu jǐ kǒu rén?', vi: 'Nhà bạn có mấy người?' },
        { en: '{我|wǒ}{家|jiā}{有|yǒu}{五|wǔ}{口|kǒu}{人|rén}。', ro: 'Wǒ jiā yǒu wǔ kǒu rén.', vi: 'Nhà tôi có năm người.' },
        { en: '{我|wǒ}{没有|méiyǒu}{姐姐|jiějie}。', ro: 'Wǒ méiyǒu jiějie.', vi: 'Tôi không có chị gái.' },
        { en: '{我|wǒ}{爸爸|bàba}{是|shì}{医生|yīshēng}。', ro: 'Wǒ bàba shì yīshēng.', vi: 'Bố tôi là bác sĩ.' },
      ],
    },

    /* ── Tình huống 2 ── */
    { t: 'h', text: 'Tình huống 2 — Trong lớp: "Gia đình của em"' },
    {
      t: 'p',
      text: '**Bối cảnh.** Hôm nay lớp học chủ đề gia đình. Cô Lý lần lượt hỏi Đại Vĩ (người Mỹ) và Anna (người Nga) về nhà của các bạn. Nhà Đại Vĩ đông người nhất lớp.',
    },
    {
      t: 'dialogue',
      title: '你有几个姐姐？— Em có mấy chị gái?',
      lines: [
        { who: '李老师 Cô Lý', role: 'c', text: '{大伟|Dàwěi}，{你|nǐ}{家|jiā}{有|yǒu}{几|jǐ}{口|kǒu}{人|rén}？', ro: 'Dàwěi, nǐ jiā yǒu jǐ kǒu rén?', vi: 'Đại Vĩ, nhà em có mấy người?' },
        { who: '大伟 Đại Vĩ', role: 'b', text: '{我|wǒ}{家|jiā}{有|yǒu}{六|liù}{口|kǒu}{人|rén}。', ro: 'Wǒ jiā yǒu liù kǒu rén.', vi: 'Nhà em có sáu người ạ.' },
        { who: '李老师 Cô Lý', role: 'c', text: '{你|nǐ}{有|yǒu}{姐姐|jiějie}{吗|ma}？', ro: 'Nǐ yǒu jiějie ma?', vi: 'Em có chị gái không?' },
        { who: '大伟 Đại Vĩ', role: 'b', text: '{有|yǒu}。{我|wǒ}{有|yǒu}{两|liǎng}{个|ge}{姐姐|jiějie}，{一|yí}{个|ge}{弟弟|dìdi}。', ro: 'Yǒu. Wǒ yǒu liǎng ge jiějie, yí ge dìdi.', vi: 'Có ạ. Em có hai chị gái và một em trai.' },
        { who: '李老师 Cô Lý', role: 'c', text: '{你|nǐ}{弟弟|dìdi}{是|shì}{学生|xuésheng}{吗|ma}？', ro: 'Nǐ dìdi shì xuésheng ma?', vi: 'Em trai em là học sinh à?' },
        { who: '大伟 Đại Vĩ', role: 'b', text: '{是|shì}，{他|tā}{是|shì}{学生|xuésheng}。{我|wǒ}{姐姐|jiějie}{是|shì}{医生|yīshēng}。', ro: 'Shì, tā shì xuésheng. Wǒ jiějie shì yīshēng.', vi: 'Vâng, em ấy là học sinh. Chị em là bác sĩ ạ.' },
        { who: '李老师 Cô Lý', role: 'c', text: '{安娜|Ānnà}，{你|nǐ}{呢|ne}？{你|nǐ}{家|jiā}{有|yǒu}{几|jǐ}{口|kǒu}{人|rén}？', ro: 'Ānnà, nǐ ne? Nǐ jiā yǒu jǐ kǒu rén?', vi: 'Anna, còn em? Nhà em có mấy người?' },
        { who: '安娜 Anna', role: 'c', text: '{我|wǒ}{家|jiā}{有|yǒu}{四|sì}{口|kǒu}{人|rén}：{爸爸|bàba}、{妈妈|māma}、{哥哥|gēge}{和|hé}{我|wǒ}。', ro: 'Wǒ jiā yǒu sì kǒu rén: bàba, māma, gēge hé wǒ.', vi: 'Nhà em có bốn người: bố, mẹ, anh trai và em.' },
        { who: '李老师 Cô Lý', role: 'c', text: '{你|nǐ}{哥哥|gēge}{叫|jiào}{什么|shénme}{名字|míngzi}？', ro: 'Nǐ gēge jiào shénme míngzi?', vi: 'Anh trai em tên là gì?' },
        { who: '安娜 Anna', role: 'c', text: '{他|tā}{叫|jiào}{伊万|Yīwàn}。{他|tā}{的|de}{朋友|péngyou}{是|shì}{中国|Zhōngguó}{人|rén}！', ro: 'Tā jiào Yīwàn. Tā de péngyou shì Zhōngguó rén!', vi: 'Anh ấy tên là Ivan. Bạn của anh ấy là người Trung Quốc đấy ạ!' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong tình huống 2',
      items: [
        '**两个姐姐** liǎng ge jiějie — "hai chị gái". Đếm người/vật thì **số + lượng từ + danh từ**; số 2 trước lượng từ dùng **两** liǎng chứ không dùng 二 èr. (Bài 5 học kỹ 二/两.)',
        '**一个弟弟** — 一 đọc **yí** vì 个 gốc là thanh 4 (gè). Sau số, 个 đọc nhẹ: yí ge, liǎng ge, sān ge.',
        '**有。** — trả lời câu hỏi 有…吗？ ngắn gọn bằng chính động từ: **有** (có) hoặc **没有** (không có). Không trả lời bằng ~~是~~.',
        'Hỏi "mấy chị gái" dùng **几个** (个 là lượng từ chung), không dùng 口: ~~你有几口姐姐？~~ 口 chỉ dùng cho **tổng số người trong nhà**.',
        '**他的朋友** tā de péngyou — "bạn của anh ấy": 朋友 không phải người trong nhà, nên giữ **的**.',
        '**伊万** Yīwàn là cách phiên tên Ivan sang chữ Hán — tên nước ngoài được phiên theo âm.',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{我|wǒ}{家|jiā}{有|yǒu}{六|liù}{口|kǒu}{人|rén}。', ro: 'Wǒ jiā yǒu liù kǒu rén.', vi: 'Nhà tôi có sáu người.' },
        { en: '{你|nǐ}{有|yǒu}{几|jǐ}{个|ge}{姐姐|jiějie}？', ro: 'Nǐ yǒu jǐ ge jiějie?', vi: 'Bạn có mấy chị gái?' },
        { en: '{我|wǒ}{有|yǒu}{两|liǎng}{个|ge}{姐姐|jiějie}，{一|yí}{个|ge}{弟弟|dìdi}。', ro: 'Wǒ yǒu liǎng ge jiějie, yí ge dìdi.', vi: 'Tôi có hai chị gái, một em trai.' },
        { en: '{我|wǒ}{姐姐|jiějie}{是|shì}{医生|yīshēng}。', ro: 'Wǒ jiějie shì yīshēng.', vi: 'Chị tôi là bác sĩ.' },
        { en: '{他|tā}{的|de}{朋友|péngyou}{是|shì}{中国|Zhōngguó}{人|rén}。', ro: 'Tā de péngyou shì Zhōngguó rén.', vi: 'Bạn của anh ấy là người Trung Quốc.' },
      ],
    },

    /* ── Tình huống 3 ── */
    { t: 'h', text: 'Tình huống 3 — Ở quán ăn gần trường' },
    {
      t: 'p',
      text: '**Bối cảnh.** Chiều thứ Bảy, Lan ăn mì ở quán gần trường. Có hai đứa trẻ đang ngồi làm bài tập ở bàn trong góc. Lan hỏi thăm bà chủ quầy — người vẫn hay đưa thêm thìa cho Lan ở căng tin (Bài 1), giờ mở quán riêng với chồng.',
    },
    {
      t: 'dialogue',
      title: '您有几个孩子？— Cô có mấy cháu ạ?',
      lines: [
        { who: '兰兰 Lan', role: 'a', text: '{老板|lǎobǎn}，{他们|tāmen}{是|shì}{谁|shéi}？', ro: 'Lǎobǎn, tāmen shì shéi?', vi: 'Cô chủ ơi, hai bạn nhỏ kia là ai thế ạ?' },
        { who: '老板 Bà chủ quầy', role: 'c', text: '{他们|tāmen}{是|shì}{我|wǒ}{的|de}{孩子|háizi}。', ro: 'Tāmen shì wǒ de háizi.', vi: 'Chúng nó là con cô đấy.' },
        { who: '兰兰 Lan', role: 'a', text: '{您|nín}{有|yǒu}{几|jǐ}{个|ge}{孩子|háizi}？', ro: 'Nín yǒu jǐ ge háizi?', vi: 'Cô có mấy cháu ạ?' },
        { who: '老板 Bà chủ quầy', role: 'c', text: '{两|liǎng}{个|ge}。{一|yí}{个|ge}{儿子|érzi}，{一|yí}{个|ge}{女儿|nǚ\'ér}。', ro: "Liǎng ge. Yí ge érzi, yí ge nǚ'ér.", vi: 'Hai đứa. Một trai, một gái.' },
        { who: '兰兰 Lan', role: 'a', text: '{您|nín}{家|jiā}{有|yǒu}{几|jǐ}{口|kǒu}{人|rén}？', ro: 'Nín jiā yǒu jǐ kǒu rén?', vi: 'Nhà cô có mấy người ạ?' },
        { who: '老板 Bà chủ quầy', role: 'c', text: '{四|sì}{口|kǒu}{人|rén}：{我|wǒ}{先生|xiānsheng}、{儿子|érzi}、{女儿|nǚ\'ér}{和|hé}{我|wǒ}。', ro: "Sì kǒu rén: wǒ xiānsheng, érzi, nǚ'ér hé wǒ.", vi: 'Bốn người: chồng cô, con trai, con gái và cô.' },
        { who: '兰兰 Lan', role: 'a', text: '{您|nín}{先生|xiānsheng}{也|yě}{是|shì}{老板|lǎobǎn}{吗|ma}？', ro: 'Nín xiānsheng yě shì lǎobǎn ma?', vi: 'Chú cũng là chủ quán ạ?' },
        { who: '老板 Bà chủ quầy', role: 'c', text: '{是|shì}，{他|tā}{也|yě}{是|shì}{老板|lǎobǎn}。{这|zhè}{是|shì}{我们|wǒmen}{的|de}{饭馆|fànguǎn}！', ro: 'Shì, tā yě shì lǎobǎn. Zhè shì wǒmen de fànguǎn!', vi: 'Ừ, chú cũng là chủ. Đây là quán của vợ chồng cô mà!' },
        { who: '兰兰 Lan', role: 'a', text: '{您|nín}{的|de}{孩子|háizi}{很|hěn}{好|hǎo}！', ro: 'Nín de háizi hěn hǎo!', vi: 'Các cháu ngoan quá ạ!' },
        { who: '老板 Bà chủ quầy', role: 'c', text: '{谢谢|xièxie}！{同学|tóngxué}，{你|nǐ}{有|yǒu}{弟弟|dìdi}{吗|ma}？', ro: 'Xièxie! Tóngxué, nǐ yǒu dìdi ma?', vi: 'Cảm ơn cháu! Thế cháu có em trai không?' },
        { who: '兰兰 Lan', role: 'a', text: '{我|wǒ}{没有|méiyǒu}{弟弟|dìdi}，{我|wǒ}{有|yǒu}{一|yí}{个|ge}{妹妹|mèimei}。', ro: 'Wǒ méiyǒu dìdi, wǒ yǒu yí ge mèimei.', vi: 'Cháu không có em trai, cháu có một em gái ạ.' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong tình huống 3',
      items: [
        '**我的孩子** — "con của tôi". Với 孩子 có thể nói cả **我孩子** lẫn **我的孩子**; câu nhấn "của cô (chứ không phải của ai khác)" thì giữ 的 cho rõ.',
        '**我先生** wǒ xiānsheng = **chồng tôi**. 先生 (TIÊN SINH) trong tiếng Trung hiện đại là "ông, ngài" (王先生 — ông Vương) hoặc "chồng (của tôi/của cô)". **Không** dùng để gọi giáo viên như "tiên sinh" trong truyện cổ — giáo viên là 老师.',
        '**女儿** nǚ\'ér — dấu **\'** (cách âm) tách hai âm tiết để không đọc nhầm thành "nǚer". Chữ ü giữ hai chấm vì đứng sau n.',
        '**这是我们的饭馆** — 这 zhè (đây, này) sẽ học ở Bài 8; ở đây chỉ cần hiểu "đây là quán của chúng tôi". 饭馆 fànguǎn = quán ăn.',
        '**您的孩子很好** — khen con người khác "ngoan, giỏi" bằng 很好 là đủ lịch sự. Dùng **您** với người lớn tuổi hơn.',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{他们|tāmen}{是|shì}{我|wǒ}{的|de}{孩子|háizi}。', ro: 'Tāmen shì wǒ de háizi.', vi: 'Chúng nó là con tôi.' },
        { en: '{您|nín}{有|yǒu}{几|jǐ}{个|ge}{孩子|háizi}？', ro: 'Nín yǒu jǐ ge háizi?', vi: 'Ông/bà có mấy người con?' },
        { en: '{一|yí}{个|ge}{儿子|érzi}，{一|yí}{个|ge}{女儿|nǚ\'ér}。', ro: "Yí ge érzi, yí ge nǚ'ér.", vi: 'Một con trai, một con gái.' },
        { en: '{我|wǒ}{先生|xiānsheng}{也|yě}{是|shì}{老板|lǎobǎn}。', ro: 'Wǒ xiānsheng yě shì lǎobǎn.', vi: 'Chồng tôi cũng là chủ quán.' },
        { en: '{我|wǒ}{有|yǒu}{一|yí}{个|ge}{妹妹|mèimei}。', ro: 'Wǒ yǒu yí ge mèimei.', vi: 'Tôi có một em gái.' },
      ],
    },

    /* ── Văn hoá ── */
    { t: 'h', text: 'Văn hoá: gia đình Trung Quốc và cách gọi người thân' },
    {
      t: 'p',
      text: 'Từ năm 1980 đến 2015, Trung Quốc áp dụng **chính sách một con** ở phần lớn thành phố, nên rất nhiều bạn trẻ thành thị như Vương Minh là **con một** (独生子女 dúshēng zǐnǚ — từ mở rộng) và nhà chỉ có **ba người** (三口之家 — "gia đình ba khẩu"). Từ 2016 được sinh hai con, từ 2021 được sinh ba con. Vì thế khi bạn hỏi một bạn trẻ Trung Quốc 你有哥哥吗？, câu trả lời 没有 rất thường gặp — đừng ngạc nhiên.',
    },
    {
      t: 'p',
      text: 'Tiếng Trung phân biệt người thân **rõ hơn** tiếng Việt: tiếng Việt nói "em" cho cả em trai lẫn em gái, còn tiếng Trung **bắt buộc** chọn 弟弟 (em trai) hoặc 妹妹 (em gái). Họ hàng bên nội, bên ngoại cũng có tên riêng từng người — ở HSK 1 chỉ cần bảng dưới, phần họ hàng là từ mở rộng để nghe hiểu.',
    },
    {
      t: 'table',
      caption: 'Cây gia đình — 8 từ chính của bài và vài từ mở rộng',
      head: ['Quan hệ', 'Chữ Hán', 'Pinyin', 'Ghi chú'],
      rows: [
        ['bố', '爸爸', 'bàba', 'Trang trọng/viết: 父亲 fùqīn (PHỤ THÂN — từ mở rộng)'],
        ['mẹ', '妈妈', 'māma', 'Trang trọng/viết: 母亲 mǔqīn (MẪU THÂN — từ mở rộng)'],
        ['anh trai', '哥哥', 'gēge', 'Nhiều anh: 大哥 (anh cả), 二哥 (anh hai)'],
        ['chị gái', '姐姐', 'jiějie', 'Cũng dùng gọi thân mật cô gái lớn tuổi hơn một chút'],
        ['em trai', '弟弟', 'dìdi', 'Tiếng Việt chỉ nói "em" — tiếng Trung phải chọn trai/gái'],
        ['em gái', '妹妹', 'mèimei', 'Như trên'],
        ['con trai / con gái', '儿子 / 女儿', "érzi / nǚ'ér", 'Gọi chung "con, đứa trẻ": 孩子 háizi'],
        ['ông nội / bà nội', '爷爷 / 奶奶', 'yéye / nǎinai', 'Từ mở rộng — bên NỘI (bố của bố, mẹ của bố)'],
        ['ông ngoại / bà ngoại', '姥爷 / 姥姥 (miền Bắc) · 外公 / 外婆 (miền Nam)', 'lǎoye / lǎolao · wàigōng / wàipó', 'Từ mở rộng — chỉ cần nghe hiểu'],
      ],
    },
    {
      t: 'note',
      title: 'Ghi nhớ khi nói chuyện về gia đình',
      items: [
        'Người Trung Quốc hỏi về gia đình **khá sớm** khi mới quen (nhà có mấy người, bố mẹ làm gì) — đây là cách tỏ quan tâm, không phải tò mò quá đáng. Bạn có thể trả lời ngắn gọn.',
        'Gọi **bố mẹ của bạn mình**: 叔叔 shūshu (chú) và 阿姨 āyí (cô, dì) — từ mở rộng, nhưng rất lịch sự khi đến chơi nhà bạn.',
        'Cách xưng "anh, chị" với người ngoài: thanh niên hay gọi nhau 哥 / 姐 (anh / chị) cho thân mật, như ta gọi "anh ơi, chị ơi".',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{我|wǒ}{是|shì}{独生子女|dúshēng zǐnǚ}。', ro: 'Wǒ shì dúshēng zǐnǚ.', vi: 'Tôi là con một. (từ mở rộng)' },
        { en: '{叔叔|shūshu}{好|hǎo}！{阿姨|āyí}{好|hǎo}！', ro: 'Shūshu hǎo! Āyí hǎo!', vi: 'Cháu chào chú! Cháu chào cô! (khi đến nhà bạn — từ mở rộng)' },
        { en: '{我|wǒ}{爷爷|yéye}{很|hěn}{好|hǎo}。', ro: 'Wǒ yéye hěn hǎo.', vi: 'Ông nội tôi khoẻ. (từ mở rộng)' },
      ],
    },
  ],
};

/* ══════════════════════════ 2. TỪ VỰNG ══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b4-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng Bài 4 — 30 từ: người trong nhà, có/không có, đếm người, sở hữu',
  goal: 'Nghe, đọc đúng thanh và dùng được 30 từ của Bài 4 để giới thiệu gia đình và hỏi về gia đình người khác.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Ghi nhớ trước khi học',
      items: [
        '**Từ lặp chữ** (爸爸, 妈妈, 哥哥, 姐姐, 弟弟, 妹妹): chữ thứ hai đọc **thanh nhẹ** — ngắn, nhẹ, không dấu.',
        '**有** (HỮU — có) ↔ **没有** (không có). Đây là cặp phải thuộc nhất của bài.',
        '**个** và **口** là **lượng từ** (giống "cái, con, người" của tiếng Việt). Tiếng Trung đếm gì cũng phải có lượng từ.',
        '**的** (ĐÍCH) nối "người sở hữu" với "vật/người được sở hữu": 我**的**朋友 = bạn **của** tôi — trật tự **ngược** tiếng Việt.',
        'Âm Hán Việt giúp nhớ: 家 GIA (gia đình), 有 HỮU (sở hữu), 口 KHẨU (nhân khẩu), 医生 Y SINH, 朋友 BẰNG HỮU.',
      ],
    },

    { t: 'h', text: 'Nhóm 1 — Người trong gia đình (12 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{家|jiā}', pos: 'danh từ', ipa: 'jiā', vi: 'nhà, gia đình', ex: '{我|wǒ}{家|jiā}{有|yǒu}{五|wǔ}{口|kǒu}{人|rén}。', exRo: 'Wǒ jiā yǒu wǔ kǒu rén.', exVi: 'Nhà tôi có năm người.', more: 'Hán Việt: **GIA** (gia đình, quốc gia 国家). "Nhà tôi" nói **我家** — không cần 的.' },
        { w: '{爸爸|bàba}', pos: 'danh từ', ipa: 'bàba', vi: 'bố, ba', ex: '{我|wǒ}{爸爸|bàba}{是|shì}{医生|yīshēng}。', exRo: 'Wǒ bàba shì yīshēng.', exVi: 'Bố tôi là bác sĩ.', more: 'Hán Việt: BA. Chữ = 父 (cha) + 巴 (bā, gợi âm). Chữ thứ hai nhẹ: **bà**ba.' },
        { w: '{妈妈|māma}', pos: 'danh từ', ipa: 'māma', vi: 'mẹ, má', ex: '{我|wǒ}{妈妈|māma}{是|shì}{老师|lǎoshī}。', exRo: 'Wǒ māma shì lǎoshī.', exVi: 'Mẹ tôi là giáo viên.', more: 'Hán Việt: MA (mẫu). Chữ = 女 + 马 (mǎ, gợi âm). Thanh 1 cao rồi chữ sau nhẹ: **mā**ma.' },
        { w: '{哥哥|gēge}', pos: 'danh từ', ipa: 'gēge', vi: 'anh trai', ex: '{我|wǒ}{有|yǒu}{一|yí}{个|ge}{哥哥|gēge}。', exRo: 'Wǒ yǒu yí ge gēge.', exVi: 'Tôi có một anh trai.', more: 'Hán Việt: **CA** (đại ca 大哥). Chữ = 可 chồng lên 可.' },
        { w: '{姐姐|jiějie}', pos: 'danh từ', ipa: 'jiějie', vi: 'chị gái', ex: '{她|tā}{是|shì}{我|wǒ}{姐姐|jiějie}。', exRo: 'Tā shì wǒ jiějie.', exVi: 'Chị ấy là chị gái tôi.', more: 'Hán Việt: **THƯ** (tiểu thư 小姐). Thanh 3 + nhẹ: đọc **jiě** trầm rồi "jie" nhẹ, không lên giọng.' },
        { w: '{弟弟|dìdi}', pos: 'danh từ', ipa: 'dìdi', vi: 'em trai', ex: '{他|tā}{弟弟|dìdi}{是|shì}{学生|xuésheng}。', exRo: 'Tā dìdi shì xuésheng.', exVi: 'Em trai anh ấy là học sinh.', more: 'Hán Việt: **ĐỆ** (huynh đệ, đệ tử). Tiếng Việt chỉ nói "em" — tiếng Trung phải nói rõ **em trai**.' },
        { w: '{妹妹|mèimei}', pos: 'danh từ', ipa: 'mèimei', vi: 'em gái', ex: '{我|wǒ}{妹妹|mèimei}{很|hěn}{高兴|gāoxìng}。', exRo: 'Wǒ mèimei hěn gāoxìng.', exVi: 'Em gái tôi rất vui.', more: 'Hán Việt: **MUỘI** (huynh muội). Bộ 女 → biết ngay là nữ.' },
        { w: '{儿子|érzi}', pos: 'danh từ', ipa: 'érzi', vi: 'con trai', ex: '{她|tā}{有|yǒu}{一|yí}{个|ge}{儿子|érzi}。', exRo: 'Tā yǒu yí ge érzi.', exVi: 'Cô ấy có một con trai.', more: 'Hán Việt: NHI TỬ. 子 đọc nhẹ. **Chú ý**: "con trai" (của bố mẹ) là 儿子; "bạn nam, cậu con trai" nói chung lại là 男孩子 (từ mở rộng).' },
        { w: '{女儿|nǚ\'ér}', pos: 'danh từ', ipa: "nǚ'ér", vi: 'con gái', ex: '{老板|lǎobǎn}{有|yǒu}{一|yí}{个|ge}{女儿|nǚ\'ér}。', exRo: "Lǎobǎn yǒu yí ge nǚ'ér.", exVi: 'Bà chủ có một cô con gái.', more: "Hán Việt: **NỮ NHI**. Viết có dấu cách âm **'**: nǚ'ér. ü giữ hai chấm sau n (nǚ ≠ nǔ). Gõ dạng số: nv3er2." },
        { w: '{孩子|háizi}', pos: 'danh từ', ipa: 'háizi', vi: 'con, con cái; đứa trẻ', ex: '{您|nín}{有|yǒu}{几|jǐ}{个|ge}{孩子|háizi}？', exRo: 'Nín yǒu jǐ ge háizi?', exVi: 'Ông/bà có mấy người con?', more: 'Hán Việt: HÀI TỬ (hài nhi). Nghĩa 1: con của ai (我的孩子). Nghĩa 2: trẻ con nói chung.' },
        { w: '{先生|xiānsheng}', pos: 'danh từ', ipa: 'xiānsheng', vi: 'chồng (của tôi/của bà…); ông, ngài', ex: '{我|wǒ}{先生|xiānsheng}{是|shì}{老板|lǎobǎn}。', exRo: 'Wǒ xiānsheng shì lǎobǎn.', exVi: 'Chồng tôi là chủ quán.', more: 'Hán Việt: TIÊN SINH — **lệch nghĩa**: KHÔNG phải "thầy giáo". 王先生 = ông Vương; 我先生 = chồng tôi. 生 đọc nhẹ.' },
        { w: '{爷爷|yéye}', pos: 'danh từ', ipa: 'yéye', vi: 'ông nội (từ mở rộng)', ex: '{我|wǒ}{爷爷|yéye}{很|hěn}{好|hǎo}。', exRo: 'Wǒ yéye hěn hǎo.', exVi: 'Ông nội tôi khoẻ.', more: 'Hán Việt: GIA (lão gia). Từ mở rộng. Bà nội: 奶奶 nǎinai.' },
      ],
    },

    { t: 'h', text: 'Nhóm 2 — Có / không có, hỏi số lượng, lượng từ (8 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{有|yǒu}', pos: 'động từ', ipa: 'yǒu', vi: 'có (sở hữu); có (tồn tại)', ex: '{我|wǒ}{有|yǒu}{两|liǎng}{个|ge}{姐姐|jiějie}。', exRo: 'Wǒ yǒu liǎng ge jiějie.', exVi: 'Tôi có hai chị gái.', more: 'Hán Việt: **HỮU** (sở hữu, hữu ích). Phủ định: **没有** — tuyệt đối không nói ~~不有~~.' },
        { w: '{没有|méiyǒu}', pos: 'động từ', ipa: 'méiyǒu', vi: 'không có', ex: '{我|wǒ}{没有|méiyǒu}{弟弟|dìdi}。', exRo: 'Wǒ méiyǒu dìdi.', exVi: 'Tôi không có em trai.', more: 'Hán Việt: MỘT HỮU (没 = chìm mất, không). Nói tắt **没** được: 我没弟弟 (khẩu ngữ). Bài 1 đã gặp 没关系.' },
        { w: '{几|jǐ}', pos: 'đại từ nghi vấn', ipa: 'jǐ', vi: 'mấy (hỏi số lượng nhỏ, thường dưới 10)', ex: '{你|nǐ}{有|yǒu}{几|jǐ}{个|ge}{哥哥|gēge}？', exRo: 'Nǐ yǒu jǐ ge gēge?', exVi: 'Bạn có mấy anh trai?', more: 'Hán Việt: KỶ. Sau 几 **phải có lượng từ**: 几**个**, 几**口**. 有几 hai thanh 3 → đọc yóu jǐ.' },
        { w: '{个|gè}', pos: 'lượng từ', ipa: 'gè (sau số đọc nhẹ: ge)', vi: 'cái, con, người… (lượng từ chung, dùng nhiều nhất)', ex: '{她|tā}{有|yǒu}{三|sān}{个|ge}{孩子|háizi}。', exRo: 'Tā yǒu sān ge háizi.', exVi: 'Cô ấy có ba đứa con.', more: 'Hán Việt: **CÁ** (cá nhân 个人). Gốc thanh 4 nên 一个 đọc **yí** ge. Không chắc dùng lượng từ nào → dùng 个.' },
        { w: '{口|kǒu}', pos: 'lượng từ / danh từ', ipa: 'kǒu', vi: '(lượng từ) khẩu — đếm số người trong gia đình; (danh từ) miệng', ex: '{你|nǐ}{家|jiā}{有|yǒu}{几|jǐ}{口|kǒu}{人|rén}？', exRo: 'Nǐ jiā yǒu jǐ kǒu rén?', exVi: 'Nhà bạn có mấy người?', more: 'Hán Việt: **KHẨU** (nhân khẩu 人口). Chỉ dùng trong mẫu **家有 + số + 口人**. Đếm anh chị em vẫn dùng 个.' },
        { w: '{两|liǎng}', pos: 'số từ', ipa: 'liǎng', vi: 'hai (đứng trước lượng từ)', ex: '{我|wǒ}{有|yǒu}{两|liǎng}{个|ge}{弟弟|dìdi}。', exRo: 'Wǒ yǒu liǎng ge dìdi.', exVi: 'Tôi có hai em trai.', more: 'Hán Việt: LƯỠNG (lưỡng lự, lưỡng cực). "Hai + lượng từ" dùng **两**: 两个, 两口. Đếm 1, 2, 3 thì dùng 二 — Bài 5 học kỹ.' },
        { w: '{和|hé}', pos: 'liên từ', ipa: 'hé', vi: 'và, với (nối danh từ / đại từ)', ex: '{爸爸|bàba}、{妈妈|māma}{和|hé}{我|wǒ}', exRo: 'bàba, māma hé wǒ', exVi: 'bố, mẹ và tôi', more: 'Hán Việt: HOÀ. Chỉ nối **danh từ/đại từ**, KHÔNG nối hai câu như "và" tiếng Việt. Liệt kê: A、B **和** C.' },
        { w: '{的|de}', pos: 'trợ từ', ipa: 'de', vi: 'của (nối người sở hữu với vật/người được sở hữu)', ex: '{他|tā}{的|de}{名字|míngzi}{叫|jiào}{什么|shénme}？', exRo: 'Tā de míngzi jiào shénme?', exVi: 'Tên của anh ấy là gì?', more: 'Hán Việt: ĐÍCH (mục đích). Thanh nhẹ. Trật tự **A 的 B = B của A**: 我的名字 = tên của tôi.' },
      ],
    },

    { t: 'h', text: 'Nhóm 3 — Hỏi "ai", nghề nghiệp, bạn bè (6 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{谁|shéi}', pos: 'đại từ nghi vấn', ipa: 'shéi (cũng đọc shuí)', vi: 'ai', ex: '{她|tā}{是|shì}{谁|shéi}？', exRo: 'Tā shì shéi?', exVi: 'Cô ấy là ai?', more: 'Hán Việt: THUỲ. Đặt **đúng chỗ** của người cần hỏi, không đảo: 他是**谁**？ · **谁**是你哥哥？ Câu có 谁 thì KHÔNG thêm 吗.' },
        { w: '{朋友|péngyou}', pos: 'danh từ', ipa: 'péngyou', vi: 'bạn, bạn bè', ex: '{他|tā}{是|shì}{我|wǒ}{的|de}{朋友|péngyou}。', exRo: 'Tā shì wǒ de péngyou.', exVi: 'Anh ấy là bạn tôi.', more: 'Hán Việt: **BẰNG HỮU**. 友 đọc nhẹ. 男朋友 = bạn trai (người yêu), 女朋友 = bạn gái (người yêu) — cẩn thận khi dùng!' },
        { w: '{医生|yīshēng}', pos: 'danh từ', ipa: 'yīshēng', vi: 'bác sĩ', ex: '{我|wǒ}{妈妈|māma}{是|shì}{医生|yīshēng}。', exRo: 'Wǒ māma shì yīshēng.', exVi: 'Mẹ tôi là bác sĩ.', more: 'Hán Việt: **Y SINH** (y = chữa bệnh). Hai thanh 1 — giữ giọng cao, phẳng. Bệnh viện: 医院 yīyuàn (Bài sau).' },
        { w: '{饭馆|fànguǎn}', pos: 'danh từ', ipa: 'fànguǎn', vi: 'quán ăn, tiệm cơm', ex: '{他们|tāmen}{的|de}{饭馆|fànguǎn}{很|hěn}{好|hǎo}。', exRo: 'Tāmen de fànguǎn hěn hǎo.', exVi: 'Quán ăn của họ rất ngon (rất tốt).', more: 'Hán Việt: PHẠN QUÁN (饭 = cơm). 馆 thanh 3. Quán lớn sang trọng: 饭店 (Bài 9).' },
        { w: '{奶奶|nǎinai}', pos: 'danh từ', ipa: 'nǎinai', vi: 'bà nội (từ mở rộng)', ex: '{奶奶|nǎinai}，{您|nín}{好|hǎo}！', exRo: 'Nǎinai, nín hǎo!', exVi: 'Cháu chào bà ạ!', more: 'Hán Việt: NÃI. Từ mở rộng. Cũng dùng để gọi cụ bà lạ một cách lễ phép.' },
        { w: '{狗|gǒu}', pos: 'danh từ', ipa: 'gǒu', vi: 'con chó (từ mở rộng)', ex: '{我|wǒ}{家|jiā}{有|yǒu}{一|yì}{只|zhī}{狗|gǒu}。', exRo: 'Wǒ jiā yǒu yì zhī gǒu.', exVi: 'Nhà tôi có một con chó.', more: 'Hán Việt: CẨU. Từ mở rộng. Đếm con vật dùng lượng từ **只** zhī (一只 → yì zhī vì 只 thanh 1). Thú cưng KHÔNG tính vào 几口人!' },
      ],
    },

    { t: 'h', text: 'Nhóm 4 — Từ cũ dùng nhiều trong bài (4 từ ôn)' },
    {
      t: 'p',
      text: 'Bốn từ sau đã học ở Bài 2–3; bài này dùng chúng liên tục để nói về gia đình. Đọc lại câu ví dụ mới cho quen.',
    },
    {
      t: 'vocab',
      items: [
        { w: '{人|rén}', pos: 'danh từ', ipa: 'rén', vi: 'người', ex: '{我|wǒ}{家|jiā}{有|yǒu}{三|sān}{口|kǒu}{人|rén}。', exRo: 'Wǒ jiā yǒu sān kǒu rén.', exVi: 'Nhà tôi có ba người.', more: 'Hán Việt: **NHÂN**. Ôn Bài 3 (中国人). Trong 几口人, 人 đứng sau lượng từ 口.' },
        { w: '{老师|lǎoshī}', pos: 'danh từ', ipa: 'lǎoshī', vi: 'giáo viên', ex: '{她|tā}{妈妈|māma}{是|shì}{老师|lǎoshī}。', exRo: 'Tā māma shì lǎoshī.', exVi: 'Mẹ cô ấy là giáo viên.', more: 'Ôn Bài 1–2. Nói nghề: **S + 是 + nghề** — 我爸爸是老师.' },
        { w: '{学生|xuésheng}', pos: 'danh từ', ipa: 'xuésheng', vi: 'học sinh, sinh viên', ex: '{我|wǒ}{妹妹|mèimei}{是|shì}{学生|xuésheng}。', exRo: 'Wǒ mèimei shì xuésheng.', exVi: 'Em gái tôi là học sinh.', more: 'Ôn Bài 2. Hán Việt HỌC SINH — dùng cho cả học sinh lẫn sinh viên.' },
        { w: '{名字|míngzi}', pos: 'danh từ', ipa: 'míngzi', vi: 'tên', ex: '{你|nǐ}{妹妹|mèimei}{叫|jiào}{什么|shénme}{名字|míngzi}？', exRo: 'Nǐ mèimei jiào shénme míngzi?', exVi: 'Em gái bạn tên là gì?', more: 'Ôn Bài 2. 我的名字 — "tên của tôi": 名字 là vật sở hữu, nên thường giữ 的.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tóm tắt: hỏi gì — đáp gì về gia đình',
      head: ['Hỏi', 'Đáp', 'Nghĩa'],
      rows: [
        ['你家有几口人？', '我家有五口人。', 'Nhà bạn có mấy người? — Nhà tôi có 5 người.'],
        ['你有哥哥吗？', '有，我有一个哥哥。/ 没有。', 'Bạn có anh trai không? — Có, tôi có một anh. / Không có.'],
        ['你有几个姐姐？', '我有两个姐姐。', 'Bạn có mấy chị gái? — Tôi có hai chị.'],
        ['他是谁？', '他是我爸爸。', 'Ông ấy là ai? — Ông ấy là bố tôi.'],
        ['你妈妈是老师吗？', '是。/ 不是，她是医生。', 'Mẹ bạn là giáo viên à? — Đúng. / Không, mẹ tôi là bác sĩ.'],
        ['你哥哥叫什么名字？', '他叫王大山。', 'Anh bạn tên gì? — Anh ấy tên Vương Đại Sơn.'],
      ],
    },
    {
      t: 'mcq',
      id: 'b4-tv-nghia',
      title: 'Kiểm tra nghĩa từ',
      items: [
        m('{弟弟|dìdi} nghĩa là:', ['anh trai', 'em trai', 'em gái', 'con trai'], 1, '弟弟 = em trai (ĐỆ). Em gái là 妹妹.'),
        m('{姐姐|jiějie} nghĩa là:', ['chị gái', 'em gái', 'mẹ', 'bà nội'], 0, '姐姐 = chị gái (THƯ).'),
        m('{女儿|nǚ\'ér} nghĩa là:', ['phụ nữ', 'con gái', 'em gái', 'cô giáo'], 1, '女儿 = con gái (của bố mẹ).'),
        m('Phủ định của {有|yǒu} là:', ['不有', '没有', '不是', '没是'], 1, '有 → 没有. Không bao giờ nói 不有.'),
        m('{几|jǐ} dùng để hỏi:', ['ai', 'cái gì', 'số lượng nhỏ (mấy)', 'ở đâu'], 2, '几 = mấy, hỏi số lượng thường dưới 10, luôn kèm lượng từ.'),
        m('{口|kǒu} trong 家有几口人 là:', ['miệng', 'lượng từ đếm người trong nhà', 'cửa', 'động từ "ăn"'], 1, '口 là lượng từ đếm số người trong gia đình (nhân khẩu).'),
        m('{先生|xiānsheng} trong 我先生 nghĩa là:', ['thầy giáo của tôi', 'chồng tôi', 'anh trai tôi', 'học sinh'], 1, '我先生 = chồng tôi. Giáo viên là 老师.'),
        m('{谁|shéi} nghĩa là:', ['gì', 'ai', 'mấy', 'nào'], 1, '谁 = ai (THUỲ).'),
        m('{医生|yīshēng} nghĩa là:', ['bác sĩ', 'học sinh', 'giáo viên', 'chủ quán'], 0, '医生 = bác sĩ (Y SINH).'),
        m('{朋友|péngyou} nghĩa là:', ['họ hàng', 'bạn bè', 'hàng xóm', 'đồng nghiệp'], 1, '朋友 = bạn (BẰNG HỮU).'),
        m('{和|hé} dùng để:', ['nối hai câu', 'nối danh từ/đại từ', 'hỏi có/không', 'phủ định'], 1, '和 chỉ nối danh từ/đại từ: 爸爸和妈妈.'),
        m('"Hai anh trai" nói thế nào?', ['二哥哥', '两哥哥', '两个哥哥', '二个哥哥'], 2, 'Số + lượng từ + danh từ; "hai" trước lượng từ dùng 两: 两个哥哥.'),
      ],
    },
  ],
};

/* ══════════════════════════ 3. NGỮ PHÁP ══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b4-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp Bài 4 — 有/没有, 几 + lượng từ, lượng từ 个/口, 的 sở hữu, 谁, 和',
  goal: 'Nói được "có/không có ai, cái gì", hỏi và trả lời số lượng với 几 + lượng từ, đếm người trong nhà bằng 口, nói "của ai" bằng 的 và biết khi nào được bỏ 的.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Sáu điểm ngữ pháp',
      items: [
        '**① Có / không có**: S + **有** + N · S + **没有** + N — hỏi: 有…吗？ / **有没有**…？',
        '**② Số + lượng từ + danh từ**: 一**个**哥哥 · 两**个**姐姐 · 五**口**人.',
        '**③ Hỏi số lượng nhỏ**: **几 + lượng từ** + N？ — trả lời: thay 几 bằng con số.',
        '**④ 家有几口人**: mẫu cố định hỏi/nói gia đình có mấy người.',
        '**⑤ Sở hữu**: A + **的** + B (= B của A). Người thân, nơi mình thuộc về: **bỏ 的** (我爸爸, 我家).',
        '**⑥ Hỏi "ai"**: 谁 đứng đúng chỗ người cần hỏi · nối danh từ bằng **和**.',
      ],
    },

    /* ── ① ── */
    { t: 'h', text: '① Có / không có: 有 và 没有' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'S + 有 + (số + lượng từ) + N',
          vi: 'Ai đó CÓ người/vật gì',
          examples: [
            { en: '{我|wǒ}{有|yǒu}{哥哥|gēge}。', ro: 'Wǒ yǒu gēge.', vi: 'Tôi có anh trai.' },
            { en: '{我|wǒ}{有|yǒu}{一|yí}{个|ge}{哥哥|gēge}。', ro: 'Wǒ yǒu yí ge gēge.', vi: 'Tôi có một anh trai.' },
            { en: '{大伟|Dàwěi}{有|yǒu}{两|liǎng}{个|ge}{姐姐|jiějie}。', ro: 'Dàwěi yǒu liǎng ge jiějie.', vi: 'Đại Vĩ có hai chị gái.' },
            { en: '{老板|lǎobǎn}{有|yǒu}{两|liǎng}{个|ge}{孩子|háizi}。', ro: 'Lǎobǎn yǒu liǎng ge háizi.', vi: 'Bà chủ có hai đứa con.' },
            { en: '{我|wǒ}{有|yǒu}{中国|Zhōngguó}{朋友|péngyou}。', ro: 'Wǒ yǒu Zhōngguó péngyou.', vi: 'Tôi có bạn người Trung Quốc.' },
          ],
        },
        {
          formula: 'S + 没有 + N',
          vi: 'Ai đó KHÔNG CÓ người/vật gì — thường KHÔNG kèm số',
          examples: [
            { en: '{我|wǒ}{没有|méiyǒu}{姐姐|jiějie}。', ro: 'Wǒ méiyǒu jiějie.', vi: 'Tôi không có chị gái.' },
            { en: '{王明|Wáng Míng}{没有|méiyǒu}{哥哥|gēge}。', ro: 'Wáng Míng méiyǒu gēge.', vi: 'Vương Minh không có anh trai.' },
            { en: '{安娜|Ānnà}{没有|méiyǒu}{妹妹|mèimei}。', ro: 'Ānnà méiyǒu mèimei.', vi: 'Anna không có em gái.' },
            { en: '{我|wǒ}{没有|méiyǒu}{弟弟|dìdi}，{也|yě}{没有|méiyǒu}{妹妹|mèimei}。', ro: 'Wǒ méiyǒu dìdi, yě méiyǒu mèimei.', vi: 'Tôi không có em trai, cũng không có em gái.' },
          ],
        },
        {
          formula: 'S + 有 + N + 吗？ · S + 有没有 + N？',
          vi: 'Hỏi "có … không?" — hai cách, nghĩa như nhau',
          examples: [
            { en: '{你|nǐ}{有|yǒu}{弟弟|dìdi}{吗|ma}？', ro: 'Nǐ yǒu dìdi ma?', vi: 'Bạn có em trai không?' },
            { en: '{你|nǐ}{有|yǒu}{没有|méiyǒu}{弟弟|dìdi}？', ro: 'Nǐ yǒu méiyǒu dìdi?', vi: 'Bạn có em trai hay không?' },
            { en: '{老师|lǎoshī}，{您|nín}{有|yǒu}{孩子|háizi}{吗|ma}？', ro: 'Lǎoshī, nín yǒu háizi ma?', vi: 'Thưa cô, cô có con chưa ạ?' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '有 yǒu giống chữ **"có"** của tiếng Việt khi nói về **sở hữu**: "tôi **có** anh trai" = 我**有**哥哥. Điều quan trọng nhất: **phủ định của 有 luôn là 没有** — chữ 不 (Bài 3) phủ định 是 và tính từ (不是, 不冷), còn 有 thì đi với 没. Câu hỏi **有没有** ghép khẳng định + phủ định ("có — không có?") là kiểu hỏi chính phản (sẽ gặp lại nhiều ở bài sau); khi đã dùng 有没有 thì **không thêm 吗**. Trả lời ngắn: **有。** hoặc **没有。**',
    },
    {
      t: 'table',
      caption: 'Cặp hỏi ↔ đáp: khẳng định và phủ định',
      head: ['Hỏi', 'Đáp khẳng định', 'Đáp phủ định'],
      rows: [
        ['你有哥哥吗？Nǐ yǒu gēge ma?', '有，我有一个哥哥。Yǒu, wǒ yǒu yí ge gēge.', '没有，我没有哥哥。Méiyǒu, wǒ méiyǒu gēge.'],
        ['你有没有姐姐？Nǐ yǒu méiyǒu jiějie?', '有，我有两个姐姐。Yǒu, wǒ yǒu liǎng ge jiějie.', '没有。Méiyǒu.'],
        ['王明有妹妹吗？Wáng Míng yǒu mèimei ma?', '有。Yǒu.', '没有，他没有妹妹。Méiyǒu, tā méiyǒu mèimei.'],
        ['老板有孩子吗？Lǎobǎn yǒu háizi ma?', '有，她有两个孩子。Yǒu, tā yǒu liǎng ge háizi.', '没有。Méiyǒu.'],
        ['你有中国朋友吗？Nǐ yǒu Zhōngguó péngyou ma?', '有，王明是我的朋友。Yǒu, Wáng Míng shì wǒ de péngyou.', '没有。Méiyǒu.'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — S + 有 / 没有 + (số + 个) + người',
      head: ['S', '有 / 没有', 'số + 个', 'Người', 'Câu mẫu'],
      rows: [
        ['我', '有', '一个', '哥哥', '我有一个哥哥。Wǒ yǒu yí ge gēge.'],
        ['大伟', '有', '两个', '姐姐', '大伟有两个姐姐。Dàwěi yǒu liǎng ge jiějie.'],
        ['老板', '有', '一个', '女儿', "老板有一个女儿。Lǎobǎn yǒu yí ge nǚ'ér."],
        ['安娜', '有', '一个', '哥哥', '安娜有一个哥哥。Ānnà yǒu yí ge gēge.'],
        ['王明', '没有', '(không số)', '弟弟', '王明没有弟弟。Wáng Míng méiyǒu dìdi.'],
        ['兰兰', '没有', '(không số)', '姐姐', '兰兰没有姐姐。Lánlan méiyǒu jiějie.'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Phủ định bằng 不: ~~我不有姐姐。~~ → **我没有姐姐。** Nhớ: **不是** nhưng **没有**.',
        'Thêm số sau 没有: ~~我没有一个哥哥。~~ — câu này nghĩa là "tôi chẳng có lấy MỘT anh nào" (nhấn mạnh, hiếm dùng). Câu thường: **我没有哥哥。**',
        'Dùng 是 thay 有 vì tiếng Việt "nhà tôi **là** năm người": ~~我家是五口人。~~ → **我家有五口人。**',
        'Thêm 吗 sau 有没有: ~~你有没有哥哥吗？~~ → **你有没有哥哥？** hoặc **你有哥哥吗？** (chọn một cách hỏi).',
        'Trả lời 有…吗 bằng 是/不是: hỏi 你有弟弟吗？ đáp **有** / **没有**, không đáp ~~是~~ / ~~不是~~.',
      ],
    },
    { t: 'rule', formula: 'S + 有 + (số + lượng từ) + N · S + 没有 + N', vi: '"Có" dùng 有; "không có" LUÔN là 没有 (không bao giờ 不有); hỏi: 有…吗？ hoặc 有没有…？' },

    /* ── ② ── */
    { t: 'h', text: '② Số + lượng từ + danh từ: 个 và 口' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'số + 个 + N',
          vi: '个 là lượng từ chung — dùng cho người và rất nhiều thứ',
          examples: [
            { en: '{一|yí}{个|ge}{哥哥|gēge}', ro: 'yí ge gēge', vi: 'một anh trai (一 → yí vì 个 gốc thanh 4)' },
            { en: '{两|liǎng}{个|ge}{妹妹|mèimei}', ro: 'liǎng ge mèimei', vi: 'hai em gái (dùng 两, không dùng 二)' },
            { en: '{三|sān}{个|ge}{孩子|háizi}', ro: 'sān ge háizi', vi: 'ba đứa con' },
            { en: '{四|sì}{个|ge}{朋友|péngyou}', ro: 'sì ge péngyou', vi: 'bốn người bạn' },
            { en: '{五|wǔ}{个|ge}{学生|xuésheng}', ro: 'wǔ ge xuésheng', vi: 'năm học sinh' },
          ],
        },
        {
          formula: '(家有) + số + 口 + 人',
          vi: '口 chỉ dùng để đếm TỔNG số người trong gia đình',
          examples: [
            { en: '{三|sān}{口|kǒu}{人|rén}', ro: 'sān kǒu rén', vi: 'ba người (nhà ba người)' },
            { en: '{我|wǒ}{家|jiā}{有|yǒu}{五|wǔ}{口|kǒu}{人|rén}。', ro: 'Wǒ jiā yǒu wǔ kǒu rén.', vi: 'Nhà tôi có năm người.' },
            { en: '{他|tā}{家|jiā}{有|yǒu}{两|liǎng}{口|kǒu}{人|rén}。', ro: 'Tā jiā yǒu liǎng kǒu rén.', vi: 'Nhà anh ấy có hai người. (hai vợ chồng)' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '**Lượng từ** (量词 liàngcí) là chữ đứng giữa **số** và **danh từ**. Tiếng Việt cũng có lượng từ — "một **con** chó", "hai **cái** bàn", "ba **người** bạn" — nhưng tiếng Việt nhiều khi bỏ được ("hai anh trai", "ba học sinh"). **Tiếng Trung thì KHÔNG bỏ được**: giữa số và danh từ **bắt buộc** có lượng từ. Ở HSK 1, **个** gè là lượng từ dùng nhiều nhất — dùng cho người và cho phần lớn đồ vật. Sau con số, 个 thường đọc **nhẹ** (ge). **口** kǒu (miệng) là lượng từ riêng để đếm **số người trong một gia đình** — ngày xưa đếm người theo số miệng ăn, như "nhân khẩu" của ta.',
    },
    {
      t: 'table',
      caption: 'Số đếm 1–10 để dùng trong bài này (Bài 5 học kỹ cả 0–99)',
      head: ['Số', 'Chữ', 'Pinyin', 'Hán Việt', 'Đếm người: số + 个'],
      rows: [
        ['1', '一', 'yī', 'NHẤT', '一个 yí ge'],
        ['2', '二 / 两', 'èr / liǎng', 'NHỊ / LƯỠNG', '两个 liǎng ge (KHÔNG nói 二个)'],
        ['3', '三', 'sān', 'TAM', '三个 sān ge'],
        ['4', '四', 'sì', 'TỨ', '四个 sì ge'],
        ['5', '五', 'wǔ', 'NGŨ', '五个 wǔ ge'],
        ['6', '六', 'liù', 'LỤC', '六个 liù ge'],
        ['7', '七', 'qī', 'THẤT', '七个 qī ge'],
        ['8', '八', 'bā', 'BÁT', '八个 bā ge'],
        ['9', '九', 'jiǔ', 'CỬU', '九个 jiǔ ge'],
        ['10', '十', 'shí', 'THẬP', '十个 shí ge'],
      ],
    },
    {
      t: 'table',
      caption: '个 hay 口? — chọn đúng lượng từ',
      head: ['Bạn muốn nói', 'Đúng', 'Sai', 'Vì sao'],
      rows: [
        ['Nhà tôi có 4 người', '我家有四口人。', '我家有四个人。(nghe được nhưng kém tự nhiên)', 'Đếm TỔNG số người trong nhà → 口'],
        ['Tôi có 2 anh trai', '我有两个哥哥。', '我有两口哥哥。', 'Đếm anh chị em, con cái → 个'],
        ['Bà ấy có 3 người con', '她有三个孩子。', '她有三口孩子。', 'Con cái → 个'],
        ['Lớp có 10 học sinh', '十个学生', '十口学生', '口 chỉ dùng cho gia đình'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Bỏ lượng từ theo kiểu tiếng Việt: ~~我有两哥哥。~~ ~~三孩子~~ → **两个哥哥 · 三个孩子**.',
        'Dùng 二 trước lượng từ: ~~二个姐姐~~ → **两个姐姐**. (二 dùng khi đếm 1-2-3, đọc số: Bài 5.)',
        'Dùng 口 cho mọi người: ~~两口姐姐~~ → **两个姐姐**. 口 chỉ dùng trong **家有…口人**.',
        'Đọc 一个 thành "yī gè": đọc **yí ge** — 一 lên thanh 2, 个 nhẹ.',
      ],
    },
    { t: 'rule', formula: 'số + 个 + người/vật · 家有 + số + 口人', vi: 'Giữa số và danh từ bắt buộc có lượng từ; 个 dùng chung, 口 chỉ đếm số người trong gia đình; "hai" trước lượng từ là 两.' },

    /* ── ③ ── */
    { t: 'h', text: '③ Hỏi số lượng nhỏ: 几 + lượng từ + danh từ？' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'S + 有 + 几 + lượng từ + N？',
          vi: 'Hỏi "mấy …?" — trả lời bằng cách thay 几 bằng con số',
          examples: [
            { en: '{你|nǐ}{有|yǒu}{几|jǐ}{个|ge}{哥哥|gēge}？', ro: 'Nǐ yǒu jǐ ge gēge?', vi: 'Bạn có mấy anh trai?' },
            { en: '{我|wǒ}{有|yǒu}{一|yí}{个|ge}{哥哥|gēge}。', ro: 'Wǒ yǒu yí ge gēge.', vi: 'Tôi có một anh trai.' },
            { en: '{大伟|Dàwěi}{有|yǒu}{几|jǐ}{个|ge}{姐姐|jiějie}？', ro: 'Dàwěi yǒu jǐ ge jiějie?', vi: 'Đại Vĩ có mấy chị gái?' },
            { en: '{他|tā}{有|yǒu}{两|liǎng}{个|ge}{姐姐|jiějie}。', ro: 'Tā yǒu liǎng ge jiějie.', vi: 'Cậu ấy có hai chị gái.' },
            { en: '{您|nín}{有|yǒu}{几|jǐ}{个|ge}{孩子|háizi}？', ro: 'Nín yǒu jǐ ge háizi?', vi: 'Ông/bà có mấy người con?' },
            { en: '{你们|nǐmen}{班|bān}{有|yǒu}{几|jǐ}{个|ge}{越南|Yuènán}{人|rén}？', ro: 'Nǐmen bān yǒu jǐ ge Yuènán rén?', vi: 'Lớp các bạn có mấy người Việt Nam? (班 bān — lớp, từ mở rộng)' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '几 jǐ = **"mấy"**. Cũng như 谁 và 什么 (Bài 2), từ để hỏi **đứng đúng chỗ của câu trả lời** — câu hỏi và câu trả lời có **cùng trật tự**: 你有**几个**哥哥？ → 我有**一个**哥哥。 Hai điều cần nhớ: (1) sau 几 **luôn có lượng từ** (几**个**, 几**口**); (2) 几 dùng khi người hỏi đoán con số **nhỏ** (thường dưới 10). Hỏi số lớn hơn (tuổi người lớn, số điện thoại…) dùng **多少** — học ở Bài 5. Câu có 几 **không thêm 吗**.',
    },
    {
      t: 'table',
      caption: 'Cặp hỏi ↔ đáp với 几',
      head: ['Hỏi', 'Đáp', 'Nghĩa'],
      rows: [
        ['你有几个姐姐？', '我有两个姐姐。/ 我没有姐姐。', 'Bạn có mấy chị? — Tôi có hai chị. / Tôi không có chị.'],
        ['你有几个弟弟？', '我有一个弟弟。', 'Bạn có mấy em trai? — Một em trai.'],
        ['老板有几个孩子？', '她有两个孩子。', 'Bà chủ có mấy con? — Hai con.'],
        ['你有几个中国朋友？', '我有三个中国朋友。', 'Bạn có mấy người bạn Trung Quốc? — Ba người.'],
        ['你家有几口人？', '我家有五口人。', 'Nhà bạn có mấy người? — Năm người.'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Thiếu lượng từ sau 几: ~~你有几哥哥？~~ → **你有几个哥哥？**',
        'Đặt 几 ở cuối như "bạn có anh trai mấy người?": ~~你有哥哥几个？~~ → **你有几个哥哥？**',
        'Thêm 吗 vào câu đã có 几: ~~你有几个姐姐吗？~~ → **你有几个姐姐？**',
        'Trả lời chỉ một con số trơn ~~两。~~ — nên nói **两个** (giữ lượng từ) hoặc cả câu **我有两个姐姐**.',
      ],
    },
    { t: 'rule', formula: '几 + lượng từ + N？ → số + lượng từ + N', vi: 'Hỏi số lượng nhỏ: 几 đứng chỗ con số, luôn kèm lượng từ, không thêm 吗.' },

    /* ── ④ ── */
    { t: 'h', text: '④ Mẫu cố định: 你家有几口人？' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '(Ai) + 家 + 有 + 几 + 口 + 人？ → (Ai) + 家 + 有 + số + 口 + 人。',
          vi: 'Hỏi / nói gia đình có bao nhiêu người (tính cả bản thân)',
          examples: [
            { en: '{你|nǐ}{家|jiā}{有|yǒu}{几|jǐ}{口|kǒu}{人|rén}？', ro: 'Nǐ jiā yǒu jǐ kǒu rén?', vi: 'Nhà bạn có mấy người?' },
            { en: '{我|wǒ}{家|jiā}{有|yǒu}{三|sān}{口|kǒu}{人|rén}。', ro: 'Wǒ jiā yǒu sān kǒu rén.', vi: 'Nhà tôi có ba người.' },
            { en: '{王明|Wáng Míng}{家|jiā}{有|yǒu}{三|sān}{口|kǒu}{人|rén}。', ro: 'Wáng Míng jiā yǒu sān kǒu rén.', vi: 'Nhà Vương Minh có ba người.' },
            { en: '{您|nín}{家|jiā}{有|yǒu}{几|jǐ}{口|kǒu}{人|rén}？', ro: 'Nín jiā yǒu jǐ kǒu rén?', vi: 'Nhà ông/bà có mấy người ạ?' },
            { en: '{我|wǒ}{家|jiā}{有|yǒu}{五|wǔ}{口|kǒu}{人|rén}：{爸爸|bàba}、{妈妈|māma}、{哥哥|gēge}、{妹妹|mèimei}{和|hé}{我|wǒ}。', ro: 'Wǒ jiā yǒu wǔ kǒu rén: bàba, māma, gēge, mèimei hé wǒ.', vi: 'Nhà tôi có năm người: bố, mẹ, anh trai, em gái và tôi.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: 'Đây là câu bạn sẽ được hỏi **rất nhiều lần** khi làm quen với người Trung Quốc, và cũng là câu kinh điển trong phần thi nói HSKK. Hãy học thuộc **cả khối**: 家 · 有 · 几 · 口 · 人. Sau khi nói số người, người Trung Quốc thường **liệt kê** từng người bằng dấu **、** và **和** trước người cuối cùng — thường kết thúc bằng **我** (khiêm tốn: kể mình sau cùng). Chú ý "nhà tôi" là **我家** — không cần 的.',
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Quên tính bản thân: nhà có bố, mẹ, em gái và bạn → **四口人**, không phải 三口人.',
        'Dịch từng chữ "nhà tôi có năm thành viên": ~~我家有五个人们。~~ → **我家有五口人。** (们 không dùng sau con số.)',
        'Đặt 我 lên đầu danh sách: ~~我、爸爸和妈妈~~ — không sai ngữ pháp nhưng kém lịch sự; nên nói **爸爸、妈妈和我**.',
      ],
    },
    { t: 'rule', formula: '(Ai)家有几口人？ → (Ai)家有 + số + 口人：A、B 和 我。', vi: 'Câu cố định về số người trong nhà; tính cả bản thân; liệt kê bằng 、 và 和, kể mình cuối cùng.' },

    /* ── ⑤ ── */
    { t: 'h', text: '⑤ Sở hữu: A + 的 + B — và khi nào bỏ 的' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'A (người sở hữu) + 的 + B (vật/người được sở hữu)',
          vi: '"B của A" — trật tự NGƯỢC với tiếng Việt',
          examples: [
            { en: '{我|wǒ}{的|de}{名字|míngzi}', ro: 'wǒ de míngzi', vi: 'tên của tôi' },
            { en: '{他|tā}{的|de}{朋友|péngyou}', ro: 'tā de péngyou', vi: 'bạn của anh ấy' },
            { en: '{王明|Wáng Míng}{的|de}{妈妈|māma}', ro: 'Wáng Míng de māma', vi: 'mẹ của Vương Minh' },
            { en: '{老师|lǎoshī}{的|de}{孩子|háizi}', ro: 'lǎoshī de háizi', vi: 'con của cô giáo' },
            { en: '{安娜|Ānnà}{的|de}{哥哥|gēge}{叫|jiào}{伊万|Yīwàn}。', ro: 'Ānnà de gēge jiào Yīwàn.', vi: 'Anh trai của Anna tên là Ivan.' },
          ],
        },
        {
          formula: 'đại từ + người thân / nơi mình thuộc về (BỎ 的)',
          vi: 'Quan hệ gần gũi: gia đình, nhà, trường, lớp, nước',
          examples: [
            { en: '{我|wǒ}{爸爸|bàba}', ro: 'wǒ bàba', vi: 'bố tôi' },
            { en: '{你|nǐ}{妹妹|mèimei}', ro: 'nǐ mèimei', vi: 'em gái bạn' },
            { en: '{我|wǒ}{家|jiā}', ro: 'wǒ jiā', vi: 'nhà tôi' },
            { en: '{我们|wǒmen}{老师|lǎoshī}', ro: 'wǒmen lǎoshī', vi: 'cô giáo chúng tôi' },
            { en: '{他|tā}{哥哥|gēge}{是|shì}{医生|yīshēng}。', ro: 'Tā gēge shì yīshēng.', vi: 'Anh trai cậu ấy là bác sĩ.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: 'Tiếng Việt nói "tên **của** tôi" — vật trước, người sở hữu sau. Tiếng Trung **ngược lại**: người sở hữu **trước**, rồi **的**, rồi vật — 我**的**名字. Mẹo nhớ: đọc 的 như dấu **sở hữu cách "\'s"** của tiếng Anh (my name = 我的名字, Wang Ming\'s mom = 王明的妈妈). **Khi nào bỏ 的?** Khi A là **đại từ** (我, 你, 他…) và B là **người thân** hoặc **tập thể mình thuộc về** (家, 学校, 国家…): 我妈妈, 我家, 我们老师. Với **đồ vật** và **bạn bè** thì thường giữ 的: 我的名字, 我的朋友 (nói 我朋友 trong khẩu ngữ cũng gặp). Nếu A là **danh từ/tên người**, thường giữ 的: 王明的妈妈.',
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — giữ 的 hay bỏ 的?',
      head: ['A', 'B', 'Nói', 'Ghi chú'],
      rows: [
        ['我', '爸爸', '我爸爸', 'người thân → bỏ 的'],
        ['你', '家', '你家', 'nhà → bỏ 的'],
        ['我们', '老师', '我们老师', 'tập thể mình thuộc về → bỏ 的'],
        ['我', '名字', '我的名字', 'vật sở hữu → giữ 的'],
        ['他', '朋友', '他的朋友 (khẩu ngữ: 他朋友)', 'bạn bè → thường giữ 的'],
        ['王明', '妈妈', '王明的妈妈', 'A là tên người → giữ 的'],
        ['老板', '孩子', '老板的孩子', 'A là danh từ → giữ 的'],
        ['我朋友', '哥哥', '我朋友的哥哥', 'lồng nhau: anh trai của bạn tôi'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Giữ trật tự tiếng Việt: ~~名字的我~~ ~~妈妈的王明~~ → **我的名字 · 王明的妈妈**.',
        'Bỏ 的 khi A là tên người: ~~王明妈妈是医生~~ — khẩu ngữ đôi khi nghe được, nhưng khi học hãy nói **王明的妈妈是医生**.',
        'Dùng 的 hai lần thừa: ~~我的爸爸的名字~~ → **我爸爸的名字** (tên của bố tôi): bỏ 的 ở chỗ người thân, giữ 的 trước vật.',
        'Đọc 的 thành dì / dí: 的 làm trợ từ luôn đọc **de** nhẹ.',
      ],
    },
    { t: 'rule', formula: 'A + 的 + B = "B của A" · 我 / 你 / 他 + người thân (bỏ 的)', vi: 'Người sở hữu đứng trước 的; với đại từ + người thân/nhà/tập thể thì bỏ 的.' },

    /* ── ⑥ ── */
    { t: 'h', text: '⑥ Hỏi "ai": 谁 — và nối danh từ bằng 和' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'S + 是 + 谁？ · 谁 + 是 + N？',
          vi: '谁 đứng đúng chỗ người cần hỏi — không đảo, không thêm 吗',
          examples: [
            { en: '{他|tā}{是|shì}{谁|shéi}？', ro: 'Tā shì shéi?', vi: 'Anh ấy là ai?' },
            { en: '{他|tā}{是|shì}{我|wǒ}{爸爸|bàba}。', ro: 'Tā shì wǒ bàba.', vi: 'Ông ấy là bố tôi.' },
            { en: '{谁|shéi}{是|shì}{你|nǐ}{哥哥|gēge}？', ro: 'Shéi shì nǐ gēge?', vi: 'Ai là anh trai bạn?' },
            { en: '{谁|shéi}{有|yǒu}{妹妹|mèimei}？', ro: 'Shéi yǒu mèimei?', vi: 'Ai có em gái?' },
            { en: '{她|tā}{是|shì}{谁|shéi}{的|de}{孩子|háizi}？', ro: 'Tā shì shéi de háizi?', vi: 'Bé ấy là con của ai?' },
          ],
        },
        {
          formula: 'N₁ + 和 + N₂ · N₁、N₂ + 和 + N₃',
          vi: '和 = "và", chỉ nối danh từ / đại từ',
          examples: [
            { en: '{爸爸|bàba}{和|hé}{妈妈|māma}', ro: 'bàba hé māma', vi: 'bố và mẹ' },
            { en: '{我|wǒ}{和|hé}{王明|Wáng Míng}{是|shì}{朋友|péngyou}。', ro: 'Wǒ hé Wáng Míng shì péngyou.', vi: 'Tôi và Vương Minh là bạn.' },
            { en: '{哥哥|gēge}、{妹妹|mèimei}{和|hé}{我|wǒ}{是|shì}{学生|xuésheng}。', ro: 'Gēge, mèimei hé wǒ shì xuésheng.', vi: 'Anh trai, em gái và tôi là học sinh/sinh viên.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '谁 shéi giống 什么 (Bài 2): **đặt vào đúng vị trí** của người bạn muốn hỏi. Muốn hỏi phần sau 是 → 他是**谁**？; muốn hỏi chủ ngữ → **谁**是你哥哥？ 谁 + 的 = **"của ai"**: 谁的孩子？ — con của ai? **和** chỉ dùng để nối **từ** với **từ** (danh từ, đại từ). Tiếng Việt dùng "và" để nối cả hai câu ("tôi có anh trai **và** tôi có em gái") — tiếng Trung **không làm vậy** với 和; hãy tách thành hai vế bằng dấu phẩy, hoặc dùng 也: 我有哥哥，也有妹妹.',
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Thêm 吗 vào câu có 谁: ~~他是谁吗？~~ → **他是谁？**',
        'Đưa 谁 lên đầu theo kiểu tiếng Anh "Who is he?": ~~谁是他？~~ — câu này nghĩa khác ("ai là anh ta?"); câu tự nhiên là **他是谁？**',
        'Dùng 和 nối hai câu: ~~我有哥哥和我有妹妹。~~ → **我有哥哥，也有妹妹。** hoặc **我有哥哥和妹妹。**',
        'Đọc 和 thành hè/huò: trong nghĩa "và" luôn đọc **hé**.',
      ],
    },
    { t: 'rule', formula: '他是谁？ · 谁是…？ · 谁的 + N · A 和 B', vi: '谁 thay đúng chỗ người cần hỏi, không thêm 吗; 和 chỉ nối danh từ/đại từ, không nối hai câu.' },

    /* ── So sánh ── */
    { t: 'h', text: 'Đặt cạnh tiếng Việt — giống và khác' },
    {
      t: 'table',
      caption: 'Câu Bài 4 so với tiếng Việt',
      head: ['Tiếng Việt', 'Tiếng Trung', 'Giống / khác'],
      rows: [
        ['Tôi **có** một anh trai.', '我**有**一个哥哥。', 'Giống: "có" = 有, đứng sau chủ ngữ. Khác: tiếng Trung bắt buộc lượng từ 个.'],
        ['Tôi **không có** chị gái.', '我**没有**姐姐。', 'Giống: "không có" = 没有. Khác: không bao giờ 不有.'],
        ['Bạn có **mấy** anh trai?', '你有**几个**哥哥？', 'Giống: từ hỏi đứng chỗ con số. Khác: 几 phải có lượng từ.'],
        ['Tên **của tôi**', '**我的**名字', 'Khác: người sở hữu đứng TRƯỚC.'],
        ['Bố **tôi**', '**我**爸爸', 'Khác: đại từ đứng trước, không cần 的.'],
        ['Anh ấy là **ai**?', '他是**谁**？', 'Giống hệt trật tự.'],
        ['Nhà tôi có năm **người**.', '我家有五**口**人。', 'Khác: thêm lượng từ 口 trước 人.'],
      ],
    },

    /* ── Tổng kết ── */
    { t: 'h', text: 'Tổng kết ngữ pháp Bài 4' },
    {
      t: 'table',
      head: ['Điểm', 'Công thức', 'Ví dụ', 'Dùng khi'],
      rows: [
        ['①', 'S + 有 / 没有 + N', '我有哥哥。我没有姐姐。', 'Có / không có'],
        ['②', 'số + 个 / 口 + N', '两个姐姐 · 五口人', 'Đếm người'],
        ['③', '几 + lượng từ + N？', '你有几个弟弟？', 'Hỏi mấy'],
        ['④', '家有几口人？', '我家有四口人。', 'Hỏi số người trong nhà'],
        ['⑤', 'A + 的 + B · đại từ + người thân', '我的名字 · 我妈妈', 'Nói "của ai"'],
        ['⑥', '谁 · A 和 B', '他是谁？爸爸和妈妈', 'Hỏi ai · liệt kê'],
      ],
    },
    {
      t: 'build',
      id: 'b4-np-ghep',
      title: 'Ghép câu — Bài 4',
      items: [
        { vi: 'Tôi có một anh trai.', chips: ['{我|wǒ}', '{有|yǒu}', '{一|yí}', '{个|ge}', '{哥哥|gēge}', '{口|kǒu}'], answer: ['{我|wǒ}', '{有|yǒu}', '{一|yí}', '{个|ge}', '{哥哥|gēge}'], ro: 'Wǒ yǒu yí ge gēge.' },
        { vi: 'Tôi không có em gái.', chips: ['{我|wǒ}', '{没有|méiyǒu}', '{妹妹|mèimei}', '{不|bù}'], answer: ['{我|wǒ}', '{没有|méiyǒu}', '{妹妹|mèimei}'], ro: 'Wǒ méiyǒu mèimei.' },
        { vi: 'Nhà bạn có mấy người?', chips: ['{你|nǐ}', '{家|jiā}', '{有|yǒu}', '{几|jǐ}', '{口|kǒu}', '{人|rén}', '{吗|ma}'], answer: ['{你|nǐ}', '{家|jiā}', '{有|yǒu}', '{几|jǐ}', '{口|kǒu}', '{人|rén}'], ro: 'Nǐ jiā yǒu jǐ kǒu rén?' },
        { vi: 'Bạn có mấy chị gái?', chips: ['{你|nǐ}', '{有|yǒu}', '{几|jǐ}', '{个|ge}', '{姐姐|jiějie}', '{口|kǒu}'], answer: ['{你|nǐ}', '{有|yǒu}', '{几|jǐ}', '{个|ge}', '{姐姐|jiějie}'], ro: 'Nǐ yǒu jǐ ge jiějie?' },
        { vi: 'Anh ấy là ai?', chips: ['{他|tā}', '{是|shì}', '{谁|shéi}', '{吗|ma}'], answer: ['{他|tā}', '{是|shì}', '{谁|shéi}'], ro: 'Tā shì shéi?' },
        { vi: 'Mẹ tôi là bác sĩ.', chips: ['{我|wǒ}', '{妈妈|māma}', '{是|shì}', '{医生|yīshēng}', '{有|yǒu}'], answer: ['{我|wǒ}', '{妈妈|māma}', '{是|shì}', '{医生|yīshēng}'], ro: 'Wǒ māma shì yīshēng.' },
        { vi: 'Mẹ của Vương Minh là bác sĩ.', chips: ['{王明|Wáng Míng}', '{的|de}', '{妈妈|māma}', '{是|shì}', '{医生|yīshēng}'], answer: ['{王明|Wáng Míng}', '{的|de}', '{妈妈|māma}', '{是|shì}', '{医生|yīshēng}'], ro: 'Wáng Míng de māma shì yīshēng.' },
        { vi: 'Đại Vĩ có hai chị gái.', chips: ['{大伟|Dàwěi}', '{有|yǒu}', '{两|liǎng}', '{个|ge}', '{姐姐|jiějie}', '{二|èr}'], answer: ['{大伟|Dàwěi}', '{有|yǒu}', '{两|liǎng}', '{个|ge}', '{姐姐|jiějie}'], ro: 'Dàwěi yǒu liǎng ge jiějie.' },
        { vi: 'Tôi và Vương Minh là bạn.', chips: ['{我|wǒ}', '{和|hé}', '{王明|Wáng Míng}', '{是|shì}', '{朋友|péngyou}', '{的|de}'], answer: ['{我|wǒ}', '{和|hé}', '{王明|Wáng Míng}', '{是|shì}', '{朋友|péngyou}'], alt: [['{王明|Wáng Míng}', '{和|hé}', '{我|wǒ}', '{是|shì}', '{朋友|péngyou}']], ro: 'Wǒ hé Wáng Míng shì péngyou.' },
        { vi: 'Tên của anh ấy là gì?', chips: ['{他|tā}', '{的|de}', '{名字|míngzi}', '{叫|jiào}', '{什么|shénme}'], answer: ['{他|tā}', '{的|de}', '{名字|míngzi}', '{叫|jiào}', '{什么|shénme}'], ro: 'Tā de míngzi jiào shénme?' },
      ],
    },
    {
      t: 'quiz',
      id: 'b4-np-dien',
      title: 'Điền một chữ vào （　）: 有 · 没 · 几 · 个 · 口 · 的 · 谁 · 和 · 两',
      kind: 'fill',
      grammar: 'S + 有/没有 + N · 几 + lượng từ · 家有几口人 · A 的 B · 谁 · A 和 B',
      items: [
        { q: '{我|wǒ}（　）{一|yí}{个|ge}{哥哥|gēge}。', answers: ['有'], hint: 'Tôi CÓ một anh trai.' },
        { q: '{我|wǒ}（　）{有|yǒu}{姐姐|jiějie}。', answers: ['没'], hint: 'Tôi KHÔNG có chị gái.' },
        { q: '{你|nǐ}{有|yǒu}（　）{个|ge}{弟弟|dìdi}？', answers: ['几'], hint: 'Bạn có MẤY em trai?' },
        { q: '{我|wǒ}{有|yǒu}{两|liǎng}（　）{妹妹|mèimei}。', answers: ['个'], hint: 'Lượng từ chung' },
        { q: '{你|nǐ}{家|jiā}{有|yǒu}{几|jǐ}（　）{人|rén}？', answers: ['口'], hint: 'Đếm người trong nhà' },
        { q: '{王明|Wáng Míng}（　）{妈妈|māma}{是|shì}{医生|yīshēng}。', answers: ['的'], hint: 'Mẹ CỦA Vương Minh' },
        { q: '{她|tā}{是|shì}（　）？', answers: ['谁'], hint: 'Cô ấy là AI?' },
        { q: '{爸爸|bàba}、{妈妈|māma}（　）{我|wǒ}', answers: ['和'], hint: 'bố, mẹ VÀ tôi' },
        { q: '{大伟|Dàwěi}{有|yǒu}（　）{个|ge}{姐姐|jiějie}。', answers: ['两'], hint: 'HAI chị gái (trước lượng từ)' },
        { q: '{他|tā}（　）{名字|míngzi}{叫|jiào}{伊万|Yīwàn}。', answers: ['的'], hint: 'Tên CỦA anh ấy' },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-np-trac-nghiem',
      title: 'Trắc nghiệm ngữ pháp Bài 4',
      items: [
        m('"Tôi không có anh trai." — câu nào đúng?', ['我不有哥哥。', '我没有哥哥。', '我不是哥哥。', '我没哥哥有。'], 1, 'Phủ định của 有 là 没有.'),
        m('"Bạn có mấy em gái?" — câu nào đúng?', ['你有几妹妹？', '你有几个妹妹？', '你有妹妹几个？', '你有几个妹妹吗？'], 1, '几 + lượng từ + danh từ, không thêm 吗.'),
        m('"Nhà tôi có bốn người." — chọn câu tự nhiên nhất:', ['我家是四口人。', '我家有四个人们。', '我家有四口人。', '我的家有四口。'], 2, 'Mẫu cố định: 家有 + số + 口人.'),
        m('"Tên của tôi" là:', ['名字的我', '我的名字', '的我名字', '我名字的'], 1, 'Người sở hữu + 的 + vật.'),
        m('Câu nào **tự nhiên nhất** để nói "bố tôi"?', ['我的的爸爸', '爸爸我', '我爸爸', '爸爸的我'], 2, 'Đại từ + người thân: bỏ 的 → 我爸爸.'),
        m('"Hai chị gái" là:', ['二个姐姐', '两个姐姐', '两口姐姐', '二姐姐个'], 1, 'Hai + lượng từ → 两; đếm anh chị em dùng 个.'),
        m('Câu nào **sai**?', ['你有没有哥哥？', '你有哥哥吗？', '你有没有哥哥吗？', '你有几个哥哥？'], 2, 'Đã dùng 有没有 thì không thêm 吗.'),
        m('Hỏi "Cô ấy là ai?":', ['她是谁？', '谁她是？', '她是谁吗？', '她谁是？'], 0, '谁 đứng chỗ người cần hỏi, không thêm 吗.'),
        m('"Tôi có anh trai và có em gái" — câu nào đúng?', ['我有哥哥和我有妹妹。', '我有哥哥，也有妹妹。', '我有哥哥也妹妹。', '我和有哥哥妹妹。'], 1, '和 không nối hai câu; dùng 也 hoặc 我有哥哥和妹妹.'),
        m('一个 đọc thế nào?', ['yī gè', 'yì ge', 'yí ge', 'yǐ ge'], 2, '个 gốc thanh 4 → 一 đọc yí; 个 sau số đọc nhẹ.'),
      ],
    },
  ],
};

/* ══════════════════════════ 4. CHỮ HÁN ══════════════════════════ */

const HAN_TU: Lesson = {
  id: 'b4-han-tu',
  kind: 'kanji',
  title: 'Chữ Hán Bài 4 — 12 chữ: 家 爸 妈 哥 姐 弟 妹 有 没 几 个 的',
  goal: 'Nhận mặt, đọc đúng và viết được 12 chữ Hán về gia đình, có/không có và lượng từ; dùng bộ thủ 女, 父, 宀, 氵 để đoán nghĩa.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Cách học chữ Hán bài này',
      items: [
        '12 chữ — mỗi chữ: **xem thứ tự nét → tô theo → tự viết** (khối tập viết cuối bài).',
        '**Bộ 女** (nữ) có trong 妈, 姐, 妹 — ba người nữ trong nhà. 爸 có **bộ 父** (cha) ở trên.',
        '**Phần gợi âm**: 妈 có 马 (mǎ) → mā; 爸 có 巴 (bā) → bà; 妹 có 未 (wèi) → mèi. Nhìn phần gợi âm đoán được cách đọc gần đúng.',
        '**家** = mái nhà 宀 + con lợn 豕 — một trong những chữ có câu chuyện hay nhất.',
      ],
    },
    {
      t: 'table',
      caption: '12 chữ Hán của Bài 4',
      head: ['Chữ', 'Pinyin', 'Hán Việt', 'Bộ thủ', 'Số nét', 'Nghĩa', 'Từ ví dụ'],
      rows: [
        ['家', 'jiā', 'GIA', '宀 (mái nhà)', '10', 'nhà, gia đình', '我家 · 国家'],
        ['爸', 'bà', 'BA', '父 (cha)', '8', 'bố', '爸爸'],
        ['妈', 'mā', 'MA', '女 (nữ)', '6', 'mẹ', '妈妈'],
        ['哥', 'gē', 'CA', '口 (miệng)', '10', 'anh trai', '哥哥'],
        ['姐', 'jiě', 'THƯ', '女 (nữ)', '8', 'chị gái', '姐姐 · 小姐'],
        ['弟', 'dì', 'ĐỆ', '弓 (cung)', '7', 'em trai', '弟弟'],
        ['妹', 'mèi', 'MUỘI', '女 (nữ)', '8', 'em gái', '妹妹'],
        ['有', 'yǒu', 'HỮU', '月 (thịt — biến thể của 肉)', '6', 'có', '有 · 没有'],
        ['没', 'méi', 'MỘT', '氵 (ba chấm thuỷ — nước)', '7', 'không (có)', '没有 · 没关系'],
        ['几', 'jǐ', 'KỶ', '几 (ghế nhỏ — tự là bộ)', '2', 'mấy', '几个 · 几口人'],
        ['个', 'gè', 'CÁ', '人 (người)', '3', '(lượng từ chung)', '一个 · 两个'],
        ['的', 'de', 'ĐÍCH', '白 (trắng)', '8', 'của', '我的 · 他的'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ bằng hình và bộ thủ',
      items: [
        '**家** = **宀** (mái nhà) + **豕** (con lợn): người xưa nuôi lợn ngay dưới mái nhà — có lợn là có **nhà**, có của. → GIA.',
        '**爸** = **父** (cha — hình bàn tay cầm rìu/gậy) ở trên + **巴** (bā) gợi âm ở dưới. Chú ý 父 bẹt lại để nhường chỗ.',
        '**妈 / 姐 / 妹**: đều có **女** bên trái (người nữ). Bên phải là phần gợi âm: 马 mǎ → **mā**; 且 qiě → **jiě**; 未 wèi → **mèi**.',
        '**哥** = **可** chồng lên **可**: hai chữ 可 xếp tầng — anh trai "đứng trên" em. Viết 可 trên hơi nhỏ, 可 dưới có nét sổ móc dài.',
        '**弟** — hình sợi dây quấn quanh cái cọc theo **thứ tự** từng vòng → thứ bậc → người đứng sau: em trai. Bắt đầu bằng hai chấm 丷.',
        '**有** = **𠂇** (bàn tay) + **月** (thịt — biến thể của 肉): tay cầm miếng thịt → **có** (của ăn). → HỮU.',
        '**没** = **氵** (nước) + **几** + **又** (tay): vật chìm xuống nước, biến mất → **không còn, không có**. → MỘT (mai một).',
        '**几** — hình cái **ghế/bàn nhỏ** (茶几 trà kỷ — bàn uống trà). Chỉ 2 nét: phẩy, rồi ngang–cong–móc.',
        '**个** = **人** + một nét sổ: mỗi người một cây gậy → từng **cái**, từng người. → CÁ (cá nhân).',
        '**的** = **白** (trắng) + **勺** (cái muôi). Nghĩa gốc "sáng rõ, đích (bia bắn)" — ĐÍCH. Làm trợ từ "của" thì đọc **de** nhẹ.',
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận: các chữ dễ viết nhầm',
      items: [
        '**姐 ↔ 妹**: cùng bộ 女; 姐 bên phải là **且** (như cái thang 3 bậc), 妹 bên phải là **未** (cây có cành).',
        '**没 ↔ 设**: 没 bên trái là **氵** (3 chấm nước); 设 (shè — thiết lập) bên trái là **讠** (lời nói).',
        '**几 ↔ 九**: 几 (jǐ — mấy) nét đầu là phẩy tách riêng; 九 (jiǔ — chín) nét phẩy xuyên qua nét ngang móc.',
        '**个 ↔ 介**: 个 dưới mái 人 chỉ có **một** nét sổ; 介 (jiè, trong 介绍 giới thiệu) có hai nét.',
        '**有 ↔ 右**: 有 dưới là **月**; 右 (yòu — bên phải) dưới là **口**.',
      ],
    },
    {
      t: 'readkanji',
      id: 'b4-doc-chu',
      title: 'Đọc chữ trần — không pinyin',
      note: 'Như đề HSK: chữ không có pinyin. Đọc to cả câu, nhớ: chữ lặp sau đọc nhẹ (bàba, gēge); 一个 → yí ge; 有几 → yóu jǐ; 没有 → méiyǒu. Rồi mới bấm hiện pinyin + nghe.',
      items: [
        { text: '{我|wǒ}{家|jiā}{有|yǒu}{五|wǔ}{口|kǒu}{人|rén}。', ro: 'Wǒ jiā yǒu wǔ kǒu rén.', vi: 'Nhà tôi có năm người.' },
        { text: '{你|nǐ}{家|jiā}{有|yǒu}{几|jǐ}{口|kǒu}{人|rén}？', ro: 'Nǐ jiā yǒu jǐ kǒu rén?', vi: 'Nhà bạn có mấy người?' },
        { text: '{我|wǒ}{爸爸|bàba}{是|shì}{医生|yīshēng}。', ro: 'Wǒ bàba shì yīshēng.', vi: 'Bố tôi là bác sĩ.' },
        { text: '{我|wǒ}{妈妈|māma}{是|shì}{老师|lǎoshī}。', ro: 'Wǒ māma shì lǎoshī.', vi: 'Mẹ tôi là giáo viên.' },
        { text: '{我|wǒ}{有|yǒu}{一|yí}{个|ge}{哥哥|gēge}。', ro: 'Wǒ yǒu yí ge gēge.', vi: 'Tôi có một anh trai.' },
        { text: '{我|wǒ}{没有|méiyǒu}{姐姐|jiějie}。', ro: 'Wǒ méiyǒu jiějie.', vi: 'Tôi không có chị gái.' },
        { text: '{你|nǐ}{有|yǒu}{几|jǐ}{个|ge}{弟弟|dìdi}？', ro: 'Nǐ yǒu jǐ ge dìdi?', vi: 'Bạn có mấy em trai?' },
        { text: '{她|tā}{是|shì}{我|wǒ}{妹妹|mèimei}。', ro: 'Tā shì wǒ mèimei.', vi: 'Em ấy là em gái tôi.' },
        { text: '{他|tā}{是|shì}{谁|shéi}？', ro: 'Tā shì shéi?', vi: 'Anh ấy là ai?' },
        { text: '{王明|Wáng Míng}{的|de}{妈妈|māma}{是|shì}{医生|yīshēng}。', ro: 'Wáng Míng de māma shì yīshēng.', vi: 'Mẹ của Vương Minh là bác sĩ.' },
        { text: '{大伟|Dàwěi}{有|yǒu}{两|liǎng}{个|ge}{姐姐|jiějie}。', ro: 'Dàwěi yǒu liǎng ge jiějie.', vi: 'Đại Vĩ có hai chị gái.' },
        { text: '{你|nǐ}{有|yǒu}{没有|méiyǒu}{哥哥|gēge}？', ro: 'Nǐ yǒu méiyǒu gēge?', vi: 'Bạn có anh trai không?' },
        { text: '{他|tā}{的|de}{朋友|péngyou}{是|shì}{中国|Zhōngguó}{人|rén}。', ro: 'Tā de péngyou shì Zhōngguó rén.', vi: 'Bạn của anh ấy là người Trung Quốc.' },
      ],
    },
    {
      t: 'table',
      caption: 'Chữ của bài trong từ ghép khác — đoán nghĩa nhờ âm Hán Việt (chỉ để nhận mặt, chưa cần học)',
      head: ['Từ', 'Pinyin', 'Hán Việt', 'Nghĩa'],
      rows: [
        ['国家', 'guójiā', 'QUỐC GIA', 'đất nước, quốc gia'],
        ['家人', 'jiārén', 'GIA NHÂN', 'người nhà (≠ "gia nhân" = người hầu trong tiếng Việt!)'],
        ['兄弟', 'xiōngdì', 'HUYNH ĐỆ', 'anh em trai'],
        ['有名', 'yǒumíng', 'HỮU DANH', 'nổi tiếng'],
        ['人口', 'rénkǒu', 'NHÂN KHẨU', 'dân số'],
        ['个人', 'gèrén', 'CÁ NHÂN', 'cá nhân'],
        ['目的', 'mùdì', 'MỤC ĐÍCH', 'mục đích (的 ở đây đọc dì)'],
      ],
    },
    {
      t: 'readkanji',
      id: 'b4-doc-doan',
      title: 'Đọc to cả đoạn — chữ trần',
      note: 'Mỗi đoạn là một người tự giới thiệu gia đình. Nhìn 20 giây, đọc một hơi, rồi bấm hiện pinyin để tự chấm.',
      items: [
        { text: '{我|wǒ}{叫|jiào}{兰兰|Lánlan}。{我|wǒ}{家|jiā}{有|yǒu}{五|wǔ}{口|kǒu}{人|rén}：{爸爸|bàba}、{妈妈|māma}、{哥哥|gēge}、{妹妹|mèimei}{和|hé}{我|wǒ}。', ro: 'Wǒ jiào Lánlan. Wǒ jiā yǒu wǔ kǒu rén: bàba, māma, gēge, mèimei hé wǒ.', vi: 'Tôi tên là Lan. Nhà tôi có năm người: bố, mẹ, anh trai, em gái và tôi.' },
        { text: '{我|wǒ}{是|shì}{王明|Wáng Míng}。{我|wǒ}{没有|méiyǒu}{哥哥|gēge}，{也|yě}{没有|méiyǒu}{妹妹|mèimei}。{我|wǒ}{爸爸|bàba}{是|shì}{老师|lǎoshī}，{我|wǒ}{妈妈|māma}{是|shì}{医生|yīshēng}。', ro: 'Wǒ shì Wáng Míng. Wǒ méiyǒu gēge, yě méiyǒu mèimei. Wǒ bàba shì lǎoshī, wǒ māma shì yīshēng.', vi: 'Tôi là Vương Minh. Tôi không có anh trai, cũng không có em gái. Bố tôi là giáo viên, mẹ tôi là bác sĩ.' },
        { text: '{大伟|Dàwěi}{家|jiā}{有|yǒu}{六|liù}{口|kǒu}{人|rén}。{他|tā}{有|yǒu}{两|liǎng}{个|ge}{姐姐|jiějie}，{一|yí}{个|ge}{弟弟|dìdi}。{他|tā}{弟弟|dìdi}{是|shì}{学生|xuésheng}。', ro: 'Dàwěi jiā yǒu liù kǒu rén. Tā yǒu liǎng ge jiějie, yí ge dìdi. Tā dìdi shì xuésheng.', vi: 'Nhà Đại Vĩ có sáu người. Cậu ấy có hai chị gái, một em trai. Em trai cậu ấy là học sinh.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-han-tu-nhan',
      title: 'Nhận mặt chữ',
      items: [
        m('Chữ nào nghĩa là "nhà"?', ['家', '爸', '哥', '的'], 0, '家 = mái nhà 宀 + con lợn 豕.'),
        m('Ba chữ nào cùng có bộ 女?', ['妈 · 姐 · 妹', '爸 · 哥 · 弟', '有 · 没 · 个', '家 · 几 · 的'], 0, '妈, 姐, 妹 — ba người nữ trong gia đình.'),
        m('Bộ thủ ở trên của 爸 là:', ['巴', '父', '女', '宀'], 1, '爸 = 父 (cha) + 巴 (gợi âm bā).'),
        m('没 có bộ thủ nào?', ['讠 — lời nói', '氵 — nước', '亻 — người', '女 — nữ'], 1, '没 bên trái là 氵 (ba chấm thuỷ).'),
        m('Âm Hán Việt của 有 là:', ['HỮU', 'MỘT', 'GIA', 'KHẨU'], 0, '有 = HỮU (sở hữu).'),
        m('Chữ nào chỉ có 2 nét?', ['个', '几', '口', '有'], 1, '几: phẩy + ngang cong móc (2 nét). 个 3 nét, 口 3 nét, 有 6 nét.'),
        m('Chữ nào nghĩa là "em gái"?', ['姐', '妹', '妈', '她'], 1, '妹 = em gái (MUỘI).'),
        m('哥 được ghép từ:', ['口 + 口', '可 + 可', '丁 + 口', '可 + 口'], 1, '哥 = hai chữ 可 chồng lên nhau.'),
        m('Trong 我的名字, chữ 的 đọc là:', ['dì', 'dí', 'de', 'dē'], 2, '的 làm trợ từ "của" luôn đọc de (thanh nhẹ).'),
      ],
    },
    {
      t: 'write',
      id: 'b4-viet-chu',
      title: 'Tập viết 12 chữ của Bài 4',
      note: 'Thứ tự gợi ý: chữ ít nét trước. Bấm ▶ xem nét → tô theo → tự viết 3 lần, đọc to pinyin mỗi lần viết. Chú ý: 有 viết nét phẩy trước nét ngang; 弟 bắt đầu bằng hai chấm; 家 nét cuối của 豕 là nét mác dài.',
      chars: ['几', '个', '妈', '有', '没', '弟', '爸', '姐', '妹', '的', '哥', '家'],
    },
  ],
};

/* ══════════════════════════ 5. NGHE ══════════════════════════ */

const NGHE: Lesson = {
  id: 'b4-nghe',
  kind: 'listening',
  title: 'Luyện nghe Bài 4 — kiểu đề HSK 1',
  goal: 'Nghe hiểu người nói kể về gia đình: số người trong nhà, có/không có anh chị em, mấy người, bố mẹ làm nghề gì, ai là ai.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Cách làm bài nghe',
      items: [
        'Bấm **nghe cả bài** 2 lần: lần 1 chỉ nghe, lần 2 ghi chú → làm câu hỏi → rồi mới mở **lời thoại**.',
        'Từ khoá Bài 4: **有 / 没有 · 几个 / 几口 · con số 1–10 · 爸爸 妈妈 哥哥 姐姐 弟弟 妹妹 · 的 · 谁**.',
        'Nghe **没有** → thông tin bị phủ định: 我**没有**姐姐 = KHÔNG có chị. Đừng chọn đáp án có "chị gái".',
        'Ghi **con số** ngay khi nghe (viết 1, 2, 3… ra giấy) — đề hay hỏi "mấy người", "mấy anh chị em".',
        '**哥哥 / 姐姐** (anh/chị — lớn hơn) và **弟弟 / 妹妹** (em — nhỏ hơn): nghe kỹ phụ âm đầu g / j / d / m.',
      ],
    },
    {
      t: 'note',
      title: 'Dạng đề HSK 1 (phần Nghe — 听力) dùng trong bài này',
      items: [
        '**Phần 1**: nghe một cụm từ/câu ngắn, xem tranh, chọn **đúng (√) / sai (×)** → *Bài nghe 1* (tranh thay bằng mô tả chữ).',
        '**Phần 2–3**: nghe hội thoại ngắn, chọn tranh khớp → *Bài nghe 2*.',
        '**Phần 4**: nghe một câu/đoạn, trả lời câu hỏi chọn 1 trong 3 → *Bài nghe 3, 4*.',
      ],
    },

    { t: 'h', text: 'Bài nghe 1 — Đúng hay sai?' },
    {
      t: 'listen',
      id: 'b4-nghe-1',
      title: 'Năm cụm từ ngắn',
      note: 'Mỗi câu hỏi mô tả một "bức tranh". Nghe cụm từ → nếu khớp với tranh chọn Đúng, không khớp chọn Sai.',
      lines: [
        { who: 'Câu 1', voice: 'zh-nu', text: '{妈妈|māma}', ro: 'māma', vi: 'mẹ' },
        { who: 'Câu 2', voice: 'zh-nam', text: '{三|sān}{个|ge}{孩子|háizi}', ro: 'sān ge háizi', vi: 'ba đứa trẻ' },
        { who: 'Câu 3', voice: 'zh-nu', text: '{哥哥|gēge}', ro: 'gēge', vi: 'anh trai' },
        { who: 'Câu 4', voice: 'zh-nam', text: '{医生|yīshēng}', ro: 'yīshēng', vi: 'bác sĩ' },
        { who: 'Câu 5', voice: 'zh-nu', text: '{两|liǎng}{个|ge}{女儿|nǚ\'ér}', ro: "liǎng ge nǚ'ér", vi: 'hai cô con gái' },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-nghe-q1',
      title: 'Câu hỏi bài nghe 1 — Đúng (√) hay Sai (×)?',
      items: [
        m('Câu 1 — Tranh: một người phụ nữ đang bế em bé.', ['Đúng (√)', 'Sai (×)'], 0, '妈妈 = mẹ → khớp tranh.'),
        m('Câu 2 — Tranh: hai đứa trẻ đang chơi.', ['Đúng (√)', 'Sai (×)'], 1, 'Nghe 三个孩子 = BA đứa trẻ, tranh chỉ có hai.'),
        m('Câu 3 — Tranh: một cô gái trẻ đang cười.', ['Đúng (√)', 'Sai (×)'], 1, '哥哥 = anh trai (nam), tranh là cô gái.'),
        m('Câu 4 — Tranh: một người mặc áo blouse trắng, đeo ống nghe.', ['Đúng (√)', 'Sai (×)'], 0, '医生 = bác sĩ.'),
        m('Câu 5 — Tranh: một bé trai và một bé gái.', ['Đúng (√)', 'Sai (×)'], 1, '两个女儿 = hai con GÁI.'),
      ],
    },

    { t: 'h', text: 'Bài nghe 2 — Hội thoại ngắn: chọn tranh khớp' },
    {
      t: 'listen',
      id: 'b4-nghe-2',
      title: 'Bốn cặp hội thoại',
      note: 'Mỗi cặp: một câu hỏi, một câu trả lời. Nghe câu TRẢ LỜI để chọn.',
      lines: [
        { who: 'Cặp 1 — Nữ', voice: 'zh-nu', text: '{你|nǐ}{家|jiā}{有|yǒu}{几|jǐ}{口|kǒu}{人|rén}？', ro: 'Nǐ jiā yǒu jǐ kǒu rén?', vi: 'Nhà bạn có mấy người?' },
        { who: 'Cặp 1 — Nam', voice: 'zh-nam', text: '{四|sì}{口|kǒu}{人|rén}：{爸爸|bàba}、{妈妈|māma}、{妹妹|mèimei}{和|hé}{我|wǒ}。', ro: 'Sì kǒu rén: bàba, māma, mèimei hé wǒ.', vi: 'Bốn người: bố, mẹ, em gái và tôi.' },
        { who: 'Cặp 2 — Nam', voice: 'zh-nam', text: '{她|tā}{是|shì}{谁|shéi}？', ro: 'Tā shì shéi?', vi: 'Cô ấy là ai?' },
        { who: 'Cặp 2 — Nữ', voice: 'zh-nu', text: '{她|tā}{是|shì}{我|wǒ}{姐姐|jiějie}，{她|tā}{是|shì}{老师|lǎoshī}。', ro: 'Tā shì wǒ jiějie, tā shì lǎoshī.', vi: 'Chị ấy là chị gái tôi, chị ấy là giáo viên.' },
        { who: 'Cặp 3 — Nữ', voice: 'zh-nu', text: '{你|nǐ}{有|yǒu}{弟弟|dìdi}{吗|ma}？', ro: 'Nǐ yǒu dìdi ma?', vi: 'Bạn có em trai không?' },
        { who: 'Cặp 3 — Nam', voice: 'zh-nam', text: '{没有|méiyǒu}。{我|wǒ}{有|yǒu}{两|liǎng}{个|ge}{哥哥|gēge}。', ro: 'Méiyǒu. Wǒ yǒu liǎng ge gēge.', vi: 'Không có. Tôi có hai anh trai.' },
        { who: 'Cặp 4 — Nam', voice: 'zh-nam', text: '{您|nín}{有|yǒu}{几|jǐ}{个|ge}{孩子|háizi}？', ro: 'Nín yǒu jǐ ge háizi?', vi: 'Bà có mấy người con?' },
        { who: 'Cặp 4 — Nữ', voice: 'zh-nu', text: '{一|yí}{个|ge}，{一|yí}{个|ge}{儿子|érzi}。', ro: 'Yí ge, yí ge érzi.', vi: 'Một đứa, một cậu con trai.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-nghe-q2',
      title: 'Câu hỏi bài nghe 2 — chọn "tranh" đúng',
      items: [
        m('Cặp 1: ảnh gia đình người nam là ảnh nào?', ['Bố, mẹ, một bé gái và anh ấy (4 người)', 'Bố, mẹ và anh ấy (3 người)', 'Bố, mẹ, hai em gái và anh ấy (5 người)'], 0, '四口人：爸爸、妈妈、妹妹和我。'),
        m('Cặp 2: "cô ấy" trong tranh là ai?', ['Một nữ bác sĩ', 'Một cô giáo đứng trên bục giảng', 'Một bé gái học sinh'], 1, '她是我姐姐，她是老师 — chị gái, là giáo viên.'),
        m('Cặp 3: anh chị em của người nam?', ['Một em trai', 'Hai anh trai', 'Hai em trai'], 1, '没有 (không có em trai). 我有两个哥哥.'),
        m('Cặp 4: người phụ nữ có…', ['một con trai', 'một con gái', 'hai đứa con'], 0, '一个，一个儿子.'),
      ],
    },

    { t: 'h', text: 'Bài nghe 3 — Ảnh gia đình của Anna' },
    {
      t: 'listen',
      id: 'b4-nghe-3',
      title: 'Lan hỏi Anna về tấm ảnh',
      lines: [
        { who: '兰兰', voice: 'zh-nu', text: '{安娜|Ānnà}，{他|tā}{是|shì}{谁|shéi}？', ro: 'Ānnà, tā shì shéi?', vi: 'Anna, anh này là ai?' },
        { who: '安娜', voice: 'zh-nu', text: '{他|tā}{是|shì}{我|wǒ}{哥哥|gēge}，{他|tā}{叫|jiào}{伊万|Yīwàn}。', ro: 'Tā shì wǒ gēge, tā jiào Yīwàn.', vi: 'Anh ấy là anh trai mình, tên là Ivan.' },
        { who: '兰兰', voice: 'zh-nu', text: '{你|nǐ}{哥哥|gēge}{是|shì}{学生|xuésheng}{吗|ma}？', ro: 'Nǐ gēge shì xuésheng ma?', vi: 'Anh bạn là sinh viên à?' },
        { who: '安娜', voice: 'zh-nu', text: '{不|bú}{是|shì}，{他|tā}{是|shì}{医生|yīshēng}。{我|wǒ}{妈妈|māma}{也|yě}{是|shì}{医生|yīshēng}。', ro: 'Bú shì, tā shì yīshēng. Wǒ māma yě shì yīshēng.', vi: 'Không phải, anh ấy là bác sĩ. Mẹ mình cũng là bác sĩ.' },
        { who: '兰兰', voice: 'zh-nu', text: '{你|nǐ}{爸爸|bàba}{呢|ne}？', ro: 'Nǐ bàba ne?', vi: 'Còn bố bạn?' },
        { who: '安娜', voice: 'zh-nu', text: '{我|wǒ}{爸爸|bàba}{是|shì}{老师|lǎoshī}。{我|wǒ}{家|jiā}{有|yǒu}{四|sì}{口|kǒu}{人|rén}。', ro: 'Wǒ bàba shì lǎoshī. Wǒ jiā yǒu sì kǒu rén.', vi: 'Bố mình là giáo viên. Nhà mình có bốn người.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-nghe-q3',
      title: 'Câu hỏi bài nghe 3',
      items: [
        m('伊万是谁？(Ivan là ai?)', ['安娜的弟弟', '安娜的哥哥', '安娜的朋友'], 1, '他是我哥哥，他叫伊万。'),
        m('Ivan làm nghề gì?', ['学生', '老师', '医生'], 2, '不是，他是医生。'),
        m('Trong nhà Anna, những ai là bác sĩ?', ['Bố và anh trai', 'Mẹ và anh trai', 'Chỉ có mẹ'], 1, '他是医生。我妈妈也是医生。'),
        m('安娜的爸爸是…', ['医生', '老师', '老板'], 1, '我爸爸是老师。'),
        m('安娜家有几口人？', ['三口', '四口', '五口'], 1, '我家有四口人。'),
      ],
    },

    { t: 'h', text: 'Bài nghe 4 — Vương Minh kể về gia đình' },
    {
      t: 'listen',
      id: 'b4-nghe-4',
      title: 'Một đoạn tự giới thiệu',
      note: 'Một người nói liên tục. Ghi lại: số người, ai làm nghề gì, có/không có anh chị em.',
      lines: [
        { who: '王明', voice: 'zh-nam', text: '{大家|dàjiā}{好|hǎo}！{我|wǒ}{叫|jiào}{王明|Wáng Míng}，{我|wǒ}{是|shì}{北京|Běijīng}{人|rén}。', ro: 'Dàjiā hǎo! Wǒ jiào Wáng Míng, wǒ shì Běijīng rén.', vi: 'Chào mọi người! Tôi tên là Vương Minh, tôi là người Bắc Kinh.' },
        { who: '王明', voice: 'zh-nam', text: '{我|wǒ}{家|jiā}{有|yǒu}{三|sān}{口|kǒu}{人|rén}：{爸爸|bàba}、{妈妈|māma}{和|hé}{我|wǒ}。', ro: 'Wǒ jiā yǒu sān kǒu rén: bàba, māma hé wǒ.', vi: 'Nhà tôi có ba người: bố, mẹ và tôi.' },
        { who: '王明', voice: 'zh-nam', text: '{我|wǒ}{没有|méiyǒu}{哥哥|gēge}、{姐姐|jiějie}，{也|yě}{没有|méiyǒu}{弟弟|dìdi}、{妹妹|mèimei}。', ro: 'Wǒ méiyǒu gēge, jiějie, yě méiyǒu dìdi, mèimei.', vi: 'Tôi không có anh, chị, cũng không có em trai, em gái.' },
        { who: '王明', voice: 'zh-nam', text: '{我|wǒ}{爸爸|bàba}{是|shì}{老师|lǎoshī}，{我|wǒ}{妈妈|māma}{是|shì}{医生|yīshēng}。', ro: 'Wǒ bàba shì lǎoshī, wǒ māma shì yīshēng.', vi: 'Bố tôi là giáo viên, mẹ tôi là bác sĩ.' },
        { who: '王明', voice: 'zh-nam', text: '{我|wǒ}{有|yǒu}{很|hěn}{多|duō}{朋友|péngyou}：{兰兰|Lánlan}、{大伟|Dàwěi}{和|hé}{安娜|Ānnà}。{我|wǒ}{很|hěn}{高兴|gāoxìng}！', ro: 'Wǒ yǒu hěn duō péngyou: Lánlan, Dàwěi hé Ānnà. Wǒ hěn gāoxìng!', vi: 'Tôi có rất nhiều bạn: Lan, Đại Vĩ và Anna. Tôi rất vui!' },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-nghe-q4',
      title: 'Câu hỏi bài nghe 4',
      items: [
        m('王明是哪国人？', ['越南人', '中国人', '美国人'], 1, '我是北京人 — người Bắc Kinh, tức là người Trung Quốc.'),
        m('王明家有几口人？', ['两口', '三口', '四口'], 1, '我家有三口人。'),
        m('王明有没有兄弟姐妹 (anh chị em)?', ['Có một anh trai', 'Có một em gái', 'Không có ai'], 2, '我没有哥哥、姐姐，也没有弟弟、妹妹。'),
        m('王明的妈妈是…', ['老师', '医生', '学生'], 1, '我妈妈是医生。'),
        m('"很多朋友" nghĩa là:', ['rất nhiều bạn', 'rất ít bạn', 'bạn rất tốt'], 0, '很多 = rất nhiều (多 duō — nhiều, học kỹ ở Bài 5).'),
      ],
    },
  ],
};

/* ══════════════════════════ 6. NÓI ══════════════════════════ */

const NOI: Lesson = {
  id: 'b4-noi',
  kind: 'speaking',
  title: 'Luyện nói Bài 4 — giới thiệu gia đình',
  goal: 'Nói trôi chảy và đúng thanh 12 câu then chốt về gia đình, tự giới thiệu gia đình mình trong 30 giây và trả lời câu hỏi của giám khảo/📞 CuongMini.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Luyện nói thế nào',
      items: [
        '**Phát âm từng câu**: bấm nghe mẫu → ghi âm → máy chấm từng chữ. Chữ dưới 80 điểm: nghe lại, để ý **thanh điệu** của chữ đó.',
        'Các chỗ khó của bài: **chữ lặp sau đọc nhẹ** (bàba, māma, gēge, jiějie, dìdi, mèimei) · **yóu jǐ** (有几 — 3+3) · **yí ge** (一个) · **liǎng ge** · **nǚ\'ér** (ü) · **shéi** (sh uốn lưỡi).',
        'Câu ngắn trước, câu dài sau. Danh sách này cũng là bộ câu cho 📞 **CuongMini** (gọi gia sư) trong bài.',
        'Cuối bài: trả lời 5 câu hỏi của giám khảo bằng **câu đầy đủ**, rồi thử nói một đoạn 30 giây về gia đình mình.',
      ],
    },
    {
      t: 'phatam',
      id: 'b4-noi-phat-am',
      title: '12 câu then chốt — ngắn đến dài',
      note: 'Pinyin ghi theo từ điển; khi đọc nhớ biến điệu 3+3 (有几 → yóu jǐ, 我有 → wó yǒu). Mỗi câu đọc 3 lần: chậm → bình thường → không nhìn pinyin.',
      items: [
        { text: '{爸爸|bàba}，{妈妈|māma}。', ipa: 'Bàba, māma.', vi: 'Bố, mẹ. — chữ thứ hai nhẹ' },
        { text: '{哥哥|gēge}，{姐姐|jiějie}。', ipa: 'Gēge, jiějie.', vi: 'Anh trai, chị gái. — gē cao, jiě trầm' },
        { text: '{弟弟|dìdi}，{妹妹|mèimei}。', ipa: 'Dìdi, mèimei.', vi: 'Em trai, em gái. — thanh 4 dứt khoát rồi nhẹ' },
        { text: '{他|tā}{是|shì}{谁|shéi}？', ipa: 'Tā shì shéi?', vi: 'Anh ấy là ai? — shì shéi uốn lưỡi' },
        { text: '{我|wǒ}{没有|méiyǒu}{姐姐|jiějie}。', ipa: 'Wǒ méiyǒu jiějie.', vi: 'Tôi không có chị gái.' },
        { text: '{我|wǒ}{有|yǒu}{一|yí}{个|ge}{哥哥|gēge}。', ipa: 'Wǒ yǒu yí ge gēge.', vi: 'Tôi có một anh trai. — wó yǒu yí ge' },
        { text: '{你|nǐ}{有|yǒu}{几|jǐ}{个|ge}{妹妹|mèimei}？', ipa: 'Nǐ yǒu jǐ ge mèimei?', vi: 'Bạn có mấy em gái? — ba thanh 3 liền: ní yóu jǐ' },
        { text: '{你|nǐ}{家|jiā}{有|yǒu}{几|jǐ}{口|kǒu}{人|rén}？', ipa: 'Nǐ jiā yǒu jǐ kǒu rén?', vi: 'Nhà bạn có mấy người? — yóu jí kǒu' },
        { text: '{我|wǒ}{家|jiā}{有|yǒu}{五|wǔ}{口|kǒu}{人|rén}。', ipa: 'Wǒ jiā yǒu wǔ kǒu rén.', vi: 'Nhà tôi có năm người. — yóu wú kǒu' },
        { text: '{我|wǒ}{爸爸|bàba}{是|shì}{医生|yīshēng}，{我|wǒ}{妈妈|māma}{是|shì}{老师|lǎoshī}。', ipa: 'Wǒ bàba shì yīshēng, wǒ māma shì lǎoshī.', vi: 'Bố tôi là bác sĩ, mẹ tôi là giáo viên.' },
        { text: '{她|tā}{有|yǒu}{两|liǎng}{个|ge}{孩子|háizi}：{一|yí}{个|ge}{儿子|érzi}，{一|yí}{个|ge}{女儿|nǚ\'ér}。', ipa: "Tā yǒu liǎng ge háizi: yí ge érzi, yí ge nǚ'ér.", vi: 'Cô ấy có hai đứa con: một trai, một gái.' },
        { text: '{我|wǒ}{家|jiā}{有|yǒu}{四|sì}{口|kǒu}{人|rén}：{爸爸|bàba}、{妈妈|māma}、{哥哥|gēge}{和|hé}{我|wǒ}。', ipa: 'Wǒ jiā yǒu sì kǒu rén: bàba, māma, gēge hé wǒ.', vi: 'Nhà tôi có bốn người: bố, mẹ, anh trai và tôi.' },
      ],
    },
    {
      t: 'note',
      title: 'Ba thanh 3 liền nhau — đọc thế nào?',
      items: [
        '**有几口** yǒu jǐ kǒu: ba chữ thanh 3 đứng liền. Cách đọc tự nhiên: hai chữ đầu lên thanh 2, chữ cuối giữ thanh 3 → **yóu jí kǒu**. (Không cần ghi ra pinyin — máy và người nghe đều chấp nhận.)',
        '**我有** wǒ yǒu → **wó yǒu**; **你有几** → **ní yóu jǐ**. Mẹo: đọc chậm theo cụm nghĩa (你 / 有几个 / 妹妹) rồi nhanh dần.',
        '**五口** wǔ kǒu → **wú kǒu**. **我姐姐** wǒ jiějie → **wó jiějie** (姐 thanh 3 vẫn kích hoạt biến điệu dù chữ sau nhẹ).',
      ],
    },

    { t: 'h', text: 'Hỏi — đáp mẫu với giám khảo' },
    {
      t: 'p',
      text: 'Phần **HSKK sơ cấp** hay có câu hỏi về **gia đình**. Giám khảo hỏi ngắn; bạn trả lời bằng **câu đầy đủ** và có thể thêm một ý. Đoạn mẫu dưới đây chỉ dùng từ Bài 1–4.',
    },
    {
      t: 'dialogue',
      title: 'Giám khảo ↔ thí sinh',
      lines: [
        { who: 'Giám khảo', role: 'examiner', text: '{你|nǐ}{家|jiā}{有|yǒu}{几|jǐ}{口|kǒu}{人|rén}？', ro: 'Nǐ jiā yǒu jǐ kǒu rén?', vi: 'Nhà em có mấy người?' },
        { who: 'Thí sinh', role: 'candidate', text: '{我|wǒ}{家|jiā}{有|yǒu}{五|wǔ}{口|kǒu}{人|rén}：{爸爸|bàba}、{妈妈|māma}、{哥哥|gēge}、{妹妹|mèimei}{和|hé}{我|wǒ}。', ro: 'Wǒ jiā yǒu wǔ kǒu rén: bàba, māma, gēge, mèimei hé wǒ.', vi: 'Nhà em có năm người: bố, mẹ, anh trai, em gái và em.' },
        { who: 'Giám khảo', role: 'examiner', text: '{你|nǐ}{爸爸|bàba}{是|shì}{老师|lǎoshī}{吗|ma}？', ro: 'Nǐ bàba shì lǎoshī ma?', vi: 'Bố em là giáo viên à?' },
        { who: 'Thí sinh', role: 'candidate', text: '{不|bú}{是|shì}，{我|wǒ}{爸爸|bàba}{是|shì}{医生|yīshēng}。{我|wǒ}{妈妈|māma}{是|shì}{老师|lǎoshī}。', ro: 'Bú shì, wǒ bàba shì yīshēng. Wǒ māma shì lǎoshī.', vi: 'Không ạ, bố em là bác sĩ. Mẹ em là giáo viên.' },
        { who: 'Giám khảo', role: 'examiner', text: '{你|nǐ}{有|yǒu}{姐姐|jiějie}{吗|ma}？', ro: 'Nǐ yǒu jiějie ma?', vi: 'Em có chị gái không?' },
        { who: 'Thí sinh', role: 'candidate', text: '{我|wǒ}{没有|méiyǒu}{姐姐|jiějie}，{我|wǒ}{有|yǒu}{一|yí}{个|ge}{哥哥|gēge}。', ro: 'Wǒ méiyǒu jiějie, wǒ yǒu yí ge gēge.', vi: 'Em không có chị gái, em có một anh trai.' },
        { who: 'Giám khảo', role: 'examiner', text: '{你|nǐ}{哥哥|gēge}{叫|jiào}{什么|shénme}{名字|míngzi}？', ro: 'Nǐ gēge jiào shénme míngzi?', vi: 'Anh trai em tên là gì?' },
        { who: 'Thí sinh', role: 'candidate', text: '{他|tā}{叫|jiào}{阮明|Ruǎn Míng}。{他|tā}{是|shì}{学生|xuésheng}。', ro: 'Tā jiào Ruǎn Míng. Tā shì xuésheng.', vi: 'Anh ấy tên là Nguyễn Minh. Anh ấy là sinh viên.' },
        { who: 'Giám khảo', role: 'examiner', text: '{你|nǐ}{有|yǒu}{中国|Zhōngguó}{朋友|péngyou}{吗|ma}？', ro: 'Nǐ yǒu Zhōngguó péngyou ma?', vi: 'Em có bạn người Trung Quốc không?' },
        { who: 'Thí sinh', role: 'candidate', text: '{有|yǒu}。{王明|Wáng Míng}{是|shì}{我|wǒ}{的|de}{朋友|péngyou}，{他|tā}{是|shì}{北京|Běijīng}{人|rén}。', ro: 'Yǒu. Wáng Míng shì wǒ de péngyou, tā shì Běijīng rén.', vi: 'Có ạ. Vương Minh là bạn em, cậu ấy là người Bắc Kinh.' },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo để không mất điểm',
      items: [
        'Trả lời **cả câu** và **thêm một ý**: hỏi 你有姐姐吗 → đáp 我没有姐姐，**我有一个哥哥** — giám khảo thấy bạn chủ động dùng ngữ pháp.',
        'Câu hỏi 几 → câu trả lời **phải có con số + lượng từ**: 我家有五**口**人, 我有两**个**哥哥.',
        '**Họ Việt Nam** viết bằng chữ Hán: Nguyễn 阮 Ruǎn · Trần 陈 Chén · Lê 黎 Lí · Phạm 范 Fàn · Hoàng 黄 Huáng · Vũ/Võ 武 Wǔ — học trước tên người nhà mình để nói cho tự tin.',
        'Quên một từ (vd. nghề của bố)? Nói câu đơn giản hơn mà vẫn đúng: 我爸爸很忙 — tốt hơn là im lặng.',
      ],
    },

    { t: 'h', text: 'Đến lượt bạn' },
    {
      t: 'p',
      text: 'Năm câu hỏi dưới đây sẽ được đọc lên (bấm vào câu để nghe). Ghi âm câu trả lời **về gia đình thật của bạn**, rồi nghe lại. Cuối cùng, thử nói liền một đoạn 30 giây theo khung: **我叫… · 我家有…口人：… · 我爸爸是… · 我有/没有… · 我很高兴！**',
    },
    {
      t: 'examples',
      items: [
        { en: '{你|nǐ}{家|jiā}{有|yǒu}{几|jǐ}{口|kǒu}{人|rén}？', ro: 'Nǐ jiā yǒu jǐ kǒu rén?', vi: 'Nhà bạn có mấy người? → 我家有…口人：…和我。' },
        { en: '{你|nǐ}{有|yǒu}{哥哥|gēge}{吗|ma}？', ro: 'Nǐ yǒu gēge ma?', vi: 'Bạn có anh trai không? → 有，我有…个哥哥。/ 我没有哥哥。' },
        { en: '{你|nǐ}{有|yǒu}{几|jǐ}{个|ge}{妹妹|mèimei}？', ro: 'Nǐ yǒu jǐ ge mèimei?', vi: 'Bạn có mấy em gái? → 我有…个妹妹。/ 我没有妹妹。' },
        { en: '{你|nǐ}{妈妈|māma}{是|shì}{老师|lǎoshī}{吗|ma}？', ro: 'Nǐ māma shì lǎoshī ma?', vi: 'Mẹ bạn là giáo viên à? → 是。/ 不是，她是…。' },
        { en: '{你|nǐ}{爸爸|bàba}{叫|jiào}{什么|shénme}{名字|míngzi}？', ro: 'Nǐ bàba jiào shénme míngzi?', vi: 'Bố bạn tên là gì? → 我爸爸叫…。' },
      ],
    },
    {
      t: 'speak',
      id: 'b4-noi-ghi-am',
      part: '1',
      questions: ['你家有几口人？', '你有哥哥吗？', '你有几个妹妹？', '你妈妈是老师吗？', '你爸爸叫什么名字？'],
    },
  ],
};

/* ══════════════════════════ 7. BÀI TẬP ══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b4-bai-tap',
  kind: 'homework',
  title: 'Bài tập Bài 4 — dịch, pinyin, trắc nghiệm, ghép câu, đọc hiểu',
  goal: 'Tự kiểm tra toàn bộ Bài 4: viết được câu về gia đình bằng chữ Hán, dùng đúng 有/没有, 几, 个/口, 的; đọc hiểu một đoạn giới thiệu gia đình.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Trước khi làm bài',
      items: [
        'Ô dịch Việt → Trung: gõ **chữ Hán** (bàn phím Pinyin — gõ "baba" rồi chọn 爸爸). Dấu câu có hay không đều được chấm đúng.',
        'Ô pinyin: gõ **có dấu** (gēge) hoặc **dạng số** (ge1ge); ü gõ bằng **v** (nv3er2).',
        'Công thức cần nhớ: **S + 有/没有 + N** · **số + 个 + N** · **几 + 个/口** · **家有几口人** · **A 的 B** · **我爸爸** (bỏ 的).',
        'Đạt ≥ 80% → sang Bài 5. Dưới 70% → xem lại phần Ngữ pháp (① có/không có và ⑤ 的).',
      ],
    },
    { t: 'h', text: '1. Dịch sang tiếng Trung (viết chữ Hán)' },
    {
      t: 'quiz',
      id: 'b4-bt-dich',
      title: 'Dịch Việt → Trung',
      kind: 'translate',
      grammar: 'S + 有/没有 + N · số + 个 + N · 几 + lượng từ · 家有几口人 · A 的 B · 谁 · 和',
      items: [
        { q: 'Nhà tôi có năm người.', answers: ['我家有五口人。'], hint: '我家 · 有 · 五 · 口 · 人' },
        { q: 'Nhà bạn có mấy người?', answers: ['你家有几口人？'], hint: '你家 · 有 · 几 · 口 · 人' },
        { q: 'Tôi có một anh trai.', answers: ['我有一个哥哥。'], hint: '有 · 一个 · 哥哥' },
        { q: 'Tôi không có em trai.', answers: ['我没有弟弟。', '我没弟弟。'], hint: '没有 · 弟弟' },
        { q: 'Bạn có mấy chị gái?', answers: ['你有几个姐姐？'], hint: '几个 · 姐姐' },
        { q: 'Cô ấy có hai đứa con.', answers: ['她有两个孩子。'], hint: '两个 · 孩子' },
        { q: 'Bố tôi là bác sĩ.', answers: ['我爸爸是医生。', '我的爸爸是医生。'], hint: '我爸爸 · 是 · 医生' },
        { q: 'Anh ấy là ai?', answers: ['他是谁？'], hint: '他 · 是 · 谁' },
        { q: 'Mẹ của Vương Minh là bác sĩ.', answers: ['王明的妈妈是医生。'], hint: '王明 · 的 · 妈妈' },
        { q: 'Bạn có em gái không?', answers: ['你有妹妹吗？', '你有没有妹妹？'], hint: '有…吗 / 有没有' },
        { q: 'Tôi và Anna là bạn.', answers: ['我和安娜是朋友。', '安娜和我是朋友。'], hint: '和 · 朋友' },
        { q: 'Tên của em gái tôi là Mai.', answers: ['我妹妹的名字叫梅。', '我妹妹的名字是梅。', '我妹妹叫梅。'], hint: '我妹妹 · 的 · 名字 · 叫 (Mai = 梅 Méi)' },
      ],
    },

    { t: 'h', text: '2. Viết pinyin' },
    {
      t: 'quiz',
      id: 'b4-bt-pinyin',
      title: 'Viết pinyin có dấu thanh (hoặc dạng số)',
      kind: 'fill',
      grammar: 'Chữ lặp sau đọc nhẹ (không dấu) · ü gõ v · 一个 ghi yí ge',
      items: [
        { q: '爸爸 (bố)', answers: py('bàba', 'ba4ba', 'ba4ba5', 'bà ba', 'ba4 ba', 'ba4 ba5'), hint: '4 + nhẹ' },
        { q: '姐姐 (chị gái)', answers: py('jiějie', 'jie3jie', 'jie3jie5', 'jiě jie', 'jie3 jie', 'jie3 jie5'), hint: '3 + nhẹ' },
        { q: '没有 (không có)', answers: py('méiyǒu', 'mei2you3', 'méi yǒu', 'mei2 you3'), hint: '2 + 3' },
        { q: '医生 (bác sĩ)', answers: py('yīshēng', 'yi1sheng1', 'yī shēng', 'yi1 sheng1'), hint: '1 + 1' },
        { q: '朋友 (bạn)', answers: py('péngyou', 'peng2you', 'peng2you5', 'péng you', 'peng2 you', 'peng2 you5'), hint: '2 + nhẹ' },
        { q: '女儿 (con gái)', answers: py("nǚ'ér", 'nǚér', 'nv3er2', "nv3'er2", 'nü3er2', "nü3'er2", 'nǚ ér', 'nv3 er2'), hint: '3 + 2, ü' },
        { q: '一个 (một cái)', answers: py('yí ge', 'yi2 ge', 'yi2 ge5', 'yí gè', 'yi2 ge4'), hint: '一 trước 个 → thanh 2' },
        { q: '孩子 (con, đứa trẻ)', answers: py('háizi', 'hai2zi', 'hai2zi5', 'hái zi', 'hai2 zi', 'hai2 zi5'), hint: '2 + nhẹ' },
      ],
    },

    { t: 'h', text: '3. Trắc nghiệm tổng hợp' },
    {
      t: 'mcq',
      id: 'b4-bt-trac-nghiem',
      title: 'Chọn câu đúng / phù hợp',
      items: [
        m('Nhà Lan có bố, mẹ, anh trai, em gái và Lan. Lan nói:', ['我家有四口人。', '我家有五口人。', '我家有五个口人。', '我家是五口人。'], 1, 'Tính cả bản thân: 5 người → 五口人.'),
        m('"Tôi không có chị gái" là:', ['我不有姐姐。', '我没有姐姐。', '我不是姐姐。', '我姐姐没有。'], 1, '没有 + N.'),
        m('Chọn từ đúng: 你有（　）个哥哥？', ['几', '谁', '什么', '吗'], 0, '几 + 个: hỏi mấy.'),
        m('Chọn từ đúng: 我有（　）个妹妹。', ['二', '两', '几', '口'], 1, 'Hai + lượng từ → 两.'),
        m('Chọn lượng từ: 我家有三（　）人。', ['个', '口', '几', '的'], 1, '家有…口人.'),
        m('Chọn lượng từ: 老板有两（　）孩子。', ['口', '个', '的', '和'], 1, 'Đếm con cái dùng 个.'),
        m('Câu nào **tự nhiên nhất**?', ['我的妈妈的名字', '我妈妈的名字', '妈妈我的名字', '名字的我妈妈'], 1, 'Bỏ 的 sau đại từ trước người thân, giữ 的 trước vật: 我妈妈的名字.'),
        m('他是谁？— câu trả lời phù hợp:', ['他是我哥哥。', '他有哥哥。', '他很好。', '是，他是。'], 0, 'Hỏi "ai" → trả lời người cụ thể.'),
        m('你有弟弟吗？— trả lời phủ định đúng:', ['不是。', '不有。', '没有。', '没是。'], 2, 'Câu hỏi 有 → đáp 有 / 没有.'),
        m('"Bà chủ có một con trai, một con gái." Từ còn thiếu: 老板有一个儿子，一个（　）。', ['女儿', '妹妹', '姐姐', '妈妈'], 0, 'Con gái = 女儿.'),
        m('先生 trong 我先生是老板 nghĩa là:', ['thầy giáo', 'chồng', 'anh trai', 'ông nội'], 1, '我先生 = chồng tôi.'),
        m('Câu nào **sai**?', ['我有两个姐姐。', '你有几个弟弟？', '我家有几口人吗？', '他没有妹妹。'], 2, 'Câu có 几 không thêm 吗.'),
      ],
    },

    { t: 'h', text: '4. Ghép câu' },
    {
      t: 'build',
      id: 'b4-bt-ghep',
      title: 'Ghép thành câu đúng',
      items: [
        { vi: 'Nhà tôi có ba người.', chips: ['{我|wǒ}', '{家|jiā}', '{有|yǒu}', '{三|sān}', '{口|kǒu}', '{人|rén}', '{个|ge}'], answer: ['{我|wǒ}', '{家|jiā}', '{有|yǒu}', '{三|sān}', '{口|kǒu}', '{人|rén}'], ro: 'Wǒ jiā yǒu sān kǒu rén.' },
        { vi: 'Bạn có mấy anh trai?', chips: ['{你|nǐ}', '{有|yǒu}', '{几|jǐ}', '{个|ge}', '{哥哥|gēge}', '{吗|ma}'], answer: ['{你|nǐ}', '{有|yǒu}', '{几|jǐ}', '{个|ge}', '{哥哥|gēge}'], ro: 'Nǐ yǒu jǐ ge gēge?' },
        { vi: 'Anh ấy không có em gái.', chips: ['{他|tā}', '{没有|méiyǒu}', '{妹妹|mèimei}', '{不|bù}', '{是|shì}'], answer: ['{他|tā}', '{没有|méiyǒu}', '{妹妹|mèimei}'], ro: 'Tā méiyǒu mèimei.' },
        { vi: 'Cô ấy là ai?', chips: ['{她|tā}', '{是|shì}', '{谁|shéi}', '{的|de}'], answer: ['{她|tā}', '{是|shì}', '{谁|shéi}'], ro: 'Tā shì shéi?' },
        { vi: 'Bạn của anh ấy là người Mỹ.', chips: ['{他|tā}', '{的|de}', '{朋友|péngyou}', '{是|shì}', '{美国|Měiguó}', '{人|rén}'], answer: ['{他|tā}', '{的|de}', '{朋友|péngyou}', '{是|shì}', '{美国|Měiguó}', '{人|rén}'], ro: 'Tā de péngyou shì Měiguó rén.' },
        { vi: 'Tôi có hai em trai.', chips: ['{我|wǒ}', '{有|yǒu}', '{两|liǎng}', '{个|ge}', '{弟弟|dìdi}', '{二|èr}'], answer: ['{我|wǒ}', '{有|yǒu}', '{两|liǎng}', '{个|ge}', '{弟弟|dìdi}'], ro: 'Wǒ yǒu liǎng ge dìdi.' },
        { vi: 'Bạn có chị gái không? (dùng 有没有)', chips: ['{你|nǐ}', '{有|yǒu}', '{没有|méiyǒu}', '{姐姐|jiějie}', '{吗|ma}'], answer: ['{你|nǐ}', '{有|yǒu}', '{没有|méiyǒu}', '{姐姐|jiějie}'], ro: 'Nǐ yǒu méiyǒu jiějie?' },
        { vi: 'Bố và mẹ tôi là giáo viên.', chips: ['{我|wǒ}', '{爸爸|bàba}', '{和|hé}', '{妈妈|māma}', '{是|shì}', '{老师|lǎoshī}'], answer: ['{我|wǒ}', '{爸爸|bàba}', '{和|hé}', '{妈妈|māma}', '{是|shì}', '{老师|lǎoshī}'], ro: 'Wǒ bàba hé māma shì lǎoshī.' },
      ],
    },

    { t: 'h', text: '4b. Sửa câu sai' },
    {
      t: 'quiz',
      id: 'b4-bt-sua-cau',
      title: 'Mỗi câu có một lỗi — viết lại câu đúng (chữ Hán)',
      kind: 'translate',
      grammar: '没有 (không 不有) · số + lượng từ + N · 两 trước lượng từ · 几 + lượng từ, không 吗 · A 的 B',
      items: [
        { q: '~~我不有哥哥。~~ (Tôi không có anh trai.)', answers: ['我没有哥哥。', '我没哥哥。'], hint: 'Phủ định của 有' },
        { q: '~~我有两哥哥。~~ (Tôi có hai anh trai.)', answers: ['我有两个哥哥。'], hint: 'Thiếu lượng từ' },
        { q: '~~我有二个姐姐。~~ (Tôi có hai chị gái.)', answers: ['我有两个姐姐。'], hint: '"Hai" trước lượng từ' },
        { q: '~~你家有几个口人？~~ (Nhà bạn có mấy người?)', answers: ['你家有几口人？'], hint: 'Chỉ một lượng từ' },
        { q: '~~你有几个妹妹吗？~~ (Bạn có mấy em gái?)', answers: ['你有几个妹妹？'], hint: 'Câu có 几 không thêm 吗' },
        { q: '~~名字的我叫兰兰。~~ (Tên của tôi là Lan.)', answers: ['我的名字叫兰兰。', '我的名字是兰兰。'], hint: 'Người sở hữu đứng trước 的' },
        { q: '~~我家是四口人。~~ (Nhà tôi có bốn người.)', answers: ['我家有四口人。'], hint: 'Dùng động từ "có"' },
        { q: '~~他是谁吗？~~ (Anh ấy là ai?)', answers: ['他是谁？'], hint: 'Câu có 谁 không thêm 吗' },
      ],
    },

    { t: 'h', text: '5. Đọc hiểu' },
    {
      t: 'passage',
      title: 'Bài giới thiệu của Đại Vĩ — "我的家"',
      intro: 'Đại Vĩ viết một đoạn ngắn về gia đình cho bài tập của cô Lý, chỉ dùng từ Bài 1–4. Đọc to một lượt (tắt pinyin nếu được), rồi trả lời câu hỏi.',
      paras: [
        { label: 'A', text: '{我|wǒ}{叫|jiào}{大伟|Dàwěi}，{我|wǒ}{是|shì}{美国|Měiguó}{人|rén}。{我|wǒ}{家|jiā}{有|yǒu}{六|liù}{口|kǒu}{人|rén}：{爸爸|bàba}、{妈妈|māma}、{两|liǎng}{个|ge}{姐姐|jiějie}、{一|yí}{个|ge}{弟弟|dìdi}{和|hé}{我|wǒ}。' },
        { label: 'B', text: '{我|wǒ}{爸爸|bàba}{是|shì}{老板|lǎobǎn}，{他|tā}{很|hěn}{忙|máng}。{我|wǒ}{妈妈|māma}{是|shì}{老师|lǎoshī}。{我|wǒ}{大姐|dàjiě}{是|shì}{医生|yīshēng}，{她|tā}{有|yǒu}{一|yí}{个|ge}{女儿|nǚ\'ér}。{我|wǒ}{弟弟|dìdi}{是|shì}{学生|xuésheng}。' },
        { label: 'C', text: '{我|wǒ}{没有|méiyǒu}{哥哥|gēge}，{也|yě}{没有|méiyǒu}{妹妹|mèimei}。{我|wǒ}{有|yǒu}{很|hěn}{多|duō}{中国|Zhōngguó}{朋友|péngyou}。{王明|Wáng Míng}{是|shì}{我|wǒ}{的|de}{朋友|péngyou}，{他|tā}{的|de}{妈妈|māma}{也|yě}{是|shì}{医生|yīshēng}。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b4-bt-doc-hieu',
      title: 'Câu hỏi đọc hiểu',
      items: [
        m('大伟家有几口人？', ['四口', '五口', '六口'], 2, 'Đoạn A: 我家有六口人。'),
        m('大伟有几个姐姐？', ['一个', '两个', '没有'], 1, 'Đoạn A: 两个姐姐。'),
        m('Bố của Đại Vĩ làm nghề gì?', ['Giáo viên', 'Chủ doanh nghiệp/cửa hàng', 'Bác sĩ'], 1, 'Đoạn B: 我爸爸是老板。'),
        m('Ai là bác sĩ?', ['Mẹ Đại Vĩ', 'Chị cả của Đại Vĩ', 'Em trai Đại Vĩ'], 1, 'Đoạn B: 我大姐是医生 (大姐 dàjiě = chị cả — 大 "lớn" + 姐).'),
        m('Câu nào **đúng** với bài đọc?', ['Đại Vĩ có một anh trai.', 'Đại Vĩ không có em gái.', 'Mẹ Vương Minh là giáo viên.'], 1, 'Đoạn C: 我没有哥哥，也没有妹妹。Mẹ Vương Minh là bác sĩ (也是医生).'),
      ],
    },
    {
      t: 'table',
      caption: 'Tự đánh giá Bài 4',
      head: ['Kết quả', 'Ý nghĩa', 'Làm gì tiếp'],
      rows: [
        ['≥ 80%', 'Nắm chắc Bài 4', 'Sang Bài 5 (数字 — số đếm 0–99, tuổi 多大/几岁). Gọi 📞 CuongMini, tự giới thiệu gia đình 30 giây.'],
        ['70–79%', 'Còn vài chỗ hổng', 'Làm lại phần sai; đọc lại 3 tình huống hội thoại và bảng 个/口.'],
        ['< 70%', 'Chưa vững', 'Học lại Ngữ pháp ① 有/没有, ② lượng từ, ⑤ 的; làm lại toàn bộ bài tập.'],
      ],
    },
  ],
};

export const BAI_4: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, HAN_TU, NGHE, NOI, BAI_TAP];
