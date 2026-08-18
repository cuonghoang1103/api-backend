/**
 * Chặn một lỗi CÂM: điều hướng tới trang ĐANG MỞ thì không có lần gắn thứ
 * hai, nên một effect `[]` sẽ không bao giờ đọc lại tham số.
 *
 * Sinh ra từ lỗi thật 19/08/2026: người dùng bấm vào khung chữ của robot để
 * "đọc đầy đủ trong AI Chat". Đang ở sẵn trang /chat ⇒ `setRoute('/chat')`
 * không đổi gì ⇒ React không gắn lại ChatMode ⇒ effect đọc `phien` không
 * chạy ⇒ bấm xong KHÔNG CÓ GÌ XẢY RA. Không lỗi, không log, không gợi ý.
 *
 * `tsc` không thấy được điều này (dep array là mảng hợp lệ), và không có
 * jsdom trong dự án để dựng React. Nên quét mã nguồn — cùng cách
 * `csp.test.ts` làm, và vì cùng một lý do: cái giá của việc bỏ sót là người
 * dùng phát hiện thay ta.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const goc = join(import.meta.dirname, '..');

describe('điều hướng mang tham số', () => {
  it('effect đọc `phien` của ChatMode KHÔNG được dùng dep rỗng', () => {
    const src = readFileSync(join(goc, 'renderer/features/chat/ChatMode.tsx'), 'utf8');
    const i = src.indexOf('layThamSo(\'phien\')');
    expect(i, 'không còn chỗ nào đọc tham số `phien`').toBeGreaterThan(-1);
    // Đuôi của effect nằm ngay sau lời gọi; `[]` ở đó nghĩa là chỉ chạy lúc gắn.
    const duoi = src.slice(i, i + 240);
    expect(duoi, 'effect đọc `phien` đang dùng `[]` — bấm khi ĐANG ở /chat sẽ im lặng')
      .not.toMatch(/\}, \[\]\);/);
    expect(duoi, 'effect phải theo dõi `lanDieuHuong`').toMatch(/lanDieuHuong/);
  });

  it('chỗ nào ĐẶT tham số thì chỗ đó phải tăng `lanDieuHuong`', () => {
    /* Bất biến hẹp có chủ đích: KHÔNG phải mọi `setRoute` đều cần tăng bộ
       đếm — khôi phục `lastRoute` lúc khởi động thì trang gắn mới, effect
       chạy sẵn. Chỉ những chỗ ĐẶT tham số mới cần, vì chỉ chúng mới có thể
       trỏ tới trang đang mở. (`viTri.current = ''` trong `layThamSo` là dọn
       sau khi đọc, không phải đặt — nên bị loại bằng lookahead.) */
    const src = readFileSync(join(goc, 'renderer/app-state.tsx'), 'utf8');
    const noiDat = [...src.matchAll(/viTri\.current = (?!'')/g)];
    expect(noiDat.length, 'không còn chỗ nào đặt tham số điều hướng').toBeGreaterThanOrEqual(2);
    for (const m of noiDat) {
      const sau = src.slice(m.index, m.index + 260);
      expect(sau, `đặt tham số ở vị trí ${m.index} mà không tăng bộ đếm — trang đang mở sẽ không đọc lại`)
        .toMatch(/datLanDieuHuong\(/);
    }
  });

  it('`navigate` nhận được tham số', () => {
    const src = readFileSync(join(goc, 'renderer/app-state.tsx'), 'utf8');
    expect(src).toMatch(/navigate: \(path: string, thamSo\?: string\) => void/);
  });
});
