/**
 * ============================================================
 * KÉO GIÃN NHỊP VÀ ĐỔI CAO ĐỘ
 * ============================================================
 *
 * Hai việc ngược nhau, cùng một lõi:
 *   • kéo giãn — đổi ĐỘ DÀI, giữ nguyên cao độ (vocal 128 BPM → 140 BPM)
 *   • đổi cao độ — đổi CAO ĐỘ, giữ nguyên độ dài (Am → Bm cho hợp beat)
 *
 * ─── Vì sao WSOLA chứ không phải phase vocoder ───
 * Phase vocoder (thứ `librosa.effects.time_stretch` dùng) làm việc trên phổ,
 * và nó rất tốt với tiếng ngân. Nhưng nó BÔI NHOÈ tiếng gõ: một cú snare sắc
 * gọn biến thành tiếng "phù" kéo dài, vì năng lượng của nó vốn nằm ở một
 * khoảnh khắc mà phổ lại trải nó ra cả khung.
 *
 * Với remix thì đó đúng là thứ hỏng nhất: stem trống và phụ âm bật của giọng
 * hát đều là tiếng gõ. WSOLA làm ở miền thời gian — nó CẮT và DÁN những đoạn
 * sóng thật, chỉ chọn chỗ dán sao cho hai mép khớp pha nhau. Tiếng gõ đi qua
 * nguyên vẹn vì không ai đụng vào nó.
 *
 * Cái giá: kéo quá mạnh (ngoài khoảng ~0,7–1,45) thì nghe rõ tiếng lặp đoạn.
 * Với nhạc sàn thì không sao — 128 → 140 BPM chỉ là tỉ lệ 0,914.
 *
 * ⚠️ Rubber Band cho chất lượng tốt hơn cái này, nhưng nó là thư viện GỐC:
 * cài vào Electron nghĩa là dựng lại cho từng phiên bản Electron × từng nền ×
 * từng kiến trúc. Đổi lấy ~150 dòng ở đây thì không đáng.
 */

/** Khung phân tích. 2048 mẫu ≈ 46 ms ở 44,1 kHz — đủ dài để ôm một chu kỳ trầm. */
const KHUNG = 2048;
/** Bước tổng hợp. Một nửa khung ⇒ chồng 50%. */
const BUOC_RA = KHUNG >> 1;
/** Nửa bề rộng vùng dò chỗ dán. Rộng hơn thì khớp pha tốt hơn nhưng chậm hơn. */
const DO_DO = 256;

/** Tỉ lệ kéo để đi từ nhịp này sang nhịp kia. >1 nghĩa là bài dài ra. */
export function tiLeTuBpm(bpmGoc: number, bpmDich: number): number {
  if (!(bpmGoc > 0) || !(bpmDich > 0)) throw new Error('BPM phải dương');
  return bpmGoc / bpmDich;
}

/** Tỉ lệ tần số của một quãng, tính theo nửa cung. +12 ⇒ gấp đôi. */
export function tiLeCaoDo(nuaCung: number): number {
  return Math.pow(2, nuaCung / 12);
}

/**
 * Tìm độ lệch cho khung tiếp theo sao cho mép dán khớp pha với đoạn trước.
 *
 * Đây là chữ W trong WSOLA (Waveform Similarity): thay vì dán đúng chỗ lý
 * thuyết, ta nhìn quanh đó vài trăm mẫu và chọn chỗ có dạng sóng GIỐNG phần
 * đáng lẽ phải nối tiếp nhất. Dán đúng chỗ lý thuyết mà lệch pha thì hai đoạn
 * triệt tiêu nhau một phần — nghe ra tiếng "ọp" mỗi 23 ms.
 *
 * Dùng tương quan chéo không chuẩn hoá: ta chỉ cần biết chỗ nào lớn nhất, mà
 * biên độ đoạn đích thì như nhau với mọi ứng viên.
 */
function timDoLech(x: Float32Array, dich: number, moc: number, doDo: number): number {
  const tu = Math.max(0, moc - doDo);
  const den = Math.min(x.length - KHUNG, moc + doDo);
  if (den <= tu || dich + KHUNG > x.length || dich < 0) return 0;

  let totNhat = moc;
  let diemNhat = -Infinity;
  // Bước 4 mẫu: ở 44,1 kHz một mẫu là 23 µs, mà tai không phân biệt nổi lệch
  // pha dưới ~0,1 ms. Quét từng mẫu chỉ tốn gấp bốn thời gian.
  for (let p = tu; p <= den; p += 4) {
    let diem = 0;
    // Chỉ so phần CHỒNG (nửa khung đầu) — phần sau sẽ do khung kế tiếp lo.
    for (let i = 0; i < BUOC_RA; i += 2) diem += x[p + i]! * x[dich + i]!;
    if (diem > diemNhat) { diemNhat = diem; totNhat = p; }
  }
  return totNhat;
}

