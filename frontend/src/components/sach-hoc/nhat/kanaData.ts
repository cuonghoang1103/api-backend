/**
 * Dữ liệu bảng chữ cái cho bộ luyện kana (LuyenKana.tsx) — hiragana + katakana, chia hàng như sách.
 * Mỗi chữ: kana · romaji Hepburn (đáp án chính) · các cách gõ khác vẫn chấm ĐÚNG (Kunrei/Nihon-shiki
 * kiểu si/ti/tu/hu, nn cho ん) — người học quen bàn phím IME gõ "si" ra し thì không bị bắt lỗi oan.
 * Nhóm `nham` = các chữ dễ nhầm hình với chữ này: làm phương án nhiễu cho câu chọn chữ.
 */
export type KanaChu = { k: string; r: string; khac?: string[] };
export type KanaHang = { id: string; ten: string; nhom: 'co-ban' | 'duc' | 'ghep'; chu: KanaChu[] };

const H = (k: string, r: string, ...khac: string[]): KanaChu => (khac.length ? { k, r, khac } : { k, r });

export const HIRAGANA: KanaHang[] = [
  { id: 'h-a', ten: 'あ', nhom: 'co-ban', chu: [H('あ', 'a'), H('い', 'i'), H('う', 'u'), H('え', 'e'), H('お', 'o')] },
  { id: 'h-ka', ten: 'か', nhom: 'co-ban', chu: [H('か', 'ka'), H('き', 'ki'), H('く', 'ku'), H('け', 'ke'), H('こ', 'ko')] },
  { id: 'h-sa', ten: 'さ', nhom: 'co-ban', chu: [H('さ', 'sa'), H('し', 'shi', 'si'), H('す', 'su'), H('せ', 'se'), H('そ', 'so')] },
  { id: 'h-ta', ten: 'た', nhom: 'co-ban', chu: [H('た', 'ta'), H('ち', 'chi', 'ti'), H('つ', 'tsu', 'tu'), H('て', 'te'), H('と', 'to')] },
  { id: 'h-na', ten: 'な', nhom: 'co-ban', chu: [H('な', 'na'), H('に', 'ni'), H('ぬ', 'nu'), H('ね', 'ne'), H('の', 'no')] },
  { id: 'h-ha', ten: 'は', nhom: 'co-ban', chu: [H('は', 'ha'), H('ひ', 'hi'), H('ふ', 'fu', 'hu'), H('へ', 'he'), H('ほ', 'ho')] },
  { id: 'h-ma', ten: 'ま', nhom: 'co-ban', chu: [H('ま', 'ma'), H('み', 'mi'), H('む', 'mu'), H('め', 'me'), H('も', 'mo')] },
  { id: 'h-ya', ten: 'や', nhom: 'co-ban', chu: [H('や', 'ya'), H('ゆ', 'yu'), H('よ', 'yo')] },
  { id: 'h-ra', ten: 'ら', nhom: 'co-ban', chu: [H('ら', 'ra'), H('り', 'ri'), H('る', 'ru'), H('れ', 're'), H('ろ', 'ro')] },
  { id: 'h-wa', ten: 'わ', nhom: 'co-ban', chu: [H('わ', 'wa'), H('を', 'wo', 'o'), H('ん', 'n', 'nn')] },
  { id: 'h-ga', ten: 'が', nhom: 'duc', chu: [H('が', 'ga'), H('ぎ', 'gi'), H('ぐ', 'gu'), H('げ', 'ge'), H('ご', 'go')] },
  { id: 'h-za', ten: 'ざ', nhom: 'duc', chu: [H('ざ', 'za'), H('じ', 'ji', 'zi'), H('ず', 'zu'), H('ぜ', 'ze'), H('ぞ', 'zo')] },
  { id: 'h-da', ten: 'だ', nhom: 'duc', chu: [H('だ', 'da'), H('ぢ', 'ji', 'di'), H('づ', 'zu', 'du'), H('で', 'de'), H('ど', 'do')] },
  { id: 'h-ba', ten: 'ば', nhom: 'duc', chu: [H('ば', 'ba'), H('び', 'bi'), H('ぶ', 'bu'), H('べ', 'be'), H('ぼ', 'bo')] },
  { id: 'h-pa', ten: 'ぱ', nhom: 'duc', chu: [H('ぱ', 'pa'), H('ぴ', 'pi'), H('ぷ', 'pu'), H('ぺ', 'pe'), H('ぽ', 'po')] },
  { id: 'h-kya', ten: 'きゃ', nhom: 'ghep', chu: [H('きゃ', 'kya'), H('きゅ', 'kyu'), H('きょ', 'kyo')] },
  { id: 'h-sha', ten: 'しゃ', nhom: 'ghep', chu: [H('しゃ', 'sha', 'sya'), H('しゅ', 'shu', 'syu'), H('しょ', 'sho', 'syo')] },
  { id: 'h-cha', ten: 'ちゃ', nhom: 'ghep', chu: [H('ちゃ', 'cha', 'tya', 'cya'), H('ちゅ', 'chu', 'tyu', 'cyu'), H('ちょ', 'cho', 'tyo', 'cyo')] },
  { id: 'h-nya', ten: 'にゃ', nhom: 'ghep', chu: [H('にゃ', 'nya'), H('にゅ', 'nyu'), H('にょ', 'nyo')] },
  { id: 'h-hya', ten: 'ひゃ', nhom: 'ghep', chu: [H('ひゃ', 'hya'), H('ひゅ', 'hyu'), H('ひょ', 'hyo')] },
  { id: 'h-mya', ten: 'みゃ', nhom: 'ghep', chu: [H('みゃ', 'mya'), H('みゅ', 'myu'), H('みょ', 'myo')] },
  { id: 'h-rya', ten: 'りゃ', nhom: 'ghep', chu: [H('りゃ', 'rya'), H('りゅ', 'ryu'), H('りょ', 'ryo')] },
  { id: 'h-gya', ten: 'ぎゃ', nhom: 'ghep', chu: [H('ぎゃ', 'gya'), H('ぎゅ', 'gyu'), H('ぎょ', 'gyo')] },
  { id: 'h-ja', ten: 'じゃ', nhom: 'ghep', chu: [H('じゃ', 'ja', 'zya', 'jya'), H('じゅ', 'ju', 'zyu', 'jyu'), H('じょ', 'jo', 'zyo', 'jyo')] },
  { id: 'h-bya', ten: 'びゃ', nhom: 'ghep', chu: [H('びゃ', 'bya'), H('びゅ', 'byu'), H('びょ', 'byo')] },
  { id: 'h-pya', ten: 'ぴゃ', nhom: 'ghep', chu: [H('ぴゃ', 'pya'), H('ぴゅ', 'pyu'), H('ぴょ', 'pyo')] },
];

