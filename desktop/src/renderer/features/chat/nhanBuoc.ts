/**
 * Nhãn "bước" của agent.
 *
 * ─── Vì sao không viết thẳng `bước 35/160` ───
 * Người dùng đọc `35/160` là một THANH TIẾN ĐỘ: "mới 35, còn 125 nữa". Họ hỏi
 * đúng câu đó 14/09/2026: *"sao 160 bước lắm vậy trong khi nó làm mới có 35
 * bước mà gần xong rồi"*.
 *
 * Nhưng 160 KHÔNG phải kế hoạch — nó là TRẦN (`TRAN_BUOC[mucNoLuc]` ở máy chủ,
 * mức "Tối đa"). Agent có thể xong ở bước 36, và thường là thế. Con số ấy chỉ
 * có nghĩa đúng một lúc: khi sắp chạm trần, vì lúc đó máy chủ sẽ CẮT ngang.
 *
 * Nên: bình thường chỉ hiện số bước đã đi. Gần trần mới hiện cả trần — đúng
 * lúc nó thật sự là thông tin, thay vì lúc nào cũng là một lời doạ.
 */

/** Còn ngần này bước nữa thì bắt đầu hiện trần. */
export const GAN_TRAN = 10;

export function ganTran(nay: number, tran: number): boolean {
  return tran > 0 && tran - nay <= GAN_TRAN;
}

/**
 * `(35, 160)` → `'bước 35'` · `(155, 160)` → `'bước 155/160'`.
 *
 * `dichP` truyền vào để dùng được cả ở chỗ có hook lẫn chỗ không.
 */
export function nhanBuoc(
  nay: number,
  tran: number,
  dichP: (cau: string, thay: Record<string, string | number>) => string,
): string {
  return ganTran(nay, tran)
    ? dichP('bước {nay}/{tran}', { nay, tran })
    : dichP('bước {nay}', { nay });
}
