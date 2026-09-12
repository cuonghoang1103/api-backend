/**
 * Kiểm chuỗi tách stem bằng model GIẢ.
 *
 * ⚠️ ĐỌC TRƯỚC KHI TIN BẢNG XANH Ở ĐÂY. Những phép kiểm này chốt phần TOÁN —
 * chuẩn hoá, chia khúc, ghép chồng, trả lại thang đo — và chốt rất chặt: một
 * model giả trả lại y nguyên đầu vào phải tái tạo bài gốc chính xác.
 *
 * Chúng KHÔNG chốt hợp đồng với ONNX. Tên tensor `mix`, dạng `[1,2,mẫu]`, thứ
 * tự bốn stem, và việc model có tự chuẩn hoá bên trong hay không — bốn thứ đó
 * đọc từ tài liệu, chưa đo được trên máy này (kho model bị chặn ở proxy, và
 * nhị phân gốc của onnxruntime cũng không tải về được). Xem `onnxChay.ts`:
 * nó KIỂM LẠI hợp đồng lúc chạy thay vì tin, nhưng phép kiểm thật vẫn phải
 * chạy trên máy tải được model.
 */
import { describe, expect, it, vi } from 'vitest';
import {
  NHAN_STEM, TAN_SO_MODEL, TEN_STEM, type ChayModel, doThangDo, epStereo, tachStem,
} from './tachStem';
import type { AmThanh } from './wav';

const DAI_KHUC = 512;

/** Model giả: trả lại đúng đầu vào cho cả bốn stem. */
const dongNhat: ChayModel = async (mix) =>
  TEN_STEM.map(() => mix.map((k) => Float32Array.from(k)));

function bai(soMau: number, tanSoMau = TAN_SO_MODEL): AmThanh {
  const f = (i: number, p: number) => Math.sin(i / 23 + p) * 0.6 + Math.sin(i / 5) * 0.2;
  return {
    tanSoMau,
    kenh: [
      Float32Array.from({ length: soMau }, (_, i) => f(i, 0)),
      Float32Array.from({ length: soMau }, (_, i) => f(i, 1.1)),
    ],
  };
}

describe('ép stereo', () => {
  it('mono thì nhân đôi thành hai kênh giống nhau', () => {
    const m = Float32Array.from([1, 2, 3]);
    const ra = epStereo([m]);
    expect(ra).toHaveLength(2);
    expect(Array.from(ra[0]!)).toEqual([1, 2, 3]);
    expect(Array.from(ra[1]!)).toEqual([1, 2, 3]);
  });

  it('stereo thì để nguyên', () => {
    const a = Float32Array.from([1, 2]);
    const b = Float32Array.from([3, 4]);
    const ra = epStereo([a, b]);
    expect(ra[0]!).toBe(a);
    expect(ra[1]!).toBe(b);
  });

  it('⛔ nhiều kênh thì TRỘN xuống, không vứt bớt — kênh giữa chứa phần lời hát', () => {
    const im = new Float32Array([0, 0]);
    const giua = new Float32Array([1, 1]); // kênh 2 = kênh giữa
    const ra = epStereo([im, im, giua, im, im]);
    expect(ra[0]![0]!).toBeGreaterThan(0);
    expect(ra[1]![0]!).toBeGreaterThan(0);
  });

  it('không có kênh nào thì báo lỗi', () => {
    expect(() => epStereo([])).toThrow(/không có kênh/);
  });
});

describe('thang đo', () => {
  it('đo đúng trung bình và độ lệch chuẩn của bản trộn mono', () => {
    const a = Float32Array.from([1, 3, 5, 7]);
    const t = doThangDo([a, a]);
    expect(t.trungBinh).toBeCloseTo(4, 6);
    expect(t.doLech).toBeCloseTo(Math.sqrt(5), 6);
  });

  it('⛔ bài im lặng ⇒ độ lệch trả về 1, KHÔNG phải 0', () => {
    // Trả 0 thì phép chia ra NaN, và NaN lan ra cả bốn stem mà không có gì nổ.
    const t = doThangDo([new Float32Array(100)]);
    expect(t.doLech).toBe(1);
    expect(Number.isFinite(t.trungBinh)).toBe(true);
  });

  it('bài rỗng không nổ', () => {
    expect(doThangDo([])).toEqual({ trungBinh: 0, doLech: 1 });
  });
});

