/**
 * Kiểm khâu trộn stem.
 *
 * Phần lớn giá trị của tệp này nằm ở những phép kiểm về CHUYỆN XẤU: stem lệch
 * độ dài, stem mono lọt vào bản stereo, không có stem trống. Cả ba đều cho ra
 * một tệp WAV nghe được (nên không ai nghi gì) trong khi bản trộn đã sai —
 * NaN từ giữa bài, hoặc mọi thứ dồn sang kênh trái.
 */
import { describe, expect, it } from 'vitest';
import { CAI_MAC_DINH, tron } from './tron';
import type { AmThanh } from './wav';

const FS = 44100;

function am(kenh: Float32Array[], tanSoMau = FS): AmThanh { return { kenh, tanSoMau }; }

function sin(giay: number, hz: number, bienDo = 1): Float32Array {
  const n = Math.round(giay * FS);
  const x = new Float32Array(n);
  for (let i = 0; i < n; i++) x[i] = bienDo * Math.sin((2 * Math.PI * hz * i) / FS);
  return x;
}

/** Stem trống giả: kick 60 Hz bốn phách một giây (240 BPM cho gọn). */
function trongGia(giay: number, moiGiay = 4): AmThanh {
  const n = Math.round(giay * FS);
  const x = new Float32Array(n);
  for (let t = 0; t < giay; t += 1 / moiGiay) {
    const m = Math.round(t * FS);
    for (let i = 0; i < 0.12 * FS && m + i < n; i++) {
      x[m + i]! += 0.9 * Math.exp(-i / (0.025 * FS)) * Math.sin((2 * Math.PI * 60 * i) / FS);
    }
  }
  return am([x, Float32Array.from(x)]);
}

function dinh(x: Float32Array, tu = 0, den = x.length): number {
  let m = 0;
  for (let i = tu; i < Math.min(den, x.length); i++) m = Math.max(m, Math.abs(x[i]!));
  return m;
}

describe('trộn cơ bản', () => {
  it('cộng đúng các stem đang bật', () => {
    const kq = tron(
      { bass: am([sin(1, 100, 0.4), sin(1, 100, 0.4)]) },
      { stem: { bass: { gainDb: 0, duck: 0, chanTramHz: 0 } } },
    );
    expect(kq.kenh.length).toBe(2);
    expect(dinh(kq.kenh[0]!, FS / 2)).toBeCloseTo(0.4, 2);
    expect(kq.daTron).toEqual(['bass']);
  });

  it('stem tắt thì không có mặt trong bản trộn', () => {
    const kq = tron(
      { bass: am([sin(1, 100, 0.5), sin(1, 100, 0.5)]), vocals: am([sin(1, 900, 0.5), sin(1, 900, 0.5)]) },
      { stem: { vocals: { bat: false }, bass: { duck: 0, chanTramHz: 0, gainDb: 0 } } },
    );
    expect(kq.daTron).toEqual(['bass']);
    // Còn đúng phần bass: đỉnh vẫn 0,5 chứ không phải tổng hai đường.
    expect(dinh(kq.kenh[0]!, FS / 2)).toBeLessThan(0.65);
  });

  it('gain dB đổi mức đúng như khai báo', () => {
    const goc = tron({ bass: am([sin(1, 100, 0.5), sin(1, 100, 0.5)]) },
      { stem: { bass: { gainDb: 0, duck: 0, chanTramHz: 0 } } });
    const ha = tron({ bass: am([sin(1, 100, 0.5), sin(1, 100, 0.5)]) },
      { stem: { bass: { gainDb: -6, duck: 0, chanTramHz: 0 } } });
    const chenh = 20 * Math.log10(dinh(ha.kenh[0]!, FS / 2) / dinh(goc.kenh[0]!, FS / 2));
    expect(chenh).toBeCloseTo(-6, 1);
  });

  it('không có stem nào thì báo lỗi nói rõ, không trả tệp rỗng', () => {
    expect(() => tron({})).toThrow(/stem/i);
  });
});

