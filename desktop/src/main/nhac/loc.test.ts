/**
 * Kiểm bộ lọc hai cực.
 *
 * ⭐ Phép kiểm ĐÁNG NHẤT ở đây là `bienDo() khớp với âm thật đi qua loc()`:
 * nó buộc hai thứ độc lập phải đồng ý với nhau. Công thức đáp tuyến sai dấu
 * vẫn "tự nhất quán" nếu chỉ đem so với chính nó, còn một sin thật chạy qua
 * bộ lọc thật thì không nói dối được. Mọi phép kiểm còn lại đứng được là nhờ
 * phép này — chúng đều đo bằng `bienDo()`.
 */
import { describe, expect, it } from 'vitest';
import {
  bienDo, bienDoChuoi, chanCao, chanTram, chanTramBac4, dinh, keCao, keTram, loc, locChuoi,
} from './loc';

const FS = 48000;

function sin(hz: number, n = FS, fs = FS): Float32Array {
  const x = new Float32Array(n);
  for (let i = 0; i < n; i++) x[i] = Math.sin((2 * Math.PI * hz * i) / fs);
  return x;
}

/**
 * Biên độ của nửa sau tín hiệu, đo bằng RMS×√2 — bỏ nửa đầu để bộ lọc ổn định.
 *
 * ⚠️ KHÔNG đo bằng đỉnh mẫu. Bản đầu của tệp này làm thế và phép kiểm chuỗi
 * lệch 0,50 dB: 8000 Hz ở 48 kHz là ĐÚNG 6 mẫu một chu kỳ, nên các mẫu rơi mãi
 * vào 0°, 60°, 120°… và đỉnh lấy được chỉ là sin 60° = 0,866 — thấp hơn biên
 * độ thật 1,25 dB, mãi mãi, không bao giờ trôi. Ở những tần số không chia chẵn
 * thì pha trôi dần nên đỉnh gần đúng, và đó là lý do những phép kiểm khác vẫn
 * qua: một phép ĐO sai chỉ lộ ra ở đúng vài tần số.
 *
 * RMS thì đúng với sin ở mọi pha lấy mẫu, không cần may mắn.
 */
function bienDoSau(x: Float32Array): number {
  let s = 0;
  const tu = x.length >> 1;
  for (let i = tu; i < x.length; i++) s += x[i]! * x[i]!;
  return Math.sqrt(s / (x.length - tu)) * Math.SQRT2;
}

describe('bienDo() nói đúng về loc()', () => {
  it('⭐ đáp tuyến tính toán khớp âm thật đi qua bộ lọc, sai số dưới 0,15 dB', () => {
    const bo = chanTram(200, FS);
    for (const f of [50, 100, 200, 400, 1000, 5000]) {
      const ra = bienDoSau(loc(sin(f), bo));
      const doDuoc = 20 * Math.log10(ra);
      expect(Math.abs(doDuoc - bienDo(bo, f, FS))).toBeLessThan(0.15);
    }
  });

  it('đúng cả với bộ đỉnh có khuếch đại — dấu của gain không được lộn', () => {
    const bo = dinh(1000, 6, FS, 2);
    for (const f of [500, 1000, 2000]) {
      const doDuoc = 20 * Math.log10(bienDoSau(loc(sin(f), bo)));
      expect(Math.abs(doDuoc - bienDo(bo, f, FS))).toBeLessThan(0.15);
    }
    // Và nó phải NÂNG chứ không hạ: một dấu trừ lạc chỗ vẫn "khớp" phép trên.
    expect(bienDo(bo, 1000, FS)).toBeCloseTo(6, 1);
  });
});

describe('chắn trầm / chắn cao', () => {
  it('điểm cắt là −3 dB, và dốc 12 dB mỗi quãng tám', () => {
    const bo = chanTram(100, FS);
    expect(bienDo(bo, 100, FS)).toBeCloseTo(-3, 0);
    expect(bienDo(bo, 2000, FS)).toBeGreaterThan(-0.2);
    // Một quãng tám dưới điểm cắt: −12 dB (thêm −3 của chính điểm cắt).
    expect(bienDo(bo, 50, FS)).toBeLessThan(-11);
    expect(bienDo(bo, 50, FS)).toBeGreaterThan(-14);
  });

  it('chắn cao là ảnh gương của chắn trầm', () => {
    const bo = chanCao(1000, FS);
    expect(bienDo(bo, 1000, FS)).toBeCloseTo(-3, 0);
    expect(bienDo(bo, 100, FS)).toBeGreaterThan(-0.2);
    expect(bienDo(bo, 2000, FS)).toBeLessThan(-11);
  });

  it('không sinh NaN khi tần số cắt bị đẩy quá Nyquist', () => {
    // Người dùng gõ 30000 vào ô tần số là chuyện có thật. Không chặn thì bộ
    // lọc vẫn chạy và thứ đi ra là nhiễu — lỗi im lặng, khó truy nhất.
    const ra = loc(sin(1000, 2048), chanTram(99999, FS));
    expect(ra.every((v) => Number.isFinite(v))).toBe(true);
  });
});

