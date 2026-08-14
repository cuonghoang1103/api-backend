/**
 * ============================================================
 * KIỂU NÓI — Phổ thông ↔ Miền Trung
 * ============================================================
 *
 * ⚠️ ĐÂY LÀ CHUYỆN CỦA CHỮ, KHÔNG PHẢI CỦA GIỌNG.
 *
 * Hai thứ hay bị gộp làm một, mà chúng đi hai đường khác hẳn:
 *
 *   NGỮ ÂM  — cách phát âm, đổ thanh, mở nguyên âm. Do MODEL GIỌNG quyết,
 *             học được bằng fine-tune F5-TTS trên tiếng người dùng thu.
 *   TỪ NGỮ  — mô, tê, răng, rứa. Do LLM VIẾT RA, không liên quan gì tới
 *             model giọng.
 *
 * File này lo phần THỨ HAI. Nó chạy được ngay, không cần đợi train xong.
 * Khi model giọng xong thì hai phần khớp vào nhau: chế độ miền Trung lấy
 * đoạn mẫu miền Trung làm mẫu tham chiếu, ra vừa đúng từ vừa đúng giọng.
 *
 * ── BA VIỆC, KHÓ Ở BA CHỖ KHÁC NHAU ──
 *
 * 1. HIỂU người nói giọng nào cũng được.
 *    LLM vốn đã hiểu "đi mô rứa". Chỗ yếu thật là WHISPER: nó học chủ yếu
 *    tiếng phổ thông nên nghe "nỏ biết mô" thành "nó biết mà". Chữa bằng
 *    cách mồi từ vựng vào trường `prompt` của Whisper — xem `tuGoiYNghe()`.
 *
 * 2. TRẢ LỜI theo kiểu đã chọn.
 *    Prompt + mẫu đối thoại. Và theo đúng bài học đã trả giá 13/08/2026:
 *    MẪU NẶNG HƠN LỜI DẶN. Dặn "hãy nói giọng miền Trung" mà mẫu toàn
 *    tiếng phổ thông thì model theo mẫu. Nên `MAU_MIEN_TRUNG` phải viết
 *    hoàn toàn bằng tiếng miền Trung, và phải dài ngắn khác nhau — tám
 *    mẫu cùng độ dài từng dạy model "luôn 220 chữ".
 *
 * 3. DỊCH khi được hỏi.
 *    Cần từ điển NẰM TRONG PROMPT. Model 9B không chắc chắn biết "chộ" là
 *    "thấy"; nó sẽ đoán, và đoán sai một cách tự tin. Bảng dưới đây đi
 *    kèm mỗi lượt ở chế độ miền Trung.
 *
 * ⚠️ Bảng này CỐ Ý không đầy đủ, và không thể đầy đủ: Nghệ Tĩnh, Quảng
 * Bình, Huế, Quảng Nam mỗi nơi một khác. Người dùng bổ sung qua ô "nghĩa"
 * ở xưởng giọng — họ biết quê họ nói gì, ta thì không.
 */

export type KieuNoi = 'pho-thong' | 'mien-trung';

export const NHAN_KIEU: Record<KieuNoi, string> = {
  'pho-thong': 'phổ thông',
  'mien-trung': 'miền Trung',
};

export function laKieuNoi(x: unknown): x is KieuNoi {
  return x === 'pho-thong' || x === 'mien-trung';
}

/**
 * Từ điển lõi — những từ dùng chung khắp miền Trung.
 *
 * Chỉ để những từ mà PHẦN LỚN vùng đều dùng. Từ riêng của một tỉnh
 * (Nghệ Tĩnh: nỏ, chộ, đọi, trốc) vẫn có mặt vì chúng rất hay gặp, nhưng
 * được đánh dấu để robot biết mà nói rõ khi giải thích.
 */
