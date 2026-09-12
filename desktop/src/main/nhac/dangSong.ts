/**
 * ============================================================
 * DẠNG SÓNG — bản tóm tắt để VẼ, không phải âm thanh để nghe
 * ============================================================
 *
 * Bàn làm việc cần thấy hình dạng bài hát: chỗ nào là đoạn build, chỗ nào là
 * drop, chỗ nào im. Nhưng vẽ thì không cần mẫu.
 *
 * ─── Vì sao tóm tắt ở MAIN chứ không gửi PCM sang renderer ───
 * Một bài 5 phút stereo là ~106 MB số thực. Gửi qua cầu IPC để renderer tự tìm
 * đỉnh là chở 106 MB cho một hình rộng 1200 điểm ảnh — và với bốn stem thì
 * thành 424 MB. Bản tóm tắt 1200 cột là 9,6 KB, tức nhỏ hơn mười một nghìn lần.
 *
 * ─── Vì sao giữ CẢ min và max, không chỉ biên độ ───
 * Sóng âm không đối xứng: tiếng trống, tiếng bass và mọi thứ đã qua hạn biên
 * đều lệch về một phía. Vẽ bằng `|x|` gương lên cho ra một hình cân đối đẹp
 * mắt mà SAI — nhìn không ra bài đã bị ép méo. Giữ cả hai đầu thì hình đúng
 * với thứ đang nằm trong tệp.
 *
 * ─── Vì sao lấy ĐỈNH chứ không lấy trung bình ───
 * Trung bình một cột 10.000 mẫu làm cú kick biến mất: nó chỉ chiếm vài trăm
 * mẫu. Đỉnh giữ được cú đánh, và cú đánh mới là thứ người ta nhìn để tìm chỗ
 * cắt.
 */

/** Một cột của dạng sóng: đáy và đỉnh trong khoảng mẫu nó phủ. */
export interface CotSong { min: number; max: number }

/**
 * Tóm tắt nhiều kênh thành `soCot` cột.
 *
 * Gộp mọi kênh vào cùng một cột (lấy đáy thấp nhất, đỉnh cao nhất): bàn làm
 * việc vẽ mỗi stem một dải, và một dải hai kênh chồng nhau chỉ thành một vệt
 * dày hơn chứ không đọc thêm được gì.
 */
export function dangSong(kenh: readonly Float32Array[], soCot: number): CotSong[] {
  const n = kenh[0]?.length ?? 0;
  const cot = Math.max(1, Math.floor(soCot));
  if (n === 0) return Array.from({ length: cot }, () => ({ min: 0, max: 0 }));

  const ra: CotSong[] = new Array(cot);
  for (let c = 0; c < cot; c++) {
    /* Chia theo tỉ lệ chứ không theo bước cố định: `n / cot` làm tròn xuống sẽ
       bỏ rơi phần đuôi bài, và với bài ngắn thì bỏ rơi rất nhiều. */
    const tu = Math.floor((c * n) / cot);
    const den = Math.max(tu + 1, Math.floor(((c + 1) * n) / cot));
    let lo = Infinity;
    let hi = -Infinity;
    for (const k of kenh) {
      for (let i = tu; i < den && i < k.length; i++) {
        const v = k[i]!;
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
    }
    /* Khoảng rỗng (bài ngắn hơn số cột) thì trả 0 chứ không trả ±Infinity —
       một `Infinity` lọt sang renderer là cả dải vẽ ra trống trơn. */
    ra[c] = Number.isFinite(lo) ? { min: lo, max: hi } : { min: 0, max: 0 };
  }
  return ra;
}

/**
 * Gộp thành hai mảng phẳng để đi qua cầu IPC.
 *
 * Mảng số thực đi qua structured clone rẻ hơn nhiều so với 1200 object nhỏ:
 * mỗi object mang theo phần đầu riêng, và renderer cũng đọc mảng phẳng nhanh
 * hơn khi vẽ từng khung hình.
 */
export function phangHoa(cot: readonly CotSong[]): { min: Float32Array; max: Float32Array } {
  const min = new Float32Array(cot.length);
  const max = new Float32Array(cot.length);
  for (let i = 0; i < cot.length; i++) {
    min[i] = cot[i]!.min;
    max[i] = cot[i]!.max;
  }
  return { min, max };
}
