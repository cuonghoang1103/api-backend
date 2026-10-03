/**
 * ============================================================
 * ĐỘNG CƠ AI CODE NGOẠI TUYẾN — vòng lặp agent chạy NGAY trên máy
 * ============================================================
 *
 * Khi có mạng, vòng lặp agent nằm ở MÁY CHỦ (`src/services/agent/turn.ts`):
 * app gửi hội thoại lên, máy chủ gọi model, trả về `tool_calls`, app chạy tool
 * rồi gửi lại. Mất mạng thì không còn ai ở đầu kia — tệp này đóng vai máy chủ
 * đó, nói chuyện với `llama-server` cục bộ qua đúng tuyến OpenAI
 * `/v1/chat/completions` (b10976 bật jinja sẵn ⇒ gọi tool được).
 *
 *   loop.ts (chayLuotCucBo) ──▶ chayVongCucBo() ──SSE──▶ llama-server :127.0.0.1
 *        ▲                          │
 *        └── chayTool(goi) ◀────────┘  (cùng bộ tool, cùng luật quyền/hook)
 *
 * Tệp này THUẦN: không biết tool nào làm gì, không biết quyền, không biết
 * Electron. Nó chỉ lo bốn việc mà model NHỎ chạy cục bộ làm hỏng thường xuyên
 * hơn hẳn model trên mạng:
 *
 *   1. **Tool call sai định dạng** — JSON hỏng, tên tool bịa, hay nhả nguyên
 *      `<tool_call>{…}</tool_call>` thành chữ thay vì gọi tool thật. Cứu được
 *      thì cứu (bóc khối chữ ra), không cứu được thì NHẮC lại tối đa 2 lần rồi
 *      dừng hẳn với một câu nói rõ — đừng quay vòng tới hết trần bước.
 *   2. **Trần bước** — model nhỏ lạc thì lạc mãi. Trần thấp, dừng ồn ào.
 *   3. **Ngữ cảnh** — cửa sổ 16-32k, không phải 200k. Nén trước MỖI lần gọi.
 *   4. **Huỷ** — bấm Dừng là cắt ngay cả lời gọi HTTP đang chảy chữ.
 *
 * Sự kiện phát ra cùng hình dạng `SuKienAgent` của vòng lặp máy chủ, nên giao
 * diện AI Code dùng lại nguyên si.
 */

/** Một tin nhắn theo giao thức OpenAI — cùng hình dạng `TinNhan` của loop.ts. */
export interface TinNhanCucBo {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content?: string | Array<{ type: string; text?: string }> | null;
  tool_calls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>;
  tool_call_id?: string;
}

export interface DinhNghiaTool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface GoiToolCucBo {
  id: string;
  name: string;
  args: Record<string, unknown>;
}

/** Tập con `SuKienAgent` mà động cơ tự phát. Tool phát sự kiện riêng ở `chayTool`. */
export type SuKienCucBo =
  | { loai: 'batDau'; model: string; buoc?: number; tranBuoc?: number; cucBo: { ten: string; nhan: string } }
  | { loai: 'chu'; delta: string }
  | { loai: 'tool'; ten: string; tomTat: string; vong: 'may' }
  | {
      loai: 'xong'; hanMuc: null; tienUsd: 0; daLuoc: number; soFileDaSua: number;
      nguCanh?: { kyTu: number; tran: number; phanTram: number; soLuotDaBo: number };
    }
  | { loai: 'loi'; thongDiep: string; ma: string }
  | { loai: 'huy' };

export interface YeuCauVongCucBo {
  /** `http://127.0.0.1:<cổng>` của llama-server. */
  goc: string;
  /** Tên model cho người dùng đọc ("Bản lập trình (30B)"). */
  tenModel: string;
  /** Nhãn kèm ("chỉ việc nhỏ" / "chạy trên máy này"). */
  nhan: string;
  heThong: string;
  /** Hội thoại THẬT của cuộc — động cơ NỐI THÊM vào đây (giữ được khi có mạng lại). */
  hoiThoai: TinNhanCucBo[];
  tools: DinhNghiaTool[];
  /** Cửa sổ ngữ cảnh của llama-server, token. */
  cuaSo: number;
  tranBuoc: number;
  /** Chạy MỘT tool. Không được ném — lỗi phải thành chữ cho model đọc. */
  chayTool: (g: GoiToolCucBo) => Promise<string>;
  phat: (e: SuKienCucBo) => void;
  signal: AbortSignal;
  /** Đếm file đã sửa để báo ở khung `xong`. */
  soFileDaSua?: () => number;
  fetchImpl?: typeof fetch;
  /** Trần một lời gọi model, ms. Máy chỉ CPU nạp đề chậm — mặc định 5 phút. */
  hanGoiMs?: number;
  /** Chạy ngay TRƯỚC khung `xong` (hook "xong lượt" của dự án) — cùng thứ tự với vòng máy chủ. */
  truocKhiXong?: () => Promise<void>;
}

