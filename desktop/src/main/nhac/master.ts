/**
 * ============================================================
 * MASTER THEO BẢN MẪU
 * ============================================================
 *
 * Đo một bản của Tilo, rồi ép bản của bạn về đúng bốn thứ của nó: mức to, đáp
 * tuyến tần số, độ rộng stereo, và trần đỉnh.
 *
 * ─── Vì sao "theo bản mẫu" chứ không phải "master tự động" ───
 * Master tự động phải ĐOÁN xem bài này nên nghe thế nào — và đoán sai thì
 * không ai biết, vì không có gì để đối chiếu. Theo bản mẫu thì không có chỗ
 * nào để đoán: đích là một bài có thật, đo được, và người dùng tự chọn. Đây
 * cũng là cách Matchering làm.
 *
 * Và nó trả lời đúng câu hỏi của người mới: "vì sao bài tôi nghe mỏng hơn bài
 * ngoài kia?" — câu trả lời thành một danh sách chênh lệch đo được, thay vì
 * một cảm giác.
 *
 * ─── Vì sao tự viết chứ không dùng pedalboard ───
 * `pedalboard` của Spotify làm được việc này và làm tốt, nhưng nó là **GPLv3**
 * (kéo theo JUCE và VST3 SDK). Nhúng vào một app desktop có ký tên và phát
 * hành công khai là dính ràng buộc lây lan cho toàn bộ app.
 *
 * ⚠️ Đây KHÔNG thay được tai người. Nó khớp bốn con số; nó không biết bản mix
 * của bạn có bị đục ở quãng trung hay không, và ép một bản mix tệ về phổ của
 * một bản hay chỉ làm nó thành một bản tệ nghe TO hơn. Giao diện nói thẳng
 * điều đó.
 */
import { doDinhThat, doLufs, doRongStereo } from './amLuong';
import { cuaSoHann, fft, fftNguoc, laLuyThua2 } from './fft';
import type { AmThanh } from './wav';

/** Kích thước FFT khi đo phổ và dựng bộ lọc khớp. */
const N_PHO = 4096;

/** Đặc tính đo được của một bài — đây là "bản mẫu" đem đi khớp. */
export interface DacTinh {
  /** Phổ biên độ trung bình, `N_PHO/2 + 1` ô. */
  pho: Float64Array;
  rms: number;
  rongStereo: number;
  dinhThat: number;
  lufs: number;
  tanSoMau: number;
}

function tronMono(am: AmThanh): Float32Array {
  const [dau] = am.kenh;
  if (!dau) throw new Error('không có kênh nào');
  if (am.kenh.length === 1) return dau;
  const ra = new Float32Array(dau.length);
  for (let i = 0; i < ra.length; i++) {
    let t = 0;
    for (const k of am.kenh) t += k[i]!;
    ra[i] = t / am.kenh.length;
  }
  return ra;
}

function doRms(x: Float32Array): number {
  let t = 0;
  for (let i = 0; i < x.length; i++) t += x[i]! * x[i]!;
  return Math.sqrt(t / Math.max(1, x.length));
}

/**
 * Phổ biên độ trung bình theo phương pháp Welch.
 *
 * Một khung đơn lẻ của nhạc là ảnh chụp một khoảnh khắc và dao động rất mạnh;
 * đường phổ dùng để dựng bộ lọc thì phải ổn định, nếu không bộ lọc sẽ đi khớp
 * đúng những gợn ngẫu nhiên của một khoảnh khắc.
 */
export function phoTrungBinh(mono: Float32Array, n = N_PHO): Float64Array {
  const soO = n / 2 + 1;
  const ra = new Float64Array(soO);
  if (mono.length < n) return ra;

  const w = cuaSoHann(n);
  const re = new Float64Array(n);
  const im = new Float64Array(n);
  const buoc = n >> 1;
  let soKhung = 0;

  for (let dau = 0; dau + n <= mono.length; dau += buoc) {
    for (let i = 0; i < n; i++) { re[i] = mono[dau + i]! * w[i]!; im[i] = 0; }
    fft(re, im);
    for (let i = 0; i < soO; i++) ra[i] = ra[i]! + Math.hypot(re[i]!, im[i]!);
    soKhung++;
  }
  if (soKhung > 0) for (let i = 0; i < soO; i++) ra[i] = ra[i]! / soKhung;
  return ra;
}

