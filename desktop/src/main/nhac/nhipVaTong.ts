/**
 * ============================================================
 * DÒ NHỊP (BPM) VÀ DÒ TÔNG
 * ============================================================
 *
 * Hai con số mở đầu mọi bản remix: bài gốc chạy bao nhiêu nhịp, và nó ở tông
 * nào. Biết hai thứ này thì mới kéo được vocal về 140 BPM và ghép được với
 * beat cho không chửi nhau.
 *
 * ⚠️⚠️ **DÒ TÔNG CHỈ ĐÚNG KHOẢNG MỘT NỬA SỐ LẦN.** Đây là con số đo thật của
 * cả ngành, không phải tôi rào trước. Thuật toán tương quan mẫu tông (dùng ở
 * đây, và ở phần lớn phần mềm DJ) hay nhầm nhất giữa một tông và tông thứ
 * tương ứng của nó — hai thứ dùng CHUNG bộ nốt, chỉ khác nốt nào là chủ âm.
 *
 * Vì thế hàm trả về KÈM `tinCay`, và giao diện BẮT BUỘC phải:
 *   • hiện độ tin cậy chứ không chỉ hiện tông,
 *   • cho người dùng sửa tay,
 *   • và khi tin cậy thấp thì gợi ý luôn cả tông xếp thứ hai.
 * Bày một tông sai ra như sự thật sẽ khiến người dùng kéo cả bản nhạc sang sai
 * tông rồi mới phát hiện bằng tai — lúc đó đã mất cả buổi.
 *
 * Dò nhịp thì ngược lại: rất đáng tin với nhạc sàn, vì nhạc sàn có tiếng trống
 * đều tăm tắp. Cái bẫy duy nhất là NHẦM BỘI SỐ — xem `chotBoiSo` ở dưới.
 */
import { cuaSoHann, phoBienDo } from './fft';

/* ── Dò nhịp ──────────────────────────────────────────────── */

export interface KetQuaNhip {
  bpm: number;
  /** 0..1 — đỉnh tự tương quan nhô lên rõ tới đâu so với nền. */
  tinCay: number;
  /** BPM trước khi chốt bội số, để hiện ra khi người dùng thắc mắc. */
  bpmTho: number;
}

const KHUNG = 2048;
const BUOC = 512;

/**
 * Đường khởi âm: mỗi khung tăng bao nhiêu năng lượng so với khung trước.
 *
 * Chỉ lấy phần TĂNG (bán chỉnh lưu). Tiếng tắt dần không phải chỗ bắt đầu một
 * nốt, nên phần giảm là nhiễu đối với việc dò nhịp.
 */
function duongKhoiAm(mono: Float32Array): Float64Array {
  const soKhung = Math.max(0, Math.floor((mono.length - KHUNG) / BUOC) + 1);
  if (soKhung < 2) return new Float64Array(0);

  const w = cuaSoHann(KHUNG);
  const ra = new Float64Array(soKhung);
  const tam = new Float32Array(KHUNG);
  let truoc: Float64Array | null = null;

  for (let t = 0; t < soKhung; t++) {
    const dau = t * BUOC;
    for (let i = 0; i < KHUNG; i++) tam[i] = mono[dau + i]! * w[i]!;
    const pho = phoBienDo(tam);
    if (truoc) {
      let tong = 0;
      for (let i = 0; i < pho.length; i++) {
        const d = pho[i]! - truoc[i]!;
        if (d > 0) tong += d;
      }
      ra[t] = tong;
    }
    truoc = pho;
  }

  // Trừ đường trung bình trượt: bỏ phần nền để tự tương quan không bị một đỉnh
  // giả ở lag 0 kéo lệch.
  const CUA = 16;
  const muot = new Float64Array(soKhung);
  for (let i = 0; i < soKhung; i++) {
    let tong = 0;
    let dem = 0;
    for (let j = Math.max(0, i - CUA); j <= Math.min(soKhung - 1, i + CUA); j++) {
      tong += ra[j]!; dem++;
    }
    muot[i] = tong / dem;
  }
  for (let i = 0; i < soKhung; i++) ra[i] = Math.max(0, ra[i]! - muot[i]!);
  return ra;
}

