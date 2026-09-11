/**
 * Kiểm dò nhịp và dò tông bằng tín hiệu dựng sẵn, biết trước đáp án.
 *
 * ⚠️ Những phép kiểm này dùng tín hiệu SẠCH — chuỗi tiếng gõ đều tăm tắp, sóng
 * sin thuần. Chúng chứng minh phần TOÁN đúng, KHÔNG chứng minh thuật toán chạy
 * tốt trên nhạc thật. Nhạc thật có tiếng ngân, tiếng đệm, đổi nhịp, và bộ dò
 * tông vẫn sẽ sai khoảng một nửa số lần như đã ghi ở đầu `nhipVaTong.ts`.
 * Đừng đọc bảng xanh ở đây rồi kết luận là xong việc.
 */
import { describe, expect, it } from 'vitest';
import { chotBoiSo, doNhip, doTong, sacDo } from './nhipVaTong';

const FS = 44100;

/** Chuỗi tiếng gõ đều ở `bpm`, mỗi tiếng là một xung ngắn có đuôi tắt dần. */
function chuoiGo(bpm: number, giay: number, fs = FS): Float32Array {
  const x = new Float32Array(Math.round(giay * fs));
  const buoc = (60 / bpm) * fs;
  const duoi = Math.round(0.02 * fs);
  for (let n = 0; n * buoc < x.length; n++) {
    const dau = Math.round(n * buoc);
    for (let i = 0; i < duoi && dau + i < x.length; i++) {
      // Nhiễu tắt dần: phổ rộng nên sinh ra bước nhảy năng lượng rõ ở mọi dải,
      // đúng như tiếng trống thật.
      x[dau + i] = (Math.random() * 2 - 1) * Math.exp(-i / (duoi / 4));
    }
  }
  return x;
}

describe('chốt bội số', () => {
  it('kéo 70 lên 140 — cái bẫy kinh điển của nhạc vinahouse', () => {
    expect(chotBoiSo(70)).toBeCloseTo(140, 6);
  });

  it('hạ 280 xuống 140', () => {
    expect(chotBoiSo(280)).toBeCloseTo(140, 6);
  });

  it('số đã nằm trong dải thì để nguyên', () => {
    expect(chotBoiSo(128)).toBeCloseTo(128, 6);
    expect(chotBoiSo(175)).toBeCloseTo(175, 6);
  });

  it('đổi được dải khi cần — nhạc chậm có dải khác', () => {
    expect(chotBoiSo(140, 60, 100)).toBeCloseTo(70, 6);
  });

  it('⛔ dữ liệu rác KHÔNG làm treo vòng lặp', () => {
    expect(chotBoiSo(0)).toBe(0);
    expect(chotBoiSo(-5)).toBe(0);
    expect(chotBoiSo(NaN)).toBe(0);
    expect(chotBoiSo(1e-9)).toBeLessThan(90); // chạm trần 8 vòng rồi dừng
  });
});

describe('dò nhịp', () => {
  it('chuỗi gõ 140 BPM ⇒ dò ra 140', () => {
    const kq = doNhip(chuoiGo(140, 20), FS);
    expect(kq.bpm).toBeGreaterThan(138.5);
    expect(kq.bpm).toBeLessThan(141.5);
  });

  it('chuỗi gõ 128 BPM ⇒ dò ra 128', () => {
    const kq = doNhip(chuoiGo(128, 20), FS);
    expect(kq.bpm).toBeGreaterThan(126.5);
    expect(kq.bpm).toBeLessThan(129.5);
  });

  it('nội suy parabol đưa sai số xuống dưới 1 BPM', () => {
    // Không có nội suy thì lag nguyên gần 140 nhất cho 139,7 hoặc 143,6.
    const kq = doNhip(chuoiGo(140, 25), FS);
    expect(Math.abs(kq.bpm - 140)).toBeLessThan(1);
  });

  it('tiếng gõ đều thì tin cậy cao', () => {
    expect(doNhip(chuoiGo(140, 20), FS).tinCay).toBeGreaterThan(0.3);
  });

  it('⚠️ tiếng ù không nhịp thì tin cậy THẤP — đây là lúc phải ngờ kết quả', () => {
    const u = new Float32Array(FS * 10);
    for (let i = 0; i < u.length; i++) u[i] = 0.3 * Math.sin((2 * Math.PI * 220 * i) / FS);
    expect(doNhip(u, FS).tinCay).toBeLessThan(0.3);
  });

  it('tín hiệu quá ngắn trả 0 chứ không đoán bừa', () => {
    expect(doNhip(new Float32Array(1000), FS).bpm).toBe(0);
  });
});

describe('sắc đồ', () => {
  it('sóng sin ở La dồn năng lượng vào đúng ô La', () => {
    const n = FS * 3;
    const x = new Float32Array(n);
    for (let i = 0; i < n; i++) x[i] = 0.5 * Math.sin((2 * Math.PI * 880 * i) / FS);
    const s = sacDo(x, FS);
    let troi = 0;
    for (let i = 0; i < 12; i++) if (s[i]! > s[troi]!) troi = i;
    expect(troi).toBe(9); // 9 = La
  });
});

describe('dò tông', () => {
  /** Dựng tín hiệu có phân bố cao độ đúng theo mẫu tông Đô trưởng. */
  function theoMauDoTruong(giay: number): Float32Array {
    const mau = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
    const n = Math.round(giay * FS);
    const x = new Float32Array(n);
    for (let pc = 0; pc < 12; pc++) {
      // Quãng tám thứ 5 (Đô5 = 523 Hz): đủ cao để hai nửa cung cách nhau nhiều
      // ô phổ, nên rò phổ không tràn sang nốt bên cạnh.
      const f = 523.25 * Math.pow(2, pc / 12);
      // Biên độ theo căn của mẫu, vì sắc đồ cộng BÌNH PHƯƠNG biên độ.
      const a = Math.sqrt(mau[pc]!) * 0.05;
      for (let i = 0; i < n; i++) x[i] = x[i]! + a * Math.sin((2 * Math.PI * f * i) / FS);
    }
    return x;
  }

  it('phân bố đúng mẫu Đô trưởng ⇒ dò ra Đô trưởng', () => {
    const kq = doTong(theoMauDoTruong(4), FS);
    expect(kq.chuAm).toBe(0);
    expect(kq.the).toBe('truong');
  });

  it('luôn trả kèm độ tin cậy và đáp án xếp nhì', () => {
    const kq = doTong(theoMauDoTruong(4), FS);
    expect(kq.tinCay).toBeGreaterThanOrEqual(0);
    expect(kq.tinCay).toBeLessThanOrEqual(1);
    expect(kq.nhi).not.toBeNull();
  });

  it('⚠️ tiếng ù một nốt cho tin cậy THẤP — giao diện phải hiện điều này', () => {
    const n = FS * 3;
    const x = new Float32Array(n);
    for (let i = 0; i < n; i++) x[i] = 0.4 * Math.sin((2 * Math.PI * 261.63 * i) / FS);
    // Một nốt đơn độc KHÔNG đủ để biết tông: Đô có mặt trong rất nhiều tông.
    expect(doTong(x, FS).tinCay).toBeLessThan(0.5);
  });

  it('tín hiệu quá ngắn không nổ', () => {
    const kq = doTong(new Float32Array(100), FS);
    expect(kq.tinCay).toBe(0);
  });
});
