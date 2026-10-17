/**
 * Cầu nói chuyện webview ⇄ extension.
 *
 * `gui()` — báo một việc, không chờ. `goi()` — hỏi và CHỜ trả lời (giống
 * `ipcRenderer.invoke` của app): extension chuyển kênh `agent:*` cho AI Code
 * (qua app hoặc lõi độc lập) và các kênh `vsc:*` cho việc riêng của VS Code.
 */
declare function acquireVsCodeApi(): { postMessage(m: unknown): void; getState(): unknown; setState(s: unknown): void };
export const vsc = acquireVsCodeApi();

export const gui = (m: unknown): void => vsc.postMessage(m);

let soGoi = 0;
const dangCho = new Map<number, { ok: (v: unknown) => void; hong: (e: Error) => void }>();

export function goi<T = unknown>(kenh: string, duLieu?: unknown): Promise<T> {
  const id = ++soGoi;
  return new Promise<T>((ok, hong) => {
    dangCho.set(id, { ok: ok as (v: unknown) => void, hong });
    gui({ loai: 'rpc', id, kenh, duLieu });
  });
}

/** Gọi từ bộ nghe tin nhắn chính khi nhận `rpcKq`. */
export function nhanKetQua(m: { id: number; ok: boolean; kq?: unknown; loi?: string }): void {
  const c = dangCho.get(m.id);
  if (!c) return;
  dangCho.delete(m.id);
  if (m.ok) c.ok(m.kq);
  else c.hong(new Error(m.loi ?? 'Lỗi không rõ.'));
}
