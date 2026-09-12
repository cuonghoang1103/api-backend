/**
 * ============================================================
 * ĐO TO — NHỎ, ĐỈNH, PHỔ TẦN, ĐỘ RỘNG STEREO
 * ============================================================
 *
 * Đây là lõi của tính năng **chấm bài**: đo bản của bạn, đo một bản của Tilo,
 * rồi nói thẳng chênh nhau ở đâu. Không có bước đo này thì "nghe chưa đủ dày"
 * mãi là cảm giác, không thành việc sửa được.
 *
 * ─── Vì sao LUFS chứ không phải dB ───
 * Tai người không nghe mọi tần số như nhau: cùng một mức, tiếng 60 Hz nghe nhỏ
 * hơn hẳn tiếng 3 kHz. Đo bằng dB thô thì một bản thừa bass sẽ báo "to" trong
 * khi tai nghe là "đục". LUFS (chuẩn ITU-R BS.1770-4) lọc tín hiệu theo đúng
 * đường cong tai người trước khi đo, nên con số của nó khớp với cảm nhận —
 * và nó là đơn vị mà Spotify, YouTube, Apple Music dùng để chuẩn hoá âm lượng.
 *
 * ⚠️ Bộ lọc K PHẢI dựng lại theo tần số mẫu. Rất nhiều bản cài đặt ngoài kia
 * gõ cứng hệ số của 48 kHz rồi dùng luôn cho 44,1 kHz — chạy không lỗi, và sai
 * chừng nửa dB một cách âm thầm. Ở đây hệ số được TÍNH từ tham số analog trong
 * chuẩn, nên đúng ở mọi tần số mẫu; `amLuong.test.ts` đối chiếu kết quả tại
 * 48 kHz với bảng hệ số in trong chuẩn.
 */
import { cuaSoHann, phoBienDo } from './fft';
import type { AmThanh } from './wav';
import { loc, type HeSo } from './loc';

export interface KetQuaDo {
  /** Độ to tích hợp, đơn vị LUFS. `-Infinity` khi im lặng hoàn toàn. */
  lufs: number;
  /** Đỉnh mẫu, dBFS. */
  dinhMau: number;
  /** Đỉnh thật (lấy mẫu gấp 4), dBTP — cái mà bộ hạn biên phải nhìn. */
  dinhThat: number;
  /** Dải động: chênh giữa đoạn to nhất và độ to trung bình, đơn vị LU. */
  daiDong: number;
  /** 0 = mono đặc, 1 = rộng như thu trường. Tính từ tỉ lệ năng lượng giữa/bên. */
  rongStereo: number;
  /** Mức mỗi dải quãng tám, dB. Khoá là tần số trung tâm. */
  dai: Record<number, number>;
}

/* ── Bộ lọc hai cực ───────────────────────────────────────── */

/* Dùng chung `loc()`/`HeSo` với `loc.ts` — MỘT bản cài đặt phương trình sai
   phân cho cả bộ đo lẫn EQ khi trộn. Hai bản chép nhau thì một hôm sẽ có bản
   được sửa và bản kia không, và triệu chứng là LUFS lệch so với tiếng thật. */