export type KetThucVong = 'xong' | 'tranBuoc' | 'toolHong' | 'loi' | 'huy';

/** Số lần nhắc liên tiếp khi model gọi tool sai — quá số này là dừng. */
export const SO_LAN_NHAC_TOOL = 2;

/**
 * "Hứa suông" — model nhỏ NÓI sẽ làm rồi dừng, không gọi tool.
 *
 * Đo thật 03/10/2026, Qwen3-1.7B trên M1 Max: hỏi "đọc ma.txt rồi cho biết
 * MA_SO", nó trả đúng một câu *"Tôi cần đọc file `ma.txt`… Hãy đợi một chút."*
 * rồi kết thúc lượt. Với vòng lặp, đó là câu trả lời CUỐI — người dùng ngồi chờ
 * một thứ sẽ không bao giờ tới. Bắt mẫu câu đó và nhắc gọi tool ngay.
 */
export const HUA_SUONG = /(hãy|xin|vui lòng)?\s*(đợi|chờ)\s*(một|1)?\s*(chút|lát|giây)|\b(để|cho)\s+(tôi|mình|em)\s+(đọc|xem|kiểm|mở|tìm|sửa)|tôi\s+(sẽ|cần)\s+(đọc|xem|kiểm tra|mở|tìm|sửa)|let me (read|check|look|open)|i('ll| will) (read|check|look|open)/i;
const SO_LAN_NHAC_HUA = 2;

// ─── Ước lượng + nén ngữ cảnh ───────────────────────────────────────

/**
 * Ước lượng token từ số ký tự. 3 ký tự/token là CỐ Ý bi quan: mã nguồn ~3,5,
 * tiếng Việt có dấu ~2,5-3 với tokenizer Qwen. Đoán thừa thì nén sớm một
 * chút; đoán thiếu thì llama-server trả 400 "exceeds context" giữa việc.
 */
export function uocToken(chu: string): number {
  return Math.ceil(chu.length / 3);
}

function chuCua(t: TinNhanCucBo): string {
  if (typeof t.content === 'string') return t.content;
  if (Array.isArray(t.content)) {
    return t.content.map((k) => (k.type === 'text' ? String(k.text ?? '') : '[ảnh — model trên máy không xem ảnh]')).join('\n');
  }
  return '';
}

function tokenTin(t: TinNhanCucBo): number {
  let n = uocToken(chuCua(t)) + 6;
  for (const g of t.tool_calls ?? []) n += uocToken(g.function.name + g.function.arguments) + 8;
  return n;
}

/** Cắt giữa một đoạn dài: giữ đầu + đuôi, nói rõ đã bỏ bao nhiêu. */
export function catGiua(chu: string, tran: number): string {
  if (chu.length <= tran) return chu;
  const dau = Math.floor(tran * 0.7);
  const duoi = tran - dau;
  return `${chu.slice(0, dau)}\n…[đã lược ${chu.length - tran} ký tự để vừa bộ nhớ của model trên máy]…\n${chu.slice(-duoi)}`;
}

/** Bản sạch để gửi: chỉ các trường giao thức, nội dung mảng ⇒ chữ (model cục bộ không xem ảnh). */
function lamSach(t: TinNhanCucBo): TinNhanCucBo {
  const ra: TinNhanCucBo = { role: t.role, content: chuCua(t) };
  if (t.tool_calls?.length) ra.tool_calls = t.tool_calls.map((g) => ({ id: g.id, type: 'function', function: { ...g.function } }));
  if (t.tool_call_id) ra.tool_call_id = t.tool_call_id;
  return ra;
}

export interface KetQuaNen {
  tin: TinNhanCucBo[];
  /** Số tin cũ đã bỏ hẳn. */
  daBo: number;
  /** Token ước lượng sau khi nén (kể cả hệ thống). */
  token: number;
}

/**
 * Nén hội thoại cho vừa `ngânSách` token. Ba nấc, nấc sau chỉ chạy khi nấc
 * trước chưa đủ:
 *
 *   1. Kết quả tool CŨ (trước 2 nhóm gọi tool gần nhất) cắt còn 600 ký tự —
 *      model đã đọc và hành động theo chúng rồi; giữ nguyên văn là trả bộ nhớ
 *      cho thứ không còn ai cần.
 *   2. Bỏ cả LƯỢT cũ (một câu người dùng + mọi thứ theo sau) từ cũ tới mới, giữ
 *      lượt cuối. Bỏ theo LƯỢT, không theo tin: bỏ lẻ một tin `assistant` có
 *      `tool_calls` mà giữ tin `tool` của nó là hội thoại hỏng, chat template
 *      ném lỗi.
 *   3. Trong lượt cuối: bỏ các nhóm (assistant+tool) cũ nhất, giữ câu hỏi; cuối
 *      cùng mới cắt mạnh từng kết quả tool còn lại.
 */
export function nenNguCanh(heThong: string, hoiThoai: TinNhanCucBo[], nganSach: number): KetQuaNen {
  let tin = hoiThoai.map(lamSach);
  const tongToken = (): number => uocToken(heThong) + tin.reduce((a, t) => a + tokenTin(t), 0);
  let daBo = 0;

  /* Nấc 1 */
  const viTriGoi = tin.map((t, i) => (t.role === 'assistant' && t.tool_calls?.length ? i : -1)).filter((i) => i >= 0);
  const mocGiu = viTriGoi.length >= 2 ? viTriGoi[viTriGoi.length - 2]! : 0;
  if (tongToken() > nganSach) {
    tin = tin.map((t, i) => (t.role === 'tool' && i < mocGiu ? { ...t, content: catGiua(String(t.content ?? ''), 600) } : t));
  }

  /* Nấc 2 — chia lượt theo tin `user`; lượt CUỐI (câu đang hỏi) không bao giờ bỏ. */
  if (tongToken() > nganSach) {
    /* Tin lơ lửng trước `user` đầu tiên — hội thoại nạp từ đĩa có thể bắt đầu
       bằng assistant. Bỏ trước. */
    const dau = tin.findIndex((t) => t.role === 'user');
    if (dau > 0) { daBo += dau; tin = tin.slice(dau); }
    while (tongToken() > nganSach) {
      const sau = tin.findIndex((t, i) => i > 0 && t.role === 'user');
      if (sau < 0) break;
      daBo += sau;
      tin = tin.slice(sau);
    }
  }

  /* Nấc 3 — trong lượt cuối, bỏ nhóm gọi tool cũ nhất (giữ tin user đầu) */
  while (tongToken() > nganSach) {
    const i = tin.findIndex((t, j) => j > 0 && t.role === 'assistant' && t.tool_calls?.length);
    const conNhomSau = i >= 0 && tin.slice(i + 1).some((t) => t.role === 'assistant' && t.tool_calls?.length);
    if (!conNhomSau) break;
    let het = i + 1;
    while (het < tin.length && tin[het]!.role === 'tool') het += 1;
    const bo = het - i;
    tin = [...tin.slice(0, i), ...tin.slice(het)];
    daBo += bo;
  }
  if (tongToken() > nganSach) {
    /* Còn tràn ⇒ một kết quả tool khổng lồ. Chia đều ngân sách còn lại. */
    const soTool = tin.filter((t) => t.role === 'tool').length || 1;
    const conLai = Math.max(800, (nganSach - uocToken(heThong) - 400) * 3);
    const moiCai = Math.max(400, Math.floor(conLai / soTool));
    tin = tin.map((t) => (t.role === 'tool' || t.role === 'user'
      ? { ...t, content: catGiua(String(t.content ?? ''), t.role === 'tool' ? moiCai : Math.max(moiCai, 2000)) }
      : t));
  }

  if (daBo > 0) {
    tin = [{ role: 'user', content: `[Ghi chú của app: đã lược ${daBo} tin cũ để vừa bộ nhớ của model trên máy. Nếu cần chi tiết cũ, đọc lại file.]` }, ...(tin[0]?.role === 'user' ? [{ role: 'assistant' as const, content: 'Đã hiểu.' }] : []), ...tin];
  }
  return { tin, daBo, token: tongToken() };
}

// ─── Đọc lời gọi tool ───────────────────────────────────────────────

export interface KetQuaDoc {
  /** Chữ còn lại sau khi đã bóc các khối `<tool_call>`. */
  chu: string;
  goi: GoiToolCucBo[];
  /** Lý do HỎNG, viết để nhắc lại cho model. `null` = ổn. */
  hong: string | null;
}

/** Thử đọc JSON tham số. Model nhỏ hay bọc ```json hoặc để dấu phẩy thừa cuối. */
export function docThamSo(tho: string): Record<string, unknown> | null {
  const thu = (s: string): Record<string, unknown> | null => {
    try {
      const v = JSON.parse(s) as unknown;
      return v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : null;
    } catch {
      return null;
    }
  };
  const t = tho.trim();
  if (t === '') return {};
  return thu(t)
    ?? thu(t.replace(/^```(?:json)?\s*|\s*```$/g, ''))
    ?? thu(t.replace(/,\s*([}\]])/g, '$1'));
}

