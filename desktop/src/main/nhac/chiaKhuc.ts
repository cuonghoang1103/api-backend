/**
 * ============================================================
 * CHIA KHÚC VÀ GHÉP CHỒNG
 * ============================================================
 *
 * Model tách stem chỉ nuốt được **7,8 giây một lần** (343.980 mẫu ở 44,1 kHz).
 * Một bài 5 phút phải cắt ra ~50 khúc, chạy từng khúc, rồi dán lại.
 *
 * ─── Vì sao không cắt rời rồi nối đuôi ───
 * Model không biết gì về khúc trước và khúc sau, nên hai mép của mỗi khúc luôn
 * kém hơn phần giữa — nó thiếu ngữ cảnh để quyết định. Nối đuôi nhau thì cứ
 * 7,8 giây lại có một vết nối nghe được, và vết đó rơi đúng vào chỗ tệ nhất
 * của cả hai khúc.
 *
 * Nên các khúc **chồng lên nhau 25%**, và vùng chồng được trộn theo trọng số
 * hình tam giác: ở giữa khúc trọng số cao nhất, ra hai mép giảm dần. Mỗi mẫu
 * của bài do vài khúc cùng góp, và khúc nào "nhìn" mẫu đó rõ nhất thì góp
 * nhiều nhất.
 *
 * ─── Vì sao chia cho TỔNG trọng số ở bước cuối ───
 * Đây là chỗ khiến phép ghép trở nên tự sửa: không cần trọng số phải cộng lại
 * đúng bằng 1 ở mọi vị trí (điều rất khó đảm bảo ở hai đầu bài và ở khúc
 * cuối bị đệm thêm). Cứ cộng dồn cả tín hiệu lẫn trọng số rồi chia, thì một
 * model giả "trả lại y nguyên đầu vào" phải tái tạo bài gốc CHÍNH XÁC.
 * Đó cũng chính là phép kiểm mạnh nhất của tệp này.
 */

/** Mẫu mỗi khúc theo hợp đồng của htdemucs: 7,8 s × 44.100 Hz. */
export const MAU_MOI_KHUC = 343_980;

/** Phần chồng giữa hai khúc liền nhau. 0,25 là mặc định của demucs. */
export const CHONG_MAC_DINH = 0.25;

/**
 * Vị trí bắt đầu của từng khúc.
 *
 * Khúc cuối được phép thò ra ngoài độ dài bài — phần thò sẽ đệm 0. Cắt ngắn
 * khúc cuối cho vừa thì sai hợp đồng với model (nó đòi đúng số mẫu), mà lùi
 * khúc cuối về cho vừa thì đoạn cuối bài bị tính hai lần với trọng số lệch.
 */
export function mocKhuc(
  soMau: number,
  mauMoiKhuc = MAU_MOI_KHUC,
  chong = CHONG_MAC_DINH,
): number[] {
  if (soMau <= 0) return [];
  if (chong < 0 || chong >= 1) throw new Error(`chong phải trong [0,1), nhận ${chong}`);

  const buoc = Math.max(1, Math.round(mauMoiKhuc * (1 - chong)));
  if (soMau <= mauMoiKhuc) return [0];

  const ra: number[] = [];
  for (let d = 0; d < soMau; d += buoc) ra.push(d);
  return ra;
}

/**
 * Trọng số hình tam giác, thấp nhất ở hai mép.
 *
 * ⚠️ Mép KHÔNG bằng 0 mà bằng 1 (trước khi chuẩn hoá). Nếu để 0 thì mẫu đầu
 * tiên của khúc đầu tiên có tổng trọng số bằng 0, và phép chia ở bước cuối
 * cho ra 0/0. Cho mép giá trị nhỏ nhất khác 0 thì mọi mẫu đều có đường ra.
 */
export function trongSoKhuc(mauMoiKhuc: number, luyThua = 1): Float32Array {
  if (mauMoiKhuc < 2) throw new Error('khúc phải dài ít nhất 2 mẫu');
  const w = new Float32Array(mauMoiKhuc);
  const nua = mauMoiKhuc >> 1;
  let dinh = 0;
  for (let i = 0; i < mauMoiKhuc; i++) {
    const v = i < nua ? i + 1 : mauMoiKhuc - i;
    w[i] = v;
    if (v > dinh) dinh = v;
  }
  for (let i = 0; i < mauMoiKhuc; i++) w[i] = Math.pow(w[i]! / dinh, luyThua);
  return w;
}

