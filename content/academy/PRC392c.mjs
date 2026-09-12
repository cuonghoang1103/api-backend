/**
 * PRC392c — Cloud Computing (AWS). Giáo trình FLM. Soạn từ syllabus + kiến thức,
 * song ngữ, kèm bài tập/quiz. Giữ NGUYÊN slug/semester/thumbnailUrl (v3).
 * ⚠️ code/CLI mẫu: KHÔNG backtick, KHÔNG ${ }; "\n" literal viết \\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('prc392c-0-1-overview', 'Course overview: Cloud Computing on AWS|||Tổng quan: Điện toán đám mây trên AWS',
  'Đám mây là gì (IaaS/PaaS/SaaS), vì sao AWS, các nhóm dịch vụ lõi (compute/storage/database/network), mô hình chia sẻ trách nhiệm, lộ trình & định hướng chứng chỉ.',
  [[
    `<span class="eyebrow">PRC392c · Lesson 0.1 · Overview</span>
<h2>Cloud Computing on AWS</h2>
<p class="lead">Cloud computing means renting <strong>computing resources over the internet</strong> — servers, storage, databases — and paying only for what you use, instead of buying and running your own data center. <strong>AWS (Amazon Web Services)</strong> is the largest cloud provider; this course teaches its core services and how to design solutions with them.</p>
<h3>Three service models</h3>
<ul>
<li><strong>IaaS</strong> (Infrastructure) — raw virtual machines, storage, network. You manage the OS up. <em>e.g. EC2, S3.</em></li>
<li><strong>PaaS</strong> (Platform) — you deploy code, the provider runs the servers. <em>e.g. Elastic Beanstalk, Lambda.</em></li>
<li><strong>SaaS</strong> (Software) — ready-made apps over the web. <em>e.g. Gmail.</em></li>
</ul>
<h3>Why the cloud wins</h3>
<p>No upfront hardware cost (<strong>pay-as-you-go</strong>), <strong>elastic</strong> (scale up/down in minutes), <strong>global</strong> (deploy near users), and <strong>managed</strong> (AWS handles the undifferentiated heavy lifting — patching, hardware failure).</p>
<div class="callout"><span class="badge">Shared responsibility</span> AWS secures the cloud <em>infrastructure</em> ("security OF the cloud"); YOU secure what you put in it — data, access, configuration ("security IN the cloud"). Most breaches are the customer's misconfiguration, not AWS's.</div>
<h3>Course roadmap</h3>
<p>Compute (EC2, Lambda) → Storage (S3, EBS) → Database (RDS, DynamoDB) → Networking &amp; architecture (VPC, well-architected design) → Data lakes &amp; analytics → exam strategy. Bilingual, with AWS CLI examples and exercises.</p>`,
    `<span class="eyebrow">PRC392c · Bài 0.1 · Tổng quan</span>
<h2>Điện toán đám mây trên AWS</h2>
<p class="lead">Điện toán đám mây là <strong>thuê tài nguyên tính toán qua internet</strong> — máy chủ, lưu trữ, cơ sở dữ liệu — và chỉ trả cho phần dùng, thay vì tự mua và vận hành trung tâm dữ liệu. <strong>AWS (Amazon Web Services)</strong> là nhà cung cấp đám mây lớn nhất; môn này dạy các dịch vụ lõi và cách thiết kế giải pháp với chúng.</p>
<h3>Ba mô hình dịch vụ</h3>
<ul>
<li><strong>IaaS</strong> (Hạ tầng) — máy ảo, lưu trữ, mạng thô. Bạn quản từ HĐH trở lên. <em>vd EC2, S3.</em></li>
<li><strong>PaaS</strong> (Nền tảng) — bạn triển khai mã, nhà cung cấp lo máy chủ. <em>vd Elastic Beanstalk, Lambda.</em></li>
<li><strong>SaaS</strong> (Phần mềm) — ứng dụng dùng ngay qua web. <em>vd Gmail.</em></li>
</ul>
<h3>Vì sao đám mây thắng</h3>
<p>Không tốn phần cứng ban đầu (<strong>trả theo dùng</strong>), <strong>co giãn</strong> (tăng/giảm trong vài phút), <strong>toàn cầu</strong> (đặt gần người dùng), và <strong>được quản lý</strong> (AWS lo vá lỗi, hỏng phần cứng).</p>
<div class="callout"><span class="badge">Trách nhiệm chia sẻ</span> AWS bảo vệ <em>hạ tầng</em> đám mây ("bảo mật CỦA đám mây"); BẠN bảo vệ thứ bạn đặt vào — dữ liệu, quyền truy cập, cấu hình ("bảo mật TRONG đám mây"). Đa số sự cố là do khách cấu hình sai, không phải AWS.</div>
<h3>Lộ trình môn</h3>
<p>Compute (EC2, Lambda) → Storage (S3, EBS) → Database (RDS, DynamoDB) → Mạng &amp; kiến trúc (VPC, thiết kế well-architected) → Data lake &amp; phân tích → chiến lược thi. Song ngữ, có ví dụ AWS CLI và bài tập.</p>`,
  ]]);

const c1 = doc('prc392c-1-1-compute', '1.1 — Compute: EC2 & Lambda|||1.1 — Compute: EC2 & Lambda',
  'Máy ảo EC2 (instance type, AMI, key pair, security group), auto scaling & load balancer; và serverless Lambda (chạy hàm không cần quản máy chủ). Khi nào dùng cái nào.',
  [[
    `<span class="eyebrow">PRC392c · Chapter 1 · Lesson 1.1</span>
<h2>Compute — running code in the cloud</h2>
<h3>EC2 — virtual machines</h3>
<p><strong>Amazon EC2</strong> (Elastic Compute Cloud) gives you virtual servers. You pick an <strong>instance type</strong> (CPU/RAM, e.g. t3.micro), an <strong>AMI</strong> (Amazon Machine Image — the OS + software), a <strong>key pair</strong> (SSH login), and a <strong>security group</strong> (a virtual firewall).</p>
<pre><code class="language-bash"># Launch an EC2 instance with the AWS CLI
aws ec2 run-instances \\
  --image-id ami-0abcd1234 \\
  --instance-type t3.micro \\
  --key-name my-key \\
  --security-group-ids sg-0123
</code></pre>
<p>Scale EC2 with an <strong>Auto Scaling Group</strong> (add/remove instances by load) behind an <strong>Elastic Load Balancer</strong> (spreads traffic). This is how you handle traffic spikes without over-provisioning.</p>
<h3>Lambda — serverless</h3>
<p><strong>AWS Lambda</strong> runs your function <em>without any server to manage</em>. You upload code, pick a trigger (an HTTP request via API Gateway, a file landing in S3, a schedule), and AWS runs it on demand — you pay per millisecond of execution.</p>
<pre><code class="language-python">def handler(event, context):
    name = event.get("name", "world")
    return {"statusCode": 200, "body": "Hello, " + name}
</code></pre>
<div class="callout"><span class="badge">EC2 vs Lambda</span> EC2 = always-on server, full control, good for steady workloads &amp; long tasks. Lambda = short bursts, event-driven, scales to zero (no cost when idle). Choose Lambda first for glue/APIs; EC2 for stateful or long-running services.</div>`,
    `<span class="eyebrow">PRC392c · Chương 1 · Bài 1.1</span>
<h2>Compute — chạy mã trên đám mây</h2>
<h3>EC2 — máy ảo</h3>
<p><strong>Amazon EC2</strong> cho bạn máy chủ ảo. Bạn chọn <strong>instance type</strong> (CPU/RAM, vd t3.micro), một <strong>AMI</strong> (ảnh máy — HĐH + phần mềm), một <strong>key pair</strong> (đăng nhập SSH) và một <strong>security group</strong> (tường lửa ảo).</p>
<pre><code class="language-bash"># Khởi tạo một EC2 instance bằng AWS CLI
aws ec2 run-instances \\
  --image-id ami-0abcd1234 \\
  --instance-type t3.micro \\
  --key-name my-key \\
  --security-group-ids sg-0123
</code></pre>
<p>Co giãn EC2 bằng <strong>Auto Scaling Group</strong> (thêm/bớt instance theo tải) sau một <strong>Elastic Load Balancer</strong> (chia lưu lượng). Đây là cách chịu đỉnh tải mà không phải cấp dư máy.</p>
<h3>Lambda — serverless</h3>
<p><strong>AWS Lambda</strong> chạy hàm của bạn <em>mà không cần quản máy chủ nào</em>. Bạn tải mã lên, chọn trigger (một request HTTP qua API Gateway, một file rơi vào S3, một lịch), và AWS chạy khi cần — trả tiền theo từng mili-giây thực thi.</p>
<pre><code class="language-python">def handler(event, context):
    name = event.get("name", "world")
    return {"statusCode": 200, "body": "Hello, " + name}
</code></pre>
<div class="callout"><span class="badge">EC2 vs Lambda</span> EC2 = máy chạy liên tục, toàn quyền, hợp tải ổn định &amp; tác vụ dài. Lambda = bùng ngắn, theo sự kiện, co về 0 (rảnh thì không tốn). Ưu tiên Lambda cho API/keo nối; EC2 cho dịch vụ có trạng thái hoặc chạy lâu.</p></div>`,
  ]]);

const c1q = quiz('prc392c-quiz-1', 'Quiz 1 — Compute|||Quiz 1 — Compute', [
  { id: 'q1', question: 'Dịch vụ nào chạy mã KHÔNG cần quản máy chủ, co về 0 khi rảnh?', options: ['EC2', 'AWS Lambda (serverless)', 'S3', 'RDS'], correctIndex: 1, explanation: 'Lambda là serverless, tính tiền theo thời gian chạy, rảnh không tốn.' },
  { id: 'q2', question: 'Security group trong EC2 đóng vai trò?', options: ['Ổ cứng', 'Tường lửa ảo (kiểm soát port ra/vào)', 'Cân bằng tải', 'Ảnh HĐH'], correctIndex: 1, explanation: 'Security group = firewall ảo cho instance.' },
  { id: 'q3', question: 'Chịu đỉnh lưu lượng mà không cấp dư máy nên dùng?', options: ['Một EC2 lớn cố định', 'Auto Scaling Group + Load Balancer', 'Tắt bớt vùng', 'DynamoDB'], correctIndex: 1, explanation: 'Auto Scaling thêm/bớt instance theo tải, ELB chia lưu lượng.' },
]);

const c2 = doc('prc392c-2-1-storage', '2.1 — Storage: S3 & EBS|||2.1 — Lưu trữ: S3 & EBS',
  'S3 (object storage: bucket/key, độ bền 11 số 9, storage class, versioning, static website); EBS (đĩa gắn EC2); phân biệt object vs block storage.',
  [[
    `<span class="eyebrow">PRC392c · Chapter 2 · Lesson 2.1</span>
<h2>Storage — S3 &amp; EBS</h2>
<h3>Amazon S3 — object storage</h3>
<p><strong>S3</strong> (Simple Storage Service) stores <strong>objects</strong> (files) in <strong>buckets</strong>, each addressed by a <strong>key</strong> (its name/path). It gives <strong>eleven nines (99.999999999%) durability</strong>, scales infinitely, and is the backbone of most AWS architectures — backups, media, data lakes, static websites.</p>
<pre><code class="language-bash">aws s3 cp report.pdf s3://my-bucket/2026/report.pdf   # upload
aws s3 ls s3://my-bucket/2026/                          # list
</code></pre>
<ul>
<li><strong>Storage classes</strong> trade price for access speed: Standard (hot) → Infrequent Access → Glacier (archive, cheapest, slow to retrieve).</li>
<li><strong>Versioning</strong> keeps every version of an object — protection against accidental overwrite/delete.</li>
<li>S3 can <strong>host a static website</strong> directly (HTML/CSS/JS).</li>
</ul>
<h3>Amazon EBS — block storage</h3>
<p><strong>EBS</strong> (Elastic Block Store) is a virtual <em>hard disk</em> you attach to an EC2 instance — like a physical drive. Use it for the OS and databases running on EC2.</p>
<div class="callout"><span class="badge">Object vs Block</span> S3 (object) = whole files over HTTP, great for scale &amp; sharing, no filesystem. EBS (block) = a disk for ONE instance, low-latency reads/writes, has a filesystem. Different jobs.</div>`,
    `<span class="eyebrow">PRC392c · Chương 2 · Bài 2.1</span>
<h2>Lưu trữ — S3 &amp; EBS</h2>
<h3>Amazon S3 — object storage</h3>
<p><strong>S3</strong> lưu <strong>object</strong> (file) trong <strong>bucket</strong>, mỗi cái định danh bằng một <strong>key</strong> (tên/đường dẫn). Cho <strong>độ bền 11 số 9 (99,999999999%)</strong>, co giãn vô hạn, và là xương sống của hầu hết kiến trúc AWS — sao lưu, media, data lake, web tĩnh.</p>
<pre><code class="language-bash">aws s3 cp report.pdf s3://my-bucket/2026/report.pdf   # tải lên
aws s3 ls s3://my-bucket/2026/                          # liệt kê
</code></pre>
<ul>
<li><strong>Storage class</strong> đánh đổi giá lấy tốc độ truy cập: Standard (nóng) → Infrequent Access → Glacier (lưu trữ, rẻ nhất, lấy chậm).</li>
<li><strong>Versioning</strong> giữ mọi phiên bản của object — chống ghi đè/xoá nhầm.</li>
<li>S3 có thể <strong>host web tĩnh</strong> trực tiếp (HTML/CSS/JS).</li>
</ul>
<h3>Amazon EBS — block storage</h3>
<p><strong>EBS</strong> là <em>ổ cứng</em> ảo gắn vào EC2 — như đĩa vật lý. Dùng cho HĐH và cơ sở dữ liệu chạy trên EC2.</p>
<div class="callout"><span class="badge">Object vs Block</span> S3 (object) = cả file qua HTTP, hợp quy mô &amp; chia sẻ, không có hệ thống tệp. EBS (block) = đĩa cho MỘT instance, đọc/ghi độ trễ thấp, có hệ thống tệp. Việc khác nhau.</div>`,
  ]]);

const c2q = quiz('prc392c-quiz-2', 'Quiz 2 — Storage|||Quiz 2 — Lưu trữ', [
  { id: 'q1', question: 'Lưu file media, backup, data lake với độ bền 11 số 9 dùng?', options: ['EBS', 'Amazon S3 (object storage)', 'RAM', 'Security group'], correctIndex: 1, explanation: 'S3 là object storage, 99,999999999% durability.' },
  { id: 'q2', question: 'Dữ liệu lưu trữ ít truy cập, muốn rẻ nhất nên dùng storage class?', options: ['Standard', 'Glacier (archive)', 'EBS', 'DynamoDB'], correctIndex: 1, explanation: 'Glacier rẻ nhất cho archive, lấy ra chậm hơn.' },
  { id: 'q3', question: 'EBS là loại lưu trữ gì?', options: ['Object storage', 'Block storage (đĩa gắn EC2)', 'CDN', 'Message queue'], correctIndex: 1, explanation: 'EBS = block storage, như ổ cứng cho một instance.' },
]);

const c3 = doc('prc392c-3-1-database', '3.1 — Databases: RDS & DynamoDB|||3.1 — Cơ sở dữ liệu: RDS & DynamoDB',
  'RDS (SQL được quản lý: MySQL/PostgreSQL, Multi-AZ, read replica) và DynamoDB (NoSQL key-value, co giãn tự động); chọn SQL hay NoSQL.',
  [[
    `<span class="eyebrow">PRC392c · Chapter 3 · Lesson 3.1</span>
<h2>Databases — RDS &amp; DynamoDB</h2>
<h3>Amazon RDS — managed SQL</h3>
<p><strong>RDS</strong> (Relational Database Service) runs a managed SQL engine (MySQL, PostgreSQL, SQL Server, Oracle, MariaDB). AWS handles backups, patching, and failover. <strong>Multi-AZ</strong> keeps a standby copy in another Availability Zone for high availability; <strong>read replicas</strong> scale read traffic.</p>
<h3>Amazon DynamoDB — managed NoSQL</h3>
<p><strong>DynamoDB</strong> is a fully-managed <strong>key-value / document</strong> NoSQL database with single-digit-millisecond latency at any scale. No servers, no capacity planning (on-demand mode). Great for high-throughput, simple-access-pattern workloads (sessions, carts, IoT, leaderboards).</p>
<table><thead><tr><th></th><th>RDS (SQL)</th><th>DynamoDB (NoSQL)</th></tr></thead><tbody>
<tr><td>Model</td><td>Tables + relations, JOINs</td><td>Key-value / document</td></tr>
<tr><td>Query</td><td>Flexible SQL</td><td>By key (fast), limited queries</td></tr>
<tr><td>Scale</td><td>Vertical + read replicas</td><td>Horizontal, automatic</td></tr>
<tr><td>Best for</td><td>Complex relations, reporting</td><td>Huge scale, simple lookups</td></tr>
</tbody></table>
<div class="callout"><span class="badge">Rule of thumb</span> Need JOINs, transactions across tables, ad-hoc reporting? → RDS. Need massive scale with a known access key and predictable latency? → DynamoDB.</div>`,
    `<span class="eyebrow">PRC392c · Chương 3 · Bài 3.1</span>
<h2>Cơ sở dữ liệu — RDS &amp; DynamoDB</h2>
<h3>Amazon RDS — SQL được quản lý</h3>
<p><strong>RDS</strong> chạy engine SQL được quản lý (MySQL, PostgreSQL, SQL Server, Oracle, MariaDB). AWS lo sao lưu, vá lỗi, chuyển đổi dự phòng. <strong>Multi-AZ</strong> giữ một bản dự phòng ở Availability Zone khác để sẵn sàng cao; <strong>read replica</strong> co giãn lưu lượng đọc.</p>
<h3>Amazon DynamoDB — NoSQL được quản lý</h3>
<p><strong>DynamoDB</strong> là NoSQL <strong>key-value / document</strong> quản lý hoàn toàn, độ trễ một chữ số mili-giây ở mọi quy mô. Không máy chủ, không phải hoạch định dung lượng (chế độ on-demand). Hợp tải thông lượng cao, mẫu truy cập đơn giản (phiên, giỏ hàng, IoT, bảng xếp hạng).</p>
<table><thead><tr><th></th><th>RDS (SQL)</th><th>DynamoDB (NoSQL)</th></tr></thead><tbody>
<tr><td>Mô hình</td><td>Bảng + quan hệ, JOIN</td><td>Key-value / document</td></tr>
<tr><td>Truy vấn</td><td>SQL linh hoạt</td><td>Theo key (nhanh), truy vấn hạn chế</td></tr>
<tr><td>Co giãn</td><td>Dọc + read replica</td><td>Ngang, tự động</td></tr>
<tr><td>Hợp cho</td><td>Quan hệ phức tạp, báo cáo</td><td>Quy mô lớn, tra cứu đơn giản</td></tr>
</tbody></table>
<div class="callout"><span class="badge">Kinh nghiệm</span> Cần JOIN, giao dịch nhiều bảng, báo cáo tuỳ biến? → RDS. Cần quy mô khổng lồ với key truy cập biết trước, độ trễ ổn định? → DynamoDB.</div>`,
  ]]);

const c3q = quiz('prc392c-quiz-3', 'Quiz 3 — Database|||Quiz 3 — CSDL', [
  { id: 'q1', question: 'Cần JOIN, giao dịch nhiều bảng, báo cáo tuỳ biến nên chọn?', options: ['DynamoDB', 'Amazon RDS (SQL)', 'S3', 'Lambda'], correctIndex: 1, explanation: 'RDS là SQL quan hệ, hợp JOIN/giao dịch/báo cáo.' },
  { id: 'q2', question: 'DynamoDB là loại cơ sở dữ liệu?', options: ['SQL quan hệ', 'NoSQL key-value/document', 'Đồ thị', 'Cột'], correctIndex: 1, explanation: 'DynamoDB NoSQL key-value, co giãn ngang tự động.' },
  { id: 'q3', question: 'Multi-AZ trong RDS dùng để?', options: ['Giảm giá', 'Sẵn sàng cao (bản dự phòng ở AZ khác)', 'Tăng CPU', 'Nén dữ liệu'], correctIndex: 1, explanation: 'Multi-AZ = standby ở AZ khác, tự failover.' },
]);

const c4 = doc('prc392c-4-1-network-architecture', '4.1 — Networking & well-architected design|||4.1 — Mạng & thiết kế well-architected',
  'VPC/subnet/IGW/security group, vùng & AZ, CDN CloudFront, IAM; và 6 trụ Well-Architected Framework (bảo mật, tin cậy, hiệu năng, chi phí, vận hành, bền vững).',
  [[
    `<span class="eyebrow">PRC392c · Chapter 4 · Lesson 4.1</span>
<h2>Networking &amp; architecting solutions</h2>
<h3>The building blocks</h3>
<ul>
<li><strong>Region &amp; Availability Zone (AZ)</strong> — a Region is a geographic area (e.g. ap-southeast-1); each has multiple isolated AZs (data centers). Spread across AZs for resilience.</li>
<li><strong>VPC</strong> (Virtual Private Cloud) — your private network in AWS, split into <strong>subnets</strong> (public/private). An <strong>Internet Gateway</strong> connects public subnets to the internet.</li>
<li><strong>IAM</strong> (Identity &amp; Access Management) — users, roles, and least-privilege policies. Give an EC2 instance a <strong>role</strong> instead of hard-coding keys.</li>
<li><strong>CloudFront</strong> — a global CDN that caches content near users.</li>
</ul>
<h3>The Well-Architected Framework</h3>
<p>AWS's checklist for good design has <strong>six pillars</strong>: <strong>Operational excellence</strong>, <strong>Security</strong>, <strong>Reliability</strong>, <strong>Performance efficiency</strong>, <strong>Cost optimization</strong>, and <strong>Sustainability</strong>. A solid architecture: uses multiple AZs, applies least-privilege IAM, encrypts data, auto-scales, and monitors with CloudWatch.</p>
<div class="callout"><span class="badge">Exam tip</span> When a question asks "the BEST solution," map it to the pillars: highly available → multi-AZ; secure → IAM roles + encryption; cost → right-size + Glacier/Spot; performance → caching + the right instance/DB.</div>`,
    `<span class="eyebrow">PRC392c · Chương 4 · Bài 4.1</span>
<h2>Mạng &amp; kiến trúc giải pháp</h2>
<h3>Các khối cơ bản</h3>
<ul>
<li><strong>Region &amp; Availability Zone (AZ)</strong> — Region là vùng địa lý (vd ap-southeast-1); mỗi vùng có nhiều AZ (trung tâm dữ liệu) tách biệt. Trải qua nhiều AZ để bền.</li>
<li><strong>VPC</strong> — mạng riêng của bạn trong AWS, chia thành <strong>subnet</strong> (công khai/riêng). <strong>Internet Gateway</strong> nối subnet công khai ra internet.</li>
<li><strong>IAM</strong> — người dùng, vai trò (role), chính sách quyền tối thiểu. Cho EC2 một <strong>role</strong> thay vì nhúng cứng khoá.</li>
<li><strong>CloudFront</strong> — CDN toàn cầu, cache nội dung gần người dùng.</li>
</ul>
<h3>Well-Architected Framework</h3>
<p>Bộ tiêu chí thiết kế tốt của AWS gồm <strong>sáu trụ cột</strong>: <strong>Xuất sắc vận hành</strong>, <strong>Bảo mật</strong>, <strong>Độ tin cậy</strong>, <strong>Hiệu năng</strong>, <strong>Tối ưu chi phí</strong>, <strong>Bền vững</strong>. Kiến trúc vững: dùng nhiều AZ, áp IAM quyền tối thiểu, mã hoá dữ liệu, tự co giãn, giám sát bằng CloudWatch.</p>
<div class="callout"><span class="badge">Mẹo thi</span> Khi hỏi "giải pháp TỐT NHẤT", ánh xạ vào các trụ cột: sẵn sàng cao → multi-AZ; bảo mật → IAM role + mã hoá; chi phí → chọn đúng cỡ + Glacier/Spot; hiệu năng → cache + đúng instance/DB.</div>`,
  ]]);

const c5 = doc('prc392c-5-1-datalake-exam', '5.1 — Data lakes & exam strategy|||5.1 — Data lake & chiến lược thi',
  'Data lake trên S3 + Glue (catalog) + Athena (SQL trên S3) + QuickSight (BI); và chiến lược làm bài thi AWS (loại đáp án, từ khoá, quản thời gian).',
  [[
    `<span class="eyebrow">PRC392c · Chapter 5 · Lesson 5.1</span>
<h2>Data lakes &amp; exam strategy</h2>
<h3>Building a data lake</h3>
<p>A <strong>data lake</strong> stores raw data of any format cheaply and lets you analyze it later. On AWS the pattern is:</p>
<ul>
<li><strong>S3</strong> — the storage layer (raw + processed zones).</li>
<li><strong>AWS Glue</strong> — a serverless ETL service + a <strong>Data Catalog</strong> (schema of what's in S3).</li>
<li><strong>Amazon Athena</strong> — run <strong>SQL directly on S3</strong> files, pay per query scanned. No servers.</li>
<li><strong>QuickSight</strong> — dashboards / BI on top.</li>
</ul>
<pre><code class="language-sql">-- Athena: query CSV/Parquet files sitting in S3
SELECT country, COUNT(*) AS orders
FROM sales
WHERE year = 2026
GROUP BY country
ORDER BY orders DESC;
</code></pre>
<h3>Exam strategy</h3>
<ol>
<li><strong>Read the last sentence first</strong> — it states what's actually being asked (cost? HA? least effort?).</li>
<li><strong>Eliminate wrong answers</strong> — options that break shared-responsibility, or use a service for the wrong job, go first.</li>
<li><strong>Watch keywords</strong>: "most cost-effective," "least operational overhead" (→ managed/serverless), "highly available" (→ multi-AZ), "real-time."</li>
<li><strong>Manage time</strong> — flag hard questions, answer everything (no penalty for guessing).</li>
</ol>`,
    `<span class="eyebrow">PRC392c · Chương 5 · Bài 5.1</span>
<h2>Data lake &amp; chiến lược thi</h2>
<h3>Dựng một data lake</h3>
<p>Một <strong>data lake</strong> lưu dữ liệu thô mọi định dạng với chi phí rẻ và cho phân tích về sau. Trên AWS mẫu là:</p>
<ul>
<li><strong>S3</strong> — tầng lưu trữ (vùng thô + đã xử lý).</li>
<li><strong>AWS Glue</strong> — ETL serverless + một <strong>Data Catalog</strong> (lược đồ những gì có trong S3).</li>
<li><strong>Amazon Athena</strong> — chạy <strong>SQL thẳng trên file S3</strong>, trả tiền theo dữ liệu quét mỗi truy vấn. Không máy chủ.</li>
<li><strong>QuickSight</strong> — dashboard / BI phía trên.</li>
</ul>
<pre><code class="language-sql">-- Athena: truy vấn file CSV/Parquet nằm trong S3
SELECT country, COUNT(*) AS orders
FROM sales
WHERE year = 2026
GROUP BY country
ORDER BY orders DESC;
</code></pre>
<h3>Chiến lược thi</h3>
<ol>
<li><strong>Đọc câu cuối trước</strong> — nó nói đề thật sự hỏi gì (chi phí? sẵn sàng cao? ít công nhất?).</li>
<li><strong>Loại đáp án sai</strong> — cái phá vỡ trách nhiệm chia sẻ, hoặc dùng dịch vụ sai việc, loại trước.</li>
<li><strong>Bắt từ khoá</strong>: "most cost-effective," "least operational overhead" (→ managed/serverless), "highly available" (→ multi-AZ), "real-time."</li>
<li><strong>Quản thời gian</strong> — đánh dấu câu khó, trả lời hết (đoán không bị trừ điểm).</li>
</ol>`,
  ]]);

const c5q = quiz('prc392c-quiz-5', 'Quiz 5 — Data lake & architecture|||Quiz 5 — Data lake & kiến trúc', [
  { id: 'q1', question: 'Chạy SQL trực tiếp trên file trong S3, trả tiền theo truy vấn, không máy chủ?', options: ['RDS', 'Amazon Athena', 'EC2', 'CloudFront'], correctIndex: 1, explanation: 'Athena chạy SQL serverless trên dữ liệu S3.' },
  { id: 'q2', question: '"Least operational overhead" trong đề AWS thường ám chỉ chọn?', options: ['Tự dựng trên EC2', 'Dịch vụ managed/serverless', 'Nhiều máy vật lý', 'Tắt giám sát'], correctIndex: 1, explanation: 'Ít công vận hành → ưu tiên managed/serverless.' },
  { id: 'q3', question: 'Nguyên tắc IAM nên áp dụng?', options: ['Cấp full quyền cho tiện', 'Quyền tối thiểu (least privilege) + dùng role', 'Nhúng cứng access key vào mã', 'Dùng chung một user'], correctIndex: 1, explanation: 'Least privilege + role, không nhúng khoá.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'PRC392c',
    slug: 'prc392c-cloud-computing',
    title: 'Cloud Computing',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/PRC392c.webp',
    shortDescription: 'Cloud computing on AWS — compute (EC2/Lambda), storage (S3/EBS), databases (RDS/DynamoDB), networking & the Well-Architected Framework, data lakes (Glue/Athena) and exam strategy. Bilingual, with CLI examples & quizzes.|||Điện toán đám mây trên AWS — compute (EC2/Lambda), lưu trữ (S3/EBS), CSDL (RDS/DynamoDB), mạng & Well-Architected, data lake (Glue/Athena) và chiến lược thi. Song ngữ, có ví dụ CLI & quiz.',
    description: 'Môn <strong>PRC392c — Cloud Computing (AWS)</strong> (kỳ 4). Từ khái niệm đám mây (IaaS/PaaS/SaaS, trách nhiệm chia sẻ) đến các dịch vụ lõi của AWS: <strong>Compute</strong> (EC2, Lambda, Auto Scaling) → <strong>Storage</strong> (S3, EBS, storage class) → <strong>Database</strong> (RDS, DynamoDB) → <strong>Networking &amp; kiến trúc</strong> (VPC, IAM, CloudFront, Well-Architected 6 trụ) → <strong>Data lake &amp; phân tích</strong> (Glue, Athena, QuickSight) và <strong>chiến lược làm bài thi</strong>. Song ngữ, có ví dụ AWS CLI/SQL và quiz mỗi chương. Nền cho chứng chỉ AWS Cloud Practitioner / Solutions Architect Associate.',
    whatYouLearn: 'Mô hình dịch vụ & trách nhiệm chia sẻ; EC2/AMI/security group/Auto Scaling; Lambda serverless; S3 (bucket/key/durability/storage class/versioning) & EBS; RDS (Multi-AZ/replica) vs DynamoDB (NoSQL); VPC/subnet/IGW/IAM/CloudFront; 6 trụ Well-Architected; data lake S3+Glue+Athena+QuickSight; chiến lược thi (loại đáp án, bắt từ khoá).',
    requirements: 'Hiểu cơ bản về web/mạng và một chút SQL. Không cần kinh nghiệm AWS trước. Nên có tài khoản AWS Free Tier để thực hành.',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Đám mây, mô hình dịch vụ, vì sao AWS.', lessons: [intro] },
    { title: 'Chương 1 — Compute (EC2 & Lambda)|||Chapter 1 — Compute', description: 'Máy ảo, serverless, auto scaling.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Storage (S3 & EBS)|||Chapter 2 — Storage', description: 'Object vs block, storage class.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Database (RDS & DynamoDB)|||Chapter 3 — Databases', description: 'SQL managed vs NoSQL.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Mạng & kiến trúc|||Chapter 4 — Networking & architecture', description: 'VPC, IAM, Well-Architected.', lessons: [c4] },
    { title: 'Chương 5 — Data lake & thi|||Chapter 5 — Data lakes & exam', description: 'Glue/Athena/QuickSight, chiến lược thi.', lessons: [c5, c5q] },
  ],
};
