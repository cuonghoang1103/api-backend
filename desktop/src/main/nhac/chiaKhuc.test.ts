/**
 * Kiểm chia khúc và ghép chồng.
 *
 * Lỗi ở đây có triệu chứng đặc biệt khó truy: bài vẫn ra, vẫn nghe được, chỉ
 * là cứ vài giây lại có một vết nối, hoặc đoạn cuối nhỏ dần đi. Nghe thì ngờ
 * model kém, mà thủ phạm nằm ở phép cộng trọng số.
 */
import { describe, expect, it } from 'vitest';
import {
  CHONG_MAC_DINH, GhepChong, MAU_MOI_KHUC, catKhuc, mocKhuc, trongSoKhuc,
} from './chiaKhuc';

describe('mốc khúc', () => {
  it('bài ngắn hơn một khúc thì chỉ có một mốc', () => {
    expect(mocKhuc(1000, 4096)).toEqual([0]);
    expect(mocKhuc(4096, 4096)).toEqual([0]);
  });

  it('bước nhảy đúng bằng 75% khúc khi chồng 25%', () => {
    const m = mocKhuc(10_000, 1000, 0.25);
    expect(m[0]).toBe(0);
    expect(m[1]).toBe(750);
    expect(m[2]).toBe(1500);
  });

  it('mốc cuối luôn nằm trong bài — phần thò ra do đệm lo', () => {
    const m = mocKhuc(10_000, 1000, 0.25);
    expect(m[m.length - 1]!).toBeLessThan(10_000);
  });

  it('mọi mẫu đều được ít nhất một khúc phủ tới', () => {
    const soMau = 9_999;
    const dai = 1024;
    const m = mocKhuc(soMau, dai, CHONG_MAC_DINH);
    const phu = new Uint8Array(soMau);
    for (const d of m) for (let i = d; i < Math.min(d + dai, soMau); i++) phu[i] = 1;
    expect(Array.from(phu).every((v) => v === 1)).toBe(true);
  });

  it('bài rỗng thì không có mốc nào', () => {
    expect(mocKhuc(0, 1024)).toEqual([]);
  });

  it('⛔ chồng ≥ 1 thì báo lỗi thay vì sinh vô hạn mốc', () => {
    expect(() => mocKhuc(1000, 100, 1)).toThrow(/chong/);
    expect(() => mocKhuc(1000, 100, -0.5)).toThrow(/chong/);
  });

  it('hằng số khúc khớp hợp đồng htdemucs: 7,8 s ở 44,1 kHz', () => {
    expect(MAU_MOI_KHUC).toBe(Math.round(7.8 * 44_100));
  });
});

describe('trọng số khúc', () => {
  it('đỉnh ở giữa, thấp nhất ở hai mép', () => {
    const w = trongSoKhuc(100);
    expect(w[49]!).toBeCloseTo(1, 6);
    expect(w[0]!).toBeLessThan(0.05);
    expect(w[99]!).toBeLessThan(0.05);
  });

  it('⛔ mép KHÁC 0 — nếu bằng 0 thì mẫu đầu bài chia cho 0', () => {
    const w = trongSoKhuc(100);
    expect(w[0]!).toBeGreaterThan(0);
    expect(w[99]!).toBeGreaterThan(0);
  });

  it('đối xứng', () => {
    const w = trongSoKhuc(64);
    for (let i = 0; i < 32; i++) expect(w[i]!).toBeCloseTo(w[63 - i]!, 6);
  });

  it('khúc quá ngắn thì báo lỗi', () => {
    expect(() => trongSoKhuc(1)).toThrow(/ít nhất 2 mẫu/);
  });
});

describe('cắt khúc', () => {
  it('cắt đúng đoạn giữa bài', () => {
    const x = Float32Array.from({ length: 10 }, (_, i) => i);
    expect(Array.from(catKhuc([x], 3, 4)[0]!)).toEqual([3, 4, 5, 6]);
  });

  it('đệm 0 cho phần thò ra khỏi bài, và vẫn đủ độ dài', () => {
    const x = Float32Array.from({ length: 10 }, (_, i) => i + 1);
    const k = catKhuc([x], 8, 4)[0]!;
    expect(k.length).toBe(4);
    expect(Array.from(k)).toEqual([9, 10, 0, 0]);
  });

  it('cắt song song nhiều kênh', () => {
    const a = Float32Array.from([1, 2, 3, 4]);
    const b = Float32Array.from([5, 6, 7, 8]);
    const k = catKhuc([a, b], 1, 2);
    expect(Array.from(k[0]!)).toEqual([2, 3]);
    expect(Array.from(k[1]!)).toEqual([6, 7]);
  });
});

