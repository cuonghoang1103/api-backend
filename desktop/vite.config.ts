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
import { noiDungBai } from './vite.noi-dung-bai';
import path from 'node:path';
import { aliasDesktop } from './vite.alias';

export default defineConfig({
  root: path.resolve(__dirname, 'src/renderer'),
  base: './',
  plugins: [react(), noiDungBai(__dirname)],
  resolve: {
    alias: aliasDesktop(__dirname),
    /**
     * ⚠️ `../frontend` có `node_modules/react` riêng. Không gộp thì một cây
     * component của web có thể nạp bản React của nó trong khi app chạy bản
     * của mình — hai dispatcher, và mọi hook ném ngay lượt render đầu.
     * Xem chú thích dài ở khối `test` bên dưới.
     */
    dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'zustand'],
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
    /**
     * Bản đồ nguồn CHỈ ở máy nhà, không ở CI.
     *
     * ⚠️ 20/08/2026: sau khi app dùng lại thêm 51.000 dòng mã web (Thuật toán ·
     * Mô phỏng · Lộ trình · Ngoại ngữ), `vite build` CHẾT trên runner macOS của
     * GitHub với `FATAL ERROR: Reached heap limit — JavaScript heap out of
     * memory`, thoát 134. Máy nhà dựng xanh trong 20 giây vì nhiều RAM hơn hẳn.
     * Sinh bản đồ nguồn cho một cây 4,7MB là phần ngốn bộ nhớ nặng nhất, và
     * bản đồ nguồn KHÔNG đi kèm bản cài: `electron-builder.yml` đã có một mẫu
     * loại trừ mọi tệp đuôi `.map` (xem mục `files:` trong tệp đó). Tức là CI
     * đang tốn bộ nhớ để sinh ra thứ chính nó vứt đi ngay sau — bỏ hẳn ở CI
     * không mất gì cả.
     *
     * (KHÔNG chép nguyên mẫu loại trừ ấy vào đây: chuỗi của nó chứa dấu sao
     * kèm gạch chéo, và dấu đó ĐÓNG SỚM khối chú thích này. Đã dẫm đúng lần
     * đầu viết, và CI đỏ ngay bước kiểm kiểu.)
     *
     * `build:renderer` cũng đã nâng heap lên 6GB. Cần cả hai: nâng heap một
     * mình vẫn sát trần, bỏ bản đồ nguồn một mình thì lần thêm trang sau lại
     * chạm trần.
     *
     * Gỡ lỗi ở máy nhà thì vẫn có bản đồ nguồn như cũ.
     */
    sourcemap: !process.env.CI,
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
    /* `scripts/**` cũng có phép kiểm: những móc dựng ở đó chỉ chạy lúc đóng
       gói ba nền, tức là chỗ KHÓ thử nhất và cũng là chỗ hỏng đắt nhất — một
       móc sai làm bản cài thiếu nhị phân mà vẫn dựng xanh. */
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'scripts/**/*.test.mjs'],
    /**
     * ⚠️⚠️ MỘT BẢN REACT DUY NHẤT, KHÔNG HAI.
     *
     * App dùng lại cây component của web, mà cây đó nằm ở `../frontend` —
     * nơi có `node_modules/react` RIÊNG. Không có dòng này thì vitest nạp
     * React của frontend cho component web và React của desktop cho bộ dựng,
     * hai bản không chia sẻ dispatcher, và MỌI hook ném
     * `Cannot read properties of null (reading 'useRef')`.
     *
     * Đã dẫm phải 16/09/2026 khi viết phép kiểm gắn cây messenger. Mất một
     * lúc mới phân biệt được: đây là lỗi của BỘ KIỂM, không phải của sản phẩm
     * — bản dựng thật chỉ có một bản React (kiểm bằng cách đếm dấu vân tay
     * `ReactCurrentDispatcher` trong `dist/renderer/assets`, và Notes vốn
     * cũng là cây web dùng hook đã chạy trên production từ lâu).
     *
     * Bản dựng không cần dòng này vì Vite tự gộp; vitest thì không.
     */
    /**
     * ⚠️⚠️ ÉP VITEST NẠP THƯ VIỆN CỦA `../frontend` QUA VITE, KHÔNG QUA NODE.
     *
     * Mặc định vitest "externalize" mọi thứ trong `node_modules`: Node nạp
     * thẳng bằng đường dẫn tệp, và alias của Vite KHÔNG áp vào đó. Hệ quả đo
     * được 16/09/2026: `framer-motion` nằm ở `frontend/node_modules` được nạp
     * thẳng, nó `import 'react'` và bộ giải của Node tìm thấy React CỦA
     * FRONTEND — bản thứ hai. Mọi hook bên trong `AnimatePresence` ném
     * `Cannot read properties of null (reading 'useContext')`.
     *
     * Đây là lỗi của BỘ KIỂM, không phải của sản phẩm: bản dựng thật đi qua
     * Vite nên alias áp đủ, và trong `dist/renderer/assets` chỉ có MỘT bản
     * React (đếm bằng dấu vân tay `ReactCurrentDispatcher`).
     *
     * Xem [[feedback_verify_the_checker_before_the_content]] — lần thứ hai
     * trong ngày một "lỗi" hoá ra nằm ở bộ đo.
     */
    server: { deps: { inline: [/frontend[\\/]node_modules/] } },
  },
  /* Cùng lý do trên — áp cho cả bản dựng lẫn vitest cho chắc, và để người sau
     đọc `resolve` là thấy ngay ràng buộc này. */
  optimizeDeps: { include: ['react', 'react-dom'] },
});
