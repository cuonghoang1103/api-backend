import 'dotenv/config'
import restart from 'vite-plugin-restart'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default {
    root: 'sources/', // Sources files (typically where index.html is)
    envDir: '../',  // Directory where the env file is located
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
        /**
         * ⚠️ LOẠI `crypto` KHỎI POLYFILL — đo được 253 KB (đã gzip).
         *
         * `nodePolyfills()` không tham số thì polyfill MỌI module lõi của Node,
         * trong đó `crypto` kéo theo cả một cụm: elliptic 206 KB · asn1.js 138 ·
         * diffie-hellman 106 · public-encrypt 99 · create-ecdh 95 ·
         * miller-rabin 94 · bn.js 90 · browserify-sign 77 · ripemd160 73 —
         * tổng hơn **1,1 MB chưa rút gọn** cho một trò chơi 3D.
         *
         * Thứ duy nhất trong kho chạm tới `crypto` là `uuid` ở `Server.js`, mà
         * `uuid` v11 dùng `crypto.randomUUID()` CỦA TRÌNH DUYỆT chứ không phải
         * module Node. Đã kiểm thật: bỏ polyfill đi, `localStorage.uuid` vẫn
         * sinh ra UUID hợp lệ, 0 lỗi JS.
         *
         * `msgpack-lite` (thứ còn lại trong `Server.js`) cần `Buffer`, và
         * `Buffer` vẫn được polyfill — chỉ `crypto` bị loại.
         *
         * ⚠️ Đừng bỏ luôn `nodePolyfills()`: `msgpack-lite` sẽ vỡ. Chỉ thu hẹp.
         */
        /**
         * ⚠️ VÀ KHÔNG TIÊM `Buffer` TOÀN CỤC — thêm 35 KB (đã gzip).
         *
         * `exclude` chỉ bỏ polyfill dạng module; `nodePolyfills` vẫn tiêm một
         * biến `Buffer` toàn cục vào GÓI CHÍNH, kể cả khi thứ duy nhất cần nó
         * (`msgpack-lite`) đã chuyển sang nhập động và nằm ở chunk riêng.
         *
         * `msgpack-lite` tham chiếu `Buffer` TRẦN (`Buffer.alloc`,
         * `Buffer.from`…) nhưng luôn qua cờ `hasBuffer = typeof Buffer !==
         * 'undefined'`, và có sẵn nhánh lùi về `Uint8Array`
         * (`lib/bufferish-uint8array.js`). Đã kiểm THẬT chứ không đọc mã rồi
         * tin: chạy vòng `encode`/`decode` trong trình duyệt với
         * `typeof Buffer === 'undefined'` — ra `Uint8Array` 81 byte, giải mã
         * lại khớp hoàn toàn cả object lồng, số thực, `null` và khoá tiếng
         * Việt, 0 lỗi.
         *
         * ⚠️ Thêm bất cứ gói nào khác cần `Buffer` thì phải đo lại chỗ này.
         */
        nodePolyfills({ exclude: [ 'crypto' ], globals: { Buffer: false } }),
        // basicSsl()
    ]
}