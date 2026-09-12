/**
 * Kiểm kéo giãn nhịp và đổi cao độ.
 *
 * Hai phép biến đổi này có một tính chất rất tiện để kiểm: chúng ĐỊNH NGHĨA
 * bằng thứ phải giữ nguyên. Kéo giãn phải giữ CAO ĐỘ; đổi cao độ phải giữ ĐỘ
 * DÀI. Cả hai đều đo được bằng FFT đã có sẵn, nên đây không phải "chạy không
 * nổ là xong" — mỗi phép kiểm hỏi đúng câu hỏi của thuật toán.
 */
import { describe, expect, it } from 'vitest';
import { phoBienDo } from './fft';
import {
  chinhBai, doiCaoDo, doiTanSoMau, docTheoToc, keoGian, tiLeCaoDo, tiLeTuBpm,
} from './keoGian';

const FS = 44100;

function sin(giay: number, hz: number, bienDo = 0.5): Float32Array {
  const n = Math.round(giay * FS);
  const x = new Float32Array(n);
  for (let i = 0; i < n; i++) x[i] = bienDo * Math.sin((2 * Math.PI * hz * i) / FS);
  return x;
}

/** Tần số trội, đo ở GIỮA tín hiệu để tránh hai mép. */
function tanSoTroi(x: Float32Array, fs = FS): number {
  const N = 8192;
  const dau = Math.max(0, Math.floor((x.length - N) / 2));
  const khung = new Float32Array(N);
  for (let i = 0; i < N && dau + i < x.length; i++) {
    // Nhân cửa sổ để đỉnh gọn lại; không có nó thì rò phổ kéo đỉnh lệch đi.
    khung[i] = x[dau + i]! * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / N));
  }
  const pho = phoBienDo(khung);
  let o = 1;
  for (let i = 2; i < pho.length; i++) if (pho[i]! > pho[o]!) o = i;
  return (o * fs) / N;
}

function rms(x: Float32Array): number {
  let t = 0;
  const dau = Math.floor(x.length * 0.2);
  const het = Math.floor(x.length * 0.8);
  for (let i = dau; i < het; i++) t += x[i]! * x[i]!;
  return Math.sqrt(t / Math.max(1, het - dau));
}

describe('tỉ lệ', () => {
  it('128 BPM về 140 BPM ⇒ bài NGẮN lại', () => {
    const t = tiLeTuBpm(128, 140);
    expect(t).toBeCloseTo(0.914, 3);
    expect(t).toBeLessThan(1);
  });

  it('140 BPM về 128 BPM ⇒ bài DÀI ra', () => {
    expect(tiLeTuBpm(140, 128)).toBeGreaterThan(1);
  });

  it('một quãng tám là tỉ lệ 2', () => {
    expect(tiLeCaoDo(12)).toBeCloseTo(2, 10);
    expect(tiLeCaoDo(-12)).toBeCloseTo(0.5, 10);
    expect(tiLeCaoDo(0)).toBe(1);
  });

  it('BPM không hợp lệ thì báo lỗi', () => {
    expect(() => tiLeTuBpm(0, 140)).toThrow(/dương/);
    expect(() => tiLeTuBpm(128, -1)).toThrow(/dương/);
  });
});

