/**
 * Exp Hub guide for DBI202 — Microsoft SQL Server + SSMS setup (Vietnamese).
 * Academy DBI202 links "Cài đặt / vẽ ER" cards to /exp-hub/dbi202-cai-dat-sql-server.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'dbi202-cai-dat-sql-server',
    title: 'DBI202 — Cài Microsoft SQL Server + SSMS',
    kind: 'NOTE',
    language: 'sql',
    status: 'PUBLISHED',
    description: 'Cài Microsoft SQL Server (Developer/Express) và SQL Server Management Studio (SSMS) để thực hành SQL cho môn DBI202 — kèm link tải chính chủ và công cụ vẽ ER.',
    referenceUrl: 'https://www.microsoft.com/en-us/sql-server/sql-server-downloads',
    codeBlocks: [
      {
        name: 'Truy vấn đầu tiên (chạy trong SSMS)',
        language: 'sql',
        code: `CREATE DATABASE School;
GO
USE School;
GO
CREATE TABLE Student (id INT PRIMARY KEY, name NVARCHAR(100));
INSERT INTO Student VALUES (1, N'An'), (2, N'Binh');
SELECT * FROM Student;`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn cài đặt · DBI202</span>
<h2>Cài Microsoft SQL Server + SSMS</h2>
<p class="lead">DBI202 thực hành trên <strong>Microsoft SQL Server</strong>. Bạn cần hai thứ: <strong>SQL Server</strong> (động cơ CSDL — cài bản Developer hoặc Express, đều miễn phí) và <strong>SSMS</strong> (giao diện viết & chạy truy vấn).</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">SQL Server</div><div class="lz-d">động cơ CSDL</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">SSMS</div><div class="lz-d">viết & chạy SQL</div></div>
  <div class="lz-step"><div class="lz-k">=</div><div class="lz-t">Kết nối & query</div><div class="lz-d">tạo DB, chạy SELECT</div></div>
</div>

<h3>🅐 Bước 1 — Cài SQL Server</h3>
<p>Tải bản <strong>Developer</strong> (đầy đủ, miễn phí cho học tập) hoặc <strong>Express</strong> (nhẹ hơn). Chạy installer, chọn kiểu <em>Basic</em> là đủ cho môn học.</p>
<a class="link-card dl" href="https://www.microsoft.com/en-us/sql-server/sql-server-downloads" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">SQL Server (Developer / Express)</span><span class="lc-sub">microsoft.com · miễn phí, chọn Developer hoặc Express</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<div class="pitfall">Máy Mac không cài trực tiếp SQL Server được — dùng <strong>Docker</strong> (image <code>mcr.microsoft.com/mssql/server</code>) hoặc máy ảo Windows. Azure Data Studio thay SSMS trên macOS.</div>

<h3>🅑 Bước 2 — Cài SSMS</h3>
<p>SQL Server Management Studio là công cụ chính để viết truy vấn, xem bảng và vẽ sơ đồ.</p>
<a class="link-card dl" href="https://learn.microsoft.com/en-us/ssms/download-sql-server-management-studio-ssms" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">SQL Server Management Studio (SSMS)</span><span class="lc-sub">learn.microsoft.com · miễn phí</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<a class="link-card dl" href="https://azure.microsoft.com/en-us/products/data-studio" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Azure Data Studio (macOS/Linux)</span><span class="lc-sub">azure.microsoft.com · thay SSMS trên Mac</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅒 Bước 3 — Kết nối & chạy truy vấn</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Mở SSMS → Connect</div><div class="lz-nsub">Server name: <code>localhost</code> hoặc <code>.\\SQLEXPRESS</code>, Windows Authentication.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">New Query</div><div class="lz-nsub">Gõ SQL (xem khối lệnh ở trên), nhấn <kbd>F5</kbd> để chạy.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Xem kết quả</div><div class="lz-nsub">Bảng kết quả hiện ở cửa sổ Results phía dưới.</div></div></div>
</div>

<h3>Vẽ sơ đồ ER</h3>
<p>Thiết kế trước khi tạo bảng. SSMS có Database Diagrams tích hợp; hoặc dùng draw.io miễn phí online.</p>
<a class="link-card dl" href="https://app.diagrams.net/" target="_blank" rel="noopener">
  <span class="lc-ico">✏️</span><span class="lc-body"><span class="lc-title">draw.io (vẽ ER online)</span><span class="lc-sub">app.diagrams.net · miễn phí, có mẫu ER</span></span><span class="lc-cta">MỞ →</span>
</a>
<div class="note-ct">Xong cài đặt thì luyện SQL ngay trên track Code Lab SQL — từ SELECT cơ bản tới stored procedure, chạy truy vấn thật ngay trong trình duyệt.</div>
`,
  },
};
