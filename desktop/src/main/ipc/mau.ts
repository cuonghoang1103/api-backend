/**
 * Lấy nội dung THẬT của một mẫu AI từ repo gốc trên GitHub.
 *
 * ─── Vì sao phải đi qua tiến trình chính ───
 * `connect-src` của app chỉ có `app://cuongthai`, api và media của chính web
 * (xem `ALLOWED_CONNECT_ORIGINS`). Renderer gọi thẳng `raw.githubusercontent.com`
 * sẽ bị CSP chặn, và thông báo duy nhất là "Failed to fetch" — không một chữ
 * nào nhắc tới CSP. Đã mất một buổi vì đúng kiểu lỗi này với texture của sân
 * chơi 3D, nên lần này đi đường vòng ngay từ đầu.
 *
 * Nới `connect-src` thêm một host là cách còn lại. KHÔNG chọn: nó mở cho MỌI
 * mã trong renderer gọi ra GitHub, còn ở đây thì chỉ đúng một hình dạng đường
 * dẫn đi được.
 *
 * ─── Hỏng thì trả `null`, không ném ───
 * GitHub sập, đổi tên tệp, hay máy mất mạng — trang vẫn phải mở được, chỉ mất
 * phần nội dung. Danh sách 1.877 mẫu nằm sẵn trong app nên vẫn tra cứu và chép
 * lệnh cài được bình thường khi ngoại tuyến.
 */
import { net } from 'electron';
import { handle } from './index';

const GOC = 'https://raw.githubusercontent.com/davila7/claude-code-templates/main';
/** Mọi mẫu đều nằm dưới đúng thư mục này trong repo gốc. */
const THU_MUC = 'cli-tool/components';

/** Vài SKILL.md kèm cả tài liệu tham chiếu nên khá dài. */
const TRAN_BYTE = 400_000;
const TRAN_MS = 8_000;

/**
 * Chặn đường dẫn vượt ra khỏi thư mục component.
 *
 * `duong` tới từ renderer. Nó vốn lấy từ dữ liệu đóng gói sẵn nên lành, nhưng
 * một kênh IPC thì phải tự đứng vững — không dựa vào việc phía kia cư xử đúng.
 * `..` hay `//` là đủ để biến lời gọi này thành "tải bất cứ tệp nào của bất cứ
 * repo nào".
 */
function duongAnToan(duong: string): boolean {
  if (!duong || duong.length > 300) return false;
  if (duong.includes('..') || duong.startsWith('/') || duong.includes('//')) return false;
  return /^[\w./@-]+$/.test(duong);
}

export interface NoiDungMau {
  text: string;
  /** Đường xem trên GitHub, để nút "Mở trên GitHub" luôn đúng tệp đang xem. */
  url: string;
  catBot: boolean;
}

async function layNoiDung(duong: string): Promise<NoiDungMau | null> {
  if (!duongAnToan(duong)) return null;

  const url = `${GOC}/${THU_MUC}/${duong}`;
  try {
    const res = await net.fetch(url, {
      headers: { 'User-Agent': 'cuongthai-desktop/1.0' },
      signal: AbortSignal.timeout(TRAN_MS),
    });
    if (!res.ok) return null;

    let text = await res.text();
    const catBot = text.length > TRAN_BYTE;
    if (catBot) text = text.slice(0, TRAN_BYTE);

    return {
      text,
      url: `https://github.com/davila7/claude-code-templates/blob/main/${THU_MUC}/${duong}`,
      catBot,
    };
  } catch {
    return null;
  }
}

export function registerMauHandlers(): void {
  handle('mau:noiDung', ({ duong }) => layNoiDung(duong));
}
