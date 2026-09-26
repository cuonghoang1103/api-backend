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
 * ─── 26/09/2026: MỐC BẬC THANG thay cho cửa sổ TRƯỢT ───
 * Bản cũ giữ "8 kết quả gần nhất" — mỗi bước lại lược thêm ĐÚNG MỘT kết quả,
 * tức tiền tố gửi lên cổng đổi ở MỌI bước. Cổng rambo (API Anthropic) tự lưu
 * đệm tiền tố và tính phần đọc đệm rẻ hơn hẳn, nhưng chỉ khi tiền tố GIỐNG HỆT
 * lần trước. Đo thật: mỗi lời gọi chở 17k–57k token vào (p90 ~94k) mà chỉ ra
 * 400–650 — gần như toàn bộ tiền nằm ở phần VÀO, và cửa sổ trượt làm trượt
 * đệm ở mọi bước. Nay mốc lược chỉ nhảy mỗi 8 kết quả, nên 7/8 số bước đọc
 * lại được nguyên tiền tố cũ từ đệm.
 *
 * Và bản cũ giữ 180 ký tự ĐẦU — trong khi lỗi thường nằm ở CUỐI đầu ra. Agent
 * quên mất mình đã thất bại thế nào rồi lặp lại đúng cú đó. Nay mẩu lược là
 * một bản tóm có cấu trúc theo LOẠI kết quả (lỗi / đọc file / tìm kiếm).
 *
 * ⚠️ Nén chỉ áp dụng cho bản gửi LÊN CỔNG. Bản `append` trả về app vẫn đầy đủ,
 * nên người dùng cuộn lại vẫn thấy nguyên văn mọi thứ. Hai bản khác nhau là có
 * chủ ý: một bản để model đọc (tốn tiền), một bản để người đọc (miễn phí).
 */
import type { AgentMessage, ToolCall } from './turn.js';

/**
 * Bậc của mốc lược.
 *
 * 8 chọn theo cách agent thật làm việc: nó hay đọc 2–3 file rồi so sánh, thỉnh
 * thoảng quay lại một file đã xem. Với mốc bậc thang, phần giữ nguyên văn dao
 * động 8–15 kết quả: vừa đủ nhịp làm việc, vừa để tiền tố đứng yên 8 bước liền
 * (26/09/2026 — xem ghi chú đầu file).
 */
export const BAC_MOC = 8;

/**
 * Trần an toàn cho TỔNG phần kết quả tool giữ nguyên văn (ký tự, ~37k token).
 *
 * Vượt trần thì mốc dịch thêm TỪNG BẬC 8, không dịch từng cái một — dịch từng
 * cái là quay lại đúng cửa sổ trượt làm trượt đệm ở mọi bước (26/09/2026).
 */
export const TRAN_NGUYEN_VAN = 150_000;

/** Tham số tool_call dài hơn ngần này (trong vùng lược) thì bị rút gọn. */
const TRAN_THAM_SO = 600;
/** Một trường tham số dài hơn ngần này thì bị thay bằng `<đã lược N ký tự>`. */
const TRAN_TRUONG = 160;

/** Câu kết chung của mọi mẩu lược. */
export const CAU_KET_LUOC =
  'Chỉ gọi lại nếu THỰC SỰ cần nguyên văn; ưu tiên đọc hẹp theo dòng hoặc grep.';

export interface KetQuaNen {
  messages: AgentMessage[];
  /** Số kết quả tool đã bị lược. 0 = không nén gì. */
  soDaLuoc: number;
  /** Ký tự đã cắt được — để ghi log và hiện lên giao diện. */
  kyTuDaCat: number;
  /** Mốc lược: kết quả tool có thứ tự (xuôi, từ 0) NHỎ HƠN mốc thì bị lược. */
  moc: number;
}

/**
 * Tính mốc lược từ độ dài các kết quả tool theo thứ tự XUÔI.
 *
 *   moc = n ≤ 8 ? 0 : ⌊(n−8)/8⌋·8
 *
 * n = 9..15 ⇒ moc 0; n = 16..23 ⇒ moc 8; … Tiền tố chỉ đổi khi n chạm bội
 * của 8. Rồi mới áp trần an toàn, cũng theo bậc.
 */