/**
 * Chốt bội số — cái bẫy lớn nhất của dò nhịp.
 *
 * Tự tương quan không phân biệt được 70 với 140 với 280: cả ba đều khớp với
 * cùng một chuỗi tiếng trống, vì trống ở 140 thì cũng đánh đúng vào mọi mốc
 * của 70. Máy hay trả về 70 cho một bản vinahouse 140 — không sai về toán,
 * nhưng sai về thứ người dùng cần.
 *
 * Nên nhân/chia đôi cho tới khi rơi vào dải quen thuộc. Mặc định 90–180 hợp
 * với gần hết nhạc nhảy; vinahouse nằm giữa dải đó.
 */
export function chotBoiSo(bpm: number, thap = 90, cao = 180): number {
  if (!Number.isFinite(bpm) || bpm <= 0) return 0;
  let v = bpm;
  // Chặn số vòng: dữ liệu rác (bpm ~1e-9) sẽ làm vòng while chạy mãi.
  for (let i = 0; i < 8 && v < thap; i++) v *= 2;
  for (let i = 0; i < 8 && v > cao; i++) v /= 2;
  return v;
}

export function doNhip(
  mono: Float32Array,
  tanSoMau: number,
  opts: { thap?: number; cao?: number } = {},
): KetQuaNhip {
  const odf = duongKhoiAm(mono);
  if (odf.length < 32) return { bpm: 0, tinCay: 0, bpmTho: 0 };

  const giayMoiKhung = BUOC / tanSoMau;
  // Quét lag tương ứng 60..200 BPM — rộng hơn dải chốt, để chốt bội số còn việc.
  const lagMin = Math.max(1, Math.floor(60 / 200 / giayMoiKhung));
  const lagMax = Math.min(odf.length - 1, Math.ceil(60 / 60 / giayMoiKhung));
  if (lagMax <= lagMin) return { bpm: 0, tinCay: 0, bpmTho: 0 };

  const r = new Float64Array(lagMax + 1);
  let lagTot = lagMin;
  let dinh = -Infinity;

  for (let lag = lagMin; lag <= lagMax; lag++) {
    let s = 0;
    for (let i = 0; i + lag < odf.length; i++) s += odf[i]! * odf[i + lag]!;
    s /= odf.length - lag; // chuẩn hoá: lag lớn có ít cặp hơn, không chia thì thiên vị lag nhỏ
    r[lag] = s;
    if (s > dinh) { dinh = s; lagTot = lag; }
  }

  /*
   * ─── Tin cậy cần HAI điều kiện, không phải một ───
   *
   * Hai bản trước đều sai, và cùng sai ở một chỗ: chúng chỉ hỏi "đường khởi âm
   * có LẶP LẠI không". Đo thật trên tiếng ù 220 Hz kéo dài 10 giây:
   *
   *                      crest (đỉnh/trung bình)   khung có tín hiệu
   *     tiếng ù                  4,0                    37,5%
   *     chuỗi gõ 140 BPM        28,1                     6,5%
   *
   * Đường khởi âm của tiếng ù KHÔNG gần 0 như tôi đoán — nó là một dao động
   * nhỏ nhưng DÀY, phủ 37,5% số khung. Một tín hiệu dày và đều thì tự tương
   * quan của nó gần như hằng số, nên tỉ lệ đỉnh/r₀ chạm 0,998: theo thước đo
   * "có lặp lại không" thì nó là bản nhạc đều nhịp nhất đời.
   *
   * Thứ phân biệt hai cột trên là độ NHỌN. Nhịp thật gồm những cú đánh tách
   * bạch trên nền im; tiếng ngân thì trải đều. Nên nhân hai điều kiện:
   *
   *     có đánh tách bạch KHÔNG  ×  những cú đánh đó có LẶP ĐỀU không
   *
   * Thiếu vế nào cũng ra 0, và đó đúng là điều ta muốn.
   *
   * ⚠️ Hai con số trên đo bằng tín hiệu dựng sẵn. Nhạc thật có cả trống lẫn
   * nền đệm ngân dài nên crest nằm đâu đó ở giữa — ngưỡng dưới đây đủ để tách
   * hai đầu, nhưng vùng giữa thì phải hiệu chỉnh lại bằng nhạc thật.
   */
  let r0 = 0;
  let tbOdf = 0;
  let dinhOdf = 0;
  for (let i = 0; i < odf.length; i++) {
    r0 += odf[i]! * odf[i]!;
    tbOdf += odf[i]!;
    if (odf[i]! > dinhOdf) dinhOdf = odf[i]!;
  }
  r0 /= odf.length;
  tbOdf /= odf.length;

  const crest = tbOdf > 0 ? dinhOdf / tbOdf : 0;
  // crest 4 ⇒ 0 (tiếng ngân) · crest 16 trở lên ⇒ 1 (có đánh tách bạch).
  const doNhon = Math.min(1, Math.max(0, (crest - 4) / 12));
  const doLap = r0 > 0 ? Math.min(1, Math.max(0, dinh / r0)) : 0;
  const tinCay = doNhon * doLap;

  /*
   * Nội suy parabol quanh đỉnh — KHÔNG phải chuyện làm đẹp.
   *
   * Lag là số nguyên khung, mà mỗi khung là 512 mẫu ≈ 11,6 ms. Ở quanh 140 BPM
   * một nhịp dài ~36,9 khung, nên hai lag nguyên gần nhất (36 và 37) ứng với
   * 143,6 và 139,7 BPM — không có lag nào cho ra đúng 140. Sai 3 BPM nghe thì
   * nhỏ, nhưng kéo cả bài vocal theo con số đó thì tới cuối bài đã lệch hẳn
   * một phách.
   *
   * Ba điểm quanh đỉnh dựng thành một parabol, và đỉnh parabol nằm giữa hai
   * lag nguyên. Đủ để đưa sai số xuống dưới 0,5 BPM.
   */
  let lagMin2 = lagTot;
  if (lagTot > lagMin && lagTot < lagMax) {
    const a = r[lagTot - 1]!;
    const b = r[lagTot]!;
    const c = r[lagTot + 1]!;
    const mau = a - 2 * b + c;
    // `mau === 0` là ba điểm thẳng hàng — không có đỉnh để tinh chỉnh.
    if (mau !== 0) {
      const buocLe = (0.5 * (a - c)) / mau;
      // Chỉ nhận khi đỉnh thật nằm giữa hai lag kề; ngoài khoảng đó là dấu
      // hiệu ba điểm không phải một đỉnh, và tin theo sẽ tệ hơn là bỏ qua.
      if (Math.abs(buocLe) <= 0.5) lagMin2 = lagTot + buocLe;
    }
  }

  const bpmTho = 60 / (lagMin2 * giayMoiKhung);
  return {
    bpm: chotBoiSo(bpmTho, opts.thap ?? 90, opts.cao ?? 180),
    tinCay,
    bpmTho,
  };
}

