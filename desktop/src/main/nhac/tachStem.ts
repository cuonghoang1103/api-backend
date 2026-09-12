/**
 * ============================================================
 * TÁCH STEM — điều phối
 * ============================================================
 *
 * Chuẩn hoá → chia khúc → gọi model từng khúc → ghép chồng → trả lại thang đo.
 *
 * ─── Vì sao hàm gọi model được TIÊM VÀO ───
 * Tệp này không `import` onnxruntime. Nó nhận một hàm `ChayModel` và gọi hàm
 * đó. Ba cái lợi, theo thứ tự quan trọng:
 *
 *  1. **Kiểm được.** Tiêm một model giả "trả lại y nguyên đầu vào" thì toàn bộ
 *     chuỗi chuẩn hoá + chia khúc + ghép chồng phải tái tạo bài gốc CHÍNH XÁC.
 *     Không phép kiểm nào khác bắt được lỗi lệch mẫu hay lệch trọng số tốt
 *     bằng phép đó, và nó chạy trong 20 ms thay vì cần model 1,26 GB.
 *  2. **App vẫn khởi động được khi chưa có gì.** onnxruntime là module gốc và
 *     model là bản tải về; người dùng chưa đụng tới Xưởng Remix thì không có
 *     thứ nào trong hai thứ đó. Ranh giới này khiến phần còn lại của app không
 *     biết tới sự tồn tại của chúng.
 *  3. Đổi bộ suy luận sau này (WebGPU, CoreML, hay một model khác) không phải
 *     đụng vào một dòng nào của tệp này.
 *
 * ⚠️ Chuỗi này CHƯA chạy thật với model — xem `tachStem.test.ts`. Phần toán đã
 * được chốt bằng model giả; phần hợp đồng tensor với ONNX còn phải đo trên máy
 * có tải được model về.
 */
import { CHONG_MAC_DINH, GhepChong, MAU_MOI_KHUC, catKhuc, mocKhuc } from './chiaKhuc';
import type { AmThanh } from './wav';

/** htdemucs trả bốn stem theo đúng thứ tự này. Đổi thứ tự là đổi nhãn của cả bốn. */
export const TEN_STEM = ['drums', 'bass', 'other', 'vocals'] as const;
export type TenStem = (typeof TEN_STEM)[number];

/** Tên tiếng Việt để hiện lên giao diện. */
export const NHAN_STEM: Record<TenStem, string> = {
  drums: 'Trống',
  bass: 'Bass',
  other: 'Nhạc nền',
  vocals: 'Giọng hát',
};

/** htdemucs được huấn luyện ở 44,1 kHz. Đưa vào tần số khác là ra kết quả sai câm. */
export const TAN_SO_MODEL = 44_100;

/**
 * Chạy model trên MỘT khúc.
 *
 * Vào: `[kênh][mẫu]`, đúng 2 kênh, mỗi mảng dài đúng `mauMoiKhuc`.
 * Ra:  `[stem][kênh][mẫu]`, 4 stem theo thứ tự `TEN_STEM`, cùng độ dài.
 */
export type ChayModel = (mix: readonly Float32Array[]) => Promise<Float32Array[][]>;

export interface TuyChonTach {
  mauMoiKhuc?: number;
  chong?: number;
  /** Gọi sau mỗi khúc xong. `tong` là tổng số khúc. */
  tienDo?: (xong: number, tong: number) => void;
  /** Dừng giữa chừng. Một bài 5 phút chạy vài phút trên CPU — phải huỷ được. */
  huy?: AbortSignal;
}

/**
 * Ép về đúng 2 kênh.
 *
 * Mono thì nhân đôi (model đòi stereo, và nhân đôi giữ nguyên nội dung). Nhiều
 * hơn 2 kênh thì trộn xuống stereo thay vì vứt bớt — vứt kênh giữa của một bản
 * 5.1 là vứt gần hết phần lời hát.
 */
export function epStereo(kenh: readonly Float32Array[]): Float32Array[] {
  const [L, R] = kenh;
  if (!L) throw new Error('không có kênh nào');
  if (kenh.length === 1) return [L, L];
  if (kenh.length === 2) return [L, R!];

  const n = L.length;
  const trai = new Float32Array(n);
  const phai = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let a = 0;
    let b = 0;
    for (let c = 0; c < kenh.length; c++) {
      // Kênh chẵn về trái, lẻ về phải; kênh giữa (nếu có) chia đều cho cả hai.
      const v = kenh[c]![i]!;
      if (c === 2) { a += v * 0.707; b += v * 0.707; } else if (c % 2 === 0) a += v; else b += v;
    }
    trai[i] = a / Math.ceil(kenh.length / 2);
    phai[i] = b / Math.ceil(kenh.length / 2);
  }
  return [trai, phai];
}

export interface ThangDo { trungBinh: number; doLech: number }

