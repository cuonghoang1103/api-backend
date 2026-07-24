/**
 * Exp Hub guide for LAB211 — NetBeans 8.0.2 + JDK 8 + CheckStyle setup (Vietnamese).
 * Seeded by scripts/exphub-seed-guide.mjs (idempotent upsert by slug).
 * Academy LAB211 links "Cài đặt / CheckStyle" cards to /exp-hub/lab211-cai-dat-netbeans.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'lab211-cai-dat-netbeans',
    title: 'LAB211 — Cài NetBeans 8.0.2 + JDK 8 + CheckStyle',
    kind: 'NOTE',
    language: 'java',
    status: 'PUBLISHED',
    description: 'Cài đúng bộ công cụ FPT dùng để chấm LAB211: NetBeans 8.0.2, JDK 8, plugin CheckStyle, và dùng debugger NetBeans — kèm link tải chính chủ.',
    referenceUrl: 'https://netbeans.apache.org/front/main/download/',
    codeBlocks: [
      {
        name: 'Kiểm tra JDK 8 đã cài đúng chưa',
        language: 'bash',
        code: `java -version
# mong doi: java version "1.8.0_..."
javac -version
# mong doi: javac 1.8.0_...`,
      },
      {
        name: 'Chương trình đầu tiên — Hello.java',
        language: 'java',
        code: `public class Hello {
    public static void main(String[] args) {
        System.out.println("Xin chao LAB211!");
    }
}`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn cài đặt · LAB211</span>
<h2>Cài đúng bộ công cụ FPT dùng để chấm</h2>
<p class="lead">Syllabus LAB211 ghi rõ công cụ: <strong>NetBeans 8.0.2</strong>, <strong>JDK 8</strong>, plugin <strong>CheckStyle</strong>, và <strong>JavaDoc</strong>. Hãy dùng đúng phiên bản mentor dùng — chương trình chạy trên JDK mới ở nhà có thể hành xử khác JDK 8 trong phòng lab, và điểm được chấm trên máy phòng lab.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">JDK 8</div><div class="lz-d">javac dịch, java chạy</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">NetBeans 8.0.2</div><div class="lz-d">IDE viết/chạy/debug</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">CheckStyle</div><div class="lz-d">kiểm code convention</div></div>
</div>

<h3>🅐 Bước 1 — Cài JDK 8</h3>
<p>LAB211 dùng <strong>JDK 8</strong> (Java 1.8). Cài xong mở Terminal/CMD mới và gõ <code>java -version</code>, kết quả phải bắt đầu bằng <code>1.8.0</code>.</p>
<a class="link-card dl" href="https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Oracle JDK 8 (kho lưu trữ chính chủ)</span><span class="lc-sub">oracle.com · chọn Windows x64 Installer · cần đăng nhập tài khoản Oracle miễn phí</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<a class="link-card dl" href="https://adoptium.net/temurin/releases/?version=8" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Eclipse Temurin JDK 8 (miễn phí, không cần tài khoản)</span><span class="lc-sub">adoptium.net · chọn Version 8 · bản OpenJDK dễ cài, khuyên dùng</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<div class="pitfall">Nếu <code>java -version</code> báo <em>"not recognized / command not found"</em>: JDK chưa vào PATH. Trên Windows cài lại, tick <strong>"Set JAVA_HOME"</strong> / <strong>"Add to PATH"</strong>, rồi <strong>mở lại</strong> Terminal.</div>

<h3>🅑 Bước 2 — Cài NetBeans 8.0.2</h3>
<p>Đây là IDE môn dùng để chấm. Bản 8.0.2 do Oracle phát hành (trước khi NetBeans chuyển sang Apache). Tải từ kho lưu trữ chính chủ và cài với JDK 8 đã có ở Bước 1.</p>
<a class="link-card dl" href="https://netbeans.apache.org/download/nb/nb-802.html" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">NetBeans 8.0.2 (trang phát hành chính chủ)</span><span class="lc-sub">netbeans.apache.org · chọn bản "Java SE" cho hệ điều hành của bạn</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<div class="note-ct">Muốn IDE mới hơn cho luyện tập ở nhà? Apache NetBeans mới nhất vẫn chạy tốt các bài LAB211. Nhưng khi thi/nộp, hãy chắc code của bạn biên dịch và chạy trên <strong>JDK 8</strong> — đó mới là môi trường chấm.</div>
<a class="link-card dl" href="https://netbeans.apache.org/front/main/download/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Apache NetBeans (bản mới nhất, tùy chọn)</span><span class="lc-sub">netbeans.apache.org · để luyện ở nhà</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅒 Bước 3 — Cài plugin CheckStyle</h3>
<p>CheckStyle nằm trong danh sách công cụ bắt buộc — nó kiểm code có theo convention không (đặt tên, thụt lề). Code sạch là một phần điểm.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Mở Plugins</div><div class="lz-nsub">NetBeans → Tools → Plugins.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Tìm CheckStyle</div><div class="lz-nsub">Tab "Available Plugins" → tìm "CheckStyle Beans" → tick → Install.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Chạy kiểm</div><div class="lz-nsub">Chuột phải project/file → CheckStyle → xem cảnh báo ở cửa sổ output.</div></div></div>
</div>
<a class="link-card dl" href="https://plugins.netbeans.apache.org/catalogue/?id=71" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">CheckStyle plugin (NetBeans Plugin Portal)</span><span class="lc-sub">plugins.netbeans.apache.org · tải .nbm nếu cần cài thủ công</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🅓 Bước 4 — Tạo project &amp; dùng Debugger (CLO3)</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">New Project</div><div class="lz-nsub">File → New Project → Java → Java Application.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Chạy</div><div class="lz-nsub">Nhấn <kbd>F6</kbd> (Run Project) / <kbd>Shift</kbd>+<kbd>F6</kbd> (Run File). Kết quả ở cửa sổ Output.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Đặt breakpoint</div><div class="lz-nsub">Bấm lề trái số dòng (chấm đỏ) tại chỗ nghi có lỗi.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Debug từng bước</div><div class="lz-nsub"><kbd>Ctrl</kbd>+<kbd>F5</kbd> debug; <kbd>F8</kbd> Step Over, <kbd>F7</kbd> Step Into; xem giá trị biến trong cửa sổ Variables.</div></div></div>
</div>
<div class="note-ct">CLO3 của môn là "debug bằng công cụ phổ biến" — biết đặt breakpoint và chạy từng bước là kỹ năng được chấm. Luyện debug ngay từ những bài đầu, đừng đợi tới lúc bí.</div>

<h3>Tải nhanh &amp; tài liệu</h3>
<a class="link-card dl" href="https://adoptium.net/temurin/releases/?version=8" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span><span class="lc-body"><span class="lc-title">JDK 8 (Temurin)</span><span class="lc-sub">adoptium.net</span></span><span class="lc-cta">MỞ →</span>
</a>
<a class="link-card dl" href="https://netbeans.apache.org/download/nb/nb-802.html" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span><span class="lc-body"><span class="lc-title">NetBeans 8.0.2</span><span class="lc-sub">netbeans.apache.org</span></span><span class="lc-cta">MỞ →</span>
</a>
<a class="link-card dl" href="https://docs.oracle.com/javase/tutorial/" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span><span class="lc-body"><span class="lc-title">The Java Tutorials (Oracle)</span><span class="lc-sub">docs.oracle.com/javase/tutorial</span></span><span class="lc-cta">MỞ →</span>
</a>

<div class="note-ct">Xong môi trường thì bắt tay vào 54 đề luyện tập của track LAB211 ngay — môn này thưởng cho số giờ gõ phím. Cài JDK 8 trước, rồi NetBeans 8.0.2, rồi CheckStyle.</div>
`,
  },
};
