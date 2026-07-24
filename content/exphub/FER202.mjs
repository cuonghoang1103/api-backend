/**
 * Exp Hub guide for FER202 — Node.js + Vite + React + VS Code (Vietnamese).
 * Academy FER202 links its "Cài đặt" card to /exp-hub/fer202-cai-dat-react.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'fer202-cai-dat-react',
    title: 'FER202 — Cài Node.js + Vite + React',
    kind: 'NOTE',
    language: 'bash',
    status: 'PUBLISHED',
    description: 'Dựng môi trường React cho FER202: cài Node.js LTS, tạo project bằng Vite, cấu hình VS Code (ESLint/Prettier) và React DevTools — kèm link tải chính chủ.',
    referenceUrl: 'https://nodejs.org/',
    codeBlocks: [
      {
        name: 'Tạo & chạy project React (Vite)',
        language: 'bash',
        code: `# Kiểm tra Node & npm đã cài chưa (cần Node >= 18)
node -v
npm -v

# Tạo project React mới bằng Vite
npm create vite@latest my-fer202-app -- --template react

# Vào thư mục, cài dependency, chạy dev server
cd my-fer202-app
npm install
npm run dev
# Mở http://localhost:5173 — sửa src/App.jsx là trang tự reload`,
      },
      {
        name: 'Component React đầu tiên — src/App.jsx',
        language: 'jsx',
        code: `import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Xin chao FER202!</h1>
      <button onClick={() => setCount(count + 1)}>
        Da bam {count} lan
      </button>
    </div>
  );
}`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn cài đặt · FER202</span>
<h2>Dựng môi trường React với Vite</h2>
<p class="lead">React chạy trên <strong>Node.js</strong>. Bạn chỉ cần 3 thứ: <strong>Node.js</strong> (chạy JavaScript ngoài trình duyệt + npm để tải thư viện), một <strong>công cụ build</strong> (dùng <strong>Vite</strong> — nhanh, hiện đại, thay cho create-react-app đã lỗi thời), và <strong>VS Code</strong> để soạn code.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Node.js LTS</div><div class="lz-d">runtime + npm</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Vite</div><div class="lz-d">tạo & chạy app</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">VS Code</div><div class="lz-d">soạn code + extension</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">React DevTools</div><div class="lz-d">soi component</div></div>
</div>

<h3>🅐 Bước 1 — Cài Node.js (bản LTS)</h3>
<p>Chọn bản <strong>LTS</strong> (Long-Term Support) cho ổn định. Bộ cài đã kèm <code>npm</code> — trình quản lý gói để tải React và thư viện.</p>
<a class="link-card dl" href="https://nodejs.org/en/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Node.js LTS (miễn phí, chính chủ)</span><span class="lc-sub">nodejs.org · Windows/macOS/Linux · chọn bản LTS</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<div class="note-ct">Sau khi cài, mở terminal (hoặc Command Prompt) gõ <code>node -v</code> và <code>npm -v</code>. Ra số phiên bản là thành công.</div>

<h3>🅑 Bước 2 — Tạo project bằng Vite</h3>
<p>Mở terminal và chạy các lệnh trong khối "Tạo &amp; chạy project React (Vite)" bên trên. Vite dựng sẵn cấu trúc, cài React, và bật dev server có <strong>hot reload</strong> (sửa là thấy ngay).</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">npm create vite@latest</div><div class="lz-nsub">chọn template <code>react</code> (hoặc <code>react-ts</code> nếu dùng TypeScript).</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">npm install</div><div class="lz-nsub">tải React + dependency vào thư mục <code>node_modules</code>.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">npm run dev</div><div class="lz-nsub">mở <code>http://localhost:5173</code> — sửa <code>src/App.jsx</code> là trang tự cập nhật.</div></div></div>
</div>

<h3>🅒 Bước 3 — Cài VS Code + extension</h3>
<p>VS Code là trình soạn thảo tốt nhất cho React. Cài thêm vài extension để code nhanh và sạch:</p>
<a class="link-card dl" href="https://code.visualstudio.com/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Visual Studio Code (miễn phí, chính chủ)</span><span class="lc-sub">code.visualstudio.com · Windows/macOS/Linux</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<div class="lz-stack">
  <div class="lz-layer"><b>ES7+ React/Redux snippets</b> — gõ <code>rafce</code> ra sẵn một function component.</div>
  <div class="lz-layer"><b>ESLint</b> — bắt lỗi code ngay khi gõ (thiếu key, biến chưa dùng…).</div>
  <div class="lz-layer"><b>Prettier</b> — tự căn lề & format khi lưu (bật "Format On Save").</div>
</div>

<h3>🅓 Bước 4 — Cài React DevTools cho trình duyệt</h3>
<p>Extension này thêm 2 tab <strong>Components</strong> và <strong>Profiler</strong> vào DevTools (F12) — xem cây component, props, state và đo hiệu năng render.</p>
<a class="link-card dl" href="https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">React Developer Tools (Chrome/Edge)</span><span class="lc-sub">chromewebstore.google.com · chính chủ Meta · cũng có bản Firefox</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<div class="note-ct">Mẹo: bật "Format On Save" (Settings → tìm "format on save") + đặt Prettier làm formatter mặc định → mỗi lần <kbd>Ctrl+S</kbd> code tự đẹp. Kết hợp tab Components của React DevTools để soi state khi debug.</div>
`,
  },
};
