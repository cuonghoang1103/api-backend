/**
 * MCP — các phép biến đổi THUẦN (không I/O): kết quả tool → chữ + ảnh, tên
 * tool → tên máy chủ chấp nhận, `${BIEN}` → giá trị.
 *
 * Để riêng để kiểm từng cái mà không phải dựng server nào.
 */

// ─── Kết quả tool ──────────────────────────────────────────────────

/** Trần CHỮ của một kết quả. Nó chở theo ở mọi lượt sau, nên tốn tiền thật. */
export const MAX_KET_QUA = 16_000;
/** Bốn định dạng ảnh cổng Anthropic nhận — cùng bộ với `read_file` (tools.ts). */
const KIEU_ANH = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp']);
/** Trần mỗi ảnh (byte gốc) — cùng trần với `read_file` đọc ảnh. */
export const TRAN_ANH_BYTE = 1_400_000;
/** Tối đa ảnh mỗi kết quả: mỗi tấm vài nghìn token, và chúng đi theo cả phiên. */
export const MAX_ANH = 4;

export interface KetQuaChuyen {
  noiDung: string;
  anh: Array<{ media_type: string; data: string }>;
  loi: boolean;
}

interface KhoiMcp {
  type?: string;
  text?: string;
  data?: string;
  mimeType?: string;
  uri?: string;
  name?: string;
  description?: string;
  resource?: { uri?: string; mimeType?: string; text?: string; blob?: string };
}

function chuanMime(m: unknown): string {
  const s = String(m ?? '').toLowerCase().trim();
  return s === 'image/jpg' ? 'image/jpeg' : s;
}

/** base64 → số byte gốc, không phải giải mã cả chuỗi. */
function soByte(b64: string): number {
  const dem = b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0;
  return Math.floor((b64.length * 3) / 4) - dem;
}

/**
 * Biến `result` của `tools/call` thành thứ vòng lặp agent dùng được.
 *
 * Bản đầu CHỈ lấy khối `text` và bỏ im mọi thứ khác. Với Figma thì đó chính là
 * phần đáng giá nhất: `get_screenshot` trả một khối `image`, và model nhận về
 * "(tool chạy xong, không trả về chữ nào)" — nó không biết là có ảnh bị vứt.
 * Giờ ảnh đi theo đường ống ảnh sẵn có (`anh`, cùng đường `read_file`/`web_anh`),
 * và mọi khối KHÔNG dùng được đều để lại một dòng nói rõ đã bỏ gì, vì sao.
 */
export function chuyenKetQua(kq: unknown, tenServer: string): KetQuaChuyen {
  const o = (kq && typeof kq === 'object' ? kq : {}) as {
    content?: unknown; isError?: boolean; structuredContent?: unknown;
  };
  const khoi = Array.isArray(o.content) ? (o.content as KhoiMcp[]) : [];
  const chu: string[] = [];
  const anh: KetQuaChuyen['anh'] = [];
  let coChuThat = false;

  const themAnh = (mime: string, data: string, nhan: string): void => {
    if (!KIEU_ANH.has(mime)) { chu.push(`[${nhan}: định dạng ${mime || '?'} không đọc được — đã bỏ]`); return; }
    if (typeof data !== 'string' || data.length === 0) { chu.push(`[${nhan}: rỗng — đã bỏ]`); return; }
    const b = soByte(data);
    if (b > TRAN_ANH_BYTE) {
      chu.push(`[${nhan}: ${(b / 1024 / 1024).toFixed(1)}MB, quá trần ${(TRAN_ANH_BYTE / 1024 / 1024).toFixed(1)}MB — đã bỏ. `
        + 'Nếu tool có tham số tỉ lệ/kích thước, gọi lại với ảnh nhỏ hơn.]');
      return;
    }
    if (anh.length >= MAX_ANH) { chu.push(`[${nhan}: quá ${MAX_ANH} ảnh một kết quả — đã bỏ]`); return; }
    anh.push({ media_type: mime, data });
    chu.push(`[${nhan} ${anh.length}: ${mime}, ${Math.round(b / 1024)}KB — đính kèm bên dưới]`);
  };

  for (const k of khoi) {
    if (!k || typeof k !== 'object') continue;
    switch (k.type) {
      case 'text':
        if (typeof k.text === 'string') { chu.push(k.text); coChuThat = true; }
        break;
      case 'image':
        themAnh(chuanMime(k.mimeType), String(k.data ?? ''), 'ảnh');
        break;
      case 'audio':
        chu.push(`[âm thanh ${chuanMime(k.mimeType) || ''} — AI Code chưa nghe được, đã bỏ]`);
        break;
      case 'resource': {
        const r = k.resource ?? {};
        const mime = chuanMime(r.mimeType);
        if (typeof r.text === 'string') {
          chu.push(`[tài nguyên ${r.uri ?? ''}${mime ? ` (${mime})` : ''}]\n${r.text}`);
          coChuThat = true;
        } else if (typeof r.blob === 'string' && KIEU_ANH.has(mime)) {
          themAnh(mime, r.blob, `ảnh tài nguyên ${r.uri ?? ''}`.trim());
        } else {
          chu.push(`[tài nguyên nhị phân ${r.uri ?? ''} (${mime || 'không rõ kiểu'}) — đã bỏ]`);
        }
        break;
      }
      case 'resource_link':
        chu.push(`[liên kết tài nguyên: ${k.name ? `${k.name} ` : ''}${k.uri ?? ''}${k.description ? ` — ${k.description}` : ''}]`);
        coChuThat = true;
        break;
      default:
        chu.push(`[khối "${String(k.type)}" chưa hỗ trợ — đã bỏ]`);
    }
  }

  // Tool chỉ trả `structuredContent` (spec 2025-06-18) mà không kèm chữ.
  if (!coChuThat && o.structuredContent !== undefined) {
    try { chu.push(JSON.stringify(o.structuredContent, null, 2)); } catch { /* vòng tham chiếu — bỏ */ }
  }

  let noiDung = chu.join('\n');
  if (noiDung.length > MAX_KET_QUA) {
    /* Cắt CÓ BÁO. Bản đầu `.slice()` im lặng — model đọc nửa đầu một cây node
       Figma rồi kết luận thiết kế chỉ có bấy nhiêu. Báo ra thì nó biết đường
       gọi lại với phạm vi hẹp hơn. */
    const dai = noiDung.length;
    noiDung = `${noiDung.slice(0, MAX_KET_QUA)}\n\n[… KẾT QUẢ BỊ CẮT: dài ${dai.toLocaleString('vi-VN')} ký tự, `
      + `chỉ giữ ${MAX_KET_QUA.toLocaleString('vi-VN')}. Gọi lại với phạm vi hẹp hơn — vd. một node/frame cụ thể.]`;
  }
  if (o.isError) return { noiDung: `LỖI từ ${tenServer}: ${noiDung || 'không rõ'}`, anh, loi: true };
  if (!noiDung && anh.length === 0) return { noiDung: '(tool chạy xong, không trả về gì)', anh, loi: false };
  return { noiDung, anh, loi: false };
}

