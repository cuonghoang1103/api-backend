/**
 * Gọi tuyến SSE của phòng bảo vệ (`…/du-an/bao-ve-stream`, `…/bao-ve/:id/tra-loi-stream`).
 * Khung sự kiện: {type:'delta',text}… {type:'grading'} {type:'done',data} | {type:'error',error,code}.
 *
 * ⚠️ Đường dẫn TUYỆT ĐỐI dựng từ `baseURL` của axios — cùng lý do `useGiaSuBai`/`useHoiCauLuyen`: app desktop dùng lại
 * component ở origin `app://`, `fetch('/api/v1/…')` tương đối sẽ bay vào hư không.
 * Lỗi CÓ CHỦ Ý từ máy chủ ⇒ `tuMayChu = true` (nơi gọi KHÔNG lùi sang JSON — lùi chỉ nhận lại đúng lỗi đó).
 */
import api from '@/lib/api';
import type { PhienBaoVe } from '@/lib/duAn';

function layToken(): string {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.match(/(?:^|;)\s*backend_token=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : '';
}

export class LoiSse extends Error {
  tuMayChu: boolean;
  code: string | null;
  constructor(msg: string, tuMayChu: boolean, code: string | null = null) {
    super(msg);
    this.tuMayChu = tuMayChu;
    this.code = code;
  }
}

export async function goiSse(
  duongDan: string,
  body: unknown,
  cb: { onDelta?: (text: string) => void; onDangCham?: () => void } = {},
): Promise<PhienBaoVe> {
  const goc = String(api.defaults.baseURL ?? '').replace(/\/api\/v1\/?$/, '');
  const tok = layToken();
  const res = await fetch(`${goc}/api/v1${duongDan}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(tok ? { Authorization: `Bearer ${tok}` } : {}) },
    body: JSON.stringify(body),
  });
  if (!res.ok || !res.body) throw new LoiSse(`HTTP ${res.status}`, false);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const frames = buffer.split('\n\n');
    buffer = frames.pop() || '';
    for (const frame of frames) {
      for (const line of frame.split('\n')) {
        if (!line.startsWith('data:')) continue;
        const raw = line.slice(5).trim();
        if (!raw) continue;
        let evt: { type?: string; text?: string; data?: PhienBaoVe; error?: string; code?: string | null };
        try { evt = JSON.parse(raw); } catch { continue; }
        if (evt.type === 'delta' && evt.text) cb.onDelta?.(evt.text);
        else if (evt.type === 'grading') cb.onDangCham?.();
        else if (evt.type === 'done' && evt.data) return evt.data;
        else if (evt.type === 'error') throw new LoiSse(evt.error || 'Hội đồng AI chưa trả lời được.', true, evt.code ?? null);
      }
    }
  }
  throw new LoiSse('stream ended without result', false);
}