/**
 * Hai tầng của bộ lọc K, dựng từ tham số analog trong BS.1770-4.
 *
 * Tầng 1 là kệ cao mô phỏng đầu người chắn sóng âm; tầng 2 là chắn trầm mô
 * phỏng việc tai không nghe hạ âm.
 *
 * ─── ⚠️ TẦN SỐ KỆ CAO LÀ 1500 Hz, KHÔNG PHẢI 1681,97 Hz ───
 * Con số 1681,974450955533 Hz lan rất rộng — `pyloudnorm` dùng nó, và hàng
 * loạt bản cài đặt khác chép lại từ đó. Nó SAI.
 *
 * Đo thật ở đây: chuẩn BS.1770-4 công bố thẳng bảng hệ số cho 48 kHz, nên chỉ
 * cần dò ngược xem bộ tham số analog nào tái tạo đúng bảng đó.
 *
 *     f0 = 1681,974 · Q = 0,70718 · G = 3,99984  ⇒ lệch  5,6 × 10⁻²
 *     f0 = 1500,000 · Q = 1/√2    · G = 4,0      ⇒ lệch  7,1 × 10⁻⁵
 *
 * Lệch 800 lần, và bộ đúng lại toàn số tròn — dấu hiệu rõ đây mới là thiết kế
 * gốc. Chuyện này đã được báo cho pyloudnorm từ 2018 (issue #3) kèm biểu đồ
 * đáp tuyến; phép dò số ở trên là bằng chứng chặt hơn, và cùng kết luận.
 *
 * Cái giá của việc chép nhầm không lớn nhưng có thật: đáp tuyến lệch vài phần
 * trăm ⇒ LUFS lệch vài phần mười dB ⇒ phần "chấm bài" khuyên sai về mức to.
 */
export function heSoK(tanSoMau: number): [HeSo, HeSo] {
  // Kệ cao: +4 dB tại 1500 Hz, Q = 1/√2.
  const A = Math.pow(10, 4.0 / 40);
  const w0 = (2 * Math.PI * 1500) / tanSoMau;
  const al = Math.sin(w0) / (2 * (1 / Math.SQRT2));
  const c = Math.cos(w0);
  const rA = Math.sqrt(A);
  const a0 = (A + 1) - (A - 1) * c + 2 * rA * al;
  const ke: HeSo = {
    b0: (A * ((A + 1) + (A - 1) * c + 2 * rA * al)) / a0,
    b1: (-2 * A * ((A - 1) + (A + 1) * c)) / a0,
    b2: (A * ((A + 1) + (A - 1) * c - 2 * rA * al)) / a0,
    a1: (2 * ((A - 1) - (A + 1) * c)) / a0,
    a2: ((A + 1) - (A - 1) * c - 2 * rA * al) / a0,
  };

  // Chắn trầm: cắt tại 38,135 Hz.
  const w1 = (2 * Math.PI * 38.13547087602444) / tanSoMau;
  const al1 = Math.sin(w1) / (2 * 0.5003270373238773);
  const c1 = Math.cos(w1);
  const a0b = 1 + al1;
  const chan: HeSo = {
    b0: ((1 + c1) / 2) / a0b,
    b1: (-(1 + c1)) / a0b,
    b2: ((1 + c1) / 2) / a0b,
    a1: (-2 * c1) / a0b,
    a2: (1 - al1) / a0b,
  };

  return [ke, chan];
}

/* ── Độ to tích hợp ───────────────────────────────────────── */

/** Bù cố định trong chuẩn, gốc từ hiệu chuẩn bằng người nghe. */
const BU = -0.691;

/**
 * LUFS tích hợp, có cả hai cổng của chuẩn.
 *
 * Cổng tuyệt đối (−70 LUFS) vứt đoạn im lặng. Cổng tương đối (−10 LU dưới mức
 * trung bình) vứt đoạn nhỏ bất thường — nếu không có nó, một bài mở đầu bằng
 * hai mươi giây đàn nhẹ sẽ bị chấm là "nhỏ" dù cả phần còn lại đánh hết cỡ.
 */
