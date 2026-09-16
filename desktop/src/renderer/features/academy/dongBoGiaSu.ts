/**
 * ============================================================
 * MỘT MẠCH GIA SƯ, HAI CỬA SỔ — phần quyết định gửi gì
 * ============================================================
 *
 * Trên web, khung gia sư dưới bài và con robot nổi đọc chung `giaSuBaiStore`
 * nên hỏi ở đâu cũng là MỘT cuộc. Trong app robot là một cửa sổ Electron
 * riêng, không thấy kho đó — nên phải bắc cầu qua main.
 *
 * Tách riêng hàm này vì nó là chỗ DỄ SAI NHẤT của cây cầu, và cả ba cách sai
 * đều im lặng:
 *
 *  • gửi cả lượt vừa NHẬN về ⇒ vòng lặp vô tận, câu hỏi nhân đôi mãi;
 *  • gửi khi câu trả lời còn ĐANG CHẢY ⇒ robot nhận một câu cụt giữa chừng và
 *    không bao giờ nhận bản đầy đủ;
 *  • gửi lượt của người dùng khi chưa có đáp án ⇒ robot hiện một câu hỏi treo.
 */

export interface LuotKho {
  role: 'user' | 'assistant';
  content: string;
  /** Câu hỏi sinh ra câu trả lời này. Web ghi sẵn; thiếu thì lấy lượt ngay trước. */
  srcQuestion?: string;
  /** Đang gõ dở — CHƯA được gửi đi. */
  streaming?: boolean;
}

export interface CapHoiDap { hoi: string; dap: string }

export interface KetQuaDongBo {
  /** Các cặp hỏi–đáp cần đẩy sang cửa sổ kia. */
  gui: CapHoiDap[];
  /** Mốc "đã xử lý tới đâu" cho lần gọi sau. */
  moc: number;
}

/**
 * @param ds     toàn bộ lượt của mạch hiện tại
 * @param daGui  mốc lần trước — mọi lượt trước mốc này coi như cửa sổ kia đã có
 */
export function luotCanGui(ds: readonly LuotKho[], daGui: number): KetQuaDongBo {
  /* Kho NGẮN LẠI (đổi bài, xoá cuộc) ⇒ hạ mốc. Giữ mốc cũ thì nó vĩnh viễn
     lớn hơn độ dài và mọi lượt sau đều bị bỏ qua — cây cầu chết câm. */
  if (ds.length <= daGui) return { gui: [], moc: Math.min(daGui, ds.length) };

  const gui: CapHoiDap[] = [];
  /**
   * ⚠️⚠️ MỐC DỪNG Ở LƯỢT ĐANG CHẢY, KHÔNG NHẢY QUA NÓ.
   *
   * Bản đầu của hàm này luôn trả `moc: ds.length`. Nghe hợp lý ("đã xét hết
   * mảng"), và nó SAI theo cách tệ nhất: lượt đang chảy bị bỏ qua ở lần gọi
   * này — đúng — nhưng mốc đã trỏ qua nó, nên khi chữ chảy xong, lần gọi sau
   * thấy `ds.length <= daGui` và trả về rỗng. Câu trả lời hoàn chỉnh **vĩnh
   * viễn không qua cầu**, và triệu chứng là "thỉnh thoảng robot không thấy câu
   * trả lời" — thứ gần như không thể tả lại.
   */
  let moc = ds.length;
  for (let i = daGui; i < ds.length; i++) {
    const t = ds[i];
    if (!t) continue;
    if (t.role === 'assistant' && t.streaming) { moc = i; break; }
    if (t.role !== 'assistant' || !t.content) continue;
    /* Câu hỏi: ưu tiên `srcQuestion` (web ghi sẵn, đúng cả khi có lượt chen
       giữa), lùi về lượt ngay trước — kể cả khi lượt đó nằm TRƯỚC mốc, vì câu
       trả lời có thể tới ở lần gọi sau câu hỏi. */
    const hoi = t.srcQuestion ?? (ds[i - 1]?.role === 'user' ? ds[i - 1]!.content : '');
    if (hoi) gui.push({ hoi, dap: t.content });
  }
  return { gui, moc };
}