/** Đo toàn bộ đặc tính của một bài. Chạy trên bản mẫu lẫn bản của bạn. */
export function doDacTinh(am: AmThanh): DacTinh {
  const mono = tronMono(am);
  return {
    pho: phoTrungBinh(mono),
    rms: doRms(mono),
    rongStereo: doRongStereo(am),
    dinhThat: doDinhThat(am),
    lufs: doLufs(am),
    tanSoMau: am.tanSoMau,
  };
}

/* ── Bộ lọc khớp đáp tuyến ─────────────────────────────────── */

/** Trần chỉnh sửa, dB. Vượt quá thì không còn là "khớp" mà là dựng lại bài. */
const TRAN_DB = 12;

/**
 * Làm mượt đường tỉ lệ theo thang LOGARIT tần số.
 *
 * Tai nghe theo quãng, không theo hertz: khoảng 100→200 Hz và 1000→2000 Hz
 * đều là một quãng tám, nhưng ô phổ ở dải cao nhiều gấp mười. Làm mượt đều
 * theo ô thì dải trầm gần như không được mượt còn dải cao thì bị san phẳng —
 * và bộ lọc kết quả sẽ chỉnh dải trầm theo từng gợn ngẫu nhiên.
 */
export function muotTheoQuang(ti: Float64Array, doRong = 0.18): Float64Array {
  const n = ti.length;
  const ra = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    // Bề rộng cửa sổ tỉ lệ với chỉ số ô ⇒ đều nhau theo quãng.
    const r = Math.max(1, Math.round(i * doRong));
    const tu = Math.max(0, i - r);
    const den = Math.min(n - 1, i + r);
    let tong = 0;
    for (let j = tu; j <= den; j++) tong += ti[j]!;
    ra[i] = tong / (den - tu + 1);
  }
  return ra;
}

/**
 * Dựng đáp ứng xung khớp hai đường phổ.
 *
 * Tỉ lệ `mẫu / của bạn` ở mỗi ô chính là độ khuếch đại cần có. Đưa đường tỉ lệ
 * đó qua FFT ngược là ra đáp ứng xung — bộ lọc pha tuyến tính.
 *
 * ⚠️ PHẢI pha tuyến tính, không phải pha tối thiểu. Bộ lọc pha tối thiểu làm
 * lệch pha các dải khác nhau, và với phần trầm thì lệch pha nghĩa là cú kick
 * mất lực mà phổ vẫn đo ra "đúng" — người dùng thấy bảng số xanh mà tai nghe
 * tệ hơn trước.
 */
export function dungBoLoc(
  phoCuaBan: Float64Array,
  phoMau: Float64Array,
  soNhanh = 2048,
): Float64Array {
  const soO = phoCuaBan.length;
  const n = (soO - 1) * 2;
  if (!laLuyThua2(n)) throw new Error(`phổ phải ứng với FFT luỹ thừa 2, nhận n=${n}`);
  if (phoMau.length !== soO) throw new Error('hai đường phổ lệch độ dài');

  const tranTren = Math.pow(10, TRAN_DB / 20);
  const tranDuoi = 1 / tranTren;

  const ti = new Float64Array(soO);
  for (let i = 0; i < soO; i++) {
    const a = phoCuaBan[i]!;
    const b = phoMau[i]!;
    /* Ô gần như im ở BẤT KỲ bên nào thì để nguyên (tỉ lệ 1). Chia cho một số
       gần 0 cho ra khuếch đại khổng lồ, và chỗ đó vốn chỉ có nhiễu nền — nâng
       nó lên là nâng tiếng ù của phòng thu người khác vào bài mình. */
    ti[i] = (a < 1e-7 || b < 1e-7) ? 1 : Math.min(tranTren, Math.max(tranDuoi, b / a));
  }

  const muot = muotTheoQuang(ti);

  // Phổ đối xứng và thực ⇒ đáp ứng xung thực, đối xứng ⇒ pha tuyến tính.
  const re = new Float64Array(n);
  const im = new Float64Array(n);
  for (let i = 0; i < soO; i++) {
    re[i] = muot[i]!;
    if (i > 0 && i < soO - 1) re[n - i] = muot[i]!;
  }
  fftNguoc(re, im);

  /* Xoay vòng để tâm xung về giữa rồi nhân cửa sổ. Không xoay thì xung nằm vắt
     qua hai đầu mảng, và cắt ngắn sẽ chặt mất đúng phần mang nhiều năng lượng
     nhất — bộ lọc ra sai hẳn. */
  const h = new Float64Array(soNhanh);
  const giua = soNhanh >> 1;
  const w = cuaSoHann(soNhanh);
  for (let i = 0; i < soNhanh; i++) {
    const k = ((i - giua) % n + n) % n;
    h[i] = re[k]! * w[i]!;
  }
  return h;
}

