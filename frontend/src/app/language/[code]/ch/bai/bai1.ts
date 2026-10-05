/**
 * Bài 1 — HSK 1 · 你好: chào hỏi, cảm ơn, xin lỗi, tạm biệt (khoá CH).
 *
 * Phạm vi: đại từ 我/你/您/他/她 + 们, câu chào "… + 好", câu tính từ S + 很 + Adj,
 * câu hỏi 吗 (sơ khởi), 不 + Adj để trả lời phủ định (sơ khởi — Bài 3 học kỹ 不).
 * Chưa dùng 是/叫 (Bài 2), 也/呢 (Bài 3). Từ ngoài HSK 1 ghi "(từ mở rộng)".
 *
 * Quy ước pinyin như Bài 0: thanh 3 + thanh 3 ghi theo từ điển (你好 nǐ hǎo, đọc ní hǎo);
 * 不 ghi theo cách đọc (不客气 bú kèqi, 不冷 bù lěng, 不热 bú rè).
 * Nhân vật: 兰兰 Lan (a, nữ) · 王明 Vương Minh (b, nam) · 李老师 cô Lý (c, nữ) ·
 * 大伟 Đại Vĩ (b, nam) · 安娜 Anna (c, nữ) · 老板 bà chủ quán (c, nữ).
 */
import type { Lesson } from '@/components/sach-hoc/types';

type McqItem = { q: string; options: string[]; correct: number; why: string };
const m = (q: string, options: string[], correct: number, why: string): McqItem => ({ q, options, correct, why });

