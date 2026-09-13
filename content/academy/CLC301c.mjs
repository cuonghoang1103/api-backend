/**
 * CLC301c — Cloud Computing (Điện toán đám mây). Ngành Khoa học Máy tính FPTU,
 * kỳ 7. Khung chất lượng — 8 chương, song ngữ VI+EN, ví dụ thật AWS/Azure/GCP.
 * Tài liệu: Thomas Erl "Cloud Computing: Concepts, Technology & Architecture";
 * docs chính thức AWS/Azure/GCP; CNCF "Cloud Native"; Kubernetes docs.
 * Giữ NGUYÊN slug/semester/courseCode/thumb(v3). ⚠️ KHÔNG backtick/${; "&"→&amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('clc301c-0-1-overview', 'Course overview: Cloud computing|||Tổng quan: Điện toán đám mây',
  'Đám mây giải quyết vấn đề gì; lộ trình 4 bước: nền tảng & mô hình → ảo hoá/container → compute/lưu trữ/mạng/bảo mật → cloud-native, Kubernetes, chi phí & vận hành.',
  [[
    `<span class="eyebrow">CLC301c · Lesson 0.1 · Overview</span>
<h2>Cloud Computing</h2>
<p class="lead">This course explains <strong>how the cloud actually works</strong> — the model behind Netflix, Spotify and almost every modern app. Instead of buying servers, you <strong>rent computing, storage and networking on demand</strong> from a provider like AWS, Microsoft Azure or Google Cloud, and pay only for what you use.</p>
<h3>Why the cloud won</h3>
<ul>
<li><strong>No upfront hardware</strong> — spin up a server in seconds, delete it when done.</li>
<li><strong>Elastic scale</strong> — grow from 1 to 1000 servers for a traffic spike, then shrink back.</li>
<li><strong>Pay-as-you-go</strong> — turn capital expense (buying machines) into operating expense (a monthly bill).</li>
</ul>
<h3>Roadmap (4 steps)</h3>
<p>Fundamentals &amp; models (NIST, IaaS/PaaS/SaaS, deployment models) → virtualization &amp; containers (VM, hypervisor, Docker) → compute, storage, networking &amp; security → cloud-native design, Kubernetes, cost &amp; operations. Bilingual, with real AWS/Azure/GCP examples and a quiz per chapter.</p>`,
    `<span class="eyebrow">CLC301c · Bài 0.1 · Tổng quan</span>
<h2>Điện toán đám mây</h2>
<p class="lead">Môn này giải thích <strong>đám mây thật sự hoạt động thế nào</strong> — mô hình đứng sau Netflix, Spotify và gần như mọi ứng dụng hiện đại. Thay vì mua máy chủ, bạn <strong>thuê tài nguyên tính toán, lưu trữ và mạng theo nhu cầu</strong> từ nhà cung cấp như AWS, Microsoft Azure hay Google Cloud, và chỉ trả tiền cho phần dùng đến.</p>
<h3>Vì sao đám mây thắng</h3>
<ul>
<li><strong>Không tốn phần cứng ban đầu</strong> — dựng một máy chủ trong vài giây, xoá đi khi xong.</li>
<li><strong>Co giãn linh hoạt</strong> — tăng từ 1 lên 1000 máy chủ cho một đợt tải cao rồi thu nhỏ lại.</li>
<li><strong>Trả theo mức dùng</strong> — biến chi phí vốn (mua máy) thành chi phí vận hành (hoá đơn hằng tháng).</li>
</ul>
<h3>Lộ trình (4 bước)</h3>
<p>Nền tảng &amp; mô hình (NIST, IaaS/PaaS/SaaS, mô hình triển khai) → ảo hoá &amp; container (VM, hypervisor, Docker) → compute, lưu trữ, mạng &amp; bảo mật → kiến trúc cloud-native, Kubernetes, chi phí &amp; vận hành. Song ngữ, có ví dụ thật AWS/Azure/GCP và một quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('clc301c-1-1-what-is-cloud', '1.1 — What is cloud computing?|||1.1 — Điện toán đám mây là gì?',
  'Định nghĩa NIST, 5 đặc điểm cốt lõi, on-premise so với cloud, lịch sử ngắn (mainframe → ảo hoá → AWS 2006).',
  [[
    `<span class="eyebrow">CLC301c · Chapter 1 · Lesson 1.1</span>
<h2>What is cloud computing?</h2>
<h3>The NIST definition</h3>
<p>The US <strong>NIST</strong> gives the standard definition: cloud computing is <em>on-demand network access to a shared pool of configurable computing resources</em> (servers, storage, networks) that can be provisioned and released quickly with minimal effort.</p>
<h3>The 5 essential characteristics</h3>
<ul>
<li><strong>On-demand self-service</strong> — get resources yourself, no phone call to IT.</li>
<li><strong>Broad network access</strong> — reachable over the internet from any device.</li>
<li><strong>Resource pooling</strong> — the provider serves many tenants from one shared pool (multi-tenancy).</li>
<li><strong>Rapid elasticity</strong> — scale out and in automatically as load changes.</li>
<li><strong>Measured service</strong> — usage is metered, so you pay for what you use.</li>
</ul>
<h3>On-premise vs cloud</h3>
<pre><code>On-premise : you buy, rack, power, patch &amp; secure the servers
Cloud      : the provider owns the hardware; you rent capacity
Trade-off  : cloud = less control, but far less to operate
</code></pre>
<div class="callout"><span class="badge">A little history</span> Mainframe time-sharing (1960s) → hardware virtualization (VMware, 2000s) → Amazon launches <strong>AWS</strong> (S3 and EC2, 2006), turning rented infrastructure into a public product. Azure and Google Cloud followed.</div>`,
    `<span class="eyebrow">CLC301c · Chương 1 · Bài 1.1</span>
<h2>Điện toán đám mây là gì?</h2>
<h3>Định nghĩa NIST</h3>
<p>Viện <strong>NIST</strong> (Hoa Kỳ) đưa ra định nghĩa chuẩn: điện toán đám mây là <em>truy cập tài nguyên tính toán dùng chung qua mạng theo nhu cầu</em> (máy chủ, lưu trữ, mạng) — cấp phát và thu hồi nhanh, tốn rất ít công.</p>
<h3>5 đặc điểm cốt lõi</h3>
<ul>
<li><strong>Tự phục vụ theo nhu cầu</strong> — tự lấy tài nguyên, không phải gọi bộ phận IT.</li>
<li><strong>Truy cập mạng rộng</strong> — dùng được qua internet từ mọi thiết bị.</li>
<li><strong>Gom tài nguyên dùng chung</strong> — nhà cung cấp phục vụ nhiều khách từ một bể chung (đa người thuê).</li>
<li><strong>Co giãn nhanh</strong> — tự động phình ra, thu vào theo tải.</li>
<li><strong>Dịch vụ đo đếm được</strong> — mức dùng được đo, nên bạn trả đúng phần đã dùng.</li>
</ul>
<h3>On-premise so với cloud</h3>
<pre><code>On-premise : bạn mua, lắp, cấp điện, vá &amp; bảo mật máy chủ
Cloud      : nhà cung cấp sở hữu phần cứng; bạn thuê năng lực
Đánh đổi   : cloud = ít quyền kiểm soát hơn, nhưng nhẹ vận hành hơn nhiều
</code></pre>
<div class="callout"><span class="badge">Chút lịch sử</span> Chia sẻ thời gian trên mainframe (1960) → ảo hoá phần cứng (VMware, 2000) → Amazon ra mắt <strong>AWS</strong> (S3 và EC2, 2006), biến hạ tầng cho thuê thành sản phẩm công khai. Azure và Google Cloud theo sau.</div>`,
  ]]);

const c1q = quiz('clc301c-quiz-1', 'Quiz 1 — What is cloud|||Quiz 1 — Đám mây là gì', [
  { id: 'q1', question: 'Đâu KHÔNG phải một trong 5 đặc điểm cốt lõi của cloud theo NIST?', options: ['Tự phục vụ theo nhu cầu', 'Co giãn nhanh', 'Miễn phí hoàn toàn', 'Dịch vụ đo đếm được'], correctIndex: 2, explanation: 'NIST: tự phục vụ, mạng rộng, gom tài nguyên, co giãn nhanh, đo đếm được — không có "miễn phí".' },
  { id: 'q2', question: 'Mô hình tính tiền đặc trưng của cloud là?', options: ['Trả theo mức dùng (pay-as-you-go)', 'Mua đứt phần cứng', 'Trả một lần trọn đời', 'Không tính tiền'], correctIndex: 0, explanation: 'Dịch vụ đo đếm được → trả tiền cho đúng phần tài nguyên đã dùng.' },
  { id: 'q3', question: 'Năm 2006 Amazon ra mắt dịch vụ nào đánh dấu cloud công khai?', options: ['VMware', 'AWS (S3 và EC2)', 'Kubernetes', 'Docker'], correctIndex: 1, explanation: 'AWS ra S3 và EC2 năm 2006, biến hạ tầng cho thuê thành sản phẩm công khai.' },
]);

const c2 = doc('clc301c-2-1-service-deployment-models', '2.1 — Service & deployment models|||2.1 — Mô hình dịch vụ & triển khai',
  'IaaS/PaaS/SaaS (bạn quản gì, nhà cung cấp quản gì); public/private/hybrid/multi-cloud; ví dụ EC2, App Service, Gmail.',
  [[
    `<span class="eyebrow">CLC301c · Chapter 2 · Lesson 2.1</span>
<h2>Service &amp; deployment models</h2>
<h3>The three service models</h3>
<ul>
<li><strong>IaaS</strong> (Infrastructure as a Service) — you rent raw virtual machines, disks and networks; you manage the OS and everything above. Example: <strong>AWS EC2</strong>, Azure Virtual Machines, Google Compute Engine.</li>
<li><strong>PaaS</strong> (Platform as a Service) — you push code; the platform runs it, no OS to manage. Example: <strong>Azure App Service</strong>, AWS Elastic Beanstalk, Google App Engine.</li>
<li><strong>SaaS</strong> (Software as a Service) — you just use finished software in a browser. Example: <strong>Gmail</strong>, Microsoft 365, Salesforce.</li>
</ul>
<pre><code>Who manages what (more you manage on the left):
  IaaS  -> you: OS, runtime, app, data   | provider: hardware, virtualization
  PaaS  -> you: app, data                | provider: OS, runtime, scaling
  SaaS  -> you: just your settings/data  | provider: everything else
</code></pre>
<h3>Deployment models</h3>
<ul>
<li><strong>Public cloud</strong> — shared provider infrastructure (AWS, Azure, GCP).</li>
<li><strong>Private cloud</strong> — dedicated to one organization (on-prem or hosted), for control &amp; compliance.</li>
<li><strong>Hybrid cloud</strong> — public + private linked together; keep sensitive data private, burst to public.</li>
<li><strong>Multi-cloud</strong> — using more than one public provider to avoid lock-in.</li>
</ul>
<div class="callout"><span class="badge">Rule of thumb</span> Move UP the stack (IaaS → PaaS → SaaS) to manage less and ship faster; move DOWN to get more control. Most teams mix all three.</div>`,
    `<span class="eyebrow">CLC301c · Chương 2 · Bài 2.1</span>
<h2>Mô hình dịch vụ &amp; triển khai</h2>
<h3>Ba mô hình dịch vụ</h3>
<ul>
<li><strong>IaaS</strong> (Hạ tầng dạng dịch vụ) — thuê máy ảo, đĩa, mạng thô; bạn tự quản hệ điều hành và mọi thứ bên trên. Ví dụ: <strong>AWS EC2</strong>, Azure Virtual Machines, Google Compute Engine.</li>
<li><strong>PaaS</strong> (Nền tảng dạng dịch vụ) — bạn đẩy mã lên; nền tảng chạy nó, không phải quản hệ điều hành. Ví dụ: <strong>Azure App Service</strong>, AWS Elastic Beanstalk, Google App Engine.</li>
<li><strong>SaaS</strong> (Phần mềm dạng dịch vụ) — chỉ việc dùng phần mềm hoàn chỉnh trên trình duyệt. Ví dụ: <strong>Gmail</strong>, Microsoft 365, Salesforce.</li>
</ul>
<pre><code>Ai quản gì (càng trái bạn quản càng nhiều):
  IaaS  -> bạn: OS, runtime, app, dữ liệu | nhà cc: phần cứng, ảo hoá
  PaaS  -> bạn: app, dữ liệu              | nhà cc: OS, runtime, co giãn
  SaaS  -> bạn: chỉ cấu hình/dữ liệu      | nhà cc: mọi thứ còn lại
</code></pre>
<h3>Mô hình triển khai</h3>
<ul>
<li><strong>Public cloud</strong> — hạ tầng dùng chung của nhà cung cấp (AWS, Azure, GCP).</li>
<li><strong>Private cloud</strong> — riêng cho một tổ chức (tại chỗ hoặc thuê), để kiểm soát &amp; tuân thủ.</li>
<li><strong>Hybrid cloud</strong> — nối public + private; giữ dữ liệu nhạy cảm ở private, tràn sang public khi cần.</li>
<li><strong>Multi-cloud</strong> — dùng nhiều nhà cung cấp public để tránh bị khoá chân.</li>
</ul>
<div class="callout"><span class="badge">Mẹo nhớ</span> Đi LÊN theo tầng (IaaS → PaaS → SaaS) để quản ít hơn và ra sản phẩm nhanh hơn; đi XUỐNG để kiểm soát nhiều hơn. Đa số đội dùng lẫn cả ba.</div>`,
  ]]);

const c2q = quiz('clc301c-quiz-2', 'Quiz 2 — Service & deployment models|||Quiz 2 — Mô hình dịch vụ & triển khai', [
  { id: 'q1', question: 'AWS EC2 (thuê máy ảo, tự quản hệ điều hành) thuộc mô hình nào?', options: ['SaaS', 'PaaS', 'IaaS', 'FaaS'], correctIndex: 2, explanation: 'Thuê hạ tầng thô, tự quản OS trở lên → IaaS.' },
  { id: 'q2', question: 'Gmail — phần mềm dùng ngay trên trình duyệt — là ví dụ của?', options: ['IaaS', 'PaaS', 'SaaS', 'On-premise'], correctIndex: 2, explanation: 'Phần mềm hoàn chỉnh, người dùng chỉ việc dùng → SaaS.' },
  { id: 'q3', question: 'Mô hình nối cloud riêng và cloud công khai lại với nhau gọi là?', options: ['Public cloud', 'Hybrid cloud', 'Private cloud', 'Edge cloud'], correctIndex: 1, explanation: 'Hybrid = kết hợp private + public, dữ liệu nhạy cảm ở private.' },
]);

const c3 = doc('clc301c-3-1-virtualization-containers', '3.1 — Virtualization & containers|||3.1 — Ảo hoá & container',
  'Ảo hoá là gì, hypervisor type 1/2, máy ảo (VM); container so với VM; Docker (image, container, Dockerfile).',
  [[
    `<span class="eyebrow">CLC301c · Chapter 3 · Lesson 3.1</span>
<h2>Virtualization &amp; containers</h2>
<h3>Virtualization — one machine, many machines</h3>
<p><strong>Virtualization</strong> lets one physical server run many isolated <strong>virtual machines (VMs)</strong>. A <strong>hypervisor</strong> creates and manages them: <em>type 1</em> runs on bare metal (VMware ESXi, KVM, Hyper-V — used in data centres); <em>type 2</em> runs on top of a normal OS (VirtualBox). This is the engine under every IaaS.</p>
<h3>Containers — lighter than VMs</h3>
<p>A <strong>container</strong> packages an app with its dependencies but <em>shares the host OS kernel</em>, so it is far smaller and starts in milliseconds. A VM virtualizes hardware; a container virtualizes the operating system.</p>
<pre><code>VM         : full guest OS per app -> GBs, boots in seconds/minutes
Container  : shares host kernel     -> MBs, starts in milliseconds
</code></pre>
<h3>Docker</h3>
<p><strong>Docker</strong> is the standard container tool. You describe an image in a <strong>Dockerfile</strong>, build it, then run it identically on any machine.</p>
<pre><code># Dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm ci
CMD ["node", "server.js"]

docker build -t myapp .
docker run -p 3000:3000 myapp
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Containers solved "it works on my machine" — the same image runs on a laptop, a CI runner and a production cluster. This portability is what makes Kubernetes (Chapter 7) possible.</div>`,
    `<span class="eyebrow">CLC301c · Chương 3 · Bài 3.1</span>
<h2>Ảo hoá &amp; container</h2>
<h3>Ảo hoá — một máy hoá nhiều máy</h3>
<p><strong>Ảo hoá</strong> cho một máy chủ vật lý chạy nhiều <strong>máy ảo (VM)</strong> cô lập. Một <strong>hypervisor</strong> tạo và quản chúng: <em>type 1</em> chạy thẳng trên phần cứng (VMware ESXi, KVM, Hyper-V — dùng trong trung tâm dữ liệu); <em>type 2</em> chạy trên một hệ điều hành thường (VirtualBox). Đây là động cơ dưới mọi IaaS.</p>
<h3>Container — nhẹ hơn VM</h3>
<p>Một <strong>container</strong> đóng gói ứng dụng cùng thư viện phụ thuộc nhưng <em>dùng chung nhân (kernel) của máy chủ</em>, nên nhỏ hơn nhiều và khởi động trong mili-giây. VM ảo hoá phần cứng; container ảo hoá hệ điều hành.</p>
<pre><code>VM         : mỗi app một OS khách đầy đủ -> nhiều GB, khởi động giây/phút
Container  : dùng chung kernel máy chủ    -> vài MB, chạy trong mili-giây
</code></pre>
<h3>Docker</h3>
<p><strong>Docker</strong> là công cụ container tiêu chuẩn. Bạn mô tả một image trong <strong>Dockerfile</strong>, build nó, rồi chạy y hệt trên mọi máy.</p>
<pre><code># Dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm ci
CMD ["node", "server.js"]

docker build -t myapp .
docker run -p 3000:3000 myapp
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Container xoá bỏ câu "máy tôi chạy được mà" — cùng một image chạy trên laptop, máy CI và cụm production. Chính tính di động này làm Kubernetes (Chương 7) khả thi.</div>`,
  ]]);

const c3q = quiz('clc301c-quiz-3', 'Quiz 3 — Virtualization & containers|||Quiz 3 — Ảo hoá & container', [
  { id: 'q1', question: 'Thành phần tạo và quản lý các máy ảo trên một máy chủ vật lý là?', options: ['Container runtime', 'Hypervisor', 'Load balancer', 'Kernel'], correctIndex: 1, explanation: 'Hypervisor tạo/quản VM; type 1 chạy bare-metal, type 2 trên OS thường.' },
  { id: 'q2', question: 'Khác biệt cốt lõi giữa container và máy ảo là?', options: ['Container dùng chung kernel máy chủ, VM có OS khách riêng', 'Container luôn to hơn VM', 'VM khởi động nhanh hơn container', 'Không có khác biệt'], correctIndex: 0, explanation: 'Container chia sẻ kernel → nhẹ và khởi động mili-giây; VM ảo hoá cả phần cứng.' },
  { id: 'q3', question: 'File dùng để mô tả cách build một Docker image tên là?', options: ['docker-compose', 'Makefile', 'Dockerfile', 'package.json'], correctIndex: 2, explanation: 'Dockerfile khai các bước dựng image (FROM, COPY, RUN, CMD).' },
]);

const c4 = doc('clc301c-4-1-compute-storage', '4.1 — Cloud compute & storage|||4.1 — Điện toán & lưu trữ đám mây',
  'Compute (EC2/VM, auto scaling); lưu trữ đối tượng S3/Blob so với block/file; database dịch vụ (RDS, Cosmos DB, Cloud SQL).',
  [[
    `<span class="eyebrow">CLC301c · Chapter 4 · Lesson 4.1</span>
<h2>Cloud compute &amp; storage</h2>
<h3>Compute — where code runs</h3>
<p>The core compute service is a rented virtual machine: <strong>AWS EC2</strong>, <strong>Azure VM</strong>, <strong>Google Compute Engine</strong>. You pick a size (vCPU + RAM), an image, and a region. An <strong>Auto Scaling group</strong> then adds or removes identical VMs automatically as traffic changes.</p>
<h3>Storage — three shapes</h3>
<ul>
<li><strong>Object storage</strong> — files (images, backups, video) addressed by a key. Cheap, huge, HTTP-accessible. <strong>AWS S3</strong>, Azure Blob Storage, Google Cloud Storage.</li>
<li><strong>Block storage</strong> — a raw virtual disk attached to a VM. <strong>AWS EBS</strong>, Azure Managed Disks.</li>
<li><strong>File storage</strong> — a shared network filesystem. AWS EFS, Azure Files.</li>
</ul>
<pre><code># Upload a file to an S3 bucket
aws s3 cp report.pdf s3://my-bucket/reports/report.pdf

# List objects
aws s3 ls s3://my-bucket/reports/
</code></pre>
<h3>Managed databases</h3>
<p>Instead of installing a database on a VM, rent a <strong>managed</strong> one — the provider handles patching, backups and replication: <strong>AWS RDS</strong> (PostgreSQL/MySQL), <strong>Azure Cosmos DB</strong>, <strong>Google Cloud SQL</strong>.</p>
<div class="callout"><span class="badge">Pick by shape</span> Serving user uploads? Object storage (S3). Need a disk for a database VM? Block storage. Need a relational DB without the ops? A managed database.</div>`,
    `<span class="eyebrow">CLC301c · Chương 4 · Bài 4.1</span>
<h2>Điện toán &amp; lưu trữ đám mây</h2>
<h3>Compute — nơi mã chạy</h3>
<p>Dịch vụ compute cốt lõi là một máy ảo thuê: <strong>AWS EC2</strong>, <strong>Azure VM</strong>, <strong>Google Compute Engine</strong>. Bạn chọn cỡ (vCPU + RAM), một image, và một vùng (region). Một <strong>Auto Scaling group</strong> sau đó tự thêm/bớt các VM giống nhau theo lưu lượng.</p>
<h3>Lưu trữ — ba dạng</h3>
<ul>
<li><strong>Lưu trữ đối tượng</strong> — tệp (ảnh, sao lưu, video) truy cập theo khoá. Rẻ, khổng lồ, gọi qua HTTP. <strong>AWS S3</strong>, Azure Blob Storage, Google Cloud Storage.</li>
<li><strong>Lưu trữ khối (block)</strong> — một đĩa ảo thô gắn vào VM. <strong>AWS EBS</strong>, Azure Managed Disks.</li>
<li><strong>Lưu trữ tệp (file)</strong> — hệ thống tệp mạng dùng chung. AWS EFS, Azure Files.</li>
</ul>
<pre><code># Tải một tệp lên bucket S3
aws s3 cp report.pdf s3://my-bucket/reports/report.pdf

# Liệt kê đối tượng
aws s3 ls s3://my-bucket/reports/
</code></pre>
<h3>Database dịch vụ (managed)</h3>
<p>Thay vì cài database lên VM, hãy thuê bản <strong>managed</strong> — nhà cung cấp lo vá lỗi, sao lưu và nhân bản: <strong>AWS RDS</strong> (PostgreSQL/MySQL), <strong>Azure Cosmos DB</strong>, <strong>Google Cloud SQL</strong>.</p>
<div class="callout"><span class="badge">Chọn theo dạng</span> Phục vụ tệp người dùng tải lên? Lưu trữ đối tượng (S3). Cần đĩa cho VM database? Lưu trữ khối. Cần DB quan hệ mà không phải vận hành? Database managed.</div>`,
  ]]);

const c4q = quiz('clc301c-quiz-4', 'Quiz 4 — Compute & storage|||Quiz 4 — Điện toán & lưu trữ', [
  { id: 'q1', question: 'Để lưu ảnh và tệp người dùng tải lên (truy cập theo khoá, qua HTTP), nên dùng?', options: ['Lưu trữ khối (block)', 'Lưu trữ đối tượng như S3', 'Đĩa EBS', 'RAM'], correctIndex: 1, explanation: 'Lưu trữ đối tượng (S3/Blob/GCS) hợp cho tệp lớn, truy cập theo khoá qua HTTP.' },
  { id: 'q2', question: 'Auto Scaling group dùng để làm gì?', options: ['Mã hoá dữ liệu', 'Tự thêm/bớt VM theo lưu lượng', 'Sao lưu database', 'Định tuyến DNS'], correctIndex: 1, explanation: 'Auto Scaling tự tăng/giảm số VM giống nhau theo tải.' },
  { id: 'q3', question: 'Lợi ích chính của database "managed" (AWS RDS, Cloud SQL) là?', options: ['Miễn phí vĩnh viễn', 'Nhà cung cấp lo vá lỗi, sao lưu, nhân bản', 'Chạy nhanh gấp 10 lần mọi DB', 'Không cần schema'], correctIndex: 1, explanation: 'Managed = nhà cung cấp gánh việc vận hành (patch/backup/replication).' },
]);

const c5 = doc('clc301c-5-1-networking-security', '5.1 — Cloud networking & security|||5.1 — Mạng & bảo mật đám mây',
  'VPC/subnet, load balancer; IAM (danh tính & quyền), security group/firewall; mã hoá khi truyền và khi lưu; mô hình chia sẻ trách nhiệm.',
  [[
    `<span class="eyebrow">CLC301c · Chapter 5 · Lesson 5.1</span>
<h2>Cloud networking &amp; security</h2>
<h3>Networking — your private slice</h3>
<ul>
<li><strong>VPC</strong> (Virtual Private Cloud) — your own isolated network in the cloud, split into <strong>subnets</strong> (public vs private).</li>
<li><strong>Load balancer</strong> — spreads incoming traffic across many VMs and skips unhealthy ones. AWS ELB, Azure Load Balancer.</li>
<li><strong>Security group</strong> — a virtual firewall on each resource: which ports/IPs may connect.</li>
</ul>
<h3>IAM — who can do what</h3>
<p><strong>IAM</strong> (Identity and Access Management) controls <em>identity</em> (users, roles, services) and <em>permissions</em>. The golden rule is <strong>least privilege</strong>: grant only the access actually needed.</p>
<pre><code>// An IAM policy: allow read-only on ONE bucket
{
  "Effect": "Allow",
  "Action": ["s3:GetObject"],
  "Resource": "arn:aws:s3:::my-bucket/*"
}
</code></pre>
<h3>Encryption &amp; shared responsibility</h3>
<p>Encrypt data <strong>in transit</strong> (TLS/HTTPS) and <strong>at rest</strong> (disk/bucket encryption). Under the <strong>shared responsibility model</strong>, the provider secures the cloud (hardware, data centre) and <em>you</em> secure what is in it (your configs, IAM, data).</p>
<div class="callout"><span class="badge">Most breaches are config</span> Public S3 buckets and over-broad IAM policies cause more incidents than provider hacks. Default to private and least privilege.</div>`,
    `<span class="eyebrow">CLC301c · Chương 5 · Bài 5.1</span>
<h2>Mạng &amp; bảo mật đám mây</h2>
<h3>Mạng — phần riêng của bạn</h3>
<ul>
<li><strong>VPC</strong> (Virtual Private Cloud) — mạng cô lập của riêng bạn trên cloud, chia thành các <strong>subnet</strong> (public so với private).</li>
<li><strong>Load balancer</strong> — rải lưu lượng vào cho nhiều VM và bỏ qua máy không khoẻ. AWS ELB, Azure Load Balancer.</li>
<li><strong>Security group</strong> — tường lửa ảo trên từng tài nguyên: cổng/IP nào được phép kết nối.</li>
</ul>
<h3>IAM — ai được làm gì</h3>
<p><strong>IAM</strong> (Quản lý danh tính và truy cập) kiểm soát <em>danh tính</em> (người dùng, vai trò, dịch vụ) và <em>quyền</em>. Nguyên tắc vàng là <strong>đặc quyền tối thiểu</strong>: chỉ cấp đúng quyền thật sự cần.</p>
<pre><code>// Một chính sách IAM: cho phép chỉ đọc trên MỘT bucket
{
  "Effect": "Allow",
  "Action": ["s3:GetObject"],
  "Resource": "arn:aws:s3:::my-bucket/*"
}
</code></pre>
<h3>Mã hoá &amp; chia sẻ trách nhiệm</h3>
<p>Mã hoá dữ liệu <strong>khi truyền</strong> (TLS/HTTPS) và <strong>khi lưu</strong> (mã hoá đĩa/bucket). Theo <strong>mô hình chia sẻ trách nhiệm</strong>, nhà cung cấp bảo vệ bản thân đám mây (phần cứng, trung tâm dữ liệu) còn <em>bạn</em> bảo vệ thứ nằm trong đó (cấu hình, IAM, dữ liệu).</p>
<div class="callout"><span class="badge">Đa số sự cố do cấu hình</span> Bucket S3 để công khai và chính sách IAM quá rộng gây ra nhiều sự cố hơn cả việc nhà cung cấp bị hack. Mặc định là riêng tư và đặc quyền tối thiểu.</div>`,
  ]]);

const c5q = quiz('clc301c-quiz-5', 'Quiz 5 — Networking & security|||Quiz 5 — Mạng & bảo mật', [
  { id: 'q1', question: 'VPC (Virtual Private Cloud) là gì?', options: ['Một loại database', 'Mạng cô lập riêng của bạn trên cloud', 'Công cụ giám sát', 'Một ngôn ngữ lập trình'], correctIndex: 1, explanation: 'VPC là mạng ảo cô lập, chia thành các subnet public/private.' },
  { id: 'q2', question: 'Nguyên tắc vàng của IAM là?', options: ['Cấp quyền admin cho mọi người', 'Đặc quyền tối thiểu (least privilege)', 'Không cần mật khẩu', 'Mở mọi cổng'], correctIndex: 1, explanation: 'Least privilege: chỉ cấp đúng quyền cần thiết, giảm rủi ro.' },
  { id: 'q3', question: 'Theo mô hình chia sẻ trách nhiệm, ai chịu trách nhiệm cấu hình IAM và dữ liệu?', options: ['Nhà cung cấp cloud', 'Khách hàng (bạn)', 'Không ai', 'Chính phủ'], correctIndex: 1, explanation: 'Nhà cung cấp lo hạ tầng; khách hàng lo cấu hình, IAM, dữ liệu của mình.' },
]);

const c6 = doc('clc301c-6-1-cloud-native', '6.1 — Cloud-native architecture|||6.1 — Kiến trúc cloud-native',
  'Microservices so với monolith; serverless/FaaS (AWS Lambda); API gateway; nguyên tắc 12-factor app; CNCF.',
  [[
    `<span class="eyebrow">CLC301c · Chapter 6 · Lesson 6.1</span>
<h2>Cloud-native architecture</h2>
<h3>Microservices</h3>
<p>Instead of one big <strong>monolith</strong>, a cloud-native app is split into small <strong>microservices</strong> — each owns one job, has its own database, and is deployed independently. They talk over the network (REST, gRPC, or a message queue). Trade-off: independent scaling and teams, but more moving parts to operate.</p>
<h3>Serverless (FaaS)</h3>
<p>With <strong>serverless</strong>, you deploy a single function and the provider runs it only when triggered, scaling to zero when idle — you pay per request, not per idle server. <strong>AWS Lambda</strong>, Azure Functions, Google Cloud Functions.</p>
<pre><code>// AWS Lambda handler (Node.js)
exports.handler = async (event) => {
  return { statusCode: 200, body: "Hello from Lambda" };
};
</code></pre>
<h3>API gateway &amp; the 12-factor app</h3>
<p>An <strong>API gateway</strong> is the single front door — routing, auth, and rate limiting for many services behind it. The <strong>12-factor app</strong> is the checklist for cloud-native design: config in the environment, stateless processes, logs as streams, and more.</p>
<div class="callout"><span class="badge">CNCF</span> The <strong>Cloud Native Computing Foundation</strong> hosts the ecosystem (Kubernetes, Prometheus, Envoy). "Cloud-native" means built to be scaled, replaced and automated — not just lifted onto a VM.</div>`,
    `<span class="eyebrow">CLC301c · Chương 6 · Bài 6.1</span>
<h2>Kiến trúc cloud-native</h2>
<h3>Microservices</h3>
<p>Thay vì một khối <strong>monolith</strong> to, ứng dụng cloud-native được chia thành các <strong>microservice</strong> nhỏ — mỗi cái lo một việc, có database riêng, và triển khai độc lập. Chúng nói chuyện qua mạng (REST, gRPC, hoặc hàng đợi tin nhắn). Đánh đổi: co giãn và đội ngũ độc lập, nhưng nhiều mảnh phải vận hành hơn.</p>
<h3>Serverless (FaaS)</h3>
<p>Với <strong>serverless</strong>, bạn triển khai một hàm và nhà cung cấp chỉ chạy nó khi có sự kiện, thu về không khi rảnh — bạn trả tiền theo mỗi yêu cầu, không phải theo máy chủ chạy không. <strong>AWS Lambda</strong>, Azure Functions, Google Cloud Functions.</p>
<pre><code>// Hàm AWS Lambda (Node.js)
exports.handler = async (event) => {
  return { statusCode: 200, body: "Hello from Lambda" };
};
</code></pre>
<h3>API gateway &amp; 12-factor app</h3>
<p>Một <strong>API gateway</strong> là cửa trước duy nhất — định tuyến, xác thực và giới hạn nhịp cho nhiều dịch vụ phía sau. <strong>12-factor app</strong> là bảng kiểm cho thiết kế cloud-native: cấu hình nằm trong biến môi trường, tiến trình không trạng thái, log dạng luồng, và hơn thế.</p>
<div class="callout"><span class="badge">CNCF</span> <strong>Cloud Native Computing Foundation</strong> nuôi cả hệ sinh thái (Kubernetes, Prometheus, Envoy). "Cloud-native" nghĩa là được dựng để co giãn, thay thế và tự động hoá — không chỉ bê nguyên lên một VM.</div>`,
  ]]);

const c6q = quiz('clc301c-quiz-6', 'Quiz 6 — Cloud-native|||Quiz 6 — Cloud-native', [
  { id: 'q1', question: 'Đặc điểm của kiến trúc microservices so với monolith là?', options: ['Một khối duy nhất, một database chung', 'Nhiều dịch vụ nhỏ, độc lập, triển khai riêng', 'Không dùng mạng', 'Chỉ chạy trên một máy'], correctIndex: 1, explanation: 'Microservices tách thành nhiều dịch vụ nhỏ, độc lập, có DB riêng.' },
  { id: 'q2', question: 'AWS Lambda là ví dụ của mô hình nào?', options: ['IaaS', 'Serverless / FaaS', 'Máy ảo cố định', 'Lưu trữ khối'], correctIndex: 1, explanation: 'Lambda chạy hàm theo sự kiện, co về 0 khi rảnh, trả tiền theo yêu cầu → serverless/FaaS.' },
  { id: 'q3', question: 'Vai trò của API gateway là?', options: ['Lưu trữ tệp lớn', 'Cửa trước duy nhất: định tuyến, xác thực, giới hạn nhịp', 'Ảo hoá phần cứng', 'Sao lưu đĩa'], correctIndex: 1, explanation: 'API gateway đứng trước nhiều dịch vụ, lo routing/auth/rate-limit.' },
]);

const c7 = doc('clc301c-7-1-kubernetes', '7.1 — Kubernetes & orchestration|||7.1 — Kubernetes & điều phối',
  'Điều phối container là gì; Kubernetes: pod, service, deployment; tự hồi phục & co giãn; CI/CD đẩy image lên cụm.',
  [[
    `<span class="eyebrow">CLC301c · Chapter 7 · Lesson 7.1</span>
<h2>Kubernetes &amp; orchestration</h2>
<h3>Why orchestration?</h3>
<p>Running one container is easy. Running hundreds across many machines — restarting crashed ones, scaling on load, rolling out new versions with zero downtime — needs an <strong>orchestrator</strong>. <strong>Kubernetes (K8s)</strong> is the standard, and managed offerings (AWS EKS, Azure AKS, Google GKE) run the control plane for you.</p>
<h3>Core objects</h3>
<ul>
<li><strong>Pod</strong> — the smallest unit: one or more containers that run together.</li>
<li><strong>Deployment</strong> — declares "I want N replicas of this pod"; K8s keeps that true and does rolling updates.</li>
<li><strong>Service</strong> — a stable network address + load balancing across the matching pods.</li>
</ul>
<pre><code># deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: web
          image: myapp:1.0
</code></pre>
<p><code>kubectl apply -f deployment.yaml</code> and Kubernetes makes reality match the file.</p>
<h3>Self-healing &amp; CI/CD</h3>
<p>K8s is <strong>declarative</strong>: you describe the desired state, it continuously reconciles — restarting failed pods, rescheduling off dead nodes. A <strong>CI/CD</strong> pipeline builds an image, pushes it to a registry, and updates the deployment automatically.</p>
<div class="callout"><span class="badge">Declarative mindset</span> You do not run commands to "fix" the cluster — you change the desired state and let the controller converge to it.</div>`,
    `<span class="eyebrow">CLC301c · Chương 7 · Bài 7.1</span>
<h2>Kubernetes &amp; điều phối</h2>
<h3>Vì sao cần điều phối?</h3>
<p>Chạy một container thì dễ. Chạy hàng trăm cái trên nhiều máy — khởi động lại cái chết, co giãn theo tải, tung phiên bản mới không gián đoạn — cần một <strong>bộ điều phối (orchestrator)</strong>. <strong>Kubernetes (K8s)</strong> là chuẩn, và các bản managed (AWS EKS, Azure AKS, Google GKE) chạy hộ phần control plane.</p>
<h3>Các đối tượng cốt lõi</h3>
<ul>
<li><strong>Pod</strong> — đơn vị nhỏ nhất: một hoặc vài container chạy cùng nhau.</li>
<li><strong>Deployment</strong> — khai "tôi muốn N bản sao của pod này"; K8s giữ đúng như vậy và làm cập nhật cuốn chiếu.</li>
<li><strong>Service</strong> — một địa chỉ mạng ổn định + cân bằng tải qua các pod khớp nhãn.</li>
</ul>
<pre><code># deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: web
          image: myapp:1.0
</code></pre>
<p><code>kubectl apply -f deployment.yaml</code> và Kubernetes làm cho thực tế khớp với file.</p>
<h3>Tự hồi phục &amp; CI/CD</h3>
<p>K8s theo lối <strong>khai báo (declarative)</strong>: bạn mô tả trạng thái mong muốn, nó liên tục điều hoà — khởi động lại pod hỏng, dời khỏi node chết. Một chuỗi <strong>CI/CD</strong> build image, đẩy lên registry, và cập nhật deployment tự động.</p>
<div class="callout"><span class="badge">Tư duy khai báo</span> Bạn không chạy lệnh để "sửa" cụm — bạn đổi trạng thái mong muốn và để bộ điều khiển tự hội tụ về đó.</div>`,
  ]]);

const c7q = quiz('clc301c-quiz-7', 'Quiz 7 — Kubernetes|||Quiz 7 — Kubernetes', [
  { id: 'q1', question: 'Trong Kubernetes, đơn vị nhỏ nhất chứa một hoặc vài container là?', options: ['Node', 'Pod', 'Cluster', 'Image'], correctIndex: 1, explanation: 'Pod là đơn vị nhỏ nhất, gồm một hoặc vài container chạy cùng nhau.' },
  { id: 'q2', question: 'Đối tượng nào đảm bảo luôn có đúng N bản sao của pod và làm cập nhật cuốn chiếu?', options: ['Service', 'Deployment', 'Secret', 'Namespace'], correctIndex: 1, explanation: 'Deployment khai số replica mong muốn và lo rolling update.' },
  { id: 'q3', question: 'Kubernetes hoạt động theo mô hình nào?', options: ['Mệnh lệnh từng bước', 'Khai báo (declarative): mô tả trạng thái mong muốn rồi tự hội tụ', 'Chỉ chạy thủ công', 'Ngẫu nhiên'], correctIndex: 1, explanation: 'K8s declarative: bạn khai trạng thái mong muốn, controller liên tục điều hoà.' },
]);

const c8 = doc('clc301c-8-1-cost-ops-trends', '8.1 — Cost, operations & trends|||8.1 — Chi phí, vận hành & xu hướng',
  'Tối ưu chi phí (right-sizing, reserved/spot); giám sát & log (CloudWatch); DevOps & IaC (Terraform); multi-cloud, edge, serverless.',
  [[
    `<span class="eyebrow">CLC301c · Chapter 8 · Lesson 8.1</span>
<h2>Cost, operations &amp; trends</h2>
<h3>Cost optimization</h3>
<ul>
<li><strong>Right-sizing</strong> — match instance size to real usage; idle capacity is wasted money.</li>
<li><strong>Reserved / savings plans</strong> — commit to 1-3 years for a big discount on steady workloads.</li>
<li><strong>Spot instances</strong> — use spare capacity very cheaply for interruptible jobs.</li>
<li><strong>Turn things off</strong> and set budget alerts — the pay-per-use model cuts both ways.</li>
</ul>
<h3>Operations — monitoring &amp; IaC</h3>
<p><strong>Monitoring</strong> and centralized <strong>logs</strong> (AWS CloudWatch, Azure Monitor) tell you what production is doing. <strong>DevOps</strong> plus <strong>Infrastructure as Code (IaC)</strong> — <strong>Terraform</strong>, CloudFormation — define your whole environment in version-controlled files, so it is repeatable and reviewable.</p>
<pre><code># Terraform: declare one S3 bucket
resource "aws_s3_bucket" "assets" {
  bucket = "my-app-assets"
}
</code></pre>
<h3>Trends</h3>
<p><strong>Multi-cloud</strong> (spread across providers), <strong>edge computing</strong> (run near the user for low latency), and ever-more <strong>serverless</strong> and managed AI services are shaping where the cloud is heading.</p>
<div class="callout"><span class="badge">Course wrap-up</span> You now have the whole picture: models → virtualization → compute/storage/network/security → cloud-native → Kubernetes → cost &amp; ops. Next: build something small on a free tier and watch the bill.</div>`,
    `<span class="eyebrow">CLC301c · Chương 8 · Bài 8.1</span>
<h2>Chi phí, vận hành &amp; xu hướng</h2>
<h3>Tối ưu chi phí</h3>
<ul>
<li><strong>Right-sizing</strong> — chọn cỡ máy khớp mức dùng thật; năng lực để không là tiền phí phạm.</li>
<li><strong>Reserved / savings plans</strong> — cam kết 1-3 năm để giảm giá mạnh cho tải ổn định.</li>
<li><strong>Spot instances</strong> — dùng năng lực dư rất rẻ cho việc có thể gián đoạn.</li>
<li><strong>Tắt thứ không dùng</strong> và đặt cảnh báo ngân sách — trả theo mức dùng có hai mặt.</li>
</ul>
<h3>Vận hành — giám sát &amp; IaC</h3>
<p><strong>Giám sát</strong> và <strong>log</strong> tập trung (AWS CloudWatch, Azure Monitor) cho biết production đang làm gì. <strong>DevOps</strong> cộng <strong>Hạ tầng dạng mã (IaC)</strong> — <strong>Terraform</strong>, CloudFormation — mô tả cả môi trường bằng các file có quản phiên bản, nên lặp lại được và duyệt được.</p>
<pre><code># Terraform: khai một bucket S3
resource "aws_s3_bucket" "assets" {
  bucket = "my-app-assets"
}
</code></pre>
<h3>Xu hướng</h3>
<p><strong>Multi-cloud</strong> (trải trên nhiều nhà cung cấp), <strong>edge computing</strong> (chạy gần người dùng để giảm độ trễ), cùng ngày càng nhiều dịch vụ <strong>serverless</strong> và AI managed đang định hình hướng đi của đám mây.</p>
<div class="callout"><span class="badge">Kết môn</span> Giờ bạn đã có bức tranh trọn vẹn: mô hình → ảo hoá → compute/lưu trữ/mạng/bảo mật → cloud-native → Kubernetes → chi phí &amp; vận hành. Bước tiếp: dựng thử thứ nhỏ trên gói free tier và theo dõi hoá đơn.</div>`,
  ]]);

const c8q = quiz('clc301c-quiz-8', 'Quiz 8 — Cost, ops & trends|||Quiz 8 — Chi phí, vận hành & xu hướng', [
  { id: 'q1', question: 'Kỹ thuật chọn cỡ máy khớp với mức dùng thật để khỏi phí tiền gọi là?', options: ['Right-sizing', 'Sharding', 'Caching', 'Load balancing'], correctIndex: 0, explanation: 'Right-sizing = khớp cỡ instance với nhu cầu thật, tránh trả tiền cho năng lực để không.' },
  { id: 'q2', question: 'Terraform và CloudFormation là công cụ của phương pháp nào?', options: ['Hạ tầng dạng mã (IaC)', 'Ảo hoá', 'Mã hoá', 'Cân bằng tải'], correctIndex: 0, explanation: 'IaC: mô tả hạ tầng bằng file có quản phiên bản, lặp lại và duyệt được.' },
  { id: 'q3', question: 'Chạy tính toán gần người dùng để giảm độ trễ là xu hướng?', options: ['Edge computing', 'Mainframe', 'Monolith', 'Cold storage'], correctIndex: 0, explanation: 'Edge computing đưa xử lý ra gần người dùng, giảm độ trễ đường truyền.' },
]);

const taiLieu = doc('clc301c-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Erl), docs chính thức AWS/Azure/GCP, CNCF & Kubernetes, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">CLC301c · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Cloud Computing — models, virtualization, compute/storage/networking, cloud-native and Kubernetes — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, high-quality resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for CLC301c are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.google.com/search?q=Thomas+Erl+Cloud+Computing+Concepts+Technology+Architecture" target="_blank" rel="noopener"><em>Cloud Computing: Concepts, Technology &amp; Architecture</em> — Thomas Erl</a></li>
<li><a href="https://12factor.net/" target="_blank" rel="noopener"><em>The Twelve-Factor App</em> — cloud-native design checklist</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://docs.aws.amazon.com/" target="_blank" rel="noopener">AWS Documentation</a></li>
<li><a href="https://learn.microsoft.com/azure/" target="_blank" rel="noopener">Microsoft Azure Docs</a></li>
<li><a href="https://cloud.google.com/docs" target="_blank" rel="noopener">Google Cloud Documentation</a></li>
<li><a href="https://kubernetes.io/docs/home/" target="_blank" rel="noopener">Kubernetes Documentation</a> &amp; <a href="https://www.cncf.io/" target="_blank" rel="noopener">CNCF</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@freecodecamp" target="_blank" rel="noopener">freeCodeCamp</a> — full AWS/Azure/Kubernetes courses</li>
<li><a href="https://www.youtube.com/@TechWorldwithNana" target="_blank" rel="noopener">TechWorld with Nana</a> — DevOps, Docker &amp; Kubernetes</li>
</ul>
<h3>🛠️ Tools &amp; free tiers</h3>
<ul>
<li><a href="https://aws.amazon.com/free/" target="_blank" rel="noopener">AWS Free Tier</a> — try real services at no cost</li>
<li><a href="https://azure.microsoft.com/free/" target="_blank" rel="noopener">Azure Free Account</a></li>
<li><a href="https://labs.play-with-k8s.com/" target="_blank" rel="noopener">Play with Kubernetes</a> — a K8s cluster in the browser</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — NIST definition, IaaS/PaaS/SaaS, deployment models, virtualization vs containers.</li>
<li><strong>Practice</strong> — open a free tier, launch a VM, create an S3 bucket, run a Docker container.</li>
<li><strong>Go deeper</strong> — VPC &amp; IAM, cloud-native design, deploy to Kubernetes.</li>
<li><strong>Job-ready</strong> — learn IaC (Terraform), CI/CD and cost/monitoring; aim for a cloud certification.</li>
</ol></div>`,
    `<span class="eyebrow">CLC301c · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Điện toán đám mây — mô hình, ảo hoá, compute/lưu trữ/mạng, cloud-native và Kubernetes — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, chất lượng cao.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của CLC301c có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.google.com/search?q=Thomas+Erl+Cloud+Computing+Concepts+Technology+Architecture" target="_blank" rel="noopener"><em>Cloud Computing: Concepts, Technology &amp; Architecture</em> — Thomas Erl</a></li>
<li><a href="https://12factor.net/" target="_blank" rel="noopener"><em>The Twelve-Factor App</em> — bảng kiểm thiết kế cloud-native</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://docs.aws.amazon.com/" target="_blank" rel="noopener">Tài liệu AWS</a></li>
<li><a href="https://learn.microsoft.com/azure/" target="_blank" rel="noopener">Tài liệu Microsoft Azure</a></li>
<li><a href="https://cloud.google.com/docs" target="_blank" rel="noopener">Tài liệu Google Cloud</a></li>
<li><a href="https://kubernetes.io/docs/home/" target="_blank" rel="noopener">Tài liệu Kubernetes</a> &amp; <a href="https://www.cncf.io/" target="_blank" rel="noopener">CNCF</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@freecodecamp" target="_blank" rel="noopener">freeCodeCamp</a> — khoá đầy đủ AWS/Azure/Kubernetes</li>
<li><a href="https://www.youtube.com/@TechWorldwithNana" target="_blank" rel="noopener">TechWorld with Nana</a> — DevOps, Docker &amp; Kubernetes</li>
</ul>
<h3>🛠️ Công cụ &amp; gói miễn phí</h3>
<ul>
<li><a href="https://aws.amazon.com/free/" target="_blank" rel="noopener">AWS Free Tier</a> — thử dịch vụ thật miễn phí</li>
<li><a href="https://azure.microsoft.com/free/" target="_blank" rel="noopener">Azure Free Account</a></li>
<li><a href="https://labs.play-with-k8s.com/" target="_blank" rel="noopener">Play with Kubernetes</a> — một cụm K8s ngay trên trình duyệt</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — định nghĩa NIST, IaaS/PaaS/SaaS, mô hình triển khai, ảo hoá so với container.</li>
<li><strong>Luyện tập</strong> — mở gói free tier, dựng một VM, tạo bucket S3, chạy một container Docker.</li>
<li><strong>Đào sâu</strong> — VPC &amp; IAM, thiết kế cloud-native, triển khai lên Kubernetes.</li>
<li><strong>Sẵn sàng đi làm</strong> — học IaC (Terraform), CI/CD và chi phí/giám sát; nhắm một chứng chỉ cloud.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'CLC301c',
    slug: 'clc301c-cloud-computing',
    title: 'Cloud Computing',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/CLC301c.webp',
    shortDescription: 'How the cloud works — NIST model, IaaS/PaaS/SaaS & deployment models, virtualization & containers (Docker), compute, storage, networking & IAM, cloud-native, Kubernetes, cost & ops. AWS/Azure/GCP examples, bilingual, quizzes.|||Đám mây hoạt động thế nào — mô hình NIST, IaaS/PaaS/SaaS & mô hình triển khai, ảo hoá & container (Docker), compute, lưu trữ, mạng & IAM, cloud-native, Kubernetes, chi phí & vận hành. Ví dụ AWS/Azure/GCP, song ngữ, có quiz.',
    description: 'Môn <strong>CLC301c — Cloud Computing (Điện toán đám mây)</strong> (kỳ 7, ngành Khoa học Máy tính) giúp hiểu <strong>đám mây thật sự hoạt động thế nào</strong>. Từ <strong>nền tảng &amp; mô hình</strong> (định nghĩa NIST, IaaS/PaaS/SaaS, public/private/hybrid) → <strong>ảo hoá &amp; container</strong> (VM, hypervisor, Docker) → <strong>compute, lưu trữ, mạng &amp; bảo mật</strong> (EC2/S3, VPC, IAM) → <strong>cloud-native, Kubernetes, chi phí &amp; vận hành</strong>. Bám sách chuẩn của Thomas Erl và docs chính thức AWS/Azure/GCP, song ngữ, có ví dụ thật và quiz mỗi chương.',
    whatYouLearn: 'Định nghĩa NIST &amp; 5 đặc điểm; IaaS/PaaS/SaaS và public/private/hybrid/multi-cloud; ảo hoá, hypervisor, VM so với container, Docker; compute (EC2/VM, auto scaling), lưu trữ (object/block/file, S3), database managed; VPC, load balancer, IAM (đặc quyền tối thiểu), mã hoá &amp; chia sẻ trách nhiệm; microservices, serverless (Lambda), API gateway, 12-factor; Kubernetes (pod/service/deployment), CI/CD; tối ưu chi phí, giám sát, IaC (Terraform), multi-cloud &amp; edge.',
    requirements: 'Kiến thức mạng máy tính &amp; hệ điều hành cơ bản; biết dùng dòng lệnh (Linux). Nên có một tài khoản free tier (AWS/Azure/GCP) để thực hành.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách Erl, docs AWS/Azure/GCP, CNCF/K8s, YouTube, công cụ.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Đám mây là gì, vì sao thắng, lộ trình 4 bước.', lessons: [intro] },
    { title: 'Chương 1 — Đám mây là gì|||Chapter 1 — What is cloud', description: 'Định nghĩa NIST, 5 đặc điểm, on-prem vs cloud, lịch sử.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Mô hình dịch vụ & triển khai|||Chapter 2 — Service & deployment models', description: 'IaaS/PaaS/SaaS; public/private/hybrid/multi-cloud.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Ảo hoá & container|||Chapter 3 — Virtualization & containers', description: 'Hypervisor, VM, container, Docker.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Điện toán & lưu trữ|||Chapter 4 — Compute & storage', description: 'EC2/VM, S3/blob, database managed.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Mạng & bảo mật|||Chapter 5 — Networking & security', description: 'VPC, load balancer, IAM, mã hoá, chia sẻ trách nhiệm.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Kiến trúc cloud-native|||Chapter 6 — Cloud-native architecture', description: 'Microservices, serverless/Lambda, API gateway, 12-factor.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Kubernetes & điều phối|||Chapter 7 — Kubernetes & orchestration', description: 'Pod/service/deployment, tự hồi phục, CI/CD.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Chi phí, vận hành & xu hướng|||Chapter 8 — Cost, ops & trends', description: 'Tối ưu chi phí, giám sát, DevOps/IaC, multi-cloud, edge.', lessons: [c8, c8q] },
  ],
};
