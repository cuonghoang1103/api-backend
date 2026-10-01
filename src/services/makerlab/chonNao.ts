/**
 * ============================================================
 * Maker Lab — chọn não và độ dài câu trả lời THEO TỪNG CÂU HỎI
 * ============================================================
 *
 * Người dùng (01/10/2026): "kết hợp hai não, nhanh mà chất lượng — phân biệt
 * câu hỏi ngắn dài mà trả lời, đừng câu nào cũng ngắn, câu nào cũng dài".
 *
 * Hai não đo cùng ngày:
 *
 *   máy nhà  Qwen3.5-9B / RTX 3060  hết câu đầu ~1,3 s · miễn phí · kém kiến thức
 *   cổng     gpt-5.6-terra          hết câu đầu 2,3–2,7 s · tốn tiền · giỏi hơn hẳn
 *
 * Chênh nhau ~1 giây cho câu đầu — mà máy nhà còn tranh card với giọng F5,
 * nên tới lúc robot cất tiếng thì hai đường gần như ngang nhau. Vậy chọn não
 * theo việc chứ không theo tốc độ: chuyện phiếm thì máy nhà (miễn phí, đủ
 * dùng), câu cần hiểu biết hay lập luận thì lên cổng.
 *
 * ⚠️ CHỌN BẰNG LUẬT, KHÔNG HỎI MODEL. Hỏi một model "câu này khó không"
 * là cộng thêm một lượt gọi vào MỌI câu — đúng thứ người dùng vừa nhờ cắt.
 * Luật thì tức thì, miễn phí, và sai ở đâu là thấy ở đó (bộ thử
 * `chonNao.test.ts`). Sai theo hướng nào cũng không chết: câu khó rơi vào
 * máy nhà thì vẫn được trả lời, chỉ kém hay hơn.
 */

export type DoDai = 'ngan' | 'vua' | 'dai';

export interface LoaiCau {
  /** Cần não giỏi (cổng) hơn là não nhanh (máy nhà). */
  kho: boolean;
  doDai: DoDai;
  /** Luật nào quyết — ghi log để soi lúc robot chọn sai. */
  lyDo: string;
}