/** Đáp án pinyin: mỗi dạng truyền vào (có dấu hoặc dạng số ni3 hao3) được nhận cả khi có lẫn không có dấu cách. */
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
  id: 'b1-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại: 你好 — Chào hỏi, cảm ơn, xin lỗi',
  goal: 'Chào bạn bè và thầy cô đúng mức lịch sự, hỏi thăm "khoẻ không?", cảm ơn, xin lỗi, tạm biệt — và đáp lại được tất cả những câu đó.',
  minutes: 35,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Bài 1 học gì',
      items: [
        'Chào: **你好** (bạn bè) · **您好** (lịch sự) · **你们好 / 大家好** (nhiều người) · **老师好** (chào thầy cô) · **早上好** (chào buổi sáng).',
        'Hỏi thăm: **你好吗？** — Bạn khoẻ không? → **我很好。** — Tôi rất khoẻ (tôi khoẻ).',
        'Câu tính từ: **S + 很 + tính từ** — 我很忙, 她很高兴. KHÔNG thêm 是.',
        'Câu hỏi có/không: thêm **吗** vào cuối câu kể — 你冷吗？',
        'Cảm ơn ↔ **不客气**; xin lỗi ↔ **没关系**; tạm biệt **再见 / 明天见**.',
        'Đại từ: **我 · 你 · 您 · 他 · 她** + **们** = số nhiều.',
      ],
    },
    { t: 'h', text: 'Học xong Bài 1 bạn làm được gì' },
    {
      t: 'table',
      head: ['Tình huống', 'Bạn làm được', 'Câu then chốt'],
      rows: [
        ['1. Buổi sáng ở ký túc xá', 'Chào bạn, hỏi thăm bạn và hỏi thăm người khác (anh ấy, cô ấy)', '早上好！你好吗？他很好。'],
        ['2. Trong lớp học', 'Chào thầy cô, trả lời câu hỏi thăm của thầy cô, cảm ơn thầy cô', '老师好！我很冷。谢谢老师！'],
        ['3. Ở căng tin', 'Xin lỗi và đáp lời xin lỗi, cảm ơn người bán, chào tạm biệt', '对不起！没关系。谢谢您！不客气。'],
      ],
    },
    {
      t: 'p',
      text: 'Cách học phần này: đọc **tình huống** (tiếng Việt) → bấm nghe cả đoạn → bấm từng câu, đọc to theo 3 lần → tắt pinyin (nút trên trang) và tự đọc lại. Nhớ biến điệu: chữ **ghi** nǐ hǎo nhưng **đọc** ní hǎo.',
    },
    {
      t: 'table',
      caption: 'Nhân vật của khoá (gặp lại trong mọi bài)',
      head: ['Nhân vật', 'Chữ Hán — pinyin', 'Là ai'],
      rows: [
        ['Lan', '兰兰 Lánlan', 'Sinh viên Việt Nam sang Bắc Kinh học tiếng Trung, ở ký túc xá — nhân vật chính'],
        ['Vương Minh', '王明 Wáng Míng', 'Bạn cùng lớp người Trung Quốc (họ 王 Vương, tên 明 Minh)'],
        ['Cô Lý', '李老师 Lǐ lǎoshī', 'Cô giáo dạy lớp của Lan (họ 李 Lý + 老师 giáo viên)'],
        ['Anna', '安娜 Ānnà', 'Bạn cùng lớp người Nga'],
        ['Đại Vĩ', '大伟 Dàwěi', 'Bạn cùng lớp người Mỹ'],
        ['Bà chủ quán', '老板 lǎobǎn', 'Chủ quán ăn gần trường'],
      ],
    },
    {
      t: 'note',
      title: 'Tên người Trung Quốc: HỌ trước, TÊN sau',
      items: [
        'Giống tiếng Việt: 王明 = họ **王** (Wáng — Vương) + tên **明** (Míng — Minh). Pinyin viết hoa cả họ lẫn tên và tách ra: **Wáng Míng**.',
        'Gọi thầy cô: **họ + 老师** — 李老师 (cô Lý). Không gọi tên riêng của thầy cô.',
        'Tên lặp như **兰兰 Lánlan** là cách gọi thân mật (chữ sau đọc nhẹ) — như ta gọi "Lan Lan" / "bé Lan".',
        '李老师 có hai thanh 3 liền: **Lǐ lǎoshī** đọc thực tế là **Lí lǎoshī** (biến điệu 3+3 đã học ở Bài 0).',
      ],
    },

    /* ── Tình huống 1 ── */
    { t: 'h', text: 'Tình huống 1 — Buổi sáng ở ký túc xá' },
    {
      t: 'p',
      text: '**Bối cảnh.** 7 giờ sáng, Lan ra khỏi phòng ký túc xá thì gặp Vương Minh ở cầu thang. Hai người chào nhau, hỏi thăm nhau, rồi Lan hỏi thăm hai bạn cùng lớp là Đại Vĩ (nam) và Anna (nữ).',
    },
    {
      t: 'dialogue',
      title: '早上好！— Chào buổi sáng!',
      lines: [
        { who: '兰兰 Lan', role: 'a', text: '{王明|Wáng Míng}，{早上|zǎoshang}{好|hǎo}！', ro: 'Wáng Míng, zǎoshang hǎo!', vi: 'Vương Minh, chào buổi sáng!' },
        { who: '王明 Vương Minh', role: 'b', text: '{兰兰|Lánlan}，{早上|zǎoshang}{好|hǎo}！{你|nǐ}{好|hǎo}{吗|ma}？', ro: 'Lánlan, zǎoshang hǎo! Nǐ hǎo ma?', vi: 'Lan, chào buổi sáng! Bạn khoẻ không?' },
        { who: '兰兰 Lan', role: 'a', text: '{我|wǒ}{很|hěn}{好|hǎo}，{谢谢|xièxie}！{你|nǐ}{好|hǎo}{吗|ma}？', ro: 'Wǒ hěn hǎo, xièxie! Nǐ hǎo ma?', vi: 'Mình khoẻ, cảm ơn bạn! Bạn khoẻ không?' },
        { who: '王明 Vương Minh', role: 'b', text: '{我|wǒ}{很|hěn}{好|hǎo}。', ro: 'Wǒ hěn hǎo.', vi: 'Mình khoẻ.' },
        { who: '兰兰 Lan', role: 'a', text: '{大伟|Dàwěi}{好|hǎo}{吗|ma}？', ro: 'Dàwěi hǎo ma?', vi: 'Đại Vĩ khoẻ không?' },
        { who: '王明 Vương Minh', role: 'b', text: '{他|tā}{很|hěn}{好|hǎo}。', ro: 'Tā hěn hǎo.', vi: 'Cậu ấy khoẻ.' },
        { who: '兰兰 Lan', role: 'a', text: '{安娜|Ānnà}{好|hǎo}{吗|ma}？', ro: 'Ānnà hǎo ma?', vi: 'Anna khoẻ không?' },
        { who: '王明 Vương Minh', role: 'b', text: '{她|tā}{很|hěn}{忙|máng}。', ro: 'Tā hěn máng.', vi: 'Cô ấy bận lắm.' },
        { who: '兰兰 Lan', role: 'a', text: '{好|hǎo}。{再见|zàijiàn}！', ro: 'Hǎo. Zàijiàn!', vi: 'Ừ. Tạm biệt nhé!' },
        { who: '王明 Vương Minh', role: 'b', text: '{再见|zàijiàn}！', ro: 'Zàijiàn!', vi: 'Tạm biệt!' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong tình huống 1',
      items: [
        '**早上好** zǎoshang hǎo = "buổi sáng + tốt" → chào buổi sáng. Chỉ dùng tới khoảng 9–10 giờ sáng. Nói tắt: **早！** zǎo!',
        '**你好吗？** là câu **hỏi thăm** người QUEN ("dạo này khoẻ không?"), không phải câu chào người lạ. Gặp người lạ chỉ nói **你好**.',
        '**我很好** — 很 hěn nghĩa gốc là "rất", nhưng ở đây gần như chỉ để câu tròn ý: "mình khoẻ". Học kỹ ở phần Ngữ pháp.',
        '**他** (anh ấy, cậu ấy) và **她** (chị ấy, cô ấy) đọc **giống hệt nhau**: tā. Chỉ khác khi viết: 他 có bộ 亻 (người), 她 có bộ 女 (nữ).',
        '**好。** đứng một mình ở cuối = "Ừ / Được / OK". Một chữ mà nhiều nghĩa!',
        '忙 máng (bận) là **từ mở rộng** — rất hay dùng khi hỏi thăm, nên học luôn ở bài này.',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{早上|zǎoshang}{好|hǎo}！', ro: 'Zǎoshang hǎo!', vi: 'Chào buổi sáng!' },
        { en: '{你|nǐ}{好|hǎo}{吗|ma}？', ro: 'Nǐ hǎo ma?', vi: 'Bạn khoẻ không? (đọc ní hǎo ma)' },
        { en: '{我|wǒ}{很|hěn}{好|hǎo}，{谢谢|xièxie}！', ro: 'Wǒ hěn hǎo, xièxie!', vi: 'Tôi khoẻ, cảm ơn!' },
        { en: '{他|tā}{很|hěn}{好|hǎo}。', ro: 'Tā hěn hǎo.', vi: 'Anh ấy khoẻ.' },
        { en: '{她|tā}{很|hěn}{忙|máng}。', ro: 'Tā hěn máng.', vi: 'Cô ấy rất bận.' },
      ],
    },

    /* ── Tình huống 2 ── */
    { t: 'h', text: 'Tình huống 2 — Trong lớp học' },
    {
      t: 'p',
      text: '**Bối cảnh.** Tháng 11, Bắc Kinh đã lạnh. Cô Lý bước vào lớp, chào cả lớp. Cô hỏi thăm các bạn có lạnh không — Đại Vĩ và Vương Minh mặc áo mỏng nên lạnh run, còn Lan sợ rét nên đã mặc sẵn chiếc áo phao thật dày.',
    },
    {
      t: 'dialogue',
      title: '老师好！— Em chào cô!',
      lines: [
        { who: '李老师 Cô Lý', role: 'c', text: '{同学们|tóngxuémen}{好|hǎo}！', ro: 'Tóngxuémen hǎo!', vi: 'Chào các em!' },
        { who: '同学们 Cả lớp', role: 'a', text: '{老师|lǎoshī}{好|hǎo}！', ro: 'Lǎoshī hǎo!', vi: 'Chúng em chào cô ạ!' },
        { who: '李老师 Cô Lý', role: 'c', text: '{你们|nǐmen}{冷|lěng}{吗|ma}？', ro: 'Nǐmen lěng ma?', vi: 'Các em có lạnh không?' },
        { who: '大伟 Đại Vĩ', role: 'b', text: '{我|wǒ}{很|hěn}{冷|lěng}！', ro: 'Wǒ hěn lěng!', vi: 'Em lạnh lắm ạ!' },
        { who: '李老师 Cô Lý', role: 'c', text: '{兰兰|Lánlan}，{你|nǐ}{冷|lěng}{吗|ma}？', ro: 'Lánlan, nǐ lěng ma?', vi: 'Lan, em có lạnh không?' },
        { who: '兰兰 Lan', role: 'a', text: '{我|wǒ}{不|bù}{冷|lěng}，{老师|lǎoshī}。', ro: 'Wǒ bù lěng, lǎoshī.', vi: 'Em không lạnh ạ.' },
        { who: '李老师 Cô Lý', role: 'c', text: '{王明|Wáng Míng}，{你|nǐ}{冷|lěng}{吗|ma}？', ro: 'Wáng Míng, nǐ lěng ma?', vi: 'Vương Minh, em có lạnh không?' },
        { who: '王明 Vương Minh', role: 'b', text: '{我|wǒ}{很|hěn}{冷|lěng}！{北京|Běijīng}{很|hěn}{冷|lěng}！', ro: 'Wǒ hěn lěng! Běijīng hěn lěng!', vi: 'Em lạnh lắm ạ! Bắc Kinh lạnh lắm!' },
        { who: '李老师 Cô Lý', role: 'c', text: '{好|hǎo}。{大家|dàjiā}{好|hǎo}！', ro: 'Hǎo. Dàjiā hǎo!', vi: 'Được rồi. Chào mọi người nhé!' },
        { who: '同学们 Cả lớp', role: 'a', text: '{谢谢|xièxie}{老师|lǎoshī}！', ro: 'Xièxie lǎoshī!', vi: 'Chúng em cảm ơn cô ạ!' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong tình huống 2',
      items: [
        '**同学们好** — 同学 tóngxué (bạn học) + 们 → "các em, các bạn học". Thầy cô Trung Quốc chào lớp như vậy; cả lớp đáp **老师好**.',
        '**你们冷吗？** — 你们 = "các bạn/các em". Câu hỏi 吗 đặt cuối câu, giống "…không?" của ta.',
        '**我不冷** — 不 bù = không. Đứng trước tính từ để phủ định: 不冷 (không lạnh). 冷 là thanh 3 nên 不 giữ **bù**. (Bài 3 học kỹ 不.)',
        'Người Bắc Kinh như Vương Minh cũng thấy lạnh: **北京很冷** — chủ ngữ không nhất thiết là người: nơi chốn + 很 + tính từ cũng được (北京 Běijīng = Bắc Kinh).',
        '**大家好** dàjiā hǎo — "chào mọi người". 大家 = mọi người (Hán Việt ĐẠI GIA, nhưng nghĩa KHÁC hẳn "đại gia" tiếng Việt!).',
        '**谢谢老师** — cảm ơn + người được cảm ơn: 谢谢你, 谢谢您, 谢谢老师.',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{同学们|tóngxuémen}{好|hǎo}！— {老师|lǎoshī}{好|hǎo}！', ro: 'Tóngxuémen hǎo! — Lǎoshī hǎo!', vi: 'Chào các em! — Em chào cô ạ!' },
        { en: '{你们|nǐmen}{冷|lěng}{吗|ma}？', ro: 'Nǐmen lěng ma?', vi: 'Các bạn có lạnh không?' },
        { en: '{我|wǒ}{很|hěn}{冷|lěng}。', ro: 'Wǒ hěn lěng.', vi: 'Tôi lạnh lắm.' },
        { en: '{我|wǒ}{不|bù}{冷|lěng}。', ro: 'Wǒ bù lěng.', vi: 'Tôi không lạnh.' },
        { en: '{大家|dàjiā}{好|hǎo}！', ro: 'Dàjiā hǎo!', vi: 'Chào mọi người!' },
        { en: '{谢谢|xièxie}{老师|lǎoshī}！', ro: 'Xièxie lǎoshī!', vi: 'Em cảm ơn thầy/cô!' },
      ],
    },

    /* ── Tình huống 3 ── */
    { t: 'h', text: 'Tình huống 3 — Ở căng tin' },
    {
      t: 'p',
      text: '**Bối cảnh.** Giờ trưa, căng tin đông người. Lan bưng khay cơm thì va vào Anna. Sau đó bà chủ quầy đưa thêm cho Lan một cái thìa. Ăn xong, Lan chào Anna về trước.',
    },
    {
      t: 'dialogue',
      title: '对不起！— Xin lỗi!',
      lines: [
        { who: '兰兰 Lan', role: 'a', text: '{对不起|duìbuqǐ}！{对不起|duìbuqǐ}！', ro: 'Duìbuqǐ! Duìbuqǐ!', vi: 'Xin lỗi! Xin lỗi nhé!' },
        { who: '安娜 Anna', role: 'c', text: '{没关系|méi guānxi}。{兰兰|Lánlan}，{你好|nǐ hǎo}！', ro: 'Méi guānxi. Lánlan, nǐ hǎo!', vi: 'Không sao đâu. Lan, chào bạn!' },
        { who: '兰兰 Lan', role: 'a', text: '{安娜|Ānnà}，{你好|nǐ hǎo}！{你|nǐ}{忙|máng}{吗|ma}？', ro: 'Ānnà, nǐ hǎo! Nǐ máng ma?', vi: 'Anna, chào bạn! Bạn có bận không?' },
        { who: '安娜 Anna', role: 'c', text: '{我|wǒ}{很|hěn}{忙|máng}。{我|wǒ}{很|hěn}{高兴|gāoxìng}！', ro: 'Wǒ hěn máng. Wǒ hěn gāoxìng!', vi: 'Mình bận lắm. Mình vui lắm!' },
        { who: '老板 Bà chủ quầy', role: 'c', text: '{同学|tóngxué}，{你好|nǐ hǎo}！', ro: 'Tóngxué, nǐ hǎo!', vi: 'Chào cháu! (đưa cho Lan một cái thìa)' },
        { who: '兰兰 Lan', role: 'a', text: '{谢谢|xièxie}{您|nín}！', ro: 'Xièxie nín!', vi: 'Cháu cảm ơn cô ạ!' },
        { who: '老板 Bà chủ quầy', role: 'c', text: '{不客气|bú kèqi}。', ro: 'Bú kèqi.', vi: 'Không có gì.' },
        { who: '兰兰 Lan', role: 'a', text: '{安娜|Ānnà}，{再见|zàijiàn}！{明天|míngtiān}{见|jiàn}！', ro: 'Ānnà, zàijiàn! Míngtiān jiàn!', vi: 'Anna, tạm biệt! Mai gặp nhé!' },
        { who: '安娜 Anna', role: 'c', text: '{明天|míngtiān}{见|jiàn}！', ro: 'Míngtiān jiàn!', vi: 'Mai gặp!' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong tình huống 3',
      items: [
        '**对不起** duìbuqǐ — xin lỗi (dùng khi mình làm phiền, làm sai). Nói hai lần cho thành khẩn cũng rất tự nhiên. Đáp lại: **没关系** méi guānxi — không sao.',
        'Bà chủ gọi Lan là **同学** (bạn học, "em sinh viên") — người Trung Quốc hay gọi sinh viên như vậy khi không biết tên.',
        '**谢谢您** — dùng 您 với người lớn tuổi hơn để tỏ lễ phép. Đáp: **不客气** bú kèqi.',
        '**明天见** míngtiān jiàn — "mai gặp". Cấu trúc: **thời gian + 见** (gặp). 再见 thì là "gặp lại".',
        '**我很高兴** — tôi rất vui. 高兴 gāoxìng = vui (Hán Việt CAO HỨNG).',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{对不起|duìbuqǐ}！— {没关系|méi guānxi}。', ro: 'Duìbuqǐ! — Méi guānxi.', vi: 'Xin lỗi! — Không sao.' },
        { en: '{谢谢|xièxie}{您|nín}！— {不客气|bú kèqi}。', ro: 'Xièxie nín! — Bú kèqi.', vi: 'Cảm ơn cô/chú ạ! — Không có gì.' },
        { en: '{我|wǒ}{很|hěn}{高兴|gāoxìng}。', ro: 'Wǒ hěn gāoxìng.', vi: 'Tôi rất vui.' },
        { en: '{明天|míngtiān}{见|jiàn}！', ro: 'Míngtiān jiàn!', vi: 'Mai gặp nhé!' },
        { en: '{再见|zàijiàn}！', ro: 'Zàijiàn!', vi: 'Tạm biệt!' },
      ],
    },
    /* ── Văn hoá ── */
    { t: 'h', text: 'Văn hoá chào hỏi của người Trung Quốc' },
    {
      t: 'p',
      text: 'Sách vở dạy 你好 đầu tiên, nhưng ngoài đời người Trung Quốc **ít khi nói 你好 với người quen** — giữa bạn bè, câu đó nghe hơi khách sáo. Họ hay chào bằng cách **gọi tên** ("王明！"), bằng một câu hỏi về việc đang làm, hoặc với người lớn tuổi thì gọi **chức danh + 好** (老师好, 阿姨好). Với người lạ, khách hàng, người mới gặp thì 你好 / 您好 luôn đúng. Bảng dưới là vài câu chào bạn sẽ nghe thấy ngoài đời — chỉ cần **nghe hiểu**, chưa cần dùng (đều là từ mở rộng).',
    },
    {
      t: 'table',
      caption: 'Câu chào ngoài đời (từ mở rộng — nghe hiểu là đủ)',
      head: ['Câu', 'Pinyin', 'Nghĩa', 'Dùng khi'],
      rows: [
        ['晚上好！', 'Wǎnshang hǎo!', 'Chào buổi tối', 'Trang trọng: MC, khách sạn, bản tin'],
        ['下午好！', 'Xiàwǔ hǎo!', 'Chào buổi chiều', 'Trang trọng, trong cuộc họp'],
        ['你吃了吗？', 'Nǐ chī le ma?', 'Ăn cơm chưa?', 'Người lớn tuổi chào nhau quanh giờ ăn — chỉ là lời chào, không phải mời ăn'],
        ['好久不见！', 'Hǎojiǔ bú jiàn!', 'Lâu quá không gặp!', 'Gặp lại bạn cũ'],
        ['拜拜！', 'Báibái! / Bàibai!', 'Bye bye!', 'Bạn bè, thân mật (mượn từ tiếng Anh)'],
        ['不好意思。', 'Bù hǎoyìsi.', 'Ngại quá / xin lỗi nhé', 'Làm phiền nhẹ: nhờ đường, chen qua'],
        ['不用谢。', 'Bú yòng xiè.', 'Không cần cảm ơn', 'Đáp lời cảm ơn — giống 不客气'],
      ],
    },
    {
      t: 'note',
      title: 'Ghi nhớ — phép lịch sự kiểu Trung Quốc',
      items: [
        '**Bắt tay** nhẹ khi gặp lần đầu trong môi trường trang trọng; giữa bạn bè trẻ thì chỉ cần gật đầu, mỉm cười. Không ôm hôn khi chào.',
        'Khi được khen, người Trung Quốc thường **chối khéo** ("哪里哪里" nǎli nǎli — đâu có đâu) thay vì nói 谢谢 — sẽ học ở bài sau. Bạn nói 谢谢 cũng không sai.',
        'Giữa người thân, bạn rất thân, **谢谢 nói quá nhiều** có thể nghe xa cách. Với người lạ, nhân viên, thầy cô thì cứ cảm ơn thoải mái.',
        '你好吗 trong sách rất phổ biến, nhưng ngoài đời người ta hay hỏi thăm cụ thể hơn: "最近怎么样？" (dạo này thế nào?) — sẽ học ở Bài 18 (怎么样).',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{你|nǐ}{吃|chī}{了|le}{吗|ma}？', ro: 'Nǐ chī le ma?', vi: 'Ăn cơm chưa? (một kiểu chào — từ mở rộng)' },
        { en: '{好久不见|hǎojiǔ bú jiàn}！', ro: 'Hǎojiǔ bú jiàn!', vi: 'Lâu quá không gặp! (từ mở rộng)' },
        { en: '{不好意思|bù hǎoyìsi}。', ro: 'Bù hǎoyìsi.', vi: 'Ngại quá / xin lỗi nhé. (từ mở rộng)' },
        { en: '{不用谢|bú yòng xiè}。', ro: 'Bú yòng xiè.', vi: 'Không cần cảm ơn đâu. (từ mở rộng)' },
      ],
    },
  ],
};

/* ══════════════════════════ 2. TỪ VỰNG ══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b1-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng Bài 1 — 32 từ: đại từ, chào hỏi, cảm ơn, xin lỗi, hỏi thăm',
  goal: 'Nghe, đọc đúng thanh và dùng được 32 từ của Bài 1 trong câu chào hỏi, cảm ơn, xin lỗi, hỏi thăm.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Ghi nhớ trước khi học',
      items: [
        '**Đại từ không đổi theo vai vế**: 我 là "tôi/mình/em/con/cháu", 你 là "bạn/anh/chị/em…". Muốn lịch sự thì đổi 你 → **您**.',
        '**们** (men, thanh nhẹ) gắn sau đại từ chỉ người = số nhiều: 我们, 你们, 他们, 她们.',
        '**Âm Hán Việt** (IN HOA trong dòng "more") giúp nhớ nghĩa — nhưng có từ đã **lệch nghĩa**: 大家 ĐẠI GIA = mọi người; 认识 NHẬN THỨC = quen biết; 老师 LÃO SƯ = giáo viên (không phải "thầy già").',
        'Mỗi từ: 🔊 nghe → đọc to 3 lần → đọc câu ví dụ → bấm **Che nghĩa** để tự kiểm tra.',
      ],
    },

    { t: 'h', text: 'Nhóm 1 — Đại từ nhân xưng (9 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{我|wǒ}', pos: 'đại từ', ipa: 'wǒ', vi: 'tôi, mình, tớ, em, con, cháu (ngôi thứ nhất)', ex: '{我|wǒ}{很|hěn}{好|hǎo}。', exRo: 'Wǒ hěn hǎo.', exVi: 'Tôi khoẻ.', more: 'Hán Việt: **NGÃ** (như "bản ngã"). Một chữ cho mọi cách xưng "tôi" — không đổi theo người nghe là ai.' },
        { w: '{你|nǐ}', pos: 'đại từ', ipa: 'nǐ', vi: 'bạn, anh, chị, em, cậu… (ngôi thứ hai)', ex: '{你|nǐ}{好|hǎo}{吗|ma}？', exRo: 'Nǐ hǎo ma?', exVi: 'Bạn khoẻ không?', more: 'Hán Việt: **NỄ**. Dùng với bạn bè, người ngang hàng hoặc nhỏ tuổi hơn. 你好 đọc **ní** hǎo.' },
        { w: '{您|nín}', pos: 'đại từ', ipa: 'nín', vi: 'ngài, ông, bà, thầy, cô… (ngôi thứ hai — kính trọng)', ex: '{老师|lǎoshī}，{您|nín}{好|hǎo}！', exRo: 'Lǎoshī, nín hǎo!', exVi: 'Em chào thầy/cô ạ!', more: 'Chữ = **你** + **心** (tim) → "đặt người ấy trong lòng" = kính trọng. Số nhiều KHÔNG nói 您们 trong giao tiếp thường — dùng 你们 hoặc 大家.' },
        { w: '{他|tā}', pos: 'đại từ', ipa: 'tā', vi: 'anh ấy, ông ấy, cậu ấy (ngôi thứ ba — nam)', ex: '{他|tā}{很|hěn}{忙|máng}。', exRo: 'Tā hěn máng.', exVi: 'Anh ấy rất bận.', more: 'Hán Việt: **THA**. Bộ 亻 (người). Đọc giống hệt 她 — nghe chỉ biết là "người ấy".' },
        { w: '{她|tā}', pos: 'đại từ', ipa: 'tā', vi: 'chị ấy, cô ấy, bà ấy (ngôi thứ ba — nữ)', ex: '{她|tā}{很|hěn}{高兴|gāoxìng}。', exRo: 'Tā hěn gāoxìng.', exVi: 'Cô ấy rất vui.', more: 'Hán Việt: **THA**. Bộ 女 (nữ) + 也. Chữ này mới được dùng rộng rãi từ khoảng năm 1920 để phân biệt nam/nữ khi viết.' },
        { w: '{我们|wǒmen}', pos: 'đại từ', ipa: 'wǒmen', vi: 'chúng tôi, chúng ta, chúng mình', ex: '{我们|wǒmen}{很|hěn}{好|hǎo}。', exRo: 'Wǒmen hěn hǎo.', exVi: 'Chúng tôi khoẻ.', more: 'Hán Việt: NGÃ MÔN. 们 đọc thanh nhẹ. 我们 gồm cả người nghe hoặc không — tuỳ ngữ cảnh.' },
        { w: '{你们|nǐmen}', pos: 'đại từ', ipa: 'nǐmen', vi: 'các bạn, các anh chị, các em', ex: '{你们|nǐmen}{好|hǎo}！', exRo: 'Nǐmen hǎo!', exVi: 'Chào các bạn!', more: '你 + 们. Thanh 3 + thanh nhẹ: KHÔNG biến điệu, đọc nǐmen.' },
        { w: '{他们|tāmen}', pos: 'đại từ', ipa: 'tāmen', vi: 'họ, các anh ấy (nhóm toàn nam, hoặc có cả nam lẫn nữ)', ex: '{他们|tāmen}{很|hěn}{忙|máng}。', exRo: 'Tāmen hěn máng.', exVi: 'Họ rất bận.', more: 'Nhóm có **ít nhất một nam** thì dùng 他们 — kể cả 9 nữ + 1 nam.' },
        { w: '{她们|tāmen}', pos: 'đại từ', ipa: 'tāmen', vi: 'họ, các chị ấy, các cô ấy (nhóm toàn nữ)', ex: '{她们|tāmen}{很|hěn}{高兴|gāoxìng}。', exRo: 'Tāmen hěn gāoxìng.', exVi: 'Các cô ấy rất vui.', more: 'Chỉ dùng khi **tất cả** đều là nữ. Đọc giống 他们.' },
      ],
    },

    { t: 'h', text: 'Nhóm 2 — Chào hỏi, gặp gỡ (9 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{好|hǎo}', pos: 'tính từ', ipa: 'hǎo', vi: 'tốt, hay, khoẻ; (đứng một mình) được, ừ, OK', ex: '{我|wǒ}{很|hěn}{好|hǎo}。', exRo: 'Wǒ hěn hǎo.', exVi: 'Tôi khoẻ.', more: 'Hán Việt: **HẢO** (hảo hạng, hữu hảo). Chữ = 女 (người mẹ) + 子 (đứa con) → điều tốt đẹp.' },
        { w: '{你好|nǐ hǎo}', pos: 'câu chào', ipa: 'nǐ hǎo', vi: 'xin chào, chào bạn', ex: '{你好|nǐ hǎo}！{我|wǒ}{很|hěn}{高兴|gāoxìng}。', exRo: 'Nǐ hǎo! Wǒ hěn gāoxìng.', exVi: 'Chào bạn! Mình rất vui.', more: 'Viết **nǐ hǎo**, đọc **ní hǎo** (biến điệu 3+3). Dùng được với mọi người, mọi lúc trong ngày.' },
        { w: '{早上|zǎoshang}', pos: 'danh từ', ipa: 'zǎoshang', vi: 'buổi sáng (sáng sớm)', ex: '{早上|zǎoshang}{好|hǎo}！', exRo: 'Zǎoshang hǎo!', exVi: 'Chào buổi sáng!', more: 'Hán Việt: TẢO THƯỢNG (早 tảo = sớm). 上 đọc nhẹ. Nói tắt "早！" khi chào buổi sáng.' },
        { w: '{老师|lǎoshī}', pos: 'danh từ', ipa: 'lǎoshī', vi: 'thầy giáo, cô giáo, giáo viên', ex: '{李|Lǐ}{老师|lǎoshī}{好|hǎo}！', exRo: 'Lǐ lǎoshī hǎo!', exVi: 'Em chào cô Lý ạ!', more: 'Hán Việt: **LÃO SƯ** — nhưng 老 ở đây không có nghĩa "già": thầy cô 25 tuổi vẫn là 老师. Gọi: **họ + 老师**. 李老师 đọc Lí lǎoshī.' },
        { w: '{同学|tóngxué}', pos: 'danh từ', ipa: 'tóngxué', vi: 'bạn học, bạn cùng lớp; (gọi) em/bạn sinh viên', ex: '{同学们|tóngxuémen}{好|hǎo}！', exRo: 'Tóngxuémen hǎo!', exVi: 'Chào các em!', more: 'Hán Việt: **ĐỒNG HỌC** (cùng học). Người bán hàng quanh trường hay gọi sinh viên là "同学".' },
        { w: '{大家|dàjiā}', pos: 'đại từ', ipa: 'dàjiā', vi: 'mọi người, tất cả mọi người', ex: '{大家|dàjiā}{好|hǎo}！', exRo: 'Dàjiā hǎo!', exVi: 'Chào mọi người!', more: 'Hán Việt: ĐẠI GIA — **lệch nghĩa**: tiếng Trung là "mọi người", không phải "người giàu có".' },
        { w: '{再见|zàijiàn}', pos: 'động từ', ipa: 'zàijiàn', vi: 'tạm biệt, hẹn gặp lại', ex: '{老师|lǎoshī}，{再见|zàijiàn}！', exRo: 'Lǎoshī, zàijiàn!', exVi: 'Em chào cô ạ! (khi ra về)', more: 'Hán Việt: **TÁI KIẾN** = gặp lại (再 lần nữa + 见 gặp). Hai thanh 4.' },
        { w: '{明天|míngtiān}', pos: 'danh từ', ipa: 'míngtiān', vi: 'ngày mai', ex: '{明天|míngtiān}{见|jiàn}！', exRo: 'Míngtiān jiàn!', exVi: 'Mai gặp nhé!', more: 'Hán Việt: MINH THIÊN (minh = sáng, thiên = ngày). Bài 6 học thêm 今天, 昨天.' },
        { w: '{见|jiàn}', pos: 'động từ', ipa: 'jiàn', vi: 'gặp, thấy', ex: '{老师|lǎoshī}，{明天|míngtiān}{见|jiàn}！', exRo: 'Lǎoshī, míngtiān jiàn!', exVi: 'Thưa cô, mai gặp lại cô ạ!', more: 'Hán Việt: **KIẾN** (kiến thức, ý kiến). Mẫu hẹn: **thời gian + 见** — 明天见.' },
      ],
    },

    { t: 'h', text: 'Nhóm 3 — Cảm ơn, xin lỗi (5 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{谢谢|xièxie}', pos: 'động từ', ipa: 'xièxie', vi: 'cảm ơn', ex: '{谢谢|xièxie}{你|nǐ}！', exRo: 'Xièxie nǐ!', exVi: 'Cảm ơn bạn!', more: 'Hán Việt: **TẠ** (cảm tạ). Chữ sau đọc nhẹ. Thêm người: 谢谢你, 谢谢您, 谢谢老师, 谢谢大家.' },
        { w: '{不客气|bú kèqi}', pos: 'cụm từ', ipa: 'bú kèqi', vi: 'không có gì; đừng khách sáo (đáp lời cảm ơn)', ex: '{谢谢|xièxie}！— {不客气|bú kèqi}。', exRo: 'Xièxie! — Bú kèqi.', exVi: 'Cảm ơn! — Không có gì.', more: 'Hán Việt: BẤT KHÁCH KHÍ ("đừng khách khí"). 不 → **bú** vì 客 thanh 4; 气 đọc nhẹ.' },
        { w: '{对不起|duìbuqǐ}', pos: 'động từ', ipa: 'duìbuqǐ', vi: 'xin lỗi', ex: '{对不起|duìbuqǐ}，{老师|lǎoshī}！', exRo: 'Duìbuqǐ, lǎoshī!', exVi: 'Em xin lỗi cô ạ!', more: 'Hán Việt: ĐỐI BẤT KHỞI (≈ "không xứng với người"). 不 ở giữa đọc nhẹ. Đáp: 没关系.' },
        { w: '{没关系|méi guānxi}', pos: 'cụm từ', ipa: 'méi guānxi', vi: 'không sao, không có gì (đáp lời xin lỗi)', ex: '{对不起|duìbuqǐ}！— {没关系|méi guānxi}。', exRo: 'Duìbuqǐ! — Méi guānxi.', exVi: 'Xin lỗi! — Không sao.', more: 'Hán Việt: MỘT QUAN HỆ (没 = không có, 关系 = liên quan) → "chẳng hề gì". 系 đọc nhẹ.' },
        { w: '{不|bù}', pos: 'phó từ', ipa: 'bù', vi: 'không (phủ định)', ex: '{我|wǒ}{不|bù}{冷|lěng}。', exRo: 'Wǒ bù lěng.', exVi: 'Tôi không lạnh.', more: 'Hán Việt: **BẤT** (bất ổn, bất lực). Trước thanh 4 đọc **bú**: 不热 bú rè. Bài 3 học kỹ.' },
      ],
    },

    { t: 'h', text: 'Nhóm 4 — Hỏi thăm (6 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{很|hěn}', pos: 'phó từ', ipa: 'hěn', vi: 'rất, lắm', ex: '{她|tā}{很|hěn}{好|hǎo}。', exRo: 'Tā hěn hǎo.', exVi: 'Cô ấy khoẻ.', more: 'Hán Việt: NGẬN. Trong câu "S + 很 + tính từ", 很 thường chỉ để câu tròn ý, nghĩa "rất" rất nhẹ. 很好 đọc hén hǎo.' },
        { w: '{吗|ma}', pos: 'trợ từ', ipa: 'ma', vi: '(cuối câu) …không? — biến câu kể thành câu hỏi có/không', ex: '{你|nǐ}{冷|lěng}{吗|ma}？', exRo: 'Nǐ lěng ma?', exVi: 'Bạn có lạnh không?', more: 'Hán Việt: MA. Thanh nhẹ. Chữ = 口 (miệng) + 马 (gợi âm ma).' },
        { w: '{高兴|gāoxìng}', pos: 'tính từ', ipa: 'gāoxìng', vi: 'vui, vui mừng', ex: '{我|wǒ}{很|hěn}{高兴|gāoxìng}。', exRo: 'Wǒ hěn gāoxìng.', exVi: 'Tôi rất vui.', more: 'Hán Việt: **CAO HỨNG** (hứng khởi). Cụm hay gặp: 很高兴认识你 — rất vui được làm quen.' },
        { w: '{冷|lěng}', pos: 'tính từ', ipa: 'lěng', vi: 'lạnh', ex: '{北京|Běijīng}{很|hěn}{冷|lěng}。', exRo: 'Běijīng hěn lěng.', exVi: 'Bắc Kinh rất lạnh.', more: 'Hán Việt: LÃNH (lãnh đạm, lạnh lẽo). Bộ 冫 (hai chấm thuỷ — băng).' },
        { w: '{热|rè}', pos: 'tính từ', ipa: 'rè', vi: 'nóng', ex: '{我|wǒ}{不|bú}{热|rè}。', exRo: 'Wǒ bú rè.', exVi: 'Tôi không nóng.', more: 'Hán Việt: **NHIỆT** (nhiệt độ). 不热 đọc **bú** rè (热 là thanh 4). r uốn lưỡi.' },
        { w: '{忙|máng}', pos: 'tính từ', ipa: 'máng', vi: 'bận (từ mở rộng)', ex: '{你|nǐ}{忙|máng}{吗|ma}？', exRo: 'Nǐ máng ma?', exVi: 'Bạn có bận không?', more: 'Hán Việt: MANG (bộ 忄 tâm đứng + 亡). Từ mở rộng — rất hay dùng khi hỏi thăm.' },
      ],
    },

    { t: 'h', text: 'Nhóm 5 — Cụm làm quen và tên riêng (3 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{认识|rènshi}', pos: 'động từ', ipa: 'rènshi', vi: 'quen biết, làm quen', ex: '{很|hěn}{高兴|gāoxìng}{认识|rènshi}{你|nǐ}！', exRo: 'Hěn gāoxìng rènshi nǐ!', exVi: 'Rất vui được làm quen với bạn!', more: 'Hán Việt: NHẬN THỨC — **lệch nghĩa**: tiếng Trung = "quen biết". Học cả cụm 很高兴认识你 như một câu cố định.' },
        { w: '{北京|Běijīng}', pos: 'danh từ riêng', ipa: 'Běijīng', vi: 'Bắc Kinh (thủ đô Trung Quốc)', ex: '{北京|Běijīng}{很|hěn}{冷|lěng}。', exRo: 'Běijīng hěn lěng.', exVi: 'Bắc Kinh rất lạnh.', more: 'Hán Việt: **BẮC KINH** (kinh đô phía bắc). Viết hoa B. 北 đọc nửa thanh 3, 京 cao.' },
        { w: '{老板|lǎobǎn}', pos: 'danh từ', ipa: 'lǎobǎn', vi: 'ông chủ, bà chủ (quán, cửa hàng) (từ mở rộng)', ex: '{老板|lǎobǎn}，{谢谢|xièxie}{您|nín}！', exRo: 'Lǎobǎn, xièxie nín!', exVi: 'Cảm ơn cô chủ ạ!', more: 'Hán Việt: LÃO BẢN. Ở Trung Quốc gọi người bán hàng là 老板 rất tự nhiên. Ba thanh 3 khi nói 老板好: láobán hǎo.' },
      ],
    },
    {
      t: 'table',
      caption: 'Tóm tắt: hỏi gì — đáp gì',
      head: ['Người kia nói', 'Bạn đáp', 'Nghĩa'],
      rows: [
        ['你好！', '你好！', 'Chào bạn! — Chào bạn!'],
        ['你好吗？', '我很好，谢谢！', 'Bạn khoẻ không? — Mình khoẻ, cảm ơn!'],
        ['谢谢！', '不客气。', 'Cảm ơn! — Không có gì.'],
        ['对不起！', '没关系。', 'Xin lỗi! — Không sao.'],
        ['再见！', '再见！/ 明天见！', 'Tạm biệt! — Tạm biệt! / Mai gặp!'],
        ['很高兴认识你！', '我也很高兴。(Bài 3) / 你好！', 'Rất vui được làm quen!'],
      ],
    },
    {
      t: 'mcq',
      id: 'b1-tv-nghia',
      title: 'Kiểm tra nghĩa từ',
      items: [
        m('{您|nín} nghĩa là gì?', ['tôi', 'bạn (thân mật)', 'ngài, ông, bà (kính trọng)', 'họ'], 2, '您 là dạng kính trọng của 你.'),
        m('{她们|tāmen} dùng cho nhóm nào?', ['Toàn nam', 'Toàn nữ', 'Có cả nam và nữ', 'Chỉ trẻ em'], 1, '她们 chỉ dùng khi tất cả đều là nữ; có nam thì dùng 他们.'),
        m('{大家|dàjiā} nghĩa là:', ['người giàu', 'mọi người', 'nhà to', 'thầy giáo'], 1, '大家 = mọi người. Âm Hán Việt ĐẠI GIA nhưng nghĩa khác tiếng Việt.'),
        m('Đáp lại {谢谢|xièxie} bằng câu nào?', ['{没关系|méi guānxi}', '{不客气|bú kèqi}', '{对不起|duìbuqǐ}', '{再见|zàijiàn}'], 1, 'Cảm ơn → 不客气; xin lỗi → 没关系.'),
        m('{冷|lěng} nghĩa là:', ['nóng', 'bận', 'lạnh', 'vui'], 2, '冷 = lạnh (LÃNH). Nóng là 热.'),
        m('{高兴|gāoxìng} nghĩa là:', ['cao', 'vui', 'buồn', 'khoẻ'], 1, '高兴 = vui (CAO HỨNG).'),
        m('{明天见|míngtiān jiàn} nghĩa là:', ['Hôm nay vui', 'Mai gặp nhé', 'Sáng nay gặp', 'Không gặp nữa'], 1, '明天 ngày mai + 见 gặp.'),
        m('Trợ từ {吗|ma} đặt ở đâu và làm gì?', ['Đầu câu, để chào', 'Cuối câu, tạo câu hỏi có/không', 'Giữa câu, nghĩa "rất"', 'Sau tên người, nghĩa "của"'], 1, '吗 đặt cuối câu kể để thành câu hỏi có/không.'),
        m('{同学|tóngxué} nghĩa là:', ['thầy giáo', 'bạn học', 'trường học', 'đồng hồ'], 1, '同学 = bạn học (ĐỒNG HỌC).'),
        m('{认识|rènshi} trong 很高兴认识你 nghĩa là:', ['nhận thức', 'quen biết', 'nhìn thấy', 'học'], 1, '认识 = quen biết — lệch nghĩa so với "nhận thức" tiếng Việt.'),
      ],
    },
  ],
};

/* ══════════════════════════ 3. NGỮ PHÁP ══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b1-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp Bài 1 — đại từ & 们, "… + 好", S + 很 + tính từ, câu hỏi 吗, 不 + tính từ',
  goal: 'Ghép được câu chào cho mọi đối tượng, nói "ai đó thế nào" bằng 很 + tính từ, hỏi có/không bằng 吗 và trả lời cả khẳng định lẫn phủ định.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Năm điểm ngữ pháp',
      items: [
        '**① Đại từ + 们**: 我 你 您 他 她 → 我们 你们 他们 她们.',
        '**② Chào**: (ai) + **好**！ — 你好, 老师好, 大家好, 早上好.',
        '**③ Câu tính từ**: **S + 很 + tính từ** — 我很好. Không có 是!',
        '**④ Câu hỏi có/không**: câu kể + **吗**？ — 你好吗？你冷吗？',
        '**⑤ Phủ định tính từ**: **S + 不 + tính từ** — 我不冷 (sơ khởi; Bài 3 học đủ).',
        'Ký hiệu: **S** = chủ ngữ (ai/cái gì), **Adj** = tính từ (tốt, lạnh, vui…).',
      ],
    },

    /* ── ① ── */
    { t: 'h', text: '① Đại từ nhân xưng và hậu tố 们' },
    {
      t: 'table',
      caption: 'Bảng đại từ — học thuộc theo hàng',
      head: ['Ngôi', 'Số ít', 'Pinyin', 'Số nhiều', 'Pinyin', 'Nghĩa'],
      rows: [
        ['Ngôi 1', '我', 'wǒ', '我们', 'wǒmen', 'tôi → chúng tôi, chúng ta'],
        ['Ngôi 2', '你', 'nǐ', '你们', 'nǐmen', 'bạn → các bạn'],
        ['Ngôi 2 (kính trọng)', '您', 'nín', '(không dùng 您们)', '—', 'ngài, thầy, cô… → dùng 你们 / 大家'],
        ['Ngôi 3 nam', '他', 'tā', '他们', 'tāmen', 'anh ấy → họ (có nam)'],
        ['Ngôi 3 nữ', '她', 'tā', '她们', 'tāmen', 'cô ấy → họ (toàn nữ)'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'đại từ chỉ người + 们',
          vi: 'Biến đại từ thành số nhiều (们 đọc thanh nhẹ "men")',
          examples: [
            { en: '{我们|wǒmen}{很|hěn}{好|hǎo}。', ro: 'Wǒmen hěn hǎo.', vi: 'Chúng tôi khoẻ.' },
            { en: '{你们|nǐmen}{好|hǎo}！', ro: 'Nǐmen hǎo!', vi: 'Chào các bạn!' },
            { en: '{他们|tāmen}{很|hěn}{忙|máng}。', ro: 'Tāmen hěn máng.', vi: 'Họ rất bận.' },
            { en: '{她们|tāmen}{很|hěn}{高兴|gāoxìng}。', ro: 'Tāmen hěn gāoxìng.', vi: 'Các cô ấy rất vui.' },
            { en: '{同学们|tóngxuémen}{好|hǎo}！', ro: 'Tóngxuémen hǎo!', vi: 'Chào các em! (同学 + 们)' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: 'Tiếng Việt có rất nhiều cách xưng hô (anh, chị, em, ông, bà, con, cháu…) và phải chọn theo tuổi, vai vế. Tiếng Trung đơn giản hơn nhiều: **我** cho mọi "tôi", **你** cho mọi "bạn", chỉ thêm **您** khi muốn tỏ kính trọng. **们** chỉ gắn sau từ chỉ **người** (我们, 老师们, 同学们) — không gắn sau đồ vật.',
    },
    {
      t: 'note',
      title: 'Người Việt hay nhầm',
      items: [
        'Dùng 你 với thầy cô, người lớn tuổi: không sai ngữ pháp nhưng **thiếu lễ phép**. Với thầy cô nói **您** hoặc **老师**: ~~你好，老师！~~ → **老师，您好！** hoặc **老师好！**',
        'Viết 他 cho phụ nữ (vì đọc giống nhau): ~~安娜？他很好。~~ → **安娜？她很好。**',
        'Nói ~~您们好~~ khi chào nhiều người lớn tuổi: nghe gượng — nói **大家好** hoặc **你们好**.',
        'Đọc 们 thành thanh 2 (mén): 们 trong 我们/你们 luôn **nhẹ**: wǒmen, nǐmen.',
      ],
    },
    { t: 'rule', formula: '我 / 你 / 您 / 他 / 她 + 们 → số nhiều', vi: 'Gắn 们 (thanh nhẹ) sau đại từ hoặc danh từ chỉ người để nói "nhiều người"; 您 không có số nhiều thông dụng.' },

    /* ── ② ── */
    { t: 'h', text: '② Câu chào: (ai / lúc nào) + 好！' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'người được chào + 好！',
          vi: 'Chào một người hoặc một nhóm người',
          examples: [
            { en: '{你好|nǐ hǎo}！', ro: 'Nǐ hǎo!', vi: 'Chào bạn! (đọc ní hǎo)' },
            { en: '{您好|nín hǎo}！', ro: 'Nín hǎo!', vi: 'Chào ông/bà/thầy/cô! (lịch sự)' },
            { en: '{老师|lǎoshī}{好|hǎo}！', ro: 'Lǎoshī hǎo!', vi: 'Em chào thầy/cô!' },
            { en: '{大家|dàjiā}{好|hǎo}！', ro: 'Dàjiā hǎo!', vi: 'Chào mọi người!' },
            { en: '{李|Lǐ}{老师|lǎoshī}{好|hǎo}！', ro: 'Lǐ lǎoshī hǎo!', vi: 'Em chào cô Lý! (đọc Lí lǎoshī hǎo)' },
          ],
        },
        {
          formula: 'thời điểm + 好！',
          vi: 'Chào theo buổi',
          examples: [
            { en: '{早上|zǎoshang}{好|hǎo}！', ro: 'Zǎoshang hǎo!', vi: 'Chào buổi sáng!' },
            { en: '{早|zǎo}！', ro: 'Zǎo!', vi: 'Chào (buổi sáng) — nói tắt, thân mật' },
          ],
        },
        {
          formula: 'tên / chức danh，+ 你好 / 您好！',
          vi: 'Gọi tên trước rồi chào — rất tự nhiên khi gặp người quen',
          examples: [
            { en: '{王明|Wáng Míng}，{你好|nǐ hǎo}！', ro: 'Wáng Míng, nǐ hǎo!', vi: 'Vương Minh, chào bạn!' },
            { en: '{老师|lǎoshī}，{您好|nín hǎo}！', ro: 'Lǎoshī, nín hǎo!', vi: 'Thưa cô, em chào cô ạ!' },
            { en: '{老板|lǎobǎn}，{您好|nín hǎo}！', ro: 'Lǎobǎn, nín hǎo!', vi: 'Chào cô chủ ạ!' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — chọn người ở cột trái, chào theo cột phải',
      head: ['Bạn gặp…', 'Câu chào', 'Pinyin', 'Mức lịch sự'],
      rows: [
        ['một bạn cùng lớp', '你好！', 'Nǐ hǎo!', 'thường'],
        ['nhiều bạn', '你们好！', 'Nǐmen hǎo!', 'thường'],
        ['thầy cô', '老师好！/ 老师，您好！', 'Lǎoshī hǎo! / Lǎoshī, nín hǎo!', 'lễ phép'],
        ['bác bảo vệ, người lớn tuổi', '您好！', 'Nín hǎo!', 'lễ phép'],
        ['cả lớp, cả hội trường', '大家好！', 'Dàjiā hǎo!', 'thường — dùng khi phát biểu'],
        ['bạn cùng phòng lúc 7 giờ sáng', '早上好！/ 早！', 'Zǎoshang hǎo! / Zǎo!', 'thân mật'],
        ['chủ quán', '老板，您好！', 'Lǎobǎn, nín hǎo!', 'lịch sự'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Dịch từng chữ "Chào cô" thành ~~好老师~~: trật tự là **người TRƯỚC, 好 SAU** — **老师好**. (好老师 nghĩa là "giáo viên tốt"!)',
        'Dùng 你好吗 để chào người lạ: 你好吗 là **hỏi thăm sức khoẻ** người quen. Người lạ chỉ cần **你好**.',
        'Chào buổi tối bằng 早上好: 早上 chỉ buổi sáng sớm. Buổi khác cứ dùng **你好** là an toàn.',
      ],
    },
    { t: 'rule', formula: '(người / thời điểm) + 好！', vi: 'Câu chào cơ bản: đặt người được chào (hoặc buổi trong ngày) trước 好.' },

    /* ── ③ ── */
    { t: 'h', text: '③ Câu tính từ: S + 很 + tính từ' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'S + 很 + Adj',
          vi: 'Nói ai đó / cái gì đó "thế nào" (khoẻ, vui, bận, lạnh…)',
          examples: [
            { en: '{我|wǒ}{很|hěn}{好|hǎo}。', ro: 'Wǒ hěn hǎo.', vi: 'Tôi khoẻ. (đọc wǒ hén hǎo)' },
            { en: '{她|tā}{很|hěn}{高兴|gāoxìng}。', ro: 'Tā hěn gāoxìng.', vi: 'Cô ấy rất vui.' },
            { en: '{他们|tāmen}{很|hěn}{忙|máng}。', ro: 'Tāmen hěn máng.', vi: 'Họ rất bận.' },
            { en: '{北京|Běijīng}{很|hěn}{冷|lěng}。', ro: 'Běijīng hěn lěng.', vi: 'Bắc Kinh rất lạnh.' },
            { en: '{老师|lǎoshī}{很|hěn}{好|hǎo}。', ro: 'Lǎoshī hěn hǎo.', vi: 'Cô giáo rất tốt.' },
            { en: '{我们|wǒmen}{很|hěn}{热|rè}。', ro: 'Wǒmen hěn rè.', vi: 'Chúng tôi nóng lắm.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: 'Trong tiếng Trung, **tính từ tự làm vị ngữ** — giống tiếng Việt "Tôi khoẻ", "Trời lạnh": **không cần** động từ "là" (是) chen vào. Điểm đặc biệt: câu khẳng định với tính từ trơn (~~我好~~) nghe **cụt và như đang so sánh** ("tôi thì tốt — còn người khác thì không"). Vì vậy người Trung Quốc gần như luôn thêm **很** trước tính từ. Lúc đó 很 chỉ còn nghĩa "rất" **rất nhẹ** — 我很好 dịch tự nhiên là "Tôi khoẻ", không nhất thiết là "Tôi rất khoẻ". Muốn nhấn mạnh "rất" thật sự thì **nhấn giọng vào 很**.',
    },
    {
      t: 'table',
      caption: 'Tách câu 我很好 thành từng mảnh',
      head: ['Mảnh', 'Pinyin', 'Vai trò', 'Nghĩa'],
      rows: [
        ['我', 'wǒ', 'S — chủ ngữ', 'tôi'],
        ['很', 'hěn (đọc hén)', 'phó từ chỉ mức độ — đứng TRƯỚC tính từ', '(rất)'],
        ['好', 'hǎo', 'Adj — tính từ làm vị ngữ', 'khoẻ, tốt'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — chọn một ô cột trái + một ô cột phải: S + 很 + Adj',
      head: ['S (ai / cái gì)', '很', 'Adj', 'Câu mẫu'],
      rows: [
        ['我 / 我们', '很', '好', '我很好。Wǒ hěn hǎo.'],
        ['你 / 你们', '很', '忙', '你们很忙。Nǐmen hěn máng.'],
        ['他 / 她', '很', '高兴', '她很高兴。Tā hěn gāoxìng.'],
        ['老师 / 同学们', '很', '冷', '同学们很冷。Tóngxuémen hěn lěng.'],
        ['大家', '很', '热', '大家很热。Dàjiā hěn rè.'],
        ['北京', '很', '冷', '北京很冷。Běijīng hěn lěng.'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Thêm 是 theo kiểu "tôi **là** khoẻ": ~~我是很好。~~ ~~她是高兴。~~ → **我很好。她很高兴。** Tính từ không đi với 是 (是 dùng cho danh từ: Bài 2).',
        'Đặt 很 sau tính từ như "khoẻ lắm": ~~我好很。~~ → **我很好。** 很 luôn đứng **trước** tính từ.',
        'Bỏ 很 trong câu kể đơn: ~~我好。~~ ~~北京冷。~~ — không sai hẳn nhưng nghe cụt/như đang so sánh. Thêm 很: **我很好。北京很冷。**',
        'Đọc 很好 đủ hai thanh 3 "hěn hǎo": phải đọc **hén hǎo** (biến điệu). 我很好 nghe tự nhiên là **wǒ hén hǎo** hoặc **wó hén hǎo**.',
      ],
    },
    { t: 'rule', formula: 'S + 很 + Adj。', vi: 'Nói ai/cái gì thế nào: tính từ làm vị ngữ, thêm 很 phía trước, KHÔNG dùng 是.' },

    /* ── ④ ── */
    { t: 'h', text: '④ Câu hỏi có/không với 吗' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'câu kể + 吗？',
          vi: 'Giữ nguyên câu kể, thêm 吗 vào cuối → câu hỏi "…không?"',
          examples: [
            { en: '{你|nǐ}{好|hǎo}{吗|ma}？', ro: 'Nǐ hǎo ma?', vi: 'Bạn khoẻ không?' },
            { en: '{你|nǐ}{忙|máng}{吗|ma}？', ro: 'Nǐ máng ma?', vi: 'Bạn có bận không?' },
            { en: '{你们|nǐmen}{冷|lěng}{吗|ma}？', ro: 'Nǐmen lěng ma?', vi: 'Các bạn có lạnh không?' },
            { en: '{老师|lǎoshī}{好|hǎo}{吗|ma}？', ro: 'Lǎoshī hǎo ma?', vi: 'Cô giáo có khoẻ không?' },
            { en: '{她|tā}{高兴|gāoxìng}{吗|ma}？', ro: 'Tā gāoxìng ma?', vi: 'Cô ấy có vui không?' },
            { en: '{北京|Běijīng}{热|rè}{吗|ma}？', ro: 'Běijīng rè ma?', vi: 'Bắc Kinh có nóng không?' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '吗 giống chữ **"…không?"** cuối câu của tiếng Việt: "Bạn khoẻ **không**?" = 你好**吗**？ Trật tự từ **không đổi** — không đảo ngữ như tiếng Anh. Để ý: trong câu hỏi thường **bỏ 很** (你**很**好吗？ ít dùng, nghe như "bạn RẤT khoẻ à?"), nhưng khi **trả lời khẳng định** lại thêm 很. Giọng: 吗 là thanh nhẹ, cả câu hơi **nhấc lên ở cuối**.',
    },
    {
      t: 'table',
      caption: 'Cặp hỏi ↔ đáp: khẳng định và phủ định',
      head: ['Hỏi', 'Đáp khẳng định', 'Đáp phủ định'],
      rows: [
        ['你好吗？Nǐ hǎo ma?', '我很好。Wǒ hěn hǎo.', '我不好。Wǒ bù hǎo. (ít nói — thường nói 不太好, Bài 14)'],
        ['你忙吗？Nǐ máng ma?', '我很忙。Wǒ hěn máng.', '我不忙。Wǒ bù máng.'],
        ['你冷吗？Nǐ lěng ma?', '我很冷。Wǒ hěn lěng.', '我不冷。Wǒ bù lěng.'],
        ['你热吗？Nǐ rè ma?', '我很热。Wǒ hěn rè.', '我不热。Wǒ bú rè. (不 → bú)'],
        ['她高兴吗？Tā gāoxìng ma?', '她很高兴。Tā hěn gāoxìng.', '她不高兴。Tā bù gāoxìng.'],
        ['老师忙吗？Lǎoshī máng ma?', '老师很忙。Lǎoshī hěn máng.', '老师不忙。Lǎoshī bù máng.'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi ↔ đáp mẫu',
      lines: [
        { who: '王明 Vương Minh', role: 'b', text: '{你|nǐ}{热|rè}{吗|ma}？', ro: 'Nǐ rè ma?', vi: 'Bạn có nóng không?' },
        { who: '兰兰 Lan', role: 'a', text: '{我|wǒ}{不|bú}{热|rè}。{我|wǒ}{很|hěn}{冷|lěng}！', ro: 'Wǒ bú rè. Wǒ hěn lěng!', vi: 'Mình không nóng. Mình lạnh lắm!' },
        { who: '王明 Vương Minh', role: 'b', text: '{大伟|Dàwěi}{冷|lěng}{吗|ma}？', ro: 'Dàwěi lěng ma?', vi: 'Đại Vĩ có lạnh không?' },
        { who: '兰兰 Lan', role: 'a', text: '{他|tā}{不|bù}{冷|lěng}。{他|tā}{很|hěn}{高兴|gāoxìng}。', ro: 'Tā bù lěng. Tā hěn gāoxìng.', vi: 'Cậu ấy không lạnh. Cậu ấy vui lắm.' },
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Đặt 吗 ở đầu câu hoặc giữa câu: ~~吗你好？~~ → **你好吗？** 吗 luôn ở **cuối**.',
        'Trả lời 吗 bằng "có" kiểu tiếng Việt: hỏi 你忙吗？ không đáp "~~有~~" (有 = có sở hữu, Bài 4). Đáp bằng **chính tính từ**: **我很忙** / **我不忙**.',
        'Dùng 吗 cùng từ để hỏi (ai, gì, đâu… — học từ Bài 2): một câu chỉ có **một** cách hỏi. Bài này chỉ dùng 吗.',
        'Đọc 吗 có thanh (mā/mǎ): 吗 luôn **nhẹ**, ngắn.',
      ],
    },
    { t: 'rule', formula: 'câu kể + 吗？ → đáp: S + 很 + Adj / S + 不 + Adj', vi: 'Hỏi có/không: thêm 吗 cuối câu, không đổi trật tự; trả lời bằng chính tính từ.' },

    /* ── ⑤ ── */
    { t: 'h', text: '⑤ Phủ định tính từ: S + 不 + tính từ (sơ khởi)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'S + 不 + Adj',
          vi: 'Nói "không …" — thay 很 bằng 不',
          examples: [
            { en: '{我|wǒ}{不|bù}{冷|lěng}。', ro: 'Wǒ bù lěng.', vi: 'Tôi không lạnh.' },
            { en: '{她|tā}{不|bù}{忙|máng}。', ro: 'Tā bù máng.', vi: 'Cô ấy không bận.' },
            { en: '{我们|wǒmen}{不|bú}{热|rè}。', ro: 'Wǒmen bú rè.', vi: 'Chúng tôi không nóng. (不 → bú trước thanh 4)' },
            { en: '{他|tā}{不|bù}{高兴|gāoxìng}。', ro: 'Tā bù gāoxìng.', vi: 'Anh ấy không vui.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '不 đứng **ngay trước** tính từ. Câu phủ định **bỏ 很**: 我不冷 (tôi không lạnh). (Tiếng Trung cũng có **很不 + tính từ** — 很不高兴 "rất không vui" — để nhấn mạnh; dạng này học sau, bây giờ chỉ cần S + 不 + Adj.) Nhớ biến điệu: 不 + **thanh 4** → **bú** (不热 bú rè); trước thanh 1, 2, 3 giữ **bù** (不高兴, 不忙, 不冷). Bài 3 sẽ học 不 với động từ và với 是.',
    },
    { t: 'rule', formula: 'S + 不 + Adj。', vi: 'Phủ định câu tính từ: 不 đứng ngay trước tính từ, bỏ 很; trước thanh 4 đọc bú.' },

    /* ── Cảm ơn, xin lỗi, tạm biệt ── */
    { t: 'h', text: 'Bổ sung: cảm ơn / xin lỗi / tạm biệt + người' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '谢谢 + người',
          vi: 'Cảm ơn ai đó',
          examples: [
            { en: '{谢谢|xièxie}{你|nǐ}！', ro: 'Xièxie nǐ!', vi: 'Cảm ơn bạn!' },
            { en: '{谢谢|xièxie}{您|nín}！', ro: 'Xièxie nín!', vi: 'Cảm ơn ông/bà/thầy/cô ạ!' },
            { en: '{谢谢|xièxie}{老师|lǎoshī}！', ro: 'Xièxie lǎoshī!', vi: 'Em cảm ơn thầy/cô!' },
            { en: '{谢谢|xièxie}{大家|dàjiā}！', ro: 'Xièxie dàjiā!', vi: 'Cảm ơn mọi người!' },
          ],
        },
        {
          formula: '(người，) + 对不起 / 再见',
          vi: 'Gọi người trước rồi xin lỗi / chào tạm biệt',
          examples: [
            { en: '{老师|lǎoshī}，{对不起|duìbuqǐ}！', ro: 'Lǎoshī, duìbuqǐ!', vi: 'Thưa cô, em xin lỗi!' },
            { en: '{安娜|Ānnà}，{对不起|duìbuqǐ}！', ro: 'Ānnà, duìbuqǐ!', vi: 'Anna, xin lỗi nhé!' },
            { en: '{老师|lǎoshī}{再见|zàijiàn}！', ro: 'Lǎoshī zàijiàn!', vi: 'Em chào cô ạ! (khi ra về)' },
            { en: '{大家|dàjiā}{再见|zàijiàn}！', ro: 'Dàjiā zàijiàn!', vi: 'Tạm biệt mọi người!' },
          ],
        },
        {
          formula: 'thời gian + 见',
          vi: 'Hẹn gặp lại vào lúc nào',
          examples: [
            { en: '{明天|míngtiān}{见|jiàn}！', ro: 'Míngtiān jiàn!', vi: 'Mai gặp!' },
            { en: '{老师|lǎoshī}，{明天|míngtiān}{见|jiàn}！', ro: 'Lǎoshī, míngtiān jiàn!', vi: 'Thưa cô, mai gặp cô ạ!' },
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận: cặp đáp lời rất hay bị lẫn',
      items: [
        '**谢谢 → 不客气** (cảm ơn → không có gì). **对不起 → 没关系** (xin lỗi → không sao). Đáp nhầm ~~谢谢！— 没关系。~~ nghe như "Cảm ơn! — Không sao đâu" — người nghe sẽ ngơ ngác.',
        'Nói 对不起 cho việc nhỏ (hỏi đường, nhờ việc) nghe hơi nặng; với việc làm phiền nhẹ, người Trung Quốc thường dùng 不好意思 (Bài sau). Va vào người, đến muộn → 对不起 là đúng.',
      ],
    },

    /* ── So sánh với tiếng Việt ── */
    { t: 'h', text: 'Đặt cạnh tiếng Việt — giống và khác' },
    {
      t: 'table',
      caption: 'Câu Bài 1 so với tiếng Việt',
      head: ['Tiếng Việt', 'Tiếng Trung', 'Giống / khác'],
      rows: [
        ['Tôi khoẻ.', '我很好。', 'Giống: tính từ làm vị ngữ, không cần "là". Khác: tiếng Trung thường thêm 很.'],
        ['Bạn khoẻ **không**?', '你好**吗**？', 'Giống: thêm một chữ cuối câu để hỏi, không đảo trật tự.'],
        ['Tôi **không** lạnh.', '我**不**冷。', 'Giống hệt: chữ phủ định đứng ngay trước tính từ.'],
        ['**Chào** cô!', '老师**好**！', 'Khác: tiếng Việt "chào" đứng trước; tiếng Trung người được chào đứng trước, 好 sau.'],
        ['Cảm ơn **bạn**!', '谢谢**你**！', 'Giống: động từ trước, người sau.'],
        ['Anh ấy / Chị ấy', '他 / 她', 'Khác: tiếng Việt phân biệt bằng lời nói (anh/chị); tiếng Trung chỉ phân biệt khi VIẾT, đọc đều là tā.'],
        ['Các bạn, chúng tôi', '你们, 我们', 'Khác: tiếng Việt thêm "các/chúng" phía TRƯỚC; tiếng Trung thêm 们 phía SAU.'],
      ],
    },

    /* ── Tổng kết ── */
    { t: 'h', text: 'Tổng kết ngữ pháp Bài 1' },
    {
      t: 'table',
      head: ['Điểm', 'Công thức', 'Ví dụ', 'Dùng khi'],
      rows: [
        ['①', 'đại từ + 们', '我们, 你们, 他们, 她们', 'Nói nhiều người'],
        ['②', '(người / buổi) + 好！', '老师好！早上好！', 'Chào'],
        ['③', 'S + 很 + Adj', '我很好。北京很冷。', 'Nói ai thế nào'],
        ['④', 'câu kể + 吗？', '你忙吗？', 'Hỏi có/không'],
        ['⑤', 'S + 不 + Adj', '我不冷。我不热 (bú)。', 'Trả lời phủ định'],
        ['+', '谢谢 + người · thời gian + 见', '谢谢老师！明天见！', 'Cảm ơn, hẹn gặp'],
      ],
    },
    {
      t: 'build',
      id: 'b1-np-ghep',
      title: 'Ghép câu — Bài 1',
      items: [
        { vi: 'Tôi khoẻ.', chips: ['{我|wǒ}', '{很|hěn}', '{好|hǎo}', '{吗|ma}'], answer: ['{我|wǒ}', '{很|hěn}', '{好|hǎo}'], ro: 'Wǒ hěn hǎo.' },
        { vi: 'Bạn có bận không?', chips: ['{你|nǐ}', '{忙|máng}', '{吗|ma}', '{很|hěn}'], answer: ['{你|nǐ}', '{忙|máng}', '{吗|ma}'], ro: 'Nǐ máng ma?' },
        { vi: 'Em chào cô ạ!', chips: ['{老师|lǎoshī}', '{好|hǎo}', '{很|hěn}'], answer: ['{老师|lǎoshī}', '{好|hǎo}'], ro: 'Lǎoshī hǎo!' },
        { vi: 'Cô ấy rất vui.', chips: ['{她|tā}', '{很|hěn}', '{高兴|gāoxìng}', '{是|shì}'], answer: ['{她|tā}', '{很|hěn}', '{高兴|gāoxìng}'], ro: 'Tā hěn gāoxìng.' },
        { vi: 'Chúng tôi không lạnh.', chips: ['{我们|wǒmen}', '{不|bù}', '{冷|lěng}', '{很|hěn}'], answer: ['{我们|wǒmen}', '{不|bù}', '{冷|lěng}'], ro: 'Wǒmen bù lěng.' },
        { vi: 'Các bạn có lạnh không?', chips: ['{你们|nǐmen}', '{冷|lěng}', '{吗|ma}', '{您|nín}'], answer: ['{你们|nǐmen}', '{冷|lěng}', '{吗|ma}'], ro: 'Nǐmen lěng ma?' },
        { vi: 'Họ rất bận.', chips: ['{他们|tāmen}', '{很|hěn}', '{忙|máng}', '{吗|ma}'], answer: ['{他们|tāmen}', '{很|hěn}', '{忙|máng}'], ro: 'Tāmen hěn máng.' },
        { vi: 'Bắc Kinh rất lạnh.', chips: ['{北京|Běijīng}', '{很|hěn}', '{冷|lěng}', '{热|rè}'], answer: ['{北京|Běijīng}', '{很|hěn}', '{冷|lěng}'], ro: 'Běijīng hěn lěng.' },
        { vi: 'Em cảm ơn cô ạ!', chips: ['{谢谢|xièxie}', '{老师|lǎoshī}', '{对不起|duìbuqǐ}'], answer: ['{谢谢|xièxie}', '{老师|lǎoshī}'], ro: 'Xièxie lǎoshī!' },
        { vi: 'Mai gặp nhé!', chips: ['{明天|míngtiān}', '{见|jiàn}', '{再|zài}'], answer: ['{明天|míngtiān}', '{见|jiàn}'], ro: 'Míngtiān jiàn!' },
        { vi: 'Tôi không nóng.', chips: ['{我|wǒ}', '{不|bú}', '{热|rè}', '{很|hěn}'], answer: ['{我|wǒ}', '{不|bú}', '{热|rè}'], ro: 'Wǒ bú rè.' },
        { vi: 'Cô giáo có khoẻ không?', chips: ['{老师|lǎoshī}', '{好|hǎo}', '{吗|ma}', '{很|hěn}'], answer: ['{老师|lǎoshī}', '{好|hǎo}', '{吗|ma}'], ro: 'Lǎoshī hǎo ma?' },
      ],
    },
    {
      t: 'quiz',
      id: 'b1-np-dien',
      title: 'Điền một chữ vào （　）: 好 · 很 · 吗 · 不 · 们',
      kind: 'fill',
      grammar: 'S + 很 + Adj · câu kể + 吗 · S + 不 + Adj · đại từ + 们 · (người) + 好',
      items: [
        { q: '{我|wǒ}（　）{好|hǎo}。', answers: ['很'], hint: 'Tôi khoẻ.' },
        { q: '{你|nǐ}{忙|máng}（　）？', answers: ['吗'], hint: 'Bạn có bận không?' },
        { q: '{我|wǒ}（　）{冷|lěng}。', answers: ['不'], hint: 'Tôi KHÔNG lạnh.' },
        { q: '{你|nǐ}（　）{好|hǎo}！', answers: ['们'], hint: 'Chào CÁC bạn!' },
        { q: '{老师|lǎoshī}（　）！', answers: ['好'], hint: 'Em chào cô!' },
        { q: '{她|tā}（　）{高兴|gāoxìng}。', answers: ['很'], hint: 'Cô ấy rất vui.' },
        { q: '{北京|Běijīng}{热|rè}（　）？', answers: ['吗'], hint: 'Bắc Kinh có nóng không?' },
        { q: '{我们|wǒmen}（　）{热|rè}。', answers: ['不'], hint: 'Chúng tôi không nóng. (đọc bú)' },
        { q: '{大家|dàjiā}（　）！', answers: ['好'], hint: 'Chào mọi người!' },
        { q: '{同学|tóngxué}（　）{好|hǎo}！', answers: ['们'], hint: 'Chào các em!' },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-np-trac-nghiem',
      title: 'Trắc nghiệm ngữ pháp Bài 1',
      items: [
        m('"Tôi rất vui." — câu nào đúng?', ['我是很高兴。', '我很高兴。', '我高兴很。', '很我高兴。'], 1, 'S + 很 + Adj, không dùng 是.'),
        m('"Bạn có lạnh không?" — câu nào đúng?', ['吗你冷？', '你冷吗？', '你吗冷？', '你是冷吗？'], 1, '吗 đặt cuối câu kể.'),
        m('Trả lời phủ định cho 你忙吗？', ['我不忙。', '我很不忙吗。', '我没有。', '不我忙。'], 0, 'S + 不 + Adj: 我不忙.'),
        m('Chào cô giáo lễ phép nhất:', ['你好！', '好老师！', '老师，您好！', '她好！'], 2, 'Gọi 老师 + 您好. 好老师 nghĩa là "giáo viên tốt".'),
        m('Nhóm gồm 3 bạn nữ và 1 bạn nam là:', ['她们', '他们', '你们', '我们'], 1, 'Có ít nhất một nam → 他们.'),
        m('不热 đọc thế nào?', ['bù rè', 'bú rè', 'bu re', 'bǔ rè'], 1, '热 thanh 4 → 不 đọc bú.'),
        m('Ai đó nói 对不起, bạn đáp:', ['不客气。', '没关系。', '谢谢。', '你好。'], 1, 'Xin lỗi → 没关系.'),
        m('Câu nào **sai**?', ['他很忙。', '我们很好。', '她是很冷。', '北京很热。'], 2, 'Không dùng 是 trước tính từ: 她很冷.'),
      ],
    },
  ],
};

/* ══════════════════════════ 4. CHỮ HÁN ══════════════════════════ */

const HAN_TU: Lesson = {
  id: 'b1-han-tu',
  kind: 'kanji',
  title: 'Chữ Hán Bài 1 — 12 chữ: 你 好 我 他 她 您 们 很 吗 谢 再 见',
  goal: 'Nhận mặt, đọc đúng và viết được 12 chữ Hán cốt lõi của Bài 1; hiểu cấu tạo bộ thủ để nhớ lâu.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Cách học chữ Hán bài này',
      items: [
        '12 chữ — mỗi chữ: **xem thứ tự nét → tô theo → tự viết** (khối tập viết cuối bài).',
        'Nhìn **bộ thủ** trước: 亻 (người) có trong 你, 他, 们; 女 (nữ) có trong 好, 她; 口 (miệng) trong 吗; 讠 (lời nói) trong 谢; 心 (tim) trong 您.',
        'Ghi nhớ bằng **âm Hán Việt**: 好 HẢO, 我 NGÃ, 谢 TẠ, 再 TÁI, 见 KIẾN — gặp lại trong rất nhiều từ.',
        'Phần **Đọc chữ trần** (không pinyin) mô phỏng đề HSK: đọc to trước rồi mới bấm hiện pinyin.',
      ],
    },
    {
      t: 'table',
      caption: '12 chữ Hán của Bài 1',
      head: ['Chữ', 'Pinyin', 'Hán Việt', 'Bộ thủ', 'Số nét', 'Nghĩa', 'Từ ví dụ'],
      rows: [
        ['你', 'nǐ', 'NỄ', '亻 (người)', '7', 'bạn', '你好 · 你们'],
        ['好', 'hǎo', 'HẢO', '女 (nữ)', '6', 'tốt, khoẻ', '你好 · 很好'],
        ['我', 'wǒ', 'NGÃ', '戈 (qua — cây giáo)', '7', 'tôi', '我们 · 我很好'],
        ['他', 'tā', 'THA', '亻 (người)', '5', 'anh ấy', '他们 · 他很忙'],
        ['她', 'tā', 'THA', '女 (nữ)', '6', 'cô ấy', '她们 · 她很高兴'],
        ['您', 'nín', '—', '心 (tim)', '11', 'ngài (kính trọng)', '您好 · 谢谢您'],
        ['们', 'men', 'MÔN', '亻 (người)', '5', '(số nhiều chỉ người)', '我们 · 同学们'],
        ['很', 'hěn', 'NGẬN', '彳 (bước chân trái)', '9', 'rất', '很好 · 很冷'],
        ['吗', 'ma', 'MA', '口 (miệng)', '6', '(trợ từ hỏi)', '你好吗'],
        ['谢', 'xiè', 'TẠ', '讠 (lời nói)', '12', 'cảm ơn', '谢谢 · 谢谢老师'],
        ['再', 'zài', 'TÁI', '冂 (quynh — khung)', '6', 'lại, lần nữa', '再见'],
        ['见', 'jiàn', 'KIẾN', '见 (kiến — tự là bộ)', '4', 'gặp, thấy', '再见 · 明天见'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ bằng hình và bộ thủ',
      items: [
        '**好** = **女** (người mẹ) + **子** (đứa con): mẹ bế con — điều **tốt** đẹp nhất. → HẢO.',
        '**你** = **亻** (người) + **尔** (ngươi, gợi âm): "người ấy" đang nói chuyện với mình → bạn.',
        '**他 / 她**: cùng phần **也** bên phải; bên trái là **亻** (nam / chung) hoặc **女** (nữ). Nghe giống nhau, nhìn biết ngay.',
        '**您** = **你** đặt trên **心** (trái tim): kính trọng người đối diện từ trong lòng.',
        '**们** = **亻** (người) + **门** (mén — cửa, gợi âm "men"): nhiều người đứng trước cửa → số nhiều.',
        '**吗** = **口** (miệng) + **马** (mǎ — ngựa, gợi âm "ma"): cái miệng đang hỏi.',
        '**谢** = **讠** (lời nói) + **身** (thân) + **寸** (tấc): dùng lời nói để tạ ơn.',
        '**见** = hình con **mắt** trên đôi **chân** người (phồn thể 見 có chữ 目 mắt): người đi tới và nhìn thấy → gặp. **再** + **见** = gặp lại.',
        '**很** = **彳** (bước đi) + **艮** (gèn — gợi âm). Nét bên trái là "nhân kép" 彳, KHÔNG phải 亻 — 彳 có **3 nét**, 亻 chỉ 2.',
        '**我** — nguyên gốc là hình một loại **binh khí có răng cưa** (bộ 戈), sau được mượn để chỉ "tôi". Viết 7 nét, chú ý nét hất (nét 4) và nét chấm cuối cùng.',
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận: các chữ dễ viết nhầm',
      items: [
        '**你 ↔ 您**: 您 có thêm 心 ở dưới — 11 nét. Đừng quên phần 心 khi muốn viết lịch sự.',
        '**他 ↔ 她 ↔ 也**: 也 (yě — cũng, Bài 3) là phần bên phải. Viết 他 cho nữ là lỗi rất hay gặp trong bài viết.',
        '**很 ↔ 跟/恨**: chỉ cần nhớ bên trái của 很 là 彳 (ba nét: phẩy, phẩy, sổ).',
        '**见 ↔ 贝**: 见 (gặp) nét cuối là **sổ cong móc** vươn ra phải; 贝 (bèi — vỏ sò, tiền) nét cuối là **chấm**. Đừng viết 再贝!',
      ],
    },
    {
      t: 'readkanji',
      id: 'b1-doc-chu',
      title: 'Đọc chữ trần — không pinyin',
      note: 'Như đề HSK: chữ không có pinyin. Đọc to cả câu một hơi, nhớ biến điệu (你好 → ní hǎo; 很好 → hén hǎo; 不热 → bú rè), rồi mới bấm hiện pinyin + nghe để tự chấm.',
      items: [
        { text: '{你好|nǐ hǎo}！', ro: 'Nǐ hǎo!', vi: 'Xin chào!' },
        { text: '{您好|nín hǎo}！', ro: 'Nín hǎo!', vi: 'Xin chào (lịch sự)!' },
        { text: '{你|nǐ}{好|hǎo}{吗|ma}？', ro: 'Nǐ hǎo ma?', vi: 'Bạn khoẻ không?' },
        { text: '{我|wǒ}{很|hěn}{好|hǎo}。', ro: 'Wǒ hěn hǎo.', vi: 'Tôi khoẻ.' },
        { text: '{我们|wǒmen}{很|hěn}{好|hǎo}。', ro: 'Wǒmen hěn hǎo.', vi: 'Chúng tôi khoẻ.' },
        { text: '{他|tā}{很|hěn}{忙|máng}。', ro: 'Tā hěn máng.', vi: 'Anh ấy rất bận.' },
        { text: '{她|tā}{很|hěn}{高兴|gāoxìng}。', ro: 'Tā hěn gāoxìng.', vi: 'Cô ấy rất vui.' },
        { text: '{你们|nǐmen}{好|hǎo}！', ro: 'Nǐmen hǎo!', vi: 'Chào các bạn!' },
        { text: '{他们|tāmen}{好|hǎo}{吗|ma}？', ro: 'Tāmen hǎo ma?', vi: 'Họ có khoẻ không?' },
        { text: '{谢谢|xièxie}{您|nín}！', ro: 'Xièxie nín!', vi: 'Cảm ơn ngài/cô ạ!' },
        { text: '{谢谢|xièxie}{你们|nǐmen}！', ro: 'Xièxie nǐmen!', vi: 'Cảm ơn các bạn!' },
        { text: '{再见|zàijiàn}！', ro: 'Zàijiàn!', vi: 'Tạm biệt!' },
        { text: '{明天|míngtiān}{见|jiàn}！', ro: 'Míngtiān jiàn!', vi: 'Mai gặp!' },
        { text: '{她们|tāmen}{很|hěn}{好|hǎo}，{我|wǒ}{很|hěn}{高兴|gāoxìng}。', ro: 'Tāmen hěn hǎo, wǒ hěn gāoxìng.', vi: 'Các cô ấy khoẻ, tôi rất vui.' },
      ],
    },
    {
      t: 'table',
      caption: 'Chữ của bài trong từ ghép khác — đoán nghĩa nhờ âm Hán Việt (chỉ để nhận mặt, chưa cần học)',
      head: ['Từ', 'Pinyin', 'Hán Việt', 'Nghĩa'],
      rows: [
        ['友好', 'yǒuhǎo', 'HỮU HẢO', 'hữu nghị, thân thiện'],
        ['好人', 'hǎorén', 'HẢO NHÂN', 'người tốt'],
        ['自我', 'zìwǒ', 'TỰ NGÃ', 'bản thân (自我介绍: tự giới thiệu)'],
        ['感谢', 'gǎnxiè', 'CẢM TẠ', 'cảm ơn (trang trọng)'],
        ['再次', 'zàicì', 'TÁI THỨ', 'lần nữa'],
        ['意见', 'yìjiàn', 'Ý KIẾN', 'ý kiến'],
        ['见面', 'jiànmiàn', 'KIẾN DIỆN', 'gặp mặt'],
      ],
    },
    {
      t: 'readkanji',
      id: 'b1-doc-doan',
      title: 'Đọc to cả đoạn — chữ trần',
      note: 'Mỗi đoạn là một cảnh nhỏ. Nhìn 20 giây, đọc một hơi không dừng, rồi bấm hiện pinyin để tự chấm. Chỗ hay vấp: 很好 (hén hǎo), 你好吗 (ní hǎo ma), 不热 (bú rè), 谢谢 (chữ sau nhẹ).',
      items: [
        { text: '{你好|nǐ hǎo}！{你|nǐ}{好|hǎo}{吗|ma}？— {我|wǒ}{很|hěn}{好|hǎo}，{谢谢|xièxie}！', ro: 'Nǐ hǎo! Nǐ hǎo ma? — Wǒ hěn hǎo, xièxie!', vi: 'Chào bạn! Bạn khoẻ không? — Mình khoẻ, cảm ơn!' },
        { text: '{老师|lǎoshī}{好|hǎo}！— {同学们|tóngxuémen}{好|hǎo}！{你们|nǐmen}{冷|lěng}{吗|ma}？— {我们|wǒmen}{不|bù}{冷|lěng}。', ro: 'Lǎoshī hǎo! — Tóngxuémen hǎo! Nǐmen lěng ma? — Wǒmen bù lěng.', vi: 'Em chào cô! — Chào các em! Các em có lạnh không? — Chúng em không lạnh.' },
        { text: '{对不起|duìbuqǐ}！— {没关系|méi guānxi}。{谢谢|xièxie}{您|nín}！— {不客气|bú kèqi}。', ro: 'Duìbuqǐ! — Méi guānxi. Xièxie nín! — Bú kèqi.', vi: 'Xin lỗi! — Không sao. Cảm ơn ông/bà! — Không có gì.' },
        { text: '{他|tā}{很|hěn}{忙|máng}，{她|tā}{不|bù}{忙|máng}。{他们|tāmen}{很|hěn}{高兴|gāoxìng}。{再见|zàijiàn}！{明天|míngtiān}{见|jiàn}！', ro: 'Tā hěn máng, tā bù máng. Tāmen hěn gāoxìng. Zàijiàn! Míngtiān jiàn!', vi: 'Anh ấy bận, cô ấy không bận. Họ rất vui. Tạm biệt! Mai gặp!' },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-han-tu-nhan',
      title: 'Nhận mặt chữ',
      items: [
        m('Chữ nào nghĩa là "cô ấy"?', ['他', '她', '你', '您'], 1, '她 có bộ 女 (nữ).'),
        m('Chữ nào là dạng **kính trọng** của "bạn"?', ['你', '您', '们', '我'], 1, '您 = 你 + 心.'),
        m('Bộ thủ của 好 là gì?', ['子', '女', '口', '亻'], 1, '好 xếp vào bộ 女.'),
        m('谢 có bộ thủ nào — gợi nghĩa gì?', ['讠 — lời nói', '亻 — người', '口 — miệng', '心 — tim'], 0, '讠 (lời nói): dùng lời để cảm ơn.'),
        m('Âm Hán Việt của 再见 là:', ['TÁI KIẾN', 'TẠ TẠ', 'HẢO NGÃ', 'ĐỐI BẤT'], 0, '再 TÁI (lại) + 见 KIẾN (gặp) = gặp lại.'),
        m('Chữ 很 có bên trái là:', ['亻 (2 nét)', '彳 (3 nét)', '女', '口'], 1, '很: bên trái là 彳 — đừng nhầm với 亻.'),
        m('Chữ nào **không** có bộ 亻?', ['你', '他', '们', '她'], 3, '她 có bộ 女; 你, 他, 们 đều có 亻.'),
        m('Chữ 您 có bao nhiêu nét?', ['7', '9', '11', '12'], 2, '你 (7) + 心 (4) = 11 nét.'),
      ],
    },
    {
      t: 'write',
      id: 'b1-viet-chu',
      title: 'Tập viết 12 chữ của Bài 1',
      note: 'Thứ tự gợi ý: chữ ít nét trước. Bấm ▶ xem nét → tô theo → tự viết 3 lần, đọc to pinyin mỗi lần viết. Chú ý: 你 nét giữa phần 尔 là sổ móc; 我 nét 4 là nét hất; 见 nét cuối là sổ cong móc (khác 贝).',
      chars: ['见', '他', '们', '好', '她', '再', '吗', '你', '我', '很', '您', '谢'],
    },
  ],
};

/* ══════════════════════════ 5. NGHE ══════════════════════════ */

const NGHE: Lesson = {
  id: 'b1-nghe',
  kind: 'listening',
  title: 'Luyện nghe Bài 1 — kiểu đề HSK 1',
  goal: 'Nghe hiểu câu chào, cảm ơn, xin lỗi, hỏi thăm; nhận ra người được nói tới (他/她/你们…) và câu trả lời khẳng định hay phủ định.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Cách làm bài nghe',
      items: [
        'Bấm **nghe cả bài** 2 lần: lần 1 chỉ nghe, lần 2 ghi chú từ khoá → làm câu hỏi → rồi mới mở **lời thoại**.',
        'Từ khoá Bài 1: **谢谢 / 不客气 · 对不起 / 没关系 · 再见 · 很 + tính từ · 不 + tính từ · 吗**.',
        'Nghe **不** (bù/bú): thông tin bị phủ định ngay sau nó. 我**不**冷 ≠ 我**很**冷.',
        'Đề HSK 1 thật: mỗi đoạn được đọc **hai lần**, đáp án là tranh — ở đây tranh được thay bằng **mô tả bằng chữ**.',
      ],
    },
    {
      t: 'note',
      title: 'Dạng đề HSK 1 (phần Nghe — 听力) dùng trong bài này',
      items: [
        '**Phần 1–2**: nghe một câu ngắn, chọn tranh/tình huống phù hợp → *Bài nghe 1* (4 câu, chọn tình huống).',
        '**Phần 3**: nghe đoạn hội thoại hai câu, chọn tranh khớp → *Bài nghe 2*.',
        '**Phần 4**: nghe một câu/đoạn ngắn, trả lời câu hỏi chọn 1 trong 3 → *Bài nghe 3, 4*.',
      ],
    },

    { t: 'h', text: 'Bài nghe 1 — Câu này nói trong tình huống nào?' },
    {
      t: 'listen',
      id: 'b1-nghe-1',
      title: 'Bốn câu ngắn',
      note: 'Mỗi câu một tình huống khác nhau. Nghe → chọn tình huống phù hợp.',
      lines: [
        { who: 'Câu 1', voice: 'zh-nu', text: '{对不起|duìbuqǐ}！', ro: 'Duìbuqǐ!', vi: 'Xin lỗi!' },
        { who: 'Câu 2', voice: 'zh-nam', text: '{老师|lǎoshī}，{再见|zàijiàn}！', ro: 'Lǎoshī, zàijiàn!', vi: 'Em chào cô ạ! (ra về)' },
        { who: 'Câu 3', voice: 'zh-nu', text: '{谢谢|xièxie}{您|nín}！', ro: 'Xièxie nín!', vi: 'Cảm ơn ông/bà ạ!' },
        { who: 'Câu 4', voice: 'zh-nam', text: '{早上|zǎoshang}{好|hǎo}！', ro: 'Zǎoshang hǎo!', vi: 'Chào buổi sáng!' },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-nghe-q1',
      title: 'Câu hỏi bài nghe 1',
      items: [
        m('Câu 1 phù hợp tình huống nào?', ['Một người nhận quà', 'Một người va vào người khác', 'Hai người gặp nhau buổi sáng', 'Học sinh ra về'], 1, '对不起 — xin lỗi khi làm phiền/va phải người khác.'),
        m('Câu 2 phù hợp tình huống nào?', ['Học sinh chào cô giáo khi tan học', 'Học sinh xin lỗi cô giáo', 'Học sinh cảm ơn cô giáo', 'Cô giáo chào cả lớp'], 0, '老师，再见 — chào tạm biệt cô giáo.'),
        m('Câu 3: người nói đang làm gì?', ['Xin lỗi một bạn nhỏ', 'Cảm ơn một người lớn tuổi', 'Chào tạm biệt', 'Hỏi thăm sức khoẻ'], 1, '谢谢您 — cảm ơn, dùng 您 với người lớn tuổi.'),
        m('Câu 4 được nói vào lúc nào?', ['Buổi sáng', 'Buổi tối', 'Lúc chia tay', 'Lúc xin lỗi'], 0, '早上好 — chào buổi sáng.'),
      ],
    },

    { t: 'h', text: 'Bài nghe 2 — Hai câu hội thoại' },
    {
      t: 'listen',
      id: 'b1-nghe-2',
      title: 'Ba cặp hội thoại ngắn',
      note: 'Mỗi cặp: một người nói, người kia đáp. Chú ý câu ĐÁP.',
      lines: [
        { who: 'Cặp 1 — Nữ', voice: 'zh-nu', text: '{谢谢|xièxie}{你|nǐ}！', ro: 'Xièxie nǐ!', vi: 'Cảm ơn bạn!' },
        { who: 'Cặp 1 — Nam', voice: 'zh-nam', text: '{不客气|bú kèqi}。', ro: 'Bú kèqi.', vi: 'Không có gì.' },
        { who: 'Cặp 2 — Nam', voice: 'zh-nam', text: '{对不起|duìbuqǐ}！', ro: 'Duìbuqǐ!', vi: 'Xin lỗi!' },
        { who: 'Cặp 2 — Nữ', voice: 'zh-nu', text: '{没关系|méi guānxi}。', ro: 'Méi guānxi.', vi: 'Không sao.' },
        { who: 'Cặp 3 — Nữ', voice: 'zh-nu', text: '{你|nǐ}{冷|lěng}{吗|ma}？', ro: 'Nǐ lěng ma?', vi: 'Bạn có lạnh không?' },
        { who: 'Cặp 3 — Nam', voice: 'zh-nam', text: '{我|wǒ}{不|bù}{冷|lěng}，{我|wǒ}{很|hěn}{热|rè}。', ro: 'Wǒ bù lěng, wǒ hěn rè.', vi: 'Mình không lạnh, mình nóng lắm.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-nghe-q2',
      title: 'Câu hỏi bài nghe 2',
      items: [
        m('Cặp 1: chuyện gì xảy ra?', ['Người nữ xin lỗi, người nam tha lỗi', 'Người nữ cảm ơn, người nam đáp "không có gì"', 'Hai người chào tạm biệt', 'Hai người chào buổi sáng'], 1, '谢谢你 → 不客气.'),
        m('Cặp 2: người nữ đáp thế nào?', ['Không có gì (đáp lời cảm ơn)', 'Không sao (đáp lời xin lỗi)', 'Tạm biệt', 'Cảm ơn'], 1, '对不起 → 没关系.'),
        m('Cặp 3: người nam thấy thế nào?', ['Rất lạnh', 'Không lạnh, mà nóng', 'Rất vui', 'Rất bận'], 1, '我不冷，我很热 — không lạnh, nóng lắm.'),
      ],
    },

    { t: 'h', text: 'Bài nghe 3 — Ở ký túc xá' },
    {
      t: 'listen',
      id: 'b1-nghe-3',
      title: 'Lan và Vương Minh hỏi thăm bạn bè',
      lines: [
        { who: '兰兰', voice: 'zh-nu', text: '{王明|Wáng Míng}，{你好|nǐ hǎo}！{你|nǐ}{忙|máng}{吗|ma}？', ro: 'Wáng Míng, nǐ hǎo! Nǐ máng ma?', vi: 'Vương Minh, chào bạn! Bạn có bận không?' },
        { who: '王明', voice: 'zh-nam', text: '{我|wǒ}{不|bù}{忙|máng}。{你|nǐ}{忙|máng}{吗|ma}？', ro: 'Wǒ bù máng. Nǐ máng ma?', vi: 'Mình không bận. Bạn có bận không?' },
        { who: '兰兰', voice: 'zh-nu', text: '{我|wǒ}{很|hěn}{忙|máng}。{安娜|Ānnà}{好|hǎo}{吗|ma}？', ro: 'Wǒ hěn máng. Ānnà hǎo ma?', vi: 'Mình bận lắm. Anna khoẻ không?' },
        { who: '王明', voice: 'zh-nam', text: '{她|tā}{很|hěn}{好|hǎo}。{她|tā}{很|hěn}{高兴|gāoxìng}。', ro: 'Tā hěn hǎo. Tā hěn gāoxìng.', vi: 'Cô ấy khoẻ. Cô ấy vui lắm.' },
        { who: '兰兰', voice: 'zh-nu', text: '{大伟|Dàwěi}{好|hǎo}{吗|ma}？', ro: 'Dàwěi hǎo ma?', vi: 'Đại Vĩ khoẻ không?' },
        { who: '王明', voice: 'zh-nam', text: '{他|tā}{很|hěn}{冷|lěng}！', ro: 'Tā hěn lěng!', vi: 'Cậu ấy lạnh lắm!' },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-nghe-q3',
      title: 'Câu hỏi bài nghe 3',
      items: [
        m('王明忙吗？(Vương Minh có bận không?)', ['很忙', '不忙', 'Không nói'], 1, '王明: 我不忙.'),
        m('兰兰忙吗？(Lan có bận không?)', ['很忙', '不忙', 'Không nói'], 0, '兰兰: 我很忙.'),
        m('Anna thế nào?', ['Rất bận', 'Khoẻ và vui', 'Lạnh'], 1, '她很好。她很高兴。'),
        m('Đại Vĩ thế nào?', ['Rất nóng', 'Rất lạnh', 'Rất vui'], 1, '他很冷.'),
        m('Trong bài, 他 và 她 chỉ ai?', ['他 = Anna, 她 = Đại Vĩ', '他 = Đại Vĩ, 她 = Anna', 'Cả hai là Vương Minh'], 1, '她 (nữ) = Anna; 他 (nam) = Đại Vĩ. Nghe giống nhau — phải dựa vào ngữ cảnh.'),
      ],
    },

    { t: 'h', text: 'Bài nghe 4 — Cô Lý vào lớp' },
    {
      t: 'listen',
      id: 'b1-nghe-4',
      title: 'Đầu giờ học',
      lines: [
        { who: '李老师', voice: 'zh-nu', text: '{同学们|tóngxuémen}{好|hǎo}！', ro: 'Tóngxuémen hǎo!', vi: 'Chào các em!' },
        { who: '同学们', voice: 'zh-nam', text: '{老师|lǎoshī}{好|hǎo}！', ro: 'Lǎoshī hǎo!', vi: 'Chúng em chào cô ạ!' },
        { who: '李老师', voice: 'zh-nu', text: '{你们|nǐmen}{好|hǎo}{吗|ma}？', ro: 'Nǐmen hǎo ma?', vi: 'Các em có khoẻ không?' },
        { who: '同学们', voice: 'zh-nam', text: '{我们|wǒmen}{很|hěn}{好|hǎo}！{谢谢|xièxie}{老师|lǎoshī}！', ro: 'Wǒmen hěn hǎo! Xièxie lǎoshī!', vi: 'Chúng em khoẻ ạ! Cảm ơn cô!' },
        { who: '李老师', voice: 'zh-nu', text: '{不客气|bú kèqi}。{北京|Běijīng}{很|hěn}{冷|lěng}，{你们|nǐmen}{冷|lěng}{吗|ma}？', ro: 'Bú kèqi. Běijīng hěn lěng, nǐmen lěng ma?', vi: 'Không có gì. Bắc Kinh lạnh lắm, các em có lạnh không?' },
        { who: '同学们', voice: 'zh-nam', text: '{我们|wǒmen}{不|bù}{冷|lěng}！', ro: 'Wǒmen bù lěng!', vi: 'Chúng em không lạnh ạ!' },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-nghe-q4',
      title: 'Câu hỏi bài nghe 4',
      items: [
        m('Cô Lý chào cả lớp bằng câu nào?', ['大家好', '同学们好', '你好'], 1, '同学们好！'),
        m('Các bạn học sinh thế nào?', ['很好', '不好', '很忙'], 0, '我们很好！'),
        m('Theo cô Lý, Bắc Kinh thế nào?', ['很热', '很冷', '很好'], 1, '北京很冷.'),
        m('Học sinh có lạnh không?', ['很冷', '不冷', 'Không nói'], 1, '我们不冷！'),
      ],
    },

    { t: 'h', text: 'Bài nghe 5 — Gặp nhau ở cổng trường' },
    {
      t: 'listen',
      id: 'b1-nghe-5',
      title: 'Ba người bạn và cô Lý',
      note: 'Có 4 người nói. Chú ý ai chào ai bằng câu nào (你好 / 您好 / 老师好), và ai nói 对不起.',
      lines: [
        { who: '大伟', voice: 'zh-nam', text: '{兰兰|Lánlan}，{安娜|Ānnà}，{你们|nǐmen}{好|hǎo}！', ro: 'Lánlan, Ānnà, nǐmen hǎo!', vi: 'Lan, Anna, chào hai bạn!' },
        { who: '安娜', voice: 'zh-nu', text: '{大伟|Dàwěi}，{你好|nǐ hǎo}！{你|nǐ}{冷|lěng}{吗|ma}？', ro: 'Dàwěi, nǐ hǎo! Nǐ lěng ma?', vi: 'Đại Vĩ, chào cậu! Cậu có lạnh không?' },
        { who: '大伟', voice: 'zh-nam', text: '{我|wǒ}{很|hěn}{冷|lěng}！{对不起|duìbuqǐ}，{我|wǒ}{很|hěn}{忙|máng}。{再见|zàijiàn}！', ro: 'Wǒ hěn lěng! Duìbuqǐ, wǒ hěn máng. Zàijiàn!', vi: 'Mình lạnh lắm! Xin lỗi nhé, mình đang bận. Tạm biệt!' },
        { who: '兰兰', voice: 'zh-nu', text: '{没关系|méi guānxi}。{明天|míngtiān}{见|jiàn}！', ro: 'Méi guānxi. Míngtiān jiàn!', vi: 'Không sao. Mai gặp nhé!' },
        { who: '安娜', voice: 'zh-nu', text: '{李|Lǐ}{老师|lǎoshī}，{您好|nín hǎo}！', ro: 'Lǐ lǎoshī, nín hǎo!', vi: 'Em chào cô Lý ạ!' },
        { who: '李老师', voice: 'zh-nu', text: '{你们好|nǐmen hǎo}！{你们|nǐmen}{好|hǎo}{吗|ma}？', ro: 'Nǐmen hǎo! Nǐmen hǎo ma?', vi: 'Chào các em! Các em có khoẻ không?' },
        { who: '兰兰', voice: 'zh-nu', text: '{我们|wǒmen}{很|hěn}{好|hǎo}！{谢谢|xièxie}{您|nín}！', ro: 'Wǒmen hěn hǎo! Xièxie nín!', vi: 'Chúng em khoẻ ạ! Cảm ơn cô!' },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-nghe-q5',
      title: 'Câu hỏi bài nghe 5',
      items: [
        m('Đại Vĩ chào Lan và Anna bằng câu nào?', ['你好', '你们好', '大家好'], 1, 'Chào hai người → 你们好.'),
        m('Đại Vĩ thế nào?', ['Rất lạnh và rất bận', 'Không lạnh, không bận', 'Rất vui'], 0, '我很冷！…我很忙。'),
        m('Vì sao Đại Vĩ nói 对不起?', ['Vì va vào Anna', 'Vì phải đi ngay (đang bận)', 'Vì đến muộn'], 1, '对不起，我很忙。再见！ — xin lỗi vì bận phải đi.'),
        m('Anna chào cô Lý thế nào?', ['你好', '老师再见', '您好'], 2, '李老师，您好！ — dùng 您 với cô giáo.'),
        m('Lan đáp lại cô Lý thế nào?', ['我们很好！谢谢您！', '我们不好。', '没关系。'], 0, '我们很好！谢谢您！'),
      ],
    },
  ],
};

/* ══════════════════════════ 6. NÓI ══════════════════════════ */

const NOI: Lesson = {
  id: 'b1-noi',
  kind: 'speaking',
  title: 'Luyện nói Bài 1 — chào hỏi, hỏi thăm, cảm ơn, xin lỗi',
  goal: 'Nói trôi chảy và đúng thanh 12 câu then chốt của Bài 1, tự hỏi–đáp được với giáo viên/giám khảo và với 📞 CuongMini.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Luyện nói thế nào',
      items: [
        '**Phát âm từng câu**: bấm nghe mẫu → ghi âm → máy chấm từng chữ. Chữ dưới 80 điểm: nghe lại, để ý **thanh điệu** của chữ đó.',
        'Các thanh khó của bài: **ní hǎo** (3+3), **hén hǎo**, **bú kèqi / bú rè** (不 trước thanh 4), **xièxie** (thanh nhẹ), **lǎoshī** (nửa thanh 3 + thanh 1 cao).',
        'Câu ngắn trước, câu dài sau. Danh sách này cũng là bộ câu cho 📞 **CuongMini** (gọi gia sư) trong bài.',
        'Cuối bài: trả lời 5 câu hỏi của giám khảo bằng **câu đầy đủ** (S + 很 + Adj), không chỉ một chữ.',
      ],
    },
    {
      t: 'phatam',
      id: 'b1-noi-phat-am',
      title: '12 câu then chốt — ngắn đến dài',
      note: 'Pinyin ghi theo từ điển; khi đọc nhớ biến điệu 3+3 (你好 → ní hǎo, 很好 → hén hǎo). Mỗi câu đọc 3 lần: chậm → bình thường → không nhìn pinyin.',
      items: [
        { text: '{你好|nǐ hǎo}！', ipa: 'Nǐ hǎo!', vi: 'Xin chào! — đọc ní hǎo' },
        { text: '{您好|nín hǎo}！', ipa: 'Nín hǎo!', vi: 'Xin chào (lịch sự)! — 您 thanh 2' },
        { text: '{谢谢|xièxie}！', ipa: 'Xièxie!', vi: 'Cảm ơn! — chữ sau nhẹ' },
        { text: '{不客气|bú kèqi}。', ipa: 'Bú kèqi.', vi: 'Không có gì. — 不 đọc bú' },
        { text: '{对不起|duìbuqǐ}！', ipa: 'Duìbuqǐ!', vi: 'Xin lỗi! — 不 ở giữa nhẹ' },
        { text: '{没关系|méi guānxi}。', ipa: 'Méi guānxi.', vi: 'Không sao.' },
        { text: '{老师|lǎoshī}{好|hǎo}！', ipa: 'Lǎoshī hǎo!', vi: 'Em chào thầy/cô! — 老 trầm, 师 cao' },
        { text: '{你|nǐ}{好|hǎo}{吗|ma}？', ipa: 'Nǐ hǎo ma?', vi: 'Bạn khoẻ không? — ní hǎo ma' },
        { text: '{我|wǒ}{很|hěn}{好|hǎo}，{谢谢|xièxie}！', ipa: 'Wǒ hěn hǎo, xièxie!', vi: 'Tôi khoẻ, cảm ơn! — wǒ hén hǎo' },
        { text: '{我|wǒ}{不|bú}{热|rè}，{我|wǒ}{很|hěn}{冷|lěng}。', ipa: 'Wǒ bú rè, wǒ hěn lěng.', vi: 'Tôi không nóng, tôi lạnh lắm. — bú rè' },
        { text: '{老师|lǎoshī}，{谢谢|xièxie}{您|nín}！{明天|míngtiān}{见|jiàn}！', ipa: 'Lǎoshī, xièxie nín! Míngtiān jiàn!', vi: 'Em cảm ơn cô! Mai gặp cô ạ!' },
        { text: '{你好|nǐ hǎo}！{很|hěn}{高兴|gāoxìng}{认识|rènshi}{你|nǐ}！', ipa: 'Nǐ hǎo! Hěn gāoxìng rènshi nǐ!', vi: 'Chào bạn! Rất vui được làm quen với bạn!' },
      ],
    },

    { t: 'h', text: 'Hỏi — đáp mẫu với giám khảo' },
    {
      t: 'p',
      text: 'Kỳ thi nói **HSKK sơ cấp** (thi nói đi kèm HSK 1–2) có phần **nghe câu hỏi rồi trả lời**. Giám khảo hỏi chậm, ngắn; bạn trả lời bằng **câu đầy đủ**. Dưới đây là đoạn mẫu chỉ dùng từ Bài 1.',
    },
    {
      t: 'dialogue',
      title: 'Giám khảo ↔ thí sinh',
      lines: [
        { who: 'Giám khảo', role: 'examiner', text: '{你好|nǐ hǎo}！', ro: 'Nǐ hǎo!', vi: 'Chào em!' },
        { who: 'Thí sinh', role: 'candidate', text: '{老师|lǎoshī}，{您好|nín hǎo}！', ro: 'Lǎoshī, nín hǎo!', vi: 'Em chào thầy ạ!' },
        { who: 'Giám khảo', role: 'examiner', text: '{你|nǐ}{好|hǎo}{吗|ma}？', ro: 'Nǐ hǎo ma?', vi: 'Em khoẻ không?' },
        { who: 'Thí sinh', role: 'candidate', text: '{我|wǒ}{很|hěn}{好|hǎo}，{谢谢|xièxie}{老师|lǎoshī}！', ro: 'Wǒ hěn hǎo, xièxie lǎoshī!', vi: 'Em khoẻ ạ, cảm ơn thầy!' },
        { who: 'Giám khảo', role: 'examiner', text: '{你|nǐ}{忙|máng}{吗|ma}？', ro: 'Nǐ máng ma?', vi: 'Em có bận không?' },
        { who: 'Thí sinh', role: 'candidate', text: '{我|wǒ}{很|hěn}{忙|máng}。', ro: 'Wǒ hěn máng.', vi: 'Em bận lắm ạ.' },
        { who: 'Giám khảo', role: 'examiner', text: '{你|nǐ}{冷|lěng}{吗|ma}？', ro: 'Nǐ lěng ma?', vi: 'Em có lạnh không?' },
        { who: 'Thí sinh', role: 'candidate', text: '{我|wǒ}{不|bù}{冷|lěng}。', ro: 'Wǒ bù lěng.', vi: 'Em không lạnh ạ.' },
        { who: 'Giám khảo', role: 'examiner', text: '{好|hǎo}，{谢谢|xièxie}{你|nǐ}。{再见|zàijiàn}！', ro: 'Hǎo, xièxie nǐ. Zàijiàn!', vi: 'Được rồi, cảm ơn em. Chào em!' },
        { who: 'Thí sinh', role: 'candidate', text: '{不客气|bú kèqi}。{老师|lǎoshī}{再见|zàijiàn}！', ro: 'Bú kèqi. Lǎoshī zàijiàn!', vi: 'Không có gì ạ. Em chào thầy!' },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo để không mất điểm',
      items: [
        'Trả lời **cả câu**: hỏi 你忙吗 → đáp **我很忙 / 我不忙**, không chỉ "忙" hay "不".',
        'Câu hỏi có 吗 thì **câu trả lời không có 吗** — người mới hay lặp lại nguyên câu hỏi: ~~我忙吗~~.',
        'Nghe không rõ? Được phép xin nhắc lại — học ở bài sau (请再说一遍). Trong lúc chờ, **đừng im lặng quá lâu**.',
        'Kết thúc luôn **chào lại**: 老师再见 / 谢谢老师. Lễ phép là một phần ấn tượng của giám khảo.',
      ],
    },

    { t: 'h', text: 'Đến lượt bạn' },
    {
      t: 'p',
      text: 'Năm câu hỏi dưới đây sẽ được đọc lên (bấm vào câu để nghe). Ghi âm câu trả lời rồi nghe lại, so với câu mẫu ở bảng. Pinyin và nghĩa của câu hỏi:',
    },
    {
      t: 'examples',
      items: [
        { en: '{你好|nǐ hǎo}！', ro: 'Nǐ hǎo!', vi: 'Chào bạn! → đáp: 你好！/ 老师好！' },
        { en: '{你|nǐ}{好|hǎo}{吗|ma}？', ro: 'Nǐ hǎo ma?', vi: 'Bạn khoẻ không? → 我很好，谢谢！' },
        { en: '{你|nǐ}{忙|máng}{吗|ma}？', ro: 'Nǐ máng ma?', vi: 'Bạn có bận không? → 我很忙。/ 我不忙。' },
        { en: '{你|nǐ}{冷|lěng}{吗|ma}？', ro: 'Nǐ lěng ma?', vi: 'Bạn có lạnh không? → 我很冷。/ 我不冷。' },
        { en: '{谢谢|xièxie}{你|nǐ}！', ro: 'Xièxie nǐ!', vi: 'Cảm ơn bạn! → 不客气。' },
      ],
    },
    {
      t: 'speak',
      id: 'b1-noi-ghi-am',
      part: '1',
      questions: ['你好！', '你好吗？', '你忙吗？', '你冷吗？', '谢谢你！'],
    },
  ],
};

/* ══════════════════════════ 7. BÀI TẬP ══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b1-bai-tap',
  kind: 'homework',
  title: 'Bài tập Bài 1 — dịch, pinyin, trắc nghiệm, ghép câu, đọc hiểu',
  goal: 'Tự kiểm tra toàn bộ Bài 1: viết được câu chào, hỏi thăm, cảm ơn, xin lỗi bằng chữ Hán; viết đúng pinyin; đọc hiểu một đoạn ngắn.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Trước khi làm bài',
      items: [
        'Ô dịch Việt → Trung: gõ **chữ Hán** (bật bàn phím Pinyin — gõ "nihao" rồi chọn 你好). Dấu câu có hay không đều được chấm đúng.',
        'Ô pinyin: gõ **có dấu** (gāoxìng) hoặc **dạng số** (gao1xing4; thanh nhẹ = 5 hoặc bỏ số).',
        'Công thức cần nhớ: **S + 很 + Adj** · **câu kể + 吗？** · **S + 不 + Adj** · **(người) + 好！** · **谢谢 + người**.',
        'Đạt ≥ 80% → sang Bài 2. Dưới 70% → xem lại phần Ngữ pháp và Từ vựng.',
      ],
    },
    { t: 'h', text: '1. Dịch sang tiếng Trung (viết chữ Hán)' },
    {
      t: 'quiz',
      id: 'b1-bt-dich',
      title: 'Dịch Việt → Trung',
      kind: 'translate',
      grammar: 'S + 很 + Adj · câu kể + 吗 · S + 不 + Adj · (người) + 好 · 谢谢 + người · thời gian + 见',
      items: [
        { q: 'Chào bạn!', answers: ['你好！'], hint: '你 · 好' },
        { q: 'Em chào cô ạ! (chào cô giáo)', answers: ['老师好！', '老师，您好！', '老师您好！'], hint: '老师 · 好 (hoặc 您好)' },
        { q: 'Bạn khoẻ không?', answers: ['你好吗？', '您好吗？'], hint: '你 · 好 · 吗' },
        { q: 'Tôi khoẻ, cảm ơn!', answers: ['我很好，谢谢！', '我很好，谢谢你！', '我很好，谢谢您！'], hint: '我 · 很 · 好 · 谢谢' },
        { q: 'Cô ấy rất vui.', answers: ['她很高兴。'], hint: '她 · 很 · 高兴' },
        { q: 'Anh ấy không bận.', answers: ['他不忙。'], hint: '他 · 不 · 忙' },
        { q: 'Các bạn có lạnh không?', answers: ['你们冷吗？'], hint: '你们 · 冷 · 吗' },
        { q: 'Chúng tôi không nóng.', answers: ['我们不热。'], hint: '我们 · 不 · 热' },
        { q: 'Xin lỗi! — Không sao.', answers: ['对不起！没关系。', '对不起！——没关系。'], hint: '对不起 · 没关系' },
        { q: 'Cảm ơn mọi người!', answers: ['谢谢大家！'], hint: '谢谢 · 大家' },
        { q: 'Mai gặp nhé!', answers: ['明天见！'], hint: '明天 · 见' },
        { q: 'Bắc Kinh rất lạnh.', answers: ['北京很冷。'], hint: '北京 · 很 · 冷' },
        { q: 'Họ (toàn nữ) rất bận.', answers: ['她们很忙。'], hint: '她们 · 很 · 忙' },
        { q: 'Cảm ơn! — Không có gì.', answers: ['谢谢！不客气。', '谢谢！——不客气。'], hint: '谢谢 · 不客气' },
      ],
    },

    { t: 'h', text: '2. Viết pinyin' },
    {
      t: 'quiz',
      id: 'b1-bt-pinyin',
      title: 'Viết pinyin có dấu thanh (hoặc dạng số)',
      kind: 'fill',
      grammar: 'Âm tiết trong một từ viết liền · thanh nhẹ không dấu · 不 trước thanh 4 ghi bú',
      items: [
        { q: '高兴 (vui)', answers: py('gāoxìng', 'gao1xing4', 'gāo xìng', 'gao1 xing4'), hint: '1 + 4' },
        { q: '同学 (bạn học)', answers: py('tóngxué', 'tong2xue2', 'tóng xué', 'tong2 xue2'), hint: '2 + 2' },
        { q: '明天 (ngày mai)', answers: py('míngtiān', 'ming2tian1', 'míng tiān', 'ming2 tian1'), hint: '2 + 1' },
        { q: '大家 (mọi người)', answers: py('dàjiā', 'da4jia1', 'dà jiā', 'da4 jia1'), hint: '4 + 1' },
        { q: '我们 (chúng tôi)', answers: py('wǒmen', 'wo3men', 'wo3men5', 'wǒ men', 'wo3 men', 'wo3 men5'), hint: '们 thanh nhẹ' },
        { q: '不热 (không nóng)', answers: py('bú rè', 'bu2 re4'), hint: '不 trước thanh 4' },
        { q: '早上 (buổi sáng)', answers: py('zǎoshang', 'zao3shang', 'zao3shang5', 'zǎo shang', 'zao3 shang', 'zao3 shang5'), hint: '上 thanh nhẹ' },
        { q: '认识 (quen biết)', answers: py('rènshi', 'ren4shi', 'ren4shi5', 'rèn shi', 'ren4 shi', 'ren4 shi5'), hint: '识 thanh nhẹ' },
      ],
    },

    { t: 'h', text: '3. Trắc nghiệm tổng hợp' },
    {
      t: 'mcq',
      id: 'b1-bt-trac-nghiem',
      title: 'Chọn câu đúng / phù hợp',
      items: [
        m('Gặp bạn cùng lớp lúc 7 giờ sáng, bạn nói:', ['再见！', '早上好！', '对不起！', '不客气！'], 1, '早上好 — chào buổi sáng.'),
        m('"Cô ấy không lạnh." là:', ['她很冷。', '她不冷。', '他不冷。', '她冷吗？'], 1, '她 (nữ) + 不 + 冷.'),
        m('Câu nào dùng **đúng** ngữ pháp?', ['我是很忙。', '我忙很。', '我很忙。', '很我忙。'], 2, 'S + 很 + Adj.'),
        m('你们好吗？— Câu trả lời phù hợp:', ['我们很好。', '你们很好。', '我们好吗。', '不客气。'], 0, 'Được hỏi "các bạn" → đáp "chúng tôi": 我们很好.'),
        m('Bà chủ quán đưa đồ cho bạn. Bạn nói:', ['没关系！', '谢谢您！', '对不起！', '你们好！'], 1, 'Cảm ơn người lớn tuổi: 谢谢您.'),
        m('Người kia đáp 不客气. Trước đó bạn đã nói gì?', ['对不起', '谢谢', '再见', '你好吗'], 1, '不客气 là lời đáp cho 谢谢.'),
        m('Đọc đúng 你好吗:', ['nǐ hǎo mǎ', 'ní hǎo ma', 'nǐ háo ma', 'nì hǎo ma'], 1, '3+3 → ní hǎo; 吗 thanh nhẹ.'),
        m('Chọn đại từ đúng: 安娜很忙，（　）不高兴。', ['他', '她', '你', '您'], 1, 'Anna là nữ → 她.'),
        m('Chọn đúng: 王明和大伟 (Vương Minh và Đại Vĩ) = （　）', ['她们', '他们', '我们', '你们'], 1, 'Hai bạn nam → 他们.'),
        m('Câu nào **lịch sự nhất** khi chào một cụ già?', ['你好！', '您好！', '你们好！', '早！'], 1, '您 — kính trọng.'),
        m('"Tôi không nóng" đọc là:', ['Wǒ bù rè.', 'Wǒ bú rè.', 'Wǒ bǔ rè.', 'Wǒ bū rè.'], 1, '热 thanh 4 → 不 đọc bú.'),
        m('Khi rời lớp, chào cô giáo:', ['老师好！', '老师再见！', '老师，对不起！', '老师，不客气！'], 1, '再见 — tạm biệt.'),
      ],
    },

    { t: 'h', text: '4. Ghép câu' },
    {
      t: 'build',
      id: 'b1-bt-ghep',
      title: 'Ghép thành câu đúng',
      items: [
        { vi: 'Chào mọi người!', chips: ['{大家|dàjiā}', '{好|hǎo}', '{吗|ma}'], answer: ['{大家|dàjiā}', '{好|hǎo}'], ro: 'Dàjiā hǎo!' },
        { vi: 'Anh ấy rất vui.', chips: ['{他|tā}', '{很|hěn}', '{高兴|gāoxìng}', '{她|tā}'], answer: ['{他|tā}', '{很|hěn}', '{高兴|gāoxìng}'], ro: 'Tā hěn gāoxìng.' },
        { vi: 'Cô giáo có bận không?', chips: ['{老师|lǎoshī}', '{忙|máng}', '{吗|ma}', '{不|bù}'], answer: ['{老师|lǎoshī}', '{忙|máng}', '{吗|ma}'], ro: 'Lǎoshī máng ma?' },
        { vi: 'Chúng tôi rất lạnh.', chips: ['{我们|wǒmen}', '{很|hěn}', '{冷|lěng}', '{热|rè}'], answer: ['{我们|wǒmen}', '{很|hěn}', '{冷|lěng}'], ro: 'Wǒmen hěn lěng.' },
        { vi: 'Cảm ơn ngài!', chips: ['{谢谢|xièxie}', '{您|nín}', '{你们|nǐmen}'], answer: ['{谢谢|xièxie}', '{您|nín}'], ro: 'Xièxie nín!' },
        { vi: 'Họ (toàn nữ) không bận.', chips: ['{她们|tāmen}', '{不|bù}', '{忙|máng}', '{他们|tāmen}'], answer: ['{她们|tāmen}', '{不|bù}', '{忙|máng}'], ro: 'Tāmen bù máng.' },
        { vi: 'Rất vui được làm quen với bạn!', chips: ['{很|hěn}', '{高兴|gāoxìng}', '{认识|rènshi}', '{你|nǐ}', '{吗|ma}'], answer: ['{很|hěn}', '{高兴|gāoxìng}', '{认识|rènshi}', '{你|nǐ}'], ro: 'Hěn gāoxìng rènshi nǐ!' },
        { vi: 'Thưa cô, mai gặp cô ạ!', chips: ['{老师|lǎoshī}', '{明天|míngtiān}', '{见|jiàn}', '{好|hǎo}'], answer: ['{老师|lǎoshī}', '{明天|míngtiān}', '{见|jiàn}'], ro: 'Lǎoshī, míngtiān jiàn!' },
      ],
    },

    { t: 'h', text: '4b. Sửa câu sai' },
    {
      t: 'quiz',
      id: 'b1-bt-sua-cau',
      title: 'Mỗi câu có một lỗi — viết lại câu đúng (chữ Hán)',
      kind: 'translate',
      grammar: 'S + 很 + Adj (không 是) · 吗 ở cuối · người + 好 · 她 cho nữ · 谢谢 → 不客气, 对不起 → 没关系',
      items: [
        { q: '~~我是很好。~~ (Tôi khoẻ.)', answers: ['我很好。'], hint: 'Bỏ 是 trước tính từ' },
        { q: '~~吗你忙？~~ (Bạn có bận không?)', answers: ['你忙吗？'], hint: '吗 đặt cuối câu' },
        { q: '~~好老师！~~ (Em chào cô!)', answers: ['老师好！'], hint: 'Người được chào đứng trước 好' },
        { q: '~~我好很。~~ (Tôi khoẻ.)', answers: ['我很好。'], hint: '很 đứng trước tính từ' },
        { q: '~~安娜很忙，他不高兴。~~ (Anna bận, cô ấy không vui.)', answers: ['安娜很忙，她不高兴。'], hint: 'Anna là nữ' },
        { q: '~~谢谢！— 没关系。~~ (Cảm ơn! — Không có gì.)', answers: ['谢谢！不客气。', '谢谢！——不客气。'], hint: 'Đáp lời cảm ơn' },
        { q: '~~您们好！~~ (Chào các thầy cô / mọi người!)', answers: ['大家好！', '老师们好！', '你们好！'], hint: 'Không dùng 您们' },
        { q: '~~你冷吗？— 我冷吗。~~ (Bạn có lạnh không? — Tôi lạnh lắm.) Viết lại câu trả lời.', answers: ['我很冷。'], hint: 'Câu trả lời không có 吗; S + 很 + Adj' },
      ],
    },

    { t: 'h', text: '5. Đọc hiểu' },
    {
      t: 'passage',
      title: 'Nhật ký của Lan — một ngày ở Bắc Kinh',
      intro: 'Lan viết vài dòng nhật ký bằng tiếng Trung, chỉ dùng từ của Bài 1. Đọc to một lượt (tắt pinyin nếu được), rồi trả lời câu hỏi.',
      paras: [
        { label: 'A', text: '{早上|zǎoshang}，{我|wǒ}{很|hěn}{冷|lěng}。{北京|Běijīng}{很|hěn}{冷|lěng}！{王明|Wáng Míng}{不|bù}{冷|lěng}，{他|tā}{很|hěn}{好|hǎo}。' },
        { label: 'B', text: '{李|Lǐ}{老师|lǎoshī}：“{同学们|tóngxuémen}{好|hǎo}！{你们|nǐmen}{好|hǎo}{吗|ma}？” {我们|wǒmen}：“{我们|wǒmen}{很|hěn}{好|hǎo}！{谢谢|xièxie}{老师|lǎoshī}！”' },
        { label: 'C', text: '{安娜|Ānnà}{很|hěn}{忙|máng}，{她|tā}{不|bù}{高兴|gāoxìng}。{大伟|Dàwěi}{很|hěn}{高兴|gāoxìng}。{我|wǒ}{很|hěn}{高兴|gāoxìng}！{明天|míngtiān}{见|jiàn}！' },
      ],
    },
    {
      t: 'mcq',
      id: 'b1-bt-doc-hieu',
      title: 'Câu hỏi đọc hiểu',
      items: [
        m('Buổi sáng Lan thấy thế nào?', ['Rất nóng', 'Rất lạnh', 'Rất bận'], 1, 'Đoạn A: 早上，我很冷。'),
        m('Vương Minh có lạnh không?', ['Có, rất lạnh', 'Không lạnh', 'Không nói'], 1, 'Đoạn A: 王明不冷。'),
        m('Cô Lý hỏi cả lớp câu gì?', ['Các em có bận không?', 'Các em có khoẻ không?', 'Các em có lạnh không?'], 1, 'Đoạn B: 你们好吗？'),
        m('Anna thế nào?', ['Bận và không vui', 'Vui và không bận', 'Lạnh'], 0, 'Đoạn C: 安娜很忙，她不高兴。'),
        m('Ai rất vui?', ['Anna', 'Đại Vĩ và Lan', 'Chỉ cô Lý'], 1, 'Đoạn C: 大伟很高兴。我很高兴！'),
      ],
    },
    {
      t: 'table',
      caption: 'Tự đánh giá Bài 1',
      head: ['Kết quả', 'Ý nghĩa', 'Làm gì tiếp'],
      rows: [
        ['≥ 80%', 'Nắm chắc Bài 1', 'Sang Bài 2 (你叫什么名字 — tên, 是, câu hỏi 吗). Gọi 📞 CuongMini ôn 12 câu phát âm mỗi ngày.'],
        ['70–79%', 'Còn vài chỗ hổng', 'Làm lại phần sai; đọc lại hội thoại 3 tình huống.'],
        ['< 70%', 'Chưa vững', 'Học lại Từ vựng + Ngữ pháp (nhất là 很 và 吗), rồi làm lại toàn bộ bài tập.'],
      ],
    },
  ],
};

export const BAI_1: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, HAN_TU, NGHE, NOI, BAI_TAP];
