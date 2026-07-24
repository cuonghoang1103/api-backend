/**
 * Exp Hub guide for PRO192 — Java (JDK) + NetBeans setup (Vietnamese).
 * Seeded by scripts/exphub-seed-guide.mjs (idempotent upsert by slug).
 * Rendered with `.rich-content` → callouts, step maps, clickable download cards.
 * Academy PRO192 links "Cài đặt" cards to /exp-hub/<slug>.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'pro192-cai-dat-java-netbeans',
    title: 'PRO192 — Cài đặt & sử dụng Java (JDK) + NetBeans',
    kind: 'NOTE',
    language: 'java',
    status: 'PUBLISHED',
    description: 'Hướng dẫn cài JDK (Java Development Kit) và NetBeans để viết, biên dịch, chạy và gỡ lỗi chương trình Java cho môn PRO192 — kèm link tải chính chủ và project đầu tiên.',
    referenceUrl: 'https://netbeans.apache.org/front/main/download/',
    codeBlocks: [
      {
        name: 'Chương trình Java đầu tiên — Hello.java',
        language: 'java',
        code: `public class Hello {
    public static void main(String[] args) {
        System.out.println("Xin chao PRO192!");
    }
}`,
      },
      {
        name: 'Biên dịch & chạy bằng Terminal (không cần IDE)',
        language: 'bash',
        code: `# Kiem tra da cai JDK chua:
java -version
javac -version

# Bien dich Hello.java -> Hello.class
javac Hello.java

# Chay:
java Hello`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn cài đặt · PRO192</span>
<h2>Cài đặt &amp; sử dụng Java + NetBeans</h2>
<p class="lead">Để lập trình Java bạn cần đúng 2 thứ: một <strong>JDK</strong> (Java Development Kit — trình biên dịch <code>javac</code> + runtime <code>java</code>) và một <strong>IDE</strong> (nơi viết code, môn dùng NetBeans). Cài xong là code được cả môn PRO192.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Cần gì</div><div class="lz-t">JDK</div><div class="lz-d">javac dịch, java chạy</div></div>
  <div class="lz-step"><div class="lz-k">+</div><div class="lz-t">NetBeans</div><div class="lz-d">IDE viết/chạy/debug</div></div>
  <div class="lz-step"><div class="lz-k">=</div><div class="lz-t">Viết → dịch → chạy</div><div class="lz-d">vòng lặp lập trình</div></div>
</div>

<h3>🅐 Bước 1 — Cài JDK (Java Development Kit)</h3>
<p>Chọn một bản JDK LTS (Java 8, 11, 17 hoặc 21 đều ổn cho PRO192). Cài xong, mở Terminal mới và gõ <code>java -version</code> để kiểm tra.</p>
<a class="link-card dl" href="https://adoptium.net/temurin/releases/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Eclipse Temurin JDK (miễn phí, khuyên dùng)</span><span class="lc-sub">adoptium.net · bản OpenJDK dễ cài, Windows/macOS/Linux</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<a class="link-card dl" href="https://www.oracle.com/java/technologies/downloads/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Oracle JDK (chính chủ)</span><span class="lc-sub">oracle.com/java · cần tài khoản Oracle với vài bản</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<div class="pitfall">Nếu <code>java -version</code> báo <em>"not recognized/command not found"</em>: JDK chưa vào PATH. Trên Windows, cài lại và tick "Set JAVA_HOME"/"Add to PATH", rồi <strong>mở lại</strong> Terminal. Cài bằng NetBeans full-installer (bên dưới) thường đã kèm JDK nên đỡ bước này.</div>

<h3>🅑 Bước 2 — Cài NetBeans (IDE của môn)</h3>
<p>NetBeans là IDE Java mạnh, có build/run/debug tích hợp. Tải bản Apache NetBeans mới nhất và cài bình thường.</p>
<a class="link-card dl" href="https://netbeans.apache.org/front/main/download/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Apache NetBeans (miễn phí, chính chủ)</span><span class="lc-sub">netbeans.apache.org · chọn Installer cho hệ điều hành của bạn</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅒 Bước 3 — Tạo &amp; chạy project đầu tiên</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">New Project</div><div class="lz-nsub">File → New Project → Java with Ant / Maven → Java Application.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Viết code</div><div class="lz-nsub">Gõ chương trình (xem khối "Hello.java" ở trên) vào lớp main.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Chạy</div><div class="lz-nsub">Nhấn <kbd>F6</kbd> (Run Project) hoặc <kbd>Shift</kbd>+<kbd>F6</kbd> (Run File). Kết quả hiện ở cửa sổ Output.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Debug</div><div class="lz-nsub">Bấm lề trái số dòng đặt breakpoint (chấm đỏ), nhấn <kbd>Ctrl</kbd>+<kbd>F5</kbd> để chạy từng bước, xem giá trị biến.</div></div></div>
</div>

<h3>Không muốn IDE? Dùng Terminal</h3>
<p>Bạn cũng có thể dịch/chạy bằng dòng lệnh (xem khối lệnh ở trên): <code>javac Hello.java</code> để dịch ra <code>Hello.class</code>, rồi <code>java Hello</code> để chạy. Cách này giúp hiểu điều IDE làm bên dưới.</p>

<h3>Tải về &amp; tài liệu</h3>
<a class="link-card dl" href="https://adoptium.net/temurin/releases/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span><span class="lc-body"><span class="lc-title">JDK (Temurin)</span><span class="lc-sub">adoptium.net</span></span><span class="lc-cta">MỞ →</span>
</a>
<a class="link-card dl" href="https://netbeans.apache.org/front/main/download/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span><span class="lc-body"><span class="lc-title">Apache NetBeans</span><span class="lc-sub">netbeans.apache.org</span></span><span class="lc-cta">MỞ →</span>
</a>
<a class="link-card dl" href="https://docs.oracle.com/javase/tutorial/" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span><span class="lc-body"><span class="lc-title">The Java Tutorials (Oracle)</span><span class="lc-sub">docs.oracle.com/javase/tutorial</span></span><span class="lc-cta">MỞ →</span>
</a>

<div class="note-ct">Khuyên: cài JDK trước, rồi NetBeans. PRO192 chấm 40% qua Lab + Practical Exam (code trên máy) — cài môi trường sớm và code mỗi ngày. Luyện thêm trên CodeLab track <strong>Java Fundamentals</strong>.</div>
`,
  },
};
