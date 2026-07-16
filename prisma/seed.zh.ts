/* eslint-disable */
/**
 * Prisma seed — Chinese (zh) learning data for the "My Language" module.
 * Run with:  npx tsx prisma/seed.zh.ts
 *
 * Fully idempotent & safe to re-run:
 *  - the language is upserted by unique code ('zh') with `update: {}`
 *  - every group / item / category / word / grammar / listening /
 *    conversation / reading / qna row is find-before-create
 *  - nothing is ever deleted or overwritten
 *
 * Content: HSK1–HSK3, simplified characters + pinyin with tone marks,
 * all UI-facing text in Vietnamese.
 */
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// ============================ TYPES ============================
interface WordSeed {
  word: string;
  meaningVi: string;
  exampleSentence: string | null;
  exampleMeaning: string | null;
  note: string | null;
  pron: string | null; // pinyin with tone marks
}
interface CategorySeed {
  name: string;
  icon: string;
  words: WordSeed[];
}
interface ExampleSeed {
  sentence: string;
  pronunciation?: string;
  meaningVi: string;
}
interface GrammarSeed {
  level: string; // "HSK1" | "HSK2" | "HSK3"
  title: string;
  structure: string;
  explanation: string; // HTML string (Vietnamese)
  examples: ExampleSeed[];
  commonMistakes: string | null;
  comparedWith: string | null;
}
interface ListeningQuestion {
  question: string;
  answer: string;
}
interface ListeningSeed {
  title: string;
  youtubeUrl: string;
  transcript: string;
  translation: string;
  questions: ListeningQuestion[];
}
interface ConversationSeed {
  question: string;
  answer: string;
  questionPronunciation: string;
  answerPronunciation: string;
  meaningVi: string;
  note: string | null;
}
interface ReadingSeed {
  title: string;
  content: string; // HTML string (simplified Chinese)
  translation: string; // HTML string (Vietnamese)
}
interface QnaSeed {
  question: string;
  answer: string;
  pronunciation: string; // pinyin of the answer
  meaningVi: string;
}
interface AlphaItem {
  character: string;
  romanization: string;
  note?: string;
}
interface AlphaGroup {
  name: string;
  description: string;
  items: AlphaItem[];
}

// ============================ SUMMARY ============================
const summary = {
  languages: { created: 0, skipped: 0 },
  alphabetGroups: { created: 0, skipped: 0 },
  alphabetItems: { created: 0, skipped: 0 },
  categories: { created: 0, skipped: 0 },
  words: { created: 0, skipped: 0 },
  pronunciations: { created: 0 },
  grammar: { created: 0, skipped: 0 },
  listening: { created: 0, skipped: 0 },
  conversation: { created: 0, skipped: 0 },
  reading: { created: 0, skipped: 0 },
  qna: { created: 0, skipped: 0 },
};

// ============================ 1. ALPHABET (PINYIN) ============================
const ZH_ALPHABET: AlphaGroup[] = [
  {
    name: "Thanh mẫu (Phụ âm đầu)",
    description: "23 thanh mẫu (phụ âm đầu) của hệ thống pinyin tiếng Trung. Mỗi âm kèm ví dụ và mẹo phát âm dành riêng cho người Việt.",
    items: [
      { character: "b", romanization: "bā 八 (số 8)", note: "Âm môi, KHÔNG bật hơi, giống 'p' nhẹ trong tiếng Việt (như 'pa' nói nhẹ). Mẹo: đặt tờ giấy trước miệng — nói 'b' giấy KHÔNG bay." },
      { character: "p", romanization: "pā 趴 (nằm sấp)", note: "Âm môi, BẬT HƠI mạnh, giống 'p' nhưng kèm luồng hơi phụt ra. Mẹo: tờ giấy trước miệng phải bay lên khi phát âm." },
      { character: "m", romanization: "mā 妈 (mẹ)", note: "Giống hệt 'm' tiếng Việt trong 'mẹ'. Âm mũi, hai môi khép." },
      { character: "f", romanization: "fā 发 (phát)", note: "Giống 'ph' tiếng Việt trong 'phở'. Răng trên chạm môi dưới." },
      { character: "d", romanization: "dà 大 (to, lớn)", note: "KHÔNG bật hơi, giống 't' tiếng Việt trong 'ta' (không phải 'đ'). Mẹo: người Việt hay đọc nhầm thành 'đ' — hãy đọc như 't' nhẹ, không rung." },
      { character: "t", romanization: "tā 他 (anh ấy)", note: "BẬT HƠI mạnh, giống 'th' tiếng Việt trong 'thơ'. Cặp d/t phân biệt bằng luồng hơi." },
      { character: "n", romanization: "nǐ 你 (bạn)", note: "Giống 'n' tiếng Việt trong 'nó'. Đầu lưỡi chạm lợi trên." },
      { character: "l", romanization: "lái 来 (đến)", note: "Giống 'l' tiếng Việt trong 'lá'. Chú ý phân biệt n/l nếu bạn nói giọng địa phương lẫn hai âm này." },
      { character: "g", romanization: "gē 哥 (anh trai)", note: "KHÔNG bật hơi, giống 'c/k' tiếng Việt trong 'ca' (không phải 'g' rung). Mẹo: đọc như 'cưa' bỏ 'ưa', gốc lưỡi chạm ngạc mềm." },
      { character: "k", romanization: "kāi 开 (mở)", note: "BẬT HƠI mạnh, giống 'kh' tiếng Việt nhưng bật hơi chứ không xát. Mẹo: nói 'k' kèm hơi phụt như thổi nến." },
      { character: "h", romanization: "hē 喝 (uống)", note: "Giống 'h' tiếng Việt nhưng xát nhẹ ở cuống họng, hơi giống 'kh' nhẹ. Nghe như giữa 'h' và 'kh'." },
      { character: "j", romanization: "jiā 家 (nhà)", note: "Gần giống 'ch' tiếng Việt trong 'chị' nhưng lưỡi phẳng, đầu lưỡi chạm răng dưới, KHÔNG bật hơi. Luôn đi với i/ü." },
      { character: "q", romanization: "qī 七 (số 7)", note: "Như 'j' nhưng BẬT HƠI mạnh. Người Việt nghe giống 'ch' + hơi. Mẹo: nói 'chi' kèm luồng hơi phụt ra. Luôn đi với i/ü." },
      { character: "x", romanization: "xiè 谢 (cảm ơn)", note: "Gần giống 'x' tiếng Việt trong 'xin' nhưng lưỡi nâng cao hơn, âm mỏng hơn. Luôn đi với i/ü." },
      { character: "zh", romanization: "zhōng 中 (trung)", note: "Âm uốn lưỡi, KHÔNG bật hơi: giống 'tr' tiếng Việt (giọng miền Nam 'trâu') nhưng đầu lưỡi cong chạm ngạc cứng. Mẹo: đọc 'tr' và giữ lưỡi cong lên." },
      { character: "ch", romanization: "chī 吃 (ăn)", note: "Âm uốn lưỡi, BẬT HƠI: như 'zh' + luồng hơi mạnh. Người Việt tưởng tượng 'tr' + 'h'." },
      { character: "sh", romanization: "shì 是 (là)", note: "Âm uốn lưỡi xát: giống 's' nặng/miền Nam trong 'sông', lưỡi cong lên ngạc cứng. Khác 'x' (lưỡi phẳng)." },
      { character: "r", romanization: "rè 热 (nóng)", note: "Âm uốn lưỡi hữu thanh: giống 'r' miền Nam nói nhẹ, KHÔNG rung lưỡi kiểu 'rrr'. Gần với 'j' trong tiếng Anh 'measure'." },
      { character: "z", romanization: "zài 在 (ở)", note: "Âm đầu lưỡi thẳng, KHÔNG bật hơi: đọc như 'ch' + 'x' dính liền = 'ts' không hơi. Mẹo: nói 'chưa' nhưng đầu lưỡi chạm răng." },
      { character: "c", romanization: "cài 菜 (rau, món ăn)", note: "Như 'z' nhưng BẬT HƠI mạnh = 'ts' + hơi. Người Việt hay nhầm với 'x' — nhớ 'c' có tiếng 't' bật ở đầu." },
      { character: "s", romanization: "sān 三 (số 3)", note: "Giống 'x' tiếng Việt trong 'xa' (âm xát phẳng, không cong lưỡi). Khác 'sh' (cong lưỡi)." },
      { character: "y", romanization: "yī 一 (số 1)", note: "Bán nguyên âm, giống 'y/i' tiếng Việt. Thực chất là cách viết của 'i' khi đứng đầu âm tiết (i → yi, ia → ya)." },
      { character: "w", romanization: "wǒ 我 (tôi)", note: "Bán nguyên âm, giống 'u/w' tiếng Việt trong 'quà'. Là cách viết của 'u' khi đứng đầu âm tiết (u → wu, uan → wan)." },
    ],
  },
  {
    name: "Vận mẫu (Nguyên âm)",
    description: "Các vận mẫu (nguyên âm đơn, nguyên âm kép và nguyên âm mũi) của pinyin, kèm ví dụ và mẹo phát âm cho người Việt.",
    items: [
      { character: "a", romanization: "mā 妈 (mẹ)", note: "Giống 'a' tiếng Việt trong 'ba', miệng mở rộng." },
      { character: "o", romanization: "wǒ 我 (tôi)", note: "Giống 'ô' tiếng Việt nhưng tròn môi hơn, hơi ngả về 'ua' khi đứng sau b/p/m/f (bo ≈ 'bua')." },
      { character: "e", romanization: "hē 喝 (uống)", note: "KHÔNG phải 'e' tiếng Việt! Giống 'ơ' pha 'ưa': miệng như nói 'ô' nhưng KHÔNG tròn môi. Mẹo: nói 'ơ' rồi kéo lưỡi lùi về sau." },
      { character: "i", romanization: "nǐ 你 (bạn)", note: "Giống 'i' tiếng Việt trong 'đi'. Lưu ý: sau z/c/s/zh/ch/sh/r thì 'i' đọc thành âm đệm 'ư' (zì ≈ 'chư', shì ≈ 'sư')." },
      { character: "u", romanization: "bù 不 (không)", note: "Giống 'u' tiếng Việt trong 'mua', tròn môi rõ." },
      { character: "ü", romanization: "nǚ 女 (nữ)", note: "Giống 'uy' nói dính liền: đặt môi như 'u' nhưng đọc 'i'. Tiếng Việt không có âm này — luyện bằng cách nói 'i' rồi từ từ chu môi tròn lại." },
      { character: "ai", romanization: "ài 爱 (yêu)", note: "Giống 'ai' tiếng Việt trong 'hai'." },
      { character: "ei", romanization: "béi 北 (bắc, trong běi)", note: "Giống 'ây' tiếng Việt trong 'đây'." },
      { character: "ao", romanization: "hǎo 好 (tốt)", note: "Giống 'ao' tiếng Việt trong 'sao'." },
      { character: "ou", romanization: "dōu 都 (đều)", note: "Giống 'âu' tiếng Việt trong 'đâu'." },
      { character: "an", romanization: "sān 三 (số 3)", note: "Giống 'an' tiếng Việt trong 'bàn'." },
      { character: "en", romanization: "hěn 很 (rất)", note: "Giống 'ân' tiếng Việt trong 'chân'." },
      { character: "ang", romanization: "máng 忙 (bận)", note: "Giống 'ang' tiếng Việt trong 'vàng'." },
      { character: "eng", romanization: "péng 朋 (bạn, trong péngyou)", note: "Giống 'âng' tiếng Việt trong 'tầng'." },
      { character: "ong", romanization: "zhōng 中 (trung)", note: "Giống 'ung' tiếng Việt trong 'cung' (môi tròn), KHÔNG phải 'ong' trong 'cong'." },
      { character: "er", romanization: "èr 二 (số 2)", note: "Âm 'ơ' + cong lưỡi lên (r-hóa). Nói 'ơ' rồi cuộn đầu lưỡi về phía ngạc. Tiếng Việt không có — luyện riêng." },
      { character: "ia", romanization: "jiā 家 (nhà)", note: "Giống 'ia' đọc lướt thành 'i-a' trong 'kia'." },
      { character: "ie", romanization: "xiè 谢 (cảm ơn)", note: "Đọc 'i-ê' dính liền, giống 'iê' trong 'biết'. Chữ 'e' ở đây đọc là 'ê'." },
      { character: "iao", romanization: "xiǎo 小 (nhỏ)", note: "Giống 'i-ao' dính liền, như 'eo' trong 'kiểu' mở rộng hơn." },
      { character: "iu (iou)", romanization: "liù 六 (số 6)", note: "Viết tắt của 'iou': đọc 'i-âu' dính liền, giống 'iu' trong 'dịu' nhưng có âm 'â' ở giữa." },
      { character: "ian", romanization: "tiān 天 (trời)", note: "Đọc 'i-en' (chữ a đọc gần như 'e'): giống 'iên' trong 'tiên'." },
      { character: "in", romanization: "xīn 新 (mới)", note: "Giống 'in' tiếng Việt trong 'tin'." },
      { character: "iang", romanization: "liǎng 两 (hai)", note: "Đọc 'i-ang' dính liền, giống 'ương' mở thành 'i-ang'." },
      { character: "ing", romanization: "míng 明 (sáng, trong míngtiān)", note: "Giống 'inh' tiếng Việt trong 'mình'." },
      { character: "iong", romanization: "xióng 熊 (gấu)", note: "Đọc 'i-ung' dính liền (i + ong)." },
      { character: "ua", romanization: "huā 花 (hoa)", note: "Giống 'oa' tiếng Việt trong 'hoa'." },
      { character: "uo", romanization: "duō 多 (nhiều)", note: "Đọc 'u-ô' dính liền, giống 'ua' trong 'thuở' nhưng kết thúc bằng 'ô'." },
      { character: "uai", romanization: "kuài 快 (nhanh)", note: "Giống 'oai' tiếng Việt trong 'ngoài'." },
      { character: "ui (uei)", romanization: "duì 对 (đúng)", note: "Viết tắt của 'uei': đọc 'u-ây' dính liền, giống 'uây' trong 'khuây'." },
      { character: "uan", romanization: "guān 关 (đóng)", note: "Giống 'oan' tiếng Việt trong 'hoàn'." },
      { character: "un (uen)", romanization: "chūn 春 (mùa xuân)", note: "Viết tắt của 'uen': đọc 'u-ân' dính liền, giống 'uân' trong 'tuân'." },
      { character: "uang", romanization: "shuāng 双 (đôi)", note: "Giống 'oang' tiếng Việt trong 'hoàng'." },
      { character: "ueng", romanization: "wēng 翁 (ông lão)", note: "Đọc 'u-âng' dính liền. Hiếm gặp, chỉ xuất hiện độc lập dưới dạng 'weng'." },
      { character: "üe", romanization: "yuè 月 (tháng, mặt trăng)", note: "Đọc 'uy-ê' dính liền: bắt đầu bằng ü rồi trượt sang 'ê'." },
      { character: "üan", romanization: "yuán 元 (đồng tiền)", note: "Đọc 'uy-en' dính liền (a đọc gần 'e'). Viết 'yuan' khi đứng đầu âm tiết." },
      { character: "ün", romanization: "yún 云 (mây)", note: "Đọc ü + n, giống 'uyn' trong 'tuyn'. Viết 'yun' khi đứng đầu âm tiết." },
    ],
  },
  {
    name: "Thanh điệu",
    description: "Tiếng Trung có 4 thanh điệu chính và 1 thanh nhẹ. Thanh điệu sai là nghĩa sai — đây là phần quan trọng nhất với người mới học. Tin vui: người Việt quen ngôn ngữ có thanh điệu nên học nhanh hơn người phương Tây!",
    items: [
      { character: "mā (thanh 1: ˉ)", romanization: "mā 妈 = mẹ", note: "Thanh ngang cao (55): giữ giọng CAO và ĐỀU từ đầu đến cuối, như hát nốt cao kéo dài. Mẹo cho người Việt: giống thanh 'ngang' tiếng Việt nhưng CAO hơn hẳn — hãy nói ở tông cao nhất thoải mái của bạn." },
      { character: "má (thanh 2: ´)", romanization: "má 麻 = cây gai/tê", note: "Thanh đi lên (35): giọng đi từ trung bình lên cao, như khi hỏi lại 'Hả?'. Mẹo: gần giống thanh SẮC tiếng Việt nhưng bắt đầu thấp hơn và kéo lên rõ hơn." },
      { character: "mǎ (thanh 3: ˇ)", romanization: "mǎ 马 = con ngựa", note: "Thanh xuống-lên (214): giọng hạ xuống thấp rồi hơi vòng lên. Mẹo: gần giống thanh HỎI tiếng Việt. Trong nói nhanh, thanh 3 thường chỉ đọc nửa đầu (xuống thấp rồi dừng), trừ khi đứng cuối câu." },
      { character: "mà (thanh 4: `)", romanization: "mà 骂 = mắng", note: "Thanh đi xuống dứt khoát (51): giọng rơi mạnh từ cao xuống thấp, như quát 'Này!'. Mẹo: KHÔNG giống thanh huyền (huyền hạ nhẹ) — thanh 4 rơi nhanh và mạnh như ra lệnh." },
      { character: "ma (thanh nhẹ: ·)", romanization: "ma 吗 = trợ từ nghi vấn", note: "Thanh nhẹ (khinh thanh): đọc NGẮN, NHẸ, không nhấn, cao độ phụ thuộc âm tiết đứng trước. Thường gặp ở trợ từ (吗 ma, 呢 ne, 的 de) và âm tiết lặp (māma). Mẹo: đọc lướt như âm cuối bị 'nuốt' đi một nửa." },
    ],
  },
  {
    name: "Quy tắc pinyin & biến điệu",
    description: "Các quy tắc viết pinyin và biến đổi thanh điệu (biến điệu) bắt buộc phải biết khi đọc và nói tiếng Trung tự nhiên.",
    items: [
      { character: "Biến điệu 3-3", romanization: "nǐ hǎo → ní hǎo", note: "Khi HAI thanh 3 đứng liền nhau, thanh 3 ĐẦU đổi thành thanh 2. Ví dụ: 你好 nǐ hǎo đọc là 'ní hǎo'; 很好 hěn hǎo đọc 'hén hǎo'. Chữ viết pinyin vẫn giữ dấu thanh 3, chỉ đổi khi ĐỌC." },
      { character: "Biến điệu của 不 bù", romanization: "bù → bú (trước thanh 4)", note: "不 vốn là thanh 4 (bù). Khi đứng trước một âm tiết thanh 4, đổi thành thanh 2: 不是 bú shì, 不去 bú qù, 不对 bú duì. Trước thanh 1/2/3 vẫn đọc bù: bù chī, bù lái, bù hǎo." },
      { character: "Biến điệu của 一 yī", romanization: "yī → yí / yì", note: "一 vốn là thanh 1 (yī). Trước thanh 4 đổi thành thanh 2: 一个 yí ge, 一样 yíyàng. Trước thanh 1/2/3 đổi thành thanh 4: 一天 yì tiān, 一年 yì nián, 一起 yìqǐ. Khi đếm số/đứng cuối giữ nguyên yī: 十一 shíyī." },
      { character: "ü sau j / q / x", romanization: "jü → ju, qü → qu, xü → xu", note: "Sau j, q, x, âm ü BỎ hai dấu chấm nhưng vẫn ĐỌC là ü: 去 qù đọc 'quy-(uy)', 句 jù, 需 xū. Vì j/q/x không bao giờ đi với u thường nên không sợ nhầm. Sau n, l thì giữ dấu chấm để phân biệt: nǚ (女) khác nǔ (努)." },
      { character: "y và w thay i / u / ü", romanization: "i→yi, u→wu, ü→yu", note: "Khi âm tiết bắt đầu bằng i/u/ü (không có phụ âm đầu), viết lại: i → yi (一), ia → ya (呀), u → wu (五), uo → wo (我), ü → yu (鱼), üe → yue (月). Chỉ là quy tắc VIẾT, cách đọc không đổi." },
      { character: "Dạng rút gọn iu / ui / un", romanization: "iou→iu, uei→ui, uen→un", note: "Khi có phụ âm đầu, ba vận mẫu iou/uei/uen viết rút gọn: l+iou → liù (六), d+uei → duì (对), ch+uen → chūn (春). Khi đọc vẫn có âm ở giữa: liù đọc 'li-ù' với âm 'â' thoáng qua." },
      { character: "Vị trí dấu thanh", romanization: "a > o = e > i = u = ü", note: "Dấu thanh đặt trên nguyên âm theo thứ tự ưu tiên: có 'a' đặt trên a (hǎo); không có a thì trên o hoặc e (duō, xiè); 'iu' và 'ui' đặt trên chữ CUỐI (liù, duì). Chữ i mất dấu chấm khi mang dấu thanh (nǐ)." },
      { character: "Dấu cách âm (')", romanization: "Xī'ān 西安", note: "Khi âm tiết bắt đầu bằng a/o/e đứng sau âm tiết khác, thêm dấu (') để tách: 西安 Xī'ān (Tây An — 2 âm tiết) khác 先 xiān (1 âm tiết); 天安门 Tiān'ānmén." },
      { character: "R-hóa (儿化 érhuà)", romanization: "wánr 玩儿, yìdiǎnr 一点儿", note: "Phương Bắc (Bắc Kinh) hay thêm 儿 (-r) vào cuối từ: 玩儿 wánr (chơi), 一点儿 yìdiǎnr (một chút), 哪儿 nǎr (đâu). Cách đọc: cuộn lưỡi ở âm cuối, nuốt phụ âm cuối nếu có (wánr đọc 'oár'). Miền Nam Trung Quốc thường nói không có -r: 一点 yìdiǎn, 哪里 nǎlǐ — cả hai đều đúng." },
      { character: "Thanh nhẹ của từ lặp & trợ từ", romanization: "māma, xièxie, de/le/ma/ne", note: "Âm tiết thứ hai của từ lặp thường đọc thanh nhẹ: 妈妈 māma, 谢谢 xièxie, 看看 kànkan. Các trợ từ 的 de, 了 le, 吗 ma, 呢 ne, 吧 ba, 得 de, 着 zhe LUÔN đọc thanh nhẹ." },
    ],
  },
];

