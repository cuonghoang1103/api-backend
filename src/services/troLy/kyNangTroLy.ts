/**
 * ============================================================
 * KỸ NĂNG CỦA TRỢ LÝ CuongMini (robot nổi trên app desktop)
 * ============================================================
 *
 * Chủ app 03/10/2026: "tôi thường hỏi ảnh, code, toán, ngôn ngữ Anh, Nhật,
 * tiếng Việt… nâng cấp cho nó thông minh hơn, thêm nhiều skill".
 *
 * Mỗi kỹ năng là MỘT khối luật nối vào cuối system prompt — không đổi model,
 * không đổi đường đi. Client gửi `kyNang` (chip người dùng chọn) hoặc
 * `'tu-dong'` để máy chủ tự nhận theo câu hỏi. Client không gửi gì (trang
 * /chat của web, app cũ) ⇒ không thêm gì, hành vi y như trước.
 *
 * ⚠️ DANH SÁCH TRẮNG, không nhận chữ tự do: cùng lý do với `ngonNgu` trong
 * ai.routes — nếu nhận chuỗi prompt từ client thì bất kỳ ai cũng viết lại được
 * luật của trợ lý.
 *
 * ⚠️ Luật ngôn ngữ trả lời KHÔNG nằm ở đây. Kỹ năng "Tiếng Anh" là GIA SƯ
 * tiếng Anh (giải thích bằng ngôn ngữ của người dùng, ví dụ bằng tiếng Anh),
 * không phải lệnh "trả lời bằng tiếng Anh" — lệnh đó do `luatNgonNgu` quyết
 * định, và yêu cầu rõ của người dùng ("answer in English") luôn thắng.
 */

export const KY_NANG_TRO_LY = ['anh', 'code', 'toan', 'tieng-anh', 'tieng-nhat', 'tieng-viet'] as const;
export type KyNangTroLy = (typeof KY_NANG_TRO_LY)[number];

/** Đọc `kyNang` từ thân yêu cầu. `'tu-dong'` giữ nguyên để nơi gọi tự nhận. */
export function docKyNang(v: unknown): KyNangTroLy | 'tu-dong' | undefined {
  if (v === 'tu-dong') return 'tu-dong';
  return (KY_NANG_TRO_LY as readonly unknown[]).includes(v) ? (v as KyNangTroLy) : undefined;
}