export interface TuyChonKeo {
  /** Tắt phần dò chỗ dán. Chỉ dùng trong phép kiểm — chất lượng kém hẳn. */
  khongDo?: boolean;
}

/**
 * Kéo giãn nhiều kênh, GIỮ NGUYÊN cao độ.
 *
 * ⚠️ Mọi kênh dùng CHUNG một chuỗi vị trí dán, và vị trí đó dò trên bản trộn
 * mono. Dò riêng từng kênh thì trái và phải bị cắt dán ở hai chỗ khác nhau,
 * và ảnh stereo vỡ vụn — nghe như bài bị lệch pha, một lỗi rất khó truy vì
 * từng kênh nghe riêng thì vẫn hoàn toàn bình thường.
 */
export function keoGian(
  kenh: readonly Float32Array[],
  tiLe: number,
  opts: TuyChonKeo = {},
): Float32Array[] {
  if (!(tiLe > 0)) throw new Error(`tiLe phải dương, nhận ${tiLe}`);
  const [dau] = kenh;
  if (!dau) throw new Error('keoGian: không có kênh nào');
  const n = dau.length;
  if (n === 0) return kenh.map(() => new Float32Array(0));
  if (tiLe === 1) return kenh.map((k) => Float32Array.from(k));

  // Bài ngắn hơn một khung thì không có gì để cắt dán — đổi tốc độ thẳng.
  if (n < KHUNG * 2) return kenh.map((k) => docTheoToc(k, 1 / tiLe));

  const buocVao = BUOC_RA / tiLe;
  const soMauRa = Math.max(KHUNG, Math.round(n * tiLe));

  // Bản trộn mono chỉ để DÒ, không để phát.
  const mono = kenh.length === 1 ? dau : tronMono(kenh, n);

  const ra = kenh.map(() => new Float32Array(soMauRa));
  const tongCuaSo = new Float32Array(soMauRa);
  const w = cuaSoHann50(KHUNG);

  let truoc = 0;
  for (let k = 0; ; k++) {
    const viTriRa = k * BUOC_RA;
    if (viTriRa + KHUNG > soMauRa) break;

    const moc = Math.round(k * buocVao);
    if (moc + KHUNG > n) break;

    /* Chỗ đáng lẽ phải nối tiếp đoạn trước: chính đoạn trước, dịch đi một bước
       tổng hợp. Đó là "dạng sóng tự nhiên" mà ta đi tìm bản giống nhất. */
    const dich = truoc + BUOC_RA;
    const chon = (opts.khongDo || dich + KHUNG > n)
      ? Math.min(moc, n - KHUNG)
      : timDoLech(mono, dich, Math.min(moc, n - KHUNG), DO_DO);

    for (let c = 0; c < kenh.length; c++) {
      const src = kenh[c]!;
      const dst = ra[c]!;
      for (let i = 0; i < KHUNG; i++) dst[viTriRa + i] = dst[viTriRa + i]! + src[chon + i]! * w[i]!;
    }
    for (let i = 0; i < KHUNG; i++) tongCuaSo[viTriRa + i] = tongCuaSo[viTriRa + i]! + w[i]!;

    truoc = chon;
  }

  /* Chia cho TỔNG cửa sổ, không tin vào việc "Hann chồng 50% thì cộng lại
     bằng 1". Nó chỉ đúng với dạng tuần hoàn và đúng ở GIỮA bài; hai đầu bài
     chỉ có một khung phủ nên tổng ở đó là 0,5 — không chia thì hai đầu bài to
     gấp đôi, nghe như tiếng "bụp" vào và ra. */
  for (let i = 0; i < soMauRa; i++) {
    const t = tongCuaSo[i]!;
    if (t <= 1e-6) continue;
    for (const dst of ra) dst[i] = dst[i]! / t;
  }
  return ra;
}

function tronMono(kenh: readonly Float32Array[], n: number): Float32Array {
  const m = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let t = 0;
    for (const k of kenh) t += k[i]!;
    m[i] = t / kenh.length;
  }
  return m;
}

/** Hann dạng TUẦN HOÀN (chia cho n, không phải n−1) — dạng đúng cho chồng-cộng. */
function cuaSoHann50(n: number): Float32Array {
  const w = new Float32Array(n);
  for (let i = 0; i < n; i++) w[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / n);
  return w;
}

/* ── Đọc lại theo tốc độ khác (đổi cả cao độ lẫn độ dài) ───── */

/** Nửa bề rộng nhân nội suy. 16 nhánh mỗi bên là đủ cho tai người. */
const NHANH = 16;

