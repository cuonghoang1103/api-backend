/**
 * ============================================================
 * ĐỘNG LỰC HỌC — nén, và cú "duck" theo kick của nhạc sàn
 * ============================================================
 *
 * Hai việc, chung một họ:
 *
 *   `nen()`        bộ nén thường: to quá thì ghì xuống.
 *   `duckTheoKick()` ghì cả bản nhạc xuống mỗi lần trống cái đánh, rồi thả ra.
 *
 * ─── ⚠️ VÌ SAO CÚ DUCK KHÔNG PHẢI LÀ MỘT BỘ NÉN ───
 * Ai cũng gọi nó là "sidechain compression", và trong DAW người ta đúng là
 * dựng nó bằng một bộ nén nghe tín hiệu ngoài. Nhưng đo thật thì bộ nén cho ra
 * cú duck KHÔNG ĐỀU: độ ghì phụ thuộc kick lần đó to bao nhiêu, mà kick trong
 * một bản đã trộn thì lúc to lúc nhỏ. Nhịp thở của bài vì thế lúc sâu lúc
 * nông, và đó chính là thứ phân biệt một bản vinahouse nghiệp dư với một bản
 * nghe chắc tay.
 *
 * Nên ở đây `duckTheoKick()` KHÔNG nén — nó DÁN một đường cong cố định, kích
 * lại ở mỗi cú kick. Đúng cách các công cụ chuyên cho việc này làm (LFOTool,
 * Kickstart), và đúng thứ người làm vinahouse thật sự muốn: sâu bao nhiêu và
 * hồi trong bao lâu là do người đặt, không do cú kick quyết.
 *
 * Bộ nén thường vẫn còn, cho việc của nó: ghì phần giọng hoặc bass cho đều.
 *
 * ─── HAI KÊNH PHẢI DÙNG CHUNG MỘT ĐƯỜNG ĐIỀU KHIỂN ───
 * Cả hai hàm dò trên bản trộn của mọi kênh rồi áp CÙNG một hệ số cho tất cả.
 * Dò riêng từng kênh thì kênh nào to hơn bị ghì nhiều hơn, và ảnh stereo
 * NGHIÊNG theo từng cú nén — nghe từng kênh vẫn bình thường nên rất khó truy.
 * Cùng bài học đã ghi ở `keoGian.ts` cho việc chọn điểm dán.
 */
import { chanCaoBac4, locChuoi } from './loc';

/** Hệ số một cực cho hằng thời gian `giay`. */
function heSoThoiGian(giay: number, fs: number): number {
  if (!(giay > 0)) return 0; // tức thì
  return Math.exp(-1 / (giay * fs));
}

/**
 * Đường bao đỉnh của tín hiệu điều khiển, tuyến tính (chưa đổi ra dB).
 *
 * Tấn công nhanh, nhả chậm — bám kịp lúc to lên và không rung theo từng chu kỳ
 * sóng lúc nhỏ đi. Đây là bộ dò dạng "peak", không phải RMS: với nhạc sàn thì
 * thứ cần bắt là cú đánh, mà cú đánh là một đỉnh chứ không phải một mức trung
 * bình.
 */
export function duongBao(
  x: Float32Array, fs: number, tanCong: number, nhaRa: number,
): Float32Array {
  const aT = heSoThoiGian(tanCong, fs);
  const aN = heSoThoiGian(nhaRa, fs);
  const y = new Float32Array(x.length);
  let e = 0;
  for (let i = 0; i < x.length; i++) {
    const v = Math.abs(x[i]!);
    const a = v > e ? aT : aN;
    e = a * e + (1 - a) * v;
    y[i] = e;
  }
  return y;
}

/** Trộn mọi kênh thành một đường dò: lấy giá trị tuyệt đối LỚN NHẤT mỗi mẫu. */
export function gopDo(kenh: readonly Float32Array[]): Float32Array {
  const n = kenh[0]?.length ?? 0;
  const y = new Float32Array(n);
  for (const k of kenh) {
    for (let i = 0; i < n; i++) {
      const v = Math.abs(k[i]!);
      if (v > y[i]!) y[i] = v;
    }
  }
  return y;
}