describe('chắn trầm', () => {
  it('cắt phần dưới điểm cắt mà giữ nguyên phần trên', () => {
    const tram = tron({ vocals: am([sin(1, 40, 0.5), sin(1, 40, 0.5)]) },
      { stem: { vocals: { chanTramHz: 110, duck: 0, gainDb: 0 } } });
    const cao = tron({ vocals: am([sin(1, 1000, 0.5), sin(1, 1000, 0.5)]) },
      { stem: { vocals: { chanTramHz: 110, duck: 0, gainDb: 0 } } });
    expect(dinh(tram.kenh[0]!, FS / 2)).toBeLessThan(0.05);   // 40 Hz bị dập
    expect(dinh(cao.kenh[0]!, FS / 2)).toBeCloseTo(0.5, 1);   // 1 kHz nguyên vẹn
  });
});

describe('nguồn của cú duck', () => {
  it('⭐ ưu tiên stem trống THẬT hơn lưới nhịp', () => {
    const kq = tron({ drums: trongGia(2), bass: am([sin(2, 100, 0.5), sin(2, 100, 0.5)]) },
      { bpm: 130 });
    expect(kq.nguonKick).toBe('trong');
    expect(kq.soKick).toBe(8);          // 4 cú mỗi giây × 2 giây
  });

  it('chưa tách trống thì lùi về lưới nhịp', () => {
    const kq = tron({ bass: am([sin(2, 100, 0.5), sin(2, 100, 0.5)]) }, { bpm: 120 });
    expect(kq.nguonKick).toBe('nhip');
    expect(kq.soKick).toBe(4);          // 120 BPM, 2 giây
  });

  it('không trống, không nhịp thì không duck — và nói ra điều đó', () => {
    const kq = tron({ bass: am([sin(1, 100, 0.5), sin(1, 100, 0.5)]) });
    expect(kq.nguonKick).toBe('khong');
    expect(kq.soKick).toBe(0);
  });

  it('⭐ thời gian hồi suy từ nhịp, không phải một số cố định', () => {
    /* Đặt cứng 250 ms thì cùng thiết lập cho nhịp thở khác nhau tuỳ bài. Ở đây
       nó phải bám theo phách: 90% của một phách. */
    expect(tron({ bass: am([sin(1, 100), sin(1, 100)]) }, { bpm: 120 }).hoiPhuc)
      .toBeCloseTo(0.5 * 0.9, 4);
    expect(tron({ bass: am([sin(1, 100), sin(1, 100)]) }, { bpm: 150 }).hoiPhuc)
      .toBeCloseTo(0.4 * 0.9, 4);
    // Ép tay thì phải thắng.
    expect(tron({ bass: am([sin(1, 100), sin(1, 100)]) }, { bpm: 150, hoiPhuc: 0.2 }).hoiPhuc)
      .toBe(0.2);
  });

  it('nhịp vô lý không làm chia cho 0', () => {
    for (const bpm of [0, -12, 5000, NaN]) {
      const kq = tron({ bass: am([sin(1, 100), sin(1, 100)]) }, { bpm });
      expect(Number.isFinite(kq.hoiPhuc)).toBe(true);
      expect(kq.hoiPhuc).toBeGreaterThan(0);
    }
  });
});

describe('cú duck thật sự ghì', () => {
  it('bass tụt xuống ngay sau cú kick rồi hồi lại', () => {
    const kq = tron(
      { drums: trongGia(2), bass: am([sin(2, 100, 0.5), sin(2, 100, 0.5)]) },
      { bpm: 240, stem: { drums: { bat: false }, bass: { duck: 0.8, chanTramHz: 0, gainDb: 0 } } },
    );
    const m = Math.round(0.5 * FS);                       // cú kick thứ ba
    const ngay = dinh(kq.kenh[0]!, m + 300, m + 900);
    const sau = dinh(kq.kenh[0]!, m + Math.round(0.2 * FS), m + Math.round(0.22 * FS));
    expect(ngay).toBeLessThan(sau * 0.6);
  });

  it('⛔ trống KHÔNG tự duck theo chính nó trong bản mặc định', () => {
    // Ghì trống theo cú kick của chính nó là tự ăn mất cú kick.
    expect(CAI_MAC_DINH.drums.duck).toBe(0);
  });
});

