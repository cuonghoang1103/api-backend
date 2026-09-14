/**
 * ============================================================
 * CHỤP MÀN HÌNH — ngay trong app, cả ba nền tảng
 * ============================================================
 *
 * Người dùng 15/09/2026: "nó chưa chụp ảnh màn hình gửi vào đoạn chát được".
 *
 * Trước bản này, cách duy nhất đưa ảnh màn hình vào AI Code là chụp bằng công
 * cụ của hệ điều hành rồi DÁN — mà `onPaste` lại chỉ gắn trên ô nhập, nên dán
 * lúc con trỏ chưa ở trong ô thì không có gì xảy ra và cũng không có lời báo
 * nào. Hai thứ được vá cùng lúc: dán ở BẤT KỲ đâu trong khung chat, và một
 * nút chụp ngay trong app.
 *
 * ⚠️ `desktopCapturer` là đường DUY NHẤT chạy giống nhau trên cả ba nền tảng.
 * `screencapture` chỉ có ở macOS; Windows không có lệnh chụp dựng sẵn gọi được
 * từ dòng lệnh; Linux thì tuỳ máy có `grim`/`scrot`/`import`. Bảo agent "chạy
 * lệnh chụp hộ" là một lời khuyên chỉ đúng trên một phần ba số máy.
 *
 * ⚠️ macOS: CHƯA CẤP QUYỀN thì hàm này KHÔNG ném lỗi — nó trả về đủ danh sách
 * cửa sổ với tên thật, nhưng mọi tấm ảnh là nền trắng trơn. Nên phải đọc
 * `getMediaAccessStatus('screen')` riêng; không có nó thì người dùng nhìn thấy
 * một bảng toàn ô trắng và không đoán nổi vì sao.
 */
import { BrowserWindow, desktopCapturer, screen, shell, systemPreferences } from 'electron';
import { handle } from './index';

/** Ảnh nhỏ trong bảng chọn. Đủ nhìn ra cửa sổ nào, không tốn thời gian dựng. */
const ANH_NHO = { width: 320, height: 200 };

/**
 * Cỡ tối đa khi chụp thật.
 *
 * `desktopCapturer` co ảnh cho VỪA khung này và GIỮ tỉ lệ, nên đặt dư thì
 * không phóng to, chỉ là không bị cắt bớt. Lấy theo màn hình to nhất đang cắm
 * (nhân `scaleFactor` để màn Retina ra đúng số điểm ảnh vật lý), có sàn 1920
 * cho trường hợp `screen` trả về số lạ.
 */
function coToiDa(): { width: number; height: number } {
  let w = 1920;
  let h = 1080;
  for (const m of screen.getAllDisplays()) {
    const ti = m.scaleFactor || 1;
    w = Math.max(w, Math.round(m.size.width * ti));
    h = Math.max(h, Math.round(m.size.height * ti));
  }
  // Trần cứng: một bức 8K là ~30MB PNG, đi qua IPC rồi qua base64 là gấp rưỡi
  // nữa. Ảnh gửi cho model đằng nào cũng bị co về 1568px cạnh dài.
  return { width: Math.min(w, 5120), height: Math.min(h, 2880) };
}

/** macOS mới có khái niệm quyền này; Windows/Linux luôn cho chụp. */
function docQuyen(): 'granted' | 'denied' | 'restricted' | 'not-determined' | 'khong-ap-dung' {
  if (process.platform !== 'darwin') return 'khong-ap-dung';
  try {
    const t = systemPreferences.getMediaAccessStatus('screen');
    // Electron còn trả `'unknown'`. Gộp nó vào `'not-determined'`: cả hai đều
    // nghĩa là "chưa chắc có quyền", và giao diện chỉ cần phân biệt CÓ với
    // CHƯA CHẮC để quyết định có hiện lời nhắc cấp quyền hay không.
    return t === 'unknown' ? 'not-determined' : t;
  } catch {
    return 'not-determined';
  }
}

export function registerManHinhHandlers(): void {
  handle('manHinh:nguon', async () => {
    const ds = await desktopCapturer.getSources({
      types: ['screen', 'window'],
      thumbnailSize: ANH_NHO,
      fetchWindowIcons: false,
    });
    return {
      quyen: docQuyen(),
      nguon: ds
        // Cửa sổ không có tên thường là lớp phủ của hệ thống — chọn vào đó chỉ
        // ra một tấm trong suốt.
        .filter((n) => n.name.trim().length > 0)
        .map((n) => ({
          id: n.id,
          ten: n.name,
          loai: n.id.startsWith('screen:') ? ('man' as const) : ('cuaSo' as const),
          anhNho: n.thumbnail.isEmpty() ? '' : n.thumbnail.toDataURL(),
        })),
    };
  });

  handle('manHinh:chup', async ({ id }, event) => {
    /*
     * GIẤU CỬA SỔ APP TRƯỚC KHI CHỤP.
     *
     * Không có bước này thì chụp "Toàn màn hình" luôn ra tấm ảnh có đúng cái
     * bảng chọn đang mở che giữa — thứ người dùng vừa bấm để chụp thứ KHÁC.
     *
     * Dùng `setOpacity(0)` chứ không `hide()`: `hide()` đổi thứ tự cửa sổ và
     * lấy mất tiêu điểm, nên khi hiện lại app có thể nhảy lên trước cửa sổ mà
     * người dùng đang muốn chụp. Đổi độ mờ thì trình quản lý cửa sổ không xáo
     * gì cả.
     *
     * `finally` là bắt buộc: chụp hỏng mà không trả độ mờ về 1 thì app biến
     * mất khỏi màn hình và người dùng không có cách nào gọi nó lại.
     */
    const cua = BrowserWindow.fromWebContents(event.sender);
    const anMinh = !!cua && !cua.isDestroyed();
    if (anMinh) cua.setOpacity(0);
    let ds;
    try {
      // Đợi trình quản lý cửa sổ vẽ xong khung hình KHÔNG có app. Thiếu nhịp
      // chờ này thì `desktopCapturer` vẫn bắt được khung cũ.
      await new Promise((r) => setTimeout(r, 250));
      ds = await desktopCapturer.getSources({
        types: ['screen', 'window'],
        thumbnailSize: coToiDa(),
        fetchWindowIcons: false,
      });
    } finally {
      if (anMinh && !cua.isDestroyed()) cua.setOpacity(1);
    }
    const n = ds.find((x) => x.id === id);
    // Cửa sổ bị đóng trong lúc người dùng còn đang chọn. Nói rõ, đừng trả ảnh
    // của một cửa sổ khác.
    if (!n) return { ok: false, loi: 'Không còn thấy màn hình/cửa sổ đó nữa — có thể nó vừa bị đóng.' };
    if (n.thumbnail.isEmpty()) {
      return {
        ok: false,
        loi: docQuyen() === 'granted'
          ? 'Chụp ra ảnh rỗng.'
          : 'macOS chưa cho app quyền Ghi màn hình, nên ảnh chụp ra trống.',
      };
    }
    const co = n.thumbnail.getSize();
    return { ok: true, anh: n.thumbnail.toDataURL(), rong: co.width, cao: co.height };
  });

  handle('manHinh:moCaiDatQuyen', async () => {
    if (process.platform !== 'darwin') return { ok: false };
    await shell.openExternal(
      'x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture',
    );
    return { ok: true };
  });
}
