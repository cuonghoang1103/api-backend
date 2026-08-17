/**
 * Build renderer.
 *
 * `base: './'` — bắt buộc. Renderer được phục vụ từ `app://cuongthai/`, và
 * đường dẫn tuyệt đối kiểu `/assets/…` sẽ được phân giải thành
 * `app://cuongthai/assets/…` chỉ khi host khớp; dùng đường dẫn tương đối thì
 * đúng trong cả dev (http://localhost) lẫn bản đóng gói mà không cần rẽ nhánh.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  root: path.resolve(__dirname, 'src/renderer'),
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@renderer': path.resolve(__dirname, 'src/renderer'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      /**
       * `@` trỏ vào cây nguồn của WEB.
       *
       * App desktop dùng lại nguyên các component Notes của web (22 file, hơn
       * 6.000 dòng: slash menu, database, bình luận, lịch sử phiên bản…). Viết
       * lại chúng nghĩa là nuôi hai bản song song mãi mãi và mỗi tính năng mới
       * phải làm hai lần.
       *
       * Chúng import theo `@/...`, nên alias này là thứ duy nhất cần để chúng
       * biên dịch được ở đây.
       */
      '@': path.resolve(__dirname, '../frontend/src'),
      /**
       * `next/dynamic` — thứ Next duy nhất mà cây Notes dùng tới (đúng MỘT lần).
       * Thay bằng một shim dựng trên React.lazy, xem src/renderer/shims/.
       */
      'next/dynamic': path.resolve(__dirname, 'src/renderer/shims/next-dynamic.tsx'),
    },
  },
  server: {
    port: 5273,
    strictPort: true,
    /**
     * Proxy API ở chế độ dev.
     *
     * Vì sao cần: bản đóng gói chạy ở origin `app://cuongthai`, đã có trong
     * CORS_ORIGINS của backend. Nhưng ở dev, renderer chạy ở
     * `http://localhost:5273` — một origin KHÁC HẲN, không nằm trong allowlist,
     * nên trình duyệt chặn mọi phản hồi và app chỉ thấy "không kết nối được
     * máy chủ". Bản đóng gói không dính, nên lỗi này chỉ lộ ra khi chạy dev.
     *
     * Cách sửa ở đây là để renderer gọi đường dẫn TƯƠNG ĐỐI (`/api/...`) —
     * cùng origin với dev server nên không có CORS — rồi Vite chuyển tiếp lên
     * máy chủ thật. Chuyển tiếp là server-to-server nên không mang header
     * `Origin`, và backend cho qua đúng theo luật sẵn có của nó.
     *
     * Cách còn lại là thêm `http://localhost:5273` vào CORS_ORIGINS trên
     * production. KHÔNG chọn cách đó: nó mở rộng bề mặt của máy chủ thật chỉ
     * để phục vụ máy của người viết mã.
     */
    proxy: {
      /**
       * ⚠️ PHẢI là `/api/v1`, KHÔNG được rút gọn thành `/api`.
       *
       * Vite phục vụ module nguồn theo đúng cây thư mục tính từ `root`
       * (`src/renderer`). Nên file `src/renderer/api/client.ts` được yêu cầu ở
       * `http://localhost:5273/api/client.ts` — và một quy tắc proxy `/api` sẽ
       * NUỐT LUÔN nó, chuyển tiếp lên api.cuongthai.com rồi nhận 404.
       *
       * Hậu quả: module không tải được → React không khởi động → MÀN TRẮNG,
       * terminal sạch, build xanh. Đã dính đúng lỗi này ngày 16/08/2026; dấu
       * vết duy nhất là một dòng `404 /api/client.ts` trong tab Network.
       *
       * `/api/v1` khớp mọi route thật của backend và không đụng thư mục nguồn nào.
       */
      '/api/v1': {
        target: process.env.CUONGTHAI_API_ORIGIN ?? 'https://api.cuongthai.com',
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            /**
             * BỎ header `Origin` (và `Referer`) trước khi chuyển tiếp.
             *
             * `changeOrigin: true` chỉ đổi `Host`, KHÔNG đụng `Origin`. Nên nếu
             * để nguyên, backend nhận `Origin: http://localhost:5273` — không có
             * trong CORS_ORIGINS — và middleware `cors` gọi `callback(new
             * Error(...))`, Express biến thành **HTTP 500**. Người dùng thấy
             * "Internal Server Error" khi gõ sai mật khẩu, hoàn toàn lạc hướng.
             *
             * Không có header `Origin` thì backend coi đây là lời gọi
             * server-to-server (curl, SSR) và cho qua — đúng theo nhánh
             * `if (!origin) return callback(null, true)` trong src/index.ts.
             */
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
          });
        },
      },
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist/renderer'),
    emptyOutDir: true,
    sourcemap: true,
    target: 'chrome128',
    /**
     * HAI trang, không phải một.
     *
     * `index.html` là cửa sổ chính. `robot.html` là con robot NỔI — một cửa sổ
     * hệ điều hành riêng, không khung, luôn trên cùng, sống cả khi cửa sổ chính
     * đã đóng. Nó phải là entry riêng vì nó nạp một cây React khác hẳn (chỉ con
     * robot + khung chat mini), và gói chung với app đầy đủ nghĩa là mỗi lần mở
     * robot phải tải cả trang Notes, Academy, sân chơi 3D…
     */
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'src/renderer/index.html'),
        robot: path.resolve(__dirname, 'src/renderer/robot.html'),
      },
    },
  },

  /**
   * Vitest quét từ GỐC GÓI, không từ `root` của Vite.
   *
   * `root` ở trên là `src/renderer` vì đó là gốc của trang web được dựng — và
   * hệ quả phụ là vitest chỉ nhìn thấy test trong renderer. Mã ở `src/main`
   * (nhà tù đường dẫn, diff, môi giới xin phép) là phần logic thuần đáng kiểm
   * nhất trong cả app, mà lại nằm ngoài tầm quét: viết test ở đó thì nó im
   * lặng không chạy, và "im lặng không chạy" trông giống hệt "chạy và đạt".
   *
   * Khối này CHỈ ảnh hưởng vitest, không đụng gì tới bản dựng.
   */
  test: {
    root: path.resolve(__dirname),
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
