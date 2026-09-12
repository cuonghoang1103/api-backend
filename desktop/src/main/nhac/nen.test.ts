/**
 * Kiểm bộ nén và cú duck theo kick.
 *
 * Hai phép kiểm đáng nhất nằm ở chỗ dễ sai mà nghe không ra ngay:
 *
 *  ⭐ `mocKick` phải bắt ĐÚNG số cú trống cái, không đếm cả snare. Đếm nhầm
 *     thì cú duck kích 8 lần một ô nhịp thay vì 4 — bài vẫn phát, vẫn "có
 *     pump", chỉ là sai nhịp thở, và người mới sẽ tưởng tại tai mình.
 *  ⭐ Hai kênh phải bị ghì BẰNG NHAU. Ghì lệch làm ảnh stereo nghiêng theo
 *     từng cú kick; nghe từng kênh riêng thì hoàn toàn bình thường.
 */
import { describe, expect, it } from 'vitest';
import { duckTheoKick, duongBao, gopDo, mocKick, mocTuBpm, nen } from './nen';

const FS = 48000;

/** Sin thuần, biên độ cố định. */
function sin(giay: number, hz: number, bienDo = 1): Float32Array {
  const n = Math.round(giay * FS);
  const x = new Float32Array(n);
  for (let i = 0; i < n; i++) x[i] = bienDo * Math.sin((2 * Math.PI * hz * i) / FS);
  return x;
}

/** Đỉnh tuyệt đối trong một khoảng mẫu. */
function dinh(x: Float32Array, tu = 0, den = x.length): number {
  let m = 0;
  for (let i = tu; i < Math.min(den, x.length); i++) m = Math.max(m, Math.abs(x[i]!));
  return m;
}

/** Một bản nhạc giả: kick 60 Hz mỗi `nhip` giây, snare 400 Hz xen giữa. */
function trongGia(giay: number, nhip: number, coSnare: boolean): Float32Array {
  const n = Math.round(giay * FS);
  const x = new Float32Array(n);
  const danh = (moc: number, hz: number, dai: number, to: number) => {
    const len = Math.round(dai * FS);
    for (let i = 0; i < len && moc + i < n; i++) {
      x[moc + i]! += to * Math.exp(-i / (0.03 * FS)) * Math.sin((2 * Math.PI * hz * i) / FS);
    }
  };
  for (let t = 0; t + nhip <= giay + 1e-9; t += nhip) {
    danh(Math.round(t * FS), 60, 0.15, 0.9);
    if (coSnare) danh(Math.round((t + nhip / 2) * FS), 400, 0.08, 0.7);
  }
  return x;
}

describe('đường bao', () => {
  it('bám lên nhanh và nhả chậm', () => {
    const x = new Float32Array(FS);
    x.fill(1, 0, FS / 2);                      // nửa đầu to, nửa sau im
    const b = duongBao(x, FS, 0.001, 0.2);
    expect(b[Math.round(0.02 * FS)]!).toBeGreaterThan(0.9);   // đã lên gần đủ
    expect(b[Math.round(0.52 * FS)]!).toBeGreaterThan(0.5);   // còn chưa nhả hết
    expect(b[Math.round(0.9 * FS)]!).toBeLessThan(0.2);
  });

  it('gopDo lấy kênh to nhất từng mẫu, không phải trung bình', () => {
    // `toEqual` với số thực trong Float32Array là bẫy: 0,9 lưu thành
    // 0,89999997… nên so bằng sẽ đỏ vì lý do chẳng liên quan gì tới hàm.
    const a = new Float32Array([0.2, -0.9, 0]);
    const b = new Float32Array([-0.5, 0.1, 0]);
    const ra = Array.from(gopDo([a, b]));
    [0.5, 0.9, 0].forEach((v, i) => expect(ra[i]!).toBeCloseTo(v, 6));
  });
});

