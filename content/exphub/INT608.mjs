/**
 * Exp Hub guide for INT608 — Restaurant Reservation App dev environment (Vietnamese).
 * Academy INT608 bài 0.4 links its "Cài đặt" card to /exp-hub/int608-cai-dat-moi-truong.
 * Stack: Flutter SDK + Android Studio (emulator) + VS Code + Docker (Express API + Postgres).
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'int608-cai-dat-moi-truong',
    title: 'INT608 — Cài môi trường Flutter + Express + PostgreSQL',
    kind: 'NOTE',
    language: 'bash',
    status: 'PUBLISHED',
    description: 'Cài môi trường cho app đặt bàn Flutter: Flutter SDK, Android Studio (máy ảo), VS Code, Docker cho API Express + Postgres — kèm lệnh tạo app và kiểm flutter doctor.',
    referenceUrl: 'https://docs.flutter.dev/get-started/install',
    codeBlocks: [
      {
        name: 'Kiểm tra Flutter đã sẵn sàng',
        language: 'bash',
        code: `# Kiem tra toan bo toolchain (SDK, Android, thiet bi...)
flutter doctor

# Neu thieu gi, flutter doctor se chi ro cach sua
flutter --version
node -v        # cho backend
docker --version`,
      },
      {
        name: 'Tạo & chạy app Flutter',
        language: 'bash',
        code: `flutter create dining_app
cd dining_app
flutter pub add dio flutter_secure_storage intl

# Liet ke thiet bi (may ao / dien thoai cam day)
flutter devices

# Chay app; truyen URL API vao luc chay
# LUU Y: tren may ao Android, host = 10.0.2.2 (KHONG phai localhost)
flutter run --dart-define=API_URL=http://10.0.2.2:3000`,
      },
      {
        name: 'Chạy backend API (Express + Postgres) bằng Docker',
        language: 'bash',
        code: `docker run --name dining-db \\
  -e POSTGRES_PASSWORD=dining -e POSTGRES_DB=dining \\
  -p 5432:5432 -d postgres:16

# Trong thu muc backend:
npm install express @prisma/client jsonwebtoken bcrypt zod
npm install -D prisma
npx prisma migrate dev --name init
node src/server.js   # API :3000`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn cài đặt · INT608</span>
<h2>Cài môi trường cho App Đặt bàn (Flutter)</h2>
<p class="lead">Đồ án này có <strong>hai phần</strong>: app di động <strong>Flutter</strong> (một codebase Dart cho cả iOS lẫn Android) và REST API Express + PostgreSQL. Cài Flutter SDK + một máy ảo, cài Docker cho backend, rồi bắt đầu. Luôn chạy <code>flutter doctor</code> để nó tự chỉ ra cái còn thiếu.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Flutter SDK</div><div class="lz-d">build app</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Android Studio</div><div class="lz-d">SDK + máy ảo</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">VS Code</div><div class="lz-d">IDE + Flutter ext</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Docker</div><div class="lz-d">Postgres cho API</div></div>
</div>

<h3>🅐 Flutter SDK — công cụ build app</h3>
<p>Tải Flutter SDK cho hệ điều hành của bạn, thêm <code>flutter/bin</code> vào PATH, rồi chạy <code>flutter doctor</code>. Nó liệt kê mọi thứ còn thiếu (Android SDK, giấy phép, thiết bị) và cách sửa từng cái.</p>
<a class="link-card dl" href="https://docs.flutter.dev/get-started/install" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Tải Flutter SDK</span><span class="lc-sub">docs.flutter.dev/get-started/install — chọn OS của bạn.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅑 Android Studio — Android SDK + máy ảo</h3>
<p>Cần cho Android SDK, trình quản lý thiết bị ảo (AVD) và giấy phép. Sau khi cài, tạo một Virtual Device (Pixel + API mới) để chạy app mà không cần điện thoại thật.</p>
<a class="link-card dl" href="https://developer.android.com/studio" target="_blank" rel="noopener">
  <span class="lc-ico">🤖</span>
  <span class="lc-body"><span class="lc-title">Tải Android Studio</span><span class="lc-sub">developer.android.com/studio — kèm Android SDK + AVD.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅒 VS Code + extension Flutter — IDE</h3>
<p>Cài extension <strong>Flutter</strong> (kèm Dart). Có hot-reload, gợi ý widget, và nút Run tiện. Bạn cũng có thể dùng Android Studio làm IDE nếu thích.</p>
<a class="link-card dl" href="https://code.visualstudio.com/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Tải Visual Studio Code</span><span class="lc-sub">code.visualstudio.com — cài extension "Flutter".</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅓 Docker Desktop — Postgres cho API</h3>
<p>Chạy PostgreSQL trong Docker (khối lệnh bên dưới) cho backend Express — một lệnh là có ngay CSDL.</p>
<a class="link-card dl" href="https://www.docker.com/products/docker-desktop/" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Tải Docker Desktop</span><span class="lc-sub">docker.com — chạy Postgres cho backend.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<div class="callout warn"><strong>Bẫy địa chỉ API:</strong> trên <b>máy ảo Android</b>, máy tính host KHÔNG phải <code>localhost</code> mà là <code>10.0.2.2</code>. Chạy <code>flutter run --dart-define=API_URL=http://10.0.2.2:3000</code>. Trên điện thoại thật, dùng IP LAN của máy (vd <code>192.168.1.10</code>).</div>

<div class="callout"><strong>Sau khi cài xong:</strong> chạy <code>flutter doctor</code> tới khi mọi mục ✓, dựng Postgres + chạy API, tạo app Flutter, rồi quay lại bài <b>0.4</b> trong khoá học để bắt đầu Mục 1 (thiết kế CSDL).</div>
`,
  },
};