export function tinhMoc(doDai: readonly number[]): number {
  const n = doDai.length;
  let moc = n <= BAC_MOC ? 0 : Math.floor((n - BAC_MOC) / BAC_MOC) * BAC_MOC;
  const tongTu = (tu: number): number => doDai.slice(tu).reduce((a, b) => a + b, 0);
  while (moc + BAC_MOC < n && tongTu(moc) > TRAN_NGUYEN_VAN) moc += BAC_MOC;
  return moc;
}

/** Bảng tool_call_id → lời gọi, dựng từ các tin assistant. */
export function bangLoiGoi(messages: readonly AgentMessage[]): Map<string, ToolCall> {
  const bang = new Map<string, ToolCall>();
  for (const m of messages) {
    if (m.role === 'assistant' && m.tool_calls) for (const c of m.tool_calls) bang.set(c.id, c);
  }
  return bang;
}

function docThamSo(raw: string): Record<string, unknown> {
  try {
    const v = JSON.parse(raw || '{}');
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

// ─── Mẩu lược có cấu trúc ──────────────────────────────────────────

/** Tool mà kết quả là "dòng tìm được" — tóm bằng số dòng + vài dòng đầu. */
const TOOL_TIM = new Set(['grep', 'glob', 'list_dir']);

/**
 * Kết quả này có phải một THẤT BẠI không.
 *
 * Nhìn ĐẦU nội dung (app mở đầu mọi lỗi bằng "LỖI"/"Lệnh HỎNG, mã thoát N")
 * và mã thoát khác 0. `ERR!`/`Error:` ở giữa nội dung chỉ tính với tool KHÔNG
 * phải đọc/tìm — một file mã nguồn có chữ `Error:` không phải là lỗi.
 */
export function laKetQuaLoi(ten: string, noiDung: string): boolean {
  const dau = noiDung.trimStart();
  if (/^(LỖI|Lỗi:|Lệnh HỎNG|Error|ERROR|Traceback|fatal:|FAIL)/.test(dau)) return true;
  if (/mã thoát\s+(-?[1-9]\d*|bị giết)/.test(dau.slice(0, 300))) return true;
  if (ten === 'read_file' || TOOL_TIM.has(ten)) return false;
  return /\bERR!|^\s*\w*Error:/m.test(noiDung);
}

/** Cắt một dòng về trần, không để một dòng log dài nuốt cả mẩu lược. */
const catDong = (s: string, tran = 200): string => (s.length > tran ? `${s.slice(0, tran)}…` : s);

/**
 * Mẩu lược cho một kết quả tool — TẤT ĐỊNH (không gọi LLM): cùng đầu vào luôn
 * ra cùng một chuỗi, nếu không thì chính mẩu lược làm trượt đệm tiền tố.
 */
export function manhLuoc(ten: string, thamSo: Record<string, unknown>, noiDung: string): string {
  const dong = noiDung.split('\n');

  if (laKetQuaLoi(ten, noiDung)) {
    /* Model PHẢI nhớ nó đã thất bại thế nào: dòng đầu (thường là "Lệnh HỎNG,
       mã thoát 1") + dòng lỗi đầu tiên + 3 dòng cuối (thường là chỗ lỗi thật).
       Giữ 180 ký tự đầu như bản cũ là giữ đúng phần vô nghĩa nhất. */
    const giu: string[] = [catDong(dong[0] ?? '')];
    const iLoi = dong.findIndex((d, i) => i > 0 && /(lỗi|error|err!|fail|hỏng|exception|cannot|not found|không tìm thấy)/i.test(d));
    const cuoi = dong.map((d, i) => [d, i] as const).filter(([d]) => d.trim()).slice(-3);
    if (iLoi > 0 && !cuoi.some(([, i]) => i === iLoi)) giu.push(catDong(dong[iLoi]!));
    if (cuoi.length && cuoi[0]![1] > 0) giu.push('…');
    for (const [d, i] of cuoi) if (i > 0) giu.push(catDong(d));
    let than = giu.join('\n');
    if (than.length > 600) than = `${than.slice(0, 600)}…`;
    return `[đã lược: ${ten} — THẤT BẠI, giữ phần lỗi]\n${than}\n[${CAU_KET_LUOC}]`;
  }

  if (ten === 'read_file') {
    const duong = typeof thamSo.path === 'string' ? thamSo.path : '?';
    return `[đã lược: read_file ${duong} — đã đọc; nếu cần sửa, đọc lại HẸP đúng đoạn cần bằng offset/limit, đừng đọc lại cả file]`;
  }

  if (TOOL_TIM.has(ten)) {
    const coChu = dong.filter((d) => d.trim());
    return `[đã lược: ${ten} — ${coChu.length} dòng kết quả; 5 dòng đầu:]\n`
      + `${coChu.slice(0, 5).map((d) => catDong(d)).join('\n')}\n[${CAU_KET_LUOC}]`;
  }

  return `[đã lược: ${ten || 'tool'} — ${noiDung.length} ký tự]\n${noiDung.slice(0, 240)}\n…\n`
    + `${noiDung.slice(-120)}\n[${CAU_KET_LUOC}]`;
}

/**
 * Rút gọn chuỗi `arguments` của một tool_call cũ. Vẫn là JSON HỢP LỆ — tuyến
 * Anthropic `JSON.parse` nó thành `input`, và JSON hỏng thì `input` rỗng, tức
 * model nhìn lại lịch sử thấy mình đã gọi `edit_file {}` (26/09/2026).
 *
 * Trường ngắn (path, command, pattern…) giữ nguyên — đó là thứ giúp model nhớ
 * mình đã làm gì. Trường dài (content, new_string, old_string, edits…) thay
 * bằng `"<đã lược N ký tự>"`.
 */
export function rutThamSo(raw: string): string {
  if (raw.length <= TRAN_THAM_SO) return raw;
  let v: unknown;
  try { v = JSON.parse(raw); } catch { v = undefined; }
  if (!v || typeof v !== 'object' || Array.isArray(v)) {
    return JSON.stringify({ _da_luoc: `<đã lược ${raw.length} ký tự>` });
  }
  const ra: Record<string, unknown> = {};
  for (const [k, gt] of Object.entries(v as Record<string, unknown>)) {
    const chuoi = typeof gt === 'string' ? gt : JSON.stringify(gt) ?? '';
    ra[k] = chuoi.length > TRAN_TRUONG ? `<đã lược ${chuoi.length} ký tự>` : gt;
  }
  return JSON.stringify(ra);
}

/**
 * Nén hội thoại trước khi gửi lên cổng.
 *
 * KHÔNG BAO GIỜ xoá hẳn một tin nhắn `role:'tool'`: giao thức đòi mỗi
 * `tool_call` phải có đúng một tin nhắn trả lời mang đúng `tool_call_id`, và
 * thiếu một cái là cổng từ chối CẢ LƯỢT với một lỗi không nói rõ thiếu ở đâu.
 * Chỉ rút ngắn `content` (và `arguments` của lời gọi cũ — id giữ nguyên).
 */
export function nenNguCanh(messages: AgentMessage[]): KetQuaNen {
  /**
   * ẢNH CŨ BỊ GỠ, chỉ giữ tấm của lượt GẦN NHẤT.
   *
   * Ảnh là thứ đắt nhất trong hội thoại — một ảnh chụp màn hình tốn cỡ 1.500
   * token, và nó được gửi lại ở MỌI lượt gọi cổng sau đó. Một việc 20 bước với
   * hai tấm ảnh là +60k token cho hai tấm hình mà agent đã đọc xong từ bước
   * đầu. Nó vẫn nhớ nội dung — nó đã mô tả tấm ảnh trong câu trả lời của chính
   * nó, và câu đó thì được giữ nguyên.
   */
  const viTriAnhCuoi = messages.reduce(
    (v, m, i) => (m.role === 'user' && Array.isArray(m.content) ? i : v),
    -1,
  );
  messages = messages.map((m, i) => {
    if (m.role !== 'user' || !Array.isArray(m.content) || i === viTriAnhCuoi) return m;
    const chu = m.content.filter((k) => k.type === 'text');
    return {
      role: 'user',
      content: [...chu, { type: 'text' as const, text: '[ảnh đã gỡ để tiết kiệm ngữ cảnh]' }],
    };
  });

  // Thứ tự XUÔI của từng kết quả tool — mốc tính trên thứ tự này.
  const thuTu = new Map<number, number>();
  const doDai: number[] = [];
  const thuTuTheoId = new Map<string, number>();
  messages.forEach((m, i) => {
    if (m.role !== 'tool') return;
    thuTu.set(i, doDai.length);
    thuTuTheoId.set(m.tool_call_id, doDai.length);
    doDai.push(m.content.length);
  });
  const moc = tinhMoc(doDai);
  if (moc === 0) return { messages, soDaLuoc: 0, kyTuDaCat: 0, moc };

  const bang = bangLoiGoi(messages);
  let soDaLuoc = 0;
  let kyTuDaCat = 0;
  const ra = messages.map((m, i): AgentMessage => {
    /* Tham số của lời gọi CŨ: chỉ rút khi MỌI kết quả của tin này đều nằm
       trong vùng lược — tin nào còn một kết quả nguyên văn thì model có thể
       đang cần đối chiếu đúng tham số đó. */
    if (m.role === 'assistant' && m.tool_calls?.length) {
      const cu = m.tool_calls.every((c) => {
        const t = thuTuTheoId.get(c.id);
        return t !== undefined && t < moc;
      });
      if (!cu) return m;
      let doi = false;
      const calls = m.tool_calls.map((c) => {
        const rut = rutThamSo(c.function.arguments);
        if (rut === c.function.arguments) return c;
        doi = true;
        kyTuDaCat += Math.max(0, c.function.arguments.length - rut.length);
        return { ...c, function: { ...c.function, arguments: rut } };
      });
      return doi ? { ...m, tool_calls: calls } : m;
    }

    if (m.role !== 'tool') return m;
    const t = thuTu.get(i)!;
    if (t >= moc) return m;

    /*
     * ⚠️ GỠ CẢ ẢNH KÈM KẾT QUẢ, KHÔNG CHỈ CẮT CHỮ.
     *
     * Bản đầu chỉ rút ngắn `content` rồi `...m` chở nguyên `anh` đi tiếp. Kết
     * quả: phần chữ co lại trong khi tấm ảnh 1.500 token vẫn được gửi lại ở
     * MỌI lượt sau — đúng thứ mà cả cơ chế nén này sinh ra để chặn, và là phần
     * đắt nhất của hội thoại.
     *
     * Không lộ ra ở đâu cả: `kyTuDaCat` chỉ đếm ký tự chữ, nên sổ vẫn báo
     * "đã tiết kiệm" trong khi tiền vẫn chảy. Xem
     * [[feedback_hai_con_so_hai_kho_khong_ai_noi_lai]].
     */
    const coAnh = Array.isArray(m.anh) && m.anh.length > 0;
    const goc = m.content;
    const goi = bang.get(m.tool_call_id);
    const ten = goi?.function.name ?? '';
    const manh = manhLuoc(ten, docThamSo(goi?.function.arguments ?? '{}'), goc);
    // Đã ngắn sẵn (ngắn hơn cả mẩu lược) thì lược cũng không lợi gì.
    if (goc.length <= manh.length && !coAnh) return m;
    soDaLuoc++;
    kyTuDaCat += Math.max(0, goc.length - manh.length);
    const { anh: _bo, ...conLai } = m;
    return {
      ...conLai,
      content: coAnh ? `${manh}\n[… ảnh đã được gỡ để tiết kiệm ngữ cảnh.]` : manh,
    };
  });

  return { messages: ra, soDaLuoc, kyTuDaCat, moc };
}