describe('bộ nén', () => {
  it('dưới ngưỡng thì không đụng gì', () => {
    const x = sin(0.5, 440, 0.05);            // ≈ −26 dBFS
    const [ra] = nen([x], FS, { nguong: -6, tiLe: 4, khuyu: 0 });
    expect(dinh(ra!, FS / 4)).toBeCloseTo(dinh(x, FS / 4), 3);
  });

  it('⭐ trên ngưỡng thì ghì đúng theo tỉ lệ', () => {
    /* Vào −6 dBFS, ngưỡng −18, tỉ lệ 4 ⇒ vượt 12 dB, cho ra 3 dB trên ngưỡng
       ⇒ đích −15 dBFS. Đo ở cuối để bộ nén đã ổn định. */
    const x = sin(1, 440, Math.pow(10, -6 / 20));
    const [ra] = nen([x], FS, { nguong: -18, tiLe: 4, khuyu: 0, tanCong: 0.002, nhaRa: 0.05 });
    const dbRa = 20 * Math.log10(dinh(ra!, Math.round(0.8 * FS)));
    expect(dbRa).toBeGreaterThan(-16.2);
    expect(dbRa).toBeLessThan(-13.8);
  });

  it('bù độ to cộng thẳng vào kết quả', () => {
    const x = sin(1, 440, Math.pow(10, -6 / 20));
    const o = { nguong: -18, tiLe: 4, khuyu: 0, tanCong: 0.002, nhaRa: 0.05 };
    const khong = nen([x], FS, o)[0]!;
    const co = nen([x], FS, { ...o, bu: 6 })[0]!;
    const chenh = 20 * Math.log10(dinh(co, FS / 2) / dinh(khong, FS / 2));
    expect(chenh).toBeCloseTo(6, 1);
  });

  it('tỉ lệ ∞ (giới hạn) không cho vượt ngưỡng đáng kể', () => {
    const x = sin(1, 440, 1);
    const [ra] = nen([x], FS, { nguong: -12, tiLe: 1000, khuyu: 0, tanCong: 0.001, nhaRa: 0.05 });
    expect(20 * Math.log10(dinh(ra!, FS / 2))).toBeLessThan(-11);
  });

  it('⭐ hai kênh bị ghì BẰNG NHAU dù mức khác nhau', () => {
    // Kênh phải nhỏ hơn 6 dB. Sau khi nén, chênh lệch ấy phải GIỮ NGUYÊN.
    const L = sin(1, 440, 0.9);
    const R = sin(1, 440, 0.45);
    const ra = nen([L, R], FS, { nguong: -20, tiLe: 6, tanCong: 0.002, nhaRa: 0.05 });
    const truoc = 20 * Math.log10(dinh(L, FS / 2) / dinh(R, FS / 2));
    const sau = 20 * Math.log10(dinh(ra[0]!, FS / 2) / dinh(ra[1]!, FS / 2));
    expect(sau).toBeCloseTo(truoc, 4);
  });

  it('nghe tín hiệu NGOÀI thì ghì theo tín hiệu đó, không theo chính nó', () => {
    const im = sin(1, 440, 0.02);              // rất nhỏ, tự nó không kích nén
    const to = sin(1, 60, 1);
    const [ra] = nen([im], FS, {
      nguong: -20, tiLe: 8, tanCong: 0.002, nhaRa: 0.05, tinHieuDo: to,
    });
    expect(dinh(ra!, FS / 2)).toBeLessThan(dinh(im, FS / 2) * 0.5);
  });

  it('mảng rỗng không làm nổ', () => {
    expect(nen([new Float32Array(0)], FS, { nguong: -10, tiLe: 4 })[0]!.length).toBe(0);
  });
});

