/**
 * ============================================================
 * Đọc SỐ và KÝ HIỆU thành chữ, trước khi đưa cho máy đọc
 * ============================================================
 *
 * ⚠️ MÁY ĐỌC KHÔNG BIẾT ĐỌC SỐ. NÓ ĐỌC TỪNG KÝ TỰ.
 *
 * Người dùng báo 14/08/2026: hỏi "tốc độ ánh sáng là bao nhiêu", robot
 * đáp "ba không không không không không" thay vì "ba trăm nghìn". Tên
 * wifi `TP-Link_1_9` thành "T P gạch dưới một gạch dưới chín".
 *
 * Prompt có dặn model "viết số theo cách người ta ĐỌC", nhưng lời dặn
 * không đủ: model 9B viết `300000` khi nó thấy tự nhiên hơn, và mỗi lần
 * nó quên là một câu trả lời nghe không ra. Đổi ở đây thì CHẮC CHẮN —
 * mã không quên bao giờ.
 *
 * ── Vì sao đặt ở tầng TTS chứ không dặn model kỹ hơn ──
 *
 * Cùng lý do đã học ở chỗ khác trong ngày: model nhỏ tuân luật kém, và
 * một luật mà nó tuân 90% thì 10% còn lại vẫn tới tai người dùng. Việc
 * nào tính được bằng mã thì đừng giao cho model — để dành sức thuyết
 * phục nó cho những việc mã không làm nổi.
 */

const HANG_DON_VI = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

/** Đọc một nhóm ba chữ số. `dayDu` = có đọc "không trăm" ở đầu không. */
function docNhomBa(n: number, dayDu: boolean): string {
  const tram = Math.floor(n / 100);
  const chuc = Math.floor((n % 100) / 10);
  const donVi = n % 10;
  const ra: string[] = [];

  if (tram > 0 || dayDu) ra.push(`${HANG_DON_VI[tram]} trăm`);

  if (chuc === 0) {
    // "một trăm linh năm" — chữ "linh" là thứ không suy ra được từ quy
    // tắc chung, phải viết riêng.
    if (donVi > 0 && (tram > 0 || dayDu)) ra.push('linh', HANG_DON_VI[donVi]);
    else if (donVi > 0) ra.push(HANG_DON_VI[donVi]);
  } else if (chuc === 1) {
    ra.push('mười');
    // "mười lăm", KHÔNG phải "mười năm" — đây là chỗ mọi bộ đọc số ẩu
    // đều sai, và tai người Việt nghe ra ngay.
    if (donVi === 5) ra.push('lăm');
    else if (donVi > 0) ra.push(HANG_DON_VI[donVi]);
  } else {
    ra.push(`${HANG_DON_VI[chuc]} mươi`);
    // "hai mươi mốt" chứ không "hai mươi một"; "hai mươi lăm" chứ không
    // "hai mươi năm"; "hai mươi tư" nghe tự nhiên hơn "hai mươi bốn".
    if (donVi === 1) ra.push('mốt');
    else if (donVi === 4) ra.push('tư');
    else if (donVi === 5) ra.push('lăm');
    else if (donVi > 0) ra.push(HANG_DON_VI[donVi]);
  }
  return ra.join(' ');
}

const BAC = ['', ' nghìn', ' triệu', ' tỉ'];