// ============================ 2. VOCAB ============================
const ZH_VOCAB: CategorySeed[] = [
  {
    name: "Giáo dục & Trường học",
    icon: "🎓",
    words: [
      { word: "学校", pron: "xuéxiào", meaningVi: "trường học", exampleSentence: "我们的学校很大。", exampleMeaning: "Trường của chúng tôi rất to.", note: "HSK1" },
      { word: "学生", pron: "xuésheng", meaningVi: "học sinh, sinh viên", exampleSentence: "我是大学的学生。", exampleMeaning: "Tôi là sinh viên đại học.", note: "HSK1" },
      { word: "老师", pron: "lǎoshī", meaningVi: "giáo viên, thầy/cô giáo", exampleSentence: "王老师教我们汉语。", exampleMeaning: "Thầy Vương dạy chúng tôi tiếng Trung.", note: "HSK1" },
      { word: "同学", pron: "tóngxué", meaningVi: "bạn cùng lớp", exampleSentence: "他是我的同学。", exampleMeaning: "Cậu ấy là bạn cùng lớp của tôi.", note: "HSK1" },
      { word: "学习", pron: "xuéxí", meaningVi: "học, học tập", exampleSentence: "我在学习中文。", exampleMeaning: "Tôi đang học tiếng Trung.", note: "HSK1" },
      { word: "读", pron: "dú", meaningVi: "đọc", exampleSentence: "请读这个句子。", exampleMeaning: "Mời bạn đọc câu này.", note: "HSK1" },
      { word: "写", pron: "xiě", meaningVi: "viết", exampleSentence: "你会写汉字吗？", exampleMeaning: "Bạn biết viết chữ Hán không?", note: "HSK1" },
      { word: "书", pron: "shū", meaningVi: "sách", exampleSentence: "这本书很有意思。", exampleMeaning: "Cuốn sách này rất thú vị.", note: "HSK1" },
      { word: "汉语", pron: "Hànyǔ", meaningVi: "tiếng Trung (Hán ngữ)", exampleSentence: "汉语不太难。", exampleMeaning: "Tiếng Trung không khó lắm.", note: "HSK1" },
      { word: "字", pron: "zì", meaningVi: "chữ", exampleSentence: "这个字怎么读？", exampleMeaning: "Chữ này đọc thế nào?", note: "HSK1" },
      { word: "名字", pron: "míngzi", meaningVi: "tên", exampleSentence: "你的名字很好听。", exampleMeaning: "Tên của bạn rất hay.", note: "HSK1" },
      { word: "教室", pron: "jiàoshì", meaningVi: "phòng học, lớp học", exampleSentence: "教室里有很多学生。", exampleMeaning: "Trong lớp có rất nhiều học sinh.", note: "HSK2" },
      { word: "上课", pron: "shàngkè", meaningVi: "vào lớp, lên lớp", exampleSentence: "我们八点上课。", exampleMeaning: "Chúng tôi vào học lúc 8 giờ.", note: "HSK2" },
      { word: "下课", pron: "xiàkè", meaningVi: "tan học", exampleSentence: "下课以后我们去打球吧。", exampleMeaning: "Tan học rồi chúng ta đi chơi bóng nhé.", note: "HSK2" },
      { word: "考试", pron: "kǎoshì", meaningVi: "thi, kỳ thi", exampleSentence: "明天有汉语考试。", exampleMeaning: "Ngày mai có bài thi tiếng Trung.", note: "HSK2" },
      { word: "问题", pron: "wèntí", meaningVi: "câu hỏi, vấn đề", exampleSentence: "我有一个问题想问老师。", exampleMeaning: "Tôi có một câu hỏi muốn hỏi thầy.", note: "HSK2" },
      { word: "懂", pron: "dǒng", meaningVi: "hiểu", exampleSentence: "老师说的话你听懂了吗？", exampleMeaning: "Lời thầy nói bạn nghe hiểu chưa?", note: "HSK2" },
      { word: "铅笔", pron: "qiānbǐ", meaningVi: "bút chì", exampleSentence: "请用铅笔写。", exampleMeaning: "Hãy viết bằng bút chì.", note: "HSK2" },
      { word: "作业", pron: "zuòyè", meaningVi: "bài tập về nhà", exampleSentence: "今天的作业太多了。", exampleMeaning: "Bài tập hôm nay nhiều quá.", note: "HSK3" },
      { word: "回答", pron: "huídá", meaningVi: "trả lời", exampleSentence: "请回答我的问题。", exampleMeaning: "Hãy trả lời câu hỏi của tôi.", note: "HSK3" },
      { word: "词典", pron: "cídiǎn", meaningVi: "từ điển", exampleSentence: "不认识的字可以查词典。", exampleMeaning: "Chữ không biết có thể tra từ điển.", note: "HSK3" },
      { word: "黑板", pron: "hēibǎn", meaningVi: "bảng đen", exampleSentence: "老师在黑板上写字。", exampleMeaning: "Thầy giáo viết chữ lên bảng.", note: "HSK3" },
      { word: "班", pron: "bān", meaningVi: "lớp (tập thể)", exampleSentence: "我们班有二十个学生。", exampleMeaning: "Lớp chúng tôi có 20 học sinh.", note: "HSK3" },
      { word: "年级", pron: "niánjí", meaningVi: "khối, năm học", exampleSentence: "我妹妹上三年级。", exampleMeaning: "Em gái tôi học lớp 3.", note: "HSK3" },
      { word: "数学", pron: "shùxué", meaningVi: "toán học", exampleSentence: "他的数学非常好。", exampleMeaning: "Môn toán của cậu ấy rất giỏi.", note: "HSK3" },
      { word: "图书馆", pron: "túshūguǎn", meaningVi: "thư viện", exampleSentence: "我常常去图书馆看书。", exampleMeaning: "Tôi thường đến thư viện đọc sách.", note: "HSK3" },
      { word: "练习", pron: "liànxí", meaningVi: "luyện tập, bài luyện", exampleSentence: "每天要练习说汉语。", exampleMeaning: "Mỗi ngày phải luyện nói tiếng Trung.", note: "HSK3" },
      { word: "复习", pron: "fùxí", meaningVi: "ôn tập", exampleSentence: "考试以前要好好复习。", exampleMeaning: "Trước kỳ thi phải ôn tập cho tốt.", note: "HSK3" },
      { word: "简单", pron: "jiǎndān", meaningVi: "đơn giản, dễ", exampleSentence: "这个问题很简单。", exampleMeaning: "Câu hỏi này rất đơn giản.", note: "HSK3" },
      { word: "容易", pron: "róngyì", meaningVi: "dễ dàng", exampleSentence: "汉字不容易写。", exampleMeaning: "Chữ Hán viết không dễ.", note: "HSK3" },
    ],
  },
  {
    name: "Sở thích",
    icon: "🎨",
    words: [
      { word: "喜欢", pron: "xǐhuan", meaningVi: "thích", exampleSentence: "我喜欢听音乐。", exampleMeaning: "Tôi thích nghe nhạc.", note: "HSK1" },
      { word: "看电影", pron: "kàn diànyǐng", meaningVi: "xem phim", exampleSentence: "周末我们去看电影吧。", exampleMeaning: "Cuối tuần chúng ta đi xem phim nhé.", note: "HSK1" },
      { word: "电视", pron: "diànshì", meaningVi: "tivi", exampleSentence: "爸爸在看电视。", exampleMeaning: "Bố đang xem tivi.", note: "HSK1" },
      { word: "电脑", pron: "diànnǎo", meaningVi: "máy tính", exampleSentence: "我用电脑玩游戏。", exampleMeaning: "Tôi dùng máy tính chơi game.", note: "HSK1" },
      { word: "唱歌", pron: "chànggē", meaningVi: "hát", exampleSentence: "她唱歌唱得很好。", exampleMeaning: "Cô ấy hát rất hay.", note: "HSK2" },
      { word: "跳舞", pron: "tiàowǔ", meaningVi: "nhảy, khiêu vũ", exampleSentence: "你会跳舞吗？", exampleMeaning: "Bạn biết nhảy không?", note: "HSK2" },
      { word: "游泳", pron: "yóuyǒng", meaningVi: "bơi", exampleSentence: "夏天我每天去游泳。", exampleMeaning: "Mùa hè ngày nào tôi cũng đi bơi.", note: "HSK2" },
      { word: "打篮球", pron: "dǎ lánqiú", meaningVi: "chơi bóng rổ", exampleSentence: "他每个星期六打篮球。", exampleMeaning: "Thứ Bảy nào anh ấy cũng chơi bóng rổ.", note: "HSK2" },
      { word: "踢足球", pron: "tī zúqiú", meaningVi: "đá bóng", exampleSentence: "孩子们在踢足球。", exampleMeaning: "Bọn trẻ đang đá bóng.", note: "HSK2" },
      { word: "跑步", pron: "pǎobù", meaningVi: "chạy bộ", exampleSentence: "我早上六点去跑步。", exampleMeaning: "Tôi đi chạy bộ lúc 6 giờ sáng.", note: "HSK2" },
      { word: "运动", pron: "yùndòng", meaningVi: "vận động, thể thao", exampleSentence: "多运动对身体好。", exampleMeaning: "Vận động nhiều tốt cho sức khoẻ.", note: "HSK2" },
      { word: "旅游", pron: "lǚyóu", meaningVi: "du lịch", exampleSentence: "我最大的爱好是旅游。", exampleMeaning: "Sở thích lớn nhất của tôi là du lịch.", note: "HSK2" },
      { word: "有意思", pron: "yǒu yìsi", meaningVi: "thú vị, hay", exampleSentence: "这个游戏真有意思。", exampleMeaning: "Trò chơi này thật thú vị.", note: "HSK2" },
      { word: "爱好", pron: "àihào", meaningVi: "sở thích", exampleSentence: "你的爱好是什么？", exampleMeaning: "Sở thích của bạn là gì?", note: "HSK3" },
      { word: "听音乐", pron: "tīng yīnyuè", meaningVi: "nghe nhạc", exampleSentence: "我一边做饭一边听音乐。", exampleMeaning: "Tôi vừa nấu ăn vừa nghe nhạc.", note: "HSK3" },
      { word: "画画儿", pron: "huà huàr", meaningVi: "vẽ tranh", exampleSentence: "小时候我喜欢画画儿。", exampleMeaning: "Hồi nhỏ tôi thích vẽ tranh.", note: "HSK3" },
      { word: "照相", pron: "zhàoxiàng", meaningVi: "chụp ảnh", exampleSentence: "我们在公园照相吧。", exampleMeaning: "Chúng ta chụp ảnh ở công viên nhé.", note: "HSK3" },
      { word: "游戏", pron: "yóuxì", meaningVi: "trò chơi, game", exampleSentence: "他每天晚上玩游戏。", exampleMeaning: "Tối nào cậu ấy cũng chơi game.", note: "HSK3" },
      { word: "爬山", pron: "pá shān", meaningVi: "leo núi", exampleSentence: "周末我们去爬山，怎么样？", exampleMeaning: "Cuối tuần mình đi leo núi, thế nào?", note: "HSK3" },
      { word: "锻炼", pron: "duànliàn", meaningVi: "rèn luyện, tập thể dục", exampleSentence: "爷爷每天早上锻炼身体。", exampleMeaning: "Sáng nào ông cũng tập thể dục.", note: "HSK3" },
      { word: "骑自行车", pron: "qí zìxíngchē", meaningVi: "đạp xe", exampleSentence: "我骑自行车上班。", exampleMeaning: "Tôi đạp xe đi làm.", note: "HSK3" },
      { word: "上网", pron: "shàngwǎng", meaningVi: "lên mạng", exampleSentence: "她喜欢上网买东西。", exampleMeaning: "Cô ấy thích lên mạng mua đồ.", note: "HSK3" },
      { word: "音乐会", pron: "yīnyuèhuì", meaningVi: "buổi hoà nhạc", exampleSentence: "晚上有一场音乐会。", exampleMeaning: "Buổi tối có một buổi hoà nhạc.", note: "HSK3" },
      { word: "感兴趣", pron: "gǎn xìngqù", meaningVi: "cảm thấy hứng thú, quan tâm", exampleSentence: "我对中国文化很感兴趣。", exampleMeaning: "Tôi rất hứng thú với văn hoá Trung Quốc.", note: "HSK3" },
      { word: "钓鱼", pron: "diào yú", meaningVi: "câu cá", exampleSentence: "爸爸周末喜欢去钓鱼。", exampleMeaning: "Cuối tuần bố thích đi câu cá.", note: "HSK3" },
      { word: "唱京剧", pron: "chàng jīngjù", meaningVi: "hát kinh kịch", exampleSentence: "奶奶会唱京剧。", exampleMeaning: "Bà biết hát kinh kịch.", note: "HSK3" },
    ],
  },
  {
    name: "Nghề nghiệp",
    icon: "💼",
    words: [
      { word: "工作", pron: "gōngzuò", meaningVi: "công việc; làm việc", exampleSentence: "你在哪儿工作？", exampleMeaning: "Bạn làm việc ở đâu?", note: "HSK1" },
      { word: "医生", pron: "yīshēng", meaningVi: "bác sĩ", exampleSentence: "我妈妈是医生。", exampleMeaning: "Mẹ tôi là bác sĩ.", note: "HSK1" },
      { word: "做", pron: "zuò", meaningVi: "làm", exampleSentence: "你做什么工作？", exampleMeaning: "Bạn làm nghề gì?", note: "HSK1" },
      { word: "服务员", pron: "fúwùyuán", meaningVi: "nhân viên phục vụ", exampleSentence: "服务员，请给我菜单。", exampleMeaning: "Em ơi, cho tôi xin thực đơn.", note: "HSK2" },
      { word: "公司", pron: "gōngsī", meaningVi: "công ty", exampleSentence: "他在一家大公司工作。", exampleMeaning: "Anh ấy làm việc ở một công ty lớn.", note: "HSK2" },
      { word: "上班", pron: "shàngbān", meaningVi: "đi làm", exampleSentence: "我每天八点上班。", exampleMeaning: "Mỗi ngày tôi đi làm lúc 8 giờ.", note: "HSK2" },
      { word: "忙", pron: "máng", meaningVi: "bận", exampleSentence: "最近工作很忙。", exampleMeaning: "Dạo này công việc rất bận.", note: "HSK2" },
      { word: "累", pron: "lèi", meaningVi: "mệt", exampleSentence: "今天上班太累了。", exampleMeaning: "Hôm nay đi làm mệt quá.", note: "HSK2" },
      { word: "护士", pron: "hùshi", meaningVi: "y tá", exampleSentence: "这位护士对病人很好。", exampleMeaning: "Cô y tá này rất tốt với bệnh nhân.", note: "HSK3" },
      { word: "司机", pron: "sījī", meaningVi: "tài xế", exampleSentence: "司机师傅，请开慢一点儿。", exampleMeaning: "Bác tài ơi, xin chạy chậm một chút.", note: "HSK3" },
      { word: "经理", pron: "jīnglǐ", meaningVi: "giám đốc, quản lý", exampleSentence: "经理正在开会。", exampleMeaning: "Giám đốc đang họp.", note: "HSK3" },
      { word: "老板", pron: "lǎobǎn", meaningVi: "ông chủ, sếp", exampleSentence: "我们老板人很好。", exampleMeaning: "Sếp của chúng tôi rất tốt.", note: "HSK3" },
      { word: "秘书", pron: "mìshū", meaningVi: "thư ký", exampleSentence: "她是经理的秘书。", exampleMeaning: "Cô ấy là thư ký của giám đốc.", note: "HSK3" },
      { word: "同事", pron: "tóngshì", meaningVi: "đồng nghiệp", exampleSentence: "我和同事关系很好。", exampleMeaning: "Tôi và đồng nghiệp quan hệ rất tốt.", note: "HSK3" },
      { word: "办公室", pron: "bàngōngshì", meaningVi: "văn phòng", exampleSentence: "经理在办公室里。", exampleMeaning: "Giám đốc đang ở trong văn phòng.", note: "HSK3" },
      { word: "会议", pron: "huìyì", meaningVi: "cuộc họp", exampleSentence: "下午两点有一个会议。", exampleMeaning: "2 giờ chiều có một cuộc họp.", note: "HSK3" },
      { word: "开会", pron: "kāihuì", meaningVi: "họp", exampleSentence: "我们正在开会呢。", exampleMeaning: "Chúng tôi đang họp mà.", note: "HSK3" },
      { word: "下班", pron: "xiàbān", meaningVi: "tan làm", exampleSentence: "你几点下班？", exampleMeaning: "Mấy giờ bạn tan làm?", note: "HSK3" },
      { word: "工资", pron: "gōngzī", meaningVi: "lương", exampleSentence: "这个工作的工资不错。", exampleMeaning: "Lương của công việc này khá ổn.", note: "HSK3" },
      { word: "电子邮件", pron: "diànzǐ yóujiàn", meaningVi: "thư điện tử, email", exampleSentence: "请给我发一封电子邮件。", exampleMeaning: "Hãy gửi cho tôi một email.", note: "HSK3" },
      { word: "经历", pron: "jīnglì", meaningVi: "trải nghiệm, kinh qua", exampleSentence: "这是一次难忘的经历。", exampleMeaning: "Đây là một trải nghiệm khó quên.", note: "HSK3+" },
      { word: "记者", pron: "jìzhě", meaningVi: "phóng viên, nhà báo", exampleSentence: "记者在问他问题。", exampleMeaning: "Phóng viên đang hỏi anh ấy.", note: "HSK3" },
      { word: "校长", pron: "xiàozhǎng", meaningVi: "hiệu trưởng", exampleSentence: "校长在办公室等你。", exampleMeaning: "Hiệu trưởng đang đợi bạn ở văn phòng.", note: "HSK3" },
      { word: "厨师", pron: "chúshī", meaningVi: "đầu bếp", exampleSentence: "这家饭馆的厨师很有名。", exampleMeaning: "Đầu bếp của quán ăn này rất nổi tiếng.", note: "HSK3+" },
      { word: "警察", pron: "jǐngchá", meaningVi: "cảnh sát", exampleSentence: "有问题可以找警察帮忙。", exampleMeaning: "Có vấn đề có thể tìm cảnh sát giúp đỡ.", note: "HSK3+" },
      { word: "出差", pron: "chūchāi", meaningVi: "đi công tác", exampleSentence: "下星期我要去北京出差。", exampleMeaning: "Tuần sau tôi phải đi Bắc Kinh công tác.", note: "HSK3+" },
    ],
  },
  {
    name: "Thời gian & Lịch",
    icon: "⏰",
    words: [
      { word: "现在", pron: "xiànzài", meaningVi: "bây giờ", exampleSentence: "现在几点了？", exampleMeaning: "Bây giờ là mấy giờ rồi?", note: "HSK1" },
      { word: "今天", pron: "jīntiān", meaningVi: "hôm nay", exampleSentence: "今天是星期五。", exampleMeaning: "Hôm nay là thứ Sáu.", note: "HSK1" },
      { word: "明天", pron: "míngtiān", meaningVi: "ngày mai", exampleSentence: "明天你有时间吗？", exampleMeaning: "Ngày mai bạn có thời gian không?", note: "HSK1" },
      { word: "昨天", pron: "zuótiān", meaningVi: "hôm qua", exampleSentence: "昨天我没去学校。", exampleMeaning: "Hôm qua tôi không đến trường.", note: "HSK1" },
      { word: "年", pron: "nián", meaningVi: "năm", exampleSentence: "一年有十二个月。", exampleMeaning: "Một năm có 12 tháng.", note: "HSK1" },
      { word: "月", pron: "yuè", meaningVi: "tháng", exampleSentence: "我的生日是五月十号。", exampleMeaning: "Sinh nhật tôi là ngày 10 tháng 5.", note: "HSK1" },
      { word: "号", pron: "hào", meaningVi: "ngày (trong tháng)", exampleSentence: "今天几月几号？", exampleMeaning: "Hôm nay là ngày mấy tháng mấy?", note: "HSK1" },
      { word: "星期", pron: "xīngqī", meaningVi: "tuần, thứ", exampleSentence: "一个星期有七天。", exampleMeaning: "Một tuần có 7 ngày.", note: "HSK1" },
      { word: "点", pron: "diǎn", meaningVi: "giờ", exampleSentence: "我们七点吃晚饭。", exampleMeaning: "Chúng tôi ăn tối lúc 7 giờ.", note: "HSK1" },
      { word: "分钟", pron: "fēnzhōng", meaningVi: "phút", exampleSentence: "请等我五分钟。", exampleMeaning: "Xin đợi tôi 5 phút.", note: "HSK1" },
      { word: "上午", pron: "shàngwǔ", meaningVi: "buổi sáng", exampleSentence: "明天上午我要上课。", exampleMeaning: "Sáng mai tôi phải đi học.", note: "HSK1" },
      { word: "中午", pron: "zhōngwǔ", meaningVi: "buổi trưa", exampleSentence: "中午我们一起吃饭吧。", exampleMeaning: "Trưa nay chúng ta cùng ăn cơm nhé.", note: "HSK1" },
      { word: "下午", pron: "xiàwǔ", meaningVi: "buổi chiều", exampleSentence: "下午三点见！", exampleMeaning: "3 giờ chiều gặp nhé!", note: "HSK1" },
      { word: "小时", pron: "xiǎoshí", meaningVi: "tiếng, giờ đồng hồ", exampleSentence: "我每天学习两个小时汉语。", exampleMeaning: "Mỗi ngày tôi học tiếng Trung 2 tiếng.", note: "HSK2" },
      { word: "时间", pron: "shíjiān", meaningVi: "thời gian", exampleSentence: "时间过得真快！", exampleMeaning: "Thời gian trôi nhanh thật!", note: "HSK2" },
      { word: "早上", pron: "zǎoshang", meaningVi: "buổi sáng sớm", exampleSentence: "早上好！", exampleMeaning: "Chào buổi sáng!", note: "HSK2" },
      { word: "晚上", pron: "wǎnshang", meaningVi: "buổi tối", exampleSentence: "晚上你想做什么？", exampleMeaning: "Buổi tối bạn muốn làm gì?", note: "HSK2" },
      { word: "生日", pron: "shēngrì", meaningVi: "sinh nhật", exampleSentence: "祝你生日快乐！", exampleMeaning: "Chúc bạn sinh nhật vui vẻ!", note: "HSK2" },
      { word: "去年", pron: "qùnián", meaningVi: "năm ngoái", exampleSentence: "去年我去了中国。", exampleMeaning: "Năm ngoái tôi đã đi Trung Quốc.", note: "HSK2" },
      { word: "半", pron: "bàn", meaningVi: "rưỡi, một nửa", exampleSentence: "现在是两点半。", exampleMeaning: "Bây giờ là 2 giờ rưỡi.", note: "HSK3" },
      { word: "刻", pron: "kè", meaningVi: "khắc (15 phút)", exampleSentence: "现在差一刻八点。", exampleMeaning: "Bây giờ là 8 giờ kém 15.", note: "HSK3" },
      { word: "周末", pron: "zhōumò", meaningVi: "cuối tuần", exampleSentence: "周末你一般做什么？", exampleMeaning: "Cuối tuần bạn thường làm gì?", note: "HSK3" },
      { word: "以前", pron: "yǐqián", meaningVi: "trước đây, trước khi", exampleSentence: "以前我不会说汉语。", exampleMeaning: "Trước đây tôi không biết nói tiếng Trung.", note: "HSK3" },
      { word: "以后", pron: "yǐhòu", meaningVi: "sau này, sau khi", exampleSentence: "下班以后我们去吃饭。", exampleMeaning: "Sau khi tan làm chúng ta đi ăn.", note: "HSK3" },
      { word: "最近", pron: "zuìjìn", meaningVi: "gần đây, dạo này", exampleSentence: "最近你怎么样？", exampleMeaning: "Dạo này bạn thế nào?", note: "HSK3" },
      { word: "马上", pron: "mǎshàng", meaningVi: "ngay lập tức", exampleSentence: "我马上就到。", exampleMeaning: "Tôi đến ngay đây.", note: "HSK3" },
      { word: "一会儿", pron: "yíhuìr", meaningVi: "một lát, chốc lát", exampleSentence: "请等一会儿。", exampleMeaning: "Xin đợi một lát.", note: "HSK3" },
      { word: "季节", pron: "jìjié", meaningVi: "mùa", exampleSentence: "你最喜欢哪个季节？", exampleMeaning: "Bạn thích mùa nào nhất?", note: "HSK3" },
      { word: "小时候", pron: "xiǎoshíhou", meaningVi: "hồi nhỏ", exampleSentence: "小时候我住在农村。", exampleMeaning: "Hồi nhỏ tôi sống ở nông thôn.", note: "HSK3" },
      { word: "后来", pron: "hòulái", meaningVi: "sau đó, về sau", exampleSentence: "后来他去了上海工作。", exampleMeaning: "Về sau anh ấy đến Thượng Hải làm việc.", note: "HSK3" },
    ],
  },
  {
    name: "Món ăn & Nhà hàng",
    icon: "🍜",
    words: [
      { word: "吃饭", pron: "chīfàn", meaningVi: "ăn cơm", exampleSentence: "你吃饭了吗？", exampleMeaning: "Bạn ăn cơm chưa?", note: "HSK1" },
      { word: "米饭", pron: "mǐfàn", meaningVi: "cơm", exampleSentence: "我要一碗米饭。", exampleMeaning: "Cho tôi một bát cơm.", note: "HSK1" },
      { word: "菜", pron: "cài", meaningVi: "rau; món ăn", exampleSentence: "这个菜很好吃。", exampleMeaning: "Món này rất ngon.", note: "HSK1" },
      { word: "水果", pron: "shuǐguǒ", meaningVi: "hoa quả, trái cây", exampleSentence: "多吃水果对身体好。", exampleMeaning: "Ăn nhiều hoa quả tốt cho sức khoẻ.", note: "HSK1" },
      { word: "苹果", pron: "píngguǒ", meaningVi: "quả táo", exampleSentence: "我买了三个苹果。", exampleMeaning: "Tôi mua 3 quả táo.", note: "HSK1" },
      { word: "茶", pron: "chá", meaningVi: "trà", exampleSentence: "请喝茶。", exampleMeaning: "Mời uống trà.", note: "HSK1" },
      { word: "水", pron: "shuǐ", meaningVi: "nước", exampleSentence: "我想喝水。", exampleMeaning: "Tôi muốn uống nước.", note: "HSK1" },
      { word: "鱼", pron: "yú", meaningVi: "cá", exampleSentence: "今天晚上我们吃鱼。", exampleMeaning: "Tối nay chúng ta ăn cá.", note: "HSK2" },
      { word: "肉", pron: "ròu", meaningVi: "thịt", exampleSentence: "我不吃肉。", exampleMeaning: "Tôi không ăn thịt.", note: "HSK2" },
      { word: "牛肉", pron: "niúròu", meaningVi: "thịt bò", exampleSentence: "这里的牛肉面很有名。", exampleMeaning: "Mì bò ở đây rất nổi tiếng.", note: "HSK2" },
      { word: "羊肉", pron: "yángròu", meaningVi: "thịt cừu, thịt dê", exampleSentence: "北方人喜欢吃羊肉。", exampleMeaning: "Người miền Bắc (Trung Quốc) thích ăn thịt cừu.", note: "HSK2" },
      { word: "鸡蛋", pron: "jīdàn", meaningVi: "trứng gà", exampleSentence: "早饭我吃了两个鸡蛋。", exampleMeaning: "Bữa sáng tôi ăn 2 quả trứng.", note: "HSK2" },
      { word: "面条", pron: "miàntiáo", meaningVi: "mì sợi", exampleSentence: "中午我想吃面条。", exampleMeaning: "Buổi trưa tôi muốn ăn mì.", note: "HSK2" },
      { word: "咖啡", pron: "kāfēi", meaningVi: "cà phê", exampleSentence: "越南咖啡很好喝。", exampleMeaning: "Cà phê Việt Nam rất ngon.", note: "HSK2" },
      { word: "牛奶", pron: "niúnǎi", meaningVi: "sữa bò", exampleSentence: "孩子每天喝一杯牛奶。", exampleMeaning: "Trẻ con mỗi ngày uống một cốc sữa.", note: "HSK2" },
      { word: "西瓜", pron: "xīguā", meaningVi: "dưa hấu", exampleSentence: "夏天吃西瓜最舒服。", exampleMeaning: "Mùa hè ăn dưa hấu là thích nhất.", note: "HSK2" },
      { word: "好吃", pron: "hǎochī", meaningVi: "ngon (đồ ăn)", exampleSentence: "妈妈做的菜最好吃。", exampleMeaning: "Món mẹ nấu là ngon nhất.", note: "HSK2" },
      { word: "面包", pron: "miànbāo", meaningVi: "bánh mì", exampleSentence: "早上我吃面包喝牛奶。", exampleMeaning: "Buổi sáng tôi ăn bánh mì uống sữa.", note: "HSK3" },
      { word: "饺子", pron: "jiǎozi", meaningVi: "sủi cảo", exampleSentence: "过年的时候中国人吃饺子。", exampleMeaning: "Dịp Tết người Trung Quốc ăn sủi cảo.", note: "HSK3" },
      { word: "蛋糕", pron: "dàngāo", meaningVi: "bánh kem, bánh ngọt", exampleSentence: "生日要吃生日蛋糕。", exampleMeaning: "Sinh nhật phải ăn bánh sinh nhật.", note: "HSK3" },
      { word: "啤酒", pron: "píjiǔ", meaningVi: "bia", exampleSentence: "来两瓶啤酒。", exampleMeaning: "Cho hai chai bia.", note: "HSK3" },
      { word: "果汁", pron: "guǒzhī", meaningVi: "nước ép hoa quả", exampleSentence: "我不喝咖啡，来一杯果汁吧。", exampleMeaning: "Tôi không uống cà phê, cho một cốc nước ép nhé.", note: "HSK3" },
      { word: "甜", pron: "tián", meaningVi: "ngọt", exampleSentence: "这个蛋糕太甜了。", exampleMeaning: "Cái bánh này ngọt quá.", note: "HSK3" },
      { word: "饿", pron: "è", meaningVi: "đói", exampleSentence: "我饿了，我们去吃饭吧。", exampleMeaning: "Tôi đói rồi, chúng ta đi ăn thôi.", note: "HSK3" },
      { word: "渴", pron: "kě", meaningVi: "khát", exampleSentence: "我渴了，想喝点儿水。", exampleMeaning: "Tôi khát rồi, muốn uống chút nước.", note: "HSK3" },
      { word: "菜单", pron: "càidān", meaningVi: "thực đơn", exampleSentence: "请给我看看菜单。", exampleMeaning: "Cho tôi xem thực đơn.", note: "HSK3" },
      { word: "点菜", pron: "diǎn cài", meaningVi: "gọi món", exampleSentence: "你们可以点菜了。", exampleMeaning: "Các bạn có thể gọi món rồi.", note: "HSK3" },
      { word: "筷子", pron: "kuàizi", meaningVi: "đũa", exampleSentence: "你会用筷子吗？", exampleMeaning: "Bạn biết dùng đũa không?", note: "HSK3" },
      { word: "碗", pron: "wǎn", meaningVi: "bát", exampleSentence: "再来一碗米饭。", exampleMeaning: "Cho thêm một bát cơm nữa.", note: "HSK3" },
      { word: "饭馆", pron: "fànguǎn", meaningVi: "quán ăn, nhà hàng", exampleSentence: "学校旁边有一家饭馆。", exampleMeaning: "Cạnh trường có một quán ăn.", note: "HSK3" },
    ],
  },
  {
    name: "Gia đình",
    icon: "👨‍👩‍👧",
    words: [
      { word: "家", pron: "jiā", meaningVi: "nhà, gia đình", exampleSentence: "我家有四口人。", exampleMeaning: "Nhà tôi có 4 người.", note: "HSK1" },
      { word: "爸爸", pron: "bàba", meaningVi: "bố", exampleSentence: "我爸爸是老师。", exampleMeaning: "Bố tôi là giáo viên.", note: "HSK1" },
      { word: "妈妈", pron: "māma", meaningVi: "mẹ", exampleSentence: "妈妈在做饭。", exampleMeaning: "Mẹ đang nấu cơm.", note: "HSK1" },
      { word: "儿子", pron: "érzi", meaningVi: "con trai", exampleSentence: "他儿子今年五岁。", exampleMeaning: "Con trai anh ấy năm nay 5 tuổi.", note: "HSK1" },
      { word: "女儿", pron: "nǚ'ér", meaningVi: "con gái", exampleSentence: "我女儿喜欢画画儿。", exampleMeaning: "Con gái tôi thích vẽ.", note: "HSK1" },
      { word: "岁", pron: "suì", meaningVi: "tuổi", exampleSentence: "你今年多大？我二十五岁。", exampleMeaning: "Bạn năm nay bao nhiêu tuổi? Tôi 25 tuổi.", note: "HSK1" },
      { word: "狗", pron: "gǒu", meaningVi: "con chó", exampleSentence: "我家有一只小狗。", exampleMeaning: "Nhà tôi có một con chó nhỏ.", note: "HSK1" },
      { word: "猫", pron: "māo", meaningVi: "con mèo", exampleSentence: "她很喜欢猫。", exampleMeaning: "Cô ấy rất thích mèo.", note: "HSK1" },
      { word: "哥哥", pron: "gēge", meaningVi: "anh trai", exampleSentence: "我哥哥在北京工作。", exampleMeaning: "Anh trai tôi làm việc ở Bắc Kinh.", note: "HSK2" },
      { word: "姐姐", pron: "jiějie", meaningVi: "chị gái", exampleSentence: "姐姐比我大三岁。", exampleMeaning: "Chị gái lớn hơn tôi 3 tuổi.", note: "HSK2" },
      { word: "弟弟", pron: "dìdi", meaningVi: "em trai", exampleSentence: "弟弟还在上学。", exampleMeaning: "Em trai vẫn đang đi học.", note: "HSK2" },
      { word: "妹妹", pron: "mèimei", meaningVi: "em gái", exampleSentence: "我妹妹唱歌很好听。", exampleMeaning: "Em gái tôi hát rất hay.", note: "HSK2" },
      { word: "丈夫", pron: "zhàngfu", meaningVi: "chồng", exampleSentence: "她丈夫是医生。", exampleMeaning: "Chồng cô ấy là bác sĩ.", note: "HSK2" },
      { word: "妻子", pron: "qīzi", meaningVi: "vợ", exampleSentence: "我妻子在银行工作。", exampleMeaning: "Vợ tôi làm ở ngân hàng.", note: "HSK2" },
      { word: "孩子", pron: "háizi", meaningVi: "con, trẻ con", exampleSentence: "他们有两个孩子。", exampleMeaning: "Họ có hai đứa con.", note: "HSK2" },
      { word: "爷爷", pron: "yéye", meaningVi: "ông nội", exampleSentence: "爷爷今年八十岁了。", exampleMeaning: "Ông nội năm nay 80 tuổi rồi.", note: "HSK3" },
      { word: "奶奶", pron: "nǎinai", meaningVi: "bà nội", exampleSentence: "奶奶每天早上去公园。", exampleMeaning: "Sáng nào bà cũng ra công viên.", note: "HSK3" },
      { word: "叔叔", pron: "shūshu", meaningVi: "chú", exampleSentence: "叔叔送了我一个礼物。", exampleMeaning: "Chú tặng tôi một món quà.", note: "HSK3" },
      { word: "阿姨", pron: "āyí", meaningVi: "cô, dì", exampleSentence: "阿姨做的饺子真好吃。", exampleMeaning: "Sủi cảo dì làm ngon thật.", note: "HSK3" },
      { word: "结婚", pron: "jiéhūn", meaningVi: "kết hôn", exampleSentence: "他们去年结婚了。", exampleMeaning: "Họ kết hôn năm ngoái.", note: "HSK3" },
      { word: "大家", pron: "dàjiā", meaningVi: "mọi người", exampleSentence: "大家好！", exampleMeaning: "Chào mọi người!", note: "HSK2" },
      { word: "照顾", pron: "zhàogù", meaningVi: "chăm sóc", exampleSentence: "妈妈在家照顾奶奶。", exampleMeaning: "Mẹ ở nhà chăm sóc bà.", note: "HSK3" },
      { word: "关心", pron: "guānxīn", meaningVi: "quan tâm", exampleSentence: "父母很关心孩子的学习。", exampleMeaning: "Bố mẹ rất quan tâm việc học của con.", note: "HSK3" },
      { word: "爱", pron: "ài", meaningVi: "yêu", exampleSentence: "我爱我的家。", exampleMeaning: "Tôi yêu gia đình tôi.", note: "HSK1" },
      { word: "邻居", pron: "línjū", meaningVi: "hàng xóm", exampleSentence: "我们的邻居很热情。", exampleMeaning: "Hàng xóm của chúng tôi rất nhiệt tình.", note: "HSK3" },
      { word: "客人", pron: "kèrén", meaningVi: "khách", exampleSentence: "今天家里来了客人。", exampleMeaning: "Hôm nay nhà có khách.", note: "HSK3" },
    ],
  },
  {
    name: "Mua sắm",
    icon: "🛍️",
    words: [
      { word: "买", pron: "mǎi", meaningVi: "mua", exampleSentence: "我想买一件衣服。", exampleMeaning: "Tôi muốn mua một chiếc áo.", note: "HSK1" },
      { word: "钱", pron: "qián", meaningVi: "tiền", exampleSentence: "这个多少钱？", exampleMeaning: "Cái này bao nhiêu tiền?", note: "HSK1" },
      { word: "块", pron: "kuài", meaningVi: "đồng (tệ, khẩu ngữ)", exampleSentence: "这本书二十块。", exampleMeaning: "Cuốn sách này 20 tệ.", note: "HSK1" },
      { word: "商店", pron: "shāngdiàn", meaningVi: "cửa hàng", exampleSentence: "商店九点开门。", exampleMeaning: "Cửa hàng 9 giờ mở cửa.", note: "HSK1" },
      { word: "衣服", pron: "yīfu", meaningVi: "quần áo", exampleSentence: "这件衣服真漂亮。", exampleMeaning: "Chiếc áo này đẹp thật.", note: "HSK1" },
      { word: "东西", pron: "dōngxi", meaningVi: "đồ, đồ vật", exampleSentence: "我去超市买点儿东西。", exampleMeaning: "Tôi đi siêu thị mua ít đồ.", note: "HSK1" },
      { word: "卖", pron: "mài", meaningVi: "bán", exampleSentence: "这家店卖水果。", exampleMeaning: "Cửa hàng này bán hoa quả.", note: "HSK2" },
      { word: "贵", pron: "guì", meaningVi: "đắt", exampleSentence: "太贵了，便宜一点儿吧！", exampleMeaning: "Đắt quá, bớt chút đi!", note: "HSK2" },
      { word: "便宜", pron: "piányi", meaningVi: "rẻ", exampleSentence: "这里的东西又好又便宜。", exampleMeaning: "Đồ ở đây vừa tốt vừa rẻ.", note: "HSK2" },
      { word: "元", pron: "yuán", meaningVi: "đồng (tệ, viết chuẩn)", exampleSentence: "一共九十九元。", exampleMeaning: "Tổng cộng 99 tệ.", note: "HSK2" },
      { word: "穿", pron: "chuān", meaningVi: "mặc, đi (giày)", exampleSentence: "今天很冷，多穿点儿衣服。", exampleMeaning: "Hôm nay lạnh lắm, mặc thêm áo vào.", note: "HSK2" },
      { word: "新", pron: "xīn", meaningVi: "mới", exampleSentence: "我买了一个新手机。", exampleMeaning: "Tôi mua một chiếc điện thoại mới.", note: "HSK2" },
      { word: "手机", pron: "shǒujī", meaningVi: "điện thoại di động", exampleSentence: "我的手机没电了。", exampleMeaning: "Điện thoại của tôi hết pin rồi.", note: "HSK2" },
      { word: "颜色", pron: "yánsè", meaningVi: "màu sắc", exampleSentence: "你喜欢什么颜色？", exampleMeaning: "Bạn thích màu gì?", note: "HSK2" },
      { word: "红色", pron: "hóngsè", meaningVi: "màu đỏ", exampleSentence: "中国人喜欢红色。", exampleMeaning: "Người Trung Quốc thích màu đỏ.", note: "HSK2" },
      { word: "白色", pron: "báisè", meaningVi: "màu trắng", exampleSentence: "我想要白色的。", exampleMeaning: "Tôi muốn cái màu trắng.", note: "HSK2" },
      { word: "黑色", pron: "hēisè", meaningVi: "màu đen", exampleSentence: "黑色的裤子好看。", exampleMeaning: "Quần màu đen đẹp.", note: "HSK2" },
      { word: "裤子", pron: "kùzi", meaningVi: "quần", exampleSentence: "这条裤子有点儿长。", exampleMeaning: "Chiếc quần này hơi dài.", note: "HSK3" },
      { word: "裙子", pron: "qúnzi", meaningVi: "váy", exampleSentence: "她穿着一条红裙子。", exampleMeaning: "Cô ấy mặc một chiếc váy đỏ.", note: "HSK3" },
      { word: "鞋", pron: "xié", meaningVi: "giày", exampleSentence: "这双鞋多少钱？", exampleMeaning: "Đôi giày này bao nhiêu tiền?", note: "HSK3" },
      { word: "帽子", pron: "màozi", meaningVi: "mũ", exampleSentence: "他戴着一顶帽子。", exampleMeaning: "Anh ấy đội một chiếc mũ.", note: "HSK3" },
      { word: "衬衫", pron: "chènshān", meaningVi: "áo sơ mi", exampleSentence: "爸爸买了一件白衬衫。", exampleMeaning: "Bố mua một chiếc sơ mi trắng.", note: "HSK3" },
      { word: "试", pron: "shì", meaningVi: "thử", exampleSentence: "可以试试这件衣服吗？", exampleMeaning: "Tôi thử chiếc áo này được không?", note: "HSK3" },
      { word: "超市", pron: "chāoshì", meaningVi: "siêu thị", exampleSentence: "超市里人很多。", exampleMeaning: "Trong siêu thị rất đông người.", note: "HSK3" },
      { word: "礼物", pron: "lǐwù", meaningVi: "quà", exampleSentence: "这是给你的礼物。", exampleMeaning: "Đây là quà cho bạn.", note: "HSK3" },
      { word: "一共", pron: "yígòng", meaningVi: "tổng cộng", exampleSentence: "一共三百五十块。", exampleMeaning: "Tổng cộng 350 tệ.", note: "HSK3" },
      { word: "刷卡", pron: "shuā kǎ", meaningVi: "quẹt thẻ", exampleSentence: "可以刷卡吗？", exampleMeaning: "Thanh toán bằng thẻ được không?", note: "HSK3+" },
      { word: "漂亮", pron: "piàoliang", meaningVi: "đẹp", exampleSentence: "这条裙子真漂亮！", exampleMeaning: "Chiếc váy này đẹp thật!", note: "HSK1" },
    ],
  },
  {
    name: "Giao thông & Đi lại",
    icon: "🚇",
    words: [
      { word: "出租车", pron: "chūzūchē", meaningVi: "taxi", exampleSentence: "我们坐出租车去机场吧。", exampleMeaning: "Chúng ta đi taxi ra sân bay nhé.", note: "HSK1" },
      { word: "飞机", pron: "fēijī", meaningVi: "máy bay", exampleSentence: "飞机十点起飞。", exampleMeaning: "Máy bay cất cánh lúc 10 giờ.", note: "HSK1" },
      { word: "坐", pron: "zuò", meaningVi: "ngồi; đi (phương tiện)", exampleSentence: "我每天坐地铁上班。", exampleMeaning: "Mỗi ngày tôi đi tàu điện ngầm đi làm.", note: "HSK1" },
      { word: "开车", pron: "kāichē", meaningVi: "lái xe", exampleSentence: "他开车开得很快。", exampleMeaning: "Anh ấy lái xe rất nhanh.", note: "HSK2" },
      { word: "公共汽车", pron: "gōnggòng qìchē", meaningVi: "xe buýt", exampleSentence: "坐公共汽车去要一个小时。", exampleMeaning: "Đi xe buýt mất một tiếng.", note: "HSK2" },
      { word: "火车站", pron: "huǒchēzhàn", meaningVi: "ga tàu hoả", exampleSentence: "火车站离这儿远吗？", exampleMeaning: "Ga tàu cách đây có xa không?", note: "HSK2" },
      { word: "机场", pron: "jīchǎng", meaningVi: "sân bay", exampleSentence: "去机场要多长时间？", exampleMeaning: "Ra sân bay mất bao lâu?", note: "HSK2" },
      { word: "票", pron: "piào", meaningVi: "vé", exampleSentence: "我买了两张火车票。", exampleMeaning: "Tôi mua 2 vé tàu.", note: "HSK2" },
      { word: "路", pron: "lù", meaningVi: "đường", exampleSentence: "这条路很长。", exampleMeaning: "Con đường này rất dài.", note: "HSK2" },
      { word: "走", pron: "zǒu", meaningVi: "đi, đi bộ", exampleSentence: "我们走路去吧，不远。", exampleMeaning: "Chúng ta đi bộ đi, không xa đâu.", note: "HSK2" },
      { word: "近", pron: "jìn", meaningVi: "gần", exampleSentence: "我家离公司很近。", exampleMeaning: "Nhà tôi rất gần công ty.", note: "HSK2" },
      { word: "远", pron: "yuǎn", meaningVi: "xa", exampleSentence: "学校离火车站不远。", exampleMeaning: "Trường không xa ga tàu.", note: "HSK2" },
      { word: "快", pron: "kuài", meaningVi: "nhanh", exampleSentence: "地铁比公共汽车快。", exampleMeaning: "Tàu điện ngầm nhanh hơn xe buýt.", note: "HSK2" },
      { word: "慢", pron: "màn", meaningVi: "chậm", exampleSentence: "请说慢一点儿。", exampleMeaning: "Xin nói chậm một chút.", note: "HSK2" },
      { word: "地铁", pron: "dìtiě", meaningVi: "tàu điện ngầm", exampleSentence: "坐地铁又快又方便。", exampleMeaning: "Đi tàu điện ngầm vừa nhanh vừa tiện.", note: "HSK3" },
      { word: "火车", pron: "huǒchē", meaningVi: "tàu hoả", exampleSentence: "我第一次坐中国的高铁。", exampleMeaning: "Lần đầu tôi đi tàu cao tốc của Trung Quốc.", note: "HSK2" },
      { word: "自行车", pron: "zìxíngchē", meaningVi: "xe đạp", exampleSentence: "他骑自行车去学校。", exampleMeaning: "Cậu ấy đạp xe đến trường.", note: "HSK3" },
      { word: "船", pron: "chuán", meaningVi: "thuyền, tàu thuỷ", exampleSentence: "我们坐船过河。", exampleMeaning: "Chúng tôi đi thuyền qua sông.", note: "HSK3" },
      { word: "站", pron: "zhàn", meaningVi: "bến, trạm, ga", exampleSentence: "下一站是北京站。", exampleMeaning: "Bến tiếp theo là ga Bắc Kinh.", note: "HSK3" },
      { word: "地图", pron: "dìtú", meaningVi: "bản đồ", exampleSentence: "我用手机看地图。", exampleMeaning: "Tôi xem bản đồ trên điện thoại.", note: "HSK3" },
      { word: "左边", pron: "zuǒbian", meaningVi: "bên trái", exampleSentence: "银行在超市的左边。", exampleMeaning: "Ngân hàng ở bên trái siêu thị.", note: "HSK2" },
      { word: "右边", pron: "yòubian", meaningVi: "bên phải", exampleSentence: "往右边走就到了。", exampleMeaning: "Rẽ sang bên phải là đến.", note: "HSK2" },
      { word: "前面", pron: "qiánmiàn", meaningVi: "phía trước", exampleSentence: "前面有一个红绿灯。", exampleMeaning: "Phía trước có một cột đèn giao thông.", note: "HSK1" },
      { word: "后面", pron: "hòumiàn", meaningVi: "phía sau", exampleSentence: "学校后面有一个公园。", exampleMeaning: "Sau trường có một công viên.", note: "HSK1" },
      { word: "旁边", pron: "pángbiān", meaningVi: "bên cạnh", exampleSentence: "地铁站就在饭店旁边。", exampleMeaning: "Ga tàu điện ngay cạnh khách sạn.", note: "HSK2" },
      { word: "中间", pron: "zhōngjiān", meaningVi: "ở giữa", exampleSentence: "我坐在他们两个人中间。", exampleMeaning: "Tôi ngồi giữa hai người họ.", note: "HSK3" },
      { word: "迟到", pron: "chídào", meaningVi: "đến muộn", exampleSentence: "对不起，我迟到了。", exampleMeaning: "Xin lỗi, tôi đến muộn.", note: "HSK3" },
      { word: "到", pron: "dào", meaningVi: "đến, tới", exampleSentence: "火车什么时候到？", exampleMeaning: "Tàu khi nào đến?", note: "HSK2" },
    ],
  },
  {
    name: "Thời tiết & Mùa",
    icon: "🌤️",
    words: [
      { word: "天气", pron: "tiānqì", meaningVi: "thời tiết", exampleSentence: "今天天气怎么样？", exampleMeaning: "Hôm nay thời tiết thế nào?", note: "HSK1" },
      { word: "下雨", pron: "xiàyǔ", meaningVi: "mưa", exampleSentence: "外面正在下雨。", exampleMeaning: "Bên ngoài đang mưa.", note: "HSK1" },
      { word: "冷", pron: "lěng", meaningVi: "lạnh", exampleSentence: "北京的冬天很冷。", exampleMeaning: "Mùa đông Bắc Kinh rất lạnh.", note: "HSK1" },
      { word: "热", pron: "rè", meaningVi: "nóng", exampleSentence: "今天太热了！", exampleMeaning: "Hôm nay nóng quá!", note: "HSK1" },
      { word: "晴", pron: "qíng", meaningVi: "nắng, quang đãng", exampleSentence: "明天是晴天。", exampleMeaning: "Ngày mai trời nắng.", note: "HSK2" },
      { word: "阴", pron: "yīn", meaningVi: "âm u, nhiều mây", exampleSentence: "今天天阴，可能会下雨。", exampleMeaning: "Hôm nay trời âm u, có thể mưa.", note: "HSK2" },
      { word: "下雪", pron: "xiàxuě", meaningVi: "tuyết rơi", exampleSentence: "昨天晚上下雪了。", exampleMeaning: "Tối qua tuyết rơi.", note: "HSK2" },
      { word: "雪", pron: "xuě", meaningVi: "tuyết", exampleSentence: "孩子们在雪里玩儿。", exampleMeaning: "Bọn trẻ chơi trong tuyết.", note: "HSK2" },
      { word: "刮风", pron: "guāfēng", meaningVi: "gió thổi, nổi gió", exampleSentence: "外面刮大风了。", exampleMeaning: "Bên ngoài gió to rồi.", note: "HSK3" },
      { word: "春天", pron: "chūntiān", meaningVi: "mùa xuân", exampleSentence: "春天来了，花都开了。", exampleMeaning: "Mùa xuân đến rồi, hoa nở hết cả.", note: "HSK3" },
      { word: "夏天", pron: "xiàtiān", meaningVi: "mùa hè", exampleSentence: "夏天我喜欢去游泳。", exampleMeaning: "Mùa hè tôi thích đi bơi.", note: "HSK3" },
      { word: "秋天", pron: "qiūtiān", meaningVi: "mùa thu", exampleSentence: "北京的秋天最漂亮。", exampleMeaning: "Mùa thu Bắc Kinh đẹp nhất.", note: "HSK3" },
      { word: "冬天", pron: "dōngtiān", meaningVi: "mùa đông", exampleSentence: "冬天的时候我常常感冒。", exampleMeaning: "Vào mùa đông tôi hay bị cảm.", note: "HSK3" },
      { word: "暖和", pron: "nuǎnhuo", meaningVi: "ấm áp", exampleSentence: "春天天气很暖和。", exampleMeaning: "Mùa xuân thời tiết rất ấm áp.", note: "HSK3" },
      { word: "凉快", pron: "liángkuai", meaningVi: "mát mẻ", exampleSentence: "秋天很凉快，很舒服。", exampleMeaning: "Mùa thu mát mẻ, rất dễ chịu.", note: "HSK3" },
      { word: "太阳", pron: "tàiyáng", meaningVi: "mặt trời", exampleSentence: "今天太阳很大。", exampleMeaning: "Hôm nay nắng to.", note: "HSK3" },
      { word: "月亮", pron: "yuèliang", meaningVi: "mặt trăng", exampleSentence: "今晚的月亮又大又圆。", exampleMeaning: "Trăng tối nay vừa to vừa tròn.", note: "HSK3" },
      { word: "云", pron: "yún", meaningVi: "mây", exampleSentence: "天上有很多白云。", exampleMeaning: "Trên trời có nhiều mây trắng.", note: "HSK3" },
      { word: "雨伞", pron: "yǔsǎn", meaningVi: "ô, dù", exampleSentence: "出门别忘了带雨伞。", exampleMeaning: "Ra ngoài đừng quên mang ô.", note: "HSK3" },
      { word: "度", pron: "dù", meaningVi: "độ (nhiệt độ)", exampleSentence: "今天三十八度，太热了。", exampleMeaning: "Hôm nay 38 độ, nóng quá.", note: "HSK3" },
      { word: "天气预报", pron: "tiānqì yùbào", meaningVi: "dự báo thời tiết", exampleSentence: "天气预报说明天有雨。", exampleMeaning: "Dự báo thời tiết nói ngày mai có mưa.", note: "HSK3+" },
      { word: "空气", pron: "kōngqì", meaningVi: "không khí", exampleSentence: "山上的空气很好。", exampleMeaning: "Không khí trên núi rất trong lành.", note: "HSK3" },
      { word: "环境", pron: "huánjìng", meaningVi: "môi trường", exampleSentence: "这里的环境很安静。", exampleMeaning: "Môi trường ở đây rất yên tĩnh.", note: "HSK3" },
      { word: "越来越", pron: "yuè lái yuè", meaningVi: "ngày càng", exampleSentence: "天气越来越热了。", exampleMeaning: "Thời tiết ngày càng nóng.", note: "HSK3" },
      { word: "舒服", pron: "shūfu", meaningVi: "dễ chịu, thoải mái", exampleSentence: "凉快的天气让人很舒服。", exampleMeaning: "Thời tiết mát mẻ khiến người ta dễ chịu.", note: "HSK3" },
    ],
  },
  {
    name: "Sức khoẻ & Cơ thể",
    icon: "🏥",
    words: [
      { word: "身体", pron: "shēntǐ", meaningVi: "cơ thể, sức khoẻ", exampleSentence: "爷爷的身体很好。", exampleMeaning: "Sức khoẻ của ông rất tốt.", note: "HSK2" },
      { word: "医院", pron: "yīyuàn", meaningVi: "bệnh viện", exampleSentence: "他生病了，去医院了。", exampleMeaning: "Anh ấy ốm rồi, đi bệnh viện rồi.", note: "HSK1" },
      { word: "头", pron: "tóu", meaningVi: "đầu", exampleSentence: "我头有点儿疼。", exampleMeaning: "Đầu tôi hơi đau.", note: "HSK3" },
      { word: "眼睛", pron: "yǎnjing", meaningVi: "mắt", exampleSentence: "她的眼睛很大。", exampleMeaning: "Mắt cô ấy rất to.", note: "HSK2" },
      { word: "耳朵", pron: "ěrduo", meaningVi: "tai", exampleSentence: "兔子的耳朵很长。", exampleMeaning: "Tai thỏ rất dài.", note: "HSK3" },
      { word: "鼻子", pron: "bízi", meaningVi: "mũi", exampleSentence: "感冒了，鼻子不舒服。", exampleMeaning: "Bị cảm rồi, mũi khó chịu.", note: "HSK3" },
      { word: "嘴", pron: "zuǐ", meaningVi: "miệng", exampleSentence: "请张开嘴。", exampleMeaning: "Xin há miệng ra.", note: "HSK3" },
      { word: "脸", pron: "liǎn", meaningVi: "mặt", exampleSentence: "他的脸红了。", exampleMeaning: "Mặt cậu ấy đỏ lên rồi.", note: "HSK3" },
      { word: "手", pron: "shǒu", meaningVi: "tay", exampleSentence: "吃饭以前要洗手。", exampleMeaning: "Trước khi ăn phải rửa tay.", note: "HSK2" },
      { word: "脚", pron: "jiǎo", meaningVi: "chân (bàn chân)", exampleSentence: "走了一天，脚很疼。", exampleMeaning: "Đi bộ cả ngày, chân đau lắm.", note: "HSK3" },
      { word: "腿", pron: "tuǐ", meaningVi: "chân (cẳng chân)", exampleSentence: "他的腿受伤了。", exampleMeaning: "Chân anh ấy bị thương.", note: "HSK3" },
      { word: "头发", pron: "tóufa", meaningVi: "tóc", exampleSentence: "她的头发又黑又长。", exampleMeaning: "Tóc cô ấy vừa đen vừa dài.", note: "HSK3" },
      { word: "生病", pron: "shēngbìng", meaningVi: "bị ốm", exampleSentence: "他生病了，今天不来上课。", exampleMeaning: "Cậu ấy ốm rồi, hôm nay không đi học.", note: "HSK2" },
      { word: "感冒", pron: "gǎnmào", meaningVi: "cảm cúm", exampleSentence: "我感冒了，头很疼。", exampleMeaning: "Tôi bị cảm rồi, đầu rất đau.", note: "HSK3" },
      { word: "发烧", pron: "fāshāo", meaningVi: "sốt", exampleSentence: "孩子发烧了，快去医院吧。", exampleMeaning: "Con bị sốt rồi, mau đi bệnh viện thôi.", note: "HSK3" },
      { word: "疼", pron: "téng", meaningVi: "đau", exampleSentence: "我的牙很疼。", exampleMeaning: "Răng tôi đau lắm.", note: "HSK3" },
      { word: "药", pron: "yào", meaningVi: "thuốc", exampleSentence: "吃了药就会好的。", exampleMeaning: "Uống thuốc rồi sẽ khỏi thôi.", note: "HSK2" },
      { word: "吃药", pron: "chī yào", meaningVi: "uống thuốc", exampleSentence: "一天吃三次药。", exampleMeaning: "Một ngày uống thuốc ba lần.", note: "HSK2" },
      { word: "看病", pron: "kànbìng", meaningVi: "khám bệnh", exampleSentence: "我下午去医院看病。", exampleMeaning: "Chiều tôi đi bệnh viện khám.", note: "HSK3" },
      { word: "检查", pron: "jiǎnchá", meaningVi: "kiểm tra, khám", exampleSentence: "医生给我做了检查。", exampleMeaning: "Bác sĩ khám cho tôi.", note: "HSK3" },
      { word: "休息", pron: "xiūxi", meaningVi: "nghỉ ngơi", exampleSentence: "你要多喝水，多休息。", exampleMeaning: "Bạn phải uống nhiều nước, nghỉ ngơi nhiều.", note: "HSK2" },
      { word: "健康", pron: "jiànkāng", meaningVi: "khoẻ mạnh, sức khoẻ", exampleSentence: "祝你身体健康！", exampleMeaning: "Chúc bạn sức khoẻ dồi dào!", note: "HSK3" },
      { word: "胖", pron: "pàng", meaningVi: "béo", exampleSentence: "最近我胖了三公斤。", exampleMeaning: "Dạo này tôi béo lên 3 cân.", note: "HSK3" },
      { word: "瘦", pron: "shòu", meaningVi: "gầy", exampleSentence: "她比以前瘦了很多。", exampleMeaning: "Cô ấy gầy hơn trước nhiều.", note: "HSK3" },
      { word: "牙", pron: "yá", meaningVi: "răng", exampleSentence: "晚上睡觉以前要刷牙。", exampleMeaning: "Buổi tối trước khi ngủ phải đánh răng.", note: "HSK3" },
      { word: "感觉", pron: "gǎnjué", meaningVi: "cảm thấy, cảm giác", exampleSentence: "我感觉好多了。", exampleMeaning: "Tôi cảm thấy đỡ nhiều rồi.", note: "HSK3" },
    ],
  },
  {
    name: "Nhà cửa & Đồ vật",
    icon: "🏠",
    words: [
      { word: "房间", pron: "fángjiān", meaningVi: "phòng", exampleSentence: "我的房间不大。", exampleMeaning: "Phòng của tôi không to.", note: "HSK2" },
      { word: "房子", pron: "fángzi", meaningVi: "nhà, căn nhà", exampleSentence: "他们买了一套新房子。", exampleMeaning: "Họ mua một căn nhà mới.", note: "HSK3" },
      { word: "桌子", pron: "zhuōzi", meaningVi: "bàn", exampleSentence: "桌子上有一本书。", exampleMeaning: "Trên bàn có một cuốn sách.", note: "HSK1" },
      { word: "椅子", pron: "yǐzi", meaningVi: "ghế", exampleSentence: "房间里有四把椅子。", exampleMeaning: "Trong phòng có 4 chiếc ghế.", note: "HSK1" },
      { word: "床", pron: "chuáng", meaningVi: "giường", exampleSentence: "猫在床上睡觉。", exampleMeaning: "Con mèo đang ngủ trên giường.", note: "HSK2" },
      { word: "门", pron: "mén", meaningVi: "cửa", exampleSentence: "请关门。", exampleMeaning: "Xin đóng cửa.", note: "HSK2" },
      { word: "窗户", pron: "chuānghu", meaningVi: "cửa sổ", exampleSentence: "请打开窗户。", exampleMeaning: "Xin mở cửa sổ.", note: "HSK3+" },
      { word: "灯", pron: "dēng", meaningVi: "đèn", exampleSentence: "睡觉以前记得关灯。", exampleMeaning: "Trước khi ngủ nhớ tắt đèn.", note: "HSK3" },
      { word: "冰箱", pron: "bīngxiāng", meaningVi: "tủ lạnh", exampleSentence: "冰箱里有很多水果。", exampleMeaning: "Trong tủ lạnh có nhiều hoa quả.", note: "HSK3" },
      { word: "空调", pron: "kōngtiáo", meaningVi: "điều hoà", exampleSentence: "太热了，开空调吧。", exampleMeaning: "Nóng quá, bật điều hoà đi.", note: "HSK3" },
      { word: "电梯", pron: "diàntī", meaningVi: "thang máy", exampleSentence: "我们坐电梯上楼。", exampleMeaning: "Chúng ta đi thang máy lên tầng.", note: "HSK3" },
      { word: "洗手间", pron: "xǐshǒujiān", meaningVi: "nhà vệ sinh", exampleSentence: "请问，洗手间在哪儿？", exampleMeaning: "Xin hỏi, nhà vệ sinh ở đâu?", note: "HSK3" },
      { word: "厨房", pron: "chúfáng", meaningVi: "bếp", exampleSentence: "妈妈在厨房做饭。", exampleMeaning: "Mẹ đang nấu ăn trong bếp.", note: "HSK3" },
      { word: "楼", pron: "lóu", meaningVi: "toà nhà, tầng lầu", exampleSentence: "我住在五楼。", exampleMeaning: "Tôi ở tầng 5.", note: "HSK3" },
      { word: "层", pron: "céng", meaningVi: "tầng", exampleSentence: "这个楼一共有二十层。", exampleMeaning: "Toà nhà này có tất cả 20 tầng.", note: "HSK3" },
      { word: "住", pron: "zhù", meaningVi: "ở, sống", exampleSentence: "你住在哪儿？", exampleMeaning: "Bạn sống ở đâu?", note: "HSK1" },
      { word: "搬", pron: "bān", meaningVi: "chuyển, khiêng", exampleSentence: "下个月我们要搬家。", exampleMeaning: "Tháng sau chúng tôi chuyển nhà.", note: "HSK3" },
      { word: "打扫", pron: "dǎsǎo", meaningVi: "quét dọn", exampleSentence: "周末我在家打扫房间。", exampleMeaning: "Cuối tuần tôi ở nhà dọn phòng.", note: "HSK3" },
      { word: "干净", pron: "gānjìng", meaningVi: "sạch sẽ", exampleSentence: "房间打扫得很干净。", exampleMeaning: "Phòng được dọn rất sạch.", note: "HSK3" },
      { word: "盘子", pron: "pánzi", meaningVi: "đĩa", exampleSentence: "盘子里有一些水果。", exampleMeaning: "Trong đĩa có ít hoa quả.", note: "HSK3" },
      { word: "杯子", pron: "bēizi", meaningVi: "cốc, ly", exampleSentence: "这个杯子是谁的？", exampleMeaning: "Cái cốc này của ai?", note: "HSK1" },
      { word: "手表", pron: "shǒubiǎo", meaningVi: "đồng hồ đeo tay", exampleSentence: "这块手表是爸爸送的。", exampleMeaning: "Chiếc đồng hồ này là bố tặng.", note: "HSK2" },
      { word: "眼镜", pron: "yǎnjìng", meaningVi: "kính mắt", exampleSentence: "他戴着一副眼镜。", exampleMeaning: "Anh ấy đeo một cặp kính.", note: "HSK3" },
      { word: "照片", pron: "zhàopiàn", meaningVi: "ảnh, tấm hình", exampleSentence: "墙上有很多照片。", exampleMeaning: "Trên tường có nhiều ảnh.", note: "HSK3" },
      { word: "报纸", pron: "bàozhǐ", meaningVi: "báo giấy", exampleSentence: "爷爷喜欢看报纸。", exampleMeaning: "Ông thích đọc báo.", note: "HSK2" },
      { word: "箱子", pron: "xiāngzi", meaningVi: "vali, hòm, thùng", exampleSentence: "这个箱子太重了。", exampleMeaning: "Cái vali này nặng quá.", note: "HSK3" },
      { word: "包", pron: "bāo", meaningVi: "túi, cặp", exampleSentence: "我的包里有一把伞。", exampleMeaning: "Trong túi tôi có một chiếc ô.", note: "HSK3" },
    ],
  },
  {
    name: "Du lịch & Địa điểm",
    icon: "🌏",
    words: [
      { word: "中国", pron: "Zhōngguó", meaningVi: "Trung Quốc", exampleSentence: "我想去中国旅游。", exampleMeaning: "Tôi muốn đi du lịch Trung Quốc.", note: "HSK1" },
      { word: "北京", pron: "Běijīng", meaningVi: "Bắc Kinh", exampleSentence: "北京是中国的首都。", exampleMeaning: "Bắc Kinh là thủ đô của Trung Quốc.", note: "HSK1" },
      { word: "上海", pron: "Shànghǎi", meaningVi: "Thượng Hải", exampleSentence: "上海是一个很大的城市。", exampleMeaning: "Thượng Hải là một thành phố rất lớn.", note: "HSK2" },
      { word: "地方", pron: "dìfang", meaningVi: "nơi, chỗ", exampleSentence: "这个地方真漂亮！", exampleMeaning: "Nơi này đẹp thật!", note: "HSK3" },
      { word: "宾馆", pron: "bīnguǎn", meaningVi: "khách sạn", exampleSentence: "我们住在火车站旁边的宾馆。", exampleMeaning: "Chúng tôi ở khách sạn cạnh ga tàu.", note: "HSK3" },
      { word: "饭店", pron: "fàndiàn", meaningVi: "khách sạn, nhà hàng", exampleSentence: "这家饭店的房间很干净。", exampleMeaning: "Phòng của khách sạn này rất sạch.", note: "HSK1" },
      { word: "银行", pron: "yínháng", meaningVi: "ngân hàng", exampleSentence: "我去银行换钱。", exampleMeaning: "Tôi đến ngân hàng đổi tiền.", note: "HSK3" },
      { word: "公园", pron: "gōngyuán", meaningVi: "công viên", exampleSentence: "公园里有很多人在锻炼。", exampleMeaning: "Trong công viên có nhiều người tập thể dục.", note: "HSK3" },
      { word: "长城", pron: "Chángchéng", meaningVi: "Vạn Lý Trường Thành", exampleSentence: "我们明天去爬长城。", exampleMeaning: "Ngày mai chúng tôi đi leo Trường Thành.", note: "HSK3+" },
      { word: "护照", pron: "hùzhào", meaningVi: "hộ chiếu", exampleSentence: "别忘了带护照。", exampleMeaning: "Đừng quên mang hộ chiếu.", note: "HSK3" },
      { word: "行李箱", pron: "xínglixiāng", meaningVi: "vali hành lý", exampleSentence: "我的行李箱是蓝色的。", exampleMeaning: "Vali của tôi màu xanh dương.", note: "HSK3" },
      { word: "照相机", pron: "zhàoxiàngjī", meaningVi: "máy ảnh", exampleSentence: "我带了照相机去旅游。", exampleMeaning: "Tôi mang máy ảnh đi du lịch.", note: "HSK3" },
      { word: "国家", pron: "guójiā", meaningVi: "quốc gia, đất nước", exampleSentence: "你去过哪些国家？", exampleMeaning: "Bạn đã đi những nước nào?", note: "HSK3" },
      { word: "世界", pron: "shìjiè", meaningVi: "thế giới", exampleSentence: "我想看看外面的世界。", exampleMeaning: "Tôi muốn xem thế giới bên ngoài.", note: "HSK3" },
      { word: "城市", pron: "chéngshì", meaningVi: "thành phố", exampleSentence: "河内是越南的首都城市。", exampleMeaning: "Hà Nội là thành phố thủ đô của Việt Nam.", note: "HSK3" },
      { word: "越南", pron: "Yuènán", meaningVi: "Việt Nam", exampleSentence: "我是越南人。", exampleMeaning: "Tôi là người Việt Nam.", note: "HSK1" },
      { word: "外国", pron: "wàiguó", meaningVi: "nước ngoài", exampleSentence: "他在外国留学。", exampleMeaning: "Anh ấy du học ở nước ngoài.", note: "HSK3" },
      { word: "有名", pron: "yǒumíng", meaningVi: "nổi tiếng", exampleSentence: "这个地方很有名。", exampleMeaning: "Nơi này rất nổi tiếng.", note: "HSK3" },
      { word: "玩儿", pron: "wánr", meaningVi: "chơi", exampleSentence: "欢迎你来越南玩儿。", exampleMeaning: "Hoan nghênh bạn đến Việt Nam chơi.", note: "HSK2" },
      { word: "打算", pron: "dǎsuàn", meaningVi: "dự định", exampleSentence: "假期你打算去哪儿？", exampleMeaning: "Kỳ nghỉ bạn định đi đâu?", note: "HSK3" },
      { word: "决定", pron: "juédìng", meaningVi: "quyết định", exampleSentence: "我决定去中国学习汉语。", exampleMeaning: "Tôi quyết định đi Trung Quốc học tiếng Trung.", note: "HSK3" },
      { word: "准备", pron: "zhǔnbèi", meaningVi: "chuẩn bị", exampleSentence: "我在准备明天的旅行。", exampleMeaning: "Tôi đang chuẩn bị cho chuyến đi ngày mai.", note: "HSK2" },
      { word: "离开", pron: "líkāi", meaningVi: "rời khỏi", exampleSentence: "他明天离开北京。", exampleMeaning: "Ngày mai anh ấy rời Bắc Kinh.", note: "HSK3" },
      { word: "回来", pron: "huílái", meaningVi: "quay về, trở về", exampleSentence: "你什么时候回来？", exampleMeaning: "Khi nào bạn về?", note: "HSK1" },
      { word: "欢迎", pron: "huānyíng", meaningVi: "hoan nghênh, chào mừng", exampleSentence: "欢迎你们来我家做客。", exampleMeaning: "Hoan nghênh các bạn đến nhà tôi chơi.", note: "HSK2" },
      { word: "希望", pron: "xīwàng", meaningVi: "hy vọng", exampleSentence: "我希望明年能去中国。", exampleMeaning: "Tôi hy vọng năm sau có thể đi Trung Quốc.", note: "HSK2" },
      { word: "放假", pron: "fàngjià", meaningVi: "nghỉ (lễ, hè)", exampleSentence: "下星期学校放假。", exampleMeaning: "Tuần sau trường được nghỉ.", note: "HSK3" },
    ],
  },
];