/**
 * Cộng dồn các khúc đã xử lý thành tín hiệu hoàn chỉnh.
 *
 * `soMat` là số "mặt phẳng" độc lập cần ghép — với 4 stem stereo thì là 8.
 * Gộp chung vào một bộ đếm trọng số duy nhất vì mọi mặt đều chia khúc y hệt
 * nhau; giữ 8 bản sao của cùng một mảng trọng số chỉ tốn bộ nhớ.
 */
export class GhepChong {
  private readonly tong: Float32Array[];
  private readonly tongTrongSo: Float32Array;
  private readonly w: Float32Array;

  constructor(
    private readonly soMau: number,
    soMat: number,
    private readonly mauMoiKhuc: number,
    luyThua = 1,
  ) {
    if (soMau <= 0) throw new Error('soMau phải dương');
    if (soMat <= 0) throw new Error('soMat phải dương');
    this.tong = Array.from({ length: soMat }, () => new Float32Array(soMau));
    this.tongTrongSo = new Float32Array(soMau);
    this.w = trongSoKhuc(mauMoiKhuc, luyThua);
  }

  /**
   * Góp một khúc đã xử lý vào kết quả.
   *
   * `mat[i]` phải dài đúng `mauMoiKhuc`. Phần thò ra ngoài bài bị bỏ, và bỏ
   * cả ở bộ đếm trọng số — nếu chỉ bỏ ở tín hiệu thì đoạn cuối bài bị chia
   * cho một trọng số lớn hơn thực tế và nghe nhỏ dần đi.
   */
  them(dauMau: number, mat: readonly Float32Array[]): void {
    if (mat.length !== this.tong.length) {
      throw new Error(`cần ${this.tong.length} mặt, nhận ${mat.length}`);
    }
    for (const m of mat) {
      if (m.length !== this.mauMoiKhuc) {
        throw new Error(`mỗi mặt phải dài ${this.mauMoiKhuc} mẫu, nhận ${m.length}`);
      }
    }

    const het = Math.min(this.mauMoiKhuc, this.soMau - dauMau);
    for (let i = Math.max(0, -dauMau); i < het; i++) {
      const n = dauMau + i;
      const w = this.w[i]!;
      this.tongTrongSo[n] = this.tongTrongSo[n]! + w;
      for (let k = 0; k < mat.length; k++) {
        this.tong[k]![n] = this.tong[k]![n]! + mat[k]![i]! * w;
      }
    }
  }

  /** Chia cho tổng trọng số và trả kết quả. Gọi một lần, sau khi đã góp hết. */
  ketThuc(): Float32Array[] {
    for (let n = 0; n < this.soMau; n++) {
      const w = this.tongTrongSo[n]!;
      // w = 0 nghĩa là có mẫu không khúc nào phủ tới — lỗi ở `mocKhuc`, không
      // phải chuyện bình thường. Để nguyên 0 còn hơn chia rồi ra Infinity.
      if (w === 0) continue;
      for (const t of this.tong) t[n] = t[n]! / w;
    }
    return this.tong;
  }

  /** Mẫu nào chưa được khúc nào phủ tới. Rỗng là đúng; có phần tử là có lỗi. */
  mauHong(): number[] {
    const ra: number[] = [];
    for (let n = 0; n < this.soMau; n++) if (this.tongTrongSo[n] === 0) ra.push(n);
    return ra;
  }
}

/**
 * Cắt một khúc từ tín hiệu nhiều kênh, đệm 0 cho phần thò ra ngoài.
 *
 * Luôn trả về mảng mới dài đúng `mauMoiKhuc` — model đòi đúng số mẫu, không
 * có đường thương lượng.
 */
export function catKhuc(
  kenh: readonly Float32Array[],
  dauMau: number,
  mauMoiKhuc: number,
): Float32Array[] {
  return kenh.map((k) => {
    const ra = new Float32Array(mauMoiKhuc);
    const het = Math.min(mauMoiKhuc, k.length - dauMau);
    for (let i = Math.max(0, -dauMau); i < het; i++) ra[i] = k[dauMau + i]!;
    return ra;
  });
}
