/**
 * ============================================================
 * FFT — nền của mọi phép đo trong Xưởng Remix
 * ============================================================
 *
 * Mọi thứ ở tầng trên — dò nhịp, dò tông, đo phổ tần để so với bài mẫu — cuối
 * cùng đều quy về "đổi một khúc sóng sang phổ tần". Viết một lần ở đây, đúng
 * một chỗ để sai.
 *
 * ─── Vì sao tự viết chứ không lấy thư viện ───
 * Đây là ~80 dòng toán đã cố định từ 1965 và không có biến thể nào để chọn sai.
 * Đổi lại là main process không phải cõng thêm một phụ thuộc gốc (native) — mà
 * phụ thuộc gốc trong Electron nghĩa là phải dựng lại cho từng phiên bản
 * Electron, từng nền, từng kiến trúc. Cái giá đó lớn hơn 80 dòng này nhiều.
 *
 * ⚠️ CHỈ nhận độ dài là LUỸ THỪA CỦA 2. Đây là radix-2; đưa vào 1000 mẫu thì
 * kết quả KHÔNG sai kiểu nổ ra lỗi, nó sai kiểu ra một phổ trông hợp lý mà
 * lệch hẳn. Nên `fft()` ném lỗi ngay thay vì chiều theo.
 */

/**
 * Bảng hệ số xoay, dựng một lần cho mỗi kích thước rồi giữ lại.
 *
 * Cách rẻ hơn là tính hệ số bằng phép nhân dồn (`c *= w` mỗi vòng). Nhưng sai
 * số làm tròn cộng dồn theo từng bước, và ở n = 4096 nó đủ lớn để đẩy đỉnh phổ
 * lệch sang ô bên cạnh — đúng cái làm hỏng phép dò tông. Bảng tra tốn vài chục
 * KB và không có sai số cộng dồn.
 */
const BANG = new Map<number, { cos: Float64Array; sin: Float64Array }>();

function bangXoay(n: number): { cos: Float64Array; sin: Float64Array } {
  const co = BANG.get(n);
  if (co) return co;
  const cos = new Float64Array(n / 2);
  const sin = new Float64Array(n / 2);
  for (let i = 0; i < n / 2; i++) {
    const goc = (-2 * Math.PI * i) / n;
    cos[i] = Math.cos(goc);
    sin[i] = Math.sin(goc);
  }
  const moi = { cos, sin };
  BANG.set(n, moi);
  return moi;
}

export function laLuyThua2(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}

/**
 * FFT tại chỗ. `re` và `im` bị GHI ĐÈ bằng kết quả.
 *
 * Truyền `im` toàn số 0 cho tín hiệu thực (mọi tín hiệu âm thanh).
 */
export function fft(re: Float64Array, im: Float64Array): void {
  const n = re.length;
  if (n !== im.length) throw new Error('fft: phần thực và phần ảo phải cùng độ dài');
  if (!laLuyThua2(n)) throw new Error(`fft: độ dài phải là luỹ thừa của 2, nhận ${n}`);
  if (n === 1) return;

  // Đảo bit: xếp lại thứ tự mẫu để phần gộp ở dưới chạy tại chỗ được.
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; (j & bit) !== 0; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      const tr = re[i]!; re[i] = re[j]!; re[j] = tr;
      const ti = im[i]!; im[i] = im[j]!; im[j] = ti;
    }
  }

  const { cos, sin } = bangXoay(n);
  for (let dai = 2; dai <= n; dai <<= 1) {
    const nua = dai >> 1;
    const buoc = n / dai;
    for (let dau = 0; dau < n; dau += dai) {
      for (let k = 0; k < nua; k++) {
        const w = k * buoc;
        const wr = cos[w]!;
        const wi = sin[w]!;
        const a = dau + k;
        const b = a + nua;
        const vr = re[b]! * wr - im[b]! * wi;
        const vi = re[b]! * wi + im[b]! * wr;
        re[b] = re[a]! - vr;
        im[b] = im[a]! - vi;
        re[a] = re[a]! + vr;
        im[a] = im[a]! + vi;
      }
    }
  }
}

/**
 * Phổ biên độ của một khung đã nhân cửa sổ. Trả về `n/2 + 1` ô (tới Nyquist).
 *
 * Nhận `Float32Array` vì âm thanh vào ở dạng đó, tính bằng `Float64Array` vì
 * FFT cộng dồn hàng nghìn phép nhân và độ chính xác 32-bit không đủ cho phần
 * đuôi phổ — chỗ mà phép dò tông đọc.
 */
export function phoBienDo(khung: Float32Array): Float64Array {
  const n = khung.length;
  const re = new Float64Array(n);
  const im = new Float64Array(n);
  for (let i = 0; i < n; i++) re[i] = khung[i]!;
  fft(re, im);
  const ra = new Float64Array(n / 2 + 1);
  for (let i = 0; i < ra.length; i++) ra[i] = Math.hypot(re[i]!, im[i]!);
  return ra;
}

/**
 * Cửa sổ Hann, dựng sẵn theo kích thước.
 *
 * Không nhân cửa sổ thì hai mép khung bị cắt cụt, và chỗ đứt gãy đó sinh ra
 * một dải nhiễu trải khắp phổ (rò phổ) — đủ để dìm mất hài âm thật của một nốt
 * trầm. Hann là lựa chọn mặc định đúng cho cả dò nhịp lẫn dò tông.
 */
const CUA_SO = new Map<number, Float32Array>();

export function cuaSoHann(n: number): Float32Array {
  const co = CUA_SO.get(n);
  if (co) return co;
  const w = new Float32Array(n);
  // Chia cho (n-1) chứ không phải n: đây là dạng ĐỐI XỨNG, hai đầu chạm đúng 0.
  for (let i = 0; i < n; i++) w[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (n - 1));
  CUA_SO.set(n, w);
  return w;
}

/** Nhân cửa sổ vào một khung, trả về khung mới (không đụng bản gốc). */
export function nhanCuaSo(khung: Float32Array): Float32Array {
  const w = cuaSoHann(khung.length);
  const ra = new Float32Array(khung.length);
  for (let i = 0; i < khung.length; i++) ra[i] = khung[i]! * w[i]!;
  return ra;
}
