/**
 * Exp Hub guide for PRF192 — C dev environment setup (Vietnamese).
 * Seeded by scripts/exphub-seed-guide.mjs (idempotent upsert by slug).
 * Rendered with `.rich-content` (see globals.css) → callouts, step maps,
 * clickable download cards. Academy PRF192 links "Cài đặt" cards to /exp-hub/<slug>.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'prf192-cai-dat-moi-truong-c',
    title: 'PRF192 — Cài đặt & sử dụng môi trường lập trình C (DevC++ / VS Code)',
    kind: 'NOTE',
    language: 'c',
    status: 'PUBLISHED',
    description: 'Hướng dẫn chi tiết cài đặt, cấu hình và sử dụng DevC++ hoặc VS Code + GCC để viết, biên dịch, chạy và gỡ lỗi chương trình C cho môn PRF192.',
    referenceUrl: 'https://code.visualstudio.com/download',
    codeBlocks: [
      {
        name: 'Chương trình C đầu tiên — hello.c',
        language: 'c',
        code: `#include <stdio.h>

int main() {
    printf("Xin chao PRF192!");
    return 0;
}`,
      },
      {
        name: 'Cài GCC bằng MSYS2 (Windows)',
        language: 'bash',
        code: `# Mở "MSYS2 UCRT64" rồi chạy:
pacman -S mingw-w64-ucrt-x86_64-gcc

# Kiểm tra đã cài xong (mở Terminal MỚI):
gcc --version`,
      },
      {
        name: 'Biên dịch & chạy trong Terminal',
        language: 'bash',
        code: `# Biên dịch hello.c thành chương trình "hello"
gcc hello.c -o hello

# Chạy — Windows:
.\\hello
# Chạy — macOS / Linux:
./hello`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn cài đặt · PRF192</span>
<h2>Cài đặt &amp; sử dụng môi trường lập trình C</h2>
<p class="lead">Để lập trình C bạn cần đúng 2 thứ: một <strong>trình biên dịch</strong> (GCC — dịch code C thành chương trình chạy được) và một <strong>trình soạn thảo</strong> (nơi gõ code). Chọn <strong>một</strong> trong hai cách dưới đây là đủ học cả môn PRF192.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Cần gì</div><div class="lz-t">Trình biên dịch</div><div class="lz-d">GCC — dịch C ra chương trình chạy</div></div>
  <div class="lz-step"><div class="lz-k">+</div><div class="lz-t">Trình soạn thảo</div><div class="lz-d">nơi gõ code</div></div>
  <div class="lz-step"><div class="lz-k">=</div><div class="lz-t">Viết → dịch → chạy</div><div class="lz-d">vòng lặp lập trình</div></div>
</div>

<h3>🅐 Cách 1 — DevC++ (đơn giản, trường dùng)</h3>
<p>DevC++ gói sẵn cả trình biên dịch lẫn trình soạn thảo trong một bộ cài — cài xong dùng được ngay, không cấu hình gì thêm. Phù hợp cho người mới.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Tải &amp; cài</div><div class="lz-nsub">Bấm nút tải bên dưới → chạy file cài → bấm Next đến hết (giữ mặc định).</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Tạo file .c</div><div class="lz-nsub">File → New → Source File → lưu với đuôi <code>.c</code> (KHÔNG để <code>.cpp</code>).</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Biên dịch &amp; chạy</div><div class="lz-nsub">Gõ chương trình (xem khối "hello.c" ở trên) rồi nhấn <kbd>F11</kbd>. Cửa sổ đen hiện kết quả.</div></div></div>
</div>
<a class="link-card dl" href="https://www.embarcadero.com/free-tools/dev-cpp" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Tải DevC++ (Embarcadero — chính chủ)</span><span class="lc-sub">embarcadero.com/free-tools/dev-cpp · bản 6.3, miễn phí</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<div class="pitfall">Nếu cửa sổ kết quả hiện rồi <em>tắt ngay</em>, thêm <code>getchar();</code> ngay trước <code>return 0;</code> để nó dừng chờ bạn xem. Và nhớ lưu file đuôi <code>.c</code> — để <code>.cpp</code> sẽ biên dịch theo C++, khác vài quy tắc.</div>

<h3>🅑 Cách 2 — VS Code + GCC (chuyên nghiệp, dùng lâu dài)</h3>
<p>VS Code là trình soạn thảo mạnh, dùng cho mọi ngôn ngữ. Cần cài thêm GCC (qua MinGW-w64 trên Windows).</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Cài VS Code</div><div class="lz-nsub">Bấm nút tải VS Code bên dưới → cài bình thường.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Cài GCC</div><div class="lz-nsub">Windows: cài MSYS2 (nút tải bên dưới) rồi chạy lệnh cài GCC (xem khối "MSYS2" ở trên). macOS: <code>xcode-select --install</code>. Linux: <code>sudo apt install build-essential</code>.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Thêm GCC vào PATH (Windows)</div><div class="lz-nsub">Thêm <code>C:\\msys64\\ucrt64\\bin</code> vào biến môi trường <em>Path</em>, rồi <strong>mở lại</strong> VS Code. Kiểm tra: <code>gcc --version</code>.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Cài extension C/C++</div><div class="lz-nsub">Trong VS Code, mở tab Extensions, cài <strong>C/C++</strong> của Microsoft.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Biên dịch &amp; chạy</div><div class="lz-nsub">Mở Terminal (<kbd>Ctrl</kbd>+<kbd>&#96;</kbd>) và chạy lệnh biên dịch (xem khối lệnh ở trên).</div></div></div>
</div>
<a class="link-card dl" href="https://code.visualstudio.com/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Tải VS Code (chính chủ Microsoft)</span><span class="lc-sub">code.visualstudio.com/download</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<a class="link-card dl" href="https://www.msys2.org/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Tải MSYS2 (GCC cho Windows)</span><span class="lc-sub">msys2.org</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<div class="pitfall">Lỗi hay gặp: báo <em>"'gcc' is not recognized"</em> → GCC chưa vào PATH; làm lại bước 3 rồi <strong>mở lại</strong> Terminal/VS Code (PATH chỉ được đọc khi mở cửa sổ mới).</div>

<h3>Gỡ lỗi (debug) trong VS Code</h3>
<p>Bấm vào lề trái số dòng để đặt <strong>breakpoint</strong> (chấm đỏ), nhấn <kbd>F5</kbd> để chạy từng bước và xem giá trị biến thay đổi — rất hữu ích khi tìm lỗi logic.</p>

<h3>Tải về &amp; tài liệu</h3>
<a class="link-card dl" href="https://www.embarcadero.com/free-tools/dev-cpp" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span><span class="lc-body"><span class="lc-title">DevC++</span><span class="lc-sub">embarcadero.com/free-tools/dev-cpp</span></span><span class="lc-cta">MỞ →</span>
</a>
<a class="link-card dl" href="https://code.visualstudio.com/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span><span class="lc-body"><span class="lc-title">VS Code</span><span class="lc-sub">code.visualstudio.com/download</span></span><span class="lc-cta">MỞ →</span>
</a>
<a class="link-card dl" href="https://www.msys2.org/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span><span class="lc-body"><span class="lc-title">MSYS2 (GCC cho Windows)</span><span class="lc-sub">msys2.org</span></span><span class="lc-cta">MỞ →</span>
</a>
<a class="link-card dl" href="https://gcc.gnu.org/onlinedocs/" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span><span class="lc-body"><span class="lc-title">Tài liệu GCC</span><span class="lc-sub">gcc.gnu.org/onlinedocs</span></span><span class="lc-cta">MỞ →</span>
</a>

<div class="note-ct">Khuyên: người mới bắt đầu bằng <strong>DevC++</strong> cho nhanh; khi đã quen thì chuyển sang <strong>VS Code + GCC</strong> — bộ công cụ bạn sẽ dùng suốt cả ngành. Cả hai đều dịch bằng GCC nên code C viết giống hệt nhau.</div>
`,
  },
};