/** Katakana: cùng âm, chữ đổi theo bảng chuyển hiragana → katakana (U+3041..3096 → +0x60). */
const sangKata = (s: string) => s.replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60));
export const KATAKANA: KanaHang[] = HIRAGANA.map((h) => ({
  ...h,
  id: h.id.replace(/^h-/, 'k-'),
  ten: sangKata(h.ten),
  chu: h.chu.map((c) => ({ ...c, k: sangKata(c.k) })),
}));

/** Cặp chữ trông giống nhau — người mới hay nhầm nhất (đưa vào phương án nhiễu + bảng "chữ dễ nhầm"). */
export const DE_NHAM: string[][] = [
  ['さ', 'ち'], ['き', 'さ'], ['ぬ', 'め'], ['ね', 'れ', 'わ'], ['る', 'ろ'], ['は', 'ほ', 'け'], ['い', 'り'],
  ['こ', 'に'], ['あ', 'お', 'め'], ['う', 'つ'], ['く', 'へ'], ['た', 'な'], ['ま', 'も'], ['そ', 'ろ'],
  ['シ', 'ツ'], ['ソ', 'ン'], ['ク', 'ケ', 'タ'], ['ウ', 'ワ', 'フ'], ['コ', 'ユ', 'ロ'], ['チ', 'テ'], ['ナ', 'メ', 'ノ'],
  ['ヌ', 'ス'], ['マ', 'ム'], ['ア', 'マ'], ['セ', 'サ'], ['ラ', 'ヲ'], ['エ', 'ニ'], ['ル', 'レ'], ['ハ', 'ル'],
];

