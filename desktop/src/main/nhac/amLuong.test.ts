/**
 * Kiểm bộ đo.
 *
 * Phép kiểm quan trọng nhất ở đây là phép ĐẦU TIÊN: hệ số bộ lọc K tính ra
 * phải khớp bảng in trong chuẩn ITU-R BS.1770-4. Không có nó thì mọi phép kiểm
 * còn lại chỉ là "mã tự nhất quán với chính nó" — LUFS vẫn tăng 6 khi to gấp
 * đôi, vẫn xếp hạng đúng, mà con số tuyệt đối thì lệch và không ai biết.
 */
import { describe, expect, it } from 'vitest';
import {
  DAI_TAM, chamBai, doDai, doDinhMau, doDinhThat, doLufs, doRongStereo, doTatCa, heSoK,
} from './amLuong';
import type { AmThanh } from './wav';

const FS = 48000;

function sin(giay: number, hz: number, bienDo = 1, fs = FS): Float32Array {
  const n = Math.round(giay * fs);
  const x = new Float32Array(n);
  for (let i = 0; i < n; i++) x[i] = bienDo * Math.sin((2 * Math.PI * hz * i) / fs);
  return x;
}

const stereo = (k: Float32Array, fs = FS): AmThanh => ({ tanSoMau: fs, kenh: [k, k] });

describe('bộ lọc K — đối chiếu với bảng trong chuẩn', () => {
  it('tầng kệ cao khớp hệ số công bố cho 48 kHz', () => {
    /* Sai số còn lại ~6 × 10⁻⁵. Bộ tham số analog (1500 Hz · 1/√2 · 4 dB) là
       số tròn, còn bảng trong chuẩn là kết quả đã qua làm tròn của một đường
       dẫn xuất khác, nên hai bên không trùng tới từng chữ số cuối. Chênh ở
       mức này thấp hơn nhiễu lượng tử hoá của 24-bit nhiều bậc.

       Dùng tham số SAI (1681,97 Hz) thì sai số là 5,6 × 10⁻² — lớn gấp 800
       lần, và đó mới là thứ phép kiểm này canh. */
    const [ke] = heSoK(48000);
    expect(ke.b0).toBeCloseTo(1.53512485958697, 3);
    expect(ke.b1).toBeCloseTo(-2.69169618940638, 3);
    expect(ke.b2).toBeCloseTo(1.19839281085285, 3);
    expect(ke.a1).toBeCloseTo(-1.69065929318241, 3);
    expect(ke.a2).toBeCloseTo(0.73248077421585, 3);
  });

  it('tầng chắn trầm khớp cực của chuẩn, và tử số đúng tỉ lệ 1 : −2 : 1', () => {
    const [, chan] = heSoK(48000);
    expect(chan.a1).toBeCloseTo(-1.99004745483398, 4);
    expect(chan.a2).toBeCloseTo(0.99007225036621, 4);
    /* Chuẩn in tử số đã chuẩn hoá cho b0 = 1; công thức song tuyến ở đây cho ra
       cùng tỉ lệ nhưng nhân thêm một hệ số khuếch đại ~0,995 (−0,04 dB). Tỉ lệ
       mới là thứ quyết định hình dạng bộ lọc, nên kiểm tỉ lệ. */
    expect(chan.b1 / chan.b0).toBeCloseTo(-2, 6);
    expect(chan.b2 / chan.b0).toBeCloseTo(1, 6);
  });

  it('hệ số ĐỔI theo tần số mẫu — đây là chỗ nhiều bản cài đặt gõ cứng rồi sai câm', () => {
    const [ke48] = heSoK(48000);
    const [ke441] = heSoK(44100);
    expect(ke441.b0).not.toBeCloseTo(ke48.b0, 4);
  });
});

describe('LUFS', () => {
  it('to gấp đôi biên độ thì tăng đúng 6 LU', () => {
    const a = doLufs(stereo(sin(3, 1000, 0.1)));
    const b = doLufs(stereo(sin(3, 1000, 0.2)));
    expect(b - a).toBeCloseTo(6.02, 1);
  });

  it('im lặng trả −Infinity chứ không phải 0', () => {
    // Trả 0 sẽ là "to hết cỡ" — sai ngược hẳn, và đủ để bộ chấm bài khuyên
    // người dùng hạ âm lượng của một bản trống trơn.
    expect(doLufs(stereo(new Float32Array(FS * 2)))).toBe(-Infinity);
  });

  it('bài dài hơn, cùng mức, cho cùng con số', () => {
    expect(doLufs(stereo(sin(2, 1000, 0.3)))).toBeCloseTo(doLufs(stereo(sin(6, 1000, 0.3))), 1);
  });

  it('cổng tương đối bỏ qua đoạn mở đầu nhỏ bất thường', () => {
    // 4 giây rất nhỏ rồi 4 giây to. Không có cổng thì trung bình bị kéo tụt.
    const nho = sin(4, 1000, 0.003);
    const to = sin(4, 1000, 0.3);
    const ghep = new Float32Array(nho.length + to.length);
    ghep.set(nho, 0);
    ghep.set(to, nho.length);
    expect(doLufs(stereo(ghep))).toBeCloseTo(doLufs(stereo(to)), 0);
  });

  it('tín hiệu quá ngắn (dưới một khối 400 ms) trả −Infinity', () => {
    expect(doLufs(stereo(sin(0.2, 1000, 0.5)))).toBe(-Infinity);
  });
});

