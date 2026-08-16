/**
 * ============================================================
 * VÒNG LẶP AGENT — chạy ở MAIN process
 * ============================================================
 *
 *   renderer ──IPC──▶ main ──SSE──▶ backend ──▶ cổng LLM
 *                      │
 *                      └─ chạy tool đọc file, đẩy kết quả vào, gọi lại
 *
 * Renderer KHÔNG tham gia vòng lặp; nó chỉ nhận sự kiện để vẽ. Nếu vòng lặp
 * sống ở renderer thì mỗi kết quả tool phải qua IPC hai lần, và một lần
 * chuyển trang là mất cả phiên đang chạy dở.
 *
 * ─── BỐN GIÁ TRỊ `stop`, PHẢI XỬ LÝ ĐỦ CẢ BỐN ───
 *   'end'        xong → chờ người dùng gõ tiếp
 *   'tool_calls' chạy tool → nối kết quả → gọi lại
 *   'continue'   KHÔNG có tool nào để chạy, cứ gọi lại ngay
 *   'max_steps'  chạm trần bước → dừng hẳn
 *
 * `'continue'` là cái dễ quên nhất, và quên nó thì agent đứng im vĩnh viễn ở
 * đúng chỗ đó. Backend cố ý tách nó khỏi `'tool_calls'` chính vì bộ kiểm thử
 * đầu tiên đã dính (xem ghi chú trong `src/services/agent/turn.ts`).
 */
import { API_ORIGIN } from '../config';
import { readStoredSession } from '../ipc/auth';
import { chayToolAgent } from './tools';

/** Trần vòng lặp phía app. RỘNG HƠN trần bước của máy chủ (30) để máy chủ mới là bên nói dừng. */
const MAX_VONG = 40;

/** Sự kiện đẩy lên renderer. Đây là thứ giao diện vẽ. */
export type SuKienAgent =
  | { loai: 'batDau'; model: string }
  | { loai: 'chu'; delta: string }
  /** Một tool vừa chạy xong (bất kể vòng 1 hay vòng 2) — để hiện dòng tiến trình. */
  | { loai: 'tool'; ten: string; tomTat: string; vong: 'may' | 'notes' }
  | { loai: 'xong'; hanMuc: HanMucUi | null; tienUsd: number; daLuoc: number }
  | { loai: 'loi'; thongDiep: string; ma?: string }
  | { loai: 'huy' };

export interface HanMucUi {
  daDung: number;
  tran: number;
  phanTram: number;
  hoiLucNao: string | null;
}

interface TinNhan {
  role: 'user' | 'assistant' | 'tool';
  content?: string | null;
  tool_calls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>;
  tool_call_id?: string;
}

export interface BoiCanh {
  /** Thư mục dự án, hoặc null nếu chưa chọn. */
  goc: string | null;
  nhanh?: string;
}

/**
 * Hội thoại sống trong main, không phải renderer.
 *
 * Renderer chỉ giữ bản để HIỂN THỊ. Hai bản này khác nhau: bản dưới đây mang
 * `tool_calls` và `tool_call_id` — thứ giao thức cần nhưng người dùng không
 * bao giờ nhìn thấy.
 */
let hoiThoai: TinNhan[] = [];
let dangChay: AbortController | null = null;

export function xoaHoiThoai(): void {
  hoiThoai = [];
}

export function dangChayKhong(): boolean {
  return dangChay !== null;
}

/** Người dùng bấm dừng. */
export function huyLuot(): void {
  dangChay?.abort();
  dangChay = null;
}

/**
 * Một lượt người dùng: nhận câu hỏi, chạy tới khi agent trả lời xong.
 *
 * `phat` được gọi nhiều lần trong suốt quá trình — đây là hàm chạy lâu (hàng
 * chục giây tới vài phút), không phải một lời gọi request/response.
 */
