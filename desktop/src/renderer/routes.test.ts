/**
 * Đối chiếu bảng điều hướng với cây trang THẬT của website.
 *
 * Vì sao cần: chú thích đầu `routes.ts` khẳng định "mọi route ở đây đều tồn tại
 * thật trên cuongthai.com". Một khẳng định trong chú thích thì đúng đúng một
 * lần — lúc viết. Sau đó website đổi tên trang, xoá trang, gộp trang, và mục
 * sidebar lặng lẽ trở thành đường cụt: người dùng bấm vào, nhận màn "mở trên
 * web", bấm tiếp, và rơi vào trang 404.
 *
 * Test này biến khẳng định đó thành thứ máy kiểm được sau mỗi lần đổi.
 *
 * Nó đọc thẳng thư mục `frontend/src/app` nên chỉ chạy được trong repo này —
 * đó là chủ đích: đây là test về sự khớp giữa hai phần của CÙNG một dự án.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { GROUP_LABELS, GROUP_ORDER, ROUTES } from './routes';

const here = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR = path.resolve(here, '../../../frontend/src/app');

/**
 * Trang Next tồn tại nếu có `<route>/page.tsx`.
 *
 * Phải xét cả "route group" — thư mục đặt trong ngoặc như `(auth)` KHÔNG xuất
 * hiện trong URL. Bỏ qua chi tiết này thì `/register` bị báo là không tồn tại
 * trong khi nó nằm ở `(auth)/register` và chạy hoàn toàn bình thường.
 */
function pageExists(routePath: string): boolean {
  const segments = routePath.replace(/^\//, '').split('/');

  const direct = path.join(APP_DIR, ...segments, 'page.tsx');
  if (fs.existsSync(direct)) return true;

  // Thử với một lớp route group bọc ngoài: (nhom)/<đường dẫn>/page.tsx
  const groups = fs
    .readdirSync(APP_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('('))
    .map((entry) => entry.name);

  return groups.some((group) =>
    fs.existsSync(path.join(APP_DIR, group, ...segments, 'page.tsx')),
  );
}

describe('bảng điều hướng khớp với website', () => {
  it('thư mục app của frontend tìm thấy được', () => {
    // Nếu phép kiểm này hỏng thì mọi phép kiểm dưới đây vô nghĩa — chúng sẽ
    // "đạt" vì không tìm thấy gì để so. Kiểm bộ kiểm trước khi tin nó.
    expect(fs.existsSync(APP_DIR), `không thấy ${APP_DIR}`).toBe(true);
  });

  it.each(ROUTES.map((route) => [route.path, route.label] as const))(
    'trang %s (%s) tồn tại trên web',
    (routePath) => {
      expect(pageExists(routePath), `${routePath} không có page.tsx`).toBe(true);
    },
  );

  it('không có đường dẫn trùng lặp', () => {
    const paths = ROUTES.map((route) => route.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('mọi nhóm đều có nhãn và nằm trong thứ tự hiển thị', () => {
    for (const route of ROUTES) {
      expect(GROUP_LABELS[route.group]).toBeTruthy();
      expect(GROUP_ORDER).toContain(route.group);
    }
  });

  it('không nhóm nào bị rỗng — nhóm rỗng để lại một tiêu đề trơ trọi', () => {
    for (const group of GROUP_ORDER) {
      expect(
        ROUTES.filter((route) => route.group === group).length,
        `nhóm "${group}" không có mục nào`,
      ).toBeGreaterThan(0);
    }
  });

  it('KHÔNG đưa vào trang thương mại đang tắt bằng cờ', () => {
    // `/shop`, `/cart`, `/checkout`, `/my-orders` có page.tsx thật, nhưng
    // middleware của web chuyển hướng chúng về trang chủ khi cờ tắt. Đưa vào
    // sidebar là dẫn người dùng vào ngõ cụt — và test "trang tồn tại" ở trên
    // KHÔNG bắt được, vì file vẫn còn đó.
    const disabled = ['/shop', '/cart', '/checkout', '/my-orders'];
    const paths = ROUTES.map((route) => route.path);
    for (const path of disabled) {
      expect(paths, `${path} đang bị tắt bằng cờ`).not.toContain(path);
    }
  });

  it('KHÔNG đưa vào khu quản trị', () => {
    for (const route of ROUTES) {
      expect(route.path.startsWith('/admin')).toBe(false);
    }
  });
});