/**
 * Đọc tín hiệu với tốc độ `toc`, nội suy bằng sinc có cửa sổ.
 *
 * `toc = 2` ⇒ ngắn đi một nửa và cao lên một quãng tám (y như quay đĩa nhanh
 * gấp đôi). Đây là phép biến đổi thô; ghép với `keoGian` mới ra được "đổi cao
 * độ mà giữ độ dài".
 *
 * ⚠️ Khi `toc > 1` (đọc nhanh hơn) thì phải HẠ TRẦN nhân lọc theo `1/toc`.
 * Không hạ thì mọi tần số trên Nyquist mới gập ngược xuống thành tiếng lạ —
 * và tiếng gập không nghe như "méo", nó nghe như có thêm một nhạc cụ sai nốt.
 */
export function docTheoToc(x: Float32Array, toc: number): Float32Array {
  if (!(toc > 0)) throw new Error(`toc phải dương, nhận ${toc}`);
  if (toc === 1) return Float32Array.from(x);

  const soRa = Math.max(1, Math.floor(x.length / toc));
  const ra = new Float32Array(soRa);
  const tran = Math.min(1, 1 / toc);

  for (let i = 0; i < soRa; i++) {
    const p = i * toc;
    const goc = Math.floor(p);
    const le = p - goc;

    let tong = 0;
    let chuan = 0;
    for (let j = -NHANH + 1; j <= NHANH; j++) {
      const n = goc + j;
      if (n < 0 || n >= x.length) continue;
      const t = j - le;
      const s = t === 0 ? tran : (Math.sin(Math.PI * tran * t) / (Math.PI * t));
      // Cửa sổ Hann trên chính nhân lọc — cắt cụt sinc mà không có cửa sổ thì
      // sinh gợn nghe được ở dải cao.
      const cs = 0.5 + 0.5 * Math.cos((Math.PI * t) / NHANH);
      const h = s * cs;
      tong += x[n]! * h;
      chuan += h;
    }
    // Chuẩn hoá theo tổng nhân THẬT: ở hai đầu bài một phần nhân rơi ra ngoài,
    // không chuẩn hoá thì biên độ tụt dần về 0 ở mép.
    ra[i] = chuan > 1e-9 ? tong / chuan : 0;
  }
  return ra;
}

/** Đổi tần số mẫu. Chỉ dùng khi thật sự cần — renderer đã lo việc này rồi. */
export function doiTanSoMau(
  kenh: readonly Float32Array[],
  tuTanSo: number,
  denTanSo: number,
): Float32Array[] {
  if (tuTanSo === denTanSo) return kenh.map((k) => Float32Array.from(k));
  return kenh.map((k) => docTheoToc(k, tuTanSo / denTanSo));
}

/* ── Đổi cao độ, giữ nguyên độ dài ─────────────────────────── */

/**
 * Đổi cao độ đi `nuaCung` nửa cung mà KHÔNG đổi độ dài.
 *
 * Cách làm kinh điển, và là lý do hai hàm trên nằm cùng một tệp: kéo dài ra
 * theo đúng tỉ lệ cao độ, rồi đọc lại nhanh đúng tỉ lệ đó. Kéo giãn giữ cao
 * độ; đọc nhanh đổi cả hai. Ghép lại thì độ dài về chỗ cũ còn cao độ thì không.
 *
 *     +12 nửa cung ⇒ tỉ lệ 2 ⇒ kéo dài gấp đôi, rồi đọc nhanh gấp đôi.
 */
export function doiCaoDo(
  kenh: readonly Float32Array[],
  nuaCung: number,
  opts: TuyChonKeo = {},
): Float32Array[] {
  if (nuaCung === 0) return kenh.map((k) => Float32Array.from(k));
  const r = tiLeCaoDo(nuaCung);
  return keoGian(kenh, r, opts).map((k) => docTheoToc(k, r));
}

/**
 * Kéo về nhịp đích VÀ đổi tông trong một lượt.
 *
 * Làm hai bước rời thì tín hiệu đi qua hai lần cắt-dán và hai lần nội suy.
 * Gộp lại thì chỉ còn một lần mỗi thứ: kéo giãn đúng một lần với tỉ lệ ghép,
 * rồi đọc lại đúng một lần.
 */
export function chinhBai(
  kenh: readonly Float32Array[],
  opts: { tiLeNhip?: number; nuaCung?: number } & TuyChonKeo = {},
): Float32Array[] {
  const tiLeNhip = opts.tiLeNhip ?? 1;
  const nuaCung = opts.nuaCung ?? 0;
  if (tiLeNhip === 1 && nuaCung === 0) return kenh.map((k) => Float32Array.from(k));

  const rCao = tiLeCaoDo(nuaCung);
  /* Đọc lại với tốc độ `rCao` sẽ chia độ dài cho `rCao`. Muốn độ dài cuối cùng
     bằng `tiLeNhip` lần bản gốc thì bước kéo giãn phải bù lại đúng ngần ấy. */
  const rKeo = tiLeNhip * rCao;
  const daKeo = keoGian(kenh, rKeo, opts);
  return rCao === 1 ? daKeo : daKeo.map((k) => docTheoToc(k, rCao));
}