export const TU_DIEN: Array<{ tu: string; nghia: string; vung?: string }> = [
  // ── Lõi, gần như mọi vùng miền Trung ──
  { tu: 'mô', nghia: 'đâu' },
  { tu: 'tê', nghia: 'kia' },
  { tu: 'răng', nghia: 'sao, thế nào' },
  { tu: 'rứa', nghia: 'thế, vậy' },
  { tu: 'chi', nghia: 'gì' },
  { tu: 'ni', nghia: 'này' },
  { tu: 'nớ', nghia: 'ấy, đó' },
  { tu: 'hè', nghia: 'nhỉ (cuối câu)' },
  { tu: 'chừ', nghia: 'giờ' },
  { tu: 'bây chừ', nghia: 'bây giờ' },
  { tu: 'mần', nghia: 'làm' },
  { tu: 'tui', nghia: 'tôi' },
  { tu: 'hắn', nghia: 'nó, anh ta' },
  { tu: 'thiệt', nghia: 'thật' },
  { tu: 'dữ', nghia: 'lắm, quá' },
  { tu: 'ngó', nghia: 'nhìn' },
  { tu: 'vô', nghia: 'vào' },
  { tu: 'ưng', nghia: 'thích, muốn' },
  { tu: 'lận', nghia: 'cơ (nhấn mạnh)' },
  { tu: 'khi mô', nghia: 'khi nào' },
  { tu: 'bựa ni', nghia: 'hôm nay' },
  { tu: 'bựa tê', nghia: 'hôm kia' },
  { tu: 'răng rứa', nghia: 'sao vậy' },
  { tu: 'đi mô', nghia: 'đi đâu' },
  { tu: 'chi rứa', nghia: 'gì vậy' },
  { tu: 'có chi mô', nghia: 'có gì đâu' },
  { tu: 'mần chi', nghia: 'làm gì' },
  // ── Nặng chất Nghệ Tĩnh ──
  { tu: 'nỏ', nghia: 'không', vung: 'Nghệ Tĩnh' },
  { tu: 'chộ', nghia: 'thấy', vung: 'Nghệ Tĩnh' },
  { tu: 'đọi', nghia: 'bát', vung: 'Nghệ Tĩnh' },
  { tu: 'trốc', nghia: 'đầu', vung: 'Nghệ Tĩnh' },
  { tu: 'mi', nghia: 'mày', vung: 'Nghệ Tĩnh' },
  // ── Huế ──
  { tu: 'eng', nghia: 'anh', vung: 'Huế' },
  { tu: 'mệ', nghia: 'bà', vung: 'Huế' },
  { tu: 'o', nghia: 'cô', vung: 'Huế' },
];

/**
 * Từ điển người dùng tự bổ sung, nạp từ xưởng giọng.
 *
 * Giữ ở đây thay vì nhét thẳng vào `TU_DIEN` để phần người dùng thêm
 * KHÔNG bị mất khi cập nhật mã — và để biết được đâu là phần mình viết,
 * đâu là phần họ dạy.
 */
export function ganTuDien(
  goc: Array<{ tu: string; nghia: string; vung?: string }>,
  them: Array<{ tu: string; nghia: string }> | null | undefined,
): Array<{ tu: string; nghia: string; vung?: string }> {
  if (!them?.length) return goc;
  const co = new Set(goc.map((x) => x.tu.toLowerCase()));
  return [...goc, ...them.filter((x) => x.tu && x.nghia && !co.has(x.tu.toLowerCase()))];
}

/**
 * Bảng từ điển đưa vào prompt.
 *
 * ⚠️ ĐI TRONG PHẦN TĨNH CỦA PROMPT, không phải phần động. Nó không đổi
 * giữa các lượt, nên đặt đúng chỗ thì llama.cpp dùng lại được toàn bộ —
 * đặt sai là mỗi lượt nạp lại vài trăm chữ, và đó chính là lỗi "càng nói
 * càng lâu" đã mất công truy ra hôm 13/08.
 */
export function bangTuDien(
  them?: Array<{ tu: string; nghia: string }> | null,
): string {
  const ds = ganTuDien(TU_DIEN, them);
  return ds
    .map((x) => `${x.tu} = ${x.nghia}${x.vung ? ` (${x.vung})` : ''}`)
    .join(' · ');
}

/** Từ khoá mồi cho Whisper — xem lý do ở đầu file, mục 1. */
export function tuGoiYNghe(them?: Array<{ tu: string; nghia: string }> | null): string {
  return ganTuDien(TU_DIEN, them)
    .map((x) => x.tu)
    .join(', ');
}

/**
 * Mẫu đối thoại cho chế độ miền Trung.
 *
 * ⚠️ PHẢI VIẾT HOÀN TOÀN BẰNG TIẾNG MIỀN TRUNG. Mẫu nặng hơn lời dặn —
 * xem ghi chú đầu file. Và phải DÀI NGẮN KHÁC NHAU, vì mẫu đồng đều dạy
 * ra đầu ra đồng đều.
 *
 * Mẫu cuối CỐ Ý là một lượt hỏi nghĩa: đó là hành vi người dùng yêu cầu
 * riêng, và một hành vi không có trong mẫu thì model làm hay không tuỳ
 * hứng.
 */