let demId = 0;
const taoId = (): string => `cucbo_${Date.now().toString(36)}_${(demId++).toString(36)}`;

/**
 * Gom lời gọi tool từ phản hồi model, kiểm từng cái.
 *
 * `tho` là `tool_calls` gom từ luồng SSE; `chu` là phần chữ. Model Qwen nhỏ
 * thỉnh thoảng KHÔNG đi đường tool_calls mà viết thẳng khối
 * `<tool_call>{"name":…,"arguments":…}</tool_call>` vào chữ — bóc ra được thì
 * coi như gọi thật (không bắt người dùng nhìn một khối JSON lạ).
 */
export function docLoiGoi(
  chu: string,
  tho: Array<{ id?: string; name: string; arguments: string }>,
  tenHopLe: Set<string>,
): KetQuaDoc {
  const goi: GoiToolCucBo[] = [];
  const loi: string[] = [];
  let conLai = chu;

  const xet = (ten: string, thamSoTho: string | Record<string, unknown>, id?: string): void => {
    if (!tenHopLe.has(ten)) {
      loi.push(`không có tool tên "${ten}"`);
      return;
    }
    const args = typeof thamSoTho === 'string' ? docThamSo(thamSoTho) : thamSoTho;
    if (!args) {
      loi.push(`tham số của ${ten} không phải JSON hợp lệ: ${String(thamSoTho).slice(0, 120)}`);
      return;
    }
    goi.push({ id: id || taoId(), name: ten, args });
  };

  for (const t of tho) xet(t.name, t.arguments, t.id);

  if (!tho.length && /<tool_call>/i.test(chu)) {
    const re = /<tool_call>\s*([\s\S]*?)\s*(?:<\/tool_call>|$)/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(chu)) !== null) {
      const j = docThamSo(m[1] ?? '');
      const ten = typeof j?.name === 'string' ? j.name : '';
      if (!j || !ten) { loi.push('khối <tool_call> không đọc được thành JSON có "name"'); continue; }
      const a = j.arguments ?? j.parameters ?? {};
      xet(ten, typeof a === 'string' ? a : (a as Record<string, unknown>));
    }
    conLai = chu.replace(/<tool_call>[\s\S]*?(?:<\/tool_call>|$)/gi, '').trim();
  }

  return { chu: conLai, goi, hong: loi.length ? loi.join('; ') : null };
}