// ============================ 3. GRAMMAR (HSK1-3) ============================
const ZH_GRAMMAR: GrammarSeed[] = [
  {
    level: 'HSK1',
    title: 'Câu vị ngữ với 是 — "là"',
    structure: 'A + 是 + B｜A + 不是 + B',
    explanation:
      '<p><strong>是 (shì)</strong> nối hai danh từ: "A là B". Phủ định thêm <strong>不</strong> trước 是.</p><ul><li>我是越南人。(Tôi là người Việt Nam.)</li><li>他不是老师。(Anh ấy không phải giáo viên.)</li></ul><p>⚠️ Khác tiếng Việt: KHÔNG dùng 是 trước tính từ. "Cô ấy rất đẹp" = 她很漂亮, không nói 她是漂亮.</p>',
    examples: [
      { sentence: '我是学生。', pronunciation: 'Wǒ shì xuésheng.', meaningVi: 'Tôi là học sinh.' },
      { sentence: '这是我的手机。', pronunciation: 'Zhè shì wǒ de shǒujī.', meaningVi: 'Đây là điện thoại của tôi.' },
      { sentence: '他不是中国人，是日本人。', pronunciation: 'Tā bú shì Zhōngguórén, shì Rìběnrén.', meaningVi: 'Anh ấy không phải người Trung Quốc, là người Nhật.' },
    ],
    commonMistakes: '❌ 她是很漂亮 → ✅ 她很漂亮 (tính từ làm vị ngữ trực tiếp, không cần 是)',
    comparedWith: '是 = "là" (danh từ); 很 + tính từ = vị ngữ tính từ; 在 = "ở" (vị trí).',
  },
  {
    level: 'HSK1',
    title: 'Trợ từ 的 — sở hữu và bổ nghĩa',
    structure: 'A + 的 + N (A sở hữu/bổ nghĩa N)',
    explanation:
      '<p><strong>的 (de)</strong> nối định ngữ với danh từ — giống "của" tiếng Việt nhưng NGƯỢC trật tự:</p><ul><li>我的书 (sách CỦA tôi — "tôi" đứng TRƯỚC), 妈妈的手机 (điện thoại của mẹ)</li><li>Tính từ dài + 的: 漂亮的女孩 (cô gái xinh đẹp)</li></ul><p>Được lược bỏ với quan hệ thân thiết/cơ quan: 我妈妈 (mẹ tôi), 我们学校 (trường chúng tôi).</p>',
    examples: [
      { sentence: '这是老师的书。', pronunciation: 'Zhè shì lǎoshī de shū.', meaningVi: 'Đây là sách của cô giáo.' },
      { sentence: '我的汉语名字叫王明。', pronunciation: 'Wǒ de Hànyǔ míngzi jiào Wáng Míng.', meaningVi: 'Tên tiếng Trung của tôi là Vương Minh.' },
      { sentence: '她是我妈妈。', pronunciation: 'Tā shì wǒ māma.', meaningVi: 'Bà ấy là mẹ tôi (thân thiết nên bỏ 的).' },
    ],
    commonMistakes: '❌ 书的我 (bắt chước trật tự tiếng Việt "sách của tôi") → ✅ 我的书 (người sở hữu đứng TRƯỚC)',
    comparedWith: '的 (bổ nghĩa danh từ) vs 得 (bổ ngữ mức độ sau động từ) vs 地 (trạng ngữ trước động từ) — cả ba đều đọc "de".',
  },
  {
    level: 'HSK1',
    title: 'Câu hỏi với 吗 và 呢',
    structure: 'Câu trần thuật + 吗？｜N/Cụm + 呢？',
    explanation:
      '<p>Hai trợ từ nghi vấn cơ bản nhất:</p><ul><li><strong>吗 (ma)</strong>: biến câu trần thuật thành câu hỏi có/không — 你是学生吗？(Bạn là học sinh phải không?)</li><li><strong>呢 (ne)</strong>: hỏi ngược lại "còn... thì sao?" — 我很好，你呢？(Tôi khỏe, còn bạn?)</li></ul>',
    examples: [
      { sentence: '你喜欢中国菜吗？', pronunciation: 'Nǐ xǐhuan Zhōngguó cài ma?', meaningVi: 'Bạn có thích món ăn Trung Quốc không?' },
      { sentence: '我是越南人，你呢？', pronunciation: 'Wǒ shì Yuènánrén, nǐ ne?', meaningVi: 'Tôi là người Việt, còn bạn?' },
      { sentence: '你爸爸妈妈身体好吗？', pronunciation: 'Nǐ bàba māma shēntǐ hǎo ma?', meaningVi: 'Bố mẹ bạn có khỏe không?' },
    ],
    commonMistakes: '❌ Dùng 吗 với câu đã có từ để hỏi: 你是谁吗？ → ✅ 你是谁？(谁/什么/哪儿 tự nó đã là câu hỏi)',
    comparedWith: '吗 = hỏi có/không; 呢 = hỏi lại chủ đề; câu hỏi chính-phản A不A (你去不去？) thay được cho 吗.',
  },
  {
    level: 'HSK1',
    title: 'Phủ định 不 và 没(有)',
    structure: '不 + V/Adj (hiện tại, thói quen, ý chí)｜没(有) + V (quá khứ chưa xảy ra)',
    explanation:
      '<p>Tiếng Trung có HAI từ phủ định, chia theo thời gian và tính chất:</p><ul><li><strong>不 (bù)</strong>: phủ định hiện tại/tương lai/thói quen/ý muốn — 我不吃肉。(Tôi không ăn thịt.) 明天我不去。</li><li><strong>没(有) (méi yǒu)</strong>: phủ định việc ĐÃ (chưa) xảy ra — 我没吃早饭。(Tôi chưa ăn sáng.) Và phủ định sở hữu: 我没有钱。</li></ul><p>Riêng 有 KHÔNG BAO GIỜ phủ định bằng 不: luôn là 没有.</p>',
    examples: [
      { sentence: '我不喝咖啡。', pronunciation: 'Wǒ bù hē kāfēi.', meaningVi: 'Tôi không uống cà phê (thói quen).' },
      { sentence: '昨天我没去学校。', pronunciation: 'Zuótiān wǒ méi qù xuéxiào.', meaningVi: 'Hôm qua tôi không đến trường.' },
      { sentence: '我没有弟弟。', pronunciation: 'Wǒ méiyǒu dìdi.', meaningVi: 'Tôi không có em trai.' },
    ],
    commonMistakes: '❌ 昨天我不去学校 → ✅ 昨天我没去学校 (việc quá khứ dùng 没). ❌ 我不有钱 → ✅ 我没有钱',
    comparedWith: '不 phủ nhận ý chí/tính chất; 没 phủ nhận sự việc đã hoàn thành. 不 đổi thanh: bù → bú trước thanh 4 (不是 bú shì).',
  },
  {
    level: 'HSK1',
    title: 'Lượng từ 个, 本, 杯, 口…',
    structure: 'Số + Lượng từ + Danh từ｜这/那 + Lượng từ + Danh từ',
    explanation:
      '<p>Danh từ tiếng Trung LUÔN cần lượng từ khi đi với số đếm hoặc 这/那 — giống "cái/con/quyển" tiếng Việt:</p><ul><li><strong>个 (gè)</strong> vạn năng: 一个人, 三个苹果</li><li><strong>本 (běn)</strong> sách vở: 两本书; <strong>杯 (bēi)</strong> cốc: 一杯茶; <strong>口 (kǒu)</strong> người trong nhà: 我家有四口人; <strong>只 (zhī)</strong> con vật: 一只猫; <strong>件 (jiàn)</strong> áo/việc: 一件衣服</li></ul><p>Lưu ý: 两 (liǎng) dùng thay 二 trước lượng từ: 两个人, không nói 二个人.</p>',
    examples: [
      { sentence: '我家有三口人。', pronunciation: 'Wǒ jiā yǒu sān kǒu rén.', meaningVi: 'Nhà tôi có 3 người.' },
      { sentence: '我买了两本书。', pronunciation: 'Wǒ mǎi le liǎng běn shū.', meaningVi: 'Tôi đã mua 2 quyển sách.' },
      { sentence: '请给我一杯水。', pronunciation: 'Qǐng gěi wǒ yì bēi shuǐ.', meaningVi: 'Xin cho tôi một cốc nước.' },
    ],
    commonMistakes: '❌ 三苹果 (thiếu lượng từ) → ✅ 三个苹果. ❌ 二个人 → ✅ 两个人',
    comparedWith: 'Giống hệt cơ chế loại từ tiếng Việt (một CON mèo, hai QUYỂN sách) — chỉ cần nhớ cặp lượng từ ↔ danh từ.',
  },
  {
    level: 'HSK1',
    title: '在 — "ở" (vị trí và nơi diễn ra hành động)',
    structure: 'A + 在 + Nơi chốn｜Chủ ngữ + 在 + Nơi chốn + V',
    explanation:
      '<p><strong>在 (zài)</strong> có hai vai trò chính:</p><ul><li>Động từ "ở": 我在家。(Tôi đang ở nhà.) 他不在。(Anh ấy không có ở đây.)</li><li>Giới từ "tại/ở" — đứng TRƯỚC động từ: 我在图书馆看书。(Tôi đọc sách Ở thư viện.)</li></ul><p>⚠️ Trật tự ngược tiếng Việt: "học ở trường" = 在学校学习 (nơi chốn đứng TRƯỚC động từ).</p>',
    examples: [
      { sentence: '你在哪儿？', pronunciation: 'Nǐ zài nǎr?', meaningVi: 'Bạn đang ở đâu?' },
      { sentence: '我在公司工作。', pronunciation: 'Wǒ zài gōngsī gōngzuò.', meaningVi: 'Tôi làm việc ở công ty.' },
      { sentence: '猫在椅子下面。', pronunciation: 'Māo zài yǐzi xiàmiàn.', meaningVi: 'Con mèo ở dưới ghế.' },
    ],
    commonMistakes: '❌ 我学习在学校 (bắt chước trật tự Việt) → ✅ 我在学校学习 (cụm 在+nơi chốn đứng trước động từ)',
    comparedWith: '在 còn đánh dấu hành động đang diễn ra (我在吃饭 = tôi ĐANG ăn) — HSK2; 有 chỉ tồn tại "ở đâu CÓ gì" (桌子上有书).',
  },
  {
    level: 'HSK2',
    title: 'Trợ từ 了 — hoàn thành và thay đổi',
    structure: 'V + 了 (+ tân ngữ) — hoàn thành｜Câu + 了 — thay đổi trạng thái',
    explanation:
      '<p><strong>了 (le)</strong> là điểm ngữ pháp quan trọng và khó nhất sơ cấp, có 2 cách dùng lớn:</p><ul><li><strong>V + 了</strong>: hành động đã hoàn thành — 我买了一本书。(Tôi đã mua một quyển sách.)</li><li><strong>Cuối câu 了</strong>: tình huống thay đổi/xuất hiện tình huống mới — 下雨了。(Trời mưa rồi.) 我二十岁了。(Tôi 20 tuổi rồi.)</li></ul><p>Phủ định hoàn thành dùng 没 và BỎ 了: 我没买书。</p>',
    examples: [
      { sentence: '我吃了两个包子。', pronunciation: 'Wǒ chī le liǎng ge bāozi.', meaningVi: 'Tôi đã ăn 2 cái bánh bao.' },
      { sentence: '他去北京了。', pronunciation: 'Tā qù Běijīng le.', meaningVi: 'Anh ấy đi Bắc Kinh rồi.' },
      { sentence: '天气冷了，多穿衣服吧。', pronunciation: 'Tiānqì lěng le, duō chuān yīfu ba.', meaningVi: 'Trời lạnh rồi, mặc thêm áo vào.' },
    ],
    commonMistakes: '❌ 我没买了书 → ✅ 我没买书 (phủ định 没 thì bỏ 了). ❌ 昨天我学了 (câu cụt) → ✅ 昨天我学了两个小时',
    comparedWith: '了 (hoàn thành) ≠ thì quá khứ: 明天吃了饭再走 (mai ăn XONG rồi hãy đi — tương lai vẫn dùng 了); 过 nhấn trải nghiệm "đã từng".',
  },
  {
    level: 'HSK2',
    title: '过 — đã từng (kinh nghiệm)',
    structure: 'V + 过 (+ tân ngữ)｜没 + V + 过',
    explanation:
      '<p><strong>过 (guo)</strong> sau động từ diễn tả TRẢI NGHIỆM "đã từng làm":</p><ul><li>我去过中国。(Tôi đã từng đi Trung Quốc.)</li><li>你吃过北京烤鸭吗？(Bạn từng ăn vịt quay Bắc Kinh chưa?)</li><li>Phủ định: 我没学过汉语。(Tôi chưa từng học tiếng Trung — GIỮ 过.)</li></ul>',
    examples: [
      { sentence: '我看过这个电影。', pronunciation: 'Wǒ kàn guo zhège diànyǐng.', meaningVi: 'Tôi từng xem bộ phim này rồi.' },
      { sentence: '你去过上海吗？', pronunciation: 'Nǐ qù guo Shànghǎi ma?', meaningVi: 'Bạn đã từng đến Thượng Hải chưa?' },
      { sentence: '我还没吃过四川菜。', pronunciation: 'Wǒ hái méi chī guo Sìchuān cài.', meaningVi: 'Tôi vẫn chưa từng ăn món Tứ Xuyên.' },
    ],
    commonMistakes: '❌ 我没去过了中国 (lẫn 过 với 了) → ✅ 我没去过中国 (过 giữ nguyên sau 没, không thêm 了)',
    comparedWith: '过 = kinh nghiệm từng có (ít nhất 1 lần trong đời); 了 = hành động hoàn thành cụ thể một lần.',
  },
  {
    level: 'HSK2',
    title: '正在／在…(呢) — đang làm gì',
    structure: 'Chủ ngữ + 正在/在 + V (+ 呢)',
    explanation:
      '<p>Diễn tả hành động ĐANG diễn ra:</p><ul><li>他正在开会。(Anh ấy đang họp.)</li><li>我在做饭呢。(Tôi đang nấu cơm mà.) — 呢 cuối câu làm mềm giọng</li><li>Trả lời điện thoại kinh điển: 你在干什么呢？— 我在看电视呢。</li></ul>',
    examples: [
      { sentence: '妈妈正在做饭。', pronunciation: 'Māma zhèngzài zuò fàn.', meaningVi: 'Mẹ đang nấu cơm.' },
      { sentence: '你在干什么呢？', pronunciation: 'Nǐ zài gàn shénme ne?', meaningVi: 'Bạn đang làm gì đấy?' },
      { sentence: '别打电话，他正在睡觉呢。', pronunciation: 'Bié dǎ diànhuà, tā zhèngzài shuìjiào ne.', meaningVi: 'Đừng gọi điện, anh ấy đang ngủ đấy.' },
    ],
    commonMistakes: '❌ 我正在去学校 mỗi ngày (thói quen không dùng 正在) → ✅ 我每天去学校',
    comparedWith: '正在 nhấn "đúng lúc này"; 在 nhẹ hơn; V + 着 (zhe) tả TRẠNG THÁI kéo dài (门开着 = cửa đang mở).',
  },
  {
    level: 'HSK2',
    title: 'So sánh với 比',
    structure: 'A + 比 + B + Adj (+ mức chênh)｜A + 没有 + B + Adj',
    explanation:
      '<p><strong>比 (bǐ)</strong> = "hơn": A 比 B đẹp/cao/đắt…</p><ul><li>今天比昨天冷。(Hôm nay lạnh hơn hôm qua.)</li><li>Mức chênh đứng SAU tính từ: 他比我大三岁。(Anh ấy lớn hơn tôi 3 tuổi.) 这个比那个贵一点儿。</li><li>Phủ định thường dùng 没有: 我没有他高。(Tôi không cao bằng anh ấy.)</li></ul><p>⚠️ KHÔNG dùng 很/非常 trước tính từ trong câu 比: ❌ 他比我很高.</p>',
    examples: [
      { sentence: '哥哥比我高。', pronunciation: 'Gēge bǐ wǒ gāo.', meaningVi: 'Anh trai cao hơn tôi.' },
      { sentence: '今天比昨天热得多。', pronunciation: 'Jīntiān bǐ zuótiān rè de duō.', meaningVi: 'Hôm nay nóng hơn hôm qua nhiều.' },
      { sentence: '这件衣服比那件便宜五十块。', pronunciation: 'Zhè jiàn yīfu bǐ nà jiàn piányi wǔshí kuài.', meaningVi: 'Cái áo này rẻ hơn cái kia 50 tệ.' },
    ],
    commonMistakes: '❌ 他比我很高 → ✅ 他比我高 / 他比我高得多 (không dùng 很 trong câu so sánh 比)',
    comparedWith: '比 = hơn; A 跟 B 一样 + Adj = bằng nhau; A 没有 B + Adj = không bằng.',
  },
  {
    level: 'HSK2',
    title: 'Bổ ngữ kết quả — 完, 到, 见, 好, 错',
    structure: 'V + 完/到/见/好/错 (+ 了)',
    explanation:
      '<p>Động từ tiếng Trung thường cần một "đuôi kết quả" nói rõ hành động đạt kết quả gì:</p><ul><li><strong>完</strong> xong: 作业写完了。(Bài tập viết xong rồi.)</li><li><strong>到</strong> đạt/thấy được: 我买到票了。(Tôi mua ĐƯỢC vé rồi.) 找到了！</li><li><strong>见</strong> cảm nhận: 听见 (nghe thấy), 看见 (nhìn thấy)</li><li><strong>好</strong> hoàn tất tốt đẹp: 饭做好了。<strong>错</strong> sai: 我说错了。</li></ul><p>Phủ định dùng 没: 还没写完。</p>',
    examples: [
      { sentence: '今天的作业我做完了。', pronunciation: 'Jīntiān de zuòyè wǒ zuò wán le.', meaningVi: 'Bài tập hôm nay tôi làm xong rồi.' },
      { sentence: '你看见我的钥匙了吗？', pronunciation: 'Nǐ kànjiàn wǒ de yàoshi le ma?', meaningVi: 'Bạn có nhìn thấy chìa khóa của tôi không?' },
      { sentence: '对不起，我打错电话了。', pronunciation: 'Duìbuqǐ, wǒ dǎ cuò diànhuà le.', meaningVi: 'Xin lỗi, tôi gọi nhầm số rồi.' },
    ],
    commonMistakes: '❌ 我写作业完了 → ✅ 我写完作业了 (bổ ngữ kết quả dính LIỀN sau động từ, trước tân ngữ)',
    comparedWith: 'Bổ ngữ kết quả (đạt gì) vs bổ ngữ xu hướng (进来/出去 — hướng nào) vs bổ ngữ khả năng (V得完/V不完 — nổi hay không).',
  },
  {
    level: 'HSK2',
    title: '要…了 / 快…了 — sắp… rồi',
    structure: '要 + V + 了｜快(要) + V/Adj + 了｜就要 + V + 了',
    explanation:
      '<p>Diễn tả việc SẮP xảy ra:</p><ul><li>要下雨了。(Sắp mưa rồi.)</li><li>快到了。(Sắp đến nơi rồi.) 我快三十岁了。</li><li>就要 gấp hơn, thường kèm thời gian: 火车八点就要开了。</li></ul><p>Lưu ý: có thời gian cụ thể thì không dùng 快要: ❌ 明天快要考试了 → ✅ 明天就要考试了.</p>',
    examples: [
      { sentence: '电影要开始了，快点儿！', pronunciation: 'Diànyǐng yào kāishǐ le, kuài diǎnr!', meaningVi: 'Phim sắp chiếu rồi, nhanh lên!' },
      { sentence: '春节快到了。', pronunciation: 'Chūnjié kuài dào le.', meaningVi: 'Sắp đến Tết rồi.' },
      { sentence: '飞机十分钟后就要起飞了。', pronunciation: 'Fēijī shí fēnzhōng hòu jiù yào qǐfēi le.', meaningVi: 'Máy bay 10 phút nữa là cất cánh.' },
    ],
    commonMistakes: '❌ 明天快要考试了 → ✅ 明天就要考试了 (đã có mốc thời gian cụ thể thì dùng 就要)',
    comparedWith: '快…了/要…了 = sắp (tương lai gần); 了 cuối câu đơn thuần = đã thay đổi; 马上 = ngay lập tức (trạng từ).',
  },
  {
    level: 'HSK3',
    title: 'Câu chữ 把 — xử lý tân ngữ',
    structure: 'Chủ ngữ + 把 + Tân ngữ + V + thành phần khác',
    explanation:
      '<p>Câu <strong>把 (bǎ)</strong> kéo tân ngữ lên TRƯỚC động từ để nhấn mạnh việc "xử lý" nó ra sao — bắt buộc dùng khi kết quả làm thay đổi vị trí/trạng thái của vật:</p><ul><li>请把门关上。(Làm ơn đóng cửa lại.)</li><li>我把作业做完了。(Tôi làm xong bài tập rồi.)</li><li>把书放在桌子上。(Đặt sách LÊN bàn.)</li></ul><p>Động từ trong câu 把 KHÔNG đứng trơ trọi — phải có 了/kết quả/hướng đi kèm.</p>',
    examples: [
      { sentence: '请把手机关了。', pronunciation: 'Qǐng bǎ shǒujī guān le.', meaningVi: 'Xin hãy tắt điện thoại đi.' },
      { sentence: '我把钱包忘在家里了。', pronunciation: 'Wǒ bǎ qiánbāo wàng zài jiā li le.', meaningVi: 'Tôi để quên ví ở nhà mất rồi.' },
      { sentence: '你把这句话翻译成越南语吧。', pronunciation: 'Nǐ bǎ zhè jù huà fānyì chéng Yuènányǔ ba.', meaningVi: 'Bạn dịch câu này sang tiếng Việt đi.' },
    ],
    commonMistakes: '❌ 我把作业做 (động từ trần) → ✅ 我把作业做完了 (phải có thành phần sau động từ)',
    comparedWith: 'Câu 把 chủ động "đem X ra xử lý"; câu 被 là dạng bị động tương ứng (X bị...).',
  },
  {
    level: 'HSK3',
    title: 'Câu bị động 被',
    structure: 'A + 被 (+ B) + V + thành phần khác',
    explanation:
      '<p><strong>被 (bèi)</strong> = "bị/được": chủ ngữ chịu tác động.</p><ul><li>我的自行车被(小偷)偷了。(Xe đạp của tôi bị (kẻ trộm) lấy mất.)</li><li>Người gây ra có thể lược bỏ: 蛋糕被吃完了。(Bánh bị ăn hết rồi.)</li><li>Văn nói còn dùng 让/叫 thay 被: 衣服让雨淋湿了。</li></ul><p>Giống câu 把, động từ phải có thành phần đi kèm (了, kết quả…).</p>',
    examples: [
      { sentence: '我的伞被同事拿走了。', pronunciation: 'Wǒ de sǎn bèi tóngshì ná zǒu le.', meaningVi: 'Ô của tôi bị đồng nghiệp cầm đi mất.' },
      { sentence: '他被老师批评了。', pronunciation: 'Tā bèi lǎoshī pīpíng le.', meaningVi: 'Cậu ấy bị thầy giáo phê bình.' },
      { sentence: '问题已经被解决了。', pronunciation: 'Wèntí yǐjīng bèi jiějué le.', meaningVi: 'Vấn đề đã được giải quyết rồi.' },
    ],
    commonMistakes: '❌ 我的手机被偷 (động từ trần) → ✅ 我的手机被偷了',
    comparedWith: '被 trung lập/hơi tiêu cực; tiếng Việt phân biệt "bị" (xấu) và "được" (tốt) — tiếng Trung việc tốt thường nói chủ động hoặc dùng 受到.',
  },
  {
    level: 'HSK3',
    title: '因为…所以… — vì… nên…',
    structure: '因为 + nguyên nhân, 所以 + kết quả',
    explanation:
      '<p>Cặp liên từ nhân quả phổ biến nhất:</p><ul><li>因为下雨，所以我没去跑步。(Vì trời mưa nên tôi không đi chạy.)</li><li>Khác tiếng Anh: dùng ĐƯỢC CẢ CẶP trong một câu (because... so...).</li><li>Có thể lược một vế: 我没去，因为太累了。</li></ul>',
    examples: [
      { sentence: '因为他病了，所以今天没来上班。', pronunciation: 'Yīnwèi tā bìng le, suǒyǐ jīntiān méi lái shàngbān.', meaningVi: 'Vì anh ấy ốm nên hôm nay không đi làm.' },
      { sentence: '因为明天有考试，所以我要复习。', pronunciation: 'Yīnwèi míngtiān yǒu kǎoshì, suǒyǐ wǒ yào fùxí.', meaningVi: 'Vì mai có bài thi nên tôi phải ôn tập.' },
      { sentence: '我喜欢这个城市，因为这里的人很友好。', pronunciation: 'Wǒ xǐhuan zhège chéngshì, yīnwèi zhèlǐ de rén hěn yǒuhǎo.', meaningVi: 'Tôi thích thành phố này vì con người ở đây rất thân thiện.' },
    ],
    commonMistakes: '❌ Chỉ chép nửa cặp khi cần cả câu dài dễ lạc: nhớ 因为 đi với 所以, KHÔNG đi với 但是',
    comparedWith: '因为…所以… (nhân quả) vs 虽然…但是… (nhượng bộ) vs 如果…就… (điều kiện) — ba cặp liên từ trụ cột HSK3.',
  },
  {
    level: 'HSK3',
    title: '虽然…但是… — tuy… nhưng…',
    structure: '虽然 + A, 但是/可是 + B',
    explanation:
      '<p>Cặp liên từ nhượng bộ "tuy... nhưng...":</p><ul><li>虽然很贵，但是质量很好。(Tuy đắt nhưng chất lượng rất tốt.)</li><li>虽然 có thể đứng trước hoặc sau chủ ngữ; vế sau hay thêm 还是/也: 虽然下雨，但是我还是要去。</li></ul>',
    examples: [
      { sentence: '虽然汉语很难，但是很有意思。', pronunciation: 'Suīrán Hànyǔ hěn nán, dànshì hěn yǒu yìsi.', meaningVi: 'Tuy tiếng Trung khó nhưng rất thú vị.' },
      { sentence: '虽然他很忙，但是每天都学习一个小时。', pronunciation: 'Suīrán tā hěn máng, dànshì měitiān dōu xuéxí yí ge xiǎoshí.', meaningVi: 'Tuy bận nhưng ngày nào anh ấy cũng học một tiếng.' },
      { sentence: '虽然已经十二点了，可是我还不想睡。', pronunciation: 'Suīrán yǐjīng shí’èr diǎn le, kěshì wǒ hái bù xiǎng shuì.', meaningVi: 'Tuy đã 12 giờ rồi nhưng tôi vẫn chưa muốn ngủ.' },
    ],
    commonMistakes: '❌ 虽然…所以… → ✅ 虽然…但是… (đừng trộn cặp nhân quả với cặp nhượng bộ)',
    comparedWith: 'Giống hệt "tuy…nhưng…" tiếng Việt, dùng được cả cặp — khác tiếng Anh chỉ chọn một trong although/but.',
  },
  {
    level: 'HSK3',
    title: '一边…一边… — vừa… vừa…',
    structure: '(Chủ ngữ) + 一边 + V1 + 一边 + V2',
    explanation:
      '<p><strong>一边…一边…</strong> diễn tả hai hành động đồng thời của cùng một người:</p><ul><li>他一边吃饭，一边看手机。(Anh ấy vừa ăn vừa xem điện thoại.)</li><li>Văn nói rút gọn thành 边…边…: 边走边聊。</li></ul>',
    examples: [
      { sentence: '我喜欢一边听音乐，一边做作业。', pronunciation: 'Wǒ xǐhuan yìbiān tīng yīnyuè, yìbiān zuò zuòyè.', meaningVi: 'Tôi thích vừa nghe nhạc vừa làm bài tập.' },
      { sentence: '他一边工作，一边学习汉语。', pronunciation: 'Tā yìbiān gōngzuò, yìbiān xuéxí Hànyǔ.', meaningVi: 'Anh ấy vừa đi làm vừa học tiếng Trung.' },
      { sentence: '我们一边喝茶，一边聊天吧。', pronunciation: 'Wǒmen yìbiān hē chá, yìbiān liáotiān ba.', meaningVi: 'Chúng ta vừa uống trà vừa trò chuyện nhé.' },
    ],
    commonMistakes: '❌ Hai chủ ngữ khác nhau: 我一边唱歌，他一边跳舞 → ✅ 一边…一边… chỉ dùng cho MỘT chủ ngữ',
    comparedWith: 'Tương đương ながら tiếng Nhật; 又…又… tả hai TÍNH CHẤT cùng lúc (又便宜又好吃) chứ không phải hành động.',
  },
  {
    level: 'HSK3',
    title: 'Bổ ngữ xu hướng — 来/去, 上来/下去…',
    structure: 'V + 来/去｜V + 上/下/进/出/回/过/起 + 来/去',
    explanation:
      '<p>Bổ ngữ xu hướng chỉ HƯỚNG của hành động so với người nói:</p><ul><li>Đơn: 来 (về phía người nói) / 去 (rời xa) — 进来！(Vào đây!) 出去！(Ra ngoài!)</li><li>Kép: 走上来 (đi lên đây), 跑出去 (chạy ra ngoài), 拿回来 (cầm về đây)</li><li>Tân ngữ nơi chốn chen giữa: 回家去, 进教室来</li></ul>',
    examples: [
      { sentence: '外面冷，快进来吧！', pronunciation: 'Wàimiàn lěng, kuài jìnlái ba!', meaningVi: 'Ngoài trời lạnh, mau vào đây đi!' },
      { sentence: '他从楼上走下来了。', pronunciation: 'Tā cóng lóu shàng zǒu xiàlái le.', meaningVi: 'Anh ấy từ trên lầu đi xuống rồi.' },
      { sentence: '请把这本书拿回去。', pronunciation: 'Qǐng bǎ zhè běn shū ná huíqù.', meaningVi: 'Xin hãy cầm cuốn sách này về.' },
    ],
    commonMistakes: '❌ 回去家 → ✅ 回家去 (tân ngữ nơi chốn đứng TRƯỚC 来/去)',
    comparedWith: '来/去 chọn theo vị trí NGƯỜI NÓI: 上来 = lên chỗ tôi đang đứng; 上去 = lên chỗ khác.',
  },
  {
    level: 'HSK3',
    title: 'Bổ ngữ khả năng — V得完 / V不完',
    structure: 'V + 得 + bổ ngữ (làm nổi)｜V + 不 + bổ ngữ (không nổi)',
    explanation:
      '<p>Chèn <strong>得/不</strong> giữa động từ và bổ ngữ kết quả/xu hướng để nói "làm NỔI hay không":</p><ul><li>听得懂 (nghe hiểu được) / 听不懂 (nghe không hiểu)</li><li>吃得完 (ăn hết nổi) / 吃不完 (ăn không hết)</li><li>买得起 (đủ tiền mua) / 买不起 (không đủ tiền mua); 来得及 / 来不及 (kịp / không kịp)</li></ul>',
    examples: [
      { sentence: '老师说得太快，我听不懂。', pronunciation: 'Lǎoshī shuō de tài kuài, wǒ tīng bu dǒng.', meaningVi: 'Cô giáo nói nhanh quá, tôi nghe không hiểu.' },
      { sentence: '这么多菜，我们吃不完。', pronunciation: 'Zhème duō cài, wǒmen chī bu wán.', meaningVi: 'Nhiều món thế này chúng ta ăn không hết đâu.' },
      { sentence: '别担心，还来得及。', pronunciation: 'Bié dānxīn, hái láidejí.', meaningVi: 'Đừng lo, vẫn còn kịp.' },
    ],
    commonMistakes: '❌ 我不能听懂 → ✅ 我听不懂 (khả năng của bản thân hành động dùng bổ ngữ khả năng, không dùng 不能)',
    comparedWith: '听不懂 (bản thân việc nghe-hiểu không nổi) vs 不能听 (không được phép nghe) — 能/可以 thiên về được phép/điều kiện.',
  },
  {
    level: 'HSK3',
    title: '越来越 / 越…越… — càng ngày càng…',
    structure: '越来越 + Adj｜越 + V/Adj + 越 + Adj',
    explanation:
      '<p>Diễn tả mức độ tăng dần:</p><ul><li><strong>越来越</strong>: theo thời gian — 天气越来越热。(Trời càng ngày càng nóng.)</li><li><strong>越 A 越 B</strong>: B tăng theo A — 雨越下越大。(Mưa càng lúc càng to.) 汉语越学越有意思。</li></ul>',
    examples: [
      { sentence: '你的汉语越来越好了！', pronunciation: 'Nǐ de Hànyǔ yuè lái yuè hǎo le!', meaningVi: 'Tiếng Trung của bạn càng ngày càng giỏi!' },
      { sentence: '东西越来越贵了。', pronunciation: 'Dōngxi yuè lái yuè guì le.', meaningVi: 'Đồ đạc càng ngày càng đắt.' },
      { sentence: '这本书我越看越喜欢。', pronunciation: 'Zhè běn shū wǒ yuè kàn yuè xǐhuan.', meaningVi: 'Cuốn sách này tôi càng đọc càng thích.' },
    ],
    commonMistakes: '❌ 越来越很好 → ✅ 越来越好 (không thêm 很 sau 越来越)',
    comparedWith: '越来越 = tăng theo thời gian; 越…越… = tăng theo một hành động/điều kiện khác; 更 = "hơn" một bậc khi so sánh.',
  },
];

