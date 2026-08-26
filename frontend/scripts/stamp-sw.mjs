// stamp-sw.mjs — đóng dấu mã build vào VERSION của public/sw.js.
// ─────────────────────────────────────────────────────────────────────────────
// VÌ SAO. Service worker dùng `const VERSION = '...'` làm tên cache; comment
// trong sw.js dặn "mỗi deploy bump VERSION". Nhưng không ai bump tay, nên VERSION
// đứng yên từ 2026-07-03 → mỗi deploy, client PWA/mobile có nguy cơ kẹt asset cũ
// (desktop hard-refresh thì mới, mobile/PWA thì không). Script này thay VERSION
// bằng mã build (SHA commit, hoặc timestamp) để MỖI build ra một cache mới →
// skipWaiting + clients.claim (đã có sẵn trong sw.js) khiến PWA tự cập nhật.
//
// CHẠY Ở ĐÂU. Chỉ trong frontend/Dockerfile, NGAY TRƯỚC `next build`. KHÔNG gắn
// vào `prebuild` để `npm run build` lúc dev local KHÔNG làm bẩn git. Nếu vì lý do
// gì stamp thất bại, build VẪN chạy tiếp (fresh > stale, không được chặn deploy).
import { readFileSync, writeFileSync } from 'node:fs';

const SW = new URL('../public/sw.js', import.meta.url);
try {
  const raw = process.env.BUILD_NUMBER;
  const version = raw && raw !== 'local' ? raw : `dev-${Date.now()}`;
  const src = readFileSync(SW, 'utf8');
  const out = src.replace(/const VERSION = '[^']*';/, `const VERSION = '${version}';`);
  if (out === src) {
    console.warn('[stamp-sw] KHÔNG khớp dòng VERSION — bỏ qua, giữ nguyên sw.js');
  } else {
    writeFileSync(SW, out);
    console.log(`[stamp-sw] VERSION = ${version}`);
  }
} catch (e) {
  console.warn('[stamp-sw] lỗi (bỏ qua, KHÔNG chặn build):', e?.message || e);
}
process.exit(0);
