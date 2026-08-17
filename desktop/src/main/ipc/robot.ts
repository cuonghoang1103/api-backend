/**
 * IPC của cửa sổ robot nổi.
 *
 * Mỏng có chủ ý — mọi quyết định về cửa sổ nằm ở `main/robotNoi.ts`.
 */
import { doiKichThuoc, moTrangChinh } from '../robotNoi';
import { baoNhac } from '../robotTin';
import { API_ORIGIN } from '../config';
import { readStoredSession } from './auth';
import { handle } from './index';

export function registerRobotHandlers(): void {
  handle('robot:doiKichThuoc', ({ rong }) => doiKichThuoc(rong));

  handle('robot:baoNhac', ({ ten }) => baoNhac(ten));

  handle('robot:moChinh', ({ duongDan }) => {
    // Chỉ nhận đường dẫn TRONG app, không nhận URL. Một chuỗi `https://…` lọt
    // vào đây sẽ được renderer chính coi là đích điều hướng.
    const sach = duongDan.startsWith('/') && !duongDan.startsWith('//') ? duongDan : '/chat';
    moTrangChinh(sach);
  });

  /**
   * Hỏi nhanh từ khung chat mini.
   *
   * KHÔNG chảy chữ: khung này chỉ vài dòng và người dùng đang làm việc khác,
   * nên một câu trả lời hoàn chỉnh xuất hiện một lần đọc dễ hơn là chữ nhảy
   * dần trong một ô nhỏ ở góc màn hình.
   *
   * Gọi từ MAIN chứ không từ cửa sổ robot: renderer của robot chạy ở origin
   * `app://` và mọi lời gọi từ đó phải qua CORS, trong khi main thì không.
   */
  handle('robot:hoi', async ({ chu }) => {
    const phien = readStoredSession();
    if (!phien) return { chu: 'Chưa đăng nhập. Mở app chính để đăng nhập trước.' };

    try {
      const res = await fetch(`${API_ORIGIN}/api/v1/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${phien.sessionToken}` },
        body: JSON.stringify({ message: chu }),
      });
      if (!res.ok || !res.body) return { chu: `Máy chủ trả về ${res.status}.` };

      // Đọc hết SSE rồi mới trả — khung mini không chảy chữ.
      const giaiMa = new TextDecoder();
      let dem = '';
      let ra = '';
      for await (const mau of res.body as unknown as AsyncIterable<Uint8Array>) {
        dem += giaiMa.decode(mau, { stream: true });
        const dong = dem.split('\n');
        dem = dong.pop() ?? '';
        for (const d of dong) {
          if (!d.startsWith('data: ')) continue;
          try {
            const e = JSON.parse(d.slice(6)) as { type?: string; text?: string; error?: string };
            if (e.type === 'chunk' && e.text) ra += e.text;
            if (e.type === 'error' && e.error) ra += `\n[lỗi] ${e.error}`;
          } catch { /* khung lạ — bỏ qua, app cũ không được vỡ vì khung mới */ }
        }
      }
      return { chu: ra.trim() || '(không có nội dung)' };
    } catch (err) {
      return { chu: `Không gọi được máy chủ: ${(err as Error).message}` };
    }
  });
}