function khongDau(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Mọi mẫu viết KHÔNG DẤU, có ranh giới từ hai đầu (`\b`): bỏ dấu xong thì
// "ma" là cả "mà", "má", "mả" — khớp lửng là bắt nhầm khắp nơi.

/** Chuyện phiếm, hỏi giờ, chào hỏi — máy nhà, trả lời NGẮN. */
const DE = [
  /\b(xin )?chao\b/, /\bhello\b/, /\bhi\b/, /\bkhoe khong\b/, /\bon khong\b/,
  /\bmay gio\b/, /\bthu may\b/, /\bngay (bao nhieu|may)\b/, /\bhom nay la ngay\b/,
  /\bten (la )?gi\b/, /\bban la ai\b/, /\bdang lam gi\b/, /\bcam on\b/, /\bthanks?\b/,
  /\btam biet\b/, /\bngu ngon\b/, /\bchuc\b/, /\bpin con\b/, /\bwifi\b/,
];

/** Người dùng tự đòi NGẮN. */
const DOI_NGAN = [
  /\bngan (thoi|gon|lai)\b/, /\bnoi ngan\b/, /\btom (tat|lai)\b/, /\bmot cau\b/, /\bvan tat\b/,
];

/** Người dùng tự đòi DÀI / kỹ. */
const DOI_DAI = [
  /\bchi tiet\b/, /\b(giai thich|noi|ke|phan tich) (ky|ro|cu the|day du|can ke)\b/, /\bcan ke\b/,
  /\bday du\b/, /\btung buoc\b/, /\bke dai\b/, /\bnoi dai\b/, /\bsau hon\b/, /\bnghi ky\b/,
];

/** Câu cần hiểu biết hoặc lập luận — lên cổng, trả lời ĐỦ Ý. */
const KHO = [
  /\b(vi|tai) sao\b/, /\bgiai thich\b/, /\bphan tich\b/, /\bso sanh\b/, /\bkhac (nhau|gi|biet)\b/,
  /\buu (diem|nhuoc)\b/, /\bnhuoc diem\b/, /\b(co )?nen (chon|dung|mua|hoc|lam)\b/, /\bhay la\b/,
  /\blam (sao|the nao|cach nao)\b/, /\bnhu the nao\b/, /\bcach (nao|de|lam)\b/, /\bhuong dan\b/,
  /\bcac buoc\b/, /\b(lap|len) ke hoach\b/, /\bde xuat\b/, /\btu van\b/, /\bchien luoc\b/,
  /\b(viet|soan) (giup|cho|mot)\b/, /\bdich (giup|sang|ra)\b/, /\btinh (giup|xem|thu)\b/,
  /\bcong thuc\b/, /\bchung minh\b/, /\bnguyen (ly|nhan)\b/, /\bco che\b/, /\bhoat dong (the nao|ra sao)\b/,
  /\bcode\b/, /\blap trinh\b/, /\bthuat toan\b/, /\bdebug\b/, /\bbi loi\b/, /\bsua loi\b/,
  /\blich su\b/, /\bke (chuyen|ve)\b/, /\bla gi\b/, /\bla ai\b/, /\by nghia\b/, /\bdinh nghia\b/,
];

/**
 * Xếp loại một câu người dùng vừa nói.
 *
 * Thứ tự quyết: người dùng TỰ ĐÒI độ dài thắng mọi luật; rồi câu khó; rồi
 * chuyện phiếm; cuối cùng mới đoán theo độ dài câu hỏi.
 */
export function phanLoaiCau(heard: string): LoaiCau {
  const s = khongDau(heard || '');
  const soTu = s ? s.split(' ').length : 0;
  const co = (ds: RegExp[]) => ds.some((r) => r.test(s));

  const doiNgan = co(DOI_NGAN);
  const doiDai = co(DOI_DAI);
  const kho = co(KHO);

  if (doiDai) return { kho: true, doDai: 'dai', lyDo: 'nguoi dung doi dai/ky' };
  if (doiNgan) return { kho, doDai: 'ngan', lyDo: 'nguoi dung doi ngan' };
  if (kho) {
    // "X là gì" một hơi thì vừa phải; hỏi vì sao/hướng dẫn/so sánh thì đủ ý.
    const chiDinhNghia = /\b(la gi|la ai|y nghia|dinh nghia)\b/.test(s) && soTu <= 8;
    return { kho: true, doDai: chiDinhNghia ? 'vua' : 'dai', lyDo: chiDinhNghia ? 'hoi dinh nghia' : 'cau kho' };
  }
  if (co(DE)) return { kho: false, doDai: 'ngan', lyDo: 'chuyen phiem' };
  // Không có dấu hiệu nào: câu dài thường là câu có nội dung.
  if (soTu >= 18) return { kho: true, doDai: 'vua', lyDo: 'cau dai' };
  if (soTu <= 6) return { kho: false, doDai: 'ngan', lyDo: 'cau ngan' };
  return { kho: false, doDai: 'vua', lyDo: 'mac dinh' };
}

/**
 * Lời dặn độ dài cho lượt này — đi cùng câu hỏi, không vào lịch sử.
 *
 * Viết như ghi chú của người dựng robot gửi riêng cho nó: model đọc nó như
 * một dòng chỉ dẫn, không đáp lại nó. Vẫn là VĂN NÓI — robot đọc thành
 * tiếng, gạch đầu dòng hay markdown thì máy đọc đọc luôn cả dấu.
 */
export function loiDanDoDai(doDai: DoDai): string {
  switch (doDai) {
    case 'ngan':
      return '[Ghi chú riêng cho Odin, không nhắc lại: câu này chỉ cần trả lời NGẮN — 1 đến 2 câu, đi thẳng vào ý.]';
    case 'dai':
      return '[Ghi chú riêng cho Odin, không nhắc lại: câu này cần trả lời ĐẦY ĐỦ — khoảng 5 đến 10 câu, mạch lạc, dễ hiểu. Vẫn là văn nói: không gạch đầu dòng, không markdown; nhiều ý thì nói "thứ nhất… thứ hai…".]';
    default:
      return '[Ghi chú riêng cho Odin, không nhắc lại: trả lời vừa phải — 2 đến 4 câu.]';
  }
}