describe('đọc theo tốc độ', () => {
  it('đọc nhanh gấp đôi ⇒ ngắn một nửa VÀ cao lên một quãng tám', () => {
    const ra = docTheoToc(sin(2, 440), 2);
    expect(ra.length).toBeCloseTo(FS, -3);
    expect(tanSoTroi(ra)).toBeCloseTo(880, -1);
  });

  it('đọc chậm một nửa ⇒ dài gấp đôi VÀ trầm xuống một quãng tám', () => {
    const ra = docTheoToc(sin(1, 880), 0.5);
    expect(ra.length).toBeCloseTo(2 * FS, -3);
    expect(tanSoTroi(ra)).toBeCloseTo(440, -1);
  });

  it('tốc độ 1 trả về bản sao, không đụng mảng gốc', () => {
    const goc = sin(0.1, 440);
    const ra = docTheoToc(goc, 1);
    expect(ra).not.toBe(goc);
    expect(Array.from(ra)).toEqual(Array.from(goc));
  });

  it('⚠️ đọc nhanh KHÔNG sinh tiếng gập — nhân lọc phải hạ trần theo tốc độ', () => {
    /* Sóng 15 kHz đọc nhanh gấp 4 sẽ thành 60 kHz, vượt xa Nyquist. Không hạ
       trần nhân lọc thì nó gập ngược xuống thành một nốt lạ nghe rất rõ. Có
       hạ trần thì nó bị chặn, và phần còn lại gần như im. */
    const ra = docTheoToc(sin(1, 15000, 0.9), 4);
    expect(rms(ra)).toBeLessThan(0.1);
  });

  it('tốc độ không hợp lệ thì báo lỗi', () => {
    expect(() => docTheoToc(sin(0.1, 440), 0)).toThrow(/dương/);
  });
});

describe('kéo giãn — phải GIỮ cao độ', () => {
  it('kéo dài gấp rưỡi: độ dài đúng, cao độ KHÔNG đổi', () => {
    const goc = sin(2, 440);
    const [ra] = keoGian([goc], 1.5);
    expect(ra!.length).toBeCloseTo(goc.length * 1.5, -3);
    // Đây là cả điểm của WSOLA: dài ra mà nốt vẫn là nốt cũ.
    expect(tanSoTroi(ra!)).toBeCloseTo(440, -1);
  });

  it('nén ngắn lại: độ dài đúng, cao độ KHÔNG đổi', () => {
    const goc = sin(2, 330);
    const [ra] = keoGian([goc], 0.7);
    expect(ra!.length).toBeCloseTo(goc.length * 0.7, -3);
    expect(tanSoTroi(ra!)).toBeCloseTo(330, -1);
  });

  it('đúng tỉ lệ của một bản remix thật (128 → 140 BPM)', () => {
    const goc = sin(3, 220);
    const [ra] = keoGian([goc], tiLeTuBpm(128, 140));
    expect(tanSoTroi(ra!)).toBeCloseTo(220, -1);
  });

  it('⛔ biên độ không phình ở hai đầu — tổng cửa sổ phải được chia', () => {
    /* Hann chồng 50% cộng lại bằng 1 ở GIỮA bài, nhưng ở hai mép chỉ có một
       khung phủ nên tổng là 0,5. Không chia thì hai đầu bài to gấp đôi và
       nghe thành tiếng "bụp" vào/ra. */
    const goc = sin(2, 440, 0.4);
    const [ra] = keoGian([goc], 1.3);
    expect(rms(ra!)).toBeCloseTo(rms(goc), 1);
    let dinh = 0;
    for (let i = 0; i < ra!.length; i++) dinh = Math.max(dinh, Math.abs(ra![i]!));
    expect(dinh).toBeLessThan(0.55);
  });

  it('tỉ lệ 1 trả bản sao y nguyên', () => {
    const goc = sin(0.5, 440);
    const [ra] = keoGian([goc], 1);
    expect(Array.from(ra!)).toEqual(Array.from(goc));
  });

  it('⛔ stereo: hai kênh phải dán CÙNG chỗ, nếu không ảnh stereo vỡ', () => {
    /* Hai kênh giống hệt nhau thì sau khi kéo cũng phải giống hệt nhau. Dò chỗ
       dán riêng cho từng kênh sẽ cho hai chuỗi vị trí khác nhau, và chúng lệch
       dần — nghe từng kênh thì vẫn bình thường, nghe cả hai thì rỗng tiếng. */
    const m = sin(2, 440);
    const [L, R] = keoGian([m, Float32Array.from(m)], 1.25);
    let lech = 0;
    for (let i = 0; i < L!.length; i++) lech = Math.max(lech, Math.abs(L![i]! - R![i]!));
    expect(lech).toBeLessThan(1e-6);
  });

  it('bài rất ngắn không nổ', () => {
    const [ra] = keoGian([new Float32Array(500)], 1.5);
    expect(ra!.length).toBeGreaterThan(0);
  });

  it('tỉ lệ không hợp lệ thì báo lỗi', () => {
    expect(() => keoGian([sin(0.1, 440)], 0)).toThrow(/dương/);
    expect(() => keoGian([], 1.5)).toThrow(/không có kênh/);
  });
});

