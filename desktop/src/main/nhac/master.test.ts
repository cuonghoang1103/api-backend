/**
 * Kiểm bộ master theo bản mẫu.
 *
 * Hai phép kiểm quan trọng nhất ở đây:
 *
 *  • bộ hạn biên KHÔNG BAO GIỜ vượt trần — nếu nó vượt thì cả lý do tồn tại
 *    của nó biến mất, mà triệu chứng chỉ lộ ra sau khi nén sang MP3;
 *  • bộ khớp phổ phải THẬT SỰ kéo bài lại gần bản mẫu — đo bằng chính bộ đo
 *    dải quãng tám trong `amLuong.ts`, chứ không phải "chạy không nổ là xong".
 */
import { describe, expect, it } from 'vitest';
import { DAI_TAM, doDai, doRongStereo } from './amLuong';
import { fft, fftNguoc } from './fft';
import {
  doDacTinh, dungBoLoc, hanBien, khopRong, master, muotTheoQuang, phoTrungBinh, tichChap,
} from './master';
import type { AmThanh } from './wav';

const FS = 44100;

function sin(giay: number, hz: number, bienDo = 0.3): Float32Array {
  const n = Math.round(giay * FS);
  const x = new Float32Array(n);
  for (let i = 0; i < n; i++) x[i] = bienDo * Math.sin((2 * Math.PI * hz * i) / FS);
  return x;
}

/** Cộng nhiều sóng sin thành một "bài" có phổ biết trước. */
function tron(giay: number, phan: Array<[number, number]>): Float32Array {
  const n = Math.round(giay * FS);
  const x = new Float32Array(n);
  for (const [hz, a] of phan) {
    for (let i = 0; i < n; i++) x[i] = x[i]! + a * Math.sin((2 * Math.PI * hz * i) / FS);
  }
  return x;
}

const stereo = (k: Float32Array): AmThanh => ({ tanSoMau: FS, kenh: [k, Float32Array.from(k)] });

function dinh(am: AmThanh): number {
  let d = 0;
  for (const k of am.kenh) for (let i = 0; i < k.length; i++) d = Math.max(d, Math.abs(k[i]!));
  return d;
}

describe('FFT ngược', () => {
  it('xuôi rồi ngược trả lại đúng tín hiệu ban đầu', () => {
    const n = 256;
    const re = new Float64Array(n);
    const im = new Float64Array(n);
    const goc: number[] = [];
    for (let i = 0; i < n; i++) {
      re[i] = Math.sin(i / 5) * 0.7 + Math.cos(i / 3);
      goc.push(re[i]!);
    }
    fft(re, im);
    fftNguoc(re, im);
    for (let i = 0; i < n; i++) {
      expect(re[i]!).toBeCloseTo(goc[i]!, 9);
      expect(im[i]!).toBeCloseTo(0, 9);
    }
  });
});

describe('phổ trung bình', () => {
  it('sóng 1 kHz làm trội đúng ô của nó', () => {
    const pho = phoTrungBinh(sin(2, 1000));
    let o = 1;
    for (let i = 2; i < pho.length; i++) if (pho[i]! > pho[o]!) o = i;
    expect((o * FS) / 4096).toBeCloseTo(1000, -2);
  });

  it('tín hiệu ngắn hơn một khung trả về phổ rỗng, không nổ', () => {
    expect(phoTrungBinh(new Float32Array(100)).every((v) => v === 0)).toBe(true);
  });
});

describe('làm mượt theo quãng', () => {
  it('san phẳng gợn nhọn nhưng giữ xu hướng chung', () => {
    const n = 2049;
    const ti = new Float64Array(n);
    for (let i = 0; i < n; i++) ti[i] = 2 + (i % 2 === 0 ? 0.5 : -0.5);
    const m = muotTheoQuang(ti);
    // Gợn răng cưa biến mất...
    for (let i = 200; i < n - 200; i++) expect(Math.abs(m[i]! - 2)).toBeLessThan(0.1);
    // ...mà mức chung thì giữ nguyên.
    expect(m[1000]!).toBeCloseTo(2, 1);
  });

  it('cửa sổ rộng dần theo tần số — dải cao mượt hơn dải trầm', () => {
    const n = 2049;
    const ti = new Float64Array(n);
    for (let i = 0; i < n; i++) ti[i] = i % 2 === 0 ? 3 : 1;
    const m = muotTheoQuang(ti);
    const gonThap = Math.abs(m[3]! - 2);
    const gonCao = Math.abs(m[2000]! - 2);
    expect(gonCao).toBeLessThan(gonThap);
  });
});