/**
 * Tích chập bằng chồng-cộng qua FFT.
 *
 * Tích chập thẳng với 2048 nhánh trên một bài 5 phút là 2,7 × 10¹⁰ phép nhân —
 * vài phút chỉ để lọc. Qua FFT thì còn vài giây.
 */
export function tichChap(x: Float32Array, h: Float64Array): Float32Array {
  const M = h.length;
  let n = 1;
  while (n < M * 4) n <<= 1;
  const L = n - M + 1; // số mẫu mới mỗi khối

  const hRe = new Float64Array(n);
  const hIm = new Float64Array(n);
  for (let i = 0; i < M; i++) hRe[i] = h[i]!;
  fft(hRe, hIm);

  const ra = new Float32Array(x.length + M - 1);
  const re = new Float64Array(n);
  const im = new Float64Array(n);

  for (let dau = 0; dau < x.length; dau += L) {
    re.fill(0);
    im.fill(0);
    const het = Math.min(L, x.length - dau);
    for (let i = 0; i < het; i++) re[i] = x[dau + i]!;
    fft(re, im);
    for (let i = 0; i < n; i++) {
      const a = re[i]!;
      const b = im[i]!;
      re[i] = a * hRe[i]! - b * hIm[i]!;
      im[i] = a * hIm[i]! + b * hRe[i]!;
    }
    fftNguoc(re, im);
    for (let i = 0; i < n && dau + i < ra.length; i++) ra[dau + i] = ra[dau + i]! + re[i]!;
  }

  // Bỏ độ trễ của bộ lọc pha tuyến tính (đúng nửa số nhánh) và cắt về độ dài cũ.
  const tre = M >> 1;
  return ra.subarray(tre, tre + x.length);
}

/* ── Bộ hạn biên ───────────────────────────────────────────── */

/**
 * Hạn biên có nhìn trước, KHÔNG BAO GIỜ vượt trần.
 *
 * Cách làm: bắt đầu từ độ khuếch đại cần thiết ở từng mẫu, rồi hai lượt quét
 * chỉ HẠ nó xuống — lượt xuôi giới hạn tốc độ nhả, lượt ngược giới hạn tốc độ
 * bám. Vì cả hai lượt chỉ hạ, độ khuếch đại cuối cùng luôn ≤ mức cần thiết ở
 * mọi mẫu, nên không có đường nào vượt trần.
 *
 * Đây là chỗ nhiều bản cài đặt làm sai: làm mượt bằng trung bình trượt thì độ
 * khuếch đại có thể NHÔ LÊN trên mức cần ở vài mẫu, và đúng những mẫu đó vượt
 * trần — rồi vỡ tiếng khi nén sang MP3, đúng thứ bộ hạn biên sinh ra để chặn.
 */
export function hanBien(
  kenh: readonly Float32Array[],
  tran: number,
  tanSoMau: number,
  opts: { bamMs?: number; nhaMs?: number } = {},
): Float32Array[] {
  const [dau] = kenh;
  if (!dau) return [];
  const n = dau.length;
  const bam = Math.max(1, Math.round(((opts.bamMs ?? 2) / 1000) * tanSoMau));
  const nha = Math.max(1, Math.round(((opts.nhaMs ?? 60) / 1000) * tanSoMau));

  // Độ khuếch đại cần thiết, lấy theo đỉnh của MỌI kênh — hạ cả hai cùng lúc,
  // nếu không ảnh stereo bị kéo lệch mỗi lần một kênh chạm trần.
  const g = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let dinh = 0;
    for (const k of kenh) dinh = Math.max(dinh, Math.abs(k[i]!));
    g[i] = dinh > tran ? tran / dinh : 1;
  }

  const buocNha = 1 / nha;
  for (let i = 1; i < n; i++) g[i] = Math.min(g[i]!, g[i - 1]! + buocNha);
  const buocBam = 1 / bam;
  for (let i = n - 2; i >= 0; i--) g[i] = Math.min(g[i]!, g[i + 1]! + buocBam);

  return kenh.map((k) => {
    const ra = new Float32Array(n);
    for (let i = 0; i < n; i++) ra[i] = k[i]! * g[i]!;
    return ra;
  });
}

/* ── Khớp độ rộng stereo ───────────────────────────────────── */

