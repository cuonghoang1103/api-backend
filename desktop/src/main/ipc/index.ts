/**
 * Đăng ký handler IPC, kèm xác thực bắt buộc.
 *
 * Không handler nào tự nhận payload thô. Tất cả đi qua `handle()` ở dưới, và
 * `handle()` từ chối đăng ký nếu kênh không có trong `INVOKE_CHANNELS`. Nghĩa
 * là quên khai báo schema = app chết ngay lúc khởi động, thay vì âm thầm phơi
 * ra một kênh không ai kiểm.
 */
import { ipcMain } from 'electron';
import type { IpcMainInvokeEvent } from 'electron';
import { z } from 'zod';
import { INVOKE_CHANNELS, type InvokeChannel } from '../../shared/ipc';
import { APP_ORIGIN, DEV_SERVER_URL, IS_DEV } from '../config';

/**
 * Chỉ nhận IPC từ chính renderer của app. Nếu một ngày nào đó app nhúng nội
 * dung bên ngoài (WebContentsView cho trang chưa port), thì frame đó KHÔNG
 * được phép gọi IPC — nó là trang web, không phải app.
 */
function isTrustedSender(event: IpcMainInvokeEvent): boolean {
  const url = event.senderFrame?.url ?? '';
  if (url.startsWith(APP_ORIGIN)) return true;
  if (IS_DEV && url.startsWith(DEV_SERVER_URL)) return true;
  return false;
}

type Handler<TInput> = (input: TInput, event: IpcMainInvokeEvent) => unknown;

/**
 * Sổ các kênh đã đăng ký. Tự ghi thay vì hỏi Electron, vì `ipcMain.handle()`
 * KHÔNG dùng cơ chế listener của EventEmitter — `ipcMain.listenerCount(ch)` vì
 * thế luôn trả 0 cho kênh invoke, và một phép kiểm dựa vào nó sẽ báo "thiếu
 * hết" trong khi thực tế đủ. Sổ này là nguồn duy nhất đáng tin.
 */
const registered = new Set<InvokeChannel>();

/**
 * `channel` bị ràng buộc vào `InvokeChannel`, nên gõ sai tên kênh là lỗi biên
 * dịch chứ không phải lỗi lúc chạy.
 */
export function handle<C extends InvokeChannel>(
  channel: C,
  handler: Handler<
    (typeof INVOKE_CHANNELS)[C] extends z.ZodTypeAny
      ? z.infer<(typeof INVOKE_CHANNELS)[C]>
      : undefined
  >,
): void {
  const schema = INVOKE_CHANNELS[channel] as z.ZodTypeAny | null;
  registered.add(channel);

  ipcMain.handle(channel, async (event, rawPayload: unknown) => {
    if (!isTrustedSender(event)) {
      throw new Error('IPC bị từ chối: frame gửi không được tin tưởng');
    }

    let input: unknown;
    if (schema === null) {
      // Kênh không nhận tham số. Nếu vẫn có payload gửi lên thì đó là dấu hiệu
      // sai lệch giữa hai phía — bỏ qua thay vì chuyển tiếp.
      input = undefined;
    } else {
      const result = schema.safeParse(rawPayload);
      if (!result.success) {
        // KHÔNG ném nguyên lỗi zod về renderer: nó chứa cả giá trị đã nhận,
        // mà giá trị đó có thể là token.
        console.error(`[ipc] payload sai ở kênh ${channel}:`, result.error.issues);
        throw new Error(`Dữ liệu gửi lên không hợp lệ cho ${channel}`);
      }
      input = result.data;
    }

    return handler(input as never, event);
  });
}

/**
 * Gom mọi nhóm handler. Gọi một lần sau khi app ready.
 */
export async function registerIpcHandlers(): Promise<void> {
  const [
    { registerAppHandlers },
    { registerSettingsHandlers },
    { registerAuthHandlers },
    { registerStorageHandlers },
    { registerUpdateHandlers },
    { registerNotesHandlers },
    { registerMusicHandlers },
    { registerAgentHandlers },
    { registerBrowserHandlers },
    { registerRobotHandlers },
  ] = await Promise.all([
    import('./app'),
    import('./settings'),
    import('./auth'),
    import('./storage'),
    import('./update'),
    import('./notes'),
    import('./music'),
    import('./agent'),
    import('./browser'),
    import('./robot'),
  ]);

  registerAppHandlers();
  registerSettingsHandlers();
  registerAuthHandlers();
  registerStorageHandlers();
  registerUpdateHandlers();
  registerNotesHandlers();
  registerMusicHandlers();
  registerAgentHandlers();
  registerBrowserHandlers();
  registerRobotHandlers();

  assertEveryChannelRegistered();
}

/**
 * Đối chiếu hợp đồng với thực tế: mọi kênh khai báo trong `INVOKE_CHANNELS`
 * phải có handler.
 *
 * Không có bước này thì một kênh khai báo mà quên đăng ký chỉ lộ ra khi người
 * dùng bấm đúng nút đó trên máy họ — lỗi câm, xa chỗ gây ra. Ở đây nó nổ ngay
 * lúc khởi động, trên máy người viết mã.
 */
function assertEveryChannelRegistered(): void {
  const declared = Object.keys(INVOKE_CHANNELS) as InvokeChannel[];
  const missing = declared.filter((channel) => !registered.has(channel));
  if (missing.length > 0) {
    throw new Error(`Kênh IPC đã khai báo nhưng chưa có handler: ${missing.join(', ')}`);
  }
}