describe('dựng bộ lọc khớp', () => {
  it('hai phổ giống hệt ⇒ bộ lọc gần như không đổi gì', () => {
    const pho = phoTrungBinh(tron(2, [[200, 0.3], [2000, 0.3]]));
    const h = dungBoLoc(pho, pho);
    const ra = tichChap(sin(1, 1000, 0.4), h);
    const goc = sin(1, 1000, 0.4);
    // Cho phép lệch nhỏ vì nhân lọc bị cắt ngắn và nhân cửa sổ.
    for (let i = 5000; i < 20000; i += 97) expect(ra[i]!).toBeCloseTo(goc[i]!, 1);
  });

  it('⛔ ô gần như im thì để nguyên, không nâng nhiễu nền lên', () => {
    const soO = 2049;
    const cuaBan = new Float64Array(soO).fill(1e-12);
    const mau = new Float64Array(soO).fill(1);
    // Không có chốt này thì tỉ lệ ở mọi ô là 1e12 — bộ lọc thành một quả bom.
    const h = dungBoLoc(cuaBan, mau);
    let nangLuong = 0;
    for (const v of h) nangLuong += v * v;
    expect(nangLuong).toBeLessThan(10);
  });

  it('độ dài phổ lệch nhau thì báo lỗi', () => {
    expect(() => dungBoLoc(new Float64Array(2049), new Float64Array(1025)))
      .toThrow(/lệch độ dài/);
  });
});

describe('tích chập', () => {
  it('tích chập với xung đơn vị trả lại đúng tín hiệu', () => {
    const h = new Float64Array(64);
    h[32] = 1; // xung ở TÂM — đúng chỗ mà bước bù trễ nhắm tới
    const x = sin(0.5, 440, 0.4);
    const ra = tichChap(x, h);
    expect(ra.length).toBe(x.length);
    for (let i = 100; i < x.length - 100; i += 53) expect(ra[i]!).toBeCloseTo(x[i]!, 5);
  });

  it('giữ nguyên độ dài kể cả khi bài không chia hết cho khối', () => {
    const h = new Float64Array(128);
    h[64] = 1;
    expect(tichChap(new Float32Array(12_345), h).length).toBe(12_345);
  });
});

describe('hạn biên', () => {
  it('⛔ KHÔNG BAO GIỜ vượt trần — đây là cả lý do nó tồn tại', () => {
    const to = sin(1, 200, 0.95);
    // Thêm vài đỉnh nhọn vượt hẳn, đúng thứ hay làm bộ hạn biên kém bị lọt.
    for (const i of [1000, 5000, 5001, 20000, 30000]) to[i] = 2.4;
    const ra = hanBien([to, Float32Array.from(to)], 0.5, FS);
    for (const k of ra) {
      for (let i = 0; i < k.length; i++) expect(Math.abs(k[i]!)).toBeLessThanOrEqual(0.5 + 1e-6);
    }
  });

  it('tín hiệu đã dưới trần thì không đụng tới', () => {
    const nho = sin(0.5, 440, 0.1);
    const [ra] = hanBien([nho], 0.5, FS);
    for (let i = 0; i < nho.length; i += 31) expect(ra![i]!).toBeCloseTo(nho[i]!, 6);
  });

  it('⛔ hạ CẢ HAI kênh cùng lúc, không kéo lệch ảnh stereo', () => {
    // Chỉ kênh trái vượt trần. Nếu chỉ hạ kênh trái thì bài lệch hẳn sang phải.
    const L = sin(0.5, 200, 0.9);
    const R = sin(0.5, 200, 0.2);
    const [raL, raR] = hanBien([L, R], 0.4, FS);
    const tiGoc = 0.9 / 0.2;
    let dinhL = 0;
    let dinhR = 0;
    for (let i = 0; i < raL!.length; i++) {
      dinhL = Math.max(dinhL, Math.abs(raL![i]!));
      dinhR = Math.max(dinhR, Math.abs(raR![i]!));
    }
    expect(dinhL / dinhR).toBeCloseTo(tiGoc, 1);
  });

  it('không có kênh nào thì trả mảng rỗng', () => {
    expect(hanBien([], 0.5, FS)).toEqual([]);
  });
});

describe('khớp độ rộng stereo', () => {
  it('nới rộng một bài hẹp', () => {
    const L = sin(1, 440, 0.3);
    const R = Float32Array.from(L);
    for (let i = 0; i < R.length; i++) R[i] = R[i]! * 0.98; // gần như mono
    const ra = khopRong([L, R], 0.35);
    expect(doRongStereo({ kenh: ra, tanSoMau: FS })).toBeGreaterThan(
      doRongStereo({ kenh: [L, R], tanSoMau: FS }),
    );
  });

  it('tệp mono thì trả bản sao, không nổ', () => {
    const m = sin(0.2, 440);
    expect(khopRong([m], 0.3)).toHaveLength(1);
  });
});

