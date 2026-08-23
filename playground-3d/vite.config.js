import 'dotenv/config'
import { fileURLToPath } from 'node:url'
import restart from 'vite-plugin-restart'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default {
    root: 'sources/', // Sources files (typically where index.html is)
    /**
     * Thư mục chứa `.env.*` — ĐƯỜNG DẪN TUYỆT ĐỐI, suy từ vị trí file cấu hình.
     *
     * ⚠️ Trước đây là `'../'` và nó TRỎ SAI: đo thật 23/08/2026 bằng
     * `loadEnv('production', <dir>)` thì `.env.production` chỉ tìm thấy ở
     * `playground-3d/`, còn `'../'` (Vite giải theo THƯ MỤC CHẠY, không theo
     * `root`) rơi ra gốc repo — nơi không có biến VITE nào.
     *
     * Hậu quả im lặng: `%VITE_BASE_HREF%` không được thay, `index.html` dựng ra
     * `<base>` RỖNG, mọi tài nguyên đi tìm ở gốc site và 404 sạch ⇒ đúng cái
     * "kẹt mãi ở màn hình tải, không lỗi nào" đã ghi trong CLAUDE.md.
     *
     * Vì sao không ai thấy: `import 'dotenv/config'` ở trên nạp `playground-3d/.env`
     * (file này bị .gitignore) vào `process.env`, và `process.env` THẮNG mọi
     * file `.env.<mode>`. Máy nào có `.env` thì dựng đúng; máy sạch — máy CI,
     * máy mới clone — dựng ra bản hỏng mà build vẫn XANH.
     *
     * Dùng đường dẫn tuyệt đối để nó không phụ thuộc vào thư mục đang đứng khi
     * gõ lệnh, cũng không phụ thuộc vào việc Vite giải tương đối theo cái gì.
     */
    envDir: fileURLToPath(new URL('.', import.meta.url)),
    publicDir: '../static/', // Path from "root" to static assets (files that are served as they are)
    base: './', // Public path (what's after the domain)
    server:
    {
        // https: true,
        host: true, // Open to local network and display URL
        open: true // Open in browser
    },
    build:
    {
        outDir: '../dist', // Output in the dist/ folder
        emptyOutDir: true, // Empty the folder first
        sourcemap: false, // Add sourcemap
        // ĐÃ BẬT LẠI rút gọn mã (30/7/2026).
        //
        // Trước đó bị TẮT để thử khoanh lỗi "thế giới kẹt ở màn hình tải, chỉ
        // xảy ra ở bản BUILD". Hoá ra rút gọn mã VÔ CAN: thủ phạm là Next.js
        // chốt danh sách file trong `public/` ngay lúc server KHỞI ĐỘNG. Dựng
        // lại sân chơi xong chép đè vào `frontend/public/playground/` thì tên
        // gói JS đổi (tên có mã băm nội dung), server đang chạy không biết tên
        // mới nên trả 404 → không có JS nào chạy → vòng tròn tải quay mãi mà
        // KHÔNG có lỗi nào, vì màn hình tải là HTML/CSS thuần trong index.html.
        //
        // Chi tiết + cách tránh: xem `sources/index.html` (đầu file) và
        // `scratchpad/PLAYGROUND-HANDOFF.md`.
        //
        // Tắt rút gọn làm gói JS phình 6,5MB thay vì ~4,9MB — không có lý do gì
        // để chịu thiệt đó nữa.
    },
    plugins:
    [
        wasm(),
        topLevelAwait(),
        restart({ restart: [ '../static/**', ] }), // Restart server on static file change
        nodePolyfills(),
        // basicSsl()
    ]
}