export function doLufs(am: AmThanh): number {
  const [ke, chan] = heSoK(am.tanSoMau);
  const daLoc = am.kenh.map((k) => loc(loc(k, ke), chan));

  const khung = Math.round(0.4 * am.tanSoMau);  // khối 400 ms
  const buoc = Math.round(0.1 * am.tanSoMau);   // trượt 100 ms ⇒ chồng 75%
  const soMau = daLoc[0]?.length ?? 0;
  if (soMau < khung) return -Infinity;

  /* Trọng số kênh theo chuẩn: trái/phải/giữa = 1,0; vòm = 1,41. Stereo thì cả
     hai kênh đều là 1,0, nên bảng này chỉ có ý nghĩa khi sau này nhận 5.1. */
  const trong = daLoc.map((_, i) => (i >= 3 ? 1.41 : 1.0));

  const z: number[] = [];
  for (let dau = 0; dau + khung <= soMau; dau += buoc) {
    let tong = 0;
    for (let c = 0; c < daLoc.length; c++) {
      let bp = 0;
      const k = daLoc[c]!;
      for (let i = dau; i < dau + khung; i++) bp += k[i]! * k[i]!;
      tong += trong[c]! * (bp / khung);
    }
    z.push(tong);
  }
  if (z.length === 0) return -Infinity;

  const doTo = (t: number) => (t > 0 ? BU + 10 * Math.log10(t) : -Infinity);

  const qua1 = z.filter((t) => doTo(t) > -70);
  if (qua1.length === 0) return -Infinity;

  const tb1 = qua1.reduce((s, t) => s + t, 0) / qua1.length;
  const nguong = doTo(tb1) - 10;

  const qua2 = qua1.filter((t) => doTo(t) > nguong);
  if (qua2.length === 0) return -Infinity;

  const tb2 = qua2.reduce((s, t) => s + t, 0) / qua2.length;
  return doTo(tb2);
}

/* ── Đỉnh ─────────────────────────────────────────────────── */

const dB = (x: number) => (x > 0 ? 20 * Math.log10(x) : -Infinity);

export function doDinhMau(am: AmThanh): number {
  let d = 0;
  for (const k of am.kenh) for (let i = 0; i < k.length; i++) d = Math.max(d, Math.abs(k[i]!));
  return dB(d);
}

/**
 * Đỉnh THẬT — lấy mẫu gấp 4 rồi mới đo.
 *
 * Dạng sóng số chỉ ghi lại giá trị TẠI các điểm lấy mẫu. Đỉnh thật của sóng
 * liên tục nằm GIỮA hai điểm đó và có thể cao hơn hẳn — hay gặp nhất ở tiếng
 * gần Nyquist. Một bản đo đỉnh mẫu đúng −0,1 dBFS vẫn có thể đạt +0,8 dBTP và
 * làm vỡ tiếng khi bị nén sang MP3/AAC.
 *
 * Nội suy bằng sinc có cửa sổ, 32 nhánh mỗi pha.
 *
 * ⚠️ 32 nhánh chứ không phải 16. Bản đầu tiên ở đây dùng 16 và phép kiểm bắt
 * được ngay: với sóng sát Nyquist, đỉnh "thật" đo ra THẤP HƠN cả đỉnh mẫu.
 * Lý do là nhân sinc cắt ngắn chính là một bộ lọc thông thấp có dải chuyển
 * tiếp rất rộng — 16 nhánh thì tiếng sát Nyquist rơi vào vùng bị chặn và bị
 * nén xuống, nên phép đo báo an toàn đúng ở chỗ nguy hiểm nhất.
 */
export function doDinhThat(am: AmThanh): number {
  const NHANH = 32;
  const PHA = 4;
  // Dựng sẵn nhân nội suy cho 3 pha xen giữa (pha 0 chính là mẫu gốc).
  const nhan: Float64Array[] = [];
  for (let p = 1; p < PHA; p++) {
    const t = p / PHA;
    const h = new Float64Array(NHANH);
    for (let i = 0; i < NHANH; i++) {
      const x = i - NHANH / 2 + 1 - t;
      const s = x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x);
      // Cửa sổ Hann trên chính nhân lọc — cắt cụt sinc mà không có cửa sổ sẽ
      // sinh gợn và làm đỉnh đo được cao giả.
      h[i] = s * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (NHANH - 1)));
    }
    nhan.push(h);
  }

  let dinh = 0;
  for (const k of am.kenh) {
    for (let i = 0; i < k.length; i++) {
      dinh = Math.max(dinh, Math.abs(k[i]!));
      for (const h of nhan) {
        let tong = 0;
        for (let j = 0; j < NHANH; j++) {
          const n = i + j - NHANH / 2 + 1;
          if (n >= 0 && n < k.length) tong += k[n]! * h[j]!;
        }
        dinh = Math.max(dinh, Math.abs(tong));
      }
    }
  }
  return dB(dinh);
}