// ============================ 4. CONVERSATION (40) ============================
const ZH_CONVERSATION: ConversationSeed[] = [
  { question: '你好！你叫什么名字？', answer: '你好！我叫阿英。', questionPronunciation: 'Nǐ hǎo! Nǐ jiào shénme míngzi?', answerPronunciation: 'Nǐ hǎo! Wǒ jiào Ā Yīng.', meaningVi: 'Q: Chào bạn! Bạn tên là gì? — A: Chào bạn! Mình tên là Anh.', note: '叫 + tên: cách giới thiệu tên phổ biến nhất.' },
  { question: '你是哪国人？', answer: '我是越南人。', questionPronunciation: 'Nǐ shì nǎ guó rén?', answerPronunciation: 'Wǒ shì Yuènánrén.', meaningVi: 'Q: Bạn là người nước nào? — A: Tôi là người Việt Nam.', note: '哪国人 = người nước nào.' },
  { question: '认识你很高兴！', answer: '认识你我也很高兴！', questionPronunciation: 'Rènshi nǐ hěn gāoxìng!', answerPronunciation: 'Rènshi nǐ wǒ yě hěn gāoxìng!', meaningVi: 'Q: Rất vui được quen bạn! — A: Mình cũng rất vui được quen bạn!', note: 'Câu xã giao khi mới làm quen.' },
  { question: '你今年多大？', answer: '我今年二十五岁。', questionPronunciation: 'Nǐ jīnnián duō dà?', answerPronunciation: 'Wǒ jīnnián èrshíwǔ suì.', meaningVi: 'Q: Năm nay bạn bao nhiêu tuổi? — A: Năm nay tôi 25 tuổi.', note: 'Hỏi trẻ em: 你几岁？; hỏi người lớn tuổi: 您多大年纪？' },
  { question: '你家有几口人？', answer: '我家有四口人：爸爸、妈妈、妹妹和我。', questionPronunciation: 'Nǐ jiā yǒu jǐ kǒu rén?', answerPronunciation: 'Wǒ jiā yǒu sì kǒu rén: bàba, māma, mèimei hé wǒ.', meaningVi: 'Q: Nhà bạn có mấy người? — A: Nhà tôi có 4 người: bố, mẹ, em gái và tôi.', note: 'Lượng từ 口 chuyên dùng đếm người trong gia đình.' },
  { question: '你做什么工作？', answer: '我是工程师，在软件公司工作。', questionPronunciation: 'Nǐ zuò shénme gōngzuò?', answerPronunciation: 'Wǒ shì gōngchéngshī, zài ruǎnjiàn gōngsī gōngzuò.', meaningVi: 'Q: Bạn làm nghề gì? — A: Tôi là kỹ sư, làm ở công ty phần mềm.', note: '在 + nơi + 工作 = làm việc tại...' },
  { question: '你会说汉语吗？', answer: '会一点儿，我正在学习。', questionPronunciation: 'Nǐ huì shuō Hànyǔ ma?', answerPronunciation: 'Huì yìdiǎnr, wǒ zhèngzài xuéxí.', meaningVi: 'Q: Bạn biết nói tiếng Trung không? — A: Biết một chút, tôi đang học.', note: '会 = biết (kỹ năng học được); 一点儿 = một chút.' },
  { question: '现在几点？', answer: '现在下午两点半。', questionPronunciation: 'Xiànzài jǐ diǎn?', answerPronunciation: 'Xiànzài xiàwǔ liǎng diǎn bàn.', meaningVi: 'Q: Bây giờ mấy giờ? — A: Bây giờ là 2 rưỡi chiều.', note: '两点 (2 giờ) dùng 两, không dùng 二.' },
  { question: '今天几月几号？', answer: '今天七月七号，星期二。', questionPronunciation: 'Jīntiān jǐ yuè jǐ hào?', answerPronunciation: 'Jīntiān qī yuè qī hào, xīngqī’èr.', meaningVi: 'Q: Hôm nay ngày mấy tháng mấy? — A: Hôm nay 7/7, thứ Ba.', note: 'Thứ tự thời gian: năm → tháng → ngày → thứ.' },
  { question: '你的生日是几月几号？', answer: '十月二十号。到时候请你吃饭！', questionPronunciation: 'Nǐ de shēngrì shì jǐ yuè jǐ hào?', answerPronunciation: 'Shí yuè èrshí hào. Dào shíhou qǐng nǐ chīfàn!', meaningVi: 'Q: Sinh nhật bạn ngày nào? — A: Ngày 20/10. Đến lúc đó mời bạn đi ăn!', note: '请 + người + V = mời ai làm gì.' },
  { question: '请问，地铁站在哪儿？', answer: '一直走，到红绿灯往左拐。', questionPronunciation: 'Qǐngwèn, dìtiě zhàn zài nǎr?', answerPronunciation: 'Yìzhí zǒu, dào hónglǜdēng wǎng zuǒ guǎi.', meaningVi: 'Q: Xin hỏi, ga tàu điện ngầm ở đâu? — A: Đi thẳng, đến đèn xanh đỏ rẽ trái.', note: '请问 mở đầu câu hỏi lịch sự; 往左/右拐 = rẽ trái/phải.' },
  { question: '从这儿到机场要多长时间？', answer: '坐出租车大概四十分钟。', questionPronunciation: 'Cóng zhèr dào jīchǎng yào duō cháng shíjiān?', answerPronunciation: 'Zuò chūzūchē dàgài sìshí fēnzhōng.', meaningVi: 'Q: Từ đây đến sân bay mất bao lâu? — A: Đi taxi khoảng 40 phút.', note: '从 A 到 B = từ A đến B; 大概 = khoảng chừng.' },
  { question: '师傅，去北京大学，多少钱？', answer: '打表，大概三十块。', questionPronunciation: 'Shīfu, qù Běijīng Dàxué, duōshao qián?', answerPronunciation: 'Dǎ biǎo, dàgài sānshí kuài.', meaningVi: 'Q: Bác tài, đến ĐH Bắc Kinh bao nhiêu tiền? — A: Tính theo đồng hồ, khoảng 30 tệ.', note: '师傅 = cách gọi tài xế/thợ; 打表 = bật đồng hồ tính tiền.' },
  { question: '这个多少钱？', answer: '三十五块。', questionPronunciation: 'Zhège duōshao qián?', answerPronunciation: 'Sānshíwǔ kuài.', meaningVi: 'Q: Cái này bao nhiêu tiền? — A: 35 tệ.', note: '块 (khẩu ngữ) = 元 (văn viết).' },
  { question: '太贵了！便宜一点儿吧。', answer: '好吧，给你三十块。', questionPronunciation: 'Tài guì le! Piányi yìdiǎnr ba.', answerPronunciation: 'Hǎo ba, gěi nǐ sānshí kuài.', meaningVi: 'Q: Đắt quá! Bớt chút đi. — A: Thôi được, lấy bạn 30 tệ.', note: 'Mặc cả: 太…了 = quá...; 便宜一点儿 = rẻ hơn chút.' },
  { question: '可以刷卡吗？', answer: '可以，也可以用手机支付。', questionPronunciation: 'Kěyǐ shuā kǎ ma?', answerPronunciation: 'Kěyǐ, yě kěyǐ yòng shǒujī zhīfù.', meaningVi: 'Q: Quẹt thẻ được không? — A: Được, dùng điện thoại thanh toán cũng được.', note: 'Ở Trung Quốc thanh toán qua điện thoại (支付宝/微信) cực phổ biến.' },
  { question: '我可以试试吗？', answer: '当然可以，试衣间在那边。', questionPronunciation: 'Wǒ kěyǐ shìshi ma?', answerPronunciation: 'Dāngrán kěyǐ, shìyījiān zài nàbiān.', meaningVi: 'Q: Tôi thử được không? — A: Tất nhiên được, phòng thử ở bên kia.', note: 'Lặp động từ (试试) làm nhẹ giọng = "thử một chút".' },
  { question: '有大一点儿的吗？', answer: '有，请稍等，我去拿。', questionPronunciation: 'Yǒu dà yìdiǎnr de ma?', answerPronunciation: 'Yǒu, qǐng shāo děng, wǒ qù ná.', meaningVi: 'Q: Có cỡ lớn hơn chút không? — A: Có, đợi chút, tôi đi lấy.', note: 'Adj + 一点儿 + 的 = cái ... hơn một chút.' },
  { question: '服务员，点菜！', answer: '好的，您想吃点儿什么？', questionPronunciation: 'Fúwùyuán, diǎn cài!', answerPronunciation: 'Hǎo de, nín xiǎng chī diǎnr shénme?', meaningVi: 'Q: Em ơi, gọi món! — A: Vâng, quý khách muốn dùng gì ạ?', note: '点菜 = gọi món; 您 = "ngài/quý khách" (kính trọng của 你).' },
  { question: '你们这儿有什么特色菜？', answer: '我们的烤鸭最有名。', questionPronunciation: 'Nǐmen zhèr yǒu shénme tèsè cài?', answerPronunciation: 'Wǒmen de kǎoyā zuì yǒumíng.', meaningVi: 'Q: Quán mình có món gì đặc sắc? — A: Vịt quay của chúng tôi nổi tiếng nhất.', note: '特色菜 = món đặc trưng của quán.' },
  { question: '你要喝点儿什么？', answer: '来一杯冰红茶吧。', questionPronunciation: 'Nǐ yào hē diǎnr shénme?', answerPronunciation: 'Lái yì bēi bīng hóngchá ba.', meaningVi: 'Q: Bạn uống gì? — A: Cho một ly hồng trà đá đi.', note: '来 + món = "cho tôi món..." (khẩu ngữ gọi món).' },
  { question: '我不能吃辣的。', answer: '没问题，我们做菜的时候不放辣椒。', questionPronunciation: 'Wǒ bù néng chī là de.', answerPronunciation: 'Méi wèntí, wǒmen zuò cài de shíhou bú fàng làjiāo.', meaningVi: 'Q: Tôi không ăn được cay. — A: Không vấn đề, khi nấu chúng tôi không cho ớt.', note: '辣的 = đồ cay; …的时候 = khi...' },
  { question: '服务员，买单！', answer: '好的，一共一百二十块。', questionPronunciation: 'Fúwùyuán, mǎidān!', answerPronunciation: 'Hǎo de, yígòng yìbǎi èrshí kuài.', meaningVi: 'Q: Em ơi, tính tiền! — A: Vâng, tổng cộng 120 tệ.', note: '买单/结账 = thanh toán; 一共 = tổng cộng.' },
  { question: '味道怎么样？', answer: '很好吃，就是有点儿咸。', questionPronunciation: 'Wèidào zěnmeyàng?', answerPronunciation: 'Hěn hǎochī, jiùshì yǒudiǎnr xián.', meaningVi: 'Q: Vị thế nào? — A: Rất ngon, có điều hơi mặn.', note: '有点儿 + Adj = hơi... (thường mang ý chê nhẹ).' },
  { question: '喂，你好，请问是王经理吗？', answer: '我就是，您是哪位？', questionPronunciation: 'Wéi, nǐ hǎo, qǐngwèn shì Wáng jīnglǐ ma?', answerPronunciation: 'Wǒ jiù shì, nín shì nǎ wèi?', meaningVi: 'Q: Alô, xin hỏi có phải giám đốc Vương không ạ? — A: Chính tôi đây, xin hỏi ai đấy ạ?', note: '喂 (wéi) = alô; 哪位 = vị nào (lịch sự).' },
  { question: '他现在不在，您要留言吗？', answer: '麻烦你让他给我回个电话。', questionPronunciation: 'Tā xiànzài bú zài, nín yào liúyán ma?', answerPronunciation: 'Máfan nǐ ràng tā gěi wǒ huí ge diànhuà.', meaningVi: 'Q: Anh ấy giờ không có ở đây, ông muốn nhắn gì không? — A: Phiền bạn bảo anh ấy gọi lại cho tôi.', note: '麻烦你… = phiền bạn...; 回电话 = gọi lại.' },
  { question: '今天天气怎么样？', answer: '天气预报说今天有雨，别忘了带伞。', questionPronunciation: 'Jīntiān tiānqì zěnmeyàng?', answerPronunciation: 'Tiānqì yùbào shuō jīntiān yǒu yǔ, bié wàng le dài sǎn.', meaningVi: 'Q: Thời tiết hôm nay thế nào? — A: Dự báo nói hôm nay có mưa, đừng quên mang ô.', note: '别忘了 + V = đừng quên làm gì.' },
  { question: '周末你有什么打算？', answer: '我打算和朋友去爬山。', questionPronunciation: 'Zhōumò nǐ yǒu shénme dǎsuàn?', answerPronunciation: 'Wǒ dǎsuàn hé péngyou qù páshān.', meaningVi: 'Q: Cuối tuần bạn có dự định gì? — A: Tôi định đi leo núi với bạn.', note: '打算 = dự định (vừa là danh từ vừa là động từ).' },
  { question: '晚上一起吃饭，好吗？', answer: '好啊！几点？在哪儿见？', questionPronunciation: 'Wǎnshang yìqǐ chīfàn, hǎo ma?', answerPronunciation: 'Hǎo a! Jǐ diǎn? Zài nǎr jiàn?', meaningVi: 'Q: Tối nay ăn cơm cùng nhau nhé? — A: Được đó! Mấy giờ? Gặp ở đâu?', note: '…，好吗？ = ... được không? (rủ rê nhẹ nhàng).' },
  { question: '不好意思，我今天有事，改天吧。', answer: '没关系，那下次再约。', questionPronunciation: 'Bù hǎoyìsi, wǒ jīntiān yǒu shì, gǎitiān ba.', answerPronunciation: 'Méi guānxi, nà xiàcì zài yuē.', meaningVi: 'Q: Ngại quá, hôm nay tôi có việc, để hôm khác nhé. — A: Không sao, vậy lần sau hẹn lại.', note: '改天 = đổi sang hôm khác — cách từ chối lịch sự.' },
  { question: '你怎么了？脸色不太好。', answer: '我有点儿不舒服，可能感冒了。', questionPronunciation: 'Nǐ zěnme le? Liǎnsè bú tài hǎo.', answerPronunciation: 'Wǒ yǒudiǎnr bù shūfu, kěnéng gǎnmào le.', meaningVi: 'Q: Bạn sao thế? Sắc mặt không tốt lắm. — A: Tôi hơi khó chịu, có lẽ bị cảm rồi.', note: '怎么了 = sao thế; 不舒服 = khó chịu trong người.' },
  { question: '你哪儿不舒服？', answer: '我头疼，还有点儿发烧。', questionPronunciation: 'Nǐ nǎr bù shūfu?', answerPronunciation: 'Wǒ tóuténg, hái yǒudiǎnr fāshāo.', meaningVi: 'Q: Bạn khó chịu ở đâu? — A: Tôi đau đầu, còn hơi sốt nữa.', note: 'Câu bác sĩ hay hỏi. 发烧 = sốt.' },
  { question: '多喝水，好好休息。', answer: '谢谢关心，我会的。', questionPronunciation: 'Duō hē shuǐ, hǎohǎo xiūxi.', answerPronunciation: 'Xièxie guānxīn, wǒ huì de.', meaningVi: 'Q: Uống nhiều nước, nghỉ ngơi cho tốt nhé. — A: Cảm ơn đã quan tâm, tôi sẽ vậy.', note: '多 + V = làm nhiều vào; 好好 + V = làm cho tử tế.' },
  { question: '你学汉语多长时间了？', answer: '学了半年了，越学越有意思。', questionPronunciation: 'Nǐ xué Hànyǔ duō cháng shíjiān le?', answerPronunciation: 'Xué le bàn nián le, yuè xué yuè yǒu yìsi.', meaningVi: 'Q: Bạn học tiếng Trung bao lâu rồi? — A: Học nửa năm rồi, càng học càng thấy thú vị.', note: 'V + 了 + thời lượng + 了 = đã làm được bao lâu (và vẫn tiếp tục).' },
  { question: '请再说一遍，我没听懂。', answer: '好的，我说慢一点儿。', questionPronunciation: 'Qǐng zài shuō yí biàn, wǒ méi tīng dǒng.', answerPronunciation: 'Hǎo de, wǒ shuō màn yìdiǎnr.', meaningVi: 'Q: Xin nói lại lần nữa, tôi chưa nghe hiểu. — A: Được, tôi nói chậm lại một chút.', note: 'Câu cứu cánh số 1 khi học: 再 + V + 一遍 = làm lại một lần.' },
  { question: '这个字怎么读？', answer: '这个字读 "xiè"，是感谢的谢。', questionPronunciation: 'Zhège zì zěnme dú?', answerPronunciation: 'Zhège zì dú "xiè", shì gǎnxiè de xiè.', meaningVi: 'Q: Chữ này đọc thế nào? — A: Chữ này đọc là "xiè", là chữ 谢 trong 感谢.', note: '怎么 + V = làm thế nào; người Trung giải thích chữ bằng từ ghép quen thuộc.' },
  { question: '"Cảm ơn" 用汉语怎么说？', answer: '用汉语说 "谢谢"。', questionPronunciation: '"Cảm ơn" yòng Hànyǔ zěnme shuō?', answerPronunciation: 'Yòng Hànyǔ shuō "xièxie".', meaningVi: 'Q: "Cảm ơn" tiếng Trung nói thế nào? — A: Tiếng Trung nói là "xièxie".', note: '用 + ngôn ngữ + 怎么说 = nói bằng... thế nào.' },
  { question: '你去过中国吗？', answer: '还没去过，明年想去北京看看。', questionPronunciation: 'Nǐ qù guo Zhōngguó ma?', answerPronunciation: 'Hái méi qù guo, míngnián xiǎng qù Běijīng kànkan.', meaningVi: 'Q: Bạn từng đến Trung Quốc chưa? — A: Chưa từng, năm sau muốn đi Bắc Kinh xem sao.', note: 'V + 过 hỏi kinh nghiệm; V + 看看 = thử xem.' },
  { question: '祝你生日快乐！', answer: '谢谢！大家一起吃蛋糕吧！', questionPronunciation: 'Zhù nǐ shēngrì kuàilè!', answerPronunciation: 'Xièxie! Dàjiā yìqǐ chī dàngāo ba!', meaningVi: 'Q: Chúc mừng sinh nhật bạn! — A: Cảm ơn! Mọi người cùng ăn bánh kem nào!', note: '祝你… = chúc bạn...; các câu chúc: 新年快乐, 一路平安.' },
  { question: '新年快乐，恭喜发财！', answer: '恭喜发财，红包拿来！', questionPronunciation: 'Xīnnián kuàilè, gōngxǐ fācái!', answerPronunciation: 'Gōngxǐ fācái, hóngbāo ná lái!', meaningVi: 'Q: Chúc mừng năm mới, phát tài phát lộc! — A: Cung hỷ phát tài, lì xì đâu đưa đây!', note: 'Câu đùa Tết kinh điển — 红包 = bao lì xì (hồng bao).' },
];