export interface TuyChonNen {
  /** Ngưỡng, dBFS. Trên ngưỡng mới bắt đầu ghì. */
  nguong: number;
  /** Tỉ lệ nén. 4 nghĩa là vượt 4 dB thì chỉ cho ra 1 dB. */
  tiLe: number;
  /* Những trường dưới đây khai rõ `| undefined`: chúng đi qua cầu IPC, nơi
     một trường có mặt mà bằng `undefined` là chuyện bình thường (structured
     clone giữ nguyên nó), còn `exactOptionalPropertyTypes` thì phân biệt hai
     thứ đó. Mọi chỗ đọc đều dùng `??` nên `undefined` an toàn. */
  /** Thời gian tấn công, giây. */
  tanCong?: number | undefined;
  /** Thời gian nhả, giây. */
  nhaRa?: number | undefined;
  /** Độ mềm của khuỷu, dB. 0 là khuỷu gãy. */
  khuyu?: number | undefined;
  /** Bù lại độ to đã mất, dB. */
  bu?: number | undefined;
  /**
   * Tín hiệu dò NGOÀI (sidechain thật). Bỏ trống thì dò trên chính nó.
   *
   * Có tham số này thì `nen()` phủ được cả hai kiểu, nhưng cú duck của nhạc
   * sàn vẫn nên dùng `duckTheoKick()` — xem đầu tệp.
   */
  tinHieuDo?: Float32Array | undefined;
}

const NHO = 1e-9;

/** dB của một biên độ tuyến tính, chặn đáy để không ra −Infinity. */
function db(v: number): number { return 20 * Math.log10(Math.max(v, NHO)); }

/**
 * Bộ nén tiến (feed-forward), làm mượt trong MIỀN dB.
 *
 * Làm mượt hệ số ghì theo dB chứ không theo biên độ tuyến tính: tai nghe theo
 * dB, nên một đường nhả thẳng trong dB nghe đều, còn thẳng trong tuyến tính
 * thì nghe như nhả giật ở đoạn cuối.
 *
 * Trả về mảng kênh MỚI; đầu vào không bị đụng tới.
 */
export function nen(
  kenh: readonly Float32Array[], fs: number, o: TuyChonNen,
): Float32Array[] {
  const n = kenh[0]?.length ?? 0;
  if (n === 0) return kenh.map((k) => new Float32Array(k));

  const tiLe = Math.max(o.tiLe, 1);
  const khuyu = Math.max(o.khuyu ?? 6, 0);
  const bu = o.bu ?? 0;
  const tinDo = o.tinHieuDo ?? gopDo(kenh);
  const bao = duongBao(tinDo, fs, o.tanCong ?? 0.005, o.nhaRa ?? 0.12);

  const ra = kenh.map(() => new Float32Array(n));
  for (let i = 0; i < n; i++) {
    const vao = db(bao[i]!);
    const qua = vao - o.nguong;

    /* Khuỷu mềm: trong khoảng ±khuỷu/2 quanh ngưỡng, mức ghì tăng dần theo
       hàm bậc hai thay vì bật ngay. Không có nó thì những mẩu dao động quanh
       đúng ngưỡng bị bật/tắt nén liên tục, nghe ra như tiếng thở. */
    let ghi: number;
    if (khuyu > 0 && Math.abs(qua) <= khuyu / 2) {
      const t = qua + khuyu / 2;
      ghi = ((1 / tiLe - 1) * t * t) / (2 * khuyu);
    } else if (qua > 0) {
      ghi = qua * (1 / tiLe - 1);
    } else {
      ghi = 0;
    }

    const he = Math.pow(10, (ghi + bu) / 20);
    for (let c = 0; c < kenh.length; c++) ra[c]![i] = kenh[c]![i]! * he;
  }
  return ra;
}

/* ══════════════════════════════════════════════════════════
   Cú duck theo kick
   ══════════════════════════════════════════════════════════ */

/** Kick không thể đánh lại nhanh hơn thế này — 300 BPM cũng còn thưa hơn. */
const CACH_TOI_THIEU = 0.1;

/**
 * Tìm mốc mẫu của từng cú trống cái trong stem trống.
 *
 * ─── Vì sao phải LỌC TRẦM TRƯỚC KHI DÒ ───
 * Dò thẳng trên stem trống thì snare và hi-hat cũng là đỉnh, và cú duck sẽ
 * kích 8 lần một ô nhịp thay vì 4. Trống cái nằm gần hết năng lượng dưới
 * 120 Hz, còn snare thì ở 200 Hz trở lên — nên chắn cao ở 120 Hz là gạt sạch
 * mọi thứ không phải kick mà không cần biết gì thêm về bài.
 *
 * Ngưỡng luôn lấy theo TỈ LỆ, không bao giờ là một con số dBFS cố định: stem
 * tách ra có mức rất khác nhau tuỳ bài và tuỳ model, nên ngưỡng tuyệt đối sẽ
 * bắt hết mọi thứ ở bài này và không bắt gì ở bài kia. Tỉ lệ ấy so với cái gì
 * thì phức tạp hơn một chút — xem hai chốt trong thân hàm.
 *
 * Và một cú đánh là chỗ đường bao VỌT LÊN, không phải mọi chỗ trên ngưỡng.
 */