/** Mẹo nhớ hình chữ (ngắn, tiếng Việt) — hiện khi trả lời SAI để lần sau nhớ. */
export const MEO: Record<string, string> = {
  あ: 'Chữ A có chữ thập + vòng tròn — như "Ăn táo" (a).', い: 'Hai que đứng song song — "i" như hai chiếc đũa.',
  う: 'Dấu gạch trên + đường cong — như cái tai nghe "u".', え: 'Như người đang nhảy: "e" ơ vui!', お: 'Giống あ nhưng có chấm bên phải — "o".',
  か: 'Có nét móc + chấm như người cầm cái cưa — "ka".', き: 'Giống chìa khoá (key) — "ki", hai nét ngang.', く: 'Mỏ chim cu "ku" mở ra.',
  け: 'Một cột bên trái + chữ thập bên phải — thùng (keg) "ke".', こ: 'Hai nét ngang như hai con cá "ko".',
  さ: 'Phần dưới cong như chữ "c" — ngược chiều với ち. Đọc "sa".', し: 'Lưỡi câu — "shi".', す: 'Có vòng nút như sợi dây "su".', せ: 'Như cái miệng nói "se".', そ: 'Đường zic-zac như dòng nước "so".',
  た: 'Như chữ "ta" viết tay: t + a.', ち: 'Phần dưới phình sang phải như số 5 — "chi"; ngược chiều với さ.', つ: 'Một làn sóng "tsu"nami.', て: 'Như cánh tay (te) duỗi ra.', と: 'Ngón chân (toe) có cái gai — "to".',
  な: 'Có chữ thập + nút thắt — "na".', に: 'Một cột + hai nét ngang như こ — "ni".', ぬ: 'Như mì soba có vòng ở đuôi — "nu"; め KHÔNG có vòng.', ね: 'Con mèo (neko) với cái đuôi cuộn — "ne".', の: 'Biển cấm "no" — một vòng tròn.',
  は: 'Một cột + chữ ほ không có gạch trên — "ha".', ひ: 'Như nụ cười "hi hi".', ふ: 'Như núi Phú Sĩ (Fuji) — "fu".', へ: 'Mái nhà dốc "he".', ほ: 'Như は nhưng có thêm gạch trên — "ho".',
  ま: 'Hai gạch ngang + vòng — "ma".', み: 'Số 21 cách điệu — "mi".', む: 'Con bò kêu "mu" — có chấm.', め: 'Con mắt (me) — không có vòng đuôi.', も: 'Lưỡi câu có 2 gạch — câu "mo"re cá.',
  や: 'Con bò Tây Tạng (yak) — "ya".', ゆ: 'Con cá có mắt — "yu".', よ: 'Như yo-yo — "yo".',
  り: 'Hai nét như dòng sông (river) — "ri"; khác い.', る: 'Như ろ nhưng có vòng nhỏ ở đuôi — "ru".', れ: 'Như ね nhưng đuôi đá thẳng ra — "re".', ろ: 'Như る nhưng KHÔNG có vòng — "ro".',
  わ: 'Như ね nhưng đuôi cong vào — "wa".', を: 'Chỉ dùng làm trợ từ, đọc "o".', ん: 'Như chữ n viết tay — "n".',
  シ: 'Hai chấm nằm ngang bên trái, nét dài vẩy từ DƯỚI lên — "shi" (ツ thì chấm ở trên).', ツ: 'Hai chấm ở TRÊN, nét dài đi từ trên xuống — "tsu".',
  ソ: 'Một chấm + nét dài đi từ trên xuống — "so".', ン: 'Một chấm bên trái, nét dài vẩy từ dưới lên — "n".',
};