describe('đắp thiết lập một phần', () => {
  it('⭐ trường bằng đúng `undefined` KHÔNG được ghi đè mặc định', () => {
    /* Qua cầu IPC, `{ bat: undefined }` là chuyện bình thường — structured
       clone giữ nguyên nó. Nếu đắp bằng spread thì `bat` thành `undefined`,
       `if (!cd.bat) continue` cho là tắt, và stem biến mất khỏi bản trộn.
       Người dùng nghe ra là "trộn xong mất giọng hát" và sẽ không bao giờ
       nghĩ tới cầu IPC. */
    const kq = tron(
      { bass: am([sin(1, 100, 0.5), sin(1, 100, 0.5)]) },
      { stem: { bass: { bat: undefined, gainDb: undefined, duck: 0, chanTramHz: 0 } } },
    );
    expect(kq.daTron).toEqual(['bass']);
  });

  it('trường có giá trị thì thắng mặc định', () => {
    const kq = tron({ vocals: am([sin(1, 800, 0.5), sin(1, 800, 0.5)]) },
      { stem: { vocals: { bat: false } } });
    expect(kq.daTron).toEqual([]);
  });
});

describe('những hình dạng đầu vào xấu', () => {
  it('⭐ stem lệch độ dài không sinh NaN', () => {
    /* Cộng thẳng hai mảng lệch độ dài thì `k[i]` thành undefined ⇒ NaN, và NaN
       lan ra cả bản trộn từ mẫu đó. Tệp WAV vẫn ghi ra được, vẫn mở được, và
       phần sau bài thì im hoàn toàn. */
    const kq = tron({
      bass: am([sin(2, 100, 0.5), sin(2, 100, 0.5)]),
      vocals: am([sin(1, 800, 0.5), sin(1, 800, 0.5)]),
    }, { stem: { bass: { duck: 0, chanTramHz: 0 }, vocals: { duck: 0, chanTramHz: 0 } } });
    expect(kq.kenh[0]!.every((v) => Number.isFinite(v))).toBe(true);
    expect(kq.kenh[0]!.length).toBe(Math.round(2 * FS));
  });

  it('⭐ stem MONO lọt vào bản stereo thì đổ vào cả hai kênh', () => {
    // Không xử lý thì kênh phải im, và bản trộn nghe lệch hẳn sang trái.
    const kq = tron({
      bass: am([sin(1, 100, 0.5), sin(1, 100, 0.5)]),
      vocals: am([sin(1, 800, 0.5)]),
    }, { stem: { bass: { duck: 0, chanTramHz: 0 }, vocals: { duck: 0, chanTramHz: 0 } } });
    const L = dinh(kq.kenh[0]!, FS / 2);
    const R = dinh(kq.kenh[1]!, FS / 2);
    expect(Math.abs(L - R)).toBeLessThan(0.02);
  });

  it('nén tổng bật thì ghì bản trộn xuống', () => {
    const nguon = { bass: am([sin(1, 100, 0.9), sin(1, 100, 0.9)]) };
    const cd = { stem: { bass: { duck: 0, chanTramHz: 0, gainDb: 0 } } };
    const khong = tron(nguon, cd);
    const co = tron(nguon, { ...cd, nenTong: { nguong: -20, tiLe: 6, tanCong: 0.002, nhaRa: 0.05 } });
    expect(dinh(co.kenh[0]!, FS / 2)).toBeLessThan(dinh(khong.kenh[0]!, FS / 2) * 0.7);
  });
});