describe('tách stem', () => {
  it('model đồng nhất ⇒ mỗi stem tái tạo CHÍNH XÁC bài gốc', async () => {
    // Chốt cả chuỗi: chuẩn hoá → chia khúc → ghép chồng → trả lại thang đo.
    const goc = bai(3_000);
    const kq = await tachStem(goc, dongNhat, { mauMoiKhuc: DAI_KHUC });

    for (const ten of TEN_STEM) {
      const s = kq.stem[ten];
      expect(s.tanSoMau).toBe(TAN_SO_MODEL);
      expect(s.kenh).toHaveLength(2);
      for (let c = 0; c < 2; c++) {
        for (let i = 0; i < goc.kenh[c]!.length; i++) {
          expect(s.kenh[c]![i]!).toBeCloseTo(goc.kenh[c]![i]!, 4);
        }
      }
    }
  });

  it('tái tạo đúng cả khi độ dài không chia hết cho bước nhảy', async () => {
    const goc = bai(2_777);
    const kq = await tachStem(goc, dongNhat, { mauMoiKhuc: DAI_KHUC });
    const s = kq.stem.vocals;
    for (let i = 0; i < 2_777; i++) {
      expect(s.kenh[0]![i]!).toBeCloseTo(goc.kenh[0]![i]!, 4);
    }
  });

  it('bài ngắn hơn một khúc vẫn chạy', async () => {
    const goc = bai(100);
    const kq = await tachStem(goc, dongNhat, { mauMoiKhuc: DAI_KHUC });
    expect(kq.soKhuc).toBe(1);
    expect(kq.stem.drums.kenh[0]!.length).toBe(100);
  });

  it('trả đủ bốn stem đúng tên và đúng thứ tự htdemucs', async () => {
    const kq = await tachStem(bai(1_000), dongNhat, { mauMoiKhuc: DAI_KHUC });
    expect(Object.keys(kq.stem).sort()).toEqual([...TEN_STEM].sort());
    expect(TEN_STEM).toEqual(['drums', 'bass', 'other', 'vocals']);
  });

  it('mỗi stem có nhãn tiếng Việt để hiện lên giao diện', () => {
    for (const ten of TEN_STEM) expect(NHAN_STEM[ten].length).toBeGreaterThan(0);
  });

  it('báo tiến độ theo từng khúc', async () => {
    const tienDo = vi.fn();
    const kq = await tachStem(bai(3_000), dongNhat, { mauMoiKhuc: DAI_KHUC, tienDo });
    expect(tienDo).toHaveBeenCalledTimes(kq.soKhuc);
    expect(tienDo).toHaveBeenLastCalledWith(kq.soKhuc, kq.soKhuc);
  });

  it('⛔ huỷ được giữa chừng — bài 5 phút chạy vài phút trên CPU', async () => {
    const dung = new AbortController();
    let daChay = 0;
    const chamChap: ChayModel = async (mix) => {
      daChay++;
      if (daChay === 2) dung.abort();
      return TEN_STEM.map(() => mix.map((k) => Float32Array.from(k)));
    };
    await expect(
      tachStem(bai(10_000), chamChap, { mauMoiKhuc: DAI_KHUC, huy: dung.signal }),
    ).rejects.toThrow(/huỷ/i);
    // Đã dừng thật, không chạy nốt cả bài.
    expect(daChay).toBeLessThan(mocSo(10_000));
  });

  it('⛔ sai tần số mẫu thì báo lỗi CHỈ RA cách sửa', async () => {
    await expect(tachStem(bai(1_000, 48_000), dongNhat)).rejects
      .toThrow(/OfflineAudioContext/);
  });

  it('⛔ model trả sai số stem thì báo lỗi thay vì dựng kết quả méo', async () => {
    const thieu: ChayModel = async (mix) => [mix.map((k) => Float32Array.from(k))];
    await expect(tachStem(bai(1_000), thieu, { mauMoiKhuc: DAI_KHUC }))
      .rejects.toThrow(/trả 1 stem, cần 4/);
  });

  it('⛔ model trả sai số kênh thì báo lỗi', async () => {
    const moiMot: ChayModel = async (mix) =>
      TEN_STEM.map(() => [Float32Array.from(mix[0]!)]);
    await expect(tachStem(bai(1_000), moiMot, { mauMoiKhuc: DAI_KHUC }))
      .rejects.toThrow(/2 kênh/);
  });

  it('bài rỗng thì báo lỗi', async () => {
    await expect(tachStem({ tanSoMau: TAN_SO_MODEL, kenh: [new Float32Array(0)] }, dongNhat))
      .rejects.toThrow(/rỗng/);
  });
});

/** Số khúc mà `mocKhuc` sẽ sinh ra, tính lại ở đây để phép kiểm huỷ tự đứng được. */
function mocSo(soMau: number): number {
  const buoc = Math.round(DAI_KHUC * 0.75);
  return soMau <= DAI_KHUC ? 1 : Math.ceil(soMau / buoc);
}
