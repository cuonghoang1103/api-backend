/**
 * `noiDangChay()` phải trả lời ĐÚNG TRÊN CẢ BA NỀN TẢNG.
 *
 * ─── Vì sao tệp này tồn tại ───
 * Bản trước tính đường dẫn theo đúng hình dạng bó ứng dụng của macOS rồi hỏi
 * `startsWith('/Applications/')`. Trên Linux và Windows câu đó LUÔN sai, nên
 * giao diện bật dải cảnh báo đỏ cho MỌI người dùng hai nền tảng đó — với nội
 * dung sai sự thật ("sẽ không bao giờ nhận được bản mới", trong khi tự cập
 * nhật ở đó chạy đầy đủ) và hướng dẫn vô nghĩa (thư mục Applications).
 *
 * Không phép kiểm nào bắt được vì KHÔNG CÓ phép kiểm nào cho hàm này, và máy
 * phát triển là macOS — nền tảng duy nhất nó đúng. Người dùng Linux báo về
 * mới lộ (24/08/2026).
 *
 * ⚠️ Giả lập `process.platform` chứ không chỉ đọc mã nguồn: mục đích là kiểm
 * HÀNH VI ở nền tảng mà máy này không chạy được.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let exeGia = '/Applications/CuongThai.app/Contents/MacOS/CuongThai';
vi.mock('electron', () => ({
  app: { getPath: (ten: string) => (ten === 'exe' ? exeGia : '/tmp') },
  BrowserWindow: { getAllWindows: () => [] },
  shell: {},
}));
vi.mock('../robotTin', () => ({ baoBanMoi: () => {} }));
vi.mock('./index', () => ({ handle: () => {} }));

const { noiDangChay } = await import('./update');

const nenTangGoc = process.platform;
const datNenTang = (v: string) => Object.defineProperty(process, 'platform', { value: v, configurable: true });
beforeEach(() => { vi.restoreAllMocks(); });
afterEach(() => { datNenTang(nenTangGoc); });

describe('noiDangChay theo nền tảng', () => {
  it('macOS: GIỮ NGUYÊN hành vi cũ — bó ứng dụng trong /Applications', () => {
    datNenTang('darwin');
    exeGia = '/Applications/CuongThai.app/Contents/MacOS/CuongThai';
    const n = noiDangChay();
    expect(n.duong).toBe('/Applications/CuongThai.app');
    expect(n.daCaiDung, 'bản trong Applications phải được coi là đã cài đúng').toBe(true);
  });

  it('macOS: bản dựng thử ngoài /Applications VẪN bị báo động', () => {
    datNenTang('darwin');
    exeGia = '/Users/x/api-backend/desktop/release/mac/CuongThai.app/Contents/MacOS/CuongThai';
    expect(noiDangChay().daCaiDung, 'đây đúng là cái bẫy mà cảnh báo sinh ra để bắt').toBe(false);
  });

  /*
   * Chốt của cả tệp. AppImage tự mount vào `/tmp/.mount_XXXXXX/`, nên phép lùi
   * hai cấp của macOS ra đúng `"/"` — và `"/"` không bao giờ bắt đầu bằng
   * `/Applications/`. Đó chính xác là chuỗi người dùng Fedora nhìn thấy.
   */
  it('Linux AppImage: KHÔNG báo động, và đường dẫn KHÔNG được ra "/"', () => {
    datNenTang('linux');
    exeGia = '/tmp/.mount_CuongTabc123/cuongthai-desktop';
    const n = noiDangChay();
    expect(n.daCaiDung, 'người dùng Linux bị báo nhầm là đang chạy bản dựng thử').toBe(true);
    expect(n.duong, 'lùi 2 cấp kiểu macOS ra "/" — vô nghĩa trên Linux').not.toBe('/');
  });

  it('Linux: dùng biến APPIMAGE khi có, vì thư mục mount là tạm', () => {
    datNenTang('linux');
    exeGia = '/tmp/.mount_CuongTabc123/cuongthai-desktop';
    vi.stubEnv('APPIMAGE', '/home/ai/Tải về/CuongThai-0.5.64.AppImage');
    expect(noiDangChay().duong).toBe('/home/ai/Tải về/CuongThai-0.5.64.AppImage');
    vi.unstubAllEnvs();
  });

  it('Windows: thư mục chứa file chạy CHÍNH LÀ thư mục cài, không lùi cấp nào', () => {
    datNenTang('win32');
    exeGia = 'C:\\Users\\ai\\AppData\\Local\\Programs\\cuongthai-desktop\\CuongThai.exe';
    const n = noiDangChay();
    expect(n.daCaiDung).toBe(true);
    expect(n.duong, 'lùi 2 cấp kiểu macOS sẽ ra …\\Local, sai thư mục cài')
      .not.toContain('Programs\\cuongthai-desktop\\CuongThai.exe');
  });
});
