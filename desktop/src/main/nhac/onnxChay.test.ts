/**
 * Kiểm phần suy hợp đồng và bóc kết quả của lớp bọc ONNX.
 *
 * Hai hàm này là chỗ dễ sai nhất mà lại im lặng nhất: bóc lệch một chỉ số thì
 * tiếng trống chui vào tệp giọng hát, và không có gì báo lỗi — người dùng chỉ
 * thấy "model tách kém". Nên chúng được viết tách khỏi phần gọi ONNX để kiểm
 * được bằng dữ liệu dựng tay.
 *
 * ⚠️ Không phép kiểm nào ở đây chạm vào onnxruntime thật.
 */
import { describe, expect, it } from 'vitest';
import { bocKetQua, docHopDong, type HopDongModel } from './onnxChay';
import { TEN_STEM } from './tachStem';

const phienGia = (vao: string[], ra: string[]) =>
  ({ inputNames: vao, outputNames: ra, run: async () => ({}) });

describe('đọc hợp đồng model', () => {
  it('bốn đầu ra ⇒ mỗi stem một đầu ra', () => {
    const h = docHopDong(phienGia(['mix'], ['drums', 'bass', 'other', 'vocals']));
    expect(h.tenVao).toBe('mix');
    expect(h.raGop).toBe(false);
  });

  it('một đầu ra ⇒ dạng gộp [1,4,2,N]', () => {
    const h = docHopDong(phienGia(['mix'], ['stems']));
    expect(h.raGop).toBe(true);
  });

  it('KHÔNG gõ cứng tên "mix" — lấy tên thật của model', () => {
    // Bản xuất khác có thể đặt tên khác; gõ cứng thì gọi vào hư không.
    expect(docHopDong(phienGia(['audio_in'], ['stems'])).tenVao).toBe('audio_in');
  });

  it('⛔ nhiều đầu vào thì báo lỗi và NÓI RÕ thấy gì', () => {
    expect(() => docHopDong(phienGia(['mix', 'length'], ['stems'])))
      .toThrow(/2 đầu vào \(mix, length\)/);
  });

  it('⛔ số đầu ra lạ thì báo lỗi', () => {
    expect(() => docHopDong(phienGia(['mix'], ['a', 'b']))).toThrow(/2 đầu ra/);
  });
});

describe('bóc kết quả', () => {
  const N = 8;
  const gop: HopDongModel = { tenVao: 'mix', tenRa: ['stems'], raGop: true };
  const roi: HopDongModel = {
    tenVao: 'mix', tenRa: ['drums', 'bass', 'other', 'vocals'], raGop: false,
  };

  it('dạng gộp: tách đúng 4 stem × 2 kênh, không lệch chỉ số', () => {
    // Đánh dấu mỗi mặt phẳng bằng một số riêng: stem s kênh c ⇒ giá trị s*10+c.
    const d = new Float32Array(TEN_STEM.length * 2 * N);
    for (let s = 0; s < TEN_STEM.length; s++) {
      for (let c = 0; c < 2; c++) {
        for (let i = 0; i < N; i++) d[(s * 2 + c) * N + i] = s * 10 + c;
      }
    }
    const ra = bocKetQua(() => ({ data: d, dims: [1, 4, 2, N] }), gop, N);

    expect(ra).toHaveLength(4);
    for (let s = 0; s < 4; s++) {
      expect(ra[s]![0]!.every((v) => v === s * 10)).toBe(true);
      expect(ra[s]![1]!.every((v) => v === s * 10 + 1)).toBe(true);
    }
  });

  it('dạng rời: mỗi đầu ra thành một stem, hai kênh đúng thứ tự', () => {
    const lam = (mac: number) => {
      const d = new Float32Array(2 * N);
      d.fill(mac, 0, N);
      d.fill(mac + 0.5, N);
      return { data: d, dims: [1, 2, N] as const };
    };
    const bang: Record<string, { data: Float32Array; dims: readonly number[] }> = {
      drums: lam(1), bass: lam(2), other: lam(3), vocals: lam(4),
    };
    const ra = bocKetQua((t) => bang[t], roi, N);

    expect(ra).toHaveLength(4);
    expect(ra[0]![0]![0]!).toBe(1);
    expect(ra[0]![1]![0]!).toBe(1.5);
    expect(ra[3]![0]![0]!).toBe(4);
  });

  it('trả về bản SAO, không phải khung nhìn lên bộ đệm của ONNX', () => {
    // Bộ đệm của phiên bị dùng lại cho khúc sau; giữ khung nhìn thì khúc trước
    // bị ghi đè âm thầm ngay giữa lúc ghép chồng.
    const d = new Float32Array(TEN_STEM.length * 2 * N).fill(7);
    const ra = bocKetQua(() => ({ data: d, dims: [1, 4, 2, N] }), gop, N);
    d.fill(99);
    expect(ra[0]![0]![0]!).toBe(7);
  });

  it('⛔ đầu ra sai độ dài thì báo lỗi kèm dims thật', () => {
    expect(() => bocKetQua(() => ({ data: new Float32Array(5), dims: [1, 4, 2, 5] }), gop, N))
      .toThrow(/dims=\[1,4,2,5\]/);
  });

  it('⛔ thiếu hẳn một đầu ra thì nói tên nó', () => {
    expect(() => bocKetQua(() => undefined, roi, N)).toThrow(/"drums"/);
  });
});
