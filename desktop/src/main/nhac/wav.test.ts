/**
 * Kiểm đọc/ghi WAV.
 *
 * Lỗi đọc WAV có một kiểu triệu chứng rất dễ đổ oan: file vẫn đọc "thành công",
 * nhưng mẫu lệch một byte hoặc lệch tâm, và cái ra là NHIỄU. Lúc đó người ta
 * đi ngờ bộ tách stem chứ không ngờ trình đọc file. Nên chốt từng độ sâu bit
 * bằng byte dựng tay.
 */
import { describe, expect, it } from 'vitest';
import { docWav, ghiWav, gopMono, type AmThanh } from './wav';

/** Dựng một tệp WAV PCM số nguyên bằng tay, để kiểm trình đọc bằng byte thật. */
function dungWavPcm(bit: 8 | 16 | 24 | 32, mau: number[][], tanSoMau = 44100): ArrayBuffer {
  const soKenh = mau.length;
  const soMau = mau[0]!.length;
  const byteMau = bit >> 3;
  const byteDuLieu = soMau * soKenh * byteMau;
  const buf = new ArrayBuffer(44 + byteDuLieu);
  const v = new DataView(buf);
  const chu = (i: number, s: string) => {
    for (let k = 0; k < s.length; k++) v.setUint8(i + k, s.charCodeAt(k));
  };
  chu(0, 'RIFF'); v.setUint32(4, 36 + byteDuLieu, true); chu(8, 'WAVE');
  chu(12, 'fmt '); v.setUint32(16, 16, true);
  v.setUint16(20, 1, true); v.setUint16(22, soKenh, true);
  v.setUint32(24, tanSoMau, true);
  v.setUint32(28, tanSoMau * soKenh * byteMau, true);
  v.setUint16(32, soKenh * byteMau, true); v.setUint16(34, bit, true);
  chu(36, 'data'); v.setUint32(40, byteDuLieu, true);

  let i = 44;
  for (let n = 0; n < soMau; n++) {
    for (let c = 0; c < soKenh; c++) {
      const x = mau[c]![n]!;
      if (bit === 8) v.setUint8(i, x);
      else if (bit === 16) v.setInt16(i, x, true);
      else if (bit === 24) {
        const u = x < 0 ? x + 0x1000000 : x;
        v.setUint8(i, u & 0xff); v.setUint8(i + 1, (u >> 8) & 0xff); v.setUint8(i + 2, (u >> 16) & 0xff);
      } else v.setInt32(i, x, true);
      i += byteMau;
    }
  }
  return buf;
}

