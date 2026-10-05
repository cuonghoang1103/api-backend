/**
 * Bài 3 — HSK 1 · 你是哪国人: quốc tịch, phủ định 不 (不是), 也, 呢 (khoá CH).
 *
 * Phạm vi: S + 是 + 哪国人？/ 国名 + 人, thành phố + 人; phủ định 不 với 是, động từ và tính từ
 * (biến điệu bú), 不是…，是…; phó từ 也 (cũng) và 也不; câu hỏi rút gọn "…，你呢？";
 * tên các nước 越南/中国/美国/俄罗斯/英国/法国/日本/韩国/泰国/德国.
 * Nối tiếp Bài 1 (很, 吗, 不 + tính từ sơ khởi) và Bài 2 (是, 叫, 姓, 谁, 什么, 认识).
 * Chưa dùng 都 (bài sau), 的 (Bài 4), 哪儿 (Bài 10), 汉语/会说 (Bài 13). Từ ngoài HSK 1 ghi "(từ mở rộng)".
 *
 * Quy ước pinyin như Bài 0–2: thanh 3 + thanh 3 ghi theo từ điển (你好 nǐ hǎo, 也很好 yě hěn hǎo);
 * 不 ghi theo cách đọc (不是 bú shì, 不叫 bú jiào, 不忙 bù máng). Quốc tịch tách từ: Yuènán rén.
 * Nhân vật: 兰兰 Lan (a, nữ) · 王明 Vương Minh (b, nam) · 李老师 cô Lý (c, nữ) ·
 * 大伟 Đại Vĩ (b, nam, người Mỹ) · 安娜 Anna (c, nữ, người Nga) · 老板 bà chủ quầy (c, nữ).
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
  id: 'b3-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại: 你是哪国人 — Hỏi quốc tịch, nói "không phải", "cũng", "còn bạn?"',
  goal: 'Hỏi và nói được quốc tịch, quê (thành phố) của mình và người khác; phủ định thông tin sai bằng 不是; nói "tôi cũng vậy" bằng 也; hỏi lại "còn bạn?" bằng 呢.',
  minutes: 35,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Bài 3 học gì',
      items: [
        'Hỏi quốc tịch: **你是哪国人？** → **我是越南人。** (tên nước + **人**). Quê: **我是河内人。**',
        'Phủ định: **不是** (bú shì) — 我**不是**中国人. Sửa thông tin: **不是…，是…**. 不 cũng đứng trước động từ khác: 不叫, 不姓, 不认识.',
        '**也** = cũng, đứng **sau chủ ngữ, trước động từ / tính từ**: 我**也**是学生 · 我**也**很高兴 · 我**也**不是老师.',
        '**呢** = "còn … thì sao?": **我是越南人，你呢？** — hỏi lại cùng câu hỏi, không cần lặp cả câu, không thêm 吗.',
        'Tên nước: **越南 · 中国 · 美国 · 俄罗斯 · 英国 · 法国 · 日本 · 韩国** — hầu hết đọc gần âm Hán Việt!',
      ],
    },
    { t: 'h', text: 'Học xong Bài 3 bạn làm được gì' },
    {
      t: 'table',
      head: ['Tình huống', 'Bạn làm được', 'Câu then chốt'],
      rows: [
        ['1. Giờ học về các nước', 'Nói quốc tịch của mình và bạn, hỏi lại "còn bạn?", sửa khi người khác đoán sai', '你是哪国人？我是越南人。你呢？'],
        ['2. Ở quầy căng tin', 'Trả lời khi bị đoán nhầm quốc tịch; nói quê mình; nói "tôi cũng vậy"', '我不是韩国人，也不是日本人。我也是河内人！'],
        ['3. Xem danh sách sinh viên mới', 'Đoán và hỏi quốc tịch người khác, dùng 也 và 不是…是…', '她也是日本人吗？不是，她是韩国人。'],
      ],
    },
    {
      t: 'p',
      text: 'Cách học phần này: đọc **bối cảnh** → bấm nghe cả đoạn → bấm từng câu, đọc to theo 3 lần → tắt pinyin và tự đọc lại. Để ý ba chữ mới cứ xuất hiện liên tục: **不** (không), **也** (cũng), **呢** (còn … thì sao?).',
    },
    {
      t: 'note',
      title: 'Ôn nhanh Bài 1–2 — dùng lại trong bài này',
      items: [
        '**S + 是 + N** — 我是学生. Bài này: N là **quốc tịch**: 我是**越南人**.',
        '**câu kể + 吗？** — 你是中国人吗？ · **谁 / 什么** không đi với 吗. Bài này thêm từ để hỏi **哪** (nào).',
        '**S + 不 + Adj** — 我不忙 (Bài 1) · **不是** trả lời (Bài 2). Bài này học 不 đầy đủ.',
        '**很高兴认识你！** — giờ đáp được tự nhiên: **我也很高兴！**',
      ],
    },

    /* ── Tình huống 1 ── */
    { t: 'h', text: 'Tình huống 1 — Giờ học về các nước' },
    {
      t: 'p',
      text: '**Bối cảnh.** Hôm nay lớp học chủ đề "quốc gia". Cô Lý treo bản đồ thế giới lên bảng, rồi lần lượt hỏi từng bạn là người nước nào. Lớp có sinh viên đến từ nhiều nước: Đại Vĩ người Mỹ, Anna người Nga, Lan người Việt, còn Vương Minh là người Bắc Kinh.',
    },
    {
      t: 'dialogue',
      title: '你是哪国人？— Em là người nước nào?',
      lines: [
        { who: '李老师 Cô Lý', role: 'c', text: '{大伟|Dàwěi}，{你|nǐ}{是|shì}{哪|nǎ}{国|guó}{人|rén}？', ro: 'Dàwěi, nǐ shì nǎ guó rén?', vi: 'Đại Vĩ, em là người nước nào?' },
        { who: '大伟 Đại Vĩ', role: 'b', text: '{我|wǒ}{是|shì}{美国|Měiguó}{人|rén}。', ro: 'Wǒ shì Měiguó rén.', vi: 'Em là người Mỹ ạ.' },
        { who: '李老师 Cô Lý', role: 'c', text: '{安娜|Ānnà}，{你|nǐ}{呢|ne}？', ro: 'Ānnà, nǐ ne?', vi: 'Anna, còn em?' },
        { who: '安娜 Anna', role: 'c', text: '{我|wǒ}{是|shì}{俄罗斯|Éluósī}{人|rén}。', ro: 'Wǒ shì Éluósī rén.', vi: 'Em là người Nga ạ.' },
        { who: '李老师 Cô Lý', role: 'c', text: '{兰兰|Lánlan}，{你|nǐ}{也|yě}{是|shì}{俄罗斯|Éluósī}{人|rén}{吗|ma}？', ro: 'Lánlan, nǐ yě shì Éluósī rén ma?', vi: 'Lan Lan, em cũng là người Nga à?' },
        { who: '兰兰 Lan', role: 'a', text: '{不|bú}{是|shì}，{老师|lǎoshī}。{我|wǒ}{不|bú}{是|shì}{俄罗斯|Éluósī}{人|rén}，{我|wǒ}{是|shì}{越南|Yuènán}{人|rén}。', ro: 'Bú shì, lǎoshī. Wǒ bú shì Éluósī rén, wǒ shì Yuènán rén.', vi: 'Không ạ, thưa cô. Em không phải người Nga, em là người Việt Nam.' },
        { who: '李老师 Cô Lý', role: 'c', text: '{王明|Wáng Míng}{呢|ne}？{他|tā}{是|shì}{哪|nǎ}{国|guó}{人|rén}？', ro: 'Wáng Míng ne? Tā shì nǎ guó rén?', vi: 'Còn Vương Minh? Cậu ấy là người nước nào?' },
        { who: '兰兰 Lan', role: 'a', text: '{王明|Wáng Míng}{是|shì}{中国|Zhōngguó}{人|rén}，{他|tā}{是|shì}{北京|Běijīng}{人|rén}。', ro: 'Wáng Míng shì Zhōngguó rén, tā shì Běijīng rén.', vi: 'Vương Minh là người Trung Quốc, cậu ấy là người Bắc Kinh.' },
        { who: '李老师 Cô Lý', role: 'c', text: '{对|duì}。{我|wǒ}{也|yě}{是|shì}{中国|Zhōngguó}{人|rén}，{我|wǒ}{是|shì}{上海|Shànghǎi}{人|rén}。', ro: 'Duì. Wǒ yě shì Zhōngguó rén, wǒ shì Shànghǎi rén.', vi: 'Đúng rồi. Cô cũng là người Trung Quốc, cô là người Thượng Hải.' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong tình huống 1',
      items: [
        '**你是哪国人？** nǐ shì nǎ guó rén — từng chữ: bạn + là + nào + nước + người → "bạn là người nước nào?". Trả lời: thay **哪国** bằng **tên nước**: 我是**美国**人.',
        'Thứ tự **ngược với tiếng Việt**: tiếng Việt "người **Mỹ**" (người trước), tiếng Trung **美国人** (nước trước, 人 sau). Như 北京人 = "người Bắc Kinh".',
        '**你呢？** — "còn em?". Cô Lý không cần nhắc lại cả câu 你是哪国人 — 呢 tự hiểu là hỏi **cùng câu hỏi** vừa nói.',
        '**你也是俄罗斯人吗？** — 也 (cũng) đứng **sau chủ ngữ 你**, trước 是. Cô Lý đoán Lan "cũng" là người Nga như Anna.',
        '**不是…，我是越南人** — Lan phủ định rồi nói ngay thông tin đúng. 不 trước 是 (thanh 4) đọc **bú**.',
        '**我也是中国人** — cô Lý "cũng" là người Trung Quốc như Vương Minh. 也 luôn so với điều vừa nói về người khác.',
        '上海 Shànghǎi (Thượng Hải) — từ mở rộng, tên thành phố lớn nhất Trung Quốc.',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{你|nǐ}{是|shì}{哪|nǎ}{国|guó}{人|rén}？', ro: 'Nǐ shì nǎ guó rén?', vi: 'Bạn là người nước nào?' },
        { en: '{我|wǒ}{是|shì}{越南|Yuènán}{人|rén}。', ro: 'Wǒ shì Yuènán rén.', vi: 'Tôi là người Việt Nam.' },
        { en: '{安娜|Ānnà}，{你|nǐ}{呢|ne}？', ro: 'Ānnà, nǐ ne?', vi: 'Anna, còn bạn?' },
        { en: '{我|wǒ}{不|bú}{是|shì}{俄罗斯|Éluósī}{人|rén}。', ro: 'Wǒ bú shì Éluósī rén.', vi: 'Tôi không phải người Nga.' },
        { en: '{我|wǒ}{也|yě}{是|shì}{中国|Zhōngguó}{人|rén}。', ro: 'Wǒ yě shì Zhōngguó rén.', vi: 'Tôi cũng là người Trung Quốc.' },
        { en: '{他|tā}{是|shì}{北京|Běijīng}{人|rén}。', ro: 'Tā shì Běijīng rén.', vi: 'Anh ấy là người Bắc Kinh.' },
      ],
    },

    /* ── Tình huống 2 ── */
    { t: 'h', text: 'Tình huống 2 — Ở quầy căng tin: "Cháu là người Hàn à?"' },
    {
      t: 'p',
      text: '**Bối cảnh.** Lan ra quầy căng tin mua bữa tối. Bà chủ quầy họ Trương (đã quen Lan ở Bài 2) đoán Lan là người Hàn Quốc, rồi người Nhật. Lan cười và sửa lại. Hoá ra bà chủ cũng có một người bạn Việt Nam. Một lát sau Đại Vĩ đến.',
    },
    {
      t: 'dialogue',
      title: '你是韩国人吗？— Cháu là người Hàn à?',
      lines: [
        { who: '老板 Bà chủ quầy', role: 'c', text: '{兰兰|Lánlan}，{你|nǐ}{是|shì}{韩国|Hánguó}{人|rén}{吗|ma}？', ro: 'Lánlan, nǐ shì Hánguó rén ma?', vi: 'Lan Lan, cháu là người Hàn à?' },
        { who: '兰兰 Lan', role: 'a', text: '{不|bú}{是|shì}。', ro: 'Bú shì.', vi: 'Không phải ạ.' },
        { who: '老板 Bà chủ quầy', role: 'c', text: '{你|nǐ}{是|shì}{日本|Rìběn}{人|rén}？', ro: 'Nǐ shì Rìběn rén?', vi: 'Thế cháu là người Nhật?' },
        { who: '兰兰 Lan', role: 'a', text: '{我|wǒ}{不|bú}{是|shì}{韩国|Hánguó}{人|rén}，{也|yě}{不|bú}{是|shì}{日本|Rìběn}{人|rén}。{我|wǒ}{是|shì}{越南|Yuènán}{人|rén}！', ro: 'Wǒ bú shì Hánguó rén, yě bú shì Rìběn rén. Wǒ shì Yuènán rén!', vi: 'Cháu không phải người Hàn, cũng không phải người Nhật. Cháu là người Việt Nam ạ!' },
        { who: '老板 Bà chủ quầy', role: 'c', text: '{越南|Yuènán}{人|rén}！{我|wǒ}{朋友|péngyou}{也|yě}{是|shì}{越南|Yuènán}{人|rén}。{她|tā}{是|shì}{河内|Hénèi}{人|rén}。{你|nǐ}{呢|ne}？', ro: 'Yuènán rén! Wǒ péngyou yě shì Yuènán rén. Tā shì Hénèi rén. Nǐ ne?', vi: 'Người Việt Nam à! Bạn cô cũng là người Việt Nam. Cô ấy là người Hà Nội. Còn cháu?' },
        { who: '兰兰 Lan', role: 'a', text: '{我|wǒ}{也|yě}{是|shì}{河内|Hénèi}{人|rén}！', ro: 'Wǒ yě shì Hénèi rén!', vi: 'Cháu cũng là người Hà Nội ạ!' },
        { who: '大伟 Đại Vĩ', role: 'b', text: '{老板|lǎobǎn}{好|hǎo}！{兰兰|Lánlan}，{你|nǐ}{好|hǎo}！', ro: 'Lǎobǎn hǎo! Lánlan, nǐ hǎo!', vi: 'Chào cô chủ ạ! Lan Lan, chào bạn!' },
        { who: '老板 Bà chủ quầy', role: 'c', text: '{他|tā}{也|yě}{是|shì}{越南|Yuènán}{人|rén}{吗|ma}？', ro: 'Tā yě shì Yuènán rén ma?', vi: 'Cậu ấy cũng là người Việt Nam à?' },
        { who: '兰兰 Lan', role: 'a', text: '{不|bú}{是|shì}，{他|tā}{是|shì}{美国|Měiguó}{人|rén}。{他|tā}{叫|jiào}{大伟|Dàwěi}。', ro: 'Bú shì, tā shì Měiguó rén. Tā jiào Dàwěi.', vi: 'Không ạ, cậu ấy là người Mỹ. Cậu ấy tên là Đại Vĩ.' },
        { who: '大伟 Đại Vĩ', role: 'b', text: '{老板|lǎobǎn}，{很|hěn}{高兴|gāoxìng}{认识|rènshi}{您|nín}！', ro: 'Lǎobǎn, hěn gāoxìng rènshi nín!', vi: 'Cô chủ, cháu rất vui được biết cô!' },
        { who: '老板 Bà chủ quầy', role: 'c', text: '{我|wǒ}{也|yě}{很|hěn}{高兴|gāoxìng}！', ro: 'Wǒ yě hěn gāoxìng!', vi: 'Cô cũng rất vui!' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong tình huống 2',
      items: [
        '**你是日本人？** — bà chủ hỏi bằng **giọng lên cao** ở cuối, không có 吗 — trong khẩu ngữ, câu kể + giọng hỏi cũng thành câu hỏi (như tiếng Việt "Cháu là người Nhật?"). Người mới học cứ dùng 吗 cho chắc.',
        '**我不是韩国人，也不是日本人。** — "không phải…, cũng không phải…". Thứ tự: **也 + 不**, KHÔNG nói ~~不也是~~.',
        '**我朋友也是越南人** — chủ ngữ là 我朋友 (bạn cô), 也 đứng sau cả cụm chủ ngữ: 我朋友**也**是….',
        '**你呢？** — ở đây nghĩa là "còn cháu (là người ở đâu)?", tức hỏi lại đúng thông tin vừa nói (quê Hà Nội). Lan đáp **我也是河内人！**',
        '**我也很高兴！** — câu đáp tự nhiên nhất cho 很高兴认识你. Bài 2 chưa có 也 nên phải nói vòng; từ giờ dùng câu này. Đọc liền ba thanh 3: **wǒ yě hěn** → thường nghe thành wó yé hén gāoxìng.',
        '河内 Hénèi = **Hà Nội** (HÀ NỘI — từ mở rộng). Tên thành phố + 人 = người ở đó: 河内人, 北京人, 上海人.',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{你|nǐ}{是|shì}{韩国|Hánguó}{人|rén}{吗|ma}？— {不|bú}{是|shì}。', ro: 'Nǐ shì Hánguó rén ma? — Bú shì.', vi: 'Bạn là người Hàn à? — Không phải.' },
        { en: '{我|wǒ}{不|bú}{是|shì}{韩国|Hánguó}{人|rén}，{也|yě}{不|bú}{是|shì}{日本|Rìběn}{人|rén}。', ro: 'Wǒ bú shì Hánguó rén, yě bú shì Rìběn rén.', vi: 'Tôi không phải người Hàn, cũng không phải người Nhật.' },
        { en: '{我|wǒ}{朋友|péngyou}{也|yě}{是|shì}{越南|Yuènán}{人|rén}。', ro: 'Wǒ péngyou yě shì Yuènán rén.', vi: 'Bạn tôi cũng là người Việt Nam.' },
        { en: '{我|wǒ}{也|yě}{是|shì}{河内|Hénèi}{人|rén}！', ro: 'Wǒ yě shì Hénèi rén!', vi: 'Tôi cũng là người Hà Nội!' },
        { en: '{很|hěn}{高兴|gāoxìng}{认识|rènshi}{你|nǐ}！— {我|wǒ}{也|yě}{很|hěn}{高兴|gāoxìng}！', ro: 'Hěn gāoxìng rènshi nǐ! — Wǒ yě hěn gāoxìng!', vi: 'Rất vui được làm quen với bạn! — Tôi cũng rất vui!' },
      ],
    },

    /* ── Tình huống 3 ── */
    { t: 'h', text: 'Tình huống 3 — Danh sách sinh viên mới' },
    {
      t: 'p',
      text: '**Bối cảnh.** Trên bảng tin ký túc xá dán danh sách **新同学** (bạn học mới) của học kỳ này, có tên và quốc tịch. Lan và Anna đứng đọc, đoán xem từng người là người nước nào. Bốn cái tên trên danh sách: 山田 Shāntián (người Nhật), 金美英 Jīn Měiyīng (người Hàn), 玛丽 Mǎlì (người Anh), 苏菲 Sūfēi (người Pháp).',
    },
    {
      t: 'dialogue',
      title: '她也是日本人吗？— Cô ấy cũng là người Nhật à?',
      lines: [
        { who: '安娜 Anna', role: 'c', text: '{兰兰|Lánlan}，{他|tā}{叫|jiào}{山田|Shāntián}。{他|tā}{是|shì}{哪|nǎ}{国|guó}{人|rén}？', ro: 'Lánlan, tā jiào Shāntián. Tā shì nǎ guó rén?', vi: 'Lan Lan, cậu này tên là Yamada. Cậu ấy là người nước nào?' },
        { who: '兰兰 Lan', role: 'a', text: '{他|tā}{是|shì}{日本|Rìběn}{人|rén}。', ro: 'Tā shì Rìběn rén.', vi: 'Cậu ấy là người Nhật.' },
        { who: '安娜 Anna', role: 'c', text: '{金美英|Jīn Měiyīng}{呢|ne}？{她|tā}{也|yě}{是|shì}{日本|Rìběn}{人|rén}{吗|ma}？', ro: 'Jīn Měiyīng ne? Tā yě shì Rìběn rén ma?', vi: 'Còn Kim Mỹ Anh? Cô ấy cũng là người Nhật à?' },
        { who: '兰兰 Lan', role: 'a', text: '{不|bú}{是|shì}，{她|tā}{不|bú}{是|shì}{日本|Rìběn}{人|rén}，{是|shì}{韩国|Hánguó}{人|rén}。', ro: 'Bú shì, tā bú shì Rìběn rén, shì Hánguó rén.', vi: 'Không phải, cô ấy không phải người Nhật, mà là người Hàn.' },
        { who: '安娜 Anna', role: 'c', text: '{玛丽|Mǎlì}{是|shì}{美国|Měiguó}{人|rén}{吗|ma}？', ro: 'Mǎlì shì Měiguó rén ma?', vi: 'Mary là người Mỹ à?' },
        { who: '兰兰 Lan', role: 'a', text: '{不|bú}{是|shì}，{她|tā}{是|shì}{英国|Yīngguó}{人|rén}。{苏菲|Sūfēi}{是|shì}{法国|Fǎguó}{人|rén}。', ro: 'Bú shì, tā shì Yīngguó rén. Sūfēi shì Fǎguó rén.', vi: 'Không phải, cô ấy là người Anh. Sophie là người Pháp.' },
        { who: '安娜 Anna', role: 'c', text: '{新|xīn}{同学|tóngxué}{是|shì}{外国人|wàiguórén}。{我们|wǒmen}{也|yě}{是|shì}{外国人|wàiguórén}！', ro: 'Xīn tóngxué shì wàiguórén. Wǒmen yě shì wàiguórén!', vi: 'Các bạn mới là người nước ngoài. Bọn mình cũng là người nước ngoài!' },
        { who: '兰兰 Lan', role: 'a', text: '{对|duì}！{欢迎|huānyíng}{新|xīn}{同学|tóngxué}！', ro: 'Duì! Huānyíng xīn tóngxué!', vi: 'Đúng thế! Chào mừng các bạn mới!' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong tình huống 3',
      items: [
        '**金美英呢？** — 呢 đặt sau một **danh từ / tên** = "còn [người đó] thì sao?". Câu hỏi được hiểu theo câu trước: "còn Kim Mỹ Anh là người nước nào?".',
        '**她也是日本人吗？** — 也 + 吗 cùng một câu là bình thường: "cô ấy **cũng** là người Nhật **à**?". (也 là "cũng", không phải từ để hỏi.)',
        '**不是日本人，是韩国人** — mẫu **不是 A，是 B**: "không phải A, mà là B". Rất hay dùng để sửa thông tin.',
        'Tên nước ngoài được **phiên âm** sang chữ Hán: 玛丽 Mǎlì ≈ Mary, 苏菲 Sūfēi ≈ Sophie, 安娜 Ānnà ≈ Anna. Tên Nhật/Hàn vốn có chữ Hán thì đọc theo âm tiếng Trung: 山田 Shāntián (Yamada), 金美英 Jīn Měiyīng (Kim Mi-young).',
        '**外国人** wàiguórén — người nước ngoài (NGOẠI QUỐC NHÂN, từ mở rộng). 外 = ngoài, 国 = nước. **欢迎** huānyíng = chào mừng, hoan nghênh (HOAN NGHÊNH, từ mở rộng).',
        '**新同学** xīn tóngxué — bạn học mới. 新 = mới (TÂN — như "tân sinh viên").',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{他|tā}{是|shì}{哪|nǎ}{国|guó}{人|rén}？— {他|tā}{是|shì}{日本|Rìběn}{人|rén}。', ro: 'Tā shì nǎ guó rén? — Tā shì Rìběn rén.', vi: 'Anh ấy là người nước nào? — Anh ấy là người Nhật.' },
        { en: '{她|tā}{也|yě}{是|shì}{日本|Rìběn}{人|rén}{吗|ma}？', ro: 'Tā yě shì Rìběn rén ma?', vi: 'Cô ấy cũng là người Nhật à?' },
        { en: '{她|tā}{不|bú}{是|shì}{日本|Rìběn}{人|rén}，{是|shì}{韩国|Hánguó}{人|rén}。', ro: 'Tā bú shì Rìběn rén, shì Hánguó rén.', vi: 'Cô ấy không phải người Nhật, mà là người Hàn.' },
        { en: '{玛丽|Mǎlì}{是|shì}{英国|Yīngguó}{人|rén}。', ro: 'Mǎlì shì Yīngguó rén.', vi: 'Mary là người Anh.' },
        { en: '{我们|wǒmen}{也|yě}{是|shì}{外国人|wàiguórén}。', ro: 'Wǒmen yě shì wàiguórén.', vi: 'Chúng tôi cũng là người nước ngoài.' },
        { en: '{欢迎|huānyíng}{新|xīn}{同学|tóngxué}！', ro: 'Huānyíng xīn tóngxué!', vi: 'Chào mừng các bạn mới!' },
      ],
    },

    /* ── Văn hoá ── */
    { t: 'h', text: 'Văn hoá: tên các nước trong tiếng Trung — vì sao người Việt đoán được?' },
    {
      t: 'p',
      text: 'Tên nhiều nước trong tiếng Trung được đặt bằng cách **lấy âm đầu của tên gốc + chữ 国 (nước)**: America → 美**国** Měiguó (Mỹ quốc), England → 英**国** Yīngguó (Anh quốc), France → 法**国** Fǎguó (Pháp quốc), Deutschland → 德**国** Déguó (Đức quốc). Tiếng Việt cũng gọi các nước này theo **âm Hán Việt** của đúng những chữ đó — "nước **Mỹ**", "nước **Anh**", "nước **Pháp**", "nước **Đức**". Vì vậy chỉ cần nghe âm Hán Việt là đoán ra! Một số nước khác phiên âm cả tên: 俄罗斯 Éluósī (Nga La Tư — Russia), 意大利 Yìdàlì (Ý Đại Lợi — Italy).',
    },
    {
      t: 'table',
      caption: 'Tên nước — chữ Hán — pinyin — âm Hán Việt — người nước đó',
      head: ['Nước', 'Chữ Hán', 'Pinyin', 'Hán Việt', 'Người …'],
      rows: [
        ['Việt Nam', '越南', 'Yuènán', 'VIỆT NAM', '越南人 Yuènán rén'],
        ['Trung Quốc', '中国', 'Zhōngguó', 'TRUNG QUỐC', '中国人 Zhōngguó rén'],
        ['Mỹ', '美国', 'Měiguó', 'MỸ QUỐC', '美国人 Měiguó rén'],
        ['Nga', '俄罗斯', 'Éluósī', 'NGA LA TƯ', '俄罗斯人 Éluósī rén'],
        ['Anh', '英国', 'Yīngguó', 'ANH QUỐC', '英国人 Yīngguó rén'],
        ['Pháp', '法国', 'Fǎguó', 'PHÁP QUỐC', '法国人 Fǎguó rén'],
        ['Đức', '德国', 'Déguó', 'ĐỨC QUỐC', '德国人 Déguó rén'],
        ['Nhật Bản', '日本', 'Rìběn', 'NHẬT BẢN', '日本人 Rìběn rén'],
        ['Hàn Quốc', '韩国', 'Hánguó', 'HÀN QUỐC', '韩国人 Hánguó rén'],
        ['Thái Lan', '泰国', 'Tàiguó', 'THÁI QUỐC', '泰国人 Tàiguó rén'],
      ],
    },
    {
      t: 'table',
      caption: 'Thêm vài nước láng giềng và nước hay gặp (từ mở rộng — nhận mặt là đủ)',
      head: ['Nước', 'Chữ Hán', 'Pinyin', 'Ghi chú'],
      rows: [
        ['Lào', '老挝', 'Lǎowō', 'Phiên âm gần "Lào"; 挝 đọc wō'],
        ['Campuchia', '柬埔寨', 'Jiǎnpǔzhài', 'Phiên âm "Cam-pu-chia"'],
        ['Singapore', '新加坡', 'Xīnjiāpō', '新 ở đây chỉ để ghi âm "Sin"'],
        ['Ý', '意大利', 'Yìdàlì', 'Ý ĐẠI LỢI — Italy'],
        ['Úc', '澳大利亚', 'Àodàlìyà', 'ÚC ĐẠI LỢI (Á) — Australia'],
        ['Ấn Độ', '印度', 'Yìndù', 'ẤN ĐỘ'],
        ['Canada', '加拿大', 'Jiānádà', 'Gia Nã Đại'],
      ],
    },
    {
      t: 'note',
      title: 'Ghi nhớ — nói về quê hương, nguồn gốc',
      items: [
        '**Tên nước + 人** = người nước đó; **tên thành phố + 人** = người ở thành phố đó: 河内人, 北京人, 上海人. Người Trung Quốc rất hay hỏi nhau quê ở đâu — đó là cách bắt chuyện thân thiện.',
        '"Tiếng" một nước thì đổi 人 thành **语** yǔ hoặc **文** wén: 越南语 (tiếng Việt), 英语 (tiếng Anh), 中文 (tiếng Trung) — từ mở rộng, học kỹ ở Bài 13.',
        'Người Trung Quốc gặp người nước ngoài thường hỏi ngay **你是哪国人？** — đó là tò mò thân thiện, không phải bất lịch sự. Bạn hỏi lại **你呢？** là đẹp.',
        '**哪** trong khẩu ngữ phía Bắc hay đọc là **něi**: 哪国人 nghe như "něi guó rén". Cả hai đều đúng; khoá này ghi **nǎ**.',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{我|wǒ}{是|shì}{越南|Yuènán}{人|rén}，{我|wǒ}{是|shì}{河内|Hénèi}{人|rén}。', ro: 'Wǒ shì Yuènán rén, wǒ shì Hénèi rén.', vi: 'Tôi là người Việt Nam, tôi là người Hà Nội.' },
        { en: '{我|wǒ}{是|shì}{胡志明市|Húzhìmíng Shì}{人|rén}。', ro: 'Wǒ shì Húzhìmíng Shì rén.', vi: 'Tôi là người Thành phố Hồ Chí Minh. (từ mở rộng)' },
        { en: '{他|tā}{是|shì}{德国|Déguó}{人|rén}。', ro: 'Tā shì Déguó rén.', vi: 'Anh ấy là người Đức.' },
        { en: '{她|tā}{是|shì}{泰国|Tàiguó}{人|rén}。', ro: 'Tā shì Tàiguó rén.', vi: 'Cô ấy là người Thái Lan.' },
      ],
    },
  ],
};

/* ══════════════════════════ 2. TỪ VỰNG ══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b3-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng Bài 3 — 23 từ: quốc tịch, 也, 呢, tên nước, thành phố',
  goal: 'Nghe, đọc đúng thanh và dùng được 23 từ của Bài 3 để hỏi – nói quốc tịch, quê, và nói "cũng", "còn … thì sao?".',
  minutes: 35,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Ghi nhớ trước khi học',
      items: [
        '**Tên nước + 人** = người nước đó — học một tên nước là có luôn từ chỉ người: 越南 → 越南人.',
        'Tên nước có **国** guó (QUỐC) ở cuối thường đọc gần âm Hán Việt: 美国 Mỹ quốc, 英国 Anh quốc, 法国 Pháp quốc, 韩国 Hàn quốc.',
        'Hai hư từ quan trọng: **也** yě (cũng — đứng trước động từ) và **呢** ne (thanh nhẹ — "còn … thì sao?", cuối câu).',
        'Tên riêng (nước, thành phố) viết **hoa** chữ cái đầu trong pinyin: Yuènán, Zhōngguó, Hénèi.',
      ],
    },

    { t: 'h', text: 'Nhóm 1 — Hỏi quốc tịch (6 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{哪|nǎ}', pos: 'đại từ nghi vấn', ipa: 'nǎ', vi: 'nào (hỏi để chọn trong nhiều cái)', ex: '{你|nǐ}{是|shì}{哪|nǎ}{国|guó}{人|rén}？', exRo: 'Nǐ shì nǎ guó rén?', exVi: 'Bạn là người nước nào?', more: 'Hán Việt: NA. Khẩu ngữ hay đọc **něi**. Bộ 口 + 那 (nà — kia). Câu có 哪 thì **không** thêm 吗. Đừng nhầm với 那 nà (kia — Bài 8).' },
        { w: '{国|guó}', pos: 'danh từ', ipa: 'guó', vi: 'nước, quốc gia', ex: '{他|tā}{是|shì}{哪|nǎ}{国|guó}{人|rén}？', exRo: 'Tā shì nǎ guó rén?', exVi: 'Anh ấy là người nước nào?', more: 'Hán Việt: **QUỐC** (quốc gia, quốc tế). Đứng cuối nhiều tên nước: 中国, 美国, 英国, 法国, 韩国.' },
        { w: '{人|rén}', pos: 'danh từ', ipa: 'rén', vi: 'người', ex: '{我|wǒ}{是|shì}{越南|Yuènán}{人|rén}。', exRo: 'Wǒ shì Yuènán rén.', exVi: 'Tôi là người Việt Nam.', more: 'Hán Việt: **NHÂN** (nhân dân, nhân loại). Chữ đã viết ở Bài 0. Nơi chốn + 人: 中国人, 北京人. r uốn lưỡi — đừng đọc "rần" hay "zần".' },
        { w: '{国家|guójiā}', pos: 'danh từ', ipa: 'guójiā', vi: 'đất nước, quốc gia', ex: '{越南|Yuènán}{是|shì}{国家|guójiā}，{河内|Hénèi}{不|bú}{是|shì}{国家|guójiā}。', exRo: 'Yuènán shì guójiā, Hénèi bú shì guójiā.', exVi: 'Việt Nam là một quốc gia, Hà Nội không phải là quốc gia.', more: 'Hán Việt: **QUỐC GIA**. Nghe hiểu thêm câu hỏi dài: 你是哪个国家的人？(bạn là người nước nào — 个, 的 học ở Bài 4).' },
        { w: '{外国人|wàiguórén}', pos: 'danh từ', ipa: 'wàiguórén', vi: 'người nước ngoài (từ mở rộng)', ex: '{安娜|Ānnà}{是|shì}{外国人|wàiguórén}。', exRo: 'Ānnà shì wàiguórén.', exVi: 'Anna là người nước ngoài.', more: 'Hán Việt: **NGOẠI QUỐC NHÂN**. 外 wài = ngoài. Ở Trung Quốc, Lan cũng là 外国人; ở Việt Nam thì Vương Minh là 外国人.' },
        { w: '{新|xīn}', pos: 'tính từ', ipa: 'xīn', vi: 'mới', ex: '{她|tā}{是|shì}{新|xīn}{同学|tóngxué}。', exRo: 'Tā shì xīn tóngxué.', exVi: 'Cô ấy là bạn học mới.', more: 'Hán Việt: **TÂN** (tân sinh viên, tân binh). Đứng trước danh từ: 新同学, 新老师, 新朋友. Đọc -in mũi trước: xīn, không phải xīng.' },
      ],
    },

    { t: 'h', text: 'Nhóm 2 — Hư từ và lời chào mừng (3 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{也|yě}', pos: 'phó từ', ipa: 'yě', vi: 'cũng', ex: '{我|wǒ}{也|yě}{是|shì}{学生|xuésheng}。', exRo: 'Wǒ yě shì xuésheng.', exVi: 'Tôi cũng là sinh viên.', more: 'Hán Việt: DÃ. Luôn đứng **sau chủ ngữ, trước động từ / tính từ**: 我也是, 我也很好, 我也不是. KHÔNG đứng đầu câu (~~也我是~~). Phần bên phải của 他, 她 chính là 也!' },
        { w: '{呢|ne}', pos: 'trợ từ', ipa: 'ne', vi: '(cuối câu) còn … thì sao? — hỏi lại', ex: '{我|wǒ}{是|shì}{越南|Yuènán}{人|rén}，{你|nǐ}{呢|ne}？', exRo: 'Wǒ shì Yuènán rén, nǐ ne?', exVi: 'Tôi là người Việt Nam, còn bạn?', more: 'Hán Việt: NI. Thanh nhẹ. N / đại từ + 呢？ = hỏi lại câu vừa nói. Không dùng cùng 吗. (Bài 16 học thêm nghĩa "đang" của 呢.)' },
        { w: '{欢迎|huānyíng}', pos: 'động từ', ipa: 'huānyíng', vi: 'chào mừng, hoan nghênh (từ mở rộng)', ex: '{欢迎|huānyíng}{新|xīn}{同学|tóngxué}！', exRo: 'Huānyíng xīn tóngxué!', exVi: 'Chào mừng các bạn mới!', more: 'Hán Việt: **HOAN NGHÊNH**. Rất hay gặp: 欢迎！ (chào mừng!), 欢迎你！ Từ mở rộng — học trước vì dùng nhiều.' },
      ],
    },

    { t: 'h', text: 'Nhóm 3 — Tên nước (10 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{越南|Yuènán}', pos: 'danh từ riêng', ipa: 'Yuènán', vi: 'Việt Nam', ex: '{我|wǒ}{是|shì}{越南|Yuènán}{人|rén}。', exRo: 'Wǒ shì Yuènán rén.', exVi: 'Tôi là người Việt Nam.', more: 'Hán Việt: **VIỆT NAM**. yuè = y + üe (môi tròn), không đọc "duê". Tiếng Việt = 越南语 Yuènányǔ (từ mở rộng).' },
        { w: '{中国|Zhōngguó}', pos: 'danh từ riêng', ipa: 'Zhōngguó', vi: 'Trung Quốc', ex: '{王明|Wáng Míng}{是|shì}{中国|Zhōngguó}{人|rén}。', exRo: 'Wáng Míng shì Zhōngguó rén.', exVi: 'Vương Minh là người Trung Quốc.', more: 'Hán Việt: **TRUNG QUỐC** ("nước ở giữa"). zh uốn lưỡi, không bật hơi; -ong mũi sau.' },
        { w: '{美国|Měiguó}', pos: 'danh từ riêng', ipa: 'Měiguó', vi: 'Mỹ, Hoa Kỳ', ex: '{大伟|Dàwěi}{是|shì}{美国|Měiguó}{人|rén}。', exRo: 'Dàwěi shì Měiguó rén.', exVi: 'Đại Vĩ là người Mỹ.', more: 'Hán Việt: **MỸ QUỐC** (美 = đẹp; lấy âm "Me-" của America). Người Việt gọi "nước Mỹ" từ chính chữ này.' },
        { w: '{俄罗斯|Éluósī}', pos: 'danh từ riêng', ipa: 'Éluósī', vi: 'Nga', ex: '{安娜|Ānnà}{是|shì}{俄罗斯|Éluósī}{人|rén}。', exRo: 'Ānnà shì Éluósī rén.', exVi: 'Anna là người Nga.', more: 'Hán Việt: NGA LA TƯ (phiên âm "Russia"). Tiếng Việt "Nga" lấy từ chữ đầu 俄. é đọc như "ơ" thanh 2.' },
        { w: '{英国|Yīngguó}', pos: 'danh từ riêng', ipa: 'Yīngguó', vi: 'Anh (Vương quốc Anh)', ex: '{玛丽|Mǎlì}{是|shì}{英国|Yīngguó}{人|rén}。', exRo: 'Mǎlì shì Yīngguó rén.', exVi: 'Mary là người Anh.', more: 'Hán Việt: **ANH QUỐC** (âm "Eng-" của England). 英语 Yīngyǔ = tiếng Anh (từ mở rộng).' },
        { w: '{法国|Fǎguó}', pos: 'danh từ riêng', ipa: 'Fǎguó', vi: 'Pháp', ex: '{苏菲|Sūfēi}{是|shì}{法国|Fǎguó}{人|rén}。', exRo: 'Sūfēi shì Fǎguó rén.', exVi: 'Sophie là người Pháp.', more: 'Hán Việt: **PHÁP QUỐC** (âm "F-" của France). f đọc như "ph" tiếng Việt.' },
        { w: '{德国|Déguó}', pos: 'danh từ riêng', ipa: 'Déguó', vi: 'Đức', ex: '{他|tā}{不|bú}{是|shì}{德国|Déguó}{人|rén}。', exRo: 'Tā bú shì Déguó rén.', exVi: 'Anh ấy không phải người Đức.', more: 'Hán Việt: **ĐỨC QUỐC** (âm "De-" của Deutschland). dé: e đọc như "ơ".' },
        { w: '{日本|Rìběn}', pos: 'danh từ riêng', ipa: 'Rìběn', vi: 'Nhật Bản', ex: '{山田|Shāntián}{是|shì}{日本|Rìběn}{人|rén}。', exRo: 'Shāntián shì Rìběn rén.', exVi: 'Yamada là người Nhật.', more: 'Hán Việt: **NHẬT BẢN** ("gốc mặt trời" — nơi mặt trời mọc). Không có chữ 国. rì: r uốn lưỡi + "ư".' },
        { w: '{韩国|Hánguó}', pos: 'danh từ riêng', ipa: 'Hánguó', vi: 'Hàn Quốc', ex: '{金美英|Jīn Měiyīng}{是|shì}{韩国|Hánguó}{人|rén}。', exRo: 'Jīn Měiyīng shì Hánguó rén.', exVi: 'Kim Mỹ Anh là người Hàn Quốc.', more: 'Hán Việt: **HÀN QUỐC**. Đừng nhầm 韩 Hán (Hàn Quốc) với 汉 Hàn (Hán — trong 汉语, 汉字): khác chữ, khác thanh.' },
        { w: '{泰国|Tàiguó}', pos: 'danh từ riêng', ipa: 'Tàiguó', vi: 'Thái Lan', ex: '{她|tā}{是|shì}{泰国|Tàiguó}{人|rén}{吗|ma}？', exRo: 'Tā shì Tàiguó rén ma?', exVi: 'Cô ấy là người Thái Lan à?', more: 'Hán Việt: THÁI QUỐC. Tiếng Việt gọi "Thái Lan", tiếng Trung gọi 泰国.' },
      ],
    },

    { t: 'h', text: 'Nhóm 4 — Thành phố (từ mở rộng, 4 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{河内|Hénèi}', pos: 'danh từ riêng', ipa: 'Hénèi', vi: 'Hà Nội (từ mở rộng)', ex: '{我|wǒ}{是|shì}{河内|Hénèi}{人|rén}。', exRo: 'Wǒ shì Hénèi rén.', exVi: 'Tôi là người Hà Nội.', more: 'Hán Việt: **HÀ NỘI** ("trong sông"). Thủ đô Việt Nam: 越南的首都 (học sau).' },
        { w: '{胡志明市|Húzhìmíng Shì}', pos: 'danh từ riêng', ipa: 'Húzhìmíng Shì', vi: 'Thành phố Hồ Chí Minh (từ mở rộng)', ex: '{他|tā}{是|shì}{胡志明市|Húzhìmíng Shì}{人|rén}。', exRo: 'Tā shì Húzhìmíng Shì rén.', exVi: 'Anh ấy là người Thành phố Hồ Chí Minh.', more: 'Hán Việt: HỒ CHÍ MINH THỊ (市 = thành phố). Người Trung Quốc cũng hay gọi tên cũ 西贡 Xīgòng (Sài Gòn).' },
        { w: '{广州|Guǎngzhōu}', pos: 'danh từ riêng', ipa: 'Guǎngzhōu', vi: 'Quảng Châu (từ mở rộng)', ex: '{他|tā}{不|bú}{是|shì}{北京|Běijīng}{人|rén}，{他|tā}{是|shì}{广州|Guǎngzhōu}{人|rén}。', exRo: 'Tā bú shì Běijīng rén, tā shì Guǎngzhōu rén.', exVi: 'Anh ấy không phải người Bắc Kinh, anh ấy là người Quảng Châu.', more: 'Hán Việt: **QUẢNG CHÂU** — thành phố lớn ở miền Nam Trung Quốc, gần Việt Nam. Người Quảng Châu nói tiếng Quảng Đông, khác hẳn tiếng phổ thông.' },
        { w: '{上海|Shànghǎi}', pos: 'danh từ riêng', ipa: 'Shànghǎi', vi: 'Thượng Hải (từ mở rộng)', ex: '{李|Lǐ}{老师|lǎoshī}{是|shì}{上海|Shànghǎi}{人|rén}。', exRo: 'Lǐ lǎoshī shì Shànghǎi rén.', exVi: 'Cô Lý là người Thượng Hải.', more: 'Hán Việt: **THƯỢNG HẢI** ("trên biển"). Thành phố đông dân nhất Trung Quốc.' },
      ],
    },
    {
      t: 'table',
      caption: 'Từ Bài 1–2 dùng lại nhiều trong Bài 3 (ôn, không tính vào 23 từ mới)',
      head: ['Từ', 'Pinyin', 'Nghĩa', 'Dùng trong Bài 3'],
      rows: [
        ['不', 'bù / bú', 'không', '不是 bú shì · 不叫 bú jiào · 不忙 bù máng — học kỹ ở Ngữ pháp ②'],
        ['是', 'shì', 'là', '我是越南人'],
        ['朋友', 'péngyou', 'bạn bè', '我朋友也是越南人'],
        ['同学', 'tóngxué', 'bạn học', '新同学'],
        ['谁 · 什么', 'shéi · shénme', 'ai · gì', 'thêm 哪 (nào) — cùng nhóm từ để hỏi'],
      ],
    },
    {
      t: 'table',
      caption: 'Tóm tắt: hỏi gì — đáp gì',
      head: ['Người kia nói', 'Bạn đáp', 'Nghĩa'],
      rows: [
        ['你是哪国人？', '我是越南人。', 'Bạn là người nước nào? — Tôi là người Việt Nam.'],
        ['你是中国人吗？', '不是，我是越南人。', 'Bạn là người Trung Quốc à? — Không, tôi là người Việt.'],
        ['我是学生，你呢？', '我也是学生。/ 我不是学生，我是老师。', 'Tôi là sinh viên, còn bạn? — Tôi cũng vậy. / Tôi không phải…'],
        ['很高兴认识你！', '我也很高兴！', 'Rất vui được làm quen! — Tôi cũng rất vui!'],
        ['他也是美国人吗？', '不是，他是英国人。', 'Anh ấy cũng là người Mỹ à? — Không, anh ấy là người Anh.'],
      ],
    },
    {
      t: 'mcq',
      id: 'b3-tv-nghia',
      title: 'Kiểm tra nghĩa từ',
      items: [
        m('{哪|nǎ} nghĩa là:', ['ai', 'gì', 'nào', 'đâu'], 2, '哪 = nào. Ai là 谁, gì là 什么.'),
        m('{也|yě} nghĩa là:', ['không', 'cũng', 'còn … thì sao', 'rất'], 1, '也 = cũng.'),
        m('{呢|ne} trong 你呢？ nghĩa là:', ['bạn có khoẻ không', 'còn bạn thì sao?', 'bạn tên gì', 'bạn ơi'], 1, 'N + 呢 = hỏi lại: "còn … thì sao?".'),
        m('{俄罗斯|Éluósī} là nước nào?', ['Pháp', 'Đức', 'Nga', 'Ý'], 2, '俄罗斯 = Nga (NGA LA TƯ).'),
        m('{英国|Yīngguó} là nước nào?', ['Mỹ', 'Anh', 'Úc', 'Canada'], 1, '英国 = Anh (ANH QUỐC). Mỹ là 美国.'),
        m('"Người Nhật" là:', ['日本人', '人日本', '日人本', '日本国人'], 0, 'Tên nước + 人: 日本人.'),
        m('{外国人|wàiguórén} nghĩa là:', ['người nước ngoài', 'người ngoài trời', 'người lạ mặt', 'người Trung Quốc'], 0, '外 ngoài + 国 nước + 人 người.'),
        m('{新|xīn} trong 新同学 nghĩa là:', ['cũ', 'mới', 'tốt', 'nhiều'], 1, '新 = mới (TÂN).'),
        m('{韩国|Hánguó} khác {汉|Hàn} (trong 汉字) ở chỗ:', ['Giống hệt nhau', 'Khác chữ và khác thanh: Hán (2) — Hàn (4)', 'Chỉ khác chữ', 'Chỉ khác thanh'], 1, '韩 Hán thanh 2 (Hàn Quốc); 汉 Hàn thanh 4 (người Hán, chữ Hán).'),
        m('{欢迎|huānyíng} nghĩa là:', ['tạm biệt', 'xin lỗi', 'chào mừng', 'cảm ơn'], 2, '欢迎 = chào mừng, hoan nghênh.'),
        m('Thành phố {河内|Hénèi} là:', ['Hải Phòng', 'Hà Nội', 'Huế', 'Hội An'], 1, '河内 = Hà Nội.'),
      ],
    },
  ],
};

/* ══════════════════════════ 3. NGỮ PHÁP ══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b3-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp Bài 3 — 哪国人, phủ định 不 (不是, 不 + động từ), 也, câu hỏi rút gọn 呢',
  goal: 'Hỏi – đáp quốc tịch bằng 哪国人; phủ định đúng mọi câu đã học bằng 不 (đọc đúng bù / bú); đặt 也 đúng chỗ (cả 也不); hỏi lại "còn bạn?" bằng 呢 và phân biệt 呢 với 吗.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Bốn điểm ngữ pháp',
      items: [
        '**① 哪国人**: S + 是 + 哪国人？ → S + 是 + **tên nước + 人**. Quê: S + 是 + **thành phố + 人**.',
        '**② 不**: 不 + 是 / động từ / tính từ — 不是, 不叫, 不认识, 不忙. Trước thanh 4 đọc **bú**. Sửa thông tin: **不是 A，是 B**.',
        '**③ 也**: S + **也** + V / Adj — 我也是, 我也很好, 我也不是. 也 không bao giờ đứng trước chủ ngữ.',
        '**④ 呢**: (câu kể)，+ N / đại từ + **呢？** = "còn … thì sao?" — 我是越南人，你呢？ Không đi với 吗.',
        'Ghép lại: **我是越南人，你呢？— 我也是越南人。/ 我不是越南人，我是中国人。**',
      ],
    },

    /* ── ① 哪国人 ── */
    { t: 'h', text: '① Hỏi quốc tịch: S + 是 + 哪国人？' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'S + 是 + 哪国人？',
          vi: 'Hỏi ai đó là người nước nào',
          examples: [
            { en: '{你|nǐ}{是|shì}{哪|nǎ}{国|guó}{人|rén}？', ro: 'Nǐ shì nǎ guó rén?', vi: 'Bạn là người nước nào?' },
            { en: '{她|tā}{是|shì}{哪|nǎ}{国|guó}{人|rén}？', ro: 'Tā shì nǎ guó rén?', vi: 'Cô ấy là người nước nào?' },
            { en: '{你们|nǐmen}{是|shì}{哪|nǎ}{国|guó}{人|rén}？', ro: 'Nǐmen shì nǎ guó rén?', vi: 'Các bạn là người nước nào?' },
            { en: '{李|Lǐ}{老师|lǎoshī}{是|shì}{哪|nǎ}{国|guó}{人|rén}？', ro: 'Lǐ lǎoshī shì nǎ guó rén?', vi: 'Cô Lý là người nước nào?' },
          ],
        },
        {
          formula: 'S + 是 + tên nước / thành phố + 人',
          vi: 'Trả lời: thay 哪国 bằng tên nước (hoặc thành phố)',
          examples: [
            { en: '{我|wǒ}{是|shì}{越南|Yuènán}{人|rén}。', ro: 'Wǒ shì Yuènán rén.', vi: 'Tôi là người Việt Nam.' },
            { en: '{她|tā}{是|shì}{俄罗斯|Éluósī}{人|rén}。', ro: 'Tā shì Éluósī rén.', vi: 'Cô ấy là người Nga.' },
            { en: '{我们|wǒmen}{是|shì}{美国|Měiguó}{人|rén}。', ro: 'Wǒmen shì Měiguó rén.', vi: 'Chúng tôi là người Mỹ.' },
            { en: '{李|Lǐ}{老师|lǎoshī}{是|shì}{上海|Shànghǎi}{人|rén}。', ro: 'Lǐ lǎoshī shì Shànghǎi rén.', vi: 'Cô Lý là người Thượng Hải.' },
            { en: '{我|wǒ}{是|shì}{越南|Yuènán}{河内|Hénèi}{人|rén}。', ro: 'Wǒ shì Yuènán Hénèi rén.', vi: 'Tôi là người Hà Nội, Việt Nam. (nước trước, thành phố sau)' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '**哪** nǎ = "nào" — từ để hỏi thứ ba sau 谁 (ai) và 什么 (gì) ở Bài 2, và cũng theo đúng luật: **đứng đúng chỗ của câu trả lời, không thêm 吗**. Cụm **哪国人** = "người nước nào". Khác tiếng Việt ở **trật tự**: tiếng Việt "người + Việt Nam" (cái chính trước, cái bổ nghĩa sau); tiếng Trung "越南 + 人" (cái bổ nghĩa **trước**, cái chính sau). Đây là quy luật chung rất quan trọng của tiếng Trung — **từ bổ nghĩa luôn đứng trước**: 新同学 (bạn học mới), 中国人 (người Trung Quốc), 汉语老师 (giáo viên tiếng Trung). Khi nói cả nước và thành phố: **lớn trước, nhỏ sau** — 越南河内人, ngược tiếng Việt "người Hà Nội, Việt Nam".',
    },
    {
      t: 'table',
      caption: 'Trật tự: tiếng Việt và tiếng Trung đảo nhau',
      head: ['Tiếng Việt (chính → phụ)', 'Tiếng Trung (phụ → chính)', 'Pinyin'],
      rows: [
        ['người **Việt Nam**', '**越南**人', 'Yuènán rén'],
        ['người **Bắc Kinh**', '**北京**人', 'Běijīng rén'],
        ['bạn học **mới**', '**新**同学', 'xīn tóngxué'],
        ['người **nước ngoài**', '**外国**人', 'wàiguórén'],
        ['người **nước nào**?', '**哪国**人？', 'nǎ guó rén?'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Dịch từng chữ theo trật tự tiếng Việt: ~~我是人越南。~~ → **我是越南人。**',
        'Quên 人: ~~我是越南。~~ (tôi là nước Việt Nam!) → **我是越南人。**',
        'Thêm 吗 vào câu có 哪: ~~你是哪国人吗？~~ → **你是哪国人？**',
        'Bỏ 是: ~~我越南人。~~ — trong khẩu ngữ đôi khi nghe thấy, nhưng người học nên nói đủ **我是越南人**.',
        'Nhầm 哪 nǎ (nào — thanh 3) với 那 nà (kia — thanh 4, Bài 8): 哪 có thêm bộ 口 (miệng) vì là từ để **hỏi**.',
      ],
    },
    { t: 'rule', formula: 'S + 是 + 哪国人？ → S + 是 + 国名 + 人。', vi: 'Hỏi quốc tịch bằng 哪国人 (không 吗); trả lời: tên nước / thành phố đứng TRƯỚC 人.' },

    /* ── ② 不 ── */
    { t: 'h', text: '② Phủ định với 不: 不是, 不 + động từ, 不 + tính từ' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'S + 不是 + N',
          vi: '"không phải là" — phủ định câu 是',
          examples: [
            { en: '{我|wǒ}{不|bú}{是|shì}{中国|Zhōngguó}{人|rén}。', ro: 'Wǒ bú shì Zhōngguó rén.', vi: 'Tôi không phải người Trung Quốc.' },
            { en: '{大伟|Dàwěi}{不|bú}{是|shì}{英国|Yīngguó}{人|rén}。', ro: 'Dàwěi bú shì Yīngguó rén.', vi: 'Đại Vĩ không phải người Anh.' },
            { en: '{她|tā}{不|bú}{是|shì}{老师|lǎoshī}。', ro: 'Tā bú shì lǎoshī.', vi: 'Cô ấy không phải là giáo viên.' },
          ],
        },
        {
          formula: 'S + 不 + V (叫 / 姓 / 认识 …)',
          vi: 'Phủ định động từ khác — 不 đứng ngay trước động từ',
          examples: [
            { en: '{他|tā}{不|bú}{叫|jiào}{王明|Wáng Míng}。', ro: 'Tā bú jiào Wáng Míng.', vi: 'Anh ấy không tên là Vương Minh.' },
            { en: '{我|wǒ}{不|bú}{姓|xìng}{李|Lǐ}，{我|wǒ}{姓|xìng}{黎|Lí}。', ro: 'Wǒ bú xìng Lǐ, wǒ xìng Lí.', vi: 'Tôi không họ Lý, tôi họ Lê.' },
            { en: '{我|wǒ}{不|bú}{认识|rènshi}{她|tā}。', ro: 'Wǒ bú rènshi tā.', vi: 'Tôi không quen cô ấy.' },
          ],
        },
        {
          formula: 'S + 不 + Adj (ôn Bài 1)',
          vi: 'Phủ định tính từ — bỏ 很',
          examples: [
            { en: '{我|wǒ}{不|bù}{忙|máng}。', ro: 'Wǒ bù máng.', vi: 'Tôi không bận.' },
            { en: '{河内|Hénèi}{不|bù}{冷|lěng}。', ro: 'Hénèi bù lěng.', vi: 'Hà Nội không lạnh.' },
            { en: '{他|tā}{不|bú}{热|rè}。', ro: 'Tā bú rè.', vi: 'Anh ấy không nóng.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '**不** bù = "không", giống chữ "không" của tiếng Việt ở chỗ **đứng ngay trước** từ bị phủ định: "tôi **không** phải" = 我**不**是, "tôi **không** quen" = 我**不**认识. Điểm cần luyện là **thanh điệu**: 不 vốn là thanh 4 (bù), nhưng khi đứng trước một chữ **thanh 4** thì đổi thành **thanh 2 (bú)** — vì hai thanh 4 liền nhau rất khó đọc. Bài này gặp nhiều chữ thanh 4 đi sau 不: **是 shì, 叫 jiào, 姓 xìng, 认 rèn, 热 rè**. Khoá này ghi luôn theo cách đọc (bú) để bạn khỏi phải nhẩm.',
    },
    {
      t: 'table',
      caption: '不 đọc bù hay bú? — nhìn thanh của chữ ĐI SAU',
      head: ['Chữ sau 不 là…', '不 đọc', 'Ví dụ', 'Pinyin'],
      rows: [
        ['thanh 1', '**bù**', '不高兴', 'bù gāoxìng'],
        ['thanh 2', '**bù**', '不忙', 'bù máng'],
        ['thanh 3', '**bù**', '不冷 · 不好', 'bù lěng · bù hǎo'],
        ['thanh 4', '**bú**', '不是 · 不叫 · 不姓 · 不认识 · 不热', 'bú shì · bú jiào · bú xìng · bú rènshi · bú rè'],
        ['đứng một mình / cuối câu', '**bù**', '不！(Không!)', 'Bù!'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'S + 不是 A，是 B',
          vi: '"không phải A, mà là B" — sửa thông tin sai',
          examples: [
            { en: '{她|tā}{不|bú}{是|shì}{日本|Rìběn}{人|rén}，{是|shì}{韩国|Hánguó}{人|rén}。', ro: 'Tā bú shì Rìběn rén, shì Hánguó rén.', vi: 'Cô ấy không phải người Nhật, mà là người Hàn.' },
            { en: '{我|wǒ}{不|bú}{是|shì}{老师|lǎoshī}，{是|shì}{学生|xuésheng}。', ro: 'Wǒ bú shì lǎoshī, shì xuésheng.', vi: 'Tôi không phải giáo viên, mà là sinh viên.' },
            { en: '{他|tā}{不|bú}{叫|jiào}{大伟|Dàwěi}，{叫|jiào}{王明|Wáng Míng}。', ro: 'Tā bú jiào Dàwěi, jiào Wáng Míng.', vi: 'Cậu ấy không tên Đại Vĩ, mà tên Vương Minh.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Cặp hỏi ↔ đáp: khẳng định và phủ định (mọi kiểu câu đã học)',
      head: ['Hỏi', 'Đáp khẳng định', 'Đáp phủ định'],
      rows: [
        ['你是中国人吗？', '是，我是中国人。', '不是，我是越南人。'],
        ['她叫安娜吗？', '对，她叫安娜。', '不，她不叫安娜，她叫玛丽。'],
        ['你姓王吗？', '对，我姓王。', '不，我不姓王，我姓张。'],
        ['你认识他吗？', '认识。', '不认识。'],
        ['你忙吗？', '我很忙。', '我不忙。'],
        ['北京热吗？', '北京很热。', '北京不热。(bú rè)'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Đặt 不 sau động từ kiểu "là không": ~~我是不中国人。~~ → **我不是中国人。**',
        'Dùng 没 thay 不: ~~我没是学生。~~ → **我不是学生。** (没 dùng cho 有 "có" và việc đã xảy ra — Bài 4, 15).',
        'Đọc 不是 thành "bù shì" — phải là **bú shì** (是 thanh 4). Ngược lại 不忙 vẫn **bù máng** (忙 thanh 2) — đừng đổi bừa mọi chữ 不 thành bú.',
        'Phủ định câu tính từ mà giữ 很: ~~我很不忙~~ khi chỉ muốn nói "tôi không bận" → **我不忙**.',
        'Trả lời "Không" cụt lủn bằng 不 cho câu hỏi 是…吗: được, nhưng tự nhiên hơn là **不是** + thông tin đúng.',
      ],
    },
    { t: 'rule', formula: 'S + 不 + 是 / V / Adj · 不是 A，是 B', vi: '不 đứng ngay trước từ bị phủ định; trước thanh 4 đọc bú, còn lại đọc bù; sửa thông tin bằng 不是…，是….' },

    /* ── ③ 也 ── */
    { t: 'h', text: '③ 也 — "cũng": S + 也 + V / Adj' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'S + 也 + 是 / V + …',
          vi: 'Người này CŨNG như người vừa nói tới',
          examples: [
            { en: '{安娜|Ānnà}{是|shì}{留学生|liúxuéshēng}，{我|wǒ}{也|yě}{是|shì}{留学生|liúxuéshēng}。', ro: 'Ānnà shì liúxuéshēng, wǒ yě shì liúxuéshēng.', vi: 'Anna là du học sinh, tôi cũng là du học sinh.' },
            { en: '{王明|Wáng Míng}{是|shì}{中国|Zhōngguó}{人|rén}，{李|Lǐ}{老师|lǎoshī}{也|yě}{是|shì}{中国|Zhōngguó}{人|rén}。', ro: 'Wáng Míng shì Zhōngguó rén, Lǐ lǎoshī yě shì Zhōngguó rén.', vi: 'Vương Minh là người Trung Quốc, cô Lý cũng là người Trung Quốc.' },
            { en: '{我|wǒ}{认识|rènshi}{大伟|Dàwěi}，{她|tā}{也|yě}{认识|rènshi}{大伟|Dàwěi}。', ro: 'Wǒ rènshi Dàwěi, tā yě rènshi Dàwěi.', vi: 'Tôi quen Đại Vĩ, cô ấy cũng quen Đại Vĩ.' },
            { en: '{他|tā}{姓|xìng}{王|Wáng}，{我|wǒ}{也|yě}{姓|xìng}{王|Wáng}！', ro: 'Tā xìng Wáng, wǒ yě xìng Wáng!', vi: 'Anh ấy họ Vương, tôi cũng họ Vương!' },
          ],
        },
        {
          formula: 'S + 也 + 很 + Adj',
          vi: '也 đứng TRƯỚC 很',
          examples: [
            { en: '{我|wǒ}{也|yě}{很|hěn}{好|hǎo}。', ro: 'Wǒ yě hěn hǎo.', vi: 'Tôi cũng khoẻ. (bốn thanh 3 liền — đọc wó yé hén hǎo)' },
            { en: '{我|wǒ}{也|yě}{很|hěn}{高兴|gāoxìng}！', ro: 'Wǒ yě hěn gāoxìng!', vi: 'Tôi cũng rất vui!' },
            { en: '{她|tā}{也|yě}{很|hěn}{忙|máng}。', ro: 'Tā yě hěn máng.', vi: 'Cô ấy cũng rất bận.' },
          ],
        },
        {
          formula: 'S + 也 + 不 + V / Adj',
          vi: '"cũng không" — thứ tự 也 → 不',
          examples: [
            { en: '{我|wǒ}{也|yě}{不|bú}{是|shì}{老师|lǎoshī}。', ro: 'Wǒ yě bú shì lǎoshī.', vi: 'Tôi cũng không phải giáo viên.' },
            { en: '{她|tā}{也|yě}{不|bú}{认识|rènshi}{他|tā}。', ro: 'Tā yě bú rènshi tā.', vi: 'Cô ấy cũng không quen anh ấy.' },
            { en: '{我|wǒ}{也|yě}{不|bù}{冷|lěng}。', ro: 'Wǒ yě bù lěng.', vi: 'Tôi cũng không lạnh.' },
          ],
        },
        {
          formula: 'S + 也 + 是。 (trả lời ngắn)',
          vi: '"Tôi cũng vậy / cũng thế" — chỉ với câu 是',
          examples: [
            { en: '{我|wǒ}{是|shì}{学生|xuésheng}。— {我|wǒ}{也|yě}{是|shì}。', ro: 'Wǒ shì xuésheng. — Wǒ yě shì.', vi: 'Tôi là sinh viên. — Tôi cũng vậy.' },
            { en: '{我|wǒ}{不|bú}{是|shì}{中国|Zhōngguó}{人|rén}。— {我|wǒ}{也|yě}{不|bú}{是|shì}。', ro: 'Wǒ bú shì Zhōngguó rén. — Wǒ yě bú shì.', vi: 'Tôi không phải người Trung Quốc. — Tôi cũng không.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '**也** yě = "cũng", và đứng **đúng chỗ của chữ "cũng" trong tiếng Việt**: "Tôi **cũng** là sinh viên" = 我**也**是学生. Quy tắc vàng: **也 là phó từ, luôn đứng sau chủ ngữ và trước động từ / tính từ** — không bao giờ đứng đầu câu như "also" của tiếng Anh, cũng không đứng cuối câu như "too". Khi gặp cả 也, 不, 很 trong một câu, thứ tự cố định là: **S + 也 + 不 / 很 + V / Adj**. Với câu tính từ, 也 đứng trước 很: 我也**很**好.',
    },
    {
      t: 'table',
      caption: 'Vị trí của 也 — so với tiếng Việt và tiếng Anh',
      head: ['Tiếng Việt', 'Tiếng Trung', 'Tiếng Anh (để thấy chỗ khác)'],
      rows: [
        ['Tôi **cũng** là sinh viên.', '我**也**是学生。', 'I am a student **too**. / I **also** am…'],
        ['Tôi **cũng** rất vui.', '我**也**很高兴。', 'I am **also** very happy.'],
        ['Tôi **cũng không** phải người Nhật.', '我**也不**是日本人。', 'I am not Japanese **either**.'],
        ['Tôi **cũng vậy**.', '我**也是**。', '**Me too.**'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — S + 也 + (不) + V / Adj',
      head: ['S', '也', '(不 / 很)', 'V / Adj + …', 'Câu mẫu'],
      rows: [
        ['我', '也', '—', '是越南人', '我也是越南人。'],
        ['她', '也', '不', '是老师', '她也不是老师。Tā yě bú shì lǎoshī.'],
        ['我们', '也', '很', '高兴', '我们也很高兴。'],
        ['大伟', '也', '—', '认识王明', '大伟也认识王明。'],
        ['李老师', '也', '不', '忙', '李老师也不忙。Lǐ lǎoshī yě bù máng.'],
        ['我朋友', '也', '—', '姓阮', '我朋友也姓阮。'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Đặt 也 trước chủ ngữ (như "also" đầu câu): ~~也我是学生。~~ → **我也是学生。**',
        'Đặt 也 ở cuối câu (như "too"): ~~我是学生也。~~ → **我也是学生。**',
        'Đảo 不 và 也: ~~我不也是老师。~~ → **我也不是老师。** (cũng → không).',
        'Đặt 也 sau 很: ~~我很也好。~~ → **我也很好。**',
        'Trả lời ~~我也。~~ (thiếu động từ) cho câu 我是学生 → **我也是。** 也 cần một động từ đi sau.',
        'Câu "Tôi cũng vậy" cho câu tính từ: 我很忙。— khẩu ngữ vẫn nói **我也是** (tôi cũng thế), nhưng khi làm bài và khi thi hãy nhắc lại tính từ cho rõ: **我也很忙。**',
      ],
    },
    { t: 'rule', formula: 'S + 也 + (不 / 很) + V / Adj', vi: '也 = cũng: luôn sau chủ ngữ, trước động từ / tính từ; "cũng không" là 也不, "cũng rất" là 也很.' },

    /* ── ④ 呢 ── */
    { t: 'h', text: '④ Câu hỏi rút gọn với 呢: …，你呢？' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '(câu kể / câu hỏi)，+ N / đại từ + 呢？',
          vi: '"Còn … thì sao?" — hỏi lại đúng nội dung vừa nói về một người khác',
          examples: [
            { en: '{我|wǒ}{是|shì}{越南|Yuènán}{人|rén}，{你|nǐ}{呢|ne}？', ro: 'Wǒ shì Yuènán rén, nǐ ne?', vi: 'Tôi là người Việt Nam, còn bạn? (= bạn là người nước nào?)' },
            { en: '{我|wǒ}{叫|jiào}{兰兰|Lánlan}，{你|nǐ}{呢|ne}？', ro: 'Wǒ jiào Lánlan, nǐ ne?', vi: 'Mình tên là Lan Lan, còn bạn? (= bạn tên gì?)' },
            { en: '{我|wǒ}{很|hěn}{好|hǎo}，{你|nǐ}{呢|ne}？', ro: 'Wǒ hěn hǎo, nǐ ne?', vi: 'Mình khoẻ, còn bạn? (= bạn có khoẻ không?)' },
            { en: '{大伟|Dàwěi}{是|shì}{美国|Měiguó}{人|rén}，{安娜|Ānnà}{呢|ne}？', ro: 'Dàwěi shì Měiguó rén, Ānnà ne?', vi: 'Đại Vĩ là người Mỹ, còn Anna?' },
          ],
        },
        {
          formula: 'N + 呢？ (đứng một mình, nối tiếp câu hỏi trước)',
          vi: 'Hỏi tiếp cùng câu hỏi cho người tiếp theo',
          examples: [
            { en: '{他|tā}{是|shì}{哪|nǎ}{国|guó}{人|rén}？……{她|tā}{呢|ne}？', ro: 'Tā shì nǎ guó rén? …… Tā ne?', vi: 'Anh ấy là người nước nào? … Còn cô ấy?' },
            { en: '{王明|Wáng Míng}{呢|ne}？', ro: 'Wáng Míng ne?', vi: 'Còn Vương Minh (thì sao)?' },
            { en: '{你们|nǐmen}{呢|ne}？', ro: 'Nǐmen ne?', vi: 'Còn các bạn?' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '**呢** ne (thanh nhẹ) giúp bạn **khỏi phải lặp lại cả câu hỏi**. Nghĩa của câu hỏi 呢 phụ thuộc vào **câu nói ngay trước**: nói về quốc tịch thì 你呢 = "bạn là người nước nào?", nói về tên thì 你呢 = "bạn tên gì?", hỏi thăm thì 你呢 = "bạn có khoẻ không?". Giống hệt tiếng Việt "**còn** bạn?". Vì 呢 đã là dấu hiệu câu hỏi nên **không thêm 吗**. Câu trả lời cho 呢 thường dùng **也** (nếu giống) hoặc **不** (nếu khác) — đó là lý do ba chữ này được học chung một bài.',
    },
    {
      t: 'table',
      caption: '呢 hỏi gì? — tuỳ câu đứng trước',
      head: ['Câu trước', '你呢？ nghĩa là', 'Trả lời giống (也)', 'Trả lời khác (不)'],
      rows: [
        ['我是越南人。', 'Bạn là người nước nào?', '我也是越南人。', '我不是越南人，我是中国人。'],
        ['我是学生。', 'Bạn có phải sinh viên không?', '我也是学生。', '我不是学生，我是老师。'],
        ['我很好。', 'Bạn có khoẻ không?', '我也很好。', '我不太好。(từ mở rộng — Bài 14)'],
        ['我姓阮。', 'Bạn họ gì?', '我也姓阮！', '我姓陈。'],
        ['我不认识他。', 'Bạn có quen anh ấy không?', '我也不认识他。', '我认识他。'],
      ],
    },
    {
      t: 'table',
      caption: '吗 và 呢 — hai trợ từ hỏi, hai việc khác nhau',
      head: ['', '吗 ma', '呢 ne'],
      rows: [
        ['Đứng sau', '**cả một câu kể** đầy đủ', '**một danh từ / đại từ** (hoặc câu có từ để hỏi)'],
        ['Hỏi', 'có / không?', 'còn … thì sao? (lặp lại câu hỏi trước)'],
        ['Ví dụ', '你是越南人吗？', '我是越南人，你呢？'],
        ['Trả lời', '是 / 不是', 'nói thông tin: 我也是… / 我是…'],
        ['Có dùng chung không?', 'Không bao giờ ~~你呢吗？~~', ''],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Dùng 呢 mở đầu cuộc nói chuyện khi chưa có câu trước: gặp người lạ hỏi ngay ~~你呢？~~ — người nghe không biết bạn hỏi gì. 呢 phải **nối tiếp** một câu đã nói.',
        'Dùng cả 呢 lẫn 吗: ~~你呢吗？~~ → **你呢？**',
        'Thay 呢 bằng 吗: ~~我是越南人，你吗？~~ → **你呢？** (吗 cần cả câu: 你是越南人吗？)',
        'Đọc 呢 thành "nê" có thanh: 呢 là **thanh nhẹ**, ngắn: "ne".',
      ],
    },
    { t: 'rule', formula: '…，N / đại từ + 呢？ → 也… / 不…', vi: '呢 = "còn … thì sao?", hỏi lại câu vừa nói cho người khác; không đi với 吗; đáp bằng 也 (giống) hoặc 不 (khác).' },

    /* ── So sánh với tiếng Việt ── */
    { t: 'h', text: 'Đặt cạnh tiếng Việt — giống và khác' },
    {
      t: 'table',
      caption: 'Câu Bài 3 so với tiếng Việt',
      head: ['Tiếng Việt', 'Tiếng Trung', 'Giống / khác'],
      rows: [
        ['Bạn là người nước **nào**?', '你是**哪**国人？', 'Giống: từ để hỏi đứng đúng chỗ. Khác: "nước nào" + "người" đảo vị trí.'],
        ['người **Việt Nam**', '**越南**人', 'Khác: tiếng Trung từ bổ nghĩa đứng TRƯỚC.'],
        ['Tôi **không** phải người Nhật.', '我**不**是日本人。', 'Giống: "không" ngay trước "phải / là".'],
        ['Tôi **cũng** là sinh viên.', '我**也**是学生。', 'Giống hệt vị trí của "cũng".'],
        ['Tôi **cũng không** bận.', '我**也不**忙。', 'Giống: "cũng" trước "không".'],
        ['**Còn** bạn?', '你**呢**？', 'Khác: tiếng Việt "còn" đứng trước, tiếng Trung 呢 đứng sau.'],
        ['Không phải A, **mà là** B.', '不是A，**是**B。', 'Khác: tiếng Trung không cần chữ "mà".'],
      ],
    },

    /* ── Tổng kết ── */
    { t: 'h', text: 'Tổng kết ngữ pháp Bài 3' },
    {
      t: 'table',
      head: ['Điểm', 'Công thức', 'Ví dụ', 'Dùng khi'],
      rows: [
        ['①', 'S + 是 + 哪国人？ → 国名 + 人', '你是哪国人？我是越南人。', 'Hỏi / nói quốc tịch, quê'],
        ['②', 'S + 不 + 是 / V / Adj · 不是A，是B', '我不是中国人。他不叫大伟。', 'Phủ định, sửa thông tin'],
        ['③', 'S + 也 + (不 / 很) + V / Adj', '我也是学生。我也不忙。', 'Nói "cũng"'],
        ['④', '…，N + 呢？', '我是越南人，你呢？', 'Hỏi lại "còn … ?"'],
      ],
    },
    {
      t: 'p',
      text: '**Mẫu tự giới thiệu đầy đủ** — gộp Bài 1–3 (thay thông tin của bạn): **大家好！我姓阮，叫阮氏兰。我是越南人，我是河内人。我是学生，我不是老师。很高兴认识大家！** — Chào mọi người! Tôi họ Nguyễn, tên là Nguyễn Thị Lan. Tôi là người Việt Nam, người Hà Nội. Tôi là sinh viên, không phải giáo viên. Rất vui được làm quen với mọi người!',
    },
    {
      t: 'build',
      id: 'b3-np-ghep',
      title: 'Ghép câu — Bài 3',
      items: [
        { vi: 'Bạn là người nước nào?', chips: ['{你|nǐ}', '{是|shì}', '{哪|nǎ}', '{国|guó}', '{人|rén}', '{吗|ma}'], answer: ['{你|nǐ}', '{是|shì}', '{哪|nǎ}', '{国|guó}', '{人|rén}'], ro: 'Nǐ shì nǎ guó rén?' },
        { vi: 'Tôi là người Việt Nam.', chips: ['{我|wǒ}', '{是|shì}', '{越南|Yuènán}', '{人|rén}', '{国|guó}'], answer: ['{我|wǒ}', '{是|shì}', '{越南|Yuènán}', '{人|rén}'], ro: 'Wǒ shì Yuènán rén.' },
        { vi: 'Anh ấy không phải người Mỹ.', chips: ['{他|tā}', '{不|bú}', '{是|shì}', '{美国|Měiguó}', '{人|rén}', '{也|yě}'], answer: ['{他|tā}', '{不|bú}', '{是|shì}', '{美国|Měiguó}', '{人|rén}'], ro: 'Tā bú shì Měiguó rén.' },
        { vi: 'Tôi cũng là sinh viên.', chips: ['{我|wǒ}', '{也|yě}', '{是|shì}', '{学生|xuésheng}', '{呢|ne}'], answer: ['{我|wǒ}', '{也|yě}', '{是|shì}', '{学生|xuésheng}'], ro: 'Wǒ yě shì xuésheng.' },
        { vi: 'Cô ấy cũng không phải giáo viên.', chips: ['{她|tā}', '{也|yě}', '{不|bú}', '{是|shì}', '{老师|lǎoshī}', '{很|hěn}'], answer: ['{她|tā}', '{也|yě}', '{不|bú}', '{是|shì}', '{老师|lǎoshī}'], ro: 'Tā yě bú shì lǎoshī.' },
        { vi: 'Tôi là người Nga, còn bạn?', chips: ['{我|wǒ}', '{是|shì}', '{俄罗斯|Éluósī}', '{人|rén}', '{你|nǐ}', '{呢|ne}', '{吗|ma}'], answer: ['{我|wǒ}', '{是|shì}', '{俄罗斯|Éluósī}', '{人|rén}', '{你|nǐ}', '{呢|ne}'], ro: 'Wǒ shì Éluósī rén, nǐ ne?' },
        { vi: 'Tôi cũng rất vui!', chips: ['{我|wǒ}', '{也|yě}', '{很|hěn}', '{高兴|gāoxìng}', '{不|bù}'], answer: ['{我|wǒ}', '{也|yě}', '{很|hěn}', '{高兴|gāoxìng}'], ro: 'Wǒ yě hěn gāoxìng!' },
        { vi: 'Tôi không quen cô ấy.', chips: ['{我|wǒ}', '{不|bú}', '{认识|rènshi}', '{她|tā}', '{是|shì}'], answer: ['{我|wǒ}', '{不|bú}', '{认识|rènshi}', '{她|tā}'], ro: 'Wǒ bú rènshi tā.' },
        { vi: 'Cô ấy không phải người Nhật, mà là người Hàn.', chips: ['{她|tā}', '{不|bú}', '{是|shì}', '{日本|Rìběn}', '{人|rén}', '{是|shì}', '{韩国|Hánguó}', '{人|rén}'], answer: ['{她|tā}', '{不|bú}', '{是|shì}', '{日本|Rìběn}', '{人|rén}', '{是|shì}', '{韩国|Hánguó}', '{人|rén}'], ro: 'Tā bú shì Rìběn rén, shì Hánguó rén.' },
        { vi: 'Còn Vương Minh?', chips: ['{王明|Wáng Míng}', '{呢|ne}', '{吗|ma}'], answer: ['{王明|Wáng Míng}', '{呢|ne}'], ro: 'Wáng Míng ne?' },
        { vi: 'Cô Lý cũng là người Trung Quốc.', chips: ['{李|Lǐ}', '{老师|lǎoshī}', '{也|yě}', '{是|shì}', '{中国|Zhōngguó}', '{人|rén}', '{不|bú}'], answer: ['{李|Lǐ}', '{老师|lǎoshī}', '{也|yě}', '{是|shì}', '{中国|Zhōngguó}', '{人|rén}'], ro: 'Lǐ lǎoshī yě shì Zhōngguó rén.' },
      ],
    },
    {
      t: 'quiz',
      id: 'b3-np-dien',
      title: 'Điền một chữ vào （　）: 哪 · 不 · 也 · 呢 · 人 · 吗',
      kind: 'fill',
      grammar: '哪国人 · 国名 + 人 · 不 + 是 / V / Adj · S + 也 + V · …，N + 呢？ · câu kể + 吗',
      items: [
        { q: '{你|nǐ}{是|shì}（　）{国|guó}{人|rén}？', answers: ['哪'], hint: 'Bạn là người nước NÀO?' },
        { q: '{我|wǒ}{是|shì}{越南|Yuènán}（　）。', answers: ['人'], hint: 'Tôi là NGƯỜI Việt Nam.' },
        { q: '{我|wǒ}（　）{是|shì}{中国|Zhōngguó}{人|rén}。', answers: ['不'], hint: 'Tôi KHÔNG phải người Trung Quốc.' },
        { q: '{安娜|Ānnà}{是|shì}{学生|xuésheng}，{我|wǒ}（　）{是|shì}{学生|xuésheng}。', answers: ['也'], hint: 'Anna là sinh viên, tôi CŨNG là sinh viên.' },
        { q: '{我|wǒ}{是|shì}{美国|Měiguó}{人|rén}，{你|nǐ}（　）？', answers: ['呢'], hint: 'Tôi là người Mỹ, CÒN bạn?' },
        { q: '{你|nǐ}{是|shì}{日本|Rìběn}{人|rén}（　）？', answers: ['吗'], hint: 'Bạn là người Nhật À?' },
        { q: '{她|tā}{也|yě}（　）{认识|rènshi}{他|tā}。', answers: ['不'], hint: 'Cô ấy cũng KHÔNG quen anh ấy.' },
        { q: '{我|wǒ}（　）{很|hěn}{高兴|gāoxìng}！', answers: ['也'], hint: 'Tôi CŨNG rất vui!' },
        { q: '{大伟|Dàwěi}{是|shì}{美国|Měiguó}{人|rén}，{安娜|Ānnà}（　）？', answers: ['呢'], hint: 'Đại Vĩ là người Mỹ, CÒN Anna?' },
        { q: '{他|tā}{不|bú}{是|shì}{英国|Yīngguó}{人|rén}，（　）{美国|Měiguó}{人|rén}。', answers: ['是'], hint: 'Không phải người Anh, MÀ LÀ người Mỹ.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b3-np-trac-nghiem',
      title: 'Trắc nghiệm ngữ pháp Bài 3',
      items: [
        m('"Tôi là người Việt Nam." — câu nào đúng?', ['我是人越南。', '我是越南人。', '我越南是人。', '我是越南。'], 1, 'Tên nước + 人.'),
        m('"Tôi cũng là sinh viên." — câu nào đúng?', ['也我是学生。', '我是学生也。', '我也是学生。', '我是也学生。'], 2, '也 sau chủ ngữ, trước động từ.'),
        m('"Tôi cũng không phải giáo viên." — câu nào đúng?', ['我不也是老师。', '我也不是老师。', '我也是不老师。', '也我不是老师。'], 1, 'Thứ tự: 也 + 不 + 是.'),
        m('Câu nào **sai**?', ['你是哪国人？', '你是哪国人吗？', '你是中国人吗？', '我是越南人，你呢？'], 1, 'Câu có 哪 không thêm 吗.'),
        m('不叫 đọc là:', ['bù jiào', 'bú jiào', 'bǔ jiào', 'bū jiào'], 1, '叫 thanh 4 → 不 đọc bú.'),
        m('不忙 đọc là:', ['bù máng', 'bú máng', 'bǔ máng', 'bū máng'], 0, '忙 thanh 2 → 不 giữ bù.'),
        m('我是越南人，你呢？ — người hỏi muốn biết:', ['Bạn có khoẻ không', 'Bạn là người nước nào', 'Bạn tên gì', 'Bạn có quen tôi không'], 1, '呢 lặp lại nội dung câu trước: quốc tịch.'),
        m('"Tôi cũng rất vui" — câu nào đúng?', ['我很也高兴。', '我也很高兴。', '我高兴也很。', '也我很高兴。'], 1, '也 đứng trước 很.'),
        m('Phủ định 是 dùng:', ['没是', '不是', '是不', '没有'], 1, '是 phủ định bằng 不: 不是.'),
        m('Cô ấy không phải người Pháp mà là người Đức:', ['她不是法国人，是德国人。', '她是不法国人，是德国人。', '她没是法国人，是德国人。', '她不法国人，德国人。'], 0, 'Mẫu 不是A，是B.'),
      ],
    },
  ],
};

/* ══════════════════════════ 4. CHỮ HÁN ══════════════════════════ */

const HAN_TU: Lesson = {
  id: 'b3-han-tu',
  kind: 'kanji',
  title: 'Chữ Hán Bài 3 — 12 chữ: 国 家 哪 不 也 呢 越 南 美 英 法 俄',
  goal: 'Nhận mặt, đọc đúng và viết được 12 chữ Hán của Bài 3; đọc được tên các nước và câu quốc tịch không cần pinyin.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Cách học chữ Hán bài này',
      items: [
        '12 chữ — mỗi chữ: **xem thứ tự nét → tô theo → tự viết** (khối tập viết cuối bài).',
        'Bộ thủ: **口** (miệng) trong 哪, 呢 — hai chữ "hỏi"; **囗** (vây quanh — to, bao kín) trong 国; **宀** (mái nhà) trong 家; **氵** (nước) trong 法; **艹** (cỏ) trong 英; **亻** trong 俄.',
        'Âm Hán Việt của tên nước chính là chìa khoá: 越南 VIỆT NAM, 美 MỸ, 英 ANH, 法 PHÁP, 俄 NGA, 国 QUỐC, 家 GIA.',
        'Chữ 人 (người) và 中 (trong 中国) đã viết ở Bài 0 — ôn lại trong phần đọc.',
      ],
    },
    {
      t: 'table',
      caption: '12 chữ Hán của Bài 3',
      head: ['Chữ', 'Pinyin', 'Hán Việt', 'Bộ thủ', 'Số nét', 'Nghĩa', 'Từ ví dụ'],
      rows: [
        ['国', 'guó', 'QUỐC', '囗 (vi — vây quanh)', '8', 'nước, quốc gia', '中国 · 国家 · 哪国人'],
        ['家', 'jiā', 'GIA', '宀 (miên — mái nhà)', '10', 'nhà, gia đình', '国家 · 大家'],
        ['哪', 'nǎ', 'NA', '口 (miệng)', '9', 'nào', '哪国人'],
        ['不', 'bù', 'BẤT', '一 (nhất)', '4', 'không', '不是 · 不认识'],
        ['也', 'yě', 'DÃ', '乙 (ất)', '3', 'cũng', '我也是'],
        ['呢', 'ne', 'NI', '口 (miệng)', '8', '(trợ từ: còn … thì sao)', '你呢'],
        ['越', 'yuè', 'VIỆT', '走 (tẩu — đi, chạy)', '12', 'vượt qua; Việt', '越南'],
        ['南', 'nán', 'NAM', '十 (thập)', '9', 'phương nam', '越南 · 南方'],
        ['美', 'měi', 'MỸ', '羊 (dương — con dê)', '9', 'đẹp; nước Mỹ', '美国'],
        ['英', 'yīng', 'ANH', '艹 (thảo — cỏ)', '8', 'tinh hoa; nước Anh', '英国'],
        ['法', 'fǎ', 'PHÁP', '氵 (thuỷ — nước)', '8', 'luật, phép; nước Pháp', '法国'],
        ['俄', 'é', 'NGA', '亻 (người)', '9', 'nước Nga', '俄罗斯'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ bằng hình và bộ thủ',
      items: [
        '**国** = **囗** (khung bao — biên giới) + **玉** (ngọc — báu vật): đất nước là vùng đất có biên giới bao quanh, giữ của báu bên trong. Viết khung **囗** trước, cho 玉 vào, **đóng đáy sau cùng**.',
        '**家** = **宀** (mái nhà) + **豕** (con lợn): ngày xưa nhà nào cũng nuôi lợn dưới mái nhà → **nhà**. 国 + 家 = quốc gia: nước là "nhà lớn".',
        '**哪** = **口** (miệng) + **那** (nà — kia, gợi âm): mở miệng hỏi "cái **nào**?". Bỏ 口 đi là 那 (kia).',
        '**呢** = **口** (miệng) + **尼** (ní — gợi âm). Cũng là chữ "hỏi" có bộ miệng, như 吗.',
        '**不** — theo sách cổ Thuyết Văn: hình con chim bay vút lên trời **không** chịu xuống. Chỉ 4 nét: ngang, phẩy, sổ, chấm.',
        '**也** — chính là **phần bên phải** của 他 và 她 ở Bài 1! Chỉ 3 nét: ngang gập móc, sổ, sổ cong móc.',
        '**越** = **走** (đi, chạy) + **戉** (yuè — cái rìu, gợi âm): chạy **vượt** qua → VIỆT (vượt, như "siêu việt", "vượt"). Trong 越南, 越 còn là tên gọi cổ của các tộc **Bách Việt**, 南 = phương Nam.',
        '**美** = **羊** (con dê) ở trên + **大** (to) ở dưới: con dê to béo → **đẹp**, tốt. Nước Mỹ được gọi là "nước đẹp" 美国.',
        '**英** = **艹** (cỏ) + **央** (giữa): phần tinh tuý giữa cỏ cây, tức **bông hoa** → tinh hoa, anh tài (英雄 anh hùng).',
        '**法** = **氵** (nước) + **去** (đi): nước chảy đi luôn **phẳng lặng, công bằng** → luật **pháp**.',
        '**俄** = **亻** (người) + **我** (wǒ — gợi âm): đã học 我 ở Bài 1, chỉ thêm 亻 bên trái.',
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận: các chữ dễ viết nhầm',
      items: [
        '**国 ↔ 回 ↔ 因**: 国 bên trong là **玉** (có chấm), 回 là 口 trong 口, 因 là 大. Thiếu chấm trong 国 là sai chính tả!',
        '**哪 ↔ 那**: 哪 (nào — hỏi) có **口** bên trái; 那 (kia — Bài 8) thì không. Đọc cũng khác: nǎ (thanh 3) — nà (thanh 4).',
        '**呢 ↔ 泥 ↔ 尼**: 呢 bộ 口 (trợ từ), 泥 ní bộ 氵 (bùn), 尼 ní (chữ gốc). Viết câu hỏi thì phải có bộ **miệng**.',
        '**也 ↔ 他 ↔ 她**: 也 đứng một mình (cũng); thêm 亻 → 他, thêm 女 → 她.',
        '**美 ↔ 姜 ↔ 羊**: 美 dưới là 大; 姜 jiāng (gừng) dưới là 女. Phần trên của 美 là hai chấm, ba nét ngang và một nét sổ ngắn — nét sổ dừng lại, KHÔNG thò xuống dài như trong 羊.',
        '**英 ↔ 央**: 英 có 艹 ở trên; 央 yāng (giữa) đứng một mình thì không.',
      ],
    },
    {
      t: 'readkanji',
      id: 'b3-doc-chu',
      title: 'Đọc chữ trần — không pinyin',
      note: 'Như đề HSK: chữ không có pinyin. Đọc to cả câu một hơi (nhớ: 不是 → bú shì; 不忙 → bù máng; 呢 thanh nhẹ; 我也很好 bốn thanh 3 liền), rồi mới bấm hiện pinyin + nghe để tự chấm.',
      items: [
        { text: '{你|nǐ}{是|shì}{哪|nǎ}{国|guó}{人|rén}？', ro: 'Nǐ shì nǎ guó rén?', vi: 'Bạn là người nước nào?' },
        { text: '{我|wǒ}{是|shì}{越南|Yuènán}{人|rén}。', ro: 'Wǒ shì Yuènán rén.', vi: 'Tôi là người Việt Nam.' },
        { text: '{他|tā}{是|shì}{美国|Měiguó}{人|rén}。', ro: 'Tā shì Měiguó rén.', vi: 'Anh ấy là người Mỹ.' },
        { text: '{她|tā}{不|bú}{是|shì}{英国|Yīngguó}{人|rén}。', ro: 'Tā bú shì Yīngguó rén.', vi: 'Cô ấy không phải người Anh.' },
        { text: '{我|wǒ}{也|yě}{是|shì}{中国|Zhōngguó}{人|rén}。', ro: 'Wǒ yě shì Zhōngguó rén.', vi: 'Tôi cũng là người Trung Quốc.' },
        { text: '{我|wǒ}{是|shì}{法国|Fǎguó}{人|rén}，{你|nǐ}{呢|ne}？', ro: 'Wǒ shì Fǎguó rén, nǐ ne?', vi: 'Tôi là người Pháp, còn bạn?' },
        { text: '{安娜|Ānnà}{是|shì}{俄罗斯|Éluósī}{人|rén}。', ro: 'Ānnà shì Éluósī rén.', vi: 'Anna là người Nga.' },
        { text: '{我|wǒ}{也|yě}{不|bú}{是|shì}{日本|Rìběn}{人|rén}。', ro: 'Wǒ yě bú shì Rìběn rén.', vi: 'Tôi cũng không phải người Nhật.' },
        { text: '{大家|dàjiā}{好|hǎo}！{我|wǒ}{是|shì}{越南|Yuènán}{河内|Hénèi}{人|rén}。', ro: 'Dàjiā hǎo! Wǒ shì Yuènán Hénèi rén.', vi: 'Chào mọi người! Tôi là người Hà Nội, Việt Nam.' },
        { text: '{我|wǒ}{也|yě}{很|hěn}{好|hǎo}。', ro: 'Wǒ yě hěn hǎo.', vi: 'Tôi cũng khoẻ.' },
        { text: '{他|tā}{不|bú}{叫|jiào}{大伟|Dàwěi}，{他|tā}{叫|jiào}{王明|Wáng Míng}。', ro: 'Tā bú jiào Dàwěi, tā jiào Wáng Míng.', vi: 'Anh ấy không tên là Đại Vĩ, anh ấy tên là Vương Minh.' },
        { text: '{越南|Yuènán}{是|shì}{国家|guójiā}。', ro: 'Yuènán shì guójiā.', vi: 'Việt Nam là một quốc gia.' },
      ],
    },
    {
      t: 'table',
      caption: 'Chữ của bài trong từ ghép khác — đoán nghĩa nhờ âm Hán Việt (chỉ để nhận mặt, chưa cần học)',
      head: ['Từ', 'Pinyin', 'Hán Việt', 'Nghĩa'],
      rows: [
        ['国际', 'guójì', 'QUỐC TẾ', 'quốc tế'],
        ['家人', 'jiārén', 'GIA NHÂN', 'người nhà (Bài 4)'],
        ['南方', 'nánfāng', 'NAM PHƯƠNG', 'phương nam, miền Nam'],
        ['美丽', 'měilì', 'MỸ LỆ', 'đẹp, mỹ lệ'],
        ['英雄', 'yīngxióng', 'ANH HÙNG', 'anh hùng'],
        ['方法', 'fāngfǎ', 'PHƯƠNG PHÁP', 'phương pháp'],
        ['不同', 'bùtóng', 'BẤT ĐỒNG', 'khác nhau'],
        ['越来越', 'yuè lái yuè', 'VIỆT LAI VIỆT', 'càng ngày càng (HSK 3)'],
      ],
    },
    {
      t: 'readkanji',
      id: 'b3-doc-doan',
      title: 'Đọc to cả đoạn — chữ trần',
      note: 'Mỗi đoạn là một cảnh nhỏ. Nhìn 20 giây, đọc một hơi không dừng, rồi bấm hiện pinyin để tự chấm. Chỗ hay vấp: 不是 bú shì, 也 yě (đọc liền với chữ sau), 俄罗斯 Éluósī.',
      items: [
        { text: '{你|nǐ}{是|shì}{哪|nǎ}{国|guó}{人|rén}？— {我|wǒ}{是|shì}{越南|Yuènán}{人|rén}，{你|nǐ}{呢|ne}？— {我|wǒ}{是|shì}{中国|Zhōngguó}{人|rén}。', ro: 'Nǐ shì nǎ guó rén? — Wǒ shì Yuènán rén, nǐ ne? — Wǒ shì Zhōngguó rén.', vi: 'Bạn là người nước nào? — Mình là người Việt Nam, còn bạn? — Mình là người Trung Quốc.' },
        { text: '{她|tā}{是|shì}{日本|Rìběn}{人|rén}{吗|ma}？— {不|bú}{是|shì}，{她|tā}{不|bú}{是|shì}{日本|Rìběn}{人|rén}，{是|shì}{韩国|Hánguó}{人|rén}。', ro: 'Tā shì Rìběn rén ma? — Bú shì, tā bú shì Rìběn rén, shì Hánguó rén.', vi: 'Cô ấy là người Nhật à? — Không, cô ấy không phải người Nhật, mà là người Hàn.' },
        { text: '{我|wǒ}{是|shì}{学生|xuésheng}，{我|wǒ}{朋友|péngyou}{也|yě}{是|shì}{学生|xuésheng}。{我们|wǒmen}{不|bú}{是|shì}{老师|lǎoshī}。', ro: 'Wǒ shì xuésheng, wǒ péngyou yě shì xuésheng. Wǒmen bú shì lǎoshī.', vi: 'Tôi là sinh viên, bạn tôi cũng là sinh viên. Chúng tôi không phải giáo viên.' },
        { text: '{很|hěn}{高兴|gāoxìng}{认识|rènshi}{你|nǐ}！— {我|wǒ}{也|yě}{很|hěn}{高兴|gāoxìng}！{欢迎|huānyíng}{你|nǐ}！', ro: 'Hěn gāoxìng rènshi nǐ! — Wǒ yě hěn gāoxìng! Huānyíng nǐ!', vi: 'Rất vui được làm quen với bạn! — Mình cũng rất vui! Chào mừng bạn!' },
      ],
    },
    {
      t: 'mcq',
      id: 'b3-han-tu-nhan',
      title: 'Nhận mặt chữ',
      items: [
        m('Chữ nào nghĩa là "cũng"?', ['他', '也', '她', '呢'], 1, '也 yě = cũng; 他/她 có 也 ở bên phải.'),
        m('Chữ nào là từ để **hỏi** "nào"?', ['那', '哪', '呢', '吗'], 1, '哪 có bộ 口 (miệng); 那 (kia) không có.'),
        m('Bộ thủ của 国 là:', ['玉', '囗', '口', '王'], 1, '国 thuộc bộ 囗 (vây quanh) — khung lớn bao ngoài.'),
        m('Âm Hán Việt của 越南 là:', ['VIỆT NAM', 'NAM VIỆT', 'VIỆT QUỐC', 'ĐẠI VIỆT'], 0, '越 VIỆT + 南 NAM.'),
        m('Chữ 美 gồm:', ['羊 + 大', '王 + 大', '羊 + 女', '米 + 大'], 0, '美 = 羊 (dê) ở trên + 大 (to) ở dưới.'),
        m('Chữ 法 có bộ gì, gợi nghĩa gì?', ['氵 — nước', '亻 — người', '口 — miệng', '艹 — cỏ'], 0, '法 = 氵 + 去: nước chảy phẳng → luật pháp.'),
        m('Chữ 也 có bao nhiêu nét?', ['2', '3', '4', '5'], 1, '也: 3 nét.'),
        m('Chữ 家 nghĩa gốc là:', ['nước', 'nhà', 'người', 'mái'], 1, '家 = 宀 (mái) + 豕 (lợn) → nhà.'),
        m('Chữ 俄 có phần bên phải là chữ nào đã học?', ['我', '找', '成', '代'], 0, '俄 = 亻 + 我.'),
      ],
    },
    {
      t: 'write',
      id: 'b3-viet-chu',
      title: 'Tập viết 12 chữ của Bài 3',
      note: 'Thứ tự gợi ý: chữ ít nét trước. Bấm ▶ xem nét → tô theo → tự viết 3 lần, đọc to pinyin mỗi lần viết. Chú ý: 国 đóng đáy khung sau cùng và có chấm trong 玉; 也 chỉ 3 nét; 越: nét mác dài của 走 đỡ bên dưới cả phần 戉 — bấm ▶ xem kỹ thứ tự nét; 南 viết 十 trước rồi mới khung 冂.',
      chars: ['也', '不', '国', '英', '法', '呢', '哪', '南', '美', '俄', '家', '越'],
    },
  ],
};

/* ══════════════════════════ 5. NGHE ══════════════════════════ */

const NGHE: Lesson = {
  id: 'b3-nghe',
  kind: 'listening',
  title: 'Luyện nghe Bài 3 — kiểu đề HSK 1',
  goal: 'Nghe hiểu tên nước, quốc tịch, quê trong câu và hội thoại ngắn; bắt được 不 (phủ định), 也 (cũng) và 呢 (hỏi lại) để trả lời đúng ai là người nước nào.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Cách làm bài nghe',
      items: [
        'Bấm **nghe cả bài** 2 lần: lần 1 chỉ nghe, lần 2 ghi chú **tên người — nước** thành bảng nhỏ → làm câu hỏi → rồi mới mở lời thoại.',
        'Từ khoá Bài 3: tên nước **越南 · 中国 · 美国 · 俄罗斯 · 英国 · 法国 · 德国 · 日本 · 韩国 · 泰国** + **人**; **哪国人 · 不是 · 也 · 呢**.',
        'Bẫy hay gặp: nghe thấy tên nước nhưng trước nó có **不是** → người đó KHÔNG phải người nước ấy.',
        'Nghe **也**: thông tin của người này **giống** người trước — phải nhớ người trước là gì.',
      ],
    },
    {
      t: 'note',
      title: 'Dạng đề HSK 1 (phần Nghe — 听力) dùng trong bài này',
      items: [
        '**Phần 1**: nghe một cụm/câu ngắn, phán đoán đúng/sai với tranh → *Bài nghe 1* (tranh = mô tả bằng chữ).',
        '**Phần 2**: nghe một câu, chọn 1 trong 3 tranh → *Bài nghe 2* (chọn lá cờ / nước).',
        '**Phần 3–4**: nghe hội thoại, trả lời câu hỏi → *Bài nghe 3, 4, 5*.',
      ],
    },

    { t: 'h', text: 'Bài nghe 1 — Đúng hay sai?' },
    {
      t: 'listen',
      id: 'b3-nghe-1',
      title: 'Bốn câu về quốc tịch',
      note: 'Mỗi câu đi kèm một mô tả ở câu hỏi. Nghe → chọn "Đúng" nếu câu nghe khớp với mô tả.',
      lines: [
        { who: 'Câu 1', voice: 'zh-nam', text: '{我|wǒ}{是|shì}{中国|Zhōngguó}{人|rén}。', ro: 'Wǒ shì Zhōngguó rén.', vi: 'Tôi là người Trung Quốc.' },
        { who: 'Câu 2', voice: 'zh-nu', text: '{我|wǒ}{不|bú}{是|shì}{日本|Rìběn}{人|rén}。', ro: 'Wǒ bú shì Rìběn rén.', vi: 'Tôi không phải người Nhật.' },
        { who: 'Câu 3', voice: 'zh-nam', text: '{他|tā}{是|shì}{英国|Yīngguó}{人|rén}。', ro: 'Tā shì Yīngguó rén.', vi: 'Anh ấy là người Anh.' },
        { who: 'Câu 4', voice: 'zh-nu', text: '{我们|wǒmen}{也|yě}{是|shì}{越南|Yuènán}{人|rén}。', ro: 'Wǒmen yě shì Yuènán rén.', vi: 'Chúng tôi cũng là người Việt Nam.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b3-nghe-q1',
      title: 'Câu hỏi bài nghe 1',
      items: [
        m('Câu 1 — Mô tả: "Người đàn ông cầm lá cờ đỏ năm sao (Trung Quốc)." Đúng hay sai?', ['Đúng', 'Sai'], 0, '我是中国人 — tôi là người Trung Quốc.'),
        m('Câu 2 — Mô tả: "Cô gái mặc kimono, nói mình là người Nhật." Đúng hay sai?', ['Đúng', 'Sai'], 1, '我不是日本人 — KHÔNG phải người Nhật.'),
        m('Câu 3 — Mô tả: "Anh ấy là người Mỹ." Đúng hay sai?', ['Đúng', 'Sai'], 1, '英国人 = người Anh, không phải 美国人 (người Mỹ). Nghe kỹ Yīng / Měi.'),
        m('Câu 4 — Mô tả: "Một nhóm bạn Việt Nam." Đúng hay sai?', ['Đúng', 'Sai'], 0, '我们也是越南人.'),
      ],
    },

    { t: 'h', text: 'Bài nghe 2 — Người nước nào?' },
    {
      t: 'listen',
      id: 'b3-nghe-2',
      title: 'Năm người tự giới thiệu',
      note: 'Mỗi người nói một câu. Chọn đúng nước của từng người.',
      lines: [
        { who: 'Người 1', voice: 'zh-nu', text: '{你好|nǐ hǎo}！{我|wǒ}{是|shì}{法国|Fǎguó}{人|rén}。', ro: 'Nǐ hǎo! Wǒ shì Fǎguó rén.', vi: 'Chào bạn! Tôi là người Pháp.' },
        { who: 'Người 2', voice: 'zh-nam', text: '{我|wǒ}{不|bú}{是|shì}{美国|Měiguó}{人|rén}，{我|wǒ}{是|shì}{德国|Déguó}{人|rén}。', ro: 'Wǒ bú shì Měiguó rén, wǒ shì Déguó rén.', vi: 'Tôi không phải người Mỹ, tôi là người Đức.' },
        { who: 'Người 3', voice: 'zh-nu', text: '{我|wǒ}{是|shì}{泰国|Tàiguó}{人|rén}。', ro: 'Wǒ shì Tàiguó rén.', vi: 'Tôi là người Thái Lan.' },
        { who: 'Người 4', voice: 'zh-nam', text: '{我|wǒ}{是|shì}{韩国|Hánguó}{人|rén}，{不|bú}{是|shì}{日本|Rìběn}{人|rén}。', ro: 'Wǒ shì Hánguó rén, bú shì Rìběn rén.', vi: 'Tôi là người Hàn, không phải người Nhật.' },
        { who: 'Người 5', voice: 'zh-nu', text: '{我|wǒ}{是|shì}{越南|Yuènán}{人|rén}，{我|wǒ}{是|shì}{胡志明市|Húzhìmíng Shì}{人|rén}。', ro: 'Wǒ shì Yuènán rén, wǒ shì Húzhìmíng Shì rén.', vi: 'Tôi là người Việt Nam, người Thành phố Hồ Chí Minh.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b3-nghe-q2',
      title: 'Câu hỏi bài nghe 2',
      items: [
        m('Người 1 là người nước nào?', ['Pháp', 'Anh', 'Mỹ'], 0, '法国人 Fǎguó rén.'),
        m('Người 2 là người nước nào?', ['Mỹ', 'Đức', 'Nga'], 1, '我不是美国人，我是德国人。'),
        m('Người 3 là người nước nào?', ['Đài Loan', 'Thái Lan', 'Hàn Quốc'], 1, '泰国人 Tàiguó rén = người Thái Lan.'),
        m('Người 4 là người nước nào?', ['Nhật', 'Hàn', 'Trung Quốc'], 1, '我是韩国人，不是日本人。'),
        m('Người 5 ở thành phố nào?', ['Hà Nội', 'Bắc Kinh', 'TP. Hồ Chí Minh'], 2, '胡志明市人.'),
      ],
    },

    { t: 'h', text: 'Bài nghe 3 — Ở ký túc xá' },
    {
      t: 'listen',
      id: 'b3-nghe-3',
      title: 'Anna và Vương Minh nói chuyện',
      lines: [
        { who: '王明', voice: 'zh-nam', text: '{安娜|Ānnà}，{你|nǐ}{是|shì}{美国|Měiguó}{人|rén}{吗|ma}？', ro: 'Ānnà, nǐ shì Měiguó rén ma?', vi: 'Anna, bạn là người Mỹ à?' },
        { who: '安娜', voice: 'zh-nu', text: '{不|bú}{是|shì}，{我|wǒ}{是|shì}{俄罗斯|Éluósī}{人|rén}。{大伟|Dàwěi}{是|shì}{美国|Měiguó}{人|rén}。', ro: 'Bú shì, wǒ shì Éluósī rén. Dàwěi shì Měiguó rén.', vi: 'Không phải, mình là người Nga. Đại Vĩ mới là người Mỹ.' },
        { who: '王明', voice: 'zh-nam', text: '{兰兰|Lánlan}{呢|ne}？{她|tā}{也|yě}{是|shì}{俄罗斯|Éluósī}{人|rén}{吗|ma}？', ro: 'Lánlan ne? Tā yě shì Éluósī rén ma?', vi: 'Còn Lan Lan? Cô ấy cũng là người Nga à?' },
        { who: '安娜', voice: 'zh-nu', text: '{她|tā}{不|bú}{是|shì}{俄罗斯|Éluósī}{人|rén}，{她|tā}{是|shì}{越南|Yuènán}{人|rén}。{你|nǐ}{是|shì}{北京|Běijīng}{人|rén}{吗|ma}？', ro: 'Tā bú shì Éluósī rén, tā shì Yuènán rén. Nǐ shì Běijīng rén ma?', vi: 'Cô ấy không phải người Nga, cô ấy là người Việt Nam. Bạn là người Bắc Kinh à?' },
        { who: '王明', voice: 'zh-nam', text: '{对|duì}，{我|wǒ}{是|shì}{北京|Běijīng}{人|rén}。{李|Lǐ}{老师|lǎoshī}{不|bú}{是|shì}{北京|Běijīng}{人|rén}，{她|tā}{是|shì}{上海|Shànghǎi}{人|rén}。', ro: 'Duì, wǒ shì Běijīng rén. Lǐ lǎoshī bú shì Běijīng rén, tā shì Shànghǎi rén.', vi: 'Đúng, mình là người Bắc Kinh. Cô Lý không phải người Bắc Kinh, cô ấy là người Thượng Hải.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b3-nghe-q3',
      title: 'Câu hỏi bài nghe 3',
      items: [
        m('Anna là người nước nào?', ['美国人', '俄罗斯人', '越南人'], 1, '我是俄罗斯人。'),
        m('Ai là người Mỹ?', ['Anna', 'Đại Vĩ', 'Vương Minh'], 1, '大伟是美国人。'),
        m('Lan Lan có phải người Nga không?', ['Phải', 'Không — là người Việt Nam', 'Không nói'], 1, '她不是俄罗斯人，她是越南人。'),
        m('Vương Minh là người ở đâu?', ['北京', '上海', '河内'], 0, '我是北京人。'),
        m('Cô Lý là người ở đâu?', ['北京', '上海', 'Không nói'], 1, '李老师不是北京人，她是上海人。'),
      ],
    },

    { t: 'h', text: 'Bài nghe 4 — Làm quen ở câu lạc bộ' },
    {
      t: 'listen',
      id: 'b3-nghe-4',
      title: 'Đại Vĩ gặp một bạn mới',
      note: 'Nghe kỹ 也 và 呢 — mỗi lần có 也 là thông tin "giống người kia".',
      lines: [
        { who: '大伟', voice: 'zh-nam', text: '{你好|nǐ hǎo}！{我|wǒ}{叫|jiào}{大伟|Dàwěi}，{我|wǒ}{是|shì}{美国|Měiguó}{人|rén}。{你|nǐ}{呢|ne}？', ro: 'Nǐ hǎo! Wǒ jiào Dàwěi, wǒ shì Měiguó rén. Nǐ ne?', vi: 'Chào bạn! Mình tên là Đại Vĩ, mình là người Mỹ. Còn bạn?' },
        { who: '玛丽', voice: 'zh-nu', text: '{我|wǒ}{叫|jiào}{玛丽|Mǎlì}。{我|wǒ}{不|bú}{是|shì}{美国|Měiguó}{人|rén}，{我|wǒ}{是|shì}{英国|Yīngguó}{人|rén}。', ro: 'Wǒ jiào Mǎlì. Wǒ bú shì Měiguó rén, wǒ shì Yīngguó rén.', vi: 'Mình tên là Mary. Mình không phải người Mỹ, mình là người Anh.' },
        { who: '大伟', voice: 'zh-nam', text: '{你|nǐ}{是|shì}{留学生|liúxuéshēng}{吗|ma}？', ro: 'Nǐ shì liúxuéshēng ma?', vi: 'Bạn là du học sinh à?' },
        { who: '玛丽', voice: 'zh-nu', text: '{是|shì}，{我|wǒ}{是|shì}{留学生|liúxuéshēng}。{你|nǐ}{也|yě}{是|shì}{留学生|liúxuéshēng}{吗|ma}？', ro: 'Shì, wǒ shì liúxuéshēng. Nǐ yě shì liúxuéshēng ma?', vi: 'Ừ, mình là du học sinh. Bạn cũng là du học sinh à?' },
        { who: '大伟', voice: 'zh-nam', text: '{对|duì}，{我|wǒ}{也|yě}{是|shì}。{很|hěn}{高兴|gāoxìng}{认识|rènshi}{你|nǐ}！', ro: 'Duì, wǒ yě shì. Hěn gāoxìng rènshi nǐ!', vi: 'Đúng, mình cũng vậy. Rất vui được làm quen với bạn!' },
        { who: '玛丽', voice: 'zh-nu', text: '{我|wǒ}{也|yě}{很|hěn}{高兴|gāoxìng}！', ro: 'Wǒ yě hěn gāoxìng!', vi: 'Mình cũng rất vui!' },
      ],
    },
    {
      t: 'mcq',
      id: 'b3-nghe-q4',
      title: 'Câu hỏi bài nghe 4',
      items: [
        m('Mary là người nước nào?', ['Mỹ', 'Anh', 'Pháp'], 1, '我不是美国人，我是英国人。'),
        m('Đại Vĩ hỏi 你呢？ ở câu đầu là muốn biết:', ['Mary có khoẻ không', 'Mary tên gì và là người nước nào', 'Mary có bận không'], 1, 'Câu trước nói tên + quốc tịch → 你呢 hỏi lại cả hai.'),
        m('Ai là du học sinh?', ['Chỉ Mary', 'Chỉ Đại Vĩ', 'Cả hai'], 2, 'Mary: 我是留学生; Đại Vĩ: 我也是.'),
        m('我也是 trong câu của Đại Vĩ nghĩa là:', ['Tôi cũng là người Anh', 'Tôi cũng là du học sinh', 'Tôi cũng tên Mary'], 1, '也是 lặp lại thông tin vừa hỏi: 留学生.'),
      ],
    },

    { t: 'h', text: 'Bài nghe 5 — Cô Lý giới thiệu lớp' },
    {
      t: 'listen',
      id: 'b3-nghe-5',
      title: 'Lớp học quốc tế',
      note: 'Một người nói liền một đoạn. Ghi lại: ai — nước nào.',
      lines: [
        { who: '李老师', voice: 'zh-nu', text: '{大家好|dàjiā hǎo}！{我|wǒ}{姓|xìng}{李|Lǐ}，{我|wǒ}{是|shì}{你们|nǐmen}{的|de}{老师|lǎoshī}。{我|wǒ}{是|shì}{中国|Zhōngguó}{人|rén}。', ro: 'Dàjiā hǎo! Wǒ xìng Lǐ, wǒ shì nǐmen de lǎoshī. Wǒ shì Zhōngguó rén.', vi: 'Chào cả lớp! Cô họ Lý, cô là giáo viên của các em. Cô là người Trung Quốc.' },
        { who: '李老师', voice: 'zh-nu', text: '{兰兰|Lánlan}{是|shì}{越南|Yuènán}{人|rén}，{安娜|Ānnà}{是|shì}{俄罗斯|Éluósī}{人|rén}，{她们|tāmen}{是|shì}{外国人|wàiguórén}，{也|yě}{是|shì}{留学生|liúxuéshēng}。', ro: 'Lánlan shì Yuènán rén, Ānnà shì Éluósī rén, tāmen shì wàiguórén, yě shì liúxuéshēng.', vi: 'Lan Lan là người Việt Nam, Anna là người Nga, hai bạn ấy là người nước ngoài, cũng là du học sinh.' },
        { who: '李老师', voice: 'zh-nu', text: '{大伟|Dàwěi}{是|shì}{美国|Měiguó}{人|rén}。{玛丽|Mǎlì}{不|bú}{是|shì}{美国|Měiguó}{人|rén}，{她|tā}{是|shì}{英国|Yīngguó}{人|rén}。{山田|Shāntián}{是|shì}{日本|Rìběn}{人|rén}。', ro: 'Dàwěi shì Měiguó rén. Mǎlì bú shì Měiguó rén, tā shì Yīngguó rén. Shāntián shì Rìběn rén.', vi: 'Đại Vĩ là người Mỹ. Mary không phải người Mỹ, cô ấy là người Anh. Yamada là người Nhật.' },
        { who: '李老师', voice: 'zh-nu', text: '{王明|Wáng Míng}{也|yě}{是|shì}{中国|Zhōngguó}{人|rén}，{他|tā}{是|shì}{北京|Běijīng}{人|rén}。{欢迎|huānyíng}{大家|dàjiā}！', ro: 'Wáng Míng yě shì Zhōngguó rén, tā shì Běijīng rén. Huānyíng dàjiā!', vi: 'Vương Minh cũng là người Trung Quốc, cậu ấy là người Bắc Kinh. Chào mừng tất cả các em!' },
      ],
    },
    {
      t: 'mcq',
      id: 'b3-nghe-q5',
      title: 'Câu hỏi bài nghe 5',
      items: [
        m('Cô Lý là người nước nào?', ['越南人', '中国人', '日本人'], 1, '我是中国人。'),
        m('Mary là người nước nào?', ['美国人', '英国人', '法国人'], 1, '玛丽不是美国人，她是英国人。'),
        m('Ai là người Nhật?', ['大伟', '山田', '安娜'], 1, '山田是日本人。'),
        m('Trong câu 王明也是中国人, 也 so sánh Vương Minh với ai?', ['Với Đại Vĩ', 'Với cô Lý (cũng người Trung Quốc)', 'Với Yamada'], 1, 'Cô Lý đã nói 我是中国人 — Vương Minh "cũng" vậy.'),
        m('Theo cô Lý, Lan Lan và Anna là:', ['Giáo viên', 'Người nước ngoài và du học sinh', 'Người Trung Quốc'], 1, '她们是外国人，也是留学生。'),
      ],
    },
  ],
};

/* ══════════════════════════ 6. NÓI ══════════════════════════ */

const NOI: Lesson = {
  id: 'b3-noi',
  kind: 'speaking',
  title: 'Luyện nói Bài 3 — quốc tịch, quê, "cũng", "không phải", "còn bạn?"',
  goal: 'Nói trôi chảy và đúng thanh 12 câu then chốt của Bài 3; tự giới thiệu đủ tên – họ – quốc tịch – quê – nghề; hỏi lại bằng 呢 và đáp bằng 也 / 不是 với giám khảo và 📞 CuongMini.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Luyện nói thế nào',
      items: [
        '**Phát âm từng câu**: bấm nghe mẫu → ghi âm → máy chấm từng chữ. Chữ dưới 80 điểm: nghe lại, để ý thanh điệu.',
        'Âm khó của bài: **Yuènán** (yue = ü + ê, môi tròn), **Zhōngguó** (zh uốn lưỡi, -ong), **Éluósī**, **Rìběn** (r uốn lưỡi + "ư"), **bú shì** (不 đổi thanh), **wǒ yě hěn hǎo** (bốn thanh 3 liền).',
        'Câu ngắn trước, câu dài sau. Danh sách này cũng là bộ câu cho 📞 **CuongMini** (gọi gia sư) trong bài.',
        'Cuối bài: trả lời 5 câu hỏi của giám khảo bằng câu đầy đủ, có **也 / 不是 / 呢** khi phù hợp.',
      ],
    },
    {
      t: 'phatam',
      id: 'b3-noi-phat-am',
      title: '12 câu then chốt — ngắn đến dài',
      note: 'Pinyin ghi theo từ điển; 不 ghi theo cách đọc. Mỗi câu đọc 3 lần: chậm → bình thường → không nhìn pinyin. Khi gọi CuongMini, thay quê và nước của bạn vào.',
      items: [
        { text: '{你|nǐ}{呢|ne}？', ipa: 'Nǐ ne?', vi: 'Còn bạn? — 呢 nhẹ, ngắn' },
        { text: '{我|wǒ}{也|yě}{是|shì}。', ipa: 'Wǒ yě shì.', vi: 'Tôi cũng vậy. — đọc wó yě shì' },
        { text: '{中国|Zhōngguó}{人|rén}', ipa: 'Zhōngguó rén', vi: 'người Trung Quốc — 1 + 2 + 2' },
        { text: '{越南|Yuènán}{人|rén}', ipa: 'Yuènán rén', vi: 'người Việt Nam — yuè môi tròn' },
        { text: '{你|nǐ}{是|shì}{哪|nǎ}{国|guó}{人|rén}？', ipa: 'Nǐ shì nǎ guó rén?', vi: 'Bạn là người nước nào?' },
        { text: '{我|wǒ}{是|shì}{越南|Yuènán}{人|rén}。', ipa: 'Wǒ shì Yuènán rén.', vi: 'Tôi là người Việt Nam.' },
        { text: '{我|wǒ}{不|bú}{是|shì}{中国|Zhōngguó}{人|rén}。', ipa: 'Wǒ bú shì Zhōngguó rén.', vi: 'Tôi không phải người Trung Quốc. — bú shì' },
        { text: '{我|wǒ}{也|yě}{很|hěn}{高兴|gāoxìng}！', ipa: 'Wǒ yě hěn gāoxìng!', vi: 'Tôi cũng rất vui! — ba thanh 3 liền' },
        { text: '{她|tā}{是|shì}{俄罗斯|Éluósī}{人|rén}，{你|nǐ}{呢|ne}？', ipa: 'Tā shì Éluósī rén, nǐ ne?', vi: 'Cô ấy là người Nga, còn bạn?' },
        { text: '{我|wǒ}{也|yě}{不|bú}{是|shì}{日本|Rìběn}{人|rén}。', ipa: 'Wǒ yě bú shì Rìběn rén.', vi: 'Tôi cũng không phải người Nhật.' },
        { text: '{他|tā}{不|bú}{是|shì}{美国|Měiguó}{人|rén}，{是|shì}{英国|Yīngguó}{人|rén}。', ipa: 'Tā bú shì Měiguó rén, shì Yīngguó rén.', vi: 'Anh ấy không phải người Mỹ, mà là người Anh.' },
        { text: '{我|wǒ}{姓|xìng}{阮|Ruǎn}，{我|wǒ}{是|shì}{越南|Yuènán}{河内|Hénèi}{人|rén}，{我|wǒ}{也|yě}{是|shì}{留学生|liúxuéshēng}。', ipa: 'Wǒ xìng Ruǎn, wǒ shì Yuènán Hénèi rén, wǒ yě shì liúxuéshēng.', vi: 'Tôi họ Nguyễn, tôi là người Hà Nội, Việt Nam, tôi cũng là du học sinh.' },
      ],
    },

    { t: 'h', text: 'Mẫu tự giới thiệu — 5 câu (gộp Bài 1–3)' },
    {
      t: 'p',
      text: 'Thêm câu quốc tịch và quê vào "bộ khung" của Bài 2. Thay phần in đậm bằng thông tin của bạn. Luyện tới mức nói liền một hơi không cần nhìn.',
    },
    {
      t: 'examples',
      items: [
        { en: '{大家好|dàjiā hǎo}！', ro: 'Dàjiā hǎo!', vi: 'Chào mọi người!' },
        { en: '{我|wǒ}{姓|xìng}{陈|Chén}，{叫|jiào}{陈文明|Chén Wén Míng}。', ro: 'Wǒ xìng Chén, jiào Chén Wén Míng.', vi: 'Tôi họ **Trần**, tên là **Trần Văn Minh**.' },
        { en: '{我|wǒ}{是|shì}{越南|Yuènán}{人|rén}，{我|wǒ}{是|shì}{胡志明市|Húzhìmíng Shì}{人|rén}。', ro: 'Wǒ shì Yuènán rén, wǒ shì Húzhìmíng Shì rén.', vi: 'Tôi là người Việt Nam, người **TP. Hồ Chí Minh**.' },
        { en: '{我|wǒ}{是|shì}{学生|xuésheng}，{不|bú}{是|shì}{老师|lǎoshī}。', ro: 'Wǒ shì xuésheng, bú shì lǎoshī.', vi: 'Tôi là **sinh viên**, không phải giáo viên.' },
        { en: '{很|hěn}{高兴|gāoxìng}{认识|rènshi}{大家|dàjiā}！', ro: 'Hěn gāoxìng rènshi dàjiā!', vi: 'Rất vui được làm quen với mọi người!' },
      ],
    },

    { t: 'h', text: 'Hỏi — đáp mẫu với giám khảo' },
    {
      t: 'p',
      text: 'Phần "nghe – trả lời" của **HSKK sơ cấp** rất hay hỏi quốc tịch. Mẹo ghi điểm: khi giám khảo đoán sai, đừng chỉ nói 不是 — hãy **sửa luôn** bằng thông tin đúng; và khi được hỏi lại bằng 呢, trả lời bằng câu có **也** nếu giống.',
    },
    {
      t: 'dialogue',
      title: 'Giám khảo ↔ thí sinh',
      lines: [
        { who: 'Giám khảo', role: 'examiner', text: '{你好|nǐ hǎo}！{你|nǐ}{叫|jiào}{什么|shénme}{名字|míngzi}？', ro: 'Nǐ hǎo! Nǐ jiào shénme míngzi?', vi: 'Chào em! Em tên là gì?' },
        { who: 'Thí sinh', role: 'candidate', text: '{老师|lǎoshī}{好|hǎo}！{我|wǒ}{叫|jiào}{阮氏兰|Ruǎn Shì Lán}。', ro: 'Lǎoshī hǎo! Wǒ jiào Ruǎn Shì Lán.', vi: 'Em chào thầy ạ! Em tên là Nguyễn Thị Lan.' },
        { who: 'Giám khảo', role: 'examiner', text: '{你|nǐ}{是|shì}{中国|Zhōngguó}{人|rén}{吗|ma}？', ro: 'Nǐ shì Zhōngguó rén ma?', vi: 'Em là người Trung Quốc à?' },
        { who: 'Thí sinh', role: 'candidate', text: '{不|bú}{是|shì}，{我|wǒ}{不|bú}{是|shì}{中国|Zhōngguó}{人|rén}，{我|wǒ}{是|shì}{越南|Yuènán}{人|rén}。', ro: 'Bú shì, wǒ bú shì Zhōngguó rén, wǒ shì Yuènán rén.', vi: 'Không ạ, em không phải người Trung Quốc, em là người Việt Nam.' },
        { who: 'Giám khảo', role: 'examiner', text: '{你|nǐ}{是|shì}{越南|Yuènán}{哪儿|nǎr}{人|rén}？', ro: 'Nǐ shì Yuènán nǎr rén?', vi: 'Em là người vùng nào của Việt Nam? (哪儿 = đâu — Bài 10)' },
        { who: 'Thí sinh', role: 'candidate', text: '{我|wǒ}{是|shì}{河内|Hénèi}{人|rén}。{老师|lǎoshī}，{您|nín}{呢|ne}？', ro: 'Wǒ shì Hénèi rén. Lǎoshī, nín ne?', vi: 'Em là người Hà Nội ạ. Còn thầy ạ?' },
        { who: 'Giám khảo', role: 'examiner', text: '{我|wǒ}{是|shì}{北京|Běijīng}{人|rén}。{你|nǐ}{是|shì}{学生|xuésheng}{吗|ma}？', ro: 'Wǒ shì Běijīng rén. Nǐ shì xuésheng ma?', vi: 'Thầy là người Bắc Kinh. Em là sinh viên à?' },
        { who: 'Thí sinh', role: 'candidate', text: '{是|shì}，{我|wǒ}{是|shì}{学生|xuésheng}。{我|wǒ}{朋友|péngyou}{也|yě}{是|shì}{学生|xuésheng}。', ro: 'Shì, wǒ shì xuésheng. Wǒ péngyou yě shì xuésheng.', vi: 'Vâng, em là sinh viên. Bạn em cũng là sinh viên.' },
        { who: 'Giám khảo', role: 'examiner', text: '{好|hǎo}。{很|hěn}{高兴|gāoxìng}{认识|rènshi}{你|nǐ}！', ro: 'Hǎo. Hěn gāoxìng rènshi nǐ!', vi: 'Được rồi. Rất vui được biết em!' },
        { who: 'Thí sinh', role: 'candidate', text: '{我|wǒ}{也|yě}{很|hěn}{高兴|gāoxìng}{认识|rènshi}{您|nín}！{老师|lǎoshī}{再见|zàijiàn}！', ro: 'Wǒ yě hěn gāoxìng rènshi nín! Lǎoshī zàijiàn!', vi: 'Em cũng rất vui được biết thầy! Em chào thầy ạ!' },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo để không mất điểm',
      items: [
        'Bị đoán sai → **不是 + thông tin đúng**: 不是，我是越南人. Chỉ nói "不是" rồi im là phí điểm.',
        'Hỏi lại người đối diện bằng **您呢？ / 你呢？** — vừa lịch sự vừa cho giám khảo thấy bạn dùng được 呢.',
        'Đáp 很高兴认识你 bằng **我也很高兴** — câu chuẩn, đừng chỉ lặp lại y nguyên câu của giám khảo.',
        'Nghe câu có từ lạ (như **哪儿** nǎr — ở đâu, Bài 10): đoán theo ngữ cảnh, trả lời bằng thông tin hợp lý nhất (ở đây: thành phố).',
        'Đọc **越南** đúng: yuè (môi tròn như "uy-ê"), nán (thanh 2) — đừng đọc "Duê nam".',
      ],
    },

    { t: 'h', text: 'Đến lượt bạn' },
    {
      t: 'p',
      text: 'Năm câu hỏi dưới đây sẽ được đọc lên (bấm vào câu để nghe). Ghi âm câu trả lời **bằng thông tin thật của bạn**, nhớ dùng 也 / 不是 / 呢 khi hợp. Pinyin và nghĩa của câu hỏi:',
    },
    {
      t: 'examples',
      items: [
        { en: '{你|nǐ}{是|shì}{哪|nǎ}{国|guó}{人|rén}？', ro: 'Nǐ shì nǎ guó rén?', vi: 'Bạn là người nước nào? → 我是越南人。' },
        { en: '{你|nǐ}{是|shì}{日本|Rìběn}{人|rén}{吗|ma}？', ro: 'Nǐ shì Rìběn rén ma?', vi: 'Bạn là người Nhật à? → 不是，我是……' },
        { en: '{我|wǒ}{是|shì}{北京|Běijīng}{人|rén}，{你|nǐ}{呢|ne}？', ro: 'Wǒ shì Běijīng rén, nǐ ne?', vi: 'Tôi là người Bắc Kinh, còn bạn? → 我是河内人。' },
        { en: '{我|wǒ}{是|shì}{学生|xuésheng}，{你|nǐ}{也|yě}{是|shì}{学生|xuésheng}{吗|ma}？', ro: 'Wǒ shì xuésheng, nǐ yě shì xuésheng ma?', vi: 'Tôi là sinh viên, bạn cũng là sinh viên à? → 对，我也是学生。/ 不是，我是……' },
        { en: '{很|hěn}{高兴|gāoxìng}{认识|rènshi}{你|nǐ}！', ro: 'Hěn gāoxìng rènshi nǐ!', vi: 'Rất vui được làm quen với bạn! → 我也很高兴！' },
      ],
    },
    {
      t: 'speak',
      id: 'b3-noi-ghi-am',
      part: '1',
      questions: ['你是哪国人？', '你是日本人吗？', '我是北京人，你呢？', '我是学生，你也是学生吗？', '很高兴认识你！'],
    },
  ],
};

/* ══════════════════════════ 7. BÀI TẬP ══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b3-bai-tap',
  kind: 'homework',
  title: 'Bài tập Bài 3 — dịch, pinyin, trắc nghiệm, ghép câu, sửa câu, đọc hiểu',
  goal: 'Tự kiểm tra toàn bộ Bài 3: viết được câu quốc tịch, phủ định 不, câu có 也 và 呢 bằng chữ Hán; viết đúng pinyin tên nước và biến điệu 不; đọc hiểu một đoạn giới thiệu bạn bè.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Trước khi làm bài',
      items: [
        'Ô dịch Việt → Trung: gõ **chữ Hán** (bàn phím Pinyin: gõ "yuenan" chọn 越南, "ye" chọn 也). Dấu câu có hay không đều được chấm đúng.',
        'Ô pinyin: gõ **có dấu** (Yuènán) hoặc **dạng số** (Yue4nan2); tên riêng viết hoa hay thường đều được.',
        'Công thức cần nhớ: **tên nước + 人** · **不 + 是 / V / Adj** (trước thanh 4 đọc bú) · **S + 也 + (不 / 很) + V / Adj** · **…，N + 呢？**',
        'Đạt ≥ 80% → sang Bài 4. Dưới 70% → xem lại phần Ngữ pháp (nhất là ③ 也 và ④ 呢).',
      ],
    },
    { t: 'h', text: '1. Dịch sang tiếng Trung (viết chữ Hán)' },
    {
      t: 'quiz',
      id: 'b3-bt-dich',
      title: 'Dịch Việt → Trung',
      kind: 'translate',
      grammar: 'S + 是 + 哪国人 / 国名 + 人 · S + 不是 + N · S + 也 + V · S + 也不 + V · …，你呢？ · 不是A，是B',
      items: [
        { q: 'Bạn là người nước nào?', answers: ['你是哪国人？'], hint: '你 · 是 · 哪 · 国 · 人' },
        { q: 'Tôi là người Việt Nam.', answers: ['我是越南人。'], hint: '我 · 是 · 越南 · 人' },
        { q: 'Anh ấy không phải người Mỹ.', answers: ['他不是美国人。'], hint: '他 · 不是 · 美国人' },
        { q: 'Tôi cũng là sinh viên.', answers: ['我也是学生。'], hint: '我 · 也 · 是 · 学生' },
        { q: 'Tôi là người Hà Nội, còn bạn?', answers: ['我是河内人，你呢？'], hint: '河内人 · 你 · 呢' },
        { q: 'Cô ấy cũng không phải là người Nhật.', answers: ['她也不是日本人。'], hint: '她 · 也 · 不是 · 日本人' },
        { q: 'Tôi cũng rất vui!', answers: ['我也很高兴！'], hint: '我 · 也 · 很 · 高兴' },
        { q: 'Anna là người Nga.', answers: ['安娜是俄罗斯人。'], hint: '安娜 · 是 · 俄罗斯人' },
        { q: 'Cô ấy không phải người Anh, mà là người Pháp.', answers: ['她不是英国人，是法国人。', '她不是英国人，她是法国人。'], hint: '不是…，是…' },
        { q: 'Còn Vương Minh?', answers: ['王明呢？'], hint: '王明 · 呢' },
        { q: 'Tôi không quen anh ấy.', answers: ['我不认识他。'], hint: '我 · 不 · 认识 · 他' },
        { q: 'Bạn cũng là người Trung Quốc à?', answers: ['你也是中国人吗？'], hint: '你 · 也 · 是 · 中国人 · 吗' },
        { q: 'Chúng tôi là người nước ngoài.', answers: ['我们是外国人。'], hint: '我们 · 是 · 外国人' },
        { q: 'Anh ấy không tên là Đại Vĩ.', answers: ['他不叫大伟。'], hint: '他 · 不 · 叫 · 大伟' },
      ],
    },

    { t: 'h', text: '2. Viết pinyin' },
    {
      t: 'quiz',
      id: 'b3-bt-pinyin',
      title: 'Viết pinyin có dấu thanh (hoặc dạng số)',
      kind: 'fill',
      grammar: 'Tên riêng viết hoa · âm tiết trong một từ viết liền · 不 trước thanh 4 ghi bú',
      items: [
        { q: '越南 (Việt Nam)', answers: py('Yuènán', 'yuènán', 'Yue4nan2', 'yue4nan2', 'Yuè nán', 'yue4 nan2'), hint: '4 + 2' },
        { q: '中国 (Trung Quốc)', answers: py('Zhōngguó', 'zhōngguó', 'Zhong1guo2', 'zhong1guo2', 'Zhōng guó', 'zhong1 guo2'), hint: '1 + 2' },
        { q: '美国 (Mỹ)', answers: py('Měiguó', 'měiguó', 'Mei3guo2', 'mei3guo2', 'Měi guó', 'mei3 guo2'), hint: '3 + 2' },
        { q: '日本 (Nhật Bản)', answers: py('Rìběn', 'rìběn', 'Ri4ben3', 'ri4ben3', 'Rì běn', 'ri4 ben3'), hint: '4 + 3' },
        { q: '也 (cũng)', answers: py('yě', 'ye3'), hint: 'thanh 3' },
        { q: '呢 (trợ từ hỏi lại)', answers: py('ne', 'ne5'), hint: 'thanh nhẹ' },
        { q: '不是 (không phải)', answers: py('bú shì', 'bu2 shi4', 'búshì', 'bu2shi4'), hint: '不 trước thanh 4' },
        { q: '不忙 (không bận)', answers: py('bù máng', 'bu4 mang2', 'bùmáng', 'bu4mang2'), hint: '忙 thanh 2 — 不 giữ nguyên' },
        { q: '国家 (quốc gia)', answers: py('guójiā', 'guo2jia1', 'guó jiā', 'guo2 jia1'), hint: '2 + 1' },
      ],
    },

    { t: 'h', text: '3. Trắc nghiệm tổng hợp' },
    {
      t: 'mcq',
      id: 'b3-bt-trac-nghiem',
      title: 'Chọn câu đúng / phù hợp',
      items: [
        m('Ai đó nói 我是美国人，你呢？ Bạn là người Việt, bạn đáp:', ['我也是美国人。', '我是越南人。', '你呢？', '我不是。'], 1, '呢 hỏi quốc tịch → nói quốc tịch của mình.'),
        m('Bạn của bạn cũng là người Việt. Ai đó nói 我是越南人. Bạn nói về bạn mình:', ['他也是越南人。', '也他是越南人。', '他是越南人也。', '他是也越南人。'], 0, '也 sau chủ ngữ, trước 是.'),
        m('"Họ không phải người Trung Quốc":', ['他们没是中国人。', '他们不是中国人。', '他们是不中国人。', '不他们是中国人。'], 1, 'Phủ định 是 → 不是.'),
        m('Câu nào **đúng**?', ['你是哪国人吗？', '我是人中国。', '我也不是老师。', '我不也是老师。'], 2, '也 + 不 + 是.'),
        m('很高兴认识你！— Đáp tự nhiên nhất:', ['我也很高兴！', '没关系。', '不客气。', '我是越南人。'], 0, '"Tôi cũng rất vui!"'),
        m('"Người nước ngoài" là:', ['国外人', '外国人', '人外国', '外人国'], 1, '外国 (nước ngoài) + 人.'),
        m('Người Thái Lan là:', ['台国人', '泰国人', '太国人', '大国人'], 1, '泰国 Tàiguó = Thái Lan.'),
        m('Đọc đúng 我不叫大伟:', ['Wǒ bù jiào Dàwěi', 'Wǒ bú jiào Dàwěi', 'Wǒ bǔ jiào Dàwěi', 'Wǒ bū jiào Dàwěi'], 1, '叫 thanh 4 → bú.'),
        m('Trong 我也是，你呢？ có mấy "dấu hiệu" của Bài 3?', ['Một: 也', 'Hai: 也 và 呢', 'Ba: 也, 呢, 不', 'Không có'], 1, '也 (cũng) và 呢 (còn bạn?).'),
        m('A: 她是韩国人吗？ B: 不是，她（　）日本人。', ['也是', '是', '不是', '呢'], 1, 'Sửa thông tin: 不是，她是日本人。'),
        m('"Tôi là người Hà Nội, Việt Nam" theo trật tự tiếng Trung:', ['我是河内越南人。', '我是越南河内人。', '我是人越南河内。', '我是河内人越南。'], 1, 'Lớn trước, nhỏ sau: 越南河内人.'),
        m('哪 và 那 khác nhau thế nào?', ['Giống hệt', '哪 nǎ = nào (có 口, dùng để hỏi); 那 nà = kia', '哪 = kia; 那 = nào', 'Chỉ khác cách viết'], 1, '哪 có bộ 口 vì là từ để hỏi.'),
      ],
    },

    { t: 'h', text: '4. Ghép câu' },
    {
      t: 'build',
      id: 'b3-bt-ghep',
      title: 'Ghép thành câu đúng',
      items: [
        { vi: 'Cô ấy là người nước nào?', chips: ['{她|tā}', '{是|shì}', '{哪|nǎ}', '{国|guó}', '{人|rén}', '{呢|ne}'], answer: ['{她|tā}', '{是|shì}', '{哪|nǎ}', '{国|guó}', '{人|rén}'], ro: 'Tā shì nǎ guó rén?' },
        { vi: 'Đại Vĩ là người Mỹ.', chips: ['{大伟|Dàwěi}', '{是|shì}', '{美国|Měiguó}', '{人|rén}', '{英国|Yīngguó}'], answer: ['{大伟|Dàwěi}', '{是|shì}', '{美国|Měiguó}', '{人|rén}'], ro: 'Dàwěi shì Měiguó rén.' },
        { vi: 'Chúng tôi cũng là du học sinh.', chips: ['{我们|wǒmen}', '{也|yě}', '{是|shì}', '{留学生|liúxuéshēng}', '{不|bú}'], answer: ['{我们|wǒmen}', '{也|yě}', '{是|shì}', '{留学生|liúxuéshēng}'], ro: 'Wǒmen yě shì liúxuéshēng.' },
        { vi: 'Tôi cũng không bận.', chips: ['{我|wǒ}', '{也|yě}', '{不|bù}', '{忙|máng}', '{很|hěn}'], answer: ['{我|wǒ}', '{也|yě}', '{不|bù}', '{忙|máng}'], ro: 'Wǒ yě bù máng.' },
        { vi: 'Tôi là người Thượng Hải, còn bạn?', chips: ['{我|wǒ}', '{是|shì}', '{上海|Shànghǎi}', '{人|rén}', '{你|nǐ}', '{呢|ne}', '{吗|ma}'], answer: ['{我|wǒ}', '{是|shì}', '{上海|Shànghǎi}', '{人|rén}', '{你|nǐ}', '{呢|ne}'], ro: 'Wǒ shì Shànghǎi rén, nǐ ne?' },
        { vi: 'Anh ấy không họ Vương.', chips: ['{他|tā}', '{不|bú}', '{姓|xìng}', '{王|Wáng}', '{叫|jiào}'], answer: ['{他|tā}', '{不|bú}', '{姓|xìng}', '{王|Wáng}'], ro: 'Tā bú xìng Wáng.' },
        { vi: 'Mary cũng là người Anh à?', chips: ['{玛丽|Mǎlì}', '{也|yě}', '{是|shì}', '{英国|Yīngguó}', '{人|rén}', '{吗|ma}', '{呢|ne}'], answer: ['{玛丽|Mǎlì}', '{也|yě}', '{是|shì}', '{英国|Yīngguó}', '{人|rén}', '{吗|ma}'], ro: 'Mǎlì yě shì Yīngguó rén ma?' },
        { vi: 'Tôi không phải người Nga, mà là người Đức.', chips: ['{我|wǒ}', '{不|bú}', '{是|shì}', '{俄罗斯|Éluósī}', '{人|rén}', '{是|shì}', '{德国|Déguó}', '{人|rén}'], answer: ['{我|wǒ}', '{不|bú}', '{是|shì}', '{俄罗斯|Éluósī}', '{人|rén}', '{是|shì}', '{德国|Déguó}', '{人|rén}'], ro: 'Wǒ bú shì Éluósī rén, shì Déguó rén.' },
      ],
    },

    { t: 'h', text: '4b. Sửa câu sai' },
    {
      t: 'quiz',
      id: 'b3-bt-sua-cau',
      title: 'Mỗi câu có một lỗi — viết lại câu đúng (chữ Hán)',
      kind: 'translate',
      grammar: 'tên nước + 人 · 不 trước 是 · 也 sau chủ ngữ · 也 + 不 · 哪 / 呢 không đi với 吗',
      items: [
        { q: '~~我是人越南。~~ (Tôi là người Việt Nam.)', answers: ['我是越南人。'], hint: 'Tên nước đứng trước 人' },
        { q: '~~也我是学生。~~ (Tôi cũng là sinh viên.)', answers: ['我也是学生。'], hint: '也 sau chủ ngữ' },
        { q: '~~我是不中国人。~~ (Tôi không phải người Trung Quốc.)', answers: ['我不是中国人。'], hint: '不 đứng trước 是' },
        { q: '~~你是哪国人吗？~~ (Bạn là người nước nào?)', answers: ['你是哪国人？'], hint: 'Câu có 哪 bỏ 吗' },
        { q: '~~我不也是老师。~~ (Tôi cũng không phải giáo viên.)', answers: ['我也不是老师。'], hint: 'Thứ tự 也 → 不' },
        { q: '~~我是越南人，你呢吗？~~ (Tôi là người Việt Nam, còn bạn?)', answers: ['我是越南人，你呢？'], hint: '呢 không đi với 吗' },
        { q: '~~我是越南。~~ (Tôi là người Việt Nam.)', answers: ['我是越南人。'], hint: 'Thiếu 人' },
        { q: '~~我很也高兴。~~ (Tôi cũng rất vui.)', answers: ['我也很高兴。'], hint: '也 đứng trước 很' },
      ],
    },

    { t: 'h', text: '5. Đọc hiểu' },
    {
      t: 'passage',
      title: 'Bạn bè của Lan ở Bắc Kinh',
      intro: 'Lan viết về các bạn của mình, chỉ dùng từ của Bài 1–3. Đọc to một lượt (tắt pinyin nếu được), rồi trả lời câu hỏi.',
      paras: [
        { label: 'A', text: '{我|wǒ}{叫|jiào}{阮氏兰|Ruǎn Shì Lán}，{我|wǒ}{是|shì}{越南|Yuènán}{人|rén}，{我|wǒ}{是|shì}{河内|Hénèi}{人|rén}。{我|wǒ}{是|shì}{留学生|liúxuéshēng}。' },
        { label: 'B', text: '{安娜|Ānnà}{是|shì}{我|wǒ}{朋友|péngyou}。{她|tā}{不|bú}{是|shì}{美国|Měiguó}{人|rén}，{她|tā}{是|shì}{俄罗斯|Éluósī}{人|rén}。{她|tā}{也|yě}{是|shì}{留学生|liúxuéshēng}。' },
        { label: 'C', text: '{大伟|Dàwěi}{是|shì}{美国|Měiguó}{人|rén}。{玛丽|Mǎlì}{不|bú}{是|shì}{美国|Měiguó}{人|rén}，{是|shì}{英国|Yīngguó}{人|rén}。{大伟|Dàwěi}{很|hěn}{忙|máng}，{玛丽|Mǎlì}{也|yě}{很|hěn}{忙|máng}。' },
        { label: 'D', text: '{王明|Wáng Míng}{是|shì}{中国|Zhōngguó}{人|rén}，{他|tā}{是|shì}{北京|Běijīng}{人|rén}。{李|Lǐ}{老师|lǎoshī}{也|yě}{是|shì}{中国|Zhōngguó}{人|rén}，{她|tā}{不|bú}{是|shì}{北京|Běijīng}{人|rén}，{是|shì}{上海|Shànghǎi}{人|rén}。{我|wǒ}{很|hěn}{高兴|gāoxìng}{认识|rènshi}{他们|tāmen}！' },
      ],
    },
    {
      t: 'mcq',
      id: 'b3-bt-doc-hieu',
      title: 'Câu hỏi đọc hiểu',
      items: [
        m('Lan là người ở đâu?', ['Thượng Hải', 'Hà Nội', 'Bắc Kinh'], 1, 'Đoạn A: 我是河内人。'),
        m('Anna là người nước nào?', ['Mỹ', 'Nga', 'Anh'], 1, 'Đoạn B: 她不是美国人，她是俄罗斯人。'),
        m('Ai CŨNG là du học sinh như Lan?', ['Anna', 'Vương Minh', 'Cô Lý'], 0, 'Đoạn B: 她也是留学生。'),
        m('Mary là người nước nào?', ['Mỹ', 'Anh', 'Pháp'], 1, 'Đoạn C: 玛丽不是美国人，是英国人。'),
        m('Ai bận?', ['Chỉ Đại Vĩ', 'Chỉ Mary', 'Cả Đại Vĩ và Mary'], 2, 'Đoạn C: 大伟很忙，玛丽也很忙。'),
        m('Cô Lý là người ở đâu?', ['Bắc Kinh', 'Thượng Hải', 'Hà Nội'], 1, 'Đoạn D: 她不是北京人，是上海人。'),
      ],
    },
    {
      t: 'table',
      caption: 'Tự đánh giá Bài 3',
      head: ['Kết quả', 'Ý nghĩa', 'Làm gì tiếp'],
      rows: [
        ['≥ 80%', 'Nắm chắc Bài 3', 'Sang Bài 4 (我的家 — gia đình, 有/没有, 几, 的, lượng từ). Gọi 📞 CuongMini luyện màn tự giới thiệu 5 câu mỗi ngày.'],
        ['70–79%', 'Còn vài chỗ hổng', 'Làm lại phần sai; đọc lại bảng "不 đọc bù hay bú?" và bảng "呢 hỏi gì?".'],
        ['< 70%', 'Chưa vững', 'Học lại Ngữ pháp ② ③ ④ (不, 也, 呢) và bảng tên nước, rồi làm lại toàn bộ bài tập.'],
      ],
    },
  ],
};

export const BAI_3: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, HAN_TU, NGHE, NOI, BAI_TAP];
