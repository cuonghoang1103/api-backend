/**
 * ============================================================
 * ĐỒNG HỒ CANH IM LẶNG CHO DÒNG CHẢY SSE
 * ============================================================
 *
 * ─── Lỗi nó sinh ra để chữa ───
 * Vòng đọc của `goiLuot` là `for(;;) await doc.read()` — KHÔNG hạn giờ, không
 * ai canh. Cổng AI nhận kết nối rồi im lặng thì app chờ **vĩnh viễn**: màn hình
 * đứng ở "Odin đang đọc mã của bạn…", số giây cứ tăng, và không có gì tự thoát.
 * Người dùng gửi ảnh 14/09/2026: kẹt ở bước 35/160, 159 giây, trên cả ba nền
 * tảng.
 *
 * Giao diện có sẵn một dòng trấn an ("Cổng AI đang chậm chứ app không treo —
 * bấm Dừng nếu muốn thử lại") hiện sau 15 giây. Nhưng nó chỉ TRẤN AN: bên dưới
 * không có đường thoát nào, và nếu người dùng không bấm Dừng thì nó chờ mãi.
 * Một câu trấn an không phải một hạn giờ.
 *
 * ─── Vì sao canh IM LẶNG, không phải canh TỔNG THỜI GIAN ───
 * Một lượt agent chạy hàng phút là chuyện bình thường và đúng — trần tổng thời
 * gian sẽ giết oan đúng những việc khó nhất. Thứ KHÔNG bao giờ bình thường là
 * dòng chảy tắt tiếng: cổng rambo trải 308–950ms giữa hai mẩu (đo thật), nên
 * im lặng hàng phút nghĩa là đầu bên kia đã chết mà chưa đóng kết nối.
 */

/** Im lặng quá ngần này thì coi như cổng đã chết. */
export const TRAN_IM_LANG_MS = 120_000;

export type KetQuaDoc<T> =
  | { ok: true; giaTri: T }
  | { ok: false; imLang: true };

/**
 * Đọc một mẩu, nhưng không chờ quá `msIm` mà không nhận được gì.
 *
 * ⚠️ KHÔNG huỷ lời hứa đọc khi hết giờ — `ReadableStreamDefaultReader.read()`
 * không huỷ được, và bỏ mặc nó là để lại một lời hứa lơ lửng sẽ ném
 * `unhandledRejection` khi luồng bị đóng sau đó. Gắn sẵn một `catch` rỗng: chỗ
 * gọi sẽ abort cả luồng ngay sau khi hàm này báo im lặng, nên giá trị đọc được
 * (nếu có) không còn ai cần.
 */
export async function docCoHanIm<T>(
  doc: { read: () => Promise<T> },
  msIm: number = TRAN_IM_LANG_MS,
): Promise<KetQuaDoc<T>> {
  let hen: ReturnType<typeof setTimeout> | undefined;
  const loiHua = doc.read();
  loiHua.catch(() => { /* xem chú thích trên */ });

  const cho = new Promise<{ ok: false; imLang: true }>((xong) => {
    hen = setTimeout(() => xong({ ok: false, imLang: true }), msIm);
    /* `unref` để đồng hồ không giữ tiến trình sống lúc thoát app. Node-only;
       bọc vì cùng tệp này chạy được trong phép kiểm ở môi trường khác. */
    (hen as unknown as { unref?: () => void }).unref?.();
  });

  try {
    return await Promise.race([
      loiHua.then((giaTri) => ({ ok: true as const, giaTri })),
      cho,
    ]);
  } finally {
    if (hen) clearTimeout(hen);
  }
}

/**
 * Câu báo cho người dùng khi cổng tắt tiếng.
 *
 * Nói RÕ ba điều, vì thiếu điều nào người dùng cũng sẽ hỏi lại: đã chờ bao lâu,
 * lỗi nằm ở đâu (không phải máy họ), và làm gì tiếp. Câu chung chung kiểu "đã
 * xảy ra lỗi" là thứ khiến họ ngồi thử lại năm lần.
 */
export function cauImLang(msIm: number = TRAN_IM_LANG_MS): string {
  const phut = Math.round(msIm / 60_000);
  return `Cổng AI ngừng gửi dữ liệu trong ${phut} phút nên lượt này đã dừng. `
    + 'Việc đã làm tới đây vẫn giữ nguyên — nhắn tiếp để agent chạy tiếp từ chỗ đang dở.';
}
