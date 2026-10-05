/**
 * Bài 0 — Pinyin & thanh điệu (khoá CH, trước Bài 1 HSK 1).
 *
 * Thanh mẫu (21) → vận mẫu (36: đơn, kép, mũi, er) → 4 thanh + thanh nhẹ →
 * biến điệu (3+3, nửa thanh 3, 不, 一) → quy tắc viết pinyin → nét & bộ thủ →
 * chào hỏi đầu tiên → bài tập tổng hợp.
 *
 * Quy ước pinyin (SOAN-BAI.md): có dấu thanh, tách theo từ. Biến điệu thanh 3 + thanh 3
 * KHÔNG ghi lên chữ (viết theo từ điển: 你好 nǐ hǎo, đọc ní hǎo — giải thích ở mục biến
 * điệu); 不 và 一 ghi theo cách đọc thực tế trong câu (不是 búshì, 一个 yí ge).
 * Khối `alphabet`: `l` = pinyin, `ipa` = cách đọc mô tả kiểu Việt, `doc` = một chữ Hán
 * đọc đúng âm đó (pinyin Latin máy không đọc trực tiếp được).
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

/* ═══════════════════════════ 1. THANH MẪU ═══════════════════════════ */

const THANH_MAU: Lesson = {
  id: 'b0-thanh-mau',
  kind: 'kana',
  title: 'Thanh mẫu (声母) — 21 phụ âm đầu',
  goal: 'Đọc đúng 21 thanh mẫu, phân biệt được âm bật hơi với không bật hơi (b/p, d/t, g/k, j/q, zh/ch, z/c) và không đọc pinyin theo kiểu chữ quốc ngữ.',
  minutes: 45,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Mục này học gì',
      items: [
        '**Pinyin** (拼音, pīnyīn) là bộ chữ Latin dùng để ghi cách đọc chữ Hán — giống "phiên âm". Người Trung Quốc học nó từ lớp 1, bạn cũng học nó TRƯỚC khi học chữ.',
        'Mỗi âm tiết = **thanh mẫu** (phụ âm đầu) + **vận mẫu** (phần vần) + **thanh điệu**: 妈 **m** + **a** + thanh 1 = mā.',
        'Có **21 thanh mẫu**, chia 6 nhóm theo chỗ đặt lưỡi/môi. Học theo nhóm, không học lẻ từng chữ.',
        'Điều quan trọng nhất: tiếng Trung phân biệt **bật hơi / không bật hơi** (p với b, t với d…), KHÔNG phân biệt "trong/đục" như tiếng Việt.',
        'Pinyin **không đọc như chữ quốc ngữ**: d ≈ "t", t ≈ "th", h ≈ "kh", x ≈ "x" mặt lưỡi, q ≈ "ch" bật hơi, zh ≈ "tr".',
      ],
    },
    { t: 'h', text: '1. Pinyin là gì — và vì sao phải học kỹ' },
    {
      t: 'p',
      text: 'Chữ Hán **không cho biết cách đọc**: nhìn chữ 好 bạn không đoán được nó đọc là "hǎo". Vì vậy năm **1958** Trung Quốc chính thức dùng **phương án pinyin** (汉语拼音方案) — dùng chữ cái Latin để ghi âm. Ngày nay pinyin có mặt ở khắp nơi: sách giáo khoa, từ điển, biển tên đường, và quan trọng nhất là **bàn phím**: người Trung Quốc gõ chữ Hán trên điện thoại chủ yếu bằng cách gõ pinyin rồi chọn chữ. Học pinyin chuẩn = vừa đọc đúng, vừa gõ được chữ, vừa tra được từ điển.',
    },
    {
      t: 'table',
      caption: 'Cấu tạo một âm tiết tiếng Trung (mỗi chữ Hán = một âm tiết)',
      head: ['Chữ', 'Pinyin', 'Thanh mẫu (phụ âm đầu)', 'Vận mẫu (vần)', 'Thanh điệu', 'Nghĩa'],
      rows: [
        ['妈', 'mā', 'm', 'a', 'thanh 1 (ˉ)', 'mẹ'],
        ['好', 'hǎo', 'h', 'ao', 'thanh 3 (ˇ)', 'tốt, khoẻ'],
        ['学', 'xué', 'x', 'üe (viết ue)', 'thanh 2 (ˊ)', 'học'],
        ['四', 'sì', 's', 'i (đọc như "ư")', 'thanh 4 (ˋ)', 'số 4'],
        ['爱', 'ài', '— (không có)', 'ai', 'thanh 4 (ˋ)', 'yêu'],
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận: pinyin KHÔNG đọc như chữ quốc ngữ',
      items: [
        'Pinyin dùng chữ cái Latin nhưng **giá trị âm khác** tiếng Việt. Thấy **d** đừng đọc "dờ" (z) hay "đờ" — d tiếng Trung gần **"t"** của ta. Thấy **t** đọc gần **"th"**.',
        '**h** tiếng Trung đọc gần **"kh"** của ta (cuống lưỡi, có tiếng xát): 好 hǎo nghe gần "khảo" chứ không phải "hảo" nhẹ như tiếng Việt.',
        '**x** đọc gần "x" của ta nhưng mặt lưỡi bẹt áp lên hàm trên (như khi cười "xi"). **q** đọc gần **"ch" bật hơi** — tuyệt đối không phải "qu".',
        '**zh, ch, sh, r** là nhóm **uốn lưỡi**: đầu lưỡi cong lên chạm phía sau lợi trên — gần "tr", "s", "r" của người miền Trung đọc chuẩn.',
        'Chữ **i** sau z, c, s, zh, ch, sh, r **không đọc "i"** mà đọc gần **"ư"**: 四 sì ≈ "sư", 是 shì ≈ "sư" uốn lưỡi, 日 rì ≈ "rư".',
      ],
    },

    { t: 'h', text: '2. Bảng 21 thanh mẫu — bấm từng ô để nghe' },
    {
      t: 'p',
      text: 'Thanh mẫu đứng một mình không phát ra tiếng rõ, nên khi dạy người ta luôn ghép với một vần mẫu để đọc: **bō pō mō fō, dē tē nē lē, gē kē hē, jī qī xī, zhī chī shī rī, zī cī sī** — đây là câu "đọc thuộc lòng" của học sinh Trung Quốc. Mỗi ô dưới đây đọc đúng âm ghép ấy. Đọc theo **hàng ngang**, mỗi hàng 3 lần.',
    },
    {
      t: 'alphabet',
      groups: [
        {
          sound: 'Âm môi — b p m f',
          letters: [
            { l: 'b', ipa: 'bō — "p" KHÔNG bật hơi, gần "b" của ta nhưng không rung họng', doc: '波' },
            { l: 'p', ipa: 'pō — "p" BẬT HƠI mạnh, hơi phụt ra khỏi môi', doc: '坡' },
            { l: 'm', ipa: 'mō — như "m" của ta', doc: '摸' },
            { l: 'f', ipa: 'fó — như "ph" của ta (răng trên chạm môi dưới)', doc: '佛' },
          ],
        },
        {
          sound: 'Âm đầu lưỡi — d t n l',
          letters: [
            { l: 'd', ipa: 'dé — như "t" của ta (không phải "đ", không phải "z")', doc: '德' },
            { l: 't', ipa: 'tè — như "th" của ta, bật hơi', doc: '特' },
            { l: 'n', ipa: 'nè — như "n" của ta', doc: '讷' },
            { l: 'l', ipa: 'lè — như "l" của ta', doc: '勒' },
          ],
        },
        {
          sound: 'Âm cuống lưỡi — g k h',
          letters: [
            { l: 'g', ipa: 'gē — như "c/k" của ta, không bật hơi', doc: '哥' },
            { l: 'k', ipa: 'kē — "k" BẬT HƠI (không phải "kh")', doc: '科' },
            { l: 'h', ipa: 'hē — gần "kh" của ta, cuống lưỡi xát mạnh', doc: '喝' },
          ],
        },
        {
          sound: 'Âm mặt lưỡi — j q x',
          letters: [
            { l: 'j', ipa: 'jī — gần "ch" của ta, mặt lưỡi bẹt, không bật hơi', doc: '基' },
            { l: 'q', ipa: 'qī — "ch" BẬT HƠI (không phải "qu")', doc: '七' },
            { l: 'x', ipa: 'xī — gần "x" của ta, mặt lưỡi áp hàm trên, như cười "xi"', doc: '西' },
          ],
        },
        {
          sound: 'Âm uốn lưỡi — zh ch sh r',
          letters: [
            { l: 'zh', ipa: 'zhī — gần "tr" uốn lưỡi, không bật hơi; i đọc như "ư"', doc: '知' },
            { l: 'ch', ipa: 'chī — "tr" uốn lưỡi BẬT HƠI', doc: '吃' },
            { l: 'sh', ipa: 'shī — "s" uốn lưỡi (s miền Trung đọc chuẩn)', doc: '诗' },
            { l: 'r', ipa: 'rì — uốn lưỡi như sh nhưng rung họng, gần "r" nhẹ không rung lưỡi', doc: '日' },
          ],
        },
        {
          sound: 'Âm đầu lưỡi trước — z c s',
          letters: [
            { l: 'z', ipa: 'zī — "ts" không bật hơi: đầu lưỡi chạm chân răng trên rồi xì ra; i đọc như "ư"', doc: '资' },
            { l: 'c', ipa: 'cì — "ts" BẬT HƠI mạnh', doc: '次' },
            { l: 's', ipa: 'sī — như "x" của ta (đầu lưỡi sau răng); i đọc như "ư"', doc: '思' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Chi tiết từng thanh mẫu — so với âm tiếng Việt gần nhất',
      head: ['Thanh mẫu', 'Gần âm Việt', 'Đặt lưỡi / môi thế nào', 'Ví dụ (chữ — pinyin — nghĩa)'],
      rows: [
        ['b', '"p" nhẹ / "b" không rung', 'Hai môi khép rồi bật ra nhẹ, KHÔNG có luồng hơi', '八 bā — tám · 不 bù — không'],
        ['p', '"p" bật hơi', 'Như b nhưng phụt mạnh một luồng hơi', '朋 péng — bạn · 跑 pǎo — chạy'],
        ['m', 'm', 'Như tiếng Việt', '妈 mā — mẹ · 买 mǎi — mua'],
        ['f', 'ph', 'Răng trên chạm nhẹ môi dưới', '饭 fàn — cơm · 飞 fēi — bay'],
        ['d', 't', 'Đầu lưỡi chạm lợi trên, bật ra, không hơi', '大 dà — to · 对 duì — đúng'],
        ['t', 'th', 'Như d nhưng bật hơi mạnh', '他 tā — anh ấy · 天 tiān — trời, ngày'],
        ['n', 'n', 'Như tiếng Việt', '你 nǐ — bạn · 女 nǚ — nữ'],
        ['l', 'l', 'Như tiếng Việt', '老 lǎo — già · 六 liù — sáu'],
        ['g', 'c / k', 'Cuống lưỡi chạm ngạc mềm, không hơi', '哥 gē — anh trai · 个 gè — cái'],
        ['k', 'k bật hơi', 'Như g nhưng bật hơi mạnh', '口 kǒu — miệng · 看 kàn — xem'],
        ['h', 'kh', 'Cuống lưỡi nâng gần ngạc mềm, hơi cọ xát', '好 hǎo — tốt · 喝 hē — uống'],
        ['j', 'ch (nhẹ)', 'Mặt lưỡi áp lên hàm trên, đầu lưỡi tựa răng dưới', '鸡 jī — gà · 家 jiā — nhà'],
        ['q', 'ch bật hơi', 'Như j nhưng bật hơi mạnh', '七 qī — bảy · 去 qù — đi'],
        ['x', 'x (mặt lưỡi)', 'Như j nhưng để hơi lọt qua, không chặn', '西 xī — tây · 谢 xiè — cảm ơn'],
        ['zh', 'tr (uốn lưỡi)', 'Đầu lưỡi cong lên chạm sau lợi trên, không hơi', '中 zhōng — giữa · 知 zhī — biết'],
        ['ch', 'tr bật hơi', 'Như zh nhưng bật hơi mạnh', '吃 chī — ăn · 茶 chá — trà'],
        ['sh', 's (uốn lưỡi)', 'Đầu lưỡi cong như zh nhưng để hơi lọt qua', '是 shì — là · 书 shū — sách'],
        ['r', 'r nhẹ (uốn lưỡi)', 'Như sh nhưng rung dây thanh, lưỡi không rung', '人 rén — người · 热 rè — nóng'],
        ['z', 'ts', 'Đầu lưỡi chạm chân răng cửa trên, bật ra kèm tiếng xì', '字 zì — chữ · 早 zǎo — sớm'],
        ['c', 'ts bật hơi', 'Như z nhưng bật hơi mạnh', '菜 cài — rau, món · 次 cì — lần'],
        ['s', 'x', 'Đầu lưỡi sau răng cửa dưới, hơi xì ra', '三 sān — ba · 四 sì — bốn'],
      ],
    },
    {
      t: 'note',
      title: 'Không có trong 21 thanh mẫu: y và w',
      items: [
        '**y** và **w** xuất hiện rất nhiều (我 wǒ, 一 yī, 有 yǒu) nhưng chúng **không phải thanh mẫu thật**. Chúng chỉ là cách VIẾT khi âm tiết bắt đầu bằng i, u, ü: i → **yi**, u → **wu**, ü → **yu**. Mục "Quy tắc viết pinyin" giải thích kỹ.',
        'Âm tiết **không có thanh mẫu** gọi là âm tiết "zero": 爱 ài, 饿 è, 欧 ōu. Đọc thẳng phần vần.',
      ],
    },

    { t: 'h', text: '3. Bật hơi và không bật hơi — chìa khoá của phụ âm tiếng Trung' },
    {
      t: 'p',
      text: 'Tiếng Việt phân biệt **b** (rung họng) với **p**; tiếng Trung thì KHÔNG quan tâm rung họng. Thứ nó phân biệt là **có luồng hơi phụt ra hay không**. Có **6 cặp** như vậy. Cách kiểm tra: cầm một tờ giấy mỏng cách miệng 3 cm. Đọc **bā** — tờ giấy gần như đứng yên. Đọc **pā** — tờ giấy phải bay rõ. Nếu đọc "pā" mà giấy không lay, người Trung Quốc sẽ nghe thành "bā".',
    },
    {
      t: 'table',
      caption: '6 cặp không bật hơi ↔ bật hơi',
      head: ['Không bật hơi', 'Bật hơi', 'Gần âm Việt', 'Cặp ví dụ'],
      rows: [
        ['b', 'p', 'p nhẹ ↔ p phụt hơi', '八 bā (tám) ↔ 趴 pā (nằm sấp)'],
        ['d', 't', 't ↔ th', '肚 dù (bụng) ↔ 兔 tù (thỏ)'],
        ['g', 'k', 'c ↔ k phụt hơi', '哥 gē (anh trai) ↔ 科 kē (khoa)'],
        ['j', 'q', 'ch ↔ ch phụt hơi', '鸡 jī (gà) ↔ 七 qī (bảy)'],
        ['zh', 'ch', 'tr ↔ tr phụt hơi', '知 zhī (biết) ↔ 吃 chī (ăn)'],
        ['z', 'c', 'ts ↔ ts phụt hơi', '字 zì (chữ) ↔ 次 cì (lần)'],
      ],
    },
    {
      t: 'phatam',
      id: 'b0-tm-bat-hoi',
      title: 'Luyện cặp bật hơi — tờ giấy trước miệng',
      note: 'Đọc từng cặp: chữ đầu KHÔNG bật hơi, chữ sau BẬT HƠI. Máy chấm từng chữ; nếu chữ bật hơi bị điểm thấp, hãy phụt hơi mạnh hơn.',
      items: [
        { text: '{八|bā} {趴|pā}', ipa: 'bā pā', vi: 'tám — nằm sấp' },
        { text: '{肚|dù} {兔|tù}', ipa: 'dù tù', vi: 'bụng — thỏ' },
        { text: '{哥|gē} {科|kē}', ipa: 'gē kē', vi: 'anh trai — khoa' },
        { text: '{鸡|jī} {七|qī}', ipa: 'jī qī', vi: 'gà — bảy' },
        { text: '{知|zhī} {吃|chī}', ipa: 'zhī chī', vi: 'biết — ăn' },
        { text: '{字|zì} {次|cì}', ipa: 'zì cì', vi: 'chữ — lần' },
        { text: '{大|dà} {他|tā}', ipa: 'dà tā', vi: 'to — anh ấy' },
        { text: '{饱|bǎo} {跑|pǎo}', ipa: 'bǎo pǎo', vi: 'no — chạy' },
      ],
    },

    { t: 'h', text: '4. Các nhóm người Việt hay nhầm' },
    {
      t: 'table',
      caption: 'z / c / s  ↔  zh / ch / sh  ↔  j / q / x — ba bộ "tr, ch, x" của tiếng Trung',
      head: ['Nhóm', 'Chỗ đặt lưỡi', 'Đi với vần', 'Ví dụ'],
      rows: [
        ['z c s (đầu lưỡi trước)', 'Đầu lưỡi **thẳng**, tựa sau răng cửa', 'a, e, i(ư), u, ai, ao, ou, an, ang…', '早 zǎo · 菜 cài · 三 sān'],
        ['zh ch sh r (uốn lưỡi)', 'Đầu lưỡi **cong lên**, chạm sau lợi trên', 'a, e, i(ư), u, ai, ao, ou, an, ang…', '找 zhǎo · 茶 chá · 山 shān'],
        ['j q x (mặt lưỡi)', 'Đầu lưỡi **hạ xuống** răng dưới, mặt lưỡi áp hàm trên', 'CHỈ đi với i và ü (i, ia, ie, iao, iu, ian, in, iang, ing, iong, u=ü…)', '家 jiā · 去 qù · 小 xiǎo'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay nhầm',
      items: [
        '**sh ↔ s**: 是 shì (là) và 四 sì (bốn) khác nhau ở **độ cong của lưỡi**. Nhiều người miền Bắc đọc cả hai thành "sư" phẳng — người nghe sẽ không biết bạn nói "là" hay "bốn". Tập: đọc "sư", rồi từ từ cong đầu lưỡi lên phía sau → ra "shì".',
        '**zh ↔ j**: người Việt hay đọc 中 zhōng thành "chung" bẹt lưỡi (giống j). Nhớ: **zh cong lưỡi** như "tr" → 中 zhōng ≈ "trung"; **j bẹt lưỡi** như "ch" → 家 jiā ≈ "chia". Âm tiết của hai nhóm không bao giờ trùng vần (j chỉ đi với i/ü), nên đọc đúng nhóm thì người nghe nhận ra ngay.',
        '**q không phải "qu"**: 去 qù (đi) đọc gần **"chuy"** bật hơi (vì u sau q là ü — xem mục vận mẫu), không phải "quư" hay "cu".',
        '**x không phải "x" phẳng**: 谢谢 xièxie (cảm ơn) — mặt lưỡi áp hàm trên, nghe hơi "xi-ê" mềm. Đọc phẳng như "xê" của ta vẫn hiểu được, nhưng chưa chuẩn.',
        '**h phải xát**: 好 hǎo, 喝 hē, 很 hěn — đọc nhẹ như "h" tiếng Việt thì người nghe vẫn hiểu, nhưng giọng sẽ lơ lớ. Nghĩ tới "kh" mà mềm hơn một chút.',
        '**r không rung lưỡi**: 人 rén (người), 热 rè (nóng) — không rung như "r" miền Nam đọc kỹ, cũng không phải "z". Cong lưỡi như sh rồi "rung họng".',
        '**d, t không phải "đ", "t"**: 大 dà (to) đọc gần "ta" (thanh 4), 他 tā (anh ấy) đọc gần "tha". Hai âm này rất hay bị người mới đọc ngược.',
      ],
    },
    {
      t: 'phatam',
      id: 'b0-tm-uon-luoi',
      title: 'Luyện cặp phẳng lưỡi ↔ uốn lưỡi ↔ mặt lưỡi',
      note: 'Mỗi dòng 2–3 chữ đọc liền. Để ý đầu lưỡi: thẳng (s, z, c) → cong lên (sh, zh, ch) → hạ xuống (x, j, q).',
      items: [
        { text: '{四|sì} {是|shì}', ipa: 'sì shì', vi: 'bốn — là' },
        { text: '{三|sān} {山|shān}', ipa: 'sān shān', vi: 'ba — núi' },
        { text: '{早|zǎo} {找|zhǎo}', ipa: 'zǎo zhǎo', vi: 'sớm — tìm' },
        { text: '{擦|cā} {茶|chá}', ipa: 'cā chá', vi: 'lau — trà' },
        { text: '{四|sì} {十|shí} {西|xī}', ipa: 'sì shí xī', vi: 'bốn — mười — tây' },
        { text: '{字|zì} {知|zhī} {鸡|jī}', ipa: 'zì zhī jī', vi: 'chữ — biết — gà' },
        { text: '{次|cì} {吃|chī} {七|qī}', ipa: 'cì chī qī', vi: 'lần — ăn — bảy' },
        { text: '{人|rén} {热|rè} {日|rì}', ipa: 'rén rè rì', vi: 'người — nóng — ngày' },
        { text: '{好|hǎo} {喝|hē} {很|hěn}', ipa: 'hǎo hē hěn', vi: 'tốt — uống — rất' },
        { text: '{四十|sìshí}', ipa: 'sìshí', vi: 'bốn mươi — câu khó kinh điển: s phẳng rồi sh cong' },
      ],
    },
    {
      t: 'mcq',
      id: 'b0-tm-trac-nghiem',
      title: 'Kiểm tra nhanh — thanh mẫu',
      items: [
        m('Thanh mẫu **d** của tiếng Trung đọc gần âm nào của tiếng Việt nhất?', ['đ', 't', 'z (d của ta)', 'th'], 1, 'd tiếng Trung là âm đầu lưỡi KHÔNG bật hơi ≈ "t" của ta. Còn t tiếng Trung ≈ "th".'),
        m('Thanh mẫu **h** (好 hǎo) gần âm Việt nào nhất?', ['h nhẹ', 'kh', 'g', 'ph'], 1, 'h tiếng Trung là âm xát cuống lưỡi ≈ "kh" của ta, xát nhẹ hơn một chút.'),
        m('Cặp nào là cặp **không bật hơi ↔ bật hơi**?', ['m ↔ n', 'b ↔ p', 'f ↔ h', 's ↔ sh'], 1, 'b (không bật hơi) ↔ p (bật hơi). Các cặp khác: d/t, g/k, j/q, zh/ch, z/c.'),
        m('**q** trong 七 qī đọc gần âm nào?', ['"qu" như quả', '"ch" bật hơi', '"k"', '"x"'], 1, 'q = âm mặt lưỡi bật hơi ≈ "ch" phụt hơi. Không bao giờ đọc "qu".'),
        m('Nhóm nào là **âm uốn lưỡi**?', ['z c s', 'j q x', 'zh ch sh r', 'g k h'], 2, 'zh ch sh r: đầu lưỡi cong lên chạm phía sau lợi trên.'),
        m('Trong 四 sì, chữ **i** đọc thế nào?', ['"i" như tiếng Việt', 'gần "ư"', 'gần "ê"', 'không đọc'], 1, 'Sau z c s zh ch sh r, chữ i đọc gần "ư": sì ≈ "sư".'),
        m('j, q, x chỉ đi với vần bắt đầu bằng gì?', ['a và o', 'i và ü', 'u và o', 'e và a'], 1, 'j q x chỉ ghép với i và ü (ü viết thành u sau j q x).'),
        m('Âm nào **không** phải thanh mẫu trong bảng 21?', ['r', 'f', 'w', 'c'], 2, 'y và w chỉ là cách viết khi âm tiết bắt đầu bằng i/u/ü, không phải thanh mẫu.'),
        m('Đọc 他 tā, tờ giấy trước miệng phải thế nào?', ['Đứng yên', 'Lay rõ vì t bật hơi', 'Bị hút vào', 'Không quan trọng'], 1, 't là âm bật hơi — luồng hơi đủ mạnh làm giấy lay.'),
        m('是 shì (là) và 四 sì (bốn) khác nhau ở đâu?', ['Thanh điệu', 'Lưỡi cong (sh) hay thẳng (s)', 'Vần', 'Không khác'], 1, 'Cùng vần, cùng thanh 4; chỉ khác sh uốn lưỡi và s phẳng lưỡi.'),
      ],
    },
  ],
};

/* ═══════════════════════════ 2. VẬN MẪU ═══════════════════════════ */

const VAN_MAU: Lesson = {
  id: 'b0-van-mau',
  kind: 'kana',
  title: 'Vận mẫu (韵母) — 36 vần: đơn, kép, mũi',
  goal: 'Đọc đúng 6 vận mẫu đơn (nhất là e, ü), 13 vận mẫu kép, 16 vận mẫu mũi và er; phân biệt an/ang, en/eng, in/ing, u/ü.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Mục này học gì',
      items: [
        '**6 vận mẫu đơn**: a o e i u ü — hai âm khó nhất là **e** (gần "ơ/ưa") và **ü** (môi tròn như u, lưỡi như i).',
        '**13 vận mẫu kép**: ai ei ao ou · ia ie ua uo üe · iao iou uai uei — phần lớn có âm Việt rất gần (ai, ây, ao, âu, oa…).',
        '**16 vận mẫu mũi**: kết thúc bằng **-n** (an en in ün ian uan üan uen) hoặc **-ng** (ang eng ing ong iang uang ueng iong). Phân biệt -n/-ng là việc người Việt phải luyện nhiều nhất.',
        '**er** — vần cuộn lưỡi duy nhất: 二 èr (hai), 儿 ér (con).',
        'Mẹo vàng: rất nhiều vần đọc gần y hệt âm **Hán Việt**: 天 tiān ≈ "thiên", 安 ān ≈ "an", 东 dōng ≈ "tung".',
      ],
    },
    { t: 'h', text: '1. Sáu vận mẫu đơn' },
    {
      t: 'alphabet',
      groups: [
        {
          sound: 'Vận mẫu đơn — a o e i u ü',
          letters: [
            { l: 'a', ipa: 'như "a" của ta, mở miệng rộng', doc: '啊' },
            { l: 'o', ipa: 'tròn môi, gần "ô" hơi trượt sang "ua": bō ≈ "pua"', doc: '喔' },
            { l: 'e', ipa: 'gần "ơ", miệng hơi bè, nghe như "ưa" đọc liền: è ≈ "ưa"', doc: '鹅' },
            { l: 'i', ipa: 'như "i" của ta (viết yi khi đứng một mình)', doc: '衣' },
            { l: 'u', ipa: 'như "u" của ta, môi tròn chu ra (viết wu khi đứng một mình)', doc: '乌' },
            { l: 'ü', ipa: 'môi tròn như "u" nhưng lưỡi như "i" — gần "uy" đọc chụm môi (viết yu)', doc: '鱼' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Cách đọc chi tiết 6 vận mẫu đơn',
      head: ['Vận mẫu', 'Gần âm Việt', 'Cách tạo âm', 'Ví dụ'],
      rows: [
        ['a', 'a', 'Mở miệng to, lưỡi hạ thấp', '八 bā — tám · 大 dà — to'],
        ['o', 'ô → ua', 'Tròn môi; đi sau b p m f thường nghe như có "u" nhẹ phía trước', '我 wǒ — tôi · 波 bō — sóng'],
        ['e', 'ơ / ưa', 'Miệng hé, môi KHÔNG tròn, lưỡi lùi ra sau — như "ơ" kéo dài rồi hơi mở', '饿 è — đói · 喝 hē — uống · 和 hé — và'],
        ['i', 'i', 'Môi dẹt, cười nhẹ', '一 yī — một · 你 nǐ — bạn'],
        ['u', 'u', 'Môi tròn và chu ra trước', '五 wǔ — năm · 不 bù — không'],
        ['ü', 'uy (chụm môi)', 'Đọc "i", giữ nguyên lưỡi rồi chu môi tròn lại', '女 nǚ — nữ · 鱼 yú — cá · 去 qù — đi'],
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận với e và ü',
      items: [
        '**e không phải "e"** của tiếng Việt. 饿 è (đói) KHÔNG đọc "e" mà gần **"ưa"/"ơ"**. 喝 hē (uống) ≈ "khưa", 的 de ≈ "tơ" nhẹ.',
        'Nhưng **e trong ie, üe, ei** thì đọc gần **"ê"**: 谢 xiè ≈ "xiê", 月 yuè ≈ "uyê", 黑 hēi ≈ "khây". Một chữ e — hai cách đọc tuỳ vị trí.',
        '**ü** là âm tiếng Việt không có. Cách tập: nói "i" thật dài, rồi trong khi vẫn kêu, từ từ chu môi tròn như huýt sáo — âm phát ra chính là ü. Đọc thành "u" là sai nghĩa: 女 nǚ (nữ) ≠ 努 nǔ (cố gắng).',
        '**ü viết thế nào?** Sau n, l viết đủ hai chấm (女 nǚ, 绿 lǜ). Sau j q x và khi đứng đầu (yu) thì **bỏ hai chấm** vì không thể nhầm: 去 qù, 鱼 yú, 学 xué đều là ü.',
        '**i sau z c s zh ch sh r** đọc gần **"ư"**, không phải "i" (đã học ở mục thanh mẫu). 吃 chī ≈ "trư" bật hơi, 是 shì ≈ "sư".',
      ],
    },
    {
      t: 'phatam',
      id: 'b0-vm-don',
      title: 'Luyện 6 vận mẫu đơn',
      note: 'Đọc to, giữ khẩu hình đúng đến hết âm. Chú ý e (≈ ưa) và ü (chu môi).',
      items: [
        { text: '{八|bā} {波|bō}', ipa: 'bā bō', vi: 'tám — sóng (a, o)' },
        { text: '{饿|è} {喝|hē}', ipa: 'è hē', vi: 'đói — uống (e ≈ ưa)' },
        { text: '{一|yī} {五|wǔ}', ipa: 'yī wǔ', vi: 'một — năm (i, u)' },
        { text: '{女|nǚ} {努|nǔ}', ipa: 'nǚ nǔ', vi: 'nữ — cố gắng (ü ↔ u)' },
        { text: '{绿|lǜ} {路|lù}', ipa: 'lǜ lù', vi: 'xanh lá — đường (ü ↔ u)' },
        { text: '{鱼|yú} {无|wú}', ipa: 'yú wú', vi: 'cá — không có (yu = ü, wu = u)' },
        { text: '{去|qù} {雨|yǔ}', ipa: 'qù yǔ', vi: 'đi — mưa (u sau q và y là ü)' },
      ],
    },

    { t: 'h', text: '2. Mười ba vận mẫu kép' },
    {
      t: 'p',
      text: 'Vận mẫu kép = hai hoặc ba nguyên âm **trượt liền** trong một hơi, không ngắt. Trong ngoặc là cách VIẾT khi vần đứng đầu âm tiết (không có thanh mẫu).',
    },
    {
      t: 'alphabet',
      groups: [
        {
          sound: 'Kép mở đầu bằng a, e, o — ai ei ao ou',
          letters: [
            { l: 'ai', ipa: 'như "ai" của ta', doc: '爱' },
            { l: 'ei', ipa: 'như "ây" (nghe trong 黑 hēi)', doc: '黑' },
            { l: 'ao', ipa: 'như "ao" của ta', doc: '奥' },
            { l: 'ou', ipa: 'như "âu" của ta', doc: '欧' },
          ],
        },
        {
          sound: 'Kép mở đầu bằng i, u, ü — ia ie ua uo üe',
          letters: [
            { l: 'ia (ya)', ipa: '"i-a" đọc liền như "ia" nhanh', doc: '呀' },
            { l: 'ie (ye)', ipa: 'như "iê" của ta', doc: '耶' },
            { l: 'ua (wa)', ipa: 'như "oa" của ta', doc: '蛙' },
            { l: 'uo (wo)', ipa: 'như "uô" (gần "ua")', doc: '窝' },
            { l: 'üe (yue)', ipa: 'như "uyê" của ta', doc: '月' },
          ],
        },
        {
          sound: 'Kép ba nguyên âm — iao iou uai uei',
          letters: [
            { l: 'iao (yao)', ipa: '"i" + "ao" đọc liền một hơi', doc: '腰' },
            { l: 'iou (you · -iu)', ipa: '"i" + "âu" đọc liền, nghe gần "iêu"', doc: '优' },
            { l: 'uai (wai)', ipa: 'như "oai" của ta', doc: '歪' },
            { l: 'uei (wei · -ui)', ipa: 'như "uây" của ta', doc: '威' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Vận mẫu kép — đọc gần âm Việt nào, ví dụ chữ thường gặp',
      head: ['Vận mẫu', 'Viết khi đứng đầu', 'Gần âm Việt', 'Ví dụ'],
      rows: [
        ['ai', 'ai', 'ai', '爱 ài — yêu · 买 mǎi — mua · 菜 cài — món ăn'],
        ['ei', 'ei', 'ây', '飞 fēi — bay · 美 měi — đẹp · 黑 hēi — đen'],
        ['ao', 'ao', 'ao', '好 hǎo — tốt · 老 lǎo — già · 早 zǎo — sớm'],
        ['ou', 'ou', 'âu', '口 kǒu — miệng · 走 zǒu — đi bộ · 欧 ōu — châu Âu'],
        ['ia', 'ya', 'ia', '家 jiā — nhà · 下 xià — dưới · 鸭 yā — vịt'],
        ['ie', 'ye', 'iê', '谢 xiè — cảm ơn · 姐 jiě — chị · 也 yě — cũng'],
        ['ua', 'wa', 'oa', '花 huā — hoa · 话 huà — lời nói · 瓦 wǎ — ngói'],
        ['uo', 'wo', 'uô / ua', '我 wǒ — tôi · 多 duō — nhiều · 国 guó — nước'],
        ['üe', 'yue', 'uyê', '月 yuè — tháng · 学 xué — học · 觉 jué — cảm thấy'],
        ['iao', 'yao', 'i + ao', '小 xiǎo — nhỏ · 叫 jiào — gọi là · 要 yào — muốn'],
        ['iou', 'you (viết -iu sau phụ âm)', 'i + âu ≈ iêu', '六 liù — sáu · 九 jiǔ — chín · 有 yǒu — có'],
        ['uai', 'wai', 'oai', '快 kuài — nhanh · 块 kuài — đồng (tiền) · 外 wài — ngoài'],
        ['uei', 'wei (viết -ui sau phụ âm)', 'uây', '对 duì — đúng · 贵 guì — đắt · 喂 wèi — alô'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ — vần kép giống âm Hán Việt',
      items: [
        '**ao** gần như luôn giữ nguyên: 好 hǎo = HẢO, 老 lǎo = LÃO, 早 zǎo = TẢO.',
        '**uo** thường ứng với "uốc/ô" Hán Việt: 国 guó = QUỐC, 多 duō = ĐA (không phải lúc nào cũng khớp — chỉ là gợi nhớ).',
        '**üe** ứng với "uyệt/ọc": 月 yuè = NGUYỆT, 学 xué = HỌC.',
        'Không phải chữ nào cũng khớp đẹp, nhưng nhìn âm Hán Việt bạn thường đoán được **vần**, còn **thanh điệu** thì phải học riêng.',
      ],
    },

    { t: 'h', text: '3. Mười sáu vận mẫu mũi: -n và -ng' },
    {
      t: 'p',
      text: 'Vận mẫu mũi kết thúc bằng **-n** (đầu lưỡi chạm lợi trên, như "n" cuối của ta: "an", "in") hoặc **-ng** (cuống lưỡi nâng lên, như "ng" cuối của ta: "ang", "ung"). Tin vui: tiếng Việt cũng phân biệt hai âm cuối này (lan ≠ lang), nên người Việt làm tốt hơn nhiều người học khác. Chỉ cần chú ý vài vần đọc **khác chữ viết**: **ian** ≈ "iên", **eng** ≈ "âng", **ing** ≈ "inh", **ong** ≈ "ung".',
    },
    {
      t: 'alphabet',
      groups: [
        {
          sound: 'Mũi -n — an en in ün',
          letters: [
            { l: 'an', ipa: 'như "an" của ta', doc: '安' },
            { l: 'en', ipa: 'như "ân" của ta', doc: '恩' },
            { l: 'in (yin)', ipa: 'như "in" của ta', doc: '因' },
            { l: 'ün (yun)', ipa: 'như "uyn" chụm môi', doc: '云' },
          ],
        },
        {
          sound: 'Mũi -n có âm đệm — ian uan üan uen',
          letters: [
            { l: 'ian (yan)', ipa: 'đọc như "iên" (KHÔNG đọc "i-an")', doc: '烟' },
            { l: 'uan (wan)', ipa: 'như "oan" của ta', doc: '弯' },
            { l: 'üan (yuan)', ipa: 'như "uyên" của ta', doc: '元' },
            { l: 'uen (wen · -un)', ipa: 'như "uân" của ta', doc: '温' },
          ],
        },
        {
          sound: 'Mũi -ng — ang eng ing ong',
          letters: [
            { l: 'ang', ipa: 'như "ang" của ta', doc: '昂' },
            { l: 'eng', ipa: 'như "âng" (nghe trong 风 fēng)', doc: '风' },
            { l: 'ing (ying)', ipa: 'như "inh" của ta', doc: '英' },
            { l: 'ong', ipa: 'như "ung" của ta (nghe trong 东 dōng)', doc: '东' },
          ],
        },
        {
          sound: 'Mũi -ng có âm đệm — iang uang ueng iong',
          letters: [
            { l: 'iang (yang)', ipa: '"i" + "ang" liền: gần "iang"', doc: '央' },
            { l: 'uang (wang)', ipa: 'như "oang" của ta', doc: '王' },
            { l: 'ueng (weng)', ipa: 'như "uâng" — chỉ đứng một mình (weng)', doc: '翁' },
            { l: 'iong (yong)', ipa: 'gần "iung" chụm môi', doc: '用' },
          ],
        },
        {
          sound: 'Vần cuộn lưỡi — er',
          letters: [
            { l: 'er', ipa: '"ơ" rồi cuộn đầu lưỡi lên — như "ơr"', doc: '二' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Vận mẫu mũi — ví dụ chữ thường gặp',
      head: ['Vận mẫu', 'Gần âm Việt', 'Ví dụ'],
      rows: [
        ['an', 'an', '安 ān — an · 饭 fàn — cơm · 看 kàn — xem'],
        ['en', 'ân', '人 rén — người · 很 hěn — rất · 门 mén — cửa'],
        ['in', 'in', '您 nín — ngài · 今 jīn — nay · 新 xīn — mới'],
        ['ün (-un sau j q x, yun)', 'uyn', '云 yún — mây · 军 jūn — quân'],
        ['ian', 'iên', '天 tiān — trời · 见 jiàn — gặp · 钱 qián — tiền'],
        ['uan', 'oan', '饭馆 fànguǎn — quán ăn · 晚 wǎn — muộn · 关 guān — đóng'],
        ['üan (-uan sau j q x, yuan)', 'uyên', '元 yuán — đồng (tiền) · 远 yuǎn — xa · 选 xuǎn — chọn'],
        ['uen (-un, wen)', 'uân', '问 wèn — hỏi · 春 chūn — xuân · 文 wén — văn'],
        ['ang', 'ang', '忙 máng — bận · 上 shàng — trên · 帮 bāng — giúp'],
        ['eng', 'âng', '冷 lěng — lạnh · 朋 péng — bạn · 风 fēng — gió'],
        ['ing', 'inh', '明 míng — sáng · 星 xīng — sao · 请 qǐng — mời'],
        ['ong', 'ung', '中 zhōng — giữa · 东 dōng — đông · 同 tóng — cùng'],
        ['iang', 'iang', '想 xiǎng — muốn, nhớ · 两 liǎng — hai · 样 yàng — kiểu'],
        ['uang', 'oang', '王 wáng — vua, họ Vương · 床 chuáng — giường · 黄 huáng — vàng'],
        ['ueng', 'uâng', '翁 wēng — ông lão (chỉ có dạng weng)'],
        ['iong', 'iung', '用 yòng — dùng · 熊 xióng — gấu'],
        ['er', 'ơ + cuộn lưỡi', '二 èr — hai · 儿 ér — con · 耳 ěr — tai'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay nhầm',
      items: [
        '**ian đọc "iên", không đọc "i-an"**: 天 tiān ≈ "thiên", 见 jiàn ≈ "chiên" (thanh 4), 钱 qián ≈ "chiên" bật hơi. Đây cũng chính là âm Hán Việt: 天 THIÊN, 见 KIẾN — rất dễ nhớ.',
        '**en đọc "ân", eng đọc "âng"**: 很 hěn ≈ "khẩn", 冷 lěng ≈ "lẩng". Đừng đọc "en" thành "en" như "xe ben".',
        '**ong đọc "ung"**: 中 zhōng ≈ "trung", 东 dōng ≈ "tung". Không đọc "ong" như "con ong".',
        '**in ↔ ing**: 金 jīn (vàng) ≠ 京 jīng (kinh đô); 新 xīn (mới) ≠ 星 xīng (sao). -ing ≈ "inh" của ta, nghe rõ cuống lưỡi nâng lên.',
        '**an ↔ ang**: 晚 wǎn (muộn) ≠ 网 wǎng (mạng); 三 sān (ba) ≠ 桑 sāng (cây dâu). Người miền Nam hay lẫn "an/ang" — luyện kỹ cặp này.',
        '**un sau j q x là ün**, sau phụ âm khác là uen: 军 jūn ≈ "chuyn" (ü), nhưng 春 chūn ≈ "truân" (u-e-n).',
      ],
    },
    {
      t: 'phatam',
      id: 'b0-vm-mui',
      title: 'Luyện cặp -n ↔ -ng',
      note: 'Mỗi dòng: chữ đầu kết thúc -n (đầu lưỡi chạm lợi), chữ sau -ng (cuống lưỡi nâng). Cuối âm, đừng "nuốt" mất phụ âm mũi.',
      items: [
        { text: '{三|sān} {桑|sāng}', ipa: 'sān sāng', vi: 'ba — cây dâu (an ↔ ang)' },
        { text: '{晚|wǎn} {网|wǎng}', ipa: 'wǎn wǎng', vi: 'muộn — mạng (an ↔ ang)' },
        { text: '{真|zhēn} {争|zhēng}', ipa: 'zhēn zhēng', vi: 'thật — tranh (en ↔ eng)' },
        { text: '{门|mén} {朋|péng}', ipa: 'mén péng', vi: 'cửa — bạn (en ↔ eng)' },
        { text: '{新|xīn} {星|xīng}', ipa: 'xīn xīng', vi: 'mới — sao (in ↔ ing)' },
        { text: '{金|jīn} {京|jīng}', ipa: 'jīn jīng', vi: 'vàng — kinh đô (in ↔ ing)' },
        { text: '{天|tiān} {见|jiàn} {钱|qián}', ipa: 'tiān jiàn qián', vi: 'trời — gặp — tiền (ian ≈ iên)' },
        { text: '{中|zhōng} {东|dōng} {同|tóng}', ipa: 'zhōng dōng tóng', vi: 'giữa — đông — cùng (ong ≈ ung)' },
        { text: '{二|èr} {儿|ér}', ipa: 'èr ér', vi: 'hai — con (er cuộn lưỡi)' },
      ],
    },
    {
      t: 'table',
      caption: 'Bảng ghép mẫu — thanh mẫu nào đi được với vần nào (dấu — là không có âm tiết đó)',
      head: ['', 'a', 'e', 'i', 'u', 'ü', 'an', 'ang', 'ong'],
      rows: [
        ['b', 'ba', '—', 'bi', 'bu', '—', 'ban', 'bang', '—'],
        ['d', 'da', 'de', 'di', 'du', '—', 'dan', 'dang', 'dong'],
        ['n', 'na', 'ne', 'ni', 'nu', 'nü', 'nan', 'nang', 'nong'],
        ['l', 'la', 'le', 'li', 'lu', 'lü', 'lan', 'lang', 'long'],
        ['g', 'ga', 'ge', '—', 'gu', '—', 'gan', 'gang', 'gong'],
        ['j', '—', '—', 'ji', '—', 'ju (= jü)', '—', '—', '—'],
        ['x', '—', '—', 'xi', '—', 'xu (= xü)', '—', '—', '—'],
        ['zh', 'zha', 'zhe', 'zhi (ư)', 'zhu', '—', 'zhan', 'zhang', 'zhong'],
        ['z', 'za', 'ze', 'zi (ư)', 'zu', '—', 'zan', 'zang', 'zong'],
      ],
    },
    {
      t: 'mcq',
      id: 'b0-vm-trac-nghiem',
      title: 'Kiểm tra nhanh — vận mẫu',
      items: [
        m('Vần **ian** (天 tiān) đọc gần âm Việt nào?', ['i-an', 'iên', 'yan như tiếng Anh', 'ang'], 1, 'ian ≈ "iên": 天 tiān ≈ "thiên" — trùng luôn âm Hán Việt THIÊN.'),
        m('Vận mẫu **e** trong 饿 è (đói) đọc gần:', ['"e" như "xe"', '"ê"', '"ơ / ưa"', '"i"'], 2, 'e đứng một mình ≈ "ơ/ưa". Chỉ trong ie, üe, ei nó mới gần "ê".'),
        m('Trong 去 qù, chữ **u** thực ra là âm gì?', ['u', 'ü', 'o', 'ư'], 1, 'Sau j q x, u luôn là ü (bỏ hai chấm khi viết).'),
        m('Vần **ong** (中 zhōng) đọc gần:', ['"ong" như con ong', '"ung"', '"ông"', '"oong"'], 1, 'ong ≈ "ung": 中 zhōng ≈ "trung" — giống Hán Việt TRUNG.'),
        m('Cặp nào khác nhau ở **-n / -ng**?', ['新 xīn — 星 xīng', '八 bā — 爸 bà', '是 shì — 四 sì', '女 nǚ — 努 nǔ'], 0, 'xīn kết thúc -n, xīng kết thúc -ng. Các cặp khác khác thanh, thanh mẫu hoặc ü/u.'),
        m('**en** (人 rén) đọc gần âm Việt nào?', ['en', 'ân', 'ên', 'in'], 1, 'en ≈ "ân": 人 rén ≈ "rấn" (thanh 2), 很 hěn ≈ "khẩn".'),
        m('**iou** khi có thanh mẫu đứng trước viết thế nào? (l + iou, thanh 4)', ['liòu', 'liù', 'lioù', 'lìu'], 1, 'iou rút gọn thành -iu sau phụ âm; dấu thanh đặt trên chữ sau: liù (六, sáu).'),
        m('Âm **ü** tạo ra thế nào?', ['Đọc "u" rồi bẹt môi', 'Đọc "i" rồi giữ lưỡi, chu môi tròn', 'Đọc "ư"', 'Đọc "uy" thật nhanh, mở môi'], 1, 'ü = lưỡi ở vị trí "i" + môi tròn như "u".'),
        m('Vần nào **cuộn lưỡi**?', ['ou', 'er', 'eng', 'uo'], 1, 'er (二 èr, 儿 ér) là vần cuộn lưỡi duy nhất.'),
        m('女 nǚ và 努 nǔ khác nhau ở đâu?', ['Thanh điệu', 'ü (chu môi + lưỡi i) ↔ u', 'Thanh mẫu', 'Không khác'], 1, 'Cùng n, cùng thanh 3; nǚ là ü, nǔ là u. Đọc sai là đổi nghĩa (nữ ↔ cố gắng).'),
      ],
    },
  ],
};

/* ═══════════════════════════ 3. THANH ĐIỆU ═══════════════════════════ */

const THANH_DIEU: Lesson = {
  id: 'b0-thanh-dieu',
  kind: 'kana',
  title: 'Bốn thanh điệu và thanh nhẹ (声调)',
  goal: 'Đọc và nghe phân biệt được 4 thanh + thanh nhẹ, biết đặt dấu thanh đúng chữ cái, và không "Việt hoá" thanh điệu tiếng Trung.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Mục này học gì',
      items: [
        'Tiếng Trung phổ thông có **4 thanh + thanh nhẹ**. Cùng một âm "ma" mà đổi thanh là đổi nghĩa: 妈 mā (mẹ) · 麻 má (gai) · 马 mǎ (ngựa) · 骂 mà (mắng) · 吗 ma (trợ từ hỏi).',
        'Thanh 1 **cao, bằng** (ˉ) · thanh 2 **đi lên** (ˊ) · thanh 3 **xuống thấp rồi lên** (ˇ) · thanh 4 **rơi mạnh** (ˋ) · thanh nhẹ **ngắn, không dấu**.',
        'So với tiếng Việt: thanh 1 ≈ ngang nhưng CAO hơn; thanh 2 ≈ sắc; thanh 3 ≈ hỏi trầm; thanh 4 ≈ huyền nhưng bắt đầu cao và rơi gắt.',
        'Dấu thanh đặt trên **nguyên âm chính** theo thứ tự ưu tiên **a > o, e > i, u, ü** (iu, ui: đặt trên chữ sau).',
      ],
    },
    { t: 'h', text: '1. Thang 5 bậc — vẽ thanh điệu bằng số' },
    {
      t: 'p',
      text: 'Các nhà ngôn ngữ chia giọng nói của một người thành **5 bậc cao độ**: 1 = thấp nhất, 5 = cao nhất. Mỗi thanh được mô tả bằng điểm bắt đầu → điểm kết thúc. Bạn không cần thuộc số, nhưng hình dung **đường đi của giọng** sẽ giúp đọc đúng hơn nhiều so với chỉ "bắt chước".',
    },
    {
      t: 'table',
      caption: 'Bốn thanh + thanh nhẹ (cao độ theo thang 1–5)',
      head: ['Thanh', 'Dấu', 'Cao độ', 'Đường giọng', 'Gần thanh Việt', 'Ví dụ'],
      rows: [
        ['Thanh 1 (阴平)', 'ˉ  mā', '5 → 5', 'Cao và **bằng phẳng**, giữ nguyên như hát một nốt cao', 'Ngang — nhưng cao hơn hẳn giọng nói thường', '妈 mā — mẹ'],
        ['Thanh 2 (阳平)', 'ˊ  má', '3 → 5', 'Từ giữa **đi lên** cao, như khi hỏi lại "Hả?"', 'Sắc — nhưng lên từ từ, không gắt và không ngắt', '麻 má — gai'],
        ['Thanh 3 (上声)', 'ˇ  mǎ', '2 → 1 → 4', '**Xuống thấp** rồi **vòng lên**; trong câu thường chỉ còn nửa đầu (thấp, trầm)', 'Hỏi — nhưng xuống sâu hơn; nửa thanh 3 ≈ giọng trầm như "nặng" kéo dài', '马 mǎ — ngựa'],
        ['Thanh 4 (去声)', 'ˋ  mà', '5 → 1', 'Từ **cao nhất rơi thẳng** xuống thấp nhất, ngắn và dứt khoát, như ra lệnh "Đi!"', 'Huyền — nhưng bắt đầu CAO và rơi mạnh, nhanh', '骂 mà — mắng'],
        ['Thanh nhẹ (轻声)', 'không dấu  ma', 'ngắn', 'Ngắn, nhẹ, cao độ phụ thuộc chữ đứng trước', 'Như đọc lướt một âm', '吗 ma — (trợ từ hỏi)'],
      ],
    },
    {
      t: 'alphabet',
      groups: [
        {
          sound: 'ma — năm thanh của một âm',
          letters: [
            { l: 'mā', ipa: 'thanh 1 — cao, bằng — 妈 mẹ', doc: '妈' },
            { l: 'má', ipa: 'thanh 2 — đi lên — 麻 gai, tê', doc: '麻' },
            { l: 'mǎ', ipa: 'thanh 3 — xuống rồi lên — 马 ngựa', doc: '马' },
            { l: 'mà', ipa: 'thanh 4 — rơi mạnh — 骂 mắng', doc: '骂' },
          ],
        },
        {
          sound: 'ba — tám, nhổ, cầm, bố',
          letters: [
            { l: 'bā', ipa: 'thanh 1 — 八 tám', doc: '八' },
            { l: 'bá', ipa: 'thanh 2 — 拔 nhổ', doc: '拔' },
            { l: 'bǎ', ipa: 'thanh 3 — 把 cầm, nắm', doc: '把' },
            { l: 'bà', ipa: 'thanh 4 — 爸 bố', doc: '爸' },
          ],
        },
        {
          sound: 'tang — canh, đường, nằm, bỏng',
          letters: [
            { l: 'tāng', ipa: 'thanh 1 — 汤 canh', doc: '汤' },
            { l: 'táng', ipa: 'thanh 2 — 糖 đường, kẹo', doc: '糖' },
            { l: 'tǎng', ipa: 'thanh 3 — 躺 nằm', doc: '躺' },
            { l: 'tàng', ipa: 'thanh 4 — 烫 nóng bỏng', doc: '烫' },
          ],
        },
        {
          sound: 'shi — thơ, mười, khiến, là',
          letters: [
            { l: 'shī', ipa: 'thanh 1 — 诗 thơ', doc: '诗' },
            { l: 'shí', ipa: 'thanh 2 — 十 mười', doc: '十' },
            { l: 'shǐ', ipa: 'thanh 3 — 使 khiến, dùng', doc: '使' },
            { l: 'shì', ipa: 'thanh 4 — 是 là', doc: '是' },
          ],
        },
        {
          sound: 'yi — một, dì, ghế, ý',
          letters: [
            { l: 'yī', ipa: 'thanh 1 — 一 một', doc: '一' },
            { l: 'yí', ipa: 'thanh 2 — 姨 dì', doc: '姨' },
            { l: 'yǐ', ipa: 'thanh 3 — 椅 ghế', doc: '椅' },
            { l: 'yì', ipa: 'thanh 4 — 意 ý', doc: '意' },
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai thanh điệu',
      items: [
        '**Thanh 1 đọc thấp như thanh ngang**: 妈 mā, 他 tā phải CAO. Mẹo: đọc thanh 1 ở độ cao bằng điểm bắt đầu của thanh 4. Nếu bạn là nữ, hãy tưởng tượng đang gọi với to "Mā!" từ xa.',
        '**Thanh 2 đọc gắt như thanh sắc**: thanh sắc tiếng Việt lên nhanh và có khi bị "chặn" (như "tốt", "các"); thanh 2 tiếng Trung lên **từ từ và mềm**, như giọng ngạc nhiên "Hả? Thật à?".',
        '**Thanh 3 đọc thành thanh hỏi cao**: thanh 3 xuống **rất thấp** (bậc 1), thấp hơn mọi thanh tiếng Việt. Khi chưa chắc, cứ đọc **trầm thấp** — người Bắc Kinh trong câu nói nhanh cũng chủ yếu chỉ đọc nửa trầm này.',
        '**Thanh 4 đọc thành huyền**: thanh huyền tiếng Việt bắt đầu ở giữa và đi xuống nhẹ; thanh 4 bắt đầu ở **đỉnh** rồi rơi **mạnh**. Đọc 是 shì, 爸 bà như đang quả quyết.',
        '**Thêm thanh nặng/ngã của tiếng Việt vào**: tiếng Trung không có tiếng bị "ép thanh quản" (nặng, ngã). Giữ giọng thoải mái, không thắt họng.',
      ],
    },
    {
      t: 'phatam',
      id: 'b0-td-bon-thanh',
      title: 'Bốn thanh của một âm — đọc theo thứ tự 1-2-3-4',
      note: 'Đọc chậm, phóng đại đường giọng: 1 cao bằng — 2 đi lên — 3 xuống sâu rồi lên — 4 rơi thẳng. Máy chấm từng chữ: chữ nào dưới 80 điểm thường là sai thanh.',
      items: [
        { text: '{妈|mā} {麻|má} {马|mǎ} {骂|mà}', ipa: 'mā má mǎ mà', vi: 'mẹ — gai — ngựa — mắng' },
        { text: '{八|bā} {拔|bá} {把|bǎ} {爸|bà}', ipa: 'bā bá bǎ bà', vi: 'tám — nhổ — cầm — bố' },
        { text: '{汤|tāng} {糖|táng} {躺|tǎng} {烫|tàng}', ipa: 'tāng táng tǎng tàng', vi: 'canh — đường — nằm — bỏng' },
        { text: '{诗|shī} {十|shí} {使|shǐ} {是|shì}', ipa: 'shī shí shǐ shì', vi: 'thơ — mười — khiến — là' },
        { text: '{一|yī} {姨|yí} {椅|yǐ} {意|yì}', ipa: 'yī yí yǐ yì', vi: 'một — dì — ghế — ý' },
        { text: '{妈妈|māma} {骂|mà} {马|mǎ} {吗|ma}', ipa: 'māma mà mǎ ma', vi: 'Mẹ mắng ngựa à? (câu luyện thanh vui)' },
      ],
    },

    { t: 'h', text: '2. Cặp hai thanh — luyện như người bản xứ' },
    {
      t: 'p',
      text: 'Trong thực tế, chữ Hán hiếm khi đứng một mình mà đi thành **từ hai chữ**. Luyện 16 tổ hợp hai thanh là cách nhanh nhất để giọng "ra chất". Bảng dưới chọn toàn từ thông dụng (nhiều từ sẽ gặp lại ở HSK 1). Ô thanh 3 + thanh 3 có biến điệu — học kỹ ở mục sau.',
    },
    {
      t: 'table',
      caption: 'Tổ hợp hai thanh — từ thông dụng',
      head: ['', '+ thanh 1', '+ thanh 2', '+ thanh 3', '+ thanh 4'],
      rows: [
        ['Thanh 1', '飞机 fēijī — máy bay', '中国 Zhōngguó — Trung Quốc', '喝水 hē shuǐ — uống nước', '音乐 yīnyuè — âm nhạc'],
        ['Thanh 2', '明天 míngtiān — ngày mai', '同学 tóngxué — bạn học', '朋友 péngyou*', '学校 xuéxiào — trường học'],
        ['Thanh 3', '老师 lǎoshī — thầy cô', '美国 Měiguó — nước Mỹ', '你好 nǐ hǎo — xin chào (đọc ní hǎo)', '米饭 mǐfàn — cơm'],
        ['Thanh 4', '汽车 qìchē — ô tô', '大学 dàxué — đại học', '电脑 diànnǎo — máy tính', '再见 zàijiàn — tạm biệt'],
      ],
    },
    {
      t: 'p',
      text: '*朋友 péngyou (bạn bè): chữ sau đọc **thanh nhẹ** — ví dụ cho thấy thanh nhẹ rất hay gặp ở chữ thứ hai. Một tổ hợp thanh 2 + thanh 3 khác: 牛奶 niúnǎi (sữa bò).',
    },
    {
      t: 'phatam',
      id: 'b0-td-hai-thanh',
      title: 'Luyện từ hai chữ',
      note: 'Mỗi từ đọc liền một hơi, chữ sau không ngắt. Nghe mẫu → đọc → so.',
      items: [
        { text: '{中国|Zhōngguó}', ipa: 'Zhōngguó', vi: 'Trung Quốc (1 + 2)' },
        { text: '{明天|míngtiān}', ipa: 'míngtiān', vi: 'ngày mai (2 + 1)' },
        { text: '{老师|lǎoshī}', ipa: 'lǎoshī', vi: 'thầy cô (3 + 1 — thanh 3 chỉ đọc nửa trầm)' },
        { text: '{再见|zàijiàn}', ipa: 'zàijiàn', vi: 'tạm biệt (4 + 4)' },
        { text: '{同学|tóngxué}', ipa: 'tóngxué', vi: 'bạn học (2 + 2)' },
        { text: '{大学|dàxué}', ipa: 'dàxué', vi: 'đại học (4 + 2)' },
        { text: '{米饭|mǐfàn}', ipa: 'mǐfàn', vi: 'cơm (3 + 4)' },
        { text: '{飞机|fēijī}', ipa: 'fēijī', vi: 'máy bay (1 + 1 — giữ cao cả hai chữ)' },
      ],
    },

    { t: 'h', text: '3. Thanh nhẹ (轻声)' },
    {
      t: 'p',
      text: 'Thanh nhẹ là âm đọc **ngắn và nhẹ**, không có dấu. Nó không có cao độ riêng: sau thanh 1, 2, 4 thì hơi thấp; sau thanh 3 thì hơi cao. Thanh nhẹ thường gặp ở: **trợ từ** (吗 ma, 呢 ne, 的 de, 了 le), **hậu tố** (们 men, 子 zi), **chữ lặp lại** trong từ chỉ người thân (妈妈 māma, 爸爸 bàba), và chữ thứ hai của nhiều từ hai chữ (谢谢 xièxie, 朋友 péngyou).',
    },
    {
      t: 'examples',
      items: [
        { en: '{妈妈|māma}', ro: 'māma', vi: 'mẹ — chữ sau nhẹ, hơi thấp' },
        { en: '{爸爸|bàba}', ro: 'bàba', vi: 'bố — chữ sau rất nhẹ, thấp' },
        { en: '{谢谢|xièxie}', ro: 'xièxie', vi: 'cảm ơn — chữ sau nhẹ, KHÔNG đọc "xiè xiè" hai thanh 4' },
        { en: '{你们|nǐmen}', ro: 'nǐmen', vi: 'các bạn — 们 nhẹ, hơi cao hơn 你' },
        { en: '{好吗|hǎo ma}', ro: 'hǎo ma', vi: '…khoẻ không? — 吗 nhẹ, nhấc lên một chút' },
        { en: '{我的|wǒ de}', ro: 'wǒ de', vi: 'của tôi — 的 đọc nhẹ, gần "tơ"' },
      ],
    },

    { t: 'h', text: '4. Đặt dấu thanh ở đâu?' },
    {
      t: 'p',
      text: 'Dấu thanh luôn đặt trên **một nguyên âm** của âm tiết. Khi có hai, ba nguyên âm, dùng thứ tự ưu tiên: **a > o, e > i, u, ü**. Có a thì đặt trên a; không có a thì đặt trên o hoặc e (hai chữ này không bao giờ đứng cạnh nhau); chỉ còn i, u thì: **iu và ui đặt trên chữ đứng SAU**. Dấu thanh đặt trên i thì bỏ dấu chấm của i: **nǐ**, **yī**.',
    },
    {
      t: 'table',
      caption: 'Quy tắc đặt dấu — ví dụ',
      head: ['Âm tiết', 'Có nguyên âm', 'Đặt dấu trên', 'Kết quả'],
      rows: [
        ['h + ao, thanh 3', 'a, o', 'a (ưu tiên cao nhất)', 'hǎo 好'],
        ['x + ie, thanh 4', 'i, e', 'e', 'xiè 谢'],
        ['g + uo, thanh 2', 'u, o', 'o', 'guó 国'],
        ['d + ui, thanh 4', 'u, i', 'i (chữ sau)', 'duì 对'],
        ['l + iu, thanh 4', 'i, u', 'u (chữ sau)', 'liù 六'],
        ['x + iao, thanh 3', 'i, a, o', 'a', 'xiǎo 小'],
        ['n + i, thanh 3', 'i', 'i (bỏ chấm)', 'nǐ 你'],
        ['l + ü, thanh 4', 'ü', 'ü (giữ hai chấm)', 'lǜ 绿'],
      ],
    },

    { t: 'h', text: '5. Nghe và chọn thanh' },
    {
      t: 'p',
      text: 'Bấm **nghe cả bài**: máy đọc lần lượt 8 âm (mỗi âm là một chữ). Ghi lại thanh của từng âm (1, 2, 3, 4) rồi làm câu hỏi bên dưới. Chưa chắc thì bấm nghe lại từng dòng. Chỉ mở lời thoại sau khi đã trả lời.',
    },
    {
      t: 'listen',
      id: 'b0-td-nghe',
      title: 'Nghe 8 âm — mỗi âm thanh mấy?',
      note: 'Dạng bài: nghe một âm tiết, chọn thanh điệu (giống phần khởi động của các lớp tiếng Trung; HSK 1 không thi riêng thanh, nhưng sai thanh là nghe sai từ).',
      lines: [
        { who: 'Âm 1', voice: 'zh-nu', text: '{妈|mā}', ro: 'mā', vi: 'mẹ — thanh 1' },
        { who: 'Âm 2', voice: 'zh-nam', text: '{马|mǎ}', ro: 'mǎ', vi: 'ngựa — thanh 3' },
        { who: 'Âm 3', voice: 'zh-nu', text: '{十|shí}', ro: 'shí', vi: 'mười — thanh 2' },
        { who: 'Âm 4', voice: 'zh-nam', text: '{是|shì}', ro: 'shì', vi: 'là — thanh 4' },
        { who: 'Âm 5', voice: 'zh-nu', text: '{汤|tāng}', ro: 'tāng', vi: 'canh — thanh 1' },
        { who: 'Âm 6', voice: 'zh-nam', text: '{糖|táng}', ro: 'táng', vi: 'đường — thanh 2' },
        { who: 'Âm 7', voice: 'zh-nu', text: '{爸|bà}', ro: 'bà', vi: 'bố — thanh 4' },
        { who: 'Âm 8', voice: 'zh-nam', text: '{椅|yǐ}', ro: 'yǐ', vi: 'ghế — thanh 3' },
      ],
    },
    {
      t: 'mcq',
      id: 'b0-td-nghe-chon',
      title: 'Bạn nghe được thanh mấy?',
      items: [
        m('Âm 1 mang thanh mấy?', ['Thanh 1', 'Thanh 2', 'Thanh 3', 'Thanh 4'], 0, 'Âm 1 là 妈 mā — cao, bằng.'),
        m('Âm 2 mang thanh mấy?', ['Thanh 1', 'Thanh 2', 'Thanh 3', 'Thanh 4'], 2, 'Âm 2 là 马 mǎ — xuống thấp rồi lên.'),
        m('Âm 3 mang thanh mấy?', ['Thanh 1', 'Thanh 2', 'Thanh 3', 'Thanh 4'], 1, 'Âm 3 là 十 shí — đi lên.'),
        m('Âm 4 mang thanh mấy?', ['Thanh 1', 'Thanh 2', 'Thanh 3', 'Thanh 4'], 3, 'Âm 4 là 是 shì — rơi mạnh.'),
        m('Âm 5 mang thanh mấy?', ['Thanh 1', 'Thanh 2', 'Thanh 3', 'Thanh 4'], 0, 'Âm 5 là 汤 tāng — cao, bằng.'),
        m('Âm 6 mang thanh mấy?', ['Thanh 1', 'Thanh 2', 'Thanh 3', 'Thanh 4'], 1, 'Âm 6 là 糖 táng — đi lên.'),
        m('Âm 7 mang thanh mấy?', ['Thanh 1', 'Thanh 2', 'Thanh 3', 'Thanh 4'], 3, 'Âm 7 là 爸 bà — rơi mạnh.'),
        m('Âm 8 mang thanh mấy?', ['Thanh 1', 'Thanh 2', 'Thanh 3', 'Thanh 4'], 2, 'Âm 8 là 椅 yǐ — trầm thấp rồi lên.'),
      ],
    },
    {
      t: 'mcq',
      id: 'b0-td-ly-thuyet',
      title: 'Kiểm tra lý thuyết thanh điệu',
      items: [
        m('Thanh nào **cao và bằng phẳng**?', ['Thanh 1', 'Thanh 2', 'Thanh 3', 'Thanh 4'], 0, 'Thanh 1: 5 → 5, cao và giữ nguyên.'),
        m('Thanh nào **rơi từ cao nhất xuống thấp nhất**?', ['Thanh 1', 'Thanh 2', 'Thanh 3', 'Thanh 4'], 3, 'Thanh 4: 5 → 1, dứt khoát.'),
        m('Thanh 3 trong câu nói thường được đọc thế nào?', ['Cao vút', 'Chỉ nửa đầu: trầm thấp', 'Như thanh 1', 'Bỏ hẳn'], 1, 'Trong câu, thanh 3 đứng trước thanh khác thường chỉ còn phần trầm thấp (nửa thanh 3).'),
        m('谢谢 viết pinyin đúng là:', ['xièxiè', 'xièxie', 'xiexie', 'xiēxiē'], 1, 'Chữ sau đọc thanh nhẹ, không dấu: xièxie.'),
        m('Âm tiết h + ao + thanh 3 viết là:', ['hāo', 'hǎo', 'haǒ', 'hào'], 1, 'Có a thì dấu đặt trên a: hǎo.'),
        m('d + ui + thanh 4 viết là:', ['dùi', 'duì', 'dúi', 'duí'], 1, 'Với ui, dấu đặt trên chữ đứng sau (i): duì.'),
        m('Chữ nào mang **thanh nhẹ**?', ['妈 mā', '马 mǎ', '吗 ma', '骂 mà'], 2, '吗 ma — trợ từ hỏi, thanh nhẹ, không dấu.'),
        m('So với tiếng Việt, thanh 1 khác thanh ngang ở chỗ:', ['Thấp hơn', 'Cao hơn hẳn', 'Có đi xuống', 'Giống hệt'], 1, 'Thanh 1 nằm ở bậc 5 — cao hơn giọng nói thường của thanh ngang.'),
      ],
    },
  ],
};

/* ═══════════════════════════ 4. BIẾN ĐIỆU ═══════════════════════════ */

const BIEN_DIEU: Lesson = {
  id: 'b0-bien-dieu',
  kind: 'kana',
  title: 'Biến điệu — thanh 3 + thanh 3, nửa thanh 3, 不 và 一',
  goal: 'Đọc đúng các trường hợp thanh điệu thay đổi khi đứng cạnh nhau: 你好 (ní hǎo), 不是 (búshì), 一个 (yí ge), 一起 (yìqǐ) — và biết khi nào pinyin ghi theo từ điển, khi nào ghi theo cách đọc.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Mục này học gì',
      items: [
        '**Thanh 3 + thanh 3 → thanh 2 + thanh 3**: 你好 viết **nǐ hǎo** nhưng đọc **ní hǎo**. Pinyin trong sách và từ điển KHÔNG ghi sự thay đổi này — bạn phải tự đổi khi đọc.',
        '**Nửa thanh 3**: thanh 3 đứng trước thanh 1, 2, 4 hoặc thanh nhẹ chỉ đọc phần **trầm thấp**, không vòng lên: 老师 lǎoshī.',
        '**不 bù → bú** khi đứng trước thanh 4: 不是 búshì, 不客气 bú kèqi. Khoá này **ghi đúng cách đọc** (bú) cho dễ học.',
        '**一 yī → yí** trước thanh 4 (一个 yí ge), **→ yì** trước thanh 1, 2, 3 (一天 yì tiān, 一起 yìqǐ); **giữ yī** khi đếm số, đứng cuối, chỉ thứ tự (第一 dì-yī, 十一 shíyī).',
      ],
    },
    { t: 'h', text: '1. Thanh 3 + thanh 3 → thanh 2 + thanh 3' },
    {
      t: 'p',
      text: 'Thanh 3 là thanh "tốn sức" nhất (xuống sâu rồi lên). Hai thanh 3 đứng liền nhau thì miệng không kịp làm hai lần, nên **chữ thứ nhất tự động chuyển thành thanh 2** (đi lên). Đây là quy tắc **bắt buộc**: người bản xứ luôn đọc như vậy, đọc khác sẽ nghe rất lạ. Nhưng khi **viết** pinyin, sách và từ điển vẫn giữ dấu gốc (nǐ hǎo) — vì nghĩa của từng chữ không đổi, chỉ cách đọc đổi. Khoá này làm theo đúng quy ước đó: **chữ ghi theo từ điển, bạn đọc theo biến điệu**.',
    },
    {
      t: 'table',
      caption: 'Thanh 3 + thanh 3 — viết một đằng, đọc một nẻo',
      head: ['Chữ', 'Viết (từ điển)', 'Đọc thực tế', 'Nghĩa'],
      rows: [
        ['你好', 'nǐ hǎo', '**ní** hǎo', 'xin chào'],
        ['很好', 'hěn hǎo', '**hén** hǎo', 'rất tốt'],
        ['可以', 'kěyǐ', '**ké**yǐ', 'có thể, được'],
        ['水果', 'shuǐguǒ', '**shuí**guǒ', 'hoa quả'],
        ['老板', 'lǎobǎn', '**láo**bǎn', 'ông chủ, bà chủ'],
        ['小姐', 'xiǎojiě', '**xiáo**jiě', 'cô (gái trẻ)'],
      ],
    },
    {
      t: 'note',
      title: 'Ba thanh 3 liền nhau thì sao?',
      items: [
        'Tuỳ cách **chia nhóm nghĩa**. 我很好 (tôi rất khoẻ) chia là 我 + 很好: 很好 → hén hǎo; còn 我 thì người nói nhanh thường đọc lên luôn thành **wó hén hǎo**, nói chậm thì **wǒ hén hǎo** (wǒ chỉ đọc nửa trầm). Cả hai đều tự nhiên.',
        '老板好 (chào chủ quán) = 老板 + 好: thường nghe **láobán hǎo**.',
        'Mẹo chung: trong một chuỗi thanh 3, **chỉ chữ CUỐI giữ thanh 3 đầy đủ**; các chữ trước đọc lên (thanh 2) hoặc trầm ngắn. Đừng cố đọc ba lần "xuống-lên" — nghe sẽ như hát.',
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay nhầm',
      items: [
        'Thấy pinyin **nǐ hǎo** rồi đọc đúng từng dấu thành "nỉ hảo" — đây là lỗi phổ biến nhất của người tự học. Phải đọc **ní hǎo**.',
        'Ngược lại, khi **viết** bài tập pinyin thì đừng ghi "ní hǎo": ô đáp án theo từ điển là **nǐ hǎo**. Biến điệu 3+3 chỉ áp dụng khi đọc.',
        'Thanh 3 + **thanh nhẹ** không đổi theo luật này: 你们 nǐmen (các bạn) đọc nǐmen, không phải "nímen". Chỉ thanh 3 + thanh 3 thật mới biến.',
      ],
    },

    { t: 'h', text: '2. Nửa thanh 3 — thanh 3 đứng trước thanh khác' },
    {
      t: 'p',
      text: 'Thanh 3 đứng trước thanh **1, 2, 4** hoặc **thanh nhẹ** chỉ đọc nửa đầu: **xuống trầm rồi dừng**, không vòng lên (cao độ 2 → 1). Chỉ khi thanh 3 đứng **cuối câu** hoặc đọc riêng mới đọc đủ "xuống rồi lên". Nghe 老师 lǎoshī: 老 trầm thấp, rồi 师 bật lên cao — sự tương phản thấp–cao này làm câu nghe rất "Trung Quốc".',
    },
    {
      t: 'examples',
      items: [
        { en: '{老师|lǎoshī}', ro: 'lǎoshī', vi: 'thầy cô — 老 trầm (nửa thanh 3) + 师 cao' },
        { en: '{很忙|hěn máng}', ro: 'hěn máng', vi: 'rất bận — 很 trầm + 忙 đi lên' },
        { en: '{你看|nǐ kàn}', ro: 'nǐ kàn', vi: 'bạn xem — 你 trầm + 看 rơi' },
        { en: '{我们|wǒmen}', ro: 'wǒmen', vi: 'chúng tôi — 我 trầm + 们 nhẹ, hơi cao' },
        { en: '{北京|Běijīng}', ro: 'Běijīng', vi: 'Bắc Kinh — 北 trầm + 京 cao' },
        { en: '{好|hǎo}', ro: 'hǎo', vi: 'tốt — đứng một mình: đọc đủ xuống rồi lên' },
      ],
    },

    { t: 'h', text: '3. Biến điệu của 不 (bù)' },
    {
      t: 'p',
      text: '不 nghĩa là "không". Thanh gốc là **thanh 4 (bù)**. Khi 不 đứng **trước một chữ thanh 4**, nó đổi thành **thanh 2 (bú)** — hai thanh 4 liền nhau đọc gắt quá nên chữ đầu được "nâng" lên. Trước thanh 1, 2, 3 vẫn đọc bù. Khoá này (như phần lớn giáo trình) **ghi đúng cách đọc**: bú.',
    },
    {
      t: 'table',
      caption: '不 trước các thanh',
      head: ['Đứng trước', '不 đọc', 'Ví dụ', 'Nghĩa'],
      rows: [
        ['Thanh 1', 'bù', '不吃 bù chī', 'không ăn'],
        ['Thanh 2', 'bù', '不来 bù lái', 'không đến'],
        ['Thanh 3', 'bù', '不好 bù hǎo', 'không tốt'],
        ['**Thanh 4**', '**bú**', '不是 **bú**shì · 不对 **bú** duì · 不去 **bú** qù', 'không phải · không đúng · không đi'],
        ['Chữ có gốc thanh 4 dù đọc nhẹ', '**bú**', '不客气 **bú** kèqi', 'đừng khách sáo (客 gốc kè — thanh 4)'],
      ],
    },
    {
      t: 'note',
      title: 'Thêm một chi tiết về 不',
      items: [
        'Khi 不 nằm **giữa** hai chữ lặp lại hoặc trong cụm cố định, nó thường đọc **thanh nhẹ**: 对不起 duìbuqǐ (xin lỗi), 好不好 hǎo bu hǎo (có được không).',
        '不 trong 不客气: chữ 客 gốc là kè (thanh 4) nên 不 → bú. Chữ 气 trong 客气 đọc nhẹ: bú kèqi.',
      ],
    },

    { t: 'h', text: '4. Biến điệu của 一 (yī)' },
    {
      t: 'p',
      text: '一 nghĩa là "một". Thanh gốc **thanh 1 (yī)**, và giữ yī khi: **đếm số, đọc số, đứng cuối từ, chỉ thứ tự**. Khi đứng **trước một chữ khác** (nghĩa "một cái/một lần…"), nó biến: trước **thanh 4** (và trước 个 gè, kể cả khi 个 đọc nhẹ) → **yí**; trước **thanh 1, 2, 3** → **yì**. Khoá này ghi đúng cách đọc.',
    },
    {
      t: 'table',
      caption: '一 trong các vị trí',
      head: ['Vị trí', '一 đọc', 'Ví dụ', 'Nghĩa'],
      rows: [
        ['Đếm, đọc số, cuối từ, thứ tự', 'yī', '一 yī · 十一 shíyī · 第一 dì-yī · 一月 yīyuè', 'một · mười một · thứ nhất · tháng Một'],
        ['Trước thanh 1', 'yì', '一天 yì tiān', 'một ngày'],
        ['Trước thanh 2', 'yì', '一年 yì nián', 'một năm'],
        ['Trước thanh 3', 'yì', '一起 yìqǐ', 'cùng nhau'],
        ['**Trước thanh 4**', '**yí**', '一样 **yí**yàng · 一下 **yí**xià', 'giống nhau · một chút'],
        ['Trước 个 (gốc gè, thanh 4)', '**yí**', '一个 **yí** ge', 'một cái'],
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận với số đếm',
      items: [
        '一月 yīyuè (tháng Một) giữ **yī** vì là tên tháng (thứ tự), dù 月 là thanh 4. Nhưng 一个月 yí ge yuè (một tháng — khoảng thời gian) thì 一 đứng trước 个 → **yí**.',
        'Đọc số điện thoại, số phòng, người Trung Quốc thường đọc 一 thành **yāo** cho khỏi nhầm với 七 qī: phòng 101 = yāo líng yāo. Sẽ học ở Bài 5 (số đếm).',
      ],
    },
    {
      t: 'phatam',
      id: 'b0-bd-luyen',
      title: 'Luyện biến điệu — đọc theo cách đọc thực tế',
      note: 'Pinyin bên dưới ghi theo từ điển với 3+3 (你好 nǐ hǎo) — bạn tự đổi thành ní hǎo khi đọc. 不 và 一 đã ghi sẵn theo cách đọc.',
      items: [
        { text: '{你好|nǐ hǎo}', ipa: 'nǐ hǎo', vi: 'Xin chào — đọc: ní hǎo' },
        { text: '{很好|hěn hǎo}', ipa: 'hěn hǎo', vi: 'Rất tốt — đọc: hén hǎo' },
        { text: '{可以|kěyǐ}', ipa: 'kěyǐ', vi: 'Được — đọc: kéyǐ' },
        { text: '{老师|lǎoshī}', ipa: 'lǎoshī', vi: 'Thầy cô — 老 trầm, 师 cao' },
        { text: '{不是|búshì}', ipa: 'búshì', vi: 'Không phải — 不 đọc bú' },
        { text: '{不好|bù hǎo}', ipa: 'bù hǎo', vi: 'Không tốt — 不 giữ bù' },
        { text: '{一个|yí ge}', ipa: 'yí ge', vi: 'Một cái — 一 đọc yí' },
        { text: '{一起|yìqǐ}', ipa: 'yìqǐ', vi: 'Cùng nhau — 一 đọc yì' },
        { text: '{一天|yì tiān}', ipa: 'yì tiān', vi: 'Một ngày — 一 đọc yì' },
        { text: '{十一|shíyī}', ipa: 'shíyī', vi: 'Mười một — 一 giữ yī (số đếm)' },
      ],
    },
    {
      t: 'mcq',
      id: 'b0-bd-trac-nghiem',
      title: 'Kiểm tra biến điệu',
      items: [
        m('你好 (viết nǐ hǎo) thực tế đọc là:', ['nǐ hǎo', 'ní hǎo', 'nǐ háo', 'nì hǎo'], 1, 'Thanh 3 + thanh 3 → chữ đầu đọc thanh 2: ní hǎo.'),
        m('Khi làm bài tập **viết** pinyin của 你好, nên ghi:', ['ní hǎo', 'nǐ hǎo', 'ni hao', 'nǐ háo'], 1, 'Viết theo từ điển: nǐ hǎo. Biến điệu 3+3 chỉ áp dụng khi đọc.'),
        m('不对 (không đúng) đọc thế nào?', ['bù duì', 'bú duì', 'bū duì', 'bǔ duì'], 1, '对 là thanh 4 → 不 đổi thành bú.'),
        m('不好 (không tốt) đọc thế nào?', ['bú hǎo', 'bù hǎo', 'bǔ hǎo', 'bū hǎo'], 1, '好 là thanh 3 → 不 giữ nguyên bù.'),
        m('一个 (một cái) đọc thế nào?', ['yī ge', 'yì ge', 'yí ge', 'yǐ ge'], 2, '个 gốc thanh 4 (gè) → 一 đọc yí.'),
        m('一起 (cùng nhau) đọc thế nào?', ['yīqǐ', 'yíqǐ', 'yìqǐ', 'yǐqǐ'], 2, '起 là thanh 3 → 一 đọc yì.'),
        m('十一 (mười một) đọc thế nào?', ['shíyī', 'shíyí', 'shíyì', 'shíyǐ'], 0, 'Số đếm, 一 đứng cuối → giữ yī.'),
        m('你们 (các bạn) có biến điệu 3+3 không?', ['Có: nímen', 'Không: 们 là thanh nhẹ, đọc nǐmen', 'Có: nǐmén', 'Không đọc 们'], 1, 'Chỉ thanh 3 + thanh 3 thật mới biến. 们 là thanh nhẹ.'),
        m('老师 (lǎoshī): chữ 老 đọc thế nào?', ['Đủ thanh 3: xuống rồi lên', 'Nửa thanh 3: chỉ trầm thấp', 'Thanh 2', 'Thanh 1'], 1, 'Thanh 3 trước thanh 1 → nửa thanh 3 (trầm, không vòng lên).'),
        m('不客气 viết pinyin trong khoá này là:', ['bù kèqi', 'bú kèqi', 'bù kěqì', 'bú kéqi'], 1, '客 gốc kè (thanh 4) → 不 đọc bú. Khoá ghi 不 theo cách đọc thực tế.'),
      ],
    },
  ],
};

/* ═══════════════════════════ 5. QUY TẮC VIẾT PINYIN ═══════════════════════════ */

const QUY_TAC: Lesson = {
  id: 'b0-quy-tac',
  kind: 'kana',
  title: 'Quy tắc viết pinyin — y/w, ü, iu/ui/un, dấu cách',
  goal: 'Đọc ra đúng âm từ cách viết pinyin (yu = ü, -iu = iou, -ui = uei…), tự viết pinyin đúng chính tả và gõ được pinyin có dấu.',
  minutes: 35,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Mục này học gì',
      items: [
        'Âm tiết bắt đầu bằng **i, u, ü** phải viết với **y, w**: i → yi, ia → ya, u → wu, ua → wa, ü → yu, üe → yue…',
        '**ü bỏ hai chấm** sau j, q, x, y (ju, qu, xu, yu) — chỉ giữ ü sau **n, l** (nǚ, lǜ).',
        'Ba vần **rút gọn** khi có phụ âm đứng trước: iou → **iu**, uei → **ui**, uen → **un**.',
        'Chữ trong cùng một **từ** viết liền (lǎoshī), từ khác cách ra; tên riêng và đầu câu viết hoa; dùng **dấu nháy \'** khi a, o, e mở đầu âm tiết thứ hai (Xī\'ān).',
      ],
    },
    { t: 'h', text: '1. Viết y và w' },
    {
      t: 'table',
      caption: 'Âm tiết không có thanh mẫu: viết thêm / đổi thành y, w',
      head: ['Vần gốc', 'Viết thành', 'Quy tắc', 'Ví dụ'],
      rows: [
        ['i, in, ing', 'yi, yin, ying', 'Thêm y phía trước', '一 yī · 音 yīn · 英 yīng'],
        ['ia, ie, iao, iou, ian, iang, iong', 'ya, ye, yao, you, yan, yang, yong', 'Đổi i thành y', '鸭 yā · 也 yě · 要 yào · 有 yǒu · 烟 yān · 样 yàng · 用 yòng'],
        ['u', 'wu', 'Thêm w phía trước', '五 wǔ · 无 wú'],
        ['ua, uo, uai, uei, uan, uen, uang, ueng', 'wa, wo, wai, wei, wan, wen, wang, weng', 'Đổi u thành w', '我 wǒ · 外 wài · 为 wèi · 晚 wǎn · 问 wèn · 王 Wáng'],
        ['ü, üe, üan, ün', 'yu, yue, yuan, yun', 'Thêm y, BỎ hai chấm', '鱼 yú · 月 yuè · 元 yuán · 云 yún'],
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận: yu là ü, không phải "iu"',
      items: [
        '**yu** đọc là **ü** (chu môi): 鱼 yú (cá) ≈ "uý" chụm môi — không đọc "diu" hay "iu".',
        '**you** đọc là **iou** ≈ "iâu/iêu": 有 yǒu (có). Đừng nhầm yu ↔ you.',
        '**wei** = uei ≈ "uây": 喂 wèi (alô), 为 wèi. **wo** = uo ≈ "ua/uô": 我 wǒ.',
      ],
    },

    { t: 'h', text: '2. ü sau j, q, x và n, l' },
    {
      t: 'p',
      text: 'j, q, x **không bao giờ** đi với u thật (môi tròn kiểu "u"), nên sau chúng người ta **bỏ hai chấm** cho gọn: ju, qu, xu, jue, quan, xun… đều là ü. Còn n và l đi được với cả u lẫn ü, nên phải giữ hai chấm để phân biệt: **nǔ** (努, cố gắng) ≠ **nǚ** (女, nữ); **lù** (路, đường) ≠ **lǜ** (绿, xanh lá). Khi gõ máy không có ü, người ta gõ **v** thay ü: "nv" → 女, "lv" → 绿.',
    },
    {
      t: 'table',
      caption: 'u nào là ü?',
      head: ['Viết', 'Thật ra là', 'Ví dụ'],
      rows: [
        ['ju, qu, xu', 'jü, qü, xü', '句 jù (câu) · 去 qù (đi) · 需 xū (cần)'],
        ['jue, que, xue', 'jüe, qüe, xüe', '觉 jué · 学 xué (học)'],
        ['juan, quan, xuan', 'jüan, qüan, xüan', '圈 quān (vòng) · 选 xuǎn (chọn)'],
        ['jun, qun, xun', 'jün, qün, xün', '军 jūn (quân) · 裙 qún (váy)'],
        ['yu, yue, yuan, yun', 'ü, üe, üan, ün', '鱼 yú · 月 yuè · 元 yuán · 云 yún'],
        ['nü, lü (giữ ü)', 'nü, lü', '女 nǚ (nữ) · 绿 lǜ (xanh lá)'],
        ['nu, lu, du, gu, zhu…', 'u thật', '努 nǔ · 路 lù · 读 dú · 住 zhù'],
      ],
    },

    { t: 'h', text: '3. Ba vần rút gọn: iu, ui, un' },
    {
      t: 'table',
      caption: 'Khi có thanh mẫu phía trước, vần ba chữ bị rút gọn khi viết — nhưng ĐỌC vẫn đủ',
      head: ['Vần gốc', 'Đứng đầu viết', 'Sau phụ âm viết', 'Đọc gần', 'Ví dụ'],
      rows: [
        ['iou', 'you', '-iu', 'iêu (i + âu)', '六 liù · 九 jiǔ · 牛 niú'],
        ['uei', 'wei', '-ui', 'uây', '对 duì · 贵 guì · 回 huí'],
        ['uen', 'wen', '-un', 'uân', '春 chūn · 论 lùn · 顿 dùn'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay đọc sai',
      items: [
        '**-ui không đọc "ui"**: 对 duì ≈ "tuây" (thanh 4), 贵 guì ≈ "cuây". Nếu đọc "tùi", "cùi" sẽ nghe rất lạ.',
        '**-iu không đọc "iu"**: 六 liù ≈ "liêu" (thanh 4), 九 jiǔ ≈ "chiểu". Âm "o/âu" giữa bị giấu khi viết nhưng vẫn phát ra, nhất là ở thanh 3 và thanh 4.',
        '**-un không đọc "un"** (sau phụ âm thường): 春 chūn ≈ "truân". Nhưng sau j q x thì un là ün: 军 jūn ≈ "chuyn".',
      ],
    },

    { t: 'h', text: '4. Viết liền, viết hoa, dấu nháy' },
    {
      t: 'table',
      caption: 'Quy tắc trình bày pinyin (theo chuẩn chính tả pinyin của Trung Quốc)',
      head: ['Quy tắc', 'Ví dụ đúng', 'Sai thường gặp'],
      rows: [
        ['Các âm tiết trong **một từ** viết liền', 'lǎoshī (老师), xuésheng (学生)', 'lǎo shī'],
        ['Các **từ** khác nhau cách nhau', 'Wǒ shì xuésheng. (我是学生。)', 'Wǒshìxuésheng.'],
        ['**Đầu câu** viết hoa', 'Nǐ hǎo!', 'nǐ hǎo!'],
        ['**Tên riêng** viết hoa; họ và tên tách nhau', 'Wáng Míng (王明), Běijīng (北京), Zhōngguó (中国)', 'wángmíng'],
        ['Âm tiết sau bắt đầu bằng **a, o, e** → thêm dấu nháy \'', 'Xī\'ān (西安), Tiān\'ānmén (天安门)', 'Xīān — dễ đọc nhầm thành xiān (先)'],
      ],
    },
    {
      t: 'p',
      text: '**Gõ pinyin có dấu thế nào?** Trên điện thoại/máy tính, bật bàn phím **Chinese (Simplified) — Pinyin**: gõ "nihao" rồi chọn 你好 — đó là cách gõ CHỮ HÁN. Muốn gõ **pinyin có dấu** (ǎ, ǐ…) cho bài tập: trên Mac dùng bàn phím **Pinyin — Simplified** và giữ phím nguyên âm (a) để chọn dấu; trên iPhone/Android giữ lâu chữ cái để hiện dấu. Ô đáp án của khoá **nhận cả dạng số**: gõ ni3 hao3 thay cho nǐ hǎo, số 5 hoặc không số cho thanh nhẹ (ma5 hoặc ma).',
    },
    {
      t: 'quiz',
      id: 'b0-qt-viet',
      title: 'Viết pinyin đúng chính tả (có dấu hoặc dạng số)',
      kind: 'fill',
      grammar: 'y/w · ü sau j q x y bỏ hai chấm · iou→iu, uei→ui, uen→un · dấu đặt theo a > o, e > i, u (iu/ui: chữ sau)',
      items: [
        { q: 'Vần **iou**, không phụ âm, thanh 3 (有 — có):', answers: py('yǒu', 'you3'), hint: 'iou đứng đầu viết you' },
        { q: '**l** + **iou**, thanh 4 (六 — sáu):', answers: py('liù', 'liu4'), hint: 'iou sau phụ âm rút thành iu; dấu trên u' },
        { q: '**g** + **uei**, thanh 4 (贵 — đắt):', answers: py('guì', 'gui4'), hint: 'uei → ui; dấu trên i' },
        { q: '**q** + **ü**, thanh 4 (去 — đi):', answers: py('qù', 'qu4'), hint: 'sau q bỏ hai chấm' },
        { q: '**n** + **ü**, thanh 3 (女 — nữ):', answers: py('nǚ', 'nv3', 'nü3'), hint: 'sau n GIỮ hai chấm' },
        { q: 'Vần **üe**, không phụ âm, thanh 4 (月 — tháng):', answers: py('yuè', 'yue4'), hint: 'ü đứng đầu → yu, bỏ hai chấm' },
        { q: 'Vần **uo**, không phụ âm, thanh 3 (我 — tôi):', answers: py('wǒ', 'wo3'), hint: 'u đứng đầu → w' },
        { q: 'Vần **i**, không phụ âm, thanh 1 (一 — một):', answers: py('yī', 'yi1'), hint: 'i đứng một mình → yi' },
        { q: '**x** + **üe**, thanh 2 (学 — học):', answers: py('xué', 'xue2'), hint: 'sau x bỏ hai chấm; dấu trên e' },
        { q: '**h** + **uei**, thanh 2 (回 — về):', answers: py('huí', 'hui2'), hint: 'uei → ui' },
        { q: 'Vần **üan**, không phụ âm, thanh 2 (元 — đồng):', answers: py('yuán', 'yuan2'), hint: 'üan đứng đầu → yuan' },
        { q: '**j** + **iou**, thanh 3 (九 — chín):', answers: py('jiǔ', 'jiu3'), hint: 'iou → iu' },
      ],
    },
    {
      t: 'mcq',
      id: 'b0-qt-trac-nghiem',
      title: 'Đọc ra âm thật từ chữ viết',
      items: [
        m('Trong **yú** (鱼 — cá), "yu" thật ra là âm:', ['iu', 'ü', 'u', 'iou'], 1, 'yu = ü đứng đầu âm tiết.'),
        m('Trong **duì** (对), vần thật là:', ['ui', 'uei', 'uai', 'ue'], 1, '-ui là dạng rút gọn của uei — đọc ≈ "uây".'),
        m('Trong **jù** (句), chữ u là:', ['u', 'ü', 'o', 'iu'], 1, 'Sau j q x, u luôn là ü.'),
        m('Vì sao 女 viết **nǚ** mà 去 viết **qù**?', ['Không có lý do', 'Sau n phải giữ ü để phân biệt với nu; sau q không có u thật nên bỏ chấm', 'Do thanh điệu khác nhau', 'Do 女 là chữ cổ'], 1, 'n đi được với cả u và ü (nǔ ≠ nǚ), còn q chỉ đi với ü.'),
        m('Cách viết đúng của 西安 (tên thành phố):', ['Xīān', 'Xī\'ān', 'xī ān', 'Xiān'], 1, 'Âm tiết sau bắt đầu bằng a → thêm dấu nháy, và tên riêng viết hoa: Xī\'ān.'),
        m('Câu 我是学生 viết pinyin đúng chuẩn:', ['wǒ shì xué sheng.', 'Wǒ shì xuésheng.', 'Wǒshìxuésheng.', 'WǑ SHÌ XUÉSHENG.'], 1, 'Đầu câu viết hoa; các âm tiết của một từ (学生) viết liền; các từ cách nhau.'),
        m('Muốn gõ ü trên bàn phím pinyin, người ta gõ phím:', ['u', 'v', 'y', 'w'], 1, 'Bàn phím pinyin dùng v thay ü: nv → 女.'),
        m('**liù** (六) đọc gần âm Việt nào?', ['"lìu"', '"liêu" (thanh 4)', '"lu"', '"li"'], 1, '-iu = iou, đọc ≈ "liêu" với thanh 4 rơi mạnh.'),
      ],
    },
  ],
};

/* ═══════════════════════════ 6. NÉT CHỮ & BỘ THỦ ═══════════════════════════ */

const NET_CHU: Lesson = {
  id: 'b0-net-chu',
  kind: 'kanji',
  title: 'Nét chữ cơ bản, quy tắc thứ tự nét và 10 bộ thủ hay gặp',
  goal: 'Gọi tên 8 nét cơ bản, viết đúng thứ tự nét theo 7 quy tắc, nhận ra 10 bộ thủ thường gặp và viết được 10 chữ đầu tiên: 一 二 三 十 人 大 口 日 中 小.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Mục này học gì',
      items: [
        'Mọi chữ Hán được ghép từ **8 nét cơ bản**: ngang, sổ, phẩy, chấm, mác, hất, gập, móc.',
        'Viết theo **thứ tự nét** cố định: ngang trước sổ sau, phẩy trước mác sau, trên trước dưới sau, trái trước phải sau, ngoài trước trong sau, vào nhà rồi đóng cửa, giữa trước hai bên sau.',
        '**Bộ thủ** (部首) là "bộ phận gợi nghĩa" của chữ: thấy 亻 đoán liên quan tới người, thấy 氵 đoán liên quan tới nước.',
        'Hơn 80% chữ Hán là **chữ hình thanh**: một phần gợi NGHĨA, một phần gợi ÂM — 妈 = 女 (nữ, gợi nghĩa) + 马 (mǎ, gợi âm).',
        'Hôm nay viết 10 chữ đơn giản nhất. Từ Bài 1, mỗi bài có phần chữ Hán với trình xem nét, tô theo và tự viết.',
      ],
    },
    { t: 'h', text: '1. Chữ giản thể và chữ phồn thể' },
    {
      t: 'p',
      text: 'Từ những năm **1950–1960**, Trung Quốc đại lục giản hoá hàng nghìn chữ Hán cho ít nét, dễ học — gọi là **chữ giản thể** (简体字). Đài Loan, Hồng Kông, Ma Cao vẫn dùng **chữ phồn thể** (繁体字). Khoá này và kỳ thi HSK dùng **giản thể**. Nếu bạn từng thấy chữ Hán trong đình chùa Việt Nam, đó là chữ phồn thể (hoặc chữ cổ) — nhiều chữ khác hẳn bản giản thể.',
    },
    {
      t: 'table',
      caption: 'Một số chữ giản thể ↔ phồn thể (chỉ để biết, không cần học phồn thể)',
      head: ['Giản thể', 'Phồn thể', 'Pinyin', 'Hán Việt', 'Nghĩa'],
      rows: [
        ['马', '馬', 'mǎ', 'MÃ', 'ngựa'],
        ['门', '門', 'mén', 'MÔN', 'cửa'],
        ['说', '說', 'shuō', 'THUYẾT', 'nói'],
        ['国', '國', 'guó', 'QUỐC', 'nước'],
        ['学', '學', 'xué', 'HỌC', 'học'],
        ['人', '人', 'rén', 'NHÂN', 'người — giống nhau'],
      ],
    },

    { t: 'h', text: '2. Tám nét cơ bản (基本笔画)' },
    {
      t: 'table',
      caption: '8 nét cơ bản — tên Trung, tên Việt, cách viết, chữ có nét đó',
      head: ['Nét', 'Tên Trung', 'Tên Việt', 'Cách viết', 'Có trong chữ'],
      rows: [
        ['一', '横 héng', 'Ngang', 'Trái → phải, hơi nhích lên ở cuối', '一 二 三 十'],
        ['丨', '竖 shù', 'Sổ (dọc)', 'Trên → dưới, thẳng', '十 中 日'],
        ['丿', '撇 piě', 'Phẩy', 'Trên phải → dưới trái, nhẹ dần', '人 八 大'],
        ['丶', '点 diǎn', 'Chấm', 'Ấn bút rồi kéo nhẹ xuống phải', '小 六 文'],
        ['㇏', '捺 nà', 'Mác', 'Trên trái → dưới phải, đậm dần rồi toả ra', '人 八 大'],
        ['㇀', '提 tí', 'Hất', 'Dưới trái → trên phải, ngắn, nhanh', '冷 (nét thứ 2) · 我 (nét thứ 4)'],
        ['𠃍', '折 zhé', 'Gập (chiết)', 'Đi ngang rồi gập xuống (hoặc ngược lại) — một nét liền', '口 日 中 (nét thứ 2)'],
        ['亅', '钩 gōu', 'Móc', 'Cuối nét hất ngược lên một móc nhỏ', '小 (nét giữa) · 你 (nét giữa phần 尔)'],
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận: nét gập và nét móc là MỘT nét',
      items: [
        'Trong 口 (miệng), phần góc trên bên phải "ngang rồi gập xuống" viết **liền một nét**, không nhấc bút. Vì vậy 口 chỉ có **3 nét**, không phải 4.',
        'Đếm sai số nét là lỗi rất phổ biến — và quan trọng vì từ điển giấy tra chữ theo số nét. Trình tập viết ở dưới hiện từng nét: hãy đếm theo nó.',
      ],
    },

    { t: 'h', text: '3. Bảy quy tắc thứ tự nét (笔顺规则)' },
    {
      t: 'table',
      caption: 'Thứ tự nét — viết đúng thì chữ đẹp, cân, và viết nhanh không bị rối',
      head: ['Quy tắc', 'Tiếng Trung', 'Chữ ví dụ', 'Thứ tự'],
      rows: [
        ['1. Ngang trước, sổ sau', '先横后竖', '十', 'ngang 一 → sổ 丨'],
        ['2. Phẩy trước, mác sau', '先撇后捺', '人 · 八', 'phẩy 丿 → mác ㇏'],
        ['3. Trên trước, dưới sau', '从上到下', '三 · 二', 'nét trên cùng → xuống dần'],
        ['4. Trái trước, phải sau', '从左到右', '你 · 们', 'phần 亻 bên trái → phần bên phải'],
        ['5. Ngoài trước, trong sau', '从外到内', '月 · 同', 'khung ngoài → nét bên trong'],
        ['6. Vào nhà rồi đóng cửa', '先里头后封口', '日 · 国 · 回', 'khung (trừ đáy) → bên trong → nét đáy đóng lại'],
        ['7. Giữa trước, hai bên sau', '先中间后两边', '小 · 水', 'nét giữa → trái → phải'],
      ],
    },

    { t: 'h', text: '4. Bộ thủ — "chìa khoá" đoán nghĩa' },
    {
      t: 'p',
      text: 'Từ điển chữ Hán xếp chữ theo **bộ thủ**. Bộ thủ thường đứng **bên trái**, **trên đầu** hoặc **bao ngoài** chữ, và gợi ý **chữ thuộc nhóm nghĩa nào**. Nhiều bộ khi làm phần bên trái bị viết **gọn lại**: 人 → 亻, 水 → 氵, 手 → 扌, 言 → 讠, 心 → 忄. Người Việt có lợi thế: tên bộ thủ chính là âm Hán Việt của chữ gốc.',
    },
    {
      t: 'table',
      caption: '10 bộ thủ gặp nhiều nhất ở HSK 1–2',
      head: ['Bộ', 'Chữ gốc', 'Tên Việt', 'Nghĩa gợi ý', 'Số nét', 'Chữ ví dụ'],
      rows: [
        ['亻', '人 rén', 'Nhân đứng', 'người', '2', '你 他 们 住'],
        ['口', '口 kǒu', 'Khẩu', 'miệng, ăn nói, âm thanh', '3', '吃 喝 吗 叫'],
        ['女', '女 nǚ', 'Nữ', 'phụ nữ', '3', '妈 她 好 姐'],
        ['氵', '水 shuǐ', 'Ba chấm thuỷ', 'nước, chất lỏng', '3', '没 汉 河 洗'],
        ['扌', '手 shǒu', 'Tài gảy (thủ)', 'tay, động tác bằng tay', '3', '打 找 把 拉'],
        ['木', '木 mù', 'Mộc', 'cây, gỗ', '4', '树 椅 林 桌'],
        ['讠', '言 yán', 'Ngôn', 'lời nói', '2', '说 话 语 谢 请'],
        ['艹', '草 cǎo', 'Thảo đầu', 'cỏ, cây', '3', '茶 菜 花 草'],
        ['心 / 忄', '心 xīn', 'Tâm / tâm đứng', 'lòng, cảm xúc, suy nghĩ', '4 / 3', '您 想 · 忙 快'],
        ['日', '日 rì', 'Nhật', 'mặt trời, ngày, thời gian', '4', '明 时 早 晚'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ: chữ hình thanh — nửa nghĩa, nửa âm',
      items: [
        '妈 mā (mẹ) = **女** (nữ → người phụ nữ) + **马** mǎ (gợi âm "ma").',
        '吗 ma (trợ từ hỏi) = **口** (miệng → lời nói) + **马** mǎ (gợi âm "ma").',
        '们 men (hậu tố số nhiều chỉ người) = **亻** (người) + **门** mén (gợi âm "men").',
        '请 qǐng (mời) = **讠** (lời nói) + **青** qīng (gợi âm "qing").',
        'Phần gợi âm chỉ **gần đúng** (thanh điệu hay đổi), nhưng gặp chữ mới bạn thường đoán được cả nghĩa lẫn âm. Học chữ qua bộ thủ + phần âm thì nhớ lâu hơn nhiều so với học thuộc từng nét.',
      ],
    },

    { t: 'h', text: '5. Mười chữ đầu tiên' },
    {
      t: 'table',
      caption: '10 chữ cơ bản — đơn giản, gặp hằng ngày, và là thành phần của rất nhiều chữ khác',
      head: ['Chữ', 'Pinyin', 'Hán Việt', 'Số nét', 'Nghĩa', 'Ghi nhớ'],
      rows: [
        ['一', 'yī', 'NHẤT', '1', 'một', 'Một nét ngang'],
        ['二', 'èr', 'NHỊ', '2', 'hai', 'Hai ngang: trên NGẮN, dưới dài'],
        ['三', 'sān', 'TAM', '3', 'ba', 'Ba ngang: ngắn — ngắn hơn — dài nhất ở dưới'],
        ['十', 'shí', 'THẬP', '2', 'mười', 'Ngang trước, sổ sau'],
        ['人', 'rén', 'NHÂN', '2', 'người', 'Hình người đang bước: phẩy trước, mác sau'],
        ['大', 'dà', 'ĐẠI', '3', 'to, lớn', 'Người 人 dang rộng hai tay 一'],
        ['口', 'kǒu', 'KHẨU', '3', 'miệng', 'Hình cái miệng; nét gập viết liền'],
        ['日', 'rì', 'NHẬT', '4', 'mặt trời, ngày', 'Mặt trời có vạch ở giữa; "vào nhà rồi đóng cửa"'],
        ['中', 'zhōng', 'TRUNG', '4', 'giữa', 'Một nét sổ xuyên qua giữa cái hộp — 中国 Trung Quốc'],
        ['小', 'xiǎo', 'TIỂU', '3', 'nhỏ', 'Giữa trước (sổ móc), hai chấm hai bên sau'],
      ],
    },
    {
      t: 'write',
      id: 'b0-viet-co-ban',
      title: 'Tập viết 10 chữ đầu tiên',
      note: 'Mỗi chữ: bấm ▶ xem thứ tự nét → tô theo nét mờ → tự viết trong ô trống. Đọc to pinyin khi viết. Chú ý: 二, 三 nét dưới cùng dài nhất; 口, 日, 中 nét gập viết liền; 日 và 口 đóng đáy SAU CÙNG.',
      chars: ['一', '二', '三', '十', '人', '大', '口', '日', '中', '小'],
    },
    {
      t: 'mcq',
      id: 'b0-nc-trac-nghiem',
      title: 'Kiểm tra nét chữ và bộ thủ',
      items: [
        m('Chữ 十 viết nét nào trước?', ['Sổ', 'Ngang', 'Viết cùng lúc', 'Tuỳ người'], 1, 'Quy tắc 1: ngang trước, sổ sau.'),
        m('Chữ 口 có mấy nét?', ['2', '3', '4', '5'], 1, 'Sổ — ngang gập (một nét) — ngang đáy: 3 nét.'),
        m('Chữ 日: nét ngang ĐÁY viết vào lúc nào?', ['Đầu tiên', 'Thứ hai', 'Sau cùng', 'Trước nét giữa'], 2, '"Vào nhà rồi đóng cửa": viết khung, nét giữa, rồi mới đóng đáy.'),
        m('Chữ 小 viết nét nào trước?', ['Chấm trái', 'Chấm phải', 'Nét sổ móc ở giữa', 'Tuỳ ý'], 2, 'Quy tắc 7: giữa trước, hai bên sau.'),
        m('Bộ 氵 gợi nghĩa gì?', ['Người', 'Nước', 'Lời nói', 'Cây'], 1, '氵 là dạng gọn của 水 (thuỷ — nước): 河 sông, 洗 rửa, 汉 (sông Hán).'),
        m('Bộ 讠 thường có trong chữ liên quan tới:', ['Lời nói', 'Cây cỏ', 'Phụ nữ', 'Tay'], 0, '讠 là dạng giản thể của 言 (ngôn — lời): 说 nói, 话 lời, 谢 cảm ơn, 请 mời.'),
        m('Trong chữ 妈 (mẹ), phần 马 có vai trò gì?', ['Gợi nghĩa "ngựa"', 'Gợi âm "ma"', 'Bộ thủ chính', 'Không vai trò gì'], 1, '妈 là chữ hình thanh: 女 gợi nghĩa, 马 mǎ gợi âm.'),
        m('Khoá này và kỳ thi HSK dùng loại chữ nào?', ['Phồn thể', 'Giản thể', 'Chữ Nôm', 'Cả hai'], 1, 'HSK và Trung Quốc đại lục dùng chữ giản thể (简体字).'),
        m('Nét **phẩy** (丿) đi theo hướng nào?', ['Trái → phải', 'Trên phải → dưới trái', 'Trên trái → dưới phải', 'Dưới → trên'], 1, 'Phẩy: từ trên bên phải kéo xuống bên trái. Mác thì ngược lại (trên trái → dưới phải).'),
        m('Chữ 人 viết thế nào?', ['Mác trước, phẩy sau', 'Phẩy trước, mác sau', 'Một nét', 'Sổ rồi ngang'], 1, 'Quy tắc 2: phẩy trước, mác sau.'),
      ],
    },
  ],
};

/* ═══════════════════════════ 7. CHÀO HỎI ĐẦU TIÊN ═══════════════════════════ */

const CHAO_HOI: Lesson = {
  id: 'b0-chao-hoi',
  kind: 'conversation',
  title: 'Câu chào đầu tiên — 你好, 谢谢, 对不起, 再见',
  goal: 'Nói đúng thanh 8 câu giao tiếp tối thiểu: chào, chào lịch sự, cảm ơn và đáp lại, xin lỗi và đáp lại, tạm biệt.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Mục này học gì',
      items: [
        '**你好** nǐ hǎo (đọc ní hǎo) — xin chào. **您好** nín hǎo — chào (lịch sự, với người lớn tuổi, thầy cô, khách).',
        '**谢谢** xièxie — cảm ơn → đáp **不客气** bú kèqi — không có gì.',
        '**对不起** duìbuqǐ — xin lỗi → đáp **没关系** méi guānxi — không sao.',
        '**再见** zàijiàn — tạm biệt.',
        'Đây là bản "giới thiệu"; Bài 1 học kỹ từng câu, thêm 我/你/他/她, 很 và câu hỏi 吗.',
      ],
    },
    { t: 'h', text: '1. Gặp nhau lần đầu' },
    {
      t: 'p',
      text: '**Tình huống.** Ngày đầu tiên ở ký túc xá một trường đại học ở Bắc Kinh. **Lan** (兰兰 Lánlan, sinh viên Việt Nam) gặp **Vương Minh** (王明 Wáng Míng, bạn cùng lớp người Trung Quốc) ở hành lang.',
    },
    {
      t: 'dialogue',
      title: 'Chào nhau',
      lines: [
        { who: '王明 Vương Minh', role: 'b', text: '{你好|nǐ hǎo}！', ro: 'Nǐ hǎo!', vi: 'Chào bạn!' },
        { who: '兰兰 Lan', role: 'a', text: '{你好|nǐ hǎo}！', ro: 'Nǐ hǎo!', vi: 'Chào bạn!' },
      ],
    },
    {
      t: 'p',
      text: 'Chỉ hai chữ mà đủ dùng với **bất kỳ ai** cùng lứa: bạn học, người bán hàng, người lạ. Nhớ đọc **ní hǎo** (biến điệu 3+3): 你 đi lên, 好 xuống thấp rồi lên.',
    },

    { t: 'h', text: '2. Chào cô giáo — dùng 您' },
    {
      t: 'p',
      text: '**Tình huống.** Lan và Vương Minh vào lớp. Cô giáo là **cô Lý** (李老师 Lǐ lǎoshī). Với thầy cô và người lớn tuổi, nói **您好** nín hǎo (您 = "ngài", kính trọng hơn 你) hoặc gọi chức danh + 好: **老师好** lǎoshī hǎo.',
    },
    {
      t: 'dialogue',
      title: 'Chào cô giáo',
      lines: [
        { who: '兰兰 Lan', role: 'a', text: '{老师|lǎoshī}{好|hǎo}！', ro: 'Lǎoshī hǎo!', vi: 'Em chào cô ạ!' },
        { who: '王明 Vương Minh', role: 'b', text: '{您好|nín hǎo}！', ro: 'Nín hǎo!', vi: 'Em chào cô ạ!' },
        { who: '李老师 Cô Lý', role: 'c', text: '{你们好|nǐmen hǎo}！', ro: 'Nǐmen hǎo!', vi: 'Chào các em!' },
      ],
    },
    {
      t: 'note',
      title: 'Ghi nhớ — chào đúng người',
      items: [
        '**你好** — người ngang hàng, người trẻ hơn, người lạ trong tình huống thường.',
        '**您好** — người lớn tuổi, thầy cô, khách hàng, cấp trên. 您 nín: thanh 2, vần -in.',
        '**你们好** — chào nhiều người cùng lúc ("chào các bạn"). 们 men là hậu tố số nhiều chỉ người, đọc nhẹ.',
        '**老师好** — "Chào thầy/cô" — học sinh Trung Quốc chào thầy cô như vậy mỗi đầu giờ. Lưu ý 老 lǎo + 师 shī: 老 đọc nửa thanh 3 (trầm).',
      ],
    },

    { t: 'h', text: '3. Cảm ơn và xin lỗi' },
    {
      t: 'p',
      text: '**Tình huống.** Trong lớp, Lan làm rơi bút; Vương Minh nhặt giúp. Một lúc sau, Lan vô ý va vào bàn của bạn **Anna** (安娜 Ānnà, bạn người Nga).',
    },
    {
      t: 'dialogue',
      title: 'Cảm ơn',
      lines: [
        { who: '兰兰 Lan', role: 'a', text: '{谢谢|xièxie}！', ro: 'Xièxie!', vi: 'Cảm ơn bạn!' },
        { who: '王明 Vương Minh', role: 'b', text: '{不客气|bú kèqi}。', ro: 'Bú kèqi.', vi: 'Không có gì.' },
      ],
    },
    {
      t: 'dialogue',
      title: 'Xin lỗi',
      lines: [
        { who: '兰兰 Lan', role: 'a', text: '{对不起|duìbuqǐ}！', ro: 'Duìbuqǐ!', vi: 'Xin lỗi bạn!' },
        { who: '安娜 Anna', role: 'c', text: '{没关系|méi guānxi}。', ro: 'Méi guānxi.', vi: 'Không sao đâu.' },
      ],
    },
    {
      t: 'table',
      caption: 'Phân tích từng câu — để đọc đúng thanh',
      head: ['Câu', 'Pinyin (từ điển)', 'Đọc thực tế', 'Hán Việt', 'Ghi chú'],
      rows: [
        ['谢谢', 'xièxie', 'xiè-xie (chữ sau nhẹ)', 'TẠ TẠ', 'Không đọc hai thanh 4 "xiè xiè"'],
        ['不客气', 'bú kèqi', 'bú kè-qi', 'BẤT KHÁCH KHÍ', '"Đừng khách sáo" — 不 → bú vì 客 thanh 4'],
        ['对不起', 'duìbuqǐ', 'duì-bu-qǐ', 'ĐỐI BẤT KHỞI', '不 ở giữa đọc nhẹ; 起 thanh 3 đọc đủ ở cuối'],
        ['没关系', 'méi guānxi', 'méi guān-xi', 'MỘT QUAN HỆ', '"Không có liên quan gì" → không sao; 系 đọc nhẹ'],
        ['再见', 'zàijiàn', 'zài-jiàn', 'TÁI KIẾN', '"Gặp lại" — hai thanh 4, cả hai rơi mạnh'],
      ],
    },

    { t: 'h', text: '4. Tạm biệt' },
    {
      t: 'p',
      text: '**Tình huống.** Hết giờ học, Lan chào cô Lý và bạn **Đại Vĩ** (大伟 Dàwěi, bạn người Mỹ).',
    },
    {
      t: 'dialogue',
      title: 'Tạm biệt',
      lines: [
        { who: '兰兰 Lan', role: 'a', text: '{老师|lǎoshī}，{再见|zàijiàn}！', ro: 'Lǎoshī, zàijiàn!', vi: 'Em chào cô ạ! (khi ra về)' },
        { who: '李老师 Cô Lý', role: 'c', text: '{再见|zàijiàn}！', ro: 'Zàijiàn!', vi: 'Tạm biệt em!' },
        { who: '大伟 Đại Vĩ', role: 'b', text: '{兰兰|Lánlan}，{再见|zàijiàn}！', ro: 'Lánlan, zàijiàn!', vi: 'Lan ơi, tạm biệt nhé!' },
        { who: '兰兰 Lan', role: 'a', text: '{再见|zàijiàn}！', ro: 'Zàijiàn!', vi: 'Tạm biệt!' },
      ],
    },
    {
      t: 'examples',
      items: [
        { en: '{你好|nǐ hǎo}！', ro: 'Nǐ hǎo!', vi: 'Xin chào! (đọc ní hǎo)' },
        { en: '{您好|nín hǎo}！', ro: 'Nín hǎo!', vi: 'Xin chào (lịch sự)!' },
        { en: '{你们好|nǐmen hǎo}！', ro: 'Nǐmen hǎo!', vi: 'Chào các bạn!' },
        { en: '{老师|lǎoshī}{好|hǎo}！', ro: 'Lǎoshī hǎo!', vi: 'Em chào thầy/cô!' },
        { en: '{谢谢|xièxie}！— {不客气|bú kèqi}。', ro: 'Xièxie! — Bú kèqi.', vi: 'Cảm ơn! — Không có gì.' },
        { en: '{对不起|duìbuqǐ}！— {没关系|méi guānxi}。', ro: 'Duìbuqǐ! — Méi guānxi.', vi: 'Xin lỗi! — Không sao.' },
        { en: '{再见|zàijiàn}！', ro: 'Zàijiàn!', vi: 'Tạm biệt!' },
      ],
    },
    {
      t: 'phatam',
      id: 'b0-ch-phat-am',
      title: 'Đọc to 10 câu chào — chú ý thanh điệu',
      note: 'Pinyin ghi theo từ điển. Nhớ biến điệu: 你好 đọc ní hǎo. Mỗi câu đọc 3 lần, lần cuối không nhìn pinyin.',
      items: [
        { text: '{你好|nǐ hǎo}！', ipa: 'Nǐ hǎo!', vi: 'Xin chào! — đọc ní hǎo' },
        { text: '{您好|nín hǎo}！', ipa: 'Nín hǎo!', vi: 'Xin chào (lịch sự)!' },
        { text: '{你们好|nǐmen hǎo}！', ipa: 'Nǐmen hǎo!', vi: 'Chào các bạn!' },
        { text: '{老师|lǎoshī}{好|hǎo}！', ipa: 'Lǎoshī hǎo!', vi: 'Em chào thầy/cô!' },
        { text: '{谢谢|xièxie}！', ipa: 'Xièxie!', vi: 'Cảm ơn!' },
        { text: '{不客气|bú kèqi}。', ipa: 'Bú kèqi.', vi: 'Không có gì.' },
        { text: '{对不起|duìbuqǐ}！', ipa: 'Duìbuqǐ!', vi: 'Xin lỗi!' },
        { text: '{没关系|méi guānxi}。', ipa: 'Méi guānxi.', vi: 'Không sao.' },
        { text: '{再见|zàijiàn}！', ipa: 'Zàijiàn!', vi: 'Tạm biệt!' },
        { text: '{老师|lǎoshī}，{再见|zàijiàn}！', ipa: 'Lǎoshī, zàijiàn!', vi: 'Em chào thầy/cô (ra về)!' },
      ],
    },
    {
      t: 'mcq',
      id: 'b0-ch-tinh-huong',
      title: 'Nói gì trong tình huống này?',
      items: [
        m('Gặp cô giáo ở cổng trường buổi sáng, bạn nói:', ['你们好！', '老师好！', '再见！', '没关系。'], 1, 'Chào thầy cô: 老师好 (hoặc 您好).'),
        m('Bạn cùng phòng mua giúp bạn chai nước. Bạn nói:', ['对不起！', '谢谢！', '不客气。', '再见！'], 1, 'Cảm ơn: 谢谢 xièxie.'),
        m('Người khác nói 谢谢 với bạn. Bạn đáp:', ['谢谢。', '不客气。', '对不起。', '你好。'], 1, 'Đáp lời cảm ơn: 不客气 bú kèqi.'),
        m('Bạn giẫm vào chân người khác. Bạn nói:', ['不客气！', '没关系！', '对不起！', '你好！'], 2, 'Xin lỗi: 对不起 duìbuqǐ.'),
        m('Ai đó nói 对不起 với bạn. Bạn đáp:', ['没关系。', '不客气。', '谢谢。', '再见。'], 0, 'Đáp lời xin lỗi: 没关系 méi guānxi.'),
        m('Cô giáo bước vào lớp, chào cả lớp. Cô nói:', ['你好！', '你们好！', '您好！', '老师好！'], 1, 'Chào nhiều người: 你们好 nǐmen hǎo.'),
        m('Chào một bác lớn tuổi, lịch sự nhất là:', ['你好！', '您好！', '你们好！', '再见！'], 1, '您 nín — cách gọi kính trọng.'),
        m('Hết giờ học, chia tay bạn. Bạn nói:', ['你好！', '再见！', '谢谢！', '对不起！'], 1, 'Tạm biệt: 再见 zàijiàn.'),
      ],
    },
  ],
};

/* ═══════════════════════════ 8. BÀI TẬP TỔNG HỢP ═══════════════════════════ */

const BAI_TAP: Lesson = {
  id: 'b0-bai-tap',
  kind: 'homework',
  title: 'Bài tập Bài 0 — ôn pinyin, thanh điệu, biến điệu',
  goal: 'Tự kiểm tra toàn bộ Bài 0: điền dấu thanh, viết pinyin của các câu chào, nhận ra âm bật hơi, vần mũi, biến điệu. Đạt ≥ 80% rồi hãy sang Bài 1.',
  minutes: 35,
  blocks: [
    {
      t: 'recap',
      title: '🎯 Trước khi làm bài',
      items: [
        '21 thanh mẫu: nhớ **bật hơi** (p t k q ch c) và **uốn lưỡi** (zh ch sh r).',
        'Vần khó: **e** ≈ ơ/ưa, **ü** chu môi, **ian** ≈ iên, **en/eng** ≈ ân/âng, **ong** ≈ ung, **-iu/-ui/-un** = iou/uei/uen.',
        'Thanh: 1 cao bằng · 2 lên · 3 trầm (xuống-lên) · 4 rơi · nhẹ không dấu. Dấu đặt theo **a > o, e > i, u** (iu, ui: chữ sau).',
        'Biến điệu: **3+3 → 2+3** (không ghi lên chữ) · **不 → bú** trước thanh 4 · **一 → yí** trước thanh 4, **yì** trước thanh 1-2-3.',
        'Ô gõ pinyin nhận dạng **có dấu** (nǐ hǎo) hoặc **dạng số** (ni3 hao3; thanh nhẹ = 5 hoặc bỏ số).',
      ],
    },
    { t: 'h', text: '1. Điền dấu thanh' },
    {
      t: 'quiz',
      id: 'b0-bt-dau-thanh',
      title: 'Viết âm tiết có dấu thanh đúng vị trí',
      kind: 'fill',
      grammar: 'Thứ tự đặt dấu: a > o, e > i, u, ü · iu/ui đặt trên chữ sau · dấu trên i thì bỏ chấm',
      items: [
        { q: '妈 — ma, thanh 1', answers: py('mā', 'ma1'), hint: 'mẹ' },
        { q: '好 — hao, thanh 3', answers: py('hǎo', 'hao3'), hint: 'dấu trên a' },
        { q: '谢 — xie, thanh 4', answers: py('xiè', 'xie4'), hint: 'dấu trên e' },
        { q: '国 — guo, thanh 2', answers: py('guó', 'guo2'), hint: 'dấu trên o' },
        { q: '对 — dui, thanh 4', answers: py('duì', 'dui4'), hint: 'ui → dấu trên i' },
        { q: '九 — jiu, thanh 3', answers: py('jiǔ', 'jiu3'), hint: 'iu → dấu trên u' },
        { q: '你 — ni, thanh 3', answers: py('nǐ', 'ni3'), hint: 'dấu trên i, bỏ chấm' },
        { q: '绿 — lü, thanh 4', answers: py('lǜ', 'lv4', 'lü4'), hint: 'giữ hai chấm sau l' },
        { q: '小 — xiao, thanh 3', answers: py('xiǎo', 'xiao3'), hint: 'có a → dấu trên a' },
        { q: '学 — xue, thanh 2', answers: py('xué', 'xue2'), hint: 'dấu trên e' },
      ],
    },

    { t: 'h', text: '2. Viết pinyin các câu chào' },
    {
      t: 'quiz',
      id: 'b0-bt-pinyin-cau',
      title: 'Viết pinyin (theo từ điển — 3+3 không đổi dấu)',
      kind: 'fill',
      grammar: 'Các âm tiết trong một từ viết liền; 不 ghi theo cách đọc (bú trước thanh 4)',
      items: [
        { q: '你好 (xin chào)', answers: py('nǐ hǎo', 'ni3 hao3'), hint: 'viết theo từ điển, không phải ní' },
        { q: '谢谢 (cảm ơn)', answers: py('xièxie', 'xie4xie', 'xie4xie5', 'xie4 xie', 'xie4 xie5'), hint: 'chữ sau thanh nhẹ' },
        { q: '再见 (tạm biệt)', answers: py('zàijiàn', 'zai4jian4', 'zài jiàn', 'zai4 jian4'), hint: 'hai thanh 4' },
        { q: '老师 (thầy cô)', answers: py('lǎoshī', 'lao3shi1', 'lǎo shī', 'lao3 shi1'), hint: '3 + 1' },
        { q: '您好 (xin chào — lịch sự)', answers: py('nín hǎo', 'nin2 hao3'), hint: '您 thanh 2' },
        { q: '不客气 (không có gì)', answers: py('bú kèqi', 'bu2 ke4qi', 'bu2 ke4qi5', 'bu2 ke4 qi5', 'bu2 ke4 qi', 'bú kè qi'), hint: '不 trước thanh 4 → bú; 气 nhẹ' },
        { q: '对不起 (xin lỗi)', answers: py('duìbuqǐ', 'dui4buqi3', 'dui4bu5qi3', 'duì bu qǐ', 'dui4 bu qi3', 'dui4 bu5 qi3'), hint: '不 ở giữa đọc nhẹ' },
        { q: '没关系 (không sao)', answers: py('méi guānxi', 'mei2 guan1xi', 'mei2 guan1xi5', 'mei2 guan1 xi', 'mei2 guan1 xi5', 'méi guān xi'), hint: '系 nhẹ' },
      ],
    },

    { t: 'h', text: '3. Trắc nghiệm tổng hợp' },
    {
      t: 'mcq',
      id: 'b0-bt-tong-hop',
      title: 'Trắc nghiệm Bài 0',
      items: [
        m('Chữ nào có thanh mẫu **bật hơi**?', ['八 bā', '他 tā', '大 dà', '哥 gē'], 1, 't là âm bật hơi; b, d, g không bật hơi.'),
        m('Chữ nào có thanh mẫu **uốn lưỡi**?', ['四 sì', '字 zì', '是 shì', '西 xī'], 2, 'sh thuộc nhóm uốn lưỡi zh ch sh r.'),
        m('Âm **x** trong 谢 xiè gần âm Việt nào?', ['"k"', '"x" mặt lưỡi', '"ch" bật hơi', '"s" uốn lưỡi'], 1, 'x ≈ "x" nhưng mặt lưỡi áp hàm trên.'),
        m('Vần nào đọc gần **"iên"**?', ['ian', 'ie', 'in', 'iang'], 0, 'ian ≈ iên (天 tiān ≈ thiên).'),
        m('Vần nào đọc gần **"ung"**?', ['ong', 'un', 'eng', 'uang'], 0, 'ong ≈ ung (中 zhōng ≈ trung).'),
        m('Âm tiết nào có **ü**?', ['路 lù', '去 qù', '五 wǔ', '读 dú'], 1, 'u sau q là ü.'),
        m('**liù** (六) — vần gốc là:', ['iu', 'iou', 'io', 'iao'], 1, '-iu là dạng rút gọn của iou.'),
        m('Thanh nào **đi lên** từ giữa lên cao?', ['Thanh 1', 'Thanh 2', 'Thanh 3', 'Thanh 4'], 1, 'Thanh 2: 3 → 5.'),
        m('很好 đọc thực tế là:', ['hěn hǎo', 'hén hǎo', 'hěn háo', 'hèn hǎo'], 1, '3 + 3 → 2 + 3.'),
        m('不是 đọc thực tế là:', ['bùshì', 'búshì', 'bǔshì', 'bushi'], 1, '是 thanh 4 → 不 thành bú.'),
        m('一样 (giống nhau) đọc là:', ['yīyàng', 'yíyàng', 'yìyàng', 'yǐyàng'], 1, '样 thanh 4 → 一 thành yí.'),
        m('一年 (một năm) đọc là:', ['yīnián', 'yínián', 'yì nián', 'yǐ nián'], 2, '年 thanh 2 → 一 thành yì.'),
        m('Đáp lại 谢谢 nói:', ['没关系', '不客气', '对不起', '再见'], 1, '谢谢 → 不客气; 对不起 → 没关系.'),
        m('Bộ thủ nào gợi nghĩa **"người"**?', ['氵', '亻', '讠', '艹'], 1, '亻 = nhân đứng (dạng gọn của 人).'),
        m('Chữ 中 có mấy nét?', ['3', '4', '5', '6'], 1, 'Sổ — ngang gập — ngang — sổ giữa: 4 nét.'),
      ],
    },
    {
      t: 'table',
      caption: 'Tự đánh giá — đánh dấu vào phần còn yếu và ôn lại mục tương ứng',
      head: ['Điểm', 'Ý nghĩa', 'Làm gì tiếp'],
      rows: [
        ['≥ 80%', 'Nắm chắc pinyin', 'Sang Bài 1. Mỗi ngày dành 5 phút đọc lại bảng 4 thanh (妈麻马骂…).'],
        ['60–79%', 'Còn lẫn một phần', 'Ôn lại mục có nhiều câu sai (thanh mẫu / vận mẫu / thanh điệu / biến điệu), làm lại bài tập.'],
        ['< 60%', 'Chưa vững nền', 'Học lại từ mục Thanh điệu, luyện phát âm với máy chấm từng câu cho tới khi đạt ≥ 80 điểm.'],
      ],
    },
  ],
};

export const BAI_0: Lesson[] = [THANH_MAU, VAN_MAU, THANH_DIEU, BIEN_DIEU, QUY_TAC, NET_CHU, CHAO_HOI, BAI_TAP];