describe('đổi cao độ — phải GIỮ độ dài', () => {
  it('lên một quãng tám: tần số gấp đôi, độ dài KHÔNG đổi', () => {
    const goc = sin(2, 440);
    const [ra] = doiCaoDo([goc], 12);
    expect(tanSoTroi(ra!)).toBeCloseTo(880, -1);
    // Sai lệch dưới 1% độ dài — đây là cả điểm của việc ghép hai phép biến đổi.
    expect(Math.abs(ra!.length - goc.length) / goc.length).toBeLessThan(0.01);
  });

  it('xuống một quãng tám: tần số một nửa, độ dài KHÔNG đổi', () => {
    const goc = sin(2, 880);
    const [ra] = doiCaoDo([goc], -12);
    expect(tanSoTroi(ra!)).toBeCloseTo(440, -1);
    expect(Math.abs(ra!.length - goc.length) / goc.length).toBeLessThan(0.01);
  });

  it('lên 2 nửa cung (Am → Bm) — quãng hay dùng nhất khi ghép beat', () => {
    const goc = sin(2, 440);
    const [ra] = doiCaoDo([goc], 2);
    expect(tanSoTroi(ra!)).toBeCloseTo(440 * tiLeCaoDo(2), -1);
  });

  it('0 nửa cung trả bản sao y nguyên', () => {
    const goc = sin(0.5, 440);
    expect(Array.from(doiCaoDo([goc], 0)[0]!)).toEqual(Array.from(goc));
  });
});

describe('chỉnh bài — gộp cả hai trong một lượt', () => {
  it('vừa kéo nhịp vừa đổi tông: độ dài theo nhịp, cao độ theo tông', () => {
    const goc = sin(3, 440);
    const tiLeNhip = tiLeTuBpm(128, 140);
    const [ra] = chinhBai([goc], { tiLeNhip, nuaCung: 12 });

    expect(ra!.length / goc.length).toBeCloseTo(tiLeNhip, 1);
    expect(tanSoTroi(ra!)).toBeCloseTo(880, -1);
  });

  it('chỉ kéo nhịp thì giống hệt keoGian', () => {
    const goc = sin(2, 440);
    const a = chinhBai([goc], { tiLeNhip: 1.2 })[0]!;
    const b = keoGian([goc], 1.2)[0]!;
    expect(a.length).toBe(b.length);
    expect(tanSoTroi(a)).toBeCloseTo(tanSoTroi(b), -1);
  });

  it('không chỉnh gì thì trả bản sao', () => {
    const goc = sin(0.5, 440);
    expect(Array.from(chinhBai([goc])[0]!)).toEqual(Array.from(goc));
  });
});

describe('đổi tần số mẫu', () => {
  it('48 kHz về 44,1 kHz: độ dài co đúng tỉ lệ, cao độ GIỮ NGUYÊN', () => {
    // Sóng 440 Hz ở 48 kHz, đọc lại ở 44,1 kHz vẫn phải là 440 Hz.
    const n = 48000 * 2;
    const x = new Float32Array(n);
    for (let i = 0; i < n; i++) x[i] = 0.5 * Math.sin((2 * Math.PI * 440 * i) / 48000);

    const [ra] = doiTanSoMau([x], 48000, 44100);
    expect(ra!.length).toBeCloseTo(n * (44100 / 48000), -3);
    expect(tanSoTroi(ra!, 44100)).toBeCloseTo(440, -1);
  });

  it('cùng tần số thì trả bản sao', () => {
    const goc = sin(0.5, 440);
    expect(Array.from(doiTanSoMau([goc], 44100, 44100)[0]!)).toEqual(Array.from(goc));
  });
});