/* ── Dò tông ──────────────────────────────────────────────── */

/**
 * Mẫu tông Krumhansl–Kessler — đo từ thực nghiệm với người nghe thật: mỗi nốt
 * "hợp" tới đâu khi đặt trong một tông. Chủ âm cao nhất, rồi tới bậc năm.
 */
const MAU_TRUONG = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
const MAU_THU = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];

/**
 * Sắc đồ: tổng năng lượng rơi vào mỗi trong 12 cao độ, cộng dồn cả bài.
 *
 * Chỉ xét từ ~65 Hz (Đô2) tới ~2 kHz (khoảng Đô7). Dưới đó gần như chỉ có
 * trống và tiếng ù; trên đó chủ yếu là hài âm và tiếng xì, cả hai đều làm
 * nhiễu phép đếm cao độ.
 */
export function sacDo(mono: Float32Array, tanSoMau: number): Float64Array {
  const N = 8192; // khung dài để phân giải đủ mịn ở quãng trầm
  const soKhung = Math.floor((mono.length - N) / (N / 2)) + 1;
  const ra = new Float64Array(12);
  if (soKhung < 1) return ra;

  const w = cuaSoHann(N);
  const tam = new Float32Array(N);
  const oHz = tanSoMau / N;

  for (let t = 0; t < soKhung; t++) {
    const dau = t * (N / 2);
    for (let i = 0; i < N; i++) tam[i] = mono[dau + i]! * w[i]!;
    const pho = phoBienDo(tam);
    for (let i = 1; i < pho.length; i++) {
      const f = i * oHz;
      if (f < 65 || f > 2100) continue;
      // MIDI 69 = La4 = 440 Hz. Làm tròn ra nốt gần nhất rồi lấy phần dư 12.
      const midi = Math.round(69 + 12 * Math.log2(f / 440));
      ra[((midi % 12) + 12) % 12] = ra[((midi % 12) + 12) % 12]! + pho[i]! * pho[i]!;
    }
  }
  return ra;
}