/* ── Độ rộng stereo ───────────────────────────────────────── */

/**
 * 0 = hai kênh giống hệt (mono đặc) · 1 = hai kênh độc lập.
 *
 * Tính từ tỉ lệ năng lượng bên/giữa. Với vinahouse, phần trầm nên gần mono
 * (rộng quá thì loa sàn đánh mất lực), còn phần cao thì rộng mới thoáng — nên
 * con số tổng này chỉ để SO với bản mẫu, không phải để đặt đích tuyệt đối.
 */
export function doRongStereo(am: AmThanh): number {
  const [L, R] = am.kenh;
  if (!L || !R) return 0;
  let giua = 0;
  let ben = 0;
  const n = Math.min(L.length, R.length);
  for (let i = 0; i < n; i++) {
    const m = (L[i]! + R[i]!) / 2;
    const s = (L[i]! - R[i]!) / 2;
    giua += m * m;
    ben += s * s;
  }
  if (giua + ben === 0) return 0;
  return ben / (giua + ben);
}

/* ── Phổ theo dải quãng tám ───────────────────────────────── */

/** Mười dải trung tâm — đúng mười cần gạt trên một bộ EQ đồ hoạ. */
export const DAI_TAM = [31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000] as const;

/**
 * Mức trung bình của từng dải quãng tám, dB.
 *
 * Dùng phương pháp Welch: cắt bài thành nhiều khung, lấy phổ công suất từng
 * khung rồi TRUNG BÌNH. Một khung đơn lẻ của nhạc là ảnh chụp một khoảnh khắc
 * và dao động rất mạnh; trung bình hàng trăm khung mới ra được đường phổ ổn
 * định để đem so với bài khác.
 */
export function doDai(am: AmThanh, khungMau = 4096): Record<number, number> {
  const [dau] = am.kenh;
  if (!dau) return {};

  // Gộp mono trước: so phổ giữa hai bài là so nội dung, không so cách dàn stereo.
  const n = dau.length;
  const mono = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let t = 0;
    for (const k of am.kenh) t += k[i]!;
    mono[i] = t / am.kenh.length;
  }

  const w = cuaSoHann(khungMau);
  // Bù năng lượng mất đi do nhân cửa sổ, nếu không mọi mức đều thấp giả ~4,3 dB.
  let buCuaSo = 0;
  for (let i = 0; i < khungMau; i++) buCuaSo += w[i]! * w[i]!;
  buCuaSo /= khungMau;

  const buoc = khungMau >> 1;
  const soO = khungMau / 2 + 1;
  const congSuat = new Float64Array(soO);
  let soKhung = 0;

  const tam = new Float32Array(khungMau);
  for (let dauK = 0; dauK + khungMau <= n; dauK += buoc) {
    for (let i = 0; i < khungMau; i++) tam[i] = mono[dauK + i]! * w[i]!;
    const p = phoBienDo(tam);
    for (let i = 0; i < soO; i++) congSuat[i] = congSuat[i]! + p[i]! * p[i]!;
    soKhung++;
  }
  if (soKhung === 0) return {};

  const oHz = am.tanSoMau / khungMau;
  const ra: Record<number, number> = {};
  for (const tam2 of DAI_TAM) {
    // Dải quãng tám: từ f/√2 tới f·√2.
    const thap = tam2 / Math.SQRT2;
    const cao = tam2 * Math.SQRT2;
    let tong = 0;
    let dem = 0;
    for (let i = 1; i < soO; i++) {
      const f = i * oHz;
      if (f >= thap && f < cao) { tong += congSuat[i]! / soKhung; dem++; }
    }
    ra[tam2] = dem > 0 ? 10 * Math.log10(tong / dem / buCuaSo + 1e-20) : -Infinity;
  }
  return ra;
}