const CO_KANA = /[\u3040-\u30ff]/;
const CO_KANJI = /[\u4e00-\u9faf]/;
/** Dấu tiếng Việt — đủ để biết câu được gõ bằng tiếng Việt. */
const CO_DAU_VIET = /[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i;

/**
 * Khớp TRỌN TỪ, kể cả từ mở/đóng bằng chữ có dấu.
 *
 * ⚠️ KHÔNG dùng `\b`: với JS, `đ`, `ả`, `ứ`… không phải "ký tự từ", nên
 * `\bđạo hàm` không bao giờ khớp sau dấu cách và `chính tả\b` không bao giờ
 * khớp trước dấu cách — câu tiếng Việt lọt hết qua bộ nhận mà không ai biết.
 */
function tu(...ds: string[]): RegExp {
  return new RegExp(`(?<![\\p{L}\\p{N}_])(?:${ds.join('|')})(?![\\p{L}\\p{N}_])`, 'iu');
}

const TU_CODE = tu('code', 'bug', 'lỗi biên dịch', 'compile', 'stack ?trace', 'exception', 'traceback',
  'undefined is not', 'null ?pointer', 'typescript', 'javascript', 'python', 'java', 'c\\+\\+', 'sql',
  'react', 'node(?:\\.js)?', 'api', 'regex', 'git', 'vòng lặp', 'lập trình', 'khai báo biến');
const TU_NHAT = tu('tiếng nhật', 'tieng nhat', 'japanese', 'kanji', 'hiragana', 'katakana', 'furigana',
  'jlpt', 'n[1-5]', 'ngữ pháp nhật');
/* KHÔNG có 'giải'/'tính' đứng một mình: "giải thích", "tính năng" là câu thường. */
const TU_TOAN = tu('giải (?:phương trình|bài toán|hệ|bất)', 'tính (?:giá trị|đạo hàm|tích phân|diện tích|thể tích|chu vi|xác suất|giới hạn)', 'chứng minh', 'phương trình', 'bất phương trình', 'đạo hàm',
  'tích phân', 'giới hạn', 'xác suất', 'ma trận', 'hệ phương trình', 'hình học', 'tam giác', 'vectơ',
  'vector', 'logarit', 'toán', 'nguyên hàm', 'số phức', 'hàm số', 'bài toán');
const TU_ANH = tu('tiếng anh', 'tieng anh', 'english', 'ielts', 'toeic', 'toefl', 'phát âm',
  'pronounce', 'pronunciation', 'grammar', 'thì hiện tại', 'present perfect', 'phrasal verb', 'idiom',
  'dịch sang tiếng anh', 'từ vựng');
const TU_VIET = tu('chính tả', 'ngữ pháp tiếng việt', 'tiếng việt', 'viết lại câu', 'văn bản',
  'đoạn văn', 'soạn thư', 'thành ngữ', 'tục ngữ', 'từ đồng nghĩa');

/**
 * Tự nhận kỹ năng theo câu hỏi. Thứ tự là thứ tự ưu tiên: ảnh đính kèm luôn
 * thắng (người dùng gửi ảnh thì việc chính là đọc ảnh), rồi tới dấu hiệu RÕ
 * nhất (khối mã, chữ Nhật), cuối cùng mới là từ khoá.
 *
 * Trả `null` khi không chắc — thà không thêm luật còn hơn thêm nhầm luật (bảo
 * model "giải toán từng bước" cho một câu chào là làm nó trả lời dài vô cớ).
 */
export function nhanKyNang(cau: string, coAnh = false): KyNangTroLy | null {
  if (coAnh) return 'anh';
  const c = cau.trim();
  if (!c) return null;

  if (/```/.test(c)
    || /^\s*(import|from|def|class|function|const|let|var|public|#include|SELECT|INSERT|UPDATE)\s/m.test(c)
    || /=>|\w+\([^)]*\)\s*[{;]/.test(c)
    || TU_CODE.test(c)) {
    return 'code';
  }
  if (CO_KANA.test(c) || TU_NHAT.test(c) || (CO_KANJI.test(c) && !CO_DAU_VIET.test(c))) {
    return 'tieng-nhat';
  }
  if (/\$[^$]+\$|\\frac|\\sqrt|[∫∑√≤≥π]/.test(c)
    || /(?<![\p{L}])(sin|cos|tan|log|ln|lim)\s*\(/iu.test(c)
    /* Không nhận '/' và '-' giữa hai số: "03/10/2026", "2-3 giây" là ngày và khoảng, không phải toán. */
    || /\d\s*[+*^×÷=]\s*\d|\bx\s*[=²^]|\d\s*x\s*[+\-=]/.test(c)
    || TU_TOAN.test(c)) {
    return 'toan';
  }
  if (TU_ANH.test(c)) return 'tieng-anh';
  if (TU_VIET.test(c)) return 'tieng-viet';
  return null;
}

const LUAT: Record<KyNangTroLy, string> = {
  anh:
    '\n## Kỹ năng: ĐỌC ẢNH\n'
    + '- Trước hết nói ngắn ảnh có gì (loại ảnh: đề bài, ảnh chụp màn hình lỗi, sơ đồ, chữ viết tay…).\n'
    + '- Ảnh có CHỮ/ĐỀ BÀI: chép lại nguyên văn phần quan trọng (công thức viết LaTeX) rồi mới giải/đáp. '
    + 'Chỗ nào mờ, bị cắt hay không chắc thì nói rõ, đừng đoán bừa ký hiệu.\n'
    + '- Ảnh chụp màn hình lỗi: chỉ ra dòng lỗi chính, nguyên nhân khả dĩ nhất, cách sửa cụ thể.\n'
    + '- Không mô tả những gì ảnh KHÔNG có.\n',
  code:
    '\n## Kỹ năng: CODE\n'
    + '- Đi thẳng vào việc: nguyên nhân → cách sửa → đoạn mã đã sửa trong khối ```<ngôn ngữ> (ghi đúng tên ngôn ngữ để tô màu).\n'
    + '- Chỉ đưa phần mã cần đổi kèm vài dòng ngữ cảnh, đánh dấu chỗ đổi bằng chú thích ngắn. Giải thích ngắn VÌ SAO.\n'
    + '- Nêu cạm bẫy hay gặp nếu có. KHÔNG bịa tên hàm/thư viện/API — không chắc thì nói cần kiểm tài liệu.\n'
    + '- Khung chat nhỏ: tránh bảng rộng, mỗi dòng mã ngắn gọn.\n',
  toan:
    '\n## Kỹ năng: TOÁN\n'
    + '- Giải TỪNG BƯỚC, đánh số bước; mỗi bước một ý, ghi rõ áp dụng công thức/định lý nào.\n'
    + '- Mọi công thức viết LaTeX: `$...$` trong dòng, `$$...$$` đứng riêng. Không bọc công thức trong khối code.\n'
    + '- Kết thúc bằng dòng **Đáp số:** rõ ràng; nếu kiểm lại được (thế ngược, ước lượng) thì kiểm ngắn một dòng.\n'
    + '- Đề thiếu dữ kiện hoặc mơ hồ thì nói ra và nêu giả định đang dùng.\n',
  'tieng-anh':
    '\n## Kỹ năng: GIA SƯ TIẾNG ANH\n'
    + '- Giải thích bằng ngôn ngữ người dùng đang dùng (thường là tiếng Việt), còn VÍ DỤ thì bằng tiếng Anh tự nhiên.\n'
    + '- Từ vựng: nghĩa + phiên âm IPA + loại từ + 1–2 câu ví dụ có dịch. Ngữ pháp: công thức ngắn + khi nào dùng + lỗi người Việt hay mắc.\n'
    + '- Người dùng gửi câu tiếng Anh để sửa: đưa bản sửa, rồi liệt kê từng lỗi và vì sao (ngắn).\n'
    + '- Nếu người dùng muốn luyện/hội thoại bằng tiếng Anh hoặc yêu cầu trả lời bằng tiếng Anh thì trả lời toàn bộ bằng tiếng Anh.\n',
  'tieng-nhat':
    '\n## Kỹ năng: GIA SƯ TIẾNG NHẬT\n'
    + '- Mọi chữ Hán (kanji) trong câu ví dụ kèm cách đọc ngay sau trong ngoặc: 日本語（にほんご）. '
    + 'Câu ví dụ có thêm một dòng romaji khi người dùng là người mới hoặc tự hỏi cách đọc.\n'
    + '- Ngữ pháp: mẫu câu (vd 〜てもいい), ý nghĩa, cách chia, cấp JLPT ước chừng, 2 câu ví dụ có dịch.\n'
    + '- Từ vựng: kana, kanji (nếu có), Hán Việt (nếu có), nghĩa, ví dụ.\n'
    + '- Giải thích bằng ngôn ngữ người dùng đang dùng (thường là tiếng Việt); người dùng muốn luyện bằng tiếng Nhật thì theo họ.\n',
  'tieng-viet':
    '\n## Kỹ năng: TIẾNG VIỆT\n'
    + '- Sửa chính tả, dấu, ngữ pháp và câu chữ: đưa bản đã sửa trước, rồi liệt kê ngắn từng chỗ sửa và vì sao.\n'
    + '- Viết/viết lại văn bản: giữ ý người dùng, văn phong tự nhiên đúng mục đích (trang trọng/thân mật), không thêm thông tin bịa.\n'
    + '- Giải nghĩa từ/thành ngữ: nghĩa, nguồn gốc ngắn nếu chắc chắn, ví dụ dùng trong câu.\n',
};

/**
 * Khối luật cho lượt này. `kyNang` từ client; `'tu-dong'` ⇒ tự nhận theo câu.
 * Lượt GIỌNG NÓI không thêm gì: `VOICE_RULES` cấm markdown/LaTeX, còn các khối
 * này đòi đúng những thứ đó — để chung là hai luật ngược nhau trong một prompt.
 */
export function luatKyNang(
  kyNang: KyNangTroLy | 'tu-dong' | undefined,
  cau: string,
  coAnh: boolean,
  voice = false,
): { kyNang: KyNangTroLy | null; luat: string } {
  if (!kyNang || voice) return { kyNang: null, luat: '' };
  /* Chọn chip cụ thể nhưng có ảnh đi kèm (vd chip Toán + ảnh đề) ⇒ ghép thêm
     luật đọc ảnh: luật Toán không dạy model chép đề từ ảnh trước khi giải. */
  const k = kyNang === 'tu-dong' ? nhanKyNang(cau, coAnh) : kyNang;
  if (!k) return { kyNang: null, luat: '' };
  const them = coAnh && k !== 'anh' ? LUAT.anh : '';
  return { kyNang: k, luat: them + LUAT[k] };
}