describe('chắn trầm bậc 4', () => {
  it('⭐ vẫn −3 dB tại điểm cắt — hai tầng KHÔNG được cùng một Q', () => {
    /* Đây là phép kiểm bắt đúng cái bẫy ghi ở đầu `loc.ts`: xếp hai bộ
       Butterworth bậc 2 giống hệt nhau cho −6 dB tại f0, không phải −3. Nó
       nghe ra như "chắn trầm ăn mất cả phần dưới", và nhìn mã thì không thấy
       gì sai vì mỗi tầng đều đúng. */
    const bo = chanTramBac4(100, FS);
    expect(bienDoChuoi(bo, 100, FS)).toBeCloseTo(-3, 0);
  });

  it('dốc gấp đôi bậc 2: khoảng −24 dB một quãng tám dưới điểm cắt', () => {
    const b4 = chanTramBac4(100, FS);
    const b2 = chanTram(100, FS);
    const d4 = bienDoChuoi(b4, 50, FS);
    const d2 = bienDo(b2, 50, FS);
    expect(d4).toBeLessThan(-22);
    expect(d4).toBeGreaterThan(-27);
    expect(d4).toBeLessThan(d2 - 9);
  });

  it('không đụng gì tới phần trên điểm cắt', () => {
    expect(bienDoChuoi(chanTramBac4(80, FS), 2000, FS)).toBeGreaterThan(-0.2);
  });
});

describe('kệ và đỉnh', () => {
  it('kệ trầm nâng đúng số dB ở dưới, không đụng phần trên', () => {
    const bo = keTram(120, 6, FS);
    expect(bienDo(bo, 20, FS)).toBeCloseTo(6, 0);
    expect(bienDo(bo, 8000, FS)).toBeCloseTo(0, 1);
    // Giữa kệ là đúng một nửa mức nâng — định nghĩa của điểm f0 với kệ.
    expect(bienDo(bo, 120, FS)).toBeCloseTo(3, 0);
  });

  it('kệ cao nâng đúng số dB ở trên, không đụng phần dưới', () => {
    const bo = keCao(6000, -4, FS);
    expect(bienDo(bo, 20000, FS)).toBeCloseTo(-4, 0);
    expect(bienDo(bo, 100, FS)).toBeCloseTo(0, 1);
  });

  it('đỉnh chỉ đụng quanh f0, và Q lớn thì dải hẹp lại', () => {
    const rong = dinh(1000, 6, FS, 0.7);
    const hep = dinh(1000, 6, FS, 6);
    expect(bienDo(hep, 1000, FS)).toBeCloseTo(6, 1);
    expect(bienDo(rong, 1000, FS)).toBeCloseTo(6, 1);
    // Cách một quãng tám: bộ hẹp phải đã trở về gần 0, bộ rộng thì chưa.
    expect(bienDo(hep, 2000, FS)).toBeLessThan(bienDo(rong, 2000, FS));
    expect(bienDo(hep, 2000, FS)).toBeLessThan(1);
  });

  it('hạ và nâng cùng một lượng thì bù nhau', () => {
    const chuoi = [dinh(800, 5, FS, 1.4), dinh(800, -5, FS, 1.4)];
    for (const f of [100, 800, 5000]) expect(bienDoChuoi(chuoi, f, FS)).toBeCloseTo(0, 5);
  });
});

describe('locChuoi', () => {
  it('chuỗi rỗng trả về đúng tín hiệu vào', () => {
    const x = sin(440, 128);
    expect(Array.from(locChuoi(x, []))).toEqual(Array.from(x));
  });

  it('lọc nối tiếp cho kết quả như cộng dB của từng tầng', () => {
    const chuoi = [chanTram(100, FS), keCao(5000, 3, FS)];
    const doDuoc = 20 * Math.log10(bienDoSau(locChuoi(sin(8000), chuoi)));
    expect(Math.abs(doDuoc - bienDoChuoi(chuoi, 8000, FS))).toBeLessThan(0.2);
  });
});
