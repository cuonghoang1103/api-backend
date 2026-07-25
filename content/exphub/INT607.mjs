/**
 * Exp Hub guide for INT607 — Gym Membership & Classes App dev environment (Vietnamese).
 * Academy INT607 bài 0.4 links its "Cài đặt" card to /exp-hub/int607-cai-dat-moi-truong.
 * Stack: Node.js LTS + Expo (Expo Go / EAS) + VS Code + Docker (Express API + Postgres).
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'int607-cai-dat-moi-truong',
    title: 'INT607 — Cài môi trường React Native (Expo) + Express + PostgreSQL',
    kind: 'NOTE',
    language: 'bash',
    status: 'PUBLISHED',
    description: 'Cài môi trường cho app gym di động: Node.js, Expo (Expo Go trên điện thoại), VS Code, Docker cho API Express + Postgres — kèm lệnh tạo app Expo và chạy backend.',
    referenceUrl: 'https://docs.expo.dev/get-started/set-up-your-environment/',
    codeBlocks: [
      {
        name: 'Kiểm tra công cụ',
        language: 'bash',
        code: `node -v        # nen >= 20.x
npm -v
docker --version
git --version`,
      },
      {
        name: 'Tạo app Expo & chạy trên điện thoại thật',
        language: 'bash',
        code: `npx create-expo-app@latest gym-app
cd gym-app
npx expo install expo-secure-store expo-notifications

# Chay dev server
npx expo start
# -> Mo app "Expo Go" tren dien thoai, quet QR hien ra -> app chay ngay tren may that
# LUU Y: EXPO_PUBLIC_API_URL phai la IP LAN cua may (vd http://192.168.1.10:3000),
#        KHONG dung localhost (localhost tren dien thoai = chinh dien thoai)`,
      },
      {
        name: 'Chạy backend API (Express + Postgres) bằng Docker',
        language: 'bash',
        code: `docker run --name gym-db \\
  -e POSTGRES_PASSWORD=gym -e POSTGRES_DB=gym \\
  -p 5432:5432 -d postgres:16

# Trong thu muc backend:
npm install express @prisma/client jsonwebtoken bcrypt zod
npm install -D prisma
npx prisma migrate dev --name init
node src/server.js   # API :3000`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn cài đặt · INT607</span>
<h2>Cài môi trường cho App Gym (React Native / Expo)</h2>
<p class="lead">Đồ án này có <strong>hai phần</strong>: app di động React Native (dùng <strong>Expo</strong>) và REST API Express + PostgreSQL. Cái hay của Expo là bạn <strong>không cần Android Studio/Xcode</strong> để bắt đầu — chỉ cần cài app "Expo Go" lên điện thoại thật và quét QR. Cài 3 công cụ dưới đây một lần rồi bắt đầu.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Node.js LTS</div><div class="lz-d">chạy Expo + API</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Expo Go (điện thoại)</div><div class="lz-d">chạy app thật</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">VS Code</div><div class="lz-d">IDE</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Docker</div><div class="lz-d">Postgres cho API</div></div>
</div>

<h3>🅐 Node.js LTS — chạy Expo và backend</h3>
<p>Cài bản LTS (20.x trở lên). Kèm <code>npm</code> và <code>npx</code> (dùng để chạy <code>npx expo</code>).</p>
<a class="link-card dl" href="https://nodejs.org/en/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Tải Node.js (LTS)</span><span class="lc-sub">nodejs.org — chọn bản LTS cho hệ điều hành của bạn.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅑 Expo Go — chạy app trên điện thoại thật</h3>
<p>Cài app <strong>Expo Go</strong> từ App Store (iOS) hoặc Google Play (Android). Khi bạn chạy <code>npx expo start</code>, quét QR hiện ra là app chạy ngay trên máy thật — nhanh nhất để thử. (Muốn build file cài <code>.apk</code> để demo, dùng <code>npx eas build</code> ở Mục 6.)</p>
<a class="link-card dl" href="https://expo.dev/go" target="_blank" rel="noopener">
  <span class="lc-ico">📲</span>
  <span class="lc-body"><span class="lc-title">Tải Expo Go</span><span class="lc-sub">expo.dev/go — hoặc tìm "Expo Go" trong App Store / Google Play.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅒 VS Code + Docker Desktop</h3>
<p>VS Code làm IDE (cài extension <strong>Prisma</strong> và <strong>React Native Tools</strong>). Docker chạy PostgreSQL cho API — một lệnh là có ngay CSDL.</p>
<a class="link-card dl" href="https://code.visualstudio.com/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Tải Visual Studio Code</span><span class="lc-sub">code.visualstudio.com</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<a class="link-card dl" href="https://www.docker.com/products/docker-desktop/" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Tải Docker Desktop</span><span class="lc-sub">docker.com — chạy Postgres cho backend.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<div class="callout warn"><strong>Bẫy hay gặp nhất:</strong> đặt <code>EXPO_PUBLIC_API_URL=http://localhost:3000</code>. Trên điện thoại, <code>localhost</code> là <em>chính điện thoại</em>, không phải máy dev — mọi request fail. Dùng <strong>IP LAN của máy tính</strong> (vd <code>http://192.168.1.10:3000</code>); máy và điện thoại phải cùng WiFi.</div>

<div class="callout"><strong>Sau khi cài xong:</strong> chạy <code>node -v</code>, dựng Postgres bằng Docker + chạy API, tạo app Expo và mở bằng Expo Go, rồi quay lại bài <b>0.4</b> trong khoá học để bắt đầu Mục 1 (thiết kế CSDL).</div>
`,
  },
};
