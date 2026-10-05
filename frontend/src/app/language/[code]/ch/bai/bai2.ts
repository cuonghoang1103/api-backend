/**
 * Bài 2 — HSK 1 · 你叫什么名字: hỏi tên, hỏi họ, 是, câu hỏi 吗 (khoá CH).
 *
 * Phạm vi: S + 叫 + tên, S + 姓 + họ, 您贵姓, câu "S + 是 + N", đại từ nghi vấn 什么 / 谁
 * (đặt đúng chỗ câu trả lời, KHÔNG thêm 吗), mở rộng câu hỏi 吗 sang câu có 是 và động từ,
 * 认识 + người, 请问. Phủ định 不是 chỉ dùng sơ khởi để trả lời — Bài 3 học kỹ 不, 也, 呢.
 * Chưa dùng 也/呢 (Bài 3), 这/那 (Bài 8); 的 (Bài 4) và 吧 (Bài 17) chỉ xuất hiện để nghe hiểu, có chú thích. Từ ngoài HSK 1 ghi "(từ mở rộng)".
 *
 * Quy ước pinyin như Bài 0–1: thanh 3 + thanh 3 ghi theo từ điển (你好 nǐ hǎo, đọc ní hǎo);
 * 不 ghi theo cách đọc (不是 bú shì, 不认识 bú rènshi, 不忙 bù máng). 学生 viết xuésheng.
 * Nhân vật: 兰兰 Lan (a, nữ) · 王明 Vương Minh (b, nam) · 李老师 cô Lý (c, nữ) ·
 * 大伟 Đại Vĩ (b, nam) · 安娜 Anna (c, nữ) · 老板 bà chủ quầy (c, nữ).
 * Tên đầy đủ của Lan (dùng từ bài này): 阮氏兰 Ruǎn Shì Lán = Nguyễn Thị Lan.
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
  id: 'b2-hoi-thoai',
  kind: 'conversation',
  title: 'Hội thoại: 你叫什么名字 — Hỏi tên, hỏi họ, giới thiệu mình là ai',
  goal: 'Hỏi và nói được tên, họ của mình và người khác (lịch sự lẫn thân mật), nói mình là ai (学生, 老师…), hỏi "người kia là ai?" và làm quen đúng phép.',
  minutes: 35,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Bài 2 học gì',
      items: [
        'Hỏi tên: **你叫什么名字？** → **我叫兰兰。** · Hỏi họ lịch sự: **您贵姓？** → **我姓李。**',
        'Nói "là": **S + 是 + danh từ** — 我是学生, 她是老师. (Tính từ thì KHÔNG dùng 是 — đã học ở Bài 1.)',
        'Hỏi "ai?", "gì?": **谁 / 什么** đứng ĐÚNG CHỖ câu trả lời, và **không thêm 吗** — 他是谁？他叫什么名字？',
        'Câu hỏi 吗 giờ dùng được cả với 是 và động từ: **你是学生吗？— 是，我是学生。** · **你认识他吗？— 认识。**',
        'Mở lời lịch sự: **请问，…** (xin hỏi…) · Làm quen: **很高兴认识你！**',
      ],
    },
    { t: 'h', text: 'Học xong Bài 2 bạn làm được gì' },
    {
      t: 'table',
      head: ['Tình huống', 'Bạn làm được', 'Câu then chốt'],
      rows: [
        ['1. Buổi học đầu tiên', 'Hỏi tên bạn mới, nói tên mình, nói mình là sinh viên, làm quen', '你叫什么名字？我叫兰兰。我是学生。'],
        ['2. Gặp cô giáo ở hành lang', 'Hỏi họ một cách lịch sự, xác nhận người đó có phải giáo viên không', '请问，您贵姓？我姓李。您是老师吗？'],
        ['3. Ở căng tin', 'Hỏi "người kia là ai?", "bạn có quen anh ấy không?", giới thiệu bạn bè', '他是谁？他是大伟。你认识他吗？'],
      ],
    },
    {
      t: 'p',
      text: 'Cách học phần này: đọc **bối cảnh** → bấm nghe cả đoạn → bấm từng câu, đọc to theo 3 lần → tắt pinyin và tự đọc lại. Ở bài này có nhiều **tên riêng** — đừng ngại, tên riêng cũng đọc theo đúng thanh điệu như mọi chữ khác.',
    },
    {
      t: 'note',
      title: 'Ôn nhanh Bài 1 — dùng lại trong bài này',
      items: [
        '**你好 / 您好 / 老师好** — chào; **你好吗？— 我很好** — hỏi thăm.',
        '**S + 很 + tính từ** — 我很高兴. **S + 不 + tính từ** — 我不忙.',
        '**câu kể + 吗？** — 你忙吗？ Bài này mở rộng: 你**是**学生吗？',
        '**很高兴认识你！** — câu làm quen đã gặp ở Bài 1, giờ học kỹ động từ **认识** (quen biết).',
      ],
    },

    /* ── Tình huống 1 ── */
    { t: 'h', text: 'Tình huống 1 — Buổi học đầu tiên' },
    {
      t: 'p',
      text: '**Bối cảnh.** Ngày đầu tiên của khoá học. Lan vào lớp sớm, ngồi cạnh một bạn nam người Trung Quốc mà cô chưa quen. Hai người chào nhau, hỏi tên nhau. Tên đầy đủ của Lan là **Nguyễn Thị Lan** — đọc sang tiếng Trung theo âm Hán Việt thành **阮氏兰 Ruǎn Shì Lán**.',
    },
    {
      t: 'dialogue',
      title: '你叫什么名字？— Bạn tên là gì?',
      lines: [
        { who: '王明 Vương Minh', role: 'b', text: '{你好|nǐ hǎo}！', ro: 'Nǐ hǎo!', vi: 'Chào bạn!' },
        { who: '兰兰 Lan', role: 'a', text: '{你好|nǐ hǎo}！', ro: 'Nǐ hǎo!', vi: 'Chào bạn!' },
        { who: '王明 Vương Minh', role: 'b', text: '{你|nǐ}{叫|jiào}{什么|shénme}{名字|míngzi}？', ro: 'Nǐ jiào shénme míngzi?', vi: 'Bạn tên là gì?' },
        { who: '兰兰 Lan', role: 'a', text: '{我|wǒ}{叫|jiào}{阮氏兰|Ruǎn Shì Lán}。{你|nǐ}{叫|jiào}{什么|shénme}{名字|míngzi}？', ro: 'Wǒ jiào Ruǎn Shì Lán. Nǐ jiào shénme míngzi?', vi: 'Mình tên là Nguyễn Thị Lan. Bạn tên là gì?' },
        { who: '王明 Vương Minh', role: 'b', text: '{我|wǒ}{姓|xìng}{王|Wáng}，{叫|jiào}{王明|Wáng Míng}。', ro: 'Wǒ xìng Wáng, jiào Wáng Míng.', vi: 'Mình họ Vương, tên là Vương Minh.' },
        { who: '兰兰 Lan', role: 'a', text: '{王明|Wáng Míng}，{你|nǐ}{是|shì}{学生|xuésheng}{吗|ma}？', ro: 'Wáng Míng, nǐ shì xuésheng ma?', vi: 'Vương Minh, bạn là sinh viên à?' },
        { who: '王明 Vương Minh', role: 'b', text: '{是|shì}，{我|wǒ}{是|shì}{学生|xuésheng}。{你|nǐ}{是|shì}{留学生|liúxuéshēng}{吗|ma}？', ro: 'Shì, wǒ shì xuésheng. Nǐ shì liúxuéshēng ma?', vi: 'Ừ, mình là sinh viên. Bạn là du học sinh à?' },
        { who: '兰兰 Lan', role: 'a', text: '{对|duì}，{我|wǒ}{是|shì}{留学生|liúxuéshēng}。{叫|jiào}{我|wǒ}{兰兰|Lánlan}{吧|ba}！', ro: 'Duì, wǒ shì liúxuéshēng. Jiào wǒ Lánlan ba!', vi: 'Đúng rồi, mình là du học sinh. Cứ gọi mình là Lan Lan nhé!' },
        { who: '王明 Vương Minh', role: 'b', text: '{兰兰|Lánlan}，{很|hěn}{高兴|gāoxìng}{认识|rènshi}{你|nǐ}！', ro: 'Lánlan, hěn gāoxìng rènshi nǐ!', vi: 'Lan Lan, rất vui được làm quen với bạn!' },
        { who: '兰兰 Lan', role: 'a', text: '{认识|rènshi}{你|nǐ}，{我|wǒ}{很|hěn}{高兴|gāoxìng}！', ro: 'Rènshi nǐ, wǒ hěn gāoxìng!', vi: 'Quen được bạn, mình vui lắm!' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong tình huống 1',
      items: [
        '**你叫什么名字？** — từng chữ: bạn + gọi là + gì + tên → "bạn tên gì?". Câu trả lời đặt tên vào đúng chỗ của 什么名字: **我叫阮氏兰。**',
        '**我姓王，叫王明。** — nói họ trước (姓), rồi nói tên đầy đủ (叫). Người Trung Quốc hay nói đủ cả họ lẫn tên sau 叫: **叫王明**, ít khi chỉ nói ~~叫明~~.',
        '**你是学生吗？** — 是 nối hai danh từ: 你 = 学生. Thêm 吗 cuối câu thành câu hỏi, đúng như Bài 1.',
        'Trả lời câu hỏi 是…吗: nói **是** (vâng/phải) hoặc **对** (đúng) rồi nhắc lại cả câu: **是，我是学生。**',
        '**留学生** liúxuéshēng — du học sinh (LƯU HỌC SINH, từ mở rộng): sinh viên nước ngoài sang học. Lan là 留学生 ở Bắc Kinh.',
        '**叫我兰兰吧！** — ở đây 叫 nghĩa là "gọi": "gọi tôi là Lan Lan nhé". 吧 ba (thanh nhẹ) làm câu mềm như "nhé" — học kỹ ở Bài 17, giờ chỉ cần nghe hiểu.',
        'Không có 也 nên Lan đáp **认识你，我很高兴！** (quen bạn, mình rất vui). Bài 3 học cách đáp tự nhiên hơn: **我也很高兴！** (mình cũng rất vui).',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{你|nǐ}{叫|jiào}{什么|shénme}{名字|míngzi}？', ro: 'Nǐ jiào shénme míngzi?', vi: 'Bạn tên là gì?' },
        { en: '{我|wǒ}{叫|jiào}{阮氏兰|Ruǎn Shì Lán}。', ro: 'Wǒ jiào Ruǎn Shì Lán.', vi: 'Tôi tên là Nguyễn Thị Lan.' },
        { en: '{我|wǒ}{姓|xìng}{王|Wáng}，{叫|jiào}{王明|Wáng Míng}。', ro: 'Wǒ xìng Wáng, jiào Wáng Míng.', vi: 'Tôi họ Vương, tên là Vương Minh.' },
        { en: '{你|nǐ}{是|shì}{学生|xuésheng}{吗|ma}？', ro: 'Nǐ shì xuésheng ma?', vi: 'Bạn là sinh viên à?' },
        { en: '{是|shì}，{我|wǒ}{是|shì}{学生|xuésheng}。', ro: 'Shì, wǒ shì xuésheng.', vi: 'Vâng, tôi là sinh viên.' },
        { en: '{很|hěn}{高兴|gāoxìng}{认识|rènshi}{你|nǐ}！', ro: 'Hěn gāoxìng rènshi nǐ!', vi: 'Rất vui được làm quen với bạn!' },
      ],
    },

    /* ── Tình huống 2 ── */
    { t: 'h', text: 'Tình huống 2 — Gặp cô giáo ở hành lang' },
    {
      t: 'p',
      text: '**Bối cảnh.** Giờ ra chơi, Lan đi tìm phòng giáo viên thì gặp một cô giáo trẻ ở hành lang. Lan chưa biết cô tên gì, cũng chưa chắc cô có phải giáo viên không — nên hỏi thật lịch sự. Hoá ra đó là cô Lý, giáo viên chủ nhiệm lớp của Lan.',
    },
    {
      t: 'dialogue',
      title: '您贵姓？— Thưa cô, cô họ gì ạ?',
      lines: [
        { who: '兰兰 Lan', role: 'a', text: '{您好|nín hǎo}！{请问|qǐngwèn}，{您|nín}{贵姓|guìxìng}？', ro: 'Nín hǎo! Qǐngwèn, nín guìxìng?', vi: 'Em chào cô ạ! Xin hỏi, cô họ gì ạ?' },
        { who: '李老师 Cô Lý', role: 'c', text: '{我|wǒ}{姓|xìng}{李|Lǐ}。', ro: 'Wǒ xìng Lǐ.', vi: 'Cô họ Lý.' },
        { who: '兰兰 Lan', role: 'a', text: '{您|nín}{是|shì}{老师|lǎoshī}{吗|ma}？', ro: 'Nín shì lǎoshī ma?', vi: 'Cô là giáo viên ạ?' },
        { who: '李老师 Cô Lý', role: 'c', text: '{是|shì}，{我|wǒ}{是|shì}{老师|lǎoshī}。{你|nǐ}{叫|jiào}{什么|shénme}{名字|míngzi}？', ro: 'Shì, wǒ shì lǎoshī. Nǐ jiào shénme míngzi?', vi: 'Ừ, cô là giáo viên. Em tên là gì?' },
        { who: '兰兰 Lan', role: 'a', text: '{我|wǒ}{叫|jiào}{阮氏兰|Ruǎn Shì Lán}。{我|wǒ}{是|shì}{您|nín}{的|de}{学生|xuésheng}！', ro: 'Wǒ jiào Ruǎn Shì Lán. Wǒ shì nín de xuésheng!', vi: 'Em tên là Nguyễn Thị Lan. Em là học trò của cô ạ!' },
        { who: '李老师 Cô Lý', role: 'c', text: '{兰兰|Lánlan}！{你好|nǐ hǎo}！{我|wǒ}{认识|rènshi}{你|nǐ}{的|de}{名字|míngzi}。', ro: 'Lánlan! Nǐ hǎo! Wǒ rènshi nǐ de míngzi.', vi: 'Lan Lan đấy à! Chào em! Cô biết tên em rồi.' },
        { who: '兰兰 Lan', role: 'a', text: '{李|Lǐ}{老师|lǎoshī}，{很|hěn}{高兴|gāoxìng}{认识|rènshi}{您|nín}！', ro: 'Lǐ lǎoshī, hěn gāoxìng rènshi nín!', vi: 'Thưa cô Lý, em rất vui được biết cô ạ!' },
        { who: '李老师 Cô Lý', role: 'c', text: '{我|wǒ}{很|hěn}{高兴|gāoxìng}。{明天|míngtiān}{见|jiàn}！', ro: 'Wǒ hěn gāoxìng. Míngtiān jiàn!', vi: 'Cô cũng rất vui. Mai gặp nhé!' },
        { who: '兰兰 Lan', role: 'a', text: '{老师|lǎoshī}{再见|zàijiàn}！', ro: 'Lǎoshī zàijiàn!', vi: 'Em chào cô ạ!' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong tình huống 2',
      items: [
        '**请问** qǐngwèn — "xin hỏi" (THỈNH VẤN). Đặt ở đầu câu khi hỏi người lạ, người lớn tuổi: lịch sự hơn hẳn hỏi thẳng.',
        '**您贵姓？** nín guìxìng — "Quý danh của ngài là gì?", hỏi **họ** một cách rất lịch sự. 贵 guì = quý. Câu trả lời **KHÔNG** lặp lại chữ 贵: ~~我贵姓李~~ → **我姓李。** (không tự khen họ mình "quý").',
        'Cô Lý chỉ nói **họ**: 我姓李. Học trò gọi cô là **李老师** — không cần biết tên riêng của cô.',
        '**我是您的学生** — "em là học trò của cô". 的 de = "của" — Bài 4 học kỹ; giờ chỉ cần hiểu cả cụm. Tương tự **你的名字** = tên của em.',
        '**我认识你的名字** — cô Lý "biết mặt chữ tên em" (vì đã thấy trong danh sách lớp). 认识 dùng cho người, chữ, đường — cái mình đã từng gặp và nhận ra được.',
        'Cô Lý đáp **我很高兴** chứ chưa nói "cô **cũng** vui" — vì 也 (cũng) để dành cho Bài 3. Trong tiếng Việt ta dịch tự nhiên là "cô cũng rất vui".',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{请问|qǐngwèn}，{您|nín}{贵姓|guìxìng}？', ro: 'Qǐngwèn, nín guìxìng?', vi: 'Xin hỏi, ông/bà/thầy/cô họ gì ạ?' },
        { en: '{我|wǒ}{姓|xìng}{李|Lǐ}。', ro: 'Wǒ xìng Lǐ.', vi: 'Tôi họ Lý.' },
        { en: '{您|nín}{是|shì}{老师|lǎoshī}{吗|ma}？', ro: 'Nín shì lǎoshī ma?', vi: 'Thầy/cô là giáo viên ạ?' },
        { en: '{是|shì}，{我|wǒ}{是|shì}{老师|lǎoshī}。', ro: 'Shì, wǒ shì lǎoshī.', vi: 'Vâng, tôi là giáo viên.' },
        { en: '{很|hěn}{高兴|gāoxìng}{认识|rènshi}{您|nín}！', ro: 'Hěn gāoxìng rènshi nín!', vi: 'Rất vui được biết ông/bà/thầy/cô!' },
      ],
    },

    /* ── Tình huống 3 ── */
    { t: 'h', text: 'Tình huống 3 — Ở căng tin: "Anh ấy là ai?"' },
    {
      t: 'p',
      text: '**Bối cảnh.** Trưa, Lan ngồi ăn với Vương Minh ở căng tin. Một bạn nam tóc vàng, rất cao bước vào và vẫy tay chào Vương Minh. Lan tò mò hỏi đó là ai. Sau đó bạn ấy đến ngồi cùng bàn, và mọi người làm quen với nhau.',
    },
    {
      t: 'dialogue',
      title: '他是谁？— Anh ấy là ai?',
      lines: [
        { who: '兰兰 Lan', role: 'a', text: '{王明|Wáng Míng}，{他|tā}{是|shì}{谁|shéi}？', ro: 'Wáng Míng, tā shì shéi?', vi: 'Vương Minh, cậu ấy là ai thế?' },
        { who: '王明 Vương Minh', role: 'b', text: '{他|tā}{是|shì}{大伟|Dàwěi}，{是|shì}{我|wǒ}{朋友|péngyou}。{你|nǐ}{认识|rènshi}{他|tā}{吗|ma}？', ro: 'Tā shì Dàwěi, shì wǒ péngyou. Nǐ rènshi tā ma?', vi: 'Cậu ấy là Đại Vĩ, bạn mình. Bạn có quen cậu ấy không?' },
        { who: '兰兰 Lan', role: 'a', text: '{不|bú}{认识|rènshi}。{他|tā}{是|shì}{老师|lǎoshī}{吗|ma}？', ro: 'Bú rènshi. Tā shì lǎoshī ma?', vi: 'Không quen. Cậu ấy là giáo viên à?' },
        { who: '王明 Vương Minh', role: 'b', text: '{不|bú}{是|shì}，{他|tā}{是|shì}{学生|xuésheng}。', ro: 'Bú shì, tā shì xuésheng.', vi: 'Không phải, cậu ấy là sinh viên.' },
        { who: '大伟 Đại Vĩ', role: 'b', text: '{王明|Wáng Míng}，{你好|nǐ hǎo}！{请问|qǐngwèn}，{你|nǐ}{叫|jiào}{什么|shénme}{名字|míngzi}？', ro: 'Wáng Míng, nǐ hǎo! Qǐngwèn, nǐ jiào shénme míngzi?', vi: 'Vương Minh, chào cậu! Cho mình hỏi, bạn tên là gì?' },
        { who: '兰兰 Lan', role: 'a', text: '{我|wǒ}{叫|jiào}{兰兰|Lánlan}。{你|nǐ}{叫|jiào}{大伟|Dàwěi}{吗|ma}？', ro: 'Wǒ jiào Lánlan. Nǐ jiào Dàwěi ma?', vi: 'Mình tên là Lan Lan. Bạn tên là Đại Vĩ à?' },
        { who: '大伟 Đại Vĩ', role: 'b', text: '{对|duì}，{我|wǒ}{叫|jiào}{大伟|Dàwěi}。{我|wǒ}{是|shì}{王明|Wáng Míng}{的|de}{朋友|péngyou}。', ro: 'Duì, wǒ jiào Dàwěi. Wǒ shì Wáng Míng de péngyou.', vi: 'Đúng, mình tên là Đại Vĩ. Mình là bạn của Vương Minh.' },
        { who: '兰兰 Lan', role: 'a', text: '{大伟|Dàwěi}，{你好|nǐ hǎo}！{很|hěn}{高兴|gāoxìng}{认识|rènshi}{你|nǐ}！', ro: 'Dàwěi, nǐ hǎo! Hěn gāoxìng rènshi nǐ!', vi: 'Đại Vĩ, chào bạn! Rất vui được làm quen với bạn!' },
        { who: '大伟 Đại Vĩ', role: 'b', text: '{认识|rènshi}{你|nǐ}，{我|wǒ}{很|hěn}{高兴|gāoxìng}！', ro: 'Rènshi nǐ, wǒ hěn gāoxìng!', vi: 'Quen được bạn, mình vui lắm!' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong tình huống 3',
      items: [
        '**他是谁？** tā shì shéi — "cậu ấy là ai?". 谁 = ai, đứng đúng chỗ của câu trả lời: 他是**谁**？→ 他是**大伟**。 Không thêm 吗.',
        '**是我朋友** — "là bạn tôi". Nói về người thân thiết, người Trung Quốc thường **bỏ 的**: 我朋友, 我老师. Câu đầy đủ là 我**的**朋友 (Bài 4).',
        '**你认识他吗？— 不认识。** — trả lời câu hỏi 吗 có động từ: nhắc lại **động từ** (认识 / 不认识), không cần cả câu. 不 trước 认识 (thanh 4) đọc **bú**.',
        '**不是，他是学生。** — "Không phải, cậu ấy là sinh viên." 不是 bú shì là cách phủ định 是 — ở bài này chỉ dùng để trả lời; Bài 3 học kỹ 不 với mọi động từ.',
        '**你叫大伟吗？** — khi đã đoán được tên, hỏi xác nhận bằng 吗; khi chưa biết gì thì hỏi bằng 什么.',
        '谁 có hai cách đọc: **shéi** (khẩu ngữ, phổ biến nhất) và **shuí** (đọc trang trọng). Khoá này dùng shéi.',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{他|tā}{是|shì}{谁|shéi}？', ro: 'Tā shì shéi?', vi: 'Anh ấy là ai?' },
        { en: '{他|tā}{是|shì}{大伟|Dàwěi}。', ro: 'Tā shì Dàwěi.', vi: 'Anh ấy là Đại Vĩ.' },
        { en: '{你|nǐ}{认识|rènshi}{他|tā}{吗|ma}？', ro: 'Nǐ rènshi tā ma?', vi: 'Bạn có quen anh ấy không?' },
        { en: '{不|bú}{认识|rènshi}。', ro: 'Bú rènshi.', vi: 'Không quen.' },
        { en: '{他|tā}{是|shì}{老师|lǎoshī}{吗|ma}？— {不|bú}{是|shì}，{他|tā}{是|shì}{学生|xuésheng}。', ro: 'Tā shì lǎoshī ma? — Bú shì, tā shì xuésheng.', vi: 'Anh ấy là giáo viên à? — Không phải, anh ấy là sinh viên.' },
        { en: '{他|tā}{是|shì}{我|wǒ}{朋友|péngyou}。', ro: 'Tā shì wǒ péngyou.', vi: 'Anh ấy là bạn tôi.' },
      ],
    },

    /* ── Văn hoá ── */
    { t: 'h', text: 'Văn hoá: tên người Việt viết bằng chữ Hán' },
    {
      t: 'p',
      text: 'Đây là lợi thế rất lớn của người Việt: **hầu hết họ và tên tiếng Việt đều có chữ Hán tương ứng**, vì chúng vốn là âm Hán Việt. Bạn chỉ cần tìm chữ Hán đúng nghĩa của tên mình (hỏi người nhà, xem gia phả, hoặc tra từ điển Hán Việt) rồi đọc chữ đó theo âm tiếng Trung. Ví dụ **Nguyễn Thị Lan** → 阮氏兰 **Ruǎn Shì Lán**; **Trần Văn Minh** → 陈文明 **Chén Wén Míng**. Người Trung Quốc nghe tên kiểu này thấy rất tự nhiên. Ở lớp, thầy cô thường gọi bạn bằng **tên đầy đủ** hoặc **tên lặp** (兰兰).',
    },
    {
      t: 'table',
      caption: 'Họ Việt phổ biến → chữ Hán → pinyin (ghi nhớ họ của chính bạn)',
      head: ['Họ (tiếng Việt)', 'Chữ Hán', 'Pinyin', 'Cách nói "Tôi họ …"'],
      rows: [
        ['Nguyễn', '阮', 'Ruǎn', '我姓阮。Wǒ xìng Ruǎn.'],
        ['Trần', '陈', 'Chén', '我姓陈。Wǒ xìng Chén.'],
        ['Lê', '黎', 'Lí', '我姓黎。Wǒ xìng Lí.'],
        ['Phạm', '范', 'Fàn', '我姓范。Wǒ xìng Fàn.'],
        ['Hoàng / Huỳnh', '黄', 'Huáng', '我姓黄。Wǒ xìng Huáng.'],
        ['Phan', '潘', 'Pān', '我姓潘。Wǒ xìng Pān.'],
        ['Vũ / Võ', '武', 'Wǔ', '我姓武。Wǒ xìng Wǔ.'],
        ['Đặng', '邓', 'Dèng', '我姓邓。Wǒ xìng Dèng.'],
        ['Bùi', '裴', 'Péi', '我姓裴。Wǒ xìng Péi.'],
        ['Đỗ', '杜', 'Dù', '我姓杜。Wǒ xìng Dù.'],
        ['Hồ', '胡', 'Hú', '我姓胡。Wǒ xìng Hú.'],
        ['Ngô', '吴', 'Wú', '我姓吴。Wǒ xìng Wú.'],
        ['Dương', '杨', 'Yáng', '我姓杨。Wǒ xìng Yáng.'],
        ['Lý', '李', 'Lǐ', '我姓李。Wǒ xìng Lǐ.'],
      ],
    },
    {
      t: 'table',
      caption: 'Một số tên đệm và tên Việt thường gặp (chọn đúng chữ theo NGHĨA tên của bạn)',
      head: ['Tiếng Việt', 'Chữ Hán', 'Pinyin', 'Nghĩa của chữ'],
      rows: [
        ['Thị (tên đệm nữ)', '氏', 'Shì', 'họ, dòng họ — tên đệm của phụ nữ'],
        ['Văn (tên đệm nam)', '文', 'Wén', 'văn, văn chương'],
        ['Lan', '兰', 'Lán', 'hoa lan'],
        ['Minh', '明', 'Míng', 'sáng'],
        ['Anh', '英', 'Yīng', 'tinh hoa, anh tài'],
        ['Hùng', '雄', 'Xióng', 'hùng mạnh'],
        ['Ngọc', '玉', 'Yù', 'ngọc'],
        ['Hải', '海', 'Hǎi', 'biển'],
        ['Mai', '梅', 'Méi', 'hoa mai'],
        ['Thu', '秋', 'Qiū', 'mùa thu'],
        ['Hương', '香', 'Xiāng', 'thơm, hương'],
        ['Tuấn', '俊', 'Jùn', 'tuấn tú, đẹp trai'],
      ],
    },
    {
      t: 'note',
      title: 'Ghi nhớ — tên và cách gọi ở Trung Quốc',
      items: [
        '**Một chữ Việt có thể ứng với nhiều chữ Hán**: "Hoa" có thể là 花 Huā (bông hoa) hoặc 华 Huá (Trung Hoa, tinh hoa). Hãy chọn chữ theo **nghĩa tên của bạn**, đừng chọn đại.',
        'Người Trung Quốc thường có tên **1–2 chữ** và họ **1 chữ**: 王明, 李红, 张伟. Tên Việt 3–4 chữ (阮氏兰) nghe hơi dài nhưng không sao — bạn bè sẽ gọi tắt: 兰兰, 小兰 (Lan bé), 阿兰 (A Lan).',
        'Bạn bè thân thiết gọi nhau bằng **小 + họ** (小王 — cậu Vương, dùng cho người trẻ hơn/ngang tuổi) hoặc **老 + họ** (老王 — anh Vương, người lớn tuổi hơn một chút, thân mật). Với thầy cô: **họ + 老师**.',
        'Người nước ngoài như Anna, Đại Vĩ thường **tự chọn một tên tiếng Trung** gần âm hoặc gần nghĩa tên gốc: Anna → 安娜 Ānnà; David → 大伟 Dàwěi (đại = lớn, vĩ = vĩ đại).',
        'Không gọi người lớn tuổi, thầy cô bằng **tên riêng** — rất thất lễ. Dùng chức danh: 李老师, 王先生 (ông Vương), 王老板.',
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{我|wǒ}{姓|xìng}{阮|Ruǎn}，{叫|jiào}{阮氏兰|Ruǎn Shì Lán}。', ro: 'Wǒ xìng Ruǎn, jiào Ruǎn Shì Lán.', vi: 'Tôi họ Nguyễn, tên là Nguyễn Thị Lan.' },
        { en: '{我|wǒ}{姓|xìng}{陈|Chén}，{叫|jiào}{陈文明|Chén Wén Míng}。', ro: 'Wǒ xìng Chén, jiào Chén Wén Míng.', vi: 'Tôi họ Trần, tên là Trần Văn Minh.' },
        { en: '{小王|Xiǎo Wáng}，{你好|nǐ hǎo}！', ro: 'Xiǎo Wáng, nǐ hǎo!', vi: 'Cậu Vương, chào cậu! (gọi thân mật)' },
        { en: '{王|Wáng}{先生|xiānsheng}，{您好|nín hǎo}！', ro: 'Wáng xiānsheng, nín hǎo!', vi: 'Chào ông Vương ạ!' },
      ],
    },
  ],
};

/* ══════════════════════════ 2. TỪ VỰNG ══════════════════════════ */

const TU_VUNG: Lesson = {
  id: 'b2-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng Bài 2 — 26 từ: tên, họ, 是, 谁, người quanh ta, họ thường gặp',
  goal: 'Nghe, đọc đúng thanh và dùng được 26 từ của Bài 2 để hỏi tên, hỏi họ, nói mình là ai và hỏi người khác là ai.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Ghi nhớ trước khi học',
      items: [
        '**叫** jiào và **姓** xìng đều là **động từ**: 我叫兰兰 (tôi TÊN LÀ Lan Lan), 我姓阮 (tôi HỌ Nguyễn) — không cần thêm 是.',
        'Ba từ có **thanh nhẹ** ở chữ sau: 什么 shén**me**, 名字 míng**zi**, 朋友 péng**you**, 学生 xué**sheng**, 先生 xiān**sheng** — đọc chữ sau ngắn, nhẹ.',
        'Âm Hán Việt giúp nhớ: 学生 HỌC SINH, 朋友 BẰNG HỮU, 名字 DANH TỰ. Có từ **lệch nghĩa**: 先生 TIÊN SINH = "ông, ngài; chồng" — KHÔNG phải "thầy giáo".',
        'Mỗi từ: 🔊 nghe → đọc to 3 lần → đọc câu ví dụ → bấm **Che nghĩa** để tự kiểm tra.',
      ],
    },

    { t: 'h', text: 'Nhóm 1 — Hỏi và nói tên (7 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{叫|jiào}', pos: 'động từ', ipa: 'jiào', vi: '(tên) là, gọi là; gọi', ex: '{我|wǒ}{叫|jiào}{兰兰|Lánlan}。', exRo: 'Wǒ jiào Lánlan.', exVi: 'Tôi tên là Lan Lan.', more: 'Hán Việt: **KHIẾU** (kêu gọi). Hai nghĩa: "tên là" (我叫王明) và "gọi" (叫我兰兰 — gọi tôi là Lan Lan). Bộ 口 (miệng).' },
        { w: '{名字|míngzi}', pos: 'danh từ', ipa: 'míngzi', vi: 'tên, họ tên', ex: '{你|nǐ}{叫|jiào}{什么|shénme}{名字|míngzi}？', exRo: 'Nǐ jiào shénme míngzi?', exVi: 'Bạn tên là gì?', more: 'Hán Việt: **DANH TỰ** — nhưng tiếng Trung nghĩa là "tên", không phải "danh từ" (ngữ pháp). 字 đọc nhẹ.' },
        { w: '{什么|shénme}', pos: 'đại từ nghi vấn', ipa: 'shénme', vi: 'gì, cái gì', ex: '{他|tā}{叫|jiào}{什么|shénme}{名字|míngzi}？', exRo: 'Tā jiào shénme míngzi?', exVi: 'Anh ấy tên là gì?', more: 'Hán Việt: THẬP MA. 么 đọc nhẹ. Đứng trước danh từ = "… gì": 什么名字 (tên gì). Câu đã có 什么 thì **không** thêm 吗.' },
        { w: '{姓|xìng}', pos: 'động từ / danh từ', ipa: 'xìng', vi: 'họ là; họ (của một người)', ex: '{我|wǒ}{姓|xìng}{王|Wáng}。', exRo: 'Wǒ xìng Wáng.', exVi: 'Tôi họ Vương.', more: 'Hán Việt: **TÍNH** (bách tính = trăm họ). Chữ = 女 (nữ) + 生 (sinh): họ theo người mẹ sinh ra — dấu vết thời mẫu hệ. Hỏi: 你姓什么？' },
        { w: '{贵姓|guìxìng}', pos: 'danh từ (kính ngữ)', ipa: 'guìxìng', vi: 'quý danh — họ của ngài (hỏi họ lịch sự)', ex: '{请问|qǐngwèn}，{您|nín}{贵姓|guìxìng}？', exRo: 'Qǐngwèn, nín guìxìng?', exVi: 'Xin hỏi, ngài họ gì ạ?', more: 'Hán Việt: QUÝ TÍNH. Chỉ dùng khi **hỏi** người khác (thường với 您): 您贵姓？ Trả lời: **我姓…** — không bao giờ nói ~~我贵姓…~~.' },
        { w: '{请问|qǐngwèn}', pos: 'cụm động từ', ipa: 'qǐngwèn', vi: 'xin hỏi, cho hỏi', ex: '{请问|qǐngwèn}，{您|nín}{是|shì}{李|Lǐ}{老师|lǎoshī}{吗|ma}？', exRo: 'Qǐngwèn, nín shì Lǐ lǎoshī ma?', exVi: 'Xin hỏi, cô có phải là cô Lý không ạ?', more: 'Hán Việt: **THỈNH VẤN** (请 xin, mời + 问 hỏi). Đặt ở đầu câu hỏi khi hỏi người lạ, người lớn — lịch sự như "Dạ, cho em hỏi…".' },
        { w: '{问|wèn}', pos: 'động từ', ipa: 'wèn', vi: 'hỏi', ex: '{我|wǒ}{问|wèn}{老师|lǎoshī}。', exRo: 'Wǒ wèn lǎoshī.', exVi: 'Tôi hỏi cô giáo.', more: 'Hán Việt: **VẤN** (vấn đề, chất vấn). Chữ = 门 (cửa) + 口 (miệng): đứng ở cửa mà hỏi. Đừng nhầm với 门 mén (cửa) và 们 men.' },
      ],
    },

    { t: 'h', text: 'Nhóm 2 — "Là", "ai", "đúng" (3 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{是|shì}', pos: 'động từ', ipa: 'shì', vi: 'là; vâng, phải (khi trả lời)', ex: '{我|wǒ}{是|shì}{学生|xuésheng}。', exRo: 'Wǒ shì xuésheng.', exVi: 'Tôi là sinh viên.', more: 'Hán Việt: **THỊ** (thị phi = đúng sai). Nối hai **danh từ**: A 是 B. KHÔNG đứng trước tính từ (~~我是忙~~). Phủ định: **不是 bú shì**. sh uốn lưỡi — đừng đọc thành 四 sì (bốn).' },
        { w: '{谁|shéi}', pos: 'đại từ nghi vấn', ipa: 'shéi', vi: 'ai', ex: '{她|tā}{是|shì}{谁|shéi}？', exRo: 'Tā shì shéi?', exVi: 'Cô ấy là ai?', more: 'Hán Việt: **THUỲ** (trong thơ văn cổ: "thuỳ" = ai). Đọc **shéi** (khẩu ngữ) hoặc shuí (trang trọng). Đứng đúng chỗ của người được hỏi: 谁是老师？(Ai là giáo viên?)' },
        { w: '{对|duì}', pos: 'tính từ', ipa: 'duì', vi: 'đúng; (trả lời) đúng rồi, phải', ex: '{你|nǐ}{是|shì}{兰兰|Lánlan}{吗|ma}？— {对|duì}！', exRo: 'Nǐ shì Lánlan ma? — Duì!', exVi: 'Bạn là Lan Lan à? — Đúng rồi!', more: 'Hán Việt: **ĐỐI** (đã gặp trong 对不起). Trả lời xác nhận: 对 / 是. Phủ định: 不对 bú duì (không đúng).' },
      ],
    },

    { t: 'h', text: 'Nhóm 3 — Người quanh ta: nghề, vai (6 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{学生|xuésheng}', pos: 'danh từ', ipa: 'xuésheng', vi: 'học sinh, sinh viên, học trò', ex: '{我|wǒ}{是|shì}{学生|xuésheng}，{她|tā}{是|shì}{老师|lǎoshī}。', exRo: 'Wǒ shì xuésheng, tā shì lǎoshī.', exVi: 'Tôi là sinh viên, cô ấy là giáo viên.', more: 'Hán Việt: **HỌC SINH**. Tiếng Trung dùng 学生 cho **mọi cấp** — học sinh tiểu học lẫn sinh viên đại học. 生 đọc nhẹ.' },
        { w: '{大学生|dàxuéshēng}', pos: 'danh từ', ipa: 'dàxuéshēng', vi: 'sinh viên đại học', ex: '{王明|Wáng Míng}{是|shì}{大学生|dàxuéshēng}。', exRo: 'Wáng Míng shì dàxuéshēng.', exVi: 'Vương Minh là sinh viên đại học.', more: 'Hán Việt: ĐẠI HỌC SINH (大学 đại học + 生). Ở đây 生 đọc **đủ thanh 1** (shēng), khác với 学生 xuésheng.' },
        { w: '{留学生|liúxuéshēng}', pos: 'danh từ', ipa: 'liúxuéshēng', vi: 'du học sinh, lưu học sinh (từ mở rộng)', ex: '{兰兰|Lánlan}{是|shì}{留学生|liúxuéshēng}。', exRo: 'Lánlan shì liúxuéshēng.', exVi: 'Lan Lan là du học sinh.', more: 'Hán Việt: **LƯU HỌC SINH** (lưu = ở lại). Từ mở rộng — rất cần cho người Việt học ở Trung Quốc.' },
        { w: '{朋友|péngyou}', pos: 'danh từ', ipa: 'péngyou', vi: 'bạn, bạn bè', ex: '{大伟|Dàwěi}{是|shì}{我|wǒ}{朋友|péngyou}。', exRo: 'Dàwěi shì wǒ péngyou.', exVi: 'Đại Vĩ là bạn tôi.', more: 'Hán Việt: **BẰNG HỮU**. 友 đọc nhẹ. Khác 同学 (bạn cùng lớp): 朋友 là bạn bè nói chung. 我朋友 / 我的朋友 (Bài 4).' },
        { w: '{先生|xiānsheng}', pos: 'danh từ', ipa: 'xiānsheng', vi: 'ông, ngài (gọi nam giới lịch sự); chồng', ex: '{王|Wáng}{先生|xiānsheng}，{您好|nín hǎo}！', exRo: 'Wáng xiānsheng, nín hǎo!', exVi: 'Chào ông Vương ạ!', more: 'Hán Việt: TIÊN SINH — **lệch nghĩa**: tiếng Việt "tiên sinh" là thầy, người có học; tiếng Trung ngày nay là "ông" (họ + 先生) hoặc "chồng" (我先生 = chồng tôi). Gọi thầy giáo là **老师**.' },
        { w: '{医生|yīshēng}', pos: 'danh từ', ipa: 'yīshēng', vi: 'bác sĩ', ex: '{她|tā}{是|shì}{医生|yīshēng}{吗|ma}？', exRo: 'Tā shì yīshēng ma?', exVi: 'Cô ấy là bác sĩ à?', more: 'Hán Việt: **Y SINH** (y = chữa bệnh). Gọi bác sĩ: 王医生 (bác sĩ Vương), hoặc 大夫 dàifu trong khẩu ngữ (từ mở rộng).' },
      ],
    },

    { t: 'h', text: 'Nhóm 4 — Họ thường gặp (6 từ)' },
    {
      t: 'p',
      text: 'Họ người Trung Quốc rất tập trung: chỉ năm họ **王, 李, 张, 刘, 陈** đã chiếm gần **30%** dân số. Học năm họ này là bạn gọi đúng được rất nhiều người. Họ của người Việt cũng có chữ Hán — ở đây học thêm 阮 (Nguyễn), họ của Lan.',
    },
    {
      t: 'vocab',
      items: [
        { w: '{王|Wáng}', pos: 'họ', ipa: 'Wáng', vi: 'họ Vương (nghĩa gốc: vua)', ex: '{我|wǒ}{姓|xìng}{王|Wáng}，{叫|jiào}{王明|Wáng Míng}。', exRo: 'Wǒ xìng Wáng, jiào Wáng Míng.', exVi: 'Tôi họ Vương, tên là Vương Minh.', more: 'Hán Việt: **VƯƠNG**. Ba nét ngang + một nét sổ. Viết hoa trong pinyin: Wáng.' },
        { w: '{李|Lǐ}', pos: 'họ', ipa: 'Lǐ', vi: 'họ Lý (nghĩa gốc: cây mận)', ex: '{她|tā}{姓|xìng}{李|Lǐ}，{是|shì}{老师|lǎoshī}。', exRo: 'Tā xìng Lǐ, shì lǎoshī.', exVi: 'Cô ấy họ Lý, là giáo viên.', more: 'Hán Việt: **LÝ**. Chữ = 木 (cây) + 子 (quả). 李老师 đọc Lí lǎoshī (3+3). Đừng nhầm với 黎 Lí (họ Lê).' },
        { w: '{张|Zhāng}', pos: 'họ', ipa: 'Zhāng', vi: 'họ Trương', ex: '{张|Zhāng}{老师|lǎoshī}{好|hǎo}！', exRo: 'Zhāng lǎoshī hǎo!', exVi: 'Em chào thầy Trương!', more: 'Hán Việt: **TRƯƠNG**. Bộ 弓 (cung). zh uốn lưỡi, thanh 1 cao. Cũng là lượng từ (一张 — một tờ), học sau.' },
        { w: '{刘|Liú}', pos: 'họ', ipa: 'Liú', vi: 'họ Lưu', ex: '{刘|Liú}{先生|xiānsheng}{是|shì}{医生|yīshēng}。', exRo: 'Liú xiānsheng shì yīshēng.', exVi: 'Ông Lưu là bác sĩ.', more: 'Hán Việt: **LƯU** (Lưu Bị trong Tam Quốc). liú = l + iou, thanh 2.' },
        { w: '{陈|Chén}', pos: 'họ', ipa: 'Chén', vi: 'họ Trần', ex: '{我|wǒ}{姓|xìng}{陈|Chén}。', exRo: 'Wǒ xìng Chén.', exVi: 'Tôi họ Trần.', more: 'Hán Việt: **TRẦN** — cũng là họ lớn ở Việt Nam. ch uốn lưỡi, bật hơi.' },
        { w: '{阮|Ruǎn}', pos: 'họ', ipa: 'Ruǎn', vi: 'họ Nguyễn', ex: '{兰兰|Lánlan}{姓|xìng}{阮|Ruǎn}。', exRo: 'Lánlan xìng Ruǎn.', exVi: 'Lan Lan họ Nguyễn.', more: 'Hán Việt: **NGUYỄN** — họ phổ biến nhất Việt Nam (~38% dân số), nhưng ở Trung Quốc rất hiếm. r uốn lưỡi + uan, thanh 3.' },
      ],
    },

    { t: 'h', text: 'Nhóm 5 — Cách gọi thân mật & tên riêng (4 từ)' },
    {
      t: 'vocab',
      items: [
        { w: '{小|xiǎo}', pos: 'tính từ / tiền tố', ipa: 'xiǎo', vi: 'nhỏ, bé; (trước họ) cậu …, em … — gọi thân mật người trẻ', ex: '{小王|Xiǎo Wáng}，{你好|nǐ hǎo}！', exRo: 'Xiǎo Wáng, nǐ hǎo!', exVi: 'Cậu Vương, chào cậu!', more: 'Hán Việt: **TIỂU**. 小 + họ: gọi đồng nghiệp/bạn trẻ hơn hoặc ngang tuổi. Đã viết chữ 小 ở Bài 0.' },
        { w: '{老|lǎo}', pos: 'tính từ / tiền tố', ipa: 'lǎo', vi: 'già, cũ; (trước họ) anh …, bác … — gọi thân mật người lớn hơn', ex: '{老王|Lǎo Wáng}，{你|nǐ}{忙|máng}{吗|ma}？', exRo: 'Lǎo Wáng, nǐ máng ma?', exVi: 'Anh Vương, anh có bận không?', more: 'Hán Việt: **LÃO**. 老 + họ: thân mật với người quen lâu, hơn tuổi. Đã gặp trong 老师, 老板 — ở đó 老 không có nghĩa "già". 王 là thanh 2 nên 老 không biến điệu: Lǎo Wáng (đọc nửa thanh 3).' },
        { w: '{阮氏兰|Ruǎn Shì Lán}', pos: 'tên riêng', ipa: 'Ruǎn Shì Lán', vi: 'Nguyễn Thị Lan — tên đầy đủ của Lan', ex: '{我|wǒ}{叫|jiào}{阮氏兰|Ruǎn Shì Lán}。', exRo: 'Wǒ jiào Ruǎn Shì Lán.', exVi: 'Tôi tên là Nguyễn Thị Lan.', more: '阮 NGUYỄN + 氏 THỊ + 兰 LAN. Tên lặp 兰兰 Lánlan là cách bạn bè gọi thân mật.' },
        { w: '{王明|Wáng Míng}', pos: 'tên riêng', ipa: 'Wáng Míng', vi: 'Vương Minh — bạn cùng lớp người Trung Quốc', ex: '{王明|Wáng Míng}{是|shì}{大学生|dàxuéshēng}。', exRo: 'Wáng Míng shì dàxuéshēng.', exVi: 'Vương Minh là sinh viên đại học.', more: '王 VƯƠNG (họ) + 明 MINH (tên, nghĩa "sáng"). Pinyin: họ và tên viết hoa, tách rời.' },
      ],
    },
    {
      t: 'table',
      caption: 'Từ Bài 1 dùng lại nhiều trong Bài 2 (ôn, không tính vào 26 từ mới)',
      head: ['Từ', 'Pinyin', 'Nghĩa', 'Dùng trong Bài 2'],
      rows: [
        ['认识', 'rènshi', 'quen biết', '你认识他吗？— 认识 / 不认识 (bú rènshi)'],
        ['老师', 'lǎoshī', 'giáo viên', '她是老师。李老师'],
        ['同学', 'tóngxué', 'bạn học', '他是我同学。'],
        ['高兴', 'gāoxìng', 'vui', '很高兴认识你！'],
        ['您', 'nín', 'ngài (kính trọng)', '您贵姓？'],
        ['不', 'bù / bú', 'không', '不是 bú shì · 不认识 bú rènshi'],
      ],
    },
    {
      t: 'table',
      caption: 'Tóm tắt: hỏi gì — đáp gì',
      head: ['Người kia hỏi', 'Bạn đáp', 'Nghĩa'],
      rows: [
        ['你叫什么名字？', '我叫兰兰。', 'Bạn tên là gì? — Tôi tên là Lan Lan.'],
        ['您贵姓？', '我姓阮。', 'Ngài họ gì ạ? — Tôi họ Nguyễn.'],
        ['你姓什么？', '我姓王。', 'Bạn họ gì? — Tôi họ Vương.'],
        ['他是谁？', '他是大伟。', 'Anh ấy là ai? — Anh ấy là Đại Vĩ.'],
        ['你是学生吗？', '是，我是学生。/ 不是，我是老师。', 'Bạn là sinh viên à? — Vâng… / Không phải…'],
        ['你认识他吗？', '认识。/ 不认识。', 'Bạn có quen anh ấy không? — Quen. / Không quen.'],
        ['你是兰兰吗？', '对！/ 是！', 'Bạn là Lan Lan à? — Đúng rồi!'],
      ],
    },
    {
      t: 'mcq',
      id: 'b2-tv-nghia',
      title: 'Kiểm tra nghĩa từ',
      items: [
        m('{名字|míngzi} nghĩa là gì?', ['danh từ (ngữ pháp)', 'tên', 'chữ viết', 'danh tiếng'], 1, '名字 = tên. Âm Hán Việt DANH TỰ nhưng nghĩa là "tên".'),
        m('{谁|shéi} nghĩa là:', ['gì', 'ai', 'đâu', 'nào'], 1, '谁 = ai. "Gì" là 什么.'),
        m('{贵姓|guìxìng} dùng để:', ['tự giới thiệu họ của mình', 'hỏi họ người khác một cách lịch sự', 'khen ai đó giàu', 'hỏi tên con vật'], 1, '您贵姓？ — chỉ dùng khi HỎI. Trả lời: 我姓…'),
        m('{先生|xiānsheng} trong tiếng Trung hiện đại nghĩa là:', ['thầy giáo', 'học sinh giỏi', 'ông, ngài; chồng', 'bác sĩ'], 2, '先生 = ông (王先生) hoặc chồng (我先生). Thầy giáo là 老师.'),
        m('{朋友|péngyou} nghĩa là:', ['bạn bè', 'bạn cùng lớp', 'giáo viên', 'người lạ'], 0, '朋友 = bạn bè (BẰNG HỮU). Bạn cùng lớp là 同学.'),
        m('{请问|qǐngwèn} đặt ở đâu, nghĩa gì?', ['Cuối câu — "nhé"', 'Đầu câu hỏi — "xin hỏi"', 'Sau tên — "ạ"', 'Trước tính từ — "rất"'], 1, '请问 = xin hỏi, mở đầu câu hỏi lịch sự.'),
        m('{对|duì} trong câu trả lời "对！" nghĩa là:', ['xin lỗi', 'đúng rồi', 'không phải', 'cảm ơn'], 1, '对 = đúng. (对不起 mới là xin lỗi.)'),
        m('{医生|yīshēng} là:', ['giáo viên', 'bác sĩ', 'sinh viên', 'ông chủ'], 1, '医生 = bác sĩ (Y SINH).'),
        m('Họ {阮|Ruǎn} là họ nào của người Việt?', ['Trần', 'Lê', 'Nguyễn', 'Phạm'], 2, '阮 = Nguyễn. Trần 陈, Lê 黎, Phạm 范.'),
        m('{小王|Xiǎo Wáng} là cách gọi:', ['ông vua nhỏ', 'cậu/em Vương — thân mật, người trẻ', 'bác Vương già', 'thầy Vương'], 1, '小 + họ = gọi thân mật người trẻ hoặc ngang tuổi.'),
        m('{叫|jiào} trong 叫我兰兰 nghĩa là:', ['tên là', 'gọi', 'hỏi', 'là'], 1, '叫 có hai nghĩa: "tên là" (我叫…) và "gọi" (叫我… — gọi tôi là…).'),
      ],
    },
  ],
};