// ============================ 5. READING (8) ============================
const ZH_READING: ReadingSeed[] = [
  {
    title: '我的一天',
    content: '<p>我每天早上六点半起床。起床以后，我先洗脸刷牙，然后吃早饭。我常常喝一杯咖啡，吃一个面包。七点半我坐地铁去公司上班。</p><p>我们公司九点上班，下午六点下班。中午我和同事一起在公司附近吃午饭。晚上回家以后，我先做晚饭，吃完饭学习一个小时汉语，十一点左右睡觉。</p>',
    translation: '<p>Mỗi sáng tôi dậy lúc 6 rưỡi. Sau khi dậy, tôi rửa mặt đánh răng trước, sau đó ăn sáng. Tôi thường uống một cốc cà phê, ăn một cái bánh mì. 7 rưỡi tôi đi tàu điện ngầm đến công ty làm việc.</p><p>Công ty tôi 9 giờ vào làm, 6 giờ chiều tan làm. Buổi trưa tôi ăn cùng đồng nghiệp ở gần công ty. Tối về nhà, tôi nấu cơm trước, ăn xong học tiếng Trung một tiếng, khoảng 11 giờ đi ngủ.</p>',
  },
  {
    title: '我的家',
    content: '<p>我家有四口人：爸爸、妈妈、妹妹和我。爸爸是医生，他工作很忙。妈妈是老师，她做的菜非常好吃。妹妹今年上大学，她学的是经济。</p><p>我们家住在河内，房子不大，但是很舒服。周末我们常常一起吃饭、看电视、聊天。我爱我的家。</p>',
    translation: '<p>Nhà tôi có 4 người: bố, mẹ, em gái và tôi. Bố là bác sĩ, công việc rất bận. Mẹ là giáo viên, mẹ nấu ăn cực ngon. Em gái năm nay học đại học, chuyên ngành kinh tế.</p><p>Nhà tôi ở Hà Nội, không to nhưng rất thoải mái. Cuối tuần cả nhà thường cùng ăn cơm, xem TV, trò chuyện. Tôi yêu gia đình tôi.</p>',
  },
  {
    title: '去市场买菜',
    content: '<p>星期六早上，我和妈妈去市场买菜。市场里人很多，东西也很多：有蔬菜、水果、肉、鱼，什么都有。</p><p>妈妈买了两斤西红柿、一斤鸡蛋和一条鱼。我想吃苹果，妈妈就给我买了三个大苹果，一共十五块钱。卖水果的阿姨很热情，还送了我们两个橘子。</p>',
    translation: '<p>Sáng thứ Bảy, tôi cùng mẹ đi chợ mua đồ ăn. Trong chợ rất đông người, hàng hóa cũng nhiều: có rau, hoa quả, thịt, cá — cái gì cũng có.</p><p>Mẹ mua 2 cân cà chua, 1 cân trứng gà và một con cá. Tôi muốn ăn táo nên mẹ mua cho tôi 3 quả táo to, tổng cộng 15 tệ. Cô bán hoa quả rất nhiệt tình, còn tặng chúng tôi 2 quả quýt.</p>',
  },
  {
    title: '坐高铁去上海',
    content: '<p>上个月我去中国旅游。我先到北京，在北京玩了三天，然后坐高铁去上海。</p><p>中国的高铁又快又方便，从北京到上海一千多公里，只要四个多小时。车上很干净，也很安静。我一边看窗外的风景，一边听音乐，很快就到上海了。上海是一个很现代的城市，晚上的外滩特别漂亮。</p>',
    translation: '<p>Tháng trước tôi đi du lịch Trung Quốc. Tôi đến Bắc Kinh trước, chơi ở Bắc Kinh 3 ngày, sau đó đi tàu cao tốc đến Thượng Hải.</p><p>Tàu cao tốc Trung Quốc vừa nhanh vừa tiện, từ Bắc Kinh đến Thượng Hải hơn 1.000 km mà chỉ mất hơn 4 tiếng. Trên tàu rất sạch và yên tĩnh. Tôi vừa ngắm phong cảnh ngoài cửa sổ vừa nghe nhạc, rất nhanh đã đến Thượng Hải. Thượng Hải là thành phố rất hiện đại, bến Thượng Hải (Bund) buổi tối đẹp đặc biệt.</p>',
  },
  {
    title: '中国的春节',
    content: '<p>春节是中国最重要的节日，就像越南的Tết一样。春节以前，人们打扫房子，买年货，贴春联。</p><p>除夕晚上，全家人一起吃年夜饭，看春节晚会。饺子是北方人年夜饭上最重要的食物。十二点的时候，很多地方放鞭炮和烟花。春节的时候，大人给孩子红包，叫"压岁钱"。人们见面说"新年快乐"、"恭喜发财"。</p>',
    translation: '<p>Xuân Tiết (Tết Nguyên đán) là ngày lễ quan trọng nhất Trung Quốc, giống Tết của Việt Nam. Trước Tết, người ta dọn nhà, sắm Tết, dán câu đối xuân.</p><p>Đêm giao thừa, cả nhà cùng ăn bữa cơm tất niên, xem gala Xuân Tiết. Sủi cảo là món quan trọng nhất trong bữa tất niên của người miền Bắc. Đến 12 giờ, nhiều nơi đốt pháo và bắn pháo hoa. Dịp Tết, người lớn lì xì trẻ con, gọi là "tiền mừng tuổi". Mọi người gặp nhau chúc "Năm mới vui vẻ", "Cung hỷ phát tài".</p>',
  },
  {
    title: '我喜欢的中国菜',
    content: '<p>中国菜很有名，每个地方的菜都不一样。四川菜很辣，广东菜比较清淡，北京的烤鸭非常有名。</p><p>我最喜欢吃火锅。天气冷的时候，和朋友一起吃火锅，太舒服了！你可以把肉、蔬菜、豆腐放进锅里，想吃什么就放什么。我不太能吃辣，所以每次都点鸳鸯锅——一半辣，一半不辣。</p>',
    translation: '<p>Món ăn Trung Quốc rất nổi tiếng, mỗi vùng một khác. Món Tứ Xuyên rất cay, món Quảng Đông thanh đạm hơn, vịt quay Bắc Kinh cực kỳ nổi tiếng.</p><p>Tôi thích nhất là lẩu. Trời lạnh mà ăn lẩu cùng bạn bè thì thích vô cùng! Bạn có thể cho thịt, rau, đậu phụ vào nồi — muốn ăn gì thì cho nấy. Tôi không ăn cay giỏi lắm nên lần nào cũng gọi nồi "uyên ương" — một nửa cay, một nửa không cay.</p>',
  },
  {
    title: '手机支付',
    content: '<p>在中国，几乎没有人带现金，大家都用手机支付。买东西、坐车、吃饭，都可以用微信或者支付宝。</p><p>手机支付很方便：你只要扫一下二维码，几秒钟就付好钱了。连市场里卖菜的阿姨也用二维码收钱。很多外国人刚到中国的时候不习惯，但是用过以后都说："太方便了，我再也不想用现金了！"</p>',
    translation: '<p>Ở Trung Quốc hầu như không ai mang tiền mặt, mọi người đều thanh toán bằng điện thoại. Mua đồ, đi xe, ăn uống đều dùng được WeChat hoặc Alipay.</p><p>Thanh toán di động rất tiện: chỉ cần quét mã QR, vài giây là trả xong tiền. Đến cô bán rau ngoài chợ cũng nhận tiền bằng mã QR. Nhiều người nước ngoài mới đến Trung Quốc chưa quen, nhưng dùng rồi ai cũng nói: "Tiện quá, tôi không muốn dùng tiền mặt nữa!"</p>',
  },
  {
    title: '学汉语的方法',
    content: '<p>很多人问我："汉语这么难，你是怎么学的？"我的方法很简单：每天学一点儿，坚持很重要。</p><p>我每天早上背十个生词，晚上看半个小时中国电视剧。看电视剧的时候，我一边看一边跟着说。周末我和中国朋友聊天，说错了也没关系，他们会帮我改。我还喜欢听中文歌，唱歌的时候发音会越来越好。学外语没有捷径，但是只要每天坚持，一定会进步。</p>',
    translation: '<p>Nhiều người hỏi tôi: "Tiếng Trung khó thế, bạn học kiểu gì?". Phương pháp của tôi rất đơn giản: mỗi ngày học một ít, kiên trì là quan trọng nhất.</p><p>Mỗi sáng tôi học thuộc 10 từ mới, tối xem nửa tiếng phim truyền hình Trung Quốc. Khi xem phim, tôi vừa xem vừa nói theo. Cuối tuần tôi trò chuyện với bạn Trung Quốc, nói sai cũng không sao, họ sẽ sửa giúp. Tôi còn thích nghe nhạc Hoa, hát theo thì phát âm sẽ ngày càng tốt. Học ngoại ngữ không có đường tắt, nhưng chỉ cần kiên trì mỗi ngày, chắc chắn sẽ tiến bộ.</p>',
  },
];