// ─── Tên ───────────────────────────────────────────────────────────

/**
 * Khuôn tên của MÁY CHỦ (`src/services/agent/tools.ts` → `TEN_MCP`):
 * `mcp__<server 1–32 ký tự [a-zA-Z0-9_-]>__<tool 1–48 ký tự [a-zA-Z0-9_.-]>`.
 *
 * ⚠️ Máy chủ LỌC BỎ IM LẶNG mọi tên sai khuôn. Bản đầu chỉ `.slice(0, 64)`,
 * nên một server tên `figma-dev-mode` + tool 50 ký tự, hay một tên server có
 * dấu cách, hiện "5 tool" trên bảng mà model không thấy cái nào.
 */
export const KHUON_TEN_SERVER = /^[a-zA-Z0-9_-]{1,32}$/;

export function tenToolAnToan(ten: string): string {
  return ten.replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 48) || '_';
}

/**
 * JSON Schema tham số — cổng kiểu OpenAI đòi gốc là `type: "object"`.
 * Một vài server bỏ trống `inputSchema` hoặc thiếu `type`; gửi nguyên thì cả
 * lượt bị cổng từ chối, không riêng tool đó.
 */
export function chuanSchema(s: unknown): Record<string, unknown> {
  if (!s || typeof s !== 'object' || Array.isArray(s)) return { type: 'object', properties: {} };
  const o = { ...(s as Record<string, unknown>) };
  if (o.type !== 'object') o.type = 'object';
  if (!o.properties || typeof o.properties !== 'object') o.properties = {};
  return o;
}

// ─── Biến môi trường trong cấu hình ────────────────────────────────

/**
 * `${BIEN}` và `${BIEN:-mặc định}` — cùng cú pháp Claude Code dùng trong
 * `.mcp.json`, để người ta chép cấu hình từ README về là chạy, và để một
 * `.mcp.json` đưa vào git không phải chứa token thật.
 *
 * Trả thêm danh sách biến THIẾU: thay bằng chuỗi rỗng rồi chạy tiếp là cách
 * chắc chắn nhất để server báo một lỗi 401 khó hiểu thay vì câu "thiếu biến X".
 */
export function moRongBien(s: string, env: NodeJS.ProcessEnv, thieu: Set<string>): string {
  return s.replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)(?::-([^}]*))?\}/g, (_, ten: string, macDinh?: string) => {
    const v = env[ten];
    if (v !== undefined && v !== '') return v;
    if (macDinh !== undefined) return macDinh;
    thieu.add(ten);
    return '';
  });
}

export function moRongBang(
  b: Record<string, string> | undefined,
  env: NodeJS.ProcessEnv,
  thieu: Set<string>,
): Record<string, string> {
  const ra: Record<string, string> = {};
  if (!b || typeof b !== 'object') return ra;
  for (const [k, v] of Object.entries(b)) {
    if (typeof v === 'string') ra[k] = moRongBien(v, env, thieu);
    else if (typeof v === 'number' || typeof v === 'boolean') ra[k] = String(v);
  }
  return ra;
}