describe('tìm mốc kick', () => {
  it('⭐ bắt đúng bốn cú kick một ô nhịp, KHÔNG đếm snare', () => {
    /* 120 BPM = 0,5 s một phách. Hai giây có 4 kick và 4 snare xen giữa. Bộ dò
       chỉ được trả về 4 — nếu nó đếm 8 thì cú duck sẽ thở gấp đôi nhịp bài. */
    const moc = mocKick([trongGia(2, 0.5, true)], FS);
    expect(moc.length).toBe(4);
  });

  it('mốc rơi đúng vào cú đánh, sai số dưới 15 ms', () => {
    const moc = mocKick([trongGia(2, 0.5, true)], FS);
    moc.forEach((m, i) => {
      expect(Math.abs(m - i * 0.5 * FS)).toBeLessThan(0.015 * FS);
    });
  });

  it('không có snare cũng ra đúng bấy nhiêu cú', () => {
    expect(mocKick([trongGia(2, 0.5, false)], FS).length).toBe(4);
  });

  it('⭐ một cú impact hạ âm to hơn hẳn KHÔNG được làm mù cả bài', () => {
    /* Nhạc sàn hay có một cú impact ở chỗ drop, to hơn kick cả chục dB. Với
       ngưỡng lấy theo đỉnh lớn nhất, nó kéo ngưỡng lên trên mọi cú kick thật
       và bộ dò trả về đúng MỘT mốc: cả bài không duck, mà chẳng có lỗi nào.
       Lượt quét thứ hai (theo trung vị) tồn tại đúng vì tình huống này. */
    const x = trongGia(2, 0.5, true);
    const m = Math.round(1.0 * FS);
    for (let i = 0; i < 0.25 * FS && m + i < x.length; i++) {
      x[m + i]! += 6 * Math.exp(-i / (0.08 * FS)) * Math.sin((2 * Math.PI * 45 * i) / FS);
    }
    // Cú impact trùng đúng một cú kick, nên tổng vẫn là 4 mốc chứ không phải 5.
    expect(mocKick([x], FS).length).toBe(4);
  });

  it('cú đánh đều nhau thì lượt hai không đổi gì', () => {
    // Lưới an toàn cho chính lượt hai: nó chỉ được can thiệp khi có kẻ lạc loài.
    expect(mocKick([trongGia(3, 0.5, false)], FS).length).toBe(6);
  });

  it('⭐ một nốt trầm NGÂN DÀI chỉ là MỘT cú, không phải một cú mỗi 100 ms', () => {
    /* Luật "trên ngưỡng + cách nhau 100 ms" đẻ ra 10 mốc cho một nốt ngân
       một giây. Cú duck sẽ giật liên hồi trong lúc bài đang ngân. Chỉ đoạn
       đường bao VỌT LÊN mới là cú đánh. */
    const n = FS;
    const x = new Float32Array(n);
    for (let i = 0; i < n; i++) x[i] = 0.8 * Math.sin((2 * Math.PI * 55 * i) / FS);
    expect(mocKick([x], FS).length).toBe(1);
  });

  it('stem trống im lặng thì không bịa ra cú nào', () => {
    expect(mocKick([new Float32Array(FS)], FS)).toEqual([]);
  });

  it('mocTuBpm rải đều theo phách', () => {
    const moc = mocTuBpm(140, FS, Math.round(2 * FS));
    expect(moc.length).toBe(Math.ceil(2 / (60 / 140)));
    expect(moc[1]! - moc[0]!).toBe(Math.round((60 / 140) * FS));
  });

  it('mocTuBpm với nhịp vô lý trả mảng rỗng thay vì lặp vô hạn', () => {
    expect(mocTuBpm(0, FS, FS)).toEqual([]);
    expect(mocTuBpm(-5, FS, FS)).toEqual([]);
  });
});