// ============================ 6. QNA (10) ============================
const ZH_QNA: QnaSeed[] = [
  { question: '汉语的声调真的那么重要吗？', answer: '非常重要！声调不同，意思完全不同。比如 mǎi（买）是 "mua"，mài（卖）是 "bán"。好消息是越南语也有声调，所以越南人学声调比西方人快得多。', pronunciation: 'Fēicháng zhòngyào! Shēngdiào bùtóng, yìsi wánquán bùtóng.', meaningVi: 'Cực kỳ quan trọng! Thanh điệu khác nhau, nghĩa khác hẳn: mǎi (买) = mua, mài (卖) = bán. Tin vui: tiếng Việt cũng có thanh điệu nên người Việt học nhanh hơn người phương Tây nhiều.' },
  { question: '简体字和繁体字有什么区别？', answer: '简体字笔画少，在中国大陆和新加坡使用；繁体字笔画多，在台湾、香港使用。初学者建议先学简体字。', pronunciation: 'Jiǎntǐzì bǐhuà shǎo, zài Zhōngguó dàlù hé Xīnjiāpō shǐyòng; fántǐzì bǐhuà duō, zài Táiwān, Xiānggǎng shǐyòng.', meaningVi: 'Chữ giản thể ít nét, dùng ở Trung Quốc đại lục và Singapore; chữ phồn thể nhiều nét, dùng ở Đài Loan, Hồng Kông. Người mới học nên bắt đầu với giản thể.' },
  { question: '要记多少个汉字才能看懂报纸？', answer: '认识大约2,500个常用字就能看懂90%以上的日常文章。HSK3要求600个词，HSK6要求5,000个词。', pronunciation: 'Rènshi dàyuē liǎngqiān wǔbǎi ge chángyòng zì jiù néng kàndǒng bǎi fēn zhī jiǔshí yǐshàng de rìcháng wénzhāng.', meaningVi: 'Biết khoảng 2.500 chữ thông dụng là đọc hiểu hơn 90% văn bản hàng ngày. HSK3 yêu cầu 600 từ, HSK6 yêu cầu 5.000 từ.' },
  { question: '越南人学汉语有什么优势？', answer: '优势很大！越南语里有大量汉越词，比如 "chú ý" 就是 注意 (zhùyì)，"đại học" 就是 大学 (dàxué)。发音有声调也是很大的优势。', pronunciation: 'Yōushì hěn dà! Yuènányǔ li yǒu dàliàng Hàn-Yuè cí.', meaningVi: 'Lợi thế rất lớn! Tiếng Việt có lượng từ Hán-Việt khổng lồ: "chú ý" = 注意 (zhùyì), "đại học" = 大学 (dàxué). Đã quen thanh điệu cũng là lợi thế lớn.' },
  { question: '"你好" 以外还有什么打招呼的方式？', answer: '中国人常用 "吃了吗？"（ăn chưa?）、"去哪儿？"（đi đâu đấy?）打招呼，跟越南人很像。跟朋友也可以说 "嗨" 或者直接叫名字。', pronunciation: 'Zhōngguórén chángyòng "chī le ma?", "qù nǎr?" dǎ zhāohu.', meaningVi: 'Ngoài "nǐ hǎo", người Trung hay chào bằng "Ăn chưa?" (吃了吗), "Đi đâu đấy?" (去哪儿) — giống hệt người Việt. Với bạn bè có thể nói "hāi" hoặc gọi thẳng tên.' },
  { question: '为什么一个字有很多个读音？', answer: '这叫多音字。比如 "行" 读 xíng（đi, được）也读 háng（hàng, ngành）。要根据词语记读音，不要只记单字。', pronunciation: 'Zhè jiào duōyīnzì. Bǐrú "行" dú xíng yě dú háng.', meaningVi: 'Đó là chữ đa âm (đa âm tự). Ví dụ 行 đọc xíng (đi; được) và cũng đọc háng (hàng, ngành). Hãy nhớ cách đọc theo TỪ, đừng học chữ đơn lẻ.' },
  { question: '普通话和方言有什么关系？', answer: '普通话是标准语，全国都用。但是各地还有粤语、上海话、四川话等方言，发音差别很大。学好普通话就能在全中国交流。', pronunciation: 'Pǔtōnghuà shì biāozhǔnyǔ, quánguó dōu yòng.', meaningVi: 'Tiếng phổ thông (Putonghua) là ngôn ngữ chuẩn toàn quốc. Các vùng còn có phương ngữ như tiếng Quảng, tiếng Thượng Hải, tiếng Tứ Xuyên — phát âm khác nhau rất xa. Học tốt tiếng phổ thông là giao tiếp được khắp Trung Quốc.' },
  { question: 'HSK考试有几个等级？', answer: 'HSK有六个等级，HSK1最简单（150个词），HSK6最难（5,000个词）。2021年以后有新的三等九级标准，但是很多学校还用旧的六级。', pronunciation: 'HSK yǒu liù ge děngjí, HSK yī zuì jiǎndān, HSK liù zuì nán.', meaningVi: 'HSK có 6 cấp: HSK1 dễ nhất (150 từ), HSK6 khó nhất (5.000 từ). Từ 2021 có chuẩn mới 3 bậc 9 cấp, nhưng nhiều trường vẫn dùng thang 6 cấp cũ.' },
  { question: '怎么用电脑和手机打汉字？', answer: '最常用的是拼音输入法：打 "nihao" 就出来 "你好"。所以学好拼音特别重要，会拼音就会打字。', pronunciation: 'Zuì chángyòng de shì pīnyīn shūrùfǎ: dǎ "nihao" jiù chūlái "nǐ hǎo".', meaningVi: 'Phổ biến nhất là bộ gõ pinyin: gõ "nihao" là ra 你好. Vì vậy học chắc pinyin cực quan trọng — biết pinyin là gõ được chữ Hán.' },
  { question: '学汉语，先学说话还是先学写字？', answer: '建议先学拼音和说话，同时认字。写字可以慢慢来，因为现在大部分人都用手机打字，手写的机会不多。', pronunciation: 'Jiànyì xiān xué pīnyīn hé shuōhuà, tóngshí rènzì.', meaningVi: 'Nên học pinyin và nói trước, đồng thời tập NHẬN MẶT chữ. Viết tay có thể học từ từ — thời nay đa số gõ điện thoại, ít khi phải viết tay.' },
];