describe('đỉnh', () => {
  it('đỉnh mẫu của sóng biên độ 0,5 là −6 dBFS', () => {
    expect(doDinhMau(stereo(sin(1, 1000, 0.5)))).toBeCloseTo(-6.02, 1);
  });

  it('⚠️ đỉnh THẬT cao hơn đỉnh mẫu — trường hợp kinh điển fs/4 lệch pha 45°', () => {
    /*
     * Cả lý do tồn tại của phép đo này. Sóng ở đúng fs/4, lệch pha 45°, rơi
     * mẫu vào các điểm ±A/√2 — KHÔNG mẫu nào trúng đỉnh. Đỉnh mẫu đo ra thấp
     * hơn đỉnh thật đúng 3,01 dB, và bộ hạn biên nào chỉ nhìn đỉnh mẫu sẽ cho
     * bản nhạc này đi qua rồi vỡ tiếng lúc nén sang MP3.
     */
    const n = FS;
    const x = new Float32Array(n);
    for (let i = 0; i < n; i++) x[i] = 0.7 * Math.sin(2 * Math.PI * i / 4 + Math.PI / 4);
    const am = stereo(x);
    expect(doDinhMau(am)).toBeCloseTo(20 * Math.log10(0.7 / Math.SQRT2), 1);
    expect(doDinhThat(am) - doDinhMau(am)).toBeGreaterThan(2.5);
  });

  it('tiếng trầm thì hai phép đo gần như bằng nhau', () => {
    const tram = stereo(sin(1, 100, 0.5));
    expect(doDinhThat(tram)).toBeCloseTo(doDinhMau(tram), 1);
  });
});

describe('độ rộng stereo', () => {
  it('hai kênh y hệt ⇒ 0', () => {
    expect(doRongStereo(stereo(sin(1, 440, 0.5)))).toBe(0);
  });

  it('hai kênh ngược pha ⇒ 1', () => {
    const k = sin(1, 440, 0.5);
    const nguoc = new Float32Array(k.length);
    for (let i = 0; i < k.length; i++) nguoc[i] = -k[i]!;
    expect(doRongStereo({ tanSoMau: FS, kenh: [k, nguoc] })).toBeCloseTo(1, 6);
  });

  it('tệp mono ⇒ 0, không nổ', () => {
    expect(doRongStereo({ tanSoMau: FS, kenh: [sin(1, 440)] })).toBe(0);
  });
});

describe('phổ theo dải', () => {
  it('sóng 1 kHz làm dải 1 kHz trội hẳn', () => {
    const dai = doDai(stereo(sin(2, 1000, 0.5)));
    const troi = DAI_TAM.reduce((a, b) => ((dai[b] ?? -Infinity) > (dai[a] ?? -Infinity) ? b : a));
    expect(troi).toBe(1000);
  });

  it('sóng 63 Hz làm dải 63 Hz trội hẳn', () => {
    const dai = doDai(stereo(sin(2, 63, 0.5)));
    const troi = DAI_TAM.reduce((a, b) => ((dai[b] ?? -Infinity) > (dai[a] ?? -Infinity) ? b : a));
    expect(troi).toBe(63);
  });

  it('trả đủ mười dải', () => {
    const dai = doDai(stereo(sin(2, 1000, 0.5)));
    expect(Object.keys(dai)).toHaveLength(DAI_TAM.length);
  });
});

describe('chấm bài', () => {
  it('bài nhỏ hơn bản mẫu thì nói ra, kèm số', () => {
    const ban = doTatCa(stereo(sin(3, 1000, 0.05)));
    const mau = doTatCa(stereo(sin(3, 1000, 0.4)));
    const kq = chamBai(ban, mau);
    expect(kq.lufs).toBeLessThan(-5);
    expect(kq.nhanXet.join(' ')).toMatch(/nhỏ hơn bản mẫu/);
  });

  it('thiếu trầm so với bản mẫu thì chỉ đúng dải', () => {
    const ban = doTatCa(stereo(sin(3, 1000, 0.3)));
    const tron = sin(3, 1000, 0.3);
    const tram = sin(3, 63, 0.3);
    const ghep = new Float32Array(tron.length);
    for (let i = 0; i < ghep.length; i++) ghep[i] = tron[i]! + tram[i]!;
    const mau = doTatCa(stereo(ghep));

    const kq = chamBai(ban, mau);
    expect(kq.dai[63]!).toBeLessThan(-3);
    expect(kq.nhanXet.join(' ')).toMatch(/Thiếu .* 63 Hz/);
  });

  it('cảnh báo vượt đỉnh khi bản của bạn chạm trần', () => {
    const ban = doTatCa(stereo(sin(2, 6000, 0.999)));
    const mau = doTatCa(stereo(sin(2, 6000, 0.5)));
    expect(chamBai(ban, mau).nhanXet.join(' ')).toMatch(/dBTP/);
  });

  it('hai bản giống hệt thì KHÔNG bịa ra nhận xét', () => {
    const x = doTatCa(stereo(sin(3, 1000, 0.3)));
    expect(chamBai(x, x).nhanXet).toEqual([]);
  });
});
