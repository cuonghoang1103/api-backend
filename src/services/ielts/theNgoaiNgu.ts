/**
 * Bọc BÙ thẻ `[en]…[/en]` cho đoạn ngoại ngữ mà model quên bọc (19/10/2026).
 *
 * Lời CuongMini đọc bằng hai giọng: ngoài thẻ = tiếng Việt (Ada locale vi-VN, hoặc F5 máy nhà),
 * trong thẻ = giọng chuẩn của thứ tiếng đang học. Model (Heshin/gpt-6-sol) không phải lúc nào
 * cũng bọc — người dùng nghe "Great, playing soccer is a fun hobby!" đọc bằng giọng Việt, và
 * "Tiếp tục buổi trước" hỏi lại nhầm câu (nó tìm câu hỏi cuối theo thẻ). Nên bọc bù theo CHỮ:
 *   - en: dãy từ Latin KHÔNG dấu liền nhau, đa số không phải âm tiết Việt viết thiếu dấu;
 *     cả đoạn không có chữ Việt có dấu thì một từ Latin cũng tính.
 *   - ja/zh: dãy kana/Hán tự (kể cả `{漢字|かな}` và dấu câu toàn khổ).
 * Thẻ có sẵn giữ nguyên; thẻ liền nhau (chỉ cách dấu câu/khoảng trắng) gộp làm một.
 */
export type NgonNguThe = 'en' | 'ja' | 'zh';

const DAU_VIET = /[ăâđêôơưàáạảãầấậẩẫằắặẳẵèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i;
/** Âm tiết Việt hay gặp mà viết KHÔNG dấu vẫn đúng chính tả — đừng nhận nhầm là tiếng Anh. */
const VIET_KHONG_DAU = new Set(('anh em con cho hay nay sao khi thi tin ra vao la va ma ca co di ve xe ai tai sai nhe nha nhi oi ui vui xin '
  + 'chao cam an uong hoc noi tu minh ta no ho gi ky mai nam ba hai bon bay tam chin trieu giup tieng bai cau van nhu thich kho lam '
  + 'qua hon nhat cung lai roi chua xong trong ngoai tren duoi truoc giua lon nho dai ngan moi tot mo dong mua choi ngay dem sang chieu '
  + 'tuan thang nhieu it thoi thay xem nghe biet hieu sua dung loi dang luyen viet doc phat am').split(' '));
const TU_LATIN = /^[("“'‘]*([A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*)[)"”'’.,!?;:…]*$/;
const KANA_HAN = /[぀-ヿ㐀-䶿一-鿿豈-﫿]/;
const DAY_NHAT_TRUNG = /(?:\{[^|}]+\|[^}]+\}|[　-〿぀-ヿ㐀-䶿一-鿿豈-﫿！-｠])+/g;

function bocNhatTrung(t: string): string {
  return t.replace(DAY_NHAT_TRUNG, (m) => (KANA_HAN.test(m.replace(/\{([^|}]+)\|[^}]+\}/g, '$1')) ? `[en]${m}[/en]` : m));
}

function bocAnh(t: string): string {
  const tok = t.split(/(\s+)/); // giữ khoảng trắng ở vị trí lẻ
  const coDau = DAU_VIET.test(t);
  const laTu = (x: string) => !DAU_VIET.test(x) && TU_LATIN.test(x) && /[A-Za-z]/.test(x);
  const out: string[] = [];
  let i = 0;
  while (i < tok.length) {
    if (i % 2 === 1 || !laTu(tok[i]!)) { out.push(tok[i]!); i++; continue; }
    let j = i; // dãy từ Latin: tok[i], tok[i+2], … (khoảng trắng ở giữa)
    while (j + 2 < tok.length && laTu(tok[j + 2]!)) j += 2;
    const tu = [];
    for (let k = i; k <= j; k += 2) tu.push(TU_LATIN.exec(tok[k]!)![1]!.toLowerCase());
    const ngoai = tu.filter((w) => /[a-z]/.test(w) && !VIET_KHONG_DAU.has(w) && w !== 'cuongmini').length;
    const anh = ngoai >= 2 || (!coDau && ngoai >= 1);
    const doan = tok.slice(i, j + 1).join('');
    out.push(anh ? `[en]${doan}[/en]` : doan);
    i = j + 1;
  }
  return out.join('');
}

/** Bọc bù thẻ ngoại ngữ cho phần nằm NGOÀI thẻ; văn bản đã bọc đủ thì trả y nguyên. */
export function boSungTheNN(noi: string, nn: NgonNguThe): string {
  const bo = nn === 'en' ? bocAnh : bocNhatTrung;
  const ra = noi.split(/(\[en\][\s\S]*?\[\/en\])/gi).map((p, i) => (i % 2 ? p : bo(p))).join('');
  return ra === noi ? noi : ra.replace(/\[\/en\]([\s,.!?;:…、。，！？]*)\[en\]/gi, '$1');
}
