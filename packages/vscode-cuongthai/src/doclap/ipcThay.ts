/**
 * Thay `desktop/src/main/ipc/index.ts` trong chế độ độc lập.
 *
 * Bản thật vừa đăng ký `ipcMain.handle` vừa kéo theo MỌI module IPC của app
 * (nhạc, game, robot, terminal…) — gói vào extension là vài MB vô ích và vài
 * chục chỗ gọi Electron không có thật. Ở đây chỉ giữ đúng phần lõi: sổ kênh +
 * kiểm schema zod (CÙNG `INVOKE_CHANNELS` của app) + gọi handler.
 */
import { INVOKE_CHANNELS, type InvokeChannel } from '../../../../desktop/src/shared/ipc';

type XuLy = (raw: unknown, event: unknown) => unknown;
const so = new Map<string, XuLy>();

export function handle(channel: InvokeChannel, handler: (input: never, event: never) => unknown): void {
  const schema = (INVOKE_CHANNELS as Record<string, { safeParse: (x: unknown) => { success: boolean; data?: unknown } } | null>)[channel];
  so.set(channel, (raw, event) => {
    let input: unknown;
    if (!schema) input = undefined;
    else {
      const r = schema.safeParse(raw);
      if (!r.success) throw new Error(`Dữ liệu gửi lên không hợp lệ cho ${channel}`);
      input = r.data;
    }
    return handler(input as never, event as never);
  });
}

export function goiKenhNoiBo(channel: string, raw: unknown, event: unknown): unknown {
  const f = so.get(channel);
  if (!f) throw new Error(`Kênh ${channel} chưa đăng ký.`);
  return f(raw, event);
}

export function coKenh(channel: string): boolean { return so.has(channel); }
