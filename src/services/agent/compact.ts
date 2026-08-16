/**
 * ============================================================
 * NÉN NGỮ CẢNH — thứ quyết định giá của MỘT việc
 * ============================================================
 *
 * Giao thức gọi tool gửi lại TOÀN BỘ hội thoại ở mỗi lượt. Nghĩa là chi phí
 * của một việc N bước không tăng theo N — nó tăng theo N², vì lượt thứ i phải
 * chở theo kết quả của cả i−1 lượt trước.
 *
 * Đo thật trên chính repo này (17/08/2026), KHÔNG nén:
 *
 *     3 bước →   9.100 token        (≈ 3.000/bước)
 *     7 bước →  24.800 token        (≈ 3.500/bước)
 *    khớp mô hình  B≈1.650/lượt + R≈410/kết quả, tổng = (N+1)·B + R·N(N+1)/2
 *
 * Thay R bằng số thật của mã nguồn thật (đọc một file 300 dòng ≈ 3.000 token,
 * không phải 410 như file đồ chơi trong bộ kiểm thử) thì đường cong dựng đứng:
 *
 *     10 bước ≈ 156.000 token
 *     20 bước ≈ 560.000 token
 *     30 bước ≈ 1.200.000 token   ← MỘT việc, ăn 30% hạn mức 5 giờ
 *
 * Nén cắt phần đuôi đó đi. Ý tưởng: **kết quả tool cũ hiếm khi còn cần**. Khi
 * agent đã đọc `boot.ts` ở bước 3 và rút ra kết luận ở bước 4, nguyên văn 300
 * dòng ấy chở theo tới bước 20 chẳng để làm gì — điều nó cần nhớ đã nằm trong
 * câu nó tự viết ra rồi.
 *
 * Nên: giữ NGUYÊN VĂN vài kết quả gần nhất, những cái cũ hơn thay bằng một
 * mẩu ngắn có ghi rõ là đã lược. Tin nhắn của người dùng và câu của chính
 * model thì KHÔNG BAO GIỜ đụng tới — đó là mạch suy nghĩ, cắt vào đó là agent
 * quên mất mình đang làm gì.
 *
 * ⚠️ Nén chỉ áp dụng cho bản gửi LÊN CỔNG. Bản `append` trả về app vẫn đầy đủ,
 * nên người dùng cuộn lại vẫn thấy nguyên văn mọi thứ. Hai bản khác nhau là có
 * chủ ý: một bản để model đọc (tốn tiền), một bản để người đọc (miễn phí).
 */
import type { AgentMessage } from './turn.js';

/**
 * Số kết quả tool gần nhất giữ nguyên văn.
 *
 * 8 chọn theo cách agent thật làm việc: nó hay đọc 2–3 file rồi so sánh, thỉnh
 * thoảng quay lại một file đã xem. 8 phủ được nhịp đó. Nhỏ hơn (3–4) thì nó
 * phải đọc lại file vừa xem — mà đọc lại cũng tốn đúng số token vừa tiết kiệm,
 * chỉ thêm một vòng round-trip.
 */
const GIU_NGUYEN_VAN = 8;

/** Trần tổng cho phần kết quả tool được giữ nguyên (ký tự). ~30k token. */
const TRAN_KY_TU = 120_000;

/** Kết quả cũ bị lược còn bấy nhiêu ký tự đầu — đủ để model nhớ nó đã xem gì. */
const DAU_MAU = 180;

export interface KetQuaNen {
  messages: AgentMessage[];
  /** Số kết quả tool đã bị lược. 0 = không nén gì. */
  soDaLuoc: number;
  /** Ký tự đã cắt được — để ghi log và hiện lên giao diện. */
  kyTuDaCat: number;
}

/**
 * Nén hội thoại trước khi gửi lên cổng.
 *
 * KHÔNG BAO GIỜ xoá hẳn một tin nhắn `role:'tool'`: giao thức đòi mỗi
 * `tool_call` phải có đúng một tin nhắn trả lời mang đúng `tool_call_id`, và
 * thiếu một cái là cổng từ chối CẢ LƯỢT với một lỗi không nói rõ thiếu ở đâu.
 * Chỉ rút ngắn `content`.
 */
export function nenNguCanh(messages: AgentMessage[]): KetQuaNen {
  // Duyệt NGƯỢC: cái gần hiện tại nhất là cái đáng giữ nhất.
  const viTriTool: number[] = [];
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'tool') viTriTool.push(i);
  }
  if (viTriTool.length <= GIU_NGUYEN_VAN) {
    return { messages, soDaLuoc: 0, kyTuDaCat: 0 };
  }

  const giuNguyen = new Set<number>();
  let tichLuy = 0;
  for (let k = 0; k < viTriTool.length && k < GIU_NGUYEN_VAN; k++) {
    const i = viTriTool[k];
    const dai = (messages[i] as { content: string }).content.length;
    // Một kết quả khổng lồ ở gần cuối không được phép nuốt cả ngân sách và đẩy
    // 7 kết quả kia ra ngoài — dừng ở đúng chỗ chạm trần.
    if (tichLuy + dai > TRAN_KY_TU && giuNguyen.size > 0) break;
    tichLuy += dai;
    giuNguyen.add(i);
  }

  let soDaLuoc = 0;
  let kyTuDaCat = 0;
  const ra = messages.map((m, i) => {
    if (m.role !== 'tool' || giuNguyen.has(i)) return m;
    const goc = m.content;
    if (goc.length <= DAU_MAU) return m; // đã ngắn sẵn, lược cũng không lợi gì
    soDaLuoc++;
    kyTuDaCat += goc.length - DAU_MAU;
    return {
      ...m,
      content:
        `${goc.slice(0, DAU_MAU)}\n` +
        `[… kết quả cũ đã được lược bớt để tiết kiệm ngữ cảnh. ` +
        `Nếu bạn cần lại đầy đủ, hãy GỌI LẠI tool đó — đừng đoán phần bị lược.]`,
    };
  });

  return { messages: ra, soDaLuoc, kyTuDaCat };
}