/* ── Gộp một lượt ─────────────────────────────────────────── */

export function doTatCa(am: AmThanh): KetQuaDo {
  const lufs = doLufs(am);
  const dinhMau = doDinhMau(am);
  return {
    lufs,
    dinhMau,
    dinhThat: doDinhThat(am),
    daiDong: Number.isFinite(lufs) && Number.isFinite(dinhMau) ? dinhMau - lufs : 0,
    rongStereo: doRongStereo(am),
    dai: doDai(am),
  };
}

/* ── So với bản mẫu — đây là "chấm bài" ───────────────────── */

export interface Chenh {
  lufs: number;
  rongStereo: number;
  /** Dương = bài bạn NHIỀU hơn bản mẫu ở dải đó. */
  dai: Record<number, number>;
  /** Câu nhận xét đã sắp theo mức nghiêm trọng, hiện thẳng cho người dùng. */
  nhanXet: string[];
}

/** Chênh bao nhiêu dB ở một dải thì đáng nói ra. Dưới ngưỡng này tai không phân biệt. */
const NGUONG_DAI = 3;

export function chamBai(cuaBan: KetQuaDo, banMau: KetQuaDo): Chenh {
  const dai: Record<number, number> = {};
  for (const f of DAI_TAM) {
    const a = cuaBan.dai[f];
    const b = banMau.dai[f];
    if (a === undefined || b === undefined || !Number.isFinite(a) || !Number.isFinite(b)) continue;
    dai[f] = a - b;
  }

  const nhanXet: string[] = [];
  const dLufs = cuaBan.lufs - banMau.lufs;
  if (Number.isFinite(dLufs) && Math.abs(dLufs) >= 1) {
    nhanXet.push(dLufs < 0
      ? `Bài bạn nhỏ hơn bản mẫu ${Math.abs(dLufs).toFixed(1)} LU — cần nén và nâng thêm.`
      : `Bài bạn to hơn bản mẫu ${dLufs.toFixed(1)} LU — coi chừng đã ép quá tay.`);
  }

  if (cuaBan.dinhThat > -0.3) {
    nhanXet.push(`Đỉnh thật ${cuaBan.dinhThat.toFixed(1)} dBTP — sẽ vỡ tiếng khi nén sang MP3. Hạ trần bộ hạn biên xuống −1 dBTP.`);
  }

  // Sắp theo mức chênh giảm dần: nói cái lệch nhiều nhất trước.
  const theoMuc = Object.entries(dai)
    .map(([f, d]) => ({ f: Number(f), d }))
    .filter((x) => Math.abs(x.d) >= NGUONG_DAI)
    .sort((a, b) => Math.abs(b.d) - Math.abs(a.d));

  for (const { f, d } of theoMuc.slice(0, 4)) {
    const ten = f >= 1000 ? `${f / 1000} kHz` : `${f} Hz`;
    nhanXet.push(d < 0
      ? `Thiếu ${Math.abs(d).toFixed(1)} dB ở ${ten} so với bản mẫu.`
      : `Thừa ${d.toFixed(1)} dB ở ${ten} so với bản mẫu.`);
  }

  const dRong = cuaBan.rongStereo - banMau.rongStereo;
  if (Math.abs(dRong) >= 0.08) {
    nhanXet.push(dRong < 0
      ? 'Ảnh stereo hẹp hơn bản mẫu — nới phần cao ra hai bên, giữ trầm ở giữa.'
      : 'Ảnh stereo rộng hơn bản mẫu — kiểm lại phần trầm, nó nên gần mono.');
  }

  return { lufs: dLufs, rongStereo: dRong, dai, nhanXet };
}