/**
 * Chuẩn hoá theo cách demucs được huấn luyện: lấy trung bình và độ lệch chuẩn
 * của bản trộn MONO, rồi áp cho cả hai kênh.
 *
 * ⚠️ Phải dùng cùng một cặp số cho CẢ BÀI, không phải từng khúc. Chuẩn hoá
 * theo khúc thì mỗi khúc được co giãn một kiểu, và sau khi ghép lại âm lượng
 * sẽ nhấp nhô theo chu kỳ 7,8 giây — nghe như bài nhạc đang "thở".
 */
export function doThangDo(kenh: readonly Float32Array[]): ThangDo {
  const [dau] = kenh;
  if (!dau || dau.length === 0) return { trungBinh: 0, doLech: 1 };

  const n = dau.length;
  let tong = 0;
  for (let i = 0; i < n; i++) {
    let m = 0;
    for (const k of kenh) m += k[i]!;
    tong += m / kenh.length;
  }
  const trungBinh = tong / n;

  let bp = 0;
  for (let i = 0; i < n; i++) {
    let m = 0;
    for (const k of kenh) m += k[i]!;
    const d = m / kenh.length - trungBinh;
    bp += d * d;
  }
  const doLech = Math.sqrt(bp / n);

  // Bài im lặng có độ lệch 0. Chia cho 0 ra NaN và NaN lan ra toàn bộ kết quả
  // mà không có gì nổ — trả về 1 để phép chia thành phép nhân với 1.
  return { trungBinh, doLech: doLech > 1e-8 ? doLech : 1 };
}

export interface KetQuaTach {
  stem: Record<TenStem, AmThanh>;
  /** Số khúc đã chạy — hiện ra để người dùng đối chiếu với thời gian chờ. */
  soKhuc: number;
}

/**
 * Tách một bài thành bốn stem.
 *
 * Đầu vào PHẢI ở 44,1 kHz. Không tự lấy mẫu lại ở đây: renderer đã giải mã
 * bằng Chromium rồi, và `OfflineAudioContext` của nó lấy mẫu lại đúng chuẩn
 * mà không tốn dòng mã nào. Viết một bộ lấy mẫu lại ở main chỉ để làm lại việc
 * đó, kém hơn.
 */
export async function tachStem(
  am: AmThanh,
  chay: ChayModel,
  opts: TuyChonTach = {},
): Promise<KetQuaTach> {
  if (am.tanSoMau !== TAN_SO_MODEL) {
    throw new Error(
      `tachStem cần ${TAN_SO_MODEL} Hz, nhận ${am.tanSoMau} Hz. ` +
      'Renderer phải lấy mẫu lại bằng OfflineAudioContext trước khi gửi sang.',
    );
  }

  const mauMoiKhuc = opts.mauMoiKhuc ?? MAU_MOI_KHUC;
  const chong = opts.chong ?? CHONG_MAC_DINH;

  const kenh = epStereo(am.kenh);
  const soMau = kenh[0]!.length;
  if (soMau === 0) throw new Error('tachStem: bài rỗng');

  const thang = doThangDo(kenh);
  const chuan = kenh.map((k) => {
    const ra = new Float32Array(k.length);
    for (let i = 0; i < k.length; i++) ra[i] = (k[i]! - thang.trungBinh) / thang.doLech;
    return ra;
  });

  const moc = mocKhuc(soMau, mauMoiKhuc, chong);
  // 4 stem × 2 kênh = 8 mặt phẳng, cùng một bộ đếm trọng số.
  const ghep = new GhepChong(soMau, TEN_STEM.length * 2, mauMoiKhuc);

  for (let i = 0; i < moc.length; i++) {
    if (opts.huy?.aborted) throw new Error('Đã huỷ tách stem');

    const khuc = catKhuc(chuan, moc[i]!, mauMoiKhuc);
    const ra = await chay(khuc);

    if (ra.length !== TEN_STEM.length) {
      throw new Error(`model trả ${ra.length} stem, cần ${TEN_STEM.length}`);
    }
    const mat: Float32Array[] = [];
    for (const stem of ra) {
      if (stem.length !== 2) throw new Error(`mỗi stem phải có 2 kênh, nhận ${stem.length}`);
      mat.push(stem[0]!, stem[1]!);
    }
    ghep.them(moc[i]!, mat);
    opts.tienDo?.(i + 1, moc.length);
  }

  const hong = ghep.mauHong();
  if (hong.length > 0) {
    // Không thể xảy ra nếu `mocKhuc` đúng. Nếu xảy ra thì im lặng nghĩa là bài
    // có một đoạn câm mà không ai biết vì sao — nói ra ngay.
    throw new Error(`ghép chồng bỏ sót ${hong.length} mẫu, mẫu đầu tiên ở ${hong[0]}`);
  }

  const phang = ghep.ketThuc();
  const stem = {} as Record<TenStem, AmThanh>;
  for (let s = 0; s < TEN_STEM.length; s++) {
    const kenhStem = [phang[s * 2]!, phang[s * 2 + 1]!];
    for (const k of kenhStem) {
      for (let i = 0; i < k.length; i++) k[i] = k[i]! * thang.doLech + thang.trungBinh;
    }
    stem[TEN_STEM[s]!] = { kenh: kenhStem, tanSoMau: am.tanSoMau };
  }

  return { stem, soKhuc: moc.length };
}
