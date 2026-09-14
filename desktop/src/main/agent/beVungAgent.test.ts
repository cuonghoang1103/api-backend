/**
 * Khoá ba chỗ làm agent "bỏ dở việc" và "không làm nổi việc đơn giản".
 * Người dùng báo 15/09/2026.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { phanLoaiLenh, TRAN_GIAY_TOI_DA } from './lenh';
import { fileBiCam, laFileEnv, moTrongNguc } from './jail';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const loop = readFileSync(new URL('./loop.ts', import.meta.url), 'utf8');

describe('cổng AI nghẽn thì THỬ LẠI, không giết lượt', () => {
  it('429 và 529 nằm trong nhóm đáng thử lại', () => {
    const than = loop.slice(loop.indexOf('const MA_DANG_THU_LAI'), loop.indexOf(']);', loop.indexOf('const MA_DANG_THU_LAI')));
    // Đo thật 14/09/2026: rambo trả đúng hai mã này suốt 45-60 phút. Thiếu
    // chúng thì mọi lượt agent đang chạy chết ngay, mất sạch bước đã đi.
    for (const ma of ['429', '529', '500', '502', '503', '504']) {
      expect(than, `mã ${ma} không được thử lại ⇒ lượt chết giữa chừng`).toContain(`'${ma}'`);
    }
  });

  it('thử lại NHIỀU lần và CÓ CHỜ, không phải một lần tức thì', () => {
    expect(loop, 'không có bảng thời gian chờ ⇒ thử lại ngay lập tức, chắc chắn trượt tiếp')
      .toMatch(/CHO_THU_LAI_MS\s*=\s*\[/);
    const mang = loop.slice(loop.indexOf('CHO_THU_LAI_MS = ['), loop.indexOf(']', loop.indexOf('CHO_THU_LAI_MS = [')));
    expect((mang.match(/\d+_?\d*/g) ?? []).length, 'phải có ít nhất 3 lần thử lại').toBeGreaterThanOrEqual(3);
    // Huỷ giữa lúc chờ phải thoát ngay, đừng ngủ hết rồi mới biết.
    expect(loop).toMatch(/signal\.addEventListener\('abort'/);
  });
});

describe('việc đơn giản phải làm được', () => {
  it('TẠO MỚI .env.test được, nhưng ĐỌC .env vẫn cấm', async () => {
    const goc = await mkdtemp(join(tmpdir(), 'nguc-'));
    // Đọc: vẫn chặn — đây là chốt chống rò rỉ, không được nới.
    await expect(moTrongNguc(goc, '.env')).rejects.toThrow();
    await expect(moTrongNguc(goc, '.env.test')).rejects.toThrow();
    // Tạo mới: cho phép. Nội dung đi từ model XUỐNG đĩa, không rò gì cả.
    await expect(moTrongNguc(goc, '.env.test', { choTaoEnv: true })).resolves.toContain('.env.test');
    // Nhưng KHÔNG nới cho khoá riêng tư.
    await expect(moTrongNguc(goc, 'id_rsa', { choTaoEnv: true })).rejects.toThrow();
    await expect(moTrongNguc(goc, 'server.pem', { choTaoEnv: true })).rejects.toThrow();
    expect(laFileEnv('.env.test')).toBe(true);
    expect(laFileEnv('id_rsa')).toBe(false);
    expect(fileBiCam('.env')).toBe(true);   // danh sách cấm ĐỌC không đổi
  });
});

describe('làm được app iOS / Android', () => {
  it('lệnh di động KHÔNG bị xếp là nguy hiểm', () => {
    for (const l of ['xcrun simctl list devices', 'xcodebuild -scheme App test',
                     'adb devices', 'emulator -avd Pixel_7', 'flutter run',
                     'pod install', './gradlew assembleDebug']) {
      expect(phanLoaiLenh(l).muc, `"${l}" bị chặn ⇒ không phát triển di động được`).toBe('thuong');
    }
  });

  it('trần thời gian đủ cho một lượt build di động', () => {
    // `xcodebuild test` lần đầu và Gradle trên máy lạnh thường vượt 10 phút.
    // Vượt trần thì agent thấy "lệnh hỏng" chứ không thấy "chưa xong".
    expect(TRAN_GIAY_TOI_DA, 'trần dưới 15 phút ⇒ build iOS/Android bị cắt giữa chừng')
      .toBeGreaterThanOrEqual(900);
  });
});