// ─── Gọi llama-server, đọc luồng SSE ────────────────────────────────

interface PhanHoiModel {
  chu: string;
  tho: Array<{ id?: string; name: string; arguments: string }>;
  lyDoDung: string | null;
}

/**
 * Giữ lại phần đuôi có thể là đầu của `<tool_call>` — để không chảy nửa thẻ
 * lên màn hình rồi mới biết đó là lời gọi tool.
 */
function phanAnToan(chu: string): number {
  const i = chu.lastIndexOf('<');
  if (i < 0) return chu.length;
  const duoi = chu.slice(i).toLowerCase();
  return '<tool_call>'.startsWith(duoi) || duoi.startsWith('<tool_call>') ? i : chu.length;
}

async function goiModel(
  yc: YeuCauVongCucBo, tin: TinNhanCucBo[], maxToken: number, phatChu: (d: string) => void,
): Promise<PhanHoiModel> {
  const f = yc.fetchImpl ?? fetch;
  const hen = AbortSignal.timeout(yc.hanGoiMs ?? 300_000);
  const signal = AbortSignal.any([yc.signal, hen]);
  const r = await f(`${yc.goc}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      messages: [{ role: 'system', content: yc.heThong }, ...tin],
      /* Chưa mở dự án ⇒ không có tool. Gửi `tools: []` thì một số chat
         template vẫn chèn khối hướng dẫn gọi tool rỗng — bỏ hẳn trường. */
      ...(yc.tools.length ? { tools: yc.tools.map((t) => ({ type: 'function', function: t })) } : {}),
      /* MỘT tool mỗi lượt. Đo thật 03/10/2026: Qwen3-1.7B nhả cùng lúc
         list_dir + read_file + grep + edit_file — edit_file với `old_text`
         ĐOÁN từ trước khi đọc, nên luôn "không khớp". Một lời gọi một lượt
         buộc nó thấy kết quả đọc rồi mới viết lệnh sửa. Chậm hơn chút với
         model 30B, đổi lại model nhỏ làm được việc. */
      parallel_tool_calls: false,
      stream: true,
      max_tokens: maxToken,
      /* Thấp hơn chat (0,7): gọi tool cần đúng từng ký tự JSON. */
      temperature: 0.3,
      top_p: 0.8,
      /* Qwen3 "lai" (1,7B) mặc định nghĩ trước khi nói — trên máy yếu đó là
         hàng trăm token ẩn mỗi bước. Model không có chế độ nghĩ bỏ qua cờ này. */
      chat_template_kwargs: { enable_thinking: false },
    }),
  });
  if (!r.ok || !r.body) {
    const than = await r.text().catch(() => '');
    let vi = than.slice(0, 300);
    try { vi = (JSON.parse(than) as { error?: { message?: string } }).error?.message ?? vi; } catch { /* giữ chữ thô */ }
    throw Object.assign(new Error(`AI trên máy trả ${r.status}: ${vi}`), { maHttp: r.status });
  }

  let chu = '';
  let daPhat = 0;
  const tho = new Map<number, { id?: string; name: string; arguments: string }>();
  let lyDoDung: string | null = null;
  const doc = r.body.getReader();
  const giai = new TextDecoder();
  let dem = '';
  for (;;) {
    const { done, value } = await doc.read();
    if (done) break;
    dem += giai.decode(value, { stream: true });
    const dong = dem.split('\n');
    dem = dong.pop() ?? '';
    for (const d of dong) {
      const t = d.trim();
      if (!t.startsWith('data:')) continue;
      const du = t.slice(5).trim();
      if (du === '[DONE]') continue;
      let j: {
        choices?: Array<{
          delta?: {
            content?: string | null;
            tool_calls?: Array<{ index?: number; id?: string; function?: { name?: string; arguments?: string } }>;
          };
          finish_reason?: string | null;
        }>;
        error?: { message?: string };
      };
      try { j = JSON.parse(du); } catch { continue; }
      if (j.error) throw new Error(`AI trên máy: ${j.error.message ?? 'lỗi không rõ'}`);
      const c = j.choices?.[0];
      if (!c) continue;
      if (c.delta?.content) {
        chu += c.delta.content;
        const den = phanAnToan(chu);
        if (den > daPhat && !/<tool_call>/i.test(chu.slice(0, den))) {
          phatChu(chu.slice(daPhat, den));
          daPhat = den;
        }
      }
      for (const g of c.delta?.tool_calls ?? []) {
        const k = g.index ?? 0;
        const cu = tho.get(k) ?? { name: '', arguments: '' };
        if (g.id) cu.id = g.id;
        if (g.function?.name) cu.name += g.function.name;
        if (g.function?.arguments) cu.arguments += g.function.arguments;
        tho.set(k, cu);
      }
      if (c.finish_reason) lyDoDung = c.finish_reason;
    }
  }
  /* Phần đuôi đã giữ lại (nghi là thẻ) nhưng hoá ra không phải ⇒ xả nốt. */
  if (daPhat < chu.length && !/<tool_call>/i.test(chu)) phatChu(chu.slice(daPhat));
  return { chu, tho: [...tho.values()].filter((t) => t.name || t.arguments), lyDoDung };
}

// ─── Vòng lặp ───────────────────────────────────────────────────────

function khoaGoi(g: GoiToolCucBo): string {
  return `${g.name}:${JSON.stringify(g.args)}`;
}

/**
 * Chạy một lượt người dùng tới khi model trả lời xong, chạm trần, hỏng, hay bị
 * huỷ. KHÔNG ném — mọi kết cục đều thành một sự kiện cho giao diện.
 *
 * Câu hỏi của người dùng phải được NỐI vào `hoiThoai` TRƯỚC khi gọi.
 */
export async function chayVongCucBo(yc: YeuCauVongCucBo): Promise<KetThucVong> {
  const { phat, signal } = yc;
  const tenHopLe = new Set(yc.tools.map((t) => t.name));
  /* Chừa chỗ cho câu trả lời: 1/4 cửa sổ, trần 4096. Ghi một file mới cần
     cả nghìn token ra — chừa ít quá là `create_file` bị cắt giữa JSON. */
  const maxToken = Math.min(4096, Math.floor(yc.cuaSo / 4));
  const tokenTools = uocToken(JSON.stringify(yc.tools));
  const nganSach = Math.max(1024, yc.cuaSo - maxToken - tokenTools - 256);

  let buoc = 0;
  let nhac = 0;
  let nhacHua = 0;
  let daBoTong = 0;
  const ganDay: string[] = [];

  const baoXong = (nen: KetQuaNen): void => {
    phat({
      loai: 'xong', hanMuc: null, tienUsd: 0, daLuoc: daBoTong, soFileDaSua: yc.soFileDaSua?.() ?? 0,
      nguCanh: {
        kyTu: nen.token * 3,
        tran: yc.cuaSo * 3,
        phanTram: Math.min(100, Math.round((nen.token / yc.cuaSo) * 100)),
        soLuotDaBo: daBoTong,
      },
    });
  };

  try {
    for (;;) {
      if (signal.aborted) { phat({ loai: 'huy' }); return 'huy'; }
      phat({
        loai: 'batDau', model: yc.tenModel, buoc: buoc + 1, tranBuoc: yc.tranBuoc,
        cucBo: { ten: yc.tenModel, nhan: yc.nhan },
      });

      const nen = nenNguCanh(yc.heThong, yc.hoiThoai, nganSach);
      daBoTong = Math.max(daBoTong, nen.daBo);
      const ph = await goiModel(yc, nen.tin, maxToken, (d) => phat({ loai: 'chu', delta: d }));
      if (signal.aborted) { phat({ loai: 'huy' }); return 'huy'; }

      const doc = docLoiGoi(ph.chu, ph.tho, tenHopLe);

      /* Bị cắt vì hết max_tokens giữa lúc viết lời gọi tool ⇒ JSON cụt. Nói
         RÕ nguyên nhân thay vì "JSON hỏng" để model biết chia nhỏ. */
      const catCut = ph.lyDoDung === 'length' && (ph.tho.length > 0 || /<tool_call>/i.test(ph.chu));

      if (doc.hong || catCut || (!doc.goi.length && !doc.chu.trim())) {
        nhac += 1;
        const lyDo = catCut
          ? `lời gọi tool bị cắt vì quá ${maxToken} token — chia nhỏ (ví dụ edit_file từng đoạn thay vì create_file cả file dài)`
          : doc.hong ?? 'phản hồi rỗng — không có chữ cũng không gọi tool';
        phat({ loai: 'tool', ten: 'model trên máy', tomTat: `gọi tool sai định dạng — nhắc lại (${nhac}/${SO_LAN_NHAC_TOOL})`, vong: 'may' });
        if (nhac > SO_LAN_NHAC_TOOL) {
          phat({
            loai: 'loi',
            ma: 'TOOL_HONG',
            thongDiep: `Model trên máy (${yc.tenModel}) gọi tool sai định dạng ${nhac} lần liền nên đã dừng (${lyDo}). `
              + 'Thử hỏi hẹp hơn — một file, một việc — hoặc chờ có mạng để dùng AI máy chủ.',
          });
          return 'toolHong';
        }
        /* Giữ lời model vừa nói (dạng chữ) + một câu nhắc của app. KHÔNG giữ
           `tool_calls` hỏng — gửi lại chúng là bắt chat template nuốt JSON hỏng. */
        if (ph.chu.trim()) yc.hoiThoai.push({ role: 'assistant', content: ph.chu.trim() });
        yc.hoiThoai.push({
          role: 'user',
          content: `[App] Lời gọi tool vừa rồi không dùng được: ${lyDo}. `
            + `Gọi lại bằng đúng cơ chế gọi tool, tham số là JSON hợp lệ. Tool đang có: ${[...tenHopLe].join(', ')}. `
            + 'Nếu không cần tool nữa thì trả lời người dùng bằng chữ.',
        });
        continue;
      }
      nhac = 0;

      if (!doc.goi.length && yc.tools.length && nhacHua < SO_LAN_NHAC_HUA && HUA_SUONG.test(doc.chu)) {
        nhacHua += 1;
        phat({ loai: 'tool', ten: 'model trên máy', tomTat: `nói sẽ làm nhưng chưa gọi tool — nhắc (${nhacHua}/${SO_LAN_NHAC_HUA})`, vong: 'may' });
        yc.hoiThoai.push({ role: 'assistant', content: doc.chu });
        yc.hoiThoai.push({
          role: 'user',
          content: '[App] Bạn vừa nói sẽ làm nhưng CHƯA gọi tool nào — người dùng không trả lời được câu "đợi một chút". '
            + 'Gọi tool cần thiết NGAY BÂY GIỜ (bằng cơ chế gọi tool), rồi mới trả lời.',
        });
        continue;
      }

      if (!doc.goi.length) {
        yc.hoiThoai.push({ role: 'assistant', content: doc.chu });
        await yc.truocKhiXong?.().catch(() => {});
        baoXong(nen);
        return 'xong';
      }

      if (buoc >= yc.tranBuoc) {
        phat({
          loai: 'loi',
          ma: 'MAX_STEPS',
          thongDiep: `Đã đi ${yc.tranBuoc} bước — trần của ${yc.tenModel} trên máy này. Model nhỏ đi quá xa thường là đang lạc; `
            + 'xem các bước đã làm, rồi hỏi tiếp một việc hẹp hơn (hoặc chờ có mạng).',
        });
        return 'tranBuoc';
      }
      buoc += 1;

      /* Llama-server b10976 BỎ QUA `parallel_tool_calls: false` với template
         Qwen (đo: vẫn nhả 5 lời gọi một lượt). Nên cắt ở đây: chỉ giữ lời gọi
         ĐẦU, và hội thoại chỉ ghi đúng lời gọi đó — không có tool_call mồ côi.
         Model thấy kết quả rồi tự gọi tiếp ở lượt sau. */
      if (doc.goi.length > 1) doc.goi = doc.goi.slice(0, 1);

      yc.hoiThoai.push({
        role: 'assistant',
        content: doc.chu || null,
        tool_calls: doc.goi.map((g) => ({ id: g.id, type: 'function', function: { name: g.name, arguments: JSON.stringify(g.args) } })),
      });
      for (const g of doc.goi) {
        if (signal.aborted) {
          /* Đã đẩy tool_calls ⇒ phải có đủ kết quả, không thì hội thoại hỏng
             cho lượt sau (cả khi có mạng lại, cổng cũng từ chối). */
          yc.hoiThoai.push({ role: 'tool', tool_call_id: g.id, content: 'Đã huỷ trước khi chạy.' });
          continue;
        }
        let kq = await yc.chayTool(g);
        /* Model nhỏ hay gọi lại Y HỆT một lời vừa gọi — vòng lặp vô ích. Nhắc
           ngay trong kết quả, chỗ duy nhất nó chắc chắn đọc. */
        const k = khoaGoi(g);
        if (ganDay.filter((x) => x === k).length >= 1) {
          kq += '\n\n[App] Bạn vừa gọi Y HỆT lời này ở bước trước. Đừng lặp — dùng kết quả đã có, hoặc đổi cách.';
        }
        ganDay.push(k);
        if (ganDay.length > 6) ganDay.shift();
        yc.hoiThoai.push({ role: 'tool', tool_call_id: g.id, content: kq });
      }
      if (signal.aborted) { phat({ loai: 'huy' }); return 'huy'; }
    }
  } catch (e) {
    if (signal.aborted) { phat({ loai: 'huy' }); return 'huy'; }
    const m = (e as Error)?.message || 'lỗi không rõ';
    const quaHan = (e as { name?: string })?.name === 'TimeoutError';
    phat({
      loai: 'loi',
      ma: quaHan ? 'CUC_BO_QUA_HAN' : 'CUC_BO_LOI',
      thongDiep: quaHan
        ? `AI trên máy trả lời quá lâu nên đã dừng. Máy có thể đang thiếu RAM/GPU cho ${yc.tenModel}.`
        : `AI trên máy gặp lỗi: ${m}`,
    });
    return 'loi';
  }
}