/**
 * Kéo độ rộng stereo về gần bản mẫu bằng cách chỉnh tỉ lệ giữa/bên.
 *
 * Trần 2,5 lần: nới quá tay thì phần trầm tách khỏi tâm và bản nhạc mất lực
 * trên loa sàn — mà loa sàn mới là chỗ bản remix này sẽ được nghe.
 */
export function khopRong(
  kenh: readonly Float32Array[],
  rongDich: number,
): Float32Array[] {
  const [L, R] = kenh;
  if (!L || !R) return kenh.map((k) => Float32Array.from(k));

  const rongHienTai = doRongStereo({ kenh: [L, R], tanSoMau: 44100 });
  if (rongHienTai <= 1e-6 || rongDich <= 1e-6) return kenh.map((k) => Float32Array.from(k));

  // Độ rộng là tỉ lệ NĂNG LƯỢNG bên trên tổng ⇒ hệ số biên độ là căn của tỉ lệ.
  const heSo = Math.min(2.5, Math.max(0.4, Math.sqrt(
    (rongDich / (1 - rongDich)) / (rongHienTai / (1 - rongHienTai)),
  )));

  const n = Math.min(L.length, R.length);
  const raL = new Float32Array(n);
  const raR = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const giua = (L[i]! + R[i]!) / 2;
    const ben = ((L[i]! - R[i]!) / 2) * heSo;
    raL[i] = giua + ben;
    raR[i] = giua - ben;
  }
  return [raL, raR];
}

/* ── Ghép cả chuỗi ─────────────────────────────────────────── */

export interface TuyChonMaster {
  /** Trần đỉnh thật, dBTP. −1 là chuẩn an toàn cho mọi nền tảng nén. */
  tranDbtp?: number;
  /** Bỏ qua bước khớp phổ — chỉ khớp mức to và đỉnh. */
  khongKhopPho?: boolean;
}

export interface KetQuaMaster {
  am: AmThanh;
  /** Đã nâng/hạ bao nhiêu dB trước khi hạn biên. */
  chinhDb: number;
  /** Đỉnh thật sau khi xong — phải nằm dưới trần. */
  dinhThatSau: number;
  lufsSau: number;
}

/**
 * Master một bài theo đặc tính của bản mẫu.
 *
 * Thứ tự CÓ Ý NGHĨA: khớp phổ trước, rồi mới khớp mức, rồi mới hạn biên. Đảo
 * lại thì bước lọc làm đổi mức và bước hạn biên phải bù thêm — nghĩa là nén
 * nhiều hơn mức cần, và bài mất dải động vì một lỗi thứ tự.
 */
export function master(
  am: AmThanh,
  mau: DacTinh,
  opts: TuyChonMaster = {},
): KetQuaMaster {
  if (am.tanSoMau !== mau.tanSoMau) {
    throw new Error(
      `Bản mẫu ở ${mau.tanSoMau} Hz còn bài ở ${am.tanSoMau} Hz — phải cùng tần số mẫu.`,
    );
  }
  const tranDbtp = opts.tranDbtp ?? -1;
  const tran = Math.pow(10, tranDbtp / 20);

  let kenh: Float32Array[] = am.kenh.map((k) => Float32Array.from(k));

  // 1. Khớp đáp tuyến tần số.
  if (!opts.khongKhopPho) {
    const pho = phoTrungBinh(tronMono({ kenh, tanSoMau: am.tanSoMau }));
    const coDuLieu = pho.some((v) => v > 1e-7);
    if (coDuLieu) {
      const h = dungBoLoc(pho, mau.pho);
      kenh = kenh.map((k) => Float32Array.from(tichChap(k, h)));
    }
  }

  // 2. Khớp mức to.
  const rmsHienTai = doRms(tronMono({ kenh, tanSoMau: am.tanSoMau }));
  const chinh = rmsHienTai > 1e-9 ? mau.rms / rmsHienTai : 1;
  for (const k of kenh) for (let i = 0; i < k.length; i++) k[i] = k[i]! * chinh;

  // 3. Khớp độ rộng stereo.
  if (kenh.length === 2) kenh = khopRong(kenh, mau.rongStereo);

  // 4. Hạn biên về trần.
  kenh = hanBien(kenh, tran, am.tanSoMau);

  const raAm: AmThanh = { kenh, tanSoMau: am.tanSoMau };
  return {
    am: raAm,
    chinhDb: chinh > 0 ? 20 * Math.log10(chinh) : -Infinity,
    dinhThatSau: doDinhThat(raAm),
    lufsSau: doLufs(raAm),
  };
}
