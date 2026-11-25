/**
 * Chương 5 — Gỡ lỗi giao diện bằng DevTools của trình duyệt (khoá debug-co-phuong-phap). Bài ĐÃ SOẠN, ghép vào khung bằng slug.
 * Mỗi bài một tệp trong s05/ (soạn 24/11/2026 trên máy nhà Linux; output chạy thật bằng Google Chrome 150 headless + Chrome DevTools Protocol,
 * lái bằng Playwright 1.65.1 — lưu ở vbg-dp/scratchpad/dbg/lab/ch5). Ứng dụng mẫu LabFlow web (React 19.3 + Vite 8.3, API node:http):
 * mã ở s05/_ma-5.mjs. Máy soạn không có GUI: không có ảnh chụp DevTools; thao tác giao diện theo tài liệu developer.chrome.com.
 */
import B1 from './s05/dbg-5-1-console.mjs';
import B2 from './s05/dbg-5-2-network.mjs';
import B3 from './s05/dbg-5-3-sources.mjs';
import B4 from './s05/dbg-5-4-storage-react.mjs';
import B5 from './s05/dbg-5-5-lab.mjs';
import B6 from './s05/dbg-5-6-quiz.mjs';

export default [B1, B2, B3, B4, B5, B6];