export function mocKick(trong: readonly Float32Array[], fs: number): number[] {
  if ((trong[0]?.length ?? 0) === 0) return [];

  /* ⚠️ LỌC TRƯỚC, CHỈNH LƯU SAU — thứ tự này không đổi được.
     Bản đầu gộp kênh (tức lấy trị tuyệt đối) rồi mới lọc, và phép kiểm bắt
     ngay: nó đếm 8 cú thay vì 4. Lý do là chỉnh lưu một sin 400 Hz sinh ra
     một thành phần MỘT CHIỀU — và một chiều thì nằm dưới mọi điểm cắt, nên
     bộ chắn cao không đụng được vào nó. Snare đi qua nguyên vẹn dưới dạng
     một cục năng lượng ở đáy phổ, và bộ lọc trông như đang chạy.

     Bậc 4 chứ không phải hai bộ bậc 2 giống nhau xếp chồng — xem đầu
     `loc.ts`: xếp chồng cùng Q làm điểm cắt tụt xuống −6 dB, ăn lẹm vào
     đúng dải kick cần dò. */
  const boLoc = chanCaoBac4(120, fs);
  const bao = duongBao(gopDo(trong.map((k) => locChuoi(k, boLoc))), fs, 0.001, 0.02);

  let dinhNhat = 0;
  for (let i = 0; i < bao.length; i++) if (bao[i]! > dinhNhat) dinhNhat = bao[i]!;
  if (dinhNhat < 1e-5) return [];   // stem trống im lặng: không có kick nào

  const cach = Math.round(CACH_TOI_THIEU * fs);

  /* Một cú đánh là chỗ đường bao VỌT LÊN. Đo mức vọt trên cửa sổ 10 ms. */
  const nTruoc = Math.max(Math.round(0.01 * fs), 1);
  const VOT = 1.6;

  /** Quét một lượt với ngưỡng cho trước, trả về mốc từng cú. */
  function quet(nguong: number): number[] {
    const ra: number[] = [];
    let i = 0;
    while (i < bao.length) {
      if (bao[i]! < nguong) { i++; continue; }
      /* Đi tới ĐỈNH của cú này rồi mới ghi mốc: điểm vượt ngưỡng nằm trên sườn
         lên, sớm hơn cú đánh vài mili giây, và cú duck kích sớm nghe như lệch
         nhịp. */
      let j = i;
      while (j + 1 < bao.length && bao[j + 1]! >= bao[j]!) j++;

      /* ⚠️ PHẢI KIỂM ĐƯỜNG BAO CÓ VỌT LÊN KHÔNG — "trên ngưỡng" là chưa đủ.
         Một cú impact hạ âm ngân 0,25 giây nằm trên ngưỡng suốt quãng đó, và
         luật "trên ngưỡng + cách nhau 100 ms" đẻ ra ba mốc cho MỘT cú đánh.
         Cú duck vì thế giật ba nhịp liền trong lúc bài đang ngân — nghe như
         lỗi phát nhạc. Đoạn ngân là đoạn đường bao ĐI XUỐNG, nên chỉ cần đòi
         nó phải cao hơn mức 10 ms trước đó là gạt sạch. */
      const truoc = j >= nTruoc ? bao[j - nTruoc]! : 0;
      if (bao[j]! >= truoc * VOT) ra.push(j);
      i = j + cach;
    }
    return ra;
  }

  /* ─── NGƯỠNG THEO ĐỈNH LỚN NHẤT HỎNG Ở MỘT CHỖ RẤT THẬT ───
     Nhạc sàn hay có một cú impact hạ âm ở chỗ drop, to hơn kick cả chục dB.
     Ngưỡng 25% của nó nằm TRÊN mọi cú kick, nên bộ dò trả về đúng một hai
     mốc: cả bài không duck, mà đọc mã thì mọi thứ vẫn "chạy".

     Chữa bằng hai chốt, theo thứ tự:

      1. Quét được QUÁ ÍT mốc chính là triệu chứng của kẻ lạc loài. Lúc đó bỏ
         hẳn vùng quanh những mốc vừa tìm, đo lại đỉnh của PHẦN CÒN LẠI, rồi
         quét lại theo đỉnh mới.
      2. Có đủ mốc rồi thì siết lại theo TRUNG VỊ biên độ của chúng — một cú
         lạc loài không kéo nổi trung vị. Khi mọi cú đều nhau thì trung vị ≈
         đỉnh, nên bước này không đổi gì; nó chỉ can thiệp đúng lúc cần. */
  let moc = quet(dinhNhat * 0.25);

  if (moc.length < 4 && moc.length > 0) {
    let conLai = 0;
    for (let i = 0; i < bao.length; i++) {
      if (moc.some((m) => Math.abs(i - m) < cach * 1.5)) continue;
      if (bao[i]! > conLai) conLai = bao[i]!;
    }
    if (conLai > 1e-5 && conLai < dinhNhat * 0.5) moc = quet(conLai * 0.25);
  }

  if (moc.length >= 4) {
    const bien = moc.map((m) => bao[m]!).sort((a, b) => a - b);
    const trungVi = bien[bien.length >> 1]!;
    moc = quet(trungVi * 0.35);
  }
  return moc;
}