export const MAU_MIEN_TRUNG: Array<{ user: string; bot: string }> = [
  { user: 'Mấy giờ rồi?', bot: 'Chừ hơn tám giờ rồi eng.' },
  {
    user: 'Hôm nay trời thế nào?',
    bot: 'Bựa ni trời nắng dữ, ra ngoài nhớ đội mũ vô nghe.',
  },
  {
    user: 'Bạn đang làm gì đấy?',
    bot: 'Tui đang ngồi đây chờ eng hỏi chi thôi, có mần chi mô.',
  },
  {
    user: 'Giải thích cho tôi biến toàn cục là gì.',
    bot:
      'Biến toàn cục là biến khai ở ngoài cùng, chỗ mô trong chương trình cũng ngó thấy nó được. ' +
      'Tiện thì có tiện, mà nguy: chỗ mô cũng sửa được nó, nên tới khi hắn sai thì eng nỏ biết ' +
      'thằng mô sửa. Rứa nên trừ khi thiệt cần, còn lại nên để biến trong phạm vi hẹp thôi.',
  },
  { user: 'Cảm ơn nhé.', bot: 'Có chi mô eng.' },
  {
    user: 'Rứa nghĩa là răng?',
    bot:
      '"Rứa" là "thế, vậy" đó eng. Câu tui vừa nói dịch ra phổ thông là "vậy nghĩa là sao". ' +
      'Eng cần tui nói lại kiểu phổ thông thì cứ bảo, tui đổi liền.',
  },
];

/**
 * Dặn thêm vào system prompt.
 *
 * Cố ý dặn NGẮN: phần nặng nằm ở mẫu đối thoại. Một đoạn dặn dài về giọng
 * văn mà mẫu không theo thì model vẫn theo mẫu, và ta chỉ tốn ngữ cảnh.
 */
export function danKieuNoi(
  kieu: KieuNoi,
  them?: Array<{ tu: string; nghia: string }> | null,
): string {
  if (kieu !== 'mien-trung') return '';
  return [
    'GIỌNG VĂN: nói tiếng MIỀN TRUNG, dùng từ địa phương tự nhiên (mô, tê, răng, rứa, chi, ni, nớ, chừ, mần…).',
    'Người dùng nói giọng nào cũng phải hiểu và vẫn trả lời bằng tiếng miền Trung.',
    'Khi được hỏi nghĩa một từ hoặc được nhờ nói lại cho dễ hiểu, HÃY DỊCH sang tiếng phổ thông rõ ràng, rồi nói tiếp bình thường.',
    `TỪ ĐIỂN: ${bangTuDien(them)}`,
  ].join('\n');
}

/** Bỏ dấu để khớp cả khi Whisper nghe thiếu dấu. */
function khongDau(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Người dùng vừa bảo đổi kiểu nói? Trả kiểu mới, hoặc `null`.
 *
 * ⚠️ KHỚP HẸP, ĐÒI ĐỘNG TỪ ĐỨNG TRƯỚC, VÀ CHỈ NHẬN CÂU NGẮN.
 *
 * Cùng luật với lệnh đổi tiếng và đổi tính cách, và vì cùng một lý do đã
 * trả giá: ở chế độ miền Trung thì chữ "miền trung" xuất hiện đầy trong
 * câu chuyện thường ngày ("quê tui ở miền Trung"), và bắt nhầm là robot
 * đột ngột đổi giọng văn giữa cuộc trò chuyện.
 */
export function khopDoiKieuNoi(heard: string): KieuNoi | null {
  const s = khongDau(heard);
  if (!s || s.length > 48) return null;

  const DONG_TU = 'doi|chuyen|sang|dung|noi|bat|switch|change';
  const thu = (ten: string): boolean =>
    new RegExp(`\\b(${DONG_TU})\\b(\\s+\\S+){0,3}\\s+${ten}(\\s|$)`).test(s);

  // Thử miền Trung TRƯỚC: "nói giọng miền trung" chứa cả "giọng" lẫn
  // "miền trung", còn mẫu phổ thông thì không dính. Thứ tự ngược lại
  // không sai, nhưng đặt cái hẹp trước thì đọc mã dễ hiểu hơn.
  if (thu('mien trung') || thu('giong trung') || thu('tieng trung bo')) return 'mien-trung';
  if (thu('pho thong') || thu('giong bac') || thu('tieng chuan') || thu('binh thuong'))
    return 'pho-thong';
  return null;
}

/** Câu robot nói ngay khi vừa đổi kiểu. */
export const CHAO_DOI_KIEU: Record<KieuNoi, string> = {
  'mien-trung': 'Rồi, từ chừ tui nói giọng miền Trung nghe eng.',
  'pho-thong': 'Được, tôi quay lại nói giọng phổ thông.',
};