// ============================ 7. LISTENING ============================
// Intentionally empty: transcripts must match real videos exactly, so
// curate them by hand in /admin/language (Listening tab) instead of
// seeding guessed content against real YouTube URLs.
const ZH_LISTENING: ListeningSeed[] = [];

// ============================ SEED HELPERS ============================
async function seedAlphabet(languageId: number, groups: AlphaGroup[]): Promise<void> {
  const agg = await prisma.langAlphabetGroup.aggregate({ where: { languageId }, _max: { order: true } });
  const orderBase = (agg._max.order ?? -1) + 1;

  for (let gi = 0; gi < groups.length; gi++) {
    const g = groups[gi];
    let group = await prisma.langAlphabetGroup.findFirst({ where: { languageId, name: g.name } });
    if (group) {
      summary.alphabetGroups.skipped++;
    } else {
      group = await prisma.langAlphabetGroup.create({
        data: { languageId, name: g.name, description: g.description, order: orderBase + gi },
      });
      summary.alphabetGroups.created++;
    }
    for (let ii = 0; ii < g.items.length; ii++) {
      const it = g.items[ii];
      const existing = await prisma.langAlphabetItem.findFirst({
        where: { groupId: group.id, character: it.character },
      });
      if (existing) {
        summary.alphabetItems.skipped++;
        continue;
      }
      await prisma.langAlphabetItem.create({
        data: {
          groupId: group.id,
          character: it.character,
          romanization: it.romanization,
          note: it.note ?? null,
          order: ii,
        },
      });
      summary.alphabetItems.created++;
    }
  }
}