/** Mốc kick suy ra từ nhịp — dùng khi CHƯA tách stem trống. */
export function mocTuBpm(bpm: number, fs: number, soMau: number, lechGiay = 0): number[] {
  if (!(bpm > 0)) return [];
  const buoc = (60 / bpm) * fs;
  const moc: number[] = [];
  for (let t = lechGiay * fs; t < soMau; t += buoc) moc.push(Math.round(t));
  return moc;
}

export interface TuyChonDuck {
  /** Ghì sâu bao nhiêu, 0…1. 0,6 là ghì mất 60% biên độ. */
  sau: number;
  /** Bao lâu thì hồi lại đủ, giây. */
  hoiPhuc?: number;
  /** Ghì xuống trong bao lâu, giây. Không được bằng 0 — xem chú thích. */
  tanCong?: number;
  /** Độ cong đường hồi. 1 là thẳng; lớn hơn thì hồi nhanh lúc đầu. */
  cong?: number;
}

/**
 * Dán đường cong ghì lên mọi kênh, kích lại ở mỗi mốc kick.
 *
 * ⚠️ `tanCong` KHÔNG ĐƯỢC BẰNG 0. Hệ số nhảy tức thì từ 1 xuống 1−sâu là một
 * bước gián đoạn trong dạng sóng, và tai nghe ra nó như một tiếng "tách" ở
 * đúng mỗi cú kick — nghe như bản nhạc bị lỗi chứ không như một cú duck. Vài
 * mili giây là đủ để hết tách mà vẫn còn cảm giác dứt khoát.
 *
 * Kick chồng lên nhau (mốc mới tới khi cú trước chưa hồi xong) thì cú mới
 * thắng: đó là ý nghĩa của "kích lại".
 */
export function duckTheoKick(
  kenh: readonly Float32Array[], moc: readonly number[], fs: number, o: TuyChonDuck,
): Float32Array[] {
  const n = kenh[0]?.length ?? 0;
  const sau = Math.min(Math.max(o.sau, 0), 1);
  if (n === 0 || moc.length === 0 || sau === 0) return kenh.map((k) => new Float32Array(k));

  const hoiPhuc = Math.max(o.hoiPhuc ?? 0.25, 0.01);
  const tanCong = Math.max(o.tanCong ?? 0.004, 0.0005);
  const cong = Math.max(o.cong ?? 2, 0.2);
  const nTC = Math.max(Math.round(tanCong * fs), 1);
  const nHP = Math.max(Math.round(hoiPhuc * fs), 1);

  /* Dựng nguyên đường hệ số trước, rồi mới nhân. Tốn thêm 4 byte một mẫu,
     nhưng nó làm chuyện chồng lấn thành một phép `Math.min` đọc ra ngay, thay
     vì một máy trạng thái phải nhớ cú duck nào đang chạy. */
  const he = new Float32Array(n).fill(1);
  for (const m of moc) {
    const batDau = Math.max(m - nTC, 0);
    for (let i = batDau; i < m && i < n; i++) {
      const u = (i - batDau) / nTC;                 // 0 → 1 khi ghì xuống
      const g = 1 - sau * u;
      if (g < he[i]!) he[i] = g;
    }
    const het = Math.min(m + nHP, n);
    for (let i = Math.max(m, 0); i < het; i++) {
      const u = (i - m) / nHP;                      // 0 → 1 khi hồi lên
      const g = 1 - sau * Math.pow(1 - u, cong);
      if (g < he[i]!) he[i] = g;
    }
  }

  return kenh.map((k) => {
    const y = new Float32Array(n);
    for (let i = 0; i < n; i++) y[i] = k[i]! * he[i]!;
    return y;
  });
}