/* ══════════════════════════ 3. NGỮ PHÁP ══════════════════════════ */

const NGU_PHAP: Lesson = {
  id: 'b2-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp Bài 2 — 叫 / 姓, câu 是, câu hỏi 吗 với 是 và động từ, 什么 / 谁, 认识',
  goal: 'Nói và hỏi tên, họ; dùng đúng câu "A 是 B"; hỏi có/không bằng 吗 và trả lời ngắn đúng kiểu Trung Quốc; hỏi "gì / ai" bằng 什么 / 谁 đặt đúng chỗ.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Sáu điểm ngữ pháp',
      items: [
        '**① 叫**: S + 叫 + tên — 我叫兰兰. Hỏi: 你叫什么名字？',
        '**② 姓**: S + 姓 + họ — 我姓王. Hỏi lịch sự: 您贵姓？ thân mật: 你姓什么？',
        '**③ 是**: S + 是 + danh từ — 我是学生. Phủ định sơ khởi: 不是 (bú shì).',
        '**④ 吗 với 是 / động từ**: 你是老师吗？你认识他吗？ → trả lời ngắn bằng chính động từ: 是 / 不是 · 认识 / 不认识.',
        '**⑤ 什么 / 谁**: đứng đúng chỗ của câu trả lời, KHÔNG thêm 吗 — 他是谁？他叫什么名字？',
        '**⑥ 认识 + người** và câu làm quen 很高兴认识你; mở đầu lịch sự bằng 请问.',
      ],
    },

    /* ── ① 叫 ── */
    { t: 'h', text: '① S + 叫 + tên — "… tên là …"' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'S + 叫 + tên',
          vi: 'Nói tên của ai đó (thường nói cả họ lẫn tên)',
          examples: [
            { en: '{我|wǒ}{叫|jiào}{王明|Wáng Míng}。', ro: 'Wǒ jiào Wáng Míng.', vi: 'Tôi tên là Vương Minh.' },
            { en: '{她|tā}{叫|jiào}{安娜|Ānnà}。', ro: 'Tā jiào Ānnà.', vi: 'Cô ấy tên là Anna.' },
            { en: '{他|tā}{叫|jiào}{大伟|Dàwěi}。', ro: 'Tā jiào Dàwěi.', vi: 'Anh ấy tên là Đại Vĩ.' },
            { en: '{我|wǒ}{叫|jiào}{阮氏兰|Ruǎn Shì Lán}。', ro: 'Wǒ jiào Ruǎn Shì Lán.', vi: 'Tôi tên là Nguyễn Thị Lan.' },
            { en: '{我们|wǒmen}{叫|jiào}{她|tā}{李|Lǐ}{老师|lǎoshī}。', ro: 'Wǒmen jiào tā Lǐ lǎoshī.', vi: 'Chúng tôi gọi cô ấy là cô Lý. — ở đây 叫 = gọi' },
          ],
        },
        {
          formula: 'S + 叫 + 什么 + 名字？',
          vi: 'Hỏi tên — 什么名字 thay vào chỗ tên',
          examples: [
            { en: '{你|nǐ}{叫|jiào}{什么|shénme}{名字|míngzi}？', ro: 'Nǐ jiào shénme míngzi?', vi: 'Bạn tên là gì?' },
            { en: '{她|tā}{叫|jiào}{什么|shénme}{名字|míngzi}？', ro: 'Tā jiào shénme míngzi?', vi: 'Cô ấy tên là gì?' },
            { en: '{你|nǐ}{叫|jiào}{什么|shénme}？', ro: 'Nǐ jiào shénme?', vi: 'Bạn tên gì? (nói tắt, thân mật)' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '**叫** là **động từ**, nghĩa đen là "gọi" → 我叫王明 = "tôi được gọi là Vương Minh" = tôi tên là Vương Minh. Vì 叫 đã là động từ nên **không thêm 是**: ~~我是叫王明~~. Trật tự giống hệt tiếng Việt "Tôi **tên là** Minh" — chỉ khác là tiếng Việt cần hai chữ "tên là", tiếng Trung chỉ cần một chữ **叫**. Khi hỏi, 什么名字 (tên gì) đứng **đúng vị trí** của tên trong câu trả lời.',
    },
    {
      t: 'table',
      caption: 'Hỏi ↔ đáp: câu hỏi và câu trả lời có cùng "khuôn"',
      head: ['Câu hỏi', 'Câu trả lời', 'Nghĩa'],
      rows: [
        ['你叫**什么名字**？', '我叫**兰兰**。', 'Bạn tên gì? — Tôi tên Lan Lan.'],
        ['他叫**什么名字**？', '他叫**王明**。', 'Anh ấy tên gì? — Anh ấy tên Vương Minh.'],
        ['她叫**什么名字**？', '她叫**安娜**。', 'Cô ấy tên gì? — Cô ấy tên Anna.'],
        ['老师叫**什么名字**？', '老师叫**李红**。(tên ví dụ)', 'Cô giáo tên gì? — Cô giáo tên Lý Hồng.'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Thêm 是 vì dịch "tên **là**": ~~我是叫兰兰。~~ → **我叫兰兰。** (叫 đã gồm cả "tên là").',
        'Dịch từng chữ "tên tôi là…" thành ~~名字我是兰兰~~ — trật tự sai. Nói **我叫兰兰**. (Câu 我的名字是兰兰 cũng đúng nhưng dài, dùng 的 — Bài 4.)',
        'Hỏi ~~你叫什么名字吗？~~ — câu đã có 什么 thì **bỏ 吗**.',
        'Đọc 什么 thành "shén mó" hai thanh rõ: 么 là **thanh nhẹ** — "shénme", chữ sau rất ngắn.',
      ],
    },
    { t: 'rule', formula: 'S + 叫 + tên。 · 你叫什么名字？', vi: '叫 là động từ "tên là / gọi là" — không thêm 是; hỏi tên thì thay tên bằng 什么名字.' },

    /* ── ② 姓 ── */
    { t: 'h', text: '② S + 姓 + họ — "… họ …"; 您贵姓？' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'S + 姓 + họ',
          vi: 'Nói họ của ai đó — 姓 cũng là động từ',
          examples: [
            { en: '{我|wǒ}{姓|xìng}{阮|Ruǎn}。', ro: 'Wǒ xìng Ruǎn.', vi: 'Tôi họ Nguyễn.' },
            { en: '{他|tā}{姓|xìng}{王|Wáng}。', ro: 'Tā xìng Wáng.', vi: 'Anh ấy họ Vương.' },
            { en: '{老师|lǎoshī}{姓|xìng}{李|Lǐ}。', ro: 'Lǎoshī xìng Lǐ.', vi: 'Cô giáo họ Lý.' },
            { en: '{我|wǒ}{姓|xìng}{张|Zhāng}，{叫|jiào}{张|Zhāng}{明|Míng}。', ro: 'Wǒ xìng Zhāng, jiào Zhāng Míng.', vi: 'Tôi họ Trương, tên là Trương Minh.' },
          ],
        },
        {
          formula: '您贵姓？ (lịch sự) · 你姓什么？ (thân mật)',
          vi: 'Hỏi họ — 贵姓 chỉ dùng khi HỎI người khác',
          examples: [
            { en: '{您|nín}{贵姓|guìxìng}？', ro: 'Nín guìxìng?', vi: 'Ngài họ gì ạ?' },
            { en: '{请问|qǐngwèn}，{您|nín}{贵姓|guìxìng}？', ro: 'Qǐngwèn, nín guìxìng?', vi: 'Xin hỏi, ngài họ gì ạ?' },
            { en: '{你|nǐ}{姓|xìng}{什么|shénme}？', ro: 'Nǐ xìng shénme?', vi: 'Bạn họ gì?' },
            { en: '{他|tā}{姓|xìng}{什么|shénme}？', ro: 'Tā xìng shénme?', vi: 'Anh ấy họ gì?' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: 'Người Trung Quốc gặp người lớn tuổi, khách hàng, người lạ thường **hỏi họ trước** chứ không hỏi tên — vì sau đó sẽ gọi bằng **họ + chức danh** (王先生, 李老师, 张医生). Câu hỏi họ lịch sự nhất là **您贵姓？** (nghĩa đen: "quý họ của ngài?"). 贵 guì = quý, là chữ **khiêm–kính**: chỉ dùng để tôn người khác, không dùng cho mình. Vì vậy câu trả lời luôn là **我姓 + họ**, có thể nói thêm tên: **我姓李，叫李红。**',
    },
    {
      t: 'table',
      caption: '姓 khác 叫 thế nào?',
      head: ['', '姓 xìng', '叫 jiào'],
      rows: [
        ['Nói gì', 'Chỉ **họ** (1 chữ, đôi khi 2)', '**Tên đầy đủ** hoặc tên gọi'],
        ['Ví dụ', '我姓王。', '我叫王明。'],
        ['Hỏi', '您贵姓？/ 你姓什么？', '你叫什么名字？'],
        ['SAI', '~~我姓王明。~~ (họ không gồm tên)', '~~我叫王。~~ (chỉ nói họ thì dùng 姓)'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Hỏi họ ↔ đáp mẫu',
      lines: [
        { who: '大伟 Đại Vĩ', role: 'b', text: '{老板|lǎobǎn}，{您好|nín hǎo}！{请问|qǐngwèn}，{您|nín}{贵姓|guìxìng}？', ro: 'Lǎobǎn, nín hǎo! Qǐngwèn, nín guìxìng?', vi: 'Chào cô chủ ạ! Cho cháu hỏi, cô họ gì ạ?' },
        { who: '老板 Bà chủ quầy', role: 'c', text: '{我|wǒ}{姓|xìng}{张|Zhāng}。{你|nǐ}{姓|xìng}{什么|shénme}？', ro: 'Wǒ xìng Zhāng. Nǐ xìng shénme?', vi: 'Cô họ Trương. Cháu họ gì?' },
        { who: '大伟 Đại Vĩ', role: 'b', text: '{我|wǒ}{叫|jiào}{大伟|Dàwěi}。{张|Zhāng}{老板|lǎobǎn}，{谢谢|xièxie}{您|nín}！', ro: 'Wǒ jiào Dàwěi. Zhāng lǎobǎn, xièxie nín!', vi: 'Cháu tên là Đại Vĩ. Cô Trương, cháu cảm ơn cô!' },
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Trả lời có 贵: ~~我贵姓阮。~~ → **我姓阮。** (tự gọi họ mình là "quý" thì rất buồn cười).',
        'Dùng 贵姓 với bạn bè, trẻ con: nghe khách sáo quá mức. Với bạn bè hỏi **你叫什么名字？** là đủ.',
        'Dùng 叫 cho họ: ~~我叫阮。~~ → **我姓阮。** Còn 我叫阮氏兰 (cả họ tên) thì đúng.',
        'Bỏ chủ ngữ khi hỏi lịch sự thành ~~贵姓？~~ — trong khẩu ngữ có nghe thấy, nhưng người mới học nên nói đủ **您贵姓？**',
      ],
    },
    { t: 'rule', formula: 'S + 姓 + họ。 · 您贵姓？→ 我姓…', vi: '姓 là động từ "họ là"; hỏi lịch sự bằng 您贵姓, trả lời 我姓… (không lặp 贵).' },

    /* ── ③ 是 ── */
    { t: 'h', text: '③ Câu chữ 是: S + 是 + danh từ' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'S + 是 + N',
          vi: 'Nói ai/cái gì "là" ai/cái gì — nối hai danh từ',
          examples: [
            { en: '{我|wǒ}{是|shì}{学生|xuésheng}。', ro: 'Wǒ shì xuésheng.', vi: 'Tôi là sinh viên.' },
            { en: '{她|tā}{是|shì}{老师|lǎoshī}。', ro: 'Tā shì lǎoshī.', vi: 'Cô ấy là giáo viên.' },
            { en: '{他|tā}{是|shì}{医生|yīshēng}。', ro: 'Tā shì yīshēng.', vi: 'Anh ấy là bác sĩ.' },
            { en: '{我们|wǒmen}{是|shì}{同学|tóngxué}。', ro: 'Wǒmen shì tóngxué.', vi: 'Chúng tôi là bạn cùng lớp.' },
            { en: '{大伟|Dàwěi}{是|shì}{我|wǒ}{朋友|péngyou}。', ro: 'Dàwěi shì wǒ péngyou.', vi: 'Đại Vĩ là bạn tôi.' },
            { en: '{我|wǒ}{是|shì}{兰兰|Lánlan}。', ro: 'Wǒ shì Lánlan.', vi: 'Tôi là Lan Lan. (giới thiệu mình là ai)' },
          ],
        },
        {
          formula: 'S + 不是 + N (sơ khởi)',
          vi: 'Phủ định: "không phải là" — 不 trước 是 (thanh 4) đọc bú',
          examples: [
            { en: '{我|wǒ}{不|bú}{是|shì}{老师|lǎoshī}。', ro: 'Wǒ bú shì lǎoshī.', vi: 'Tôi không phải là giáo viên.' },
            { en: '{他|tā}{不|bú}{是|shì}{医生|yīshēng}。', ro: 'Tā bú shì yīshēng.', vi: 'Anh ấy không phải là bác sĩ.' },
            { en: '{她|tā}{不|bú}{是|shì}{王|Wáng}{老师|lǎoshī}，{她|tā}{是|shì}{李|Lǐ}{老师|lǎoshī}。', ro: 'Tā bú shì Wáng lǎoshī, tā shì Lǐ lǎoshī.', vi: 'Cô ấy không phải cô Vương, cô ấy là cô Lý.' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '**是** giống chữ "**là**" của tiếng Việt, và cũng giống tiếng Việt ở chỗ **không bao giờ đổi hình**: tiếng Anh có am / is / are, tiếng Trung thì "tôi là", "anh ấy là", "họ là" đều chỉ một chữ 是. Nhưng hãy nhớ quy tắc của Bài 1: **是 chỉ nối hai danh từ** (hoặc đại từ, tên riêng). Tính từ (好, 忙, 冷, 高兴…) tự làm vị ngữ, **không đi với 是**. Tiếng Việt cũng vậy: ta nói "Tôi **là** sinh viên" nhưng không nói "Tôi ~~là~~ bận".',
    },
    {
      t: 'table',
      caption: 'Câu 是 (danh từ) hay câu 很 (tính từ)? — đặt cạnh nhau cho khỏi lẫn',
      head: ['Sau chủ ngữ là…', 'Dùng', 'Ví dụ đúng', 'SAI'],
      rows: [
        ['Danh từ: 学生, 老师, 朋友, tên người', '**是**', '我是学生。她是安娜。', '~~我很学生。~~'],
        ['Tính từ: 好, 忙, 冷, 热, 高兴', '**很**', '我很忙。她很高兴。', '~~我是忙。~~ ~~她是很高兴。~~'],
      ],
    },
    {
      t: 'table',
      caption: 'Bảng thay thế — S + 是 + N',
      head: ['S', '是', 'N', 'Câu mẫu'],
      rows: [
        ['我', '是', '学生 / 留学生', '我是留学生。Wǒ shì liúxuéshēng.'],
        ['你', '是', '老师', '你是老师。Nǐ shì lǎoshī.'],
        ['他', '是', '医生', '他是医生。Tā shì yīshēng.'],
        ['她', '是', '我朋友', '她是我朋友。Tā shì wǒ péngyou.'],
        ['我们', '是', '同学', '我们是同学。Wǒmen shì tóngxué.'],
        ['王明', '是', '大学生', '王明是大学生。Wáng Míng shì dàxuéshēng.'],
        ['张先生', '是', '老板', '张先生是老板。Zhāng xiānsheng shì lǎobǎn.'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Dùng 是 với tính từ: ~~我是很好。~~ ~~他是忙。~~ → **我很好。他很忙。**',
        'Bỏ 是 như văn nói tiếng Việt ("Tôi sinh viên"): ~~我学生。~~ → **我是学生。**',
        'Đọc 是 shì thành **sì** (四 — bốn): 我是学生 nghe thành "tôi bốn sinh viên". Cong đầu lưỡi lên khi đọc sh.',
        'Đọc 不是 thành "bù shì": 是 là thanh 4 nên 不 đọc **bú** — **bú shì**.',
      ],
    },
    { t: 'rule', formula: 'S + 是 + N。 · S + 不是 + N。', vi: '是 nối hai danh từ ("là"), không đổi theo ngôi; tính từ thì dùng 很, không dùng 是.' },

    /* ── ④ 吗 ── */
    { t: 'h', text: '④ Câu hỏi 吗 với 是 và động từ — trả lời ngắn' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'S + 是 + N + 吗？',
          vi: 'Hỏi "… có phải là … không?" — giữ nguyên câu kể, thêm 吗',
          examples: [
            { en: '{你|nǐ}{是|shì}{学生|xuésheng}{吗|ma}？', ro: 'Nǐ shì xuésheng ma?', vi: 'Bạn là sinh viên à? / Bạn có phải sinh viên không?' },
            { en: '{她|tā}{是|shì}{老师|lǎoshī}{吗|ma}？', ro: 'Tā shì lǎoshī ma?', vi: 'Cô ấy có phải là giáo viên không?' },
            { en: '{您|nín}{是|shì}{王|Wáng}{先生|xiānsheng}{吗|ma}？', ro: 'Nín shì Wáng xiānsheng ma?', vi: 'Ông có phải là ông Vương không ạ?' },
            { en: '{你们|nǐmen}{是|shì}{同学|tóngxué}{吗|ma}？', ro: 'Nǐmen shì tóngxué ma?', vi: 'Các bạn là bạn cùng lớp à?' },
          ],
        },
        {
          formula: 'S + V (叫 / 姓 / 认识) + O + 吗？',
          vi: 'Câu có động từ khác cũng chỉ cần thêm 吗',
          examples: [
            { en: '{你|nǐ}{叫|jiào}{王明|Wáng Míng}{吗|ma}？', ro: 'Nǐ jiào Wáng Míng ma?', vi: 'Bạn tên là Vương Minh à?' },
            { en: '{她|tā}{姓|xìng}{李|Lǐ}{吗|ma}？', ro: 'Tā xìng Lǐ ma?', vi: 'Cô ấy họ Lý à?' },
            { en: '{你|nǐ}{认识|rènshi}{安娜|Ānnà}{吗|ma}？', ro: 'Nǐ rènshi Ānnà ma?', vi: 'Bạn có quen Anna không?' },
            { en: '{你|nǐ}{认识|rènshi}{我|wǒ}{吗|ma}？', ro: 'Nǐ rènshi wǒ ma?', vi: 'Bạn có biết tôi không?' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: 'Tiếng Trung **không có chữ "có" và "không" riêng** để trả lời như tiếng Việt "Có ạ / Không ạ" hay tiếng Anh "Yes / No". Cách trả lời chuẩn là **nhắc lại chính động từ** (hoặc tính từ) của câu hỏi: hỏi **是**…吗 → đáp **是** / **不是**; hỏi **认识**…吗 → đáp **认识** / **不认识**; hỏi **叫**…吗 → đáp **对** hoặc nói lại tên. Muốn đầy đủ thì nói thêm cả câu: **是，我是学生。** Từ **对** (đúng) dùng được khi xác nhận một thông tin: 你是兰兰吗？— **对！**',
    },
    {
      t: 'table',
      caption: 'Cặp hỏi ↔ đáp: khẳng định và phủ định',
      head: ['Hỏi', 'Đáp khẳng định', 'Đáp phủ định (不 — Bài 3 học kỹ)'],
      rows: [
        ['你是学生吗？Nǐ shì xuésheng ma?', '是，我是学生。Shì, wǒ shì xuésheng.', '不是，我是老师。Bú shì, wǒ shì lǎoshī.'],
        ['她是医生吗？Tā shì yīshēng ma?', '是，她是医生。Shì, tā shì yīshēng.', '不是，她是老师。Bú shì, tā shì lǎoshī.'],
        ['你认识他吗？Nǐ rènshi tā ma?', '认识。他是王明。Rènshi. Tā shì Wáng Míng.', '不认识。Bú rènshi.'],
        ['你叫大伟吗？Nǐ jiào Dàwěi ma?', '对，我叫大伟。Duì, wǒ jiào Dàwěi.', '不是，我叫王明。Bú shì, wǒ jiào Wáng Míng.'],
        ['她姓李吗？Tā xìng Lǐ ma?', '对，她姓李。Duì, tā xìng Lǐ.', '不是，她姓张。Bú shì, tā xìng Zhāng.'],
        ['你忙吗？(ôn Bài 1) Nǐ máng ma?', '我很忙。Wǒ hěn máng.', '我不忙。Wǒ bù máng.'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Trả lời bằng ~~有~~ (dịch "có"): hỏi 你是学生吗？ mà đáp ~~有~~ là sai — 有 nghĩa là "có (sở hữu)". Đáp **是**.',
        'Trả lời bằng ~~好~~ hay ~~吗~~: 好 là "được/OK", không phải "vâng, đúng". Hỏi 你认识他吗？ → **认识**.',
        'Lặp lại cả 吗 trong câu trả lời: ~~是，我是学生吗。~~ → **是，我是学生。**',
        'Đảo trật tự kiểu tiếng Anh "Are you…?": ~~是你学生吗？~~ → **你是学生吗？** — trật tự câu hỏi y như câu kể.',
      ],
    },
    { t: 'rule', formula: 'câu kể (是 / V) + 吗？ → đáp: V / 不 + V (是 / 不是 · 认识 / 不认识)', vi: 'Câu hỏi có/không: thêm 吗; trả lời ngắn bằng chính động từ của câu hỏi, không dùng 有 hay 好.' },

    /* ── ⑤ 什么 / 谁 ── */
    { t: 'h', text: '⑤ Đại từ nghi vấn 什么 (gì) và 谁 (ai)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '… 什么 (+ N)？',
          vi: '"gì" — đứng đúng chỗ của sự vật được hỏi',
          examples: [
            { en: '{你|nǐ}{叫|jiào}{什么|shénme}{名字|míngzi}？', ro: 'Nǐ jiào shénme míngzi?', vi: 'Bạn tên là gì?' },
            { en: '{你|nǐ}{姓|xìng}{什么|shénme}？', ro: 'Nǐ xìng shénme?', vi: 'Bạn họ gì?' },
            { en: '{老师|lǎoshī}{问|wèn}{什么|shénme}？', ro: 'Lǎoshī wèn shénme?', vi: 'Cô giáo hỏi gì?' },
          ],
        },
        {
          formula: '谁 + 是 + N？ · S + 是 + 谁？',
          vi: '"ai" — làm chủ ngữ hoặc tân ngữ, vẫn đứng đúng chỗ người được hỏi',
          examples: [
            { en: '{他|tā}{是|shì}{谁|shéi}？', ro: 'Tā shì shéi?', vi: 'Anh ấy là ai?' },
            { en: '{谁|shéi}{是|shì}{老师|lǎoshī}？', ro: 'Shéi shì lǎoshī?', vi: 'Ai là giáo viên?' },
            { en: '{谁|shéi}{叫|jiào}{安娜|Ānnà}？', ro: 'Shéi jiào Ānnà?', vi: 'Ai tên là Anna?' },
            { en: '{你|nǐ}{认识|rènshi}{谁|shéi}？', ro: 'Nǐ rènshi shéi?', vi: 'Bạn quen ai?' },
            { en: '{谁|shéi}{认识|rènshi}{他|tā}？', ro: 'Shéi rènshi tā?', vi: 'Ai quen anh ấy?' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: 'Đây là điểm tiếng Trung **giống tiếng Việt** và **khác tiếng Anh**: từ để hỏi **không chạy lên đầu câu**. Tiếng Việt: "Anh ấy là **ai**?" — tiếng Trung: 他是**谁**？ (tiếng Anh phải đảo: "**Who** is he?"). Mẹo: viết câu trả lời trước, rồi **thay phần muốn hỏi** bằng 什么 / 谁. Và vì từ để hỏi đã làm câu thành câu hỏi, **không được thêm 吗** nữa — một câu chỉ có **một** cách hỏi.',
    },
    {
      t: 'table',
      caption: 'Thay đúng chỗ — từ câu kể thành câu hỏi',
      head: ['Câu kể', 'Hỏi phần in đậm', 'Câu hỏi'],
      rows: [
        ['他是**大伟**。', 'người (ai?)', '他是**谁**？'],
        ['**李老师**是老师。', 'người làm chủ ngữ (ai?)', '**谁**是老师？'],
        ['我叫**兰兰**。', 'tên (gì?)', '你叫**什么名字**？'],
        ['她姓**王**。', 'họ (gì?)', '她姓**什么**？'],
        ['我认识**安娜**。', 'người được quen (ai?)', '你认识**谁**？'],
      ],
    },
    {
      t: 'table',
      caption: '吗 hay từ để hỏi? — hai kiểu câu hỏi khác nhau',
      head: ['', 'Câu hỏi 吗', 'Câu hỏi 什么 / 谁'],
      rows: [
        ['Hỏi để…', 'xác nhận CÓ / KHÔNG', 'lấy THÔNG TIN mới'],
        ['Ví dụ', '他是大伟吗？(Anh ấy là Đại Vĩ à?)', '他是谁？(Anh ấy là ai?)'],
        ['Trả lời', '是 / 不是', '他是大伟。'],
        ['Có 吗 không?', 'có, ở cuối câu', '**không** — ~~他是谁吗？~~'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Thêm 吗 vào câu đã có từ để hỏi: ~~你叫什么名字吗？~~ ~~他是谁吗？~~ → bỏ 吗.',
        'Đưa từ để hỏi lên đầu theo kiểu tiếng Anh: ~~谁是他？~~ (khi muốn hỏi "anh ấy là ai") → **他是谁？** (谁是他 nghe như "ai là anh ấy?" — câu lạ).',
        'Dùng 什么 để hỏi người: ~~他是什么？~~ (anh ấy là CÁI gì?) → hỏi người dùng **谁**: 他是谁？',
        'Đọc 谁 thành "suí" phẳng lưỡi: sh uốn lưỡi — **shéi**.',
      ],
    },
    { t: 'rule', formula: 'câu kể → thay phần cần hỏi bằng 什么 / 谁 (KHÔNG thêm 吗)', vi: 'Từ để hỏi đứng đúng chỗ câu trả lời, như tiếng Việt; 谁 hỏi người, 什么 hỏi vật / tên / họ.' },

    /* ── ⑥ 认识 ── */
    { t: 'h', text: '⑥ 认识 + người — quen biết; câu làm quen; 请问' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'S + 认识 + người',
          vi: '"quen, biết (mặt) ai đó" — phủ định 不认识 (bú rènshi)',
          examples: [
            { en: '{我|wǒ}{认识|rènshi}{王明|Wáng Míng}。', ro: 'Wǒ rènshi Wáng Míng.', vi: 'Tôi quen Vương Minh.' },
            { en: '{她|tā}{认识|rènshi}{李|Lǐ}{老师|lǎoshī}。', ro: 'Tā rènshi Lǐ lǎoshī.', vi: 'Cô ấy biết cô Lý.' },
            { en: '{我|wǒ}{不|bú}{认识|rènshi}{他|tā}。', ro: 'Wǒ bú rènshi tā.', vi: 'Tôi không quen anh ấy.' },
            { en: '{你们|nǐmen}{认识|rènshi}{吗|ma}？', ro: 'Nǐmen rènshi ma?', vi: 'Hai bạn quen nhau chưa? (các bạn có quen nhau không?)' },
          ],
        },
        {
          formula: '很高兴认识你！ / 认识你，我很高兴！',
          vi: 'Câu làm quen — nói khi vừa biết tên nhau',
          examples: [
            { en: '{很|hěn}{高兴|gāoxìng}{认识|rènshi}{你|nǐ}！', ro: 'Hěn gāoxìng rènshi nǐ!', vi: 'Rất vui được làm quen với bạn!' },
            { en: '{很|hěn}{高兴|gāoxìng}{认识|rènshi}{您|nín}！', ro: 'Hěn gāoxìng rènshi nín!', vi: 'Rất vui được biết ngài!' },
            { en: '{认识|rènshi}{你们|nǐmen}，{我|wǒ}{很|hěn}{高兴|gāoxìng}！', ro: 'Rènshi nǐmen, wǒ hěn gāoxìng!', vi: 'Quen được các bạn, tôi rất vui!' },
          ],
        },
        {
          formula: '请问，+ câu hỏi？',
          vi: 'Mở đầu câu hỏi lịch sự với người lạ / người lớn',
          examples: [
            { en: '{请问|qǐngwèn}，{你|nǐ}{叫|jiào}{什么|shénme}{名字|míngzi}？', ro: 'Qǐngwèn, nǐ jiào shénme míngzi?', vi: 'Cho hỏi, bạn tên là gì?' },
            { en: '{请问|qǐngwèn}，{您|nín}{是|shì}{张|Zhāng}{医生|yīshēng}{吗|ma}？', ro: 'Qǐngwèn, nín shì Zhāng yīshēng ma?', vi: 'Xin hỏi, ông có phải là bác sĩ Trương không ạ?' },
          ],
        },
      ],
    },
    {
      t: 'p',
      text: '**认识** là "quen biết, nhận ra được" — dùng cho **người** (认识王明), và cả **chữ** (认识这个字 — biết mặt chữ này, Bài 8). Đây không phải "biết" một thông tin (biết rằng…, biết làm…) — những nghĩa đó dùng từ khác (知道, 会), học sau. Câu **很高兴认识你** là câu cố định: không có chủ ngữ mà vẫn tự nhiên, giống tiếng Việt "Rất vui được làm quen!".',
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Dịch "nhận thức" theo Hán Việt: 认识 trong giao tiếp hằng ngày là **quen biết**, không phải "nhận thức".',
        'Đọc 不认识 thành "bù rènshi": 认 thanh 4 → **bú rènshi**.',
        'Dùng 认识 cho "biết thông tin": "Tôi biết anh ấy là sinh viên" ≠ 认识 — học từ khác ở Bài sau. Bây giờ chỉ dùng **认识 + người**.',
      ],
    },
    { t: 'rule', formula: 'S + 认识 / 不认识 + người · 很高兴认识你！· 请问，…？', vi: '认识 = quen ai đó; 请问 mở đầu câu hỏi lịch sự.' },

    /* ── So sánh với tiếng Việt ── */
    { t: 'h', text: 'Đặt cạnh tiếng Việt — giống và khác' },
    {
      t: 'table',
      caption: 'Câu Bài 2 so với tiếng Việt',
      head: ['Tiếng Việt', 'Tiếng Trung', 'Giống / khác'],
      rows: [
        ['Tôi **là** sinh viên.', '我**是**学生。', 'Giống: "là" ↔ 是, cùng vị trí.'],
        ['Tôi **tên là** Lan.', '我**叫**兰兰。', 'Khác: tiếng Trung một động từ 叫 = "tên là", không thêm 是.'],
        ['Tôi **họ** Nguyễn.', '我**姓**阮。', 'Giống: "họ" ↔ 姓 làm động từ, không cần "là".'],
        ['Anh ấy là **ai**?', '他是**谁**？', 'Giống: từ để hỏi ở cuối, đúng chỗ câu trả lời.'],
        ['Bạn tên **gì**?', '你叫**什么名字**？', 'Giống: "gì" ↔ 什么, đứng sau động từ.'],
        ['Bạn là sinh viên **à / phải không**?', '你是学生**吗**？', 'Giống: thêm một chữ ở cuối câu.'],
        ['**Vâng** / **Không phải**.', '**是** / **不是**。', 'Khác: tiếng Trung trả lời bằng chính động từ của câu hỏi.'],
        ['Tôi ~~là~~ bận. (sai cả hai thứ tiếng)', '我很忙。', 'Giống: tính từ không đi với "là" / 是.'],
      ],
    },

    /* ── Tổng kết ── */
    { t: 'h', text: 'Tổng kết ngữ pháp Bài 2' },
    {
      t: 'table',
      head: ['Điểm', 'Công thức', 'Ví dụ', 'Dùng khi'],
      rows: [
        ['①', 'S + 叫 + tên', '我叫兰兰。你叫什么名字？', 'Nói / hỏi tên'],
        ['②', 'S + 姓 + họ', '我姓王。您贵姓？', 'Nói / hỏi họ'],
        ['③', 'S + 是 + N · S + 不是 + N', '我是学生。我不是老师。', 'Nói ai là ai'],
        ['④', 'câu kể + 吗？ → 是 / 不是 · 认识 / 不认识', '你是老师吗？— 不是。', 'Hỏi có / không'],
        ['⑤', '什么 / 谁 đặt đúng chỗ, không 吗', '他是谁？她姓什么？', 'Hỏi thông tin'],
        ['⑥', 'S + 认识 + người · 请问', '我认识他。请问，您贵姓？', 'Quen biết, hỏi lịch sự'],
      ],
    },
    {
      t: 'build',
      id: 'b2-np-ghep',
      title: 'Ghép câu — Bài 2',
      items: [
        { vi: 'Bạn tên là gì?', chips: ['{你|nǐ}', '{叫|jiào}', '{什么|shénme}', '{名字|míngzi}', '{吗|ma}'], answer: ['{你|nǐ}', '{叫|jiào}', '{什么|shénme}', '{名字|míngzi}'], ro: 'Nǐ jiào shénme míngzi?' },
        { vi: 'Tôi tên là Vương Minh.', chips: ['{我|wǒ}', '{叫|jiào}', '{王明|Wáng Míng}', '{是|shì}'], answer: ['{我|wǒ}', '{叫|jiào}', '{王明|Wáng Míng}'], ro: 'Wǒ jiào Wáng Míng.' },
        { vi: 'Tôi họ Nguyễn.', chips: ['{我|wǒ}', '{姓|xìng}', '{阮|Ruǎn}', '{贵|guì}'], answer: ['{我|wǒ}', '{姓|xìng}', '{阮|Ruǎn}'], ro: 'Wǒ xìng Ruǎn.' },
        { vi: 'Xin hỏi, ngài họ gì ạ?', chips: ['{请问|qǐngwèn}', '{您|nín}', '{贵姓|guìxìng}', '{吗|ma}'], answer: ['{请问|qǐngwèn}', '{您|nín}', '{贵姓|guìxìng}'], ro: 'Qǐngwèn, nín guìxìng?' },
        { vi: 'Cô ấy là giáo viên.', chips: ['{她|tā}', '{是|shì}', '{老师|lǎoshī}', '{很|hěn}'], answer: ['{她|tā}', '{是|shì}', '{老师|lǎoshī}'], ro: 'Tā shì lǎoshī.' },
        { vi: 'Anh ấy là ai?', chips: ['{他|tā}', '{是|shì}', '{谁|shéi}', '{吗|ma}'], answer: ['{他|tā}', '{是|shì}', '{谁|shéi}'], ro: 'Tā shì shéi?' },
        { vi: 'Bạn là sinh viên à?', chips: ['{你|nǐ}', '{是|shì}', '{学生|xuésheng}', '{吗|ma}', '{什么|shénme}'], answer: ['{你|nǐ}', '{是|shì}', '{学生|xuésheng}', '{吗|ma}'], ro: 'Nǐ shì xuésheng ma?' },
        { vi: 'Tôi không phải là bác sĩ.', chips: ['{我|wǒ}', '{不|bú}', '{是|shì}', '{医生|yīshēng}', '{很|hěn}'], answer: ['{我|wǒ}', '{不|bú}', '{是|shì}', '{医生|yīshēng}'], ro: 'Wǒ bú shì yīshēng.' },
        { vi: 'Bạn có quen anh ấy không?', chips: ['{你|nǐ}', '{认识|rènshi}', '{他|tā}', '{吗|ma}', '{谁|shéi}'], answer: ['{你|nǐ}', '{认识|rènshi}', '{他|tā}', '{吗|ma}'], ro: 'Nǐ rènshi tā ma?' },
        { vi: 'Đại Vĩ là bạn tôi.', chips: ['{大伟|Dàwěi}', '{是|shì}', '{我|wǒ}', '{朋友|péngyou}', '{叫|jiào}'], answer: ['{大伟|Dàwěi}', '{是|shì}', '{我|wǒ}', '{朋友|péngyou}'], ro: 'Dàwěi shì wǒ péngyou.' },
        { vi: 'Ai là giáo viên?', chips: ['{谁|shéi}', '{是|shì}', '{老师|lǎoshī}', '{吗|ma}'], answer: ['{谁|shéi}', '{是|shì}', '{老师|lǎoshī}'], ro: 'Shéi shì lǎoshī?' },
        { vi: 'Rất vui được làm quen với bạn!', chips: ['{很|hěn}', '{高兴|gāoxìng}', '{认识|rènshi}', '{你|nǐ}', '{是|shì}'], answer: ['{很|hěn}', '{高兴|gāoxìng}', '{认识|rènshi}', '{你|nǐ}'], ro: 'Hěn gāoxìng rènshi nǐ!' },
      ],
    },
    {
      t: 'quiz',
      id: 'b2-np-dien',
      title: 'Điền một chữ / từ vào （　）: 叫 · 姓 · 是 · 吗 · 谁 · 什么',
      kind: 'fill',
      grammar: 'S + 叫 + tên · S + 姓 + họ · S + 是 + N · câu kể + 吗 · 什么 / 谁 không đi với 吗',
      items: [
        { q: '{我|wǒ}（　）{兰兰|Lánlan}。', answers: ['叫', '是'], hint: 'Tôi tên là Lan Lan. (叫; 是 cũng chấp nhận: "Tôi là Lan Lan")' },
        { q: '{我|wǒ}（　）{王|Wáng}。', answers: ['姓'], hint: 'Tôi HỌ Vương.' },
        { q: '{她|tā}（　）{老师|lǎoshī}。', answers: ['是'], hint: 'Cô ấy LÀ giáo viên.' },
        { q: '{你|nǐ}{是|shì}{学生|xuésheng}（　）？', answers: ['吗'], hint: 'Bạn là sinh viên à?' },
        { q: '{他|tā}{是|shì}（　）？', answers: ['谁'], hint: 'Anh ấy là AI?' },
        { q: '{你|nǐ}{叫|jiào}（　）{名字|míngzi}？', answers: ['什么'], hint: 'Bạn tên là GÌ?' },
        { q: '{您|nín}{贵|guì}（　）？', answers: ['姓'], hint: 'Ngài họ gì ạ?' },
        { q: '（　）{是|shì}{医生|yīshēng}？', answers: ['谁'], hint: 'AI là bác sĩ?' },
        { q: '{你|nǐ}{认识|rènshi}{安娜|Ānnà}（　）？', answers: ['吗'], hint: 'Bạn có quen Anna không?' },
        { q: '{我|wǒ}{不|bú}（　）{老师|lǎoshī}。', answers: ['是'], hint: 'Tôi KHÔNG PHẢI giáo viên.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-np-trac-nghiem',
      title: 'Trắc nghiệm ngữ pháp Bài 2',
      items: [
        m('"Tôi tên là Lan Lan." — câu nào đúng?', ['我是叫兰兰。', '我叫兰兰。', '名字我兰兰。', '我叫是兰兰。'], 1, '叫 đã nghĩa "tên là" — không thêm 是.'),
        m('"Anh ấy là ai?" — câu nào đúng?', ['谁是他吗？', '他是谁吗？', '他是谁？', '他谁是？'], 2, '谁 đứng đúng chỗ câu trả lời, không thêm 吗.'),
        m('Ai đó hỏi 您贵姓？ Bạn đáp:', ['我贵姓阮。', '我姓阮。', '我叫阮。', '我是贵阮。'], 1, 'Trả lời 我姓… — không dùng 贵 cho mình.'),
        m('你是老师吗？ — trả lời phủ định đúng:', ['没有。', '不好。', '不是，我是学生。', '我不老师。'], 2, 'Phủ định 是 bằng 不是.'),
        m('Câu nào **sai**?', ['我是学生。', '她很忙。', '他是很高兴。', '我姓王。'], 2, 'Tính từ 高兴 không đi với 是: 他很高兴.'),
        m('Muốn hỏi họ một **bạn cùng lớp**, nói tự nhiên nhất:', ['您贵姓？', '你姓什么？', '你贵姓吗？', '你是姓吗？'], 1, 'Với bạn bè: 你姓什么？ (贵姓 dùng với người lớn, người lạ).'),
        m('你认识他吗？ — trả lời khẳng định ngắn:', ['有。', '好。', '认识。', '是吗。'], 2, 'Trả lời bằng chính động từ: 认识.'),
        m('不是 đọc là:', ['bù shì', 'bú shì', 'bǔ shì', 'bū shì'], 1, '是 thanh 4 → 不 đọc bú.'),
        m('Câu nào hỏi để **lấy thông tin mới** (không phải có/không)?', ['你是王明吗？', '她叫什么名字？', '你认识他吗？', '他是医生吗？'], 1, '什么 hỏi thông tin; các câu 吗 hỏi có/không.'),
      ],
    },
  ],
};

/* ══════════════════════════ 4. CHỮ HÁN ══════════════════════════ */

const HAN_TU: Lesson = {
  id: 'b2-han-tu',
  kind: 'kanji',
  title: 'Chữ Hán Bài 2 — 12 chữ: 是 叫 什 么 名 字 姓 谁 学 生 朋 友',
  goal: 'Nhận mặt, đọc đúng và viết được 12 chữ Hán của Bài 2; dùng bộ thủ và âm Hán Việt để đoán nghĩa, nhớ lâu.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Cách học chữ Hán bài này',
      items: [
        '12 chữ — mỗi chữ: **xem thứ tự nét → tô theo → tự viết** (khối tập viết cuối bài).',
        'Bộ thủ mới hay gặp: **口** (miệng) trong 叫, 名; **讠** (lời nói) trong 谁 — như 谢 ở Bài 1; **女** (nữ) trong 姓; **子** (con) trong 字, 学; **月** trong 朋.',
        'Âm Hán Việt là "chìa khoá": 学生 HỌC SINH, 名字 DANH TỰ, 朋友 BẰNG HỮU, 姓 TÍNH, 是 THỊ, 谁 THUỲ.',
        'Phần **Đọc chữ trần** mô phỏng đề HSK: đọc to trước rồi mới bấm hiện pinyin.',
      ],
    },
    {
      t: 'table',
      caption: '12 chữ Hán của Bài 2',
      head: ['Chữ', 'Pinyin', 'Hán Việt', 'Bộ thủ', 'Số nét', 'Nghĩa', 'Từ ví dụ'],
      rows: [
        ['是', 'shì', 'THỊ', '日 (mặt trời)', '9', 'là; đúng', '我是学生 · 不是'],
        ['叫', 'jiào', 'KHIẾU', '口 (miệng)', '5', 'gọi, tên là', '我叫兰兰'],
        ['什', 'shén', 'THẬP', '亻 (người)', '4', '(trong 什么) gì', '什么'],
        ['么', 'me', 'MA', '丿 (phẩy)', '3', '(trong 什么)', '什么'],
        ['名', 'míng', 'DANH', '口 (miệng)', '6', 'tên', '名字'],
        ['字', 'zì', 'TỰ', '子 (con) — trên có 宀 mái nhà', '6', 'chữ', '名字 · 汉字'],
        ['姓', 'xìng', 'TÍNH', '女 (nữ)', '8', 'họ', '我姓王 · 贵姓'],
        ['谁', 'shéi', 'THUỲ', '讠 (lời nói)', '10', 'ai', '他是谁'],
        ['学', 'xué', 'HỌC', '子 (con)', '8', 'học', '学生 · 同学'],
        ['生', 'shēng', 'SINH', '生 (tự là bộ)', '5', 'sinh ra; người (học)', '学生 · 医生 · 先生'],
        ['朋', 'péng', 'BẰNG', '月 (nguyệt)', '8', 'bạn', '朋友'],
        ['友', 'yǒu', 'HỮU', '又 (tay)', '4', 'bạn', '朋友 · 友好'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ bằng hình và bộ thủ',
      items: [
        '**是** = **日** (mặt trời) ở trên + phần dưới giống chữ **正** (ngay thẳng): "dưới ánh mặt trời, điều ngay thẳng" → **đúng, là** (THỊ trong "thị phi" — đúng sai).',
        '**叫** = **口** (miệng) + **丩** (gợi âm): mở miệng **kêu, gọi** → KHIẾU (như "khiếu nại"). Gọi ai thì gọi tên → 叫 cũng là "tên là".',
        '**名** = **夕** (buổi tối) + **口** (miệng): trời tối không nhìn thấy mặt nhau, phải **gọi tên** bằng miệng → DANH (tên).',
        '**字** = **宀** (mái nhà) + **子** (đứa con): con cái sinh sôi trong nhà → chữ nghĩa sinh sôi → **chữ**. TỰ (văn tự).',
        '**姓** = **女** (nữ) + **生** (sinh): người do **mẹ sinh ra** mang họ — dấu vết thời xa xưa con theo họ mẹ. TÍNH (bách tính).',
        '**谁** = **讠** (lời nói) + **隹** (chim đuôi ngắn, gợi âm): hỏi bằng lời "ai đấy?". Phần 隹 có 8 nét — đếm kỹ 4 nét ngang.',
        '**学** = phần trên (ba chấm + 冖, như mái che) + **子** (đứa trẻ): đứa trẻ ngồi dưới mái trường **học**. HỌC.',
        '**生** = mầm cây (丿 + 一) nhú lên trên mặt **đất** (土-like): **sinh** ra, mọc lên. Trong 学生, 医生: "người…".',
        '**朋** = hai chữ **月** đứng sát nhau: hai người đi cạnh nhau → bạn. **友** = 𠂇 (bàn tay) + **又** (bàn tay): hai bàn tay nắm lấy nhau → bạn. 朋友 = BẰNG HỮU.',
        '**什么**: 什 = 亻 + 十 (mười); 么 = 丿 + 厶, chỉ 3 nét. Hai chữ này gần như chỉ dùng trong 什么 — học như một khối.',
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận: các chữ dễ viết nhầm',
      items: [
        '**姓 ↔ 性**: 姓 (họ) bộ 女; 性 xìng (tính cách, giới tính — Bài sau) bộ 忄 (tâm đứng). Cùng đọc **xìng**!',
        '**名 ↔ 各**: 名 trên là 夕 (3 nét), 各 gè (mỗi) trên là 夂. Đừng viết 各字.',
        '**学 ↔ 字**: cùng có 子 ở dưới. 学 trên là ba chấm + 冖; 字 trên là 宀 (có chấm ở giữa).',
        '**友 ↔ 反 ↔ 发**: 友 nét đầu là **ngang** rồi **phẩy** dài, dưới là 又. 反 fǎn (ngược) trên là 厂. Đếm: 友 chỉ **4 nét**.',
        '**是 ↔ 走**: phần dưới của 是 có nét phẩy và mác dài ra hai bên (như 走 zǒu — đi), nhưng trên là 日 chứ không phải 土.',
        '**谁 ↔ 难**: 难 nán (khó) bên trái là 又; 谁 bên trái là 讠 (lời nói).',
      ],
    },
    {
      t: 'readkanji',
      id: 'b2-doc-chu',
      title: 'Đọc chữ trần — không pinyin',
      note: 'Như đề HSK: chữ không có pinyin. Đọc to cả câu một hơi (nhớ: 什么 shénme, 名字 míngzi, 学生 xuésheng, 朋友 péngyou đều có chữ sau đọc nhẹ; 不是 → bú shì), rồi mới bấm hiện pinyin + nghe để tự chấm.',
      items: [
        { text: '{你|nǐ}{叫|jiào}{什么|shénme}{名字|míngzi}？', ro: 'Nǐ jiào shénme míngzi?', vi: 'Bạn tên là gì?' },
        { text: '{我|wǒ}{叫|jiào}{王明|Wáng Míng}。', ro: 'Wǒ jiào Wáng Míng.', vi: 'Tôi tên là Vương Minh.' },
        { text: '{您|nín}{贵姓|guìxìng}？', ro: 'Nín guìxìng?', vi: 'Ngài họ gì ạ?' },
        { text: '{我|wǒ}{姓|xìng}{李|Lǐ}。', ro: 'Wǒ xìng Lǐ.', vi: 'Tôi họ Lý.' },
        { text: '{我|wǒ}{是|shì}{学生|xuésheng}。', ro: 'Wǒ shì xuésheng.', vi: 'Tôi là sinh viên.' },
        { text: '{他|tā}{是|shì}{谁|shéi}？', ro: 'Tā shì shéi?', vi: 'Anh ấy là ai?' },
        { text: '{她|tā}{是|shì}{我|wǒ}{朋友|péngyou}。', ro: 'Tā shì wǒ péngyou.', vi: 'Cô ấy là bạn tôi.' },
        { text: '{你|nǐ}{是|shì}{老师|lǎoshī}{吗|ma}？', ro: 'Nǐ shì lǎoshī ma?', vi: 'Bạn là giáo viên à?' },
        { text: '{我|wǒ}{不|bú}{是|shì}{老师|lǎoshī}。', ro: 'Wǒ bú shì lǎoshī.', vi: 'Tôi không phải là giáo viên.' },
        { text: '{谁|shéi}{是|shì}{学生|xuésheng}？', ro: 'Shéi shì xuésheng?', vi: 'Ai là học sinh?' },
        { text: '{她|tā}{叫|jiào}{什么|shénme}{名字|míngzi}？', ro: 'Tā jiào shénme míngzi?', vi: 'Cô ấy tên là gì?' },
        { text: '{王明|Wáng Míng}{是|shì}{我|wǒ}{同学|tóngxué}，{他|tā}{姓|xìng}{王|Wáng}。', ro: 'Wáng Míng shì wǒ tóngxué, tā xìng Wáng.', vi: 'Vương Minh là bạn cùng lớp của tôi, cậu ấy họ Vương.' },
      ],
    },
    {
      t: 'table',
      caption: 'Chữ của bài trong từ ghép khác — đoán nghĩa nhờ âm Hán Việt (chỉ để nhận mặt, chưa cần học)',
      head: ['Từ', 'Pinyin', 'Hán Việt', 'Nghĩa'],
      rows: [
        ['学校', 'xuéxiào', 'HỌC HIỆU', 'trường học (HSK 1 — Bài 12)'],
        ['学习', 'xuéxí', 'HỌC TẬP', 'học, học tập (HSK 1 — Bài 12)'],
        ['汉字', 'Hànzì', 'HÁN TỰ', 'chữ Hán'],
        ['生日', 'shēngrì', 'SINH NHẬT', 'sinh nhật (Bài 6)'],
        ['有名', 'yǒumíng', 'HỮU DANH', 'nổi tiếng'],
        ['友好', 'yǒuhǎo', 'HỮU HẢO', 'hữu nghị, thân thiện'],
        ['姓名', 'xìngmíng', 'TÍNH DANH', 'họ tên (trên giấy tờ)'],
        ['是非', 'shìfēi', 'THỊ PHI', 'đúng sai, chuyện thị phi'],
      ],
    },
    {
      t: 'readkanji',
      id: 'b2-doc-doan',
      title: 'Đọc to cả đoạn — chữ trần',
      note: 'Mỗi đoạn là một cảnh nhỏ. Nhìn 20 giây, đọc một hơi không dừng, rồi bấm hiện pinyin để tự chấm. Chỗ hay vấp: 是 shì (uốn lưỡi, đừng đọc sì), 谁 shéi, 不认识 bú rènshi.',
      items: [
        { text: '{你好|nǐ hǎo}！{你|nǐ}{叫|jiào}{什么|shénme}{名字|míngzi}？— {我|wǒ}{叫|jiào}{兰兰|Lánlan}。{我|wǒ}{是|shì}{留学生|liúxuéshēng}。', ro: 'Nǐ hǎo! Nǐ jiào shénme míngzi? — Wǒ jiào Lánlan. Wǒ shì liúxuéshēng.', vi: 'Chào bạn! Bạn tên là gì? — Mình tên là Lan Lan. Mình là du học sinh.' },
        { text: '{请问|qǐngwèn}，{您|nín}{贵姓|guìxìng}？— {我|wǒ}{姓|xìng}{张|Zhāng}。{我|wǒ}{是|shì}{医生|yīshēng}。', ro: 'Qǐngwèn, nín guìxìng? — Wǒ xìng Zhāng. Wǒ shì yīshēng.', vi: 'Xin hỏi, ngài họ gì ạ? — Tôi họ Trương. Tôi là bác sĩ.' },
        { text: '{他|tā}{是|shì}{谁|shéi}？{你|nǐ}{认识|rènshi}{他|tā}{吗|ma}？— {不|bú}{认识|rènshi}。{他|tā}{是|shì}{老师|lǎoshī}{吗|ma}？— {不|bú}{是|shì}，{他|tā}{是|shì}{学生|xuésheng}。', ro: 'Tā shì shéi? Nǐ rènshi tā ma? — Bú rènshi. Tā shì lǎoshī ma? — Bú shì, tā shì xuésheng.', vi: 'Anh ấy là ai? Bạn có quen anh ấy không? — Không quen. Anh ấy là giáo viên à? — Không phải, anh ấy là sinh viên.' },
        { text: '{她|tā}{姓|xìng}{李|Lǐ}，{是|shì}{我们|wǒmen}{老师|lǎoshī}。{王明|Wáng Míng}{是|shì}{我|wǒ}{同学|tóngxué}，{大伟|Dàwěi}{是|shì}{我|wǒ}{朋友|péngyou}。', ro: 'Tā xìng Lǐ, shì wǒmen lǎoshī. Wáng Míng shì wǒ tóngxué, Dàwěi shì wǒ péngyou.', vi: 'Cô ấy họ Lý, là cô giáo của chúng tôi. Vương Minh là bạn cùng lớp của tôi, Đại Vĩ là bạn tôi.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-han-tu-nhan',
      title: 'Nhận mặt chữ',
      items: [
        m('Chữ nào nghĩa là "ai"?', ['谁', '谢', '什', '是'], 0, '谁 shéi = ai, bộ 讠 (lời nói).'),
        m('Bộ thủ của 姓 là:', ['生', '女', '口', '亻'], 1, '姓 = 女 + 生, xếp vào bộ 女.'),
        m('Âm Hán Việt của 学生 là:', ['HỌC SINH', 'HỌC TẬP', 'TIÊN SINH', 'Y SINH'], 0, '学 HỌC + 生 SINH.'),
        m('Chữ 名 gồm những phần nào?', ['日 + 口', '夕 + 口', '女 + 子', '口 + 丩'], 1, '名 = 夕 (tối) + 口 (miệng): tối phải gọi tên.'),
        m('Chữ nào có bộ 口 (miệng)?', ['姓', '学', '叫', '友'], 2, '叫 = 口 + 丩.'),
        m('Chữ 友 có bao nhiêu nét?', ['3', '4', '5', '6'], 1, '友: ngang, phẩy, rồi 又 (ngang phẩy + mác) — tổng 4 nét.'),
        m('Hai chữ cùng có 子 ở dưới:', ['学 — 字', '名 — 叫', '朋 — 友', '是 — 姓'], 0, '学 và 字 đều có 子 ở dưới.'),
        m('Chữ nào đọc giống 姓 (xìng) nhưng nghĩa khác?', ['性', '生', '星', '名'], 0, '性 xìng (tính cách, giới tính) — bộ 忄. 生 shēng, 星 xīng khác thanh.'),
        m('Chữ 是 có bộ thủ:', ['日', '目', '走', '口'], 0, '是 xếp vào bộ 日 (mặt trời) ở trên.'),
      ],
    },
    {
      t: 'write',
      id: 'b2-viet-chu',
      title: 'Tập viết 12 chữ của Bài 2',
      note: 'Thứ tự gợi ý: chữ ít nét trước. Bấm ▶ xem nét → tô theo → tự viết 3 lần, đọc to pinyin mỗi lần viết. Chú ý: 叫 phần phải là 丩 (2 nét); 字 viết 宀 trước rồi 子; 是 viết 日 trước, nét cuối là mác dài; 谁 phần 隹 có 4 nét ngang.',
      chars: ['么', '什', '友', '叫', '生', '名', '字', '姓', '学', '朋', '是', '谁'],
    },
  ],
};

/* ══════════════════════════ 5. NGHE ══════════════════════════ */

const NGHE: Lesson = {
  id: 'b2-nghe',
  kind: 'listening',
  title: 'Luyện nghe Bài 2 — kiểu đề HSK 1',
  goal: 'Nghe hiểu tên, họ, nghề (学生, 老师, 医生…) trong câu và hội thoại ngắn; phân biệt câu hỏi 吗 với câu hỏi 什么 / 谁; nhận ra câu trả lời khẳng định hay phủ định (是 / 不是).',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Cách làm bài nghe',
      items: [
        'Bấm **nghe cả bài** 2 lần: lần 1 chỉ nghe, lần 2 ghi chú (tên, họ, nghề) → làm câu hỏi → rồi mới mở **lời thoại**.',
        'Từ khoá Bài 2: **叫 · 姓 · 贵姓 · 是 / 不是 · 谁 · 什么 · 认识 / 不认识 · 学生 · 老师 · 医生 · 朋友**.',
        'Nghe **họ**: sau 姓 là họ (王 Wáng, 李 Lǐ, 张 Zhāng, 刘 Liú, 陈 Chén). Nghe **tên**: sau 叫.',
        'Nghe **不是 / 不认识**: thông tin bị phủ định — câu tiếp theo thường nói thông tin đúng: 不是，她是老师.',
      ],
    },
    {
      t: 'note',
      title: 'Dạng đề HSK 1 (phần Nghe — 听力) dùng trong bài này',
      items: [
        '**Phần 1**: nghe một cụm/câu ngắn, phán đoán tranh đúng hay sai → *Bài nghe 1* (câu "đúng/sai" với mô tả bằng chữ).',
        '**Phần 3**: nghe hội thoại hai câu, chọn tranh khớp → *Bài nghe 2*.',
        '**Phần 4**: nghe một câu/đoạn ngắn, trả lời câu hỏi chọn 1 trong 3 → *Bài nghe 3, 4, 5*.',
        'Trong đề thật mỗi đoạn được đọc **hai lần**. Ở đây bạn tự bấm nghe lại bao nhiêu lần cũng được — nhưng hãy thử làm sau đúng 2 lần nghe.',
      ],
    },

    { t: 'h', text: 'Bài nghe 1 — Đúng hay sai?' },
    {
      t: 'listen',
      id: 'b2-nghe-1',
      title: 'Bốn câu giới thiệu',
      note: 'Mỗi câu đi kèm một mô tả ở câu hỏi. Nghe → chọn "Đúng" nếu câu nghe khớp với mô tả.',
      lines: [
        { who: 'Câu 1', voice: 'zh-nu', text: '{我|wǒ}{是|shì}{老师|lǎoshī}。', ro: 'Wǒ shì lǎoshī.', vi: 'Tôi là giáo viên.' },
        { who: 'Câu 2', voice: 'zh-nam', text: '{我|wǒ}{姓|xìng}{王|Wáng}。', ro: 'Wǒ xìng Wáng.', vi: 'Tôi họ Vương.' },
        { who: 'Câu 3', voice: 'zh-nu', text: '{她|tā}{不|bú}{是|shì}{医生|yīshēng}。', ro: 'Tā bú shì yīshēng.', vi: 'Cô ấy không phải là bác sĩ.' },
        { who: 'Câu 4', voice: 'zh-nam', text: '{他|tā}{是|shì}{我|wǒ}{朋友|péngyou}。', ro: 'Tā shì wǒ péngyou.', vi: 'Anh ấy là bạn tôi.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-nghe-q1',
      title: 'Câu hỏi bài nghe 1',
      items: [
        m('Câu 1 — Mô tả: "Một cô giáo đứng trên bục giảng." Đúng hay sai?', ['Đúng', 'Sai'], 0, '我是老师 — tôi là giáo viên.'),
        m('Câu 2 — Mô tả: "Người đàn ông này họ Lý." Đúng hay sai?', ['Đúng', 'Sai'], 1, '我姓王 — họ Vương (Wáng), không phải Lý (Lǐ).'),
        m('Câu 3 — Mô tả: "Cô ấy là bác sĩ." Đúng hay sai?', ['Đúng', 'Sai'], 1, '她不是医生 — cô ấy KHÔNG phải bác sĩ. Nghe kỹ 不.'),
        m('Câu 4 — Mô tả: "Hai người bạn đứng cạnh nhau." Đúng hay sai?', ['Đúng', 'Sai'], 0, '他是我朋友 — anh ấy là bạn tôi.'),
      ],
    },

    { t: 'h', text: 'Bài nghe 2 — Hai câu hội thoại' },
    {
      t: 'listen',
      id: 'b2-nghe-2',
      title: 'Ba cặp hỏi — đáp',
      note: 'Mỗi cặp: một người hỏi, người kia đáp. Chú ý câu ĐÁP chứa thông tin gì.',
      lines: [
        { who: 'Cặp 1 — Nam', voice: 'zh-nam', text: '{你|nǐ}{叫|jiào}{什么|shénme}{名字|míngzi}？', ro: 'Nǐ jiào shénme míngzi?', vi: 'Bạn tên là gì?' },
        { who: 'Cặp 1 — Nữ', voice: 'zh-nu', text: '{我|wǒ}{叫|jiào}{安娜|Ānnà}。', ro: 'Wǒ jiào Ānnà.', vi: 'Mình tên là Anna.' },
        { who: 'Cặp 2 — Nữ', voice: 'zh-nu', text: '{请问|qǐngwèn}，{您|nín}{贵姓|guìxìng}？', ro: 'Qǐngwèn, nín guìxìng?', vi: 'Xin hỏi, ông họ gì ạ?' },
        { who: 'Cặp 2 — Nam', voice: 'zh-nam', text: '{我|wǒ}{姓|xìng}{刘|Liú}，{我|wǒ}{是|shì}{医生|yīshēng}。', ro: 'Wǒ xìng Liú, wǒ shì yīshēng.', vi: 'Tôi họ Lưu, tôi là bác sĩ.' },
        { who: 'Cặp 3 — Nam', voice: 'zh-nam', text: '{她|tā}{是|shì}{谁|shéi}？', ro: 'Tā shì shéi?', vi: 'Cô ấy là ai?' },
        { who: 'Cặp 3 — Nữ', voice: 'zh-nu', text: '{她|tā}{是|shì}{我们|wǒmen}{老师|lǎoshī}，{她|tā}{姓|xìng}{李|Lǐ}。', ro: 'Tā shì wǒmen lǎoshī, tā xìng Lǐ.', vi: 'Cô ấy là cô giáo của chúng mình, cô họ Lý.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-nghe-q2',
      title: 'Câu hỏi bài nghe 2',
      items: [
        m('Cặp 1: người nữ tên là gì?', ['兰兰', '安娜', '李老师'], 1, '我叫安娜。'),
        m('Cặp 2: người đàn ông họ gì, làm nghề gì?', ['Họ Lý, giáo viên', 'Họ Lưu, bác sĩ', 'Họ Vương, sinh viên'], 1, '我姓刘 (Liú)，我是医生。'),
        m('Cặp 2: câu hỏi 您贵姓 cho thấy người nữ…', ['rất thân với người đàn ông', 'hỏi lịch sự người chưa quen / lớn tuổi', 'đang giận'], 1, '请问 + 您贵姓 — cách hỏi họ lịch sự.'),
        m('Cặp 3: người được hỏi tới là ai?', ['Một bạn học họ Lý', 'Cô giáo họ Lý', 'Bác sĩ họ Lý'], 1, '她是我们老师，她姓李。'),
      ],
    },

    { t: 'h', text: 'Bài nghe 3 — Ngày đầu ở ký túc xá' },
    {
      t: 'listen',
      id: 'b2-nghe-3',
      title: 'Anna gặp Vương Minh',
      lines: [
        { who: '安娜', voice: 'zh-nu', text: '{你好|nǐ hǎo}！{你|nǐ}{是|shì}{王明|Wáng Míng}{吗|ma}？', ro: 'Nǐ hǎo! Nǐ shì Wáng Míng ma?', vi: 'Chào bạn! Bạn là Vương Minh à?' },
        { who: '王明', voice: 'zh-nam', text: '{对|duì}，{我|wǒ}{是|shì}{王明|Wáng Míng}。{你|nǐ}{叫|jiào}{什么|shénme}{名字|míngzi}？', ro: 'Duì, wǒ shì Wáng Míng. Nǐ jiào shénme míngzi?', vi: 'Đúng, mình là Vương Minh. Bạn tên là gì?' },
        { who: '安娜', voice: 'zh-nu', text: '{我|wǒ}{叫|jiào}{安娜|Ānnà}。{我|wǒ}{是|shì}{兰兰|Lánlan}{的|de}{朋友|péngyou}。', ro: 'Wǒ jiào Ānnà. Wǒ shì Lánlan de péngyou.', vi: 'Mình tên là Anna. Mình là bạn của Lan Lan.' },
        { who: '王明', voice: 'zh-nam', text: '{安娜|Ānnà}，{你好|nǐ hǎo}！{你|nǐ}{是|shì}{老师|lǎoshī}{吗|ma}？', ro: 'Ānnà, nǐ hǎo! Nǐ shì lǎoshī ma?', vi: 'Anna, chào bạn! Bạn là giáo viên à?' },
        { who: '安娜', voice: 'zh-nu', text: '{不|bú}{是|shì}，{我|wǒ}{是|shì}{学生|xuésheng}。{我|wǒ}{是|shì}{留学生|liúxuéshēng}。', ro: 'Bú shì, wǒ shì xuésheng. Wǒ shì liúxuéshēng.', vi: 'Không phải, mình là sinh viên. Mình là du học sinh.' },
        { who: '王明', voice: 'zh-nam', text: '{很|hěn}{高兴|gāoxìng}{认识|rènshi}{你|nǐ}！', ro: 'Hěn gāoxìng rènshi nǐ!', vi: 'Rất vui được làm quen với bạn!' },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-nghe-q3',
      title: 'Câu hỏi bài nghe 3',
      items: [
        m('Anna hỏi câu đầu tiên để làm gì?', ['Hỏi tên Vương Minh (chưa biết gì)', 'Xác nhận người kia có phải Vương Minh không', 'Hỏi Vương Minh có khoẻ không'], 1, '你是王明吗？ — câu hỏi 吗 để xác nhận.'),
        m('Anna là ai?', ['Giáo viên', 'Bạn của Lan Lan, du học sinh', 'Bạn cùng lớp của Vương Minh'], 1, '我是兰兰的朋友……我是留学生。'),
        m('Vương Minh nghĩ Anna là gì? Đúng không?', ['Nghĩ là giáo viên — sai', 'Nghĩ là bác sĩ — đúng', 'Nghĩ là sinh viên — đúng'], 0, '你是老师吗？— 不是，我是学生。'),
        m('Câu cuối 很高兴认识你 dùng khi nào?', ['Khi chia tay', 'Khi vừa làm quen', 'Khi xin lỗi'], 1, 'Câu làm quen.'),
      ],
    },

    { t: 'h', text: 'Bài nghe 4 — Ai là ai trong ảnh?' },
    {
      t: 'listen',
      id: 'b2-nghe-4',
      title: 'Lan cho Đại Vĩ xem ảnh lớp',
      note: 'Lan chỉ vào từng người trong ảnh. Ghi lại: tên — họ — là ai.',
      lines: [
        { who: '大伟', voice: 'zh-nam', text: '{兰兰|Lánlan}，{她|tā}{是|shì}{谁|shéi}？', ro: 'Lánlan, tā shì shéi?', vi: 'Lan Lan, cô ấy là ai?' },
        { who: '兰兰', voice: 'zh-nu', text: '{她|tā}{是|shì}{李|Lǐ}{老师|lǎoshī}，{是|shì}{我们|wǒmen}{的|de}{汉语|Hànyǔ}{老师|lǎoshī}。', ro: 'Tā shì Lǐ lǎoshī, shì wǒmen de Hànyǔ lǎoshī.', vi: 'Cô ấy là cô Lý, cô giáo tiếng Trung của bọn mình.' },
        { who: '大伟', voice: 'zh-nam', text: '{他|tā}{是|shì}{谁|shéi}？{他|tā}{是|shì}{老师|lǎoshī}{吗|ma}？', ro: 'Tā shì shéi? Tā shì lǎoshī ma?', vi: 'Còn anh ấy là ai? Anh ấy là giáo viên à?' },
        { who: '兰兰', voice: 'zh-nu', text: '{不|bú}{是|shì}。{他|tā}{叫|jiào}{陈|Chén}{文|Wén}，{是|shì}{我|wǒ}{同学|tóngxué}。', ro: 'Bú shì. Tā jiào Chén Wén, shì wǒ tóngxué.', vi: 'Không phải. Anh ấy tên là Trần Văn, là bạn cùng lớp của mình.' },
        { who: '大伟', voice: 'zh-nam', text: '{你|nǐ}{认识|rènshi}{张|Zhāng}{医生|yīshēng}{吗|ma}？', ro: 'Nǐ rènshi Zhāng yīshēng ma?', vi: 'Bạn có quen bác sĩ Trương không?' },
        { who: '兰兰', voice: 'zh-nu', text: '{不|bú}{认识|rènshi}。{谁|shéi}{是|shì}{张|Zhāng}{医生|yīshēng}？', ro: 'Bú rènshi. Shéi shì Zhāng yīshēng?', vi: 'Không quen. Ai là bác sĩ Trương?' },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-nghe-q4',
      title: 'Câu hỏi bài nghe 4',
      items: [
        m('Người phụ nữ trong ảnh là ai?', ['Bác sĩ Trương', 'Cô Lý — cô giáo tiếng Trung', 'Bạn cùng lớp của Lan'], 1, '她是李老师，是我们的汉语老师。 (汉语 = tiếng Trung, từ của Bài 13)'),
        m('Người đàn ông trong ảnh tên gì?', ['王明', '陈文', '大伟'], 1, '他叫陈文 (Chén Wén).'),
        m('Trần Văn có phải giáo viên không?', ['Phải', 'Không — là bạn cùng lớp của Lan', 'Không nói'], 1, '不是……是我同学。'),
        m('Lan có quen bác sĩ Trương không?', ['Có', 'Không', 'Không nói'], 1, '不认识。'),
        m('Câu 谁是张医生？ là kiểu câu hỏi gì?', ['Hỏi có/không', 'Hỏi thông tin: ai?', 'Câu chào'], 1, '谁 hỏi người — không cần 吗.'),
      ],
    },

    { t: 'h', text: 'Bài nghe 5 — Ở quầy căng tin' },
    {
      t: 'listen',
      id: 'b2-nghe-5',
      title: 'Bà chủ quầy hỏi chuyện Lan',
      note: 'Có 2 người nói. Chú ý họ và tên của từng người, và ai là gì.',
      lines: [
        { who: '老板', voice: 'zh-nu', text: '{同学|tóngxué}，{你好|nǐ hǎo}！{你|nǐ}{是|shì}{留学生|liúxuéshēng}{吗|ma}？', ro: 'Tóngxué, nǐ hǎo! Nǐ shì liúxuéshēng ma?', vi: 'Chào cháu! Cháu là du học sinh à?' },
        { who: '兰兰', voice: 'zh-nu', text: '{是|shì}，{我|wǒ}{是|shì}{留学生|liúxuéshēng}。{您|nín}{贵姓|guìxìng}？', ro: 'Shì, wǒ shì liúxuéshēng. Nín guìxìng?', vi: 'Vâng, cháu là du học sinh. Cô họ gì ạ?' },
        { who: '老板', voice: 'zh-nu', text: '{我|wǒ}{姓|xìng}{张|Zhāng}。{你|nǐ}{叫|jiào}{什么|shénme}{名字|míngzi}？', ro: 'Wǒ xìng Zhāng. Nǐ jiào shénme míngzi?', vi: 'Cô họ Trương. Cháu tên là gì?' },
        { who: '兰兰', voice: 'zh-nu', text: '{我|wǒ}{姓|xìng}{阮|Ruǎn}，{叫|jiào}{阮氏兰|Ruǎn Shì Lán}。{叫|jiào}{我|wǒ}{兰兰|Lánlan}！', ro: 'Wǒ xìng Ruǎn, jiào Ruǎn Shì Lán. Jiào wǒ Lánlan!', vi: 'Cháu họ Nguyễn, tên là Nguyễn Thị Lan. Cô cứ gọi cháu là Lan Lan ạ!' },
        { who: '老板', voice: 'zh-nu', text: '{兰兰|Lánlan}，{很|hěn}{高兴|gāoxìng}{认识|rènshi}{你|nǐ}！{你|nǐ}{认识|rènshi}{王明|Wáng Míng}{吗|ma}？', ro: 'Lánlan, hěn gāoxìng rènshi nǐ! Nǐ rènshi Wáng Míng ma?', vi: 'Lan Lan, cô rất vui được biết cháu! Cháu có quen Vương Minh không?' },
        { who: '兰兰', voice: 'zh-nu', text: '{认识|rènshi}！{他|tā}{是|shì}{我|wǒ}{同学|tóngxué}。', ro: 'Rènshi! Tā shì wǒ tóngxué.', vi: 'Có ạ! Cậu ấy là bạn cùng lớp của cháu.' },
        { who: '老板', voice: 'zh-nu', text: '{王明|Wáng Míng}{是|shì}{我|wǒ}{朋友|péngyou}{的|de}{学生|xuésheng}。', ro: 'Wáng Míng shì wǒ péngyou de xuésheng.', vi: 'Vương Minh là học trò của bạn cô đấy.' },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-nghe-q5',
      title: 'Câu hỏi bài nghe 5',
      items: [
        m('Bà chủ quầy họ gì?', ['王', '李', '张', '阮'], 2, '我姓张 (Zhāng).'),
        m('Họ của Lan trong tiếng Trung là:', ['阮 Ruǎn', '兰 Lán', '王 Wáng', '陈 Chén'], 0, '我姓阮 — họ Nguyễn.'),
        m('Lan muốn bà chủ gọi mình là gì?', ['阮氏兰', '兰兰', '小阮'], 1, '叫我兰兰！'),
        m('Lan có quen Vương Minh không, vì sao?', ['Không quen', 'Quen — là bạn cùng lớp', 'Quen — là anh trai'], 1, '认识！他是我同学。'),
        m('Lan dùng câu nào để hỏi họ bà chủ?', ['你叫什么名字？', '您贵姓？', '你是谁？'], 1, 'Với người lớn tuổi: 您贵姓？'),
      ],
    },
  ],
};

/* ══════════════════════════ 6. NÓI ══════════════════════════ */

const NOI: Lesson = {
  id: 'b2-noi',
  kind: 'speaking',
  title: 'Luyện nói Bài 2 — giới thiệu tên, họ, mình là ai; hỏi người khác',
  goal: 'Nói trôi chảy và đúng thanh 12 câu then chốt của Bài 2, tự giới thiệu bản thân 3–4 câu và trả lời được câu hỏi về tên, họ, nghề của giám khảo và 📞 CuongMini.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Luyện nói thế nào',
      items: [
        '**Phát âm từng câu**: bấm nghe mẫu → ghi âm → máy chấm từng chữ. Chữ dưới 80 điểm: nghe lại, để ý **thanh điệu** và **uốn lưỡi**.',
        'Âm khó của bài: **shì / shéi / shénme** (sh uốn lưỡi — đừng thành "sư" phẳng), **jiào** (j không bật hơi), **xìng** (x, -ing mũi sau), **bú shì** (不 đổi thanh), **míngzi / péngyou / xuésheng** (chữ sau nhẹ).',
        'Câu ngắn trước, câu dài sau. Danh sách này cũng là bộ câu cho 📞 **CuongMini** (gọi gia sư) trong bài.',
        'Cuối bài: trả lời 5 câu hỏi của giám khảo bằng **câu đầy đủ** — 我叫…, 我姓…, 我是…',
      ],
    },
    {
      t: 'phatam',
      id: 'b2-noi-phat-am',
      title: '12 câu then chốt — ngắn đến dài',
      note: 'Pinyin ghi theo từ điển; 不 ghi theo cách đọc (bú shì). Mỗi câu đọc 3 lần: chậm → bình thường → không nhìn pinyin. Thay tên của bạn vào các câu tự giới thiệu khi luyện với CuongMini.',
      items: [
        { text: '{是|shì}。', ipa: 'Shì.', vi: 'Vâng / Phải. — sh uốn lưỡi, thanh 4 rơi mạnh' },
        { text: '{不|bú}{是|shì}。', ipa: 'Bú shì.', vi: 'Không phải. — 不 đọc bú' },
        { text: '{他|tā}{是|shì}{谁|shéi}？', ipa: 'Tā shì shéi?', vi: 'Anh ấy là ai? — shì rơi, shéi đi lên' },
        { text: '{您|nín}{贵姓|guìxìng}？', ipa: 'Nín guìxìng?', vi: 'Ngài họ gì ạ? — hai thanh 4 liền' },
        { text: '{我|wǒ}{姓|xìng}{王|Wáng}。', ipa: 'Wǒ xìng Wáng.', vi: 'Tôi họ Vương.' },
        { text: '{我|wǒ}{叫|jiào}{兰兰|Lánlan}。', ipa: 'Wǒ jiào Lánlan.', vi: 'Tôi tên là Lan Lan.' },
        { text: '{我|wǒ}{是|shì}{学生|xuésheng}。', ipa: 'Wǒ shì xuésheng.', vi: 'Tôi là sinh viên. — 生 đọc nhẹ' },
        { text: '{你|nǐ}{叫|jiào}{什么|shénme}{名字|míngzi}？', ipa: 'Nǐ jiào shénme míngzi?', vi: 'Bạn tên là gì? — 么, 字 nhẹ' },
        { text: '{你|nǐ}{是|shì}{老师|lǎoshī}{吗|ma}？', ipa: 'Nǐ shì lǎoshī ma?', vi: 'Bạn là giáo viên à?' },
        { text: '{请问|qǐngwèn}，{你|nǐ}{认识|rènshi}{他|tā}{吗|ma}？', ipa: 'Qǐngwèn, nǐ rènshi tā ma?', vi: 'Cho hỏi, bạn có quen anh ấy không?' },
        { text: '{我|wǒ}{姓|xìng}{阮|Ruǎn}，{叫|jiào}{阮氏兰|Ruǎn Shì Lán}，{我|wǒ}{是|shì}{留学生|liúxuéshēng}。', ipa: 'Wǒ xìng Ruǎn, jiào Ruǎn Shì Lán, wǒ shì liúxuéshēng.', vi: 'Tôi họ Nguyễn, tên Nguyễn Thị Lan, tôi là du học sinh.' },
        { text: '{他|tā}{不|bú}{是|shì}{老师|lǎoshī}，{他|tā}{是|shì}{我|wǒ}{朋友|péngyou}。', ipa: 'Tā bú shì lǎoshī, tā shì wǒ péngyou.', vi: 'Anh ấy không phải giáo viên, anh ấy là bạn tôi.' },
      ],
    },

    { t: 'h', text: 'Mẫu tự giới thiệu — 4 câu' },
    {
      t: 'p',
      text: 'Đây là "bộ khung" bạn sẽ dùng suốt đời học tiếng Trung — ở lớp, khi đi phỏng vấn, khi gặp bạn mới. Thay phần in đậm bằng thông tin của bạn (họ tên Hán Việt ở bảng họ Việt trong phần Hội thoại). Bài 3 sẽ thêm câu quốc tịch: 我是越南人.',
    },
    {
      t: 'examples',
      items: [
        { en: '{大家好|dàjiā hǎo}！', ro: 'Dàjiā hǎo!', vi: 'Chào mọi người!' },
        { en: '{我|wǒ}{姓|xìng}{陈|Chén}，{叫|jiào}{陈文明|Chén Wén Míng}。', ro: 'Wǒ xìng Chén, jiào Chén Wén Míng.', vi: 'Tôi họ **Trần**, tên là **Trần Văn Minh**.' },
        { en: '{我|wǒ}{是|shì}{学生|xuésheng}。', ro: 'Wǒ shì xuésheng.', vi: 'Tôi là **sinh viên**.' },
        { en: '{很|hěn}{高兴|gāoxìng}{认识|rènshi}{大家|dàjiā}！', ro: 'Hěn gāoxìng rènshi dàjiā!', vi: 'Rất vui được làm quen với mọi người!' },
      ],
    },

    { t: 'h', text: 'Hỏi — đáp mẫu với giám khảo' },
    {
      t: 'p',
      text: 'Phần đầu của bài thi nói **HSKK sơ cấp** và của mọi buổi phỏng vấn tiếng Trung đều là hỏi tên, họ, bạn là ai. Giám khảo hỏi chậm; bạn trả lời bằng **câu đầy đủ**, có chủ ngữ.',
    },
    {
      t: 'dialogue',
      title: 'Giám khảo ↔ thí sinh',
      lines: [
        { who: 'Giám khảo', role: 'examiner', text: '{你好|nǐ hǎo}！{你|nǐ}{叫|jiào}{什么|shénme}{名字|míngzi}？', ro: 'Nǐ hǎo! Nǐ jiào shénme míngzi?', vi: 'Chào em! Em tên là gì?' },
        { who: 'Thí sinh', role: 'candidate', text: '{老师|lǎoshī}{好|hǎo}！{我|wǒ}{叫|jiào}{阮氏兰|Ruǎn Shì Lán}。', ro: 'Lǎoshī hǎo! Wǒ jiào Ruǎn Shì Lán.', vi: 'Em chào thầy ạ! Em tên là Nguyễn Thị Lan.' },
        { who: 'Giám khảo', role: 'examiner', text: '{你|nǐ}{姓|xìng}{什么|shénme}？', ro: 'Nǐ xìng shénme?', vi: 'Em họ gì?' },
        { who: 'Thí sinh', role: 'candidate', text: '{我|wǒ}{姓|xìng}{阮|Ruǎn}。', ro: 'Wǒ xìng Ruǎn.', vi: 'Em họ Nguyễn ạ.' },
        { who: 'Giám khảo', role: 'examiner', text: '{你|nǐ}{是|shì}{学生|xuésheng}{吗|ma}？', ro: 'Nǐ shì xuésheng ma?', vi: 'Em là sinh viên phải không?' },
        { who: 'Thí sinh', role: 'candidate', text: '{是|shì}，{我|wǒ}{是|shì}{大学生|dàxuéshēng}。', ro: 'Shì, wǒ shì dàxuéshēng.', vi: 'Vâng, em là sinh viên đại học ạ.' },
        { who: 'Giám khảo', role: 'examiner', text: '{你|nǐ}{认识|rènshi}{我|wǒ}{吗|ma}？', ro: 'Nǐ rènshi wǒ ma?', vi: 'Em có biết thầy không?' },
        { who: 'Thí sinh', role: 'candidate', text: '{不|bú}{认识|rènshi}。{请问|qǐngwèn}，{您|nín}{贵姓|guìxìng}？', ro: 'Bú rènshi. Qǐngwèn, nín guìxìng?', vi: 'Em không biết ạ. Xin hỏi, thầy họ gì ạ?' },
        { who: 'Giám khảo', role: 'examiner', text: '{我|wǒ}{姓|xìng}{刘|Liú}。{好|hǎo}，{谢谢|xièxie}{你|nǐ}！', ro: 'Wǒ xìng Liú. Hǎo, xièxie nǐ!', vi: 'Thầy họ Lưu. Được rồi, cảm ơn em!' },
        { who: 'Thí sinh', role: 'candidate', text: '{刘|Liú}{老师|lǎoshī}，{很|hěn}{高兴|gāoxìng}{认识|rènshi}{您|nín}！{再见|zàijiàn}！', ro: 'Liú lǎoshī, hěn gāoxìng rènshi nín! Zàijiàn!', vi: 'Thưa thầy Lưu, em rất vui được biết thầy! Em chào thầy ạ!' },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo để không mất điểm',
      items: [
        'Trả lời **có chủ ngữ và động từ**: hỏi 你叫什么名字 → **我叫…**, không chỉ đọc tên trống trơn.',
        'Hỏi 你姓什么 → **我姓 + họ** (một chữ), đừng đọc cả họ tên.',
        'Hỏi 你是学生吗 → **是，我是学生** / **不是，我是…** — đừng đáp "有" hay "好".',
        'Tên Việt đọc theo **pinyin của chữ Hán** (Ruǎn Shì Lán), không đọc kiểu tiếng Việt "Nguyễn Thị Lan" — giám khảo sẽ khó nghe. Nếu chưa biết chữ Hán của tên mình, có thể nói tên tiếng Việt rồi thêm 我是越南人 (Bài 3).',
        'Kết thúc lễ phép: **很高兴认识您 / 谢谢老师 / 老师再见**.',
      ],
    },

    { t: 'h', text: 'Đến lượt bạn' },
    {
      t: 'p',
      text: 'Năm câu hỏi dưới đây sẽ được đọc lên (bấm vào câu để nghe). Ghi âm câu trả lời **bằng thông tin thật của bạn**, rồi nghe lại và so với mẫu. Pinyin và nghĩa của câu hỏi:',
    },
    {
      t: 'examples',
      items: [
        { en: '{你|nǐ}{叫|jiào}{什么|shénme}{名字|míngzi}？', ro: 'Nǐ jiào shénme míngzi?', vi: 'Bạn tên là gì? → 我叫……' },
        { en: '{你|nǐ}{姓|xìng}{什么|shénme}？', ro: 'Nǐ xìng shénme?', vi: 'Bạn họ gì? → 我姓……' },
        { en: '{你|nǐ}{是|shì}{学生|xuésheng}{吗|ma}？', ro: 'Nǐ shì xuésheng ma?', vi: 'Bạn là sinh viên à? → 是，我是学生。/ 不是，我是……' },
        { en: '{你|nǐ}{认识|rènshi}{王明|Wáng Míng}{吗|ma}？', ro: 'Nǐ rènshi Wáng Míng ma?', vi: 'Bạn có quen Vương Minh không? → 认识。/ 不认识。' },
        { en: '{你|nǐ}{朋友|péngyou}{叫|jiào}{什么|shénme}{名字|míngzi}？', ro: 'Nǐ péngyou jiào shénme míngzi?', vi: 'Bạn của bạn tên là gì? → 我朋友叫……' },
      ],
    },
    {
      t: 'speak',
      id: 'b2-noi-ghi-am',
      part: '1',
      questions: ['你叫什么名字？', '你姓什么？', '你是学生吗？', '你认识王明吗？', '你朋友叫什么名字？'],
    },
  ],
};

/* ══════════════════════════ 7. BÀI TẬP ══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b2-bai-tap',
  kind: 'homework',
  title: 'Bài tập Bài 2 — dịch, pinyin, trắc nghiệm, ghép câu, sửa câu, đọc hiểu',
  goal: 'Tự kiểm tra toàn bộ Bài 2: viết được câu hỏi và trả lời về tên, họ, "là ai" bằng chữ Hán; viết đúng pinyin; phân biệt 叫/姓/是 và 吗/什么/谁; đọc hiểu một đoạn giới thiệu ngắn.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Trước khi làm bài',
      items: [
        'Ô dịch Việt → Trung: gõ **chữ Hán** (bàn phím Pinyin: gõ "jiao" chọn 叫, "shenme" chọn 什么). Dấu câu có hay không đều được chấm đúng.',
        'Ô pinyin: gõ **có dấu** (míngzi) hoặc **dạng số** (ming2zi; thanh nhẹ = 5 hoặc bỏ số).',
        'Công thức cần nhớ: **S + 叫 + tên** · **S + 姓 + họ** · **S + 是 + N** · **câu kể + 吗？** · **什么 / 谁 không đi với 吗**.',
        'Đạt ≥ 80% → sang Bài 3. Dưới 70% → xem lại phần Ngữ pháp (nhất là ③ 是 và ⑤ 什么 / 谁).',
      ],
    },
    { t: 'h', text: '1. Dịch sang tiếng Trung (viết chữ Hán)' },
    {
      t: 'quiz',
      id: 'b2-bt-dich',
      title: 'Dịch Việt → Trung',
      kind: 'translate',
      grammar: 'S + 叫 + tên · S + 姓 + họ · S + 是 + N · S + 不是 + N · câu kể + 吗 · 什么 / 谁 · 认识 + người',
      items: [
        { q: 'Bạn tên là gì?', answers: ['你叫什么名字？', '你叫什么？'], hint: '你 · 叫 · 什么 · 名字' },
        { q: 'Tôi tên là Vương Minh.', answers: ['我叫王明。', '我是王明。'], hint: '我 · 叫 · 王明' },
        { q: 'Xin hỏi, ngài họ gì ạ?', answers: ['请问，您贵姓？', '请问您贵姓？'], hint: '请问 · 您 · 贵姓' },
        { q: 'Tôi họ Lý.', answers: ['我姓李。'], hint: '我 · 姓 · 李' },
        { q: 'Tôi là sinh viên.', answers: ['我是学生。', '我是大学生。'], hint: '我 · 是 · 学生' },
        { q: 'Cô ấy là giáo viên à?', answers: ['她是老师吗？'], hint: '她 · 是 · 老师 · 吗' },
        { q: 'Anh ấy là ai?', answers: ['他是谁？'], hint: '他 · 是 · 谁' },
        { q: 'Tôi không phải là bác sĩ.', answers: ['我不是医生。'], hint: '我 · 不是 · 医生' },
        { q: 'Bạn có quen Anna không?', answers: ['你认识安娜吗？'], hint: '你 · 认识 · 安娜 · 吗' },
        { q: 'Ai là giáo viên?', answers: ['谁是老师？'], hint: '谁 · 是 · 老师' },
        { q: 'Đại Vĩ là bạn tôi.', answers: ['大伟是我朋友。', '大伟是我的朋友。'], hint: '大伟 · 是 · 我 · 朋友' },
        { q: 'Rất vui được làm quen với bạn!', answers: ['很高兴认识你！', '认识你很高兴！', '认识你，我很高兴！'], hint: '很 · 高兴 · 认识 · 你' },
        { q: 'Cô ấy họ gì?', answers: ['她姓什么？'], hint: '她 · 姓 · 什么' },
        { q: 'Chúng tôi là bạn cùng lớp.', answers: ['我们是同学。'], hint: '我们 · 是 · 同学' },
      ],
    },

    { t: 'h', text: '2. Viết pinyin' },
    {
      t: 'quiz',
      id: 'b2-bt-pinyin',
      title: 'Viết pinyin có dấu thanh (hoặc dạng số)',
      kind: 'fill',
      grammar: 'Âm tiết trong một từ viết liền · thanh nhẹ không dấu · 不 trước thanh 4 ghi bú',
      items: [
        { q: '名字 (tên)', answers: py('míngzi', 'ming2zi', 'ming2zi5', 'míng zi', 'ming2 zi', 'ming2 zi5'), hint: '2 + nhẹ' },
        { q: '什么 (gì)', answers: py('shénme', 'shen2me', 'shen2me5', 'shén me', 'shen2 me', 'shen2 me5'), hint: '2 + nhẹ' },
        { q: '学生 (học sinh)', answers: py('xuésheng', 'xue2sheng', 'xue2sheng5', 'xué sheng', 'xue2 sheng', 'xue2 sheng5'), hint: '2 + nhẹ' },
        { q: '朋友 (bạn bè)', answers: py('péngyou', 'peng2you', 'peng2you5', 'péng you', 'peng2 you', 'peng2 you5'), hint: '2 + nhẹ' },
        { q: '贵姓 (quý danh)', answers: py('guìxìng', 'gui4xing4', 'guì xìng', 'gui4 xing4'), hint: '4 + 4' },
        { q: '请问 (xin hỏi)', answers: py('qǐngwèn', 'qing3wen4', 'qǐng wèn', 'qing3 wen4'), hint: '3 + 4' },
        { q: '医生 (bác sĩ)', answers: py('yīshēng', 'yi1sheng1', 'yī shēng', 'yi1 sheng1'), hint: '1 + 1' },
        { q: '不是 (không phải)', answers: py('bú shì', 'bu2 shi4', 'búshì', 'bu2shi4'), hint: '不 trước thanh 4' },
        { q: '谁 (ai)', answers: py('shéi', 'shei2', 'shuí', 'shui2'), hint: 'thanh 2' },
      ],
    },

    { t: 'h', text: '3. Trắc nghiệm tổng hợp' },
    {
      t: 'mcq',
      id: 'b2-bt-trac-nghiem',
      title: 'Chọn câu đúng / phù hợp',
      items: [
        m('Gặp một ông cụ lần đầu, muốn hỏi họ, bạn nói:', ['你叫什么？', '请问，您贵姓？', '你是谁？', '你姓吗？'], 1, 'Người lớn tuổi, lần đầu gặp → 请问，您贵姓？'),
        m('"Tôi là giáo viên." là:', ['我很老师。', '我是老师。', '我老师是。', '我叫老师。'], 1, 'S + 是 + N.'),
        m('Câu nào **đúng**?', ['他是谁吗？', '你叫什么名字吗？', '她是老师吗？', '谁是吗老师？'], 2, 'Chỉ câu 吗 không có từ để hỏi mới thêm 吗.'),
        m('你认识大伟吗？— 不认识。 Người trả lời…', ['quen Đại Vĩ', 'không quen Đại Vĩ', 'chính là Đại Vĩ', 'không nghe rõ'], 1, '不认识 = không quen.'),
        m('Chọn từ đúng: 我（　）阮，（　）阮氏兰。', ['叫 — 姓', '姓 — 叫', '是 — 姓', '姓 — 是'], 1, '我姓阮 (họ)，叫阮氏兰 (họ tên).'),
        m('Ai đó hỏi 她是谁？ — câu trả lời phù hợp:', ['是，她是。', '她是安娜。', '她很好。', '她姓吗？'], 1, 'Câu hỏi 谁 cần thông tin: 她是安娜.'),
        m('"Anh ấy không phải sinh viên, anh ấy là giáo viên." là:', ['他不是学生，他是老师。', '他是不学生，他是老师。', '他不学生，是老师。', '他没是学生，他是老师。'], 0, 'Phủ định 是 = 不是, đứng trước danh từ.'),
        m('先生 trong 王先生 nghĩa là:', ['thầy Vương', 'ông Vương', 'học sinh Vương', 'bác sĩ Vương'], 1, '先生 = ông; thầy giáo là 老师.'),
        m('Đọc đúng 你是谁：', ['nǐ sì suí', 'nǐ shì shéi', 'nǐ shí shèi', 'ní shì shéi'], 1, 'shì uốn lưỡi, thanh 4; shéi thanh 2. 你 + 是 (thanh 4) không biến điệu.'),
        m('Bạn muốn hỏi xác nhận: "Bạn là Anna phải không?"', ['你是安娜吗？', '你是谁？', '你叫什么名字？', '安娜是谁？'], 0, 'Xác nhận có/không → câu 吗.'),
        m('Câu trả lời đúng cho 您贵姓？', ['我贵姓张。', '我姓张。', '我是张。', '张贵姓。'], 1, '我姓 + họ.'),
        m('Bạn cùng lớp của bạn → giới thiệu: "Cậu ấy là bạn cùng lớp của tôi":', ['他是我同学。', '他很同学。', '他同学是我。', '他叫我同学。'], 0, 'S + 是 + N: 他是我同学.'),
      ],
    },

    { t: 'h', text: '4. Ghép câu' },
    {
      t: 'build',
      id: 'b2-bt-ghep',
      title: 'Ghép thành câu đúng',
      items: [
        { vi: 'Cô ấy tên là gì?', chips: ['{她|tā}', '{叫|jiào}', '{什么|shénme}', '{名字|míngzi}', '{谁|shéi}'], answer: ['{她|tā}', '{叫|jiào}', '{什么|shénme}', '{名字|míngzi}'], ro: 'Tā jiào shénme míngzi?' },
        { vi: 'Anh ấy họ Trương.', chips: ['{他|tā}', '{姓|xìng}', '{张|Zhāng}', '{叫|jiào}'], answer: ['{他|tā}', '{姓|xìng}', '{张|Zhāng}'], ro: 'Tā xìng Zhāng.' },
        { vi: 'Ông Lưu là bác sĩ.', chips: ['{刘|Liú}', '{先生|xiānsheng}', '{是|shì}', '{医生|yīshēng}', '{老师|lǎoshī}'], answer: ['{刘|Liú}', '{先生|xiānsheng}', '{是|shì}', '{医生|yīshēng}'], ro: 'Liú xiānsheng shì yīshēng.' },
        { vi: 'Ai tên là Lan Lan?', chips: ['{谁|shéi}', '{叫|jiào}', '{兰兰|Lánlan}', '{吗|ma}'], answer: ['{谁|shéi}', '{叫|jiào}', '{兰兰|Lánlan}'], ro: 'Shéi jiào Lánlan?' },
        { vi: 'Tôi không quen cô ấy.', chips: ['{我|wǒ}', '{不|bú}', '{认识|rènshi}', '{她|tā}', '{是|shì}'], answer: ['{我|wǒ}', '{不|bú}', '{认识|rènshi}', '{她|tā}'], ro: 'Wǒ bú rènshi tā.' },
        { vi: 'Các bạn là du học sinh à?', chips: ['{你们|nǐmen}', '{是|shì}', '{留学生|liúxuéshēng}', '{吗|ma}', '{谁|shéi}'], answer: ['{你们|nǐmen}', '{是|shì}', '{留学生|liúxuéshēng}', '{吗|ma}'], ro: 'Nǐmen shì liúxuéshēng ma?' },
        { vi: 'Cô ấy không phải là cô Lý.', chips: ['{她|tā}', '{不|bú}', '{是|shì}', '{李|Lǐ}', '{老师|lǎoshī}', '{姓|xìng}'], answer: ['{她|tā}', '{不|bú}', '{是|shì}', '{李|Lǐ}', '{老师|lǎoshī}'], ro: 'Tā bú shì Lǐ lǎoshī.' },
        { vi: 'Cho hỏi, bạn có phải là Vương Minh không?', chips: ['{请问|qǐngwèn}', '{你|nǐ}', '{是|shì}', '{王明|Wáng Míng}', '{吗|ma}', '{谁|shéi}'], answer: ['{请问|qǐngwèn}', '{你|nǐ}', '{是|shì}', '{王明|Wáng Míng}', '{吗|ma}'], ro: 'Qǐngwèn, nǐ shì Wáng Míng ma?' },
      ],
    },

    { t: 'h', text: '4b. Sửa câu sai' },
    {
      t: 'quiz',
      id: 'b2-bt-sua-cau',
      title: 'Mỗi câu có một lỗi — viết lại câu đúng (chữ Hán)',
      kind: 'translate',
      grammar: '叫 / 姓 không đi với 是 · 是 không đi với tính từ · 什么 / 谁 không đi với 吗 · trả lời 贵姓 bằng 我姓…',
      items: [
        { q: '~~我是叫兰兰。~~ (Tôi tên là Lan Lan.)', answers: ['我叫兰兰。'], hint: '叫 đã nghĩa "tên là"' },
        { q: '~~你叫什么名字吗？~~ (Bạn tên là gì?)', answers: ['你叫什么名字？'], hint: 'Câu có 什么 thì bỏ 吗' },
        { q: '~~我贵姓李。~~ (Tôi họ Lý.)', answers: ['我姓李。'], hint: 'Không dùng 贵 cho mình' },
        { q: '~~他是很忙。~~ (Anh ấy rất bận.)', answers: ['他很忙。'], hint: 'Tính từ không đi với 是' },
        { q: '~~我学生。~~ (Tôi là sinh viên.)', answers: ['我是学生。'], hint: 'Thiếu "là"' },
        { q: '~~他是什么？~~ (Anh ấy là ai?)', answers: ['他是谁？'], hint: 'Hỏi người dùng 谁' },
        { q: '~~我叫王。~~ (Tôi họ Vương.)', answers: ['我姓王。'], hint: 'Chỉ nói họ thì dùng 姓' },
        { q: '~~你是学生吗？— 有。~~ (Bạn là sinh viên à? — Vâng.) Viết lại câu trả lời.', answers: ['是。', '是，我是学生。', '对。', '对，我是学生。'], hint: 'Trả lời bằng chính động từ 是' },
      ],
    },

    { t: 'h', text: '5. Đọc hiểu' },
    {
      t: 'passage',
      title: 'Lớp học của Lan',
      intro: 'Lan viết một đoạn ngắn giới thiệu lớp học tiếng Trung của mình, chỉ dùng từ của Bài 1–2. Đọc to một lượt (tắt pinyin nếu được), rồi trả lời câu hỏi.',
      paras: [
        { label: 'A', text: '{大家好|dàjiā hǎo}！{我|wǒ}{姓|xìng}{阮|Ruǎn}，{叫|jiào}{阮氏兰|Ruǎn Shì Lán}。{我|wǒ}{是|shì}{留学生|liúxuéshēng}。{同学们|tóngxuémen}{叫|jiào}{我|wǒ}{兰兰|Lánlan}。' },
        { label: 'B', text: '{我们|wǒmen}{老师|lǎoshī}{姓|xìng}{李|Lǐ}，{我们|wǒmen}{叫|jiào}{她|tā}{李|Lǐ}{老师|lǎoshī}。{李|Lǐ}{老师|lǎoshī}{很|hěn}{忙|máng}，{她|tā}{很|hěn}{好|hǎo}。' },
        { label: 'C', text: '{王明|Wáng Míng}{是|shì}{我|wǒ}{同学|tóngxué}，{他|tā}{是|shì}{大学生|dàxuéshēng}。{大伟|Dàwěi}{是|shì}{王明|Wáng Míng}{的|de}{朋友|péngyou}。{安娜|Ānnà}{不|bú}{是|shì}{老师|lǎoshī}，{她|tā}{是|shì}{学生|xuésheng}。' },
        { label: 'D', text: '{张|Zhāng}{医生|yīshēng}{是|shì}{谁|shéi}？{我|wǒ}{不|bú}{认识|rènshi}{他|tā}。{王明|Wáng Míng}{认识|rènshi}{他|tā}。' },
      ],
    },
    {
      t: 'mcq',
      id: 'b2-bt-doc-hieu',
      title: 'Câu hỏi đọc hiểu',
      items: [
        m('Lan họ gì?', ['兰', '阮', '李', '王'], 1, 'Đoạn A: 我姓阮。'),
        m('Các bạn cùng lớp gọi Lan là gì?', ['阮氏兰', '小阮', '兰兰'], 2, 'Đoạn A: 同学们叫我兰兰。'),
        m('Cô giáo của lớp thế nào?', ['Bận, và rất tốt', 'Không bận', 'Không vui'], 0, 'Đoạn B: 李老师很忙，她很好。'),
        m('Đại Vĩ là ai?', ['Giáo viên', 'Bạn của Vương Minh', 'Bác sĩ'], 1, 'Đoạn C: 大伟是王明的朋友。'),
        m('Anna là giáo viên, đúng không?', ['Đúng', 'Sai — Anna là học sinh'], 1, 'Đoạn C: 安娜不是老师，她是学生。'),
        m('Ai quen bác sĩ Trương?', ['Lan', 'Vương Minh', 'Không ai'], 1, 'Đoạn D: 我不认识他。王明认识他。'),
      ],
    },
    {
      t: 'table',
      caption: 'Tự đánh giá Bài 2',
      head: ['Kết quả', 'Ý nghĩa', 'Làm gì tiếp'],
      rows: [
        ['≥ 80%', 'Nắm chắc Bài 2', 'Sang Bài 3 (你是哪国人 — quốc tịch, 不, 也, 呢). Gọi 📞 CuongMini luyện màn tự giới thiệu mỗi ngày.'],
        ['70–79%', 'Còn vài chỗ hổng', 'Làm lại phần sai; đọc lại hội thoại 3 tình huống và bảng "吗 hay từ để hỏi?".'],
        ['< 70%', 'Chưa vững', 'Học lại Ngữ pháp ① ② ③ ⑤ (叫, 姓, 是, 什么/谁), rồi làm lại toàn bộ bài tập.'],
      ],
    },
  ],
};

export const BAI_2: Lesson[] = [HOI_THOAI, TU_VUNG, NGU_PHAP, HAN_TU, NGHE, NOI, BAI_TAP];
