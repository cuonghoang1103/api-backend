/**
 * ============================================================
 * BỘ LỌC HAI CỰC — nền của EQ và của mọi phép dò theo dải tần
 * ============================================================
 *
 * Một biquad (hai cực, hai không) là viên gạch nhỏ nhất dựng được gần như mọi
 * bộ lọc âm thanh thực dụng: chắn trầm, kệ, đỉnh. Xếp nối tiếp nhiều viên là
 * ra một EQ đầy đủ.
 *
 * Công thức thiết kế lấy từ "Cookbook formulae for audio EQ biquad filter
 * coefficients" của Robert Bristow-Johnson — bản mà mọi thứ từ Web Audio API
 * tới các plugin thương mại đều dùng. Không tự nghĩ ra ở đây, và không nên:
 * chúng đã được đối chiếu suốt hai mươi năm.
 *
 * ─── Vì sao PHA TỐI THIỂU ở đây lại đúng, trong khi master cần PHA TUYẾN TÍNH ───
 * `master.ts` dựng bộ lọc khớp phổ bằng FIR pha tuyến tính, và tệp đó giải
 * thích vì sao: lệch pha giữa các dải làm cú kick mất lực trong khi bảng số
 * vẫn "đúng". Ở ĐÂY thì ngược lại — biquad IIR (pha tối thiểu) mới là thứ
 * đúng việc:
 *
 *   · Nó rẻ. Trộn 4 stem × vài bộ lọc mỗi stem, chạy trên CPU máy người dùng.
 *   · Nó KHÔNG trễ. FIR pha tuyến tính trễ nửa chiều dài nhân lọc; trộn nhiều
 *     đường với độ trễ khác nhau là làm lệch pha giữa các stem — đúng thứ tai
 *     nghe ra ngay ở phần trầm.
 *   · Người mix vẫn luôn dùng EQ pha tối thiểu ở khâu này. Pha tuyến tính chỉ
 *     hợp ở khâu master, nơi nó xử lý MỘT đường duy nhất và độ trễ không sánh
 *     với gì cả.
 *
 * ─── ⚠️ XẾP NỐI TIẾP HAI BỘ GIỐNG NHAU KHÔNG PHẢI LÀ "DỐC GẤP ĐÔI" ───
 * Hai bộ chắn trầm 12 dB/quãng tám nối nhau cho dốc 24 dB/quãng tám, nhưng
 * điểm −3 dB DỊCH LÊN (mỗi bộ đã −3 dB tại f0, nối lại thành −6 dB), và cộng
 * hưởng ở Q cao thì nhân lên bình phương. Muốn Butterworth bậc 4 thật thì hai
 * tầng phải có Q khác nhau (0,5412 và 1,3066), không phải cùng 1/√2. `chanTramBac4`
 * làm đúng chuyện đó.
 */

/** Hệ số một tầng biquad, đã chuẩn hoá theo a0. */
export interface HeSo { b0: number; b1: number; b2: number; a1: number; a2: number }

/**
 * Lọc xuôi một lần, dạng trực tiếp II CHUYỂN VỊ.
 *
 * Chọn dạng chuyển vị chứ không phải dạng trực tiếp I hay II thường: với số
 * thực dấu phẩy động nó là dạng ít tích luỹ sai số nhất trong bốn dạng, và
 * chênh lệch thấy rõ ở bộ lọc tần số thấp (Q cao, cực gần vòng đơn vị) — đúng
 * loại bộ lọc mà phần trầm của nhạc sàn cần.
 */
export function loc(x: Float32Array, h: HeSo): Float32Array {
  const y = new Float32Array(x.length);
  let z1 = 0;
  let z2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = x[i]!;
    const ra = h.b0 * v + z1;
    z1 = h.b1 * v - h.a1 * ra + z2;
    z2 = h.b2 * v - h.a2 * ra;
    y[i] = ra;
  }
  return y;
}

/** Xếp nối tiếp: lọc qua từng tầng theo thứ tự. */
export function locChuoi(x: Float32Array, hs: readonly HeSo[]): Float32Array {
  let y = x;
  for (const h of hs) y = loc(y, h);
  return y;
}

/* ── Thiết kế ─────────────────────────────────────────────── */

/** Ba đại lượng trung gian dùng chung cho mọi công thức cookbook. */
function nen(f0: number, q: number, fs: number): { w: number; c: number; s: number; al: number } {
  /* Chặn f0 dưới Nyquist. Không chặn thì `Math.sin` vẫn trả về số, bộ lọc vẫn
     chạy, và thứ đi ra là nhiễu — một lỗi im lặng thay vì một lỗi nói được. */
  const w = (2 * Math.PI * Math.min(Math.max(f0, 1), fs * 0.49)) / fs;
  const c = Math.cos(w);
  const s = Math.sin(w);
  return { w, c, s, al: s / (2 * Math.max(q, 1e-4)) };
}

/** Chắn trầm (high-pass) 12 dB/quãng tám. `q = 1/√2` là Butterworth. */
export function chanTram(f0: number, fs: number, q = Math.SQRT1_2): HeSo {
  const { c, al } = nen(f0, q, fs);
  const a0 = 1 + al;
  return {
    b0: ((1 + c) / 2) / a0,
    b1: (-(1 + c)) / a0,
    b2: ((1 + c) / 2) / a0,
    a1: (-2 * c) / a0,
    a2: (1 - al) / a0,
  };
}