describe('duck theo kick', () => {
  const nen1 = () => sin(2, 220, 0.8);          // "bass" đều tăm tắp
  const moc = [0.5, 1.0, 1.5].map((t) => Math.round(t * FS));

  it('⭐ ghì đúng độ sâu đã đặt ngay tại cú kick', () => {
    const x = nen1();
    const [ra] = duckTheoKick([x], moc, FS, { sau: 0.6, hoiPhuc: 0.3 });
    const m = moc[1]!;
    // Ngay sau mốc: còn 40% biên độ. Đo trên một cửa sổ ngắn quanh đó.
    const conLai = dinh(ra!, m, m + Math.round(0.005 * FS)) / dinh(x, m, m + Math.round(0.005 * FS));
    expect(conLai).toBeGreaterThan(0.3);
    expect(conLai).toBeLessThan(0.5);
  });

  it('hồi lại đủ trước cú kick sau', () => {
    const x = nen1();
    const [ra] = duckTheoKick([x], moc, FS, { sau: 0.7, hoiPhuc: 0.3 });
    const truocKick = moc[2]! - Math.round(0.01 * FS);
    const tiLe = dinh(ra!, truocKick - 500, truocKick) / dinh(x, truocKick - 500, truocKick);
    expect(tiLe).toBeGreaterThan(0.95);
  });

  it('⚠️ không có bước nhảy nào trong dạng sóng — bước nhảy nghe ra là tiếng tách', () => {
    /* Chênh lệch giữa hai mẫu liền nhau của một sin 220 Hz là rất nhỏ. Nếu hệ
       số ghì nhảy tức thì thì tại đúng mốc kick sẽ có một bước lớn hơn hẳn.
       Đây là lý do `tanCong` không được bằng 0. */
    const [ra] = duckTheoKick([nen1()], moc, FS, { sau: 0.9, hoiPhuc: 0.3, tanCong: 0.004 });
    let buocLonNhat = 0;
    for (let i = 1; i < ra!.length; i++) {
      buocLonNhat = Math.max(buocLonNhat, Math.abs(ra![i]! - ra![i - 1]!));
    }
    // Một sin 220 Hz biên độ 0,8 đi tối đa ~0,023 mỗi mẫu ở 48 kHz.
    expect(buocLonNhat).toBeLessThan(0.03);
  });

  it('tanCong = 0 vẫn bị ép lên mức tối thiểu, không sinh bước nhảy', () => {
    const [ra] = duckTheoKick([nen1()], moc, FS, { sau: 1, hoiPhuc: 0.3, tanCong: 0 });
    let buoc = 0;
    for (let i = 1; i < ra!.length; i++) buoc = Math.max(buoc, Math.abs(ra![i]! - ra![i - 1]!));
    expect(buoc).toBeLessThan(0.1);
  });

  it('⭐ hai kênh ghì y hệt nhau — ảnh stereo không nghiêng', () => {
    const L = sin(2, 220, 0.8);
    const R = sin(2, 220, 0.4);
    const ra = duckTheoKick([L, R], moc, FS, { sau: 0.6, hoiPhuc: 0.3 });
    for (const i of [moc[1]! + 100, moc[1]! + 3000, moc[2]! - 100]) {
      expect(ra[0]![i]! / L[i]!).toBeCloseTo(ra[1]![i]! / R[i]!, 6);
    }
  });

  it('kick chồng nhau thì cú mới thắng', () => {
    // Hai mốc cách 50 ms trong khi hồi phục cần 300 ms.
    const x = nen1();
    const gan = [Math.round(0.5 * FS), Math.round(0.55 * FS)];
    const [ra] = duckTheoKick([x], gan, FS, { sau: 0.8, hoiPhuc: 0.3 });
    const m = gan[1]!;
    const tiLe = dinh(ra!, m, m + 200) / dinh(x, m, m + 200);
    expect(tiLe).toBeLessThan(0.35);
  });

  it('không có mốc nào, hoặc sâu bằng 0, thì trả về nguyên bản', () => {
    const x = nen1();
    expect(Array.from(duckTheoKick([x], [], FS, { sau: 0.8 })[0]!)).toEqual(Array.from(x));
    expect(Array.from(duckTheoKick([x], moc, FS, { sau: 0 })[0]!)).toEqual(Array.from(x));
  });
});