export async function chayLuot(
  cauHoi: string,
  boiCanh: BoiCanh,
  phat: (e: SuKienAgent) => void,
): Promise<void> {
  if (dangChay) throw new Error('Đang có một lượt chạy dở. Hãy dừng nó trước.');

  const phien = readStoredSession();
  if (!phien) {
    phat({ loai: 'loi', thongDiep: 'Chưa đăng nhập.', ma: 'NO_SESSION' });
    return;
  }

  const dieuKhien = new AbortController();
  dangChay = dieuKhien;
  hoiThoai.push({ role: 'user', content: cauHoi });

  // Chỉ khai báo khả năng khi THẬT SỰ có thư mục. Khai bừa thì máy chủ đưa tool
  // đọc file cho model, model gọi, và app trả lỗi ở mọi lời gọi — agent quay
  // vòng trong một việc nó không bao giờ làm được.
  const capabilities = boiCanh.goc ? ['fs_read', 'git_read'] : [];

  try {
    for (let vong = 0; vong < MAX_VONG; vong++) {
      if (dieuKhien.signal.aborted) { phat({ loai: 'huy' }); return; }

      const ketQua = await mgoiMotLuot({
        token: phien.sessionToken,
        messages: hoiThoai,
        capabilities,
        ...(boiCanh.goc
          ? {
              workspace: {
                name: tenThuMuc(boiCanh.goc),
                platform: process.platform as string,
                ...(boiCanh.nhanh ? { branch: boiCanh.nhanh } : {}),
              },
            }
          : {}),
        signal: dieuKhien.signal,
        phat,
      });

      if (!ketQua) return; // lỗi hoặc huỷ — `mgoiMotLuot` đã phát sự kiện rồi

      hoiThoai.push(...ketQua.append);

      if (ketQua.stop === 'end' || ketQua.stop === 'max_steps') {
        phat({ loai: 'xong', hanMuc: ketQua.quota, tienUsd: ketQua.costUsd, daLuoc: ketQua.daLuoc });
        return;
      }

      // 'tool_calls' → chạy; 'continue' → không có gì để chạy, vòng lại ngay.
      for (const goi of ketQua.toolCalls) {
        if (dieuKhien.signal.aborted) { phat({ loai: 'huy' }); return; }
        const kq = boiCanh.goc
          ? await chayToolAgent(boiCanh.goc, goi.name, goi.args)
          : { noiDung: 'LỖI: người dùng chưa chọn thư mục dự án nào.', tomTat: 'chưa mở dự án' };
        hoiThoai.push({ role: 'tool', tool_call_id: goi.id, content: kq.noiDung });
        phat({ loai: 'tool', ten: goi.name, tomTat: kq.tomTat, vong: 'may' });
      }
    }

    phat({ loai: 'loi', thongDiep: `Quá ${MAX_VONG} vòng mà chưa xong. Hãy hỏi câu hẹp hơn.`, ma: 'MAX_ROUNDS' });
  } catch (err) {
    if (dieuKhien.signal.aborted) phat({ loai: 'huy' });
    else phat({ loai: 'loi', thongDiep: (err as Error).message || 'Lỗi không rõ.' });
  } finally {
    if (dangChay === dieuKhien) dangChay = null;
  }
}

function tenThuMuc(p: string): string {
  return p.split(/[\\/]/).filter(Boolean).pop() ?? p;
}

// ─── Một lời gọi tới /agent/turn, đọc SSE ──────────────────────────

interface KetQuaLuot {
  append: TinNhan[];
  stop: 'end' | 'tool_calls' | 'continue' | 'max_steps';
  toolCalls: Array<{ id: string; name: string; args: Record<string, unknown> }>;
  quota: HanMucUi | null;
  costUsd: number;
  daLuoc: number;
}

async function mgoiMotLuot(o: {
  token: string;
  messages: TinNhan[];
  capabilities: string[];
  workspace?: { name: string; platform: string; branch?: string };
  signal: AbortSignal;
  phat: (e: SuKienAgent) => void;
}): Promise<KetQuaLuot | null> {
  const res = await fetch(`${API_ORIGIN}/api/v1/agent/turn`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${o.token}` },
    signal: o.signal,
    body: JSON.stringify({
      messages: o.messages,
      capabilities: o.capabilities,
      workspace: o.workspace,
    }),
  });

  if (!res.ok) {
    // 403 = chưa Pro. Phải phân biệt với 401 (phiên hết hạn) vì hai cái dẫn tới
    // hai màn hình khác hẳn nhau: một cái mời nâng cấp, một cái bắt đăng nhập.
    const than = await res.json().catch(() => ({})) as { message?: string; code?: string };
    o.phat({
      loai: 'loi',
      thongDiep: than.message ?? `Máy chủ trả về ${res.status}.`,
      ma: than.code ?? String(res.status),
    });
    return null;
  }
  if (!res.body) {
    o.phat({ loai: 'loi', thongDiep: 'Máy chủ không trả về dữ liệu.' });
    return null;
  }

  const doc = res.body.getReader();
  const giaiMa = new TextDecoder();
  let dem = '';
  const ra: KetQuaLuot = { append: [], stop: 'end', toolCalls: [], quota: null, costUsd: 0, daLuoc: 0 };
  let coLoi = false;

  for (;;) {
    const { done, value } = await doc.read();
    if (done) break;
    dem += giaiMa.decode(value, { stream: true });
    const dong = dem.split('\n');
    dem = dong.pop() ?? '';

    for (const d of dong) {
      if (!d.startsWith('data: ')) continue;
      let e: any;
      try { e = JSON.parse(d.slice(6)); } catch { continue; }

      switch (e.type) {
        case 'start':
          o.phat({ loai: 'batDau', model: e.model });
          break;
        case 'text':
          o.phat({ loai: 'chu', delta: e.delta });
          break;
        case 'server_tool':
          o.phat({ loai: 'tool', ten: e.name, tomTat: e.summary, vong: 'notes' });
          break;
        case 'tool_call':
          ra.toolCalls.push({ id: e.id, name: e.name, args: e.args ?? {} });
          break;
        case 'done':
          ra.append = e.append ?? [];
          ra.stop = e.stop;
          ra.quota = e.quota ?? null;
          ra.costUsd = e.usage?.costUsd ?? 0;
          ra.daLuoc = e.compact?.soDaLuoc ?? 0;
          break;
        case 'error':
          coLoi = true;
          o.phat({ loai: 'loi', thongDiep: e.error, ma: e.code });
          break;
      }
    }
  }

  return coLoi ? null : ra;
}