export interface KetQuaTong {
  chuAm: number;
  the: 'truong' | 'thu';
  /** 0..1 — khoảng cách giữa đáp án nhất và nhì. Thấp nghĩa là đừng tin. */
  tinCay: number;
  /** Đáp án xếp thứ hai, để hiện ra khi tin cậy thấp. */
  nhi: { chuAm: number; the: 'truong' | 'thu' } | null;
}

/** Tương quan Pearson giữa sắc đồ đã xoay và một mẫu tông. */
function tuongQuan(a: Float64Array, b: readonly number[], xoay: number): number {
  let tbA = 0;
  let tbB = 0;
  for (let i = 0; i < 12; i++) { tbA += a[(i + xoay) % 12]!; tbB += b[i]!; }
  tbA /= 12; tbB /= 12;

  let tu = 0;
  let mA = 0;
  let mB = 0;
  for (let i = 0; i < 12; i++) {
    const da = a[(i + xoay) % 12]! - tbA;
    const db = b[i]! - tbB;
    tu += da * db; mA += da * da; mB += db * db;
  }
  return mA > 0 && mB > 0 ? tu / Math.sqrt(mA * mB) : 0;
}

export function doTong(mono: Float32Array, tanSoMau: number): KetQuaTong {
  const sac = sacDo(mono, tanSoMau);
  const diem: Array<{ chuAm: number; the: 'truong' | 'thu'; r: number }> = [];
  for (let pc = 0; pc < 12; pc++) {
    diem.push({ chuAm: pc, the: 'truong', r: tuongQuan(sac, MAU_TRUONG, pc) });
    diem.push({ chuAm: pc, the: 'thu', r: tuongQuan(sac, MAU_THU, pc) });
  }
  diem.sort((x, y) => y.r - x.r);

  const nhat = diem[0];
  const nhi = diem[1];
  if (!nhat || !nhi) return { chuAm: 0, the: 'truong', tinCay: 0, nhi: null };

  /* Tin cậy = khoảng cách nhất/nhì, nhân 5 cho ra dải đọc được. Hai đáp án sát
     nhau hầu như luôn là cặp trưởng/thứ tương ứng — dùng chung bộ nốt nên sắc
     đồ gần y hệt, và đó chính là chỗ thuật toán này mù. */
  const tinCay = Math.min(1, Math.max(0, (nhat.r - nhi.r) * 5));
  return {
    chuAm: nhat.chuAm,
    the: nhat.the,
    tinCay,
    nhi: { chuAm: nhi.chuAm, the: nhi.the },
  };
}
