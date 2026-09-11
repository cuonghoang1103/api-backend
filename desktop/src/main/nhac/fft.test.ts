/**
 * Kiểm FFT bằng những tín hiệu biết trước đáp án.
 *
 * FFT sai thì KHÔNG có gì nổ ra — nó vẫn trả về một mảng số trông hợp lý, và
 * cái sai chỉ lộ ra ở tầng trên dưới dạng "dò tông toàn sai" mà không ai truy
 * ngược được tới đây. Nên phải chốt nó bằng đáp án tính tay.
 */
import { describe, expect, it } from 'vitest';
import { cuaSoHann, fft, laLuyThua2, nhanCuaSo, phoBienDo } from './fft';

/** Sóng sin đúng `chuKy` chu kỳ trong `n` mẫu ⇒ đỉnh phải rơi gọn vào ô `chuKy`. */
function sin(n: number, chuKy: number, bienDo = 1): Float32Array {
  const x = new Float32Array(n);
  for (let i = 0; i < n; i++) x[i] = bienDo * Math.sin((2 * Math.PI * chuKy * i) / n);
  return x;
}

describe('fft', () => {
  it('đỉnh rơi đúng ô của tần số đưa vào', () => {
    const pho = phoBienDo(sin(1024, 64));
    let oDinh = 0;
    for (let i = 0; i < pho.length; i++) if (pho[i]! > pho[oDinh]!) oDinh = i;
    expect(oDinh).toBe(64);
  });

  it('biên độ đỉnh bằng n/2 lần biên độ sóng', () => {
    // Sóng sin biên độ A, dài n, không nhân cửa sổ ⇒ |X[k]| = A·n/2.
    const pho = phoBienDo(sin(512, 32, 0.5));
    expect(pho[32]!).toBeCloseTo(0.5 * 512 / 2, 1);
  });

  it('tín hiệu một chiều dồn hết vào ô 0', () => {
    const x = new Float32Array(256).fill(0.25);
    const pho = phoBienDo(x);
    expect(pho[0]!).toBeCloseTo(0.25 * 256, 3);
    for (let i = 1; i < pho.length; i++) expect(pho[i]!).toBeLessThan(1e-9);
  });

  it('giữ năng lượng (Parseval)', () => {
    const x = sin(512, 40, 0.7);
    let nangLuongThoiGian = 0;
    for (let i = 0; i < x.length; i++) nangLuongThoiGian += x[i]! * x[i]!;

    const pho = phoBienDo(x);
    // Ô 0 và ô Nyquist không có bản sao đối xứng, các ô giữa thì có ⇒ nhân 2.
    let nangLuongPho = pho[0]! ** 2 + pho[pho.length - 1]! ** 2;
    for (let i = 1; i < pho.length - 1; i++) nangLuongPho += 2 * pho[i]! ** 2;
    expect(nangLuongPho / x.length).toBeCloseTo(nangLuongThoiGian, 3);
  });

  it('⛔ từ chối độ dài không phải luỹ thừa của 2 thay vì trả kết quả sai câm', () => {
    expect(laLuyThua2(1000)).toBe(false);
    expect(laLuyThua2(1024)).toBe(true);
    expect(() => fft(new Float64Array(1000), new Float64Array(1000)))
      .toThrow(/luỹ thừa của 2/);
  });

  it('phần thực và phần ảo lệch độ dài thì báo lỗi', () => {
    expect(() => fft(new Float64Array(8), new Float64Array(16))).toThrow(/cùng độ dài/);
  });
});

describe('cửa sổ Hann', () => {
  it('hai đầu chạm 0, đối xứng, đỉnh ở giữa', () => {
    const w = cuaSoHann(64);
    expect(w[0]!).toBeCloseTo(0, 10);
    expect(w[63]!).toBeCloseTo(0, 10);
    for (let i = 0; i < 32; i++) expect(w[i]!).toBeCloseTo(w[63 - i]!, 6);
    /* KHÔNG chạm đúng 1: dạng đối xứng có đỉnh ở chỉ số (n−1)/2 = 31,5, mà đó
       không phải số nguyên. Hai mẫu sát đỉnh đạt 0,99938. Kỳ vọng "phải bằng
       1" là sai về toán chứ không phải mã hỏng. */
    expect(Math.max(...w)).toBeCloseTo(0.99938, 4);
  });

  it('nhân cửa sổ không đụng vào mảng gốc', () => {
    const goc = new Float32Array([1, 1, 1, 1]);
    const ra = nhanCuaSo(goc);
    expect(Array.from(goc)).toEqual([1, 1, 1, 1]);
    expect(ra[0]!).toBeCloseTo(0, 10);
  });

  it('bảng cửa sổ dùng lại đúng cùng một đối tượng', () => {
    expect(cuaSoHann(128)).toBe(cuaSoHann(128));
  });
});