async function seedVocab(languageId: number, categories: CategorySeed[]): Promise<void> {
  const maxCat = await prisma.langVocabCategory.aggregate({ where: { languageId }, _max: { order: true } });
  let catOrder = (maxCat._max.order ?? -1) + 1;

  for (const cat of categories) {
    let category = await prisma.langVocabCategory.findFirst({ where: { languageId, name: cat.name } });
    if (category) {
      summary.categories.skipped++;
    } else {
      // A category can be absent for two reasons: a fresh database (create it),
      // or it was deliberately MERGED into the level-tagged catalogue and its
      // shell deleted. Recreating it in the second case resurrects the legacy
      // set on every deploy and duplicates every word it carried — which is
      // exactly what happened the night the merge ran. If most of its words
      // already live elsewhere in this language, it was merged, not missing.
      const already = await prisma.langVocabWord.count({
        where: { category: { languageId }, word: { in: cat.words.map((w) => w.word) } },
      });
      if (already >= Math.ceil(cat.words.length / 2)) {
        summary.categories.skipped++;
        continue;
      }
      category = await prisma.langVocabCategory.create({
        data: { languageId, name: cat.name, icon: cat.icon, order: catOrder++ },
      });
      summary.categories.created++;
    }
    for (let wi = 0; wi < cat.words.length; wi++) {
      const w = cat.words[wi];
      const existingWord = await prisma.langVocabWord.findFirst({
        where: { categoryId: category.id, word: w.word },
      });
      if (existingWord) {
        summary.words.skipped++;
        continue;
      }
      await prisma.langVocabWord.create({
        data: {
          categoryId: category.id,
          word: w.word,
          meaningVi: w.meaningVi,
          exampleSentence: w.exampleSentence,
          exampleMeaning: w.exampleMeaning,
          note: w.note,
          order: wi,
          ...(w.pron
            ? { pronunciations: { create: [{ type: 'pinyin', value: w.pron, order: 0 }] } }
            : {}),
        },
      });
      summary.words.created++;
      if (w.pron) summary.pronunciations.created++;
    }
  }
}

async function seedGrammar(languageId: number, points: GrammarSeed[]): Promise<void> {
  const agg = await prisma.langGrammarPoint.aggregate({ where: { languageId }, _max: { order: true } });
  let order = (agg._max.order ?? -1) + 1;

  for (const g of points) {
    const existing = await prisma.langGrammarPoint.findFirst({ where: { languageId, title: g.title } });
    if (existing) {
      summary.grammar.skipped++;
      continue;
    }
    await prisma.langGrammarPoint.create({
      data: {
        languageId,
        level: g.level,
        title: g.title,
        structure: g.structure,
        explanation: g.explanation as Prisma.InputJsonValue,
        examples: g.examples as unknown as Prisma.InputJsonValue,
        commonMistakes: g.commonMistakes,
        comparedWith: g.comparedWith,
        order: order++,
      },
    });
    summary.grammar.created++;
  }
}

async function seedListening(languageId: number, items: ListeningSeed[]): Promise<void> {
  const agg = await prisma.langListeningItem.aggregate({ where: { languageId }, _max: { order: true } });
  let order = (agg._max.order ?? -1) + 1;

  for (const item of items) {
    const existing = await prisma.langListeningItem.findFirst({ where: { languageId, title: item.title } });
    if (existing) {
      summary.listening.skipped++;
      continue;
    }
    await prisma.langListeningItem.create({
      data: {
        languageId,
        title: item.title,
        sourceType: 'YOUTUBE',
        youtubeUrl: item.youtubeUrl,
        transcript: item.transcript,
        translation: item.translation,
        questions: item.questions as unknown as Prisma.InputJsonValue,
        order: order++,
      },
    });
    summary.listening.created++;
  }
}

async function seedConversation(languageId: number, items: ConversationSeed[]): Promise<void> {
  const agg = await prisma.langConversationItem.aggregate({ where: { languageId }, _max: { order: true } });
  let order = (agg._max.order ?? -1) + 1;

  for (const c of items) {
    const existing = await prisma.langConversationItem.findFirst({ where: { languageId, question: c.question } });
    if (existing) {
      summary.conversation.skipped++;
      continue;
    }
    await prisma.langConversationItem.create({
      data: {
        languageId,
        question: c.question,
        answer: c.answer,
        questionPronunciation: c.questionPronunciation,
        answerPronunciation: c.answerPronunciation,
        meaningVi: c.meaningVi,
        note: c.note,
        order: order++,
      },
    });
    summary.conversation.created++;
  }
}

async function seedReading(languageId: number, items: ReadingSeed[]): Promise<void> {
  const agg = await prisma.langReadingArticle.aggregate({ where: { languageId }, _max: { order: true } });
  let order = (agg._max.order ?? -1) + 1;

  for (const r of items) {
    const existing = await prisma.langReadingArticle.findFirst({ where: { languageId, title: r.title } });
    if (existing) {
      summary.reading.skipped++;
      continue;
    }
    await prisma.langReadingArticle.create({
      data: {
        languageId,
        title: r.title,
        type: 'TEXT',
        content: r.content as Prisma.InputJsonValue,
        translation: r.translation as Prisma.InputJsonValue,
        order: order++,
      },
    });
    summary.reading.created++;
  }
}

async function seedQna(languageId: number, items: QnaSeed[]): Promise<void> {
  const agg = await prisma.langQnaItem.aggregate({ where: { languageId }, _max: { order: true } });
  let order = (agg._max.order ?? -1) + 1;

  for (const q of items) {
    const existing = await prisma.langQnaItem.findFirst({ where: { languageId, question: q.question } });
    if (existing) {
      summary.qna.skipped++;
      continue;
    }
    await prisma.langQnaItem.create({
      data: {
        languageId,
        question: q.question,
        answer: q.answer,
        pronunciation: q.pronunciation,
        meaningVi: q.meaningVi,
        order: order++,
      },
    });
    summary.qna.created++;
  }
}

// ============================ MAIN ============================
async function main(): Promise<void> {
  let language = await prisma.language.findUnique({ where: { code: 'zh' } });
  if (language) {
    summary.languages.skipped++;
  } else {
    const agg = await prisma.language.aggregate({ _max: { order: true } });
    language = await prisma.language.create({
      data: {
        name: 'Tiếng Trung',
        nameEn: 'Chinese',
        code: 'zh',
        flagEmoji: '🇨🇳',
        order: (agg._max.order ?? -1) + 1,
        isActive: true,
      },
    });
    summary.languages.created++;
  }

  console.log(`🌱 Seeding Chinese content (language id=${language.id})...`);
  await seedAlphabet(language.id, ZH_ALPHABET);
  await seedVocab(language.id, ZH_VOCAB);
  await seedGrammar(language.id, ZH_GRAMMAR);
  await seedListening(language.id, ZH_LISTENING);
  await seedConversation(language.id, ZH_CONVERSATION);
  await seedReading(language.id, ZH_READING);
  await seedQna(language.id, ZH_QNA);

  console.log('✅ ZH seed complete:');
  for (const [section, s] of Object.entries(summary)) {
    const skipped = 'skipped' in s ? ` (skipped ${(s as { skipped: number }).skipped})` : '';
    console.log(`   ${section}: +${s.created}${skipped}`);
  }
}

main()
  .catch((err) => {
    console.error('❌ ZH seed failed:', err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
