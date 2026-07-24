/**
 * Exp Hub guide for CSD201 — JDK + Eclipse setup (Vietnamese).
 * Academy CSD201 links "Cài đặt" cards to /exp-hub/csd201-cai-dat-eclipse.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'csd201-cai-dat-eclipse',
    title: 'CSD201 — Cài JDK + Eclipse cho lập trình cấu trúc dữ liệu',
    kind: 'NOTE',
    language: 'java',
    status: 'PUBLISHED',
    description: 'Cài JDK và Eclipse để cài đặt & chạy các cấu trúc dữ liệu bằng Java cho môn CSD201 — kèm link tải chính chủ.',
    referenceUrl: 'https://www.eclipse.org/downloads/',
    codeBlocks: [
      {
        name: 'Kiểm tra JDK',
        language: 'bash',
        code: `java -version
javac -version`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn cài đặt · CSD201</span>
<h2>Cài môi trường Java cho CSD201</h2>
<p class="lead">CSD201 cài đặt cấu trúc dữ liệu bằng <strong>Java</strong>. Syllabus nêu <strong>Eclipse</strong>, nhưng IntelliJ IDEA hay NetBeans cũng dùng tốt. Bạn cần một <strong>JDK</strong> (biên dịch/chạy) và một <strong>IDE</strong>.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">JDK 8+</div><div class="lz-d">javac dịch, java chạy</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Eclipse</div><div class="lz-d">IDE viết/chạy/debug</div></div>
  <div class="lz-step"><div class="lz-k">=</div><div class="lz-t">Code cấu trúc</div><div class="lz-d">list, tree, graph…</div></div>
</div>

<h3>🅐 Bước 1 — Cài JDK</h3>
<p>Cài một bản JDK (8, 11, 17 hoặc 21 đều ổn). Mở Terminal mới gõ <code>java -version</code> để kiểm tra.</p>
<a class="link-card dl" href="https://adoptium.net/temurin/releases/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Eclipse Temurin JDK (miễn phí, khuyên dùng)</span><span class="lc-sub">adoptium.net · OpenJDK dễ cài, Windows/macOS/Linux</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅑 Bước 2 — Cài Eclipse</h3>
<p>Tải "Eclipse IDE for Java Developers" từ trang chính chủ.</p>
<a class="link-card dl" href="https://www.eclipse.org/downloads/packages/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Eclipse IDE (chính chủ)</span><span class="lc-sub">eclipse.org · chọn "Eclipse IDE for Java Developers"</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<div class="note-ct">Thích IDE hiện đại hơn? IntelliJ IDEA Community (miễn phí) rất mạnh cho Java. Cấu trúc dữ liệu chạy giống nhau ở mọi IDE — chọn cái bạn thoải mái.</div>
<a class="link-card dl" href="https://www.jetbrains.com/idea/download/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">IntelliJ IDEA Community (tùy chọn)</span><span class="lc-sub">jetbrains.com · bản Community miễn phí</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅒 Bước 3 — Tạo project & debug</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">New Java Project</div><div class="lz-nsub">File → New → Java Project → đặt tên.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Tạo class + main</div><div class="lz-nsub">Chuột phải src → New → Class, tick "public static void main".</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Chạy</div><div class="lz-nsub"><kbd>Ctrl</kbd>+<kbd>F11</kbd> (Run). Kết quả ở Console.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Debug</div><div class="lz-nsub">Nhấp lề trái đặt breakpoint, <kbd>F11</kbd> debug, <kbd>F6</kbd> step over — xem con trỏ trong linked list/tree.</div></div></div>
</div>
<div class="note-ct">Debugger là bạn thân khi học cấu trúc dữ liệu: đặt breakpoint và chạy từng bước để THẤY con trỏ next/prev, cây, và ngăn xếp đệ quy thay đổi. Kết hợp Algorithm Visualizer (/algorithms) để xem trực quan.</div>
`,
  },
};
