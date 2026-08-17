/**
 * Tên file cài phải khớp CHÍNH XÁC `artifactName` của electron-builder
 * (`'${productName}-${version}-${arch}.${ext}'` trong electron-builder.yml).
 *
 * Sai một ký tự thì lời gọi tải trả 404 và người dùng thấy "Không tải được bản
 * cài" mà không ai hiểu vì sao — trong khi bản phát hành hoàn toàn bình thường.
 * Đây đúng là loại lỗi trôi âm thầm khi ai đó đổi `artifactName`.
 */
import { describe, it, expect, vi } from 'vitest';

vi.mock('electron', () => ({
  app: { isPackaged: false, getPath: () => '/tmp', on: () => {} },
  BrowserWindow: { getAllWindows: () => [] },
  shell: { showItemInFolder: () => {} },
}));
vi.mock('../config', () => ({ IS_DEV: true }));
vi.mock('./index', () => ({ handle: () => {} }));

const { tenFileCai, tenFileZip } = await import('./update');

describe('tên file cài macOS', () => {
  it('khớp asset thật của bản phát hành', () => {
    expect(tenFileCai('0.5.3', 'arm64')).toBe('CuongThai-0.5.3-arm64.dmg');
    expect(tenFileCai('0.5.3', 'x64')).toBe('CuongThai-0.5.3-x64.dmg');
  });

  it('tên .zip: x64 KHÔNG có hậu tố kiến trúc', () => {
    // electron-builder đặt `CuongThai-<v>-arm64-mac.zip` nhưng
    // `CuongThai-<v>-mac.zip` cho x64 — không phải lỗi đánh máy. Đoán theo
    // khuôn của arm64 là 404, và đường tự cập nhật chết ở bước tải.
    // Xác nhận bằng lời gọi thật tới bản 0.5.5: cả hai trả 206.
    expect(tenFileZip('0.5.5', 'arm64')).toBe('CuongThai-0.5.5-arm64-mac.zip');
    expect(tenFileZip('0.5.5', 'x64')).toBe('CuongThai-0.5.5-mac.zip');
  });

  it('kiến trúc lạ rơi về arm64 chứ không dựng tên không tồn tại', () => {
    // Không có asset `-ia32` hay `-armv7l` nào cho macOS; đoán bừa một cái tên
    // là bảo đảm 404.
    expect(tenFileCai('1.2.3', 'ia32')).toBe('CuongThai-1.2.3-arm64.dmg');
  });
});