describe('ghép chồng', () => {
  /**
   * Phép kiểm quan trọng nhất của cả tệp: cho một "model" trả lại y nguyên đầu
   * vào, thì chia khúc rồi ghép lại phải ra ĐÚNG tín hiệu ban đầu.
   *
   * Nó bắt được cùng lúc: lệch chỉ số, trọng số cộng sai, quên đệm, và bỏ sót
   * mẫu ở khúc cuối.
   */
  it('model đồng nhất ⇒ tái tạo chính xác tín hiệu gốc', () => {
    const soMau = 5_000;
    const dai = 512;
    const goc = Float32Array.from({ length: soMau }, (_, i) => Math.sin(i / 30) * 0.8);

    const ghep = new GhepChong(soMau, 1, dai);
    for (const d of mocKhuc(soMau, dai, 0.25)) ghep.them(d, catKhuc([goc], d, dai));
    const ra = ghep.ketThuc()[0]!;

    expect(ghep.mauHong()).toEqual([]);
    for (let i = 0; i < soMau; i++) expect(ra[i]!).toBeCloseTo(goc[i]!, 5);
  });

  it('tái tạo chính xác cả khi bài KHÔNG chia hết cho bước nhảy', () => {
    // Độ dài lẻ là chỗ khúc cuối thò ra nhiều nhất.
    const soMau = 4_097;
    const dai = 500;
    const goc = Float32Array.from({ length: soMau }, (_, i) => ((i * 37) % 101) / 101 - 0.5);

    const ghep = new GhepChong(soMau, 1, dai);
    for (const d of mocKhuc(soMau, dai, 0.25)) ghep.them(d, catKhuc([goc], d, dai));
    const ra = ghep.ketThuc()[0]!;

    expect(ghep.mauHong()).toEqual([]);
    for (let i = 0; i < soMau; i++) expect(ra[i]!).toBeCloseTo(goc[i]!, 5);
  });

  it('bài ngắn hơn một khúc vẫn tái tạo đúng', () => {
    const soMau = 100;
    const dai = 512;
    const goc = Float32Array.from({ length: soMau }, (_, i) => i / 100);

    const ghep = new GhepChong(soMau, 1, dai);
    ghep.them(0, catKhuc([goc], 0, dai));
    const ra = ghep.ketThuc()[0]!;

    expect(ghep.mauHong()).toEqual([]);
    for (let i = 0; i < soMau; i++) expect(ra[i]!).toBeCloseTo(goc[i]!, 5);
  });

  it('ghép nhiều mặt phẳng độc lập với nhau', () => {
    const soMau = 2_000;
    const dai = 256;
    const a = Float32Array.from({ length: soMau }, (_, i) => Math.sin(i / 10));
    const b = Float32Array.from({ length: soMau }, (_, i) => Math.cos(i / 7));

    const ghep = new GhepChong(soMau, 2, dai);
    for (const d of mocKhuc(soMau, dai, 0.25)) {
      ghep.them(d, [catKhuc([a], d, dai)[0]!, catKhuc([b], d, dai)[0]!]);
    }
    const [ra, rb] = ghep.ketThuc();
    for (let i = 0; i < soMau; i++) {
      expect(ra![i]!).toBeCloseTo(a[i]!, 5);
      expect(rb![i]!).toBeCloseTo(b[i]!, 5);
    }
  });

  it('⛔ góp sai số mặt hoặc sai độ dài thì báo lỗi ngay', () => {
    const ghep = new GhepChong(100, 2, 64);
    expect(() => ghep.them(0, [new Float32Array(64)])).toThrow(/cần 2 mặt/);
    expect(() => ghep.them(0, [new Float32Array(64), new Float32Array(32)]))
      .toThrow(/phải dài 64 mẫu/);
  });

  it('mauHong() chỉ ra mẫu chưa được phủ thay vì để lặng câm', () => {
    // Cố tình bỏ khúc thứ hai.
    const ghep = new GhepChong(2_000, 1, 256);
    ghep.them(0, [new Float32Array(256)]);
    const hong = ghep.mauHong();
    expect(hong.length).toBeGreaterThan(0);
    expect(hong[0]!).toBe(256);
  });
});