describe('master theo bản mẫu — chuỗi đầy đủ', () => {
  /** Bài "đục": nhiều trầm, thiếu cao. Bản mẫu thì ngược lại. */
  const duc = stereo(tron(3, [[80, 0.30], [160, 0.22], [1000, 0.05], [6000, 0.01]]));
  const sang = stereo(tron(3, [[80, 0.10], [160, 0.10], [1000, 0.18], [6000, 0.16]]));

  it('⭐ kéo phổ của bài lại GẦN bản mẫu', () => {
    const mau = doDacTinh(sang);
    const truoc = doDai(duc);
    const sau = doDai(master(duc, mau).am);
    const mauDai = doDai(sang);

    /* So khoảng cách tới bản mẫu ở dải cao — chỗ bài đục thiếu nhiều nhất.
       Đây là câu hỏi thật của tính năng: nó có kéo lại gần không, hay chỉ chạy
       xong mà không đổi gì.

       Dải 8000 chứ không phải 6000: `DAI_TAM` là mười dải quãng tám chuẩn
       (31,5 · 63 · … · 16k), không có ô nào tên 6000. Tra bằng 6000 trả về
       `undefined` và phép so thành NaN < NaN — luôn sai, mà thông báo lỗi thì
       không nói gì về nguyên nhân. Sóng 6 kHz nằm trong dải 8000 (5,66–11,3 k).
    */
    const truocXa = Math.abs(truoc[8000]! - mauDai[8000]!);
    const sauXa = Math.abs(sau[8000]! - mauDai[8000]!);
    expect(sauXa).toBeLessThan(truocXa);
  });

  it('mọi dải đều gần bản mẫu hơn trước, hoặc ít nhất không xa thêm nhiều', () => {
    const mau = doDacTinh(sang);
    const truoc = doDai(duc);
    const sau = doDai(master(duc, mau).am);
    const mauDai = doDai(sang);

    let tongTruoc = 0;
    let tongSau = 0;
    for (const f of DAI_TAM) {
      const a = truoc[f];
      const b = sau[f];
      const m = mauDai[f];
      if (a === undefined || b === undefined || m === undefined) continue;
      if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(m)) continue;
      tongTruoc += Math.abs(a - m);
      tongSau += Math.abs(b - m);
    }
    expect(tongSau).toBeLessThan(tongTruoc);
  });

  it('⛔ đỉnh thật sau khi xong phải nằm DƯỚI trần', () => {
    const kq = master(duc, doDacTinh(sang), { tranDbtp: -1 });
    expect(kq.dinhThatSau).toBeLessThanOrEqual(-1 + 0.25);
    expect(dinh(kq.am)).toBeLessThanOrEqual(Math.pow(10, -1 / 20) + 1e-6);
  });

  it('trần chặt hơn thì bài nhỏ hơn', () => {
    /* Trần phải nằm DƯỚI đỉnh tự nhiên thì bộ hạn biên mới chạm vào. Sau khi
       khớp mức theo bản mẫu, đỉnh ở đây ~0,47 (−6,6 dBFS), nên cả −1 lẫn −6
       dBTP đều cao hơn và không có gì bị hạn — hai kết quả giống hệt nhau.
       Chọn −14 dBTP (0,20) để bước hạn biên thật sự làm việc. */
    const mau = doDacTinh(sang);
    const a = master(duc, mau, { tranDbtp: -1 });
    const b = master(duc, mau, { tranDbtp: -14 });
    expect(dinh(a.am)).toBeGreaterThan(0.3);
    expect(dinh(b.am)).toBeLessThan(dinh(a.am));
    expect(dinh(b.am)).toBeLessThanOrEqual(Math.pow(10, -14 / 20) + 1e-6);
  });

  it('bỏ khớp phổ thì vẫn khớp được mức to', () => {
    const mau = doDacTinh(sang);
    const kq = master(duc, mau, { khongKhopPho: true });
    expect(Number.isFinite(kq.lufsSau)).toBe(true);
    expect(kq.am.kenh[0]!.length).toBe(duc.kenh[0]!.length);
  });

  it('giữ nguyên số kênh và độ dài', () => {
    const kq = master(duc, doDacTinh(sang));
    expect(kq.am.kenh).toHaveLength(2);
    expect(kq.am.kenh[0]!.length).toBe(duc.kenh[0]!.length);
    expect(kq.am.tanSoMau).toBe(FS);
  });

  it('⛔ lệch tần số mẫu thì báo lỗi CHỈ RA cả hai con số', () => {
    const mau = doDacTinh(sang);
    const khac: AmThanh = { kenh: duc.kenh, tanSoMau: 48000 };
    expect(() => master(khac, mau)).toThrow(/48000 Hz/);
  });

  it('bài im lặng không làm chuỗi vỡ', () => {
    const im: AmThanh = { kenh: [new Float32Array(FS), new Float32Array(FS)], tanSoMau: FS };
    const kq = master(im, doDacTinh(sang));
    expect(kq.am.kenh[0]!.length).toBe(FS);
    for (let i = 0; i < FS; i += 97) expect(Number.isFinite(kq.am.kenh[0]![i]!)).toBe(true);
  });
});
