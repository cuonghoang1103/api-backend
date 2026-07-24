/**
 * Exp Hub guide for WED201c — VS Code + Live Server + browser DevTools (Vietnamese).
 * Academy WED201c links "Cài đặt" cards to /exp-hub/wed201c-cai-dat-web.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'wed201c-cai-dat-web',
    title: 'WED201c — Cài VS Code + Live Server cho web',
    kind: 'NOTE',
    language: 'html',
    status: 'PUBLISHED',
    description: 'Thiết lập môi trường front-end cho WED201c: VS Code, extension Live Server, trình duyệt và DevTools — kèm link tải chính chủ và tài khoản Coursera.',
    referenceUrl: 'https://code.visualstudio.com/',
    codeBlocks: [
      {
        name: 'Trang đầu tiên — index.html',
        language: 'html',
        code: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello, web!</h1>
    <button id="greet">Click me</button>
    <p id="out"></p>
    <script>
      document.querySelector("#greet").addEventListener("click", () => {
        document.querySelector("#out").textContent = "Xin chao WED201c!";
      });
    </script>
  </body>
</html>`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn cài đặt · WED201c</span>
<h2>Thiết lập môi trường front-end</h2>
<p class="lead">Làm web cần rất ít: một <strong>trình soạn thảo</strong> và một <strong>trình duyệt</strong>. Không cần server hay cài đặt phức tạp — viết một file <code>.html</code>, mở trong trình duyệt, xong.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">VS Code</div><div class="lz-d">soạn code</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Live Server</div><div class="lz-d">tự reload trình duyệt</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">DevTools</div><div class="lz-d">soi & debug (F12)</div></div>
</div>

<h3>🅐 Bước 1 — Cài VS Code</h3>
<p>Visual Studio Code là trình soạn thảo web phổ biến nhất, miễn phí, có gợi ý code cho HTML/CSS/JS.</p>
<a class="link-card dl" href="https://code.visualstudio.com/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Visual Studio Code (miễn phí, chính chủ)</span><span class="lc-sub">code.visualstudio.com · Windows/macOS/Linux</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅑 Bước 2 — Cài extension Live Server</h3>
<p>Live Server tự mở trang trong trình duyệt và <strong>tự reload</strong> mỗi khi bạn lưu — vòng lặp sửa/xem cực nhanh.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Mở Extensions</div><div class="lz-nsub">VS Code → biểu tượng Extensions (Ctrl+Shift+X).</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Tìm "Live Server"</div><div class="lz-nsub">tác giả Ritwick Dey → Install.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Go Live</div><div class="lz-nsub">Chuột phải file .html → "Open with Live Server".</div></div></div>
</div>

<h3>🅒 Bước 3 — Dùng DevTools của trình duyệt</h3>
<p>Nhấn <kbd>F12</kbd> (hoặc chuột phải → Inspect) để mở DevTools — công cụ gỡ lỗi quan trọng nhất.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Elements</b> — xem cây DOM, chỉnh HTML/CSS trực tiếp và thấy ngay.</div>
  <div class="lz-layer"><b>Console</b> — đọc lỗi JavaScript và thử lệnh.</div>
  <div class="lz-layer"><b>Device toolbar</b> — giả lập điện thoại/máy tính bảng để test responsive.</div>
</div>

<h3>🅓 Bước 4 — Đăng ký Coursera (bắt buộc)</h3>
<p>WED201c yêu cầu hoàn thành các MOOC "Web Design for Everybody". Đăng ký tài khoản Coursera và ghi danh khi được admin mời.</p>
<a class="link-card dl" href="https://www.coursera.org/specializations/web-design" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">Web Design for Everybody (Coursera)</span><span class="lc-sub">coursera.org · Đại học Michigan · MOOC bắt buộc của môn</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<div class="note-ct">Mẹo: bật "Auto Save" trong VS Code + Live Server để trang tự cập nhật khi bạn gõ. Kết hợp DevTools device toolbar để kiểm responsive ngay.</div>
`,
  },
};