/** Chắn cao (low-pass) 12 dB/quãng tám. */
export function chanCao(f0: number, fs: number, q = Math.SQRT1_2): HeSo {
  const { c, al } = nen(f0, q, fs);
  const a0 = 1 + al;
  return {
    b0: ((1 - c) / 2) / a0,
    b1: (1 - c) / a0,
    b2: ((1 - c) / 2) / a0,
    a1: (-2 * c) / a0,
    a2: (1 - al) / a0,
  };
}

/**
 * Chắn trầm Butterworth BẬC 4 — hai tầng, hai Q KHÁC NHAU.
 *
 * Đây là thứ dùng để dọn phần trầm rò sang các stem không phải bass: bộ tách
 * stem để lọt một ít năng lượng trầm vào giọng hát và nhạc nền, và khi trộn
 * lại thì những phần trầm ấy chồng lên nhau thành một khối đục. Dốc 12 dB/qng
 * tám cắt chưa đủ dứt; 24 dB/qng tám thì dứt khoát mà vẫn không nghe ra chỗ
 * cắt.
 *
 * Hai Q lấy từ nghiệm của đa thức Butterworth bậc 4: 1/(2cos(π/8)) và
 * 1/(2cos(3π/8)). Dùng cùng một Q cho cả hai tầng là sai — xem đầu tệp.
 */
export function chanTramBac4(f0: number, fs: number): [HeSo, HeSo] {
  return [
    chanTram(f0, fs, 1 / (2 * Math.cos(Math.PI / 8))),
    chanTram(f0, fs, 1 / (2 * Math.cos((3 * Math.PI) / 8))),
  ];
}

/** Chắn cao Butterworth bậc 4 — cặp đôi của `chanTramBac4`, cùng hai Q. */
export function chanCaoBac4(f0: number, fs: number): [HeSo, HeSo] {
  return [
    chanCao(f0, fs, 1 / (2 * Math.cos(Math.PI / 8))),
    chanCao(f0, fs, 1 / (2 * Math.cos((3 * Math.PI) / 8))),
  ];
}

/** Kệ trầm: nâng/hạ toàn bộ phần dưới `f0` đi `db`. */
export function keTram(f0: number, db: number, fs: number, q = Math.SQRT1_2): HeSo {
  const A = Math.pow(10, db / 40);
  const { c, al } = nen(f0, q, fs);
  const rA = 2 * Math.sqrt(A) * al;
  const a0 = (A + 1) + (A - 1) * c + rA;
  return {
    b0: (A * ((A + 1) - (A - 1) * c + rA)) / a0,
    b1: (2 * A * ((A - 1) - (A + 1) * c)) / a0,
    b2: (A * ((A + 1) - (A - 1) * c - rA)) / a0,
    a1: (-2 * ((A - 1) + (A + 1) * c)) / a0,
    a2: ((A + 1) + (A - 1) * c - rA) / a0,
  };
}

/** Kệ cao: nâng/hạ toàn bộ phần trên `f0` đi `db`. */
export function keCao(f0: number, db: number, fs: number, q = Math.SQRT1_2): HeSo {
  const A = Math.pow(10, db / 40);
  const { c, al } = nen(f0, q, fs);
  const rA = 2 * Math.sqrt(A) * al;
  const a0 = (A + 1) - (A - 1) * c + rA;
  return {
    b0: (A * ((A + 1) + (A - 1) * c + rA)) / a0,
    b1: (-2 * A * ((A - 1) + (A + 1) * c)) / a0,
    b2: (A * ((A + 1) + (A - 1) * c - rA)) / a0,
    a1: (2 * ((A - 1) - (A + 1) * c)) / a0,
    a2: ((A + 1) - (A - 1) * c - rA) / a0,
  };
}

/** Đỉnh (peaking): nâng/hạ một dải quanh `f0`. Q lớn = dải hẹp. */
export function dinh(f0: number, db: number, fs: number, q = 1): HeSo {
  const A = Math.pow(10, db / 40);
  const { c, al } = nen(f0, q, fs);
  const a0 = 1 + al / A;
  return {
    b0: (1 + al * A) / a0,
    b1: (-2 * c) / a0,
    b2: (1 - al * A) / a0,
    a1: (-2 * c) / a0,
    a2: (1 - al / A) / a0,
  };
}

/**
 * Biên độ đáp tuyến tại một tần số, dB.
 *
 * Có hàm này thì phép kiểm nói được điều đáng nói — "bộ chắn trầm 100 Hz phải
 * −3 dB tại 100 Hz và gần 0 dB tại 1 kHz" — thay vì so từng hệ số với một
 * bảng số chép tay mà không ai đọc ra được ý nghĩa. Một hệ số gõ nhầm dấu vẫn
 * "khớp bảng" nếu bảng ấy cũng chép từ chính mã đang sai.
 */
export function bienDo(h: HeSo, f: number, fs: number): number {
  const w = (2 * Math.PI * f) / fs;
  const cw = Math.cos(w);
  const sw = Math.sin(w);
  const c2 = Math.cos(2 * w);
  const s2 = Math.sin(2 * w);
  const tuR = h.b0 + h.b1 * cw + h.b2 * c2;
  const tuI = -(h.b1 * sw + h.b2 * s2);
  const mauR = 1 + h.a1 * cw + h.a2 * c2;
  const mauI = -(h.a1 * sw + h.a2 * s2);
  const tu = Math.hypot(tuR, tuI);
  const mau = Math.hypot(mauR, mauI);
  return 20 * Math.log10(Math.max(tu / Math.max(mau, 1e-12), 1e-12));
}

/** Biên độ của cả một chuỗi tầng, dB (cộng dồn vì nối tiếp). */
export function bienDoChuoi(hs: readonly HeSo[], f: number, fs: number): number {
  return hs.reduce((s, h) => s + bienDo(h, f, fs), 0);
}