/** Số nguyên → chữ. Trả `null` nếu quá lớn để đọc cho tự nhiên. */
export function soSangChu(n: number): string | null {
  if (!Number.isFinite(n)) return null;
  const am = n < 0;
  let x = Math.abs(Math.trunc(n));
  if (x === 0) return am ? 'âm không' : 'không';
  // Quá nghìn tỉ thì đọc lên nghe như đánh vần — để nguyên còn hơn.
  if (x >= 1e12) return null;

  const nhom: number[] = [];
  while (x > 0) {
    nhom.push(x % 1000);
    x = Math.floor(x / 1000);
  }

  const phan: string[] = [];
  for (let i = nhom.length - 1; i >= 0; i--) {
    if (nhom[i] === 0) continue;
    // Nhóm đầu không đọc "không trăm"; các nhóm sau thì có, nếu không
    // "1005" thành "một nghìn năm" thay vì "một nghìn không trăm linh năm".
    phan.push(docNhomBa(nhom[i], i < nhom.length - 1) + BAC[i]);
  }
  return (am ? 'âm ' : '') + phan.join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * Ký hiệu người ta ĐỌC THÀNH TIẾNG, không phải ký hiệu bỏ đi.
 *
 * ⚠️ Chỉ đổi khi nó nằm GIỮA CHỮ hoặc GIỮA SỐ. Dấu gạch nối trong câu
 * văn ("robot — cục nhựa hai bánh") là dấu câu, đọc lên thành "gạch
 * ngang" là phá câu.
 */
const KY_HIEU: Array<[RegExp, string]> = [
  // ⚠️ Dùng NHÌN TRƯỚC, không nuốt ký tự sau. `(\w)_(\w)` ăn mất chữ
  // đứng sau nên `TP-Link_1_9` chỉ đọc được gạch dưới ĐẦU — bộ thử bắt
  // được, và nếu tin mắt thì đã bỏ lọt.
  [/(\w)_(?=\w)/g, '$1 gạch dưới '],
  // Số âm: "-37 dBm" phải là "âm ba mươi bảy". Đòi khoảng trắng hoặc đầu
  // câu ở trước để không nuốt dấu gạch nối giữa chữ ("TP-Link").
  [/(^|\s)-(\d)/g, '$1âm $2'],
  [/(\d)\s*%/g, '$1 phần trăm'],
  [/(\d)\s*°C/gi, '$1 độ C'],
  [/(\d)\s*km\/h/gi, '$1 ki lô mét trên giờ'],
  [/(\d)\s*m\/s/gi, '$1 mét trên giây'],
];

/**
 * Đổi mọi số trong câu sang chữ, và đọc vài ký hiệu hay gặp.
 *
 * ── Những thứ CỐ Ý không đụng tới ──
 *
 * · Số quá dài (≥13 chữ số) — đó là mã số, số điện thoại, mã đơn hàng.
 *   Đọc "một tỉ hai trăm..." cho một mã đơn là sai nghĩa; đọc từng chữ
 *   số mới đúng, và máy đọc vốn đã làm thế.
 * · Số thập phân: đọc phần nguyên rồi "phẩy" rồi TỪNG chữ số — "3,14"
 *   là "ba phẩy một bốn", không phải "ba phẩy mười bốn".
 * · Dấu gạch nối trong câu văn — xem ghi chú ở `KY_HIEU`.
 */
export function docSoTrongCau(text: string): string {
  let s = text;

  for (const [re, thay] of KY_HIEU) s = s.replace(re, thay);

  // Bỏ dấu phân cách nghìn kiểu "300.000" hoặc "300,000" TRƯỚC, nếu
  // không thì "300.000" bị hiểu thành số thập phân 300 phẩy 000.
  s = s.replace(/(\d)[.,](\d{3})\b/g, '$1$2');

  // Thập phân: "3,14" hoặc "3.14"
  s = s.replace(/\b(\d+)[.,](\d+)\b/g, (m, a: string, b: string) => {
    const nguyen = soSangChu(Number(a));
    if (!nguyen || a.length > 12) return m;
    const le = b
      .split('')
      .map((c) => HANG_DON_VI[Number(c)])
      .join(' ');
    return `${nguyen} phẩy ${le}`;
  });

  // Số nguyên
  s = s.replace(/\b\d+\b/g, (m) => {
    if (m.length >= 13) return m; // mã số, không phải lượng
    const chu = soSangChu(Number(m));
    return chu ?? m;
  });

  return s;
}