describe('đọc WAV', () => {
  it('16-bit: giá trị biên quy về đúng ±1', () => {
    const am = docWav(dungWavPcm(16, [[32767, -32768, 0, 16384]]));
    expect(am.tanSoMau).toBe(44100);
    expect(am.kenh).toHaveLength(1);
    expect(am.kenh[0]![0]!).toBeCloseTo(1, 3);
    expect(am.kenh[0]![1]!).toBeCloseTo(-1, 6);
    expect(am.kenh[0]![2]!).toBe(0);
    expect(am.kenh[0]![3]!).toBeCloseTo(0.5, 6);
  });

  it('24-bit: nới dấu đúng — đây là chỗ dễ sai nhất', () => {
    // 0x800000 là số âm nhỏ nhất của 24-bit. Quên nới dấu thì nó thành +8388608.
    const am = docWav(dungWavPcm(24, [[0x7fffff, -0x800000, 0]]));
    expect(am.kenh[0]![0]!).toBeCloseTo(1, 5);
    expect(am.kenh[0]![1]!).toBeCloseTo(-1, 6);
    expect(am.kenh[0]![2]!).toBe(0);
  });

  it('8-bit: không dấu, lệch tâm ở 128', () => {
    const am = docWav(dungWavPcm(8, [[255, 128, 0]]));
    expect(am.kenh[0]![0]!).toBeGreaterThan(0.9);
    expect(am.kenh[0]![1]!).toBe(0);
    expect(am.kenh[0]![2]!).toBeCloseTo(-1, 6);
  });

  it('tách đúng kênh của tệp stereo xen kẽ', () => {
    const am = docWav(dungWavPcm(16, [[1000, 2000, 3000], [-1000, -2000, -3000]]));
    expect(am.kenh).toHaveLength(2);
    expect(am.kenh[0]![1]!).toBeCloseTo(2000 / 32768, 6);
    expect(am.kenh[1]![1]!).toBeCloseTo(-2000 / 32768, 6);
  });

  it('⛔ bỏ qua khối lạ xen giữa thay vì đọc lệch', () => {
    // Chèn một khối LIST độ dài LẺ giữa fmt và data. Không cộng byte đệm thì
    // mọi thứ sau nó lệch 1 byte và ra nhiễu trắng.
    const goc = dungWavPcm(16, [[1000, 2000]]);
    const them = 8 + 3 + 1; // đầu khối + 3 byte nội dung + 1 byte đệm
    const buf = new ArrayBuffer(goc.byteLength + them);
    const v = new DataView(buf);
    const g = new Uint8Array(goc);
    new Uint8Array(buf).set(g.slice(0, 36), 0);
    for (let k = 0; k < 4; k++) v.setUint8(36 + k, 'LIST'.charCodeAt(k));
    v.setUint32(40, 3, true);
    new Uint8Array(buf).set(g.slice(36), 36 + them);
    v.setUint32(4, buf.byteLength - 8, true);

    const am = docWav(buf);
    expect(am.kenh[0]![0]!).toBeCloseTo(1000 / 32768, 6);
    expect(am.kenh[0]![1]!).toBeCloseTo(2000 / 32768, 6);
  });

  it('tệp không phải WAV thì báo lỗi rõ ràng', () => {
    const rac = new ArrayBuffer(64);
    expect(() => docWav(rac)).toThrow(/Không phải tệp WAV/);
    expect(() => docWav(new ArrayBuffer(4))).toThrow(/quá ngắn/);
  });
});

describe('ghi WAV', () => {
  it('ghi rồi đọc lại ra đúng mẫu ban đầu', () => {
    const goc: AmThanh = {
      tanSoMau: 48000,
      kenh: [new Float32Array([0, 0.5, -0.5, 1]), new Float32Array([1, -1, 0.25, 0])],
    };
    const lai = docWav(ghiWav(goc));
    expect(lai.tanSoMau).toBe(48000);
    expect(lai.kenh).toHaveLength(2);
    expect(Array.from(lai.kenh[0]!)).toEqual(Array.from(goc.kenh[0]!));
    expect(Array.from(lai.kenh[1]!)).toEqual(Array.from(goc.kenh[1]!));
  });

  it('giữ nguyên phần vượt đỉnh thay vì cắt cụt', () => {
    // Đây là cả lý do dùng float cho tệp trung gian: stem tách ra có thể vượt
    // ±1, và bước trộn sau còn phải lấy lại được.
    const goc: AmThanh = { tanSoMau: 44100, kenh: [new Float32Array([1.8, -2.4])] };
    const lai = docWav(ghiWav(goc));
    expect(lai.kenh[0]![0]!).toBeCloseTo(1.8, 6);
    expect(lai.kenh[0]![1]!).toBeCloseTo(-2.4, 6);
  });

  it('các kênh lệch độ dài thì từ chối ghi', () => {
    const xau: AmThanh = { tanSoMau: 44100, kenh: [new Float32Array(4), new Float32Array(5)] };
    expect(() => ghiWav(xau)).toThrow(/lệch độ dài/);
  });
});

describe('gộp mono', () => {
  it('lấy trung bình các kênh', () => {
    const am: AmThanh = {
      tanSoMau: 44100,
      kenh: [new Float32Array([1, 0]), new Float32Array([0, 1])],
    };
    expect(Array.from(gopMono(am))).toEqual([0.5, 0.5]);
  });

  it('tệp mono sẵn thì trả thẳng kênh đó, không chép lại', () => {
    const k = new Float32Array([0.1, 0.2]);
    expect(gopMono({ tanSoMau: 44100, kenh: [k] })).toBe(k);
  });
});
