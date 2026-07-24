/**
 * Exp Hub guide for PRJ301 — Tomcat + NetBeans + SQL Server setup (Vietnamese).
 * Academy PRJ301 links "Cài đặt" cards to /exp-hub/prj301-cai-dat-tomcat.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'prj301-cai-dat-tomcat',
    title: 'PRJ301 — Cài Tomcat + NetBeans + SQL Server cho Java web',
    kind: 'NOTE',
    language: 'java',
    status: 'PUBLISHED',
    description: 'Cài đủ bộ cho phát triển Java web PRJ301: JDK, Apache Tomcat 9+, NetBeans 13+ (nối Tomcat), và SQL Server 2019+ — kèm link tải chính chủ.',
    referenceUrl: 'https://tomcat.apache.org/',
    codeBlocks: [
      {
        name: 'Cấu trúc project web tối thiểu',
        language: 'text',
        code: `MyWebApp/
 ├─ src/java/         (Servlet, DAO, entity)
 ├─ web/
 │   ├─ WEB-INF/web.xml
 │   ├─ index.jsp
 │   └─ home.jsp
 └─ build.xml`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn cài đặt · PRJ301</span>
<h2>Cài môi trường Java web</h2>
<p class="lead">Một app Java web cần 4 mảnh: <strong>JDK</strong> (biên dịch), <strong>Tomcat</strong> (web server chạy Servlet), <strong>NetBeans</strong> (IDE nối Tomcat), và <strong>SQL Server</strong> (cơ sở dữ liệu từ DBI202).</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">JDK 8+</div><div class="lz-d">biên dịch Java</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Tomcat 9+</div><div class="lz-d">web server</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">NetBeans 13+</div><div class="lz-d">IDE + nối Tomcat</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">SQL Server</div><div class="lz-d">CSDL</div></div>
</div>

<h3>🅐 JDK</h3>
<a class="link-card dl" href="https://adoptium.net/temurin/releases/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Eclipse Temurin JDK</span><span class="lc-sub">adoptium.net · JDK 8 hoặc 17</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅑 Apache Tomcat 9+</h3>
<p>Tomcat là Servlet container — nó chạy các Servlet của bạn và biến HTTP request thành lời gọi Java. Tải bản 9 (khớp Java EE / Servlet 4).</p>
<a class="link-card dl" href="https://tomcat.apache.org/download-90.cgi" target="_blank" rel="noopener">
  <span class="lc-ico">🐱</span>
  <span class="lc-body"><span class="lc-title">Apache Tomcat 9 (chính chủ)</span><span class="lc-sub">tomcat.apache.org · tải "zip" (Core), giải nén là chạy</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅒 NetBeans 13+ và nối Tomcat</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Cài NetBeans</div><div class="lz-nsub">bản có "Java EE / Web" để tạo project web.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Thêm Tomcat vào NetBeans</div><div class="lz-nsub">Tools → Servers → Add Server → Apache Tomcat → trỏ tới thư mục Tomcat.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Tạo project</div><div class="lz-nsub">New Project → Java Web → Web Application → chọn Tomcat.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Run</div><div class="lz-nsub">Nhấn Run (F6) → NetBeans deploy lên Tomcat và mở trình duyệt.</div></div></div>
</div>
<a class="link-card dl" href="https://netbeans.apache.org/front/main/download/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Apache NetBeans</span><span class="lc-sub">netbeans.apache.org · bản mới nhất, chọn gói Java EE</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅓 SQL Server + JDBC driver</h3>
<p>Dùng SQL Server đã cài từ DBI202. Để Java kết nối, thêm <b>mssql-jdbc</b> driver vào project (Libraries → Add JAR, hoặc Maven dependency).</p>
<a class="link-card dl" href="https://learn.microsoft.com/en-us/sql/connect/jdbc/download-microsoft-jdbc-driver-for-sql-server" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Microsoft JDBC Driver for SQL Server</span><span class="lc-sub">learn.microsoft.com · file mssql-jdbc-*.jar</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<div class="pitfall">Chuỗi kết nối mẫu: <code>jdbc:sqlserver://localhost:1433;databaseName=MyDB;encrypt=true;trustServerCertificate=true</code>. Nếu lỗi kết nối, bật <b>TCP/IP</b> trong SQL Server Configuration Manager và kiểm cổng 1433.</div>
<div class="note-ct">Xong môi trường thì làm Servlet "Hello" (xem Chương 1 trong khóa học), rồi dựng dần một chức năng MVC nhỏ — đúng dạng thi thực hành 85 phút.</div>
`,
  },
};
